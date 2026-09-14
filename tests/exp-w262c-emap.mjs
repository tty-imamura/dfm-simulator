// 第262便c(第54報 W3)「✨🌟 の e 写像 —— 量限定合(周期)に離心率を足せるか」。
//
// ■ 何をするか(統括の読み (A)・統括が設定した検証仮説 (11))
//   〔第261便c〕は ⚡ で**準ケプラーの 2 本の fit**(距離側 e_r と時間側 e_t)を**別々に**作る
//   ドラフトを出した。本器はそれを **✨ α Cen AB と 🌟 Sirius AB に当てて**、観測の離心率
//   (CSV の `eccentricity` 行・σ つき)との差を **σ 倍**で出す。
//   ⚡ は**再現の自己点検**として同じ器で測り直す(第261便c のドラフト値と並べる)。
//
// ■ 判定の書き方(ここを間違えない)
//   ・**系の合格にはしない。** 判定するのは「**離心率という 1 量**が 3σ を通るか」だけである。
//   ・**GR の e_r→e_t 式は 1 つも移植していない。** 移植したらそれは「合わせた」ことになる。
//   ・e_r は r = a_r(1 − e_r cos u) の**距離側**、e_t は n(t−t₀) = u − e_t sin u の**時間側**。
//     **どちらを観測 e と比べるべきかは決まっていない** —— だから**両方**を σ 倍つきで出す。
//   ・段(dt・dt/2・dt/4)を積んで**刻み依存を表に置く**(1 段だけの値を「実測」と書かない)。
//
// ■ 触らないもの
//   プリセット JSON は 1 bit も書き換えない(走行の dt だけを変える)。`S._core` に 1 命令も足さない。
//
// 実行: node tests/exp-w262c-emap.mjs [--only alphaCenAB] [--divs 1,2,4]
// 出力: tests/out/emap-w262c.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const OUT = path.join(ROOT, 'tests', 'out', 'emap-w262c.json');
const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(k); return (i >= 0 && argv[i + 1]) ? argv[i + 1] : d; };
const ONLY = arg('--only', null) ? arg('--only', '').split(',') : null;
const DIVS = arg('--divs', null) ? arg('--divs', '').split(',').map(Number).filter((z) => z > 0) : [1, 2, 4];
const DT0 = 0.016;

const CASES = [
  { id: 'alphaCenAB', emoji: '✨', body: 'Alpha Centauri B',
    note: '量限定合(周期のみ)。**離心率が写像未確定**で残っていた系' },
  { id: 'siriusAB', emoji: '🌟', body: 'Sirius B', note: '同上' },
  { id: 'psrDoubleABDFM', emoji: '⚡', body: 'PSR J0737-3039 B',
    note: '**再現の自己点検** —— 第261便c のドラフト(e_r=0.0878374・e_t=0.0847841)と並べる' },
];

function loadObs() {
  const txt = fs.readFileSync(path.join(ROOT, 'paper', 'data', 'solar-observations.csv'), 'utf8');
  const rows = [];
  for (const line of txt.split('\n')) {
    if (!line.trim() || line.startsWith('body,')) continue;
    const cols = []; let cur = '', inQ = false;
    for (const ch of line) {
      if (inQ) { if (ch === '"') inQ = false; else cur += ch; }
      else if (ch === '"') inQ = true;
      else if (ch === ',') { cols.push(cur); cur = ''; }
      else cur += ch;
    }
    cols.push(cur);
    const sg = (cols[8] !== undefined && cols[8].trim() !== '') ? Number(cols[8]) : null;
    rows.push({ body: cols[0], quantity: cols[1], value: Number(cols[2]), unit: cols[3],
      source: String(cols[4]), sigma: (Number.isFinite(sg) && sg > 0) ? sg : null });
  }
  return rows;
}
const OBS = loadObs();
const pick = (body, q) => OBS.find((r) => r.body === body && r.quantity === q) || null;

const LIB_SRC = fs.readFileSync(path.join(ROOT, 'tests', 'lib-precision-diagnostics.mjs'), 'utf8')
  .replace(/^export /gm, '');
const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let browser;
try { browser = await req('playwright').chromium.launch(); }
catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }
const pg = await browser.newPage();
const pageErrors = [];
pg.on('pageerror', (e) => pageErrors.push(String(e.message || e)));
await pg.goto('file://' + path.join(ROOT, TARGET), { waitUntil: 'load' });
await pg.waitForFunction(() => window.HP && HP.sim);
await pg.addScriptTag({ content: LIB_SRC });

await pg.evaluate(() => {
  // 最初の 2 近点を採り、その間(= 1 公転)の標本を最大 MAXS 点まで間引いて返す
  window.__w262emap = (id, dt, maxSteps, budgetMs, MAXS) => {
    const p = HP.allPresets().find((q) => q.id === id);
    const v = HP.validatePreset(JSON.parse(JSON.stringify(p)));
    HP.sim.build(v.preset);
    const S = HP.sim, ci = 0, oi = 1;
    const det = createPeriastronDetector({ phaseGate: 1.5 * Math.PI });
    const t0 = performance.now();
    const buf = [];
    let k = 0, accepted = 0, stopped = 'window', k1 = null, k2 = null;
    for (; k < maxSteps; k++) {
      S.step(dt);
      const dx = S.x[oi] - S.x[ci], dy = S.y[oi] - S.y[ci];
      const rr = Math.hypot(dx, dy), th = Math.atan2(dy, dx);
      const dvx = S.vx[oi] - S.vx[ci], dvy = S.vy[oi] - S.vy[ci];
      const rd = (rr > 0) ? (dx * dvx + dy * dvy) / rr : 0;
      if (accepted >= 1 && accepted < 2) buf.push([k, rr, rd]);
      const a = det.push(k, rr, rd, th);
      if (a.accepted) { accepted++; if (accepted === 1) k1 = k; else if (accepted === 2) { k2 = k; break; } }
      if (S.hasNaN()) { stopped = 'nan'; break; }
      if ((k & 65535) === 0 && (performance.now() - t0) > budgetMs) { stopped = 'time-budget'; break; }
    }
    if (k >= maxSteps) stopped = 'max-steps';
    const stride = Math.max(1, Math.ceil(buf.length / MAXS));
    const samp = [];
    for (let i = 0; i < buf.length; i += stride) samp.push(buf[i]);
    const res = det.result(2);
    return { steps: k, stopped, accepted, k1, k2, dt, nSamples: samp.length, samples: samp,
      periSim: (k1 !== null && k2 !== null) ? (res.peri[1].k - res.peri[0].k) * dt : null,
      nan: S.hasNaN(), scaleT: p.scaleExp.T };
  };
});

// 準ケプラーの 2 本の fit(**第261便c のドラフトと同じ手続き** —— 実装は 1 つ)
function quasiKepler(samples, dt) {
  const rr = samples.map((z) => z[1]);
  const rMin = Math.min(...rr), rMax = Math.max(...rr);
  const aR = (rMax + rMin) / 2, eR = (rMax - rMin) / (rMax + rMin);
  if (!(eR > 0)) return null;
  const t1 = samples[0][0] * dt;
  const rows = [];
  for (const [k, rv, rd] of samples) {
    let c = (1 - rv / aR) / eR;
    c = Math.max(-1, Math.min(1, c));
    let u = Math.acos(c);
    if (rd < 0) u = 2 * Math.PI - u;
    rows.push([k * dt - t1, u]);
  }
  let S00 = 0, S01 = 0, S02 = 0, S11 = 0, S12 = 0, S22 = 0, b0 = 0, b1 = 0, b2 = 0, N = 0;
  for (const [t, u] of rows) {
    const x0 = t, x1 = 1, x2 = Math.sin(u);
    S00 += x0 * x0; S01 += x0 * x1; S02 += x0 * x2;
    S11 += x1 * x1; S12 += x1 * x2; S22 += x2 * x2;
    b0 += x0 * u; b1 += x1 * u; b2 += x2 * u; N++;
  }
  const A = [[S00, S01, S02], [S01, S11, S12], [S02, S12, S22]], B = [b0, b1, b2];
  const d3 = (m) => m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1])
    - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0])
    + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
  const rep = (m, i, v) => m.map((row, j) => row.map((z, kk) => (kk === i ? v[j] : z)));
  const D = d3(A);
  const sol = (D !== 0) ? [d3(rep(A, 0, B)) / D, d3(rep(A, 1, B)) / D, d3(rep(A, 2, B)) / D] : null;
  let resid = null;
  if (sol) { let mx = 0;
    for (const [t, u] of rows) mx = Math.max(mx, Math.abs(u - (sol[0] * t + sol[1] + sol[2] * Math.sin(u))));
    resid = mx; }
  return { aR, eR, eT: sol ? sol[2] : null, n: sol ? sol[0] : null,
    residualMaxRad: resid, nFit: N };
}

const out = { meta: { wave: '第262便c', target: TARGET, dt0: DT0, divs: DIVS,
  window: '**最初の近点から 2 つ目の近点まで(1 公転)** —— 位相制限 1.5π の検出器が採った近点',
  method: 'r = a_r(1 − e_r cos u)(距離側)と n(t−t₀) = u − e_t sin u(時間側)を**別々に** fit。'
    + '**GR の e_r→e_t 式は 1 つも移植していない。**',
  judgement: '判定するのは**離心率という 1 量**だけである。**系の合格にはしない。**'
    + 'e_r と e_t の**どちらを観測 e と比べるべきかは決まっていない**ので、両方を σ 倍つきで出す。',
  touched: 'プリセット JSON は 1 bit も書き換えていない(変えるのは dt だけ)。' },
  cases: [], pageErrors: [] };

for (const C of CASES) {
  if (ONLY && !ONLY.includes(C.id)) continue;
  const obsE = pick(C.body, 'eccentricity');
  const obsP = pick(C.body, 'orbital_period');
  const stages = [];
  for (const d of DIVS) {
    const dt = DT0 / d;
    const t0 = Date.now();
    const r = await pg.evaluate(({ id, dt, maxSteps, budgetMs, MAXS }) =>
      window.__w262emap(id, dt, maxSteps, budgetMs, MAXS),
    { id: C.id, dt, maxSteps: 4e8, budgetMs: 600000, MAXS: 20000 });
    const wall = (Date.now() - t0) / 1000;
    const toSec = Math.pow(10, Number(r.scaleT));
    const q = (r.samples && r.samples.length > 20) ? quasiKepler(r.samples, dt) : null;
    const nsig = (v) => (q && Number.isFinite(v) && obsE && obsE.sigma > 0)
      ? Math.abs(v - obsE.value) / obsE.sigma : null;
    stages.push({ div: d, dt, wallSec: +wall.toFixed(2), steps: r.steps, stopped: r.stopped,
      nSamples: r.nSamples, periSec: (r.periSim !== null) ? r.periSim * toSec : null,
      aR: q ? q.aR : null, eR: q ? q.eR : null, eT: q ? q.eT : null,
      residualMaxRad: q ? q.residualMaxRad : null, nFit: q ? q.nFit : null,
      eRminusObs: (q && obsE) ? q.eR - obsE.value : null,
      eTminusObs: (q && q.eT !== null && obsE) ? q.eT - obsE.value : null,
      eRnSigma: q ? nsig(q.eR) : null, eTnSigma: q ? nsig(q.eT) : null,
      eRpass3sigma: q ? (nsig(q.eR) !== null && nsig(q.eR) <= 3) : null,
      eTpass3sigma: q ? (nsig(q.eT) !== null && nsig(q.eT) <= 3) : null });
    const s = stages[stages.length - 1];
    console.error(`  ${C.emoji} ${C.id} h/${d}  步 ${r.steps} ${wall.toFixed(1)} s`
      + `  a_r=${s.aR === null ? '—' : s.aR.toFixed(5)}  e_r=${s.eR === null ? '—' : s.eR.toFixed(7)}`
      + `  e_t=${s.eT === null ? '—' : s.eT.toFixed(7)}`
      + `  残差 ${s.residualMaxRad === null ? '—' : s.residualMaxRad.toExponential(3)} rad`
      + `  |e_r−obs| ${s.eRnSigma === null ? '—' : s.eRnSigma.toExponential(3)}σ`
      + `  |e_t−obs| ${s.eTnSigma === null ? '—' : s.eTnSigma.toExponential(3)}σ  (${r.stopped})`);
  }
  // 段のあいだの振れ(刻み依存)—— **1 段だけの値を「実測」と書かないための欄**
  const spread = (key) => {
    const v = stages.map((z) => z[key]).filter(Number.isFinite);
    return (v.length >= 2) ? Math.max(...v) - Math.min(...v) : null;
  };
  out.cases.push({ id: C.id, emoji: C.emoji, note: C.note,
    obs: { ecc: obsE, period: obsP }, stages,
    stageSpread: { eR: spread('eR'), eT: spread('eT') },
    verdict: {
      quantity: '離心率(準ケプラー fit)',
      eRpass: stages.length ? stages[stages.length - 1].eRpass3sigma : null,
      eTpass: stages.length ? stages[stages.length - 1].eTpass3sigma : null,
      note: '**この合否は「離心率という 1 量」の合否であって、系の合格ではない。**'
        + 'e_r・e_t のどちらを観測 e と比べるかは**決まっていない**(写像は未確定のままである)。' } });
}

out.pageErrors = pageErrors;
await browser.close();
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.error('[w262c-emap] wrote ' + OUT);
