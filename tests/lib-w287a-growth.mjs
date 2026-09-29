// 第287便a(原仮定者の裁定(第77報)④「銀河の成長を考える」・統括の検証項目 R107)—— **対照の最小模型**(純関数・Node だけ・エンジン未接続)。
//
// ■ 何か
//   中心の重力に「中心の角運動量 J_c から作った斥力の項」を 1 つ足した動径ポテンシャル
//     Φ(r) = −G M_c / r + α ℓ_c² / (2 r²)      (ℓ_c = J_c / M_c)
//   の釣り合い r* = α J_c² / (G M_c³)・復元 a_r′(r*) = −G M_c / r*³ < 0・J_c ∝ M_c^p なら r* ∝ M_c^{2p−3}
//   (成長につれて外へ広がるのは p > 3/2)・散逸が無ければ r* のまわりで振動して収束しない —— を閉形式と数値で持つ。
//
// ■ 位置づけ(書くこと・書かないこと)
//   ・**DFM から導出した法則ではない**。「メッシュ斥力の候補が満たすべき条件を見る対照」(統括が設定した検証仮説)である。
//   ・α を観測へ合わせない。既存の a_mesh(geoPN=3 のトイ)に重ねない —— エンジンには 1 バイトも接続しない。
//   ・この模型の r* があることを「星団が落ち着いた」「斥力で釣り合った」の根拠にしない(エンジンの測定は器 tests/exp-w287a-growth.mjs)。
export const GROWTH_LIB_VERSION = 'w287a-growth-lib-1';

/** 動径ポテンシャル Φ(r)(ℓ_c = J_c/M_c)。 */
export function phi(r, { G, Mc, Jc, alpha }) {
  const l = Jc / Mc;
  return -G * Mc / r + alpha * l * l / (2 * r * r);
}
/** 動径加速度 a_r = −dΦ/dr = −G M_c/r² + α ℓ_c²/r³。 */
export function accelR(r, { G, Mc, Jc, alpha }) {
  const l = Jc / Mc;
  return -G * Mc / (r * r) + alpha * l * l / (r * r * r);
}
/** a_r′(r) = 2 G M_c/r³ − 3 α ℓ_c²/r⁴(解析形)。 */
export function dAccelR(r, { G, Mc, Jc, alpha }) {
  const l = Jc / Mc;
  return 2 * G * Mc / (r * r * r) - 3 * alpha * l * l / (r * r * r * r);
}
/** 釣り合いの半径 r* = α J_c² / (G M_c³)(閉形式)。α ≤ 0 または J_c = 0 では釣り合いなし(null)。 */
export function rStar({ G, Mc, Jc, alpha }) {
  if (!(alpha > 0) || Jc === 0) return null;
  return alpha * Jc * Jc / (G * Mc * Mc * Mc);
}
/** r* での復元 a_r′(r*) = −G M_c / r*³(閉形式)。 */
export function restoringAtStar(P) {
  const rs = rStar(P);
  return rs === null ? null : -P.G * P.Mc / (rs * rs * rs);
}
/** J_c = k M_c^p のとき r* ∝ M_c^{2p−3} の指数と、外へ広がるか(p > 3/2)。 */
export function scalingExponent(p) { return 2 * p - 3; }
export function growsOutward(p) { return p > 1.5; }

/** r* の数値の根(二分法 —— a_r の符号の変わり目)。閉形式との照合用。 */
export function rStarBisect(P, lo, hi, iters = 200) {
  let a = lo, b = hi, fa = accelR(a, P);
  for (let k = 0; k < iters; k++) {
    const m = 0.5 * (a + b), fm = accelR(m, P);
    if (fm === 0) return m;
    if ((fa < 0) === (fm < 0)) { a = m; fa = fm; } else b = m;
  }
  return 0.5 * (a + b);
}

/**
 * 散逸 γ(a = a_r − γ v_r)を入れた動径運動を速度 Verlet で積分する(γ=0 は散逸なし)。
 * 返り値: 振幅(前半と後半の |r − r*| の最大)とエネルギーの相対変化。散逸なしなら振幅は減らない(収束しない)。
 */
export function radialRun(P, { r0, v0 = 0, dt, steps, gamma = 0 }) {
  const rs = rStar(P);
  let r = r0, v = v0, a = accelR(r, P) - gamma * v;
  const E0 = 0.5 * v * v + phi(r, P);
  let ampFirst = 0, ampLast = 0;
  for (let k = 0; k < steps; k++) {
    v += 0.5 * dt * a; r += dt * v;
    a = accelR(r, P) - gamma * v;
    v += 0.5 * dt * a;
    const dev = Math.abs(r - rs);
    if (k < steps / 4) ampFirst = Math.max(ampFirst, dev);
    if (k >= 3 * steps / 4) ampLast = Math.max(ampLast, dev);
  }
  const E1 = 0.5 * v * v + phi(r, P);
  return { rStar: rs, ampFirst, ampLast, ampRatio: ampLast / ampFirst, relEnergyChange: Math.abs(E1 - E0) / Math.abs(E0), gamma };
}

/** 単体試験(閉形式との相対 1e-12・散逸なしで振幅が残る・散逸ありで減る)。QA `behavior.growthMinimal` と器が同じ関数を呼ぶ。 */
export const SELF_TEST_CASES = Object.freeze([
  Object.freeze({ G: 6.6743, Mc: 25, Jc: 0.015, alpha: 1 }),
  Object.freeze({ G: 6.6743, Mc: 60, Jc: 40, alpha: 1 }),
  Object.freeze({ G: 1, Mc: 1, Jc: 1, alpha: 0.5 }),
]);
export function selfTest() {
  const rel = (a, b) => (a === b ? 0 : Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b), 1e-300));
  const rows = [];
  let worst = 0;
  for (const P of SELF_TEST_CASES) {
    const rs = rStar(P);
    const rb = rStarBisect(P, rs / 10, rs * 10);
    const eq = accelR(rs, P);                               // 釣り合いの式の残差(G M_c/r*² のスケールで割る)
    const eqRel = Math.abs(eq) / (P.G * P.Mc / (rs * rs));
    const dA = dAccelR(rs, P), dAc = restoringAtStar(P);
    const pExp = [1, 1.5, 2].map((p) => { const k = P.Jc / Math.pow(P.Mc, p); const Q = Object.assign({}, P, { Mc: 2 * P.Mc, Jc: k * Math.pow(2 * P.Mc, p) });
      return { p, ratio: rStar(Q) / rs, closed: Math.pow(2, scalingExponent(p)), rel: rel(rStar(Q) / rs, Math.pow(2, scalingExponent(p))), outward: growsOutward(p) }; });
    const r = { P, rStar: rs, rBisect: rb, relBisect: rel(rs, rb), eqRel, dAccel: dA, dAccelClosed: dAc, relDAccel: rel(dA, dAc), restoring: dAc < 0, scaling: pExp };
    worst = Math.max(worst, r.relBisect, r.eqRel, r.relDAccel, ...pExp.map((z) => z.rel));
    rows.push(r);
  }
  const P0 = SELF_TEST_CASES[2], rs0 = rStar(P0);
  const T0 = 2 * Math.PI * Math.sqrt(rs0 * rs0 * rs0 / (P0.G * P0.Mc));
  const noDiss = radialRun(P0, { r0: 1.3 * rs0, dt: T0 / 2000, steps: 40000, gamma: 0 });
  const diss = radialRun(P0, { r0: 1.3 * rs0, dt: T0 / 2000, steps: 40000, gamma: 0.5 / T0 * 2 * Math.PI });
  const ok = worst <= 1e-12 && rows.every((z) => z.restoring && z.scaling.every((s) => s.outward === (s.p > 1.5)))
    && noDiss.ampRatio > 0.9 && noDiss.relEnergyChange < 1e-6 && diss.ampRatio < 0.1;
  return { version: GROWTH_LIB_VERSION, ok, worstRel: worst, rows, noDissipation: noDiss, withDissipation: diss };
}
