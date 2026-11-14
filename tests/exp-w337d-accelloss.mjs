// 第337便d(原仮定者の指示(2026-11-14 —— 第138報)「慣性移動の、自分自身を除いた慣性決定力場に対する加減速は、加速の方がわずかに多くのエネルギーが必要と推測する」
//   「慣性決定力場に対する加減速にわずかでも差が有るなら、供給が無ければいずれ、自分自身の慣性移動が減衰し、慣性決定力場に引きずられるだけの状態になる」
//   「連星の軌道は、近点と遠点が存在し、慣性移動に加減速が発生する」・統括の検証項目 R340):
//   **慣性移動の加減速の差の候補の器 —— 型(線形の抵抗 L1・L2/加減速の非対称 S0・S0a・S0d/速さの依存 S1・S2)ごとの 1 周の損失と永年の変化(閉じた式・求積・数値の積分 2 刻み)・
//   行き着く先(長い走行)・観測の目安からのノブの上限(同じノブで 5 系)・供給との釣り合いに要る仕事率・太陽–地球–月の 3 体の u**
//   (段 accelloss-337d —— 正本 tests/out/accelloss-337d.json・lib tests/lib-w337d-accelloss.mjs)。**診断だけ** ——
//   エンジン・内蔵の本・受理器・第335便までの lib の本文は変えない。供給の式(枝 a)・ロックの式(枝 c)は実装しない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w337d-accelloss.mjs —— 第317便d の satan の型・領域の宣言なし)。入力のファイルは無い。1 プロセス。
//
// ■ 走らせたノブの格子と判定の物差し(正本の先頭 —— 式の形の宣言ではなく、何を測ったかの記録)
//   T1: 単位 G = 1・a = 1・c = 1000(|u|/c ≈ 1e-3)。e ∈ {0, 0.1, 0.3, 0.6}・系 4(固定に近い源 m₁/m₂ = 1e-6〔受け手だけ〕・動く源 m₁ = m₂〔受け手だけ・両方〕・自転する源 s₂ = 0.5 n ẑ〔受け手だけ〕)。
//     ノブの振幅(一次の範囲 —— 1 周の Δa/a ≈ 1e-6): L1 η = 1e-7・L2 η = 1e-4・S0 系 ε = 1e-6・S1 ε₀ = 1e-3・S2 ε₀ = 1。数値は RK4 の 1 周 1000 步・2000 步 × 4 周(抵抗なしの対照を同じ刻みで引く)。
//     物差し: 閉じた式 ÷ 求積 − 1(求積は 4096 点の台形 —— 型 2 の折れで O(h²))・数値 ÷ 求積 − 1・刻み 2 つの差・帳簿の残り(ΔE_mech + Q − W_f)/max(|Q|, |W_f|)。
//   T2: 長い走行(拡大したノブ —— 行き着く先の向きを見るため。観測の大きさではない)。
//   T3: 5 系(水星・地球・月・PSR B1913+16・PSR J0737−3039)× 読み 4(受け手だけ/両方 × 源の自転を U_ext に入れない/入れる)× 列 7 の求積。ノブの上限 = 観測の目安 ÷ |単位のノブの率|。
//     物差し: 1 つのノブの値で全部の系の上限の内に入るか(主の読みの最小の上限 = 合わせた上限・決める系・上限の広がり max/min)。
//   T4: 上限のノブでの熱の仕事率 Q̇ と場の口・釣り合いに要る供給の仕事率(= Q̇ —— 供給の式は枝 a)。
//   T5: 太陽–地球–月の 3 体(1 年・刻み 1 時間・抵抗なしの軌道の上で一次)の U_ext(重み m/r²・自己を除く和・太陽と地球の自転 あり/なし)と u・1 年の損失。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import * as L from './lib-w337d-accelloss.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w337d-accelloss-1';
export const AMEND = Object.freeze([]);
export const OUT_MAIN = 'tests/out/accelloss-337d.json';
export const TARGET = 'tests/lib-w337d-accelloss.mjs';   // html を読まない器の来歴の対象(純関数)
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const YR = L.DECL.yearS, ARCSEC = Math.PI / (180 * 3600);
export const NOT_CLAIM = Object.freeze(['型は候補(慣性移動の則ではない)—— どの型も第138報の推測を測るための入り口', '閉じた式は宣言した型の一次の軌道平均(導出の主張ではない)',
  'ノブの上限は観測の目安(文献の値・未照合・桁の目安)との比 —— 損失が在る/無いの断定ではない', '電磁波の抵抗は第138報の例え(天体に共通の抵抗の則として書かない)',
  '行き着く先は宣言した型・初期条件・拡大したノブの数値の表', '供給の式は枝 a・ロックの式は枝 c(本枝は要る量だけ)', '自転軸は軌道の面の法線に置いた(傾きのノブは振っていない)']);
/** 器の宣言(走らせた格子) */
export const PLAN = Object.freeze({
  t1: Object.freeze({ G: 1, a: 1, c: 1000, eList: Object.freeze([0, 0.1, 0.3, 0.6]),
    systems: Object.freeze({ fixed: Object.freeze({ m1: 1e-6, m2: 1, mode: 'recv', s2n: 0 }), moveRecv: Object.freeze({ m1: 0.5, m2: 0.5, mode: 'recv', s2n: 0 }),
      moveBoth: Object.freeze({ m1: 0.5, m2: 0.5, mode: 'both', s2n: 0 }), spinRecv: Object.freeze({ m1: 1e-6, m2: 1, mode: 'recv', s2n: 0.5 }) }),
    eOther: 0.3, knob: Object.freeze({ L1: 1e-7, L2: 1e-4, S0: 1e-6, S0a: 1e-6, S0d: 1e-6, S1: 1e-3, S2: 1 }), steps: Object.freeze([1000, 2000]), nOrb: 4 }),
  t2: Object.freeze({ nStep: 600, every: 10 }),
  t3: Object.freeze({ readings: Object.freeze(['recv|off', 'both|off', 'recv|on', 'both|on']), nQ: 4096 }),
  t5: Object.freeze({ hS: 3600, days: 365.25, alpha: 2, mSun: 1.98847e30 }),
  judge: Object.freeze({ closedTol: 1e-5, numTol: 2e-3, stepTol: 1e-3, ledgerTol: 1e-6, zeroTol: 1e-12 }),
});

/* ───────── T1 ───────── */
function t1Sys(k, e) { const p = PLAN.t1, d = p.systems[k]; const S0 = L.sysOf({ G: p.G, m1: d.m1, m2: d.m2, a: p.a, e, c: p.c, mode: d.mode }); return L.sysOf({ G: p.G, m1: d.m1, m2: d.m2, a: p.a, e, c: p.c, mode: d.mode, s2: [0, 0, d.s2n * S0.n] }); }
export function t1Rows() {
  const p = PLAN.t1, rows = [];
  const cases = [];
  for (const e of p.eList) cases.push(['fixed', e]);
  for (const k of ['moveRecv', 'moveBoth', 'spinRecv']) cases.push([k, p.eOther]);
  for (const [sk, e] of cases) {
    const S = t1Sys(sk, e), ctl = Object.fromEntries(p.steps.map((n) => [n, L.controlRun(S, { nOrb: p.nOrb, nStep: n })]));
    for (const col of L.COL_KEYS) {
      const kn = p.knob[col], Q = L.secularRates(S, col, kn), C = L.closedForm(S, col, kn);
      const N = p.steps.map((n) => L.numericRates(S, col, kn, { nOrb: p.nOrb, nStep: n, control: ctl[n] }));
      rows.push({ sys: sk, e, col, knob: kn, P: S.P, eBind: S.mu * S.GM / (2 * S.a), quad: Q, closed: C, num: Object.fromEntries(p.steps.map((n, i) => [n, N[i]])), controlDrift: N.map((x) => x.controlDrift) });
    }
  }
  return rows;
}

/* ───────── T2 ───────── */
export const T2_RUNS = Object.freeze([
  { key: 'L1fixed', col: 'L1', knob: 5e-4, m1: 1e-6, m2: 1, e: 0.3, s2rs: null, mode: 'recv', nOrb: 400, note: '型 1・源は固定・自転 0' },
  { key: 'L2fixed', col: 'L2', knob: 0.5, m1: 1e-6, m2: 1, e: 0.6, s2rs: null, mode: 'recv', nOrb: 400, note: '型 1(A = |a₀|/c)・c = 1000・源は固定' },
  { key: 'L1sync125', col: 'L1', knob: 5e-4, m1: 1e-6, m2: 1, e: 0, s2rs: 1.25, mode: 'recv', nOrb: 300, note: '型 1・源の自転の同期の半径 1.25(内側から)' },
  { key: 'L1sync100', col: 'L1', knob: 5e-4, m1: 1e-6, m2: 1, e: 0, s2rs: 1.0, mode: 'recv', nOrb: 300, note: '型 1・同期の半径ちょうど(円・u = 0)' },
  { key: 'L1sync080', col: 'L1', knob: 5e-4, m1: 1e-6, m2: 1, e: 0, s2rs: 0.8, mode: 'recv', nOrb: 300, note: '型 1・同期の半径 0.8(外側から)' },
  { key: 'S0ecc', col: 'S0', knob: 2e-3, m1: 1e-6, m2: 1, e: 0.6, s2rs: null, mode: 'recv', nOrb: 1500, note: '型 2・源は固定・e 0.6' },
  { key: 'S0circ', col: 'S0', knob: 2e-3, m1: 1e-6, m2: 1, e: 0, s2rs: null, mode: 'recv', nOrb: 200, note: '型 2・円' },
  { key: 'S2ecc', col: 'S2', knob: 2e3, m1: 1e-6, m2: 1, e: 0.6, s2rs: null, mode: 'recv', nOrb: 1500, note: '型 3(p = 2)・c = 1000・e 0.6' },
  { key: 'L1lockedBin', col: 'L1', knob: 5e-4, m1: 0.5, m2: 0.5, e: 0, s2rs: 'locked', mode: 'both', nOrb: 100, note: '型 1・相互にロックした円の連星(s₁ = s₂ = n)' },
  { key: 'L1freeBin', col: 'L1', knob: 5e-4, m1: 0.5, m2: 0.5, e: 0, s2rs: null, mode: 'both', nOrb: 100, note: '型 1・自転 0 の円の連星' },
  { key: 'S0lockedEcc', col: 'S0', knob: 2e-3, m1: 0.5, m2: 0.5, e: 0.3, s2rs: 'locked', mode: 'both', nOrb: 100, note: '型 2・平均の角速度でロックした離心の連星(s₁ = s₂ = n・e 0.3)' },
  { key: 'L1lockedEcc', col: 'L1', knob: 5e-4, m1: 0.5, m2: 0.5, e: 0.3, s2rs: 'locked', mode: 'both', nOrb: 100, note: '型 1・平均の角速度でロックした離心の連星(e 0.3)' },
]);
export function t2Rows() {
  const p = PLAN.t1, out = [];
  for (const R of T2_RUNS) {
    const S0 = L.sysOf({ G: 1, m1: R.m1, m2: R.m2, a: 1, e: R.e, c: p.c, mode: R.mode });
    let s2 = [0, 0, 0], s1 = [0, 0, 0];
    if (typeof R.s2rs === 'number') s2 = [0, 0, Math.sqrt(S0.GM / R.s2rs ** 3)];
    if (R.s2rs === 'locked') { s1 = [0, 0, S0.n]; s2 = [0, 0, S0.n]; }
    const S = L.sysOf({ G: 1, m1: R.m1, m2: R.m2, a: 1, e: R.e, c: p.c, mode: R.mode, s1, s2 });
    const LR = L.longRun(S, R.col, R.knob, { nOrb: R.nOrb, nStep: PLAN.t2.nStep, every: PLAN.t2.every, aMin: 0.05, aMax: 4 });
    const f = LR.samples[0], z = LR.samples[LR.samples.length - 1];
    out.push({ key: R.key, col: R.col, knob: R.knob, e0: R.e, mode: R.mode, s2z: s2[2], note: R.note, stop: LR.stop, orbits: LR.orbits, ledgerRel: LR.ledgerRel,
      first: f, last: z, aRatio: z.a / f.a, uRatio: f.u1 > 0 ? z.u1 / f.u1 : null, heatOverE0: z.Q / Math.abs(0.5 * S.GM * S.mu / S.a), samples: LR.samples.filter((_, i) => i % 5 === 0 || i === LR.samples.length - 1) });
  }
  // 型 2 の道(閉じた式の常微分方程式)と数値の比べ(S0ecc の標本の e で a/a₀ を引く)
  const tr = L.s0Track(0.6, [0.5, 0.4, 0.3, 0.2, 0.1, 0.05, 0.02, 0.01]);
  const se = out.find((r) => r.key === 'S0ecc'), chk = se.samples.filter((x) => x.orb > 0).map((x) => { const t = L.s0Track(0.6, [x.e])[0].aOverA0; return { orb: x.orb, e: x.e, aNum: x.a, aTrack: t, rel: x.a / t - 1 }; });
  return { runs: out, s0Track: tr, s0Check: { n: chk.length, maxAbsRel: Math.max(...chk.map((c) => Math.abs(c.rel))), last: chk[chk.length - 1] } };
}

/* ───────── T3・T4 ───────── */
export function sysSI(key, reading) {
  const d = L.LIT.systems[key], [mode, sp] = reading.split('|'), G = L.DECL.G;
  const a = d.a || L.aFromP(G * (d.m1 + d.m2), d.Pb);
  const on = sp === 'on';
  return L.sysOf({ G, m1: d.m1, m2: d.m2, a, e: d.e, c: L.DECL.c, mode, s1: [0, 0, on ? d.s1 : 0], s2: [0, 0, on ? d.s2 : 0] });
}
export function boundOf(key) {
  const b = L.LIT.bounds[key], d = L.LIT.systems[key], G = L.DECL.G;
  if (b.kind !== 'pbdotAbs') return { kind: b.kind, value: b.value };
  if (key === 'b1913') { const pg = L.petersPbdot(G, L.DECL.c, d.m1, d.m2, d.Pb, d.e); return { kind: b.kind, value: b.nSigma * b.ratioSigma * Math.abs(pg), pbdotGW: pg }; }
  return { kind: b.kind, value: b.nSigma * b.sigma };
}
export function t3Rows() {
  const rows = [];
  for (const key of Object.keys(L.LIT.systems)) {
    const B = boundOf(key);
    for (const rd of PLAN.t3.readings) {
      const S = sysSI(key, rd), K0 = L.keplerAt(S, 0), Kp = L.keplerAt(S, Math.PI), F0 = L.pairForces(S, 'L1', 1, K0.r, K0.v), Fp = L.pairForces(S, 'L1', 1, Kp.r, Kp.v);
      const uMax = Math.max(Math.hypot(...F0.u1), Math.hypot(...Fp.u1)) / L.DECL.c, uMin = Math.min(Math.hypot(...F0.u1), Math.hypot(...Fp.u1)) / L.DECL.c;
      const cols = {};
      for (const col of L.COL_KEYS) {
        const Q = L.secularRates(S, col, 1, { nQ: PLAN.t3.nQ });
        const rate = B.kind === 'adotRel' ? Math.abs(Q.adot / S.a) * YR : B.kind === 'adotAbs' ? Math.abs(Q.adot) * YR : Math.abs(Q.PdotOverP * S.P);
        const kMax = rate > 0 ? B.value / rate : null;
        cols[col] = { adotPerKnob: Q.adot, edotPerKnob: Q.edot, wdotPerKnob: Q.wdot, PdotOverPPerKnob: Q.PdotOverP, QdotPerKnob: Q.Qorb / S.P, WfPerKnob: Q.Wforb / S.P, dEorbPerKnob: Q.dEorb,
          rate, kMax, atBound: kMax === null ? null : { adotPerYr: Q.adot * kMax * YR, wdotArcsecPerYr: Q.wdot === null ? null : Q.wdot * kMax * YR / ARCSEC, QdotW: Q.Qorb / S.P * kMax, WfW: Q.Wforb / S.P * kMax,
            QoverEbindPerYr: Q.Qorb / S.P * kMax * YR / (0.5 * S.GM * S.mu / S.a) } };
      }
      rows.push({ key, reading: rd, main: rd === L.LIT.systems[key].main + '|off', a: S.a, e: S.e, P: S.P, eBind: 0.5 * S.GM * S.mu / S.a, uOverC: { max: uMax, min: uMin }, superluminalU: uMax > 1, bound: B, cols });
    }
  }
  return rows;
}
/** 合わせた上限(主の読み・列ごと): 系ごとの上限・最小・決める系・広がり・合わせた上限での各系の率 ÷ 目安 */
export function jointOf(t3) {
  const out = {};
  for (const col of L.COL_KEYS) {
    const mains = t3.filter((r) => r.main && fin(r.cols[col].kMax));
    const ks = mains.map((r) => ({ key: r.key, kMax: r.cols[col].kMax }));
    const mn = ks.reduce((a, b) => (b.kMax < a.kMax ? b : a)), mx = ks.reduce((a, b) => (b.kMax > a.kMax ? b : a));
    out[col] = { perSystem: ks, joint: mn.kMax, binding: mn.key, spread: mx.kMax / mn.kMax, loosest: mx.key,
      fractions: mains.map((r) => ({ key: r.key, frac: mn.kMax / r.cols[col].kMax })) };
  }
  return out;
}

/* ───────── T5 太陽–地球–月 ───────── */
export function t5Run() {
  const P = PLAN.t5, G = L.DECL.G, sys = L.LIT.systems, mS = P.mSun, mE = sys.moon.m2, mM = sys.moon.m1;
  const aE = sys.earth.a, eE = sys.earth.e, aM = sys.moon.a, eM = sys.moon.e;
  // 初期: 地球は近日点・月は地球に対して近地点(面は同じ —— 暦ではない)
  const GMs = G * (mS + mE + mM), GMem = G * (mE + mM);
  const rEM0 = [aE * (1 - eE), 0, 0], vEM0 = [0, Math.sqrt(GMs * (1 + eE) / (aE * (1 - eE))), 0];   // 太陽 → 地球月の重心
  const rM0 = [aM * (1 - eM), 0, 0], vM0 = [0, Math.sqrt(GMem * (1 + eM) / (aM * (1 - eM))), 0];   // 地球 → 月
  const pE = [rEM0[0] - rM0[0] * mM / (mE + mM), 0, 0], pM = [rEM0[0] + rM0[0] * mE / (mE + mM), 0, 0];
  const vE = [0, vEM0[1] - vM0[1] * mM / (mE + mM), 0], vM = [0, vEM0[1] + vM0[1] * mE / (mE + mM), 0];
  const M = mS + mE + mM, pCm = pE.map((x, i) => (mE * x + mM * pM[i]) / M), vCm = vE.map((x, i) => (mE * x + mM * vM[i]) / M);
  let y = [...pCm.map((x) => -x), ...vCm.map((x) => -x), ...pE.map((x, i) => x - pCm[i]), ...vE.map((x, i) => x - vCm[i]), ...pM.map((x, i) => x - pCm[i]), ...vM.map((x, i) => x - vCm[i])];
  const ms = [mS, mE, mM];
  const der = (y) => { const d = new Array(18).fill(0); for (let i = 0; i < 3; i++) { for (let k = 0; k < 3; k++) d[6 * i + k] = y[6 * i + 3 + k]; for (let j = 0; j < 3; j++) { if (j === i) continue; const r = [0, 1, 2].map((k) => y[6 * j + k] - y[6 * i + k]), rm = Math.hypot(...r); for (let k = 0; k < 3; k++) d[6 * i + 3 + k] += G * ms[j] * r[k] / (rm ** 3); } } return d; };
  const step = (y, h) => { const ax = (u, k, s) => u.map((x, i) => x + s * k[i]); const k1 = der(y), k2 = der(ax(y, k1, h / 2)), k3 = der(ax(y, k2, h / 2)), k4 = der(ax(y, k3, h)); return y.map((x, j) => x + (h / 6) * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j])); };
  const n = Math.round(P.days * 86400 / P.hS), h = P.hS;
  const traj = [y]; for (let i = 0; i < n + 1; i++) traj.push(y = step(y, h));
  const spins = [[0, 0, sys.earth.s2], [0, 0, sys.earth.s1], [0, 0, sys.moon.s1]];   // 太陽・地球・月の観測自転(軸は z)
  const body = (yy, i) => ({ p: yy.slice(6 * i, 6 * i + 3), v: yy.slice(6 * i + 3, 6 * i + 6), s: spins[i], m: ms[i] });
  const res = {};
  for (const spin of [false, true]) {
    const U = (yy, i) => L.uExtOf({ at: body(yy, i).p, v: body(yy, i).v, sources: [0, 1, 2].filter((j) => j !== i).map((j) => body(yy, j)), alpha: P.alpha, spin }).u;
    const us = traj.map((yy) => [U(yy, 1), U(yy, 2)]);
    let qE1 = 0, qM1 = 0, qE0 = 0, qM0 = 0, dEps1 = 0, dEps0 = 0, dEps1recv = 0, dEps0recv = 0, uEmin = Infinity, uEmax = 0, uMmin = Infinity, uMmax = 0;
    for (let i = 1; i <= n; i++) {
      const yy = traj[i], uE = us[i][0], uM = us[i][1];
      const duE = uE.map((x, k) => (us[i + 1][0][k] - us[i - 1][0][k]) / (2 * h)), duM = uM.map((x, k) => (us[i + 1][1][k] - us[i - 1][1][k]) / (2 * h));
      const dE1 = L.dragOf('L1', 1, { u: uE }), dM1 = L.dragOf('L1', 1, { u: uM }), dE0 = L.dragOf('S0', 1, { u: uE, du0: duE, c: L.DECL.c }), dM0 = L.dragOf('S0', 1, { u: uM, du0: duM, c: L.DECL.c });
      const vRel = [0, 1, 2].map((k) => yy[15 + k] - yy[9 + k]);
      qE1 += mE * dE1.q * h; qM1 += mM * dM1.q * h; qE0 += mE * dE0.q * h; qM0 += mM * dM0.q * h;
      dEps1 += vRel.reduce((s, x, k) => s + x * (dM1.f[k] - dE1.f[k]), 0) * h; dEps0 += vRel.reduce((s, x, k) => s + x * (dM0.f[k] - dE0.f[k]), 0) * h;
      dEps1recv += vRel.reduce((s, x, k) => s + x * dM1.f[k], 0) * h; dEps0recv += vRel.reduce((s, x, k) => s + x * dM0.f[k], 0) * h;
      const ue = Math.hypot(...uE), um = Math.hypot(...uM); uEmin = Math.min(uEmin, ue); uEmax = Math.max(uEmax, ue); uMmin = Math.min(uMmin, um); uMmax = Math.max(uMmax, um);
    }
    // 二体(月 → 地球の源だけ・受け手だけ・自転 あり/なし)の 1 年の比べ
    const S2 = L.sysOf({ G, m1: mM, m2: mE, a: aM, e: eM, c: L.DECL.c, mode: 'recv', s2: [0, 0, spin ? sys.moon.s2 : 0] });
    const Q1 = L.secularRates(S2, 'L1', 1), Q0 = L.secularRates(S2, 'S0', 1);
    const da = (dEps) => 2 * aM * aM * dEps / GMem;   // 比エネルギーの変化 → 半長軸の変化(一次)
    res[spin ? 'on' : 'off'] = { uEarth: { min: uEmin, max: uEmax }, uMoon: { min: uMmin, max: uMmax },
      L1: { heatEarth: qE1, heatMoon: qM1, daMoonBoth: da(dEps1), daMoonRecv: da(dEps1recv), daTwoBody: Q1.adot * YR },
      S0: { heatEarth: qE0, heatMoon: qM0, daMoonBoth: da(dEps0), daMoonRecv: da(dEps0recv), daTwoBody: Q0.adot * YR } };
  }
  const yN = traj[n], dpos = Math.hypot(...[0, 1, 2].map((k) => yN[6 + k] - yN[k])) / aE;
  return { steps: n, hS: h, earthSunEndOverAU: dpos, res };
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const jd = PLAN.judge, T1 = J.t1;
  const rel = (x, y) => Math.abs(x - y) / Math.max(Math.abs(y), 1e-300);
  const nonzero = (r) => Math.abs(r.quad.adot) > 1e-15;
  return {
    pure: Object.values(J.pure.gates).every(Boolean),
    t1Complete: T1.length === (PLAN.t1.eList.length + 3) * L.COL_KEYS.length,
    t1Closed: T1.filter((r) => r.closed && nonzero(r)).every((r) => rel(r.closed.adot, r.quad.adot) <= jd.closedTol),
    t1Numeric: T1.filter(nonzero).every((r) => PLAN.t1.steps.every((n) => rel(r.num[n].adot, r.quad.adot) <= jd.numTol)),
    t1Steps: T1.filter(nonzero).every((r) => rel(r.num[PLAN.t1.steps[0]].adot, r.num[PLAN.t1.steps[1]].adot) <= jd.stepTol),
    t1Zero: T1.filter((r) => !nonzero(r)).every((r) => PLAN.t1.steps.every((n) => Math.abs(r.num[n].adot) <= jd.zeroTol)),
    t1Ledger: T1.filter(nonzero).every((r) => PLAN.t1.steps.every((n) => r.num[n].ledgerRel <= jd.ledgerTol)),
    t1ZeroHeat: T1.filter((r) => !nonzero(r)).every((r) => PLAN.t1.steps.every((n) => Math.abs(r.num[n].Qorb) <= jd.zeroTol * r.eBind)),
    t2Complete: J.t2.runs.length === T2_RUNS.length && J.t2.runs.every((r) => fin(r.last.a) && fin(r.last.e)),
    t3Complete: J.t3.length === Object.keys(L.LIT.systems).length * PLAN.t3.readings.length && Object.values(J.joint).every((j) => fin(j.joint) && j.joint > 0),
    t5Finite: ['off', 'on'].every((k) => fin(J.t5.res[k].L1.daMoonBoth) && fin(J.t5.res[k].S0.daMoonBoth)),
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const t1 = t1Rows(); mark('t1');
  const t2 = t2Rows(); mark('t2');
  const t3 = t3Rows(), joint = jointOf(t3); mark('t3');
  const t5 = t5Run(); mark('t5');
  const J = { pure, t1, t2, t3, joint, t5, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/* ───────── 走らせる ───────── */
const writeJson = (OUT, out) => { fs.mkdirSync(path.dirname(OUT), { recursive: true }); fs.writeFileSync(OUT, JSON.stringify(out, null, 1).replace(/\[\s*(-?[\d.eE+-]+(?:,\s*-?[\d.eE+-]+|,\s*null)*)\s*\]/g, (m, a) => '[' + a.replace(/\s+/g, '') + ']') + '\n'); };
export const CODE = Object.freeze(['tests/exp-w337d-accelloss.mjs', 'tests/lib-w337d-accelloss.mjs', 'tests/lib-w335b-carryledger.mjs', 'tests/lib-w334b-ledger.mjs', 'tests/lib-w334a-heightlaw.mjs',
  'tests/lib-w333a-rotdiff.mjs', 'tests/lib-w333b-axialfield.mjs', 'tests/lib-w332a-eqband.mjs', 'tests/lib-w332b-transgeo2.mjs', 'tests/lib-w331a-coordtwist.mjs', 'tests/lib-w331b-centrifugal.mjs',
  'tests/lib-w331c-k1scale.mjs', 'tests/lib-w330a-spinclass.mjs', 'tests/lib-w330b-dragweight.mjs', 'tests/lib-w326d-axialheat.mjs', 'tests/lib-w312a-decay.mjs', 'tests/lib-w310d-shell.mjs',
  'tests/lib-w309a-invsq.mjs', 'tests/lib-w307a-sphereaxial.mjs', 'tests/lib-w272e-provenance.mjs']);
export async function main() {
  const t0 = Date.now();
  const OUT = process.env.W337D_OUT ? (path.isAbsolute(process.env.W337D_OUT) ? process.env.W337D_OUT : path.join(ROOT, process.env.W337D_OUT)) : path.join(ROOT, OUT_MAIN);
  console.log('第337便d accelloss(版 ' + HARNESS_VERSION + ')');
  const R = runAll();
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w337d-accelloss.mjs', target: TARGET,
    ruling: '原仮定者の指示(2026-11-14 —— 第138報)「慣性移動の、自分自身を除いた慣性決定力場に対する加減速は、加速の方がわずかに多くのエネルギーが必要と推測する」・統括の検証項目 R340',
    decl: L.DECL, cols: L.COLS, lit: L.LIT, plan: PLAN, t2Runs: T2_RUNS, amend: AMEND, notClaim: NOT_CLAIM, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第337便d', target: TARGET, code: CODE, inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'accelloss', engine: 'Node の純関数だけ(html を読まない・エンジンの步を進めない —— 自前の求積と RK4)', notClaim: NOT_CLAIM });
  writeJson(OUT, out);
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();
