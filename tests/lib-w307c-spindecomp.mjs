// 第307便c(原仮定者の裁定(第100報)「観測の自転を慣性軸回転と引きずり軸回転に分解する」「観測の自転が安定なら、引きずり軸回転と潮汐のブレーキが釣り合う」・
// 決断事項 AN345 ④・統括の検証項目 R211)—— **自転の分解と「釣り合い」の式の参照の純関数**(Node だけ・html を読まない・エンジンの式ではない)。
//
// ■ 球面の回転引きずりの場(源 j の球面 —— 半径 R_d,j・質量 m_j が球面に一様・慣性軸回転のベクトル Ω_j・源の位置は凍結)
//     N_j(d) = m_j ⟨K_ε(|d − ρ|) (Ω_j × ρ)⟩_{|ρ|=R_d,j}      K_ε(r) = r/(r² + ε²)²(並進と同じ点の核)
//     D_j(d) = m_j ⟨K_ε(|d − ρ|)⟩・I_j(d) = q_j ⟨1/(|d − ρ|² + ε²)⟩(q_j = m_j/λ_j —— λ ∝ m なら c₀²/(2kG))
//     u_j(d) = N_j/(Ŵ_i + I_j + D_j)(対ごとの分母 —— Ŵ_i = W_bg + 受け手の自己の項。D_j は対の solve の 1 + β の分)
//   ρ と −ρ の対で K(|d−ρ|) − K(|d+ρ|) を log1p/expm1 で作る(遠方の打ち消しの桁落ちを避ける)。
// ■ 受け手の球面の剛体回転成分(第100報の「近い側と遠い側の回転引きずりの差分」をベクトルにした形)
//     U_i = ⟨u(x_i + ξ)⟩・Ω_D,i = (3/(2R²)) ⟨ξ × (u(x_i + ξ) − U_i)⟩(|ξ| = R —— 剛体の流れ Ω×ξ で Ω を返す最小二乗)
//   小さい受け手の極限は ½∇×u(curl の半分)。遠方 u = g(r)(Ω×d)・g ∝ r^{−q} なら Ω_D = (g/2)[(2 − q)Ω + q r̂(r̂·Ω)]
//   (q ≈ 3: 慣性決定力 I ∝ r⁻² が分母を支配・q ≈ 5: 背景 Ŵ が支配 —— 角度分布は分母の距離則に依る)。
// ■ 三次元の CTL(定時間遅延 —— tests/lib-w292d-tide.mjs の ctlPair をベクトルへ。平面の極限で一致を器が確かめる)
//     B = G k₂ m_j² R⁵・s = V − Ω×r・F_diss = −(3BΔt/r¹⁰)[2r(r·V) + r² s]・τ_i = −r × F_diss・H = (3BΔt/r¹⁰)[2(r·V)² + r²|s|²] ≥ 0
//     恒等式 P_orb + τ·Ω + H = 0(P_orb = F_diss·V)。
// ■ 内部熱(線形の緩和): Ė = H − E/τ_cool(一定の H の区間で厳密に積分 —— 初期値 0 は診断の基準)。
// ■ 釣り合いの仮説(固定の軸 â_i へのスカラー —— ω_obs = ω_I + ω_D・ω̇_obs = τ/I + ω̇_D)
//     A: ブレーキの滑りを観測の自転 ω_I + ω_D で測る(トルクは慣性自転へ)/ B: 滑りを慣性自転 ω_I で測る /
//     C: B に加えて引きずり軸回転が慣性自転へ ω_D/τ_C の角加速度として効く(今の契約を変える案 —— 比較だけ)。
// ■ 言わないこと: 「金星の逆行を説明した」「イオの観測の加熱と一致した」「自転が釣り合った」「磁気双極子と同じ」(器は写しの中で数を並べるだけ)。
export const LIB_VERSION = 'w307c-spindecomp-lib-1';

export const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const scale = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
export const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const norm = (a) => Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
export const unit = (a) => { const n = norm(a); return [a[0] / n, a[1] / n, a[2] / n]; };
const finite3 = (a) => Array.isArray(a) && a.length === 3 && a.every(Number.isFinite);

/* ───────────── 球面の求積(μ 方向 Gauss–Legendre n 点 × 方位 2n 点 —— 重みの和 1・対蹠点の対) ───────────── */
const RULES = new Map();
function legendre(n, z) { let p0 = 1, p1 = z; for (let l = 2; l <= n; l++) { const p = ((2 * l - 1) * z * p1 - (l - 1) * p0) / l; p0 = p1; p1 = p; } return { p: p1, dp: n * (z * p1 - p0) / (z * z - 1) }; }
/**
 * 対蹠点の対の代表(z > 0 の環の全方位 + z = 0 の環の方位の前半)。各代表 {s, w}: s と −s の両方が重み w を持つ(全球の和 = Σ w (f(s) + f(−s)))。
 * @param {number} n μ 方向の点数(4〜64)
 */
export function sphereRule(n) {
  if (!Number.isInteger(n) || n < 2 || n > 64) throw new Error('求積の次数');
  if (RULES.has(n)) return RULES.get(n);
  const zs = [];
  for (let i = 1; i <= Math.floor(n / 2); i++) {
    let z = Math.cos(Math.PI * (i - 0.25) / (n + 0.5));
    for (let it = 0; it < 100; it++) { const q = legendre(n, z), dz = q.p / q.dp; z -= dz; if (Math.abs(dz) < 1e-16) break; }
    const q = legendre(n, z);
    zs.push({ z, w: 2 / ((1 - z * z) * q.dp * q.dp) });
  }
  if (n % 2 === 1) { const q = legendre(n, 0); zs.push({ z: 0, w: 2 / (q.dp * q.dp) }); }
  const np = 2 * n, out = [];
  for (const { z, w } of zs) {
    const t = Math.sqrt(1 - z * z), wp = w / 2 / np, na = (z === 0) ? n : np;
    for (let j = 0; j < na; j++) { const a = 2 * Math.PI * j / np; out.push({ s: [t * Math.cos(a), t * Math.sin(a), z], w: wp }); }
  }
  RULES.set(n, out);
  return out;
}
/** 全球の和 ⟨f⟩(代表の対で)。 */
export function sphereMean(n, f) { let s = 0; for (const { s: p, w } of sphereRule(n)) s += w * (f(p) + f(scale(p, -1))); return s; }

/* ───────────── 源の球面の回転引きずりの場 ───────────── */
const Kpt = (r2, e2) => { const s = r2 + e2; return Math.sqrt(r2) / (s * s); };
/**
 * 凍結した源 j の球面の場を点 d(源の中心から)で。src = {m, R, Om:[3](慣性軸回転のベクトル), q, What(受け手の Ŵ), eps, extra?:[{x:[3], m, q}](行の分母の対照 —— 他の源の点の I + D を分母へ), denFix?(分母を固定)}
 * @returns {{u:number[], N:number[], D:number, I:number, den:number}}
 */
export function shellField(d, src, order = 12) {
  const { m, R, Om, q } = src, What = src.What || 0, eps = src.eps || 0, e2 = eps * eps;
  if (!finite3(d) || !finite3(Om) || ![m, R, q, What, eps].every(Number.isFinite) || !(m > 0) || R < 0 || !(q >= 0) || What < 0 || eps < 0 || !(norm(d) > R)) throw new Error('源の球面の定義域');
  const N = [0, 0, 0]; let D = 0, I = 0;
  if (R === 0) { const r2 = dot(d, d); D = m * Kpt(r2, e2); I = q / (r2 + e2); }
  else for (const { s, w } of sphereRule(order)) {
    const rho = scale(s, R), b = add(d, rho), b2 = dot(b, b), a2 = b2 - 4 * dot(d, rho);
    const kb = Kpt(b2, e2), delta = a2 - b2;
    const lr = 0.5 * Math.log1p(delta / b2) - 2 * Math.log1p(delta / (b2 + e2));
    const kd = kb * Math.expm1(lr), ka = kb + kd, v = cross(Om, rho);   // kd = K(|d−ρ|) − K(|d+ρ|)
    N[0] += w * m * kd * v[0]; N[1] += w * m * kd * v[1]; N[2] += w * m * kd * v[2];
    D += w * m * (ka + kb);
    I += w * q * (1 / (a2 + e2) + 1 / (b2 + e2));
  }
  let ext = 0;
  if (src.extra) for (const x of src.extra) { const z = sub(d, x.x), r2 = dot(z, z); ext += x.q / (r2 + e2) + x.m * Kpt(r2, e2); }
  const den = (src.denFix !== undefined) ? src.denFix : What + I + D + ext;   // denFix: 分母を 1 点(受け手の中心)の値に固定する対照
  return { u: scale(N, 1 / den), N, D, I, den: What + I + D + ext };
}
/**
 * 受け手の球面(半径 Rrec・中心は源から d)の剛体回転成分と平均の移動。field(p) は源の中心からの点 p の速度。
 * @returns {{U:number[], omega:number[]}}
 */
export function rigidPart(d, Rrec, field, order = 12) {
  if (!(Rrec > 0) || !Number.isFinite(Rrec)) throw new Error('受け手の半径');
  let U = [0, 0, 0], om = [0, 0, 0];
  for (const { s, w } of sphereRule(order)) {
    const xi = scale(s, Rrec), up = field(add(d, xi)), um = field(sub(d, xi));
    U = add(U, scale(add(up, um), w));
    om = add(om, scale(cross(xi, sub(up, um)), w));
  }
  return { U, omega: scale(om, 3 / (2 * Rrec * Rrec)) };
}
/** 源の球面の場を受け手の球面で読む(重なり・接触は拒否)。 */
export function shellResponse(d, Rrec, src, order = 12) {
  if (!(norm(d) > src.R + Rrec)) throw new Error('球面の重なり');
  return rigidPart(d, Rrec, (p) => shellField(p, src, order).u, order);
}
/** ½∇×u の中心差分(小さい受け手の極限の対照)。 */
export function curlHalf(d, src, order, h) {
  const u = (p) => shellField(p, src, order).u, e = [[h, 0, 0], [0, h, 0], [0, 0, h]];
  const J = e.map((dx) => scale(sub(u(add(d, dx)), u(sub(d, dx))), 1 / (2 * h)));   // J[a][b] = ∂u_b/∂x_a
  return [0.5 * (J[1][2] - J[2][1]), 0.5 * (J[2][0] - J[0][2]), 0.5 * (J[0][1] - J[1][0])];
}
/**
 * 遠方の閉じた式(解析 —— 球面の 1 次の多重極 N ≈ m R² r⁻⁵ (Ω × d)・分母 Ŵ + q/r² + m/r³ の距離則・ε = 0)。
 * @returns {{omega:number[], g:number, qEff:number, den:number}}
 */
export function farField(d, src) {
  const r = norm(d), rh = scale(d, 1 / r), r2 = r * r, r3 = r2 * r, Om = src.Om, What = src.What || 0;
  const den = What + src.q / r2 + src.m / r3, g = src.m * src.R * src.R / (r2 * r3) / den;
  const qEff = 5 - (2 * src.q / r2 + 3 * src.m / r3) / den;
  const omega = scale(add(scale(Om, 2 - qEff), scale(rh, qEff * dot(rh, Om))), g / 2);
  return { omega, g, qEff, den };
}

/* ───────────── 三次元の CTL・内部熱 ───────────── */
/** 1 対(i が受け手・j が潮汐を起こす点質量)。r = x_j − x_i・V = v_j − v_i・omega = 受け手の自転のベクトル(滑りが読む自転)。 */
export function ctl3({ G, k2, lag, R, mj, r, V, omega }) {
  if (![r, V, omega].every(finite3) || ![G, k2, lag, R, mj].every(Number.isFinite) || !(G > 0) || !(k2 >= 0) || lag < 0 || !(R > 0) || !(mj > 0)) throw new Error('CTL の定義域');
  const r2 = dot(r, r); if (!(r2 > 0)) throw new Error('潮汐の一致点');
  const R2 = R * R, B = G * k2 * mj * mj * R2 * R2 * R, r4 = r2 * r2, r6 = r4 * r2, r8 = r4 * r4;
  const cons = scale(r, -3 * B / r8), s = sub(V, cross(omega, r)), rv = dot(r, V), dd = 3 * B * lag / (r8 * r2);
  const diss = scale(add(scale(r, 2 * rv), scale(s, r2)), -dd), torque = scale(cross(r, diss), -1);
  const heat = dd * (2 * rv * rv + r2 * dot(s, s));
  return { B, cons, diss, torque, heat, powerOrbit: dot(diss, V), powerSpin: dot(torque, omega), Kspin: 3 * B * lag / r6 };
}
/** 内部熱の線形の緩和(一定の H を h の間 —— 厳密)。tau = Infinity は放射なし。 */
export function heatCell(E, H, h, tau) {
  if (![E, H, h].every(Number.isFinite) || E < 0 || H < 0 || h < 0 || (!(tau > 0))) throw new Error('内部熱の定義域');
  if (tau === Infinity) return { E: E + H * h, radiated: 0 };
  const loss = -Math.expm1(-h / tau), E1 = E * (1 - loss) + H * tau * loss;
  return { E: E1, radiated: E + H * h - E1 };
}

/* ───────────── 二体のケプラー(写しの軌道を固定 —— 潮汐の反作用は帳簿だけ) ───────────── */
export function keplerElements(r0, v0, mu) {
  const r = norm(r0), v2 = dot(v0, v0), h = cross(r0, v0), hn = norm(h);
  const a = 1 / (2 / r - v2 / mu), ev = sub(scale(cross(v0, h), 1 / mu), scale(r0, 1 / r)), e = norm(ev);
  if (!(a > 0) || !(e < 1)) throw new Error('楕円でない');
  const P0 = e > 1e-12 ? scale(ev, 1 / e) : scale(r0, 1 / r), Q0 = cross(scale(h, 1 / hn), P0);
  const n = Math.sqrt(mu / (a * a * a)), cosE = (1 - r / a) / (e > 1e-12 ? e : 1), sinE = dot(r0, v0) / (e > 1e-12 ? e * Math.sqrt(mu * a) : Math.sqrt(mu * a));
  let E0 = e > 1e-12 ? Math.atan2(sinE, cosE) : Math.atan2(dot(r0, Q0), dot(r0, P0));
  const M0 = E0 - e * Math.sin(E0);
  return { a, e, n, P: 2 * Math.PI / n, Phat: P0, Qhat: Q0, hhat: scale(h, 1 / hn), M0, mu };
}
export function keplerState(el, t) {
  const M = el.M0 + el.n * t, e = el.e;
  let E = M; for (let it = 0; it < 60; it++) { const dE = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E)); E -= dE; if (Math.abs(dE) < 1e-15) break; }
  const c = Math.cos(E), s = Math.sin(E), b = Math.sqrt(1 - e * e), f = el.n * el.a / (1 - e * c);
  return { r: add(scale(el.Phat, el.a * (c - e)), scale(el.Qhat, el.a * b * s)), v: add(scale(el.Phat, -f * s), scale(el.Qhat, f * b * c)) };
}

/* ───────────── 線形の解(部分ピボット) ───────────── */
export function solveLinear(A0, b0) {
  const n = b0.length, A = A0.map((r, i) => [...r, b0[i]]);
  for (let i = 0; i < n; i++) {
    let p = i; for (let j = i + 1; j < n; j++) if (Math.abs(A[j][i]) > Math.abs(A[p][i])) p = j;
    [A[i], A[p]] = [A[p], A[i]];
    const v = A[i][i]; if (!(Math.abs(v) > 0)) throw new Error('特異');
    for (let k = i; k <= n; k++) A[i][k] /= v;
    for (let j = 0; j < n; j++) if (j !== i) { const f = A[j][i]; if (f !== 0) for (let k = i; k <= n; k++) A[j][k] -= f * A[i][k]; }
  }
  return A.map((r) => r[n]);
}
/**
 * 瞬間の分解: ω_obs,i = ω_I,i + Σ_j B_ij ω_I,j(B_ij = 源 j の単位の慣性軸回転が受け手 i の軸へ作る引きずり軸回転)。fixed の天体は ω_I = ω_obs(分解しない)。
 * @returns {{omegaI:number[], omegaD:number[]}}
 */
export function decompose(B, omegaObs, fixed) {
  const n = omegaObs.length, unk = [...Array(n).keys()].filter((i) => !fixed.includes(i));
  const A = unk.map((i) => unk.map((j) => (i === j ? 1 : 0) + B[i][j]));
  const rhs = unk.map((i) => omegaObs[i] - fixed.reduce((s, j) => s + B[i][j] * omegaObs[j], 0));
  const sol = solveLinear(A, rhs), wI = omegaObs.slice();
  unk.forEach((i, k) => { wI[i] = sol[k]; });
  const wD = omegaObs.map((_, i) => (fixed.includes(i) ? 0 : wI.reduce((s, w, j) => s + (j === i ? 0 : B[i][j] * w), 0)));
  return { omegaI: wI, omegaD: wD };
}

/* ───────────── 釣り合いの仮説の時間発展(固定の軌道・固定の軸 —— 慣性自転のスカラー ω_I) ───────────── */
export const HYPOTHESES = Object.freeze({
  A: '滑りを観測の自転 ω_I + ω_D で測る(トルクは慣性自転へ)',
  B: '滑りを慣性自転 ω_I で測る(引きずり軸回転はブレーキに見えない)',
  C: 'B + 引きずり軸回転が慣性自転へ ω_D/τ_C の角加速度(今の契約を変える案 —— 比較だけ)',
});
/**
 * o = {hyp, I, omega0, h, steps, tauC, tauCool, dragAt(k) → ω_D(半步の添字 k), tideAt(k, ωCtl) → {tq(τ·â), heat, pOrb}, sample(步の添字) → 真なら記録}
 * RK4(半步の添字 2s, 2s+1, 2s+1, 2s+2)。補助の積分(熱・軌道の仕事・自転の仕事・引きずりの仕事・C の供給)は同じ段の Simpson の重み。
 */
export function evolveSpin(o) {
  const { hyp, I, h, steps } = o, tauC = o.tauC || Infinity;
  const ctlOm = (k, w) => (hyp === 'A' ? w + o.dragAt(k) : w);
  const rate = (k, w) => {
    const T = o.tideAt(k, ctlOm(k, w)), wd = o.dragAt(k);
    const sup = (hyp === 'C') ? wd / tauC : 0;
    return { dw: T.tq / I + sup, heat: T.heat, pOrb: T.pOrb, pSpin: T.tq * w, pDrag: (hyp === 'A') ? T.tq * wd : 0, pSup: I * w * sup };
  };
  let w = o.omega0, E = 0, rad = 0;
  const acc = { heat: 0, pOrb: 0, pSpin: 0, pDrag: 0, pSup: 0 };
  const rec = [];
  for (let s = 0; s < steps; s++) {
    const k0 = 2 * s, r1 = rate(k0, w), r2 = rate(k0 + 1, w + 0.5 * h * r1.dw), r3 = rate(k0 + 1, w + 0.5 * h * r2.dw), r4 = rate(k0 + 2, w + h * r3.dw);
    const sim = (key) => h / 6 * (r1[key] + 2 * r2[key] + 2 * r3[key] + r4[key]);
    const dH = sim('heat'), dd = {};
    for (const key of Object.keys(acc)) { dd[key] = sim(key); acc[key] += dd[key]; }
    const hc = heatCell(E, Math.max(0, dH / h), h, o.tauCool || Infinity); E = hc.E; rad += hc.radiated;
    w = w + h / 6 * (r1.dw + 2 * r2.dw + 2 * r3.dw + r4.dw);
    if (o.sample && o.sample(s + 1)) rec.push({ s: s + 1, wI: w, wD: o.dragAt(k0 + 2), dH, E, dDrag: dd.pDrag, dSup: dd.pSup });
  }
  return { omegaI: w, E, radiated: rad, acc, rec };
}

/* ───────────── 純関数の確かめ(合成の配置 —— 器が正本に記録し、QA が同じ関数で引き直す) ───────────── */
export function checksOf() {
  const g = {}, v = {};
  const rel = (a, b) => norm(sub(a, b)) / Math.max(norm(b), 1e-300);
  // ① 求積の重み(定数 ½ の平均 = ½)・二次・四次のモーメント
  v.moments = [sphereMean(12, () => 0.5), sphereMean(12, (s) => s[0] * s[0]), sphereMean(12, (s) => s[2] * s[2] * s[2] * s[2]), sphereMean(7, (s) => s[1] * s[1])];
  g.quadratureMoments = Math.abs(v.moments[0] - 0.5) < 1e-15 && Math.abs(v.moments[1] - 1 / 3) < 1e-13 && Math.abs(v.moments[2] - 1 / 5) < 1e-13 && Math.abs(v.moments[3] - 1 / 3) < 1e-13;
  // ② 自転 0・源の半径 0 は場 0
  const src = { m: 1, R: 0.001, Om: [0, 0, 1], q: 1e6, What: 0, eps: 0 };
  g.zeroSource = norm(shellField([1, 0, 0], { ...src, Om: [0, 0, 0] }).u) === 0 && norm(shellField([1, 0, 0], { ...src, R: 0 }).u) === 0;
  // ③ 赤道で逆・軸で同じ(慣性決定力が分母を支配 —— q ≈ 3・f = λR² at r = 1)
  const f = src.R * src.R / src.q;
  const eq = shellResponse([1, 0, 0], 0.001, src), pole = shellResponse([0, 0, 1], 0.001, src);
  v.equator = eq.omega[2] / f; v.pole = pole.omega[2] / f;
  g.equatorReversePoleSame = rel(eq.omega, [0, 0, -f / 2]) < 3e-5 && rel(pole.omega, [0, 0, f]) < 3e-5;
  // ④ 源の自転の反転で反転(奇)
  g.spinOdd = rel(shellResponse([1, 0, 0], 0.001, { ...src, Om: [0, 0, -1] }).omega, scale(eq.omega, -1)) < 1e-12;
  // ⑤ 中間の緯度のベクトルの形 (f/2)(3μ r̂ − ẑ)・源の軸への投影が 0 になる仰角 35.264°(ベクトルは 0 でない)
  const mu = 0.5, dm = [Math.sqrt(1 - mu * mu), 0, mu];
  g.vectorForm = rel(shellResponse(dm, 0.001, src).omega, scale(sub(scale(dm, 3 * mu), [0, 0, 1]), f / 2)) < 3e-5;
  const m0 = 1 / Math.sqrt(3), d0 = [Math.sqrt(1 - m0 * m0), 0, m0], z0 = shellResponse(d0, 0.001, src).omega;
  v.nullElevationDeg = Math.asin(m0) * 180 / Math.PI; v.nullAxial = z0[2] / f; v.nullMag = norm(z0) / f;
  g.nullLine = Math.abs(v.nullAxial) < 1e-4 && Math.abs(v.nullMag - Math.SQRT2 / 2) < 1e-4;
  // ⑥ 背景が分母を支配(q ≈ 5): 赤道 −3f′/2・軸 +f′(f′ = R²/Ŵ at r = 1)
  const bg = { ...src, q: 1e-9, What: 1e12 }, fb = src.R * src.R / 1e12;
  v.bgEquator = shellResponse([1, 0, 0], 0.001, bg).omega[2] / fb; v.bgPole = shellResponse([0, 0, 1], 0.001, bg).omega[2] / fb;
  g.denominatorLaw = Math.abs(v.bgEquator + 1.5) < 1e-4 && Math.abs(v.bgPole - 1) < 1e-4;
  // ⑦ 剛体の流れ Ω₀ × (x − c) + U₀ の抽出は Ω₀・U₀ を丸めで返す(3/(2R²) の係数)
  const Om0 = [0.3, -0.7, 1.1], U0 = [2, -1, 0.5], c0 = [1, 2, -3];
  const rg = rigidPart([4, -1, 2], 0.37, (p) => add(U0, cross(Om0, sub(add(p, c0), add([4, -1, 2], c0)))), 9);
  v.rigidErr = [rel(rg.omega, Om0), rel(rg.U, U0)];
  g.rigidExact = v.rigidErr[0] < 1e-13 && v.rigidErr[1] < 1e-13;
  // ⑧ 小さい受け手の極限 = ½∇×u(中心差分)
  const s8 = { m: 1, R: 0.2, Om: [0.2, 0.1, 1], q: 0.03, What: 0.5, eps: 0 }, d8 = [1.5, 0.3, 0.4];
  v.curlHalf = rel(shellResponse(d8, 1e-4, s8, 12).omega, curlHalf(d8, s8, 12, 1e-4));
  g.curlHalf = v.curlHalf < 1e-5;
  // ⑨ 近い配置の求積の収束(8 → 16)
  const a8 = shellResponse([1.5, 0, 0.2], 0.07, { ...s8, R: 0.2 }, 8), a16 = shellResponse([1.5, 0, 0.2], 0.07, { ...s8, R: 0.2 }, 16);
  v.nearConv = rel(a8.omega, a16.omega);
  g.nearConvergence = v.nearConv < 1e-6;
  // ⑩ CTL: 非共面で発熱 ≥ 0・仕事と熱の恒等式・回転の共変・同期の円軌道で散逸 0
  const t1 = ctl3({ G: 1, k2: 0.3, lag: 0.05, R: 0.7, mj: 2, r: [3, 0.4, 0.8], V: [-0.2, 0.6, 0.1], omega: [0.2, -0.1, 0.8] });
  v.ctlIdentity = (t1.powerOrbit + t1.powerSpin + t1.heat) / Math.max(t1.heat, Math.abs(t1.powerSpin), Math.abs(t1.powerOrbit));
  const perm = (x) => [x[1], x[2], x[0]], t2 = ctl3({ G: 1, k2: 0.3, lag: 0.05, R: 0.7, mj: 2, r: perm([3, 0.4, 0.8]), V: perm([-0.2, 0.6, 0.1]), omega: perm([0.2, -0.1, 0.8]) });
  v.ctlCovariant = Math.max(rel(t2.torque, perm(t1.torque)), rel(t2.diss, perm(t1.diss)));
  const nn = Math.sqrt(1 / 27), t3 = ctl3({ G: 1, k2: 0.3, lag: 0.05, R: 0.2, mj: 1, r: [3, 0, 0], V: [0, 3 * nn, 0], omega: [0, 0, nn] });
  v.ctlSync = t3.heat;
  g.ctlWorkHeat = t1.heat > 0 && Math.abs(v.ctlIdentity) < 1e-12 && v.ctlCovariant < 1e-13 && Math.abs(v.ctlSync) < 1e-30;
  // ⑪ 内部熱: 半步 2 回 = 1 步・収支・τ = ∞
  const hc = heatCell(3, 2, 0.4, 5), hh = heatCell(heatCell(3, 2, 0.2, 5).E, 2, 0.2, 5);
  v.heatHalf = Math.abs(hc.E - hh.E);
  g.internalHeat = hc.E >= 0 && hc.radiated >= 0 && v.heatHalf < 1e-13 && Math.abs(hc.E + hc.radiated - 3 - 0.8) < 1e-13 && heatCell(3, 2, 0.4, Infinity).radiated === 0;
  // ⑫ ケプラー: 1 周期で元へ・エネルギーと角運動量
  const el = keplerElements([1, 0.1, 0.05], [0.1, 1.05, 0.2], 1), s0 = keplerState(el, 0), s1 = keplerState(el, el.P), sh = keplerState(el, 0.37 * el.P);
  const en = (s) => 0.5 * dot(s.v, s.v) - 1 / norm(s.r);
  v.kepler = [rel(s0.r, [1, 0.1, 0.05]), rel(s0.v, [0.1, 1.05, 0.2]), rel(s1.r, s0.r), Math.abs(en(sh) / en(s0) - 1), rel(cross(sh.r, sh.v), cross(s0.r, s0.v))];
  g.kepler = v.kepler.every((x) => x < 1e-12);
  // ⑬ 線形の解と分解の再構成
  const B = [[0, 0.2, 0.01], [0.3, 0, -0.1], [0.05, 0.4, 0]], wo = [1, -2, 0.5], dc = decompose(B, wo, [0]);
  v.decomp = Math.max(...wo.map((w, i) => Math.abs(dc.omegaI[i] + dc.omegaD[i] - w)));
  g.decomposeExact = v.decomp < 1e-15 && dc.omegaI[0] === 1;
  return { gates: g, values: v };
}
