// 第330便a(原仮定者の整理(2026-11-08)「自転の整理」〔潮汐ロック・ある程度ロック・ロックしない〕「注目要素」〔地球と火星の自転速度・金星の太陽と銀河・水星の測地線〕「歳差運動」「内部熱」・
//   原仮定者の回答(2026-11-08 —— AN577 = C・AN578 = A と C を同じ表に・AN579 = A)・統括の検証項目 R307): **自転の 3 分類と由来ごとのトルクの表・地球と火星の対照(1 つの A)・
//   金星の太陽と銀河の釣り合いの検査列(符号の表)・AN577 C の 2 列・内部熱の帳簿(第132報の定義)・水星の測地の歳差・歳差の窓**(段 spinclass-330a —— 正本 tests/out/spinclass-w330a.json・
//   lib tests/lib-w330a-spinclass.mjs)。**診断だけ** —— エンジン・内蔵の本・受理器・beta/index.html・既存の lib の本文は変えない。
//
// Node だけ(対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、第326便d の器の写し〔copyBook・stateOf〕と第327便e の器の読み口〔stateFor・gradT〕を使う ——
//   K1 の核の式を写さない)。受動の口は第327便a の lib(族 E の evaluate)と第327便f の lib(evaluateAll・solidPort・thermalPort・tidalScale・thermalN0)をそのまま呼ぶ。慣性で配る型は第328便b の
//   lib の responseOf。AN577 の 2 列は第329便a の器の部(partI・partP・partB・partM)をそのまま呼ぶ(第329便a の正本の数は動かさない —— 同じ器・同じ html で作り直して読む)。
//   入力は html だけ(他の正本・データは読まない —— 文献の値は lib の DECL)。1 プロセス(子プロセスなし)。t = 0 の読み口と純関数だけ(本の步を進めない)。
//
// ■ 何をするか
//   I 入力: 16 体(太陽・8 惑星・月・ガリレオ衛星 4・タイタン・トリトン)の質量・半径・自転(本と文献)・自転軸・R_d(規則 R_d = Y_k m の読み口)・慣性(文献の C/(M R²))・ĝ·â・
//     公転の中心に対する接触の二体(本の J2000)・k = ω/n・K1 の伝達(源 J〔主〕と今)・太陽の式の A(太陽の口は銀河だけ)・慣性で配る型の f_i = F_i/F_☉
//   C 3 分類の表: 16 体 × 受け手の演算の型 2(球の平均 p = 0・慣性で配る —— AN578 C)× τ_0 の 2 枝 × 射影 2 の由来ごとの軸の向きのトルク・熱・Γ の重み・最大の由来・群の判定と分類の期待の一致
//   E 地球と火星の対照: 太陽・地球・火星(とロックしない他の惑星)の 1 つの A —— 銀河の 1 口・銀河 + K1・銀河 + K1 + 潮汐(τ_0 = 年齢)の定常の目標で要る A と、A_☉ の定常の目標と観測の比
//   V 金星の符号の表: 銀河・太陽 K1・太陽の固体の潮汐・太陽の熱潮汐(なし・文献の範囲の下と上 —— 駆動の口)の符号と釣り合いの度合い(型 2 × τ_0 2 × 射影 2 × 熱潮汐 3)
//   N AN577 = C の 2 列: A(秤動 —— 要る最小の N₁・宣言の N₁・位相の模型の判定)と B(観測の自転を目標にした有効なパターン —— トルクの条件・ω_res との差・仕事の差の尺度)
//   H 内部熱の帳簿: 16 体 × 型 2 × τ_0 2(射影は主)—— Q_軸引きずり・Q_潮汐・供給の口座・自転の仕事・閉じたか・定常か・観測の熱流(文献の値)との比。金星に偏りの口と熱潮汐の行
//   G 水星の測地の歳差: 惑星ごとの Ω_geo と 1PN の近点の移動(軌道の量)・自転の軸の向きの釣り合いへの寄与 0・同じ角速度を剛体で作るトルクの尺度
//   W 歳差の窓: 天体ごとの歳差の角速度(文献の値・古典の式・節の式)と窓(イオ 1 公転・地球 1 年・10 年)の位相と軸の変位・要る角の精度・位相の模型の期間の行(別)
// ■ 言わないこと: 3 分類の検査は「宣言した型で表の値になった」「残差」(分類を直さない)。金星の釣り合いは列の値。内部熱は「宣言した範囲で収支が閉じた」と観測の熱流との比を別の欄に ——
//   説明・解決とは書かない。測地の歳差は自転の釣り合いに足さない。歳差の窓は角の表。負の Γ は採らない。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import { galaxyAxis } from './lib-w319a-axisheat.mjs';
import * as X from './exp-w326d-axialheat.mjs';
import * as XE from './exp-w327e-axialdiff.mjs';
import * as E from './lib-w326d-axialheat.mjs';
import * as LS from './lib-w327a-axialsum.mjs';
import * as LF from './lib-w327f-venustide.mjs';
import * as RB from './lib-w328b-response.mjs';
import * as SB from './lib-w329a-spinbias.mjs';
import * as W9 from './exp-w329a-spinbias.mjs';
import * as SC from './lib-w330a-spinclass.mjs';
// 第281便a の領域 hash の宣言(器と lib から deriveScope で引いた下限 —— 版 8 の宣言: ワンタップ対照の A/B を走らせない〔abBody:false〕・説明文の欄を読まない〔keepProse なし〕。
//   presets は器が .find で引く在位の本 🗺️ 1 本と、第328便b の lib が import する場の API〔第321便c〕・第319便b の lib とその import の綴りの 11 本〔第328便b の器と同じ下限〕)
const REGEN_SCOPE = {"presets":["jupiterGalilean","jupiterSunInertial3d","marsSunInertial3d","mercury","mercurySunInertial3d","neptuneSunInertial3d","saturn","saturnRingReal","saturnSunInertial3d","solarSystem16Inertial3d","uranusSunInertial3d","venusSunInertial3d"],"roots":["$","HP.REL_DRAG_INVSQ_SRC_MOMENT_VERSION","HP.REL_DRAG_INVSQ_VERSION","HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.inertialDragIsqPointAt","HP.inertialDragIsqState","HP.sim","HP.validatePreset","T","ab","ch","ctx","cw","inertialDragGalaxyAxialState","pnSource"],"core":true,"consts":[],"complete":true,"abBody":false};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w330a-spinclass-1';
export const OUT_MAIN = 'tests/out/spinclass-w330a.json';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze(['3 分類は宣言の作業仮説(表の値で分類を書き換えない —— 合わない行は残差)', '金星の釣り合いは列の値(仮説の否定とも肯定とも書かない)',
  '内部熱は宣言した範囲の収支(閉じたかと観測の熱流との比は別の欄 —— 説明ではない)', '1 つの A で合わない行は残差(新しい定数を作らない)', '測地の歳差は自転の釣り合いに足さない(輸送はトルクではない)',
  '歳差の窓は角の表(無視してよいことの確認ではない)', 'AN577 の 2 列は捕獲や起源の同定ではない', '負の Γ は採らない(0 に丸めない)']);
const D = SC.DECL, DAY = 86400, YEAR = 365.25 * DAY;
const MER = Object.keys({ mercury: 1 })[0], SAT = Object.keys({ saturn: 1 })[0];   // 鍵の文字列を引用符で書かない(領域の下限 deriveScope が同じ綴りの本の id と取り違えない書き方)
/** 天体の鍵 → 🗺️ の添字(DECL.bodies の順) */
export const IDX = Object.freeze(Object.fromEntries(D.bodies.map((k, i) => [k, i])));
export const NAME_JA = Object.freeze({ sun: '太陽', [MER]: '水星', venus: '金星', earth: '地球', moon: '月', mars: '火星', jupiter: '木星', io: 'イオ', europa: 'エウロパ', ganymede: 'ガニメデ',
  callisto: 'カリスト', [SAT]: '土星', titan: 'タイタン', uranus: '天王星', neptune: '海王星', triton: 'トリトン' });

/* ───────── I 入力 ───────── */
const axisOfDecl = (b) => { const t = b.spinAxis.tiltDeg * Math.PI / 180, a = b.spinAxis.azimuthDeg * Math.PI / 180; return [Math.sin(t) * Math.cos(a), Math.sin(t) * Math.sin(a), Math.cos(t)]; };
function orbitOf(book, ci, oi, uL, uT) {
  const a = book.bodies[ci], b = book.bodies[oi], r = [b.x - a.x, b.y - a.y, b.z - a.z], v = [b.vx - a.vx, b.vy - a.vy, b.vz - a.vz];
  const h = E.cross(r, v), mu = book.physics.G * (a.m + b.m), sma = 1 / (2 / E.norm(r) - E.dot(v, v) / mu), n = Math.sqrt(mu / (sma * sma * sma)) / uT;
  const ecc = E.norm(E.sub(E.scale(E.cross(v, h), 1 / mu), E.scale(r, 1 / E.norm(r))));
  return { nHat: E.scale(h, 1 / E.norm(h)), nBook: n, sma: sma * uL, ecc };
}
/** 潮汐の目標の公転(受け手・起潮天体 → [中心, 回る天体]・文献の周期の天体) */
function tideOrbitOf(recv, raiser) {
  const P = D.primary;
  if (P[recv] === raiser) return { pair: [raiser, recv], litOf: recv };
  if (P[raiser] === recv) return { pair: [recv, raiser], litOf: raiser };
  if (raiser === 'sun' && P[recv]) return { pair: ['sun', P[recv]], litOf: P[recv] };
  throw new RangeError('tideOrbitOf: ' + recv + ':' + raiser);
}
const litRate = (key) => 2 * Math.PI / (D.lit.orbitDays[key] * DAY);
export function partI(HP) {
  const st = X.stateOf(HP, X.copyBook(HP)), stJ = XE.stateFor(HP, 'J'), book = st.preset, se = book.scaleExp, uL = Math.pow(10, se.L), uT = Math.pow(10, se.T), uM = Math.pow(10, se.M);
  const rdB = st.isq.rdRule.bodies, ga = galaxyAxis(), bodies = {};
  for (const key of D.bodies) {
    const i = IDX[key], b = book.bodies[i], a = axisOfDecl(b), aE = [st.S.sax[i], st.S.say[i], st.S.saz[i]], m = b.m * uM, R = b.radius * uL, moi = D.lit.moi[key];
    const sBook = b.spin / uT, sd = D.lit.spinDays[key], sObs = sd === null ? sBook : 2 * Math.PI / (sd * DAY);
    bodies[key] = { key, i, name: NAME_JA[key], cls: SC.classOf(key), m, R, sBook, sObs, sObsSource: sd === null ? '本(Carrington の恒星自転の転記)' : '文献の周期(lib の DECL)', a, axisEngineAngDeg: E.angDeg(a, aE),
      Rd: rdB.find((q) => q.i === i).Rd * uL, moi, I: moi * m * R * R, gDotA: E.dot(ga.g, a) };
  }
  for (const key of D.bodies) {
    const pk = D.primary[key];
    if (!pk) { bodies[key].orbit = null; continue; }
    const ob = orbitOf(book, IDX[pk], IDX[key], uL, uT), b = bodies[key], nAl = E.dot(ob.nHat, b.a), nL = litRate(key), sg = nAl >= 0 ? 1 : -1;
    b.orbit = Object.assign(ob, { primary: pk, nLit: nL, nHatDotA: nAl, obliqDeg: E.angDeg(b.a, ob.nHat), kBook: b.sBook / (ob.nBook * sg), kObs: b.sObs / (nL * sg), kBookProj: b.sBook / (ob.nBook * nAl) });
  }
  const tides = {};
  for (const key of D.bodies) for (const r of D.ports[key].tide) {
    const to = tideOrbitOf(key, r), ob = orbitOf(book, IDX[to.pair[0]], IDX[to.pair[1]], uL, uT);
    tides[key + ':' + r] = { nHat: ob.nHat, sma: ob.sma, nLit: litRate(to.litOf), litOf: to.litOf };
  }
  const t = { now: {}, J: {} };
  for (const key of D.bodies) for (const s2 of D.ports[key].k1) { t.now[key + ':' + s2] = XE.gradT(st, IDX[key], IDX[s2]); t.J[key + ':' + s2] = XE.gradT(stJ, IDX[key], IDX[s2]); }
  const Asun = bodies.sun.sBook / bodies.sun.gDotA;   // 族 E・球の平均 p = 0(f = 1)の太陽の式(太陽の口は銀河だけ —— 第329便a と同じ)
  // 受け手の演算の型の係数 f_i = F_i/F_☉(第328便b の lib の responseOf —— 球の平均は定数の場で 1・慣性で配る型は I_c/(I_c + I))
  const fOf = {};
  for (const form of D.responseForms) {
    const F = (k) => RB.responseOf(form, { Rd: bodies[k].Rd, m: bodies[k].m, I: bodies[k].I }, { slip: [1, 0, 0] }).fac, Fs = F('sun');
    fOf[form] = Object.fromEntries(D.bodies.map((k) => [k, F(k) / Fs]));
  }
  return { units: { lenSI: uL, timeSI: uT, massSI: uM }, bodies, tides, t, g: ga.g, Asun, fOf, gBook: book.physics.G, MsunSI: bodies.sun.m };
}

/* ───────── 系の評価(第327便a・第327便f の lib を呼ぶ)———————— */
const tauOf = (tau) => (tau === 'inf' ? Infinity : LF.TAU_AGE);
/** 受け手 key の系(源は銀河の口だけ・受け手は銀河 + K1)と prm */
function sysOf(IN, key, form, spin) {
  const src = D.ports[key].k1, keys = src.concat([key]);
  return keys.map((k) => { const b = IN.bodies[k], pp = [{ kind: 'gal' }];
    if (k === key) for (const s2 of src) pp.push({ kind: 'k1', src: s2, t: IN.t.J[key + ':' + s2] });
    return { key: k, s: k === key ? spin : b.sBook, a: b.a, f: IN.fOf[form][k], Rd: b.Rd, ports: pp }; });
}
function prmOf(IN, sys, tau) {
  if (tau === 'inf') return null;
  return { family: 'E', g: IN.g, gamma0: Object.fromEntries(sys.map((b) => [b.key, IN.bodies[b.key].I / LF.TAU_AGE])), beta: {}, alloc: LS.DECL.allocations.equal, A: IN.Asun };
}
/** 固体の潮汐の口(第329便a と同じ型: constLag・観測の滑りで一定の Q と同じトルク・同期は |n| で揃える)。proj: book(本の二体の向き)/coplanar(軸 â の向き —— 逆行は符号) */
export function tidePorts(IN, key, proj, spin) {
  const b = IN.bodies[key];
  return D.ports[key].tide.map((r) => {
    const td = IN.tides[key + ':' + r], nL = td.nLit, sg = E.dot(td.nHat, b.a) >= 0 ? 1 : -1, n = proj === 'book' ? E.scale(td.nHat, nL) : E.scale(b.a, sg * nL);
    // 揃えの滑り: 同期の宣言の組(潮汐ロックの衛星と公転の中心)は |n|(第329便a の anchorSyncSlip と同じ宣言 —— 本の向きの射影で軸と公転の法線の小さな角が作る垂直の滑りを揃えに使わない)。
    //   他は観測の滑りのベクトルの大きさ(同じ面で滑りが 0 なら |n|)
    const sync = b.cls === 'tidalLock' && D.primary[key] === r;
    const NQ = 1.5 * D.lit.k2Q[key] * LF.tidalScale({ Mr: IN.bodies[r].m, R: b.R, a: td.sma }), slipObs = Math.abs(spin - E.dot(n, b.a)), wAnc = !sync && slipObs > 1e-9 * nL ? E.norm(E.sub(n, E.scale(b.a, spin))) : nL;
    return { kind: 'solid', form: D.solidMain, src: r, n, NQ, wAnc, nAlong: E.dot(n, b.a), Gamma: NQ / wAnc };
  });
}
/** 金星の熱潮汐の単位の振幅(N_0 = 1 —— 一定の位相)の軸の向きのトルクと、文献の範囲の N_0 */
function venusThermal(IN, proj, spin) {
  const b = IN.bodies.venus, td = IN.tides['venus:sun'], tp = tidePorts(IN, 'venus', proj, spin)[0], Om = E.scale(b.a, spin);
  const perPa = LF.thermalN0({ eps: 1, ps: 1, Msun: IN.bodies.sun.m, M: b.m, R: b.R, a: td.sma }), ps = LF.DECL.lit.surfacePressurePa.venus;
  const u = E.dot(LF.thermalPort(D.venusThermal.form, { Omega: Om, n: tp.n, N0: 1, omega0: null }).torque, b.a);
  const N0 = { none: 0, lo: LF.DECL.lit.venusEpsRange[0] * perPa * ps, hi: LF.DECL.lit.venusEpsRange[1] * perPa * ps };
  return { n: tp.n, unit: u, perPa, ps, N0 };
}
/** 受け手の評価(由来ごとの行・合トルク・帳簿)。opt: thermal('none'|'lo'|'hi' —— 金星だけ)・Nr(偏りの口の軸の向きのトルク) */
export function evalBody(IN, key, { form, tau, proj, spin, thermal = 'none', Nr = null }) {
  const sys = sysOf(IN, key, form, spin), prm = prmOf(IN, sys, tau), tp = tidePorts(IN, key, proj, spin);
  const ext = { [key]: tp.map((q) => ({ kind: q.kind, form: q.form, src: q.src, n: q.n, NQ: q.NQ, wAnc: q.wAnc })) };
  if (thermal !== 'none') { const vt = venusThermal(IN, proj, spin); ext[key].push({ kind: 'thermal', form: D.venusThermal.form, src: 'sun', n: vt.n, N0: vt.N0[thermal], omega0: null }); }
  if (Nr !== null) ext[key].push({ kind: 'res', src: 'bias', Nr });
  const ev = LF.evaluateAll(sys, prm, ext), row = ev.rows.find((q) => q.key === key), tpBy = Object.fromEntries(tp.map((q) => ['solid:' + q.src, q]));
  const origins = row.lsPorts.map((q) => ({ key: q.kind + (q.src ? ':' + q.src : ''), torqueAlong: q.torqueAlong, heat: q.heat, Gamma: q.Gamma, nuAlong: q.nuAlong, supply: q.supply, recvWork: q.recvWork }))
    .concat(row.ports.map((q) => { const k = q.kind + ':' + q.src, lin = tpBy[k];
      return { key: k, torqueAlong: q.torqueAlong, heat: q.heat, Gamma: lin ? lin.Gamma : null, nuAlong: lin ? lin.nAlong : null, supply: q.orbitWork + q.solar, recvWork: q.recvWork, orbitWork: q.orbitWork, solar: q.solar }; }));
  return { along: row.along, alongScale: row.alongScale, alongRel: row.alongRel, origins, ledger: ev.ledger };
}
const compactOrigins = (os) => os.map((q) => ({ key: q.key, torqueAlong: q.torqueAlong, heat: q.heat, Gamma: q.Gamma, nuAlong: q.nuAlong, supply: q.supply }));

/* ───────── C 3 分類の表 ───────── */
export function partC(IN) {
  const rows = [];
  for (const key of D.bodies) for (const form of D.responseForms) for (const tau of D.tau0) for (const proj of [D.projections.main, D.projections.also]) {
    const b = IN.bodies[key], r = evalBody(IN, key, { form, tau, proj, spin: b.sObs }), cl = SC.classifyOrigins(r.origins, b.cls);
    const rb = evalBody(IN, key, { form, tau, proj, spin: b.sBook });
    rows.push({ key, cls: b.cls, form, tau, proj, spin: b.sObs, along: r.along, alongRel: r.alongRel, bookSpinAlong: rb.along, origins: compactOrigins(r.origins),
      maxTorque: cl.maxTorque, maxWeight: cl.maxWeight, axialMag: cl.axialMag, tideMag: cl.tideMag, axialWeight: cl.axialWeight, tideWeight: cl.tideWeight, nuStar: cl.nuStar, nuStarOverSpin: cl.nuStar === null ? null : cl.nuStar / b.sObs,
      verdictTorque: cl.verdictTorque, verdictWeight: cl.verdictWeight, expected: cl.expected, matchTorque: cl.matchTorque, matchWeight: cl.matchWeight,
      heatMinOrigin: r.origins.length ? Math.min(...r.origins.map((q) => q.heat)) : 0, ledgerRel: r.ledger.residualRel, LRel: r.ledger.LTotalRel, portClose: r.ledger.portCloseMaxRel,
      flip: D.lit.k2QRole[key] === 'order' && tau === 'age' ? SC.flipFactor(cl.axialWeight, cl.tideWeight) : null });
  }
  const main = rows.filter((q) => q.proj === D.projections.main);
  const summary = D.responseForms.flatMap((form) => D.tau0.map((tau) => { const rs = main.filter((q) => q.form === form && q.tau === tau);
    return { form, tau, n: rs.length, matchTorque: rs.filter((q) => q.matchTorque).length, matchWeight: rs.filter((q) => q.matchWeight).length,
      byClass: Object.fromEntries(Object.keys(D.classes).map((c) => { const cs = rs.filter((q) => q.cls === c); return [c, { n: cs.length, matchTorque: cs.filter((q) => q.matchTorque).length, matchWeight: cs.filter((q) => q.matchWeight).length }]; })),
      projAgree: rs.every((q) => { const o = rows.find((z) => z.key === q.key && z.form === form && z.tau === tau && z.proj === D.projections.also); return o.verdictTorque === q.verdictTorque && o.verdictWeight === q.verdictWeight; }) }; }));
  return { rows, summary };
}

/* ───────── E 地球と火星の対照(1 つの A)———————— */
export function partE(IN) {
  const keys = D.classes.noLock, rows = [];
  for (const form of D.responseForms) for (const col of ['book', 'obs']) for (const key of keys) {
    const b = IN.bodies[key], s = col === 'book' ? b.sBook : b.sObs, f = IN.fOf[form][key], G0 = b.I / LF.TAU_AGE;
    const k1 = D.ports[key].k1.map((s2) => ({ Gamma: G0, nu: E.dot(IN.t.J[key + ':' + s2], b.a) * IN.bodies[s2].sBook }));
    const tide = tidePorts(IN, key, D.projections.main, s).map((q) => ({ Gamma: q.Gamma, nu: q.nAlong }));
    const sets = { galOnly: { Ggal: G0, others: [] }, galK1: { Ggal: G0, others: k1 }, galK1Tide: { Ggal: G0, others: k1.concat(tide) }, tideOnlyInf: { Ggal: 0, others: tide } };
    const out = { key, form, col, spin: s, f, gDotA: b.gDotA };
    for (const [nm, st] of Object.entries(sets)) {
      const A = st.Ggal > 0 ? SC.requiredA({ s, f, gDotA: b.gDotA, Ggal: st.Ggal, others: st.others }) : null, om = SC.steadyTarget({ A: IN.Asun, f, gDotA: b.gDotA, Ggal: st.Ggal, others: st.others });
      out[nm] = { A, AOverAsun: A === null ? null : A / IN.Asun, steadyAtAsun: om, steadyOverSpin: om === null ? null : om / s, Gsum: st.Ggal + st.others.reduce((a, q) => a + q.Gamma, 0) };
    }
    rows.push(out);
  }
  const spread = [];
  for (const form of D.responseForms) for (const col of ['book', 'obs']) for (const nm of ['galOnly', 'galK1', 'galK1Tide']) {
    const pick = (ks) => ks.map((k) => rows.find((q) => q.key === k && q.form === form && q.col === col)[nm].A);
    spread.push({ form, col, set: nm, sunEarthMars: SC.spreadOf(pick(['sun', 'earth', 'mars'])), earthMars: SC.spreadOf(pick(['earth', 'mars'])), allNoLock: SC.spreadOf(pick(keys)) });
  }
  const em = (col) => { const e = IN.bodies.earth, m = IN.bodies.mars, se = col === 'book' ? e.sBook : e.sObs, sm = col === 'book' ? m.sBook : m.sObs; return { periodRatio: se / sm, omegaRatio: sm / se }; };
  // 同じ銀河の入力(A_☉)の定常の目標の火星/地球の比(観測の角速度の比 0.972 と並べる —— 合わなければ残差)
  const modelRatio = [];
  for (const form of D.responseForms) for (const nm of ['galOnly', 'galK1', 'galK1Tide', 'tideOnlyInf']) {
    const e = rows.find((q) => q.key === 'earth' && q.form === form && q.col === 'book')[nm].steadyAtAsun, m = rows.find((q) => q.key === 'mars' && q.form === form && q.col === 'book')[nm].steadyAtAsun;
    modelRatio.push({ form, set: nm, earth: e, mars: m, marsOverEarth: e !== null && m !== null && e !== 0 ? m / e : null });
  }
  return { Asun: IN.Asun, rows, spread, earthMars: { book: em('book'), obs: em('obs') }, modelRatio, note: '1 つの A で合わない行は残差(新しい定数を作らない)—— 正の Γ の倍率だけでは銀河の 1 口の定常の目標は変わらない' };
}

/* ───────── V 金星の符号の表 ───────── */
export function partV(IN) {
  const rows = [], b = IN.bodies.venus;
  for (const form of D.responseForms) for (const tau of D.tau0) for (const proj of [D.projections.main, D.projections.also]) {
    const vt = venusThermal(IN, proj, b.sObs);
    for (const th of D.venusThermal.epsKeys) {
      const r = evalBody(IN, 'venus', { form, tau, proj, spin: b.sObs, thermal: th }), get = (k) => { const q = r.origins.find((z) => z.key === k); return q ? q.torqueAlong : 0; };
      const br = SC.balanceRow({ gal: get('gal'), sunK1: get('k1:sun'), sunSolid: get('solid:sun'), sunThermal: get('thermal:sun'), thermalUnit: vt.unit });
      rows.push(Object.assign({ form, tau, proj, thermal: th, N0: vt.N0[th], negativeGamma: r.origins.some((q) => q.Gamma !== null && q.Gamma < 0), ledgerRel: r.ledger.residualRel, heatMinOrigin: Math.min(...r.origins.map((q) => q.heat)) }, br,
        { n0ZeroOverLo: br.n0Zero === null ? null : br.n0Zero / vt.N0.lo, n0ZeroOverHi: br.n0Zero === null ? null : br.n0Zero / vt.N0.hi }));
    }
  }
  const anyOpposite = rows.some((q) => q.opposite), oppositeNoThermal = rows.filter((q) => q.thermal === 'none').some((q) => q.opposite);
  return { rows, anyOpposite, oppositeNoThermal, note: '熱潮汐は駆動の口(日射の供給 —— 負の Γ ではない)。熱潮汐なしの列は今の応答の型の符号' };
}

/* ───────── N AN577 = C の 2 列(第329便a の器の部を呼ぶ)———————— */
export function partN(HP) {
  const I9 = W9.partI(HP), B9 = W9.partB(I9), M9 = W9.partM(I9, B9), rv = B9.rows.find((q) => q.key === 'venus' && q.tau === 'age'), P = SB.periodsOf('venus'), C = rv.C, N2 = rv.quad.N2;
  const req = rv.required.n1, decl = rv.n1.N1, Tl = -rv.none.torqueLock, To = -rv.none.torqueObs, dOm = P.s - rv.omegaRes;
  const colA = { requiredN1: req.required, governs: req.governs, torqueCond: req.torque, widthCond: req.width, declaredN1: decl, margin: SB.DECL.margin, N2,
    requiredOverTorque: req.required / req.torque, declaredOverTorque: decl / req.torque, requiredOverN2: req.required / N2, declaredOverN2: decl / N2, gammaStarDeg: rv.n1.phase ? rv.n1.phase.gammaDeg : null,
    deltaOverWidthDeclared: rv.n1.phase ? rv.n1.phase.deltaOverWidth : null,
    phaseModel: { N1: M9.N1, spanYears: M9.runs[0].spanYears, libPeriodYears: M9.libPeriodYears, runs: M9.runs.map((q) => ({ start: q.start, stateH: q.h.state, stateH2: q.h2.state, patternRelH2: q.h2.patternRel, inertialRelH2: q.h2.inertialRel, converged: q.converged })) },
    reads: '軌道の周波数(現在の軌道の 5 n_地球 − 4 n_金星)のパターン —— 観測の差を秤動の一瞬と読む列' };
  const rB = SB.requiredAmplitudes({ Treq: To, Delta: 0, C, N2fix: N2, n1Admissible: true });
  const colB = { omegaPatternDeclared: P.s, omegaResOrbit: rv.omegaRes, deltaOmega: dOm, torqueCondObs: Math.abs(To), torqueCondLock: Math.abs(Tl), requiredN1: rB.n1.required, governs: rB.n1.governs, widthCond: rB.n1.width,
    workGapScale: Math.abs(Tl) * Math.abs(dOm), workGapScaleObs: Math.abs(To) * Math.abs(dOm),
    reads: '観測の自転を目標にした有効なパターン(現象論の宣言 —— 5:−4 の周波数を観測で確定した列ではない。軌道の周波数を保つなら位相の時間変化か追加の駆動の口座が要る)' };
  return { pair: 'venus', tau: 'age', A: colA, B: colB, notClaim: ['どちらの列も捕獲や起源の同定ではない', 'B を地球と金星の共鳴の測定値と呼ばない', '仕事(軌道の口座)と位相の契約を分ける'] };
}

/* ───────── H 内部熱の帳簿 ───────── */
export function partH(IN) {
  const rows = [];
  for (const key of D.bodies) for (const form of D.responseForms) for (const tau of D.tau0) {
    const b = IN.bodies[key], r = evalBody(IN, key, { form, tau, proj: D.projections.main, spin: b.sObs }), hObs = D.lit.heatFlowW[key];
    const hl = SC.heatLedger({ origins: r.origins, ledger: r.ledger, along: r.along, alongScale: r.alongScale, heatObs: hObs === undefined ? null : hObs });
    const ls = r.along !== 0 ? RB.localScale({ I: b.I, s: b.sObs, N: r.along }) : null;
    rows.push(Object.assign({ key, form, tau, variant: 'base', heatObsDeclared: hObs === undefined ? 'undeclared' : (hObs === null ? 'unknown' : 'lit') }, hl, { tChangeYears: ls ? ls.tChange / YEAR : null }));
  }
  // 金星: 偏りの口で観測の自転を保つ行(Nr = −合トルク —— 定常)と熱潮汐の文献の範囲の行
  const b = IN.bodies.venus;
  for (const form of D.responseForms) for (const tau of D.tau0) {
    const r0 = evalBody(IN, 'venus', { form, tau, proj: D.projections.main, spin: b.sObs }), rb = evalBody(IN, 'venus', { form, tau, proj: D.projections.main, spin: b.sObs, Nr: -r0.along });
    rows.push(Object.assign({ key: 'venus', form, tau, variant: 'bias', heatObsDeclared: 'unknown', Nr: -r0.along }, SC.heatLedger({ origins: rb.origins, ledger: rb.ledger, along: rb.along, alongScale: rb.alongScale, heatObs: null })));
    for (const th of ['lo', 'hi']) { const rt = evalBody(IN, 'venus', { form, tau, proj: D.projections.main, spin: b.sObs, thermal: th });
      rows.push(Object.assign({ key: 'venus', form, tau, variant: 'thermal:' + th, heatObsDeclared: 'unknown' }, SC.heatLedger({ origins: rt.origins, ledger: rt.ledger, along: rt.along, alongScale: rt.alongScale, heatObs: null }))); }
  }
  return { rows, allClosed: rows.every((q) => q.closed), note: '閉じた = 宣言した範囲で収支が閉じた(恒等式の帳簿)。観測の熱流との比は別の欄。アプリのサンプルで放射まで接続したことは記録しない(未接続)' };
}

/* ───────── G 水星の測地の歳差 ───────── */
export function partG(IN, Ww) {
  const GM = SC.G_SI * IN.MsunSI, rows = [];
  for (const key of [MER, 'venus', 'earth', 'mars', 'jupiter', SAT, 'uranus', 'neptune']) {
    const b = IN.bodies[key], ob = b.orbit, n = ob.nLit, geo = SC.geodeticRate({ GM, a: ob.sma, e: ob.ecc, n }), peri = SC.periRate1PN({ GM, a: ob.sma, e: ob.ecc, n });
    const wr = Ww.rows.find((q) => q.key === key), perpTorqueScale = geo * b.I * Math.abs(b.sObs) * Math.sin(ob.obliqDeg * Math.PI / 180);
    rows.push({ key, a: ob.sma, e: ob.ecc, geoRate: geo, geoArcsecPerCentury: SC.arcsecPerYear(geo) * 100, periRate1PN: peri, periArcsecPerCentury: SC.arcsecPerYear(peri) * 100, geoOverSpin: geo / Math.abs(b.sObs),
      alongContribution: 0, perpTorqueScale, precessionRate: wr ? wr.rate : null, precessionSource: wr ? wr.rateSource : null, geoOverPrecession: wr && wr.rate ? geo / wr.rate : null,
      geoAngleEarthYear: geo * 365.256 * DAY });
  }
  const mer = rows.find((q) => q.key === MER), csv = D.lit.mercuryPeriGRDegPerYear * 100 * 3600;
  return { rows, mercury: { geoArcsecPerCentury: mer.geoArcsecPerCentury, periArcsecPerCentury: mer.periArcsecPerCentury, periCsvArcsecPerCentury: csv, periRelToCsv: Math.abs(mer.periArcsecPerCentury - csv) / csv },
    note: '測地の歳差は自転のベクトルの輸送(トルクではない)—— 3:2 の軸の向きの釣り合いへは足さない(寄与 0)。近点の移動は軌道の量(今の geoPN の軌道に入る —— 二重に投入しない)' };
}

/* ───────── W 歳差の窓 ───────── */
export function partW(IN, Nn) {
  const rows = [];
  // 歳差の極(円錐の軸 —— 宣言): 惑星は自分の公転の法線(本の二体)・月は黄道の極(カッシーニ状態の軸は黄道の極の周りを節とともに回る)・他の衛星は親の自転軸(近い衛星の Laplace 面の極の近似)。
  //   円錐の半角 ε = 軸と極の鋭角(逆行の軸は反対の向きで測る)
  const poleOf = (key) => { const ob = IN.bodies[key].orbit; if (!ob) return null; if (ob.primary === 'sun') return ob.nHat; if (key === 'moon') return [0, 0, 1]; return IN.bodies[ob.primary].a; };
  for (const key of D.bodies) {
    const b = IN.bodies[key], ob = b.orbit, pole = poleOf(key), th = pole ? E.angDeg(b.a, pole) : null, epsDeg = th === null ? null : Math.min(th, 180 - th), eps = epsDeg === null ? null : epsDeg * Math.PI / 180, lit = D.lit.precessionArcsecPerYear[key];
    let formula = null, formulaKind = null;
    if (ob && D.lit.J2[key] !== undefined) { formula = SC.precessionSolar({ n: ob.nLit, e: ob.ecc, s: b.sObs, J2: D.lit.J2[key], Cbar: b.moi, obliqRad: eps }); formulaKind = 'formulaSun'; }
    else if (ob && D.lit.J2[ob.primary] !== undefined && key !== 'moon') { formula = SC.nodeRateJ2({ n: ob.nLit, J2: D.lit.J2[ob.primary], Rref: D.lit.J2Ref[ob.primary], a: ob.sma }); formulaKind = 'nodeJ2'; }
    const litRate = lit === undefined ? null : SC.rateFromArcsecPerYear(lit), rate = litRate !== null ? litRate : formula, src = litRate !== null ? (D.lit.precessionRole[key] || 'lit') : formulaKind;
    const req = SC.requiredAngle(b.gDotA);
    const win = rate === null || eps === null ? null : D.windows.map((w) => { const wa = SC.windowAngles({ rate, T: w.seconds, epsRad: eps }); return { key: w.key, phase: wa.phase, displacement: wa.displacement, overRequired: req ? wa.displacement / req : null }; });
    rows.push({ key, cls: b.cls, pole: pole === null ? null : (ob.primary === 'sun' ? 'orbitNormal' : (key === 'moon' ? 'eclipticPole' : 'parentAxis')), epsDeg, obliqDeg: ob ? ob.obliqDeg : null, rateLit: litRate, rateFormula: formula, formulaKind, rate, rateSource: src, periodYears: rate ? 2 * Math.PI / rate / YEAR : null, arcsecPerYear: rate ? SC.arcsecPerYear(rate) : null,
      requiredAngle: req, windows: win });
  }
  // 位相の模型の期間(第329便a —— 模型の計算・窓の行とは別)の金星の行
  const v = rows.find((q) => q.key === 'venus'), span = Nn.A.phaseModel.spanYears * YEAR, wa = SC.windowAngles({ rate: v.rate, T: span, epsRad: v.epsDeg * Math.PI / 180 });
  return { rows, phaseModelRow: { key: 'venus', spanYears: Nn.A.phaseModel.spanYears, phase: wa.phase, phaseOver2Pi: wa.phase / (2 * Math.PI), displacement: wa.displacement, overRequired: v.requiredAngle ? wa.displacement / v.requiredAngle : null,
    note: '位相の模型は軌道・軸・供給を固定した模型の計算(現実のその期間で歳差が無視できることの確認ではない)' } };
}

/* ───────── まとめる ───────── */
export function runAll(HP) {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const IN = partI(HP); mark('I');
  const Cc = partC(IN); mark('C');
  const Ee = partE(IN); mark('E');
  const Vv = partV(IN); mark('V');
  const Nn = partN(HP); mark('N');
  const Hh = partH(IN); mark('H');
  const Ww = partW(IN, Nn); mark('W');
  const Gg = partG(IN, Ww); mark('G');
  // 第329便a の表との照合(同じ組・同じ射影〔同じ面〕・τ_0 の 2 枝・観測の自転・球の平均 p = 0 —— 由来ごとのトルクと熱)
  const I9 = W9.partI(HP), P9 = W9.partP(I9);
  let cmax = 0, ccount = 0;
  for (const key of [MER, 'venus', 'io', 'moon']) for (const tau of D.tau0) {
    const ours = Cc.rows.find((q) => q.key === key && q.form === 'ballMean' && q.tau === tau && q.proj === 'coplanar'), theirs = P9.si.find((q) => q.key === key && q.tau === tau && q.proj === 'coplanar' && q.col === 'obs');
    for (const o of theirs.origins) { const z = ours.origins.find((q) => q.key === o.key); cmax = Math.max(cmax, z ? E.relD(z.torqueAlong, o.torqueAlong) : Infinity, z ? E.relD(z.heat, o.heat) : Infinity); ccount++; }
    cmax = Math.max(cmax, E.relD(ours.along, theirs.torque));
  }
  const PS = SC.pureScenes(), PG = SC.pureGates(PS);
  const inputs = { units: IN.units, g: IN.g, Asun: IN.Asun, tauAge: LF.TAU_AGE, fOf: IN.fOf,
    bodies: Object.fromEntries(D.bodies.map((k) => { const q = IN.bodies[k]; return [k, { cls: q.cls, m: q.m, R: q.R, sBook: q.sBook, sObs: q.sObs, a: q.a, Rd: q.Rd, moi: q.moi, I: q.I, gDotA: q.gDotA, axisEngineAngDeg: q.axisEngineAngDeg,
      orbit: q.orbit ? { primary: q.orbit.primary, sma: q.orbit.sma, ecc: q.orbit.ecc, nBook: q.orbit.nBook, nLit: q.orbit.nLit, nHatDotA: q.orbit.nHatDotA, obliqDeg: q.orbit.obliqDeg, kBook: q.orbit.kBook, kObs: q.orbit.kObs, kBookProj: q.orbit.kBookProj } : null }]; })) };
  const J = { inputs, classTable: Cc, earthMars: Ee, venusSigns: Vv, an577: Nn, heat: Hh, geodetic: Gg, precession: Ww, consistency329a: { origins: ccount, maxRel: cmax }, pure: { scenes: PS, gates: PG }, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}
export function gatesOf(J) {
  const C = J.classTable, H = J.heat, V = J.venusSigns, N = J.an577, G = J.geodetic, Wp = J.precession, Em = J.earthMars;
  const tol = D.ledgerTol;
  return {
    pure: Object.values(J.pure.gates).every(Boolean),
    // 3 分類の表: 16 体 × 型 2 × τ_0 2 × 射影 2 の全部・由来ごとの熱 ≥ 0・帳簿(エネルギー・L・口の閉じ)が丸めの内・負の Γ なし
    classTable: C.rows.length === D.bodies.length * D.responseForms.length * D.tau0.length * 2 && C.rows.every((q) => q.heatMinOrigin >= 0 && q.ledgerRel <= tol && q.LRel <= tol && q.portClose <= tol
      && q.origins.every((z) => z.Gamma === null || z.Gamma >= 0)) && C.summary.length === D.responseForms.length * D.tau0.length,
    // 第329便a の表(4 組・同じ面・観測の自転・球の平均)と由来ごとのトルクと熱が相対 1e-12 の内
    consistency329a: J.consistency329a.origins > 0 && J.consistency329a.maxRel <= 1e-12,
    // 1 つの A: 太陽の A は全部の型で A_☉(f_☉ = 1)・行が全部ある
    singleA: Em.rows.length === D.responseForms.length * 2 * D.classes.noLock.length && Em.rows.filter((q) => q.key === 'sun' && q.col === 'book').every((q) => E.relD(q.galOnly.A, Em.Asun) <= 1e-12),
    // 金星の符号の表: 型 2 × τ_0 2 × 射影 2 × 熱潮汐 3・負の Γ なし・帳簿・熱 ≥ 0
    venusSigns: V.rows.length === 24 && V.rows.every((q) => q.negativeGamma === false && q.ledgerRel <= tol && q.heatMinOrigin >= 0),
    // AN577 の 2 列: A の最小と宣言を分ける(宣言 = 余裕 × 最小)・位相の模型の帳簿(パターンの枠 h/2 ≤ 1e-6)と h/h2 の判定・B の差と仕事の尺度
    an577: Math.abs(N.A.declaredN1 / N.A.requiredN1 - N.A.margin) <= 1e-12 && N.A.phaseModel.runs.length === 2 && N.A.phaseModel.runs.every((q) => q.converged && q.patternRelH2 <= 1e-6)
      && Number.isFinite(N.B.workGapScale) && N.B.workGapScale > 0 && N.B.deltaOmega !== 0,
    // 内部熱の帳簿: 全部の行で閉じた(宣言した範囲)・由来ごとの熱 ≥ 0(lib が拒否)・偏りの行は定常
    heatLedger: H.rows.length > 0 && H.allClosed && H.rows.filter((q) => q.variant === 'bias').every((q) => q.steady && q.Qbias === 0),
    // 測地の歳差: 水星の 1PN の近点の移動の式が paper/data の行と 1% の内(本の二体の a・e)・自転の釣り合いへの寄与 0
    geodetic: G.mercury.periRelToCsv <= 0.01 && G.rows.every((q) => q.alongContribution === 0 && q.geoRate > 0),
    // 歳差の窓: 角速度を宣言した天体は窓の角が有限・太陽は宣言しない(null)・位相の模型の行は別
    precession: Wp.rows.filter((q) => q.rate !== null).every((q) => q.windows && q.windows.every((w) => Number.isFinite(w.phase) && Number.isFinite(w.displacement))) && Wp.rows.find((q) => q.key === 'sun').rate === null
      && Number.isFinite(Wp.phaseModelRow.phase),
  };
}

/* ───────── 走らせる ───────── */
export async function main() {
  const TARGET = process.env.W330A_TARGET || 'beta/index.html';
  const OUT = process.env.W330A_OUT ? (path.isAbsolute(process.env.W330A_OUT) ? process.env.W330A_OUT : path.join(ROOT, process.env.W330A_OUT)) : path.join(ROOT, OUT_MAIN);
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now(), text = fs.readFileSync(html, 'utf8'), targetSha256 = crypto.createHash('sha256').update(text).digest('hex');
  const W281A_SCOPE = REGEN_SCOPE ? w281aScopeStamp(html, REGEN_SCOPE) : {};
  const { HP } = loadHtmlMain(html);
  console.log('第330便a spinclass(版 ' + HARNESS_VERSION + ')');
  const R = runAll(HP);
  const out = { version: HARNESS_VERSION, libVersion: SC.LIB_VERSION, w329aLibVersion: SB.LIB_VERSION, w329aHarnessVersion: W9.HARNESS_VERSION, w328bLibVersion: RB.LIB_VERSION, w327fLibVersion: LF.LIB_VERSION,
    w327aLibVersion: LS.LIB_VERSION, w326dLibVersion: E.LIB_VERSION, generator: 'tests/exp-w330a-spinclass.mjs', target: TARGET, targetSha256, reuseFrom: null,
    ruling: '原仮定者の整理(2026-11-08)・原仮定者の回答(2026-11-08 —— AN577 = C・AN578 = A と C を同じ表に・AN579 = A)・統括の検証項目 R307',
    decl: D, notClaim: NOT_CLAIM, invSqVersion: HP.REL_DRAG_INVSQ_VERSION || null, srcMomentVersion: HP.REL_DRAG_INVSQ_SRC_MOMENT_VERSION || null, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w330a-spinclass.mjs', 'tests/lib-w330a-spinclass.mjs', 'tests/exp-w329a-spinbias.mjs', 'tests/lib-w329a-spinbias.mjs', 'tests/lib-w328c-respower.mjs', 'tests/lib-w328b-response.mjs',
    'tests/lib-w328a-fieldcontract.mjs', 'tests/lib-w321c-galfield.mjs', 'tests/lib-w320c-nbcompose.mjs', 'tests/lib-w319b-srcradius.mjs', 'tests/lib-w327f-venustide.mjs', 'tests/exp-w327e-axialdiff.mjs', 'tests/lib-w327e-axialdiff.mjs', 'tests/lib-w327a-axialsum.mjs',
    'tests/exp-w326d-axialheat.mjs', 'tests/lib-w326d-axialheat.mjs', 'tests/lib-w319a-axisheat.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第330便a', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, stage: 'spinclass', engine: 'Node(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・1 プロセス)と純関数', notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();
