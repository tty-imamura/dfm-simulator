// 第279便c(統括の読み R63 ④・AM4/AM13)— **新契約での背景の誤差予算**の器(❄️ と 📻 —— 🌘 は参考行)。
//
// ■ 何を測るか
//   新契約(`dfmBlendComplexMoments` の閾値なし合成 + `dfmMeshVelocityRHS` の ẋ=v+u・v̇=a_space−Jᵀv)で、
//   外部源(❄️🌘 は太陽・📻 は銀河の点質量)を
//     (EXP) **明示天体**(`field:"explicit"`)と
//     (BG)  **背景合成 + 凍結参照系 + backgroundTidal**(`field:"backgroundComplex"`・値を各天体へ一次で移す —— エンジンと同じ形)
//   の 2 通りで置いたときの ON/OFF 差(相対軌道の周期差 ΔP・1 公転後の位相差を時間へ直した Δt・位置差 Δx)を、
//   **刻み 3 段(N・2N・4N —— 半減 2 段)**で出す。`mutual`(相対作用の引きずりの端点)は 0 と 1 の両方。
//   さらに**エンジン**(`dfmMeshVelocityStep`)で ❄️・📻 の**診断コピー**(内蔵には足さない・器の中だけ ——
//   kFrame=0・sampleClass:"principle" に書き換えて meshVelocity と backgroundComplex を宣言)を刻み 2 段で走らせ、
//   純関数の積分と同じ量を並べる。第278便d の (N3) の項別の内訳(凍結する参照系・時間凍結・値の一次補正・線形潮汐)
//   と、新契約での同じ項を並べる。
//
// ■ 宣言(**測る前に書く**)
//   (B1) 外部源の質量・距離は第276便a の事前予測表・外部源は −x̂・対の重心は −ŷ へ √(GM/r)(第278便d の E1 と同じ)。
//   (B2) 対の初期の座標速度はサンプルの宣言そのもの。慣性速度は v=ẋ−u(0)(mutual:1 は 2×2 を解く)。
//   (B3) OFF は同じ重力模型で meshVelocity を切った走行。**閾値は置かない**(差と収束だけを並べる)。
//   (B4) q・kFrame 以外の宣言値は変えない(**qLock は再 fit しない** —— 診断コピーの q は宣言値のまま)。
//   (B5) 🌘 は現規格化で壊れる(第277便d・第278便d)ので**参考行**だけ(最初の対象にしない)。
//
// 実行:
//   PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright node tests/exp-w279c-bgbudget2.mjs
// 出力: tests/out/bgbudget2-w279c.json(CANON・来歴は lib-w272e-provenance の形)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { makePure } from './lib-w279c-bgcompose.mjs';
import { BGBUDGET2_VERSION, runMV, diffRuns, frozenBackground } from './lib-w279c-bgbudget2.mjs';
import { convergence } from './lib-w278d-bgequiv.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const OUT = path.join(ROOT, 'tests', 'out', 'bgbudget2-w279c.json');
const HARNESS_VERSION = 'w279c-bgbudget2-1';
const SIGMA_BUIE = 0.02592;
const N0 = Number(process.env.W279C_STEPS || 20000);
const NS = [N0, 2 * N0, 4 * N0];
const NE = [N0, 2 * N0];                           // エンジンの刻み 2 段
const t0 = Date.now();

const SAMPLES = [
  { id: 'plutoCharonReal', emoji: '❄️', label: '冥王星–カロン', ext: '太陽', engine: true, reference: false },
  { id: 'psrDoubleAB', emoji: '📻', label: 'PSR J0737−3039A/B', ext: '銀河(点質量)', engine: true, reference: false },
  { id: 'earthMoonRealKF1', emoji: '🌘', label: '地球–月', ext: '太陽', engine: false, reference: true },
];

const html = fs.readFileSync(path.join(ROOT, TARGET), 'utf8');
const pure = makePure(html);

/* ── ページ: 宣言を読む(値は変えない)── */
const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let browser;
try { browser = await req('playwright').chromium.launch(); }
catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }
const pageErrors = [];
const page = await browser.newPage();
page.on('pageerror', (e) => pageErrors.push(String(e)));
await page.goto('file://' + path.join(ROOT, TARGET), { waitUntil: 'load' });
await page.waitForFunction(() => window.HP && HP.sim);
const declared = await page.evaluate((ids) => {
  const out = {};
  for (const id of ids) {
    const s = HP.allPresets().find((q) => q.id === id);
    if (!s) { out[id] = { missing: true }; continue; }
    const v = HP.validatePreset(JSON.parse(JSON.stringify(s)));
    if (!v.ok) { out[id] = { error: v.errors }; continue; }
    const ph = v.preset.physics;
    out[id] = { scaleExp: s.scaleExp || null, G: ph.G, softening: ph.softening, kFrame: ph.kFrame, q: ph.q, geoPN: ph.geoPN,
      integrator: v.preset.integrator || 'semi',
      bodies: v.preset.bodies.map((b) => ({ m: b.m, x: b.x, y: b.y, vx: b.vx, vy: b.vy })) };
  }
  return out;
}, SAMPLES.map((s) => s.id));
const PRED = JSON.parse(fs.readFileSync(path.join(ROOT, 'tests', 'out', 'bgpredict-w276a.json'), 'utf8'));
const predOf = (id) => { const r = (PRED.rows || []).find((q) => q.id === id); return r && r.predictedSI ? r.predictedSI : null; };
const EQ = JSON.parse(fs.readFileSync(path.join(ROOT, 'tests', 'out', 'bgequiv-w278d.json'), 'utf8'));
const eqOf = (id) => (EQ.samples || []).find((q) => q.id === id) || null;

const units = (d) => ({ L: Math.pow(10, d.scaleExp.L), T: Math.pow(10, d.scaleExp.T), M: Math.pow(10, d.scaleExp.M) });
const toSI = (d) => {
  const U = units(d), V = U.L / U.T;
  const G = d.G * Math.pow(10, 3 * d.scaleExp.L - d.scaleExp.M - 2 * d.scaleExp.T);
  return { G, eps: d.softening * U.L, bodies: d.bodies.map((b) => ({ m: b.m * U.M, x: b.x * U.L, y: b.y * U.L, vx: b.vx * V, vy: b.vy * V })) };
};

/* ── 模型の並び ── */
const OFFS = {
  offExp: { mode: 'exp', meshOn: false }, offBgC: { mode: 'bg', frame: 'comoving', meshOn: false },
  offBgCT: { mode: 'bg', frame: 'comoving', tidal: true, meshOn: false }, offBgN: { mode: 'bg', frame: 'none', meshOn: false },
  offBgNT: { mode: 'bg', frame: 'none', tidal: true, meshOn: false },
};
// 背景の値の置き方: FF=原点・t=0 の値のまま / SH=各天体の位置へ一次で移す(時間は凍結 —— **エンジンと同じ形**)/
// TL=時間だけ線形に外挿 / SL=空間一次 + 時間線形(勾配は凍結のまま —— 採らない形・参考)
const ONS = [
  { key: 'EXP0', label: 'EXP 明示天体(field:"explicit")', model: { mode: 'exp', mutual: 0 }, off: 'offExp' },
  { key: 'BC_FF', label: 'BG comoving・値を凍結(原点・t=0 の値)', model: { mode: 'bg', frame: 'comoving', bgSpace: 'frozen', bgTime: 'frozen', mutual: 0 }, off: 'offBgC' },
  { key: 'BC_SH', label: 'BG comoving・値を各天体へ一次で移す(エンジンと同じ形)', model: { mode: 'bg', frame: 'comoving', bgSpace: 'shift', bgTime: 'frozen', mutual: 0 }, off: 'offBgC' },
  { key: 'BC_TL', label: 'BG comoving・値を時間で線形に外挿(勾配は凍結 —— 採らない形)', model: { mode: 'bg', frame: 'comoving', bgSpace: 'frozen', bgTime: 'linear', mutual: 0 }, off: 'offBgC' },
  { key: 'BC_SL', label: 'BG comoving・空間一次 + 時間線形(採らない形)', model: { mode: 'bg', frame: 'comoving', bgSpace: 'shift', bgTime: 'linear', mutual: 0 }, off: 'offBgC' },
  { key: 'BCT_FF', label: 'BG comoving・値を凍結 + backgroundTidal(線形潮汐 T)', model: { mode: 'bg', frame: 'comoving', tidal: true, bgSpace: 'frozen', bgTime: 'frozen', mutual: 0 }, off: 'offBgCT' },
  { key: 'BCT_SH', label: 'BG comoving・エンジンと同じ形 + backgroundTidal', model: { mode: 'bg', frame: 'comoving', tidal: true, bgSpace: 'shift', bgTime: 'frozen', mutual: 0 }, off: 'offBgCT' },
  { key: 'BN_FF', label: 'BG none(慣性系)・値を凍結', model: { mode: 'bg', frame: 'none', bgSpace: 'frozen', bgTime: 'frozen', mutual: 0 }, off: 'offBgN' },
  { key: 'BN_SH', label: 'BG none(慣性系)・エンジンと同じ形', model: { mode: 'bg', frame: 'none', bgSpace: 'shift', bgTime: 'frozen', mutual: 0 }, off: 'offBgN' },
  { key: 'BNT_SH', label: 'BG none・エンジンと同じ形 + backgroundTidal', model: { mode: 'bg', frame: 'none', tidal: true, bgSpace: 'shift', bgTime: 'frozen', mutual: 0 }, off: 'offBgNT' },
  { key: 'EXP1', label: 'EXP・mutual:1(相手の明示天体 + 外部源の合成)', model: { mode: 'exp', mutual: 1 }, off: 'offExp' },
  { key: 'BC1_SH', label: 'BG comoving・mutual:1(エンジンと同じ形)', model: { mode: 'bg', frame: 'comoving', bgSpace: 'shift', bgTime: 'frozen', mutual: 1 }, off: 'offBgC' },
];
// 新契約での項(第278便d の項と対にする)
const ITEMS = [
  { key: 'frameOfFreeze', label: '凍結する参照系(comoving → none)', from: 'BC_FF', to: 'BN_FF', w278d: 'frameOfFreeze' },
  { key: 'timeFreeze', label: '時間凍結(値を t=0 に凍結 → 勾配を凍結したまま時間で線形に外挿 —— 採らない形)', from: 'BC_FF', to: 'BC_TL', w278d: 'timeFreeze' },
  { key: 'valueShift1', label: '値の位置一次補正(原点の値 → 各天体へ一次で移す)', from: 'BC_FF', to: 'BC_SH', w278d: 'valueShift1' },
  { key: 'decomposition', label: '明示天体の ON/OFF(新契約 mutual:0)', from: null, to: 'EXP0', w278d: null },
];

const conv = (arr) => convergence(arr);
const pick = (dd, k) => dd.map((z) => (z ? z[k] : null));
const samples = [];
for (const S of SAMPLES) {
  const d = declared[S.id], pred = predOf(S.id);
  if (!d || d.missing || d.error || !pred) { samples.push({ id: S.id, emoji: S.emoji, skipped: true }); continue; }
  const si = toSI(d);
  const b0 = si.bodies[0], b1 = si.bodies[1];
  const G = si.G, M = pred.M, rExt = pred.r, eps = si.eps;
  const r0 = [b0.x - b1.x, b0.y - b1.y], vr0 = [b0.vx - b1.vx, b0.vy - b1.vy];
  const mu = G * (b0.m + b1.m), rr = Math.hypot(r0[0], r0[1]), v2 = vr0[0] ** 2 + vr0[1] ** 2;
  const aRel = 1 / (2 / rr - v2 / mu), T0 = 2 * Math.PI * Math.sqrt(aRel ** 3 / mu);
  const vExt = Math.sqrt(G * M / rExt);
  const base = { G, m: [b0.m, b1.m], M, eps, T0, R0: [rExt, 0], VR0: [0, -vExt], r0, vr0 };
  const FBc = frozenBackground(base, 'comoving'), FBn = frozenBackground(base, 'none');
  const runs = {};
  for (const N of NS) {
    const cfg = Object.assign({}, base, { steps: N });
    for (const [k, m] of Object.entries(OFFS)) runs[k + '@' + N] = runMV(pure, cfg, m);
    for (const o of ONS) runs[o.key + '@' + N] = runMV(pure, cfg, o.model);
  }
  const onoff = ONS.map((o) => {
    const dd = NS.map((N) => diffRuns(runs[o.key + '@' + N], runs[o.off + '@' + N], T0));
    const on4 = runs[o.key + '@' + NS[2]];
    const vsExp = NS.map((N) => diffRuns(runs[o.key + '@' + N], runs['EXP0@' + N], T0));
    return { key: o.key, label: o.label, model: o.model, off: o.off,
      onFailed: NS.map((N) => !!runs[o.key + '@' + N].failed), onBound: on4.bound, onA: on4.aT, onE: on4.eT,
      initSolvable: on4.initSolvable, initDet: on4.initDet, u0: on4.u0,
      readable: dd.every((z) => z && z.bothBound),
      dPhaseTimeS: conv(pick(dd, 'dPhaseTimeS')), dP: conv(pick(dd, 'dP')), dPos: conv(pick(dd, 'dPos')),
      raw4N: dd[2],
      mismatchVsExp: { dPhaseTimeS: conv(pick(vsExp, 'dPhaseTimeS')), dP: conv(pick(vsExp, 'dP')), dPos: conv(pick(vsExp, 'dPos')) } };
  });
  const byKey = Object.fromEntries(onoff.map((z) => [z.key, z]));
  const offTide = [['offBgC', '場なし・一様重力なし(comoving)vs 明示天体の厳密重力'], ['offBgCT', '場なし・線形潮汐 T vs 厳密重力']].map(([k, label]) => {
    const dd = NS.map((N) => diffRuns(runs[k + '@' + N], runs['offExp@' + N], T0));
    return { key: k, label, dPhaseTimeS: conv(pick(dd, 'dPhaseTimeS')), dP: conv(pick(dd, 'dP')), dPos: conv(pick(dd, 'dPos')) };
  });
  const EQs = eqOf(S.id);
  const items = ITEMS.map((it) => {
    const to = byKey[it.to];
    const val = (q) => (q && q.values ? q.values : null);
    let dt = null, dP = null;
    if (it.from) {
      const fr = byKey[it.from];
      if (to && fr && to.readable && fr.readable) {
        dt = conv(val(to.dPhaseTimeS).map((z, i) => z - val(fr.dPhaseTimeS)[i]));
        dP = conv(val(to.dP).map((z, i) => z - val(fr.dP)[i]));
      }
    } else if (to && to.readable) { dt = to.dPhaseTimeS; dP = to.dP; }
    const w = it.w278d && EQs ? (EQs.items || []).find((q) => q.key === it.w278d) : null;
    return { key: it.key, label: it.label, from: it.from, to: it.to, dPhaseTimeS: dt, dP,
      w278d: w ? { key: w.key, dPhaseTimeS4N: w.dPhaseTimeS ? w.dPhaseTimeS.values[2] : null, width: w.dPhaseTimeS ? w.dPhaseTimeS.width : null,
        readable: w.readable } : null };
  });
  // 線形潮汐: 背景合成(comoving・エンジン形)の明示天体との**全体の食い違い**が T で埋まるか
  const tidal = { withoutT: byKey.BC_SH ? byKey.BC_SH.mismatchVsExp.dPhaseTimeS : null,
    withT: byKey.BCT_SH ? byKey.BCT_SH.mismatchVsExp.dPhaseTimeS : null,
    frozenWithT: byKey.BCT_FF ? byKey.BCT_FF.mismatchVsExp.dPhaseTimeS : null,
    inertialWithoutT: byKey.BN_SH ? byKey.BN_SH.mismatchVsExp.dPhaseTimeS : null,
    inertialWithT: byKey.BNT_SH ? byKey.BNT_SH.mismatchVsExp.dPhaseTimeS : null,
    w278dLinear: (() => { const w = EQs && (EQs.items || []).find((q) => q.key === 'tidalLinear'); return w && w.dPhaseTimeS ? w.dPhaseTimeS.values[2] : null; })(),
    w278dNonlinear: (() => { const w = EQs && (EQs.items || []).find((q) => q.key === 'tidalNonlinear'); return w && w.dPhaseTimeS ? w.dPhaseTimeS.values[2] : null; })() };
  const w278dExp = (() => { const L = EQs && (EQs.ladder || []).find((q) => q.key === 'EXP'); return L && L.dPhaseTimeS ? L.dPhaseTimeS.values[2] : null; })();
  // 第278便d の差分形(k=1)の EXP の ON/OFF 差 —— **新契約の値ではない**(比較のための転記)
  samples.push({ id: S.id, emoji: S.emoji, label: S.label, ext: S.ext, reference: S.reference, G, eps,
    massesSI: [b0.m, b1.m], extMassKg: M, extDistanceM: rExt, extSpeedMS: vExt, T0S: T0, aRelM: aRel, steps: NS,
    declared: { kFrame: d.kFrame, q: d.q, geoPN: d.geoPN, integrator: d.integrator, scaleExp: d.scaleExp },
    background: { comoving: FBc.bg, none: FBn.bg, tidalT: FBc.T, gc: FBc.gc,
      chiBgAtBodies: [0, 1].map((k) => { const x = k ? [-(b0.m / (b0.m + b1.m)) * r0[0], 0] : [(b1.m / (b0.m + b1.m)) * r0[0], 0];
        const other = k ? b0.m : b1.m; const wl = other / (rr * rr + eps * eps); return FBc.bg.W / (FBc.bg.W + wl); }) },
    onoff, items, tidal, offTide, w278dExpOnOffS: w278dExp });
}

/* ── エンジン(診断コピー・刻み 2 段)── */
const toSample = (d, bgSI) => {
  const U = units(d);
  return { W0: bgSI.W * U.L * U.L / U.M, A0: bgSI.A.map((z) => z * U.L * U.T / U.M), gradW: bgSI.gradW.map((z) => z * U.L ** 3 / U.M),
    gradA: bgSI.gradA.map((z) => z * U.L * U.L * U.T / U.M), dWdt: bgSI.dWdt * U.L * U.L * U.T / U.M,
    dAdt: bgSI.dAdt.map((z) => z * U.L * U.T * U.T / U.M) };
};
const engine = [];
for (const S of SAMPLES.filter((z) => z.engine)) {
  const d = declared[S.id], sm = samples.find((z) => z.id === S.id);
  if (!d || !sm || sm.skipped) continue;
  const U = units(d);
  const bgS = toSample(d, sm.background.comoving);
  const frame = { origin: 'barycenter', epoch: 't0(器の診断コピー)', rotation: 'none', translation: 'comoving' };
  const bgDecl = Object.assign({ background: 'declared', note: '第279便c 器の診断コピー: ' + S.ext + 'の点質量を t=0・対の重心で評価(comoving)',
    sources: [{ id: S.ext === '太陽' ? 'sun' : 'galaxy', kind: 'body', excludedExplicit: true }], frame }, bgS);
  const u0Of = (key) => { const o = sm.onoff.find((z) => z.key === key); return o && o.u0 ? o.u0.map((u) => [u[0] * U.T / U.L, u[1] * U.T / U.L]) : null; };
  const T0u = sm.T0S / U.T;
  // 要因分離: サンプルの 1PN(geoPN=2・λ_PN)は**速度に依る「空間に対する加速」**なので、vx,vy を慣性速度 v=ẋ−u と
  // 読む新経路では u の分だけ入力が変わる —— λ_PN=0 の組(noPN)を並べて切り分ける
  const variants = [
    { key: 'OFF', mv: null, vAdj: null, patch: {} },
    { key: 'ON0', mv: { law: 'vMinusU', field: 'backgroundComplex', mutual: 0, frame }, vAdj: u0Of('BC_SH'), patch: {} },
    { key: 'ON1', mv: { law: 'vMinusU', field: 'backgroundComplex', mutual: 1, frame }, vAdj: u0Of('BC1_SH'), patch: {} },
    { key: 'OFFnoPN', mv: null, vAdj: null, patch: { lambdaPN: 0 } },
    { key: 'ON0noPN', mv: { law: 'vMinusU', field: 'backgroundComplex', mutual: 0, frame }, vAdj: u0Of('BC_SH'), patch: { lambdaPN: 0 } },
  ];
  const rows = {};
  for (const N of NE) for (const v of variants) {
    rows[v.key + '@' + N] = await page.evaluate(({ id, mv, bg, vAdj, N, T0u, patch }) => {
      const src = HP.allPresets().find((q) => q.id === id);
      const p = JSON.parse(JSON.stringify(src));
      p.id = id + '_w279cDiag'; p.sampleClass = 'principle'; p.physics.kFrame = 0;
      Object.assign(p.physics, patch || {});
      if (mv) { p.physics.backgroundComplex = bg; p.physics.meshVelocity = mv; }
      const v = HP.validatePreset(p);
      if (!v.ok) return { error: v.errors };
      HP.sim.build(v.preset);
      const S = HP.sim;
      if (mv && !S.hasMeshVelocity) return { error: ['meshVelocity が立たない: ' + S.meshVelDeny] };
      if (vAdj) for (let k = 0; k < 2; k++) { S.vx[k] -= vAdj[k][0]; S.vy[k] -= vAdj[k][1]; }
      const dt = T0u / N;
      const ang = () => Math.atan2(S.y[0] - S.y[1], S.x[0] - S.x[1]);
      const wrap = (q) => { while (q > Math.PI) q -= 2 * Math.PI; while (q < -Math.PI) q += 2 * Math.PI; return q; };
      const L0 = (S.x[0] - S.x[1]) * (S.vy[0] - S.vy[1]) - (S.y[0] - S.y[1]) * (S.vx[0] - S.vx[1]);
      const sgn = L0 >= 0 ? 1 : -1, target = sgn * 2 * Math.PI;
      let unw = 0, prev = ang(), period = null, phaseT = null, rT = null, tT = null;
      const t0w = performance.now();
      for (let n = 0; n < Math.ceil(N * 1.6); n++) {
        S.step(dt);
        if (S.hasNaN && S.hasNaN()) return { error: ['NaN'], n };
        const a1 = ang(), unw1 = unw + wrap(a1 - prev);
        if (period === null && (unw - target) * sgn < 0 && (unw1 - target) * sgn >= 0)
          period = (n + (target - unw) / (unw1 - unw)) * dt;      // 線形補間(ON/OFF で同じ扱い)
        unw = unw1; prev = a1;
        if (n + 1 === N) { phaseT = a1; rT = [S.x[0] - S.x[1], S.y[0] - S.y[1]]; tT = S.t; }
        if (n + 1 >= N && period !== null) break;
      }
      return { period, phaseT, rT, tT, dt, N, unw, ms: performance.now() - t0w,
        meshVelN: S.meshVelN || 0, meshVelUMax: S.meshVelUMax || 0, meshVelKickMax: S.meshVelKickMax || 0,
        meshVelBad: S.meshVelBad || 0, meshVelUndef: S.meshVelUndef || 0, meshVelWork: S.meshVelWork || 0,
        chi: [S.meshVelChiMin, S.meshVelChiMax], integrator: S.integrator, q: S.params.q, kFrame: S.params.kFrame,
        lambdaPN: S.params.lambdaPN, geoPN: S.params.geoPN };
    }, { id: S.id, mv: v.mv, bg: bgDecl, vAdj: v.vAdj, N, T0u, patch: v.patch });
  }
  const n = 2 * Math.PI / T0u;
  const wrap = (q) => { while (q > Math.PI) q -= 2 * Math.PI; while (q < -Math.PI) q += 2 * Math.PI; return q; };
  const dOf = (a, b) => (a && b && !a.error && !b.error && a.phaseT !== null && b.phaseT !== null)
    ? { dPhaseTimeS: wrap(a.phaseT - b.phaseT) / n * U.T, dP: (a.period !== null && b.period !== null) ? (a.period - b.period) * U.T : null,
      dPosM: Math.hypot(a.rT[0] - b.rT[0], a.rT[1] - b.rT[1]) * U.L } : null;
  const on0 = NE.map((N) => dOf(rows['ON0@' + N], rows['OFF@' + N]));
  const on1 = NE.map((N) => dOf(rows['ON1@' + N], rows['OFF@' + N]));
  const on0noPN = NE.map((N) => dOf(rows['ON0noPN@' + N], rows['OFFnoPN@' + N]));
  const hk = sm.onoff.find((z) => z.key === 'BC_SH');
  engine.push({ id: S.id, emoji: S.emoji, steps: NE, T0units: T0u, unitT: U.T, unitL: U.L, background: bgDecl,
    rows, on0, on1, on0noPN, harnessBC_SH4N: hk ? hk.dPhaseTimeS.values[2] : null,
    harnessBC_SHwidth: hk ? hk.dPhaseTimeS.width : null,
    periodOFF: NE.map((N) => rows['OFF@' + N].period === null ? null : rows['OFF@' + N].period * U.T),
    on1Broken: NE.map((N) => { const r = rows['ON1@' + N]; return !!(r.error || r.period === null); }) });
}
await browser.close();

/* ── 書き出し ── */
const CODE = ['tests/exp-w279c-bgbudget2.mjs', 'tests/lib-w279c-bgbudget2.mjs', 'tests/lib-w279c-bgcompose.mjs',
  'tests/lib-w278d-bgequiv.mjs', 'tests/lib-w278d-readaudit.mjs', 'tests/lib-w275b-meshfield.mjs', 'tests/lib-w272e-provenance.mjs'];
const out = {
  meta: Object.assign(provenanceMeta({ root: ROOT, wave: '第279便c', target: TARGET, code: CODE,
    inputs: [TARGET, 'tests/out/bgpredict-w276a.json', 'tests/out/bgequiv-w278d.json'] }), {
    harnessVersion: HARNESS_VERSION, libVersion: BGBUDGET2_VERSION, steps: NS, engineSteps: NE,
    integrator: '純関数: RK4(固定刻み・1 公転)+ 交差時刻の割線法 / エンジン: サンプルの積分器 + dfmMeshVelocityStep(Lie 分割の 1 次)・交差は線形補間',
    declarations: {
      B1: '外部源の質量・距離は事前予測表(bgpredict-w276a)・外部源は −x̂・重心は −ŷ に √(GM/r)(第278便d の E1 と同じ)',
      B2: '座標速度 ẋ(0) はサンプルの宣言そのもの・慣性速度 v=ẋ−u(0)(mutual:1 は 2×2 を解く)',
      B3: 'OFF は同じ重力模型で meshVelocity を切った走行・閾値は置かない(差と収束だけ)',
      B4: 'q・kFrame 以外の宣言値は変えない(qLock は再 fit しない)・診断コピーは kFrame=0・principle',
      B5: '🌘 は参考行(現規格化で壊れる —— 最初の対象にしない)' },
    sigmaBuieS: SIGMA_BUIE,
    notClaim: ['背景を無視してよいことを証明した', '背景を較正した', '閾値を採用した', '慣性を導出した', '新発見',
      '観測と合った', 'v1.45.0 RC を切った'] }),
  onModels: ONS.map((z) => ({ key: z.key, label: z.label, model: z.model, off: z.off })), offModels: OFFS, items: ITEMS,
  samples, engine, pageErrors, elapsedS: (Date.now() - t0) / 1000,
};
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));

const e = (x) => (x === null || x === undefined ? '—' : Number(x).toExponential(4));
for (const s of samples) {
  if (s.skipped) { console.log(`${s.emoji} ${s.id} SKIP`); continue; }
  console.log(`■ ${s.emoji} ${s.label}(${s.ext}・T0=${e(s.T0S)} s・χ_bg=${s.background.chiBgAtBodies.map(e).join('/')}${s.reference ? '・参考行' : ''})`);
  for (const o of s.onoff)
    console.log(`   ${o.key.padEnd(7)} ON−OFF Δt=${e(o.dPhaseTimeS && o.dPhaseTimeS.values[2])} s(幅 ${e(o.dPhaseTimeS && o.dPhaseTimeS.width)})`
      + ` ΔP=${e(o.dP && o.dP.values[2])} Δx=${e(o.dPos && o.dPos.values[2])} bound=${o.onBound} readable=${o.readable}`
      + ` det=${o.initDet === null ? '—' : e(o.initDet)} vsEXP Δt=${e(o.mismatchVsExp.dPhaseTimeS && o.mismatchVsExp.dPhaseTimeS.values[2])}`);
  for (const it of s.items) console.log(`   項 ${it.key.padEnd(14)} Δt=${e(it.dPhaseTimeS && it.dPhaseTimeS.values[2])}(幅 ${e(it.dPhaseTimeS && it.dPhaseTimeS.width)})`
    + ` / 第278便d ${e(it.w278d && it.w278d.dPhaseTimeS4N)}`);
  console.log(`   潮汐: T なし ${e(s.tidal.withoutT && s.tidal.withoutT.values[2])} / T あり ${e(s.tidal.withT && s.tidal.withT.values[2])}`
    + ` / 凍結+T ${e(s.tidal.frozenWithT && s.tidal.frozenWithT.values[2])} / 慣性系 T なし ${e(s.tidal.inertialWithoutT && s.tidal.inertialWithoutT.values[2])}`
    + ` T あり ${e(s.tidal.inertialWithT && s.tidal.inertialWithT.values[2])}`
    + ` / 第278便d 線形 ${e(s.tidal.w278dLinear)} 非線形 ${e(s.tidal.w278dNonlinear)} / 第278便d EXP ON/OFF ${e(s.w278dExpOnOffS)}`);
}
for (const g of engine)
  console.log(`■ エンジン ${g.emoji} ON0−OFF Δt=${g.on0.map((z) => e(z && z.dPhaseTimeS)).join(' → ')} s・ΔP=${g.on0.map((z) => e(z && z.dP)).join(' → ')}`
    + ` / λPN=0: Δt=${g.on0noPN.map((z) => e(z && z.dPhaseTimeS)).join(' → ')} s / 純関数 BC_SH ${e(g.harnessBC_SH4N)}`
    + ` / ON1 壊れる=${g.on1Broken.join(',')} / OFF 周期 ${g.periodOFF.map(e).join(' → ')}`);
console.log(`→ ${path.relative(ROOT, OUT)}(ページエラー ${pageErrors.length}・${out.elapsedS.toFixed(1)} s)`);
