// 第337便e(原仮定者の指示(2026-11-14 —— 第138報)「銀河を個々の天体でシミュレーションする事は不可能だが、流体とみなせばシミュレーションが出来る。それが geoPN=4 である」
//   「銀河のシミュレーションを進める上で、『土星の環』と『太陽系の惑星』がヒントとなる。その為に、並進引きずりと回転引きずりの検証を進める。長期的な安定については、軸引きずりが担う」・
//   統括の検証項目 R341): **銀河を流体と見る探索の純関数** —— 流体の要素の自己の重みの 3 つの読み(B 体積の内の積分〔主候補〕・A 軟化の長さを自己の半径に・C 星 1 個の R_d = Y_k m〔実在の星の規則 —— 対照〕)・
//   滑らかな密度の連続の場(Plummer 球の切った密度の核の積分)・流体のモーメント(近傍の平均の速度 V と速度の散らばり)と保存する引きずり(対ごとに等大・逆向き —— 共通の分母の全成分/中心方向)・
//   要素の中の散らばり Π(内部のエネルギー —— 押しの圧力)・押しと速度の場の積分(陽の 1 步遅れ/陰の中点)・場の読み(中心の点・内の和・局所)・環のヒント(自転する中心のまわりの冷たい環 —— 単体と連星)。
//   器 tests/exp-w337e-fluid.mjs と QA behavior.fluid337e・docs.fluid337e が読む —— html を読まない・状態を持たない。
//   **診断だけ** —— エンジン・内蔵の本・受理器・第329〜336便の lib の本文は変えない(第335便f の lib の `sampleModel`・`forces`・`measure`・`selfWeights`・`integrate` ほか・第333便d の `rngOf`・
//   第333便b の `integratedField`・第334便a の `t1Twist` を呼ぶ —— 写さない)。**本便で流体の要素の自己の重みと保存する引きずりの式を持つのはこの lib だけ**(場の読みは銀河の中の要素への引きずりだけ)。
//
// ■ 単位: G = M = a = 1(Plummer 球 —— 第335便f と同じ)。N は**解像の要素の数**(1 要素 = 一定の体積の質量と運動を代表する流体の要素 —— 実在の星の数ではない)。m = 1/N。
// ■ 重み: w_ij = m_j K(r_ij)・K(r) = (r² + ε²)^(−α/2)(第335便f と同じ —— α = 2 が主)。要素 i の外の重み W_i = Σ_{j≠i} w_ij。
// ■ 自己の重みの読み(SELF_READINGS —— 走行の前に並べる。結果を見て選ばない):
//   none = 0(第335便f の主列)/A = m_i/ε^α(軟化の長さを自己の半径に)/B = 要素の体積 V_i = m_i/ρ_i を同じ体積の球(半径 R_i = (3V_i/4π)^(1/3))とみて、その内の核の積分
//   w_ii^B = 4πρ_i ∫₀^{R_i} u² K(u) du(α = 2: 4πρ_i (R_i − ε atan(R_i/ε))・α = 1: 2πρ_i (R_i √(R_i² + ε²) − ε² asinh(R_i/ε)))/C = m_i/R_d^α(R_d = Y_k m_i —— 第335便f の `selfWeights`)。
//   B の ρ_i は解析の密度(切った Plummer 球 —— 静的な表の「同じ滑らかな密度」)か k 近傍(k = 32)の推定(走行の中 —— 測りの間隔ごとに更新)。
//   連続の場: W(p) = ∫ρ(p′)K(|p − p′|) d³p′ —— 球対称の ρ では方位の積分を閉じた形にして動径の 1 次元の求積(α = 2)。線形の速度の場 V = A p の連続の引きずり d(p) = A (p̄(p) − p)
//   (p̄ = ∫ρK p′ d³p′ / W —— 核で重みを付けた重心・球対称で動径の向き)。
// ■ 引きずりの型(DRAG_KINDS): row = 第335便f の行ごとに正規化した和 d_i = Σ w_ij (v_j − v_i)/(w_ii + W_i)(保存しない —— 対照)/
//   symFull = 共通の分母 W̄ = Σ_i m_i (w_ii + W_i)/Σ m_i の対の和 d_i = Σ_j m_j K_ij (v_j − v_i)/W̄(対ごとに等大・逆向き —— 運動量を保存・角運動量は保存しない)/
//   symCentral = 同じ分母で中心方向の成分だけ d_i = Σ_j m_j K_ij ((v_j − v_i)·r̂_ij) r̂_ij/W̄(運動量と角運動量を保存・失う運動のエネルギーは非負)/
//   center = 中心の点(全質量 M を重心に・速度 v_cm・自転 s_c —— 0 か L_z/Σ m R²)/inner = 内の和(r_j < r_i の質量 M_in を中心に・平均の速度・自転 L_z,in/Σ_in m R²)。
//   作用: push = dv/dt = a + γ d/vel = dp/dt = v + d(陽 = 第335便f の 1 步遅れの d・陰 = 位置の更新の d を中点 (p_n + p_{n+1})/2 と半步の速度で反復 DECL.implicitIters 回)。
// ■ 熱の口と要素の中の散らばり Π(内部のエネルギー u_i —— 等方): pi = false なら失った運動のエネルギーは熱の口 Q(放射 —— 系から出る)/pi = true なら u_i へ入れ(対の散逸の分け前 —— 合計は
//   押しの仕事と同じ)、圧力 P_i = (2/3)ρ_i u_i を固定の平滑の長さ h_sph の核(三次のスプライン)で力に戻す(a_i = −Σ m_j (P_i/ρ_i² + P_j/ρ_j²)∇W_ij・du_i/dt = (P_i/ρ_i²) Σ m_j (v_i − v_j)·∇W_ij)。
//   異方の Π テンソルは持たない(次に足すノブの候補)。
// ■ 環のヒント(ringRun): 中心(単体 M = 1/連星 0.5 + 0.5・離れ a_b・円軌道 —— 動きは与える)のまわりの冷たい環(試験の粒子 —— 重力は中心だけ)。中心の自転 s ẑ(連星は各成分)。
//   T = 並進引きずり(源の座標の速度 c_k = v_k + s ẑ × (p − p_k) の重み m_k/r_k² の平均 U へ押す —— 第333便b の `integratedField` と同じ値)・
//   R = 回転引きずり(第334便a の `t1Twist` の速さ β s z に向き φ̂〔中心の自転軸のまわりの方位 —— 第335便c の向きの候補 (a) を宣言として借りる〕)・
//   A = 環の要素どうしの中心方向の保存する引きずり(要素の部位の差で起きる分 —— 軸引きずりの読みの候補として置く。点の試験の粒子には部位が無いので、軸引きずりは要素どうしの差で読む)。
// ■ 言わないこと: 表は宣言した型とノブの組の測った数(銀河の解・楕円銀河の再現・環の安定の担い手の特定ではない)・
//   B は解像度の依存を消す式ではない(測った N の依存を書く)・N は解像の要素の数・軟化は宣言の長さ。
import { rngOf } from './lib-w333d-noncirc.mjs';
import * as E5 from './lib-w335f-elliptical.mjs';
import { integratedField } from './lib-w333b-axialfield.mjs';
import { t1Twist } from './lib-w334a-heightlaw.mjs';

export const LIB_VERSION = 'w337e-fluid-lib-1';
export const SELF_READINGS = Object.freeze(['none', 'A', 'B', 'C']);
export const DRAG_KINDS = Object.freeze(['none', 'row', 'symFull', 'symCentral', 'center', 'inner']);
export const FIELDS = Object.freeze(['const', 'rigid', 'shear', 'diff', 'iso']);
export const RING_COLS = Object.freeze(['grav', 'T', 'R', 'A', 'TR', 'TA', 'TRA', 'X1', 'X2']);
/** 軸引きずりの 2 つの読み(原仮定者の補足(2026-11-14 —— 第138報の補足)): X1 = 近い面と遠い面の差分だけ(動径の勾配の分 —— 赤道面の係数 f(1 − α(1 − f)))/X2 = 回転率の全部 ½∇×U(第333便b の `integratedField` の omega —— 赤道面の係数 f(1 − α(1 − f)/2)) */
export const AXIAL_READINGS = Object.freeze(['X1', 'X2']);
/** 宣言(走行の前に置く —— 結果を見て変えない。変えたら版を上げて理由を書く) */
export const DECL = Object.freeze({
  idTol: 1e-12,
  alphaMain: 2,
  /** k 近傍の密度の推定の k(ρ_i = (r_k の内の質量)/(4/3 π r_k³) —— r_k は自分を除く k 番目の近さ) */
  kNN: 32,
  /** 要素の中の散らばり Π の圧力の平滑の長さ(固定・a の単位)と三次のスプラインの台 2 h_sph */
  sphH: 0.3,
  /** 陰の積分の反復の回数(中点の固定点の反復) */
  implicitIters: 3,
  /** 速度の場の大きさ(模型の単位): 剛体回転 Ω・単純なずれ V_x = S y・差動回転 V_φ = Ω₀ R (1 + R²)^(−3/4) */
  fieldAmp: Object.freeze({ rigid: 0.5, shear: 0.5, diff: 0.5 }),
  /** 連続の場の求積(Gauss–Legendre の点の数と区間の数) */
  quad: Object.freeze({ gl: 8, panels: 24 }),
  /** 環: 試験の粒子の数・軌道の長半径の範囲・初期の e と傾きの散らばり(Rayleigh の σ)・中心の自転・連星の離れ・環の要素の軟化・環の質量(引きずりの重みだけ —— 重力は中心だけ) */
  ring: Object.freeze({ n: 128, aMin: 0.9, aMax: 1.1, sigE: 0.02, sigI: 0.02, spin: 1, binarySep: 0.25, epsRing: 0.02, massRing: 1e-3,
    /** 軸引きずりの列: 結合の係数 c_ax(a = c_ax ω_ax × u —— u は要素の固有の速度 v − Ω_c(R) ẑ × p)・自己の重みが源の重みより大きい読みの K(r = 1 で f = W/(K + W) = 0.1 になる K = 9) */
    cAx: 0.1, Kdom: 9 }),
});
const fin = (x) => typeof x === 'number' && Number.isFinite(x);

/* ───────── 切った Plummer 球の密度と連続の場 ───────── */
/** 標本の外側の切り(第335便f の sampleModel の r(u) —— u = uMax) */
export function rCutOf(uMax = E5.DECL.uMax.plummer) { return 1 / Math.sqrt(Math.cbrt(1 / (uMax * uMax)) - 1); }
/** 標本の密度(総質量 1 に規格化 —— 切りの内で Plummer の密度 ÷ uMax・外で 0) */
export function rhoPlummer(r, uMax = E5.DECL.uMax.plummer) { return r > rCutOf(uMax) ? 0 : (3 / (4 * Math.PI)) * Math.pow(1 + r * r, -2.5) / uMax; }
let GL_CACHE = new Map();
/** Gauss–Legendre の点と重み([−1, 1]) */
export function glRule(n) {
  if (GL_CACHE.has(n)) return GL_CACHE.get(n);
  const x = new Float64Array(n), w = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    let z = Math.cos(Math.PI * (i + 0.75) / (n + 0.5)), pp = 0;
    for (let it = 0; it < 100; it++) {
      let p1 = 1, p2 = 0;
      for (let k = 1; k <= n; k++) { const p3 = p2; p2 = p1; p1 = ((2 * k - 1) * z * p2 - (k - 1) * p3) / k; }
      pp = n * (z * p1 - p2) / (z * z - 1);
      const z1 = z; z = z1 - p1 / pp; if (Math.abs(z - z1) < 1e-15) break;
    }
    x[i] = z; w[i] = 2 / ((1 - z * z) * pp * pp);
  }
  const R = { x, w }; GL_CACHE.set(n, R); return R;
}
function quadPanels(f, breaks, panels, gl) {
  const { x, w } = glRule(gl);
  let s = 0;
  for (let b = 0; b + 1 < breaks.length; b++) {
    const A = breaks[b], B = breaks[b + 1]; if (!(B > A)) continue;
    const hP = (B - A) / panels;
    for (let p = 0; p < panels; p++) { const c = A + (p + 0.5) * hP, hh = 0.5 * hP; for (let k = 0; k < x.length; k++) s += w[k] * hh * f(c + hh * x[k]); }
  }
  return s;
}
/** 方位の積分(α = 2): I0 = ∫_{−1}^{1} dμ/(a − bμ)・I1 = ∫ μ dμ/(a − bμ)(a = r² + r′² + ε²・b = 2 r r′ —— 小さい b/a は級数) */
export function kernAngular(r, rp, eps) {
  const a = r * r + rp * rp + eps * eps, b = 2 * r * rp;
  if (!(a > 0)) throw new RangeError('kernAngular: r・r′・ε が全部 0');
  if (b < 1e-3 * a) { const q = b / a, q2 = q * q; return { I0: (2 / a) * (1 + q2 / 3 + q2 * q2 / 5), I1: (2 * q / (3 * a)) * (1 + 0.6 * q2 + (3 / 7) * q2 * q2) }; }
  const L = Math.log((a + b) / (a - b));
  return { I0: L / b, I1: -2 / b + a * L / (b * b) };
}
/** 連続の場(α = 2): W(r) = 2π∫ρ r′² I0 dr′・核で重みを付けた重心の動径 g(r) = 2π∫ρ r′³ I1 dr′ / W(切った Plummer 球) */
export function continuumField(r, eps, { uMax = E5.DECL.uMax.plummer, gl = DECL.quad.gl, panels = DECL.quad.panels } = {}) {
  if (!(fin(r) && r >= 0 && fin(eps) && eps > 0)) throw new RangeError('continuumField: r ≥ 0・ε > 0');
  const rc = rCutOf(uMax), br = [0];
  for (const t of [r - 4 * eps, r - eps, r, r + eps, r + 4 * eps]) if (t > 0 && t < rc) br.push(t);
  br.push(rc); br.sort((p, q) => p - q);
  const W = 2 * Math.PI * quadPanels((rp) => rhoPlummer(rp, uMax) * rp * rp * kernAngular(r, rp, eps).I0, br, panels, gl);
  const Nz = 2 * Math.PI * quadPanels((rp) => rhoPlummer(rp, uMax) * rp * rp * rp * kernAngular(r, rp, eps).I1, br, panels, gl);
  return { W, g: Nz / W };
}
/** 連続の場の表(r の格子 —— 線形の補間で要素の位置へ) */
export function continuumTable(eps, rMax, n = 400) {
  const rs = new Float64Array(n + 1), W = new Float64Array(n + 1), g = new Float64Array(n + 1);
  for (let k = 0; k <= n; k++) { const r = rMax * (k / n) ** 2; rs[k] = r; const c = continuumField(r, eps); W[k] = c.W; g[k] = c.g; }
  return { rs, W, g, at(r) { let lo = 0, hi = n; if (r >= rs[n]) return { W: W[n], g: g[n] }; while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (rs[mid] <= r) lo = mid; else hi = mid; } const t = (r - rs[lo]) / (rs[hi] - rs[lo]); return { W: W[lo] + t * (W[hi] - W[lo]), g: g[lo] + t * (g[hi] - g[lo]) }; } };
}

/* ───────── 自己の重みの読み ───────── */
/** B: 体積の内の核の積分(同じ体積の一様な球 —— 半径 R = (3m/(4πρ))^(1/3)) */
export function selfWeightB(m, rho, eps, alpha = DECL.alphaMain) {
  if (!(fin(m) && m > 0 && fin(rho) && rho > 0 && fin(eps) && eps >= 0)) throw new RangeError('selfWeightB: m > 0・ρ > 0・ε ≥ 0');
  if (!(alpha === 1 || alpha === 2)) throw new RangeError('selfWeightB: α は 1 か 2');
  const R = Math.cbrt(3 * m / (4 * Math.PI * rho));
  if (alpha === 2) return 4 * Math.PI * rho * (eps > 0 ? R - eps * Math.atan(R / eps) : R);
  return 2 * Math.PI * rho * (eps > 0 ? R * Math.sqrt(R * R + eps * eps) - eps * eps * Math.asinh(R / eps) : R * R);
}
/** A: 軟化の長さを自己の半径に(m/ε^α) */
export function selfWeightA(m, eps, alpha = DECL.alphaMain) {
  if (!(fin(m) && m > 0 && fin(eps) && eps > 0)) throw new RangeError('selfWeightA: m > 0・ε > 0');
  return m / (alpha === 1 ? eps : eps * eps);
}
/** k 近傍の密度(自分を除く k 番目の近さ r_k —— ρ_i = (r_k の内の質量)/(4/3 π r_k³)) */
export function knnDensity(S, k = DECL.kNN) {
  const N = S.N; if (!(Number.isInteger(k) && k >= 1 && k < N)) throw new RangeError('knnDensity: 1 ≤ k < N');
  const out = new Float64Array(N), d = new Float64Array(N - 1), idx = new Int32Array(N - 1);
  for (let i = 0; i < N; i++) {
    let c = 0;
    for (let j = 0; j < N; j++) { if (j === i) continue; const dx = S.x[j] - S.x[i], dy = S.y[j] - S.y[i], dz = S.z[j] - S.z[i]; d[c] = dx * dx + dy * dy + dz * dz; idx[c] = j; c++; }
    // 部分の選択(k 番目 —— 0 始まりの k − 1)
    let lo = 0, hi = N - 2; const t = k - 1;
    while (lo < hi) {
      const piv = d[(lo + hi) >> 1]; let a = lo, b = hi;
      while (a <= b) { while (d[a] < piv) a++; while (d[b] > piv) b--; if (a <= b) { const q = d[a]; d[a] = d[b]; d[b] = q; const qi = idx[a]; idx[a] = idx[b]; idx[b] = qi; a++; b--; } }
      if (t <= b) hi = b; else if (t >= a) lo = a; else break;
    }
    let ms = 0; for (let q = 0; q < N - 1; q++) if (d[q] <= d[t]) ms += S.m[idx[q]];   // 半径 r_k の内の質量(等しい質量なら k m —— 同じ距離の重なりは含める)
    const rk = Math.sqrt(d[t]);
    out[i] = ms / (4 / 3 * Math.PI * rk * rk * rk);
  }
  return out;
}
/** 自己の重みの列(rule ∈ SELF_READINGS・rho は B の密度の配列か 'analytic') */
export function selfWeightsOf(S, rule, { eps, alpha = DECL.alphaMain, rho = 'analytic' } = {}) {
  if (!SELF_READINGS.includes(rule)) throw new RangeError('selfWeightsOf: 読みは ' + SELF_READINGS.join('・'));
  const N = S.N, out = new Float64Array(N);
  if (rule === 'none') return out;
  if (rule === 'C') return E5.selfWeights(S, alpha).w;
  if (rule === 'A') { for (let i = 0; i < N; i++) out[i] = selfWeightA(S.m[i], eps, alpha); return out; }
  for (let i = 0; i < N; i++) { const rr = rho === 'analytic' ? rhoPlummer(Math.hypot(S.x[i], S.y[i], S.z[i])) : rho[i]; out[i] = rr > 0 ? selfWeightB(S.m[i], rr, eps, alpha) : 0; }
  return out;
}

/* ───────── 速度の場(要素の速度を場の値にする —— 散らばりなし) ───────── */
export function applyField(S0, field, amp = null) {
  if (!FIELDS.includes(field)) throw new RangeError('applyField: 場は ' + FIELDS.join('・'));
  const S = E5.cloneState(S0); if (field === 'iso') return S;
  const A = amp === null ? DECL.fieldAmp[field] : amp;
  for (let i = 0; i < S.N; i++) {
    const x = S.x[i], y = S.y[i];
    let vx = 0, vy = 0;
    if (field === 'const') { vx = 0.3; vy = -0.2; S.vz[i] = 0.1; S.vx[i] = vx; S.vy[i] = vy; continue; }
    if (field === 'rigid') { vx = -A * y; vy = A * x; }
    else if (field === 'shear') { vx = A * y; }
    else { const R2 = x * x + y * y, Om = A * Math.pow(1 + R2, -0.75); vx = -Om * y; vy = Om * x; }
    S.vx[i] = vx; S.vy[i] = vy; S.vz[i] = 0;
  }
  return S;
}
/** 線形の場の連続の引きずり d(p) = A (p̄ − p)(p̄ = g(r) r̂ —— 剛体回転とずれ) */
export function continuumDrag(field, p, g, amp = null) {
  const A = amp === null ? DECL.fieldAmp[field] : amp, r = Math.hypot(p[0], p[1], p[2]);
  if (!(r > 0)) return [0, 0, 0];
  const f = (g - r) / r, q = [p[0] * f, p[1] * f, p[2] * f];   // p̄ − p
  if (field === 'rigid') return [-A * q[1], A * q[0], 0];
  if (field === 'shear') return [A * q[1], 0, 0];
  throw new RangeError('continuumDrag: 線形の場(rigid・shear)だけ');
}

/* ───────── 要素の並びの試し(一様な球 —— 格子の並びと乱数の並びで、全体の重みの連続の場との差) ───────── */
/** 一様な球(半径 1・総質量 1)を格子(間隔 2/nSide —— 原点を含む)と乱数(同じ個数・種)で埋め、中心の近く(r < 0.5)の受け手の全体の重み (w_ii + W_i)/W_連続 − 1 を none と B で */
export function arrangementCheck({ nSide, eps, seed = 1, alpha = DECL.alphaMain }) {
  if (!(Number.isInteger(nSide) && nSide >= 4 && fin(eps) && eps > 0)) throw new RangeError('arrangementCheck: nSide ≥ 4 の整数・ε > 0');
  const d = 2 / nSide, lat = [];
  for (let i = -nSide; i <= nSide; i++) for (let j = -nSide; j <= nSide; j++) for (let k = -nSide; k <= nSide; k++) { const p = [i * d, j * d, k * d]; if (Math.hypot(...p) <= 1) lat.push(p); }
  const n = lat.length, rng = rngOf(seed), ran = [];
  while (ran.length < n) { const p = [2 * rng() - 1, 2 * rng() - 1, 2 * rng() - 1]; if (Math.hypot(...p) <= 1) ran.push(p); }
  const m = 1 / n, rho = 3 / (4 * Math.PI), e2 = eps * eps, Kf = (q) => (alpha === 1 ? 1 / Math.sqrt(q + e2) : 1 / (q + e2));
  // 連続の場(一様な球の中の点 —— 動径の求積は continuumField と同じ型で r の関数に: 中心の近くは 4πρ∫u²K du を半径 1 − r まで + 外側の殻の寄与を数値で)
  const Wc = (p) => { const r = Math.hypot(...p); return 2 * Math.PI * quadPanels((rp) => rho * rp * rp * (alpha === 2 ? kernAngular(r, rp, eps).I0 : (() => { const a = r * r + rp * rp + e2, b = 2 * r * rp; return b < 1e-9 ? 2 / Math.sqrt(a) : 2 * (Math.sqrt(a + b) - Math.sqrt(a - b)) / b; })()), [0, Math.max(1e-9, r - 4 * eps), r, Math.min(1, r + 4 * eps), 1].filter((t, i, A) => t >= 0 && t <= 1 && (i === 0 || t > A[i - 1])), 24, 8); };
  const wB = selfWeightB(m, rho, eps, alpha), out = {};
  for (const [nm, P] of [['lattice', lat], ['random', ran]]) {
    let bN = 0, bB = 0, c = 0;
    for (let i = 0; i < n; i++) {
      if (Math.hypot(...P[i]) >= 0.5) continue;
      let W = 0; for (let j = 0; j < n; j++) if (j !== i) { const dx = P[j][0] - P[i][0], dy = P[j][1] - P[i][1], dz = P[j][2] - P[i][2]; W += m * Kf(dx * dx + dy * dy + dz * dz); }
      const w0 = Wc(P[i]); bN += W / w0 - 1; bB += (W + wB) / w0 - 1; c++;
    }
    out[nm] = { biasNone: bN / c, biasB: bB / c, nRecv: c };
  }
  return { nSide, n, eps, alpha, ...out, shareB: wB };
}

/* ───────── 1 要素 → 4 分割の場面(細分しても同じ積分を表すか) ───────── */
/** 要素の束(cells = [[{p, v, m}, …], …])から受け手(p・v・自己の重み)の引きずり —— 束の重みと Σ w v は対の木の和(4 分割を同じ積分の重みでビット同一にするため) */
export function cellDrag(at, v, cells, eps, alpha = DECL.alphaMain, selfW = 0) {
  const e2 = eps * eps, pairSum = (a) => { let b = a.slice(); while (b.length > 1) { const c = []; for (let i = 0; i < b.length; i += 2) c.push(i + 1 < b.length ? b[i] + b[i + 1] : b[i]); b = c; } return b[0] || 0; };
  let W = 0, Ux = 0, Uy = 0, Uz = 0;
  for (const cell of cells) {
    const ws = [], ux = [], uy = [], uz = [];
    for (const e of cell) { const dx = e.p[0] - at[0], dy = e.p[1] - at[1], dz = e.p[2] - at[2], q = dx * dx + dy * dy + dz * dz + e2, k = alpha === 1 ? 1 / Math.sqrt(q) : 1 / q, w = e.m * k; ws.push(w); ux.push(w * e.v[0]); uy.push(w * e.v[1]); uz.push(w * e.v[2]); }
    W += pairSum(ws); Ux += pairSum(ux); Uy += pairSum(uy); Uz += pairSum(uz);
  }
  const den = selfW + W;
  return { d: [(Ux - v[0] * W) / den, (Uy - v[1] * W) / den, (Uz - v[2] * W) / den], W };
}
/** 正四面体の頂点の向き(4 分割の子の位置 —— 親の中心から半径 b) */
export const TETRA = Object.freeze([[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]].map((u) => u.map((c) => c / Math.sqrt(3))));

/* ───────── 対の和の力(重力 + 保存する引きずり/中心の点/内の和)───────── */
function newF(N) { return { ax: new Float64Array(N), ay: new Float64Array(N), az: new Float64Array(N), pot: new Float64Array(N), dx: new Float64Array(N), dy: new Float64Array(N), dz: new Float64Array(N), W: new Float64Array(N), diss: new Float64Array(N), px: new Float64Array(N), py: new Float64Array(N), pz: new Float64Array(N), du: new Float64Array(N), rho: new Float64Array(N), Wbar: 0 }; }
/** 保存する引きずり(symFull・symCentral): d_i = Σ_j m_j K_ij Δ_ij / W̄・対の散逸の分け前 diss_i = ½ Σ_j m_j K_ij (Δ_ij·(v_i − v_j))/W̄ ≥ 0(m_i を掛けると散逸の率) */
function symDrag(S, eps, alpha, kind, selfW, F) {
  const N = S.N, e2 = eps * eps, { x, y, z, vx, vy, vz, m } = S, cen = kind === 'symCentral';
  F.dx.fill(0); F.dy.fill(0); F.dz.fill(0); F.W.fill(0); F.diss.fill(0);
  for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) { const ddx = x[j] - x[i], ddy = y[j] - y[i], ddz = z[j] - z[i], q = ddx * ddx + ddy * ddy + ddz * ddz + e2, k = alpha === 1 ? 1 / Math.sqrt(q) : 1 / q; F.W[i] += m[j] * k; F.W[j] += m[i] * k; }
  let Mt = 0, Ws = 0; for (let i = 0; i < N; i++) { Mt += m[i]; Ws += m[i] * ((selfW ? selfW[i] : 0) + F.W[i]); }
  const Wbar = Ws / Mt; F.Wbar = Wbar;
  for (let i = 0; i < N; i++) {
    for (let j = i + 1; j < N; j++) {
      const ddx = x[j] - x[i], ddy = y[j] - y[i], ddz = z[j] - z[i], r2 = ddx * ddx + ddy * ddy + ddz * ddz, q = r2 + e2, k = (alpha === 1 ? 1 / Math.sqrt(q) : 1 / q) / Wbar;
      let gx = vx[j] - vx[i], gy = vy[j] - vy[i], gz = vz[j] - vz[i];
      if (cen) { const r = Math.sqrt(r2); if (!(r > 0)) continue; const ux = ddx / r, uy = ddy / r, uz = ddz / r, pr = gx * ux + gy * uy + gz * uz; gx = pr * ux; gy = pr * uy; gz = pr * uz; }
      F.dx[i] += m[j] * k * gx; F.dy[i] += m[j] * k * gy; F.dz[i] += m[j] * k * gz; F.dx[j] -= m[i] * k * gx; F.dy[j] -= m[i] * k * gy; F.dz[j] -= m[i] * k * gz;
      const dv = -(gx * (vx[j] - vx[i]) + gy * (vy[j] - vy[i]) + gz * (vz[j] - vz[i]));   // Δ·(v_i − v_j) = −Δ·(v_j − v_i) ≤ 0 → 散逸 = −k·(…) ≥ 0
      F.diss[i] += 0.5 * m[j] * k * -dv; F.diss[j] += 0.5 * m[i] * k * -dv;
    }
  }
}
/** 中心の点(spin: 0 か L_z/Σ m R²)・内の和: C = v_src + s ẑ × (p_i − cm)・重み M_src K(r_i)・d_i = W_c (C − v_i)/(w_ii + W_c) */
function pointDrag(S, eps, alpha, kind, selfW, F, spinMode) {
  const N = S.N, e2 = eps * eps, { x, y, z, vx, vy, vz, m } = S;
  let M = 0, cx = 0, cy = 0, cz = 0, ux = 0, uy = 0, uz = 0;
  for (let i = 0; i < N; i++) { M += m[i]; cx += m[i] * x[i]; cy += m[i] * y[i]; cz += m[i] * z[i]; ux += m[i] * vx[i]; uy += m[i] * vy[i]; uz += m[i] * vz[i]; }
  cx /= M; cy /= M; cz /= M; ux /= M; uy /= M; uz /= M;
  const rr = new Float64Array(N), order = new Array(N);
  for (let i = 0; i < N; i++) { rr[i] = Math.hypot(x[i] - cx, y[i] - cy, z[i] - cz); order[i] = i; }
  F.dx.fill(0); F.dy.fill(0); F.dz.fill(0); F.W.fill(0);
  const put = (i, Ms, vsx, vsy, vsz, s) => {
    if (!(Ms > 0)) return;
    const X = x[i] - cx, Y = y[i] - cy, q = rr[i] * rr[i] + e2, k = alpha === 1 ? 1 / Math.sqrt(q) : 1 / q, Wc = Ms * k, den = (selfW ? selfW[i] : 0) + Wc;
    const Cx = vsx - s * Y, Cy = vsy + s * X, Cz = vsz;
    F.W[i] = Wc; F.dx[i] = Wc * (Cx - vx[i]) / den; F.dy[i] = Wc * (Cy - vy[i]) / den; F.dz[i] = Wc * (Cz - vz[i]) / den;
  };
  if (kind === 'center') {
    let Lz = 0, I = 0; for (let i = 0; i < N; i++) { const X = x[i] - cx, Y = y[i] - cy; Lz += m[i] * (X * (vy[i] - uy) - Y * (vx[i] - ux)); I += m[i] * (X * X + Y * Y); }
    const s = spinMode === 'L' ? Lz / I : 0;
    for (let i = 0; i < N; i++) put(i, M, ux, uy, uz, s);
    return;
  }
  order.sort((p, q) => rr[p] - rr[q] || p - q);
  let Min = 0, px = 0, py = 0, pz = 0, Lz = 0, I = 0;
  for (const i of order) {
    if (Min > 0) { const vsx = px / Min, vsy = py / Min, vsz = pz / Min; put(i, Min, vsx, vsy, vsz, I > 0 ? Lz / I : 0); }
    const X = x[i] - cx, Y = y[i] - cy; Min += m[i]; px += m[i] * vx[i]; py += m[i] * vy[i]; pz += m[i] * vz[i]; Lz += m[i] * (X * vy[i] - Y * vx[i]); I += m[i] * (X * X + Y * Y);
  }
}
/** 三次のスプラインの核(台 2h)と dW/dr */
function sphW(r, h) { const q = r / h, c = 1 / (Math.PI * h * h * h); return q < 1 ? c * (1 - 1.5 * q * q + 0.75 * q * q * q) : q < 2 ? c * 0.25 * (2 - q) ** 3 : 0; }
function sphdW(r, h) { const q = r / h, c = 1 / (Math.PI * h * h * h * h); return q < 1 ? c * (-3 * q + 2.25 * q * q) : q < 2 ? c * -0.75 * (2 - q) ** 2 : 0; }
/** 要素の中の散らばり Π の圧力(密度・加速度・du/dt —— 固定の h) */
function piForces(S, u, h, F) {
  const N = S.N, { x, y, z, vx, vy, vz, m } = S;
  F.px.fill(0); F.py.fill(0); F.pz.fill(0); F.du.fill(0);
  for (let i = 0; i < N; i++) F.rho[i] = m[i] * sphW(0, h);
  for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) { const r = Math.hypot(x[j] - x[i], y[j] - y[i], z[j] - z[i]); if (r < 2 * h) { const w = sphW(r, h); F.rho[i] += m[j] * w; F.rho[j] += m[i] * w; } }
  for (let i = 0; i < N; i++) {
    const Pi = (2 / 3) * F.rho[i] * u[i], ai = Pi / (F.rho[i] * F.rho[i]);
    for (let j = i + 1; j < N; j++) {
      const ddx = x[i] - x[j], ddy = y[i] - y[j], ddz = z[i] - z[j], r = Math.sqrt(ddx * ddx + ddy * ddy + ddz * ddz);
      if (!(r < 2 * h) || !(r > 0)) continue;
      const dw = sphdW(r, h) / r, gx = dw * ddx, gy = dw * ddy, gz = dw * ddz;   // ∇_i W_ij
      const Pj = (2 / 3) * F.rho[j] * u[j], aj = Pj / (F.rho[j] * F.rho[j]), c = ai + aj;
      F.px[i] -= m[j] * c * gx; F.py[i] -= m[j] * c * gy; F.pz[i] -= m[j] * c * gz; F.px[j] += m[i] * c * gx; F.py[j] += m[i] * c * gy; F.pz[j] += m[i] * c * gz;
      const vdg = (vx[i] - vx[j]) * gx + (vy[i] - vy[j]) * gy + (vz[i] - vz[j]) * gz;
      F.du[i] += ai * m[j] * vdg; F.du[j] += aj * m[i] * vdg;
    }
  }
}
/** 力の評価(重力 + 引きずり + Π)。spec = { drag, alpha, eps, selfW, pi, spinMode }・u は内部のエネルギー(pi のときだけ) */
export function evalForces(S, spec, u = null, F = null) {
  const { drag = 'none', alpha = DECL.alphaMain, eps, selfW = null, pi = false, spinMode = '0' } = spec;
  if (!DRAG_KINDS.includes(drag)) throw new RangeError('evalForces: 引きずりの型は ' + DRAG_KINDS.join('・'));
  const N = S.N; if (!F) F = newF(N);
  if (drag === 'row') { const G = E5.forces(S, eps, true, alpha, selfW, F); void G; }
  else {
    E5.forces(S, eps, false, alpha, null, F);
    if (drag === 'symFull' || drag === 'symCentral') symDrag(S, eps, alpha, drag, selfW, F);
    else if (drag === 'center' || drag === 'inner') pointDrag(S, eps, alpha, drag, selfW, F, spinMode);
  }
  if (pi) piForces(S, u, spec.sphH || DECL.sphH, F);
  return F;
}

/* ───────── 量の測り(第335便f の measure + 運動量・散らばり・内部のエネルギー) ───────── */
export function measureFluid(S, F, ref, u = null) {
  const q = E5.measure(S, F, ref), N = S.N;
  let Px = 0, Py = 0, Pz = 0, M = 0, U = 0;
  for (let i = 0; i < N; i++) { Px += S.m[i] * S.vx[i]; Py += S.m[i] * S.vy[i]; Pz += S.m[i] * S.vz[i]; M += S.m[i]; if (u) U += S.m[i] * u[i]; }
  // 近傍の平均の速度 V_i(三次のスプラインの核・h_sph —— 自分を含む)のまわりの散らばり σ²_pec と要素の中の σ²_int = (2/3)ū
  const h = DECL.sphH; let s2 = 0;
  for (let i = 0; i < N; i++) {
    let w0 = S.m[i] * sphW(0, h), Vx = w0 * S.vx[i], Vy = w0 * S.vy[i], Vz = w0 * S.vz[i], Wt = w0;
    for (let j = 0; j < N; j++) { if (j === i) continue; const r = Math.hypot(S.x[j] - S.x[i], S.y[j] - S.y[i], S.z[j] - S.z[i]); if (r < 2 * h) { const w = S.m[j] * sphW(r, h); Wt += w; Vx += w * S.vx[j]; Vy += w * S.vy[j]; Vz += w * S.vz[j]; } }
    Vx /= Wt; Vy /= Wt; Vz /= Wt; s2 += S.m[i] * ((S.vx[i] - Vx) ** 2 + (S.vy[i] - Vy) ** 2 + (S.vz[i] - Vz) ** 2);
  }
  q.P = [Px, Py, Pz]; q.Uint = U; q.sig2pec = s2 / (3 * M); q.sig2int = u ? (2 / 3) * U / M : 0;
  return q;
}

/* ───────── 積分(蛙跳び KDK —— 第335便f の手順と同じ順) ───────── */
/**
 * spec = { action: grav|push|vel, drag, self: SELF_READINGS, rhoMode: analytic|knn, alpha, eps, gamma, h, steps, every, implicit, iters, pi, spinMode, u0 }。
 * 戻り値 { series:[{t, q}], ledger:{ E0, E1, U0, U1, Wdrag, Qrad, resid }, shareMean(時刻 0 の w_ii/(w_ii + W_i) の平均), state(最後の状態), evals }
 */
export function integrateFluid(S0, spec, scales) {
  const { action, drag = 'row', self = 'none', rhoMode = 'knn', alpha = DECL.alphaMain, eps, gamma = 0, h, steps, every, implicit = false, iters = DECL.implicitIters, pi = false, spinMode = '0', u0 = 0 } = spec;
  if (!['grav', 'push', 'vel'].includes(action)) throw new RangeError('integrateFluid: 作用は grav・push・vel');
  if (!SELF_READINGS.includes(self)) throw new RangeError('integrateFluid: 自己の重みの読み');
  if (!(fin(h) && h > 0 && Number.isInteger(steps) && steps > 0 && Number.isInteger(every) && every > 0 && steps % every === 0)) throw new RangeError('integrateFluid: h > 0・steps は every の倍数');
  if (action === 'vel' && drag !== 'row') throw new RangeError('integrateFluid: 速度の場は row だけ');
  if (pi && !(action === 'push' && (drag === 'symFull' || drag === 'symCentral'))) throw new RangeError('integrateFluid: Π は押しの保存する型(symFull・symCentral)だけ');
  const S = E5.cloneState(S0), N = S.N, dk = action === 'grav' ? 'none' : drag, g = action === 'push' ? gamma : 0;
  const u = pi ? new Float64Array(N).fill(u0) : null;
  const swOf = () => (self === 'none' ? null : selfWeightsOf(S, self, { eps, alpha, rho: self === 'B' && rhoMode === 'knn' ? knnDensity(S) : 'analytic' }));
  let sw = action === 'grav' ? null : swOf();
  const fs = { drag: dk, alpha, eps, selfW: sw, pi, spinMode };
  let F = evalForces(S, fs, u), G = newF(N), evals = 1;
  let shareMean = null;
  if (sw) { shareMean = 0; for (let i = 0; i < N; i++) shareMean += sw[i] / (sw[i] + F.W[i]); shareMean /= N; }
  const q0 = measureFluid(S, F, null, u), ref = { E0: q0.E, L0: q0.L, cm0: q0.cm, Lscale: scales.rh * scales.vrms, rh: scales.rh };
  const series = [{ t: 0, q: measureFluid(S, F, ref, u) }];
  let Wdrag = 0, Qrad = 0, iterResid = 0;
  const U0 = u ? q0.Uint : 0;
  const kick = (Fk) => {
    let w = 0;
    for (let i = 0; i < N; i++) {
      const bx = S.vx[i], by = S.vy[i], bz = S.vz[i], pxx = pi ? Fk.px[i] : 0, pyy = pi ? Fk.py[i] : 0, pzz = pi ? Fk.pz[i] : 0;
      S.vx[i] = bx + 0.5 * h * (Fk.ax[i] + g * Fk.dx[i] + pxx); S.vy[i] = by + 0.5 * h * (Fk.ay[i] + g * Fk.dy[i] + pyy); S.vz[i] = bz + 0.5 * h * (Fk.az[i] + g * Fk.dz[i] + pzz);
      if (g) w += S.m[i] * g * (Fk.dx[i] * (bx + S.vx[i]) + Fk.dy[i] * (by + S.vy[i]) + Fk.dz[i] * (bz + S.vz[i])) * 0.25 * h;
    }
    if (pi) {
      // 押しの仕事(負 —— 散逸)を対の分け前の比で u へ(合計 = −w)・圧力の du/dt を半步
      let ds = 0; for (let i = 0; i < N; i++) ds += S.m[i] * Fk.diss[i];
      for (let i = 0; i < N; i++) u[i] += 0.5 * h * Fk.du[i] + (ds > 0 ? (-w) * Fk.diss[i] / ds : 0);
    } else if (g) Qrad -= w;
    return w;
  };
  const dx0 = new Float64Array(N), dy0 = new Float64Array(N), dz0 = new Float64Array(N), ax0 = new Float64Array(N), ay0 = new Float64Array(N), az0 = new Float64Array(N);
  const vel = action === 'vel';
  let T = vel && implicit ? E5.cloneState(S) : null, FT = vel && implicit ? newF(N) : null;
  for (let s = 1; s <= steps; s++) {
    Wdrag += kick(F);
    ax0.set(F.ax); ay0.set(F.ay); az0.set(F.az); dx0.set(F.dx); dy0.set(F.dy); dz0.set(F.dz);
    if (vel && implicit) {
      // 陰の中点: p_{n+1} = p_n + h (v + d((p_n + p_{n+1})/2, v)) —— 予測は 1 步遅れの d
      const x0 = Float64Array.from(S.x), y0 = Float64Array.from(S.y), z0 = Float64Array.from(S.z);
      for (let i = 0; i < N; i++) { S.x[i] = x0[i] + h * (S.vx[i] + dx0[i]); S.y[i] = y0[i] + h * (S.vy[i] + dy0[i]); S.z[i] = z0[i] + h * (S.vz[i] + dz0[i]); }
      let lastChg = 0, vr = 0; for (let i = 0; i < N; i++) vr += S.vx[i] ** 2 + S.vy[i] ** 2 + S.vz[i] ** 2; vr = Math.sqrt(vr / N);
      for (let it = 0; it < iters; it++) {
        for (let i = 0; i < N; i++) { T.x[i] = 0.5 * (x0[i] + S.x[i]); T.y[i] = 0.5 * (y0[i] + S.y[i]); T.z[i] = 0.5 * (z0[i] + S.z[i]); T.vx[i] = S.vx[i]; T.vy[i] = S.vy[i]; T.vz[i] = S.vz[i]; T.m[i] = S.m[i]; }
        evalForces(T, fs, u, FT); evals++;
        let chg = 0;
        for (let i = 0; i < N; i++) { dx0[i] = FT.dx[i]; dy0[i] = FT.dy[i]; dz0[i] = FT.dz[i]; const nx = x0[i] + h * (S.vx[i] + dx0[i]), ny = y0[i] + h * (S.vy[i] + dy0[i]), nz = z0[i] + h * (S.vz[i] + dz0[i]); chg = Math.max(chg, Math.hypot(nx - S.x[i], ny - S.y[i], nz - S.z[i])); S.x[i] = nx; S.y[i] = ny; S.z[i] = nz; }
        lastChg = chg;
      }
      iterResid = Math.max(iterResid, lastChg / (h * Math.max(vr, 1e-300)));   // 最後の反復の位置の変化の最大 ÷ (h × 速さの RMS)
    } else for (let i = 0; i < N; i++) { S.x[i] += h * (S.vx[i] + (vel ? dx0[i] : 0)); S.y[i] += h * (S.vy[i] + (vel ? dy0[i] : 0)); S.z[i] += h * (S.vz[i] + (vel ? dz0[i] : 0)); }
    if (sw && self === 'B' && rhoMode === 'knn' && s % every === 0) { sw = swOf(); fs.selfW = sw; }
    G = evalForces(S, fs, u, G); evals++;
    if (vel) { let w = 0; for (let i = 0; i < N; i++) w -= S.m[i] * 0.5 * ((ax0[i] + G.ax[i]) * dx0[i] + (ay0[i] + G.ay[i]) * dy0[i] + (az0[i] + G.az[i]) * dz0[i]) * h; Wdrag += w; Qrad -= w; }
    const tmp = F; F = G; G = tmp;
    Wdrag += kick(F);
    if (s % every === 0) series.push({ t: s * h, q: measureFluid(S, F, ref, u) });
  }
  const qe = series[series.length - 1].q, U1 = u ? qe.Uint : 0;
  return { series, ledger: { E0: q0.E, E1: qe.E, U0, U1, Wdrag, Qrad, resid: (qe.E + U1 + Qrad - q0.E - U0) / Math.abs(q0.E), P0: q0.P, P1: qe.P, L0: q0.L, L1: qe.L }, shareMean, state: S, evals, iterResid: vel && implicit ? iterResid : null };
}

/* ───────── 解像度の試し(静的 —— 同じ滑らかな密度と速度の場) ───────── */
/** 1 本(N・種・ε・α・読み・場): 自己の分け前・全体の重みの連続の場との差・引きずりの大きさ・線形の場の連続の引きずりとの差 */
export function resolutionRow({ S, field, rule, eps, alpha = DECL.alphaMain, table = null, rho = 'analytic' }) {
  const V = applyField(S, field), sw = selfWeightsOf(V, rule, { eps, alpha, rho }), F = E5.forces(V, eps, true, alpha, rule === 'none' ? null : sw);
  const N = V.N;
  let sh = 0, wErr = 0, wSum = 0, wN = 0, d2 = 0, v2 = 0, e2 = 0, c2 = 0, dmax = 0;
  const shares = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    const s = sw[i] / (sw[i] + F.W[i]); shares[i] = s; sh += s;
    d2 += F.dx[i] ** 2 + F.dy[i] ** 2 + F.dz[i] ** 2; v2 += V.vx[i] ** 2 + V.vy[i] ** 2 + V.vz[i] ** 2;
    dmax = Math.max(dmax, Math.abs(F.dx[i]), Math.abs(F.dy[i]), Math.abs(F.dz[i]));
    if (table && alpha === 2) {
      const r = Math.hypot(V.x[i], V.y[i], V.z[i]), c = table.at(r);
      const dw = (sw[i] + F.W[i]) / c.W - 1; wErr += dw * dw; wSum += dw; wN++;
      if (field === 'rigid' || field === 'shear') { const dc = continuumDrag(field, [V.x[i], V.y[i], V.z[i]], c.g); e2 += (F.dx[i] - dc[0]) ** 2 + (F.dy[i] - dc[1]) ** 2 + (F.dz[i] - dc[2]) ** 2; c2 += dc[0] ** 2 + dc[1] ** 2 + dc[2] ** 2; }
    }
  }
  const sorted = Array.from(shares).sort((p, q) => p - q);
  return { shareMean: sh / N, shareMed: sorted[N >> 1], wTotRms: wN ? Math.sqrt(wErr / wN) : null, wTotBias: wN ? wSum / wN : null, dOverV: Math.sqrt(d2 / v2), contErr: c2 > 0 ? Math.sqrt(e2 / c2) : null, dmax };
}

/* ───────── 環のヒント ───────── */
/** 中心の位置と速度(単体: 原点に静止/連星: 0.5 + 0.5・離れ a_b・円軌道 —— 角速度 √(1/a_b³)) */
export function centerOf(kind, t, sep = DECL.ring.binarySep) {
  if (kind === 'single') return [{ m: 1, p: [0, 0, 0], v: [0, 0, 0] }];
  if (kind !== 'binary') throw new RangeError('centerOf: single か binary');
  const Om = Math.sqrt(1 / (sep * sep * sep)), c = Math.cos(Om * t), s = Math.sin(Om * t), r = sep / 2, w = Om * r;
  return [{ m: 0.5, p: [r * c, r * s, 0], v: [-w * s, w * c, 0] }, { m: 0.5, p: [-r * c, -r * s, 0], v: [w * s, -w * c, 0] }];
}
/** 環の初期の状態(μ = 1・長半径 一様・e と傾きは Rayleigh・位相は一様 —— 種を宣言) */
export function ringInit({ n = DECL.ring.n, seed, aMin = DECL.ring.aMin, aMax = DECL.ring.aMax, sigE = DECL.ring.sigE, sigI = DECL.ring.sigI }) {
  const rng = rngOf(seed), P = { n, x: new Float64Array(n), y: new Float64Array(n), z: new Float64Array(n), vx: new Float64Array(n), vy: new Float64Array(n), vz: new Float64Array(n) };
  const ray = (sg) => sg * Math.sqrt(-2 * Math.log(1 - rng()));
  for (let k = 0; k < n; k++) {
    const a = aMin + (aMax - aMin) * rng(), e = Math.min(0.5, ray(sigE)), inc = ray(sigI), Om = 2 * Math.PI * rng(), om = 2 * Math.PI * rng(), M = 2 * Math.PI * rng();
    let E = M; for (let it = 0; it < 50; it++) E -= (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
    const xp = a * (Math.cos(E) - e), yp = a * Math.sqrt(1 - e * e) * Math.sin(E), rr = a * (1 - e * Math.cos(E)), nn = Math.sqrt(1 / (a * a * a));
    const vxp = -a * nn * Math.sin(E) * a / rr, vyp = a * nn * Math.sqrt(1 - e * e) * Math.cos(E) * a / rr;
    const co = Math.cos(om), so = Math.sin(om), cO = Math.cos(Om), sO = Math.sin(Om), ci = Math.cos(inc), si = Math.sin(inc);
    const R = [[cO * co - sO * so * ci, -cO * so - sO * co * ci], [sO * co + cO * so * ci, -sO * so + cO * co * ci], [so * si, co * si]];
    P.x[k] = R[0][0] * xp + R[0][1] * yp; P.y[k] = R[1][0] * xp + R[1][1] * yp; P.z[k] = R[2][0] * xp + R[2][1] * yp;
    P.vx[k] = R[0][0] * vxp + R[0][1] * vyp; P.vy[k] = R[1][0] * vxp + R[1][1] * vyp; P.vz[k] = R[2][0] * vxp + R[2][1] * vyp;
  }
  return P;
}
/** 接触の要素(重心のまわり・μ = 1): e と傾き(z 軸から)と長半径 */
export function oscOf(x, y, z, vx, vy, vz) {
  const r = Math.hypot(x, y, z), v2 = vx * vx + vy * vy + vz * vz, hx = y * vz - z * vy, hy = z * vx - x * vz, hz = x * vy - y * vx, hh = Math.hypot(hx, hy, hz);
  const ex = (vy * hz - vz * hy) - x / r, ey = (vz * hx - vx * hz) - y / r, ez = (vx * hy - vy * hx) - z / r;
  return { e: Math.hypot(ex, ey, ez), inc: Math.acos(Math.max(-1, Math.min(1, hz / hh))), a: 1 / (2 / r - v2), hz };
}
/** 環の要素の自己の重み(B —— 環の体積 2π ā Δa · 2 ā σ_i を n 等分した体積の球・環の質量は引きずりの重みだけ) */
export function ringSelfB(n = DECL.ring.n, R = DECL.ring) {
  const am = 0.5 * (R.aMin + R.aMax), vol = 2 * Math.PI * am * (R.aMax - R.aMin) * 2 * am * R.sigI, rho = R.massRing / vol;
  return selfWeightB(R.massRing / n, rho, R.epsRing, 2);
}
/**
 * 軸引きずりの回転率(単一の源 —— 原点・質量 M・自転 s ẑ・重み W = M/r²・自己の重み K): f = W/(K + W)・f′ = −2 f (1 − f)/r。
 * X2(回転率の全部 ½∇×U): ω = f s + (f′/(2r))(s r² − p (p·s))/X1(近い面と遠い面の差分だけ): ω = X2 − ½ f s(赤道面で ½ s (f + r f′))
 */
export function axialOmega(p, spin, M, K, reading) {
  if (!AXIAL_READINGS.includes(reading)) throw new RangeError('axialOmega: 読みは X1・X2');
  const r = Math.hypot(p[0], p[1], p[2]), W = M / (r * r), f = W / (K + W), fp = -2 * f * (1 - f) / r, ps = p[2] * spin, c = fp / (2 * r);
  const o = [c * (-p[0] * ps), c * (-p[1] * ps), f * spin + c * (spin * r * r - p[2] * ps)];
  if (reading === 'X1') o[2] -= 0.5 * f * spin;
  return o;
}
/**
 * 環の 1 本: spec = { center: single|binary, col: RING_COLS, self: none|B, gamma, spin, n, orbits, stepsPerOrbit, seed }。
 * 戻り値 { perOrbit:[{ t, sigE, sigI, aMean, hzMean }], rateE, rateI(ln σ の公転あたりの傾き —— 最小二乗), betaMin, betaMax, dA, dHz }
 */
export function ringRun({ center = 'single', col = 'grav', self = 'none', gamma = 0, spin = DECL.ring.spin, n = DECL.ring.n, orbits = 20, stepsPerOrbit = 400, seed = 1 }) {
  if (!RING_COLS.includes(col)) throw new RangeError('ringRun: 列は ' + RING_COLS.join('・'));
  if (!['none', 'B', 'K9'].includes(self)) throw new RangeError('ringRun: 自己の重みの読みは none・B・K9');
  const P = ringInit({ n, seed }), useT = col.includes('T'), useR = col.includes('R'), useA = col.includes('A'), useX = col === 'X1' || col === 'X2' ? col : null, R = DECL.ring;
  const mE = R.massRing / n, e2 = R.epsRing * R.epsRing, sw = self === 'B' ? ringSelfB(n) : self === 'K9' ? R.Kdom : 0;
  let wMin = Infinity, wMax = -Infinity, wEq = 0, nEq = 0;
  const ax = new Float64Array(n), ay = new Float64Array(n), az = new Float64Array(n), Wp = new Float64Array(n);
  let bMin = Infinity, bMax = -Infinity;
  const acc = (t) => {
    const C = centerOf(center, t);
    for (let k = 0; k < n; k++) {
      let gx = 0, gy = 0, gz = 0, Ws = 0, Ux = 0, Uy = 0, Uz = 0;
      for (const c of C) {
        const dx = P.x[k] - c.p[0], dy = P.y[k] - c.p[1], dz = P.z[k] - c.p[2], r2 = dx * dx + dy * dy + dz * dz, ir = 1 / Math.sqrt(r2), ir3 = ir * ir * ir;
        gx -= c.m * dx * ir3; gy -= c.m * dy * ir3; gz -= c.m * dz * ir3;
        const w = c.m / r2; Ws += w; Ux += w * (c.v[0] - spin * dy); Uy += w * (c.v[1] + spin * dx); Uz += w * c.v[2];
      }
      const den = sw + Ws, beta = Ws / den;
      if (beta < bMin) bMin = beta; if (beta > bMax) bMax = beta;
      if (useT) { gx += gamma * (Ux / den - P.vx[k] * beta); gy += gamma * (Uy / den - P.vy[k] * beta); gz += gamma * (Uz / den - P.vz[k] * beta); }   // d = Σw(c − v)/(w_self + Σw)
      if (useR) { const Rr = Math.hypot(P.x[k], P.y[k]); if (Rr > 0) { const V = t1Twist({ rho: Rr, z: P.z[k], sd: spin, beta }).par; gx += gamma * V * (-P.y[k] / Rr); gy += gamma * V * (P.x[k] / Rr); } }
      if (useX) {   // 軸引きずり: 連星は重心の 1 つの源(質量 1・自転 s)とみなして ω_ax を出す(宣言 —— 近似)
        const o = axialOmega([P.x[k], P.y[k], P.z[k]], spin, 1, sw, useX), Rr = Math.hypot(P.x[k], P.y[k]), Oc = Math.pow(Rr, -1.5);
        const ux = P.vx[k] + Oc * P.y[k], uy = P.vy[k] - Oc * P.x[k], uz = P.vz[k];
        gx += R.cAx * (o[1] * uz - o[2] * uy); gy += R.cAx * (o[2] * ux - o[0] * uz); gz += R.cAx * (o[0] * uy - o[1] * ux);
        if (o[2] < wMin) wMin = o[2]; if (o[2] > wMax) wMax = o[2]; wEq += o[2]; nEq++;
      }
      ax[k] = gx; ay[k] = gy; az[k] = gz;
    }
    if (useA) {
      Wp.fill(0);
      for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { const dx = P.x[j] - P.x[i], dy = P.y[j] - P.y[i], dz = P.z[j] - P.z[i], k = 1 / (dx * dx + dy * dy + dz * dz + e2); Wp[i] += mE * k; Wp[j] += mE * k; }
      let Wb = 0; for (let i = 0; i < n; i++) Wb += sw + Wp[i]; Wb /= n;
      for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
        const dx = P.x[j] - P.x[i], dy = P.y[j] - P.y[i], dz = P.z[j] - P.z[i], r2 = dx * dx + dy * dy + dz * dz, r = Math.sqrt(r2), k = gamma * mE / ((r2 + e2) * Wb);
        const pr = ((P.vx[j] - P.vx[i]) * dx + (P.vy[j] - P.vy[i]) * dy + (P.vz[j] - P.vz[i]) * dz) / r2;
        ax[i] += k * pr * dx; ay[i] += k * pr * dy; az[i] += k * pr * dz; ax[j] -= k * pr * dx; ay[j] -= k * pr * dy; az[j] -= k * pr * dz; void r;
      }
    }
  };
  const P0 = 2 * Math.PI, h = P0 / stepsPerOrbit, perOrbit = [];
  const snap = (t) => { let se = 0, si = 0, am = 0, hz = 0; for (let k = 0; k < n; k++) { const o = oscOf(P.x[k], P.y[k], P.z[k], P.vx[k], P.vy[k], P.vz[k]); se += o.e * o.e; si += o.inc * o.inc; am += o.a; hz += o.hz; } perOrbit.push({ t, sigE: Math.sqrt(se / n), sigI: Math.sqrt(si / n), aMean: am / n, hzMean: hz / n }); };
  let t = 0; acc(t); snap(0);
  for (let s = 1; s <= orbits * stepsPerOrbit; s++) {
    for (let k = 0; k < n; k++) { P.vx[k] += 0.5 * h * ax[k]; P.vy[k] += 0.5 * h * ay[k]; P.vz[k] += 0.5 * h * az[k]; }
    for (let k = 0; k < n; k++) { P.x[k] += h * P.vx[k]; P.y[k] += h * P.vy[k]; P.z[k] += h * P.vz[k]; }
    t = s * h; acc(t);
    for (let k = 0; k < n; k++) { P.vx[k] += 0.5 * h * ax[k]; P.vy[k] += 0.5 * h * ay[k]; P.vz[k] += 0.5 * h * az[k]; }
    if (s % stepsPerOrbit === 0) snap(t);
  }
  const slope = (key) => { const ys = perOrbit.map((o) => Math.log(o[key])), xs = perOrbit.map((_, i) => i), nX = xs.length, mx = xs.reduce((a, b) => a + b, 0) / nX, my = ys.reduce((a, b) => a + b, 0) / nX; let sxy = 0, sxx = 0; for (let i = 0; i < nX; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; } return sxy / sxx; };
  const L = perOrbit[perOrbit.length - 1], F0 = perOrbit[0];
  return { perOrbit, rateE: slope('sigE'), rateI: slope('sigI'), betaMin: bMin, betaMax: bMax, dA: L.aMean - F0.aMean, dHz: L.hzMean - F0.hzMean, omegaZ: nEq ? { min: wMin / spin, max: wMax / spin, mean: wEq / nEq / spin } : null, ratioE: L.sigE / F0.sigE, ratioI: L.sigI / F0.sigI };
}

/* ───────── 純関数の場面(門) ───────── */
export function pureScenes() {
  const S = {};
  // ① 1 要素 → 4 分割(一定の速度・同じ積分の重み —— 子は親と同じ位置で質量 m/4): 受け手 64 点の d と W がビット同一/子を正四面体に広げた差/B の自己の重みの細分の差
  {
    const A = E5.sampleModel({ model: 'plummer', N: 96, seed: 31 }).S, eps = 0.05, rec = [], src = [];
    for (let i = 0; i < 96; i++) (i < 64 ? rec : src).push({ p: [A.x[i], A.y[i], A.z[i]], v: [A.vx[i], A.vy[i], A.vz[i]], m: A.m[i] });
    const parent = src.map((e) => [e]), kid = src.map((e) => [0, 1, 2, 3].map(() => ({ p: e.p, v: e.v, m: e.m / 4 })));
    let same = true; for (const r of rec) { const a = cellDrag(r.p, r.v, parent, eps), b = cellDrag(r.p, r.v, kid, eps); if (!(a.W === b.W && a.d.every((x, k) => x === b.d[k]))) same = false; }
    // 広げた子(親の体積の球の半径 R の半分の距離 —— 解析の密度)
    let spread = 0; const spreads = [];
    const spr = src.map((e) => { const rr = rhoPlummer(Math.hypot(...e.p)), R = Math.cbrt(3 * e.m / (4 * Math.PI * rr)); return TETRA.map((u) => ({ p: [e.p[0] + 0.5 * R * u[0], e.p[1] + 0.5 * R * u[1], e.p[2] + 0.5 * R * u[2]], v: e.v, m: e.m / 4 })); });
    for (const r of rec) { const a = cellDrag(r.p, r.v, parent, eps), b = cellDrag(r.p, r.v, spr, eps); const dv = Math.abs(b.W / a.W - 1); spreads.push(dv); spread = Math.max(spread, dv); }
    spreads.sort((p, q) => p - q);
    // B の自己の重み: 親の w^B(m, ρ) と 子 1 つの w^B(m/4, ρ) + 兄弟 3 つの (m/4)K(距離 R·√(8/3)/2 —— 正四面体の辺) の比(ε 0.05・0.01・0)
    const sub = [0.05, 0.01, 0].map((e) => { const m = 1 / 512, rho = rhoPlummer(1), R = Math.cbrt(3 * m / (4 * Math.PI * rho)), b = 0.5 * R, edge = b * Math.sqrt(8 / 3), K = 1 / (edge * edge + e * e); return { eps: e, ratio: (selfWeightB(m / 4, rho, e) + 3 * (m / 4) * K) / selfWeightB(m, rho, e) }; });
    S.split = { same, nRec: rec.length, spread, spreadMed: spreads[spreads.length >> 1], sub };
  }
  // ② row の積分器が第335便f の integrate と同じ(N 64・40 步・押し γ 2・速度の場 —— 自己なし)
  {
    const A = E5.sampleModel({ model: 'plummer', N: 64, seed: 41 }).S, sc = E5.scalesOf('plummer');
    let maxD = 0;
    for (const action of ['push', 'vel', 'grav']) {
      const sp = { action, alpha: 2, self: 'none', gamma: 2, eps: 0.05, h: 0.01, steps: 40, every: 20 };
      const R0 = E5.integrate(A, sp, sc), R1 = integrateFluid(A, Object.assign({ drag: 'row' }, sp), sc);
      for (let k = 0; k < R0.series.length; k++) for (const key of E5.QKEYS) maxD = Math.max(maxD, R0.series[k].q[key] === R1.series[k].q[key] ? 0 : Infinity);
      maxD = Math.max(maxD, R0.ledger.Wdrag === R1.ledger.Wdrag ? 0 : Infinity);
    }
    S.rowSame = { maxD };
  }
  // ③ 保存する型の帳簿(N 64・40 步・γ 5): 運動量(symFull・symCentral)・角運動量(symCentral)・散逸 ≥ 0 / row は保存しない
  {
    const A = E5.rotateOf(E5.sampleModel({ model: 'plummer', N: 64, seed: 43 }).S, 0.5, 7), sc = E5.scalesOf('plummer'), out = {};
    for (const drag of ['row', 'symFull', 'symCentral']) {
      const R = integrateFluid(A, { action: 'push', drag, gamma: 5, eps: 0.05, h: 0.01, steps: 40, every: 40 }, sc), Lg = R.ledger;
      const pS = sc.vrms, lS = sc.rh * sc.vrms;
      out[drag] = { dP: Math.hypot(Lg.P1[0] - Lg.P0[0], Lg.P1[1] - Lg.P0[1], Lg.P1[2] - Lg.P0[2]) / pS, dL: Math.hypot(Lg.L1[0] - Lg.L0[0], Lg.L1[1] - Lg.L0[1], Lg.L1[2] - Lg.L0[2]) / lS, Qrad: Lg.Qrad / Math.abs(Lg.E0) };
    }
    S.conserve = out;
  }
  // ④ 一定の速度の場で d = 0(読み 4 × 型 row)・ガリレイ(row・symFull に一様な速度を足して d が同じ)
  {
    const A = E5.sampleModel({ model: 'plummer', N: 48, seed: 47 }).S, C = applyField(A, 'const');
    let zero = 0; for (const rule of SELF_READINGS) { const sw = selfWeightsOf(C, rule, { eps: 0.05 }), F = E5.forces(C, 0.05, true, 2, sw); for (let i = 0; i < 48; i++) zero = Math.max(zero, Math.abs(F.dx[i]), Math.abs(F.dy[i]), Math.abs(F.dz[i])); }
    const B = E5.cloneState(A); for (let i = 0; i < 48; i++) { B.vx[i] += 0.7; B.vy[i] -= 0.4; B.vz[i] += 0.25; }
    let gal = 0; for (const drag of ['row', 'symFull', 'symCentral']) { const FA = evalForces(A, { drag, eps: 0.05 }), FB = evalForces(B, { drag, eps: 0.05 }); for (let i = 0; i < 48; i++) gal = Math.max(gal, Math.abs(FA.dx[i] - FB.dx[i]), Math.abs(FA.dy[i] - FB.dy[i]), Math.abs(FA.dz[i] - FB.dz[i])); }
    S.ident = { zero, gal };
  }
  // ⑤ 連続の場の求積: 閉じた形の方位の積分を使った W・g と、方位も Gauss–Legendre で積んだ二重の求積の差(r = 0.3・1・3)
  {
    let maxRel = 0;
    for (const r of [0.3, 1, 3]) {
      // 方位の求積は μ = 1 の近く(核の幅 ~ ε²/(2 r r′))を細かく分ける —— 閉じた形を使わない二重の求積
      const c = continuumField(r, 0.05), rc = rCutOf(), mb = [-1, 0.9, 0.99, 0.999, 0.9999, 1];
      const br = [0, r - 0.2, r - 0.05, r, r + 0.05, r + 0.2, rc].filter((t) => t >= 0 && t <= rc).sort((p, q) => p - q);
      const f0 = (rp) => quadPanels((mu) => 1 / (r * r + rp * rp - 2 * r * rp * mu + 0.0025), mb, 6, 8);
      const f1 = (rp) => quadPanels((mu) => mu / (r * r + rp * rp - 2 * r * rp * mu + 0.0025), mb, 6, 8);
      const W2 = 2 * Math.PI * quadPanels((rp) => rhoPlummer(rp) * rp * rp * f0(rp), br, 24, 8), N2 = 2 * Math.PI * quadPanels((rp) => rhoPlummer(rp) * rp ** 3 * f1(rp), br, 24, 8);
      maxRel = Math.max(maxRel, Math.abs(c.W / W2 - 1), Math.abs(c.g / (N2 / W2) - 1));
    }
    S.quad = { maxRel };
  }
  // ⑥ B の自己の重みの閉じた形と動径の求積の差(α 2・1 × ε 0.05・0.01)・ε → 0 の極限 4πρR
  {
    let maxRel = 0;
    for (const alpha of [2, 1]) for (const e of [0.05, 0.01]) {
      const m = 1 / 512, rho = 0.1, R = Math.cbrt(3 * m / (4 * Math.PI * rho));
      const q = 4 * Math.PI * rho * quadPanels((u) => u * u * Math.pow(u * u + e * e, -alpha / 2), [0, R], 32, 8);
      maxRel = Math.max(maxRel, Math.abs(selfWeightB(m, rho, e, alpha) / q - 1));
    }
    const m = 1 / 512, rho = 0.1, R = Math.cbrt(3 * m / (4 * Math.PI * rho));
    S.selfB = { maxRel, lim: Math.abs(selfWeightB(m, rho, 0, 2) / (4 * Math.PI * rho * R) - 1) };
  }
  // ⑦ Π の圧力だけ(重力なしの近似 —— 熱い球の膨張・N 64・40 步): 運動のエネルギー + 内部のエネルギーの残差・運動量
  {
    const A = E5.sampleModel({ model: 'plummer', N: 64, seed: 53 }).S; for (let i = 0; i < 64; i++) { A.vx[i] = 0; A.vy[i] = 0; A.vz[i] = 0; }
    const u = new Float64Array(64).fill(0.5), F = newF(64), h = 0.005;
    const tot = () => { let K = 0, U = 0, px = 0; for (let i = 0; i < 64; i++) { K += 0.5 * A.m[i] * (A.vx[i] ** 2 + A.vy[i] ** 2 + A.vz[i] ** 2); U += A.m[i] * u[i]; px += A.m[i] * A.vx[i]; } return { E: K + U, K, px }; };
    const e0 = tot(); piForces(A, u, DECL.sphH, F);
    for (let s = 0; s < 40; s++) {
      for (let i = 0; i < 64; i++) { A.vx[i] += 0.5 * h * F.px[i]; A.vy[i] += 0.5 * h * F.py[i]; A.vz[i] += 0.5 * h * F.pz[i]; u[i] += 0.5 * h * F.du[i]; }
      for (let i = 0; i < 64; i++) { A.x[i] += h * A.vx[i]; A.y[i] += h * A.vy[i]; A.z[i] += h * A.vz[i]; }
      piForces(A, u, DECL.sphH, F);
      for (let i = 0; i < 64; i++) { A.vx[i] += 0.5 * h * F.px[i]; A.vy[i] += 0.5 * h * F.py[i]; A.vz[i] += 0.5 * h * F.pz[i]; u[i] += 0.5 * h * F.du[i]; }
    }
    const e1 = tot();
    S.pi = { dE: Math.abs(e1.E - e0.E) / e0.E, Kgain: e1.K / e0.E, px: Math.abs(e1.px) };
  }
  // ⑧ 環の並進の目標 U が第333便b の integratedField(α 2・r_ref 1・自己の重み)と同じ・回転の速さが第334便a の t1Twist と同じ
  {
    const C = centerOf('binary', 0.37), p = [1.02, -0.13, 0.04], sw = ringSelfB() * 1e4, spin = 1;
    let Ws = 0, U = [0, 0, 0]; for (const c of C) { const dx = p[0] - c.p[0], dy = p[1] - c.p[1], dz = p[2] - c.p[2], w = c.m / (dx * dx + dy * dy + dz * dz); Ws += w; U[0] += w * (c.v[0] - spin * dy); U[1] += w * (c.v[1] + spin * dx); U[2] += w * c.v[2]; }
    U = U.map((x) => x / (sw + Ws));
    const G = integratedField({ at: p, sources: C.map((c) => ({ p: c.p, v: c.v, s: [0, 0, spin], m: c.m })), alpha: 2, rRef: 1, selfW: sw });
    const beta = Ws / (sw + Ws), V = t1Twist({ rho: Math.hypot(p[0], p[1]), z: p[2], sd: spin, beta }).par;
    const pa = [0.83, 0.31, 0.22], Ka = 2.5, oX2 = axialOmega(pa, spin, 1, Ka, 'X2'), Ga = integratedField({ at: pa, sources: [{ p: [0, 0, 0], v: [0, 0, 0], s: [0, 0, spin], m: 1 }], alpha: 2, rRef: 1, selfW: Ka });
    const axRel = Math.max(...oX2.map((x, k) => Math.abs(x - Ga.omega[k]) / Math.max(Math.hypot(...Ga.omega), 1e-300)));
    S.ringLib = { axRel, maxRel: Math.max(...U.map((x, k) => Math.abs(x - G.U[k]) / Math.max(Math.abs(G.U[k]), 1e-300))), twist: Math.abs(V - beta * spin * p[2]) };
  }
  // ⑨ k 近傍の密度(Plummer N 4096 —— 半質量の半径の殻 0.9〜1.4 の要素の推定 ÷ 解析の中央値)
  {
    const A = E5.sampleModel({ model: 'plummer', N: 4096, seed: 59 }).S, rho = knnDensity(A), rat = [];
    for (let i = 0; i < 4096; i++) { const r = Math.hypot(A.x[i], A.y[i], A.z[i]); if (r > 0.9 && r < 1.4) rat.push(rho[i] / rhoPlummer(r)); }
    rat.sort((p, q) => p - q);
    S.knn = { med: rat[rat.length >> 1], n: rat.length };
  }
  // ⑩ 入力の拒否
  {
    const A = E5.sampleModel({ model: 'plummer', N: 8, seed: 1 }).S, sc = E5.scalesOf('plummer');
    const tries = [() => selfWeightB(0, 1, 0.1), () => selfWeightB(1, 1, 0.1, 3), () => selfWeightA(1, 0), () => selfWeightsOf(A, 'D', { eps: 0.1 }), () => applyField(A, 'spiral'),
      () => continuumField(-1, 0.05), () => integrateFluid(A, { action: 'fly', eps: 0.1, h: 0.1, steps: 2, every: 1 }, sc), () => integrateFluid(A, { action: 'vel', drag: 'symFull', eps: 0.1, h: 0.1, steps: 2, every: 1 }, sc),
      () => evalForces(A, { drag: 'magic', eps: 0.1 }), () => ringRun({ col: 'X' }), () => centerOf('triple', 0), () => knnDensity(A, 8)];
    let n = 0; for (const f of tries) { try { f(); } catch (e) { if (e instanceof RangeError) n++; } }
    S.reject = { n, of: tries.length };
  }
  return S;
}
export function pureGates(S) {
  return {
    split: S.split.same === true && S.split.nRec === 64 && S.split.spread > 0 && S.split.spreadMed > 0 && S.split.spreadMed <= S.split.spread && S.split.sub.every((x) => fin(x.ratio) && x.ratio > 0),
    rowSame: S.rowSame.maxD === 0,
    conserve: S.conserve.symFull.dP <= 1e-13 && S.conserve.symCentral.dP <= 1e-13 && S.conserve.symCentral.dL <= 1e-13 && S.conserve.symFull.Qrad >= 0 && S.conserve.symCentral.Qrad >= 0 && S.conserve.row.dP > 1e-10,
    ident: S.ident.zero <= 1e-15 && S.ident.gal <= 1e-12,
    quad: S.quad.maxRel <= 1e-6,
    selfB: S.selfB.maxRel <= 1e-10 && S.selfB.lim <= 1e-15,
    pi: S.pi.dE <= 1e-3 && S.pi.Kgain > 0 && S.pi.px <= 1e-13,
    ringLib: S.ringLib.maxRel <= 1e-12 && S.ringLib.twist <= 1e-15 && S.ringLib.axRel <= 1e-12,
    knn: S.knn.n > 100 && S.knn.med > 0.8 && S.knn.med < 1.25,
    reject: S.reject.n === S.reject.of,
  };
}
