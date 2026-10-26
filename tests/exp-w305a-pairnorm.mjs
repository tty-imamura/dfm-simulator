// 第305便a(原仮定者の裁定(第96報)「慣性速度は自分自身の引きずりなので、引きずり計算の分母の慣性決定力の和に自分自身を入れられる」
// 「慣性速度を座標にそのまま反映する場合は、二重計上にならない様に、引きずり計算の分子の引きずりの和には自分自身を入れない」・決断事項 AN326・
// 統括の検証項目 R199)—— **対ごとの正規化**(エンジンの新しい宣言 physics.relativeDrag.inertialR2.denom:"pair" —— 省略時 "row" = 今の式)の器
// (Node だけ —— 対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、アプリの步〔三次元の semic・dfmInertialDragStep3 /
// 二次元の dfmInertialDragStep〕と引きずりの関数〔build → inertialDragI2Apply → inertialDragShellApply → inertialDragNormApply → inertialDragPairApply → solve〕を
// そのまま走らせる・1 プロセス)。
//
// ■ 式(エンジンの注記と docs/PHYSICS.md〔第305便a〕)
//   行: (I_i + Σ_j D_ij) u_i − Σ_j D_ij u_j = Σ_j D_ij (v_j − v_i)、I_i = W_bg + S_i + E_i + Σ_k I_ik
//   対: β_ij = D_ij/(Ŵ_i + I_ij)(Ŵ_i = W_bg + S_i + E_i —— 自己 S_i は各対の分母に同じ形で入る・分子に j = i を作らない)・
//       (1 + Σ_j β_ij) u_i − Σ_j β_ij u_j = Σ_j β_ij (v_j − v_i)(全体の solve を保つ —— 総速度 W なら (1+Σβ)W_i − Σβ W_j = v_i)
//
// ■ 段(正本 tests/out/pairnorm-w305a.json —— 段 pairnorm-305a)。W305A_PARTS=Z,K,M で段を選ぶ(正本は全段)・W305A_OUT で出力先
//   Z 零試験: 二体で行と対がビット同一(🐌・🌛 の写し〔二次元〕・🌡️ の写し〔三次元・λ ∝ m〕)・孤立粒子 u = 0・共通の並進で u = 0・
//     粒子分割(源を同位置の N 片 —— 凍結した点源の Σβ・自由な源の反応・有限半径〔殻と自己 S3〕)・1 步の u と器の中の直接法(三体・自己あり —— 三次元と二次元)・
//     n = 80 の Gauss–Seidel と器の直接法・PCG の拒否・読み口の Σβ と器の式
//   K 多体の読み口(1 步): 🌦️(地球–月)・火星–フォボス・ダイモス・木星–ガリレオ衛星の写し(太陽 + 惑星 + 衛星 —— 衛星は衛星の本の配置を惑星の位置へ移す)で
//     惑星の太陽からの β の衛星なしとの比(行/対 —— λ ∝ m と普遍の λ)
//   M 三体の測定(🌦️ の写し —— 第304便c の新しい基線〔引きずり OFF・softeningFloor 0.0005〕の上で引きずりを ON・pairs 全対・W_bg = W_ext):
//     λ ∝ m(k は水星の値 —— n = 2/1/0 → 5.001361/4.001357/3.001360)× G_loc n ∈ {2 kappaC2, +1 cRatio, 0 なし} × {行, 対}・自己なし
//     (+ 対照: 太陽に η☉ 0.1 の殻と S3・普遍の λ の行/対)—— 長窓 [0,1062] の M4 の近地点の周期・恒星月・交点・離心率(h と h/2)・地球の太陽からの β の月なしとの比
//
// ■ しないこと・言わないこと
//   ・在位の本の宣言・S._core を変えない(176 本ビット不変 —— 宣言を持つ写しだけが新しい経路を通る)。🌦️ の宣言は変えない(器の写しだけ)。
//   ・「W_bg が不要になった」「λ ∝ m + 対が唯一」とは書かない(比較したモデルの中だけの記録)。届かないものは「この探索範囲では未達 —— 次の見直し」。
//
// 実行(Node だけ・1 プロセス): node tests/exp-w305a-pairnorm.mjs → 正本 tests/out/pairnorm-w305a.json(W305A_PARTS・W305A_OUT)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as EM from './exp-w303c-earthmoon.mjs';
import { wExtOf } from './exp-w303b-inertialr2.mjs';
import * as L from './lib-w297b-fit.mjs';
import { pinDecl315c, LEGACY7_DATA_FILE } from './lib-w315c-legacy7.mjs';   // 第315便c(決断事項 AN406・R244): 在位の 7 本を K1 へ移した世代では、この器は移行の前(af2f426)の宣言の写しで測る
const REGEN_SCOPE = {"presets":"all","roots":["$","DT","FIT_COND_KEYS","FIT_COND_VERSION","FIT_KNOB_KEYS","FIT_NUMERICS_KEYS","FIT_RECORD_KEYS","FIT_RECORD_VERSION","FIT_RECORD_VERSIONS","FIT_RESIDUAL_KEYS","FIT_TARGET_KEYS","FIT_TOL_KEYS","HP.DRAG_CORE_RMAX_FACTOR","HP.DRAG_CORE_VERSION","HP.FIT_COND_VERSION","HP.GLOC_VERSION","HP.REL_DRAG_COMPOSE_DEFAULT","HP.REL_DRAG_I2_VERSION","HP.REL_DRAG_INERTIAL_VERSION","HP.REL_DRAG_PAIRNORM_VERSION","HP.REL_DRAG_SOLVE_FROM_DEFAULT","HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.dragCoreState","HP.fitCondSig","HP.gLocPeriAdvance","HP.gLocState","HP.geoEffectiveMode","HP.geoLawOfSim","HP.inertialDragLedgerOf","HP.inertialDragState","HP.inertialR2Q","HP.inertialR2State","HP.sim","HP.synodic","HP.validateFitRecord","HP.validatePreset","HP.wbgEstimateOf","LAWS","T","ab","ch","ctx","cw","dfmGaussLegendre01","dfmInertialDrag3Build","dfmInertialDrag3Solve","dfmInertialDragStep","dfmInertialDragStep3","dragCoreAngular","dragCoreAvgK","dragCoreLookup","dragCoreTableBuild","fmt","inertialDragComposeBuild","inertialDragComposeSolve","inertialDragI2Apply","inertialDragNormApply","inertialDragPairApply","inertialDragPairState","inertialDragShellApply","pnSource","relDragCoefficientOf","relDragPairNormOf","synUniform","validateFitRecord"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w305a-pairnorm-1';
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const PARTS_ALL = Object.freeze(['Z', 'K', 'M']);
const clone = (x) => JSON.parse(JSON.stringify(x));
export const DECL_FILE = 'tests/data-w305a-decl304.json';
export const PIN = JSON.parse(fs.readFileSync(new URL('./data-w305a-decl304.json', import.meta.url), 'utf8'));
export const EM_ID = 'earthMoonSunInertial3d', MERCURY = 'mercurySunInertial3d';
/** λ ∝ m の k(水星・自己なし・二体の値 —— 共通の照合の値: n = 0/1/2 → 3.001360/4.001357/5.001361)と G_loc の宣言 */
export const K_OF_N = Object.freeze([
  Object.freeze({ n: 2, law: 'kappaC2', k: 5.001361 }), Object.freeze({ n: 1, law: 'cRatio', k: 4.001357 }), Object.freeze({ n: 0, law: null, k: 3.001360 })]);
/** 普遍の λ(対照 —— 第304便b の M2 η∞ の根 8863.751 m = 3.0014 r_s☉) */
export const LAMBDA_UNIV_M = 8863.751;
export const ETA_SUN_CTRL = 0.1;
export const DT = 0.016, DT2 = 0.008;
export const LONG = 1062, WINS = Object.freeze([118, 354, 708, 1062]);
/** 照合許容(第304便c の宣言と同じ —— 近点・交点 0.005 年・恒星月 0.00005 日・平均離心率 0.00005) */
export const TOL = Object.freeze({ aps: 0.005, sid: 0.00005, node: 0.005, e: 0.00005 });
export const OBS_B1 = EM.OBS_B1;

/* ── 写し(基点 bdb7ae5 の宣言に固定)── */
export const findPreset = (HP, id) => HP.allPresets().find((q) => q.id === id);
export const lenM = (p) => Math.pow(10, p.scaleExp.L);
export function liveSame(HP) {
  return Object.fromEntries(Object.keys(PIN.decl).map((id) => { const p = findPreset(HP, id), d = PIN.decl[id];
    return [id, !!p && JSON.stringify(p.physics) === JSON.stringify(d.physics) && JSON.stringify(p.bodies) === JSON.stringify(d.bodies)
      && JSON.stringify(p.scaleExp || null) === JSON.stringify(d.scaleExp) && JSON.stringify(p.timeRef || null) === JSON.stringify(d.timeRef)]; }));
}
export function pinned(HP, id) {
  const p = findPreset(HP, id), d = PIN.decl[id];
  if (!p || !d) throw new Error('本か凍結の写しが無い: ' + id);
  const q = clone(p); q.physics = clone(d.physics); q.bodies = clone(d.bodies);
  for (const k of ['scaleExp', 'timeRef', 'orbitObs']) { if (d[k]) q[k] = clone(d[k]); else delete q[k]; }
  delete q.fitRecord; delete q.physics.gLoc;
  return q;
}
/** 写しの引きずりの宣言(i2: {lambdaRs} | {lambda} —— denom を足す)。o.gLoc で G_loc の law・o.shellSelf で自己の殻 */
export function withDrag(q0, o) {
  const q = clone(q0), rd0 = q.physics.relativeDrag || {};
  const rd = { law: 'inertial', Wbg: o.Wbg, eps: (o.eps !== undefined) ? o.eps : rd0.eps, history: 'positions', pairs: (o.pairs !== undefined) ? clone(o.pairs) : 'all' };
  if (o.i2) { rd.inertialR2 = clone(o.i2); if (o.denom) rd.inertialR2.denom = o.denom; }
  if (o.shellSelf) rd.shellSelf = o.shellSelf;
  if (o.solveIters) rd.solveIters = o.solveIters;
  if (o.solver) rd.solver = o.solver;
  q.physics.relativeDrag = rd;
  if (o.gLoc) q.physics.gLoc = { law: o.gLoc }; else delete q.physics.gLoc;
  return q;
}
export function simOf(HP, q) {
  const v = HP.validatePreset(clone(q));
  if (!v.ok) throw new Error('validatePreset: ' + (v.errors || []).join(' ').slice(0, 300));
  const d3 = v.preset.physics && v.preset.physics.coord === '3d';
  const S = d3 ? HP.coord3d.makeSim() : HP.sim;
  S.build(clone(v.preset));
  return S;
}

/* ── 器の中の独立の式(エンジンの関数を使わない)── */
export function K3shell(r, R, eps) {
  const e2 = eps * eps;
  if (!(R > 0)) return r / ((r * r + e2) ** 2);
  if (r === 0) return R / ((R * R + e2) ** 2);
  if (eps === 0) return 1 / (Math.max(r, R) * Math.abs(r * r - R * R));
  const F = (t) => -t / (t * t + e2) + Math.atan(t / eps) / eps;
  return (F(r + R) - F(Math.abs(r - R))) / (4 * r * R);
}
export function K2shell(r, R, eps) {
  const e2 = eps * eps;
  if (!(R > 0)) return 1 / (r * r + e2);
  if (r === 0) return 1 / (R * R + e2);
  return Math.log1p(4 * r * R / ((r - R) ** 2 + e2)) / (4 * r * R);
}
/** 宣言から器の中で β の表を作る(行と対)。S は build 済みの sim(位置・速度・質量・pinned・殻の半径 —— 宣言から読む)。戻り値 {beta:{row,pair}[i][j], den...} */
export function betaTables(S) {
  const rd = S.relDrag, i2 = rd.inertialR2, n = S.n, eps = (rd.eps !== undefined) ? rd.eps : (S.params.softening || 0), e2 = eps * eps;
  const G = S.params.G, c0 = S.params.cLight, W = rd.Wbg, d3 = S.coord3d === true;
  const pos = (i) => [S.x[i], S.y[i], d3 ? S.z[i] : 0];
  const pairsAll = !Array.isArray(rd.pairs), pset = new Set();
  if (!pairsAll) for (const [a, b] of rd.pairs) { pset.add(a + ':' + b); pset.add(b + ':' + a); }
  const paired = (i, j) => pairsAll || pset.has(i + ':' + j);
  const Rd = (i) => (S.dragShellD && S.dragShellD[i]) ? S.dragShellD[i].eta * S.dragShellD[i].R : 0;
  const q = (j) => (i2.lambdaRs !== undefined) ? c0 * c0 / (2 * i2.lambdaRs * G) : S.m[j] / i2.lambda;
  const isSrc = (i, j) => j !== i && S.m[j] > 0 && (i2.sources === 'pairs' ? paired(i, j) : true);
  const D = [], I = [], Sx = [], rowDen = [];
  for (let i = 0; i < n; i++) {
    D.push(new Float64Array(n)); I.push(new Float64Array(n));
    let self = 0;
    if (rd.shellSelf === 'drag' && Rd(i) > 0) self += S.m[i] / Rd(i) ** 3;
    if (i2.self === 'shell' && Rd(i) > 0) self += q(i) / Rd(i) ** 2;
    if (i2.self === 'radius' && S.radOv[i] > 0) self += q(i) / S.radOv[i] ** 2;
    if (i2.env === 'bodies') for (const b of rd.env.bodies) self += ((i2.lambdaRs !== undefined) ? c0 * c0 / (2 * i2.lambdaRs * G) : b.m / i2.lambda) / (b.d * b.d + e2);
    Sx.push(self);
    let sumI = 0;
    for (let j = 0; j < n; j++) {
      if (j === i) continue;
      const pi = pos(i), pj = pos(j), r = Math.hypot(pj[0] - pi[0], pj[1] - pi[1], pj[2] - pi[2]);
      if (isSrc(i, j)) { I[i][j] = q(j) * K2shell(r, Rd(j), eps); sumI += I[i][j]; }
      if (paired(i, j) && S.m[j] > 0) D[i][j] = S.m[j] * K3shell(r, Rd(j), eps);
    }
    rowDen.push(W + self + sumI);
  }
  const beta = { row: [], pair: [] };
  for (let i = 0; i < n; i++) {
    const br = new Float64Array(n), bp = new Float64Array(n);
    for (let j = 0; j < n; j++) if (D[i][j] > 0) { br[j] = D[i][j] / rowDen[i]; bp[j] = D[i][j] / (W + Sx[i] + I[i][j]); }
    beta.row.push(br); beta.pair.push(bp);
  }
  return { beta, D, I, self: Sx, rowDen, W };
}
/** 器の中の直接法(部分ピボットのガウス消去・3 右辺): (1+Σβ)u_i − Σβ u_j = Σβ (v_j − v_i)・pinned と質量が正でない行は u=0 */
export function directSolve(S, beta) {
  const n = S.n, d3 = S.coord3d === true, V = [S.vx, S.vy, d3 ? S.vz : new Float64Array(n)];
  const fixed = (i) => !!S.pinned[i] || !(S.m[i] > 0);
  const M = Array.from({ length: n }, () => new Float64Array(n)), B = Array.from({ length: n }, () => new Float64Array(3));
  for (let i = 0; i < n; i++) {
    if (fixed(i)) { M[i][i] = 1; continue; }
    let sb = 0;
    for (let j = 0; j < n; j++) if (j !== i && beta[i][j] > 0) { sb += beta[i][j]; M[i][j] = -beta[i][j]; for (let c = 0; c < 3; c++) B[i][c] += beta[i][j] * (V[c][j] - V[c][i]); }
    M[i][i] = 1 + sb;
  }
  for (let k = 0; k < n; k++) {
    let p = k; for (let i = k + 1; i < n; i++) if (Math.abs(M[i][k]) > Math.abs(M[p][k])) p = i;
    [M[k], M[p]] = [M[p], M[k]]; [B[k], B[p]] = [B[p], B[k]];
    for (let i = k + 1; i < n; i++) { const f = M[i][k] / M[k][k]; if (f === 0) continue; for (let j = k; j < n; j++) M[i][j] -= f * M[k][j]; for (let c = 0; c < 3; c++) B[i][c] -= f * B[k][c]; }
  }
  const u = Array.from({ length: n }, () => [0, 0, 0]);
  for (let i = n - 1; i >= 0; i--) for (let c = 0; c < 3; c++) { let s = B[i][c]; for (let j = i + 1; j < n; j++) s -= M[i][j] * u[j][c]; u[i][c] = s / M[i][i]; }
  return u;
}
/** エンジンの引きずりの関数を今の位置・速度で 1 回だけ通す(build〔hist〕→ I2 → 殻 → 正規化 → 対 → solve)。状態の作業配列だけが変わる */
export function engineSolveOnce(HP, S) {
  const G0 = HP;
  const n = S.n, rd = S.relDrag, d3 = S.coord3d === true, C = G0.relDragCoefficientOf(rd), eps = (rd.eps !== undefined) ? rd.eps : (S.params.softening || 0), e2 = eps * eps;
  const N = S.rdPrevX.length;
  if (d3 && (!S._rdUZ || S._rdUZ.length < N)) { S.rdPrevZ = new Float64Array(N); S._rdVZ = new Float64Array(N); S._rdUZ = new Float64Array(N); S._rdNZ = new Float64Array(N); }
  const q = d3 ? G0.dfmInertialDrag3Build(S, n, true, C, e2, S._dragCoreT || null) : G0.inertialDragComposeBuild(S, n, S._dragCoreT || null, true, C, e2);
  if (q.coincident || q.tooLarge) throw new Error('build が拒否 ' + JSON.stringify(q));
  if (rd.inertialR2) G0.inertialDragI2Apply(S, n, C, eps, null, null, null);
  if (S._dragShellRd) G0.inertialDragShellApply(S, n, C, eps, null, null, null);
  G0.inertialDragNormApply(S, n, true, false);
  const pq = G0.relDragPairNormOf(rd) ? G0.inertialDragPairApply(S, n, C, eps, null, null, null, true) : null;
  const r = d3 ? G0.dfmInertialDrag3Solve(S, n) : G0.inertialDragComposeSolve(S, n);
  const u = []; for (let i = 0; i < n; i++) u.push([S._rdUX[i], S._rdUY[i], d3 ? S._rdUZ[i] : 0]);
  return { u, solve: r, pair: pq };
}
const relErr = (a, b) => { let num = 0, den = 0; for (let i = 0; i < a.length; i++) for (let c = 0; c < 3; c++) { num = Math.max(num, Math.abs(a[i][c] - b[i][c])); den = Math.max(den, Math.abs(b[i][c])); } return den > 0 ? num / den : num; };
/** 総速度 W = v + u の式の残差 max|(1+Σβ)W_i − Σβ W_j − v_i| / max|v| */
function totalVelocityResidual(S, beta, u) {
  const n = S.n, d3 = S.coord3d === true, V = [S.vx, S.vy, d3 ? S.vz : new Float64Array(n)];
  let res = 0, vm = 0;
  for (let i = 0; i < n; i++) {
    for (let c = 0; c < 3; c++) vm = Math.max(vm, Math.abs(V[c][i]));
    if (S.pinned[i] || !(S.m[i] > 0)) continue;
    for (let c = 0; c < 3; c++) {
      let sb = 0, sw = 0; for (let j = 0; j < n; j++) if (beta[i][j] > 0) { sb += beta[i][j]; sw += beta[i][j] * (V[c][j] + u[j][c]); }
      res = Math.max(res, Math.abs((1 + sb) * (V[c][i] + u[i][c]) - sw - V[c][i]));
    }
  }
  return vm > 0 ? res / vm : res;
}
/** 状態の指紋(位置・速度・引きずりの作業配列と帳簿 —— ビット同一の比較) */
function stateArrays(S) {
  const ks = ['x', 'y', 'z', 'vx', 'vy', 'vz', '_rdUX', '_rdUY', '_rdUZ', '_rdDeg'];
  const o = {}; for (const k of ks) if (S[k]) o[k] = Array.from(S[k].slice(0, S.n));
  for (const k of ['inertialDragWork', 'inertialDragDL', 'inertialDragBoundMax', 'inertialDragDegMax', 'inertialDragI2XiMax']) o[k] = S[k];
  return o;
}
const bitEq = (a, b) => { for (const k of Object.keys(a)) { const x = a[k], y = b[k]; if (Array.isArray(x)) { if (!Array.isArray(y) || x.length !== y.length || x.some((v, i) => !Object.is(v, y[i]))) return k; } else if (!Object.is(x, y)) return k; } return null; };

/* ── 段 Z ── */
export const body = (o) => Object.assign({ type: 'single', spin: 0, pinned: false }, o);
const synthetic3 = (HP, o = {}) => {   // 合成の三体(三次元・G=1・c₀=10 —— β が 1e-2 の桁で行と対の差が見える)
  const base = pinned(HP, MERCURY);
  const q = clone(base);
  q.physics.G = 1; q.physics.cLight = 10; q.physics.softening = 0.05; q.physics.softeningFloor = 0.05;
  q.bodies = [
    { m: 1, x: 0, y: 0, z: 0, vx: 0.01, vy: -0.02, vz: 0.005, radius: 0.2 },
    { m: 0.3, x: 2.2, y: 0.4, z: -0.3, vx: -0.1, vy: 0.6, vz: 0.05, radius: 0.12 },
    { m: 0.1, x: -1.1, y: 1.7, z: 0.6, vx: -0.5, vy: -0.35, vz: 0.1, radius: 0.08 }].map(body);
  if (o.shell) for (const b of q.bodies) b.dragCore = { shellRatio: o.shell };
  return q;
};
export function zTwoBody(HP, steps = 2000) {
  const rows = [];
  const cases = [
    { key: 'snail2d', id: 'inertialDragPair', i2: { lambda: 0.02 }, note: '🐌 の写し(二次元・普遍の λ 0.02 —— I ≈ W_bg の桁)' },
    { key: 'earthMoon2d', id: 'earthMoonInertial', i2: { lambdaRs: 3.00136 }, note: '🌛 の写し(二次元・λ ∝ m k 3.00136)' },
    { key: 'mercury3d', id: MERCURY, i2: { lambdaRs: 3.00136 }, wExt: true, note: '🌡️ の写し(三次元・λ ∝ m k 3.00136・W_bg = W_ext)' }];
  for (const c of cases) {
    const base = pinned(HP, c.id), W = c.wExt ? wExtOf(HP, base).book : base.physics.relativeDrag.Wbg;
    const dt = base.physics.stepDt || (base.timeRef && base.timeRef.pRef ? base.timeRef.pRef / 2000 : 0.05);
    const mk = (den) => withDrag(base, { Wbg: W, i2: c.i2, denom: den });
    const A = simOf(HP, mk(null)); for (let k = 0; k < steps; k++) A.step(dt); const fa = stateArrays(A), uMaxA = A.inertialDragUMax;
    const B = simOf(HP, mk('pair')); for (let k = 0; k < steps; k++) B.step(dt); const fb = stateArrays(B);
    const st = HP.inertialDragState(B).pairNorm;
    rows.push({ key: c.key, note: c.note, steps, dt, Wbg: W, diffKey: bitEq(fa, fb), bitSame: bitEq(fa, fb) === null, uMax: uMaxA, rMaxAll: st.rMaxAll, pairSteps: st.steps,
      sumBetaPair: st.receivers.map((r) => r.sumBetaPair), sumBetaRow: st.receivers.map((r) => r.sumBetaRow) });
  }
  return { rows, note: '外部の源が 1 つ —— X_ij と X_i が同じ演算列なので R = 1(結合・s・対角を書き換えない)。全状態の配列と帳簿をビットで比べた' };
}
export function zIsolated(HP) {
  const base = synthetic3(HP, { shell: 0.5 });
  const one = clone(base); one.bodies = [one.bodies[1]]; delete one.timeRef; delete one.orbitObs;
  const out = [];
  for (const [key, o] of [['plain', { Wbg: 1, i2: { lambdaRs: 1 }, denom: 'pair' }], ['selfS3', { Wbg: 1, i2: { lambdaRs: 1 }, denom: 'pair', shellSelf: 'drag' }]]) {
    const S = simOf(HP, withDrag(one, o)); const r = engineSolveOnce(HP, S);
    const st = HP.inertialDragState(S);
    out.push({ key, uMax: Math.max(...r.u[0].map(Math.abs)), W: st.shell ? st.shell.receivers[0].W : null, v: [S.vx[0], S.vy[0], S.vz[0]] });
  }
  const tr = clone(base); for (const b of tr.bodies) { b.vx = 0.3; b.vy = -0.2; b.vz = 0.1; }
  const S = simOf(HP, withDrag(tr, { Wbg: 1, i2: { lambdaRs: 1 }, denom: 'pair', shellSelf: 'drag' })); const r = engineSolveOnce(HP, S);
  const uT = Math.max(...r.u.flat().map(Math.abs));
  return { isolated: out, translation: { uMax: uT, n: 3 }, ok: out.every((z) => z.uMax === 0) && uT === 0 };
}
/** 粒子分割: 受け手 0(自由)と源を同位置の N 片(質量 M/N)へ。W_bg 0.5・D = M/r³ = 1(r 2・ε 0・M 8)・λ ∝ m は q = 4(I = 1 —— 片ごと)・普遍の λ 2(I = 1 —— 全体) */
export function zSplit(HP) {
  const base = synthetic3(HP);
  const mk = (N, law, den, o = {}) => {
    const q = clone(base);
    q.physics.G = 1; q.physics.cLight = Math.sqrt(8);   // λ ∝ m(k 1): q = c₀²/(2kG) = 4 → I = q/r² = 1(r 2)
    q.physics.softening = 0.05; q.physics.softeningFloor = 0.05;
    const bodies = [body({ m: 1, x: 0, y: 0, z: 0, vx: 0, vy: 1, vz: 0, radius: 0.1 })];
    for (let k = 0; k < N; k++) bodies.push(body({ m: 8 / N, x: 2, y: 0, z: 0, vx: 0, vy: 0, vz: 0, radius: 0.3, ...(o.frozen ? { pinned: true } : {}), ...(o.shell ? { dragCore: { shellRatio: o.shell } } : {}) }));
    q.bodies = bodies;
    const pairs = []; for (let k = 1; k <= N; k++) pairs.push([0, k]);
    return withDrag(q, { Wbg: 0.5, eps: o.shell ? 1e-3 : 0, i2: Object.assign(law === 'propM' ? { lambdaRs: 1 } : { lambda: 2 }, { sources: 'pairs' }), denom: den, pairs, shellSelf: o.shell ? 'drag' : undefined });
  };
  const rows = [];
  for (const law of ['propM', 'univ']) for (const den of ['row', 'pair']) for (const kind of ['frozen', 'free', 'shell']) for (const N of [1, 2, 4, 8]) {
    const o = kind === 'frozen' ? { frozen: true } : kind === 'shell' ? { shell: 0.5 } : {};
    const S = simOf(HP, mk(N, law, den, o)), T = betaTables(S), b = den === 'pair' ? T.beta.pair : T.beta.row;
    const r = engineSolveOnce(HP, S), sumB = Array.from(b[0]).reduce((s, x) => s + x, 0);
    const uD = directSolve(S, b);
    rows.push({ law, denom: den, kind, N, sumBeta0: sumB, u0: r.u[0][1], uPiece: N ? r.u[1][1] : null, selfPiece: T.self[1] || 0, relErrDirect: relErr(r.u, uD) });
  }
  const get = (law, den, kind, N) => rows.find((z) => z.law === law && z.denom === den && z.kind === kind && z.N === N);
  const ana = { rowN: (N) => 1 / (0.5 + N), pair: 2 / 3, univRow: 2 / 3, univPairN: (N) => 1 / (0.5 + 1 / N) };
  const ex = { propRow1: get('propM', 'row', 'frozen', 1).sumBeta0, propRow4: get('propM', 'row', 'frozen', 4).sumBeta0, propPair1: get('propM', 'pair', 'frozen', 1).sumBeta0,
    propPair4: get('propM', 'pair', 'frozen', 4).sumBeta0, univRow4: get('univ', 'row', 'frozen', 4).sumBeta0, univPair4: get('univ', 'pair', 'frozen', 4).sumBeta0 };
  const inv = (law, den, kind, key) => { const v = [1, 2, 4, 8].map((N) => get(law, den, kind, N)[key]); return Math.max(...v.map((x) => Math.abs(x / v[0] - 1))); };
  const invariance = {};
  for (const law of ['propM', 'univ']) for (const den of ['row', 'pair']) for (const kind of ['frozen', 'free', 'shell']) invariance[`${law}:${den}:${kind}`] = { sumBeta: inv(law, den, kind, 'sumBeta0'), u0: inv(law, den, kind, 'u0') };
  const anaErr = Math.max(...[1, 2, 4, 8].map((N) => Math.abs(get('propM', 'row', 'frozen', N).sumBeta0 - ana.rowN(N))), ...[1, 2, 4, 8].map((N) => Math.abs(get('propM', 'pair', 'frozen', N).sumBeta0 - ana.pair)),
    ...[1, 2, 4, 8].map((N) => Math.abs(get('univ', 'row', 'frozen', N).sumBeta0 - ana.univRow)), ...[1, 2, 4, 8].map((N) => Math.abs(get('univ', 'pair', 'frozen', N).sumBeta0 - ana.univPairN(N))));
  return { rows, example: ex, invariance, anaErr, relErrDirectMax: Math.max(...rows.map((z) => z.relErrDirect)),
    setup: '受け手 0(質量 1・v = (0,1,0))と源(質量 8・r 2・v 0)を同位置の N 片へ —— W_bg 0.5・ε 0・D = Σ m_j/r³ = 1・λ ∝ m(k 1・c₀ √8・G 1 → q 4 → I 1 は片ごと)/普遍の λ 2(I = m/(λr²) —— 全体で 1)。片どうしは対を組まない(同位置・同速度 —— 対称で寄与 0)',
    note: 'frozen = 源を pinned(凍結した点源)・free = 源も受け手(受け手 0 からの引きずり)・shell = 源に殻(η 0.5・R 0.3 —— 殻の核は ε>0 が要るので ε 0.001)と自己 S3(片の自己 (M/N)/R_d³ は N で変わる)' };
}
export function zDirect(HP) {
  const out = [];
  const cases = [
    { key: '3d-S3-pair', q: synthetic3(HP, { shell: 0.6 }), o: { Wbg: 1, i2: { lambdaRs: 1 }, denom: 'pair', shellSelf: 'drag' } },
    { key: '3d-S3-row', q: synthetic3(HP, { shell: 0.6 }), o: { Wbg: 1, i2: { lambdaRs: 1 }, shellSelf: 'drag' } },
    { key: '3d-S2-pair', q: synthetic3(HP, { shell: 0.6 }), o: { Wbg: 1, i2: { lambdaRs: 1, self: 'shell' }, denom: 'pair' } },
    { key: '3d-univ-pair', q: synthetic3(HP), o: { Wbg: 1, i2: { lambda: 0.05 }, denom: 'pair' } },
    { key: '3d-pinned-pair', q: (() => { const q = synthetic3(HP); q.bodies[0].pinned = true; return q; })(), o: { Wbg: 1, i2: { lambdaRs: 1 }, denom: 'pair' } }];
  // 二次元(🐌 の写しに三体目 —— 自己 radius)
  { const q = pinned(HP, 'inertialDragPair'); q.physics.cLight = 10; q.bodies.push(body({ m: 0.5, x: 5, y: 9, vx: -0.3, vy: 0.1, radius: 0.3 }));
    cases.push({ key: '2d-radius-pair', q, o: { Wbg: 1.25, eps: 0.05, i2: { lambdaRs: 0.5, self: 'radius' }, denom: 'pair' } });
    cases.push({ key: '2d-radius-row', q, o: { Wbg: 1.25, eps: 0.05, i2: { lambdaRs: 0.5, self: 'radius' } } }); }
  for (const c of cases) {
    const S = simOf(HP, withDrag(c.q, c.o)), T = betaTables(S), den = c.o.denom === 'pair' ? 'pair' : 'row';
    const r = engineSolveOnce(HP, S), uD = directSolve(S, T.beta[den]);
    const st = den === 'pair' ? HP.inertialDragState(S).pairNorm : null;
    const sumErr = st ? Math.max(...st.receivers.map((z) => Math.abs(z.sumBetaPair / Array.from(T.beta.pair[z.i]).reduce((s, x) => s + x, 0) - 1)).filter(Number.isFinite)) : null;
    const sumRowErr = st ? Math.max(...st.receivers.map((z) => Math.abs(z.sumBetaRow / Array.from(T.beta.row[z.i]).reduce((s, x) => s + x, 0) - 1)).filter(Number.isFinite)) : null;
    const pairRow = Array.from({ length: S.n }, (_, i) => { const a = Array.from(T.beta.pair[i]).reduce((s, x) => s + x, 0), b = Array.from(T.beta.row[i]).reduce((s, x) => s + x, 0); return b > 0 ? a / b : null; });
    out.push({ key: c.key, n: S.n, coord: S.coord3d === true ? '3d' : '2d', method: r.solve.method, res: r.solve.res, relErrDirect: relErr(r.u, uD), totalVelocityResidual: totalVelocityResidual(S, T.beta[den], r.u),
      readoutSumErr: sumErr, readoutRowErr: sumRowErr, pairOverRow: pairRow, uMax: Math.max(...r.u.flat().map(Math.abs)) });
  }
  return { rows: out, relErrMax: Math.max(...out.map((z) => z.relErrDirect)), totalVelocityResidualMax: Math.max(...out.map((z) => z.totalVelocityResidual)) };
}
export function zGaussSeidel(HP, n = 80) {
  const base = synthetic3(HP);
  let s = 12345; const rnd = () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; };
  const bodies = []; for (let k = 0; k < n; k++) bodies.push(body({ m: 0.01 + 0.05 * rnd(), x: 10 * rnd() - 5, y: 10 * rnd() - 5, z: 10 * rnd() - 5, vx: rnd() - 0.5, vy: rnd() - 0.5, vz: rnd() - 0.5, radius: 0.01 }));
  const q = clone(base); q.bodies = bodies;
  const S = simOf(HP, withDrag(q, { Wbg: 1, eps: 0.3, i2: { lambdaRs: 1 }, denom: 'pair', solveIters: 600 }));
  const T = betaTables(S), r = engineSolveOnce(HP, S), uD = directSolve(S, T.beta.pair);
  const pcgQ = withDrag(q, { Wbg: 1, eps: 0.3, i2: { lambdaRs: 1 }, denom: 'pair', solver: 'network-pcg-v1' }), vp = HP.validatePreset(clone(pcgQ));
  const rowPcg = HP.validatePreset(clone(withDrag(q, { Wbg: 1, eps: 0.3, i2: { lambdaRs: 1 }, solver: 'network-pcg-v1' })));
  const badDen = HP.validatePreset(clone(withDrag(q, { Wbg: 1, eps: 0.3, i2: { lambdaRs: 1 }, denom: 'cell' })));
  return { n, method: r.solve.method, res: r.solve.res, relErrDirect: relErr(r.u, uD), pcgRejected: !vp.ok, pcgMsg: (vp.errors || []).join(' ').slice(0, 200), rowPcgAccepted: !!rowPcg.ok,
    badDenomRejected: !badDen.ok, badDenomMsg: (badDen.errors || []).join(' ').slice(0, 160) };
}
export function partZ(HP, log = console.log) {
  const t0 = Date.now();
  const two = zTwoBody(HP); log(`Z 二体: ${two.rows.map((r) => `${r.key} ビット同一 ${r.bitSame}(R ${r.rMaxAll}・u ${r.uMax.toExponential(2)})`).join(' / ')}`);
  const iso = zIsolated(HP); log(`Z 孤立・並進: u ${iso.isolated.map((z) => z.uMax).join('/')}・並進 ${iso.translation.uMax}`);
  const sp = zSplit(HP); log(`Z 粒子分割: λ∝m 行 ${sp.example.propRow1.toFixed(4)}→${sp.example.propRow4.toFixed(4)}・対 ${sp.example.propPair1.toFixed(4)}→${sp.example.propPair4.toFixed(4)}・普遍の λ 行 ${sp.example.univRow4.toFixed(4)}・対 ${sp.example.univPair4.toFixed(4)}(解析との差 ${sp.anaErr.toExponential(1)}・直接法 ${sp.relErrDirectMax.toExponential(1)})`);
  const dr = zDirect(HP); log(`Z 直接法: ${dr.rows.map((r) => `${r.key} ${r.relErrDirect.toExponential(1)}`).join(' / ')}・総速度の残差 ${dr.totalVelocityResidualMax.toExponential(1)}`);
  const gs = zGaussSeidel(HP); log(`Z n=${gs.n} ${gs.method}: 直接法との差 ${gs.relErrDirect.toExponential(1)}・PCG 拒否 ${gs.pcgRejected}`);
  return { twoBody: two, isolated: iso, split: sp, direct: dr, gs, wallSec: (Date.now() - t0) / 1000 };
}

/* ── 段 K(多体の読み口)── */
/** 衛星の本(二次元・惑星中心)の配置を、太陽 + 惑星の三次元の本(pinned 写し)の惑星の位置へ移す(SI を経て単位を換える) */
export function withMoons(HP, planetId, moonId, massKg = null) {
  const P = pinned(HP, planetId), Mn = pinned(HP, moonId);
  const fL = Math.pow(10, Mn.scaleExp.L - P.scaleExp.L), fV = Math.pow(10, (Mn.scaleExp.L - Mn.scaleExp.T) - (P.scaleExp.L - P.scaleExp.T)), fM = Math.pow(10, Mn.scaleExp.M - P.scaleExp.M);
  const pl = P.bodies[1], c0 = Mn.bodies[0];
  const moons = Mn.bodies.slice(1).map((b) => body({ m: b.m * fM, x: pl.x + (b.x - c0.x) * fL, y: pl.y + (b.y - c0.y) * fL, z: (pl.z || 0), vx: pl.vx + (b.vx - c0.vx) * fV, vy: pl.vy + (b.vy - c0.vy) * fV, vz: pl.vz || 0, radius: b.radius * fL }));
  const q = clone(P); q.bodies = P.bodies.concat(moons);
  if (massKg) massKg.forEach((kg, k) => { q.bodies[2 + k].m = kg / Math.pow(10, P.scaleExp.M); });
  q.physics.massFloor = 1e-9; q.physics.massPrecision = 'double';   // 衛星の質量を本の下限の最小(1e-9)まで —— 下限より軽い衛星は下限に上がる(読み口の mEff に記録)
  return q;
}
/** 火星の衛星の質量 [kg](NASA の Mars Fact Sheet の値 —— 🥔 の本の宣言は質量の下限の値)。本の単位では下限 1e-9(= 1e18 kg)に上がる */
export const MARS_MOONS_KG = Object.freeze([1.0659e16, 1.4762e15]);
/** 段 K の刻み(本の stepDt の 1e-4 —— 2 步で配置がほぼ動かない読み口。衛星の本の質量は本の宣言のまま〔λ ∝ m の I は質量によらない〕) */
export const K_DT_FRAC = 1e-4;
export function partK(HP, log = console.log) {
  const t0 = Date.now();
  const sys = [
    { key: 'earth', ja: '地球–月(🌦️ の写し)', make: () => pinned(HP, EM_ID), planet: 1, noMoon: (q) => { const z = clone(q); z.bodies = z.bodies.slice(0, 2); z.timeRef = Object.assign({}, z.timeRef, { pair: [0, 1] }); z.orbitObs = Object.assign({}, z.orbitObs || {}, { center: 0, orbiter: 1 }); return z; } },
    { key: 'mars', ja: '火星–フォボス・ダイモス', make: () => withMoons(HP, 'marsSunInertial3d', 'marsMoonsReal', MARS_MOONS_KG), planet: 1, noMoon: (q) => { const z = clone(q); z.bodies = z.bodies.slice(0, 2); return z; } },
    { key: 'jupiter', ja: '木星–ガリレオ衛星', make: () => withMoons(HP, 'jupiterSunInertial3d', 'jupiterGalilean'), planet: 1, noMoon: (q) => { const z = clone(q); z.bodies = z.bodies.slice(0, 2); return z; } }];
  const reads = [{ key: 'propM', label: 'λ ∝ m(k 3.001360)', i2: { lambdaRs: 3.001360 } }, { key: 'univ', label: `普遍の λ ${LAMBDA_UNIV_M} m`, i2: null }];
  const rows = [];
  for (const s of sys) {
    const q0 = s.make(), W = wExtOf(HP, q0).book;
    for (const rd of reads) {
      const i2 = rd.i2 || { lambda: LAMBDA_UNIV_M / lenM(q0) };
      const read = (q, den) => { const S = simOf(HP, withDrag(q, { Wbg: W, i2, denom: den })), h = K_DT_FRAC * (q.physics.stepDt || 0.016); S.step(h); S.step(h);   // 2 步(1 步目は履歴を作る —— u は 2 步目)
        const st = HP.inertialDragState(S), T = betaTables(S); return { S, st, T }; };
      const w = read(q0, 'pair'), nm = read(s.noMoon(q0), 'pair');
      const rw = w.st.pairNorm.receivers.find((z) => z.i === s.planet), rn = nm.st.pairNorm.receivers.find((z) => z.i === s.planet);
      const sunP = rw.sources.find((z) => z.j === 0), sunN = rn.sources.find((z) => z.j === 0);
      const wr = read(q0, null), wp = w;   // 1 步の u(行/対)と衛星なし
      const uOf = (x) => Math.hypot(x.S._rdUX[s.planet], x.S._rdUY[s.planet], x.S._rdUZ[s.planet]);
      rows.push({ sys: s.key, ja: s.ja, read: rd.key, label: rd.label, Wbg: W, moons: q0.bodies.length - 2, mMoonsEff: Array.from(w.S.m.slice(2, w.S.n)), mMoonsDecl: q0.bodies.slice(2).map((b) => b.m),
        betaSunRow: sunP.betaRow, betaSunPair: sunP.betaPair, betaSunNoMoon: sunN.betaPair, rowOverNoMoon: sunP.betaRow / sunN.betaPair, pairOverNoMoon: sunP.betaPair / sunN.betaPair,
        moonShareRow: (rw.inertiaRow - rw.Wbg - rw.self - rw.selfEnv - sunP.I) / rw.inertiaRow,
        uRow: uOf(wr), uPair: uOf(wp), uNoMoon: uOf(nm), uRowOverNoMoon: uOf(wr) / uOf(nm), uPairOverNoMoon: uOf(wp) / uOf(nm) });
    }
  }
  for (const r of rows) log(`K ${r.ja} ${r.label}: 太陽からの β の衛星なしとの比 行 ${r.rowOverNoMoon.toExponential(4)}・対 ${r.pairOverNoMoon.toPrecision(10)}・1 步の u の比 行 ${r.uRowOverNoMoon.toExponential(4)}・対 ${r.uPairOverNoMoon.toPrecision(8)}`);
  return { rows, wallSec: (Date.now() - t0) / 1000, quantity: '2 步(本の stepDt の 1e-4 —— 1 步目は履歴)の後の惑星の行 —— 太陽からの β(行 D/(W_bg + Σ_k I_k)・対 D/(W_bg + I_☉))の衛星なしの写しとの比と、1 步の u の比(衛星の配置は衛星の本を惑星の位置へ平行移動 —— 面は惑星の本の xy)' };
}

/* ── 段 M(三体の測定)── */
export function mConfigs() {
  const c = [{ key: 'off', label: '引きずり OFF(第304便c の基線)', drag: false, h2: true }];
  for (const z of K_OF_N) for (const den of ['row', 'pair']) c.push({ key: `n${z.n}-${den}`, label: `λ ∝ m k ${z.k}・G_loc n ${z.n}${z.law ? '(' + z.law + ')' : '(なし)'}・${den === 'pair' ? '対' : '行'}`, drag: true, k: z.k, n: z.n, gLoc: z.law, denom: den, h2: true });
  c.push({ key: 'n2-pair-sunEta', label: `対照: n 2・対 + 太陽の殻 η☉ ${ETA_SUN_CTRL} と S3`, drag: true, k: K_OF_N[0].k, n: 2, gLoc: 'kappaC2', denom: 'pair', etaSun: ETA_SUN_CTRL, h2: false });
  for (const den of ['row', 'pair']) c.push({ key: `univ-${den}`, label: `対照: 普遍の λ ${LAMBDA_UNIV_M} m・G_loc なし・${den === 'pair' ? '対' : '行'}`, drag: true, lambdaM: LAMBDA_UNIV_M, n: 0, gLoc: null, denom: den, h2: false });
  return c;
}
export function mPreset(HP, c, W) {
  const base = pinned(HP, EM_ID);
  if (!c.drag) return base;
  const q = clone(base);
  if (c.etaSun) q.bodies[0].dragCore = { shellRatio: c.etaSun };
  return withDrag(q, { Wbg: W, i2: c.lambdaM ? { lambda: c.lambdaM / lenM(base) } : { lambdaRs: c.k }, denom: c.denom === 'pair' ? 'pair' : null, gLoc: c.gLoc, shellSelf: c.etaSun ? 'drag' : undefined });
}
const sumW = (w) => w && w.complete ? { N: w.N, T1: w.T1, T4p: w.T4p, sid: w.sid, sidH: w.sidH, anom: w.anom, node: w.node, eMean: w.eMean, incMean: w.incMean, aMean: w.aMean, nPeri: w.nPeri } : { N: w ? w.N : null, complete: false };
export function mXi(HP, c, W) {
  if (!c.drag) return null;
  const read = (q) => { const S = simOf(HP, q); S.step(DT); S.step(DT); return HP.inertialDragState(S); };
  const pq = (q) => { const z = clone(q); z.physics.relativeDrag.inertialR2.denom = 'pair'; return z; };   // 読み口は対の宣言の写しで(行の本も β の行と対の両方を読む)
  const q = pq(mPreset(HP, c, W)), nm = clone(q); nm.bodies = nm.bodies.slice(0, 2); nm.timeRef = Object.assign({}, nm.timeRef, { pair: [0, 1] }); nm.orbitObs = Object.assign({}, nm.orbitObs || {}, { center: 0, orbiter: 1 });
  const a = read(q).pairNorm, b = read(nm).pairNorm;
  const e = a.receivers.find((z) => z.i === 1), m = a.receivers.find((z) => z.i === 2), en = b.receivers.find((z) => z.i === 1);
  const es = e.sources.find((z) => z.j === 0), ms = m.sources.find((z) => z.j === 0), em = m.sources.find((z) => z.j === 1), me = e.sources.find((z) => z.j === 2), ens = en.sources.find((z) => z.j === 0);
  return { earthSunRow: es.betaRow, earthSunPair: es.betaPair, earthSunNoMoon: ens.betaPair, rowOverNoMoon: es.betaRow / ens.betaPair, pairOverNoMoon: es.betaPair / ens.betaPair,
    moonSunRow: ms.betaRow, moonSunPair: ms.betaPair, moonEarthRow: em.betaRow, moonEarthPair: em.betaPair, earthMoonRow: me.betaRow, earthMoonPair: me.betaPair };
}
export function mRun(HP, c, W, dt, N, log) {
  const t0 = Date.now(), R = EM.runEngine(HP, mPreset(HP, c, W), { dt, revMax: N });
  if (!R.complete || R.nan) throw new Error(`走行が窓を満たさない(${c.key}: stop=${R.stop}・公転 ${R.ev.rev.length}/${N})`);
  const Wn = EM.windowsOf(R.ev, WINS.filter((x) => x <= N), 0);
  const out = { dt, steps: R.steps, fromZero: Wn.fromZero.map(sumW), drag: R.drag, wallSec: (Date.now() - t0) / 1000 };
  log(`M ${c.key} dt ${dt}: 長窓 M4 ${out.fromZero[out.fromZero.length - 1].T4p.toFixed(6)} 年・恒星月 ${out.fromZero[out.fromZero.length - 1].sidH.toFixed(7)} 日・${out.wallSec.toFixed(0)} s`);
  return out;
}
export function partM(HP, log = console.log, prev = null) {
  const t0 = Date.now(), W = wExtOf(HP, pinned(HP, EM_ID)).book, rows = [];
  const only = process.env.W305A_M_KEYS ? process.env.W305A_M_KEYS.split(',') : null;
  for (const c of mConfigs()) {
    if (only && !only.includes(c.key)) { const p = prev && prev.rows && prev.rows.find((z) => z.key === c.key); if (p) rows.push(p); continue; }
    const row = { key: c.key, label: c.label, k: c.k || null, n: c.n, gLoc: c.gLoc || null, denom: c.drag ? c.denom : null, etaSun: c.etaSun || null, lambdaM: c.lambdaM || null, drag: c.drag };
    row.xi = mXi(HP, c, W);
    row.h = mRun(HP, c, W, DT, LONG, log);
    if (c.h2) row.h2 = mRun(HP, c, W, DT2, LONG, log);
    rows.push(row);
  }
  const off = rows.find((z) => z.key === 'off'), L4 = (r, k = 'h') => r[k].fromZero[r[k].fromZero.length - 1];
  for (const r of rows) {
    const a = L4(r), o = L4(off);
    r.diff = { apsB1: a.T4p - OBS_B1.aps.value, apsOff: a.T4p - o.T4p, sidOff: a.sidH - o.sidH, nodeOff: a.node - o.node, eOff: a.eMean - o.eMean, sidB1: a.sidH - OBS_B1.sid.value };
    if (r.h2) { const b = L4(r, 'h2'), ob = L4(off, 'h2'); r.diff.apsH2 = a.T4p - b.T4p; r.diff.apsOffH2 = b.T4p - ob.T4p; r.diff.sidOffH2 = b.sidH - ob.sidH; }
    r.withinTol = Math.abs(r.diff.apsB1) + (r.diff.apsH2 !== undefined ? Math.abs(r.diff.apsH2) : Math.abs(off.diff ? off.diff.apsH2 || 0 : 0)) <= TOL.aps;
  }
  const base = JSON.parse(fs.readFileSync(path.join(ROOT, 'tests', 'out', 'baseline-w304c.json'), 'utf8')), bl = base.measure.off.h.fromZero[3];
  const offSame = { T4p: L4(off).T4p - bl.T4p, sidH: L4(off).sidH - bl.sidH, node: L4(off).node - bl.node };
  return { Wbg: W, rows, offVsBaseline304c: offSame, wallSec: (Date.now() - t0) / 1000,
    quantity: '長窓 [0,1062] の M4(調和の回帰 —— 第304便c の抽出器)の近地点の周期・恒星月(調和)・交点の周期・平均離心率。差は同じ刻みの OFF との差(機械の差分)と B1 との差' };
}

/* ── 本体 ── */
export function gatesOf(J) {
  const g = {};
  if (J.zero) {
    const Z = J.zero;
    g.twoBodyBitSame = Z.twoBody.rows.every((r) => r.bitSame && r.rMaxAll === 1 && r.uMax > 0);
    g.isolatedZero = Z.isolated.ok === true;
    g.splitAnalytic = Z.split.anaErr < 1e-12 && Z.split.relErrDirectMax < 1e-10;
    g.splitPairInvariant = Z.split.invariance['propM:pair:frozen'].sumBeta < 1e-12 && Z.split.invariance['propM:pair:free'].u0 < 1e-10 && Z.split.invariance['univ:row:frozen'].sumBeta < 1e-12;
    g.direct = Z.direct.relErrMax < 1e-10 && Z.direct.totalVelocityResidualMax < 1e-12 && Z.direct.rows.filter((r) => r.readoutSumErr !== null).every((r) => r.readoutSumErr < 1e-10 && r.readoutRowErr < 1e-10);
    g.gaussSeidel = Z.gs.method === 'gs' && Z.gs.relErrDirect < 1e-9 && Z.gs.pcgRejected && Z.gs.rowPcgAccepted && Z.gs.badDenomRejected;
  }
  if (J.manyBody) g.manyBodyPairUnit = J.manyBody.rows.filter((r) => r.read === 'propM').every((r) => Math.abs(r.pairOverNoMoon - 1) < 1e-9);
  if (J.threeBody) { g.threeBodyComplete = J.threeBody.rows.length === mConfigs().length; g.offSame304c = Math.abs(J.threeBody.offVsBaseline304c.T4p) < 1e-9; }
  return g;
}
export async function main() {
  const OUT = process.env.W305A_OUT || path.join(ROOT, 'tests', 'out', 'pairnorm-w305a.json');
  const PARTS = String(process.env.W305A_PARTS || PARTS_ALL.join(',')).split(',').filter((x) => PARTS_ALL.includes(x));
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const t0 = Date.now();
  const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
  pinDecl315c();   // 第315便c(AN406): 在位の 7 本の宣言を移行の前の写しへ(本ごとの門 —— 基点の html では no-op・正本の欄は足さない)
  const prev = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : {};
  const log = (s) => console.log('  ' + s);
  const J = { meta: null, version: HP.REL_DRAG_PAIRNORM_VERSION, harnessVersion: HARNESS_VERSION, pin: { file: DECL_FILE, base: PIN.base, liveSame: liveSame(HP) },
    kOfN: K_OF_N, lambdaUnivM: LAMBDA_UNIV_M, tol: TOL, obs: OBS_B1 };
  J.partsRun = [];
  const map = { Z: 'zero', K: 'manyBody', M: 'threeBody' };
  for (const k of PARTS_ALL) {
    if (PARTS.includes(k)) { console.log(`段 ${k}`); J[map[k]] = (k === 'Z') ? partZ(HP, log) : (k === 'K') ? partK(HP, log) : partM(HP, log, prev.threeBody); J.partsRun.push(k); }
    else if (prev[map[k]]) J[map[k]] = prev[map[k]];
  }
  J.gates = gatesOf(J);
  J.ok = Object.values(J.gates).every(Boolean) && PARTS_ALL.every((k) => !!J[map[k]]);
  J.notClaim = ['「W_bg が不要になった」', '「λ ∝ m + 対が唯一」', '「n が決まった」'];   // 書かない語(引用 —— 本文には書かない)
  const CODE = ['tests/exp-w305a-pairnorm.mjs', 'tests/lib-w315c-legacy7.mjs', 'tests/exp-w303c-earthmoon.mjs', 'tests/exp-w303b-inertialr2.mjs', 'tests/lib-w297b-fit.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  J.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第305便a', target: TARGET, code: CODE, inputs: [TARGET, LEGACY7_DATA_FILE, DECL_FILE, 'tests/out/baseline-w304c.json'] }), {
    harnessVersion: HARNESS_VERSION, loadErrors: errors.length,
    ruling: '原仮定者の裁定(第96報)—— 分母の慣性決定力の和に自分自身・分子の引きずりの和に自分自身を入れない・決断事項 AN326',
    reading: '統括の検証項目 R199(対ごとの正規化のエンジン化と三体での λ ∝ m × n × 行/対)' });
  J.elapsedS = (Date.now() - t0) / 1000;
  Object.assign(J.meta, W281A_SCOPE, w281aStableInputs(ROOT, J.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(J, null, 1) + '\n');
  console.log(`門: ${JSON.stringify(J.gates)} → ${path.relative(ROOT, OUT)}(${J.elapsedS.toFixed(0)} s)`);
}
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) await main();

/* ── 文書の表(docs/PHYSICS.md〔第305便a〕と QA docs.pairNorm305 が照合する —— 同じ関数で正本から作り直す)── */
const fx = (x, d) => (x === null || x === undefined || !Number.isFinite(x)) ? '—' : Number(x).toFixed(d);
const ex = (x, d) => (x === null || x === undefined || !Number.isFinite(x)) ? '—' : Number(x).toExponential(d);
const sg = (x, d) => (x === null || x === undefined || !Number.isFinite(x)) ? '—' : (x >= 0 ? '+' : '') + Number(x).toExponential(d);
const LONGW = (r, k = 'h') => r[k] ? r[k].fromZero[r[k].fromZero.length - 1] : null;
export function tableTwoBody(J) {
  return J.zero.twoBody.rows.map((r) => `| ${r.note} | ${r.steps} | ${r.bitSame ? 'ビット同一' : '差 ' + r.diffKey} | ${r.rMaxAll} | ${ex(r.uMax, 3)} | ${ex(r.sumBetaPair[1], 4)} |`);
}
export function tableSplit(J) {
  const S = J.zero.split, g = (law, den, kind, N) => S.rows.find((z) => z.law === law && z.denom === den && z.kind === kind && z.N === N);
  const out = [];
  for (const [law, lj] of [['propM', 'λ ∝ m'], ['univ', '普遍の λ']]) for (const [den, dj] of [['row', '行'], ['pair', '対']]) {
    out.push(`| ${lj}・${dj}・凍結した点源 Σβ | ${[1, 2, 4, 8].map((N) => fx(g(law, den, 'frozen', N).sumBeta0, 6)).join(' | ')} |`);
    out.push(`| ${lj}・${dj}・自由な源 u₀ | ${[1, 2, 4, 8].map((N) => fx(g(law, den, 'free', N).u0, 6)).join(' | ')} |`);
    out.push(`| ${lj}・${dj}・殻 + S3 の源 u₀ | ${[1, 2, 4, 8].map((N) => fx(g(law, den, 'shell', N).u0, 6)).join(' | ')} |`);
  }
  return out;
}
export function tableDirect(J) {
  return J.zero.direct.rows.map((r) => `| ${r.key} | ${r.coord} | ${r.n} | ${r.method} | ${ex(r.relErrDirect, 1)} | ${ex(r.totalVelocityResidual, 1)} | ${r.pairOverRow.map((x) => x === null ? '—' : fx(x, 4)).join(' / ')} |`)
    .concat([`| n = ${J.zero.gs.n} の雲(三次元・対) | 3d | ${J.zero.gs.n} | ${J.zero.gs.method} | ${ex(J.zero.gs.relErrDirect, 1)} | — | — |`]);
}
export function tableManyBody(J) {
  return J.manyBody.rows.map((r) => `| ${r.ja} | ${r.label} | ${r.moons} | ${ex(r.betaSunNoMoon, 4)} | ${ex(r.rowOverNoMoon, 4)} | ${fx(r.pairOverNoMoon, 9)} | ${ex(r.uRowOverNoMoon, 3)} | ${ex(r.uPairOverNoMoon, 6)} |`);
}
export function tableThreeBody(J) {
  return J.threeBody.rows.map((r) => {
    const a = LONGW(r), b = LONGW(r, 'h2'), x = r.xi;
    return `| ${r.label} | ${fx(a.T4p, 6)} | ${b ? fx(b.T4p, 6) : '—'} | ${sg(r.diff.apsB1, 3)} | ${sg(r.diff.apsOff, 2)} | ${r.diff.apsOffH2 !== undefined ? sg(r.diff.apsOffH2, 2) : '—'} | ${fx(a.sidH, 7)} | ${sg(r.diff.sidOff, 2)} | ${fx(a.node, 4)} | ${fx(a.eMean, 6)} | ${x ? ex(x.rowOverNoMoon, 3) : '—'} | ${x ? fx(x.pairOverNoMoon, 9) : '—'} |`;
  });
}
export function tableThreeBodyTol(J) {
  const off = J.threeBody.rows.find((z) => z.key === 'off'), T = J.tol;
  return J.threeBody.rows.filter((r) => r.drag).map((r) => `| ${r.label} | ${fx(Math.abs(r.diff.apsOff) / T.aps, 5)} | ${fx(Math.abs(r.diff.sidOff) / T.sid, 4)} | ${fx(Math.abs(r.diff.nodeOff) / T.node, 4)} | ${fx(Math.abs(r.diff.eOff) / T.e, 4)} | ${r.withinTol ? '内' : '外'} |`)
    .concat([`| 引きずり OFF(対照の基線)の長窓 M4 − B1 | ${fx(Math.abs(off.diff.apsB1) / T.aps, 4)} | ${fx(Math.abs(off.diff.sidB1) / T.sid, 4)} | — | — | ${off.withinTol ? '内' : '外'} |`]);
}
export function physicsTables(J) {
  return ['| 写し | 步 | 行と対 | R の最大 | u の最大 | 受け手の Σβ |', '|---|---|---|---|---|---|'].concat(tableTwoBody(J)).join('\n') + '\n\n'
    + ['| 読み・源 | N 1 | N 2 | N 4 | N 8 |', '|---|---|---|---|---|'].concat(tableSplit(J)).join('\n') + '\n\n'
    + ['| 例 | 次元 | n | 解法 | 器の直接法との差 | 総速度の残差 | Σβ 対/行(受け手ごと) |', '|---|---|---|---|---|---|---|'].concat(tableDirect(J)).join('\n') + '\n\n'
    + ['| 系 | 読み | 衛星 | β☉(衛星なし) | 行/衛星なし | 対/衛星なし | u 行/衛星なし | u 対/衛星なし |', '|---|---|---|---|---|---|---|---|'].concat(tableManyBody(J)).join('\n') + '\n\n'
    + ['| 構成 | 長窓 M4 h [年] | h/2 [年] | − B1 [年] | − OFF(h)[年] | − OFF(h/2)[年] | 恒星月 [日] | − OFF [日] | 交点 [年] | 平均離心率 | β☉ 行/月なし | β☉ 対/月なし |',
      '|---|---|---|---|---|---|---|---|---|---|---|---|'].concat(tableThreeBody(J)).join('\n') + '\n\n'
    + ['| 構成 | 近点の OFF との差/許容 | 恒星月の OFF との差/許容 | 交点の OFF との差/許容 | 離心率の OFF との差/許容 | 長窓 M4 の B1 との差 + h/2 差 |', '|---|---|---|---|---|---|'].concat(tableThreeBodyTol(J)).join('\n');
}
/** 本文に書く数(正本から —— QA が節の中にあるかを照合する) */
export function docNumbers(J) {
  const ex1 = J.zero.split.example, T = J.threeBody, g = (k) => T.rows.find((z) => z.key === k);
  const out = [fx(ex1.propRow1, 4), fx(ex1.propRow4, 4), fx(ex1.propPair4, 4), fx(ex1.univPair4, 4), ex(J.zero.direct.relErrMax, 1)];
  for (const k of ['n2-row', 'n2-pair', 'n0-pair']) { const r = g(k); if (r) out.push(fx(LONGW(r).T4p, 6), sg(r.diff.apsOff, 2)); }
  const p = g('n2-pair'); if (p && p.xi) out.push(ex(p.xi.rowOverNoMoon, 3), ex(p.xi.earthSunPair, 3));
  const u = g('univ-row'); if (u) out.push(sg(u.diff.apsOff, 2));
  const k = J.manyBody.rows.find((z) => z.sys === 'jupiter' && z.read === 'propM'); if (k) out.push(ex(k.rowOverNoMoon, 4));
  return [...new Set(out)];
}
