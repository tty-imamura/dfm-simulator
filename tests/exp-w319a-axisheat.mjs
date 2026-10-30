// 第319便a(原仮定者の指示(第121報)「軸引きずりが内部熱になる経路は、遠方宇宙に対して自転軸方向を保持するトルクとする —— この経路の実装を優先する」・
//   「観測値は基本的に釣り合っている状態とみなす —— 背景宇宙からの影響で駆動し、背景宇宙への熱放射で収支を成立させる」・「太陽の軸引きずりの影響が強い金星と木星は、
//   銀河の逆回転の引きずりとの拮抗で高い内部熱が発生していると仮定する」・「120° の角度差 —— これを軸引きずりを合成する際にも考慮する」・決断事項 AN447・AN468・AN469・
//   統括の検証項目 R258): **軸を保つトルクの熱の経路の器**(段 axisheat-319a —— 正本 tests/out/axisheat-w319a.json)。
//
// Node だけ(対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、validatePreset・coord3d.makeSim・build・step と読み口
//   inertialDrag3MaintStateOf・inertialDragIsqState・純関数 axisHoldSourceSum・axisHoldComposeJudge・inertialDrag3MaintCell をそのまま呼ぶ)。1 プロセス(子プロセスなし)。
//
// ■ 何をするか(在位の本の宣言は変えない —— 写しにだけ宣言を足す)
//   P 純関数の場面(等しい大きさの 120° の境界・大きさの比 0.1 の境界・反対で同じ大きさの 2 源・平行の駆動・口座の閉じ・源の分割の感度)
//   A 受理(compose・balance の正準形と拒否)
//   Q 同一(維持の型の写し: compose の省略と "sum"・balance の省略と "none" は読み口と状態がビット同一/合成と源ごとで状態がビット同一・源ごとの本の合成の 1 回の熱が
//     合成の本の熱とビット同一・源が 1 つの受け手は源ごと = 合成)
//   V・J・S16 在位の本の写し(🌋 venusSunInertial3d・🏀 jupiterSunInertial3d・🗺️ solarSystem16Inertial3d)に spinDrag(bevel —— 第318便d の 16 体の写しと同じ)・
//     銀河の一様軸引きずり(第318便d の写しと同じ型)・維持の型 + compose:"source"・balance:"background" を足して、受け手ごとに Ω_I・源ごとの ω・角・合成の判定・
//     源ごとと合成の 1 回の熱・供給・背景の駆動と放射(釣り合いの口座)を記録
//   TS 刻みの感度(🏀 の写し: {tauHold} の h と h/2 —— 同じ時間・"step" の h と h/2)
//   F 写しの外で源の大きさに倍率を掛けた 1 回の量(太陽の項 × 今の K1・上限 6.5e6 m・源の J・観測半径 / 銀河の項 × 宣言・無し・太陽の項と同じ大きさ)と、
//     木星の内部熱の主列(5.444 W/m²)と代替の列(7.485 W/m²)に要る τ_hold(混ぜない —— 要る大きさの記録)
// ■ 試走: W319A_QUICK=1(W319A_OUT が要る —— 正本を書かない・步を 2 に・🗺️ を外す)。W319A_WORKERS は受けるが使わない(1 プロセス)。
// ■ 言わないこと: 内部熱・金星の逆転を引きずりで説明したとは書かない・要る τ_hold を合わせた値・較正の値と呼ばない・金星の表面温度を内部熱の流束に置き換えない・
//   木星の主列と代替の列を混ぜない・銀河の大きさは尺度だけ(中心 1 体の値を銀河の引きずりと呼ばない)・刻みの差は感度診断(収束の判定に使わない)。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as L from './lib-w319a-axisheat.mjs';
// 第281便a の領域 hash の宣言(器と lib から deriveScope で引いた下限 —— roots の ctx・cw・HP.sim・HP.dfmMeshVelocityFieldAt は import した tests/lib-w280b-emgrid.mjs・
//   tests/lib-w279b-headless.mjs の綴りが数えられた分。presets は器が .find で引く在位の本 3 本だけ)
const REGEN_SCOPE = {"presets":["jupiterSunInertial3d","solarSystem16Inertial3d","venusSunInertial3d"],"roots":["HP.REL_DRAG_AXIS_HOLD_BALANCE_VERSION","HP.REL_DRAG_AXIS_HOLD_MAINT_VERSION","HP.REL_DRAG_AXIS_HOLD_SRC_VERSION","HP.allPresets","HP.axisHoldComposeJudge","HP.axisHoldSourceSum","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.inertialDrag3MaintCell","HP.inertialDrag3MaintStateOf","HP.inertialDragIsqState","HP.sim","HP.tideState","HP.validatePreset","ctx","cw"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w319a-axisheat-1';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (x) => JSON.parse(JSON.stringify(x));
const NOT_CLAIM = ['内部熱・金星の逆転を引きずりで説明したとは書かない', '要る τ_hold を合わせた値・較正の値と呼ばない(要る大きさの記録)', '金星の表面温度を内部熱の流束の値に置き換えない',
  '木星の内部熱の主列と代替の列を混ぜない', '銀河の大きさ ω_G = Ω_ref ĝ は尺度だけ(中心 1 体の値を銀河の引きずりと呼ばない)', '刻みの差を収束の判定に使わない(感度診断)', '固定の角 120° を閾値にしない'];
export const OUT_AXISHEAT = 'tests/out/axisheat-w319a.json';
export const BOOK_IDS = Object.freeze({ venus: 'venusSunInertial3d', jupiter: 'jupiterSunInertial3d', solar16: 'solarSystem16Inertial3d' });
export const PLAN = Object.freeze({ steps: L.DECL.steps, halfSteps: L.DECL.halfSteps, books: Object.freeze(['venus', 'jupiter', 'solar16']), minusBooks: Object.freeze(['solar16']) });
export const QUICK = Object.freeze({ steps: 2, halfSteps: 5, books: Object.freeze(['venus', 'jupiter']), minusBooks: Object.freeze(['jupiter']) });
const nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const relD = (a, b) => (a === b ? 0 : Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b)));

/* ───────── エンジンの口(器は loadHtmlMain の HP・QA は headless の HP から同じ形で渡す)───────── */
export function portsOf(HP) {
  return { HP, cell: HP.inertialDrag3MaintCell, sourceSum: HP.axisHoldSourceSum, judge: HP.axisHoldComposeJudge, maintOf: HP.inertialDrag3MaintStateOf, isqOf: HP.inertialDragIsqState, tideOf: HP.tideState };
}
/** 在位の本の写し(宣言は写しにだけ足す)。o.hold: axisHold・o.galaxy: galaxyAxial・o.initSpin: 観測の自転の分解 */
export function copyBook(HP, key, o = {}) {
  const b = clone(HP.allPresets().find((p) => p.id === BOOK_IDS[key]));
  b.id = BOOK_IDS[key] + '_w319a'; b.description = '器の写し(内蔵ではない —— 第319便a)';
  const sd = { rot: 'surfaceFlip', axial: 'on', axialModel: 'bevel' };
  if (o.hold) sd.axisHold = clone(o.hold);
  if (o.initSpin) sd.initSpin = 'observed';
  b.physics.relativeDrag = Object.assign(clone(b.physics.relativeDrag), { spinDrag: sd });
  if (o.galaxy) b.physics.relativeDrag.galaxyAxial = clone(o.galaxy);
  if (o.tide) {   // 2 体の本の惑星(添字 1)だけ明示潮汐(第309便b の写しと同じ規格化 —— τ_T = 4 公転・k2 = 1・内部熱は線形・冷却 1 公転)
    const tp = b.timeRef.pRef, sun = b.bodies[0], pl = b.bodies[1], G = b.physics.G, r0 = Math.hypot(pl.x - sun.x, pl.y - sun.y, pl.z - sun.z);
    const I = 0.4 * pl.m * pl.radius * pl.radius, tauT = 4 * tp;
    pl.tide = { k2: 1, lag: I * Math.pow(r0, 6) / (tauT * 3 * G * 1 * sun.m * sun.m * Math.pow(pl.radius, 5)) };
    b.physics.tide = { maxN: 4, inertia: 'sphere', heat: { model: 'linear', tau: tp } };
  }
  return b;
}
/** 受理して build(步は進めない) */
export function stateOf(E, book) {
  const v = E.HP.validatePreset(clone(book));
  if (!v.ok) return { ok: false, err: JSON.stringify(v.errors).slice(0, 300) };
  const S = E.HP.coord3d.makeSim(); S.build(clone(v.preset));
  return { ok: true, S, preset: v.preset, warnings: (v.warnings || []).length, isq: E.isqOf(S) };
}
/** 銀河の一様軸引きずりの宣言(第318便d の写しと同じ型 —— ω_G = Ω_ref ĝ・K1 の応答の係数 1)。sign −1 は −ĝ(向きの両方の列 —— どちらかを採ったのではない) */
export function galaxyDeclOf(E, key, sign = 1) {
  const st = stateOf(E, copyBook(E.HP, key)), ga = L.galaxyAxis(), U = L.unitsOf(st.preset.scaleExp);
  const Rref = st.isq.rdRule.bodies.find((q) => q.i === 0).Rd, mRef = st.S.m[0], w = ga.g.map((q) => sign * q * ga.OmRefSI * U.time);
  return { wx: w[0], wy: w[1], wz: w[2], rdPow: 1, refRadius: Rref, massPow: -1, refMass: mRef };
}
export const holdOf = (h0, o = {}) => Object.assign({ mode: 'maintain', reaction: 'background', heatTiming: { tauHold: h0 } }, o);
/** 写しを走らせる(履歴の步 1 つ + steps 步 —— 刻み h) */
export function runBook(E, book, h, steps) {
  const st = stateOf(E, book);
  if (!st.ok) return st;
  const S = st.S;
  S.step(h);   // 履歴の步(熱なし)
  for (let k = 0; k < steps; k++) S.step(h);
  return Object.assign(st, { m: E.maintOf(S), steps, h });
}
const ARRS = ['x', 'y', 'z', 'vx', 'vy', 'vz', 'spin', 'sax', 'say', 'saz', 'rotA'];
/** 状態のビット同一(配列と t) */
export function stateSame(Sa, Sb) {
  if (!Object.is(Sa.t, Sb.t) || Sa.n !== Sb.n) return false;
  for (const k of ARRS) { const a = Sa[k], b = Sb[k]; if (!a || !b) { if (a !== b) return false; continue; } for (let i = 0; i < Sa.n; i++) if (!Object.is(a[i], b[i])) return false; }
  return true;
}
const deepSame = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const withoutKeys = (o, ks) => { const c = Object.assign({}, o); for (const k of ks) delete c[k]; return c; };

/* ───────── P・A ───────── */
export function partP(E) { const P = L.pureScenes(E); return Object.assign(P, { gates: L.pureGates(P) }); }
export const ACCEPT_CASES = Object.freeze([
  { key: 'sum', hold: { mode: 'maintain', compose: 'sum' }, ok: true, has: [] },
  { key: 'source', hold: { mode: 'maintain', compose: 'source' }, ok: true, has: ['compose'] },
  { key: 'nullCompose', hold: { mode: 'maintain', compose: null }, ok: true, has: [] },
  { key: 'none', hold: { mode: 'maintain', balance: 'none' }, ok: true, has: [] },
  { key: 'balanceBg', hold: { mode: 'maintain', reaction: 'background', balance: 'background' }, ok: true, has: ['balance'] },
  { key: 'all', hold: { mode: 'maintain', reaction: 'background', compose: 'source', balance: 'background', heatTiming: { tauHold: 1 } }, ok: true, has: ['compose', 'balance'] },
  { key: 'balanceNoBg', hold: { mode: 'maintain', balance: 'background' }, ok: false, word: 'reaction' },
  { key: 'composeBad', hold: { mode: 'maintain', compose: 'pairs' }, ok: false, word: 'compose' },
  { key: 'composeNum', hold: { mode: 'maintain', compose: 1 }, ok: false, word: 'compose' },
  { key: 'balanceBad', hold: { mode: 'maintain', reaction: 'background', balance: 'radiate' }, ok: false, word: 'balance' },
  { key: 'driveCompose', hold: { tauC: 1, compose: 'source' }, ok: false, word: 'compose' },
]);
export function partA(E) {
  const rows = ACCEPT_CASES.map((c) => {
    const v = E.HP.validatePreset(copyBook(E.HP, 'jupiter', { hold: c.hold }));
    const ah = v.ok ? v.preset.physics.relativeDrag.spinDrag.axisHold : null, err = v.ok ? '' : JSON.stringify(v.errors);
    const keysOk = v.ok ? ['compose', 'balance'].every((k) => (c.has.indexOf(k) >= 0) === (ah[k] !== undefined)) : null;
    return { key: c.key, ok: v.ok, expect: c.ok, canon: ah, keysOk, wordInErr: v.ok ? null : err.indexOf(c.word) >= 0, pass: v.ok === c.ok && (v.ok ? keysOk : err.indexOf(c.word) >= 0) };
  });
  return { rows, pass: rows.every((r) => r.pass) };
}

/* ───────── Q 同一 ───────── */
export function partQ(E, plan) {
  const h0 = copyBook(E.HP, 'jupiter').physics.stepDt, gal = galaxyDeclOf(E, 'jupiter'), n = plan.steps;
  const run = (hold, g) => runBook(E, copyBook(E.HP, 'jupiter', { hold, galaxy: g }), h0, n);
  const a = run({ mode: 'maintain' }, gal), b = run({ mode: 'maintain', compose: 'sum', balance: 'none' }, gal);
  const sum = run(holdOf(h0), gal), src = run(holdOf(h0, { compose: 'source', balance: 'background' }), gal), src0 = run(holdOf(h0, { compose: 'source' }), null), sum0 = run(holdOf(h0), null);
  const omit = { declSame: deepSame(a.preset.physics.relativeDrag.spinDrag.axisHold, b.preset.physics.relativeDrag.spinDrag.axisHold), readSame: deepSame(a.m, b.m), stateSame: stateSame(a.S, b.S) };
  const strip = (m) => withoutKeys(m, ['source', 'balance']);
  const recvC = src.m.source.receivers.map((r) => r.heatComposite), recvS = sum.m.heat.perBody;
  const modes = { stateSame: stateSame(sum.S, src.S), compositeTotalSame: Object.is(src.m.source.heat.composite, sum.m.heat.total),
    compositePerBodySame: recvC.every((q, k) => Object.is(q, recvS[src.m.source.receivers[k].i])), sumResMax: src.m.source.sumResMax,
    fieldLSame: deepSame(strip(src.m).field, strip(sum.m).field), heatSource: src.m.source.heat.source, heatComposite: src.m.source.heat.composite };
  const one = { perBodySame: src0.m.source.receivers.every((r) => Object.is(r.heatSource, r.heatComposite)), totalSame: Object.is(src0.m.heat.total, sum0.m.heat.total), stateSame: stateSame(src0.S, sum0.S) };
  const bal = src.m.balance, closeRel = Math.abs(bal.residual) / Math.max(Math.abs(bal.drive), Math.abs(bal.fromField), Math.abs(bal.radiation), 1e-300);
  // 明示潮汐の内部熱の受け手(木星): 源ごとの熱は E_i へ(潮汐の入力とは別の積算 maintainInput)・釣り合いの口座の放射に二重に数えない
  const td = runBook(E, copyBook(E.HP, 'jupiter', { hold: holdOf(h0, { compose: 'source', balance: 'background' }), galaxy: gal, tide: true }), h0, n);
  const ih = td.ok ? E.tideOf(td.S).internalHeat : null, kT = ih ? ih.receivers.indexOf(1) : -1, tb = td.ok ? td.m.balance : null;
  const tide = td.ok ? { toInternal: tb.toInternal, radiation: tb.radiation, heatTotal: td.m.heat.total, maintainInput: kT >= 0 ? ih.maintainInput[kT] : null, sink: td.m.heat.sink,
    splitSame: Object.is(tb.radiation + tb.toInternal, td.m.heat.total) || relD(tb.radiation + tb.toInternal, td.m.heat.total) <= 1e-15,
    inputSame: kT >= 0 && Object.is(ih.maintainInput[kT], tb.toInternal), closeRel: Math.abs(tb.residual) / Math.max(Math.abs(tb.drive), Math.abs(tb.fromField), Math.abs(tb.radiation), 1e-300) } : { ok: false, err: td.err };
  return { omit, modes, one, balance: { drive: bal.drive, driveSpeed: bal.driveSpeed, driveAxis: bal.driveAxis, fromField: bal.fromField, radiation: bal.radiation, toInternal: bal.toInternal, closeRel }, tide,
    pass: omit.declSame && omit.readSame && omit.stateSame && modes.stateSame && modes.compositeTotalSame && modes.compositePerBodySame && modes.sumResMax === 0 && one.perBodySame && one.totalSame && one.stateSame && closeRel <= 1e-12
      && !!tide.splitSame && !!tide.inputSame && tide.toInternal > 0 && tide.closeRel <= 1e-12 };
}

/* ───────── V・J・S16 の写し ───────── */
function srcRowOf(q, U) {
  if (!q) return null;
  return { src: q.src, mag: q.mag * U.W, angleDeg: q.angleDeg, ratio: q.ratio, thresholdDeg: q.thresholdDeg, decel: q.decel, decelJudge: q.decelJudge, decelByAngle: q.decelByAngle,
    Eax: q.Eax * U.E, Esp: q.Esp * U.E, heat: q.heat * U.E };
}
/** 受け手ごとの行(SI)。sunIdx: 太陽の添字(0) */
export function receiverRows(E, R, names) {
  const U = L.unitsOf(R.preset.scaleExp), h0 = R.h * U.time, src = R.m.source;
  return src.receivers.map((r) => {
    const sun = r.sources.find((q) => q.src === 0) || null, gal = r.sources.find((q) => typeof q.src === 'string') || null;   // 源の名の文字列は銀河の項だけ
    const bodies = r.sources.filter((q) => typeof q.src !== 'string');
    const dom = bodies.reduce((m, q) => (!m || q.mag > m.mag) ? q : m, null);
    const sg = (sun && gal) ? { sunPlusGalaxy: L.composeRef(sun.omega, gal.omega), galaxyPlusSun: L.composeRef(gal.omega, sun.omega), angleDeg: L.angDeg(sun.omega, gal.omega), magRatio: sun.mag / gal.mag } : null;
    const evS = r.last.source.heat * U.E, evC = r.last.composite.heat * U.E;
    // 読みの候補 (b)(今の帳簿ではない —— 比較の欄): 減速の分 abs(E_speed) も受け手で散逸して熱へ(背景の駆動 = 放射)。源ごと Σ_s (E_axis^cost,s + abs(E_speed,s))・合成 E_axis^cost + abs(E_speed)
    const evSB = r.sources.reduce((a, q) => a + q.Eax + Math.abs(q.Esp), 0) * U.E, evCB = (r.last.composite.Eax + Math.abs(r.last.composite.Esp)) * U.E;
    return { i: r.i, name: names ? names[r.i] : null, role: (names && L.DECL.roles[names[r.i]]) || null, I: r.inertia * U.I, Om: nrm(r.omegaI) * U.W,
      sun: srcRowOf(sun, U), galaxy: srcRowOf(gal, U), dominant: dom ? { src: dom.src, mag: dom.mag * U.W } : null, sunGalaxy: sg,
      eventSource: evS, eventComposite: evC, eventDiff: evS - evC, powerSourceAtH0: evS / h0, powerCompositeAtH0: evC / h0,
      eventSourceB: evSB, eventCompositeB: evCB, eventDiffB: evSB - evCB,
      supplyEvent: (r.sources.reduce((s, q) => s + Math.max(-q.Esp, 0), 0)) * U.E, axisCostEvent: r.last.source.Eax * U.E,
      cumSource: r.heatSource * U.E, cumComposite: r.heatComposite * U.E };
  });
}
export function partBook(E, key, plan, sign = 1) {
  const b0 = copyBook(E.HP, key), h0 = b0.physics.stepDt, gal = galaxyDeclOf(E, key, sign);
  const R = runBook(E, copyBook(E.HP, key, { hold: holdOf(h0, { compose: 'source', balance: 'background' }), galaxy: gal }), h0, plan.steps);
  if (!R.ok) return { ok: false, err: R.err };
  const U = L.unitsOf(R.preset.scaleExp), names = (key === 'solar16') ? L.BODY16 : ['太陽', key === 'venus' ? '金星' : '木星'];
  const bal = R.m.balance;
  return { ok: true, id: BOOK_IDS[key], galaxySign: sign, n: R.S.n, h0: h0 * U.time, steps: plan.steps, warnings: R.warnings, galaxy: gal, units: clone(R.preset.scaleExp),
    source: { cells: R.m.source.cells, decelCells: R.m.source.decelCells, offSteps: R.m.source.offSteps, sumResMax: R.m.source.sumResMax,
      heatSource: R.m.source.heat.source * U.E, heatComposite: R.m.source.heat.composite * U.E },
    balance: { drive: bal.drive * U.E, driveSpeed: bal.driveSpeed * U.E, driveAxis: bal.driveAxis * U.E, fromField: bal.fromField * U.E, radiation: bal.radiation * U.E, toInternal: bal.toInternal * U.E,
      closeRel: Math.abs(bal.residual) / Math.max(Math.abs(bal.drive), Math.abs(bal.fromField), Math.abs(bal.radiation), 1e-300) },
    rows: receiverRows(E, R, names), _R: R };
}

/* ───────── TS 刻みの感度(🏀) ───────── */
export function partT(E, plan) {
  const b0 = copyBook(E.HP, 'jupiter'), h0 = b0.physics.stepDt, gal = galaxyDeclOf(E, 'jupiter'), U = L.unitsOf(b0.scaleExp);
  const runH = (hold, h, n) => runBook(E, copyBook(E.HP, 'jupiter', { hold, galaxy: gal }), h, n);
  // 同じ時間((1 + steps) × h0 —— 履歴の步を含む)を h と h/2 で(h/2 は 1 + halfSteps = 2(1 + steps) 步)
  const tH = runH(holdOf(h0, { compose: 'source' }), h0, plan.steps), tH2 = runH(holdOf(h0, { compose: 'source' }), h0 / 2, plan.halfSteps);
  const sH = runH({ mode: 'maintain', compose: 'source' }, h0, plan.steps), sH2 = runH({ mode: 'maintain', compose: 'source' }, h0 / 2, plan.halfSteps);
  const q = (R) => R.m.heat.total * U.E;
  return { tauHold: { h: q(tH), h2: q(tH2), rel: relD(q(tH), q(tH2)) }, step: { h: q(sH), h2: q(sH2), ratio: q(sH2) / q(sH) },
    note: '刻みの感度診断(収束の判定ではない)。{tauHold} は 1 步の量 × h/τ_hold(同じ時間で刻みに依らない)・"step" は 1 步ごとに 1 回(h/2 で同じ時間の熱が約 2 倍)' };
}

/* ───────── F 写しの外の倍率 ───────── */
/** 受け手 i の源の列(写しの直近の步の ω —— 本の単位)と I・s0・軸 */
function recOf(R, i) {
  const r = R.m.source.receivers.find((q) => q.i === i), S = R.S;
  const sources = r.sources.map((q) => ({ key: q.src === 0 ? 'sun' : typeof q.src === 'string' ? 'gal' : 'b' + q.src, omega: q.omega, sigma: 0 }));
  return { I: r.inertia, s0: S.spin[i], ax: [S.sax[i], S.say[i], S.saz[i]], flat: !S.saOn[i], sources, sunMag: (r.sources.find((q) => q.src === 0) || { mag: 0 }).mag, galMag: (r.sources.find((q) => typeof q.src === 'string') || { mag: 0 }).mag };
}
export function partF(E, books) {
  const out = { factors: {}, rows: [], Preq: null, PreqAlt: null };
  const jb = books.solar16 && books.solar16.ok ? books.solar16 : null;
  // 木星の要る電力(文献の値の熱流 × 4πR² —— 16 体の入力の木星の半径・2 体の本は同じ P_req を読む: 第318便d の主列と同じ数)
  const R16 = jb ? jb._R : null, Rj = R16 ? R16.S.R[6] * L.unitsOf(R16.preset.scaleExp).len : 69911308.58659744;
  out.RjM = Rj; out.Preq = L.powerOf(L.LIT.jupiterFlux.value, Rj); out.PreqAlt = L.powerOf(L.LIT.jupiterFluxAlt.value, Rj);
  const targets = [['jupiter', 1, '木星(🏀 の写し)'], ['venus', 1, '金星(🌋 の写し)']];
  if (jb) targets.push(['solar16', 6, '木星(🗺️ の写し)'], ['solar16', 2, '金星(🗺️ の写し)']);
  for (const [key, i, ja] of targets) {
    const B = books[key]; if (!B || !B.ok) continue;
    const R = B._R, U = L.unitsOf(R.preset.scaleExp), rec = recOf(R, i);
    const st = stateOf(E, copyBook(E.HP, key)), RdSun = st.isq.rdRule.bodies.find((q) => q.i === 0).Rd * U.len, RSun = R.S.R[0] * U.len;
    const fac = L.sunFactorsOf(RdSun, RSun); out.factors[key] = Object.assign({ RdSunM: RdSun, RSunM: RSun }, fac);
    const tauRange = [1e-30 * U.time, 1e30 * U.time], isJup = (ja.indexOf('木星') === 0), h0 = R.h * U.time;
    for (const fk of L.DECL.sunFactors) for (const gk of L.DECL.galaxyCands) {
      const k = fac[fk], kg = L.galaxyMulOf(gk, rec.galMag * U.W, rec.sunMag * k * U.W);
      const mul = {}; for (const q of rec.sources) mul[q.key] = 1; mul.sun = k; mul.gal = kg;
      const z = L.rescaled(E, rec, mul), ev = z.heat * U.E, evC = z.composite.heat * U.E;
      const row = { book: B.id, i, ja, factor: fk, factorJa: L.FACTOR_JA[fk], k, galaxy: gk, galaxyJa: L.GALAXY_JA[gk], kGalaxy: kg, sunMag: rec.sunMag * k * U.W, galMag: Math.abs(rec.galMag * kg * U.W),
        eventSource: ev, eventComposite: evC, eventDiff: (z.heat - z.composite.heat) * U.E, supplyEvent: z.supply * U.E, decelSources: z.decel, cells: z.cells,
        eventSourceB: (z.axisCost + z.speedPos + z.supply) * U.E, eventCompositeB: (z.composite.axisCost + Math.abs(z.composite.speed)) * U.E };
      if (isJup) {
        const inR = (t) => t >= tauRange[0] && t <= tauRange[1];
        row.tauReq = ev / out.Preq; row.tauReqAlt = ev / out.PreqAlt; row.tauReqInRange = inR(row.tauReq); row.tauReqAltInRange = inR(row.tauReqAlt);
        row.tauReqB = row.eventSourceB / out.Preq; row.tauReqBAlt = row.eventSourceB / out.PreqAlt; row.tauReqBInRange = inR(row.tauReqB);
        row.ratioBAtH0 = row.eventSourceB / h0 / out.Preq;   // (b) の読みで τ_hold = h₀ の電力と主列の比(第319便b の「要る大きさとの比」と同じ型)
      }
      out.rows.push(row);
    }
  }
  return out;
}

/* ───────── 門・実行 ───────── */
export function gatesOf(J) {
  const G = {};
  G.pure = !!(J.P && Object.values(J.P.gates).every(Boolean));
  G.accept = !!(J.A && J.A.pass);
  G.same = !!(J.Q && J.Q.pass);
  for (const k of Object.keys(J.books)) G['book_' + k] = !!(J.books[k].ok && J.books[k].source.offSteps === 0 && J.books[k].source.sumResMax === 0 && J.books[k].balance.closeRel <= 1e-12);
  G.tStep = !!(J.TS && Number.isFinite(J.TS.tauHold.rel) && Number.isFinite(J.TS.step.ratio));
  G.factors = !!(J.F && J.F.rows.length > 0 && J.F.rows.every((r) => Number.isFinite(r.eventSource) && Number.isFinite(r.eventComposite)));
  return G;
}
export async function runAxisHeat(E, o) {
  const P = o.plan, t = {}; let t0 = Date.now();
  const tick = (k) => { t[k] = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now(); };
  const J = { stage: 'axisheat', quick: !!o.quick, plan: clone(P), decl: clone(L.DECL), lit: clone(L.LIT) };
  J.P = partP(E); tick('P');
  J.A = partA(E); tick('A');
  J.Q = partQ(E, P); tick('Q');
  const books = {};
  for (const k of P.books) { books[k] = partBook(E, k, P); tick('book_' + k); }
  for (const k of (P.minusBooks || [])) { books[k + 'Minus'] = partBook(E, k, P, -1); tick('book_' + k + 'Minus'); }   // 銀河の項の向き −ĝ の写し(+ĝ と並べる —— どちらかを採ったのではない)
  J.TS = partT(E, P); tick('TS');
  J.F = partF(E, books); tick('F');
  J.books = {}; for (const [k, v] of Object.entries(books)) { const c = Object.assign({}, v); delete c._R; J.books[k] = c; }
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean); J.timing = t;
  return J;
}
export async function main() {
  const TARGET = process.env.W319A_TARGET || 'beta/index.html', quick = process.env.W319A_QUICK === '1';
  const OUT = process.env.W319A_OUT ? (path.isAbsolute(process.env.W319A_OUT) ? process.env.W319A_OUT : path.join(ROOT, process.env.W319A_OUT)) : path.join(ROOT, OUT_AXISHEAT);
  if (quick && !process.env.W319A_OUT) throw new Error('試走(W319A_QUICK=1)は W319A_OUT を指定する(正本を書かない)');
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now(), targetSha256 = crypto.createHash('sha256').update(fs.readFileSync(html)).digest('hex');
  const W281A_SCOPE = REGEN_SCOPE ? w281aScopeStamp(html, REGEN_SCOPE) : {};
  const { HP } = loadHtmlMain(html), E = portsOf(HP);
  console.log('第319便a axisheat: ' + (quick ? '試走' : '正本') + '・1 プロセス');
  const R = await runAxisHeat(E, { quick, plan: quick ? QUICK : PLAN });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w319a-axisheat.mjs', target: TARGET, targetSha256, reuseFrom: null,
    ruling: '原仮定者の指示(第121報)「軸引きずりが内部熱になる経路は、遠方宇宙に対して自転軸方向を保持するトルクとする —— この経路の実装を優先する」・「観測値は釣り合い —— 背景宇宙からの影響で駆動し、'
      + '背景宇宙への熱放射で収支を成立させる」・「金星と木星は太陽の軸引きずりと銀河の逆回転の引きずりの拮抗で高い内部熱と仮定する」・「120° の合成を軸引きずりの合成で考慮する」・決断事項 AN447・AN468・AN469・統括の検証項目 R258。'
      + '維持の型の opt-in(compose・balance)を在位の本の写しで測る(在位の本の宣言は変えない)',
    srcVersion: HP.REL_DRAG_AXIS_HOLD_SRC_VERSION || null, balanceVersion: HP.REL_DRAG_AXIS_HOLD_BALANCE_VERSION || null, maintVersion: HP.REL_DRAG_AXIS_HOLD_MAINT_VERSION || null, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w319a-axisheat.mjs', 'tests/lib-w319a-axisheat.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第319便a', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, stage: 'axisheat',
    engine: 'Node(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・1 プロセス)',
    literature: Object.values(L.LIT).map((z) => z.name + ' = ' + z.value + ' ' + z.unit + '(本便は一次資料に当たっていない)'),
    notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();
