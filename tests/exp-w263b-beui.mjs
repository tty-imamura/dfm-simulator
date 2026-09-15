// 第263便b(第55報 W2「『粒子の編集』を畳んだ時に、『親子コア(層)』も畳む」「『親子コアへ移行』の
// 説明が、狭い場所で読みづらいので修正する」): **実機で見えた読みづらさを数で出す**器。
//
// 測るもの(表示専用 — 物理配列へは一切書かない):
//   ① 「親子コアへ移行」の説明行(#beCvDepRow / #beCvDep / #beCvToLayers)の寸法
//      … 文字列の入る幅(px)・行数・1 行あたりの文字数・行の重なり(px)・横の見切れ(px)・
//        ボタン文言の見切れ(px)・パネルのはみ出し(px)
//   ② 畳み連動: #beClose(⏷)で畳んだとき層モードが畳まれるか・再展開の状態(案A/案B)
// 幅: 1280×800 / 1024×768 / 800×600 / 800×420(第55報「狭い場所」の実機幅)
//
// 使い方:
//   node tests/exp-w263b-beui.mjs beta/_w263_base.html beta/index.html
//   W263B_OUT=/path/beui-w263b.json W263B_SHOTS=/path/shots node tests/exp-w263b-beui.mjs …
// 出力: JSON(標準出力 + W263B_OUT)。スクリーンショットは W263B_SHOTS があるときだけ書く。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGETS = process.argv.slice(2).length ? process.argv.slice(2) : ['beta/index.html'];
const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const SHOTS = process.env.W263B_SHOTS || '';
const WIDTHS = [[1280, 800], [1024, 768], [800, 600], [800, 420]];

let browser;
try { browser = await req('playwright').chromium.launch(); }
catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }

// ページ内で 1 要素の「読みづらさ」を数にする(行の矩形は Range から取る — 実際の折返しそのもの)
const PROBE = (sel) => {
  const el = document.querySelector(sel);
  if (!el) return null;
  const cs = getComputedStyle(el);
  const r = el.getBoundingClientRect();
  const rects = [];
  const walk = (n) => { for (const c of n.childNodes) {
    if (c.nodeType === 3 && c.nodeValue.trim()) { const rg = document.createRange(); rg.selectNodeContents(c);
      for (const q of rg.getClientRects()) if (q.width > 0.5 && q.height > 0.5) rects.push({ t: q.top, b: q.bottom, l: q.left, w: q.width }); }
    else if (c.nodeType === 1) walk(c); } };
  walk(el);
  rects.sort((a, b) => a.t - b.t || a.l - b.l);
  // 同じ行(top が 1px 以内)をまとめる
  const lines = [];
  for (const q of rects) { const last = lines[lines.length - 1];
    if (last && Math.abs(last.t - q.t) < 1) { last.b = Math.max(last.b, q.b); last.w += q.w; }
    else lines.push({ t: q.t, b: q.b, w: q.w }); }
  let overlap = 0;
  for (let i = 1; i < lines.length; i++) overlap = Math.max(overlap, Math.max(0, lines[i - 1].b - lines[i].t));
  const text = (el.textContent || '');
  return {
    text: text.slice(0, 120), chars: text.length,
    w: +r.width.toFixed(2), h: +r.height.toFixed(2),
    fontPx: +parseFloat(cs.fontSize).toFixed(2),
    lineH: (cs.lineHeight === 'normal') ? 'normal' : +parseFloat(cs.lineHeight).toFixed(2),
    opacity: +cs.opacity,
    lines: lines.length,
    charsPerLine: lines.length ? +(text.length / lines.length).toFixed(1) : 0,
    maxLineW: lines.length ? +Math.max(...lines.map((q) => q.w)).toFixed(2) : 0,
    overlapPx: +overlap.toFixed(2),
    xClipPx: Math.max(0, el.scrollWidth - el.clientWidth),
    yClipPx: Math.max(0, el.scrollHeight - el.clientHeight),
  };
};

async function measure(target) {
  const page = await browser.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e.message || e)));
  await page.goto('file://' + path.join(ROOT, target), { waitUntil: 'load' });
  await page.waitForFunction(() => window.HP && HP.sim && HP.currentPreset());
  const out = { target, widths: {}, fold: null, errs };
  for (const [W, H] of WIDTHS) {
    await page.setViewportSize({ width: W, height: H });
    const key = `${W}x${H}`;
    out.widths[key] = {};
    for (const [tag, preset] of [['ok', 'bhCore'], ['ng', 'crabRemnant']]) {
      const sel = await page.evaluate((p) => {
        HP.loadPreset(p, false);
        const S = HP.sim;
        let idx = -1;
        for (let i = 0; i < S.n; i++) if (S.coreMd[i] && !(S.layN && S.layN[i])) { idx = i; break; }
        if (idx >= 0) HP.selectBody(idx, 'A');
        // 「コア内訳(v2)」は details(既定は閉)。移行の行はその中にあるので、**実機で見えている
        // 状態**(開いた状態)で測る —— 閉じたままだと Chromium は行を描かないまま箱だけ返す
        const cv = document.querySelector('#beCoreV2'); if (cv) cv.open = true;
        return idx;
      }, preset);
      if (sel < 0) { out.widths[key][tag] = { skip: preset }; continue; }
      const row = await page.evaluate(PROBE, '#beCvDepRow');
      const span = await page.evaluate(PROBE, '#beCvDep');
      const btn = await page.evaluate(PROBE, '#beCvToLayers');
      const geom = await page.evaluate(() => {
        const el = document.querySelector('#bodyEdit');
        const wrap = document.querySelector('#canvasWrap');
        const r = el.getBoundingClientRect(), w = wrap.getBoundingClientRect();
        const b = document.querySelector('#beCvToLayers').getBoundingClientRect();
        const sp = document.querySelector('#beCvDep').getBoundingClientRect();
        return {
          panelW: +r.width.toFixed(2), panelH: +r.height.toFixed(2),
          panelOverflowPx: +Math.max(0, r.bottom - w.bottom).toFixed(2),
          panelScrollY: Math.max(0, el.scrollHeight - el.clientHeight),
          panelScrollX: Math.max(0, el.scrollWidth - el.clientWidth),
          btnDisabled: document.querySelector('#beCvToLayers').disabled,
          // 説明とボタンが同じ行か(同じ行なら説明の列が痩せる)
          sameLine: (b.top < sp.bottom - 1 && sp.top < b.bottom - 1),
          rowVisiblePx: +Math.max(0, Math.min(sp.bottom, w.bottom) - Math.max(sp.top, w.top)).toFixed(2),
          spanH: +sp.height.toFixed(2),
        };
      });
      // 第263便b: 規約文の details(既定は閉 — 開いたときの寸法も測る)
      const more = await page.evaluate(() => {
        const d = document.querySelector('#beCvDepMore');
        if (!d) return null;
        const sum = d.querySelector('summary').getBoundingClientRect();
        const closedH = +d.getBoundingClientRect().height.toFixed(2);
        d.open = true;
        const b = d.querySelector('#beCvDepMoreBody');
        const r = b.getBoundingClientRect();
        const openH = +d.getBoundingClientRect().height.toFixed(2);
        const el = document.querySelector('#bodyEdit');
        const wrap = document.querySelector('#canvasWrap');
        const pr = el.getBoundingClientRect(), wr = wrap.getBoundingClientRect();
        const o = { summaryH: +sum.height.toFixed(2), closedH, openH,
          bodyW: +r.width.toFixed(2), bodyH: +r.height.toFixed(2),
          xClipPx: Math.max(0, b.scrollWidth - b.clientWidth),
          panelOverflowPx: +Math.max(0, pr.bottom - wr.bottom).toFixed(2),
          panelScrollY: Math.max(0, el.scrollHeight - el.clientHeight) };
        d.open = false;
        return o;
      });
      out.widths[key][tag] = { preset, sel, row, span, btn, more, geom };
      if (SHOTS) {
        fs.mkdirSync(SHOTS, { recursive: true });
        const name = `${path.basename(target, '.html')}_${key}_${tag}.png`;
        await page.locator('#bodyEdit').screenshot({ path: path.join(SHOTS, name) }).catch(() => {});
      }
    }
  }
  // ② 畳み連動(既定幅 1024×768 で見る)。案A(HP.beMinKeepLayerMode(true)=畳む前の層モードを復元)と
  //    案B(既定=基本行で開く)を**同じ html で両方**測る
  out.fold = {};
  for (const [W, H] of [[1024, 768], [800, 420]]) {
   await page.setViewportSize({ width: W, height: H });
   for (const plan of ['B', 'A']) {
    out.fold[`${W}x${H}_${plan}`] = await page.evaluate((pl) => {
      const O = { plan: pl };
      if (window.HP && HP.beMinKeepLayerMode) O.knob = HP.beMinKeepLayerMode(pl === 'A');
      HP.loadPreset('layeredCoreDFM', false);
      HP.selectBody(0, 'A');
      const tg = document.querySelector('#beLayToggle');
      const close = document.querySelector('#beClose');
      const vis = (s) => { const e = document.querySelector(s); return e ? getComputedStyle(e).display !== 'none' : null; };
      const h = () => +document.querySelector('#bodyEdit').getBoundingClientRect().height.toFixed(2);
      const sc = () => { const e = document.querySelector('#bodyEdit'); return Math.max(0, e.scrollHeight - e.clientHeight); };
      // (a) 基本行のまま畳む/戻す(基点からの既存挙動 — 比較の基準)
      close.click(); O.baseMinH = h(); close.click(); O.baseBackH = h();
      // (b) 層モードを開いてから畳む/戻す
      tg.click();
      O.openLayers = vis('#beLayers'); O.openBase = vis('#beBaseRows'); O.openPanelH = h();
      close.click();
      O.minClass = document.querySelector('#bodyEdit').classList.contains('min');
      O.minLayersVisible = vis('#beLayers'); O.minToggleVisible = vis('#beLayToggleRow');
      O.minCvDepVisible = vis('#beCvDepRow'); O.minPanelH = h();
      O.minLayMode = (window.HP && HP.beLayModeNow) ? HP.beLayModeNow() : null;
      close.click();
      O.reLayers = vis('#beLayers'); O.reBase = vis('#beBaseRows'); O.rePanelH = h(); O.reScrollPx = sc();
      O.reToggleLabel = tg.textContent;
      O.reLayMode = (window.HP && HP.beLayModeNow) ? HP.beLayModeNow() : null;
      O.reTabs = Array.from(document.querySelectorAll('#beLayTabs button')).map((b) => b.textContent);
      // 戻す(次の案のために層モードを閉じておく)
      if ((window.HP && HP.beLayModeNow) ? HP.beLayModeNow() : false) tg.click();
      if (window.HP && HP.beMinKeepLayerMode) HP.beMinKeepLayerMode(false);
      HP.selectBody(-1, 'A');
      return O;
    }, plan);
   }
  }
  await page.close();
  return out;
}

const res = [];
for (const t of TARGETS) res.push(await measure(t));
await browser.close();
const json = JSON.stringify(res, null, 1);
console.log(json);
if (process.env.W263B_OUT) fs.writeFileSync(process.env.W263B_OUT, json);
