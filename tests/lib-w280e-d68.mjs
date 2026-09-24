// 第280便e(原仮定者の裁定(第70報)「saturnZonalD(68): 観測値版で問題が出ている理由を調査する」・統括の検証項目 R67):
// **📡 D68 の帯状ポテンシャルの純関数**(副作用なし・html を読まない・エンジンを走らせない)。
//
// ■ 何を計算するか(**同じポテンシャル**から独立に)
//   U(r) = −GM/√(r²+ε²) − C·GM/r·Σ_l A_l (R/r)^l、A_l = −J_l·P_l(0)(l = 2,4,…,12)
//   ・単極子だけが Plummer 軟化 ε を持ち、帯状補正は軟化しない(エンジンの E4 + E13 と同じ分け方)。
//   ・C(calib)は**ポテンシャル/力**に掛かる(エンジンの E13: Δa_r = −C·(GM/r²)·Σ(l+1)A_l(R/r)^l)。
//   ① 円軌道極限: Ω² = g(a)/a、κ² = 3g/a + g′(a)(g = 内向きの動径加速度)→ ϖ̇ = Ω − κ。
//   ② 実軌道: 初期条件(r0 の転回点と接線速度)からエネルギーと角運動量を作り、**動径運動の ODE**
//      r̈ = −g(r) + L²/r³・θ̇ = L/r² を RK4 で半周期(近点 → 遠点)積分して、遠点半径・近点間周期 T_r・
//      近点移動 Δϖ = 2θ(遠点) − 2π を出す(ODE で解くのは転回点付近の桁落ちを避けるため。
//      刻みを 2 段にして差を記録する)。
//   ③ 整合した初速: r_p = a(1−e*)・r_a = a(1+e*) を**同じ U で**転回点にする速度
//      v_p² = 2[U(r_a) − U(r_p)] / (1 − r_p²/r_a²)。
//
// ■ このモジュールが言わないこと
//   「D68 が合/否」「観測一致を達成した」。合否は門(tests/exp-w249b-calaudit.mjs)が出す。
//   e* は診断用の値であって観測入力ではない。C は既存の fit 値(1.000302283)であって、ここで fit しない。

export const ZONAL_P0 = { 2: -1 / 2, 4: 3 / 8, 6: -5 / 16, 8: 35 / 128, 10: -63 / 256, 12: 231 / 1024 };
export const ZONAL_ORDERS = [2, 4, 6, 8, 10, 12];

// 📡 の宣言(beta/index.html の saturnZonalD68 をそのまま写した値 —— QA が html と突き合わせる)
export const D68_DECL = Object.freeze({
  G: 6.674, M: 56.834, refR: 60.330, calib: 1.000302283,
  J: Object.freeze({ 2: 0.016290573, 4: -0.000935314, 6: 0.000086340, 8: -0.000014624, 10: 0.000004672, 12: -0.000000997 }),
  aDecl: 67.627, eDecl: 0.05, eps: 0.05,
  x0: 64.245650, vy0: 2.518398,
  unitKm: 1000, unitSec: 100,           // scaleExp L=6(1 単位 = 10⁶ m)・T=2(1 単位 = 100 s)
});
export const DAY_SEC = 86400;
export const YEAR_SEC = 31557600;       // ユリウス年(判定器 lib-w258d-evidence と同じ)

/** 単位換算: rad/(時間単位) → deg/日・deg/年(unitSec = 1 時間単位の秒数)。 */
export function radPerTimeToDegPerDay(w, unitSec = 100) { return w * (DAY_SEC / unitSec) * 180 / Math.PI; }
export function radPerTimeToDegPerYear(w, unitSec = 100) { return w * (YEAR_SEC / unitSec) * 180 / Math.PI; }
export function degPerDayToDegPerYear(x) { return x * YEAR_SEC / DAY_SEC; }

/** [[l, A_l]](A_l = −J_l·P_l(0))。J が 0/欠落の次数は落とす。 */
export function zonalTerms(J) {
  const out = [];
  for (const l of ZONAL_ORDERS) {
    const v = (J && +J[l]) || 0;
    if (v !== 0) out.push([l, -v * ZONAL_P0[l]]);
  }
  return out;
}

function pars(P) {
  const p = P || {};
  const GM = (p.GM !== undefined) ? p.GM : p.G * p.M;
  return { GM, R: p.refR, C: (p.calib === undefined) ? 1 : p.calib, eps: p.eps || 0, T: zonalTerms(p.J) };
}

/** U(r)(単位質量あたり)。 */
export function potential(r, P) {
  const { GM, R, C, eps, T } = pars(P);
  let s = 0; for (const [l, A] of T) s += A * Math.pow(R / r, l);
  return -GM / Math.sqrt(r * r + eps * eps) - C * GM / r * s;
}
/** 内向き動径加速度 g(r) = dU/dr と、その微分 g′(r)。単極子分と帯状分を別に返す。 */
export function radialAccel(r, P) {
  const { GM, R, C, eps, T } = pars(P);
  const s2 = r * r + eps * eps;
  const g0 = GM * r / Math.pow(s2, 1.5);
  const dg0 = GM * (1 / Math.pow(s2, 1.5) - 3 * r * r / Math.pow(s2, 2.5));
  let gz = 0, dgz = 0;
  for (const [l, A] of T) {
    const z = A * Math.pow(R / r, l);
    gz += GM / (r * r) * (l + 1) * z;
    dgz += -GM / (r * r * r) * (l + 1) * (l + 2) * z;
  }
  return { g: g0 + C * gz, dg: dg0 + C * dgz, g0, dg0, gz, dgz, C };
}

/**
 * 円軌道極限の Ω・κ・ϖ̇ = Ω − κ(単位は P の時間単位の rad)。
 * **C はポテンシャルに掛ける**: Ω² = Ω0² + C·ΔΩ²・κ² = κ0² + C·Δκ²(帯状分を C 倍してから平方根)。
 * 旧ヘルパの C·(Ω−κ)(C=1 の Ω−κ に後から C を掛ける)も `legacyCTimesRate` に並べる。
 */
export function circularLimit(a, P) {
  const f = radialAccel(a, P);
  const O2 = f.g / a, K2 = 3 * f.g / a + f.dg;
  const O2u = (f.g0 + f.gz) / a, K2u = 3 * (f.g0 + f.gz) / a + (f.dg0 + f.dgz);   // C=1
  const omega = Math.sqrt(O2), kappa = Math.sqrt(K2);
  return { a, omega, kappa, rate: omega - kappa,
    legacyCTimesRate: f.C * (Math.sqrt(O2u) - Math.sqrt(K2u)) };
}

/** 整合した初速: r_p = a(1−e*)・r_a = a(1+e*) を転回点にする近点速度(同じ U)。 */
export function consistentPeriSpeed(a, eStar, P) {
  const rp = a * (1 - eStar), ra = a * (1 + eStar);
  const dU = potential(ra, P) - potential(rp, P);
  const vp2 = 2 * dU / (1 - (rp * rp) / (ra * ra));
  return { rp, ra, vp: Math.sqrt(vp2), va: Math.sqrt(vp2) * rp / ra };
}
/** 診断コピー 2 本の宣言(e* は診断用・ε=0.01=10 km・C と J は 📡 のまま)。 */
export const D68_DIAG = Object.freeze({ eStar: 0.001, eps: 0.01 });
/** saturnD68Consistent の初期条件(r_p = a(1−e*)・同じ U・ε=0.01)。 */
export function d68ConsistentIc() {
  const D = D68_DECL;
  return consistentPeriSpeed(D.aDecl, D68_DIAG.eStar,
    { G: D.G, M: D.M, refR: D.refR, calib: D.calib, J: D.J, eps: D68_DIAG.eps });
}
/** saturnD68ObsOrbit の初期条件(r_p = a − ae・r_a = a + ae —— 観測の幾何要素と同じ定義・ε=0.01)。 */
export function d68ObsOrbitIc(aeKm, aKm) {
  const D = D68_DECL;
  return consistentPeriSpeed(aKm / D.unitKm, aeKm / aKm,
    { G: D.G, M: D.M, refR: D.refR, calib: D.calib, J: D.J, eps: D68_DIAG.eps });
}
/** 現行 📡 の初速(帯状込みの局所円速度 × √(1+e)・r_p = a(1−e))。 */
export function currentPeriSpeed(a, e, P) {
  const rp = a * (1 - e);
  const f = radialAccel(rp, P);
  return { rp, vp: Math.sqrt(f.g * rp * (1 + e)), vc: Math.sqrt(f.g * rp) };
}

// ---- 動径運動の ODE(半周期)。state = [r, rdot, theta, t]
function rhs(s, L, P) {
  const r = s[0];
  const g = radialAccel(r, P).g;
  return [s[1], -g + L * L / (r * r * r), L / (r * r), 1];
}
function rk4(s, h, L, P) {
  const k1 = rhs(s, L, P);
  const s2 = s.map((v, i) => v + 0.5 * h * k1[i]); const k2 = rhs(s2, L, P);
  const s3 = s.map((v, i) => v + 0.5 * h * k2[i]); const k3 = rhs(s3, L, P);
  const s4 = s.map((v, i) => v + h * k3[i]); const k4 = rhs(s4, L, P);
  return s.map((v, i) => v + h / 6 * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
}
/**
 * 転回点 r0(ṙ=0)と接線速度 vt から、次の転回点まで積分する(nPerHalf = 半周期あたりの刻み数の目安)。
 * 戻り値: r0 側と反対側の転回点・半周期・角度(近点 → 遠点)。最後の区間は ṙ=0 を割線法で詰める。
 */
export function halfOrbit(r0, vt, P, nPerHalf = 20000) {
  const L = r0 * vt;
  const f0 = radialAccel(r0, P);
  const T0 = Math.PI / Math.sqrt(3 * f0.g / r0 + f0.dg);   // 円軌道極限の半周期(刻みの目安)
  const h = T0 / nPerHalf;
  let s = [r0, 0, 0, 0];
  // 最初の刻み: ṙ の符号が定まる(r0 が近点なら ṙ>0 になる)
  let prev = s; s = rk4(s, h, L, P);
  const sign0 = Math.sign(s[1]);
  let guard = 0;
  while (Math.sign(s[1]) === sign0 && guard < 50 * nPerHalf) { prev = s; s = rk4(s, h, L, P); guard++; }
  // prev と s の間で ṙ = 0: prev から刻み τ で割線法
  let t1 = 0, f1 = prev[1], t2 = h, f2 = s[1], sol = s;
  for (let it = 0; it < 60; it++) {
    const t3 = t2 - f2 * (t2 - t1) / (f2 - f1);
    if (!Number.isFinite(t3)) break;
    const s3 = rk4(prev, t3, L, P);
    t1 = t2; f1 = f2; t2 = t3; f2 = s3[1]; sol = s3;
    if (Math.abs(f2) < 1e-18 || Math.abs(t2 - t1) < 1e-16 * h) break;
  }
  return { r0, r1: sol[0], halfT: sol[3], halfTheta: sol[2], L, steps: guard + 1, h };
}
/** 1 周期の要素(近点半径・遠点半径・平均半径・近点間周期・Δϖ/周・ϖ̇)。nPerHalf を 2 段で記録する。 */
export function orbitElements(r0, vt, P, nPerHalf = 20000) {
  const one = (n) => {
    const hO = halfOrbit(r0, vt, P, n);
    const rp = Math.min(hO.r0, hO.r1), ra = Math.max(hO.r0, hO.r1);
    const Tr = 2 * hO.halfT, dTheta = 2 * hO.halfTheta;
    const dPomega = dTheta - 2 * Math.PI;
    return { rp, ra, meanR: (rp + ra) / 2, eGeom: (ra - rp) / (ra + rp), Tr, dPomegaRad: dPomega,
      rate: dPomega / Tr, nPerHalf: n };
  };
  const a = one(nPerHalf), b = one(2 * nPerHalf);
  return Object.assign({}, b, { coarse: a, stepDiffRate: b.rate - a.rate });
}

export default { ZONAL_P0, ZONAL_ORDERS, D68_DECL, DAY_SEC, YEAR_SEC, zonalTerms, potential, radialAccel,
  circularLimit, consistentPeriSpeed, currentPeriSpeed, halfOrbit, orbitElements,
  D68_DIAG, d68ConsistentIc, d68ObsOrbitIc,
  radPerTimeToDegPerDay, radPerTimeToDegPerYear, degPerDayToDegPerYear };
