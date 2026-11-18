// 第341便e(原仮定者の補足(2026-11-18 —— 第141報)「質量ゼロの慣性移動が光の経路で有り、光が決定力場による座標空間の物差しになる。質量の有る物体は、
//   局所光速に近付くにつれて加速しにくくなる」・統括の検証項目 R368): **局所光速に近付くと加速しにくくなる候補の型を並べる純関数 —— 診断だけ**
//   (器 tests/exp-w341e-lightmass.mjs と QA behavior.lightmass341e・docs.lightmass341e が読む —— html を読まない・ファイルを読まない・状態を持たない)。
//   エンジン・時計の式・運動の式・内蔵の本・受理器は変えない(読むだけ)。第333便c の lib(1PN の式・換算)と第340便h の lib(薄い角)は呼ぶだけ。
//
// ■ 単位: 無次元(基準光速 c₀ = 1)。場 ψ = μ/r(μ = G₀M/c₀² —— 物理対応ロック X_k = G₀/c₀² の弱い場の形・背景 D₀ の分は入れない)。
//   N = e^(−ψ)・A = e^(+ψ)・局所光速 c_loc = c₀ N/A = c₀ e^(−2ψ)(今のアプリの時計の式 dτ/dt = √(N² − A² w²/c₀²) と同じ係数 —— w = |v − u| は場に対する物質の相対の速さ)。
//   屈折率 n = c₀/c_loc = e^(2ψ)(今のアプリの光線と同じ式)。
// ■ 候補の型(式を 1 つに決めない —— どれもノブ・どれもアプリへ入れたものではない)
//   型 (0) 今のアプリ(対照): dv/dt = F/m(重力は ∇ψ c₀²)・時計は根号の中が 0 以下で止まる(加速を抑える項ではない)。
//   型 (1) 場の係数を共有する型(統括の参考の試作): H = u·P + N √(m² c₀⁴ + c₀² |P|²/A²)・dP/dt = −∂H/∂x + F。m = 0 で H = u·P + c_loc |P|(光の形)。
//          **重力そのものも同じ H から出る(N の傾き)** —— 今のアプリの重力と同時には足せない(置き換えの型)。
//   型 (2) 加速の効きが落ちる型: dv/dt = (F/m) × max(0, 1 − w²/c_loc²)^p(p = ½・1・3⁄2 —— ノブ)。足す型(今の重力に掛ける)。
//   型 (3) 放射の抵抗の型(原仮定者の推測(2026-11-14 —— 第138報)の例え「局所光速に近付くにつれて、自分自身の放つ電磁波が抵抗となり」を第337便d の
//          非対称の型に c_loc の依存を足した形): 速さを変える成分(接線の成分 a_t)だけ —— 加速のとき a_t/(1 + ε₊ g(β))・減速のとき a_t (1 + ε₋ g(β))
//          (β = w/c_loc・g の 2 つ: R1 g = β²/R2 g = β²/(1 − β²))。熱: 加速 ε₊ g dK・減速 ε₋ g/(1 + ε₋ g) |dK|。列: 対称(ε₋ = ε₊)・非対称(ε₋ = 0)。足す型。
// ■ 言わないこと: 型は候補(運動の則ではない)・型 (1) は統括の参考の試作で DFM の式として採ったものではない・光速を、引きずりの候補の採否に使わない
//   (原仮定者の指示(2026-11-17 —— 第140報)—— 本 lib の速さは場に対する物質の相対の速さで、座標を運ぶ速さ u は切らない)・質量 0 の極限の表は「この型では」の表。
import * as M3 from './lib-w333c-mercury3d.mjs';
import { thinAngle } from './lib-w340h-thin.mjs';

export const LIB_VERSION = 'w341e-lightmass-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);

export const DECL = Object.freeze({
  /** T1: 一様な場の ψ(型 (1) の行)・型 (2) の p・型 (3) の ε₊ と g・読む β と時刻(τ = t/t_N・t_N = m c_loc/F —— 今のアプリで c_loc に達する時刻) */
  psiT1: Object.freeze([0, 0.1]),
  pGrid: Object.freeze([0.5, 1, 1.5]),
  epsGrid: Object.freeze([0.1, 1]),
  gForms: Object.freeze(['R1', 'R2']),
  betaRead: Object.freeze([0.5, 0.9, 0.99]),
  tauRead: Object.freeze([1, 2, 10]),
  nQuad: 40000,
  /** T2: 衝突径数 ÷ μ・寄せる速さ β∞・刻み(dt = h r/|v|)・始点の距離 ÷ b */
  bGrid: Object.freeze([1e3, 1e4, 1e5]),
  betaInf: Object.freeze([0.9, 0.99, 0.999]),
  betaInf3: Object.freeze([0.9, 0.99]),
  hRay: 2e-3, xStartOverB: 1e4,
  /** T2 物差し: 区間 r₁〜2r₁ の内側の端の場 ψ(r₁) */
  psiRuler: Object.freeze([1e-6, 1e-3, 0.1]),
  /** T3: 軌道(a = 1・μ・e)・1 周の刻み・周の数・型 (3) の ε */
  orbit: Object.freeze({ mu: 1e-5, e: 0.20563593, stepsPerOrbit: 6000, nOrb: 4, eps3: 1 }),
  /** T4: 低速の極限で読む β */
  betaLow: Object.freeze([1e-2, 1e-3, 1e-4]),
  /** 水星(第340便e の doubleCount と同じ値)・GPS(地球の質量と軌道の半径 —— 文献の値・未照合) */
  mercury: Object.freeze({ M: 1.98847e30, m: 3.3011e23, a: 5.790905e10, e: 0.20563593 }),
  gps: Object.freeze({ M: 5.9722e24, r: 2.656e7, motionUsPerDay: -7.2 }),
});

/* ───────── 場 ───────── */
export const psiAt = (mu, x, y) => mu / Math.hypot(x, y);
export const cLoc = (psi) => Math.exp(-2 * psi);
/** ∇ψ(ψ = μ/r) */
const gradPsi = (mu, x, y) => { const r = Math.hypot(x, y), k = -mu / (r * r * r); return [k * x, k * y]; };

/* ───────── T1 一様な場・一定の力(閉じた式と求積)───────── */
/** 型 (1): β(τ)(dP/dt = F・ψ 一定・u = 0)—— q/(m c₀) = τ e^(−3ψ) */
export const beta1 = (tau, psi) => { const z = tau * Math.exp(-3 * psi); return z / Math.sqrt(1 + z * z); };
/** 型 (2): β(τ) —— p = ½: sin τ(τ ≥ π/2 で 1)・p = 1: tanh τ・p = 3⁄2: τ/√(1 + τ²)。それ以外は数値 */
export function beta2(tau, p) {
  if (p === 0.5) return tau >= Math.PI / 2 ? 1 : Math.sin(tau);
  if (p === 1) return Math.tanh(tau);
  if (p === 1.5) return tau / Math.sqrt(1 + tau * tau);
  return null;
}
export const gOf = (form, b) => (form === 'R1' ? b * b : (b < 1 ? b * b / (1 - b * b) : Infinity));
/** 型 (3): τ(β) = ∫₀^β (1 + ε g) db —— R1: β + εβ³/3・R2: β + ε(atanh β − β) */
export const tau3 = (form, eps, b) => (form === 'R1' ? b + eps * b * b * b / 3 : b + eps * (Math.atanh(b) - b));
/** 型 (3): β(τ) —— τ(β) の逆(二分法) */
export function beta3(form, eps, tau) {
  if (form === 'R1' && tau >= tau3('R1', eps, 1)) return null;   // c_loc を超えた後(β > 1 —— 時計は止まる)は数として持たない
  let lo = 0, hi = 1;
  for (let i = 0; i < 200; i++) { const mid = 0.5 * (lo + hi); if (tau3(form, eps, mid) < tau) lo = mid; else hi = mid; }
  return 0.5 * (lo + hi);
}
/** 台形より精しい Simpson(n は偶数) */
export function simpson(f, a, b, n = DECL.nQuad) {
  const h = (b - a) / n; let s = f(a) + f(b);
  for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * f(a + i * h);
  return s * h / 3;
}
/** 加速に要るエネルギー ÷ 今のアプリの ½ m w²(w = β c_loc) */
export function energyRatio(type, knob, b) {
  if (type === 0) return 1;
  if (type === 1) { const g = 1 / Math.sqrt(1 - b * b); return 2 * Math.exp(3 * knob.psi) * (g - 1) / (b * b); }   // H − H₀ = N m c₀²(γ − 1)
  if (type === 2) return simpson((x) => x * Math.pow(1 - x * x, -knob.p), 0, b) / (b * b / 2);
  if (type === 3) return 1 + knob.eps * simpson((x) => gOf(knob.form, x) * x, 0, b) / (b * b / 2);
  return null;
}
/** 1 往復(0 → β → 0)で失う量 ÷ ½ m w²(= 加速に要るエネルギー − 減速で戻るエネルギー —— 原仮定者の推測(第138報)の「加速の方がわずかに多く」に当たる量) */
export function cycleLoss(type, knob, b) {
  if (type !== 3) return 0;
  const up = simpson((x) => knob.eps * gOf(knob.form, x) * x, 0, b);
  const em = knob.sym ? knob.eps : 0, dn = simpson((x) => { const g = em * gOf(knob.form, x); return g / (1 + g) * x; }, 0, b);
  return (up + dn) / (b * b / 2);
}
/** 閉じた式(照合用): 型 (2) のエネルギー比・型 (3) の加速のエネルギー比 */
export function energyClosed(type, knob, b) {
  const K = b * b / 2;
  if (type === 2) { const p = knob.p; if (p === 0.5) return (1 - Math.sqrt(1 - b * b)) / K; if (p === 1) return -0.5 * Math.log(1 - b * b) / K; if (p === 1.5) return (1 / Math.sqrt(1 - b * b) - 1) / K; }
  if (type === 3) return knob.form === 'R1' ? 1 + knob.eps * b * b / 2 : 1 + knob.eps * (-1 - Math.log(1 - b * b) / (b * b));
  return null;
}
/** T1 の行の一覧 */
export function t1Rows() {
  const rows = [];
  const read = (betaOf) => DECL.tauRead.map((t) => { const v = betaOf(t); return v === null ? null : v; });
  const mk = (type, label, knob, betaOf, cross, asym) => {
    const e = DECL.betaRead.map((b) => energyRatio(type, knob, b)), l = DECL.betaRead.map((b) => cycleLoss(type, knob, b));
    rows.push({ type, label, knob, betaAtTau: read(betaOf), crosses: cross.crosses, reaches: cross.reaches, tauCross: cross.tau, asymptote: asym, energyRatio: e, cycleLoss: l });
  };
  mk(0, 'type0', {}, (t) => t, { crosses: true, reaches: true, tau: 1 }, 'w = (F/m) t —— τ = 1 で c_loc に達し、その先も加速する(時計は止まる)');
  for (const psi of DECL.psiT1) mk(1, 'type1', { psi }, (t) => beta1(t, psi), { crosses: false, reaches: false, tau: null }, '1 − β ≈ ½ e^(6ψ)/τ²(冪 −2 で近付く・超えない)');
  for (const p of DECL.pGrid) {
    const asym = p === 0.5 ? 'β = sin τ —— τ = π/2 で c_loc に達し、その先は 1 に留まる(越えない)' : p === 1 ? '1 − β ≈ 2 e^(−2τ)(指数で近付く)' : '1 − β ≈ 1/(2τ²)(冪 −2 —— 型 (1) の ψ = 0 と同じ)';
    mk(2, 'type2', { p }, (t) => beta2(t, p), { crosses: false, reaches: p === 0.5, tau: p === 0.5 ? Math.PI / 2 : null }, asym);
  }
  for (const form of DECL.gForms) for (const eps of DECL.epsGrid) for (const sym of [true, false]) {
    const crossTau = form === 'R1' ? tau3('R1', eps, 1) : null;
    mk(3, 'type3', { form, eps, sym }, (t) => beta3(form, eps, t), { crosses: form === 'R1', reaches: form === 'R1', tau: crossTau },
      form === 'R1' ? 'τ = 1 + ε/3 で c_loc に達し、その先も加速する(加速の効きは 1/(1 + ε β²) まで —— 0 にならない)' : '1 − β ≈ 2 e^(−2(τ − τ₀)/ε)(τ₀ は ε に依る定数 —— 指数で近付く・超えない)');
  }
  return rows;
}

/* ───────── T2 不均一な場の曲がり ───────── */
/** 型ごとの微分(状態 [x, y, a, b] —— 型 (1) は a, b = P・ほかは速度) */
export function derivOf(kind, mu, knob = {}) {
  if (kind === 'light') return (s) => { const [x, y, Px, Py] = s, psi = psiAt(mu, x, y), e2 = Math.exp(-2 * psi), P = Math.hypot(Px, Py), g = gradPsi(mu, x, y);
    return [e2 * Px / P, e2 * Py / P, 2 * P * e2 * g[0], 2 * P * e2 * g[1]]; };
  if (kind === 'type1') return (s) => { const [x, y, Px, Py] = s, psi = psiAt(mu, x, y), P2 = Px * Px + Py * Py, S = Math.sqrt(1 + Math.exp(-2 * psi) * P2), g = gradPsi(mu, x, y),
    k = Math.exp(-psi) * (S + Math.exp(-2 * psi) * P2 / S), e3 = Math.exp(-3 * psi) / S; return [e3 * Px, e3 * Py, k * g[0], k * g[1]]; };
  if (kind === 'type1static') return (s) => { const [x, y, vx, vy] = s, psi = psiAt(mu, x, y), g = gradPsi(mu, x, y), f = Math.exp(-4 * psi); return [vx, vy, f * g[0], f * g[1]]; };
  if (kind === 'type0') return (s) => { const [x, y, vx, vy] = s, g = gradPsi(mu, x, y); return [vx, vy, g[0], g[1]]; };
  if (kind === 'type2') return (s) => { const [x, y, vx, vy] = s, psi = psiAt(mu, x, y), g = gradPsi(mu, x, y), b2 = (vx * vx + vy * vy) * Math.exp(4 * psi), f = Math.pow(Math.max(0, 1 - b2), knob.p);
    return [vx, vy, f * g[0], f * g[1]]; };
  if (kind === 'type3') return (s) => { const [x, y, vx, vy] = s, psi = psiAt(mu, x, y), g = gradPsi(mu, x, y), v2 = vx * vx + vy * vy, b = Math.sqrt(v2) * Math.exp(2 * psi);
    const at = (g[0] * vx + g[1] * vy) / v2, tx = at * vx, ty = at * vy, gg = gOf(knob.form, b), ep = knob.eps, em = knob.sym ? knob.eps : 0;
    const k = at > 0 ? 1 / (1 + ep * gg) : (1 + em * gg); return [vx, vy, g[0] - tx + k * tx, g[1] - ty + k * ty]; };
  throw new Error('derivOf: 型が無い ' + kind);
}
export function rk4Step(f, s, h) {
  const k1 = f(s), s2 = s.map((v, i) => v + 0.5 * h * k1[i]), k2 = f(s2), s3 = s.map((v, i) => v + 0.5 * h * k2[i]), k3 = f(s3), s4 = s.map((v, i) => v + h * k3[i]), k4 = f(s4);
  return s.map((v, i) => v + h / 6 * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
}
/** 曲がりの角(数値): 始点 (−X, b)・+x 向き・x = +X まで。角は第340便h の thinAngle(atan2(|外積|, 内積))。端の欠けは一次の形 X/√(X² + b²) で戻す */
export function deflection(kind, b, knob = {}, { mu = 1, h = DECL.hRay, xOverB = DECL.xStartOverB } = {}) {
  const X = xOverB * b, f = derivOf(kind, mu, knob);
  let s;
  const psi0 = psiAt(mu, -X, b);
  if (kind === 'light') s = [-X, b, 1, 0];
  else if (kind === 'type1') { const be = knob.beta, q = be / Math.sqrt(1 - be * be); s = [-X, b, q * Math.exp(psi0), 0]; }
  else s = [-X, b, knob.beta * cLoc(psi0), 0];
  const v0 = f(s).slice(0, 2);
  let n = 0;
  while (s[0] < X && n < 2e6) { const r = Math.hypot(s[0], s[1]), v = f(s), sp = Math.hypot(v[0], v[1]); let dt = h * r / sp; if (s[0] + v[0] * dt > X) dt = (X - s[0]) / v[0]; s = rk4Step(f, s, dt); n++; }
  const v1 = f(s).slice(0, 2), raw = thinAngle([v0[0], v0[1], 0], [v1[0], v1[1], 0]), corr = raw * Math.hypot(X, b) / X;
  return { alpha: corr, alphaRaw: raw, steps: n };
}
/** 弱い場の一次の閉じた式(× μ/b): 光 4・型 (1) 2(1 + 1/β²)・型 (0) と型 (3) 2/β²(接線の成分は一次で効かない)・型 (2) 2(1 − β²)^p/β²(弱い場の一次 —— 速さの変化は二次) */
export function deflClosed(kind, knob = {}) {
  if (kind === 'light') return 4;
  const b2 = knob.beta * knob.beta;
  if (kind === 'type1') return 2 * (1 + 1 / b2);
  if (kind === 'type0' || kind === 'type3') return 2 / b2;
  if (kind === 'type2') return 2 * Math.pow(1 - b2, knob.p) / b2;
  return null;
}
/** T2 の行(b ÷ μ × 型) */
export function t2Rows() {
  const out = [];
  for (const b of DECL.bGrid) {
    const L = deflection('light', b), lightA = L.alpha;
    const row = (kind, knob) => { const d = deflection(kind, b, knob), cl = deflClosed(kind, knob); return { kind, knob, alphaOverMuB: d.alpha * b, closed: cl, overClosed: d.alpha * b / cl, overLight: d.alpha / lightA }; };
    const list = [{ kind: 'light', knob: {}, alphaOverMuB: lightA * b, closed: 4, overClosed: lightA * b / 4, overLight: 1 }];
    list.push(row('type0', { beta: 1 }));
    for (const be of DECL.betaInf) list.push(row('type0', { beta: be }));
    for (const be of DECL.betaInf) list.push(row('type1', { beta: be }));
    for (const p of DECL.pGrid) for (const be of DECL.betaInf) list.push(row('type2', { p, beta: be }));
    for (const be of DECL.betaInf3) list.push(row('type3', { form: 'R2', eps: 1, sym: true, beta: be }));
    out.push({ bOverMu: b, rows: list });
  }
  return out;
}
/** 光の物差し: 区間 r₁〜2r₁(動径)—— 座標の長さ L・片道の座標の時間 t = ∫ dr/c_loc(c₀ = 1)・測り方ごとの長さ ÷ L */
export function rulerRow(psi1) {
  const mu = psi1, r1 = 1, r2 = 2, L = r2 - r1, psi2 = mu / r2;
  const t = simpson((r) => Math.exp(2 * mu / r), r1, r2), lam = simpson((r) => Math.exp(mu / r - psi2), r1, r2);
  const cl = simpson((r) => cLoc(mu / r) * Math.exp(2 * mu / r), r1, r2);   // ∫ c_loc dt = ∫ c_loc (dr/c_loc)
  return { psi1, psi2, L, cLocInt: cl / L, c0t: t / L, cLocOuterT: cLoc(psi2) * t / L, cLocInnerT: cLoc(psi1) * t / L, tauOuter: Math.exp(-psi2) * t / L, wavelengths: lam / L };
}

/* ───────── T3 軌道の近点(水星の形 —— a = 1・μ を誇張して数値・閉じた式は × μ/(a(1 − e²)))───────── */
/** 状態の作り方: 近点 r_p = a(1 − e) にニュートンの速さ */
function orbitInit(kind, mu, e) {
  const rp = 1 - e, vp = Math.sqrt(mu * (1 + e) / rp);
  if (kind === 'type1') { const psi = mu / rp, w = vp / cLoc(psi), q = w / Math.sqrt(1 - w * w); return [rp, 0, 0, q * Math.exp(psi)]; }
  return [rp, 0, 0, vp];
}
/** 1 周の近点の回り ÷ 1PN(6πμ/(a(1 − e²)))と 1 周の a の変化(ln a —— 近点ごとのニュートンのエネルギーから)。近点は x·ẋ の符号の変わり目を、その刻みの中の二分法で詰める */
export function apsidalRate(kind, knob = {}, { mu = DECL.orbit.mu, e = DECL.orbit.e, steps = DECL.orbit.stepsPerOrbit, nOrb = DECL.orbit.nOrb } = {}) {
  const f = derivOf(kind, mu, knob), P = 2 * Math.PI / Math.sqrt(mu), h = P / steps;
  let s = orbitInit(kind, mu, e);
  const rv = (q) => { const d = f(q); return q[0] * d[0] + q[1] * d[1]; };
  const energy = (q) => { const d = f(q), v2 = d[0] * d[0] + d[1] * d[1]; return 0.5 * v2 - mu / Math.hypot(q[0], q[1]); };
  const peri = [], periE = [];
  const unwrap = (q, ref) => { const ph = Math.atan2(q[1], q[0]); return ph + 2 * Math.PI * Math.round((ref - ph) / (2 * Math.PI)); };
  let phiPrev = Math.atan2(s[1], s[0]), g0 = rv(s);
  for (let i = 0; i < steps * nOrb + steps / 2; i++) {
    const s1 = rk4Step(f, s, h), g1 = rv(s1);
    if (g0 < 0 && g1 >= 0) {
      let lo = 0, hi = h;
      for (let k = 0; k < 60; k++) { const mid = 0.5 * (lo + hi), sm = rk4Step(f, s, mid); if (rv(sm) < 0) lo = mid; else hi = mid; }
      const sp = rk4Step(f, s, 0.5 * (lo + hi)); peri.push(unwrap(sp, phiPrev)); periE.push(energy(sp));
    }
    phiPrev = unwrap(s1, phiPrev); s = s1; g0 = g1;
  }
  const d = []; for (let i = 1; i < peri.length; i++) d.push(peri[i] - peri[i - 1] - 2 * Math.PI);
  const per = d.reduce((x, y) => x + y, 0) / d.length, pn = 6 * Math.PI * mu / (1 - e * e), nE = periE.length;
  // a の変化はニュートンのエネルギー(近点ごと —— 同じ位相)から: ln a の 1 周の変化 = (E_最初/E_最後 − 1)/(近点の数 − 1)。保存する型(型 (1)・(2))では位相が同じなので丸めの桁
  return { perOrbit: per, overPN: per / pn, nPeri: peri.length, dLnAperOrbit: (periE[0] / periE[nE - 1] - 1) / (nE - 1) };
}
/** 閉じた式(× 1PN): 型 (0) 0・型 (1) 1(β = γ = 1 の形)・型 (1) の静止の部分(e^(−4ψ) ∇ψ)−2/3・型 (2) −p/3・型 (3) 対称 0 */
export function apsClosed(kind, knob = {}) {
  if (kind === 'type0') return 0;
  if (kind === 'type1') return 1;
  if (kind === 'type1static') return -2 / 3;
  if (kind === 'type2') return -knob.p / 3;
  if (kind === 'type3') return knob.sym ? 0 : null;
  return null;
}
/** 水星の 1PN(″/世紀 —— 第333便c の q1PNPerOrbit と toArcsecCy) */
export function mercury1PN() {
  const q = DECL.mercury, GM = M3.DECL.G * (q.M + q.m), per = M3.q1PNPerOrbit(GM, q.a, q.e, M3.DECL.c), P = 2 * Math.PI * Math.sqrt(q.a ** 3 / GM);
  return { perOrbit: per, periodS: P, arcsecCy: M3.toArcsecCy(per / P), psi: GM / (M3.DECL.c ** 2 * q.a) };
}
export function t3Rows() {
  const pn = mercury1PN(), rows = [];
  const add = (kind, knob, role) => { const r = apsidalRate(kind, knob), cl = apsClosed(kind, knob);
    rows.push({ kind, knob, role, overPN: r.overPN, closed: cl, dLnAperOrbit: r.dLnAperOrbit, mercuryArcsecCy: r.overPN * pn.arcsecCy, nPeri: r.nPeri }); };
  add('type0', {}, 'control');
  add('type1', {}, 'replace');
  add('type1static', {}, 'part');
  for (const p of DECL.pGrid) add('type2', { p }, 'add');
  for (const sym of [true, false]) add('type3', { form: 'R1', eps: DECL.orbit.eps3, sym }, 'add');
  // 足す型としての型 (1)(今の重力に H の重力をもう 1 度 —— 2 度足す): 周期 1/√2・1PN の回り 2√2 倍(閉じた式 —— 第340便e の doubleCount と同じ形)
  const q = DECL.mercury, GM = M3.DECL.G * (q.M + q.m), P2 = 2 * Math.PI * Math.sqrt(q.a ** 3 / (2 * GM)), per2 = M3.q1PNPerOrbit(2 * GM, q.a, q.e, M3.DECL.c);
  const twice = { periodRatio: P2 / pn.periodS, pnRatio: M3.toArcsecCy(per2 / P2) / pn.arcsecCy };
  // GPS(型 (2) —— 円の軌道の速さ v² = (GM/r)(1 − p β²)・運動の項 ∝ v²)
  const G = DECL.gps, b2 = M3.DECL.G * G.M / G.r / M3.DECL.c ** 2;
  const gps = DECL.pGrid.map((p) => ({ p, beta2: b2, motionShiftUsPerDay: G.motionUsPerDay * (-p * b2) }));
  return { pn, rows, twice, gps };
}

/* ───────── T4 零試験 ───────── */
export function zeroTests() {
  // (a) 天体が 1 つ —— u に運ばれるだけ(w = 0): 型 (1) は P = 0 で v = u・力 0/型 (2)(3) は外の力 0 で 0・熱 0(一様な ψ・u は並進と剛体の回転)
  const us = [[0.3, 0], [0, 0]], omega = 0.2, pts = [[1, 0.5], [-2, 3]];
  let maxForce = 0, maxHeat = 0, maxSlip = 0;
  for (const [x, y] of pts) for (const ut of us) {
    const u = [ut[0] - omega * y, ut[1] + omega * x], psi = 0.3;   // 一様な ψ(傾き 0)
    // 型 (1): ẋ = u + e^(−3ψ) P/S・Ṗ = −∇(u·P) − ∇(N S)(傾き 0)—— P = 0 で ẋ = u・Ṗ = 0
    const P = [0, 0], S = Math.sqrt(1 + Math.exp(-2 * psi) * 0), xd = [u[0] + Math.exp(-3 * psi) * P[0] / S, u[1] + Math.exp(-3 * psi) * P[1] / S];
    const Pd = [-(0 * P[0] + omega * P[1]), -(-omega * P[0] + 0 * P[1])];   // −∇(u·P) の剛体の回転の分(P = 0 で 0)
    maxSlip = Math.max(maxSlip, Math.hypot(xd[0] - u[0], xd[1] - u[1])); maxForce = Math.max(maxForce, Math.hypot(Pd[0], Pd[1]));
    // 型 (3): w = 0 で g = 0 → 熱 0
    for (const form of DECL.gForms) maxHeat = Math.max(maxHeat, gOf(form, 0));
  }
  // (b) 離して静止させた 2 体: 加速度 ÷ G₀M/r²(水星の距離の ψ)
  const psiM = mercury1PN().psi;
  const staticPair = { psi: psiM, type0: 1, type1replace: Math.exp(-4 * psiM), type1added: 1 + Math.exp(-4 * psiM), type2: Math.pow(1 - 0, 1), type3: 1 };
  // (c) 低速の極限: 加速度の相対の差(今のアプリとの差)と次数(log の傾き)
  const lowOf = (fn) => { const d = DECL.betaLow.map((b) => Math.abs(fn(b))); return { diffs: d, order: Math.log(d[0] / d[2]) / Math.log(DECL.betaLow[0] / DECL.betaLow[2]) }; };
  const low = {
    type1psi0: lowOf((b) => Math.pow(1 - b * b, 1.5) - 1),
    type1psi01: { diffs: DECL.betaLow.map((b) => Math.abs(Math.exp(-0.3) * Math.pow(1 - b * b, 1.5) - 1)), zerothOrder: Math.exp(-0.3) - 1 },
    type2: DECL.pGrid.map((p) => Object.assign({ p }, lowOf((b) => Math.pow(1 - b * b, p) - 1))),
    type3: DECL.gForms.map((form) => Object.assign({ form }, lowOf((b) => 1 / (1 + gOf(form, b)) - 1))),
  };
  return { single: { maxSlip, maxForce, maxHeat }, staticPair, low };
}

/* ───────── 純関数の場面 ───────── */
export function pureScenes() {
  // ① 型 (1) の m = 0: 速さ = c_loc(P の大きさ・ψ に依らない)
  let m0 = 0; for (const psi of [0, 0.01, 0.3]) for (const P of [1e-3, 1, 1e3]) { const d = derivOf('light', psi)([1, 0, P, 0]); m0 = Math.max(m0, Math.abs(Math.hypot(d[0], d[1]) / cLoc(psi) - 1)); }
  // ② 型 (2) p = 3⁄2 と型 (1) ψ = 0 の β(τ) が同じ
  let p32 = 0; for (const t of [0.1, 1, 3, 30]) p32 = Math.max(p32, Math.abs(beta2(t, 1.5) - beta1(t, 0)));
  // ③ エネルギー比: 求積と閉じた式
  let eq = 0; for (const b of DECL.betaRead) { for (const p of DECL.pGrid) eq = Math.max(eq, Math.abs(energyRatio(2, { p }, b) / energyClosed(2, { p }, b) - 1));
    for (const form of DECL.gForms) eq = Math.max(eq, Math.abs(energyRatio(3, { form, eps: 1 }, b) / energyClosed(3, { form, eps: 1 }, b) - 1)); }
  // ④ 光の H は静かな場で保存(c_loc |P| —— 衝突径数 1e3 の走り)
  const mu = 1, b = 1e3, X = 1e3 * b, f = derivOf('light', mu); let s = [-X, b, 1, 0]; const H0 = cLoc(psiAt(mu, s[0], s[1])) * Math.hypot(s[2], s[3]);
  for (let i = 0; i < 4000 && s[0] < X; i++) { const r = Math.hypot(s[0], s[1]); s = rk4Step(f, s, DECL.hRay * r); }
  const H1 = cLoc(psiAt(mu, s[0], s[1])) * Math.hypot(s[2], s[3]), hDrift = Math.abs(H1 / H0 - 1);
  // ⑤ 型 (1) の速さは c_loc を超えない(β∞ 0.999・b = 1e3 の走りの全部の点で w/c_loc < 1)
  const f1 = derivOf('type1', 1); const be = 0.999, q = be / Math.sqrt(1 - be * be); let s1 = [-1e6, 1e3, q, 0], wMax = 0;
  for (let i = 0; i < 20000 && s1[0] < 1e6; i++) { const d = f1(s1), r = Math.hypot(s1[0], s1[1]); wMax = Math.max(wMax, Math.hypot(d[0], d[1]) / cLoc(psiAt(1, s1[0], s1[1]))); s1 = rk4Step(f1, s1, DECL.hRay * r / Math.hypot(d[0], d[1])); }
  // ⑥ 拒否: 型が無い・p の閉じた式が無い
  let rej = 0; try { derivOf('nope', 1); } catch (e) { rej++; } if (beta2(1, 2) === null) rej++; if (apsClosed('type3', { sym: false }) === null) rej++;
  return { m0Speed: m0, p32Same: p32, energyQuad: eq, hDrift, type1wMax: wMax, reject: { n: rej, of: 3 } };
}
export function pureGates(S) {
  return { m0Speed: S.m0Speed < 1e-14, p32Same: S.p32Same < 1e-15, energyQuad: S.energyQuad < 1e-9, hDrift: S.hDrift < 1e-10, type1Sub: S.type1wMax < 1, reject: S.reject.n === S.reject.of };
}
