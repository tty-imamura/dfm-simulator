// 第302便c(第 2 段 —— 原仮定者の裁定(第92報)AN304 ①③・統括の検証項目 R190)—— **G_loc の n の決め方(移送の予言)・惑星の本への G_loc・
// 背景慣性決定力 W_bg の推定(合算 W_cos + W_gal + W_sys)・推定で固定したときの dragCore の探索・G_loc と引きずりの帳簿の継ぎ目の器**
// (Node だけ —— 対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、アプリの三次元の步〔semic・dfmCore3 の gLocKick3〕を走らせる・1 プロセス)。
//
// ■ 裁定(第92報 —— そのまま)
//   「慣性速度に影響する重力の計算に、1PN 相当の補正の導入を進める。」(補足: G_loc = κ·c_loc² の他にも広く検討 —— G·(c/c_loc)² など)
//   「背景慣性決定力 W_bg は、背景宇宙、銀河の中の位置、恒星系の中の位置、などの合算で決まると推定。惑星の場合、恒星が背景側か否かの差が大きい。
//    背景慣性決定力に推定値を用いる事で、dragCore のフィットが安定する。」
//
// ■ 段(正本 tests/out/wbgest-w302c.json —— 段 wbgest-302c)
//   N  n の決め方(主の量 = **1 つの W_bg の移送の予言**): n ∈ {なし, 2, −2, −3} の各案で 🌡️ の W_bg を 43.0″/世紀(照合規約の値)に合わせ直し
//      (G_loc + 引きずり・semic・8 公転・検出器 B・対照 = 引きずり OFF ∧ G_loc なし —— 同じ刻み)、同じ W_bg と同じ G_loc を 🌋🔴 へ移送して
//      近点率の差を予言し、1PN の写し(二次元の geoPN=1 の EIH − geoPN=0・同じ刻み —— 既存の 1PN の経路で測った値)と比べる。残差の二乗和が最小の n を採る。
//      **n=2(裁定の式 κ·c_loc²)は採らなくても表に並べる**。W_bg を本ごとに合わせ直さない。
//   P  惑星の本の記録(宣言した 7 本 —— 宣言から選ぶ): G_loc だけの近点率と周期(引きずり OFF の本)・🌡️ の新しいフィットの h と h/2・fitRecord。
//   E  W_bg の推定(html の wbgEstimateOf —— W_cos + W_gal + W_sys・本の単位と SI)と、フィットの W_bg との比・ξ = Σw/W_bg。
//   C  推定で固定したときの dragCore の探索(🌡️〔G_loc 入り〕・🌦️ の月・🟪): 目的の量・(massFrac, radius) の格子・感度行列の特異値・初期値を変えた解の広がり。
//   L  帳簿の継ぎ目(G_loc と引きずりを両方宣言した本): R_E = ΔE − W − gLocWork の h/h2/h4。
//
// ■ しないこと・言わないこと
//   ・推定を目的の値に合わせて書き換えない(合わせるのはフィット —— 推定とフィットは別の来歴)。宣言を推定値に替えるのは目的の門が通る本だけ。
//   ・「43″ が出た」「GR と一致した」(一致は量と窓を限って数で書く)「dragCore が一意に決まった」(特異値と広がりで書く)「W_bg の宇宙の値が決まった」と書かない。
//   ・届かないものは「この探索範囲では未達 —— 次の見直し」。
//
// 実行(Node だけ・1 プロセス):
//   node tests/exp-w302c-wbgest.mjs          → 正本 tests/out/wbgest-w302c.json(W302C_OUT で出力先を変える・W302C_PARTS=N,P,G,E,C,L で段を選ぶ —— 正本は全段)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as PL from './exp-w299c-planets3d.mjs';
import * as P3 from './lib-w299c-planets3d.mjs';
import * as B302 from './exp-w302b-gloc.mjs';
import * as PRE from './lib-w302c-pre.mjs';
import { runEm3, windowsOf } from './exp-w300b-emonly.mjs';
import { run2 as run2d } from './exp-w302d-semic.mjs';
import { cosmicBackground } from './exp-w301a-dragnorm.mjs';
const REGEN_SCOPE = {"presets":"all","roots":["HP.allPresets","HP.coord3d","HP.sim","HP.validatePreset","HP.gLocState","HP.inertialDragLedgerOf","HP.wbgEstimateOf","HP.WBG_EST_VERSION","HP.fitCondSig","HP.validateFitRecord","HP.dragCoreLookup","HP.inertialDragState","HP.GLOC_VERSION"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w302c-wbgest-1';
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const PARTS = (process.env.W302C_PARTS || 'N,P,G,E,C,L').split(',');
const clone = (x) => JSON.parse(JSON.stringify(x));
const find = (HP, id) => HP.allPresets().find((q) => q.id === id);
const ARCSEC = 180 * 3600 / Math.PI;
export const N_WIN = 8;                              // 窓(公転)—— 🌡️ の fitRecord と同じ
export const TARGET_APS = 43.0;                      // 照合規約の値(″/世紀)
export const TOL_APS = 0.0009;                       // 照合許容の宣言(″/世紀)
/** n の案(null = G_loc なし —— 今の宣言の対照)。gl は physics.gLoc の宣言。 */
export const N_CASES = Object.freeze([
  { key: 'none', n: null, gl: null, label: 'G_loc なし(引きずりだけ —— 今の宣言)' },
  { key: 'n2', n: 2, gl: { law: 'kappaC2' }, label: 'κ·c_loc²(n=2 —— 裁定の式)' },
  { key: 'nm2', n: -2, gl: { law: 'timeRatio' }, label: 'G·(c₀/c_loc)²(n=−2 —— 補足の例)' },
  { key: 'nm3', n: -3, gl: { law: 'cLocPow', n: -3 }, label: 'G·(c₀/c_loc)³(n=−3)' },
]);
export const MERCURY = 'mercurySunInertial3d';
export const TRANSFER = Object.freeze(['venusSunInertial3d', 'marsSunInertial3d']);

/* ── 本の写し(引きずりの強さと G_loc を差し替える) ── */
// Wbg = null は引きずり OFF(未推定の OFF {Wbg:null, enabled:false})。gl = null は G_loc なし(鍵を消す)
export function variantOf(p, o) {
  const q = clone(p), rd = q.physics.relativeDrag;
  if ('Wbg' in o) { delete rd.gain; if (o.Wbg === null) { rd.Wbg = null; rd.enabled = false; } else { rd.Wbg = o.Wbg; delete rd.enabled; } }
  if ('gl' in o) { if (o.gl === null) delete q.physics.gLoc; else q.physics.gLoc = clone(o.gl); }
  if ('dragCore' in o) for (const [i, dc] of Object.entries(o.dragCore)) { if (dc === null) delete q.bodies[i].dragCore; else q.bodies[i].dragCore = clone(dc); }
  delete q.fitRecord;
  return q;
}
const hOf = (p) => P3.stepsOf(p.timeRef.pRef).h;
/** 1 走行(runPl3・8 公転)→ 近点率 ″/世紀・恒星周期 日。 */
export function measure(HP, p, dt, N = N_WIN) {
  const R = PL.runPl3(HP, p, { dt, revMax: N });
  const w = PL.windowOf(R, N, Math.pow(10, p.scaleExp.T));
  return { aps: w.apsArcsecPerCentury, periodDays: w.periodDays, ecc: w.ecc, steps: R.steps, nan: R.nan, complete: w.complete, drag: R.drag };
}

/* ── 1PN の写し(二次元の geoPN=1 の EIH − geoPN=0 —— 既存の 1PN の経路・同じ刻み) ── */
// 三次元の本の相対の状態を初期の軌道面へ射影して二次元の二体(☄️ mercuryReal の宣言の器 —— 太陽 pinned・原点)を作る
export function pn1Copy2d(HP, p3, geoPN) {
  const tpl = clone(find(HP, 'mercuryReal')), B = p3.bodies;
  const r = [B[1].x - B[0].x, B[1].y - B[0].y, B[1].z - B[0].z], v = [B[1].vx - B[0].vx, B[1].vy - B[0].vy, B[1].vz - B[0].vz];
  const rn = Math.hypot(...r), P = r.map((x) => x / rn);
  const L = [r[1] * v[2] - r[2] * v[1], r[2] * v[0] - r[0] * v[2], r[0] * v[1] - r[1] * v[0]], Ln = Math.hypot(...L), W = L.map((x) => x / Ln);
  const Q = [W[1] * P[2] - W[2] * P[1], W[2] * P[0] - W[0] * P[2], W[0] * P[1] - W[1] * P[0]];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  tpl.id = 'w302cPn1Copy'; tpl.sampleClass = 'principle'; delete tpl.fitRecord; delete tpl.expected; delete tpl.calibration;
  tpl.physics.geoPN = geoPN;
  tpl.bodies = [Object.assign({}, tpl.bodies[0], { m: B[0].m, x: 0, y: 0, vx: 0, vy: 0, pinned: true }),
    Object.assign({}, tpl.bodies[1], { m: B[1].m, radius: B[1].radius, x: rn, y: 0, vx: dot(v, P), vy: dot(v, Q), pinned: false })];
  return tpl;
}
export function pn1Rate(HP, p3, div = 1) {
  const h = hOf(p3) / div, mu = p3.physics.G * (p3.bodies[0].m + p3.bodies[1].m);
  // 窓: ケプラー周期 × 8.6(近点 8 個を含む)・近点の頂点の方位の直線 fit(器 exp-w302b-gloc の runCase —— 二次元の步)
  const run = (g) => B302.runCase(HP, pn1Copy2d(HP, p3, g), { dt: h, tEnd: 8.6 * kepP(p3), ci: 0, oi: 1, mu });
  const a = run(1), b = run(0);
  const T = Math.pow(10, p3.scaleExp.T), century = 36525 * 86400 / T;
  return { div, h, arcsecCy: (a.dVarpiPeri - b.dVarpiPeri) * century / a.pAnom * ARCSEC, nPeri: a.nPeri, pAnom: a.pAnom };
}
function kepP(p3) {
  const B = p3.bodies, mu = p3.physics.G * (B[0].m + B[1].m);
  const r = Math.hypot(B[1].x - B[0].x, B[1].y - B[0].y, B[1].z - B[0].z), v2 = (B[1].vx - B[0].vx) ** 2 + (B[1].vy - B[0].vy) ** 2 + (B[1].vz - B[0].vz) ** 2;
  const a = 1 / (2 / r - v2 / mu);
  return 2 * Math.PI * Math.sqrt(a ** 3 / mu);
}
export function pn1Formula(p3) {
  const B = p3.bodies, mu = p3.physics.G * (B[0].m + B[1].m), c = p3.physics.cLight;
  const rv = [B[1].x - B[0].x, B[1].y - B[0].y, B[1].z - B[0].z], vv = [B[1].vx - B[0].vx, B[1].vy - B[0].vy, B[1].vz - B[0].vz];
  const r = Math.hypot(...rv), v2 = vv[0] ** 2 + vv[1] ** 2 + vv[2] ** 2, a = 1 / (2 / r - v2 / mu);
  const L = [rv[1] * vv[2] - rv[2] * vv[1], rv[2] * vv[0] - rv[0] * vv[2], rv[0] * vv[1] - rv[1] * vv[0]], h2 = L[0] ** 2 + L[1] ** 2 + L[2] ** 2;
  const e = Math.sqrt(Math.max(0, 1 - h2 / (mu * a))), P = 2 * Math.PI * Math.sqrt(a ** 3 / mu);
  const T = Math.pow(10, p3.scaleExp.T), century = 36525 * 86400 / T;
  return { a, e, P, arcsecCy: 6 * Math.PI * mu / (c * c * a * (1 - e * e)) * century / P * ARCSEC };
}

/* ── 段 N: n の決め方(🌡️ で W_bg を合わせ直し → 🌋🔴 へ移送して予言) ── */
// 1 次元の根: 近点率の差 f(c) − 43.0(c = 1/W_bg —— 引きずりの近点は c に比例に近い)を割線で詰め、W_bg を 7 桁に丸めて h と h/2 で測り直す
export function fitMercury(HP, gl, log = () => {}) {
  const p0 = find(HP, MERCURY), h = hOf(p0);
  const ctl = measure(HP, variantOf(p0, { Wbg: null, gl: null }), h), ctl2 = measure(HP, variantOf(p0, { Wbg: null, gl: null }), h / 2);
  const glOnly = measure(HP, variantOf(p0, { Wbg: null, gl }), h);
  const gPart = glOnly.aps - ctl.aps;
  // 割線の初期値は G_loc の前の 🌡️ の係数(第299便c のフィット —— tests/lib-w302c-pre.mjs の PRE302C_GAIN)から作る(本の今の宣言に依らない —— 正本の再生成で同じ根)
  const cBook = PRE.PRE302C_GAIN[MERCURY];
  // 引きずりの近点の傾き(今の本 —— G_loc なしの 43.0 を c_book で)を初期の比に
  const need = TARGET_APS - gPart, iters = [];
  if (!(need > 0)) return { gl, h, ctl: ctl.aps, gLocPart: gPart, need, reachable: false, why: 'G_loc だけで 43.0″/世紀を越える —— 正の W_bg では届かない(引きずりは近点を進める向き)' };
  let c0 = cBook * need / TARGET_APS, f0 = measure(HP, variantOf(p0, { Wbg: 1 / c0, gl }), h).aps - ctl.aps - TARGET_APS;
  iters.push({ Wbg: 1 / c0, f: f0 });
  let c1 = c0 * (need / (need + f0)), f1 = measure(HP, variantOf(p0, { Wbg: 1 / c1, gl }), h).aps - ctl.aps - TARGET_APS;
  iters.push({ Wbg: 1 / c1, f: f1 });
  for (let it = 0; it < 12 && Math.abs(f1) > 2e-7; it++) {
    const c2 = c1 - f1 * (c1 - c0) / (f1 - f0);
    c0 = c1; f0 = f1; c1 = c2;
    f1 = measure(HP, variantOf(p0, { Wbg: 1 / c1, gl }), h).aps - ctl.aps - TARGET_APS; iters.push({ Wbg: 1 / c1, f: f1 });
  }
  const Wfit = Number((1 / c1).toPrecision(7));
  const mh = measure(HP, variantOf(p0, { Wbg: Wfit, gl }), h), mh2 = measure(HP, variantOf(p0, { Wbg: Wfit, gl }), h / 2);
  const diff = mh.aps - ctl.aps, diff2 = mh2.aps - ctl2.aps;
  const ctlP = ctl.periodDays;
  const r = { gl, h, ctl: ctl.aps, ctlH2: ctl2.aps, ctlPeriodDays: ctlP, gLocPart: gPart, need, reachable: true, iters, Wbg: Wfit, WbgSI: Wfit * 1e3,
    diff, diffH2: diff2, residual: diff - TARGET_APS, h2gap: Math.abs(diff2 - diff), periodDays: mh.periodDays, periodDaysH2: mh2.periodDays, stepsH: mh.steps,
    gate: Math.abs(diff - TARGET_APS) + Math.abs(diff2 - diff) <= TOL_APS, dragPart: diff - gPart, dragRatioToBook: (1 / Wfit) / cBook };
  log(r);
  return r;
}
export function partN(HP, log = console.log) {
  const p0 = find(HP, MERCURY);
  const grRef = {};
  for (const id of [MERCURY].concat(TRANSFER)) {
    const p = find(HP, id), f = pn1Formula(p), m1 = pn1Rate(HP, p, 1), m2 = pn1Rate(HP, p, 2);
    grRef[id] = { emoji: p.emoji, formula: f.arcsecCy, a: f.a, e: f.e, measured: m1.arcsecCy, measuredH2: m2.arcsecCy, h: m1.h, nPeri: m1.nPeri,
      note: '既存の 1PN の経路(二次元の geoPN=1 の EIH − geoPN=0・☄️ mercuryReal の宣言の器に初期の軌道面へ射影した相対の状態・太陽 pinned・同じ刻み h・近点の頂点)—— 比較の物差し・観測値ではない' };
    log(`N 1PN の写し ${p.emoji} ${m1.arcsecCy.toFixed(4)}(h/2 ${m2.arcsecCy.toFixed(4)})・式 ${f.arcsecCy.toFixed(4)}″/世紀`);
  }
  const rows = [];
  for (const C of N_CASES) {
    const fit = fitMercury(HP, C.gl, (r) => log(`N ${C.key} 🌡️ W_bg ${r.Wbg}(SI ${r.WbgSI.toExponential(4)} kg/m³)・G_loc 分 ${r.gLocPart.toFixed(4)}・引きずり分 ${r.dragPart.toFixed(4)}・差 ${r.diff.toFixed(6)}(h/2 ${r.diffH2.toFixed(6)})`));
    const tr = [];
    if (fit.reachable) for (const id of TRANSFER) {
      const p = find(HP, id), h = hOf(p);
      const ctl = measure(HP, variantOf(p, { Wbg: null, gl: null }), h), ctl2 = measure(HP, variantOf(p, { Wbg: null, gl: null }), h / 2);
      const pr = measure(HP, variantOf(p, { Wbg: fit.Wbg, gl: C.gl }), h), pr2 = measure(HP, variantOf(p, { Wbg: fit.Wbg, gl: C.gl }), h / 2);
      const glo = C.gl ? measure(HP, variantOf(p, { Wbg: null, gl: C.gl }), h) : null;
      const pred = pr.aps - ctl.aps, pred2 = pr2.aps - ctl2.aps, ref = grRef[id].measured;
      const o = { id, emoji: p.emoji, h, Wbg: fit.Wbg, pred, predH2: pred2, h2gap: Math.abs(pred2 - pred), gLocPart: glo ? glo.aps - ctl.aps : 0, dragPart: pred - (glo ? glo.aps - ctl.aps : 0),
        ref, refFormula: grRef[id].formula, resid: pred - ref, relResid: (pred - ref) / ref, periodShiftDays: pr.periodDays - ctl.periodDays };
      tr.push(o);
      log(`N ${C.key} → ${p.emoji} 予言 ${pred.toFixed(4)}(h/2 ${pred2.toFixed(4)})= G_loc ${o.gLocPart.toFixed(4)} + 引きずり ${o.dragPart.toFixed(4)}・1PN の写し ${ref.toFixed(4)}・残差 ${o.resid.toFixed(4)}″/世紀`);
    }
    const ss = tr.reduce((s, o) => s + o.resid * o.resid, 0), sr = tr.reduce((s, o) => s + o.relResid * o.relResid, 0);
    rows.push({ key: C.key, n: C.n, gl: C.gl, label: C.label, fit, transfer: tr, sumSq: tr.length ? ss : null, rms: tr.length ? Math.sqrt(ss / tr.length) : null, relRms: tr.length ? Math.sqrt(sr / tr.length) : null });
  }
  const cand = rows.filter((r) => r.rms !== null && r.fit.gate);
  const best = cand.slice().sort((a, b) => a.rms - b.rms)[0] || null;
  const second = cand.slice().sort((a, b) => a.rms - b.rms)[1] || null;
  return { grRef, rows, chosen: best ? best.key : null, chosenN: best ? best.n : null, chosenGl: best ? best.gl : null, margin: (best && second) ? second.rms / Math.max(best.rms, 1e-300) : null,
    rule: '🌡️ で合わせ直した 1 つの W_bg と同じ G_loc を 🌋🔴 へ移送した近点率の差の予言と 1PN の写しの残差の二乗和(″/世紀)が最小の案(🌡️ のフィットが門を通る案だけ)' };
}

/* ── 段 P: 惑星の本の記録(G_loc を宣言した本 —— 宣言から選ぶ) ── */
/** G_loc を宣言した在位の本(宣言から —— 手書きの一覧を持たない)。 */
export function gLocBooks(HP) { return HP.allPresets().filter((p) => p.familyRole !== 'retired' && p.physics && p.physics.gLoc).map((p) => p.id); }
/** 🌡️ の W_bg の同定の幅: 照合許容 ±tol が写る W_bg の範囲(引きずりの近点 ∝ 1/W_bg と置いた一次)。 */
export function wbgBand(fit) { const d = fit.dragPart; return d > TOL_APS ? [fit.Wbg * d / (d + TOL_APS), fit.Wbg * d / (d - TOL_APS)] : [fit.Wbg * d / (d + TOL_APS), null]; }
/** fitRecord(w298b-1 —— 近点率の差〔引きずり OFF ∧ G_loc なしの対照との差〕・恒星周期)。fit は fitMercury の戻り値。 */
export function fitRecordOf302c(HP, fit, n) {
  const p0 = find(HP, MERCURY), old = p0.fitRecord, ex = 'tests/exp-w299c-planets3d.mjs runPl3(' + PL.EXTRACTOR_VERSION + ')';
  const obsD = P3.planetOf('mercury').period.s / P3.DAY_S, TG = PL.TARGETS.mercury;
  const targets = [
    { q: '近点率の差(引きずり OFF ∧ G_loc なしの対照〔重力だけ〕との差・8 公転・検出器 B —— 瞬間の軌道面の中の近点経度 ϖ=Ω+u の時刻への直線 fit・同じ刻み)', obs: TG.aps.obs, unit: TG.aps.unit, source: TG.aps.source,
      window: '8 公転・検出器 B・引きずり OFF ∧ G_loc なしの対照との差(同じ刻み)', tol: clone(TG.aps.tol), extractor: ex + ' —— 距離の極小の 3 点放物線・瞬間の軌道面(位置の外積)で ϖ',
      model: fit.diff, residual: fit.diff - TG.aps.obs, rel: (fit.diff - TG.aps.obs) / TG.aps.obs, numerics: { h2: Math.abs(fit.diffH2 - fit.diff), dtHalf: fit.h / 2 } },
    { q: '恒星周期(初期の軌道面の中の方位の周回の平均間隔・8 公転)', obs: obsD, unit: TG.sid.unit, source: P3.planetOf('mercury').period.source,
      window: '8 公転', tol: clone(TG.sid.tol), extractor: ex + ' —— 初期の軌道面(位置と速度の外積)の中の方位の通過',
      model: fit.periodDays, residual: fit.periodDays - obsD, rel: (fit.periodDays - obsD) / obsD, numerics: { h2: Math.abs(fit.periodDaysH2 - fit.periodDays), dtHalf: fit.h / 2 } }];
  const gateOk = targets.every((t) => Math.abs(t.residual) + t.numerics.h2 <= t.tol.value);
  const ws = fit.iters.map((z) => z.Wbg).concat([fit.Wbg]), lo = Number((Math.min(...ws) * 0.99).toPrecision(6)), hi = Number((Math.max(...ws) * 1.01).toPrecision(6));
  return { version: 'w298b-1', parent: 'mercurySunInertialFit',
    law: 'inertial-drag(三次元 —— physics.coord:"3d"・並進だけ・回転引きずりと軸引きずりは宣言しない)・λ_PN=0・局所重力 G_loc(physics.gLoc cLocPow n=' + n + ' —— 第302便c)・積分器 semic(第302便d)',
    targets, knobs: [{ key: 'physics.relativeDrag.Wbg', range: [lo, hi], final: fit.Wbg }],
    fixed: (old && old.fixed ? old.fixed.slice(0, 2) : []).concat([
      'geoPN=3・kFrame=0・λ_PN=0・積分器 semi(引きずりの步は semic —— 第302便d の既定)・重力の軟化 0.05・核の ε 0.05・pairs "all"・stateCarry "double"',
      '局所重力 physics.gLoc {law:"cLocPow", n:' + n + '}(receiver・κ_g = G/c₀²・ref background —— 第302便c の移送の予言で採った n。G_loc だけの近点率の差 ' + fit.gLocPart.toFixed(5) + '″/世紀)']),
    procedure: '第302便c: G_loc(n=' + n + ')を入れた本で、引きずり OFF ∧ G_loc なしの対照との近点率の差(8 公転)を 43.0″/世紀に割線で合わせ(c = 1/W_bg)、W_bg を 7 桁に丸めて h と h/2 で測り直した(器 tests/exp-w302c-wbgest.mjs)。'
      + '引きずりが担うのは ' + fit.dragPart.toFixed(5) + '″/世紀だけ —— 照合許容 ±' + TOL_APS + '″/世紀が写る W_bg の幅は ' + wbgBand(fit).map((x) => x === null ? '∞' : Number(x.toPrecision(4))).join('〜') + '(弱く同定)',
    dt: fit.h, steps: fit.stepsH, status: gateOk ? 'fitted' : 'not-identifiable',
    notFitted: ['恒星周期は合わせていない(近似要素の種の周期 —— 照合だけ)', '離心率・軌道傾斜は近似要素の種のまま(合わせていない)', 'G_loc の n は 🌋🔴 への移送の予言で選んだ(🌡️ には合わせていない)', '機構(1PN の近日点前進の機構の同定ではない)'],
    cond: { version: HP.FIT_COND_VERSION, sig: '', extractor: ex } };
}
export function partP(HP, NC, log = console.log) {
  const ids = gLocBooks(HP), rows = [];
  const chosen = NC.rows.find((r) => r.key === NC.chosen), fit = chosen.fit, gl = NC.chosenGl;
  const mer = find(HP, MERCURY), WbgSI = fit.Wbg * Math.pow(10, mer.scaleExp.M) / Math.pow(10, 3 * mer.scaleExp.L);
  for (const id of ids) {
    const p = find(HP, id), h = hOf(p), X = p.scaleExp, dens = Math.pow(10, X.M) / Math.pow(10, 3 * X.L);
    const declGl = p.physics.gLoc, rd = p.physics.relativeDrag;
    const ctl = measure(HP, variantOf(p, { Wbg: null, gl: null }), h), ctl2 = measure(HP, variantOf(p, { Wbg: null, gl: null }), h / 2);
    const bk = measure(HP, p, h), bk2 = measure(HP, p, h / 2);
    const o = { id, emoji: p.emoji, gl: declGl, h, WbgDecl: (rd.enabled === false) ? null : rd.Wbg, ctl: { aps: ctl.aps, apsH2: ctl2.aps, periodDays: ctl.periodDays },
      book: { aps: bk.aps - ctl.aps, apsH2: bk2.aps - ctl2.aps, periodShiftDays: bk.periodDays - ctl.periodDays, periodDays: bk.periodDays, periodDaysH2: bk2.periodDays },
      pn1: pn1Formula(p).arcsecCy };
    if (id !== MERCURY) {   // 移送の予言(記録 —— 本には宣言しない): 🌡️ の W_bg(同じ SI)を引きずり ON で
      const Wt = Number((WbgSI / dens).toPrecision(12)), t = measure(HP, variantOf(p, { Wbg: Wt }), h), t2 = measure(HP, variantOf(p, { Wbg: Wt }), h / 2);
      o.transfer = { Wbg: Wt, WbgSI, aps: t.aps - ctl.aps, apsH2: t2.aps - ctl2.aps, dragPart: (t.aps - ctl.aps) - (bk.aps - ctl.aps), periodShiftDays: t.periodDays - ctl.periodDays };
    }
    rows.push(o);
    log(`P ${p.emoji} 本(G_loc ${JSON.stringify(declGl)}・W_bg ${o.WbgDecl})近点率の差 ${o.book.aps.toFixed(5)}(h/2 ${o.book.apsH2.toFixed(5)})・1PN の式 ${o.pn1.toFixed(5)}・周期の差 ${o.book.periodShiftDays.toExponential(3)} 日`
      + (o.transfer ? `・移送 ${o.transfer.aps.toFixed(5)}(引きずり分 ${o.transfer.dragPart.toExponential(3)})` : ''));
  }
  const rec = fitRecordOf302c(HP, fit, NC.chosenN);
  const dp = clone(mer); dp.physics.relativeDrag.Wbg = fit.Wbg; delete dp.physics.relativeDrag.enabled; dp.physics.gLoc = clone(gl); dp.fitRecord = rec;
  const v = HP.validatePreset(clone(dp));
  rec.cond.sig = v.ok ? HP.fitCondSig(v.preset, rec) : '';
  const vr = HP.validateFitRecord(clone(rec));
  return { ids, gl, rows, mercury: { Wbg: fit.Wbg, WbgSI, band: wbgBand(fit), fitRecord: rec, recordAccepted: !!vr.ok, recordErr: vr.ok ? null : vr.err, status: rec.status } };
}

/* ── 段 G: 🌦️🌔(地球と月 —— 118 公転の窓)に G_loc を入れたときの効果の大きさ(入れるかの判断の材料 —— 本には宣言しない) ── */
export function partG(HP, gl, log = console.log) {
  const out = [];
  for (const [id, ci, oi] of [['earthMoonSunInertial3d', 1, 2], ['earthMoonOnly3d', 0, 1]]) {
    const p = find(HP, id), rec = p.fitRecord || null, o = { dt: 0.016, revMax: 118, ci, oi };
    const W = (q, dt) => windowsOf(runEm3(HP, q, Object.assign({}, o, { dt })), [118], HP)[0];
    const a = W(p, 0.016), b = W(variantOf(p, { gl }), 0.016), a2 = W(p, 0.008), b2 = W(variantOf(p, { gl }), 0.008);
    const tol = rec ? rec.targets.map((t) => ({ q: t.q, unit: t.unit, tol: t.tol.value, h2: t.numerics ? t.numerics.h2 : null })) : null;
    const r = { id, emoji: p.emoji, dT1: b.T1 - a.T1, dT1H2: b2.T1 - a2.T1, dSid: b.sid - a.sid, dSidH2: b2.sid - a2.sid, T1: a.T1, sid: a.sid, tol,
      ratioT1: tol ? Math.abs(b.T1 - a.T1) / tol[0].tol : null, ratioSid: tol ? Math.abs(b.sid - a.sid) / tol[1].tol : null };
    out.push(r);
    log(`G ${p.emoji} G_loc の効果: 近点回転の周期 ${r.dT1.toExponential(3)} 年(h/2 ${r.dT1H2.toExponential(3)})・恒星月 ${r.dSid.toExponential(3)} 日(h/2 ${r.dSidH2.toExponential(3)})` + (tol ? `・許容との比 ${r.ratioT1.toExponential(2)} / ${r.ratioSid.toExponential(2)}` : ''));
  }
  return { gl, rows: out, rule: '効果が照合許容の 1/10 未満なら宣言しない(再フィットの利点が無い —— 太陽の ψ は地球と月にほぼ一様で G の定数倍に近い)' };
}

/* ── 段 E: W_bg の推定(html の wbgEstimateOf —— 宣言のまま)と試算(銀河の局所密度・恒星を背景側にした場合・系の外の太陽) ── */
export const MSUN = 1.98847e30, PC = 3.0857e16, KPC = 3.0857e19, AU = 1.495978707e11;
/** 器の中だけの試算(本に宣言しない): 太陽近傍の局所の全密度(恒星・ガス・暗黒物質の和)を銀河中心距離で切った一様な球。 */
export const GAL_TRIAL = Object.freeze({ rhoSI: 0.097 * 1.98847e30 / Math.pow(3.0857e16, 3), RSI: 8.2 * 3.0857e19,
  source: '太陽近傍の局所の全密度 0.097 M☉/pc³(McKee, Parravano & Hollenbach 2015, ApJ 814, 13 —— 恒星・ガス・暗黒物質の和)と銀河中心距離 R₀ = 8.2 kpc(Bland-Hawthorn & Gerhard 2016, ARA&A 54, 529)の転記 —— 本便のコンテナはネットワークに出られず原表は未取得(公表値の転記・照合は次の見直し)' });
const kEps = (d, eps) => { const q = d * d + eps * eps; return d / (q * q); };
export function partE(HP, log = console.log) {
  const books = HP.allPresets().filter((p) => p.familyRole !== 'retired' && p.scaleExp && p.physics && p.physics.relativeDrag && p.physics.relativeDrag.law === 'inertial');
  const rows = [];
  for (const p of books) {
    const e = HP.wbgEstimateOf(p); if (!e.ok) continue;
    const X = p.scaleExp, dens = e.densSI, Lm = Math.pow(10, X.L), Mk = Math.pow(10, X.M), rd = p.physics.relativeDrag;
    const gq = clone(p); gq.physics.relativeDrag.env = { galaxy: { rhoSI: GAL_TRIAL.rhoSI, RSI: GAL_TRIAL.RSI } };
    const eg = HP.wbgEstimateOf(gq);
    // 恒星を背景側にした場合(源の集合から恒星を外す試算 —— 受け手と対を組む最も重い粒子を恒星とする)
    const B = p.bodies, ri = e.receiver, star = e.sources.drag.length ? e.sources.drag.reduce((a, j) => (B[j].m > B[a].m ? j : a), e.sources.drag[0]) : null;
    const dStar = star === null ? null : Math.hypot(B[star].x - B[ri].x, B[star].y - B[ri].y, (B[star].z || 0) - (B[ri].z || 0));
    const wStar = star === null ? 0 : B[star].m * kEps(dStar, e.eps);
    const r = { id: p.id, emoji: p.emoji, receiver: ri, eps: e.eps, densSI: dens, coord: p.physics.coord === '3d' ? '3d' : '2d', fitted: !!(p.fitRecord && p.fitRecord.status === 'fitted'),
      WcosSI: e.Wcos.SI, WgalTrialSI: eg.Wgal.SI, WsysSI: e.Wsys.SI, sysTerms: e.Wsys.terms, totalSI: e.total.SI, totalTrialSI: eg.total.SI,
      sources: e.sources, sumWSI: e.sumW.SI, WdeclSI: e.Wdecl === null ? null : e.Wdecl * dens, enabled: rd.enabled !== false && e.Wdecl !== null,
      ratioToDecl: e.ratioToDecl, ratioTrialToDecl: e.Wdecl ? eg.total.book / e.Wdecl : null, xi: e.xi, xiTrial: eg.xi,
      starAsBackground: star === null ? null : { star, mSI: B[star].m * Mk, dSI: dStar * Lm, WstarSI: wStar * dens, totalSI: eg.total.SI + wStar * dens, sumWLeftSI: e.sumW.SI - wStar * dens,
        ratioToDecl: e.Wdecl ? (eg.total.book + wStar) / e.Wdecl : null } };
    r.gapDex = (r.WdeclSI && r.totalTrialSI > 0) ? Math.log10(r.WdeclSI / r.totalTrialSI) : null;
    rows.push(r);
    log(`E ${p.emoji} ${p.id}: W_cos ${r.WcosSI.toExponential(3)}・W_gal(試算)${r.WgalTrialSI.toExponential(3)}・W_sys ${r.WsysSI.toExponential(3)}・計 ${r.totalTrialSI.toExponential(3)} kg/m³・宣言 ${r.WdeclSI === null ? '—' : r.WdeclSI.toExponential(3)}(差 ${r.gapDex === null ? '—' : r.gapDex.toFixed(2)} dex)・ξ ${r.xiTrial === null ? '—' : r.xiTrial.toExponential(2)}`
      + (r.starAsBackground ? `・恒星を背景側 ${r.starAsBackground.totalSI.toExponential(3)}` : ''));
  }
  return { galTrial: GAL_TRIAL, cosmo: { H0kmsMpc: 67.4, note: '第301便a の COSMO と同じ値(臨界密度・地平 c/H₀ で切断・核の ε の対数)' }, rows };
}

/* ── 段 C: 推定で固定したときの dragCore の探索(🌡️〔G_loc 入り〕・🌦️ の月・🟪) ── */
// 走行は歩数の上限つき(公転が成り立たない走りで止まらないように)。目的の量: 🌡️ 近点率の差(対照: 引きずり OFF ∧ G_loc なし)・🌦️ 近点回転の周期と恒星月・🟪 公転周期
export const C_BOOKS = Object.freeze([
  { id: 'mercurySunInertial3d', core: 0, kind: 'pl3' },
  { id: 'earthMoonSunInertial3d', core: 1, kind: 'ems', ci: 1, oi: 2, env: null },
  { id: 'plutoCharonInertialFit', core: 0, kind: 'pair2d', ci: 0, oi: 1 },
]);
const MF_GRID = [0.05, 0.2, 0.4, 0.6, 0.8, 1.0], RF_GRID = [0.1, 0.25, 0.5, 0.75, 1.0];
function guardPl3(HP, q, h, maxSteps) {   // runPl3 の写し(上限つき —— 器 exp-w299c の runPl3 と同じ抽出)
  const v = HP.validatePreset(clone(q)); if (!v.ok) return { err: v.errors };
  const S = HP.coord3d.makeSim(); S.build(clone(v.preset));
  const rel = () => [S.x[1] - S.x[0], S.y[1] - S.y[0], S.z[1] - S.z[0]];
  let k = 0, nan = false; const ev = { rev: [], peri: [], apo: [] };
  const p0 = rel(), r0 = Math.hypot(...p0); let rMin = r0, rMax = r0;
  // 公転の数え(初期の軌道面の中の方位)だけ —— 目的の量が定義されるかの判定に使う(定義されれば runPl3 で測り直す)
  const vv = [S.vx[1] - S.vx[0], S.vy[1] - S.vy[0], S.vz[1] - S.vz[0]], W0 = [p0[1] * vv[2] - p0[2] * vv[1], p0[2] * vv[0] - p0[0] * vv[2], p0[0] * vv[1] - p0[1] * vv[0]];
  const nW = Math.hypot(...W0), Wu = W0.map((x) => x / nW), Pu = p0.map((x) => x / r0), Qu = [Wu[1] * Pu[2] - Wu[2] * Pu[1], Wu[2] * Pu[0] - Wu[0] * Pu[2], Wu[0] * Pu[1] - Wu[1] * Pu[0]];
  const ang = (d) => Math.atan2(d[0] * Qu[0] + d[1] * Qu[1] + d[2] * Qu[2], d[0] * Pu[0] + d[1] * Pu[1] + d[2] * Pu[2]);
  let aPrev = ang(p0), acc = 0;
  for (; k < maxSteps; k++) { S.step(h); const d = rel(), rr = Math.hypot(...d); if (!Number.isFinite(rr)) { nan = true; break; }
    if (rr < rMin) rMin = rr; if (rr > rMax) rMax = rr;
    const a = ang(d); let da = a - aPrev; while (da > Math.PI) da -= 2 * Math.PI; while (da < -Math.PI) da += 2 * Math.PI; acc += da; aPrev = a;
    if (Math.abs(acc) >= 2 * Math.PI * (ev.rev.length + 1)) ev.rev.push(k * h);
    if (ev.rev.length >= N_WIN) break; }
  const st = HP.inertialDragState(S);
  return { steps: k, revs: ev.rev.length, nan: nan || S.hasNaN(), rMin, rMax, r0, halt: S.inertialDragHalt === true, uMax: st ? st.uMax : null, boundOver: st ? st.boundOver : null };
}
function guard2d(HP, q, dt, maxSteps, ci, oi) {
  const v = HP.validatePreset(clone(q)); if (!v.ok) return { err: v.errors };
  HP.sim.build(v.preset); const S = HP.sim;
  const rel = () => [S.x[oi] - S.x[ci], S.y[oi] - S.y[ci]];
  let k = 0, aPrev = Math.atan2(rel()[1], rel()[0]), acc = 0, revs = 0, nan = false; const r0 = Math.hypot(...rel()); let rMin = r0, rMax = r0;
  for (; k < maxSteps; k++) { S.step(dt); const d = rel(), rr = Math.hypot(...d); if (!Number.isFinite(rr)) { nan = true; break; }
    if (rr < rMin) rMin = rr; if (rr > rMax) rMax = rr;
    const a = Math.atan2(d[1], d[0]); let da = a - aPrev; while (da > Math.PI) da -= 2 * Math.PI; while (da < -Math.PI) da += 2 * Math.PI; acc += da; aPrev = a;
    if (Math.abs(acc) >= 2 * Math.PI * (revs + 1)) revs++;
    if (revs >= N_WIN) break; }
  return { steps: k, revs, nan: nan || S.hasNaN(), rMin, rMax, r0 };
}
/** 目的の量(本ごと)。q は走らせる本。戻り値 y(配列)と付帯。公転が成り立たなければ y = null。 */
export function targetOf(HP, B, q) {
  if (B.kind === 'pl3') {
    const h = hOf(q), g = guardPl3(HP, q, h, 2 * 47600 * N_WIN);
    if (g.err || g.nan || g.revs < N_WIN) return { y: null, guard: g };
    const ctl = measure(HP, variantOf(q, { Wbg: null, gl: null }), h), m = measure(HP, q, h);
    return { y: [m.aps - ctl.aps], names: ['近点率の差 ″/世紀'], guard: g, periodDays: m.periodDays };
  }
  if (B.kind === 'ems') {
    const R = runEm3(HP, q, { dt: 0.016, revMax: 118, ci: B.ci, oi: B.oi }), w = windowsOf(R, [118], HP)[0];
    if (!w || !Number.isFinite(w.T1) || !Number.isFinite(w.sid)) return { y: null, guard: { stop: R.stop, revs: (R.ev && R.ev.rev) ? R.ev.rev.length : null, steps: R.steps } };
    return { y: [w.T1, w.sid], names: ['近点回転の周期 年', '恒星月 日'], guard: { stop: R.stop, steps: R.steps } };
  }
  const g = guard2d(HP, q, 0.16, 2 * 345000 * N_WIN, B.ci, B.oi);
  if (g.err || g.nan || g.revs < N_WIN) return { y: null, guard: g };
  const R = run2d(HP, q, { dt: 0.16, revMax: N_WIN, ci: B.ci, oi: B.oi }), rev = R.ev.rev;
  return { y: [(rev[N_WIN - 1] - rev[0]) / (N_WIN - 1) * Math.pow(10, q.scaleExp.T)], names: ['公転周期 s'], guard: g };
}
const svd2 = (J) => {   // J は m×2 —— JᵀJ の固有値の平方根(特異値)
  let a = 0, b = 0, c = 0; for (const r of J) { a += r[0] * r[0]; b += r[0] * r[1]; c += r[1] * r[1]; }
  const tr = a + c, det = a * c - b * b, d = Math.sqrt(Math.max(0, tr * tr / 4 - det));
  return [Math.sqrt(Math.max(0, tr / 2 + d)), Math.sqrt(Math.max(0, tr / 2 - d))];
};
export function partC(HP, E, log = console.log) {
  const out = [];
  for (const B of C_BOOKS) {
    const p0 = find(HP, B.id), er = E.rows.find((r) => r.id === B.id), X = p0.scaleExp, dens = er.densSI, body = p0.bodies[B.core];
    const rec = p0.fitRecord, tg = rec.targets.map((t) => ({ obs: t.obs, tol: t.tol.value, unit: t.unit }));
    // 推定(宣言のまま + 銀河の試算 + 系の外の太陽〔🟪 —— 冥王星の軌道長半径 39.48 au の太陽を env で〕)
    let q0 = clone(p0); if (B.id === 'plutoCharonInertialFit') q0.physics.relativeDrag.env = { bodies: [{ m: MSUN / Math.pow(10, X.M), d: 39.482 * AU / Math.pow(10, X.L), label: '太陽(39.48 au —— 系の外の背景側)' }] };
    q0.physics.relativeDrag.env = Object.assign({}, q0.physics.relativeDrag.env || {}, { galaxy: { rhoSI: GAL_TRIAL.rhoSI, RSI: GAL_TRIAL.RSI } });
    const est = HP.wbgEstimateOf(q0), Wfit = p0.physics.relativeDrag.Wbg, West = est.total.book;
    // ① 推定で固定した走り(dragCore は宣言のまま)
    const qE = variantOf(q0, { Wbg: West }), tE = targetOf(HP, B, qE);
    log(`C ${p0.emoji} 推定 W ${(West * dens).toExponential(3)} kg/m³(フィット ${(Wfit * dens).toExponential(3)}・比 ${(West / Wfit).toExponential(2)})→ ${tE.y ? tE.y.map((v) => v.toPrecision(8)).join(' / ') : '目的の量が定義されない ' + JSON.stringify(tE.guard).slice(0, 160)}`);
    // ② dragCore の格子 —— 受け手の距離での核の比 ⟨K⟩/K(Σw の変わり方 —— 走らせない)
    const ri = er.receiver, d = Math.hypot(body.x - p0.bodies[ri].x, body.y - p0.bodies[ri].y, (body.z || 0) - (p0.bodies[ri].z || 0)), eps = er.eps;
    const grid = [];
    for (const mf of MF_GRID) for (const rf of RF_GRID) {
      if (rf === 1 && mf < 1) continue;
      const q = variantOf(p0, { dragCore: { [B.core]: { massFrac: mf, radius: Number((rf * body.radius).toPrecision(12)) } } });
      const v = HP.validatePreset(clone(q)); if (!v.ok) { grid.push({ mf, rf, err: String(v.errors).slice(0, 120) }); continue; }
      const S = (p0.physics.coord === '3d') ? HP.coord3d.makeSim() : HP.sim; S.build(clone(v.preset));
      const T = S._dragCoreT && S._dragCoreT[B.core]; grid.push({ mf, rf, ratio: T ? HP.dragCoreLookup(T, d) / kEps(d, eps) : null });
    }
    const rs = grid.filter((g) => g.ratio !== null && g.ratio !== undefined).map((g) => g.ratio);
    const need = West / Wfit;   // 推定で同じ応答を出すのに Σw に要る倍率(X = Σw/W_bg を保つ)
    // ③ 感度行列(フィットの W_bg と推定の W_bg で —— dragCore の (massFrac, radius/R) の有限差分)
    const base = body.dragCore ? { mf: body.dragCore.massFrac, rf: body.dragCore.radius / body.radius } : { mf: 0.5, rf: 0.5 };
    const at = (W, mf, rf) => targetOf(HP, B, variantOf(p0, { Wbg: W, dragCore: { [B.core]: { massFrac: mf, radius: Number((rf * body.radius).toPrecision(12)) } } }));
    const sens = (W) => { const y0 = at(W, base.mf, base.rf); if (!y0.y) return { defined: false, guard: y0.guard };
      const y1 = at(W, base.mf + 0.1, base.rf), y2 = at(W, base.mf, base.rf + 0.1); if (!y1.y || !y2.y) return { defined: false };
      const J = y0.y.map((v, i) => [(y1.y[i] - v) / 0.1, (y2.y[i] - v) / 0.1]), sv = svd2(J);
      // 複数の初期値(格子の 3 点)から 1 次の最小ノルムの解 —— 目的の値に届く dragCore があるか・解の広がり
      const starts = [[0.2, 0.25], [0.6, 0.5], [0.9, 0.75]];
      const sols = starts.map(([m0, r0]) => { const res = y0.y.map((v, i) => (tg[i].obs - (v + J[i][0] * (m0 - base.mf) + J[i][1] * (r0 - base.rf))));
        // 最小ノルムの一次の一歩(J⁺ res)
        let a = 0, b = 0, c = 0, u0 = 0, u1 = 0; for (let i = 0; i < J.length; i++) { a += J[i][0] ** 2; b += J[i][0] * J[i][1]; c += J[i][1] ** 2; u0 += J[i][0] * res[i]; u1 += J[i][1] * res[i]; }
        const det = a * c - b * b; let dm, dr;
        if (Math.abs(det) > 1e-30 * (a * c + 1e-300)) { dm = (c * u0 - b * u1) / det; dr = (a * u1 - b * u0) / det; } else { const n2 = a + c; dm = n2 > 0 ? u0 / n2 : Infinity; dr = n2 > 0 ? u1 / n2 : Infinity; }
        const m1 = m0 + dm, r1 = r0 + dr; return { start: [m0, r0], solution: [m1, r1], inRange: m1 > 0 && m1 <= 1 && r1 > 0 && r1 <= 1 }; });
      const fin = sols.filter((z) => Number.isFinite(z.solution[0]) && Number.isFinite(z.solution[1]));
      const spread = fin.length >= 2 ? Math.max(...fin.flatMap((a) => fin.map((b) => Math.hypot(a.solution[0] - b.solution[0], a.solution[1] - b.solution[1])))) : null;
      return { defined: true, y0: y0.y, J, singular: sv, cond: sv[1] > 0 ? sv[0] / sv[1] : null, sols, spread, anyInRange: sols.some((z) => z.inRange),
        resid0: y0.y.map((v, i) => v - tg[i].obs), relSens: J.map((r, i) => Math.hypot(r[0], r[1]) / tg[i].tol) }; };
    const sFit = sens(Wfit), sEst = tE.y ? sens(West) : { defined: false, guard: tE.guard };
    const o = { id: B.id, emoji: p0.emoji, coreBody: B.core, receiver: ri, dReceiver: d, bodyRadius: body.radius, eps, targets: tg,
      estimate: { WSI: West * dens, Wbook: West, WcosSI: est.Wcos.SI, WgalSI: est.Wgal.SI, WsysSI: est.Wsys.SI, terms: est.Wsys.terms, sources: est.sources }, WfitSI: Wfit * dens, ratio: West / Wfit,
      atEstimate: { y: tE.y, guard: tE.guard }, coreGrid: grid, kernelRatioRange: rs.length ? [Math.min(...rs), Math.max(...rs)] : null, needSigmaFactor: need,
      gapDex: rs.length ? Math.log10(Math.min(...rs)) - Math.log10(need) : null, sensAtFit: sFit, sensAtEstimate: sEst };
    out.push(o);
    log(`C ${p0.emoji} dragCore の核の比 ⟨K⟩/K ${o.kernelRatioRange ? o.kernelRatioRange.map((x) => x.toFixed(6)).join('〜') : '—'}・要る Σw の倍率 ${need.toExponential(2)}(届かない桁 ${o.gapDex === null ? '—' : o.gapDex.toFixed(1)} dex)`
      + `・フィットの W での特異値 ${sFit.defined ? sFit.singular.map((x) => x.toExponential(2)).join(', ') : '—'}・許容に対する感度 ${sFit.defined ? sFit.relSens.map((x) => x.toExponential(2)).join(', ') : '—'}・解の広がり ${sFit.defined && sFit.spread !== null ? sFit.spread.toExponential(2) : '—'}`);
  }
  return { books: out, grid: { massFrac: MF_GRID, radiusFrac: RF_GRID } };
}

/* ── 段 L: 帳簿の継ぎ目(G_loc と引きずりを両方宣言した本 —— R_E = ΔE − W − gLocWork が刻みで 1 次に 0 へ) ── */
// 🌡️ の写し(G_loc n=−3)に引きずりが見える強さ(W_bg = G_loc の前の 221.1205993960312 —— 引きずりの分 43″/世紀)を置き、画面の刻み stepDt(1 公転 360 步)の
// h・h/2・h/4 で 1 公転走らせる。読み口 inertialDragLedgerOf の R_E(gLocWork を引く)と REnoGLoc(従来の式)を並べる
export function partL(HP, gl, log = console.log) {
  const run = (q, h0, T, d) => { const v = HP.validatePreset(clone(q)); if (!v.ok) throw new Error('L validatePreset ' + JSON.stringify(v.errors).slice(0, 200));
    HP.sim.build(v.preset); const S = HP.sim, dt = h0 / d, N = Math.round(T / dt);
    for (let k = 0; k < N; k++) S.step(dt);
    const g = HP.inertialDragLedgerOf(S);
    return { d, dt, steps: N, RE: g.RE, REnoGLoc: g.REnoGLoc, gLocWork: g.gLocWork, W: g.work, E0: g.E0, seam: g.ledgerSeam || null }; };
  const conv = (rows, k) => [rows[0][k] / rows[1][k], rows[1][k] / rows[2][k]];
  // ① 人工二体(器 exp-w302b-gloc の toyPreset —— μ=1・c₀=30・自由な二体 m₂/m₁=0.25・三次元)に G_loc と引きずり(W_bg 100・ε 0.05)を両方宣言 —— gLocWork が積分器の誤差より大きい条件
  const toy = B302.toyPreset({ pinned: false, m: 0.25, d3: true, gl, drag: { law: 'inertial', Wbg: 100, eps: 0.05, pairs: 'all', history: 'positions' } });
  const P = 2 * Math.PI * Math.sqrt(1 / toy.mu), toyRows = [1, 2, 4].map((d) => run(toy, P / 400, 3 * P, d));
  for (const r of toyRows) log(`L 人工二体 h/${r.d}: R_E ${r.RE.toExponential(3)}(gLocWork を引かない式 ${r.REnoGLoc.toExponential(3)})・gLocWork ${r.gLocWork.toExponential(3)}・W ${r.W.toExponential(3)}`);
  // ② 🌡️ の写し(G_loc + G_loc の前の W_bg 221.1205993960312 —— 引きずりの分 43″/世紀)・画面の刻み stepDt の h・h/2・h/4 で 1 公転(記録 —— gLocWork は積分器の誤差より小さい)
  const p0 = find(HP, MERCURY), q = variantOf(p0, { Wbg: 221.1205993960312, gl });
  const merRows = [1, 2, 4].map((d) => run(q, q.physics.stepDt, q.timeRef.pRef, d));
  for (const r of merRows) log(`L 🌡️ h/${r.d}: R_E ${r.RE.toExponential(3)}(gLocWork を引かない式 ${r.REnoGLoc.toExponential(3)})・gLocWork ${r.gLocWork.toExponential(3)}`);
  const ratio = conv(toyRows, 'RE'), ratioNo = conv(toyRows, 'REnoGLoc');
  const out = { gl, toy: { mu: toy.mu, c: 30, m2: 0.25, Wbg: 100, eps: 0.05, orbits: 3, perOrbit: 400, rows: toyRows, ratio, ratioNoGLoc: ratioNo },
    mercury: { book: MERCURY, Wbg: 221.1205993960312, rows: merRows, ratio: conv(merRows, 'RE') },
    // 刻み 0 への外挿(一次の Richardson: 2R(h/4) − R(h/2)): gLocWork を引く R_E は 0 へ・引かない式は gLocWork へ(継ぎ目が無いと残る量)
    richardson: { RE: 2 * toyRows[2].RE - toyRows[1].RE, REnoGLoc: 2 * toyRows[2].REnoGLoc - toyRows[1].REnoGLoc, gLocWork: toyRows[2].gLocWork },
    converges: ratio.every((r) => r > 1.6), seamVersion: toyRows[0].seam };
  out.seamCloses = Math.abs(out.richardson.RE) < 0.1 * Math.abs(out.richardson.gLocWork) && Math.abs(out.richardson.REnoGLoc - out.richardson.gLocWork) < 0.1 * Math.abs(out.richardson.gLocWork);
  return out;
}

/* ── 本の文面に転記する数(QA preset.gLocPlanets302 が同じ関数で照合する) ── */
export const fmtAps = (x) => Number(x).toPrecision(6);
export const fmtDays = (x) => Number(x).toExponential(2);
/** G_loc だけの本(引きずり OFF)の観測カードの行に入る数の文字列。 */
export function glocRowNumbers(r) {
  return [fmtAps(r.book.aps), fmtAps(r.book.apsH2), fmtDays(r.book.periodShiftDays), fmtAps(r.transfer.aps), Number(r.transfer.dragPart).toExponential(2), Number(r.pn1).toPrecision(4)];
}
/** 🌡️ の観測カードに入る数の文字列(n の表の rms・フィット)。 */
export function mercuryNumbers(NC) {
  const R = Object.fromEntries(NC.rows.map((r) => [r.key, r])), f = R[NC.chosen].fit, b = wbgBand(f);
  return [String(f.Wbg), f.diff.toFixed(5), f.diffH2.toFixed(5), f.gLocPart.toFixed(5), f.dragPart.toFixed(5), Math.abs(f.residual).toExponential(2), f.h2gap.toExponential(2),
    Number(b[0]).toExponential(3), Number(b[1]).toExponential(3), R[NC.chosen].rms.toExponential(2), R.n2.rms.toFixed(3), R.nm2.rms.toFixed(3), R.none.rms.toFixed(3),
    NC.grRef.venusSunInertial3d.measured.toFixed(4), NC.grRef.marsSunInertial3d.measured.toFixed(4)];
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) {
  const t0 = Date.now();
  const OUT_PATH = process.env.W302C_OUT || path.join(ROOT, 'tests', 'out', 'wbgest-w302c.json');
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
  const out = { meta: null, version: HARNESS_VERSION, parts: PARTS };
  const tp = {};
  const timed = (k, f) => { const t = Date.now(); const r = f(); tp[k] = (Date.now() - t) / 1000; return r; };
  if (PARTS.includes('N')) out.nChoice = timed('N', () => partN(HP));
  else if (process.env.W302C_N_FROM) out.nChoice = JSON.parse(fs.readFileSync(process.env.W302C_N_FROM, 'utf8')).nChoice;   // 試走だけ(正本は全段)
  if (PARTS.includes('P') && out.nChoice) out.planets = timed('P', () => partP(HP, out.nChoice));
  if (PARTS.includes('G') && out.nChoice) out.earthMoon = timed('G', () => partG(HP, out.nChoice.chosenGl));
  if (PARTS.includes('E')) out.estimate = timed('E', () => partE(HP));
  if (PARTS.includes('C') && out.estimate) out.dragCore = timed('C', () => partC(HP, out.estimate));
  if (PARTS.includes('L') && out.nChoice) out.ledger = timed('L', () => partL(HP, out.nChoice.chosenGl));
  const gates = {};
  if (out.nChoice) { gates.nChosen = out.nChoice.chosen !== null; gates.nFitsGate = out.nChoice.rows.filter((r) => r.fit.reachable).every((r) => r.fit.gate); gates.n2Listed = out.nChoice.rows.some((r) => r.n === 2 && r.transfer.length === TRANSFER.length); }
  if (out.planets) { gates.recordAccepted = out.planets.mercury.recordAccepted; gates.fitted = out.planets.mercury.status === 'fitted'; gates.declaredSet = out.planets.ids.length > 0; }
  if (out.earthMoon) gates.earthMoonMeasured = out.earthMoon.rows.length === 2 && out.earthMoon.rows.every((r) => Number.isFinite(r.dT1) && Number.isFinite(r.dSid));
  if (out.estimate) {
    gates.estimateRows = out.estimate.rows.filter((r) => r.fitted).length >= 3;
    gates.sourcesDisjoint = out.estimate.rows.every((r) => r.sources.overlap === 0 && r.sources.drag.every((j) => r.sources.background.indexOf(j) < 0));
    // W_cos の閉形式(第301便a の器 cosmicBackground)と html の wbgEstimateOf の一致
    gates.wcosClosedForm = out.estimate.rows.every((r) => { const p = HP.allPresets().find((q) => q.id === r.id), c = cosmicBackground(p.scaleExp, r.eps); return Math.abs(c.WSI / r.WcosSI - 1) < 1e-12; });
  }
  if (out.dragCore) { gates.dragCoreSearched = out.dragCore.books.length === C_BOOKS.length && out.dragCore.books.every((b) => b.kernelRatioRange && b.sensAtFit && b.sensAtFit.defined);
    gates.kernelNotBelowPoint = out.dragCore.books.every((b) => b.kernelRatioRange[0] >= 1 - 1e-9); }
  if (out.ledger) { gates.ledgerConverges = out.ledger.converges; gates.ledgerSeamCloses = out.ledger.seamCloses; }
  out.gates = gates; out.ok = Object.values(gates).every(Boolean); out.timing = tp;
  const CODE = ['tests/exp-w302c-wbgest.mjs', 'tests/exp-w299c-planets3d.mjs', 'tests/lib-w299c-planets3d.mjs', 'tests/exp-w302b-gloc.mjs', 'tests/exp-w300b-emonly.mjs', 'tests/exp-w302d-semic.mjs', 'tests/exp-w301a-dragnorm.mjs', 'tests/lib-w302c-pre.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第302便c', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, loadErrors: errors.length,
    ruling: '原仮定者の裁定(第92報)AN304 ①(慣性速度に影響する重力の計算に 1PN 相当の補正 —— G_loc = κ·c_loc² ほか)・③(W_bg は背景宇宙・銀河の中の位置・恒星系の中の位置などの合算で決まると推定 —— 推定値で dragCore のフィットが安定する)',
    reading: '統括の検証項目 R190(n は 1 つの W_bg の移送の予言で決める・推定は W_cos + W_gal + W_sys・推定で固定した dragCore の探索・帳簿の継ぎ目)',
    notClaim: ['43″/世紀が出た', 'GR と一致した', 'dragCore が一意に決まった', 'W_bg の宇宙の値が決まった', '推定とフィットが一致した'] });
  out.elapsedS = (Date.now() - t0) / 1000;
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 1) + '\n');
  console.log('gates ' + JSON.stringify(gates));
  console.log('→ ' + path.relative(ROOT, OUT_PATH) + '(' + out.elapsedS.toFixed(1) + ' s)・ok ' + out.ok);
  process.exit(out.ok ? 0 : 1);
}
