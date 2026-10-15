// 第304便c(原仮定者の裁定(第94報)—— 決断事項 AN316 ①〜④ の提案に同意・統括の検証項目 R197)——
// **🌦️🌔 の基線の見直しの器**(Node だけ —— 対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、アプリの三次元の步
// 〔HP.coord3d.makeSim の step〕を走らせる。走行は 1 プロセスで順に —— 1062 公転の走行は同時 1 本)。
// 第303便c の監査(引きずり OFF の 118 公転窓 M1 と B1 の差 +0.0481 年 = 抽出器の窓 +0.0327・軟化 ε 0.01 の +0.0113・e′ の欠落 +0.0092・平均の要素 −0.0045)を
// 本の宣言へ移した: (1) 重力と引きずりの核の軟化 ε 0.01 → 0.0005(physics.softeningFloor の宣言 —— 最小は第304便c で 0.0001)・(2) 地球–月の重心の公転を
// 離心率 e′ 0.0167086 の楕円(t=0 は近日点 —— 元期の宣言なし)・(3) 初期配置を偏りのない平均の要素(長窓 1062 公転の調和の回帰の恒星月 = B1・平均離心率 0.0549・
// 平均傾斜 5.145°)へ・(4) 標的の抽出器を M4(調和の回帰)・長窓へ。そのうえで**引きずり OFF** の近点の周期・恒星月・交点を測る。
//
// ■ 段(正本 tests/out/baseline-w304c.json —— 段 baseline-304c)。W304C_PARTS=solve,measure,record,emo(既定は全部)で段を分けて走らせられる
//   (分けたときは既存の出力 JSON の他の段を残して上書き —— 鎖は全段で走らせる)。W304C_OUT で出力先を変える(試走は正本を書かない)。
//   solve   第303便の宣言の写し(tests/lib-w304c-pre.mjs の DECL303)の初期配置から、新しい ε・e′・引きずり OFF の写しで平均の要素の 3 元 Newton
//           (器の中の参照積分で長窓 → エンジン〔アプリの步〕の長窓で仕上げ)→ 丸め(近地点距離 7 桁・接触離心率 7 桁・接触傾斜 5 桁)→ 本の宣言と同じかの門。
//   measure 本の宣言(html)の 🌦️ を、引きずり OFF(宣言)と ON(第303便a の W_bg 3.85583 —— 対照)で、窓 [0,118]/[0,354]/[0,708]/[0,1062] と
//           118 公転窓を 12 公転ずつずらした分布・抽出器 M1(近点の通過の直線)/M4(調和の回帰)/M4a(M4 に年周の項 —— 診断)・h/h2/h4・恒星月(調和)・交点・
//           平均の要素・B1 との差と照合許容。器の中の参照積分(同じ ε と ε 0 —— 軟化の残り)・起点の位相 180°(遠日点から —— 平均の要素を解き直し)。
//   record  本の fitRecord(w298b-1 —— 標的 3: 近点の周期 M4・恒星月・平均離心率 —— 長窓)を測った数から作り、本の宣言の記録と同じか・受理・条件の署名 match・門。
//   emo     🌔 = 🌦️ の新しい宣言の写し(器 tests/exp-w300b-emonly.mjs の emOnlyBodies・emOnlyPhysics —— declCheck)・同じ抽出器(runEm3)の 118/354 公転窓と h/2・
//           引きずり ON(移送 W_bg 3.85583 —— 対照)。
//
// ■ しないこと・言わないこと
//   ・引きずりの式は変えない(引きずり OFF の宣言 relativeDrag:{law:"inertial", Wbg:null, enabled:false} —— 既存の受理の形)。dragCore(地球 {0.325, 0.0348})は残す
//     (引きずり OFF では走りに効かない)。閾値を作り替えない。届かない量は「この探索範囲では未達 —— 次の見直し」と書く。
//   ・「月を再現した」「引きずりが無いことを示した」「現実を再現した」とは書かない —— 「この探索範囲で引きずりで埋める差は照合許容の内」。
//
// 実行(Node だけ):
//   node tests/exp-w304c-baseline.mjs                       → 正本 tests/out/baseline-w304c.json
//   W304C_PARTS=measure node tests/exp-w304c-baseline.mjs   → 段 measure だけ(他の段は既存の出力から残す)
//   W304C_OUT=<json> で試走(正本を書かない)。走行は決定的(同じ html・同じ Node で同じ数 —— 壁時計の欄は volatilePaths)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as L from './lib-w297b-fit.mjs';
import * as EM from './exp-w303c-earthmoon.mjs';
import { emOnlyBodies, emOnlyPhysics, declCheck as emDeclCheck, runEm3, windowsOf as emWindowsOf } from './exp-w300b-emonly.mjs';
import { DECL303, DECL303_DATA_FILE, LIB_VERSION as PRE_VERSION } from './lib-w304c-pre.mjs';
const REGEN_SCOPE = {"presets":["earthMoonOnly3d","earthMoonSunInertial3d","earthMoonSunInertialFit","mercurySunInertial3d","plutoCharonInertialFit"],"roots":["$","DT","FIT_COND_KEYS","FIT_COND_VERSION","FIT_KNOB_KEYS","FIT_NUMERICS_KEYS","FIT_RECORD_KEYS","FIT_RECORD_VERSION","FIT_RECORD_VERSIONS","FIT_RESIDUAL_KEYS","FIT_TARGET_KEYS","FIT_TOL_KEYS","HP.FIT_COND_VERSION","HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.fitCondInputsOf","HP.fitCondSig","HP.fitCondStateOf","HP.fitTargetGates","HP.inertialDragState","HP.sim","HP.synodic","HP.validateFitRecord","HP.validatePreset","T","ctx","cw","dfmGaussLegendre01","dfmInertialDragStep","dragCoreAngular","dragCoreAvgK","dragCoreLookup","dragCoreTableBuild","inertialDragNormApply","pnSource","relDragCoefficientOf","synUniform","validateFitRecord"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w304c-baseline-1';
const clone = (x) => JSON.parse(JSON.stringify(x));
const TARGET = process.env.QA_TARGET || 'beta/index.html';
export const FIT_ID = EM.FIT_ID, EMO_ID = EM.EMO_ID;
export const DT = 0.016, DT2 = 0.008, DT4 = 0.004;
export const YEAR = EM.YEAR, DAY = EM.DAY;
/** 第304便c の基線の宣言の規則(本の宣言はこの規則と solve の丸めの写し —— 段 solve の門) */
export const BASE = Object.freeze({
  eps: 0.0005,              // 重力と引きずりの核の軟化 [本の長さ = 10⁸ m] = 50 km(physics.softening・softeningFloor・relativeDrag.eps)
  ePrime: 0.0167086,        // 地球–月の重心の公転離心率(Simon et al. 1994 の J2000 の値 —— 第303便c と同じ)
  phase: 0,                 // t=0 の重心の位置: 0 = 近日点から(180 = 遠日点から —— 段 measure で比べる)
  long: 1062, wins: Object.freeze([118, 354, 708, 1062]), slide: 12,
  round: Object.freeze({ rp: 7, e0: 7, inc: 5 }),   // 初期配置のノブの丸め(小数の桁 —— 第303便a の宣言と同じ桁)
  note: '軟化 ε 0.0005(軟化の近点への効き −3π(ε/a)²/(1−e²)² は相対 2.4×10⁻⁶ ≈ 照合許容の 1/190)・e′ 0.0167086(近日点から)・平均の要素(長窓 1062 公転)・引きずり OFF' });
/** 照合許容(宣言 —— 出典に σ が無い)。近点・交点 0.005 年・恒星月 0.00005 日・平均離心率 0.00005・平均傾斜 0.0005°(表記の末位の半分) */
export const TOL = Object.freeze({ aps: 0.005, sid: 0.00005, node: 0.005, e: 0.00005, inc: 0.0005 });
export const OBS_B1 = EM.OBS_B1;
/** 第303便a の W_bg(引きずり ON の対照 —— 物理の量と読まない) */
export const WBG303 = DECL303[FIT_ID].physics.relativeDrag.Wbg;
export const findPreset = (HP, id) => HP.allPresets().find((q) => q.id === id);
const canon = (v) => { if (Array.isArray(v)) return v.map(canon); if (v && typeof v === 'object') { const o = {}; for (const k of Object.keys(v).sort()) o[k] = canon(v[k]); return o; } return v; };
export const same = (a, b) => JSON.stringify(canon(a)) === JSON.stringify(canon(b));

/* ── 宣言の規則 ── */
/** 第303便の宣言(DECL303)から、新しい宣言の physics と bodies を作る(rel = {rp, e0, inc} —— t=0 の近地点距離・接触離心率・接触傾斜〔°〕)。o.phase で起点の位相 */
export function declFrom303(rel, o = {}) {
  const d = DECL303[FIT_ID], ph = clone(d.physics), rd0 = d.physics.relativeDrag;
  ph.softening = BASE.eps; ph.softeningFloor = BASE.eps;
  ph.relativeDrag = { law: 'inertial', Wbg: null, enabled: false, eps: BASE.eps, history: rd0.history, pairs: clone(rd0.pairs) };
  let bodies = EM.relPlace(d.bodies, ph.G, rel);
  bodies = EM.baryEllipse(bodies, ph.G, { e: BASE.ePrime, phase: o.phase ?? BASE.phase });
  return { physics: ph, bodies };
}
/** 本の写し(他の欄は html から・physics と bodies は与えた宣言・fitRecord を外す)。o.Wbg で引きずり ON(同じ ε・pairs) */
export function copyOf(HP, decl, o = {}) {
  const q = clone(findPreset(HP, FIT_ID)); delete q.fitRecord;
  q.physics = clone(decl.physics); q.bodies = clone(decl.bodies);
  if (o.Wbg !== undefined) { const rd = q.physics.relativeDrag; q.physics.relativeDrag = { law: 'inertial', Wbg: o.Wbg, eps: rd.eps, history: rd.history, pairs: clone(rd.pairs) }; }
  return q;
}
export const roundRel = (r) => ({ rp: Number(r.rp.toFixed(BASE.round.rp)), e0: Number(r.e0.toFixed(BASE.round.e0)), inc: Number(r.inc.toFixed(BASE.round.inc)) });
/** 地球–月の重心の公転の要素(太陽 pinned —— μ = G M☉): 離心率・近日点距離・t=0 の太陽からの距離 */
export function baryOf(bodies, G) {
  const S = bodies[0], E = bodies[1], M = bodies[2], mt = E.m + M.m;
  const r = ['x', 'y', 'z'].map((k) => (E.m * (E[k] || 0) + M.m * (M[k] || 0)) / mt - (S[k] || 0)), v = ['vx', 'vy', 'vz'].map((k) => (E.m * (E[k] || 0) + M.m * (M[k] || 0)) / mt);
  const mu = G * S.m, rn = Math.hypot(...r), v2 = v[0] ** 2 + v[1] ** 2 + v[2] ** 2, a = 1 / (2 / rn - v2 / mu);
  const h = [r[1] * v[2] - r[2] * v[1], r[2] * v[0] - r[0] * v[2], r[0] * v[1] - r[1] * v[0]], hn = Math.hypot(...h);
  return { r: rn, a, e: Math.sqrt(Math.max(0, 1 - hn * hn / (mu * a))), rDot: (r[0] * v[0] + r[1] * v[1] + r[2] * v[2]) / rn };
}

/* ── 抽出器 M4a(診断 —— M4 に年周の項: 太陽の平均近点離角 ℓ′ の 1・2 倍と φ ± ℓ′ を足した最小二乗)── */
/** ts, ws(近点経度 unwrap), suns(太陽の黄経 unwrap), nP(重心の平均運動 [rad/本の時間]), M0(t=0 の ℓ′) */
export function harmonicRateAnnual(ts, ws, suns, nP, M0 = 0, K = 3) {
  const n = ts.length; if (n < 2 * K + 12) return null;
  const tm = ts.reduce((s, x) => s + x, 0) / n, lf = L.linfit(ts, ws); if (!lf) return null;
  let c0 = ws.reduce((s, x) => s + x, 0) / n, c1 = lf.slope, out = null;
  for (let it = 0; it < 3; it++) {
    const X = ts.map((t, i) => { const ph = 2 * (suns[i] - (c0 + c1 * (t - tm))), M = M0 + nP * t, row = [1, t - tm];
      for (let k = 1; k <= K; k++) row.push(Math.cos(k * ph), Math.sin(k * ph));
      row.push(Math.cos(M), Math.sin(M), Math.cos(2 * M), Math.sin(2 * M), Math.cos(ph + M), Math.sin(ph + M), Math.cos(ph - M), Math.sin(ph - M));
      return row; });
    out = EM.lsq(X, ws); c0 = out.c[0]; c1 = out.c[1];
  }
  return { slope: c1, rms: out.rms };
}
function m4aOf(ev, i0, N, nP, M0) {
  const t0 = i0 ? ev.rev[i0 - 1] : 0, t1 = ev.rev[i0 + N - 1];
  const P = ev.peri.filter((z) => z.t > t0 && z.t <= t1), h = harmonicRateAnnual(P.map((z) => z.t), L.unwrap(P.map((z) => z.ang)), L.unwrap(P.map((z) => z.sun)), nP, M0);
  return h ? 2 * Math.PI / h.slope / YEAR : null;
}
const stat = (v) => { v = v.filter(Number.isFinite); const m = v.reduce((s, x) => s + x, 0) / v.length; return { n: v.length, mean: m, min: Math.min(...v), max: Math.max(...v), sd: Math.sqrt(v.reduce((s, x) => s + (x - m) ** 2, 0) / v.length) }; };
const winSum = (w) => w && w.complete ? { N: w.N, i0: w.i0, T1: w.T1, T2: w.T2, T4p: w.T4p, T4s: w.T4s, rms4p: w.rms4p, sid: w.sid, sidH: w.sidH, anom: w.anom, node: w.node,
  eMean: w.eMean, incMean: w.incMean, aMean: w.aMean, nPeri: w.nPeri } : { N: w ? w.N : null, complete: false };
function engRun(HP, preset, N, dt, log, key) {
  const t0 = Date.now(), R = EM.runEngine(HP, preset, { dt, revMax: N });
  if (!R.complete || R.nan) throw new Error(`走行が窓を満たさない(${key}: stop=${R.stop}・公転 ${R.ev.rev.length}/${N})`);
  R.wallSec = (Date.now() - t0) / 1000;
  if (log) log(`${key}: ${N} 公転・dt ${dt}・${R.steps} 步・${R.wallSec.toFixed(1)} s`);
  return R;
}
const htmlDecl = (HP) => { const p = findPreset(HP, FIT_ID); return { physics: clone(p.physics), bodies: clone(p.bodies) }; };

/* ── 段 solve ── */
export async function stageSolve(HP, log) {
  const t0 = Date.now(), G = DECL303[FIT_ID].physics.G, N = BASE.long;
  const rel0 = EM.relOf(DECL303[FIT_ID].bodies, G);
  const runRef = async (rel) => EM.winOf(EM.refRun({ bodies: declFrom303(rel).bodies, revMax: N, eps: BASE.eps }).ev, 0, N);
  const Sr = await EM.solveMeanIc(runRef, [rel0.rp, rel0.e0, rel0.inc]);
  log(`solve: 参照積分 収束 ${Sr.converged}・${JSON.stringify(Sr.rel)}`);
  const runEng = async (rel) => EM.winOf(engRun(HP, copyOf(HP, declFrom303(rel)), N, DT).ev, 0, N);
  const Se = await EM.solveMeanIc(runEng, [Sr.rel.rp, Sr.rel.e0, Sr.rel.inc], { iter: 4 });
  log(`solve: エンジン 収束 ${Se.converged}・${JSON.stringify(Se.rel)}`);
  const rel = roundRel(Se.rel), want = declFrom303(rel), live = htmlDecl(HP);
  const out = { note: '第303便の宣言の写し(DECL303)の初期配置から、ε・e′・引きずり OFF の写しで長窓の平均の要素へ(参照積分 → エンジン)', target: EM.MEAN_TARGET, window: N,
    rel0, ref: { rel: Sr.rel, converged: Sr.converged, iters: Sr.hist }, engine: { rel: Se.rel, converged: Se.converged, iters: Se.hist },
    rounded: rel, declSame: same(live.physics, want.physics) && same(live.bodies, want.bodies), liveRel: EM.relOf(live.bodies, G), bary: baryOf(live.bodies, G),
    wallSec: (Date.now() - t0) / 1000 };
  return out;
}

/* ── 段 measure ── */
export async function stageMeasure(HP, log) {
  const t0 = Date.now(), N = BASE.long, decl = htmlDecl(HP), G = decl.physics.G;
  const off = copyOf(HP, decl), on = copyOf(HP, decl, { Wbg: WBG303 });
  const bary = baryOf(decl.bodies, G), nP = Math.sqrt(G * decl.bodies[0].m / Math.pow(bary.a, 3)), M0 = BASE.phase * Math.PI / 180;
  const Rh = engRun(HP, off, N, DT, log, 'off-h'), Wh = EM.windowsOf(Rh.ev, BASE.wins, BASE.slide);
  const m4aSlide = Wh.slide.rows.map((r) => m4aOf(Rh.ev, r.i0, 118, nP, M0));
  const R2 = engRun(HP, off, N, DT2, log, 'off-h2'), W2 = EM.windowsOf(R2.ev, BASE.wins, 0);
  const R4 = engRun(HP, off, 354, DT4, log, 'off-h4'), W4 = EM.windowsOf(R4.ev, [118, 354], 0);
  const Ron = engRun(HP, on, N, DT, log, 'on-h'), Won = EM.windowsOf(Ron.ev, BASE.wins, BASE.slide);
  const fz = (W) => W.fromZero.map(winSum);
  const out = { note: '本の宣言(html)の 🌦️・引きずり OFF(宣言)と ON(第303便a の W_bg —— 対照)', Wbg303: WBG303, bary, nP,
    off: { h: { fromZero: fz(Wh), slide: Wh.slide, steps: Rh.steps, wallSec: Rh.wallSec, m4a: { slide: stat(m4aSlide), rows: m4aSlide, fromZero: BASE.wins.map((n) => m4aOf(Rh.ev, 0, n, nP, M0)) } },
      h2: { fromZero: fz(W2), steps: R2.steps, wallSec: R2.wallSec }, h4: { fromZero: fz(W4), steps: R4.steps, wallSec: R4.wallSec } },
    on: { h: { fromZero: fz(Won), slide: Won.slide, steps: Ron.steps, wallSec: Ron.wallSec, drag: Ron.drag } } };
  log(`measure: OFF 長窓 M4 ${out.off.h.fromZero[3].T4p.toFixed(6)}・118 M4 ${out.off.h.fromZero[0].T4p.toFixed(6)} / ON 長窓 M4 ${out.on.h.fromZero[3].T4p.toFixed(6)}`);
  // 器の中の参照積分(アプリの物理ではない): 同じ ε(エンジンとの一致の門)と ε 0(軟化の残り)
  const ref = EM.refRun({ bodies: decl.bodies, revMax: N, eps: BASE.eps }), ref0 = EM.refRun({ bodies: decl.bodies, revMax: N, eps: 0 });
  const Wr = EM.windowsOf(ref.ev, BASE.wins, 0), Wr0 = EM.windowsOf(ref0.ev, BASE.wins, 0);
  out.ref = { eps: { fromZero: fz(Wr) }, eps0: { fromZero: fz(Wr0) } };
  const lastE = out.off.h.fromZero[3], lastR = out.ref.eps.fromZero[3];
  out.refGate = { T4p: Math.abs(lastR.T4p / lastE.T4p - 1), sidH: Math.abs(lastR.sidH / lastE.sidH - 1), node: Math.abs(lastR.node / lastE.node - 1), lim: { T4p: 1e-4, sidH: 1e-6, node: 1e-4 } };
  out.refGate.ok = out.refGate.T4p <= 1e-4 && out.refGate.sidH <= 1e-6 && out.refGate.node <= 1e-4;
  // 起点の位相 180°(遠日点から —— 平均の要素を参照積分で解き直し・長窓)
  const rel = EM.relOf(decl.bodies, G);
  const runA = async (r) => EM.winOf(EM.refRun({ bodies: declFrom303(r, { phase: 180 }).bodies, revMax: N, eps: BASE.eps }).ev, 0, N);
  const SA = await EM.solveMeanIc(runA, [rel.rp, rel.e0, rel.inc]);
  out.phase180 = { rel: SA.rel, converged: SA.converged, w: winSum(SA.w), iters: SA.hist.length };
  // 解析(実測と分けて): 軟化の近点への効き(第303便c の式 −3π(ε/a)²/(1−e²)² を近点の 1 公転あたりの回転で割った相対)
  const a = lastE.aMean, e = lastE.eMean, perOrbit = 2 * Math.PI * (lastE.anom * DAY) / (lastE.T4p * YEAR);
  const soft = (eps) => 3 * Math.PI * (eps / a) ** 2 / (1 - e * e) ** 2 / perOrbit;
  out.analytic = { a, e, apsPerOrbitRad: perOrbit, softRelNew: soft(BASE.eps), softYrNew: soft(BASE.eps) * lastE.T4p, softRelOld: soft(0.01), softYrOld: soft(0.01) * lastE.T4p,
    note: '軟化の近点への効き(解析)= 3π(ε/a)²/(1−e²)² ÷ 近点の 1 近点月あたりの回転 —— 近点の周期を伸ばす向き' };
  out.wallSec = (Date.now() - t0) / 1000;
  return out;
}

/* ── 段 record ── */
export const EXTRACTOR = Object.freeze({
  aps: 'tests/exp-w303c-earthmoon.mjs harmonicRate(w303c-emx4-1)—— M4 調和の回帰: 距離の極小の 3 点放物線・瞬間の軌道面で ϖ・ϖ の時刻への直線に φ = 2(λ☉ − ϖ̄) の 1〜3 倍の正弦・余弦',
  sid: 'tests/exp-w303c-earthmoon.mjs sidHarmonic(w303c-emx4-1)—— 黄道経度の通過の時刻を周回の番号の直線と中心差・出差・二均差・黄道への還元の正弦・余弦で回帰',
  e: 'tests/exp-w303c-earthmoon.mjs makeRec(w303c-emx4-1)—— 位置の中心差分の座標速度から作る接触離心率・64 步ごとの時間平均',
  cond: 'tests/exp-w303c-earthmoon.mjs winOf(w303c-emx4-1)・長窓 [0,1062]' });
export const WINDOW_LONG = '1062 公転の窓 [0,1062](約 79.4 年 —— 近点の約 9 周)・引きずり OFF・semic';
export const EMS_NOTE_304C = '引きずり OFF で照合許容の内(第304便c の基線の見直し —— 引きずりを無くしたのではなく、この探索範囲で引きずりで埋める差が許容の内で 0 だったことの記録)';
export function recordOf(HP, M, S) {
  const L4 = M.off.h.fromZero[3], H2 = M.off.h2.fromZero[3], rel = S.rounded;
  const tg = (q, obs, unit, source, tol, extractor, model, h2) => {
    const residual = model - obs;
    return { q, obs, unit, source, window: WINDOW_LONG, tol, extractor, model, residual, rel: residual / obs, numerics: { h2, dtHalf: DT2 } };
  };
  const targets = [
    tg('近点回転の周期(軌道面の中の近点経度 ϖ・検出器 B・M4 調和の回帰・長窓)', 8.85, 'yr', '月の近地点経度の周期 8.85 年(🌥️ と同じ観測欄 —— JPL SSD の行 SOL-59edf981 の注記が ~8.85 年の量と記す・σ なし)。B1 8.850391 年(Chapront 2002・Simon 1994 —— σ なし・unverified)との差は正本に記録',
      { value: TOL.aps, kind: 'declared', note: '照合許容の宣言 0.005 年 —— 8.85 年は表記の末位まで(σ なし)。慣性系の平均の近地点経度の率(Chapront 2002 Table 4・40.67616758°/年 → 8.85038 年)はこの幅の中' },
      EXTRACTOR.aps, L4.T4p, Math.abs(L4.T4p - H2.T4p)),
    tg('恒星月(黄道経度の周回 —— 調和の回帰・長窓)', 27.321661, 'd', '恒星月 27.321661 日(Chapront 2002)(SOL-432f643e)—— 初期配置の入力(長窓の平均の要素の目標は B1 27.321661554 日)',
      { value: TOL.sid, kind: 'declared', note: '照合許容の宣言 0.00005 日 —— 恒星月 27.321661 日(Chapront 2002)の初期配置の入力(長窓の調和の回帰に合わせた量 —— 予言ではない)' },
      EXTRACTOR.sid, L4.sidH, Math.abs(L4.sidH - H2.sidH)),
    tg('平均離心率(接触離心率の時間平均・長窓)', 0.0549, '無次元', '月の平均離心率 0.0549(NASA NSSDC —— JPL SSD は 0.0554)(SOL-47b082ec)—— 初期配置の入力',
      { value: TOL.e, kind: 'declared', note: '照合許容の宣言 0.00005 —— 平均離心率 0.0549 は表記の末位まで(JPL SSD は 0.0554・σ なし)。初期配置の入力(長窓の平均に合わせた量)' },
      EXTRACTOR.e, L4.eMean, Math.abs(L4.eMean - H2.eMean))];
  const rec = {
    version: 'w298b-1', parent: 'earthMoonSunInertialFit',
    law: '引きずり OFF(relativeDrag.enabled:false —— 第304便c の基線の見直しで埋める差が照合許容の内で 0)・重力 E4 の三体(太陽 pinned)・三次元(physics.coord:"3d")・λ_PN=0・積分器 semic',
    targets,
    knobs: [{ key: 'initial.moonPerigeeDistance', range: [3.4, 3.8], final: rel.rp }, { key: 'initial.moonOscEccentricity0', range: [0.02, 0.12], final: rel.e0 },
      { key: 'initial.moonOscInclination0', range: [4.5, 6], final: rel.inc }],
    fixed: [
      '太陽・地球と月の質量・半径・自転・地球の構造核は 🌥️(二次元)の写し・太陽 pinned・地球–月の重心の公転は離心率 e′ 0.0167086(Simon 1994 の J2000)の楕円で t=0 は近日点(長半径は円の半径のまま・面は xy = 黄道・元期の宣言なし)',
      '月の軌道傾斜は平均 5.145°(NASA NSSDC)を長窓 1062 公転の平均で満たす t=0 の接触傾斜・昇交点を t=0 の地球→月の方向に置いた(元期の宣言なし)',
      '重力と引きずりの核の軟化 ε 0.0005(= 50 km —— physics.softeningFloor 0.0005 の宣言)・geoPN=3・kFrame=0・λ_PN=0・積分器 semic・地球の自転軸は有効化しない',
      '引きずり OFF(relativeDrag:{law:"inertial", Wbg:null, enabled:false, eps:0.0005, pairs:[[1,2]]})—— 地球の構造核 dragCore {0.325, 0.0348} は宣言に残す(引きずり OFF では走りに効かない)',
      '第303便a の再フィット(W_bg 3.85583・118 公転窓の M1・軟化 0.01・e′ 0・旧 cond.sig ' + DECL303[FIT_ID].fitRecord.cond.sig + ')は履歴 —— 前後表は PHYSICS〔第304便c〕と正本 tests/out/baseline-w304c.json'],
    procedure: '第304便c: 第303便の初期配置を起点に、ε 0.0005・e′ 0.0167086(近日点から)・引きずり OFF の写しで長窓 1062 公転の平均の要素(調和の回帰の恒星月 = B1 27.321661554 日・平均離心率 0.0549・平均傾斜 5.145°)へ 3 元の Newton(参照積分 → エンジンで仕上げ)→ 近地点距離・接触離心率を 7 桁・接触傾斜を 5 桁に丸め、h / h/2 / h/4 と窓 118・354・708・1062 で測り直した(器 tests/exp-w304c-baseline.mjs)',
    dt: DT, steps: M.off.h.steps, status: 'fitted',
    notFitted: ['近点回転の周期は合わせていない —— 引きずり OFF の純ニュートンの三体の値(ノブは初期配置の 3 つだけ・予言ではなく基線の確かめ)',
      '恒星月・平均離心率・平均傾斜は初期配置の入力として長窓の平均に合わせた(法則の予言として数えない)',
      EMS_NOTE_304C, '機構(主因は太陽摂動 —— 機構の同定ではない)'],
    cond: { version: HP.FIT_COND_VERSION || 'w297b-cond-1', sig: '0000000000000000', extractor: EXTRACTOR.cond } };
  return rec;
}
export async function stageRecord(HP, J) {
  const p = findPreset(HP, FIT_ID), rec = recordOf(HP, J.measure, J.solve);
  const v0 = HP.validatePreset(clone(Object.assign(clone(p), { fitRecord: undefined })));
  const q = clone(p); q.fitRecord = rec; rec.cond.sig = HP.fitCondSig(HP.validatePreset(clone(q)).preset, rec);
  const vr = HP.validateFitRecord(clone(rec)), vp = HP.validatePreset(clone(Object.assign(clone(p), { fitRecord: rec })));
  let condState = null;
  const vLive = HP.validatePreset(clone(p));
  if (vLive.ok && vLive.preset.fitRecord) { HP.sim.build(vLive.preset); condState = HP.fitCondStateOf(HP.fitCondInputsOf(vLive.preset, HP.sim.params), vLive.preset.fitRecord).state; }
  const gates = HP.fitTargetGates ? HP.fitTargetGates(rec) : rec.targets.map((t) => ({ pass: Math.abs(t.residual) + t.numerics.h2 <= t.tol.value }));
  return { record: rec, accepted: !!vr.ok, acceptErr: vr.ok ? null : vr.err, presetOk: vp.ok && (vp.warnings || []).length === 0, presetWarnings: vp.warnings || [], baseOk: v0.ok,
    liveSame: same(p.fitRecord, rec), condState, targetGates: gates };
}

/* ── 段 emo(🌔)── */
export async function stageEmo(HP, log) {
  const t0 = Date.now(), src = findPreset(HP, FIT_ID), ctrl = findPreset(HP, EMO_ID), chk = emDeclCheck(src, ctrl);
  const ctrlOn = clone(ctrl); { const rd = ctrlOn.physics.relativeDrag; ctrlOn.physics.relativeDrag = { law: 'inertial', Wbg: WBG303, eps: rd.eps, history: rd.history, pairs: clone(rd.pairs) }; }
  const go = (key, p, dt, N, wins) => { const t = Date.now(), R = runEm3(HP, clone(p), { dt, revMax: N, ci: 0, oi: 1, com: true });
    if (!R.complete || R.nan) throw new Error(`🌔 の走行が窓を満たさない(${key})`);
    const W = emWindowsOf(R, wins, HP).map((w) => ({ N: w.N, T1: w.T1, T2: w.T2, sid: w.sid, synUniform: w.synUniform, eOsc: w.eOsc, incMean: w.incMean, nPeri: w.nPeri }));
    log(`emo: ${key} 恒星月 ${W[0].sid}・近点 ${W[0].T1} 年`); return { key, dt, steps: R.steps, com: R.com, windows: W, wallSec: (Date.now() - t) / 1000 }; };
  const h = go('ctrl-h', ctrl, DT, 354, [118, 354]), h2 = go('ctrl-h2', ctrl, DT2, 118, [118]), on = go('ctrl-on-h', ctrlOn, DT, 118, [118]);
  const sunH = (() => { const R = runEm3(HP, clone(src), { dt: DT, revMax: 118, ci: 1, oi: 2, com: false }); const w = emWindowsOf(R, [118], HP)[0]; return { sid: w.sid, synUniform: w.synUniform, T1: w.T1 }; })();
  return { note: '🌔 = 🌦️ の新しい宣言の写し(emOnlyBodies・emOnlyPhysics)—— 引きずり OFF の地球と月の二体(重力だけ)。ON は第303便a の W_bg の移送(対照)', declCheck: chk,
    runs: { h, h2, on }, sun118: sunH, sunEffect: { sid: sunH.sid - h.windows[0].sid, synUniform: sunH.synUniform - h.windows[0].synUniform },
    h2Diff: { sid: Math.abs(h.windows[0].sid - h2.windows[0].sid), synUniform: Math.abs(h.windows[0].synUniform - h2.windows[0].synUniform) }, wallSec: (Date.now() - t0) / 1000 };
}

/* ── 本体 ── */
export const PARTS_ALL = Object.freeze(['solve', 'measure', 'record', 'emo']);
export function gatesOf(J) {
  const g = {};
  if (J.solve) { g.solved = J.solve.ref.converged === true && J.solve.engine.converged === true; g.declSame = J.solve.declSame === true; }
  if (J.measure) {
    const L4 = J.measure.off.h.fromZero[3];
    g.refEngine = J.measure.refGate.ok === true;
    g.offWithinTol = Math.abs(L4.T4p - OBS_B1.aps.value) + Math.abs(L4.T4p - J.measure.off.h2.fromZero[3].T4p) <= TOL.aps;
    g.numericsH4 = Math.abs(J.measure.off.h4.fromZero[1].T4p - J.measure.off.h2.fromZero[1].T4p) <= Math.abs(J.measure.off.h.fromZero[1].T4p - J.measure.off.h2.fromZero[1].T4p) + 1e-6;
  }
  if (J.record) { g.recordAccepted = J.record.accepted === true && J.record.presetOk === true; g.recordFitted = J.record.record.status === 'fitted' && J.record.targetGates.every((t) => t.pass);
    g.recordLive = J.record.liveSame === true && J.record.condState === 'match'; }
  if (J.emo) g.emoDecl = J.emo.declCheck.ok === true;
  return g;
}
export async function main() {
  const OUT = process.env.W304C_OUT || path.join(ROOT, 'tests', 'out', 'baseline-w304c.json');
  const PARTS = String(process.env.W304C_PARTS || PARTS_ALL.join(',')).split(',').filter((x) => PARTS_ALL.includes(x));
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const t0 = Date.now();
  const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
  const prev = (PARTS.length < PARTS_ALL.length && fs.existsSync(OUT)) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : {};
  const log = (s) => console.log('  ' + s);
  const J = { meta: null, version: HARNESS_VERSION, preVersion: PRE_VERSION, base: BASE, tol: TOL, obs: OBS_B1, Wbg303: WBG303,
    decl303: { sig: DECL303[FIT_ID].fitRecord.cond.sig, Wbg: WBG303, softening: DECL303[FIT_ID].physics.softening } };
  const stages = { solve: () => stageSolve(HP, log), measure: () => stageMeasure(HP, log), record: () => stageRecord(HP, J), emo: () => stageEmo(HP, log) };
  J.partsRun = [];
  for (const k of PARTS_ALL) {
    if (PARTS.includes(k)) { console.log(`段 ${k}`); J[k] = await stages[k](); J.partsRun.push(k); }
    else if (prev[k]) J[k] = prev[k];
  }
  J.gates = gatesOf(J);
  J.ok = Object.values(J.gates).every(Boolean) && PARTS_ALL.every((k) => !!J[k]);
  J.notClaim = ['「月を再現した」', '「引きずりが無いことを示した」', '「現実を再現した」'];   // 書かない語(引用 —— 本文には書かない)
  const CODE = ['tests/exp-w304c-baseline.mjs', 'tests/lib-w304c-pre.mjs', 'tests/exp-w303c-earthmoon.mjs', 'tests/exp-w300b-emonly.mjs', 'tests/lib-w297b-fit.mjs', 'tests/lib-w296b-fit.mjs',
    'tests/lib-w292c-dragcore.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  J.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第304便c', target: TARGET, code: CODE, inputs: [TARGET, DECL303_DATA_FILE] }), {
    harnessVersion: HARNESS_VERSION, loadErrors: errors.length,
    ruling: '原仮定者の裁定(第94報)—— 決断事項 AN316 ①〜④ の提案に同意', reading: '統括の検証項目 R197(🌦️🌔 の基線の見直しと「引きずり OFF で許容の内」の記録)' });
  J.elapsedS = (Date.now() - t0) / 1000;
  Object.assign(J.meta, W281A_SCOPE, w281aStableInputs(ROOT, J.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(J, null, 1) + '\n');
  console.log(`門: ${JSON.stringify(J.gates)} → ${path.relative(ROOT, OUT)}(${J.elapsedS.toFixed(0)} s)`);
}
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) await main();

/* ── 表の行(PHYSICS〔第304便c〕—— QA docs.emBaseline304 が正本から作り直して逐語で照合する)── */
const F = L.fx, EX = L.ex, sg = (x, d) => (x >= 0 ? '+' : '') + F(x, d);
/** 表 1: 窓と抽出器(本の宣言・引きずり OFF —— h・h/2・M4a・ON) */
export function windowRows(J) {
  const M = J.measure, off = M.off.h.fromZero, h2 = M.off.h2.fromZero, on = M.on.h.fromZero, a4 = M.off.h.m4a.fromZero;
  const rows = off.map((w, i) => `| [0, ${w.N}] | ${F(w.T1, 5)} | ${F(w.T4p, 5)} | ${F(h2[i].T4p, 5)} | ${F(a4[i], 5)} | ${F(on[i].T4p, 5)} | ${F(w.sidH, 7)} | ${F(w.node, 4)} | ${F(w.eMean, 6)} | ${F(w.incMean, 4)} |`);
  const s = M.off.h.slide, a = M.off.h.m4a.slide, so = M.on.h.slide, mm = (z, d) => `${F(z.min, d)}〜${F(z.max, d)}(sd ${EX(z.sd, 1)})`;
  rows.push(`| 118 公転窓 ×${s.n}(${s.every} 公転ずつ) | ${mm(s.T1, 4)} | ${mm(s.T4p, 4)} | — | ${mm(a, 4)} | ${mm(so.T4p, 4)} | ${mm(s.sidH, 6)} | ${mm(s.node, 4)} | — | — |`);
  return rows;
}
/** 表 2: B1 との差と照合許容(引きずり OFF の長窓 M4 を中心に) */
export function diffRows(J) {
  const M = J.measure, B = J.obs, T = J.tol, L4 = M.off.h.fromZero[3], H2 = M.off.h2.fromZero[3], W1 = M.off.h.fromZero[0];
  const R = M.ref.eps.fromZero[3], R0 = M.ref.eps0.fromZero[3], A = M.phase180.w, ON = M.on.h.fromZero[3];
  const row = (label, d, tol, dd = 5) => `| ${label} | ${sg(d, dd)} | ${tol ? F(Math.abs(d) / tol, 3) : '—'} |`;
  return [
    row(`長窓 [0,1062] の M4(引きずり OFF ${F(L4.T4p, 5)})− B1 ${F(B.aps.value, 6)} [年]`, L4.T4p - B.aps.value, T.aps),
    row('同じ窓の h − h/2 [年]', L4.T4p - H2.T4p, T.aps),
    row(`[0,118] の M4(${F(W1.T4p, 5)})− B1 [年]`, W1.T4p - B.aps.value, T.aps),
    row(`引きずり ON(第303便a の W_bg ${J.Wbg303})の長窓 M4(${F(ON.T4p, 5)})− B1 [年]`, ON.T4p - B.aps.value, T.aps),
    row('軟化の残り: 参照積分の ε 0.0005 − ε 0(同じ初期配置・長窓)[年]', R.T4p - R0.T4p, T.aps),
    row('起点の位相: 遠日点から(平均の要素を解き直し・参照積分)− 近日点から(参照積分)[年]', A.T4p - R.T4p, T.aps),
    row(`恒星月(調和・長窓 ${F(L4.sidH, 7)})− B1 ${F(B.sid.value, 9)} [日]`, L4.sidH - B.sid.value, T.sid, 7),
    row(`交点の周期(長窓 ${F(L4.node, 4)})− B1 ${F(B.node.value, 6)} [年]`, L4.node - B.node.value, T.node),
    row(`近点月(長窓 ${F(L4.anom, 7)})− B1 ${F(B.anom.value, 9)} [日]`, L4.anom - B.anom.value, null, 7)];
}
/** 表 3: 初期配置の解き直し(第303便の宣言 → 参照積分 → エンジン → 丸め) */
export function solveRows(J) {
  const S = J.solve, r = (label, x, w) => `| ${label} | ${F(x.rp, 7)} | ${F(x.e0, 7)} | ${F(x.inc, 5)} | ${w ? F(w.sidH, 7) : '—'} | ${w ? F(w.eMean, 6) : '—'} | ${w ? F(w.incMean, 4) : '—'} |`;
  const lastRef = S.ref.iters[S.ref.iters.length - 1], lastEng = S.engine.iters[S.engine.iters.length - 1], live = J.measure.off.h.fromZero[3];
  return [r('第303便の宣言(起点)', S.rel0, null), r(`参照積分(長窓・収束 ${S.ref.converged})`, S.ref.rel, lastRef ? { sidH: lastRef.sidH, eMean: lastRef.eMean, incMean: lastRef.incMean } : null),
    r(`エンジン(長窓・収束 ${S.engine.converged})`, S.engine.rel, lastEng ? { sidH: lastEng.sidH, eMean: lastEng.eMean, incMean: lastEng.incMean } : null),
    r('丸め(本の宣言 —— エンジンの長窓で測り直し)', S.rounded, live)];
}
/** 表 4: 🌔(🌦️ の新しい宣言の写し —— 引きずり OFF の二体) */
export function emoRows(J) {
  const E = J.emo, h = E.runs.h.windows, h2 = E.runs.h2.windows[0], on = E.runs.on.windows[0];
  const r = (label, w) => `| ${label} | ${F(w.sid, 6)} | ${F(w.synUniform, 6)} | ${EX(w.T1, 3)} | ${F(w.eOsc, 6)} | ${F(w.incMean, 4)} |`;
  return [r('[0, 118](h)', h[0]), r('[0, 354](h)', h[1]), r('[0, 118](h/2)', h2), r(`[0, 118] 引きずり ON(移送 W_bg ${J.Wbg303} —— 対照)`, on),
    `| 🌦️(太陽あり・同じ抽出器・[0, 118])との差 | ${sg(E.sunEffect.sid, 6)} | ${sg(E.sunEffect.synUniform, 6)} | — | — | — |`];
}
