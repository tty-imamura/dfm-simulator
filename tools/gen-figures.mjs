// 論文図生成パイプライン(HANDOFF_IMPLEMENTATION 付録O O3)
// - index.html の HP フック(sim/traceRay/abStart)を headless Chromium で直接駆動し、
//   図データを収集 → 自前 SVG 描画 → Chromium print-to-PDF で paper/figures/ へ出力。
// - 各図に .json(生成パラメータ+実測値+コミット)を併置(図の機械可読な出典)。
// - 実行: `node tools/gen-figures.mjs`(全図)/ FIG=2,5 で個別再生成。
// - 外部チャートライブラリは使わない(単一HTML・ゼロ依存の設計思想と揃える)。
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const INDEX = 'file://' + path.join(ROOT, 'index.html');
const OUT = path.join(ROOT, 'paper', 'figures');
fs.mkdirSync(OUT, { recursive: true });
const ONLY = process.env.FIG ? process.env.FIG.split(',').map(Number) : null;
const want = (n) => !ONLY || ONLY.includes(n);

let commit = 'unknown';
try { commit = execSync('git rev-parse --short HEAD', { cwd: ROOT, stdio: 'pipe' }).toString().trim(); } catch {}

async function getBrowser() {
  const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  try { const { chromium } = await import('playwright'); return await chromium.launch(); } catch {}
  try { const { chromium } = await import('playwright-core'); return await chromium.launch({ executablePath: exe }); } catch {}
  throw new Error('playwright が見つかりません(npm install)');
}

// ===== SVG 描画ヘルパ(印刷向け: 黒基調・serif・単色+線種で系列を区別) =====
const FONT = `font-family="Georgia,'Times New Roman',serif"`;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const niceTicks = (lo, hi, n = 5) => {
  const span = hi - lo, step0 = span / n, mag = Math.pow(10, Math.floor(Math.log10(step0)));
  const step = [1, 2, 2.5, 5, 10].map(m => m * mag).find(s => span / s <= n + 1) || mag * 10;
  const t = []; for (let v = Math.ceil(lo / step) * step; v <= hi + 1e-9; v += step) t.push(+v.toFixed(10));
  return t;
};
const fmtTick = (v) => Math.abs(v) >= 100 ? v.toFixed(0) : (Math.abs(v) >= 1 ? +v.toFixed(2) + '' : +v.toFixed(3) + '');

// 折れ線図。series: {pts:[[x,y],...], dash?, wide?, gray?, label, marker?}
function lineChart({ w = 520, h = 360, ml = 62, mr = 14, mt = 14, mb = 46, xlab, ylab, xlog = false,
  series, xlo, xhi, ylo, yhi, legend = 'tr', title = '' }) {
  const pts = series.flatMap(s => s.pts).filter(p => p[1] !== null && isFinite(p[1]));
  const X = (v) => xlog ? Math.log10(v) : v;
  const xs = pts.map(p => X(p[0])), ys = pts.map(p => p[1]);
  const x0 = xlo !== undefined ? X(xlo) : Math.min(...xs), x1 = xhi !== undefined ? X(xhi) : Math.max(...xs);
  let y0 = ylo !== undefined ? ylo : Math.min(...ys), y1 = yhi !== undefined ? yhi : Math.max(...ys);
  if (y0 === y1) { y0 -= 1; y1 += 1; } const pad = (y1 - y0) * 0.06; if (ylo === undefined) y0 -= pad; if (yhi === undefined) y1 += pad;
  const pw = w - ml - mr, ph = h - mt - mb;
  const px = (v) => ml + (X(v) - x0) / (x1 - x0) * pw, py = (v) => mt + (1 - (v - y0) / (y1 - y0)) * ph;
  const xt = xlog ? series[0].pts.map(p => p[0]) : niceTicks(x0, x1), yt = niceTicks(y0, y1);
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
    if (s.marker) for (const q of p) g += `<circle cx="${px(q[0]).toFixed(1)}" cy="${py(q[1]).toFixed(1)}" r="3" fill="${stroke}"/>`;
  }
  // 凡例
  const lx = legend === 'tr' ? w - mr - 150 : ml + 12, ly = mt + 10;
  // 凡例はラベル付き系列のみ描く(ラベル空の解析曲線ペアで空行が出ないように — 論文 Fig.1 指摘対応)
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

// 棒図(カテゴリ×最大2系列)。cats: {label, vals:[..], err?}
function barChart({ w = 520, h = 340, ml = 62, mr = 14, mt = 18, mb = 58, cats, seriesLabels, ylab, ylo, yhi, hatchSecond = true }) {
  const all = cats.flatMap(c => c.vals);
  let y0 = ylo !== undefined ? ylo : Math.min(0, ...all), y1 = yhi !== undefined ? yhi : Math.max(0, ...all);
  const pad = (y1 - y0) * 0.08; if (ylo === undefined) y0 -= pad; if (yhi === undefined) y1 += pad;
  const pw = w - ml - mr, ph = h - mt - mb, py = (v) => mt + (1 - (v - y0) / (y1 - y0)) * ph;
  const nS = seriesLabels.length, slot = pw / cats.length, bw = Math.min(34, slot * 0.7 / nS);
  let g = `<rect width="${w}" height="${h}" fill="white"/>` +
    `<defs><pattern id="hat" width="5" height="5" patternTransform="rotate(45)" patternUnits="userSpaceOnUse"><line x1="0" y1="0" x2="0" y2="5" stroke="#555" stroke-width="1.4"/></pattern></defs>`;
  const yt = niceTicks(y0, y1);
  for (const v of yt) g += `<line x1="${ml}" y1="${py(v)}" x2="${w - mr}" y2="${py(v)}" stroke="#ddd" stroke-width="0.6"/>` +
    `<line x1="${ml - 4}" y1="${py(v)}" x2="${ml}" y2="${py(v)}" stroke="black"/>` +
    `<text x="${ml - 7}" y="${py(v) + 4}" text-anchor="end" font-size="12" ${FONT}>${fmtTick(v)}</text>`;
  g += `<rect x="${ml}" y="${mt}" width="${pw}" height="${ph}" fill="none" stroke="black" stroke-width="1"/>`;
  if (y0 < 0 && y1 > 0) g += `<line x1="${ml}" y1="${py(0)}" x2="${w - mr}" y2="${py(0)}" stroke="black" stroke-width="1"/>`;
  cats.forEach((c, ci) => {
    const cx = ml + slot * (ci + 0.5);
    c.vals.forEach((v, si) => {
      const bx = cx - (nS * bw) / 2 + si * bw;
      const top = py(Math.max(0, v)), bh = Math.abs(py(v) - py(0));
      const fill = si === 1 && hatchSecond ? 'url(#hat)' : (si === 0 ? '#444' : '#999');
      g += `<rect x="${bx}" y="${top}" width="${bw - 3}" height="${bh}" fill="${fill}" stroke="black" stroke-width="0.8"/>`;
      g += `<text x="${bx + (bw - 3) / 2}" y="${py(v) + (v >= 0 ? -5 : 14)}" text-anchor="middle" font-size="11" ${FONT}>${esc(c.txt ? c.txt[si] : '')}</text>`;
    });
    const lines = String(c.label).split('\n');
    lines.forEach((ln, li) => g += `<text x="${cx}" y="${mt + ph + 16 + li * 13}" text-anchor="middle" font-size="12" ${FONT}>${esc(ln)}</text>`);
  });
  seriesLabels.forEach((sl, si) => {
    const fill = si === 1 && hatchSecond ? 'url(#hat)' : (si === 0 ? '#444' : '#999');
    g += `<rect x="${ml + 10 + si * 130}" y="${mt + 6}" width="14" height="10" fill="${fill}" stroke="black" stroke-width="0.8"/>` +
      `<text x="${ml + 28 + si * 130}" y="${mt + 15}" font-size="12" ${FONT}>${esc(sl)}</text>`;
  });
  g += `<text x="16" y="${mt + ph / 2}" text-anchor="middle" font-size="14" ${FONT} transform="rotate(-90 16 ${mt + ph / 2})">${esc(ylab)}</text>`;
  return { svg: g, w, h };
}

// 光線パネル(ワールド座標の等方描画)。rays: [[x,y],...][]、bodies: [x,y,R][]
function rayPanel({ w = 520, h = 330, rays, bodies, box = 330, title = '' }) {
  const sc = Math.min(w / (2.2 * box), h / (2 * box)) * 0.98;
  const px = (x) => w / 2 + x * sc, py = (y) => h / 2 - y * sc;
  let g = `<rect width="${w}" height="${h}" fill="white"/><rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" fill="none" stroke="black" stroke-width="1"/>`;
  for (const b of bodies) g += `<circle cx="${px(b[0]).toFixed(1)}" cy="${py(b[1]).toFixed(1)}" r="${(b[2] * sc).toFixed(1)}" fill="#ccc" stroke="black" stroke-width="1"/>`;
  for (const r of rays) g += `<polyline fill="none" stroke="black" stroke-width="0.9" opacity="0.85" points="${r.filter(p => Math.abs(p[0]) < box * 1.15 && Math.abs(p[1]) < box * 1.05).map(p => `${px(p[0]).toFixed(1)},${py(p[1]).toFixed(1)}`).join(' ')}"/>`;
  if (title) g += `<text x="34" y="20" font-size="13" ${FONT}>${esc(title)}</text>`;
  return { svg: g, w, h };
}

function panelStack(panels, gap = 8) { // (a)(b) 縦積み
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
  fs.writeFileSync(path.join(OUT, `fig${n}.svg`), svg);
  fs.writeFileSync(path.join(OUT, `fig${n}.json`), JSON.stringify({ figure: n, generated: new Date().toISOString(), commit, ...data }, null, 1));
  await pdfPage.setContent(`<html><head><style>@page{margin:0;size:${fig.w}px ${fig.h}px}body{margin:0}</style></head><body>${svg}</body></html>`);
  await pdfPage.pdf({ path: path.join(OUT, `fig${n}.pdf`), width: `${fig.w}px`, height: `${fig.h}px`, printBackground: true });
  console.log(`fig${n}: svg/pdf/json 生成`);
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

// ---- Fig 1: mach D₀ スキャン — 局所フレームの共回転率(E3 直接測定。付録O 書き戻し:
// 粒子の巻き込み測定は環の重力攪拌(G=0.02)に埋もれるため、エンジンが返す u_φ/(Ω r) を
// 内側プローブ(r=40/80 各4方位)で読む方式に確定。ω_u ∝ w̄/(w̄+D₀) の「バケツのダイヤル」)----
if (want(1)) {
  const d = await page.evaluate(() => {
    // v1.24 で 🪣mach プリセットは廃止(後継=箱宇宙は Phase 2)。図の出典が壊れないよう、
    // 旧 mach のリング構成(リングのみ+D₀ 上書き — 従来の filter 結果と同一)をここに明示する。
    const base = { id: 'fig_mach', name: 'Mach ring', camera: { scale: 220 }, world: { boundary: 'none', size: 0 },
      physics: { G: 0.02, D0: 0.5, kFrame: 1, q: 2, kRep: 1, muF: 0.5, gammaN: 0.4, kappaS: 0.05, Kt: 60,
        cLight: 60, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0, geoPN: 0, lambdaPN: 1, pnAlpha: 1.5,
        radiusScale: 1.2, softening: 2, timeScale: 2 },
      bodies: [
        { type: 'ring', n: 14, cx: 0, cy: 0, rIn: 150, rOut: 150, mMin: 80, mMax: 80,
          spinMin: 0.5, spinMax: 0.5, vMode: 'omega', aroundMass: 0, omega: 0.012, vNoise: 0, direction: 1, pinned: true }
      ], overlays: {} };
    const OMEGA = 0.012, out = [];
    for (const D0 of [0.05, 0.2, 0.5, 1, 2, 4, 8, 16, 32, 64, 128]) {
      const p = JSON.parse(JSON.stringify(base));
      p.physics = Object.assign({}, p.physics, { D0 });
      for (const r of [40, 80]) for (const a of [0, 90, 180, 270]) {
        const th = a * Math.PI / 180;
        p.bodies.push({ type: 'single', m: 0.01, x: r * Math.cos(th), y: r * Math.sin(th),
          vx: 0, vy: 0, spin: 0, pinned: false });
      }
      const s = HP.sim; s.build(p);
      for (let k = 0; k < 2; k++) s.step(0.016);
      const omAt = (i0) => { let acc = 0;
        for (let i = i0; i < i0 + 4; i++) {
          const r = Math.hypot(s.x[i], s.y[i]);
          acc += (s.x[i] * s.uPy[i] - s.y[i] * s.uPx[i]) / (r * r);
        } return acc / 4; };
      // 解析値: u = Σw_j(v_j+spin項)/(Σw+D₀) — 分子は D₀ 非依存なので、環の寄与を実測から分離
      const eps = s.params.softening;
      const wsum = (r) => { let w = 0;
        for (let j = 0; j < 14; j++) { const d2 = (s.x[j] - r) ** 2 + s.y[j] ** 2; w += s.m[j] / Math.sqrt(d2 + eps * eps); }
        return w; };
      out.push({ D0, om40: omAt(14) / OMEGA, om80: omAt(18) / OMEGA, w40: wsum(40), w80: wsum(80) });
    }
    return out;
  });
  // 解析曲線: ω_u(D₀) = ω_u(D₀_min)·(w̄+D₀_min)/(w̄+D₀)(u の分母だけが D₀ に依存する構成的恒等式)
  const ana = (key, wkey) => d.map(q => [q.D0, d[0][key] * (d[0][wkey] + d[0].D0) / (q[wkey] + q.D0)]);
  const fig = lineChart({
    xlab: 'background determinacy D0 (log scale)', ylab: 'frame co-rotation rate  omega_u / Omega_shell',
    xlog: true, ylo: 0,
    series: [
      { pts: d.map(q => [q.D0, q.om40]), label: 'probe r=40 (engine E3)', marker: true, wide: true },
      { pts: d.map(q => [q.D0, q.om80]), label: 'probe r=80 (engine E3)', marker: true },
      { pts: ana('om40', 'w40'), label: 'w/(w+D0) scaling', dash: '6 4', gray: true },
      { pts: ana('om80', 'w80'), label: '', dash: '6 4', gray: true }
    ]
  });
  const err = Math.max(...d.map((q, i) => Math.abs(q.om40 - ana('om40', 'w40')[i][1]) / Math.max(1e-9, q.om40)));
  await writeFig(pdfPage, 1, fig, { preset: 'bucket ring config (14 pinned ring sources + 8 probes; former mach preset)', scan: { D0: d.map(q => q.D0) },
    scalingRelErr: err, data: d });
  gate('fig1.dial', d[0].om40 > 10 * d[d.length - 1].om40 && d.every((q, i) => i === 0 || q.om40 <= d[i - 1].om40 + 1e-6) && err < 0.05,
    `om40: ${d[0].om40.toFixed(3)}→${d[d.length - 1].om40.toFixed(3)} 解析との差=${(err * 100).toFixed(1)}%`);
}

// ---- Fig 2: galaxy A/B 回転曲線(実プリセット+abStart、6000步、幅20ビン)----
if (want(2)) {
  const d = await page.evaluate(() => {
    HP.loadPreset('galaxy', false);
    HP.abStart('kFrame', 0);
    const A = HP.sim, B = HP.ab().simB;
    for (let k = 0; k < 6000; k++) { A.step(0.016); B.step(0.016); }
    const prof = (s) => {
      const bins = Array.from({ length: 14 }, (_, b) => ({ r: 20 + b * 20, sum: 0, c: 0 }));
      for (let i = 1; i < s.n; i++) {
        const r = Math.hypot(s.x[i], s.y[i]), b = Math.floor((r - 10) / 20);
        if (b >= 0 && b < 14) { bins[b].sum += (s.x[i] * s.vy[i] - s.y[i] * s.vx[i]) / r; bins[b].c++; }
      }
      return bins.map(b => ({ r: b.r, v: b.c >= 3 ? b.sum / b.c : null, n: b.c }));
    };
    const outer = (s) => { let sum = 0, c = 0;
      for (let i = 1; i < s.n; i++) { const r = Math.hypot(s.x[i], s.y[i]);
        if (r >= 156 && r <= 286) { sum += (s.x[i] * s.vy[i] - s.y[i] * s.vx[i]) / r; c++; } }
      return c ? sum / c : 0; };
    const res = { a: prof(A), b: prof(B), ratio: outer(A) / outer(B), nan: A.hasNaN() || B.hasNaN() };
    HP.abStop();
    return res;
  });
  const kep = d.a.map(q => [q.r, Math.sqrt(600 / q.r)]);
  const fig = lineChart({
    xlab: 'radius r', ylab: 'mean tangential velocity v_phi', ylo: 0,
    series: [
      { pts: d.a.map(q => [q.r, q.v]), label: 'kF = 1 (dragging)', wide: true, marker: true },
      { pts: d.b.map(q => [q.r, q.v]), label: 'kF = 0 (Newtonian control)', dash: '7 4', marker: true },
      { pts: kep, label: 'Keplerian sqrt(GM/r)', dash: '2 3', gray: true }
    ]
  });
  await writeFig(pdfPage, 2, fig, { preset: 'galaxy + abStart(kFrame,0)', steps: 6000, outerRatio: d.ratio, data: { a: d.a, b: d.b } });
  gate('fig2.flatten', !d.nan && d.ratio > 1.04, `外縁比 kF1/kF0=${d.ratio.toFixed(3)} (>1.04)`);
}

// ---- Fig 3: V6 歳差(3構成)+ drag ロゼット ----
if (want(3)) {
  const d = await page.evaluate(() => {
    const run = (S, kf) => {
      const s = HP.sim;
      s.build({ id: 'fig_v6', name: 'V6', camera: { scale: 200 }, world: { boundary: 'none', size: 0 },
        physics: { G: 1, D0: 0.05, kFrame: kf, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, etaRad: 0,
          Kt: 60, cLight: 60, softening: 2, timeScale: 1 },
        bodies: [
          { type: 'single', m: 150, x: 0, y: 0, vx: 0, vy: 0, spin: S, pinned: true },
          { type: 'single', m: 0.01, x: 30, y: 0, vx: 0, vy: Math.sqrt(150 * 1.5 / 30), spin: 0, pinned: false }
        ], overlays: {} });
      const peri = []; let lastK = -1e9, r2 = 0, r1 = 0, th1 = 0;
      for (let k = 0; k < 140000 && peri.length < 4; k++) {
        s.step(0.016);
        const r = Math.hypot(s.x[1], s.y[1]), th = Math.atan2(s.y[1], s.x[1]);
        if (k > 2 && r1 < r2 && r1 < r && r1 < 50 && (k - lastK) > 4000) { peri.push(th1); lastK = k; }
        r2 = r1; r1 = r; th1 = th;
      }
      let acc = 0;
      for (let i = 1; i < peri.length; i++) {
        let dd = peri[i] - peri[i - 1];
        while (dd > Math.PI) dd -= 2 * Math.PI; while (dd < -Math.PI) dd += 2 * Math.PI;
        acc += dd;
      }
      return (peri.length > 1 ? acc / (peri.length - 1) : 0) * 180 / Math.PI;
    };
    const plus = run(0.05, 1), minus = run(-0.05, 1), ctrl = run(0.05, 0);
    // v1.24 で 💫drag プリセットは廃止(☿mercury に役割統合)。ロゼットは旧 drag の構成を
    // ここに明示して再現する(物理エンジンは不変のため軌跡は同一)。
    const s = HP.sim;
    s.build({ id: 'fig_rosette', name: 'rosette', camera: { scale: 220 }, world: { boundary: 'none', size: 0 },
      physics: { G: 1, D0: 0.05, kFrame: 1, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, Kt: 60,
        cLight: 60, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0, geoPN: 0, lambdaPN: 1, pnAlpha: 1.5,
        radiusScale: 1.2, softening: 2, timeScale: 8 },
      bodies: [
        { type: 'single', m: 600, x: 0, y: 0, vx: 0, vy: 0, spin: 0.09, pinned: true },
        { type: 'single', m: 0.5, x: 60, y: 0, vx: 0, vy: 3.87, spin: 0, pinned: false }
      ], overlays: {} });
    const pts = [];
    // 軌道周期 T≈335(a≈120)。8周(≈168000步・歳差合計≈−90°)が花びらの判別に最適(付録O 書き戻し:
    // 20周では環に潰れる)
    for (let k = 0; k < 168000; k++) { s.step(0.016); if (k % 80 === 0) pts.push([+s.x[1].toFixed(2), +s.y[1].toFixed(2)]); }
    return { plus, minus, ctrl, rosette: pts, rosetteBody: [0, 0, 1.2 * Math.sqrt(600)] };
  });
  const a = rayPanel({ h: 300, rays: [d.rosette], bodies: [d.rosetteBody], box: 110, title: 'rosette configuration: orbit trail' });
  const b = barChart({
    h: 300, ylab: 'periapsis drift (deg/orbit)',
    cats: [
      { label: 'prograde spin\nS=+0.05, kF=1', vals: [d.plus], txt: [d.plus.toFixed(2)] },
      { label: 'reversed spin\nS=-0.05, kF=1', vals: [d.minus], txt: [d.minus.toFixed(2)] },
      { label: 'control\nkF=0', vals: [d.ctrl], txt: [d.ctrl.toFixed(2)] }
    ], seriesLabels: ['V6 configuration (a=60, e=0.5)']
  });
  const fig = panelStack([a, b]);
  await writeFig(pdfPage, 3, fig, { hook: 'V6 (a=60,e=0.5,S=±0.05,kF∈{0,1},D0=0.05)', rosettePreset: 'rosette config (former drag preset) 168000 steps (~8 orbits)',
    driftDegPerOrbit: { plus: d.plus, minus: d.minus, ctrl: d.ctrl } });
  gate('fig3.sign', d.plus < 0 && d.minus > 0 && Math.abs(d.plus) > 3 * Math.abs(d.ctrl),
    `+S=${d.plus.toFixed(2)} −S=${d.minus.toFixed(2)} ctrl=${d.ctrl.toFixed(2)}`);
}

// ---- Fig 4: 時計 τ/t 実測 vs 解析(V12/V13/V16 同構成)----
if (want(4)) {
  const d = await page.evaluate(() => {
    const out = [];
    { // V12 同構成
      const s = HP.sim;
      s.build({ id: 'fig_v12', name: 'V12', camera: { scale: 200 }, world: { boundary: 'none', size: 0 },
        physics: { G: 0, D0: 2, kFrame: 0, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, etaRad: 0,
          Kt: 1e6, cLight: 60, softening: 2, timeScale: 1 },
        bodies: [
          { type: 'single', m: 1, x: 0, y: -1500, vx: 0, vy: 0, spin: 0, pinned: false },
          { type: 'single', m: 1, x: 0, y: 0, vx: 18, vy: 0, spin: 0, pinned: false },
          { type: 'single', m: 1, x: 0, y: 1500, vx: 36, vy: 0, spin: 0, pinned: false }
        ], overlays: {} });
      for (let k = 0; k < 1000; k++) s.step(0.016);
      [0, 18, 36].forEach((v, i) => out.push({ label: `v=${(v / 60).toFixed(1)}c`, meas: s.tau[i] / s.t, th: Math.sqrt(1 - v * v / 3600), src: 'V12' }));
    }
    { // V13 同構成
      const M = 200, r0 = 80, G = 1, Kt = 60, c0 = 5, D0 = 2;
      const s = HP.sim;
      s.build({ id: 'fig_v13', name: 'V13', camera: { scale: 200 }, world: { boundary: 'none', size: 0 },
        physics: { G, D0, kFrame: 0, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, etaRad: 0,
          Kt, cLight: c0, softening: 2, timeScale: 1 },
        bodies: [
          { type: 'single', m: M, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: true },
          { type: 'single', m: 25, x: r0, y: 0, vx: 0, vy: 0, spin: 0, pinned: false }
        ], overlays: {} });
      const eps = s.params.softening;
      const v = Math.sqrt(G * M * r0 * r0 / Math.pow(r0 * r0 + eps * eps, 1.5));
      s.vy[1] = v;
      for (let k = 0; k < 1000; k++) s.step(0.016);
      const psi = (D0 + M / Math.sqrt(r0 * r0 + eps * eps)) / Kt, N = Math.exp(-psi), A = Math.exp(psi);
      out.push({ label: 'orbit\n(grav+kin)', meas: s.tau[1] / s.t, th: Math.sqrt(N * N - A * A * v * v / (c0 * c0)), src: 'V13' });
    }
    { // V16 同構成
      const Kt = 60, c0 = 60, D0 = 2, rB = 400, om = 0.075;
      const s = HP.sim;
      s.build({ id: 'fig_v16', name: 'V16', camera: { scale: 200 }, world: { boundary: 'none', size: 0 },
        physics: { G: 0, D0, kFrame: 0, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, etaRad: 0,
          Kt, cLight: c0, softening: 2, timeScale: 1 },
        bodies: [
          { type: 'single', m: 1, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: true },
          { type: 'ring', n: 1, cx: 0, cy: 0, rIn: rB, rOut: rB, mMin: 1, mMax: 1, spinMin: 0, spinMax: 0,
            vMode: 'omega', aroundMass: 0, omega: om, vNoise: 0, direction: 1, pinned: true }
        ], overlays: {} });
      for (let k = 0; k < 1000; k++) s.step(0.016);
      const psi = (D0 + 1 / rB) / Kt, N = Math.exp(-psi), A = Math.exp(psi), vB = om * rB;
      out.push({ label: 'twin A\n(rest)', meas: s.tau[0] / s.t, th: N, src: 'V16' });
      out.push({ label: 'twin B\n(v=0.5c)', meas: s.tau[1] / s.t, th: Math.sqrt(N * N - A * A * vB * vB / (c0 * c0)), src: 'V16' });
    }
    return out;
  });
  const fig = barChart({
    ylab: 'clock rate tau/t', ylo: 0, yhi: 1.1,
    cats: d.map(q => ({ label: q.label, vals: [q.meas, q.th], txt: [q.meas.toFixed(3), ''] })),
    seriesLabels: ['measured', 'analytic']
  });
  const worst = Math.max(...d.map(q => Math.abs(q.meas - q.th) / q.th));
  await writeFig(pdfPage, 4, fig, { hooks: 'V12/V13/V16 identical configurations, 1000 steps each', worstRelErr: worst, data: d });
  gate('fig4.analytic', worst < 1e-3, `最大相対誤差=${worst.toExponential(2)} (<1e-3)`);
}

// ---- Fig 5: lensing 光線ファン+V8 非対称ファン ----
if (want(5)) {
  const d = await page.evaluate(() => {
    HP.loadPreset('lensing', false);
    const s = HP.sim, scale = 300, dl = scale / 110;
    const fan = (sim, n, spread, dlv, steps) => {
      const rays = [];
      for (let r = 0; r < n; r++) {
        const py = ((r + 0.5) / n - 0.5) * 2 * spread * scale, pts = [[-300, py]];
        HP.traceRay(sim, -300, py, 1, 0, dlv, steps, (nx, ny) => {
          pts.push([+nx.toFixed(1), +ny.toFixed(1)]);
          return !(Math.abs(nx) > 660 || Math.abs(ny) > 660);
        });
        rays.push(pts);
      }
      return rays;
    };
    const rays1 = fan(s, 26, 0.85, dl, 340);
    const bodies1 = [];
    for (let i = 0; i < s.n; i++) bodies1.push([s.x[i], s.y[i], s.R[i]]);
    // V8 構成(m1500, spin±0.5, Kt=500)
    const mk = (sp) => {
      const q = HP.sim;
      q.build({ id: 'fig_v8', name: 'V8', camera: { scale: 300 }, world: { boundary: 'none', size: 0 },
        physics: { cLight: 60, D0: 2, kFrame: 1, G: 1, Kt: 500, softening: 2, timeScale: 1 },
        bodies: [{ type: 'single', m: 1500, x: 0, y: 0, vx: 0, vy: 0, spin: sp, pinned: true }], overlays: {} });
      return q;
    };
    const bend = (q, y0) => { const rr = HP.traceRay(q, -300, y0, 1, 0, 2.7, 320, null); return Math.atan2(rr.cy, rr.cx); };
    const s2 = mk(0.5);
    const rays2 = fan(s2, 13, 0.6, 2.7, 320);
    const asymP = bend(s2, 90) + bend(s2, -90);
    const s3 = mk(-0.5);
    const asymM = bend(s3, 90) + bend(s3, -90);
    return { rays1, bodies1, rays2, body2: [0, 0, 1.2 * Math.sqrt(1500)], asymP, asymM };
  });
  const a = rayPanel({ rays: d.rays1, bodies: d.bodies1, box: 330, title: 'preset lensing (Kt=150): deflection and capture' });
  const b = rayPanel({ rays: d.rays2, bodies: [d.body2], box: 330, title: 'V8 configuration (spin +0.5, Kt=500): asymmetric fan' });
  const fig = panelStack([a, b]);
  await writeFig(pdfPage, 5, fig, { presets: 'lensing (26 rays, x0=-300, dl=300/110, 340 steps) + V8 config (13 rays)',
    asymmetryRad: { plus: d.asymP, minus: d.asymM } });
  gate('fig5.asym', Math.sign(d.asymP) !== Math.sign(d.asymM) && Math.abs(d.asymP) > 1e-4,
    `Δθ(+0.5)=${d.asymP.toExponential(2)} Δθ(−0.5)=${d.asymM.toExponential(2)}`);
}

// ---- Fig 6: gas 左右平均温度時系列 + pressure コア半径時系列 ----
if (want(6)) {
  const d = await page.evaluate(() => {
    const meanT = (s, left) => {
      let a = 0, c = 0;
      for (let i = 0; i < s.n; i++) if (left ? s.x[i] < 0 : s.x[i] >= 0) {
        const I = 0.5 * s.m[i] * s.R[i] * s.R[i]; a += I * s.spin[i] * s.spin[i]; c++;
      }
      return c ? a / c : 0;
    };
    HP.loadPreset('gas', false);
    let s = HP.sim;
    const gas = [];
    // v1.18/v1.21 の統制化(G=0・kFrame=0・初速統一)で平衡化が緩やかになったため、
    // 旧 16000 步 → 64000 步(ギャップ 4.36→0.29。ゲート <0.2× を実測で満たす長さ)
    for (let k = 0; k < 64000; k++) { s.step(0.016); if (k % 400 === 0) gas.push({ t: +s.t.toFixed(2), L: meanT(s, true), R: meanT(s, false) }); }
    const gasNaN = s.hasNaN();
    HP.loadPreset('pressure', false);
    s = HP.sim;
    const core = [];
    for (let k = 0; k < 16000; k++) {
      s.step(0.016);
      if (k % 50 === 0) { let a = 0; for (let i = 0; i < 90; i++) a += Math.hypot(s.x[i], s.y[i]); core.push({ t: +s.t.toFixed(2), r: +(a / 90).toFixed(2) }); }
    }
    return { gas, core, gasNaN, coreNaN: s.hasNaN() };
  });
  const a = lineChart({
    h: 300, xlab: 'time t', ylab: 'mean temperature T', ylo: 0, title: 'preset gas: left/right mean temperature',
    series: [
      { pts: d.gas.map(q => [q.t, q.R]), label: 'right half (hot start)', wide: true },
      { pts: d.gas.map(q => [q.t, q.L]), label: 'left half (cold start)', dash: '7 4' }
    ]
  });
  const b = lineChart({
    h: 300, xlab: 'time t', ylab: 'mean core radius', ylo: 0, title: 'preset pressure: hot-core expansion', legend: 'tl',
    series: [{ pts: d.core.map(q => [q.t, q.r]), label: 'hot core (90 particles)', wide: true }]
  });
  const fig = panelStack([a, b]);
  const r0 = d.core[0].r, r1 = d.core[d.core.length - 1].r;
  const gap0 = Math.abs(d.gas[0].R - d.gas[0].L), gap1 = Math.abs(d.gas[d.gas.length - 1].R - d.gas[d.gas.length - 1].L);
  await writeFig(pdfPage, 6, fig, { presets: 'gas (64000 steps, every 400) + pressure (16000 steps, every 50)',
    coreRadius: { start: r0, end: r1, ratio: r1 / r0 }, tempGap: { start: gap0, end: gap1, ratio: gap1 / gap0 } });
  gate('fig6.expand', !d.gasNaN && !d.coreNaN && r1 / r0 > 2, `コア半径 ${r0.toFixed(1)}→${r1.toFixed(1)} (×${(r1 / r0).toFixed(2)})`);
  gate('fig6.equalize', gap1 < 0.2 * gap0, `左右温度ギャップ ${gap0.toFixed(2)}→${gap1.toFixed(2)} (<0.2×)`);
}

await browser.close();
if (errs.length) console.log('page errors:', errs.slice(0, 3));
const ok = gates.every(g => g.pass) && errs.length === 0;
fs.writeFileSync(path.join(OUT, 'figures-gates.json'), JSON.stringify({ commit, generated: new Date().toISOString(), gates, pageErrors: errs }, null, 1));
console.log(ok ? `ALL GATES PASS (${gates.length})` : 'GATE FAIL');
process.exit(ok ? 0 : 1);
