// 第275便e(原仮定者の裁定(第65報)(8)「パワーボール効果(仮説)」)—— **閉じた node 模型**。
//
// ■ 何であって、何でないか
//   ・原仮定者の仮説(第65報 (8))を**測れる形**にするための最小の力学模型である:
//       「コンパクト天体の自転はパワーボールのイメージ(ジャイロ速度で歳差開始・**トルクに逆らう力が
//        回転を加速**・力を抜くと減速)。コンパクト連星は潮汐の引き伸ばしが軸を傾け自転を加速し、
//        歳差をロックしてさらに加速する。究極は互いに軸を向けるが、軸の傾きで潮汐が弱まり
//        NS 連星では途中で安定する。互いに軸を向けた状態が DFM 版 BH 連星で、遠心力を失い合体する。」
//     **これは仮説である。**本ライブラリは仮説を証明も反証もしない —— **どの段が模型の中で成り立ち、
//     どの段が成り立たないか**を数で分けるだけである(Failure First)。
//   ・**エンジンには 1 バイトも接続していない**(`S._core` には 1 命令も足していない。
//     内蔵プリセットは 1 本も増えていないし 1 bit も変わっていない)。
//   ・**法則ではない。** K(配向係数)・Q(散逸係数)・Γ(同期結合)・c(収縮率)は**宣言された
//     自由パラメータ**であって、観測から同定した値ではない。
//   ・「合体を再現した」「潮汐ロックを証明した」「BH 連星を実装した」とは言わない。
//
// ■ 負の対照(統括の検証項目 R37 —— 本ライブラリの一番大事な出力)
//   自転軸に**垂直な**ジャイロトルクは τ·ŝ=0 なので |S| を動かさない = **自転を加速しない**。
//   本模型の保存トルク τ_c も散逸トルク τ_d も、どちらも構造的に τ·ŝ=0 である。
//   したがって「トルクに逆らう力が回転を加速する」を模型の中で成り立たせるには、
//   **加速ぶんの供給源を別に宣言する**しかない(第④段)。実物のパワーボールで回転が上がるのも
//   手が歳差周波数で仕事をしているからであって、ジャイロトルクそのものが供給源ではない。
//
// ■ 力学(3D ベクトル・剛体は球対称 I スカラー)
//   ŝ = S/|S|・r̂ = 相手を向く単位ベクトル・a = ŝ·r̂
//     向きのポテンシャル   U = −½ K a²                       (軸が r̂ に沿うほど低い・π 対称)
//     保存トルク          τ_c = K a (ŝ × r̂)                  → τ_c·ŝ = 0(|S| 不変)
//     散逸トルク          τ_d = −Q a [ŝ × (ŝ × r̂)] = Q a (r̂ − a ŝ)   → τ_d·ŝ = 0(|S| 不変)
//     dU/dt|_散逸 = −(K Q a²(1−a²))/|S| ≤ 0                  → 熱 Q̇ = +(K Q a²(1−a²))/|S|
//   線形化(a≈1・ψ = ŝ と r̂ の角): ψ̇ = −(Q/|S|)ψ → **整列の時定数 τ_align = |S|/Q**(K に依らない)
//   保存だけ(Q=0・r̂ 固定)なら a は**恒等的に一定**で、ŝ は r̂ のまわりを
//     **Ω_prec = K a / |S|** で回る(= 歳差。整列はしない)
//
// ■ 第④段の 4 つの供給源(**自転が加速してよい唯一の口**。どれも宣言である)
//   ① 公転 E/J    τ_orb = Γ(Ω−ω) ŝ         反作用 dL_orb/dt = −Γ(Ω−ω)
//   ② 収縮       I(t)=I₀e^{−ct} で |S| 一定 → ΔE_rot = −½ω²İ  (W_contract)
//   ③ 内部モード  貯蔵 E_int から P_int を渡す(W_int)
//   ④ 外部駆動   宣言した軸トルク τ_drive = D ŝ(**手**に当たる。W_drive を別口座で払う)
//   恒等式: Δ(½|S|²/I) = W_orb + W_contract + W_int + W_drive   (**厳密** —— 本模型の散逸は
//     すべて軸に垂直なので **Q_axial ≡ 0**。垂直散逸の熱は U から出ており E_rot からは 1 も出ない)
//   全体の閉じ(r̂ 固定): E_rot + U + Heat − ΣW = 一定
//
// ■ 第⑤段(閉じた連星)の保存
//   準円ケプラー(`lib-w274b-synctorque.mjs` と同じ形): a=L²/(GMμ²)・Ω=(GM)²μ³/L³・
//   E_orb=−(GM)²μ³/(2L²) で **dE_orb/dL = Ω** が恒等的に成り立つ。
//   r̂ が公転で回る反作用を **dL_orb/dt = −Σ τ_i·ẑ** で閉じるので
//   **J_z = L_orb + Σ S_{i,z} は構造的に保存**する(各 RK 段で相殺 = 丸め以外に漂わない)。
//   全 E = E_orb + Σ|S_i|²/(2I_i) + U_tot + Heat の漂いは**実測して報告する**(構造保存ではない)。
export const POWERBALL_VERSION = 'w275e-1';

/** 原仮定者の仮説(第65報 (8))を**仮説として**持つ。器の結果 JSON の meta にも同じ文字列が載る。 */
export const POWERBALL_HYPOTHESIS = {
  version: POWERBALL_VERSION,
  source: '原仮定者の裁定(第65報)(8)',
  claims: [
    'H1 ジャイロ速度で歳差が始まる',
    'H2 トルクに逆らう力が回転を加速する(力を抜くと減速する)',
    'H3 潮汐の引き伸ばしが軸を傾け、自転を加速する',
    'H4 歳差がロックするとさらに加速する',
    'H5 究極は互いに軸を向ける',
    'H6 軸の傾きで潮汐が弱まり、NS 連星では途中で安定する',
    'H7 互いに軸を向けた状態が DFM 版 BH 連星で、遠心力を失って合体する',
  ],
  status: '**仮説**。本ライブラリは模型の中で H1〜H7 のどれが成り立ち、どれが成り立たないかを数で分けるだけである',
  notClaim: ['合体の再現', '潮汐ロックの証明', '成長系列(星団中心→楕円→渦巻→棒)の法則化',
    'BH 連星の実装', 'Γ・K・Q の実在天体での同定'],
  negativeControl: '軸に垂直なジャイロトルクは τ·ŝ=0 で |S| を動かさない = **自転を加速しない**(統括の検証項目 R37)',
};

/* ── ベクトル ─────────────────────────────────────────────────────────────── */
export const v3 = {
  add: (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]],
  sub: (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]],
  mul: (a, k) => [a[0] * k, a[1] * k, a[2] * k],
  dot: (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2],
  cross: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]],
  norm: (a) => Math.hypot(a[0], a[1], a[2]),
  unit: (a) => { const n = Math.hypot(a[0], a[1], a[2]); return (n > 0) ? [a[0] / n, a[1] / n, a[2] / n] : [0, 0, 0]; },
};

/* ── (1) 2 つのトルクと、その**構造的な直交性** ────────────────────────────── */
/** 保存トルク τ_c = K a (ŝ × r̂)。**τ_c·ŝ = 0**(だから |S| を動かさない)。 */
export function orientTorque(S, rhat, K) {
  const s = v3.unit(S), a = v3.dot(s, rhat);
  return { tau: v3.mul(v3.cross(s, rhat), K * a), a, U: -0.5 * K * a * a, sdot: 0 };
}
/** 散逸トルク τ_d = Q a (r̂ − a ŝ)。**τ_d·ŝ = 0**。整列は進むが |S| は動かない。 */
export function dissipTorque(S, rhat, Q) {
  const s = v3.unit(S), a = v3.dot(s, rhat);
  return { tau: v3.mul(v3.sub(rhat, v3.mul(s, a)), Q * a), a };
}
/** 上の 2 つが本当に軸に直交しているかを**数で**返す(負の対照の生データ)。 */
export function axialProjection(S, rhat, K, Q) {
  const s = v3.unit(S);
  const tc = orientTorque(S, rhat, K).tau, td = dissipTorque(S, rhat, Q).tau;
  return { tauCdotS: v3.dot(tc, s), tauDdotS: v3.dot(td, s),
    tauCmag: v3.norm(tc), tauDmag: v3.norm(td) };
}

/* ── (2) 単体の導関数(第①〜④段) ─────────────────────────────────────────
   y = [Sx, Sy, Sz, Heat, Worb, Wcon, Wint, Wdrv, Lorb, Eint]
   P は宣言:
     K, Q                 … 配向・散逸
     spinAxisSupply       … 第④段の供給(null なら 1 本も効かない = 第①〜③段)
       { Gamma, Omega, contractRate, intPower, drive }
     I0                   … 慣性(contractRate>0 なら I(t)=I0·e^{−c t})
     rhatOf(t)            … r̂ の宣言(既定は x 軸に固定)
*/
const IDX = { S: 0, HEAT: 3, WORB: 4, WCON: 5, WINT: 6, WDRV: 7, LORB: 8, EINT: 9 };
export const STATE_LEN = 10;

export function inertiaAt(P, t) {
  const c = (P.spinAxisSupply && P.spinAxisSupply.contractRate) || 0;
  return P.I0 * Math.exp(-c * t);
}

export function soloDerivs(P, t, y) {
  const S = [y[0], y[1], y[2]];
  const rhat = P.rhatOf ? P.rhatOf(t) : [1, 0, 0];
  const s = v3.unit(S), Smag = v3.norm(S);
  const a = v3.dot(s, rhat);
  const tc = v3.mul(v3.cross(s, rhat), P.K * a);
  const td = v3.mul(v3.sub(rhat, v3.mul(s, a)), P.Q * a);
  let tau = v3.add(tc, td);
  const d = new Array(STATE_LEN).fill(0);
  // 散逸の熱(dU/dt の符号反転 —— **式の上で厳密**)
  d[IDX.HEAT] = (Smag > 0) ? (P.K * P.Q * a * a * (1 - a * a)) / Smag : 0;
  // 第④段: 軸方向の供給(宣言が無ければ 1 本も効かない)
  const sup = P.spinAxisSupply;
  if (sup) {
    const I = inertiaAt(P, t), om = (I > 0) ? Smag / I : 0;
    let axial = 0;
    if (sup.Gamma) {                       // ① 公転 E/J(反作用を L_orb へ)
      const g = sup.Gamma * (sup.Omega - om);
      axial += g; d[IDX.LORB] -= g; d[IDX.WORB] += g * om;
    }
    if (sup.contractRate) {                // ② 収縮 −½Ω²İ(|S| 一定・I が縮む)
      const Idot = -sup.contractRate * I;
      d[IDX.WCON] += -0.5 * om * om * Idot;
    }
    if (sup.intPower) {                    // ③ 内部モード(貯蔵から)
      axial += (om > 0) ? sup.intPower / om : 0;
      d[IDX.WINT] += sup.intPower; d[IDX.EINT] -= sup.intPower;
    }
    if (sup.drive) {                       // ④ 外部駆動(=「手」)
      axial += sup.drive; d[IDX.WDRV] += sup.drive * om;
    }
    if (axial !== 0) tau = v3.add(tau, v3.mul(s, axial));
  }
  d[0] = tau[0]; d[1] = tau[1]; d[2] = tau[2];
  return d;
}

/** 単体の保存量・診断(時刻 t の状態から読む — 積分器は触らない)。 */
export function soloInvariants(P, t, y) {
  const S = [y[0], y[1], y[2]];
  const rhat = P.rhatOf ? P.rhatOf(t) : [1, 0, 0];
  const s = v3.unit(S), Smag = v3.norm(S), I = inertiaAt(P, t);
  const a = v3.dot(s, rhat);
  const Erot = (I > 0) ? (Smag * Smag) / (2 * I) : 0;
  return { Smag, omega: (I > 0) ? Smag / I : 0, I, a,
    psiDeg: Math.acos(Math.max(-1, Math.min(1, a))) * 180 / Math.PI,
    U: -0.5 * P.K * a * a, Erot, heat: y[IDX.HEAT],
    Worb: y[IDX.WORB], Wcon: y[IDX.WCON], Wint: y[IDX.WINT], Wdrv: y[IDX.WDRV],
    Lorb: y[IDX.LORB], Eint: y[IDX.EINT],
    // 第①〜③段の閉じ: E = Erot + U + Heat
    closureNoSupply: Erot + (-0.5 * P.K * a * a) + y[IDX.HEAT],
    // 第④段の閉じ: ΔErot = ΣW − Q_axial(器が初期値と引き算して読む)
    supplySum: y[IDX.WORB] + y[IDX.WCON] + y[IDX.WINT] + y[IDX.WDRV] };
}

/* ── (3) 閉じた連星(第⑤段) ─────────────────────────────────────────────
   y = [S1(3), S2(3), Lorb, phi, Heat]  —— r̂ は公転から作る(宣言ではない)
*/
export const BIN_LEN = 9;
const B = { S1: 0, S2: 3, LORB: 6, PHI: 7, HEAT: 8 };

export function keplerFromL(P, L) {
  const M = P.m1 + P.m2, mu = P.m1 * P.m2 / M, GM = P.G * M;
  const sep = L * L / (GM * mu * mu);
  const Omega = GM * GM * mu * mu * mu / (L * L * L);
  const Eorb = -GM * GM * mu * mu * mu / (2 * L * L);
  return { sep, Omega, Eorb, mu, M, GM };
}

export function binaryDerivs(P, t, y) {
  const k = keplerFromL(P, y[B.LORB]);
  const phi = y[B.PHI], rhat = [Math.cos(phi), Math.sin(phi), 0];
  const d = new Array(BIN_LEN).fill(0);
  let tauZsum = 0, heat = 0, tauDz = 0;
  for (let b = 0; b < 2; b++) {
    const o = (b === 0) ? B.S1 : B.S2;
    const S = [y[o], y[o + 1], y[o + 2]];
    const s = v3.unit(S), Smag = v3.norm(S), a = v3.dot(s, rhat);
    const K = P.K[b], Q = P.Q[b];
    const tc = v3.mul(v3.cross(s, rhat), K * a);
    const td = v3.mul(v3.sub(rhat, v3.mul(s, a)), Q * a);
    const tau = v3.add(tc, td);
    d[o] = tau[0]; d[o + 1] = tau[1]; d[o + 2] = tau[2];
    tauZsum += tau[2]; tauDz += td[2];
    heat += (Smag > 0) ? (K * Q * a * a * (1 - a * a)) / Smag : 0;
  }
  d[B.LORB] = -tauZsum;        // **反作用** —— J_z = L_orb + ΣS_z が構造的に閉じる
  d[B.PHI] = k.Omega;
  // 熱は**閉じの残差**として定義する。r̂ が公転で回るので、散逸トルクの軌道側の反作用が
  // する仕事 Ω·Σてτ_d,z も熱へ入る(r̂ 固定の単体では τ_d,z の項が無いので上の式だけで閉じた)。
  //   dE/dt = −Ω Στ_z + [−ΣQ̇_⊥ + Ω Στ_c,z] + Ḣeat = 0  ⟺  Ḣeat = ΣQ̇_⊥ + Ω Στ_d,z
  // **非負であることは主張しない** —— 単調かどうかは器が実測して報告する(Failure First)。
  d[B.HEAT] = heat + k.Omega * tauDz;
  return d;
}

export function binaryInvariants(P, t, y) {
  const k = keplerFromL(P, y[B.LORB]);
  const phi = y[B.PHI], rhat = [Math.cos(phi), Math.sin(phi), 0];
  let Espin = 0, U = 0, Sz = 0;
  const rows = [];
  for (let b = 0; b < 2; b++) {
    const o = (b === 0) ? B.S1 : B.S2;
    const S = [y[o], y[o + 1], y[o + 2]];
    const Smag = v3.norm(S), s = v3.unit(S), a = v3.dot(s, rhat);
    Espin += (Smag * Smag) / (2 * P.I[b]);
    U += -0.5 * P.K[b] * a * a;
    Sz += S[2];
    rows.push({ Smag, a, psiDeg: Math.acos(Math.max(-1, Math.min(1, a))) * 180 / Math.PI,
      omega: Smag / P.I[b], Sz: S[2] });
  }
  return { Lorb: y[B.LORB], Omega: k.Omega, sep: k.sep, Eorb: k.Eorb,
    Jz: y[B.LORB] + Sz, E: k.Eorb + Espin + U + y[B.HEAT],
    Espin, U, heat: y[B.HEAT], bodies: rows };
}

/* ── (4) RK4(固定刻み・汎用) ─────────────────────────────────────────────── */
export function rk4(deriv, P, t, y, h) {
  const n = y.length;
  const k1 = deriv(P, t, y);
  const y2 = new Array(n); for (let i = 0; i < n; i++) y2[i] = y[i] + 0.5 * h * k1[i];
  const k2 = deriv(P, t + 0.5 * h, y2);
  const y3 = new Array(n); for (let i = 0; i < n; i++) y3[i] = y[i] + 0.5 * h * k2[i];
  const k3 = deriv(P, t + 0.5 * h, y3);
  const y4 = new Array(n); for (let i = 0; i < n; i++) y4[i] = y[i] + h * k3[i];
  const k4 = deriv(P, t + h, y4);
  const out = new Array(n);
  for (let i = 0; i < n; i++) out[i] = y[i] + (h / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]);
  return out;
}

/** 単体の走行。`samples` 枚のスナップショットを返す(最初と最後を必ず含む)。 */
export function runSolo(P) {
  let y = P.y0.slice(), t = 0;
  const inv0 = soloInvariants(P, 0, y);
  const snaps = [{ t: 0, inv: inv0 }];
  const every = Math.max(1, Math.floor(P.steps / (P.samples || 20)));
  for (let k = 0; k < P.steps; k++) {
    y = rk4(soloDerivs, P, t, y, P.dt); t += P.dt;
    if ((k + 1) % every === 0 || k === P.steps - 1) snaps.push({ t, inv: soloInvariants(P, t, y) });
  }
  return { id: P.id, t, y, first: inv0, last: soloInvariants(P, t, y), snaps };
}

/** 連星の走行。 */
export function runBinary(P) {
  let y = P.y0.slice(), t = 0;
  const inv0 = binaryInvariants(P, 0, y);
  const snaps = [{ t: 0, inv: inv0 }];
  const every = Math.max(1, Math.floor(P.steps / (P.samples || 20)));
  let worstJz = 0, worstE = 0, worstS = [0, 0];
  let heatDrops = 0, heatPrev = inv0.heat, heatWorstDrop = 0;
  for (let k = 0; k < P.steps; k++) {
    y = rk4(binaryDerivs, P, t, y, P.dt); t += P.dt;
    const iv = binaryInvariants(P, t, y);
    if (iv.heat < heatPrev) { heatDrops++; heatWorstDrop = Math.max(heatWorstDrop, heatPrev - iv.heat); }
    heatPrev = iv.heat;
    worstJz = Math.max(worstJz, Math.abs(iv.Jz - inv0.Jz) / Math.max(1e-30, Math.abs(inv0.Jz)));
    worstE = Math.max(worstE, Math.abs(iv.E - inv0.E) / Math.max(1e-30, Math.abs(inv0.E)));
    for (let b = 0; b < 2; b++) worstS[b] = Math.max(worstS[b],
      Math.abs(iv.bodies[b].Smag - inv0.bodies[b].Smag) / Math.max(1e-30, inv0.bodies[b].Smag));
    if ((k + 1) % every === 0 || k === P.steps - 1) snaps.push({ t, inv: iv });
  }
  return { id: P.id, t, y, first: inv0, last: binaryInvariants(P, t, y), snaps,
    worstJzRel: worstJz, worstErel: worstE, worstSpinRel: worstS,
    heatDrops, heatWorstDrop, heatSteps: P.steps };
}

/* ── (5) 理論値(比べる相手 —— 実測と並べるためだけに置く) ───────────────── */
/** 整列の時定数(線形化・a≈1): τ_align = |S|/Q。**K に依らない**。 */
export const alignTimeConstant = (Smag, Q) => (Q > 0 ? Smag / Q : Infinity);
/** 保存だけの歳差率: Ω_prec = K a / |S|(a は一定)。 */
export const precessionRate = (K, a, Smag) => (Smag > 0 ? K * a / Smag : 0);

/* ══ 第276便c(原仮定者の裁定(第66報)(3))の追記 ══════════════════════════
   **旧模型(上)は 1 行も変えていない。**第275便e ⑧ の否定結果(公転が回る系で向きの散逸が
   熱の単調増加を保証しない)を直すための**受動散逸**を、別の関数として足す。

   ■ 受動散逸(統括の検証項目 R42 の N1 の直し)
     全 J_z を固定した機械エネルギーの勾配を取り、**自転の大きさを変えない向き**へだけ流す:
       g   = ∂(E_spin + U)/∂S − Ω_orb ẑ
           = ω ŝ − (K a/|S|)(r̂ − a ŝ) − Ω ẑ
       P_s = I − ŝ ŝᵀ                          (自転軸に直交する射影)
       τ_d = −γ P_s g
       Q̇   = γ |P_s g|² ≥ 0                    (**構造的に非負**)
     ŝ に沿う成分は落ちるので **τ_d·ŝ = 0**(第275便e の負の対照 R37 は**そのまま生きている**)。
     射影を展開すると
       P_s g = −(K a/|S|)(r̂ − a ŝ) − Ω(ẑ − s_z ŝ)
     となり、ω の項は**消える**。第 2 項(Ω に比例)が旧模型に無かったもので、
     **公転の回転に対する相対角速度**がここに入る(旧 τ_d は配置だけの関数だった)。
   ■ 閉じ(**結果であって定義ではない**)
     軌道の反作用を dL_orb/dt = −Σ τ_z(保存+散逸)で閉じると、∂U/∂φ·φ̇ が保存トルクの
     z 反作用と厳密に相殺するので
       dE/dt = Σ g·τ_d + Q̇ = −γ Σ|P_s g|² + Q̇ = 0
     が**恒等的に**成り立つ。旧 `binaryDerivs` は熱を「閉じの残差」として定義していたが、
     こちらは熱を **γ|P_s g|²** と**先に定義**し、E の保存は実測で確かめる量になる。
   ■ **新しい γ は旧 Q とは別の係数である**(単位も別: Q は [トルク]、γ は [トルク]/[∂E/∂S])。
     どちらも**宣言された自由パラメータ**であって観測から同定した値ではない。
   ■ **最小 L の停止条件**(`minOrbitalL`)
     宣言した下限を越えて L_orb を進めない。**捕捉・地平面・合体の判定には使わない** ——
     模型が外挿になる手前で走行を止めるための宣言である。 */

/** 機械エネルギーの勾配 g = ∂(E_spin+U)/∂S − Ω ẑ と、その自転軸直交成分 P_s g。 */
export function passiveGradient(S, rhat, K, I, Omega) {
  const s = v3.unit(S), Smag = v3.norm(S), a = v3.dot(s, rhat);
  const om = (I > 0 && Smag > 0) ? Smag / I : 0;
  // g = ω ŝ − (K a/|S|)(r̂ − a ŝ) − Ω ẑ
  const perpR = v3.sub(rhat, v3.mul(s, a));                 // r̂ − a ŝ
  const g = v3.sub(v3.sub(v3.mul(s, om), v3.mul(perpR, (Smag > 0) ? K * a / Smag : 0)),
    [0, 0, Omega]);
  // P_s g = g − (g·ŝ)ŝ   (= −(Ka/|S|)(r̂−aŝ) − Ω(ẑ − s_z ŝ))
  const Pg = v3.sub(g, v3.mul(s, v3.dot(g, s)));
  return { g, Pg, s, Smag, a, omega: om, PgMag: v3.norm(Pg) };
}

/**
 * **受動散逸トルク** τ_d = −γ P_s g と、その熱 Q̇ = γ|P_s g|²(**非負**)。
 * τ_d·ŝ = 0 なので |S| は動かない(自転を加速しない)。
 */
export function passiveBinaryTorque(S, rhat, K, I, Omega, gamma) {
  const p = passiveGradient(S, rhat, K, I, Omega);
  return { tau: v3.mul(p.Pg, -gamma), heat: gamma * p.PgMag * p.PgMag,
    PgMag: p.PgMag, a: p.a, omega: p.omega, sdot: v3.dot(v3.mul(p.Pg, -gamma), p.s) };
}

/** 受動散逸版の導関数(状態の並びは `binaryDerivs` と同じ y = [S1,S2,Lorb,phi,Heat])。 */
export function passiveBinaryDerivs(P, t, y) {
  const k = keplerFromL(P, y[B.LORB]);
  const phi = y[B.PHI], rhat = [Math.cos(phi), Math.sin(phi), 0];
  const d = new Array(BIN_LEN).fill(0);
  let tauZsum = 0, heat = 0;
  for (let b = 0; b < 2; b++) {
    const o = (b === 0) ? B.S1 : B.S2;
    const S = [y[o], y[o + 1], y[o + 2]];
    const s = v3.unit(S), a = v3.dot(s, rhat);
    const K = P.K[b], gm = P.gamma[b];
    const tc = v3.mul(v3.cross(s, rhat), K * a);                  // 保存(旧模型と同じ)
    const pd = passiveBinaryTorque(S, rhat, K, P.I[b], k.Omega, gm);
    const tau = v3.add(tc, pd.tau);
    d[o] = tau[0]; d[o + 1] = tau[1]; d[o + 2] = tau[2];
    tauZsum += tau[2];
    heat += pd.heat;
  }
  d[B.LORB] = -tauZsum;        // **反作用**(J_z = L_orb + ΣS_z は構造的に閉じる)
  d[B.PHI] = k.Omega;
  d[B.HEAT] = heat;            // **先に定義した非負の熱**(残差ではない)
  return d;
}

/**
 * 受動散逸版の走行。`minOrbitalL` を宣言すると、**それを下回る手前で止める**
 * (合体・捕捉・地平面の判定ではない)。
 */
export function runPassiveBinary(P) {
  let y = P.y0.slice(), t = 0;
  const inv0 = binaryInvariants(P, 0, y);
  const snaps = [{ t: 0, inv: inv0 }];
  const every = Math.max(1, Math.floor(P.steps / (P.samples || 20)));
  let worstJz = 0, worstE = 0, worstS = [0, 0];
  let heatDrops = 0, heatPrev = inv0.heat, heatWorstDrop = 0;
  let stopped = null, done = 0;
  for (let k = 0; k < P.steps; k++) {
    const yn = rk4(passiveBinaryDerivs, P, t, y, P.dt);
    if (P.minOrbitalL !== undefined && yn[B.LORB] < P.minOrbitalL) {
      stopped = { reason: 'minOrbitalL', t, Lorb: y[B.LORB], minOrbitalL: P.minOrbitalL };
      break;
    }
    y = yn; t += P.dt; done = k + 1;
    const iv = binaryInvariants(P, t, y);
    if (iv.heat < heatPrev - 1e-18) { heatDrops++; heatWorstDrop = Math.max(heatWorstDrop, heatPrev - iv.heat); }
    heatPrev = iv.heat;
    worstJz = Math.max(worstJz, Math.abs(iv.Jz - inv0.Jz) / Math.max(1e-30, Math.abs(inv0.Jz)));
    worstE = Math.max(worstE, Math.abs(iv.E - inv0.E) / Math.max(1e-30, Math.abs(inv0.E)));
    for (let b = 0; b < 2; b++) worstS[b] = Math.max(worstS[b],
      Math.abs(iv.bodies[b].Smag - inv0.bodies[b].Smag) / Math.max(1e-30, inv0.bodies[b].Smag));
    if ((k + 1) % every === 0 || k === P.steps - 1) snaps.push({ t, inv: iv });
  }
  return { id: P.id, t, y, first: inv0, last: binaryInvariants(P, t, y), snaps,
    worstJzRel: worstJz, worstErel: worstE, worstSpinRel: worstS,
    heatDrops, heatWorstDrop, heatSteps: done, stopped };
}

export default { POWERBALL_VERSION, POWERBALL_HYPOTHESIS, v3, orientTorque, dissipTorque,
  axialProjection, soloDerivs, soloInvariants, inertiaAt, binaryDerivs, binaryInvariants,
  keplerFromL, rk4, runSolo, runBinary, alignTimeConstant, precessionRate, STATE_LEN, BIN_LEN,
  passiveGradient, passiveBinaryTorque, passiveBinaryDerivs, runPassiveBinary };
