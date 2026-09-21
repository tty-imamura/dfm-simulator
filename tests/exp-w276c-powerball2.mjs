// 第276便c: **パワーボール便2** —— 原仮定者の裁定(第66報)(3) を測れる形にした値表。
// **エンジン未接続**(`S._core` には 1 命令も足していない)。
//
// 裁定 (3) の要旨: 「ジャイロが回転している状態で、歳差運動で動く軸に対してトルクの抵抗を
//   感じる方向に軸を倒すと、ジャイロの回転が増し続けトルクが上昇し続ける(実物で誰でも再現可能)。
//   **重要視するのは『ジャイロの軸に対して与えたエネルギーが、ジャイロの加速に繋がる』経路の存在**。
//   アナロジーでは、経路の物理的証明が出来なくても**エネルギーが保存されれば許容する**。」
// → したがって本便の**採用条件は帳簿が閉じること**だけである。**実物の接触機構を証明したとは書かない。**
//
// 検証順(① → ⑥。前の段が通らないまま次へ行かない):
//   ① 無トルク・**負の対照**(第275便e R37 の再測 —— 垂直トルクは |S| を動かさない)
//   ② 向きの整列(時定数 |S|/Q・K 非依存)
//   ③ **受動散逸**(新 γ・τ_d=−γP_s g・Q̇=γ|P_s g|²≥0)—— 熱の減少步 0・E/J_z の閉じ・dt 2 段
//   ④ **有限移送チャネル**(口座 bank・η・枯渇・B<0 の拒否・「力を抜く」= 入力 0 で抵抗だけ)
//   ⑤ 閉じた連星(**旧散逸 vs 受動散逸**・分離・軸角・熱)+ 最小 L の停止条件
//   ⑥ **歳差ロックの位相**(ψ と共役運動量・U_lock=−K_lock cosψ・両側へ反作用)
//
// 使い方: node tests/exp-w276c-powerball2.mjs   → tests/out/powerball2-w276c.json
// 書かないこと: 「パワーボールの機構を証明した」「合体を再現した」「潮汐ロックを証明した」
//   「自転が無限に上がる」「エンジンに実装した」「新発見」。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as PB from './lib-w275e-powerball.mjs';
import * as AW from './lib-w276c-axiswork.mjs';
import { withProvenance } from './lib-w272e-provenance.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rel = (a, b) => Math.abs(a - b) / Math.max(1e-30, Math.abs(b));

/* ── ① 無トルクと負の対照(第275便e R37 の再測) ──────────────────────────── */
const psi0 = 60 * Math.PI / 180;
const S0 = [2 * Math.cos(psi0), 0, 2 * Math.sin(psi0)];
const baseSolo = { I0: 1, y0: [...S0, 0, 0, 0, 0, 0, 0, 0], dt: 2e-3, steps: 200000, samples: 24 };

const stage1 = [
  { id: 'noTorque', K: 0, Q: 0 },
  { id: 'gyroOnly', K: 1.5, Q: 0 },
  { id: 'gyroOnlyStrong', K: 15, Q: 0 },
].map((c) => {
  const r = PB.runSolo({ ...baseSolo, ...c });
  const rs = PB.runSolo({ ...baseSolo, ...c, dt: 2e-3, steps: 250, samples: 4 });
  const th0 = Math.atan2(S0[2], S0[1]), th1 = Math.atan2(rs.y[2], rs.y[1]);
  let dth = th1 - th0;
  while (dth > Math.PI) dth -= 2 * Math.PI;
  while (dth < -Math.PI) dth += 2 * Math.PI;
  const theory = -PB.precessionRate(c.K, r.first.a, r.first.Smag);
  return { id: c.id, K: c.K, Q: c.Q, t: r.t,
    spinRelDrift: rel(r.last.Smag, r.first.Smag),
    omegaFirst: r.first.omega, omegaLast: r.last.omega,
    psiFirstDeg: r.first.psiDeg, psiLastDeg: r.last.psiDeg,
    precMeasured: dth / rs.t, precTheory: theory,
    precRelDiff: (c.K === 0) ? null : rel(dth / rs.t, theory) };
});
// **受動散逸トルクも軸に直交している**(新しい枝でも負の対照が生きていることの生データ)
const axialProbe = [[0.3, 0.2, 0.9], [1, 0, 0], [0.1, -2, 0.5]].map((S) => {
  const p = PB.axialProjection(S, [1, 0, 0], 1.5, 0.8);
  const pv = PB.passiveBinaryTorque(S, [1, 0, 0], 1.5, 0.4, 0.7, 0.3);
  const pvMag = Math.hypot(pv.tau[0], pv.tau[1], pv.tau[2]);
  return { S, tauCdotS: p.tauCdotS, tauDdotS: p.tauDdotS,
    relC: p.tauCmag > 0 ? Math.abs(p.tauCdotS) / p.tauCmag : 0,
    relD: p.tauDmag > 0 ? Math.abs(p.tauDdotS) / p.tauDmag : 0,
    tauPassiveDotS: pv.sdot, relPassive: pvMag > 0 ? Math.abs(pv.sdot) / pvMag : 0,
    passiveHeatRate: pv.heat };
});

/* ── ② 向きの整列(時定数) ───────────────────────────────────────────────── */
const alignRows = [];
for (const Q of [0.2, 0.5, 1.0]) for (const K of [1.5, 15]) {
  const psi = 5 * Math.PI / 180, Sm = 2;
  const y0 = [Sm * Math.cos(psi), 0, Sm * Math.sin(psi), 0, 0, 0, 0, 0, 0, 0];
  const r = PB.runSolo({ ...baseSolo, id: `align_K${K}_Q${Q}`, K, Q, y0, dt: 2e-3, steps: 5000, samples: 20 });
  const p0 = r.first.psiDeg, p1 = r.last.psiDeg;
  const tauMeas = (p1 > 0 && p1 < p0) ? r.t / Math.log(p0 / p1) : Infinity;
  alignRows.push({ K, Q, t: r.t, psi0Deg: p0, psiEndDeg: p1,
    tauMeasured: tauMeas, tauTheory: PB.alignTimeConstant(2, Q),
    tauRelDiff: rel(tauMeas, PB.alignTimeConstant(2, Q)),
    spinRelDrift: rel(r.last.Smag, r.first.Smag) });
}

/* ── ③ 受動散逸(熱が構造的に非負・E/J_z の閉じ・dt 2 段) ───────────────── */
function passCase(o) {
  const P = { id: o.id, G: 1, m1: 1, m2: 1, I: [0.4, 0.4], K: o.K, gamma: o.gamma,
    dt: o.dt, steps: o.steps, samples: 20 };
  if (o.minOrbitalL !== undefined) P.minOrbitalL = o.minOrbitalL;
  const mk = (psi, ph) => [o.Smag * Math.cos(psi), o.Smag * Math.sin(psi) * Math.cos(ph),
    o.Smag * Math.sin(psi) * Math.sin(ph)];
  P.y0 = [...mk(o.psi1, o.ph1), ...mk(o.psi2, o.ph2), o.L0, 0, 0];
  const r = PB.runPassiveBinary(P);
  return { id: o.id, dt: o.dt, steps: o.steps, t: r.t, K: o.K, gamma: o.gamma, L0: o.L0,
    minOrbitalL: o.minOrbitalL === undefined ? null : o.minOrbitalL,
    LorbLast: r.last.Lorb, OmegaFirst: r.first.Omega, OmegaLast: r.last.Omega,
    Efirst: r.first.E, Elast: r.last.E,
    omega1First: r.first.bodies[0].omega, omega1Last: r.last.bodies[0].omega,
    psi1FirstDeg: r.first.bodies[0].psiDeg, psi1LastDeg: r.last.bodies[0].psiDeg,
    psi2FirstDeg: r.first.bodies[1].psiDeg, psi2LastDeg: r.last.bodies[1].psiDeg,
    a1Last: r.last.bodies[0].a, a2Last: r.last.bodies[1].a,
    alignGap1Deg: Math.min(r.last.bodies[0].psiDeg, 180 - r.last.bodies[0].psiDeg),
    alignGap2Deg: Math.min(r.last.bodies[1].psiDeg, 180 - r.last.bodies[1].psiDeg),
    sep0: r.first.sep, sepLast: r.last.sep, dLorb: r.last.Lorb - r.first.Lorb,
    worstJzRel: r.worstJzRel, worstErel: r.worstErel, worstSpinRel: r.worstSpinRel,
    heat: r.last.heat, heatDrops: r.heatDrops, heatSteps: r.heatSteps,
    heatWorstDrop: r.heatWorstDrop, stopped: r.stopped };
}
const passBase = { K: [0.5, 0.5], gamma: [0.05, 0.05], Smag: 0.4, L0: 0.5,
  psi1: 1.0, ph1: 0.0, psi2: 2.0, ph2: 1.1 };
// **宣言した最小 L で止める**(模型が外挿になる手前で走行を終える —— 合体・捕捉の判定ではない)。
const LMIN = 0.25;
const stage3 = [
  passCase({ ...passBase, id: 'γ=0.05 dt=1e-4(L≥0.25)', dt: 1e-4, steps: 400000, minOrbitalL: LMIN }),
  passCase({ ...passBase, id: 'γ=0.05 dt=5e-5(dt 2 段目)', dt: 5e-5, steps: 800000, minOrbitalL: LMIN }),
  passCase({ ...passBase, id: 'γ=0.2 dt=5e-5(L≥0.25)', gamma: [0.2, 0.2], dt: 5e-5, steps: 800000, minOrbitalL: LMIN }),
  passCase({ ...passBase, id: 'γ=0(負の対照)', gamma: [0, 0], dt: 1e-4, steps: 400000, minOrbitalL: LMIN }),
  // **否定結果**: 下限を宣言しないと L は 0 を跨いで模型の外へ出る(合体ではない)
  passCase({ ...passBase, id: '下限なし(**否定結果**・外挿)', dt: 1e-4, steps: 400000 }),
];
// dt 2 段の収束(どちらも同じ L=0.25 で止まるので、止まった時刻と熱を比べる)
const dtPair = { a: stage3[0].id, b: stage3[1].id,
  tStopA: stage3[0].t, tStopB: stage3[1].t, tStopRelDiff: rel(stage3[1].t, stage3[0].t),
  heatA: stage3[0].heat, heatB: stage3[1].heat, heatRelDiff: rel(stage3[1].heat, stage3[0].heat),
  gapRelDiff: rel(stage3[1].alignGap1Deg, stage3[0].alignGap1Deg),
  sepRelDiff: rel(stage3[1].sepLast, stage3[0].sepLast),
  ErelDiff: rel(stage3[1].worstErel, stage3[0].worstErel) };

/* ── ④ 有限移送チャネル(口座・η・枯渇・B<0・「力を抜く」) ───────────────── */
function awCase(o) {
  const st = AW.makeAxisState(o.state || {});
  const r = AW.runAxisWork({ id: o.id, state: st, dt: o.dt, steps: o.steps, samples: 20,
    eta: o.eta, workRate: o.workRate, requestRate: o.requestRate, brakeRate: o.brakeRate });
  return { id: o.id, eta: o.eta === undefined ? 1 : o.eta, dt: o.dt, steps: o.steps,
    omegaFirst: r.first.omega, omegaLast: r.last.omega, omegaPeak: r.omegaPeak,
    SmagFirst: r.first.Smag, SmagLast: r.last.Smag,
    bankFirst: r.first.bank, bankLast: r.last.bank,
    WinLast: r.last.Win, WdrawnLast: r.last.Wdrawn, heatLast: r.last.heat,
    EspinFirst: r.first.Espin, EspinLast: r.last.Espin,
    ErotorFirst: r.first.Erotor, ErotorLast: r.last.Erotor,
    dEmech: (r.last.Espin + r.last.Erotor) - (r.first.Espin + r.first.Erotor),
    ledgerWorstAbs: r.worstLedgerAbs, ledgerWorstRel: r.worstLedgerRel,
    axialJWorstAbs: r.worstAxialJAbs, JtotFirst: r.first.Jtot, JtotLast: r.last.Jtot,
    heatDrops: r.heatDrops, bankNegSteps: r.bankNegSteps,
    transfers: r.last.transfers, refusals: r.last.refusals, brakes: r.last.brakes,
    depletedAt: r.depletedAt, omegaAtDepletion: r.omegaAtDepletion,
    lastRefuseReason: r.lastRefuseReason, clippedReturn: r.clippedReturn };
}
const TOFF = 20;                       // ここで手を止める(入力 0)
const stage4 = [
  // (a) **負の対照**: 入力 0。要求だけ出しても 1 も加速しない
  awCase({ id: 'W=0(負の対照・要求だけ)', dt: 1e-3, steps: 60000, eta: 1,
    workRate: () => 0, requestRate: () => 0.5 }),
  // (b) 有限の口座: t<20 だけ手が仕事をし、そのあとは止める(**無限電源にしない**)
  awCase({ id: '有限移送 η=1(t<20 だけ入力)', dt: 1e-3, steps: 60000, eta: 1,
    workRate: (t) => (t < TOFF ? 0.5 : 0), requestRate: () => 0.5 }),
  awCase({ id: '有限移送 η=0.5', dt: 1e-3, steps: 60000, eta: 0.5,
    workRate: (t) => (t < TOFF ? 0.5 : 0), requestRate: () => 0.5 }),
  awCase({ id: '有限移送 η=0(全部熱)', dt: 1e-3, steps: 60000, eta: 0,
    workRate: (t) => (t < TOFF ? 0.5 : 0), requestRate: () => 0.5 }),
  // (c) **「力を抜く」**: 入力 0 + 抵抗だけ(**負の drive を手入力しない**)
  awCase({ id: '力を抜く(入力 0・抵抗だけ)', dt: 1e-3, steps: 60000, eta: 1,
    state: { Smag: 4 }, workRate: () => 0, requestRate: () => 0, brakeRate: () => 0.05 }),
  // (d) 入力 → 力を抜く の連結(加速したあとに抵抗だけを残す)
  awCase({ id: '入力→力を抜く', dt: 1e-3, steps: 60000, eta: 1,
    workRate: (t) => (t < TOFF ? 0.5 : 0), requestRate: () => 0.5,
    brakeRate: (t) => (t < TOFF ? 0 : 0.05) }),
  // (e) **B<0 の拒否**(受動交換の枝 —— 仕事駆動では通さない)
  awCase({ id: 'B<0(拒否される枝)', dt: 1e-3, steps: 2000, eta: 1,
    state: { Smag: 1, JaPar: 5, I: 1, Ia: 1 }, workRate: () => 1, requestRate: () => 0.5 }),
];
// 2 次式そのものの検算(解いた δ が ΔE=ηW を満たすか)
const solveProbe = [
  { Smag: 2, JaPar: 0, I: 1, Ia: 1, e: 0.7 },
  { Smag: 0.5, JaPar: -3, I: 0.4, Ia: 2.5, e: 12 },
  { Smag: 3, JaPar: 1, I: 1, Ia: 1, e: 0.1 },
  { Smag: 1, JaPar: 5, I: 1, Ia: 1, e: 0.1 },
].map((c) => {
  const st = AW.makeAxisState(c);
  const s = AW.solveDelta(st, c.e);
  return { ...c, A: s.A, B: s.B, ok: s.ok, reason: s.reason, delta: s.delta,
    dE: s.ok ? AW.deltaEnergy(st, s.delta) : null,
    dEerrAbs: s.ok && s.delta > 0 ? Math.abs(AW.deltaEnergy(st, s.delta) - c.e) : null };
});

/* ── ⑤ 閉じた連星(旧散逸 vs 受動散逸)+ 最小 L の停止条件 ─────────────── */
function oldCase(o) {
  const P = { id: o.id, G: 1, m1: 1, m2: 1, I: [0.4, 0.4], K: o.K, Q: o.Q,
    dt: o.dt, steps: o.steps, samples: 20 };
  const mk = (psi, ph) => [o.Smag * Math.cos(psi), o.Smag * Math.sin(psi) * Math.cos(ph),
    o.Smag * Math.sin(psi) * Math.sin(ph)];
  P.y0 = [...mk(o.psi1, o.ph1), ...mk(o.psi2, o.ph2), o.L0, 0, 0];
  const r = PB.runBinary(P);
  return { id: o.id, model: '旧(第275便e)', dt: o.dt, t: r.t,
    alignGap1Deg: Math.min(r.last.bodies[0].psiDeg, 180 - r.last.bodies[0].psiDeg),
    alignGap2Deg: Math.min(r.last.bodies[1].psiDeg, 180 - r.last.bodies[1].psiDeg),
    sep0: r.first.sep, sepLast: r.last.sep, dLorb: r.last.Lorb - r.first.Lorb,
    LorbLast: r.last.Lorb, worstJzRel: r.worstJzRel, worstErel: r.worstErel,
    heat: r.last.heat, heatDrops: r.heatDrops, heatSteps: r.heatSteps };
}
const stage5 = [
  oldCase({ ...passBase, id: '旧散逸 Q=0.05', Q: [0.05, 0.05], dt: 1e-3, steps: 200000 }),
  oldCase({ ...passBase, id: '旧散逸 Q=0.4', Q: [0.4, 0.4], dt: 1e-3, steps: 200000 }),
  { ...stage3[0], model: '新(受動散逸)' },
  { ...stage3[2], model: '新(受動散逸)' },
];
// 最小 L の停止条件(**合体・捕捉の判定ではない**)—— 下限を変えると止まる場所だけが動く
const stopRows = [0.45, 0.35, 0.25].map((L) => {
  const r = passCase({ ...passBase, id: `minOrbitalL=${L}`, dt: 1e-4, steps: 400000, minOrbitalL: L });
  return { minOrbitalL: L, tStop: r.t, LorbLast: r.LorbLast, sepLast: r.sepLast,
    OmegaLast: r.OmegaLast, alignGap1Deg: r.alignGap1Deg, heat: r.heat,
    worstErel: r.worstErel, worstJzRel: r.worstJzRel, stopped: r.stopped };
});
const stopRow = stopRows[0];

/* ── ⑥ 歳差ロックの位相(H4) ─────────────────────────────────────────────── */
function lockCase(o) {
  const st = AW.makeAxisState({ Smag: 2, I: 1, Ia: 1 });
  const r = AW.runLock({ id: o.id, Ip: 1, Id: 1, Klock: o.Klock, tauAmp: o.tauAmp,
    dt: 1e-3, steps: o.steps, samples: 20, z0: [0, o.pP, 0, o.pD],
    stopSupplyAt: o.stopSupplyAt,
    axis: { state: st, eta: 1, requestRate: o.requestRate } });
  return { id: o.id, Klock: o.Klock, pP: o.pP, pD: o.pD, tauAmp: o.tauAmp, t: r.t,
    detune0: r.first.detune, omegaP0: r.first.omegaP,
    circulations: r.circulations, psiSpanDeg: r.psiSpanDeg, cosPsiMean: r.cosPsiMean,
    locked: r.circulations === 0,
    worstElockAbs: r.worstElockAbs, worstPsumAbs: r.worstPsumAbs,
    bankLast: r.bank, Win: r.Win, Wraw: r.Wraw, clippedReturn: r.clippedReturn,
    omegaSpinFirst: 2, omegaSpinLast: r.omegaLast,
    dOmegaSpin: r.omegaLast - 2, ledgerC: r.ledgerC, ledgerDriftAbs: r.ledgerDriftAbs,
    supplyOffCirc: r.supplyOffCirc, supplyOffPsiSpanDeg: r.supplyOffPsiSpanDeg,
    stopSupplyAt: o.stopSupplyAt === undefined ? null : o.stopSupplyAt };
}
// **同じ離調・同じ ω_P** のまま K_lock だけを変える(ロックの有無だけが違う対照)。
// 要求率は口座の伸びより大きく取る(**口座が律速**になるようにして、位相の違いを ω に出す)。
const LOCKCOMMON = { pP: 1.15, pD: 0.85, tauAmp: 0.05, requestRate: 0.1, steps: 200000 };
const stage6 = [
  lockCase({ ...LOCKCOMMON, id: 'ロック(K_lock=0.5)', Klock: 0.5 }),
  lockCase({ ...LOCKCOMMON, id: '非ロック(K_lock=0.002)', Klock: 0.002 }),
  lockCase({ ...LOCKCOMMON, id: '非ロック(離調 3.0)', Klock: 0.5, pP: 2.5, pD: -0.5 }),
  lockCase({ ...LOCKCOMMON, id: 'ロック → 供給停止(t=20)', Klock: 0.5, stopSupplyAt: 20 }),
];

/* ── 仮説 H1〜H7 の対応づけ(Failure First・第275便e からの更新) ─────────── */
const g1 = stage1.find((z) => z.id === 'gyroOnly');
const g1s = stage1.find((z) => z.id === 'gyroOnlyStrong');
const a1 = alignRows[0];
const w0 = stage4.find((z) => /W=0/.test(z.id));
const w1 = stage4.find((z) => /η=1/.test(z.id));
const wHalf = stage4.find((z) => /η=0\.5/.test(z.id));
const wRel = stage4.find((z) => /入力→力を抜く/.test(z.id));
const pNew = stage3[0], pOld = stage5[0];
const lk = stage6[0], nlk = stage6[1], lkOff = stage6[3];
const verdict = [
  { id: 'H1', claim: 'ジャイロ速度で歳差が始まる', inModel: '成り立つ(第275便e と同じ)',
    evidence: `保存トルクだけで歳差率 実測 ${g1.precMeasured.toExponential(6)} / 理論 −Ka/|S| `
      + `${g1.precTheory.toExponential(6)}(相対差 ${g1.precRelDiff.toExponential(2)})` },
  { id: 'H2', claim: '軸に与えたエネルギーが自転の加速に繋がる(力を抜くと減速)',
    inModel: '**有限の口座を宣言すれば模型の中で閉じる**(実物の接触機構の証明ではない)',
    evidence: `垂直トルクだけでは依然 |S| は動かない(${g1.spinRelDrift.toExponential(2)} / `
      + `K=15 で ${g1s.spinRelDrift.toExponential(2)})。有限移送では ω ${w1.omegaFirst.toFixed(6)}→`
      + `${w1.omegaLast.toFixed(6)}(口座 ${w1.bankLast.toExponential(2)} で枯渇・t=${w1.depletedAt}）・`
      + `**入力 0 では ${w0.omegaFirst.toFixed(6)}→${w0.omegaLast.toFixed(6)}(不変)**・`
      + `「力を抜く」(抵抗だけ)で ${wRel.omegaPeak.toFixed(6)}→${wRel.omegaLast.toFixed(6)} へ減速。`
      + `帳簿の最悪漂い ${Math.max(...stage4.map((z) => z.ledgerWorstAbs)).toExponential(2)}・`
      + `全角運動量の最悪漂い ${Math.max(...stage4.map((z) => z.axialJWorstAbs)).toExponential(2)}` },
  { id: 'H3', claim: '潮汐の引き伸ばしが軸を傾け自転を加速する', inModel: '**半分だけ**(第275便e から変わらない)',
    evidence: `散逸は軸を動かす(ψ ${a1.psi0Deg.toFixed(4)}°→${a1.psiEndDeg.toFixed(4)}°)が |S| は `
      + `${a1.spinRelDrift.toExponential(2)} しか動かない。**傾きから自転への経路は、④ の口座を`
      + `経由して初めて繋がる**(潮汐から口座へ入る規則は未導出 —— 決断事項候補)` },
  { id: 'H4', claim: '歳差がロックするとさらに加速する',
    inModel: '**供給 W_raw の水準では成り立つ**(導出ではない・ω の差は N3 の整流を含むので'
      + '「ロックすると ω が上がる」とまでは言えない)',
    evidence: `同じ離調・同じ ω_P で K_lock だけを変えると、ロック側(循環 ${lk.circulations} 回・`
      + `秤動幅 ${lk.psiSpanDeg.toFixed(3)}°・cosψ 平均 ${lk.cosPsiMean.toFixed(6)})は `
      + `生の位相仕事 W_raw=${lk.Wraw.toFixed(6)} が入り ω が ${lk.omegaSpinLast.toFixed(6)} まで伸びるのに対し、`
      + `非ロック側(循環 ${nlk.circulations} 回・cosψ 平均 ${nlk.cosPsiMean.toExponential(2)})は `
      + `W_raw=${nlk.Wraw.toExponential(3)}・ω=${nlk.omegaSpinLast.toFixed(6)}。`
      + `**供給を止めるとロックは残るが(循環 ${lkOff.supplyOffCirc} 回・秤動幅 `
      + `${lkOff.supplyOffPsiSpanDeg === null ? '—' : lkOff.supplyOffPsiSpanDeg.toFixed(3)}°)加速は止まる**`
      + `(ω ${lkOff.omegaSpinLast.toFixed(6)})。p_P+p_D の漂い ${lk.worstPsumAbs.toExponential(2)}。`
      + `**ただし N3 の但し書きを読むこと**` },
  { id: 'H5', claim: '究極は互いに軸を向ける', inModel: '**途中まで**(受動散逸でも残差が残る)',
    evidence: `受動散逸(γ=0.05)で連結線とのずれは ${pNew.alignGap1Deg.toFixed(3)}° / `
      + `${pNew.alignGap2Deg.toFixed(3)}°(旧散逸 Q=0.05 では ${pOld.alignGap1Deg.toFixed(3)}°)。`
      + `**残差が残ること自体は変わらない** —— r̂ が公転で回り続けるためである` },
  { id: 'H6', claim: '軸の傾きで潮汐が弱まり NS 連星では途中で安定する', inModel: '**未導出**(変わらず)',
    evidence: 'K・γ は傾きに依らない宣言定数のままで、「傾きで潮汐が弱まる」帰還路は入っていない' },
  { id: 'H7', claim: '互いに軸を向けた状態が BH 連星で、遠心力を失って合体する',
    inModel: '**出ない**(「軸を向けて合体」は本便でも出ていない)',
    evidence: `受動散逸でも分離は ${pNew.sep0.toFixed(6)}→${pNew.sepLast.toFixed(6)}`
      + `(ΔL_orb=${pNew.dLorb.toExponential(3)})で、**縮んで合体する走行は 0 本**である。`
      + `宣言した最小 L の停止条件(${stopRow.stopped ? '発動' : '未発動'})は`
      + `**外挿の手前で止めるための宣言**であって、捕捉・地平面・合体の判定ではない` },
  { id: 'N1', claim: '(第275便e の否定結果)向きの散逸は公転が回る系で熱の単調増加を保証しない',
    inModel: '**受動散逸で解消した**(旧模型の否定結果はそのまま残す)',
    evidence: `旧 τ_d(配置だけの関数): 熱の減少步 ${pOld.heatDrops}/${pOld.heatSteps}。`
      + `新 τ_d=−γP_s g(Q̇=γ|P_s g|²): **${pNew.heatDrops}/${pNew.heatSteps}**(dt 半分でも `
      + `${stage3[1].heatDrops}/${stage3[1].heatSteps}・γ=0.4 で ${stage3[2].heatDrops}/${stage3[2].heatSteps})。`
      + `E の最悪相対漂い ${pNew.worstErel.toExponential(2)}・J_z ${pNew.worstJzRel.toExponential(2)}` },
  { id: 'N2', claim: '(否定結果)軸へ与えた仕事が自転へ移る経路は**導出ではなく宣言**である',
    inModel: '**宣言**',
    evidence: 'η(機械的交換の割合)・要求率・反作用ローターの慣性 I_a は宣言した自由パラメータで、'
      + '実物の接触機構から導いた値は 1 つも無い。採用条件は**帳簿が閉じること**だけである'
      + `(閉じの最悪漂い ${Math.max(...stage4.map((z) => z.ledgerWorstAbs)).toExponential(2)})。`
      + '**B<0(ローターが自転より速い)では仕事駆動の移送を拒否する**('
      + `${(stage4.find((z) => /B<0/.test(z.id)) || {}).refusals} 回拒否・`
      + `理由「${(stage4.find((z) => /B<0/.test(z.id)) || {}).lastRefuseReason}」)` },
  { id: 'N3', claim: '(否定結果)**口座を非負に保つだけでラチェットが立つ** —— 非ロックでも自転が伸びる',
    inModel: '**未解決**(⑥ の ω の差は位相の揃いだけでは説明できない)',
    evidence: `非ロック側の**生の位相仕事**は負である(K_lock=0.002 で W_raw=${nlk.Wraw.toFixed(6)}・`
      + `離調 3.0 で ${stage6[2].Wraw.toFixed(6)})のに、口座が負にならないよう逆流を頭打ちにした結果 `
      + `W_in=${nlk.Win.toFixed(6)}(頭打ち ${nlk.clippedReturn.toFixed(6)})が入り、ω が `
      + `${nlk.omegaSpinLast.toFixed(6)} まで伸びる。**ロック側は頭打ちが `
      + `${lk.clippedReturn.toFixed(6)} で、W_raw=${lk.Wraw.toFixed(6)} がそのまま口座になる**。`
      + `したがって「ロックすると加速する」は**供給 W_raw の水準では言えるが、ω の差の一部は`
      + `口座の下限による整流の産物**である。口座に負を許すか(手がエネルギーを引き取れるか)は`
      + `**決断事項候補**であって、本便では決めていない` },
];

/* ── 正本 JSON ────────────────────────────────────────────────────────────── */
const out = {
  meta: withProvenance({
    note: '第276便c — 軸への仕事→自転の**有限移送チャネル**・**熱非負の受動散逸**・'
      + '**歳差ロックの位相**。**エンジン未接続**。',
    premise: AW.AXISWORK_PREMISE,
    hypothesis: PB.POWERBALL_HYPOTHESIS,
    doNotWrite: ['パワーボールの機構を証明した', '実物の接触機構を再現した', '合体を再現した',
      '潮汐ロックを証明した', '自転が無限に上がる', 'エンジンに実装した', '新発見'],
    caveat: 'η・γ・K・K_lock・要求率・I_a は**宣言された自由パラメータ**である。'
      + '観測から同定した値は 1 つも無い。採用条件は**帳簿が閉じること**だけである。',
  }, {
    root: ROOT, wave: '第276便c', target: 'tests/lib-w276c-axiswork.mjs',
    code: ['tests/exp-w276c-powerball2.mjs', 'tests/lib-w276c-axiswork.mjs',
      'tests/lib-w275e-powerball.mjs', 'tests/lib-w272e-provenance.mjs'],
    inputs: ['tests/lib-w276c-axiswork.mjs', 'tests/lib-w275e-powerball.mjs'],
  }),
  stage1: { rows: stage1, axialProbe,
    note: '**負の対照**(R37)は生きている: 保存・旧散逸・**新しい受動散逸**のどれも τ·ŝ=0' },
  stage2: { rows: alignRows, note: '整列の時定数は線形域で |S|/Q・**K に依らない**' },
  stage3: { rows: stage3, dtPair,
    note: '**受動散逸** τ_d=−γP_s g・Q̇=γ|P_s g|²≥0。熱の減少步は 0 でなければならない' },
  stage4: { rows: stage4, solveProbe,
    note: '**有限移送チャネル**。C=E_spin+E_rotor+Heat+bank−W_in が一定・S+J_a·ŝ が保存・'
      + '**入力 0 なら加速しない**・口座が尽きれば止まる' },
  stage5: { rows: stage5, stopRow, stopRows,
    note: '旧散逸 vs 受動散逸。**「軸を向けて合体」は本便でも出ていない**' },
  stage6: { rows: stage6,
    note: '**歳差ロック**: ψ と共役運動量・U_lock=−K_lock cosψ・両側へ反作用。'
      + 'ロックの判定は循環回数と秤動幅で行う(ロック位相へ毎歩上書きしない)' },
  verdict,
};
const dir = path.join(ROOT, 'tests', 'out');
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'powerball2-w276c.json'), JSON.stringify(out, null, 1));

const e = (x) => (x === null || x === undefined ? '—' : Number(x).toExponential(3));
const f = (x, d) => (x === null || x === undefined ? '—' : Number(x).toFixed(d === undefined ? 6 : d));
console.log('# 第276便c — パワーボール便2(**裁定 (3) の経路を有限の口座として置く**・エンジン未接続)');
console.log('① 無トルクと**負の対照**(垂直トルクは自転を加速しない — R37 は生きている):');
for (const r of stage1) console.log(`   ${r.id.padEnd(16)} K=${r.K} / |S| 漂い ${e(r.spinRelDrift)}`
  + ` / ω ${f(r.omegaFirst)}→${f(r.omegaLast)} / 歳差 ${e(r.precMeasured)} vs ${e(r.precTheory)}`);
console.log('   τ·ŝ/|τ|: ' + axialProbe.map((p) => `保存 ${e(p.relC)}・旧散逸 ${e(p.relD)}・**受動 ${e(p.relPassive)}**`).join(' / '));
console.log('② 整列の時定数(|S|/Q・K 非依存):');
for (const r of alignRows) console.log(`   K=${String(r.K).padStart(4)} Q=${r.Q} / 実測 ${f(r.tauMeasured)} vs 理論 ${f(r.tauTheory)}`);
console.log('③ **受動散逸**(熱の減少步が 0 か):');
for (const r of stage3) console.log(`   ${r.id.padEnd(30)} t=${f(r.t, 4)} L ${f(r.L0, 4)}→${f(r.LorbLast, 4)}`
  + ` 熱 ${f(r.heat)} / **減少步 ${r.heatDrops}/${r.heatSteps}**`
  + ` / E 漂い ${e(r.worstErel)} / J_z 漂い ${e(r.worstJzRel)} / |S| 漂い ${e(r.worstSpinRel[0])}`
  + ` / ずれ ${f(r.alignGap1Deg, 3)}° / 停止 ${r.stopped ? r.stopped.reason : 'なし'}`);
console.log(`   dt 2 段の収束: t_stop ${e(dtPair.tStopRelDiff)} / 熱 ${e(dtPair.heatRelDiff)}`
  + ` / ずれ ${e(dtPair.gapRelDiff)} / 分離 ${e(dtPair.sepRelDiff)}`);
console.log('④ **有限移送チャネル**(口座 → 自転・反作用ローター・熱):');
for (const r of stage4) console.log(`   ${r.id.padEnd(26)} η=${r.eta} ω ${f(r.omegaFirst)}→${f(r.omegaLast)}`
  + ` / 口座 ${f(r.bankLast)} (W_in ${f(r.WinLast)}・引出 ${f(r.WdrawnLast)}) / 熱 ${f(r.heatLast)}`
  + ` / **閉じ ${e(r.ledgerWorstAbs)}** / ΣJ 漂い ${e(r.axialJWorstAbs)} / 枯渇 t=${r.depletedAt}`
  + ` / 移送 ${r.transfers}・拒否 ${r.refusals}・制動 ${r.brakes}`);
console.log('⑤ 閉じた連星(旧 vs 新):');
for (const r of stage5) console.log(`   ${String(r.id).padEnd(30)} ${r.model} ずれ ${f(r.alignGap1Deg, 3)}°`
  + ` / 分離 ${f(r.sep0)}→${f(r.sepLast)} / ΔL_orb ${e(r.dLorb)} / 熱 ${f(r.heat)}`
  + ` / 減少步 ${r.heatDrops}/${r.heatSteps}`);
console.log('   最小 L の停止条件(**合体・捕捉の判定ではない**):');
for (const r of stopRows) console.log(`     L_min=${r.minOrbitalL} → t=${f(r.tStop, 4)}・L=${f(r.LorbLast, 6)}`
  + `・分離 ${f(r.sepLast)}・Ω ${f(r.OmegaLast, 4)}・ずれ ${f(r.alignGap1Deg, 3)}°・熱 ${f(r.heat)}`
  + `・E 漂い ${e(r.worstErel)}`);
console.log('⑥ **歳差ロックの位相**:');
for (const r of stage6) console.log(`   ${r.id.padEnd(26)} K_lock=${r.Klock} 離調 ${f(r.detune0, 4)}`
  + ` / 循環 ${r.circulations} 回・秤動幅 ${f(r.psiSpanDeg, 3)}°・cosψ 平均 ${f(r.cosPsiMean)}`
  + ` / **生の位相仕事 W_raw ${f(r.Wraw)}**(口座 W_in ${f(r.Win)}・逆流頭打ち ${f(r.clippedReturn)})`
  + ` → ω ${f(r.omegaSpinFirst)}→${f(r.omegaSpinLast)}`
  + ` / E_lock 漂い ${e(r.worstElockAbs)} / p 和 ${e(r.worstPsumAbs)} / 帳簿 ${e(r.ledgerDriftAbs)}`);
console.log('仮説の対応づけ(Failure First):');
for (const v of verdict) console.log(`   ${v.id} ${v.claim} → ${v.inModel}`);
console.log('→ tests/out/powerball2-w276c.json');
