// 第261便c(第53報 W3)「収束先に対する較正の試行 + 感度行列 + e 写像のドラフト」。
//
// ■ 統括の読み (D) をそのまま試す
//   通常の h ではなく**収束先(P∞)に対して**較正する。周期だけの初期候補は、固定 a の Kepler 感度
//   から f_new/f_old = (P∞/P_obs)² である(**探索の初期方向であって最適値ではない**)。
//   本器は診断コピーの質量を**その 1 点だけ**動かして 4 段を走らせ直し、
//   **収束先の残差が 3σ にどれだけ近づいたか**を σ 倍で書く。
//
// ■ 何を動かし、何を動かさないか(**本体 JSON は 1 bit も書き換えない**)
//   動かすのは診断コピーの `bodies[i].m` に掛ける**共通係数 s** だけである(両体に同じ s を掛けるので
//   重心は動かない)。`core.massFrac`(殻/核の分け方)・初期位置・初期速度・physics は**触らない**。
//   `S._core` には 1 命令も足していない。
//
// ■ 感度行列(独立なノブがあるかを見る)
//   ⚡ 1 系で、(1) 質量係数 s、(2) 初期相対速度の倍率、(3) 宣言係数 λ_PN を ±δ 動かし、
//   P・ω̇・e_proxy の有限差分を 3×3 で取る。**行列が縮退していれば「独立なノブが無い」**と書く。
//
// ■ e 写像のドラフト(統括の読み (D) の最後)
//   準ケプラー r = a_r(1 − e_r cos u) と n(t−t₀) = u − e_t sin u を**別々に** fit し、
//   e_r(距離の離心率 = eProxy と同じ作り)と e_t(時間の離心率)の差を測る。
//   **GR の e_r→e_t 式は移植しない**(移植すると「合わせた」ことになる)。
//
// 実行: node tests/exp-w261c-convcal.mjs [--only psrDoubleABDFM,psrJ1757DFM]
// 出力: tests/out/convcal-w261c.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const SRC = path.join(ROOT, 'tests', 'out', 'precision-w261c.json');
const OUT = path.join(ROOT, 'tests', 'out', 'convcal-w261c.json');
const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(k); return (i >= 0 && argv[i + 1]) ? argv[i + 1] : d; };
const ONLY = arg('--only', null) ? arg('--only', '').split(',') : null;
const DIVS = arg('--divs', '1,2,4,8').split(',').map(Number).filter((z) => z > 0);
const DT0 = 0.016;
const PERI_WINDOW = 20;
const YEAR_SEC = 31557600;
const BASE = JSON.parse(fs.readFileSync(SRC, 'utf8'));

const LIB_SRC = fs.readFileSync(path.join(ROOT, 'tests', 'lib-precision-diagnostics.mjs'), 'utf8')
  .replace(/^export /gm, '');

const pObs = (q1, q2, q4) => { const a = q1 - q2, b = q2 - q4;
  if (![a, b].every(Number.isFinite) || b === 0) return null;
  const r = a / b; return (r > 0) ? Math.log2(r) : null; };
const rich = (qC, qF, o) => (![qC, qF].every(Number.isFinite) || !(o > 0)) ? null
  : qF + (qF - qC) / (Math.pow(2, o) - 1);
// 段列から段ずらし Richardson の最後の値と、隣接外挿差(包絡)
function ladder(hs, ys) {
  const rows = [];
  for (let i = 0; i + 2 < ys.length; i++) {
    const p = pObs(ys[i], ys[i + 1], ys[i + 2]);
    rows.push({ p, yInf: rich(ys[i + 1], ys[i + 2], p) });
  }
  const ext = rows.map((z) => z.yInf).filter(Number.isFinite);
  return { rows, pShifts: rows.map((z) => z.p), yInf: ext.length ? ext[ext.length - 1] : null,
    extrapolations: ext, spread: (ext.length >= 2) ? Math.abs(ext[ext.length - 1] - ext[ext.length - 2]) : null };
}

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

await pg.evaluate((PERI_WINDOW) => {
  // patch = { massScale, velScale, lambdaPN } —— **診断コピーにだけ**当てる
  window.__w261cc = (id, ci, oi, dt, patch, maxSteps, sampleEvery) => {
    const p0 = HP.allPresets().find((q) => q.id === id);
    const c = JSON.parse(JSON.stringify(p0));
    const pt = patch || {};
    if (Number.isFinite(pt.massScale) && pt.massScale !== 1)
      for (const b of c.bodies) b.m *= pt.massScale;
    if (Number.isFinite(pt.velScale) && pt.velScale !== 1)
      for (const b of c.bodies) { b.vx *= pt.velScale; b.vy *= pt.velScale; }
    if (Number.isFinite(pt.lambdaPN)) c.physics.lambdaPN = pt.lambdaPN;
    const v = HP.validatePreset(c);
    HP.sim.build(v.preset);
    const S = HP.sim;
    const det = createPeriastronDetector({ maxCount: PERI_WINDOW });
    let k = 0, stopped = 'window', n = 0;
    let inWindow = false, rMin = Infinity, rMax = -Infinity;
    const samples = [];   // e 写像の fit 用(間引き)
    for (; k < maxSteps; k++) {
      S.step(dt);
      const dx = S.x[oi] - S.x[ci], dy = S.y[oi] - S.y[ci];
      const rr = Math.hypot(dx, dy), th = Math.atan2(dy, dx);
      const dvx = S.vx[oi] - S.vx[ci], dvy = S.vy[oi] - S.vy[ci];
      const rd = (rr > 0) ? (dx * dvx + dy * dvy) / rr : 0;
      if (inWindow) { if (rr < rMin) rMin = rr; if (rr > rMax) rMax = rr; }
      const a = det.push(k, rr, rd, th);
      if (a.accepted) { n++; inWindow = true; }
      if (sampleEvery && inWindow && (k % sampleEvery === 0)) samples.push([k * dt, rr, rd]);
      if (n >= PERI_WINDOW) { stopped = 'window'; break; }
      if (S.hasNaN()) { stopped = 'nan'; break; }
    }
    if (k >= maxSteps) stopped = 'max-steps';
    const res = det.result(PERI_WINDOW);
    const peri = res.peri.slice(0, PERI_WINDOW), ang = res.ang.slice(0, PERI_WINDOW);
    const full = (res.nPeri >= PERI_WINDOW) && !res.unwrapFailed;
    const fit = (xs, ys) => { const m = ys.length; if (m < 3) return null;
      const mx = xs.reduce((a2, b) => a2 + b, 0) / m, my = ys.reduce((a2, b) => a2 + b, 0) / m;
      let sxy = 0, sxx = 0;
      for (let i = 0; i < m; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) * (xs[i] - mx); }
      return (sxx > 0) ? (sxy / sxx) : null; };
    const tim = ang.map((_, i) => peri[i].k * dt);
    return { steps: k, stopped, measured: full && res.measured, nPeri: res.nPeri,
      rejected: res.rejectedCount, unwrapFailed: res.unwrapFailed,
      measurementMethod: res.measurementMethod,
      perMeanSim: full ? (peri[PERI_WINDOW - 1].k - peri[0].k) * dt / (PERI_WINDOW - 1) : null,
      eProxy: (rMax > 0 && rMax + rMin > 0) ? (rMax - rMin) / (rMax + rMin) : null,
      rMin: Number.isFinite(rMin) ? rMin : null, rMax: Number.isFinite(rMax) ? rMax : null,
      slopeRadPerSimTime: (ang.length >= 3) ? fit(tim, ang) : null,
      slopeRadPerOrbit: (ang.length >= 3) ? fit(ang.map((_, i) => i), ang) : null,
      periTimes: peri.map((z) => z.k * dt),
      samples: samples,
      massSum: (v.preset.bodies || []).reduce((a2, b) => a2 + b.m, 0),
      lambdaPN: v.preset.physics.lambdaPN,
      nan: S.hasNaN() };
  };
  window.__w261ccDecl = (id) => {
    const p = HP.allPresets().find((q) => q.id === id);
    return { scaleExp: p.scaleExp, lambdaPN: p.physics.lambdaPN,
      masses: (p.bodies || []).map((b) => b.m),
      factor: p.massCalibration ? p.massCalibration.factor : null };
  };
}, PERI_WINDOW);

const out = { meta: { wave: '第261便c', target: TARGET, dt0: DT0, divs: DIVS, periWindow: PERI_WINDOW,
  yearSec: YEAR_SEC,
  touched: '**本体のプリセット JSON は 1 bit も書き換えていない**。診断コピーの bodies[i].m に'
    + '共通係数を掛け、初期位置・初期速度・core.massFrac・physics は触らない(λ_PN の掃引だけは例外で、'
    + 'これも診断コピーの physics.lambdaPN を動かす)。',
  direction: 'f_new/f_old = (P∞/P_obs)²(固定 a の Kepler 感度)。**探索の初期方向であって最適値ではない。**',
  extractor: 'radial-crossing/orbit-phase-1.5pi-v1(第261便c の位相制限)' },
  convcal: [], sensitivity: null, eMap: null, pageErrors: [] };

// ---------- (1) 収束先較正の試行 ----------
for (const bc of BASE.cases) {
  if (ONLY && !ONLY.includes(bc.id)) continue;
  const obs = (bc.obs.v2.period && bc.obs.v2.period.unit === 's') ? bc.obs.v2.period : bc.obs.v1.period;
  if (!obs || obs.unit !== 's' || !(obs.sigma > 0)) { continue; }
  const toSec = bc.toSec;
  const hs0 = bc.stages.map((s) => s.dt), ys0 = bc.stages.map((s) => s.dets['phase1.5'].perMeanSec);
  const L0 = ladder(hs0, ys0);
  if (!Number.isFinite(L0.yInf)) continue;
  const s = Math.pow(L0.yInf / obs.value, 2);
  const decl = await pg.evaluate((id) => window.__w261ccDecl(id), bc.id);
  const st = [];
  for (const d of DIVS) {
    const dt = DT0 / d;
    const t0 = Date.now();
    const r = await pg.evaluate(({ id, ci, oi, dt, patch, maxSteps }) =>
      window.__w261cc(id, ci, oi, dt, patch, maxSteps, 0),
    { id: bc.id, ci: 0, oi: 1, dt, patch: { massScale: s }, maxSteps: 4e8 });
    st.push({ div: d, dt, wallSec: +((Date.now() - t0) / 1000).toFixed(2), ...r, samples: undefined,
      perMeanSec: (r.perMeanSim !== null) ? r.perMeanSim * toSec : null,
      degPerYear: (r.slopeRadPerSimTime !== null) ? r.slopeRadPerSimTime * 180 / Math.PI / toSec * YEAR_SEC : null,
      degPerOrbit: (r.slopeRadPerOrbit !== null) ? r.slopeRadPerOrbit * 180 / Math.PI : null,
      periTimes: undefined });
  }
  const L1 = ladder(st.map((z) => z.dt), st.map((z) => z.perMeanSec));
  const w0 = ladder(hs0, bc.stages.map((z) => z.dets['phase1.5'].degPerYear));
  const w1 = ladder(st.map((z) => z.dt), st.map((z) => z.degPerYear));
  const e0 = ladder(hs0, bc.stages.map((z) => z.eProxy));
  const e1 = ladder(st.map((z) => z.dt), st.map((z) => z.eProxy));
  const obsW = (bc.obs.v2.omegaDot && bc.obs.v2.omegaDot.sigma) ? bc.obs.v2.omegaDot : bc.obs.v1.omegaDot;
  const row = { id: bc.id, emoji: bc.emoji, massScale: s,
    observationVersion: (obs === bc.obs.v2.period) ? 'v2 (DDFWHE)' : 'v1',
    obs: { value: obs.value, sigma: obs.sigma, unit: obs.unit },
    before: { yInf: L0.yInf, pShifts: L0.pShifts, spread: L0.spread,
      residual: L0.yInf - obs.value, nSigma: Math.abs(L0.yInf - obs.value) / obs.sigma,
      nSigmaWithEnvelope: (Math.abs(L0.yInf - obs.value) + (L0.spread || 0)) / obs.sigma,
      finest: ys0[ys0.length - 1] },
    after: { yInf: L1.yInf, pShifts: L1.pShifts, spread: L1.spread,
      residual: (L1.yInf !== null) ? L1.yInf - obs.value : null,
      nSigma: (L1.yInf !== null) ? Math.abs(L1.yInf - obs.value) / obs.sigma : null,
      nSigmaWithEnvelope: (L1.yInf !== null) ? (Math.abs(L1.yInf - obs.value) + (L1.spread || 0)) / obs.sigma : null,
      finest: st[st.length - 1].perMeanSec },
    sideEffects: { degPerYearBefore: w0.yInf, degPerYearAfter: w1.yInf,
      degPerYearObs: obsW ? obsW.value : null,
      degPerYearRatioBefore: (obsW && obsW.value) ? w0.yInf / obsW.value : null,
      degPerYearRatioAfter: (obsW && w1.yInf !== null && obsW.value) ? w1.yInf / obsW.value : null,
      eProxyBefore: e0.yInf, eProxyAfter: e1.yInf,
      eObs: bc.obs.v1.ecc ? bc.obs.v1.ecc.value : null },
    stages: st, massSum: { before: decl.masses.reduce((a, b) => a + b, 0), after: st[0].massSum },
    note: '**3σ に入ったかどうかだけを見る**(入っていない)。副作用(ω̇・e)は別欄にある。'
      + '**「近点移動が観測と合った」とは書かない。**' };
  // ---- 2 巡目: **実測した感度**で 1 歩だけ直す(固定 a の Kepler 感度は初期方向でしかない)----
  //   dP∞/ds を 1 巡目の 2 点から作り、s₂ = 1 + (P_obs − P∞(base)) / (dP∞/ds) を走らせる。
  //   **これは 1 量(周期)への fit である** —— 通ったとしても予測ではない(その旨を欄に書く)。
  let second = null;
  if (L1.yInf !== null) {
    const dPds = (L1.yInf - L0.yInf) / (s - 1);
    const s2 = 1 + (obs.value - L0.yInf) / dPds;
    const st2 = [];
    for (const d of DIVS) {
      const dt = DT0 / d;
      const r2 = await pg.evaluate(({ id, ci, oi, dt, patch, maxSteps }) =>
        window.__w261cc(id, ci, oi, dt, patch, maxSteps, 0),
      { id: bc.id, ci: 0, oi: 1, dt, patch: { massScale: s2 }, maxSteps: 4e8 });
      st2.push({ div: d, dt, measured: r2.measured,
        perMeanSec: (r2.perMeanSim !== null) ? r2.perMeanSim * toSec : null,
        eProxy: r2.eProxy,
        degPerYear: (r2.slopeRadPerSimTime !== null) ? r2.slopeRadPerSimTime * 180 / Math.PI / toSec * YEAR_SEC : null });
    }
    const L2 = ladder(st2.map((z) => z.dt), st2.map((z) => z.perMeanSec));
    const w2 = ladder(st2.map((z) => z.dt), st2.map((z) => z.degPerYear));
    const e2 = ladder(st2.map((z) => z.dt), st2.map((z) => z.eProxy));
    second = { massScale: s2, dPdsMeasured: dPds,
      dPdsFixedAKepler: -L0.yInf / 2,
      sensitivityRatio: (L0.yInf ? dPds / (-L0.yInf / 2) : null),
      yInf: L2.yInf, pShifts: L2.pShifts, spread: L2.spread,
      residual: (L2.yInf !== null) ? L2.yInf - obs.value : null,
      nSigma: (L2.yInf !== null) ? Math.abs(L2.yInf - obs.value) / obs.sigma : null,
      envelopeSigma: (L2.spread !== null) ? L2.spread / obs.sigma : null,
      nSigmaWithEnvelope: (L2.yInf !== null) ? (Math.abs(L2.yInf - obs.value) + (L2.spread || 0)) / obs.sigma : null,
      degPerYear: w2.yInf, eProxy: e2.yInf, stages: st2,
      note: '**1 量(近点間 P)への fit である。** 通っても予測ではない(hold-out ではなくなる)。'
        + '**そして通っていない** —— 隣接外挿差(包絡)だけで 3σ を大きく超える。' };
    console.error(`    ↳ 2 巡目 s₂=${s2.toFixed(10)}(実測感度/固定 a Kepler = ${second.sensitivityRatio === null ? '—' : second.sensitivityRatio.toFixed(3)})`
      + `  y∞ ${L2.yInf === null ? '—' : L2.yInf.toFixed(4)} s  残差 ${second.residual === null ? '—' : second.residual.toExponential(3)} s`
      + `  (${second.nSigma === null ? '—' : second.nSigma.toExponential(3)}σ・包絡だけで ${second.envelopeSigma === null ? '—' : second.envelopeSigma.toExponential(3)}σ)`
      + `  ω̇ 比 ${(second.degPerYear !== null && row.sideEffects.degPerYearObs) ? (second.degPerYear / row.sideEffects.degPerYearObs).toFixed(4) : '—'}`);
  }
  row.second = second;
  out.convcal.push(row);
  console.error(`  ${bc.emoji} ${bc.id}: s=${s.toFixed(9)}  y∞ ${L0.yInf.toFixed(4)} → ${L1.yInf === null ? '—' : L1.yInf.toFixed(4)} s`
    + `  残差 ${row.before.residual.toFixed(4)} → ${row.after.residual === null ? '—' : row.after.residual.toFixed(4)} s`
    + `  (${row.before.nSigma.toExponential(3)}σ → ${row.after.nSigma === null ? '—' : row.after.nSigma.toExponential(3)}σ)`
    + `  ω̇ 比 ${row.sideEffects.degPerYearRatioBefore === null ? '—' : row.sideEffects.degPerYearRatioBefore.toFixed(4)}`
    + ` → ${row.sideEffects.degPerYearRatioAfter === null ? '—' : row.sideEffects.degPerYearRatioAfter.toFixed(4)}`);
}

// ---------- (2) 感度行列(⚡ 1 系・有限差分) ----------
{
  const id = 'psrDoubleABDFM', bc = BASE.cases.find((z) => z.id === id);
  if (bc) {
    const toSec = bc.toSec, dt = DT0 / 4, delta = 1e-4;
    const run = async (patch) => pg.evaluate(({ id, dt, patch }) =>
      window.__w261cc(id, 0, 1, dt, patch, 4e8, 0), { id, dt, patch });
    const q = (r) => ({ P: (r.perMeanSim !== null) ? r.perMeanSim * toSec : null,
      w: (r.slopeRadPerSimTime !== null) ? r.slopeRadPerSimTime * 180 / Math.PI / toSec * YEAR_SEC : null,
      e: r.eProxy });
    const base = q(await run({}));
    const knobs = [
      { key: 'massScale', label: '質量係数 s', pPlus: { massScale: 1 + delta }, pMinus: { massScale: 1 - delta }, step: delta },
      { key: 'velScale', label: '初期相対速度の倍率', pPlus: { velScale: 1 + delta }, pMinus: { velScale: 1 - delta }, step: delta },
      { key: 'lambdaPN', label: '宣言係数 λ_PN', pPlus: { lambdaPN: 1 + delta }, pMinus: { lambdaPN: 1 - delta }, step: delta },
    ];
    const rows = [];
    for (const K of knobs) {
      const a = q(await run(K.pPlus)), b = q(await run(K.pMinus));
      const d = (x, y) => (Number.isFinite(x) && Number.isFinite(y)) ? (x - y) / (2 * K.step) : null;
      rows.push({ knob: K.key, label: K.label, step: K.step,
        dP: d(a.P, b.P), dOmega: d(a.w, b.w), dE: d(a.e, b.e),
        // 相対感度(無次元・行の向きを比べるため)
        relP: (base.P && d(a.P, b.P) !== null) ? d(a.P, b.P) / base.P : null,
        relOmega: (base.w && d(a.w, b.w) !== null) ? d(a.w, b.w) / base.w : null,
        relE: (base.e && d(a.e, b.e) !== null) ? d(a.e, b.e) / base.e : null });
    }
    // 3×3(相対感度)の行列式と、行どうしの角度(縮退の指標)
    const M = rows.map((r) => [r.relP, r.relOmega, r.relE]);
    const det3 = (m) => (m.every((r) => r.every(Number.isFinite)))
      ? m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1])
        - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0])
        + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]) : null;
    const norm = (v) => Math.hypot(...v);
    const cosang = (u, v) => (norm(u) > 0 && norm(v) > 0)
      ? (u[0] * v[0] + u[1] * v[1] + u[2] * v[2]) / (norm(u) * norm(v)) : null;
    out.sensitivity = { id, emoji: bc.emoji, dt, delta, base, rows,
      matrixRelative: M, determinant: det3(M),
      cosines: { 's·v': cosang(M[0], M[1]), 's·λ': cosang(M[0], M[2]), 'v·λ': cosang(M[1], M[2]) },
      note: '行が平行(|cos|→1)なら**そのノブは独立ではない**(同じ方向にしか動かせない)。'
        + '**行列式の絶対値そのものは単位に依存する** —— ここで読むのは cos の側である。' };
    console.error(`  [感度] ⚡ det=${out.sensitivity.determinant === null ? '—' : out.sensitivity.determinant.toExponential(3)}`
      + `  cos(s,v)=${out.sensitivity.cosines['s·v'] === null ? '—' : out.sensitivity.cosines['s·v'].toFixed(6)}`
      + `  cos(s,λ)=${out.sensitivity.cosines['s·λ'] === null ? '—' : out.sensitivity.cosines['s·λ'].toFixed(6)}`
      + `  cos(v,λ)=${out.sensitivity.cosines['v·λ'] === null ? '—' : out.sensitivity.cosines['v·λ'].toFixed(6)}`);
  }
}

// ---------- (3) e 写像のドラフト(⚡・準ケプラーの 2 本の fit) ----------
{
  const id = 'psrDoubleABDFM', bc = BASE.cases.find((z) => z.id === id);
  if (bc) {
    const toSec = bc.toSec, dt = DT0 / 4;
    const r = await pg.evaluate(({ id, dt }) => window.__w261cc(id, 0, 1, dt, {}, 4e8, 50),
      { id, dt });
    // 1 公転ぶん(最初の近点 → 2 つ目の近点)の標本だけを採る
    const t1 = r.periTimes[0], t2 = r.periTimes[1];
    const samp = r.samples.filter((z) => z[0] >= t1 && z[0] <= t2);
    const rr = samp.map((z) => z[1]);
    const rMin = Math.min(...rr), rMax = Math.max(...rr);
    const aR = (rMax + rMin) / 2, eR = (rMax - rMin) / (rMax + rMin);
    // u を r から復元(近点で u=0・ṙ>0 の半周が u∈(0,π))
    const rows = [];
    for (const [t, rv, rd] of samp) {
      let c = (1 - rv / aR) / eR;
      c = Math.max(-1, Math.min(1, c));
      let u = Math.acos(c);
      if (rd < 0) u = 2 * Math.PI - u;      // 遠点を過ぎたら u は π を超える
      rows.push([t - t1, u]);
    }
    // u_i = A t_i + B + C sin u_i の線形最小二乗(A=n・B=−n t₀・C=e_t)
    let S00 = 0, S01 = 0, S02 = 0, S11 = 0, S12 = 0, S22 = 0, b0 = 0, b1 = 0, b2 = 0, N = 0;
    for (const [t, u] of rows) {
      const x0 = t, x1 = 1, x2 = Math.sin(u);
      S00 += x0 * x0; S01 += x0 * x1; S02 += x0 * x2;
      S11 += x1 * x1; S12 += x1 * x2; S22 += x2 * x2;
      b0 += x0 * u; b1 += x1 * u; b2 += x2 * u; N++;
    }
    const A = [[S00, S01, S02], [S01, S11, S12], [S02, S12, S22]], B = [b0, b1, b2];
    // 3×3 を Cramer で解く
    const d3 = (m) => m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1])
      - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0])
      + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
    const rep = (m, i, v) => m.map((row, j) => row.map((z, k) => (k === i ? v[j] : z)));
    const D = d3(A);
    const sol = (D !== 0) ? [d3(rep(A, 0, B)) / D, d3(rep(A, 1, B)) / D, d3(rep(A, 2, B)) / D] : null;
    let resid = null;
    if (sol) {
      let mx = 0;
      for (const [t, u] of rows) mx = Math.max(mx, Math.abs(u - (sol[0] * t + sol[1] + sol[2] * Math.sin(u))));
      resid = mx;
    }
    const eT = sol ? sol[2] : null, n = sol ? sol[0] : null;
    out.eMap = { id, emoji: bc.emoji, dt, nSamples: N,
      window: '最初の近点から 2 つ目の近点まで(1 公転)',
      aR, eR, eT, n, t0: (sol && sol[0] !== 0) ? -sol[1] / sol[0] : null,
      residualMaxRad: resid,
      eProxyWindow20: bc.stages.find((z) => z.div === 4) ? bc.stages.find((z) => z.div === 4).eProxy : null,
      diff: (eT !== null) ? eT - eR : null,
      diffRelPct: (eT !== null && eR) ? 100 * (eT - eR) / eR : null,
      obsEcc: bc.obs.v1.ecc ? bc.obs.v1.ecc.value : null,
      note: '**GR の e_r→e_t の式は 1 つも移植していない。** e_r は r = a_r(1 − e_r cos u) の距離側、'
        + 'e_t は n(t−t₀) = u − e_t sin u の時間側から**別々に**作った。'
        + '**これは写像そのものではない**(2 つの量の差を測ったドラフトである)。'
        + '残差はこの 1 公転の窓での最大値で、**上限ではない**。' };
    console.error(`  [e 写像] ⚡ a_r=${aR.toFixed(4)}  e_r=${eR.toFixed(7)}  e_t=${eT === null ? '—' : eT.toFixed(7)}`
      + `  差 ${out.eMap.diff === null ? '—' : out.eMap.diff.toExponential(3)}`
      + ` (${out.eMap.diffRelPct === null ? '—' : out.eMap.diffRelPct.toFixed(3)}%)`
      + `  残差 ${resid === null ? '—' : resid.toExponential(3)} rad  / 観測 e=${out.eMap.obsEcc}`);
  }
}

out.pageErrors = pageErrors;
await browser.close();
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.error('[w261c-cc] wrote ' + OUT);
