// 第327便f(原仮定者の指示(2026-11-05)「金星の逆行自転は、大気熱潮汐の影響と、地球との共鳴を採用する」「R_dはK1で固定し、観測の自転もトルクの釣り合いで進める」・
//   統括の検証項目 R300): **金星の自転のトルクの釣り合い(族 E が主)に固体の重力潮汐・大気の熱潮汐・地球との共鳴の口を足す器 —— 釣り合いの振幅と共鳴の割合・安定と解の枝・
//   共鳴のトルクの大きさ・規則を固定した 太陽–火星 → 太陽–地球–月(3 体の帳簿)・帳簿**(段 venustide-327f —— 正本 tests/out/venustide-w327f.json・lib tests/lib-w327f-venustide.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・beta/index.html は変えない。R_d は K1 のまま・銀河と太陽の口は第326便d・第327便a の K1 の口のまま(第327便e の別の半径は使わない)。
//
// Node だけ(対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、第327便e の器の入力と読み口〔partI・stateFor・gradT —— 第326便d の写しの読み口〕を
//   そのまま使う —— K1 の核の式を写さない)。入力は html だけ(他の正本・データは読まない)。1 プロセス(子プロセスなし)。t = 0 の読み口と純関数だけ(步を進めない)。
//
// ■ 何をするか(入力は在位の 🗺️ solarSystem16Inertial3d の J2000 の転記 —— 新たに一次資料を取らない。文献の値は lib の DECL.lit —— 本便は一次資料に当たっていない)
//   O 観測の周期(宣言の値): k = T_orb/T_rot・1 公転に太陽を向く回数・太陽日・地球との会合周期と太陽日の比(≈ 5)・厳密な 5:−4 の自転と観測との差。本の状態からの同じ量(比べる列)
//   V 金星のトルクの釣り合い(族 E 主・族 S 記録・源 J 主・p の格子 × Q の格子 × τ_0 の格子 × 共鳴の割合 χ): 銀河と K1 の口の軸の向きのトルク × τ_0(Γ⁰ = I/τ_0)・
//     固体の潮汐のトルク・熱潮汐の振幅 N_0 と気圧の相対の振幅 ε・文献の桁との比・τ_0 の閾(銀河と K1 の口が固体の潮汐と同じ大きさになる τ_0 と、文献の桁の上の端で足りる τ_0)
//   B 釣り合いの点と安定(振幅の比 × 固体の型 × 熱潮汐の型〔緩和は ω_0 の格子〕× τ_0〔無限・年齢〕× p): 解の枝(逆行・同期・順行)と安定・共鳴で固定できる振幅の窓
//   R 地球との共鳴の口: 会合周期の平均の係数 Z(宣言の観測の周期と本の状態)・N_max((B − A)/C の格子)・固定の幅と観測の自転の差・要る大きさとの比・単独で足りる (B − A)/C
//   M 太陽–火星・L 太陽–地球–月(3 体 —— 第327便e の口の接続から潮汐の口を外し、本便の口を足す): 金星の振幅 ε を固定(表面気圧で縮める)・ω_0 の規則 2 つ・固体の潮汐は文献の k2/Q・
//     共鳴の口は隣の天体(火星 ← 地球・地球 ← 金星・月 ← 地球の 1:1)。観測の自転での正味のトルク・釣り合いの点・固定・変化の時間 —— 合う・合わないを記録(合わせない)
//   H 帳簿(候補ごとの由来別の Q・P・軌道の仕事・日射の供給・閉じ)・P 純関数の場面
// ■ 言わないこと: 金星の逆回転・内部熱の説明ではない。解いた振幅と割合は条件つきの記録(採らない —— 在位の本へ入れない)。文献の値は桁として並べるだけ。火星と地球–月で合わせない。
//   負の振幅を 0 に丸めない。τ_0 は宣言の格子(値を決めていない)。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as XE from './exp-w327e-axialdiff.mjs';
import * as E from './lib-w326d-axialheat.mjs';
import * as LS from './lib-w327a-axialsum.mjs';
import * as LD from './lib-w327e-axialdiff.mjs';
import * as LF from './lib-w327f-venustide.mjs';
// 第281便a の領域 hash の宣言(器と lib から deriveScope で引いた下限 —— 版 8 の宣言: ワンタップ対照の A/B を走らせない〔abBody:false〕・説明文の欄を読まない〔keepProse なし〕。
//   presets は器が .find で引く在位の本 1 本だけ)
const REGEN_SCOPE = {"presets":["solarSystem16Inertial3d"],"roots":["HP.REL_DRAG_INVSQ_SRC_MOMENT_VERSION","HP.REL_DRAG_INVSQ_VERSION","HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.inertialDragIsqPointAt","HP.inertialDragIsqState","HP.sim","HP.validatePreset","ctx","cw"],"core":true,"consts":[],"complete":true,"abBody":false};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w327f-venustide-1';
export const OUT_MAIN = 'tests/out/venustide-w327f.json';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze(['金星の逆回転の説明ではない(この口の型・この宣言の下で釣り合いの点が観測の自転と同じになる条件の記録)', '内部熱の説明ではない(応答の尺度 τ_0 は宣言の格子 —— 観測の熱流に合わせていない)',
  '解いた熱潮汐の振幅と共鳴の割合は採らない(在位の本へ入れない —— 文献の値は桁として並べるだけ)', '火星と地球–月は規則を固定して当てただけ(合わせていない)',
  '負の振幅は不採用(0 へ丸めない)', 'A は「太陽の口が銀河だけ」という接続の帰結(銀河場の同定と数えない)', 'R_d は K1 のまま(第327便e の別の半径は記録のまま —— 採らない)']);
const D = LF.DECL, LIT = D.lit, DAY = 86400;
const NOTIDE = Object.freeze(Object.fromEntries(Object.entries(LD.DECL.ports).map(([k, v]) => [k, Object.freeze({ k1: v.k1, tide: Object.freeze([]) })])));   // 第327便e の口の接続から潮汐の口を外す(本便の口に替える)
const SYS = Object.freeze({ venus: ['sun', 'venus'], mars: ['sun', 'mars'], triEM: ['sun', 'earth', 'moon'] });
const TAUS = Object.freeze(D.tau0.grid.concat([LF.TAU_AGE, Infinity]).sort((x, y) => x - y));
const tauKey = (t) => (t === Infinity ? 'inf' : (t === LF.TAU_AGE ? 'age' : t.toExponential(0)));
const tauOf = (k) => (k === 'inf' ? Infinity : LF.TAU_AGE);

/* ───────── I 入力(第327便e の partI —— 太陽・金星・火星・地球・月)───────── */
export function partI(HP) {
  const I = XE.partI(HP), st = { now: XE.stateFor(HP, 'now'), J: XE.stateFor(HP, 'J') }, K = {};
  for (const src of D.sources) {
    K[src] = {};
    for (const key of ['venus', 'mars', 'earth', 'moon']) for (const s2 of LD.DECL.ports[key].k1) K[src][key + ':' + s2] = XE.gradT(st[src], XE.IDX[key], XE.IDX[s2]);
  }
  return { I, K };
}
const tidesOf = () => { throw new RangeError('潮汐の口は外した(本便の口に替える)'); };
/** 銀河と K1 の口だけの系(第327便e の systemOf —— 潮汐の口なし) */
export function sysOf(IN, src, keys, p) { return LD.systemOf(IN.I.bodies, keys, p, (r, s2) => IN.K[src][r + ':' + s2], tidesOf, NOTIDE); }
/** 太陽の式の A(潮汐の口が無いので他の行は未解決 —— A だけを使う)と τ_0 での prm(τ_0 = ∞ は null) */
export function prmAt(IN, sys, family, tau) {
  const A = LS.solve(sys, LD.paramsOf(IN.I.bodies, family, 1)).A;
  return { A, prm: tau === Infinity ? null : Object.assign(LD.paramsOf(IN.I.bodies, family, 1 / tau), { A }) };
}

/* ───────── 口の材料(SI)───────── */
const raiserMass = (IN, key) => IN.I.bodies[key].m;
/** 受け手 key・起潮天体 rs の固体の潮汐の材料(N_Q・n・揃えの滑り)。Q は文献の値(金星は格子の値を呼び手が渡す) */
export function solidOf(IN, key, rs, Q) {
  const b = IN.I.bodies[key], orb = IN.I.tides[key + ':' + rs], k2 = LIT.k2[key], Xp = LF.tidalScale({ Mr: raiserMass(IN, rs), R: b.R, a: orb.sma }), NQ = 1.5 * k2 / Q * Xp;
  return { n: orb.n, sma: orb.sma, Xp, k2, Q, NQ, wAnc: E.norm(E.sub(orb.n, E.scale(b.a, b.s))) };
}
/** 熱潮汐の材料(振幅の単位 —— 1 Pa あたり・観測の滑りの σ)*/
export function thermalBase(IN, key) {
  const b = IN.I.bodies[key], orb = IN.I.tides[key + ':sun'], ps = LIT.surfacePressurePa[key];
  return { n: orb.n, sma: orb.sma, ps, perPa: LF.thermalN0({ eps: 1, ps: 1, Msun: IN.I.bodies.sun.m, M: b.m, R: b.R, a: orb.sma }), sigmaObs: 2 * E.norm(E.sub(E.scale(b.a, b.s), orb.n)) };
}
const portsOf = (key, sol, th, form, sForm, N0, omega0, Nr) => {
  const out = [];
  for (const q of sol) out.push({ kind: 'solid', form: sForm, src: q.rs, n: q.n, NQ: q.NQ, wAnc: q.wAnc });
  if (th && th.ps > 0) out.push({ kind: 'thermal', form, src: 'sun', n: th.n, N0, omega0 });
  if (Nr !== undefined && Nr !== 0) out.push({ kind: 'res', src: 'res', Nr });
  return out;
};

/* ───────── O 観測の周期 ───────── */
export function partO(IN) {
  const P = LF.observedPeriods(), b = IN.I.bodies.venus, nV = IN.I.tides['venus:sun'].n, nE = IN.I.tides['earth:sun'].n, nH = E.scale(nV, 1 / E.norm(nV));
  const PV = 2 * Math.PI / E.norm(nV) / DAY, PE = 2 * Math.PI / E.norm(nE) / DAY, w = E.norm(E.sub(E.scale(b.a, b.s), nV)), solarBook = 2 * Math.PI / w / DAY, synBook = 1 / (1 / PV - 1 / PE);
  return { declared: P, book: { spinDays: 2 * Math.PI / b.s / DAY, orbitDays: PV, earthOrbitDays: PE, k: b.s * E.dot(b.a, nH) / E.norm(nV), obliquityDeg: E.angDeg(E.scale(b.a, Math.sign(b.s)), nH),
    axisToOrbitNormalDeg: E.angDeg(b.a, nH), solarDays: solarBook, synodicDays: synBook, ratio: synBook / solarBook, sigmaObs: 2 * w } };
}

/* ───────── V 金星のトルクの釣り合い ───────── */
export function venusBase(IN) {
  const b = IN.I.bodies.venus, Om = E.scale(b.a, b.s), gk = {};
  for (const src of D.sources) { gk[src] = {}; for (const fam of D.families) { gk[src][fam] = {}; for (const p of D.pGrid) {
    const sys = sysOf(IN, src, SYS.venus, p), { A } = prmAt(IN, sys, fam, 1), ev = LS.evaluate(sys, Object.assign(LD.paramsOf(IN.I.bodies, fam, 1), { A })), r = ev.rows[1];
    gk[src][fam][p] = { A, gkTau: r.alongResidual, galTau: r.ports.find((q) => q.kind === 'gal').torqueAlong, k1Tau: r.ports.find((q) => q.kind === 'k1').torqueAlong, galTarget: r.ports.find((q) => q.kind === 'gal').nuAlong,
      k1Target: r.ports.find((q) => q.kind === 'k1').nuAlong, sunAlongRel: ev.rows[0].alongRel };
  } } }
  const solid = LIT.Q.venus.map((Q) => { const s = solidOf(IN, 'venus', 'sun', Q), pq = LF.solidPort('constQ', { Omega: Om, n: s.n, NQ: s.NQ }), pl = LF.solidPort('constLag', { Omega: Om, n: s.n, NQ: s.NQ, wAnc: s.wAnc });
    return Object.assign({ rs: 'sun' }, s, { alongQ: E.dot(pq.torque, b.a), alongLag: E.dot(pl.torque, b.a), k2DtSec: s.k2 / (Q * 2 * s.wAnc) }); });
  const th = thermalBase(IN, 'venus'), unit = {};
  for (const [fk, w0r] of [['constPhase', null]].concat(D.relaxOmega0.map((r) => ['relax', r]))) {
    const om0 = w0r === null ? null : w0r * th.sigmaObs, q = LF.thermalPort(fk, { Omega: Om, n: th.n, N0: 1, omega0: om0 });
    unit[fk + (w0r === null ? '' : ':' + w0r)] = { form: fk, omega0Ratio: w0r, omega0: om0, F: q.F, u: E.dot(q.torque, b.a) };
  }
  const litN0 = LIT.venusEpsRange.map((e) => e * th.perPa * th.ps);
  return { gk, solid, thermal: Object.assign({}, th, { unit, litN0 }) };
}
/** 1 つの条件の解: D = −(銀河と K1 の口 + 固体の潮汐)の軸の向きのトルク・共鳴 N_r = χ D・熱潮汐 N_0 = (1 − χ) D/u(u は単位の振幅の軸の向きのトルク) */
export function venusSolveAt(IN, VB, { src, fam, p, Q, tau, chi, sForm = 'constQ', tForm = 'constPhase', check = true }) {
  const b = IN.I.bodies.venus, g = VB.gk[src][fam][p], s = VB.solid.find((q) => q.Q === Q), un = VB.thermal.unit[tForm];
  const gkAlong = tau === Infinity ? 0 : g.gkTau / tau, solidAlong = sForm === 'constQ' ? s.alongQ : s.alongLag, Dn = -(gkAlong + solidAlong), Nr = chi * Dn, N0 = (1 - chi) * Dn / un.u;
  const out = { src, fam, p, Q, tau: tauKey(tau), chi, sForm, tForm, gkAlong, solidAlong, D: Dn, Nr, N0, accepted: N0 >= 0, eps: N0 / (VB.thermal.perPa * VB.thermal.ps), N0OverSolid: N0 / s.NQ };
  if (check && N0 >= 0) {
    const sys = sysOf(IN, src, SYS.venus, p), { prm } = prmAt(IN, sys, fam, tau);
    const ev = LF.evaluateAll(sys, prm, { venus: portsOf('venus', [Object.assign({ rs: 'sun' }, s)], VB.thermal, un.form, sForm, N0, un.omega0, Nr) });
    out.alongRel = ev.rows[1].alongRel; out.ledger = ledgerOf(ev);
  }
  return out;
}
const ledgerOf = (ev) => { const L0 = ev.ledger; return { galaxySupply: L0.galaxySupply, k1Draw: L0.k1Draw, orbitWork: L0.orbitWork, resOrbitWork: L0.resOrbitWork, solarSupply: L0.solarSupply, heat: L0.heat,
  heatSolid: L0.heatSolid, heatPassiveLS: L0.heatPassiveLS, spinPower: L0.spinPower, residualRel: L0.residualRel, LTotalRel: L0.LTotalRel, k1TransferRel: L0.k1TransferRel, portCloseMaxRel: L0.portCloseMaxRel, holdWorkMaxRel: L0.holdWorkMaxRel }; };
export function partV(IN, VB) {
  const rows = [], worst = { alongRel: 0, residualRel: 0, LTotalRel: 0, portCloseMaxRel: 0, k1TransferRel: 0, rejected: 0 };
  const note = (r) => { if (!r.accepted) { worst.rejected++; return; } for (const k of ['alongRel']) worst[k] = Math.max(worst[k], r[k]); for (const k of ['residualRel', 'LTotalRel', 'portCloseMaxRel', 'k1TransferRel']) worst[k] = Math.max(worst[k], r.ledger[k]); };
  const tforms = Object.keys(VB.thermal.unit);
  // 全部の条件で釣り合いと帳簿を作り直す(門)—— 正本に残すのは源 J の χ = 0 の全部と、χ の格子(Q 主・τ_0 年齢と無限・p 主と p 0)
  for (const src of D.sources) for (const fam of D.families) for (const p of D.pGrid) for (const Q of LIT.Q.venus) for (const tau of TAUS) for (const chi of D.shares) for (const sForm of ['constQ', 'constLag']) for (const tForm of tforms) {
    const keep = src === D.sourceMain && sForm === 'constQ' && (chi === 0 ? tForm === 'constPhase' : (Q === LIT.Q.venusMain && (tau === Infinity || tau === LF.TAU_AGE) && (p === D.pMain || p === D.pAlso) && tForm === 'constPhase'));
    const big = src === D.sourceMain && fam === D.familyMain && Q === LIT.Q.venusMain && (tau === Infinity || tau === LF.TAU_AGE) && (p === D.pMain || p === D.pAlso) && chi === 0;
    const check = keep || big || (p === D.pMain && chi === 0.25);
    const r = venusSolveAt(IN, VB, { src, fam, p, Q, tau, chi, sForm, tForm, check });
    if (check) note(r);
    const mainRow = fam === D.familyMain && Q === LIT.Q.venusMain && (tau === Infinity || tau === LF.TAU_AGE) && (p === D.pMain || p === D.pAlso);
    if (keep || big) { if (!mainRow) delete r.ledger; rows.push(r); }   // 帳簿の全体は主の行だけ残す(他の行の閉じは worst に入れた)
  }
  // τ_0 の閾(源 × 族 × p × Q —— 一定の位相の型): τ_× = 銀河と K1 の口のトルク × τ_0 / 固体の潮汐・τ_lit = 文献の桁の上の端で足りる最小の τ_0
  const thr = [];
  for (const src of D.sources) for (const fam of D.families) for (const p of D.pGrid) for (const Q of LIT.Q.venus) {
    const g = VB.gk[src][fam][p], s = VB.solid.find((q) => q.Q === Q), litHi = VB.thermal.litN0[1], litLo = VB.thermal.litN0[0], uC = -VB.thermal.unit.constPhase.u;
    const solidNeed = s.alongQ / uC;   // τ_0 = ∞ の振幅(固体の潮汐だけ)
    thr.push({ src, fam, p, Q, gkTau: g.gkTau, tauCross: g.gkTau / s.alongQ, tauLitHi: litHi > solidNeed ? g.gkTau / ((litHi - solidNeed) * uC) : null, tauLitLo: litLo > solidNeed ? g.gkTau / ((litLo - solidNeed) * uC) : null,
      epsInf: solidNeed / (VB.thermal.perPa * VB.thermal.ps), epsAge: (solidNeed + g.gkTau / LF.TAU_AGE / uC) / (VB.thermal.perPa * VB.thermal.ps) });
  }
  // 宣言の観測の自転(243.025 d)での振幅の差(比べる列 —— 本の自転 243.0185 d と)
  const b = IN.I.bodies.venus, sDecl = 2 * Math.PI / (D.obs.venusSpinDays * DAY), alt = Object.assign({}, IN, { I: Object.assign({}, IN.I, { bodies: Object.assign({}, IN.I.bodies, { venus: Object.assign({}, b, { s: sDecl }) }) }) });
  const VB2 = venusBase(alt), r1 = venusSolveAt(IN, VB, { src: D.sourceMain, fam: D.familyMain, p: D.pAlso, Q: LIT.Q.venusMain, tau: LF.TAU_AGE, chi: 0 }), r2 = venusSolveAt(alt, VB2, { src: D.sourceMain, fam: D.familyMain, p: D.pAlso, Q: LIT.Q.venusMain, tau: LF.TAU_AGE, chi: 0 });
  return { rows, thresholds: thr, worst, declaredSpin: { sBook: b.s, sDecl, N0Book: r1.N0, N0Decl: r2.N0, rel: E.relD(r1.N0, r2.N0) } };
}

/* ───────── B 釣り合いの点と安定 ───────── */
export function partB(IN, VB, R) {
  const b = IN.I.bodies.venus, nA = E.dot(IN.I.tides['venus:sun'].n, b.a), xObs = b.s - nA, sRes = b.s * (R.declared.omRes / R.declared.sV), tol = D.syncTol * Math.abs(xObs), out = [];
  const grid = LF.scanGrid([nA, 0], xObs);
  const combos = [];
  for (const tk of D.tau0.branch) for (const p of (tk === 'inf' ? [D.pAlso] : [D.pMain, D.pAlso])) combos.push({ tk, p });
  const s = VB.solid.find((q) => q.Q === LIT.Q.venusMain), NmaxMain = R.NmaxMain;
  for (const { tk, p } of combos) {
    const tau = tauOf(tk), sys = sysOf(IN, D.sourceMain, SYS.venus, p), { prm } = prmAt(IN, sys, D.familyMain, tau);
    for (const sForm of ['constQ', 'constLag']) for (const [tKey, un] of Object.entries(VB.thermal.unit)) {
      const bal = venusSolveAt(IN, VB, { src: D.sourceMain, fam: D.familyMain, p, Q: LIT.Q.venusMain, tau, chi: 0, sForm, tForm: tKey, check: false });
      const rows = D.branchRatios.map((rt) => {
        const N0 = rt * bal.N0, ex = (sv) => ({ venus: portsOf('venus', [Object.assign({ rs: 'sun' }, s)], VB.thermal, un.form, sForm, N0, un.omega0) });
        const fn = (sv) => LF.alongAt(sys, prm, ex(sv), 'venus', sv), eq = LF.equilibria(fn, grid), zs = eq.roots.filter((z) => z.kind === 'zero');
        const roots = zs.map((z) => ({ s: z.s, days: 2 * Math.PI / z.s / DAY, branch: LF.branchOf(z.s, nA, tol), stable: z.stable, obs: Math.abs(z.s - b.s) <= 1e-6 * Math.abs(b.s) }));
        const obsRoot = roots.find((z) => z.obs) || null;
        // 観測の自転で残差が丸めの内なのに符号が変わらない(接する —— 重根・安定の境): 両側の符号を記録
        let tangent = null;
        if (rt === 1 && !obsRoot && !eq.neutral) { const h = 1e-4 * Math.abs(xObs), c0 = fn(b.s), cl = fn(b.s - h).along, cr = fn(b.s + h).along;
          if (Math.abs(c0.along) <= 1e-9 * c0.scale && Math.sign(cl) === Math.sign(cr)) tangent = { signBelow: Math.sign(cl), signAbove: Math.sign(cr), alongRel: Math.abs(c0.along) / c0.scale }; }
        return { ratio: rt, N0, neutral: eq.neutral, roots, jumps: eq.roots.length - zs.length, obsRoot, tangent };
      });
      // 共鳴で固定できる振幅の窓(s = s_res で他の口の和が ±N_max の内)
      const fr = LF.alongAt(sys, prm, { venus: portsOf('venus', [Object.assign({ rs: 'sun' }, s)], VB.thermal, un.form, sForm, 0, un.omega0) }, 'venus', sRes).along;
      const uR = E.dot(LF.thermalPort(un.form, { Omega: E.scale(b.a, sRes), n: VB.thermal.n, N0: 1, omega0: un.omega0 }).torque, b.a);
      const lo = (-fr - NmaxMain) / uR, hi = (-fr + NmaxMain) / uR;
      out.push({ tau: tk, p, sForm, tForm: tKey, omega0Ratio: un.omega0Ratio, N0Bal: bal.N0, rows, lockWindow: { ratioLo: Math.min(lo, hi) / bal.N0, ratioHi: Math.max(lo, hi) / bal.N0, N0Lo: Math.min(lo, hi), N0Hi: Math.max(lo, hi) } });
    }
  }
  return { nAlong: nA, xObs, sRes, sResDays: 2 * Math.PI / sRes / DAY, combos: out };
}

/* ───────── R 地球との共鳴 ───────── */
export function partR(IN, VB, O) {
  const P = O.declared, o = D.obs, AU = LF.AU, b = IN.I.bodies.venus, C = b.I, GM = LF.G_SI * IN.I.bodies.earth.m;
  const z = LF.resonanceZ({ aR: o.aVenusAU * AU, nR: P.nV, aP: o.aEarthAU * AU, nP: P.nE, Om: P.omRes, M: D.resQuad }), z2 = LF.resonanceZ({ aR: o.aVenusAU * AU, nR: P.nV, aP: o.aEarthAU * AU, nP: P.nE, Om: P.omRes, M: 2 * D.resQuad });
  const zObs = LF.resonanceZ({ aR: o.aVenusAU * AU, nR: P.nV, aP: o.aEarthAU * AU, nP: P.nE, Om: P.sV, M: D.resQuad });
  // 本の状態(接触の二体の n と軌道長半径 —— 比べる列)
  const nVb = E.norm(IN.I.tides['venus:sun'].n), nEb = E.norm(IN.I.tides['earth:sun'].n), ncB = LF.nearestCommensurate({ nR: nVb, nP: nEb, Om: b.s * E.dot(b.a, E.scale(IN.I.tides['venus:sun'].n, 1 / nVb)) });
  const zB = LF.resonanceZ({ aR: IN.I.tides['venus:sun'].sma, nR: nVb, aP: IN.I.tides['earth:sun'].sma, nP: nEb, Om: ncB.omRes, M: D.resQuad });
  const BA0 = 4 * LIT.C22.venus / E.MOI.venus;   // (B − A)/C の文献の桁
  const grid = LIT.venusBAMult.map((m) => { const BA = m * BA0, Nmax = LF.resonanceMax({ GM, BA: BA * C, absZ: z.abs }), wd = LF.librationHalfWidth({ Nmax, C }); return { mult: m, BAoverC: BA, Nmax, halfWidth: wd, offsetOverWidth: Math.abs(P.offset) / wd }; });
  const NmaxMain = grid.find((q) => q.mult === 1).Nmax;
  // 要る大きさとの比(族 E・族 S × p 主と p 0 × Q × τ_0 無限と年齢 —— 一定の Q の型)
  const need = [];
  for (const fam of D.families) for (const p of [D.pMain, D.pAlso]) for (const Q of LIT.Q.venus) for (const tk of D.tau0.branch) {
    const r = venusSolveAt(IN, VB, { src: D.sourceMain, fam, p, Q, tau: tauOf(tk), chi: 0, check: false }), Dn = Math.abs(r.D);
    need.push({ fam, p, Q, tau: tk, need: Dn, chiMax: NmaxMain / Dn, BAforAll: Dn / (1.5 * GM * z.abs * C) });
  }
  const BAforWidth = P.offset * P.offset / (3 * GM * z.abs);
  return { absZ: z.abs, argZ: z.arg, quadRel: E.relD(z.abs, z2.abs), rminAU: z.rmin / AU, rmaxAU: z.rmax / AU, invRmin3: 1 / Math.pow(z.rmin, 3), absZObsSpin: zObs.abs, S: z.S, GM, C, BA0,
    book: { j: ncB.j, omRes: ncB.omRes, resDays: 2 * Math.PI / ncB.omRes / DAY, offset: ncB.offset, absZ: zB.abs, absZRel: E.relD(zB.abs, z.abs) },
    offset: P.offset, offsetRel: P.offsetRel, circulationYears: Math.PI / Math.abs(P.offset) / (365.25 * DAY), grid, NmaxMain, need, BAforWidth };
}

/* ───────── M・L 規則を固定して当てる ───────── */
/** 隣の天体との共鳴の口(受け手 key —— 火星 ← 地球・地球 ← 金星・月 ← 地球の 1:1)の N_max・固定の幅・観測の差 */
export function resOf(IN, key) {
  const b = IN.I.bodies[key], o = D.obs, AU = LF.AU, C = b.I;
  if (key === 'moon') {
    const orb = IN.I.tides['moon:earth'], z = LF.satelliteZ({ a: orb.sma }), Nmax = LF.resonanceMax({ GM: LF.G_SI * IN.I.bodies.earth.m, BA: LIT.moonBAoverC * C, absZ: z.abs }), sRes = orb.along;
    return { partner: 'earth', order: 1, BAoverC: LIT.moonBAoverC, absZ: z.abs, Nmax, halfWidth: LF.librationHalfWidth({ Nmax, C }), sRes, offset: b.s - sRes };
  }
  const geo = key === 'mars' ? { aR: o.aMarsAU, TR: o.marsOrbitDays, aP: o.aEarthAU, TP: o.earthOrbitDays, partner: 'earth', spin: o.marsSpinDays, C22: LIT.C22.mars }
    : { aR: o.aEarthAU, TR: o.earthOrbitDays, aP: o.aVenusAU, TP: o.venusOrbitDays, partner: 'venus', spin: o.earthSpinDays, C22: LIT.C22.earth };
  const nR = 2 * Math.PI / (geo.TR * DAY), nP = 2 * Math.PI / (geo.TP * DAY), Om = 2 * Math.PI / (geo.spin * DAY), nc = LF.nearestCommensurate({ nR, nP, Om });
  const z = LF.resonanceZ({ aR: geo.aR * AU, nR, aP: geo.aP * AU, nP, Om: nc.omRes, M: 65536 }), BA = 4 * geo.C22 / b.moi, Nmax = LF.resonanceMax({ GM: LF.G_SI * IN.I.bodies[geo.partner].m, BA: BA * C, absZ: z.abs });
  return { partner: geo.partner, order: nc.j, BAoverC: BA, absZ: z.abs, absZOverInvR3: z.abs * Math.pow(z.rmin, 3), Nmax, halfWidth: LF.librationHalfWidth({ Nmax, C }), sRes: b.s * nc.omRes / Om, offset: b.s - b.s * nc.omRes / Om };
}
const MATCH_ORDER = ['balanced', 'locked', 'nearStable', 'slow', 'fast'];
/** 1 つの受け手の判定(他の天体は観測の自転のまま) */
function judge(IN, sys, prm, extra, key, res) {
  const b = IN.I.bodies[key], at = LF.alongAt(sys, prm, extra, key, b.s), Nnet = at.along;
  const cent = [0].concat(Object.keys(IN.I.tides).filter((k) => k.split(':')[0] === key).map((k) => IN.I.tides[k].along));
  const eq = LF.equilibria((sv) => LF.alongAt(sys, prm, extra, key, sv), LF.scanGrid(cent, b.s));
  const zs = eq.roots.filter((z) => z.kind === 'zero'), stab = zs.filter((z) => z.stable).sort((x, y) => Math.abs(x.s - b.s) - Math.abs(y.s - b.s));
  const near = stab[0] || null, tChange = b.I * Math.abs(b.s) / Math.abs(Nnet), inWidth = res ? Math.abs(res.offset) <= res.halfWidth : false, canHold = res ? Math.abs(Nnet) <= res.Nmax : false;
  let cls = 'fast';
  if (Math.abs(Nnet) <= 1e-9 * at.scale) cls = 'balanced';
  else if (inWidth && canHold) cls = 'locked';
  else if (near && Math.abs(near.s - b.s) <= D.matchTol * Math.abs(b.s)) cls = 'nearStable';
  else if (tChange > LF.TAU_AGE) cls = 'slow';
  return { key, sObs: b.s, Nnet, NnetRel: Math.abs(Nnet) / at.scale, tChange, tChangeOverAge: tChange / LF.TAU_AGE, nearest: near ? { s: near.s, ratio: near.s / b.s, days: 2 * Math.PI / near.s / DAY } : null,
    roots: zs.map((z) => ({ s: z.s, ratio: z.s / b.s, stable: z.stable })), neutral: eq.neutral, inWidth, canHold, offsetOverWidth: res ? Math.abs(res.offset) / res.halfWidth : null, cls };
}
export function partML(IN, VB, Bv) {
  const out = { mars: [], triEM: [] }, res = { mars: resOf(IN, 'mars'), earth: resOf(IN, 'earth'), moon: resOf(IN, 'moon') }, worst = { residualRel: 0, LTotalRel: 0, portCloseMaxRel: 0, k1TransferRel: 0 };
  const th = { mars: thermalBase(IN, 'mars'), earth: thermalBase(IN, 'earth') };
  const sol = { mars: [Object.assign({ rs: 'sun' }, solidOf(IN, 'mars', 'sun', LIT.Q.mars))], earth: [Object.assign({ rs: 'sun' }, solidOf(IN, 'earth', 'sun', LIT.Q.earth)), Object.assign({ rs: 'moon' }, solidOf(IN, 'earth', 'moon', LIT.Q.earth))],
    moon: [Object.assign({ rs: 'earth' }, solidOf(IN, 'moon', 'earth', LIT.Q.moon))] };
  for (const cb of Bv.combos) {
    const tForm = cb.tForm.split(':')[0], rules = tForm === 'relax' ? D.frozen.omega0Rules : [null];
    const eps = cb.N0Bal / (VB.thermal.perPa * VB.thermal.ps);   // 金星の釣り合いの振幅(Q 主・族 E・源 J・χ = 0)の気圧の相対の振幅を固定
    for (const rule of rules) {
      const om0 = (key) => (tForm !== 'relax' ? null : (rule === 'ratio' ? cb.omega0Ratio * th[key].sigmaObs : cb.omega0Ratio * VB.thermal.sigmaObs));
      const N0 = (key) => eps * th[key].perPa * th[key].ps, tau = tauOf(cb.tau);
      const base = { tau: cb.tau, p: cb.p, sForm: cb.sForm, tForm: cb.tForm, omega0Rule: rule, eps };
      // 太陽–火星
      { const sys = sysOf(IN, D.sourceMain, SYS.mars, cb.p), { prm } = prmAt(IN, sys, D.familyMain, tau), ex = { mars: portsOf('mars', sol.mars, th.mars, tForm, cb.sForm, N0('mars'), om0('mars')) };
        const ev = LF.evaluateAll(sys, prm, ex); for (const k of Object.keys(worst)) worst[k] = Math.max(worst[k], ev.ledger[k]);
        out.mars.push(Object.assign({}, base, { N0: N0('mars'), omega0: om0('mars'), mars: judge(IN, sys, prm, ex, 'mars', res.mars), ledger: (cb.tForm === 'constPhase' && cb.sForm === 'constQ') ? ledgerOf(ev) : null })); }
      // 太陽–地球–月(3 体 —— 月 ↔ 地球の K1 の口・潮汐の口は本便の固体の潮汐)
      { const sys = sysOf(IN, D.sourceMain, SYS.triEM, cb.p), { prm } = prmAt(IN, sys, D.familyMain, tau);
        const ex = { earth: portsOf('earth', sol.earth, th.earth, tForm, cb.sForm, N0('earth'), om0('earth')), moon: portsOf('moon', sol.moon, null, tForm, cb.sForm, 0, null) };
        const ev = LF.evaluateAll(sys, prm, ex); for (const k of Object.keys(worst)) worst[k] = Math.max(worst[k], ev.ledger[k]);
        out.triEM.push(Object.assign({}, base, { N0: N0('earth'), omega0: om0('earth'), earth: judge(IN, sys, prm, ex, 'earth', res.earth), moon: judge(IN, sys, prm, ex, 'moon', res.moon),
          ledger: (cb.tForm === 'constPhase' && cb.sForm === 'constQ') ? ledgerOf(ev) : null })); }
    }
  }
  return Object.assign(out, { res, worst, solid: sol, thermal: th, matchOrder: MATCH_ORDER });
}

/* ───────── H 帳簿(主の行 —— 口ごと)───────── */
export function partH(IN, VB) {
  const rows = [], b = IN.I.bodies.venus, s = VB.solid.find((q) => q.Q === LIT.Q.venusMain);
  for (const tk of D.tau0.branch) for (const p of (tk === 'inf' ? [D.pAlso] : [D.pMain, D.pAlso])) for (const chi of [0, 0.25]) {
    const tau = tauOf(tk), r = venusSolveAt(IN, VB, { src: D.sourceMain, fam: D.familyMain, p, Q: LIT.Q.venusMain, tau, chi, check: false });
    const sys = sysOf(IN, D.sourceMain, SYS.venus, p), { prm } = prmAt(IN, sys, D.familyMain, tau), un = VB.thermal.unit.constPhase;
    const ev = LF.evaluateAll(sys, prm, { venus: portsOf('venus', [Object.assign({ rs: 'sun' }, s)], VB.thermal, un.form, 'constQ', r.N0, null, r.Nr) }), R = ev.rows[1];
    const ports = R.lsPorts.map((q) => ({ kind: q.kind, src: q.src, torqueAlong: q.torqueAlong, heat: q.heat, supply: q.supply })).concat(R.ports.map((q) => ({ kind: q.kind, src: q.src, torqueAlong: q.torqueAlong, heat: q.heat,
      supply: q.kind === 'thermal' ? q.solar : q.orbitWork })));
    rows.push({ tau: tk, p, chi, N0: r.N0, Nr: r.Nr, alongRel: R.alongRel, ledger: ledgerOf(ev), ports });
  }
  // 応答の尺度(全 Γ を λ 倍 = τ_0 を 1/λ 倍)で SI の口は変わらず銀河と K1 の口だけが動く —— 族 E・p 0・年齢
  const tau = LF.TAU_AGE, r1 = venusSolveAt(IN, VB, { src: D.sourceMain, fam: D.familyMain, p: D.pAlso, Q: LIT.Q.venusMain, tau, chi: 0, check: false }), r2 = venusSolveAt(IN, VB, { src: D.sourceMain, fam: D.familyMain, p: D.pAlso, Q: LIT.Q.venusMain, tau: tau / D.scaleLambda, chi: 0, check: false });
  return { rows, scale: { lambda: D.scaleLambda, gkRatio: r2.gkAlong / r1.gkAlong, solidSame: r2.solidAlong === r1.solidAlong, N0Ratio: r2.N0 / r1.N0 } };
}

/* ───────── 全部と門 ───────── */
export function runAll(HP) {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const IN = partI(HP); mark('I');
  const O = partO(IN); mark('O');
  const VB = venusBase(IN), V = partV(IN, VB); mark('V');
  const R = partR(IN, VB, O); mark('R');
  const B = partB(IN, VB, Object.assign({}, O, { declared: O.declared, NmaxMain: R.NmaxMain })); mark('B');
  const ML = partML(IN, VB, B); mark('ML');
  const H = partH(IN, VB); mark('H');
  const P = LF.pureScenes(), PG = LF.pureGates(P);
  const KEYS = ['sun', 'venus', 'mars', 'earth', 'moon'], Ib = IN.I.bodies;
  const inputs = { units: IN.I.units, g: IN.I.g, gain: IN.I.gain, tauAge: LF.TAU_AGE, taus: TAUS.map(tauKey),
    bodies: Object.fromEntries(KEYS.map((k) => [k, { i: Ib[k].i, name: Ib[k].name, m: Ib[k].m, R: Ib[k].R, s: Ib[k].s, a: Ib[k].a, axisEngineAngDeg: Ib[k].axisEngineAngDeg, Rd: Ib[k].Rd, moi: Ib[k].moi, I: Ib[k].I, gDotA: E.dot(IN.I.g, Ib[k].a) }])),
    tides: IN.I.tides, k1Along: Object.fromEntries(Object.entries(IN.K[D.sourceMain]).map(([k, t]) => { const [rc, sc] = k.split(':'); return [k, Ib[sc].s * E.dot(t, Ib[rc].a)]; })) };
  const J = { inputs, observed: O, venusBase: { gk: VB.gk, solid: VB.solid, thermal: VB.thermal }, venus: V, branches: B, resonance: R, frozen: ML, ledger: H, pure: { scenes: P, gates: PG }, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}
export function gatesOf(J) {
  const V = J.venus, B = J.branches, R = J.resonance, ML = J.frozen, H = J.ledger, O = J.observed, VB = J.venusBase;
  const allFrozen = ML.mars.map((q) => q.mars).concat(ML.triEM.flatMap((q) => [q.earth, q.moon]));
  const balRows = B.combos.flatMap((c) => c.rows.filter((r) => r.ratio === 1));
  return {
    pure: Object.values(J.pure.gates).every(Boolean),
    axesFromDecl: Object.values(J.inputs.bodies).every((b) => b.axisEngineAngDeg < 1e-5),
    // 観測の周期: 宣言の値で k ≈ −0.9246・会合周期と太陽日の比 ≈ 5(5.001)・本の状態の比も 5 の近く
    periods: Math.abs(O.declared.k + 0.9246) < 1e-4 && Math.abs(O.declared.ratio - 5) < 0.005 && Math.abs(O.book.ratio - 5) < 0.02 && Math.abs(O.declared.turnsRelEarth + 4) < 0.005,
    sunExactAllP: Object.values(VB.gk).every((fs) => Object.values(fs).every((ps) => Object.values(ps).every((g) => g.sunAlongRel <= 1e-12))),
    // 釣り合い: 全部の条件で振幅が非負(駆動の口の向き)・軸の向きの残差・帳簿・L・口の閉じが丸めの内
    venusBalanced: V.worst.rejected === 0 && V.worst.alongRel <= 1e-12 && V.worst.residualRel <= 1e-12 && V.worst.LTotalRel <= 1e-12 && V.worst.portCloseMaxRel <= 1e-12 && V.worst.k1TransferRel <= 1e-12,
    // 観測の自転は振幅の比 1 の行で釣り合いの点(中立の縮退の型を除く)
    obsIsRoot: balRows.every((r) => r.neutral || !!r.obsRoot || !!r.tangent),
    resonanceConverged: R.quadRel <= 1e-12 && R.absZ < R.invRmin3 && R.book.j === -4,
    frozenRecorded: allFrozen.length > 0 && allFrozen.every((q) => MATCHES.includes(q.cls)) && ML.worst.residualRel <= 1e-12 && ML.worst.LTotalRel <= 1e-12 && ML.worst.portCloseMaxRel <= 1e-12,
    ledgerCloses: H.rows.every((q) => q.alongRel <= 1e-12 && q.ledger.residualRel <= 1e-12 && q.ledger.LTotalRel <= 1e-12 && q.ledger.portCloseMaxRel <= 1e-12 && q.ledger.solarSupply > 0),
    scaleOnlyMovesK1: Math.abs(H.scale.gkRatio - D.scaleLambda) <= 1e-12 * D.scaleLambda && H.scale.solidSame === true && H.scale.N0Ratio > 1,
  };
}
const MATCHES = MATCH_ORDER;

/* ───────── 走らせる ───────── */
export async function main() {
  const TARGET = process.env.W327F_TARGET || 'beta/index.html';
  const OUT = process.env.W327F_OUT ? (path.isAbsolute(process.env.W327F_OUT) ? process.env.W327F_OUT : path.join(ROOT, process.env.W327F_OUT)) : path.join(ROOT, OUT_MAIN);
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now(), text = fs.readFileSync(html, 'utf8'), targetSha256 = crypto.createHash('sha256').update(text).digest('hex');
  const W281A_SCOPE = REGEN_SCOPE ? w281aScopeStamp(html, REGEN_SCOPE) : {};
  const { HP } = loadHtmlMain(html);
  console.log('第327便f venustide(版 ' + HARNESS_VERSION + ')');
  const R = runAll(HP);
  const out = { version: HARNESS_VERSION, libVersion: LF.LIB_VERSION, w327eLibVersion: LD.LIB_VERSION, w327aLibVersion: LS.LIB_VERSION, w326dLibVersion: E.LIB_VERSION, generator: 'tests/exp-w327f-venustide.mjs', target: TARGET, targetSha256, reuseFrom: null,
    ruling: '原仮定者の指示(2026-11-05)「金星の逆行自転は、大気熱潮汐の影響と、地球との共鳴を採用する」「R_dはK1で固定し、観測の自転もトルクの釣り合いで進める」・統括の検証項目 R300',
    decl: LF.DECL, notClaim: NOT_CLAIM, invSqVersion: HP.REL_DRAG_INVSQ_VERSION || null, srcMomentVersion: HP.REL_DRAG_INVSQ_SRC_MOMENT_VERSION || null, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w327f-venustide.mjs', 'tests/lib-w327f-venustide.mjs', 'tests/exp-w327e-axialdiff.mjs', 'tests/lib-w327e-axialdiff.mjs', 'tests/exp-w327a-axialsum.mjs', 'tests/lib-w327a-axialsum.mjs', 'tests/exp-w326d-axialheat.mjs', 'tests/lib-w326d-axialheat.mjs', 'tests/lib-w319a-axisheat.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第327便f', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, stage: 'venustide', engine: 'Node(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・1 プロセス)', notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();
