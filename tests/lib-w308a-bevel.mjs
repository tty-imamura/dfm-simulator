// 第308便a(原仮定者の裁定(第101報)「源の軸回転が、軸方向に対する角度差の 2 倍の角度差で傾いた軸で作用する —— 接触する 2 つの球で片方だけ回るとき、
// 赤道での接触は逆回転・軸方向での接触は順回転・仰角 45° ではベベルギヤの様に 90° 傾いた回転」「軸引きずりは回転引きずりの差分であり、仰角が上がると
// 回転引きずりが弱くなる」「軸引きずりの受け手も体積平均で構わない」・決断事項 AN346・AN347・AN354・統括の検証項目 R214):
// **軸引きずりの鏡映の核の参照の純関数**(html を読まない・状態を持たない)。
//
// ■ 何をするか(器 tests/exp-w308a-bevel.mjs が使う)
//   ・向き: 源の自転ベクトル Ω(符号つき)を源から受け手への向き r̂ について鏡映した b = 2 r̂(r̂·Ω) − Ω(|b| = |Ω|・源の軸から θ の向きで作用の軸は 2θ 傾く)。
//   ・強さ: 回転引きずりの速さ |u| = g(r)|Ω| sinθ(sinθ = |â × r̂| —— 第101報の「仰角が上がると回転引きずりが弱まる」を具体化した仮定)。
//     規格化は 2 型: 差分の型 amp = −∂g/∂r(近い側と遠い側の速さの差を直径で割った角速度)/ 速さの型 amp = g/r。ω_D = A·amp·sinθ·b。
//   ・g = c m M1(r)/D(x): M1 は**源の一様球の上の直接の求積**(tests/lib-w307a-sphereaxial.mjs の sourceM1 —— 対蹠の対を log1p/expm1 で)・
//     D は点の核の分母(行: 1 + c[Σ m K_ε + Σ q/(r²+ε²) + 定数]/ 対: 源ごとに 1 + c[m_j K_ε + q_j/(r²+ε²) + 定数])。
//     −∂g/∂r は**数値の微分**(r̂ に沿った中心差分の Richardson —— 分母も動かした点で作り直す)。エンジンの閉じた式・外部の級数と独立。
//   ・遠方の M1 の外部の級数(ε = 0・一様球): M1 = (3R²/r⁴) Σ_j (R/r)^{2j}/(2j+5)・dM1/dr = −(3R²/r⁵) Σ_j (4+2j)(R/r)^{2j}/(2j+5)(32 項 —— 独立な写し)。
//   ・受け手の体積平均: 角速度の場を一様球(t ∈ (0,1) の重み 3t²・球面の求積)で平均するだけ(速度の場から剛体回転を取り出す係数 5/(2R²)・3/(2R²) を掛けない)。
//
// ■ しないこと: html を読まない・エンジンの式を写さない(エンジンの inertialDrag3AxialBevelAt・inertialSpinMomentFar と**独立に**作る —— 器が両者を比べる)。
import { dot, cross, norm, add, sub, scale, unit, dirAt, sphereRule, ballRadial, sourceM1, kernelK, denomOf } from './lib-w307a-sphereaxial.mjs';
export { dot, cross, norm, add, sub, scale, unit, dirAt, sphereRule, ballRadial, sourceM1, kernelK, denomOf };
export const LIB_VERSION = 'w308a-bevel-lib-1';

const vec = (v) => Array.isArray(v) && v.length === 3 && v.every(Number.isFinite);

/* ───────── 向きと幾何 ───────── */
/** 鏡映の軸 b = 2 r̂(r̂·Ω) − Ω(Ω は符号つきの自転ベクトル・r̂ は単位でなくてよい —— 向きだけを使う) */
export function mirrorAxis(d, Om) {
  if (!vec(d) || !vec(Om) || !(norm(d) > 0)) throw new Error('mirrorAxis: 定義域');
  const n = unit(d);
  return sub(scale(n, 2 * dot(n, Om)), Om);
}
/** sinθ = |â × r̂|(源の軸からの角の正弦 —— 軸上で 0・赤道で 1) */
export function sinTheta(d, a) { return norm(cross(unit(a), unit(d))); }
/** 点の鏡映の核 amp·sinθ·b(amp は呼び手が渡す強さ —— 規格化の型の外) */
export function bevelPoint(d, Om, amp = 1) {
  const w = norm(Om);
  if (w === 0 || amp === 0) return [0, 0, 0];
  return scale(mirrorAxis(d, Om), amp * sinTheta(d, Om));
}
/** 仰角 el(源の赤道面から)の幾何の行: 強さ(|ω|/(amp|Ω|))・源の軸への射影・作用の軸と源の軸のなす角(強さ 0 は null) */
export function geometryRow(elDeg, az = 0) {
  const a = [0, 0, 1], d = dirAt(a, elDeg, az), w = bevelPoint(d, a, 1), mag = norm(w);
  return { elDeg, strength: mag, projection: dot(w, a), axisAngleDeg: mag > 1e-12 ? Math.acos(Math.max(-1, Math.min(1, dot(w, a) / mag))) * 180 / Math.PI : null,
    transverse: Math.hypot(w[0], w[1]) };
}

/* ───────── 遠方の M1 の外部の級数(ε = 0)───────── */
export function m1Series(r, R, terms = 32) {
  if (!(r > 0) || !(R > 0) || !(r >= 4 * R)) throw new Error('m1Series: r ≥ 4R(ε = 0)だけ');
  const z = (R / r) * (R / r);
  let zk = 1, s = 0, t = 0;
  for (let k = 0; k < terms; k++) { const a = zk / (2 * k + 5); s += a; t += (4 + 2 * k) * a; zk *= z; }
  const c = 3 * z / (r * r);
  return { M: c * s, dM: -c * t / r };
}
/** 一様球の M1 の直接の求積(lib-w307a の sourceM1 —— 球面 nS 次・動径 nR 次) */
export const m1Quad = (r, R, eps, n = 16) => sourceM1(r, R, 'ball', { nS: n, nR: n, eps });
/** dM1/dr の数値の微分(中心差分 h と h/2 の Richardson —— h = hRel·r) */
export function dM1Quad(r, R, eps, n = 16, hRel = 2e-3) {
  const f = (x) => m1Quad(x, R, eps, n), d = (h) => (f(r + h) - f(r - h)) / (2 * h), h = hRel * r;
  return (4 * d(h / 2) - d(h)) / 3;
}

/* ───────── 参照の鏡映の核(源の一様球の求積・分母は点の核・微分は数値)───────── */
/**
 * cfg = {C, eps, sources:[{p, m, Om, a(単位の軸), R, q?}], masses:[{p, m}](行の分母の点の核), i2:[{p, q}]|null(行の分母の r⁻²), Dconst(定数 —— 自己・背景側),
 *        pair:bool(対ごと —— 源 j の分母は 1 + c[m_j K + q_j/(r²+ε²) + Dconst])}。opt = {norm:'diff'|'speed', gain, n(求積の次数), hRel}
 * @returns {{omega:number[], terms:Array}}
 */
export function denomPair(x, s, cfg) {
  const e2 = (cfg.eps || 0) ** 2, d = sub(x, s.p), r2 = dot(d, d);
  return 1 + cfg.C * ((cfg.Dconst || 0) + s.m * kernelK(r2, e2) + ((s.q !== undefined && s.q !== null) ? s.q / (r2 + e2) : 0));
}
export function gOf(x, s, cfg, n = 16) {
  const r = norm(sub(x, s.p)), M1 = m1Quad(r, s.R, cfg.eps || 0, n), D = cfg.pair ? denomPair(x, s, cfg) : denomOf(x, cfg);
  return cfg.C * s.m * M1 / D;
}
export function bevelRef(x, cfg, opt = {}) {
  const nm = opt.norm || 'diff', gain = opt.gain === undefined ? 1 : opt.gain, n = opt.n || 16, hRel = opt.hRel || 2e-3;
  let om = [0, 0, 0];
  const terms = [];
  for (const s of cfg.sources) {
    const d = sub(x, s.p), r = norm(d), rh = scale(d, 1 / r);
    let amp;
    if (nm === 'speed') amp = gOf(x, s, cfg, n) / r;
    else {
      const g = (t) => gOf(add(s.p, scale(rh, t)), s, cfg, n), dd = (h) => (g(r + h) - g(r - h)) / (2 * h), h = hRel * r;
      amp = -(4 * dd(h / 2) - dd(h)) / 3;
    }
    const w = scale(bevelPoint(d, scale(s.a, s.Om), amp), gain);
    terms.push({ amp, sin: sinTheta(d, s.a), omega: w });
    om = add(om, w);
  }
  return { omega: om, terms };
}

/* ───────── 受け手の体積平均(角速度の場の平均 —— 剛体の射影の係数は掛けない)───────── */
export function volumeMean(center, R, field, order = 12) {
  if (!vec(center) || !(R >= 0)) throw new Error('volumeMean: 定義域');
  if (R === 0) return field(center);
  let out = [0, 0, 0];
  for (const a of ballRadial(order)) for (const b of sphereRule(order)) out = add(out, scale(field(add(center, scale(b.s, R * a.t))), a.w * b.w));
  return out;
}
/** 極の有限の受け手の残り(一定の強さ・R_i/r → 0): 源の軸方向の成分 / (amp|Ω|) ≈ (3π/16)(R_i/r) */
export const poleResidualTheory = (RiOverR) => 3 * Math.PI / 16 * RiOverR;
