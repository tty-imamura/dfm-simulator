// 第328便a(原仮定者の回答(2026-11-05 —— AN551・AN552・AN553)・統括の検証項目 R301): **場の API の opt-in の契約と直接の滑りの宣言の型の器**
//   (段 fieldcontract-328a —— 正本 tests/out/fieldcontract-w328a.json・lib tests/lib-w328a-fieldcontract.mjs)。**診断と契約だけ** —— エンジン・内蔵の本・受理器・
//   第321便c の lib・第326便d と第327便b の器と lib の本文は変えない(呼ぶだけ)。
//
// Node だけ(太陽の式の A は対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、第327便b の器 tests/exp-w327b-galaxis.mjs の関数〔partPath1 —— 第326便d の
//   器の partI・partK・partS・solveAt を呼ぶ〕をそのまま呼ぶ。場の値は第321便c の場の API〔sample〕を本 lib の opt-in の口 sampleWithContract で呼ぶ)。1 プロセス(子プロセスなし)。
//   入力は html だけ(他の正本は読まない)。
//
// ■ 何をするか
//   B 第327便b の表の列を作り直す(器の関数 partPath1・partPath2・partGrid・partTable・partRel —— 照合の基準)
//   O 古い呼び出しのビット同一(契約を求めない口 = 第321便c の sample —— 太陽の位置の照合の別経路と正規化つき・高さ・中心と残余・有効域の外・代理)
//   C 契約(版 w328a-fieldcontract-1): 太陽の位置の契約(枠・定数の Ω_field の宣言の候補・収束の印・由来・伝達・帳簿の参照)・宣言なしの契約(欠測は null)・中心と残余の契約
//   D 直接の滑り(AN551 = A —— 本の宣言の型): ν_G = g_T(Ω_arm − Ω_field)ĝ で太陽の式の検査(g_T = 1・Ω_arm は腕のパターンの角速度の文献の範囲の上端)・腕と物質に対する相対を別に
//   K 対照の列(剛体の読み・半渦度・シア・K1 の源の幾何 —— 第327便b の表の列と同じ値)と同じ形の仮定の利得・要る相対の角速度
//   L 双対(反作用と仕事を同じ係数で —— 第326便d の lib の evaluate の帳簿の上で): 太陽だけの系と太陽・金星・木星・イオの系の銀河の口ごとに 腕 + 場の供給 = N·ν・
//     帳簿は一度だけ数えて閉じる・重ねると閉じない(否定対照)・違う係数は合わない(否定対照)・角運動量の残りは銀河の中心の口座
//   G 収束の印(u と curl を別に —— 点のセルの和の格子 48〜384 と主の経路)
//   Y 縮退(太陽の 1 式で g_T と Ω_field —— ランク 1・解かない)
//   H 第327便b の引き継ぎの成分の行き先(契約に入れた 3 つ・参照だけの帳簿・版 1 の外の回転する枠の入力)
//   P 純関数の場面(lib の pureScenes —— QA lint.fieldContract328a と同じ)
// ■ 言わないこと: Ω_field の値は宣言の候補(同定の値ではない)・銀河場の同定と数えない・腕より速い場は観測の量ではない・符号だけからトルクの向きを導いたと書かない
//   (直接の滑りは構成則の採用)・g_T と Ω_field を分けない(ランク 1)・座標の枠を変える操作と新しい場を足す操作を混ぜない・回転曲線の予言ではない。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as F from './lib-w321c-galfield.mjs';
import * as L9 from './lib-w319b-srcradius.mjs';
import * as X6 from './exp-w326d-axialheat.mjs';
import * as L6 from './lib-w326d-axialheat.mjs';
import * as B7 from './exp-w327b-galaxis.mjs';
import * as G7 from './lib-w327b-galaxis.mjs';
import * as C from './lib-w328a-fieldcontract.mjs';
// 第281便a の領域 hash の宣言(版 8 —— 器と lib と import の閉包から deriveScope で引いた下限そのもの。器が引く本は 🗺️ 1 本〔第326便d の器の copyBook が .find で引く〕。presets の他の 11 本と
//   roots の短い名〔$・T・ab・ch・ctx・cw・pnSource〕と inertialDragGalaxyAxialState は import した lib〔第321便c の場の API が読む第319便b の lib とその import〕・第326便d と第327便b の器の綴りが
//   数えられた分 —— この器と lib の局所の変数には使わない。ワンタップ対照 A/B は走らせない〔abBody:false —— 閉包に A/B の語 0〕・説明文の欄 familyRole は読まない)
const REGEN_SCOPE = {"presets":["jupiterGalilean","jupiterSunInertial3d","marsSunInertial3d","mercury","mercurySunInertial3d","neptuneSunInertial3d","saturn","saturnRingReal","saturnSunInertial3d","solarSystem16Inertial3d","uranusSunInertial3d","venusSunInertial3d"],"roots":["$","HP.REL_DRAG_INVSQ_SRC_MOMENT_VERSION","HP.REL_DRAG_INVSQ_VERSION","HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.inertialDragIsqState","HP.sim","HP.validatePreset","T","ab","ch","ctx","cw","inertialDragGalaxyAxialState","pnSource"],"core":true,"consts":[],"complete":true,"abBody":false};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w328a-fieldcontract-1';
export const OUT_MAIN = 'tests/out/fieldcontract-w328a.json';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze(['Ω_field の値は宣言の候補(同定の値ではない —— g_T と Ω_field は太陽の 1 式で縮退)', '銀河場の同定と数えない', '腕より速い場は観測の量ではない(AN536 の仮定)',
  '直接の滑りは構成則の採用(相対の回転の符号だけからトルクの向きを導いたと書かない)', '座標の枠を変える操作と新しい場を足す操作を混ぜない(Ω_field を宣言しても u は変えない)',
  '対照の列は本の宣言の型ではない(剛体の読み・半渦度・シア・K1 の源の幾何)', 'u が近いことを curl の収束とみなさない', '回転曲線の予言ではない(流れは宣言の入力)']);
/** 器の宣言(走行の前に置く —— 結果を見て変えない) */
export const PLAN = Object.freeze({
  // 直接の滑りの宣言の候補: g_T = 1(第326便d の銀河の口と同じ利得)・Ω_arm = 腕のパターンの角速度の文献の範囲の上端(前提 Ω_field > Ω_arm を範囲の全域で保つ側 —— 第327便b の直接の型の要る Ω_field と同じ式)
  gTDeclared: 1, armPick: 'hi',
  // 縮退の列(g_T の宣言の列 —— 1・0.5・2 と剛体の読みの同じ形の仮定の利得〔器が第327便b の列から読む〕)
  gTsDegeneracy: Object.freeze([1, 0.5, 2]),
  // 古い呼び出しの照合の場面(位置 [kpc]・源・opts —— 太陽の位置の照合の別経路と正規化つきは第327便b の経路 2 と同じ呼び出し)
  oldCalls: Object.freeze(['mainCheckNorm', 'plain', 'zMinusCheck', 'split', 'outside', 'proxy']),
  // 双対の系(第326便d の器の solveAt —— 太陽だけ・太陽・金星・木星・イオ・p = 0)と否定対照の係数の倍率
  dualSystems: Object.freeze(['sunOnly', 'solve4']), dualP: 0, mismatchFactor: 2,
});

const POS = () => [F.FLOW.R0kpc, 0, 0];
const relD = (a, b) => (a === b ? 0 : Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b)));
const js = (x) => JSON.stringify(x);

/* ───────── B 第327便b の表の列(照合の基準)───────── */
export function partBase(HP) {
  const P1 = B7.partPath1(HP), P2 = B7.partPath2(), Gd = B7.partGrid(P2), T7 = B7.partTable(P1, P2, Gd), R7 = B7.partRel(P1, P2, T7), H7 = B7.partHand(P2);
  return { P1, P2, Gd, T7, R7, H7 };
}

/* ───────── O 古い呼び出しのビット同一 ───────── */
export function partOld(B) {
  const pos = POS(), cases = {
    mainCheckNorm: [pos, F.fullState(), { check: true, normalization: true }],
    plain: [pos, F.fullState(), {}],
    zMinusCheck: [[pos[0], 0, G7.DECL.zSensKpc[0]], F.fullState(), { check: true }],
    split: [pos, F.splitState(G7.DECL.rCutKpc), {}],
    outside: [[50, 0, 0], F.fullState(), {}],
    proxy: [pos, { model: F.MODEL_ID, stationary: true, terms: [{ key: 'proxy', coef: 1, owns: [{ comp: 'galaxy:proxy' }], proxy: { J: 1e67 } }] }, {}],
  };
  const rows = PLAN.oldCalls.map((k) => {
    const [p, st, o] = cases[k], w = C.sampleWithContract(p, 0, st, o);
    const ref = k === 'mainCheckNorm' ? B.P2.main : F.sample(p, 0, st, o);   // 太陽の位置の照合の別経路と正規化つきは第327便b の経路 2 の呼び出しの戻り値そのもの
    return { key: k, bitSame: js(w) === js(ref), noFieldContract: !('fieldContract' in w), ok: w.ok };
  });
  return { rows, allBitSame: rows.every((q) => q.bitSame && q.noFieldContract) };
}

/* ───────── C 契約 ───────── */
export function armOf(R7) { const Op = R7.OmegaPattern; return { lo: Op[0], mid: 0.5 * (Op[0] + Op[1]), hi: Op[1] }; }
export function partContract(B) {
  const { P1, P2, Gd, R7 } = B, pos = POS(), arm = armOf(R7), Oarm = arm[PLAN.armPick];
  const cand = C.requiredOmegaField({ A: P1.A, gT: PLAN.gTDeclared, OmegaArm: Oarm });
  const conv = C.judgeConvergence({ ring: { u: P2.uPhi, curl: P2.halfCurlZ }, rows: Gd.rows.map((q) => ({ nr: q.nr, u: q.uPhi, curl: q.cand.halfCurl.alongG })) });
  const decl = { frame: {}, omegaField: { mode: 'constant', value: cand.OmegaField, at: { R_kpc: pos[0], z_kpc: pos[2] }, source: 'declared' }, transfer: { form: 'directSlip', gT: PLAN.gTDeclared }, convergence: conv };
  const W = C.sampleWithContract(pos, 0, F.fullState(), { check: true, normalization: true, contract: decl });
  const { fieldContract: main, ...rest } = W;
  const nullC = C.buildFieldContract(B.P2.main, {});
  const SW = C.sampleWithContract(pos, 0, F.splitState(G7.DECL.rCutKpc), { contract: decl }), split = SW.fieldContract;
  const outC = C.sampleWithContract([50, 0, 0], 0, F.fullState(), { contract: decl }).fieldContract;
  return { decl, main, nullContract: nullC, splitContract: split, outsideContract: outC, restBitSame: js(rest) === js(B.P2.main), candidate: cand, OmegaArm: Oarm, arm,
    shape: { main: C.contractShapeOk(main), nullC: C.contractShapeOk(nullC), split: C.contractShapeOk(split), outside: C.contractShapeOk(outC) }, W };
}

/* ───────── D 直接の滑り(太陽の式の検査)───────── */
export function partDirect(B, CT) {
  const { P1, R7 } = B, s = C.directSlipOf(CT.main, CT.OmegaArm), chk = C.sunCheck({ A: P1.A, gT: CT.main.transfer.gT, OmegaArm: CT.OmegaArm, OmegaField: CT.main.omegaField.value });
  const rel = C.relOfField({ OmegaField: CT.main.omegaField.value, OmegaArm: CT.OmegaArm, OmegaMat: R7.OmMat });
  const sens = Object.fromEntries(Object.entries(CT.arm).map(([k, Oa]) => [k, C.requiredOmegaField({ A: P1.A, gT: PLAN.gTDeclared, OmegaArm: Oa }).OmegaField]));
  const nul = C.directSlipOf(CT.nullContract, CT.OmegaArm);
  return { A: P1.A, AJ: P1.variants.J.AE, OmegaArm: CT.OmegaArm, OmegaField: CT.main.omegaField.value, gT: CT.main.transfer.gT, nuAlong: s.nuAlong, slipArm: s.slipArm, premise: s.premise,
    closureRel: relD(s.nuAlong, P1.A), sunResidualRel: chk.rel, vs327bOmegaField: relD(CT.main.omegaField.value, R7.OmegaFieldDirect), rel, relDiff: rel.toArm - rel.toMatter, OmegaMat: R7.OmMat,
    periodS: 2 * Math.PI / CT.main.omegaField.value, overOmMat: CT.main.omegaField.value / R7.OmMat, armSens: sens, armSensRel: relD(sens.lo, sens.hi), nullSlip: { ok: nul.ok, nu: nul.nu } };
}

/* ───────── K 対照の列 ───────── */
export function partControls(B, CT) {
  const { P1, P2, R7 } = B, pos = POS(), W = CT.W, cand = G7.candidatesOf({ posKpc: pos, u: W.u, G: W.gradU });
  const req7 = Object.fromEntries(R7.required.map((q) => [q.key, q]));
  const rows = [{ key: 'direct', role: 'declared', alongG: null, gain: PLAN.gTDeclared }].concat(cand.map((q) => ({ key: q.key, role: 'control', alongG: q.alongG, gain: q.alongG / R7.OmMat })))
    .map((q) => {
      const r = G7.requiredRel({ A: P1.A, gain: q.gain }), b = req7[q.key], need = q.gain > 0 ? C.requiredOmegaField({ A: P1.A, gT: q.gain, OmegaArm: CT.OmegaArm }) : { OmegaField: null, consistent: false };
      return Object.assign(q, { vs327bAlong: q.alongG === null ? null : relD(q.alongG, P2.cand[q.key].alongG), vs327bGain: relD(q.gain, b.gain), OmRelReq: r.OmRelReq, vs327bOmRel: relD(r.OmRelReq, b.OmRelReq),
        consistent: r.consistent, consistentSame: r.consistent === b.consistent, OmegaFieldReq: need.OmegaField, vs327bField: b.fieldRange && need.OmegaField !== null ? relD(need.OmegaField, b.fieldRange[1]) : null,
        overOmMat: r.OmRelReq / R7.OmMat });
    });
  return { rows, OmMat: R7.OmMat, maxAlong: Math.max(...rows.filter((q) => q.vs327bAlong !== null).map((q) => q.vs327bAlong)), maxGain: Math.max(...rows.map((q) => q.vs327bGain)),
    maxOmRel: Math.max(...rows.map((q) => q.vs327bOmRel)), consistentKeys: rows.filter((q) => q.consistent).map((q) => q.key) };
}

/* ───────── L 双対(第326便d の帳簿の上で)───────── */
export function partDual(HP, CT, D) {
  const I = X6.partI(HP), K = X6.partK(HP, I, 'now'), GF = L9.galFrame(), gE = GF.toEcl(CT.main.frame.axis), angDeg = L6.angDeg(gE, I.g);
  const keysOf = { sunOnly: ['sun'], solve4: L6.DECL.solveBodies };
  let lastRefs = null;
  const systems = PLAN.dualSystems.map((nm) => {
    const r = X6.solveAt(I, K, keysOf[nm], PLAN.dualP), ev = L6.evaluate(r.sys, Object.assign({}, r.prm, { A: D.nuAlong, k: r.k })), lg = ev.ledger;
    const ports = [];
    let sumSupply = 0, rem = [0, 0, 0], mis = 0, rs = 0;
    for (const row of ev.rows) for (const p of row.ports) {
      if (p.kind !== 'gal') continue;
      const d = C.dualOf({ N: p.torque, gT: CT.main.transfer.gT, OmegaArm: CT.OmegaArm, OmegaField: CT.main.omegaField.value, axis: I.g });
      const m = C.dualOf({ N: p.torque, gT: CT.main.transfer.gT, OmegaArm: CT.OmegaArm, OmegaField: CT.main.omegaField.value, axis: I.g, coefReaction: PLAN.mismatchFactor * CT.main.transfer.gT });
      ports.push({ key: row.key, nuAlong: L6.dot(p.nu, I.g), nuVsContract: relD(L6.dot(p.nu, I.g), D.nuAlong), supply: p.supply, supplySum: d.supplySum, supplyRel: Math.abs(d.supplySum - p.supply) / Math.abs(p.supply),
        workArm: d.workArm, workField: d.workField, reactionArm: d.reactionArm, reactionField: d.reactionField, reactionSum: d.reactionSum, heat: p.heat, mismatchRel: m.supplyRel });
      sumSupply += d.supplySum; rem = L6.add(rem, d.remainderToCenter); mis = Math.max(mis, m.supplyRel); rs = Math.max(rs, Math.abs(d.reactionSum));
    }
    const doubled = Math.abs(lg.galaxySupply + sumSupply + lg.orbitWork - lg.heat - lg.spinPower) / Math.max(Math.abs(lg.galaxySupply), Math.abs(lg.heat));
    const ev0 = L6.evaluate(r.sys, Object.assign({}, r.prm, { A: r.A, k: r.k }));
    // 契約の帳簿の参照(名前だけ)をこの系の ledger の上で引く —— 供給と熱は数・反作用は 3 成分
    const rf = Object.fromEntries(Object.entries(CT.main.ledgerRefs).map(([k, ref]) => { const v = C.resolveLedgerRef(ref, lg); return [k, Array.isArray(v) && v.length === 3 ? 'vec3' : v]; }));
    lastRefs = rf;
    return { key: nm, bodies: keysOf[nm].slice(), A326d: r.A, AVsContract: relD(r.A, D.nuAlong), ports, galaxySupply: lg.galaxySupply, orbitWork: lg.orbitWork, heat: lg.heat, spinPower: lg.spinPower,
      sumVsLedger: relD(sumSupply, lg.galaxySupply), ledgerResidualRel: lg.residualRel, doubledRel: doubled, remainderRel: L6.norm(L6.sub(rem, lg.L.galaxyCenter)) / Math.max(L6.norm(lg.L.galaxyCenter), 1e-300),
      mismatchMinRel: Math.min(...ports.map((q) => q.mismatchRel)), mismatchMaxRel: mis, reactionSumMax: rs, galaxySupplyVs326d: relD(lg.galaxySupply, ev0.ledger.galaxySupply),
      portSupplyMaxRel: Math.max(...ports.map((q) => q.supplyRel)) };
  });
  return { frameAxisAngDeg: angDeg, systems, ledgerRefs: CT.main.ledgerRefs, refsResolve: lastRefs.supply === systems[systems.length - 1].galaxySupply && lastRefs.heat === systems[systems.length - 1].heat && lastRefs.reaction === 'vec3' };
}

/* ───────── G 収束の印 ───────── */
export function partConv(B, CT) {
  const { P2, Gd } = B, mc = CT.main.convergence;
  const per = Object.fromEntries(G7.DECL.candidates.map((k) => { const j = C.judgeConvergence({ ring: { u: P2.cand[k].alongG, curl: P2.cand[k].alongG }, rows: Gd.rows.map((q) => ({ nr: q.nr, u: q.cand[k].alongG, curl: q.cand[k].alongG })) });
    return [k, { converged: j.curlConverged, signs: j.gridSigns, lastRel: Math.abs(Gd.rows[Gd.rows.length - 1].cand[k].rel) }]; }));
  return { uConverged: mc.uConverged, curlConverged: mc.curlConverged, gridSigns: mc.gridSigns, signsVs327b: js(mc.gridSigns) === js(Gd.signs.halfCurl.signs), uLastRel: Math.abs(Gd.uLastRel),
    grids: Gd.rows.map((q) => [q.nr, q.np, q.nz]), perCandidate: per, routeRel: Math.abs(P2.routeZ) / Math.abs(P2.halfCurlZ) };
}

/* ───────── Y 縮退 ───────── */
export function partDegeneracy(B, CT, K) {
  const rigid = K.rows.find((q) => q.key === 'rigid'), gTs = PLAN.gTsDegeneracy.concat([rigid.gain]);
  const Dg = C.degeneracyOf({ A: B.P1.A, OmegaArm: CT.OmegaArm, gTs });
  return Object.assign(Dg, { gTs, rigidOmegaField: Dg.rows[Dg.rows.length - 1].OmegaField, rigidVs327b: relD(Dg.rows[Dg.rows.length - 1].OmegaField, rigid.OmegaFieldReq) });
}

/* ───────── H 引き継ぎの成分の行き先 ───────── */
export const HANDOFF_MAP = Object.freeze([
  Object.freeze({ key: 'frameInput', to: 'frame', status: 'declaredOnly', ja: '枠の宣言(原点・軸・速度の基準・時刻と長さの単位・omegaFrame = 0 —— 回転する枠の入力は版 1 の外)' }),
  Object.freeze({ key: 'fieldOmega', to: 'omegaField', status: 'added', ja: '定数の Ω_field の宣言(値・位置・基準・単位・出どころ —— 欠測は null)' }),
  Object.freeze({ key: 'curlResolved', to: 'convergence', status: 'added', ja: '収束の印(u と curl を別に・格子の符号の列)' }),
  Object.freeze({ key: 'torqueWork', to: 'ledgerRefs', status: 'refOnly', ja: '帳簿の口座への参照だけ(計算は第326便d の lib の evaluate —— AN553 = B)' }),
]);
export function partHand(B, CT) {
  const miss327b = B.H7.missing, rows = HANDOFF_MAP.map((h) => ({ key: h.key, to: h.to, status: h.status, ja: h.ja, missingIn327b: miss327b.includes(h.key), inContract: CT.main[h.to] !== undefined && CT.main[h.to] !== null }));
  return { rows, missing327b: miss327b, haveAll: rows.every((q) => q.inContract), sourcesAlso: Array.isArray(CT.main.sources) && CT.main.sources.length > 0, transferAlso: CT.main.transfer.version === C.TRANSFER_VERSION };
}

/* ───────── 全部と門 ───────── */
export function runAll(HP) {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const B = partBase(HP); mark('base327b');
  const O = partOld(B); mark('old');
  const CT = partContract(B); mark('contract');
  const D = partDirect(B, CT), K = partControls(B, CT); mark('directControls');
  const Lg = partDual(HP, CT, D); mark('dual');
  const Gv = partConv(B, CT), Y = partDegeneracy(B, CT, K), H = partHand(B, CT); mark('convDegHand');
  const PS = C.pureScenes(), PG = C.pureGates(PS); mark('pure');
  const { W, ...CTrec } = CT;
  const J = { base: { A: B.P1.A, uPhi: B.P2.uPhi, halfCurlZ: B.P2.halfCurlZ, OmMat: B.R7.OmMat, OmegaPattern: B.R7.OmegaPattern, OmegaFieldDirect327b: B.R7.OmegaFieldDirect, fasterThanArm: B.R7.fasterThanArm,
      fieldVersion: B.P2.fieldVersion, fieldLibVersion: B.P2.fieldLibVersion, galaxisLibVersion: G7.LIB_VERSION, galaxisHarnessVersion: B7.HARNESS_VERSION },
    old: O, contract: CTrec, direct: D, controls: K, dual: Lg, convergence: Gv, degeneracy: Y, handoff: H, pure: { scenes: PS, gates: PG }, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}
export function gatesOf(J) {
  const O = J.old, CT = J.contract, D = J.direct, K = J.controls, Lg = J.dual, Gv = J.convergence, Y = J.degeneracy, H = J.handoff, M = CT.main, N0 = CT.nullContract;
  return {
    pure: Object.values(J.pure.gates).every(Boolean),
    oldCallsBitSame: O.rows.length === PLAN.oldCalls.length && O.allBitSame === true && CT.restBitSame === true,
    contractShape: Object.values(CT.shape).every((x) => x === true) && M.version === C.CONTRACT_VERSION && M.frame.omegaFrame === 0 && M.omegaField.source === 'declared' && M.transfer.gT === PLAN.gTDeclared,
    missingIsNull: N0.omegaField.value === null && N0.omegaField.at === null && N0.transfer.gT === null && N0.convergence.uConverged === null && N0.convergence.curlConverged === null && N0.convergence.gridSigns === null
      && CT.outsideContract.sources === null && D.nullSlip.ok === false && D.nullSlip.nu === null,
    sourcesFromApi: M.sources.length === 1 && CT.splitContract.sources.length === 2 && new Set(CT.splitContract.sources.map((q) => q.sourceId)).size === 2,
    sunClosure: D.closureRel <= 1e-12 && D.sunResidualRel <= 1e-12 && D.premise === true && D.vs327bOmegaField <= 1e-15 && D.A < 0 && D.OmegaField > D.OmegaArm,
    armVsMatter: D.rel.toArm < 0 && D.rel.toMatter < 0 && D.rel.toArm !== D.rel.toMatter && D.armSensRel < 1e-9,
    controlsMatch327b: K.rows.length === 1 + G7.DECL.candidates.length && K.maxAlong <= 1e-12 && K.maxGain <= 1e-12 && K.maxOmRel <= 1e-12 && K.rows.every((q) => q.consistentSame)
      && js(K.consistentKeys) === js(['direct', 'rigid']) && K.rows.filter((q) => q.vs327bField !== null).every((q) => q.vs327bField <= 1e-12) && K.rows.filter((q) => q.role === 'declared').length === 1,
    dualLedger: Lg.systems.length === PLAN.dualSystems.length && Lg.systems.every((s) => s.portSupplyMaxRel <= 1e-12 && s.sumVsLedger <= 1e-12 && s.ledgerResidualRel <= 1e-12 && s.doubledRel > 0.5
      && s.remainderRel <= 1e-12 && s.mismatchMinRel > 1e-3 && s.reactionSumMax === 0 && s.AVsContract <= 1e-12 && s.galaxySupplyVs326d <= 1e-11 && s.ports.every((p) => p.nuVsContract <= 1e-12)) && Lg.refsResolve === true,
    frameAxisSame: Lg.frameAxisAngDeg <= 1e-9,
    convergenceSeparate: Gv.uConverged === true && Gv.curlConverged === false && Gv.signsVs327b === true && Gv.perCandidate.halfCurl.converged === false,
    degeneracyRankOne: Y.rankOne === 1 && Y.unknowns === 2 && Y.rows.every((q) => q.OmegaField !== null && q.productRel <= 1e-12) && Y.distinctPairs === Y.rows.length && Y.rigidVs327b <= 1e-12,
    apiStillSlowerThanArm: J.base.fasterThanArm.apiRigid === false && J.base.fasterThanArm.apiBeta === false,
    handoff: H.haveAll === true && ['fieldOmega', 'curlResolved', 'torqueWork', 'frameInput'].every((k) => H.missing327b.includes(k)) && H.sourcesAlso && H.transferAlso,
  };
}

/* ───────── 走らせる ───────── */
export async function main() {
  const TARGET = process.env.W328A_TARGET || 'beta/index.html';
  const OUT = process.env.W328A_OUT ? (path.isAbsolute(process.env.W328A_OUT) ? process.env.W328A_OUT : path.join(ROOT, process.env.W328A_OUT)) : path.join(ROOT, OUT_MAIN);
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now(), text = fs.readFileSync(html, 'utf8'), targetSha256 = crypto.createHash('sha256').update(text).digest('hex');
  const W281A_SCOPE = REGEN_SCOPE ? w281aScopeStamp(html, REGEN_SCOPE) : {};
  const { HP } = loadHtmlMain(html);
  console.log('第328便a fieldcontract(版 ' + HARNESS_VERSION + ')');
  const R = runAll(HP);
  const out = { version: HARNESS_VERSION, libVersion: C.LIB_VERSION, contractVersion: C.CONTRACT_VERSION, transferVersion: C.TRANSFER_VERSION, generator: 'tests/exp-w328a-fieldcontract.mjs', target: TARGET, targetSha256, reuseFrom: null,
    ruling: '原仮定者の回答(2026-11-05 —— AN551・AN552・AN553)「推奨で進める」(AN551 = A 直接の滑りを本の宣言の型・剛体/半渦度/シア/K1 の幾何は対照・AN552 = A 定数の Ω_field・AN553 = B 枠・Ω_field・収束の印だけを場の API に足し、帳簿は第326便d の lib に残す)・統括の検証項目 R301',
    decl: C.DECL, plan: PLAN, contractKeys: C.CONTRACT_KEYS, subKeys: C.SUB_KEYS, ledgerRefs: C.LEDGER_REFS, handoffMap: HANDOFF_MAP, notClaim: NOT_CLAIM, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w328a-fieldcontract.mjs', 'tests/lib-w328a-fieldcontract.mjs', 'tests/exp-w327b-galaxis.mjs', 'tests/lib-w327b-galaxis.mjs', 'tests/lib-w321c-galfield.mjs', 'tests/lib-w320c-nbcompose.mjs',
    'tests/lib-w319b-srcradius.mjs', 'tests/lib-w319a-axisheat.mjs', 'tests/exp-w326d-axialheat.mjs', 'tests/lib-w326d-axialheat.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w279b-headless.mjs',
    'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第328便a', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, stage: 'fieldcontract', engine: 'Node(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・1 プロセス)と第321便c の場の API の純関数(本 lib の opt-in の口で包む)', notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();
