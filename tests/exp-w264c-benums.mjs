// 第264便c(第56報「親子コアで、軸の傾きなどの、『選択粒子の編集』のコアV2で確認できた数値を、
// 確認出来る様にする」): **層モードの読み取り専用の数値行**を 4 幅で測る器
// (第263便b の tests/exp-w263b-beui.mjs の流用 —— 行の矩形は Range.getClientRects() から取る)。
//
// 測るもの(表示専用 — 物理配列へは一切書かない):
//   ① 数値行(#beLayNums の 5 行)の寸法: 幅・行数・1 行あたりの文字数・行の重なり・横の見切れ
//   ② 層モードのパネル: 高さ・#canvasWrap からのはみ出し・パネル内スクロール量・横スクロール
//   ③ 「この移行について」details を開いたときの本文の高さ(第263便b の +301.5px を増やしていないか)
//   ④ ja / en の両方(文言が違い、数字は同じ)
// 対象は 🧅 layeredCoreDFM(層のみ)と ⚫ bhCore(コア V2 → 移行して層+V2)。
//
// 使い方:
//   PLAYWRIGHT_CORE_DIR=/home/user/dfm-simulator node tests/exp-w264c-benums.mjs beta/_w264_base.html beta/index.html
//   W264C_OUT=/path/benums-w264c.json node tests/exp-w264c-benums.mjs …
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGETS = process.argv.slice(2).length ? process.argv.slice(2) : ['beta/index.html'];
const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const WIDTHS = [[1280, 800], [1024, 768], [800, 600], [800, 420]];

let browser;
try { browser = await req('playwright').chromium.launch(); }
catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }

const PROBE = (sel) => {
  const el = document.querySelector(sel);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  const rects = [];
  const walk = (n) => { for (const c of n.childNodes) {
    if (c.nodeType === 3 && c.nodeValue.trim()) { const rg = document.createRange(); rg.selectNodeContents(c);
      for (const q of rg.getClientRects()) if (q.width > 0.5 && q.height > 0.5) rects.push({ t: q.top, b: q.bottom, l: q.left, w: q.width }); }
    else if (c.nodeType === 1) walk(c); } };
  walk(el);
  rects.sort((a, b) => a.t - b.t || a.l - b.l);
  const lines = [];
  for (const q of rects) { const last = lines[lines.length - 1];
    if (last && Math.abs(last.t - q.t) < 1) { last.b = Math.max(last.b, q.b); last.w += q.w; }
    else lines.push({ t: q.t, b: q.b, w: q.w }); }
  let overlap = 0;
  for (let i = 1; i < lines.length; i++) overlap = Math.max(overlap, Math.max(0, lines[i - 1].b - lines[i].t));
  const text = (el.textContent || '');
  return { text: text.slice(0, 160), chars: text.length,
    w: +r.width.toFixed(2), h: +r.height.toFixed(2),
    lines: lines.length, charsPerLine: lines.length ? +(text.length / lines.length).toFixed(1) : 0,
    maxLineW: lines.length ? +Math.max(...lines.map((q) => q.w)).toFixed(2) : 0,
    overlapPx: +overlap.toFixed(2),
    xClipPx: Math.max(0, el.scrollWidth - el.clientWidth),
    yClipPx: Math.max(0, el.scrollHeight - el.clientHeight) };
};

async function measure(target) {
  const page = await browser.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e.message || e)));
  await page.goto('file://' + path.join(ROOT, target), { waitUntil: 'load' });
  await page.waitForFunction(() => window.HP && HP.sim && HP.currentPreset());
  const out = { target, widths: {}, errs };
  for (const [W, H] of WIDTHS) {
    await page.setViewportSize({ width: W, height: H });
    const key = `${W}x${H}`;
    out.widths[key] = {};
    for (const lang of ['ja', 'en']) {
      for (const [tag, preset, migrate] of [['onion', 'layeredCoreDFM', false], ['bhcore', 'bhCore', true]]) {
        const ok = await page.evaluate(([p, mig, lg]) => {
          if (HP.lang() !== lg) document.querySelector('#btnLang').click();
          HP.loadPreset(p, false);
          const S = HP.sim;
          let idx = -1;
          if (mig) { for (let i = 0; i < S.n; i++) if (S.coreMd[i] && S.coreMd[i] !== 4 && !S.layN[i]) { idx = i; break; } }
          else { for (let i = 0; i < S.n; i++) if (S.layN && S.layN[i] > 0) { idx = i; break; } }
          if (idx < 0) return false;
          HP.selectBody(idx, 'A');
          if (mig) { const cv = document.querySelector('#beCoreV2'); if (cv) cv.open = true;
            const b = document.querySelector('#beCvToLayers'); if (b && !b.disabled) b.click(); }
          const tg = document.querySelector('#beLayToggle');
          if (tg && !(HP.beLayModeNow && HP.beLayModeNow())) tg.click();
          return true;
        }, [preset, migrate, lang]);
        if (!ok) { out.widths[key][lang + '_' + tag] = { skip: preset }; continue; }
        const rows = {};
        for (const id of ['#beLayNums', '#beLyNumSrc', '#beLyNumOm', '#beLyNumJ', '#beLyNumJ2', '#beLyNumE', '#beLyNumM', '#beLyNumM2'])
          rows[id] = await page.evaluate(PROBE, id);
        const geom = await page.evaluate(() => {
          const el = document.querySelector('#bodyEdit');
          const wrap = document.querySelector('#canvasWrap');
          const r = el.getBoundingClientRect(), w = wrap.getBoundingClientRect();
          const S = HP.sim, i = HP.selInfo().selIdx;
          return { panelW: +r.width.toFixed(2), panelH: +r.height.toFixed(2),
            overflowPx: +Math.max(0, r.bottom - w.bottom).toFixed(2),
            scrollY: Math.max(0, el.scrollHeight - el.clientHeight),
            scrollX: Math.max(0, el.scrollWidth - el.clientWidth),
            layMode: HP.beLayModeNow ? HP.beLayModeNow() : null,
            nLay: S.layN ? S.layN[i] : 0, coreMd: S.coreMd[i], sig: HP.presetSigHash(HP.currentPreset()) };
        });
        out.widths[key][lang + '_' + tag] = { preset, rows, geom };
      }
    }
  }
  // ③ 「この移行について」details(第263便b の寸法を増やしていないか)
  await page.setViewportSize({ width: 1280, height: 800 });
  out.more = await page.evaluate(() => {
    HP.loadPreset('bhCore', false);
    const S = HP.sim; let idx = -1;
    for (let i = 0; i < S.n; i++) if (S.coreMd[i] && S.coreMd[i] !== 4 && !S.layN[i]) { idx = i; break; }
    if (idx < 0) return null;
    HP.selectBody(idx, 'A');
    const cv = document.querySelector('#beCoreV2'); if (cv) cv.open = true;
    const d = document.querySelector('#beCvDepMore'); if (!d) return null;
    const closedH = +d.getBoundingClientRect().height.toFixed(2);
    d.open = true;
    const b = d.querySelector('#beCvDepMoreBody').getBoundingClientRect();
    const o = { closedH, openH: +d.getBoundingClientRect().height.toFixed(2),
      bodyW: +b.width.toFixed(2), bodyH: +b.height.toFixed(2) };
    d.open = false;
    return o;
  });
  await page.close();
  return out;
}

const res = [];
for (const t of TARGETS) res.push(await measure(t));
await browser.close();
const json = JSON.stringify(res, null, 1);
console.log(json);
if (process.env.W264C_OUT) fs.writeFileSync(process.env.W264C_OUT, json);
