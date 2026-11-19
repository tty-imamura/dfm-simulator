// 第342便b(原仮定者の回答(2026-11-18 —— 第142報)AN806「局所光速に近づくと、時間の進みが局所時間からさらに遅くなり、絶対時間側から見ると加速しにくく見える。
//   速度が局所光速に達した時に時間が止まる場合と、速度が無限になった時に時間が止まる場合を、比較する」・統括の検証項目 R373):
//   **時計の止まり方の 2 つの場合(局所光速で止まる型 F/速さが無限で止まる型 U —— U は形を決め打ちしない 3 つの形)と、絶対時間から見た加速を並べる純関数 —— 診断だけ**
//   (器 tests/exp-w342b-clockstop.mjs と QA behavior.clockstop342b・docs.clockstop342b が読む —— html を読まない・ファイルを読まない・状態を持たない)。
//   エンジン・時計の式・運動の式・光線・内蔵の本・受理器は変えない(読むだけ)。第341便e の lib(一定の力の速さの曲線・曲がりと近点の器)と第340便h の lib(薄い角)は呼ぶだけ。
//
// ■ 記号(無次元・基準光速 c₀ = 1): 絶対時間 t・静止した局所の時計の進み N = e^(−ψ)・場に対する相対の速さ w = 大きさ(v − u)・局所光速 c_loc = c₀ e^(−2ψ)・x = w ÷ c_loc。
//   粒子の時計 dτ/dt = N g(x)。今のアプリの点の時計 dτ/dt = √(N² − A² w²/c₀²)(A = e^(+ψ))は N √(1 − x²) —— 型 F と同じ形。
//   **2 つの場合とも同じ x(絶対時間で測った、場に対する速さ)で比べる**(T3 —— 粒子自身の時計で測った速さを U に入れると F と同じ時計になる取り違え)。
// ■ 時計の型(ノブ —— どれもアプリへ入れたものではない。今のアプリの点の時計は F のまま)
//   F  = √(1 − x²)(x ≤ 1。x > 1 は定義域の外 —— アプリは根号の中が 0 以下なら時計の加算を 0 にする。表では「定義域の外」と書き、0 と混ぜない)。
//   U1 = 1/√(1 + x²)・U2 = 1/(1 + x²/2)・U3 = exp(−x²/2)(どれも有限の x では正・x → ∞ で 0)。
// ■ 駆動の宣言(T2 —— 時計の型だけでは加速は決まらない): 「粒子の時計 1 秒あたり同じ速度の増し分」dw/dτ = a*(べき n = 1 —— 連鎖律で dw/dt = a* N g(x))と、
//   べき n = 2 の読み(d²/dt² = (dτ/dt)² d²/dτ² —— dw/dt = a* N² g(x)²)。一様な場(N・c_loc は一定)・初速 0。無次元の時間 T = a* N^n t ÷ c_loc で dx/dT = g(x)^n。
//   〔訂正(第343便c・統括の検証項目 R380): この読みは一般の連鎖律としては項が 1 つ足りない —— 正しくは d²p/dt² = (dτ/dt)² d²p/dτ² + (d²τ/dt²)(dp/dτ)。べき 2 の列の数は「時計の進みの二乗を掛ける、別の駆動の宣言」として有効で、数は変わらない(足りない項を入れた読みは〔第343便c〕の表)〕
//   粒子の時計は θ = a* N^(n−1) τ ÷ c_loc で dθ/dT = g(x)(n = 1 では θ = x)。
// ■ 言わないこと: 型は候補(時計の則ではない)・駆動の宣言は比べるための宣言(標準の力学の固有の加速度や dP/dt を固定した実験と同じ物とは書かない)・
//   光速を、引きずりの候補の採否に使わない(原仮定者の指示(2026-11-17 —— 第140報)—— 本 lib の速さは場に対する物質の相対の速さで、座標を運ぶ速さ u は切らない)。
import * as L from './lib-w341e-lightmass.mjs';
import { thinAngle } from './lib-w340h-thin.mjs';

export const LIB_VERSION = 'w342b-clockstop-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);

export const DECL = Object.freeze({
  types: Object.freeze(['F', 'U1', 'U2', 'U3']),
  /** T1: g(x) を読む x・低速の展開を読む x(Richardson の 2 点) */
  xGrid: Object.freeze([0, 0.1, 0.5, 0.9, 0.99, 1, 2, 10]),
  xLow: Object.freeze([1e-2, 5e-3]),
  /** T2: 駆動のべき・到達の時間を読む x・同じ絶対時間で読む T・求積と RK4 の刻み */
  nGrid: Object.freeze([1, 2]),
  xReach: Object.freeze([0.5, 0.9, 0.99, 1, 2, 10]),
  tRead: Object.freeze([0.5, 1, 1.5, 2, 3, 5]),
  nQuad: 40000, hOde: 1e-4,
  /** T3: 取り違えの恒等式を読む x */
  xMix: Object.freeze([0, 0.1, 0.5, 0.9, 0.99, 0.999]),
  /** T5: 衝突径数 ÷ μ・寄せる速さ x∞(c_loc に対する比 —— 始点の場で) */
  bGrid: Object.freeze([1e4, 1e5]),
  xInf: Object.freeze([0.5, 0.9, 0.99, 1]),
  /** T6: 第341便e の軌道(a = 1・e = 水星・1 周 6000 刻み・4 周)を μ = 1e-5 と、型の間の差を読む誇張した μ の 3 つで */
  muDiff: Object.freeze([1e-3, 5e-4, 2.5e-4]),
  fOutside: 'F の x > 1 は定義域の外。曲がりと近点の走り(加速 × g^n)では、第341便e の型 (2) と同じく max(0, 1 − x²) の係数(加速 0)で進める宣言',
});

/* ───────── T1 時計の型 ───────── */
/** g(x)(静止した局所の時計に対する比)。F の x > 1 は null(定義域の外 —— 0 ではない) */
export function gOf(type, x) {
  if (!(fin(x) && x >= 0)) throw new Error('gOf: x は有限で非負 ' + x);
  if (type === 'F') return x <= 1 ? Math.sqrt(1 - x * x) : null;
  if (type === 'U1') return 1 / Math.sqrt(1 + x * x);
  if (type === 'U2') return 1 / (1 + x * x / 2);
  if (type === 'U3') return Math.exp(-x * x / 2);
  throw new Error('gOf: 型が無い ' + type);
}
/** 走りの中で使う係数(F の x > 1 は 0 —— DECL.fOutside の宣言) */
const gRun = (type, x) => (type === 'F' ? Math.sqrt(Math.max(0, 1 - x * x)) : gOf(type, x));
/** 止まる x(F は 1・U は ∞)と、g(1) */
export const stopAt = (type) => (type === 'F' ? 1 : Infinity);
/** 低速の展開 g = 1 − x²/2 + c₄ x⁴ + …の c₄(閉じた形): F −1/8・U1 3/8・U2 1/4・U3 1/8 */
export const c4Closed = Object.freeze({ F: -1 / 8, U1: 3 / 8, U2: 1 / 4, U3: 1 / 8 });
/** 数値の c₂・c₄(2 点の Richardson —— c(x) = (g − 1 + x²/2)/x⁴ = c₄ + c₆ x² + …) */
export function lowOrder(type) {
  const [x1, x2] = DECL.xLow;
  const c2 = (x) => (gOf(type, x) - 1) / (x * x);
  const c4 = (x) => (gOf(type, x) - 1 + x * x / 2) / (x * x * x * x);
  const r = (f) => (x1 * x1 * f(x2) - x2 * x2 * f(x1)) / (x1 * x1 - x2 * x2);
  return { c2: r(c2), c4: r(c4), c4Closed: c4Closed[type] };
}
export function t1Rows() {
  return DECL.types.map((type) => {
    const lo = lowOrder(type);
    return { type, g: DECL.xGrid.map((x) => gOf(type, x)), stopX: stopAt(type) === Infinity ? 'inf' : stopAt(type), gAt1: gOf(type, 1), c2: lo.c2, c4: lo.c4, c4Closed: lo.c4Closed };
  });
}

/* ───────── T2 絶対時間から見た加速(一様な場・初速 0)───────── */
/** U3 の級数: ∫₀^x e^(k s²) ds = Σ x^(2j+1) k^j / (j! (2j+1))(k = ½ と 1 —— 正の項だけ) */
function expSeries(x, k) {
  let term = x, s = x;   // j = 0 の項 x^1/(0! 1)の分子
  let num = x;
  for (let j = 1; j < 2000; j++) {
    num *= x * x * k / j;   // x^(2j+1) k^j / j!
    term = num / (2 * j + 1); s += term;
    if (j > k * x * x + 5 && term < 1e-17 * s) break;
  }
  return s;
}
/** x に届くまでの無次元の時間 T_n(x)(閉じた形)。届かないなら Infinity。F の x > 1 は null(定義域の外) */
export function tClosed(type, n, x) {
  if (type === 'F') {
    if (x > 1) return null;
    if (n === 1) return Math.asin(x);
    if (n === 2) return x < 1 ? Math.atanh(x) : Infinity;
    if (n === 3) return x < 1 ? x / Math.sqrt(1 - x * x) : Infinity;   // 第341便e の型 (1) ψ = 0 との恒等式(T4)用
  }
  if (type === 'U1') { if (n === 1) return 0.5 * (x * Math.sqrt(1 + x * x) + Math.asinh(x)); if (n === 2) return x + x * x * x / 3; }
  if (type === 'U2') { if (n === 1) return x + x * x * x / 6; if (n === 2) return x + x * x * x / 3 + x ** 5 / 20; }
  if (type === 'U3') { if (n === 1) return expSeries(x, 0.5); if (n === 2) return expSeries(x, 1); }
  throw new Error('tClosed: 型かべきが無い ' + type + ' ' + n);
}
/** 数値の T_n(x)(Simpson)。F は x = sin φ の置き換えで ∫ cos^(1−n) φ dφ */
export function tQuad(type, n, x) {
  if (type === 'F') { if (x > 1) return null; if (x === 1 && n >= 2) return Infinity; return L.simpson((p) => Math.cos(p) ** (1 - n), 0, Math.asin(x), DECL.nQuad); }
  return L.simpson((s) => gOf(type, s) ** (-n), 0, x, DECL.nQuad);
}
/** 閉じた形の逆: 同じ絶対時間 T の x(F・n = 1 は T ≥ π/2 で 1 —— 届いた後はこの駆動では g = 0 で留まる) */
export function xAtT(type, n, T) {
  if (type === 'F' && n === 1 && T >= Math.PI / 2) return 1;
  if (type === 'F' && n === 2) return Math.tanh(T);
  let lo = 0, hi = type === 'F' ? 1 : 1;
  if (type !== 'F') while (tClosed(type, n, hi) < T) hi *= 2;
  for (let i = 0; i < 200; i++) { const mid = 0.5 * (lo + hi); if (tClosed(type, n, mid) < T) lo = mid; else hi = mid; }
  return 0.5 * (lo + hi);
}
/** 粒子の時計 θ(T)(dθ/dT = g —— n = 1 は θ = x・F が届いた後は止まる/n = 2 は θ = T_1(x)) */
export function thetaAtT(type, n, T) {
  const x = xAtT(type, n, T);
  if (n === 1) return x;
  return tClosed(type, 1, x);
}
/** RK4 で dx/dT = g^n・dθ/dT = g を積む(閉じた形と照合 —— F・n = 1 は π/2 の手前まで) */
export function odeAt(type, n, Ts, h = DECL.hOde) {
  const f = (s) => { const g = gRun(type, s[0]); return [g ** n, g]; };
  let s = [0, 0], T = 0; const out = [];
  for (const Tt of Ts) {
    while (T < Tt - 1e-15) { const dt = Math.min(h, Tt - T); s = L.rk4Step(f, s, dt); T += dt; }
    out.push({ T: Tt, x: s[0], theta: s[1] });
  }
  return out;
}
/** 高い速さの近付き方(閉じた形の主の項 —— 文字で) */
export const ASYM = Object.freeze({
  'F-1': 'x = sin T —— T = π/2 で x = 1 に届く(届いた後、この駆動では g = 0 で留まる)',
  'F-2': 'x = tanh T —— 1 − x ≈ 2 e^(−2T)(届かない)',
  'U1-1': 'x ≈ √(2T)(x = 1 を T = 1.1478 で通り抜ける)',
  'U1-2': 'x ≈ (3T)^(1/3)',
  'U2-1': 'x ≈ (6T)^(1/3)',
  'U2-2': 'x ≈ (20T)^(1/5)',
  'U3-1': 'T ≈ e^(x²/2)/x —— x ≈ √(2 ln T)',
  'U3-2': 'T ≈ e^(x²)/(2x) —— x ≈ √(ln T)',
});
export function t2Rows() {
  const rows = [];
  for (const type of DECL.types) for (const n of DECL.nGrid) {
    const reach = DECL.xReach.map((x) => tClosed(type, n, x));
    const quad = DECL.xReach.map((x) => tQuad(type, n, x));
    const xs = DECL.tRead.map((T) => xAtT(type, n, T)), th = DECL.tRead.map((T) => thetaAtT(type, n, T));
    const t1 = tClosed(type, n, 1);
    rows.push({ type, n, tReach: reach.map((v) => (v === Infinity ? 'inf' : v)), tQuad: quad.map((v) => (v === Infinity ? 'inf' : v)),
      clockStops: type === 'F' ? 'x = 1' : 'x → ∞', reachesOneFinite: fin(t1), tAtOne: fin(t1) ? t1 : 'inf', passesOne: type !== 'F',
      xAtT: xs, thetaAtT: th, asym: ASYM[type + '-' + n] });
  }
  return rows;
}
/** 閉じた形と数値の照合の最大(T(x) の Simpson・x(T) の RK4) */
export function t2Check() {
  let quad = 0, ode = 0, odeTheta = 0;
  for (const type of DECL.types) for (const n of DECL.nGrid) {
    for (const x of DECL.xReach) { const a = tClosed(type, n, x), b = tQuad(type, n, x); if (fin(a) && fin(b)) quad = Math.max(quad, Math.abs(b / a - 1)); }
    const Ts = DECL.tRead.filter((T) => !(type === 'F' && n === 1 && T >= Math.PI / 2 - 1e-9));
    const O = odeAt(type, n, Ts);
    O.forEach((o) => { ode = Math.max(ode, Math.abs(o.x - xAtT(type, n, o.T)) / Math.max(1, xAtT(type, n, o.T))); odeTheta = Math.max(odeTheta, Math.abs(o.theta - thetaAtT(type, n, o.T)) / Math.max(1, thetaAtT(type, n, o.T))); });
  }
  return { quadRel: quad, odeRel: ode, odeThetaRel: odeTheta };
}

/* ───────── T3 変数の取り違え(零試験)───────── */
/** U1 に粒子自身の時計で測った速さ y = x/√(1 − x²) を入れると √(1 − x²)(F と同じ時計)。同じ x で比べると違う */
export function t3Rows() {
  const rows = DECL.xMix.map((x) => { const y = x / Math.sqrt(1 - x * x); return { x, y, u1OfY: gOf('U1', y), fOfX: gOf('F', x), u1OfX: gOf('U1', x) }; });
  const maxId = Math.max(...rows.map((r) => Math.abs(r.u1OfY - r.fOfX)));
  return { rows, identityMax: maxId };
}

/* ───────── T4 第341便e の候補の型(一定の力の速さの曲線)と同じ表 ───────── */
/** 第341便e の τ = t/t_N(t_N = m c_loc/F)は、a* N = F/m と置くと T と同じ時間の物差し(低速で dx/dT = 1) */
export function t4Rows() {
  const Ts = DECL.tRead;
  const curves = [
    { label: 'type0', knob: {}, f: (t) => t },
    { label: 'type1', knob: { psi: 0 }, f: (t) => L.beta1(t, 0) },
    { label: 'type1', knob: { psi: 0.1 }, f: (t) => L.beta1(t, 0.1) },
    ...L.DECL.pGrid.map((p) => ({ label: 'type2', knob: { p }, f: (t) => L.beta2(t, p) })),
    ...L.DECL.gForms.flatMap((form) => L.DECL.epsGrid.map((eps) => ({ label: 'type3', knob: { form, eps }, f: (t) => L.beta3(form, eps, t) }))),
  ];
  const clocks = [];
  for (const type of DECL.types) for (const n of DECL.nGrid) clocks.push({ type, n });
  clocks.push({ type: 'F', n: 3 });   // 型 (1) ψ = 0・型 (2) p = 3⁄2 と同じ形を読むための参考の列(g_F^3 = (1 − x²)^(3/2))
  const xOfClock = (c, t) => (c.n === 3 ? t / Math.sqrt(1 + t * t) : xAtT(c.type, c.n, t));
  const rows = curves.map((cv) => {
    const xs = Ts.map((t) => cv.f(t));
    let same = null;
    for (const c of clocks) {
      let m = 0, k = 0;
      Ts.forEach((t, i) => { if (xs[i] !== null) { m = Math.max(m, Math.abs(xs[i] - xOfClock(c, t))); k++; } });
      if (k > 0 && m < 1e-12) { same = { type: c.type, n: c.n, nPts: k }; break; }
    }
    return { label: cv.label, knob: cv.knob, x: xs, sameAs: same };
  });
  return { tRead: Ts, rows };
}

/* ───────── T5 不均一な場の曲がり(加速 × g^n を重力の加速にも当てた読み)───────── */
/** 曲がりの角(第341便e の deflection と同じ形 —— 始点 (−X, b)・+x 向き・端の欠けは一次の形で戻す・角は thinAngle) */
export function deflectionG(type, n, b, xInf, { mu = 1, h = L.DECL.hRay, xOverB = L.DECL.xStartOverB } = {}) {
  let over = 0;
  const f = (s) => { const [x, y, vx, vy] = s, r = Math.hypot(x, y), psi = mu / r, k = -mu / (r * r * r), xx = Math.hypot(vx, vy) * Math.exp(2 * psi);
    if (type === 'F' && xx > 1) over++;
    const a = gRun(type, xx) ** n; return [vx, vy, a * k * x, a * k * y]; };
  const X = xOverB * b, psi0 = mu / Math.hypot(X, b);
  let s = [-X, b, xInf * L.cLoc(psi0), 0];
  const v0 = f(s).slice(0, 2); let m = 0;
  while (s[0] < X && m < 2e6) { const r = Math.hypot(s[0], s[1]), v = f(s), sp = Math.hypot(v[0], v[1]); let dt = h * r / sp; if (s[0] + v[0] * dt > X) dt = (X - s[0]) / v[0]; s = L.rk4Step(f, s, dt); m++; }
  const v1 = f(s).slice(0, 2), raw = thinAngle([v0[0], v0[1], 0], [v1[0], v1[1], 0]);
  return { alpha: raw * Math.hypot(X, b) / X, steps: m, overSteps: over };
}
/** 弱い場の一次の閉じた式(× μ/b): 2 g(x∞)^n / x∞²(速さの変化は二次 —— 第341便e の型 (2) の 2(1 − β²)^p/β² と同じ形) */
export const deflClosedG = (type, n, xInf) => 2 * gRun(type, xInf) ** n / (xInf * xInf);
export function t5Rows() {
  const out = [];
  for (const b of DECL.bGrid) {
    const lightA = L.deflection('light', b).alpha, t0 = L.deflection('type0', b, { beta: 1 }).alpha;
    const rows = [{ type: 'light', n: null, xInf: 1, alphaOverMuB: lightA * b, closed: 4, overLight: 1, outside: false, byDecl: false },
      { type: 'type0', n: null, xInf: 1, alphaOverMuB: t0 * b, closed: 2, overLight: t0 / lightA, outside: false, byDecl: false }];
    for (const type of DECL.types) for (const n of DECL.nGrid) for (const xi of DECL.xInf) {
      // F の x∞ = 1: 始点で x = 1・内へ落ちると ψ が増えて x > 1(定義域の外)—— 宣言(DECL.fOutside)で加速の係数 0 なので直進(曲がり 0)。丸めで始点の x が 1 の手前に出る走りを避け、走らせずに宣言の値を置く
      if (type === 'F' && xi >= 1) { rows.push({ type, n, xInf: xi, alphaOverMuB: 0, closed: 0, overLight: 0, outside: true, byDecl: true }); continue; }
      const d = deflectionG(type, n, b, xi);
      rows.push({ type, n, xInf: xi, alphaOverMuB: d.alpha * b, closed: deflClosedG(type, n, xi), overLight: d.alpha / lightA, outside: d.overSteps > 0, byDecl: false });
    }
    out.push({ bOverMu: b, rows });
  }
  // 光子の時計に使えるか: x = 1 での g(F は 0・U は正)
  const photon = DECL.types.map((type) => ({ type, gAtOne: gOf(type, 1) }));
  // 恒等式: F・n = 1 と第341便e の型 (2) p = ½(F・n = 2 と p = 1)は同じ加速の係数 —— 同じ器の曲がりと比べる(b = 1e4 μ・x∞ = 0.9)
  const b0 = DECL.bGrid[0], ident = [1, 2].map((n) => { const a = deflectionG('F', n, b0, 0.9).alpha, c = L.deflection('type2', b0, { p: n / 2, beta: 0.9 }).alpha; return { n, p: n / 2, rel: Math.abs(a / c - 1) }; });
  return { defl: out, photon, ident };
}

/* ───────── T6 水星の近点(動かす量だけ —— アプリには足さない)───────── */
/** 近点の回り ÷ 1PN(第341便e の apsidalRate と同じ手順 —— 微分だけ「重力 × g^n」に) */
export function apsidalG(type, n, { mu = L.DECL.orbit.mu, e = L.DECL.orbit.e, steps = L.DECL.orbit.stepsPerOrbit, nOrb = L.DECL.orbit.nOrb } = {}) {
  const f = (s) => { const [x, y, vx, vy] = s, r = Math.hypot(x, y), k = -mu / (r * r * r), xx = Math.hypot(vx, vy) * Math.exp(2 * mu / r), a = gRun(type, xx) ** n; return [vx, vy, a * k * x, a * k * y]; };
  const P = 2 * Math.PI / Math.sqrt(mu), h = P / steps, rp = 1 - e;
  let s = [rp, 0, 0, Math.sqrt(mu * (1 + e) / rp)];
  const rv = (q) => q[0] * q[2] + q[1] * q[3];
  const unwrap = (q, ref) => { const ph = Math.atan2(q[1], q[0]); return ph + 2 * Math.PI * Math.round((ref - ph) / (2 * Math.PI)); };
  const peri = []; let phiPrev = Math.atan2(s[1], s[0]), g0 = rv(s);
  for (let i = 0; i < steps * nOrb + steps / 2; i++) {
    const s1 = L.rk4Step(f, s, h), g1 = rv(s1);
    if (g0 < 0 && g1 >= 0) {
      let lo = 0, hi = h;
      for (let k = 0; k < 60; k++) { const mid = 0.5 * (lo + hi), sm = L.rk4Step(f, s, mid); if (rv(sm) < 0) lo = mid; else hi = mid; }
      peri.push(unwrap(L.rk4Step(f, s, 0.5 * (lo + hi)), phiPrev));
    }
    phiPrev = unwrap(s1, phiPrev); s = s1; g0 = g1;
  }
  const d = []; for (let i = 1; i < peri.length; i++) d.push(peri[i] - peri[i - 1] - 2 * Math.PI);
  const per = d.reduce((a, b) => a + b, 0) / d.length;
  return { overPN: per / (6 * Math.PI * mu / (1 - e * e)), nPeri: peri.length };
}
export function t6Rows() {
  const pn = L.mercury1PN();
  // (a) 第341便e の器そのもの(型 (2) p = n/2 —— F・n と同じ加速の係数)
  const same = DECL.nGrid.map((n) => { const r = L.apsidalRate('type2', { p: n / 2 }); return { n, p: n / 2, overPN: r.overPN, arcsecCy: r.overPN * pn.arcsecCy }; });
  // (b) 型ごと(μ = 1e-5 —— 一次では型に依らず −n/6)
  const rows = [];
  for (const type of DECL.types) for (const n of DECL.nGrid) { const r = apsidalG(type, n); rows.push({ type, n, overPN: r.overPN, closed: -n / 6, arcsecCy: r.overPN * pn.arcsecCy }); }
  // (c) 型の間の差(U − F —— 同じ n)を誇張した μ で読み、÷ μ を水星の ψ へ写す(差は x⁴ の係数 n(c₄(U) − c₄(F)) から出る —— 一次の項と ψ の補正は型に依らない)
  const diffs = [];
  for (const n of DECL.nGrid) {
    const base = DECL.muDiff.map((mu) => apsidalG('F', n, { mu }).overPN);
    for (const type of DECL.types.filter((t) => t !== 'F')) {
      const dd = DECL.muDiff.map((mu, i) => (apsidalG(type, n, { mu }).overPN - base[i]) / mu);
      const k = dd.length - 1, coef = 2 * dd[k] - dd[k - 1], dc4 = n * (c4Closed[type] - c4Closed.F);   // μ → 0 へ一次で寄せる(μ の比 2 の 2 点)
      diffs.push({ type, n, dOverMu: dd, coef, dc4, perDc4: coef / dc4, mercuryArcsecCy: coef * pn.psi * pn.arcsecCy });
    }
  }
  return { pn: { arcsecCy: pn.arcsecCy, psi: pn.psi }, same, rows, diffs };
}

/* ───────── 零試験と純関数の場面 ───────── */
export function pureScenes() {
  // ① 静止(x = 0)で全部の型が 1(T7 —— 表面の時計の表示は型に依らない)
  const g0 = DECL.types.every((t) => Math.abs(gOf(t, 0) - 1) < 1e-15);   // 丸めの 1 bit を許す(四則と Math の関数の戻り値)
  // ② 低速で全部の型が同じ 1 − x²/2(c₂ = −½ の数値の差の最大)と c₄ の数値と閉じた形の差の最大
  let c2 = 0, c4 = 0; for (const t of DECL.types) { const lo = lowOrder(t); c2 = Math.max(c2, Math.abs(lo.c2 + 0.5)); c4 = Math.max(c4, Math.abs(lo.c4 - lo.c4Closed)); }
  // ③ T3 の恒等式
  const id = t3Rows().identityMax;
  // ④ 閉じた形と数値(Simpson・RK4)
  const ck = t2Check();
  // ⑤ 第341便e の曲線との恒等式: F・n = 1 = 型 (2) p = ½・F・n = 3 = 型 (1) ψ = 0
  let e1 = 0, e3 = 0; for (const T of [0.3, 1, 1.5]) { e1 = Math.max(e1, Math.abs(xAtT('F', 1, T) - L.beta2(T, 0.5))); } for (const T of [0.3, 1, 3, 10]) e3 = Math.max(e3, Math.abs(T / Math.sqrt(1 + T * T) - L.beta1(T, 0)));
  // ⑥ 拒否: 型が無い・x が負・F の x > 1 は null(0 ではない)・べきが無い
  let rej = 0; try { gOf('V', 0.5); } catch (e) { rej++; } try { gOf('F', -1); } catch (e) { rej++; } if (gOf('F', 2) === null) rej++; try { tClosed('U1', 4, 1); } catch (e) { rej++; }
  return { g0, c2Max: c2, c4Max: c4, identityMax: id, quadRel: ck.quadRel, odeRel: ck.odeRel, odeThetaRel: ck.odeThetaRel, sameF1: e1, sameF3: e3, reject: { n: rej, of: 4 } };
}
export function pureGates(S) {
  return { g0: S.g0 === true, lowSame: S.c2Max < 1e-6 && S.c4Max < 1e-5, identity: S.identityMax < 1e-15, closedQuad: S.quadRel < 1e-9, closedOde: S.odeRel < 1e-9 && S.odeThetaRel < 1e-9,
    sameAs341e: S.sameF1 < 1e-12 && S.sameF3 < 1e-12, reject: S.reject.n === S.reject.of };
}
