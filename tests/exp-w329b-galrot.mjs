// 第329便b(原仮定者の方針(2026-11-07)「既存の銀河の回転の理論を利用して DFM を融合する」「ダークマターハローを完全に説明するつもりは無い。ただし影響はあるので寄与の度合いを調査する」・
//   原仮定者の回答(2026-11-07 —— AN568 = A・AN569 = A・AN570 = A の限定 + B の限定・AN572 = A)・統括の検証項目 R305): **銀河の既存の回転の理論のラベルと場の契約の版 2 と DFM の寄与の度合いの器**
//   (段 galrot-329b —— 正本 tests/out/galrot-w329b.json・lib tests/lib-w329b-galrot.mjs と tests/lib-w329b-fieldcontract2.mjs)。**診断だけ** —— エンジン・内蔵の本(🌃🛞 の JSON を含む)・
//   受理器・第321便c・第327便b・第328便a の lib の本文は変えない(呼ぶだけ)。
//
// Node だけ(html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、🌃 ngc3198・🛞 ngc3198DFM の**診断の写し**〔器の中 —— 本の JSON は 1 bit も変えない・第269便c の型〕を
//   html のエンジン〔validatePreset・sim.build・sim.step〕のまま走らせる)。1 プロセス(子プロセスなし)。入力は html・rotmod の写しの fixture・観測の CSV・第328便a の正本(宣言の候補 Ω_field の値)。
//
// ■ 何をするか
//   L 既存理論のラベル(NGC 3198 の rotmod の写しの V_obs・e_v から A_O・B_O・Ω・κ_epi・Ω ∓ κ_epi/2 —— 微分の型 2 つ・誤差の伝播)と恒等式・物質線の反例(lib の純関数)
//   C 場の契約の版 2(AN568): 古い呼び出しのビット同一・版 1 の形への写し・恒等の枠のビット同一・軸と原点の取り換え・回す枠(引いた分 u_Ω と単純な差の比)・積分の道具の照合・
//     同じ点の相対の速さ・天の川の太陽の近傍の契約(Ω_frame・Ω_mat・Ω_field・Ω_p を別の欄 —— Ω_arm は受け手の側)・ランク 1(AN570)
//   P ラベルの口(AN570 の B の限定): 🌃 の宣言は無い(null)・診断の宣言の平坦の恒等式と表のラベルの差(σ の単位 —— p 値を出さない)
//   B NGC 3198 の基準列(rotmod の写し —— fixture の sha256 と生の文の照合・CSV の v_rot 43 行との照合・v_bar²・足りない分・Υ と距離の感度)
//   D DFM の OFF/ON(同じ初期状態・同じ枠・低 N —— 同じ状態を注入した写しの 2 歩目の速さの差 = DFM の加速度。内向き a_in と接線 a_t を分ける・h/h2/h4 で同じ物理時刻)・
//     観測の速さで評価する列・時間発展の後の差(定常の解ではない)・kF の線形・N の感度
//   E η(R) = Δv²_DFM/(v_obs² − v_bar²)(分母が有意に正の箱だけ・丸めない)と M_eq = R Δv²/G(等価の質量)と感度
//   M 天の川の太陽の近傍の桁の比(宣言の候補 Ω_field と物質の回転・Ω_p —— 同一視しない記録)
// ■ 言わないこと: ハローの置き換えを主張しない・寄与の数は宣言した kF = 1 と低 N の写しの同じ速度で評価した値(結論ではない)・M_eq は等価の質量・κ_epi と κ_D は別・
//   Ω − κ_epi/2 は 1/R で変わる・Ω_p は全半径のパターン速度ではない・宣言の候補 Ω_field は物質の回転ではない(v = Ω_field R で外挿しない)・p 値を出さない。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import { loadObsCsv } from './lib-w270b-obscsv.mjs';
import * as F from './lib-w321c-galfield.mjs';
import * as C1 from './lib-w328a-fieldcontract.mjs';
import * as L6 from './lib-w326d-axialheat.mjs';
import * as G7 from './lib-w327b-galaxis.mjs';
import * as GR from './lib-w329b-galrot.mjs';
import * as C2 from './lib-w329b-fieldcontract2.mjs';
// 第281便a の領域 hash の宣言(版 8 —— 器と lib と import の閉包から deriveScope で引いた下限そのもの。器が引く本は 🌃 ngc3198・🛞 ngc3198DFM の 2 本〔診断の写しの元 —— .find で引く〕。
//   presets の他の 11 本と roots の短い名〔$・T・ab・ch・ctx・cw・pnSource〕・HP.coord3d・HP.dfmMeshVelocityFieldAt・HP.inertialDragIsqState・inertialDragGalaxyAxialState は import した lib
//   〔第321便c の場の API が読む第319便b の lib とその import〕の綴りが数えられた分 —— この器と lib の局所の変数には使わない。ワンタップ対照 A/B は走らせない〔abBody:false〕・説明文の欄 familyRole は読まない)
const REGEN_SCOPE = {"presets":["jupiterGalilean","jupiterSunInertial3d","marsSunInertial3d","mercury","mercurySunInertial3d","neptuneSunInertial3d","ngc3198","ngc3198DFM","saturn","saturnRingReal","saturnSunInertial3d","uranusSunInertial3d","venusSunInertial3d"],"roots":["$","HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.inertialDragIsqState","HP.sim","HP.validatePreset","T","ab","ch","ctx","cw","inertialDragGalaxyAxialState","pnSource"],"core":true,"consts":[],"complete":true,"abBody":false};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w329b-galrot-1';
export const OUT_MAIN = 'tests/out/galrot-w329b.json';
export const FIXTURE = 'tests/fixtures/ngc3198-rotmod-w329b.json';
export const CSV_REL = 'paper/data/cluster-galaxy-observations.csv';
export const FC328 = 'tests/out/fieldcontract-w328a.json';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze(['ハローの置き換えは主張しない(ハローの受け持ちを DFM へ移さない —— 寄与の度合いの診断だけ)', '寄与の数は宣言した kF = 1・geoPN = 0 の E6′ の輸送・低 N の写しの同じ速度で評価した値(結論ではない・定常の解ではない)',
  'M_eq は球の対称の力に換算した等価の質量(円盤の中の実質量の同定ではない)', 'κ_epi(周転円の振動数)と κ_D は別の量', 'Ω − κ_epi/2 は平坦な回転で 1/R に依る(半径によらない量ではない)',
  'Ω_p = Ω − κ_epi/2 は m = 2 の内側 Lindblad 共鳴の条件の値(全半径の同じパターン速度ではない)', '宣言の候補 Ω_field は物質の回転ではない(v = Ω_field R で外挿しない —— 同一視しない)',
  '枠の取り換えは新しい力ではない(引いた速さを引きずりへ足し戻さない)', '場の API の半渦度を Ω_field に写さない', 'p 値を出さない(e_v は独立の正規の全誤差ではない)']);
/** 器の宣言(走行の前に置く —— 結果を見て変えない) */
export const PLAN = Object.freeze({
  books: Object.freeze({ main: 'ngc3198', noHalo: 'ngc3198DFM' }),
  kFOn: 1, kFOff: 0, kFHalf: 0.5,
  /** kF の線形の門(同じ状態の 2 歩目の蹴りは kF 倍 —— 同じ歩の中で蹴りの後に位置が動く 2 次の分だけ外れる) */
  kFLinTolRel: 1e-3,
  /** 箱の端 [kpc](左閉じ右開き —— rotmod の 43 点の 0.32〜44.08 kpc を覆う) */
  edgesKpc: Object.freeze([0, 2, 4, 6, 9, 13, 18, 24, 32, 45]),
  /** 探り(同じ状態を注入した写しの 2 歩目)の時刻 t* と刻み(h・h/2・h/4 —— 同じ物理時刻)。🛞 は核の内部の状態を注入しないので t* = 0.032 だけ */
  probeT: Object.freeze([0.032, 10]), probeTNoHalo: Object.freeze([0.032]), hs: Object.freeze([0.016, 0.008, 0.004]),
  /** 時間発展の後の差(🌃 の OFF/ON —— 定常の解ではない)の窓と刻み */
  evolveT: Object.freeze([10, 40]), evolveHs: Object.freeze([0.016, 0.008]),
  /** N の感度(粒の数 ×2・1 粒の質量 ÷2 —— 総質量は同じ) */
  nMul: 2,
  /** 刻みの収束の門(読める箱の Δv² の h/2 と h/4 の相対の差) */
  convTolRel: 0.05,
  /** 距離の感度(SPARC の 13.8 ± 1.4 Mpc —— CSV の distance 行) */
  distanceMpc: 13.8, distanceSensMpc: Object.freeze([12.4, 15.2]),
  /** 天の川の太陽の近傍のオールトの量の宣言の値(出典つき —— 文献の値・本便は一次資料に当たっていない) */
  mwOort: Object.freeze({ mode: 'oort', A_O: 15.3, B_O: -11.9, sigmaA: 0.4, sigmaB: 0.4, source: 'Bovy 2017 MNRAS 468 L63(Gaia DR1 の Oort の量 —— 文献の値・本便は一次資料に当たっていない)' }),
  /** ラベルの口の診断の宣言(🌃 の本には置かない —— 器の中だけ): 平坦の恒等式の V_flat は CSV の v_flat 行・半径は外側の平坦な部分の代表 */
  portDiagRKpc: 20,
  /** 回す枠の場面(場の API —— 銀河中心系の太陽の位置): 軸と原点の取り換え(R_z 0.6 rad・R_x 0.25 rad・原点 (1, −0.5, 0.1) kpc)・Ω_frame = Ω_mat の回す枠・太陽を原点に共に回す枠 */
  axesFrame: Object.freeze({ a: 0.6, b: 0.25, originKpc: Object.freeze([1, -0.5, 0.1]) }),
  /** ランク 1 の 3 行の係数 c_i(同じ局所の腕の角速度を受ける天体の宣言の倍率 —— 例の値) */
  rankCs: Object.freeze([1, 0.37, 2.9]),
  /** 同じ点の相対の速さの場面(太陽を原点に共に回す枠の原点から離れた点 [kpc] と例の受け手の速さ [m/s] —— 例の値) */
  relVelPointKpc: Object.freeze([8.2, 1.0, 0.05]), relVelReceiver: Object.freeze([1e4, 2.42e5, 7e3]),
});

const relD = (a, b) => (a === b ? 0 : Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b)));
const js = (x) => JSON.stringify(x);
const POS = () => [F.FLOW.R0kpc, 0, 0];

/* ───────── 入力 ───────── */
export function readFixture(root = ROOT) {
  const J = JSON.parse(fs.readFileSync(path.join(root, FIXTURE), 'utf8'));
  const sha = crypto.createHash('sha256').update(Buffer.from(J.rawText, 'utf8')).digest('hex');
  const parsed = J.rawText.split('\n').filter((l) => l.trim() && !l.startsWith('#')).map((l) => { const c = l.trim().split(/\s+/).map(Number); return { R: c[0], Vobs: c[1], errV: c[2], Vgas: c[3], Vdisk: c[4], Vbul: c[5], SBdisk: c[6], SBbul: c[7] }; });
  return { J, rows: J.rows, check: { shaSame: sha === J.provenance.sha256, parsedSame: js(parsed) === js(J.rows), n: J.rows.length, thirdParty: J.thirdPartyCopy === true, url: J.provenance.url, distanceMpc: J.conventions.distanceMpc } };
}
export function readCsv(root = ROOT) {
  const C = loadObsCsv(path.join(root, CSV_REL)), rows = C.rows.filter((r) => r.body === 'NGC 3198');
  const vrot = rows.filter((r) => /^v_rot\(r=[0-9.]+ kpc\)$/.test(r.quantity)).map((r) => ({ R: Number(/r=([0-9.]+)/.exec(r.quantity)[1]), v: Number(r.value) / 1000, url: r.url })).sort((a, b) => a.R - b.R);
  const one = (q) => { const r = rows.find((x) => x.quantity === q); return r ? Number(r.value) : null; };
  return { vrot, vflatKms: one('v_flat') / 1000, distanceM: one('distance'), inclinationDeg: one('inclination') };
}

/* ───────── L ラベル ───────── */
export function partLabels(FX) {
  const rows = FX.rows.map((r) => ({ R: r.R, v: r.Vobs, sigma: r.errV }));
  const T = Object.fromEntries(GR.DECL.derivTypes.map((k) => [k, GR.labelsTable(rows, k)]));
  const S = GR.pureScenes();
  const ok = (k) => T[k].filter((q) => q.labels !== null);
  // 外側の平坦な部分(R ≥ 14 kpc)の A_O + B_O(σ の単位)と Ω − κ_epi/2 の R 倍の幅(1/R で変わることの記録)
  const outer = (k) => ok(k).filter((q) => q.R >= 14 && q.labels.kappaEpi !== null);
  const flatRead = Object.fromEntries(GR.DECL.derivTypes.map((k) => { const o = outer(k);
    return [k, { n: o.length, sumAB_over_sigma: o.map((q) => (q.labels.A_O + q.labels.B_O) / Math.hypot(q.labels.sigma.A_O, q.labels.sigma.B_O)),
      omMinusTimesR: o.map((q) => q.labels.OmMinusHalfK * q.R), omMinus: o.map((q) => q.labels.OmMinusHalfK), kappaOverOm: o.map((q) => q.labels.kappaEpi / q.labels.Omega) }]; }));
  return { tables: T, nullCount: Object.fromEntries(GR.DECL.derivTypes.map((k) => [k, T[k].filter((q) => q.labels === null).length])),
    negK2: Object.fromEntries(GR.DECL.derivTypes.map((k) => [k, ok(k).filter((q) => q.labels.kappaEpi === null).length])), flatRead, scenes: S, gates: GR.pureGates(S) };
}

/* ───────── C 場の契約の版 2 ───────── */
export function partContract(FC) {
  const pos = POS(), st = F.fullState(), t0 = Date.now(), base = F.sample(pos, 0, st, {});
  const old = [[pos, st, {}], [pos, F.splitState(4), {}], [[50, 0, 0], st, {}]].map(([p, s, o]) => js(C2.sampleWithContract2(p, 0, s, o)) === js(F.sample(p, 0, s, o)));
  const old328 = js(C2.sampleWithContract2(pos, 0, st, { contract: FC.contract.decl })) === js(C1.sampleWithContract(pos, 0, st, { contract: FC.contract.decl }));
  // 版 1 の形への写し(第328便a の正本の宣言 —— 正本の契約と JSON の文字列で同じ)
  const d1 = { omegaField: FC.contract.decl.omegaField, transfer: FC.contract.decl.transfer, convergence: FC.contract.decl.convergence };
  const c2id = C2.buildFieldContract2(base, d1), v = C2.toV1(c2id);
  const v1proj = { ok: v.ok, sameAs328a: js(v.contract) === js(FC.contract.main), sameAsBuilder: js(v.contract) === js(C1.buildFieldContract(base, d1)), shape: C2.contract2ShapeOk(c2id) };
  // 恒等の枠(ビット同一)・軸と原点の取り換え
  const U = C2.DECL.units, idF = { originKpc: [0, 0, 0], Q: [[1, 0, 0], [0, 1, 0], [0, 0, 1]], originVelocity: [0, 0, 0], omegaFrame: 0, lengthUnit: U.length, velocityUnit: U.velocity, timeUnit: U.time };
  const sI = C2.sampleInFrame(pos, 0, st, { frame: idF });
  const identity = { u: js(sI.u) === js(base.u), gradU: js(sI.gradU) === js(base.gradU), halfCurl: js(sI.halfCurl) === js(base.halfCurl), base: js(sI.base) === js(base) };
  const A = PLAN.axesFrame, Q = C2.rotZX(A.a, A.b), frA = Object.assign({}, idF, { Q, originKpc: A.originKpc.slice() }), xp = C2.mulQT(Q, pos.map((x, i) => x - A.originKpc[i]));
  const sA = C2.sampleInFrame(xp, 0, st, { frame: frA }), qu = C2.mulQT(Q, base.u), qh = C2.mulQT(Q, base.halfCurl), nr = (a) => Math.hypot(...a), dif = (a, b) => nr(a.map((x, i) => x - b[i])) / nr(b);
  const axes = { uRel: dif(sA.u, qu), normRel: Math.abs(nr(sA.u) - nr(base.u)) / nr(base.u), halfCurlRel: dif(sA.halfCurl, qh), xGCRel: dif(sA.xGC, pos) };
  // 回す枠(Ω_frame = Ω_mat の流れ —— 銀河中心の回り)と太陽を原点に共に回す枠(原点の速さ V0 ŷ)
  const OmMat = F.FLOW.V0 / (F.FLOW.R0kpc * GR.KPC_M);
  const frR = Object.assign({}, idF, { omegaFrame: OmMat }), sR = C2.sampleInFrame(pos, 0, st, { frame: frR });
  const frR2 = Object.assign({}, idF, { omegaFrame: 2 * OmMat }), sR2 = C2.sampleInFrame(pos, 0, st, { frame: frR2 });
  const frS = Object.assign({}, idF, { originKpc: pos.slice(), originVelocity: [0, F.FLOW.V0, 0], omegaFrame: OmMat }), sS = C2.sampleInFrame([0, 0, 0], 0, st, { frame: frS });
  const rotating = { OmegaFrame: OmMat, u: base.u, uFrame: sR.u, uOmega: sR.shift.uOmega, W_R: sR.shift.W_R, beta: sR.shift.beta, naive: sR.shift.naiveRigid, naiveRatio: sR.shift.naiveRatio,
    linear: sR2.shift.uOmega[1] / sR.shift.uOmega[1], gradNull: sR.gradU === null && sR.halfCurl === null, why: sR.why,
    solarFrame: { u: sS.u, betaVo: sS.shift.betaVo, uOmega: sS.shift.uOmega, xGCRel: dif(sS.xGC, pos) } };
  const tool = { z0: C2.toolCheck(F.FLOW.R0kpc, 0), z03: C2.toolCheck(F.FLOW.R0kpc, 0.3) };
  // 同じ点の相対の速さ(太陽を原点に共に回す枠 —— 原点から離れた点で受け手〔例の速さ〕と源の流れ V(R) φ̂ を同じ取り換え): Qᵀ で回るだけ・受け手だけに Ω_frame ĝ′ × x′ を足し戻すと合わない(否定対照)
  const c2S = C2.buildFieldContract2(base, { frame: frS }), pR = PLAN.relVelPointKpc.slice(), RR = Math.hypot(pR[0], pR[1]), vsrc = F.FLOW.V0 * Math.tanh(RR / F.FLOW.RtKpc);
  const vR = PLAN.relVelReceiver.slice(), vS = [-vsrc * pR[1] / RR, vsrc * pR[0] / RR, 0];
  const a = C2.toFrame(c2S.frame, pR, vR), b = C2.toFrame(c2S.frame, pR, vS), w = vR.map((x, i) => x - vS[i]), wp = a.v.map((x, i) => x - b.v[i]);
  const back = C2.fromFrame(c2S.frame, a.x, a.v), add2 = [-a.x[1], a.x[0], 0].map((x) => x * c2S.frame.omegaFrame * GR.KPC_M), wd = a.v.map((x, i) => x + add2[i] - b.v[i]);
  const relVel = { pointKpc: pR, w, wFrame: wp, rel: dif(wp, w), xFrame: a.x, roundTrip: dif(back.v, vR), doubledRel: dif(wd, w) };
  // 天の川の太陽の近傍の契約(太陽を原点に共に回す枠・宣言の候補 Ω_field・g_T = 1・Ω_mat・オールトのラベル)
  const dMW = { frame: frS, omegaField: FC.contract.decl.omegaField, transfer: FC.contract.decl.transfer, convergence: FC.contract.decl.convergence,
    omegaMat: { value: OmMat, at: { R_kpc: F.FLOW.R0kpc }, source: '場の API の宣言の模型 ' + F.MODEL_ID + ' の流れ V(R0)/R0' }, labels: { mode: 'oort', A_O: PLAN.mwOort.A_O, B_O: PLAN.mwOort.B_O, RKpc: F.FLOW.R0kpc, source: PLAN.mwOort.source } };
  const cMW = C2.buildFieldContract2(base, dMW), slip = C2.directSlipOf2(cMW, FC.direct.OmegaArm), inF = C2.ratesInFrame(cMW.rates, FC.direct.OmegaArm);
  const mw = { contract: cMW, shape: C2.contract2ShapeOk(cMW), toV1: C2.toV1(cMW).ok, slipNu: slip.nuAlong, slipVs328a: relD(slip.nuAlong, FC.direct.nuAlong), slipInFrame: cMW.transfer.gT * (inF.omegaArm - inF.omegaField),
    slipInFrameRel: relD(cMW.transfer.gT * (inF.omegaArm - inF.omegaField), slip.nuAlong), ratesInFrame: inF, armInContract: 'omegaArm' in cMW.rates || 'omegaArm' in cMW.transfer };
  const rank = GR.rankOneRows({ cs: PLAN.rankCs.slice(), gT: cMW.transfer.gT, OmegaArm: FC.direct.OmegaArm, OmegaField: cMW.omegaField.value }, L6.rankOf);
  const PS = C2.pureScenes(), PG = C2.pureGates(PS);
  return { old, old328, v1proj, identity, axes, rotating, tool, relVel, mw, rank: { rank: rank.rank, unknowns: rank.unknowns, rows: rank.rows.length, sv: rank.sv }, pure: { scenes: PS, gates: PG }, wallSec: (Date.now() - t0) / 1000 };
}

/* ───────── P ラベルの口(AN570 の B の限定)───────── */
export function partPort(HP, CSV, LB) {
  const book = HP.allPresets().find((q) => q.id === PLAN.books.main), declared = book && book.galRotLabels !== undefined ? book.galRotLabels : null;
  const P0 = GR.galaxyLabelPort(declared), R = PLAN.portDiagRKpc, P1 = GR.galaxyLabelPort({ mode: 'flatIdentity', v0: CSV.vflatKms, RKpc: R, source: CSV_REL + ' の NGC 3198 v_flat(SPARC —— 器の中の診断の宣言・本には置かない)' });
  const near = LB.tables.localQuad.filter((q) => q.labels).reduce((b, q) => (b === null || Math.abs(q.R - R) < Math.abs(b.R - R) ? q : b), null), L = near.labels;
  const dz = (k, kp = k) => (P1[kp] - L[k]) / L.sigma[k];
  return { bookDeclared: declared, bookPort: P0, diag: P1, nearRow: { R: near.R, A_O: L.A_O, B_O: L.B_O, Omega: L.Omega, kappaEpi: L.kappaEpi, OmMinusHalfK: L.OmMinusHalfK, sigma: L.sigma },
    diffInSigma: { A_O: dz('A_O'), B_O: dz('B_O'), Omega: dz('Omega'), kappaEpi: dz('kappaEpi'), OmMinusHalfK: dz('OmMinusHalfK', 'OmegaP') }, halfCurlRejected: (() => { try { GR.galaxyLabelPort({ mode: 'flatIdentity', v0: 1, RKpc: 8.2, source: '場の API の半渦度' }); return false; } catch (e) { return e instanceof RangeError; } })() };
}

/* ───────── B 基準列 ───────── */
export function partBaseline(FX, CSV) {
  const rows = FX.rows, cmp = rows.map((r) => { const c = CSV.vrot.find((q) => Math.abs(q.R - r.R) < 1e-9); return c ? Math.abs(c.v - r.Vobs) : null; });
  const per = rows.map((r) => { const d = GR.deficitOf(r, GR.DECL.upsilonDisk, GR.DECL.upsilonBul); return { R: r.R, vobs2: d.vobs2, vbar2: d.vbar2, deficit: d.deficit, sigma: d.sigma, z: d.deficit / d.sigma }; });
  const E = PLAN.edgesKpc.slice(), f0 = PLAN.distanceMpc / FX.check.distanceMpc;
  const bins = GR.binDeficit(rows, E, { Yd: GR.DECL.upsilonDisk, Yb: GR.DECL.upsilonBul, f: f0 });
  const sensU = Object.fromEntries(GR.DECL.upsilonSens.map((Y) => [String(Y), GR.binDeficit(rows, E, { Yd: Y, Yb: GR.DECL.upsilonBul, f: f0 })]));
  const sensD = Object.fromEntries(PLAN.distanceSensMpc.map((D) => [String(D), GR.binDeficit(rows, E, { Yd: GR.DECL.upsilonDisk, Yb: GR.DECL.upsilonBul, f: D / FX.check.distanceMpc })]));
  return { fixture: FX.check, csvCompared: cmp.filter((x) => x !== null).length, csvMaxAbsDiff: Math.max(...cmp.filter((x) => x !== null)), csvUrlSame: CSV.vrot.every((q) => q.url === FX.check.url),
    csvDistanceMpc: CSV.distanceM / (1e3 * GR.KPC_M), perRow: per, negDeficitRows: per.filter((q) => q.deficit < 0).map((q) => q.R), bins, sensUpsilon: sensU, sensDistance: sensD };
}

/* ───────── D DFM の OFF/ON(エンジン)───────── */
const KEYS = ['x', 'y', 'vx', 'vy', 'spin'];
function bookCopy(HP, id, kF, nMul) {
  const src = HP.allPresets().find((q) => q.id === id);
  if (!src) throw new Error('本が無い: ' + id);
  const p = JSON.parse(JSON.stringify(src));
  p.id = id + 'W329bDiag'; p.sampleClass = 'principle';
  delete p.massCalibration; delete p.claims; delete p.calibrationForecast;
  p.physics.kFrame = kF;
  if (nMul && nMul !== 1) for (const b of p.bodies) if (b.type === 'disk') { b.n = b.n * nMul; b.mMin = b.mMin / nMul; b.mMax = b.mMax / nMul; }
  return p;
}
function unitsOf(p) { const L = Math.pow(10, p.scaleExp.L), T = Math.pow(10, p.scaleExp.T); return { lenSI: L, velSI: L / T, accSI: L / (T * T), kpcPerUnit: L / GR.KPC_M }; }
function centerOf(p) { let i = 0; for (const b of p.bodies) { if (b.type === 'single') return i; i += b.type === 'disk' ? b.n : 1; } return null; }
function snapOf(S) { const n = S.n, o = { n, t: S.t }; for (const k of KEYS) o[k] = Float64Array.from(S[k].subarray(0, n)); o.m = Float64Array.from(S.m.subarray(0, n)); return o; }
function injectTo(S, st) { for (const k of KEYS) S[k].set(st[k]); S.t = st.t; }
function buildCopy(HP, id, kF, nMul) { const v = HP.validatePreset(bookCopy(HP, id, kF, nMul)); if (!v.ok) throw new Error('受理されない: ' + (v.errors || []).join('|')); const S = HP.sim; S.build(v.preset); return { S, preset: v.preset }; }
function offTo(HP, id, t, h, nMul) { const { S, preset } = buildCopy(HP, id, PLAN.kFOff, nMul), n = Math.round(t / h); for (let k = 0; k < n; k++) S.step(h); return { st: snapOf(S), preset, nan: S.hasNaN() }; }
/** 同じ状態 st を注入した写し(kF)で 2 歩: 1 歩目は前の u を置くだけ(引きずりの蹴りなし)・2 歩目の速さの差が DFM の蹴り */
function probeRun(HP, id, kF, st, h, nMul) { const { S } = buildCopy(HP, id, kF, nMul); injectTo(S, st); S.step(h); const a = snapOf(S); S.step(h); const b = snapOf(S); return { a, b, nan: S.hasNaN() }; }
/** 観測の回転の速さ(rotmod の V_obs の線形の内挿・外側は最後の値)で接線の速さを置き換えた状態(中心の相対 —— 中心の速さは保つ) */
function withObsVel(st, ci, U, FX) {
  const R = FX.rows.map((r) => r.R), V = FX.rows.map((r) => r.Vobs), vAt = (rk) => { if (rk <= R[0]) return V[0] * rk / R[0]; if (rk >= R[R.length - 1]) return V[V.length - 1]; let j = 1; while (R[j] < rk) j++; return V[j - 1] + (V[j] - V[j - 1]) * (rk - R[j - 1]) / (R[j] - R[j - 1]); };
  const o = Object.assign({}, st, { vx: Float64Array.from(st.vx), vy: Float64Array.from(st.vy) }), cx = ci === null ? 0 : st.x[ci], cy = ci === null ? 0 : st.y[ci], cvx = ci === null ? 0 : st.vx[ci], cvy = ci === null ? 0 : st.vy[ci];
  for (let i = 0; i < st.n; i++) { if (i === ci) continue; const dx = st.x[i] - cx, dy = st.y[i] - cy, r = Math.hypot(dx, dy); if (!(r > 0)) continue; const vt = vAt(r * U.kpcPerUnit) * 1e3 / U.velSI; o.vx[i] = cvx - vt * dy / r; o.vy[i] = cvy + vt * dx / r; }
  return o;
}
function partsOf(P0, P1, h, ci, U) {
  const out = [], cx = ci === null ? 0 : P0.a.x[ci], cy = ci === null ? 0 : P0.a.y[ci];
  const cax = ci === null ? 0 : ((P1.b.vx[ci] - P0.b.vx[ci]) / h), cay = ci === null ? 0 : ((P1.b.vy[ci] - P0.b.vy[ci]) / h);
  for (let i = 0; i < P0.a.n; i++) {
    if (i === ci) continue;
    const dx = P0.a.x[i] - cx, dy = P0.a.y[i] - cy, r = Math.hypot(dx, dy); if (!(r > 0)) continue;
    const ax = (P1.b.vx[i] - P0.b.vx[i]) / h - cax, ay = (P1.b.vy[i] - P0.b.vy[i]) / h - cay;
    out.push({ rKpc: r * U.kpcPerUnit, ain: -(ax * dx + ay * dy) / r, at: (dx * ay - dy * ax) / r, m: P0.a.m[i] });
  }
  return out;
}
function firstStepSame(P0, P1) { for (const k of ['x', 'y', 'vx', 'vy']) for (let i = 0; i < P0.a.n; i++) if (P0.a[k][i] !== P1.a[k][i]) return false; return true; }
export function probeSet(HP, FX, id, t, { nMul = 1, obsVel = false, kF = PLAN.kFOn, hs = PLAN.hs } = {}) {
  const rows = hs.map((h) => {
    const t0 = Date.now(), base = offTo(HP, id, t - h, h, nMul), U = unitsOf(base.preset), ci = centerOf(base.preset), st = obsVel ? withObsVel(base.st, ci, U, FX) : base.st;
    const P0 = probeRun(HP, id, PLAN.kFOff, st, h, nMul), P1 = probeRun(HP, id, kF, st, h, nMul), parts = partsOf(P0, P1, h, ci, U);
    return { h, n: st.n, center: ci === null ? 'origin' : 'body#' + ci, firstStepSame: firstStepSame(P0, P1), nan: base.nan || P0.nan || P1.nan, bins: GR.binDfm(parts, PLAN.edgesKpc.slice(), { accSI: U.accSI }), parts, U, wallSec: (Date.now() - t0) / 1000 };
  });
  const last = rows[rows.length - 1], prev = rows[rows.length - 2], conv = (A, B) => Math.max(0, ...A.bins.map((q, k) => (q.readable && B.bins[k].readable ? relD(q.dv2, B.bins[k].dv2) : 0)));
  const readSame = rows.every((r) => r.bins.every((q, k) => q.readable === last.bins[k].readable));
  return { id, t, nMul, obsVel, kF, rows: rows.map(({ parts, U, ...r }) => r), convH2H4: rows.length >= 3 ? conv(prev, last) : null, convH1H2: rows.length >= 2 ? conv(rows[0], rows[1]) : null, readableSameAcrossH: readSame, _last: last };
}
export function partDfm(HP, FX) {
  const t0 = Date.now(), M = PLAN.books.main, NH = PLAN.books.noHalo;
  const flat = Object.fromEntries(PLAN.probeT.map((t) => [String(t), probeSet(HP, FX, M, t)]));
  const obs = Object.fromEntries(PLAN.probeT.map((t) => [String(t), probeSet(HP, FX, M, t, { obsVel: true })]));
  const noHalo = Object.fromEntries(PLAN.probeTNoHalo.map((t) => [String(t), probeSet(HP, FX, NH, t, { obsVel: true })]));
  const noHaloFlat = Object.fromEntries(PLAN.probeTNoHalo.map((t) => [String(t), probeSet(HP, FX, NH, t)]));
  const nSens = probeSet(HP, FX, M, PLAN.probeT[0], { nMul: PLAN.nMul, obsVel: true, hs: PLAN.hs.slice(0, 2) });
  // kF の線形(同じ状態の 2 歩目 —— u は kF に依らない: 蹴りは kF 倍。同じ歩の中で蹴りの後に位置が動く 2 次の分だけ外れる)
  const half = probeSet(HP, FX, M, PLAN.probeT[0], { obsVel: true, kF: PLAN.kFHalf, hs: [PLAN.hs[0]] }), one = obs[String(PLAN.probeT[0])].rows[0];
  const kfLin = Math.max(...half.rows[0].bins.map((q, k) => (q.dv2Raw === null || one.bins[k].dv2Raw === null ? 0 : relD(q.dv2Raw, PLAN.kFHalf * one.bins[k].dv2Raw))));
  const strip = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, (({ _last, ...r }) => r)(v)]));
  const book = (id) => { const p = HP.allPresets().find((q) => q.id === id); return { id, emoji: p.emoji, kFrame: p.physics.kFrame, geoPN: p.physics.geoPN, halo: p.physics.halo ? p.physics.halo.model : null,
    frameReaction: p.physics.frameReaction || null, softening: p.physics.softening, D0: p.physics.D0, scaleExp: p.scaleExp, n: p.bodies.reduce((s, b) => s + (b.type === 'disk' ? b.n : 1), 0) }; };
  return { books: { main: book(M), noHalo: book(NH) }, units: unitsOf(HP.allPresets().find((q) => q.id === M)), flat: strip(flat), obsVel: strip(obs), noHalo: strip(noHalo), noHaloFlat: strip(noHaloFlat), nSens: (({ _last, ...r }) => r)(nSens),
    kFLinearMaxRel: kfLin, wallSec: (Date.now() - t0) / 1000 };
}
/** 時間発展の後の差(🌃 の OFF/ON —— 同じ初期状態から T まで・定常の解ではない) */
export function partEvolve(HP) {
  const t0 = Date.now(), M = PLAN.books.main, E = PLAN.edgesKpc;
  const runs = PLAN.evolveHs.map((h) => {
    const one = (kF) => { const { S, preset } = buildCopy(HP, M, kF), U = unitsOf(preset), at = []; let t = 0;
      for (const T of PLAN.evolveT) { const n = Math.round((T - t) / h); for (let k = 0; k < n; k++) S.step(h); t = T;
        const bins = E.slice(0, -1).map((lo, b) => { const hi = E[b + 1], s = []; for (let i = 0; i < S.n; i++) { const x = S.x[i], y = S.y[i], r = Math.hypot(x, y), rk = r * U.kpcPerUnit; if (r > 0 && rk >= lo && rk < hi) s.push((x * S.vy[i] - y * S.vx[i]) / r * U.velSI / 1e3); }
          return { lo, hi, n: s.length, vt: s.length ? s.reduce((a, q) => a + q, 0) / s.length : null, vt2: s.length ? s.reduce((a, q) => a + q * q, 0) / s.length : null }; });
        at.push({ T, tActual: S.t, nan: S.hasNaN(), bins }); }
      return at; };
    const off = one(PLAN.kFOff), on = one(PLAN.kFOn);
    return { h, off, on, diff: on.map((q, j) => ({ T: q.T, dvt2: q.bins.map((b, k) => (b.vt2 === null || off[j].bins[k].vt2 === null ? null : b.vt2 - off[j].bins[k].vt2)),
      dvt: q.bins.map((b, k) => (b.vt === null || off[j].bins[k].vt === null ? null : b.vt - off[j].bins[k].vt)) })) };
  });
  // 刻みで決まるか(h と h/2 の差の ⟨v_t²⟩ の符号が同じで、差が大きい方の半分以内 —— 決まらない箱は寄与の数に使わない)
  const A = runs[0], Bh = runs[runs.length - 1];
  const resolved = A.diff.map((d, j) => { const e = Bh.diff[j], ok = d.dvt2.map((x, k) => (x === null || e.dvt2[k] === null ? null : Math.sign(x) === Math.sign(e.dvt2[k]) && Math.abs(x - e.dvt2[k]) <= 0.5 * Math.max(Math.abs(x), Math.abs(e.dvt2[k]))));
    return { T: d.T, perBin: ok, nResolved: ok.filter((x) => x === true).length, nCompared: ok.filter((x) => x !== null).length }; });
  return { runs, resolved, reading: '時間発展の後の OFF/ON の差(同じ初期状態から —— 定常の解ではない・低 N の円盤は両方とも緩和する)。刻みで決まらない箱は寄与の数に使わない', wallSec: (Date.now() - t0) / 1000 };
}

/* ───────── E η と M_eq ───────── */
export function partEta(B, D) {
  const pick = (ps) => ps.rows[ps.rows.length - 1].bins, t0s = String(PLAN.probeT[0]);
  const etaRow = (dfmBins, obsBins) => dfmBins.map((q, k) => Object.assign({ lo: q.lo, hi: q.hi }, GR.etaOf(q, obsBins[k])));
  const main = pick(D.obsVel[t0s]), obs = B.bins;
  const rows = main.map((q, k) => { const e = GR.etaOf(q, obs[k]); return { lo: q.lo, hi: q.hi, nPart: q.n, RMean: q.RMean, dv2: q.dv2, dv2SE: q.dv2SE, ratioInT: q.ratioInT, readable: q.readable, deficit: obs[k].deficit, deficitSigma: obs[k].sigma,
    significant: obs[k].significant, eta: e.eta, etaSigma: e.sigma === undefined ? null : e.sigma, why: e.why, Meq: q.dv2 === null || q.RMean === undefined ? null : GR.meqOf(q.RMean, q.dv2) }; });
  const sens = {
    upsilon03: etaRow(main, B.sensUpsilon['0.3']), upsilon08: etaRow(main, B.sensUpsilon['0.8']),
    dist124: etaRow(main, B.sensDistance['12.4']), dist152: etaRow(main, B.sensDistance['15.2']),
    flatVel: etaRow(pick(D.flat[t0s]), obs), state10: etaRow(pick(D.obsVel[String(PLAN.probeT[1])]), obs), nMul2: etaRow(pick(D.nSens), obs), noHalo: etaRow(pick(D.noHalo[t0s]), obs) };
  const vals = rows.filter((q) => q.eta !== null).map((q) => q.eta);
  const summary = { nEta: vals.length, nBins: rows.length, min: vals.length ? Math.min(...vals) : null, max: vals.length ? Math.max(...vals) : null, anyOver1: vals.some((x) => x > 1), anyNegative: vals.some((x) => x < 0),
    held: vals.length === 0, heldWhy: vals.length === 0 ? '有意に正の分母と円軌道の釣り合いで読める箱が重ならない' : null,
    reading: '宣言した kF = 1・geoPN = 0 の E6′ の輸送・低 N の写しを観測の回転の速さで評価した DFM の内向きの加速度の箱の値 —— 寄与の度合いの診断の 1 列(結論ではない・定常の解ではない)' };
  return { rows, sens, summary };
}

/* ───────── M 天の川の太陽の近傍の桁の比 ───────── */
export function partMw(FC, CT) {
  const P = GR.galaxyLabelPort({ mode: 'oort', A_O: PLAN.mwOort.A_O, B_O: PLAN.mwOort.B_O, RKpc: F.FLOW.R0kpc, source: PLAN.mwOort.source }), k = GR.KMS_KPC_RADS, Of = FC.direct.OmegaField;
  const Op = G7.DECL.OmegaPatternKmsKpc.map((x) => x * k);
  const rows = [
    { key: 'omegaField', ja: '宣言の候補 Ω_field(第328便a —— g_T = 1・太陽の式の検査の値)', value: Of, kind: 'DFM の伝達の宣言の候補' },
    { key: 'omegaMatApi', ja: 'Ω_mat(場の API の宣言の模型の流れ V(R0)/R0)', value: CT.rotating.OmegaFrame, kind: '物質の回転' },
    { key: 'omegaOort', ja: 'Ω = A_O − B_O(宣言のオールトの量)', value: P.Omega * k, kind: '物質の回転(既存理論のラベル)' },
    { key: 'kappaEpi', ja: 'κ_epi = √(−4ΩB_O)(周転円の振動数 —— κ_D とは別)', value: P.kappaEpi * k, kind: '既存理論のラベル' },
    { key: 'ilrM2', ja: 'Ω − κ_epi/2(m = 2 の内側 Lindblad 共鳴の条件の値 —— R0 だけ)', value: P.OmegaP * k, kind: '既存理論のラベル' },
    { key: 'patternLo', ja: '渦状腕のパターンの角速度の文献の範囲の下端(第327便b の宣言)', value: Op[0], kind: 'パターンの回転' },
    { key: 'patternHi', ja: '同 上端(第328便a の宣言の Ω_arm)', value: Op[1], kind: 'パターンの回転' },
  ].map((q) => Object.assign(q, { ratioFieldOver: Of / q.value, log10: Math.log10(Of / q.value) }));
  return { rows, oortPort: P, armSame: relD(Op[1], FC.direct.OmegaArm), note: '同一視しない(桁の比の記録 —— 宣言の候補 Ω_field は物質の回転でもパターンの回転でもない・v = Ω_field R で外挿しない・位置の関数は geoPN = 4 の本の後 —— AN572)' };
}

/* ───────── 全部と門 ───────── */
export function runAll(HP, root = ROOT) {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const FX = readFixture(root), CSV = readCsv(root), FC = JSON.parse(fs.readFileSync(path.join(root, FC328), 'utf8')); mark('inputs');
  const LB = partLabels(FX); mark('labels');
  const CT = partContract(FC); mark('contract');
  const PT = partPort(HP, CSV, LB); mark('port');
  const B = partBaseline(FX, CSV); mark('baseline');
  const D = partDfm(HP, FX); mark('dfm');
  const EV = partEvolve(HP); mark('evolve');
  const E = partEta(B, D); mark('eta');
  const M = partMw(FC, CT); mark('mw');
  const J = { inputs: { fixture: FX.check, fixtureVersion: FX.J.version, csvVflatKms: CSV.vflatKms, fc328: { version: FC.version, OmegaField: FC.direct.OmegaField, OmegaArm: FC.direct.OmegaArm, nuAlong: FC.direct.nuAlong } },
    labels: LB, contract: CT, port: PT, baseline: B, dfm: D, evolve: EV, eta: E, mw: M, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}
export function gatesOf(J) {
  const LB = J.labels, CT = J.contract, PT = J.port, B = J.baseline, D = J.dfm, EV = J.evolve, E = J.eta, M = J.mw, t0s = String(PLAN.probeT[0]);
  const allProbe = [].concat(Object.values(D.flat), Object.values(D.obsVel), Object.values(D.noHalo), Object.values(D.noHaloFlat), [D.nSens]);
  return {
    labelsPure: Object.values(LB.gates).every(Boolean),
    labelsTable: LB.tables.centralDiff.length === B.fixture.n && LB.nullCount.centralDiff === 2 && LB.nullCount.localQuad === 2 && LB.tables.centralDiff.filter((q) => q.labels).every((q) => q.labels.sigma !== null),
    contractPure: Object.values(CT.pure.gates).every(Boolean),
    oldCallsBitSame: CT.old.every((x) => x === true) && CT.old328 === true,
    v2ToV1Same: CT.v1proj.ok === true && CT.v1proj.sameAs328a === true && CT.v1proj.sameAsBuilder === true && CT.v1proj.shape === true,
    identityFrameBitSame: Object.values(CT.identity).every((x) => x === true),
    axesOnlyRotates: CT.axes.uRel <= 1e-14 && CT.axes.normRel <= 1e-14 && CT.axes.halfCurlRel <= 1e-13 && CT.axes.xGCRel <= 1e-15,
    rotatingFrameShift: CT.rotating.gradNull === true && Math.abs(CT.rotating.linear - 2) <= 1e-12 && CT.rotating.naiveRatio !== null && Math.abs(CT.rotating.naiveRatio - 1) > 0.05 && CT.tool.z0.maxRel <= 1e-9 && CT.tool.z03.maxRel <= 1e-9,
    relVelInvariant: CT.relVel.rel <= 1e-12 && CT.relVel.roundTrip <= 1e-14 && CT.relVel.doubledRel > 1e-3,
    mwContract: CT.mw.shape === true && CT.mw.toV1 === false && CT.mw.slipVs328a <= 1e-12 && CT.mw.slipInFrameRel <= 1e-9 && CT.mw.armInContract === false && CT.rank.rank === 1 && CT.rank.unknowns === 2 && CT.rank.rows === 3,
    labelPort: PT.bookDeclared === null && PT.bookPort.mode === null && PT.bookPort.OmegaP === null && PT.diag.mode === 'flatIdentity' && PT.halfCurlRejected === true,
    fixtureIntegrity: B.fixture.shaSame === true && B.fixture.parsedSame === true && B.fixture.thirdParty === true && B.fixture.n === 43 && B.csvCompared === 43 && B.csvMaxAbsDiff <= 1e-9 && B.csvUrlSame === true
      && Math.abs(B.csvDistanceMpc - B.fixture.distanceMpc) <= 1e-3,
    probeSameState: allProbe.every((p) => p.rows.every((r) => r.firstStepSame === true && r.nan === false)),
    probeConverged: [D.flat[t0s], D.obsVel[t0s], D.noHalo[t0s]].every((p) => p.convH2H4 !== null && p.convH2H4 <= PLAN.convTolRel),
    kFLinear: D.kFLinearMaxRel <= PLAN.kFLinTolRel,
    evolveFinite: EV.runs.every((r) => r.off.concat(r.on).every((q) => q.nan === false)),
    etaRecorded: E.rows.length === PLAN.edgesKpc.length - 1 && E.rows.every((q) => q.eta !== null || typeof q.why === 'string') && (E.summary.held ? typeof E.summary.heldWhy === 'string' : E.summary.nEta > 0),
    mwRatios: M.rows.length === 7 && M.rows.filter((q) => q.key !== 'omegaField').every((q) => Number.isFinite(q.ratioFieldOver) && q.ratioFieldOver > 1e8) && M.armSame <= 1e-12,
  };
}

/* ───────── 走らせる ───────── */
export async function main() {
  const TARGET = process.env.W329B_TARGET || 'beta/index.html';
  const OUT = process.env.W329B_OUT ? (path.isAbsolute(process.env.W329B_OUT) ? process.env.W329B_OUT : path.join(ROOT, process.env.W329B_OUT)) : path.join(ROOT, OUT_MAIN);
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now(), text = fs.readFileSync(html, 'utf8'), targetSha256 = crypto.createHash('sha256').update(text).digest('hex');
  const W281A_SCOPE = REGEN_SCOPE ? w281aScopeStamp(html, REGEN_SCOPE) : {};
  const { HP } = loadHtmlMain(html);
  console.log('第329便b galrot(版 ' + HARNESS_VERSION + ')');
  const R = runAll(HP);
  const out = { version: HARNESS_VERSION, libVersion: GR.LIB_VERSION, contractLibVersion: C2.LIB_VERSION, contractVersion: C2.CONTRACT2_VERSION, baseContractVersion: C2.BASE_CONTRACT_VERSION, generator: 'tests/exp-w329b-galrot.mjs',
    target: TARGET, targetSha256, reuseFrom: null,
    ruling: '原仮定者の方針(2026-11-07)「既存の銀河の回転の理論を利用して DFM を融合する」「寄与の度合いを調査する」・原仮定者の回答(2026-11-07 —— AN568 = A 契約の版 2 に回転する枠・AN569 = A Ω_arm は受け手の側・AN570 = A の限定 + B の限定 ランク 1 のまま・ラベルの口・AN572 = A Ω_field は太陽系近傍の定数)・統括の検証項目 R305',
    decl: { galrot: GR.DECL, contract2: C2.DECL }, plan: PLAN, contract2Keys: C2.CONTRACT2_KEYS, frame2Keys: C2.FRAME2_KEYS, ratesKeys: C2.RATES_KEYS, portKeys: GR.PORT_KEYS, notClaim: NOT_CLAIM, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w329b-galrot.mjs', 'tests/lib-w329b-galrot.mjs', 'tests/lib-w329b-fieldcontract2.mjs', 'tests/lib-w328a-fieldcontract.mjs', 'tests/lib-w321c-galfield.mjs', 'tests/lib-w320c-nbcompose.mjs',
    'tests/lib-w319b-srcradius.mjs', 'tests/lib-w326d-axialheat.mjs', 'tests/lib-w327b-galaxis.mjs', 'tests/lib-w270b-obscsv.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第329便b', target: TARGET, code: CODE, inputs: [TARGET, FIXTURE, CSV_REL, FC328] }), {
    harnessVersion: HARNESS_VERSION, stage: 'galrot', engine: 'Node(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・1 プロセス)・🌃🛞 の診断の写し(器の中)・場の API の純関数(版 2 の口で包む)', notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();
