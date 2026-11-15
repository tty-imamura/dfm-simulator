// 第337便d(原仮定者の指示(2026-11-14 —— 第138報)「慣性移動の、自分自身を除いた慣性決定力場に対する加減速は、加速の方がわずかに多くのエネルギーが必要と推測する」
//   「慣性決定力場に対する加減速にわずかでも差が有るなら、供給が無ければいずれ、自分自身の慣性移動が減衰し、慣性決定力場に引きずられるだけの状態になる」
//   「連星の軌道は、近点と遠点が存在し、慣性移動に加減速が発生する。この加減速の繰り返しで、慣性移動のエネルギーが失われている可能性がある」・統括の検証項目 R340):
//   **慣性移動の加減速の差の候補を測る純関数 —— 自分自身を除いた慣性決定力場の運ぶ速度 U_ext に対する相対の速度 u = v − U_ext への応答の型(どれもノブ)・
//   二体の軌道平均(求積)と閉じた式・二体の数値の積分(RK4)・帳簿(受け手と場の仕事の和 = −熱)**
//   (器 tests/exp-w337d-accelloss.mjs と QA behavior.accelloss337d・docs.accelloss337d が読む —— html を読まない・状態を持たない。第335便b の lib は呼ぶだけ)。
//   **全部「診断」**(エンジン・在位の本・受理器へ足す操作ではない)。出発点の形は統括の参考の試作(線形の抵抗の型)と統括の読み(加減速の非対称の型・速さの依存)。
//
// ■ 記号: 位置 p・距離 r・質量 m・速度 v・観測自転 s(ベクトル)・慣性決定力 W(w_ij —— 背景 W₀)・局所の光速 c(本の単位系の c₀ = 299 792 458 m/s —— 第335便b の lib の DECL.c と同じ)。
//   U_ext,i = Σ_{j≠i} w_ij C_{j→i}/Σ_{j≠i} w_ij(C_{j→i} = v_j + s_j × (p_i − p_j) —— 第335便b の coordVelocity と carriedVelocity〔自己の重み 0〕を呼ぶ)・u_i = v_i − U_ext,i。
//
// ■ 候補の型(探索の入り口 —— 型は後から足してよい・どれもノブ。式の形の宣言ではなく、何を測ったかの記録)
//   型 1(線形の抵抗): 受け手の単位質量の力 f = −k u・k = η A ≥ 0・熱 q = k|u|²。A の 2 つ: L1 A = 1(η は 1/s)/L2 A = |a₀|/c(a₀ は抵抗を除いた受け手の加速度・η は無次元)。
//   型 2(加減速の非対称): P = u·(du/dt)₀(抵抗を除いた ½|u|² の変化の率)・熱 q = ε₊ max(P, 0) + ε₋ max(−P, 0) ≥ 0・f = −q u/|u|²(u = 0 で 0)。
//     列: S0(ε₊ = ε₋ = ε)・S0a(加速だけ ε₊ = ε・ε₋ = 0)・S0d(減速だけ ε₊ = 0・ε₋ = ε —— 鏡の対照)。
//   型 3(速さの依存): 型 2 の ε± に (|u|/c)^p を掛ける(p = 1 の S1・p = 2 の S2 —— p = 0 は S0)。
//   場への反作用: 受け手の力の仕事 F·v = F·u + F·U_ext = −Q̇ + F·U_ext —— **熱は −F·u**・F·U_ext は場の口(源の自転・動く源と遣り取りする仕事)。
//   P の (du/dt)₀ は抵抗を除いた量(陽の形 —— 抵抗を含めた陰の方程式にしない)。
//
// ■ 閉じた式(二体・源の自転 0・一次〔ノブの一次〕・軌道平均 —— M = m₁ + m₂・n = 2π/P)
//   L1: ȧ = −2 k_Σ a・ė = 0(k_Σ = 受け手 η〔両方なら 2η〕)/L2: k₀ = η G m_src/c の和として ȧ = −2 K (1 + e²)/(a (1 − e²)^{3/2})・ė = −2 K e/(a² √(1 − e²))(K = η G M/c は両方・η G m₂/c は受け手だけ)
//   型 2・3(両方なら係数 2): 1 周の損失 ΔE/μ = −(ε₊ + ε₋)(v_p^{p+2} − v_a^{p+2})/((p + 2) c^p)・ȧ = 2a² ΔE/(μ G M P)
//   S0 の ė = ((ε₊ + ε₋)(1 − e²)/(e P)) [ln((1 + e)/(1 − e)) − 2e/(1 − e²)](角運動量の式から —— 円で 0)。それ以外の ė・ϖ̇ は求積だけ。
//
// ■ 言わないこと: 型は候補(慣性移動の則ではない)・閉じた式は宣言した型の一次の軌道平均・ノブの上限は観測の目安(文献の値・未照合)との比・電磁波の抵抗は第138報の例え
//   (天体に共通の抵抗の則として書かない)・行き着く先は宣言した型と初期条件の数値の表(結論ではない)。
import * as CL from './lib-w335b-carryledger.mjs';

export const LIB_VERSION = 'w337d-accelloss-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const v3 = (a) => Array.isArray(a) && a.length === 3 && a.every(fin);
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], scl = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

/** 列(型とノブの形) */
export const COLS = Object.freeze({
  L1: Object.freeze({ type: 'lin', A: 'const', label: '型 1・A = 1' }),
  L2: Object.freeze({ type: 'lin', A: 'acc', label: '型 1・A = |a₀|/c' }),
  S0: Object.freeze({ type: 'asym', p: 0, plus: 1, minus: 1, label: '型 2・ε₊ = ε₋' }),
  S0a: Object.freeze({ type: 'asym', p: 0, plus: 1, minus: 0, label: '型 2・加速だけ' }),
  S0d: Object.freeze({ type: 'asym', p: 0, plus: 0, minus: 1, label: '型 2・減速だけ' }),
  S1: Object.freeze({ type: 'asym', p: 1, plus: 1, minus: 1, label: '型 3・p = 1' }),
  S2: Object.freeze({ type: 'asym', p: 2, plus: 1, minus: 1, label: '型 3・p = 2' }),
});
export const COL_KEYS = Object.freeze(Object.keys(COLS));
export const MODES = Object.freeze(['recv', 'both']);   // recv = 受け手(天体 1)だけが抵抗を受ける/both = 両方(天体 2 も天体 1 の場に対して)
/** 宣言 */
export const DECL = Object.freeze({
  G: 6.674e-11, c: CL.DECL.c, AU: CL.DECL.AU, yearS: CL.DECL.yearS, alpha: CL.DECL.alpha, rRef: CL.DECL.rRef, W0: 0,
  /** 求積の点(離心近点角 E の一様な台形 —— 時間の重み 1 − e cos E) */
  nQuad: 4096,
  idTol: 1e-12,
});

/**
 * 系と観測の目安(SI —— 本便は一次資料に当たっていない〔この箱から外のサイトに届かない〕—— 文献の値・未照合・桁の目安)。
 * 連星パルサーの値は paper/data/solar-observations.csv の行(record_id を書く)・B1913+16 の周期は Weisberg & Huang 2016 の値(行が無い —— 文献の値・未照合)。
 * 自転軸は全部 軌道の面の法線(+z)に置く(傾きは本便のノブにしない —— 宣言)。B1913+16 の伴星の自転は分からないので 0。
 */
export const LIT = Object.freeze({
  note: '文献の値・未照合(連星パルサーの値は paper/data/solar-observations.csv の行・ほかは本の宣言の桁の値と下の出典 —— 観測の目安は桁の目安)',
  systems: Object.freeze({
    mercury: Object.freeze({ m1: 3.3011e23, m2: 1.98847e30, a: 5.790905e10, e: 0.20563593, s1: 0, s2: 2 * Math.PI / (25.38 * 86400), main: 'recv', src: '水星の e は SOL-2988ef27・太陽の自転は恒星の周期 25.38 日(カリントンの自転)' }),
    earth: Object.freeze({ m1: 5.9722e24, m2: 1.98847e30, a: 1.495978707e11, e: 0.0167086, s1: 7.2921159e-5, s2: 2 * Math.PI / (25.38 * 86400), main: 'recv', src: '半長軸は 1 au・e は J2000 の平均の要素の桁' }),
    moon: Object.freeze({ m1: 7.342e22, m2: 5.9722e24, a: 3.84399e8, e: 0.0549, s1: 2 * Math.PI / 2360591.559, s2: 7.2921159e-5, main: 'recv', src: '月の e は SOL-47b082ec・恒星月は SOL-82ff686c・地球の自転 7.2921159e-5 rad/s' }),
    b1913: Object.freeze({ m1: 2.764015e30, m2: 2.859463e30, e: 0.6171340, Pb: 0.322997448918 * 86400, s1: 0, s2: 2 * Math.PI / 0.059030, main: 'both',
      src: '質量は SOL-9cf836ac(パルサー)・SOL-32596604(伴星)・e は SOL-aa6edaa2・Pb は Weisberg & Huang 2016(行なし)・自転の周期 59.03 ms(行なし)' }),
    j0737: Object.freeze({ m1: 2.483370041e30, m2: 2.660982861e30, e: 0.087777036, Pb: 8834.534723278, s1: 2 * Math.PI / 2.77346074724, s2: 2 * Math.PI / 0.02269937898645, main: 'both',
      src: '質量は SOL-3b7d7d41(B)・SOL-7ba92aa0(A)・e は SOL-40d95cf1・Pb は SOL-cf1e8fbf・自転は SOL-649c64b4(B)・SOL-91ac7b68(A)' }),
  }),
  /** 観測の目安(kind: adotRel = |ȧ/a| の上限 [1/年]・adotAbs = |ȧ| の上限 [m/年]・pbdotAbs = |Ṗ_b| の上限 [s/s]) */
  bounds: Object.freeze({
    mercury: Object.freeze({ kind: 'adotRel', value: 1e-13, src: '惑星の暦からの Ġ/G の上限の桁 1e-13/年(Pitjeva & Pitjev 2013 MNRAS 432 3431・Genova et al. 2018 Nat. Commun. 9 289)を |ȧ/a| の目安に読み替えた —— 署名(e の変化)は違う' }),
    earth: Object.freeze({ kind: 'adotAbs', value: 0.15, src: 'Krasinsky & Brumberg 2004 Celest. Mech. 90 267 の dAU/dt = 15 ± 4 m/世紀 の大きさ(測られた値は正の向き —— 損失の向きではない)を |ȧ| の目安に' }),
    moon: Object.freeze({ kind: 'adotAbs', value: 7e-4, src: '月レーザー測距の ȧ = +3.82 ± 0.07 cm/年(Dickey et al. 1994 Science 265 482)の不確かさ 0.07 cm/年 を潮汐の外の余りの目安に' }),
    b1913: Object.freeze({ kind: 'pbdotAbs', ratioSigma: 0.0016, nSigma: 2, src: '観測/重力波の Ṗ_b の比 0.9983 ± 0.0016(SOL-1b28918b)の 2σ × |Ṗ_b(重力波 —— Peters の式・上の質量・e・Pb)|' }),
    j0737: Object.freeze({ kind: 'pbdotAbs', sigma: 7.9e-17, nSigma: 2, src: '固有の Ṗ_b = −1.247752e-12 の σ 7.9e-17(SOL-b2d82241)の 2σ' }),
  }),
  /** 熱の比べる桁(地球の潮汐の散逸 —— Munk & Wunsch 1998 ほか) */
  tidalDissipationW: 3.7e12,
});

/* ───────── U_ext と u ───────── */
/** 受け手 at の、自分自身を除いた慣性決定力場の運ぶ速度(第335便b の coordVelocity と carriedVelocity〔自己の重み 0〕を呼ぶ)。sources: [{ p, v, s, m }]・spin: false なら s を 0 に置く */
export function uExtOf({ at, v, sources, alpha = DECL.alpha, rRef = DECL.rRef, spin = true, W0 = 0, vBg = null }) {
  if (!v3(at) || !v3(v) || !Array.isArray(sources) || sources.length === 0) throw new RangeError('uExtOf: at・v は有限の 3 成分・源は 1 つ以上');
  const srcs = sources.map((q) => {
    if (!q || !v3(q.p) || !v3(q.v) || !v3(q.s) || !fin(q.m) || !(q.m > 0)) throw new RangeError('uExtOf: 源は { p, v, s, m > 0 }');
    const r = nrm(sub(at, q.p)); if (!(r > 0)) throw new RangeError('uExtOf: 源と受け手が同じ位置');
    return { w: (q.m / (rRef * rRef)) * Math.pow(rRef / r, alpha), C: CL.coordVelocity({ p: q.p, v: q.v, s: spin ? q.s : [0, 0, 0] }, at) };
  });
  const cv = CL.carriedVelocity({ v, selfW: 0, W0, vBg, sources: srcs });
  return { U: cv.U, u: sub(v, cv.U), W: cv.W };
}

/* ───────── 応答の型 ───────── */
/** 列 col・ノブ knob(L: η・S: ε)・u・(du/dt)₀・|a₀|・c → 単位質量の力 f と熱の率 q(= −f·u ≥ 0) */
export function dragOf(col, knob, { u, du0, a0mag, c }) {
  const C = COLS[col];
  if (!C) throw new RangeError('dragOf: 列は ' + COL_KEYS.join('・'));
  if (!fin(knob) || knob < 0) throw new RangeError('dragOf: ノブは 0 以上の有限');
  if (!v3(u)) throw new RangeError('dragOf: u は有限の 3 成分');
  if (C.type === 'lin') {
    let k = knob;
    if (C.A === 'acc') { if (!fin(a0mag) || a0mag < 0 || !fin(c) || !(c > 0)) throw new RangeError('dragOf: L2 は |a₀| ≥ 0 と c > 0'); k = knob * a0mag / c; }
    return { f: scl(u, -k), q: k * dot(u, u), k };
  }
  if (!v3(du0) || !fin(c) || !(c > 0)) throw new RangeError('dragOf: 型 2・3 は (du/dt)₀ と c > 0');
  const uu = dot(u, u);
  if (!(uu > 0)) return { f: [0, 0, 0], q: 0, k: 0, P: 0 };
  const P = dot(u, du0), sp = C.p === 0 ? 1 : Math.pow(Math.sqrt(uu) / c, C.p);
  const q = knob * sp * (P > 0 ? C.plus * P : -C.minus * P);
  return { f: scl(u, -q / uu), q, k: q / uu, P };
}

/* ───────── 二体 ───────── */
/** 二体の系(単位は呼び手の G で揃える)。m1 = 受け手・m2 = 源・s1・s2 = 観測自転のベクトル */
export function sysOf({ G = DECL.G, m1, m2, a, e, s1 = [0, 0, 0], s2 = [0, 0, 0], c = DECL.c, mode = 'recv' }) {
  if (![G, m1, m2, a, e, c].every(fin) || !(G > 0) || !(m1 > 0) || !(m2 > 0) || !(a > 0) || !(e >= 0 && e < 1) || !(c > 0)) throw new RangeError('sysOf: G・m・a・c > 0・0 ≤ e < 1');
  if (!v3(s1) || !v3(s2) || !MODES.includes(mode)) throw new RangeError('sysOf: 自転は 3 成分・mode は ' + MODES.join('・'));
  const M = m1 + m2, GM = G * M;
  return { G, m1, m2, M, mu: m1 * m2 / M, GM, a, e, s1, s2, c, mode, n: Math.sqrt(GM / (a * a * a)), P: 2 * Math.PI * Math.sqrt(a * a * a / GM) };
}
/** 相対の軌道(p₁ − p₂)の離心近点角 E の位置と速度(近点は +x・面は xy) */
export function keplerAt(S, E) {
  const { a, e, GM } = S, ce = Math.cos(E), se = Math.sin(E), b = Math.sqrt(1 - e * e);
  const r = [a * (ce - e), a * b * se, 0], rm = a * (1 - e * ce), k = Math.sqrt(GM * a) / rm;
  return { r, v: [-k * se, k * b * ce, 0], rm, w: 1 - e * ce };
}
/** 1 点の抵抗の力と熱と場の口(慣性系 = 重心の系の速度)。r = p₁ − p₂・v = v₁ − v₂・V = 重心の速度(既定 0) */
export function pairForces(S, col, knob, r, v, V = [0, 0, 0]) {
  const { G, m1, m2, M, s1, s2, c, mode } = S, rm = nrm(r), r3 = rm * rm * rm;
  const aRel = scl(r, -G * M / r3);   // 抵抗を除いた相対の加速度
  const p1 = scl(r, m2 / M), p2 = scl(r, -m1 / M), v1 = add(V, scl(v, m2 / M)), v2 = add(V, scl(v, -m1 / M));
  // 天体 1: U₁ = v₂ + s₂ × (p₁ − p₂)・u₁ = v − s₂ × r・(du₁/dt)₀ = a_rel − s₂ × v・|a₀| = G m₂/r²
  const U1 = add(v2, crs(s2, r)), u1 = sub(v1, U1), d1 = dragOf(col, knob, { u: u1, du0: sub(aRel, crs(s2, v)), a0mag: G * m2 / (rm * rm), c });
  let f2 = [0, 0, 0], q2 = 0, U2 = [0, 0, 0], u2 = [0, 0, 0];
  if (mode === 'both') {
    U2 = add(v1, crs(s1, scl(r, -1))); u2 = sub(v2, U2);
    const d2 = dragOf(col, knob, { u: u2, du0: add(scl(aRel, -1), crs(s1, v)), a0mag: G * m1 / (rm * rm), c });
    f2 = d2.f; q2 = d2.q;
  }
  const Qdot = m1 * d1.q + m2 * q2, Pfield = m1 * dot(d1.f, U1) + m2 * dot(f2, U2), Pmech = m1 * dot(d1.f, v1) + m2 * dot(f2, v2);
  return { f1: d1.f, f2, fRel: sub(d1.f, f2), Qdot, Pfield, Pmech, u1, u2, U1, U2, aRel, P1: d1.P };
}
/** 摂動の率(単位質量の相対の力 f —— 比エネルギー・角運動量・ラプラスのベクトル A = v × h − GM r̂) */
function elemRates(S, r, v, f) {
  const h = crs(r, v), rm = nrm(r);
  const Adot = add(crs(f, h), crs(v, crs(r, f)));
  const A = sub(crs(v, h), scl(r, S.GM / rm));
  return { epsDot: dot(v, f), hDot: crs(r, f), h, A, Adot };
}
/** 軌道平均(求積 —— E の一様な台形・時間の重み 1 − e cos E)。戻り値: ȧ・ė・ϖ̇・Ṗ/P・1 周の力学の損失 ΔE・熱 Q・場の口 W_f・帳簿の残り */
export function secularRates(S, col, knob, { nQ = DECL.nQuad } = {}) {
  let sw = 0, eps = 0, hd = [0, 0, 0], Ad = [0, 0, 0], Q = 0, Pf = 0, Pm = 0, maxRes = 0;
  const h0 = crs(keplerAt(S, 0).r, keplerAt(S, 0).v), A0 = sub(crs(keplerAt(S, 0).v, h0), scl(keplerAt(S, 0).r, S.GM / keplerAt(S, 0).rm));
  for (let i = 0; i < nQ; i++) {
    const E = 2 * Math.PI * i / nQ, K = keplerAt(S, E), F = pairForces(S, col, knob, K.r, K.v), R = elemRates(S, K.r, K.v, F.fRel);
    sw += K.w; eps += K.w * R.epsDot; hd = add(hd, scl(R.hDot, K.w)); Ad = add(Ad, scl(R.Adot, K.w));
    Q += K.w * F.Qdot; Pf += K.w * F.Pfield; Pm += K.w * F.Pmech;
    maxRes = Math.max(maxRes, Math.abs(F.Pmech + F.Qdot - F.Pfield) / Math.max(Math.abs(F.Qdot), Math.abs(F.Pfield), Math.abs(F.Pmech), 1e-300));
  }
  eps /= sw; hd = scl(hd, 1 / sw); Ad = scl(Ad, 1 / sw); Q /= sw; Pf /= sw; Pm /= sw;
  const { a, e, GM, P, mu } = S, hm = nrm(h0), hHat = scl(h0, 1 / hm);
  const adot = 2 * a * a * eps / GM;
  let edot, wdot;
  if (e > 0) { const eHat = scl(A0, 1 / nrm(A0)); edot = dot(eHat, Ad) / GM; wdot = dot(crs(eHat, Ad), hHat) / (GM * e); }
  else { edot = nrm(Ad) / GM; wdot = null; }   // 円: e の大きさの率(向きは決まらない)
  return { adot, edot, wdot, hdotRel: dot(hd, hHat) / hm, PdotOverP: 1.5 * adot / a, dEorb: Pm * P, dEorbRel: mu * eps * P, Qorb: Q * P, Wforb: Pf * P,
    ledgerRel: Math.abs(Pm + Q - Pf) / Math.max(Math.abs(Q), Math.abs(Pf), Math.abs(Pm), 1e-300), pointResMax: maxRes };
}
/** 閉じた式(源の自転 0 の系だけ —— それ以外は null)。ȧ・ė(L1・L2・S0 系)と 1 周の力学の損失 ΔE */
export function closedForm(S, col, knob) {
  const C = COLS[col], { a, e, GM, G, m1, m2, M, mu, P, c, mode } = S;
  if (nrm(S.s1) !== 0 || nrm(S.s2) !== 0) return null;
  const b2 = 1 - e * e, fac = mode === 'both' ? 2 : 1;
  if (C.type === 'lin' && C.A === 'const') {
    const k = fac * knob;
    return { adot: -2 * k * a, edot: 0, dEorb: -mu * k * (GM / a) * P };
  }
  if (C.type === 'lin') {
    const K = knob * G * (mode === 'both' ? M : m2) / c;
    const adot = -2 * K * (1 + e * e) / (a * Math.pow(b2, 1.5));
    return { adot, edot: -2 * K * e / (a * a * Math.sqrt(b2)), dEorb: mu * GM * adot * P / (2 * a * a) };
  }
  const vp = Math.sqrt(GM * (1 + e) / (a * (1 - e))), va = Math.sqrt(GM * (1 - e) / (a * (1 + e))), p = C.p, es = fac * knob * (C.plus + C.minus);
  const dE = -mu * es * (Math.pow(vp, p + 2) - Math.pow(va, p + 2)) / ((p + 2) * Math.pow(c, p));
  const adot = 2 * a * a * dE / (mu * GM * P);
  let edot = null;
  if (p === 0) edot = e > 0 ? (es * b2 / (e * P)) * (Math.log((1 + e) / (1 - e)) - 2 * e / b2) : 0;
  return { adot, edot, dEorb: dE };
}

/* ───────── 二体の数値の積分(RK4 —— 慣性系・重心の系から始める) ───────── */
/** 接触の要素(相対の位置と速度から): a・e・ϖ(+x からの近点の角)・比エネルギー */
export function elementsOf(GM, r, v) {
  const rm = nrm(r), eps = dot(v, v) / 2 - GM / rm, h = crs(r, v), A = sub(crs(v, h), scl(r, GM / rm)), ev = scl(A, 1 / GM);
  return { a: -GM / (2 * eps), e: nrm(ev), varpi: Math.atan2(ev[1], ev[0]), eps };
}
/** 状態 y = [p1(3), v1(3), p2(3), v2(3), Q, Wf] の微分 */
function deriv(S, col, knob, y) {
  const p1 = y.slice(0, 3), v1 = y.slice(3, 6), p2 = y.slice(6, 9), v2 = y.slice(9, 12);
  const r = sub(p1, p2), v = sub(v1, v2), V = scl(add(scl(v1, S.m1), scl(v2, S.m2)), 1 / S.M);
  const rm = nrm(r), g = S.G / (rm * rm * rm);
  let f1 = [0, 0, 0], f2 = [0, 0, 0], Qd = 0, Pf = 0;
  if (knob > 0) { const F = pairForces(S, col, knob, r, v, V); f1 = F.f1; f2 = F.f2; Qd = F.Qdot; Pf = F.Pfield; }
  const a1 = add(scl(r, -g * S.m2), f1), a2 = add(scl(r, g * S.m1), f2);
  return [...v1, ...a1, ...v2, ...a2, Qd, Pf];
}
export function stateAtE(S, E) {
  const K = keplerAt(S, E), { m1, m2, M } = S;
  return [...scl(K.r, m2 / M), ...scl(K.v, m2 / M), ...scl(K.r, -m1 / M), ...scl(K.v, -m1 / M), 0, 0];
}
export function mechEnergy(S, y) {
  const v1 = y.slice(3, 6), v2 = y.slice(9, 12), r = nrm(sub(y.slice(0, 3), y.slice(6, 9)));
  return 0.5 * S.m1 * dot(v1, v1) + 0.5 * S.m2 * dot(v2, v2) - S.G * S.m1 * S.m2 / r;
}
/** RK4 で n 步(刻み h)。y を返す(新しい配列) */
export function rk4(S, col, knob, y0, h, n) {
  let y = y0.slice();
  const ax = (u, k, s) => u.map((x, i) => x + s * k[i]);
  for (let i = 0; i < n; i++) {
    const k1 = deriv(S, col, knob, y), k2 = deriv(S, col, knob, ax(y, k1, h / 2)), k3 = deriv(S, col, knob, ax(y, k2, h / 2)), k4 = deriv(S, col, knob, ax(y, k3, h));
    y = y.map((x, j) => x + (h / 6) * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j]));
  }
  return y;
}
/** 数値の率: 近点から nOrb 周(1 周 nStep 步)を抵抗あり・なし(対照)で積み、要素の差 ÷ 時間。帳簿の残り(ΔE_mech + Q − W_f)/max(|Q|,|W_f|) も返す */
export function controlRun(S, { nOrb = 4, nStep = 1000 } = {}) { const y0 = stateAtE(S, 0); return { nOrb, nStep, y: rk4(S, 'L1', 0, y0, S.P / nStep, nOrb * nStep) }; }
export function numericRates(S, col, knob, { nOrb = 4, nStep = 1000, control = null } = {}) {
  const y0 = stateAtE(S, 0), h = S.P / nStep, n = nOrb * nStep, T = n * h;
  const yd = rk4(S, col, knob, y0, h, n), yc = control && control.nOrb === nOrb && control.nStep === nStep ? control.y : rk4(S, col, 0, y0, h, n);
  const el = (y) => elementsOf(S.GM, sub(y.slice(0, 3), y.slice(6, 9)), sub(y.slice(3, 6), y.slice(9, 12)));
  const ed = el(yd), ec = el(yc);
  let dw = ed.varpi - ec.varpi; dw = Math.atan2(Math.sin(dw), Math.cos(dw));
  const dEm = mechEnergy(S, yd) - mechEnergy(S, y0), Q = yd[12], Wf = yd[13];
  const dEc = mechEnergy(S, yc) - mechEnergy(S, y0);
  return { adot: (ed.a - ec.a) / T, edot: (ed.e - ec.e) / T, wdot: S.e > 0 ? dw / T : null, Qorb: Q / nOrb, dEorb: (dEm - dEc) / nOrb,
    ledgerRel: Math.abs((dEm - dEc) + Q - Wf) / Math.max(Math.abs(Q), Math.abs(Wf), 1e-300), controlDrift: Math.abs(dEc) / Math.abs(mechEnergy(S, y0)) };
}
/** 長い走行(行き着く先): 周ごとに接触の要素から刻み P_osc/nStep を引き直して nOrb 周まで(止まりの条件 a < aMin・a > aMax)。標本は every 周ごと */
export function longRun(S, col, knob, { nOrb = 300, nStep = 600, every = 10, aMin = 0.05, aMax = 4, E0 = 0 } = {}) {
  let y = stateAtE(S, E0);
  const el = (y) => elementsOf(S.GM, sub(y.slice(0, 3), y.slice(6, 9)), sub(y.slice(3, 6), y.slice(9, 12)));
  const uOf = (y) => { const F = pairForces(S, col, knob, sub(y.slice(0, 3), y.slice(6, 9)), sub(y.slice(3, 6), y.slice(9, 12))); return { u1: nrm(F.u1), u2: nrm(F.u2) }; };
  const E0m = mechEnergy(S, y), samp = [];
  const push = (k) => { const z = el(y), uu = uOf(y); samp.push({ orb: k, a: z.a, e: z.e, varpi: z.varpi, u1: uu.u1, u2: uu.u2, Q: y[12], Wf: y[13], dEm: mechEnergy(S, y) - E0m }); };
  push(0);
  let k = 0, stop = 'nOrb';
  while (k < nOrb) {
    const z = el(y);
    if (!(z.a > 0) || z.a < aMin * S.a) { stop = 'aMin'; break; }
    if (z.a > aMax * S.a) { stop = 'aMax'; break; }
    const Pk = 2 * Math.PI * Math.sqrt(z.a * z.a * z.a / S.GM);
    y = rk4(S, col, knob, y, Pk / nStep, nStep); k++;
    if (k % every === 0 || k === nOrb) push(k);
  }
  if (samp[samp.length - 1].orb !== k) push(k);
  const last = samp[samp.length - 1];
  return { samples: samp, stop, orbits: k, ledgerRel: Math.abs(last.dEm + last.Q - last.Wf) / Math.max(Math.abs(last.Q), Math.abs(last.Wf), 1e-300) };
}
/** 型 2(S0)の軌道平均の (a, e) の道(閉じた式の常微分方程式 —— d ln a/d e を e について積む)。eList の各点の a/a₀ */
export function s0Track(e0, eList, nSub = 20000) {
  const g = (e) => { const b2 = 1 - e * e; const ad = -4 * e / b2, ed = (b2 / e) * (Math.log((1 + e) / (1 - e)) - 2 * e / b2); return ad / ed; };   // (ȧ/a)/(ė) —— ε と P は約す
  const out = [];
  let lnA = 0, e = e0;
  for (const et of eList) {
    const de = (et - e) / nSub;
    for (let i = 0; i < nSub; i++) { const em = e + (i + 0.5) * de; lnA += g(em) * de; }
    e = et; out.push({ e: et, aOverA0: Math.exp(lnA), slopeLog: g(et) * et });
  }
  return out;
}
/** 二体の重力波の Ṗ_b(比べる量の物差しだけ —— Peters 1964 の式) */
export function petersPbdot(G, c, m1, m2, Pb, e) {
  const fe = (1 + 73 / 24 * e * e + 37 / 96 * e ** 4) / Math.pow(1 - e * e, 3.5);
  return -(192 * Math.PI / 5) * Math.pow(G, 5 / 3) / Math.pow(c, 5) * Math.pow(Pb / (2 * Math.PI), -5 / 3) * fe * m1 * m2 / Math.pow(m1 + m2, 1 / 3);
}
/** 周期から半長軸(ケプラー) */
export const aFromP = (GM, P) => Math.cbrt(GM * (P / (2 * Math.PI)) ** 2);

/* ───────── 純関数の場面(QA と器の門) ───────── */
export function pureScenes() {
  const S = {};
  // ① ノブ 0 で損失 0(全部の列・e 0.3・源の自転あり/なし・両方)
  {
    let mx = 0;
    for (const col of COL_KEYS) for (const s2 of [[0, 0, 0], [0, 0, 0.5]]) for (const mode of MODES) {
      const Sy = sysOf({ G: 1, m1: 0.5, m2: 0.5, a: 1, e: 0.3, s2, s1: s2, c: 1000, mode }), R = secularRates(Sy, col, 0, { nQ: 256 });
      mx = Math.max(mx, Math.abs(R.adot), Math.abs(R.edot), Math.abs(R.Qorb), Math.abs(R.Wforb));
    }
    S.zero = mx;
  }
  // ② 型 2・3 は円で 0(源の自転 0・自転あり・両方)・型 1 は円でも落ちる
  {
    let mx = 0;
    for (const col of ['S0', 'S0a', 'S0d', 'S1', 'S2']) for (const s2 of [[0, 0, 0], [0, 0, 0.5]]) for (const mode of MODES) {
      const R = secularRates(sysOf({ G: 1, m1: 0.5, m2: 0.5, a: 1, e: 0, s2, s1: s2, c: 1000, mode }), col, 1e-3, { nQ: 256 });
      mx = Math.max(mx, Math.abs(R.adot), Math.abs(R.Qorb));
    }
    S.asymCircle = mx;
    S.linCircle = secularRates(sysOf({ G: 1, m1: 1e-6, m2: 1, a: 1, e: 0, c: 1000 }), 'L1', 1e-3, { nQ: 256 }).adot;   // 期待 −2e-3
  }
  // ③ 閉じた式と求積(源の自転 0・e 0.3・受け手だけと両方)
  {
    let mx = 0;
    for (const col of COL_KEYS) for (const mode of MODES) {
      const Sy = sysOf({ G: 1, m1: 0.3, m2: 0.7, a: 1, e: 0.3, c: 1000, mode }), kn = COLS[col].type === 'lin' ? 1e-3 : (COLS[col].p === 0 ? 1e-3 : COLS[col].p === 1 ? 1 : 1e3);
      const R = secularRates(Sy, col, kn, { nQ: 8192 }), CF = closedForm(Sy, col, kn);
      mx = Math.max(mx, Math.abs(R.adot - CF.adot) / Math.abs(CF.adot), Math.abs(R.dEorb - CF.dEorb) / Math.abs(CF.dEorb));
      if (CF.edot !== null && CF.edot !== 0) mx = Math.max(mx, Math.abs(R.edot - CF.edot) / Math.abs(CF.edot));
    }
    S.closed = mx;
  }
  // ④ 帳簿(点ごとの F·v = −Q̇ + F·U_ext —— 源の自転あり・両方)
  {
    let mx = 0;
    for (const col of COL_KEYS) { const R = secularRates(sysOf({ G: 1, m1: 0.4, m2: 0.6, a: 1, e: 0.4, s1: [0, 0.2, 0.3], s2: [0.1, 0, 0.6], c: 50, mode: 'both' }), col, 1e-3, { nQ: 512 }); mx = Math.max(mx, R.pointResMax, R.ledgerRel); }
    S.ledger = mx;
  }
  // ⑤ U_ext: 源 1 つなら C_{j→i}(重みに依らない)・源 2 つは重みの平均・自転を外すと v_j
  {
    const src = [{ p: [0, 0, 0], v: [1, 2, 3], s: [0, 0, 2], m: 5 }], at = [3, 0, 0], v = [0, 7, 0];
    const U1 = uExtOf({ at, v, sources: src }).U, C = CL.coordVelocity(src[0], at);
    const U0 = uExtOf({ at, v, sources: src, spin: false }).U;
    const src2 = src.concat([{ p: [6, 0, 0], v: [0, 0, 0], s: [0, 0, 0], m: 5 }]), U2 = uExtOf({ at, v, sources: src2, alpha: 2, rRef: 1 }).U;
    S.uext = Math.max(nrm(sub(U1, C)) / nrm(C), nrm(sub(U0, [1, 2, 3])) / nrm([1, 2, 3]), nrm(sub(U2, scl(add(C, [0, 0, 0]), 0.5))) / nrm(C));
  }
  // ⑥ 相互にロックした円の連星(s₁ = s₂ = n ẑ)で u = 0 → 全部の列で損失 0
  {
    let mx = 0, um = 0;
    for (const col of COL_KEYS) {
      const Sy0 = sysOf({ G: 1, m1: 0.5, m2: 0.5, a: 1, e: 0, c: 1000, mode: 'both' }), n = Sy0.n, Sy = sysOf({ G: 1, m1: 0.5, m2: 0.5, a: 1, e: 0, s1: [0, 0, n], s2: [0, 0, n], c: 1000, mode: 'both' });
      const R = secularRates(Sy, col, 1e-3, { nQ: 256 }); mx = Math.max(mx, Math.abs(R.adot), Math.abs(R.Qorb));
      const K = keplerAt(Sy, 1.1), F = pairForces(Sy, col, 1e-3, K.r, K.v); um = Math.max(um, nrm(F.u1), nrm(F.u2));
    }
    S.locked = mx; S.lockedU = um;
  }
  // ⑦ 加速だけ + 減速だけ = 両方(1 周の損失の足し算)・加速だけは ϖ̇ ≠ 0・鏡で符号が反る
  {
    const Sy = sysOf({ G: 1, m1: 1e-6, m2: 1, a: 1, e: 0.3, c: 1000 }), A = secularRates(Sy, 'S0a', 1e-3), D = secularRates(Sy, 'S0d', 1e-3), B = secularRates(Sy, 'S0', 1e-3);
    S.split = { sum: Math.abs(A.adot + D.adot - B.adot) / Math.abs(B.adot), wA: A.wdot, wD: D.wdot, wB: B.wdot };
  }
  // ⑧ 入力の拒否
  {
    const tries = [() => dragOf('X', 1, { u: [1, 0, 0] }), () => dragOf('L1', -1, { u: [1, 0, 0] }), () => dragOf('L2', 1, { u: [1, 0, 0], a0mag: 1, c: 0 }), () => dragOf('S0', 1, { u: [1, 0, 0], c: 1 }),
      () => sysOf({ m1: 1, m2: 1, a: 1, e: 1 }), () => sysOf({ m1: 1, m2: 1, a: 1, e: 0, mode: 'x' }), () => uExtOf({ at: [0, 0, 0], v: [0, 0, 0], sources: [] }), () => uExtOf({ at: [0, 0, 0], v: [0, 0, 0], sources: [{ p: [0, 0, 0], v: [0, 0, 0], s: [0, 0, 0], m: 1 }] })];
    let n = 0; for (const t of tries) { try { t(); } catch (e) { if (e instanceof RangeError) n++; } }
    S.reject = { n, of: tries.length };
  }
  return S;
}
export function pureGates(S) {
  return {
    zero: S.zero === 0,
    asymCircle: S.asymCircle <= 1e-15 && Math.abs(S.linCircle + 2e-3) <= 1e-15,
    closed: S.closed <= 1e-6,
    ledger: S.ledger <= 1e-12,
    uext: S.uext <= 1e-12,
    locked: S.locked <= 1e-15 && S.lockedU <= 1e-12,
    split: S.split.sum <= 1e-9 && Math.abs(S.split.wA) > 0 && Math.abs(S.split.wA + S.split.wD) <= 1e-9 * Math.abs(S.split.wA) && Math.abs(S.split.wB) <= 1e-9 * Math.abs(S.split.wA),
    reject: S.reject.n === S.reject.of,
  };
}
