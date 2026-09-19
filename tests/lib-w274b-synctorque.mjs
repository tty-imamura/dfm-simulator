// 第274便b(第64報・統括の検証項目 R28 / 因果の向きの裁定)—— **独立同期トルクの純関数**。
//
// ■ 何であって、何でないか
//   ・原仮定者の裁定(第64報)の**因果の向き**を測れる形にするための道具立てである:
//     **採る** 「連星が kFrame≈0 で安定なら相対メッシュ運動が消え、**独立の同期トルク**で自転が
//       公転へ引き込まれる。その極限が相互潮汐ロックである」
//     **採らない** 「ロックしているから k≈0 と置く」
//   ・したがって **Γ(散逸係数)・K(配向係数)を kFrame で乗じない**。k=0 で Γ まで 0 にすると
//     「自転を変える原因」まで消えてしまい、裁定の因果が試験にならないからである。
//     本ライブラリの同期トルク関数は **kFrame を引数に一度も取らない**(QA が機械で固定する)。
//   ・**法則ではない**。エンジンの力学へは 1 バイトも接続していない(`S._core` には 1 命令も足していない。
//     内蔵プリセットは 1 bit も変えていない)。**ロック検出器でもない**。
//   ・**同期率から k を作る式(第272便b の候補 (i)(iii))は診断であって、因果の証拠に使わない。**
//     本ライブラリは同期率を入力に取らず、同期トルクの側では k を 1 度も読まない。
//
// ■ 運動学(面直 z 成分だけ・2D)
//   符号規約は `lib-w272c-binlock.mjs` の SIGN_CONVENTION_JA と同じ(反時計回りが +・
//   同期比は符号つき ω/Ω で読む。**+1 が同期・−1 は逆行の同期**)。
//     天体 i: 慣性 I_i(固定)・自転 ω_i・向き θ_i。相手向き角 φ。δ_i = θ_i − φ。
//     公転角速度 Ω。**軌道は L_orb(相対軌道の角運動量)だけで代表する**(準円の永年模型)。
//
// ■ 2 候補のトルク(**どちらも kFrame を含まない**)
//   (A) 散逸型     τ_i = −Γ_i(ω_i − Ω)
//   (B) 配向型     U_lock = −K_i cos 2δ_i ・ τ_i = −2K_i sin 2δ_i − Γ_i δ̇_i(δ̇_i = ω_i − Ω)
//   反作用:  L̇_orb = −Σ τ_i(**外から角運動量を足さない**)
//   散逸:    Q̇ = Σ Γ_i(ω_i − Ω)² ≥ 0
//
// ■ 帳簿(この形にした理由 —— 機械検査が**厳密**になるため)
//   準円ケプラーでは a = L²/(GMμ²)・Ω = (GM)²μ³/L³・E_orb = −(GM)²μ³/(2L²) で、
//   **dE_orb/dL = Ω が恒等的に成り立つ**。したがって
//     E = E_orb(L) + Σ½I_iω_i² + U_lock   に対して   dE/dt = Σ(ω_i−Ω)[τ_i + 2K_i sin2δ_i] = −Q̇
//   が**式の上で厳密**になる。角運動量 L_tot = L_orb + Σ I_i ω_i は各 RK 段で相殺するので
//   **丸め以外に漂わない**。QA `behavior.syncTorqueLedger` はこの 2 つを機械固定する。
//
// ■ この器が**言わないこと**
//   「潮汐ロックへ収束することを証明した」「引きずりが完全に消えている空間メッシュ状態を確認した」
//   「同期トルクを採用した」「Γ・K の実在天体の値を同定した」「kF0 版が成立した」。
//   Γ・K は**宣言された自由パラメータ**であって、観測から同定した値ではない。
export const SYNCTORQUE_VERSION = 'w274b-1';

// ---------------------------------------------------------------- 契約(QA `docs.syncCausal` が読む)
export const CAUSAL_CONTRACT = {
  version: SYNCTORQUE_VERSION,
  adopt: '連星が kFrame≈0 で安定なら相対メッシュ運動が消え、独立の同期トルクで自転が公転へ引き込まれる',
  reject: 'ロックしているから k≈0 と置く',
  // 因果の試験のやり方(器が守る 3 条件 —— 結果 JSON の meta にも同じ 3 つを刻む)
  testRules: [
    'k は外から固定する(同期率から k を作らない)',
    '非同期から出発する(初期 ω/Ω ≠ 1)',
    'Γ・K を kFrame で乗じない',
  ],
  diagnosticOnly: '第272便b の候補 (i)(iii) は「同期率 → k」の**診断式**であって、因果の証拠には使わない',
  notClaim: ['潮汐ロックへの収束の証明', '引きずり消失の確認', '同期トルクの採用', 'Γ・K の同定'],
};

const num = (z) => (typeof z === 'number' && Number.isFinite(z)) ? z : NaN;

// ---------------------------------------------------------------- (1) 2 候補のトルク
/** (A) 散逸型 τ = −Γ(ω−Ω)。**kFrame を取らない。** */
export function dissipativeTorque(o) {
  const G = num(o && o.Gamma), w = num(o && o.omega), W = num(o && o.Omega);
  if (![G, w, W].every(Number.isFinite) || G < 0) return null;
  const slip = w - W;
  return { name: 'dissipative', tau: -G * slip, slip, dissipation: G * slip * slip, Gamma: G };
}

/** (B) 配向型 U=−K cos2δ ・ τ = −2K sin2δ − Γ(ω−Ω)。**kFrame を取らない。** */
export function orientationTorque(o) {
  const K = num(o && o.K), G = num(o && o.Gamma), d = num(o && o.delta);
  const w = num(o && o.omega), W = num(o && o.Omega);
  if (![K, G, d, w, W].every(Number.isFinite) || G < 0) return null;
  const slip = w - W;
  return { name: 'orientation', tau: -2 * K * Math.sin(2 * d) - G * slip, slip,
    restoring: -2 * K * Math.sin(2 * d), dissipation: G * slip * slip,
    U: -K * Math.cos(2 * d), K, Gamma: G };
}

// ---------------------------------------------------------------- (2) 永年模型(準円)の導関数
// y = [L, ω1, ω2, δ1, δ2, Q]
function keplerFromL(P, L) {
  const M = P.m1 + P.m2, mu = P.m1 * P.m2 / M, GM = P.G * M;
  const a = L * L / (GM * mu * mu);
  const Om = GM * GM * mu * mu * mu / (L * L * L);
  const Eorb = -GM * GM * mu * mu * mu / (2 * L * L);
  return { a, Omega: Om, Eorb, mu, M, GM };
}

export function secularDerivs(P, y) {
  const k = keplerFromL(P, y[0]);
  const tau = [0, 0], Qd = [0, 0];
  for (let i = 0; i < 2; i++) {
    const t = (P.K[i] !== 0)
      ? orientationTorque({ K: P.K[i], Gamma: P.Gamma[i], delta: y[3 + i], omega: y[1 + i], Omega: k.Omega })
      : dissipativeTorque({ Gamma: P.Gamma[i], omega: y[1 + i], Omega: k.Omega });
    if (!t) return null;
    tau[i] = t.tau; Qd[i] = t.dissipation;
  }
  return [-(tau[0] + tau[1]), tau[0] / P.I[0], tau[1] / P.I[1],
    y[1] - k.Omega, y[2] - k.Omega, Qd[0] + Qd[1]];
}

/** 全エネルギー E = E_orb(L) + Σ½Iω² + U_lock と角運動量 L_tot = L + ΣIω。 */
export function secularInvariants(P, y) {
  const k = keplerFromL(P, y[0]);
  let Espin = 0, U = 0, Lspin = 0;
  for (let i = 0; i < 2; i++) {
    Espin += 0.5 * P.I[i] * y[1 + i] * y[1 + i];
    Lspin += P.I[i] * y[1 + i];
    if (P.K[i] !== 0) U += -P.K[i] * Math.cos(2 * y[3 + i]);
  }
  return { a: k.a, Omega: k.Omega, Eorb: k.Eorb, Espin, Ulock: U,
    E: k.Eorb + Espin + U, Ltot: y[0] + Lspin, Lorb: y[0], Lspin,
    ratio: [y[1] / k.Omega, y[2] / k.Omega] };
}

/** 永年模型の RK4 走行。**同期トルクの側では k(kFrame)を 1 度も読まない。** */
export function runSecular(P) {
  const n = P.steps, dt = P.dt, every = P.sample || Math.max(1, Math.floor(n / 200));
  let y = [P.L0, P.omega0[0], P.omega0[1], P.delta0[0], P.delta0[1], 0];
  const inv0 = secularInvariants(P, y);
  const traj = [{ t: 0, ...inv0, Q: 0, omega: [y[1], y[2]], delta: [y[3], y[4]] }];
  let worstL = 0, Qprev = 0, qMono = true, nan = 0;
  const add = (a, b, s) => a.map((z, i) => z + s * b[i]);
  for (let s = 0; s < n; s++) {
    const k1 = secularDerivs(P, y); if (!k1) { nan++; break; }
    const k2 = secularDerivs(P, add(y, k1, dt / 2)); if (!k2) { nan++; break; }
    const k3 = secularDerivs(P, add(y, k2, dt / 2)); if (!k3) { nan++; break; }
    const k4 = secularDerivs(P, add(y, k3, dt)); if (!k4) { nan++; break; }
    const ny = y.slice();
    for (let i = 0; i < 6; i++) ny[i] = y[i] + dt / 6 * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]);
    y = ny;
    if (!y.every(Number.isFinite)) { nan++; break; }
    if (y[5] < Qprev) qMono = false;
    Qprev = y[5];
    const iv = secularInvariants(P, y);
    const scale = Math.abs(inv0.Ltot) + Math.abs(inv0.Lspin) + Math.abs(inv0.Lorb);
    worstL = Math.max(worstL, Math.abs(iv.Ltot - inv0.Ltot) / (scale > 0 ? scale : 1));
    if ((s + 1) % every === 0 || s === n - 1)
      traj.push({ t: (s + 1) * dt, ...iv, Q: y[5], omega: [y[1], y[2]], delta: [y[3], y[4]] });
  }
  const inv1 = secularInvariants(P, y);
  const eScale = Math.abs(inv0.E) > 0 ? Math.abs(inv0.E) : 1;
  return { version: SYNCTORQUE_VERSION, id: P.id || null,
    variant: (P.K[0] !== 0 || P.K[1] !== 0) ? 'orientation' : 'dissipative',
    steps: n, dt, nanBreaks: nan, first: inv0, last: inv1, Q: y[5],
    ledger: { angularRelDrift: worstL, qMonotone: qMono, qFinal: y[5],
      energyResidual: (inv1.E + y[5] - inv0.E), energyRelResidual: Math.abs(inv1.E + y[5] - inv0.E) / eScale },
    traj };
}

/** 帳簿の機械検査(QA と器が同じ 1 本を読む)。 */
export function syncTorqueLedger(run, tol) {
  const T = Object.assign({ angular: 1e-12, energyRel: 1e-8 }, tol || {});
  const L = run && run.ledger;
  if (!L) return { ok: false, reason: 'no-ledger', checks: [] };
  const checks = [
    { name: 'angularConserved', value: L.angularRelDrift, limit: T.angular, ok: L.angularRelDrift <= T.angular },
    { name: 'qMonotone', value: L.qMonotone ? 0 : 1, limit: 0, ok: L.qMonotone === true },
    { name: 'qNonNegative', value: L.qFinal, limit: 0, ok: L.qFinal >= 0 },
    { name: 'energyMatchesDissipation', value: L.energyRelResidual, limit: T.energyRel, ok: L.energyRelResidual <= T.energyRel },
    { name: 'noNaN', value: run.nanBreaks, limit: 0, ok: run.nanBreaks === 0 },
  ];
  return { ok: checks.every((c) => c.ok), checks };
}

// ---------------------------------------------------------------- (3) 基準ケース
// **窓は「τ_sync = I/Γ の何倍か」で決める**(単位に依らない形)。
export function syncReferenceCases() {
  const G = 1, m1 = 1, m2 = 1, a0 = 4;
  const M = m1 + m2, mu = m1 * m2 / M, GM = G * M;
  const Om0 = Math.sqrt(GM / (a0 * a0 * a0));
  const L0 = mu * Math.sqrt(GM * a0);
  const I = [0.05, 0.05];
  const P0 = 2 * Math.PI / Om0;
  const base = { G, m1, m2, L0, I, delta0: [0, 0], K: [0, 0] };
  return [
    // (1) 散逸型・非同期(順行の速い自転と遅い自転)から出発 —— 引き込みの基準
    { id: 'dissipativePrograde',
      P: { ...base, id: 'dissipativePrograde', Gamma: [I[0] / (4 * P0), I[1] / (4 * P0)],
        omega0: [3 * Om0, 0.25 * Om0], dt: P0 / 400, steps: 40 * 400 } },
    // (2) 逆行から出発(符号つきで読む —— |ω|/Ω では区別できない)
    { id: 'dissipativeRetrograde',
      P: { ...base, id: 'dissipativeRetrograde', Gamma: [I[0] / (4 * P0), I[1] / (4 * P0)],
        omega0: [-1.5 * Om0, -0.5 * Om0], dt: P0 / 400, steps: 40 * 400 } },
    // (3) 配向型(K>0)—— 秤動が立つ配置
    { id: 'orientationLibration',
      P: { ...base, id: 'orientationLibration', K: [2e-4, 2e-4],
        Gamma: [I[0] / (20 * P0), I[1] / (20 * P0)],
        omega0: [1.4 * Om0, 0.7 * Om0], delta0: [0.3, -0.2], dt: P0 / 400, steps: 40 * 400 } },
    // (4) 零トルクの否定対照 —— Γ=K=0 なら自転も L_orb も動かない・Q=0
    { id: 'zeroTorqueNull',
      P: { ...base, id: 'zeroTorqueNull', Gamma: [0, 0], omega0: [3 * Om0, 0.25 * Om0],
        dt: P0 / 400, steps: 40 * 400 } },
  ];
}

// ---------------------------------------------------------------- (4) 宣言された質量補正 f(**別軸**)
// 独立な質量補正 f = 1 + k_F(α χ_A + β χ_B)(α=m_A/M・β=m_B/M・χ は f·m で自己無撞着に評価)の
// **独立な再計算**である(エンジンの実装の写しではない)。**f と k は別軸**として振る(裁定)。
// 本節の 2 関数だけは k_F を引数に取る —— **これは同期トルクではなく質量則だからである**
// (同期トルク Γ・K は k_F を取らない)。
export function binaryChi(mA, mB, a, D0, eps, p) {
  const e = (eps > 0) ? eps : 0, pw = (p > 0) ? Number(p) : 1;
  const w = (pw > 1) ? Math.pow(a * a + e * e, -pw / 2) : 1 / Math.sqrt(a * a + e * e);
  const wBA = mB * w, wAB = mA * w;
  return { chiA: ((D0 + wBA > 0) ? wBA / (D0 + wBA) : 0), chiB: ((D0 + wAB > 0) ? wAB / (D0 + wAB) : 0), wBA, wAB };
}

export function massFactorLinear(mAobs, mBobs, a, D0, eps, kFrame, p) {
  if (!(mAobs > 0 && mBobs > 0 && a > 0)) return null;
  let f = 2, iters = 0, chi = null;
  for (let s = 0; s < 500; s++) {
    iters = s + 1;
    chi = binaryChi(f * mAobs, f * mBobs, a, D0, eps, p);
    const M = f * (mAobs + mBobs);
    const nf = 1 + kFrame * ((f * mAobs / M) * chi.chiA + (f * mBobs / M) * chi.chiB);
    if (!Number.isFinite(nf)) return null;
    if (nf === f) break;
    f = nf;
  }
  return { f, chiA: chi.chiA, chiB: chi.chiB, iters,
    note: '**f と k は別軸**である(裁定)。f は質量則で、同期トルク Γ・K とは無関係である。' };
}

export default { SYNCTORQUE_VERSION, CAUSAL_CONTRACT, dissipativeTorque, orientationTorque,
  secularDerivs, secularInvariants, runSecular, syncTorqueLedger, syncReferenceCases,
  binaryChi, massFactorLinear };
