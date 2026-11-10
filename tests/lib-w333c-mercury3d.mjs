// 第333便c(原仮定者の整理(2026-11-10)「水星は絡む要素が多く難しい天体・軌道も公転面に対して斜め」「G_loc も次数を含めて選択肢のひとつ」「新しい解釈の引きずりも検証する」・
//   原仮定者の回答(2026-11-10 —— AN597)「今の G_loc n = 2 + K1 を凍結の基準に —— 次数と対称・新しい引きずりは比べる列で探索」・原仮定者の回答(2026-11-10 —— AN598)「K1 の +5/3 は相対の並進」・
//   原仮定者の回答(2026-11-10 —— AN600)「連星の +33% は残差 + 対称の G_loc n = 2 の小さな診断」・統括の検証項目 R319):
//   **水星の三次元の対照の純関数 —— 三次元の幾何の宣言・一次の摂動(Gauss の式を軌道で平均)・効果ごとの率(近点引数 ω・近点経度 ϖ・交点 Ω_node・傾き i・軌道面の中の近点の回り)**
//   (器 tests/exp-w333c-mercury3d.mjs と QA lint.mercury3d333c・behavior.mercury3d333c が読む —— html を読まない・状態を持たない・第330便b・第331便c・第332便a の lib は呼ぶだけ・エンジンの式を写さない)。
//
// ■ 区別(各表・各式に付ける —— 作業仮説と今のコードの実装を混ぜない)
//   実装 = 今の beta の html にある型(G_loc の力の型 —— 受け手 n = 2・K1 の並進〔相対の速度に沿う〕)/診断 = この lib の一次の率と純粋な積分器/
//   宣言(未接続)= 今のエンジンに無い型(統合した並進引きずり〔源の回転を含む座標の速度の重み付き平均〕・回転引きずりの差分〔切り口の式・対向 2 点の三次元の差分〕・対称の G_loc の n の格子)。
// ■ 効果の型(どれも**単独で**一次の率を出す —— 同時のフィットはしない。足し算は一次の範囲の宣言)
//   (1) 今の組: G_loc(受け手 n = 2)+ K1 の並進 —— 正本 tests/out/inposk1-w315c.json の値を器が読む(本 lib は一次の分担を Gauss の式で並べる)。
//   (2) G_loc の次数と対称: 力の型 a = −μ e^{−2nε/r} r̂/r²(ε = μ_eff/c² —— 第331便c の gLocShare の μ_eff。受け手 μ_eff = μ(1 − 2η)・対称 μ_eff = μ/2)—— 中心力なので交点・傾きは 0(式で 0 を出す)。
//   (3) 統合した並進引きずり(原仮定者の整理(2026-11-10)の用語 —— 源の座標の速度 v_j + s_j × (p_i − p_j) の重み付き平均・半径を見ない): 受け手の位置の速さに足す速度
//       d = β(r)[s_☉ × (p − p_☉) − (v − v_☉)]・β = w/(W_self + w)・w = m_☉/r^α(第330便b の pointWeight と同じ式 —— α の格子 1・1.5・2・3)・自己の重み W_self(第330便b の selfWeight ——
//       α = 1・2 は ballHarmonic・1.5・3 は point〔ballHarmonic の調和平均は α = 1・2 だけが宣言済み〕)× 半径の規則(kappaM: R = Y_k m・radius: 観測の半径)。並進の分(−βv)と回転の分(β s × p)を分けて出す。
//       **α = 1・ballHarmonic・kappaM の並進の分は K1 の β = C₁R_d/r と同じ係数**(H₁ = C₁ —— 第330便b の harmonicSelf(1))。
//   (4) 回転引きずりの差分(原仮定者の整理(2026-11-10)「引きずり半径の手前と奥の差分 —— 赤道面からの距離が R_d を超えると急激に減衰・斜めも 0 でない」):
//       (4a) 切り口の式(第332便a の主 —— nearfar・尾 0・NF・k1N・R_d = Y_k m —— 第332便a の lib の bandForce を呼ぶ。帯の外で 0 —— 水星は太陽の赤道面を横切る数秒だけ)/
//       (4b) 対向 2 点の三次元の差分(尾 —— 統括の参考の試作の式・枝 a が同じ式を作る〔統合で統括が照らす〕): U = s_d R_d tanh((α/4) ln(1 + 4ρR_d/r₋²))・r₋² = (ρ − R_d)² + z²
//       (重み r^{−α} で源の対向 2 点の速度 ±s_d R_d φ̂ を平均 —— [r₋^{−α} − r₊^{−α}]/[r₋^{−α} + r₊^{−α}] = tanh((α/2) ln(r₊/r₋))・r₊² − r₋² = 4ρR_d)。押しは第332便a の NF の型 a = γ U φ̂・
//       γ = β|s_γ|(β = C₁R_d K1(r; R_d) —— k1N)。**固定の応答率**(s_γ = 観測自転 s)と**連動の応答率**(s_γ = s_d)を別の列に。
//       引きずり自転 s_d(原仮定者の整理(2026-11-10)「引きずり自転は観測自転と限らずノブになり得る —— 角運動量を保って R_d に縮めた回転も係数付きで」): s_d = λ_J (f_obs/f_d)(R_obs/R_d)² s
//       (λ_J = 1 が J を保つ・f_obs = 慣性モーメントの係数〔太陽 0.07 —— 第319便b の表と同じ値〕・f_d = 0.4〔R_d の一様な球の宣言〕)。
// ■ 三次元の幾何(宣言 —— 文献の値と出典は GEOM)
//   基準面を 2 つ: 黄道(J2000 の平均黄道 —— 本の xy 面)と太陽の赤道面(太陽の自転軸 ŝ に垂直)。水星の公転面は第 3 の面(法線 ĥ)。各効果の率を両方の基準面で出す:
//   近点引数 ω(公転面の中で、基準面の昇交点から近日点まで)・近点経度 ϖ = Ω_node + ω(折れた角 —— 交点と近点引数の和)・交点の歳差 dΩ_node/dt・傾きの率 di/dt・
//   **軌道面の中の近点の回り dω/dt + cos i dΩ_node/dt**(基準面に依らない —— 一次)。中心力と公転面の中の力は交点・傾きを動かさず、3 つの近点の率は同じ値。
// ■ 一次の摂動(Gauss の式 —— 加速度 F の動径 R・接線 S・法線 W の成分): dΩ/dt = r sin u W/(h sin i)・di/dt = r cos u W/h・
//   dω/dt = [−p cos f R + (p + r) sin f S]/(e h) − r sin u cos i W/(h sin i)・de/dt = [p sin f R + ((p + r) cos f + r e) S]/h・da/dt = 2a²[e sin f R + (p/r) S]/h(u は基準面の昇交点からの角)。
//   軌道の平均は離心近点角 E の一様な格子(dt = (r/(an)) dE —— 周期の滑らかな被積分で格子の倍で照合)。**速度の型**(位置の速さに d を足す型 —— K1・(3))は w = v + d を接触の速度と読み
//   F = Dd/Dt(無摂動の軌道に沿う時間微分 —— 平均近点角の 4 点の中心差分)とする(接触の要素の差は周期の項だけ —— 永年の率は同じ)。
//   **帯の型**(4a)は帯の外で 0 —— 赤道面を横切る区間(|z| ≤ R_d)だけを Gauss–Legendre で積分(区間の端は z(E) = ±R_d の二分法・点の倍で照合)。
// ■ 言わないこと: 表は「宣言した型で表の値になった」「残差」「候補の表」と書く。G_loc の次数を決めたとは書かない。新しい引きずりで水星の近点の値を出したとは書かない。
//   一次の率は無摂動の軌道の平均(写しの時間発展ではない)—— 率 × 公転周期が 1e-3 を超える列は一次外挿が壊れる印(flags)。文献の値は本便は一次資料に当たっていない。
import { harmonicSelf, kappaMRadius, pointWeight, selfWeight } from './lib-w330b-dragweight.mjs';
import { C1, gLocShare, apsidalNumeric } from './lib-w331c-k1scale.mjs';
import { bandForce, k1Core, glNodes, orbitRates, DECL as DECL332A } from './lib-w332a-eqband.mjs';

export const LIB_VERSION = 'w333c-mercury3d-lib-1';
const isFin = Number.isFinite;
const D2R = Math.PI / 180;
export const ARCSEC_PER_RAD = 180 / Math.PI * 3600;
export const CENTURY_S = 36525 * 86400;
/** rad/s → ″/世紀(ユリウス世紀) */
export const toArcsecCy = (rate) => rate * CENTURY_S * ARCSEC_PER_RAD;

/* ───────── 小さな道具 ───────── */
const isVec = (a) => Array.isArray(a) && a.length === 3 && a.every(isFin);
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], scl = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const unit = (a) => { const n = nrm(a); if (!(n > 0)) throw new RangeError('unit: 0 のベクトル'); return scl(a, 1 / n); };
export const vec = Object.freeze({ add, sub, scl, dot, crs, nrm, unit });
const wrapPi = (x) => Math.atan2(Math.sin(x), Math.cos(x));

/* ───────── 宣言(走行の前に置く —— 結果を見て変えない)───────── */
export const DECL = Object.freeze({
  G: 6.674e-11, c: 299792458,
  /** (2) G_loc の n の格子(ブリーフ R319)× 型 */
  nGrid: Object.freeze([2, 1, 0, -1, -2, -3, -6]),
  pairs: Object.freeze(['receiver', 'symmetric']),
  /** (3) 統合した並進引きずりの重みの次数 α と自己の重みの規則 */
  alphaGrid: Object.freeze([1, 1.5, 2, 3]),
  selfRules: Object.freeze(['kappaM', 'radius']),
  /** (4b) 対向 2 点の差分の重みの次数 α(枝 a の格子と同じ値) */
  pairAlpha: Object.freeze([1, 1.5, 2, 3]),
  /** 引きずり自転 s_d の格子(observed = 観測自転・λ_J = J を保つ変換の係数)・R_d の一様な球の f_d */
  lambdaJ: Object.freeze([1e-6, 1e-3, 1]),
  fDrag: 0.4,
  /** 一次の平均の格子(離心近点角の一様な点の数)と照合の倍・帯の区間の Gauss–Legendre の点・速度の型の中心差分の刻み(平均近点角 rad) */
  nodes: 2048, nodesFine: 4096, bandGL: 48, bandGLFine: 96, fdDelta: 1e-3,
  /** 一次外挿が壊れる印(率 × 公転周期の大きさ —— 角の rad・ln a の変化) */
  breakPerOrbit: 1e-3,
  /** 純粋な三次元の積分器(μ = a = 1・RK4・公転ごとに同じ位相で標本・無摂動の走行を引く) */
  integ: Object.freeze({ stepsPerOrbit: 2000, nOrb: 24 }),
  /** 連星の診断の η の格子(試験粒子・木星・中間・等質量) */
  etaGrid: Object.freeze([0, 9.5352e-4, 0.1, 0.25]),
});
/** 文献の値と出典(本便は一次資料に当たっていない —— 公表値の転記。本の宣言と照らす値は器が本から読む) */
export const GEOM = Object.freeze({
  note: '文献の値 —— 本便は一次資料に当たっていない(この箱から JPL・IAU のサイトに届かない)。本の宣言の値(🌡️🌋🔴 の太陽の極と惑星の状態)は器が本から読んで照らす',
  frame: 'J2000 の平均黄道と分点(本の xy 面・+x は春分点・右手系)',
  obliquityArcsec: Object.freeze({ value: 84381.406, src: 'IAU 2006(Capitaine, N., Wallace, P. T. & Chapront, J. 2003, A&A 412, 567)の J2000 の黄道傾斜角 ε0' }),
  sunPole: Object.freeze({ ra: 286.13, dec: 63.87, src: 'IAU WGCCRE 2009 報告(Archinal, B. A. et al. 2011, Celest. Mech. Dyn. Astr. 109, 101)の太陽の極 α0 286.13°・δ0 63.87°(J2000)' }),
  sunEquatorTilt: Object.freeze({ value: 7.25, src: 'Carrington, R. C. 1863(太陽の赤道面と黄道の傾き 7.25° —— 上の極を黄道へ移すと 7.2517°)' }),
  sunSpinPeriodDays: Object.freeze({ value: 25.38, src: 'Carrington の恒星自転周期 25.38 日(赤道 —— 本の spin は ☄️ の写しで、器が本の値を使う)' }),
  sunMoI: Object.freeze({ value: 0.07, src: '慣性モーメントの係数 I/(MR²) —— 標準の太陽模型の型(第319便b・第318便d の表と同じ値)' }),
  /** JPL の近似要素(E. M. Standish・1800〜2050 年の Table 1・T = 0 —— 🌡️🌋🔴 の本の種と同じ表) */
  elemSrc: 'JPL SSD「Approximate Positions of the Planets」Table 1(Standish, E. M.・J2000 の平均黄道と分点・T = 0)',
  planets: Object.freeze({
    merc: Object.freeze({ ja: '水星', a: 0.38709927, e: 0.20563593, I: 7.00497902, varpi: 77.45779628, Om: 48.33076593, m: 3.3011e23, R: 2.4397e6, spin: 1.2400e-6, eqIncLit: 3.38 }),
    venus: Object.freeze({ ja: '金星', a: 0.72333566, e: 0.00677672, I: 3.39467605, varpi: 131.60246718, Om: 76.67984255, m: 4.8675e24, R: 6.0518e6, spin: -2.9924e-7, eqIncLit: 3.86 }),
    earth: Object.freeze({ ja: '地球(EMB)', a: 1.00000261, e: 0.01671123, I: -0.00001531, varpi: 102.93768193, Om: 0, m: 5.9722e24, R: 6.371e6, spin: 7.2921e-5, eqIncLit: 7.155 }),
    mars: Object.freeze({ ja: '火星', a: 1.52371034, e: 0.09339410, I: 1.84969142, varpi: -23.94362959, Om: 49.55953891, m: 6.4171e23, R: 3.3895e6, spin: 7.0882e-5, eqIncLit: 5.65 }),
  }),
  massSrc: 'NASA NSSDC Planetary Fact Sheet(質量・平均半径・恒星自転 —— 公表値の転記)',
  eqIncSrc: '太陽の赤道面に対する軌道の傾き(水星 3.38°・金星 3.86°・地球 7.155°・火星 5.65° —— 惑星の総説の表の値。器は上の極と要素から計算して並べる)',
  sun: Object.freeze({ m: 1.98847e30, R: 6.957e8 }),
  AU: 1.495978707e11,
});

/* ───────── 三次元の幾何 ───────── */
/** 黄道の極の座標(傾き・方位〔度 —— 本の spinAxis と同じ: 方位は黄経〕)→ 単位ベクトル */
export const axisOf = (tiltDeg, azDeg) => { const t = tiltDeg * D2R, a = azDeg * D2R; return [Math.sin(t) * Math.cos(a), Math.sin(t) * Math.sin(a), Math.cos(t)]; };
/** ICRF の赤道座標の極 (α0, δ0) → 黄道の単位ベクトルと傾き・方位(度) */
export function poleToEcliptic(ra, dec, epsArcsec = GEOM.obliquityArcsec.value) {
  const e = epsArcsec / 3600 * D2R, a = ra * D2R, d = dec * D2R;
  const x = Math.cos(d) * Math.cos(a), y = Math.cos(d) * Math.sin(a), z = Math.sin(d);
  const ye = Math.cos(e) * y + Math.sin(e) * z, ze = -Math.sin(e) * y + Math.cos(e) * z;
  let az = Math.atan2(ye, x) / D2R; if (az < 0) az += 360;
  return { u: [x, ye, ze], tiltDeg: Math.acos(Math.max(-1, Math.min(1, ze))) / D2R, azimuthDeg: az };
}
/** Kepler 方程式(Newton —— 機械精度まで) */
export function keplerE(M, e) {
  let E = e < 0.8 ? M : Math.PI;
  for (let k = 0; k < 60; k++) { const d = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E)); E -= d; if (Math.abs(d) < 1e-15) break; }
  return E;
}
/** 黄道の要素(a・e・I・Ω・ϖ〔度〕)→ 軌道の単位ベクトル P(近日点)・Q・W(法線 —— 公転の向き) */
export function frameOfElements({ I, Om, varpi }) {
  const i = I * D2R, O = Om * D2R, w = (varpi - Om) * D2R;
  const rot = (xp, yp) => { const cO = Math.cos(O), sO = Math.sin(O), cI = Math.cos(i), sI = Math.sin(i), cw = Math.cos(w), sw = Math.sin(w);
    const x1 = cw * xp - sw * yp, y1 = sw * xp + cw * yp, y2 = cI * y1, z2 = sI * y1; return [cO * x1 - sO * y2, sO * x1 + cO * y2, z2]; };
  return { P: rot(1, 0), Q: rot(0, 1), W: [Math.sin(O) * Math.sin(i), -Math.cos(O) * Math.sin(i), Math.cos(i)] };
}
/** 状態(相対の位置・速度・μ)→ 軌道(a・e・P・Q・W・平均近点角 M) */
export function orbitOfState(x, v, mu) {
  if (!isVec(x) || !isVec(v) || !(mu > 0)) throw new RangeError('orbitOfState: x・v(3)・μ > 0');
  const r = nrm(x), h = crs(x, v), hn = nrm(h), W = scl(h, 1 / hn), a = 1 / (2 / r - dot(v, v) / mu);
  const ev = sub(scl(crs(v, h), 1 / mu), scl(x, 1 / r)), e = nrm(ev);
  if (!(a > 0) || !(e < 1)) throw new RangeError('orbitOfState: 束縛の楕円だけ');
  const P = e > 0 ? scl(ev, 1 / e) : unit(x), Q = crs(W, P);
  const cf = dot(x, P) / r, sf = dot(x, Q) / r, f = Math.atan2(sf, cf), E = 2 * Math.atan2(Math.sqrt(1 - e) * Math.sin(f / 2), Math.sqrt(1 + e) * Math.cos(f / 2));
  return { a, e, P, Q, W, M: wrapPi(E - e * Math.sin(E)), mu, n: Math.sqrt(mu / (a * a * a)) };
}
/** 軌道の平均近点角 M の状態(位置・速度・r・真近点角 f・E) */
export function stateAt(orb, M) {
  const { a, e, P, Q, mu } = orb, n = Math.sqrt(mu / (a * a * a)), E = keplerE(wrapPi(M), e), cE = Math.cos(E), sE = Math.sin(E), sq = Math.sqrt(1 - e * e), den = 1 - e * cE;
  const x = add(scl(P, a * (cE - e)), scl(Q, a * sq * sE)), v = add(scl(P, -a * n * sE / den), scl(Q, a * n * sq * cE / den));
  return { x, v, r: a * den, E, f: Math.atan2(sq * sE, cE - e), M };
}
/** 基準面(法線 pole)に対する傾き i・昇交点の向き N̂・交点の経度(基準の向き xRef から)・近点引数 ω */
export function anglesOn(orb, pole, xRef = null) {
  const k = unit(pole), ci = Math.max(-1, Math.min(1, dot(orb.W, k))), i = Math.acos(ci), Nv = crs(k, orb.W), Nn = nrm(Nv);
  if (!(Nn > 1e-14)) return { i, sinI: Nn, N: null, node: null, omega: null, degenerate: true };
  const N = scl(Nv, 1 / Nn), xr = xRef ? unit(sub(xRef, scl(k, dot(xRef, k)))) : null, yr = xr ? crs(k, xr) : null;
  const node = xr ? Math.atan2(dot(N, yr), dot(N, xr)) : null, omega = Math.atan2(dot(orb.P, crs(orb.W, N)), dot(orb.P, N));
  return { i, sinI: Nn, N, node, omega, degenerate: false };
}
/** 基準面の交点の真近点角(公転面と基準面の交わり —— 昇交点 u = 0・降交点 u = π の f) */
export function crossingAnomalies(orb, pole) {
  const g = anglesOn(orb, pole);
  if (g.degenerate) throw new RangeError('crossingAnomalies: 公転面と基準面が平行');
  return { asc: wrapPi(-g.omega), desc: wrapPi(Math.PI - g.omega), i: g.i };
}
/** 1PN の近点の率(一次・二体の式 6πμ/[c²a(1−e²)] —— 1 公転あたり)と ″/世紀 */
export const q1PNPerOrbit = (mu, a, e, c = DECL.c) => 6 * Math.PI * mu / (c * c * a * (1 - e * e));

/* ───────── 一次の永年の率(Gauss の式を軌道で平均)───────── */
/**
 * accel(st) → 加速度 [3](st = stateAt の戻り値)。opt: poles = { 名前: 法線 }・nodes(E の一様な点)・windows = [[E0, E1], …](帯の型 —— この区間だけ GL で積分・一様な格子は使わない)・gl。
 * 戻り値: dadtOverA・dedt・apsIn(軌道面の中の近点の回り)・per[名前] = { di, dnode, domega, dvarpi, i, degenerate }(rad/s)・perOrbit(各率 × 周期)。
 */
export function secularRates(orb, accel, { poles = { ecl: [0, 0, 1] }, nodes = DECL.nodes, windows = null, gl = DECL.bandGL } = {}) {
  if (typeof accel !== 'function') throw new RangeError('secularRates: accel は関数');
  const { a, e, mu } = orb, n = Math.sqrt(mu / (a * a * a)), p = a * (1 - e * e), h = Math.sqrt(mu * p), Pd = 2 * Math.PI / n;
  const geo = Object.fromEntries(Object.entries(poles).map(([k, v]) => [k, anglesOn(orb, v)]));
  const acc = { da: 0, de: 0, aps: 0, W: Object.fromEntries(Object.keys(poles).map((k) => [k, { di: 0, dn: 0 }])) };
  const addAt = (E, wgt) => {   // wgt = dE の重み(× r/a で時間の平均)
    const M = E - e * Math.sin(E), st = stateAt(orb, M), F = accel(st);
    if (!isVec(F)) throw new RangeError('secularRates: accel は有限の 3 成分');
    const rh = scl(st.x, 1 / st.r), sh = crs(orb.W, rh), R = dot(F, rh), S = dot(F, sh), Wc = dot(F, orb.W), r = st.r, f = st.f, cf = Math.cos(f), sf = Math.sin(f);
    const tw = wgt * r / a / (2 * Math.PI);
    acc.da += tw * 2 * a * a * (e * sf * R + p / r * S) / h;
    acc.de += tw * (p * sf * R + ((p + r) * cf + r * e) * S) / h;
    acc.aps += tw * (e > 0 ? (-p * cf * R + (p + r) * sf * S) / (e * h) : 0);
    for (const k of Object.keys(poles)) {
      const g = geo[k]; if (g.degenerate) continue;
      const cu = dot(rh, g.N), su = dot(rh, crs(orb.W, g.N));
      acc.W[k].di += tw * r * cu * Wc / h; acc.W[k].dn += tw * r * su * Wc / (h * g.sinI);
    }
  };
  if (windows) {
    const { x: gx, w: gw } = glNodes(gl);
    for (const [E0, E1] of windows) { const hh = (E1 - E0) / 2, mm = (E0 + E1) / 2; for (let k = 0; k < gl; k++) addAt(mm + hh * gx[k], gw[k] * hh); }
  } else {
    const dE = 2 * Math.PI / nodes;
    for (let k = 0; k < nodes; k++) addAt((k + 0.5) * dE - Math.PI, dE);
  }
  const per = {};
  for (const k of Object.keys(poles)) {
    const g = geo[k];
    if (g.degenerate) { per[k] = { di: null, dnode: null, domega: null, dvarpi: null, i: g.i, degenerate: true }; continue; }
    const di = acc.W[k].di, dn = acc.W[k].dn, dom = acc.aps - Math.cos(g.i) * dn;
    per[k] = { di, dnode: dn, domega: dom, dvarpi: dom + dn, i: g.i, degenerate: false };
  }
  const flags = { breaks: Math.max(Math.abs(acc.da / a), Math.abs(acc.aps), Math.abs(acc.de), ...Object.values(per).filter((q) => !q.degenerate).map((q) => Math.max(Math.abs(q.di), Math.abs(q.dnode)))) * Pd > DECL.breakPerOrbit };
  return { dadtOverA: acc.da / a, dedt: acc.de, apsIn: acc.aps, per, period: Pd, flags };
}
/** 速度の型(位置の速さに d を足す)→ 加速度の型 F = Dd/Dt(無摂動の軌道に沿う平均近点角の 4 点の中心差分) */
export function velocityToAccel(orb, dField, delta = DECL.fdDelta) {
  const n = Math.sqrt(orb.mu / (orb.a * orb.a * orb.a)), dt = delta / n;
  const dAt = (M) => { const st = stateAt(orb, M), d = dField(st.x, st.v); if (!isVec(d)) throw new RangeError('velocityToAccel: d は有限の 3 成分'); return d; };
  return (st) => { const m2 = dAt(st.M + 2 * delta), m1 = dAt(st.M + delta), n1 = dAt(st.M - delta), n2 = dAt(st.M - 2 * delta);
    return [0, 1, 2].map((j) => (-m2[j] + 8 * m1[j] - 8 * n1[j] + n2[j]) / (12 * dt)); };
}
/** 帯の区間(基準面 pole からの距離 |x·ŝ| ≤ Rb となる E の区間 —— 昇交点と降交点の近く。端は二分法) */
export function bandWindows(orb, pole, Rb) {
  const s = unit(pole), cr = crossingAnomalies(orb, s), out = [];
  const zOfE = (E) => { const M = E - orb.e * Math.sin(E); return dot(stateAt(orb, M).x, s); };
  for (const f0 of [cr.asc, cr.desc]) {
    const E0 = 2 * Math.atan2(Math.sqrt(1 - orb.e) * Math.sin(f0 / 2), Math.sqrt(1 + orb.e) * Math.cos(f0 / 2));
    const z0 = zOfE(E0), dz = (zOfE(E0 + 1e-6) - zOfE(E0 - 1e-6)) / 2e-6, guess = Rb / Math.abs(dz);
    const edge = (sgn) => { const target = sgn * Rb * Math.sign(dz); let lo = E0, hi = E0 + sgn * 4 * guess; for (let it = 0; it < 200; it++) { const mid = (lo + hi) / 2; if (Math.abs(zOfE(mid) - z0) < Math.abs(target)) lo = mid; else hi = mid; } return (lo + hi) / 2; };
    const a1 = edge(-1), b1 = edge(1);
    out.push([Math.min(a1, b1), Math.max(a1, b1)]);
  }
  return out;
}

/* ───────── 効果の型 ───────── */
/** (2) G_loc の力の型の摂動(試験粒子の受け手 —— μ_eff = μ × share の係数): F = μ(1 − e^{−2nε/r}) r̂/r²・ε = μ_eff/c²(実装の型の gLocKick の一次) */
export function gLocAccel({ mu, n, muEff = mu, c = DECL.c }) {
  if (!isFin(n) || !(mu > 0) || !(muEff > 0)) throw new RangeError('gLocAccel: n 有限・μ > 0');
  const eps = muEff / (c * c);
  return (st) => { const r = st.r, k = mu * (-Math.expm1(-2 * n * eps / r)) / (r * r * r); return scl(st.x, k); };
}
/** K1 の並進(実装の型の一次 —— 相対の速度に沿う: d = −(b/r) v・b = C₁Y_k(M + m) = 10G(M+m)/c²) */
export const k1Velocity = (b) => (x, v) => scl(v, -b / nrm(x));
/** (3) 統合した並進引きずりの β の係数(w = m_☉/r^α・W_self = coef m/R^α)。自己の型: α = 1・2 は ballHarmonic・他は point */
export function selfOf({ alpha, m, R }) {
  const type = (alpha === 1 || alpha === 2) ? 'ballHarmonic' : 'point';
  const w = type === 'point' ? m / Math.pow(R, alpha) : selfWeight({ type, m, R, p: alpha }).w;
  if (!isFin(w) || !(w > 0)) throw new RangeError('selfOf: 値域の外');
  return { type, w, R };
}
/** 点の重み m/r^α(α = 1・2 は第330便b の pointWeight を呼ぶ —— 他の α は同じ式) */
export const weightOf = (m, r, alpha) => ((alpha === 1 || alpha === 2) ? pointWeight(m, r, alpha) : m / Math.pow(r, alpha));
/**
 * (3) d = β(r)[s × x − v](源は原点に静止 —— 太陽の反動は持たない宣言)。part: 'trans'(−βv)・'rot'(β s × x)・'both'。spinVec = s ŝ [rad/s]。
 */
export function transDragVelocity({ Msrc, selfW, alpha, spinVec, part = 'both' }) {
  if (!(Msrc > 0) || !(selfW > 0) || !DECL.alphaGrid.includes(alpha) || !isVec(spinVec) || !['trans', 'rot', 'both'].includes(part)) throw new RangeError('transDragVelocity: 宣言');
  return (x, v) => { const r = nrm(x), w = weightOf(Msrc, r, alpha), beta = w / (selfW + w);
    const t = part === 'rot' ? [0, 0, 0] : scl(v, -beta), q = part === 'trans' ? [0, 0, 0] : scl(crs(spinVec, x), beta); return add(t, q); };
}
/** (4b) 対向 2 点の三次元の差分の速さ U(ρ, z)(重み r^{−α})—— 正は自転の向き φ̂ */
export function pairSpeed({ rho, z, Rd, sd, alpha }) {
  if (![rho, z, Rd, sd, alpha].every(isFin) || rho < 0 || !(Rd > 0) || !(alpha > 0)) throw new RangeError('pairSpeed: ρ ≥ 0・R_d > 0・α > 0 の有限');
  const rm2 = (rho - Rd) * (rho - Rd) + z * z;
  if (!(rm2 > 0)) throw new RangeError('pairSpeed: 源の点の上(r₋ = 0)');
  return sd * Rd * Math.tanh(alpha / 4 * Math.log1p(4 * rho * Rd / rm2));
}
/** (4b) の押し a = γ U φ̂(γ = C₁R_d K1(r; R_d) |sGamma| —— 第332便a の NF の型と同じ強さ k1N)。源は原点・軸 axis */
export function pairAccel({ Rd, axis, sd, sGamma, alpha }) {
  const s = unit(axis);
  return (st) => { const x = st.x, z = dot(x, s), rv = sub(x, scl(s, z)), rho = nrm(rv); if (!(rho > 0)) return [0, 0, 0];
    const r = nrm(x), gam = C1 * Rd * k1Core(r, Rd).K * Math.abs(sGamma), U = pairSpeed({ rho, z, Rd, sd, alpha });
    return scl(crs(s, rv), gam * U / rho); };
}
/** (4a) 切り口の式(第332便a の主 —— bandForce を呼ぶ)の押し。源は原点・質量 M・軸 axis・自転 Omega */
export function cutAccel({ M, axis, Omega, decl = DECL332A.main }) {
  const body = { x: [0, 0, 0], v: [0, 0, 0], m: M, axis, Omega };
  return (st) => bandForce(body, { x: st.x, v: st.v }, decl).a;
}
/** 引きずり自転 s_d(J を保つ変換 × λ_J): s_d = λ_J (f_obs/f_d)(R_obs/R_d)² s */
export function dragSpin({ s, Robs, Rd, fObs, fDrag = DECL.fDrag, lambdaJ }) {
  if (![s, Robs, Rd, fObs, fDrag, lambdaJ].every(isFin) || !(Robs > 0) || !(Rd > 0) || !(fObs > 0) || !(fDrag > 0) || lambdaJ < 0) throw new RangeError('dragSpin: 宣言');
  return lambdaJ * (fObs / fDrag) * (Robs / Rd) * (Robs / Rd) * s;
}

/* ───────── 連星の対称 G_loc(AN600 —— 一次と純粋な積分器)───────── */
/** 連星の型(一次の分担 ÷ q_1PN): G_loc(型・n)+ K1(+5/3 —— η に依らない) */
export const BINARY_TYPES = Object.freeze([
  Object.freeze({ key: 'now', label: '今(受け手 n = 2 + K1)', pair: 'receiver', n: 2, k1: true, status: '実装(在位)' }),
  Object.freeze({ key: 'sym2', label: '対称 n = 2 + K1', pair: 'symmetric', n: 2, k1: true, status: '宣言(実装の宣言で書ける —— pair "symmetric")' }),
  Object.freeze({ key: 'sym4', label: '対称 n = 4 + K1', pair: 'symmetric', n: 4, k1: true, status: '宣言(一次で η に依らず 1PN になる対称の n —— 比べる列)' }),
  Object.freeze({ key: 'recvM3', label: '受け手 n = −3・K1 を外す', pair: 'receiver', n: -3, k1: false, status: '宣言(第331便c の候補 B)' }),
  Object.freeze({ key: 'symM6', label: '対称 n = −6・K1 を外す', pair: 'symmetric', n: -6, k1: false, status: '宣言(第331便c の候補 C)' }),
]);
export function binaryShare(type, eta) { return gLocShare(type.n, type.pair, eta) + (type.k1 ? 5 / 3 : 0); }
/** 純粋な積分器(第331便c の apsidalNumeric —— 相対の軌道に還元した力: G_loc は ε_eff = ε μ_eff/μ の gForce・K1 は b = 10ε の k1)で分担 ÷ q_1PN */
export function binaryNumeric(type, eta, { e = 0.2, eps = 1e-6 } = {}) {
  const fac = type.pair === 'receiver' ? 1 - 2 * eta : 0.5, sl = 1 - e * e, q = 6 * Math.PI * eps / sl;
  const g = type.n === 0 ? { adv: 0 } : apsidalNumeric({ e, mode: 'gForce', eps: eps * fac, n: type.n });
  const k = type.k1 ? apsidalNumeric({ e, mode: 'k1', eps: 10 * eps }) : { adv: 0 };
  return { g: g.adv / q, k: k.adv / q, total: (g.adv + k.adv) / q };
}

/* ───────── 純粋な三次元の積分器(数値の照合 —— μ = a = 1)───────── */
/**
 * x′ = v + d(x, v)・v′ = −x/r³ + F(x, v)。公転ごとに同じ位相で接触の要素(x, x′)を標本し、無摂動の同じ刻みの走行の要素を引いて最小二乗の傾き(rad/公転)を返す。
 * orb0 = 単位の軌道(a = 1・μ = 1・e・P・Q)・pole = 基準面。戻り値 { aps, di, dnode, domega, dlnA }(1 公転あたり)。
 */
export function integrate3d({ orb0, accelX = null, velX = null, pole, stepsPerOrbit = DECL.integ.stepsPerOrbit, nOrb = DECL.integ.nOrb }) {
  const run = (on) => {
    const st0 = stateAt(orb0, 0), f = (s) => { const x = [s[0], s[1], s[2]], v = [s[3], s[4], s[5]], r = nrm(x), r3 = r * r * r;
      let u = v, ac = scl(x, -1 / r3); if (on && velX) u = add(v, velX(x, v)); if (on && accelX) ac = add(ac, accelX(x, v)); return [...u, ...ac]; };
    const rk = (s, h) => { const k1 = f(s), s2 = s.map((q, i) => q + 0.5 * h * k1[i]), k2 = f(s2), s3 = s.map((q, i) => q + 0.5 * h * k2[i]), k3 = f(s3), s4 = s.map((q, i) => q + h * k3[i]), k4 = f(s4);
      return s.map((q, i) => q + h * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]) / 6); };
    let s = [...st0.x, ...st0.v]; if (on && velX) { const d = velX(st0.x, st0.v); s = [...st0.x, ...sub(st0.v, d)]; }   // 接触の速度 w = v + d を無摂動と同じに置く
    const h = 2 * Math.PI / stepsPerOrbit, samp = [];
    const sample = (s1) => { const x = [s1[0], s1[1], s1[2]], v = [s1[3], s1[4], s1[5]], w = on && velX ? add(v, velX(x, v)) : v, o = orbitOfState(x, w, 1), g = anglesOn(o, pole, [1, 0, 0]);
      const apsAng = Math.atan2(dot(o.P, orb0.Q), dot(o.P, orb0.P)); return { aps: apsAng, i: g.i, node: g.node, omega: g.omega, lnA: Math.log(o.a) }; };
    samp.push(sample(s));
    for (let k = 1; k <= nOrb * stepsPerOrbit; k++) { s = rk(s, h); if (k % stepsPerOrbit === 0) samp.push(sample(s)); }
    return samp;
  };
  const on = run(true), off = run(false), keys = ['aps', 'i', 'node', 'omega', 'lnA'], out = {};
  for (const k of keys) {
    const y = on.map((q, j) => { let d = q[k] - off[j][k]; return k === 'lnA' || k === 'i' ? d : wrapPi(d); });
    for (let j = 1; j < y.length; j++) { let d = y[j] - y[j - 1]; if (k !== 'lnA' && k !== 'i') { while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; } y[j] = y[j - 1] + d; }
    const N = y.length, mx = (N - 1) / 2, my = y.reduce((s1, q) => s1 + q, 0) / N; let sxy = 0, sxx = 0; for (let j = 0; j < N; j++) { sxy += (j - mx) * (y[j] - my); sxx += (j - mx) * (j - mx); }
    out[k] = sxy / sxx;
  }
  return { aps: out.aps, di: out.i, dnode: out.node, domega: out.omega, dlnA: out.lnA };
}

/* ───────── 純関数の場面と門 ───────── */
export function pureScenes() {
  const S = {};
  // 単位の軌道(μ = a = 1・e = 0.2・傾き 0.4 rad の面)と基準面
  const el = { I: 0.4 / D2R, Om: 30, varpi: 100 }, fr = frameOfElements(el), orb = { a: 1, e: 0.2, mu: 1, P: fr.P, Q: fr.Q, W: fr.W }, p = 1 - 0.04, Pd = 2 * Math.PI;
  // ① G_loc の力の型: 1 公転 −2nπε/p・交点と傾きは 0
  { const eps = 1e-10, n = 2, R = secularRates(orb, gLocAccel({ mu: 1, n, muEff: 1, c: 1 / Math.sqrt(eps) }), { poles: { ecl: [0, 0, 1] } });
    S.gLoc = { perOrbit: R.apsIn * Pd, expect: -2 * n * Math.PI * eps / p, di: R.per.ecl.di, dnode: R.per.ecl.dnode, dvarpi: R.per.ecl.dvarpi * Pd }; }
  // ② K1 の速度の型: 1 公転 πb/p・交点と傾きは 0
  { const b = 1e-7, R = secularRates(orb, velocityToAccel(orb, k1Velocity(b)), { poles: { ecl: [0, 0, 1] } });
    S.k1 = { perOrbit: R.apsIn * Pd, expect: Math.PI * b / p, di: R.per.ecl.di, dnode: R.per.ecl.dnode }; }
  // ③ J₂ の型(独立の照合 —— 交点と近点引数の閉じた式): dΩ/dt = −(3/2)nJ₂(R/p)² cos i・dω/dt = (3/4)nJ₂(R/p)²(5cos²i − 1)
  { const J2R2 = 1e-6, k = [0, 0, 1], acc = (st) => { const x = st.x, r = st.r, z = dot(x, k), r2 = r * r, c0 = -1.5 * J2R2 / (r2 * r2 * r);
      return add(scl(x, c0 * (1 - 5 * z * z / r2)), scl(k, c0 * 2 * z)); };
    const R = secularRates(orb, acc, { poles: { ecl: k } }), ci = Math.cos(0.4);
    S.j2 = { dnode: R.per.ecl.dnode, expectNode: -1.5 * J2R2 / (p * p) * ci, domega: R.per.ecl.domega, expectOmega: 0.75 * J2R2 / (p * p) * (5 * ci * ci - 1), di: R.per.ecl.di }; }
  // ④ 対向 2 点の差分: z の鏡映・s_d の符号・遠方の形 α s_d R_d² ρ/r²・帯の外も 0 でない
  { const Rd = 1, a = 1e4;
    S.pair = { mirror: pairSpeed({ rho: a, z: 300, Rd, sd: 1, alpha: 2 }) - pairSpeed({ rho: a, z: -300, Rd, sd: 1, alpha: 2 }), sign: pairSpeed({ rho: a, z: 0, Rd, sd: -1, alpha: 2 }) + pairSpeed({ rho: a, z: 0, Rd, sd: 1, alpha: 2 }),
      far: DECL.pairAlpha.map((al) => { const rho = a, z = 0.5 * a, U = pairSpeed({ rho, z, Rd, sd: 1, alpha: al }); return { alpha: al, ratio: U / (al * Rd * Rd * rho / (rho * rho + z * z)) }; }),
      outside: pairSpeed({ rho: a, z: 10 * Rd, Rd, sd: 1, alpha: 1 }) > 0 };
  }
  // ⑤ 切り口の式の帯の区間の積分と第332便a の円軌道の平均(orbitRates)の照合(円軌道・帯の型)
  { const M = 1.98847e30, a = 5.79e10, iEq = 3.38 * D2R, axis = [0, 0, 1], mu = DECL.G * M, nC = Math.sqrt(mu / (a * a * a)), Om = 2.865e-6;
    const fr2 = frameOfElements({ I: iEq / D2R, Om: 0, varpi: 0 }), orbC = { a, e: 1e-9, mu, P: fr2.P, Q: fr2.Q, W: fr2.W };
    const Rd = kappaMRadius(M), win = bandWindows(orbC, axis, Rd), R = secularRates(orbC, cutAccel({ M, axis, Omega: Om }), { poles: { sun: axis }, windows: win });
    const ref = orbitRates({ src: { m: M, Omega: Om }, orbit: { a, i: iEq, n: nC, v: nC * a }, decl: DECL332A.main });
    S.cut = { di: R.per.sun.di, ref: ref.dIdt, dlnA: R.dadtOverA, refA: ref.dAdtOverA, windows: win.length }; }
  // ⑥ 連星の一次: 対称 n = 4 + K1 は η に依らず 1・等質量で受け手 n = 2 と対称 n = 2 は同じ 4/3
  S.binary = { sym4: DECL.etaGrid.map((et) => binaryShare(BINARY_TYPES[2], et)), eqMass: [binaryShare(BINARY_TYPES[0], 0.25), binaryShare(BINARY_TYPES[1], 0.25)] };
  // ⑦ 入力の拒否
  const rejects = (f) => { try { f(); return false; } catch (e) { return e instanceof RangeError; } };
  S.rejects = [rejects(() => pairSpeed({ rho: 1, z: 0, Rd: 1, sd: 1, alpha: 2 })), rejects(() => pairSpeed({ rho: -1, z: 0, Rd: 1, sd: 1, alpha: 2 })), rejects(() => transDragVelocity({ Msrc: 1, selfW: 1, alpha: 4, spinVec: [0, 0, 1] })),
    rejects(() => dragSpin({ s: 1, Robs: 1, Rd: 0, fObs: 0.07, lambdaJ: 1 })), rejects(() => orbitOfState([1, 0, 0], [0, 2, 0], 1)), rejects(() => gLocAccel({ mu: 1, n: NaN }))];
  // ⑧ H₁ = C₁(α = 1・ballHarmonic・kappaM の β は K1 の C₁R_d/r)
  S.h1 = { H1: harmonicSelf(1), C1 };
  return S;
}
export function pureGates(S) {
  const rel = (a, b) => Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b), 1e-300);
  return {
    gLoc: rel(S.gLoc.perOrbit, S.gLoc.expect) <= 1e-8 && Math.abs(S.gLoc.di) <= 1e-24 && Math.abs(S.gLoc.dnode) <= 1e-24 && rel(S.gLoc.dvarpi, S.gLoc.expect) <= 1e-8,
    k1: rel(S.k1.perOrbit, S.k1.expect) <= 1e-9 && Math.abs(S.k1.di) <= 1e-20 && Math.abs(S.k1.dnode) <= 1e-20,
    j2: rel(S.j2.dnode, S.j2.expectNode) <= 1e-9 && rel(S.j2.domega, S.j2.expectOmega) <= 1e-9 && Math.abs(S.j2.di) <= 1e-18,
    pair: S.pair.mirror === 0 && S.pair.sign === 0 && S.pair.far.every((q) => Math.abs(q.ratio - 1) <= 1e-3) && S.pair.outside === true,
    cut: rel(S.cut.di, S.cut.ref) <= 1e-6 && S.cut.windows === 2,
    binary: S.binary.sym4.every((x) => Math.abs(x - 1) <= 1e-15) && Math.abs(S.binary.eqMass[0] - 4 / 3) <= 1e-15 && Math.abs(S.binary.eqMass[1] - 4 / 3) <= 1e-15,
    rejects: S.rejects.every(Boolean),
    h1: Math.abs(S.h1.H1 - S.h1.C1) <= 1e-6,
  };
}
export { C1, gLocShare };
