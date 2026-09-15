// 第264便a(第56報 W1)「NS の **(k, f) 共同根**」。
//
// ■ この器が答える 1 つの問い
//   原仮定者(第56報)「較正は、『geoPN=2』で『kFrame≈0.7』とするのが良いか、検討する。
//   その場合、『kFrame≈0.7』を、他の観測値から事前予測する計算式を確立する」。
//   —— 第262便a の釣り合い曲線は **f を P に合わせた 1 次元掃引**で、ω̇ は「そこでいくつになったか」を
//   読んだだけだった。本器は **P=P_obs かつ ω̇=ω̇_obs を同時に満たす (k*, f*)** を
//   **4 系それぞれで** 2 次元根探索し、**k* が系によって違うか、共通か**を数で出す。
//
// ■ 測る量の定義(第262便a・第252便b と同じ。段をまたいで同じであることが読む前提)
//   **近点間 P** = 位相制限(1.5π)の検出器が採った最初の 20 近点(19 区間)の平均間隔
//   (`tests/lib-precision-diagnostics.mjs` の `createPeriastronDetector`)。
//   **ω̇** = 採用近点の方位を**実時刻に回帰**した傾き(°/年・ユリウス年 3.15576×10⁷ s の約束)。
//   **これは較正台帳(fitDt の一次則の不動点)が使った定義とは限らない** —— 差はそのまま表に出す。
//
// ■ 根の出し方(2 段構え・**予想を書かずに測った回数をそのまま記録する**)
//   内側: k を固定して **P(f)=P_obs の f** を探す(secant → Illinois。f の初期値は前の k の根から線形外挿)。
//   外側: **ω̇(k, f*(k)) = ω̇_obs の k** を探す(3 点で括ってから secant)。
//   仕上げ: 根の周りで 2×2 ヤコビアン ∂(P, ω̇)/∂(k, f) を**中心差分で実測**し、
//           (a) 副列(**判定に使う解**)の根と (b) dt/2 の根を、そのヤコビアンの Newton 1〜3 歩で出す
//           (**毎回フル探索するより安いだけで、根であることは残差で確かめる**)。
//
// ■ 触らないもの
//   `beta/index.html` は**読むだけ**。本体 ⚡🧮🩺🧶 の JSON を 1 bit も書き換えない
//   (走行用のコピーをページの中で作って捨てる)。`S._core` には 1 命令も足していない。
//   診断コピーは `sampleClass:"principle"`(較正サンプルではない)。
//
// ■ この表が**言わないこと**
//   「kFrame≈0.7 を採用した」「事前予測式を確立した」とは書かない。ここに出るのは
//   **各系で P と ω̇ を同時に満たす (k, f) の組**だけであって、較正則ではない。
//
// 実行: node tests/exp-w264a-kjoint.mjs [--only psrDoubleABDFM,...] [--budget-total 7200] [--no-half]
// 出力: tests/out/kjoint-w264a.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + path.join(ROOT, TARGET);
const OUT = path.join(ROOT, 'tests', 'out', 'kjoint-w264a.json');
const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(k); return (i >= 0 && argv[i + 1]) ? argv[i + 1] : d; };
const BUDGET_TOTAL_S = Number(arg('--budget-total', 7200));
const NO_HALF = argv.includes('--no-half');
const DT0 = 0.016;
const PERI_WINDOW = 20;
const YEAR_SEC = 31557600;      // ユリウス年(**単位の約束**であって観測ではない)
const P_TOL_SEC = 1e-3;         // |P−P_obs| の停止条件(観測 σ の 10³〜10⁴ 倍 —— 精度主張ではない)
const W_TOL_REL = 5e-4;         // |Δω̇|/ω̇_obs の停止条件(dt 依存の動き 0.2% より内側・精度主張ではない)
const F_LO = 1.0, F_HI = 2.6;   // 内側の探索区間
const K_LO = 0, K_HI = 1.2;     // 外側の探索区間(**内蔵は k∈{0,1} の二値契約** — ここは診断コピーの掃引)

// ---- 系の宣言(**判定に使う解**は docs/CALIBRATION_VERDICT_v1.44.md §5.8.5 の宣言をそのまま使う)----
const SYSTEMS = [
  { id: 'psrDoubleABDFM', emoji: '⚡', label: 'J0737−3039A/B',
    csvBody: 'PSR J0737-3039 B', solution: 'Kramer2021-DDS',
    massBodies: ['PSR J0737-3039 A', 'PSR J0737-3039 B'] },
  { id: 'psrJ1757DFM', emoji: '🧮', label: 'J1757−1854',
    csvBody: 'PSR J1757-1854', solution: 'Singha2026-DDH',
    massBodies: ['PSR J1757-1854', 'PSR J1757-1854 companion'] },
  { id: 'psrJ1946DFM', emoji: '🩺', label: 'J1946+2052',
    csvBody: 'PSR J1946+2052', solution: 'Meng2025-DDFWHE',
    massBodies: ['PSR J1946+2052', 'PSR J1946+2052 companion'] },
  { id: 'psrB1534DFM', emoji: '🧶', label: 'B1534+12',
    csvBody: 'PSR B1534+12', solution: 'Fonseca2014-DDGR',
    massBodies: ['PSR B1534+12', 'PSR B1534+12 companion'] },
];
const ONLY = (() => { const s = arg('--only', null); return s ? s.split(',') : null; })();

// ---- 観測(CSV が正本。この器に観測数値は 1 つも書かない)----
function parseCsvLine(line) {
  const cols = []; let cur = '', inQ = false;
  for (const ch of line) {
    if (inQ) { if (ch === '"') inQ = false; else cur += ch; }
    else if (ch === '"') inQ = true;
    else if (ch === ',') { cols.push(cur); cur = ''; }
    else cur += ch;
  }
  cols.push(cur); return cols;
}
function loadObs() {
  const txt = fs.readFileSync(path.join(ROOT, 'paper', 'data', 'solar-observations.csv'), 'utf8');
  const rows = [];
  for (const line of txt.split('\n')) {
    if (!line.trim() || line.startsWith('body,')) continue;
    const c = parseCsvLine(line);
    const sg = (c[8] !== undefined && c[8].trim() !== '') ? Number(c[8]) : null;
    rows.push({ body: c[0], quantity: c[1], value: Number(c[2]), unit: c[3], source: String(c[4]),
      note: String(c[7] || ''), sigma: (Number.isFinite(sg) && sg > 0) ? sg : null });
  }
  return rows;
}
const OBS_ROWS = loadObs();
// 採用レコード = その body|quantity の**最初の行**(calaudit と同じ規約)
const firstRow = (body, q) => OBS_ROWS.find((r) => r.body === body && r.quantity === q) || null;
// 解タグ行 = note に `solution=<tag>` を持つ行(第263便c の転写規約)
const solRow = (body, q, tag) => OBS_ROWS.find((r) => r.body === body && r.quantity === q
  && r.note.includes('solution=' + tag)) || null;
// 周期は s / d の両方があるので、判定単位(秒)へ**単位換算だけ**する(値の読み替えはしない)
const toSec = (row) => { if (!row) return null;
  if (row.unit === 's') return row.value;
  if (row.unit === 'd') return row.value * 86400;
  return null; };
const sigToSec = (row) => { if (!row || row.sigma === null) return null;
  if (row.unit === 's') return row.sigma;
  if (row.unit === 'd') return row.sigma * 86400;
  return null; };

const LIB_PREC = fs.readFileSync(path.join(ROOT, 'tests', 'lib-precision-diagnostics.mjs'), 'utf8')
  .replace(/^export /gm, '');
const LIB_DIAG = fs.readFileSync(path.join(ROOT, 'tests', 'lib-w262a-psrdiag.mjs'), 'utf8')
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
await pg.goto(INDEX, { waitUntil: 'load' });
await pg.waitForFunction(() => window.HP && HP.sim);
await pg.addScriptTag({ content: LIB_PREC });
await pg.addScriptTag({ content: LIB_DIAG });
const libOk = await pg.evaluate(() => typeof createPeriastronDetector === 'function'
  && typeof psrMassScaled === 'function');
if (!libOk) { console.error('[w264a] lib がページへ入っていない'); await browser.close(); process.exit(2); }

await pg.evaluate(({ PERI_WINDOW }) => {
  // 1 走行。**離脱で打ち切る**(束縛していない構成に周期は無い —— 0 で埋めない)
  window.__w264aRun = (srcId, f, kFrame, dt, maxSteps, budgetMs, escFactor) => {
    const src = HP.allPresets().find((q) => q.id === srcId);
    if (!src) return { ok: false, errors: ['no such preset: ' + srcId] };
    // **コア v2 を残す**(⚡ の族A と同じ測り方 —— massFrac=(f−1)/f を張り直す)
    const pd = psrMassScaled(src, f, { kFrame, keepCore: true, id: 'w264aDiag' });
    const v = HP.validatePreset(pd);
    if (!v.ok) return { ok: false, errors: v.errors };
    HP.sim.build(v.preset);
    const S = HP.sim, ci = 0, oi = 1;
    const det = createPeriastronDetector({ phaseGate: 1.5 * Math.PI });
    const t0 = performance.now();
    const r00 = Math.hypot(S.x[oi] - S.x[ci], S.y[oi] - S.y[ci]);
    let k = 0, stopped = 'window', nPeri = 0, inWin = false;
    let rMin = Infinity, rMax = -Infinity;
    for (; k < maxSteps; k++) {
      S.step(dt);
      const dx = S.x[oi] - S.x[ci], dy = S.y[oi] - S.y[ci];
      const rr = Math.hypot(dx, dy), th = Math.atan2(dy, dx);
      const dvx = S.vx[oi] - S.vx[ci], dvy = S.vy[oi] - S.vy[ci];
      const rd = (rr > 0) ? (dx * dvx + dy * dvy) / rr : 0;
      if (inWin) { if (rr < rMin) rMin = rr; if (rr > rMax) rMax = rr; }
      const a = det.push(k, rr, rd, th);
      if (a.accepted) { nPeri++; inWin = true; }
      if (nPeri >= PERI_WINDOW) { stopped = 'window'; break; }
      if (rr > escFactor * r00) { stopped = 'escape'; break; }
      if (S.hasNaN()) { stopped = 'nan'; break; }
      if ((k & 65535) === 0 && (performance.now() - t0) > budgetMs) { stopped = 'time-budget'; break; }
    }
    if (k >= maxSteps) stopped = 'max-steps';
    const res = det.result(PERI_WINDOW);
    const peri = res.peri, ang = res.ang;
    let slopeT = null, seT = null;
    if (ang.length >= 3) {
      const m = ang.length;
      const xs = ang.map((_, i) => peri[i].k * dt);
      const mx = xs.reduce((a2, b) => a2 + b, 0) / m, my = ang.reduce((a2, b) => a2 + b, 0) / m;
      let sxy = 0, sxx = 0;
      for (let i = 0; i < m; i++) { sxy += (xs[i] - mx) * (ang[i] - my); sxx += (xs[i] - mx) * (xs[i] - mx); }
      if (sxx > 0) {
        slopeT = sxy / sxx;
        seT = Math.sqrt(ang.reduce((s, y, i) => s + (y - (my + slopeT * (xs[i] - mx))) ** 2, 0) / (m - 2) / sxx);
      }
    }
    return { ok: true, steps: k, stopped, nan: S.hasNaN(), nPeri: res.nPeri,
      unwrapFailed: res.unwrapFailed,
      clamp: (S.clampVN || 0) + (S.clampSN || 0) + (S.clampHN || 0) + (S.clampRN || 0) + (S.clampTN || 0),
      perMeanSim: res.measured ? (peri[PERI_WINDOW - 1].k - peri[0].k) * dt / (PERI_WINDOW - 1) : null,
      slopeRadPerSimTime: slopeT, seRadPerSimTime: seT,
      r0: r00, eProxy: (rMax > 0 && rMax + rMin > 0) ? (rMax - rMin) / (rMax + rMin) : null,
      mHeld: [S.m[ci], S.m[oi]], warn: (v.warnings || []).length };
  };
  // t=0 の宣言から作る相関量(**走らせずに読む** —— 力へは繋がない)
  window.__w264aStatics = (srcId, f, kFrame) => {
    const src = HP.allPresets().find((q) => q.id === srcId);
    if (!src) return null;
    const pd = psrMassScaled(src, f, { kFrame, keepCore: true, id: 'w264aDiag' });
    const v = HP.validatePreset(pd);
    if (!v.ok) return { ok: false, errors: v.errors };
    const P = v.preset, B = P.bodies.map((b) => ({ m: b.m, x: b.x, y: b.y, vx: b.vx, vy: b.vy }));
    const D0p = (P.physics.D0pull !== undefined) ? P.physics.D0pull : P.physics.D0;
    const dom = (typeof HP.dfmDominance === 'function')
      ? HP.dfmDominance(B, { p: P.physics.q, eps: P.physics.softening, D0: D0p }) : null;
    const domP2 = (typeof HP.dfmDominance === 'function')
      ? HP.dfmDominance(B, { p: 2, eps: P.physics.softening, D0: D0p }) : null;
    // 観測質量(較正の基点)側の量。**f を掛ける前**の質量で作る
    const base = psrBaseMasses(src);
    const m1 = Math.max(base[0], base[1]), m2 = Math.min(base[0], base[1]);
    const M = m1 + m2;
    const R = P.bodies.map((b) => b.radius);
    const c = P.physics.cLight, G = P.physics.G;
    return { ok: true,
      baseMass: base.slice(), mTotBase: M, qRatio: m2 / m1, etaSym: m1 * m2 / (M * M),
      chiEff: dom ? dom.chiMassWeighted : null, chiEffP2: domP2 ? domP2.chiMassWeighted : null,
      chiPer: dom ? dom.chi.slice() : null,
      massRatio: dom ? dom.massRatio : null, chiBias: dom ? dom.chiBias : null,
      uAlign: dom ? dom.uAlign : null,
      // 圧縮度 Ξ=Gm/(Rc²)。**cLight は scaleExp で実 c を宣言した値**(L=6,T=1 → 3000 単位 = 3×10⁸ m/s)
      xiBase: base.map((m, i) => G * m / (R[i] * c * c)),
      xiScaled: base.map((m, i) => G * m * f / (R[i] * c * c)),
      radius: R.slice(), cLight: c, G, D0pull: D0p, qExp: P.physics.q,
      presetSigHash: (typeof HP.presetSigHash === "function") ? HP.presetSigHash(v.preset) : null,
      sampleClass: v.preset.sampleClass, isCalibration: v.preset.sampleClass === 'calibration',
      hasMassCal: !!v.preset.massCalibration };
  };
  // 内蔵 4 本が k∈{0,1} のままであること(**診断コピーは本体に触らない**)の対照
  window.__w264aBuiltinK = (ids) => ids.map((id) => {
    const p = HP.allPresets().find((q) => q.id === id);
    return { id, kFrame: p ? p.physics.kFrame : null, geoPN: p ? p.physics.geoPN : null,
      sampleClass: p ? p.sampleClass : null };
  });
}, { PERI_WINDOW });

const builtinK = await pg.evaluate((ids) => window.__w264aBuiltinK(ids), SYSTEMS.map((s) => s.id));
console.error('[w264a] 内蔵の kFrame: ' + builtinK.map((z) => z.id + '=' + z.kFrame).join(' / '));

const out = { meta: { wave: '第264便a', target: TARGET, dt0: DT0, periWindow: PERI_WINDOW,
  yearSec: YEAR_SEC, pTolSec: P_TOL_SEC, wTolRel: W_TOL_REL, fInterval: [F_LO, F_HI], kInterval: [K_LO, K_HI],
  metric: '**近点間 P** = 位相制限(1.5π)の最初の 20 近点(19 区間)の平均間隔。'
    + 'ω̇ は採用近点の方位を**実時刻**に回帰した傾き(°/年)。',
  method: '内側 = P(f)=P_obs の f(secant→Illinois・前の k の根から線形外挿で初期化)。'
    + '外側 = ω̇(k, f*(k))=ω̇_obs の k(3 点で括ってから secant)。'
    + '副列(判定に使う解)と dt/2 は、根の周りで**中心差分で実測した 2×2 ヤコビアン**の Newton で出し、'
    + '**残差で根であることを確かめる**(フル探索の再実行を省いただけで、推定値ではない)。',
  family: '⚡🧮🩺🧶 の JSON に f と kFrame を当て、コア v2 の massFrac=(f−1)/f(第224便)を張り直した族。'
    + '位置・速度は 1 bit も動かさない(共通係数なので重心系の再配分は恒等)。',
  touched: '**本体 ⚡🧮🩺🧶 の JSON は 1 bit も書き換えていない**(走行用のコピーをページ内で作る)。'
    + '`S._core` には 1 命令も足していない。診断コピーは sampleClass:"principle"(較正サンプルではない)。',
  claim: '**この表は較正則ではない。** (k*, f*) が出ても「kFrame≈0.7 を採用した」とは書かない。' },
  builtinK, systems: [], pageErrors: [] };

let spent = 0;
let nEvalTotal = 0;
const evalOne = async (srcId, f, kFrame, dt) => {
  const t0 = Date.now();
  const r = await pg.evaluate(({ srcId, f, kFrame, dt }) =>
    window.__w264aRun(srcId, f, kFrame, dt, 4e8, 300000, 4), { srcId, f, kFrame, dt });
  spent += (Date.now() - t0) / 1000; nEvalTotal++;
  return r;
};

for (const sys of SYSTEMS) {
  if (ONLY && !ONLY.includes(sys.id)) continue;
  const rec = { id: sys.id, emoji: sys.emoji, label: sys.label, columns: {}, evals: 0, spentSec: 0 };
  out.systems.push(rec);
  const tSys0 = spent;

  // 観測 2 列。**どちらも CSV の行をそのまま読む**(手打ちの数字を増やさない)
  const cols = {
    adopted: { P: firstRow(sys.csvBody, 'orbital_period'), E: firstRow(sys.csvBody, 'eccentricity'),
      W: firstRow(sys.csvBody, 'periastron_advance'), kind: '採用レコード(CSV の最初の行)' },
    solution: { P: solRow(sys.csvBody, 'orbital_period', sys.solution),
      E: solRow(sys.csvBody, 'eccentricity', sys.solution),
      W: solRow(sys.csvBody, 'periastron_advance', sys.solution),
      kind: '判定に使う解(' + sys.solution + '・§5.8.5 の宣言)' },
  };
  rec.obs = {};
  for (const [name, c] of Object.entries(cols)) {
    rec.obs[name] = { kind: c.kind,
      P: c.P ? { value: toSec(c.P), sigma: sigToSec(c.P), unit: 's', source: c.P.source.slice(0, 70) } : null,
      e: c.E ? { value: c.E.value, sigma: c.E.sigma, source: c.E.source.slice(0, 70) } : null,
      omegaDot: c.W ? { value: c.W.value, sigma: c.W.sigma, unit: 'deg/yr', source: c.W.source.slice(0, 70) } : null };
  }
  const P_ADOPT = rec.obs.adopted.P ? rec.obs.adopted.P.value : null;
  const W_ADOPT = rec.obs.adopted.omegaDot ? rec.obs.adopted.omegaDot.value : null;
  if (!Number.isFinite(P_ADOPT) || !Number.isFinite(W_ADOPT)) {
    rec.error = '採用レコードの P または ω̇ が CSV から読めない'; continue;
  }

  const toSecUnit = await pg.evaluate((id) => Math.pow(10,
    Number(HP.allPresets().find((q) => q.id === id).scaleExp.T)), sys.id);
  rec.simTimeUnitSec = toSecUnit;

  // 1 点の測定 → (P[s], ω̇[°/yr])
  const measure = async (k, f, dt) => {
    const r = await evalOne(sys.id, f, k, dt);
    const P = (r.ok && r.perMeanSim !== null) ? r.perMeanSim * toSecUnit : null;
    const W = (r.ok && r.slopeRadPerSimTime !== null)
      ? r.slopeRadPerSimTime * 180 / Math.PI / toSecUnit * YEAR_SEC : null;
    return { k, f, dt, P, W, e: r.ok ? r.eProxy : null, stopped: r.stopped, nPeri: r.nPeri,
      steps: r.steps, unwrapFailed: r.unwrapFailed, clamp: r.clamp, ok: r.ok, errors: r.errors };
  };

  // ---- 内側: P(f)=Pobs の f(secant → Illinois)
  const innerF = async (k, dt, Pobs, f0, log) => {
    const ev = [];
    const g = async (f) => { const m = await measure(k, f, dt); ev.push(m);
      return { m, g: (m.P === null) ? null : m.P - Pobs }; };
    let a = Math.min(Math.max(f0, F_LO + 1e-6), F_HI), b = Math.min(a + 0.006, F_HI);
    let va = await g(a), vb = await g(b);
    // secant(両方が有限なら)
    let it = 0, lo = null, hi = null, vlo = null, vhi = null;
    const note = [];
    while (it < 10) {
      if (va.g === null || vb.g === null) { note.push('離脱/未完で g が測れない — 区間法へ'); break; }
      if (Math.abs(vb.g) < P_TOL_SEC) return { f: b, m: vb.m, ev, how: 'secant', note };
      const den = (vb.g - va.g);
      if (!(Math.abs(den) > 0)) { note.push('secant の分母が 0'); break; }
      let fn = b - vb.g * (b - a) / den;
      if (!(fn > F_LO && fn < F_HI)) { note.push('secant が区間外 — 区間法へ'); break; }
      const vn = await g(fn);
      a = b; va = vb; b = fn; vb = vn; it++;
      if (vb.g !== null && va.g !== null && vb.g * va.g < 0) { lo = Math.min(a, b); hi = Math.max(a, b);
        vlo = (a < b) ? va : vb; vhi = (a < b) ? vb : va; }
    }
    if (vb.g !== null && Math.abs(vb.g) < P_TOL_SEC) return { f: b, m: vb.m, ev, how: 'secant', note };
    // 区間法(Illinois)。**束縛していない構成は g=+∞(質量が足りない側)**とする
    if (lo === null) {
      lo = F_LO; hi = F_HI;
      vlo = await g(lo); vhi = await g(hi);
    }
    const gv = (v) => (v.g === null ? Infinity : v.g);
    let best = null;
    const keep = (f, v) => { if (v.g === null) return; if (!best || Math.abs(v.g) < Math.abs(best.g)) best = { f, ...v }; };
    keep(lo, vlo); keep(hi, vhi);
    if (!(gv(vhi) < 0)) { note.push('f=' + F_HI + ' でもまだ P > P_obs(この区間に根が無い)');
      return { f: best ? best.f : null, m: best ? best.m : null, ev, how: 'no-root', note }; }
    if (gv(vlo) < 0) { note.push('f=' + F_LO + ' で既に P < P_obs(この区間に根が無い)');
      return { f: best ? best.f : null, m: best ? best.m : null, ev, how: 'no-root', note }; }
    let fl = lo, fh = hi, vl = vlo, vh = vhi, side = 0;
    for (let i = 0; i < 40; i++) {
      let fm;
      if (Number.isFinite(gv(vl))) { fm = fh - gv(vh) * (fh - fl) / (gv(vh) - gv(vl));
        if (!(fm > fl && fm < fh)) fm = 0.5 * (fl + fh); } else fm = 0.5 * (fl + fh);
      const vm = await g(fm); keep(fm, vm);
      if (vm.g !== null && Math.abs(vm.g) < P_TOL_SEC) return { f: fm, m: vm.m, ev, how: 'illinois', note };
      if (gv(vm) > 0) { fl = fm; vl = vm; if (side === -1 && Number.isFinite(gv(vh))) vh = { ...vh, g: gv(vh) / 2 }; side = -1; }
      else { fh = fm; vh = vm; if (side === 1 && Number.isFinite(gv(vl))) vl = { ...vl, g: gv(vl) / 2 }; side = 1; }
      if (fh - fl < 1e-12) { note.push('区間が 10⁻¹² まで潰れた(|ΔP| は抽出器の段差で残る)');
        return { f: best ? best.f : 0.5 * (fl + fh), m: best ? best.m : null, ev, how: 'collapsed', note }; }
    }
    note.push('反復上限 — |ΔP| 最小の点を採った');
    return { f: best ? best.f : null, m: best ? best.m : null, ev, how: 'iter-limit', note };
  };

  // ---- 外側: ω̇(k, f*(k)) = ω̇_obs の k
  const trace = [];
  const fGuess = (k) => 1 + k;        // 第262便a の直線 f=1+kFrame(**初期値であって主張ではない**)
  const atK = async (k, dt, Pobs) => {
    const prev = trace.filter((t) => t.dt === dt && t.fRoot !== null);
    let f0 = fGuess(k);
    if (prev.length >= 2) { const p1 = prev[prev.length - 2], p2 = prev[prev.length - 1];
      if (Math.abs(p2.k - p1.k) > 1e-9) f0 = p2.fRoot + (p2.fRoot - p1.fRoot) / (p2.k - p1.k) * (k - p2.k); }
    else if (prev.length === 1) f0 = prev[0].fRoot + (k - prev[0].k) * 1.0;
    if (!(f0 > F_LO && f0 < F_HI)) f0 = fGuess(k);
    const r = await innerF(k, dt, Pobs, f0, true);
    const t = { k, dt, fRoot: r.f, how: r.how, note: r.note,
      P: r.m ? r.m.P : null, W: r.m ? r.m.W : null, e: r.m ? r.m.e : null,
      deltaP: (r.m && r.m.P !== null) ? r.m.P - Pobs : null,
      nInner: r.ev.length, stopped: r.m ? r.m.stopped : null, nPeri: r.m ? r.m.nPeri : null };
    trace.push(t);
    console.error(`    ${sys.emoji} k=${k.toFixed(6)} dt=${dt}: f*=${r.f === null ? '—' : r.f.toFixed(8)}`
      + ` P=${t.P === null ? '—' : t.P.toFixed(6)} ΔP=${t.deltaP === null ? '—' : t.deltaP.toExponential(2)}`
      + ` ω̇=${t.W === null ? '—' : t.W.toFixed(6)} (${t.nInner} 回・${r.how})  [${spent.toFixed(0)} s]`);
    return t;
  };

  // 3 点で括る → secant
  console.error(`  [w264a] ${sys.emoji} ${sys.label}: 主列(採用レコード)P=${P_ADOPT} s ω̇=${W_ADOPT} °/yr`);
  const seeds = [0.5, 0.7, 0.9];
  const pts = [];
  for (const k of seeds) { if (spent > BUDGET_TOTAL_S) break; const t = await atK(k, DT0, P_ADOPT);
    if (t.W !== null) pts.push(t); }
  let kRoot = null, rootT = null, outerNote = [];
  if (pts.length >= 2) {
    // 括れているか
    let br = null;
    for (let i = 0; i + 1 < pts.length; i++) {
      const g1 = pts[i].W - W_ADOPT, g2 = pts[i + 1].W - W_ADOPT;
      if (g1 * g2 < 0) { br = [pts[i], pts[i + 1]]; break; }
    }
    if (!br) {
      // 括れていない → 端へ外挿して 1〜2 点足す
      const first = pts[0], last = pts[pts.length - 1];
      const slope = (last.W - first.W) / (last.k - first.k);
      if (Number.isFinite(slope) && Math.abs(slope) > 0) {
        for (const base of [last, first]) {
          let kx = base.k + (W_ADOPT - base.W) / slope;
          kx = Math.min(Math.max(kx, K_LO), K_HI);
          if (pts.some((p) => Math.abs(p.k - kx) < 1e-6)) continue;
          if (spent > BUDGET_TOTAL_S) break;
          const t = await atK(kx, DT0, P_ADOPT);
          if (t.W !== null) { pts.push(t); pts.sort((a, b) => a.k - b.k); }
          for (let i = 0; i + 1 < pts.length; i++) {
            const g1 = pts[i].W - W_ADOPT, g2 = pts[i + 1].W - W_ADOPT;
            if (g1 * g2 < 0) { br = [pts[i], pts[i + 1]]; break; }
          }
          if (br) break;
        }
      }
    }
    if (br) {
      let [lo, hi] = br;
      for (let it = 0; it < 8; it++) {
        if (spent > BUDGET_TOTAL_S) { outerNote.push('予算で外側の反復を止めた'); break; }
        const glo = lo.W - W_ADOPT, ghi = hi.W - W_ADOPT;
        if (Math.abs(glo) / Math.abs(W_ADOPT) < W_TOL_REL) { rootT = lo; break; }
        if (Math.abs(ghi) / Math.abs(W_ADOPT) < W_TOL_REL) { rootT = hi; break; }
        let kn = hi.k - ghi * (hi.k - lo.k) / (ghi - glo);
        if (!(kn > Math.min(lo.k, hi.k) && kn < Math.max(lo.k, hi.k))) kn = 0.5 * (lo.k + hi.k);
        const t = await atK(kn, DT0, P_ADOPT);
        if (t.W === null) { outerNote.push('k=' + kn + ' で ω̇ が測れない'); break; }
        if (Math.abs(t.W - W_ADOPT) / Math.abs(W_ADOPT) < W_TOL_REL) { rootT = t; break; }
        if ((t.W - W_ADOPT) * glo < 0) hi = t; else lo = t;
        if (Math.abs(hi.k - lo.k) < 1e-9) { rootT = t; outerNote.push('外側の区間が 10⁻⁹ まで潰れた'); break; }
      }
      if (!rootT) { const all = pts.concat(trace.filter((t) => t.dt === DT0 && t.W !== null));
        rootT = all.reduce((a, b) => (Math.abs(b.W - W_ADOPT) < Math.abs(a.W - W_ADOPT) ? b : a));
        outerNote.push('反復上限 — |Δω̇| 最小の点を採った'); }
    } else outerNote.push('探索区間 [' + K_LO + ', ' + K_HI + '] で ω̇ が観測を跨がない(この区間に根が無い)');
  } else outerNote.push('括る 3 点が測れなかった');
  if (rootT) kRoot = rootT.k;

  const statics = kRoot !== null
    ? await pg.evaluate(({ id, f, k }) => window.__w264aStatics(id, f, k),
      { id: sys.id, f: rootT.fRoot, k: kRoot })
    : await pg.evaluate(({ id, f, k }) => window.__w264aStatics(id, f, k), { id: sys.id, f: 2, k: 1 });
  rec.statics = statics;

  rec.columns.adopted = { kStar: kRoot, fStar: rootT ? rootT.fRoot : null,
    P: rootT ? rootT.P : null, omegaDot: rootT ? rootT.W : null, e: rootT ? rootT.e : null,
    residP: rootT && rootT.P !== null ? rootT.P - P_ADOPT : null,
    residW: rootT && rootT.W !== null ? rootT.W - W_ADOPT : null,
    residPSigma: (rootT && rootT.P !== null && rec.obs.adopted.P.sigma)
      ? (rootT.P - P_ADOPT) / rec.obs.adopted.P.sigma : null,
    residWSigma: (rootT && rootT.W !== null && rec.obs.adopted.omegaDot.sigma)
      ? (rootT.W - W_ADOPT) / rec.obs.adopted.omegaDot.sigma : null,
    note: outerNote, how: 'nested(内側 f / 外側 k)' };

  // ---- ヤコビアン(中心差分・**実測**)
  let J = null;
  if (kRoot !== null && rootT.fRoot !== null && spent < BUDGET_TOTAL_S) {
    const dk = 0.02, df = 0.01;
    const a = await measure(kRoot + dk, rootT.fRoot, DT0);
    const b = await measure(kRoot - dk, rootT.fRoot, DT0);
    const c = await measure(kRoot, rootT.fRoot + df, DT0);
    const d = await measure(kRoot, rootT.fRoot - df, DT0);
    if ([a, b, c, d].every((z) => z.P !== null && z.W !== null)) {
      J = { dPdk: (a.P - b.P) / (2 * dk), dWdk: (a.W - b.W) / (2 * dk),
        dPdf: (c.P - d.P) / (2 * df), dWdf: (c.W - d.W) / (2 * df), dk, df };
      J.det = J.dPdk * J.dWdf - J.dPdf * J.dWdk;
      rec.jacobian = J;
      console.error(`    ${sys.emoji} J: ∂P/∂k=${J.dPdk.toExponential(3)} ∂P/∂f=${J.dPdf.toExponential(3)}`
        + ` ∂ω̇/∂k=${J.dWdk.toExponential(3)} ∂ω̇/∂f=${J.dWdf.toExponential(3)} det=${J.det.toExponential(3)}`);
    } else rec.jacobian = { error: 'ヤコビアンの 4 点のどれかが測れない' };
  }

  // ---- Newton(ヤコビアンを使った仕上げ)。**残差で根であることを確かめる**
  const newtonRoot = async (Pobs, Wobs, dt, k0, f0, maxIt, tag) => {
    if (!J || !Number.isFinite(J.det) || J.det === 0) return { error: 'ヤコビアンが無い', tag };
    let k = k0, f = f0, last = null; const steps = [];
    for (let it = 0; it < maxIt; it++) {
      if (spent > BUDGET_TOTAL_S) { steps.push({ note: '予算で止めた' }); break; }
      const m = await measure(k, f, dt); last = m;
      steps.push({ k, f, P: m.P, W: m.W, dP: m.P === null ? null : m.P - Pobs,
        dW: m.W === null ? null : m.W - Wobs, stopped: m.stopped });
      if (m.P === null || m.W === null) break;
      const rP = m.P - Pobs, rW = m.W - Wobs;
      if (Math.abs(rP) < P_TOL_SEC && Math.abs(rW) / Math.abs(Wobs) < W_TOL_REL) break;
      // [dPdk dPdf; dWdk dWdf] [Δk; Δf] = -[rP; rW]
      const dkS = (-rP * J.dWdf + rW * J.dPdf) / J.det;
      const dfS = (-rW * J.dPdk + rP * J.dWdk) / J.det;
      k += dkS; f += dfS;
      if (!(k > K_LO - 0.5 && k < K_HI + 0.5 && f > F_LO && f < F_HI)) { steps.push({ note: 'Newton が区間外へ出た' }); break; }
    }
    return { tag, kStar: last ? last.k : null, fStar: last ? last.f : null,
      P: last ? last.P : null, omegaDot: last ? last.W : null, e: last ? last.e : null,
      residP: (last && last.P !== null) ? last.P - Pobs : null,
      residW: (last && last.W !== null) ? last.W - Wobs : null, steps, how: 'newton(実測ヤコビアン)' };
  };

  // 副列: 判定に使う解
  const Ps = rec.obs.solution.P ? rec.obs.solution.P.value : null;
  const Ws = rec.obs.solution.omegaDot ? rec.obs.solution.omegaDot.value : null;
  if (kRoot !== null && Number.isFinite(Ps) && Number.isFinite(Ws)) {
    const r = await newtonRoot(Ps, Ws, DT0, kRoot, rootT.fRoot, 3, 'solution');
    r.residPSigma = (r.residP !== null && rec.obs.solution.P.sigma) ? r.residP / rec.obs.solution.P.sigma : null;
    r.residWSigma = (r.residW !== null && rec.obs.solution.omegaDot.sigma)
      ? r.residW / rec.obs.solution.omegaDot.sigma : null;
    rec.columns.solution = r;
    console.error(`    ${sys.emoji} 副列(${sys.solution}): k*=${r.kStar === null ? '—' : r.kStar.toFixed(6)}`
      + ` f*=${r.fStar === null ? '—' : r.fStar.toFixed(8)}`);
  } else rec.columns.solution = { error: '判定に使う解の P または ω̇ が CSV に無い' };

  // dt/2(主列)
  if (!NO_HALF && kRoot !== null) {
    const r = await newtonRoot(P_ADOPT, W_ADOPT, DT0 / 2, kRoot, rootT.fRoot, 3, 'adopted@dt/2');
    rec.columns.adoptedHalf = r;
    if (r.kStar !== null) {
      r.dK = r.kStar - kRoot; r.dF = r.fStar - rootT.fRoot;
      console.error(`    ${sys.emoji} dt/2: k*=${r.kStar.toFixed(6)} (Δ${r.dK.toExponential(2)})`
        + ` f*=${r.fStar.toFixed(8)} (Δ${r.dF.toExponential(2)})`);
    }
  }

  rec.trace = trace;
  rec.evals = nEvalTotal; rec.spentSec = +(spent - tSys0).toFixed(1);
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1));   // 系ごとに書き出す(途中で落ちても残る)
}

out.meta.spentSec = +spent.toFixed(1);
out.meta.evals = nEvalTotal;
out.pageErrors = pageErrors;
await browser.close();
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.error('[w264a] wrote ' + OUT + '  (' + spent.toFixed(1) + ' s / ' + nEvalTotal + ' 回評価)');
