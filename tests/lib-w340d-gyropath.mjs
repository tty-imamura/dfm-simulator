// 第340便d(原仮定者の指示(2026-11-17 —— 第140報)「回転引きずり: 軸引きずりに公転が組み合わさって発生する力が回転引きずり。公転している天体の回転軸は遠方宇宙を向くが、
//   赤道面から離れて公転すると、軸引きずりで軸を倒れ込ませる力が働く。実際には、ジャイロトルクで90度回転方向にズレて倒れる力が働き、赤道面から遠い部位の倒れる力が大きいと、
//   赤道面へ引き寄せる力になる」「ジャイロトルク: 回転体の軸に対して、軸を傾ける力が、90度回転方向にズレて現れる力」「赤道面では、軸引きずりは軸を起き上がらせる力になる為、
//   ジャイロトルクで歳差運動を引き起こす」・原仮定者の指示(2026-11-12 —— 第135報)の回転引きずりの条件(引きずり半径 R_d・扁平の則・一様厚みの区間)・統括の検証項目 R359):
//   **回転引きずりの経路「軸引きずり + 公転 + ジャイロ」を受け手の部位ごとの力で数える型(T1)と、土星の環の帳簿に環の外の受け取り手(主の列)と方向別の係数(比べる列)を足す型(T2)の純関数**
//   (段 gyropath-340d —— 器 tests/exp-w340d-gyropath.mjs・正本 tests/out/gyropath-340d.json)。**探索の候補の表だけ** —— エンジン・内蔵の本・受理器・既存の lib の本文は変えない
//   (第338便b・第338便d・第339便a・第337便i・第337便a・第337便l の lib は呼ぶだけ)。html を読まない・ネットへ取りに行かない・乱数を使わない。
//
// ■ T1 の模型(無次元 —— 源の自転の速さ 1・源の G m 1・場の強さ A 1・長さの単位 r₀ —— 符号とべきを読む表なので単位は宣言で置く):
//   源(自転 s ŝ・ŝ = ẑ)の場の軸引きずりの回転 Ω(x) = A |x|^{−p} h_q(s ŝ, x̂)(h_q は第338便b の `twistAxis` —— 主の列 q = 1〔軸の方向で強さ 0〕・比べる列 q = 0〔2 倍角の則そのまま〕)。
//   受け手: 中心 X = r (cos el, 0, sin el)(仰角 el —— 傾いた円の軌道の一番高い点)・公転の速度 V = σ_V n r φ̂(n = r^{−3/2})・自転 ω_s L̂(L̂ は遠方宇宙に対して固定)・
//   有限の体(半径 R の球を立方の格子の点で —— Σξ = 0・Σξξ ∝ 単位の行列がちょうど成り立つ)/輪の粒子の組(L̂ に垂直な面の半径 R の円の点)/点(R → 0)。
//   部位 a(相対の位置 ξ_a・質量 m_a)に働く作用の型(どれも候補 —— 式の形を決め打ちしない):
//     drag  = m_a [Ω(x_a) × ξ_a − ω_s L̂ × ξ_a](部位の速度を場の回転へ寄せる —— 軸引きずりを「部位ごとの引きずり」と読む)
//     corV  = 2 m_a V × Ω(x_a)(回る座標の上を公転で動く部位の力 —— 重心の動きの分)
//     corS  = 2 m_a (ω_s L̂ × ξ_a) × Ω(x_a)(回る座標の上を自転で動く部位の力 —— 部位の差分だけ)
//     drag90 = sgn(ω_s) L̂ × (drag の部位の力)(**部位の力に 90° を当てた読み** —— 原文の「90度回転方向にズレて倒れる力」を部位の力の向きに当てる。実のトルクの歳差には使わない)
//   合力 F = Σ f_a と合トルク N = Σ ξ_a × f_a の両方を数える(トルクから重心の力は決まらない)。**ジャイロ(90° のずれ)は角運動量の式 dL/dt = N と歳差 Ω_prec = (L × N)/|L|² で書く**
//   (実のトルク N に 1 度だけ —— drag90 の列は部位の力の側の読みで、N から作る歳差に 90° を重ねない)。
// ■ T2(土星の環 —— 第338便d の lib の帳簿を呼ぶ): (A) 主の列 = 正味のトルクの行き先を環の外に置く口(土星の自転へ返す・共鳴の衛星〔ミマス〕—— 口の強さ η はノブ・η 一様)/
//   (B) 比べる列 = 半長軸の率と傾きの率に別の係数 c_a・c_i(消した分の角運動量と仕事は「行き先の未定の穴」の欄に書く)/第140報の赤道面の列(並進引きずりの順の分と軸引きずりの逆の分
//   —— 第338便b の 3 列〔A・B・B′〕の振幅 A(f)・行き先は順の分 = 源の自転・逆の分 = 背景宇宙)。
// ■ 薄い角(1e-3 rad より小さい傾き・ほぼ平行な 2 つの向きのなす角)は `Math.atan2(|外積|, 内積)` で求める(逆余弦で内積から戻さない)。
// ■ 言わないこと: 回転引きずりの機構が導けたとは書かない(この型・このノブの組ではこうなる、の表)。環が薄い理由が分かったとは書かない。アプリの型が経路から出た/出ない、とは書かない。
//   光速を超えるかどうかを判定に使わない。打ち消されたと仮定した後の値を結果と書かない(行き先を帳簿に置いた値だけ)。文献の値は未照合。
import { twistAxis, muOf, colAmp, COL_JA } from './lib-w338b-bevelknob.mjs';
import { k4Sets, dlnAFast, ringRates, evolveRing, srcOf, nOf, centerKm, LIT as LIT338D, DECL as D338D, SETS } from './lib-w338d-ringbook.mjs';
import { effectOfSpec, rdOf } from './lib-w337i-rotring.mjs';
import { DECL as D339A } from './lib-w339a-rotvert.mjs';
import { weight337 } from './lib-w337a-supply.mjs';
import { DECL as D337L, LIT as LIT337L } from './lib-w337l-bevel.mjs';

export const LIB_VERSION = 'w340d-gyropath-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const scl = (a, k) => [a[0] * k, a[1] * k, a[2] * k], add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (a) => { const n = nrm(a); return n > 0 ? scl(a, 1 / n) : [0, 0, 0]; };
const YR = 365.25 * 86400, AU = 1.495978707e11, MSUN = 1.98847e30;
/** 2 つの向きのなす角(薄い角でも桁を失わない —— atan2(|a × b|, a·b)) */
export const angleAtan2 = (a, b) => Math.atan2(nrm(crs(a, b)), dot(a, b));

/* ───────── 宣言(走らせたノブの格子と判定の物差しの記録 —— 式の形の宣言ではない)───────── */
export const ACTIONS = Object.freeze(['drag', 'corV', 'corS', 'drag90']);
export const ACTION_JA = Object.freeze({
  drag: 'drag —— 部位の速度を場の回転へ寄せる(m_a [Ω(x_a) × ξ_a − ω_s L̂ × ξ_a])',
  corV: 'corV —— 公転で動く部位の回る座標の力(2 m_a V × Ω(x_a) —— 重心の動きの分)',
  corS: 'corS —— 自転で動く部位の回る座標の力(2 m_a (ω_s L̂ × ξ_a) × Ω(x_a) —— 部位の差分だけ)',
  drag90: 'drag90 —— drag の部位の力に 90° を当てた読み(sgn(ω_s) L̂ × f_a —— 部位の力の側・歳差には使わない)',
});
export const DECL = Object.freeze({
  t1: Object.freeze({
    /** 主の列 q = 1(第140報 —— 軸の方向で軸引きずり 0 —— 第338便b の ⑪ の置き方)・比べる列 q = 0(2 倍角の則そのまま) */
    qGrid: Object.freeze([1, 0]), qMain: 1,
    /** 場の強さの落ち方のべき p(|x|^{−p})—— 第140報「差分なので、合成の重みは、質点からの距離の二乗に反比例する」の 2 を含めて 0〜4 */
    pGrid: Object.freeze([0, 1, 2, 3, 4]), pMain: 2,
    /** 仰角の格子(z/r = sin el)・半径の格子(n/s = r^{−3/2})・部位の大きさ R/r(主 0.01 と振る値) */
    zOverR: Object.freeze([-0.3, -0.1, -0.01, -0.001, 0, 0.001, 0.01, 0.1, 0.3]), rGrid: Object.freeze([0.5, 1, 2]), rMain: 1,
    ROverR: 0.01, ROverRScan: Object.freeze([0.1, 0.03, 0.01, 0.003]),
    /** 受け手の自転の速さ ω_s(源の自転に対する比)・立方の格子の半分の点の数(−k..k)・輪の点の数 */
    omegaS: 10, cubeK: 4, ringN: 64,
    bodies: Object.freeze(['sphere', 'ring']),
    /** 対照(主の列 q 1・p 2・球・r 1・z/r ±0.01) */
    controls: Object.freeze(['base', 'spin0', 'orbit0', 'Lflip', 'Ltilt30', 'sFlip', 'vRetro', 'point']),
    /** べきを読む点(z のべき: z/r 1e-3 と 1e-2・r のべき: z を固定〔1e-3〕して r 1 と 2) */
    zPowPts: Object.freeze([0.001, 0.01]), rPowPts: Object.freeze([1, 2]), zFixed: 0.001,
    /** 純関数の場面の差分の刻み・閉じた式との照合の物差し(R/r 0.01 の O((R/r)²) の内) */
    fdStep: 1e-5, closedTol: 1e-3,
  }),
  t2: Object.freeze({
    /** 環の中心 5(第338便d の宣言)・物差しの時間 1e7 年・漂いの物差し = 区分の幅(F 環は芯の幅 100 km)・薄さの物差し = 傾きが 1e7 年で e 分の 1 */
    centers: Object.freeze(['ringD', 'ringC', 'ringB', 'ringA', 'ringF']), tYr: 1e7, zMax: 10,
    /** 口の行き先(土星の自転・共鳴の衛星 ミマス〔半長軸 185 539 km —— 記憶の値・文献の値・未照合〕)と口の強さ η の点(1 − b/2 = 物差しの内・1 − 2b = 外・0 = 口なし)—— b は要る幅 */
    ports: Object.freeze(['spin', 'mimas']), mimasKm: 185539, etaPts: Object.freeze(['none', 'inside', 'outside']),
    /** 方向別の係数の格子(c_a・c_i) */
    caGrid: Object.freeze([1, 1e-3, 1e-6, 1e-7]), ciGrid: Object.freeze([1, 0.1, 0.01, 1e-3]),
    /** 第140報の赤道面の列(第338便b の 3 列 A・B・B′) */
    cols: Object.freeze(['A', 'B', 'Bp']),
  }),
  /** 丸めの残り(同じ単位の尺度の 1e-12 以下)を 0 と書く(正本は第338便c の settleRun で整える) */
  floor: 1e-12,
});

/* ───────── T1 場と受け手 ───────── */
/** 場の軸引きずりの回転 Ω(x) = A |x|^{−p} h_q(s ŝ, x̂) */
export function fieldOmega(x, { q, p, sSign = 1, A = 1 }) {
  const r = nrm(x); if (!(r > 0)) throw new RangeError('fieldOmega: 源の中心');
  return scl(twistAxis([0, 0, sSign], scl(x, 1 / r), q), A * Math.pow(r, -p));
}
/** 受け手の部位(球 = 立方の格子・輪 = 円の点・点 = 中心 1 点)—— 質量の和 1 */
export function partsOf(body, R, Lhat, { cubeK = DECL.t1.cubeK, ringN = DECL.t1.ringN } = {}) {
  if (body === 'point' || R === 0) return [{ xi: [0, 0, 0], m: 1 }];
  const out = [];
  if (body === 'sphere') {
    for (let i = -cubeK; i <= cubeK; i++) for (let j = -cubeK; j <= cubeK; j++) for (let k = -cubeK; k <= cubeK; k++) if (i * i + j * j + k * k <= cubeK * cubeK) out.push([i, j, k]);
    const h = R / cubeK; return out.map((g) => ({ xi: scl(g, h), m: 1 / out.length }));
  }
  if (body === 'ring') {
    const L = unit(Lhat), a = Math.abs(L[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0], e1 = unit(sub(a, scl(L, dot(a, L)))), e2 = crs(L, e1);
    for (let k = 0; k < ringN; k++) { const t = 2 * Math.PI * k / ringN; out.push({ xi: add(scl(e1, R * Math.cos(t)), scl(e2, R * Math.sin(t))), m: 1 / ringN }); }
    return out;
  }
  throw new RangeError('partsOf: 体 ' + body);
}
/** 受け手の宣言 → 中心・速度・自転 */
export function recvOf({ zOverR, r = DECL.t1.rMain, vSign = 1, orbit = true, omegaS = DECL.t1.omegaS, Lhat = [0, 0, 1] }) {
  if (!(Math.abs(zOverR) < 1) || !(r > 0)) throw new RangeError('recvOf: |z/r| < 1・r > 0');
  const se = zOverR, ce = Math.sqrt(1 - se * se), X = [r * ce, 0, r * se], n = Math.pow(r, -1.5), V = orbit ? [0, vSign * n * r, 0] : [0, 0, 0];
  return { X, V, omegaS, Lhat: unit(Lhat), r, z: r * se, el: [-se, 0, ce], rh: [ce, 0, se], phi: [0, 1, 0] };
}
/** 部位の力(作用の型ごと) */
function partForce(action, rc, pt, fp) {
  const x = add(rc.X, pt.xi), Om = fieldOmega(x, fp), w = scl(crs(rc.Lhat, pt.xi), rc.omegaS);
  if (action === 'drag') return scl(sub(crs(Om, pt.xi), w), pt.m);
  if (action === 'corV') return scl(crs(rc.V, Om), 2 * pt.m);
  if (action === 'corS') return scl(crs(w, Om), 2 * pt.m);
  if (action === 'drag90') { const sg = Math.sign(rc.omegaS); return sg === 0 ? [0, 0, 0] : scl(crs(rc.Lhat, sub(crs(Om, pt.xi), w)), sg * pt.m); }
  throw new RangeError('partForce: 型 ' + action);
}
/** 1 つの受け手の合力・合トルク・仕事・歳差・部位の上下の分け */
export function gyroRow({ action, q, p, sSign = 1, body = 'sphere', ROverR = DECL.t1.ROverR, ...rcSpec }) {
  const rc = recvOf(rcSpec), R = ROverR * rc.r, parts = partsOf(body, R, rc.Lhat), fp = { q, p, sSign };
  const up = Math.sign(rc.z) || 1;   // 赤道面から遠い側(z > 0 なら上の部位・z < 0 なら下の部位)
  let F = [0, 0, 0], N = [0, 0, 0], P = 0, Fs = 0, Ffar = [0, 0, 0], Fnear = [0, 0, 0], Nfar = [0, 0, 0], Nnear = [0, 0, 0], IL = 0;
  for (const pt of parts) {
    const f = partForce(action, rc, pt, fp), v = add(rc.V, scl(crs(rc.Lhat, pt.xi), rc.omegaS)), tq = crs(pt.xi, f), side = up * pt.xi[2];
    F = add(F, f); N = add(N, tq); P += dot(f, v); Fs += nrm(f);
    if (side > 0) { Ffar = add(Ffar, f); Nfar = add(Nfar, tq); } else if (side < 0) { Fnear = add(Fnear, f); Nnear = add(Nnear, tq); }
    const xl = dot(pt.xi, rc.Lhat); IL += pt.m * (dot(pt.xi, pt.xi) - xl * xl);
  }
  // 丸めの残り(同じ受け手の部位の力の大きさの和 × 1e-12 —— トルクは × R)を 0 と書く(打ち消しで 0 になる成分 —— 例: drag の合力の鉛直の成分は ∇×Ω が方位の向きなので 0)
  const fl = DECL.floor * Fs, nl = fl * Math.max(R, 1e-300), snapV = (v, t) => v.map((c) => (Math.abs(c) <= t ? 0 : c));
  F = snapV(F, fl); N = snapV(N, nl); Ffar = snapV(Ffar, fl); Fnear = snapV(Fnear, fl); Nfar = snapV(Nfar, nl); Nnear = snapV(Nnear, nl);
  if (Math.abs(P) <= fl * (nrm(rc.V) + Math.abs(rc.omegaS) * R)) P = 0;
  const L = scl(rc.Lhat, IL * rc.omegaS), L2 = dot(L, L), NL = dot(N, rc.Lhat), Nperp = sub(N, scl(rc.Lhat, NL));
  const prec = L2 > 0 ? scl(crs(L, N), 1 / L2) : null;
  const sv = (x) => (Math.abs(x) <= fl ? 0 : x), Fel = sv(dot(F, rc.el)), Fr = sv(dot(F, rc.rh)), Fphi = sv(dot(F, rc.phi));
  // 軸の傾きの向きの読み: θ = L̂ と ŝ の角(atan2)・dθ/dt(負 = 軸が源の軸へ寄る)・ŝ のまわりの L̂ の回り(歳差の向き)
  const sh = [0, 0, 1], th = angleAtan2(rc.Lhat, sh), dLh = L2 > 0 ? scl(Nperp, 1 / Math.sqrt(L2)) : null;
  const dTheta = dLh && th > 0 ? -dot(sh, dLh) / Math.sin(th) : null, Lxy = Math.hypot(rc.Lhat[0], rc.Lhat[1]), dPhiL = dLh && Lxy > 0 ? (rc.Lhat[0] * dLh[1] - rc.Lhat[1] * dLh[0]) / (Lxy * Lxy) : null;
  return { F, N, P, Fscale: Fs, Fel, Fr, Fphi, pull: rc.z === 0 ? null : -Math.sign(rc.z) * Fel, theta: th, dTheta, dPhiL,
    Ffar, Fnear, Nfar, Nnear, IL, spinUp: IL > 0 ? NL / IL : null, tiltRate: L2 > 0 ? nrm(Nperp) / Math.sqrt(L2) : null, prec, NalongL: nrm(N) > 0 ? NL / nrm(N) : null,
    reactF: scl(F, -1), reactN: scl(add(crs(rc.X, F), N), -1), rc };
}
/** 閉じた式(球 —— Σ m ξ_i ξ_j = I₀ δ_ij): drag の合力 −I₀ ∇×Ω・corS の合力 2 ω_s I₀ [∇(L̂·Ω) − L̂ ∇·Ω]・corS の合トルク 2 ω_s I₀ L̂ × Ω(X)・corV の点の受け手 2 V × Ω(X) */
export function closedForms({ q, p, sSign = 1, ROverR = DECL.t1.ROverR, h = DECL.t1.fdStep, ...rcSpec }) {
  const rc = recvOf(rcSpec), R = ROverR * rc.r, parts = partsOf('sphere', R, rc.Lhat), fp = { q, p, sSign };
  const I0 = parts.reduce((s, pt) => s + pt.m * pt.xi[0] * pt.xi[0], 0), Om = (x) => fieldOmega(x, fp), X = rc.X, L = rc.Lhat;
  const J = [0, 1, 2].map((j) => { const e = [0, 0, 0]; e[j] = h; return scl(sub(Om(add(X, e)), Om(sub(X, e))), 1 / (2 * h)); });   // J[j][k] = ∂_j Ω_k
  const rot = [J[1][2] - J[2][1], J[2][0] - J[0][2], J[0][1] - J[1][0]], div = J[0][0] + J[1][1] + J[2][2], gradLO = [0, 1, 2].map((j) => dot(J[j], L));
  return { I0, dragF: scl(rot, -I0), corSF: scl(sub(gradLO, scl(L, div)), 2 * rc.omegaS * I0), corSN: scl(crs(L, Om(X)), 2 * rc.omegaS * I0), corVPoint: scl(crs(rc.V, Om(X)), 2) };
}
/** 作用の型 × q × p × 体の要約(仰角の格子の引き寄せ・z のべき・r のべき・上下の比・赤道面の上の量) */
export function summaryRow({ action, q, p, body }) {
  const D = DECL.t1, at = (zOverR, r = D.rMain) => gyroRow({ action, q, p, body, zOverR, r });
  const zs = D.zOverR.map((z) => { const g = at(z); return { zOverR: z, Fel: g.Fel, pull: g.pull, Fr: g.Fr, Fphi: g.Fphi, farOverNear: nrm(g.Fnear) > 0 ? nrm(g.Ffar) / nrm(g.Fnear) : null }; });
  const slope = (a, b, xa, xb) => (a !== 0 && b !== 0 ? Math.log(Math.abs(b / a)) / Math.log(xb / xa) : null);
  const g1 = at(D.zPowPts[0]), g2 = at(D.zPowPts[1]);
  const zPow = slope(g1.Fel, g2.Fel, D.zPowPts[0], D.zPowPts[1]);
  // r のべき: z を固定(z = zFixed)して r を変える —— 部位の大きさ R は r₀ の 0.01 に固定
  const rAt = (r) => gyroRow({ action, q, p, body, zOverR: D.zFixed / r, r, ROverR: D.ROverR / r });
  const r1 = rAt(D.rPowPts[0]), r2 = rAt(D.rPowPts[1]), rPowFixedZ = slope(r1.Fel, r2.Fel, D.rPowPts[0], D.rPowPts[1]);
  // r のべき(z/r を固定 0.01・R/r を固定)
  const s1 = gyroRow({ action, q, p, body, zOverR: 0.01, r: D.rPowPts[0] }), s2 = gyroRow({ action, q, p, body, zOverR: 0.01, r: D.rPowPts[1] }), rPowFixedSlope = slope(s1.Fel, s2.Fel, D.rPowPts[0], D.rPowPts[1]);
  const e0 = at(0), pulls = zs.filter((r) => r.pull !== null);
  return { action, q, p, body, zs, towardBoth: pulls.length > 0 && pulls.every((r) => r.pull > 0), awayBoth: pulls.length > 0 && pulls.every((r) => r.pull < 0),
    zPow, rPowFixedZ, rPowFixedSlope, eq: { Fel: e0.Fel, Fr: e0.Fr, Fphi: e0.Fphi, NalongL: e0.NalongL, prec: e0.prec, tiltRate: e0.tiltRate, spinUp: e0.spinUp, N: e0.N } };
}
/** 対照(主の列・球・r 1・z/r ±0.01)—— 型ごとの引き寄せ(z > 0 と z < 0) */
export function controlRow(ctl, { q = DECL.t1.qMain, p = DECL.t1.pMain } = {}) {
  const spec = { q, p, body: 'sphere' };
  if (ctl === 'spin0') spec.omegaS = 0;
  else if (ctl === 'orbit0') spec.orbit = false;
  else if (ctl === 'Lflip') spec.Lhat = [0, 0, -1];
  else if (ctl === 'Ltilt30') spec.Lhat = [Math.sin(Math.PI / 6), 0, Math.cos(Math.PI / 6)];
  else if (ctl === 'sFlip') spec.sSign = -1;
  else if (ctl === 'vRetro') spec.vSign = -1;
  else if (ctl === 'point') spec.body = 'point';
  else if (ctl !== 'base') throw new RangeError('controlRow: 対照 ' + ctl);
  const out = { ctl, by: {} };
  for (const a of ACTIONS) { const up = gyroRow({ action: a, ...spec, zOverR: 0.01 }), dn = gyroRow({ action: a, ...spec, zOverR: -0.01 });
    out.by[a] = { pullUp: up.pull, pullDown: dn.pull, FelUp: up.Fel, P: up.P, tiltRate: up.tiltRate, precMag: up.prec ? nrm(up.prec) : null, spinUp: up.spinUp }; }
  return out;
}
/** 赤道面の上(z = 0)の軸の向きの変化: 受け手の自転軸を源の軸から傾けた(0°・30°・90°・150°)ときの、型ごとの軸の向きの変化(dθ/dt —— 負 = 源の軸へ寄る)・ŝ のまわりの回り(歳差の向き)・自転の増減・合力 */
export const EQ_TILTS = Object.freeze([0, 30, 90, 150]);
export function eqTiltRows({ q = DECL.t1.qMain, p = DECL.t1.pMain } = {}) {
  const out = [];
  for (const tDeg of EQ_TILTS) { const t = tDeg * Math.PI / 180, Lhat = [Math.sin(t), Math.sin(t) * 0, Math.cos(t)];
    for (const a of ['drag', 'corS', 'corV']) { const g = gyroRow({ action: a, q, p, body: 'sphere', zOverR: 0, Lhat });
      out.push({ tiltDeg: tDeg, action: a, dTheta: g.dTheta, dPhiL: g.dPhiL, spinUp: g.spinUp, tiltRate: g.tiltRate, NalongL: g.NalongL, Fel: g.Fel, Fr: g.Fr, Fphi: g.Fphi }); } }
  return out;
}
/** 「赤道面から遠い部位の倒れる力が大きい」の読み: R/r を振ったときの上下の比と引き寄せ(主の列・drag90 と corS —— drag の合力は方位の向きだけ) */
export function sizeScanRows({ q = DECL.t1.qMain } = {}) {
  const out = [];
  for (const p of DECL.t1.pGrid) for (const a of ['drag90', 'corS']) for (const ROverR of DECL.t1.ROverRScan) {
    const g = gyroRow({ action: a, q, p, body: 'sphere', zOverR: 0.01, ROverR });
    out.push({ p, action: a, ROverR, farOverNear: nrm(g.Fnear) > 0 ? nrm(g.Ffar) / nrm(g.Fnear) : null, farMinusNearEl: dot(sub(g.Ffar, g.Fnear), g.rc.el), pull: g.pull, FelOverScale: g.Fscale > 0 ? g.Fel / g.Fscale : null });
  }
  return out;
}

/* ───────── T1 アプリの型(第339便a)との比べ ───────── */
/** 第339便a の型(第337便i の slice|focus|Req|obs —— d = −λ r s (z/ρ) k̂・帯 |z| < R_eq)を土星で: 鉛直の成分の符号・z のべき・r のべき(z を固定)・源の自転の反転 */
export function appRow() {
  const sat = srcOf('saturn'), spec = D339A.candidate.spec, lam = D338D.t1.focus337i.lambda;
  const e = effectOfSpec(sat, { ...spec, lambda: lam }), Req = rdOf(sat, spec.reading), satR = Object.assign({}, sat, { s: -sat.s }), eR = effectOfSpec(satR, { ...spec, lambda: lam });
  const dz = (E, r, z) => E.d([r, 0, z])[2], r1 = 1e8, r2 = 2e8, z1 = 0.1 * Req, z2 = 0.01 * Req;
  const slope = (a, b, xa, xb) => Math.log(Math.abs(b / a)) / Math.log(xb / xa);
  return { Req, lambda: lam, towardUp: -Math.sign(dz(e, r1, z1)), towardDown: Math.sign(dz(e, r1, -z1)), zPow: slope(dz(e, r1, z2), dz(e, r1, z1), z2, z1), rPowFixedZ: slope(dz(e, r1, z1), dz(e, r2, z1), r1, r2),
    sFlipTowardUp: -Math.sign(dz(eR, r1, z1)), outsideBand: dz(e, r1, 1.5 * Req), usesRecvSpin: false, usesOrbitVel: false, kind: '位置を運ぶ(速度の場 d —— 鉛直)' };
}

/* ───────── T2 土星の環の帳簿 ───────── */
/** 区分の幅 [m](F 環は芯の幅) */
export const regionWidth = (key) => { const R = LIT338D.regions.find((g) => g.key === key); return (R.r1 - R.r0) * 1e3; };
/** 環の中心ごとの率と要る幅: ȧ/a・d ln i/dt・1e7 年の漂い(線形の見積り)÷ 区分の幅・傾きの e 分の 1 の時間・口の要る幅 b = 幅 ÷ (|ȧ/a| a T) */
export function ringNeedRows(sets) {
  const sat = srcOf('saturn'), T = DECL.t2.tYr * YR, out = [];
  for (const k of SETS) for (const c of DECL.t2.centers) {
    const r = centerKm(c) * 1e3, a = dlnAFast(sat, r, sets[k]), rr = ringRates(sat, r, sets[k], { zMax: DECL.t2.zMax }), w = regionWidth(c);
    out.push({ set: k, key: c, r, nOverS: nOf(sat, r) / sat.s, dlnA: a, dlnI: rr.dlnI, driftOverWidth: Math.abs(a) * r * T / w, tIefoldYr: rr.dlnI < 0 ? 1 / (-rr.dlnI * YR) : null, thin: rr.dlnI < 0 && -rr.dlnI * T >= 1, bNeed: w / (Math.abs(a) * r * T) });
  }
  return out;
}
/** (A) 口の帳簿(η 一様 —— 環の正味のトルクは (1 − η) × 引きずり・口のトルク −η × 引きずりの反作用を行き先が受け取る)。evolveRing を λ の倍 (1 − η) で呼び、口の行き先の角運動量・エネルギー・熱を足す */
export function portLedger({ set, setKey, eta, port }) {
  const sat = srcOf('saturn'), GM = 6.6743e-11 * sat.m, Om = port === 'spin' ? sat.s : port === 'mimas' ? Math.sqrt(GM / Math.pow(DECL.t2.mimasKm * 1e3, 3)) : null;
  if (Om === null) throw new RangeError('portLedger: 口 ' + port);
  if (!(eta >= 0)) throw new RangeError('portLedger: η ≥ 0');
  const ev = evolveRing({ src: sat, set, lamScale: 1 - eta, nu: 0, D: D338D.t2 }), last = ev.checks[ev.checks.length - 1];
  // 角運動量の行き先(初めの環の角運動量 L0 に対する比): 環が受け取った正味 extL・引きずりが渡した全部 extL/(1 − η)・口の行き先 η/(1 − η) × extL
  const k = eta === 1 ? null : eta / (1 - eta), Ldrag = eta === 1 ? null : last.extL / (1 - eta), Lport = k === null ? null : k * last.extL;
  // エネルギー: 口が環にした仕事 −η/(1 − η) × Wext(同じ時刻の同じ率 —— 外のトルクの仕事は輪の Ω に比例)・行き先のエネルギーの変化 Ω_行き先 × 口の角運動量・口の熱 = −行き先の変化 − 口の仕事
  const L0 = ev.L0, E0abs = Math.abs(ev.E0), Wport = k === null ? null : -k * last.Wext, dEdest = Lport === null ? null : Om * Lport * L0 / E0abs, heatPort = Wport === null ? null : -dEdest - Wport;
  return { setKey, port, eta, OmDest: Om, nAlive: last.nAlive, nAnnuli: ev.nAnnuli, Msat: last.Msat, Mout: last.Mout, dlnMax: last.dlnMax, amClosed: last.amClosed, enClosed: last.enClosed,
    extL: last.extL, Ldrag, Lport, Wext: last.Wext, Wport, dEdest, heatPort, heatNonNeg: heatPort === null ? null : heatPort >= -1e-12 * Math.max(Math.abs(dEdest || 0), Math.abs(Wport || 0)) };
}
/** (A) の口の熱の符号(環の中心ごと —— 口のトルク τ_p = −η T_d を環に・−τ_p を行き先に): 熱の率 = τ_p (Ω_行き先 − n)。正なら口はエネルギーの帳簿で成り立つ・負なら行き先の回りが遅すぎる(別のエネルギーの口が要る) */
export function portHeatRows(need) {
  const sat = srcOf('saturn'), GM = 6.6743e-11 * sat.m, out = [];
  for (const port of DECL.t2.ports) { const Om = port === 'spin' ? sat.s : Math.sqrt(GM / Math.pow(DECL.t2.mimasKm * 1e3, 3));
    for (const r of need) { const n = nOf(sat, r.r), tauP = -Math.sign(r.dlnA);   // 口のトルクの向き(η > 0)
      out.push({ port, set: r.set, key: r.key, nOverS: r.nOverS, OmDestOverN: Om / n, tauPSign: tauP, heatSign: Math.sign(tauP * (Om - n)) }); } }
  return out;
}
/** (B) 方向別の係数: 環が残る(全部の中心で漂い ÷ 幅 ≤ 1)・薄い(全部の中心で傾きが 1e7 年の内に e 分の 1)と、消した分の穴(単位の時間・環の角運動量とエネルギーに対する比 —— 行き先は未定) */
export function coefGridRows(need) {
  const T = DECL.t2.tYr * YR, out = [];
  for (const k of SETS) { const rows = need.filter((r) => r.set === k);
    for (const ca of DECL.t2.caGrid) for (const ci of DECL.t2.ciGrid) {
      const remains = rows.every((r) => Math.abs(ca) * r.driftOverWidth <= 1), thin = rows.every((r) => r.dlnI < 0 && -ci * r.dlnI * T >= 1);
      const holeL = Math.max(...rows.map((r) => Math.abs((1 - ca) * 0.5 * r.dlnA))), holeE = Math.max(...rows.map((r) => Math.abs((1 - ca) * r.dlnA)));
      const holeTilt = Math.max(...rows.map((r) => { const i = DECL.t2.zMax / r.r; return Math.abs((1 - ci) * i * r.dlnI); })), holeEz = Math.max(...rows.map((r) => { const i = DECL.t2.zMax / r.r; return Math.abs((1 - ci) * 2 * r.dlnI * i * i); }));
      out.push({ set: k, ca, ci, remains, thin, both: remains && thin, holeLrate: holeL, holeErate: holeE, holeTiltRate: holeTilt, holeEzRate: holeEz, holeLin1e7: holeL * T });
    } }
  return out;
}
/** 源の取り分 f(背景が静止の読み —— 土星の重み ÷ (土星 + 土星の位置の太陽 + W₀)・第337便l の値と同じ置き方) */
export function shareRing(r) {
  const a = D337L.alpha, wS = weight337(LIT337L.hostMass.saturn, r, a, AU), wSun = weight337(MSUN, LIT337L.hostA.saturn * AU, a, AU);
  return wS / (wS + wSun + D337L.W0);
}
/** 第140報の赤道面の列: 並進引きずりの順の分(取り分 f × 4 天体の強さの組の率を「順の分」と読む)と軸引きずりの逆の分(第338便b の列の振幅 A(f) —— A > 0 が逆)。
 *  行き先: 順の分の反作用 = 源(土星)の自転・逆の分の反作用 = 背景宇宙(AN356)。正味は 2 つの分を書いた和(打ち消されたと置いた値ではない) */
export function eqColRows(sets) {
  const sat = srcOf('saturn'), out = [];
  for (const k of SETS) for (const c of DECL.t2.centers) { const r = centerKm(c) * 1e3, f = shareRing(r), base = dlnAFast(sat, r, sets[k]);
    for (const col of DECL.t2.cols) { const A = colAmp(col, f), fwd = base, back = -(A / f) * base;
      out.push({ set: k, key: c, col, f, oneMinusF: 1 - f, A, fwdRate: fwd, backRate: back, netRate: fwd + back, fwdDest: '源の自転', backDest: '背景宇宙' }); } }
  return out;
}

/* ───────── 純関数の場面と門 ───────── */
export function pureScenes() {
  const S = {}, D = DECL.t1;
  // ① h_q の閉じた式(q 1: −s⊥ + √2 cos el s∥・q 0: s∥ − s⊥)
  { let m = 0; for (const q of [1, 0]) for (const z of [-0.3, 0.01, 0.5]) { const ce = Math.sqrt(1 - z * z), rh = [ce, 0, z], sp = scl(rh, z), sq = sub([0, 0, 1], sp), h = twistAxis([0, 0, 1], rh, q), want = add(scl(sq, -1), scl(sp, q === 1 ? Math.SQRT2 * ce : 1));
    m = Math.max(m, nrm(sub(h, want)) / nrm(want)); } S.twist = m; }
  // ② 球の閉じた式(drag の合力・corS の合力と合トルク)と点の受け手の corV
  { const at = { q: 1, p: 2, zOverR: 0.1, r: 1 }, C = closedForms(at), rel = (a, b) => nrm(sub(a, b)) / nrm(b);
    S.dragF = rel(gyroRow({ action: 'drag', ...at }).F, C.dragF); S.corSF = rel(gyroRow({ action: 'corS', ...at }).F, C.corSF); S.corSN = rel(gyroRow({ action: 'corS', ...at }).N, C.corSN);
    S.corVPoint = rel(gyroRow({ action: 'corV', ...at, body: 'point' }).F, C.corVPoint); S.dragPoint = nrm(gyroRow({ action: 'drag', ...at, body: 'point' }).F); }
  // ③ 回る座標の力は仕事をしない(corV・corS の仕事 ÷ 力の尺度 × 速さ)・corS のトルクは L̂ に垂直(歳差だけ)
  { const g = gyroRow({ action: 'corV', q: 1, p: 2, zOverR: 0.1 }), h = gyroRow({ action: 'corS', q: 1, p: 2, zOverR: 0.1 });
    S.corPower = Math.max(Math.abs(g.P) / (g.Fscale * nrm(g.rc.V)), Math.abs(h.P) / (h.Fscale * D.omegaS * D.ROverR)); S.corSNalongL = Math.abs(h.NalongL); }
  // ④ 体の対称(球: Σ ξ = 0・Σ ξξ = I₀ δ)
  { const P = partsOf('sphere', 1, [0, 0, 1]), sx = P.reduce((s, q) => add(s, scl(q.xi, q.m)), [0, 0, 0]), I = [0, 1, 2].map((i) => P.reduce((s, q) => s + q.m * q.xi[i] * q.xi[i], 0)), off = P.reduce((s, q) => s + q.m * Math.abs(q.xi[0] * q.xi[1]), 0);
    const offs = P.reduce((s, q) => s + q.m * q.xi[0] * q.xi[1], 0); S.sym = { sum: nrm(sx), iso: Math.max(Math.abs(I[0] - I[1]), Math.abs(I[1] - I[2])) / I[0], off: Math.abs(offs) / off, n: P.length }; }
  // ⑤ 薄い角: 1e-9 rad の傾きを atan2 で(内積は 1 に丸まり、内積から角を戻す求め方では 0 になる —— 桁を失う)
  { const t = 1e-9, a = [0, 0, 1], b = [Math.sin(t), 0, Math.cos(t)]; S.thin = { atan2: Math.abs(angleAtan2(a, b) / t - 1), acosLost: dot(a, b) === 1 }; }
  // ⑥ 入力の拒否
  const rejects = (f) => { try { f(); return false; } catch (e) { return e instanceof RangeError; } };
  S.rejects = [rejects(() => fieldOmega([0, 0, 0], { q: 1, p: 2 })), rejects(() => partsOf('cube', 1, [0, 0, 1])), rejects(() => recvOf({ zOverR: 1 })), rejects(() => controlRow('x')), rejects(() => portLedger({ set: {}, setKey: 'half', eta: 0, port: 'x' }))];
  return S;
}
export function pureView(S) {
  const t = DECL.t1.closedTol;
  return { twistBelow1e12: S.twist <= 1e-12, dragFBelowTol: S.dragF <= t, corSFBelowTol: S.corSF <= t, corSNBelowTol: S.corSN <= t, corVPointBelow1e12: S.corVPoint <= 1e-12, dragPointZero: S.dragPoint === 0,
    corPowerBelow1e12: S.corPower <= 1e-12, corSNalongLBelow1e12: S.corSNalongL <= 1e-12, symSumBelow1e12: S.sym.sum <= 1e-12, symIsoBelow1e12: S.sym.iso <= 1e-12, symOffBelow1e12: S.sym.off <= 1e-12, nCube: S.sym.n,
    thinAtan2Below1e6: S.thin.atan2 <= 1e-6, thinAcosLost: S.thin.acosLost, rejects: S.rejects };
}
export function pureGates(S) {
  const V = pureView(S);
  return { twist: V.twistBelow1e12, closed: V.dragFBelowTol && V.corSFBelowTol && V.corSNBelowTol && V.corVPointBelow1e12 && V.dragPointZero, work: V.corPowerBelow1e12 && V.corSNalongLBelow1e12,
    sym: V.symSumBelow1e12 && V.symIsoBelow1e12 && V.symOffBelow1e12, thin: V.thinAtan2Below1e6 && V.thinAcosLost, rejects: S.rejects.length === 5 && S.rejects.every(Boolean) };
}
export { k4Sets, SETS, COL_JA, muOf, YR };
