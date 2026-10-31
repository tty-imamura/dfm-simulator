// 第321便c(原仮定者の予定(第123報)「geoPN=4の予定: 処理を一新する。銀河の軸引きずりの知見から、銀河の回転引きずりを推定して、銀河のサンプルを作成する」・
// 原仮定者の回答(2026-10-31 —— AN489)・決断事項 AN486・AN487・AN488・AN496・AN497・AN498・統括の検証項目 R268): **geoPN=4 の一新の S1 の器**
// (段 galfield-321c —— 正本 tests/out/galfield-w321c.json)。html・エンジン・在位の本は変えない(器・lib・正本・文書だけ)。
//
// Node だけ(対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読む —— G0 は在位の本をそのまま走らせ、H は第320便a の器の写しの本〔🗺️ の 16 体 +
// 源のモーメント J〕の初期の状態の読み口 inertialDragIsqState〔perSource〕と純関数 inertialDrag3MaintCell・axisHoldSourceSum を呼ぶ)。子プロセス W321C_WORKERS(既定 2)本で
// 部(part)を分けて走らせる(結果は部ごとの標準出力の JSON —— 一時ファイルを作らない)。
//
// ■ 何をするか
//   G0 比較の基準の凍結: 在位の geoPN=4 の本(🔩 chainDiskToy3d・🍥 chainSpreadToy3d)と銀河の本(🎡 galaxyStd・🍳 galaxyDB・🛞 ngc3198DFM —— 今の判定〔未達〕を含む)の
//      宣言の署名(presetSig の sha256)・実行の法則・窓・QA と同じ測り方の値・状態の指紋(窓の終わりの位置と速度の sha256)・所要。💫 galaxyGeo2 は宣言の署名だけ(基準の記録は枝 a)
//   T  銀河の中の任意の位置の源の流れの場(lib の sample —— R × z の表・部分積分の形と u_φ の中心差分の 2 経路・面への退化〔第320便c の面上の環の積分〕・鏡の対称・正規化の項)
//   P  中心と残余の重ならない分割(R_cut × 任意の位置で和 = 全場・J 双極子の近似の誤差・源の宣言の受理と拒否・回転の共変)
//   N  点のセルの和(格子 48/96/192/384 × 軟化の幅 —— 同じ軟化の環の積分と並べる・第320便c の点の和の照合)
//   V  半渦度 ↔ u_φ の対照(境界つきの復元 —— 正則な原点・環状の境界〔境界の値への感度 = 循環 C/R〕・u_φ = Rω½ の読みとの比・解析の場面)
//   H  太陽系の天体ごとの位置の場(太陽の位置 + 各天体の太陽中心の位置)と 6 天体の拮抗の符号つきの表(読み (b) × 源のモーメント J × 源の組 —— 太陽だけ・銀河の場だけ・
//      全源を同じ τ で)・衛星の列(独立の寄与)
// ■ 試走: W321C_QUICK=1(W321C_OUT が要る —— 正本を書かない・窓と表を縮める)。W321C_WORKERS(既定 2 —— 1 なら 1 プロセスで順に)。
// ■ 言わないこと: 半渦度を今の軸引きずり ω_G と同じ量と書かない・半渦度を受け手の軸へ直結する項をエンジンに足さない(器の列だけ —— AN484)・中心 1 体の値を「銀河の引きずり」と
//   呼ばない・M_G を実在の中心単体と書かない・格子の差を判定に使わない(格子の感度)・u_φ = Rω は剛体回転だけ・半渦度だけから u は一意に決まらない・
//   観測の流れを入力して同じ曲線を得ることを予言と呼ばない・拮抗の差を非負へ切らない(AN496)・capObs の全熱を太陽の効果と呼ばない(AN498)。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as F from './lib-w321c-galfield.mjs';
import * as C20 from './lib-w320c-nbcompose.mjs';
import * as L9 from './lib-w319b-srcradius.mjs';
import * as A20 from './lib-w320a-srcheat.mjs';
import { portsOf as portsA, copyBook, stateOf } from './exp-w320a-srcheat.mjs';
// 第281便a の領域 hash の宣言(器・lib と import した第320便a の器・第319便b/第320便c の lib から deriveScope で引いた下限 —— presets は G0 の在位の本 6 本〔💫 は宣言の署名だけ〕・
//   H の 🗺️ の写しの元と、import した lib・器の綴りが数えられた分。roots の短い名は import した lib・器の綴りが数えられた分 —— この器の局所の変数には使わない)
const REGEN_SCOPE = {"presets":["chainDiskToy3d","chainSpreadToy3d","galaxyDB","galaxyGeo2","galaxyStd","jupiterGalilean","jupiterSunInertial3d","marsSunInertial3d","mercury","mercurySunInertial3d","neptuneSunInertial3d","ngc3198DFM","saturn","saturnRingReal","saturnSunInertial3d","solarSystem16Inertial3d","uranusSunInertial3d","venusSunInertial3d"],"roots":["$","HP.REL_DRAG_AXIS_HOLD_BALANCE_VERSION","HP.REL_DRAG_AXIS_HOLD_BALANCE_VERSION_319","HP.REL_DRAG_AXIS_HOLD_MAINT_VERSION","HP.REL_DRAG_AXIS_HOLD_SRC_VERSION","HP.REL_DRAG_INVSQ_SRC_MOMENT_VERSION","HP.ab","HP.abStart","HP.abStop","HP.allPresets","HP.axisHoldSourceSum","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.geoLawOfSim","HP.inertialDrag3MaintCell","HP.inertialDrag3MaintStateOf","HP.inertialDragIsqM1","HP.inertialDragIsqM1Src","HP.inertialDragIsqSrcRadiusOf","HP.inertialDragIsqState","HP.inertialDragState","HP.loadPreset","HP.presetSig","HP.sim","HP.tideState","HP.validatePreset","T","ab","ch","ctx","cw","inertialDragGalaxyAxialState","inertialDragIsqM1","pnSource"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w321c-galfield-1';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (x) => JSON.parse(JSON.stringify(x));
const NOT_CLAIM = ['半渦度を今の軸引きずり ω_G と同じ量と書かない(移送場の診断量)', '半渦度を受け手の軸へ直結する項・回転引きずりの利得の自由な係数をエンジンに足さない(器の列だけ —— AN484)',
  '中心 1 体の値を「銀河の引きずり」と呼ばない', 'M_G を実在の中心単体と書かない', '格子の差を判定に使わない(格子の感度)', 'u_φ = Rω は剛体回転だけ(一般の差動回転に使わない)',
  '半渦度だけから u は一意に決まらない(勾配・循環 C/R の自由度)', '観測の流れを入力して同じ回転曲線を得ることを予言と呼ばない', '拮抗の差 heat.source − heat.composite を非負へ切らない(AN496)',
  'capObs の全熱を太陽の効果と呼ばない(衛星の源は独立の寄与の列 —— AN498)'];
export const OUT_GALFIELD = 'tests/out/galfield-w321c.json';
export const G0_IDS = Object.freeze(['chainDiskToy3d', 'chainSpreadToy3d', 'galaxyStd', 'galaxyDB', 'ngc3198DFM']);
/** 基点 a708bfe の QA の記録(tests/out/qa-results-beta.json の detail —— 表示の桁)と SAMPLE_STATUS の判定(走行の前に写した定数 —— 器が作り直した値と比べる) */
export const BASE_RECORD = Object.freeze({
  galaxyStd: Object.freeze({ qa: 'claim.galaxystd-outerboost', verdict: '達・外縁速度比 1.266 が窓 1.15〜1.4 内', gA: 3.982, gB: 3.145, ratio: 1.2659, window: [1.15, 1.4], drag: 0.379 }),
  galaxyDB: Object.freeze({ qa: 'claim.galaxydb-contrast', verdict: '達・速度分散の比 2.37 が窓 2.2〜3.0 内', sigB: 4.246, sigD: 1.788, sigRatio: 2.37, spinRatio: 1.80, window: [2.2, 3.0] }),
  ngc3198DFM: Object.freeze({ qa: 'behavior.ngc3198', verdict: '未達・外縁の速さ 5.5 × 10⁴ m/s で未達 —— 次の見直しへ', vt: 5.53, rmax: 514, cDisp: 75.7, window: [4.6, 6.3] }),
  chainDiskToy3d: Object.freeze({ qa: 'behavior.drag3d298・behavior.meshField298', verdict: '達・零試験で二次元の 🔗 とビット同一・帯の Δθ 2.169/0.577/0.196 rad・循環 36.6' }),
  chainSpreadToy3d: Object.freeze({ qa: 'behavior.geo4Stable299', verdict: '達・8 条件を満たす(残差 ≤ 5.2e-12・反復 7)' }),
  galaxyGeo2: Object.freeze({ qa: 'claim.galaxygeo2-outerboost', verdict: '達・λ_PN=0 で外縁速度比 1.180 が窓 1.14〜1.23 内・クランプ 0(基準の記録は第321便a)' }) });
const G384 = Object.freeze({ nr: 384, np: 768, nz: 48 });
export const PLAN = Object.freeze({
  g0: Object.freeze({ stdSteps: 6000, dbSteps: 6000, ngcSteps: 2500, chainSteps: 400, dt: 0.016 }),
  R: Object.freeze([2, 4, 6, 8, 8.2, 10, 15]), z: Object.freeze([0, 0.1, -0.1, 0.5, -0.5, 1, -1]), normZ: Object.freeze([0, 0.5]), sunZ: Object.freeze([0.01, 0.02, 0.03]),
  rCut: Object.freeze([1, 2, 4, 6, 8, 10]), splitPos: Object.freeze([[8.2, 0, 0], [8.2, 0, 0.5], [4, 0, 0.1], [8.2 * Math.cos(1), 8.2 * Math.sin(1), -0.3], [12, 0, 1]]), rotPhi: Object.freeze([0, 1, 2.5]),
  cells: Object.freeze({ grids: Object.freeze([...L9.GRIDS.map((g) => ({ nr: g.nr, np: g.np, nz: g.nz })), G384]), eps: Object.freeze([0, 0.3]), pos: Object.freeze([[8.2, 0, 0], [4, 0, 0.5]]) }),
  recon: Object.freeze({ edges: Object.freeze([0, 1, 2, 3, 4, 5, 6, 7, 8, 8.2, 9, 10, 11, 12, 13, 14, 15]), n: Object.freeze([6, 12]), RinKpc: 4, perturb: Object.freeze([0.9, 1.1, 0]) }),
  antag: Object.freeze({ rows: Object.freeze([1, 2, 3, 5, 6, 11]), rCut: Object.freeze([2, 4, 6]), rCutMain: 4, kind: 'J' }) });
export const QUICK = Object.freeze({
  g0: Object.freeze({ stdSteps: 200, dbSteps: 200, ngcSteps: 200, chainSteps: 40, dt: 0.016 }),
  R: Object.freeze([4, 8.2]), z: Object.freeze([0, 0.5, -0.5]), normZ: Object.freeze([0]), sunZ: Object.freeze([0.02]),
  rCut: Object.freeze([2, 4]), splitPos: Object.freeze([[8.2, 0, 0], [8.2, 0, 0.5]]), rotPhi: Object.freeze([0, 1]),
  cells: Object.freeze({ grids: Object.freeze([L9.GRIDS[0], L9.GRIDS[1]].map((g) => ({ nr: g.nr, np: g.np, nz: g.nz }))), eps: Object.freeze([0]), pos: Object.freeze([[8.2, 0, 0]]) }),
  recon: Object.freeze({ edges: Object.freeze([0, 2, 4, 8.2]), n: Object.freeze([4]), RinKpc: 4, perturb: Object.freeze([1.1]) }),
  antag: Object.freeze({ rows: Object.freeze([2, 6]), rCut: Object.freeze([4]), rCutMain: 4, kind: 'J' }) });
const { nrm, dot, cross, add3, scl3, relDiff } = F;
const sha = (buf) => crypto.createHash('sha256').update(buf).digest('hex');
const relV = (a, b) => { const d = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]), s = Math.max(nrm(a), nrm(b)); return s > 0 ? d / s : 0; };

/* ───────── G0 比較の基準の凍結 ───────── */
function digestOf(S) {
  const keys = ['x', 'y', 'z', 'vx', 'vy', 'vz'].filter((k) => S[k] && S[k].length >= S.n), a = new Float64Array(S.n * keys.length);
  let p = 0; for (const k of keys) for (let i = 0; i < S.n; i++) a[p++] = S[k][i];
  return { keys, sha256: sha(Buffer.from(a.buffer)) };
}
function declOf(HP, id) {
  const raw = HP.allPresets().find((p) => p.id === id);
  if (!raw) return { id, found: false };
  const v = HP.validatePreset(clone(raw)), ph = v.ok ? v.preset.physics : {}, rd = ph.relativeDrag || null;
  return { id, found: true, accepted: v.ok, sig: sha(HP.presetSig(clone(raw))), coord3d: ph.coord === '3d', geoPN: ph.geoPN === undefined ? null : ph.geoPN, kFrame: ph.kFrame === undefined ? null : ph.kFrame,
    law: rd ? rd.law || null : null, solver: rd ? rd.solver || null : null, stepDt: ph.stepDt === undefined ? null : ph.stepDt, groups: v.ok ? v.preset.bodies.length : null };
}
export function partG0std(HP, plan) {
  const t0 = Date.now(), d = declOf(HP, 'galaxyStd'), s = HP.sim, N = plan.g0.stdSteps, dt = plan.g0.dt;
  HP.loadPreset('galaxyStd', false); HP.abStart('kFrame', 0); const ab = HP.ab();
  const outer = (sm) => { let sum = 0, c = 0; for (let i = 1; i < sm.n; i++) { const rr = Math.hypot(sm.x[i], sm.y[i]); if (rr >= 156 && rr <= 286) { sum += (sm.x[i] * sm.vy[i] - sm.y[i] * sm.vx[i]) / rr; c++; } } return { v: c ? sum / c : 0, c }; };
  for (let k = 0; k < N; k++) { s.step(dt); ab.simB.step(dt); }
  const gA = outer(s), gB = outer(ab.simB), spec = s.mechSpec(true), bad = s.hasNaN() || ab.simB.hasNaN(), law = HP.geoLawOfSim(s), dig = digestOf(s), digB = digestOf(ab.simB), n = s.n;
  HP.abStop();
  return { id: 'galaxyStd', decl: d, n, law, window: { steps: N, dt, band: [156, 286], ab: 'kFrame 1 / 0(abStart —— QA と同じ)' }, gA: gA.v, gB: gB.v, nBand: gA.c, ratio: gA.v / gB.v, pi: spec ? spec.pi : null, nan: bad,
    digestA: dig, digestB: digB, wallSec: (Date.now() - t0) / 1000 };
}
export function partG0db(HP, plan) {
  const t0 = Date.now(), d = declOf(HP, 'galaxyDB'), N = plan.g0.dbSteps, dt = plan.g0.dt;
  HP.loadPreset('galaxyDB', false); HP.abStart('kFrame', 0); const ab = HP.ab(), S = HP.sim, B = ab.simB;
  const disk = [], bulge = []; for (let i = 1; i <= 190; i++) disk.push(i); for (let i = 191; i < S.n; i++) bulge.push(i);
  for (let k = 0; k < N; k++) { S.step(dt); B.step(dt); }
  const stat = (sm, idx) => { const vt = [], sp = []; for (const i of idx) { const rr = Math.hypot(sm.x[i], sm.y[i]) || 1; vt.push((sm.vx[i] * -sm.y[i] + sm.vy[i] * sm.x[i]) / rr); sp.push(sm.spin[i]); }
    const mean = (a) => a.reduce((x, y) => x + y, 0) / a.length, dv = (a) => { const m = mean(a); return Math.sqrt(mean(a.map((v) => (v - m) * (v - m)))); };
    return { sigT: dv(vt), vt: mean(vt), spinAbs: mean(sp.map(Math.abs)) }; };
  const dS = stat(S, disk), bS = stat(S, bulge), d0 = stat(B, disk), b0 = stat(B, bulge), bad = S.hasNaN() || B.hasNaN(), law = HP.geoLawOfSim(S), dig = digestOf(S), n = S.n, clampV = S.clampVN || 0, clampR = S.clampRN || 0;
  HP.abStop();
  return { id: 'galaxyDB', decl: d, n, law, window: { steps: N, dt, disk: '1〜190', bulge: '191〜', ab: 'kFrame 1 / 0(abStart —— QA と同じ)' }, disk: dS, bulge: bS, disk0: d0, bulge0: b0,
    sigRatio: bS.sigT / dS.sigT, spinRatio: bS.spinAbs / dS.spinAbs, clampV, clampR, nan: bad, digest: dig, wallSec: (Date.now() - t0) / 1000 };
}
export function partG0rest(HP, plan) {
  const out = [], dt = plan.g0.dt;
  { // 🛞 ngc3198DFM(behavior.ngc3198 と同じ測り方 —— 中心核相対の外縁帯 60 ≤ r < 130 の平均の接線の速さ)
    const t0 = Date.now(), d = declOf(HP, 'ngc3198DFM'), v = HP.validatePreset(clone(HP.allPresets().find((q) => q.id === 'ngc3198DFM'))), S = HP.sim; S.build(v.preset);
    for (let k = 0; k < plan.g0.ngcSteps; k++) S.step(dt);
    let ci = -1; for (let i = 0; i < S.n; i++) if (Math.abs(S.m[i]) > 50) { ci = i; break; }
    const cx = ci >= 0 ? S.x[ci] : 0, cy = ci >= 0 ? S.y[ci] : 0, cvx = ci >= 0 ? S.vx[ci] : 0, cvy = ci >= 0 ? S.vy[ci] : 0;
    let sV = 0, n = 0, rmax = 0, gasN = 0;
    for (let i = 0; i < S.n; i++) { if (i === ci) continue; const dx = S.x[i] - cx, dy = S.y[i] - cy, r = Math.hypot(dx, dy); if (r > rmax) rmax = r; if (S.shellGas && S.shellGas[i]) gasN++;
      if (r >= 60 && r < 130) { const tx = -dy / r, ty = dx / r; sV += (S.vx[i] - cvx) * tx + (S.vy[i] - cvy) * ty; n++; } }
    out.push({ id: 'ngc3198DFM', decl: d, n: S.n, law: HP.geoLawOfSim(S), window: { steps: plan.g0.ngcSteps, dt, band: [60, 130], frame: '中心核相対' }, vt: n ? sV / n : null, nOuter: n, rmax, gasN,
      center: ci >= 0, cDisp: ci >= 0 ? Math.hypot(S.x[ci], S.y[ci]) : 0, nan: S.hasNaN(), digest: digestOf(S), wallSec: (Date.now() - t0) / 1000 });
  }
  for (const id of ['chainDiskToy3d', 'chainSpreadToy3d']) {   // 三次元の在位の geoPN=4(連鎖の共通速度の solve —— 窓の終わりの解の統計と指紋)
    const t0 = Date.now(), d = declOf(HP, id), v = HP.validatePreset(clone(HP.allPresets().find((q) => q.id === id))), S = HP.coord3d.makeSim(); S.build(v.preset);
    const r0 = []; for (let i = 0; i < S.n; i++) r0.push(Math.hypot(S.x[i] - S.x[0], S.y[i] - S.y[0]));
    let zMax = 0; for (let k = 0; k < plan.g0.chainSteps; k++) S.step(dt);
    let dr = 0; for (let i = 1; i < S.n; i++) { zMax = Math.max(zMax, Math.abs(S.z[i] - S.z[0])); dr += Math.hypot(S.x[i] - S.x[0], S.y[i] - S.y[0]) - r0[i]; }
    const st = HP.inertialDragState(S), cp = (st && st.compose) || {}, ch = cp.chain || {};
    out.push({ id, decl: d, n: S.n, law: HP.geoLawOfSim(S), window: { steps: plan.g0.chainSteps, dt }, solver: { method: cp.method || null, itersMax: ch.itersMax === undefined ? null : ch.itersMax, resMax: cp.resMax === undefined ? null : cp.resMax,
      fail: ch.fail || 0, restarts: ch.restarts || 0 }, zMax, meanDr: dr / (S.n - 1), nan: S.hasNaN(), digest: digestOf(S), wallSec: (Date.now() - t0) / 1000 });
  }
  out.push({ id: 'galaxyGeo2', decl: declOf(HP, 'galaxyGeo2'), note: '宣言の署名だけ(走行と基準の記録は第321便a の器)' });
  return out;
}

/* ───────── T 任意の位置の場の表 ───────── */
const rowOf = (s) => ({ RKpc: s.cyl.RKpc, zKpc: s.cyl.zKpc, uPhi: s.uPhi, wR: s.halfCurlCyl.R, wZ: s.halfCurlCyl.z, wAbs: Math.hypot(s.halfCurlCyl.R, s.halfCurlCyl.z), tiltDeg: Math.atan2(Math.abs(s.halfCurlCyl.R), Math.abs(s.halfCurlCyl.z)) * 180 / Math.PI,
  routeZ: s.error.route ? s.error.route.halfCurlZ : null, routeR: s.error.route ? s.error.route.halfCurlR : null, quadU: s.error.quadAbs.u, quadZ: s.error.quadAbs.halfCurlZ, quadR: s.error.quadAbs.halfCurlR, edgeShare: s.error.edgeShare,
  divU: s.divU, gradU: s.gradU, rigidRead: s.uPhi !== 0 ? s.halfCurlCyl.z * s.cyl.RKpc * F.KPC / s.uPhi : null });
export function partT(plan) {
  const rows = [], plane = [], mirror = [];
  for (const R of plan.R) for (const z of plan.z) {
    const s = F.sample([R, 0, z], 0, null, { check: true, normalization: plan.normZ.indexOf(z) >= 0 }), r = rowOf(s);
    if (s.normalization) Object.assign(r, { beta: s.normalization.beta, gradBetaR: s.normalization.gradBeta[0], corrShare: s.normalization.corrShare });
    rows.push(r);
  }
  for (const R of plan.R) {   // 面への退化: 第320便c の面上の環の積分(z′ ≥ 0 の対称の積分)の和
    const u20 = L9.MW.disks.reduce((a, D) => a + C20.ringUphiDisk(D, 0, L9.MW.RmaxKpc, R, 0, F.DECL.quadRel), 0), w20 = L9.MW.disks.reduce((a, D) => a + C20.ringCurlZ(D, 0, L9.MW.RmaxKpc, { RKpc: R, rel: F.DECL.quadRel }).omegaZ, 0);
    const r = rows.find((q) => q.RKpc === R && q.zKpc === 0);
    if (r) plane.push({ RKpc: R, uPhi: r.uPhi, uPhi320c: u20, uRel: relDiff(r.uPhi, u20), wZ: r.wZ, wZ320c: w20, wRel: relDiff(r.wZ, w20) });
  }
  for (const r of rows) if (r.zKpc > 0) { const m = rows.find((q) => q.RKpc === r.RKpc && q.zKpc === -r.zKpc); if (m) mirror.push({ RKpc: r.RKpc, zKpc: r.zKpc, uRel: relDiff(r.uPhi, m.uPhi), wZRel: relDiff(r.wZ, m.wZ), wROdd: relDiff(r.wR, -m.wR) }); }
  // 太陽の高さの感度(宣言の模型は太陽を面の上 z = 0 に置く —— 面の外へ少し動かしたときの半渦度の向き)
  const sunZ = plan.sunZ.map((z) => rowOf(F.sample([L9.FLOW.R0kpc, 0, z], 0, null, { check: true })));
  const routeRelMax = Math.max(...rows.concat(sunZ).map((r) => Math.max(r.routeZ / r.wAbs, r.routeR / r.wAbs)));
  const divRelMax = Math.max(...rows.map((r) => Math.abs(r.divU) / Math.max(...r.gradU.map(Math.abs))));
  return { rows, sunZ, plane, mirror, routeRelMax, divRelMax, planeRelMax: Math.max(...plane.map((p) => Math.max(p.uRel, p.wRel))), mirrorRelMax: mirror.length ? Math.max(...mirror.map((m) => Math.max(m.uRel, m.wZRel, m.wROdd))) : 0 };
}

/* ───────── P 中心と残余の重ならない分割・源の宣言・回転の共変 ───────── */
export function partP(plan) {
  const rows = [];
  for (const pos of plan.splitPos) {
    const full = F.sample(pos, 0, null, {}), xm = pos.map((q) => q * F.KPC);
    for (const rc of plan.rCut) {
      const s = F.sample(pos, 0, F.splitState(rc), {}), c = s.parts.find((p) => p.key === 'center'), r = s.parts.find((p) => p.key === 'residual'), Jc = F.jOfDisks(0, rc), dip = F.dipoleField([0, 0, Jc], xm);
      rows.push({ pos, rCutKpc: rc, uRel: relV(s.u, full.u), wRel: relV(s.halfCurl, full.halfCurl), gRel: relV(s.gradU.slice(0, 3), full.gradU.slice(0, 3)) || 0,
        centerUphi: c.uPhi, residualUphi: r.uPhi, centerWz: c.halfCurlCyl.z, residualWz: r.halfCurlCyl.z, centerWR: c.halfCurlCyl.R, residualWR: r.halfCurlCyl.R, fullWz: full.halfCurlCyl.z,
        Jc, dipoleWz: dot(dip.halfCurl, [0, 0, 1]), dipoleErrW: relV(dip.halfCurl, c.halfCurl), dipoleErrU: relV(dip.u, c.u), centerDominant: Math.abs(c.halfCurlCyl.z) > Math.abs(r.halfCurlCyl.z) });
    }
  }
  // 源の宣言の受理と拒否(checkState —— 第320便c の combineDisjoint)
  const disks = F.ALL_COMPS.filter((c) => c !== 'bulge'), cases = [];
  const tryS = (key, ja, st, expect) => { let ok = true, err = null; try { F.checkState(st); } catch (e) { ok = false; err = String(e.message || e); } cases.push({ key, ja, accepted: ok, expect, err, same: ok === expect }); };
  tryS('full', '全成分 1 項(全場)', F.fullState(), true);
  tryS('split4', '中心(バルジ + R < 4 kpc)+ 残余(R ≥ 4 kpc)', F.splitState(4), true);
  tryS('overlap', '中心(R < 5 kpc)+ 残余(R ≥ 4 kpc)—— 4〜5 kpc が重なる', { model: F.MODEL_ID, terms: [F.splitState(5).terms[0], F.splitState(4).terms[1]] }, false);
  tryS('proxyPlusRes', '代理 M_G(全成分を持つ)+ 残余 —— 同じ円盤の流れを二度', { model: F.MODEL_ID, terms: [{ key: 'proxy', owns: [{ comp: 'galaxy:proxy' }], proxy: { J: 1e67 } }, F.splitState(4).terms[1]] }, false);
  tryS('proxyAlone', '代理だけ(J 双極子 —— 比べの列)', { model: F.MODEL_ID, terms: [{ key: 'proxy', owns: [{ comp: 'galaxy:proxy' }], proxy: { J: 1e67 } }] }, true);
  tryS('proxyNoJ', '代理の J の宣言が無い', { model: F.MODEL_ID, terms: [{ key: 'proxy', owns: [{ comp: 'galaxy:proxy' }] }] }, false);
  tryS('bulgeTwice', 'バルジを中心と残余の両方に', { model: F.MODEL_ID, terms: [F.splitState(4).terms[0], { key: 'residual', owns: [{ comp: 'bulge' }].concat(disks.map((c) => ({ comp: c, lo: 4 }))) }] }, false);
  tryS('unknown', '未知の成分', { model: F.MODEL_ID, terms: [{ key: 'x', owns: [{ comp: 'disk:other' }] }] }, false);
  tryS('model', '模型の名が違う', { model: 'other', terms: F.fullState().terms }, false);
  // 回転の共変(同じ R・z で方位 φ を替える —— 円筒の成分は同じ・デカルトは回転)
  const rot = [], ref = F.sample([8.2, 0, 0.5], 0, null, {});
  for (const ph of plan.rotPhi) {
    const s = F.sample([8.2 * Math.cos(ph), 8.2 * Math.sin(ph), 0.5], 0, null, {}), c = Math.cos(ph), sn = Math.sin(ph), Rz = [[c, -sn, 0], [sn, c, 0], [0, 0, 1]];
    const ru = [0, 1, 2].map((i) => dot(Rz[i], ref.u)), G0 = [[0, 1, 2], [3, 4, 5], [6, 7, 8]].map((r) => r.map((k) => ref.gradU[k])), RG = Rz.map((ri) => [0, 1, 2].map((j) => ri.reduce((a, v, k) => a + v * G0[k][j], 0))), RGR = RG.map((ri) => [0, 1, 2].map((j) => ri.reduce((a, v, k) => a + v * Rz[j][k], 0)));
    const gs = Math.max(...ref.gradU.map(Math.abs));
    rot.push({ phi: ph, uRel: relV(s.u, ru), gRel: Math.max(...RGR.flat().map((v, k) => Math.abs(v - s.gradU[k]))) / gs, cylSame: s.uPhi === ref.uPhi && s.halfCurlCyl.z === ref.halfCurlCyl.z && s.halfCurlCyl.R === ref.halfCurlCyl.R });
  }
  // 有効域の外は拒否(0 で埋めない)
  const outside = [[0, 0, 0], [45, 0, 0], [8.2, 0, 6]].map((p) => { const s = F.sample(p, 0, null, {}); return { pos: p, ok: s.ok, reason: s.reason || null }; });
  // 定常でない宣言は dUdt を null に(0 で埋めない)
  const ns = F.sample([8.2, 0, 0], 0, Object.assign(F.fullState(), { stationary: false }), {});
  return { rows, cases, rot, outside, nonStationary: { dUdt: ns.dUdt, complete: ns.timeDerivativeComplete }, splitRelMax: Math.max(...rows.map((r) => Math.max(r.uRel, r.wRel))), casesSame: cases.every((c) => c.same),
    rotRelMax: Math.max(...rot.map((r) => Math.max(r.uRel, r.gRel))) };
}

/* ───────── N 点のセルの和(格子の感度)───────── */
export function partN(plan) {
  const rows = [];
  for (const pos of plan.cells.pos) for (const e of plan.cells.eps) {
    const ring = F.sample(pos, 0, null, { epsKpc: e }), cells = [];
    for (const g of plan.cells.grids) { let u = [0, 0, 0], G = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]; for (const D of L9.MW.disks) { const r = F.diskCellsAt(D, g, pos, { epsKpc: e }); u = add3(u, r.u); for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) G[i][j] += r.G[i][j]; }
      const hc = F.halfCurlOfG(G); cells.push({ nr: g.nr, uPhi: u[1] * Math.cos(Math.atan2(pos[1], pos[0])) - u[0] * Math.sin(Math.atan2(pos[1], pos[0])), wZ: hc[2], wX: hc[0], uRel: (u[1] - ring.u[1]) / Math.abs(ring.u[1]), wZRel: (hc[2] - ring.halfCurl[2]) / Math.abs(ring.halfCurl[2]) }); }
    const fin = cells.slice(-2);
    rows.push({ pos, epsKpc: e, ringUphi: ring.uPhi, ringWz: ring.halfCurlCyl.z, ringWR: ring.halfCurlCyl.R, cells, signs: cells.map((c) => F.sgnOf(c.wZ)), signRing: F.sgnOf(ring.halfCurlCyl.z),
      resolvedWz: fin.length === 2 && fin.every((c) => Math.abs(c.wZRel) <= 0.05), resolvedU: fin.length === 2 && fin.every((c) => Math.abs(c.uRel) <= 0.05) });
  }
  // 第320便c の点の和(太陽の位置・ε = 0)の照合: 同じ点の和の ω_GC,z(演算の順は違う)
  const g = L9.GRIDS[0], w20 = L9.MW.disks.reduce((a, D) => a + C20.diskCells(D, g, {}).wgc, 0), w21 = L9.MW.disks.reduce((a, D) => a + F.diskCellsAt(D, g, [L9.FLOW.R0kpc, 0, 0], {}).halfCurl[2], 0);
  return { rows, repro: { nr: g.nr, w320c: w20, w321c: w21, rel: relDiff(w20, w21) } };
}

/* ───────── V 半渦度 ↔ u_φ の対照 ───────── */
export function partV(plan) {
  const P = plan.recon, cache = new Map(), om = (s) => { if (!cache.has(s)) cache.set(s, F.sample([s, 0, 0], 0, null, {}).halfCurlCyl.z); return cache.get(s); };
  const dc = new Map(), direct = (R) => { if (!dc.has(R)) dc.set(R, F.sample([R, 0, 0], 0, null, {}).uPhi); return dc.get(R); };
  const Rs = P.edges.filter((e) => e > 0 && plan.R.indexOf(e) >= 0), rows = [], uIn = direct(P.RinKpc);
  for (const R of Rs) {
    const ud = direct(R), row = { RKpc: R, direct: ud, wZ: om(R), rigidRead: om(R) * R * F.KPC, rigidOverDirect: om(R) * R * F.KPC / ud, origin: [], annulus: [] };
    for (const n of P.n) { const v = F.uphiFromHalfCurl({ RKpc: R, RinKpc: 0, uIn: 0, omegaOf: om, n, brk: P.edges }); row.origin.push({ n, u: v, rel: (v - ud) / Math.abs(ud) }); }
    const nB = P.n[P.n.length - 1];
    if (R !== P.RinKpc) {
      const base = F.uphiFromHalfCurl({ RKpc: R, RinKpc: P.RinKpc, uIn, omegaOf: om, n: nB, brk: P.edges });
      row.annulus.push({ mul: 1, uIn, u: base, rel: (base - ud) / Math.abs(ud) });
      for (const m of P.perturb) { const v = F.uphiFromHalfCurl({ RKpc: R, RinKpc: P.RinKpc, uIn: m * uIn, omegaOf: om, n: nB, brk: P.edges }), expect = (m - 1) * uIn * P.RinKpc / R;
        row.annulus.push({ mul: m, uIn: m * uIn, u: v, rel: (v - ud) / Math.abs(ud), shift: v - base, shiftCR: expect, crRel: relDiff(v - base, expect) }); }
    }
    rows.push(row);
  }
  // 解析の場面(剛体・差動・平坦・同じ半渦度の 2 つの場・正則な原点の拒否)
  const K = F.KPC, U = (o) => F.uphiFromHalfCurl(Object.assign({ n: 8 }, o)), sc = [];
  { const w = 1e-15, v = [0.1, 1, 5].map((R) => relDiff(U({ RKpc: R, RinKpc: 0, uIn: 0, omegaOf: () => w }), w * R * K)); sc.push({ key: 'rigid', ja: '剛体の回転(ω½ 一定 → u_φ = ω½ R)', rel: Math.max(...v) }); }
  { const a = 1e-15, b = 2e-17, R = 3, v = U({ RKpc: R, RinKpc: 0, uIn: 0, omegaOf: (s) => a + b * s * s }); sc.push({ key: 'diff', ja: '差動の回転(ω½ = a + bR² → u_φ = aR + bR³/2)', rel: relDiff(v, (a * R + b * R * R * R / 2) * K) }); }
  { const V = 2e5, v = [1, 2, 4].map((R) => relDiff(U({ RKpc: R, RinKpc: 2, uIn: V, omegaOf: (s) => V / (2 * s * K) }), V)); sc.push({ key: 'flat', ja: '平坦な回転(ω½ = V/(2R)・環状の境界 R_in = 2 → u_φ = V)', rel: Math.max(...v) }); }
  { const a = U({ RKpc: 4, RinKpc: 2, uIn: 3, omegaOf: () => 0 }), b = U({ RKpc: 4, RinKpc: 2, uIn: 5, omegaOf: () => 0 }); sc.push({ key: 'cr', ja: '同じ半渦度 0・境界の値 3 と 5 m/s → u_φ = C/R(1.5 と 2.5 m/s —— 一意でない)', a, b, rel: Math.max(relDiff(a, 1.5), relDiff(b, 2.5)), distinct: a !== b }); }
  const thr = []; for (const o of [{ RKpc: 1, RinKpc: 0, uIn: 1, omegaOf: () => 0 }, { RKpc: 0, RinKpc: 2, uIn: 1, omegaOf: () => 0 }, { RKpc: 1, RinKpc: 0, uIn: 0, omegaOf: () => NaN }]) { try { U(o); thr.push(false); } catch (e) { thr.push(e instanceof RangeError); } }
  sc.push({ key: 'reject', ja: '正則でない原点(u_φ(0) ≠ 0)・環状の境界から原点・有限でない ω½ を拒否', rel: 0, rejected: thr.every(Boolean) });
  const fin = rows.map((r) => r.origin[r.origin.length - 1].rel);
  return { rows, scenes: sc, nEval: cache.size, RinKpc: P.RinKpc, uIn, originRelMax: Math.max(...fin.map(Math.abs)), crRelMax: Math.max(0, ...rows.flatMap((r) => r.annulus.filter((a) => a.crRel !== undefined).map((a) => a.crRel))),
    scenesOk: sc.every((s) => (s.key === 'reject' ? s.rejected : s.rel <= 1e-9) && (s.key !== 'cr' || s.distinct)) };
}

/* ───────── H 太陽系の天体ごとの位置と 6 天体の拮抗 ───────── */
export function partH(HP, plan) {
  const E = portsA(HP), st = stateOf(E, copyBook(HP, 'solar16', { hold: { mode: 'maintain' }, sm: A20.sourceMomentOf(plan.antag.kind) }));
  if (!st.ok) throw new Error('🗺️ の写しが受理されない: ' + st.err);
  const S = st.S, U = A20.unitsOf(st.preset.scaleExp), Fr = L9.galFrame(), ga = A20.galaxyAxis(), R0 = L9.FLOW.R0kpc, n = S.n;
  const posG = (i) => { const d = [S.x[i] - S.x[0], S.y[i] - S.y[0], S.z[i] - S.z[0]].map((q) => q * U.len); return { dEcl: d, dGal: F.fromEcl(Fr, d), xKpc: add3([R0, 0, 0], scl3(F.fromEcl(Fr, d), 1 / F.KPC)) }; };
  const sun = F.sample([R0, 0, 0], 0, F.splitState(plan.antag.rCutMain), { rel: 1e-11 }), G3 = [[0, 1, 2], [3, 4, 5], [6, 7, 8]].map((r) => r.map((k) => sun.gradU[k]));
  const bodies = [0].concat(plan.antag.rows).map((i) => {
    const p = posG(i), s = i === 0 ? sun : F.sample(p.xKpc, 0, F.splitState(plan.antag.rCutMain), { rel: 1e-11 }), dxm = p.dGal, lin = add3(sun.u, [0, 1, 2].map((a) => dot(G3[a], dxm)));
    return { i, name: L9.BODY16[i], dAu: nrm(p.dEcl) / F.AU, dGalAu: p.dGal.map((q) => q / F.AU), xKpc: p.xKpc, u: s.u, halfCurl: s.halfCurl, parts: s.parts.map((q) => ({ key: q.key, halfCurl: q.halfCurl })),
      duRel: relV(s.u, sun.u), dwRel: relV(s.halfCurl, sun.halfCurl), linRel: i === 0 ? 0 : nrm([0, 1, 2].map((a) => s.u[a] - lin[a])) / Math.max(nrm([0, 1, 2].map((a) => lin[a] - sun.u[a])), 1e-300), linDu: nrm([0, 1, 2].map((a) => lin[a] - sun.u[a])) };
  });
  // 6 天体の拮抗(読み (b) —— エンジンの純関数 inertialDrag3MaintCell・受け手 I = ½ m R²〔エンジンの維持の型 —— AN497 の明示潮汐の I は別の列〕)
  const cell = E.cell, rows = [], gateEngine = [];
  const galVec = (b, key, rc) => { const hc = rc === plan.antag.rCutMain ? b.parts.find((q) => q.key === key).halfCurl : null; return hc ? F.toFrame(Fr, hc) : null; };
  for (const i of plan.antag.rows) {
    const b = bodies.find((q) => q.i === i), r = st.isq.receivers.find((q) => q.i === i), osrc = r.omegaSrc, w = (j) => [osrc[j * 4], osrc[j * 4 + 1], osrc[j * 4 + 2]].map((q) => q * U.W);
    const I = 0.5 * S.m[i] * U.mass * Math.pow(S.R[i] * U.len, 2), s0 = S.spin[i] * U.W, a = [S.sax[i], S.say[i], S.saz[i]];
    const sats = [], others = []; for (let j = 0; j < n; j++) { if (j === i || j === 0) continue; (L9.SAT_PARENT[j] === i ? sats : others).push(j); }
    const gc = galVec(b, 'center', plan.antag.rCutMain), gr = galVec(b, 'residual', plan.antag.rCutMain), gFull = add3(gc, gr), gDecl = scl3(ga.g, ga.OmRefSI);
    const bodyW = [0].concat(sats, others).map((j) => ({ j, w: w(j) }));
    const sets = { sun: [w(0)], galaxy: [gc, gr], galaxyOne: [gFull], sunGalaxy: [w(0), gc, gr], solar: bodyW.map((q) => q.w), all: bodyW.map((q) => q.w).concat([gc, gr]), allDecl: bodyW.map((q) => q.w).concat([gDecl]), solarNoSat: [w(0)].concat(others.map(w)) };
    const res = {}; for (const [k, list] of Object.entries(sets)) { const q = F.antagOf(cell, I, s0, a, list); res[k] = { source: q.source, composite: q.composite, diff: q.diff, n: list.length }; }
    const one = (v) => F.antagOf(cell, I, s0, a, [v]).source, cols = { sun: one(w(0)), sats: sats.reduce((s, j) => s + one(w(j)), 0), others: others.reduce((s, j) => s + one(w(j)), 0), galCenter: one(gc), galResidual: one(gr), galFull: one(gFull), galDecl: one(gDecl) };
    // エンジンの純関数 axisHoldSourceSum(読み (b) の印)で同じ源の列の和(ビット同一の門)
    const V = new Float64Array(bodyW.length * 4); bodyW.forEach((q, k) => { V[k * 4] = q.w[0]; V[k * 4 + 1] = q.w[1]; V[k * 4 + 2] = q.w[2]; });
    const SM = new Float64Array(27); E.sourceSum(I, s0, a[0], a[1], a[2], false, V, bodyW.length, SM, null, 0, true);
    gateEngine.push({ i, engine: SM[2], lib: res.solar.source, same: Object.is(SM[2], res.solar.source) });
    const Om = a.map((q) => q * s0), aI = scl3(a, Math.sign(s0) || 1);   // â_I = Ω_I の向き(符号つきの自転)
    rows.push({ i, name: L9.BODY16[i], I, Om: Math.abs(s0), OmDotG: dot(a, ga.g) * Math.sign(s0), sats: sats.map((j) => L9.BODY16[j]), wSunAbs: nrm(w(0)), galCenterZ: dot(gc, ga.g), galResidualZ: dot(gr, ga.g), galFullAbs: nrm(gFull),
      pSun: dot(w(0), aI), pGal: dot(gFull, aI), pCenter: dot(gc, aI), pResidual: dot(gr, aI), angOmGal: A20.angDeg(Om, gFull), sets: res, cols, h0: st.preset.physics.stepDt * U.time });
  }
  // R_cut の感度(銀河の場だけの 2 源の差 —— 中心と残余の分け方で源ごとの和が動く・合成は動かない)
  const rcRows = [];
  for (const rc of plan.antag.rCut) for (const i of plan.antag.rows) {
    const b = bodies.find((q) => q.i === i), s = rc === plan.antag.rCutMain ? null : F.sample(b.xKpc, 0, F.splitState(rc), { rel: 1e-11 });
    const gc = F.toFrame(Fr, s ? s.parts.find((q) => q.key === 'center').halfCurl : b.parts.find((q) => q.key === 'center').halfCurl), gr = F.toFrame(Fr, s ? s.parts.find((q) => q.key === 'residual').halfCurl : b.parts.find((q) => q.key === 'residual').halfCurl);
    const I = 0.5 * S.m[i] * U.mass * Math.pow(S.R[i] * U.len, 2), s0 = S.spin[i] * U.W, a = [S.sax[i], S.say[i], S.saz[i]], q = F.antagOf(cell, I, s0, a, [gc, gr]);
    rcRows.push({ rCutKpc: rc, i, name: L9.BODY16[i], source: q.source, composite: q.composite, diff: q.diff });
  }
  // 衛星の列の対照(源のモーメント capObs —— 衛星の源の R_src が観測の半径〔上限 6.5e6 m〕に: capObs の全熱を太陽の効果と呼ばない —— AN498)
  const sc = stateOf(E, copyBook(HP, 'solar16', { hold: { mode: 'maintain' }, sm: A20.sourceMomentOf('capObs') })), capRows = [];
  if (sc.ok) for (const i of plan.antag.rows) {
    const S2 = sc.S, r = sc.isq.receivers.find((q) => q.i === i), osrc = r.omegaSrc, w = (j) => [osrc[j * 4], osrc[j * 4 + 1], osrc[j * 4 + 2]].map((q) => q * U.W);
    const I = 0.5 * S2.m[i] * U.mass * Math.pow(S2.R[i] * U.len, 2), s0 = S2.spin[i] * U.W, a = [S2.sax[i], S2.say[i], S2.saz[i]], one = (v) => F.antagOf(cell, I, s0, a, [v]).source;
    const sats = [], others = []; for (let j = 0; j < n; j++) { if (j === i || j === 0) continue; (L9.SAT_PARENT[j] === i ? sats : others).push(j); }
    const all = F.antagOf(cell, I, s0, a, [0].concat(sats, others).map(w)), noSat = F.antagOf(cell, I, s0, a, [0].concat(others).map(w));
    capRows.push({ i, name: L9.BODY16[i], sun: one(w(0)), sats: sats.reduce((q, j) => q + one(w(j)), 0), others: others.reduce((q, j) => q + one(w(j)), 0), allSource: all.source, allComposite: all.composite, allDiff: all.diff,
      noSatSource: noSat.source, noSatComposite: noSat.composite, sunShareOfAll: one(w(0)) / all.source });
  }
  return { kind: plan.antag.kind, rCutMain: plan.antag.rCutMain, bodies, rows, rcRows, capRows, gateEngine, sunDecl: { OmRef: ga.OmRefSI }, warnings: st.warnings };
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const G = {}, B = BASE_RECORD;
  const std = J.G0 && J.G0.std, db = J.G0 && J.G0.db, ngc = J.G0 && J.G0.rest && J.G0.rest.find((r) => r.id === 'ngc3198DFM');
  const near = (a, b, tol) => Math.abs(a - b) <= tol * Math.abs(b);
  G.g0Std = !!(std && !std.nan && (J.quick || (std.ratio >= B.galaxyStd.window[0] && std.ratio <= B.galaxyStd.window[1] && near(std.ratio, B.galaxyStd.ratio, 1e-4) && near(std.gA, B.galaxyStd.gA, 2e-4) && near(std.gB, B.galaxyStd.gB, 2e-4))));
  G.g0Db = !!(db && !db.nan && db.clampV === 0 && db.clampR === 0 && (J.quick || (near(db.sigRatio, B.galaxyDB.sigRatio, 3e-3) && near(db.spinRatio, B.galaxyDB.spinRatio, 3e-3))));
  G.g0Ngc = !!(ngc && !ngc.nan && ngc.center && (J.quick || (near(ngc.vt, B.ngc3198DFM.vt, 1e-3) && near(ngc.rmax, B.ngc3198DFM.rmax, 2e-3) && near(ngc.cDisp, B.ngc3198DFM.cDisp, 1e-3))));
  G.g0Chain = !!(J.G0 && J.G0.rest && ['chainDiskToy3d', 'chainSpreadToy3d'].every((id) => { const r = J.G0.rest.find((q) => q.id === id); return r && !r.nan && r.decl.accepted && r.decl.geoPN === 4 && r.solver.fail === 0; }));
  G.tRoute = !!(J.T && J.T.routeRelMax <= 1e-5);
  G.tPlane = !!(J.T && J.T.planeRelMax <= 1e-9);
  G.tMirror = !!(J.T && J.T.mirrorRelMax <= 1e-9);
  G.tDiv = !!(J.T && J.T.divRelMax <= 1e-12);
  G.pSplit = !!(J.P && J.P.splitRelMax <= 1e-8);
  G.pCases = !!(J.P && J.P.casesSame && J.P.outside.every((o) => o.ok === false) && J.P.nonStationary.dUdt === null && J.P.nonStationary.complete === false);
  G.pRot = !!(J.P && J.P.rotRelMax <= 1e-12 && J.P.rot.every((r) => r.cylSame));
  G.nRepro = !!(J.N && J.N.repro.rel <= 1e-12);
  G.vOrigin = !!(J.V && J.V.originRelMax <= (J.quick ? 1e-3 : 1e-6) && J.V.crRelMax <= 1e-9 && J.V.scenesOk);
  G.hEngine = !!(J.H && J.H.gateEngine.length > 0 && J.H.gateEngine.every((g) => g.same));
  G.hSingle = !!(J.H && J.H.rows.every((r) => r.sets.sun.diff === 0 && r.sets.galaxyOne.diff === 0));
  G.hBodies = !!(J.H && J.H.bodies.every((b) => b.duRel < 1e-6));
  return G;
}

/* ───────── 実行(部を子プロセスで)───────── */
const PARTS = Object.freeze(['T', 'G0std', 'V', 'G0db', 'P', 'G0rest', 'H', 'N']);   // 長い部を先に(子プロセス 2 本で分ける)
let HP_ONCE = null;   // loadHtmlMain は 1 プロセスに 1 回だけ(1 プロセスで順に走らせるときは部の間で共有)
export function runPart(name, plan, html) {
  const needHtml = name.startsWith('G0') || name === 'H', HP = needHtml ? (HP_ONCE || (HP_ONCE = loadHtmlMain(html).HP)) : null, t0 = Date.now();
  let r;
  if (name === 'G0std') r = partG0std(HP, plan); else if (name === 'G0db') r = partG0db(HP, plan); else if (name === 'G0rest') r = partG0rest(HP, plan);
  else if (name === 'T') r = partT(plan); else if (name === 'V') r = partV(plan); else if (name === 'P') r = partP(plan); else if (name === 'N') r = partN(plan); else if (name === 'H') r = partH(HP, plan);
  else throw new Error('未知の部: ' + name);
  return { name, r, wallSec: (Date.now() - t0) / 1000 };
}
function spawnPart(name, quick, html) {
  return new Promise((resolve, reject) => {
    const env = Object.assign({}, process.env, { W321C_PART: name, W321C_QUICK: quick ? '1' : '0', W321C_TARGET: html });
    const ch = spawn(process.execPath, [fileURLToPath(import.meta.url)], { env, stdio: ['ignore', 'pipe', 'inherit'] });
    let buf = ''; ch.stdout.on('data', (d) => { buf += d; });
    ch.on('close', (code) => { if (code !== 0) return reject(new Error('部 ' + name + ' が失敗(' + code + ')')); const m = buf.lastIndexOf('\n@@W321C@@'); try { resolve(JSON.parse(buf.slice(m + 10))); } catch (e) { reject(new Error('部 ' + name + ' の出力が読めない')); } });
  });
}
export async function runGalField(o) {
  const plan = o.plan, workers = o.workers, res = {}, queue = PARTS.slice();
  if (workers <= 1) for (const p of queue) res[p] = runPart(p, plan, o.html);
  else await Promise.all(Array.from({ length: Math.min(workers, queue.length) }, async () => { while (queue.length) { const p = queue.shift(); res[p] = await spawnPart(p, o.quick, o.html); } }));
  const J = { stage: 'galfield', quick: !!o.quick, plan: clone(plan), fieldVersion: F.FIELD_VERSION, model: F.MODEL_ID, decl: clone(F.DECL), mwDecl: clone(L9.MW), flow: clone(L9.FLOW), baseRecord: clone(BASE_RECORD), timing: {} };
  J.G0 = { std: res.G0std.r, db: res.G0db.r, rest: res.G0rest.r }; J.T = res.T.r; J.P = res.P.r; J.N = res.N.r; J.H = res.H.r; J.V = res.V.r;
  for (const p of PARTS) J.timing[p] = { wallSec: res[p].wallSec };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}
export async function main() {
  const TARGET = process.env.W321C_TARGET || 'beta/index.html', quick = process.env.W321C_QUICK === '1';
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  if (process.env.W321C_PART) { const r = runPart(process.env.W321C_PART, quick ? QUICK : PLAN, html); process.stdout.write('\n@@W321C@@' + JSON.stringify(r)); return; }
  const OUT = process.env.W321C_OUT ? (path.isAbsolute(process.env.W321C_OUT) ? process.env.W321C_OUT : path.join(ROOT, process.env.W321C_OUT)) : path.join(ROOT, OUT_GALFIELD);
  if (quick && !process.env.W321C_OUT) throw new Error('試走(W321C_QUICK=1)は W321C_OUT を指定する(正本を書かない)');
  const workers = Math.max(1, Math.min(2, Number(process.env.W321C_WORKERS || 2) || 2));
  const t0 = Date.now(), targetSha256 = crypto.createHash('sha256').update(fs.readFileSync(html)).digest('hex');
  const W281A_SCOPE = REGEN_SCOPE ? w281aScopeStamp(html, REGEN_SCOPE) : {};
  console.log('第321便c galfield: ' + (quick ? '試走' : '正本') + '・子プロセス ' + workers);
  const R = await runGalField({ quick, plan: quick ? QUICK : PLAN, workers, html });
  const out = { version: HARNESS_VERSION, libVersion: F.LIB_VERSION, generator: 'tests/exp-w321c-galfield.mjs', target: TARGET, targetSha256, reuseFrom: null,
    ruling: '原仮定者の予定(第123報)「geoPN=4の予定: 処理を一新する。銀河の軸引きずりの知見から、銀河の回転引きずりを推定して、銀河のサンプルを作成する」・原仮定者の回答(2026-10-31 —— AN489)・'
      + '決断事項 AN486・AN487・AN488・AN496・AN497・AN498・統括の検証項目 R268。エンジン・在位の本・受け手の R_d = Y_k m・規則は変えない(器・lib・正本・文書だけ)。半渦度を受け手の軸へ直結する項はエンジンに足さない',
    workers, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w321c-galfield.mjs', 'tests/lib-w321c-galfield.mjs', 'tests/lib-w320c-nbcompose.mjs', 'tests/lib-w319b-srcradius.mjs', 'tests/lib-w320a-srcheat.mjs', 'tests/exp-w320a-srcheat.mjs',
    'tests/lib-w319a-axisheat.mjs', 'tests/lib-w318d-dragest.mjs', 'tests/lib-w317c-satcut.mjs', 'tests/lib-w311d-planet3.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第321便c', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, stage: 'galfield',
    engine: 'Node(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・子プロセス ' + workers + ' 本で部を分ける)',
    literature: ['天の川銀河の質量の模型の入力(第319便b の MW —— 文献の模型の入力の転記・本便は一次資料に当たっていない)', '慣性モーメントの係数 f(第320便a の MOI16 —— 文献の値・本便は一次資料に当たっていない)'],
    notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();
