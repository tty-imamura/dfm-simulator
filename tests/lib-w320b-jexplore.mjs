// 第320便b(原仮定者の裁定(第122報)・決断事項 AN471「案3(J)を確かめる。案2bは次点。様々な可能性を探索する」・統括の検証項目 R263):
// **源の角運動量 J の確かめ・案2b の混成の導き直し・候補を並べて数える探索の純関数**(html を読まない —— エンジンの値は器 tests/exp-w320b-jexplore.mjs が
// 読み口で取って引数で渡す。器と QA が使う)。
//
// ■ 何をするか(受け手の R_d = Y_k m・並進・規則・在位の本・エンジンの式は変えない —— 源の回転と軸のモーメントだけを写しの外で比べる)
//   J1 有限の一様な剛体回転球の弱い K1 の移送の分子 u = (10G_0/c_0²)∫dm v/|r − x′|(**正規化の分母 W と solve の前の弱い場** —— 今の bevel の軸引きずりの
//      導出でも置換でもない)の内外の解析の式と半渦度 ½∇×u、独立な 2 つの体積の求積(源の中心の球座標・場の点からの光線)と有限差分の curl(刻み h と h/2)。
//   J2 分割の加法性: 同じ質量を立方体のセルに分けた写しの遠方の和・公転の J を落とさない粗視化(J_total = Σ[J_int,a + (x_a − x_cm) × m_a(v_a − v_cm)])・
//      セルの固有の自転だけを足すと公転の分を失う例・差動回転の流れの体積積分(宣言の型 —— 解析の値つき)。
//   J3 太陽の J の体積積分(宣言の密度の模型〔ポリトロープ n = 3〕の重みと文献の値の型の回転の分布 —— 放射層の剛体回転・対流層の緯度の差動回転・中心の核の倍率)。
//   B  案2b(源 K2 + 受け手 K1 の混成): 源の速さを K2 の重みで平均した速さ × K1 の振幅 —— W と ∇W は K1(R_d)のまま・回転のモーメント
//      M_mix = K1(r; R_d)·M2/K2(r; R_src) の遠方の級数(係数 3/35・6/35)・有効な J(0.8 m R_obs² Ω)・分割の規則(公転の分 ×1 と固有の分 ×2)。
//   C  候補(探索の名 3b〜3j)の自由な係数と新しい仮定の数・6 天体の表(水星〜土星)の比と広がり(dex)・候補の数として挙がった値の真偽。
//
// ■ 言わないこと: 候補のどれかを採った規則と書かない・一つの候補で公転面・金星・木星がそろうと書かない(そろわない)・自由な係数を選んだ値を導いた値と書かない・
//   半渦度を軸引きずり ω と同じと書かない・金星の自転・木星の熱・公転面を引きずりで説明したと書かない・τ_hold を物理の値と書かない(h₀ の規約)・
//   数の桁が近いことを証拠と呼ばない・格子の差と刻みの差は感度の診断(収束の判定に使わない)。
//   文献の値は「文献の値(本便は一次資料に当たっていない)」と書き、正本の inputs に出典の名を残す。
import { G0, C0, C1, YK, AU, MSUN, YEAR, GYR, LU, TU, MU, VU, maintCell, splitOmega, powerOf, BODY16, MOI, MOI_UNIFORM, moiOf, k2Of, m2Of, mixMoment, k1RecvSrc,
  dot, cross, nrm, add3, scl3, angDeg, relDiff, vecRel, gl01, DECL as DECL319, CAP_SRC_M } from './lib-w319b-srcradius.mjs';
import { LIT as LIT318 } from './lib-w318d-dragest.mjs';
import { fmtFloor, ex, fx } from './lib-w311d-planet3.mjs';
export { G0, C0, C1, YK, AU, MSUN, YEAR, GYR, LU, TU, MU, VU, BODY16, MOI, MOI_UNIFORM, moiOf, k2Of, m2Of, mixMoment, k1RecvSrc, dot, cross, nrm, add3, scl3, angDeg, relDiff, vecRel, CAP_SRC_M, maintCell, splitOmega, powerOf };
export const LIB_VERSION = 'w320b-jexplore-lib-1';

/* ───────── 宣言(走行の前に置く —— 結果を見て変えない)───────── */
/** 単位の球(m = R = Ω = 1 —— J = 2/5 ẑ)の場の点(赤道面 x 軸・軸の上・45°)と、求積の格子 3 段・有限差分の刻み */
export const JPOINTS = Object.freeze([
  Object.freeze({ key: 'c0', ja: '中心', r: Object.freeze([0, 0, 0]) }),
  Object.freeze({ key: 'e30', ja: '赤道面 0.3 R', r: Object.freeze([0.3, 0, 0]) }),
  Object.freeze({ key: 'e60', ja: '赤道面 0.6 R', r: Object.freeze([0.6, 0, 0]) }),
  Object.freeze({ key: 'e90', ja: '赤道面 0.9 R', r: Object.freeze([0.9, 0, 0]) }),
  Object.freeze({ key: 'e913', ja: '赤道面 √(5/6) R', r: Object.freeze([Math.sqrt(5 / 6), 0, 0]) }),
  Object.freeze({ key: 'e97', ja: '赤道面 0.97 R', r: Object.freeze([0.97, 0, 0]) }),
  Object.freeze({ key: 'a50', ja: '軸の上 0.5 R', r: Object.freeze([0, 0, 0.5]) }),
  Object.freeze({ key: 'd70', ja: '45° の 0.7 R', r: Object.freeze([0.7 * Math.SQRT1_2, 0, 0.7 * Math.SQRT1_2]) }),
  Object.freeze({ key: 'e103', ja: '赤道面 1.03 R', r: Object.freeze([1.03, 0, 0]) }),
  Object.freeze({ key: 'e150', ja: '赤道面 1.5 R', r: Object.freeze([1.5, 0, 0]) }),
  Object.freeze({ key: 'e300', ja: '赤道面 3 R', r: Object.freeze([3, 0, 0]) }),
  Object.freeze({ key: 'a200', ja: '軸の上 2 R', r: Object.freeze([0, 0, 2]) }),
  Object.freeze({ key: 'd170', ja: '45° の 1.7 R', r: Object.freeze([1.7 * Math.SQRT1_2, 0, 1.7 * Math.SQRT1_2]) }),
  Object.freeze({ key: 'e2000', ja: '赤道面 20 R', r: Object.freeze([20, 0, 0]) })]);
export const QGRIDS = Object.freeze([
  Object.freeze({ nr: 8, nmu: 8, nphi: 16, ns: 2 }),
  Object.freeze({ nr: 16, nmu: 16, nphi: 32, ns: 2 }),
  Object.freeze({ nr: 32, nmu: 32, nphi: 64, ns: 2 })]);
export const FD_H = 2e-3;
/** 分割の写し(立方格子の一辺 n)・受け手の距離 D/R・差動回転の宣言の型 Ω(ϖ) = Ω_0(1 − α ϖ²/R²)・中心の核の倍率 */
export const DECL = Object.freeze({
  partN: Object.freeze([2, 4, 8, 16, 32]), partD: 100, diffAlpha: 0.5, konigN: 16,
  // 太陽の回転の分布の型(文献の値の型 —— 本便は一次資料に当たっていない): 放射層の剛体回転 430 nHz(r < 0.713 R)・対流層の緯度の差動回転
  //   Ω/2π = A + B sin²φ + C sin⁴φ(表面の型の係数 14.713・−2.396・−1.787 °/日 —— 深さに依らない宣言)・中心の核 r < 0.2 R の倍率 k(日震学で決まりにくい —— 宣言の掃引)
  sun: Object.freeze({ rTach: 0.713, radNHz: 430, czDegDay: Object.freeze([14.713, -2.396, -1.787]), rCore: 0.2, coreK: Object.freeze([1, 2, 4, 10]), polyN: 3, xiStep: 2e-4 }),
  // 時間平均の J(3h): 自転の減速の型 Ω ∝ t^(−1/2)(t > t_sat —— それより前は Ω(t_sat))の宣言の掃引 t_sat [Gyr]・窓(公転面 = 太陽系の年齢・金星 = 直近の 1 Gyr)
  spinDown: Object.freeze({ tSatGyr: Object.freeze([0.05, 0.1, 0.3]), venusWindowGyr: 1 }),
  // アルヴェーン半径の掃引(3f —— R_A/R☉)と太陽風の質量の流れ・速さ(文献の値の型)
  alfven: Object.freeze({ rARsun: Object.freeze([3, 12, 20]), mdotMsunYr: 2e-14, vWind: 4e5 }),
  // 潮汐で減る J(3i —— 地球の自転の 1 日の長さの増え方の今の率〔文献の値の型〕を直近の 1 Gyr へ一次で外挿 —— 宣言)
  earthLod: Object.freeze({ msPerCentury: 1.8, windowGyr: 1 }),
  // 受け手の半径の冪(3d)の基準半径 R_⊕ [m]・掃引の範囲
  recvPow: Object.freeze({ Rref: 6.371e6, qScan: Object.freeze([-3, 3]), qStep: 1e-4 }),
  // 金星の熱流の宣言(**金星で使う熱流の量・領域・不確かさ** —— 全球の平均の内部の熱流〔地表の温度は大気の釣り合いで内部の熱流ではない —— 置き換えない〕・
  //   宣言の区間 0.02〜0.1 W/m²〔中央は幾何平均〕・面積 4πR_obs²。地球の平均の内部の熱流の桁を上端の目安にした宣言 —— 文献の値ではない)
  venusHeat: Object.freeze({ fluxLow: 0.02, fluxHigh: 0.1, region: '全球の平均の内部の熱流(地表の温度に置き換えない)' }),
  inertiaF: DECL319.inertiaF, planeTiltDeg: DECL319.planeTiltDeg, venusPeriodGyr: DECL319.venusPeriodGyr, ringRadiiM: DECL319.ringRadiiM });
export const LIT320 = Object.freeze({
  sunRot: Object.freeze({ value: 'radiative 430 nHz (r < 0.713 R)・surface 14.713 − 2.396 sin²φ − 1.787 sin⁴φ deg/day', unit: '-', name: '太陽の回転の分布の型(日震学の放射層の剛体回転と表面の差動回転の係数 —— 文献の値の型)' }),
  sunJ: Object.freeze({ value: '1.9e41', unit: 'kg m^2/s', name: '日震学の太陽の角運動量の桁(文献の値の型 —— 比較の目安だけ)' }),
  wind: Object.freeze({ value: 'Mdot 2e-14 Msun/yr・v 400 km/s・R_A 3〜20 R_sun', unit: '-', name: '太陽風の質量の流れ・速さ・アルヴェーン半径の幅(文献の値の型)' }),
  lod: Object.freeze({ value: '1.8', unit: 'ms/century', name: '地球の 1 日の長さの増え方(潮汐の減速の今の率 —— 文献の値の型)' }) });

/* ───────── J1 一様な剛体回転球の弱い K1 の移送の分子(解析)───────── */
/**
 * u/K と半渦度 w/K(K = 5G_0/c_0²)。u = a(d) J × r・w = ½∇×u = (a + ½ a′d) J − (a′/(2d)) r (r·J)。
 *   外側 a = 1/d³ —— u = (J × r)/d³・赤道面の w = −J/(2d³)・軸の上の w = J/d³
 *   内側 a = 5/(2R³) − 3d²/(2R⁵) —— 赤道面の w = (5/(2R³) − 3d²/R⁵) J(r/R = √(5/6) で符号が変わる)・中心 5J/(2R³)(有限)・境界で u と w が連続
 */
export function jFieldAnalytic(r, J, R) {
  const d = nrm(r), inside = d < R, R3 = R * R * R, R5 = R3 * R * R;
  const a = inside ? 2.5 / R3 - 1.5 * d * d / R5 : 1 / (d * d * d), b = inside ? -3 / R5 : -3 / (d * d * d * d * d);
  const Jr = dot(J, r), c = a + 0.5 * b * d * d;
  return { inside, u: scl3(cross(J, r), a), w: [c * J[0] - 0.5 * b * r[0] * Jr, c * J[1] - 0.5 * b * r[1] * Jr, c * J[2] - 0.5 * b * r[2] * Jr] };
}
/** 赤道面の半渦度の J 方向の成分の係数(内側)と符号の変わる r/R(解析 √(5/6)) */
export const eqHalfCurlInside = (x) => 2.5 - 3 * x * x;
export const SIGN_ROOT = Math.sqrt(5 / 6);

const glm11 = (n) => { const g = gl01(n); return { x: Array.from(g.x, (v) => 2 * v - 1), w: Array.from(g.w, (v) => 2 * v) }; };
/** 求積 Q1(源の中心の球座標 —— 動径 Gauss–Legendre × μ Gauss–Legendre × 方位の中点): u/K = 2ρ∫(Ω × x′)/|r − x′| dV(m = 1・半径 R・自転 Ω ẑ) */
export function uQuadSource(r, R, Om, g) {
  const gr = gl01(g.nr), gm = glm11(g.nmu), rho = 3 / (4 * Math.PI * R * R * R), dph = 2 * Math.PI / g.nphi;
  let ux = 0, uy = 0, uz = 0;
  for (let a = 0; a < g.nr; a++) {
    const rp = R * gr.x[a], wr = R * gr.w[a] * rp * rp;
    for (let b = 0; b < g.nmu; b++) {
      const mu = gm.x[b], st = Math.sqrt(Math.max(0, 1 - mu * mu)), wm = wr * gm.w[b] * dph;
      for (let c = 0; c < g.nphi; c++) {
        const ph = (c + 0.5) * dph, x = rp * st * Math.cos(ph), y = rp * st * Math.sin(ph), z = rp * mu;
        const dd = Math.hypot(r[0] - x, r[1] - y, r[2] - z), w = wm / dd;
        ux += w * (-Om * y); uy += w * (Om * x);
      }
    }
  }
  return [2 * rho * ux, 2 * rho * uy, 2 * rho * uz];
}
/** 求積 Q2(場の点からの光線 —— 方向 μ Gauss–Legendre × 方位の中点・光線の長さ s Gauss–Legendre): 内側の点だけ(被積分は s(r + sŝ) —— 特異点が無い) */
export function uQuadRay(r, R, Om, g) {
  const gm = glm11(g.nmu), gs = gl01(g.ns), rho = 3 / (4 * Math.PI * R * R * R), dph = 2 * Math.PI / g.nphi, d2 = dot(r, r);
  if (!(d2 < R * R)) return null;
  let ux = 0, uy = 0;
  for (let b = 0; b < g.nmu; b++) {
    const mu = gm.x[b], st = Math.sqrt(Math.max(0, 1 - mu * mu));
    for (let c = 0; c < g.nphi; c++) {
      const ph = (c + 0.5) * dph, sx = st * Math.cos(ph), sy = st * Math.sin(ph), sz = mu, rs = r[0] * sx + r[1] * sy + r[2] * sz;
      const smax = -rs + Math.sqrt(rs * rs + R * R - d2), wd = gm.w[b] * dph;
      for (let k = 0; k < g.ns; k++) {
        const s = smax * gs.x[k], w = wd * smax * gs.w[k] * s, x = r[0] + s * sx, y = r[1] + s * sy;
        ux += w * (-Om * y); uy += w * (Om * x);
      }
    }
  }
  return [2 * rho * ux, 2 * rho * uy, 0];
}
/**
 * 求積 Q3(外側の点の光線 —— 源の球が見える円錐の内の方向だけ): 円錐の軸 −r̂ からの角 ψ を sinψ = (R/d) sin t で t ∈ [0, π/2] の Gauss–Legendre に替える
 *   (弦の長さ 2R cos t が滑らか —— 縁の平方根の特異点が消える)× 方位の中点 × 弦の上の s の Gauss–Legendre。外側の点だけ
 */
export function uQuadRayExt(r, R, Om, g) {
  const d = nrm(r);
  if (!(d > R)) return null;
  const gt = gl01(g.nmu), gs = gl01(g.ns), rho = 3 / (4 * Math.PI * R * R * R), dph = 2 * Math.PI / g.nphi, e3 = scl3(r, -1 / d);
  const t0 = Math.abs(e3[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0], e1 = (() => { const c = cross(e3, t0); return scl3(c, 1 / nrm(c)); })(), e2 = cross(e3, e1), q = R / d;
  let ux = 0, uy = 0;
  for (let a = 0; a < g.nmu; a++) {
    const t = 0.5 * Math.PI * gt.x[a], wt = 0.5 * Math.PI * gt.w[a], sp = q * Math.sin(t), cp = Math.sqrt(1 - sp * sp), half = R * Math.cos(t), s1 = d * cp - half, s2 = d * cp + half;
    const wa = wt * sp * q * Math.cos(t) / cp * dph;
    for (let c = 0; c < g.nphi; c++) {
      const chi = (c + 0.5) * dph, sx = cp * e3[0] + sp * (Math.cos(chi) * e1[0] + Math.sin(chi) * e2[0]), sy = cp * e3[1] + sp * (Math.cos(chi) * e1[1] + Math.sin(chi) * e2[1]);
      for (let k = 0; k < g.ns; k++) { const s = s1 + (s2 - s1) * gs.x[k], w = wa * (s2 - s1) * gs.w[k] * s, x = r[0] + s * sx, y = r[1] + s * sy; ux += w * (-Om * y); uy += w * (Om * x); }
    }
  }
  return [2 * rho * ux, 2 * rho * uy, 0];
}
/** 光線の求積(内側は Q2・外側は Q3 —— 有限差分の curl に使う: 場の点の位置に滑らかに依る) */
export const uNum = (r, R, Om, g) => (dot(r, r) < R * R ? uQuadRay(r, R, Om, g) : uQuadRayExt(r, R, Om, g));
/** 有限差分の半渦度 ½∇×u(中心差分 —— 刻み h) */
export function halfCurlFD(r, R, Om, g, h) {
  const D = [];
  for (let k = 0; k < 3; k++) { const p = r.slice(), m = r.slice(); p[k] += h; m[k] -= h; const up = uNum(p, R, Om, g), um = uNum(m, R, Om, g); D.push([0, 1, 2].map((a) => (up[a] - um[a]) / (2 * h))); }
  // D[k][a] = ∂u_a/∂x_k
  return [0.5 * (D[1][2] - D[2][1]), 0.5 * (D[2][0] - D[0][2]), 0.5 * (D[0][1] - D[1][0])];
}
/** 赤道面の半渦度の z 成分の符号が変わる r/R を数値の curl の二分法で(区間 [lo, hi]・刻み h) */
export function signRootFD(R, Om, g, h, lo = 0.85, hi = 0.96, iter = 30) {
  const f = (x) => halfCurlFD([x * R, 0, 0], R, Om, g, h * R)[2];
  let a = lo, b = hi, fa = f(a), fb = f(b);
  if (!(fa > 0 && fb < 0)) return { ok: false, fa, fb };
  for (let k = 0; k < iter; k++) { const c = 0.5 * (a + b), fc = f(c); if (fc > 0) { a = c; fa = fc; } else { b = c; fb = fc; } }
  return { ok: true, x: 0.5 * (a + b), exact: SIGN_ROOT, rel: Math.abs(0.5 * (a + b) - SIGN_ROOT) / SIGN_ROOT, iter };
}
/** 場の点の行(解析・Q1 の格子 3 段・Q2 の格子 3 段・有限差分 h と h/2) */
export function jPointRow(P, grids, h) {
  const R = 1, Om = 1, J = [0, 0, 0.4], A = jFieldAnalytic(P.r, J, R), uA = nrm(A.u), wA = nrm(A.w);
  // 相対の差の尺度: u は max(abs(u), J/R²)・w は max(abs(w), J/R³)(赤道面の √(5/6) R で w = 0・軸の上で u = 0 —— 尺度を下から押さえる)
  const su = Math.max(uA, 0.4), sw = Math.max(wA, 0.4), eu = (u) => (u === null ? null : nrm([u[0] - A.u[0], u[1] - A.u[1], u[2] - A.u[2]]) / su);
  const ew = (w) => nrm([w[0] - A.w[0], w[1] - A.w[1], w[2] - A.w[2]]) / sw;
  const q1 = grids.map((g) => eu(uQuadSource(P.r, R, Om, g))), q2 = grids.map((g) => eu(uNum(P.r, R, Om, g)));
  const gF = grids[grids.length - 1], w1 = halfCurlFD(P.r, R, Om, gF, h), w2 = halfCurlFD(P.r, R, Om, gF, h / 2);
  return { key: P.key, ja: P.ja, r: P.r.slice(), d: nrm(P.r), inside: A.inside, uA: A.u, wA: A.w, uAbs: uA, wAbs: wA, wJ: A.w[2] / 0.4, q1, q2, fdH: ew(w1), fdH2: ew(w2), fdW: w2 };
}
/** 境界の連続(解析 —— R(1 ∓ ε) の u と w の相対の差)と中心の値 */
export function jContinuity(eps = 1e-12) {
  const J = [0, 0, 0.4], pts = [[1, 0, 0], [0, 0, 1], [Math.SQRT1_2, 0, Math.SQRT1_2]];
  return pts.map((p) => { const a = jFieldAnalytic(scl3(p, 1 - eps), J, 1), b = jFieldAnalytic(scl3(p, 1 + eps), J, 1); return { p, uRel: vecRel(a.u, b.u), wRel: vecRel(a.w, b.w) }; });
}
/** 外側の式(エンジンの源のモーメントの形 u ∝ J/r² を源の内へ延ばした値)と内側の解析の比(赤道面 —— 受け手が R_src の内に入ったときの差の記録) */
export const farFormInsideRatio = (x) => (1 / (x * x)) / ((2.5 - 1.5 * x * x) * x);

/* ───────── J2 分割の加法性 ───────── */
/** 一辺 n の立方格子で中心が球の内のセル(単位の球 —— 体はセルの和集合)。Ω(ϖ) = Ω_0(1 − α ϖ²)(α = 0 で剛体) */
export function cubeBody(n, alpha) {
  const s = 2 / n, cells = [];
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) for (let k = 0; k < n; k++) {
    const x = -1 + (i + 0.5) * s, y = -1 + (j + 0.5) * s, z = -1 + (k + 0.5) * s;
    if (x * x + y * y + z * z <= 1) cells.push([x, y, z]);
  }
  const N = cells.length, ma = 1 / N, Om = (w2) => 1 - alpha * w2;
  // セルの固有の J = (m_a s²/12) ∇×v(線形の流れの近似 —— 剛体で m_a s²/6 Ω・差動で ∇×v = 2Ω_0(1 − 2αϖ²) ẑ)
  return cells.map((c) => { const w2 = c[0] * c[0] + c[1] * c[1], o = Om(w2); return { x: c, m: ma, v: [-o * c[1], o * c[0], 0], jInt: [0, 0, ma * s * s / 12 * 2 * (1 - 2 * alpha * w2)] }; });
}
/** 遠方(赤道面の距離 D)の u/K: 並進の項 2Σ m_a v_a/|r − x_a| と固有の項 Σ J_int,a × (r − x_a)/|r − x_a|³ */
function farSum(B, D, useTrans, useInt) {
  const r = [D, 0, 0]; let u = [0, 0, 0];
  for (const c of B) {
    const d = [r[0] - c.x[0], r[1] - c.x[1], r[2] - c.x[2]], dd = nrm(d);
    if (useTrans) u = add3(u, scl3(c.v, 2 * c.m / dd));
    if (useInt) u = add3(u, scl3(cross(c.jInt, d), 1 / (dd * dd * dd)));
  }
  return u;
}
/** 分割の行: 公転の J・固有の J・遠方の和と双極子(5G_0/c_0²)J_total/D² の比・固有の自転だけの和の比・案ごとの単一の源の遠方のモーメント(J_true との比) */
export function partitionRow(n, alpha, D) {
  const B = cubeBody(n, alpha), N = B.length, s = 2 / n;
  let Jorb = 0, Jint = 0; for (const c of B) { Jorb += cross(c.x, scl3(c.v, c.m))[2]; Jint += c.jInt[2]; }
  const Jtot = Jorb + Jint, dip = Jtot / (D * D);
  const uAll = farSum(B, D, true, true), uSpin = farSum(B, D, false, true), uTrans = farSum(B, D, true, false);
  // 案2b の分割の規則の型: 要素の R_obs を等しい体積の球の半径 r_a = s (3/(4π))^(1/3)(宣言)—— 遠方のモーメント = J_orb + 2·(2/5) Σ m_a r_a² Ω(ϖ_a)
  const ra = s * Math.cbrt(3 / (4 * Math.PI)); let k2int = 0, k1int = 0; for (const c of B) { const w2 = c.x[0] * c.x[0] + c.x[1] * c.x[1], o = 1 - alpha * w2; k1int += 0.4 * c.m * ra * ra * o; k2int += 0.8 * c.m * ra * ra * o; }
  return { n, N, alpha, Jorb, Jint, Jtot, JcontRef: jContOf(alpha), JtotOverCont: Jtot / jContOf(alpha), fracInt: Jint / Jtot, farOverDip: uAll[1] / dip, spinOnlyOverDip: uSpin[1] / dip, transOverDip: uTrans[1] / dip,
    p2aOverJ: (Jorb + k1int) / Jtot, p2bOverJ: (Jorb + k2int) / Jtot, nowOverJ: Jorb / Jtot };
}
/** 連続の球の J(Ω(ϖ) = 1 − αϖ² —— J = ρ∫(ϖ² − αϖ⁴)dV = 2/5 − α·8/35)。剛体 2/5・α = 1/2 で 2/7 */
export const jContOf = (alpha) => 0.4 - alpha * 8 / 35;
/** 粗視化の恒等式(König の型): セルを 8 つの群に分け、群の J_int,g = Σ_{a∈g}[J_int,a + (x_a − x_g) × m_a (v_a − v_g)]・Σ_g[J_int,g + x_g × M_g v_g] = J_total */
export function konigCheck(n, alpha) {
  const B = cubeBody(n, alpha), G = new Map();
  for (const c of B) { const k = (c.x[0] > 0 ? 1 : 0) + (c.x[1] > 0 ? 2 : 0) + (c.x[2] > 0 ? 4 : 0); if (!G.has(k)) G.set(k, []); G.get(k).push(c); }
  let Jtot = 0; for (const c of B) Jtot += cross(c.x, scl3(c.v, c.m))[2] + c.jInt[2];
  let Jg = 0, JgSpin = 0, Jgo = 0;
  for (const [, L] of G) {
    let M = 0, xg = [0, 0, 0], vg = [0, 0, 0]; for (const c of L) { M += c.m; xg = add3(xg, scl3(c.x, c.m)); vg = add3(vg, scl3(c.v, c.m)); }
    xg = scl3(xg, 1 / M); vg = scl3(vg, 1 / M);
    let ji = 0; for (const c of L) ji += cross([c.x[0] - xg[0], c.x[1] - xg[1], c.x[2] - xg[2]], scl3([c.v[0] - vg[0], c.v[1] - vg[1], c.v[2] - vg[2]], c.m))[2] + c.jInt[2];
    const jo = cross(xg, scl3(vg, M))[2]; Jg += ji + jo; JgSpin += ji; Jgo += jo;
  }
  return { n, groups: G.size, Jtot, Jgroups: Jg, rel: relDiff(Jg, Jtot), spinOnlyFrac: JgSpin / Jtot, orbFrac: Jgo / Jtot };
}
/** 連続の球の差動回転の流れの遠方(Q1 の求積 —— 受け手は赤道面の D)の u_y と双極子 J/D² の比 */
export function farQuadDiff(alpha, D, g) {
  const gr = gl01(g.nr), gm = glm11(g.nmu), rho = 3 / (4 * Math.PI), dph = 2 * Math.PI / g.nphi; let uy = 0, J = 0;
  for (let a = 0; a < g.nr; a++) { const rp = gr.x[a], wr = gr.w[a] * rp * rp; for (let b = 0; b < g.nmu; b++) { const mu = gm.x[b], st = Math.sqrt(Math.max(0, 1 - mu * mu)), wm = wr * gm.w[b] * dph;
    for (let c = 0; c < g.nphi; c++) { const ph = (c + 0.5) * dph, x = rp * st * Math.cos(ph), y = rp * st * Math.sin(ph), z = rp * mu, w2 = x * x + y * y, o = 1 - alpha * w2, dd = Math.hypot(D - x, y, z); uy += wm * o * x / dd; J += wm * o * w2; } } }
  uy *= 2 * rho; J *= rho;
  return { alpha, D, J, Jexact: jContOf(alpha), Jrel: relDiff(J, jContOf(alpha)), farOverDip: uy / (J / (D * D)) };
}

/* ───────── J3 太陽の J の体積積分(宣言の密度の模型の重み)───────── */
/** Lane–Emden(n)の数値解(RK4 —— 刻み dxi)と、動径の重み ∫ρ r⁴ dr の累積(正規化した半径 x = ξ/ξ1) */
export function laneEmden(n, dxi) {
  const f = (xi, th, ph) => [ph, -(Math.pow(Math.max(th, 0), n)) - 2 * ph / xi];
  let xi = 1e-6, th = 1 - xi * xi / 6, ph = -xi / 3; const P = [[xi, th]];
  while (th > 0) {
    const k1 = f(xi, th, ph), k2 = f(xi + dxi / 2, th + dxi / 2 * k1[0], ph + dxi / 2 * k1[1]), k3 = f(xi + dxi / 2, th + dxi / 2 * k2[0], ph + dxi / 2 * k2[1]), k4 = f(xi + dxi, th + dxi * k3[0], ph + dxi * k3[1]);
    const tn = th + dxi / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]), pn = ph + dxi / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
    if (tn <= 0) { const t = th / (th - tn); xi += t * dxi; P.push([xi, 0]); th = 0; break; }
    xi += dxi; th = tn; ph = pn; P.push([xi, th]);
  }
  const xi1 = xi, m = [0], I = [0];
  for (let k = 1; k < P.length; k++) { const [a, ta] = P[k - 1], [b, tb] = P[k], ra = Math.pow(Math.max(ta, 0), n), rb = Math.pow(Math.max(tb, 0), n); m.push(m[k - 1] + 0.5 * (ra * a * a + rb * b * b) * (b - a)); I.push(I[k - 1] + 0.5 * (ra * Math.pow(a, 4) + rb * Math.pow(b, 4)) * (b - a)); }
  const M = m[m.length - 1], It = I[I.length - 1], x = P.map((p) => p[0] / xi1);
  // I/(MR²) = (2/3)∫ρ r⁴ dr / (∫ρ r² dr · R²)
  return { n, xi1, f: (2 / 3) * It / (M * xi1 * xi1), Ifrac: (q) => { let k = 0; while (k < x.length - 1 && x[k + 1] <= q) k++; if (k >= x.length - 1) return 1; const t = (q - x[k]) / (x[k + 1] - x[k]); return (I[k] + t * (I[k + 1] - I[k])) / It; }, steps: P.length };
}
/** 太陽の回転の分布の J / (I Ω_ref)(放射層 Ω_rad・対流層の緯度の差動〔∫(1 − μ²)(A + Bμ² + Cμ⁴)dμ / (4/3) = A + B/5 + 3C/35〕・中心の核の倍率 k) */
export function sunJProfile(LE, OmRefSI, k = 1) {
  const S = DECL.sun, nHz = (v) => 2 * Math.PI * v * 1e-9, degDay = (v) => v * Math.PI / 180 / 86400, [A, B, C] = S.czDegDay.map(degDay);
  const Orad = nHz(S.radNHz), Ocz = A + B / 5 + 3 * C / 35, fc = LE.Ifrac(S.rCore), ft = LE.Ifrac(S.rTach);
  const J = (k * Orad * fc + Orad * (ft - fc) + Ocz * (1 - ft)) / OmRefSI;
  return { k, Orad, OczMean: Ocz, Aeq: A, IfracCore: fc, IfracTach: ft, JOverRigid: J };
}
/** 時間平均の Ω / 今の Ω(Ω ∝ t^(−1/2)・t < t_sat は Ω(t_sat))を窓 [t1, t2](Gyr)で */
export function spinAvg(tSat, t1, t2, tNow) {
  const Om = (t) => Math.sqrt(tNow / Math.max(t, tSat));
  // 解析: ∫ √(tNow/t) dt = 2√tNow(√t2 − √t1)(t1 ≥ tSat の部分)
  const a = Math.max(t1, tSat), sat = Math.max(0, Math.min(t2, tSat) - t1) * Om(tSat), pw = t2 > a ? 2 * Math.sqrt(tNow) * (Math.sqrt(t2) - Math.sqrt(a)) : 0;
  return (sat + pw) / (t2 - t1);
}

/* ───────── B 案2b の混成(源 K2 + 受け手 K1)の導き直し ───────── */
/** M2/K2 の遠方の級数の係数: (M2/K2)/((2/5)R²/r) = 1 + (3/35)z + …・d(K1·M2/K2)/dr の比 = 1 + (6/35)z + …(z = (R/r)²) —— lib の k2Of・m2Of で数値の残差と比べる */
export function mixSeriesRow(x) {
  const R = 1, r = x, K = k2Of(r, R), M = m2Of(r, R), z = 1 / (x * x), lead = 0.4 / r, ratio = M[0] / K[0];
  const mm = mixMoment(r, 1e-30, R), lead2 = 0.4 / (r * r), dlead2 = -0.8 / (r * r * r);
  return { x, rotRel: ratio / lead - 1, rotCoef: (ratio / lead - 1) / z, mixRot: mm[0] / lead2 - 1, axRel: mm[1] / dlead2 - 1, axCoef: (mm[1] / dlead2 - 1) / z, z };
}
export const MIX_ROT_COEF = 3 / 35, MIX_AX_COEF = 6 / 35;
/** 有効な J(案2b の遠方 = 2·(2/5) m R_obs² Ω)と物理の J = f m R_obs² Ω の比 0.8/f・案2a の 0.4/f・今の (2/5)(R_d/R_obs)²/f */
export const effJOf = (f, Rd, Robs) => ({ p2b: 0.8 / f, p2a: 0.4 / f, now: 0.4 * (Rd / Robs) * (Rd / Robs) / f, p3: 1 });

/* ───────── C 候補の一覧(自由な係数・新しい仮定・加法性)───────── */
export const CANDS = Object.freeze([
  Object.freeze({ key: 'now', ja: '今 R_src = R_d = Y_k m', free: 0, newAssump: 0, additive: '偽(要素の自転の和 ∝ N^(−2) —— 分けると公転の分だけが残る)', kind: 'src' }),
  Object.freeze({ key: 'p1', ja: '案1 R_src = min(R_obs, 6.5×10⁶ m)', free: 1, newAssump: 1, additive: '偽', kind: 'src' }),
  Object.freeze({ key: 'p2a', ja: '案2a R_src = R_obs(K1 の形)', free: 0, newAssump: 1, additive: '偽(一定の密度の要素で ∝ N^(−2/3))', kind: 'src' }),
  Object.freeze({ key: 'p2b', ja: '案2b 源 K2 + 受け手 K1 の混成(導き直した節点の和)', free: 0, newAssump: 1, additive: '宣言した粒度でだけ(公転の分 ×1・固有の分 ×2)', kind: 'src' }),
  Object.freeze({ key: 'p2bOld', ja: '案2b の旧の近似(案2a × 2 —— 遠方の倍率 2(R_obs/R_d)²)', free: 0, newAssump: 1, additive: '同上', kind: 'src' }),
  Object.freeze({ key: 'p3', ja: '案3 J(R_src = R_obs √(5f/2)・源の f は文献の値)', free: 0, newAssump: 0, additive: '真(J = Σ[J_int + 公転] —— 分け方に依らない)', kind: 'src' }),
  Object.freeze({ key: 'c3b', ja: '3b J + 内部の回転の分布(放射層・対流層の差動・中心の核の倍率 k = 10)', free: 1, newAssump: 1, additive: '真(J の体積積分)', kind: 'src' }),
  Object.freeze({ key: 'c3c', ja: '3c J の振幅 × K2 の近くの形(遠方を J に正規化)', free: 0, newAssump: 1, additive: '真(遠方は J)', kind: 'src' }),
  Object.freeze({ key: 'c3cx2', ja: '3c′ J の半径の K2 の比(正規化しない —— 遠方 2J)', free: 0, newAssump: 1, additive: '偽(固有の分だけ ×2)', kind: 'src' }),
  Object.freeze({ key: 'c3d', ja: '3d J + 受け手の結合 (R_obs,i/R_⊕)^q(q = 1 —— 軸の行だけ)', free: 1, newAssump: 1, additive: '源の側は真(受け手の新しい法則)', kind: 'recv' }),
  Object.freeze({ key: 'c3dAll', ja: '3d″ J + (R_obs,i/R_⊕)^q を公転面の行にも(q = 1)', free: 1, newAssump: 1, additive: '源の側は真(受け手の新しい法則)', kind: 'recv' }),
  Object.freeze({ key: 'c3e', ja: '3e J + τ_hold = η P_rot,i(η は木星の熱の比を 1 にする値を選んだ)', free: 1, newAssump: 1, additive: '真(熱の行だけ動く)', kind: 'recv' }),
  Object.freeze({ key: 'c3fi', ja: '3f J + アルヴェーン半径までの共回転の物質の J(物理の J に足す)', free: 0, newAssump: 1, additive: '真', kind: 'src' }),
  Object.freeze({ key: 'c3fii', ja: '3f′ R_src = R_A(太陽の質量のモーメントを R_A に —— R_A = 3 R☉)', free: 1, newAssump: 1, additive: '偽(質量はそこに無い)', kind: 'src' }),
  Object.freeze({ key: 'c3g', ja: '3g J を受け手の公転に対する相対の角速度 Ω☉ − n_i で', free: 0, newAssump: 1, additive: '真(源の J の数え方の宣言)', kind: 'relative' }),
  Object.freeze({ key: 'c3h', ja: '3h 時間平均の J(自転の減速 Ω ∝ t^(−1/2)・t_sat = 0.1 Gyr —— 窓ごと)', free: 1, newAssump: 1, additive: '真', kind: 'time' }),
  Object.freeze({ key: 'c3i', ja: '3i 潮汐で減る J(地球 → 月の行だけ —— 1 日の長さの増え方の今の率を直近 1 Gyr へ一次で外挿した平均)', free: 0, newAssump: 1, additive: '真', kind: 'time' })]);
export const CAND_KEYS = CANDS.map((c) => c.key);

/**
 * 6 天体の表(候補ごと)を基の行から作る(器が節点の和で作った基の行 base[変種] —— 変種は now・p1・p2a・p2b・p3・mixJ〔J の半径の混成〕・c3b・c3fii・c3g・c3h_*)
 *   行: 水星の公転面・金星の軸を π・金星の熱(宣言の区間の中央)・地球の公転面・火星の公転面・木星の熱 (b) 太陽の項(主列・代替の列・受け手 f の 2 列)・土星の環(内縁)
 *   広がり S3 = log10 の最大 − 最小(水星の公転面・金星の軸・木星の熱 (b) 主列 f = 0.5)・S4 = S3 に金星の熱を足した 4 行
 */
export const ROW_KEYS = Object.freeze(['me', 've', 'veHeat', 'veHeatF', 'veHeatLo', 'veHeatHi', 'ea', 'ma', 'ju', 'juAlt', 'juF', 'ring', 'emOm']);
const HEAT_V = ['veHeat', 'veHeatF', 'veHeatLo', 'veHeatHi'], HEAT_J = ['ju', 'juAlt', 'juF'];
export function sixTable(base, aux) {
  const out = [];
  const S = (v, keys) => { const L = keys.map((k) => Math.log10(Math.abs(v[k]))); return Math.max(...L) - Math.min(...L); };
  const pick = (b) => Object.fromEntries(ROW_KEYS.map((k) => [k, b[k]]));
  const scale = (b, f) => Object.fromEntries(ROW_KEYS.map((k) => [k, b[k] * f(k)]));
  for (const c of CANDS) {
    let v = null; const b3 = pick(base.p3), extra = {};
    if (c.key === 'p2bOld') v = scale(pick(base.p2a), () => 2);
    else if (c.key === 'c3c') v = scale(pick(base.mixJ), () => 0.5);
    else if (c.key === 'c3cx2') v = pick(base.mixJ);
    else if (c.key === 'c3d' || c.key === 'c3dAll') {
      const f = (R) => R / DECL.recvPow.Rref, plane = c.key === 'c3dAll';
      v = scale(b3, (k) => (HEAT_V.includes(k) || k === 've' ? f(aux.R.ve) : HEAT_J.includes(k) ? f(aux.R.ju) : (plane && k === 'me') ? f(aux.R.me) : (plane && k === 'ea') ? f(aux.R.ea) : (plane && k === 'ma') ? f(aux.R.ma) : 1));
    } else if (c.key === 'c3e') {
      const h0 = aux.h0, eta = (b3.ju * h0) / aux.Prot.ju, fac = (P) => h0 / (eta * P);
      v = scale(b3, (k) => (HEAT_J.includes(k) ? fac(aux.Prot.ju) : HEAT_V.includes(k) ? fac(aux.Prot.ve) : 1));
      Object.assign(extra, { eta, tauJu: eta * aux.Prot.ju, tauVe: eta * aux.Prot.ve });
    } else if (c.key === 'c3fi') v = scale(b3, (k) => (k === 'ring' || k === 'emOm' ? 1 : 1 + aux.coronaJFrac));
    else if (c.key === 'c3h') v = scale(b3, (k) => (k === 'me' || k === 'ea' || k === 'ma' ? aux.spin.age : k === 've' ? aux.spin.venus : 1));
    else if (c.key === 'c3i') v = scale(b3, (k) => (k === 'emOm' ? aux.earthLod.avgFactor : 1));
    else v = pick(base[c.key]);
    const row = Object.assign({ key: c.key, ja: c.ja, free: c.free, newAssump: c.newAssump, additive: c.additive }, v, extra);
    row.S3 = S(row, ['me', 've', 'ju']); row.S4 = S(row, ['me', 've', 'ju', 'veHeat']); row.S3F = S(row, ['me', 've', 'juF']);
    out.push(row);
  }
  return out;
}
/** 3d の q を掃引して S3 を最小にする値(選んだ値 —— 導いた値ではない)。aplane: 公転面の行にも掛けるか */
export function bestQ(b, R, aplane) {
  const D = DECL.recvPow; let best = null;
  for (let q = D.qScan[0]; q <= D.qScan[1] + 1e-12; q += D.qStep) {
    const f = (Ri) => Math.pow(Ri / D.Rref, q), me = aplane ? b.me * f(R.me) : b.me, ve = b.ve * f(R.ve), ju = b.ju * f(R.ju);
    const L = [me, ve, ju].map((x) => Math.log10(x)), s = Math.max(...L) - Math.min(...L);
    if (!best || s < best.S3 - 1e-15) best = { q: Math.round(q * 1e4) / 1e4, S3: s, me, ve, ju };
  }
  return best;
}

/* ───────── 候補の数として挙がった値の計算と真偽 ───────── */
/**
 * 第122報の決断事項の材料に挙がった候補の数(計算の根拠が示されていない値)を本便の式で計算する。claimed は挙がった値・mine は本便の計算・ok は相対 5% の内か
 *   (5% は桁の写しの丸めの許し —— 合否の閾値ではない)
 */
export function claimsOf(tab, aux, extra) {
  const row = (k) => tab.find((r) => r.key === k), p3 = row('p3'), c3d = row('c3dAll'), c3e = row('c3e'), c3c2 = row('c3cx2');
  const L = [];
  const add = (key, ja, claimed, mine, note) => L.push({ key, ja, kind: 'num', claimed, mine, ok: (mine !== null && Number.isFinite(mine) && claimed !== null) ? Math.abs(mine / claimed - 1) <= 0.05 : false, note });
  const addB = (key, ja, claimed, mine, note) => L.push({ key, ja, kind: 'bool', claimed, mine, ok: claimed === mine, note });
  add('3a-fac', '案3 J の太陽の源の倍率 2.761×10⁸', 2.761e8, extra.factorJSun, '(R_src,J/R_d)²');
  add('3a-me', '案3 J の水星の公転面の比 5.81', 5.81, p3.me, '案3 の基の値');
  add('3a-ve', '案3 J の金星の軸の比 0.012', 0.012, p3.ve, '仮の期間 1 Gyr');
  add('3a-ju', '案3 J の木星の熱 (b) の比 0.080', 0.080, p3.ju, '受け手 f = 0.5');
  add('2b-fac', '案2b の太陽の源の倍率 3.156×10⁹', 3.156e9, extra.factor2bSun, '旧の近似の遠方の倍率 2(R_obs/R_d)²(導き直した値は節点の和 —— 惑星の距離で差は 10⁻⁵ の桁)');
  add('2b-ju', '案2b の木星の熱 (b) の比 0.913', 0.913, row('p2b').ju, '導き直した節点の和');
  add('3b-fac', '3b の太陽の源の倍率 0.83〜2.76×10⁹(上端 —— 中心の核の速い回転)', 2.76e9, extra.c3bFac10, '中心の核 r < 0.2 R を k = 10 倍にした J の倍率 × 案3 の遠方の倍率(核の慣性モーメントは全体の約 5% —— 宣言の密度の模型)');
  add('3c-me', '3c の水星の公転面の比 11.6', 11.6, c3c2.me, '正規化しない 2J の型(3c′)の値 —— 遠方を J に正規化した 3c は案3 と同じ');
  addB('3c-add', '3c の加法性が完全', true, false, '2 倍は固有の分だけに掛かる(公転の分は K1 の並進の項 ×1)—— 分けると 2J から J へ動く');
  add('3d-me', '3d の水星の公転面の比 2.22', 2.22, c3d.me, '受け手の結合を公転面の行にも掛けた型(3d″・q = 1)');
  add('3d-ju', '3d の木星の熱 (b) の比 0.896', 0.896, c3d.ju, '入力の本の木星の半径(体積の平均)で 0.877 —— 赤道半径なら R_eq/R_obs 倍');
  add('3d-S', '3d の広がり 1.4 dex 以下', 1.4, c3d.S3, '3 行の広がり(水星の公転面・金星の軸・木星の熱)—— 金星の軸の比は q でほとんど動かない');
  add('3e-ve', '3e の金星 0.92(木星 0.95 と同時)', 0.92, c3e.veHeat * 0.95, '木星の熱の比を 0.95 にする η での金星の熱の比(宣言の区間の中央)—— 金星の軸の比は τ_hold に依らない');
  add('3f-fac', '3f の太陽の源の倍率 2.5〜4.0×10⁹(R_A = 3〜12 R☉ —— 下端)', 2.5e9, extra.c3fiiFac3, 'R_src = R_A = 3 R☉(太陽の質量のモーメントを R_A に置く読み 3f′)—— 共回転の物質の J を足す読み 3f は倍率 1 + 10⁻¹⁶〜10⁻¹³');
  return L;
}

/* ───────── 書式 ───────── */
export const lab = { ex, fx, fl: (x, floor = 1e-15) => fmtFloor(x, floor, 3), yes: (b) => (b ? '真' : '偽') };
export { fmtFloor, ex, fx, LIT318 };
