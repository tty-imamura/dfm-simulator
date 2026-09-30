// 第288便c(原仮定者の裁定(第78報)⑧「渦や磁界の研究から類似式を当てはめて精度と速度を向上」・統括の検証項目 R115)——
// **回転核の候補**(純関数・Node だけ・**エンジン未接続**)。
//
// ■ 何か
//   (1) rotlet 型の速度核: u_ij = β_j J_j × r_ij / s^{3/2}(r_ij = x_i − x_j・s = |r|² + ε²)と解析勾配
//       ∂_b u_a = β_j [ (J_j × e_b)_a / s^{3/2} − 3 (J_j × r)_a r_b / s^{5/2} ]
//       J が物理的角運動量(M L² T⁻¹)なら u が速度(L T⁻¹)になる β の単位は L/M(G/c² がその単位 —— β=G/c² は宣言の既定値)。
//   (2) 双極子型の配向ポテンシャル: U_ij = C(r){ J_i·J_j − 3 (J_i·r̂)(J_j·r̂) }・C(r) = κ / s^{3/2}(κ は宣言)。
//       力 F_i = −∂U/∂r_i(F_j = −F_i)とトルク τ_i = −J_i × ∂U/∂J_i を同じ U から微分する(両方の閉じた式)。
//
// ■ 位置づけ(書くこと・書かないこと)
//   ・**既存の q 付き回転場(E6′ の ω(d)=s(R/(R+d))^q)に足さない**(二重計上 —— 置換経路として同じ状態で u を並べる比較器だけ)。
//   ・**面内の J と面内の r では J×r は z を向く** —— 回転核を入れて z を捨てるだけでは面内の腕の流れは出ない(単体試験に固定)。
//   ・「回転核で腕が出た」「重力を格子へ移した」とは書かない。
export const ROTLET_VERSION = 'w288c-rotlet-1';

const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const E = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];

/** β の既定(G/c² —— 単位 L/M)。 */
export function betaOf(G, c) { return G / (c * c); }
/** rotlet の速度 u = β J×r / s^{3/2}(r は 3 成分・評価点 − 源)。 */
export function rotletU(J, r, beta, eps) {
  const s = dot(r, r) + eps * eps, k = beta / (s * Math.sqrt(s)), c = cross(J, r);
  return [k * c[0], k * c[1], k * c[2]];
}
/** 解析勾配 G[a][b] = ∂u_a/∂r_b。 */
export function rotletGrad(J, r, beta, eps) {
  const s = dot(r, r) + eps * eps, s32 = s * Math.sqrt(s), s52 = s32 * s, c = cross(J, r);
  const G = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  for (let b = 0; b < 3; b++) { const jb = cross(J, E[b]); for (let a = 0; a < 3; a++) G[a][b] = beta * (jb[a] / s32 - 3 * c[a] * r[b] / s52); }
  return G;
}
/** 中心差分の勾配(刻み h)。 */
export function rotletGradFD(J, r, beta, eps, h) {
  const G = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  for (let b = 0; b < 3; b++) {
    const rp = r.slice(), rm = r.slice(); rp[b] += h; rm[b] -= h;
    const up = rotletU(J, rp, beta, eps), um = rotletU(J, rm, beta, eps);
    for (let a = 0; a < 3; a++) G[a][b] = (up[a] - um[a]) / (2 * h);
  }
  return G;
}
/** 双極子型の配向ポテンシャル U(r=x_i−x_j)。 */
export function dipoleU(Ji, Jj, r, kappa, eps) {
  const s = dot(r, r) + eps * eps, C = kappa / (s * Math.sqrt(s));
  const r2 = dot(r, r), a = dot(Ji, r), b = dot(Jj, r);
  return C * (dot(Ji, Jj) - 3 * a * b / (r2 > 0 ? r2 : 1));
}
/**
 * 同じ U から力とトルク(閉じた式)。U = C(s)·(J_i·J_j) − 3 C(s) (J_i·r)(J_j·r)/|r|²
 * ∂U/∂r = C′(s)·2r·(J_i·J_j − 3ab/r²) − 3C[(J_i b + J_j a)/r² − 2ab r/r⁴]・C′(s) = −(3/2) C/s
 * ∂U/∂J_i = C (J_j − 3 b r/r²)・τ_i = −J_i × ∂U/∂J_i
 */
export function dipoleForceTorque(Ji, Jj, r, kappa, eps) {
  const r2 = dot(r, r), s = r2 + eps * eps, C = kappa / (s * Math.sqrt(s)), Cp = -1.5 * C / s;
  const a = dot(Ji, r), b = dot(Jj, r), jj = dot(Ji, Jj);
  const dUdr = [0, 1, 2].map((k) => Cp * 2 * r[k] * (jj - 3 * a * b / r2) - 3 * C * ((Ji[k] * b + Jj[k] * a) / r2 - 2 * a * b * r[k] / (r2 * r2)));
  const dUdJi = [0, 1, 2].map((k) => C * (Jj[k] - 3 * b * r[k] / r2));
  const dUdJj = [0, 1, 2].map((k) => C * (Ji[k] - 3 * a * r[k] / r2));
  const Fi = dUdr.map((v) => -v), Fj = dUdr.slice();                     // r = x_i − x_j なので ∂/∂x_j = −∂/∂r
  const ti = cross(Ji, dUdJi).map((v) => -v), tj = cross(Jj, dUdJj).map((v) => -v);
  return { U: dipoleU(Ji, Jj, r, kappa, eps), Fi, Fj, tauI: ti, tauJ: tj };
}
/** 力の中心差分(U を x_i で差分)。 */
export function dipoleForceFD(Ji, Jj, r, kappa, eps, h) {
  return [0, 1, 2].map((k) => { const rp = r.slice(), rm = r.slice(); rp[k] += h; rm[k] -= h;
    return -(dipoleU(Ji, Jj, rp, kappa, eps) - dipoleU(Ji, Jj, rm, kappa, eps)) / (2 * h); });
}
/** トルクの数値確認: J_i を軸 e_k まわりに微小回転したときの U の変化 −dU/dθ = τ_i·e_k。 */
export function dipoleTorqueFD(Ji, Jj, r, kappa, eps, h) {
  return [0, 1, 2].map((k) => {
    const rot = (th) => { const c = Math.cos(th), sn = Math.sin(th), e = E[k], ex = cross(e, Ji), ed = dot(e, Ji);   // Rodrigues
      return [0, 1, 2].map((m) => Ji[m] * c + ex[m] * sn + e[m] * ed * (1 - c)); };
    return -(dipoleU(rot(h), Jj, r, kappa, eps) - dipoleU(rot(-h), Jj, r, kappa, eps)) / (2 * h);
  });
}
/** 行列の最大の相対差(最大ノルム)。 */
export function maxRel(A, B) {
  let num = 0, den = 0;
  for (let a = 0; a < A.length; a++) for (let b = 0; b < A[a].length; b++) { num = Math.max(num, Math.abs(A[a][b] - B[a][b])); den = Math.max(den, Math.abs(B[a][b])); }
  return num / Math.max(den, 1e-300);
}
export { cross, dot };
