// 第306便c(DECISIONS v64 AN337 ③④⑤・v65 §0 AN337・AN335 ①・統括の検証項目 R206)——
// **🌦️ の J₂ ありの初期配置の解き直しの器**(Node だけ —— 対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、アプリの三次元の步
// 〔HP.coord3d.makeSim の step〕を走らせる。走行は 1 プロセスで順に —— 1062 公転の走行は同時 1 本)。
// 第305便c は 🌦️🌔 の宣言に地球の J₂(bodies[1].j2 —— J₂ 1.08263×10⁻³・赤道半径 0.06378137・固定の軸 23.4392911°/方位 90°)を足したが、
// 初期配置(t=0 の近地点距離・接触離心率・接触傾斜)は J₂ なしで解いたまま(長窓 M4 の恒星月 27.3216363 日 = B1 から −2.5×10⁻⁵ 日・平均傾斜 5.1472°)だった。
// この器は第304便c の解き直しの手順(長窓 1062 公転の平均の要素への 3 元 Newton —— 器の中の参照積分 → エンジン)を **J₂ ありの参照積分** で行い、
// 恒星月 = B1 27.321661554 日・平均離心率 0.0549・平均傾斜 5.145° へ戻す。**J₂ の値は動かさない**(交点に合わせて J₂ を動かさない —— AN337)。
//
// ■ 段(正本 tests/out/emresolve-w306c.json —— 段 emresolve-306c)。W306C_PARTS=solve,measure,phase,attrib,ledger,emo,record(既定は全部)で段を分けて走らせられる
//   (分けたときは既存の出力 JSON の他の段を残して上書き —— 鎖は全段で走らせる)。W306C_OUT で出力先を変える(試走は正本を書かない)。W306C_LONG で長窓の公転数(試走だけ)。
//   solve   第305便の宣言の写し(tests/lib-w306c-pre.mjs の DECL305)の初期配置から、同じ規則(第304便c の declFrom303 + 地球の J₂)で長窓の平均の要素の 3 元 Newton
//           (器の中の参照積分〔J₂ あり〕で Jacobian と解 → エンジン〔アプリの步〕の長窓で同じ Jacobian の Newton で仕上げ)→ 丸め(近地点距離 7 桁・接触離心率 7 桁・
//           接触傾斜 5 桁)→ 本の宣言と同じかの門(採用した世代)・第305便の宣言が規則の写しかの門。
//   measure 解き直しの前(第305便の宣言)と後(丸めた初期配置)の長窓 M4 の 4 量(近地点の周期・交点の周期・恒星月・平均傾斜)と平均離心率・近点月を
//           J₂ あり/なし(h)・後の J₂ あり(h/2・軸の方位 0°)で測る。器の中の参照積分(同じ ε・ε 0)との一致。採否の門(fitRecord の全標的が照合許容の内・
//           交点が許容の外へ出ない・恒星月と平均傾斜が B1/5.145° へ近づく)。
//   phase   起点の位相(地球–月の重心の公転の t=0 —— 近日点 0°/遠日点 180°)× J₂ あり/なしで、平均の要素を参照積分で解き直した 4 例の 4 量(元期の宣言が無い分の幅)。
//   attrib  交点の残り(後の宣言の長窓 − B1 18.599525 年)の目録(第303便c の型 —— 新しい物理を足さない・同じ初期配置の差): 軟化・J₂ の値の幅・軸の方位・
//           惑星 4 つ(規定運動)・潮汐の保存項・太陽の平均運動(年の長さ)・窓と抽出器(調和の回帰 —— 診断)・起点の位相。
//   ledger  J₂ × 引きずり ON の仕事の帳簿(診断 —— 定義と数だけ。補正値を力やエネルギーへ足さない): 本の対照(abBody の W_bg 3.85583)の写しで、
//           引きずりの位置の移送 x += u h に伴う J₂ の位置エネルギーの変化(W_J₂ = −h Σ m a_J₂(x₀)·u と移送の前後の ΔU_J₂)と、軸が動く場合の図形の仕事
//           W_fig(🌦️ は固定軸 → 0 —— 規定の歳差の試験で 0 でない場合を数える)。読み口 inertialDragLedgerOf の R_E との閉じ方。
//   emo     🌔 = 後の 🌦️ の宣言の写しの規則(emOnlyBodies・emOnlyPhysics)—— declCheck・118 公転窓(h・h/2)。
//   record  後の宣言の fitRecord(標的 4: 近点の周期 M4・恒星月・平均離心率・交点の周期 —— 長窓)を測った数から作り、受理・条件の署名・本の宣言の記録と同じか(採用した世代)。
//
// ■ しないこと・言わないこと
//   ・引きずりの式・受理器・J₂ のフックは変えない(🌦️🌔 は引きずり OFF のまま)。J₂ の値と軸は動かさない。閾値を作り替えない。
//   ・帳簿の補正値(W_J₂・W_fig)を力やエネルギーへ足さない(定義と数だけ)。
//   ・届かない量は「この探索範囲では未達 —— 次の見直し」と書く。「月を再現した」「交点を再現した」「現実を再現した」とは書かない。
//
// 実行(Node だけ):
//   node tests/exp-w306c-emresolve.mjs                         → 正本 tests/out/emresolve-w306c.json
//   W306C_PARTS=attrib node tests/exp-w306c-emresolve.mjs      → 段 attrib だけ(他の段は既存の出力から残す)
//   W306C_OUT=<json> で試走(正本を書かない)。走行は決定的(同じ html・同じ Node で同じ数 —— 壁時計の欄は volatilePaths)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as L from './lib-w297b-fit.mjs';
import * as EM from './exp-w303c-earthmoon.mjs';
import { declFrom303, BASE as BASE304, baryOf } from './exp-w304c-baseline.mjs';
import { EARTH_J2, EARTH_J2_SOURCE, twoBodyOf } from './exp-w305c-j2.mjs';
import { emOnlyBodies, emOnlyPhysics, declCheck as emDeclCheck, runEm3, windowsOf as emWindowsOf } from './exp-w300b-emonly.mjs';
import { DECL305, DECL305_DATA_FILE, LIB_VERSION as PRE_VERSION } from './lib-w306c-pre.mjs';
const REGEN_SCOPE = {"presets":["earthMoonOnly3d","earthMoonSunInertial3d","earthMoonSunInertialFit","mercurySunInertial3d","plutoCharonInertialFit"],"roots":["$","DT","FIT_COND_KEYS","FIT_COND_VERSION","FIT_KNOB_KEYS","FIT_NUMERICS_KEYS","FIT_RECORD_KEYS","FIT_RECORD_VERSION","FIT_RECORD_VERSIONS","FIT_RESIDUAL_KEYS","FIT_TARGET_KEYS","FIT_TOL_KEYS","HP.FIT_COND_VERSION","HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.fitCondInputsOf","HP.fitCondSig","HP.fitCondStateOf","HP.fitTargetGates","HP.inertialDragLedgerOf","HP.inertialDragSemicWork","HP.inertialDragState","HP.j2SecularRates","HP.j2State","HP.sim","HP.synodic","HP.validateFitRecord","HP.validatePreset","T","ctx","cw","dfmGaussLegendre01","dfmInertialDragStep","dragCoreAngular","dragCoreAvgK","dragCoreLookup","dragCoreTableBuild","inertialDragEnergy","inertialDragLedgerOf","inertialDragNormApply","inertialDragSemicPre","inertialDragSemicWork","j2Energy","j2Kick3","j2Prepare","pnSource","relDragCoefficientOf","synUniform","validateFitRecord","validateJ2Body"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w306c-emresolve-1';
const clone = (x) => JSON.parse(JSON.stringify(x));
const TARGET = process.env.QA_TARGET || 'beta/index.html';
export const FIT_ID = EM.FIT_ID, EMO_ID = EM.EMO_ID;
export const DT = 0.016, DT2 = 0.008;
export const YEAR = EM.YEAR, DAY = EM.DAY;
export const LONG = Math.max(118, Number(process.env.W306C_LONG) || 1062);
export const WINS = Object.freeze([118, 354, 708, 1062].filter((n) => n <= LONG).concat(LONG > 1062 || ![118, 354, 708, 1062].includes(LONG) ? [LONG] : []));
export const SLIDE = 12;
/** 照合許容(第304便c と同じ宣言 —— 出典に σ が無い)。近点・交点 0.005 年・恒星月 0.00005 日・平均離心率 0.00005・平均傾斜 0.0005° */
export const TOL = Object.freeze({ aps: 0.005, sid: 0.00005, node: 0.005, e: 0.00005, inc: 0.0005 });
export const OBS_B1 = EM.OBS_B1;
export const TARGET_MEAN = EM.MEAN_TARGET;   // 恒星月 B1 27.321661554 日・平均離心率 0.0549・平均傾斜 5.145°
/** 器の中の参照積分の J₂ の項(本の宣言と同じ値と軸 —— EM.refRun の極は黄経 90° 側 = 方位 90°) */
export const REF_J2 = Object.freeze({ J2: EARTH_J2.J2, R: EARTH_J2.req, obliquityDeg: EARTH_J2.axis.tiltDeg });
/** J₂ の値の幅の比べる相手(IERS Conventions 2010 —— J₂ 1.0826359×10⁻³・赤道半径 6378136.6 m: 第303便c の参照積分の J2_EARTH と同じ) */
export const J2_ALT = Object.freeze({ J2: EM.J2_EARTH.J2, req: EM.J2_EARTH.R, source: 'IERS Conventions 2010(J₂ 1.0826359×10⁻³・赤道半径 6378136.6 m)' });
/** 恒星年(観測の記録 SOL-b851fd96 —— IERS の useful constants・Simon 1994 の地球–月の重心の平均経度の率)[日] */
export const SIDEREAL_YEAR_D = 365.256363004;
export const findPreset = (HP, id) => HP.allPresets().find((q) => q.id === id);
const canon = (v) => { if (Array.isArray(v)) return v.map(canon); if (v && typeof v === 'object') { const o = {}; for (const k of Object.keys(v).sort()) o[k] = canon(v[k]); return o; } return v; };
export const same = (a, b) => JSON.stringify(canon(a)) === JSON.stringify(canon(b));
const last = (a) => a[a.length - 1];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

/* ── 宣言の規則 ── */
/** 第306便c の宣言の規則: 第304便c の規則(declFrom303 —— ε 0.0005・e′ 0.0167086・引きずり OFF・重心の楕円)で置いた bodies の地球に EARTH_J2 を足す。
 *  rel = {rp, e0, inc}(t=0 の近地点距離・接触離心率・接触傾斜〔°〕)。o.phase で起点の位相・o.j2 = false で J₂ なし */
export function decl306(rel, o = {}) {
  const d = declFrom303(rel, { phase: o.phase ?? 0 });
  if (o.j2 !== false) d.bodies[1].j2 = clone(EARTH_J2);
  return d;
}
export const roundRel = (r) => ({ rp: Number(r.rp.toFixed(BASE304.round.rp)), e0: Number(r.e0.toFixed(BASE304.round.e0)), inc: Number(r.inc.toFixed(BASE304.round.inc)) });
/** 本の写し(他の欄は html から・physics と bodies は与えた宣言・fitRecord を外す)。o.Wbg で引きずり ON(本の abBody の形)・o.j2 で地球の J₂ の差し替え(null で外す) */
export function copyOf(HP, decl, o = {}) {
  const q = clone(findPreset(HP, FIT_ID)); delete q.fitRecord;
  q.physics = clone(decl.physics); q.bodies = clone(decl.bodies);
  if (o.dragPatch) q.physics = Object.assign(q.physics, clone(o.dragPatch));
  if (o.j2 !== undefined) { if (o.j2 === null) delete q.bodies[1].j2; else q.bodies[1].j2 = clone(o.j2); }
  return q;
}
const htmlDecl = (HP) => { const p = findPreset(HP, FIT_ID); return { physics: clone(p.physics), bodies: clone(p.bodies) }; };
const decl305 = () => ({ physics: clone(DECL305[FIT_ID].physics), bodies: clone(DECL305[FIT_ID].bodies) });
const noJ2 = (d) => { const z = clone(d); delete z.bodies[1].j2; return z; };

/* ── 走行 ── */
const winSum = (w) => w && w.complete ? { N: w.N, T1: w.T1, T4p: w.T4p, sidH: w.sidH, anom: w.anom, node: w.node, eMean: w.eMean, incMean: w.incMean, aMean: w.aMean, nPeri: w.nPeri,
  nodeH: w.nodeH ?? null } : { N: w ? w.N : null, complete: false };
function engRun(HP, preset, N, dt, log, key) {
  const t0 = Date.now(), R = EM.runEngine(HP, preset, { dt, revMax: N });
  if (!R.complete || R.nan) throw new Error(`走行が窓を満たさない(${key}: stop=${R.stop}・公転 ${R.ev.rev.length}/${N})`);
  R.wallSec = (Date.now() - t0) / 1000;
  if (log) log(`${key}: ${N} 公転・dt ${dt}・${R.steps} 步・${R.wallSec.toFixed(1)} s`);
  return R;
}
const refOf = (bodies, o = {}) => EM.refRun(Object.assign({ bodies, revMax: o.N || LONG, eps: o.eps ?? BASE304.eps }, o.j2 === false ? {} : { J2: o.J2 || REF_J2 },
  o.planets ? { planets: EM.PLANETS } : {}, o.tide ? { tide: EM.TIDE_EM } : {}));
/** 交点の調和の回帰(診断の抽出器 —— 第303便c の M4 の型を交点へ): Ω(t) = c₀ + c₁ t + Σ_{k=1..2}[a_k cos kφ + b_k sin kφ] + 年周(ℓ′ の 1 倍)・φ = 2(λ☉ − Ω̄(t))
 *  (Ω̄ は前の反復の直線 —— 3 回)。返す後退の周期 [年]。ts・Om(unwrap)・suns(unwrap)・nP(重心の平均運動)・M0(t=0 の ℓ′) */
export function nodeHarmonic(ts, Om, suns, nP, M0 = 0, K = 2) {
  const n = ts.length; if (n < 2 * K + 12) return null;
  const tm = ts.reduce((s, x) => s + x, 0) / n, lf = L.linfit(ts, Om); if (!lf) return null;
  let c0 = Om.reduce((s, x) => s + x, 0) / n, c1 = lf.slope, out = null;
  for (let it = 0; it < 3; it++) {
    const X = ts.map((t, i) => { const ph = 2 * (suns[i] - (c0 + c1 * (t - tm))), M = M0 + nP * t, row = [1, t - tm];
      for (let k = 1; k <= K; k++) row.push(Math.cos(k * ph), Math.sin(k * ph));
      row.push(Math.cos(M), Math.sin(M));
      return row; });
    out = EM.lsq(X, Om); c0 = out.c[0]; c1 = out.c[1];
  }
  return { period: -2 * Math.PI / c1 / YEAR, rms: out.rms * 180 / Math.PI, amp1: Math.hypot(out.c[2], out.c[3]) * 180 / Math.PI };
}
/** 走行の窓の束(t=0 からの窓・118 公転窓のずらし)と長窓の交点の調和の回帰 */
function windowsWithNode(ev, slide, nP, M0) {
  const W = EM.windowsOf(ev, WINS, slide), fz = W.fromZero.map(winSum);
  for (const w of fz) {
    if (w.complete === false) continue;
    const t1 = ev.rev[w.N - 1], E = ev.samp.filter((z) => z[0] > 0 && z[0] <= t1);
    const h = nodeHarmonic(E.map((z) => z[0]), L.unwrap(E.map((z) => z[5])), L.unwrap(E.map((z) => z[6])), nP, M0);
    w.nodeH = h ? h.period : null; w.nodeHrms = h ? h.rms : null; w.nodeHamp = h ? h.amp1 : null;
  }
  return { fromZero: fz, slide: W.slide ? { every: W.slide.every, n: W.slide.n, node: W.slide.node, T4p: W.slide.T4p, sidH: W.slide.sidH } : null };
}
const nPOf = (decl) => { const b = baryOf(decl.bodies, decl.physics.G); return Math.sqrt(decl.physics.G * decl.bodies[0].m / Math.pow(b.a, 3)); };

/* ── 平均の要素の Newton(Jacobian を返す —— 参照積分の Jacobian をエンジンの Newton に使う)── */
const conv = (F) => Math.abs(F[0]) < 2e-6 && Math.abs(F[1]) < 2e-6 && Math.abs(F[2]) < 2e-4;
export async function newtonJ(run, x0, o = {}) {
  const tg = TARGET_MEAN, hist = [], it0 = o.iter || 6;
  let x = x0.slice(), J = o.J0 ? o.J0.map((r) => r.slice()) : null;
  for (let it = 0; it <= it0; it++) {
    const w0 = await run({ rp: x[0], e0: x[1], inc: x[2] });
    const F = [w0.sidH - tg.sid, w0.eMean - tg.e, w0.incMean - tg.inc];
    hist.push({ it, rp: x[0], e0: x[1], inc0: x[2], sidH: w0.sidH, eMean: w0.eMean, incMean: w0.incMean, T4p: w0.T4p, T1: w0.T1, node: w0.node });
    if (conv(F)) return { rel: { rp: x[0], e0: x[1], inc: x[2] }, w: w0, hist, converged: true, J, runs: hist.length + (o.J0 ? 0 : 3) };
    if (it === it0) break;
    if (!J) {
      const dr = 0.001, de = 0.001, di = 0.02;
      const [wa, wb, wc] = [await run({ rp: x[0] + dr, e0: x[1], inc: x[2] }), await run({ rp: x[0], e0: x[1] + de, inc: x[2] }), await run({ rp: x[0], e0: x[1], inc: x[2] + di })];
      const col = (w, h) => [(w.sidH - w0.sidH) / h, (w.eMean - w0.eMean) / h, (w.incMean - w0.incMean) / h];
      const ca = col(wa, dr), cb = col(wb, de), cc = col(wc, di);
      J = [[ca[0], cb[0], cc[0]], [ca[1], cb[1], cc[1]], [ca[2], cb[2], cc[2]]];
    }
    const dx = EM.solve3(J, F);
    x = [x[0] - dx[0], x[1] - dx[1], x[2] - dx[2]];
  }
  const w = last(hist);
  return { rel: { rp: w.rp, e0: w.e0, inc: w.inc0 }, w: null, hist, converged: false, J, runs: hist.length + (o.J0 ? 0 : 3) };
}

/* ── 段 solve ── */
export async function stageSolve(HP, log) {
  const t0 = Date.now(), d5 = decl305(), G = d5.physics.G, N = LONG;
  const rel0 = EM.relOf(d5.bodies, G), rule305 = decl306(roundRel(rel0));
  const rule305Same = same(rule305.physics, d5.physics) && same(rule305.bodies, d5.bodies);
  const runRef = async (rel) => EM.winOf(refOf(decl306(rel).bodies).ev, 0, N);
  const Sr = await newtonJ(runRef, [rel0.rp, rel0.e0, rel0.inc]);
  log(`solve: 参照積分 収束 ${Sr.converged}・${JSON.stringify(Sr.rel)}(${Sr.runs} 走行)`);
  const runEng = async (rel) => EM.winOf(engRun(HP, copyOf(HP, decl306(rel)), N, DT, log, 'solve-eng').ev, 0, N);
  const Se = await newtonJ(runEng, [Sr.rel.rp, Sr.rel.e0, Sr.rel.inc], { J0: Sr.J, iter: 4 });
  log(`solve: エンジン 収束 ${Se.converged}・${JSON.stringify(Se.rel)}(${Se.runs} 走行)`);
  const rel = roundRel(Se.rel), want = decl306(rel), live = htmlDecl(HP);
  return { note: '第305便の宣言の写し(DECL305)の初期配置から、同じ規則(第304便c の declFrom303 + 地球の J₂)で長窓の平均の要素へ(参照積分〔J₂ あり〕→ エンジン —— 参照積分の Jacobian)',
    target: TARGET_MEAN, window: N, refJ2: REF_J2, rel0, rule305Same,
    ref: { rel: Sr.rel, converged: Sr.converged, iters: Sr.hist, runs: Sr.runs, J: Sr.J }, engine: { rel: Se.rel, converged: Se.converged, iters: Se.hist, runs: Se.runs },
    rounded: rel, declSame: same(live.physics, want.physics) && same(live.bodies, want.bodies), live305: same(live.physics, d5.physics) && same(live.bodies, d5.bodies),
    liveRel: EM.relOf(live.bodies, G), wallSec: (Date.now() - t0) / 1000 };
}

/* ── 段 measure ── */
export async function stageMeasure(HP, log, J) {
  const t0 = Date.now(), N = LONG, before = decl305(), after = decl306(J.solve.rounded), nP = nPOf(after);
  const B = (R, slide) => windowsWithNode(R.ev, slide, nP, 0);
  const runs = {};
  const go = (key, decl, dt, slide = 0, o = {}) => { const R = engRun(HP, copyOf(HP, decl, o), N, dt, log, key); runs[key] = Object.assign(B(R, slide), { steps: R.steps, wallSec: R.wallSec }); return R; };
  go('beforeOn', before, DT); go('beforeOff', noJ2(before), DT);
  const Ra = go('afterOn', after, DT, SLIDE); go('afterOn2', after, DT2); go('afterOff', noJ2(after), DT);
  go('afterAz0', after, DT, 0, { j2: Object.assign(clone(EARTH_J2), { axis: { tiltDeg: EARTH_J2.axis.tiltDeg, azimuthDeg: 0 } }) });
  // 器の中の参照積分(アプリの物理ではない —— 同じ ε と ε 0・J₂ あり)
  const ref = refOf(after.bodies), ref0 = refOf(after.bodies, { eps: 0 });
  runs.ref = B(ref, 0); runs.ref0 = B(ref0, 0);
  const L4 = (k) => last(runs[k].fromZero);
  const g = { T4p: Math.abs(L4('ref').T4p / L4('afterOn').T4p - 1), sidH: Math.abs(L4('ref').sidH / L4('afterOn').sidH - 1), node: Math.abs(L4('ref').node / L4('afterOn').node - 1),
    lim: { T4p: 1e-4, sidH: 1e-6, node: 1e-4 } };
  g.ok = g.T4p <= g.lim.T4p && g.sidH <= g.lim.sidH && g.node <= g.lim.node;
  // 4 量の前後(B1 との差と照合許容の倍)
  const q = (k) => { const w = L4(k); return { T4p: w.T4p, node: w.node, sidH: w.sidH, incMean: w.incMean, eMean: w.eMean, anom: w.anom, nodeH: w.nodeH }; };
  const diffs = (w, w2) => ({ aps: { res: w.T4p - OBS_B1.aps.value, ratio: Math.abs(w.T4p - OBS_B1.aps.value) / TOL.aps, h2: w2 ? Math.abs(w.T4p - w2.T4p) : null },
    node: { res: w.node - OBS_B1.node.value, ratio: Math.abs(w.node - OBS_B1.node.value) / TOL.node, h2: w2 ? Math.abs(w.node - w2.node) : null },
    sid: { res: w.sidH - OBS_B1.sid.value, ratio: Math.abs(w.sidH - OBS_B1.sid.value) / TOL.sid, h2: w2 ? Math.abs(w.sidH - w2.sidH) : null },
    inc: { res: w.incMean - TARGET_MEAN.inc, ratio: Math.abs(w.incMean - TARGET_MEAN.inc) / TOL.inc },
    e: { res: w.eMean - TARGET_MEAN.e, ratio: Math.abs(w.eMean - TARGET_MEAN.e) / TOL.e, h2: w2 ? Math.abs(w.eMean - w2.eMean) : null } });
  const table = { before: { on: q('beforeOn'), off: q('beforeOff') }, after: { on: q('afterOn'), off: q('afterOff'), on2: q('afterOn2'), az0: q('afterAz0') },
    diffBefore: diffs(L4('beforeOn'), null), diffAfter: diffs(L4('afterOn'), L4('afterOn2')),
    j2Effect: { before: { T4p: L4('beforeOn').T4p - L4('beforeOff').T4p, node: L4('beforeOn').node - L4('beforeOff').node, sidH: L4('beforeOn').sidH - L4('beforeOff').sidH, incMean: L4('beforeOn').incMean - L4('beforeOff').incMean },
      after: { T4p: L4('afterOn').T4p - L4('afterOff').T4p, node: L4('afterOn').node - L4('afterOff').node, sidH: L4('afterOn').sidH - L4('afterOff').sidH, incMean: L4('afterOn').incMean - L4('afterOff').incMean } } };
  // 採否の門(fitRecord の標的は第305便の宣言と同じ 4 つ —— obs は宣言の値・許容は宣言の値)
  const tgts = DECL305[FIT_ID].fitRecord.targets, a = L4('afterOn'), a2 = L4('afterOn2');
  const modelOf = [a.T4p, a.sidH, a.eMean, a.node], h2Of = [Math.abs(a.T4p - a2.T4p), Math.abs(a.sidH - a2.sidH), Math.abs(a.eMean - a2.eMean), Math.abs(a.node - a2.node)];
  const fitGates = tgts.map((t, i) => ({ q: t.q, obs: t.obs, model: modelOf[i], residual: modelOf[i] - t.obs, h2: h2Of[i], tol: t.tol.value, pass: Math.abs(modelOf[i] - t.obs) + h2Of[i] <= t.tol.value }));
  const bf = L4('beforeOn');
  const gate = { fitAll: fitGates.every((z) => z.pass), nodeWithin: Math.abs(a.node - OBS_B1.node.value) + h2Of[3] <= TOL.node,
    sidCloser: Math.abs(a.sidH - OBS_B1.sid.value) < Math.abs(bf.sidH - OBS_B1.sid.value), incCloser: Math.abs(a.incMean - TARGET_MEAN.inc) < Math.abs(bf.incMean - TARGET_MEAN.inc), fitGates };
  gate.pass = gate.fitAll && gate.nodeWithin && gate.sidCloser && gate.incCloser;
  log(`measure: 前 恒星月 ${bf.sidH.toFixed(7)}・傾斜 ${bf.incMean.toFixed(4)}・交点 ${bf.node.toFixed(5)} → 後 ${a.sidH.toFixed(7)}・${a.incMean.toFixed(4)}・${a.node.toFixed(5)}・M4 ${a.T4p.toFixed(6)}・門 ${gate.pass}`);
  void Ra;
  return { note: '解き直しの前(第305便の宣言 —— 初期配置は J₂ なしで解いたまま)と後(J₂ ありの参照積分 → エンジンで解き直した丸め)の長窓 [0,' + N + '] の 4 量(M4・交点・恒星月〔調和〕・平均傾斜)',
    runs, refGate: g, table, gate, wallSec: (Date.now() - t0) / 1000 };
}

/* ── 段 phase(起点の位相 × J₂ あり/なし —— 参照積分で平均の要素を解き直し)── */
export async function stagePhase(HP, log, J) {
  const t0 = Date.now(), N = LONG, r0 = J.solve.ref.rel, rows = [];
  for (const [key, ph, j2] of [['on0', 0, true], ['on180', 180, true], ['off0', 0, false], ['off180', 180, false]]) {
    const run = async (rel) => EM.winOf(refOf(decl306(rel, { phase: ph, j2 }).bodies, { j2 }).ev, 0, N);
    const S = (key === 'on0') ? { rel: J.solve.ref.rel, converged: J.solve.ref.converged, w: null, runs: 0 } : await newtonJ(run, [r0.rp, r0.e0, r0.inc], { J0: J.solve.ref.J, iter: 5 });
    const w = S.w || await run(S.rel);
    rows.push({ key, phaseDeg: ph, j2, rel: S.rel, converged: S.converged, runs: S.runs, w: winSum(w) });
    log(`phase ${key}: 収束 ${S.converged}・M4 ${w.T4p.toFixed(6)}・交点 ${w.node.toFixed(5)}・恒星月 ${w.sidH.toFixed(7)}・傾斜 ${w.incMean.toFixed(4)}`);
  }
  const by = (k) => rows.find((r) => r.key === k).w;
  return { note: '起点の位相(重心の公転の t=0 —— 近日点 0°/遠日点 180°)× J₂ あり/なし —— 参照積分で長窓の平均の要素を解き直した(元期の宣言が無い分の幅)', rows,
    halfSpread: { onNode: 0.5 * (by('on180').node - by('on0').node), onT4p: 0.5 * (by('on180').T4p - by('on0').T4p), offNode: 0.5 * (by('off180').node - by('off0').node), offT4p: 0.5 * (by('off180').T4p - by('off0').T4p) },
    j2Node: { ph0: by('on0').node - by('off0').node, ph180: by('on180').node - by('off180').node }, wallSec: (Date.now() - t0) / 1000 };
}

/* ── 段 attrib(交点の残りの目録 —— 後の宣言の初期配置・参照積分の同じ初期配置の差)── */
export async function stageAttrib(HP, log, J) {
  const t0 = Date.now(), after = decl306(J.solve.rounded), M = J.measure, P = J.phase;
  const run = (o) => winSum(EM.winOf(refOf(after.bodies, o).ev, 0, LONG));
  const base = last(M.runs.ref.fromZero), eng = last(M.runs.afterOn.fromZero), soft0 = last(M.runs.ref0.fromZero);
  const j2up = run({ J2: Object.assign({}, REF_J2, { J2: REF_J2.J2 * 1.01 }) });
  const j2alt = run({ J2: { J2: J2_ALT.J2, R: J2_ALT.req, obliquityDeg: REF_J2.obliquityDeg } });
  const plan = run({ planets: true }), tide = run({ tide: true });
  // 太陽の平均運動(年の長さ): 太陽の質量 ×(1+δ)・重心の速度 ×√(1+δ)(同じ楕円の形 —— n′ が √(1+δ) 倍)・相対ベクトルはそのまま
  const delta = 1e-4, sunB = clone(after.bodies); sunB[0].m *= 1 + delta;
  { const E = after.bodies[1], Mo = after.bodies[2], mt = E.m + Mo.m, bv = ['vx', 'vy', 'vz'].map((k) => (E.m * (E[k] || 0) + Mo.m * (Mo[k] || 0)) / mt), f = Math.sqrt(1 + delta);
    for (const i of [1, 2]) ['vx', 'vy', 'vz'].forEach((k, c) => { const b = after.bodies[i]; sunB[i][k] = (b[k] || 0) - bv[c] + f * bv[c]; }); }
  const sun = winSum(EM.winOf(refOf(sunB).ev, 0, LONG));
  const bary = baryOf(after.bodies, after.physics.G), yearModel = 2 * Math.PI * Math.sqrt(Math.pow(bary.a, 3) / (after.physics.G * after.bodies[0].m)) / DAY;
  const dlnN = -(yearModel / SIDEREAL_YEAR_D - 1);   // 本の n′ の相対の偏り(n′_本/n′_恒星年 − 1)
  const sens = (sun.node - base.node) / (0.5 * delta);   // ∂T_node/∂(ln n′)
  const obsRes = eng.node - OBS_B1.node.value, J2eff = J.measure.table.j2Effect.after.node, lnJ2R2 = (J2_ALT.J2 * J2_ALT.req * J2_ALT.req) / (EARTH_J2.J2 * EARTH_J2.req * EARTH_J2.req) - 1;
  const rows = [
    { key: 'softening', kind: 'correction', label: '軟化 ε 0.0005 → 0(参照積分・同じ初期配置)', d: base.node - soft0.node },
    { key: 'j2Width', kind: 'correction', label: `J₂ の値の幅(GRS80 → ${J2_ALT.source} —— 参照積分の差)`, d: base.node - j2alt.node, linear: -J2eff * lnJ2R2 },
    { key: 'planets', kind: 'correction', label: '惑星 4 つ(円の規定運動・間接項つき —— 本に無い)', d: -(plan.node - base.node) },
    { key: 'tide', kind: 'correction', label: '潮汐の保存項(🌜 の k₂ —— 本に無い)', d: -(tide.node - base.node) },
    { key: 'year', kind: 'correction', label: `太陽の平均運動(本の年 ${yearModel.toFixed(6)} 日 − 恒星年 ${SIDEREAL_YEAR_D} 日 —— ∂T/∂ln n′ ${sens.toFixed(3)} 年 × ln n′ の偏り)`, d: sens * dlnN, sens, dlnN, yearModel },
    { key: 'extractor', kind: 'correction', label: '抽出器: 長窓の直線 − 調和の回帰(φ = 2(λ☉ − Ω̄) の 1・2 倍と年周 —— 診断)', d: eng.node - eng.nodeH },
    { key: 'axisAz', kind: 'range', label: '軸の方位 0° ↔ 90°(元期の宣言なし —— エンジン)', d: last(M.runs.afterAz0.fromZero).node - eng.node },
    { key: 'phase', kind: 'range', label: '起点の位相 0° ↔ 180°(半分 —— 平均の要素を解き直した参照積分)', d: P ? P.halfSpread.onNode : null },
    { key: 'window', kind: 'range', label: '窓の長さ: [0,708] − [0,1062](同じ走行 —— 118 公転窓は交点の 1 周より短く、ずらすと sd が大きい: 別欄 slideSd)',
      d: (() => { const w = M.runs.afterOn.fromZero.find((z) => z.N === 708); return w && w.complete !== false ? w.node - eng.node : null; })(),
      slideSd: M.runs.afterOn.slide ? M.runs.afterOn.slide.node.sd : null }];
  const corr = rows.filter((r) => r.kind === 'correction' && Number.isFinite(r.d)).reduce((s, r) => s + r.d, 0);
  const out = { note: '交点の残り(後の宣言の長窓 − B1)の目録 —— 同じ初期配置の差(参照積分 —— アプリの物理ではない)。correction は本と現実の差の向きに符号をそろえた寄与(本の値 − 直した値)・range は元期・窓の不定の幅',
    obs: OBS_B1.node.value, engine: eng.node, residual: obsRes, refBase: base.node, rows, sumCorrection: corr, remaining: obsRes - corr,
    j2: { up1pct: j2up.node - base.node, alt: j2alt.node - base.node, lnJ2R2, j2Effect: J2eff }, sunDelta: delta,
    notMeasured: ['黄道の動き(惑星による黄道の歳差 —— 本の黄道は固定の xy 面・B1 は固定の春分点への換算〔一次資料で確かめていない〕)', '地球の J₄ と高次(別の鍵 —— 未対応)', '月の図形(J₂・C₂₂)と潮汐の散逸'],
    wallSec: (Date.now() - t0) / 1000 };
  log(`attrib: 残り ${obsRes.toExponential(3)} 年・寄与の和 ${corr.toExponential(3)}・残り ${out.remaining.toExponential(3)}(${rows.map((r) => r.key + ' ' + (Number.isFinite(r.d) ? r.d.toExponential(2) : '—')).join('・')})`);
  return out;
}

/* ── 段 ledger(J₂ × 引きずり ON の仕事の帳簿 —— 定義と数だけ)── */
/** J₂ の源(固定の軸か自転軸)の受け手の加速度(同じ式 —— j2Kick3 の写し)を位置 X,Y,Z で作る。反作用を含む全粒子の加速度を返す */
function j2AccAt(S, X, Y, Z) {
  const n = S.n, m = S.mEff || S.m, G = S.params.G, e2 = (S.params.softening || 0) ** 2, ax = new Float64Array(n), ay = new Float64Array(n), az = new Float64Array(n);
  for (const s of S._j2.src) {
    const i = s.i, mi = m[i], px = s.fixed ? s.px : S.sax[i], py = s.fixed ? s.py : S.say[i], pz = s.fixed ? s.pz : S.saz[i], k3 = 1.5 * G * mi * s.J2 * s.req * s.req;
    for (let j = 0; j < n; j++) {
      if (j === i) continue;
      const dx = X[j] - X[i], dy = Y[j] - Y[i], dz = Z[j] - Z[i], s2 = dx * dx + dy * dy + dz * dz + e2, inv2 = 1 / s2, zeta = px * dx + py * dy + pz * dz, c = -k3 * inv2 * inv2 / Math.sqrt(s2), q = 1 - 5 * zeta * zeta * inv2;
      const bx = c * (q * dx + 2 * zeta * px), by = c * (q * dy + 2 * zeta * py), bz = c * (q * dz + 2 * zeta * pz), f = m[j] / mi;
      ax[j] += bx; ay[j] += by; az[j] += bz; ax[i] -= f * bx; ay[i] -= f * by; az[i] -= f * bz;
    }
  }
  return [ax, ay, az];
}
/** U_J₂ を位置 X,Y,Z・軸 axes(源ごとの [px,py,pz] —— 省略は今の軸)で作る(j2Energy の写し) */
function j2UAt(S, X, Y, Z, axes) {
  const n = S.n, m = S.mEff || S.m, G = S.params.G, e2 = (S.params.softening || 0) ** 2;
  let U = 0;
  S._j2.src.forEach((s, si) => {
    const i = s.i, mi = m[i], p = axes ? axes[si] : (s.fixed ? [s.px, s.py, s.pz] : [S.sax[i], S.say[i], S.saz[i]]), k = 0.5 * G * mi * s.J2 * s.req * s.req;
    for (let j = 0; j < n; j++) {
      if (j === i) continue;
      const dx = X[j] - X[i], dy = Y[j] - Y[i], dz = Z[j] - Z[i], s2 = dx * dx + dy * dy + dz * dz + e2, zeta = p[0] * dx + p[1] * dy + p[2] * dz;
      U += m[j] * k * (3 * zeta * zeta - s2) / (s2 * s2 * Math.sqrt(s2));
    }
  });
  return U;
}
const axesOf = (S) => S._j2.src.map((s) => (s.fixed ? [s.px, s.py, s.pz] : [S.sax[s.i], S.say[s.i], S.saz[s.i]]));
/** 帳簿の走行: 步ごとに W_J₂ = −h Σ m a_J₂(x₀)·u(x₀ は semic の核の前の写し —— 帳簿 W と同じ位置・同じ段)・移送の前後の ΔU_J₂・図形の仕事 W_fig(軸の更新の前後の U_J₂ の差 ——
 *  位置は同じ)・W_N の写し(エンジンの帳簿 inertialDragWork との一致の確かめ)。every 步ごとに R_E(読み口)・U_J₂ を標本 */
export function ledgerRun(HP, preset, o) {
  const v = HP.validatePreset(clone(preset));
  if (!v.ok) throw new Error('validatePreset: ' + JSON.stringify(v.errors).slice(0, 300));
  const S = HP.coord3d.makeSim(); S.build(clone(v.preset));
  const dt = o.dt, n = S.n, j2 = !!S._j2, drag = !!S.hasRelativeDrag, every = o.every || 2000;
  const rec = o.ci !== undefined ? EM.makeRec(S.params.G * (S.m[o.ci] + S.m[o.oi]), dt, [S.x[o.oi] - S.x[o.ci], S.y[o.oi] - S.y[o.ci], S.z[o.oi] - S.z[o.ci]], o.si !== undefined ? Math.atan2(S.y[o.si] - S.y[o.ci], S.x[o.si] - S.x[o.ci]) : null) : null;
  const U0 = j2 ? j2UAt(S, S.x, S.y, S.z) : 0;
  const tot0 = HP.coord3d.totals(S);
  let wJ2 = 0, wJ2pre = 0, dUtr = 0, wFig = 0, wNrep = 0, wNmaxDiff = 0, k = 0;
  let RE = { max: 0, last: null }, RF = { max: 0, last: null }, EF = { max: 0, last: null }, EO = { max: 0, last: null }, UJ = { maxAbs: 0, last: 0 }, samples = 0, E0 = null;
  const Xp = new Float64Array(n), Yp = new Float64Array(n), Zp = new Float64Array(n);
  const steps = o.steps;
  for (; k < steps; k++) {
    const axB = j2 ? axesOf(S) : null, wN0 = S.inertialDragWork || 0;
    S.step(dt);
    if (S.coord3dHalt || S.hasNaN()) throw new Error('帳簿の走行が止まった(' + (S.coord3dHalt || 'nan') + ')');
    if (rec) rec.push(k, [S.x[o.oi] - S.x[o.ci], S.y[o.oi] - S.y[o.ci], S.z[o.oi] - S.z[o.ci]], o.si !== undefined ? Math.atan2(S.y[o.si] - S.y[o.ci], S.x[o.si] - S.x[o.ci]) : null);
    if (j2) {
      const axA = axesOf(S);
      if (axA.some((p, si) => p[0] !== axB[si][0] || p[1] !== axB[si][1] || p[2] !== axB[si][2])) wFig += j2UAt(S, S.x, S.y, S.z, axA) - j2UAt(S, S.x, S.y, S.z, axB);
    }
    if (drag && S._rdUX && S._rdQX) {
      const UX = S._rdUX, UY = S._rdUY, UZ = S._rdUZ, QX = S._rdQX, QY = S._rdQY, QZ = S._rdQZ, me = S.mEff || S.m;
      let moved = false;
      for (let i = 0; i < n; i++) { Xp[i] = S.x[i] - UX[i] * dt; Yp[i] = S.y[i] - UY[i] * dt; Zp[i] = S.z[i] - UZ[i] * dt; if (UX[i] !== 0 || UY[i] !== 0 || UZ[i] !== 0) moved = true; }
      if (moved) {
        if (j2) {
          const [ax, ay, az] = j2AccAt(S, QX, QY, QZ), [bx, by, bz] = j2AccAt(S, Xp, Yp, Zp);
          let w = 0, w2 = 0; for (let i = 0; i < n; i++) { w -= me[i] * (ax[i] * UX[i] + ay[i] * UY[i] + az[i] * UZ[i]); w2 -= me[i] * (bx[i] * UX[i] + by[i] * UY[i] + bz[i] * UZ[i]); }
          wJ2 += w * dt; wJ2pre += w2 * dt; dUtr += j2UAt(S, S.x, S.y, S.z) - j2UAt(S, Xp, Yp, Zp);
        }
        const wr = HP.inertialDragSemicWork ? HP.inertialDragSemicWork(S, n, dt, QX, QY, QZ) : null;
        if (wr !== null) { wNrep += wr; wNmaxDiff = Math.max(wNmaxDiff, Math.abs(wr - ((S.inertialDragWork || 0) - wN0))); }
      }
    }
    if ((k + 1) % every === 0 || k === steps - 1) {
      samples++;
      const U = j2 ? j2UAt(S, S.x, S.y, S.z) : 0, dU = U - U0;
      UJ.maxAbs = Math.max(UJ.maxAbs, Math.abs(dU)); UJ.last = dU;
      const lg = drag && HP.inertialDragLedgerOf ? HP.inertialDragLedgerOf(S) : null;
      if (lg && lg.RE !== null) {
        E0 = lg.E0;
        const re = lg.RE, rf = re + dU - wJ2 - wFig;
        RE.max = Math.max(RE.max, Math.abs(re)); RE.last = re; RF.max = Math.max(RF.max, Math.abs(rf)); RF.last = rf;
      }
      if (!drag) { const T = HP.coord3d.totals(S), eo = (T.E + U) - (tot0.E + U0), ef = eo - wFig; EF.max = Math.max(EF.max, Math.abs(ef)); EF.last = ef; EO.max = Math.max(EO.max, Math.abs(eo)); EO.last = eo; E0 = tot0.E; }
    }
    if (rec && o.revMax && rec.ev.rev.length >= o.revMax) { k++; break; }
  }
  return { steps: k, dt, j2, drag, samples, every, W_N: S.inertialDragWork || 0, W_Nrep: wNrep, W_NrepMaxStepDiff: wNmaxDiff, W_J2: wJ2, W_J2pre: wJ2pre, dU_J2transport: dUtr, W_fig: wFig,
    dU_J2: UJ.last, dU_J2maxAbs: UJ.maxAbs, RE, RF, EF, EO, E0, ev: rec ? rec.ev : null, j2State: j2 ? HP.j2State(S) : null };
}
export async function stageLedger(HP, log, J) {
  const t0 = Date.now(), after = decl306(J.solve.rounded), patch = clone(findPreset(HP, FIT_ID).abBody.physicsPatch), N = LONG;
  const out = { note: 'J₂ × 引きずり ON の仕事の帳簿(診断 —— 定義と数だけ・補正値を力やエネルギーへ足さない)。本の対照(abBody の W_bg)の写し・後の宣言の初期配置',
    patch, defs: {
      W_N: '−h Σ_i m_i a_N,i(x₀)·u_i(エンジンの帳簿 inertialDragWork —— E4 の核の a_N だけ・semic の左端)',
      W_J2: '−h Σ_i m_i a_J₂,i(x₀)·u_i(帳簿 W_N と同じ位置 x₀〔semic の核の前〕・同じ段の J₂ の分 —— 器の中で数えるだけ)',
      W_J2pre: '−h Σ_i m_i a_J₂,i(x_d)·u_i(x_d = ドリフトの後・移送の前の位置 —— 移送の前後の差 ΔU_J₂ の一次)',
      dU_J2transport: 'Σ_步 [U_J₂(x + u h) − U_J₂(x)](移送の前後の差 —— split の帳簿の定義の J₂ の分)',
      W_fig: 'Σ_步 [U_J₂(x; p̂_後) − U_J₂(x; p̂_前)](軸が動く場合の図形の仕事 —— 位置は同じ・固定の軸では恒等的に 0)',
      RE: '読み口 inertialDragLedgerOf の R_E = (K + U_N) − E₀ − W_N(U_J₂ を含まない —— J₂ のフックの注記の継ぎ目)',
      RF: 'R_E + ΔU_J₂ − W_J₂ − W_fig(閉じた形: d(K + U_N + U_J₂)/dt = Ẇ_N + Ẇ_J₂ + Ẇ_fig —— ẋ = v + u・v̇ = a_N + a_J₂)' } };
  const rows = [];
  for (const [key, j2] of [['dragOnJ2', true], ['dragOnNoJ2', false]]) {
    const q = copyOf(HP, j2 ? after : noJ2(after), { dragPatch: patch });
    const est = Math.ceil(N * 236.06 / DT * 1.02);
    const R = ledgerRun(HP, q, { dt: DT, steps: est * 3, every: 4096, ci: 1, oi: 2, si: 0, revMax: N });
    const W = EM.windowsOf(R.ev, WINS, 0).fromZero.map(winSum);
    delete R.ev;
    rows.push({ key, j2, ledger: R, windows: W });
    log(`ledger ${key}: ${R.steps} 步・W_N ${R.W_N.toExponential(3)}・W_J₂ ${R.W_J2.toExponential(3)}・ΔU_J₂(移送)${R.dU_J2transport.toExponential(3)}・ΔU_J₂ ${R.dU_J2.toExponential(3)}・|R_E| ${R.RE.max.toExponential(2)}・|R_F| ${R.RF.max.toExponential(2)}・長窓 M4 ${last(W).T4p.toFixed(5)}`);
  }
  // 軸が動く場合(規定の歳差 —— 器の中の二体の試験・引きずり OFF): E_N + U_J₂ の変化と W_fig
  const figCase = (prec) => {
    const pre = twoBodyOf(HP, { a: 1, e: 0.1, inc: 30, Om: 20, w: 40, integ: 'leapfrog', pinC: false, mp: 0.3, j2: { J2: 0.01, req: 0.1, axis: 'spin' },
      spinAxis: Object.assign({ enable: true, tiltDeg: 25, azimuthDeg: 60, source: '器の中の試験' }, prec ? { precessionRate: prec } : {}) });
    const R = ledgerRun(HP, pre, { dt: 2 * Math.PI / 2000, steps: 200000, every: 200 });
    delete R.ev;
    return { precessionRate: prec, steps: R.steps, W_fig: R.W_fig, EF: R.EF, EO: R.EO, dU_J2: R.dU_J2, E0: R.E0, closedRel: R.EF.max / Math.abs(R.E0), openRel: R.EO.max / Math.abs(R.E0) };
  };
  out.fig = { note: '器の中の二体の試験(質量比 0.3・J₂ 0.01・R 0.1・軸 "spin" = 自転軸・leapfrog 200000 步・引きずり OFF)。EF = (E_N + U_J₂) − (E_N + U_J₂)₀ − W_fig(閉じた形)',
    fixed: figCase(0), precess: figCase(0.05) };
  out.rows = rows;
  const on = rows[0].ledger, off = rows[1].ledger;
  out.summary = { W_N: on.W_N, W_J2: on.W_J2, W_J2pre: on.W_J2pre, dU_J2transport: on.dU_J2transport, defGap: Math.abs(on.W_J2pre - on.dU_J2transport) / Math.max(1e-300, Math.abs(on.dU_J2transport)),
    seamOverRE: Math.max(Math.abs(on.dU_J2 - on.W_J2), on.dU_J2maxAbs) / Math.max(1e-300, on.RE.max), W_fig: on.W_fig, dU_J2: on.dU_J2, REmax: on.RE.max, RFmax: on.RF.max, REmaxNoJ2: off.RE.max,
    W_NrepMaxStepDiff: Math.max(on.W_NrepMaxStepDiff, off.W_NrepMaxStepDiff), W_NrepRel: Math.abs(on.W_Nrep - on.W_N) / Math.max(1e-300, Math.abs(on.W_N)),
    T4pOnJ2: last(rows[0].windows).T4p, T4pOnNoJ2: last(rows[1].windows).T4p,
    figFixed: out.fig.fixed.W_fig, figPrecess: out.fig.precess.W_fig, figClosedRel: out.fig.precess.closedRel, figOpenRel: out.fig.precess.openRel };
  // 門(定義の確かめ —— 閾値は数の大きさの比較だけ): 固定の軸で W_fig ≡ 0・W_N の写しがエンジンの帳簿と同じ・移送の前後の ΔU_J₂ と W_J₂(x_d)が一次で一致・
  //   規定の歳差の試験で W_fig ≠ 0 かつ閉じた形が開いた形より 10 倍以上小さい。🌦️ の R_E は J₂ の継ぎ目より桁で大きい(数値の残り)—— 記録だけ
  out.ok = on.W_fig === 0 && out.summary.W_NrepRel < 1e-9 && out.summary.defGap < 1e-3 && out.fig.fixed.W_fig === 0 && out.fig.precess.W_fig !== 0
    && out.fig.precess.closedRel < 0.1 * out.fig.precess.openRel && [on.W_J2, on.W_J2pre, on.dU_J2transport, on.dU_J2, on.RE.max, on.RF.max].every(Number.isFinite);
  out.wallSec = (Date.now() - t0) / 1000;
  return out;
}

/* ── 段 emo(🌔)── */
export async function stageEmo(HP, log, J) {
  const t0 = Date.now(), after = decl306(J.solve.rounded), src = findPreset(HP, FIT_ID), ctrl = findPreset(HP, EMO_ID);
  const want = clone(ctrl); want.bodies = emOnlyBodies(after.bodies); want.physics = emOnlyPhysics(after.physics);
  const chkLive = emDeclCheck(src, ctrl), declSameAsRule = same(ctrl.bodies, want.bodies) && same(ctrl.physics, want.physics);
  const go = (key, p, dt, N) => { const R = runEm3(HP, clone(p), { dt, revMax: N, ci: 0, oi: 1, com: true });
    if (!R.complete || R.nan) throw new Error(`🌔 の走行が窓を満たさない(${key})`);
    const w = emWindowsOf(R, [N], HP)[0]; log(`emo: ${key} 恒星月 ${w.sid}`);
    return { key, dt, steps: R.steps, sid: w.sid, synUniform: w.synUniform, eOsc: w.eOsc, incMean: w.incMean }; };
  const h = go('h', want, DT, 118), h2 = go('h2', want, DT2, 118);
  return { note: '🌔 = 後の 🌦️ の宣言の写しの規則(emOnlyBodies・emOnlyPhysics)—— 引きずり OFF の地球と月の二体(重力と地球の J₂)。数の正本は tests/out/emonly-w300b.json(鎖で作り直す)',
    declCheckLive: chkLive, declSameAsRule, wantBodies: want.bodies, runs: { h, h2 }, h2Diff: { sid: Math.abs(h.sid - h2.sid) }, wallSec: (Date.now() - t0) / 1000 };
}

/* ── 段 record ── */
export const WINDOW_LONG = '1062 公転の窓 [0,1062](約 79.4 年 —— 近点の約 9 周・交点の約 4.3 周)・引きずり OFF・地球の J₂・semic';
export const PROCEDURE_306C = '第306便c: 第305便c の宣言(地球の J₂ を含む)の規則のまま、初期配置だけを J₂ ありの参照積分で長窓 1062 公転の平均の要素(恒星月 = B1 27.321661554 日・平均離心率 0.0549・平均傾斜 5.145°)へ 3 元の Newton → エンジンの長窓で同じ Jacobian の Newton → 近地点距離・接触離心率 7 桁・接触傾斜 5 桁に丸め、h と h/2 で測り直した(J₂ の値と軸は動かしていない —— 器 tests/exp-w306c-emresolve.mjs)。第305便c: 地球の J₂ を足した(器 tests/exp-w305c-j2.mjs)。第304便c: ε 0.0005・e′ 0.0167086(近日点から)・引きずり OFF の写しで同じ平均の要素へ解き直した(器 tests/exp-w304c-baseline.mjs)';
export const EMS_NOTE_306C = '初期配置を J₂ ありで解き直した(第306便c —— 恒星月 B1・平均離心率 0.0549・平均傾斜 5.145°。J₂ の値と軸は動かしていない)';
export function recordOf(HP, J, prev) {
  const a = last(J.measure.runs.afterOn.fromZero), a2 = last(J.measure.runs.afterOn2.fromZero), rel = J.solve.rounded;
  const mv = [a.T4p, a.sidH, a.eMean, a.node], h2 = [Math.abs(a.T4p - a2.T4p), Math.abs(a.sidH - a2.sidH), Math.abs(a.eMean - a2.eMean), Math.abs(a.node - a2.node)];
  const rec = clone(prev);
  rec.targets = prev.targets.map((t, i) => {
    const z = clone(t); z.window = WINDOW_LONG; z.model = mv[i]; z.residual = mv[i] - t.obs; z.rel = z.residual / t.obs; z.numerics = { h2: h2[i], dtHalf: DT2 };
    if (i === 3) z.source = t.source + '。出所と定義の確認の記録は paper/data/obs-moon-node-20261016.csv(第306便c —— B1 は恒星に対する値・春分点に対する値は 18.612958 年)';
    return z; });
  rec.knobs = prev.knobs.map((k, i) => Object.assign(clone(k), { final: [rel.rp, rel.e0, rel.inc][i] }));
  rec.fixed = prev.fixed.slice(0, prev.fixed.length).concat(['第305便c の宣言(初期配置は J₂ なしで解いたまま —— 長窓の恒星月 ' + L.fx(last(J.measure.runs.beforeOn.fromZero).sidH, 7) + ' 日・平均傾斜 '
    + L.fx(last(J.measure.runs.beforeOn.fromZero).incMean, 4) + '°・cond.sig ' + prev.cond.sig + ')は履歴 —— 前後表は PHYSICS〔第306便c〕と正本 tests/out/emresolve-w306c.json']);
  rec.procedure = PROCEDURE_306C;
  rec.steps = J.measure.runs.afterOn.steps;
  rec.notFitted = ['近点回転の周期と交点の周期は合わせていない —— 引きずり OFF の純ニュートンの三体と地球の J₂ の値(ノブは初期配置の 3 つだけ・予言ではなく基線の確かめ)',
    '恒星月・平均離心率・平均傾斜は初期配置の入力として長窓の平均に合わせた(第306便c —— J₂ ありで解き直した・法則の予言として数えない)',
    prev.notFitted[2], prev.notFitted[3], EMS_NOTE_306C, '機構(主因は太陽摂動 —— 機構の同定ではない)'];
  rec.cond = { version: HP.FIT_COND_VERSION || 'w297b-cond-1', sig: '0000000000000000', extractor: prev.cond.extractor };
  return rec;
}
export async function stageRecord(HP, J) {
  const p = findPreset(HP, FIT_ID), prev = DECL305[FIT_ID].fitRecord, rec = recordOf(HP, J, prev), after = decl306(J.solve.rounded);
  const want = copyOf(HP, after); want.fitRecord = rec;
  rec.cond.sig = HP.fitCondSig(HP.validatePreset(clone(want)).preset, rec);
  const vr = HP.validateFitRecord(clone(rec)), vp = HP.validatePreset(clone(want));
  let condState = null;
  const vLive = HP.validatePreset(clone(p));
  if (vLive.ok && vLive.preset.fitRecord) { HP.sim.build(vLive.preset); condState = HP.fitCondStateOf(HP.fitCondInputsOf(vLive.preset, HP.sim.params), vLive.preset.fitRecord).state; }
  const gates = HP.fitTargetGates ? HP.fitTargetGates(rec) : rec.targets.map((t) => ({ pass: Math.abs(t.residual) + t.numerics.h2 <= t.tol.value }));
  return { record: rec, accepted: !!vr.ok, acceptErr: vr.ok ? null : vr.err, presetOk: vp.ok && (vp.warnings || []).length === 0, presetWarnings: vp.warnings || [],
    liveSame: same(p.fitRecord, rec) && same(p.bodies, want.bodies), live305: same(p.fitRecord, prev) && same(p.bodies, DECL305[FIT_ID].bodies), condState, targetGates: gates };
}

/* ── 本体 ── */
export const PARTS_ALL = Object.freeze(['solve', 'measure', 'phase', 'attrib', 'ledger', 'emo', 'record']);
export function gatesOf(J) {
  const g = {}, adopt = !!(J.measure && J.measure.gate && J.measure.gate.pass);
  if (J.solve) { g.solved = J.solve.ref.converged === true && J.solve.engine.converged === true; g.rule305 = J.solve.rule305Same === true;
    g.declLive = adopt ? J.solve.declSame === true : J.solve.live305 === true; }
  if (J.measure) { g.refEngine = J.measure.refGate.ok === true; g.adoptGate = adopt; }
  if (J.phase) g.phaseSolved = J.phase.rows.every((r) => r.converged === true);
  if (J.attrib) g.attribFinite = J.attrib.rows.every((r) => r.d === null || Number.isFinite(r.d));
  if (J.ledger) g.ledger = J.ledger.ok === true;
  if (J.emo) g.emoDecl = J.emo.declCheckLive.ok === true && (adopt ? J.emo.declSameAsRule === true : true);
  if (J.record) { g.recordAccepted = J.record.accepted === true && J.record.presetOk === true; g.recordFitted = J.record.record.status === 'fitted' && J.record.targetGates.every((t) => t.pass);
    g.recordLive = adopt ? (J.record.liveSame === true && J.record.condState === 'match') : (J.record.live305 === true); }
  return g;
}
export async function main() {
  const OUT = process.env.W306C_OUT || path.join(ROOT, 'tests', 'out', 'emresolve-w306c.json');
  const PARTS = String(process.env.W306C_PARTS || PARTS_ALL.join(',')).split(',').filter((x) => PARTS_ALL.includes(x));
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const t0 = Date.now();
  const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
  if (typeof HP.j2State !== 'function') throw new Error('対象の html に三次元の J₂(第305便c)が無い');
  const prev = (PARTS.length < PARTS_ALL.length && fs.existsSync(OUT)) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : {};
  const log = (s) => console.log('  ' + s);
  const J = { meta: null, version: HARNESS_VERSION, preVersion: PRE_VERSION, long: LONG, wins: WINS, earthJ2: EARTH_J2, earthJ2Source: EARTH_J2_SOURCE, refJ2: REF_J2, tol: TOL, obs: OBS_B1,
    target: TARGET_MEAN, decl305: { sig: DECL305[FIT_ID].fitRecord.cond.sig, rel: EM.relOf(DECL305[FIT_ID].bodies, DECL305[FIT_ID].physics.G) } };
  const stages = { solve: () => stageSolve(HP, log), measure: () => stageMeasure(HP, log, J), phase: () => stagePhase(HP, log, J), attrib: () => stageAttrib(HP, log, J),
    ledger: () => stageLedger(HP, log, J), emo: () => stageEmo(HP, log, J), record: () => stageRecord(HP, J) };
  J.partsRun = [];
  for (const k of PARTS_ALL) {
    if (PARTS.includes(k)) { console.log(`段 ${k}`); J[k] = await stages[k](); J.partsRun.push(k); }
    else if (prev[k]) J[k] = prev[k];
  }
  J.adopted = !!(J.measure && J.measure.gate && J.measure.gate.pass);
  J.gates = gatesOf(J);
  J.ok = Object.values(J.gates).every(Boolean) && PARTS_ALL.every((k) => !!J[k]);
  J.notClaim = ['「月を再現した」', '「交点を再現した」', '「現実を再現した」'];   // 書かない語(引用 —— 本文には書かない)
  const CODE = ['tests/exp-w306c-emresolve.mjs', 'tests/lib-w306c-pre.mjs', 'tests/exp-w305c-j2.mjs', 'tests/exp-w304c-baseline.mjs', 'tests/lib-w305c-pre.mjs', 'tests/lib-w304c-pre.mjs',
    'tests/exp-w303c-earthmoon.mjs', 'tests/exp-w300b-emonly.mjs', 'tests/lib-w297b-fit.mjs', 'tests/lib-w296b-fit.mjs', 'tests/lib-w292c-dragcore.mjs', 'tests/lib-w280b-emgrid.mjs',
    'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  J.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第306便c', target: TARGET, code: CODE, inputs: [TARGET, DECL305_DATA_FILE, 'tests/data-w305c-decl304.json', 'tests/data-w304c-decl303.json'] }), {
    harnessVersion: HARNESS_VERSION, loadErrors: errors.length,
    ruling: 'DECISIONS v64 AN337 ③④⑤・v65 §0 AN337(J₂ ありで初期配置を解き直す —— J₂ を交点に合わせて動かすのを第一手にしない)・AN335 ①', reading: '統括の検証項目 R206(🌦️ の J₂ ありの初期配置の解き直し・交点の観測の行・J₂ × 引きずり ON の仕事の帳簿)' });
  J.elapsedS = (Date.now() - t0) / 1000;
  Object.assign(J.meta, W281A_SCOPE, w281aStableInputs(ROOT, J.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(J, null, 1) + '\n');
  console.log(`門: ${JSON.stringify(J.gates)} → ${path.relative(ROOT, OUT)}(${J.elapsedS.toFixed(0)} s)`);
}
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) await main();

/* ── 表の行(PHYSICS〔第306便c〕—— QA docs.emResolve306 が正本から作り直して逐語で照合する)── */
const F = L.fx, EX = L.ex, sg = (x, d) => (x >= 0 ? '+' : '') + F(x, d);
/** 表 1: 初期配置の解き直し(第305便の宣言 → 参照積分 → エンジン → 丸め) */
export function solveRows(J) {
  const S = J.solve, r = (label, x, w) => `| ${label} | ${F(x.rp, 7)} | ${F(x.e0, 7)} | ${F(x.inc, 5)} | ${w ? F(w.sidH, 7) : '—'} | ${w ? F(w.eMean, 6) : '—'} | ${w ? F(w.incMean, 4) : '—'} |`;
  const lr = last(S.ref.iters), le = last(S.engine.iters), a = last(J.measure.runs.afterOn.fromZero), b = last(J.measure.runs.beforeOn.fromZero);
  return [r('第305便の宣言(起点 —— エンジンの長窓)', S.rel0, b), r(`参照積分(J₂ あり・収束 ${S.ref.converged}・${S.ref.runs} 走行)`, S.ref.rel, lr),
    r(`エンジン(同じ Jacobian・収束 ${S.engine.converged}・${S.engine.runs} 走行)`, S.engine.rel, le), r('丸め(後の宣言 —— エンジンの長窓で測り直し)', S.rounded, a)];
}
/** 表 2: 前後の 4 量(長窓 M4・交点・恒星月・平均傾斜)と J₂ あり/なし */
export function beforeAfterRows(J) {
  const T = J.measure.table, r = (label, w) => `| ${label} | ${F(w.T4p, 5)} | ${F(w.node, 4)} | ${F(w.sidH, 7)} | ${F(w.incMean, 4)} | ${F(w.eMean, 6)} |`;
  return [r('前・J₂ なし(第304便c の宣言)', T.before.off), r('前・J₂ あり(第305便c の宣言)', T.before.on), r('後・J₂ なし(同じ初期配置から J₂ を外した写し)', T.after.off),
    r('**後・J₂ あり(第306便c の宣言)**', T.after.on), r('後・J₂ あり(h/2)', T.after.on2), r('後・J₂ あり・軸の方位 0°(感度)', T.after.az0)];
}
/** 表 3: B1 との差と照合許容の倍(前 → 後) */
export function diffRows(J) {
  const b = J.measure.table.diffBefore, a = J.measure.table.diffAfter, B = J.obs;
  const row = (label, x, y, d) => `| ${label} | ${sg(x.res, d)} | ${F(x.ratio, 2)} | ${sg(y.res, d)} | ${F(y.ratio, 2)} |`;
  const rowE = (label, x, y) => `| ${label} | ${(x.res >= 0 ? '+' : '') + EX(x.res, 1)} | ${F(x.ratio, 2)} | ${(y.res >= 0 ? '+' : '') + EX(y.res, 1)} | ${F(y.ratio, 2)} |`;
  return [row(`近点の周期 M4 − B1 ${F(B.aps.value, 6)} [年]`, b.aps, a.aps, 5), row(`交点の周期 − B1 ${F(B.node.value, 6)} [年]`, b.node, a.node, 5),
    rowE(`恒星月 − B1 ${F(B.sid.value, 9)} [日]`, b.sid, a.sid), rowE('平均傾斜 − 5.145 [°](許容 0.0005°)', b.inc, a.inc), rowE('平均離心率 − 0.0549', b.e, a.e)];
}
/** 表 4: 起点の位相 × J₂ あり/なし(参照積分で解き直し) */
export function phaseRows(J) {
  return J.phase.rows.map((r) => `| ${r.j2 ? 'J₂ あり' : 'J₂ なし'}・${r.phaseDeg === 0 ? '近日点から' : '遠日点から'} | ${F(r.rel.rp, 7)} | ${F(r.rel.e0, 7)} | ${F(r.rel.inc, 5)} | ${F(r.w.T4p, 5)} | ${F(r.w.node, 4)} | ${F(r.w.sidH, 7)} | ${F(r.w.incMean, 4)} |`);
}
/** 表 5: 交点の残りの目録 */
export function attribRows(J) {
  const A = J.attrib;
  const rows = A.rows.map((r) => `| ${r.label} | ${r.kind === 'range' ? '幅' : '寄与'} | ${r.d === null ? '—' : (r.kind === 'range' ? '±' + EX(Math.abs(r.d), 2) : (r.d >= 0 ? '+' : '') + EX(r.d, 2))} |`);
  rows.push(`| 寄与の和(correction) | — | ${(A.sumCorrection >= 0 ? '+' : '') + EX(A.sumCorrection, 2)} |`);
  rows.push(`| 交点の残り(長窓 ${F(A.engine, 4)} − B1 ${F(A.obs, 6)})→ 寄与を引いた残り | — | ${sg(A.residual, 5)} → ${sg(A.remaining, 5)} |`);
  return rows;
}
/** 表 6: J₂ × 引きずり ON の仕事の帳簿 */
export function ledgerRows(J) {
  const S = J.ledger.summary, X = (x) => (x >= 0 ? '+' : '') + EX(x, 3);
  return [`| W_N(エンジンの帳簿 —— E4 の核) | ${X(S.W_N)} |`, `| W_J₂ = −h Σ m a_J₂(x₀)·u(帳簿 W_N と同じ位置) | ${X(S.W_J2)} |`, `| W_J₂(x_d)= −h Σ m a_J₂(x_d)·u(ドリフトの後・移送の前) | ${X(S.W_J2pre)} |`, `| ΔU_J₂(移送の前後の和) | ${X(S.dU_J2transport)} |`,
    `| W_fig(固定の軸 —— 恒等的に 0) | ${X(S.W_fig)} |`, `| ΔU_J₂(走行の始めと終わり) | ${X(S.dU_J2)} |`,
    `| max\\|R_E\\|(読み口 —— U_J₂ を含まない) | ${EX(S.REmax, 3)} |`, `| max\\|R_E + ΔU_J₂ − W_J₂ − W_fig\\|(閉じた形) | ${EX(S.RFmax, 3)} |`,
    `| max\\|R_E\\|(同じ写しの J₂ なし) | ${EX(S.REmaxNoJ2, 3)} |`];
}
