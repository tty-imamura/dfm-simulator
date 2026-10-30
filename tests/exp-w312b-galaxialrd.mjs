// 第312便b(原仮定者の裁定(第114報)「一様軸引きずりは受ける側の dragCore の R_d に応じて変わる。ただし一様重力の様に一定の勾配で近似するので、シミュレーションでは
// どの場所でも R_d が同じなら影響は同じ」・「一様回転引きずりは慣性系であってもコリオリの項が必要 —— 背景側の支配天体を明示していない場合は規約として無視」・
// 決断事項 AN395・統括の検証項目 R231): **銀河の一様軸引きずりの受け手の R_d の応答**(galaxyAxial.rdPow・refRadius)**と、今の軸の核(bevel)の自然な応答の次数の診断の器**。
//
// Node だけ(対象 html の inline script を tests/lib-w279b-headless.mjs の loadHtmlHeadless で読み、html の validatePreset・coord3d.makeSim・build・step と
// 読み口 inertialDragIsqState・inertialDragGalaxyAxialState・inertialDrag3SpinState・評価の写し inertialDragInitObsEval をそのまま呼ぶ)。
// 写しは器の中で組む(**在位の本の宣言は変えない** —— 在位の本は 1 本も galaxyAxial を宣言しない)。太陽系の写しと向きと尺度は第311便b の器(tests/exp-w311b-galaxial.mjs)のもの。
//
// ■ 段
//   A(受理): rdPow(0・1・2・−0 → 0 を受理 / 3・1.5・−1・文字列・真偽値・null・NaN を拒否)・refRadius(rdPow と一緒に・正の有限の数 —— 単独・0・負・非有限・文字列・null を拒否)・
//     未知の鍵(一様回転の鍵は作らない)・物理の単位の無い本(rdPow 1・2 で refRadius を省略 → 拒否・refRadius を宣言 → 受理・rdPow 0 → 受理)・旧則の本は今のまま拒否。
//   B(確かめ): ① rdPow の無い宣言と rdPow 0 の 20 步がビット同一 ② 同じ状態の build(評価の写し —— 観測の初期値の分解と同じ経路)で β・並進の右辺・回転の係数はビット同一・
//     軸の ω = 銀河なし + ω_G (R_d,i/R_ref)^q(器が同じ式で作った係数でビット)③ 孤立の受け手で ω/ω_G = (R_d/R_ref)^q(R_d = R_ref × {1/2, 1, 2} —— 二進で正確な値)
//     ④ 位置の不変(受け手を 3 か所へ動かしても銀河の分はビット同一)・同じ R_d で質量の違う 2 つの受け手に同じ銀河の分 ⑤ 2 步の並進・自転の大きさはビット同一・軸だけが違う
//     ⑥ R_ref の既定(6.5×10⁶ m / 10^L —— dragCoreDefault の無い本でも build が 10^L を控える・cap6500km の受け手の係数は 1)⑦ 明示の 0 は未宣言と走りがビット同一。
//   N(核の自然な応答 —— 裁定の材料): 今の軸の核(bevel)で、源(太陽 —— 宣言の自転と軸・R_d = cap6500km)から距離 r に置いた受け手(水星の写し)の軸の ω(源から来る分 ——
//     読み口 inertialDragIsqState の receivers[].omega)を、受け手の R_d を 1/2・1・2 倍・質量を 1/10・1・10 倍・外殻の有無(外殻は dragCore massFrac 0.5・外径を固定 ——
//     外径も 3/4・3/2 倍)で変え、次数 p = Δln ω/Δln(量) を測る。距離 r = 0.387 au × {0.1, 1, 10, 100, 1000}(状態の位置を build の後に置く —— 本の値域の外まで)で「一様の極限」
//     (受け手の上で源の場がほぼ一様な勾配・源の場 ≪ 受け手の自己の場)へ近づくかを見る。距離の次数も同じ表に。
//   X(軸の角の試験と表): 太陽系の写し(第311便b —— 太陽・水星・金星・地球・火星・木星・cap6500km)に ω_G = f Ω_ref ĝ(f = 10⁻²・1 —— 尺度 V₀/R₀・大きさは未定)を
//     rdPow q = 0・1・2(R_ref の既定 6500 km)で宣言し、水星の 2 公転だけ走らせる: 軸の向きの変化(銀河なしの写しとの角と一次の見積り abs(f_i ω_G × â) t)・
//     軌道法線との角・天体どうしの軸の角の変化(銀河の分 —— **同じ R_d の対**〔太陽と木星 —— どちらも cap の 6500 km〕は変わらない・**違う R_d の対**は
//     一次の見積り −(f_i − f_j) ω_G·(â_i × â_j) t / sin ψ_ij で変わる)・維持の型(axisHold maintain)の軸のコスト。
//
// ■ 言わないこと: 「天の川を較正した」「フィットした」「法則を発見した」「完全に一致」・ω_G の大きさを決めた・q を決めた(推奨は診断から —— 裁定は原仮定者)。
//   表の大きさは**未定(AN395)の格子** —— 銀河の模型からの数ではない。2 公転の窓の数を長い時間へ外挿して書かない。
//
// ■ 使い方
//   node tests/exp-w312b-galaxialrd.mjs   → 正本 tests/out/galaxialrd-w312b.json(段 galaxialrd-312b)
//   W312B_OUT=<json> で出力先を変える(試走は正本を書かない)・W312B_TARGET=<html>(既定 beta/index.html)・W312B_QUICK=1(水星の 1/4 公転 —— 煙試験の窓)・
//   W312B_KERNEL=<名>(写しの invSq.kernel に渡す口 —— 第312便a の新則の核の選択。受理しない html では「未接続」と記録して段 N・X を飛ばす。出力の既定は
//   tests/out/galaxialrd-w312b-<名>.json —— 鎖では走らせない)・W312B_STAGES=A,B,N,X(走らせる段 —— 既定は全部)。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlHeadless } from './lib-w279b-headless.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import { fmtFloor } from './lib-w311c-h4carry.mjs';
import * as G311 from './exp-w311b-galaxial.mjs';
import { pinDecl315c, LEGACY7_DATA_FILE } from './lib-w315c-legacy7.mjs';   // 第315便c(決断事項 AN406・R244): 在位の 7 本を K1 へ移した世代では、この器は移行の前(af2f426)の宣言の写しで測る
// 第281便a の領域 hash の宣言(器と lib から deriveScope で引いた下限 —— 器の本は .find で引く・第319便c(R260): tests/lib-w299c-planets3d.mjs の allPresets() を .find で直に引く形にしたので presets は名指しの本 —— 下限 ∪ 器が読む凍結の写しの本)
const REGEN_SCOPE = {"presets":["earthMoonSunInertial3d","jupiterGalilean","jupiterSunInertial3d","marsMoonsReal","marsSunInertial3d","mercury","mercuryReal","mercurySunInertial3d","neptuneReal","neptuneSunInertial3d","saturn","saturnRingReal","saturnSunInertial3d","uranusReal","uranusSunInertial3d","venusReal","venusSunInertial3d"],"roots":["$","DT","FIT_COND_KEYS","FIT_COND_VERSION","FIT_KNOB_KEYS","FIT_NUMERICS_KEYS","FIT_RECORD_KEYS","FIT_RECORD_VERSION","FIT_RECORD_VERSIONS","FIT_RESIDUAL_KEYS","FIT_TARGET_KEYS","FIT_TOL_KEYS","GALAXY_AXIAL_RD_POWS","GALAXY_AXIAL_RD_VERSION","GALAXY_AXIAL_REF_RADIUS_M","GALAXY_AXIAL_VERSION","HP.REL_DRAG_INVSQ_VERSION","HP.allPresets","HP.coord3d","HP.inertialDragIsqState","HP.validatePreset","INERTIAL_DRAG3_MAINT_SC","REL_DRAG_AXIS_HOLD_INTERVAL_UNDECLARED","REL_DRAG_AXIS_HOLD_LEDGER_VERSION","REL_DRAG_AXIS_HOLD_MAINT_VERSION","REL_DRAG_INIT_DEN_MIN","REL_DRAG_INIT_OBS_VERSION","REL_DRAG_INVSQ_VERSION","T","ab","appStepDt","ch","ckRestoreOne","ckSnapOne","ctx","cw","fmt","inertialDrag3AxialSign","inertialDrag3SpinState","inertialDragGalaxyAxialState","inertialDragInitObsEval","inertialDragInitObsRedo","inertialDragInitObsState","inertialDragInverseMap","inertialDragIsqState","pnSource","retiredOf","sim","validateFitRecord"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w312b-galaxialrd-1';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (o) => JSON.parse(JSON.stringify(o));
const E = (H, name) => H.evalExpr(name);
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a) => Math.hypot(a[0], a[1], a[2]);
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const scale = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const ang = (a, b) => Math.atan2(norm(cross(a, b)), dot(a, b));   // atan2(|a×b|, a·b)
const r10 = (v) => (typeof v === 'number' && Number.isFinite(v)) ? Number(v.toPrecision(10)) : v;
const NOT_CLAIM = ['天の川を較正した', 'フィットした', '法則を発見した', '完全に一致', 'ω_G の大きさを決めた', 'q を決めた', '銀河の模型から ω_G を導いた'];
const MER = 'mercurySunInertial3d';
/** rdPow の格子(段 X)と |ω_G| = f Ω_ref の格子(大きさは未定 —— AN395) */
export const Q_GRID = Object.freeze([0, 1, 2]);
export const F_GRID = Object.freeze([1e-2, 1]);
/** 段 N の距離(水星の軌道の長半径 0.387 au の倍数)と受け手の変え方 */
export const N_DIST = Object.freeze([0.1, 1, 10, 100, 1000]);
export const N_RD = Object.freeze([0.5, 1, 2]), N_M = Object.freeze([0.1, 1, 10]), N_RO = Object.freeze([0.75, 1, 1.5]);
export const AU_M = 1.495978707e11, A_MER_AU = 0.387;
/** 段 N の受け手(水星の写し)の基準: R_d = 2.44×10⁶ m(水星の半径)・外殻の写しは dragCore massFrac 0.5・外径 6.1×10⁶ m(= 2.5 R_d —— R_d の 2 倍より外) */
export const N_RECV = Object.freeze({ RdM: 2.44e6, massFrac: 0.5, RoM: 6.1e6 });
/** 段 B の孤立の受け手の R_ref(本の長さの単位 —— 二進で正確な 1/16 —— R_d = R_ref × {1/2, 1, 2} の比が丸めなしに作れる) */
export const B_REF = 0.0625;
const FLOOR_ANG = 1e-13;   // 天体どうしの軸の角の変化の丸めの床 [rad](第311便b の表と同じ)

const findP = (HP, id) => { const p = HP.allPresets().find((q) => q.id === id); if (!p) throw new Error('本が無い: ' + id); return clone(p); };
/** 第311便b の器の ☿ 3D の写し(新則・既定の半径)に galaxyAxial を足す(kernel は invSq.kernel —— 第312便a の口) */
export function merCopy(HP, galaxy, extra = {}, kernel = null) {
  const q = G311.merCopy(HP, galaxy === undefined ? extra : { ...clone(extra), galaxyAxial: clone(galaxy) });
  if (kernel) q.physics.relativeDrag.invSq.kernel = kernel;
  return q;
}
function build(H, q) {
  const HP = H.HP, v = HP.validatePreset(clone(q));
  if (!v.ok) throw new Error('validatePreset: ' + JSON.stringify(v.errors || v.err).slice(0, 300));
  const S = HP.coord3d.makeSim(); S.build(clone(v.preset));
  return { S, dt: E(H, 'appStepDt')(S), preset: v.preset, warnings: v.warnings || [] };
}
const XV = ['x', 'y', 'z', 'vx', 'vy', 'vz', 'spin', 'sax', 'say', 'saz', 'rotA'];
const fpS = (S, keys = XV) => { const h = crypto.createHash('sha1'); for (const k of keys) h.update(Buffer.from(Float64Array.from(S[k].subarray(0, S.n)).buffer)); return h.digest('hex'); };
const same = (a, b, n) => { for (let k = 0; k < n; k++) if (!Object.is(a[k], b[k])) return false; return true; };
/** html と同じ演算の順の係数(x = R_d/R_ref・q = 1 は x・q = 2 は x·x・q = 0 は 1)—— 器の側の作り直し */
export const rdFactor = (Rd, Rr, q) => { if (!q) return 1; const x = Rd / Rr; return q === 1 ? x : x * x; };

/* ───────── 段 A(受理)───────── */
/** 第313便b の世代(galaxyAxial.massPow を受理する html —— K1・rdPow 1・massPow −1・refMass の写しを受理するか)。前の世代の html では偽(未知の鍵で拒否) */
function rdmGen(H) { return H.HP.validatePreset(clone(merCopy(H.HP, { wx: 1e-12, wy: 0, wz: 0, rdPow: 1, massPow: -1, refMass: 1 }, {}, 'k1'))).ok === true; }
export function partA(H) {
  const HP = H.HP, rows = [];
  const tryV = (q) => { const v = HP.validatePreset(clone(q)); return { ok: v.ok, errFull: v.ok ? '' : String((v.errors || [])[0] || ''), err: v.ok ? null : String((v.errors || [])[0] || '').slice(0, 160), canon: v.ok ? (v.preset.physics.relativeDrag || {}).galaxyAxial : undefined, preset: v.ok ? v.preset : null }; };
  const G0 = { wx: 1e-12, wy: -2e-12, wz: 3e-12 }, J0 = '"wx":1e-12,"wy":-2e-12,"wz":3e-12';
  const A = [
    ['rdPow 省略(第311便b の形)', { ...G0 }, true, '{' + J0 + '}'],
    ['rdPow 0', { ...G0, rdPow: 0 }, true, '{' + J0 + ',"rdPow":0}'],
    ['rdPow −0(+0 へ)', { ...G0, rdPow: -0 }, true, '{' + J0 + ',"rdPow":0}'],
    ['rdPow 1', { ...G0, rdPow: 1 }, true, '{' + J0 + ',"rdPow":1}'],
    ['rdPow 2', { ...G0, rdPow: 2 }, true, '{' + J0 + ',"rdPow":2}'],
    ['rdPow 2 + refRadius 0.0625', { ...G0, rdPow: 2, refRadius: 0.0625 }, true, '{' + J0 + ',"rdPow":2,"refRadius":0.0625}'],
    ['rdPow 0 + refRadius 0.0625', { ...G0, rdPow: 0, refRadius: 0.0625 }, true, '{' + J0 + ',"rdPow":0,"refRadius":0.0625}'],
    ['rdPow 3', { ...G0, rdPow: 3 }, false, /rdPow は 0・1・2/],
    ['rdPow 1.5', { ...G0, rdPow: 1.5 }, false, /rdPow は 0・1・2/],
    ['rdPow −1', { ...G0, rdPow: -1 }, false, /rdPow は 0・1・2/],
    ['rdPow 文字列 "2"', { ...G0, rdPow: '2' }, false, /rdPow は 0・1・2/],
    ['rdPow 真偽値', { ...G0, rdPow: true }, false, /rdPow は 0・1・2/],
    ['rdPow null', { ...G0, rdPow: null }, false, /rdPow は 0・1・2/],
    ['rdPow NaN', { ...G0, rdPow: NaN }, false, /rdPow は 0・1・2/],
    ['refRadius だけ(rdPow なし)', { ...G0, refRadius: 0.0625 }, false, /rdPow と一緒にだけ/],
    ['refRadius 0', { ...G0, rdPow: 2, refRadius: 0 }, false, /正の有限の数/],
    ['refRadius −0.01', { ...G0, rdPow: 2, refRadius: -0.01 }, false, /正の有限の数/],
    ['refRadius Infinity', { ...G0, rdPow: 2, refRadius: Infinity }, false, /正の有限の数/],
    ['refRadius NaN', { ...G0, rdPow: 2, refRadius: NaN }, false, /正の有限の数/],
    ['refRadius 文字列', { ...G0, rdPow: 2, refRadius: '0.06' }, false, /正の有限の数/],
    ['refRadius null', { ...G0, rdPow: 1, refRadius: null }, false, /正の有限の数/],
    ['未知の鍵 rot(一様回転)', { ...G0, rot: 1e-12 }, false, /未知の鍵/],
    // 第313便b(世代切替): massPow を受理する html(GALAXY_AXIAL_RDM_VERSION がある)では K2 の本・rdPow 2 の massPow は「K1・rdPow 1 と一緒にだけ」の拒否(前の世代は未知の鍵)
    ['未知の鍵 massPow', { ...G0, rdPow: 2, massPow: -1 }, false, rdmGen(H) ? /massPow は -1〔K1・rdPow 1 と一緒にだけ〕/ : /未知の鍵/],
  ];
  for (const [name, g, expect, chk] of A) {
    const r = tryV(merCopy(HP, g));
    let pass = r.ok === expect;
    if (pass && r.ok) pass = JSON.stringify(r.canon) === chk && (r.canon.rdPow === undefined || Object.is(r.canon.rdPow, Math.abs(r.canon.rdPow)));
    if (pass && !r.ok) pass = /galaxyAxial/.test(r.errFull) && chk.test(r.errFull);
    rows.push({ key: 'galaxyAxial', name, ok: r.ok, expectOk: expect, pass, canon: r.canon === undefined ? null : r.canon, err: r.err });
  }
  // 物理の単位の無い本(dragCoreDefault を外す —— それも単位が要る)・単位のある本で dragCoreDefault なし・旧則の本
  const U = [];
  const unitsCase = (name, g, mut, expect, re, chkLen) => {
    const q = merCopy(HP, g); delete q.physics.relativeDrag.dragCoreDefault; mut(q);
    const r = tryV(q), row = { name, ok: r.ok, expectOk: expect, err: r.err };
    let pass = r.ok === expect;
    if (pass && !r.ok) pass = re.test(r.errFull);
    if (pass && r.ok && chkLen !== undefined) { const S = H.HP.coord3d.makeSim(); S.build(clone(r.preset)); row.lenSI = S._rdLenSI === undefined ? null : S._rdLenSI; pass = Object.is(row.lenSI, chkLen); }
    row.pass = pass; U.push(row);
  };
  unitsCase('単位なし・rdPow 2・refRadius 省略', { wx: 1e-12, wy: 0, wz: 0, rdPow: 2 }, (q) => { delete q.scaleExp; }, false, /scaleExp\.L が要る/);
  unitsCase('単位なし・rdPow 1・refRadius 省略', { wx: 1e-12, wy: 0, wz: 0, rdPow: 1 }, (q) => { delete q.scaleExp; }, false, /scaleExp\.L が要る/);
  unitsCase('単位なし・rdPow 2・refRadius 0.0625', { wx: 1e-12, wy: 0, wz: 0, rdPow: 2, refRadius: 0.0625 }, (q) => { delete q.scaleExp; }, true);
  unitsCase('単位なし・rdPow 0', { wx: 1e-12, wy: 0, wz: 0, rdPow: 0 }, (q) => { delete q.scaleExp; }, true);
  unitsCase('単位あり・dragCoreDefault なし・rdPow 2(build が 10^L を控える)', { wx: 1e-12, wy: 0, wz: 0, rdPow: 2 }, () => {}, true, null, Math.pow(10, 8));
  { const q = findP(HP, MER); delete q.fitRecord; q.physics.relativeDrag.galaxyAxial = { wx: 1e-12, wy: 0, wz: 0, rdPow: 2 }; const r = tryV(q);
    U.push({ name: '旧則の本 + rdPow 2', ok: r.ok, expectOk: false, err: r.err, pass: !r.ok && /invSq の本だけ/.test(r.errFull) }); }
  const all = rows.concat(U);
  return { galaxy: rows, units: U, nPass: all.filter((r) => r.pass).length, nCases: all.length, allPass: all.every((r) => r.pass),
    pows: E(H, 'GALAXY_AXIAL_RD_POWS'), refRadiusDefaultM: E(H, 'GALAXY_AXIAL_REF_RADIUS_M'), rdVersion: E(H, 'GALAXY_AXIAL_RD_VERSION'), version: E(H, 'GALAXY_AXIAL_VERSION') };
}

/* ───────── 段 B(確かめ)───────── */
export function partB(H) {
  const HP = H.HP, out = {}, ev = E(H, 'inertialDragInitObsEval'), st = E(H, 'inertialDragGalaxyAxialState'), isq = E(H, 'inertialDragIsqState'), sgn = E(H, 'inertialDrag3AxialSign');
  const g = { wx: 3.1e-11, wy: -1.7e-11, wz: 4.3e-11 }, Lm = Math.pow(10, 8), RrDef = E(H, 'GALAXY_AXIAL_REF_RADIUS_M') / Lm;
  const run = (q, k = 20) => { const r = build(H, q); for (let s = 0; s < k; s++) r.S.step(r.dt); return r.S; };
  // ① rdPow の無い宣言と rdPow 0(refRadius つきも)の 20 步
  { const a = run(merCopy(HP, g)), b = run(merCopy(HP, { ...g, rdPow: 0 })), c = run(merCopy(HP, { ...g, rdPow: 0, refRadius: B_REF }));
    const sa = st(a), sb = st(b);
    out.omitSameAsPow0 = { run: fpS(a) === fpS(b) && fpS(a) === fpS(c), omegaG: JSON.stringify(sa.receivers.map((r) => r.omegaG)) === JSON.stringify(sb.receivers.map((r) => r.omegaG)),
      rdRecordOnlyDeclared: sa.rd === undefined && !!sb.rd && sb.rd.version === E(H, 'GALAXY_AXIAL_RD_VERSION') && sa.version === E(H, 'GALAXY_AXIAL_VERSION') && sb.version === sa.version }; }
  // ② 同じ状態の build(評価の写し —— 状態を動かさない・観測の初期値の分解と同じ経路)
  const fixed = (q) => {
    const b = build(H, merCopy(HP, { ...g, rdPow: q })), S = b.S, n = S.n, vel = [S.vx, S.vy, S.vz];
    const S0 = Object.create(S); S0.relDrag = clone(S.relDrag); delete S0.relDrag.galaxyAxial;
    const T1 = ev(S, n, null, null, null, null, vel).T, T0 = ev(S0, n, null, null, null, null, vel).T, Rd = isq(S).receivers.map((r) => r.Rd);
    const eqA = (k, len) => same(T1[k], T0[k], len), f = Rd.map((R) => rdFactor(R, RrDef, q)), s = st(S);
    const okW = [...Array(n).keys()].every((i) => { const gx = q ? g.wx * f[i] : g.wx, gy = q ? g.wy * f[i] : g.wy, gz = q ? g.wz * f[i] : g.wz, pa = gx * S.sax[i] + gy * S.say[i] + gz * S.saz[i];
      return T1._rdWX[i] === T0._rdWX[i] + gx && T1._rdWY[i] === T0._rdWY[i] + gy && T1._rdWZ[i] === T0._rdWZ[i] + gz && T1._rdWS[i] === T0._rdWS[i] + (sgn(S.sax[i], S.say[i], S.saz[i]) > 0 ? pa : -pa)
        && s.receivers[i].omegaG[0] === gx && s.receivers[i].omegaG[1] === gy && s.receivers[i].omegaG[2] === gz; });
    return { q, A: eqA('_rdA', n * n), U: eqA('_rdUX', n) && eqA('_rdUY', n) && eqA('_rdUZ', n), beta: eqA('_rdIsqBE', n * n), rot: eqA('_rdIsqRV', n * n * 3), deg: eqA('_rdDeg', n),
      omegaPlusFG: okW, factors: f.map(r10), Rd: Rd.map(r10), refRadius: r10(s.rd.refRadius), refRadiusIsDefault: (q ? s.rd.refRadius === RrDef : s.rd.refRadius === null) && s.rd.refRadiusDeclared === false };
  };
  out.fixedState = Q_GRID.map(fixed);
  // ③ 孤立の受け手(他の源なし —— 太陽だけ・dragCore の半径 R_d = R_ref × k・massFrac 1): ω = ω_G k^q(二進で正確)
  out.isolated = [];
  for (const q of Q_GRID) for (const k of [0.5, 1, 2]) {
    const qq = merCopy(HP, { ...g, rdPow: q, refRadius: B_REF }); qq.bodies[0].dragCore = { massFrac: 1, radius: B_REF * k };
    const b = build(H, qq), S = b.S, S1 = Object.create(S); S1.n = 1;
    const T = ev(S1, 1, null, null, null, null, [S.vx, S.vy, S.vz]).T, kq = q === 0 ? 1 : (q === 1 ? k : k * k);
    out.isolated.push({ q, k, ratio: T._rdWX[0] / g.wx, expect: kq, exact: T._rdWX[0] === g.wx * kq && T._rdWY[0] === g.wy * kq && T._rdWZ[0] === g.wz * kq, betaSum: T._rdA[0] });
  }
  // ④ 位置の不変・同じ R_d なら同じ(質量が 10 倍の双子 —— 同じ宣言の半径): 受け手を 3 か所に置いても銀河の分はビット同一
  { const base = merCopy(HP, { ...g, rdPow: 2 }), tw = clone(base.bodies[1]);
    tw.m = base.bodies[1].m * 10; tw.x = -base.bodies[1].x * 1.5; tw.y = -base.bodies[1].y * 1.5; tw.z = -base.bodies[1].z * 1.5; tw.vx = -tw.vx; tw.vy = -tw.vy; tw.vz = -tw.vz;
    base.bodies.push(tw);
    const rows = [];
    for (const sc of [1, 0.5, 3]) {
      const q = clone(base); for (const k of ['x', 'y', 'z']) q.bodies[1][k] = base.bodies[1][k] * sc;
      const b = build(H, q), S = b.S, n = S.n, vel = [S.vx, S.vy, S.vz], S0 = Object.create(S); S0.relDrag = clone(S.relDrag); delete S0.relDrag.galaxyAxial;
      const T1 = ev(S, n, null, null, null, null, vel).T, T0 = ev(S0, n, null, null, null, null, vel).T, s = st(S);
      const add = [1, 2].map((i) => [T1._rdWX[i] - T0._rdWX[i], T1._rdWY[i] - T0._rdWY[i], T1._rdWZ[i] - T0._rdWZ[i]]);
      const fs = [1, 2].map((i) => s.receivers[i].rdFactor);
      rows.push({ scale: sc, r1: r10(Math.hypot(S.x[1] - S.x[0], S.y[1] - S.y[0], S.z[1] - S.z[0])), omegaG1: s.receivers[1].omegaG, omegaG2: s.receivers[2].omegaG, factor1: fs[0], factor2: fs[1],
        sameRdSame: JSON.stringify(s.receivers[1].omegaG) === JSON.stringify(s.receivers[2].omegaG) && fs[0] === fs[1],
        buildPlusFG: [1, 2].every((i) => T1._rdWX[i] === T0._rdWX[i] + g.wx * fs[i - 1] && T1._rdWY[i] === T0._rdWY[i] + g.wy * fs[i - 1] && T1._rdWZ[i] === T0._rdWZ[i] + g.wz * fs[i - 1]),
        betaSame: same(T1._rdIsqBE, T0._rdIsqBE, n * n) && same(T1._rdUX, T0._rdUX, n), addNorm: add.map((a) => r10(norm(a))) });
    }
    out.position = { rows, invariant: rows.every((r) => JSON.stringify(r.omegaG1) === JSON.stringify(rows[0].omegaG1) && JSON.stringify(r.omegaG2) === JSON.stringify(rows[0].omegaG2)),
      sameRdSame: rows.every((r) => r.sameRdSame), buildPlusFG: rows.every((r) => r.buildPlusFG), betaSame: rows.every((r) => r.betaSame), massRatio: 10 }; }
  // ⑤ 2 步(最初の步は u = 0)—— 並進・自転の大きさはビット同一・軸だけが違う(q = 2)
  { const A2 = run(merCopy(HP, { ...g, rdPow: 2 }), 2), B2 = run(merCopy(HP), 2), K = ['x', 'y', 'z', 'vx', 'vy', 'vz', 'spin'];
    out.twoSteps = { xv: fpS(A2, K) === fpS(B2, K), u: same(A2._rdUX, B2._rdUX, 2) && same(A2._rdUY, B2._rdUY, 2) && same(A2._rdUZ, B2._rdUZ, 2), axesDiffer: fpS(A2, ['sax', 'say', 'saz']) !== fpS(B2, ['sax', 'say', 'saz']) }; }
  // ⑥ R_ref の既定: dragCoreDefault の無い本でも 10^L を控える・cap6500km の受け手(太陽)の係数は 1
  { const q = merCopy(HP, { ...g, rdPow: 2 }); delete q.physics.relativeDrag.dragCoreDefault; const b = build(H, q), s = st(b.S);
    const qc = merCopy(HP, { ...g, rdPow: 2 }), bc = build(H, qc), sc = st(bc.S);
    out.refDefault = { lenSI: b.S._rdLenSI, refRadius: s.rd.refRadius, expect: RrDef, ok: b.S._rdLenSI === Lm && s.rd.refRadius === RrDef && s.rd.refRadiusDefaultM === 6.5e6,
      capFactorOne: sc.receivers[0].rdFactor === 1 && sc.receivers[0].Rd === RrDef, sunRd: sc.receivers[0].Rd, merFactor: r10(sc.receivers[1].rdFactor) }; }
  // ⑦ 明示の 0(rdPow 2)と未宣言の 20 步
  { const Z = run(merCopy(HP, { wx: 0, wy: 0, wz: 0, rdPow: 2 })), N0 = run(merCopy(HP)), sz = st(Z);
    out.explicitZero = { runSame: fpS(Z) === fpS(N0), explicitZero: sz.explicitZero, active: sz.active }; }
  out.allPass = out.omitSameAsPow0.run && out.omitSameAsPow0.omegaG && out.omitSameAsPow0.rdRecordOnlyDeclared
    && out.fixedState.every((r) => r.A && r.U && r.beta && r.rot && r.deg && r.omegaPlusFG && r.refRadiusIsDefault)
    && out.isolated.every((r) => r.exact && r.betaSum === 0) && out.position.invariant && out.position.sameRdSame && out.position.buildPlusFG && out.position.betaSame
    && Object.values(out.twoSteps).every(Boolean) && out.refDefault.ok && out.refDefault.capFactorOne && out.explicitZero.runSame && out.explicitZero.explicitZero === true && out.explicitZero.active === false;
  return out;
}

/* ───────── 段 N(核の自然な応答 —— 裁定の材料)───────── */
/** 二体の写し(源 = 太陽〔宣言の自転と軸・cap6500km〕・受け手 = 水星の写し)。shell: 受け手の外殻(dragCore massFrac 0.5・外径 RoM)。位置は build の後に置く */
function nCopy(HP, o, kernel) {
  const q = merCopy(HP, undefined, {}, kernel), L = Math.pow(10, q.scaleExp.L), s = q.bodies[0], p = q.bodies[1];
  if (o.shell) q.physics.relativeDrag.invSq.outerShell = 'uniform';
  q.physics.radiusFloor = 0.001;
  Object.assign(s, { x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0 });
  Object.assign(p, { x: 100, y: 0, z: 0, vx: 0, vy: 0, vz: 0 });
  p.m = p.m * o.mf;
  if (o.shell) { p.radius = N_RECV.RoM * o.ro / L; p.dragCore = { massFrac: N_RECV.massFrac, radius: N_RECV.RdM * o.rd / L }; }
  else p.radius = N_RECV.RdM * o.rd / L;
  return q;
}
function nOmega(H, q, rBook) {
  const v = H.HP.validatePreset(clone(q));
  if (!v.ok) return { err: String((v.errors || [])[0] || '').slice(0, 200) };
  const S = H.HP.coord3d.makeSim(); S.build(clone(v.preset));
  S.x[1] = rBook; S.y[1] = 0; S.z[1] = 0;   // 状態の位置を直に置く(読み口だけ —— 步を進めない・本の値域 ±5000 の外まで)
  const s = E(H, 'inertialDragIsqState')(S), rc = s.receivers.find((x) => x.i === 1), w = rc.omega;
  return { w: norm(w), vec: w, Rd: rc.Rd, md: rc.md, mSrc: S.m[0], betaSum: rc.betaSum, srcBeta: rc.beta[0], negFrac: s.negFrac };
}
const pw = (a, b, ratio) => (a > 0 && b > 0) ? Math.log(b / a) / Math.log(ratio) : null;
export function partN(H, kernel) {
  const HP = H.HP, L = Math.pow(10, findP(HP, MER).scaleExp.L), rMer = A_MER_AU * AU_M / L;
  { const t = nCopy(HP, { shell: false, rd: 1, mf: 1, ro: 1 }, kernel), v = HP.validatePreset(clone(t));
    if (!v.ok) return { kernel, connected: false, why: String((v.errors || [])[0] || '').slice(0, 200) }; }
  const plain = [], shell = [];
  for (const d of N_DIST) {
    const r = rMer * d, g = (o) => nOmega(H, nCopy(HP, { ro: 1, ...o }, kernel), r);
    const b = g({ shell: false, rd: 1, mf: 1 }), rd = N_RD.map((k) => g({ shell: false, rd: k, mf: 1 })), mm = N_M.map((k) => g({ shell: false, rd: 1, mf: k }));
    const b2 = nOmega(H, nCopy(HP, { shell: false, rd: 1, mf: 1, ro: 1 }, kernel), 2 * r);
    const dirs = rd.concat(mm, [b2]).map((x) => ang(x.vec, b.vec));
    plain.push({ dAU: r10(A_MER_AU * d), rM: r10(r * L), omega: r10(b.w), betaSum: r10(b.betaSum), srcBeta: r10(b.srcBeta), xi: r10((b.mSrc / (r * r)) / (b.md / (b.Rd * b.Rd))),
      pRdLo: r10(pw(rd[0].w, rd[1].w, 2)), pRdHi: r10(pw(rd[1].w, rd[2].w, 2)), pmLo: r10(pw(mm[0].w, mm[1].w, 10)), pmHi: r10(pw(mm[1].w, mm[2].w, 10)), pr: r10(pw(b.w, b2.w, 2)),
      dirMaxRad: r10(Math.max(...dirs)), omegaHat: b.vec.map((x) => r10(x / b.w)), negFrac: r10(b.negFrac) });
    const c = g({ shell: true, rd: 1, mf: 1 }), crd = N_RD.map((k) => g({ shell: true, rd: k, mf: 1 })), cm = N_M.map((k) => g({ shell: true, rd: 1, mf: k })), cro = N_RO.map((k) => g({ shell: true, rd: 1, mf: 1, ro: k }));
    const c2 = nOmega(H, nCopy(HP, { shell: true, rd: 1, mf: 1, ro: 1 }, kernel), 2 * r);
    shell.push({ dAU: r10(A_MER_AU * d), omega: r10(c.w), betaSum: r10(c.betaSum), pRdLo: r10(pw(crd[0].w, crd[1].w, 2)), pRdHi: r10(pw(crd[1].w, crd[2].w, 2)),
      pmLo: r10(pw(cm[0].w, cm[1].w, 10)), pmHi: r10(pw(cm[1].w, cm[2].w, 10)), pRoLo: r10(pw(cro[0].w, cro[1].w, 4 / 3)), pRoHi: r10(pw(cro[1].w, cro[2].w, 1.5)), pr: r10(pw(c.w, c2.w, 2)),
      omegaRatioToPlain: r10(c.w / b.w) });
  }
  const far = plain[plain.length - 1], farS = shell[shell.length - 1];
  return { kernel: kernel || null, connected: true, recv: N_RECV, distAU: N_DIST.map((d) => r10(A_MER_AU * d)), plain, shell,
    limit: { pRd: far.pRdHi, pm: far.pmHi, pr: far.pr, shellPRd: farS.pRdHi, shellPRo: farS.pRoHi, shellPm: farS.pmHi },
    estimate: { pRd: 2, pm: -1, pr: -4, why: '一様の極限(源の場 ≪ 受け手の自己の場・受け手の上で源の M2 の場がほぼ一様な勾配)の見積り: amp = −n̂·∇(m_d,j M2_j/W) の W ≈ 受け手の自己の場 m_d,i K2(t R_d,i; R_d,i) ∝ m_d,i/R_d,i²。第 1 項 m_d,j M2′/W ∝ R_d,i²/m_d,i・第 2 項 m_d,j M2 (n̂·∇W)/W² ∝ R_d,i/m_d,i × (受け手の上の向きの変化 ∝ R_d,i/r) —— どちらも R_d,i²/m_d,i・M2′ ∝ r⁻⁴' } };
}

/* ───────── 段 X(軸の角の試験と表)───────── */
function orbitNormals(S) {
  const n = S.n, R = (i) => [S.x[i], S.y[i], S.z[i]], V = (i) => [S.vx[i], S.vy[i], S.vz[i]], out = [];
  let L = [0, 0, 0];
  for (let i = 0; i < n; i++) { const l = scale(cross(R(i), V(i)), S.m[i]); L = [L[0] + l[0], L[1] + l[1], L[2] + l[2]]; }
  out.push(scale(L, 1 / norm(L)));
  for (let i = 1; i < n; i++) { const c = cross(sub(R(i), R(0)), sub(V(i), V(0))); out.push(scale(c, 1 / norm(c))); }
  return out;
}
const axesOf = (S) => [...Array(S.n).keys()].map((i) => [S.sax[i], S.say[i], S.saz[i]]);
function runSolar(H, o, geo) {
  const HP = H.HP, base = G311.solarCopy(HP), Tm = Math.pow(10, base.scaleExp.T), Om = geo.OmRefSI * Tm, gv = scale(geo.omHat, (o.f || 0) * Om);
  const drag = clone(G311.INVSQ);
  if (o.q !== undefined) drag.galaxyAxial = { wx: gv[0], wy: gv[1], wz: gv[2], rdPow: o.q };
  if (o.maintain) drag.spinDrag.axisHold = { mode: 'maintain' };
  if (o.kernel) drag.invSq.kernel = o.kernel;
  const b = build(H, G311.solarCopy(HP, drag)), S = b.S, n = S.n;
  const s0 = o.q !== undefined ? E(H, 'inertialDragGalaxyAxialState')(S) : null, Rd = E(H, 'inertialDragIsqState')(S).receivers.map((r) => r.Rd);
  const a0 = axesOf(S), n0 = orbitNormals(S);
  for (let k = 0; k < o.steps; k++) S.step(b.dt);
  const res = { q: o.q === undefined ? null : o.q, f: o.f || 0, steps: o.steps, T: (o.steps - 1) * b.dt, g: gv, Rd, factors: s0 ? s0.receivers.map((r) => r.rdFactor) : null,
    omegaG: s0 ? s0.receivers.map((r) => r.omegaG) : null, refRadius: s0 ? s0.rd.refRadius : null, a0, n0, aT: axesOf(S), nT: orbitNormals(S), fp: fpS(S),
    finite: XV.every((k) => Array.from(S[k].subarray(0, n)).every(Number.isFinite)), badRows: S.inertialDragIsqBadRow || 0 };
  if (o.maintain) { const m = E(H, 'inertialDrag3SpinState')(S).axisHold.maintain; res.maint = { axisCost: m.heat.axisCost, speed: m.speed.signed, perBody: m.heat.perBody }; }   // perBody = 受け手ごとの熱(軸のコストと速さの分の和 —— 読み口 heat.perBody)
  return res;
}
const PAIR_SAME = [0, 5];   // 太陽と木星(どちらも cap6500km の R_d —— 同じ R_d の対)
export function partX(H, quick, kernel) {
  const geo = G311.geometry(), HP = H.HP, base = G311.solarCopy(HP), b0 = build(H, base), dt = b0.dt, pRef = base.timeRef.pRef;
  const steps = Math.round((quick ? G311.N_ORB_QUICK : G311.N_ORB) * pRef / dt), Tm = Math.pow(10, base.scaleExp.T), OmBook = geo.OmRefSI * Tm, n = b0.S.n;
  const ref = runSolar(H, { steps, kernel }, geo), refM = runSolar(H, { steps, maintain: true, kernel }, geo);
  const runs = [], mruns = [];
  for (const q of Q_GRID) for (const f of F_GRID) { runs.push(runSolar(H, { q, f, steps, kernel }, geo)); mruns.push(runSolar(H, { q, f, steps, maintain: true, kernel }, geo)); }
  const Rd = ref.Rd, L = Math.pow(10, base.scaleExp.L);
  const bodies = G311.LABELS.map((label, i) => ({ i, label, RdKm: r10(Rd[i] * L / 1e3), f1: r10(runs.find((r) => r.q === 1).factors[i]), f2: r10(runs.find((r) => r.q === 2).factors[i]) }));
  const rows = runs.map((r) => {
    const per = [], pairs = [];
    for (let i = 0; i < n; i++) {
      const th = ang(r.aT[i], ref.aT[i]), wG = r.omegaG[i], pred = norm(cross(wG, r.a0[i])) * r.T;
      const thN = ang(r.aT[i], r.nT[i]) - ang(ref.aT[i], ref.nT[i]);
      per.push({ i, factor: r10(r.factors[i]), vsNoGalaxy: r10(th), firstOrder: r10(pred), ratio: r10(pred > 0 ? th / pred : null), orbitNormalVsNoGalaxy: r10(thN) });
    }
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      const d = (ang(r.aT[i], r.aT[j]) - ang(r.a0[i], r.a0[j])) - (ang(ref.aT[i], ref.aT[j]) - ang(ref.a0[i], ref.a0[j]));
      const psi = ang(r.a0[i], r.a0[j]), dw = sub(r.omegaG[i], r.omegaG[j]), est = -dot(dw, cross(r.a0[i], r.a0[j])) * r.T / Math.sin(psi);
      pairs.push({ i, j, sameRd: Rd[i] === Rd[j], dfactor: r10(r.factors[i] - r.factors[j]), change: r10(d), firstOrder: r10(est), ratio: r10(Math.abs(est) > 10 * FLOOR_ANG ? d / est : null) });   // 比は見積りが床の 10 倍より大きい対だけ
    }
    const same = pairs.filter((p) => p.sameRd), diff = pairs.filter((p) => !p.sameRd && p.ratio !== null), th = per.map((p) => p.vsNoGalaxy);
    return { q: r.q, f: r.f, omegaG: r10(r.f * OmBook), finite: r.finite, badRows: r.badRows, per, pairs,
      axisMax: r10(Math.max(...th)), axisMin: r10(Math.min(...th)), ratioMin: r10(Math.min(...per.map((p) => p.ratio))), ratioMax: r10(Math.max(...per.map((p) => p.ratio))),
      orbitNormalMax: r10(Math.max(...per.map((p) => Math.abs(p.orbitNormalVsNoGalaxy)))),
      sameRdPairMax: r10(Math.max(...same.map((p) => Math.abs(p.change)))), diffPairMax: r10(Math.max(...pairs.filter((p) => !p.sameRd).map((p) => Math.abs(p.change)))),
      diffPairRatioMin: r10(diff.length ? Math.min(...diff.map((p) => p.ratio)) : null), diffPairRatioMax: r10(diff.length ? Math.max(...diff.map((p) => p.ratio)) : null), nDiffPairs: diff.length,
      allPairMax: r10(Math.max(...pairs.map((p) => Math.abs(p.change)))) };
  });
  const mrows = mruns.map((m) => { const q0 = mruns.find((x) => x.q === 0 && x.f === m.f);
    const pb = m.maint.perBody.map((c, i) => (q0.maint.perBody[i] > 0 ? c / q0.maint.perBody[i] : null));
    return { q: m.q, f: m.f, axisCost: r10(m.maint.axisCost), ratioToQ0: r10(q0.maint.axisCost > 0 ? m.maint.axisCost / q0.maint.axisCost : null), speed: r10(m.maint.speed),
      perBodyRatioToQ0: pb.map(r10),
      axesHeld: m.aT.every((a, i) => a[0] === m.a0[i][0] && a[1] === m.a0[i][1] && a[2] === m.a0[i][2]), finite: m.finite, perBodyCost: m.maint.perBody.map(r10) }; });
  return { kernel: kernel || null, geometry: { omHat: geo.omHat, OmRefSI: geo.OmRefSI, omHatDotNgp: geo.omHatDotNgp }, OmRefBook: r10(OmBook), steps, dt, Teff: r10((steps - 1) * dt),
    orbitsMercury: quick ? G311.N_ORB_QUICK : G311.N_ORB, refRadiusKm: r10(runs.find((r) => r.q === 2).refRadius * L / 1e3), sameRdPair: PAIR_SAME, bodies, rows, maintain: mrows,
    refMaintCost: r10(refM.maint.axisCost), firstStepNote: '最初の步は履歴が無く u = 0・軸の ω を使わない(今の経路 —— 一次の見積りの時間は (步数 − 1) h)',
    note: '大きさは未定(AN395)・銀河の模型からの数ではない —— abs(ω_G) = f Ω_ref の格子(Ω_ref = V₀/R₀ は尺度だけ)' };
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const g = {};
  if (J.A) g.acceptance = J.A.allPass === true;
  if (J.B) g.confirm = J.B.allPass === true;
  if (J.N && J.N.connected === false) g.kernelConnected = false;   // W312B_KERNEL の核を受理しない html(未接続 —— why に理由)
  if (J.N && J.N.connected) {
    const L = J.N.limit;
    g.naturalLimitRd2 = Math.abs(L.pRd - 2) < 1e-3;
    g.naturalLimitMassMinus1 = Math.abs(L.pm + 1) < 1e-3;
    g.naturalLimitDistMinus4 = Math.abs(L.pr + 4) < 1e-3;
    g.naturalDirectionFixed = J.N.plain.filter((r) => r.dAU >= 3).every((r) => r.dirMaxRad < 1e-9);   // 一様の極限の側(近い距離は受け手の上の向きの変化で向きもわずかに動く —— 表に値)
  }
  if (J.X) {
    const X = J.X;
    g.allFinite = X.rows.every((r) => r.finite && r.badRows === 0) && X.maintain.every((m) => m.finite);
    g.linearResponse = X.rows.every((r) => Math.abs(r.ratioMin - 1) < 1e-3 && Math.abs(r.ratioMax - 1) < 1e-3);
    g.sameRdPairUnchanged = X.rows.every((r) => r.sameRdPairMax < FLOOR_ANG);
    g.q0AllPairsUnchanged = X.rows.filter((r) => r.q === 0).every((r) => r.allPairMax < FLOOR_ANG);
    g.diffRdPairsFirstOrder = X.rows.filter((r) => r.q !== 0).every((r) => r.nDiffPairs > 0 && Math.abs(r.diffPairRatioMin - 1) < 1e-2 && Math.abs(r.diffPairRatioMax - 1) < 1e-2);
    g.maintainAxesHeld = X.maintain.every((m) => m.axesHeld);
    g.capFactorOne = X.bodies[0].f1 === 1 && X.bodies[0].f2 === 1 && X.bodies[5].f2 === 1;
  }
  return g;
}

/* ───────── 文書の表と数(PHYSICS〔第312便b〕—— QA docs.galaxialRd312 が正本から作り直して逐語で照合する)───────── */
const e2s = (v) => (v === null || v === undefined) ? '—' : Number(v).toExponential(2);
const e3s = (v) => (v === null || v === undefined) ? '—' : Number(v).toExponential(3);
const f2 = (v) => (v === null || v === undefined) ? '—' : Number(v).toFixed(2);
const f3 = (v) => (v === null || v === undefined) ? '—' : Number(v).toFixed(3);
const fl = (v, floor) => (v === null || v === undefined) ? '—' : (v === 0 ? '0' : fmtFloor(v, floor, 3));
export function physicsTables(J) {
  const out = [], B = J.B;
  out.push('| 照合 | 値 |', '|---|---|');
  out.push(`| 受理の表(rdPow・refRadius・未知の鍵・物理の単位・旧則の本) | ${J.A.nPass}/${J.A.nCases} |`);
  out.push(`| rdPow の無い宣言と rdPow 0 の 20 步・読み口の ω_G | ${B.omitSameAsPow0.run && B.omitSameAsPow0.omegaG ? 'ビット同一' : '違う'} |`);
  out.push(`| 同じ状態の build の β・並進の右辺・回転の係数(q = 0・1・2 —— 銀河の有無) | ${B.fixedState.every((r) => r.A && r.U && r.beta && r.rot && r.deg) ? 'ビット同一' : '違う'} |`);
  out.push(`| 軸の ω = 銀河なし + ω_G (R_d,i/R_ref)^q(器が同じ式で作った係数) | ${B.fixedState.every((r) => r.omegaPlusFG) ? 'ビット同一' : '違う'} |`);
  out.push(`| 孤立の受け手の ω/ω_G(R_d = R_ref × 1/2・1・2 —— q = 0・1・2) | ${B.isolated.every((r) => r.exact) ? B.isolated.map((r) => r.ratio).join('・') : '違う'} |`);
  out.push(`| 位置の不変(受け手を 3 か所へ)・同じ R_d で質量 ${B.position.massRatio} 倍の双子の銀河の分 | ${B.position.invariant ? 'ビット同一' : '違う'}・${B.position.sameRdSame ? 'ビット同一' : '違う'} |`);
  out.push(`| 2 步の並進・自転の大きさ(q = 2 と銀河なし)・明示の 0 と未宣言の 20 步 | ${B.twoSteps.xv && B.twoSteps.u ? 'ビット同一' : '違う'}・${B.explicitZero.runSame ? 'ビット同一' : '違う'} |`);
  out.push(`| R_ref の既定(6.5×10⁶ m / 10^L)[本の長さ]・cap6500km の受け手の係数 | ${B.refDefault.refRadius}・${B.refDefault.capFactorOne ? 1 : '1 でない'} |`);
  if (J.N && J.N.connected) {
    out.push('', '| 距離 [au] | 受け手の Σβ | 源の場/自己の場の尺度 ξ | 軸の ω [1/本の時間] | R_d の次数(1/2→1・1→2) | 質量の次数(1/10→1・1→10) | 距離の次数 |', '|---|---|---|---|---|---|---|');
    for (const r of J.N.plain) out.push(`| ${r.dAU} | ${e2s(r.betaSum)} | ${e2s(r.xi)} | ${e3s(r.omega)} | ${f3(r.pRdLo)}・${f3(r.pRdHi)} | ${f3(r.pmLo)}・${f3(r.pmHi)} | ${f3(r.pr)} |`);
    out.push('', '| 距離 [au](外殻あり) | 受け手の Σβ | dragCore の R_d の次数(1/2→1・1→2) | 外径の次数(3/4→1・1→3/2) | 質量の次数(1/10→1・1→10) | 距離の次数 | 外殻なしとの ω の比 |', '|---|---|---|---|---|---|---|');
    for (const r of J.N.shell) out.push(`| ${r.dAU} | ${e2s(r.betaSum)} | ${f3(r.pRdLo)}・${f3(r.pRdHi)} | ${f3(r.pRoLo)}・${f3(r.pRoHi)} | ${f3(r.pmLo)}・${f3(r.pmHi)} | ${f3(r.pr)} | ${f2(r.omegaRatioToPlain)} |`);
  }
  if (J.X) {
    const X = J.X;
    out.push('', '| 天体 | 引きずりの半径 R_d [km] | 係数 q = 1 | 係数 q = 2 |', '|---|---|---|---|');
    for (const b of X.bodies) out.push(`| ${b.label} | ${Number(b.RdKm).toFixed(1)} | ${f3(b.f1)} | ${f3(b.f2)} |`);
    out.push('', '| q | f | 軸の角(銀河なしとの)の最大 [rad] | 一次の見積りとの比の範囲 | 軌道法線との角の変化の最大 [rad] | 同じ R_d の対(太陽と木星)の角の変化 [rad] | 違う R_d の対の角の変化の最大 [rad] | 違う R_d の対の一次の見積りとの比の範囲 |', '|---|---|---|---|---|---|---|---|');
    for (const r of X.rows) out.push(`| ${r.q} | ${r.f} | ${e2s(r.axisMax)} | ${f3(r.ratioMin)}〜${f3(r.ratioMax)} | ${e2s(r.orbitNormalMax)} | ${fl(r.sameRdPairMax, FLOOR_ANG)} | ${fl(r.diffPairMax, FLOOR_ANG)} | ${r.diffPairRatioMin === null ? '—' : f3(r.diffPairRatioMin) + '〜' + f3(r.diffPairRatioMax)} |`);
    out.push('', '| q | f | 維持の型の軸のコストの和 [本の単位] | 和の q = 0 との比 | 水星・金星・地球・火星の熱(受け手ごと)の q = 0 との比 | 軸は保たれた |', '|---|---|---|---|---|---|');
    for (const m of X.maintain) out.push(`| ${m.q} | ${m.f} | ${e3s(m.axisCost)} | ${m.ratioToQ0 === null ? '—' : f3(m.ratioToQ0)} | ${[1, 2, 3, 4].map((i) => m.perBodyRatioToQ0[i] === null ? '—' : f3(m.perBodyRatioToQ0[i])).join('・')} | ${m.axesHeld ? 'はい' : 'いいえ'} |`);
  }
  return out.join('\n');
}
export function docNumbers(J) {
  const out = [String(J.X ? J.X.steps : ''), String(J.X ? J.X.refRadiusKm : '')];
  if (J.N && J.N.connected) out.push(f3(J.N.limit.pRd), f3(J.N.limit.pm), f3(J.N.limit.shellPRo));
  return out.filter((s) => s !== '');
}

export function runAll(H, o = {}) {
  const quick = !!o.quick, kernel = o.kernel || null, stages = o.stages || ['A', 'B', 'N', 'X'], t = {};
  let t0 = Date.now();
  const tick = (k) => { t[k] = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now(); };
  const J = { quick, kernel, stages };
  if (stages.includes('A')) { J.A = partA(H); tick('A'); }
  if (stages.includes('B')) { J.B = partB(H); tick('B'); }
  if (stages.includes('N')) { J.N = partN(H, kernel); tick('N'); }
  if (stages.includes('X') && !(J.N && J.N.connected === false)) { J.X = partX(H, quick, kernel); tick('X'); }
  J.gates = gatesOf(J);
  J.ok = Object.values(J.gates).every(Boolean);
  J.timing = t;
  return J;
}

// 鍵と読み口を読む既存の器・QA(第312便b の枝で列挙して走らせた —— 報告に結果)
export const VERSION_READERS = [
  { file: 'tests/exp-w311b-galaxial.mjs・正本 galaxial-w311b.json', reads: 'galaxyAxial の受理(未知の鍵の拒否)・build・読み口 inertialDragGalaxyAxialState', handling: '変わらない(rdPow の無い宣言は第311便b とビット同一 —— 試走で正本と照合・領域 hash は変わる〔鎖で作り直す〕)' },
  { file: 'tests/qa.mjs behavior.galaxial311・docs.galaxial311', reads: 'GALAXY_AXIAL_VERSION の世代切替・受理・build', handling: '変わらない(GALAXY_AXIAL_VERSION は w311b-galaxial-1 のまま —— R_d の応答は別の版 GALAXY_AXIAL_RD_VERSION)' },
  { file: 'tests/exp-w309a-invsq.mjs・tests/exp-w310d-mdsweep.mjs・tests/exp-w311d-planet3.mjs', reads: '新則の受理・build(galaxyAxial を宣言しない)・dragCoreDefault の 10^L', handling: '変わらない(inertialDragLenPrepare は galaxyAxial の無い本で今のまま)' },
];

export async function main() {
  const TARGET = process.env.W312B_TARGET || 'beta/index.html', kernel = process.env.W312B_KERNEL || null;
  const OUT = process.env.W312B_OUT || path.join(ROOT, 'tests', 'out', kernel ? `galaxialrd-w312b-${kernel}.json` : 'galaxialrd-w312b.json');
  const quick = process.env.W312B_QUICK === '1', stages = process.env.W312B_STAGES ? process.env.W312B_STAGES.split(',') : undefined;
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now();
  const W281A_SCOPE = w281aScopeStamp(html, REGEN_SCOPE);
  const H = loadHtmlHeadless(html);
  pinDecl315c(H.evalExpr);   // 第315便c(AN406): 在位の 7 本の宣言を移行の前の写しへ(本ごとの門 —— 基点の html では no-op・正本の欄は足さない)
  const R = runAll(H, { quick, kernel, stages });
  const out = { version: HARNESS_VERSION, generator: 'tests/exp-w312b-galaxialrd.mjs', target: TARGET,
    targetSha256: crypto.createHash('sha256').update(fs.readFileSync(html)).digest('hex'),
    ruling: '原仮定者の裁定(第114報)一様軸引きずりは受ける側の dragCore の R_d に応じて変わる・一様重力の様に一定の勾配で近似するのでどの場所でも R_d が同じなら影響は同じ・一様回転引きずりは慣性系であってもコリオリの項が必要(背景側の支配天体を明示していない場合は規約として無視)・決断事項 AN395・統括の検証項目 R231',
    galaxyAxialVersion: E(H, 'GALAXY_AXIAL_VERSION'), galaxyAxialRdVersion: E(H, 'GALAXY_AXIAL_RD_VERSION'), refRadiusDefaultM: E(H, 'GALAXY_AXIAL_REF_RADIUS_M'),
    invSqVersion: E(H, 'REL_DRAG_INVSQ_VERSION'), qGrid: Q_GRID, fGrid: F_GRID, versionReaders: VERSION_READERS, notClaim: NOT_CLAIM, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w312b-galaxialrd.mjs', 'tests/lib-w315c-legacy7.mjs', 'tests/exp-w311b-galaxial.mjs', 'tests/lib-w299c-planets3d.mjs', 'tests/lib-w311c-h4carry.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第312便b', target: TARGET, code: CODE, inputs: [TARGET, LEGACY7_DATA_FILE] }), {
    harnessVersion: HARNESS_VERSION,
    engine: 'Node の headless(tests/lib-w279b-headless.mjs の loadHtmlHeadless —— html の本文をそのまま実行・1 プロセス)',
    notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s', JSON.stringify(out.timing));
}
if (IS_MAIN) await main();
