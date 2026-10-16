// 第306便d(原仮定者の裁定(第96報)後半「回転引きずりは、移動と回転の両方に効く座標変換である」・決断事項 AN338 ①③④〔DECISIONS v65 §0〕・
// 統括の検証項目 R207): **回転引きずりを「移動と回転の両方に効く座標変換」として器の写しで測る器**。
//
// Node だけ(対象 html の inline script を tests/lib-w279b-headless.mjs の loadHtmlHeadless で読み、html の関数 dfmInertialDragStep3・inertialDrag3RotTerm・
// dfmInertialDrag3Build・inertialSpinMoment・inertialDragEnergy・inertialDragLedgerOf と本の入口 validatePreset・coord3d.makeSim・build・step をそのまま呼ぶ)。
// **html・本の宣言・エンジンの式は変えない** —— 器の process の中で html の関数を包み(包みは素通り —— 段 P がビット同一を確かめる)、写しの走行の中でだけ
// 回転引きずりの变位を選択肢の変換に置き換える(在位の回転引きずりは今の規約〔位置だけ・x += u·dt〕のまま)。**力として何も足さない**(斥力の候補・応力は読み口の値)。
// 変換の定義の純関数は tests/lib-w306d-rotframe.mjs。
//
// ■ 写した本(宣言から探す —— spinDrag の rot を宣言した三次元の本のうち 🔩🪛🍥 と 🍩 の一押し)
//   disk 🔩 / tilt 🪛(軸引きずり on)/ ring 🍩 の一押し(W_bg 0.02211 —— 本の宣言は gain 0)/ spread 🍥(81 個の源・受け手が自転する —— 自転の角運動量の帳簿と源の並び)
//
// ■ 段
//   P(包みの素通り): 包みを入れない走行・選択肢 posLinear の記録つきの走行・本の入口 loadPreset の最後の状態がビット同一。
//   G(大域の一つの R): 写しの途中の状態の全粒子(源の軸も)を同じ R(中心 c)で回す —— 粒子間距離・K・U・|L| の不変・R⁻¹ で戻した L の一致(成分が回るのは
//     保存の破れではない)・回転引きずりの項の共変(html の関数を回した状態で呼ぶ)・走行の共変(回した状態から走らせて R⁻¹ で戻す)・
//     時間に依る枠 R(t) の読み替えの恒等式 W′ = v′ + u′(定義 relabel/kick/missing × 中心が止まる/動く × h と h/2)・キックの定義の一步の帳簿。
//   L(受け手ごとの R_i): 選択肢(lib の OPTIONS —— posLinear〔今の規約〕/posOnly/posAtt〔+ v′ = R v の読み替えの読み口〕/posAttVKick)の写しを h・h/2・h/4 で走らせ、
//     帳簿(回転引きずりの変位が運ぶ軌道角運動量・キックの力積とトルク・自転の角運動量・ΔU・粒子間距離・軸からの距離・R̄ で戻した残り)と刻みの収束。
//   O(源の並び): 源ごとの角速度のベクトル和の 1 回の螺旋運動と、源ごとの剛体回転の順序付きの積(前向き・逆向き)の差(h・h/2・h/4)。
//   F(揺らぎの仕事): 合成の集団と 🍥 の写しで u_rot を半径の帯の滑らかな流れ(平均場の分)と残り(揺らぎの分)に分け、仕事・運動量・応力の候補を読む。
//   D(🍩 の步の順序の遅れ): 原因(semic の核の位置で作った接線の変位を、公転で進んだ後の位置に足す)と直し方の候補(evalX1・transport・midpoint・rigid・strang・split)の h への依存。
//
// ■ 言わないこと: 「熱力学を導いた」「斥力を導いた」「回転引きずりが座標変換であることを示した」「エンジンを直した」(器は写しの中で定義の帳簿を測るだけ)。
//
// ■ 使い方
//   node tests/exp-w306d-rotframe.mjs   → 正本 tests/out/rotframe-w306d.json(段 rotframe-306d)
//   W306D_OUT=<json> で出力先を変える(試走は正本を書かない)・W306D_TARGET=<html>(既定 beta/index.html)・W306D_N(🔩🪛🍩 の写しの h の步数 —— 既定 400)・
//   W306D_QUICK=1(步数を縮め h/4 と 🍥 を短く —— 煙試験の窓。正本は書かない用途)。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlHeadless } from './lib-w279b-headless.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as RF from './lib-w306d-rotframe.mjs';
// 第281便a の領域 hash の宣言(器と lib から deriveScope で引いた下限 + 本 4 本)
const REGEN_SCOPE = {"presets":["chainDiskToy3d","chainDiskToy3dTilt","chainSpreadToy3d","saturnRingInertial3d"],"roots":["$","HP.allPresets","HP.coord3d","HP.loadPreset","HP.validatePreset","REL_DRAG_SPIN3_VERSION","T","ab","appStepDt","ctx","cv","dfmInertialDrag3Build","dfmInertialDragStep3","inertialDrag3RotTerm","inertialDragEnergy","inertialDragLedgerOf","inertialDragSemicWork","inertialSpinMoment","relDrag3SpinOf","relDragCoefficientOf","sim"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w306d-rotframe-1';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (o) => JSON.parse(JSON.stringify(o));
const F64 = (n) => new Float64Array(n);
const hypot3 = (a, b, c) => Math.sqrt(a * a + b * b + c * c);
const { dot, cross, norm, add, sub, scale } = RF;

/** 写しの一覧(本の宣言は変えない —— 器の中で組む)。emoji で宣言から本を探す */
export const CASES = [
  { key: 'disk', emoji: '🔩', patch: null },
  { key: 'tilt', emoji: '🪛', patch: null },
  { key: 'ring', emoji: '🍩', patch: 'ab' },
  { key: 'spread', emoji: '🍥', patch: null },
];
/** 宣言から本の ID を探す: 三次元(coord "3d")で relativeDrag.spinDrag.rot = "surfaceFlip" を宣言した本(本の宣言か一押し)のうち、写しの emoji の本 */
export function idsFromDecl(HP) {
  const on = (r) => !!(r && r.spinDrag && r.spinDrag.rot === 'surfaceFlip');
  const hit = (e) => (p) => !!p && p.emoji === e && !!p.physics && p.physics.coord === '3d' && (on(p.physics.relativeDrag) || on(p.abBody && p.abBody.physicsPatch && p.abBody.physicsPatch.relativeDrag));
  const out = {};
  for (const c of CASES) { const p = HP.allPresets().find(hit(c.emoji)); if (p) out[c.emoji] = p.id; }
  return out;
}

/* ───────────────────────── html の口と包み ───────────────────────── */
let MODE = null;   // null なら包みは素通り
const ORIG = {};
const E = (H, name) => H.evalExpr(name);
export function installWraps(H) {
  const c = H.ctx;
  if (c.__w306d) return;
  for (const k of ['dfmInertialDragStep3', 'inertialDrag3RotTerm']) ORIG[k] = c[k];
  c.inertialDrag3RotTerm = function (S, n, C, eps, KX, KY, KZ) {
    const out = ORIG.inertialDrag3RotTerm(S, n, C, eps, KX, KY, KZ);
    const M = MODE;
    if (M && M.cur && !M.cur.inner) M.cur.rot = { C, eps, K: [KX || S.x, KY || S.y, KZ || S.z].map((a) => Float64Array.from(a.subarray(0, n))) };
    return out;
  };
  c.dfmInertialDragStep3 = function (S, dt) {
    const M = MODE;
    if (!M) return ORIG.dfmInertialDragStep3(S, dt);
    return stepVariant(H, M, S, dt);
  };
  c.__w306d = true;
}
export function uninstallWraps(H) {
  const c = H.ctx;
  if (!c.__w306d) return;
  for (const k of Object.keys(ORIG)) c[k] = ORIG[k];
  c.__w306d = false;
}
/** 写しの状態: S を原型に、書く配列と帳簿だけを自前に(S は 1 bit も動かさない) */
function scratchOf(S, n, o = {}) {
  const T = Object.create(S);
  T._rdUX = F64(n); T._rdUY = F64(n); T._rdUZ = F64(n);
  T._rdA = F64(n * n); T._rdDeg = F64(n);
  if (o.spin) T.spin = o.spin;
  if (o.m) T.m = o.m;
  if (o.x) { T.x = o.x; T.y = o.y; T.z = o.z; }
  if (o.sax) { T.sax = o.sax; T.say = o.say; T.saz = o.saz; }
  T.inertialDrag3RotSrc = 0; T.inertialDrag3RotN = 0; T.inertialDrag3RotSkip = 0; T.inertialDrag3RotMax = 0;
  return T;
}
/** 器の直接法(部分ピボット)—— 行列 M = I + diag(DG) − A(固定の行は単位・右辺 0)。右辺 3 本(第305便d の器と同じ形) */
export function solveRows(A, DG, fixed, n, BX, BY, BZ) {
  const M = F64(n * n), X = Float64Array.from(BX), Y = Float64Array.from(BY), Z = Float64Array.from(BZ);
  for (let i = 0; i < n; i++) {
    const row = i * n;
    if (fixed[i]) { M[row + i] = 1; X[i] = 0; Y[i] = 0; Z[i] = 0; continue; }
    for (let j = 0; j < n; j++) M[row + j] = -A[row + j];
    M[row + i] = 1 + DG[i];
  }
  for (let k = 0; k < n; k++) {
    let p = k, b = Math.abs(M[k * n + k]);
    for (let i = k + 1; i < n; i++) { const v = Math.abs(M[i * n + k]); if (v > b) { b = v; p = i; } }
    if (p !== k) {
      for (let j = 0; j < n; j++) { const t = M[k * n + j]; M[k * n + j] = M[p * n + j]; M[p * n + j] = t; }
      let t = X[k]; X[k] = X[p]; X[p] = t; t = Y[k]; Y[k] = Y[p]; Y[p] = t; t = Z[k]; Z[k] = Z[p]; Z[p] = t;
    }
    const pk = M[k * n + k];
    for (let i = k + 1; i < n; i++) {
      const f = M[i * n + k] / pk;
      if (f === 0) continue;
      for (let j = k + 1; j < n; j++) M[i * n + j] -= f * M[k * n + j];
      X[i] -= f * X[k]; Y[i] -= f * Y[k]; Z[i] -= f * Z[k];
    }
  }
  for (let i = n - 1; i >= 0; i--) {
    let sx = X[i], sy = Y[i], sz = Z[i];
    for (let j = i + 1; j < n; j++) { const a = M[i * n + j]; sx -= a * X[j]; sy -= a * Y[j]; sz -= a * Z[j]; }
    const d = M[i * n + i]; X[i] = sx / d; Y[i] = sy / d; Z[i] = sz / d;
  }
  return [X, Y, Z];
}

/** 源ごとの角速度 ω_ij = C m_j Ω_j M1(r_ij)/r_ij â_j(html の inertialSpinMoment —— エンジンと同じ式・同じ順の積)。
 *  戻り値: 受け手 i ごとの [{j, w:[…], p:[源の位置]}]・s(Σ_j f (â_j × d) —— エンジンの s_rot と同じ演算列) */
function perSource(H, S, n, C, eps, K) {
  const M1f = E(H, 'inertialSpinMoment'), gl = S._rdSpinGL;
  const [X, Y, Z] = K, m = S.m, sp = S.spin, Rd = S.radOv, set = S._rdPairSet, NP = S._rdPairN;
  const rec = Array.from({ length: n }, () => []), sx = F64(n), sy = F64(n), sz = F64(n);
  for (let j = 0; j < n; j++) {
    const Om = sp[j], R = Rd[j], mj = m[j];
    if (Om === 0 || !(R > 0) || !(mj > 0) || !Number.isFinite(mj) || !Number.isFinite(Om)) continue;
    const ax = S.sax[j], ay = S.say[j], az = S.saz[j];
    for (let i = 0; i < n; i++) {
      if (i === j) continue;
      const mi = m[i];
      if (!(mi > 0) || !Number.isFinite(mi)) continue;
      if (set && !set.has(i * NP + j)) continue;
      const dx = X[i] - X[j], dy = Y[i] - Y[j], dz = Z[i] - Z[j], r = Math.sqrt(dx * dx + dy * dy + dz * dz);
      const M1 = M1f(r, R, eps, gl);
      if (M1 === null) continue;
      const f = C * mj * Om * M1 / r;
      const cx = ay * dz - az * dy, cy = az * dx - ax * dz, cz = ax * dy - ay * dx;
      sx[i] += f * cx; sy[i] += f * cy; sz[i] += f * cz;
      rec[i].push({ j, w: [f * ax, f * ay, f * az] });
    }
  }
  return { rec, s: [sx, sy, sz] };
}
/** 軸のまわりの角(a → b を Ω̂ のまわりに —— 垂直成分の符号つきの角) */
function angleAround(oh, a, b) {
  const ap = sub(a, scale(oh, dot(oh, a))), bp = sub(b, scale(oh, dot(oh, b)));
  return Math.atan2(dot(oh, cross(ap, bp)), dot(ap, bp));
}
const rhoOfAxis = (oh, c, x) => { const d = sub(x, c); return norm(sub(d, scale(oh, dot(oh, d)))); };

/* ───────────────────────── 選択肢の步(包み)───────────────────────── */
/** 引きずりの步の包み: エンジンの步(今の規約)の後で、回転引きずりの変位 h u_rot を選択肢の変換に置き換え(写しの中だけ)、帳簿を数える */
function stepVariant(H, M, S, dt) {
  const n = S.n;
  const X1 = [Float64Array.from(S.x.subarray(0, n)), Float64Array.from(S.y.subarray(0, n)), Float64Array.from(S.z.subarray(0, n))];
  const V = [Float64Array.from(S.vx.subarray(0, n)), Float64Array.from(S.vy.subarray(0, n)), Float64Array.from(S.vz.subarray(0, n))];
  M.cur = {};
  const out = ORIG.dfmInertialDragStep3(S, dt);
  const cur = M.cur; M.cur = null;
  const st = M.st;
  // 引きずりの步は慣性速度 v を書かない(運動量を運ばない —— 毎步ビットで確かめる)
  let vSame = true;
  for (let i = 0; i < n && vSame; i++) if (!Object.is(V[0][i], S.vx[i]) || !Object.is(V[1][i], S.vy[i]) || !Object.is(V[2][i], S.vz[i])) vSame = false;
  st.vUntouched += vSame ? 1 : 0; st.engineSteps++;
  if (!cur.rot) { st.noRot++; return out; }
  st.steps++;
  const free = new Uint8Array(n);
  for (let i = 0; i < n; i++) free[i] = (S.m[i] > 0 && Number.isFinite(S.m[i]) && !S.pinned[i]) ? 1 : 0;
  const { C, eps, K } = cur.rot;
  // 純粋な s_rot(エンジンの関数を写しの状態で 0 から)と源ごとの分解(同じ演算列 —— 毎步ビット同一を数える)
  const T0 = scratchOf(S, n);
  M.cur = { inner: true };
  ORIG.inertialDrag3RotTerm(T0, n, C, eps, K[0], K[1], K[2]);
  M.cur = null;
  const sRot = [T0._rdUX, T0._rdUY, T0._rdUZ];
  const ps = perSource(H, S, n, C, eps, K);
  let same = true;
  for (let i = 0; i < n && same; i++) if (!Object.is(ps.s[0][i], sRot[0][i]) || !Object.is(ps.s[1][i], sRot[1][i]) || !Object.is(ps.s[2][i], sRot[2][i])) same = false;
  st.decompExact += same ? 1 : 0;
  const fixed = new Uint8Array(n); for (let i = 0; i < n; i++) fixed[i] = free[i] ? 0 : 1;
  const A = S._rdA, DG = S._rdDeg;
  const uRot = solveRows(A, DG, fixed, n, sRot[0], sRot[1], sRot[2]);
  const opt = M.opt;
  // 受け手ごとの螺旋運動(核の位置 K)と、移送の位置 X1 の中心(源の X1 の位置で作り直す —— 同じ時刻の点どうし)
  const Bx = X1[0].slice(), By = X1[1].slice(), Bz = X1[2].slice();   // 並進の分を足した点(回転の変位の前)
  const Xf = [S.x, S.y, S.z];
  let posCorr = 0;
  const vNew = [F64(n), F64(n), F64(n)], vSet = new Uint8Array(n);
  let alt = null;   // 段 D の候補(evalX1・midpoint)の u
  if (opt === 'evalX1' || opt === 'midpoint') {
    const P = opt === 'evalX1' ? X1 : [0, 1, 2].map((c) => { const a = F64(n); for (let i = 0; i < n; i++) a[i] = 0.5 * (K[c][i] + X1[c][i]); return a; });
    const T1 = scratchOf(S, n);
    M.cur = { inner: true };
    ORIG.inertialDrag3RotTerm(T1, n, C, eps, P[0], P[1], P[2]);
    M.cur = null;
    alt = solveRows(A, DG, fixed, n, T1._rdUX, T1._rdUY, T1._rdUZ);
  }
  const Lsum = M.L, Racc = M.Racc, c0 = M.c0;
  let dL = [0, 0, 0], dLk = [0, 0, 0], dLs = [0, 0, 0], dPk = [0, 0, 0], dKk = 0, phiStep = 0, kRec = 0, OmBarW = [0, 0, 0], mW = 0;
  // 1 周目: 受け手ごとの螺旋運動(核の位置 K —— 角速度と軸)・移送の位置の中心(源の X1 —— 同じ時刻の点どうし)・連立の解の通過 ν・残り
  const Q = new Array(n).fill(null);
  for (let i = 0; i < n; i++) {
    if (!free[i] || !ps.rec[i].length) continue;
    const ws = ps.rec[i].map((q) => q.w), psK = ps.rec[i].map((q) => [K[0][q.j], K[1][q.j], K[2][q.j]]), psX = ps.rec[i].map((q) => [X1[0][q.j], X1[1][q.j], X1[2][q.j]]);
    const scK = RF.chasles(ws, psK), scX = RF.chasles(ws, psX);
    if (!scK) continue;
    kRec++;
    const xK = [K[0][i], K[1][i], K[2][i]], x1 = [X1[0][i], X1[1][i], X1[2][i]], ur = [uRot[0][i], uRot[1][i], uRot[2][i]];
    const t = cross(scK.Om, sub(xK, scK.c)), tt = dot(t, t);
    const nu = tt > 0 ? dot(ur, t) / tt : 0;
    const Om = scale(scK.Om, nu), resid = sub(ur, scale(t, nu)), oh = scale(scK.Om, 1 / scK.OmAbs);
    // 並進の分(エンジンの u − 器の u_rot)を足した点 b(回転の変位はこの点に作用させる —— 並進が先・回転が後の順)
    const b = add(x1, scale(sub([S._rdUX[i], S._rdUY[i], S._rdUZ[i]], ur), dt));
    Q[i] = { scK, scX, xK, x1, ur, t, nu, Om, resid, oh, b };
    OmBarW = add(OmBarW, scale(Om, S.m[i])); mW += S.m[i];
  }
  const OmBar = mW > 0 ? scale(OmBarW, 1 / mW) : [0, 0, 0], Rbar = RF.rodrigues(scale(OmBar, dt));
  // 2 周目: 選択肢の変位と帳簿
  for (let i = 0; i < n; i++) {
    const q = Q[i];
    if (!q) continue;
    const { scK, scX, xK, x1, ur, t, nu, Om, resid, oh, b } = q;
    const w = scale(Om, dt), R = RF.rodrigues(w);
    // 回転の変位(選択肢)—— 今の規約は h u_rot(核の位置で作った接線を移送の位置に足す)
    let d;
    if (opt === 'posLinear' || opt === 'split') d = scale(ur, dt);
    else if (opt === 'evalX1' || opt === 'midpoint') d = scale([alt[0][i], alt[1][i], alt[2][i]], dt);
    else if (opt === 'transport') { const a = angleAround(oh, sub(xK, scK.c), sub(b, scX.c)); d = add(RF.matVec(RF.rodrigues(scale(oh, a)), scale(t, nu * dt)), scale(resid, dt)); }
    else if (opt === 'globalRbar') d = sub(RF.rotateAbout(Rbar, c0, b), b);   // 対照: 全受け手を同じ R̄(源の中心 c₀)で —— 一つの座標回転(残りも受け手ごとの角も捨てる)
    else {   // 剛体の回転(posOnly・posAtt・posAttVKick・strang)—— 受け手ごとの R_i(中心は受け手の螺旋の軸の線)
      d = add(sub(RF.rotateAbout(R, scX.c, b), b), scale(resid, dt));
      if (opt === 'strang') { const Rh = RF.rodrigues(scale(w, 0.5)), v = [V[0][i], V[1][i], V[2][i]]; d = add(d, scale(sub(RF.matVec(Rh, v), RF.matVec(R, v)), dt)); }
    }
    Bx[i] = b[0]; By[i] = b[1]; Bz[i] = b[2];
    const corr = sub(d, scale(ur, dt));
    if (opt !== 'posLinear' && opt !== 'split') { Xf[0][i] += corr[0]; Xf[1][i] += corr[1]; Xf[2][i] += corr[2]; posCorr = Math.max(posCorr, norm(corr)); }
    // 帳簿(受け手 i): 回転の変位が運ぶ軌道角運動量 m d × v・軸からの距離・角
    const mi = S.m[i], v = [S.vx[i], S.vy[i], S.vz[i]];
    dL = add(dL, scale(cross(d, v), mi));
    const ang = dt * nu * scK.OmAbs;
    phiStep += Math.abs(ang); M.phi[i] += ang;
    const rB = rhoOfAxis(oh, scX.c, b), rA = rhoOfAxis(oh, scX.c, add(b, d));
    const bp = sub(sub(b, scX.c), scale(oh, dot(oh, sub(b, scX.c)))), rh = norm(bp) > 0 ? scale(bp, 1 / norm(bp)) : [0, 0, 0];
    const kp = sub(sub(xK, scK.c), scale(oh, dot(oh, sub(xK, scK.c)))), rk = norm(kp) > 0 ? scale(kp, 1 / norm(kp)) : [0, 0, 0];
    M.drho[i] += rA - rB; M.lag1[i] += dot(d, rh); M.lagK[i] += dot(d, rk); M.drhoRes[i] += opt === 'globalRbar' ? 0 : dt * dot(resid, rh);   // 残り(連立の解が混ぜた分)の動径の一次は別に積む
    // 予言の遅れ(公転で進んだ角 Δφ_orb と接線の変位の積): |d_t| sin(Δφ_orb)
    M.lagPred[i] += nu * dt * norm(t) * Math.sin(angleAround(oh, sub(xK, scK.c), sub(b, scX.c)));
    // 姿勢(posAtt・posAttVKick): 受け手の姿勢を R で回す —— 表せる軸(saOn・歳差なし)は軸を、捩れは rotA へ。表せない傾き(saOn = 0)は数える
    const opd = RF.optionOf(opt);
    if (opd && opd.att) {
      const a = [S.sax[i], S.say[i], S.saz[i]], sw = RF.swingTwist(w, a), a2 = RF.matVec(R, a), J = 0.5 * mi * S.R[i] * S.R[i] * S.spin[i];
      S.rotA[i] += sw.twist; M.twist[i] += sw.twist;
      if (S.saOn[i] && S.saOm[i] === 0) { const nn = norm(a2); S.sax[i] = a2[0] / nn; S.say[i] = a2[1] / nn; S.saz[i] = a2[2] / nn; dLs = add(dLs, scale(sub([S.sax[i], S.say[i], S.saz[i]], a), J)); }
      else if (sw.swing > 0) { M.swingLost[i] += sw.swing; }
    }
    if (Racc) Racc[i] = RF.matMul(R, Racc[i]);
    // 速度(キック): v ← R v —— 絶対の慣性速度の変更(力積 m(R − I)v・トルク m (x − c₀) × (R − I)v・仕事 ½m(|Rv|² − |v|²))
    if (opd && opd.vel === 'kick') {
      const Rv = RF.matVec(R, v), dv = sub(Rv, v), xf = [Xf[0][i], Xf[1][i], Xf[2][i]];
      vNew[0][i] = Rv[0]; vNew[1][i] = Rv[1]; vNew[2][i] = Rv[2]; vSet[i] = 1;
      dPk = add(dPk, scale(dv, mi)); dLk = add(dLk, scale(cross(sub(xf, c0), dv), mi)); dKk += 0.5 * mi * (dot(Rv, Rv) - dot(v, v));
    }
  }
  for (let i = 0; i < n; i++) if (vSet[i]) { S.vx[i] = vNew[0][i]; S.vy[i] = vNew[1][i]; S.vz[i] = vNew[2][i]; }
  // ΔU(回転の変位 —— 並進の分を足した点 B から最後の点 Xf へ・同じ核と同じマスク〔html の inertialDragEnergy〕)と粒子間距離の変化(受け手どうし)
  if (M.full) {
    const EB = E(H, 'inertialDragEnergy')(Object.assign(Object.create(S), { x: Bx, y: By, z: Bz })), EA = E(H, 'inertialDragEnergy')(S);
    M.dU += EA.U - EB.U;
    const ps2 = RF.pairStats({ x: Bx, y: By, z: Bz }, { x: S.x, y: S.y, z: S.z }, n, free);
    M.pairMeanSum += ps2.mean; M.pairRmsSum += ps2.rms; M.pairMax = Math.max(M.pairMax, ps2.max);
  }
  // R̄ で戻した比較: 共通の回転 R̄ = R(h Ω̄)(Ω̄ = 受け手の質量の重みの平均)なら成分が回るだけの分 (R̄ − I)L と、回転引きずりが運んだ ΔL(位置の変位 + キック)との差
  //(受け手ごとの R_i の違いと、速度を回さないこと —— 一つの座標回転では説明できない分 = 外から受けたトルク)
  if (mW > 0) {
    let Lb = [0, 0, 0];
    for (let i = 0; i < n; i++) if (free[i]) Lb = add(Lb, scale(cross([X1[0][i] - c0[0], X1[1][i] - c0[1], X1[2][i] - c0[2]], [V[0][i], V[1][i], V[2][i]]), S.m[i]));
    const Rb = RF.rodrigues(scale(OmBarW, dt / mW)), rotPart = sub(RF.matVec(Rb, Lb), Lb);
    Lsum.rotPart = add(Lsum.rotPart, rotPart); Lsum.torque = add(Lsum.torque, sub(add(dL, dLk), rotPart));
  }
  Lsum.dL = add(Lsum.dL, dL); Lsum.dLk = add(Lsum.dLk, dLk); Lsum.dLs = add(Lsum.dLs, dLs); Lsum.dPk = add(Lsum.dPk, dPk); Lsum.dKk += dKk;
  st.phiSum += phiStep; st.recv = Math.max(st.recv, kRec); st.posCorrMax = Math.max(st.posCorrMax, posCorr);
  if (M.onStep) M.onStep(S, { uRot, sRot, K, X1, V, free, dt, C, eps, ps });
  return out;
}

/* ───────────────────────── 本の写しの走行 ───────────────────────── */
function presetOf(HP, id) { const p = HP.allPresets().find((q) => q.id === id); if (!p) throw new Error('本が無い: ' + id); return clone(p); }
/** 写しを組む(本の宣言は変えない)。o.split: 步の順序 split の写し(比較用の明示の鍵)・o.retro: 環の向きを逆にした写し(原因の確かめ) */
export function buildCase(H, id, patch, o = {}) {
  const HP = H.HP, q = presetOf(HP, id);
  if (patch === 'ab') q.physics.relativeDrag = clone(q.abBody.physicsPatch.relativeDrag);
  if (o.split) q.physics.relativeDrag.stepOrder = 'split';
  if (o.retro) for (const b of q.bodies) if (b.type === 'ring') b.direction = -1;
  const v = HP.validatePreset(q);
  if (!v.ok) throw new Error('validatePreset(' + id + '): ' + JSON.stringify(v.errors || v.err).slice(0, 300));
  const S = HP.coord3d.makeSim();
  S.build(clone(v.preset));
  return { S, dt: E(H, 'appStepDt')(S), preset: v.preset };
}
const fp = (S) => {
  const h = crypto.createHash('sha1');
  for (const k of ['x', 'y', 'z', 'vx', 'vy', 'vz', 'rotA', 'sax', 'say', 'saz', 'spin']) { const a = S[k]; if (a) { const b = Float64Array.from(a.subarray(0, Math.min(a.length, S.n))); h.update(Buffer.from(b.buffer)); } }
  return h.digest('hex').slice(0, 16);
};
function centerOf(S) { for (let i = 0; i < S.n; i++) if (S.pinned[i]) return [S.x[i], S.y[i], S.z[i]]; return [0, 0, 0]; }
function newMode(S, opt, o = {}) {
  const n = S.n;
  return { opt, cur: null, full: o.full !== false, onStep: o.onStep || null, c0: centerOf(S),
    st: { engineSteps: 0, steps: 0, noRot: 0, vUntouched: 0, decompExact: 0, phiSum: 0, recv: 0, posCorrMax: 0 },
    L: { dL: [0, 0, 0], dLk: [0, 0, 0], dLs: [0, 0, 0], dPk: [0, 0, 0], dKk: 0, rotPart: [0, 0, 0], torque: [0, 0, 0] },
    phi: F64(n), drho: F64(n), drhoRes: F64(n), lag1: F64(n), lagK: F64(n), lagPred: F64(n), twist: F64(n), swingLost: F64(n),
    Racc: Array.from({ length: n }, () => RF.IDENT.slice()), dU: 0, pairMeanSum: 0, pairRmsSum: 0, pairMax: 0 };
}
const freeMask = (S) => { const f = new Uint8Array(S.n); for (let i = 0; i < S.n; i++) f[i] = (S.m[i] > 0 && Number.isFinite(S.m[i]) && !S.pinned[i]) ? 1 : 0; return f; };
/** 1 本の写しを選択肢 opt で N 步(h)/2N 步(h/2)/4N 步(h/4)—— level = 1|2|4 */
export function runVariant(H, cs, opt, N, level = 1, o = {}) {
  installWraps(H);
  const { S, dt: dt0 } = buildCase(H, cs.id, cs.patch, { split: opt === 'split' || o.split, retro: o.retro });
  const dt = dt0 / level, steps = N * level;
  const M = newMode(S, opt, o);
  const free = freeMask(S);
  const L0 = RF.ledgerOf(S, M.c0, free), E0 = E(H, 'inertialDragEnergy')(S);
  MODE = M;
  const t0 = Date.now();
  try { for (let k = 0; k < steps; k++) S.step(dt); } finally { MODE = null; }
  return { S, M, dt, steps, level, wallSec: (Date.now() - t0) / 1000, print: fp(S), L0, E0, free };
}
const mean = (a, mask) => { let s = 0, k = 0; for (let i = 0; i < a.length; i++) { if (mask && !mask[i]) continue; s += a[i]; k++; } return k ? s / k : 0; };
const meanAbs = (a, mask) => { let s = 0, k = 0; for (let i = 0; i < a.length; i++) { if (mask && !mask[i]) continue; s += Math.abs(a[i]); k++; } return k ? s / k : 0; };
/** 走行の要約(帳簿) */
function summarizeRun(H, r) {
  const { S, M, L0, E0, free } = r, n = S.n, st = M.st;
  const recv = new Uint8Array(n); for (let i = 0; i < n; i++) recv[i] = free[i] && M.phi[i] !== 0 ? 1 : 0;
  const L1 = RF.ledgerOf(S, M.c0, free), E1 = E(H, 'inertialDragEnergy')(S), led = E(H, 'inertialDragLedgerOf')(S);
  // 角運動量の尺度: Σ m |x − c₀| |v|(最後の状態 —— 🔩🪛 は静止から始まるので |L₀| = 0)
  const Lmag = (() => { let s = 0; for (let i = 0; i < n; i++) if (free[i]) s += S.m[i] * hypot3(S.x[i] - M.c0[0], S.y[i] - M.c0[1], S.z[i] - M.c0[2]) * hypot3(S.vx[i], S.vy[i], S.vz[i]); return s || 1; })(), Pscale = (() => { let s = 0; for (let i = 0; i < n; i++) if (free[i]) s += S.m[i] * hypot3(S.vx[i], S.vy[i], S.vz[i]); return s || 1; })();
  // 読み替えの読み口: 受け手ごとの枠で読んだ L′ = Σ m (x − c₀) × R_acc v と絶対の L の差(受け手ごとの R_i は一つの R⁻¹ で戻せない)
  let Lr = [0, 0, 0], aMin = Infinity, aMax = -Infinity;
  for (let i = 0; i < n; i++) {
    if (!free[i]) continue;
    const Rv = RF.matVec(M.Racc[i], [S.vx[i], S.vy[i], S.vz[i]]);
    Lr = add(Lr, scale(cross([S.x[i] - M.c0[0], S.y[i] - M.c0[1], S.z[i] - M.c0[2]], Rv), S.m[i]));
    if (recv[i]) { const a = RF.angleOf(M.Racc[i]); aMin = Math.min(aMin, a); aMax = Math.max(aMax, a); }
  }
  let swingN = 0, swingMax = 0; for (let i = 0; i < n; i++) if (M.swingLost[i] > 0) { swingN++; swingMax = Math.max(swingMax, M.swingLost[i]); }
  const drho = mean(M.drho, recv), lag1 = mean(M.lag1, recv);
  return { steps: r.steps, dt: r.dt, level: r.level, wallSec: r.wallSec, print: r.print, rotSteps: st.steps, engineSteps: st.engineSteps, vUntouched: st.vUntouched, decompExact: st.decompExact,
    receivers: st.recv, posCorrMax: st.posCorrMax,
    phiAbsMean: meanAbs(M.phi, recv), phiMean: mean(M.phi, recv),
    Lscale: Lmag, L0abs: norm(L0.L), L1abs: norm(L1.L), dLpos: M.L.dL, dLposRel: norm(M.L.dL) / Lmag, dLkickRel: norm(M.L.dLk) / Lmag, dLspin: norm(M.L.dLs), dLspinRel: norm(L0.Ls) > 0 ? norm(M.L.dLs) / norm(L0.Ls) : 0, dPkickRel: norm(M.L.dPk) / Pscale, dKkick: M.L.dKk,
    rotPartRel: norm(M.L.rotPart) / Lmag, torqueRel: norm(M.L.torque) / Lmag,
    dLtotRel: norm(sub(L1.L, L0.L)) / Lmag, dLmagRel: (norm(L1.L) - norm(L0.L)) / Lmag, Lspin0: norm(L0.Ls), Lspin1: norm(L1.Ls),
    dU: M.dU, dURel: M.dU / Math.abs(E0.U || 1), pairMeanPerStep: st.steps ? M.pairMeanSum / st.steps : 0, pairRmsPerStep: st.steps ? M.pairRmsSum / st.steps : 0, pairMax: M.pairMax,
    drhoMean: drho, drhoResMean: mean(M.drhoRes, recv), drhoRotMean: drho - mean(M.drhoRes, recv), lag1Mean: lag1, e2Mean: drho - lag1, lagKMean: mean(M.lagK, recv), lagPredMean: mean(M.lagPred, recv), lag305: lag1 - mean(M.lagK, recv),
    twistAbsMean: meanAbs(M.twist, recv), swingLostN: swingN, swingLostMax: swingMax,
    relabelReadRel: norm(sub(Lr, L1.L)) / Lmag, frameAngleSpread: Number.isFinite(aMax) ? aMax - aMin : 0,
    E0: E0.E, dE: E1.E - E0.E, dErel: (E1.E - E0.E) / Math.abs(E0.E || 1), work: led ? led.work : null, RE: led ? led.RE : null,
    final: { x: Array.from(S.x.subarray(0, n)), y: Array.from(S.y.subarray(0, n)), z: Array.from(S.z.subarray(0, n)) } };
}
/** 最後の位置の差(rms・受け手)—— 同じ h の今の規約との差 */
function posDiff(a, b, free) {
  let s = 0, k = 0, mx = 0;
  for (let i = 0; i < a.x.length; i++) { if (!free[i]) continue; const d = hypot3(a.x[i] - b.x[i], a.y[i] - b.y[i], a.z[i] - b.z[i]); s += d * d; k++; mx = Math.max(mx, d); }
  return { rms: k ? Math.sqrt(s / k) : 0, max: mx };
}

/* ───────────────────────── 段 P(包みの素通り)───────────────────────── */
export function partPass(H, ids, N) {
  const rows = [];
  for (const cs of CASES) {
    const id = ids[cs.emoji];
    uninstallWraps(H);
    const a = buildCase(H, id, cs.patch);
    for (let k = 0; k < N; k++) a.S.step(a.dt);
    const pa = fp(a.S);
    const b = runVariant(H, { id, patch: cs.patch }, 'posLinear', N, 1, { full: false });
    let book = null;
    if (!cs.patch) {
      uninstallWraps(H);
      H.HP.loadPreset(id, false);
      const S = E(H, 'sim'), dt = E(H, 'appStepDt')(S);
      for (let k = 0; k < N; k++) S.step(dt);
      book = fp(S) === pa;
    }
    rows.push({ key: cs.key, id, steps: N, plain: pa, recorded: b.print, same: pa === b.print, bookRoute: book, decompExact: b.M.st.decompExact, rotSteps: b.M.st.steps });
  }
  installWraps(H);
  return { steps: N, rows, allSame: rows.every((r) => r.same && r.bookRoute !== false && r.decompExact === r.rotSteps) };
}

/* ───────────────────────── 段 G(大域の一つの R)───────────────────────── */
export const G_ROT = { axis: [1, 2, 3], angle: 0.37 };
const gR = () => RF.rodrigues(scale(G_ROT.axis, G_ROT.angle / norm(G_ROT.axis)));
/** 状態の全粒子(位置・速度・源の軸)を R(中心 c)で回した写しの配列 */
function rotState(S, R, c) {
  const n = S.n, o = { x: F64(n), y: F64(n), z: F64(n), vx: F64(n), vy: F64(n), vz: F64(n), sax: F64(n), say: F64(n), saz: F64(n) };
  for (let i = 0; i < n; i++) {
    const x = RF.rotateAbout(R, c, [S.x[i], S.y[i], S.z[i]]), v = RF.matVec(R, [S.vx[i], S.vy[i], S.vz[i]]), a = RF.matVec(R, [S.sax[i], S.say[i], S.saz[i]]);
    o.x[i] = x[0]; o.y[i] = x[1]; o.z[i] = x[2]; o.vx[i] = v[0]; o.vy[i] = v[1]; o.vz[i] = v[2]; o.sax[i] = a[0]; o.say[i] = a[1]; o.saz[i] = a[2];
  }
  return o;
}
function applyState(S, o) { for (const k of Object.keys(o)) S[k].set(o[k]); }
export function partGlobal(H, ids, N) {
  installWraps(H);
  const R = gR(), RT = RF.matT(R), rows = [];
  for (const cs of CASES) {
    const id = ids[cs.emoji], Nb = cs.key === 'spread' ? Math.max(20, Math.floor(N / 8)) : N;
    // (a) 途中の状態(今の規約で Nb/2 步)の静的な不変量
    const a = buildCase(H, id, cs.patch);
    for (let k = 0; k < Nb / 2; k++) a.S.step(a.dt);
    const S = a.S, n = S.n, all = new Uint8Array(n).fill(1);
    const stat = [];
    for (const cKind of ['source', 'offset']) {
      const c = cKind === 'source' ? centerOf(S) : add(centerOf(S), [3, -2, 1]);
      const o = rotState(S, R, c), T = Object.assign(Object.create(S), o);
      const ps = RF.pairStats(S, T, n, all);
      const e0 = E(H, 'inertialDragEnergy')(S), e1 = E(H, 'inertialDragEnergy')(T);
      const l0 = RF.ledgerOf(S, c, all), l1 = RF.ledgerOf(T, c, all);
      const back = RF.matVec(RT, l1.L), backS = RF.matVec(RT, l1.Ls);
      // 回転引きずりの項の共変: s_rot(R·状態) = R s_rot(状態)(html の関数 —— 核の位置 = 今の位置)
      const sd = E(H, 'relDrag3SpinOf')(S.relDrag), C = E(H, 'relDragCoefficientOf')(S.relDrag) || 1, eps = (S.relDrag.eps !== undefined) ? S.relDrag.eps : (S.params.softening || 0);
      const A0 = scratchOf(S, n), A1 = scratchOf(S, n, { x: o.x, y: o.y, z: o.z, sax: o.sax, say: o.say, saz: o.saz });
      ORIG.inertialDrag3RotTerm(A0, n, C, eps); ORIG.inertialDrag3RotTerm(A1, n, C, eps);
      let cov = 0, smax = 0;
      for (let i = 0; i < n; i++) { const s0 = RF.matVec(R, [A0._rdUX[i], A0._rdUY[i], A0._rdUZ[i]]), s1 = [A1._rdUX[i], A1._rdUY[i], A1._rdUZ[i]]; cov = Math.max(cov, norm(sub(s0, s1))); smax = Math.max(smax, norm(s0)); }
      stat.push({ center: cKind, c, pairMaxRel: ps.max, dKRel: Math.abs(e1.K - e0.K) / Math.abs(e0.K || 1), dURel: Math.abs(e1.U - e0.U) / Math.abs(e0.U || 1),
        LmagRel: Math.abs(norm(l1.L) - norm(l0.L)) / (norm(l0.L) || 1), LbackRel: norm(sub(back, l0.L)) / (norm(l0.L) || 1), LcompRel: norm(sub(l1.L, l0.L)) / (norm(l0.L) || 1),
        LsBackRel: norm(l0.Ls) > 0 ? norm(sub(backS, l0.Ls)) / norm(l0.Ls) : 0, LsCompRel: norm(l0.Ls) > 0 ? norm(sub(l1.Ls, l0.Ls)) / norm(l0.Ls) : 0, Ls: norm(l0.Ls),
        sRotCovRel: smax > 0 ? cov / smax : 0, rotOn: !!(sd && sd.rot) });
    }
    // (b) 走行の共変: 組んだ直後に全粒子を R(中心 = 源 + ずらし)で回した写しを Nb 步 —— R⁻¹ で戻して今の規約の走行と比べる
    uninstallWraps(H);
    const A = buildCase(H, id, cs.patch), B = buildCase(H, id, cs.patch), c = add(centerOf(A.S), [3, -2, 1]);
    applyState(B.S, rotState(B.S, R, c));
    for (let k = 0; k < Nb; k++) { A.S.step(A.dt); B.S.step(B.dt); }
    installWraps(H);
    let dmax = 0, scl = 0;
    for (let i = 0; i < A.S.n; i++) { const xb = RF.rotateAbout(RT, c, [B.S.x[i], B.S.y[i], B.S.z[i]]), xa = [A.S.x[i], A.S.y[i], A.S.z[i]]; dmax = Math.max(dmax, norm(sub(xb, xa))); scl = Math.max(scl, norm(sub(xa, centerOf(A.S)))); }
    const eA = E(H, 'inertialDragEnergy')(A.S), eB = E(H, 'inertialDragEnergy')(B.S), wA = A.S.inertialDragWork || 0, wB = B.S.inertialDragWork || 0;
    rows.push({ key: cs.key, id, n, snapSteps: Nb / 2, stat, run: { steps: Nb, posMaxRel: scl > 0 ? dmax / scl : dmax, dERel: Math.abs(eB.E - eA.E) / Math.abs(eA.E || 1), workDiffRel: Math.abs(wB - wA) / Math.max(Math.abs(wA), 1e-300) } });
  }
  return { rot: { axis: G_ROT.axis, angle: G_ROT.angle }, rows };
}
/** 時間に依る枠 R(t) = R(Ω_f t)・c(t) = c₀ + V_c t の読み替えの恒等式: 走行の軌跡(各步の後の x・v・u)から W′ = (x′ₙ₊₁ − x′ₙ)/h と定義ごとの v′ + u′ の差 */
export const FRAME = { Om: [0.05, -0.03, 0.2], Vc: [0.3, -0.2, 0.1] };
function frameIdentity(traj, dt, c0, moving) {
  const Om = FRAME.Om, Vc = moving ? FRAME.Vc : [0, 0, 0];
  const cAt = (t) => add(c0, scale(Vc, t));
  const out = { relabel: 0, kick: 0, missing: 0, relabelNoCdot: 0, Wmax: 0, steps: 0 };
  for (let k = 0; k + 1 < traj.length; k++) {
    const A = traj[k], B = traj[k + 1];
    if (!B.u) continue;
    const tA = A.t, tB = B.t, tm = 0.5 * (tA + tB), h = tB - tA;
    const RA = RF.rodrigues(scale(Om, tA)), RB = RF.rodrigues(scale(Om, tB)), Rm = RF.rodrigues(scale(Om, tm));
    const f = { R: Rm, Rdot: RF.rdotOf(Om, Rm), c: cAt(tm), cdot: Vc }, f0 = { R: Rm, Rdot: RF.rdotOf(Om, Rm), c: cAt(tm), cdot: [0, 0, 0] };
    for (let i = 0; i < A.x.length; i++) {
      if (!B.free[i]) continue;
      const xA = A.x[i], xB = B.x[i], xm = scale(add(xA, xB), 0.5);
      const Wp = scale(sub(RF.rotateAbout(RB, cAt(tB), xB), RF.rotateAbout(RA, cAt(tA), xA)), 1 / h);
      out.Wmax = Math.max(out.Wmax, norm(Wp));
      for (const def of ['relabel', 'kick', 'missing']) { const q = RF.splitVelocity(def, f, xm, B.v[i], B.u[i]); out[def] = Math.max(out[def], norm(sub(Wp, add(q.v, q.u)))); }
      if (moving) { const q = RF.splitVelocity('relabel', f0, xm, B.v[i], B.u[i]); out.relabelNoCdot = Math.max(out.relabelNoCdot, norm(sub(Wp, add(q.v, q.u)))); }
    }
    out.steps++;
  }
  for (const k of ['relabel', 'kick', 'missing', 'relabelNoCdot']) out[k + 'Rel'] = out.Wmax > 0 ? out[k] / out.Wmax : 0;
  return out;
}
export function partFrame(H, ids, N) {
  const cs = CASES.find((c) => c.key === 'disk'), id = ids[cs.emoji], rows = [];
  for (const level of [1, 2]) {
    const traj = [];
    const rec = (S) => { const n = S.n, f = freeMask(S); traj.push({ t: S.t, free: f, x: Array.from({ length: n }, (_, i) => [S.x[i], S.y[i], S.z[i]]), v: Array.from({ length: n }, (_, i) => [S.vx[i], S.vy[i], S.vz[i]]), u: traj.length ? Array.from({ length: n }, (_, i) => [S._rdUX[i], S._rdUY[i], S._rdUZ[i]]) : null }); };
    uninstallWraps(H);
    const { S, dt: dt0 } = buildCase(H, id, cs.patch), dt = dt0 / level, steps = Math.min(N, 200) * level;
    rec(S);
    for (let k = 0; k < steps; k++) { S.step(dt); rec(S); }
    installWraps(H);
    const c0 = centerOf(S);
    rows.push({ level, dt, steps, fixed: frameIdentity(traj, dt, c0, false), moving: frameIdentity(traj, dt, c0, true) });
  }
  const r1 = rows[0], r2 = rows[1];
  return { frame: FRAME, rows, ratio: { fixed: r1.fixed.relabel / r2.fixed.relabel, moving: r1.moving.relabel / r2.moving.relabel } };
}

/* ───────────────────────── 段 L・D(選択肢の走行と刻み)───────────────────────── */
export const L_OPTS = ['posLinear', 'posOnly', 'posAtt', 'posAttVKick', 'globalRbar'];
export const D_OPTS = ['split', 'evalX1', 'transport', 'midpoint', 'strang'];
/** 選択肢ごとの刻み(h = 1・h/2 = 2・h/4 = 4)—— 刻みの収束は今の規約・剛体・接線の移送で h/4 まで。姿勢(位置は posOnly と同じ)と対照は h だけ */
export const LEVELS = { posLinear: [1, 2, 4], posOnly: [1, 2, 4], transport: [1, 2, 4], posAttVKick: [1, 2], posAtt: [1], globalRbar: [1], split: [1, 2], evalX1: [1, 2], midpoint: [1, 2], strang: [1, 2] };
export function partRuns(H, ids, N, quick) {
  const books = [];
  for (const cs of CASES) {
    const id = ids[cs.emoji], cc = { id, patch: cs.patch };
    const Nb = cs.key === 'spread' ? (quick ? 20 : Math.max(40, Math.floor(N / 4))) : N;
    const levels = cs.key === 'spread' ? [1, 2] : (quick ? [1, 2] : [1, 2, 4]);
    const lvOf = (opt) => (LEVELS[opt] || [1, 2]).filter((k) => levels.includes(k));
    const opts = cs.key === 'ring' ? L_OPTS.concat(D_OPTS) : L_OPTS;
    const runs = {};
    const kickRead = {}, fAcc = {};
    for (const opt of opts) {
      runs[opt] = {};
      for (const lv of lvOf(opt)) {
        const hook = (opt === 'posLinear' && lv === 1) ? chainHooks(kickHook(kickRead), cs.key === 'spread' ? fluctBookHook(H, fAcc, Math.max(5, Math.floor(Nb / 4))) : null) : null;
        const r = runVariant(H, cc, opt, Nb, lv, { onStep: hook });
        runs[opt][lv] = summarizeRun(H, r);
        if (opt === 'posLinear' && lv === 1) runs[opt][lv].free = Array.from(r.free);
      }
    }
    const free = runs.posLinear[1].free;
    // 刻みの収束: 今の規約との最後の位置の差(同じ h)
    const conv = {};
    for (const opt of opts) {
      if (opt === 'posLinear') continue;
      conv[opt] = {};
      for (const lv of levels) if (runs[opt][lv]) conv[opt][lv] = posDiff(runs[opt][lv].final, runs.posLinear[lv].final, free);
    }
    let retro = null;
    if (cs.key === 'ring') {
      retro = {};
      for (const lv of [1, 2]) retro[lv] = summarizeRun(H, runVariant(H, cc, 'posLinear', N, lv, { retro: true }));
      for (const lv of [1, 2]) delete retro[lv].final;
    }
    for (const opt of opts) for (const lv of levels) if (runs[opt][lv]) delete runs[opt][lv].final;
    delete runs.posLinear[1].free;
    books.push({ key: cs.key, id, emoji: cs.emoji, N: Nb, levels, runs, conv, kickRead: kickRead.out || null, retro, fluct: fAcc.rows || null });
  }
  return books;
}
/** 今の規約の走行の各步で、移流を速度へもう一度足す定義(v ← R_i v + Ṙ_i(x − c_i) ≈ v + u_rot —— 二重計上のキック)の一步の帳簿を読む(状態は変えない):
 *  仕事 Σ m (v·u_rot + ½|u_rot|²)・力積 |Σ m u_rot| と、エンジンの引きずりの步の帳簿 |ΔU|(inertialDragDU)。キック v ← R_i v の仕事は 0(回転は |v| を変えない —— 力積とトルクは段 L の posAttVKick の走行) */
function kickHook(acc) {
  const o = { steps: 0, advWork: 0, advWorkAbs: 0, advImpulse: 0, dragWorkAbs: 0 };
  acc.out = o;
  return (S, q) => {
    let aw = 0, ap = [0, 0, 0];
    for (let i = 0; i < S.n; i++) {
      if (!q.free[i]) continue;
      const v = [S.vx[i], S.vy[i], S.vz[i]], u = [q.uRot[0][i], q.uRot[1][i], q.uRot[2][i]], m = S.m[i];
      aw += m * (dot(v, u) + 0.5 * dot(u, u)); ap = add(ap, scale(u, m));
    }
    o.steps++; o.advWork += aw; o.advWorkAbs += Math.abs(aw); o.advImpulse += norm(ap); o.dragWorkAbs += Math.abs(S.inertialDragDU || 0);
  };
}

/* ───────────────────────── 合成の集団(第305便d の器と同じ粒 —— 🍥 の環の粒の写し)───────────────────────── */
const halton = (i, b) => { let f = 1, r = 0; while (i > 0) { f /= b; r += f * (i % b); i = Math.floor(i / b); } return r; };
export const POP = { m: 5, Rsrc: Math.sqrt(5), Om: 0.5, eps: 1, Wbg: 0.125, G: 0.005, soft: 0.5, h: 0.016 };
/** 合成の集団(球・円盤 × N・半径 Rp・軸の傾き・符号〔same/pm〕・軸の方位〔parallel/golden〕)。重力は 🍥 の G 0.005・軟化 0.5(質量は m・中心の天体なし) */
export function popState(geom, N, Rp, tiltDeg, sign, axes = 'parallel') {
  const S = { n: N, coord3d: true, x: F64(N), y: F64(N), z: F64(N), vx: F64(N), vy: F64(N), vz: F64(N), m: F64(N).fill(POP.m), mEff: null, spin: F64(N), radOv: F64(N).fill(POP.Rsrc), R: F64(N).fill(POP.Rsrc),
    pinned: new Uint8Array(N), sax: F64(N), say: F64(N), saz: F64(N), saOn: new Uint8Array(N).fill(1), saOm: F64(N), rotA: F64(N), _amKind: null,
    _rdPairSet: null, _rdPairN: N, relDrag: { law: 'inertial', Wbg: POP.Wbg, eps: POP.eps, pairs: 'all' }, params: { softening: POP.soft, G: POP.G } };
  S.mEff = S.m;
  const th = tiltDeg * Math.PI / 180, ga = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const u = halton(i + 1, 2), v = halton(i + 1, 3), w = halton(i + 1, 5);
    if (geom === 'ball') { const r = Rp * Math.cbrt(u), ct = 2 * v - 1, st = Math.sqrt(1 - ct * ct), ph = 2 * Math.PI * w; S.x[i] = r * st * Math.cos(ph); S.y[i] = r * st * Math.sin(ph); S.z[i] = r * ct; }
    else { const r = Rp * Math.sqrt(u), ph = 2 * Math.PI * v; S.x[i] = r * Math.cos(ph); S.y[i] = r * Math.sin(ph); S.z[i] = 0; }
    const az = axes === 'golden' ? i * ga : 0;
    S.sax[i] = Math.sin(th) * Math.cos(az); S.say[i] = Math.sin(th) * Math.sin(az); S.saz[i] = Math.cos(th);
    S.spin[i] = (sign === 'pm' && (i % 2)) ? -POP.Om : POP.Om;
  }
  return S;
}
/** 回転引きずりの源の項 s_rot(html の関数)・源ごとの分解・連立の行列(html の dfmInertialDrag3Build)と u_rot = (I+L)⁻¹ s_rot */
function rotFieldOf(H, S, C, eps, K) {
  const n = S.n, T = scratchOf(S, n);
  ORIG.inertialDrag3RotTerm(T, n, C, eps, K ? K[0] : undefined, K ? K[1] : undefined, K ? K[2] : undefined);
  const Sg = Object.assign(Object.create(S), { _rdSpinGL: T._rdSpinGL });
  const ps = perSource(H, Sg, n, C, eps, K || [S.x, S.y, S.z]);
  let exact = true; for (let i = 0; i < n && exact; i++) if (!Object.is(ps.s[0][i], T._rdUX[i]) || !Object.is(ps.s[1][i], T._rdUY[i]) || !Object.is(ps.s[2][i], T._rdUZ[i])) exact = false;
  const B = scratchOf(S, n);
  E(H, 'dfmInertialDrag3Build')(B, n, true, C, eps * eps, null, K ? K[0] : undefined, K ? K[1] : undefined, K ? K[2] : undefined);
  const fixed = new Uint8Array(n); for (let i = 0; i < n; i++) fixed[i] = (S.m[i] > 0 && !S.pinned[i]) ? 0 : 1;
  const u = solveRows(B._rdA, B._rdDeg, fixed, n, T._rdUX, T._rdUY, T._rdUZ);
  return { s: [T._rdUX, T._rdUY, T._rdUZ], ps, exact, u, fixed, gl: T._rdSpinGL };
}

/* ───────────────────────── 段 O(源の並び)───────────────────────── */
export function partOrder(H, ids, quick) {
  const rows = [];
  for (const src of ['popBall', 'spread']) {
    let S, C, eps, h0;
    if (src === 'popBall') { S = popState('ball', quick ? 60 : 100, 20, 30, 'same', 'golden'); C = 1 / POP.Wbg; eps = POP.eps; h0 = POP.h; }
    else {
      uninstallWraps(H);
      const b = buildCase(H, ids['🍥'], null); for (let k = 0; k < 20; k++) b.S.step(b.dt);
      installWraps(H);
      S = b.S; C = E(H, 'relDragCoefficientOf')(S.relDrag) || 1; eps = (S.relDrag.eps !== undefined) ? S.relDrag.eps : (S.params.softening || 0); h0 = b.dt;
    }
    const n = S.n, f = rotFieldOf(H, S, C, eps, null);
    const lv = [];
    for (const k of [1, 2, 4]) {
      const h = h0 / k;
      let fr = 0, fs = 0, lin = 0, dm = 0, nr = 0;
      for (let i = 0; i < n; i++) {
        const rec = f.ps.rec[i];
        if (!rec.length || S.pinned[i]) continue;
        const ws = rec.map((q) => q.w), cs = rec.map((q) => [S.x[q.j], S.y[q.j], S.z[q.j]]), x = [S.x[i], S.y[i], S.z[i]];
        const sc = RF.chasles(ws, cs);
        if (!sc) continue;
        nr++;
        const dS = sub(RF.screwStep(sc, h, x), x), dF = sub(RF.orderedProduct(ws, cs, h, x, 'fwd'), x), dR = sub(RF.orderedProduct(ws, cs, h, x, 'rev'), x);
        fr = Math.max(fr, norm(sub(dF, dR))); fs = Math.max(fs, norm(sub(dF, dS))); lin = Math.max(lin, norm(sub(dS, scale([f.s[0][i], f.s[1][i], f.s[2][i]], h)))); dm = Math.max(dm, norm(dS));
      }
      lv.push({ h, receivers: nr, fwdVsRev: fr, fwdVsSum: fs, sumVsLinear: lin, dispMax: dm, fwdVsRevRel: dm > 0 ? fr / dm : 0 });
    }
    // エンジンのベクトル和: 源の並び(全配列)を逆にした写しの s_rot と元の差(丸めだけ)
    const rev = (a) => { const b = new a.constructor(a.length); for (let i = 0; i < a.length; i++) b[i] = a[a.length - 1 - i]; return b; };
    const Sr = Object.create(S);
    for (const k of ['x', 'y', 'z', 'm', 'spin', 'radOv', 'R', 'pinned', 'sax', 'say', 'saz', 'saOn']) Sr[k] = rev(S[k].subarray(0, n));
    Sr._rdPairSet = null;
    const Tr = scratchOf(Sr, n); ORIG.inertialDrag3RotTerm(Tr, n, C, eps);
    let rd = 0, sm = 0;
    for (let i = 0; i < n; i++) { const j = n - 1 - i; rd = Math.max(rd, hypot3(Tr._rdUX[j] - f.s[0][i], Tr._rdUY[j] - f.s[1][i], Tr._rdUZ[j] - f.s[2][i])); sm = Math.max(sm, hypot3(f.s[0][i], f.s[1][i], f.s[2][i])); }
    const nSrc = (() => { let k = 0; for (let j = 0; j < n; j++) if (S.spin[j] !== 0 && S.radOv[j] > 0 && S.m[j] > 0) k++; return k; })();
    rows.push({ src, n, sources: nSrc, decompExact: f.exact, levels: lv, ratioRev: lv[0].fwdVsRev / lv[1].fwdVsRev, ratioRev24: lv[1].fwdVsRev / lv[2].fwdVsRev, ratioSum: lv[0].fwdVsSum / lv[1].fwdVsSum,
      ratioLin: lv[0].sumVsLinear / lv[1].sumVsLinear, engineRevRel: sm > 0 ? rd / sm : 0 });
  }
  return { rows };
}

/* ───────────────────────── 段 F(揺らぎの仕事)───────────────────────── */
/** u を半径の帯(nb 帯・等数)の局所の枠で滑らかな流れ ū(帯の中の一次の当てはめ —— 平均場の分)と残り u′(揺らぎの分)に分け、応力の候補 Π = Σ m u′u′/V を作る。
 *  geom: 'ball'(球の動径 r̂・t̂ = â × r̂・ŵ = r̂ × t̂)/ 'disk'(軸 â のまわりの円柱の ρ̂・t̂ = â × ρ̂・ŵ = â)。原点 c・軸 â */
export function fluctSplit(S, U, mask, geom, axis, c, Mcen = 0, nb = 6) {
  const n = S.n, rows = [];
  for (let i = 0; i < n; i++) {
    if (mask && !mask[i]) continue;
    const d = [S.x[i] - c[0], S.y[i] - c[1], S.z[i] - c[2]];
    let rv = geom === 'ball' ? d : sub(d, scale(axis, dot(axis, d)));
    const r = norm(rv); if (!(r > 0)) continue;
    const eR = scale(rv, 1 / r);
    let eT = cross(axis, eR); const tn = norm(eT); eT = tn > 0 ? scale(eT, 1 / tn) : [0, 0, 0];
    const eW = geom === 'ball' ? cross(eR, eT) : axis;
    const u = [U[0][i], U[1][i], U[2][i]];
    rows.push({ i, r, eR, eT, eW, m: S.m[i], q: [dot(u, eR), dot(u, eT), dot(u, eW)] });
  }
  rows.sort((a, b) => a.r - b.r);
  const N = rows.length, ub = [F64(n), F64(n), F64(n)], uf = [F64(n), F64(n), F64(n)], bands = [];
  for (let b = 0; b < nb; b++) {
    const s = rows.slice(Math.floor(b * N / nb), Math.floor((b + 1) * N / nb)), k = s.length;
    if (!k) continue;
    const rm = s.reduce((z, p) => z + p.r, 0) / k;
    const fit = [0, 1, 2].map((cIdx) => { const mq = s.reduce((z, p) => z + p.q[cIdx], 0) / k; let sxx = 0, sxy = 0; for (const p of s) { sxx += (p.r - rm) ** 2; sxy += (p.r - rm) * (p.q[cIdx] - mq); } return { m: mq, b: sxx > 0 ? sxy / sxx : 0 }; });
    let Prr = 0, Ptt = 0, Pww = 0, Prt = 0, mass = 0, Kfl = 0, Kmean = 0;
    for (const p of s) {
      const sm = fit.map((f) => f.m + f.b * (p.r - rm)), fl = [p.q[0] - sm[0], p.q[1] - sm[1], p.q[2] - sm[2]];
      const vb = add(add(scale(p.eR, sm[0]), scale(p.eT, sm[1])), scale(p.eW, sm[2]));
      for (let cc = 0; cc < 3; cc++) { ub[cc][p.i] = vb[cc]; uf[cc][p.i] = U[cc][p.i] - vb[cc]; }
      Prr += p.m * fl[0] * fl[0]; Ptt += p.m * fl[1] * fl[1]; Pww += p.m * fl[2] * fl[2]; Prt += p.m * fl[0] * fl[1]; mass += p.m;
      Kfl += 0.5 * p.m * (fl[0] ** 2 + fl[1] ** 2 + fl[2] ** 2); Kmean += 0.5 * p.m * (sm[0] ** 2 + sm[1] ** 2 + sm[2] ** 2);
    }
    const r0 = b === 0 ? 0 : s[0].r, r1 = s[k - 1].r;
    const vol = geom === 'ball' ? 4 / 3 * Math.PI * (r1 ** 3 - r0 ** 3) : Math.PI * (r1 * r1 - r0 * r0);
    const V = vol > 0 ? vol : 1;
    bands.push({ k, rMid: rm, rIn: r0, rOut: r1, rho: mass / V, Prr: Prr / V, Ptt: Ptt / V, Pww: Pww / V, Prt: Prt / V, P: (Prr + Ptt + Pww) / (3 * V), flowT: fit[1].m, Kfl, Kmean });
  }
  // 力の候補(読み口 —— 足さない): 外向き a = −(1/ρ̄)∂Π_rr/∂r − 幾何の項(球 (2Π_rr − Π_tt − Π_ww)/(ρ̄ r)・円柱 (Π_rr − Π_tt)/(ρ̄ r))と、同じ半径の重力 G M(<r)/r²
  let aMax = -Infinity, aAt = null, gAt = null, aAbs = 0;
  for (let b = 0; b + 1 < bands.length; b++) {
    const p = bands[b], q = bands[b + 1], rb = 0.5 * (p.rho + q.rho), dr = q.rMid - p.rMid, rr = 0.5 * (p.rMid + q.rMid);
    if (!(dr > 0) || !(rb > 0)) continue;
    const Prr = 0.5 * (p.Prr + q.Prr), Ptt = 0.5 * (p.Ptt + q.Ptt), Pww = 0.5 * (p.Pww + q.Pww);
    const geo = geom === 'ball' ? (2 * Prr - Ptt - Pww) / (rb * rr) : (Prr - Ptt) / (rb * rr);
    const a = -(q.Prr - p.Prr) / (rb * dr) + geo;
    aAbs = Math.max(aAbs, Math.abs(a));
    if (a > aMax) { aMax = a; aAt = rr; }
  }
  if (aAt !== null) { let Min = Mcen; for (const p of rows) if (p.r < aAt) Min += p.m; gAt = S.params.G * Min / (aAt * aAt); }
  return { N, ubar: ub, ufl: uf, bands, aOutMax: aMax, aOutAt: aAt, gAt, aOverG: gAt > 0 ? aMax / gAt : null, aAbsMax: aAbs,
    Kfl: bands.reduce((z, b) => z + b.Kfl, 0), Kmean: bands.reduce((z, b) => z + b.Kmean, 0) };
}
/** 帳簿(html の inertialDragSemicWork —— エンジンの semic の帳簿と同じ式 −h Σ m a_N(x₀)·u)で u・ū・u′ の仕事 */
function workOf(H, S, n, h, K, U) {
  const T = Object.assign(Object.create(S), { _rdUX: U[0], _rdUY: U[1], _rdUZ: U[2] });
  return E(H, 'inertialDragSemicWork')(T, n, h, K[0], K[1], K[2]);
}
function momentumOf(S, U, mask) { let p = [0, 0, 0], a = 0; for (let i = 0; i < S.n; i++) { if (mask && !mask[i]) continue; const u = [U[0][i], U[1][i], U[2][i]]; p = add(p, scale(u, S.m[i])); a += S.m[i] * norm(u); } return { P: norm(p), absSum: a }; }
function fluctRow(H, S, U, mask, geom, axis, c, h, K, Mcen) {
  const n = S.n, q = fluctSplit(S, U, mask, geom, axis, c, Mcen);
  const Wt = workOf(H, S, n, h, K, U), Wm = workOf(H, S, n, h, K, q.ubar), Wf = workOf(H, S, n, h, K, q.ufl);
  const pt = momentumOf(S, U, mask), pm = momentumOf(S, q.ubar, mask), pf = momentumOf(S, q.ufl, mask);
  return { N: q.N, work: { rot: Wt, mean: Wm, fluct: Wf, fluctFrac: Wt !== 0 ? Wf / Wt : null, additive: Math.abs(Wm + Wf - Wt) / Math.max(Math.abs(Wt), Math.abs(Wm), Math.abs(Wf), 1e-300) },
    momentum: { rotRel: pt.absSum > 0 ? pt.P / pt.absSum : 0, meanRel: pt.absSum > 0 ? pm.P / pt.absSum : 0, fluctRel: pt.absSum > 0 ? pf.P / pt.absSum : 0 },
    second: { Kfl: q.Kfl, Kmean: q.Kmean, flRatio: (q.Kfl + q.Kmean) > 0 ? q.Kfl / (q.Kfl + q.Kmean) : 0 },
    stress: { aOutMax: q.aOutMax, aOutAt: q.aOutAt, gAt: q.gAt, aOverG: q.aOverG, aAbsMax: q.aAbsMax, bands: q.bands.map((b) => ({ rMid: b.rMid, rho: b.rho, P: b.P, Prr: b.Prr, Ptt: b.Ptt, Pww: b.Pww, Prt: b.Prt, flowT: b.flowT })) } };
}
export function partFluct(H, quick, bookSnaps) {
  const Ns = quick ? [100, 200] : [100, 200, 400], rows = [];
  const cfgs = [];
  for (const geom of ['ball', 'disk']) { for (const N of Ns) cfgs.push({ geom, N, sign: 'same' }); cfgs.push({ geom, N: 200, sign: 'pm' }); }
  for (const c of cfgs) {
    const S = popState(c.geom, c.N, 20, 30, c.sign, 'parallel'), n = S.n, f = rotFieldOf(H, S, 1 / POP.Wbg, POP.eps, null);
    let sx = 0, sy = 0, sz = 0; for (let j = 0; j < n; j++) { const w = S.m[j] * S.spin[j]; sx += w * S.sax[j]; sy += w * S.say[j]; sz += w * S.saz[j]; }
    const an = hypot3(sx, sy, sz), axis = an > 0 ? [sx / an, sy / an, sz / an] : [Math.sin(Math.PI / 6), 0, Math.cos(Math.PI / 6)];
    const r = fluctRow(H, S, f.u, null, c.geom, axis, [0, 0, 0], POP.h, [S.x, S.y, S.z], 0);
    rows.push({ ...c, decompExact: f.exact, ...r });
  }
  return { pop: POP, rows, book: bookSnaps || null };
}
/** 🍥 の写しの走行の中の揺らぎの仕事(今の規約の走行 —— 核の位置 K・この步の u_rot と並進の分の u)。円盤の面の法線 ẑ のまわりの円柱の帯 */
function fluctBookHook(H, acc, every) {
  acc.rows = [];
  let k = 0;
  return (S, q) => {
    k++;
    if (k % every !== 1) return;
    const n = S.n, Kp = { n, x: q.K[0], y: q.K[1], z: q.K[2], m: S.m, params: S.params };
    let M0 = 0; for (let i = 0; i < n; i++) if (S.pinned[i]) M0 += S.m[i];
    const r = fluctRow(H, Object.assign(Object.create(S), Kp), q.uRot, q.free, 'disk', [0, 0, 1], [0, 0, 0], q.dt, q.K, M0);
    const uT = [0, 1, 2].map((c) => { const a = F64(n); const src = [S._rdUX, S._rdUY, S._rdUZ][c]; for (let i = 0; i < n; i++) a[i] = src[i] - q.uRot[c][i]; return a; });
    r.work.trans = workOf(H, S, n, q.dt, q.K, uT);
    r.work.engineDU = S.inertialDragDU;
    delete r.stress.bands;
    acc.rows.push({ step: k, ...r });
  };
}
const chainHooks = (...hs) => { const a = hs.filter(Boolean); return a.length ? (S, q) => { for (const h of a) h(S, q); } : null; };

/* ───────────────────────── 表(PHYSICS の行)と門 ───────────────────────── */
const f3 = (v) => (v === null || v === undefined || !Number.isFinite(v)) ? '—' : (v === 0 ? '0' : (Math.abs(v) >= 1e-3 && Math.abs(v) < 1e4 ? String(Number(v.toPrecision(4))) : v.toExponential(2)));
export const fmtNum = f3;
const OPT_JA = { globalRbar: '対照: 全受け手を同じ R̄(一つの座標回転)', posLinear: '今の規約(位置・線形)', posOnly: '位置だけ(剛体)', posAtt: '位置 + 姿勢', posAttVKick: '位置 + 姿勢 + v ← R_i v(キック)', split: 'split の写し', evalX1: '移送の位置で評価', transport: '接線を移送の位置へ運ぶ', midpoint: '中点で評価', strang: '対称な分割(剛体の半分ずつ・速度は回さない)' };
const bookOf = (J, k) => J.books.find((b) => b.key === k);
export function physicsTables(J) {
  const L = [];
  // 大域の R
  L.push('| 写し | 中心 | 粒子間距離の相対の変化の最大 | ΔK/K | ΔU/U | (|L′| − |L|)/|L| | R⁻¹ で戻した L の差 | 成分の回り |L′ − L|/|L| | 自転: R⁻¹ で戻した差 / 成分の回り | s_rot の共変 |');
  L.push('|---|---|---|---|---|---|---|---|---|---|');
  for (const r of J.global.rows) for (const s of r.stat) L.push(`| ${CASES.find((c) => c.key === r.key).emoji} ${r.key} | ${s.center === 'source' ? '源' : '源 + (3, −2, 1)'} | ${f3(s.pairMaxRel)} | ${f3(s.dKRel)} | ${f3(s.dURel)} | ${f3(s.LmagRel)} | ${f3(s.LbackRel)} | ${f3(s.LcompRel)} | ${s.Ls > 0 ? f3(s.LsBackRel) + ' / ' + f3(s.LsCompRel) : '自転なし'} | ${f3(s.sRotCovRel)} |`);
  L.push('');
  L.push('| 写し | 步 | R⁻¹ で戻した位置の差の最大(相対) | K + U の差(相対) | 帳簿 W の差(相対) |');
  L.push('|---|---|---|---|---|');
  for (const r of J.global.rows) L.push(`| ${CASES.find((c) => c.key === r.key).emoji} ${r.key} | ${r.run.steps} | ${f3(r.run.posMaxRel)} | ${f3(r.run.dERel)} | ${f3(r.run.workDiffRel)} |`);
  L.push('');
  // 読み替えの恒等式
  L.push('| 定義 | 中心 | W′ − (v′ + u′) の最大(相対)h | h/2 | 比 |');
  L.push('|---|---|---|---|---|');
  const fr = J.frame.rows;
  for (const [def, lab] of [['relabel', '読み替え'], ['kick', '新しいキック'], ['missing', '移流なし']]) {
    L.push(`| ${lab}(${def}) | 止まる | ${f3(fr[0].fixed[def + 'Rel'])} | ${f3(fr[1].fixed[def + 'Rel'])} | ${f3(fr[0].fixed[def + 'Rel'] / fr[1].fixed[def + 'Rel'])} |`);
    L.push(`| ${lab}(${def}) | 動く | ${f3(fr[0].moving[def + 'Rel'])} | ${f3(fr[1].moving[def + 'Rel'])} | ${f3(fr[0].moving[def + 'Rel'] / fr[1].moving[def + 'Rel'])} |`);
  }
  L.push(`| 読み替え(ċ − R ċ を落とす) | 動く | ${f3(fr[0].moving.relabelNoCdotRel)} | ${f3(fr[1].moving.relabelNoCdotRel)} | ${f3(fr[0].moving.relabelNoCdotRel / fr[1].moving.relabelNoCdotRel)} |`);
  L.push('');
  // 受け手ごとの R_i の帳簿(h)
  L.push('| 写し | 選択肢 | ⟨|Φ|⟩ [rad] | ΔL(回転の変位)/|L₀| | ΔL(キック)/|L₀| | 力積 |ΔP|/Σm|v| | ΔK(キック) | ΔL_spin/|L_s0| | R̄ で戻した: 成分の回り / 残り(/|L₀|) | ΔU(回転の変位)/|U₀| | 粒子間距離の相対 rms/步 | 軸からの距離 ⟨ΣΔρ⟩(回転の分) | 姿勢の捩れ ⟨|·|⟩ / 表せない傾きの受け手 | 受け手の枠で読んだ L′ − L(/|L₀|) |');
  L.push('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|');
  for (const b of J.books) for (const opt of L_OPTS) {
    const r = b.runs[opt] && b.runs[opt][1]; if (!r) continue;
    L.push(`| ${b.emoji} ${b.key} | ${OPT_JA[opt]} | ${f3(r.phiAbsMean)} | ${f3(r.dLposRel)} | ${f3(r.dLkickRel)} | ${f3(r.dPkickRel)} | ${f3(r.dKkick)} | ${f3(r.dLspinRel)} | ${f3(r.rotPartRel)} / ${f3(r.torqueRel)} | ${f3(r.dURel)} | ${f3(r.pairRmsPerStep)} | ${opt === 'globalRbar' ? '—' : f3(r.drhoRotMean)} | ${opt === 'posAtt' || opt === 'posAttVKick' ? f3(r.twistAbsMean) + ' / ' + r.swingLostN : '—'} | ${opt === 'posAtt' ? f3(r.relabelReadRel) : '—'} |`);
  }
  L.push('');
  L.push('| 写し | 步 | 移流を速度へもう一度足す定義の仕事 Σ|Σ m(v·u + ½|u|²)| | 同 力積 Σ|Σ m u| | エンジンの帳簿 Σ|ΔU| | 仕事の比 |');
  L.push('|---|---|---|---|---|---|');
  for (const b of J.books) { const k = b.kickRead; if (!k) continue; L.push(`| ${b.emoji} ${b.key} | ${k.steps} | ${f3(k.advWorkAbs)} | ${f3(k.advImpulse)} | ${f3(k.dragWorkAbs)} | ${f3(k.dragWorkAbs > 0 ? k.advWorkAbs / k.dragWorkAbs : NaN)} |`); }
  L.push('');
  // 刻みの収束
  L.push('| 写し | 選択肢 | 今の規約との最後の位置の差 rms h / h/2 / h/4 | 比 | ⟨|Φ|⟩ h / h/2 / h/4 | 軸からの距離 ⟨ΣΔρ⟩(回転の分)h / h/2 / h/4 | 比 |');
  L.push('|---|---|---|---|---|---|---|');
  for (const b of J.books) for (const opt of Object.keys(b.runs)) {
    if (opt === 'posAtt' || opt === 'globalRbar') continue;
    const lv = b.levels, rr = lv.map((k) => b.runs[opt][k]), cv = opt === 'posLinear' ? null : lv.map((k) => b.conv[opt][k]);
    const cvs = cv ? cv.map((c) => (c ? f3(c.rms) : '—')).join(' / ') : '0(基準)', cr = cv && cv[1] && cv[1].rms > 0 ? f3(cv[0].rms / cv[1].rms) : '—';
    const dr = rr.map((r) => (r ? f3(r.drhoRotMean) : '—')).join(' / '), drr = rr[1] && rr[1].drhoRotMean !== 0 ? f3(rr[0].drhoRotMean / rr[1].drhoRotMean) : '—';
    L.push(`| ${b.emoji} ${b.key} | ${OPT_JA[opt]} | ${cvs} | ${cr} | ${rr.map((r) => (r ? f3(r.phiAbsMean) : '—')).join(' / ')} | ${dr} | ${drr} |`);
  }
  L.push('');
  // 🍩 の遅れ
  const ring = bookOf(J, 'ring'), e = ring.runs.posLinear, fv = (r, k) => (r && Number.isFinite(r[k]) ? f3(r[k]) : '—');
  L.push('| 🍩 の候補 | 外向き ⟨ΣΔρ⟩(回転の分)h / h/2 / h/4 | 比 | 一次の動径(遅れ)/ 二次 h | 今の規約に対する比 h |');
  L.push('|---|---|---|---|---|');
  for (const opt of ['posLinear'].concat(D_OPTS, ['posOnly'])) {
    const rr = ring.levels.map((k) => ring.runs[opt][k]);
    L.push(`| ${OPT_JA[opt]} | ${rr.map((r) => fv(r, 'drhoRotMean')).join(' / ')} | ${rr[1].drhoRotMean !== 0 ? f3(rr[0].drhoRotMean / rr[1].drhoRotMean) : '—'} | ${f3(rr[0].lag1Mean - rr[0].drhoResMean)} / ${f3(rr[0].e2Mean)} | ${f3(rr[0].drhoRotMean / e[1].drhoRotMean)} |`);
  }
  L.push('');
  L.push('| 🍩 の原因の確かめ | h | h/2 |');
  L.push('|---|---|---|');
  L.push(`| 今の規約: 移送の位置での動径の一次 ⟨Σ d·r̂(x₁)⟩ | ${f3(e[1].lag1Mean)} | ${f3(e[2].lag1Mean)} |`);
  L.push(`| 公転で進んだ角の予言 ⟨Σ |d_t| sin Δφ_orb⟩ | ${f3(e[1].lagPredMean)} | ${f3(e[2].lagPredMean)} |`);
  L.push(`| 核の位置での動径の一次 ⟨Σ d·r̂(x₀)⟩ | ${f3(e[1].lagKMean)} | ${f3(e[2].lagKMean)} |`);
  L.push(`| 環の向きを逆にした写し: 移送の位置での動径の一次 | ${f3(ring.retro[1].lag1Mean)} | ${f3(ring.retro[2].lag1Mean)} |`);
  L.push('');
  // 源の並び
  L.push('| 集団 | 源 | 受け手 | 前向き − 逆向き(相対)h / h/2 / h/4 | 比 | 前向き − ベクトル和 の比 | ベクトル和 − 線形の步 の比 | エンジンの源の並びを逆にした s_rot の差 |');
  L.push('|---|---|---|---|---|---|---|---|');
  for (const r of J.order.rows) L.push(`| ${r.src === 'popBall' ? '合成の球(様々な軸)' : '🍥 spread'} | ${r.sources} | ${r.levels[0].receivers} | ${r.levels.map((l) => f3(l.fwdVsRevRel)).join(' / ')} | ${f3(r.ratioRev)} | ${f3(r.ratioSum)} | ${f3(r.ratioLin)} | ${f3(r.engineRevRel)} |`);
  L.push('');
  // 揺らぎの仕事
  L.push('| 集団 | N | 符号 | 仕事 W(u_rot) | 平均の分 W̄ | 揺らぎの分 W′ | W′/W | |Σmu|/Σm|u| 全 / 平均 / 揺らぎ | ½Σm|u′|² の割合 | 応力の候補 外向きの最大 / 重力の比 |');
  L.push('|---|---|---|---|---|---|---|---|---|---|');
  for (const r of J.fluct.rows) L.push(`| ${r.geom} | ${r.N} | ${r.sign === 'pm' ? '±Ω' : '+Ω'} | ${f3(r.work.rot)} | ${f3(r.work.mean)} | ${f3(r.work.fluct)} | ${f3(r.work.fluctFrac)} | ${f3(r.momentum.rotRel)} / ${f3(r.momentum.meanRel)} / ${f3(r.momentum.fluctRel)} | ${f3(r.second.flRatio)} | ${f3(r.stress.aOutMax)} / ${f3(r.stress.aOverG)} |`);
  const sp = bookOf(J, 'spread');
  if (sp && sp.fluct) for (const r of sp.fluct) L.push(`| 🍥 の写し(步 ${r.step}) | ${r.N} | +Ω | ${f3(r.work.rot)} | ${f3(r.work.mean)} | ${f3(r.work.fluct)} | ${f3(r.work.fluctFrac)} | ${f3(r.momentum.rotRel)} / ${f3(r.momentum.meanRel)} / ${f3(r.momentum.fluctRel)} | ${f3(r.second.flRatio)} | ${f3(r.stress.aOutMax)} / ${f3(r.stress.aOverG)} |`);
  return L.join('\n');
}
/** 正本から作る数の文字列(PHYSICS の本文に入っていること —— QA が照合) */
export function docNumbers(J) {
  const ring = bookOf(J, 'ring'), disk = bookOf(J, 'disk'), e = ring.runs.posLinear, pop = J.order.rows.find((r) => r.src === 'popBall');
  const out = [f3(e[1].drhoRotMean), f3(e[1].drhoRotMean / e[2].drhoRotMean), f3(e[1].lagPredMean), f3(ring.runs.transport[1].drhoRotMean), f3(ring.runs.midpoint[1].drhoRotMean / e[1].drhoRotMean),
    f3(pop.ratioRev), f3(J.frame.ratio.fixed), f3(disk.runs.posAttVKick[1].dPkickRel), f3(disk.conv.posOnly[1].rms / disk.conv.posOnly[2].rms)];
  return out.filter((s) => s !== '—' && s !== '0');
}
export function gatesOf(J) {
  const allRuns = []; for (const b of J.books) { for (const o of Object.keys(b.runs)) for (const k of Object.keys(b.runs[o])) allRuns.push(b.runs[o][k]); if (b.retro) for (const k of Object.keys(b.retro)) allRuns.push(b.retro[k]); }
  const ring = bookOf(J, 'ring'), e = ring.runs.posLinear, fr = J.frame;
  const stats = J.global.rows.flatMap((r) => r.stat);
  const g = {
    passThrough: J.pass.allSame === true,
    velocityUntouched: allRuns.every((r) => r.vUntouched === r.engineSteps && r.engineSteps > 0),
    decompExact: allRuns.every((r) => r.decompExact === r.rotSteps && r.rotSteps > 0) && J.order.rows.every((r) => r.decompExact) && J.fluct.rows.every((r) => r.decompExact),
    globalInvariant: stats.every((s) => s.pairMaxRel < 1e-12 && s.dKRel < 1e-12 && s.dURel < 1e-12 && s.LmagRel < 1e-12 && s.LbackRel < 1e-12 && s.LcompRel > 1e-3 && s.LsBackRel < 1e-12),
    rotTermCovariant: stats.every((s) => s.sRotCovRel < 1e-12),
    runCovariant: J.global.rows.every((r) => r.run.posMaxRel < 1e-6),
    relabelIdentity: fr.ratio.fixed > 3 && fr.ratio.fixed < 5 && fr.ratio.moving > 3 && fr.ratio.moving < 5 && fr.rows.every((r) => r.fixed.kickRel > 0.05 && r.fixed.missingRel > 0.05 && r.moving.kickRel > 0.05 && r.moving.relabelNoCdotRel > 100 * r.moving.relabelRel && r.fixed.relabelRel < 1e-2),
    rigidKeepsAxisDistance: J.books.filter((b) => b.key !== 'spread').every((b) => Math.abs(b.runs.posOnly[1].drhoRotMean) < 1e-3 * Math.abs(b.runs.posLinear[1].drhoRotMean)),
    globalControlRigid: J.books.every((b) => { const r = b.runs.globalRbar[1]; return r.pairMax < 1e-12 && Math.abs(r.dURel) < 1e-12; }) && J.books.filter((b) => b.key !== 'ring').every((b) => b.runs.posOnly[1].pairMax > 1e-9),
    symmetricHalves: ['midpoint', 'strang'].every((o) => { const q = ring.runs[o][1].drhoRotMean / e[1].drhoRotMean; return q > 0.4 && q < 0.6; }),
    lagFirstOrder: e[1].drhoRotMean > 0 && e[1].drhoRotMean / e[2].drhoRotMean > 1.8 && e[1].drhoRotMean / e[2].drhoRotMean < 2.2,
    lagCause: Math.abs(e[1].lag1Mean - e[1].lagPredMean) < 0.05 * Math.abs(e[1].lag1Mean) && ring.retro[1].lag1Mean < 0 && Math.abs(e[1].lagKMean) < 1e-3 * Math.abs(e[1].lag1Mean),
    fixesRemoveLag: ['split', 'evalX1', 'transport', 'posOnly'].every((o) => Math.abs(ring.runs[o][1].drhoRotMean) < 0.05 * Math.abs(e[1].drhoRotMean)),
    optionsConverge: ['disk', 'tilt', 'ring'].every((k) => { const c = bookOf(J, k).conv.posOnly; return c[1].rms / c[2].rms > 1.6 && c[1].rms / c[2].rms < 2.6; }),
    kickNoWork: J.books.every((b) => { const r = b.runs.posAttVKick[1]; return Math.abs(r.dKkick) < 1e-9 * Math.max(1, Math.abs(r.E0)) && r.dPkickRel > 0; }),
    orderSecond: J.order.rows.every((r) => r.engineRevRel < 1e-12) && (() => { const p = J.order.rows.find((r) => r.src === 'popBall'); return p.ratioRev > 3.5 && p.ratioRev < 4.5 && p.ratioLin > 3.5 && p.ratioLin < 4.5; })(),
    fluctAdditive: J.fluct.rows.every((r) => r.work.additive < 1e-9),
  };
  return g;
}
const THERMO_NOT = ['熱力学を導いた', '斥力を導いた', '回転引きずりが座標変換であることを示した', 'エンジンを直した'];

export function runAll(H, o = {}) {
  const quick = !!o.quick, N = o.N || (quick ? 120 : 400);
  installWraps(H);
  const ids = idsFromDecl(H.HP);
  for (const c of CASES) if (!ids[c.emoji]) throw new Error('宣言から本が見つからない: ' + c.emoji);
  const t = {};
  let t0 = Date.now();
  const pass = partPass(H, ids, quick ? 30 : 80); t.pass = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now();
  const global = partGlobal(H, ids, quick ? 60 : Math.min(N, 400)); t.global = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now();
  const frame = partFrame(H, ids, quick ? 60 : 200); t.frame = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now();
  const order = partOrder(H, ids, quick); t.order = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now();
  const fluct = partFluct(H, quick); t.fluct = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now();
  const books = partRuns(H, ids, N, quick); t.books = { wallSec: (Date.now() - t0) / 1000 };
  const J = { steps: N, quick, ids: CASES.map((c) => ({ key: c.key, emoji: c.emoji, id: ids[c.emoji], patch: c.patch })), options: RF.OPTIONS, velocityDefs: RF.VELOCITY_DEFS, pass, global, frame, order, fluct, books };
  J.gates = gatesOf(J);
  J.ok = Object.values(J.gates).every(Boolean);
  J.timing = t;
  return J;
}

export async function main() {
  const TARGET = process.env.W306D_TARGET || 'beta/index.html';
  const OUT = process.env.W306D_OUT || path.join(ROOT, 'tests', 'out', 'rotframe-w306d.json');
  const quick = process.env.W306D_QUICK === '1', N = Number(process.env.W306D_N) || 0;
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now();
  const W281A_SCOPE = w281aScopeStamp(html, REGEN_SCOPE);
  const H = loadHtmlHeadless(html);
  const R = runAll(H, { quick, N: N || undefined });
  const out = { version: HARNESS_VERSION, libVersion: RF.LIB_VERSION, generator: 'tests/exp-w306d-rotframe.mjs', target: TARGET,
    targetSha256: crypto.createHash('sha256').update(fs.readFileSync(html)).digest('hex'),
    ruling: '原仮定者の裁定(第96報)後半(回転引きずり = 移動と回転の両方に効く座標変換)・決断事項 AN338 ①③④(大域の R と受け手ごとの R_i・x′ = c + R(x − c)・W′ = RW + Ṙ(x − c)・v′ = Rv なら u′ = Ru + Ṙ(x − c)・揺らぎの仕事・🍩 の步の順序)・統括の検証項目 R207',
    spinVersion: H.evalExpr('REL_DRAG_SPIN3_VERSION'), ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w306d-rotframe.mjs', 'tests/lib-w306d-rotframe.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第306便d', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION,
    engine: 'Node の headless(tests/lib-w279b-headless.mjs の loadHtmlHeadless —— html の本文をそのまま実行・1 プロセス。html の関数を器の process の中で包む —— 素通りは段 P)',
    notClaim: THERMO_NOT });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s', JSON.stringify(out.timing));
}
if (IS_MAIN) await main();
