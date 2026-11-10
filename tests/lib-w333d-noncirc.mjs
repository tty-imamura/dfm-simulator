// 第333便d(原仮定者の整理(2026-11-10)「銀河は全体が回っているが、個々の星の軌道は同心円ではなく、楕円軌道の密度波で腕が形成される。その為、同心円に近い前提の計算では
//   合わせにくいのではないか」「重みは m/r² が有力だが他の次数でも検証」・原仮定者の回答(2026-11-10 —— AN608)「非円軌道の対照を足す」・統括の検証項目 R320):
//   **同じ方位平均の質量分布(案内中心の環の質量が同じ)で 円軌道/位相を乱した非円軌道/パターンの枠で位相を揃えた非円軌道 の低 N の円盤を作る純関数と、
//   統合した並進の場 U の時間微分 ∂U/∂t(源の位置と速度と加速度から —— 解析)と、方位の Fourier の m = 2・J の流れの読み**
//   (器 tests/exp-w333d-noncirc.mjs と QA lint.nonCirc333d・behavior.nonCirc333d が読む —— html を読まない・状態を持たない・第332便b の lib〔tests/lib-w332b-transgeo2.mjs —— 場の式〕は
//   呼ぶだけ・エンジンの式を写さない)。**診断だけ —— 運動学の対照(相互作用の時間発展はしない)**。
//
// ■ 軌道の宣言(一次の周転円の近似 —— **閉じたケプラー楕円ではない**): 案内中心の半径 R_g・案内中心の角速度 Ω(R_g)・動径の振幅 X・周転円の位相 ψ = ψ₀ + ν t・
//   案内中心の方位 φ_g = φ_g0 + Ω t として
//     R(t) = R_g + X cos ψ,  φ(t) = φ_g − (2Ω/ν)(X/R_g) sin ψ
//   速度と加速度はこの位置の式の厳密な時間微分(Ṙ = −νX sin ψ・φ̇ = Ω − 2Ω(X/R_g) cos ψ・R̈ = −ν²X cos ψ・φ̈ = 2Ων(X/R_g) sin ψ)。角運動量 R²φ̇ は X の一次で保存(二次の残り)。
//   ν = `κ_epi`(自由な周転円 —— 動径の周期と方位の周期が違うので軌道は閉じない〔ロゼット〕・ν = Ω のときだけ一周で閉じる —— ケプラーの型)。
//   族: circ(X = 0)/random(X = εR_g・ν = `κ_epi`・ψ₀ は種を宣言した乱数)/kin(X = εR_g・ν = `κ_epi`・ψ₀ = 2(φ_g0 − φ_arm(R_g)) —— 運動学的な密度波:
//   卵形の向きを半径で巻く。パターンは局所の Ω − `κ_epi`/2 で回る)/pattern(X = εR_g・ν = 2(Ω − Ω_p)・ψ₀ = 2(φ_g0 − φ_arm(R_g)) —— 宣言した一定のパターン速度 Ω_p の枠で
//   卵形が閉じる型。2Ω/|ν| が上限 DECL.yCap を超える環〔共回転の近く〕は X = 0 にして数える)。腕の向き φ_arm(R) = φ₀ − ln(R/R₀)/tan(ピッチ角)(後ろに巻く対数螺旋)。
// ■ 場の時間微分(fieldDot —— 源の回転は座標変換の型 coord だけ): w_j = m_j (r² + ε²)^(−p/2)・c_j = v_j + s_d,j ẑ × (p − p_j)・u = Σ w_j c_j /(w_self + w_bg + Σ w_j)。
//   源が動くと ∂_t w_j = −∇_p w_j · v_j・∂_t c_j = a_j + s_d,j ẑ × (−v_j)(s_d は時間に依らない宣言)→ ∂_t u = (Σ(∂_t w_j c_j + w_j ∂_t c_j) − u Σ ∂_t w_j)/W(自己と背景は一定)。
//   定常の場へ軌道の上の速度だけを差し替える読み(∂_t u = 0)との差を器が表にする。
// ■ 言わないこと: 3 つの族の差は宣言した運動学の型の表(腕の形成・回転曲線の機構の同定には使わない)・自己の重みは決めない(場の読みと R_d = Y_k m の列)・
//   引きずりの速度は速度で、力・加速度ではない・`κ_epi` と κ_D は別の量・棒は扱わない。
import * as TG from './lib-w332b-transgeo2.mjs';

export const LIB_VERSION = 'w333d-noncirc-lib-1';
/** 族(circ = 円軌道・random = 位相を乱した非円軌道・kin = 運動学的な密度波〔ν = κ_epi〕・pattern = 一定の Ω_p の枠で閉じる卵形〔ν = 2(Ω − Ω_p)〕) */
export const FAMILIES = Object.freeze(['circ', 'random', 'kin', 'pattern']);
/** 星の引きずり自転 s_d の型(none = 0・sync = 案内中心の Ω —— 模型の宣言。観測の自転 s とは別) */
export const SPIN_TYPES = Object.freeze(['none', 'sync']);
/** 宣言(走行の前に置く —— 結果を見て変えない) */
export const DECL = Object.freeze({
  /** pattern の族で卵形を置く上限: 方位の振幅の倍率 2Ω/|ν| ≤ yCap(超える環は X = 0 —— 共回転の近くの発散を避ける宣言) */
  yCap: 4,
  /** 腕の向き(対数螺旋): φ₀ [rad]・ピッチ角 [度]・基準の半径 R₀ [kpc] */
  armPhi0: 0, armPitchDeg: 20, armR0Kpc: 1,
  /** 恒等式の門の相対の許容・差分の照らしの許容 */
  idTol: 1e-12, fdTol: 1e-6,
});

const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const relD = (a, b) => (a === b ? 0 : Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b), 1e-300));

/** 種を宣言した乱数(mulberry32 —— 32 bit の整数の種)。[0, 1) を返す関数 */
export function rngOf(seed) {
  if (!(Number.isInteger(seed) && seed >= 0 && seed < 2 ** 32)) throw new RangeError('rngOf: 種は 0 ≤ seed < 2^32 の整数');
  let a = seed >>> 0;
  return function () { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

/** 腕の向き φ_arm(R)(対数螺旋 —— R と R₀ は同じ単位) */
export function armPhase(R, R0, decl = DECL) {
  if (!(fin(R) && R > 0 && fin(R0) && R0 > 0)) throw new RangeError('armPhase: R・R₀ > 0');
  return decl.armPhi0 - Math.log(R / R0) / Math.tan(decl.armPitchDeg * Math.PI / 180);
}

/**
 * 1 つの軌道の時刻 t の状態(一次の周転円の近似の位置の式とその厳密な時間微分)。Rg > 0・X ≥ 0・Omega・nu(X > 0 なら ν ≠ 0)。
 * 戻り値 { x, y, vx, vy, ax, ay, R, phi, vR, vphi, psi }
 */
export function orbitState({ Rg, phig0, X, psi0, Omega, nu, t }) {
  if (![Rg, phig0, X, psi0, Omega, t].every(fin) || !(Rg > 0) || X < 0) throw new RangeError('orbitState: Rg > 0・X ≥ 0・有限の数');
  if (X > 0 && !(fin(nu) && nu !== 0)) throw new RangeError('orbitState: X > 0 では ν ≠ 0 の有限の数');
  const psi = psi0 + (X > 0 ? nu * t : 0), phig = phig0 + Omega * t, cp = Math.cos(psi), sp = Math.sin(psi), xr = X / Rg;
  const R = Rg + X * cp, phi = X > 0 ? phig - (2 * Omega / nu) * xr * sp : phig;
  const Rd = X > 0 ? -nu * X * sp : 0, Rdd = X > 0 ? -nu * nu * X * cp : 0, pd = Omega - 2 * Omega * xr * cp, pdd = X > 0 ? 2 * Omega * nu * xr * sp : 0;
  const c = Math.cos(phi), s = Math.sin(phi), vR = Rd, vphi = R * pd, aR = Rdd - R * pd * pd, aphi = R * pdd + 2 * Rd * pd;
  return { x: R * c, y: R * s, vx: vR * c - vphi * s, vy: vR * s + vphi * c, ax: aR * c - aphi * s, ay: aR * s + aphi * c, R, phi, vR, vphi, psi };
}

/**
 * 低 N の円盤(ある時刻 t の状態)。rings:[{ Rg [m], m [kg](環の全質量), Omega [rad/s], kappaEpi [rad/s] }]・K(方位の点の数)・family(FAMILIES)・amp ε(X = εR_g)・
 * seed(random の種)・OmegaP [rad/s](pattern のパターン速度)・R0(腕の基準の半径 —— Rg と同じ単位)・center:{ m, spin }(中心の点 —— 固定・速度 0・spin は引きずり自転 s_d の宣言)・
 * spin('none' | 'sync')・t。戻り値 { pts:[{ x, y, vx, vy, ax, ay, m, spin, R, ring, Rg, phig0, psi0, nu, X }], dropped(pattern で X = 0 にした環の数), droppedRg }
 * 乱数は環の順・方位の順に引く(種の宣言と離散化を変えると別の列)。
 */
export function buildDisk({ rings, K, family, amp = 0, seed = 0, OmegaP = null, R0, center, spin = 'none', t = 0 }) {
  if (!Array.isArray(rings) || !rings.length || !(Number.isInteger(K) && K >= 2)) throw new RangeError('buildDisk: 環は空でない配列・K ≥ 2 の整数');
  if (!FAMILIES.includes(family)) throw new RangeError('buildDisk: 族は ' + FAMILIES.join('・'));
  if (!SPIN_TYPES.includes(spin)) throw new RangeError('buildDisk: 自転の型は ' + SPIN_TYPES.join('・'));
  if (!(fin(amp) && amp >= 0 && amp < 1) || (family !== 'circ' && !(amp > 0))) throw new RangeError('buildDisk: 0 < ε < 1(circ は ε を見ない)');
  if (family === 'pattern' && !(fin(OmegaP) && OmegaP > 0)) throw new RangeError('buildDisk: pattern は一定の正の Ω_p が要る');
  if (!center || !fin(center.m) || !(center.m >= 0) || !fin(center.spin) || !fin(t)) throw new RangeError('buildDisk: 中心の m ≥ 0・spin・t は有限の数');
  const rnd = family === 'random' ? rngOf(seed) : null, pts = [{ x: 0, y: 0, vx: 0, vy: 0, ax: 0, ay: 0, m: center.m, spin: center.spin, R: 1, ring: -1, Rg: 0, phig0: 0, psi0: 0, nu: 0, X: 0 }];
  let dropped = 0; const droppedRg = [];
  rings.forEach((rg, k) => {
    if (![rg.Rg, rg.m, rg.Omega, rg.kappaEpi].every(fin) || !(rg.Rg > 0 && rg.m > 0 && rg.kappaEpi > 0)) throw new RangeError('buildDisk: 環の Rg・m・κ_epi > 0・Ω は有限');
    let X = family === 'circ' ? 0 : amp * rg.Rg, nu = family === 'pattern' ? 2 * (rg.Omega - OmegaP) : rg.kappaEpi;
    if (family === 'pattern' && (nu === 0 || Math.abs(2 * rg.Omega / nu) > DECL.yCap)) { X = 0; dropped++; droppedRg.push(rg.Rg); }
    const arm = family === 'kin' || family === 'pattern' ? armPhase(rg.Rg, R0) : 0;
    for (let q = 0; q < K; q++) {
      const phig0 = 2 * Math.PI * q / K;
      const psi0 = family === 'random' ? 2 * Math.PI * rnd() : (family === 'kin' || family === 'pattern') ? 2 * (phig0 - arm) : 0;
      const st = orbitState({ Rg: rg.Rg, phig0, X, psi0, Omega: rg.Omega, nu, t });
      pts.push({ x: st.x, y: st.y, vx: st.vx, vy: st.vy, ax: st.ax, ay: st.ay, m: rg.m / K, spin: spin === 'sync' ? rg.Omega : 0, R: 1, ring: k, Rg: rg.Rg, phig0, psi0, nu, X });
    }
  });
  return { pts, dropped, droppedRg };
}

/**
 * 場とその時間微分(1 受け手・源の回転は座標変換の型)。at:[x, y]・sources:[{ x, y, vx, vy, ax, ay, m ≥ 0, spin }]・kernel:{ p ∈ {1, 2}, eps ≥ 0 }・selfW ≥ 0・bg ≥ 0。
 * 戻り値 { u, dudt, W, Wsrc }(受け手の位置は固定 —— オイラーの時間微分)
 */
export function fieldDot({ at, sources, kernel, selfW = 0, bg = 0 }) {
  if (!Array.isArray(at) || at.length !== 2 || !at.every(fin) || !Array.isArray(sources)) throw new RangeError('fieldDot: at は有限の 2 成分・sources は配列');
  if (!kernel || ![1, 2].includes(kernel.p) || !fin(kernel.eps) || kernel.eps < 0 || !fin(selfW) || selfW < 0 || !fin(bg) || bg < 0) throw new RangeError('fieldDot: 核の p は 1 か 2・ε ≥ 0・自己と背景 ≥ 0');
  const p = kernel.p, e2 = kernel.eps * kernel.eps;
  let Px = 0, Py = 0, Ws = 0, dPx = 0, dPy = 0, dW = 0;
  for (const s of sources) {
    if (!s || ![s.x, s.y, s.vx, s.vy, s.ax, s.ay, s.m, s.spin].every(fin) || s.m < 0) throw new RangeError('fieldDot: 源は有限の x・y・vx・vy・ax・ay・spin と非負の m');
    const dx = at[0] - s.x, dy = at[1] - s.y, q2 = dx * dx + dy * dy + e2;
    if (!(dx * dx + dy * dy > 0)) throw new RangeError('fieldDot: 受け手と源が一致(受け手の自分は源に入れない)');
    const w = s.m * (p === 1 ? 1 / Math.sqrt(q2) : 1 / q2), gk = p === 1 ? 1 / (q2 * Math.sqrt(q2)) : 2 / (q2 * q2);
    const gwx = -s.m * dx * gk, gwy = -s.m * dy * gk, wd = -(gwx * s.vx + gwy * s.vy);
    const cx = s.vx - s.spin * dy, cy = s.vy + s.spin * dx, cdx = s.ax + s.spin * s.vy, cdy = s.ay - s.spin * s.vx;
    Px += w * cx; Py += w * cy; Ws += w; dPx += wd * cx + w * cdx; dPy += wd * cy + w * cdy; dW += wd;
  }
  const Wt = selfW + bg + Ws;
  if (!(Wt > 0) || !fin(Wt)) throw new RangeError('fieldDot: 分母が 0');
  const ux = Px / Wt, uy = Py / Wt;
  return { u: [ux, uy], dudt: [(dPx - ux * dW) / Wt, (dPy - uy * dW) / Wt], W: Wt, Wsrc: Ws };
}

/** 方位の Fourier の m 成分(重み wts・角 phis)—— 戻り値 { amp(|Σ w e^{imφ}|/Σ|w|), phase(主軸の角 ∈ (−π/m, π/m]) } */
export function fourierM(phis, wts, m = 2) {
  if (!Array.isArray(phis) || !Array.isArray(wts) || phis.length !== wts.length || !phis.length || !(Number.isInteger(m) && m >= 1)) throw new RangeError('fourierM: 同じ長さの空でない配列・m ≥ 1');
  let c = 0, s = 0, a = 0;
  for (let k = 0; k < phis.length; k++) { c += wts[k] * Math.cos(m * phis[k]); s += wts[k] * Math.sin(m * phis[k]); a += Math.abs(wts[k]); }
  return { amp: a > 0 ? Math.hypot(c, s) / a : 0, phase: Math.atan2(s, c) / m, c, s };
}
/** 角の差を (−π/m, π/m] へ(m 回対称の位相の比べ) */
export function wrapM(d, m = 2) { const P = 2 * Math.PI / m; let x = ((d % P) + P) % P; if (x > P / 2) x -= P; return x; }

/** 環の帯(半径の箱)の量: 点の列 pts(x, y, vx, vy, m)と箱の端 edges → 箱ごと { n, mass, A2, phase2, vphiMean, vRMean, sigmaR, sigmaPhi, jFlux(Σ m R v_φ v_R / 幅) } */
export function annulusKinematics(pts, edges) {
  if (!Array.isArray(pts) || !Array.isArray(edges) || edges.length < 2) throw new RangeError('annulusKinematics: 点の配列と 2 つ以上の端');
  const out = [];
  for (let b = 0; b + 1 < edges.length; b++) {
    const lo = edges[b], hi = edges[b + 1], q = [];
    for (const P of pts) { const R = Math.hypot(P.x, P.y); if (R >= lo && R < hi) q.push(P); }
    if (!q.length) { out.push({ lo, hi, n: 0 }); continue; }
    const phis = q.map((P) => Math.atan2(P.y, P.x)), ms = q.map((P) => P.m), F = fourierM(phis, ms, 2), M = ms.reduce((a, x) => a + x, 0);
    const vR = q.map((P) => (P.x * P.vx + P.y * P.vy) / Math.hypot(P.x, P.y)), vP = q.map((P) => (P.x * P.vy - P.y * P.vx) / Math.hypot(P.x, P.y));
    const mean = (a) => a.reduce((s, x, k) => s + ms[k] * x, 0) / M, mR = mean(vR), mP = mean(vP);
    const sR = Math.sqrt(Math.max(0, mean(vR.map((x) => (x - mR) * (x - mR))))), sP = Math.sqrt(Math.max(0, mean(vP.map((x) => (x - mP) * (x - mP)))));
    let jf = 0; q.forEach((P, k) => { jf += ms[k] * Math.hypot(P.x, P.y) * vP[k] * vR[k]; });
    out.push({ lo, hi, n: q.length, mass: M, A2: F.amp, phase2: F.phase, vphiMean: mP, vRMean: mR, sigmaR: sR, sigmaPhi: sP, jFlux: jf / (hi - lo) });
  }
  return out;
}

/* ───────── 純関数の場面と門 ───────── */
export function pureScenes() {
  const S = {};
  const O = { Rg: 3, phig0: 0.4, X: 0.2, psi0: 1.1, Omega: 0.7, nu: 1.05 };
  // ① 位置の式と速度・加速度(厳密な時間微分)の中心差分の照らし
  { const h = 1e-5, a = orbitState(Object.assign({ t: 0.3 }, O)), p = orbitState(Object.assign({ t: 0.3 + h }, O)), m = orbitState(Object.assign({ t: 0.3 - h }, O));
    const sv = Math.hypot(a.vx, a.vy), sa = Math.hypot(a.ax, a.ay);
    S.orbitDeriv = { v: Math.max(Math.abs((p.x - m.x) / (2 * h) - a.vx), Math.abs((p.y - m.y) / (2 * h) - a.vy)) / sv, a: Math.max(Math.abs((p.vx - m.vx) / (2 * h) - a.ax), Math.abs((p.vy - m.vy) / (2 * h) - a.ay)) / sa,
      polar: Math.max(relD(a.vR, (a.x * a.vx + a.y * a.vy) / a.R), relD(a.vphi, (a.x * a.vy - a.y * a.vx) / a.R)) }; }
  // ② 角運動量 R²φ̇ は X の一次で保存(残りは二次 —— ε を半分にすると 1/4)
  { const dev = (e) => { let mx = 0; for (let k = 0; k < 64; k++) { const st = orbitState({ Rg: 2, phig0: 0, X: e * 2, psi0: 2 * Math.PI * k / 64, Omega: 0.5, nu: 0.71, t: 0 }); mx = Math.max(mx, Math.abs(st.R * st.vphi / (2 * 2 * 0.5) - 1)); } return mx; };
    const d1 = dev(1e-3), d2 = dev(5e-4); S.angMom = { d1, d2, ratio: d1 / d2, overEps2: d1 / 1e-6 }; }
  // ③ 閉じたケプラー楕円ではない: 動径の 1 周期 2π/ν の間の方位の進み − 2π(ν = √2 Ω はロゼット・ν = Ω は閉じる)
  { const adv = (nu) => { const a = orbitState({ Rg: 1, phig0: 0, X: 0.1, psi0: 0, Omega: 1, nu, t: 0 }), b = orbitState({ Rg: 1, phig0: 0, X: 0.1, psi0: 0, Omega: 1, nu, t: 2 * Math.PI / nu }); return { dR: b.R - a.R, dphi: b.phi - a.phi - 2 * Math.PI }; };
    S.notKepler = { rosette: adv(Math.SQRT2), kepler: adv(1) }; }
  const rings = [{ Rg: 1, m: 3, Omega: 1, kappaEpi: 1.4 }, { Rg: 2, m: 5, Omega: 0.5, kappaEpi: 0.72 }, { Rg: 3.5, m: 2, Omega: 0.29, kappaEpi: 0.41 }];
  const ctr = { m: 4, spin: 0.3 };
  // ④ 円軌道の族: 半径は案内中心・v_R = 0・v_φ = Ω R_g・質量の和
  { const D = buildDisk({ rings, K: 12, family: 'circ', R0: 1, center: ctr });
    let e = 0; for (const P of D.pts.slice(1)) { const st = { R: Math.hypot(P.x, P.y) }; e = Math.max(e, relD(st.R, P.Rg), Math.abs(P.x * P.vx + P.y * P.vy) / (st.R * Math.hypot(P.vx, P.vy)), relD((P.x * P.vy - P.y * P.vx) / st.R, rings[P.ring].Omega * P.Rg)); }
    S.circFamily = { maxRel: e, mass: relD(D.pts.reduce((a, P) => a + P.m, 0), 3 + 5 + 2 + 4), n: D.pts.length }; }
  // ⑤ 位相を揃えた族(kin): 動径の変位 X cos ψ の m = 2 の主軸 = 腕の向き φ_arm(R_g)(mod π)・random の族は種で同じ列
  { const D = buildDisk({ rings, K: 16, family: 'kin', amp: 0.1, R0: 1, center: ctr }); let mx = 0;
    rings.forEach((rg, k) => { const q = D.pts.filter((P) => P.ring === k), F = fourierM(q.map((P) => P.phig0), q.map((P) => P.X * Math.cos(P.psi0)), 2); mx = Math.max(mx, Math.abs(wrapM(F.phase - armPhase(rg.Rg, 1)))); });
    const A = buildDisk({ rings, K: 16, family: 'random', amp: 0.1, seed: 7, R0: 1, center: ctr }), B = buildDisk({ rings, K: 16, family: 'random', amp: 0.1, seed: 7, R0: 1, center: ctr }), C = buildDisk({ rings, K: 16, family: 'random', amp: 0.1, seed: 8, R0: 1, center: ctr });
    const r = rngOf(12345); let cs = 0; for (let k = 0; k < 20000; k++) cs += Math.cos(2 * Math.PI * r());
    S.alignPhase = { maxPhaseErr: mx, seedSame: A.pts.every((P, i) => P.psi0 === B.pts[i].psi0), seedDiff: A.pts.slice(1).some((P, i) => P.psi0 !== C.pts[i + 1].psi0), meanCos: cs / 20000 }; }
  // ⑥ パターンの族: パターンの枠で ψ − 2(φ_g − Ω_p t − φ_arm) が時刻に依らない・共回転の近くの環は X = 0(2Ω/|ν| > yCap)
  { const Op = 0.45, D0 = buildDisk({ rings, K: 8, family: 'pattern', amp: 0.1, OmegaP: Op, R0: 1, center: ctr }); let mx = 0;
    for (const P of D0.pts.slice(1)) { if (P.X === 0) continue; for (const t of [0, 1.7, 5.3]) { const psi = P.psi0 + P.nu * t, phig = P.phig0 + rings[P.ring].Omega * t; mx = Math.max(mx, Math.abs(wrapM(psi - 2 * (phig - Op * t - armPhase(P.Rg, 1)), 1))); } }
    const expDrop = rings.filter((rg) => Math.abs(2 * rg.Omega / (2 * (rg.Omega - Op))) > DECL.yCap).length;
    S.patternFrame = { maxPhaseErr: mx, dropped: D0.dropped, expDrop }; }
  // ⑦ fieldDot の u は第332便b の frameField(呼ぶだけ —— 座標変換の回転)と同じ値・∂_t u は源を軌道の上で動かした中心差分と同じ
  { const mk = (t) => buildDisk({ rings, K: 6, family: 'random', amp: 0.15, seed: 3, R0: 1, center: ctr, spin: 'sync', t }).pts;
    const at = [1.6, -0.9], rows = [];
    for (const [p, eps, selfW] of [[2, 0, 0], [1, 0, 0], [2, 0.2, 1.5], [1, 0.1, 0.7]]) {
      const P0 = mk(0), F = fieldDot({ at, sources: P0, kernel: { p, eps }, selfW }), G = TG.frameField({ at, sources: P0, kernel: { p, eps }, rot: { type: 'coord' }, selfW });
      const h = 1e-4, Fp = fieldDot({ at, sources: mk(h), kernel: { p, eps }, selfW }), Fm = fieldDot({ at, sources: mk(-h), kernel: { p, eps }, selfW });
      const fd = [(Fp.u[0] - Fm.u[0]) / (2 * h), (Fp.u[1] - Fm.u[1]) / (2 * h)], sc = Math.hypot(F.dudt[0], F.dudt[1]);
      rows.push({ p, eps, selfW, uSame: Math.max(relD(F.u[0], G.u[0]), relD(F.u[1], G.u[1])), fdRel: Math.hypot(fd[0] - F.dudt[0], fd[1] - F.dudt[1]) / sc });
    }
    S.fieldDotFD = { rows, uMax: Math.max(...rows.map((r) => r.uSame)), fdMax: Math.max(...rows.map((r) => r.fdRel)) }; }
  // ⑧ 1 つの源(等速・自転 0): u は源の速度のまま —— ∂_t u = 0
  { const F = fieldDot({ at: [0.3, 0.2], sources: [{ x: 1, y: -2, vx: 3, vy: 1, ax: 0, ay: 0, m: 2, spin: 0 }], kernel: { p: 2, eps: 0 } });
    S.oneSource = { dudt: Math.hypot(F.dudt[0], F.dudt[1]), u: Math.max(Math.abs(F.u[0] - 3), Math.abs(F.u[1] - 1)) }; }
  // ⑨ 剛体の回転(全部の環が同じ Ω₀ の円軌道): ∂_t u = Ω₀ ẑ × u − Ω₀ J (ẑ × p)(配置が回るだけ —— J は第332便b の frameField の解析の勾配)
  { const Om = 0.6, rr = rings.map((rg) => Object.assign({}, rg, { Omega: Om })), P0 = buildDisk({ rings: rr, K: 7, family: 'circ', R0: 1, center: { m: 4, spin: 0.3 }, spin: 'sync' }).pts;
    const rows = [];
    for (const at of [[1.3, 0.4], [-2.2, 1.9], [0.2, -3.1]]) for (const p of [1, 2]) {
      const F = fieldDot({ at, sources: P0, kernel: { p, eps: 0 } }), G = TG.frameField({ at, sources: P0, kernel: { p, eps: 0 }, rot: { type: 'coord' } });
      const zp = [-at[1], at[0]], Jz = [G.J[0][0] * zp[0] + G.J[0][1] * zp[1], G.J[1][0] * zp[0] + G.J[1][1] * zp[1]], ex = [Om * (-G.u[1]) - Om * Jz[0], Om * G.u[0] - Om * Jz[1]];
      rows.push(Math.hypot(F.dudt[0] - ex[0], F.dudt[1] - ex[1]) / Math.max(Math.hypot(ex[0], ex[1]), 1e-300));
    }
    S.rigidRotation = { maxRel: Math.max(...rows), n: rows.length }; }
  // ⑩ Fourier の m = 2: 質量 1 + a cos 2(φ − θ) の環から振幅 a/2 と主軸 θ
  { const N = 64, th = 0.37, aa = 0.3, ph = [], w = []; for (let k = 0; k < N; k++) { const f = 2 * Math.PI * k / N; ph.push(f); w.push(1 + aa * Math.cos(2 * (f - th))); }
    const F = fourierM(ph, w, 2), A0 = annulusKinematics(ph.map((f, k) => ({ x: Math.cos(f), y: Math.sin(f), vx: -Math.sin(f), vy: Math.cos(f), m: w[k] })), [0.5, 1.5]);
    S.fourier = { amp: Math.abs(F.amp - aa / 2), phase: Math.abs(wrapM(F.phase - th)), annA2: Math.abs(A0[0].A2 - aa / 2), annSigma: A0[0].sigmaR + A0[0].sigmaPhi, annJ: Math.abs(A0[0].jFlux) }; }
  // ⑪ 入力の拒否
  { const bad = [() => rngOf(-1), () => rngOf(1.5), () => armPhase(0, 1), () => orbitState({ Rg: 0, phig0: 0, X: 0, psi0: 0, Omega: 1, nu: 1, t: 0 }), () => orbitState({ Rg: 1, phig0: 0, X: 0.1, psi0: 0, Omega: 1, nu: 0, t: 0 }),
      () => buildDisk({ rings, K: 1, family: 'circ', R0: 1, center: ctr }), () => buildDisk({ rings, K: 8, family: 'ellipse', R0: 1, center: ctr }), () => buildDisk({ rings, K: 8, family: 'random', amp: 0, R0: 1, center: ctr }),
      () => buildDisk({ rings, K: 8, family: 'pattern', amp: 0.1, R0: 1, center: ctr }), () => buildDisk({ rings, K: 8, family: 'circ', R0: 1, center: ctr, spin: 'obs' }),
      () => fieldDot({ at: [1, 0], sources: [{ x: 1, y: 0, vx: 0, vy: 0, ax: 0, ay: 0, m: 1, spin: 0 }], kernel: { p: 2, eps: 0 } }), () => fieldDot({ at: [1, 0], sources: [], kernel: { p: 2, eps: 0 } }),
      () => fieldDot({ at: [1, 0], sources: [{ x: 0, y: 0, vx: 0, vy: 0, ax: 0, ay: 0, m: 1, spin: 0 }], kernel: { p: 3, eps: 0 } }), () => fourierM([], [], 2)];
    let n = 0; for (const f of bad) { try { f(); } catch (e) { if (e instanceof RangeError) n++; } }
    S.reject = { n, of: bad.length }; }
  return S;
}
export function pureGates(S) {
  const tol = DECL.idTol;
  return {
    orbitDeriv: S.orbitDeriv.v <= 1e-8 && S.orbitDeriv.a <= 1e-8 && S.orbitDeriv.polar <= tol,
    angMom: S.angMom.overEps2 < 10 && Math.abs(S.angMom.ratio - 4) < 0.05,
    notKepler: Math.abs(S.notKepler.rosette.dR) <= 1e-12 && Math.abs(S.notKepler.rosette.dphi) > 0.1 && Math.abs(S.notKepler.kepler.dR) <= 1e-12 && Math.abs(S.notKepler.kepler.dphi) <= 1e-12,
    circFamily: S.circFamily.maxRel <= tol && S.circFamily.mass <= tol && S.circFamily.n === 37,
    alignPhase: S.alignPhase.maxPhaseErr <= 1e-12 && S.alignPhase.seedSame && S.alignPhase.seedDiff && Math.abs(S.alignPhase.meanCos) < 0.02,
    patternFrame: S.patternFrame.maxPhaseErr <= 1e-9 && S.patternFrame.dropped === S.patternFrame.expDrop,
    fieldDotFD: S.fieldDotFD.rows.length === 4 && S.fieldDotFD.uMax <= tol && S.fieldDotFD.fdMax <= DECL.fdTol,
    oneSource: S.oneSource.dudt <= 1e-15 && S.oneSource.u <= 1e-15,
    rigidRotation: S.rigidRotation.n === 6 && S.rigidRotation.maxRel <= 1e-9,
    fourier: S.fourier.amp <= tol && S.fourier.phase <= tol && S.fourier.annA2 <= tol && S.fourier.annSigma <= 1e-12 && S.fourier.annJ <= 1e-12,
    reject: S.reject.n === S.reject.of,
  };
}
