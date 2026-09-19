// 第274便d(第64報): **形状トイの参照純関数**。
//
// エンジン側 `shapeToyDisc`(beta/index.html)が返す F=e^{Bh}・Q_h=C−F C Fᵀ を、
// **別の道**(行列指数の scaling-and-squaring + Taylor 級数)で作り直して突き合わせるための器である。
// **値は作らない**(判定もしない): 一致は「同じ行列指数を計算した」ことだけを意味する。
//
// ここに置くもの:
//   ・`expm2(B,h)` …… 2×2 の行列指数(scaling-and-squaring・Taylor 20 項)。解析形を使わない。
//   ・`discRef(omega0,gamma,h)` …… その expm2 から F と Q_h=C−F C Fᵀ を作る参照値。
//   ・`normalCdf(z)` / `ksStat(xs)` …… 投影の正規性の**距離**(合否ではない)。
//   ・`gaussKs95(n)` …… KS の 95% 点の近似 1.36/√n(**宣言値**であって導出ではない)。

/** 2×2 行列の積。行優先 [a11,a12,a21,a22]。 */
export function mul2(A, B) {
  return [A[0] * B[0] + A[1] * B[2], A[0] * B[1] + A[1] * B[3],
    A[2] * B[0] + A[3] * B[2], A[2] * B[1] + A[3] * B[3]];
}

/** 2×2 の行列指数 e^{Bh}(scaling-and-squaring + Taylor 20 項。解析形は使わない)。 */
export function expm2(B, h) {
  const M = [B[0] * h, B[1] * h, B[2] * h, B[3] * h];
  const nrm = Math.max(Math.abs(M[0]) + Math.abs(M[1]), Math.abs(M[2]) + Math.abs(M[3]));
  let sq = 0;
  while (nrm / Math.pow(2, sq) > 0.25) sq++;
  const s = Math.pow(2, sq);
  const A = [M[0] / s, M[1] / s, M[2] / s, M[3] / s];
  let term = [1, 0, 0, 1], sum = [1, 0, 0, 1];
  for (let k = 1; k <= 20; k++) {
    term = mul2(term, A);
    term = [term[0] / k, term[1] / k, term[2] / k, term[3] / k];
    sum = [sum[0] + term[0], sum[1] + term[1], sum[2] + term[2], sum[3] + term[3]];
  }
  let R = sum;
  for (let k = 0; k < sq; k++) R = mul2(R, R);
  return R;
}

/** 参照の F と Q_h(C=diag(1,ω₀²))。エンジンの解析形と突き合わせるためだけに使う。 */
export function discRef(omega0, gamma, h) {
  const w2 = omega0 * omega0;
  const F = expm2([0, 1, -w2, -gamma], h);
  // Q = C − F C Fᵀ、C=diag(1,ω₀²)
  const FC = [F[0] * 1, F[1] * w2, F[2] * 1, F[3] * w2];          // F·C
  const FCFt = [FC[0] * F[0] + FC[1] * F[1], FC[0] * F[2] + FC[1] * F[3],
    FC[2] * F[0] + FC[3] * F[1], FC[2] * F[2] + FC[3] * F[3]];    // (F C) Fᵀ
  return { F11: F[0], F12: F[1], F21: F[2], F22: F[3],
    q11: 1 - FCFt[0], q12: -FCFt[1], q22: w2 - FCFt[3] };
}

/** 標準正規の累積分布(Abramowitz–Stegun 7.1.26 の erf 近似)。 */
export function normalCdf(z) {
  const t = 1 / (1 + 0.3275911 * Math.abs(z) / Math.SQRT2);
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t
    + 0.254829592) * t * Math.exp(-z * z / 2);
  return z >= 0 ? 0.5 * (1 + y) : 0.5 * (1 - y);
}

/** 標準化済み標本の KS 距離 sup|F_n − Φ|(**距離であって合否ではない**)。 */
export function ksStat(xs) {
  const a = Array.from(xs).filter((v) => Number.isFinite(v)).sort((p, q) => p - q);
  const n = a.length;
  if (!n) return null;
  let d = 0;
  for (let i = 0; i < n; i++) {
    const F = normalCdf(a[i]);
    d = Math.max(d, Math.abs((i + 1) / n - F), Math.abs(F - i / n));
  }
  return d;
}

/** KS の 95% 点の近似(**宣言値** 1.36/√n —— 導出ではない)。 */
export function gaussKs95(n) { return 1.36 / Math.sqrt(n); }

/** 平均・分散・尖度(標本)。 */
export function moments(xs) {
  const n = xs.length;
  let m = 0;
  for (const v of xs) m += v;
  m /= n;
  let s2 = 0, s4 = 0;
  for (const v of xs) { const d = v - m; s2 += d * d; s4 += d * d * d * d; }
  s2 /= n; s4 /= n;
  return { n, mean: m, var: s2, sd: Math.sqrt(s2), kurt: s2 > 0 ? s4 / (s2 * s2) : null };
}
