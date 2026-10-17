// 第307便a(原仮定者の裁定(第100報)「正確な引きずりは球面による引きずりを求める。軸引きずりは、引きずられる側の球面の、近い側と遠い側の
// 『回転引きずりの差分』が引きずり軸回転として作用する」・決断事項 AN345 ①②・統括の検証項目 R209): **球面の軸引きずりの参照の純関数**(html を読まない・状態を持たない)。
//
// ■ 何をするか(器 tests/exp-w307a-sphereaxial.mjs が使う)
//   ・源 j の回転引きずりの分子 N_j(x) = c m_j Ω_j ⟨K_ε(|x − x_j − ρ|)(â_j × ρ)⟩ を**源の球の上で直接求積**する
//     (kind:"ball" = 宣言半径の一様球の体積平均〔今のエンジンの M1 の定義〕/ "shell" = 薄い球面〔第100報の「球面」〕)。
//     対蹠の対 ±ρ をまとめ、K(|d−ρ|) − K(|d+ρ|) を log1p/expm1 で作る(遠方の桁落ちを防ぐ)。
//   ・分母 D(x) = 1 + c[Σ_k m_k K_ε(|x − x_k|) + Σ_k q_k/(|x − x_k|² + ε²) + 定数](エンジンの行の対角と同じ形 —— 点の核)。
//   ・受け手の球面(半径 R_i)の上の場 u = N/D の剛体成分 U = ⟨u⟩・Ω_D = (3/(2R_i²))⟨ξ × (u(x_i+ξ) − U)⟩(最小二乗の剛体回転 ——
//     小さい受け手の極限は ½∇×u)。R_i と R_i/2 の Richardson で R_i → 0 の極限を作る。
//   ・閉じた式の小道具: 遠方の型 (f/2)[(2−q)Ω + q r̂(r̂·Ω)] と、源の軸方向の成分が 0 になる仰角 asin(√((q−2)/q))。
//
// ■ しないこと: html を読まない・エンジンの式を写さない(エンジンの閉じた式 inertialDrag3AxialSphereAt と**独立に**求積する —— 器が両者を比べる)。
export const LIB_VERSION = 'w307a-sphereaxial-lib-1';

/* ───────── 3 ベクトル ───────── */
export const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const norm = (a) => Math.sqrt(dot(a, a));
export const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const scale = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
export const unit = (a) => scale(a, 1 / norm(a));
/** 仰角 el(源の赤道面から)・方位 az の単位ベクトル —— 源の軸 â と、â に垂直な基底 e1(既定は â×ŷ か â×x̂)で */
export function dirAt(axis, elDeg, azDeg) {
  const a = unit(axis), t = Math.abs(a[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
  const e1 = unit(cross(t, a)), e2 = cross(a, e1), el = elDeg * Math.PI / 180, az = (azDeg || 0) * Math.PI / 180;
  return add(scale(a, Math.sin(el)), add(scale(e1, Math.cos(el) * Math.cos(az)), scale(e2, Math.cos(el) * Math.sin(az))));
}

/* ───────── 求積 ───────── */
const GL = new Map();
/** [−1, 1] の Gauss–Legendre(Newton —— 節点 x・重み w) */
export function glNodes(n) {
  if (!Number.isInteger(n) || n < 1 || n > 200) throw new Error('glNodes: n');
  if (GL.has(n)) return GL.get(n);
  const x = new Array(n), w = new Array(n);
  for (let i = 0; i < n; i++) {
    let z = Math.cos(Math.PI * (i + 0.75) / (n + 0.5)), dp = 1;
    for (let it = 0; it < 100; it++) {
      let p0 = 1, p1 = z;
      for (let l = 2; l <= n; l++) { const p = ((2 * l - 1) * z * p1 - (l - 1) * p0) / l; p0 = p1; p1 = p; }
      dp = n * (z * p1 - p0) / (z * z - 1);
      const d = p1 / dp; z -= d;
      if (Math.abs(d) < 1e-16) break;
    }
    x[i] = z; w[i] = 2 / ((1 - z * z) * dp * dp);
  }
  const o = { x, w };
  GL.set(n, o);
  return o;
}
const SR = new Map();
/** 単位球面の求積(μ は Gauss–Legendre n 点・方位は 2n 等分 —— 重みの和 1・対蹠の点を含む) */
export function sphereRule(n) {
  if (SR.has(n)) return SR.get(n);
  const g = glNodes(n), np = 2 * n, out = [];
  for (let i = 0; i < n; i++) {
    const z = g.x[i], t = Math.sqrt(Math.max(0, 1 - z * z)), w = g.w[i] / 2 / np;
    for (let j = 0; j < np; j++) { const a = 2 * Math.PI * (j + 0.5) / np; out.push({ s: [t * Math.cos(a), t * Math.sin(a), z], w }); }
  }
  SR.set(n, out);
  return out;
}
const BR = new Map();
/** 一様球の動径の求積(t = |ρ|/R ∈ (0,1)・重み 3t² dt —— 和 1) */
export function ballRadial(nr) {
  if (BR.has(nr)) return BR.get(nr);
  const g = glNodes(nr), out = [];
  for (let k = 0; k < nr; k++) { const t = 0.5 * (g.x[k] + 1); out.push({ t, w: 0.5 * g.w[k] * 3 * t * t }); }
  BR.set(nr, out);
  return out;
}

/* ───────── 核 ───────── */
/** 点の核 K_ε(s) = s/(s² + ε²)²(s² で渡す) */
export const kernelK = (s2, e2) => Math.sqrt(s2) / ((s2 + e2) * (s2 + e2));
/** 対蹠の対: K(|d − ρ|) − K(|d + ρ|)(|d−ρ|² − |d+ρ|² = −4 d·ρ を正確に —— log1p/expm1 で遠方の桁落ちを防ぐ) */
export function kernelDiff(d, rho, e2) {
  const b2 = dot(add(d, rho), add(d, rho)), dr = -4 * dot(d, rho);
  const kb = kernelK(b2, e2);
  const lr = 0.5 * Math.log1p(dr / b2) - 2 * Math.log1p(dr / (b2 + e2));
  return kb * Math.expm1(lr);
}

/* ───────── 源の分子(直接の求積)───────── */
/** 源 src = {p, m, Om, a(単位の軸), R, kind:'ball'|'shell'} の N(x)/c = m Ω ⟨K_ε(|x − p − ρ|)(â × ρ)⟩。opt = {nS(球面の次数), nR(動径の次数), eps} */
export function sourceN(x, src, opt) {
  const e2 = (opt.eps || 0) ** 2, d = sub(x, src.p), rule = sphereRule(opt.nS), radial = src.kind === 'shell' ? [{ t: 1, w: 1 }] : ballRadial(opt.nR);
  let acc = [0, 0, 0];
  for (const { t, w: wr } of radial) {
    const Rt = src.R * t;
    for (const { s, w } of rule) {
      const rho = scale(s, Rt), kd = kernelDiff(d, rho, e2), v = cross(src.a, rho);
      acc = add(acc, scale(v, 0.5 * w * wr * kd));   // 対蹠の対の半分ずつ(rule は対蹠を含む)
    }
  }
  return scale(acc, src.m * src.Om);
}
/** M1(r) = ⟨K_ε(|d − ρ|)(ρ·ê)⟩(源の中心から受け手まで r・単位質量)の直接の求積 —— エンジンの inertialSpinMoment(ball)と比べる */
export function sourceM1(r, R, kind, opt) {
  const e2 = (opt.eps || 0) ** 2, d = [0, 0, r], rule = sphereRule(opt.nS), radial = kind === 'shell' ? [{ t: 1, w: 1 }] : ballRadial(opt.nR);
  let acc = 0;
  for (const { t, w: wr } of radial) for (const { s, w } of rule) { const rho = scale(s, R * t); acc += 0.5 * w * wr * kernelDiff(d, rho, e2) * rho[2]; }
  return acc;   // 対 (ρ, −ρ): K(|d−ρ|)ρ_z + K(|d+ρ|)(−ρ_z) = (K(|d−ρ|) − K(|d+ρ|)) ρ_z(rule は対蹠を含むので半分ずつ)
}
/** 薄い球面の M1 の閉じた式(エンジンの球の M1 の被積分関数を s = R で 1 回だけ —— (t1 − t2 − Δ)/(4 r² R)) */
export function shellM1Closed(r, R, eps) {
  const e2 = eps * eps, a = r * r + R * R, d2 = r + R, d1 = Math.abs(r - R), D = d2 - d1;
  const t1 = (eps > 0) ? (a + 3 * e2) / (2 * eps) * Math.atan(eps * D / (e2 + d1 * d2)) : a * D / (2 * d1 * d2);
  const t2 = (a + e2) / 2 * (d2 / (d2 * d2 + e2) - d1 / (d1 * d1 + e2));
  return (t1 - t2 - D) / (4 * r * r * R);
}

/* ───────── 場と分母 ───────── */
/** cfg = {C, eps, sources:[{p,m,Om,a,R,kind}], masses:[{p,m}](分母の点の核 —— 引きずりの対), i2:[{p,q}](分母の r⁻² の項)|null, Dconst(定数 —— 自己・背景側)}。
 *  受け手の対の除外は cfg を組む側が sources/masses から外す */
export function denomOf(x, cfg) {
  const e2 = (cfg.eps || 0) ** 2;
  let W = cfg.Dconst || 0;
  for (const s of cfg.masses) { const d = sub(x, s.p); W += s.m * kernelK(dot(d, d), e2); }
  if (cfg.i2) for (const s of cfg.i2) { const d = sub(x, s.p); W += s.q / (dot(d, d) + e2); }
  return 1 + cfg.C * W;
}
export function fieldU(x, cfg, opt) {
  let N = [0, 0, 0];
  for (const s of cfg.sources) N = add(N, sourceN(x, s, { ...opt, eps: cfg.eps }));
  return scale(N, cfg.C / denomOf(x, cfg));
}
/** 受け手の球面(中心 xc・半径 Ri)の剛体成分: U = ⟨u⟩・Ω = (3/(2Ri²))⟨ξ × (u − U)⟩(対蹠の対で ξ × (u(x+ξ) − u(x−ξ))/2 —— U は対で消える) */
export function rigidPart(xc, Ri, cfg, opt) {
  const rule = sphereRule(opt.nRec);
  let U = [0, 0, 0], O = [0, 0, 0];
  for (const { s, w } of rule) {
    const xi = scale(s, Ri), up = fieldU(add(xc, xi), cfg, opt), um = fieldU(sub(xc, xi), cfg, opt);
    U = add(U, scale(add(up, um), 0.5 * w));
    O = add(O, scale(cross(xi, sub(up, um)), 0.5 * w));
  }
  return { U, Om: scale(O, 3 / (2 * Ri * Ri)) };
}
/** R_i → 0 の極限(R_i と R_i/2 の Richardson —— 補正は R_i² の偶関数) */
export function rigidLimit(xc, Ri, cfg, opt) {
  const a = rigidPart(xc, Ri, cfg, opt), b = rigidPart(xc, Ri / 2, cfg, opt);
  return { Om: scale(sub(scale(b.Om, 4), a.Om), 1 / 3), OmR: a.Om, OmR2: b.Om, U: b.U };
}

/* ───────── 閉じた式の小道具 ───────── */
/** 遠方の型 Ω_D = (f/2)[(2−q)Ω + q r̂(r̂·Ω)](Ω = Ω â・f = |u|/(r sinθ |Ω|) の符号つき —— 呼び手が f を渡す) */
export function farForm(f, q, OmVec, rhat) { return scale(add(scale(OmVec, 2 - q), scale(rhat, q * dot(rhat, OmVec))), f / 2); }
/** 源の軸方向の成分が 0 になる仰角(源の赤道面から)asin(√((q−2)/q))[度](q ≤ 2 は 0) */
export const zeroElevationDeg = (q) => (q > 2) ? Math.asin(Math.sqrt((q - 2) / q)) * 180 / Math.PI : 0;
