// 第328便b(原仮定者の回答(2026-11-05 —— AN559「p は場の API から別に決める」・AN561「源の自転を外部の口座に固定した比べる列」・AN562「一定の時間の遅れ + 一定の位相を暫定の基準列」・
//   AN563「τ_0 は格子のまま」・AN550「p の後で地球と土星の予言をやり直す」・AN566「火星と地球は過渡 —— 局所の尺度」)・統括の検証項目 R302):
//   **受け手の応答の演算 F(R_d, m; 契約, 位置, 軸)の型ごとの指数の判定(R_d・m・I を独立に振る・既定の列の照合・否定対照)・空間の勾配(位置を動かす —— 別の列)・
//   源の自転を外部の口座に固定した列(K1 の口と第327便e の別の半径の口)・金星の熱潮汐の振幅 N_0 の記録し直し(p の候補か応答の表で)・火星と地球の局所の尺度**
//   (段 response-328b —— 正本 tests/out/response-w328b.json・lib tests/lib-w328b-response.mjs)。**診断だけ** —— エンジン・内蔵の本・受理器・beta/index.html は変えない。
//
// Node だけ(対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、第327便e の器の入力と読み口〔partI・stateFor・gradT・stencilAt〕・第326便d の器の
//   写し〔copyBook・stateOf・partI〕と、エンジンの銀河の一様軸の読み口〔受け手ごとの応答の係数〕を使う —— K1 の核の式を写さない)。場は第321便c の場の API(sample —— 純関数)。
//   入力は html だけ(他の正本・データは読まない)。1 プロセス(子プロセスなし)。t = 0 の読み口と純関数だけ(步を進めない)。
//
// ■ 何をするか
//   C 場の契約: 第321便c の sample の出力から、器の中の小さい関数 contractFromLegacy() で第328便の共通の形の値を作る(統合で枝 a の buildFieldContract へ差し替える)。
//     直接の滑りの宣言(AN551): ν_slip = g_T(Ω_frame − Ω_field) ĝ —— g_T = 1・Ω_frame は渦状腕のパターンの角速度の文献の範囲の中点・Ω_field は太陽の式(経路 1)の A を
//     生む宣言の候補(同定ではない)。収束の印は第321便c の sample に無い —— null(0 で埋めない)。背景の場 W_bg は sample の β から。
//   P 受け手の演算の型(lib の DECL.forms)ごとに: 固定の位置(太陽の位置)で R_d・m・I を独立に ±1 桁・K1 の線(R_d と m を同じ倍率)・広い範囲の R_d の表・本の 8 天体の
//     f_i = F_i/F_☉ と ln f = p ln(R_d/R_d,☉)。一定の指数が成り立つ型だけ p の候補(成り立たなければ応答の表)。既定の列(q = 1・m_ref/m)はエンジンの読み口の係数と照合
//     (K1 の規則の写し・金星の R_d を 0.1・10 倍・金星の質量を 10 倍〔R_d は固定〕)。否定対照(p = 0)は K1 の線だけを振る読みが既定の列と見分けないことを門に。
//   S 空間の勾配(位置を動かす —— 別の列): 場の API の読み(u_φ・u_φ/R・半渦度・シア)の銀河中心からの距離 R と高さ z の対数の傾き(源の場の空間の指数 —— p ではない)。
//     契約の定数の場は位置に依らない(宣言の at の位置の局所の定数 —— AN552)。
//   N 金星の熱潮汐の振幅 N_0(第327便f の lib の口をそのまま呼ぶ): p の候補の列・p の無い主の型の応答の表の列・第327便a の格子の主の p −0.75(比べる列)× 源の反作用の 2 列
//     (今の列・外部の口座に固定 —— AN561)× 源 2 × 族 2 × Q × τ_0 の格子(AN563)× 固体の型 2 × 熱潮汐の型 6(主は一定の時間の遅れ + 一定の位相 —— AN562)。全部の行を
//     帳簿まで評価。主の列の観測の点の安定。N_0 は観測の自転から解いた量(自転の独立の予言ではない)。
//   F 源の自転を外部の口座に固定した列(AN561 —— 第327便e の器の口: 源 J・太陽の口だけ別の半径 diffK1): 金星の零点の有無・A・外部の口座のトルクと仕事・帳簿の差。
//   T 火星と地球の変化の時間 I|Ω|/|N|(AN566 —— その列の瞬間のトルクの局所の尺度・履歴の積分ではない)。
//   U AN550: p が 1 つのときだけ予言をやり直す(1 つでなければ「やり直しは p の後」と記録)。
//   H 帳簿の最大の残差・P 純関数の場面
// ■ 言わないこと: p は場の API だけでは決まらない(受け手の演算の型の宣言で決まる)・一定の指数が成り立たない型に p を書かない・金星の熱の振幅に合わせて p を選ばない・
//   内部熱・金星の逆回転の説明ではない・銀河場の同定と数えない・N_0 は採らない(在位の本へ入れない)・負の振幅は不採用(0 に丸めない)。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as X from './exp-w326d-axialheat.mjs';
import * as XE from './exp-w327e-axialdiff.mjs';
import * as E from './lib-w326d-axialheat.mjs';
import * as LS from './lib-w327a-axialsum.mjs';
import * as LD from './lib-w327e-axialdiff.mjs';
import * as LF from './lib-w327f-venustide.mjs';
import * as GF from './lib-w321c-galfield.mjs';
import * as LB from './lib-w327b-galaxis.mjs';
import * as RB from './lib-w328b-response.mjs';
// 第281便a の領域 hash の宣言(器と lib から deriveScope で引いた下限 —— 版 8 の宣言: ワンタップ対照の A/B を走らせない〔abBody:false〕・説明文の欄を読まない〔keepProse なし〕。
//   presets は器が .find で引く在位の本 🗺️ 1 本と、場の API が import する第319便b の lib とその import の綴りの 11 本〔第327便b の器と同じ型〕)
const REGEN_SCOPE = {"presets":["jupiterGalilean","jupiterSunInertial3d","marsSunInertial3d","mercury","mercurySunInertial3d","neptuneSunInertial3d","saturn","saturnRingReal","saturnSunInertial3d","solarSystem16Inertial3d","uranusSunInertial3d","venusSunInertial3d"],"roots":["$","HP.REL_DRAG_INVSQ_SRC_MOMENT_VERSION","HP.REL_DRAG_INVSQ_VERSION","HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.inertialDragIsqPointAt","HP.inertialDragIsqState","HP.sim","HP.validatePreset","T","ab","ch","ctx","cw","inertialDragGalaxyAxialState","pnSource"],"core":true,"consts":[],"complete":true,"abBody":false};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w328b-response-1';
export const OUT_MAIN = 'tests/out/response-w328b.json';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze(['p は場の API だけでは決まらない(受け手の演算の型の宣言で決まる —— 型ごとの記録)', '一定の指数が成り立たない型に p を書かない(応答の表のまま)',
  '金星の熱の振幅に合わせて p を選んでいない(p の候補は受け手の演算と本の天体の線だけから)', 'N_0 は観測の自転から解いた量(自転の独立の予言ではない —— 採らない)',
  '金星の逆回転・内部熱の説明ではない', 'A は「太陽の口が銀河だけ」という接続の帰結(銀河場の同定と数えない)', 'Ω_field は宣言の候補(同定ではない)', '変化の時間 I|Ω|/|N| は局所の尺度(履歴の積分ではない)']);
const SAT = Object.keys({ saturn: 1 })[0];   // 鍵の文字列を引用符で書かない(領域の下限 deriveScope が同じ綴りの本の id と取り違える)
const BODY8 = Object.freeze(['sun', 'venus', 'mars', 'earth', 'moon', 'jupiter', 'io', SAT]);
const D = RB.DECL, FD = LF.DECL, LIT = FD.lit, DAY = 86400;
const GA_STATE = 'inertialDragGalaxyAxialState';   // エンジンの銀河の一様軸の読み口(状態を動かさない —— 受け手ごとの応答の係数)
const NOTIDE = Object.freeze(Object.fromEntries(Object.entries(LD.DECL.ports).map(([k, v]) => [k, Object.freeze({ k1: v.k1, tide: Object.freeze([]) })])));
const SYS = Object.freeze({ venus: ['sun', 'venus'], mars: ['sun', 'mars'], triEM: ['sun', 'earth', 'moon'] });
const TAUS = Object.freeze(FD.tau0.grid.concat([LF.TAU_AGE, Infinity]).sort((x, y) => x - y));
const tauKey = (t) => (t === Infinity ? 'inf' : (t === LF.TAU_AGE ? 'age' : t.toExponential(0)));
const POS0 = Object.freeze([8.2, 0, 0]);   // 太陽の位置(銀河中心系 [kpc] —— 第321便c・第327便b の表と同じ点)

/* ───────── I 入力 ───────── */
export function partI(HP) {
  const I5 = XE.partI(HP), I8 = X.partI(HP), ST = { now: XE.stateFor(HP, 'now'), J: XE.stateFor(HP, 'J') }, K = {};
  for (const src of FD.sources) { K[src] = {}; for (const key of ['venus', 'mars', 'earth', 'moon']) for (const s2 of LD.DECL.ports[key].k1) K[src][key + ':' + s2] = XE.gradT(ST[src], XE.IDX[key], XE.IDX[s2]); }
  const bodies = Object.assign({}, I5.bodies);
  for (const key of ['jupiter', 'io', SAT]) bodies[key] = I8.bodies[key];
  return { I5, bodies, g: I5.g, tides: I5.tides, units: I5.units, ST, K };
}

/* ───────── C 場の契約(器の中の小さい関数 —— 統合で枝 a の buildFieldContract へ差し替える)───────── */
/** 第321便c の sample の出力と宣言から、第328便の共通の形の契約の値を作る(欠測は null —— 0 で埋めない) */
export function contractFromLegacy(sampleOut, decl) {
  const s = sampleOut || {}, at = s.cyl ? { R_kpc: s.cyl.RKpc, z_kpc: s.cyl.zKpc } : null;
  return {
    version: RB.CONTRACT_VERSION,
    frame: { id: 'galactocentric-armPattern', origin: 'galactic-center(第321便c の銀河中心系)', axis: [0, 0, 1], velocityRef: s.contract ? s.contract.velocityRef : null, timeUnit: 's', lengthUnit: s.contract ? s.contract.units.position : null,
      omegaFrame: Number.isFinite(decl.omegaFrame) ? decl.omegaFrame : null },
    omegaField: { mode: 'constant', value: Number.isFinite(decl.omegaField) ? decl.omegaField : null, at, ref: decl.ref || null, unit: 'rad/s', source: 'declared' },
    convergence: { uConverged: null, curlConverged: null, method: 'legacy(第321便c の sample に収束の印は無い —— 枝 a の契約で置く)', gridSigns: null },
    sources: s.source ? s.source.terms.map((t) => ({ sourceId: s.source.model + ':' + t.key, owns: t.owns.slice(), coef: t.coef })) : [],
    transfer: { id: 'directSlip', version: 'w328b-legacy-1', form: 'directSlip', gT: Number.isFinite(decl.gT) ? decl.gT : null },
    ledgerRefs: { supply: 'galaxySupply', reaction: 'k1Transfer.sourceReactionWork', heat: 'heat' },
  };
}
export function partC(IN) {
  const s0 = GF.sample(POS0, 0, GF.fullState(), { normalization: true }), sun = IN.bodies.sun, gA = E.dot(IN.g, sun.a);
  const Asun = sun.s / gA;   // 太陽の式(口が 1 つ —— 銀河だけ)の A(f_☉ = 1 —— 第327便b の経路 1 の和の式)
  const Op = LB.DECL.OmegaPatternKmsKpc.map((x) => x * LB.KMS_PER_KPC), Ofr = 0.5 * (Op[0] + Op[1]);
  const decl = { omegaFrame: Ofr, omegaField: Ofr - Asun / 1, gT: 1, ref: '太陽の式の A を g_T = 1 で生む宣言の候補(第327便b の経路 1 —— 同定ではない)' };
  const contract = contractFromLegacy(s0, decl), ck = RB.checkContract(contract), sl = RB.slipOf(contract);
  const Wbg = s0.normalization.beta / GF.COEF;   // 背景の場 [kg/m](β = (10G_0/c_0²)∫ρ/|x − x′| dV′ —— 太陽系の天体の自己でない場は数えない)
  return { contract, check: ck, slip: { mag: sl.mag, relFrame: sl.relFrame, vecEcl: E.scale(IN.g, sl.mag) }, Asun, gDotAsun: gA, OmegaPattern: Op, Wbg, beta: s0.normalization.beta,
    sample: { uPhi: s0.uPhi, halfCurlZ: s0.halfCurlCyl.z, halfCurlR: s0.halfCurlCyl.R, positionKpc: s0.positionKpc, fieldVersion: s0.version, libVersion: s0.libVersion } };
}

/* ───────── P 受け手の演算の型と p の判定 ───────── */
const recvOf = (b) => ({ key: b.key, Rd: b.Rd, m: b.m, I: b.I });
export function partP(HP, IN, C) {
  const ref = { Rd: IN.bodies.sun.Rd, m: IN.bodies.sun.m }, env = { slip: C.slip.vecEcl, Wbg: C.Wbg, ref };
  const bodies = BODY8.map((k) => recvOf(IN.bodies[k])), forms = {}, verdicts = [];
  for (const f of D.forms) {
    const meas = { sun: RB.measureForm(f.key, recvOf(IN.bodies.sun), env), venus: RB.measureForm(f.key, recvOf(IN.bodies.venus), env) };
    const fit = RB.bodyFit(f.key, bodies, env, 'sun'), vs = RB.verdictOf(meas.sun, fit), vv = RB.verdictOf(meas.venus, fit);
    const v = Object.assign({}, vs, { baseAgree: vs.verdict === vv.verdict && (vs.p === null) === (vv.p === null) });
    forms[f.key] = { role: f.role, ja: f.ja, reads: f.reads, sun: strip(meas.sun), venus: strip(meas.venus), fit: { p: fit.p, maxRes: fit.maxRes, constant: fit.constant, rows: fit.rows.map((r) => ({ key: r.key, f: r.f, x: r.x })) }, verdictVenusBase: vv.verdict, verdict: v };
    verdicts.push(v);
  }
  const uniq = RB.uniquenessOf(verdicts);
  // 既定の列の照合(エンジンの読み口 —— galaxyAxial rdPow 1・massPow −1・R_ref = R_d,☉・m_ref = m_☉ を写しに宣言)
  const eng = engineDefaultRows(HP, IN), dft = eng.rows.map((r) => { const ours = RB.responseOf('engineDefault', { Rd: r.RdSI, m: r.mSI }, env).fac; return Object.assign(r, { ours, rel: E.relD(ours, r.engine) }); });
  // 否定対照: K1 の線だけを振る読み(R_d と m を同じ倍率)は既定の列と否定対照で同じ 0 —— 独立に振ると既定の列は R_d の指数 1・m の指数 −1
  const dm = forms.engineDefault.sun, nm = forms.nullP0.sun;
  const negative = { defaultJoint: dm.joint.slope, nullJoint: nm.joint.slope, defaultRd: dm.a.slope, defaultM: dm.b.slope, nullRd: nm.a.slope, nullM: nm.b.slope,
    jointBlind: Math.abs(dm.joint.slope) <= D.gate.tolSlope && Math.abs(nm.joint.slope) <= D.gate.tolSlope, independentSees: Math.abs(dm.a.slope - nm.a.slope) > 0.5 };
  return { env: { slipMag: C.slip.mag, Wbg: C.Wbg, refRd: ref.Rd, refM: ref.m }, forms, uniqueness: uniq, defaultColumn: { rows: dft, maxRel: Math.max(...dft.map((r) => r.rel)), cases: eng.cases }, negative };
}
const strip = (m) => ({ base: m.base, a: statOf(m.a), b: statOf(m.b), c: m.c ? statOf(m.c) : null, joint: statOf(m.joint), wide: m.wide });
const statOf = (s) => (s && s.ok ? { slope: s.slope, spread: s.spread, maxRes: s.maxRes, localMin: s.localMin, localMax: s.localMax, constant: RB.constantOf(s) } : { ok: false, why: s ? s.why : null });
/** エンジンの銀河の一様軸の読み口の受け手ごとの応答の係数(K1 の規則の写し・金星の R_d を 0.1・10 倍・金星の質量を 10 倍〔R_d は K1 の値に固定〕) */
function engineDefaultRows(HP, IN) {
  const uL = IN.units.lenSI, uM = IN.units.massSI, iV = XE.IDX.venus, rows = [], cases = [];
  const stOf = (mod) => {
    const b = X.copyBook(HP), sun0 = X.stateOf(HP, b).isq.rdRule.bodies.find((q) => q.i === 0);
    b.physics.relativeDrag.galaxyAxial = { wx: 0, wy: 0, wz: 1e-9, rdPow: 1, refRadius: sun0.Rd, massPow: -1, refMass: b.bodies[0].m };
    if (mod) mod(b);
    const st = X.stateOf(HP, b);
    return st.ok ? { st, g: globalThis[GA_STATE](st.S) } : { st, g: null };
  };
  const K1 = stOf(null);
  for (const r of K1.g.receivers) rows.push({ case: 'k1Rule', i: r.i, RdSI: r.Rd * uL, mSI: r.mass * uM, engine: r.responseFactor });
  const RdV = K1.g.receivers.find((q) => q.i === iV).Rd;
  for (const [nm, mod, expect] of [['venusRd0.1', (b) => { b.bodies[iV].dragCore = { massFrac: 1, radius: 0.1 * RdV }; }, 0.1], ['venusRd10', (b) => { b.bodies[iV].dragCore = { massFrac: 1, radius: 10 * RdV }; }, 10],
    ['venusMass10', (b) => { b.bodies[iV].m *= 10; b.bodies[iV].dragCore = { massFrac: 1, radius: RdV }; }, 0.1]]) {
    const z = stOf(mod);
    if (!z.g) { cases.push({ case: nm, ok: false, err: z.st.err }); continue; }
    const r = z.g.receivers.find((q) => q.i === iV);
    rows.push({ case: nm, i: iV, RdSI: r.Rd * uL, mSI: r.mass * uM, engine: r.responseFactor });
    cases.push({ case: nm, ok: true, engine: r.responseFactor, expect, rel: E.relD(r.responseFactor, expect) });
  }
  return { rows, cases };
}

/* ───────── S 空間の勾配(位置を動かす)───────── */
export function partS(C) {
  const Rs = [7.2, 7.7, 8.2, 8.7, 9.2], zs = [-0.02, 0, 0.02];
  const read = (pos) => { const q = GF.sample(pos, 0, GF.fullState(), {});
    const R = Math.hypot(pos[0], pos[1]) * LB.KPC_M, w = q.halfCurlCyl.z;
    return { RKpc: pos[0], zKpc: pos[2], uPhi: q.uPhi, rigid: q.uPhi / R, halfCurlZ: w, halfCurlR: q.halfCurlCyl.R, shear: 2 * w - 2 * q.uPhi / R, contractSlip: C.slip.mag }; };
  const rowsR = Rs.map((R) => read([R, 0, 0])), rowsZ = zs.map((z) => read([8.2, 0, z]));
  const k0 = 2, slope = (key) => { const a = rowsR[k0 - 1], b = rowsR[k0 + 1]; return Math.log(Math.abs(b[key] / a[key])) / Math.log(b.RKpc / a.RKpc); };
  const local = (key) => rowsR.slice(1).map((q, k) => Math.log(Math.abs(q[key] / rowsR[k][key])) / Math.log(q.RKpc / rowsR[k].RKpc));
  return { rowsR, rowsZ, slopeAtR0: { uPhi: slope('uPhi'), rigid: slope('rigid'), halfCurlZ: slope('halfCurlZ'), shear: slope('shear'), contractSlip: 0 },
    localSlopes: { uPhi: local('uPhi'), rigid: local('rigid'), halfCurlZ: local('halfCurlZ'), shear: local('shear') },
    contractConstant: rowsR.every((q) => q.contractSlip === C.slip.mag), note: '源の場の空間の指数(位置を動かす)—— 受け手の応答の指数 p ではない。契約の定数の場は宣言の at の位置の局所の定数(AN552)' };
}

/* ───────── N 金星の熱潮汐の振幅(p の候補・応答の表・比べる列 × 源の反作用の 2 列)───────── */
const sysOf = (IN, src, keys, p, fOver) => {
  const sys = LD.systemOf(IN.bodies, keys, p, (r, s2) => IN.K[src][r + ':' + s2], () => { throw new RangeError('潮汐の口は外した'); }, NOTIDE);
  if (fOver) for (const b of sys) if (fOver[b.key] !== undefined) b.f = fOver[b.key];
  return sys;
};
/** 系・族・τ_0・列(coupled/fixed)の A と prm(τ_0 = ∞ は null)と、評価に使う系(fixed は幻の天体を足した写し) */
function prmAt(IN, sys, fam, tau, fix) {
  const P1 = LD.paramsOf(IN.bodies, fam, 1), r = fix === 'fixed' ? RB.solveFixed(sys, P1) : LS.solve(sys, P1), sysE = fix === 'fixed' ? r.sys2 : sys;
  return { A: r.A, sysE, sol: r, prm: tau === Infinity ? null : Object.assign(LD.paramsOf(IN.bodies, fam, 1 / tau), { A: r.A }), P1A: Object.assign(P1, { A: r.A }) };
}
function venusMats(IN) {
  const b = IN.bodies.venus, Om = E.scale(b.a, b.s), orb = IN.tides['venus:sun'];
  const solid = LIT.Q.venus.map((Q) => { const Xp = LF.tidalScale({ Mr: IN.bodies.sun.m, R: b.R, a: orb.sma }), NQ = 1.5 * LIT.k2.venus / Q * Xp, wAnc = E.norm(E.sub(orb.n, Om));
    const pq = LF.solidPort('constQ', { Omega: Om, n: orb.n, NQ }), pl = LF.solidPort('constLag', { Omega: Om, n: orb.n, NQ, wAnc });
    return { Q, NQ, wAnc, alongQ: E.dot(pq.torque, b.a), alongLag: E.dot(pl.torque, b.a), k2DtSec: LIT.k2.venus / (Q * 2 * wAnc) }; });
  const perPa = LF.thermalN0({ eps: 1, ps: 1, Msun: IN.bodies.sun.m, M: b.m, R: b.R, a: orb.sma }), ps = LIT.surfacePressurePa.venus, sigmaObs = 2 * E.norm(E.sub(Om, orb.n)), unit = {};
  for (const [fk, r] of [['constPhase', null]].concat(FD.relaxOmega0.map((x) => ['relax', x]))) {
    const om0 = r === null ? null : r * sigmaObs, q = LF.thermalPort(fk, { Omega: Om, n: orb.n, N0: 1, omega0: om0 });
    unit[fk + (r === null ? '' : ':' + r)] = { form: fk, omega0Ratio: r, omega0: om0, F: q.F, u: E.dot(q.torque, b.a) };
  }
  return { n: orb.n, solid, perPa, ps, sigmaObs, unit, litN0: LIT.venusEpsRange.map((e) => e * perPa * ps) };
}
const portsVenus = (VM, s, sForm, tKey, N0) => [{ kind: 'solid', form: sForm, src: 'sun', n: VM.n, NQ: s.NQ, wAnc: s.wAnc }, { kind: 'thermal', form: VM.unit[tKey].form, src: 'sun', n: VM.n, N0, omega0: VM.unit[tKey].omega0 }];
/** 振幅の列(p の候補 —— 値の近い候補はまとめる・p の無い主の型の応答の表・第327便a の格子の主の p) */
function columnsOf(P) {
  const cols = [], gate = D.gate;
  for (const c of P.uniqueness.candidates) { const g = cols.find((q) => q.kind === 'candidate' && Math.abs(q.p - c.p) <= gate.agreeTol); if (g) g.forms.push(c.form); else cols.push({ key: 'cand:' + c.form, kind: 'candidate', p: c.p, forms: [c.form] }); }
  for (const k of P.uniqueness.tables) cols.push({ key: 'table:' + k, kind: 'table', form: k, fOver: Object.fromEntries(P.forms[k].fit.rows.map((r) => [r.key, r.f])) });
  cols.push({ key: 'grid:' + LS.DECL.pMain, kind: 'reference', p: LS.DECL.pMain, note: '第327便a の格子の主の p(決めた値ではない —— 比べる列)' });
  return cols;
}
export function partN(IN, P) {
  const VM = venusMats(IN), cols = columnsOf(P), rows = [], ctrl = [], thr = [], worst = { checked: 0, alongRel: 0, residualRel: 0, LTotalRel: 0, portCloseMaxRel: 0, k1TransferRel: 0, rejected: 0, expected: 0 };
  const tKeys = Object.keys(VM.unit), b = IN.bodies.venus, A0 = {};
  for (const col of cols) for (const fix of ['coupled', 'fixed']) for (const src of FD.sources) for (const fam of FD.families) {
    const p = col.kind === 'table' ? 0 : col.p, sys = sysOf(IN, src, SYS.venus, p, col.fOver), at1 = prmAt(IN, sys, fam, 1, fix);
    const ev1 = LS.evaluate(at1.sysE, at1.P1A), gkTau = ev1.rows[1].alongResidual, gal = ev1.rows[1].ports.find((q) => q.kind === 'gal');
    A0[[col.key, fix, src, fam].join('|')] = { A: at1.A, gkTau, galTarget: gal.nuAlong, f: sys[1].f, sunReactionTau: ev1.react[0], galaxySupplyTau: ev1.ledger.galaxySupply,
      external: fix === 'fixed' ? Object.assign({}, at1.sol.external, { overGalaxySupply: at1.sol.external.work / ev1.ledger.galaxySupply }) : null };
    for (const s of VM.solid) for (const tau of TAUS) {
      const at = prmAt(IN, sys, fam, tau, fix);
      for (const sForm of D.venus.solidForms) for (const tKey of tKeys) {
        worst.expected++;
        const gkAlong = tau === Infinity ? 0 : gkTau / tau, solidAlong = sForm === 'constQ' ? s.alongQ : s.alongLag, Dn = -(gkAlong + solidAlong), N0 = Dn / VM.unit[tKey].u;
        const r = { col: col.key, fix, src, fam, Q: s.Q, tau: tauKey(tau), sForm, tForm: tKey, gkAlong, solidAlong, N0, accepted: N0 >= 0, eps: N0 / (VM.perPa * VM.ps), epsOverLitHi: N0 / VM.litN0[1] };
        if (N0 >= 0) {
          const ev = LF.evaluateAll(at.sysE, at.prm, { venus: portsVenus(VM, s, sForm, tKey, N0) }), iE = at.sysE.findIndex((q) => q.key === D.fixedSource.ext);
          const Lg = ev.ledger, extWork = iE >= 0 ? -ev.rows[iE].reaction * at.sysE[iE].s : 0;
          r.alongRel = ev.rows[1].alongRel; r.ledgerRel = Lg.residualRel; r.LRel = Lg.LTotalRel; r.extWork = extWork; r.solar = Lg.solarSupply; r.heat = Lg.heat;
          worst.checked++; worst.alongRel = Math.max(worst.alongRel, r.alongRel); worst.residualRel = Math.max(worst.residualRel, Lg.residualRel); worst.LTotalRel = Math.max(worst.LTotalRel, Lg.LTotalRel);
          worst.portCloseMaxRel = Math.max(worst.portCloseMaxRel, Lg.portCloseMaxRel); worst.k1TransferRel = Math.max(worst.k1TransferRel, Lg.k1TransferRel);
        } else worst.rejected++;
        const main = sForm === D.venus.solidMain && tKey === D.venus.thermalMain;
        if (main) rows.push(r);
        else if (fix === 'coupled' && src === FD.sourceMain && fam === FD.familyMain && s.Q === LIT.Q.venusMain) ctrl.push(r);
      }
    }
    // τ_0 の閾(主の型 —— 固体の潮汐だけで足りる振幅 epsInf・τ_0 = 年齢の点の ε・文献の上の端で足りる最小の τ_0)
    const uC = -VM.unit[D.venus.thermalMain].u;
    for (const s of VM.solid) { const solidNeed = s.alongLag / uC, litHi = VM.litN0[1], litLo = VM.litN0[0];
      thr.push({ col: col.key, fix, src, fam, Q: s.Q, gkTau, tauLitHi: litHi > solidNeed ? gkTau / ((litHi - solidNeed) * uC) : null, tauLitLo: litLo > solidNeed ? gkTau / ((litLo - solidNeed) * uC) : null,
        epsInf: solidNeed / (VM.perPa * VM.ps), epsAge: (solidNeed + gkTau / LF.TAU_AGE / uC) / (VM.perPa * VM.ps) }); }
  }
  // 観測の点の安定(主の型と一定の Q の対照 × τ_0 無限と年齢 × 列 —— 今の列・源 J・族 E・Q 主)
  const nA = E.dot(VM.n, b.a), xObs = b.s - nA, grid = LF.scanGrid([nA, 0], xObs), stab = [], sM = VM.solid.find((q) => q.Q === LIT.Q.venusMain);
  for (const col of cols) for (const tk of ['inf', 'age']) for (const sForm of D.venus.solidForms) {
    const tau = tk === 'inf' ? Infinity : LF.TAU_AGE, p = col.kind === 'table' ? 0 : col.p, sys = sysOf(IN, FD.sourceMain, SYS.venus, p, col.fOver), at = prmAt(IN, sys, FD.familyMain, tau, 'coupled');
    const r0 = rows.concat(ctrl).find((q) => q.col === col.key && q.fix === 'coupled' && q.src === FD.sourceMain && q.fam === FD.familyMain && q.Q === LIT.Q.venusMain && q.tau === tk && q.sForm === sForm && q.tForm === D.venus.thermalMain);
    const ex = { venus: portsVenus(VM, sM, sForm, D.venus.thermalMain, r0.N0) }, fn = (sv) => LF.alongAt(at.sysE, at.prm, ex, 'venus', sv), eq = LF.equilibria(fn, grid);
    const zs = eq.roots.filter((z) => z.kind === 'zero'), obs = zs.find((z) => Math.abs(z.s - b.s) <= 1e-6 * Math.abs(b.s)) || null;
    stab.push({ col: col.key, tau: tk, sForm, tForm: D.venus.thermalMain, N0: r0.N0, neutral: eq.neutral, obsRoot: obs ? { s: obs.s, stable: obs.stable } : null, roots: zs.map((z) => ({ s: z.s, days: 2 * Math.PI / z.s / DAY, stable: z.stable })) });
  }
  return { columns: cols.map((c) => ({ key: c.key, kind: c.kind, p: c.kind === 'table' ? null : c.p, forms: c.forms || (c.form ? [c.form] : null), fVenus: c.fOver ? c.fOver.venus : null, note: c.note || null })),
    mats: { solid: VM.solid, perPa: VM.perPa, ps: VM.ps, sigmaObs: VM.sigmaObs, unit: VM.unit, litN0: VM.litN0 }, base: A0, rows, controls: ctrl, thresholds: thr, stability: stab, worst, note: D.notes.n0, tauNote: D.notes.tau0 };
}

/* ───────── F 源の自転を外部の口座に固定した列(第327便e の器の口 —— 源 J・太陽の口だけ別の半径 diffK1)───────── */
export function partF(HP, IN) {
  const I5 = IN.I5, st = IN.ST[LD.DECL.sourceMain], b = I5.bodies.venus, G = LD.DECL.venusGrid, c0 = XE.stencilAt(HP, I5, st, XE.IDX.venus, XE.IDX.sun, 1e4), d = c0.d;
  const grid = LD.radiusGrid(G, { d, Rd: b.Rd, R: b.R, RdSun: I5.bodies.sun.Rd }).filter((R) => R >= 1e3), cache = new Map();
  const tAt = (R) => { let c = cache.get(R); if (!c) { c = XE.stencilAt(HP, I5, st, XE.IDX.venus, XE.IDX.sun, R); cache.set(R, c); } return c.ok ? c.t[LD.DECL.formMain] : null; };
  const okR = grid.filter((R) => tAt(R) !== null), tidesOf = (r, s2) => I5.tides[r + ':' + s2].n, tK1 = XE.gradT(st, XE.IDX.venus, XE.IDX.sun);
  const solveCol = (sys, fam, fix) => { const prm = LD.paramsOf(I5.bodies, fam); return fix === 'fixed' ? RB.solveFixed(sys, prm) : LS.solve(sys, prm); };
  const cols = [];
  for (const fam of LD.DECL.families) for (const p of LD.DECL.pGrid) {
    const base = {}, out = { fam, p };
    for (const fix of ['coupled', 'fixed']) {
      const sysK1 = LD.systemOf(I5.bodies, SYS.venus, p, () => tK1, tidesOf), rK1 = solveCol(sysK1, fam, fix); base[fix] = rK1.A;
      const fn = (R) => { const t = tAt(R); return t ? solveCol(LD.systemOf(I5.bodies, SYS.venus, p, () => t, tidesOf), fam, fix).beta.venus : NaN; };
      const rg = LD.rootsOnGrid(fn, okR, G.rootIter), zeros = rg.roots.filter((r) => r.kind === 'zero');
      const z0 = zeros.length ? zeros.map((r) => r.x).sort((x, y) => x - y)[0] : null;
      let at = null;
      if (z0 !== null) { const sol = solveCol(LD.systemOf(I5.bodies, SYS.venus, p, () => tAt(z0), tidesOf), fam, fix);
        at = { R: z0, ROverRobs: z0 / b.R, nearInsideSun: d - z0 < I5.bodies.sun.R, A: sol.A, ARatio: sol.A / rK1.A, beta: sol.beta.venus, alongMaxRel: sol.alongMaxRel,
          external: fix === 'fixed' ? Object.assign({}, sol.external, { overGalaxySupply: sol.external.work / sol.ev.ledger.galaxySupply, overHeat: sol.external.work / sol.ev.ledger.heat }) : null,
          ledgerRel: fix === 'fixed' ? sol.ledgerFixed.residualRel : sol.ev.ledger.residualRel, LRel: fix === 'fixed' ? sol.ledgerFixed.LTotalRel : sol.ev.ledger.L.totalRel,
          heat: sol.ev.ledger.heat, k1Draw: sol.ev.ledger.k1Draw }; }
      // 太陽の口の寄与が最も大きい格子の点の A の比(今の列は源の反作用が A を動かす —— 固定の列は動かない)
      const along = okR.map((R) => I5.bodies.sun.s * E.dot(tAt(R), b.a)), iMax = along.reduce((m, v, k) => (Math.abs(v) > Math.abs(along[m]) ? k : m), 0);
      const sMax = solveCol(LD.systemOf(I5.bodies, SYS.venus, p, () => tAt(okR[iMax]), tidesOf), fam, fix);
      out[fix] = { AK1: rK1.A, betaK1: rK1.beta.venus, signChanges: rg.flips.length, zeros: zeros.length, jumps: rg.roots.length - zeros.length, acceptedPoints: rg.vals.filter((v) => v >= 0).length, points: okR.length,
        smallestZero: at, atMaxSunPort: { R: okR[iMax], ARatio: sMax.A / rK1.A, external: fix === 'fixed' ? sMax.external : null } };
    }
    out.AK1Rel = E.relD(base.coupled, base.fixed);
    cols.push(out);
  }
  return { form: LD.DECL.formMain, src: LD.DECL.sourceMain, d, gridPoints: okR.length, cols };
}

/* ───────── T 火星と地球の局所の尺度(AN566)───────── */
export function partT(IN, N) {
  const out = [], solidOf = (key, rs, Q) => { const b = IN.bodies[key], orb = IN.tides[key + ':' + rs], Xp = LF.tidalScale({ Mr: IN.bodies[rs].m, R: b.R, a: orb.sma }), NQ = 1.5 * LIT.k2[key] / Q * Xp;
    return { n: orb.n, NQ, wAnc: E.norm(E.sub(orb.n, E.scale(b.a, b.s))) }; };
  const thOf = (key) => { const b = IN.bodies[key], orb = IN.tides[key + ':sun']; return { n: orb.n, perPa: LF.thermalN0({ eps: 1, ps: 1, Msun: IN.bodies.sun.m, M: b.m, R: b.R, a: orb.sma }), ps: LIT.surfacePressurePa[key] }; };
  const sol = { mars: [solidOf('mars', 'sun', LIT.Q.mars)], earth: [solidOf('earth', 'sun', LIT.Q.earth), solidOf('earth', 'moon', LIT.Q.earth)], moon: [solidOf('moon', 'earth', LIT.Q.moon)] }, th = { mars: thOf('mars'), earth: thOf('earth') };
  const pts = (key, sForm, eps) => { const o = sol[key].map((q) => ({ kind: 'solid', form: sForm, src: 'x', n: q.n, NQ: q.NQ, wAnc: q.wAnc })); if (th[key]) o.push({ kind: 'thermal', form: 'constPhase', src: 'sun', n: th[key].n, N0: eps * th[key].perPa * th[key].ps, omega0: null }); return o; };
  for (const col of N.columns) for (const tk of ['inf', 'age']) for (const sForm of D.venus.solidForms) {
    const vr = N.rows.concat(N.controls).find((q) => q.col === col.key && q.fix === 'coupled' && q.src === FD.sourceMain && q.fam === FD.familyMain && q.Q === LIT.Q.venusMain && q.tau === tk && q.sForm === sForm && q.tForm === D.venus.thermalMain);
    if (!vr) continue;
    const eps = vr.eps, tau = tk === 'inf' ? Infinity : LF.TAU_AGE, p = col.kind === 'table' ? 0 : col.p, fO = col.kind === 'table' ? (N.colF[col.key] || null) : null;
    const rowOf = (sysKey, keys, ex) => { const sys = sysOf(IN, FD.sourceMain, keys, p, fO), at = prmAt(IN, sys, FD.familyMain, tau, 'coupled'), ev = LF.evaluateAll(at.sysE, at.prm, ex);
      return keys.filter((k) => k !== 'sun').map((k) => { const r = ev.rows.find((q) => q.key === k), bb = IN.bodies[k], ls = RB.localScale({ I: bb.I, s: bb.s, N: r.along }); return { key: k, Nnet: r.along, tChange: ls.tChange, tChangeOverAge: ls.tChange / LF.TAU_AGE, kind: ls.kind, ledgerRel: ev.ledger.residualRel }; }); };
    out.push({ col: col.key, tau: tk, sForm, eps, mars: rowOf('mars', SYS.mars, { mars: pts('mars', sForm, eps) })[0], triEM: rowOf('triEM', SYS.triEM, { earth: pts('earth', sForm, eps), moon: pts('moon', sForm, 0) }) });
  }
  return { rows: out, note: D.notes.local };
}

/* ───────── U AN550(p が 1 つのときだけ予言をやり直す)───────── */
export function partU(P) {
  if (!P.uniqueness.unique) return { redone: false, why: 'p が 1 つでない(' + D.uniqueRule + ' —— 応答の表の主の型: ' + P.uniqueness.tables.join('・') + ')—— やり直しは p の後', candidates: P.uniqueness.candidates };
  return { redone: false, why: 'p は 1 つ —— 本便の器はやり直しの段を持たない(統括に報告)', p: P.uniqueness.p };
}

/* ───────── 全部と門 ───────── */
export function runAll(HP) {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const IN = partI(HP); mark('I');
  const C = partC(IN); mark('C');
  const P = partP(HP, IN, C); mark('P');
  const S = partS(C); mark('S');
  const N = partN(IN, P); mark('N');
  N.colF = Object.fromEntries(columnsOf(P).filter((c) => c.kind === 'table').map((c) => [c.key, c.fOver]));
  const T = partT(IN, N); mark('T');
  delete N.colF;
  const F = partF(HP, IN); mark('F');
  const U = partU(P);
  const PS = RB.pureScenes(), PG = RB.pureGates(PS);
  const inputs = { units: IN.units, g: IN.g, tauAge: LF.TAU_AGE, taus: TAUS.map(tauKey), bodies: Object.fromEntries(BODY8.map((k) => { const q = IN.bodies[k]; return [k, { m: q.m, R: q.R, s: q.s, a: q.a, Rd: q.Rd, moi: q.moi, I: q.I }]; })) };
  const J = { inputs, contract: C, p: P, spatial: S, venus: N, fixedSource: F, transient: T, prediction: U, pure: { scenes: PS, gates: PG }, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}
export function gatesOf(J) {
  const P = J.p, N = J.venus, F = J.fixedSource, T = J.transient, C = J.contract;
  const vs = Object.values(P.forms).map((f) => f.verdict);
  return {
    pure: Object.values(J.pure.gates).every(Boolean),
    contractShape: C.check.ok === true && C.check.nulls.includes('convergence.curlConverged') && Number.isFinite(C.slip.mag),
    // 既定の列の照合: エンジンの読み口の係数と同じ(K1 の規則の写しの全受け手・金星の R_d 0.1・10 倍・質量 10 倍)
    defaultReproduced: P.defaultColumn.maxRel <= 1e-12 && P.defaultColumn.cases.every((c) => c.ok && c.rel <= 1e-12) && P.forms.engineDefault.verdict.constantExponent
      && Math.abs(P.forms.engineDefault.verdict.slopeRd - 1) <= 1e-12 && Math.abs(P.forms.engineDefault.verdict.slopeM + 1) <= 1e-12,
    negativeControl: P.negative.jointBlind && P.negative.independentSees && P.forms.nullP0.verdict.p === 0,
    // p の候補は門で決まる(型ごとの判定が 2 つの基準の受け手で同じ・候補は本の天体の線と独立に振った指数の和が一致)
    verdictsStable: vs.every((v) => v.baseAgree) && vs.filter((v) => v.p !== null).every((v) => v.consistent === true),
    spatialSeparate: J.spatial.contractConstant === true && Object.values(J.spatial.slopeAtR0).every(Number.isFinite),
    venusAllChecked: N.worst.checked + N.worst.rejected === N.worst.expected && N.worst.alongRel <= 1e-12 && N.worst.residualRel <= 1e-12 && N.worst.LTotalRel <= 1e-12 && N.worst.portCloseMaxRel <= 1e-12 && N.worst.k1TransferRel <= 1e-12,
    fixedSourceLedger: F.cols.every((c) => ['coupled', 'fixed'].every((k) => !c[k].smallestZero || (c[k].smallestZero.ledgerRel <= 1e-12 && c[k].smallestZero.LRel <= 1e-12 && c[k].smallestZero.alongMaxRel <= 1e-12)))
      && F.cols.every((c) => !c.fixed.smallestZero || c.fixed.smallestZero.external.workVsDrawRel <= 1e-12) && F.cols.every((c) => c.fixed.atMaxSunPort.ARatio === 1),
    transientLocal: T.rows.length > 0 && T.rows.every((r) => r.mars.kind === 'local-instantaneous' && r.triEM.every((q) => q.kind === 'local-instantaneous' && q.ledgerRel <= 1e-12) && r.mars.ledgerRel <= 1e-12),
  };
}

/* ───────── 走らせる ───────── */
export async function main() {
  const TARGET = process.env.W328B_TARGET || 'beta/index.html';
  const OUT = process.env.W328B_OUT ? (path.isAbsolute(process.env.W328B_OUT) ? process.env.W328B_OUT : path.join(ROOT, process.env.W328B_OUT)) : path.join(ROOT, OUT_MAIN);
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now(), text = fs.readFileSync(html, 'utf8'), targetSha256 = crypto.createHash('sha256').update(text).digest('hex');
  const W281A_SCOPE = REGEN_SCOPE ? w281aScopeStamp(html, REGEN_SCOPE) : {};
  const { HP } = loadHtmlMain(html);
  console.log('第328便b response(版 ' + HARNESS_VERSION + ')');
  const R = runAll(HP);
  const out = { version: HARNESS_VERSION, libVersion: RB.LIB_VERSION, contractVersion: RB.CONTRACT_VERSION, w327fLibVersion: LF.LIB_VERSION, w327eLibVersion: LD.LIB_VERSION, w327aLibVersion: LS.LIB_VERSION, w326dLibVersion: E.LIB_VERSION,
    w321cLibVersion: GF.LIB_VERSION, fieldVersion: GF.FIELD_VERSION, generator: 'tests/exp-w328b-response.mjs', target: TARGET, targetSha256, reuseFrom: null,
    ruling: '原仮定者の回答(2026-11-05 —— AN559・AN561・AN562・AN563・AN550・AN566)・統括の検証項目 R302',
    decl: D, notClaim: NOT_CLAIM, invSqVersion: HP.REL_DRAG_INVSQ_VERSION || null, srcMomentVersion: HP.REL_DRAG_INVSQ_SRC_MOMENT_VERSION || null, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w328b-response.mjs', 'tests/lib-w328b-response.mjs', 'tests/lib-w327f-venustide.mjs', 'tests/exp-w327e-axialdiff.mjs', 'tests/lib-w327e-axialdiff.mjs', 'tests/exp-w327a-axialsum.mjs', 'tests/lib-w327a-axialsum.mjs',
    'tests/lib-w327b-galaxis.mjs', 'tests/lib-w321c-galfield.mjs', 'tests/lib-w320c-nbcompose.mjs', 'tests/lib-w319b-srcradius.mjs', 'tests/exp-w326d-axialheat.mjs', 'tests/lib-w326d-axialheat.mjs', 'tests/lib-w319a-axisheat.mjs',
    'tests/lib-w280b-emgrid.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第328便b', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, stage: 'response', engine: 'Node(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・1 プロセス)と第321便c の場の API の純関数', notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();
