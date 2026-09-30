// 第288便a(原仮定者の裁定(第78報)⑤・統括の検証項目 R113・AN76/AN77)—— **固定中心の合体・離散の配分器**(純関数・Node だけ・エンジン未接続)。
//
// ■ 何か
//   支配天体(pinned —— 位置も速度も更新しない)に 1 体が合体するとき、消える天体の運動エネルギー(慣性移動と自転)を合体後の自転へ
//   **エネルギー優先**で渡す規則(近似・経路は問わない)と、その逆写像(離散)を閉形式で持つ。エンジン側の実装は
//   beta/index.html の `dfmFixedCaptureStep` / `dfmFixedEject`(版 w288a-fixcap-1)で、器 tests/exp-w288a-fixcap.mjs が
//   エンジンの帳簿の行をこの関数で作り直して照合する(相対 1e-12)。
//
// ■ 規則(合体)
//   E_* = K_in + E_s,c + E_s,j + (U_before − U_after) − ΔE_self
//     K_in = ½ m_j |v_j − v_c|²(中心と共に等速移動する宣言座標系の慣性速度 —— 座標移送 u を混ぜない・自由二体の μ は使わない)
//     ΔE_self = 消える対ポテンシャルを内部結合の口座へ移す分(エンジンは U_pair —— U_before − U_after にも U_pair が入るので回転へ二重に入らない)
//   E_* < 0 は拒否。E_s′ = (1−h) E_*・ΔQ = h E_*・Ω′ = s √(2 E_s′ / I′)。s = 0(符号を選べない —— 初期スピン 0 の正面衝突)なら h=1(全部を熱へ)。
//   |Ω′| > Ω_max なら超過エネルギー E_s′ − ½ I′ Ω_max² を overflowTo の口座へ("heat"・"precession"・"eject")。null なら拒否(クランプで捨てない)。
// ■ 規則(離散 —— 逆写像)
//   K_eject = E_before − E_spin,remaining − E_spin,eject − U_after − E_self,after − Q_after(K < 0 なら放出しない・熱化分を再利用しない)
//   v_eject = √(2 K / m)。
//
// ■ 書かないこと: 固定中心で閉鎖系になった(ピンが運動量と角運動量を持ち去る —— J_pin・P_pin は別の口座)/ 合体で必ず Ω が増す
//   (I′ が増えれば Ω は下がる)/ 有限の中心スピンで支えた。
export const FIXCAP_LIB_VERSION = 'w288a-fixcap-1';
export const OVERFLOW_TO = Object.freeze(['heat', 'precession', 'eject', null]);

/** 合体の配分(純関数)。入力の欠けや値域外は ok:false・why に理由。 */
export function allocate({ Kin, EsC, EsJ, dU, dEself, h, I, s, omegaMax, overflowTo }) {
  const num = (v) => typeof v === 'number' && Number.isFinite(v);
  for (const [k, v] of Object.entries({ Kin, EsC, EsJ, dU, dEself, h, I, omegaMax })) if (!num(v)) return { ok: false, why: 'input:' + k };
  if (!(h >= 0 && h <= 1)) return { ok: false, why: 'h' };
  if (!(I > 0)) return { ok: false, why: 'I' };
  if (!(omegaMax > 0)) return { ok: false, why: 'omegaMax' };
  if (!(s === 1 || s === -1 || s === 0)) return { ok: false, why: 's' };
  if (OVERFLOW_TO.indexOf(overflowTo) < 0) return { ok: false, why: 'overflowTo' };
  const Estar = Kin + EsC + EsJ + dU - dEself;
  if (!(Estar >= 0)) return { ok: false, why: 'Estar<0', Estar };
  const hEff = (s === 0) ? 1 : h;
  let EsP = (1 - hEff) * Estar;
  const dQ = hEff * Estar;
  const omegaRaw = s * Math.sqrt(2 * EsP / I);
  let overflow = 0;
  if (Math.abs(omegaRaw) > omegaMax) {
    if (overflowTo === null) return { ok: false, why: 'overflow-no-sink', Estar, omegaRaw };
    const Ecap = 0.5 * I * omegaMax * omegaMax;
    overflow = EsP - Ecap; EsP = Ecap;
  }
  const omega = (overflow > 0) ? s * omegaMax : omegaRaw;
  return { ok: true, why: null, Estar, hEff, EsP, dQ, omegaRaw, omega, overflow, overflowTo: (overflow > 0) ? overflowTo : null };
}

/** 離散の逆写像(純関数)。 */
export function ejectInverse({ EsBefore, Epend = 0, Ubefore, EselfBefore, Qbefore, EsRemain, EsEject, Uafter, EselfAfter, Qafter, m }) {
  const Ebefore = EsBefore + Epend + Ubefore + EselfBefore + Qbefore;
  const K = Ebefore - EsRemain - EsEject - Uafter - EselfAfter - Qafter;
  if (!(m > 0)) return { ok: false, why: 'm', K };
  if (!(K >= 0)) return { ok: false, why: 'K<0', K, Ebefore };
  return { ok: true, why: null, Ebefore, K, v: Math.sqrt(2 * K / m) };
}

/** 慣性モーメント I = ½ M R²(エンジンの自転の慣性の規約)。 */
export const inertia = (M, R) => 0.5 * M * R * R;

const rel = (a, b) => (a === b ? 0 : Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b), 1e-300));

/** 単体試験(閉形式との相対 1e-12・拒否 2 条件・上限の受け皿 3 通り・h=0/1 の両端・符号未定・往復)。QA と器が同じ関数を呼ぶ。 */
export function selfTest() {
  const rows = [];
  let worst = 0;
  const base = { Kin: 0.20825, EsC: 0.09, EsJ: 0, dU: -10.6, dEself: -10.6, I: inertia(25.2125, 0.01), s: 1, omegaMax: 20, overflowTo: 'heat' };
  // (1) 閉形式(h=0 と h=1 と h=0.25・上限の外で)
  for (const h of [0, 0.25, 1]) {
    const P = Object.assign({}, base, { h, omegaMax: 40 });
    const r = allocate(P);
    const Es = P.Kin + P.EsC + P.EsJ, om = Math.sqrt(2 * (1 - h) * Es / P.I);
    const e = Math.max(rel(r.Estar, Es), rel(r.EsP, (1 - h) * Es), rel(r.dQ, h * Es), rel(r.omega, om));
    worst = Math.max(worst, e);
    rows.push({ key: 'closed-h' + h, ok: r.ok, rel: e, omega: r.omega, EsP: r.EsP, dQ: r.dQ, closedOmega: om });
  }
  // (2) 拒否 2 条件
  const rNeg = allocate(Object.assign({}, base, { h: 0, dU: -11, dEself: -10.6 }));   // E_* = 0.29825 − 0.4 < 0
  const rNull = allocate(Object.assign({}, base, { h: 0, overflowTo: null }));      // Ω′ ≈ 21.75 > 20 で受け皿なし
  rows.push({ key: 'refuse-Estar<0', ok: rNeg.ok, why: rNeg.why, Estar: rNeg.Estar });
  rows.push({ key: 'refuse-overflow-null', ok: rNull.ok, why: rNull.why, omegaRaw: rNull.omegaRaw });
  // (3) 上限の受け皿 3 通り(同じ超過量・同じ Ω′=Ω_max)
  const sinks = ['heat', 'precession', 'eject'].map((to) => {
    const r = allocate(Object.assign({}, base, { h: 0, overflowTo: to }));
    const Es = base.Kin + base.EsC, Ecap = 0.5 * base.I * 400;
    const e = Math.max(rel(r.overflow, Es - Ecap), rel(r.EsP, Ecap), rel(r.EsP + r.overflow + r.dQ, r.Estar));
    worst = Math.max(worst, e);
    return { key: 'sink-' + to, ok: r.ok, overflowTo: r.overflowTo, omega: r.omega, omegaRaw: r.omegaRaw, overflow: r.overflow, rel: e };
  });
  rows.push(...sinks);
  // (4) 符号未定(s=0)は h=1 —— 全部を熱へ
  const r0 = allocate(Object.assign({}, base, { h: 0, s: 0, EsC: 0 }));
  rows.push({ key: 'sign-undecided', ok: r0.ok, hEff: r0.hEff, omega: r0.omega, dQ: r0.dQ, Estar: r0.Estar });
  // (5) 往復(h=0・上限の内): 合体 → 同じ位置からの離散で K が戻る
  const I0 = inertia(25, 1.5), I1 = inertia(25.425, 1.5), U3a = -3.2, U3c = -3.25, Up = -2.1;
  const cap = allocate({ Kin: 0.9, EsC: 0.5 * I0 * 144, EsJ: 0, dU: Up + (U3a - U3c), dEself: Up, h: 0, I: I1, s: 1, omegaMax: 20, overflowTo: 'heat' });
  const ej = ejectInverse({ EsBefore: cap.EsP, Ubefore: U3c, EselfBefore: Up, Qbefore: 0, EsRemain: 0.5 * I0 * 144, EsEject: 0, Uafter: U3a + Up, EselfAfter: 0, Qafter: 0, m: 0.425 });
  const eRT = rel(ej.K, 0.9);
  worst = Math.max(worst, eRT);
  rows.push({ key: 'roundtrip-h0', ok: cap.ok && ej.ok, K: ej.K, Kin: 0.9, rel: eRT });
  const rNegEj = ejectInverse({ EsBefore: 1, Ubefore: 0, EselfBefore: 0, Qbefore: 5, EsRemain: 1, EsEject: 0, Uafter: 0.5, EselfAfter: 0, Qafter: 5, m: 1 });
  rows.push({ key: 'eject-K<0', ok: rNegEj.ok, why: rNegEj.why, K: rNegEj.K });
  const by = Object.fromEntries(rows.map((z) => [z.key, z]));
  const ok = worst <= 1e-12
    && by['closed-h0'].ok && by['closed-h1'].ok && by['closed-h1'].omega === 0 && by['closed-h0'].dQ === 0
    && !by['refuse-Estar<0'].ok && by['refuse-Estar<0'].why === 'Estar<0'
    && !by['refuse-overflow-null'].ok && by['refuse-overflow-null'].why === 'overflow-no-sink'
    && sinks.every((z) => z.ok && z.omega === 20 && z.overflow > 0)
    && by['sign-undecided'].ok && by['sign-undecided'].hEff === 1 && by['sign-undecided'].omega === 0
    && by['roundtrip-h0'].ok && !by['eject-K<0'].ok;
  return { version: FIXCAP_LIB_VERSION, ok, worstRel: worst, rows };
}
