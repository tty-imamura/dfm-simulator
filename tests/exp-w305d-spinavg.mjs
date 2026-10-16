// 第305便d(原仮定者の裁定(第96報)後半「慣性移動速度による並進引きずりに対して、慣性自転速度による回転引きずりと軸引きずりは複雑である。回転引きずりは、
// 移動と回転の両方に効く座標変換である。軸引きずりは、引きずり元による様々な軸の回転を行う」「多粒子の軸引きずりを近似する事で、平均的な自転速度を導ける。
// 多粒子の回転引きずりを近似する事で、平均的な斥力を導ける。これらは熱力学と類似する」・統括の検証項目 R202): **回転引きずり・軸引きずりと多粒子の平均の診断の器**。
//
// Node だけ(対象 html の inline script を tests/lib-w279b-headless.mjs の loadHtmlHeadless で読み、html の関数 inertialDrag3RotTerm・inertialDrag3AxialOmega・
// inertialDrag3AxialApply・dfmInertialDrag3Build・inertialSpinMoment・inertialDragNormOf と本の入口 validatePreset・coord3d.makeSim・build・step をそのまま呼ぶ。
// 引きずりの式の写しを持たない)。**エンジンの式・本の宣言・html は変えない** —— 器の process の中で html の関数を包み(包みは素通り —— 段 P がビット同一を確かめる)、
// 步ごとの写しの状態(Object.create の写しに専用の配列)で同じ関数を呼び直して数える。**力として何も足さない**(平均・二次モーメント・斥力の候補は読み口の値)。
//
// ■ 写した本(spinDrag を宣言した三次元の本 5 本 —— 宣言は変えず、器の中で写しを組む)
//   disk 🔩 chainDiskToy3d / tilt 🪛 chainDiskToy3dTilt(axial on・κ 4)/ spread 🍥 chainSpreadToy3d / spreadAx 🍥 の写しに軸引きずり(axial on・κ 4 —— 器の中だけ)/
//   burst 🧨 chainBurstShell3d / ring 🍩 saturnRingInertial3d の一押しの対照(水星の三次元のフィット値の移送 W_bg 0.02211 —— 本の宣言は gain 0 で引きずりが走らない: ring0)
//
// ■ 何を測るか
//   C(契約 —— 第96報の前半の規則の回転版): 步ごとに (1) 引きずりの步の前後で慣性自転 S.spin がビットで同じ (2) 軸引きずりの無い本は姿勢 rotA を引きずりの步が触らない・
//     軸引きずりの本は慣性の角 rotAIn を触らない (3) 並進の自己の分子 A_ii = 0 (4) 回転引きずりの源の数 = 慣性自転の数(引きずりで回った受け手は源にならない)
//     (5) 回転引きずりの項と軸引きずりの角速度を写しの状態で呼び直してビット同一(記憶を持たない —— 毎步 S.spin から作り直す) (6) 二重計上の写し(受けた引きずり軸回転を
//     次の步の源の Ω へ足した変種)との相対差 (7) 孤立した源(他の質量を 0 にした写し)は自分の回転引きずり・軸引きずり・行を作らない。
//   X(座標変換): 回転引きずりの u_rot = (I+L)⁻¹ s_rot(エンジンの步の行列で器が解く)を源の軸のまわりの角 Δφ・動径の一次 δr・線形の步の二次の外向き
//     (|r⊥+δ⊥| − |r⊥| − δr ≈ δt²/(2ρ))に分け、h と h/2 で比べる。剛体の座標変換なら位置・速度・姿勢を同じ角で運ぶ —— エンジンは位置だけ(姿勢・速度は回さない)。
//     有限回転の順序: 軸引きずりの源の並びを逆にした写し(エンジンの和)と、源ごとの有限回転の順序付きの積(前向き・逆向き)とベクトル和の 1 回転の差(h と h/2)。
//   M(多粒子の平均 —— 本便の主の数): 本の写しの各步の受け手ごとの軸引きずり ω_i(ν を掛けた —— 軸引きずりを宣言しない本は κ_ref = 4 の読み口)・回転引きずりの s_rot・u_rot の
//     平均ベクトルと二次モーメント(直交座標の共分散と、源の軸の局所の枠〔動径・接線・軸〕で半径の帯ごとの流れ/揺らぎ)/運動学の恒等式(一様球面・一様球)/
//     逆回転の集団(Ω と −Ω が半数ずつ)/合成の集団(球・円盤 × N・半径・傾き)で平均場の近似(O(N) —— 一様な質量密度・平均スピン密度・方向の平均 ⟨μ²⟩)と
//     正確な対の和の差/平均の自転速度の読み(⟨ν ω⟩ と慣性自転の平均の比)/斥力の候補(半径の帯の揺らぎの二次モーメントから作る圧力に似た量の外向きの勾配)/
//     一様・差動の座標回転と粒子間距離。
//   T(熱力学との類似の表): 器の数と並べて、言えること/言えないことを分ける。
//
// ■ 言わないこと: 「熱力学を導いた」「斥力を導いた」「平均の自転速度が決まった」「回転引きずりが座標変換であることを示した」(器は今のエンジンの規約を測るだけ)。
//
// ■ 使い方
//   node tests/exp-w305d-spinavg.mjs   → 正本 tests/out/spinavg-w305d.json(段 spinavg-305d)
//   W305D_OUT=<json> で出力先を変える(試走は正本を書かない)・W305D_TARGET=<html>(既定 beta/index.html)・W305D_N(本の写しの步数 —— 既定 600)・
//   W305D_QUICK=1(步数 120・合成の集団の走査を縮める —— 煙試験の窓。正本は書かない用途)。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlHeadless } from './lib-w279b-headless.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
// 第281便a の領域 hash の宣言(器と lib から deriveScope で引いた下限 + 本 5 本)
const REGEN_SCOPE = {"presets":["chainBurstShell3d","chainDiskToy3d","chainDiskToy3dTilt","chainSpreadToy3d","saturnRingInertial3d"],"roots":["$","HP.allPresets","HP.coord3d","HP.loadPreset","HP.validatePreset","REL_DRAG_AXIAL_LAW","REL_DRAG_SPIN3_VERSION","T","ab","appStepDt","ctx","dfmGaussLegendre01","dfmInertialDrag3Build","dfmInertialDragStep3","inertialDrag3AxialApply","inertialDrag3AxialOmega","inertialDrag3RotTerm","inertialDragNormOf","inertialSpinMoment","relDrag3SpinOf","relDragCoefficientOf","sim"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w305d-spinavg-1';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const sci = (v, p = 6) => (Number.isFinite(v) ? Number(v.toPrecision(p)) : v);
const clone = (o) => JSON.parse(JSON.stringify(o));
const F64 = (n) => new Float64Array(n);
const hypot3 = (a, b, c) => Math.sqrt(a * a + b * b + c * c);

/** 写しの一覧(本の宣言は変えない —— 器の中で組む) */
export const CASES = [
  { key: 'disk', id: 'chainDiskToy3d', emoji: '🔩', patch: null },
  { key: 'tilt', id: 'chainDiskToy3dTilt', emoji: '🪛', patch: null },
  { key: 'spread', id: 'chainSpreadToy3d', emoji: '🍥', patch: null },
  { key: 'spreadAx', id: 'chainSpreadToy3d', emoji: '🍥', patch: { spinDrag: { rot: 'surfaceFlip', axial: 'on', axialCoupling: 4 } } },
  { key: 'burst', id: 'chainBurstShell3d', emoji: '🧨', patch: null },
  { key: 'ring', id: 'saturnRingInertial3d', emoji: '🍩', patch: 'ab' },
  { key: 'ring0', id: 'saturnRingInertial3d', emoji: '🍩', patch: null },
];
export const KAPPA_REF = 4;   // 軸引きずりを宣言しない本の読み口の κ(🪛 の宣言と同じ —— 未較正)

/* ───────────────────────── html の口と包み ───────────────────────── */
let REC = null;   // 記録の器(null なら包みは素通り)
const ORIG = {};
function E(H, name) { return H.evalExpr(name); }
export function installWraps(H) {
  const c = H.ctx;
  if (c.__w305d) return;
  for (const k of ['dfmInertialDragStep3', 'inertialDrag3RotTerm', 'inertialDrag3AxialOmega']) ORIG[k] = c[k];
  c.inertialDrag3RotTerm = function (S, n, C, eps, KX, KY, KZ) {
    const R = REC;
    if (!R) return ORIG.inertialDrag3RotTerm(S, n, C, eps, KX, KY, KZ);
    return rotTermProbe(H, R, S, n, C, eps, KX, KY, KZ);
  };
  c.inertialDrag3AxialOmega = function (S, n, kap, eps, KX, KY, KZ) {
    const out = ORIG.inertialDrag3AxialOmega(S, n, kap, eps, KX, KY, KZ);
    const R = REC;
    if (R && R.cur && !R.light) {
      const T = scratchOf(S, n, {});
      ORIG.inertialDrag3AxialOmega(T, n, kap, eps, KX, KY, KZ);
      let same = true;
      for (let i = 0; i < n; i++) if (!Object.is(T._rdWX[i], S._rdWX[i]) || !Object.is(T._rdWY[i], S._rdWY[i]) || !Object.is(T._rdWZ[i], S._rdWZ[i]) || !Object.is(T._rdWS[i], S._rdWS[i])) { same = false; break; }
      R.cur.axRecompute = same;
      R.cur.axEngine = { WX: Float64Array.from(S._rdWX.subarray(0, n)), WY: Float64Array.from(S._rdWY.subarray(0, n)), WZ: Float64Array.from(S._rdWZ.subarray(0, n)) };
      if (R.cur.spinVar) {   // 二重計上の写し(源の Ω に受けた引きずり軸回転を足した)の角速度
        const V = scratchOf(S, n, { spin: R.cur.spinVar });
        ORIG.inertialDrag3AxialOmega(V, n, kap, eps, KX, KY, KZ);
        R.cur.axVar = relDiff3(V._rdWX, V._rdWY, V._rdWZ, S._rdWX, S._rdWY, S._rdWZ, n, R.cur.free);
      }
    }
    return out;
  };
  c.dfmInertialDragStep3 = function (S, dt) {
    const R = REC;
    if (!R) return ORIG.dfmInertialDragStep3(S, dt);
    return stepProbe(H, R, S, dt);
  };
  c.__w305d = true;
}
export function uninstallWraps(H) {
  const c = H.ctx;
  if (!c.__w305d) return;
  for (const k of Object.keys(ORIG)) c[k] = ORIG[k];
  c.__w305d = false;
}

/** 写しの状態: S を原型に、書く配列と帳簿だけを自前に(S は 1 bit も動かさない) */
function scratchOf(S, n, o) {
  const T = Object.create(S);
  T._rdUX = o.UX ? Float64Array.from(o.UX) : F64(n); T._rdUY = o.UY ? Float64Array.from(o.UY) : F64(n); T._rdUZ = o.UZ ? Float64Array.from(o.UZ) : F64(n);
  T._rdWX = F64(n); T._rdWY = F64(n); T._rdWZ = F64(n); T._rdWS = F64(n);
  T._rdA = F64(n * n); T._rdDeg = F64(n);
  if (o.spin) T.spin = o.spin;
  if (o.m) T.m = o.m;
  T.inertialDrag3RotSrc = 0; T.inertialDrag3RotN = 0; T.inertialDrag3RotSkip = 0; T.inertialDrag3RotMax = 0;
  return T;
}
function relDiff3(AX, AY, AZ, BX, BY, BZ, n, mask) {
  let d = 0, s = 0, d2 = 0, s2 = 0;
  for (let i = 0; i < n; i++) {
    if (mask && !mask[i]) continue;
    const e = hypot3(AX[i] - BX[i], AY[i] - BY[i], AZ[i] - BZ[i]), b = hypot3(BX[i], BY[i], BZ[i]);
    if (e > d) d = e; if (b > s) s = b; d2 += e * e; s2 += b * b;
  }
  return { max: s > 0 ? d / s : (d > 0 ? Infinity : 0), rms: s2 > 0 ? Math.sqrt(d2 / s2) : (d2 > 0 ? Infinity : 0) };
}

/* 回転引きずりの包み: 呼び直し(ビット同一)・純粋な s_rot・二重計上の写し・読み口の ω */
function rotTermProbe(H, R, S, n, C, eps, KX, KY, KZ) {
  const UXb = Float64Array.from(S._rdUX.subarray(0, n)), UYb = Float64Array.from(S._rdUY.subarray(0, n)), UZb = Float64Array.from(S._rdUZ.subarray(0, n));
  const A = S._rdA;
  let diag = true;
  for (let i = 0; i < n; i++) if (A[i * n + i] !== 0) { diag = false; break; }
  let srcExp = 0;
  for (let j = 0; j < n; j++) { const Om = S.spin[j], Rj = S.radOv[j], mj = S.m[j]; if (Om !== 0 && Rj > 0 && mj > 0 && Number.isFinite(mj) && Number.isFinite(Om)) srcExp++; }
  const out = ORIG.inertialDrag3RotTerm(S, n, C, eps, KX, KY, KZ);
  const cur = R.cur;
  cur.aDiagZero = diag; cur.srcOk = (S.inertialDrag3RotSrc === srcExp); cur.nSrc = srcExp;
  cur.K = [KX || S.x, KY || S.y, KZ || S.z].map((a) => Float64Array.from(a.subarray(0, n)));
  cur.C = C; cur.eps = eps;
  if (R.light) {   // h/2 の走行: 純粋な s_rot だけ(呼び直し・読み口・二重計上の写しは h の走行が数える)
    const T0 = scratchOf(S, n, {});
    ORIG.inertialDrag3RotTerm(T0, n, C, eps, KX, KY, KZ);
    cur.sRot = [T0._rdUX, T0._rdUY, T0._rdUZ];
    cur.axes = [Float64Array.from(S.sax.subarray(0, n)), Float64Array.from(S.say.subarray(0, n)), Float64Array.from(S.saz.subarray(0, n))];
    return out;
  }
  // (5) 呼び直し(同じ入口の s から)—— ビット同一
  const T1 = scratchOf(S, n, { UX: UXb, UY: UYb, UZ: UZb });
  ORIG.inertialDrag3RotTerm(T1, n, C, eps, KX, KY, KZ);
  let same = true;
  for (let i = 0; i < n; i++) if (!Object.is(T1._rdUX[i], S._rdUX[i]) || !Object.is(T1._rdUY[i], S._rdUY[i]) || !Object.is(T1._rdUZ[i], S._rdUZ[i])) { same = false; break; }
  cur.rotRecompute = same;
  // 純粋な s_rot(0 から)
  const T0 = scratchOf(S, n, {});
  ORIG.inertialDrag3RotTerm(T0, n, C, eps, KX, KY, KZ);
  cur.sRot = [T0._rdUX, T0._rdUY, T0._rdUZ];
  cur.sTot = [Float64Array.from(S._rdUX.subarray(0, n)), Float64Array.from(S._rdUY.subarray(0, n)), Float64Array.from(S._rdUZ.subarray(0, n))];
  // (6) 二重計上の写し(軸引きずりの本だけ —— 受けた引きずり軸回転を次の步の源の Ω へ足した変種)
  if (R.wPrev) {
    const sp = Float64Array.from(S.spin.subarray(0, n));
    for (let i = 0; i < n; i++) sp[i] += R.wPrev[i];
    cur.spinVar = sp;
    const T2 = scratchOf(S, n, { spin: sp });
    ORIG.inertialDrag3RotTerm(T2, n, C, eps, KX, KY, KZ);
    cur.rotVar = relDiff3(T2._rdUX, T2._rdUY, T2._rdUZ, T0._rdUX, T0._rdUY, T0._rdUZ, n, cur.free);
    cur.srcVar = T2.inertialDrag3RotSrc;
  }
  // 読み口の ω(生の対の和 —— κ は宣言か κ_ref)
  const TA = scratchOf(S, n, {});
  ORIG.inertialDrag3AxialOmega(TA, n, R.kappa, eps, KX, KY, KZ);
  cur.omega = [TA._rdWX, TA._rdWY, TA._rdWZ];
  cur.axes = [Float64Array.from(S.sax.subarray(0, n)), Float64Array.from(S.say.subarray(0, n)), Float64Array.from(S.saz.subarray(0, n))];
  return out;
}

/** 器の直接法(部分ピボット)—— 行列 M = I + diag(DG) − A(固定の行は単位・右辺 0)。右辺 3 本 */
export function solveRows(A, DG, fixed, n, BX, BY, BZ) {
  const M = F64(n * n), X = Float64Array.from(BX), Y = Float64Array.from(BY), Z = Float64Array.from(BZ);
  for (let i = 0; i < n; i++) {
    const row = i * n;
    if (fixed[i]) { M[row + i] = 1; X[i] = 0; Y[i] = 0; Z[i] = 0; continue; }
    for (let j = 0; j < n; j++) M[row + j] = -A[row + j];
    M[row + i] = 1 + DG[i];
  }
  const P = new Int32Array(n); for (let i = 0; i < n; i++) P[i] = i;
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

/** 源の重みの軸と原点(w_j = m_j Ω_j —— 源が 1 体ならその軸と位置) */
function refAxisOf(S, n, X, Y, Z, AX, AY, AZ) {
  let ax = 0, ay = 0, az = 0, ox = 0, oy = 0, oz = 0, ws = 0;
  for (let j = 0; j < n; j++) {
    const Om = S.spin[j], mj = S.m[j];
    if (Om === 0 || !(mj > 0) || !(S.radOv[j] > 0)) continue;
    const w = mj * Om;
    ax += w * AX[j]; ay += w * AY[j]; az += w * AZ[j];
    ox += Math.abs(w) * X[j]; oy += Math.abs(w) * Y[j]; oz += Math.abs(w) * Z[j]; ws += Math.abs(w);
  }
  const an = hypot3(ax, ay, az);
  if (!(an > 0) || !(ws > 0)) return null;
  return { a: [ax / an, ay / an, az / an], o: [ox / ws, oy / ws, oz / ws] };
}

/* 引きずりの步の包み: 契約の步ごとの確かめ・回転引きずりの座標の分解・平均と二次モーメント */
function stepProbe(H, R, S, dt) {
  const n = S.n;
  const spin0 = Float64Array.from(S.spin.subarray(0, n)), rotA0 = Float64Array.from(S.rotA.subarray(0, n));
  const rotAIn0 = S.rotAIn ? Float64Array.from(S.rotAIn.subarray(0, n)) : null;
  const X0 = Float64Array.from(S.x.subarray(0, n)), Y0 = Float64Array.from(S.y.subarray(0, n)), Z0 = Float64Array.from(S.z.subarray(0, n));
  const VX = Float64Array.from(S.vx.subarray(0, n)), VY = Float64Array.from(S.vy.subarray(0, n)), VZ = Float64Array.from(S.vz.subarray(0, n));
  const free = new Uint8Array(n);
  for (let i = 0; i < n; i++) free[i] = (S.m[i] > 0 && Number.isFinite(S.m[i]) && !S.pinned[i]) ? 1 : 0;
  R.cur = { free };
  const out = ORIG.dfmInertialDragStep3(S, dt);
  const cur = R.cur; R.cur = null;
  if (!cur.sRot) { R.noSpin++; R.wPrev = null; return out; }   // 回転・軸の項が走らなかった步(履歴なし・一致点 —— 数えるだけ)
  const st = R.st;
  st.steps++;
  let spinSame = true, attSame = true;
  for (let i = 0; i < n; i++) if (!Object.is(spin0[i], S.spin[i])) { spinSame = false; break; }
  if (R.axial) { for (let i = 0; i < n; i++) if (!Object.is(rotAIn0[i], S.rotAIn[i])) { attSame = false; break; } }
  else { for (let i = 0; i < n; i++) if (!Object.is(rotA0[i], S.rotA[i])) { attSame = false; break; } }
  st.spinSame += spinSame ? 1 : 0; st.attSame += attSame ? 1 : 0; st.aDiagZero += cur.aDiagZero ? 1 : 0; st.srcOk += cur.srcOk ? 1 : 0;
  st.rotRecompute += cur.rotRecompute ? 1 : 0;
  if (R.axial) st.axRecompute += cur.axRecompute ? 1 : 0;
  st.nSrc = cur.nSrc;
  if (cur.rotVar) { st.varN++; st.rotVarMax = Math.max(st.rotVarMax, cur.rotVar.max); st.rotVarRms += cur.rotVar.rms; st.srcVarMax = Math.max(st.srcVarMax, cur.srcVar); }
  if (cur.axVar) { st.axVarMax = Math.max(st.axVarMax, cur.axVar.max); st.axVarRms += cur.axVar.rms; }
  // 受けた引きずり軸回転(次の步の二重計上の写しに使う —— 軸引きずりの本だけ)
  if (R.axial) {
    const w = F64(n);
    let nz = 0;
    for (let i = 0; i < n; i++) {
      const v = S.saOn[i] ? (S._rdWX[i] * cur.axes[0][i] + S._rdWY[i] * cur.axes[1][i] + S._rdWZ[i] * cur.axes[2][i]) : S._rdWS[i];
      w[i] = v; if (v !== 0) nz++;
    }
    R.wPrev = w; st.dragRotN = Math.max(st.dragRotN, nz);
  }
  // u_rot = (I+L)⁻¹ s_rot(この步の行列)と全体の解の照合
  const fixed = new Uint8Array(n); for (let i = 0; i < n; i++) fixed[i] = free[i] ? 0 : 1;
  const A = S._rdA, DG = S._rdDeg;
  const uRot = solveRows(A, DG, fixed, n, cur.sRot[0], cur.sRot[1], cur.sRot[2]);
  if (R.solveCheck && st.steps % 50 === 1) {
    const uT = solveRows(A, DG, fixed, n, cur.sTot[0], cur.sTot[1], cur.sTot[2]);
    const e = relDiff3(uT[0], uT[1], uT[2], S._rdUX, S._rdUY, S._rdUZ, n, free);
    st.solveCheckMax = Math.max(st.solveCheckMax, e.max);
  }
  if (R.light) { const ref = refAxisOf(S, n, cur.K[0], cur.K[1], cur.K[2], cur.axes[0], cur.axes[1], cur.axes[2]); if (ref) coordAccumulate(R, n, free, ref, X0, Y0, Z0, VX, VY, VZ, uRot, dt, cur.K); return out; }
  // ν(エンジンの正規化 —— 既定の合成則では x = deg)
  const nu = F64(n), normOf = R.normOf;
  for (let i = 0; i < n; i++) nu[i] = normOf(S.relDrag, DG[i]);
  const om = cur.omega, OX = F64(n), OY = F64(n), OZ = F64(n);
  for (let i = 0; i < n; i++) { OX[i] = nu[i] * om[0][i]; OY[i] = nu[i] * om[1][i]; OZ[i] = nu[i] * om[2][i]; }
  // 座標の分解(源の重みの軸のまわり)
  const ref = refAxisOf(S, n, cur.K[0], cur.K[1], cur.K[2], cur.axes[0], cur.axes[1], cur.axes[2]);
  if (ref) coordAccumulate(R, n, free, ref, X0, Y0, Z0, VX, VY, VZ, uRot, dt, cur.K);
  // 平均と二次モーメント(受け手 = 自由な行)
  if (!R.light && (st.steps % R.every === 0 || st.steps === 1)) {
    const frameRef = ref || { a: [0, 0, 1], o: [0, 0, 0] };
    const q = { omega: momentsOf([OX, OY, OZ], free, n, frameRef, X0, Y0, Z0), sRot: momentsOf(cur.sRot, free, n, frameRef, X0, Y0, Z0), uRot: momentsOf(uRot, free, n, frameRef, X0, Y0, Z0) };
    R.samples.push({ step: st.steps, ...q });
    if (R.onSample) R.onSample(S, n, cur, { OX, OY, OZ, uRot, nu, free, ref: frameRef, X0, Y0, Z0, DG });
  }
  return out;
}

function coordAccumulate(R, n, free, ref, X0, Y0, Z0, VX, VY, VZ, U, dt, K) {
  const c = R.coord, [ax, ay, az] = ref.a, [ox, oy, oz] = ref.o;
  let sxx = 0, sxt = 0, d2 = 0, res2 = 0;
  for (let i = 0; i < n; i++) {
    if (!free[i]) continue;
    const rx = X0[i] - ox, ry = Y0[i] - oy, rz = Z0[i] - oz, ra = rx * ax + ry * ay + rz * az;
    const px = rx - ra * ax, py = ry - ra * ay, pz = rz - ra * az, rho = hypot3(px, py, pz);
    if (!(rho > 1e-9)) continue;
    const ex = px / rho, ey = py / rho, ez = pz / rho;           // r̂⊥
    const tx = ay * ez - az * ey, ty = az * ex - ax * ez, tz = ax * ey - ay * ex;   // t̂ = â × r̂⊥
    const dx = U[0][i] * dt, dy = U[1][i] * dt, dz = U[2][i] * dt;
    const dr = dx * ex + dy * ey + dz * ez, dtn = dx * tx + dy * ty + dz * tz;
    const phi = dtn / rho;
    const ex2 = Math.sqrt((rho + dr) * (rho + dr) + dtn * dtn) - (rho + dr);
    c.phi[i] += phi; c.r1[i] += dr; c.e2[i] += ex2; c.path[i] += hypot3(dx, dy, dz); c.rho[i] = rho;
    // 速度の回り(座標変換なら v⊥ も同じ角で回る —— エンジンは回さない): |Δv| = |v⊥| |Δφ|
    const va = VX[i] * ax + VY[i] * ay + VZ[i] * az, vp = hypot3(VX[i] - va * ax, VY[i] - va * ay, VZ[i] - va * az), vm = hypot3(VX[i], VY[i], VZ[i]);
    c.dv[i] += vp * Math.abs(phi); c.vmag[i] = vm;
    if (K) {   // 核の位置(semic の前の写し)での動径の一次 —— 移送の位置との差は步の順序の位相の遅れ
      const kx = K[0][i] - ox, ky = K[1][i] - oy, kz = K[2][i] - oz, ka = kx * ax + ky * ay + kz * az;
      const qx = kx - ka * ax, qy = ky - ka * ay, qz = kz - ka * az, qr = hypot3(qx, qy, qz);
      if (qr > 0) c.r1K[i] += (dx * qx + dy * qy + dz * qz) / qr;
    }
    sxx += rho * rho; sxt += rho * dtn; d2 += dx * dx + dy * dy + dz * dz;
  }
  // 一様な回転の当てはめ(θ = Σρ δt / Σρ²)からの残り
  if (sxx > 0 && d2 > 0) {
    const th = sxt / sxx;
    for (let i = 0; i < n; i++) {
      if (!free[i]) continue;
      const rx = X0[i] - ox, ry = Y0[i] - oy, rz = Z0[i] - oz;
      const wx = th * (ay * rz - az * ry), wy = th * (az * rx - ax * rz), wz = th * (ax * ry - ay * rx);
      const ddx = U[0][i] * dt - wx, ddy = U[1][i] * dt - wy, ddz = U[2][i] * dt - wz;
      res2 += ddx * ddx + ddy * ddy + ddz * ddz;
    }
    c.resW += res2; c.d2W += d2;
  }
}

/** 帯の中の一次の当てはめ(q = m + b(ρ − ρ̄))—— 滑らかな流れ(帯の平均と半径の勾配)と残り(揺らぎ)に分ける */
function detrend(s, key) {
  const k = s.length, rm = s.reduce((z, p) => z + p.rho, 0) / k, m = s.reduce((z, p) => z + p[key], 0) / k;
  let sxx = 0, sxy = 0;
  for (const p of s) { const dx = p.rho - rm; sxx += dx * dx; sxy += dx * (p[key] - m); }
  const b = sxx > 0 ? sxy / sxx : 0;
  let smooth = 0, res = 0;
  for (const p of s) { const f = m + b * (p.rho - rm); smooth += f * f; res += (p[key] - f) ** 2; }
  return { m, b, smooth, res };
}
/** 平均と二次モーメント(直交座標)と局所の枠(動径・接線・軸)の半径の帯(等数 nb 帯)の流れ(帯の一次の当てはめ)/揺らぎ(残り) */
export function momentsOf(Q, mask, n, ref, X, Y, Z, nb = 6) {
  const idx = [];
  for (let i = 0; i < n; i++) if (!mask || mask[i]) idx.push(i);
  const N = idx.length;
  if (!N) return null;
  let mx = 0, my = 0, mz = 0;
  for (const i of idx) { mx += Q[0][i]; my += Q[1][i]; mz += Q[2][i]; }
  mx /= N; my /= N; mz /= N;
  const Cv = [0, 0, 0, 0, 0, 0];   // xx yy zz xy xz yz
  let ms = 0;
  for (const i of idx) {
    const a = Q[0][i] - mx, b = Q[1][i] - my, c = Q[2][i] - mz;
    Cv[0] += a * a; Cv[1] += b * b; Cv[2] += c * c; Cv[3] += a * b; Cv[4] += a * c; Cv[5] += b * c;
    ms += Q[0][i] * Q[0][i] + Q[1][i] * Q[1][i] + Q[2][i] * Q[2][i];
  }
  for (let k = 0; k < 6; k++) Cv[k] /= N;
  ms /= N;
  const eig = eigSym3(Cv);
  // 局所の枠
  const [ax, ay, az] = ref.a, [ox, oy, oz] = ref.o;
  const rows = idx.map((i) => {
    const rx = X[i] - ox, ry = Y[i] - oy, rz = Z[i] - oz, ra = rx * ax + ry * ay + rz * az;
    const px = rx - ra * ax, py = ry - ra * ay, pz = rz - ra * az, rho = hypot3(px, py, pz) || 1e-300;
    const ex = px / rho, ey = py / rho, ez = pz / rho, tx = ay * ez - az * ey, ty = az * ex - ax * ez, tz = ax * ey - ay * ex;
    const qx = Q[0][i], qy = Q[1][i], qz = Q[2][i];
    return { rho, r: qx * ex + qy * ey + qz * ez, t: qx * tx + qy * ty + qz * tz, a: qx * ax + qy * ay + qz * az };
  }).sort((p, q) => p.rho - q.rho);
  let flow = 0, therm = 0, tMean = 0, rMean = 0, aMean = 0, omRate = 0;
  const bins = [];
  for (let b = 0; b < nb; b++) {
    const s = rows.slice(Math.floor(b * N / nb), Math.floor((b + 1) * N / nb));
    if (!s.length) continue;
    const k = s.length, dr = detrend(s, 'r'), dt = detrend(s, 't'), da = detrend(s, 'a');
    const rhoIn = s[0].rho, rhoOut = s[k - 1].rho, rhoM = s.reduce((z, p) => z + p.rho, 0) / k;
    bins.push({ k, rhoIn, rhoOut, rhoMean: rhoM, mean: [dr.m, dt.m, da.m], var: [dr.res / k, dt.res / k, da.res / k] });
    flow += dr.smooth + dt.smooth + da.smooth; therm += dr.res + dt.res + da.res;
  }
  for (const p of rows) { tMean += p.t; rMean += p.r; aMean += p.a; omRate += p.t / p.rho; }
  return { N, mean: [mx, my, mz], meanAbs: hypot3(mx, my, mz), meanSq: ms, cov: Cv, trace: Cv[0] + Cv[1] + Cv[2], eig,
    frame: { meanR: rMean / N, meanT: tMean / N, meanA: aMean / N, meanRate: omRate / N, flow: flow / N, therm: therm / N, thermFrac: (flow + therm) > 0 ? therm / (flow + therm) : 0, bins } };
}
/** 帯の平均(流れ)の差: √(Σ k |m_A − m_B|²)/√(Σ k |m_B|²)(A = 平均場・B = 正確 —— 同じ帯の切り方)*/
function flowErr(MA, MB) {
  let d = 0, b = 0;
  for (let k = 0; k < Math.min(MA.frame.bins.length, MB.frame.bins.length); k++) {
    const p = MA.frame.bins[k], q = MB.frame.bins[k];
    d += q.k * ((p.mean[0] - q.mean[0]) ** 2 + (p.mean[1] - q.mean[1]) ** 2 + (p.mean[2] - q.mean[2]) ** 2); b += q.k * (q.mean[0] ** 2 + q.mean[1] ** 2 + q.mean[2] ** 2);
  }
  return b > 0 ? Math.sqrt(d / b) : null;
}
/** 対称 3×3 の固有値(Jacobi —— 降順) */
export function eigSym3(c) {
  const a = [[c[0], c[3], c[4]], [c[3], c[1], c[5]], [c[4], c[5], c[2]]];
  for (let sweep = 0; sweep < 50; sweep++) {
    let off = 0;
    for (let p = 0; p < 3; p++) for (let q = p + 1; q < 3; q++) off += a[p][q] * a[p][q];
    if (off < 1e-300) break;
    for (let p = 0; p < 3; p++) for (let q = p + 1; q < 3; q++) {
      if (Math.abs(a[p][q]) < 1e-300) continue;
      const th = 0.5 * Math.atan2(2 * a[p][q], a[q][q] - a[p][p]), cs = Math.cos(th), sn = Math.sin(th);
      for (let k = 0; k < 3; k++) { const x = a[k][p], y = a[k][q]; a[k][p] = cs * x - sn * y; a[k][q] = sn * x + cs * y; }
      for (let k = 0; k < 3; k++) { const x = a[p][k], y = a[q][k]; a[p][k] = cs * x - sn * y; a[q][k] = sn * x + cs * y; }
    }
  }
  return [a[0][0], a[1][1], a[2][2]].sort((x, y) => y - x);
}

/* ───────────────────────── 本の写しの走行 ───────────────────────── */
function presetOf(HP, id) { const p = HP.allPresets().find((q) => q.id === id); if (!p) throw new Error('本が無い: ' + id); return clone(p); }
export function buildCase(H, cs) {
  const HP = H.HP, q = presetOf(HP, cs.id);
  if (cs.patch === 'ab') q.physics.relativeDrag = clone(q.abBody.physicsPatch.relativeDrag);
  else if (cs.patch && cs.patch.spinDrag) q.physics.relativeDrag.spinDrag = clone(cs.patch.spinDrag);
  const v = HP.validatePreset(q);
  if (!v.ok) throw new Error('validatePreset(' + cs.key + '): ' + JSON.stringify(v.errors || v.err).slice(0, 300));
  const S = HP.coord3d.makeSim();
  S.build(clone(v.preset));
  return { S, dt: E(H, 'appStepDt')(S), preset: v.preset };
}
const fp = (S) => {
  const h = crypto.createHash('sha1');
  for (const k of ['x', 'y', 'z', 'vx', 'vy', 'vz', 'rotA', 'sax', 'say', 'saz', 'spin']) { const a = S[k]; if (a) { const b = Float64Array.from(a.subarray(0, Math.min(a.length, S.n))); h.update(Buffer.from(b.buffer)); } }
  return h.digest('hex').slice(0, 16);
};
function newRec(H, S, o) {
  const n = S.n, sd = E(H, 'relDrag3SpinOf')(S.relDrag);
  return { axial: !!(sd && sd.axial), kappa: (sd && sd.axial) ? sd.kappa : KAPPA_REF, kappaFrom: (sd && sd.axial) ? 'declared' : 'readout', every: o.every || 10, solveCheck: o.solveCheck !== false, light: !!o.light,
    normOf: E(H, 'inertialDragNormOf'), wPrev: null, cur: null, noSpin: 0, samples: [], onSample: o.onSample || null,
    st: { steps: 0, spinSame: 0, attSame: 0, aDiagZero: 0, srcOk: 0, rotRecompute: 0, axRecompute: 0, nSrc: 0, varN: 0, rotVarMax: 0, rotVarRms: 0, srcVarMax: 0, axVarMax: 0, axVarRms: 0, dragRotN: 0, solveCheckMax: 0 },
    coord: { phi: F64(n), r1: F64(n), r1K: F64(n), e2: F64(n), path: F64(n), rho: F64(n), dv: F64(n), vmag: F64(n), resW: 0, d2W: 0 } };
}
/** 1 本の写しを N 步(記録つき)—— 戻り値は記録と最後の状態の指紋 */
export function runCase(H, cs, N, o = {}) {
  installWraps(H);
  const { S, dt: dt0 } = buildCase(H, cs);
  const dt = o.half ? dt0 / 2 : dt0, steps = o.half ? 2 * N : N;
  const R = newRec(H, S, o);
  REC = R;
  const t0 = Date.now();
  try { for (let k = 0; k < steps; k++) S.step(dt); } finally { REC = null; }
  return { S, R, dt, steps, wallSec: (Date.now() - t0) / 1000, print: fp(S) };
}
/** 段 P: 包みの素通り —— 包みを入れない走行と記録つきの走行の最後の状態がビット同一・本の入口(loadPreset)と器の写しの組み立てが同じ */
export function partPass(H, N) {
  const rows = [];
  for (const cs of CASES) {
    uninstallWraps(H);
    const a = buildCase(H, cs);
    for (let k = 0; k < N; k++) a.S.step(a.dt);
    const pa = fp(a.S);
    const b = runCase(H, cs, N, { every: 1e9, solveCheck: false });
    let book = null;
    if (!cs.patch) {
      uninstallWraps(H);
      H.HP.loadPreset(cs.id, false);
      const S = E(H, 'sim'), dt = E(H, 'appStepDt')(S);
      for (let k = 0; k < N; k++) S.step(dt);
      book = fp(S) === pa;
    }
    rows.push({ key: cs.key, steps: N, plain: pa, recorded: b.print, same: pa === b.print, bookRoute: book });
  }
  installWraps(H);
  return { steps: N, rows, allSame: rows.every((r) => r.same && r.bookRoute !== false) };
}

/* ───────────────────────── 段 C・X・M(本の写し)───────────────────────── */
function summarizeCoord(R, S) {
  const c = R.coord, n = S.n;
  let k = 0, phiM = 0, phiAbs = 0, phiMax = 0, e2 = 0, e2Rel = 0, r1 = 0, r1Abs = 0, r1K = 0, r1KAbs = 0, path = 0, dvRel = 0, rhoM = 0;
  for (let i = 0; i < n; i++) {
    if (!(c.rho[i] > 0)) continue;
    k++; phiM += c.phi[i]; phiAbs += Math.abs(c.phi[i]); if (Math.abs(c.phi[i]) > phiMax) phiMax = Math.abs(c.phi[i]);
    e2 += c.e2[i]; e2Rel += c.e2[i] / c.rho[i]; r1 += c.r1[i]; r1Abs += Math.abs(c.r1[i]); r1K += c.r1K[i]; r1KAbs += Math.abs(c.r1K[i]); path += c.path[i]; rhoM += c.rho[i];
    if (c.vmag[i] > 0) dvRel += c.dv[i] / c.vmag[i];
  }
  if (!k) return null;
  return { receivers: k, phiMean: phiM / k, phiAbsMean: phiAbs / k, phiMax, e2Mean: e2 / k, e2RelMean: e2Rel / k, r1Mean: r1 / k, r1AbsMean: r1Abs / k, r1KMean: r1K / k, r1KAbsMean: r1KAbs / k, lagMean: (r1 - r1K) / k, pathMean: path / k,
    e2OverPath: path > 0 ? e2 / path : 0, dvRelMean: dvRel / k, rhoMean: rhoM / k, nonRigid: c.d2W > 0 ? Math.sqrt(c.resW / c.d2W) : null };
}
const tavg = (samples, f) => { const v = samples.map(f).filter(Number.isFinite); return v.length ? v.reduce((a, b) => a + b, 0) / v.length : NaN; };
function summarizeMoments(samples) {
  const pick = (k) => {
    const last = samples[samples.length - 1][k];
    return { meanAbsT: tavg(samples, (s) => s[k].meanAbs), rmsT: tavg(samples, (s) => Math.sqrt(s[k].meanSq)), traceT: tavg(samples, (s) => s[k].trace),
      meanRateT: tavg(samples, (s) => s[k].frame.meanRate), thermFracT: tavg(samples, (s) => s[k].frame.thermFrac),
      last: { mean: last.mean, meanAbs: last.meanAbs, meanSq: last.meanSq, eig: last.eig, frame: { meanR: last.frame.meanR, meanT: last.frame.meanT, meanA: last.frame.meanA, meanRate: last.frame.meanRate, flow: last.frame.flow, therm: last.frame.therm, thermFrac: last.frame.thermFrac } } };
  };
  return { samples: samples.length, omega: pick('omega'), sRot: pick('sRot'), uRot: pick('uRot'),
    filter: { meanT: tavg(samples, (s) => (s.sRot.frame.flow > 0 ? Math.sqrt(s.uRot.frame.flow / s.sRot.frame.flow) : NaN)), fluctT: tavg(samples, (s) => (s.sRot.frame.therm > 0 ? Math.sqrt(s.uRot.frame.therm / s.sRot.frame.therm) : NaN)) } };
}
/** 段 C・X・M の本の写し(h と、座標の段の h/2) */
export function partBooks(H, N, o = {}) {
  const rows = [];
  for (const cs of CASES) {
    const extra = {};
    const r = runCase(H, cs, N, { every: o.every || 10, onSample: cs.key === 'spread' || cs.key === 'spreadAx' ? mfBookHook(H, extra) : null });
    const { S, R } = r, st = R.st, n = S.n;
    const row = { key: cs.key, id: cs.id, emoji: cs.emoji, n, dt: r.dt, steps: r.steps, drag: st.steps > 0, wallSec: r.wallSec, axial: R.axial, kappa: R.kappa, kappaFrom: R.kappaFrom,
      contract: { steps: st.steps, spinSame: st.spinSame, attSame: st.attSame, aDiagZero: st.aDiagZero, srcOk: st.srcOk, nSrc: st.nSrc, rotRecompute: st.rotRecompute,
        axRecompute: R.axial ? st.axRecompute : null, noSpinSteps: R.noSpin, solveCheckMax: st.solveCheckMax,
        variant: st.varN ? { steps: st.varN, rotMax: st.rotVarMax, rotRmsMean: st.rotVarRms / st.varN, axMax: st.axVarMax, axRmsMean: st.axVarRms / st.varN, srcVarMax: st.srcVarMax, dragRotReceivers: st.dragRotN } : null },
      lone: loneTest(H, cs), print: r.print };
    if (st.steps) {
      row.coord = summarizeCoord(R, S);
      row.moments = summarizeMoments(R.samples);
      if (extra.mf) row.mf = extra.mf;
      if (cs.key === 'tilt' && S.rotADr) {   // 軸引きずりが姿勢を回した角と、回転引きずりが位置を運んだ角の比
        let k = 0, s = 0, sa = 0;
        for (let i = 0; i < n; i++) if (R.coord.rho[i] > 0 && R.coord.phi[i] !== 0) { k++; s += S.rotADr[i] / R.coord.phi[i]; sa += Math.abs(S.rotADr[i]); }
        row.axialVsRot = { receivers: k, ratioMean: s / k, axialAngleAbsMean: sa / k };
      }
      if (o.half && ['disk', 'tilt', 'burst', 'spread', 'ring'].includes(cs.key)) {
        const h2 = runCase(H, cs, N, { half: true, every: 1e9, solveCheck: false, light: true });
        row.coordH2 = summarizeCoord(h2.R, h2.S);
        row.coordRatio = { e2: row.coord.e2Mean / row.coordH2.e2Mean, phi: row.coord.phiAbsMean / row.coordH2.phiAbsMean, r1: row.coordH2.r1AbsMean > 0 ? row.coord.r1AbsMean / row.coordH2.r1AbsMean : null,
          r1K: row.coordH2.r1KAbsMean > 0 ? row.coord.r1KAbsMean / row.coordH2.r1KAbsMean : null, lag: row.coordH2.lagMean !== 0 ? row.coord.lagMean / row.coordH2.lagMean : null };
      }
      if (cs.key === 'spreadAx') row.noExpansion = noExpansion(S, R);
    }
    rows.push(row);
  }
  return rows;
}
/** 孤立した源: 他の粒子の質量を 0 にした写しで、源は自分の回転引きずり・軸引きずり・行を作らない */
function loneTest(H, cs) {
  installWraps(H);
  const { S } = buildCase(H, cs), n = S.n;
  const eps = (S.relDrag.eps !== undefined) ? S.relDrag.eps : (S.params.softening || 0), C = E(H, 'relDragCoefficientOf')(S.relDrag) || 1;
  let srcs = 0, rotZero = 0, axZero = 0, rowZero = 0;
  for (let j = 0; j < n; j++) {
    if (S.spin[j] === 0 || !(S.m[j] > 0)) continue;
    srcs++;
    const m = F64(n); m[j] = S.m[j];
    const T = scratchOf(S, n, { m });
    ORIG.inertialDrag3RotTerm(T, n, C, eps);
    if (T._rdUX[j] === 0 && T._rdUY[j] === 0 && T._rdUZ[j] === 0 && T.inertialDrag3RotN === 0) rotZero++;
    const P = Object.create(T); P.pinned = new Uint8Array(n);   // 受け手 j を固定から外した写し(固定の源は軸引きずりを受けない規約 —— 自己の項が無いことだけを見る)
    P._rdWX = F64(n); P._rdWY = F64(n); P._rdWZ = F64(n); P._rdWS = F64(n);
    ORIG.inertialDrag3AxialOmega(P, n, KAPPA_REF, eps);
    if (P._rdWX[j] === 0 && P._rdWY[j] === 0 && P._rdWZ[j] === 0 && P._rdWS[j] === 0) axZero++;
    const B = scratchOf(S, n, { m });
    E(H, 'dfmInertialDrag3Build')(B, n, true, C, eps * eps, null);
    let z = (B._rdDeg[j] === 0);
    for (let k = 0; k < n; k++) if (B._rdA[j * n + k] !== 0) z = false;
    if (z) rowZero++;
  }
  return { sources: srcs, rotZero, axZero, rowZero, ok: srcs > 0 && rotZero === srcs && axZero === srcs && rowZero === srcs };
}
/** 一様・差動の座標回転と粒子間距離(🍥 の軸引きずりの写しの最後の状態) */
function noExpansion(S, R) {
  const n = S.n, free = [];
  for (let i = 0; i < n; i++) if (S.m[i] > 0 && !S.pinned[i]) free.push(i);
  const ref = refAxisOf(S, n, S.x, S.y, S.z, S.sax, S.say, S.saz) || { a: [0, 0, 1], o: [0, 0, 0] };
  const rot = (x, y, z, th) => {   // â まわりに th(原点 o)
    const [ax, ay, az] = ref.a, [ox, oy, oz] = ref.o, rx = x - ox, ry = y - oy, rz = z - oz, c = Math.cos(th), s = Math.sin(th), d = rx * ax + ry * ay + rz * az;
    return [ox + rx * c + (ay * rz - az * ry) * s + ax * d * (1 - c), oy + ry * c + (az * rx - ax * rz) * s + ay * d * (1 - c), oz + rz * c + (ax * ry - ay * rx) * s + az * d * (1 - c)];
  };
  const P0 = free.map((i) => [S.x[i], S.y[i], S.z[i]]);
  const rhoOf = (p) => { const [ax, ay, az] = ref.a, rx = p[0] - ref.o[0], ry = p[1] - ref.o[1], rz = p[2] - ref.o[2], d = rx * ax + ry * ay + rz * az; return hypot3(rx - d * ax, ry - d * ay, rz - d * az); };
  const pairs = (P) => { const out = []; for (let a = 0; a < P.length; a++) for (let b = a + 1; b < P.length; b++) out.push(hypot3(P[a][0] - P[b][0], P[a][1] - P[b][1], P[a][2] - P[b][2])); return out; };
  const D0 = pairs(P0);
  const uni = free.map((i, k) => rot(P0[k][0], P0[k][1], P0[k][2], 0.1));
  const Du = pairs(uni);
  const dif = free.map((i, k) => rot(P0[k][0], P0[k][1], P0[k][2], R.coord.phi[i]));
  const Dd = pairs(dif);
  let uMax = 0, dMean = 0, dRms = 0, rhoU = 0, rhoD = 0;
  for (let k = 0; k < D0.length; k++) { uMax = Math.max(uMax, Math.abs(Du[k] / D0[k] - 1)); const e = Dd[k] / D0[k] - 1; dMean += e; dRms += e * e; }
  for (let k = 0; k < P0.length; k++) { const r0 = rhoOf(P0[k]); rhoU = Math.max(rhoU, Math.abs(rhoOf(uni[k]) / r0 - 1)); rhoD = Math.max(rhoD, Math.abs(rhoOf(dif[k]) / r0 - 1)); }
  let rhoMean0 = 0, rhoMeanD = 0; for (let k = 0; k < P0.length; k++) { rhoMean0 += rhoOf(P0[k]); rhoMeanD += rhoOf(dif[k]); }
  return { particles: P0.length, pairs: D0.length, uniformAngle: 0.1, uniformPairRelMax: uMax, uniformRhoRelMax: rhoU,
    diffPairRelMean: dMean / D0.length, diffPairRelRms: Math.sqrt(dRms / D0.length), diffRhoRelMax: rhoD, diffMeanRhoRel: rhoMeanD / rhoMean0 - 1 };
}

/* ───────────────────────── 平均場(O(N))───────────────────────── */
let GL = null;
function gl(H, k) { if (!GL) GL = {}; if (!GL[k]) GL[k] = E(H, 'dfmGaussLegendre01')(k); return GL[k]; }
/** 区間 [a,b] を点 c の近くで細かく(c ± ε·2^k)区切った区分 Gauss–Legendre の点と重み */
function panelsNear(a, b, c, eps) {
  const pts = new Set([a, b]);
  if (c > a && c < b) pts.add(c);
  for (let d = eps / 4; d < (b - a); d *= 2) { if (c - d > a && c - d < b) pts.add(c - d); if (c + d > a && c + d < b) pts.add(c + d); }
  return [...pts].sort((x, y) => x - y);
}
function quad1(H, cuts, f, k = 16) {
  const g = gl(H, k);
  let s = 0;
  for (let p = 0; p + 1 < cuts.length; p++) { const a = cuts[p], h = cuts[p + 1] - a; if (!(h > 0)) continue; for (let q = 0; q < g.x.length; q++) s += g.w[q] * h * f(a + h * g.x[q]); }
  return s;
}
const Kpt = (d, e2) => d / ((d * d + e2) * (d * d + e2));
/** 一様な球殻(半径 s)の平均の点の核 ⟨K_ε⟩(r, s) = [G(r+s) − G(|r−s|)]/(2rs)・G(d) = atan(d/ε)/(2ε) − d/(2(d²+ε²)) */
export function Kshell(r, s, eps) {
  const e2 = eps * eps;
  if (r < 1e-9 * (s + eps)) return Kpt(s, e2);
  if (s < 1e-9 * (r + eps)) return Kpt(r, e2);
  if (s < 1e-4 * r || r < 1e-4 * s) return Kpt(Math.max(r, s), e2);
  const G = (d) => Math.atan(d / eps) / (2 * eps) - d / (2 * (d * d + e2));
  return (G(r + s) - G(Math.abs(r - s))) / (2 * r * s);
}
/** 平均場の表(r の格子): I_K(r) = ∫ n K_ε dV(単位密度)と g(r) = ∫ n M1(d) (x−x′)·x̂/d dV(回転引きずりの核の動径のベクトル —— M1 は html の inertialSpinMoment)
 *  geom: 'ball'(半径 Rp の一様球)/ 'disk'(z=0 の一様円環 [Rin, Rout])*/
export function mfTable(H, geom, Rin, Rout, eps, Rsrc, nr = 64) {
  const M1 = E(H, 'inertialSpinMoment'), glS = gl(H, 16);
  const m1 = (d) => { if (!(d > 1e-12)) return 0; const v = M1(d, Rsrc, eps, glS); return v === null ? 0 : v; };
  const rs = [], IK = [], gR = [];
  for (let k = 0; k < nr; k++) {
    const r = Rout * k / (nr - 1);
    rs.push(r);
    if (geom === 'ball') {
      const cuts = panelsNear(0, Rout, r, eps);
      IK.push(quad1(H, cuts, (s) => 4 * Math.PI * s * s * Kshell(r, s, eps)));
      if (r === 0) { gR.push(0); continue; }
      gR.push(quad1(H, cuts, (s) => 2 * Math.PI * s * s * quad1(H, s > 0 && Math.abs(s - r) < 4 * eps ? [-1, 0, 0.9, 0.99, 1] : [-1, 0, 1], (mu) => { const d = Math.sqrt(Math.max(0, r * r + s * s - 2 * r * s * mu)); return d > 1e-12 ? m1(d) * (r - s * mu) / d : 0; }, 12), 12));
    } else {
      const cuts = panelsNear(Rin, Rout, r, eps);
      const ang = (s, f) => 2 * quad1(H, Math.abs(s - r) < 4 * eps ? [0, 0.02, 0.1, 0.4, Math.PI] : [0, Math.PI / 2, Math.PI], f, 12);
      IK.push(quad1(H, cuts, (s) => s * ang(s, (ph) => Kpt(Math.sqrt(Math.max(0, r * r + s * s - 2 * r * s * Math.cos(ph))), eps * eps)), 12));
      gR.push(r === 0 ? 0 : quad1(H, cuts, (s) => s * ang(s, (ph) => { const c = Math.cos(ph), d = Math.sqrt(Math.max(0, r * r + s * s - 2 * r * s * c)); return d > 1e-12 ? m1(d) * (r - s * c) / d : 0; }), 12));
    }
  }
  const at = (arr, r) => { if (r <= 0) return arr[0]; const x = r / Rout * (nr - 1); const k = Math.min(nr - 2, Math.floor(x)), t = x - k; return arr[k] * (1 - t) + arr[k + 1] * t; };
  return { geom, Rin, Rout, eps, Rsrc, IK: (r) => at(IK, r), g: (r) => at(gR, r), vol: geom === 'ball' ? 4 / 3 * Math.PI * Rout ** 3 : Math.PI * (Rout * Rout - Rin * Rin) };
}

/* ───────────────────────── 合成の集団 ───────────────────────── */
const halton = (i, b) => { let f = 1, r = 0; while (i > 0) { f /= b; r += f * (i % b); i = Math.floor(i / b); } return r; };
/** 合成の集団の状態(本の 🍥 の環の粒の写し: m 5・半径 √5・Ω 0.5・ε 1・C 8〔W_bg 0.125〕・κ 4)。axes: 'parallel'(傾き θ・方位 0)/ 'golden'(傾き θ・方位は黄金角) */
export const POP = { m: 5, Rsrc: Math.sqrt(5), Om: 0.5, eps: 1, Wbg: 0.125, kappa: 4 };
export function popState(geom, N, Rp, tiltDeg, sign, axes = 'parallel') {
  const S = { n: N, x: F64(N), y: F64(N), z: F64(N), vx: F64(N), vy: F64(N), vz: F64(N), m: F64(N).fill(POP.m), spin: F64(N), radOv: F64(N).fill(POP.Rsrc), R: F64(N).fill(POP.Rsrc),
    pinned: new Uint8Array(N), sax: F64(N), say: F64(N), saz: F64(N), saOn: new Uint8Array(N).fill(1), saOm: F64(N), rotA: F64(N),
    _rdPairSet: null, _rdPairN: 0, relDrag: { law: 'inertial', Wbg: POP.Wbg, eps: POP.eps, pairs: 'all' }, params: { softening: POP.eps } };
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
/** 合成の集団の正確な対の和(html の関数)と平均場 */
export function popEval(H, S, mf, o = {}) {
  const n = S.n, C = 1 / POP.Wbg, eps = POP.eps;
  const T = scratchOf(S, n, {});
  ORIG.inertialDrag3RotTerm(T, n, C, eps);
  ORIG.inertialDrag3AxialOmega(T, n, POP.kappa, eps);
  const B = scratchOf(S, n, {});
  E(H, 'dfmInertialDrag3Build')(B, n, true, C, eps * eps, null);
  const om = [T._rdWX, T._rdWY, T._rdWZ], sr = [T._rdUX, T._rdUY, T._rdUZ], DG = B._rdDeg;
  // 平均場: 平均スピン密度 σ = Σ m Ω â / V・方向の平均 ⟨μ²⟩
  let sx = 0, sy = 0, sz = 0, oMx = 0, oMy = 0, oMz = 0;
  for (let j = 0; j < n; j++) { const w = S.m[j] * S.spin[j]; sx += w * S.sax[j]; sy += w * S.say[j]; sz += w * S.saz[j]; oMx += S.spin[j] * S.sax[j]; oMy += S.spin[j] * S.say[j]; oMz += S.spin[j] * S.saz[j]; }
  sx /= mf.vol; sy /= mf.vol; sz /= mf.vol; oMx /= n; oMy /= n; oMz /= n;
  const mu2 = o.mu2;
  // 自己の胞を除いた平均場(受け手のまわりの Wigner–Seitz の胞 a = (3/(4πn))^(1/3)〔球〕・1/√(πn)〔円盤〕の中の連続の寄与を引く —— 回転引きずりの g は対称で 0)
  const nDen = n / mf.vol, e2c = eps * eps, aCell = o.geom === 'ball' ? Math.cbrt(3 / (4 * Math.PI * nDen)) : 1 / Math.sqrt(Math.PI * nDen);
  const cellK = o.geom === 'ball' ? 2 * Math.PI * (Math.log((aCell * aCell + e2c) / e2c) + e2c / (aCell * aCell + e2c) - 1) : 2 * Math.PI * (Math.atan(aCell / eps) / (2 * eps) - aCell / (2 * (aCell * aCell + e2c)));
  const WX = F64(n), WY = F64(n), WZ = F64(n);
  const MX = F64(n), MY = F64(n), MZ = F64(n), RX = F64(n), RY = F64(n), RZ = F64(n);
  const inner = new Uint8Array(n), all = new Uint8Array(n).fill(1);
  let rmax = 0; for (let i = 0; i < n; i++) rmax = Math.max(rmax, hypot3(S.x[i], S.y[i], S.z[i]));
  for (let i = 0; i < n; i++) {
    const r = hypot3(S.x[i], S.y[i], S.z[i]), ik = mf.IK(r), g = mf.g(r);
    MX[i] = POP.kappa * mu2 * sx * ik; MY[i] = POP.kappa * mu2 * sy * ik; MZ[i] = POP.kappa * mu2 * sz * ik;
    const iw = Math.max(0, ik - cellK); WX[i] = POP.kappa * mu2 * sx * iw; WY[i] = POP.kappa * mu2 * sy * iw; WZ[i] = POP.kappa * mu2 * sz * iw;
    const ex = r > 0 ? S.x[i] / r : 0, ey = r > 0 ? S.y[i] / r : 0, ez = r > 0 ? S.z[i] / r : 0;
    RX[i] = C * g * (sy * ez - sz * ey); RY[i] = C * g * (sz * ex - sx * ez); RZ[i] = C * g * (sx * ey - sy * ex);
    inner[i] = r < 0.5 * mf.Rout ? 1 : 0;
  }
  const err = (A, B, mask) => {   // A = 平均場・B = 正確
    let mA = [0, 0, 0], mB = [0, 0, 0], k = 0, d2 = 0, b2 = 0;
    for (let i = 0; i < n; i++) { if (!mask[i]) continue; k++; for (let c = 0; c < 3; c++) { mA[c] += A[c][i]; mB[c] += B[c][i]; } const dx = A[0][i] - B[0][i], dy = A[1][i] - B[1][i], dz = A[2][i] - B[2][i]; d2 += dx * dx + dy * dy + dz * dz; b2 += B[0][i] ** 2 + B[1][i] ** 2 + B[2][i] ** 2; }
    mA = mA.map((v) => v / k); mB = mB.map((v) => v / k);
    const mb = hypot3(...mB);
    return { k, meanRel: mb > 0 ? hypot3(mA[0] - mB[0], mA[1] - mB[1], mA[2] - mB[2]) / mb : null, rmsRel: b2 > 0 ? Math.sqrt(d2 / b2) : null, exactRms: Math.sqrt(b2 / k), mfMeanAbs: hypot3(...mA), exactMeanAbs: mb };
  };
  // ⟨μ²⟩ の K の重みの平均(正確): |ω_i|/(κ m Ω Σ K) —— Σ m K は deg/C(平行な軸・同じ |Ω| のとき)
  let mu2k = 0, mk = 0;
  if (o.parallel) for (let i = 0; i < n; i++) if (inner[i] && DG[i] > 0) { mu2k += hypot3(om[0][i], om[1][i], om[2][i]) / (POP.kappa * POP.Om) / (DG[i] / C); mk++; }
  // 平均の自転速度の読み: ⟨ν ω⟩ と慣性自転の平均 ⟨Ω â⟩ の比(内側の受け手)
  const normOf = E(H, 'inertialDragNormOf'), rd = S.relDrag;
  let wx = 0, wy = 0, wz = 0, kk = 0, degM = 0;
  for (let i = 0; i < n; i++) { if (!inner[i]) continue; const nu = normOf(rd, DG[i]); wx += nu * om[0][i]; wy += nu * om[1][i]; wz += nu * om[2][i]; kk++; degM += DG[i]; }
  wx /= kk; wy /= kk; wz /= kk; degM /= kk;
  const omMean = hypot3(oMx, oMy, oMz);
  const satur = POP.kappa * POP.Wbg * mu2;   // 稠密の極限の比 κ W_bg ⟨μ²⟩(平均場の式 ν ω/Ω = κ⟨μ²⟩ρI/(1 + CρI) → κ⟨μ²⟩/C)
  const ikC = mf.IK(0), rhoM = n * POP.m / mf.vol, tauMF = POP.kappa * mu2 * rhoM * ikC / (1 + C * rhoM * ikC);
  const sn = hypot3(sx, sy, sz), ref = { a: sn > 0 ? [sx / sn, sy / sn, sz / sn] : [0, 0, 1], o: [0, 0, 0] };
  const mOm = momentsOf(om, all, n, ref, S.x, S.y, S.z), mOmF = momentsOf([MX, MY, MZ], all, n, ref, S.x, S.y, S.z), mOmW = momentsOf([WX, WY, WZ], all, n, ref, S.x, S.y, S.z);
  const mSr = momentsOf(sr, all, n, ref, S.x, S.y, S.z), mSrF = momentsOf([RX, RY, RZ], all, n, ref, S.x, S.y, S.z);
  const ikW = Math.max(0, ikC - cellK), tauMFcell = POP.kappa * mu2 * rhoM * ikW / (1 + C * rhoM * ikW);
  const res = { n, cell: { a: aCell, K: cellK, IK0: ikC }, omega: { inner: err([MX, MY, MZ], om, inner), all: err([MX, MY, MZ], om, all), flowErr: flowErr(mOmF, mOm), fluctFrac: mOm.frame.thermFrac,
      cell: { inner: err([WX, WY, WZ], om, inner), all: err([WX, WY, WZ], om, all), flowErr: flowErr(mOmW, mOm) } },
    sRot: { inner: err([RX, RY, RZ], sr, inner), all: err([RX, RY, RZ], sr, all), flowErr: flowErr(mSrF, mSr), fluctFrac: mSr.frame.thermFrac },
    mu2Assumed: mu2, mu2K: mk ? mu2k / mk : null, meanSpin: { tau: omMean > 0 ? hypot3(wx, wy, wz) / omMean : null, tauMF, tauMFcell, saturation: satur, degMean: degM, nuMean: 1 / (1 + degM), sourceMeanSpin: omMean },
    moments: o.moments ? { omega: mOm, sRot: mSr } : undefined };
  if (o.solve) {
    const fixed = new Uint8Array(n);
    const u = solveRows(B._rdA, DG, fixed, n, sr[0], sr[1], sr[2]);
    const mS = mSr, mU = momentsOf(u, all, n, ref, S.x, S.y, S.z);
    res.filter = { flowRatio: mS.frame.flow > 0 ? Math.sqrt(mU.frame.flow / mS.frame.flow) : null, thermRatio: mS.frame.therm > 0 ? Math.sqrt(mU.frame.therm / mS.frame.therm) : null,
      nuMean: res.meanSpin.nuMean, sThermFrac: mS.frame.thermFrac, uThermFrac: mU.frame.thermFrac };
    res.pressure = pressureOf(S, u, o.geom, ref.a);
  }
  return res;
}
/** 斥力の候補: 半径の帯(6 帯)ごとの揺らぎの二次モーメント(帯の一次の当てはめ〔滑らかな流れ〕を引いた残り)から P_b = ρ_b tr(var)/3 と
 *  外向きの勾配 a = −ΔP/(ρ̄ Δr)(読み口 —— 力として足さない)。枠: 球は中心からの r̂・接線 t̂ = â × r̂・第 3 軸 / 円盤は面内の r̂・ẑ × r̂・ẑ */
export function pressureOf(S, U, geom, axis, nb = 6) {
  const n = S.n, rows = [], [ax, ay, az] = axis;
  for (let i = 0; i < n; i++) {
    const rx = S.x[i], ry = S.y[i], rz = S.z[i], r = geom === 'ball' ? hypot3(rx, ry, rz) : Math.hypot(rx, ry);
    const ex = r > 0 ? rx / r : 0, ey = r > 0 ? ry / r : 0, ez = (geom === 'ball' && r > 0) ? rz / r : 0;
    let tx, ty, tz;
    if (geom === 'ball') { tx = ay * ez - az * ey; ty = az * ex - ax * ez; tz = ax * ey - ay * ex; const tn = hypot3(tx, ty, tz); if (tn > 0) { tx /= tn; ty /= tn; tz /= tn; } }
    else { tx = -ey; ty = ex; tz = 0; }
    const wx = ey * tz - ez * ty, wy = ez * tx - ex * tz, wz = ex * ty - ey * tx;
    const ux = U[0][i], uy = U[1][i], uz = U[2][i];
    rows.push({ rho: r, ur: ux * ex + uy * ey + uz * ez, ut: ux * tx + uy * ty + uz * tz, uw: ux * wx + uy * wy + uz * wz, m: S.m[i] });
  }
  rows.sort((a, b) => a.rho - b.rho);
  const bins = [];
  for (let b = 0; b < nb; b++) {
    const s = rows.slice(Math.floor(b * n / nb), Math.floor((b + 1) * n / nb)), k = s.length;
    if (!k) continue;
    const r0 = b === 0 ? 0 : s[0].rho, r1 = s[k - 1].rho;
    const vol = geom === 'ball' ? 4 / 3 * Math.PI * (r1 ** 3 - r0 ** 3) : Math.PI * (r1 * r1 - r0 * r0);
    const dr = detrend(s, 'ur'), dt = detrend(s, 'ut'), dw = detrend(s, 'uw');
    const vr = dr.res / k, vt = dt.res / k, vz = dw.res / k;
    const rho = s.reduce((z, p) => z + p.m, 0) / (vol > 0 ? vol : 1);
    bins.push({ k, rMid: s.reduce((z, p) => z + p.rho, 0) / k, rho, flowT: dt.m, flowR: dr.m, flowMs: (dr.smooth + dt.smooth + dw.smooth) / k, sigR2: vr, sigT2: vt, sigZ2: vz, P: rho * (vr + vt + vz) / 3, Prr: rho * vr });
  }
  let aOutMax = -Infinity, aAbsMax = 0, at = null;
  for (let b = 0; b + 1 < bins.length; b++) {
    const p = bins[b], q = bins[b + 1], rb = 0.5 * (p.rho + q.rho), dr = q.rMid - p.rMid;
    if (!(dr > 0) || !(rb > 0)) continue;
    const a = -(q.P - p.P) / (rb * dr);
    if (a > aOutMax) { aOutMax = a; at = 0.5 * (p.rMid + q.rMid); }
    aAbsMax = Math.max(aAbsMax, Math.abs(a));
  }
  const flowT2 = bins.reduce((z, b) => z + b.k * b.flowMs, 0) / n, sig2 = bins.reduce((z, b) => z + b.k * (b.sigR2 + b.sigT2 + b.sigZ2), 0) / n;
  return { bins: bins.length, aOutMax, aOutAt: at, aAbsMax, sigOverFlow: flowT2 > 0 ? Math.sqrt(sig2 / flowT2) : null, PMax: Math.max(...bins.map((b) => b.P)), table: bins.map((b) => ({ rMid: b.rMid, rho: b.rho, P: b.P, Prr: b.Prr, flowT: b.flowT })) };
}

/** 🍥 の写しの平均場(環の粒 = 一様な円環・中心は正確 —— 支配天体の寄与は写しの状態で源を中心だけにして呼ぶ)*/
function mfBookHook(H, extra) {
  let mfT = null, calls = 0;
  const acc = { omInner: [], sRotInner: [], omAll: [], sRotAll: [], press: [] };
  return (S, n, cur, q) => {
    calls++;
    {   // 斥力の候補(u_rot の揺らぎ —— 円盤の面内の帯)と同じ半径の重力 G M(<r)/r²(器の数 —— 力として足さない)
      const G = S.params.G, idx = []; for (let i = 0; i < n; i++) if (q.free[i]) idx.push(i);
      const T = { n: idx.length, x: Float64Array.from(idx.map((i) => q.X0[i])), y: Float64Array.from(idx.map((i) => q.Y0[i])), z: Float64Array.from(idx.map((i) => q.Z0[i])), m: Float64Array.from(idx.map((i) => S.m[i])) };
      const U = [0, 1, 2].map((c) => Float64Array.from(idx.map((i) => q.uRot[c][i])));
      const P = pressureOf(T, U, 'disk', [0, 0, 1]);
      if (P.aOutAt !== null) {
        let Min = 0; for (let i = 0; i < n; i++) if (Math.hypot(q.X0[i], q.Y0[i], q.Z0[i]) < P.aOutAt) Min += S.m[i];
        acc.press.push({ aOut: P.aOutMax, at: P.aOutAt, g: G * Min / (P.aOutAt * P.aOutAt), sigOverFlow: P.sigOverFlow });
      }
    }
    if (calls % 12 !== 1) return;   // 平均場の表は 12 標本に 1 回
    const pop = []; for (let i = 1; i < n; i++) pop.push(i);
    let rin = Infinity, rout = 0, sx = 0, sy = 0, sz = 0;
    const K = cur.K;
    for (const i of pop) { const r = Math.hypot(K[0][i], K[1][i]); rin = Math.min(rin, r); rout = Math.max(rout, r); }
    mfT = mfTable(H, 'disk', rin, rout, cur.eps, S.radOv[1], 48);
    for (const j of pop) { const w = S.m[j] * S.spin[j]; sx += w * cur.axes[0][j]; sy += w * cur.axes[1][j]; sz += w * cur.axes[2][j]; }
    sx /= mfT.vol; sy /= mfT.vol; sz /= mfT.vol;
    // 支配天体だけの寄与(正確 —— 質量 0 にした他の源)
    const sp = F64(n); sp[0] = S.spin[0];
    const T = scratchOf(S, n, { spin: sp });
    ORIG.inertialDrag3RotTerm(T, n, cur.C, cur.eps, K[0], K[1], K[2]);
    ORIG.inertialDrag3AxialOmega(T, n, KAPPA_REF, cur.eps, K[0], K[1], K[2]);
    // 平均場の ⟨μ²⟩ = (1 − (â·ẑ)²)/2(円環の面内の向き —— 平均の軸)
    const an = hypot3(sx, sy, sz) || 1, mu2 = (1 - (sz / an) ** 2) / 2;
    const MX = F64(n), MY = F64(n), MZ = F64(n), RX = F64(n), RY = F64(n), RZ = F64(n), inner = new Uint8Array(n), all = new Uint8Array(n);
    for (const i of pop) {
      const r = Math.hypot(K[0][i], K[1][i]), ik = mfT.IK(r), g = mfT.g(r), ex = K[0][i] / r, ey = K[1][i] / r;
      MX[i] = KAPPA_REF * mu2 * sx * ik + T._rdWX[i]; MY[i] = KAPPA_REF * mu2 * sy * ik + T._rdWY[i]; MZ[i] = KAPPA_REF * mu2 * sz * ik + T._rdWZ[i];
      RX[i] = cur.C * g * (sy * 0 - sz * ey) + T._rdUX[i]; RY[i] = cur.C * g * (sz * ex - sx * 0) + T._rdUY[i]; RZ[i] = cur.C * g * (sx * ey - sy * ex) + T._rdUZ[i];
      all[i] = 1; inner[i] = (r > rin + 0.25 * (rout - rin) && r < rout - 0.25 * (rout - rin)) ? 1 : 0;
    }
    const e = (A, B, mask) => { let d2 = 0, b2 = 0; for (let i = 0; i < n; i++) { if (!mask[i]) continue; d2 += (A[0][i] - B[0][i]) ** 2 + (A[1][i] - B[1][i]) ** 2 + (A[2][i] - B[2][i]) ** 2; b2 += B[0][i] ** 2 + B[1][i] ** 2 + B[2][i] ** 2; } return b2 > 0 ? Math.sqrt(d2 / b2) : null; };
    acc.omInner.push(e([MX, MY, MZ], cur.omega, inner)); acc.omAll.push(e([MX, MY, MZ], cur.omega, all));
    acc.sRotInner.push(e([RX, RY, RZ], cur.sRot, inner)); acc.sRotAll.push(e([RX, RY, RZ], cur.sRot, all));
    const av = (a) => { const v = a.filter(Number.isFinite); return v.length ? v.reduce((x, y) => x + y, 0) / v.length : null; };
    const pr = acc.press;
    extra.mf = { samples: acc.omInner.length, mu2: mu2, annulus: [rin, rout], omegaRmsRel: { inner: av(acc.omInner), all: av(acc.omAll) }, sRotRmsRel: { inner: av(acc.sRotInner), all: av(acc.sRotAll) },
      pressure: pr.length ? { samples: pr.length, aOutMean: av(pr.map((z) => z.aOut)), aOutMax: Math.max(...pr.map((z) => z.aOut)), gAtMean: av(pr.map((z) => z.g)), ratioMax: Math.max(...pr.map((z) => z.aOut / z.g)), sigOverFlowMean: av(pr.map((z) => z.sigOverFlow)) } : null };
  };
}

/* ───────────────────────── 段 K(運動学の恒等式と逆回転の集団)───────────────────────── */
export function partIdentity() {
  const Om = [0, 0, 3], R = 2, rows = [];
  for (const N of [100, 1000, 10000]) {
    // 一様球面(Fibonacci の点)と一様球(半径の 3 乗根の Halton)
    for (const kind of ['sphere', 'ball']) {
      const Q = [F64(N), F64(N), F64(N)], X = F64(N), Y = F64(N), Z = F64(N);
      const ga = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < N; i++) {
        let x, y, z;
        if (kind === 'sphere') { const zz = 1 - 2 * (i + 0.5) / N, s = Math.sqrt(1 - zz * zz), ph = i * ga; x = R * s * Math.cos(ph); y = R * s * Math.sin(ph); z = R * zz; }
        else { const r = R * Math.cbrt(halton(i + 1, 2)), ct = 2 * halton(i + 1, 3) - 1, st = Math.sqrt(1 - ct * ct), ph = 2 * Math.PI * halton(i + 1, 5); x = r * st * Math.cos(ph); y = r * st * Math.sin(ph); z = r * ct; }
        X[i] = x; Y[i] = y; Z[i] = z;
        Q[0][i] = Om[1] * z - Om[2] * y; Q[1][i] = Om[2] * x - Om[0] * z; Q[2][i] = Om[0] * y - Om[1] * x;
      }
      const m = momentsOf(Q, null, N, { a: [0, 0, 1], o: [0, 0, 0] }, X, Y, Z);
      const f = kind === 'sphere' ? R * R / 3 : R * R / 5, O2 = Om[0] ** 2 + Om[1] ** 2 + Om[2] ** 2;
      const exp = [f * (O2 - Om[0] ** 2), f * (O2 - Om[1] ** 2), f * (O2 - Om[2] ** 2)], expMs = 2 * f * O2;
      rows.push({ kind, N, mean: m.mean.map((v) => sci(v, 4)), covDiag: [m.cov[0], m.cov[1], m.cov[2]].map((v) => sci(v, 8)), covOff: Math.max(Math.abs(m.cov[3]), Math.abs(m.cov[4]), Math.abs(m.cov[5])),
        meanSq: sci(m.meanSq, 8), expected: { diag: exp, meanSq: expMs }, meanAbsRel: m.meanAbs / Math.sqrt(expMs), diagErrRel: Math.max(...[0, 1].map((k) => Math.abs(m.cov[k] / exp[k] - 1))), zz: m.cov[2], meanSqErrRel: Math.abs(m.meanSq / expMs - 1) });
    }
  }
  // 逆回転の集団: Ω と −Ω が半数ずつ —— 平均 0・二乗平均 Ω²
  const sp = []; for (let i = 0; i < 200; i++) sp.push(i % 2 ? -0.5 : 0.5);
  const mean = sp.reduce((a, b) => a + b, 0) / sp.length, ms = sp.reduce((a, b) => a + b * b, 0) / sp.length;
  return { omega: Om, radius: R, rows, pm: { N: sp.length, mean, meanSq: ms } };
}

/* ───────────────────────── 段 S(合成の集団の走査)───────────────────────── */
export function partScan(H, quick) {
  const base = { N: 200, R: 20, tilt: 30 };
  const Ns = quick ? [50, 200] : [50, 100, 200, 400, 800], Rs = quick ? [20] : [10, 20, 40], tilts = quick ? [0, 30, 90] : [0, 30, 60, 90];
  const cfgs = [];
  for (const geom of ['ball', 'disk']) {
    for (const N of Ns) cfgs.push({ geom, N, R: base.R, tilt: base.tilt, sign: 'same', axis: 'N' });
    for (const R of Rs) if (R !== base.R) cfgs.push({ geom, N: base.N, R, tilt: base.tilt, sign: 'same', axis: 'R' });
    for (const t of tilts) if (t !== base.tilt) cfgs.push({ geom, N: base.N, R: base.R, tilt: t, sign: 'same', axis: 'tilt' });
    cfgs.push({ geom, N: base.N, R: base.R, tilt: base.tilt, sign: 'pm', axis: 'pm' });
  }
  const tables = new Map(), rows = [];
  for (const c of cfgs) {
    const tk = c.geom + ':' + c.R;
    if (!tables.has(tk)) tables.set(tk, mfTable(H, c.geom, 0, c.R, POP.eps, POP.Rsrc, 64));
    const mf = tables.get(tk), S = popState(c.geom, c.N, c.R, c.tilt, c.sign);
    const mu2 = c.geom === 'ball' ? 1 / 3 : Math.sin(c.tilt * Math.PI / 180) ** 2 / 2;
    const t0 = Date.now();
    const q = popEval(H, S, mf, { mu2, parallel: c.sign === 'same', solve: true, geom: c.geom, moments: c.sign === 'pm' });
    rows.push({ ...c, mu2Assumed: mu2, mu2K: q.mu2K, omega: q.omega, sRot: q.sRot, meanSpin: q.meanSpin, filter: q.filter, pressure: q.pressure,
      pmMoments: q.moments ? { omegaMeanAbs: q.moments.omega.meanAbs, omegaRms: Math.sqrt(q.moments.omega.meanSq), sRotMeanAbs: q.moments.sRot.meanAbs, sRotRms: Math.sqrt(q.moments.sRot.meanSq) } : undefined,
      wallSec: (Date.now() - t0) / 1000 });
  }
  return { base, pop: POP, rows };
}

/* ───────────────────────── 段 O(有限回転の順序)───────────────────────── */
const rotAbout = (v, p, th) => {   // v を単位ベクトル p のまわりに th(Rodrigues —— エンジンの軸の回し方と同じ形)
  const c = Math.cos(th), s = Math.sin(th);
  let x = v[0] * c + (p[1] * v[2] - p[2] * v[1]) * s, y = v[1] * c + (p[2] * v[0] - p[0] * v[2]) * s, z = v[2] * c + (p[0] * v[1] - p[1] * v[0]) * s;
  const nn = hypot3(x, y, z); return [x / nn, y / nn, z / nn];
};
const turnPerp = (a, w, dt) => {   // 軸 a を ω の垂直成分で回す(ω∥ は rotA へ —— 軸は回さない)
  const wp = w[0] * a[0] + w[1] * a[1] + w[2] * a[2], px = w[0] - wp * a[0], py = w[1] - wp * a[1], pz = w[2] - wp * a[2], wq = hypot3(px, py, pz);
  return wq > 0 ? rotAbout(a, [px / wq, py / wq, pz / wq], wq * dt) : a;
};
export function partOrder(H, quick) {
  const N = quick ? 60 : 100, S = popState('ball', N, 20, 30, 'same', 'golden'), n = S.n, eps = POP.eps;
  // (a) エンジンの和: 源の並びを逆にした写し(全配列を逆順)と元の ω・AxialApply の後の軸
  const rev = (a) => { const b = new a.constructor(a.length); for (let i = 0; i < a.length; i++) b[i] = a[a.length - 1 - i]; return b; };
  const Sr = { ...S }; for (const k of ['x', 'y', 'z', 'vx', 'vy', 'vz', 'm', 'spin', 'radOv', 'R', 'pinned', 'sax', 'say', 'saz', 'saOn', 'saOm', 'rotA']) Sr[k] = rev(S[k]);
  const run = (St, dt) => {
    const T = Object.assign({}, St, { sax: Float64Array.from(St.sax), say: Float64Array.from(St.say), saz: Float64Array.from(St.saz), rotA: Float64Array.from(St.rotA), _rdWX: null, _rdWY: null, _rdWZ: null, _rdWS: null,
      inertialDrag3AxN: 0, inertialDrag3AxOmMax: 0, inertialDrag3AxL: [0, 0, 0], inertialDrag3AxRotA: 0, inertialDrag3AxAxisN: 0, inertialDrag3AxPerpSkip: 0, inertialDrag3AxPerpSkipMax: 0, rotADr: null });
    ORIG.inertialDrag3AxialOmega(T, n, POP.kappa, eps);
    const W = [Float64Array.from(T._rdWX), Float64Array.from(T._rdWY), Float64Array.from(T._rdWZ)];
    E(H, 'inertialDrag3AxialApply')(T, n, dt);
    return { W, sax: T.sax, say: T.say, saz: T.saz, rotA: T.rotA, turned: T.inertialDrag3AxAxisN };
  };
  const dt0 = 0.016;
  const A = run(S, dt0), B = run(Sr, dt0);
  let wDiff = 0, wMax = 0, aDiff = 0, rDiff = 0, angMax = 0;
  for (let i = 0; i < n; i++) {
    const j = n - 1 - i;
    wDiff = Math.max(wDiff, hypot3(A.W[0][i] - B.W[0][j], A.W[1][i] - B.W[1][j], A.W[2][i] - B.W[2][j])); wMax = Math.max(wMax, hypot3(A.W[0][i], A.W[1][i], A.W[2][i]));
    aDiff = Math.max(aDiff, hypot3(A.sax[i] - B.sax[j], A.say[i] - B.say[j], A.saz[i] - B.saz[j])); rDiff = Math.max(rDiff, Math.abs(A.rotA[i] - B.rotA[j]));
    angMax = Math.max(angMax, Math.acos(Math.min(1, A.sax[i] * S.sax[i] + A.say[i] * S.say[i] + A.saz[i] * S.saz[i])));
  }
  // (b) 源ごとの ω_ij(源を 1 つだけ自転させた写し)と有限回転の順序付きの積
  const per = [];
  for (let j = 0; j < n; j++) {
    const sp = F64(n); sp[j] = S.spin[j];
    const T = { ...S, spin: sp, _rdWX: null, _rdWY: null, _rdWZ: null, _rdWS: null };
    ORIG.inertialDrag3AxialOmega(T, n, POP.kappa, eps);
    per.push([Float64Array.from(T._rdWX), Float64Array.from(T._rdWY), Float64Array.from(T._rdWZ)]);
  }
  // ベクトル和とエンジンの ω の一致(和の順序の丸めだけ)
  let sumDiff = 0;
  for (let i = 0; i < n; i++) { let x = 0, y = 0, z = 0; for (let j = 0; j < n; j++) { x += per[j][0][i]; y += per[j][1][i]; z += per[j][2][i]; } sumDiff = Math.max(sumDiff, hypot3(x - A.W[0][i], y - A.W[1][i], z - A.W[2][i]) / (wMax || 1)); }
  const prodOf = (dt) => {
    let fr = 0, fs = 0, ang = 0;
    for (let i = 0; i < n; i++) {
      const a0 = [S.sax[i], S.say[i], S.saz[i]];
      let f = a0, r = a0;
      for (let j = 0; j < n; j++) f = turnPerp(f, [per[j][0][i], per[j][1][i], per[j][2][i]], dt);
      for (let j = n - 1; j >= 0; j--) r = turnPerp(r, [per[j][0][i], per[j][1][i], per[j][2][i]], dt);
      const s = turnPerp(a0, [A.W[0][i], A.W[1][i], A.W[2][i]], dt);
      fr = Math.max(fr, hypot3(f[0] - r[0], f[1] - r[1], f[2] - r[2])); fs = Math.max(fs, hypot3(f[0] - s[0], f[1] - s[1], f[2] - s[2]));
      ang = Math.max(ang, Math.acos(Math.min(1, s[0] * a0[0] + s[1] * a0[1] + s[2] * a0[2])));
    }
    return { dt, fwdVsRev: fr, fwdVsSum: fs, turnMax: ang };
  };
  const ph = [prodOf(dt0), prodOf(dt0 / 2), prodOf(dt0 * 4)];
  return { pop: { geom: 'ball', N, R: 20, tilt: 30, axes: 'golden' }, engine: { omegaRevMaxRel: wMax > 0 ? wDiff / wMax : 0, axisRevMax: aDiff, rotARevMax: rDiff, axisTurnMax: angMax, turned: A.turned, sumVsPerSourceRel: sumDiff },
    product: ph, ratioH: ph[0].fwdVsRev / ph[1].fwdVsRev, ratioSumH: ph[0].fwdVsSum / ph[1].fwdVsSum };
}

/* ───────────────────────── 表(PHYSICS の行)と門 ───────────────────────── */
const f3 = (v) => (v === null || v === undefined || !Number.isFinite(v)) ? '—' : (v === 0 ? '0' : (Math.abs(v) >= 1e-3 && Math.abs(v) < 1e4 ? String(Number(v.toPrecision(4))) : v.toExponential(2)));
const yn = (b) => (b ? '真' : '偽');
export const fmtNum = f3;
export function physicsTables(J) {
  const L = [];
  L.push('| 写し | 步 | 源 | 慣性自転の不変 | 姿勢(慣性の角)の不変 | A_ii = 0 | 源の数 = 慣性自転 | 呼び直しの同一(回転/軸) | 孤立した源の自己 0 | 二重計上の写しとの差(s_rot / ω の最大) |');
  L.push('|---|---|---|---|---|---|---|---|---|---|');
  for (const r of J.books) {
    const c = r.contract;
    if (!r.drag) { L.push(`| ${r.emoji} ${r.key} | ${r.steps} | — | 引きずりが走らない(gain 0) | — | — | — | — | ${yn(r.lone.ok)} | — |`); continue; }
    L.push(`| ${r.emoji} ${r.key} | ${c.steps} | ${c.nSrc} | ${c.spinSame}/${c.steps} | ${c.attSame}/${c.steps} | ${c.aDiagZero}/${c.steps} | ${c.srcOk}/${c.steps} | ${c.rotRecompute}/${c.steps} / ${c.axRecompute === null ? '—' : c.axRecompute + '/' + c.steps} | ${yn(r.lone.ok)} | ${c.variant ? f3(c.variant.rotMax) + ' / ' + f3(c.variant.axMax) : '軸引きずりなし'} |`);
  }
  L.push('');
  L.push('| 写し | 位置を運んだ角 ⟨|Φ|⟩ [rad] h / h/2 | 線形の步の外向き ⟨e₂/ρ⟩ h / h/2(比) | 動径の一次(核の位置)⟨δr⟩ / ⟨|δr|⟩ / 移送の道のり | 步の順序の遅れ ⟨δr_x − δr_K⟩ h / h/2(比) | 一様回転からの残り | 座標変換なら速度が回る量 ⟨Σ|v⊥||Δφ|/|v|⟩ | 姿勢・速度を回した角(エンジン) |');
  L.push('|---|---|---|---|---|---|---|---|');
  for (const r of J.books) {
    if (!r.coord || !r.coordH2) continue;
    const c = r.coord, h = r.coordH2;
    L.push(`| ${r.emoji} ${r.key} | ${f3(c.phiAbsMean)} / ${f3(h.phiAbsMean)} | ${f3(c.e2RelMean)} / ${f3(h.e2RelMean)}(${f3(r.coordRatio.e2)}) | ${f3(c.r1KMean)} / ${f3(c.r1KAbsMean)} / ${f3(c.pathMean)} | ${f3(c.lagMean)} / ${f3(h.lagMean)}(${f3(r.coordRatio.lag)}) | ${f3(c.nonRigid)} | ${f3(c.dvRelMean)} | 0 / 0 |`);
  }
  L.push('');
  L.push('| 写し | κ | ω: 平均ベクトル ⟨|ω|⟩ / √⟨|ω|²⟩ / 揺らぎの割合 | s_rot: 平均ベクトル / √⟨|s|²⟩ / 平均の回転率 ⟨s_t/ρ⟩ / 揺らぎの割合 | u_rot の揺らぎの割合 | 解の通過(流れ / 揺らぎ) |');
  L.push('|---|---|---|---|---|---|');
  for (const r of J.books) {
    if (!r.moments) continue;
    const m = r.moments;
    L.push(`| ${r.emoji} ${r.key} | ${r.kappa}(${r.kappaFrom === 'declared' ? '宣言' : '読み口'}) | ${f3(m.omega.meanAbsT)} / ${f3(m.omega.rmsT)} / ${f3(m.omega.thermFracT)} | ${f3(m.sRot.meanAbsT)} / ${f3(m.sRot.rmsT)} / ${f3(m.sRot.meanRateT)} / ${f3(m.sRot.thermFracT)} | ${f3(m.uRot.thermFracT)} | ${f3(m.filter.meanT)} / ${f3(m.filter.fluctT)} |`);
  }
  L.push('');
  L.push('| 集団 | N | 半径 | 傾き | 符号 | ⟨μ²⟩ 仮定 / K の重みの実測 | ω の平均場の相対の誤差 rms(内側 / 全)・帯の流れ | 同(自己の胞を除く) | s_rot の平均場の相対の誤差 rms(内側)・帯の流れ・揺らぎの割合 | 平均の自転速度の比 τ 実測 / 平均場 / 胞を除く / 稠密の極限 | 解の通過(流れ / 揺らぎ)・ν | 斥力の候補 外向きの最大 |');
  L.push('|---|---|---|---|---|---|---|---|---|---|---|---|');
  for (const r of J.scan.rows) {
    const o = r.omega, w = o.cell, q = r.sRot, t = r.meanSpin;
    L.push(`| ${r.geom} | ${r.N} | ${r.R} | ${r.tilt}° | ${r.sign === 'pm' ? '±Ω' : '+Ω'} | ${f3(r.mu2Assumed)} / ${f3(r.mu2K)} | ${f3(o.inner.rmsRel)} / ${f3(o.all.rmsRel)}・${f3(o.flowErr)} | ${f3(w.inner.rmsRel)} / ${f3(w.all.rmsRel)}・${f3(w.flowErr)} | ${f3(q.inner.rmsRel)}・${f3(q.flowErr)}・${f3(q.fluctFrac)} | ${f3(t.tau)} / ${f3(t.tauMF)} / ${f3(t.tauMFcell)} / ${f3(t.saturation)} | ${f3(r.filter.flowRatio)} / ${f3(r.filter.thermRatio)}・${f3(t.nuMean)} | ${f3(r.pressure.aOutMax)} |`);
  }
  L.push('');
  L.push('| 恒等式 | N | ⟨v⟩/√⟨|v|²⟩ | 共分散の対角の相対の誤差 | zz | 二乗平均の相対の誤差 |');
  L.push('|---|---|---|---|---|---|');
  for (const r of J.identity.rows) L.push(`| ${r.kind === 'sphere' ? '一様球面' : '一様球'} | ${r.N} | ${f3(r.meanAbsRel)} | ${f3(r.diagErrRel)} | ${f3(r.zz)} | ${f3(r.meanSqErrRel)} |`);
  L.push('');
  L.push('| 熱力学の語 | 器の量 | 器の数 | 言えること | 言えないこと |');
  L.push('|---|---|---|---|---|');
  for (const t of J.thermo) L.push(`| ${t.term} | ${t.quantity} | ${t.numbers} | ${t.can} | ${t.cannot} |`);
  return L.join('\n');
}
/** 正本から作る数の文字列(PHYSICS の本文に入っていること —— QA が照合) */
export function docNumbers(J) {
  const b = (k) => J.books.find((r) => r.key === k), base = J.scan.rows.find((r) => r.geom === 'ball' && r.axis === 'N' && r.N === 200), ne = b('spreadAx').noExpansion;
  const out = [f3(J.order.product[0].fwdVsRev), f3(J.order.engine.omegaRevMaxRel), f3(b('ring').coordRatio.lag), f3(base.omega.cell.inner.rmsRel), f3(base.meanSpin.tau),
    f3(ne.diffRhoRelMax), f3(ne.uniformPairRelMax)];
  return out.filter((s) => s !== '—' && s !== '0');
}
function thermoRows(J) {
  const b = (k) => J.books.find((r) => r.key === k), base = J.scan.rows.find((r) => r.geom === 'ball' && r.axis === 'N' && r.N === 200), pm = J.scan.rows.find((r) => r.geom === 'ball' && r.sign === 'pm');
  const disk = b('disk'), sAx = b('spreadAx'), sp = b('spread');
  const pr = sp.mf && sp.mf.pressure;
  return [
    { term: '流れ(平均)', quantity: '局所の枠の帯の平均(直交座標の平均ベクトルではない)・平均の自転速度の比 τ = |⟨ν ω⟩|/|⟨Ω â⟩|', numbers: `🔩 の s_rot の直交座標の平均 ${f3(disk.moments.sRot.meanAbsT)} に対し √⟨|s|²⟩ ${f3(disk.moments.sRot.rmsT)}・球の集団(N 200)の τ ${f3(base.meanSpin.tau)}(稠密の極限 κ W_bg ⟨μ²⟩ ${f3(base.meanSpin.saturation)})`,
      can: '軸引きずりの平均は慣性自転の平均の一定の割合(ν が同じ核の和で割る —— 離散の誤差が相殺)', cannot: '「平均の自転速度が決まった」とは言わない(κ は未較正の宣言)' },
    { term: '温度の候補(二次モーメント)', quantity: '帯の一次の当てはめの残り(揺らぎ)の分散', numbers: `逆回転の集団(球): 平均場 0・正確な ω の √⟨|ω|²⟩ ${f3(pm.pmMoments.omegaRms)}(平均 ${f3(pm.pmMoments.omegaMeanAbs)})・球 N 200 の s_rot の揺らぎの割合 ${f3(base.sRot.fluctFrac)}`,
      can: '平均だけでは逆回転の集団で 0 になる量を二次モーメントが保つ', cannot: '「温度を定義した」とは言わない(エネルギーの等分配・平衡の分布を測っていない)' },
    { term: '圧力・斥力の候補', quantity: 'P_b = ρ_b tr(var)/3 と外向きの勾配 −ΔP/(ρ̄Δr)(u_rot の揺らぎ)', numbers: `球 N 200 の外向きの最大 ${f3(base.pressure.aOutMax)}・🍥 の写しで ${pr ? f3(pr.aOutMax) : '—'}(重力の ${pr ? f3(pr.ratioMax) : '—'} 倍)`,
      can: '揺らぎの二次モーメントから圧力に似た量は作れる(読み口の値)', cannot: '「斥力を導いた」とは言わない(u は運動量を運ばない —— x += u·dt は v を触らない)' },
    { term: '粗視化', quantity: '平均場の近似(一様な密度・平均スピン密度・⟨μ²⟩・自己の胞)と連立の解の通過', numbers: `球 N 200 の内側の rms の相対の誤差 ω ${f3(base.omega.inner.rmsRel)} → 胞を除く ${f3(base.omega.cell.inner.rmsRel)}・s_rot ${f3(base.sRot.inner.rmsRel)}・解の通過 流れ ${f3(base.filter.flowRatio)}/揺らぎ ${f3(base.filter.thermRatio)}`,
      can: '連立の解 (I+L)u = s は滑らかな流れより揺らぎを強く弱める(1/(1+deg) の桁)', cannot: '「平均場が対の和を置き換えられる」とは言わない(回転引きずりは受け手ごとに揺らぎが主)' },
    { term: '状態方程式・エネルギーの収支', quantity: '一様・差動の座標回転と粒子間距離・線形の步の外向き', numbers: `一様回転の粒子間距離の相対の変化の最大 ${f3(sAx.noExpansion.uniformPairRelMax)}・差動回転の軸からの距離 ${f3(sAx.noExpansion.diffRhoRelMax)}・線形の步の外向きは h/2 で ${f3(disk.coordRatio ? 1 / disk.coordRatio.e2 : NaN)} 倍`,
      can: '座標の回転だけでは粒子は外へ広がらない(エンジンの外向きは刻みの誤差)', cannot: '「熱力学を導いた」とは言わない(未解像の運動の応力・運動量の移送・エネルギーの収支が無い)' },
  ];
}
export function gatesOf(J) {
  const live = J.books.filter((r) => r.drag);
  const g = {
    passThrough: J.pass.allSame === true,
    spinInvariant: live.every((r) => r.contract.spinSame === r.contract.steps && r.contract.steps > 0),
    attitudeByDrag: live.every((r) => r.contract.attSame === r.contract.steps),
    selfNumeratorZero: live.every((r) => r.contract.aDiagZero === r.contract.steps),
    sourcesInertialOnly: live.every((r) => r.contract.srcOk === r.contract.steps),
    rebuiltEveryStep: live.every((r) => r.contract.rotRecompute === r.contract.steps && (r.contract.axRecompute === null || r.contract.axRecompute === r.contract.steps)),
    loneSelfZero: J.books.every((r) => r.lone.ok),
    variantDiffers: live.filter((r) => r.axial).every((r) => r.contract.variant && r.contract.variant.axMax > 0),
    solveCheck: live.every((r) => r.contract.solveCheckMax < 1e-6),
    coordFirstOrder: live.filter((r) => r.coordRatio).every((r) => r.coordRatio.e2 > 1.6 && r.coordRatio.e2 < 2.5 && r.coordRatio.phi > 0.9 && r.coordRatio.phi < 1.1),
    orderEngineRounding: J.order.engine.omegaRevMaxRel < 1e-12 && J.order.engine.sumVsPerSourceRel < 1e-12,
    orderProductSecond: J.order.ratioH > 3 && J.order.ratioH < 5,
    identity: J.identity.rows.filter((r) => r.N === 10000).every((r) => r.diagErrRel < 5e-3 && r.meanSqErrRel < 5e-3 && Math.abs(r.zz) < 1e-20 + 1e-12 && r.meanAbsRel < 1e-2),
    pmMeanZero: J.identity.pm.mean === 0 && J.identity.pm.meanSq === 0.25 && J.scan.rows.filter((r) => r.sign === 'pm').every((r) => r.omega.inner.mfMeanAbs === 0 && r.pmMoments.omegaRms > 0),
    noExpansion: (() => { const x = J.books.find((r) => r.key === 'spreadAx').noExpansion; return x.uniformPairRelMax < 1e-12 && x.diffRhoRelMax < 1e-12; })(),
    scanFinite: J.scan.rows.every((r) => Number.isFinite(r.omega.all.rmsRel) || r.sign === 'pm' || r.mu2Assumed === 0),
  };
  return g;
}

export function runAll(H, o = {}) {
  const quick = !!o.quick, N = o.N || (quick ? 120 : 600);
  installWraps(H);
  const t = {};
  let t0 = Date.now();
  const pass = partPass(H, quick ? 30 : 80); t.pass = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now();
  const books = partBooks(H, N, { half: true, every: 10 }); t.books = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now();
  const order = partOrder(H, quick); t.order = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now();
  const identity = partIdentity(); t.identity = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now();
  const scan = partScan(H, quick); t.scan = { wallSec: (Date.now() - t0) / 1000 };
  const J = { steps: N, quick, kappaRef: KAPPA_REF, pass, books, order, identity, scan };
  J.thermo = thermoRows(J);
  J.gates = gatesOf(J);
  J.ok = Object.values(J.gates).every(Boolean);
  J.timing = t;
  return J;
}

export async function main() {
  const TARGET = process.env.W305D_TARGET || 'beta/index.html';
  const OUT = process.env.W305D_OUT || path.join(ROOT, 'tests', 'out', 'spinavg-w305d.json');
  const quick = process.env.W305D_QUICK === '1', N = Number(process.env.W305D_N) || 0;
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now();
  const W281A_SCOPE = w281aScopeStamp(html, REGEN_SCOPE);
  const H = loadHtmlHeadless(html);
  const R = runAll(H, { quick, N: N || undefined });
  const out = { version: HARNESS_VERSION, generator: 'tests/exp-w305d-spinavg.mjs', target: TARGET,
    targetSha256: crypto.createHash('sha256').update(fs.readFileSync(html)).digest('hex'),
    ruling: '原仮定者の裁定(第96報)後半(回転引きずり = 移動と回転の両方に効く座標変換・軸引きずり = 引きずり元による様々な軸の回転・多粒子の平均と熱力学との類似)・統括の検証項目 R202',
    spinVersion: H.evalExpr('REL_DRAG_SPIN3_VERSION'), axialLaw: H.evalExpr('REL_DRAG_AXIAL_LAW'), ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w305d-spinavg.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第305便d', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION,
    engine: 'Node の headless(tests/lib-w279b-headless.mjs の loadHtmlHeadless —— html の本文をそのまま実行・1 プロセス。html の関数を器の process の中で包む —— 素通りは段 P)',
    notClaim: ['熱力学を導いた', '斥力を導いた', '平均の自転速度が決まった', '回転引きずりが座標変換であることを示した'] });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s', JSON.stringify(out.timing));
}
if (IS_MAIN) await main();
