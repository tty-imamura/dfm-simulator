// 第292便c(原仮定者の裁定(第82報)⑤⑥・統括の検証項目 R139)——
// **慣性決定力の構造核(近似コアの質量と半径の体積積分)の純関数**(Node だけ・html を読まない)。
//
// ■ 何を置くか
//   源 j を **一様密度のコア(質量 f·M_j・半径 R_c)+ 一様密度のマントル殻(質量 (1−f)·M_j・R_c〜R_j)** とし、点の受け手 i に対する
//   慣性引きずりの核 K_ε(s) = s/(s²+ε²)²(第290便c の `dfmInertialDragStep` と同じ核)を源の質量分布で体積平均した ⟨K⟩_j(r)
//   (r = 中心間距離・**単位質量あたり** —— エンジンは u_i += C_d m_j ⟨K⟩_j(r) (V_j − V_i) とする)を求積する。
//     ⟨K⟩(r) = Σ_層 w_L · 3/(2(b³−a³)) ∫_a^b ρ² G(r,ρ) dρ,  G(r,ρ) = ∫_{−1}^{1} K_ε(s) dμ,  s² = r²+ρ²−2rρμ
//   角度方向は s への変数変換で閉じた形になる(dμ = −s ds/(rρ)):
//     G(r,ρ) = (1/(rρ)) [F(r+ρ) − F(|r−ρ|)],  F(s) = atan(s/ε)/(2ε) − s/(2(s²+ε²))
//   桁落ちを避けるため差を閉じた形で書く(s₁ = r+ρ, s₂ = |r−ρ|):
//     F(s₁) − F(s₂) = atan((s₁−s₂)ε/(ε²+s₁s₂))/(2ε) − (s₁−s₂)(ε²−s₁s₂)/(2(s₁²+ε²)(s₂²+ε²))
//   r = 0 では G = 2K_ε(ρ)(極限)。**ε > 0 が要る**(ε = 0 では受け手が源の中にあると ⟨s⁻³⟩ が対数発散する —— 受理器が拒否する)。
//   半径方向は Gauss–Legendre(n_r 点)を層ごと・**区切り点 r, r±ε, r±4ε, r±16ε**(受け手の近くの幅 ε の構造)で分けた小区間ごとに置く。
//   角度方向の **数値求積(n_θ 点の Gauss–Legendre か中点 —— μ について)** も置き、閉じた形の検算に使う(エンジンは閉じた形)。
//
//   表(エンジンの前計算と同じ): r_k = R_j (e^{ξ_k} − 1)・ξ_k = k ξ_max/(n−1)・ξ_max = ln(1 + r_max/R_j)(中心の近くを細かく・遠方を粗く)。
//   表に置くのは **Q(r) = ⟨K⟩(r)·(r²+R²)^{3/2}**(遠方で 1+O(R²/r²)・中心で有限 —— どちらもなめらかで、ξ について線形補間した誤差は
//   月の距離で核の値の相対 10⁻⁸ 級)。差 ⟨K⟩−K_ε を表にすると中心の近く(r ≲ ε)で K_ε の幅 ε の山を格子が解けない(試した —— 採らない)。
//   表の外(r ≥ r_max)は点源 K_ε(跳びは (⟨K⟩−K_ε)/K_ε ≈ ⟨ρ²⟩/r_max² で、記録する)。
//
// ■ 遠方展開(球対称な分布の単極子への収束 —— 検算 (v))
//   ε = 0 の核 s⁻³ の半径 ρ の球殻平均は閉じた形 1/(r(r²−ρ²)) = r⁻³ Σ_k (ρ/r)^{2k}。分布で平均すると
//     ⟨K⟩ = r⁻³ (1 + ⟨ρ²⟩/r² + ⟨ρ⁴⟩/r⁴ + …)
//   **単極子への収束は 1/r² の速さ**(重力 1/r の殻定理のような厳密一致ではない —— 核 s⁻³ は調和関数ではない)。
//   ⟨ρ²⟩ = (3/5)[f R_c² + (1−f)(R⁵−R_c⁵)/(R³−R_c³)]。地球の起点の宣言(f=0.325・R_c=0.546R)で ⟨ρ²⟩ ≈ 0.518 R²:
//   r = 10R で点源との相対差 ≈ 5.2×10⁻³(ブリーフの例「r=10R で 10⁻³」は核 s⁻³ では成り立たない —— 器はこの差を展開と照合する)、
//   月の距離(r ≈ 57R)で ≈ 1.6×10⁻⁴。
//
// ■ しないこと・言わないこと
//   ・受け手を有限球にしない(点の受け手)。Ω(自転)を読まない(表面の手前/反対の反転〔回転引きずり〕は対象外)。多粒子の多重極に広げない。
//   ・C_d・f・R_c を 1 つの観測量から同時に一意決定したとは言わない。`core:{}`(コア v2)の鍵を流用しない。
//   ・冪は `**`/Math.pow を使わず積で書く(tests/README §1)。
export const DRAGCORE_LIB_VERSION = 'w292c-dragcore-lib-1';
export const DRAGCORE_NR_DEFAULT = 32;
export const DRAGCORE_SPLITS = Object.freeze([-16, -4, -1, 0, 1, 4, 16]);   // 受け手の距離 r のまわりの区切り(ε の倍数)

/** 核 K_ε(r) = r/(r²+ε²)²(エンジンと同じ順序: s=r²+ε²・r/(s·s))。 */
export function kernelK(r, eps) { const s = r * r + eps * eps; return r / (s * s); }

/** Gauss–Legendre の節点と重み([0,1]・重みの和 1)—— エンジンの `dfmGaussLegendre01` と同じ手続き。 */
export function gaussLegendre01(n) {
  const x = new Array(n), w = new Array(n);
  for (let i = 0; i < n; i++) {
    let z = Math.cos(Math.PI * (i + 0.75) / (n + 0.5)), pp = 1;
    for (let it = 0; it < 100; it++) {
      let p1 = 1, p2 = 0;
      for (let j = 1; j <= n; j++) { const p3 = p2; p2 = p1; p1 = ((2 * j - 1) * z * p2 - (j - 1) * p3) / j; }
      pp = n * (z * p1 - p2) / (z * z - 1);
      const z1 = z; z = z1 - p1 / pp;
      if (Math.abs(z - z1) <= 1e-16) break;
    }
    x[i] = 0.5 * (1 - z); w[i] = 1 / ((1 - z * z) * pp * pp);
  }
  return { x, w };
}

/** 角度方向の閉じた形 G(r,ρ) = ∫_{−1}^{1} K_ε(s) dμ(エンジンの `dragCoreAngular` と同じ式・同じ順序)。 */
export function angularExact(r, rho, eps) {
  if (r === 0) { const s = rho * rho + eps * eps; return 2 * rho / (s * s); }
  const s1 = r + rho, s2 = Math.abs(r - rho), e2 = eps * eps, d = s1 - s2;
  const at = Math.atan(d * eps / (e2 + s1 * s2)) / (2 * eps);
  const rt = d * (e2 - s1 * s2) / (2 * (s1 * s1 + e2) * (s2 * s2 + e2));
  return (at - rt) / (r * rho);
}
/** 角度方向の数値求積(μ ∈ [−1,1] の n_θ 点 —— "gl" か "mid")。閉じた形の検算用(エンジンは使わない)。 */
export function angularQuad(r, rho, eps, nTh, rule) {
  let sum = 0;
  if (rule === 'mid') {
    for (let k = 0; k < nTh; k++) { const mu = -1 + (2 * k + 1) / nTh, s = Math.sqrt(Math.max(0, r * r + rho * rho - 2 * r * rho * mu)); sum += kernelK(s, eps) * (2 / nTh); }
    return sum;
  }
  const g = gaussLegendre01(nTh);
  for (let k = 0; k < nTh; k++) { const mu = -1 + 2 * g.x[k], s = Math.sqrt(Math.max(0, r * r + rho * rho - 2 * r * rho * mu)); sum += kernelK(s, eps) * 2 * g.w[k]; }
  return sum;
}

/** 層 [a,b](一様密度)の ∫_a^b ρ² G dρ を区切りつきの GL(n_r 点)で。opt.angular = (r,ρ)→G を差し替えられる(検算用)。 */
export function layerIntegral(r, a, b, eps, nr, angular, gl) {
  const g = gl || gaussLegendre01(nr), G = angular || ((rr, rho) => angularExact(rr, rho, eps));
  const cuts = [a];
  for (const c of DRAGCORE_SPLITS) { const z = r + c * eps; if (z > a && z < b && z > cuts[cuts.length - 1]) cuts.push(z); }
  cuts.push(b);
  let sum = 0;
  for (let q = 0; q + 1 < cuts.length; q++) {
    const lo = cuts[q], hi = cuts[q + 1], h = hi - lo;
    if (!(h > 0)) continue;
    let part = 0;
    for (let k = 0; k < g.x.length; k++) { const rho = lo + h * g.x[k]; part += g.w[k] * rho * rho * G(r, rho); }
    sum += part * h;
  }
  return sum;
}

/**
 * 体積平均 ⟨K⟩(r)(単位質量あたり)。decl = {massFrac:f, radius:R_c}・R = 天体の半径。
 * エンジンの `dragCoreAvgK` と同じ式・同じ順序(層の順: コア → マントル)。
 */
export function avgK(r, decl, R, eps, nr, opt) {
  const o = opt || {}, f = decl.massFrac, Rc = decl.radius, gl = o.gl || gaussLegendre01(nr || DRAGCORE_NR_DEFAULT);
  const ang = o.angular || null;
  let out = 0;
  if (f > 0) { const c3 = Rc * Rc * Rc; out += f * 3 / (2 * c3) * layerIntegral(r, 0, Rc, eps, nr, ang, gl); }
  if (f < 1) { const d3 = R * R * R - Rc * Rc * Rc; out += (1 - f) * 3 / (2 * d3) * layerIntegral(r, Rc, R, eps, nr, ang, gl); }
  return out;
}
/** ⟨ρ²⟩・⟨ρ⁴⟩(遠方展開の係数)。 */
export function radialMoments(decl, R) {
  const f = decl.massFrac, c = decl.radius;
  const m2 = (a, b) => 3 / 5 * (b * b * b * b * b - a * a * a * a * a) / (b * b * b - a * a * a);
  const m4 = (a, b) => 3 / 7 * (b * b * b * b * b * b * b - a * a * a * a * a * a * a) / (b * b * b - a * a * a);
  const r2 = f * (3 / 5) * c * c + ((f < 1) ? (1 - f) * m2(c, R) : 0);
  const r4 = f * (3 / 7) * c * c * c * c + ((f < 1) ? (1 - f) * m4(c, R) : 0);
  return { rho2: r2, rho4: r4 };
}
/** 遠方展開 ⟨K⟩ ≈ r⁻³(1 + ⟨ρ²⟩/r² + ⟨ρ⁴⟩/r⁴)(ε = 0 の核 —— ε ≪ r のとき ε の補正 −2ε²/r² を掛ける)。 */
export function farExpansion(r, decl, R, eps) {
  const m = radialMoments(decl, R), r2 = r * r;
  const point = kernelK(r, eps);
  return { point, series: point * (1 + m.rho2 / r2 + m.rho4 / (r2 * r2)), rho2: m.rho2, rho4: m.rho4, firstOrder: m.rho2 / r2 };
}

/** 表の重み w(r) = (r²+R²)^{3/2}(⟨K⟩ の遠方の r⁻³ と中心の有限値を両方なめらかにする —— エンジンの `dragCoreTableBuild` と同じ)。 */
export function tableWeight(r, R) { const s = r * r + R * R; return s * Math.sqrt(s); }
/** 表(エンジンの `dragCoreTableBuild` と同じ格子・同じ量 Q(r) = ⟨K⟩(r)·(r²+R²)^{3/2})。 */
export function tableBuild(decl, R, eps, n, rMax, nr) {
  const gl = gaussLegendre01(nr), xiMax = Math.log1p(rMax / R), dXi = xiMax / (n - 1);
  const r = new Float64Array(n), Q = new Float64Array(n);
  for (let k = 0; k < n; k++) { const rk = (k === n - 1) ? rMax : R * Math.expm1(k * dXi); r[k] = rk; Q[k] = avgK(rk, decl, R, eps, nr, { gl }) * tableWeight(rk, R); }
  return { R, n, rMax, dXi, r, Q, nr, eps };
}
/** 表の補間(Q を ξ について線形・⟨K⟩ = Q/w を返す)。表の外(r ≥ r_max)は null(呼び手が点源 K_ε に落とす)。 */
export function tableLookup(T, r) {
  if (!(r < T.rMax)) return null;
  const xi = Math.log1p(r / T.R) / T.dXi, k = Math.floor(xi);
  const q = (k >= T.n - 1) ? T.Q[T.n - 1] : T.Q[k] + (xi - k) * (T.Q[k + 1] - T.Q[k]);
  return q / tableWeight(r, T.R);
}

/** 単体試験(ブリーフの極限 (i)〜(v)+角度の閉じた形の検算)。数値はすべて記録する。 */
export function selfTest(o) {
  const R = (o && o.R) || 6.38, eps = (o && o.eps) || 0.1, decl = (o && o.decl) || { massFrac: 0.325, radius: 0.546 * 6.38 }, aMoon = (o && o.aMoon) || 363.62532;
  const rel = (a, b) => Math.abs(a - b) / Math.abs(b);
  const out = {};
  // (i) 点源の極限: R_c → 0 ∧ 殻の質量 0(f=1)で点源と相対 1e-6 以内(r = 2R・10R・月の距離)
  const tiny = { massFrac: 1, radius: 1e-4 };
  out.pointLimit = [2 * R, 10 * R, aMoon].map((r) => { const v = avgK(r, tiny, R, eps, 32), p = kernelK(r, eps); return { r, avgK: v, point: p, rel: rel(v, p) }; });
  out.pointLimitOk = out.pointLimit.every((z) => z.rel <= 1e-6);
  // (ii) 遠方: 点源との相対差は ⟨ρ²⟩/r² の 1 次項で決まる(r = 10R では 10⁻³ を超える —— 展開と照合)・r = 40R・月の距離で 10⁻³ 以内
  out.far = [10 * R, 40 * R, aMoon].map((r) => { const v = avgK(r, decl, R, eps, 32), p = kernelK(r, eps), fe = farExpansion(r, decl, R, eps);
    return { r, rOverR: r / R, avgK: v, point: p, relToPoint: rel(v, p), firstOrder: fe.firstOrder, series: fe.series, relToSeries: rel(v, fe.series) }; });
  out.farOk = out.far.filter((z) => z.rOverR >= 40).every((z) => z.relToPoint <= 1e-3) && out.far.every((z) => z.relToSeries <= 2e-3 * z.firstOrder + 1e-9);
  // (iii) 線形: M を 2 倍 → m⟨K⟩ が 2 倍(⟨K⟩ は単位質量あたり —— 形が同じなら同じ値。m⟨K⟩ はちょうど 2 倍)
  const k1 = avgK(aMoon, decl, R, eps, 32);
  out.linear = { mK1: 0.59724 * k1, mK2: (2 * 0.59724) * k1, ratio: ((2 * 0.59724) * k1) / (0.59724 * k1) };
  out.linearOk = out.linear.ratio === 2;
  // (iv) 求積の収束 n_r 8 → 16 → 32(相対 1e-6)—— 外・表面の近く・中
  out.converge = [0.5 * R, R, 2 * R, aMoon].map((r) => { const a8 = avgK(r, decl, R, eps, 8), a16 = avgK(r, decl, R, eps, 16), a32 = avgK(r, decl, R, eps, 32), a64 = avgK(r, decl, R, eps, 64);
    return { r, rOverR: r / R, a8, a16, a32, a64, rel8_16: rel(a8, a16), rel16_32: rel(a16, a32), rel32_64: rel(a32, a64) }; });
  out.convergeOk = out.converge.every((z) => z.rel16_32 <= 1e-6 && z.rel32_64 <= 1e-6);
  // (v) 遠方展開: 相対差 / (⟨ρ²⟩/r²) → 1(r → ∞)
  out.monopole = [20 * R, 57 * R, 200 * R, 1000 * R].map((r) => { const v = avgK(r, decl, R, eps, 32), p = kernelK(r, eps), fe = farExpansion(r, decl, R, eps);
    return { r, rOverR: r / R, relToPoint: (v - p) / p, firstOrder: fe.firstOrder, ratio: ((v - p) / p) / fe.firstOrder }; });
  out.monopoleOk = out.monopole.every((z, i, A) => Math.abs(z.ratio - 1) <= 0.1) && Math.abs(out.monopole[out.monopole.length - 1].ratio - 1) < Math.abs(out.monopole[0].ratio - 1) + 1e-12;
  // 角度の閉じた形 vs 数値(GL 64 点・中点 4096 点)—— 外の 2 点
  out.angular = [[2 * R, 0.7 * R], [aMoon, R]].map(([r, rho]) => { const ex = angularExact(r, rho, eps), gl = angularQuad(r, rho, eps, 64, 'gl'), mid = angularQuad(r, rho, eps, 4096, 'mid');
    return { r, rho, exact: ex, gl64: gl, mid4096: mid, relGl: rel(gl, ex), relMid: rel(mid, ex) }; });
  out.angularOk = out.angular.every((z) => z.relGl <= 1e-10 && z.relMid <= 1e-5);
  // 一様球の検算(f = (R_c/R)³ でコアとマントルの密度が同じ —— R_c を変えても ⟨K⟩ は同じ)
  const fu = (0.546 * 0.546 * 0.546), u1 = avgK(aMoon, { massFrac: fu, radius: 0.546 * R }, R, eps, 32), u2 = avgK(aMoon, { massFrac: 0.4 * 0.4 * 0.4, radius: 0.4 * R }, R, eps, 32);
  out.uniform = { a: u1, b: u2, rel: rel(u1, u2) };
  out.uniformOk = out.uniform.rel <= 1e-12;
  out.ok = out.pointLimitOk && out.farOk && out.linearOk && out.convergeOk && out.monopoleOk && out.angularOk && out.uniformOk;
  return out;
}
