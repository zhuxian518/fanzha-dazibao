// templates.js — 反诈大字报 6 套版式（Canvas 2D，零外部资源）
// 逻辑尺寸 750×1056（notice 版 900），导出 @2x。
// 合规红线：不仿任何官方徽记/公章；"红章"是倾斜文字框，落款一律"来源引用"措辞。

const W = 750, H = 1056, H_NOTICE = 900;

// ---------- 共用原语 ----------
const NO_LINE_START = '，。！？、；：）】」』"”’%!?)'; // 避头尾：这些字符不落行首
function wrapText(ctx, text, x, y, maxW, lineH, font, color, strokeColor, strokeW) {
  ctx.font = font;
  let chars = [...text], lines = [], line = '';
  for (let i = 0; i < chars.length; i++) {
    const test = line + chars[i];
    if (ctx.measureText(test).width > maxW && line) {
      // 避头尾：当前字符是标点则一并留在本行
      if (NO_LINE_START.includes(chars[i])) { line += chars[i]; continue; }
      lines.push(line); line = chars[i];
    } else line = test;
  }
  if (line) lines.push(line);
  let yy = y;
  for (const l of lines) { drawLine(ctx, l, x, yy, color, strokeColor, strokeW); yy += lineH; }
  return yy;
}
function drawLine(ctx, text, x, y, color, strokeColor, strokeW) {
  ctx.textAlign = 'center';
  if (strokeW) { ctx.strokeStyle = strokeColor; ctx.lineWidth = strokeW; ctx.lineJoin = 'round'; ctx.strokeText(text, x, y); }
  ctx.fillStyle = color; ctx.fillText(text, x, y);
}
// 单行自动缩字：超宽逐级降字号（最小 14px），保证证据长文永不溢出
function fitLine(ctx, text, x, y, maxW, baseSize, color, weight = '900') {
  let size = baseSize;
  ctx.font = `${weight} ${size}px system-ui, sans-serif`;
  while (ctx.measureText(text).width > maxW && size > 14) {
    size -= 1;
    ctx.font = `${weight} ${size}px system-ui, sans-serif`;
  }
  ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y);
  return size;
}
function drawStarburst(ctx, cx, cy, r, fill, points = 14) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const rad = i % 2 === 0 ? r : r * 0.82;
    const a = (Math.PI * i) / points;
    const px = cx + rad * Math.cos(a), py = cy + rad * Math.sin(a) * 0.72;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
}
function drawRays(ctx, cx, cy, color, count = 24) {
  ctx.save(); ctx.globalAlpha = 0.10; ctx.strokeStyle = color; ctx.lineWidth = 10;
  for (let i = 0; i < count; i++) {
    const a = (Math.PI * 2 * i) / count;
    ctx.beginPath(); ctx.moveTo(cx + 60 * Math.cos(a), cy + 60 * Math.sin(a));
    ctx.lineTo(cx + 620 * Math.cos(a), cy + 620 * Math.sin(a)); ctx.stroke();
  }
  ctx.restore();
}
function drawBanner(ctx, text, y, bg, fg, fontSize) {
  const bw = 620, bh = fontSize + 36;
  ctx.font = `900 ${fontSize}px system-ui, sans-serif`;
  // 自动缩字：超宽就降字号，防裁切
  while (ctx.measureText(text).width > bw - 30 && fontSize > 16) {
    fontSize -= 2;
    ctx.font = `900 ${fontSize}px system-ui, sans-serif`;
  }
  ctx.fillStyle = bg; ctx.fillRect(65, y, bw, bh);
  ctx.fillStyle = fg; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(text, 375, y + bh / 2 + 2);
  return y + bh;
}
function drawTag(ctx, text, x, y, bg, fg) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(-0.10);
  ctx.font = '900 24px system-ui, sans-serif';
  const w = ctx.measureText(text).width + 32;
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, 44);
  ctx.fillStyle = fg; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillText(text, 16, 23);
  ctx.restore();
}
function drawStamp(ctx, text, cx, cy, color) {
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(-0.14);
  ctx.font = '900 34px system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const w = ctx.measureText(text).width + 44;
  ctx.strokeStyle = color; ctx.lineWidth = 5; ctx.strokeRect(-w / 2, -30, w, 60);
  ctx.fillStyle = color; ctx.globalAlpha = 0.9; ctx.fillText(text, 0, 0);
  ctx.restore();
}
function drawPriceTag(ctx, cost, sell, y) {
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  if (cost) {
    ctx.font = '900 44px system-ui, sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(`成本 ${cost}`, 195, y);
    const w = ctx.measureText(`成本 ${cost}`).width;
    ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(195 - w / 2 - 6, y - 26); ctx.lineTo(195 + w / 2 + 6, y - 26); ctx.stroke();
  }
  ctx.font = '900 64px system-ui, sans-serif';
  ctx.fillStyle = '#FFD700'; ctx.strokeStyle = '#7A0B0B'; ctx.lineWidth = 8; ctx.lineJoin = 'round';
  ctx.strokeText(`卖 ${sell}`, 520, y); ctx.fillText(`卖 ${sell}`, 520, y);
}
function drawFooter(ctx, evidence, y) {
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.font = '400 18px system-ui, sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('本卡片为公开信息聚合展示 · 具体案件以官方发布为准', 375, y);
  ctx.fillText('遇诈骗请拨 96110', 375, y + 28);
}

// ---------- 版式 1：紧急曝光版（红底金字大字报，默认） ----------
function drawRedBurst(ctx, v, ev) {
  ctx.fillStyle = '#B01111'; ctx.fillRect(0, 0, W, H);
  drawRays(ctx, 375, 300, '#FFD700');
  ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 8; ctx.strokeRect(18, 18, W - 36, H - 36);
  ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 3; ctx.strokeRect(34, 34, W - 68, H - 68);
  drawStarburst(ctx, 375, 150, 110, '#FFD700');
  ctx.fillStyle = '#B01111'; ctx.font = '900 42px system-ui, sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(v.sticker, 375, 150);
  wrapText(ctx, v.title, 375, 330, 600, 88, '900 58px system-ui, sans-serif', '#FFD700', '#5E0505', 8);
  ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(90, 500); ctx.lineTo(660, 500); ctx.stroke();
  if (v.money) drawPriceTag(ctx, v.money.cost, v.money.sell, 580);
  if (v.shock) drawBanner(ctx, v.shock, 655, '#FFFFFF', '#B01111', 36);
  ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 2; ctx.strokeRect(90, 750, 570, 150);
  fitLine(ctx, `来源：${ev.org}`, 375, 786, 540, 28, '#FFD700');
  // 第二行可能仍是长串 → fitLine 缩字，仍在框内
  fitLine(ctx, `${ev.docType} ${ev.date || ''} · ${ev.charge} · ${ev.sentence}`, 375, 838, 540, 24, '#FFFFFF');
  ctx.fillStyle = '#FFEDB0'; ctx.font = '400 18px system-ui, sans-serif';
  ctx.fillText('搜索来源单位可查证', 375, 878);
  drawTag(ctx, '转发家族群', 520, 40, '#7A0B0B', '#FFD700');
  drawFooter(ctx, ev, 960);
}

// ---------- 版式 2：新闻通报版（黑底白字媒体风） ----------
function drawBlackGold(ctx, v, ev) {
  ctx.fillStyle = '#1A1A1A'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#E24B4A'; ctx.fillRect(0, 60, W, 90);
  ctx.fillStyle = '#FFFFFF'; ctx.font = '900 52px system-ui, sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(`【${v.sticker}】`, 375, 105);
  wrapText(ctx, v.title, 375, 260, 620, 88, '900 58px system-ui, sans-serif', '#FFFFFF', '#E24B4A', 6);
  if (v.money) {
    ctx.font = '900 56px system-ui, sans-serif'; ctx.fillStyle = '#E24B4A';
    ctx.fillText(`成本 ${v.money.cost} → 卖 ${v.money.sell}`, 375, 500);
  }
  if (v.shock) drawBanner(ctx, v.shock, 580, '#E24B4A', '#FFFFFF', 36);
  ctx.fillStyle = '#2E2E2E'; ctx.fillRect(75, 710, 600, 160);
  ctx.strokeStyle = '#E24B4A'; ctx.lineWidth = 2; ctx.strokeRect(75, 710, 600, 160);
  fitLine(ctx, `信源：${ev.org}`, 375, 755, 570, 26, '#E24B4A');
  fitLine(ctx, `${ev.docType} ${ev.date || ''}`, 375, 800, 570, 24, '#CCCCCC');
  fitLine(ctx, `${ev.charge} ${ev.sentence}`, 375, 842, 570, 24, '#CCCCCC');
  drawFooter(ctx, ev, 960);
}

// ---------- 版式 3：社区告示版（纸底红字通知风） ----------
function drawNotice(ctx, v, ev) {
  const h = H_NOTICE;
  ctx.fillStyle = '#F7F3E8'; ctx.fillRect(0, 0, W, h);
  ctx.fillStyle = '#A32D2D'; ctx.font = '900 30px system-ui, sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('—— 反诈提示 ——', 375, 90);
  ctx.strokeStyle = '#A32D2D'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(60, 130); ctx.lineTo(690, 130); ctx.stroke();
  wrapText(ctx, `「${v.title}」`, 375, 230, 600, 90, '900 60px system-ui, sans-serif', '#A32D2D', null, 0);
  if (v.money) {
    ctx.font = '900 50px system-ui, sans-serif'; ctx.fillStyle = '#333333';
    ctx.fillText(`成本 ${v.money.cost}  卖到 ${v.money.sell}`, 375, 470);
  }
  if (v.shock) {
    ctx.font = '500 38px system-ui, sans-serif'; ctx.fillStyle = '#333333';
    wrapText(ctx, v.shock, 375, 550, 580, 56, '500 38px system-ui, sans-serif', '#333333', null, 0);
  }
  ctx.font = '500 28px system-ui, sans-serif'; ctx.fillStyle = '#555555';
  ctx.fillText(`信息来源：${ev.org}`, 375, 700);
  ctx.fillText(`${ev.docType} ${ev.date || ''} ${ev.charge}`, 375, 745);
  drawStamp(ctx, v.sticker, 590, 800, '#A32D2D');
  ctx.fillStyle = '#888888'; ctx.font = '400 18px system-ui, sans-serif';
  ctx.fillText('本卡片为公开信息聚合展示 · 以官方发布为准 · 遇诈请拨 96110', 375, 855);
}

// ---------- 版式 4：惊爆价格版（促销传单语法说反话） ----------
function drawPriceExplo(ctx, v, ev) {
  ctx.fillStyle = '#FFC93C'; ctx.fillRect(0, 0, W, H);
  drawRays(ctx, 375, 420, '#D42B2B');
  drawStarburst(ctx, 375, 140, 120, '#D42B2B');
  ctx.fillStyle = '#FFFFFF'; ctx.font = '900 42px system-ui, sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(v.sticker, 375, 140);
  wrapText(ctx, v.title, 375, 330, 620, 96, '900 68px system-ui, sans-serif', '#D42B2B', '#5A0F0F', 8);
  if (v.money) {
    drawStarburst(ctx, 375, 590, 150, '#D42B2B', 16);
    ctx.font = '900 40px system-ui, sans-serif'; ctx.fillStyle = '#FFC93C';
    ctx.fillText(`成本 ${v.money.cost}`, 375, 550);
    ctx.font = '900 76px system-ui, sans-serif'; ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#5A0F0F'; ctx.lineWidth = 8; ctx.lineJoin = 'round';
    ctx.strokeText(`卖 ${v.money.sell}`, 375, 620); ctx.fillText(`卖 ${v.money.sell}`, 375, 620);
    ctx.font = '900 34px system-ui, sans-serif'; ctx.fillStyle = '#5A0F0F';
    ctx.fillText('不是促销！是判决书上的数字', 375, 760);
  }
  if (v.shock) drawBanner(ctx, v.shock, 800, '#5A0F0F', '#FFD700', 34);
  ctx.fillStyle = '#5A0F0F'; ctx.font = '900 26px system-ui, sans-serif';
  ctx.fillText(`来源：${ev.org} ${ev.docType}`, 375, 900);
  ctx.font = '400 18px system-ui, sans-serif'; ctx.fillStyle = '#5A0F0F';
  ctx.fillText('公开信息聚合展示 · 以官方发布为准 · 96110', 375, 985);
}

// ---------- 版式 5：神医圣手版（仿神药广告的形，装查处的实） ----------
function drawHealthWor(ctx, v, ev) {
  ctx.fillStyle = '#FBF6EA'; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = '#8C1F1F'; ctx.lineWidth = 6; ctx.strokeRect(14, 14, W - 28, H - 28);
  ctx.fillStyle = '#8C1F1F'; ctx.fillRect(0, 40, W, 110);
  ctx.fillStyle = '#FBF6EA'; ctx.font = '900 48px system-ui, sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('神药已被查处', 375, 95);
  wrapText(ctx, v.title, 375, 280, 600, 90, '900 60px system-ui, sans-serif', '#8C1F1F', null, 0);
  ctx.font = '900 40px system-ui, sans-serif'; ctx.fillStyle = '#333333';
  ctx.fillText('说好的"根治"呢？', 375, 460);
  if (v.money) {
    ctx.font = '900 44px system-ui, sans-serif'; ctx.fillStyle = '#8C1F1F';
    ctx.fillText(`成本 ${v.money.cost} 的东西，卖你 ${v.money.sell}`, 375, 560);
  }
  if (v.shock) drawBanner(ctx, v.shock, 640, '#8C1F1F', '#FFFFFF', 34);
  drawStamp(ctx, '已判刑', 580, 790, '#8C1F1F');
  ctx.fillStyle = '#333333'; ctx.font = '500 26px system-ui, sans-serif';
  ctx.fillText(`案件来源：${ev.org}`, 375, 880);
  ctx.font = '400 18px system-ui, sans-serif'; ctx.fillStyle = '#777777';
  ctx.fillText(`${ev.docType} ${ev.date || ''} · 公开信息聚合 · 以官方发布为准`, 375, 985);
}

// ---------- 版式 6：警方通告版（小区提示单风格，蓝白） ----------
function drawPoliceAdm(ctx, v, ev) {
  ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = '#1D4E89'; ctx.lineWidth = 6; ctx.strokeRect(16, 16, W - 32, H - 32);
  ctx.fillStyle = '#1D4E89'; ctx.fillRect(16, 16, W - 32, 130);
  drawStarburst(ctx, 80, 81, 36, '#FFFFFF', 10);
  ctx.fillStyle = '#1D4E89'; ctx.font = '900 46px system-ui, sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('反诈提示', 400, 81);
  wrapText(ctx, v.title, 375, 270, 600, 84, '900 56px system-ui, sans-serif', '#C22B2B', null, 0);
  if (v.money) {
    ctx.font = '900 48px system-ui, sans-serif'; ctx.fillStyle = '#1D4E89';
    ctx.fillText(`涉案：成本 ${v.money.cost} 卖 ${v.money.sell}`, 375, 490);
  }
  if (v.shock) {
    ctx.fillStyle = '#333333'; ctx.font = '500 36px system-ui, sans-serif';
    wrapText(ctx, v.shock, 375, 590, 580, 54, '500 36px system-ui, sans-serif', '#333333', null, 0);
  }
  ctx.fillStyle = '#F0F4F9'; ctx.fillRect(75, 700, 600, 150);
  ctx.strokeStyle = '#1D4E89'; ctx.lineWidth = 2; ctx.strokeRect(75, 700, 600, 150);
  ctx.fillStyle = '#1D4E89'; ctx.font = '900 28px system-ui, sans-serif';
  ctx.fillText(`信息来源：${ev.org}`, 375, 745);
  ctx.fillStyle = '#444444'; ctx.font = '400 24px system-ui, sans-serif';
  ctx.fillText(`${ev.docType} ${ev.date || ''} ${ev.charge} ${ev.sentence}`, 375, 795);
  ctx.font = '400 20px system-ui, sans-serif'; ctx.fillStyle = '#888888';
  ctx.fillText('转发家族群 · 遇诈骗请拨 96110', 375, 900);
  ctx.fillText('本卡片为公开信息聚合展示，非任何机关公文', 375, 970);
}

// ---------- 版式 7：自查工具版（不攻击产品，给鉴别动作——应对"我买的不是假药"心理） ----------
function drawSelfCheck(ctx, sc, ev) {
  ctx.fillStyle = '#F0F6F0'; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = '#1D6E4E'; ctx.lineWidth = 6; ctx.strokeRect(14, 14, W - 28, H - 28);
  ctx.fillStyle = '#1D6E4E'; ctx.fillRect(14, 14, W - 28, 120);
  ctx.fillStyle = '#FFFFFF'; ctx.font = '900 50px system-ui, sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(sc.sticker, 375, 74);
  wrapText(ctx, sc.title, 375, 230, 620, 84, '900 56px system-ui, sans-serif', '#1D4E3A', null, 0);
  const steps = sc.steps || [];
  let yy = 380;
  steps.forEach((s, i) => {
    ctx.fillStyle = '#1D6E4E';
    ctx.beginPath(); ctx.arc(110, yy, 34, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#FFFFFF'; ctx.font = '900 36px system-ui, sans-serif';
    ctx.fillText(String(i + 1), 110, yy);
    ctx.font = '500 30px system-ui, sans-serif';
    wrapText(ctx, s, 430, yy - 8, 480, 42, '500 30px system-ui, sans-serif', '#222222', null, 0);
    yy += 130;
  });
  if (sc.redFlags) drawBanner(ctx, sc.redFlags, yy + 10, '#8C1F1F', '#FFFFFF', 28);
  ctx.fillStyle = '#1D6E4E'; ctx.font = '900 30px system-ui, sans-serif';
  ctx.fillText(`官方查询：${sc.siteUrl || '国家药监局官网'}`, 375, yy + 130);
  ctx.font = '500 24px system-ui, sans-serif'; ctx.fillStyle = '#1D6E4E';
  ctx.fillText('（可截图发给家人，一起核对）', 375, yy + 168);
  ctx.font = '400 20px system-ui, sans-serif'; ctx.fillStyle = '#555555';
  ctx.fillText('本卡不评判任何具体产品，仅提供官方核查方法 · 遇诈拨 96110', 375, yy + 215);
}

const TEMPLATES = [
  { id: 'redburst',   name: '紧急曝光版', H: H,        draw: drawRedBurst   },
  { id: 'priceexplo', name: '惊爆价格版', H: H,        draw: drawPriceExplo },
  { id: 'blackgold',  name: '新闻通报版', H: H,        draw: drawBlackGold  },
  { id: 'healthwor',  name: '神医圣手版', H: H,        draw: drawHealthWor  },
  { id: 'policeadm',  name: '警方通告版', H: H,        draw: drawPoliceAdm  },
  { id: 'notice',     name: '社区告示版', H: H_NOTICE, draw: drawNotice     },
  { id: 'selfcheck',  name: '自查工具版', H: H,        draw: drawSelfCheck  },
];
