// 第303便a(原仮定者の裁定(第93報)①②・決断事項 AN306 ①・AN312 ②・統括の検証項目 R191)—— **在位のフィットの本 4 本(🌡️🟫🟪🌦️)を semic(第302便d の既定の步)で
// 再フィットし、🌔 へ 🌦️ の W_bg を移送する器**(Node だけ —— 対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、アプリの步をそのまま走らせる・1 プロセス)。
//
// ■ なぜ(第93報)
//   第302便c は在位の惑星の本 7 本に局所重力 G_loc(cLocPow n=−3)を宣言し、🌡️ の W_bg を G_loc の上で 489275.3 に合わせ直した(引きずりが担う近点率は 0.019″/世紀)。
//   n=−3 は「1PN の式の値の再現」を目的に選ばれた値で、引きずりを主とする方針(G_loc は引きずりだけでは合わない量を埋めるため)と逆 —— 本便で在位の 7 本から外す。
//   フィットの本 🟫🟪🌦️ と 🌡️ の fitRecord は分割の世代(第302便h の写し)の記録のまま —— 既定の步 semic で合わせ直して記録を更新する。
//
// ■ 段(正本 tests/out/refit-w303a.json —— 段 refit-303a)
//   R 再フィット(4 本 —— 起点は第302便の宣言〔tests/lib-w303a-pre.mjs の DECL302〕の値。本の今の宣言に依らない —— 正本の再生成で同じ根):
//     🌡️ 三次元・8 公転・近点率の差(引きずり OFF の対照〔重力だけ〕との差)を 43.0″/世紀に —— 第302便c の割線(tests/exp-w302c-wbgest.mjs の fitMercury・G_loc なし)と同じ手続き。
//     🟫 二次元・8 公転・近点率の差(引きずり OFF の対照との差・検出器 B —— tests/exp-w295c-inertial3.mjs runPair)を 43.0″/世紀に —— c = 1/W_bg の割線。
//     🟪 二次元・dt 0.16・8 公転の平均周期を 551856.43872 s(Buie, Tholen & Grundy 2012)に —— c = 1/W_bg の割線。
//     どれも W_bg を 7 桁に丸め、h と h/2 で測り直す(門 |残差| + |q_h − q_h/2| ≤ 許容)。🟫🟪 は固定した W_bg で dragCore の f を振る(同定の可否 —— 記録の notIdentifiable)。
//     🌦️ 三次元・118 公転窓・4 つのノブ(c = 1/W_bg・近地点距離・t=0 の接触離心率・接触傾斜)→ 4 つの量(近点回転の周期・恒星月・平均離心率・平均傾斜)の
//     Newton(差分の Jacobian・h)。W_bg を 6 桁・初期配置を元の桁に丸め、h / h/2 / h/4 と 354 公転窓で測り直す。
//   T 🌔 への移送(フィットと呼ばない): 🌦️ の新しい W_bg を 🌔 に置いた 118 公転窓の恒星月・朔望月(一様換算)・近点回転の周期(h と h/2)。
//   G 門: 再フィットの門・本の宣言(html)が正本の値と記録(fitRecord —— 受理・条件の署名)と同じ・在位の本に physics.gLoc が 0 本・6 本は引きずり OFF のまま。
//   D 分割の世代との差: 第302便の宣言(DECL302)の W_bg・記録の model と、semic の再フィットの値の差(前後表 —— PHYSICS〔第303便a〕)。
//
// ■ しないこと・言わないこと
//   ・標的を書き換えない(水星は照合規約の 43.0″/世紀のまま —— 観測の総量の参照 42.9799±0.0009〔Park 2017〕と A1 の追加の歳差は記録の source に併記)。閾値を緩めない。
//   ・刻み依存の誤差を W_bg で吸収しない。架空の σ を作らない。G_loc の n の測定(第302便b・c の正本)を書き換えない。
//   ・「43″ が出た」「GR と一致した」「現実を再現した」と書かない。届かないものは「この探索範囲では未達 —— 次の見直し」。
//
// 実行(Node だけ・1 プロセス): node tests/exp-w303a-refit.mjs → 正本 tests/out/refit-w303a.json(W303A_OUT で出力先・W303A_PARTS=R,T,G,D で段を絞る〔絞ったら正本にしない〕)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as PL from './exp-w299c-planets3d.mjs';
import * as P3 from './lib-w299c-planets3d.mjs';
import { fitMercury, TARGET_APS, TOL_APS } from './exp-w302c-wbgest.mjs';
import * as C from './exp-w295c-inertial3.mjs';
import * as L from './lib-w297b-fit.mjs';
import * as L296 from './lib-w296b-fit.mjs';
import * as M3 from './exp-w298c-moon3d.mjs';
import { runEm3, windowsOf as emWindowsOf, emOnlyBodies, emOnlyPhysics, declCheck as emDeclCheck } from './exp-w300b-emonly.mjs';
import { DECL302, DECL302_DATA_FILE, LIB_VERSION as PRE_VERSION } from './lib-w303a-pre.mjs';
import { pinDecl305 as pinDecl305e, DECL305_DATA_FILE as DECL305E_DATA_FILE } from './lib-w306e-pre.mjs';   // 第306便e(AN339 の案 (A)・R208): 🟪 の第305便の宣言の写し(この正本は第303便a の再フィットの記録 —— 🟪 の欄は第303便a から第305便まで不変)
import { pinDecl305 as pinDecl305a, DECL305_DATA_FILE as DECL305A_DATA_FILE } from './lib-w306a-pre.mjs';   // 第306便a(AN336): 在位の惑星 7 本の宣言を変えた世代では、この正本(第303便a の再フィットの記録)は第305便の宣言の写しで測る
import { pinDecl303, DECL303_DATA_FILE } from './lib-w304c-pre.mjs';
import { pinDecl307d, DECL307D_DATA_FILE } from './lib-w308d-pre.mjs';   // 第308便d(AN351・R217): 🟫🌡️ の fitRecord の標的の役割を宣言した世代では、この正本(第303便a の再フィットの記録)を第307便の宣言の写しで照合する(第307便の html では no-op)   // 第304便c: 第303便の 🌦️🌔 の宣言の写し(この正本は第303便a の再フィットの記録 —— 本の宣言は第304便c で基線を見直した)
import { pinDecl315c, LEGACY7_DATA_FILE } from './lib-w315c-legacy7.mjs';   // 第315便c(決断事項 AN406・R244): 在位の 7 本を K1 へ移した世代では、この器は移行の前(af2f426)の宣言の写しで測る
const REGEN_SCOPE = {"presets":"all","roots":["$","DT","FIT_COND_KEYS","FIT_COND_VERSION","FIT_KNOB_KEYS","FIT_NUMERICS_KEYS","FIT_RECORD_KEYS","FIT_RECORD_VERSION","FIT_RECORD_VERSIONS","FIT_RESIDUAL_KEYS","FIT_TARGET_KEYS","FIT_TOL_KEYS","HP.DRAG_CORE_RMAX_FACTOR","HP.DRAG_CORE_VERSION","HP.FIT_COND_VERSION","HP.GLOC_VERSION","HP.REL_DRAG_COMPOSE_DEFAULT","HP.REL_DRAG_INERTIAL_VERSION","HP.REL_DRAG_NORM_VERSION","HP.REL_DRAG_SEMIC_VERSION","HP.REL_DRAG_SOLVE_FROM_DEFAULT","HP.REL_DRAG_SPIN_NODES","HP.allPresets","HP.coord3d","HP.dfmGaussLegendre01","HP.dfmMeshVelocityFieldAt","HP.dragCoreLookup","HP.dragCoreState","HP.fitCondInputsOf","HP.fitCondSig","HP.fitCondStateOf","HP.gLocPeriAdvance","HP.gLocState","HP.geoEffectiveMode","HP.geoLawOfSim","HP.inertialDragLedgerOf","HP.inertialDragState","HP.inertialSpinMoment","HP.relDragBackgroundOf","HP.relDragStepOrderOf","HP.sim","HP.synodic","HP.validateFitRecord","HP.validatePreset","HP.wbgEstimateOf","LAWS","T","ab","ch","ckRestoreOne","ckSnapOne","ctx","cw","dfmSphereKernelQEff","fmt","pnSource","synUniform","validateFitRecord"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w303a-refit-1';
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const PARTS = String(process.env.W303A_PARTS || 'R,T,G,D').split(',').filter(Boolean);
const clone = (x) => JSON.parse(JSON.stringify(x));
const find = (HP, id) => { const p = HP.allPresets().find((q) => q.id === id); if (!p) throw new Error('no preset ' + id); return p; };
const T7 = (x) => Number(x.toPrecision(7));
const T6 = (x) => Number(x.toPrecision(6));
export const IDS = Object.freeze({ mer3: 'mercurySunInertial3d', mer2: 'mercurySunInertialFit', plu: 'plutoCharonInertialFit', ems3: 'earthMoonSunInertial3d', emo: 'earthMoonOnly3d' });
/** 再フィットの記録の第303便a の注記(fixed の末尾 —— 旧 cond.sig は履歴)。 */
export const REFIT_NOTE = (emoji, w302, sig302) => '第303便a(原仮定者の裁定(第93報)①②・統括の検証項目 R191)の再フィット: 積分器の步は semic(第302便d の既定)・局所重力 G_loc なしで、分割の世代の W_bg '
  + w302 + ' を起点に合わせ直した(' + emoji + ')。分割の世代の記録(旧 cond.sig ' + sig302 + ')は履歴 —— 前後表は PHYSICS〔第303便a〕';
/** 🌦️ の W_bg の読み(統括の指示 —— 第303便c の基線の監査の中間: 引きずり OFF と B1 の近地点の周期の差は 118 公転窓の抽出器 M1 の偏り・軟化・初期配置の平均の要素・
 *  e′ の欠落でほぼ説明される。数は第303便c の節が持つ —— ここは参照だけ)。🌦️ の fitRecord の notFitted と観測カード・🌔 の説明に同じ趣旨を 1 行ずつ。 */
export const EMS_WBG_NOTE = 'この W_bg が埋めているのは主に 118 窓の抽出器の偏りと軟化(基線の監査は第303便c)—— 物理の量と読まない';
/** A1 の列(1PN の上の追加の歳差 —— 候補の行 paper/data/pn1-ephemeris-candidates.csv の EPM2011 の水星の行)。 */
export const A1_MERCURY = Object.freeze({ value: -0.0020, sigma: 0.0030, unit: '″/世紀', ephem: 'EPM2011', ref: 'Pitjeva & Pitjev 2013(MNRAS 432, 3431)',
  text: 'A1 の列: 1PN の上の追加の近日点歳差 −0.0020±0.0030″/世紀(EPM2011 —— Pitjeva & Pitjev 2013・原資料の σ・候補の行 sigma_primary=unverified)—— 比較の標的は「1PN の値+追加 ± σ」' });

/* ── 本の写し(引きずりの強さだけを差し替える —— G_loc は外す・記録は外す) ── */
function withWbg(p, W) {
  const q = clone(p), rd = q.physics.relativeDrag;
  delete rd.gain; delete q.physics.gLoc; delete q.fitRecord; delete q.abBody;
  if (W === null) { rd.Wbg = null; rd.enabled = false; } else { rd.Wbg = W; delete rd.enabled; }
  return q;
}
/* ── 二次元の二体(🟫🟪): tests/exp-w295c-inertial3.mjs runPair(検出器 B・同方向の周回) ── */
function run2(HP, p, dt, revMax = 8) {
  const R = C.runPair(HP, p, { ci: 0, oi: 1, dt, revMax });
  const U = C.timeUnits(p.scaleExp), n = R.rev.length;
  return { steps: R.steps, revN: n, nan: R.nan, aps: R.B ? R.B.slopeDegPerTime * U.century * 3600 : null, periodSec: (R.rev[n - 1] - R.rev[0]) / (n - 1) * U.sec,
    drag: R.drag, warnings: R.warnings };
}
/** 1 次元の割線(c = 1/W_bg)。f(W) = 量 − 標的。起点 W0(第302便の宣言)。|f| ≤ tol か 12 回で止め、最良の反復(|f| 最小)を返す。 */
function secant(fOf, W0, tol, log) {
  const iters = [];
  let c0 = 1 / W0, f0 = fOf(1 / c0); iters.push({ Wbg: 1 / c0, f: f0 }); log(`  割線 0: W ${1 / c0}・f ${f0}`);
  if (Math.abs(f0) <= tol) return { iters, best: iters[0] };
  let c1 = c0 * (1 + 1e-4), f1 = fOf(1 / c1); iters.push({ Wbg: 1 / c1, f: f1 }); log(`  割線 1: W ${1 / c1}・f ${f1}`);
  for (let it = 0; it < 12 && Math.abs(f1) > tol; it++) {
    if (f1 === f0) break;
    const c2 = c1 - f1 * (c1 - c0) / (f1 - f0);
    c0 = c1; f0 = f1; c1 = c2; f1 = fOf(1 / c1); iters.push({ Wbg: 1 / c1, f: f1 }); log(`  割線 ${iters.length - 1}: W ${1 / c1}・f ${f1}`);
  }
  const best = iters.slice().sort((a, b) => Math.abs(a.f) - Math.abs(b.f))[0];
  return { iters, best };
}

/* ── 段 R: 🌡️ ── */
export function refitMer3(HP, log) {
  const d302 = DECL302[IDS.mer3], fit = fitMercury(HP, null, (r) => log(`🌡️ W_bg ${r.Wbg}・差 ${r.diff}(h/2 ${r.diffH2})`));
  return { id: IDS.mer3, emoji: '🌡️', Wbg302: d302.relativeDrag.Wbg, gLoc302: d302.gLoc, start: 1 / PL_PRE_GAIN(), fit,
    gate: fit.reachable === true && fit.gate === true && Math.abs(fit.residual) + fit.h2gap <= TOL_APS, rule: '第302便c の fitMercury(G_loc なし —— 割線の起点は第299便c の gain 0.004522419 = W_bg 221.1205993960312)' };
}
const PL_PRE_GAIN = () => 0.004522419;
/* ── 段 R: 🟫 ── */
export function refitMer2(HP, log) {
  const p0 = find(HP, IDS.mer2), d302 = DECL302[IDS.mer2], dt = 0.016, obs = 43.0, tol = 1e-5;
  const ctl = run2(HP, withWbg(p0, null), dt), ctl2 = run2(HP, withWbg(p0, null), dt / 2);
  const f = (W) => run2(HP, withWbg(p0, W), dt).aps - ctl.aps - obs;
  const s = secant(f, d302.relativeDrag.Wbg, tol, (m) => log('🟫' + m));
  const Wfit = T7(s.best.Wbg);
  const mh = run2(HP, withWbg(p0, Wfit), dt), mh2 = run2(HP, withWbg(p0, Wfit), dt / 2);
  const model = mh.aps - ctl.aps, modelH2 = mh2.aps - ctl2.aps, residual = model - obs, h2 = Math.abs(modelH2 - model);
  // dragCore の f の掃引(太陽の R_c/R = 0.3・固定した W_bg —— 第297便b の MER_F_SCAN と同じ格子)
  const sc = L296.MER_F_SCAN, rows = sc.f.map((fv) => { const q = withWbg(p0, Wfit); q.bodies[sc.index].dragCore = { massFrac: fv, radius: L296.coreRadius(sc.x, q.bodies[sc.index].radius) };
    const r = run2(HP, q, dt); return { f: fv, aps: r.aps - ctl.aps, steps: r.steps }; });
  const span = Math.max(...rows.map((z) => z.aps)) - Math.min(...rows.map((z) => z.aps));
  log(`🟫 W_bg ${Wfit}・差 ${model}(h/2 ${modelH2})・f の幅 ${span}`);
  return { id: IDS.mer2, emoji: '🟫', Wbg302: d302.relativeDrag.Wbg, dt, obs, ctl: { aps: ctl.aps, apsH2: ctl2.aps, periodSec: ctl.periodSec }, secant: s, Wbg: Wfit,
    model, modelH2, residual, h2, steps: mh.steps, periodSec: mh.periodSec, fScan: { index: sc.index, x: sc.x, rows, span },
    gate: Math.abs(residual) + h2 <= L.TOLS.mer.value && !mh.nan && !mh2.nan };
}
/* ── 段 R: 🟪 ── */
export function refitPlu(HP, log) {
  const p0 = find(HP, IDS.plu), d302 = DECL302[IDS.plu], dt = 0.16, obs = 551856.43872, tol = 1e-5;
  const f = (W) => run2(HP, withWbg(p0, W), dt).periodSec - obs;
  const s = secant(f, d302.relativeDrag.Wbg, tol, (m) => log('🟪' + m));
  const Wfit = T7(s.best.Wbg);
  const mh = run2(HP, withWbg(p0, Wfit), dt), mh2 = run2(HP, withWbg(p0, Wfit), dt / 2), m16 = run2(HP, withWbg(p0, Wfit), dt, 16);
  const model = mh.periodSec, residual = model - obs, h2 = Math.abs(mh2.periodSec - model);
  const scans = L296.PLU_F_SCAN.map((sc) => ({ index: sc.index, x: sc.x, rows: sc.f.map((fv) => { const q = withWbg(p0, Wfit); q.bodies[sc.index].dragCore = { massFrac: fv, radius: L296.coreRadius(sc.x, q.bodies[sc.index].radius) };
    const r = run2(HP, q, dt); return { f: fv, period: r.periodSec, steps: r.steps }; }) }));
  const all = scans.flatMap((z) => z.rows.map((w) => w.period)), span = Math.max(...all) - Math.min(...all);
  log(`🟪 W_bg ${Wfit}・周期 ${model}(h/2 ${mh2.periodSec})・f の幅 ${span}`);
  return { id: IDS.plu, emoji: '🟪', Wbg302: d302.relativeDrag.Wbg, dt, obs, secant: s, Wbg: Wfit, model, modelH2: mh2.periodSec, residual, h2, steps: mh.steps,
    rev16: { y: m16.periodSec, diffFromH: m16.periodSec - model, revN: m16.revN }, fScan: { scans, span },
    gate: Math.abs(residual) + h2 <= L.TOLS.plu.value && !mh.nan && !mh2.nan };
}
/* ── 段 R: 🌦️(4 元の Newton) ── */
const EM_OBS = Object.freeze([M3.MOON.target.obs, M3.MOON.sid.days, M3.MOON.eMean.value, M3.MOON.inc.deg]);
/** 🌦️ の写し: 今の本の physics(G_loc なし)に W_bg を当て、地球と月を 🌥️(二次元 —— 写しの元 M3.SRC_ID)の体から icBodies3 で置き直す(器 tests/exp-w298c-moon3d.mjs の variant3 と同じ体)。
 *  k.W があれば W_bg はその値そのもの(丸めた最終値 —— 1/(1/W) の丸めを入れない)。 */
export function emDecl(HP, base, k) {
  const q = clone(base), src = find(HP, M3.SRC_ID); delete q.fitRecord; delete q.abBody; delete q.physics.gLoc;
  q.physics.relativeDrag.Wbg = (k.W !== undefined) ? k.W : 1 / k.c; delete q.physics.relativeDrag.enabled; delete q.physics.relativeDrag.gain;
  q.bodies = M3.icBodies3(src.bodies, src.physics.G, { rp: k.rp, e0: k.e0, inc: k.inc });
  return q;
}
function emRun(HP, base, k, dt, revMax = 118, wins = [118]) {
  const q = emDecl(HP, base, k);
  const R = M3.runEmx3(HP, q, { dt, revMax });
  if (!R.complete || R.nan) throw new Error('🌦️ の走行が窓を満たさない(stop ' + R.stop + ')');
  const W = wins.map((N) => { const w = L.emMethods(R.ev, N, { year: M3.YEAR, day: M3.DAY }); const tB = R.ev.rev[N - 1], E = R.ev.ecc.filter((z) => z[0] <= tB && z[4] !== undefined);
    w.incMean = E.length ? E.reduce((s, z) => s + z[4], 0) / E.length : null; return w; });
  const w = W[0];
  return { y: [w.T1, w.sid, w.eOsc, w.incMean], steps: R.steps, windows: W, drag: R.drag };
}
function solve4(A, b) {   // ガウスの消去(部分ピボット)
  const n = 4, M = A.map((r, i) => r.concat([b[i]]));
  for (let i = 0; i < n; i++) { let p = i; for (let j = i + 1; j < n; j++) if (Math.abs(M[j][i]) > Math.abs(M[p][i])) p = j; [M[i], M[p]] = [M[p], M[i]];
    for (let j = i + 1; j < n; j++) { const f = M[j][i] / M[i][i]; for (let k = i; k <= n; k++) M[j][k] -= f * M[i][k]; } }
  const x = new Array(n).fill(0); for (let i = n - 1; i >= 0; i--) { let s = M[i][n]; for (let k = i + 1; k < n; k++) s -= M[i][k] * x[k]; x[i] = s / M[i][i]; }
  return x;
}
export function refitEms(HP, log) {
  const p0 = find(HP, IDS.ems3), d302 = DECL302[IDS.ems3], fr = d302.fitRecord, kn = (key) => fr.knobs.find((z) => z.key === key).final;
  const base = clone(p0), dt = M3.DT;
  const k0 = { c: 1 / d302.relativeDrag.Wbg, rp: kn('initial.moonPerigeeDistance'), e0: kn('initial.moonOscEccentricity0'), inc: kn('initial.moonOscInclination0') };
  const KEYS = ['c', 'rp', 'e0', 'inc'], STEP = { c: k0.c * 1e-3, rp: 1e-4, e0: 1e-4, inc: 1e-3 };
  const r0 = emRun(HP, base, k0, dt); log(`🌦️ 起点 ${JSON.stringify(k0)} → ${JSON.stringify(r0.y)}`);
  const J = [[], [], [], []];
  for (let j = 0; j < 4; j++) { const kk = Object.assign({}, k0, { [KEYS[j]]: k0[KEYS[j]] + STEP[KEYS[j]] }); const r = emRun(HP, base, kk, dt);
    for (let i = 0; i < 4; i++) J[i][j] = (r.y[i] - r0.y[i]) / STEP[KEYS[j]]; log(`🌦️ ∂/∂${KEYS[j]} ${JSON.stringify(J.map((row) => row[j]))}`); }
  const res0 = r0.y.map((v, i) => v - EM_OBS[i]);
  const dx = solve4(J, res0.map((v) => -v));
  const k1 = { c: k0.c + dx[0], rp: k0.rp + dx[1], e0: k0.e0 + dx[2], inc: k0.inc + dx[3] };
  // 丸め: W_bg 6 桁(第298便c の gain と同じ桁数)・近地点距離 8 桁・e0 6 桁・傾斜 6 桁(第298便c の桁のまま)
  const Wfit = T6(1 / k1.c), kf = { W: Wfit, c: 1 / Wfit, rp: Number(k1.rp.toPrecision(8)), e0: T6(k1.e0), inc: T6(k1.inc) };
  log(`🌦️ Newton の解 ${JSON.stringify(k1)} → 丸め W ${Wfit}・${JSON.stringify(kf)}`);
  const fh = emRun(HP, base, kf, dt, 354, [118, 354]), fh2 = emRun(HP, base, kf, dt / 2), fh4 = emRun(HP, base, kf, dt / 4);
  const w = fh.windows[0], w2 = fh2.windows[0], w4 = fh4.windows[0], w354 = fh.windows[1];
  const tg = [
    { key: 'T1', obs: EM_OBS[0], model: w.T1, h2: Math.abs(w2.T1 - w.T1), h4: Math.abs(w4.T1 - w.T1), tol: M3.TOLS3.aps.value, w354: w354.T1 },
    { key: 'sid', obs: EM_OBS[1], model: w.sid, h2: Math.abs(w2.sid - w.sid), h4: Math.abs(w4.sid - w.sid), tol: M3.TOLS3.sid.value, w354: w354.sid },
    { key: 'eOsc', obs: EM_OBS[2], model: w.eOsc, h2: Math.abs(w2.eOsc - w.eOsc), h4: Math.abs(w4.eOsc - w.eOsc), tol: M3.TOLS3.ecc.value, w354: w354.eOsc }];
  for (const t of tg) { t.residual = t.model - t.obs; t.gate = Math.abs(t.residual) + t.h2 <= t.tol; }
  log(`🌦️ 測り直し ${JSON.stringify(tg)}・傾斜の平均 ${w.incMean}`);
  return { id: IDS.ems3, emoji: '🌦️', Wbg302: d302.relativeDrag.Wbg, start: k0, jacobian: J, step: STEP, res0, y0: r0.y, newton: k1, Wbg: Wfit, knobs: { rp: kf.rp, e0: kf.e0, inc: kf.inc },
    incMean: w.incMean, incMeanH2: w2.incMean, targets: tg, steps: fh.steps, windows: { h: w, h2: w2, h4: w4, w354 }, gate: tg.every((t) => t.gate) };
}

/* ── 記録(fitRecord)を作る —— 第302便の記録の形を保ち、値・来歴・条件の署名を更新 ── */
const MER_TARGET_SRC = (src) => src + '。' + A1_MERCURY.text;
export function recMer3(HP, R) {
  const old = DECL302[IDS.mer3].fitRecord, f = R.fit, TG = PL.TARGETS.mercury, ex = 'tests/exp-w299c-planets3d.mjs runPl3(' + PL.EXTRACTOR_VERSION + ')';
  const obsD = P3.planetOf('mercury').period.s / P3.DAY_S;
  const targets = [
    { q: '近点率の差(引きずり OFF の対照〔重力だけ〕との差・8 公転・検出器 B —— 瞬間の軌道面の中の近点経度 ϖ=Ω+u の時刻への直線 fit・同じ刻み)', obs: TG.aps.obs, unit: TG.aps.unit, source: MER_TARGET_SRC(TG.aps.source),
      window: '8 公転・検出器 B・引きずり OFF の対照との差(同じ刻み・semic)', tol: clone(TG.aps.tol), extractor: ex + ' —— 距離の極小の 3 点放物線・瞬間の軌道面(位置の外積)で ϖ',
      model: f.diff, residual: f.diff - TG.aps.obs, rel: (f.diff - TG.aps.obs) / TG.aps.obs, numerics: { h2: Math.abs(f.diffH2 - f.diff), dtHalf: f.h / 2 } },
    { q: '恒星周期(初期の軌道面の中の方位の周回の平均間隔・8 公転)', obs: obsD, unit: TG.sid.unit, source: P3.planetOf('mercury').period.source,
      window: '8 公転', tol: clone(TG.sid.tol), extractor: ex + ' —— 初期の軌道面(位置と速度の外積)の中の方位の通過',
      model: f.periodDays, residual: f.periodDays - obsD, rel: (f.periodDays - obsD) / obsD, numerics: { h2: Math.abs(f.periodDaysH2 - f.periodDays), dtHalf: f.h / 2 } }];
  const gateOk = targets.every((t) => Math.abs(t.residual) + t.numerics.h2 <= t.tol.value);
  return { version: 'w298b-1', parent: old.parent, law: 'inertial-drag(三次元 —— physics.coord:"3d"・並進だけ・回転引きずりと軸引きずりは宣言しない)・λ_PN=0・局所重力 G_loc なし・積分器 semic(第303便a の再フィット)',
    targets, knobs: [{ key: 'physics.relativeDrag.Wbg', range: [0.019448366531695002, 1000], final: f.Wbg }],
    fixed: [old.fixed[0], old.fixed[1], 'geoPN=3・kFrame=0・λ_PN=0・積分器 semi(引きずりの步は semic —— 第302便d の既定)・重力の軟化 0.05・核の ε 0.05・pairs "all"・stateCarry "double"(🟫 と同じ)',
      REFIT_NOTE('🌡️', '221.1205993960312(旧 gain 0.004522419 —— 第302便c の G_loc の上の値 489275.3 ではない)', old.cond.sig)],
    procedure: '第303便a: 引きずり OFF の対照との近点率の差(8 公転・semic・G_loc なし)を 43.0″/世紀に割線で合わせ(c = 1/W_bg・起点は第299便c の gain 0.004522419)、W_bg を 7 桁に丸めて h と h/2 で測り直した(器 tests/exp-w303a-refit.mjs —— 割線は tests/exp-w302c-wbgest.mjs の fitMercury と同じ)',
    dt: f.h, steps: f.stepsH, status: gateOk ? 'fitted' : 'not-identifiable',
    notFitted: ['恒星周期は合わせていない(近似要素の種の周期 —— 照合だけ)', '離心率・軌道傾斜は近似要素の種のまま(合わせていない)', '機構(1PN の近日点前進の機構の同定ではない)'],
    cond: { version: HP.FIT_COND_VERSION, sig: '', extractor: ex } };
}
// 🟫 の窓の文は「引きずり無しの対照」(第302便a の語 —— アプリ内実測〔説明タブの精密実測〕は窓の文の /gain 0 の対照|引きずり無しの対照/ で対照の走りを足す)
export function recMer2(HP, R) {
  const old = DECL302[IDS.mer2].fitRecord, t0 = old.targets[0], ex = old.cond.extractor;
  const target = { q: t0.q, obs: t0.obs, unit: t0.unit, source: MER_TARGET_SRC(t0.source), window: '8 公転・検出器 B(近点ごとの方位の直線 fit)・引きずり無しの対照との差(同じ刻み・semic)', tol: clone(t0.tol) };
  const notIdent = ['dragCore(太陽の f を R_c/R=0.3 で 0.1〜1.0 に振った近点率の幅 ' + L.ex(R.fScan.span, 2) + '″/世紀 —— 数値誤差の帯 ' + L.ex(R.h2, 2) + '″/世紀' + (R.fScan.span <= R.h2 ? ' 以下' : ' を超えるが W_bg と縮退') + '。1 量では W_bg と分けられない)'];
  const st = L.statusOf297({ bracketed: true, residual: R.residual, h2: R.h2, tol: t0.tol.value });
  const rec = { version: old.version, parent: old.parent, law: old.law, targets: [target], knobs: [{ key: 'physics.relativeDrag.Wbg', range: [0.019448366531695002, 1000], final: R.Wbg }],
    fixed: old.fixed.slice(0, 5).concat([REFIT_NOTE('🟫', '221.12079497348208(旧 gain 0.004522415)', old.cond.sig)]),
    procedure: '第303便a: 引きずり OFF の対照との近点率の差(8 公転・semic)を 43.0″/世紀に割線で合わせ(c = 1/W_bg・起点は分割の世代の W_bg)、7 桁に丸めた値を h と h/2 で測り直す(|残差| + 数値誤差の帯 |q_h − q_h/2| ≤ 許容なら fitted)→ 固定した W_bg で dragCore の f を振る(同定の可否 —— 器 tests/exp-w303a-refit.mjs)',
    dt: R.dt, steps: R.steps, residual: { value: R.residual, unit: t0.unit, model: R.model, rel: R.residual / t0.obs }, numerics: { h2: R.h2, dtHalf: R.dt / 2 }, status: st,
    notFitted: ['公転周期(8 公転の平均 —— 引きずり OFF の対照との差と JPL/NSSDC の値との差を記録するだけ)', '離心率', '近日点移動の全量(重力の軟化の逆行を含む —— 合わせたのは引きずり OFF の対照との差)'] };
  if (st === 'fitted') rec.notIdentifiable = notIdent;
  rec.cond = { version: HP.FIT_COND_VERSION, sig: '', extractor: ex };
  return rec;
}
export function recPlu(HP, R) {
  const old = DECL302[IDS.plu].fitRecord, t0 = old.targets[0], ex = old.cond.extractor;
  const target = { q: t0.q, obs: t0.obs, unit: t0.unit, source: t0.source, window: t0.window + '・semic', tol: clone(t0.tol) };
  const notIdent = ['dragCore(固定 W_bg で冥王星/カロンの f を振った周期の幅 ' + L.ex(R.fScan.span, 2) + ' s —— 観測の 1σ 0.02592 s より' + (R.fScan.span < t0.tol.value ? '小さく' : '大きいが') + '、1 量では W_bg と縮退する)'];
  const st = L.statusOf297({ bracketed: true, residual: R.residual, h2: R.h2, tol: t0.tol.value });
  const rec = { version: old.version, parent: old.parent, law: old.law, targets: [target], knobs: [{ key: 'physics.relativeDrag.Wbg', range: old.knobs[0].range.slice(), final: R.Wbg }],
    fixed: old.fixed.slice(0, 5).concat([REFIT_NOTE('🟪', '0.00014861029313528932(旧 gain 6729.009)', old.cond.sig)]),
    procedure: '第303便a: 8 公転の平均周期(semic)を 551856.43872 s に割線で合わせ(c = 1/W_bg・起点は分割の世代の W_bg)、7 桁に丸めた値を h と h/2 で測り直す(|残差| + 数値誤差の帯 |q_h − q_h/2| ≤ 許容なら fitted)→ 固定した W_bg で dragCore の f を振る(同定の可否 —— 器 tests/exp-w303a-refit.mjs)',
    dt: R.dt, steps: R.steps, residual: { value: R.residual, unit: t0.unit, model: R.model, rel: R.residual / t0.obs }, numerics: { h2: R.h2, dtHalf: R.dt / 2 }, status: st,
    notFitted: old.notFitted.slice() };
  if (st === 'fitted') rec.notIdentifiable = notIdent;
  rec.cond = { version: HP.FIT_COND_VERSION, sig: '', extractor: ex };
  return rec;
}
export function recEms(HP, R) {
  const old = DECL302[IDS.ems3].fitRecord, ex = old.cond.extractor, w = R.windows.h;
  const targets = old.targets.map((t, i) => { const g = R.targets[i]; return { q: t.q, obs: t.obs, unit: t.unit, source: t.source, window: t.window + '・semic', tol: clone(t.tol), extractor: t.extractor,
    model: g.model, residual: g.model - t.obs, rel: (g.model - t.obs) / t.obs, numerics: { h2: g.h2, dtHalf: M3.DT / 2 } }; });
  const gateOk = targets.every((t) => Math.abs(t.residual) + t.numerics.h2 <= t.tol.value);
  const knobs = old.knobs.map((k) => ({ key: k.key, range: k.range.slice(), final: k.key === 'physics.relativeDrag.Wbg' ? R.Wbg : k.key === 'initial.moonPerigeeDistance' ? R.knobs.rp : k.key === 'initial.moonOscEccentricity0' ? R.knobs.e0 : R.knobs.inc }));
  const f1 = old.fixed[1].replace(/接触傾斜 [0-9.]+°/, '接触傾斜 ' + R.knobs.inc + '°');
  return { version: old.version, parent: old.parent, law: old.law + '・積分器 semic(第303便a の再フィット)', targets, knobs,
    fixed: [old.fixed[0], f1, old.fixed[2].replace('積分器 semi', '積分器 semi(引きずりの步は semic —— 第302便d の既定)'),
      REFIT_NOTE('🌦️', '3.8560163495093223(旧 gain 0.259335)と初期配置 3 つ', old.cond.sig)],
    procedure: '第303便a: 分割の世代の 4 つのノブ(W_bg・近地点距離・t=0 の接触離心率・接触傾斜)を起点に、semic の 118 公転窓(h)で 4 元の Newton(差分の Jacobian —— 近点回転の周期・恒星月・平均離心率・平均傾斜)を 1 回 → W_bg を 6 桁・初期配置を元の桁に丸めて h / h/2 / h/4 と 354 公転窓で測り直した(器 tests/exp-w303a-refit.mjs —— 抽出器は tests/exp-w298c-moon3d.mjs runEmx3)',
    dt: M3.DT, steps: R.steps, status: gateOk ? 'fitted' : 'not-identifiable', notFitted: old.notFitted.concat([EMS_WBG_NOTE]), cond: { version: HP.FIT_COND_VERSION, sig: '', extractor: ex } };
}
/** 記録を本の写しに当てて条件の署名を付ける(html の fitCondSig —— 受理後の本と記録から)。 */
export function signed(HP, p, rec) {
  const q = clone(p); q.fitRecord = rec;
  const v = HP.validatePreset(clone(q));
  rec.cond.sig = v.ok ? HP.fitCondSig(v.preset, rec) : '';
  const vr = HP.validateFitRecord(clone(rec));
  return { rec, accepted: !!vr.ok, err: vr.ok ? null : vr.err, presetOk: v.ok };
}
/** 本の宣言(新しい世代)の写し: G_loc を外し、W_bg とノブを当てる。 */
export function declOf(HP, id, R) {
  const p = clone(find(HP, id));
  delete p.physics.gLoc;
  if (id === IDS.ems3) { const q = emDecl(HP, p, { W: R.Wbg, rp: R.knobs.rp, e0: R.knobs.e0, inc: R.knobs.inc }); p.physics = q.physics; p.bodies = q.bodies; }
  else p.physics.relativeDrag.Wbg = id === IDS.mer3 ? R.fit.Wbg : R.Wbg;
  delete p.physics.relativeDrag.enabled; delete p.physics.relativeDrag.gain;
  return p;
}

/* ── 段 T: 🌔 への移送 ── */
/** 🌔 の宣言(新しい世代): 🌦️ の新しい宣言から器 tests/exp-w300b-emonly.mjs の写しの規則(emOnlyBodies・emOnlyPhysics)で作る —— W_bg は移送(フィットと呼ばない)。 */
export function emoDeclOf(HP, R) {
  const src = declOf(HP, IDS.ems3, R), q = clone(find(HP, IDS.emo));
  q.bodies = emOnlyBodies(src.bodies); q.physics = emOnlyPhysics(src.physics);
  return q;
}
export function transferEmo(HP, R, log) {
  const p0 = emoDeclOf(HP, R), run = (dt) => { const R3 = runEm3(HP, clone(p0), { dt, revMax: 118, ci: 0, oi: 1 }); return emWindowsOf(R3, [118], HP)[0]; };
  const a = run(0.016), b = run(0.008);
  const o = { Wbg: p0.physics.relativeDrag.Wbg, sid: a.sid, sidH2: b.sid, synUniform: a.synUniform, synUniformH2: b.synUniform, T1: a.T1, T1H2: b.T1, eOsc: a.eOsc, incMean: a.incMean,
    rule: '🌦️ の新しい宣言(W_bg と初期配置)を器 tests/exp-w300b-emonly.mjs の emOnlyBodies・emOnlyPhysics で写した 🌔(移送 —— フィットと呼ばない)・118 公転窓・h と h/2' };
  log(`🌔 移送 W_bg ${o.Wbg}: 恒星月 ${a.sid}(h/2 ${b.sid})・朔望月 ${a.synUniform}・近点回転 ${a.T1} 年(h/2 ${b.T1})`);
  return o;
}

/* ── 段 G・D ── */
const canon = (v) => { if (Array.isArray(v)) return v.map(canon); if (v && typeof v === 'object') { const o = {}; for (const k of Object.keys(v).sort()) o[k] = canon(v[k]); return o; } return v; };
const same = (a, b) => JSON.stringify(canon(a)) === JSON.stringify(canon(b));
export function gatesOf(HP, J) {
  const P = HP.allPresets(), inSvc = P.filter((p) => p.familyRole !== 'retired');
  const gLocBooks = inSvc.filter((p) => p.physics && p.physics.gLoc).map((p) => p.id);
  const planets = P3.PLANETS.map((pl) => pl.id), off6 = planets.filter((id) => id !== IDS.mer3);
  const offOk = off6.every((id) => { const rd = find(HP, id).physics.relativeDrag; return rd && rd.Wbg === null && rd.enabled === false; });
  const books = {};
  for (const k of ['mer3', 'mer2', 'plu', 'ems3']) {
    const r = J.refit[k], p = find(HP, IDS[k]), d = declOf(HP, IDS[k], r);
    const v = HP.validatePreset(clone(p));
    let condState = null;
    if (v.ok) { HP.sim.build(v.preset); condState = HP.fitCondStateOf(HP.fitCondInputsOf(v.preset, HP.sim.params), v.preset.fitRecord).state; }
    books[k] = { id: IDS[k], emoji: p.emoji, physicsSame: same(p.physics, d.physics), bodiesSame: same(p.bodies, d.bodies), recordSame: same(p.fitRecord, r.record), condState,
      accepted: v.ok && (v.warnings || []).length === 0, noGLoc: !p.physics.gLoc };
  }
  const emo = find(HP, IDS.emo), emoW = emo.physics.relativeDrag.Wbg, emoWant = emoDeclOf(HP, J.refit.ems3), emoCheck = emDeclCheck(find(HP, IDS.ems3), emo);
  const g = {
    refitMer3: J.refit.mer3.gate, refitMer2: J.refit.mer2.gate, refitPlu: J.refit.plu.gate, refitEms: J.refit.ems3.gate,
    recordsAccepted: ['mer3', 'mer2', 'plu', 'ems3'].every((k) => J.refit[k].accepted === true),
    recordsFitted: ['mer3', 'mer2', 'plu', 'ems3'].every((k) => J.refit[k].record.status === 'fitted'),
    gLocZero: gLocBooks.length === 0, sixOff: offOk,
    htmlSame: Object.values(books).every((b) => b.physicsSame && b.bodiesSame && b.recordSame && b.condState === 'match' && b.accepted && b.noGLoc),
    emoTransfer: emoW === J.refit.ems3.Wbg && !emo.physics.gLoc && same(emo.bodies, emoWant.bodies) && same(emo.physics, emoWant.physics) && emoCheck.ok === true,
  };
  return { gates: g, books, gLocBooks, off6, emoWbg: emoW };
}
export function diffTable(J) {
  const r = J.refit, d = (id) => DECL302[id];
  const m302 = (id, i) => { const fr = d(id).fitRecord; return fr.targets[i] && fr.targets[i].model !== undefined ? fr.targets[i].model : (fr.residual ? fr.residual.model : null); };
  return [
    { emoji: '🌡️', id: IDS.mer3, q: '近点率の差(8 公転)', unit: '″/世紀', Wbg302: d(IDS.mer3).relativeDrag.Wbg, Wbg303: r.mer3.fit.Wbg, model302: m302(IDS.mer3, 0), model303: r.mer3.fit.diff, h2303: r.mer3.fit.h2gap,
      note: '第302便の記録は G_loc(n=−3)の上の値 —— G_loc の前(分割の世代)の W_bg は 221.1205993960312(記録の model 43.000011041822)' },
    { emoji: '🟫', id: IDS.mer2, q: '近点率の差(8 公転)', unit: '″/世紀', Wbg302: d(IDS.mer2).relativeDrag.Wbg, Wbg303: r.mer2.Wbg, model302: m302(IDS.mer2, 0), model303: r.mer2.model, h2303: r.mer2.h2 },
    { emoji: '🟪', id: IDS.plu, q: '公転周期(8 公転の平均)', unit: 's', Wbg302: d(IDS.plu).relativeDrag.Wbg, Wbg303: r.plu.Wbg, model302: m302(IDS.plu, 0), model303: r.plu.model, h2303: r.plu.h2 },
    { emoji: '🌦️', id: IDS.ems3, q: '近点回転の周期(118 公転窓)', unit: 'yr', Wbg302: d(IDS.ems3).relativeDrag.Wbg, Wbg303: r.ems3.Wbg, model302: m302(IDS.ems3, 0), model303: r.ems3.targets[0].model, h2303: r.ems3.targets[0].h2 },
    { emoji: '🌦️', id: IDS.ems3, q: '恒星月(118 公転窓)', unit: 'd', Wbg302: null, Wbg303: null, model302: m302(IDS.ems3, 1), model303: r.ems3.targets[1].model, h2303: r.ems3.targets[1].h2 },
    { emoji: '🌦️', id: IDS.ems3, q: '平均離心率(118 公転窓)', unit: '無次元', Wbg302: null, Wbg303: null, model302: m302(IDS.ems3, 2), model303: r.ems3.targets[2].model, h2303: r.ems3.targets[2].h2 },
  ].map((z) => Object.assign(z, { dWbgRel: (z.Wbg302 && z.Wbg303) ? (z.Wbg303 - z.Wbg302) / z.Wbg302 : null, dModel: (z.model302 !== null && z.model303 !== null) ? z.model303 - z.model302 : null }));
}

export async function main() {
  const OUT = process.env.W303A_OUT || path.join(ROOT, 'tests', 'out', 'refit-w303a.json');
  const html = path.join(ROOT, TARGET);
  const W281A_SCOPE = w281aScopeStamp(html, REGEN_SCOPE);
  const t0 = Date.now(), timing = {};
  const log = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a);
  const { HP, errors } = loadHtmlMain(html);
  pinDecl315c();   // 第315便c(AN406): 在位の 7 本の宣言を移行の前の写しへ(本ごとの門 —— 基点の html では no-op・正本の欄は足さない)
  pinDecl307d(null, [IDS.mer2, IDS.mer3]);   // 第308便d: 🟫🌡️ の fitRecord を第307便の宣言へ(標的の役割を外す —— 第307便の html では no-op・🌡️ はこの後 pinDecl305a が第305便の宣言へ)
  pinDecl303(null, [IDS.ems3, IDS.emo]);   // 第304便c: 🌦️🌔 を第303便の宣言へ(軟化 0.01・初期配置・W_bg —— この正本は第303便の宣言で測った歴史の記録)
  pinDecl305e(null, [IDS.plu]);   // 第306便e: 🟪 を第305便の宣言へ(= 第303便a の再フィットの宣言 —— 第305便の html では no-op)
  pinDecl305a();   // 第306便a: 🌡️🌋🔴🏀🟡🔷💙 を第305便の宣言へ(本ごとの門 —— 第305便の html では何もしない)
  const J = { meta: null, version: HARNESS_VERSION, preVersion: PRE_VERSION, parts: PARTS, refit: {}, transfer: null, gates: null, diff: null };
  const T = (k, f) => { const s = Date.now(); const r = f(); timing[k] = { wallSec: (Date.now() - s) / 1000 }; return r; };
  if (PARTS.includes('R')) {
    const m3 = T('mer3', () => refitMer3(HP, log)); const s3 = signed(HP, declOf(HP, IDS.mer3, m3), recMer3(HP, m3)); Object.assign(m3, { record: s3.rec, accepted: s3.accepted, err: s3.err }); J.refit.mer3 = m3;
    const m2 = T('mer2', () => refitMer2(HP, log)); const s2 = signed(HP, declOf(HP, IDS.mer2, m2), recMer2(HP, m2)); Object.assign(m2, { record: s2.rec, accepted: s2.accepted, err: s2.err }); J.refit.mer2 = m2;
    const pl = T('plu', () => refitPlu(HP, log)); const sp = signed(HP, declOf(HP, IDS.plu, pl), recPlu(HP, pl)); Object.assign(pl, { record: sp.rec, accepted: sp.accepted, err: sp.err }); J.refit.plu = pl;
    const em = T('ems3', () => refitEms(HP, log)); const se = signed(HP, declOf(HP, IDS.ems3, em), recEms(HP, em)); Object.assign(em, { record: se.rec, accepted: se.accepted, err: se.err }); J.refit.ems3 = em;
    for (const k of Object.keys(J.refit)) log(k, 'W_bg', k === 'mer3' ? J.refit[k].fit.Wbg : J.refit[k].Wbg, '門', J.refit[k].gate, '記録', J.refit[k].record.status, J.refit[k].accepted, J.refit[k].err || '', 'sig', J.refit[k].record.cond.sig);
  }
  if (PARTS.includes('T') && J.refit.ems3) J.transfer = T('emo', () => transferEmo(HP, J.refit.ems3, log));
  if (PARTS.includes('G') && J.refit.ems3) { const G = gatesOf(HP, J); J.gates = G.gates; J.books = G.books; J.gLocBooks = G.gLocBooks; J.off6 = G.off6; J.emoWbg = G.emoWbg; }
  if (PARTS.includes('D') && J.refit.ems3) J.diff = diffTable(J);
  J.ok = !!J.gates && Object.values(J.gates).every(Boolean);
  J.timing = timing;
  J.notClaim = ['「43″ が出た」', '「GR と一致した」', '「現実を再現した」', '「W_bg の宇宙の値が決まった」'];
  const CODE = ['tests/exp-w303a-refit.mjs', 'tests/lib-w315c-legacy7.mjs', 'tests/lib-w303a-pre.mjs', 'tests/lib-w308d-pre.mjs', 'tests/lib-w304c-pre.mjs', 'tests/lib-w306e-pre.mjs', 'tests/lib-w306a-pre.mjs', 'tests/exp-w302c-wbgest.mjs', 'tests/exp-w299c-planets3d.mjs', 'tests/lib-w299c-planets3d.mjs', 'tests/exp-w295c-inertial3.mjs',
    'tests/lib-w297b-fit.mjs', 'tests/lib-w296b-fit.mjs', 'tests/exp-w298c-moon3d.mjs', 'tests/exp-w300b-emonly.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  J.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第303便a', target: TARGET, code: CODE, inputs: [TARGET, LEGACY7_DATA_FILE, DECL302_DATA_FILE, DECL303_DATA_FILE, DECL305E_DATA_FILE, DECL305A_DATA_FILE, DECL307D_DATA_FILE] }), {
    harnessVersion: HARNESS_VERSION, loadErrors: errors.length,
    ruling: '原仮定者の裁定(第93報)①②(geoPN=3 のフィットの探索を優先・引きずりが主 —— G_loc は引きずりだけでは合わない量を埋めるため)',
    reading: '統括の検証項目 R191(在位の惑星の本から G_loc n=−3 を外す・semic での再フィット・観測の行)' });
  J.elapsedS = (Date.now() - t0) / 1000;
  Object.assign(J.meta, W281A_SCOPE, w281aStableInputs(ROOT, J.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(J, null, 1) + '\n');
  log(`門: ${JSON.stringify(J.gates)}・ok ${J.ok} → ${path.relative(ROOT, OUT)}(${J.elapsedS.toFixed(0)} s)`);
}
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) await main();
