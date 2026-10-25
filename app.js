// app.js — 匹配引擎 + 渲染管线 + 交互（零依赖）
const $ = id => document.getElementById(id);
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const SCALE = 2; // 导出 @2x

let state = {
  hits: [], sceneIdx: 0, tplIdx: 0, varIdx: 0,
  curScene: null, curVariant: null, curEvidence: null, curTpl: null,
};

// ---------- localStorage ----------
function lsGet(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } }
function bumpStats() {
  const s = lsGet('fz_stats', { generated: 0 });
  s.generated += 1;
  try { localStorage.setItem('fz_stats', JSON.stringify(s)); } catch {}
}
function pushHistory(input, sceneId, tplId) {
  const h = lsGet('fz_history', []);
  h.unshift({ ts: Date.now(), input, sceneId, tplId });
  try { localStorage.setItem('fz_history', JSON.stringify(h.slice(0, 20))); } catch {}
}

// ---------- 匹配引擎 ----------
// 药品/保健字根：未命中具体实锤场景时，优先出"自查工具卡"——
// 老人觉得"我买的这个不一样"，攻击产品只会触发逆火；给鉴别动作，让结论他自己得出。
const MEDICINE_ROOTS = ['神药', '保健品', '药', '胶囊', '口服液', '理疗', '针灸', '艾灸', '秘方', '偏方'];
function matchScenes(input) {
  const q = input.trim().toLowerCase().replace(/[\s，。！？、,.!?]/g, '');
  if (!q) return [];
  const hits = DB
    .filter(r => r.verified)
    .map(rec => {
      let score = 0;
      for (const k of rec.keywords.exact) if (q.includes(k)) score += 10;
      for (const k of rec.keywords.fuzzy) if (q.includes(k)) score = Math.max(score, 6);
      return { rec, score };
    })
    .filter(s => s.score >= 6)
    .sort((a, b) => b.score - a.score);
  if (hits.length) return hits;
  // 药品字根兜底 → 自查卡
  if (MEDICINE_ROOTS.some(r => q.includes(r))) return [{ rec: SELFCHECK, score: 5 }];
  return [];
}

// ---------- 渲染管线（纯函数：同输入同图） ----------
function buildCard(scene, tpl, variant) {
  const ev = variant.steps ? SELFCHECK.evidence
    : (variant === 'FALLBACK' ? FALLBACK.evidence : scene.evidence);
  const v = variant === 'FALLBACK'
    ? { sticker: FALLBACK.sticker, title: FALLBACK.title, money: null, shock: FALLBACK.rules.join(' · ') }
    : variant;
  canvas.width = 750 * SCALE; canvas.height = tpl.H * SCALE;
  ctx.scale(SCALE, SCALE);
  ctx.textBaseline = 'middle';
  tpl.draw(ctx, v, ev);
  return canvas.toDataURL('image/png');
}

function render() {
  const { curScene, curTpl } = state;
  if (!curScene || !curTpl) return;
  const isFallback = curScene.id === 'fallback-3rules';
  const isSelfCheck = curScene.id === SELFCHECK.id;
  let variant, ev;
  if (isFallback) {
    variant = { sticker: FALLBACK.sticker, title: FALLBACK.title, money: null, shock: FALLBACK.rules.join(' · ') };
    ev = FALLBACK.evidence;
  } else if (isSelfCheck) {
    variant = { sticker: SELFCHECK.sticker, title: SELFCHECK.title, money: null, shock: null, steps: SELFCHECK.steps, redFlags: SELFCHECK.redFlags, siteUrl: SELFCHECK.siteUrl };
    ev = SELFCHECK.evidence;
  } else {
    variant = curScene.variants[state.varIdx % curScene.variants.length];
    ev = curScene.evidence;
  }
  state.curVariant = variant;
  state.curEvidence = ev;

  $('card-img').src = buildCard(curScene, curTpl, variant);
  $('tpl-name').textContent = `版式 ${state.tplIdx + 1}/${TEMPLATES.length}：${curTpl.name}`;
  const gen = lsGet('fz_stats', { generated: 0 }).generated;
  $('stat-line').textContent = gen > 0 ? `本机已生成 ${gen} 张 · 数据不出手机` : '';
  const multiTpl = !isFallback;
  $('btn-prev').classList.toggle('hidden', !multiTpl);
  $('btn-next').classList.toggle('hidden', !multiTpl);
  $('btn-variant').classList.toggle('hidden', isFallback || isSelfCheck || (curScene.variants && curScene.variants.length < 2));
  $('ev-detail').classList.remove('hidden');
  $('ev-body').innerHTML = ev.refUrl
    ? `<b>${ev.org}</b> ${ev.docType} ${ev.date || ''} ${ev.charge || ''} ${ev.sentence || ''}<br><a href="${ev.refUrl}" target="_blank" rel="noopener">点开官方渠道核验</a>`
    : `<b>${ev.org}</b> ${ev.docType} ${ev.date || ''} ${ev.charge || ''} ${ev.sentence || ''}<br>搜索「${ev.org} + ${(curScene.scene || '反诈')}」可查证`;
  let soft = isFallback ? FALLBACK.softScript : (curScene.softScript || '');
  if (isSelfCheck && SELFCHECK.counterArgs) {
    soft += '<br><br><b>老人说"我这个不一样"，你可以这样接：</b><br>' +
      SELFCHECK.counterArgs.map(c => `「${c.arg}」→ ${c.reply}`).join('<br>');
  }
  $('soft-body').innerHTML = `温柔话术（可选）：${soft}`;
}

function loadScene(scene) {
  state.curScene = scene;
  state.varIdx = 0;
  render();
  bumpStats();
  pushHistory($('q').value.trim(), scene.id, state.curTpl.id);
}

// ---------- 交互 ----------
function showHits(hits) {
  state.hits = hits; state.sceneIdx = 0;
  const tabs = $('hit-tabs');
  tabs.innerHTML = '';
  if (hits.length > 1) {
    tabs.classList.remove('hidden');
    hits.forEach((h, i) => {
      const b = document.createElement('button');
      b.className = 'hit-tab' + (i === 0 ? ' on' : '');
      b.textContent = h.rec.scene;
      b.onclick = () => {
        state.sceneIdx = i;
        tabs.querySelectorAll('.hit-tab').forEach(t => t.classList.remove('on'));
        b.classList.add('on');
        loadScene(h.rec);
      };
      tabs.appendChild(b);
    });
  } else tabs.classList.add('hidden');
  loadScene(hits[0].rec);
}

function noHit() {
  showTabsClear();
  toast(`没找到「${$('q').value.trim()}」先看通用防骗三条`);
  const fb = { id: 'fallback-3rules', scene: FALLBACK.scene, softScript: FALLBACK.softScript };
  loadScene(fb);
}
function showTabsClear() { $('hit-tabs').classList.add('hidden'); $('hit-tabs').innerHTML = ''; }

function go() {
  const q = $('q').value.trim();
  const hits = matchScenes(q);
  if (hits.length) showHits(hits);
  else if (q) noHit();
}

// ---------- 保存 / 复制（分环境） ----------
const isWeChat = /MicroMessenger/i.test(navigator.userAgent);
$('btn-save').onclick = () => {
  if (isWeChat) {
    $('save-hint').style.display = 'block';
    toast('微信内请长按图片保存');
  } else {
    canvas.toBlob(blob => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `反诈大字报-${state.curScene.scene || '通用'}.png`;
      a.click();
      URL.revokeObjectURL(a.href);
      toast('已保存');
    });
  }
};
$('btn-copy').onclick = () => {
  const ev = state.curEvidence;
  const soft = state.curScene.id === 'fallback-3rules' ? FALLBACK.softScript : (state.curScene.softScript || '');
  const text = `${soft}（依据：${ev.org} ${ev.docType} ${ev.date || ''}，以官方发布为准）`;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => toast('话术已复制'), () => fallbackCopy(text));
  } else fallbackCopy(text);
};
function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
  document.body.appendChild(ta); ta.select();
  try { document.execCommand('copy'); toast('话术已复制'); } catch { toast('复制失败，请长按手动复制'); }
  document.body.removeChild(ta);
}
function toast(msg) {
  const t = $('toast');
  t.textContent = msg; t.style.display = 'block';
  setTimeout(() => { t.style.display = 'none'; }, 1800);
}

// ---------- 初始化 ----------
function initChips() {
  const words = ['床垫', '鸡蛋', '神药', '评书机', '刷单', '网课', '名医'];
  const box = $('chips');
  words.forEach(w => {
    const b = document.createElement('button');
    b.className = 'chip'; b.textContent = w;
    b.onclick = () => { $('q').value = w; go(); };
    box.appendChild(b);
  });
}
function initCatalog() {
  const box = $('catalog');
  CATEGORIES.forEach(cat => {
    const scenes = DB.filter(r => r.category === cat.id);
    const div = document.createElement('div');
    div.className = 'cat-item';
    const lines = scenes.map(s =>
      s.verified
        ? `${s.scene}`
        : `<span style="color:#854F0B">${s.scene}（核验中）</span>`
    ).join('、');
    div.innerHTML = `<b>${cat.name}</b>${lines}`;
    box.appendChild(div);
  });
  $('all-toggle').onclick = () => {
    box.classList.toggle('hidden');
    $('all-toggle').textContent = box.classList.contains('hidden') ? '▸ 全部场景（18 类）' : '▾ 全部场景（18 类）';
  };
}
function initTplNav() {
  $('btn-prev').onclick = () => {
    state.tplIdx = (state.tplIdx - 1 + TEMPLATES.length) % TEMPLATES.length;
    state.curTpl = TEMPLATES[state.tplIdx]; render();
  };
  $('btn-next').onclick = () => {
    state.tplIdx = (state.tplIdx + 1) % TEMPLATES.length;
    state.curTpl = TEMPLATES[state.tplIdx]; render();
  };
  $('btn-variant').onclick = () => {
    if (!state.curScene) return;
    state.varIdx = (state.varIdx + 1) % state.curScene.variants.length;
    render();
  };
}

state.curTpl = TEMPLATES[0]; state.tplIdx = 0;
initChips(); initCatalog(); initTplNav();
$('btn-go').onclick = go;
$('q').addEventListener('keydown', e => { if (e.key === 'Enter') go(); });

// 首屏默认示例卡：量子床垫（评审 3 秒看懂）
(function boot() {
  const demo = DB.find(r => r.id === 'quantum-mattress');
  state.curScene = demo; state.varIdx = 0;
  render();
})();
