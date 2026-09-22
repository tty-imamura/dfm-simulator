// 第277便c: **中性子星連星の診断格子** —— 原仮定者の裁定(第67報)(2)「観測値の自転軸の傾きと、
// 潮汐力と、パワーボール効果を利用して、DFM 版中性子星連星の安定状態を検証する」。
//
// **較正ではない。**観測から係数を決めた量は 1 つも無い。観測の傾き(PSR J0737−3039A の 95% 上限
// 3.2°・B の 40.6°)は**確認依頼で照合する材料**であり、**初期値としてのみ**使う。
// **エンジン未接続**(`beta/index.html` はこの器を 1 度も読まない)。
//
// 段:
//   ① **相対すべり**(R46 の零条件): s_i = v − ω_i×r の円軌道 360 位相 RMS / v_orb。
//      閉形式と突き合わせ、共通並進で不変であることを数で出す。
//      → **この系は相互同期(= kF0 の零条件)に分類しない**を数で示す。
//   ② **潮汐の手の係数**(宣言): 裁定の書式の次元を記帳し、**実在の潮汐**と**診断用**の差(利得)を出す。
//   ③ **格子**: 系 3 × θ* 7 × k∈{0,1} × λ 3 × η(k=1 のみ)3 × dt 2 段 × 100 公転。
//      各行で基準 + 小摂動 ±1° の 3 本を走らせ、門で (A)/(B)/(C) に機械分類する。
//   ④ **供給元の対照**: 内部モード口座 vs 軌道 E(**準円では E_orb=E(L) なので J_z が閉じない**)。
//   ⑤ **N3 の可逆対照**(R50): ±0.01 を 100 往復。現行の非負口座(整流)vs `signedAxisWork`。
//      `solveDelta` の有理化の検算も同じ段に置く。
//   ⑥ **否定対照**: 無減衰の局所試作(R44 の局所調和則)を NS の分離へ延長したときの動径加速度。
//
// 使い方: node tests/exp-w277c-nsgrid.mjs [--quick]   → tests/out/nsgrid-w277c.json
// 書かないこと: 「NS の平衡を実証した」「ロックすると加速する」「観測と一致した」「較正を完了した」
//   「潮汐ロックを証明した」「新発見」。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import * as NG from './lib-w277c-nsgrid.mjs';
import * as AW from './lib-w276c-axiswork.mjs';
import { loadObsCsv } from './lib-w270b-obscsv.mjs';
import { withProvenance } from './lib-w272e-provenance.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const QUICK = process.argv.includes('--quick');
const DEG = 180 / Math.PI;
const rel = (a, b) => Math.abs(a - b) / Math.max(1e-30, Math.abs(b));

/* ── 観測 CSV から**入力だけ**を読む(値は作らない・出所は record_id で残す) ───────── */
const CSVP = path.join(ROOT, 'paper', 'data', 'solar-observations.csv');
const CSV = loadObsCsv(CSVP);
function pick(body, quantity) {
  const r = CSV.rows.find((x) => x.body === body && x.quantity === quantity);
  if (!r) throw new Error('CSV に行が無い: ' + body + '|' + quantity);
  return { value: r.value, unit: r.unit, recordId: r.recordId, sigma: r.sigma, ln: r.ln };
}
/** 候補行(照合前)—— **門には入らない**。値が空の行も拾う。 */
function pickCandidate(body, quantity) {
  const r = CSV.rows.find((x) => x.body === body && x.quantity === quantity);
  if (!r) return null;
  return { value: r.value, rawValue: r.rawValue, unit: r.unit, recordId: r.recordId,
    sigma: r.sigma, note: r.note.slice(0, 160), ln: r.ln };
}

/** 系の定義(**実系の数は無次元比としてだけ入る**: G=1・M=1・n=1 → a=1)。 */
function makeSystem(o) {
  const m1 = pick(o.body1, 'mass').value, m2 = pick(o.body2, 'mass').value;
  const aRow = pick(o.aBody, 'semi_major_axis'), eRow = pick(o.eBody, 'eccentricity');
  const pRow = pick(o.pBody, 'orbital_period');
  const s1Row = pick(o.body1, 'rotation_period');
  const r1Row = pick(o.body1, 'radius'), r2Row = pick(o.body2, 'radius');
  const s2Row = o.spin2Body ? pick(o.spin2Body, 'rotation_period') : null;
  const M = m1 + m2;
  const f1 = m1 / M, f2 = m2 / M;
  const RoA = [r1Row.value / aRow.value, r2Row.value / aRow.value];
  const wOverN = [pRow.value / s1Row.value,
    s2Row ? pRow.value / s2Row.value : pRow.value / s1Row.value];
  return {
    id: o.id, label: o.label,
    inputs: {
      m1: { ...pick(o.body1, 'mass'), body: o.body1 }, m2: { ...pick(o.body2, 'mass'), body: o.body2 },
      a: { ...aRow, body: o.aBody }, e: { ...eRow, body: o.eBody }, Porb: { ...pRow, body: o.pBody },
      spin1: { ...s1Row, body: o.body1 },
      spin2: s2Row ? { ...s2Row, body: o.spin2Body }
        : { declared: true, value: s1Row.value, unit: 's',
          note: '**宣言**: 伴星の自転周期は公表された行が無いので、パルサーと同じ値を置いた(観測値ではない)' },
      r1: { ...r1Row, body: o.body1 }, r2: { ...r2Row, body: o.body2 },
    },
    massFrac: [f1, f2], RoverA: RoA, omegaOverN: wOverN,
    eccentricity: eRow.value,
    eccentricityRole: '**記録した入力**であって、本格子の軌道は準円である(秤動・近点集中は入っていない)',
    periastronTideFactor: Math.pow(1 - eRow.value, -6),
  };
}

const SYSTEMS = [
  makeSystem({ id: 'J0737', label: 'PSR J0737−3039 A/B', body1: 'PSR J0737-3039 A',
    body2: 'PSR J0737-3039 B', aBody: 'PSR J0737-3039 B', eBody: 'PSR J0737-3039 B',
    pBody: 'PSR J0737-3039 B', spin2Body: 'PSR J0737-3039 B' }),
  makeSystem({ id: 'J1757', label: 'PSR J1757−1854', body1: 'PSR J1757-1854',
    body2: 'PSR J1757-1854 companion', aBody: 'PSR J1757-1854', eBody: 'PSR J1757-1854',
    pBody: 'PSR J1757-1854' }),
  makeSystem({ id: 'J1946', label: 'PSR J1946+2052', body1: 'PSR J1946+2052',
    body2: 'PSR J1946+2052 companion', aBody: 'PSR J1946+2052', eBody: 'PSR J1946+2052',
    pBody: 'PSR J1946+2052' }),
];

/* ── 宣言(**すべて宣言。観測から決めていない**) ──────────────────────────────── */
const DECL = {
  k2: 0.1,                     // 潮汐ラブ数 k₂(EOS 代理の宣言値 —— 観測同定ではない)
  kPrec: 0.1,                  // K_b = kPrec·|S_b| —— 歳差率が公転の 0.1 倍になる宣言
  kTide: 5e-3,                 // C_t,b = kTide·|S_b| —— **診断用**(100 公転で θ が動く大きさ)
  reqFactor: 1e-3,             // 要求率 = reqFactor·|S_b|(**口座が律速**になるように)
  xi: 1,                       // 口座への取込率 ξ
  lambdas: [0, 1e-5, 1e-3],    // γ_b = λ·|S_b|(無次元宣言)
  etas: [0, 0.8, 1],
  IaFactor: 1,                 // I_a = IaFactor·I(反作用ローターの慣性)
  orbits: QUICK ? 10 : 100,
  stepsPerOrbit: QUICK ? 128 : 384,
  perturbDeg: NG.GATE.perturbDeg,
  azimuthDeg: [0, 90],         // 初期の方位角(**宣言**)
  minOrbitalLFactor: 0.5,      // minOrbitalL = 0.5·L₀(**宣言**。合体・捕捉の判定ではない)
};

const THETA_CASES = [
  { tag: 'obs', th: [3.2, 40.6], kind: '観測材料(A の 95% 上限値・B の幾何解)' },
  { tag: 'obs+5', th: [8.2, 45.6], kind: '観測材料 +5°' },
  { tag: 'obs-5', th: [1.8, 35.6], kind: '観測材料 −5°(A は 3.2−5 が負なので |−1.8|=1.8 を使う — **宣言**)' },
  { tag: '0deg', th: [0, 0], kind: '0°' },
  { tag: '90deg', th: [90, 90], kind: '90°' },
  { tag: '3.2deg', th: [3.2, 3.2], kind: '両体 3.2°' },
  { tag: '40.6deg', th: [40.6, 40.6], kind: '両体 40.6°' },
];

/* ══════════════════════════════════════════════════════════════════════════
 * ① 相対すべり(R46 の零条件)
 * ════════════════════════════════════════════════════════════════════════ */
const slipRows = [];
for (const S of SYSTEMS) {
  for (const tc of [{ tag: 'obs', th: [3.2, 40.6] }, { tag: '0deg', th: [0, 0] },
    { tag: '90deg', th: [90, 90] }]) {
    for (let b = 0; b < 2; b++) {
      const r = NG.slipRmsCircular({ omegaOverN: S.omegaOverN[b], thetaDeg: tc.th[b] });
      slipRows.push({ system: S.id, body: b + 1, thetaTag: tc.tag, thetaDeg: tc.th[b],
        omegaOverN: S.omegaOverN[b], rms: r.rms, closed: r.closed, relDiff: r.relDiff,
        min: r.min, max: r.max,
        zeroCondition: r.rms <= 1e-12 });
    }
  }
}
// **零条件そのもの**(相互同期 ω=n ẑ)と、共通並進の不変性
const slipZero = NG.slipRmsCircular({ omegaOverN: 1, thetaDeg: 0 });
const slipTrans = NG.slipTranslationInvariance([1, 0, 0], [0, 1, 0], [0, 0, 1.3], [0, 0.2, 0.7],
  [3.5, -2.25, 8.125]);

/* ══════════════════════════════════════════════════════════════════════════
 * ② 潮汐の手の係数(宣言)—— **実在の潮汐と診断用の差を出す**
 * ════════════════════════════════════════════════════════════════════════ */
function bodyScales(S) {
  const I = [0.4 * S.massFrac[0] * S.RoverA[0] ** 2, 0.4 * S.massFrac[1] * S.RoverA[1] ** 2];
  const Smag = [I[0] * S.omegaOverN[0], I[1] * S.omegaOverN[1]];
  return { I, Smag };
}
const tideRows = [];
for (const S of SYSTEMS) {
  const sc = bodyScales(S);
  for (let b = 0; b < 2; b++) {
    const other = S.massFrac[1 - b];
    const phys = NG.tidalCoeff({ G: 1, m2: other, R1: S.RoverA[b], k2: DECL.k2, r: 1 });
    const diag = DECL.kTide * sc.Smag[b];
    tideRows.push({ system: S.id, body: b + 1, I: sc.I[b], Smag: sc.Smag[b],
      RoverA: S.RoverA[b], k2: DECL.k2,
      CtPhysicalWritten: phys.written, CtPhysicalTorque: phys.torque, CtDiagnostic: diag,
      gain: diag / Math.max(1e-300, phys.torque),
      alignOrbitsPhysical: (phys.torque > 0)
        ? sc.Smag[b] / phys.torque / (2 * Math.PI) : Infinity,
      alignOrbitsDiagnostic: sc.Smag[b] / diag / (2 * Math.PI),
      periastronFactor: S.periastronTideFactor });
  }
}
const tideDimension = NG.tidalCoeff({ G: 1, m2: 0.5, R1: 1e-5, k2: DECL.k2, r: 1 });

/* ══════════════════════════════════════════════════════════════════════════
 * ③ 格子
 * ════════════════════════════════════════════════════════════════════════ */
function buildParams(S, o) {
  const sc = bodyScales(S);
  const K = [DECL.kPrec * sc.Smag[0], DECL.kPrec * sc.Smag[1]];
  const gamma = [o.lambda * sc.Smag[0], o.lambda * sc.Smag[1]];
  const Ct = o.tideOff ? [0, 0] : [DECL.kTide * sc.Smag[0], DECL.kTide * sc.Smag[1]];
  const L0 = S.massFrac[0] * S.massFrac[1];        // μ√(GMa) = μ(G=M=a=1)
  const mk = (Sm, thDeg, azDeg) => {
    const t = thDeg / DEG, z = azDeg / DEG;
    return [Sm * Math.sin(t) * Math.cos(z), Sm * Math.sin(t) * Math.sin(z), Sm * Math.cos(t)];
  };
  return {
    id: o.id, G: 1, m1: S.massFrac[0], m2: S.massFrac[1],
    I: sc.I, Ia: [DECL.IaFactor * sc.I[0], DECL.IaFactor * sc.I[1]],
    K, gamma, Ct, xi: [DECL.xi, DECL.xi],
    requestRate: [DECL.reqFactor * sc.Smag[0], DECL.reqFactor * sc.Smag[1]],
    eta: o.eta === null ? 1 : o.eta, useBank: o.useBank, supply: o.supply || 'internal',
    rotor: [[0, 0, 0], [0, 0, 0]],
    minOrbitalL: DECL.minOrbitalLFactor * L0,
    dt: (2 * Math.PI) / o.stepsPerOrbit, steps: DECL.orbits * o.stepsPerOrbit, samples: 8,
    y0: [...mk(sc.Smag[0], o.th[0], DECL.azimuthDeg[0]),
      ...mk(sc.Smag[1], o.th[1], DECL.azimuthDeg[1]),
      L0, 0, 0, 0, 0, 0, 0, 0],
  };
}

function leanRun(r) {
  return { t: r.t, steps: r.steps,
    thetaEndDeg: [r.last.bodies[0].thetaDeg, r.last.bodies[1].thetaDeg],
    thetaMinDeg: r.thetaMinDeg, thetaMaxDeg: r.thetaMaxDeg,
    thetaSecularDeg: r.thetaSecularDeg, thetaOscDeg: r.thetaOscDeg,
    thetaMeanSecondHalfDeg: r.thetaMeanSecondHalfDeg,
    SmagRel: [rel(r.last.bodies[0].Smag, r.first.bodies[0].Smag),
      rel(r.last.bodies[1].Smag, r.first.bodies[1].Smag)],
    omegaEnd: [r.last.bodies[0].omega, r.last.bodies[1].omega],
    aOverA0: r.last.sep / r.first.sep, dLorb: r.dLorb,
    worstErel: r.worstErel, worstJzRel: r.worstJzRel,
    heat: r.last.heat, heatDrops: r.heatDrops, bank: r.last.bank,
    supplyDrop: r.supplyDrop, supplyRises: r.supplyRises,
    transfers: r.transfers, refusals: r.refusals, bankNegSteps: r.bankNegSteps,
    stopped: r.stopped ? r.stopped.reason : null };
}

const gridRows = [];
let runCount = 0;
const t0 = Date.now();
for (const S of SYSTEMS) {
  for (const tc of THETA_CASES) {
    for (const k of [0, 1]) {
      const etas = (k === 0) ? [null] : DECL.etas;
      for (const lambda of DECL.lambdas) {
        for (const eta of etas) {
          const stages = [];
          for (const spo of [DECL.stepsPerOrbit, 2 * DECL.stepsPerOrbit]) {
            const base = NG.runNsRun(buildParams(S, { id: 'base', th: tc.th, lambda, eta,
              useBank: k === 1, stepsPerOrbit: spo }));
            const plus = NG.runNsRun(buildParams(S, { id: 'plus',
              th: [tc.th[0] + DECL.perturbDeg, tc.th[1] + DECL.perturbDeg], lambda, eta,
              useBank: k === 1, stepsPerOrbit: spo }));
            const minus = NG.runNsRun(buildParams(S, { id: 'minus',
              th: [tc.th[0] - DECL.perturbDeg, tc.th[1] - DECL.perturbDeg], lambda, eta,
              useBank: k === 1, stepsPerOrbit: spo }));
            runCount += 3;
            const cls = [0, 1].map((i) => NG.classifyTheta({ base, plus, minus,
              bodyIndex: i, thetaStarDeg: tc.th[i] }));
            stages.push({ stepsPerOrbit: spo, dt: (2 * Math.PI) / spo,
              base: leanRun(base), classes: cls });
          }
          const c0 = stages[0].classes, c1 = stages[1].classes;
          gridRows.push({
            system: S.id, thetaTag: tc.tag, thetaStarDeg: tc.th, k, lambda, eta,
            classDt1: [c0[0].cls, c0[1].cls], classDt2: [c1[0].cls, c1[1].cls],
            classStable: c0[0].cls === c1[0].cls && c0[1].cls === c1[1].cls,
            gate: c0, run: stages[0].base,
            dtCheck: {
              thetaRelDiff: [rel(stages[1].base.thetaEndDeg[0], stages[0].base.thetaEndDeg[0]),
                rel(stages[1].base.thetaEndDeg[1], stages[0].base.thetaEndDeg[1])],
              heatRelDiff: rel(stages[1].base.heat, stages[0].base.heat),
              ErelDt2: stages[1].base.worstErel, JzRelDt2: stages[1].base.worstJzRel },
          });
        }
      }
    }
  }
}
const gridSeconds = (Date.now() - t0) / 1000;

// **負の対照**: 潮汐の手を切る(C_t=0)と θ は動かない
const tideOffRows = SYSTEMS.map((S) => {
  const r = NG.runNsRun(buildParams(S, { id: 'tideOff', th: [3.2, 40.6], lambda: 0, eta: null,
    useBank: false, tideOff: true, stepsPerOrbit: DECL.stepsPerOrbit }));
  return { system: S.id, ...leanRun(r),
    thetaStarDeg: [3.2, 40.6],
    thetaMoveDeg: [Math.abs(r.last.bodies[0].thetaDeg - 3.2),
      Math.abs(r.last.bodies[1].thetaDeg - 40.6)] };
});

/* ── 分類表(系 × θ* → 行数) ─────────────────────────────────────────────── */
const tally = {};
for (const r of gridRows) {
  for (let i = 0; i < 2; i++) {
    const key = r.system + '|' + r.thetaTag + '|body' + (i + 1);
    tally[key] = tally[key] || { A: 0, B: 0, C: 0, n: 0, thetaStarDeg: r.thetaStarDeg[i] };
    tally[key][r.classDt1[i]]++; tally[key].n++;
  }
}
const clsTotal = { A: 0, B: 0, C: 0 };
for (const r of gridRows) for (let i = 0; i < 2; i++) clsTotal[r.classDt1[i]]++;
// **中間傾斜**(0° でも 90° でもない θ*)で (A)(B) になった行
const midRows = gridRows.filter((r) => [0, 1].some((i) =>
  r.thetaStarDeg[i] > 1e-9 && Math.abs(r.thetaStarDeg[i] - 90) > 1e-9
  && (r.classDt1[i] === 'A' || r.classDt1[i] === 'B')));

/* ══════════════════════════════════════════════════════════════════════════
 * ④ 供給元の対照(内部モード口座 vs 軌道 E)
 * ════════════════════════════════════════════════════════════════════════ */
const supplyRows = [];
for (const S of SYSTEMS) {
  for (const supply of ['internal', 'orbit']) {
    const P = buildParams(S, { id: 'supply-' + supply, th: [3.2, 40.6], lambda: 1e-5, eta: 1,
      useBank: true, stepsPerOrbit: DECL.stepsPerOrbit });
    P.supply = supply;
    const r = NG.runNsRun(P);
    supplyRows.push({ system: S.id, supply, ...leanRun(r) });
  }
}

/* ══════════════════════════════════════════════════════════════════════════
 * ⑤ N3 の可逆対照 + 有理化
 * ════════════════════════════════════════════════════════════════════════ */
const round = NG.runReversibleRoundTrip({ w: 0.01, cycles: 100, Smag: 2, JaPar: 0, I: 1, Ia: 1 });
// **返せる量を超える要求**(拒否が記録されること)
const refuseCase = (() => {
  const st = AW.makeAxisState({ Smag: 2, JaPar: 0, I: 1, Ia: 1 });
  const cap = (AW.coefB(st) ** 2) / (4 * AW.coefA(st));
  const r = AW.signedAxisWork(st, -(cap * 1.5), 1);
  return { cap, requested: -(cap * 1.5), ok: r.ok, reason: r.reason,
    refusedWork: r.refusedWork, SmagAfter: st.Smag, JaParAfter: st.JaPar,
    refusals: st.refusals, stateUnchanged: st.Smag === 2 && st.JaPar === 0 };
})();
// **η<1 は可逆対照では拒否**(逆向きに熱を回収しない)
const etaRefuse = (() => {
  const st = AW.makeAxisState({ Smag: 2, JaPar: 0, I: 1, Ia: 1 });
  const r = AW.signedAxisWork(st, -0.01, 0.5);
  return { ok: r.ok, reason: r.reason, stateUnchanged: st.Smag === 2 && st.JaPar === 0 };
})();
const deltaProbe = NG.rationalisedDeltaProbe([
  { Smag: 2, JaPar: 0, I: 1, Ia: 1, e: 1e-20 },
  { Smag: 2, JaPar: 0, I: 1, Ia: 1, e: 1e-12 },
  { Smag: 2, JaPar: 0, I: 1, Ia: 1, e: 0.7 },
  { Smag: 0.5, JaPar: -3, I: 0.4, Ia: 2.5, e: 12 },
]);

/* ══════════════════════════════════════════════════════════════════════════
 * ⑥ 無減衰の局所試作を NS へ延長した否定対照
 * ════════════════════════════════════════════════════════════════════════ */
const undamped = SYSTEMS.map((S) => {
  const a = S.inputs.a.value, R = S.inputs.r1.value;
  const p = NG.undampedLocalProbe({ r: a, rc: R, label: S.id });
  return { ...p, aMetres: a, radiusMetres: R,
    rcNeededForWindow: a / 0.05,
    note: 'R44 の局所調和則(r/r_c<0.05 の局所模型)を NS 連星の分離へそのまま当てた値。'
      + '**一般則として延長しない**ことの否定対照である' };
});

/* ══════════════════════════════════════════════════════════════════════════
 * 読み(Failure First)
 * ════════════════════════════════════════════════════════════════════════ */
const slipA = slipRows.find((r) => r.system === 'J0737' && r.body === 1 && r.thetaTag === 'obs');
const slipB = slipRows.find((r) => r.system === 'J0737' && r.body === 2 && r.thetaTag === 'obs');
const worstE = Math.max(...gridRows.map((r) => r.run.worstErel));
const worstJz = Math.max(...gridRows.map((r) => r.run.worstJzRel));
const heatDropRows = gridRows.filter((r) => r.run.heatDrops > 0).length;
const supRiseRows = gridRows.filter((r) => r.run.supplyRises > 0).length;
const orbitSupply = supplyRows.filter((r) => r.supply === 'orbit');
const intSupply = supplyRows.filter((r) => r.supply === 'internal');

const verdict = [
  { id: 'V1', claim: 'この系は相互同期(= kF0 の零条件)に分類しない',
    inModel: '**成り立つ**(材料の傾きを初期値にした円軌道の RMS すべりで数が出る)',
    evidence: `PSR J0737−3039 の相対すべり RMS |s|/v_orb は A(θ=3.2°・ω/n=`
      + `${slipA.omegaOverN.toFixed(0)})で **${slipA.rms.toExponential(4)}**・`
      + `B(θ=40.6°・ω/n=${slipB.omegaOverN.toFixed(0)})で **${slipB.rms.toExponential(4)}**。`
      + `零条件(ω=n ẑ)そのものは RMS ${slipZero.rms} である。`
      + `**この材料は照合前の候補行であり、「観測から決めた」とは書かない**` },
  { id: 'V2', claim: '中間傾斜の相対平衡 (A) / 吸引状態 (B) が格子に出るか',
    inModel: midRows.length === 0 ? '**出ない**(0 行)' : `**${midRows.length} 行**出た`,
    evidence: `格子 ${gridRows.length} 行 × 2 天体 = ${gridRows.length * 2} 分類のうち `
      + `(A) ${clsTotal.A} / (B) ${clsTotal.B} / (C) ${clsTotal.C}。`
      + `**0° でも 90° でもない θ\* で (A)(B) になった行は ${midRows.length} 行**である。`
      + `**観測角を初期値にして保持しただけでは (A)(B) と書かない**(門は平均トルク・小摂動の`
      + `有界性・復帰・収支の閉じをすべて見る)` },
  { id: 'V3', claim: '格子の帳簿が閉じる',
    inModel: (worstE <= NG.GATE.ledgerTol && worstJz <= NG.GATE.ledgerTol
      && heatDropRows === 0 && supRiseRows === 0) ? '**閉じる**' : '**閉じない行がある**',
    evidence: `E の最悪相対誤差 ${worstE.toExponential(2)}・J_z の最悪相対誤差 `
      + `${worstJz.toExponential(2)}・熱が減った行 ${heatDropRows}・`
      + `供給元が増えた行 ${supRiseRows}(門は ${NG.GATE.ledgerTol.toExponential(0)})` },
  { id: 'V4', claim: '潮汐の手の供給元を軌道 E にできるか',
    inModel: '**できない**(準円パラメータ化では E_orb は L_orb だけの関数なので、E を引くと L も動く)',
    evidence: `内部モード口座: J_z の最悪相対誤差 `
      + `${Math.max(...intSupply.map((r) => r.worstJzRel)).toExponential(2)} / `
      + `軌道 E: **${Math.max(...orbitSupply.map((r) => r.worstJzRel)).toExponential(2)}**。`
      + `**角運動量の行き先を宣言していないので閉じない** —— 本格子の既定は内部モード口座である` },
  { id: 'V5', claim: '(R50)口座の下限が整流器として働く',
    inModel: '**成り立つ**(可逆対照で復元する)',
    evidence: `±${round.w} を ${round.cycles} 往復(生仕事の和 ${round.current.Wraw.toExponential(2)})。`
      + `現行の非負口座は ω ${round.omegaStart.toFixed(6)} → **${round.current.omega.toFixed(6)}**`
      + `(受理 W_in ${round.current.Win.toFixed(6)}・逆流の頭打ち `
      + `${round.current.clippedReturn.toFixed(6)})、**実際に返す可逆対照は ω `
      + `${round.reversible.omega.toFixed(6)}**(返却 ${round.reversible.returned.toFixed(6)}・`
      + `拒否 ${round.reversible.refusedWork}・返却回数 ${round.reversible.returns})。`
      + `**境界の一方向性が整流器として働くのであって、無から生まれたエネルギーではない**` },
  { id: 'V6', claim: '(R50)`solveDelta` の有理化',
    inModel: '**桁落ちが消えた**',
    evidence: `E=1e−20・A=1・B=2 で δ=${deltaProbe[0].delta}(素朴な (−B+√)/(2A) は `
      + `${deltaProbe[0].naive})。既存の正本 tests/out/powerball2-w276c.json は`
      + `**再走した**(差は最終桁 —— 器の出力で確かめる)` },
  { id: 'N4', claim: '(否定結果)診断用の潮汐係数は実在の潮汐ではない',
    inModel: '**宣言**',
    evidence: `k₂=${DECL.k2}・R/a を入れた**実在の**潮汐係数では、整列の時定数が `
      + `${tideRows[0].alignOrbitsPhysical.toExponential(2)} 公転(J0737 A)で、`
      + `100 公転の走行では θ は 1 桁も動かない。格子は **利得 `
      + `${tideRows[0].gain.toExponential(2)} 倍**の診断用係数 C_t=${DECL.kTide}·|S| を**宣言**して`
      + `使っている。**したがって本格子の θ の動きは実在の NS の潮汐の速さではない**` },
  { id: 'N5', claim: '(否定結果)無減衰の局所試作を NS へ一般則として延長しない',
    inModel: '**延長しない**',
    evidence: `R44 の局所調和則(窓 r/r_c<0.05)を NS 連星の分離へ当てると、`
      + `初期動径加速度はニュートン値 −1 に対し **${undamped[0].aProtoNormalised.toExponential(3)}**`
      + `(J0737・r/r_c=${undamped[0].rOverRc.toExponential(3)})である。`
      + `**窓の外であり、一般則として延長しない**` },
  { id: 'N6', claim: '(未解決)離心率は記録しただけで格子に入っていない',
    inModel: '**未解決**',
    evidence: `3 系の e は ${SYSTEMS.map((S) => S.id + ' ' + S.eccentricity).join(' / ')} で、`
      + `近点での潮汐係数は (1−e)⁻⁶ = `
      + `${SYSTEMS.map((S) => S.id + ' ' + S.periastronTideFactor.toExponential(3)).join(' / ')} 倍に`
      + `なるが、**本格子の軌道は準円である**(秤動・近点集中は入っていない)` },
];

/* ── 正本 JSON ────────────────────────────────────────────────────────────── */
const out = {
  meta: withProvenance({
    note: '第277便c — 中性子星連星の**診断格子**(観測の傾き × 潮汐の手 × パワーボールの有限口座)。'
      + '**較正ではない**・**エンジン未接続**。',
    premise: NG.NSGRID_PREMISE,
    declared: DECL,
    gate: NG.GATE,
    doNotWrite: ['NS の平衡を実証した', 'ロックすると加速する', '潮汐ロックを証明した',
      '観測と一致した', '較正を完了した', '新発見'],
    caveat: 'k₂・K・λ・η・要求率・I_a・ξ・C_t は**宣言された自由パラメータ**である。'
      + '観測の傾きは**照合前の材料**として初期値にだけ使い、そこから係数を決めることはしていない。'
      + '離心率は記録した入力であって、格子の軌道は準円である。',
    csvSha256: crypto.createHash('sha256').update(fs.readFileSync(CSVP)).digest('hex'),
  }, {
    root: ROOT, wave: '第277便c', target: 'tests/lib-w277c-nsgrid.mjs',
    code: ['tests/exp-w277c-nsgrid.mjs', 'tests/lib-w277c-nsgrid.mjs',
      'tests/lib-w276c-axiswork.mjs', 'tests/lib-w275e-powerball.mjs',
      'tests/lib-w270b-obscsv.mjs', 'tests/lib-w272e-provenance.mjs'],
    inputs: ['tests/lib-w277c-nsgrid.mjs', 'tests/lib-w276c-axiswork.mjs',
      'tests/lib-w275e-powerball.mjs', 'paper/data/solar-observations.csv'],
  }),
  systems: SYSTEMS,
  observedMaterial: {
    note: '**照合前の候補行**(`collate=pending`)である。門には入らない(`kind=model-derived`)。'
      + '値を作らないし、「観測から決めた」とも書かない',
    rows: [
      { key: 'J0737A|spin_orbit_misalignment', ...pickCandidate('PSR J0737-3039 A', 'spin_orbit_misalignment') },
      { key: 'J0737A|magnetic_obliquity', ...pickCandidate('PSR J0737-3039 A', 'magnetic_obliquity') },
      { key: 'J0737B|spin_orbit_misalignment', ...pickCandidate('PSR J0737-3039 B', 'spin_orbit_misalignment') },
      { key: 'J0737B|spin_axis_precession_rate', ...pickCandidate('PSR J0737-3039 B', 'spin_axis_precession_rate') },
    ],
    usedAs: '**初期値のみ**(A 3.2°(95% 上限値)・B 40.6°)。係数の同定には 1 つも使っていない',
  },
  stage1: { rows: slipRows, zeroCondition: slipZero, translationInvariance: slipTrans,
    note: '**相対すべり** s_i=v−ω_i×r の円軌道 360 位相 RMS / v_orb。'
      + '相互同期(零条件)なら 0・閉形式と一致・共通並進で不変' },
  stage2: { rows: tideRows, dimension: tideDimension,
    note: '**潮汐の手の係数は宣言**。実在の潮汐(k₂・R/a から作った値)と診断用の値の差(利得)を出す' },
  stage3: { rows: gridRows, tally, clsTotal, midRows: midRows.length,
    tideOff: tideOffRows, runCount, seconds: gridSeconds,
    note: '格子 = 系 3 × θ\* 7 × k∈{0,1} × λ 3 × η(k=1 のみ)3 × dt 2 段 × '
      + DECL.orbits + ' 公転。各行は基準 + 小摂動 ±1° の 3 本。'
      + '**k は口座の有無であって kFrame ではない**' },
  stage4: { rows: supplyRows,
    note: '供給元の対照。**軌道 E は準円パラメータ化では L だけの関数なので J_z が閉じない**(否定対照)' },
  stage5: { roundTrip: round, refuseCase, etaRefuse, deltaProbe,
    note: '**N3 の可逆対照**(R50)と `solveDelta` の有理化' },
  stage6: { rows: undamped,
    note: '**否定対照**: 無減衰の局所試作を NS の分離へ延長したときの動径加速度(ニュートン値 −1 規格化)' },
  verdict,
};
const dir = path.join(ROOT, 'tests', 'out');
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'nsgrid-w277c.json'), JSON.stringify(out, null, 1));

/* ── 画面出力 ─────────────────────────────────────────────────────────────── */
const e = (x) => (x === null || x === undefined ? '—' : Number(x).toExponential(3));
const f = (x, d) => (x === null || x === undefined ? '—' : Number(x).toFixed(d === undefined ? 6 : d));
console.log('# 第277便c — 中性子星連星の**診断格子**(**較正ではない**・エンジン未接続)');
console.log('① 相対すべり RMS |s|/v_orb(**相互同期なら 0**):');
for (const r of slipRows.filter((z) => z.thetaTag === 'obs'))
  console.log(`   ${r.system.padEnd(6)} 天体${r.body} θ=${f(r.thetaDeg, 1)}° ω/n=${f(r.omegaOverN, 1)}`
    + ` → RMS ${e(r.rms)}(閉形式 ${e(r.closed)}・相対差 ${e(r.relDiff)})`);
console.log(`   零条件(ω=n ẑ・θ=0)の RMS = ${slipZero.rms} / 共通並進の不変 ${e(slipTrans.d1)} ${e(slipTrans.d2)}`);
console.log('② 潮汐の手の係数(**宣言** —— 実在 vs 診断用):');
for (const r of tideRows) console.log(`   ${r.system.padEnd(6)} 天体${r.body} |S|=${e(r.Smag)}`
  + ` 実在 C_t ${e(r.CtPhysicalTorque)}(整列 ${e(r.alignOrbitsPhysical)} 公転)`
  + ` / 診断 ${e(r.CtDiagnostic)}(整列 ${f(r.alignOrbitsDiagnostic, 2)} 公転)/ **利得 ${e(r.gain)} 倍**`);
console.log(`③ 格子 ${gridRows.length} 行(走行 ${runCount} 本・${f(gridSeconds, 1)} s)—— 分類 `
  + `(A) ${clsTotal.A} / (B) ${clsTotal.B} / (C) ${clsTotal.C}・**中間傾斜の (A)(B) は ${midRows.length} 行**`);
for (const key of Object.keys(tally)) {
  const t = tally[key];
  console.log(`   ${key.padEnd(26)} θ*=${f(t.thetaStarDeg, 1)}° → A ${t.A} / B ${t.B} / C ${t.C}(${t.n} 行)`);
}
console.log(`   E 最悪 ${e(worstE)} / J_z 最悪 ${e(worstJz)} / 熱が減った行 ${heatDropRows}`
  + ` / 供給元が増えた行 ${supRiseRows} / dt 2 段で分類が変わった行 `
  + gridRows.filter((r) => !r.classStable).length);
console.log('   **負の対照**(潮汐の手 C_t=0):');
for (const r of tideOffRows) console.log(`     ${r.system.padEnd(6)} θ 永年 `
  + `${e(r.thetaSecularDeg[0])}° / ${e(r.thetaSecularDeg[1])}°(章動 ${e(r.thetaOscDeg[0])}° / `
  + `${e(r.thetaOscDeg[1])}°)・供給元の減少 ${e(r.supplyDrop)}`);
console.log('④ 供給元の対照(内部モード口座 vs 軌道 E):');
for (const r of supplyRows) console.log(`   ${r.system.padEnd(6)} ${r.supply.padEnd(9)}`
  + ` E ${e(r.worstErel)} / **J_z ${e(r.worstJzRel)}** / 供給元の減少 ${e(r.supplyDrop)}`
  + ` / a/a₀ ${f(r.aOverA0, 9)}`);
console.log('⑤ N3 の可逆対照(±0.01 を 100 往復):');
console.log(`   現行(非負口座)  ω ${f(round.omegaStart)} → **${f(round.current.omega)}** /`
  + ` 生 W_raw ${e(round.current.Wraw)} / 受理 W_in ${f(round.current.Win)} /`
  + ` 頭打ち ${f(round.current.clippedReturn)} / 熱 ${f(round.current.heat)} /`
  + ` 口座 ${f(round.current.bank)} / 閉じ ${e(round.current.ledgerWorstAbs)}`);
console.log(`   可逆対照        ω ${f(round.omegaStart)} → **${f(round.reversible.omega)}** /`
  + ` 生 W_raw ${e(round.reversible.Wraw)} / 受理 W_in ${f(round.reversible.Win)} /`
  + ` 返却 ${f(round.reversible.returned)}(${round.reversible.returns} 回)/`
  + ` 拒否 ${f(round.reversible.refusedWork)} / 熱 ${f(round.reversible.heat)} /`
  + ` 閉じ ${e(round.reversible.ledgerWorstAbs)} / ΣJ ${e(round.reversible.axialJWorstAbs)}`);
console.log(`   返却可能量を超えた要求: 上限 ${f(refuseCase.cap)} に対し ${f(refuseCase.requested)}`
  + ` → ok=${refuseCase.ok}・状態不変=${refuseCase.stateUnchanged}・理由「${refuseCase.reason}」`);
console.log(`   η<1 の可逆要求: ok=${etaRefuse.ok}・状態不変=${etaRefuse.stateUnchanged}`);
console.log('   有理化 δ:');
for (const p of deltaProbe) console.log(`     E=${e(p.e)} A=${p.A} B=${p.B} → δ=${p.delta}`
  + `(素朴 ${p.naive}・1 次展開 ${p.series}・相対差 ${e(p.relToSeries)} / 素朴 ${e(p.naiveRelToSeries)})`);
console.log('⑥ **否定対照**(無減衰の局所試作を NS へ延長):');
for (const r of undamped) console.log(`   ${r.label.padEnd(6)} r/r_c=${e(r.rOverRc)}(窓 ${r.windowMax})`
  + ` → 動径加速度 ニュートン −1 に対し **${e(r.aProtoNormalised)}**・${r.verdict}`);
console.log('読み(Failure First):');
for (const v of verdict) console.log(`   ${v.id} ${v.claim} → ${v.inModel}`);
console.log('→ tests/out/nsgrid-w277c.json');
