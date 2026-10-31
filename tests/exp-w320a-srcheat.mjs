// 第320便a(原仮定者の回答(2026-10-30 —— AN475)「減速させる側の引きずりを背景宇宙が補う分も熱に数える」・原仮定者の裁定(第122報)AN471「案3(J)を確かめる。
//   案2bは次点。様々な可能性を探索する」・決断事項 AN471・AN474・AN475・統括の検証項目 R262): **読み (b) と源のモーメントの半径 R_src の器**
//   (段 srcheat-320a —— 正本 tests/out/srcheat-w320a.json)。
//
// Node だけ(対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、validatePreset・coord3d.makeSim・build・step と読み口
//   inertialDrag3MaintStateOf・inertialDragIsqState〔perSource の選択〕・純関数 axisHoldSourceSum〔(b) の印〕・inertialDrag3MaintCell・inertialDragIsqM1・inertialDragIsqM1Src・
//   inertialDragIsqSrcRadiusOf をそのまま呼ぶ)。入力は html と第319便b の正本 tests/out/srcradius-w319b.json(比較の照合の数だけ)。1 プロセス(子プロセスなし)。
//
// ■ 何をするか(在位の本の宣言は変えない —— 写しにだけ宣言を足す)
//   P 純関数の場面((b) の源ごとの熱・逆平行の減速・口座の閉じ・印の有無・受け手の慣性係数の比例・M1Src の外部の同一と r = R の連続と内部の求積・R_src の式)
//   A 受理(invSq.sourceMoment の正準形と拒否・balance の版)
//   Q 同一((b) の本の contract319 = balance を宣言しない写しの値〔ビット同一〕・状態の同一・(b) の合成 = (b) の compose:"sum"・源が 1 つは源ごと = 合成・閉じ・
//     源のモーメントの宣言で β・R_d が同じビット・回転の係数と軸の ω の比 = (R_src/R_d)²・宣言の無い写しに新しい欄と鍵が無い)
//   B 🌋 venusSunInertial3d・🏀 jupiterSunInertial3d・🗺️ solarSystem16Inertial3d の写し × 源のモーメントの種類(今・J〔太陽だけ / 8 天体〕・obs・capObs)× 銀河の項 ±ĝ に
//     維持の型 + compose:"source"・balance:"background"(読み (b))を足して、受け手ごとの源ごとの熱・第319便a の契約の熱・供給・釣り合いの口座
//   R 🗺️ の 6 天体(水星〜土星)の役割の表(初期の状態の読み口 —— 太陽の項の abs(ω_☉)・角・公転面の角速度・要る大きさとの比)と第319便b の写しの外の式の数との照合
//   F 木星の 1 回の量((b) の源ごと —— 太陽の項・銀河の項 ±ĝ・無し)と主列・代替の列に要る τ_hold・τ_hold = h₀ の比(受け手の慣性係数の 2 列 —— 比例で動く)
//   TS 刻みの感度(🏀 の J + (b) の写し: {tauHold} の h と h/2 —— 同じ時間・"step" の h と h/2)
// ■ 試走: W320A_QUICK=1(W320A_OUT が要る —— 正本を書かない・步を 2 に・🗺️ の −ĝ と obs/capObs を外す)。W320A_WORKERS は受けるが使わない(1 プロセス)。
// ■ 言わないこと: 内部熱・金星の逆転・公転面を引きずりで説明したとは書かない・要る τ_hold を合わせた値・較正の値と呼ばない・金星の表面温度を内部熱の流束に置き換えない・
//   木星の主列と代替の列を混ぜない・源の f と受け手の f は別の宣言・一つの案でそろうとは書かない・銀河の大きさは尺度だけ・刻みの差は感度診断。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as L from './lib-w320a-srcheat.mjs';
// 第281便a の領域 hash の宣言(器と lib から deriveScope で引いた下限 —— roots の ctx・cw・HP.sim・HP.dfmMeshVelocityFieldAt は import した tests/lib-w280b-emgrid.mjs・
//   tests/lib-w279b-headless.mjs の綴りが数えられた分。presets は器が .find で引く在位の本 3 本だけ)
const REGEN_SCOPE = {"presets":["jupiterSunInertial3d","solarSystem16Inertial3d","venusSunInertial3d"],"roots":["HP.REL_DRAG_AXIS_HOLD_BALANCE_VERSION","HP.REL_DRAG_AXIS_HOLD_BALANCE_VERSION_319","HP.REL_DRAG_AXIS_HOLD_MAINT_VERSION","HP.REL_DRAG_AXIS_HOLD_SRC_VERSION","HP.REL_DRAG_INVSQ_SRC_MOMENT_VERSION","HP.allPresets","HP.axisHoldSourceSum","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.inertialDrag3MaintCell","HP.inertialDrag3MaintStateOf","HP.inertialDragIsqM1","HP.inertialDragIsqM1Src","HP.inertialDragIsqSrcRadiusOf","HP.inertialDragIsqState","HP.sim","HP.tideState","HP.validatePreset","ctx","cw","inertialDragIsqM1"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w320a-srcheat-1';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (x) => JSON.parse(JSON.stringify(x));
const NOT_CLAIM = ['内部熱・金星の逆転・公転面を引きずりで説明したとは書かない', '要る τ_hold を合わせた値・較正の値と呼ばない(要る大きさの記録)', '金星の表面温度を内部熱の流束の値に置き換えない',
  '木星の内部熱の主列と代替の列を混ぜない', '源の慣性係数 f と受け手の慣性係数は別の宣言', '一つの案で公転面・金星・木星がそろうとは書かない', '銀河の大きさ ω_G = Ω_ref ĝ は尺度だけ(中心 1 体の値を銀河の引きずりと呼ばない)',
  '刻みの差を収束の判定に使わない(感度診断)'];
export const OUT_SRCHEAT = 'tests/out/srcheat-w320a.json';
export const IN_319B = 'tests/out/srcradius-w319b.json';
export const BOOK_IDS = Object.freeze({ venus: 'venusSunInertial3d', jupiter: 'jupiterSunInertial3d', solar16: 'solarSystem16Inertial3d' });
export const PLAN = Object.freeze({ steps: L.DECL.steps, halfSteps: L.DECL.halfSteps, books: Object.freeze(['venus', 'jupiter', 'solar16']), kinds: L.DECL.kinds, signs: Object.freeze([1, -1]) });
export const QUICK = Object.freeze({ steps: 2, halfSteps: 5, books: Object.freeze(['venus', 'jupiter']), kinds: Object.freeze(['now', 'Jsun', 'J']), signs: Object.freeze([1]) });
const KINDS_2BODY = Object.freeze(['now', 'Jsun', 'J', 'obs', 'capObs']);   // 2 体の本は J16 を外す(J と同じ宣言)
const nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const relD = (a, b) => (a === b ? 0 : Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b)));

/* ───────── エンジンの口 ───────── */
export function portsOf(HP) {
  return { HP, cell: HP.inertialDrag3MaintCell, sourceSum: HP.axisHoldSourceSum, maintOf: HP.inertialDrag3MaintStateOf, isqOf: HP.inertialDragIsqState, tideOf: HP.tideState,
    m1: HP.inertialDragIsqM1, m1src: HP.inertialDragIsqM1Src, rsrc: HP.inertialDragIsqSrcRadiusOf };
}
/** 在位の本の写し(宣言は写しにだけ足す)。o.hold: axisHold・o.galaxy: galaxyAxial・o.sm: invSq.sourceMoment・o.tide: 明示潮汐(2 体の本の惑星) */
export function copyBook(HP, key, o = {}) {
  const b = clone(HP.allPresets().find((p) => p.id === BOOK_IDS[key]));
  b.id = BOOK_IDS[key] + '_w320a'; b.description = '器の写し(内蔵ではない —— 第320便a)';
  const sd = { rot: 'surfaceFlip', axial: 'on', axialModel: 'bevel' };
  if (o.hold) sd.axisHold = clone(o.hold);
  b.physics.relativeDrag = Object.assign(clone(b.physics.relativeDrag), { spinDrag: sd });
  if (o.galaxy) b.physics.relativeDrag.galaxyAxial = clone(o.galaxy);
  if (o.sm) b.physics.relativeDrag.invSq = Object.assign(clone(b.physics.relativeDrag.invSq), { sourceMoment: clone(o.sm) });
  if (o.tide) {   // 2 体の本の惑星(添字 1)だけ明示潮汐(第319便a の写しと同じ規格化 —— τ_T = 4 公転・k2 = 1・内部熱は線形・冷却 1 公転)
    const tp = b.timeRef.pRef, sun = b.bodies[0], pl = b.bodies[1], G = b.physics.G, r0 = Math.hypot(pl.x - sun.x, pl.y - sun.y, pl.z - sun.z);
    const I = 0.4 * pl.m * pl.radius * pl.radius, tauT = 4 * tp;
    pl.tide = { k2: 1, lag: I * Math.pow(r0, 6) / (tauT * 3 * G * 1 * sun.m * sun.m * Math.pow(pl.radius, 5)) };
    b.physics.tide = { maxN: 4, inertia: 'sphere', heat: { model: 'linear', tau: tp } };
  }
  return b;
}
/** 受理して build(步は進めない)。isq は初期の状態の読み口(perSource —— 源ごとの軸の ω) */
export function stateOf(E, book) {
  const v = E.HP.validatePreset(clone(book));
  if (!v.ok) return { ok: false, err: JSON.stringify(v.errors).slice(0, 300) };
  const S = E.HP.coord3d.makeSim(); S.build(clone(v.preset));
  return { ok: true, S, preset: v.preset, warnings: (v.warnings || []).length, isq: E.isqOf(S, { perSource: true }) };
}
/** 銀河の一様軸引きずりの宣言(第319便a の写しと同じ型 —— ω_G = ±Ω_ref ĝ・K1 の応答の係数 1) */
export function galaxyDeclOf(E, key, sign = 1) {
  const st = stateOf(E, copyBook(E.HP, key)), ga = L.galaxyAxis(), U = L.unitsOf(st.preset.scaleExp);
  const Rref = st.isq.rdRule.bodies.find((q) => q.i === 0).Rd, mRef = st.S.m[0], w = ga.g.map((q) => sign * q * ga.OmRefSI * U.time);
  return { wx: w[0], wy: w[1], wz: w[2], rdPow: 1, refRadius: Rref, massPow: -1, refMass: mRef };
}
export const holdOf = (h0, o = {}) => Object.assign({ mode: 'maintain', reaction: 'background', heatTiming: { tauHold: h0 } }, o);
export const HOLD_B = Object.freeze({ compose: 'source', balance: 'background' });
/** 写しを走らせる(履歴の步 1 つ + steps 步 —— 刻み h) */
export function runBook(E, book, h, steps) {
  const st = stateOf(E, book);
  if (!st.ok) return st;
  const S = st.S;
  S.step(h);
  for (let k = 0; k < steps; k++) S.step(h);
  return Object.assign(st, { m: E.maintOf(S), steps, h });
}
const ARRS = ['x', 'y', 'z', 'vx', 'vy', 'vz', 'spin', 'sax', 'say', 'saz', 'rotA'];
export function stateSame(Sa, Sb) {
  if (!Object.is(Sa.t, Sb.t) || Sa.n !== Sb.n) return false;
  for (const k of ARRS) { const a = Sa[k], b = Sb[k]; if (!a || !b) { if (a !== b) return false; continue; } for (let i = 0; i < Sa.n; i++) if (!Object.is(a[i], b[i])) return false; }
  return true;
}
const arrSame = (a, b) => a.length === b.length && a.every((q, k) => Object.is(q, b[k]));

/* ───────── P・A ───────── */
export function partP(E) { const P = L.pureScenesB(E); return Object.assign(P, { gates: L.pureGatesB(P) }); }
const F8 = { 0: 0.07, 1: 0.254 };
export const ACCEPT_CASES = Object.freeze([
  { key: 'J', sm: { kind: 'J', f: F8 }, ok: true },
  { key: 'Jall', sm: { kind: 'J', f: L.MOI16 }, ok: true, book: 'solar16' },
  { key: 'obs', sm: { kind: 'obs' }, ok: true },
  { key: 'capObs', sm: { kind: 'capObs' }, ok: true },
  { key: 'nullSm', sm: null, ok: true, absent: true },
  { key: 'fMax', sm: { kind: 'J', f: { 0: 2 / 3 } }, ok: true },
  { key: 'noF', sm: { kind: 'J' }, ok: false, word: 'sourceMoment' },
  { key: 'emptyF', sm: { kind: 'J', f: {} }, ok: false, word: 'sourceMoment' },
  { key: 'fZero', sm: { kind: 'J', f: { 0: 0 } }, ok: false, word: 'sourceMoment' },
  { key: 'fNeg', sm: { kind: 'J', f: { 0: -0.07 } }, ok: false, word: 'sourceMoment' },
  { key: 'fOver', sm: { kind: 'J', f: { 0: 0.7 } }, ok: false, word: 'sourceMoment' },
  { key: 'fKey', sm: { kind: 'J', f: { sun: 0.07 } }, ok: false, word: 'sourceMoment' },
  { key: 'fLead0', sm: { kind: 'J', f: { '01': 0.07 } }, ok: false, word: 'sourceMoment' },
  { key: 'fIndexOut', sm: { kind: 'J', f: { 5: 0.3 } }, ok: false, word: 'sourceMoment.f' },
  { key: 'obsWithF', sm: { kind: 'obs', f: { 0: 0.07 } }, ok: false, word: 'sourceMoment' },
  { key: 'kindBad', sm: { kind: 'k2near' }, ok: false, word: 'sourceMoment' },
  { key: 'kindNum', sm: { kind: 3 }, ok: false, word: 'sourceMoment' },
  { key: 'keyBad', sm: { kind: 'obs', radius: 1 }, ok: false, word: 'sourceMoment' },
  { key: 'string', sm: 'J', ok: false, word: 'sourceMoment' },
  { key: 'noSpinDrag', sm: { kind: 'obs' }, ok: false, word: 'spinDrag', noSpin: true },
  { key: 'k2Book', sm: { kind: 'obs' }, ok: false, word: 'kernel', k2: true },
  { key: 'noRdRule', sm: { kind: 'obs' }, ok: false, word: 'rdRule', noRule: true },
]);
export function partA(E) {
  const rows = ACCEPT_CASES.map((c) => {
    const b = copyBook(E.HP, c.book || 'jupiter', c.noSpin ? {} : { hold: { mode: 'maintain' } });
    if (c.noSpin) delete b.physics.relativeDrag.spinDrag;
    const iv = b.physics.relativeDrag.invSq;
    if (c.k2) { delete iv.kernel; delete iv.rdRule; }
    if (c.noRule) delete iv.rdRule;
    if (c.sm !== undefined) iv.sourceMoment = clone(c.sm);
    const v = E.HP.validatePreset(b);
    const canon = v.ok ? v.preset.physics.relativeDrag.invSq.sourceMoment : undefined, err = v.ok ? '' : JSON.stringify(v.errors);
    const canonOk = v.ok ? (c.absent ? canon === undefined : JSON.stringify(canon) === JSON.stringify(c.sm.f ? { kind: c.sm.kind, f: Object.fromEntries(Object.entries(c.sm.f)) } : { kind: c.sm.kind })) : null;
    return { key: c.key, ok: v.ok, expect: c.ok, canon: canon === undefined ? null : canon, canonOk, wordInErr: v.ok ? null : err.indexOf(c.word) >= 0,
      pass: v.ok === c.ok && (v.ok ? canonOk : err.indexOf(c.word) >= 0) };
  });
  // balance の版(受理の正準形は第319便a のまま —— 版は読み口の欄)
  const vb = E.HP.validatePreset(copyBook(E.HP, 'jupiter', { hold: { mode: 'maintain', reaction: 'background', balance: 'background' } }));
  const bal = { ok: vb.ok, canon: vb.ok ? vb.preset.physics.relativeDrag.spinDrag.axisHold : null, version: E.HP.REL_DRAG_AXIS_HOLD_BALANCE_VERSION, version319: E.HP.REL_DRAG_AXIS_HOLD_BALANCE_VERSION_319 };
  bal.pass = bal.ok && bal.canon.balance === 'background' && bal.version === 'w320a-axishold-balance-2' && bal.version319 === 'w319a-axishold-balance-1';
  return { rows, balance: bal, pass: rows.every((r) => r.pass) && bal.pass };
}

/* ───────── Q 同一 ───────── */
const newKeys = (S) => Object.keys(S).filter((k) => /MaintBg|^_rdMaintBg|^_rdIsqRs$/.test(k));
export function partQ(E, plan) {
  const h0 = copyBook(E.HP, 'jupiter').physics.stepDt, gal = L.galaxyAxis() && galaxyDeclOf(E, 'jupiter'), n = plan.steps;
  const run = (hold, g, sm, tide) => runBook(E, copyBook(E.HP, 'jupiter', { hold, galaxy: g, sm, tide }), h0, n);
  // ① (b) の本の contract319 = balance を宣言しない写し(同じ compose)の値
  const b = run(holdOf(h0, HOLD_B), gal), a = run(holdOf(h0, { compose: 'source' }), gal);
  const c3 = b.m.balance.contract319;
  const legacy = { heatSame: Object.is(c3.heat, a.m.heat.total), perBodySame: c3.perBody.every((q, k) => q === null ? a.m.heat.perBody[k] === 0 : Object.is(q, a.m.heat.perBody[k])), rateSame: Object.is(c3.rate, a.m.rate),
    fromFieldSame: Object.is(c3.fromField, a.m.speed.signed), stateSame: stateSame(a.S, b.S), heatB: b.m.heat.total, heat319: c3.heat, supply: b.m.speed.supply,
    plusSupplyRel: relD(b.m.heat.total, c3.heat + b.m.speed.supply), residual319Rel: Math.abs(c3.residual) / Math.max(Math.abs(b.m.balance.drive), Math.abs(c3.fromField), Math.abs(c3.radiation), 1e-300) };
  // ② 明示潮汐の受け手(木星): (b) の熱が E_i へ・contract319 の E_i へ = balance の無い写しの E_i へ
  const tb = run(holdOf(h0, HOLD_B), gal, null, true), ta = run(holdOf(h0, { compose: 'source' }), gal, null, true);
  const ihB = tb.ok ? E.tideOf(tb.S).internalHeat : null, kT = ihB ? ihB.receivers.indexOf(1) : -1;
  const tide = (tb.ok && ta.ok) ? { toInternalB: tb.m.balance.toInternal, toInternal319: tb.m.balance.contract319.toInternal, noBalToInternal: ta.m.heat.toInternal,
    inputSame: kT >= 0 && Object.is(ihB.maintainInput[kT], tb.m.balance.toInternal), legacySame: Object.is(tb.m.balance.contract319.toInternal, ta.m.heat.toInternal),
    splitRel: relD(tb.m.balance.radiation + tb.m.balance.toInternal, tb.m.heat.total), closeRel: Math.abs(tb.m.balance.residual) / Math.max(Math.abs(tb.m.balance.drive), Math.abs(tb.m.balance.radiation), 1e-300) } : { ok: false };
  // ③ (b) の合成 = (b) の compose:"sum"(同じ ω_D に 1 回)・源が 1 つ(銀河の無い写し)は源ごと = 合成
  const sB = run(holdOf(h0, { balance: 'background' }), gal), one = run(holdOf(h0, HOLD_B), null), oneS = run(holdOf(h0, { balance: 'background' }), null);
  const comp = { totalSame: Object.is(b.m.source.heat.composite, sB.m.heat.total), perBodySame: b.m.source.receivers.every((r) => Object.is(r.heatComposite, sB.m.heat.perBody[r.i])),
    oneSourceSame: one.m.source.receivers.every((r) => Object.is(r.heatSource, r.heatComposite)), oneTotalSame: Object.is(one.m.heat.total, oneS.m.heat.total) };
  // ④ 口座(読み (b)): field.E = −Σ max(E_speed, 0)・背景の流入 = 正の分・残差 E ≈ 0・閉じ
  const m = b.m, bal = m.balance, sc = Math.max(Math.abs(m.heat.total), 1e-300);
  const ledger = { fieldE: m.field.E, fieldExpect: -m.speed.pos, fieldSame: Object.is(m.field.E, -m.speed.pos), inflowSame: Object.is(m.background.inflowE, m.speed.pos),
    residualERel: Math.abs(m.residual.E) / sc, closeRel: Math.abs(bal.residual) / Math.max(Math.abs(bal.drive), Math.abs(bal.fromField), Math.abs(bal.radiation), 1e-300),
    perSourceSumRel: Math.max(...m.source.receivers.map((r) => { const s = r.sources.reduce((q, z) => q + z.heat, 0); return relD(s, r.last.source.heat); })),
    heatParts: { axisCost: m.heat.axisCost, speedPos: m.speed.pos, supply: m.speed.supply, total: m.heat.total }, partsRel: relD(m.heat.total, m.heat.axisCost + m.speed.pos + m.speed.supply) };
  // ⑤ 源のモーメント: β・R_d が同じビット・回転の係数と軸の ω の比 = (R_src/R_d)²(初期の状態の読み口)
  const s0 = stateOf(E, copyBook(E.HP, 'jupiter', { hold: { mode: 'maintain' } })), sm = {};
  for (const kind of ['Jsun', 'obs', 'capObs']) {
    const s1 = stateOf(E, copyBook(E.HP, 'jupiter', { hold: { mode: 'maintain' }, sm: L.sourceMomentOf(kind) }));
    if (!s1.ok) { sm[kind] = { ok: false, err: s1.err }; continue; }
    const r0 = s0.isq.receivers.find((q) => q.i === 1), r1 = s1.isq.receivers.find((q) => q.i === 1), mf = s1.isq.sourceMoment.bodies[0].momentFactor;
    // 回転の係数は節点ごとの同符号の和(比は丸めの内)・軸の ω は受け手の体積の近遠の差(節点の和の打ち消し —— R_d,i/r が小さい受け手では丸めの床が 1e-7 の桁)
    const rotR = nrm(r1.rot.slice(0, 3)) / nrm(r0.rot.slice(0, 3)), omR = nrm(r1.omega) / nrm(r0.omega);
    sm[kind] = { ok: true, betaSame: s0.isq.receivers.every((q, k) => arrSame(q.beta, s1.isq.receivers[k].beta)), rdSame: s0.isq.receivers.every((q, k) => Object.is(q.Rd, s1.isq.receivers[k].Rd)),
      momentFactor: mf, rotRatioRel: relD(rotR, mf), omegaRatioRel: relD(omR, mf), sunRsrc: s1.isq.sourceMoment.bodies[0].Rsrc, sunRobs: s1.isq.sourceMoment.bodies[0].Robs,
      planetApplied: s1.isq.sourceMoment.bodies[1].applied, inside: s1.isq.sourceMoment.inside.length };
  }
  // ⑥ 宣言の無い写し・balance の無い本に新しい欄と鍵が無い
  const u0 = runBook(E, copyBook(E.HP, 'jupiter'), h0, 2), u1 = run(holdOf(h0, { compose: 'source' }), gal);
  const absent = { keys: newKeys(u0.S).concat(newKeys(u1.S)), isqField: !!(u0.isq.sourceMoment || u1.isq.sourceMoment), balanceField: !!(u1.m.balance), readOmegaSrc: !!(E.isqOf(u0.S).receivers.find((q) => q.omegaSrc)) };
  const pass = legacy.heatSame && legacy.perBodySame && legacy.rateSame && legacy.fromFieldSame && legacy.stateSame && legacy.plusSupplyRel <= 1e-12 && legacy.residual319Rel <= 1e-12
    && tide.inputSame && tide.legacySame && tide.splitRel <= 1e-15 && tide.closeRel <= 1e-12 && tide.toInternalB > tide.toInternal319
    && comp.totalSame && comp.perBodySame && comp.oneSourceSame && comp.oneTotalSame
    && ledger.fieldSame && ledger.inflowSame && ledger.residualERel <= 1e-12 && ledger.closeRel <= 1e-12 && ledger.perSourceSumRel <= 1e-12 && ledger.partsRel <= 1e-12
    && Object.values(sm).every((z) => z.ok && z.betaSame && z.rdSame && z.rotRatioRel <= 1e-12 && z.omegaRatioRel <= 1e-5 && z.inside === 0) && sm.Jsun.planetApplied === false && sm.obs.planetApplied === true
    && absent.keys.length === 0 && !absent.isqField && !absent.balanceField && !absent.readOmegaSrc;
  return { legacy, tide, composite: comp, ledger, sourceMoment: sm, absent, pass };
}

/* ───────── B 写し ───────── */
function srcRowOf(q, U) {
  if (!q) return null;
  return { src: q.src, mag: q.mag * U.W, angleDeg: q.angleDeg, decel: q.decel, Eax: q.Eax * U.E, Esp: q.Esp * U.E, heat: q.heat * U.E, heat319: (q.Eax + Math.max(q.Esp, 0)) * U.E };
}
export function receiverRows(R, names) {
  const U = L.unitsOf(R.preset.scaleExp), src = R.m.source;
  return src.receivers.map((r) => {
    const sun = r.sources.find((q) => q.src === 0) || null, gal = r.sources.find((q) => typeof q.src === 'string') || null, bodies = r.sources.filter((q) => typeof q.src !== 'string');
    const evB = r.last.source.heat * U.E, ev319 = r.sources.reduce((a, q) => a + q.Eax + Math.max(q.Esp, 0), 0) * U.E, evNoGal = bodies.reduce((a, q) => a + q.heat, 0) * U.E;
    return { i: r.i, name: names ? names[r.i] : null, I: r.inertia * U.I, Om: nrm(r.omegaI) * U.W, sun: srcRowOf(sun, U), galaxy: srcRowOf(gal, U),
      eventB: evB, event319: ev319, eventNoGalaxyB: evNoGal, eventCompositeB: r.last.composite.heat * U.E, supplyEvent: r.sources.reduce((a, q) => a + Math.max(-q.Esp, 0), 0) * U.E,
      cumB: r.heatSource * U.E, cumCompositeB: r.heatComposite * U.E,
      topB: bodies.map((q) => ({ src: q.src, name: names ? names[q.src] : null, heatB: q.heat * U.E })).sort((a, b) => b.heatB - a.heatB).slice(0, 4) };   // 天体の源の (b) の 1 回の熱の大きい順 4 つ
  });
}
export function partBook(E, key, kind, sign, plan) {
  const h0 = copyBook(E.HP, key).physics.stepDt, gal = galaxyDeclOf(E, key, sign);
  const R = runBook(E, copyBook(E.HP, key, { hold: holdOf(h0, HOLD_B), galaxy: gal, sm: L.sourceMomentOf(kind, key) }), h0, plan.steps);
  if (!R.ok) return { ok: false, err: R.err };
  const U = L.unitsOf(R.preset.scaleExp), names = (key === 'solar16') ? L.BODY16 : ['太陽', key === 'venus' ? '金星' : '木星'], bal = R.m.balance, c3 = bal.contract319;
  const sm = R.isq.sourceMoment;
  return { ok: true, id: BOOK_IDS[key], kind, galaxySign: sign, n: R.S.n, h0: h0 * U.time, steps: plan.steps, warnings: R.warnings,
    sourceMoment: sm ? { kind: sm.kind, f: sm.f, applied: sm.bodies.filter((q) => q.applied).map((q) => ({ i: q.i, RsrcM: q.Rsrc * U.len, RobsM: q.Robs * U.len, RdM: q.Rd * U.len, momentFactor: q.momentFactor })), inside: sm.inside.length } : null,
    source: { cells: R.m.source.cells, decelCells: R.m.source.decelCells, offSteps: R.m.source.offSteps, sumResMax: R.m.source.sumResMax, heatSourceB: R.m.source.heat.source * U.E, heatCompositeB: R.m.source.heat.composite * U.E },
    balance: { version: bal.version, drive: bal.drive * U.E, driveSpeed: bal.driveSpeed * U.E, driveAxis: bal.driveAxis * U.E, fieldPos: bal.fieldPos * U.E, radiation: bal.radiation * U.E, toInternal: bal.toInternal * U.E,
      closeRel: Math.abs(bal.residual) / Math.max(Math.abs(bal.drive), Math.abs(bal.fromField), Math.abs(bal.radiation), 1e-300),
      c319: { heat: c3.heat * U.E, fromField: c3.fromField * U.E, radiation: c3.radiation * U.E, closeRel: Math.abs(c3.residual) / Math.max(Math.abs(bal.drive), Math.abs(c3.fromField), Math.abs(c3.radiation), 1e-300) } },
    rows: receiverRows(R, names).filter((r) => key !== 'solar16' || ROWS16.indexOf(r.i) >= 0), _R: R };
}
/** 🗺️ の写しで正本に残す受け手(太陽と 6 天体の役割 —— 正本の大きさを抑える) */
export const ROWS16 = Object.freeze([0, 1, 2, 3, 5, 6, 11]);

/* ───────── R 6 天体の役割の表(初期の状態の読み口)───────── */
export function partR(E, plan, ref319b) {
  const kinds = plan.kinds, out = { kinds: kinds.slice(), rows: [], compare: [] };
  if (plan.books.indexOf('solar16') < 0) return out;
  const st = {}; for (const kind of kinds) st[kind] = stateOf(E, copyBook(E.HP, 'solar16', { hold: { mode: 'maintain' }, sm: L.sourceMomentOf(kind) }));
  const S0 = st.now.S, U = L.unitsOf(st.now.preset.scaleExp), Rj = S0.R[6] * U.len, req = L.requiredOf(Rj), h0 = st.now.preset.physics.stepDt * U.time;
  out.req = req; out.h0 = h0; out.RjM = Rj;
  const ax = (S, i) => [S.sax[i], S.say[i], S.saz[i]], spinVec = (S, i) => ax(S, i).map((q) => q * S.spin[i] * U.W), dvec = (S, i, j) => [S.x[i] - S.x[j], S.y[i] - S.y[j], S.z[i] - S.z[j]];
  for (const ro of L.DECL.roles) {
    const i = ro.i, row = { i, name: L.BODY16[i], role: ro.role, req: ro.req, Om: nrm(spinVec(S0, i)), kinds: {} };
    for (const kind of kinds) {
      const s = st[kind]; if (!s.ok) { row.kinds[kind] = { ok: false }; continue; }
      const S = s.S, r = s.isq.receivers.find((q) => q.i === i), n = S.n, om = r.omegaSrc.slice(0, 3).map((q) => q * U.W), Om = spinVec(S, i);
      const u = L.uRotOf(r.rot.slice(0, 3), S.spin[0], ax(S, 0)).map((q) => q * U.len / U.time), wr = L.wRotOf(u, dvec(S, i, 0).map((q) => q * U.len), ax(S, 0));
      const cmp = L.composeRef(Om, om), I = L.DECL.engineRecvF * S.m[i] * U.mass * Math.pow(S.R[i] * U.len, 2), a = ax(S, i), sp = S.spin[i] * U.W;
      const wp = om[0] * a[0] + om[1] * a[1] + om[2] * a[2], C = new Float64Array(9); E.cell(I, sp, a[0], a[1], a[2], wp, om[0] - wp * a[0], om[1] - wp * a[1], om[2] - wp * a[2], C, 0);
      const k = { omSun: nrm(om), angOmSun: L.angDeg(Om, om), decel: cmp.less, wRot: wr.w, uRot: wr.u, rAu: wr.r / L.AU, heatSunB: C[0] + Math.abs(C[1]), heatSun319: C[2] };
      if (ro.req === 'plane') { k.reqVal = req.plane; k.ratio = wr.w / req.plane; k.arcsecCentury = wr.w * 100 * L.YEAR * 180 / Math.PI * 3600; }
      else if (ro.req === 'venus') { k.reqVal = req.venus; k.ratio = nrm(om) / req.venus; }
      else if (ro.req === 'jupiter') { k.reqVal = req.jupiterP; k.ratio = k.heatSunB / h0 / req.jupiterP; k.ratioAlt = k.heatSunB / h0 / req.jupiterPAlt; }
      row.kinds[kind] = k;
      // 第319便b の写しの外の式の数との照合(同じ初期の状態 —— 源のモーメントの半径の差は R_obs の精度〔状態の radOv は単精度〕)
      const pk = L.DECL.plan319b[kind], rr = ref319b && ref319b.R && ref319b.R.rows.find((q) => q.i === i), pr = rr && rr.plans[pk];
      if (pr) {
        const c = { i, name: row.name, kind, plan319b: pk, omSunEngine: k.omSun, omSun319b: pr.omSun, omSunRel: relD(k.omSun, pr.omSun), wRotEngine: wr.w, wRot319b: pr.wRot, wRotRel: relD(wr.w, pr.wRot) };
        if (ro.req === 'jupiter' && pr.heat) { c.ratioEngine = k.ratio; c.ratio319b = pr.heat.ratioAbsSun; c.ratioRel = relD(k.ratio, pr.heat.ratioAbsSun); }
        else if (pr.ratio !== undefined) { c.ratioEngine = k.ratio; c.ratio319b = pr.ratio; c.ratioRel = relD(k.ratio, pr.ratio); }
        out.compare.push(c);
      }
    }
    out.rows.push(row);
  }
  // 照合の最大: 回転の項(公転面の角速度 —— 節点の同符号の和)と木星の (b) の比は R_obs の精度(単精度の radOv)の内・軸の ω は受け手の体積の近遠の差の丸めの床
  //   (第319便b の K.sens —— 受け手の R_d,i/r が 1e-14 の桁の天体で 1e-4 の桁)
  out.compareMaxRot = out.compare.reduce((m, c) => Math.max(m, c.wRotRel), 0);
  out.compareMaxRatio = out.compare.filter((c) => c.ratioRel !== undefined && c.i === 6).reduce((m, c) => Math.max(m, c.ratioRel), 0);
  out.compareMaxAxial = out.compare.reduce((m, c) => Math.max(m, c.omSunRel), 0);
  out.sens319b = (ref319b && ref319b.Ksens) ? ref319b.Ksens.filter((z) => L.DECL.roles.some((r) => r.i === z.i)).map((z) => ({ i: z.i, name: z.name, rel: z.rel, RdOverR: z.RdOverR })) : null;
  return out;
}

/* ───────── F 木星の 1 回の量と要る τ_hold ───────── */
export function partF(books, plan, Rj) {
  const out = { rows: [], Preq: L.powerOf(L.LIT.jupiterFlux.value, Rj), PreqAlt: L.powerOf(L.LIT.jupiterFluxAlt.value, Rj), RjM: Rj, fSrcJupiter: L.MOI16[6], engineRecvF: L.DECL.engineRecvF, signCheck: [] };
  const targets = [['jupiter', 1, '木星(🏀 の写し)'], ['solar16', 6, '木星(🗺️ の写し)'], ['venus', 1, '金星(🌋 の写し)'], ['solar16', 2, '金星(🗺️ の写し)']];
  for (const [key, i, ja] of targets) {
    if (plan.books.indexOf(key) < 0) continue;
    const isJup = ja.indexOf('木星') === 0;
    for (const kind of plan.kinds) {
      const bp = books[key + '|' + kind + '|1'], bm = books[key + '|' + kind + '|-1'];
      if (!bp || !bp.ok) continue;
      const rp = bp.rows.find((r) => r.i === i), rm = bm && bm.ok ? bm.rows.find((r) => r.i === i) : null;
      if (rm) out.signCheck.push({ key, i, kind, noGalaxySame: Object.is(rp.eventNoGalaxyB, rm.eventNoGalaxyB), sunSame: Object.is(rp.sun.heat, rm.sun.heat) });
      const cand = [['none', rp.eventNoGalaxyB, null], ['declPlus', rp.eventB, rp.event319]];
      if (rm) cand.push(['declMinus', rm.eventB, rm.event319]);
      for (const [gk, evB, ev319] of cand) for (const fk of L.DECL.recvF) {
        const mul = (fk === 'src' && isJup) ? L.MOI16[6] / L.DECL.engineRecvF : (fk === 'src') ? L.MOI16[2] / L.DECL.engineRecvF : 1;
        const row = { book: bp.id, i, ja, kind, kindJa: (key === 'solar16' ? L.KIND_JA : L.KIND_JA2)[kind], galaxy: gk, galaxyJa: L.GALAXY_JA[gk], recvF: fk, recvFJa: L.RECVF_JA[fk], recvMul: mul,
          sunMag: rp.sun.mag, galMag: rp.galaxy ? rp.galaxy.mag : 0, sunHeatB: rp.sun.heat * mul, sunDecel: rp.sun.decel, eventB: evB * mul, event319: ev319 === null ? null : ev319 * mul };
        if (isJup) { row.tauReqB = row.eventB / out.Preq; row.tauReqBAlt = row.eventB / out.PreqAlt; row.ratioBAtH0 = row.eventB / bp.h0 / out.Preq; row.ratioBAtH0Alt = row.eventB / bp.h0 / out.PreqAlt;
          row.sunRatioBAtH0 = row.sunHeatB / bp.h0 / out.Preq; if (row.event319 !== null) row.tauReq319 = row.event319 / out.Preq; }
        out.rows.push(row);
      }
    }
  }
  return out;
}

/* ───────── TS 刻みの感度(🏀 の J + (b))───────── */
export function partT(E, plan) {
  const b0 = copyBook(E.HP, 'jupiter'), h0 = b0.physics.stepDt, gal = galaxyDeclOf(E, 'jupiter'), U = L.unitsOf(b0.scaleExp), sm = L.sourceMomentOf('Jsun');
  const runH = (hold, h, n) => runBook(E, copyBook(E.HP, 'jupiter', { hold, galaxy: gal, sm }), h, n);
  const tH = runH(holdOf(h0, HOLD_B), h0, plan.steps), tH2 = runH(holdOf(h0, HOLD_B), h0 / 2, plan.halfSteps);
  const sH = runH({ mode: 'maintain', reaction: 'background', compose: 'source', balance: 'background' }, h0, plan.steps), sH2 = runH({ mode: 'maintain', reaction: 'background', compose: 'source', balance: 'background' }, h0 / 2, plan.halfSteps);
  const q = (R) => R.m.heat.total * U.E;
  return { tauHold: { h: q(tH), h2: q(tH2), rel: relD(q(tH), q(tH2)) }, step: { h: q(sH), h2: q(sH2), ratio: q(sH2) / q(sH) },
    note: '刻みの感度診断(収束の判定ではない)。{tauHold} は 1 步の量 × h/τ_hold(同じ時間で刻みに依らない)・"step" は 1 步ごとに 1 回(h/2 で同じ時間の熱が約 2 倍)' };
}

/* ───────── 門・実行 ───────── */
export function gatesOf(J) {
  const G = {};
  G.pure = !!(J.P && Object.values(J.P.gates).every(Boolean));
  G.accept = !!(J.A && J.A.pass);
  G.same = !!(J.Q && J.Q.pass);
  for (const k of Object.keys(J.books)) { const b = J.books[k]; G['book_' + k] = !!(b.ok && b.source.offSteps === 0 && b.source.sumResMax === 0 && b.balance.closeRel <= 1e-12 && b.balance.c319.closeRel <= 1e-12 && b.balance.version === 'w320a-axishold-balance-2'); }
  G.roles = !!(J.R && (J.R.rows.length === 0 || (J.R.rows.length === L.DECL.roles.length && J.R.compare.length > 0 && J.R.compareMaxRot <= 1e-6 && J.R.compareMaxRatio <= 1e-6 && J.R.compareMaxAxial <= 1e-3)));
  G.factors = !!(J.F && J.F.rows.length > 0 && J.F.rows.every((r) => Number.isFinite(r.eventB)) && J.F.signCheck.every((z) => z.noGalaxySame && z.sunSame));
  G.tStep = !!(J.TS && Number.isFinite(J.TS.tauHold.rel) && J.TS.tauHold.rel <= 1e-9 && Math.abs(J.TS.step.ratio - 2) <= 1e-3);
  return G;
}
export async function runSrcHeat(E, o) {
  const P = o.plan, t = {}; let t0 = Date.now();
  const tick = (k) => { t[k] = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now(); };
  const J = { stage: 'srcheat', quick: !!o.quick, plan: clone(P), decl: clone(L.DECL), lit: clone(L.LIT), moi16: clone(L.MOI16) };
  J.P = partP(E); tick('P');
  J.A = partA(E); tick('A');
  J.Q = partQ(E, P); tick('Q');
  const books = {};
  for (const key of P.books) for (const kind of P.kinds) { if (key !== 'solar16' && KINDS_2BODY.indexOf(kind) < 0) continue; for (const sign of P.signs) books[key + '|' + kind + '|' + sign] = partBook(E, key, kind, sign, P); }
  tick('B');
  J.R = partR(E, P, o.ref319b); tick('R');
  const anyB = Object.values(books).find((b) => b.ok && b.id === BOOK_IDS.solar16) || Object.values(books).find((b) => b.ok);
  const Rj = (anyB && anyB.id === BOOK_IDS.solar16) ? anyB._R.S.R[6] * L.unitsOf(anyB._R.preset.scaleExp).len : (J.R.RjM || 69911308.58659744);
  J.F = partF(books, P, Rj); tick('F');
  J.TS = partT(E, P); tick('TS');
  J.books = {}; for (const [k, v] of Object.entries(books)) { const c = Object.assign({}, v); delete c._R; J.books[k] = c; }
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean); J.timing = t;
  return J;
}
export async function main() {
  const TARGET = process.env.W320A_TARGET || 'beta/index.html', quick = process.env.W320A_QUICK === '1';
  const OUT = process.env.W320A_OUT ? (path.isAbsolute(process.env.W320A_OUT) ? process.env.W320A_OUT : path.join(ROOT, process.env.W320A_OUT)) : path.join(ROOT, OUT_SRCHEAT);
  if (quick && !process.env.W320A_OUT) throw new Error('試走(W320A_QUICK=1)は W320A_OUT を指定する(正本を書かない)');
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now(), targetSha256 = crypto.createHash('sha256').update(fs.readFileSync(html)).digest('hex');
  const W281A_SCOPE = REGEN_SCOPE ? w281aScopeStamp(html, REGEN_SCOPE) : {};
  const { HP } = loadHtmlMain(html), E = portsOf(HP);
  let ref319b = null; try { const z = JSON.parse(fs.readFileSync(path.join(ROOT, IN_319B), 'utf8')); ref319b = { R: z.R, Ksens: z.K ? z.K.sens : null }; } catch (e) { ref319b = null; }
  console.log('第320便a srcheat: ' + (quick ? '試走' : '正本') + '・1 プロセス');
  const R = await runSrcHeat(E, { quick, plan: quick ? QUICK : PLAN, ref319b });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w320a-srcheat.mjs', target: TARGET, targetSha256, reuseFrom: null,
    ruling: '原仮定者の回答(2026-10-30 —— AN475)「減速させる側の引きずりを背景宇宙が補う分も熱に数える」・原仮定者の裁定(第122報)AN471「案3(J)を確かめる。案2bは次点。様々な可能性を探索する」・'
      + '決断事項 AN471・AN474・AN475・統括の検証項目 R262。balance:"background" の版を上げた読み (b) と源のモーメントの半径 invSq.sourceMoment(J・obs・capObs)を在位の本の写しで測る(在位の本の宣言は変えない)',
    balanceVersion: HP.REL_DRAG_AXIS_HOLD_BALANCE_VERSION || null, balanceVersion319: HP.REL_DRAG_AXIS_HOLD_BALANCE_VERSION_319 || null, srcMomentVersion: HP.REL_DRAG_INVSQ_SRC_MOMENT_VERSION || null,
    srcVersion: HP.REL_DRAG_AXIS_HOLD_SRC_VERSION || null, maintVersion: HP.REL_DRAG_AXIS_HOLD_MAINT_VERSION || null, ref319b: ref319b ? IN_319B : null, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w320a-srcheat.mjs', 'tests/lib-w320a-srcheat.mjs', 'tests/lib-w319a-axisheat.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第320便a', target: TARGET, code: CODE, inputs: [TARGET, IN_319B] }), {
    harnessVersion: HARNESS_VERSION, stage: 'srcheat',
    engine: 'Node(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・1 プロセス)',
    literature: Object.values(L.LIT).map((z) => z.name + ' = ' + z.value + ' ' + z.unit + '(本便は一次資料に当たっていない)'),
    notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();
