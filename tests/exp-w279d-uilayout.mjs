// 第279便d(原仮定者の裁定(第69報)「UI」— 横画面のタブと「サンプルを選ぶ」の幅を 3/4 程度へ)の
// 実機採寸ハーネス。第278便e の tests/exp-w278e-uilayout.mjs を継ぐ。**読み取り+UI 操作だけ**
// (力学・presetSig・保存 JSON へは触れない)。正本ではない(provenance 版付き JSON を出さない)。
//
// 使い方: PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright \
//         node tests/exp-w279d-uilayout.mjs [target] [--col=<grid 右カラムの CSS 値>] [--box=<横画面の箱の max-width>]
//   --col / --box を渡すと、横画面 2 カラムの右カラム幅/「サンプルを選ぶ」等の箱の上限だけを style で
//   上書きして測る(候補の比較用。対象 html は書き換えない)。渡さなければ対象 html の宣言のまま測る。
// 出力: 標準出力の JSON 1 個。viewport ごとに第278便e の採寸(layout・右カラム幅・キャンバス幅/高さ・
//   文書の横はみ出し・ヘッダー/操作列/タブの行数と折り返し・4 タブのパネル内の横はみ出し・箱の幅と
//   見出し行・手前モーダルの被覆)に加えて、第279便d の追加:
//   tabCount(タブの個数)と tabsOneRow(全タブが 1 行)・panels.*.btnCut(パネル右上の「閉じる」「広げる」が
//   パネルの右端の内側に収まるか — 右端の切れ 0)・transportClip(操作列のボタンが右カラムの右端を越える数)・
//   pp.maxW(箱の max-width の計算値)・aboutPanel/avPanel.maxW(このアプリについて/監査ビューの箱)・
//   uz13.{ja,en}(文字サイズ「大」= --uz 1.3 での操作列・タブの折り返しと 4 タブのパネル内の横はみ出し)。
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const TARGET = args.find((a) => !a.startsWith('--')) || 'beta/index.html';
const COL = (args.find((a) => a.startsWith('--col=')) || '').slice(6) || null;
const BOX = (args.find((a) => a.startsWith('--box=')) || '').slice(6) || null;
const INDEX = 'file://' + path.join(ROOT, TARGET);
const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let browser;
try { browser = await req('playwright').chromium.launch(); }
catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }

const VIEWPORTS = [
  { name: '412x915', width: 412, height: 915 },
  { name: '900x600', width: 900, height: 600 },   // 2 カラム化の下限幅(キャンバス最小幅の確認)
  { name: '1024x768', width: 1024, height: 768 },
  { name: '1280x800', width: 1280, height: 800 },
  { name: '1366x768', width: 1366, height: 768 },
  { name: '1920x1080', width: 1920, height: 1080 },
];

const MEASURE = async ([col, boxW]) => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  if (col || boxW) {
    const st = document.createElement('style');
    st.textContent = '@media (orientation:landscape) and (min-width:900px){'
      + (col ? '#app{grid-template-columns:minmax(0,1fr) ' + col + ' !important;}' : '')
      + (boxW ? '.ppBox,.fmBox{max-width:' + boxW + ' !important;}' : '') + '}';
    document.head.appendChild(st);
    await wait(80);
  }
  const R = (e) => { const b = e.getBoundingClientRect(); return { l: +b.left.toFixed(1), r: +b.right.toFixed(1),
    t: +b.top.toFixed(1), b: +b.bottom.toFixed(1), w: +b.width.toFixed(1), h: +b.height.toFixed(1) }; };
  // 行数 = 縦の区間が重ならない組の数(中央揃えで上端がずれるだけの子は同じ行に数える・幅 0 は数えない)
  const rows = (el) => { const bs = [];
    for (const c of el.children) { const b = c.getBoundingClientRect(); if (b.width > 0 && b.height > 0) bs.push(b); }
    bs.sort((a, b) => a.top - b.top); let n = 0, bottom = -Infinity;
    for (const b of bs) { if (b.top >= bottom - 1) { n++; bottom = b.bottom; } else bottom = Math.max(bottom, b.bottom); }
    return n; };
  // 要素内の文字が何行に折れているか(Range の行矩形の上端の異なり数)
  const lines = (el) => { const rg = document.createRange(); rg.selectNodeContents(el);
    const ts = new Set(); for (const q of rg.getClientRects()) if (q.width > 0) ts.add(Math.round(q.top)); return ts.size; };
  const wrapped = (sel) => [...document.querySelectorAll(sel)].filter((b) => b.getBoundingClientRect().width > 0
    && lines(b) > 1).map((b) => b.id || b.dataset.tab || b.textContent.trim().slice(0, 8));
  const o = {};
  o.layout = getComputedStyle(document.getElementById('app')).display;
  const cw = document.getElementById('canvasWrap'), tabs = document.getElementById('tabs');
  o.canvas = R(cw); o.tabs = R(tabs);
  o.colW = o.layout === 'grid' ? o.tabs.w : null;
  o.docOverflowX = document.documentElement.scrollWidth - innerWidth;
  o.header = { h: R(document.querySelector('header')).h, rows: rows(document.querySelector('header')) };
  o.transport = { rows: rows(document.getElementById('transport')), wrapped: wrapped('#transport button') };
  o.tabsRows = rows(tabs); o.tabsWrapped = wrapped('nav#tabs button');
  o.tabCount = [...tabs.querySelectorAll('button')].filter((b) => b.getBoundingClientRect().width > 0).length;
  o.tabsOneRow = o.tabsRows === 1;
  { const tr = document.getElementById('transport').getBoundingClientRect();
    o.transportClip = [...document.querySelectorAll('#transport > *')].filter((e) => { const b = e.getBoundingClientRect();
      return b.width > 0 && (b.right > tr.right + 0.5 || b.right > innerWidth + 0.5); }).length; }
  // 4 タブ: パネル内の横はみ出し
  o.panels = {};
  for (const t of ['help', 'params', 'saves', 'ai']) {
    document.querySelector('nav#tabs button[data-tab="' + t + '"]').click();
    await wait(120);
    const p = document.getElementById('panel');
    const pr = p.getBoundingClientRect();
    let out = 0; const outIds = [];
    for (const e of p.querySelectorAll('*')) {
      const b = e.getBoundingClientRect();
      if (b.width <= 0 || b.height <= 0) continue;
      if (getComputedStyle(e).position === 'fixed') continue;
      if (b.right > pr.right + 1 || b.left < pr.left - 1) { out++; if (outIds.length < 4) outIds.push(e.id || e.className || e.tagName); }
    }
    // パネル右上のボタン(閉じる・広げる)の右端がパネルの内側(スクロールバーを除く clientWidth)に収まる
    const inner = pr.left + p.clientLeft + p.clientWidth;
    const btnCut = ['btnPanelClose', 'btnPanelExpand'].map((id) => document.getElementById(id)).filter((b) => b
      && b.getBoundingClientRect().width > 0).filter((b) => b.getBoundingClientRect().right > inner + 0.5).map((b) => b.id);
    o.panels[t] = { w: +pr.width.toFixed(1), h: +pr.height.toFixed(1), scrollX: p.scrollWidth - p.clientWidth, out, outIds, btnCut };
  }
  document.getElementById('btnPanelClose').click();
  await wait(80);
  // サンプルを選ぶ
  document.getElementById('btnPresetPick').click();
  await wait(150);
  const box = document.querySelector('#ppModal .ppBox');
  const hd = document.querySelector('#ppModal .ppHead');
  const clr = document.getElementById('ppSearchClear');
  o.pp = { box: R(box), headRows: hd ? rows(hd) : null, headOverflow: hd ? hd.scrollWidth - hd.clientWidth : null,
    boxOverflow: box.scrollWidth - box.clientWidth, maxW: getComputedStyle(box).maxWidth,
    hasClear: !!clr };
  if (clr) {
    const si = document.getElementById('ppSearch');
    si.value = 'mercury'; si.dispatchEvent(new Event('input', { bubbles: true }));
    await wait(80);
    const cb = clr.getBoundingClientRect(), sb = si.getBoundingClientRect();
    o.pp.clearShown = { visible: getComputedStyle(clr).display !== 'none', inSearch: cb.left >= sb.left - 0.5 && cb.right <= sb.right + 0.5,
      headRows: rows(hd), headOverflow: hd.scrollWidth - hd.clientWidth, clear: R(clr) };
    clr.click(); await wait(60);
  }
  document.getElementById('ppClose').click();
  await wait(60);
  // このアプリについて / 監査ビュー
  const cover = (el) => { let hit = 0, n = 0;
    for (let fy = 0.05; fy < 1; fy += 0.1) for (let fx = 0.05; fx < 1; fx += 0.1) {
      n++; const s = document.elementsFromPoint(innerWidth * fx, innerHeight * fy)[0];
      if (s && (s === el || el.contains(s))) hit++; }
    return +(hit / n).toFixed(3); };
  for (const [id, open, close] of [['aboutPanel', () => document.getElementById('appTitle').click(), () => document.getElementById('aboutClose').click()],
    ['avPanel', () => HP.auditView.open(true), () => HP.auditView.open(false)]]) {
    open(); await wait(120);
    const el = document.getElementById(id);
    const inner = el.querySelector('.fmBox') || el;
    o[id] = { pos: getComputedStyle(el).position, z: getComputedStyle(el).zIndex, box: R(inner), cover: cover(el),
      overCanvas: R(inner).l <= o.canvas.l + 20 || R(inner).r >= o.canvas.r,
      overflowX: inner.scrollWidth - inner.clientWidth, maxW: getComputedStyle(inner).maxWidth };
    close(); await wait(60);
  }
  o.canvasMinWidthOK = o.layout !== 'grid' || o.canvas.w >= 400;
  // 文字サイズ「大」(--uz 1.3)で ja / en: 操作列・タブのボタン文字の折り返し・4 タブのパネル内の横はみ出し
  o.uz13 = {};
  const uz0 = document.documentElement.style.getPropertyValue('--uz');
  for (const lg of ['ja', 'en']) {
    HP.setLang(lg);
    document.documentElement.style.setProperty('--uz', '1.3');
    await wait(80);
    let px = 0;
    for (const t of ['help', 'params', 'saves', 'ai']) {
      document.querySelector('nav#tabs button[data-tab="' + t + '"]').click(); await wait(100);
      const p = document.getElementById('panel'); px = Math.max(px, p.scrollWidth - p.clientWidth);
    }
    document.getElementById('btnPanelClose').click(); await wait(40);
    o.uz13[lg] = { wrapped: wrapped('#transport button, nav#tabs button'), panelX: px,
      docX: document.documentElement.scrollWidth - innerWidth };
  }
  if (uz0) document.documentElement.style.setProperty('--uz', uz0); else document.documentElement.style.removeProperty('--uz');
  HP.setLang('ja');
  return o;
};

const out = { target: TARGET, col: COL, box: BOX, rows: {} };
for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e.message || e)));
  await page.goto(INDEX, { waitUntil: 'load' });
  await page.waitForFunction(() => !!window.HP);
  await page.evaluate(() => { try { HP.setLang('ja'); } catch (_) {} });
  const r = await page.evaluate(MEASURE, [COL, BOX]);
  r.jsErrors = errs.length;
  out.rows[vp.name] = r;
  await ctx.close();
}
await browser.close();
console.log(JSON.stringify(out, null, 1));
