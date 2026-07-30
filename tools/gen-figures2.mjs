// 論文2(箱宇宙)図生成パイプライン(HANDOFF_PAPER2_WRITE §6 — 図8点)
// - beta/index.html の HP フック(sim/verify/traceRay/loadPreset)を headless Chromium で
//   直接駆動し、図データを収集 → 自前 SVG 描画 → Chromium print-to-PDF で paper/figures/ へ出力。
// - 各図に .json(生成パラメータ+実測値+コミット)を併置(図の機械可読な出典)。
//   ファイル名は p2fig1..8.{svg,pdf,json}(第1論文の fig1..6 と衝突しない接頭辞)。
// - 数値ゲート21件を assert し、まとめを p2figs-gates.json に書く(ALL PASS で exit 0)。
// - 実行: `node tools/gen-figures2.mjs`(全図)/ FIG=2,5 で個別再生成。
// - 対象は **beta/index.html**(箱宇宙プリセット・V23a〜V29 は beta 先行)。
// - 外部チャートライブラリは使わない(単一HTML・ゼロ依存の設計思想と揃える)。
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = 'beta/index.html';
const INDEX = 'file://' + path.join(ROOT, TARGET);
const OUT = path.join(ROOT, 'paper', 'figures');
fs.mkdirSync(OUT, { recursive: true });
const ONLY = process.env.FIG ? process.env.FIG.split(',').map(Number) : null;
const want = (n) => !ONLY || ONLY.includes(n);

let commit = 'unknown';
try { commit = execSync('git rev-parse --short HEAD', { cwd: ROOT, stdio: 'pipe' }).toString().trim(); } catch {}

async function getBrowser() {
  const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  try { const { chromium } = await import('playwright'); return await chromium.launch(); } catch {}
  try { const { chromium } = await import('playwright'); return await chromium.launch({ executablePath: exe }); } catch {}
  try { const { chromium } = await import('playwright-core'); return await chromium.launch({ executablePath: exe }); } catch {}
  throw new Error('playwright が見つかりません(npm install)');
}

// ===== SVG 描画ヘルパ(印刷向け: 黒基調・serif・単色+線種で系列を区別。第1論文と同一様式) =====
const FONT = `font-family="Georgia,'Times New Roman',serif"`;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const niceTicks = (lo, hi, n = 5) => {
  const span = hi - lo, step0 = span / n, mag = Math.pow(10, Math.floor(Math.log10(step0)));
  const step = [1, 2, 2.5, 5, 10].map(m => m * mag).find(s => span / s <= n + 1) || mag * 10;
  const t = []; for (let v = Math.ceil(lo / step) * step; v <= hi + 1e-9; v += step) t.push(+v.toFixed(10));
  return t;
};
const fmtTick = (v) => Math.abs(v) >= 100 ? v.toFixed(0) : (Math.abs(v) >= 1 ? +v.toFixed(2) + '' : +v.toFixed(3) + '');

// 折れ線図。series: {pts:[[x,y],...], dash?, wide?, gray?, label, marker?, err?}
function lineChart({ w = 520, h = 360, ml = 62, mr = 14, mt = 14, mb = 46, xlab, ylab, xlog = false,
  series, xlo, xhi, ylo, yhi, legend = 'tr', title = '', marks = [] }) {
  const pts = series.flatMap(s => s.pts).filter(p => p[1] !== null && isFinite(p[1]));
  const X = (v) => xlog ? Math.log10(v) : v;
  const xs = pts.map(p => X(p[0])), ys = pts.map(p => p[1]);
  const x0 = xlo !== undefined ? X(xlo) : Math.min(...xs), x1 = xhi !== undefined ? X(xhi) : Math.max(...xs);
  let y0 = ylo !== undefined ? ylo : Math.min(...ys), y1 = yhi !== undefined ? yhi : Math.max(...ys);
  if (y0 === y1) { y0 -= 1; y1 += 1; } const pad = (y1 - y0) * 0.06; if (ylo === undefined) y0 -= pad; if (yhi === undefined) y1 += pad;
  const pw = w - ml - mr, ph = h - mt - mb;
  const px = (v) => ml + (X(v) - x0) / (x1 - x0) * pw, py = (v) => mt + (1 - (v - y0) / (y1 - y0)) * ph;
  const xt = xlog ? niceTicks(x0, x1).map(v => Math.pow(10, v)) : niceTicks(x0, x1), yt = niceTicks(y0, y1);
  let g = `<rect x="0" y="0" width="${w}" height="${h}" fill="white"/>`;
  for (const v of yt) g += `<line x1="${ml}" y1="${py(v)}" x2="${w - mr}" y2="${py(v)}" stroke="#ddd" stroke-width="0.6"/>`;
  g += `<rect x="${ml}" y="${mt}" width="${pw}" height="${ph}" fill="none" stroke="black" stroke-width="1"/>`;
  for (const v of xt) {
    if (X(v) < x0 - 1e-9 || X(v) > x1 + 1e-9) continue;
    g += `<line x1="${px(v)}" y1="${mt + ph}" x2="${px(v)}" y2="${mt + ph + 4}" stroke="black"/>` +
      `<text x="${px(v)}" y="${mt + ph + 18}" text-anchor="middle" font-size="12" ${FONT}>${fmtTick(v)}</text>`;
  }
  for (const v of yt) g += `<line x1="${ml - 4}" y1="${py(v)}" x2="${ml}" y2="${py(v)}" stroke="black"/>` +
    `<text x="${ml - 7}" y="${py(v) + 4}" text-anchor="end" font-size="12" ${FONT}>${fmtTick(v)}</text>`;
  for (const s of series) {
    const stroke = s.gray ? '#888' : 'black', sw = s.wide ? 2 : 1.3;
    const dash = s.dash ? ` stroke-dasharray="${s.dash}"` : '';
    const p = s.pts.filter(q => q[1] !== null && isFinite(q[1]));
    g += `<polyline fill="none" stroke="${stroke}" stroke-width="${sw}"${dash} points="${p.map(q => `${px(q[0]).toFixed(1)},${py(q[1]).toFixed(1)}`).join(' ')}"/>`;
    if (s.err) for (const q of s.err) {
      if (q[1] === null || !isFinite(q[1]) || !isFinite(q[2])) continue;
      const cx = px(q[0]);
      g += `<line x1="${cx.toFixed(1)}" y1="${py(q[1] - q[2]).toFixed(1)}" x2="${cx.toFixed(1)}" y2="${py(q[1] + q[2]).toFixed(1)}" stroke="${stroke}" stroke-width="1"/>` +
        `<line x1="${(cx - 3).toFixed(1)}" y1="${py(q[1] + q[2]).toFixed(1)}" x2="${(cx + 3).toFixed(1)}" y2="${py(q[1] + q[2]).toFixed(1)}" stroke="${stroke}" stroke-width="1"/>` +
        `<line x1="${(cx - 3).toFixed(1)}" y1="${py(q[1] - q[2]).toFixed(1)}" x2="${(cx + 3).toFixed(1)}" y2="${py(q[1] - q[2]).toFixed(1)}" stroke="${stroke}" stroke-width="1"/>`;
    }
    if (s.marker) for (const q of p) g += `<circle cx="${px(q[0]).toFixed(1)}" cy="${py(q[1]).toFixed(1)}" r="3" fill="${stroke}"/>`;
  }
  for (const m of marks) {   // 強調(丸印+ラベル)
    if (m.x === null || m.y === null || !isFinite(m.x) || !isFinite(m.y)) continue;
    g += `<circle cx="${px(m.x).toFixed(1)}" cy="${py(m.y).toFixed(1)}" r="6.5" fill="none" stroke="black" stroke-width="1.4"/>`;
    if (m.label) g += `<text x="${(px(m.x) + 10).toFixed(1)}" y="${(py(m.y) - 7).toFixed(1)}" font-size="11" ${FONT}>${esc(m.label)}</text>`;
  }
  const lx = legend === 'tr' ? w - mr - 200 : ml + 12, ly = mt + 10;
  series.filter(s => s.label).forEach((s, i) => {
    const stroke = s.gray ? '#888' : 'black', dash = s.dash ? ` stroke-dasharray="${s.dash}"` : '';
    g += `<line x1="${lx}" y1="${ly + i * 18 + 4}" x2="${lx + 26}" y2="${ly + i * 18 + 4}" stroke="${stroke}" stroke-width="${s.wide ? 2 : 1.3}"${dash}/>` +
      `<text x="${lx + 32}" y="${ly + i * 18 + 8}" font-size="12" ${FONT}>${esc(s.label)}</text>`;
  });
  g += `<text x="${ml + pw / 2}" y="${h - 10}" text-anchor="middle" font-size="14" ${FONT}>${esc(xlab)}</text>`;
  g += `<text x="16" y="${mt + ph / 2}" text-anchor="middle" font-size="14" ${FONT} transform="rotate(-90 16 ${mt + ph / 2})">${esc(ylab)}</text>`;
  if (title) g += `<text x="${ml + 4}" y="${mt - 2}" font-size="13" ${FONT}>${esc(title)}</text>`;
  return { svg: g, w, h };
}

// 光線パネル(ワールド座標の等方描画)。rays: [[x,y],...][]、bodies: [x,y,R][]
function rayPanel({ w = 520, h = 330, rays, bodies, box = 330, title = '', spinArrow = 0 }) {
  const sc = Math.min(w / (2.2 * box), h / (2 * box)) * 0.98;
  const px = (x) => w / 2 + x * sc, py = (y) => h / 2 - y * sc;
  let g = `<rect width="${w}" height="${h}" fill="white"/><rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" fill="none" stroke="black" stroke-width="1"/>`;
  for (const b of bodies) g += `<circle cx="${px(b[0]).toFixed(1)}" cy="${py(b[1]).toFixed(1)}" r="${Math.max(1.5, b[2] * sc).toFixed(1)}" fill="#ccc" stroke="black" stroke-width="1"/>`;
  for (const r of rays) g += `<polyline fill="none" stroke="black" stroke-width="0.9" opacity="0.85" points="${r.filter(p => Math.abs(p[0]) < box * 1.15 && Math.abs(p[1]) < box * 1.05).map(p => `${px(p[0]).toFixed(1)},${py(p[1]).toFixed(1)}`).join(' ')}"/>`;
  if (spinArrow) {   // 回転の向き(円弧+矢頭)
    const R = 70 * sc, cx = px(0), cy = py(0), a0 = -0.9, a1 = 0.9;
    const ax = (a) => cx + R * Math.cos(a), ay = (a) => cy + R * Math.sin(a);
    g += `<path d="M ${ax(a0).toFixed(1)} ${ay(a0).toFixed(1)} A ${R.toFixed(1)} ${R.toFixed(1)} 0 0 ${spinArrow > 0 ? 1 : 0} ${ax(a1).toFixed(1)} ${ay(a1).toFixed(1)}" fill="none" stroke="black" stroke-width="1.4"/>` +
      `<polygon points="${ax(a1).toFixed(1)},${ay(a1).toFixed(1)} ${(ax(a1) + 7).toFixed(1)},${(ay(a1) - 4).toFixed(1)} ${(ax(a1) + 2).toFixed(1)},${(ay(a1) - 9).toFixed(1)}" fill="black"/>`;
  }
  if (title) g += `<text x="34" y="20" font-size="13" ${FONT}>${esc(title)}</text>`;
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

function panelRow(panels, gap = 10) { // (a)(b)(c) 横並び
  const h = Math.max(...panels.map(p => p.h)), w = panels.reduce((a, p) => a + p.w, 0) + gap * (panels.length - 1);
  let x = 0, g = `<rect width="${w}" height="${h}" fill="white"/>`;
  const tags = ['(a)', '(b)', '(c)'];
  panels.forEach((p, i) => {
    g += `<g transform="translate(${x},0)">${p.svg}</g>` +
      `<text x="${x + 8}" y="18" font-size="14" font-weight="bold" ${FONT}>${tags[i]}</text>`;
    x += p.w + gap;
  });
  return { svg: g, w, h };
}

const writeFig = async (pdfPage, n, fig, data) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${fig.w}" height="${fig.h}" viewBox="0 0 ${fig.w} ${fig.h}">${fig.svg}</svg>`;
  fs.writeFileSync(path.join(OUT, `p2fig${n}.svg`), svg);
  fs.writeFileSync(path.join(OUT, `p2fig${n}.json`), JSON.stringify({
    figure: `p2fig${n}`, paper: 'dfm-paper2', generated: new Date().toISOString(), commit, target: TARGET, ...data
  }, null, 1));
  await pdfPage.setContent(`<html><head><style>@page{margin:0;size:${fig.w}px ${fig.h}px}body{margin:0}</style></head><body>${svg}</body></html>`);
  await pdfPage.pdf({ path: path.join(OUT, `p2fig${n}.pdf`), width: `${fig.w}px`, height: `${fig.h}px`, printBackground: true });
  console.log(`p2fig${n}: svg/pdf/json 生成`);
};

// ===== メイン =====
const browser = await getBrowser();
const page = await browser.newPage({ viewport: { width: 800, height: 800 } });
const pdfPage = await browser.newPage();
const errs = [];
page.on('pageerror', e => errs.push(String(e)));
await page.goto(INDEX);
await page.waitForFunction(() => window.HP && HP.sim);
const gates = [];
const gate = (id, pass, detail) => { gates.push({ id, pass, detail }); console.log(`${pass ? 'PASS' : 'FAIL'} ${id}  ${detail}`); };

// ---- p2fig1: 箱の階層(模式図 — シミュレーション不要)----
// (a) 規定の箱(壁=名目半径 L·a(t)・外から調整)(b) 自由な箱(壁=普通の質点・a(t) は解かれる)
// (c) 内部の観測者が読む量と意味論6項目(BOX_UNIVERSE §12 / dfm-paper2.tex Sec. II A)
if (want(1)) {
  const W = 360, H = 300;
  const boxPanel = (title, kind) => {
    let g = `<rect width="${W}" height="${H}" fill="white"/><rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" fill="none" stroke="black" stroke-width="1"/>`;
    const cx = W / 2, cy = H / 2 + 8, R1 = 78, R2 = 108;
    if (kind === 'prescribed') {
      g += `<circle cx="${cx}" cy="${cy}" r="${R2}" fill="none" stroke="black" stroke-width="1.2" stroke-dasharray="7 5"/>`;
      g += `<text x="${cx + R2 - 30}" y="${cy - R2 + 4}" font-size="11" ${FONT}>L a(t)</text>`;
      for (let k = 0; k < 8; k++) {   // 外から調整する矢印
        const th = k * Math.PI / 4, x0 = cx + (R2 + 24) * Math.cos(th), y0 = cy - (R2 + 24) * Math.sin(th);
        const x1 = cx + (R2 + 6) * Math.cos(th), y1 = cy - (R2 + 6) * Math.sin(th);
        g += `<line x1="${x0.toFixed(1)}" y1="${y0.toFixed(1)}" x2="${x1.toFixed(1)}" y2="${y1.toFixed(1)}" stroke="#666" stroke-width="1"/>`;
      }
      g += `<text x="${cx}" y="${cy - R2 - 34}" text-anchor="middle" font-size="11" ${FONT}>regulated from outside</text>`;
    } else {
      for (let k = 0; k < 24; k++) {   // 自由な壁質点
        const th = 2 * Math.PI * k / 24;
        g += `<circle cx="${(cx + R2 * Math.cos(th)).toFixed(1)}" cy="${(cy - R2 * Math.sin(th)).toFixed(1)}" r="4" fill="#bbb" stroke="black" stroke-width="0.8"/>`;
      }
      g += `<text x="${cx}" y="${cy - R2 - 34}" text-anchor="middle" font-size="11" ${FONT}>a(t) solved from E4 + E5'</text>`;
    }
    g += `<circle cx="${cx}" cy="${cy}" r="${R1}" fill="none" stroke="#999" stroke-width="0.8"/>`;
    for (const [dx, dy] of [[-38, -22], [26, -34], [10, 30], [-14, 46], [46, 14]])
      g += `<circle cx="${cx + dx}" cy="${cy + dy}" r="3.2" fill="black"/>`;
    g += `<text x="${cx}" y="${cy - R1 + 14}" text-anchor="middle" font-size="11" ${FONT}>interior: W, u, c_loc</text>`;
    g += `<text x="12" y="${H - 12}" font-size="12" ${FONT}>${esc(title)}</text>`;
    return { svg: g, w: W, h: H };
  };
  const semantics = () => {
    const w = 360, h = 300;
    const items = [
      '1. distances: r = chi a(t)',
      '2. wavelength: 1+z = a_obs/a_emit',
      '3. clocks: tau/t from psi = W/Kt',
      '4. light speed: c_loc = c0 e^{-2 psi}',
      '5. share: phi_B = W_B/(W_B + w_local)',
      '6. peculiar velocity: w = v - u_B'
    ];
    let g = `<rect width="${w}" height="${h}" fill="white"/><rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" fill="none" stroke="black" stroke-width="1"/>`;
    g += `<text x="18" y="46" font-size="13" ${FONT}>what an interior body reads</text>`;
    items.forEach((s, i) => g += `<text x="24" y="${78 + i * 30}" font-size="12" ${FONT}>${esc(s)}</text>`);
    g += `<text x="12" y="${h - 12}" font-size="12" ${FONT}>six semantic commitments</text>`;
    return { svg: g, w, h };
  };
  const fig = panelRow([boxPanel('prescribed box (regulated a(t))', 'prescribed'), boxPanel('free box (solved a(t))', 'free'), semantics()]);
  await writeFig(pdfPage, 1, fig, {
    kind: 'schematic (no simulation)',
    note: '箱宇宙の階層と意味論6項目の模式図。数値は含まない(ゲート対象外)。',
    semanticsSource: 'docs/BOX_UNIVERSE.md §12 / dfm-paper2.tex Sec. II A'
  });
  gate('p2fig1.schematic', true, '模式図(シミュレーション不要 — 数値ゲートなし)');
}

// ---- p2fig2: フレーム利得 g(r) — V23a(回転 Ω=0.15)/V24a(膨張 railH H=0.01)の測定系を半径スキャンへ ----
// 半径ごとに 96質点リング(R=260・m=20・ε=4・kFrame=1・G=0)+方位4プローブを組んで1步進め、
// エンジンの uA/sumW から利得を読む(V23a/V24a の _boxGain と同一手順)。
if (want(2)) {
  const d = await page.evaluate(() => {
    const RADII = [20, 30, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240];
    const Om = 0.15, H = 0.01, R = 260, EPS = 4;
    const run = (r, ring, gain) => {
      const probes = [];
      for (const [px, py] of [[r, 0], [0, r], [-r, 0], [0, -r]])
        probes.push({ type: 'single', m: 0.01, x: px, y: py, vx: 0, vy: 0, spin: 0, pinned: true });
      const s = HP.sim;
      s.build({ id: 'p2fig2', name: 'Vbox', camera: { scale: 300 }, world: { boundary: 'none', size: 0 },
        physics: { G: 0, D0: 0, kFrame: 1, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, etaRad: 0,
          Kt: 10000, cLight: 100, softening: EPS, timeScale: 1 },
        bodies: [ring].concat(probes), overlays: {} });
      s.step(0.016);
      const n0 = s.n - 4;
      let acc = 0; for (let j = 0; j < 4; j++) acc += gain(s, n0 + j);
      return acc / 4;
    };
    const ringR = { type: 'ring', n: 96, cx: 0, cy: 0, rIn: R, rOut: R, mMin: 20, mMax: 20, spinMin: 0, spinMax: 0,
      vMode: 'omega', aroundMass: 0, omega: Om, vNoise: 0, direction: 1, pinned: true };
    const ringE = { type: 'ring', n: 96, cx: 0, cy: 0, rIn: R, rOut: R, mMin: 20, mMax: 20, spinMin: 0, spinMax: 0,
      vMode: 'none', aroundMass: 0, omega: 0, vNoise: 0, direction: 1, pinned: true, railH: H };
    const gR = (s, i) => { const denom = s.sumW[i], r = Math.hypot(s.x[i], s.y[i]);
      return ((-s.y[i] * s.uAx[i] + s.x[i] * s.uAy[i]) / (r * r * denom)) / Om; };
    const gE = (s, i) => { const denom = s.sumW[i], r = Math.hypot(s.x[i], s.y[i]);
      return ((s.x[i] * s.uAx[i] + s.y[i] * s.uAy[i]) / (r * r * denom)) / H; };
    // 解析: 連続一様リング極限 g(r)=(R/r)·Ic/I0(同一 ε の求積)
    const ana = (r) => {
      const N = 4000; let Ic = 0, I0 = 0;
      for (let k = 0; k < N; k++) {
        const th = 2 * Math.PI * k / N, c = Math.cos(th);
        const w = 1 / Math.sqrt(R * R + r * r - 2 * R * r * c + EPS * EPS);
        Ic += c * w; I0 += w;
      }
      return (R / r) * Ic / I0;
    };
    return {
      rotation: RADII.map(r => ({ r, g: run(r, ringR, gR) })),
      expansion: RADII.map(r => ({ r, g: run(r, ringE, gE) })),
      analytic: RADII.map(r => ({ r, g: ana(r) }))
    };
  });
  const relErr = (arr) => Math.max(...arr.map((q, i) => Math.abs(q.g - d.analytic[i].g) / d.analytic[i].g));
  const errR = relErr(d.rotation), errE = relErr(d.expansion);
  const mono = d.rotation.every((q, i) => i === 0 || q.g > d.rotation[i - 1].g)
    && d.expansion.every((q, i) => i === 0 || q.g > d.expansion[i - 1].g);
  const fig = lineChart({
    xlab: 'probe radius r', ylab: 'frame gain  g(r)', legend: 'tl',
    series: [
      { pts: d.rotation.map(q => [q.r, q.g]), label: 'rotation probe (V23a, Omega=0.15)', wide: true, marker: true },
      { pts: d.expansion.map(q => [q.r, q.g]), label: 'expansion probe (V24a, H=0.01)', dash: '7 4', marker: true },
      { pts: d.analytic.map(q => [q.r, q.g]), label: 'analytic uniform-ring limit', dash: '2 3', gray: true }
    ]
  });
  await writeFig(pdfPage, 2, fig, {
    hook: 'V23a/V24a と同一構成(96質点リング R=260・m=20・ε=4・kFrame=1・G=0)を半径スキャンへ拡張',
    analytic: 'g(r)=(R/r)·Ic/I0(連続一様リング極限・同一 ε の求積。r→0 で 1/2)',
    gainAtR20: { rotation: d.rotation[0].g, expansion: d.expansion[0].g, analytic: d.analytic[0].g },
    maxRelErrVsAnalytic: { rotation: errR, expansion: errE },
    data: d
  });
  gate('p2fig2.analytic', errR < 0.02 && errE < 0.02 && mono,
    `解析との最大相対誤差 回転=${(errR * 100).toFixed(2)}% 膨張=${(errE * 100).toFixed(2)}%(<2%)・外向き単調増加=${mono}`);
  gate('p2fig2.gain-half', Math.abs(d.rotation[0].g - 0.5) < 0.01 && Math.abs(d.expansion[0].g - 0.5) < 0.01,
    `g(r=20) 回転=${d.rotation[0].g.toFixed(4)} 膨張=${d.expansion[0].g.toFixed(4)}(解析 0.5 ±0.01 — 本文 Eq.(1) g(0)=1/2)`);
}

// ---- p2fig3: 膨張追随は「ダイヤル」— φ_B スキャン(V25 の binLn/nNet を転記し D のみ変える)----
if (want(3)) {
  const d = await page.evaluate(() => {
    const H = 0.004, DT = 0.016, SOFT = 2;
    // V25(beta/index.html)の binLn/nNet を転記
    const binLn = (D, m, dSep, rs, vOrb, HH, exWin) => {
      const s = HP.sim;
      s.build({ id: 'p2fig3', name: 'V25', camera: { scale: 300 }, world: { boundary: 'none', size: 0 },
        universeBox: { mode: 'exp', H0: HH, D: D, dPower: 0, L: 260, cx: 0, cy: 0, vx: 0, vy: 0, omega: 0, amp: 0, freq: 0, phase: 0 },
        physics: { G: 1, D0: 0, kFrame: 1, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, etaRad: 0,
          Kt: 10000, cLight: 100, radiusScale: rs, softening: SOFT, timeScale: 1 },
        bodies: [
          { type: 'single', m: m, x: -dSep / 2, y: 0, vx: -HH * dSep / 2, vy: -vOrb, spin: 0, pinned: false },
          { type: 'single', m: m, x: dSep / 2, y: 0, vx: HH * dSep / 2, vy: vOrb, spin: 0, pinned: false }
        ], overlays: {} });
      const steps = Math.ceil(Math.log(1.2) / H / DT);
      const period = Math.min(steps >> 1, Math.ceil(2 * Math.PI * (dSep / 2) / vOrb / DT));
      let d0 = 0, c0 = 0, d1 = 0, c1 = 0, dMin = Infinity, dMax = 0;
      const win = exWin || steps;   // 離心振れを測る窓(既定は全区間)
      for (let k = 0; k < steps; k++) {
        s.step(DT);
        const dd = Math.hypot(s.x[0] - s.x[1], s.y[0] - s.y[1]);
        if (k < period) { d0 += dd; c0++; } if (k >= steps - period) { d1 += dd; c1++; }
        if (k < win) { if (dd < dMin) dMin = dd; if (dd > dMax) dMax = dd; }
      }
      return { ln: Math.log((d1 / c1) / (d0 / c0)), dtC: (steps - period) * DT,
        excursion: (dMax - dMin) / ((dMax + dMin) / 2) };
    };
    const nNet = (D, m, dSep, rs, vOrb) => {
      const wH = binLn(D, m, dSep, rs, vOrb, H), w0 = binLn(D, m, dSep, rs, vOrb, 0);
      return (wH.ln - w0.ln) / (H * wH.dtC);
    };
    const phiB = (D, m, dSep) => D / (D + m / Math.sqrt(dSep * dSep + SOFT * SOFT));
    // 主スキャン: 連星を固定(m=2000・d=24 — V25 の局所支配側)し、箱の決定力 D のみを振る
    const M = 2000, DSEP = 24, RS = 0.2, VORB = 3.359;
    const DS = [8, 20, 45, 83, 120, 160, 220, 300, 450, 800, 1500, 2500, 8000];
    const data = DS.map(D => ({ D, phiB: phiB(D, M, DSEP), n: nNet(D, M, DSEP, RS, VORB) }));
    // V25 のゲート2点(箱支配は軽い連星 m=30・d=10 側 — 検証フックをそのまま呼ぶ)
    const v25 = HP.verify.v25();
    const anchors = {
      boxDominated: { D: 80, phiB: phiB(80, 30, 10), n: v25.value },
      locallyDominated: { D: 8, phiB: data[0].phiB, n: data[0].n }
    };
    // 参考: 軽い連星(V25 の箱支配側)で初速を D ごとに最適化した系列(本図には描かない)
    const LM = 30, LD = 10, LRS = 0.4, VKEP = Math.sqrt(LM * LD * LD / (2 * Math.pow(LD * LD + SOFT * SOFT, 1.5)));
    const refD = [0.3, 1.5, 7.5, 20, 80, 300];
    // 離心振れ(excursion)= (d_max−d_min)/((d_max+d_min)/2) を Kepler 周期1つ分の窓で測る
    const EXWIN = Math.ceil(2 * Math.PI * (LD / 2) / VKEP / DT);
    const ref = refD.map(D => {
      // 黄金分割探索: 離心振れを最小にする初速を [0.8,1.05]×v_Kep から求める
      const F = (v) => binLn(D, LM, LD, LRS, v, 0, EXWIN).excursion;
      let lo = 0.8 * VKEP, hi = 1.05 * VKEP;
      const gr = (Math.sqrt(5) - 1) / 2;
      let c = hi - gr * (hi - lo), e = lo + gr * (hi - lo), fc = F(c), fe = F(e);
      for (let it = 0; it < 24; it++) {
        if (fc < fe) { hi = e; e = c; fe = fc; c = hi - gr * (hi - lo); fc = F(c); }
        else { lo = c; c = e; fc = fe; e = lo + gr * (hi - lo); fe = F(e); }
      }
      const vOrb = fc < fe ? c : e;
      return { D, phiB: phiB(D, LM, LD), vOrb, vKep: VKEP,
        excursion: Math.min(fc, fe), n: nNet(D, LM, LD, LRS, vOrb) };
    });
    return { data, anchors, v25Gate: { pass: v25.pass, value: v25.value, detail: v25.detail },
      scanBinary: { m: M, dSep: DSEP, rs: RS, vOrb: VORB }, softening: SOFT,
      referenceScanLightBinary: { config: { m: LM, dSep: LD, rs: LRS, vOrbV25: 1.18927 },
        note: '初速を D ごとに最適化した参考系列(本図には描かない)', data: ref } };
  });
  const fig = lineChart({
    xlab: 'determinacy share of the box  phi_B', ylab: 'net expansion susceptibility  n_eff', legend: 'tl', xlo: 0, xhi: 1,
    series: [
      { pts: d.data.map(q => [q.phiB, q.n]), label: 'measured (binary m=2000, d=24)', wide: true, marker: true },
      { pts: [[0, 0], [1, 2]], label: 'rough estimate n = 2 phi_B', dash: '6 4', gray: true }
    ],
    marks: [
      { x: d.anchors.locallyDominated.phiB, y: d.anchors.locallyDominated.n, label: 'V25 locally dominated' },
      { x: d.anchors.boxDominated.phiB, y: d.anchors.boxDominated.n, label: 'V25 box dominated' }
    ]
  });
  await writeFig(pdfPage, 3, fig, {
    hook: 'V25(beta/index.html)の binLn/nNet を転記し、universeBox.D のみをスキャン(dPower=0・H=0.004・a=1.2 まで)',
    scanBinary: d.scanBinary, softening: d.softening, anchors: d.anchors, v25Gate: d.v25Gate, data: d.data,
    referenceScanLightBinary: d.referenceScanLightBinary
  });
  const a = d.anchors;
  gate('p2fig3.anchors', a.boxDominated.n > 1.0 && a.boxDominated.n < 2.5 && Math.abs(a.locallyDominated.n) < 0.4,
    `V25 アンカー: φ_B=${a.boxDominated.phiB.toFixed(3)}→n=${a.boxDominated.n.toFixed(2)}(本文 1.61)・φ_B=${a.locallyDominated.phiB.toFixed(3)}→n=${a.locallyDominated.n.toFixed(2)}(本文 0.00)`);
  const first = d.data[0], last = d.data[d.data.length - 1];
  gate('p2fig3.dial', last.n > first.n + 1.0,
    `n_eff は φ_B とともに単調増加(φ_B=${first.phiB.toFixed(3)}→${first.n.toFixed(2)} … φ_B=${last.phiB.toFixed(3)}→${last.n.toFixed(2)})`);
}

// ---- p2fig4: A/B/C 波長の思考実験(preset boxredshift・QA box.photon-abc と同一構成)----
if (want(4)) {
  const d = await page.evaluate(() => {
    const s = HP.sim;
    HP.loadPreset('boxredshift', false);
    const H0 = s.box.H0;
    const tracks = {};   // 飛行中の λ(t)=λ_E·a(t)/a_E と世界線 x(t)
    while (s.t < 75) {
      s.step(0.016);
      const a = Math.exp(H0 * s.t);
      for (const ph of s.photons) {
        const key = ph.from === 0 ? 'A' : 'B';
        if (!tracks[key]) tracks[key] = { emitT: ph.tE, lamE: ph.lamE, pts: [], path: [] };
        tracks[key].pts.push([+s.t.toFixed(3), ph.lamE * a / ph.aE]);
        tracks[key].path.push([+s.t.toFixed(3), +ph.x.toFixed(2)]);
      }
    }
    const log = s.photonLog.map(e => ({ ...e }));
    const aEnd = Math.exp(H0 * s.t);
    const worlds = [];   // 共動粒子 A/B/C の世界線(x ∝ a(t))
    for (let i = 0; i < 3; i++) worlds.push(s.x[i] / aEnd);
    return { H0, arrivals: log, photonWarn: s.photonWarn, nan: s.hasNaN(), tracks, worlds, tEnd: s.t };
  });
  const A = d.arrivals.find(e => e.from === 0), B = d.arrivals.find(e => e.from === 1);
  const ledgerMaxAbsErr = Math.max(...d.arrivals.map(e => Math.abs(e.lamO / e.lamE - e.aO / e.aE)));
  const dT = Math.abs(A.tO - B.tO);
  const pa = lineChart({
    h: 300, xlab: 'time t', ylab: 'wavelength lambda (nm)', legend: 'tl', title: 'wavelengths in flight',
    series: [
      { pts: d.tracks.A.pts, label: 'photon A (emitted t=0, a=1)', wide: true },
      { pts: d.tracks.B.pts, label: 'photon B (emitted t=34.657, a=2)', dash: '7 4' }
    ]
  });
  const wl = (x0) => Array.from({ length: 76 }, (_, k) => { const t = k * (d.tEnd / 75); return [t, x0 * Math.exp(d.H0 * t)]; });
  const pb = lineChart({
    h: 300, xlab: 'time t', ylab: 'position x', legend: 'tl', title: 'world lines: comoving A, B, C and the two photons',
    series: [
      { pts: wl(d.worlds[0]), label: 'comoving A / B / C', gray: true, dash: '3 3' },
      { pts: wl(d.worlds[1]), gray: true, dash: '3 3' },
      { pts: wl(d.worlds[2]), gray: true, dash: '3 3' },
      { pts: d.tracks.A.path, label: 'photon A', wide: true },
      { pts: d.tracks.B.path, label: 'photon B', dash: '7 4' }
    ]
  });
  const fig = panelStack([pa, pb]);
  await writeFig(pdfPage, 4, fig, {
    preset: 'boxredshift(QA box.photon-abc と同一構成・t<75 まで dt=0.016)',
    H0: d.H0, arrivals: d.arrivals, ledgerMaxAbsErr, photonWarn: d.photonWarn, nan: d.nan,
    lambdaTracks: { A: { emitT: d.tracks.A.emitT, lamE: d.tracks.A.lamE, n: d.tracks.A.pts.length },
      B: { emitT: d.tracks.B.emitT, lamE: d.tracks.B.lamE, n: d.tracks.B.pts.length } }
  });
  gate('p2fig4.ledger', ledgerMaxAbsErr < 1e-9,
    `波長保持則の帳簿 |λ_obs/λ_emit − a_obs/a_emit| 最大=${ledgerMaxAbsErr.toExponential(2)}(<1e-9 — 本文の「10^-9 未満で閉じる」)`);
  gate('p2fig4.redshift', Math.abs(A.z - 3) < 0.3 && Math.abs(B.z - 1) < 0.15 && !d.nan && !d.photonWarn,
    `z_A=${A.z.toFixed(4)}(3±0.3) z_B=${B.z.toFixed(4)}(1±0.15) λ ${A.lamE}→${A.lamO.toFixed(1)}nm / ${B.lamE}→${B.lamO.toFixed(1)}nm`);
  gate('p2fig4.simultaneous', dT < 8,
    `到着時刻 t_O=${A.tO.toFixed(3)} / ${B.tO.toFixed(3)}(差=${dT.toFixed(3)} — ほぼ同時観測)`);
}

// ---- p2fig5: 自由な箱 — 実測 a_eff(t)(圧力あり/なし。preset freebox・QA freebox.* と同一構成)----
if (want(5)) {
  const d = await page.evaluate(() => {
    const s = HP.sim;
    const base = () => JSON.parse(JSON.stringify(HP.allPresets().find(q => q.id === 'freebox')));
    const run = (p, steps) => {
      s.build(p);
      for (let k = 0; k < steps; k++) s.step(0.016);
      // 図に載る系列(a は 6桁丸め)から H_eff を出す — 図と JSON の数値が一致するように
      const hist = (s.boxHist || []).map(e => ({ t: +e.t.toFixed(2), a: +e.a.toFixed(6), H: e.H }));
      const half = Math.floor(hist.length / 2);
      const Hof = (i0, i1) => Math.log(hist[i1].a / hist[i0].a) / (hist[i1].t - hist[i0].t);
      let mono = true, aMax = 0, aMaxT = 0;
      for (let i = 0; i < hist.length; i++) {
        if (i && !(hist[i].a > hist[i - 1].a)) mono = false;
        if (hist[i].a > aMax) { aMax = hist[i].a; aMaxT = hist[i].t; }
      }
      return { hist, aLast: hist[hist.length - 1].a, H1: Hof(0, half), H2: Hof(half, hist.length - 1),
        mono, aMax, aMaxT, nan: s.hasNaN(),
        ledger: [s.resPx, s.resPy, s.resL, s.radE, s.radL] };
    };
    const on = run(base(), 1200);
    const p0 = base(); p0.physics.kRep = 0;
    const off = run(p0, 1200);
    return { on, off };
  });
  const pa = lineChart({
    h: 300, xlab: 'time t', ylab: 'measured scale factor a_eff', legend: 'tl', title: 'spin pressure on (kRep = 0.5)',
    series: [{ pts: d.on.hist.map(q => [q.t, q.a]), label: 'a_eff = <r_wall> / <r_wall>_0', wide: true, marker: true }]
  });
  const pb = lineChart({
    h: 300, xlab: 'time t', ylab: 'measured scale factor a_eff', legend: 'tl', title: 'pressure removed (kRep = 0) — magnified',
    series: [{ pts: d.off.hist.map(q => [q.t, q.a]), label: 'a_eff (gravity only)', wide: true, marker: true }]
  });
  const fig = panelStack([pa, pb]);
  await writeFig(pdfPage, 5, fig, {
    preset: 'freebox(QA freebox.* と同一構成・1200步=t19.2・dt=0.016)',
    pressureOn: { aLast: d.on.aLast, H1: d.on.H1, H2: d.on.H2, monotone: d.on.mono, ledger: d.on.ledger },
    pressureOff: { aMax: d.off.aMax, aMaxT: d.off.aMaxT, aLast: d.off.aLast, H1: d.off.H1, H2: d.off.H2 },
    data: { withPressure: d.on.hist, withoutPressure: d.off.hist }
  });
  gate('p2fig5.aeff', !d.on.nan && d.on.mono && d.on.aLast > 1.15 && d.on.H2 > d.on.H1,
    `圧力あり a_eff=${d.on.aLast.toFixed(4)}(本文 2.18・単調増加=${d.on.mono}) H_eff 前半${d.on.H1.toExponential(3)}→後半${d.on.H2.toExponential(3)}(加速)`);
  gate('p2fig5.closed', d.on.ledger.every(v => v === 0),
    `リザーバ帳簿=[${d.on.ledger.join(',')}](全0 — 完全閉鎖系)`);
  gate('p2fig5.recollapse', !d.off.nan && d.off.H1 > 0 && d.off.H2 < 0 && d.off.aMax > 1,
    `圧力なし a_eff 最大=${d.off.aMax.toFixed(4)}(本文 ≈1.005・t=${d.off.aMaxT.toFixed(1)})→ H_eff ${d.off.H1.toExponential(3)}→${d.off.H2.toExponential(3)}(符号反転=再収縮)`);
}

// ---- p2fig6: プローブ依存の膨張測定 H_w/H_geo(V29 の測定系を D/Kt × a のスキャンへ拡張)----
// 設計は docs/dev/EXP_4-66_PROBE_H_DESIGN.md §2。同じ w 実測から、E8R 指数形の光速則と
// 4-66 の対案(c_loc ∝ 1/W_B)の2通りで H を読み、後者では比が恒等 1(=プローブ依存なし)になる。
if (want(6)) {
  const d = await page.evaluate(() => {
    const H = 0.01, Kt = 300, c0 = 60, DT = 0.016, dP = 1, A_END = 3, NW = 24;
    const one = (dkt) => {
      const D = dkt * Kt;
      const s = HP.sim;
      s.build({ id: 'p2fig6', name: 'V29scan', camera: { scale: 300 }, world: { boundary: 'none', size: 0 },
        universeBox: { mode: 'exp', H0: H, D: D, dPower: dP, L: 260, cx: 0, cy: 0, vx: 0, vy: 0, omega: 0,
          amp: 0, freq: 0, phase: 0, friction: 'dfm' },
        physics: { G: 0, D0: 0, kFrame: 1, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, etaRad: 0,
          Kt: Kt, cLight: c0, softening: 4, timeScale: 1 },
        bodies: [{ type: 'single', m: 0.05, x: 100, y: 0, vx: H * 100, vy: 1, spin: 0, pinned: false }], overlays: {} });
      const cLoc = (a) => c0 * Math.exp(-2 * (D / a) / Kt);   // E8R 指数形(V28/V29 と同じ)
      // 4-66 対案: c_loc ∝ 1/W_B(W_B=D/a^dP → c_loc ∝ a^dP)。比だけ効くので R_inv = w·a^{−dP}
      const rInv = (a, w) => w * Math.pow(a, -dP);
      const w0 = 1;
      const samp = [{ t: 0, a: 1, w: w0 }];
      const targets = []; for (let i = 1; i <= NW; i++) targets.push(Math.pow(A_END, i / NW));
      let ti = 0;
      const steps = Math.ceil(Math.log(A_END) / H / DT) + 1;
      for (let k = 0; k < steps && ti < targets.length; k++) {
        s.step(DT);
        const a = Math.exp(H * s.t);
        if (a >= targets[ti]) { samp.push({ t: s.t, a, w: Math.hypot(s.vx[0] - H * s.x[0], s.vy[0] - H * s.y[0]) }); ti++; }
      }
      const rows = []; let wDrift = 0;
      for (let i = 1; i < samp.length; i++) {
        const p = samp[i - 1], n = samp[i];
        wDrift = Math.max(wDrift, Math.abs(n.w / w0 - 1));
        const R1 = p.w / cLoc(p.a), R2 = n.w / cLoc(n.a);
        const V1 = rInv(p.a, p.w), V2 = rInv(n.a, n.w);
        const Hgeo = Math.log(n.a / p.a) / (n.t - p.t);
        const Hw = -Math.log(R2 / R1) / (n.t - p.t);
        const Hi = -Math.log(V2 / V1) / (n.t - p.t);
        const ana = 2 * (D / Kt) * (1 / p.a - 1 / n.a) / Math.log(n.a / p.a);
        // 点値 2(D/Kt)a^{−dP} が窓平均に等しくなる a(図の横軸)
        const aEff = Math.log(n.a / p.a) / (1 / p.a - 1 / n.a);
        rows.push({ a1: p.a, a2: n.a, aEff, meas: Hw / Hgeo, ana, inv: Hi / Hgeo });
      }
      return { dkt, D, rows, wDrift };
    };
    const DKT = [0.3, 0.9242, 1.5];
    const series = DKT.map(one);
    const v29 = HP.verify.v29();
    return { series, v29Gate: { pass: v29.pass, value: v29.value, detail: v29.detail },
      physics: { Kt, cLight: c0, H0: H, dPower: dP, friction: 'dfm' } };
  });
  const all = d.series.flatMap(s => s.rows);
  const maxRelErrVsAnalytic = Math.max(...all.map(r => Math.abs(r.meas / r.ana - 1)));
  const maxAbsErrExponential = Math.max(...all.map(r => Math.abs(r.meas - r.ana)));
  const maxAbsErrControl = Math.max(...all.map(r => Math.abs(r.inv - 1)));
  const maxWDrift = Math.max(...d.series.map(s => s.wDrift));
  const cal = d.series[1];
  const nearest = cal.rows.reduce((b, r) => Math.abs(r.aEff - 2) < Math.abs(b.aEff - 2) ? r : b, cal.rows[0]);
  const calVal = 2 * cal.dkt / 2;
  const sep = 1 - cal.dkt, ratio = sep / maxAbsErrControl;
  const fig = lineChart({
    xlab: 'scale factor a', ylab: 'H_w / H_geo', legend: 'tr', title: 'probe-dependent expansion measurement',
    series: [
      ...d.series.map((s, i) => ({ pts: s.rows.map(r => [r.aEff, r.meas]), wide: i === 1,
        label: `measured, D/Kt = ${s.dkt}` })),
      ...d.series.map(s => ({ pts: s.rows.map(r => [r.aEff, r.ana]), gray: true, dash: '2 3',
        label: s.dkt === d.series[0].dkt ? 'analytic 2(D/Kt) a^-dP' : '' })),
      { pts: cal.rows.map(r => [r.aEff, r.inv]), dash: '6 4', label: 'control c_loc ~ 1/W (identically dP=1)' }
    ],
    marks: [{ x: nearest.aEff, y: nearest.meas, label: 'calibration a=2, D/Kt=0.9242' }]
  });
  await writeFig(pdfPage, 6, fig, {
    design: 'docs/dev/EXP_4-66_PROBE_H_DESIGN.md §2(V29 の測定系を D/Kt スキャンへ拡張)',
    physics: d.physics,
    analytic: 'H_w/H_geo = 2(D/Kt)·dP·a^{-dP}(窓平均 2(D/Kt)(1/a1−1/a2)/ln(a2/a1))',
    control: '4-66 対案 c_loc ∝ 1/W_B(同じ w 実測からの後処理)→ H_w/H_geo ≡ dP = 1',
    maxRelErrVsAnalytic, maxAbsErrExponential, maxAbsErrControl, maxWDrift,
    calibrationPoint: { dkt: cal.dkt, a: 2, value: calVal,
      nearestWindow: { a1: nearest.a1, a2: nearest.a2, aEff: nearest.aEff, meas: nearest.meas, ana: nearest.ana, inv: nearest.inv } },
    v29Gate: d.v29Gate,
    data: d.series.map(s => ({ dkt: s.dkt, D: s.D, rows: s.rows }))
  });
  gate('p2fig6.analytic', maxRelErrVsAnalytic < 1e-2 && maxWDrift < 1e-3,
    `H_w/H_geo 実測 vs 解析の最大相対誤差=${maxRelErrVsAnalytic.toExponential(2)}(<1e-2 — 本文 5.3e-4 と同水準)・w 保存ずれ最大=${maxWDrift.toExponential(2)}(<1e-3)`);
  gate('p2fig6.calibration', Math.abs(calVal - cal.dkt) < 1e-12,
    `較正点 a=2・D/Kt=${cal.dkt} の点値=${calVal.toFixed(6)}(= D/Kt。本文 (2/3)ln4≈0.9242)`);
  gate('p2fig6.control', maxAbsErrControl < 1e-2 && ratio > 10,
    `反比例対照は恒等 1(|比−1| 最大=${maxAbsErrControl.toExponential(2)}<1e-2)・a=2 で指数形(${cal.dkt})と反比例(1)の差=${sep.toFixed(4)} は達成精度 ${maxAbsErrControl.toExponential(2)} の ${ratio.toFixed(1)} 倍(>10 — 2つの光速則は内側から判別可能)`);
}

// ---- p2fig7: 外来光線の掃き出し(preset rotorSolo・QA behavior.rotorSolo と同一光線条件)----
if (want(7)) {
  const d = await page.evaluate(() => {
    const s = HP.sim;
    const P = (spin) => { const p = JSON.parse(JSON.stringify(HP.allPresets().find(q => q.id === 'rotorSolo')));
      p.bodies[0].spin = spin; return p; };
    const trace = (y0) => { let minR = Infinity; const pts = [[-300, y0]];
      const t = HP.traceRay(s, -300, y0, 1, 0, 2.7, 340, (px, py) => {
        const rr = Math.hypot(px, py); if (rr < minR) minR = rr;
        pts.push([+px.toFixed(1), +py.toFixed(1)]);
      });
      return { endR: Math.hypot(t.x, t.y), minR, pts }; };
    const fan = () => { let cap = 0, n = 0, mrP = 0, mrR = 0; const rays = [];
      for (let y = 8; y <= 200; y += 8) { n++;
        const tp = trace(-y), tr = trace(y);      // y<0=順行側 / y>0=逆行側
        mrP += tp.minR; mrR += tr.minR;
        if (tp.endR < 300) cap++; if (tr.endR < 300) cap++;
        rays.push(tp.pts, tr.pts); }
      return { rate: cap / (2 * n), minRpro: mrP / n, minRretro: mrR / n, rays }; };
    const run = (spin, Kt) => { const p = P(spin); if (Kt) p.physics.Kt = Kt;
      s.build(p); s.step(0.016);
      const bodies = []; for (let i = 0; i < s.n; i++) bodies.push([s.x[i], s.y[i], s.R[i]]);
      return Object.assign({ lS: s.lSw[0], bodies }, fan()); };
    return { ctrl: run(0), sat: run(0.3), def: run(2), lock: run(2, 3600) };
  });
  const pa = rayPanel({ rays: d.ctrl.rays, bodies: d.ctrl.bodies, box: 330,
    title: 'preset rotorSolo, non-spinning control (s = 0)' });
  const pb = rayPanel({ rays: d.def.rays, bodies: d.def.bodies, box: 330, spinArrow: 1,
    title: 'core spin s = 2: capture eliminated, fan asymmetric' });
  const fig = panelStack([pa, pb]);
  await writeFig(pdfPage, 7, fig, {
    preset: 'rotorSolo(QA behavior.rotorSolo と同一光線条件: x0=-300・dl=2.7・340步・終端 r<300 を非脱出とする)',
    nonEscapeRate: { spin0: d.ctrl.rate, spin0_3: d.sat.rate, spin2: d.def.rate, spin2_physLock_Kt3600: d.lock.rate },
    selfLightSweep_lSeff: { spin0: d.ctrl.lS, spin0_3: d.sat.lS, spin2: d.def.lS },
    minApproachRadius_spin2: { prograde: d.def.minRpro, retrograde: d.def.minRretro },
    note: '②自光の掻出(lightSweep)が飽和する spin=0.3 でも ③掃き出しは未発火 = 別機構(DERIVATIONS §17)'
  });
  const asym = d.def.minRpro / d.def.minRretro;
  gate('p2fig7.asymmetry', asym > 2,
    `最小接近半径 順行=${d.def.minRpro.toFixed(1)} 逆行=${d.def.minRretro.toFixed(1)}(比 ${asym.toFixed(2)}>2)`);
  gate('p2fig7.orthogonal', d.sat.lS > 0.99 && d.sat.rate >= d.ctrl.rate * 0.8,
    `spin0.3 で ②lS_eff=${d.sat.lS.toFixed(2)}(飽和)でも ③非脱出率=${d.sat.rate.toFixed(2)}(≥対照×0.8 — 2機構は独立)`);
  gate('p2fig7.physlock', d.lock.rate < 0.05,
    `物理対応ロック Kt=c²/G=3600 で非脱出率=${d.lock.rate.toFixed(2)}(<0.05 — 掃き出しは強場トイ域のみ)`);
  gate('p2fig7.sweepout', d.ctrl.rate > 0.4 && d.def.rate < 0.15,
    `非脱出率: spin0=${d.ctrl.rate.toFixed(2)}(>0.4) → spin2=${d.def.rate.toFixed(2)}(<0.15 — 掃き出しで捕捉が消える)`);
}

// ---- p2fig8: 引きずり増強の半径依存(tests/seeds.mjs 台帳4-49 の8帯測定系を転記・8seed)----
if (want(8)) {
  const SEEDS = [20260723, 1, 2, 3, 4, 5, 6, 7];
  const BANDS = Array.from({ length: 8 }, (_, i) => {
    const lo = 40 + i * (300 - 40) / 8, hi = 40 + (i + 1) * (300 - 40) / 8;
    return { lo, hi, mid: (lo + hi) / 2 };
  });
  const perSeed = [];
  for (const seed of SEEDS) {
    perSeed.push(await page.evaluate(({ seed, BANDS }) => {
      // tests/seeds.mjs(台帳4-49)の測定式を転記(outer / vMeasBand / vBarAt)
      const outer = (sm) => { let sum = 0, c = 0;
        for (let i = 1; i < sm.n; i++) { const r2 = Math.hypot(sm.x[i], sm.y[i]);
          if (r2 >= 156 && r2 <= 286) { sum += (sm.x[i] * sm.vy[i] - sm.y[i] * sm.vx[i]) / r2; c++; } }
        return c ? sum / c : 0; };
      const vMeasBand = (sm, lo, hi) => { let sum = 0, c = 0;
        for (let i = 1; i < sm.n; i++) { const r2 = Math.hypot(sm.x[i], sm.y[i]);
          if (r2 >= lo && r2 < hi) { sum += (sm.x[i] * sm.vy[i] - sm.y[i] * sm.vx[i]) / r2; c++; } }
        return { v: c ? sum / c : 0, n: c }; };
      const vBarAt = (sm, r) => {
        const G = sm.params.G, eps2 = sm.params.softening * sm.params.softening;
        let accSum = 0;
        for (let a2 = 0; a2 < 8; a2++) {
          const th = (a2 / 8) * Math.PI * 2, px = r * Math.cos(th), py = r * Math.sin(th);
          let axp = 0, ayp = 0;
          for (let j = 0; j < sm.n; j++) {
            const dx = sm.x[j] - px, dy = sm.y[j] - py, d2 = dx * dx + dy * dy;
            const fg = G * sm.m[j] / Math.pow(d2 + eps2, 1.5);
            axp += fg * dx; ayp += fg * dy;
          }
          accSum += -(axp * Math.cos(th) + ayp * Math.sin(th));
        }
        const ar = accSum / 8;
        return ar > 0 ? Math.sqrt(r * ar) : 0;
      };
      const profileOf = (sm) => BANDS.map(({ lo, hi, mid }) => {
        const m = vMeasBand(sm, lo, hi), vBar = vBarAt(sm, mid);
        return { rMid: mid, ratio: vBar > 0 ? m.v / vBar : null, nPart: m.n };
      });
      const galP = HP.allPresets().find(q => q.id === 'galaxy');
      const buildGalaxy = (kFrame) => {
        const preset = JSON.parse(JSON.stringify(galP));
        preset.seed = seed; preset.physics.kFrame = kFrame;
        HP.sim.build(HP.validatePreset(preset).preset);
      };
      buildGalaxy(1);
      for (let k = 0; k < 6000; k++) HP.sim.step(0.016);
      const galA = outer(HP.sim), nanA = HP.sim.hasNaN(), A = profileOf(HP.sim);
      buildGalaxy(0);
      for (let k = 0; k < 6000; k++) HP.sim.step(0.016);
      const galB = outer(HP.sim), nanB = HP.sim.hasNaN(), B = profileOf(HP.sim);
      return { seed, boost: galB !== 0 ? galA / galB : 0, nan: nanA || nanB, A, B };
    }, { seed, BANDS }));
    console.log(`  p2fig8: seed ${seed} 完了`);
  }
  // 統計(tests/seeds.mjs の stats と同式 — 標本標準偏差 n−1。seed 順のまま合計する)
  const stats = (arr) => {
    const a = arr.filter(v => Number.isFinite(v));
    const n = a.length;
    if (!n) return { n: 0, mean: null, sd: null };
    const mean = a.reduce((s, v) => s + v, 0) / n;
    const sd = n > 1 ? Math.sqrt(a.reduce((s, v) => s + (v - mean) ** 2, 0) / (n - 1)) : 0;
    return { n, mean, sd };
  };
  const MINP = 3;   // 帯に粒子が3個未満の seed はその帯から除外
  const profOf = (key) => BANDS.map((b, i) => {
    const vals = perSeed.filter(s => s[key][i].nPart >= MINP).map(s => s[key][i].ratio);
    const st = stats(vals);
    return { rMid: b.mid, n: st.n, mean: st.mean, sd: st.sd, seedsUsed: st.n };
  });
  const kFrame1 = profOf('A'), kFrame0 = profOf('B');
  const enhancementByBand = BANDS.map((b, i) => {
    const vals = perSeed.filter(s => s.A[i].nPart >= MINP && s.B[i].nPart >= MINP).map(s => s.A[i].ratio / s.B[i].ratio);
    const st = stats(vals);
    return { rMid: b.mid, n: st.n, mean: st.mean, sd: st.sd };
  });
  const usable = enhancementByBand.filter(e => e.n > 0);
  const innermostUsableBand = usable[0], outermostUsableBand = usable[usable.length - 1];
  const ob = stats(perSeed.map(s => s.boost));
  const outerBoost = { mean: ob.mean, sd: ob.sd, n: ob.n };
  const pa = lineChart({
    h: 300, xlab: 'radius r', ylab: 'v(r) / v_bar(r)', legend: 'tl', title: 'measured rotation against the baryonic baseline',
    series: [
      { pts: kFrame1.map(q => [q.rMid, q.mean]), err: kFrame1.map(q => [q.rMid, q.mean, q.sd]), label: 'kF = 1 (dragging)', wide: true, marker: true },
      { pts: kFrame0.map(q => [q.rMid, q.mean]), err: kFrame0.map(q => [q.rMid, q.mean, q.sd]), label: 'kF = 0 (control)', dash: '7 4', marker: true }
    ]
  });
  const pb = lineChart({
    h: 300, xlab: 'radius r', ylab: 'enhancement  (kF=1) / (kF=0)', legend: 'tr', title: 'where the dragging boost lives',
    series: [
      { pts: enhancementByBand.map(q => [q.rMid, q.mean]), err: enhancementByBand.map(q => [q.rMid, q.mean, q.sd]),
        label: 'band-wise enhancement (8 seeds)', wide: true, marker: true },
      { pts: BANDS.map(b => [b.mid, 1]), label: 'no enhancement', dash: '2 3', gray: true }
    ]
  });
  const fig = panelStack([pa, pb]);
  await writeFig(pdfPage, 8, fig, {
    source: 'tests/seeds.mjs(台帳4-49)の8帯測定系を転記・preset galaxy・6000步・dt=0.016',
    seeds: SEEDS, bands: BANDS,
    ratioProfile: { kFrame1, kFrame0 },
    enhancementByBand, innermostUsableBand, outermostUsableBand, outerBoost,
    note: '帯に粒子が3個未満の seed はその帯から除外(外縁は 6000 步で粒子が抜ける)',
    perSeed
  });
  const inner = kFrame1.map((q, i) => q.n > 0 && kFrame0[i].n > 0 && q.mean > kFrame0[i].mean);
  const cmp = [3, 4];
  gate('p2fig8.dragging', inner.every((v, i) => v || kFrame1[i].n === 0 || kFrame0[i].n === 0),
    `kF=1 は全内側帯で kF=0 を上回る(r=${kFrame1[cmp[0]].rMid.toFixed(1)}: ${kFrame1[cmp[0]].mean.toFixed(3)} vs ${kFrame0[cmp[0]].mean.toFixed(3)} / `
    + `r=${kFrame1[cmp[1]].rMid.toFixed(1)}: ${kFrame1[cmp[1]].mean.toFixed(3)} vs ${kFrame0[cmp[1]].mean.toFixed(3)})`);
  gate('p2fig8.outerboost', outerBoost.mean > 1.04 && !perSeed.some(s => s.nan),
    `外縁増強(kF1/kF0, r∈[156,286]) = ${outerBoost.mean.toFixed(3)} ± ${outerBoost.sd.toFixed(3)}(本文 1.332±0.009・8seed)`);
  gate('p2fig8.profile', innermostUsableBand.mean > outermostUsableBand.mean,
    `帯別増強比は内側ほど大: ${innermostUsableBand.mean.toFixed(2)}(r=${innermostUsableBand.rMid.toFixed(0)}・本文 1.58)→ `
    + `${outermostUsableBand.mean.toFixed(2)}(r=${outermostUsableBand.rMid.toFixed(0)}・本文 1.16)。`
    + `全帯 ${enhancementByBand.map(e => e.mean === null ? 'n/a' : e.mean.toFixed(2)).join('/')}`);
}

await browser.close();
if (errs.length) console.log('page errors:', errs.slice(0, 3));
const ok = gates.every(g => g.pass) && errs.length === 0;
fs.writeFileSync(path.join(OUT, 'p2figs-gates.json'), JSON.stringify({
  paper: 'dfm-paper2', commit, target: TARGET, generated: new Date().toISOString(), gates, pageErrors: errs
}, null, 1));
console.log(ok ? `ALL GATES PASS (${gates.length})` : 'GATE FAIL');
process.exit(ok ? 0 : 1);
