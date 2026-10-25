// 本地全链路测试：模拟浏览器三脚本同 context 加载，验证"保健品"等输入的匹配与渲染
// 用法：node test-local.js
const fs = require('fs');
const vm = require('vm');
const { createCanvas, GlobalFonts } = require('@napi-rs/canvas');
GlobalFonts.registerFromPath('C:/Windows/Fonts/msyh.ttc', 'system-ui');

const ctx = vm.createContext({
  console, setTimeout,
  document: {
    getElementById: () => ({
      classList: { toggle() {}, add() {}, remove() {} },
      addEventListener() {}, appendChild() {},
      querySelectorAll: () => [],
      innerHTML: '', textContent: '', style: {}, onclick: null,
    }),
    createElement: () => {
      const realCanvas = createCanvas(1500, 2112);
      const c = realCanvas.getContext('2d');
      c.canvas = { toDataURL: (...a) => realCanvas.toDataURL(...a) };
      return {
        getContext: () => c,
        classList: { add() {}, toggle() {} },
        addEventListener() {}, appendChild() {}, style: {}, onclick: null,
      };
    },
    body: { appendChild() {}, removeChild() {} },
  },
  localStorage: { getItem: () => null, setItem() {} },
  navigator: { userAgent: 'test' },
});

try {
  vm.runInContext(fs.readFileSync('data.js', 'utf8'), ctx, { filename: 'data.js' });
  vm.runInContext(fs.readFileSync('templates.js', 'utf8'), ctx, { filename: 'templates.js' });
  vm.runInContext(fs.readFileSync('app.js', 'utf8'), ctx, { filename: 'app.js' });
  console.log('三个脚本同 context 加载 OK');
} catch (e) {
  console.log('LOAD ERROR:', e.message);
  process.exit(1);
}

const tests = ['保健品', '神药', '床垫', '鸡蛋', '刷单', '原始股', '三七粉抗癌', 'iphone'];
for (const t of tests) {
  const hits = vm.runInContext(`matchScenes(${JSON.stringify(t)})`, ctx);
  console.log(`[${t}] →`, hits.map(h => `${h.rec.id}(${h.score})`).join(', ') || '无→降级卡');
}
