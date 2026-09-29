// 第286便a(原仮定者の裁定(第76報)⑤「球状星団はわずかに回転している —— これをヒントにバランスの取れる状態を計算で割り出す」・
// 統括の検証項目 R103・AN60)—— **2D の動径 Jeans 式の純関数**(html の `jeansSigma2Profile` の写し —— 器 tests/exp-w286a-jeans.mjs が
// 同じ入力で html と照合する)。**2D 投影のアナロジー**である(面内の運動 —— 3D 分布の投影と同じではない)。
//
//   仮定(宣言): 等方(σ_r=σ_φ=σ)・定常・軸対称・**外縁 R_t で圧力 Σσ²=0**。
//     d(Σσ²)/dr = Σ( V_φ²/r − g + ⟨a_mesh,r⟩ )  →  σ²(r) = (1/Σ) ∫_r^{R_t} Σ [ g − ⟨a_mesh,r⟩ − V_φ²/s ] ds
//     (g は内向きの重力加速度の大きさ・⟨a_mesh,r⟩ は外向きを正とするトイの平均加速度の動径成分)
//   ・**負の σ² は「その密度・回転・境界条件では平衡解がない」** —— `JeansNoSolution` を投げる(0 へ丸めない)。
//   ・トイの平均加速度: a = ∂ₜū + (∇ū)v − (∇ū)ᵀ(v−ū) は v について 1 次 → ⟨a⟩ = (J−Jᵀ)⟨v⟩ + Jᵀū + ∂ₜū(J=∇ū)。
//   ・検算(近似問題の検算であって粒子系の安定化の証明ではない): 調和重力 g=ω_g² r・Gaussian Σ∝exp(−r²/2a²)・
//     剛体回転の場 u=Ω e_z×r・平均速度 v=ω e_z×r なら ⟨a_mesh,r⟩=(Ω²−2Ωω)r(常に斥力ではない)で **σ²=a²{ω_g²−(Ω−ω)²}**
//     (a=2・ω_g=3・Ω=0.4・ω=0.1 で 35.64)。
export const JEANS_LIB_VERSION = 'w286a-jeans-1';

export class JeansNoSolution extends Error {
  constructor(r, P) { super(`平衡解なし: r=${r} で Σσ²=${P} < 0(その密度・回転・境界条件では平衡解がない)`); this.code = 'noEquilibrium'; this.badRadius = r; this.P = P; }
}

/** σ²(r) を外縁から台形則で積む(html の `jeansSigma2Profile` と同じ演算の順)。r は昇順・r[K]=R_t。 */
export function jeansSigma2(r, Sig, g, aM, V) {
  const K = r.length - 1, P = new Float64Array(K + 1), s2 = new Float64Array(K + 1);
  const f = (k) => { const s = r[k], cen = (s > 0) ? V[k] * V[k] / s : 0; return Sig[k] * (g[k] - aM[k] - cen); };
  let fk1 = f(K); P[K] = 0;
  for (let k = K - 1; k >= 0; k--) { const fk = f(k); P[k] = P[k + 1] + 0.5 * (r[k + 1] - r[k]) * (fk + fk1); fk1 = fk; }
  for (let k = 0; k < K; k++) if (!(P[k] >= 0)) throw new JeansNoSolution(r[k], P[k]);
  for (let k = 0; k <= K; k++) s2[k] = (Sig[k] > 0) ? P[k] / Sig[k] : 0;
  return { sigma2: s2, P };
}

/** トイの平均加速度 ⟨a⟩ = (J−Jᵀ)⟨v⟩ + Jᵀū (+ ∂ₜū)。J は行優先 [J00,J01,J10,J11](J_ab=∂u_a/∂x_b —— html の gradU と同じ並び)。 */
export function toyMeanAccel(u, J, v, dUdt = null) {
  const ax = (J[1] - J[2]) * v[1] + J[0] * u[0] + J[2] * u[1] + (dUdt ? dUdt[0] : 0);
  const ay = (J[2] - J[1]) * v[0] + J[1] * u[0] + J[3] * u[1] + (dUdt ? dUdt[1] : 0);
  return [ax, ay];
}

/** わずかな回転の宣言形 V_φ(r) = k·σ(r)·r/√(r²+a²)(k = 外側の漸近値 v_rot/σ —— 中心で 0)。 */
export const vPhiOf = (k, sigma, r, a) => k * sigma * r / Math.sqrt(r * r + a * a);

/**
 * 検算 harmonicGaussian: 調和重力・Gaussian の面密度・剛体回転の場と平均速度で数値の σ²(0) と厳密解 a²{ω_g²−(Ω−ω)²} を比べる。
 * 場の平均加速度は toyMeanAccel を通す(式の検算 —— 径方向項 (Ω²−2Ωω)r を別に書かない)。
 */
export function harmonicGaussian({ a = 2, wg = 3, Om = 0.4, om = 0.1, Rt = null, K = 20000 } = {}) {
  const R = (Rt === null) ? 12 * a : Rt;
  const r = new Float64Array(K + 1), Sig = new Float64Array(K + 1), g = new Float64Array(K + 1), aM = new Float64Array(K + 1), V = new Float64Array(K + 1);
  for (let k = 0; k <= K; k++) {
    const s = R * k / K; r[k] = s; Sig[k] = Math.exp(-s * s / (2 * a * a)); g[k] = wg * wg * s; V[k] = om * s;
    // 点 (s, 0): e_r=(1,0)・e_φ=(0,1)・u=Ω e_z×r=(0, Ω s)・J=[[0,−Ω],[Ω,0]]・⟨v⟩=(0, ω s)
    const acc = toyMeanAccel([0, Om * s], [0, -Om, Om, 0], [0, om * s]);
    aM[k] = acc[0];
  }
  const { sigma2 } = jeansSigma2(r, Sig, g, aM, V);
  const exact = a * a * (wg * wg - (Om - om) ** 2);
  const meshCoef = aM[K] / r[K], meshCoefExact = Om * Om - 2 * Om * om;
  return { a, wg, Om, om, Rt: R, K, sigma2At0: sigma2[0], exact, relDiff: Math.abs(sigma2[0] - exact) / Math.abs(exact),
    meshRadialCoef: meshCoef, meshRadialCoefExact: meshCoefExact, meshRel: Math.abs(meshCoef - meshCoefExact) / Math.abs(meshCoefExact) };
}

/** 平衡解なしの例(外向きのメッシュ加速度が重力を超える帯)—— 投げることを器と QA が確かめる。 */
export function noSolutionCase() {
  const K = 200, R = 10, r = new Float64Array(K + 1), Sig = new Float64Array(K + 1), g = new Float64Array(K + 1), aM = new Float64Array(K + 1), V = new Float64Array(K + 1);
  for (let k = 0; k <= K; k++) { const s = R * k / K; r[k] = s; Sig[k] = 1 / (1 + s * s) ** 2; g[k] = s / (1 + s * s) ** 1.5; aM[k] = (s > 5) ? 2 * g[k] : 0; }
  try { jeansSigma2(r, Sig, g, aM, V); return { threw: false }; }
  catch (e) { return { threw: e instanceof JeansNoSolution, code: e.code, badRadius: e.badRadius, P: e.P }; }
}
