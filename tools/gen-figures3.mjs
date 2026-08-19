// 論文3(現実較正)図生成パイプライン(第140便 — 図4点)
// - tools/gen-figures2.mjs の書式・決定性・数値ゲート方式を踏襲する。
// - **新規シミュレーションは走らせない**: 図の数値はすべて **コミット済みの結果 JSON**
//   (tests/out/*.json)から読む。手打ちの実測値は1つも置かない。
//   したがって本スクリプトは物理エンジンを駆動せず、Chromium は SVG→PDF の
//   印刷にのみ使う(図の見た目を第1・第2論文と揃えるため)。
// - 出力: paper/figures/p3fig{1..4}.{svg,pdf,json}(第1論文 fig1..6・第2論文 p2fig1..8 と
//   衝突しない接頭辞)。各図に .json(出典 JSON・抽出値・コミット)を併置する。
// - 数値ゲート25件を assert し、まとめを p3figs-gates.json に書く(ALL PASS で exit 0)。
// - 実行: `node tools/gen-figures3.mjs`(全図)/ FIG=3,4 で個別再生成。
// - 外部チャートライブラリは使わない(単一HTML・ゼロ依存の設計思想と揃える)。
//
// 図と出典 JSON の対応:
//   p3fig1 (F1) 不変量ラダー 実測 vs 解析     ← tests/out/obscal-results.json .tests.mercuryReal
//   p3fig2 (F2) ループゲイン用量応答          ← tests/out/obscal-results.json .tests.kframeStability
//   p3fig3 (F3) ω_DFM/Ω_LT の半径プロファイル ← tests/out/qlockradial-results.json
//   p3fig4      木星ガリレオ衛星 hold-out      ← tests/out/jupiter-results.json
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'paper', 'figures');
fs.mkdirSync(OUT, { recursive: true });
const ONLY = process.env.FIG ? process.env.FIG.split(',').map(Number) : null;
const want = (n) => !ONLY || ONLY.includes(n);

let commit = 'unknown';
try { commit = execSync('git rev-parse --short HEAD', { cwd: ROOT, stdio: 'pipe' }).toString().trim(); } catch {}

const readJSON = (rel) => JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
const SRC = {
  obscal: 'tests/out/obscal-results.json',
  qlockradial: 'tests/out/qlockradial-results.json',
  jupiter: 'tests/out/jupiter-results.json'
};
const obscal = readJSON(SRC.obscal);
const qradial = readJSON(SRC.qlockradial);
const jupiter = readJSON(SRC.jupiter);

async function getBrowser() {
  const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  try { const { chromium } = await import('playwright'); return await chromium.launch(); } catch {}
  try { const { chromium } = await import('playwright'); return await chromium.launch({ executablePath: exe }); } catch {}
  try { const { chromium } = await import('playwright-core'); return await chromium.launch({ executablePath: exe }); } catch {}
  throw new Error('playwright が見つかりません(npm install)');
}

// ===== SVG 描画ヘルパ(印刷向け: 黒基調・serif・単色+線種で系列を区別。論文1〜2と同一様式) =====
const FONT = `font-family="Georgia,'Times New Roman',serif"`;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const niceTicks = (lo, hi, n = 5) => {
  const span = hi - lo, step0 = span / n, mag = Math.pow(10, Math.floor(Math.log10(step0)));
  const step = [1, 2, 2.5, 5, 10].map(m => m * mag).find(s => span / s <= n + 1) || mag * 10;
  const t = []; for (let v = Math.ceil(lo / step) * step; v <= hi + 1e-9; v += step) t.push(+v.toFixed(10));
  return t;
};
// 対数軸の目盛(値そのものを返す)。2桁以下の範囲では 1/2/5 の中間目盛も置く。
const logTicks = (lo, hi) => {
  const a = Math.floor(lo), b = Math.ceil(hi), t = [];
  if (b - a <= 2) {
    for (let k = a; k <= b; k++) for (const m of [1, 2, 5]) {
      const v = m * Math.pow(10, k);
      if (Math.log10(v) >= lo - 1e-9 && Math.log10(v) <= hi + 1e-9) t.push(v);
    }
  } else {
    const every = Math.ceil((b - a) / 8) || 1;
    for (let k = a; k <= b; k++) if (((k % every) + every) % every === 0) t.push(Math.pow(10, k));
  }
  return t;
};
const fmtPow = (v) => {   // 10 のべきは指数表記、中間目盛は係数付き
  const k = Math.floor(Math.log10(v) + 1e-9), pow = Math.pow(10, k);
  const mant = +(v / pow).toFixed(3);
  const base = k === 0 ? '1' : (k === 1 ? '10' : `10^${k}`);
  return mant === 1 ? base : (k === 0 ? String(mant) : `${mant}x${base}`);
};
// 線形軸: 目盛間隔から必要な桁数を決める(1.000/1.002/1.004 のような狭い範囲に対応)
const fmtLin = (v, step) => {
  const d = Math.max(0, Math.min(6, Math.ceil(-Math.log10(Math.abs(step || 1))) + 0));
  return v.toFixed(d);
};

// 折れ線図。series: {pts:[[x,y],...], dash?, wide?, gray?, label, marker?, err?}
function lineChart({ w = 520, h = 360, ml = 66, mr = 14, mt = 16, mb = 46, xlab, ylab, xlog = false, ylog = false,
  series, xlo, xhi, ylo, yhi, legend = 'tr', legendW = 220, title = '', marks = [], notes = [], notesPos = 'plot' }) {
  const X = (v) => xlog ? Math.log10(v) : v, Y = (v) => ylog ? Math.log10(v) : v;
  const pts = series.flatMap(s => s.pts).filter(p => p[1] !== null && isFinite(p[1]) && (!ylog || p[1] > 0));
  const xs = pts.map(p => X(p[0])), ys = pts.map(p => Y(p[1]));
  const x0 = xlo !== undefined ? X(xlo) : Math.min(...xs), x1 = xhi !== undefined ? X(xhi) : Math.max(...xs);
  let y0 = ylo !== undefined ? Y(ylo) : Math.min(...ys), y1 = yhi !== undefined ? Y(yhi) : Math.max(...ys);
  if (y0 === y1) { y0 -= 1; y1 += 1; }
  const pad = (y1 - y0) * 0.08; if (ylo === undefined) y0 -= pad; if (yhi === undefined) y1 += pad;
  const pw = w - ml - mr, ph = h - mt - mb;
  const px = (v) => ml + (X(v) - x0) / (x1 - x0) * pw, py = (v) => mt + (1 - (Y(v) - y0) / (y1 - y0)) * ph;
  const xt = xlog ? logTicks(x0, x1) : niceTicks(x0, x1);
  const yt = ylog ? logTicks(y0, y1) : niceTicks(y0, y1);
  const xStep = xt.length > 1 ? xt[1] - xt[0] : 1, yStep = yt.length > 1 ? yt[1] - yt[0] : 1;
  let g = `<rect x="0" y="0" width="${w}" height="${h}" fill="white"/>`;
  for (const v of yt) g += `<line x1="${ml}" y1="${py(v)}" x2="${w - mr}" y2="${py(v)}" stroke="#ddd" stroke-width="0.6"/>`;
  g += `<rect x="${ml}" y="${mt}" width="${pw}" height="${ph}" fill="none" stroke="black" stroke-width="1"/>`;
  for (const v of xt) {
    if (X(v) < x0 - 1e-9 || X(v) > x1 + 1e-9) continue;
    const near = px(v) > w - mr - 24 ? 'end' : (px(v) < ml + 24 ? 'start' : 'middle');
    g += `<line x1="${px(v)}" y1="${mt + ph}" x2="${px(v)}" y2="${mt + ph + 4}" stroke="black"/>` +
      `<text x="${px(v)}" y="${mt + ph + 18}" text-anchor="${near}" font-size="12" ${FONT}>${xlog ? fmtPow(v) : fmtLin(v, xStep)}</text>`;
  }
  for (const v of yt) g += `<line x1="${ml - 4}" y1="${py(v)}" x2="${ml}" y2="${py(v)}" stroke="black"/>` +
    `<text x="${ml - 7}" y="${py(v) + 4}" text-anchor="end" font-size="12" ${FONT}>${ylog ? fmtPow(v) : fmtLin(v, yStep)}</text>`;
  for (const s of series) {
    const stroke = s.gray ? '#888' : 'black', sw = s.wide ? 2 : 1.3;
    const dash = s.dash ? ` stroke-dasharray="${s.dash}"` : '';
    const p = s.pts.filter(q => q[1] !== null && isFinite(q[1]) && (!ylog || q[1] > 0));
    g += `<polyline fill="none" stroke="${stroke}" stroke-width="${sw}"${dash} points="${p.map(q => `${px(q[0]).toFixed(1)},${py(q[1]).toFixed(1)}`).join(' ')}"/>`;
    if (s.marker) for (const q of p) g += `<circle cx="${px(q[0]).toFixed(1)}" cy="${py(q[1]).toFixed(1)}" r="3" fill="${stroke}"/>`;
  }
  for (const m of marks) {   // 強調(丸印+ラベル)
    if (m.x === null || m.y === null || !isFinite(m.x) || !isFinite(m.y)) continue;
    g += `<circle cx="${px(m.x).toFixed(1)}" cy="${py(m.y).toFixed(1)}" r="6.5" fill="none" stroke="black" stroke-width="1.4"/>`;
    if (m.label) g += `<text x="${(px(m.x) + (m.dx || 10)).toFixed(1)}" y="${(py(m.y) + (m.dy || -7)).toFixed(1)}" text-anchor="${m.anchor || 'start'}" font-size="11" ${FONT}>${esc(m.label)}</text>`;
  }
  const nLab = series.filter(s => s.label).length;
  const lx = legend === 'tr' ? w - mr - legendW : ml + 12;
  const ly = legend === 'bl' ? mt + ph - 18 * nLab - 10 : mt + 10;
  series.filter(s => s.label).forEach((s, i) => {
    const stroke = s.gray ? '#888' : 'black', dash = s.dash ? ` stroke-dasharray="${s.dash}"` : '';
    g += `<line x1="${lx}" y1="${ly + i * 18 + 4}" x2="${lx + 26}" y2="${ly + i * 18 + 4}" stroke="${stroke}" stroke-width="${s.wide ? 2 : 1.3}"${dash}/>` +
      `<text x="${lx + 32}" y="${ly + i * 18 + 8}" font-size="12" ${FONT}>${esc(s.label)}</text>`;
  });
  notes.forEach((t, i) => {
    const y = notesPos === 'margin' ? mt + ph + 34 + i * 15 : mt + ph - 10 - (notes.length - 1 - i) * 15;
    g += `<text x="${ml + 2}" y="${y}" font-size="11" ${FONT}>${esc(t)}</text>`;
  });
  g += `<text x="${ml + pw / 2}" y="${h - 10}" text-anchor="middle" font-size="14" ${FONT}>${esc(xlab)}</text>`;
  g += `<text x="16" y="${mt + ph / 2}" text-anchor="middle" font-size="14" ${FONT} transform="rotate(-90 16 ${mt + ph / 2})">${esc(ylab)}</text>`;
  if (title) g += `<text x="${ml + 4}" y="${mt - 3}" font-size="13" ${FONT}>${esc(title)}</text>`;
  return { svg: g, w, h };
}

// 群棒グラフ(カテゴリ=天体名)。groups: {label, vals:[], fill:'black'|'#888'|'white'}
function barChart({ w = 520, h = 300, ml = 66, mr = 14, mt = 16, mb = 52, cats, groups, ylab, ylo, yhi,
  hlines = [], title = '', legend = 'tr', legendW = 210, notes = [], notesPos = 'plot' }) {
  const vals = groups.flatMap(gr => gr.vals).filter(v => isFinite(v)).concat(hlines.map(l => l.y));
  let y0 = ylo !== undefined ? ylo : Math.min(0, ...vals), y1 = yhi !== undefined ? yhi : Math.max(...vals);
  const pad = (y1 - y0) * 0.12; if (yhi === undefined) y1 += pad;
  const pw = w - ml - mr, ph = h - mt - mb;
  const py = (v) => mt + (1 - (v - y0) / (y1 - y0)) * ph;
  const slot = pw / cats.length, bw = slot * 0.72 / groups.length;
  const yt = niceTicks(y0, y1), yStep = yt.length > 1 ? yt[1] - yt[0] : 1;
  let g = `<rect x="0" y="0" width="${w}" height="${h}" fill="white"/>`;
  for (const v of yt) g += `<line x1="${ml}" y1="${py(v)}" x2="${w - mr}" y2="${py(v)}" stroke="#ddd" stroke-width="0.6"/>`;
  g += `<rect x="${ml}" y="${mt}" width="${pw}" height="${ph}" fill="none" stroke="black" stroke-width="1"/>`;
  for (const v of yt) g += `<line x1="${ml - 4}" y1="${py(v)}" x2="${ml}" y2="${py(v)}" stroke="black"/>` +
    `<text x="${ml - 7}" y="${py(v) + 4}" text-anchor="end" font-size="12" ${FONT}>${fmtLin(v, yStep)}</text>`;
  if (y0 < 0 && y1 > 0) g += `<line x1="${ml}" y1="${py(0)}" x2="${w - mr}" y2="${py(0)}" stroke="black" stroke-width="0.9"/>`;
  cats.forEach((c, i) => {
    const cx = ml + slot * (i + 0.5);
    groups.forEach((gr, j) => {
      const v = gr.vals[i]; if (!isFinite(v)) return;
      const x = cx - (groups.length * bw) / 2 + j * bw;
      const yTop = py(Math.max(v, 0)), hh = Math.abs(py(v) - py(0));
      g += `<rect x="${x.toFixed(1)}" y="${yTop.toFixed(1)}" width="${(bw * 0.86).toFixed(1)}" height="${Math.max(hh, 0.6).toFixed(1)}" ` +
        `fill="${gr.fill}" stroke="black" stroke-width="0.9"/>`;
    });
    g += `<text x="${cx.toFixed(1)}" y="${mt + ph + 18}" text-anchor="middle" font-size="12" ${FONT}>${esc(c)}</text>`;
  });
  for (const l of hlines) {
    g += `<line x1="${ml}" y1="${py(l.y)}" x2="${w - mr}" y2="${py(l.y)}" stroke="black" stroke-width="1.1" stroke-dasharray="${l.dash || '6 4'}"/>`;
    if (l.label) g += `<text x="${w - mr - 6}" y="${(py(l.y) - 5).toFixed(1)}" text-anchor="end" font-size="11" ${FONT}>${esc(l.label)}</text>`;
  }
  const lx = legend === 'tr' ? w - mr - legendW : ml + 12, ly = mt + 8;
  groups.filter(gr => gr.label).forEach((gr, i) => {
    g += `<rect x="${lx}" y="${ly + i * 18 - 2}" width="14" height="10" fill="${gr.fill}" stroke="black" stroke-width="0.9"/>` +
      `<text x="${lx + 22}" y="${ly + i * 18 + 7}" font-size="12" ${FONT}>${esc(gr.label)}</text>`;
  });
  const nGroups = groups.filter(gr => gr.label).length;
  notes.forEach((t, i) => {
    const y = notesPos === 'legend' ? ly + nGroups * 18 + 10 + i * 15
      : (notesPos === 'margin' ? mt + ph + 36 + i * 15 : mt + ph - 8 - (notes.length - 1 - i) * 15);
    g += `<text x="${notesPos === 'legend' ? lx : ml + 2}" y="${y}" font-size="11" ${FONT}>${esc(t)}</text>`;
  });
  g += `<text x="${ml + pw / 2}" y="${h - 12}" text-anchor="middle" font-size="13" ${FONT}>${esc(title ? '' : '')}</text>`;
  g += `<text x="16" y="${mt + ph / 2}" text-anchor="middle" font-size="14" ${FONT} transform="rotate(-90 16 ${mt + ph / 2})">${esc(ylab)}</text>`;
  if (title) g += `<text x="${ml + 4}" y="${mt - 3}" font-size="13" ${FONT}>${esc(title)}</text>`;
  return { svg: g, w, h };
}

function panelStack(panels, gap = 8) { // (a)(b)(c) 縦積み
  const w = Math.max(...panels.map(p => p.w)), h = panels.reduce((a, p) => a + p.h, 0) + gap * (panels.length - 1);
  let y = 0, g = `<rect width="${w}" height="${h}" fill="white"/>`;
  const tags = ['(a)', '(b)', '(c)'];
  panels.forEach((p, i) => {
    g += `<g transform="translate(0,${y})">${p.svg}</g>` +
      `<text x="6" y="${y + 16}" font-size="14" font-weight="bold" ${FONT}>${tags[i]}</text>`;
    y += p.h + gap;
  });
  return { svg: g, w, h };
}

const writeFig = async (pdfPage, n, fig, data) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${fig.w}" height="${fig.h}" viewBox="0 0 ${fig.w} ${fig.h}">${fig.svg}</svg>`;
  fs.writeFileSync(path.join(OUT, `p3fig${n}.svg`), svg);
  fs.writeFileSync(path.join(OUT, `p3fig${n}.json`), JSON.stringify({
    figure: `p3fig${n}`, paper: 'dfm-paper3', generated: new Date().toISOString(), commit,
    provenance: 'コミット済み結果 JSON からの再描画のみ(本スクリプトは物理エンジンを駆動しない)', ...data
  }, null, 1));
  await pdfPage.setContent(`<html><head><style>@page{margin:0;size:${fig.w}px ${fig.h}px}body{margin:0}</style></head><body>${svg}</body></html>`);
  await pdfPage.pdf({ path: path.join(OUT, `p3fig${n}.pdf`), width: `${fig.w}px`, height: `${fig.h}px`, printBackground: true });
  console.log(`p3fig${n}: svg/pdf/json 生成`);
};

// 最小二乗による log–log 傾き(図の中で使う導出量。元データは JSON のまま)
const logSlope = (pts) => {
  const p = pts.filter(q => q[0] > 0 && q[1] > 0), n = p.length;
  const X = p.map(q => Math.log10(q[0])), Y = p.map(q => Math.log10(q[1]));
  const mx = X.reduce((a, b) => a + b, 0) / n, my = Y.reduce((a, b) => a + b, 0) / n;
  let num = 0, den = 0;
  for (let i = 0; i < n; i++) { num += (X[i] - mx) * (Y[i] - my); den += (X[i] - mx) ** 2; }
  return num / den;
};

// ===== メイン =====
const browser = await getBrowser();
const pdfPage = await browser.newPage();
const gates = [];
const gate = (id, pass, detail) => { gates.push({ id, pass, detail }); console.log(`${pass ? 'PASS' : 'FAIL'} ${id}  ${detail}`); };

// ---- p3fig1 (F1): 水星の不変量ラダー — 実測 vs 解析(論文3 Table ladder の元データ)----
// 出典: tests/out/obscal-results.json .tests.mercuryReal.ladder(exp-obscal.mjs §D)
if (want(1)) {
  const L = obscal.tests.mercuryReal.ladder;
  const arcsec = obscal.tests.mercuryReal.arcsecPerCentury;
  const pa = lineChart({
    h: 306, xlab: 'depth  d = GM/(c^2 a)', ylab: 'apsidal advance  (rad/orbit)', xlog: true, ylog: true,
    legend: 'tl', legendW: 200, title: 'invariant ladder: measured against the weak-field expression',
    series: [
      { pts: L.map(r => [r.depth, r.theo]), label: 'Eq. (1):  6 pi d / (1 - e^2)', gray: true, wide: true },
      { pts: L.map(r => [r.depth, r.pn1Measured]), label: 'measured (1PN on minus off)', marker: true }
    ],
    marks: [{ x: L[2].depth, y: L[2].pn1Measured, label: "Mercury's own depth", dx: 13, dy: -12 }]
  });
  const pb = lineChart({
    h: 288, xlab: 'depth  d = GM/(c^2 a)', ylab: 'measured / Eq. (1)', xlog: true, legend: 'tl', legendW: 200,
    ylo: 0.998, yhi: 1.004, title: 'ratio at each rung (all three rungs within 0.2%)',
    series: [
      { pts: L.map(r => [r.depth, r.ratio]), label: 'ratio', wide: true, marker: true },
      { pts: L.map(r => [r.depth, 1]), label: 'exact agreement', dash: '2 3', gray: true }
    ],
    marks: [{ x: L[2].depth, y: L[2].ratio, label: `${L[2].ratio.toFixed(4)}  ->  ${arcsec.toFixed(2)} arcsec/century`, dx: 13, dy: 20 }]
  });
  const fig = panelStack([pa, pb]);
  await writeFig(pdfPage, 1, fig, {
    source: SRC.obscal, sourceKey: 'tests.mercuryReal', harness: 'tests/exp-obscal.mjs §D',
    sourceTarget: obscal.target, sourceDate: obscal.date,
    ladder: L, arcsecPerCentury: arcsec,
    note: '論文3 Table ladder と同一データ。実測は 1PN on/off の差分、解析は Eq.(1) 6πd/(1−e²)。'
  });
  const slopeMeas = logSlope(L.map(r => [r.depth, r.pn1Measured]));
  gate('p3fig1.ratio', L.every(r => r.ratio > 1.0005 && r.ratio < 1.005),
    `3段すべてで 実測/解析 ∈ (1.0005, 1.005): ${L.map(r => r.ratio.toFixed(4)).join(' / ')}(最深段 ${L[2].ratio.toFixed(4)} — 本文 1.002)`);
  gate('p3fig1.linearity', Math.abs(slopeMeas - 1) < 0.01,
    `実測は深さに比例(log–log 傾き ${slopeMeas.toFixed(4)}、解析 1 との差 ${Math.abs(slopeMeas - 1).toExponential(1)} < 0.01・深さ3桁)`);
  gate('p3fig1.arcsec', Math.abs(arcsec - 42.98) / 42.98 < 0.002,
    `水星深さでの換算 ${arcsec.toFixed(3)}''/century(観測 42.98''/century との差 ${(100 * Math.abs(arcsec - 42.98) / 42.98).toFixed(3)}% < 0.2% — 本文 43.0)`);
}

// ---- p3fig2 (F2): ループゲインの用量応答(論文3 Table gain の元データ)----
// 出典: tests/out/obscal-results.json .tests.kframeStability(exp-obscal.mjs §F)
if (want(2)) {
  const K = obscal.tests.kframeStability, dose = K.dose, gS = K.gStar;
  const kSat = dose.filter(d => d.route === 'kSat'), d0 = dose.filter(d => d.route === 'D0');
  const AMP_TARGET = 0.11;   // 自然離心率が定める目標(本文 Table gain の脚注)
  const pa = lineChart({
    h: 306, xlab: 'loop gain  g = chi_sat * chi_M', ylab: 'radial excursion amp', xlog: true, legend: 'tl', legendW: 250,
    title: 'dose response along two routes (Earth-Moon configuration)',
    series: [
      { pts: kSat.map(d => [d.gain, d.amp]), label: 'route: satellite weight k_sat', wide: true, marker: true },
      { pts: d0.map(d => [d.gain, d.amp]), label: 'route: background D_0', dash: '7 4', marker: true },
      { pts: [[gS.maxStable / 3, AMP_TARGET], [Math.max(...dose.map(d => d.gain)), AMP_TARGET]], label: 'natural-eccentricity target ~0.11', dash: '2 3', gray: true }
    ],
    marks: [
      { x: gS.maxStable, y: dose.find(d => d.gain === gS.maxStable).amp, label: `largest stable  g=${gS.maxStable.toExponential(1)}`, dx: 10, dy: 14 },
      { x: gS.minUnstable, y: dose.find(d => d.gain === gS.minUnstable).amp, label: `smallest unstable  g=${gS.minUnstable.toExponential(1)}`, dx: -10, dy: -10, anchor: 'end' }
    ]
  });
  const pb = lineChart({
    h: 288, xlab: 'loop gain  g = chi_sat * chi_M', ylab: 'primary-side factor  chi_M', xlog: true, legend: 'bl', legendW: 250,
    ylo: 0, yhi: 1.05, title: 'why the satellite-mass route cannot stabilize: chi_M never comes down',
    series: [
      { pts: kSat.map(d => [d.gain, d.chiM]), label: 'route: satellite weight k_sat', wide: true, marker: true },
      { pts: d0.map(d => [d.gain, d.chiM]), label: 'route: background D_0', dash: '7 4', marker: true }
    ]
  });
  const fig = panelStack([pa, pb]);
  const chiMkSat = kSat.map(d => d.chiM);
  await writeFig(pdfPage, 2, fig, {
    source: SRC.obscal, sourceKey: 'tests.kframeStability', harness: 'tests/exp-obscal.mjs §F',
    sourceTarget: obscal.target, sourceDate: obscal.date,
    dose, gStar: gS, ampTarget: AMP_TARGET, procedure: K.procedure,
    note: '論文3 Table gain と同一データ(表は代表7行、図は測定10行すべて)。amp=(r_max−r_min)/r̄。'
  });
  gate('p3fig2.boundary', gS.maxStable < gS.minUnstable && dose.every(d => !d.nan),
    `安定境界は g ∈ (${gS.maxStable.toExponential(3)}, ${gS.minUnstable.toExponential(3)}) に挟まれる(全${dose.length}行 NaN なし — 本文 4.1e-3 / 8.9e-3)`);
  gate('p3fig2.route-asymmetry', Math.min(...chiMkSat) > 0.939 && Math.max(...chiMkSat) < 0.941,
    `k_sat 経路では χ_M が下がらない(${Math.min(...chiMkSat).toFixed(4)}〜${Math.max(...chiMkSat).toFixed(4)}、本文 ≈0.94)— 利得の一方の因子が残る`);
  gate('p3fig2.d0-route', d0[d0.length - 1].chiM < 0.24 && d0[d0.length - 1].amp < 0.13,
    `D_0 経路では χ_M が ${d0[0].chiM.toFixed(4)} → ${d0[d0.length - 1].chiM.toFixed(4)} まで下がり amp は ${d0[0].amp.toFixed(2)} → ${d0[d0.length - 1].amp.toFixed(3)}(目標 ≈0.11 へ接近)`);
  gate('p3fig2.monotone', d0.every((d, i) => i === 0 || d.amp <= d0[i - 1].amp),
    `D_0 経路の amp は利得とともに単調減少: ${d0.map(d => d.amp.toFixed(3)).join(' → ')}`);
}

// ---- p3fig3 (F3): ω_DFM/Ω_LT の半径プロファイル(qLock q*=8.25 / q=3 / LT 基準線)----
// 出典: tests/out/qlockradial-results.json(第136便・地球=月の参照系)
if (want(3)) {
  const U = qradial.uField, S = qradial.slopes, IS = qradial.innerSaturation;
  const ref = U.find(u => u.isRef);
  const qLock = qradial.config.qLock, qFlat = qradial.config.qFlat;
  const outer = U.filter(u => u.r >= ref.r);
  const slopeQLockFit = logSlope(outer.map(u => [u.r, u.ratioQLock]));
  const pa = lineChart({
    w: 520, h: 424, mb: 80, xlab: 'orbital radius  r / R_E', ylab: 'omega_DFM / Omega_LT', xlog: true, ylog: true,
    legend: 'bl', legendW: 240, notesPos: 'margin', title: 'entrainment profile against the Lense-Thirring rate',
    series: [
      { pts: U.map(u => [u.rOverRE, u.ratioQLock]), label: `qLock  q* = ${qLock}`, wide: true, marker: true },
      { pts: U.map(u => [u.rOverRE, u.ratioQ3]), label: `flat control  q = ${qFlat}`, dash: '7 4', marker: true },
      { pts: [[U[0].rOverRE, 1], [U[U.length - 1].rOverRE, 1]], label: 'Lense-Thirring reference (ratio = 1)', dash: '2 3', gray: true }
    ],
    marks: [
      { x: ref.rOverRE, y: ref.ratioBare, label: `reference orbit, bare profile: ${ref.ratioBare.toFixed(3)}`, dx: -12, dy: -8, anchor: 'end' },
      { x: ref.rOverRE, y: ref.ratioQLock, label: `with chi(r): ${ref.ratioQLock.toFixed(3)}`, dx: -12, dy: 16, anchor: 'end' }
    ],
    notes: [
      `outer log-log slope:  ${S.omegaQLockOuter.toFixed(2)} (qLock)  /  ${S.omegaQ3Outer.toFixed(2)} (q=3)  /  ${S.omegaLTReference} (LT)`,
      `chi(r) saturates inward: ${IS.chiInnermost.toFixed(3)} at r/R_E=${U[0].rOverRE.toFixed(1)}  ->  ${IS.chiOutermost.toFixed(3)} at r/R_E=${U[U.length - 1].rOverRE.toFixed(0)}`
    ]
  });
  await writeFig(pdfPage, 3, pa, {
    source: SRC.qlockradial, sourceKey: 'uField / slopes / innerSaturation', harness: 'tests/exp-qlockradial.mjs(第136便)',
    sourceTarget: qradial.target, sourceWave: qradial.wave,
    config: { qLock, qFlat, D0: qradial.config.physics.D0, rRef: qradial.config.rRef, rIn: qradial.config.rIn, rOut: qradial.config.rOut },
    profile: U.map(u => ({ r: u.r, rOverRE: u.rOverRE, chi: u.chi, omQLock: u.omQLock, omQ3: u.omQ3, omLT: u.omLT, ratioQLock: u.ratioQLock, ratioQ3: u.ratioQ3, ratioBare: u.ratioBare, isRef: !!u.isRef })),
    referencePoint: { rOverRE: ref.rOverRE, ratioBare: ref.ratioBare, ratioQLock: ref.ratioQLock },
    slopes: S, innerSaturation: IS, slopeQLockOuterRefit: slopeQLockFit,
    note: '半径は地球半径 R_E 単位。ratioBare は χ(r) を掛けない裸のプロファイル(qLock 則が LT と揃えている量)。'
  });
  gate('p3fig3.refpoint', Math.abs(ref.ratioBare - 1) < 0.1,
    `参照軌道(r/R_E=${ref.rOverRE.toFixed(1)})で裸のプロファイルが LT と一致: ω_bare/Ω_LT = ${ref.ratioBare.toFixed(4)}(|1−比| = ${Math.abs(1 - ref.ratioBare).toFixed(4)} < 0.1)`);
  gate('p3fig3.refpoint-chi', Math.abs(ref.ratioQLock - ref.ratioBare * ref.chi) / ref.ratioQLock < 1e-6,
    `同じ点で χ(r)=${ref.chi.toFixed(4)} を掛けた実効比は ${ref.ratioQLock.toFixed(4)}(= ratioBare × χ を 1e-6 以内で満たす)`);
  gate('p3fig3.outerslope', Math.abs(S.omegaQLockOuter - (-(1 + qLock))) < 0.3 &&
    Math.abs(slopeQLockFit - S.ratioQLockOuter) < 0.05 && Math.abs(S.ratioQLockOuter - (S.omegaQLockOuter - S.omegaLTReference)) < 1e-9,
    `ω_DFM の外側傾き ${S.omegaQLockOuter.toFixed(3)}(解析の目安 −(1+q*) = ${(-(1 + qLock)).toFixed(2)})。比 ω/Ω_LT の外側傾きは ` +
    `${S.ratioQLockOuter.toFixed(3)}(= 傾き −(−3)・図の3点から再フィット ${slopeQLockFit.toFixed(3)})`);
  gate('p3fig3.q3slope', Math.abs(S.omegaQ3Outer - S.omegaLTReference) < 1,
    `q=3 対照の外側傾き ${S.omegaQ3Outer.toFixed(3)} は LT の ${S.omegaLTReference} の近傍に留まる(差 ${Math.abs(S.omegaQ3Outer - S.omegaLTReference).toFixed(3)} < 1)`);
  gate('p3fig3.slopediff', qradial.windows.W5.byOmegaOuter.diff > 3 && qradial.windows.W5.byOmegaOuter.diff < 8,
    `事前登録窓 W5(q3 − qLock の外側傾き差 3〜8): ${qradial.windows.W5.byOmegaOuter.diff.toFixed(3)}`);
  gate('p3fig3.crossing', IS.crossingRadius > qradial.config.rIn && IS.crossingRadius < ref.r && IS.ratioInnermost > 1e5 && IS.ratioOutermost < 1e-2,
    `qLock 曲線は内側 ${IS.ratioInnermost.toExponential(2)}(超 LT)から外側 ${IS.ratioOutermost.toExponential(2)} まで落ち、比=1 を r=${IS.crossingRadius.toFixed(1)}(参照軌道 ${ref.r.toFixed(1)} の内側)で横切る`);
  gate('p3fig3.saturation', IS.chiInnermost > IS.chiOutermost && IS.chiInnermost < 1,
    `χ=w/(D₀+w) は内側で1へ飽和(${IS.chiInnermost.toFixed(4)} → ${IS.chiOutermost.toFixed(4)})— LT の r⁻³ 発散に対し DFM は有限に留まる`);
}

// ---- p3fig4: 木星ガリレオ衛星の hold-out(第138便)----
// 出典: tests/out/jupiter-results.json(事前登録窓 JW1〜JW5)
if (want(4)) {
  const W = jupiter.windows, M = jupiter.moons, cfg = jupiter.config;
  const REF_MOON = 'Io';   // q* を1回だけ評価した参照軌道。他3衛星が hold-out。
  const names = M.map(m => m.name), heldOut = names.filter(n => n !== REF_MOON);
  const cats = M.map(m => m.name === REF_MOON ? `${m.name} (ref)` : `${m.name}*`);
  const jw1 = W.JW1.rows, jw2 = W.JW2.rows, jw5 = W.JW5.rows;
  const pa = barChart({
    h: 322, mb: 86, cats, ylab: 'period deviation from observed (%)', ylo: -0.25, yhi: 1.75, legend: 'tl', legendW: 250,
    title: 'sidereal periods: transcription, dragging, and the q=3 control',
    groups: [
      { label: 'k_Frame = 0 (transcription)', fill: 'white', vals: jw1.map(r => r.devPercent) },
      { label: `k_Frame = 1, q* = ${cfg.qDeclared} (hold-out)`, fill: 'black', vals: jw2.map(r => r.devPercent) },
      { label: 'k_Frame = 1, q = 3 (control)', fill: '#888', vals: jw5.map(r => r.devPercent) }
    ],
    hlines: [{ y: 1, label: 'pre-registered window  +/-1%' }], notesPos: 'margin',
    notes: [`* held out: q* was derived once at Io and never re-fitted`,
      `k_Frame = 1 deviations: ${jw2.map(r => r.devPercent.toFixed(3)).join(' / ')} %`]
  });
  const pb = barChart({
    h: 322, mb: 86, cats, ylab: '|delta a| / a  over the window (%)', ylo: 0, legend: 'tl', legendW: 250,
    title: 'orbit retention (pre-registered window: below 2%)',
    groups: [
      { label: `k_Frame = 1, ${cfg.orbits} Io orbits`, fill: 'black', vals: jw2.map(r => r.aSpreadPercent) },
      { label: `k_Frame = 1, ${cfg.orbitsLong} Io orbits`, fill: 'white', vals: M.map(m => 100 * m.long.kF1aSpread) },
      { label: 'k_Frame = 1, q = 3 (control)', fill: '#888', vals: jw5.map(r => 100 * r.aSpread) }
    ],
    notesPos: 'margin',
    notes: [`largest excursion ${Math.max(...jw2.map(r => r.aSpreadPercent)).toFixed(3)}% (${jw2.reduce((a, b) => a.aSpreadPercent > b.aSpreadPercent ? a : b).name}),`,
      'far inside the 2% window']
  });
  const fig = panelStack([pa, pb]);
  const spinRows = W.JW4.rows;
  const spinFrac = spinRows.map(r => Math.abs(r.dragSpinPe / r.dragTotalPe));
  const spinAnalytic = spinRows.map(r => r.spinOnlyOverAnalytic);
  await writeFig(pdfPage, 4, fig, {
    source: SRC.jupiter, sourceKey: 'windows JW1/JW2/JW4/JW5, moons[].long, config',
    harness: 'tests/exp-jupiter.mjs(第138便)', sourceTarget: jupiter.target, sourceWave: jupiter.wave,
    referenceMoon: REF_MOON, heldOut,
    config: {
      D0: cfg.physics.D0, q: cfg.physics.q, qStar: cfg.qStar, qStarRule: cfg.qStarRule, qFlat: cfg.qFlat,
      units: cfg.units, orbits: cfg.orbits, orbitsLong: cfg.orbitsLong, idealization: cfg.idealization,
      D0Note: cfg.D0Note, qLockNote: cfg.qLockNote
    },
    periods: M.map((m, i) => ({
      name: m.name, obsDays: m.periodObsDays, kF0Days: jw1[i].periodDays, kF0DevPercent: jw1[i].devPercent,
      kF1Days: jw2[i].periodDays, kF1DevPercent: jw2[i].devPercent,
      kF1LongDays: m.long.kF1PeriodDays, kF1LongDevPercent: 100 * m.long.kF1Dev,
      q3Days: jw5[i].periodDays, q3DevPercent: jw5[i].devPercent
    })),
    retention: M.map((m, i) => ({
      name: m.name, aSpreadPercentMain: jw2[i].aSpreadPercent, aSpreadPercentLong: 100 * m.long.kF1aSpread,
      aSpreadPercentQ3: 100 * jw5[i].aSpread, longRevs: m.long.nRev
    })),
    channels: M.map(m => ({
      name: m.name, totalPe: m.channels.total.dpomPe, motionPe: m.channels.motion.dpomPe, spinPe: m.channels.spin.dpomPe,
      omegaTotalPrograde: m.uField.omegaTotalPrograde, omegaSpinOnlyPrograde: m.uField.omegaSpinOnlyPrograde,
      spinOnlyOverAnalytic: m.uField.spinOnlyOverAnalytic
    })),
    audit: W.JW3, resonance: jupiter.resonance, determinism: jupiter.determinism, convergence: jupiter.convergence,
    note: 'q* はイオを参照軌道として qLock 則を1回だけ評価した値(実行時 qLock は掛けない)。衛星別 fit はゼロ。'
  });
  gate('p3fig4.jw1', W.JW1.pass && jw1.every(r => Math.abs(r.devPercent) < 1),
    `JW1 転写(kF0): 4衛星の周期が観測と最大 ${Math.max(...jw1.map(r => Math.abs(r.devPercent))).toFixed(3)}%(窓 ±1%)`);
  gate('p3fig4.jw2-period', W.JW2.pass && jw2.every(r => Math.abs(r.devPercent) < 1),
    `JW2 引きずり込み(kF1・q*=${cfg.qDeclared}): 周期偏差 最大 ${Math.max(...jw2.map(r => Math.abs(r.devPercent))).toFixed(4)}%(窓 ±1%・${cfg.orbits} イオ公転)`);
  gate('p3fig4.jw2-retention', jw2.every(r => r.aSpreadPercent < 2) && !W.JW2.nan,
    `JW2 軌道保持: |Δa|/a 最大 ${Math.max(...jw2.map(r => r.aSpreadPercent)).toFixed(3)}%(窓 2%・NaN なし)`);
  gate('p3fig4.long-window', M.every(m => 100 * m.long.kF1aSpread < 2 && Math.abs(100 * m.long.kF1Dev) < 1),
    `${cfg.orbitsLong} イオ公転の長窓でも保持: |Δa|/a 最大 ${Math.max(...M.map(m => 100 * m.long.kF1aSpread)).toFixed(3)}%・周期偏差 最大 ${Math.max(...M.map(m => Math.abs(100 * m.long.kF1Dev))).toFixed(4)}%`);
  gate('p3fig4.jw3-holdout', W.JW3.pass && W.JW3.perMoonFits === 0 && W.JW3.velocityCalibFactor === 1,
    `JW3 hold-out の正直さ: 衛星別 fit ${W.JW3.perMoonFits} 件・初速較正係数 ${W.JW3.velocityCalibFactor.toFixed(3)}・共有ノブは ${W.JW3.sharedFits.length} 件(D₀=${cfg.D0Shared})`);
  gate('p3fig4.qstar', Math.abs(cfg.qStar - cfg.qDeclared) < 0.01 && cfg.qLockRuntime === false,
    `q* はイオ参照で qLock 則を1回評価した ${cfg.qStar.toFixed(4)}(宣言値 ${cfg.qDeclared}・実行時 qLock は掛けない)`);
  gate('p3fig4.q3-control', jw5.filter(r => Math.abs(r.devPercent) > 1).length === 2,
    `q=3 対照は2衛星で ±1% を超える: ${jw5.map(r => `${r.name} ${r.devPercent.toFixed(3)}%`).join(' / ')}`);
  gate('p3fig4.channel-split', spinFrac.every(f => f < 1e-4) && M.every(m => m.uField.omegaTotalPrograde === false),
    `全系フレーム ω は衛星間の運動引きずり支配(自転チャネルの寄与は Δϖ の ${Math.max(...spinFrac).toExponential(1)} 以下・全系 ω は順行でない)`);
  gate('p3fig4.spin-channel', M.every(m => m.uField.omegaSpinOnlyPrograde === true) && Math.min(...spinAnalytic) > 0.99999,
    `自転チャネルは分離すると4衛星とも順行で、解析形との比 最小 ${Math.min(...spinAnalytic).toFixed(7)}(5桁以上一致)`);
  gate('p3fig4.determinism', jupiter.determinism.bitIdentical && jupiter.determinism.maxAbsDiff === 0 &&
    !jupiter.runs.main.nan.kF0 && !jupiter.runs.main.nan.kF1 && !jupiter.runs.main.nan.q3,
    `同一構成2回でビット一致(最終状態 ${jupiter.determinism.nFin} 値・最大差 ${jupiter.determinism.maxAbsDiff})・主測定窓に NaN なし`);
  gate('p3fig4.resonance-record', Math.abs(jupiter.resonance.measuredRatiosKF1.EuropaOverIo - 2) < 0.02 &&
    Math.abs(jupiter.resonance.measuredRatiosKF1.GanymedeOverEuropa - 2) < 0.02,
    `ラプラス共鳴は記録のみ(要求せず): 周期比 実測 ${jupiter.resonance.measuredRatiosKF1.EuropaOverIo.toFixed(4)} / ${jupiter.resonance.measuredRatiosKF1.GanymedeOverEuropa.toFixed(4)}` +
    `(観測 ${jupiter.resonance.observedRatios.EuropaOverIo.toFixed(4)} / ${jupiter.resonance.observedRatios.GanymedeOverEuropa.toFixed(4)})`);
}

await browser.close();
const ok = gates.every(g => g.pass);
fs.writeFileSync(path.join(OUT, 'p3figs-gates.json'), JSON.stringify({
  paper: 'dfm-paper3', commit, generated: new Date().toISOString(),
  provenance: 'コミット済み結果 JSON のみを読む(新規シミュレーションなし)',
  sources: Object.values(SRC), gates
}, null, 1));
console.log(ok ? `ALL GATES PASS (${gates.length})` : 'GATE FAIL');
process.exit(ok ? 0 : 1);
