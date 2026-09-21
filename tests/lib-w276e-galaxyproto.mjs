// 第276便e(原仮定者の裁定(第66報)(4) 後半「渦巻銀河に組み合わせ、棒渦巻銀河に発展させる」)——
// **渦巻・棒の node 試作の純関数**。
//
// ■ 立場(**主張しないこと** —— 先に書く)
//   ・**腕は与えた位相結合の帰結であり、棒は与えた結合グラフである。**「腕が創発した」
//     「棒が自発形成した」「銀河が安定した」「合体を再現した」とは **1 行も書かない**。
//   ・R44 のハミルトニアン(統括の検証仮説)を写しただけで、**現行 DFM から一意に導出された
//     法則ではない**。α・β・λ_A・β_s・m・I_c・k_ℓ・J_s・J_t は**すべて宣言**である。
//   ・**エンジンには 1 バイトも接続していない**(`beta/index.html` はこの lib を 1 度も読まない。
//     `S._core` には 1 命令も足していない)。
//   ・R44 の但し書き「**r/r_c<0.05 の局所模型**」は生きている。器は走行ごとに **max r/r_c** を
//     出し、0.05 を超えた走行は**超えたと書く**。
//
// ■ 何を持っているか
//   (A) **R44 の共通力学**(粒子ごとの目標座標ではなく、同じ速度場 u を読むラグランジアン):
//         L_i = ½m|v−u(x)|² − mΦ(x)  ⇔  H = |p|²/2m + u·p + mΦ
//         ẋ = p/m + u、 ṗ = −(∇u)ᵀp − m∇Φ
//       有限中心コアの内側で κ₀ = GM_c/r_c³・W_c ≃ M_c/r_c²・**ω_m = W_c/(W_c+W₀)·ω_c**・
//         u = ω_m (ŝ×r)・Φ = ½κ₀r² + ½ω_m²{α r⊥² + β r∥²}
//       u が剛体回転 Ω=ω_m ŝ なので (∇u)ᵀp = p×Ω、 **u·p = Ω·(x×p)**。
//       速度で書き直すと **H = ½m|v|² + mΦ_eff、Φ_eff = Φ − ½ω_m²r⊥²** なので
//         **K⊥ = κ₀+(α−1)ω_m²・K∥ = κ₀+βω_m²**(R44 の閉じた正の H の条件)。
//   (B) **パターン腕**(材料腕と分ける): Φ_arm = −A(r,J_c)·cos[m(θ−φ_c) − β_s·ln(s/r₀)]。
//       近中心は窓 W(r)=r²/(r²+r_w²) で滑らかに 0 へ落とし、対数は s=√(r²+r_min²) で丸める。
//       **振幅の規則は測る前に固定**: A₀ = λ_A·f_c·ω_mc²·r_d²(f_c=W_cc/(W_cc+W₀) —— 子コアの
//       スピンと背景の重みだけから作る。観測から決めた値は 1 つも無い)。
//   (C) **位相 φ_c の共役運動量 J_c**: H に J_c²/(2I_c) を足し、φ̇_c=∂H/∂J_c・J̇_c=−∂H/∂φ_c。
//       Φ_arm は θ と φ_c に (mθ−mφ_c) の形でしか依らないので、同時回転の不変性から
//       **L_z + J_c が厳密に保存する**(Noether。器が実測で確かめる)。
//   (D) **棒の結合グラフ**: U_bar = Σ_ℓ ½k_ℓ(|R_a−R_b|−ℓ₀)² − J_s Σ_ℓ (s_a·s_b)²
//       (第66報 (4) の字義どおりの形)。**これだけでは曲げ剛性が 0** になるので、
//       宣言の拡張を 2 つ用意して**別々に測る**: (i) 第274便e の曲げ項 K_θΣ(1−t_a·t_{a+1})、
//       (ii) **結合方向とコア軸の結合** −(J_t/2)Σ[(s_a·t_a)²+(s_{a+1}·t_a)²]。
//   (E) 測る道具: m 次フーリエのコントラストと位相・半径ビンのピッチ角・逆行率・
//       軸方向半長と横断幅・剪断 r|dΩ/dr|。
//
// ■ 段の分け方(第66報 (4) の「数珠状の核が棒として運動する段階と自発形成する段階を分ける」)
//   本 lib が持つのは **「宣言した結合グラフが棒として運動する」段階だけ**である。
//   **自発形成(棒が勝手にできる)は 1 行も実装していない。**
import {
  eigSym, zeroModeCount, hessianResidual, rigidModes,
} from './lib-w274e-armbar.mjs';

/** この lib の版(形を変えたら上げる。QA `behavior.galaxyProtoLedger` がこの文字列を見る)。 */
export const GALAXYPROTO_VERSION = 'w276e-1';

/** 原仮定者の裁定(第66報)(4) と第65報 (6) の想定を、**仮説として**持つ。 */
export const GALAXY_HYPOTHESIS = {
  version: GALAXYPROTO_VERSION,
  source: '原仮定者の裁定(第66報)(4)・(第65報)(6)',
  claims: [
    'G1 親コアの面外スピンが円盤をつくる(赤道面の引きずり)',
    'G2 子コアの面内軸が腕をつくる(横倒しの自転軸方向に腕が発現する)',
    'G3 渦巻パターンは巻き込まずに保たれる(材料腕と別物である)',
    'G4 数珠状の子コアが棒として運動する',
    'G5 棒渦巻へ発展する(棒 + パターン腕の共存)',
  ],
  status: '**仮説**。本 lib は仮説を証明も反証もしない —— 与えた結合の下で何が保たれ何が保たれないかを数で分けるだけである',
  notClaim: ['腕の創発', '棒の自発形成', '銀河の安定(観測比較なし)', '渦巻銀河の再現',
    'R44 のハミルトニアンが DFM から導出されたこと'],
  imposed: ['腕の形(Φ_arm)', '腕のピッチ(β_s)', '腕の本数(m)', '棒の結合グラフ',
    'α・β(R44 の試験値)', 'λ_A・I_c・k_ℓ・J_s・J_t'],
};

/* ══════════════════════════════════════════════════════════════════════════
 * 0. ベクトルと種つき乱数(器と QA で同じ数が出るように lib に置く)
 * ════════════════════════════════════════════════════════════════════════ */
export const g3 = {
  add: (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]],
  sub: (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]],
  mul: (a, k) => [a[0] * k, a[1] * k, a[2] * k],
  dot: (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2],
  cross: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]],
  norm: (a) => Math.hypot(a[0], a[1], a[2]),
  unit: (a) => { const n = Math.hypot(a[0], a[1], a[2]); return n > 0 ? [a[0] / n, a[1] / n, a[2] / n] : [0, 0, 0]; },
};

/** mulberry32(種つき・器と QA で同じ列が出る)。 */
export function rng32(seed) {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Box–Muller(2 個ずつ作って 1 個ずつ返す)。 */
export function gaussFactory(seed) {
  const u = rng32(seed);
  let spare = null;
  return function g() {
    if (spare !== null) { const v = spare; spare = null; return v; }
    let a = 0, b = 0;
    while (a <= 1e-12) a = u();
    b = u();
    const r = Math.sqrt(-2 * Math.log(a)), th = 2 * Math.PI * b;
    spare = r * Math.sin(th);
    return r * Math.cos(th);
  };
}

/** ẑ を ŝ へ写す回転(Rodrigues。ŝ=±ẑ の縮退も扱う)。 */
export function rotZTo(s) {
  const u = g3.unit(s);
  if (Math.abs(u[2] - 1) < 1e-14) return [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
  if (Math.abs(u[2] + 1) < 1e-14) return [[1, 0, 0], [0, -1, 0], [0, 0, -1]];
  const v = g3.cross([0, 0, 1], u), c = u[2];
  const K = [[0, -v[2], v[1]], [v[2], 0, -v[0]], [-v[1], v[0], 0]];
  const f = 1 / (1 + c);
  const R = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
    let k2 = 0;
    for (let q = 0; q < 3; q++) k2 += K[i][q] * K[q][j];
    R[i][j] += K[i][j] + f * k2;
  }
  return R;
}
export const matVec = (R, a) => [
  R[0][0] * a[0] + R[0][1] * a[1] + R[0][2] * a[2],
  R[1][0] * a[0] + R[1][1] * a[1] + R[1][2] * a[2],
  R[2][0] * a[0] + R[2][1] * a[1] + R[2][2] * a[2]];

/* ══════════════════════════════════════════════════════════════════════════
 * 1. 有限中心コア(R44)—— 宣言 (G, M_c, r_c, ω_c, W₀, ŝ, α, β) から
 *    導出 (κ₀, W_c, f, ω_m, K⊥, K∥) を作る。**導出は名前で分ける**。
 * ════════════════════════════════════════════════════════════════════════ */
/**
 * @param {object} d 宣言: {G, Mc, rc, omega_c, W0, axis:[3], alpha, beta, label}
 * @returns 宣言 + 導出 {kappa0, Wc, frac, omega_m, Omega:[3], Kperp, Kpar, KperpPhi, KparPhi}
 *   `Kperp/Kpar` は **Φ_eff の剛性**(R44 の閉じた正の H の条件)、
 *   `KperpPhi/KparPhi` は **Φ そのものの剛性**(Gibbs 分布が使う)。
 */
export function makeCore(d) {
  const axis = g3.unit(d.axis || [0, 0, 1]);
  const kappa0 = d.G * d.Mc / (d.rc * d.rc * d.rc);
  const Wc = d.Mc / (d.rc * d.rc);
  const frac = Wc / (Wc + d.W0);
  const omega_m = frac * d.omega_c;
  const w2 = omega_m * omega_m;
  return {
    label: d.label || null,
    G: d.G, Mc: d.Mc, rc: d.rc, omega_c: d.omega_c, W0: d.W0,
    alpha: d.alpha, beta: d.beta, axis,
    kappa0, Wc, frac, omega_m, Omega: g3.mul(axis, omega_m),
    Kperp: kappa0 + (d.alpha - 1) * w2,
    Kpar: kappa0 + d.beta * w2,
    KperpPhi: kappa0 + d.alpha * w2,
    KparPhi: kappa0 + d.beta * w2,
  };
}

/** u(x) = ω_m (ŝ × x)。 */
export function coreFlow(core, x) { return g3.cross(core.Omega, x); }

/** Φ_core(x) = ½κ₀|x|² + ½ω_m²{α|r⊥|² + β(x·ŝ)²}。 */
export function corePotential(core, x) {
  const par = g3.dot(x, core.axis);
  const r2 = g3.dot(x, x);
  const perp2 = Math.max(0, r2 - par * par);
  const w2 = core.omega_m * core.omega_m;
  return 0.5 * core.kappa0 * r2 + 0.5 * w2 * (core.alpha * perp2 + core.beta * par * par);
}

/** ∇Φ_core = κ₀x + ω_m²{α r⊥ + β (x·ŝ)ŝ}。 */
export function coreGradPotential(core, x) {
  const par = g3.dot(x, core.axis);
  const w2 = core.omega_m * core.omega_m;
  const out = [0, 0, 0];
  for (let k = 0; k < 3; k++) {
    const perp = x[k] - par * core.axis[k];
    out[k] = core.kappa0 * x[k] + w2 * (core.alpha * perp + core.beta * par * core.axis[k]);
  }
  return out;
}

/* ══════════════════════════════════════════════════════════════════════════
 * 2. パターン腕(振幅の規則は**測る前に固定**)
 * ════════════════════════════════════════════════════════════════════════ */
/** 既定の腕パラメータ(すべて宣言)。 */
export const ARM_DEFAULT = {
  m: 2,            // 腕の本数(**宣言** —— 決断事項候補)
  beta_s: 6,       // ピッチの仮説パラメータ(tan i = m/|β_s| —— **腕が自然に出た証拠にしない**)
  r0: 5, rd: 5, rmin: 0.5, rw: 1.0,
  lambdaA: 0.3,    // 振幅の規則の係数(宣言)
  chiA: 0,         // A の J_c 依存の係数(宣言。0 なら A は J_c に依らない)
  Jref: 1,         // χ_A の規格化(宣言)
  Jc0: 0,          // h(J_c) = 1 + χ_A (J_c − J_c0)/J_ref の基準
  A0: null,        // 規則から作る(armAmplitude0 が入れる)
};

/**
 * **振幅の規則(先に固定した)**: A₀ = λ_A · f_c · ω_mc² · r_d²。
 * f_c = W_cc/(W_cc+W₀) は**子コアのスピンと背景の重みだけ**から決まる無次元量で、
 * ω_mc² r_d² は Φ と同じ単位を与える。**観測から決めた数は 1 つも入っていない。**
 */
export function armAmplitude0(childCore, p) {
  return p.lambdaA * childCore.frac * childCore.omega_m * childCore.omega_m * p.rd * p.rd;
}

/** 窓 W(r)=r²/(r²+r_w²)(中心で滑らかに 0)と、その微分。 */
export function armWindow(r, p) {
  const rw2 = p.rw * p.rw, d = r * r + rw2;
  return { W: r * r / d, dW: 2 * r * rw2 / (d * d) };
}

/** 形 g(r) = W(r)·(r/r_d)·e^{−s/r_d}、s=√(r²+r_min²)。A(r)/r ∝ r² で中心で有界。 */
export function armShape(r, p) {
  const s = Math.sqrt(r * r + p.rmin * p.rmin);
  const e = Math.exp(-s / p.rd);
  const { W, dW } = armWindow(r, p);
  const g = W * (r / p.rd) * e;
  const dg = e * (dW * r / p.rd + W / p.rd - W * r * r / (p.rd * p.rd * s));
  return { s, g, dg };
}

/** h(J_c) = 1 + χ_A (J_c − J_c0)/J_ref とその微分(A の J_c 依存 —— **宣言**)。 */
export function armJcFactor(Jc, p) {
  return { h: 1 + p.chiA * (Jc - p.Jc0) / p.Jref, dh: p.chiA / p.Jref };
}

/**
 * Φ_arm と、その **x/y/z 勾配・∂/∂φ_c・∂/∂J_c** を 1 度に返す。
 * χ = m(θ − φ_c) − β_s ln(s/r₀)、 Φ_arm = −A cos χ、A = A₀·g(r)·h(J_c)。
 * **∂χ/∂r 項も A′(r) 項も落とさない**(器が中心差分で検算する)。
 */
export function armFieldAt(x, y, phi_c, Jc, p) {
  const r = Math.hypot(x, y);
  const { s, g, dg } = armShape(r, p);
  const { h, dh } = armJcFactor(Jc, p);
  const A0 = p.A0;
  const A = A0 * g * h, dAdr = A0 * dg * h, dAdJc = A0 * g * dh;
  const th = Math.atan2(y, x);
  const chi = p.m * (th - phi_c) - p.beta_s * Math.log(s / p.r0);
  const cc = Math.cos(chi), ss = Math.sin(chi);
  const dchidr = -p.beta_s * r / (s * s);
  const Phi = -A * cc;
  const dPhidr = -dAdr * cc + A * ss * dchidr;
  const dPhidth = A * ss * p.m;                 // ∂Φ/∂θ
  // 直交勾配。(1/r)∂Φ/∂θ = A m sinχ / r は A∝r³ なので r→0 で 0 へ落ちる。
  const cs = r > 0 ? x / r : 1, sn = r > 0 ? y / r : 0;
  const tang = r > 0 ? dPhidth / r : 0;
  return {
    r, chi, A, Phi,
    gx: dPhidr * cs - tang * sn,
    gy: dPhidr * sn + tang * cs,
    gz: 0,
    dPhidphic: -A * p.m * ss,                   // = −∂Φ/∂θ(同時回転の不変性の素)
    dPhidJc: -dAdJc * cc,
  };
}

/** 与えたピッチ角(**宣言** —— 測った値ではない): tan i = m/|β_s|。 */
export function imposedPitchDeg(p) { return Math.atan(p.m / Math.abs(p.beta_s)) * 180 / Math.PI; }

/* ══════════════════════════════════════════════════════════════════════════
 * 3. 宣言した剪断場(**R44 の局所模型の外** —— 材料腕との比較のためだけに置く対照)
 *    Φ_flat = v_c² ln√(r²+r_h²) + ½κ_z z²(平坦回転曲線 = 強い差動回転)
 * ════════════════════════════════════════════════════════════════════════ */
export function flatPotential(f, x) {
  const r2 = x[0] * x[0] + x[1] * x[1];
  return f.vc * f.vc * 0.5 * Math.log(r2 + f.rh * f.rh) + 0.5 * f.kz * x[2] * x[2];
}
export function flatGradPotential(f, x) {
  const r2 = x[0] * x[0] + x[1] * x[1], d = r2 + f.rh * f.rh;
  return [f.vc * f.vc * x[0] / d, f.vc * f.vc * x[1] / d, f.kz * x[2]];
}

/* ══════════════════════════════════════════════════════════════════════════
 * 4. 粒子系 + 位相の共役対(状態 y = [x0,y0,z0,px0,py0,pz0, …, phi_c, Jc])
 * ════════════════════════════════════════════════════════════════════════ */
export const PHI_OFF = (N) => 6 * N;
export const JC_OFF = (N) => 6 * N + 1;
export const STATE_LEN = (N) => 6 * N + 2;

/**
 * 系の宣言。
 * @param {object} s {N, mass:Float64Array|number, cores:[], arm:{…}|null, Ic, flat:{…}|null}
 */
export function makeSystem(s) {
  const N = s.N;
  const mass = (typeof s.mass === 'number')
    ? Float64Array.from({ length: N }, () => s.mass) : s.mass;
  const cores = s.cores || [];
  let Om = [0, 0, 0];
  for (const c of cores) Om = g3.add(Om, c.Omega);
  return { N, mass, cores, Omega: Om, arm: s.arm || null,
    Ic: s.Ic === undefined ? 1 : s.Ic, flat: s.flat || null, label: s.label || null };
}

/** dy/dt。ẋ=p/m+u、 ṗ=Ω×p−m∇Φ、 φ̇_c=J_c/I_c+Σm∂Φ_arm/∂J_c、 J̇_c=−Σm∂Φ_arm/∂φ_c。 */
export function systemDerivs(sys, y) {
  const N = sys.N, Om = sys.Omega, out = new Float64Array(STATE_LEN(N));
  const phi_c = y[PHI_OFF(N)], Jc = y[JC_OFF(N)];
  let dphi = (sys.Ic > 0) ? Jc / sys.Ic : 0, dJc = 0;
  const xv = [0, 0, 0];
  for (let i = 0; i < N; i++) {
    const o = 6 * i, m = sys.mass[i];
    xv[0] = y[o]; xv[1] = y[o + 1]; xv[2] = y[o + 2];
    const px = y[o + 3], py = y[o + 4], pz = y[o + 5];
    // u と ∇Φ
    let ux = Om[1] * xv[2] - Om[2] * xv[1];
    let uy = Om[2] * xv[0] - Om[0] * xv[2];
    let uz = Om[0] * xv[1] - Om[1] * xv[0];
    let gx = 0, gy = 0, gz = 0;
    for (const c of sys.cores) {
      const g = coreGradPotential(c, xv);
      gx += g[0]; gy += g[1]; gz += g[2];
    }
    if (sys.flat) {
      const g = flatGradPotential(sys.flat, xv);
      gx += g[0]; gy += g[1]; gz += g[2];
    }
    if (sys.arm) {
      const a = armFieldAt(xv[0], xv[1], phi_c, Jc, sys.arm);
      gx += a.gx; gy += a.gy; gz += a.gz;
      dphi += m * a.dPhidJc;
      dJc -= m * a.dPhidphic;
    }
    out[o] = px / m + ux; out[o + 1] = py / m + uy; out[o + 2] = pz / m + uz;
    // (∇u)ᵀp = p × Ω  ⇒ ṗ = −(p×Ω) − m∇Φ = Ω×p − m∇Φ
    out[o + 3] = Om[1] * pz - Om[2] * py - m * gx;
    out[o + 4] = Om[2] * px - Om[0] * pz - m * gy;
    out[o + 5] = Om[0] * py - Om[1] * px - m * gz;
  }
  out[PHI_OFF(N)] = dphi;
  out[JC_OFF(N)] = dJc;
  return out;
}

/** H と各口座。`Lsym` は**コア軸方向**の正準角運動量成分(単一コアの保存量)。 */
export function systemInvariants(sys, y) {
  const N = sys.N, Om = sys.Omega;
  const phi_c = y[PHI_OFF(N)], Jc = y[JC_OFF(N)];
  let H = 0, Lz = 0, Lx = 0, Ly = 0, Ekin = 0, Upot = 0, Uarm = 0;
  let Pz = 0, Px = 0, Py = 0, Lphys = 0, Mtot = 0, r2max = 0;
  for (let i = 0; i < N; i++) {
    const o = 6 * i, m = sys.mass[i];
    const x = [y[o], y[o + 1], y[o + 2]], p = [y[o + 3], y[o + 4], y[o + 5]];
    const p2 = g3.dot(p, p);
    Ekin += p2 / (2 * m);
    const L = g3.cross(x, p);
    Lx += L[0]; Ly += L[1]; Lz += L[2];
    H += g3.dot(Om, L);
    let Phi = 0;
    for (const c of sys.cores) Phi += corePotential(c, x);
    if (sys.flat) Phi += flatPotential(sys.flat, x);
    Upot += m * Phi;
    if (sys.arm) { const a = armFieldAt(x[0], x[1], phi_c, Jc, sys.arm); Uarm += m * a.Phi; }
    Px += p[0]; Py += p[1]; Pz += p[2];
    // 物理角運動量 ℓ_z = m(x v_y − y v_x)、v = p/m + Ω×x
    const u = g3.cross(Om, x);
    Lphys += m * (x[0] * (p[1] / m + u[1]) - x[1] * (p[0] / m + u[0]));
    Mtot += m;
    const rr = x[0] * x[0] + x[1] * x[1] + x[2] * x[2];
    if (rr > r2max) r2max = rr;
  }
  H += Ekin + Upot + Uarm + ((sys.Ic > 0) ? Jc * Jc / (2 * sys.Ic) : 0);
  const axis = sys.cores.length ? sys.cores[0].axis : [0, 0, 1];
  const Lsym = Lx * axis[0] + Ly * axis[1] + Lz * axis[2];
  return { H, Ekin, Upot, Uarm, Espin: (sys.Ic > 0) ? Jc * Jc / (2 * sys.Ic) : 0,
    Lx, Ly, Lz, Lsym, Jc, phi_c, LzPlusJc: Lz + Jc, LphysZ: Lphys,
    Px, Py, Pz, Mtot, rmax: Math.sqrt(r2max) };
}

/** RK4(固定刻み・Float64Array)。 */
export function rk4(sys, y, h) {
  const n = y.length;
  const k1 = systemDerivs(sys, y);
  const y2 = new Float64Array(n); for (let i = 0; i < n; i++) y2[i] = y[i] + 0.5 * h * k1[i];
  const k2 = systemDerivs(sys, y2);
  const y3 = new Float64Array(n); for (let i = 0; i < n; i++) y3[i] = y[i] + 0.5 * h * k2[i];
  const k3 = systemDerivs(sys, y3);
  const y4 = new Float64Array(n); for (let i = 0; i < n; i++) y4[i] = y[i] + h * k3[i];
  const k4 = systemDerivs(sys, y4);
  const out = new Float64Array(n);
  for (let i = 0; i < n; i++) out[i] = y[i] + (h / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]);
  return out;
}

/**
 * **実効ポテンシャルの剛性行列**(R44 の「閉じた正の H」を**軸が 2 本あるとき**にも測る道具)。
 *   Φ_eff(x) = Σ_k Φ_k(x) − ½|Ω_tot × x|²
 * 単一コアなら固有値は {K⊥, K⊥, K∥}(= κ₀+(α−1)ω_m²・κ₀+βω_m²)になる。
 * **軸が 2 本あると Ω_tot が傾いて交差項が出る**ので、この行列の固有値が負になるかどうかを
 * 実測する(負なら H は下に有界でない = その宣言では閉じない)。
 */
export function effectiveStiffness(sys, opts) {
  const Om = (opts && opts.bare) ? [0, 0, 0] : sys.Omega;
  const Phi = (x) => {
    let s = 0;
    for (const c of sys.cores) s += corePotential(c, x);
    if (sys.flat) s += flatPotential(sys.flat, x);
    const w = g3.cross(Om, x);
    return s - 0.5 * g3.dot(w, w);
  };
  const h = 1e-3, M = [];
  for (let i = 0; i < 3; i++) M.push(new Float64Array(3));
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
    const e = (a, b) => { const x = [0, 0, 0]; x[i] += a * h; x[j] += b * h; return Phi(x); };
    M[i][j] = (e(1, 1) - e(1, -1) - e(-1, 1) + e(-1, -1)) / (4 * h * h);
  }
  for (let i = 0; i < 3; i++) for (let j = 0; j < i; j++) {
    const v = 0.5 * (M[i][j] + M[j][i]); M[i][j] = v; M[j][i] = v;
  }
  const ev = eigSym(M.map((r) => Array.from(r)));
  return { matrix: M.map((r) => Array.from(r)), eigs: ev, minEig: ev[0], closed: ev[0] > 0 };
}

/* ══════════════════════════════════════════════════════════════════════════
 * 5. 初期化 —— **E だけでなく全 L を持つ分布から**(R44)
 *    F ∝ exp{−(H − Ω_p L_ŝ)/T}。コア枠(軸=ẑ)では
 *      H − Ω_p L_z = (1/2m)|p + mδ(ẑ×x)|² + ½m(K⊥Φ−δ²)r⊥² + ½m K∥Φ z²   (δ = ω_m − Ω_p)
 *    なので**厳密にガウス**である(K⊥Φ > δ² が必要 —— 満たさない宣言は投げる)。
 * ════════════════════════════════════════════════════════════════════════ */
/**
 * @returns {{y:Float64Array, sigPerp:number, sigPar:number, delta:number, T:number}}
 *   `Omega_p` は**宣言**。平均速度は ⟨v⟩ = Ω_p (ŝ×x) になる(器が確かめる)。
 */
export function gibbsSample({ core, N, mass, T, Omega_p, seed }) {
  const delta = core.omega_m - Omega_p;
  const kPerp = core.KperpPhi - delta * delta;
  if (!(kPerp > 0)) {
    throw new Error(`gibbsSample: K⊥Φ−δ² ≤ 0(${kPerp})—— この Ω_p では分布が閉じない`);
  }
  const m = mass;
  const sigPerp = Math.sqrt(T / (m * kPerp));
  const sigPar = Math.sqrt(T / (m * core.KparPhi));
  const sigP = Math.sqrt(m * T);
  const gs = gaussFactory(seed);
  const R = rotZTo(core.axis);
  const y = new Float64Array(STATE_LEN(N));
  for (let i = 0; i < N; i++) {
    const xc = [gs() * sigPerp, gs() * sigPerp, gs() * sigPar];
    const pc = [gs() * sigP, gs() * sigP, gs() * sigP];
    // p = p' − mδ(ẑ×x)(コア枠)
    pc[0] -= m * delta * (-xc[1]);
    pc[1] -= m * delta * (xc[0]);
    const xl = matVec(R, xc), pl = matVec(R, pc);
    const o = 6 * i;
    y[o] = xl[0]; y[o + 1] = xl[1]; y[o + 2] = xl[2];
    y[o + 3] = pl[0]; y[o + 4] = pl[1]; y[o + 5] = pl[2];
  }
  return { y, sigPerp, sigPar, delta, T, kPerp, Omega_p };
}

/**
 * **逆行率の事前予測(閉形式)** —— R44 の「サンプルによって変動するがシチュエーションで
 * 決まるので事前予測が可能」に当たる量。走らせる前に書ける。
 *
 *   極座標で ℓ_z = r(p′_⊥ + mΩ_p r)。x,y ~ N(0,σ⊥²) なので r/σ⊥ は Rayleigh、
 *   p′_⊥ ~ N(0,mT)、σ⊥²=T/(m(K⊥Φ−δ²)) より mΩ_p r/√(mT) = c·(r/σ⊥)、
 *     **c = Ω_p / √(K⊥Φ − δ²)**   (δ = ω_m − Ω_p)
 *   逆行率 = ∫₀^∞ ρe^{−ρ²/2} Φ(−cρ) dρ = **½(1 − c/√(1+c²))**
 *   **σ⊥ にも T にも依らない**(= 冷やしても逆行率は下がらない。効くのは Ω_p だけ)。
 */
export function retrogradeForecast(core, Omega_p) {
  const delta = core.omega_m - Omega_p;
  const k = core.KperpPhi - delta * delta;
  if (!(k > 0)) return { c: null, fracPredicted: null, kPerp: k, delta, Omega_p };
  const c = Omega_p / Math.sqrt(k);
  return { c, fracPredicted: 0.5 * (1 - c / Math.sqrt(1 + c * c)), kPerp: k, delta, Omega_p };
}

/**
 * **面内の円軌道の角速度**(この模型では **r に依らない** = 一様回転)。
 *   a = 2Ω×v − ∇Φ_eff で v=Ω_c(ẑ×x) を入れると Ω_c² − 2ω_m Ω_c − K⊥ = 0、
 *   よって **Ω_c = ω_m + √(ω_m² + K⊥)**(K⊥ = κ₀+(α−1)ω_m²)。
 *   **r に依らないので剪断 r|dΩ/dr| = 0** —— 材料腕は巻き込まない(実測で確かめる)。
 */
export function circularRate(core) {
  return core.omega_m + Math.sqrt(core.omega_m * core.omega_m + core.Kperp);
}

/** 共回転(Ω_p = ω_m)での逆行率 —— **この値より下げるには Ω_p を変えるしかない**。 */
export function retrogradeAtCorotation(core) { return retrogradeForecast(core, core.omega_m); }

/**
 * 共回転のまま κ₀→0 にしたときの逆行率の**下限**: c → 1/√α なので
 *   frac_min = ½(1 − 1/√(1+α))。α=1.1 で **0.154728…**(= α だけで決まる壁)。
 */
export function retrogradeCorotationFloor(alpha) {
  const c = 1 / Math.sqrt(alpha);
  return { c, frac: 0.5 * (1 - c / Math.sqrt(1 + c * c)) };
}

/** 逆行率を f 以下にするために要る c(= Ω_p/√(K⊥Φ−δ²))。c = (1−2f)/√(1−(1−2f)²)。 */
export function retrogradeRequiredC(f) {
  const q = 1 - 2 * f;
  return (q > 0 && q < 1) ? q / Math.sqrt(1 - q * q) : null;
}

/* ══════════════════════════════════════════════════════════════════════════
 * 6. 測る道具(合否は宣言しない —— 数を返すだけ)
 * ════════════════════════════════════════════════════════════════════════ */
/** m 次フーリエ: ⟨e^{−imθ}⟩ の振幅(= コントラスト |Σ_m|/Σ_0)と位相。 */
export function fourierContrast(y, N, mOrder, rLo, rHi) {
  let cr = 0, ci = 0, w = 0;
  for (let i = 0; i < N; i++) {
    const o = 6 * i, x = y[o], yy = y[o + 1];
    const r = Math.hypot(x, yy);
    if (!(r >= rLo && r <= rHi)) continue;
    const th = Math.atan2(yy, x);
    cr += Math.cos(mOrder * th); ci += Math.sin(mOrder * th); w += 1;
  }
  if (!w) return { amp: null, phase: null, n: 0 };
  cr /= w; ci /= w;
  return { amp: Math.hypot(cr, ci), phase: Math.atan2(ci, cr), n: w };
}

/**
 * 半径ビンごとの m 次位相から**測ったピッチ角**を出す。
 * 密度極大の方位は θ_max(r) = phase(r)/m。θ_max を ln r に対して最小二乗で当て、
 * 傾き σ = β̂_s/m から **pitch = atan(1/|σ|) = atan(m/|β̂_s|)**。
 * 位相は 2π/m の周期で巻くので、ビンを内側から追って**連続化**する。
 */
export function measuredPitch(y, N, mOrder, bins) {
  const rows = [];
  for (const b of bins) {
    const f = fourierContrast(y, N, mOrder, b.lo, b.hi);
    if (f.n < 8 || !(f.amp > 0)) continue;
    rows.push({ r: 0.5 * (b.lo + b.hi), lnr: Math.log(0.5 * (b.lo + b.hi)),
      theta: f.phase / mOrder, amp: f.amp, n: f.n });
  }
  if (rows.length < 3) return { pitchDeg: null, slope: null, rows, r2: null };
  const per = 2 * Math.PI / mOrder;
  for (let i = 1; i < rows.length; i++) {
    let d = rows[i].theta - rows[i - 1].theta;
    while (d > per / 2) { rows[i].theta -= per; d -= per; }
    while (d < -per / 2) { rows[i].theta += per; d += per; }
  }
  let sx = 0, sy = 0, n = rows.length;
  for (const r of rows) { sx += r.lnr; sy += r.theta; }
  sx /= n; sy /= n;
  let sxy = 0, sxx = 0, syy = 0;
  for (const r of rows) { sxy += (r.lnr - sx) * (r.theta - sy); sxx += (r.lnr - sx) ** 2; syy += (r.theta - sy) ** 2; }
  if (!(sxx > 0)) return { pitchDeg: null, slope: null, rows, r2: null };
  const slope = sxy / sxx;
  return { pitchDeg: Math.atan(1 / Math.abs(slope)) * 180 / Math.PI, slope,
    betaHat: slope * mOrder, rows, r2: syy > 0 ? (sxy * sxy) / (sxx * syy) : null };
}

/* ── パターン枠での応答(**1 枚では雑音に埋もれる** —— 実測で判明した) ──────────
 *   1 枚のスナップショットの半径ビンは粒子数 n が少なく、\|⟨e^{−imθ}⟩\| の散射雑音が
 *   √(1/(2n)) 程度になる(N=400・8 ビンで 0.107 —— 信号 0.075 より大きい)。
 *   そこで**パターンの位相 φ_c を引いてから**時間窓で積み上げる: 積算量は
 *     C_b = Σ_枚 Σ_{i∈b} e^{−i m (θ_i − φ_c)}
 *   で、\|C_b\|/n_b が**パターン枠でのコントラスト**、arg C_b / m が**パターンからの位相差**。
 *   これは「腕が出た」の証拠ではない —— **与えた位相結合に密度が追随した度合い**である。
 */
/** 空の積算器(bins は [{lo,hi}] の宣言)。 */
export function makeAccum(bins) {
  return { bins: bins.map((b) => ({ lo: b.lo, hi: b.hi, re: 0, im: 0, n: 0 })), frames: 0 };
}
/** 1 枚を積む(φ_c を引いた枠で)。 */
export function accumFrame(acc, y, N, mOrder, phi_c) {
  acc.frames++;
  for (let i = 0; i < N; i++) {
    const o = 6 * i, x = y[o], yy = y[o + 1];
    const r = Math.hypot(x, yy);
    for (const b of acc.bins) {
      if (r >= b.lo && r <= b.hi) {
        const a = mOrder * (Math.atan2(yy, x) - phi_c);
        b.re += Math.cos(a); b.im -= Math.sin(a); b.n++;
        break;
      }
    }
  }
  return acc;
}
/**
 * 積算器から**パターン枠のコントラストと測ったピッチ角**を出す。
 * θ_max−φ_c を ln r に当てた傾き σ から pitch = atan(1/|σ|)(= atan(m/|β̂_s|))。
 * `noise` は同じ粒子数の一様方位が出す \|C\|/n の期待値 √(π)/(2√n)(比べる相手)。
 */
export function accumPitch(acc, mOrder) {
  const rows = [];
  for (const b of acc.bins) {
    if (b.n < 8) continue;
    const amp = Math.hypot(b.re, b.im) / b.n;
    rows.push({ r: 0.5 * (b.lo + b.hi), lnr: Math.log(0.5 * (b.lo + b.hi)),
      theta: Math.atan2(b.im, b.re) / mOrder, amp, n: b.n,
      noise: 0.5 * Math.sqrt(Math.PI / b.n) });
  }
  if (rows.length < 3) return { pitchDeg: null, slope: null, rows, r2: null, ampMean: null };
  const per = 2 * Math.PI / mOrder;
  for (let i = 1; i < rows.length; i++) {
    let d = rows[i].theta - rows[i - 1].theta;
    while (d > per / 2) { rows[i].theta -= per; d -= per; }
    while (d < -per / 2) { rows[i].theta += per; d += per; }
  }
  let sx = 0, sy = 0; const n = rows.length;
  for (const r of rows) { sx += r.lnr; sy += r.theta; }
  sx /= n; sy /= n;
  let sxy = 0, sxx = 0, syy = 0;
  for (const r of rows) {
    sxy += (r.lnr - sx) * (r.theta - sy); sxx += (r.lnr - sx) ** 2; syy += (r.theta - sy) ** 2;
  }
  const slope = sxx > 0 ? sxy / sxx : null;
  let amp = 0, nn = 0;
  for (const r of rows) { amp += r.amp * r.n; nn += r.n; }
  return { pitchDeg: slope ? Math.atan(1 / Math.abs(slope)) * 180 / Math.PI : null,
    slope, betaHat: slope === null ? null : slope * mOrder,
    r2: (sxx > 0 && syy > 0) ? (sxy * sxy) / (sxx * syy) : null,
    ampMean: nn > 0 ? amp / nn : null,
    noiseMean: nn > 0 ? 0.5 * Math.sqrt(Math.PI / (nn / rows.length)) : null, rows };
}

/** 逆行率(**物理**速度 v=p/m+u で作った ℓ_z を使う)。 */
export function retrogradeFraction(sys, y) {
  const N = sys.N, Om = sys.Omega;
  let sum = 0, abs = 0;
  const L = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    const o = 6 * i, m = sys.mass[i];
    const x = [y[o], y[o + 1], y[o + 2]];
    const u = g3.cross(Om, x);
    const vx = y[o + 3] / m + u[0], vy = y[o + 4] / m + u[1];
    const l = m * (x[0] * vy - x[1] * vx);
    L[i] = l; sum += l; abs += Math.abs(l);
  }
  const sign = sum >= 0 ? 1 : -1;
  let bad = 0;
  for (let i = 0; i < N; i++) if (L[i] * sign < 0) bad++;
  return { n: N, frac: bad / N, net: abs > 0 ? sum / abs : 0, sign, meanL: sum / N };
}

/** 面内 RMS 半径・z の RMS・σ_z/σ_R・軸方向半長(95%)と横断 RMS 幅。 */
export function shapeStats(y, N, axis) {
  const a = g3.unit(axis || [0, 0, 1]);
  let sR = 0, sZ = 0, sPar = 0, sPerp = 0;
  const par = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    const o = 6 * i, x = [y[o], y[o + 1], y[o + 2]];
    sR += x[0] * x[0] + x[1] * x[1];
    sZ += x[2] * x[2];
    const q = g3.dot(x, a);
    par[i] = Math.abs(q);
    sPar += q * q;
    sPerp += Math.max(0, g3.dot(x, x) - q * q);
  }
  const srt = Array.from(par).sort((p, q) => p - q);
  const sigR = Math.sqrt(sR / (2 * N));      // 1 軸あたり
  const sigZ = Math.sqrt(sZ / N);
  return { rmsPlanar: Math.sqrt(sR / N), sigR, sigZ, dispRatio: sigR > 0 ? sigZ / sigR : null,
    axialHalf: srt[Math.min(N - 1, Math.floor(0.95 * N))],
    transWidth: Math.sqrt(sPerp / (2 * N)), axialSig: Math.sqrt(sPar / N) };
}

/**
 * 半径ビンの回転曲線と**剪断** r|dΩ/dr|(材料腕が巻き込む速さを決める量)。
 * ビンの Ω は **Σℓ_z / Σ(m r²)**(質量重みの平均角速度)で作る —— v_t/r をそのまま
 * 平均すると内側のビンで小さい r に割られて発散気味の雑音が乗る(実測で判明した)。
 */
export function rotationShear(sys, y, nbins) {
  const N = sys.N, Om = sys.Omega;
  const items = [];
  for (let i = 0; i < N; i++) {
    const o = 6 * i, m = sys.mass[i];
    const x = [y[o], y[o + 1], y[o + 2]];
    const u = g3.cross(Om, x);
    const r = Math.hypot(x[0], x[1]);
    if (!(r > 1e-9)) continue;
    const vx = y[o + 3] / m + u[0], vy = y[o + 4] / m + u[1];
    items.push({ r, m, lz: m * (x[0] * vy - x[1] * vx), vt: (x[0] * vy - x[1] * vx) / r });
  }
  items.sort((p, q) => p.r - q.r);
  const nb = Math.max(2, nbins || 6), n = items.length, rows = [];
  for (let b = 0; b < nb; b++) {
    const lo = Math.floor(b * n / nb), hi = Math.floor((b + 1) * n / nb);
    let mr = 0, mv = 0, k = 0, sl = 0, sr2 = 0;
    for (let j = lo; j < hi; j++) {
      mr += items[j].r; mv += items[j].vt; k++;
      sl += items[j].lz; sr2 += items[j].m * items[j].r * items[j].r;
    }
    if (!k) continue;
    mr /= k; mv /= k;
    rows.push({ bin: b, n: k, r: mr, vt: mv, omega: sr2 > 0 ? sl / sr2 : null });
  }
  let shear = 0;
  for (let b = 1; b < rows.length; b++) {
    const dl = Math.log(rows[b].r) - Math.log(rows[b - 1].r);
    if (Math.abs(dl) < 1e-12) continue;
    const dOm = (rows[b].omega - rows[b - 1].omega) / dl;   // r dΩ/dr
    shear = Math.max(shear, Math.abs(dOm));
  }
  return { rows, shearMax: shear,
    omegaSpread: rows.length > 1
      ? Math.max(...rows.map((r) => Math.abs(r.omega))) / Math.min(...rows.map((r) => Math.abs(r.omega))) - 1
      : null };
}

/** 材料腕(粒子そのものが並んだ線)のピッチ角: θ を ln r に当てる。 */
export function materialArmPitch(y, idx) {
  const rows = [];
  for (const i of idx) {
    const o = 6 * i, x = y[o], yy = y[o + 1];
    const r = Math.hypot(x, yy);
    if (!(r > 1e-9)) continue;
    rows.push({ lnr: Math.log(r), th: Math.atan2(yy, x) });
  }
  if (rows.length < 3) return { pitchDeg: null, slope: null };
  rows.sort((p, q) => p.lnr - q.lnr);
  for (let i = 1; i < rows.length; i++) {
    let d = rows[i].th - rows[i - 1].th;
    while (d > Math.PI) { rows[i].th -= 2 * Math.PI; d -= 2 * Math.PI; }
    while (d < -Math.PI) { rows[i].th += 2 * Math.PI; d += 2 * Math.PI; }
  }
  let sx = 0, sy = 0; const n = rows.length;
  for (const r of rows) { sx += r.lnr; sy += r.th; }
  sx /= n; sy /= n;
  let sxy = 0, sxx = 0;
  for (const r of rows) { sxy += (r.lnr - sx) * (r.th - sy); sxx += (r.lnr - sx) ** 2; }
  if (!(sxx > 0)) return { pitchDeg: null, slope: null };
  const slope = sxy / sxx;
  return { pitchDeg: Math.atan(1 / Math.abs(slope)) * 180 / Math.PI, slope };
}

/* ══════════════════════════════════════════════════════════════════════════
 * 7. 棒 —— **宣言した結合グラフ**(第66報 (4) の字義の形 + 拡張 2 つ)
 *    U = Σ_ℓ ½k_ℓ(|R_a−R_b|−ℓ₀)² − J_s Σ_ℓ (s_a·s_b)²
 *        [+ K_θ Σ(1−t_a·t_{a+1})]  [− (J_t/2) Σ_ℓ ((s_a·t_ℓ)²+(s_b·t_ℓ)²)]
 *    **自発形成は 1 行も実装していない**(グラフは外から与える)。
 * ════════════════════════════════════════════════════════════════════════ */
export const BARGRAPH_DEFAULT = { kl: 1, l0: 1, Js: 0.5, Ktheta: 0, Jt: 0 };

/** まっすぐな n 節点の鎖と、隣接だけの結合グラフ。 */
export function chainGraph(n, l0) {
  const nodes = [], edges = [], spins = [];
  for (let a = 0; a < n; a++) {
    nodes.push([(a - (n - 1) / 2) * l0, 0, 0]);
    spins.push([1, 0, 0]);                       // 面内軸(鎖に沿う)—— **宣言**
    if (a < n - 1) edges.push([a, a + 1]);
  }
  return { nodes, edges, spins };
}

/** U_bar(位置とスピンから)。 */
export function barGraphPotential(nodes, spins, edges, p) {
  let U = 0;
  const t = [];
  for (let e = 0; e < edges.length; e++) {
    const [a, b] = edges[e];
    const d = g3.sub(nodes[b], nodes[a]);
    const L = g3.norm(d);
    t.push(L > 0 ? g3.mul(d, 1 / L) : [0, 0, 0]);
    U += 0.5 * p.kl * (L - p.l0) * (L - p.l0);
    const sd = g3.dot(spins[a], spins[b]);
    U -= p.Js * sd * sd;
    if (p.Jt) {
      const ca = g3.dot(spins[a], t[e]), cb = g3.dot(spins[b], t[e]);
      U -= 0.5 * p.Jt * (ca * ca + cb * cb);
    }
  }
  if (p.Ktheta) {
    for (let e = 0; e + 1 < edges.length; e++) U += p.Ktheta * (1 - g3.dot(t[e], t[e + 1]));
  }
  return U;
}

/** ∇U(位置に関する解析勾配・3n の平坦配列)とスピンのトルク。 */
export function barGraphForces(nodes, spins, edges, p) {
  const n = nodes.length;
  const g = new Float64Array(3 * n);
  const tq = nodes.map(() => [0, 0, 0]);
  const t = [], Ls = [];
  for (let e = 0; e < edges.length; e++) {
    const [a, b] = edges[e];
    const d = g3.sub(nodes[b], nodes[a]);
    const L = g3.norm(d);
    Ls.push(L); t.push(L > 0 ? g3.mul(d, 1 / L) : [0, 0, 0]);
  }
  const projDiv = (tt, w, L) => { // (I − t tᵀ)w / L
    const dd = g3.dot(tt, w);
    return [(w[0] - dd * tt[0]) / L, (w[1] - dd * tt[1]) / L, (w[2] - dd * tt[2]) / L];
  };
  for (let e = 0; e < edges.length; e++) {
    const [a, b] = edges[e], L = Ls[e], tt = t[e];
    // 伸び
    const f = p.kl * (L - p.l0);
    for (let k = 0; k < 3; k++) { g[3 * b + k] += f * tt[k]; g[3 * a + k] -= f * tt[k]; }
    // ネマティックなスピン結合(位置に力を出さない・反作用は等大逆向き)
    const sd = g3.dot(spins[a], spins[b]);
    const cr = g3.cross(spins[a], spins[b]);
    for (let k = 0; k < 3; k++) { tq[a][k] += 2 * p.Js * sd * cr[k]; tq[b][k] -= 2 * p.Js * sd * cr[k]; }
    // 結合方向とコア軸の結合(**宣言の拡張** —— 曲げ剛性を与える)
    if (p.Jt) {
      for (const [q, other] of [[a, b], [b, a]]) {
        void other;
        const c = g3.dot(spins[q], tt);
        const dUdd = g3.mul(projDiv(tt, spins[q], L), -p.Jt * c);   // ∂U/∂d_e
        for (let k = 0; k < 3; k++) { g[3 * b + k] += dUdd[k]; g[3 * a + k] -= dUdd[k]; }
        const crq = g3.cross(spins[q], tt);
        for (let k = 0; k < 3; k++) tq[q][k] += p.Jt * c * crq[k];
      }
    }
  }
  // 曲げ(第274便e の項)
  if (p.Ktheta) {
    for (let e = 0; e + 1 < edges.length; e++) {
      const [a1, b1] = edges[e], [a2, b2] = edges[e + 1];
      const ga = projDiv(t[e], t[e + 1], Ls[e]);
      const gb = projDiv(t[e + 1], t[e], Ls[e + 1]);
      for (let k = 0; k < 3; k++) {
        g[3 * b1 + k] -= p.Ktheta * ga[k]; g[3 * a1 + k] += p.Ktheta * ga[k];
        g[3 * b2 + k] -= p.Ktheta * gb[k]; g[3 * a2 + k] += p.Ktheta * gb[k];
      }
    }
  }
  return { grad: g, torque: tq };
}

/** 解析勾配 vs 中心差分(位置について)。 */
export function barGraphGradCheck(nodes, spins, edges, p, h) {
  const hh = h || 1e-6;
  const g = barGraphForces(nodes, spins, edges, p).grad;
  let worst = 0;
  const c = nodes.map((q) => q.slice());
  for (let a = 0; a < c.length; a++) for (let k = 0; k < 3; k++) {
    const save = c[a][k];
    c[a][k] = save + hh; const up = barGraphPotential(c, spins, edges, p);
    c[a][k] = save - hh; const dn = barGraphPotential(c, spins, edges, p);
    c[a][k] = save;
    worst = Math.max(worst, Math.abs((up - dn) / (2 * hh) - g[3 * a + k]));
  }
  return worst;
}

/** 位置ブロックの Hessian(3n×3n・スピンは固定)。 */
export function barGraphHessian(nodes, spins, edges, p, h) {
  const hh = h || 1e-5, n = nodes.length, N = 3 * n;
  const c = nodes.map((q) => q.slice());
  const H = [];
  for (let i = 0; i < N; i++) H.push(new Float64Array(N));
  for (let j = 0; j < N; j++) {
    const a = (j / 3) | 0, k = j % 3, save = c[a][k];
    c[a][k] = save + hh; const gp = barGraphForces(c, spins, edges, p).grad;
    c[a][k] = save - hh; const gm = barGraphForces(c, spins, edges, p).grad;
    c[a][k] = save;
    for (let i = 0; i < N; i++) H[i][j] = (gp[i] - gm[i]) / (2 * hh);
  }
  for (let i = 0; i < N; i++) for (let j = 0; j < i; j++) {
    const v = 0.5 * (H[i][j] + H[j][i]); H[i][j] = v; H[j][i] = v;
  }
  return H;
}

/** 位置**と**スピンを一緒に剛体回転させたときの ΔU(回転不変なら機械ゼロ)。 */
export function barRigidRotation(nodes, spins, edges, p, angle, axis) {
  const k = g3.unit(axis || [0, 0, 1]);
  const ca = Math.cos(angle), sa = Math.sin(angle);
  const rot = (q) => {
    const kd = g3.dot(k, q), kx = g3.cross(k, q);
    return [q[0] * ca + kx[0] * sa + k[0] * kd * (1 - ca),
      q[1] * ca + kx[1] * sa + k[1] * kd * (1 - ca),
      q[2] * ca + kx[2] * sa + k[2] * kd * (1 - ca)];
  };
  const U0 = barGraphPotential(nodes, spins, edges, p);
  const bothU = barGraphPotential(nodes.map(rot), spins.map(rot), edges, p);
  const posU = barGraphPotential(nodes.map(rot), spins, edges, p);
  return { U0, dUboth: bothU - U0, dUposOnly: posU - U0 };
}

/** 棒の走行状態 z = [R(3n), P(3n), S(3n)](スピンは角運動量ベクトル)。 */
export function barPack(nodes, moms, spinL, withHeat) {
  const n = nodes.length, z = new Float64Array(9 * n + (withHeat ? 1 : 0));
  for (let a = 0; a < n; a++) for (let k = 0; k < 3; k++) {
    z[3 * a + k] = nodes[a][k];
    z[3 * n + 3 * a + k] = moms[a][k];
    z[6 * n + 3 * a + k] = spinL[a][k];
  }
  return z;
}
export function barUnpack(z, n) {
  const nodes = [], moms = [], spinL = [], spins = [];
  for (let a = 0; a < n; a++) {
    nodes.push([z[3 * a], z[3 * a + 1], z[3 * a + 2]]);
    moms.push([z[3 * n + 3 * a], z[3 * n + 3 * a + 1], z[3 * n + 3 * a + 2]]);
    const S = [z[6 * n + 3 * a], z[6 * n + 3 * a + 1], z[6 * n + 3 * a + 2]];
    spinL.push(S); spins.push(g3.unit(S));
  }
  return { nodes, moms, spinL, spins };
}

/**
 * **剛体運動からのずれだけを落とす宣言した散逸**(R44 の「収束には散逸/熱交換の宣言が要る」)。
 * 節点の運動量を剛体分 p_rigid,a = M_a(V_cm + ω×r_a) と残差 δ_a に分け、**δ にだけ** −γδ を当てる。
 * Σδ = 0・Σ r_a×δ_a = 0 が**構成から**成り立つので、**ΣP と全 J は 1 も減らない**。
 * 取り出した分は Q̇ = γ Σ|δ_a|²/M_a ≥ 0(**非負が構造的**)。
 * 3×3 の慣性テンソルは余因子で逆にする(直線鎖では特異になるので擬似逆で落とす)。
 */
/** 3×3 対称行列の固有値と**固有ベクトル**(循環 Jacobi。擬似逆に使う)。 */
export function eig3sym(Min) {
  const A = Min.map((row) => Float64Array.from(row));
  const V = [[1, 0, 0], [0, 1, 0], [0, 0, 1]].map((r) => Float64Array.from(r));
  for (let sweep = 0; sweep < 50; sweep++) {
    let off = 0;
    for (let i = 0; i < 3; i++) for (let j = i + 1; j < 3; j++) off += A[i][j] * A[i][j];
    if (off < 1e-300) break;
    for (let p = 0; p < 2; p++) for (let q = p + 1; q < 3; q++) {
      const apq = A[p][q];
      if (Math.abs(apq) < 1e-300) continue;
      const theta = (A[q][q] - A[p][p]) / (2 * apq);
      const t = Math.sign(theta || 1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
      const c = 1 / Math.sqrt(t * t + 1), s2 = t * c;
      for (let k = 0; k < 3; k++) {
        const akp = A[k][p], akq = A[k][q];
        A[k][p] = c * akp - s2 * akq; A[k][q] = s2 * akp + c * akq;
      }
      for (let k = 0; k < 3; k++) {
        const apk = A[p][k], aqk = A[q][k];
        A[p][k] = c * apk - s2 * aqk; A[q][k] = s2 * apk + c * aqk;
      }
      for (let k = 0; k < 3; k++) {
        const vkp = V[k][p], vkq = V[k][q];
        V[k][p] = c * vkp - s2 * vkq; V[k][q] = s2 * vkp + c * vkq;
      }
    }
  }
  return { values: [A[0][0], A[1][1], A[2][2]],
    vectors: [[V[0][0], V[1][0], V[2][0]], [V[0][1], V[1][1], V[2][1]], [V[0][2], V[1][2], V[2][2]]] };
}

export function rigidResidual(B, nodes, moms) {
  const n = B.n;
  let Mt = 0, Pc = [0, 0, 0], Rc = [0, 0, 0];
  for (let a = 0; a < n; a++) { Mt += B.M[a]; Pc = g3.add(Pc, moms[a]); Rc = g3.add(Rc, g3.mul(nodes[a], B.M[a])); }
  Rc = g3.mul(Rc, 1 / Mt);
  const Vcm = g3.mul(Pc, 1 / Mt);
  const r = [], p = [];
  let L = [0, 0, 0];
  const I = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  for (let a = 0; a < n; a++) {
    const ra = g3.sub(nodes[a], Rc), pa = g3.sub(moms[a], g3.mul(Vcm, B.M[a]));
    r.push(ra); p.push(pa);
    L = g3.add(L, g3.cross(ra, pa));
    const r2 = g3.dot(ra, ra);
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) I[i][j] += B.M[a] * ((i === j ? r2 : 0) - ra[i] * ra[j]);
  }
  // ω = I⁺L を**固有分解の擬似逆**で解く。Σ r_a×δ_a = L − Iω が 0 になるのは
  //   (a) I が正則で ω=I⁻¹L のとき、または
  //   (b) 落とした固有方向に **L の成分が無い**とき
  // の 2 つで、**真っ直ぐになった棒では I が軸方向に特異になる**(節点が軸上に並ぶので
  // I の軸方向固有値が 0 へ落ちる)。Tikhonov で誤魔化すと全 J が漂う
  // (**実測で判明した** —— 1e−9 の eps で 7.8e−9・1e−14 の eps でも棒が真っ直ぐになった
  // 走行の終盤で 2.6e−5 漂った)。軸上に並んだ節点の r_a×p_a は軸成分を持たないので
  // **L の軸成分は厳密に 0** であり、擬似逆は (b) により厳密である。
  const es = eig3sym(I);
  const lmax = Math.max(...es.values.map(Math.abs), 1e-300);
  const om = [0, 0, 0];
  for (let k = 0; k < 3; k++) {
    if (Math.abs(es.values[k]) <= 1e-10 * lmax) continue;   // 特異方向は落とす(L の成分が無い)
    const v = es.vectors[k];
    const c = (v[0] * L[0] + v[1] * L[1] + v[2] * L[2]) / es.values[k];
    om[0] += c * v[0]; om[1] += c * v[1]; om[2] += c * v[2];
  }
  const delta = [];
  for (let a = 0; a < n; a++) delta.push(g3.sub(p[a], g3.mul(g3.add(g3.cross(om, r[a]), [0, 0, 0]), B.M[a])));
  return { Rc, Vcm, omega: om, delta, L, Mt };
}

/** dz/dt。Ṙ=P/M、 Ṗ=−∇U(−γδ)、 Ṡ=τ(|S| は τ⊥ŝ なので保存)。最後の 1 成分は熱。 */
export function barDerivs(B, z) {
  const n = B.n;
  const { nodes, moms, spins } = barUnpack(z, n);
  const { grad, torque } = barGraphForces(nodes, spins, B.edges, B.p);
  const d = new Float64Array(z.length);
  let dq = null;
  if (B.gamma) {
    const rr = rigidResidual(B, nodes, moms);
    dq = 0;
    for (let a = 0; a < n; a++) {
      for (let k = 0; k < 3; k++) d[3 * n + 3 * a + k] -= B.gamma * rr.delta[a][k];
      dq += B.gamma * g3.dot(rr.delta[a], rr.delta[a]) / B.M[a];
    }
  }
  for (let a = 0; a < n; a++) for (let k = 0; k < 3; k++) {
    d[3 * a + k] = moms[a][k] / B.M[a];
    d[3 * n + 3 * a + k] += -grad[3 * a + k];
    d[6 * n + 3 * a + k] = torque[a][k];
  }
  if (z.length > 9 * n) d[9 * n] = dq || 0;
  return d;
}

export function barInvariants(B, z) {
  const n = B.n;
  const { nodes, moms, spinL, spins } = barUnpack(z, n);
  let E = 0, P = [0, 0, 0], J = [0, 0, 0];
  for (let a = 0; a < n; a++) {
    E += g3.dot(moms[a], moms[a]) / (2 * B.M[a]);
    P = g3.add(P, moms[a]);
    J = g3.add(J, g3.add(g3.cross(nodes[a], moms[a]), spinL[a]));
  }
  const U = barGraphPotential(nodes, spins, B.edges, B.p);
  const heat = (z.length > 9 * n) ? z[9 * n] : 0;
  // 節点の並び方向で長さ・幅を測る(主軸ではなく**宣言した鎖の順**)
  let Lsum = 0;
  for (const [a, b] of B.edges) Lsum += g3.norm(g3.sub(nodes[b], nodes[a]));
  const ends = g3.sub(nodes[n - 1], nodes[0]);
  const endL = g3.norm(ends);
  const ax = endL > 0 ? g3.mul(ends, 1 / endL) : [1, 0, 0];
  let cx = [0, 0, 0];
  for (const q of nodes) cx = g3.add(cx, q);
  cx = g3.mul(cx, 1 / n);
  let w2 = 0;
  for (const q of nodes) {
    const rel = g3.sub(q, cx), pa = g3.dot(rel, ax);
    w2 += Math.max(0, g3.dot(rel, rel) - pa * pa);
  }
  return { E: E + U + heat, Emech: E + U, Ekin: E, U, heat, P, J, bondSum: Lsum, endLength: endL,
    bendWidth: Math.sqrt(w2 / n), spinMags: spinL.map((s) => g3.norm(s)) };
}

export function barRk4(B, z, h) {
  const nlen = z.length;
  const k1 = barDerivs(B, z);
  const z2 = new Float64Array(nlen); for (let i = 0; i < nlen; i++) z2[i] = z[i] + 0.5 * h * k1[i];
  const k2 = barDerivs(B, z2);
  const z3 = new Float64Array(nlen); for (let i = 0; i < nlen; i++) z3[i] = z[i] + 0.5 * h * k2[i];
  const k3 = barDerivs(B, z3);
  const z4 = new Float64Array(nlen); for (let i = 0; i < nlen; i++) z4[i] = z[i] + h * k3[i];
  const k4 = barDerivs(B, z4);
  const out = new Float64Array(nlen);
  for (let i = 0; i < nlen; i++) out[i] = z[i] + (h / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]);
  return out;
}

export { eigSym, zeroModeCount, hessianResidual, rigidModes };

export default {
  GALAXYPROTO_VERSION, GALAXY_HYPOTHESIS, g3, rng32, gaussFactory, rotZTo, matVec,
  makeCore, coreFlow, corePotential, coreGradPotential,
  ARM_DEFAULT, armAmplitude0, armWindow, armShape, armJcFactor, armFieldAt, imposedPitchDeg,
  flatPotential, flatGradPotential,
  makeSystem, systemDerivs, systemInvariants, rk4, STATE_LEN, PHI_OFF, JC_OFF, effectiveStiffness,
  gibbsSample, circularRate, eig3sym, rigidResidual, retrogradeForecast, retrogradeAtCorotation, retrogradeCorotationFloor, retrogradeRequiredC,
  fourierContrast, measuredPitch, makeAccum, accumFrame, accumPitch, retrogradeFraction, shapeStats, rotationShear, materialArmPitch,
  BARGRAPH_DEFAULT, chainGraph, barGraphPotential, barGraphForces, barGraphGradCheck,
  barGraphHessian, barRigidRotation, barPack, barUnpack, barDerivs, barInvariants, barRk4,
  eigSym, zeroModeCount, hessianResidual, rigidModes,
};
