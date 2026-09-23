// 第278便c(統括の検証項目 R55 の H6・AM15 —— **導出できた範囲だけ**):
// **内部モードの共役変数模型**で、潮汐の手との交換をエネルギーと角力積の両方で記帳し、
// **公転平均トルク・平均仕事の θ 依存が sin2θ だけか**を測る器。
//
// 段:
//   ① トルクの式 τ_k = tr(G_k[Q,F]) を**有限回転の差分**で検算する
//   ② 導出した閉形式(遅れの小さい極限)と、線形定常応答の数値解(9×9 複素)の一致 —— ω_m を上げて収束
//   ③ 時間領域(RK4)と周波数領域の平均トルクの一致(同じ宣言値)
//   ④ **θ 依存の係数表**(正弦級数 b_k・多項式 sinθ Σ c_j cos^jθ・g=T/sin2θ の傾き・零点と安定性)
//   ⑤ **歳差位相との結合**: 与えた歳差 Ω_p で T(θ) がどう変わるか(周波数領域 + 時間領域 1 点)
//   ⑥ **帳簿**(時間領域・自転は動的・有限容量あり・途中で供給停止): E と J の閉じ・熱の単調・
//      dE_orb = n dL_orb,z の恒等式・供給停止の仕事
//   ⑦ **有限容量**が θ 依存を変えるか(時間領域・自転固定)
//   ⑧ **摂動復帰**(θ*±5° の 2 本)と、平均化した永年方程式との突き合わせ
//   ⑨ **供給停止**: 停止後に θ が動かないこと・モードの角運動量が自転へ渡ること
//   ⑩ **別系への予測の形**(J0737 A/B・J1757・J1946 の ω/n での零点)—— **検査できる未使用の観測量の有無**
//
// **較正ではない。観測角に合わせる係数探索はしない。**格子の θ の動きも本模型の θ の動きも
// **実在 NS の進化速度ではない**(not_a_prediction)。
// 使い方: node tests/exp-w278c-nsmode.mjs [--quick]   → tests/out/nsmode-w278c.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as NM from './lib-w278c-nsmode.mjs';
import { withProvenance } from './lib-w272e-provenance.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const QUICK = process.argv.includes('--quick');
const DEG = 180 / Math.PI, RAD = Math.PI / 180;
const rel = (a, b) => Math.abs(a - b) / Math.max(1e-300, Math.abs(b));
const t0 = Date.now();

/** 宣言値(**すべて宣言**)。n=1・μ=1・f=1(線形応答は f² で割り切れる)。 */
const DECL = {
  toy: { mu: 1, omegaM: 30, gamma: 3, f: 1, n: 1, omega: 3,
    note: '時間領域で回せる玩具値(ω/n=3 → 導出式の零点 cosθ*=2/3・θ*=48.19°)' },
  stepsPerOrbit: QUICK ? 600 : 1200,
  avgOrbits: QUICK ? 10 : 20, warmOrbits: 10,
  nsOmegaMOverOmega: 30, nsGammaOverOmegaM: 1e-2,
  precRates: [0, 0.01, 0.05, 0.1],
  capacity: { EcapFactor: 0.25, gammaSatFactor: 10 },
  recovery: { dThetaDeg: 5, orbits: QUICK ? 60 : 150, IsFactor: 3.9e-3 },
};
const toy = DECL.toy;
const dt = 2 * Math.PI / DECL.stepsPerOrbit;

/* ══ ① トルクの式の検算 ══════════════════════════════════════════════════════ */
const stage1 = (() => {
  const Q = [0.3, 0.1, -0.2, 0.1, -0.5, 0.4, -0.2, 0.4, 0.2];
  const F = NM.tideTensor(0.7, 0.4);
  const U = (X) => -NM.mat.dot(X, F);
  const rows = [0, 1, 2].map((k) => {
    const e = [0, 0, 0]; e[k] = 1; const h = 1e-6;
    const R = NM.rotMat(e, h), Rm = NM.rotMat(e, -h);
    const Qp = NM.mat.mul(NM.mat.mul(R, Q), NM.mat.transpose(R));
    const Qm = NM.mat.mul(NM.mat.mul(Rm, Q), NM.mat.transpose(Rm));
    const fd = -(U(Qp) - U(Qm)) / (2 * h), an = NM.torqueOf(Q, F)[k];
    return { axis: 'xyz'[k], finiteDiff: fd, formula: an, relDiff: rel(fd, an) };
  });
  return { rows, worstRel: Math.max(...rows.map((r) => r.relDiff)) };
})();

/* ══ ② 閉形式 vs 線形定常応答(ω_m を上げて収束) ═══════════════════════════ */
const stage2 = (() => {
  const rows = [];
  for (const wm of [30, 300, 3000]) {
    const p = { ...toy, omegaM: wm };
    let worstTh = 0, worstS = 0, worstHeat = 0, worstPsiRel = 0, worstClosure = 0;
    for (let d = 5; d <= 175; d += 5) {
      const s = NM.steadyState(p, d * RAD, { omega: toy.omega });
      const l = NM.lagLimit(p, d * RAD, { omega: toy.omega });
      const scale = Math.max(Math.abs(l.tauS), Math.abs(l.tauTheta));
      worstTh = Math.max(worstTh, Math.abs(s.local.theta - l.tauTheta) / scale);
      worstS = Math.max(worstS, Math.abs(s.local.s - l.tauS) / scale);
      worstPsiRel = Math.max(worstPsiRel, Math.abs(s.local.psi) / scale);
      worstHeat = Math.max(worstHeat, rel(s.heat, l.heat));
      worstClosure = Math.max(worstClosure, Math.abs(s.agentWork) / Math.max(1e-300, s.heat));
    }
    rows.push({ omegaM: wm, gamma: toy.gamma, K: NM.lagLimit(p, 1, { omega: toy.omega }).K,
      worstThetaRel: worstTh, worstSRel: worstS, worstPsiRel, worstHeatRel: worstHeat,
      worstClosureRel: worstClosure });
  }
  return { rows, note: '相対差は τ_s・τ_θ の大きい方で規格化。ω_m を 10 倍にすると差は ≈1/100 に縮む(遅れの補正は (ω/ω_m)² の次数)' };
})();

/* ══ ③ 時間領域 vs 周波数領域 ═════════════════════════════════════════════════ */
const stage3 = (() => {
  const rows = [];
  for (const d of [20, 48.19, 70, 120]) {
    const r = NM.runMode({ mode: { ...toy, Is: 1e9, spin: { theta: d * RAD, omega: toy.omega } }, dt,
      steps: (DECL.warmOrbits + DECL.avgOrbits) * DECL.stepsPerOrbit, avgFrom: DECL.warmOrbits * DECL.stepsPerOrbit,
      Escale: 1, Jscale: 1 });
    const s = NM.steadyState(toy, d * RAD, { omega: toy.omega });
    const sc = Math.max(Math.abs(s.local.s), Math.abs(s.local.theta));
    rows.push({ thetaDeg: d, td: r.avg.local, fd: s.local,
      relTheta: Math.abs(r.avg.local.theta - s.local.theta) / sc, relS: Math.abs(r.avg.local.s - s.local.s) / sc,
      relPsi: Math.abs(r.avg.local.psi - s.local.psi) / sc,
      tdHeat: r.avg.heat, fdHeat: s.heat, heatRel: rel(r.avg.heat, s.heat) });
  }
  return { rows, worst: Math.max(...rows.map((r) => Math.max(r.relTheta, r.relS, r.relPsi))),
    note: `自転は I_s=1e9 で事実上固定・${DECL.warmOrbits} 公転を捨てて ${DECL.avgOrbits} 公転を平均(台形則)` };
})();

/* ══ ④ θ 依存の係数表 ══════════════════════════════════════════════════════ */
function coefRow(label, T, extra) {
  const c = NM.thetaCoefficients(T, { samples: 720, kmax: 6 });
  return { label, ...extra, sineCoef: c.sineCoef, sineCoefRel: c.sineCoefRel, polyCoef: c.polyCoef,
    polyMaxResidualRel: c.polyMaxResidualRel, sin2OnlyMaxResidualRel: c.sin2OnlyMaxResidualRel,
    probes: c.probes, zeros: c.zeros };
}
const stage4 = (() => {
  const rows = [];
  // (a) 導出した閉形式
  rows.push(coefRow('導出式(遅れの小さい極限)ω/n=3', (t) => NM.lagLimit(toy, t, { omega: 3 }).tauTheta,
    { kind: 'closed-form', omegaOverN: 3, expectB1overB2: -4 / 3, K: NM.lagLimit(toy, 1, { omega: 3 }).K }));
  // (b) 線形定常応答(数値)
  const cfgs = [
    { omegaM: 30, gamma: 3, omega: 3 }, { omegaM: 300, gamma: 3, omega: 3 },
    { omegaM: 6, gamma: 3, omega: 3 }, { omegaM: 6, gamma: 0.3, omega: 3 },
    { omegaM: 30, gamma: 3, omega: 10 }, { omegaM: 30, gamma: 3, omega: 1.5 },
  ];
  for (const c of cfgs) {
    const p = { ...toy, omegaM: c.omegaM, gamma: c.gamma };
    rows.push(coefRow(`線形定常応答 ω/n=${c.omega}・ω_m=${c.omegaM}・γ=${c.gamma}`,
      (t) => NM.steadyState(p, t, { omega: c.omega }).local.theta,
      { kind: 'steady-state', omegaOverN: c.omega, omegaM: c.omegaM, gamma: c.gamma,
        expectB1overB2: -4 / c.omega, lagThetaStarDeg: NM.lagLimit(p, 1, { omega: c.omega }).thetaStarDeg }));
  }
  // (c) 対照: 摩擦 0(保存系)では公転平均の傾きトルクが 0
  const p0 = { ...toy, gamma: 0 };
  let worst0 = 0;
  for (let d = 5; d <= 175; d += 5) {
    const s = NM.steadyState(p0, d * RAD, { omega: 3 });
    worst0 = Math.max(worst0, Math.hypot(...s.tauSpin));
  }
  // (d) 対照: 格子(第277便c)の宣言した手 τ = C_t sin2θ(θ を減らす向き)
  const grid = coefRow('対照: 格子の宣言した手 −C_t sin2θ(C_t=1)', (t) => -Math.sin(2 * t), { kind: 'grid-hand' });
  return { rows, frictionless: { worstTorque: worst0, note: 'γ=0 では公転平均トルクは丸め以外 0(保存系は永年トルクを作らない)' },
    gridHand: grid };
})();

/* ══ ⑤ 歳差位相との結合 ═════════════════════════════════════════════════════ */
const stage5 = (() => {
  const rows = [];
  for (const wm of [30, 300]) {
    const p = { ...toy, omegaM: wm };
    const base = (t) => NM.steadyState(p, t, { omega: 3, precRate: 0 }).local.theta;
    for (const Op of DECL.precRates.filter((x) => x > 0)) {
      const dT = (t) => (NM.steadyState(p, t, { omega: 3, precRate: Op }).local.theta - base(t)) / Op;
      const c = NM.thetaCoefficients(dT, { samples: 360, kmax: 6 });
      const b = NM.thetaCoefficients(base, { samples: 360, kmax: 6 });
      let psiShift = 0, agent = 0;
      for (let d = 10; d <= 170; d += 20) {
        const s = NM.steadyState(p, d * RAD, { omega: 3, precRate: Op });
        const s0 = NM.steadyState(p, d * RAD, { omega: 3, precRate: 0 });
        psiShift = Math.max(psiShift, Math.abs(s.local.psi - s0.local.psi) / Math.max(1e-300, Math.abs(s0.local.theta) + Math.abs(s0.local.s)));
        agent = Math.max(agent, Math.abs(s.agentWork) / Math.max(1e-300, s.heat));
      }
      rows.push({ omegaM: wm, precRate: Op, dTdOmegaP_sineCoef: c.sineCoef,
        relToBaseB2: c.sineCoef.map((x) => x / Math.max(1e-300, Math.abs(b.sineCoef[1]))),
        baseZeroDeg: b.zeros.map((z) => z.thetaDeg),
        zeroDeg: NM.thetaCoefficients((t) => NM.steadyState(p, t, { omega: 3, precRate: Op }).local.theta,
          { samples: 360 }).zeros.map((z) => z.thetaDeg),
        psiShiftRel: psiShift, agentWorkOverHeat: agent });
    }
  }
  // 時間領域 1 点(与えた歳差・ω_m=30)
  const Op = 0.05, d = 40;
  const r = NM.runMode({ mode: { ...toy, Is: 1, kinematic: { precRate: Op }, spin: { theta: d * RAD, omega: 3 } },
    dt, steps: (DECL.warmOrbits + DECL.avgOrbits) * DECL.stepsPerOrbit, avgFrom: DECL.warmOrbits * DECL.stepsPerOrbit,
    Escale: 1, Jscale: 1 });
  const s = NM.steadyState(toy, d * RAD, { omega: 3, precRate: Op });
  const sc = Math.max(Math.abs(s.local.s), Math.abs(s.local.theta));
  return { rows, tdCheck: { precRate: Op, thetaDeg: d, td: r.avg.local, fd: s.local,
    relTheta: Math.abs(r.avg.local.theta - s.local.theta) / sc, relS: Math.abs(r.avg.local.s - s.local.s) / sc,
    relPsi: Math.abs(r.avg.local.psi - s.local.psi) / sc },
  note: '歳差は**与えた**(運動学的)。遅れの小さい極限では Δ = nẑ − ω が歳差座標で不変なので O(Ω_p) の新しい項は出ない。'
    + '有限の ω_m では (iσ+ad_P)² の慣性項から Ω_p/ω_m² の次数で出る' };
})();

/* ══ ⑥ 帳簿(動的自転・容量あり・途中で供給停止) ══════════════════════════════ */
const lin = NM.steadyState(toy, 40 * RAD, { omega: 3 });
const stage6 = (() => {
  // 線形の定常モードエネルギーの目安を時間領域から取る
  const probe = NM.runMode({ mode: { ...toy, Is: 1e9, spin: { theta: 40 * RAD, omega: 3 } }, dt,
    steps: 12 * DECL.stepsPerOrbit, avgFrom: 10 * DECL.stepsPerOrbit, Escale: 1, Jscale: 1 });
  const Emode = probe.last.Emode;
  const Ecap = DECL.capacity.EcapFactor * Emode;
  const Is = 0.01, orbits = 40, stopOrbit = 25;
  const one = (spo) => {
    const h = 2 * Math.PI / spo;
    const r = NM.runMode({ mode: { ...toy, Is, Ecap, gammaSat: DECL.capacity.gammaSatFactor * toy.gamma,
      spin: { theta: 40 * RAD, omega: 3 } }, dt: h, steps: orbits * spo, avgFrom: 0, stopAt: stopOrbit * spo,
    samples: 40, Escale: 0.5 * Is * 9, Jscale: Is * 3 });
    return { stepsPerOrbit: spo, worstErel: r.worstErel, worstJrel: r.worstJrel, worstStepErel: r.worstStepErel,
      worstStepJrel: r.worstStepJrel, worstOrbitIdentityRel: r.worstOrbitIdentityRel, heatDrops: r.heatDrops,
      heatFinal: r.last.heat, stopWork: r.stopWork, gEffMax: Math.max(...r.trace.map((x) => x.gEff)),
      thetaEndDeg: r.final.thetaDeg, omegaEnd: r.final.omega, JmodeEnd: Math.hypot(...r.last.Jmode),
      EmodeEnd: r.last.Emode };
  };
  const spo1 = QUICK ? 2400 : 4800;
  const a = one(spo1), b = one(2 * spo1);
  return { Is, Ecap, EmodeLinear: Emode, gammaSat: DECL.capacity.gammaSatFactor * toy.gamma,
    orbits, stopOrbit, scale: { E: '½I_sω₀²', J: 'I_sω₀' }, coarse: a, fine: b,
    ErelOrder: Math.log2(a.worstErel / Math.max(1e-300, b.worstErel)),
    JrelOrder: Math.log2(a.worstJrel / Math.max(1e-300, b.worstJrel)),
    ...b, note: '自転は動的・容量あり(γ_eff が最大 ' + b.gEffMax.toFixed(1) + ' まで上がる)・'
      + stopOrbit + ' 公転目で供給停止。刻みを半分にしたときの漂いの縮み方(次数)も出す' };
})();

/* ══ ⑦ 有限容量が θ 依存を変えるか(時間領域・自転固定) ══════════════════════════ */
const stage7 = (() => {
  const Ecap = stage6.Ecap, gSat = stage6.gammaSat;
  const thetas = QUICK ? [15, 48.19, 90, 130] : [10, 25, 40, 48.19, 60, 75, 90, 105, 130, 160];
  const rows = thetas.map((d) => {
    const run = (cap) => NM.runMode({ mode: { ...toy, Is: 1e9, Ecap: cap ? Ecap : 0, gammaSat: cap ? gSat : 0,
      spin: { theta: d * RAD, omega: 3 } }, dt, steps: (DECL.warmOrbits + DECL.avgOrbits) * DECL.stepsPerOrbit,
    avgFrom: DECL.warmOrbits * DECL.stepsPerOrbit, Escale: 1, Jscale: 1 });
    const a = run(false), b = run(true);
    return { thetaDeg: d, linearTheta: a.avg.local.theta, capTheta: b.avg.local.theta,
      linearS: a.avg.local.s, capS: b.avg.local.s, ratioTheta: b.avg.local.theta / a.avg.local.theta,
      gEffMax: Math.max(...b.trace.map((x) => x.gEff)) };
  });
  // 容量ありの T(θ) を sinθ(c0 + c1 cosθ + c2 cos²θ + c3 cos³θ) に最小二乗
  const fit = (key) => {
    const A = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]], y = [0, 0, 0, 0];
    for (const r of rows) {
      const t = r.thetaDeg * RAD, s = Math.sin(t), c = Math.cos(t);
      const row = [s, s * c, s * c * c, s * c * c * c];
      for (let i = 0; i < 4; i++) { y[i] += row[i] * r[key]; for (let j = 0; j < 4; j++) A[i][j] += row[i] * row[j]; }
    }
    // ガウス消去
    const M = A.map((r, i) => r.concat([y[i]]));
    for (let c = 0; c < 4; c++) { for (let r = c + 1; r < 4; r++) { const k = M[r][c] / M[c][c]; for (let q = c; q <= 4; q++) M[r][q] -= k * M[c][q]; } }
    const x = [0, 0, 0, 0];
    for (let r = 3; r >= 0; r--) { let s = M[r][4]; for (let q = r + 1; q < 4; q++) s -= M[r][q] * x[q]; x[r] = s / M[r][r]; }
    return x;
  };
  const cl = fit('linearTheta'), cc = fit('capTheta');
  // 零点: 時間領域の走行で二分法(40°〜60°・12 回)
  const Tat = (d, cap) => NM.runMode({ mode: { ...toy, Is: 1e9, Ecap: cap ? Ecap : 0, gammaSat: cap ? gSat : 0,
    spin: { theta: d * RAD, omega: 3 } }, dt, steps: (DECL.warmOrbits + DECL.avgOrbits) * DECL.stepsPerOrbit,
  avgFrom: DECL.warmOrbits * DECL.stepsPerOrbit, Escale: 1, Jscale: 1 }).avg.local.theta;
  const zero = (cap) => {
    let a = 40, b = 60, fa = Tat(a, cap);
    for (let it = 0; it < (QUICK ? 6 : 12); it++) {
      const m = 0.5 * (a + b), fm = Tat(m, cap);
      if (fa * fm <= 0) b = m; else { a = m; fa = fm; }
    }
    return 0.5 * (a + b);
  };
  return { rows, polyLinear: cl, polyCapacity: cc,
    polyLinearRel: cl.map((x) => x / Math.max(1e-300, Math.abs(cl[1]))),
    polyCapacityRel: cc.map((x) => x / Math.max(1e-300, Math.abs(cc[1]))),
    zeroLinearDeg: zero(false), zeroCapacityDeg: zero(true),
    zeroSteadyDeg: NM.thetaCoefficients((t) => NM.steadyState(toy, t, { omega: 3 }).local.theta, { samples: 720 }).zeros
      .map((z) => z.thetaDeg)[0],
    note: '零点は時間領域の走行の二分法(40°〜60°)。多項式は ' + rows.length + ' 点の最小二乗(粗い)' };
})();

/* ══ ⑧ 摂動復帰(θ*±5°)と永年方程式 ═══════════════════════════════════════════ */
function orbitAveragedRun(o) {
  const st = NM.makeMode(o.mode);
  const out = [];
  let acc = 0, cnt = 0;
  for (let k = 0; k < o.orbits * DECL.stepsPerOrbit; k++) {
    if (o.stopAtOrbit !== undefined && k === o.stopAtOrbit * DECL.stepsPerOrbit) NM.stopSupply(st);
    NM.modeExchange(st, dt);
    const a = NM.spinAngles(st);
    acc += a.thetaDeg; cnt++;
    if (cnt === DECL.stepsPerOrbit) {
      out.push({ orbit: out.length + 1, t: st.t, thetaMeanDeg: acc / cnt, omega: a.omega,
        Jmode: Math.hypot(...NM.modeLedger(st).Jmode), Emode: NM.modeLedger(st).Emode });
      acc = 0; cnt = 0;
    }
  }
  return { orbits: out, ledger: NM.modeLedger(st) };
}
const thStar0 = NM.lagLimit(toy, 1, { omega: 3 }).thetaStarDeg;
const Is8 = DECL.recovery.IsFactor;
const stage8 = (() => {
  const variant = (hold) => {
    const runs = [+1, -1].map((sg) => {
      const th0 = thStar0 + sg * DECL.recovery.dThetaDeg;
      const r = orbitAveragedRun({ mode: { ...toy, Is: Is8, holdSpin: hold, spin: { theta: th0 * RAD, omega: 3 } },
        orbits: DECL.recovery.orbits });
      const sec = NM.secularEvolve(toy, { theta: th0 * RAD, omega: 3, Is: Is8, dt: 0.05, holdSpin: hold,
        steps: Math.round(DECL.recovery.orbits * 2 * Math.PI / 0.05), samples: DECL.recovery.orbits });
      const secAt = (t) => sec.reduce((b, x) => (Math.abs(x.t - t) < Math.abs(b.t - t) ? x : b), sec[0]);
      const marks = [1, 10, 30, 60, 100, DECL.recovery.orbits].filter((x, i, arr) => x <= DECL.recovery.orbits
        && arr.indexOf(x) === i).map((orb) => {
        const a = r.orbits[orb - 1], sv = secAt(a.t);
        const ts = a.omega > 2 ? Math.acos(2 / a.omega) * DEG : null;
        return { orbit: orb, thetaMeanDeg: a.thetaMeanDeg, omega: a.omega, thetaStarNowDeg: ts,
          offFromStarDeg: ts === null ? null : a.thetaMeanDeg - ts, secularThetaDeg: sv.thetaDeg, secularOmega: sv.omega };
      });
      return { sign: sg, theta0Deg: th0, marks, ledgerJagent: r.ledger.Jagent, ledgerWagent: r.ledger.Wagent };
    });
    const last = runs[0].marks.length - 1;
    const gap = (i) => Math.abs(runs[0].marks[i].thetaMeanDeg - runs[1].marks[i].thetaMeanDeg);
    const worstSec = Math.max(...runs.flatMap((r) => r.marks.map((m) => Math.abs(m.thetaMeanDeg - m.secularThetaDeg))));
    return { holdSpin: hold, runs, pairGapStartDeg: gap(0), pairGapEndDeg: gap(last), pairGapRatio: gap(last) / gap(0),
      worstVsSecularDeg: worstSec };
  };
  const held = variant(true), free = variant(false);
  const e = 1e-6, T = (t) => NM.lagLimit(toy, t, { omega: 3 }).tauTheta;
  const sl = (T(thStar0 * RAD + e) - T(thStar0 * RAD - e)) / (2 * e);
  return { Is: Is8, thetaStar0Deg: thStar0, held, free,
    pairGapStartDeg: held.pairGapStartDeg, pairGapEndDeg: held.pairGapEndDeg, pairGapRatio: held.pairGapRatio,
    linearRate: { dTdTheta: sl, lambda: sl / (Is8 * 3), attracting: sl < 0 },
    jointFixedPoint: '導出式で τ_θ=0 と τ_s=0 を同時に満たすのは θ=0・ω=n(同期)だけ'
      + '(sinθ≠0 なら ω cosθ=2n を τ_s に入れると −½ω=0 になり矛盾)',
    note: 'held = 自転の大きさを外部の供給で固定(宣言した対照・角力積と仕事を別口座へ)/ '
      + 'free = 自転は動的(スピンダウンで零点 θ*(ω)=arccos(2n/ω) が動き、ω≤2n で消える)。θ は公転ごとの平均。'
      + '永年方程式は導出式(遅れの小さい極限)' };
})();

/* ══ ⑨ 供給停止 ══════════════════════════════════════════════════════════════ */
const stage9 = (() => {
  const stopOrbit = 20, orbits = 40;
  const r = orbitAveragedRun({ mode: { ...toy, Is: Is8, spin: { theta: 30 * RAD, omega: 3 } }, orbits, stopAtOrbit: stopOrbit });
  const o = r.orbits;
  const rate = (a, b) => (o[b - 1].thetaMeanDeg - o[a - 1].thetaMeanDeg) / (b - a);
  return { stopOrbit, orbits, thetaRateBeforeDegPerOrbit: rate(10, stopOrbit),
    thetaRateAfterDegPerOrbit: rate(stopOrbit + 5, orbits),
    JmodeAtStop: o[stopOrbit - 1].Jmode, JmodeEnd: o[orbits - 1].Jmode, EmodeEnd: o[orbits - 1].Emode,
    omegaAtStop: o[stopOrbit - 1].omega, omegaEnd: o[orbits - 1].omega,
    thetaAtStopDeg: o[stopOrbit - 1].thetaMeanDeg, thetaEndDeg: o[orbits - 1].thetaMeanDeg };
})();

/* ══ ⑩ 別系への予測の形 ═════════════════════════════════════════════════════════ */
const NSG = JSON.parse(fs.readFileSync(path.join(ROOT, 'tests', 'out', 'nsgrid-w277c.json'), 'utf8'));
const stage10 = (() => {
  const rows = [];
  for (const S of NSG.systems) {
    for (let b = 0; b < 2; b++) {
      if (S.id !== 'J0737' && b === 1) continue;   // 伴星の自転は宣言値(パルサーと同じ)なので予測に使わない
      const w = S.omegaOverN[b];
      const wm = DECL.nsOmegaMOverOmega * w, g = DECL.nsGammaOverOmegaM * wm;
      const p = { mu: 1, omegaM: wm, gamma: g, f: 1, n: 1 };
      const l = NM.lagLimit(p, 1, { omega: w });
      const T = (t) => NM.steadyState(p, t, { omega: w }).local.theta;
      const c = NM.thetaCoefficients(T, { samples: 720, kmax: 4 });
      const z = c.zeros.find((q) => q.thetaDeg > 1 && q.thetaDeg < 179) || null;
      const th = (b === 0) ? (S.id === 'J0737' ? 3.2 : null) : 40.6;
      const s = NM.steadyState(p, 89.9 * RAD, { omega: w });
      rows.push({ system: S.id, body: b + 1, omegaOverN: w, omegaM: wm, gamma: g,
        lagThetaStarDeg: l.thetaStarDeg, lagNinetyMinusDeg: 90 - l.thetaStarDeg,
        steadyZeroDeg: z ? z.thetaDeg : null, steadyZeroAttracting: z ? z.attracting : null,
        b1OverB2: c.sineCoefRel[0], expectB1overB2: -4 / w,
        observedMaterialDeg: th,
        orbitReactionInPlaneOverZ: Math.abs(s.tauTid[0]) / Math.max(1e-300, Math.abs(s.tauTid[2])) });
    }
  }
  return { rows, declared: { omegaMOverOmega: DECL.nsOmegaMOverOmega, gammaOverOmegaM: DECL.nsGammaOverOmegaM },
    untestedObservables: '検査に使える**未使用の観測量が無い**: B の歳差率 5.16 deg/yr は GR の測地歳差で本模型に GR は無い。'
      + 'J1757・J1946 には傾きの観測材料が台帳に無い。したがって ⑩ は**予測の形**であって検査ではない',
    note: '零点は導出式では cosθ*=2n/ω で、μ・ω_m・γ・f に依らない(**合わせる係数が無い**)。'
      + '実系の ω/n では 90° から 0.04° 以内で、観測材料 3.2°・40.6° を作らない' };
})();

/* ══ 読み(Failure First) ═════════════════════════════════════════════════════ */
const lagRow = stage4.rows[0];
const verdict = [
  { id: 'M1', claim: 'sin2θ 以外の θ 依存が出るか', inModel: '**出る**(sinθ 項)',
    evidence: `導出式 τ_θ = (Kω/4) sin2θ − K n sinθ。ω/n=3 の正弦係数 b1/b2 = ${lagRow.sineCoefRel[0].toFixed(6)}`
      + `(式の値 −4n/ω = ${(-4 / 3).toFixed(6)})。有限 ω_m では sin3θ・sin4θ も出る(係数表)` },
  { id: 'M2', claim: '中間傾斜の零点', inModel: `cosθ* = 2n/ω(ω/n=3 で ${thStar0.toFixed(4)}°)・固定 ω で吸引`,
    evidence: `実系の ω/n では 90° から ${stage10.rows.map((r) => r.system + (r.body === 2 ? 'B' : r.system === 'J0737' ? 'A' : '') + ' ' + r.lagNinetyMinusDeg.toExponential(2) + '°').join(' / ')} —— `
      + '**観測材料 3.2°・40.6° を作らない**' },
  { id: 'M3', claim: '歳差位相との結合で新しい項が出るか', inModel: '遅れの小さい極限では**出ない**・有限 ω_m で小さく出る',
    evidence: `ω_m=30 で ∂T/∂Ω_p の b2 が基準 b2 の ${stage5.rows[0].relToBaseB2[1].toExponential(3)} 倍 / ω_m=300 で `
      + `${stage5.rows.find((r) => r.omegaM === 300).relToBaseB2[1].toExponential(3)} 倍` },
  { id: 'M4', claim: '帳簿(E・J・熱・恒等式)', inModel: '**閉じる**',
    evidence: `E ${stage6.worstErel.toExponential(2)}・J ${stage6.worstJrel.toExponential(2)}・熱の減少 ${stage6.heatDrops}・`
      + `dE_orb − n dL_orb,z ${stage6.worstOrbitIdentityRel.toExponential(2)}` },
  { id: 'M5', claim: '摂動復帰', inModel: (stage8.held.pairGapRatio < 1 ? '自転の大きさを固定すると**θ* へ戻る**' : '固定しても**戻らない**')
      + '・自転が動的なら零点ごと動いて θ=0(同期)へ向かう',
    evidence: `θ*±5° の 2 本の差(固定)${stage8.held.pairGapStartDeg.toFixed(3)}° → ${stage8.held.pairGapEndDeg.toFixed(3)}° / `
      + `(動的)${stage8.free.pairGapStartDeg.toFixed(3)}° → ${stage8.free.pairGapEndDeg.toFixed(3)}°。${stage8.jointFixedPoint}` },
  { id: 'M6', claim: '供給停止', inModel: '停止後は θ が動かない',
    evidence: `θ の変化率 ${stage9.thetaRateBeforeDegPerOrbit.toExponential(2)} → ${stage9.thetaRateAfterDegPerOrbit.toExponential(2)} °/公転` },
  { id: 'N1', claim: '(否定結果)観測角の説明', inModel: '**できない**',
    evidence: '零点の位置は ω/n だけで決まり、実系では ≈90°。A の 95% 上限 3.2°・B の 40.6° は本模型の零点ではない。'
      + '**合わせる係数探索はしていない**' },
];

const out = {
  meta: withProvenance({
    note: '第278便c — H6 の共役変数模型(内部モード Q・P・有限容量・角力積の記帳)。**較正ではない**・**エンジン未接続**',
    premise: NM.NSMODE_PREMISE, declared: DECL,
    time_scale_gain: 'not applicable(宣言した結合)', not_a_prediction: true,
    doNotWrite: ['NS の平衡を実証した', '観測と一致した', '較正を完了した', '中間傾斜で安定する', '新発見'],
  }, {
    root: ROOT, wave: '第278便c', target: 'tests/lib-w278c-nsmode.mjs',
    code: ['tests/exp-w278c-nsmode.mjs', 'tests/lib-w278c-nsmode.mjs', 'tests/lib-w275e-powerball.mjs',
      'tests/lib-w272e-provenance.mjs'],
    inputs: ['tests/lib-w278c-nsmode.mjs', 'tests/out/nsgrid-w277c.json'],
  }),
  stage1, stage2, stage3, stage4, stage5, stage6, stage7, stage8, stage9, stage10, verdict,
  seconds: (Date.now() - t0) / 1000,
};
fs.mkdirSync(path.join(ROOT, 'tests', 'out'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'tests', 'out', 'nsmode-w278c.json'), JSON.stringify(out, null, 1));

/* ── 画面 ─────────────────────────────────────────────────────────────────── */
const e = (x, d) => (x === null || x === undefined) ? '—' : Number(x).toExponential(d === undefined ? 3 : d);
console.log('# 第278便c — H6 の共役変数模型');
console.log('① トルク式の検算 最悪相対差 ' + e(stage1.worstRel));
for (const r of stage2.rows) console.log(`② ω_m=${r.omegaM}: 閉形式との差 τ_θ ${e(r.worstThetaRel)}・τ_s ${e(r.worstSRel)}・τ_ψ ${e(r.worstPsiRel)}・熱 ${e(r.worstHeatRel)}・収支 ${e(r.worstClosureRel)}`);
for (const r of stage3.rows) console.log(`③ θ=${r.thetaDeg}: 時間領域 vs 周波数領域 τ_θ ${e(r.relTheta)}・τ_s ${e(r.relS)}・τ_ψ ${e(r.relPsi)}・熱 ${e(r.heatRel)}`);
for (const r of stage4.rows) console.log(`④ ${r.label}: b_k/|b2| = ${r.sineCoefRel.map((x) => x.toFixed(6)).join(', ')}`
  + ` / 零点 ${r.zeros.map((z) => z.thetaDeg.toFixed(4) + (z.attracting ? '(吸引)' : '(反発)')).join(' ')} / sin2θ だけの残差 ${e(r.sin2OnlyMaxResidualRel)}`);
console.log(`   摩擦 0 の対照: 平均トルクの最大 ${e(stage4.frictionless.worstTorque)}`);
for (const r of stage5.rows) console.log(`⑤ ω_m=${r.omegaM} Ω_p=${r.precRate}: ∂T/∂Ω_p の b_k/|b2(基準)| = ${r.relToBaseB2.map((x) => e(x, 2)).join(', ')} / 零点 ${r.zeroDeg.map((x) => x.toFixed(4)).join(' ')}(基準 ${r.baseZeroDeg.map((x) => x.toFixed(4)).join(' ')})`);
console.log(`   時間領域 1 点(Ω_p=${stage5.tdCheck.precRate}・θ=${stage5.tdCheck.thetaDeg}): τ_θ ${e(stage5.tdCheck.relTheta)}・τ_s ${e(stage5.tdCheck.relS)}・τ_ψ ${e(stage5.tdCheck.relPsi)}`);
for (const r of [stage6.coarse, stage6.fine]) console.log(`⑥ 帳簿(${r.stepsPerOrbit} 步/公転): E ${e(r.worstErel)}・J ${e(r.worstJrel)}・步 E ${e(r.worstStepErel)}・步 J ${e(r.worstStepJrel)}・恒等式 ${e(r.worstOrbitIdentityRel)}・熱の減少 ${r.heatDrops}・停止仕事 ${e(r.stopWork)}・γ_eff 最大 ${r.gEffMax.toFixed(3)}`);
console.log(`   刻み半分での次数 E ${stage6.ErelOrder.toFixed(2)}・J ${stage6.JrelOrder.toFixed(2)}`);
console.log(`⑦ 容量: 零点 線形 ${stage7.zeroLinearDeg}(定常解 ${stage7.zeroSteadyDeg})/ 容量 ${stage7.zeroCapacityDeg} / 多項式(線形) ${stage7.polyLinearRel.map((x) => x.toFixed(4)).join(', ')} / (容量) ${stage7.polyCapacityRel.map((x) => x.toFixed(4)).join(', ')}`);
for (const v of [stage8.held, stage8.free]) {
  console.log(`⑧ 摂動復帰(${v.holdSpin ? '自転の大きさ固定' : '自転は動的'}): 差 ${v.pairGapStartDeg.toFixed(3)}° → ${v.pairGapEndDeg.toFixed(3)}°(比 ${v.pairGapRatio.toFixed(4)})・永年方程式との最大差 ${v.worstVsSecularDeg.toFixed(3)}°`);
  for (const r of v.runs) console.log('   ' + r.marks.map((m) => `${m.orbit}:${m.thetaMeanDeg.toFixed(2)}°/θ*${m.thetaStarNowDeg === null ? '—' : m.thetaStarNowDeg.toFixed(2) + '°'}/永年${m.secularThetaDeg.toFixed(2)}°/ω${m.omega.toFixed(3)}`).join('  '));
}
console.log(`   固定 ω の線形化 λ ${e(stage8.linearRate.lambda)}・${stage8.jointFixedPoint}`);
console.log(`⑨ 供給停止: θ 変化率 ${e(stage9.thetaRateBeforeDegPerOrbit)} → ${e(stage9.thetaRateAfterDegPerOrbit)} °/公転・J_mode ${e(stage9.JmodeAtStop)} → ${e(stage9.JmodeEnd)}`);
for (const r of stage10.rows) console.log(`⑩ ${r.system} 天体${r.body} ω/n=${r.omegaOverN.toFixed(1)}: 導出式 θ* 90−${e(r.lagNinetyMinusDeg)}° / 定常解の零点 ${r.steadyZeroDeg} / b1/b2 ${e(r.b1OverB2)}(式 ${e(r.expectB1overB2)})/ 軌道反作用 面内/z ${e(r.orbitReactionInPlaneOverZ)}`);
for (const v of verdict) console.log(`   ${v.id} ${v.claim} → ${v.inModel}`);
console.log(`→ tests/out/nsmode-w278c.json(${out.seconds.toFixed(1)} s)`);
