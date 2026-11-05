// 第327便b(原仮定者の回答(2026-11-05 —— AN536)「銀河の局所場の大きさは、太陽の自転と、APIの模型の、両方を検証する。「銀河の回転と逆向き」の解釈については、
//   銀河は腕を引きずって回転しているが、腕が引きずられるという事はその腕より慣性決定力場の方が早く回転しており、見た目は順回転だが場に対して逆回転になる」・
//   統括の検証項目 R296): **銀河の局所場の大きさの 2 つの経路と「場に対して逆回転」の読みの器**(段 galaxis-327b —— 正本 tests/out/galaxis-w327b.json・
//   lib tests/lib-w327b-galaxis.mjs)。**診断だけ** —— エンジン・内蔵の本・受理器・第321便c の lib の本文は変えない(呼ぶだけ)。
//
// Node だけ(経路 1 は対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、第326便d の器 tests/exp-w326d-axialheat.mjs の関数〔partI・partK・partS・solveAt
//   —— 🗺️ の写しの t = 0 の読み口〕をそのまま呼ぶ。経路 2 は第321便c の場の API〔tests/lib-w321c-galfield.mjs の sample・splitState・diskCellsAt〕を呼ぶ)。1 プロセス(子プロセスなし)。
//   入力は html だけ(他の正本は読まない)。
//
// ■ 何をするか
//   1 経路 1(太陽の自転): 族 E の太陽の式の A(K1 の 2 列 —— 今の R_src = R_d と R_src = J)・太陽だけの系の A・口が 1 つの和の式 s/(ĝ·â)・源の反作用の寄与の大きさ・p に依らないこと
//   2 経路 2(場の API の模型): 太陽の位置(R_0・面上 —— 主)の u・∇u・半渦度・u_φ/R・シア・β と照合の別経路の差/面からの高さ ±0.02 kpc の感度/中心と残余の分割(R_cut 4 kpc)
//   G 収束の注意: 点のセルの和(格子 48・96・192・384 —— 軟化 0)の候補ごとの値と符号の列(u が近いことを curl の収束とみなさない)
//   T 二つの経路の表(伝達の候補ごと —— 経路 1 の A と経路 2 の ν_G·ĝ を別の列・要る倍率・abs の比・太陽の軸への射影・場の全体をその倍率にしたときの u_φ/c)
//   R AN536 の読み: 相対の角速度の符号の表(見た目と場に対して)・今の API の模型の場の角速度の読みと腕のパターンの角速度の文献の範囲・A を生むのに要る相対の角速度(候補ごと)
//   H geoPN=4 の場の API への引き継ぎの形(今の sample の出力の成分の有無と本便の伝達・帳簿が要る成分)
//   P 純関数の場面(lib の pureScenes —— QA lint.galaxis327b と同じ)
// ■ 言わないこと: 銀河場の同定と数えない・腕より速い場は観測の量ではない(Ω_field は仮定)・A は「太陽の口が銀河だけという接続の帰結」・半渦度を今の軸引きずりと
//   同じ量と書かない・二つの経路を平均しない・場の軸を反転しない・回転曲線の予言ではない。
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
import * as L from './lib-w327b-galaxis.mjs';
// 第281便a の領域 hash の宣言(器と lib から deriveScope で引いた下限 —— 器が引く本は 🗺️ 1 本〔第326便d の器の copyBook が .find で引く〕。presets の他の 11 本と roots の短い名〔$・T・ab・ch・ctx・cw・pnSource〕と
//   inertialDragGalaxyAxialState は import した lib〔第321便c の場の API が読む第319便b の lib とその import〕・第326便d の器の綴りが数えられた分 —— この器の局所の変数には使わない)
const REGEN_SCOPE = {"presets":["jupiterGalilean","jupiterSunInertial3d","marsSunInertial3d","mercury","mercurySunInertial3d","neptuneSunInertial3d","saturn","saturnRingReal","saturnSunInertial3d","solarSystem16Inertial3d","uranusSunInertial3d","venusSunInertial3d"],"roots":["$","HP.REL_DRAG_INVSQ_SRC_MOMENT_VERSION","HP.REL_DRAG_INVSQ_VERSION","HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.inertialDragIsqState","HP.sim","HP.validatePreset","T","ab","ch","ctx","cw","inertialDragGalaxyAxialState","pnSource"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w327b-galaxis-1';
export const OUT_MAIN = 'tests/out/galaxis-w327b.json';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
/** 光速 [m/s](SI —— 場の全体を要る倍率にしたときの u_φ と比べるだけ) */
export const C_SI = 299792458;
export const NOT_CLAIM = Object.freeze(['銀河場の同定と数えない(二つの経路を別の列に並べ、倍率と条件を記録する)', '腕より速い場は観測の量ではない(Ω_field > Ω_arm は AN536 の仮定)',
  'A は太陽の口が銀河だけという接続の帰結(同定の値ではない)', '半渦度を今の軸引きずりと同じ量と書かない(伝達の候補の 1 つ)', '二つの経路を平均しない',
  '場の軸を反転しない(逆向きは場に対する相対の角速度の符号)', '点のセルの和の半渦度は格子で符号が交互(u が近いことを curl の収束とみなさない)', '回転曲線の予言ではない(流れは宣言の入力)']);

/* ───────── 1 経路 1(太陽の自転)───────── */
export function partPath1(HP) {
  const I = X6.partI(HP), sun = I.bodies.sun, out = { variants: {} };
  const A1 = L.onePortA({ s: sun.s, a: sun.a, g: I.g });
  for (const v of L.DECL.k1Variants) {
    const K = X6.partK(HP, I, v);
    if (!K.ok) { out.variants[v] = { ok: false, err: K.err }; continue; }
    const S = X6.partS(I, K), alone = X6.solveAt(I, K, ['sun'], 0), sr = X6.solveAt(I, K, L6.DECL.solveBodies, 0).ev.rows.find((q) => q.key === 'sun');
    out.variants[v] = { ok: true, AE: S.sunExact.A, AAlone: alone.A, AOnePort: A1, reaction: sr.reaction, reactionScale: sr.alongScale, reactionRel: S.sunExact.reactionRel, AEVsOnePortRel: L.relD(S.sunExact.A, A1),
      AAloneVsOnePortRel: L.relD(alone.A, A1), AIndependentOfP: S.AIndependentOfP, alongRel: S.sunExact.alongRel };
  }
  return { s: sun.s, a: sun.a, g: I.g, gDotA: L.dot(I.g, sun.a), angleDeg: L6.angDeg(I.g, sun.a), sAlongG: sun.s * L.dot(I.g, sun.a),
    OmRefSI: I.OmRefSI, A: out.variants.now.AE, AOverOmRef: out.variants.now.AE / I.OmRefSI, ...out };
}

/* ───────── 2 経路 2(場の API の模型)───────── */
const fieldOf = (o, posKpc) => ({ posKpc, u: o.u, G: o.gradU });
const candRow = (f) => Object.fromEntries(L.candidatesOf(f).map((q) => [q.key, { nu: q.nu, alongG: q.alongG, norm: q.norm }]));
export function partPath2() {
  const R0 = F.FLOW.R0kpc, pos = [R0, 0, 0];
  const main = F.sample(pos, 0, F.fullState(), { check: true, normalization: true });
  if (!main.ok) throw new Error('経路 2: 太陽の位置が有効域の外 —— ' + main.reason);
  const rd = L.readingsOf(fieldOf(main, pos));
  const zs = L.DECL.zSensKpc.map((z) => { const p = [R0, 0, z], o = F.sample(p, 0, F.fullState(), { check: true }), r = L.readingsOf(fieldOf(o, p));
    return { zKpc: z, uPhi: r.uPhi, rigid: r.rigid, halfCurlZ: r.halfCurlZ, halfCurlR: o.halfCurlCyl.R, shear: r.shear, cand: candRow(fieldOf(o, p)), routeZ: o.error.route.halfCurlZ, routeR: o.error.route.halfCurlR,
      halfCurlTiltDeg: Math.atan2(Math.abs(o.halfCurlCyl.R), Math.abs(o.halfCurlCyl.z)) * 180 / Math.PI }; });
  const sp = F.sample(pos, 0, F.splitState(L.DECL.rCutKpc), {});
  const parts = sp.parts.map((p) => ({ key: p.key, uPhi: p.uPhi, halfCurlZ: p.halfCurlCyl.z, cand: candRow({ posKpc: pos, u: p.u, G: p.gradU }) }));
  const sumU = parts.reduce((s, p) => s + p.uPhi, 0), sumW = parts.reduce((s, p) => s + p.halfCurlZ, 0);
  return { posKpc: pos, R0Kpc: R0, model: F.MODEL_ID, fieldVersion: F.FIELD_VERSION, fieldLibVersion: F.LIB_VERSION, velocityRef: main.contract.velocityRef,
    u: main.u, gradU: main.gradU, halfCurl: main.halfCurl, uPhi: rd.uPhi, rigid: rd.rigid, dRuPhi: rd.dRuPhi, uOverRFromG: rd.uOverRFromG, halfCurlZ: rd.halfCurlZ, shear: rd.shear,
    halfCurlZApi: main.halfCurlCyl.z, halfCurlVsApiRel: L.relD(rd.halfCurlZ, main.halfCurlCyl.z), uOverRVsGRel: L.relD(rd.rigid, rd.uOverRFromG),
    beta: main.normalization.beta, corrShare: main.normalization.corrShare, routeZ: main.error.route.halfCurlZ, routeR: main.error.route.halfCurlR, quadU: main.error.quadAbs.u, edgeShare: main.error.edgeShare,
    divU: main.divU, dUdt: main.dUdt, stationary: main.timeDerivativeComplete, uOffPhiRel: Math.hypot(main.u[0], main.u[2]) / L.norm(main.u),
    cand: candRow(fieldOf(main, pos)), zSens: zs, split: { rCutKpc: L.DECL.rCutKpc, parts, sumUVsFullRel: L.relD(sumU, rd.uPhi), sumWVsFullRel: L.relD(sumW, main.halfCurlCyl.z) }, main };
}

/* ───────── G 収束の注意(点のセルの和)───────── */
export function partGrid(P2) {
  const pos = P2.posKpc, grids = L.DECL.cellNr.map((nr) => L9.GRIDS.find((q) => q.nr === nr) || { nr, np: 2 * nr, nz: 48 });
  const rows = grids.map((g) => {
    let u = [0, 0, 0]; const G = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    for (const D of F.MW.disks) { const r = F.diskCellsAt(D, g, pos, {}); u = L.add(u, r.u); for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) G[i][j] += r.G[i][j]; }
    const f = { posKpc: pos, u, G }, rd = L.readingsOf(f), c = candRow(f);
    return { nr: g.nr, np: g.np, nz: g.nz, uPhi: rd.uPhi, uRel: (rd.uPhi - P2.uPhi) / Math.abs(P2.uPhi), cand: Object.fromEntries(Object.entries(c).map(([k, q]) => [k, { alongG: q.alongG, rel: (q.alongG - P2.cand[k].alongG) / Math.abs(P2.cand[k].alongG) }])) };
  });
  const signs = Object.fromEntries(L.DECL.candidates.map((k) => [k, L.gridSigns(rows.map((q) => q.cand[k].alongG))]));
  return { rows, signs, uLastRel: rows[rows.length - 1].uRel, ringSign: Object.fromEntries(L.DECL.candidates.map((k) => [k, L.sgn(P2.cand[k].alongG)])) };
}

/* ───────── T 二つの経路の表 ───────── */
export function partTable(P1, P2, Gd) {
  const GF = L9.galFrame(), aSun = P1.a, frameAngDeg = L6.angDeg(GF.zh, P1.g), onSun = (nu) => L.dot(GF.toEcl(nu), aSun);
  const base = L.twoPathRows({ A: P1.A, rows: L.DECL.candidates.map((k) => ({ key: k, alongG: P2.cand[k].alongG })) });
  const rows = base.map((q) => {
    const c = P2.cand[q.key], along = onSun(c.nu);
    return Object.assign(q, { norm: c.norm, alongSunAxis: along, sunAxisSignAgree: L.sgn(along) === L.sgn(P1.s), AJ: P1.variants.J.AE,
      center: P2.split.parts.find((p) => p.key === 'center').cand[q.key].alongG, residual: P2.split.parts.find((p) => p.key === 'residual').cand[q.key].alongG,
      zMinus: P2.zSens[0].cand[q.key].alongG, zPlus: P2.zSens[1].cand[q.key].alongG, zMinusSunAxis: onSun(P2.zSens[0].cand[q.key].nu), zPlusSunAxis: onSun(P2.zSens[1].cand[q.key].nu), gridSigns: Gd.signs[q.key].signs, gridAlternates: Gd.signs[q.key].alternates, gridSameSign: Gd.signs[q.key].sameSign,
      scaledUPhiOverC: q.needFactor !== null ? Math.abs(q.needFactor) * Math.abs(P2.uPhi) / C_SI : null });
  });
  return { rows, frameAngDeg, conditions: ['宣言の模型 ' + P2.model + '(円盤 4 + 静止のバルジ・V(R) = V0 tanh(R/R_t))・定常', '太陽の位置 R_0 = ' + P2.R0Kpc + ' kpc・面上(高さの感度は ±0.02 kpc の列)',
    '弱い場の一次の分子 u(Z = 1 + β で割らない —— 補正の割合は corrShare)', '速度の基準は源の流れの銀河中心系(受け手の動きの項を数えない)', '経路 1 は第326便d の接続(太陽の口は銀河だけ)・族 E・K1 は今のまま',
    '伝達の候補は宣言(T_G の利得 1 —— 候補の量をそのまま ν_G に)'] };
}

/* ───────── R AN536 の読み ───────── */
export function partRel(P1, P2, T) {
  const R0m = P2.R0Kpc * L.KPC_M, OmMat = L9.vFlow(P2.R0Kpc) / R0m, Op = L.DECL.OmegaPatternKmsKpc.map((x) => x * L.KMS_PER_KPC);
  const OmBeta = P2.uPhi / (P2.beta * R0m);
  const rows = [
    { key: 'arm', ja: '腕のパターン(文献の範囲の中央)', axis: 'ĝ', w: 0.5 * (Op[0] + Op[1]), c: 1, arm: true },
    { key: 'matter', ja: '物質の公転 V(R_0)/R_0(宣言の模型の流れ)', axis: 'ĝ', w: OmMat, c: 1 },
    { key: 'apiRigid', ja: '今の API の場の剛体の読み u_φ/R', axis: 'ĝ', w: P2.rigid, c: 1 },
    { key: 'apiBeta', ja: '今の API の β で割った読み u_φ/(βR)(重みの平均の源の速さ)', axis: 'ĝ', w: OmBeta, c: 1 },
    { key: 'apiHalfCurl', ja: '今の API の半渦度 (½∇×u)·ĝ', axis: 'ĝ', w: P2.halfCurlZ, c: 1 },
    { key: 'sunG', ja: '太陽の自転の ĝ への射影 s(ĝ·â)', axis: 'ĝ', w: P1.sAlongG, c: 1 },
    { key: 'sunOwn', ja: '太陽の自転(自分の軸 â)', axis: 'â_☉', w: P1.s, c: P1.gDotA },
  ];
  const table = L.signTable({ OmegaPattern: Op, rows });
  const fasterThanArm = { apiRigid: P2.rigid > Op[1], apiBeta: OmBeta > Op[1], apiRigidOverOpLo: P2.rigid / Op[0], apiBetaOverOpLo: OmBeta / Op[0], matterInRange: OmMat >= Op[0] && OmMat <= Op[1] };
  // 要る相対の角速度(候補ごと —— 利得は同じ形の仮定: g_T = (ν_T·ĝ)/Ω_mat。直接の行は第326便d の銀河の口と同じ利得 1)
  const req = [{ key: 'direct', ja: '直接(ν_G = Ω_rel ĝ —— 利得 1)', gain: 1 }].concat(L.DECL.candidates.map((k) => ({ key: k, ja: k, gain: P2.cand[k].alongG / OmMat })))
    .map((q) => { const r = L.requiredRel({ A: P1.A, gain: q.gain });
      return { key: q.key, gain: q.gain, OmRelReq: r.OmRelReq, consistent: r.consistent, overOmMat: r.OmRelReq / OmMat, slip: r.OmRelReq === null ? null : -r.OmRelReq,
        fieldRange: r.consistent ? [Op[0] - r.OmRelReq, Op[1] - r.OmRelReq] : null, fieldPeriodS: r.consistent ? 2 * Math.PI / (-r.OmRelReq) : null }; });
  return { OmMat, OmegaPattern: Op, OmBeta, table, fasterThanArm, required: req, premise: 'Ω_field > Ω_arm > 0(腕は場に引きずられる —— AN536 の仮定)・場の軸は ĝ のまま(反転しない)',
    gainAssumption: L.DECL.gainUnit + ' を単位に、場に対する源の流れが見た目の流れと同じ形(Ω_rel/Ω_mat 倍)と置く —— 剛体の差の場(Ω_frame ĝ × x′ を引いた流れ)は今の API に無い' };
}

/* ───────── H 引き継ぎの形 ───────── */
export function partHand(P2) {
  const rows = L.handoffOf(P2.main);
  return { rows, missing: rows.filter((q) => !q.have).map((q) => q.key), have: rows.filter((q) => q.have).map((q) => q.key) };
}

/* ───────── 全部と門 ───────── */
export function runAll(HP) {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const P1 = partPath1(HP); mark('path1');
  const P2 = partPath2(); mark('path2');
  const Gd = partGrid(P2); mark('grid');
  const T = partTable(P1, P2, Gd), R = partRel(P1, P2, T), H = partHand(P2); mark('TRH');
  const PS = L.pureScenes(), PG = L.pureGates(PS);
  const { main, ...P2rec } = P2;
  const J = { path1: P1, path2: P2rec, grid: Gd, table: T, rel: R, handoff: H, pure: { scenes: PS, gates: PG }, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}
export function gatesOf(J) {
  const P1 = J.path1, P2 = J.path2, Gd = J.grid, T = J.table, R = J.rel, H = J.handoff;
  const vs = Object.values(P1.variants);
  return {
    pure: Object.values(J.pure.gates).every(Boolean),
    path1OnePort: vs.every((v) => v.ok && v.AE < 0 && v.AEVsOnePortRel <= 1e-12 && v.AAloneVsOnePortRel <= 1e-15 && v.AIndependentOfP && v.alongRel <= 1e-12),
    path2Api: Math.abs(P2.routeZ) <= 1e-6 * Math.abs(P2.halfCurlZ) && P2.halfCurlVsApiRel <= 1e-12 && P2.uOverRVsGRel <= 1e-12 && P2.uOffPhiRel <= 1e-12 && P2.corrShare < 1e-3 && P2.stationary === true,
    splitSums: P2.split.sumUVsFullRel <= 1e-12 && P2.split.sumWVsFullRel <= 1e-10,
    frameSame: T.frameAngDeg <= 1e-9,   // 第319便b の galFrame の ĝ と第326便d の器の ĝ(どちらも第319便a の galaxyAxis)
    twoPathColumns: T.rows.length === L.DECL.candidates.length && T.rows.every((q) => Number.isFinite(q.path1A) && Number.isFinite(q.path2AlongG) && !Object.keys(q).some((k) => /mean|avg|average|blend|combined/i.test(k))),
    scaleGap: T.rows.every((q) => q.absRatio > 1e12 && q.scaledUPhiOverC > 1),
    curlCaution: Gd.signs.halfCurl.alternates === true && Gd.signs.rigid.sameSign === true && Math.abs(Gd.uLastRel) < 1e-3,
    signTable: R.table.find((q) => q.key === 'arm').apparentSign === 1 && R.table.find((q) => q.key === 'arm').relSign === -1 && R.table.find((q) => q.key === 'sunOwn').relSign === 1,
    fieldAxisNotFlipped: R.required.filter((q) => q.consistent).every((q) => q.fieldRange[0] > R.OmegaPattern[1]),
    apiNotFasterThanArm: R.fasterThanArm.apiRigid === false && R.fasterThanArm.apiBeta === false,
    handoff: H.rows.length === L.HANDOFF.length && ['frameInput', 'fieldOmega', 'torqueWork', 'curlResolved'].every((k) => H.missing.includes(k)) && ['u', 'gradU', 'dUdt', 'sourceId'].every((k) => H.have.includes(k)),
  };
}

/* ───────── 走らせる ───────── */
export async function main() {
  const TARGET = process.env.W327B_TARGET || 'beta/index.html';
  const OUT = process.env.W327B_OUT ? (path.isAbsolute(process.env.W327B_OUT) ? process.env.W327B_OUT : path.join(ROOT, process.env.W327B_OUT)) : path.join(ROOT, OUT_MAIN);
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now(), text = fs.readFileSync(html, 'utf8'), targetSha256 = crypto.createHash('sha256').update(text).digest('hex');
  const W281A_SCOPE = REGEN_SCOPE ? w281aScopeStamp(html, REGEN_SCOPE) : {};
  const { HP } = loadHtmlMain(html);
  console.log('第327便b galaxis(版 ' + HARNESS_VERSION + ')');
  const R = runAll(HP);
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w327b-galaxis.mjs', target: TARGET, targetSha256, reuseFrom: null,
    ruling: '原仮定者の回答(2026-11-05 —— AN536)「銀河の局所場の大きさは、太陽の自転と、APIの模型の、両方を検証する。「銀河の回転と逆向き」の解釈については、銀河は腕を引きずって回転しているが、腕が引きずられるという事はその腕より慣性決定力場の方が早く回転しており、見た目は順回転だが場に対して逆回転になる」・統括の検証項目 R296',
    decl: L.DECL, handoffDecl: L.HANDOFF.map((h) => ({ key: h.key, ja: h.ja, path: h.path, need: h.need })), notClaim: NOT_CLAIM, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w327b-galaxis.mjs', 'tests/lib-w327b-galaxis.mjs', 'tests/lib-w321c-galfield.mjs', 'tests/lib-w320c-nbcompose.mjs', 'tests/lib-w319b-srcradius.mjs', 'tests/lib-w319a-axisheat.mjs',
    'tests/exp-w326d-axialheat.mjs', 'tests/lib-w326d-axialheat.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第327便b', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, stage: 'galaxis', engine: 'Node(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・1 プロセス)と第321便c の場の API の純関数', notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();
