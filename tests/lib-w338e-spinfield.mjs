// 第338便e(原仮定者の回答(2026-11-15 —— 第138報の回答 4)「⑩は、パルサー以外でどうなるか、パルサーは軸を傾けたらどうなるか、を検証してから判断」・
//   原仮定者の指示(2026-11-14 —— 第138報)「慣性移動の、自分自身を除いた慣性決定力場に対する加減速は、加速の方がわずかに多くのエネルギーが必要と推測する」・統括の検証項目 R353):
//   **慣性移動の加減速の差の候補 —— 源の自転を場の速度に入れる読み(⑩)の検証 2 つ(連星パルサー以外の系・パルサーの自転の軸を傾ける)と、源の詰まり具合のノブの純関数**
//   (器 tests/exp-w338e-spinfield.mjs と QA behavior.spinfield338e・docs.spinfield338e が読む —— html を読まない・状態を持たない。第337便d の lib〔tests/lib-w337d-accelloss.mjs〕・
//   第330便b の lib〔kappaMRadius〕・第331便c の lib〔C1〕・第332便a の lib〔sphereRot —— 照らしだけ〕は呼ぶだけ —— 本文は変えない)。**全部「診断」**(エンジン・在位の本・受理器へ足す操作ではない)。
//
// ■ 記号: 位置 p・距離 r・質量 m・速度 v・観測自転 s(ベクトル)・局所の光速 c(本の単位系の c₀ —— 第337便d の lib の DECL.c)。受け手 1・源 2(両方の読みでは 2 も 1 の場に対して受け手)。
//   d = p_受け手 − p_源・w = d の時間の変化。場の速度 U = v_源 + U_s(d)(U_s = 源の自転が運ぶ分 —— 下の「場の型」)・u = v_受け手 − U(第337便d の u と同じ定義)。
//
// ■ 場の型(源の自転が受け手の位置で運ぶ分 U_s —— どれも読みの候補。第337便d の「源の自転を U_ext に入れる」は rigid に当たる)
//   none   : U_s = 0(⑩ を入れない読み —— 第337便d の主の読み)
//   rigid  : U_s = s × d(源の座標の剛体の回転を受け手の距離まで伸ばした読み —— ⑩・第337便d の比べる列。第335便b の coordVelocity と同じ)
//   pow1・pow2 : U_s = g(r) s × d・g = 1(r ≤ R_d)・(R_d/r)^q(r > R_d —— q = 1・2)。R_d = Y_k m_源(K1 の規則の引きずりの半径 —— 第330便b の kappaMRadius)の外で剛体でない読み
//   sphere : U_s = K s × d/r³・K = C₁R_d³/5(今のエンジンの K1 の球の核の回転の項の一次 —— 第332便a の sphereRot と同じ形・r > R_d だけ)
//   時間の変化(型 2 の (du/dt)₀ に要る): rigid は s × w・pow は g[s × w − q (s × d)(d·w)/r²]・sphere は K[s × w/r³ − 3(s × d)(d·w)/r⁵]。
//   **赤道の速さ s R_源 は軸の向きにも場の型にも依らない**。受け手の位置の場の速さ |U_s| と、軌道の平均の効きに入る成分(公転面の内の分・面に垂直な分)を分けて測る。
//
// ■ 源の詰まり具合のノブ(AN723 = A): 受け手ごとに ε(またはη)に (Ξ/Ξ_ref)^k を掛ける。Ξ = G m_源/(c² r)(受け手の位置の局所の r —— 軌道の上で変わる)・
//   Ξ_ref = G M_☉/(c² au)(無次元化の参照の尺度 —— 太陽と 1 au)。k = 0 で第337便d の型と同じ。
//
// ■ 軌道平均(求積 —— 第337便d の secularRates と同じ点・同じ重み)に、面の傾きの率 |ḣ_⊥|/|h| と場の速さの統計(最大・公転面の内の分と面に垂直な分の時間の平均)を足した。
//   rigid・k = 0 は第337便d の pairForces・secularRates と同じ値になる(純関数の場面で照らす)。
//
// ■ 言わないこと: 場の型は読みの候補(慣性移動の則ではない)・「光速を超える」は場の速度(座標の剛体の回転を受け手の距離まで伸ばした速さ)の量で、物体の速さではない・
//   ノブの上限は観測の目安(文献の値・未照合・桁の目安)との比・⑩ の扱い(廃止/候補)はこの lib では決めない(原仮定者の判断の材料の表)。
import * as L from './lib-w337d-accelloss.mjs';
import { kappaMRadius } from './lib-w330b-dragweight.mjs';
import { C1 } from './lib-w331c-k1scale.mjs';
import { sphereRot } from './lib-w332a-eqband.mjs';

export const LIB_VERSION = 'w338e-spinfield-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const v3 = (a) => Array.isArray(a) && a.length === 3 && a.every(fin);
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], scl = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const DEG = Math.PI / 180;

export const FIELDS = Object.freeze(['none', 'rigid', 'pow1', 'pow2', 'sphere']);
export const FIELD_Q = Object.freeze({ pow1: 1, pow2: 2 });
/** 宣言 */
export const DECL = Object.freeze({
  G: L.DECL.G, c: L.DECL.c, AU: L.DECL.AU, yearS: L.DECL.yearS, mSun: 1.98847e30,
  /** 詰まり具合の参照の尺度 Ξ_ref = G M_☉/(c² au) */
  xiRefNote: 'Ξ_ref = G M_☉/(c² au)(M_☉ = 1.98847e30 kg・au = 1.495978707e11 m)',
  nQuad: 4096,
  /** 丸めの床(教訓 2): 同じ単位の尺度に対して 1e-12 より小さい値は 0 と書く */
  zeroFloor: 1e-12,
});
export const XI_REF = DECL.G * DECL.mSun / (DECL.c * DECL.c * DECL.AU);
/** 丸めの床(解析的に 0 の量・打ち消しの残り): |x| < floor × scale なら 0 */
export const snap = (x, scale) => (x === null || x === undefined ? x : (fin(x) && fin(scale) && Math.abs(x) < DECL.zeroFloor * Math.abs(scale) ? 0 : x));
/** 自転のベクトル: 大きさ Ω(符号つき)・軌道の面の法線(+z)からの角 θ [度]・面への射影の向き φ [度](近点の向き +x から) */
export function spinVec(Omega, thetaDeg = 0, phiDeg = 0) {
  if (![Omega, thetaDeg, phiDeg].every(fin)) throw new RangeError('spinVec: 有限の Ω・θ・φ');
  const t = thetaDeg * DEG, p = phiDeg * DEG;
  // θ = 0・180 は面に垂直(sin を 0 に固定 —— 丸めで面の内の成分を作らない)
  const st = thetaDeg % 180 === 0 ? 0 : Math.sin(t), ct = thetaDeg % 180 === 90 ? 0 : Math.cos(t);
  return [Omega * st * Math.cos(p), Omega * st * Math.sin(p), Omega * ct];
}
/** R_d = Y_k m(K1 の規則 —— 第330便b の kappaMRadius を呼ぶ・本の G と c) */
export const rdOf = (m) => kappaMRadius(m, DECL.G, DECL.c);

/* ───────── 場の型 ───────── */
/** 源の自転が受け手の位置で運ぶ分 U_s と時間の変化 dU(d = 受け手 − 源・w = d の時間の変化・s = 源の観測自転・Rd = 源の R_d) */
export function fieldAt(field, s, Rd, d, w) {
  if (!FIELDS.includes(field)) throw new RangeError('fieldAt: 型は ' + FIELDS.join('・'));
  if (!v3(s) || !v3(d) || !v3(w)) throw new RangeError('fieldAt: s・d・w は有限の 3 成分');
  if (field === 'none') return { U: [0, 0, 0], dU: [0, 0, 0], g: 0 };
  const sd = crs(s, d), sw = crs(s, w);
  if (field === 'rigid') return { U: sd, dU: sw, g: 1 };
  if (!fin(Rd) || !(Rd > 0)) throw new RangeError('fieldAt: R_d > 0');
  const r = nrm(d), rw = dot(d, w);
  if (field === 'sphere') {
    if (!(r > Rd)) throw new RangeError('fieldAt: sphere は r > R_d(外部の M1 だけ)');
    const K = C1 * Rd * Rd * Rd / 5, r3 = r * r * r;
    return { U: scl(sd, K / r3), dU: sub(scl(sw, K / r3), scl(sd, 3 * K * rw / (r3 * r * r))), g: K / r3 };
  }
  const q = FIELD_Q[field];
  if (!(r > Rd)) return { U: sd, dU: sw, g: 1 };
  const g = Math.pow(Rd / r, q);
  return { U: scl(sd, g), dU: scl(sub(sw, scl(sd, q * rw / (r * r))), g), g };
}

/* ───────── 二体の 1 点(第337便d の pairForces を一般の場の型と詰まり具合のノブへ) ───────── */
/** cfg: { field, Rd1, Rd2, k(詰まり具合のべき —— 既定 0)}。r = p₁ − p₂・v = v₁ − v₂(重心の系) */
export function pairForcesF(S, col, knob, r, v, cfg) {
  const { field = 'rigid', Rd1 = null, Rd2 = null, k = 0 } = cfg || {};
  if (!fin(k)) throw new RangeError('pairForcesF: k は有限');
  const { G, m1, m2, M, s1, s2, c, mode } = S, rm = nrm(r), r3 = rm * rm * rm;
  const aRel = scl(r, -G * M / r3);
  const v1 = scl(v, m2 / M), v2 = scl(v, -m1 / M);
  const comp = (m) => (k === 0 ? 1 : Math.pow(G * m / (c * c * rm) / XI_REF, k));
  const F1 = fieldAt(field, s2, Rd2, r, v);
  const U1 = add(v2, F1.U), u1 = sub(v1, U1), k1 = knob * comp(m2);
  const d1 = L.dragOf(col, k1, { u: u1, du0: sub(aRel, F1.dU), a0mag: G * m2 / (rm * rm), c });
  let f2 = [0, 0, 0], q2 = 0, U2 = [0, 0, 0], u2 = [0, 0, 0], F2 = { U: [0, 0, 0] };
  if (mode === 'both') {
    F2 = fieldAt(field, s1, Rd1, scl(r, -1), scl(v, -1));
    U2 = add(v1, F2.U); u2 = sub(v2, U2);
    const d2 = L.dragOf(col, knob * comp(m1), { u: u2, du0: sub(scl(aRel, -1), F2.dU), a0mag: G * m1 / (rm * rm), c });
    f2 = d2.f; q2 = d2.q;
  }
  const Qdot = m1 * d1.q + m2 * q2, Pfield = m1 * dot(d1.f, U1) + m2 * dot(f2, U2), Pmech = m1 * dot(d1.f, v1) + m2 * dot(f2, v2);
  return { f1: d1.f, f2, fRel: sub(d1.f, f2), Qdot, Pfield, Pmech, u1, u2, U1, U2, Us1: F1.U, Us2: F2.U, aRel };
}
/**
 * 軌道平均(求積 —— 第337便d の secularRates と同じ点・重み)。戻り値: ȧ・ė・ϖ̇・ḣ の法線の成分の率・面の傾きの率 |ḣ_⊥|/|h|・Ṗ/P・熱・場の口・帳簿の残り・
 *   場の速さの統計(Us = 源の自転が運ぶ分 —— 最大と、公転面の内の分・面に垂直な分の時間の平均)・|u| の最大・詰まり具合の因子の時間の平均(受け手 1)
 */
export function secularF(S, col, knob, cfg, { nQ = DECL.nQuad } = {}) {
  let sw = 0, eps = 0, hd = [0, 0, 0], Ad = [0, 0, 0], Q = 0, Pf = 0, Pm = 0, maxRes = 0;
  let usMax = 0, usIn = 0, usPerp = 0, usInMax = 0, usPerpMax = 0, uMax = 0, compMean = 0;
  const K0 = L.keplerAt(S, 0), h0 = crs(K0.r, K0.v), hm = nrm(h0), hHat = scl(h0, 1 / hm), A0 = sub(crs(K0.v, h0), scl(K0.r, S.GM / K0.rm));
  const k = (cfg && cfg.k) || 0;
  for (let i = 0; i < nQ; i++) {
    const E = 2 * Math.PI * i / nQ, K = L.keplerAt(S, E), F = pairForcesF(S, col, knob, K.r, K.v, cfg);
    const f = F.fRel, epsDot = dot(K.v, f), hDot = crs(K.r, f), h = crs(K.r, K.v), Adot = add(crs(f, h), crs(K.v, crs(K.r, f)));
    sw += K.w; eps += K.w * epsDot; hd = add(hd, scl(hDot, K.w)); Ad = add(Ad, scl(Adot, K.w));
    Q += K.w * F.Qdot; Pf += K.w * F.Pfield; Pm += K.w * F.Pmech;
    maxRes = Math.max(maxRes, Math.abs(F.Pmech + F.Qdot - F.Pfield) / Math.max(Math.abs(F.Qdot), Math.abs(F.Pfield), Math.abs(F.Pmech), 1e-300));
    for (const Us of [F.Us1, F.Us2]) {
      const zp = Math.abs(dot(Us, hHat)), ip = nrm(sub(Us, scl(hHat, dot(Us, hHat)))), am = nrm(Us);
      usMax = Math.max(usMax, am); usInMax = Math.max(usInMax, ip); usPerpMax = Math.max(usPerpMax, zp);
    }
    // 時間の平均は受け手 1 の場(源 2 の自転が運ぶ分)
    const zp1 = Math.abs(dot(F.Us1, hHat)), ip1 = nrm(sub(F.Us1, scl(hHat, dot(F.Us1, hHat))));
    usIn += K.w * ip1; usPerp += K.w * zp1;
    uMax = Math.max(uMax, nrm(F.u1), nrm(F.u2));
    compMean += K.w * (k === 0 ? 1 : Math.pow(S.G * S.m2 / (S.c * S.c * K.rm) / XI_REF, k));
  }
  eps /= sw; hd = scl(hd, 1 / sw); Ad = scl(Ad, 1 / sw); Q /= sw; Pf /= sw; Pm /= sw; usIn /= sw; usPerp /= sw; compMean /= sw;
  const { a, e, GM, P } = S;
  const adot = 2 * a * a * eps / GM;
  let edot, wdot;
  if (e > 0) { const eHat = scl(A0, 1 / nrm(A0)); edot = dot(eHat, Ad) / GM; wdot = dot(crs(eHat, Ad), hHat) / (GM * e); }
  else { edot = nrm(Ad) / GM; wdot = null; }
  const hPar = dot(hd, hHat), hPerp = nrm(sub(hd, scl(hHat, hPar)));
  return { adot, edot, wdot, hdotRel: hPar / hm, tiltRate: hPerp / hm, PdotOverP: 1.5 * adot / a, Qorb: Q * P, Wforb: Pf * P, dEorb: Pm * P,
    ledgerRel: Math.abs(Pm + Q - Pf) / Math.max(Math.abs(Q), Math.abs(Pf), Math.abs(Pm), 1e-300), pointResMax: maxRes,
    usMaxOverC: usMax / S.c, usInMeanOverC: usIn / S.c, usPerpMeanOverC: usPerp / S.c, usInMaxOverC: usInMax / S.c, usPerpMaxOverC: usPerpMax / S.c, uMaxOverC: uMax / S.c, compMean };
}
/**
 * 詰まり具合のべき k の関数としての ȧ(速い形 —— 二分法のため)。力は各点でノブに線形なので、k = 0 の受け手ごとの寄与 w v·f₁・−w v·f₂ に
 * (Ξ₁/Ξ_ref)^k・(Ξ₂/Ξ_ref)^k を掛けて足す(Ξ₁ = G m₂/(c² r)・Ξ₂ = G m₁/(c² r) —— 各点の r)。戻り値: k → ȧ
 */
export function adotOfK(S, col, cfg, { nQ = DECL.nQuad } = {}) {
  const c0 = Object.assign({}, cfg, { k: 0 }), e1 = new Float64Array(nQ), e2 = new Float64Array(nQ), x1 = new Float64Array(nQ), x2 = new Float64Array(nQ);
  let sw = 0;
  for (let i = 0; i < nQ; i++) {
    const E = 2 * Math.PI * i / nQ, K = L.keplerAt(S, E), F = pairForcesF(S, col, 1, K.r, K.v, c0);
    sw += K.w; e1[i] = K.w * dot(K.v, F.f1); e2[i] = -K.w * dot(K.v, F.f2);
    x1[i] = S.G * S.m2 / (S.c * S.c * K.rm) / XI_REF; x2[i] = S.G * S.m1 / (S.c * S.c * K.rm) / XI_REF;
  }
  const fac = 2 * S.a * S.a / S.GM;
  return (k) => { let t = 0; for (let i = 0; i < nQ; i++) t += e1[i] * Math.pow(x1[i], k) + (e2[i] === 0 ? 0 : e2[i] * Math.pow(x2[i], k)); return fac * t / sw; };
}
/**
 * 率の丸めの尺度(教訓 2 —— 同じ単位の尺度): L 系(η は 1/s)は ȧ ~ a・ė ~ 1(1/s の単位)、型 2・3(ε は無次元)は ȧ ~ a n・ė ~ n。
 * 場が受け手を速く動かす分(amp = max(1, |u| の最大 ÷ 円の速さ √(GM/a)))と詰まり具合の因子の平均を掛ける(熱と仕事は amp²)
 */
export function rateScales(S, col, compMean = 1, uMaxOverC = 0) {
  const lin = L.COLS[col].type === 'lin', n = S.n, f = Math.max(compMean, 1e-300), amp = Math.max(1, uMaxOverC * S.c / Math.sqrt(S.GM / S.a));
  return { a: (lin ? S.a : S.a * n) * f * amp, e: (lin ? 1 : n) * f * amp, E: S.mu * S.GM / S.a * (lin ? 1 : n) * S.P * f * amp * amp, amp };
}
/** secularF の値を丸めの床で 0 に寄せた形(正本に書く形) */
export function snapRates(R, S, col) {
  const sc = rateScales(S, col, R.compMean, R.uMaxOverC);
  return Object.assign({}, R, { adot: snap(R.adot, sc.a), edot: snap(R.edot, sc.e), wdot: snap(R.wdot, sc.e), hdotRel: snap(R.hdotRel, sc.e), tiltRate: snap(R.tiltRate, sc.e),
    PdotOverP: snap(R.PdotOverP, sc.a / S.a), Qorb: snap(R.Qorb, sc.E), Wforb: snap(R.Wforb, sc.E), dEorb: snap(R.dEorb, sc.E),
    ledgerRel: R.ledgerRel < 1e-12 ? 0 : R.ledgerRel, pointResMax: R.pointResMax < 1e-12 ? 0 : R.pointResMax,
    usInMeanOverC: snap(R.usInMeanOverC, R.usMaxOverC), usPerpMeanOverC: snap(R.usPerpMeanOverC, R.usMaxOverC), usInMaxOverC: snap(R.usInMaxOverC, R.usMaxOverC), usPerpMaxOverC: snap(R.usPerpMaxOverC, R.usMaxOverC) });
}

/* ───────── 系(文献の値・未照合 —— 行の出どころを書く) ───────── */
/**
 * T1 の系: 第337便d の 5 系(LIT をそのまま)+ 惑星 6・衛星 6・恒星の連星・白色矮星を含む連星 2・中性子星と白色矮星の連星 2・二重中性子星 3。
 * 値: csv = paper/data/solar-observations.csv の行(record_id)/jov = paper/data/jovian-satellites.csv/lit = 文献の値・未照合(この箱から一次資料に当たっていない)/w337d = 第337便d の LIT。
 * m1 = 受け手・m2 = 源(両方の読みでは源 2 も受け手)・s2 = 源の観測自転の大きさ [rad/s](正 = 軌道と同じ向き)・theta = 源の軸と軌道の面の法線の角 [度](主の行の値)・
 * R2 = 源の半径 [m](赤道の速さ s R の比べ)・main = 主の読み(recv = 受け手だけ・both = 両方)。
 */
const TWO_PI = 2 * Math.PI;
const W = L.LIT.systems;
export const SYSTEMS = Object.freeze({
  mercury: Object.freeze({ kind: 'planet', name: '水星', m1: W.mercury.m1, m2: W.mercury.m2, a: W.mercury.a, e: W.mercury.e, s2: W.mercury.s2, s1: 0, theta: 0, R2: 6.96e8, main: 'recv', src: 'w337d(LIT mercury)・太陽の半径 SOL-e17c6ac9' }),
  venus: Object.freeze({ kind: 'planet', name: '金星', m1: 4.8675e24, m2: W.mercury.m2, a: 1.08208e11, e: 0.007, s2: W.mercury.s2, s1: 0, theta: 0, R2: 6.96e8, main: 'recv', src: 'csv SOL-9999398b・SOL-477a8478・SOL-2185e5f8・太陽の自転は第337便d と同じ 25.38 日' }),
  earth: Object.freeze({ kind: 'planet', name: '地球', m1: W.earth.m1, m2: W.earth.m2, a: W.earth.a, e: W.earth.e, s2: W.earth.s2, s1: W.earth.s1, theta: 0, R2: 6.96e8, main: 'recv', src: 'w337d(LIT earth)' }),
  mars: Object.freeze({ kind: 'planet', name: '火星', m1: 6.4171e23, m2: W.mercury.m2, a: 2.2794e11, e: 0.0934, s2: W.mercury.s2, s1: 0, theta: 0, R2: 6.96e8, main: 'recv', src: 'csv SOL-546fa429・a は lit(第337便c の BODY_SRC)・e は lit' }),
  jupiter: Object.freeze({ kind: 'planet', name: '木星', m1: 1.898e27, m2: W.mercury.m2, a: 7.7857e11, e: 0.0489, s2: W.mercury.s2, s1: 0, theta: 0, R2: 6.96e8, main: 'recv', src: 'jov(質量)・a と e は lit' }),
  saturn: Object.freeze({ kind: 'planet', name: '土星', m1: 5.6834e26, m2: W.mercury.m2, a: 1.43353e12, e: 0.0565, s2: W.mercury.s2, s1: 0, theta: 0, R2: 6.96e8, main: 'recv', src: '質量・a・e は lit' }),
  uranus: Object.freeze({ kind: 'planet', name: '天王星', m1: 8.6811e25, m2: W.mercury.m2, a: 2.87246e12, e: 0.0457, s2: W.mercury.s2, s1: 0, theta: 0, R2: 6.96e8, main: 'recv', src: 'csv SOL-c00bf92b・a と e は lit' }),
  neptune: Object.freeze({ kind: 'planet', name: '海王星', m1: 1.02409e26, m2: W.mercury.m2, a: 4.49506e12, e: 0.0113, s2: W.mercury.s2, s1: 0, theta: 0, R2: 6.96e8, main: 'recv', src: 'csv SOL-3dde607a・a と e は lit' }),
  moon: Object.freeze({ kind: 'moon', name: '月', m1: W.moon.m1, m2: W.moon.m2, a: W.moon.a, e: W.moon.e, s2: W.moon.s2, s1: W.moon.s1, theta: 0, R2: 6.371e6, main: 'recv', src: 'w337d(LIT moon)・地球の半径 lit' }),
  phobos: Object.freeze({ kind: 'moon', name: 'フォボス', m1: 1.0638e16, m2: 6.4171e23, a: 9.376e6, e: 0.0151, s2: TWO_PI / 88642.6848, s1: 0, theta: 0, R2: 3389500, main: 'recv', src: 'csv SOL-8155e0b9(火星の自転)・SOL-115bcbaf・フォボスの質量と a は csv・e は lit' }),
  io: Object.freeze({ kind: 'moon', name: 'イオ', m1: 8.9319e22, m2: 1.898e27, a: 4.217e8, e: 0.004, s2: TWO_PI / 35730, s1: 0, theta: 0, R2: 7.1492e7, main: 'recv', src: 'jov(木星の質量・半径・自転)・csv SOL-96e8b1b6・イオの質量と a は lit' }),
  ganymede: Object.freeze({ kind: 'moon', name: 'ガニメデ', m1: 1.4819e23, m2: 1.898e27, a: 1.0704e9, e: 0.001, s2: TWO_PI / 35730, s1: 0, theta: 0, R2: 7.1492e7, main: 'recv', src: 'jov・csv SOL-a963d37c・質量と a は lit' }),
  titan: Object.freeze({ kind: 'moon', name: 'タイタン', m1: 1.3452e23, m2: 5.6834e26, a: 1.22187e9, e: 0.029, s2: TWO_PI / 38362, s1: 0, theta: 0, R2: 6.0268e7, main: 'recv', src: 'csv SOL-7665efd8・土星の質量・自転 10.656 時・半径と a は lit' }),
  triton: Object.freeze({ kind: 'moon', name: 'トリトン', m1: 2.14e22, m2: 1.02409e26, a: 3.5476e8, e: 0.000016, s2: TWO_PI / 57996, s1: 0, theta: 157.345, R2: 24764000, main: 'recv', src: 'csv SOL-db746089・SOL-f544c4ff・SOL-938090a8・SOL-cd5d24a0・SOL-5439f373・軸の角は SOL-14b262e9(海王星の赤道に対する軌道の傾き 157.345° —— 逆行)' }),
  charon: Object.freeze({ kind: 'moon', name: 'カロン(冥王星と相互ロック)', m1: 1.586e21, m2: 1.303e22, a: 1.9596e7, e: 0, s2: TWO_PI / 551854.08, s1: TWO_PI / 551854.08, theta: 0, R2: 1188000, main: 'both', src: 'csv SOL-66c9d628・SOL-801bc9a8・SOL-ec46ed96・SOL-5f236ce9・SOL-5d8c1a3b・SOL-a0392d22・SOL-e3ec70b7' }),
  alphacen: Object.freeze({ kind: 'starBinary', name: 'ケンタウルス座α AB(恒星の連星)', m1: 1.8079442e30, m2: 2.1451938e30, a: 3.48545644324809e12, e: 0.51947, s2: TWO_PI / 1373760, s1: TWO_PI / 3130272, theta: 0, R2: 8.4738e8, main: 'both',
    src: 'csv SOL-0347b3c6・SOL-f31c9224・SOL-cb2d1d9c・SOL-b06af02d・SOL-a9695384・SOL-9f8f4d0b・SOL-cabbd525(軸の向きは不明 —— 面の法線に置いた)' }),
  sirius: Object.freeze({ kind: 'wdBinary', name: 'シリウス AB(A 型星と白色矮星)', m1: 2.024293e30, m2: 4.1022755e30, a: 2.95946360360515e12, e: 0.59142, s2: TWO_PI / (2.17 * 86400), s1: 0, theta: 0, R2: 1.1932224e9, main: 'both',
    src: 'csv SOL-62054200・SOL-48a6939f・SOL-0e629057・SOL-e36df0e9・SOL-b871fff8(A の自転の周期は 2.17〜5.42 日の範囲 —— 速い端 2.17 日を置いた・白色矮星の自転は不明で 0)' }),
  j0651: Object.freeze({ kind: 'wdBinary', name: 'SDSS J0651+2844(白色矮星どうし)', m1: 0.26 * 1.9885e30, m2: 0.50 * 1.9885e30, Pb: 765.5, e: 0, s2: 'sync', s1: 'sync', theta: 0, R2: 1.0e7, main: 'both',
    src: 'lit(Brown et al. 2011 ApJ 737 L23 の桁 —— 未照合)・自転は公転に同期と置いた(宣言)・半径は桁' }),
  j0348: Object.freeze({ kind: 'nsWd', name: 'PSR J0348+0432(中性子星と白色矮星)', m1: 0.172 * 1.9885e30, m2: 3.996885e30, Pb: 8849.44, e: 0, s2: TWO_PI / 0.0391226, s1: 0, theta: 0, R2: 1.175e4, main: 'both',
    src: 'csv SOL-06a29d5b(パルサーの質量と行の注の伴星 0.172・2.46 時・39 ms)・Pb と自転の周期の桁は lit(Antoniadis et al. 2013 —— 未照合)・e < 1e-6 を 0・白色矮星の自転は 0' }),
  j1141: Object.freeze({ kind: 'nsWd', name: 'PSR J1141−6545(中性子星と白色矮星・離心)', m1: 1.02 * 1.9885e30, m2: 1.27 * 1.9885e30, Pb: 0.1976509593 * 86400, e: 0.171876, s2: TWO_PI / 0.3939, s1: 0, theta: 0, R2: 1.175e4, main: 'both',
    src: 'lit(Bhat et al. 2008 PRD 77 124017 の桁 —— 未照合)・白色矮星の自転は 0(宣言)' }),
  b1913: Object.freeze({ kind: 'nsNs', name: 'PSR B1913+16', m1: W.b1913.m1, m2: W.b1913.m2, Pb: W.b1913.Pb, e: W.b1913.e, s2: W.b1913.s2, s1: W.b1913.s1, theta: 0, R2: 1.175e4, main: 'both', src: 'w337d(LIT b1913)' }),
  b1534: Object.freeze({ kind: 'nsNs', name: 'PSR B1534+12', m1: 2.67552675e30, m2: 2.6506705e30, a: 2.2829570550484287e9, e: 0.2736775, s2: TWO_PI / 3.79e-2, s1: 0, theta: 0, R2: 1.175e4, main: 'both',
    src: 'csv SOL-fe273801・SOL-998afc17・SOL-eb18017b・SOL-ae4a0c44・SOL-df3bdf7b(伴星の自転は 0)' }),
  j1757: Object.freeze({ kind: 'nsNs', name: 'PSR J1757−1854', m1: 2.7731621e30, m2: 2.6614084e30, a: 1.3219674457986195e9, e: 0.6058142, s2: TWO_PI / 2.14972318900292e-2, s1: 0, theta: 0, R2: 1.175e4, main: 'both',
    src: 'csv SOL-60e0bee8・SOL-c5f3dbda・SOL-e46adab3・SOL-251ef664・SOL-73484635(伴星の自転は 0)' }),
  j1946: Object.freeze({ kind: 'nsNs', name: 'PSR J1946+2052', m1: 2.481648e30, m2: 2.5528363e30, a: 7.314902889635589e8, e: 0.063848, s2: TWO_PI / 1.696017532298e-2, s1: 0, theta: 0, R2: 1.175e4, main: 'both',
    src: 'csv SOL-584356e3・SOL-859e71b2・SOL-38fb216a・SOL-efbb5491・SOL-10782652(伴星の自転は 0)' }),
  j0737: Object.freeze({ kind: 'nsNs', name: 'PSR J0737−3039', m1: W.j0737.m1, m2: W.j0737.m2, Pb: W.j0737.Pb, e: W.j0737.e, s2: W.j0737.s2, s1: W.j0737.s1, theta: 0, R2: 1.175e4, main: 'both', src: 'w337d(LIT j0737)・半径 SOL-8c6303f4' }),
});
export const SYSTEM_KEYS = Object.freeze(Object.keys(SYSTEMS));
/** 観測の目安のある系(第337便d の 5 系 —— LIT.bounds) */
export const BOUND_KEYS = Object.freeze(Object.keys(L.LIT.bounds));
/** パルサーの自転の軸と軌道の面の法線の角の参考(文献の値・未照合 —— 桁の目安) */
export const TILT_LIT = Object.freeze({
  j0737: Object.freeze({ deg: 3.2, note: 'パルサー A の上限 —— Ferdman et al. 2013 の桁' }),
  b1913: Object.freeze({ deg: 18, note: '測地的な歳差からの読みの桁' }),
  b1534: Object.freeze({ deg: 27, note: 'Stairs et al. 2004 の桁' }),
});

/** 系の a(周期だけの行はケプラーで) */
export function aOf(key) { const d = SYSTEMS[key]; if (!d) throw new RangeError('aOf: 系が無い ' + key); return d.a || L.aFromP(DECL.G * (d.m1 + d.m2), d.Pb); }
/** 系 → 第337便d の sysOf(自転の大きさ・軸の角 θ・φ・読みの mode)。spinOn = false なら両方の自転を 0 */
export function sysFor(key, { thetaDeg = null, phiDeg = 0, mode = null, spinOn = true } = {}) {
  const d = SYSTEMS[key]; if (!d) throw new RangeError('sysFor: 系が無い ' + key);
  const a = aOf(key), md = mode || d.main, th = thetaDeg === null ? d.theta : thetaDeg;
  const n = Math.sqrt(DECL.G * (d.m1 + d.m2) / (a * a * a));
  const sMag = (x) => (x === 'sync' ? n : x);
  const s2 = spinOn ? spinVec(sMag(d.s2), th, phiDeg) : [0, 0, 0], s1 = spinOn ? spinVec(sMag(d.s1), th, phiDeg) : [0, 0, 0];
  return L.sysOf({ G: DECL.G, m1: d.m1, m2: d.m2, a, e: d.e, c: DECL.c, mode: md, s1, s2 });
}
/** 系の場の宣言(R_d は両方の天体の K1 の規則) */
export const cfgFor = (key, field, k = 0) => { const d = SYSTEMS[key]; return { field, Rd1: rdOf(d.m1), Rd2: rdOf(d.m2), k }; };
/** 観測の目安(第337便d の boundOf と同じ式 —— 器 tests/exp-w337d-accelloss.mjs の boundOf を lib の値で) */
export function boundOf(key) {
  const b = L.LIT.bounds[key], d = L.LIT.systems[key];
  if (!b) return null;
  if (b.kind !== 'pbdotAbs') return { kind: b.kind, value: b.value };
  if (key === 'b1913') { const pg = L.petersPbdot(DECL.G, DECL.c, d.m1, d.m2, d.Pb, d.e); return { kind: b.kind, value: b.nSigma * b.ratioSigma * Math.abs(pg) }; }
  return { kind: b.kind, value: b.nSigma * b.sigma };
}
/** 観測の目安の量(単位のノブの率から): adotRel = |ȧ/a| [1/年]・adotAbs = |ȧ| [m/年]・pbdotAbs = |Ṗ_b| = |1.5 ȧ/a P| */
export function boundRate(kind, R, S) {
  return kind === 'adotRel' ? Math.abs(R.adot / S.a) * DECL.yearS : kind === 'adotAbs' ? Math.abs(R.adot) * DECL.yearS : Math.abs(R.PdotOverP * S.P);
}

/* ───────── 純関数の場面(QA と器の門) ───────── */
export function pureScenes() {
  const O = {};
  // ① rigid・k = 0 は第337便d の pairForces と同じ(傾けた自転・両方・列 7)・none は自転 0 の pairForces と同じ
  {
    let mx = 0;
    const S = L.sysOf({ G: 1, m1: 0.4, m2: 0.6, a: 1, e: 0.4, s1: [0.1, -0.2, 0.3], s2: [0.25, 0.1, 0.6], c: 50, mode: 'both' }), S0 = L.sysOf({ G: 1, m1: 0.4, m2: 0.6, a: 1, e: 0.4, c: 50, mode: 'both' });
    for (const col of L.COL_KEYS) for (const E of [0.3, 1.7, 4.1]) {
      const K = L.keplerAt(S, E), A = L.pairForces(S, col, 1e-3, K.r, K.v), B = pairForcesF(S, col, 1e-3, K.r, K.v, { field: 'rigid' });
      const A0 = L.pairForces(S0, col, 1e-3, K.r, K.v), B0 = pairForcesF(S, col, 1e-3, K.r, K.v, { field: 'none' });
      for (const [x, y] of [[A.fRel, B.fRel], [A0.fRel, B0.fRel]]) mx = Math.max(mx, nrm(sub(x, y)) / Math.max(nrm(x), 1e-300));
      for (const [x, y] of [[A.Qdot, B.Qdot], [A.Pfield, B.Pfield], [A0.Qdot, B0.Qdot]]) mx = Math.max(mx, Math.abs(x - y) / Math.max(Math.abs(x), 1e-300));
    }
    O.rigidSame = mx;
  }
  // ② 求積: rigid・k = 0 の secularF は第337便d の secularRates と同じ(傾けた自転・両方・L1・S0)
  {
    let mx = 0;
    const S = L.sysOf({ G: 1, m1: 0.4, m2: 0.6, a: 1, e: 0.3, s1: [0.1, 0, 0.3], s2: [0, 0.2, 0.5], c: 50, mode: 'both' });
    for (const col of ['L1', 'S0']) {
      const A = L.secularRates(S, col, 1e-3, { nQ: 512 }), B = secularF(S, col, 1e-3, { field: 'rigid' }, { nQ: 512 });
      for (const k of ['adot', 'edot', 'wdot', 'Qorb', 'Wforb', 'hdotRel']) mx = Math.max(mx, Math.abs(A[k] - B[k]) / Math.max(Math.abs(A[k]), 1e-300));
    }
    O.secularSame = mx;
  }
  // ③ 場の型の時間の変化(dU)を差分と照らす(pow1・pow2・sphere —— 中心差分)
  {
    let mx = 0;
    const s = [0.2, -0.1, 0.9], d = [3, 1, 0.5], w = [-0.2, 0.7, 0.1], h = 1e-5;
    for (const fld of ['rigid', 'pow1', 'pow2', 'sphere']) {
      const F = fieldAt(fld, s, 1.2, d, w), Fp = fieldAt(fld, s, 1.2, add(d, scl(w, h)), w), Fm = fieldAt(fld, s, 1.2, sub(d, scl(w, h)), w);
      const num = scl(sub(Fp.U, Fm.U), 1 / (2 * h)); mx = Math.max(mx, nrm(sub(num, F.dU)) / nrm(F.dU));
    }
    O.dUfd = mx;
  }
  // ④ sphere は第332便a の sphereRot と同じ(大きさと向き)・pow の型は R_d の内で剛体
  {
    const s = spinVec(2, 30, 40), d = [4e4, 1e4, 3e3], m = 2e30, Rd = rdOf(m), F = fieldAt('sphere', s, Rd, d, [0, 0, 0]);
    const R = sphereRot({ x: [0, 0, 0], m, axis: s, Omega: nrm(s) }, { x: d });
    const inside = fieldAt('pow2', s, 10, [1, 2, 3], [0, 0, 0]), rig = fieldAt('rigid', s, 10, [1, 2, 3], [0, 0, 0]);
    O.sphere = Math.max(nrm(sub(F.U, R.uRot)) / R.mag, nrm(sub(inside.U, rig.U)) / nrm(rig.U));
  }
  // ⑤ L1 の ȧ は軸の角 θ の cos に線形(rigid —— θ = 0・180 から 90 を引く)。v·u が s について線形のため
  {
    const base = { G: 1, m1: 0.3, m2: 0.7, a: 1, e: 0.3, c: 1000, mode: 'both' };
    const at = (th) => secularF(L.sysOf(Object.assign({}, base, { s1: spinVec(0.4, th, 20), s2: spinVec(0.8, th, 20) })), 'L1', 1e-3, { field: 'rigid' }, { nQ: 512 }).adot;
    const a0 = at(0), a180 = at(180), a90 = at(90), a60 = at(60);
    O.cosLinear = Math.max(Math.abs(a90 - (a0 + a180) / 2), Math.abs(a60 - (a0 * 0.75 + a180 * 0.25))) / Math.abs(a0);
  }
  // ⑥ 公転面の内の場の速さ = |s| |cos θ| r(rigid —— 最大は遠点)・面に垂直な分 = |s| sin θ × (r の軸の射影に垂直な成分)の最大 = |s| sin θ b(φ = 0)
  {
    const S = L.sysOf({ G: 1, m1: 1e-6, m2: 1, a: 1, e: 0.2, c: 1000, mode: 'recv', s2: spinVec(0.5, 50, 0) });
    const R = secularF(S, 'L1', 0, { field: 'rigid' }, { nQ: 512 });
    const inMax = 0.5 * Math.cos(50 * DEG) * 1.2 / 1000, perpMax = 0.5 * Math.sin(50 * DEG) * Math.sqrt(1 - 0.2 * 0.2) / 1000;   // 軸の射影 +x に垂直な位置の最大 = 短半径 b
    O.inPlane = Math.max(Math.abs(R.usInMaxOverC / inMax - 1), Math.abs(R.usPerpMaxOverC / perpMax - 1));
  }
  // ⑦ 詰まり具合のノブ: k = 0 は因子 1・円の軌道で率は (Ξ/Ξ_ref)^k 倍(L1 —— 受け手だけ)
  {
    const G = DECL.G, c = DECL.c, m2 = 2e30, a = 1e10, S = L.sysOf({ G, m1: 1e20, m2, a, e: 0, c, mode: 'recv' });
    const R0 = secularF(S, 'L1', 1e-20, { field: 'none', k: 0 }, { nQ: 256 }), R2 = secularF(S, 'L1', 1e-20, { field: 'none', k: 2 }, { nQ: 256 });
    const f = Math.pow(G * m2 / (c * c * a) / XI_REF, 2);
    O.comp = Math.abs(R2.adot / (R0.adot * f) - 1);
  }
  // ⑦′ 速い形(adotOfK)は secularF の ȧ と同じ(両方・傾けた自転・k = 0・2.5 —— L1・S0)
  {
    let mx = 0;
    const G = DECL.G, c = DECL.c, S = L.sysOf({ G, m1: 1.3e30, m2: 2.6e30, a: 1e9, e: 0.3, c, mode: 'both', s1: spinVec(30, 40, 10), s2: spinVec(200, 40, 10) });
    for (const col of ['L1', 'S0']) for (const k of [0, 2.5]) {
      const cfg = { field: 'pow2', Rd1: 1e4, Rd2: 2e4, k }, A = secularF(S, col, 1, cfg, { nQ: 256 }).adot, B = adotOfK(S, col, cfg, { nQ: 256 })(k);
      mx = Math.max(mx, Math.abs(A - B) / Math.abs(A));
    }
    O.fastK = mx;
  }
  // ⑧ 帳簿(点ごとの F·v + Q̇ − F·U・傾けた自転・両方・場の型 4・列 7)
  {
    let mx = 0;
    const S = L.sysOf({ G: 1, m1: 0.4, m2: 0.6, a: 1, e: 0.4, s1: spinVec(0.3, 70, 10), s2: spinVec(0.6, 120, 80), c: 50, mode: 'both' });
    for (const fld of ['rigid', 'pow1', 'pow2', 'sphere']) for (const col of L.COL_KEYS) { const R = secularF(S, col, 1e-3, { field: fld, Rd1: 0.05, Rd2: 0.05, k: 0 }, { nQ: 256 }); mx = Math.max(mx, R.pointResMax, R.ledgerRel); }
    O.ledger = mx;
  }
  // ⑨ 入力の拒否
  {
    const tries = [() => fieldAt('x', [0, 0, 1], 1, [1, 0, 0], [0, 1, 0]), () => fieldAt('pow1', [0, 0, 1], 0, [1, 0, 0], [0, 1, 0]), () => fieldAt('sphere', [0, 0, 1], 2, [1, 0, 0], [0, 1, 0]),
      () => spinVec(NaN), () => sysFor('nope'), () => pairForcesF(L.sysOf({ G: 1, m1: 1, m2: 1, a: 1, e: 0 }), 'L1', 1, [1, 0, 0], [0, 1, 0], { field: 'rigid', k: NaN })];
    let n = 0; for (const t of tries) { try { t(); } catch (e) { if (e instanceof RangeError) n++; } }
    O.reject = { n, of: tries.length };
  }
  // 丸めの床で 0 に寄せた形(教訓 2 —— 正本に打ち消しの残りを書かない)
  for (const k of ['rigidSame', 'secularSame', 'ledger', 'sphere', 'cosLinear', 'inPlane', 'comp', 'fastK']) O[k] = O[k] < 1e-12 ? 0 : O[k];
  // 差分の照らしは打ち切りと丸めの両方を含む —— 値そのものでなく桁(10 の指数の切り上げ)だけを書く
  O.dUfd = Math.ceil(Math.log10(O.dUfd));
  return O;
}
export function pureGates(O) {
  return {
    rigidSame: O.rigidSame <= 1e-12, secularSame: O.secularSame <= 1e-12, dUfd: O.dUfd <= -7, sphere: O.sphere <= 1e-12, cosLinear: O.cosLinear <= 1e-9,
    inPlane: O.inPlane <= 1e-9, comp: O.comp <= 1e-12, fastK: O.fastK <= 1e-12, ledger: O.ledger <= 1e-12, reject: O.reject.n === O.reject.of,
  };
}
