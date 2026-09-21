// 第276便d(原仮定者の裁定(第66報)(4)「shapeToyClusterCore・shapeToyDiskCore・shapeToyArmCore は、
// 各粒子を中心天体のスピンに影響を受けた DFM に準拠する法則で制御する様に調整する」):
// **Core 力学の純関数**(node 側の**独立実装**)。
//
// ■ 何を持つか
//   ・`coreFieldDerived` …… 宣言(r_c・M_c・α・β・W₀・Ω_p・T)と G・ω_c から導出値を作る:
//       W_c=M_c/r_c²、 **ω_m=W_c/(W_c+W₀)·ω_c**、 κ₀=G·M_c/r_c³、
//       K⊥=κ₀+(α−1)ω_m²、 K∥=κ₀+βω_m²、 **K_eff=K⊥+2ω_mΩ_p−Ω_p²**、
//       円軌道角速度 λ±=ω_m±√(ω_m²+K⊥)。門は K⊥>0・K∥>0・K_eff>0。
//   ・`coreFieldAccel` …… **v̇ = 2ω_m(s×v) − K⊥r⊥ − K∥r∥**(則そのもの。html を読まない)。
//   ・`coreFieldEnergy` …… **h = ½|v|² + ½K⊥r⊥² + ½K∥r∥²**(保存量)。
//   ・`coreFieldCanonicalL` …… **p_φ = m[(r×v)·s − ω_m r⊥²]**(共回転熱浴の定常を決める**正準**角運動量。
//       u が磁場のような項なので、保存するのは m(r×v)·s ではない —— 第276便d の実測で判明した)。
//   ・`coreFieldClosed` …… 閉形式の 1 步伝播子(html と**同じ式を独立に書いたもの**)。
//   ・`coreFieldExpm` …… 6×6 の **行列指数**(scaling-and-squaring + Taylor 24 項)。
//       閉形式の検算に使う —— **同じコードを 2 度書かないための独立経路**である。
//
// ■ この lib がしないこと
//   ・判定しない(合否は器 `tests/exp-w276d-corefield.mjs` の `CRIT` が持つ)。
//   ・観測量を 1 つも持たない(**較正ではない**)。
//   ・「この法則が正しい」とは言わない —— **宣言した構成仮説**の値を作るだけである。

/** 軸を単位ベクトルへ。 */
export function unitAxis(a) {
  const n = Math.hypot(a[0], a[1], a[2]);
  if (!(n > 0)) return null;
  return [a[0] / n, a[1] / n, a[2] / n];
}

/** 軸 s に直交する正規直交基底(html と同じ決め方 —— 乱数も向きの選択も入れない)。 */
export function coreFieldBasis(s) {
  const ax = Math.abs(s[0]), ay = Math.abs(s[1]), az = Math.abs(s[2]);
  const t = (ax <= ay && ax <= az) ? [1, 0, 0] : ((ay <= az) ? [0, 1, 0] : [0, 0, 1]);
  const d = t[0] * s[0] + t[1] * s[1] + t[2] * s[2];
  let e1 = [t[0] - d * s[0], t[1] - d * s[1], t[2] - d * s[2]];
  const n1 = Math.hypot(e1[0], e1[1], e1[2]);
  e1 = [e1[0] / n1, e1[1] / n1, e1[2] / n1];
  const e2 = [s[1] * e1[2] - s[2] * e1[1], s[2] * e1[0] - s[0] * e1[2], s[0] * e1[1] - s[1] * e1[0]];
  return { e1, e2, s };
}

/** 宣言 → 導出値。**門**(K⊥>0・K∥>0・K_eff>0)も返す。 */
export function coreFieldDerived(decl, G, omegaC) {
  const rc = decl.coreRc, Mc = decl.coreMass, W0 = decl.W0, op = decl.omegaP || 0;
  const Wc = (rc > 0) ? Mc / (rc * rc) : 0;
  const den = Wc + W0;
  const omegaM = (den > 0) ? (Wc / den) * omegaC : 0;
  const kappa0 = (rc > 0) ? G * Mc / (rc * rc * rc) : 0;
  const w2 = omegaM * omegaM;
  const kPerp = kappa0 + (decl.alpha - 1) * w2;
  const kPar = kappa0 + decl.beta * w2;
  const kEff = kPerp + 2 * omegaM * op - op * op;
  let gate = null;
  if (!Number.isFinite(kPerp) || !Number.isFinite(kPar)) gate = 'nonfinite';
  else if (!(kPerp > 0)) gate = 'kPerp';
  else if (!(kPar > 0)) gate = 'kPar';
  else if (!(kEff > 0)) gate = 'omegaP';
  const root = Math.sqrt(Math.max(0, w2 + kPerp));
  return { Wc, omegaM, kappa0, kPerp, kPar, kEff, gate,
    lamPlus: omegaM + root, lamMinus: omegaM - root,
    // 質量 1 あたりの定常の分散(粒子の質量 m で割って使う)
    varPerp: (gate === null) ? decl.temp / kEff : null,
    varPar: (gate === null) ? decl.temp / kPar : null,
    varVel: decl.temp };
}

/** 則そのもの: v̇ = 2ω_m(s×v) − K⊥r⊥ − K∥r∥(r は中心からの相対位置)。 */
export function coreFieldAccel(r, v, P, s) {
  const rp = r[0] * s[0] + r[1] * s[1] + r[2] * s[2];
  const cx = s[1] * v[2] - s[2] * v[1], cy = s[2] * v[0] - s[0] * v[2], cz = s[0] * v[1] - s[1] * v[0];
  const out = [0, 0, 0];
  for (let i = 0; i < 3; i++) {
    const par = rp * s[i], perp = r[i] - par;
    out[i] = 2 * P.omegaM * [cx, cy, cz][i] - P.kPerp * perp - P.kPar * par;
  }
  return out;
}

/** 保存量 h = ½|v|² + ½K⊥r⊥² + ½K∥r∥²(質量 1 あたり)。 */
export function coreFieldEnergy(r, v, P, s) {
  const rp = r[0] * s[0] + r[1] * s[1] + r[2] * s[2];
  const r2 = r[0] * r[0] + r[1] * r[1] + r[2] * r[2];
  const perp2 = Math.max(0, r2 - rp * rp);
  return 0.5 * (v[0] * v[0] + v[1] * v[1] + v[2] * v[2]) + 0.5 * (P.kPerp * perp2 + P.kPar * rp * rp);
}

/** **正準**角運動量 p_φ/m = (r×v)·s − ω_m r⊥²(共回転熱浴の定常を決める量)。 */
export function coreFieldCanonicalL(r, v, P, s) {
  const lx = r[1] * v[2] - r[2] * v[1], ly = r[2] * v[0] - r[0] * v[2], lz = r[0] * v[1] - r[1] * v[0];
  const rp = r[0] * s[0] + r[1] * s[1] + r[2] * s[2];
  const r2 = r[0] * r[0] + r[1] * r[1] + r[2] * r[2];
  return (lx * s[0] + ly * s[1] + lz * s[2]) - P.omegaM * Math.max(0, r2 - rp * rp);
}

/**
 * 閉形式の 1 步伝播子(∥ は調和・⊥ は λ±=ω_m±√(ω_m²+K⊥) の 2 モード)。
 * 返すのは (ξ1,ξ2,ζ,η1,η2,ηζ) 基底での 6×6 行列(行優先)。
 */
export function coreFieldClosed(P, h) {
  const wp = Math.sqrt(Math.max(P.kPar, 0));
  const cP = Math.cos(wp * h), sP = (wp > 0) ? Math.sin(wp * h) / wp : h;
  const Om = Math.sqrt(P.omegaM * P.omegaM + P.kPerp);
  const lp = P.omegaM + Om, lm = P.omegaM - Om, d2 = 2 * Om;
  const cp = Math.cos(lp * h), sp = Math.sin(lp * h), cm = Math.cos(lm * h), sm = Math.sin(lm * h);
  const aR = (lp * cm - lm * cp) / d2, aI = (lp * sm - lm * sp) / d2;
  const bR = (sp - sm) / d2, bI = (cm - cp) / d2;
  const cR = -P.kPerp * bR, cI = -P.kPerp * bI;
  const dR = (lp * cp - lm * cm) / d2, dI = (lp * sp - lm * sm) / d2;
  // 複素 (ξ1+iξ2) への a,b / (η1+iη2) への c,d を実 2×2 ブロックへ展開する
  const M = new Array(36).fill(0);
  const set = (i, j, v) => { M[i * 6 + j] = v; };
  set(0, 0, aR); set(0, 1, -aI); set(0, 3, bR); set(0, 4, -bI);
  set(1, 0, aI); set(1, 1, aR); set(1, 3, bI); set(1, 4, bR);
  set(3, 0, cR); set(3, 1, -cI); set(3, 3, dR); set(3, 4, -dI);
  set(4, 0, cI); set(4, 1, cR); set(4, 3, dI); set(4, 4, dR);
  set(2, 2, cP); set(2, 5, sP);
  set(5, 2, -P.kPar * sP); set(5, 5, cP);
  return M;
}

/** 生成子 A(6×6・行優先)。ẋ=v・v̇=2ω_m(s×v)−K⊥r⊥−K∥r∥ を基底で書いたもの。 */
export function coreFieldGenerator(P) {
  const A = new Array(36).fill(0);
  const set = (i, j, v) => { A[i * 6 + j] = v; };
  set(0, 3, 1); set(1, 4, 1); set(2, 5, 1);
  set(3, 0, -P.kPerp); set(3, 4, -2 * P.omegaM);
  set(4, 1, -P.kPerp); set(4, 3, 2 * P.omegaM);
  set(5, 2, -P.kPar);
  return A;
}

function matMul(a, b, n) {
  const c = new Array(n * n).fill(0);
  for (let i = 0; i < n; i++) {
    for (let k = 0; k < n; k++) {
      const v = a[i * n + k];
      if (v === 0) continue;
      for (let j = 0; j < n; j++) c[i * n + j] += v * b[k * n + j];
    }
  }
  return c;
}

/** **独立な行列指数**(scaling-and-squaring + Taylor 24 項)—— 閉形式の検算用。 */
export function coreFieldExpm(P, h, terms) {
  const n = 6, A = coreFieldGenerator(P);
  let nrm = 0;
  for (let i = 0; i < n; i++) {
    let s = 0;
    for (let j = 0; j < n; j++) s += Math.abs(A[i * n + j]);
    if (s > nrm) nrm = s;
  }
  const scaled = Math.abs(h) * nrm;
  const k = Math.max(0, Math.ceil(Math.log2(Math.max(1e-300, scaled))) + 4);
  const hh = h / Math.pow(2, k);
  const B = A.map((v) => v * hh);
  let E = new Array(n * n).fill(0);
  for (let i = 0; i < n; i++) E[i * n + i] = 1;
  let T = E.slice();
  const K = terms || 24;
  for (let m = 1; m <= K; m++) {
    T = matMul(T, B, n).map((v) => v / m);
    for (let i = 0; i < n * n; i++) E[i] += T[i];
  }
  for (let i = 0; i < k; i++) E = matMul(E, E, n);
  return E;
}

/** 6×6 行列を状態へ当てる。 */
export function applyMat(M, y) {
  const out = new Array(6).fill(0);
  for (let i = 0; i < 6; i++) { let s = 0; for (let j = 0; j < 6; j++) s += M[i * 6 + j] * y[j]; out[i] = s; }
  return out;
}

/** 世界座標 (r,v) → 基底座標 (ξ,η) と、その逆。 */
export function toBasis(r, v, B) {
  const d = (a, e) => a[0] * e[0] + a[1] * e[1] + a[2] * e[2];
  return [d(r, B.e1), d(r, B.e2), d(r, B.s), d(v, B.e1), d(v, B.e2), d(v, B.s)];
}
export function fromBasis(y, B) {
  const mk = (a, b, c) => [a * B.e1[0] + b * B.e2[0] + c * B.s[0],
    a * B.e1[1] + b * B.e2[1] + c * B.s[1], a * B.e1[2] + b * B.e2[2] + c * B.s[2]];
  return { r: mk(y[0], y[1], y[2]), v: mk(y[3], y[4], y[5]) };
}

/**
 * 共回転する熱浴の 1 步(**厳密 OU**)。`rng` は [0,1) の一様乱数、`gauss` は標準正規を返す関数。
 * 返り値は新しい速度と、**熱浴が粒子へ渡した正味のエネルギー**(質量 1 あたり)。
 * `supply=false` ならノイズを止める(**有限容量が尽きた状態**)。
 */
export function bathStep(r, v, P, s, omegaP, rate, h, m, gauss, supply) {
  if (!(rate > 0)) return { v: v.slice(), dE: 0 };
  const eg = Math.exp(-rate * h);
  const sV = supply ? Math.sqrt(P.varVel / m) * Math.sqrt(Math.max(0, 1 - eg * eg)) : 0;
  const ub = [omegaP * (s[1] * r[2] - s[2] * r[1]), omegaP * (s[2] * r[0] - s[0] * r[2]),
    omegaP * (s[0] * r[1] - s[1] * r[0])];
  const k0 = 0.5 * m * (v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  const nv = [0, 0, 0];
  for (let i = 0; i < 3; i++) nv[i] = ub[i] + eg * (v[i] - ub[i]) + sV * gauss();
  const k1 = 0.5 * m * (nv[0] * nv[0] + nv[1] * nv[1] + nv[2] * nv[2]);
  return { v: nv, dE: k1 - k0 };
}

/**
 * **緩和時間**(窓の長さを決めるための導出値)。
 *
 * 第276便d の実測で判明したこと: 熱浴の時定数 1/γ を窓に使うと**短すぎる**。
 * 熱浴は**速度**だけを減衰させるので、あるモードのエネルギーが落ちる実効レートは
 * **2γ×(そのモードの運動エネルギー分率 f)** である。⊥ の 2 モード(λ±)では
 * f = λ²/(λ²+K⊥) で、**遅い方のモード(|λ₋| が小さい)は f が小さく、緩和が桁で遅くなる**。
 * ∥ は調和振動なので f=1/2(実効レート γ)。窓はこれらの逆数の最大値で取る。
 */
export function coreFieldRelaxTimes(P, rate) {
  const modes = [];
  for (const [name, lam] of [['perp+', P.lamPlus], ['perp-', P.lamMinus]]) {
    const l2 = lam * lam, f = (l2 + P.kPerp > 0) ? l2 / (l2 + P.kPerp) : 0;
    modes.push({ name, lambda: lam, kinFraction: f,
      period: 2 * Math.PI / Math.max(1e-12, Math.abs(lam)),
      tau: (rate > 0 && f > 0) ? 1 / (2 * rate * f) : Infinity });
  }
  const wp = Math.sqrt(Math.max(P.kPar, 0));
  modes.push({ name: 'par', lambda: wp, kinFraction: 0.5,
    period: 2 * Math.PI / Math.max(1e-12, wp), tau: (rate > 0) ? 1 / rate : Infinity });
  const finite = modes.map((m) => (Number.isFinite(m.tau) ? m.tau : 0));
  const tau = Math.max(...finite);
  const period = Math.max(...modes.map((m) => (Number.isFinite(m.period) ? m.period : 0)));
  return { modes, tau: tau > 0 ? tau : period, period };
}

/** 決定的な標準正規(Box–Muller・mulberry32)。器が seed を配る。 */
export function gaussFactory(seed) {
  let a = seed >>> 0;
  const rnd = () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  let spare = null;
  return () => {
    if (spare !== null) { const g = spare; spare = null; return g; }
    let u = 0, v = 0, s2 = 0;
    do { u = 2 * rnd() - 1; v = 2 * rnd() - 1; s2 = u * u + v * v; } while (!(s2 > 0 && s2 < 1));
    const f = Math.sqrt(-2 * Math.log(s2) / s2);
    spare = v * f; return u * f;
  };
}

export default { unitAxis, coreFieldBasis, coreFieldDerived, coreFieldAccel, coreFieldEnergy,
  coreFieldCanonicalL, coreFieldClosed, coreFieldGenerator, coreFieldExpm, applyMat,
  toBasis, fromBasis, bathStep, coreFieldRelaxTimes, gaussFactory };
