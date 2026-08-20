// 第79便 UI変更のスモーク検査(6件)。node tests/smoke-79ui.mjs
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const INDEX = 'file://' + path.join(ROOT, process.env.QA_TARGET || 'beta/index.html');
const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
async function getBrowser() {
  try { const { chromium } = await import('playwright'); return await chromium.launch(); } catch {}
  const { chromium } = await import('playwright-core'); return await chromium.launch({ executablePath: exe });
}
const browser = await getBrowser();
const page = await browser.newPage();
page.on('pageerror', e => console.log('PAGEERROR', e.message));
await page.goto(INDEX);
await page.waitForFunction(() => !!window.HP);
let bad = 0;
const chk = (id, ok, detail) => { if (!ok) bad++; console.log(`${ok ? 'PASS' : 'FAIL'} ${id}  ${detail ?? ''}`); };

const r = await page.evaluate(() => {
  const res = {};
  HP.setLang('ja');
  document.querySelectorAll('.tabbtn,[data-tab]').forEach(b => { if (/パラメータ|params/i.test(b.textContent || b.dataset.tab || '')) b.click(); });
  const cats = [...document.querySelectorAll('details > summary')].map(s => s.textContent.trim());
  res.cats = cats;
  const catOf = (label) => [...document.querySelectorAll('details')].find(d => d.querySelector('summary')?.textContent.trim().startsWith(label));
  // ① g_x/g_y が「時空」カテゴリにある
  const st = catOf('時空');
  res.stText = st ? st.textContent : '';
  res.gInSt = !!st && st.textContent.includes('一様重力 g_x') && st.textContent.includes('一様重力 g_y');
  const box = catOf('実験箱');
  res.gInBox = !!box && /一様重力/.test(box.textContent);
  // ② グラフカテゴリが表示の直上
  const iG = cats.findIndex(c => c.startsWith('グラフ')), iD = cats.findIndex(c => c.startsWith('表示'));
  res.iG = iG; res.iD = iD; res.graphAboveDisp = iG >= 0 && iD >= 0 && iG + 1 === iD;
  const g = catOf('グラフ');
  res.graphItems = g ? g.textContent.replace(/^グラフ/, '') : '';
  const d = catOf('表示');
  res.dispHasGraphToggle = !!d && /回転曲線|温度ヒスト|スペクトル/.test(d.textContent);
  // ③ 換算値のフォントサイズ
  const cv = document.querySelector('.convVal');
  res.convFs = cv ? getComputedStyle(cv).fontSize : null;
  // ④⑤ 表示スケール指数が「表示」にあり、直値入力できる
  const num = document.querySelector('#scaleExpIn');
  res.expInDisp = !!d && !!num && d.contains(num);
  res.expInSim = !!catOf('シミュレーション') && catOf('シミュレーション').contains(num);
  if (num) {
    const before = HP.scaleExp ? HP.scaleExp() : null;
    num.value = '-27.5'; num.dispatchEvent(new Event('change'));
    res.setNeg = document.querySelector('#scaleExpIn').value;
    res.tierNeg = document.querySelector('.scaleExpTier')?.textContent || '';
    num.value = '99'; num.dispatchEvent(new Event('change'));
    res.clampHi = document.querySelector('#scaleExpIn').value;
    num.value = 'あ'; num.dispatchEvent(new Event('change'));
    res.badKeeps = document.querySelector('#scaleExpIn').value;
    res.before = before;
  }
  return res;
});
chk('ui1.gravity-in-spacetime', r.gInSt && !r.gInBox, `時空に g_x/g_y=${r.gInSt} 実験箱に残存=${r.gInBox}`);
chk('ui2.graph-category', r.graphAboveDisp && !r.dispHasGraphToggle,
  `順=${r.iG}/${r.iD} グラフ項目=${JSON.stringify(r.graphItems.slice(0, 80))} 表示に残存=${r.dispHasGraphToggle}`);
chk('ui3.convval-size', r.convFs === '12px', `convVal font-size=${r.convFs}`);
chk('ui4.exp-in-display', r.expInDisp && !r.expInSim, `表示内=${r.expInDisp} シミュ内=${r.expInSim}`);
chk('ui5.exp-direct-input', r.setNeg === '-27.5' && r.clampHi === '30' && r.badKeeps === '30',
  `-27.5→${r.setNeg} 99→${r.clampHi}(clamp30) 不正→${r.badKeeps} tier=${r.tierNeg}`);

// ⑥ サンプルカテゴリ順(スケール準拠)
const gs = await page.evaluate(() => {
  const sel = document.querySelector('#presetGroupSelect');
  const groups = sel ? [...sel.options].map(o => o.textContent.trim()).filter(t => t && !/すべて|全/.test(t)) : [];
  const ps = document.querySelector('#presetSelect');
  const og = ps ? [...ps.querySelectorAll('optgroup')].map(o => o.label) : [];
  const ai = document.querySelector('#aiBasePreset');
  const ag = ai ? [...ai.querySelectorAll('optgroup')].map(o => o.label) : [];
  return { groups, og, ag };
});
// 第147便: グループ再編(「銀河」→「銀河の物語」・「光」→「光の物語」+ 新グループ「現実較正」)。
// 第79便順と第147便順のどちらか**に厳密一致**することを要求する(名前の追随のみ — 判定は不変)
const WANT79 = ['熱の実験室', '空間と時間', '光', '天体の物語', '銀河', '箱宇宙'];
const WANT147 = ['熱の実験室', '空間と時間', '光の物語', '天体の物語', '現実較正', '銀河の物語', '箱宇宙'];
const WANT = JSON.stringify(gs.og) === JSON.stringify(WANT147) ? WANT147 : WANT79;
const eq = (a) => JSON.stringify(a) === JSON.stringify(WANT);
chk('ui6.group-order', eq(gs.og) && eq(gs.ag), `optgroup=${JSON.stringify(gs.og)} aiBase=${JSON.stringify(gs.ag)}`);
chk('ui6.groupSelect-order', JSON.stringify(gs.groups.filter(g => WANT.includes(g))) === JSON.stringify(WANT),
  `groupSel=${JSON.stringify(gs.groups)}`);

console.log('cats=', JSON.stringify(r.cats));
await browser.close();
process.exit(bad ? 1 : 0);
