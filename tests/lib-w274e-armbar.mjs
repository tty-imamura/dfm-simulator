// 第274便e(第64報「渦巻銀河/棒渦巻の順番」): **パターン腕と棒の設計の純関数**。
//
// ■ 立場(**主張しないこと**)
//   この lib は **形を指定するもの**である。「腕が創発した」「棒が自己組織化した」とは
//   **書かない**(初版は U_arm・U_bar を外から与え、その下での線形安定性だけを測る)。
//   エンジンには接続していない(beta/index.html はこの lib を 1 度も読まない)。
//
// ■ 何を持っているか
//   (a) 長寿命**パターン**腕 U_arm = A(r)·{1 − cos(m·χ)} + ½κ_z·z²、
//       χ = φ − Ω_p·t − b·ln(r/r₀)。**−∇U は A′(r) 項も χ の r 微分も落とさない**。
//       r<r_min はコア長 s=√(r²+r_min²) で滑らかにする(**対数と指数の中だけ** s に置き換え、
//       振幅の先頭の r は丸めない —— A(r)/r が有界になり中心で横方向の力が発散しない)。
//       小振幅の横幅 σ_⊥² ≈ Θ·r²/(m²·A) と、その**数値検算**(Boltzmann 重みの分散)。
//   (b) **材料**腕の差動回転による巻き込み時間(パターン腕と**別物**であることを数で示す)。
//   (c) 棒: 節点列の U_bar の Hessian と固有値。まっすぐな鎖は 3D で**剛体 5 モードがゼロ**
//       (並進 3+回転 2 —— 軸まわりの回転は節点を 1 つも動かさないので自由度ではない)。
//       残り 3N−5 は正(伸び N−1 + 曲げ 2(N−2))。**棒の回転は節点の並進+自転+
//       メッシュ角運動量で共有**する(pinned 固定の棒を最終成果にしない)。

/** この lib の版(形を変えたら上げる。QA `behavior.armBarPure` がこの文字列を見る)。 */
export const ARMBAR_VERSION = 'w274e-1';

/* ══════════════════════════════════════════════════════════════════════════
 * (a) パターン腕
 * ════════════════════════════════════════════════════════════════════════ */

/** 既定の腕パラメータ(すべて宣言 —— 観測から決めた値は 1 つも無い)。 */
export const ARM_DEFAULT = {
  A0: 1, rd: 8, m: 2, b: 3, r0: 8, rmin: 1, Omega_p: 0.1, kappa_z: 1,
};

/** コア長で丸めた半径 s = √(r² + r_min²)(r=0 でも微分が有界)。 */
export function coreRadius(r, p) { return Math.sqrt(r * r + p.rmin * p.rmin); }

/**
 * 振幅 A(r) = A₀·(r/r_d)·e^{−s/r_d}、s=√(r²+r_min²)。
 * **先頭の r は丸めない**(s ではない)—— こうすると A(r)/r が r→0 で有界になり、
 * 横方向の力 (1/r)∂U/∂φ = A(r)·m·sin(mχ)/r が中心で発散しない。
 * 指数の中だけ s で丸めるので、A は r=0 のまわりで滑らか(A(0)=0・A′(0)=A₀/r_d)。
 */
export function armAmplitude(r, p) {
  const s = coreRadius(r, p);
  return p.A0 * (r / p.rd) * Math.exp(-s / p.rd);
}

/** dA/dr = (A₀/r_d)·e^{−s/r_d}·(1 − r²/(r_d·s))。 */
export function armAmplitudeDr(r, p) {
  const s = coreRadius(r, p);
  return (p.A0 / p.rd) * Math.exp(-s / p.rd) * (1 - r * r / (p.rd * s));
}

/** A(r)/r(r→0 で有界 —— 横方向の力に使う)。 */
export function armAmplitudeOverR(r, p) {
  const s = coreRadius(r, p);
  return (p.A0 / p.rd) * Math.exp(-s / p.rd);
}

/** 位相 χ = φ − Ω_p·t − b·ln(s/r₀)。 */
export function armPhase(r, phi, t, p) {
  const s = coreRadius(r, p);
  return phi - p.Omega_p * t - p.b * Math.log(s / p.r0);
}

/** U_arm(r,φ,z,t) = A(r)·{1 − cos(mχ)} + ½κ_z z²。 */
export function armPotential({ r, phi, z, t }, p) {
  const chi = armPhase(r, phi, t || 0, p);
  return armAmplitude(r, p) * (1 - Math.cos(p.m * chi)) + 0.5 * p.kappa_z * (z || 0) * (z || 0);
}

/**
 * −∇U_arm を**円柱成分**で返す。**A′(r) も ∂χ/∂r も落とさない**:
 *   ∂U/∂r = A′(r)·(1−cos mχ) + A(r)·m·sin(mχ)·∂χ/∂r、 ∂χ/∂r = −b·r/s²
 *   (1/r)∂U/∂φ = [A(r)/r]·m·sin(mχ)        (A(r)/r は r→0 で有界)
 *   ∂U/∂z = κ_z·z
 * @returns {{Fr:number, Fphi:number, Fz:number, dUdr:number, dUdphi:number}}
 */
export function armForceCyl({ r, phi, z, t }, p) {
  const s = coreRadius(r, p);
  const chi = armPhase(r, phi, t || 0, p);
  const A = armAmplitude(r, p), Ad = armAmplitudeDr(r, p);
  const c = Math.cos(p.m * chi), sn = Math.sin(p.m * chi);
  const dchidr = -p.b * r / (s * s);
  const dUdr = Ad * (1 - c) + A * p.m * sn * dchidr;
  const dUdphi = A * p.m * sn;
  // (1/r)∂U/∂φ は A(r)/r で書くと r=0 でも有界
  return { Fr: -dUdr, Fphi: -armAmplitudeOverR(r, p) * p.m * sn,
    Fz: -p.kappa_z * (z || 0), dUdr, dUdphi };
}

/** 直交成分の −∇U_arm(F_r・F_φ を回転して返す)。 */
export function armForceXY({ x, y, z, t }, p) {
  const r = Math.hypot(x, y);
  const phi = Math.atan2(y, x);
  const f = armForceCyl({ r, phi, z, t }, p);
  const cs = r > 0 ? x / r : 1, sn = r > 0 ? y / r : 0;
  return { fx: f.Fr * cs - f.Fphi * sn, fy: f.Fr * sn + f.Fphi * cs, fz: f.Fz };
}

/**
 * 小振幅の横幅(解析): 谷底で 1−cos(mχ) ≈ m²χ²/2、横変位 s_⊥ = r·δχ なので
 * U ≈ ½·(A·m²/r²)·s_⊥²。等分配 ½k⟨s_⊥²⟩=½Θ より **σ_⊥² = Θ·r²/(m²·A)**。
 */
export function armWidthSigma({ r, A, m, Theta }) {
  return { sigma2: Theta * r * r / (m * m * A), sigma: Math.sqrt(Theta * r * r / (m * m * A)) };
}

/**
 * 同じ量の**数値検算**: 厳密な U=A(1−cos mδχ) に Boltzmann 重み e^{−U/Θ} をかけ、
 * δχ∈(−π/m, π/m) で ⟨(r·δχ)²⟩ を Simpson 積分する。Θ/A→0 で解析形に一致する。
 */
export function armWidthNumeric({ r, A, m, Theta, n }) {
  const N = (n || 4000) * 2;   // Simpson は偶数分割
  const half = Math.PI / m;
  const h = 2 * half / N;
  let num = 0, den = 0;
  for (let i = 0; i <= N; i++) {
    const d = -half + h * i;
    const w = (i === 0 || i === N) ? 1 : (i % 2 ? 4 : 2);
    const wt = Math.exp(-A * (1 - Math.cos(m * d)) / Theta);
    num += w * wt * (r * d) * (r * d);
    den += w * wt;
  }
  return { sigma2: num / den, sigma: Math.sqrt(num / den) };
}

/**
 * 対数螺旋 χ=0 の**ピッチ角** i = atan(1/|b|)(r にも t にも依らない = パターンは巻き込まない)。
 */
export function patternPitchDeg(p) { return Math.atan(1 / Math.abs(p.b)) * 180 / Math.PI; }

/**
 * **材料**腕(粒子がそのまま並んだ腕)の巻き込み。差動回転 Ω(r) の下で、
 * 初め径方向に真っ直ぐな線は t 後に cot(i) = r·|dΩ/dr|·t のピッチ角になる。
 * 平坦回転曲線 Ω=v_c/r では r|dΩ/dr| = Ω なので t_wind = cot(i)/Ω = cot(i)·P/(2π)。
 */
export function windingTime({ r, Omega, dOmegaDr, pitchDeg }) {
  const shear = Math.abs(r * dOmegaDr);
  const cot = 1 / Math.tan(pitchDeg * Math.PI / 180);
  return { shear, t: shear > 0 ? cot / shear : Infinity,
    orbits: shear > 0 ? (cot / shear) * Math.abs(Omega) / (2 * Math.PI) : Infinity };
}

/* ══════════════════════════════════════════════════════════════════════════
 * (b) 棒 —— 節点列とその線形安定性
 * ════════════════════════════════════════════════════════════════════════ */

/** 既定の棒パラメータ(宣言)。 */
export const BAR_DEFAULT = { Kb: 1, Ktheta: 1, l0: 1, Kc: 0, rho: 0.5 };

/** まっすぐな鎖(重心を原点に置いた N 節点・x 軸上・間隔 ℓ₀)。 */
export function barNodes({ n, l0 }) {
  const c = [];
  for (let a = 0; a < n; a++) c.push([(a - (n - 1) / 2) * l0, 0, 0]);
  return c;
}

/** U_bar = (K_b/2)Σ(L_a−ℓ₀)² + K_θ·Σ(1 − t_a·t_{a+1}) + Σ K_c/√(|c_a|²+ρ²)。 */
export function barPotential(c, p) {
  const n = c.length;
  let U = 0;
  const d = [], L = [], t = [];
  for (let a = 0; a < n - 1; a++) {
    const v = [c[a + 1][0] - c[a][0], c[a + 1][1] - c[a][1], c[a + 1][2] - c[a][2]];
    const l = Math.hypot(v[0], v[1], v[2]);
    d.push(v); L.push(l); t.push([v[0] / l, v[1] / l, v[2] / l]);
    U += 0.5 * p.Kb * (l - p.l0) * (l - p.l0);
  }
  for (let a = 0; a < n - 2; a++) {
    const dot = t[a][0] * t[a + 1][0] + t[a][1] * t[a + 1][1] + t[a][2] * t[a + 1][2];
    U += p.Ktheta * (1 - dot);       // = (K_θ/2)|t_{a+1}−t_a|²
  }
  if (p.Kc) for (let a = 0; a < n; a++)
    U += p.Kc / Math.sqrt(c[a][0] ** 2 + c[a][1] ** 2 + c[a][2] ** 2 + p.rho * p.rho);
  return U;
}

/** ∇U_bar(解析形・3N 成分の平坦配列)。 */
export function barGradient(c, p) {
  const n = c.length;
  const g = new Float64Array(3 * n);
  const d = [], L = [], t = [];
  for (let a = 0; a < n - 1; a++) {
    const v = [c[a + 1][0] - c[a][0], c[a + 1][1] - c[a][1], c[a + 1][2] - c[a][2]];
    const l = Math.hypot(v[0], v[1], v[2]);
    d.push(v); L.push(l); t.push([v[0] / l, v[1] / l, v[2] / l]);
  }
  // 伸び
  for (let a = 0; a < n - 1; a++) {
    const f = p.Kb * (L[a] - p.l0);
    for (let k = 0; k < 3; k++) {
      g[3 * (a + 1) + k] += f * t[a][k];
      g[3 * a + k] -= f * t[a][k];
    }
  }
  // 曲げ: U2 = K_θ Σ(1 − t_a·t_{a+1}) ⇒ ∇U2 = −K_θ Σ ∇(t_a·t_{a+1})
  const proj = (ta, w, l) => {   // (I − t tᵀ)w / l
    const dot = ta[0] * w[0] + ta[1] * w[1] + ta[2] * w[2];
    return [(w[0] - dot * ta[0]) / l, (w[1] - dot * ta[1]) / l, (w[2] - dot * ta[2]) / l];
  };
  for (let a = 0; a < n - 2; a++) {
    const ga = proj(t[a], t[a + 1], L[a]);        // ∂(t_a·t_{a+1})/∂d_a
    const hb = proj(t[a + 1], t[a], L[a + 1]);    // ∂(t_a·t_{a+1})/∂d_{a+1}
    for (let k = 0; k < 3; k++) {
      g[3 * (a + 1) + k] -= p.Ktheta * ga[k];
      g[3 * a + k] += p.Ktheta * ga[k];
      g[3 * (a + 2) + k] -= p.Ktheta * hb[k];
      g[3 * (a + 1) + k] += p.Ktheta * hb[k];
    }
  }
  // コア斥力
  if (p.Kc) for (let a = 0; a < n; a++) {
    const s2 = c[a][0] ** 2 + c[a][1] ** 2 + c[a][2] ** 2 + p.rho * p.rho;
    const f = -p.Kc / (s2 * Math.sqrt(s2));
    for (let k = 0; k < 3; k++) g[3 * a + k] += f * c[a][k];
  }
  return g;
}

/** 解析勾配の検算(中心差分との最大差)。 */
export function barGradientCheck(c, p, h) {
  const hh = h || 1e-6;
  const g = barGradient(c, p);
  let worst = 0;
  for (let a = 0; a < c.length; a++) for (let k = 0; k < 3; k++) {
    const save = c[a][k];
    c[a][k] = save + hh; const up = barPotential(c, p);
    c[a][k] = save - hh; const dn = barPotential(c, p);
    c[a][k] = save;
    worst = Math.max(worst, Math.abs((up - dn) / (2 * hh) - g[3 * a + k]));
  }
  return worst;
}

/** Hessian(解析勾配の中心差分・対称化)。3N×3N。 */
export function barHessian(c, p, h) {
  const hh = h || 1e-5;
  const n = c.length, N = 3 * n;
  const H = [];
  for (let i = 0; i < N; i++) H.push(new Float64Array(N));
  for (let j = 0; j < N; j++) {
    const a = (j / 3) | 0, k = j % 3;
    const save = c[a][k];
    c[a][k] = save + hh; const gp = barGradient(c, p);
    c[a][k] = save - hh; const gm = barGradient(c, p);
    c[a][k] = save;
    for (let i = 0; i < N; i++) H[i][j] = (gp[i] - gm[i]) / (2 * hh);
  }
  for (let i = 0; i < N; i++) for (let j = 0; j < i; j++) {
    const v = 0.5 * (H[i][j] + H[j][i]); H[i][j] = v; H[j][i] = v;
  }
  return H;
}

/** 対称行列の固有値(循環 Jacobi 法)。昇順で返す。 */
export function eigSym(Ain, sweeps) {
  const N = Ain.length;
  const A = Ain.map((row) => Float64Array.from(row));
  const S = sweeps || 100;
  for (let s = 0; s < S; s++) {
    let off = 0;
    for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) off += A[i][j] * A[i][j];
    if (off < 1e-30) break;
    for (let ip = 0; ip < N - 1; ip++) for (let iq = ip + 1; iq < N; iq++) {
      const apq = A[ip][iq];
      if (Math.abs(apq) < 1e-300) continue;
      const theta = (A[iq][iq] - A[ip][ip]) / (2 * apq);
      const tt = Math.sign(theta || 1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
      const cth = 1 / Math.sqrt(tt * tt + 1), sth = tt * cth;
      for (let k = 0; k < N; k++) {
        const akp = A[k][ip], akq = A[k][iq];
        A[k][ip] = cth * akp - sth * akq;
        A[k][iq] = sth * akp + cth * akq;
      }
      for (let k = 0; k < N; k++) {
        const apk = A[ip][k], aqk = A[iq][k];
        A[ip][k] = cth * apk - sth * aqk;
        A[iq][k] = sth * apk + cth * aqk;
      }
    }
  }
  const ev = [];
  for (let i = 0; i < N; i++) ev.push(A[i][i]);
  ev.sort((a, b) => a - b);
  return ev;
}

/**
 * まっすぐな鎖の**剛体モード**(3D)。並進 3 + 回転 2 の**計 5 本**。
 * 軸(x)まわりの回転は節点を 1 つも動かさないので自由度ではない —— だから 6 ではなく 5。
 */
export function rigidModes(c) {
  const n = c.length, N = 3 * n;
  const mk = (f) => { const v = new Float64Array(N);
    for (let a = 0; a < n; a++) { const w = f(c[a]); v[3 * a] = w[0]; v[3 * a + 1] = w[1]; v[3 * a + 2] = w[2]; }
    let nn = 0; for (let i = 0; i < N; i++) nn += v[i] * v[i];
    nn = Math.sqrt(nn); if (nn > 0) for (let i = 0; i < N; i++) v[i] /= nn;
    return v; };
  return {
    tx: mk(() => [1, 0, 0]), ty: mk(() => [0, 1, 0]), tz: mk(() => [0, 0, 1]),
    rz: mk((q) => [-q[1], q[0], 0]),   // ẑ×c
    ry: mk((q) => [q[2], 0, -q[0]]),   // ŷ×c
    axial: mk((q) => [0, -q[2], q[1]]),   // x̂×c —— まっすぐな鎖では恒等的に 0
  };
}

/** |H·v| / |v|(v が零モードなら 0)。 */
export function hessianResidual(H, v) {
  const N = H.length;
  let num = 0, den = 0;
  for (let i = 0; i < N; i++) {
    let s = 0;
    for (let j = 0; j < N; j++) s += H[i][j] * v[j];
    num += s * s; den += v[i] * v[i];
  }
  return den > 0 ? Math.sqrt(num / den) : 0;
}

/** 固有値のうち |λ| < tol·max|λ| を「ゼロモード」と数える。 */
export function zeroModeCount(eigs, tol) {
  const mx = Math.max(...eigs.map(Math.abs));
  const th = (tol || 1e-8) * mx;
  return { zero: eigs.filter((e) => Math.abs(e) < th).length,
    threshold: th, maxAbs: mx,
    minNonZero: Math.min(...eigs.filter((e) => Math.abs(e) >= th).map(Math.abs)) };
}

/** 鎖を剛体回転させたときの U_bar の変化(回転不変なら機械ゼロ)。 */
export function barRigidRotationDeltaU(c, p, angle, axis) {
  const U0 = barPotential(c, p);
  const ax = axis || [0, 0, 1];
  const n = Math.hypot(ax[0], ax[1], ax[2]);
  const k = [ax[0] / n, ax[1] / n, ax[2] / n];
  const ca = Math.cos(angle), sa = Math.sin(angle);
  const rot = c.map((q) => {
    const kd = k[0] * q[0] + k[1] * q[1] + k[2] * q[2];
    const kx = [k[1] * q[2] - k[2] * q[1], k[2] * q[0] - k[0] * q[2], k[0] * q[1] - k[1] * q[0]];
    return [q[0] * ca + kx[0] * sa + k[0] * kd * (1 - ca),
      q[1] * ca + kx[1] * sa + k[1] * kd * (1 - ca),
      q[2] * ca + kx[2] * sa + k[2] * kd * (1 - ca)];
  });
  return { U0, U1: barPotential(rot, p), dU: barPotential(rot, p) - U0 };
}

/**
 * **棒の角運動量の共有**: 節点の軌道 L + 節点の自転 J_spin + メッシュ J_mesh。
 * pinned で固定した棒を「安定した棒」と呼ばないために、3 口座を 1 本の式で出す。
 */
export function barAngularMomentum({ nodes, vels, masses, spins, inertias, Jmesh }) {
  let Lorb = 0, Lspin = 0;
  for (let a = 0; a < nodes.length; a++) {
    const m = masses ? masses[a] : 1;
    Lorb += m * (nodes[a][0] * vels[a][1] - nodes[a][1] * vels[a][0]);
    if (spins) Lspin += (inertias ? inertias[a] : 1) * spins[a];
  }
  const Jm = Number(Jmesh || 0);
  return { Lorb, Lspin, Jmesh: Jm, total: Lorb + Lspin + Jm };
}

export default {
  ARMBAR_VERSION, ARM_DEFAULT, BAR_DEFAULT, coreRadius, armAmplitude, armAmplitudeDr,
  armAmplitudeOverR, armPhase, armPotential, armForceCyl, armForceXY,
  armWidthSigma, armWidthNumeric,
  patternPitchDeg, windingTime, barNodes, barPotential, barGradient, barGradientCheck,
  barHessian, eigSym, rigidModes, hessianResidual, zeroModeCount,
  barRigidRotationDeltaU, barAngularMomentum,
};
