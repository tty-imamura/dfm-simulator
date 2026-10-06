// 第292便c(原仮定者の裁定(第82報)⑤⑥「別途、慣性決定力版も用意し、近点回転 8.85 年にフィットさせる」「q に相当する引きずりが、
// 質量分布の意味での構造(近似コアの質量と半径)に依存する。そのため 🌘 のフィット結果を参考にするのが効率的な検証になる」・
// 統括の検証項目 R139)—— **慣性決定力の構造核(dragCore)と 🌛 earthMoonInertial の器**(Node だけ —— 対象 html の inline script を
// tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、エンジン本体を走らせる。走行は子プロセスで並列)。
//
// ■ 何を測るか
//   門(純関数とエンジンの一致・宣言):
//     (a) 純関数 tests/lib-w292c-dragcore.mjs の極限 (i)〜(v)(点源極限・遠方・線形・求積の収束・遠方展開)と角度の閉じた形の検算。
//     (b) エンジンの dragCoreAvgK・dragCoreTableBuild(表 Q の 1024 点)・dragCoreLookup が純関数と**ビット同一**。
//     (c) 🌛 を build して数步 —— 核の u(_rdUX/_rdUY)が純関数の表で引き直した u とビット同一(源=地球は表・源=月は点源)。
//     (d) 🌛 の宣言: bodies は 🌙 earthMoonReal の宣言を 1 字も変えずに写したもの(地球に dragCore を足しただけ)・physics の宣言。
//     (e) 表の補間誤差(格子の中点で直接の求積と比べた相対差の最大・2R より外・月の軌道帯)と表の外への跳び。
//   フィット(原仮定者の指示 —— **推定であって較正の合ではない**):
//     🌛 の bodies と physics を固定し、`relativeDrag.gain`(C_d)を 1 次元で動かして近点回転の周期(検出器 B〔位置だけ〕・
//     **窓は 27 公転**)を 8.85 年に合わせる(割線法・log–log)。8 公転窓の Δϖ も記録し、🌘 の 8 公転窓 +0.05308 rad/公転(🌘/🧲 の
//     較正窓の宣言値・第135便)と比べる(🌘 そのものの同じ検出器の行は正本 emgrid-w280b の E0 —— 本器は読まない〔段 emgrid は手動の長い段なので鎖の依存にしない〕)。刻み dt=0.016(🌘🌙 の emgrid と同じ)と
//     dt/2 の 2 段で収束の桁を記録する。点源の対照(dragCore なし)の gain も別の 1 次元フィットで記録する(採用値にしない)。
//   同じ gain で:
//     (f) 118 公転の窓で周期・離心率・Δϖ が定常か(27 公転ごとの 4 区間と全体 —— 🧲 B はここで 8.85 → 20.8 年・e 0.055 → 0.169)。
//     (g) 同方向公転の区間平均(恒星月)と 1/P_sid = 1/P_anom + 1/P_aps の関係。
//   感度(第82報⑥): 同じ gain・同じ初速で massFrac ∈ {0.125, 0.325, 0.6} × radius ∈ {0.4R, 0.546R, 0.7R} と点源対照の
//     近点周期・Δϖ(8 公転窓 —— 🌘 の +0.05308 との比)・恒星月。**比が 1 になることを合格条件にしない**。
//     点源との差の 1 次の見積り: a(r) ∝ r⁻ⁿ の近点移動は ≈ πn a(ẋ=v/(1+a) の限定模型 —— n=3 で 3πa)なので、⟨K⟩ ≈ K(1+⟨ρ²⟩/r²) の
//     r⁻⁵ の項は Δϖ を相対 (5/3)⟨ρ²⟩/a² だけ増やす(準円・a = 初期の接触軌道の長半径 —— 表の expect53。見積りであって門ではない)。
//
// ■ しないこと・言わないこと
//   ・🌘 の q・D₀・初速・qLock を使わない(🌛 の初速は 🌙 のまま —— 恒星月は合わせない)。太陽を入れない(太陽は 🔆)。
//   ・C_d・f・R_c を 8.85 年の 1 量から同時に一意決定したと書かない(総質量・慣性モーメントを独立に固定して残る係数をフィットする順序が要る)。
//   ・「8.85 年を慣性決定力が出した(較正ゼロで)」「月を再現した」「較正 合」「C_d は普遍定数」と書かない。
//
// 実行(Node だけ・Chromium 不要・子プロセス 3 本 —— W292C_WORKERS で変える。結果は並列数に依らない):
//   node tests/exp-w292c-dragcore.mjs            → 正本 tests/out/dragcore-w292c.json(W292C_OUT で出力先を変える)
// 読む正本: なし(html だけ)。
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import { fitPeri, YEAR_UNITS_EM, DAY_UNITS_EM } from './lib-w280b-emgrid.mjs';
import * as LD from './lib-w292c-dragcore.mjs';
import * as LC from './lib-w293e-compose.mjs';   // 第293便g: 門 (c) の既定(solve(velocity))の引き直し
const REGEN_SCOPE = {"presets":["earthMoonInertial","earthMoonReal"],"roots":["HP.DRAG_CORE_NR","HP.DRAG_CORE_RMAX_FACTOR","HP.DRAG_CORE_TABLE_N","HP.DRAG_CORE_VERSION","HP.REL_DRAG_COMPOSE_DEFAULT","HP.REL_DRAG_INERTIAL_VERSION","HP.REL_DRAG_SOLVE_FROM_DEFAULT","HP.allPresets","HP.dfmGaussLegendre01","HP.dfmMeshVelocityFieldAt","HP.dragCoreAvgK","HP.dragCoreLookup","HP.dragCoreState","HP.dragCoreTableBuild","HP.geoEffectiveMode","HP.inertialDragState","HP.relDragComposeOf","HP.relDragSolveFromOf","HP.sim","HP.validatePreset"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w292c-dragcore-1';
export const BOOK_ID = 'earthMoonInertial';
export const BASE_ID = 'earthMoonReal';
export const TARGET_YEARS = 8.85;
export const REF_KF1_DW8 = 0.05308;   // 🌘/🧲 の較正窓(8 公転)の宣言値(rad/公転・第135便 —— 退役 🧲 の観測結果カードの値)
export const RUN = Object.freeze({ dt: 0.016, dtHalf: 0.008, fitOrbits: 27, longOrbits: 118, windows: [8, 27] });
export const FIT = Object.freeze({ tol: 2e-6, maxIter: 7 });
export const SENS = Object.freeze({ massFrac: [0.125, 0.325, 0.6], radiusOverR: [0.4, 0.546, 0.7] });
export const LONG_CHUNKS = Object.freeze([[0, 8], [0, 27], [0, 118], [27, 54], [54, 81], [81, 108]]);
export const STATIONARY_CHUNKS = Object.freeze([[0, 27], [27, 54], [54, 81], [81, 108]]);
export const STATIONARY_TOL = 0.02;   // 4 区間の近点周期の (最大−最小)/平均 —— 「定常」と記録する宣言(合否ではない)
const clone = (x) => JSON.parse(JSON.stringify(x));
const find = (HP, id) => HP.allPresets().find((q) => q.id === id);
const R_EARTH = 6.38;
const radiusOf = (k) => Math.round(k * R_EARTH * 1e6) / 1e6;   // 0.4R=2.552・0.546R=3.48348 → 宣言は 3.48(0.546R を 2 桁で丸めた起点)
const sensRadius = (k) => (k === 0.546 ? 3.48 : radiusOf(k));

/* ── 走行(検出器 B〔位置だけ〕は lib-w280b-emgrid の runRow と同じ式・同じ順序。区間ごとの fit のために生の近点を返す)── */
export function runEM(HP, preset, o) {
  const v = HP.validatePreset(clone(preset));
  if (!v.ok) throw new Error('validatePreset: ' + JSON.stringify(v.errors).slice(0, 300));
  HP.sim.build(v.preset);
  const S = HP.sim, ci = 0, oi = 1, dt = o.dt, revMax = o.revMax;
  const rel = () => { const dx = S.x[oi] - S.x[ci], dy = S.y[oi] - S.y[ci]; return [dx, dy, Math.hypot(dx, dy), Math.atan2(dy, dx)]; };
  let [, , r0, th0] = rel();
  const dvx0 = S.vx[oi] - S.vx[ci], dvy0 = S.vy[oi] - S.vy[ci];
  const mu = S.params.G * (S.m[ci] + S.m[oi]), v2 = dvx0 * dvx0 + dvy0 * dvy0;
  const a0 = 1 / (2 / r0 - v2 / mu), P0 = 2 * Math.PI * Math.sqrt(a0 * a0 * a0 / mu);
  let angPrev = th0, angAcc = 0, r1 = r0, r2 = r0, th1 = th0, th2 = th0;
  const B = [], rev = [], rMinRev = [], rMaxRev = [];
  let k = 0, sumMuMax = 0, nan = false;
  const t0 = Date.now();
  for (; ; k++) {
    S.step(dt);
    const [, , rr, th] = rel();
    if (!Number.isFinite(rr)) { nan = true; break; }
    const ri = rev.length;
    if (rMinRev.length <= ri) { rMinRev.push(Infinity); rMaxRev.push(-Infinity); }
    if (rr < rMinRev[ri]) rMinRev[ri] = rr; if (rr > rMaxRev[ri]) rMaxRev[ri] = rr;
    let d = th - angPrev; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
    const prevAcc = angAcc; angAcc += d; angPrev = th;
    const nP = Math.floor(Math.abs(prevAcc) / (2 * Math.PI)), nN = Math.floor(Math.abs(angAcc) / (2 * Math.PI));
    if (nN > nP) { const tg = Math.sign(angAcc) * nN * 2 * Math.PI; const fr = (tg - prevAcc) / (angAcc - prevAcc); rev.push((k - 1 + fr + 1) * dt); }
    if (k >= 2 && r1 < r2 && r1 < rr) {
      const dd = (r2 - 2 * r1 + rr), fr = (dd !== 0) ? 0.5 * (r2 - rr) / dd : 0;
      let a1 = th2, a2 = th1, a3 = th;
      while (a2 - a1 > Math.PI) a2 -= 2 * Math.PI; while (a2 - a1 < -Math.PI) a2 += 2 * Math.PI;
      while (a3 - a2 > Math.PI) a3 -= 2 * Math.PI; while (a3 - a2 < -Math.PI) a3 += 2 * Math.PI;
      B.push({ ang: a2 + 0.5 * fr * (a3 - a1) + 0.5 * fr * fr * (a3 - 2 * a2 + a1), k: k + fr, r: r1 });
    }
    const pm = Math.hypot(S.inertialDragPx || 0, S.inertialDragPy || 0); if (pm > sumMuMax) sumMuMax = pm;
    r2 = r1; r1 = rr; th2 = th1; th1 = th;
    if (rev.length >= revMax) { k++; break; }
  }
  const st = HP.inertialDragState(S);
  return { dt, steps: k, wallSec: (Date.now() - t0) / 1000, nan: nan || S.hasNaN(), osc0: { r: r0, a: a0, P: P0 }, B, rev, rMinRev, rMaxRev,
    ledger: st ? { boundMax: st.boundMax, boundOver: st.boundOver, noHistory: st.noHistory, reject: st.reject, uMax: st.uMax, work: st.work, dL: st.dL, sumMuMax } : null,
    dragCore: HP.dragCoreState(S) };
}
/** 区間 [a,b) 公転の fit(runRow と同じ fitPeri・同じ年/日の換算)。 */
export function windowFit(raw, a, b) {
  const { rev, B, dt } = raw;
  if (rev.length < b) return { from: a, to: b, complete: false };
  const tA = a > 0 ? rev[a - 1] : 0, tB = rev[b - 1];
  let rMin = Infinity, rMax = -Infinity;
  for (let i = a; i < b; i++) { if (raw.rMinRev[i] < rMin) rMin = raw.rMinRev[i]; if (raw.rMaxRev[i] > rMax) rMax = raw.rMaxRev[i]; }
  const f = fitPeri(B.filter((p) => p.k * dt > tA && p.k * dt <= tB), rMin, rMax, raw.osc0.P, dt);
  const apsYr = f.slopeDegPerTime ? 360 / f.slopeDegPerTime / YEAR_UNITS_EM : null;
  const sidDays = a > 0 ? (rev[b - 1] - rev[a - 1]) / (b - a) / DAY_UNITS_EM : (rev[b - 1] - rev[0]) / (b - 1) / DAY_UNITS_EM;
  const anomDays = f.periMean ? f.periMean / DAY_UNITS_EM : null;
  const dwRad = f.slopeDegPerPeri === null ? null : f.slopeDegPerPeri * Math.PI / 180;
  const relation = (apsYr && anomDays) ? { invSid: 1 / sidDays, invAnomPlusAps: 1 / anomDays + 1 / (apsYr * 365.25), rel: (1 / sidDays - (1 / anomDays + 1 / (apsYr * 365.25))) / (1 / sidDays) } : null;
  return { from: a, to: b, complete: true, nPeri: f.nPeri, eProxy: (rMax - rMin) / (rMax + rMin), dwDegPerPeri: f.slopeDegPerPeri, dwRadPerPeri: dwRad,
    apsPeriodYr: apsYr, seDegPerTime: f.seDegPerTime, residRmsDeg: f.residRmsDeg, siderealDays: sidDays, anomDays, relation };
}
export function bookPreset(HP, gain, dragCore) {
  const p = clone(find(HP, BOOK_ID));
  p.physics.relativeDrag = Object.assign({}, p.physics.relativeDrag, { gain });
  if (dragCore === null) delete p.bodies[0].dragCore; else if (dragCore) p.bodies[0].dragCore = dragCore;
  return p;
}
function summarize(raw, spans) {
  return { dt: raw.dt, steps: raw.steps, wallSec: raw.wallSec, nan: raw.nan, osc0: raw.osc0, revN: raw.rev.length, nB: raw.B.length, ledger: raw.ledger,
    windows: spans.map(([a, b]) => windowFit(raw, a, b)) };
}
/** 1 次元フィット(割線法・log g と log P)。runs は評価の列(同じ子プロセスで逐次)。 */
export function fitGain(HP, dragCore, g0, dt) {
  const runs = [];
  const evalAt = (g) => { const raw = runEM(HP, bookPreset(HP, g, dragCore), { dt, revMax: RUN.fitOrbits });
    const s = summarize(raw, [[0, 8], [0, 27]]); const P = s.windows[1].apsPeriodYr; runs.push({ gain: g, P27: P, P8: s.windows[0].apsPeriodYr, summary: s, dragCore: raw.dragCore }); return P; };
  let gA = g0, PA = evalAt(gA);
  let fit = null;
  if (Math.abs(PA / TARGET_YEARS - 1) <= FIT.tol) fit = gA;
  let gB = gA * PA / TARGET_YEARS, PB = null;
  for (let it = 1; fit === null && it < FIT.maxIter; it++) {
    PB = evalAt(gB);
    if (Math.abs(PB / TARGET_YEARS - 1) <= FIT.tol) { fit = gB; break; }
    const lgA = Math.log(gA), lgB = Math.log(gB), fA = Math.log(PA / TARGET_YEARS), fB = Math.log(PB / TARGET_YEARS);
    const lgC = (fB !== fA) ? lgB - fB * (lgB - lgA) / (fB - fA) : lgB - fB;
    gA = gB; PA = PB; gB = Math.exp(lgC);
  }
  // 最初の評価で許容に入ったときも局所の傾き dlnP/dlnC_d を記録するため、g0·(1−2×10⁻³) を 1 回だけ評価する(根は g0 のまま)
  if (fit !== null && runs.length === 1) evalAt(g0 * (1 - 2e-3));
  const last = runs[0].gain === fit ? runs[0] : runs[runs.length - 1];
  // 最後の 2 点の割線で根を推定(最後の評価が許容に入っていればその gain)
  let root = fit;
  if (root === null && runs.length >= 2) { const a = runs[runs.length - 2], b = runs[runs.length - 1];
    const fa = Math.log(a.P27 / TARGET_YEARS), fb = Math.log(b.P27 / TARGET_YEARS); root = Math.exp(Math.log(b.gain) - fb * (Math.log(b.gain) - Math.log(a.gain)) / (fb - fa)); }
  // dP/dg の局所の冪(log–log の傾き —— 最後の 2 点)
  const slope = runs.length >= 2 ? (Math.log(runs[runs.length - 1].P27) - Math.log(runs[runs.length - 2].P27)) / (Math.log(runs[runs.length - 1].gain) - Math.log(runs[runs.length - 2].gain)) : null;
  return { dragCore: (dragCore === undefined) ? 'declared' : (dragCore || null), dt, start: g0, gain: root, converged: fit !== null, lastP27: last.P27, lastRel: last.P27 / TARGET_YEARS - 1, logSlope: slope, iterations: runs.length,
    runs: runs.map((z) => ({ gain: z.gain, P27: z.P27, P8: z.P8 })), first: runs[0] };
}

/* ── 子プロセス: 1 仕事(fit か run)────────────────────────────── */
export function childTask(HP, spec) {
  if (spec.kind === 'fit') return fitGain(HP, spec.dragCore, spec.g0, spec.dt);
  const raw = runEM(HP, bookPreset(HP, spec.gain, spec.dragCore), { dt: spec.dt, revMax: spec.revMax });
  return Object.assign(summarize(raw, spec.spans), { dragCore: raw.dragCore, gain: spec.gain, decl: spec.dragCore || null });
}

/* ── 門(親プロセス・1 回の読み込み)─────────────────────────────── */
export function gates(HP) {
  const p = find(HP, BOOK_ID), base = find(HP, BASE_ID);
  // (d) 宣言
  const strip = (b) => { const c = clone(b); delete c.dragCore; return c; };
  const bodiesSame = JSON.stringify(p.bodies.map(strip)) === JSON.stringify(base.bodies);
  const dcDecl = p.bodies[0].dragCore, moonPoint = p.bodies[1].dragCore === undefined;
  const ph = p.physics, rd = ph.relativeDrag;
  const physicsDecl = { G: ph.G === base.physics.G, cLight: ph.cLight === base.physics.cLight, kappaT: ph.kappaT === base.physics.kappaT, kFrame: ph.kFrame === 0,
    // 第294便a(原仮定者の裁定(第84報)・R148): 🌛 は geoPN=3(慣性決定力の有効化の印 —— 慣性宣言の 3 は測地線 OFF・1PN なし・geoPN=0 とビット同一)。
    //   3 を認めるのは 3 ∧ 慣性宣言を測地線 OFF に解決する世代(html に geoEffectiveMode がある)だけ —— 器 tests/exp-w294a-geo3.mjs がビット同一を示す
    geoPN: ph.geoPN === 0 || (ph.geoPN === 3 && typeof HP.geoEffectiveMode === 'function' && HP.geoEffectiveMode.length >= 1),
    kRep: ph.kRep === 0, muF: ph.muF === 0, gammaN: ph.gammaN === 0, kappaS: ph.kappaS === 0, stateCarry: ph.stateCarry === 'double', law: rd && rd.law === 'inertial', eps: rd && rd.eps === 0.1,
    history: rd && rd.history === 'positions', noD0pull: ph.D0pull === undefined, noQLock: p.qLock === undefined };
  const decl = { id: BOOK_ID, bodiesSameAsBase: bodiesSame, dragCore: dcDecl, moonPoint, physicsDecl, gainDeclared: rd ? rd.gain : null,
    classes: { group: p.group, familyId: p.familyId, familyRole: p.familyRole, sampleClass: p.sampleClass, fidelity: p.fidelity, referenceKind: p.referenceKind, notClaim: p.notClaim } };
  decl.ok = bodiesSame && moonPoint && !!dcDecl && Object.values(physicsDecl).every(Boolean);
  // (b) エンジン ≡ 純関数(ビット)
  const R = p.bodies[0].radius, eps = rd.eps, d = { massFrac: dcDecl.massFrac, radius: dcDecl.radius };
  const glE = HP.dfmGaussLegendre01(HP.DRAG_CORE_NR), glL = LD.gaussLegendre01(HP.DRAG_CORE_NR);
  const glSame = glE.x.every((z, i) => Object.is(z, glL.x[i]) && Object.is(glE.w[i], glL.w[i]));
  const rs = [0, 0.05, 0.5 * R, R, 2 * R, 10 * R, 363.62532, 384.4, 405];
  const avgRows = rs.map((r) => { const e = HP.dragCoreAvgK(r, d, R, eps, glE), l = LD.avgK(r, d, R, eps, HP.DRAG_CORE_NR, { gl: glL }); return { r, engine: e, lib: l, same: Object.is(e, l) }; });
  HP.sim.build(HP.validatePreset(clone(p)).preset);
  const S = HP.sim, DC = HP.dragCoreState(S), T = S._dragCoreT && S._dragCoreT[0];
  const src = DC && DC.sources[0];
  const TLib = LD.tableBuild(d, R, eps, src.n, src.rMax, HP.DRAG_CORE_NR);
  let qSame = T && T.Q.length === TLib.Q.length;
  if (qSame) for (let k = 0; k < TLib.Q.length; k++) if (!Object.is(T.Q[k], TLib.Q[k])) { qSame = false; break; }
  const lookRows = [0.03, 3.3, 6.5, 100, 363.62532, 384.4, 405, src.rMax * 0.999, src.rMax * 1.001].map((r) => { const e = HP.dragCoreLookup(T, r), l = LD.tableLookup(TLib, r); return { r, engine: e, lib: l, same: Object.is(e, l) }; });
  const libGate = { glSame, avgRows, avgSame: avgRows.every((z) => z.same), tableQSame: qSame, lookRows, lookSame: lookRows.every((z) => z.same), n: src.n, rMax: src.rMax, rMaxFrom: src.rMaxFrom };
  libGate.ok = glSame && libGate.avgSame && qSame && libGate.lookSame;
  // (c) 核の u を純関数の表で引き直す(数步・源=地球は表・源=月は点源)
  //   第293便g: 既定の合成則は solve(velocity)(HP.REL_DRAG_COMPOSE_DEFAULT)—— 🌛 そのもの(既定)は結合行列を表で張り直して
  //   (I+L)u = s〔s は力学速度の差〕を純関数 tests/lib-w293e-compose.mjs で解いた u と、compose:"sum" を明示した写し(旧法則版 —— 比較用)は
  //   各源の寄与の和と、それぞれビット同一であることを見る。
  const kernel = (j, r) => (j === 0) ? LD.tableLookup(TLib, r) : null;
  const stepRows = [];
  for (let s = 1; s <= 4; s++) {
    S.step(RUN.dt);
    const C = S.relDrag.gain, n = S.n, pin = Array.from({ length: n }, (_, i) => !!(S.pinned && S.pinned[i]));
    const B = LC.buildRows({ n, x: Array.from(S.rdPrevX.subarray(0, n)), y: Array.from(S.rdPrevY.subarray(0, n)), m: S.m, pinned: pin, pairSet: S._rdPairSet, NP: S._rdPairN,
      C, eps, VX: Array.from(S.vx.slice(0, n)), VY: Array.from(S.vy.slice(0, n)), hist: true, kernel });
    const fixed = pin.map((z, i) => (z || !(S.m[i] > 0)) ? 1 : 0);
    const q = LC.solve({ n, A: B.A, SX: B.SX, SY: B.SY, DG: B.DG, fixed, iters: S.relDrag.solveIters });
    const same = Array.from({ length: n }, (_, i) => i).every((i) => Object.is(q.UX[i], S._rdUX[i]) && Object.is(q.UY[i], S._rdUY[i]));
    stepRows.push({ step: s, hist: S.inertialDragN, compose: HP.relDragComposeOf(S.relDrag), solveFrom: HP.relDragSolveFromOf(S.relDrag), same, res: q.res,
      uMoon: [S._rdUX[1], S._rdUY[1]], uEarth: [S._rdUX[0], S._rdUY[0]] });
  }
  const pSum = clone(p); pSum.physics.relativeDrag.compose = 'sum';
  HP.sim.build(HP.validatePreset(pSum).preset);
  const S2 = HP.sim, sumRows = [];
  for (let s = 1; s <= 4; s++) {
    S2.step(RUN.dt);
    const C = S2.relDrag.gain, e2 = eps * eps, n = S2.n, u = [];
    for (let i = 0; i < n; i++) {
      let ux = 0, uy = 0;
      for (let j = 0; j < n; j++) { if (j === i) continue;
        const dx = S2.rdPrevX[j] - S2.rdPrevX[i], dy = S2.rdPrevY[j] - S2.rdPrevY[i], r2 = dx * dx + dy * dy, r = Math.sqrt(r2), sq = r2 + e2;
        const kv = kernel(j, r);
        const a = C * S2.m[j] * ((kv === null) ? (r / (sq * sq)) : kv);
        ux += a * (S2._rdVX[j] - S2._rdVX[i]); uy += a * (S2._rdVY[j] - S2._rdVY[i]); }
      u.push([ux, uy]);
    }
    const same = u.every((z, i) => Object.is(z[0], S2._rdUX[i]) && Object.is(z[1], S2._rdUY[i]));
    sumRows.push({ step: s, hist: S2.inertialDragN, compose: HP.relDragComposeOf(S2.relDrag), same, uMoon: [S2._rdUX[1], S2._rdUY[1]], uEarth: [S2._rdUX[0], S2._rdUY[0]] });
  }
  const stepGate = { rows: stepRows, sumRows, ok: stepRows.slice(1).every((z) => z.same && z.compose === 'solve' && z.solveFrom === 'velocity') && stepRows[0].hist === 0
    && sumRows.slice(1).every((z) => z.same && z.compose === 'sum') && sumRows[0].hist === 0 };
  // (e) 表の補間誤差と跳び・月の軌道帯
  let band = 0; for (let r = 355; r <= 415; r += 0.37) { const ex = LD.avgK(r, d, R, eps, HP.DRAG_CORE_NR, { gl: glL }), ip = LD.tableLookup(TLib, r); band = Math.max(band, Math.abs(ip - ex) / ex); }
  const tableGate = { interpRelMax: src.interpRelMax, interpRelMaxAt: src.interpRelMaxAt, interpRelMaxFar: src.interpRelMaxFar, jumpAtRMax: src.jumpAtRMax, bandRelMax: band, band: [355, 415] };
  tableGate.ok = tableGate.interpRelMaxFar <= 1e-4 && band <= 1e-7 && Math.abs(tableGate.jumpAtRMax) <= 1e-4;
  // 月の距離での構造の効き(⟨K⟩/K_ε − 1 と遠方展開の 1 次項)
  const fe = LD.farExpansion(363.62532, d, R, eps), atMoon = LD.avgK(363.62532, d, R, eps, HP.DRAG_CORE_NR);
  const moon = { r: 363.62532, rOverR: 363.62532 / R, relToPoint: atMoon / fe.point - 1, firstOrder: fe.firstOrder, rho2: fe.rho2, rho2OverR2: fe.rho2 / (R * R) };
  return { decl, libGate, stepGate, tableGate, moon, dragCoreState: DC, ok: decl.ok && libGate.ok && stepGate.ok && tableGate.ok };
}

/* ── 仕事の一覧(親)── */
export function taskSpecs(gDecl) {
  const out = [];
  out.push({ key: 'fitCore', kind: 'fit', dragCore: undefined, g0: gDecl, dt: RUN.dt });
  out.push({ key: 'fitPoint', kind: 'fit', dragCore: null, g0: gDecl, dt: RUN.dt });
  out.push({ key: 'long', kind: 'run', gain: gDecl, dragCore: undefined, dt: RUN.dt, revMax: RUN.longOrbits, spans: LONG_CHUNKS });
  out.push({ key: 'half', kind: 'run', gain: gDecl, dragCore: undefined, dt: RUN.dtHalf, revMax: RUN.fitOrbits, spans: [[0, 8], [0, 27]] });
  for (const f of SENS.massFrac) for (const k of SENS.radiusOverR) {
    if (f === 0.325 && k === 0.546) continue;   // 宣言そのもの —— fitCore の最初の評価(同じ gain・同じ宣言)を使う
    out.push({ key: `sens-${f}-${k}`, kind: 'run', gain: gDecl, dragCore: { massFrac: f, radius: sensRadius(k) }, dt: RUN.dt, revMax: RUN.fitOrbits, spans: [[0, 8], [0, 27]], f, k });
  }
  return out;
}
const ORDER = ['long', 'fitCore', 'fitPoint', 'half'];   // 重い仕事から(並べ替えは走らせる順だけ —— 結果は並列数に依らない)

const f4 = (x) => (x === null || x === undefined) ? '—' : Number(x).toFixed(4);
const f5 = (x) => (x === null || x === undefined) ? '—' : Number(x).toFixed(5);
const f6 = (x) => (x === null || x === undefined) ? '—' : Number(x).toFixed(6);
const e3 = (x) => (x === null || x === undefined) ? '—' : (x === 0 ? '0' : Number(x).toExponential(2));
/** PHYSICS〔第292便c〕の表の行(QA docs.dragCoreFit が照合する)。 */
export function docRows(J) {
  const out = { fit: [], sens: [], long: [] };
  const dd = J.gates.decl.dragCore;
  const lab = (z) => (z.dragCore === null) ? '点源(対照)' : (z.dragCore === 'declared') ? `dragCore(宣言 f=${dd.massFrac}・R_c=${dd.radius})` : `dragCore(f=${z.dragCore.massFrac}・R_c=${z.dragCore.radius})`;
  for (const z of [J.fit.core, J.fit.point]) out.fit.push(`| ${lab(z)} | ${Number(z.gain).toPrecision(7)} | ${z.iterations} | ${f5(z.lastP27)} | ${e3(z.lastRel)} | ${f4(z.logSlope)} |`);
  for (const r of J.sens.rows) out.sens.push(`| ${r.label} | ${f4(r.rho2OverR2)} | ${f6(r.dw8)} | ${f4(r.ratioToKF1)} | ${e3(r.relToPoint)} | ${r.rho2OverR2 > 0 ? e3(r.relToPoint / r.rho2OverR2) : '—'} | ${e3(r.expect53)} | ${f5(r.aps27)} | ${f5(r.sid27)} |`);
  for (const w of J.long.windows) out.long.push(`| ${w.from}〜${w.to} | ${f4(w.apsPeriodYr)} | ${f6(w.dwRadPerPeri)} | ${f5(w.eProxy)} | ${f5(w.siderealDays)} | ${f5(w.anomDays)} |`);
  return out;
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const TARGET = process.env.QA_TARGET || 'beta/index.html';
if (IS_MAIN && process.argv.includes('--child')) {
  const spec = JSON.parse(process.argv[process.argv.indexOf('--child') + 1]);
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const { HP } = loadHtmlMain(path.join(ROOT, TARGET));
  process.stdout.write(JSON.stringify(childTask(HP, spec)));
} else if (IS_MAIN) {
  const OUT_PATH = process.env.W292C_OUT || path.join(ROOT, 'tests', 'out', 'dragcore-w292c.json');
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const t0 = Date.now();
  const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
  const selfTest = LD.selfTest();
  console.log(`(a) 純関数 ${selfTest.ok}・r=10R の点源との差 ${e3(selfTest.far[0].relToPoint)}(1 次項 ${e3(selfTest.far[0].firstOrder)})`);
  const G = gates(HP);
  console.log(`(b) エンジン≡純関数 ${G.libGate.ok}(⟨K⟩ ${G.libGate.avgSame}・表 Q ${G.libGate.tableQSame}・補間 ${G.libGate.lookSame})・(c) 核の u ${G.stepGate.ok}・(d) 宣言 ${G.decl.ok}・(e) 表 ${G.tableGate.ok}(中点 ${e3(G.tableGate.interpRelMax)}・2R の外 ${e3(G.tableGate.interpRelMaxFar)}・月の帯 ${e3(G.tableGate.bandRelMax)}・跳び ${e3(G.tableGate.jumpAtRMax)})`);
  console.log(`月の距離 r=${G.moon.r}(${G.moon.rOverR.toFixed(1)}R): ⟨K⟩/K_ε−1 = ${e3(G.moon.relToPoint)}・1 次項 ⟨ρ²⟩/r² = ${e3(G.moon.firstOrder)}`);
  const gDecl = G.decl.gainDeclared;
  const ONLY = process.env.W292C_ONLY ? process.env.W292C_ONLY.split(',') : null;   // 開発用(正本を書くときは使わない —— 指定したら正本を書かずに終わる)
  const specs = taskSpecs(gDecl).filter((z) => !ONLY || ONLY.includes(z.key));
  const NW = Math.max(1, Number(process.env.W292C_WORKERS) || 3);
  const results = {};
  const self = fileURLToPath(import.meta.url);
  const runChild = (sp) => new Promise((res, rej) => {
    const ch = spawn(process.execPath, [self, '--child', JSON.stringify(sp)], { cwd: ROOT, env: process.env });
    let out = '', err = '';
    ch.stdout.on('data', (d) => { out += d; }); ch.stderr.on('data', (d) => { err += d; });
    ch.on('close', (code) => { if (code !== 0) return rej(new Error(sp.key + ': ' + err.slice(0, 600)));
      try { results[sp.key] = JSON.parse(out); } catch (e) { return rej(e); }
      const r = results[sp.key];
      if (sp.kind === 'fit') console.log(`  ${sp.key}: gain ${r.gain}・P27 ${f5(r.lastP27)}(${e3(r.lastRel)})・評価 ${r.iterations} 回・${r.runs.map((z) => z.gain.toPrecision(7) + '→' + f5(z.P27)).join(' / ')}`);
      else console.log(`  ${sp.key}: ${r.windows.map((w) => `[${w.from},${w.to}) ${f4(w.apsPeriodYr)} 年・Δϖ ${f6(w.dwRadPerPeri)}・e ${f5(w.eProxy)}`).join(' | ')}(${r.wallSec.toFixed(0)} s)`);
      res(); });
  });
  const rank = (k) => { const i = ORDER.indexOf(k); return i < 0 ? ORDER.length : i; };
  const order = specs.slice().sort((a, b) => rank(a.key) - rank(b.key));
  let next = 0;
  const lane = async () => { while (next < order.length) { const sp = order[next++]; await runChild(sp); } };
  await Promise.all(Array.from({ length: Math.min(NW, order.length) }, lane));
  if (ONLY) { console.log('W292C_ONLY —— 正本は書かない'); process.exit(0); }
  // ---- 集計
  const fitCore = results.fitCore, fitPoint = results.fitPoint, long = results.long, half = results.half;
  const center = fitCore.first.summary, pointRow = fitPoint.first.summary;   // 宣言の gain での最初の評価(宣言そのもの・点源)
  const fitRel = (fitCore.gain - gDecl) / gDecl;
  // 🌘 の参照は較正窓(8 公転)の宣言値 +0.05308 だけ(同じ検出器の 🌘 の行は正本 emgrid-w280b の E0 —— 段 emgrid は手動の長い段なので本器は読まない)
  const kf1 = { source: '🌘/🧲 の較正窓(8 公転)の宣言値(第135便)', declaredDw8: REF_KF1_DW8 };
  const R = R_EARTH;
  const sensRows = [];
  const mkRow = (label, s, decl) => {
    const w8 = s.windows[0], w27 = s.windows[1];
    const fo = decl ? LD.farExpansion(s.osc0.a, decl, R, 0.1).firstOrder : 0;
    return { label, decl: decl || null, dw8: w8.dwRadPerPeri, ratioToKF1: w8.dwRadPerPeri / REF_KF1_DW8, aps8: w8.apsPeriodYr, aps27: w27.apsPeriodYr, dw27: w27.dwRadPerPeri,
      sid27: w27.siderealDays, anom27: w27.anomDays, e27: w27.eProxy, firstOrder: fo, expect53: 5 / 3 * fo, rho2OverR2: decl ? LD.radialMoments(decl, R).rho2 / (R * R) : 0 };
  };
  sensRows.push(mkRow('点源(対照)', pointRow, null));
  for (const f of SENS.massFrac) for (const k of SENS.radiusOverR) {
    const decl = { massFrac: f, radius: sensRadius(k) };
    const s = (f === 0.325 && k === 0.546) ? center : results[`sens-${f}-${k}`];
    sensRows.push(mkRow(`f=${f}・R_c=${k}R`, s, decl));
  }
  const pDw8 = sensRows[0].dw8;
  for (const r of sensRows) r.relToPoint = r.dw8 / pDw8 - 1;
  // 点源との相対差を ⟨ρ²⟩/R² の 1 次(原点を通る直線)で当てた残差 —— 構造が ⟨ρ²⟩(慣性モーメント)だけを通して効くかの記録(門ではない)
  const cr = sensRows.filter((r) => r.decl);
  let sxy = 0, sxx = 0; for (const r of cr) { sxy += r.rho2OverR2 * r.relToPoint; sxx += r.rho2OverR2 * r.rho2OverR2; }
  const slopeRho2 = sxy / sxx;
  let resid = 0; for (const r of cr) resid = Math.max(resid, Math.abs(r.relToPoint - slopeRho2 * r.rho2OverR2));
  const sens = { gain: gDecl, rows: sensRows, rho2Fit: { slope: slopeRho2, maxResid: resid, maxResidRel: resid / Math.max(...cr.map((r) => Math.abs(r.relToPoint))) },
    note: '同じ gain・同じ初速(🌙 のまま)・8 公転窓の Δϖ と 27 公転窓の近点周期・恒星月。比が 1 になることを合格条件にしない' };
  // 118 公転の定常
  const chunks = STATIONARY_CHUNKS.map(([a, b]) => long.windows.find((w) => w.from === a && w.to === b));
  const cps = chunks.map((w) => w.apsPeriodYr), cmean = cps.reduce((s, x) => s + x, 0) / cps.length;
  const ces = chunks.map((w) => w.eProxy);
  const stationary = { chunks: chunks.map((w) => ({ from: w.from, to: w.to, apsPeriodYr: w.apsPeriodYr, eProxy: w.eProxy, dwRadPerPeri: w.dwRadPerPeri })),
    apsSpread: (Math.max(...cps) - Math.min(...cps)) / cmean, eSpread: (Math.max(...ces) - Math.min(...ces)) / (ces.reduce((s, x) => s + x, 0) / ces.length), tol: STATIONARY_TOL };
  stationary.stationary = stationary.apsSpread <= STATIONARY_TOL && stationary.eSpread <= STATIONARY_TOL;
  // h/h2
  const hh = { dt: RUN.dt, dtHalf: RUN.dtHalf, P27: center.windows[1].apsPeriodYr, P27half: half.windows[1].apsPeriodYr, P8: center.windows[0].apsPeriodYr, P8half: half.windows[0].apsPeriodYr,
    sid27: center.windows[1].siderealDays, sid27half: half.windows[1].siderealDays };
  hh.relP27 = (hh.P27half - hh.P27) / hh.P27; hh.relP8 = (hh.P8half - hh.P8) / hh.P8; hh.relSid = (hh.sid27half - hh.sid27) / hh.sid27;
  const slope = (fitCore.logSlope === null) ? -1 : fitCore.logSlope;   // P ∝ g^slope(局所)→ dt/2 で 8.85 年になる gain の 1 次の見積り
  hh.logSlope = slope; hh.gainAtHalf = gDecl * Math.exp(Math.log(TARGET_YEARS / hh.P27half) / slope); hh.gainAtHalfRel = hh.gainAtHalf / gDecl - 1;
  const fit = { target: TARGET_YEARS, window: RUN.fitOrbits, detector: 'B(相対距離の極小 —— 3 点の放物線の頂点・位置だけ)', core: fitCore, point: fitPoint,
    declaredGain: gDecl, declaredRel: fitRel, pointOverCore: fitPoint.gain / fitCore.gain - 1,
    center: { w8: center.windows[0], w27: center.windows[1], ledger: center.ledger, osc0: center.osc0 }, pointCenter: { w8: pointRow.windows[0], w27: pointRow.windows[1], ledger: pointRow.ledger },
    vsKF1: { dw8: center.windows[0].dwRadPerPeri, ratioToDeclared: center.windows[0].dwRadPerPeri / REF_KF1_DW8 } };
  const okRuns = [fitCore.first.summary, fitPoint.first.summary, long, half].concat(Object.keys(results).filter((k) => k.startsWith('sens-')).map((k) => results[k]))
    .every((s) => !s.nan && s.ledger && s.ledger.boundOver === 0 && s.ledger.reject === 0 && s.ledger.noHistory === 1);
  const fitOk = fitCore.converged && fitPoint.converged && Math.abs(fitRel) <= 1e-5;
  const out = {
    meta: null, selfTest, gates: G, fit, hh, sens, long: { gain: gDecl, orbits: RUN.longOrbits, windows: long.windows, ledger: long.ledger, wallSec: long.wallSec, stationary, steps: long.steps },
    kf1, decl: { book: BOOK_ID, base: BASE_ID, run: RUN, fitDecl: FIT, sensDecl: SENS, targetYears: TARGET_YEARS, refKf1Dw8: REF_KF1_DW8 },
    ok: selfTest.ok && G.ok && fitOk && okRuns };
  const CODE = ['tests/exp-w292c-dragcore.mjs', 'tests/lib-w292c-dragcore.mjs', 'tests/lib-w293e-compose.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第292便c', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, libVersion: LD.DRAGCORE_LIB_VERSION, engineVersion: HP.DRAG_CORE_VERSION, inertialVersion: HP.REL_DRAG_INERTIAL_VERSION, loadErrors: errors.length,
    ruling: '原仮定者の裁定(第82報)⑤⑥(慣性決定力版を用意し近点回転 8.85 年にフィットさせる・q に相当する引きずりが近似コアの質量と半径に依存する・🌘 のフィット結果を参考にする)',
    reading: '統括の検証項目 R139(近似コアの質量と半径の体積積分・opt-in・未宣言は点源とビット同一・8.85 年のフィットは「推定」であって較正の合ではない)',
    engine: 'Node の headless(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・子プロセスで並列)',
    gateA: '宣言なしの本の基点とのビット同一は tests/exp-w258c-bitsame.mjs・tests/exp-w272d-sigsame.mjs で示す(基点 html が要るので本正本に載せない)',
    composeRule: '第293便g: 🌛 の合成則は既定の solve(velocity)(宣言は変えない —— 正準形に出ない)。フィット・118 公転・dt/2・感度はすべて既定で走らせた。門 (c) は既定(solve)と compose:"sum" の写しの両方',
    composeDefault: [HP.REL_DRAG_COMPOSE_DEFAULT, HP.REL_DRAG_SOLVE_FROM_DEFAULT],
    notClaim: ['8.85 年を慣性決定力が出した(較正ゼロで)', '月を再現した', '較正 合', 'C_d は普遍定数', 'C_d・f・R_c を 8.85 年の 1 量から同時に一意決定した', '観測一致を達成した'] });
  out.elapsedS = (Date.now() - t0) / 1000;
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 1) + '\n');
  console.log(`フィット: dragCore gain ${fitCore.gain}(宣言 ${gDecl}・相対 ${e3(fitRel)})・点源 ${fitPoint.gain}(dragCore との差 ${e3(fit.pointOverCore)})`);
  console.log(`8 公転窓 Δϖ ${f6(fit.vsKF1.dw8)}(🌘 宣言 0.05308 の ${f4(fit.vsKF1.ratioToDeclared)} 倍)・h/h2: P27 ${f5(hh.P27)} → ${f5(hh.P27half)}(${e3(hh.relP27)})`);
  console.log(`118 公転: 区間の周期 ${stationary.chunks.map((c) => f4(c.apsPeriodYr)).join('/')}・離心 ${stationary.chunks.map((c) => f5(c.eProxy)).join('/')}・定常 ${stationary.stationary}`);
  console.log('→ ' + path.relative(ROOT, OUT_PATH) + '(' + out.elapsedS.toFixed(1) + ' s)・ok ' + out.ok);
}
