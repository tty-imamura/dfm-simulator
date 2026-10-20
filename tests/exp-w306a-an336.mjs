// 第306便a(原仮定者の裁定〔第97報〕AN336「水星の標的を 1PN + A1 に替える」・第95報・AN332 の裁定〔n = 2 を先・n = +1 は次点・n = 0 は対照〕・
// 決断事項 AN330・AN331・統括の検証項目 R204)—— **水星の 1PN + A1 の参照値への再フィット・7 本への移送・在位の惑星 7 本の一括の宣言の門**
// (Node だけ —— 対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、アプリの三次元の步〔semic・dfmInertialDragStep3・
// 対ごとの正規化 inertialDragPairApply・dfmCore3 の gLocKick3〕をそのまま走らせる・1 プロセス)。
//
// ■ 標的(派生した参照値 —— tests/lib-w306a-an336.mjs)
//   q⋆ = q_1PN(初期の接触要素)+ A1(EPM2011・記録 OBS-30d6c60e・−0.002″/世紀)= 42.978510382067476″/世紀。sigma は null・原資料の幅 sourceWidth 0.003
//   (68% の 1σ の定義は未確認)・数値フィットの停止許容 0.0009(kind declared —— 旧い宣言の許容を数値の許容として継承)・照合規約 43.0 は履歴の列。
//   calibrationEligible false(「fitted」はこの参照値と宣言の許容に対する数値フィット —— 観測の較正の合格とは別)。
//
// ■ 写し(在位の本の宣言は段 M・T では使わない —— 基点 02ca93b の宣言の凍結の写し tests/data-w306a-decl305.json から作る)
//   ・physics・bodies・scaleExp・timeRef は 02ca93b の宣言・fitRecord と gLoc は外す。
//   ・引きずり: W_bg = W_ext(W_cos + W_gal —— 第302便c の推定・太陽を含めない・本ごとの単位)・inertialR2:{lambdaRs:k, sources:"all", denom:"pair"}(λ ∝ m + 対 ——
//     AN334・二体では対 = 行)・**自己の項(self・dragCore・shellSelf)は入れない**。G_loc: n = 2 は gLoc:{law:"kappaC2"}・n = +1 は {law:"cRatio"}・n = 0 は宣言なし。
//   ・対照は引きずり OFF・G_loc なし({Wbg:null, enabled:false})—— 差 = 写し − 対照(同じ刻み・同じ初期状態)。
//
// ■ 段(正本 tests/out/an336-w306a.json —— 段 an336-306a)。W306A_PARTS=A,M,T,R,G で選ぶ(正本は全段)・W306A_OUT で出力先
//   A 標的の生成器と契約(tests/exp-w306a-an336contract.mjs の runContract —— 不正な入力 7 例の拒否・観測 CSV の不変・水星の値)と 7 本の参照値
//   M 水星(🌡️ の写し・8 公転・検出器 B)の k を q⋆ へ(tests/lib-w303e-fitstop.mjs の fitStopSync —— 割線・x0 4.99986・x1 5・停止は許容の 1/10・丸め 7 桁・
//     最後の h/h2 の門)・h/4 で測り直す。n = +1・n = 0 は同じ器の対照。n = 2 は根を h/2 で取り直す(門は h/4)確かめ。照合規約 43.0 の k(第305便b の正本)は履歴の列
//   T 移送(同じ k・n = 2 —— 再フィットしない): 7 本 × h/h2/h4 × 窓 2 種(8・16 公転)× 位相 2 種(0・半公転)× 抽出器 2 種(新しい抽出器が主・検出器 B を併記)。
//     各行に参照値・予言・差・原資料の幅に対する倍(「σ」と呼ばない)・数値の帯 |h/2 − h/4|。A1 の幅からの δk の感度の見積り(誤差の伝播ではない)
//   R 二体で denom "pair" と "row" の全状態のビット同一(水星の写し・2000 步)
//   G 門: (G1) 水星が n = 2 で q⋆ に数値停止 (G2) **html に書いた宣言そのもの**(在位の 7 本)を走らせた値が段 M・T の写しの値とビット同一 —— 宣言前の html では「未宣言」
//     (G3) 7 本 × h/h2/h4 で 16 公転を完走・NaN なし・有限。(G4) の 1 歩の時間は jitprobe(tests/exp-w258e-jitprobe.mjs)で測る(器の外)
//   宣言の写し(declaration): 7 本の physics(段 M の k と本ごとの W_ext)と 🌡️ の fitRecord(条件の署名つき —— 宣言後の html で作り直して照合)
//
// ■ 言わないこと
//   ・「43″ が出た」「GR と一致した」「n が決まった」「移送が通った」「全惑星が 1σ の内」「観測の 1σ で較正済み」。幅の比を「σ」と呼ばない。
//   ・近点では n は決まらない(k − n の縮退)—— n = 2 は第95報・AN332 の裁定による選択。届かないものは「この探索範囲では未達 —— 次の見直し」。
//
// 実行(Node だけ・1 プロセス): node tests/exp-w306a-an336.mjs → 正本 tests/out/an336-w306a.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as FS from './lib-w303e-fitstop.mjs';
import * as AP from './lib-w304e-apsis.mjs';
import * as B from './exp-w303b-inertialr2.mjs';
import * as PL from './exp-w299c-planets3d.mjs';
import * as P3 from './lib-w299c-planets3d.mjs';
import * as AN from './lib-w306a-an336.mjs';
import * as CT from './exp-w306a-an336contract.mjs';
import * as LF from './lib-w297b-fit.mjs';
import * as H4C from './lib-w311c-h4carry.mjs';   // 第311便c(AN393 (a)・R228): h/4 の転記の型
import { pinDecl307d, DECL307D_DATA_FILE } from './lib-w308d-pre.mjs';   // 第308便d(AN351・R217): 🌡️ の fitRecord の標的の役割を宣言した世代では、段 G の「本の記録と同じか」を第307便の宣言の写しで照合する(第307便の html では no-op)
const REGEN_SCOPE = {"presets":"all","roots":["$","DT","FIT_COND_KEYS","FIT_COND_VERSION","FIT_KNOB_KEYS","FIT_NUMERICS_KEYS","FIT_RECORD_KEYS","FIT_RECORD_VERSION","FIT_RECORD_VERSIONS","FIT_RESIDUAL_KEYS","FIT_TARGET_KEYS","FIT_TOL_KEYS","HP.DRAG_CORE_RMAX_FACTOR","HP.DRAG_CORE_VERSION","HP.FIT_COND_VERSION","HP.GLOC_VERSION","HP.REL_DRAG_COMPOSE_DEFAULT","HP.REL_DRAG_I2_VERSION","HP.REL_DRAG_INERTIAL_VERSION","HP.REL_DRAG_PAIRNORM_VERSION","HP.REL_DRAG_SOLVE_FROM_DEFAULT","HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.dragCoreState","HP.fitCondSig","HP.gLocPeriAdvance","HP.gLocState","HP.geoEffectiveMode","HP.geoLawOfSim","HP.inertialDragLedgerOf","HP.inertialDragState","HP.inertialR2Q","HP.inertialR2State","HP.sim","HP.synodic","HP.validateFitRecord","HP.validatePreset","HP.wbgEstimateOf","LAWS","T","ab","ch","ctx","cw","dfmGaussLegendre01","dfmInertialDrag3Build","dfmInertialDrag3Solve","dfmInertialDragStep","dfmInertialDragStep3","dragCoreAngular","dragCoreAvgK","dragCoreLookup","dragCoreTableBuild","fmt","inertialDragComposeSolve","inertialDragI2Apply","inertialDragNormApply","inertialDragPairApply","inertialR2PairDen","inertialR2PairTerm","inertialR2SumOf","pnSource","relDragCoefficientOf","relDragPairNormOf","relDragSolveFromOf","synUniform","validateFitRecord"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w306a-an336-1';
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const PARTS = (process.env.W306A_PARTS || 'A,M,T,R,G').split(',');
const clone = (x) => JSON.parse(JSON.stringify(x));
const r7 = (x) => Number(Number(x).toPrecision(7));
export const DECL_FILE = 'tests/data-w306a-decl305.json';
export const PIN = JSON.parse(fs.readFileSync(new URL('./data-w306a-decl305.json', import.meta.url), 'utf8'));
export const MERCURY = B.MERCURY, TRANSFER = B.TRANSFER, PLANETS = [B.MERCURY].concat(B.TRANSFER);
export const DIVS = [1, 2, 4];
export const N_FIT = 8;                   // 水星のフィットの窓(🌡️ の fitRecord と同じ)
export const N_RUN = 17;                  // 移送の走行の長さ(16 公転 + 半公転の位相の窓)
export const APSIS_K = 3;                 // 新しい抽出器の位置の黄経の調和の数(第304便e の既定)
export const NUM_TOL = AN.NUMERIC_TOL.value;
/** 窓(公転の数 N・位相 —— 窓の始まりを平均の周期 × phase だけずらす)。 */
export const WINDOWS = Object.freeze([
  Object.freeze({ key: 'w8p0', N: 8, phase: 0, label: '8 公転・位相 0' }),
  Object.freeze({ key: 'w8p5', N: 8, phase: 0.5, label: '8 公転・位相 半公転' }),
  Object.freeze({ key: 'w16p0', N: 16, phase: 0, label: '16 公転・位相 0' }),
  Object.freeze({ key: 'w16p5', N: 16, phase: 0.5, label: '16 公転・位相 半公転' }),
]);
export const MAIN_WINDOW = 'w8p0';
/** n の族(第95報・AN332 の裁定: n = 2 を先・n = +1 は次点・n = 0 は対照)。 */
export const N_CASES = Object.freeze([
  Object.freeze({ key: 'n2', n: 2, gl: Object.freeze({ law: 'kappaC2' }), x0: 4.99986, x1: 5, label: 'n = 2(G·(c_loc/c₀)² —— law:"kappaC2")' }),
  Object.freeze({ key: 'n1', n: 1, gl: Object.freeze({ law: 'cRatio' }), x0: 3.99986, x1: 4, label: 'n = +1(G·c_loc/c₀ —— law:"cRatio"・対照)' }),
  Object.freeze({ key: 'n0', n: 0, gl: null, x0: 2.99986, x1: 3, label: 'n = 0(G_loc なし —— 対照)' }),
]);
/** 照合規約 43.0 の k(第305便b の正本 tests/out/gfamily-w305b.json の M の行 —— 履歴の列・来歴つき)。 */
export function legacyK() {
  const f = path.join(ROOT, 'tests', 'out', 'gfamily-w305b.json');
  try { const J = JSON.parse(fs.readFileSync(f, 'utf8'));
    return { file: 'tests/out/gfamily-w305b.json', harnessVersion: J.harnessVersion, rows: J.mercury.rows.map((r) => ({ key: r.key, n: r.n, targetKind: r.targetKind, target: r.target, k: r.x, status: r.status })) };
  } catch (e) { return { file: 'tests/out/gfamily-w305b.json', error: String(e && e.message || e).slice(0, 120), rows: [] }; }
}

/* ── 写し(02ca93b の宣言に固定)── */
export const findPreset = (HP, id) => HP.allPresets().find((q) => q.id === id);
export function pinned(HP, id) {
  const p = findPreset(HP, id); if (!p) throw new Error('本が無い: ' + id);
  const d = PIN.decl[id]; if (!d) throw new Error('凍結の写しが無い: ' + id);
  const q = clone(p); q.physics = clone(d.physics); q.bodies = clone(d.bodies); q.scaleExp = clone(d.scaleExp); q.timeRef = clone(d.timeRef);
  delete q.fitRecord; delete q.physics.gLoc;
  return q;
}
/** 宣言する引きずり(本ごとの W_ext・λ ∝ m + 対・自己なし)。k が null なら引きずり OFF。denom を "row" にすると対照(省略 = 行)。 */
export function dragDecl(rd0, wExt, k, denom = 'pair') {
  const rd = { law: 'inertial', Wbg: null, eps: rd0.eps, history: 'positions', pairs: clone(rd0.pairs) };
  if (k === null || k === undefined) { rd.enabled = false; return rd; }
  rd.Wbg = wExt; rd.inertialR2 = { lambdaRs: k, sources: 'all' };
  if (denom === 'pair') rd.inertialR2.denom = 'pair';
  return rd;
}
export function caseOf(base, wExt, c) {
  const q = clone(base);
  q.physics.relativeDrag = dragDecl(base.physics.relativeDrag, wExt, c.k, c.denom);
  if (c.gl) q.physics.gLoc = clone(c.gl); else delete q.physics.gLoc;
  return q;
}
const hOf = (p) => P3.stepsOf(p.timeRef.pRef).h;

/* ── 1 走行(検出器 B と新しい抽出器を同じ走行から・窓ごと)── */
const MEMO = new Map();
export const STATS = { runs: 0, memoHits: 0, stepsTotal: 0 };
/** 窓 [t0, t1] の検出器 B の近点率(近点ごとの方位の時刻への直線 fit —— windowOf と同じ式)と新しい抽出器の近点率 [″/世紀]。 */
function windowRates(R, smp, W, Tsec) {
  const rev = R.ev.rev, N = W.N;
  if (rev.length < N + (W.phase > 0 ? 1 : 0)) return { complete: false };
  const Pm = rev[N - 1] / N, t0 = W.phase * Pm, t1 = (W.phase > 0) ? t0 + rev[N - 1] : rev[N - 1];
  const cent = 36525 * P3.DAY_S / Tsec, pe = R.ev.peri.filter((z) => z.t > t0 && z.t <= t1);
  const detB = pe.length >= 3 ? LF.linfit(pe.map((z) => z.t), LF.unwrap(pe.map((z) => z.ang))).slope * cent * 180 / Math.PI * 3600 : null;   // windowOf と同じ式(lib-w297b-fit)
  const f = AP.apsisRate(smp.samples(), { t0, t1, K: APSIS_K });
  return { complete: true, t0, t1, nPeri: pe.length, detB, apsNew: f ? AP.toArcsecPerCentury(f.rate, Tsec) : null, eNew: f ? f.e : null, rmsNew: f ? f.rms : null, nNew: f ? f.n : null };
}
/** 走行(revMax 公転)。8 公転の窓の検出器 B・周期・離心率は windowOf(🌡️ の fitRecord と同じ抽出器)。 */
export function measure(HP, q, dt, revMax, o = {}) {
  const key = JSON.stringify([q.id, q.physics, q.bodies]) + '|' + dt + '|' + revMax;
  if (!o.noMemo && MEMO.has(key)) { STATS.memoHits++; return MEMO.get(key); }   // o.noMemo: 段 G の門は宣言そのものを走らせ直す(写しの走行を再利用しない)
  STATS.runs++;
  const mu = q.physics.G * (q.bodies[0].m + q.bodies[1].m), Tsec = Math.pow(10, q.scaleExp.T);
  let smp = null, S = null;
  const R = AP.captureSim(HP, (s) => { S = s; smp = AP.attachSampler(s, { ci: 0, oi: 1, mu }); }, () => PL.runPl3(HP, q, { dt, revMax }));
  STATS.stepsTotal += R.steps;
  const w8 = PL.windowOf(R, N_FIT, Tsec), wins = {};
  for (const W of WINDOWS) if (W.N + (W.phase > 0 ? 1 : 0) <= revMax) wins[W.key] = windowRates(R, smp, W, Tsec);
  const gl = S ? HP.gLocState(S) : null, i2 = S ? HP.inertialR2State(S) : null;
  const r = { aps: w8.apsArcsecPerCentury, periodDays: w8.periodDays, ecc: w8.ecc, nPeri: w8.nPeri, complete: w8.complete, steps: R.steps, nan: R.nan, revN: R.ev.rev.length,
    stepsFit: (() => { const t8 = R.ev.rev[N_FIT - 1]; return t8 === undefined ? null : Math.ceil(t8 / dt - 1e-9); })(),
    wins, gLoc: gl ? { psiMax: gl.psiMax, dGMax: gl.dGMax } : null, xiMax: i2 ? i2.xiMax : null };
  if (!o.noMemo) MEMO.set(key, r); else STATS.freshRuns = (STATS.freshRuns || 0) + 1;
  return r;
}

// ==== 第311便c の塊(ここから)====
// 第311便c(決断事項 AN393 (a)・統括の検証項目 R228): **段 T の移送の行の h/4 を転記**(tests/lib-w311c-h4carry.mjs)。行の h と h/2 を先に測り、行の値の鍵
//   (h/4 から作る欄 —— pred・numErr・diff・rel・widthRatio・judge・secondary・spreadNew・spreadB・analyticMinusMeasured・complete・finite・窓の numErrNew・numErrB ——
//   を除き、配列は h と h/2 の 2 つ)が前の正本(書き換える前の W306A_OUT)の同じ本の行とビット同一なら、行を前の正本から写す(違えば h/4 を測る)。
//   本ごとの対照の h/4 は要るときだけ走らせる。段 M(根の行と h/2 の根 —— 門は h/4)は測る。走行の数(stats)と所要は値の鍵ではない。H4_CARRY=0 で全部測る
let CARRY = null;
/** 転記の文脈を差し替える(試験用 —— 器の本走は main が前の正本で開く) */
export function setH4Carry(c) { CARRY = c; CTX.clear(); }
const T_H4_DROP = ['pred', 'numErr', 'diff', 'rel', 'widthRatio', 'judge', 'secondary', 'spreadNew', 'spreadB', 'analyticMinusMeasured', 'complete', 'finite'];
const tRowView = (row) => {
  const v = H4C.omit(row, T_H4_DROP);
  for (const k of ['sidShiftSec', 'periodDays', 'steps']) if (Array.isArray(v[k])) v[k] = v[k].slice(0, 2);
  v.windows = (row.windows || []).map((w) => { const z = H4C.omit(w, ['numErrNew', 'numErrB']); for (const k of ['new', 'detB', 't1', 'nSamples', 'nPeri']) if (Array.isArray(z[k])) z[k] = z[k].slice(0, 2); return z; });
  return v;
};
// ==== 第311便c の塊(ここまで)====
/* ── 本ごとの文脈(写し・刻み・W_ext・参照値・対照)── */
const CTX = new Map();
let RECS = null;
function ctx(HP, id, revMax = N_FIT) {
  const ck = id + '|' + revMax;
  if (CTX.has(ck)) return CTX.get(ck);
  const base = pinned(HP, id), h = hOf(base), we = B.wExtOf(HP, base), Tsec = Math.pow(10, base.scaleExp.T);
  if (!RECS) RECS = AN.readRecords(ROOT);
  const tg = id === MERCURY ? AN.an336Target(ROOT, base, RECS) : AN.targetOfBook(ROOT, base, RECS);
  // 第311便c: h/4 の対照は要るときだけ(読まれた時に走らせる —— 転記した移送の行は読まない)
  const ctl = Object.fromEntries(DIVS.filter((d) => d !== 4).map((d) => [d, measure(HP, caseOf(base, we.book, { k: null, gl: null }), h / d, revMax)]));
  if (DIVS.includes(4)) { let c4 = null; Object.defineProperty(ctl, 4, { enumerable: true, configurable: true, get() { if (c4 === null) c4 = measure(HP, caseOf(base, we.book, { k: null, gl: null }), h / 4, revMax); return c4; } }); }
  const c = { id, emoji: base.emoji || PIN.decl[id].emoji, base, h, wExt: we.book, wExtParts: we, Tsec, tg, ctl, e: tg.pn1.e };
  CTX.set(ck, c);
  return c;
}
/** 一次の解析(固定の初期の接触要素): 引きずり 2πk G(M+m)/(c₀²a(1−e²))・G_loc −2nπ G(M²+m²)/(M+m)/(c₀²a(1−e²)) [″/世紀] */
export function analyticOf(c, k, n) {
  const q = c.base, G = q.physics.G, c0 = q.physics.cLight, M = q.bodies[0].m, m = q.bodies[1].m, f = c.tg.pn1, century = 36525 * 86400 / c.Tsec, ARC = 180 * 3600 / Math.PI;
  const conv = (rad) => rad / f.P * century * ARC, den = c0 * c0 * f.a * (1 - f.e * f.e);
  const drag = conv(2 * Math.PI * k * G * (M + m) / den), gLoc = conv(-2 * n * Math.PI * G * (M * M + m * m) / (M + m) / den);
  return { drag, gLoc, total: drag + gLoc, dragPerK: drag / k };
}

/* ── 段 A ── */
export function partA(HP, log = console.log) {
  const contract = CT.runContract(ROOT);
  if (!RECS) RECS = AN.readRecords(ROOT);
  const targets = PLANETS.map((id) => (id === MERCURY ? AN.an336Target(ROOT, pinned(HP, id), RECS) : AN.targetOfBook(ROOT, pinned(HP, id), RECS)));
  log(`A 契約: 不正な入力 ${contract.cases.filter((c) => c.rejected).length}/${contract.cases.length} を拒否・CSV 不変 ${contract.csvUnchanged}・水星 q⋆ ${contract.mercury.value}(差 ${contract.mercury.diff})`);
  for (const t of targets) log(`A ${t.id}: q⋆ ${t.value}(1PN ${t.pn1.value}${t.a1 ? ' + A1 ' + t.a1.value + '〔' + t.a1.recordId + '・幅 ' + t.sourceWidth + '〕' : '・A1 なし'})`);
  return { contract, targets };
}

/* ── 段 M: 水星の k ── */
function fitK(HP, c, C, target, o = {}) {
  const dA = o.divA || 1, dB = o.divB || 2;
  const mk = (k) => caseOf(c.base, c.wExt, { k, gl: C.gl });
  const y = (k, d) => measure(HP, mk(k), c.h / d, N_FIT).aps - c.ctl[d].aps;
  return FS.fitStopSync({ yH: (k) => y(k, dA), yH2: (k) => y(k, dB), target, tol: NUM_TOL, method: 'secant', x0: C.x0, x1: C.x1, round: r7 });
}
export function mRow(HP, c, C, k) {
  const runs = DIVS.map((d) => measure(HP, caseOf(c.base, c.wExt, { k, gl: C.gl }), c.h / d, N_FIT));
  const glo = C.gl ? DIVS.map((d) => measure(HP, caseOf(c.base, c.wExt, { k: null, gl: C.gl }), c.h / d, N_FIT)) : null;
  const ctl = DIVS.map((d) => c.ctl[d]);
  const diffB = runs.map((r, i) => r.aps - ctl[i].aps), diffNew = runs.map((r, i) => r.wins[MAIN_WINDOW].apsNew - ctl[i].wins[MAIN_WINDOW].apsNew);
  const gLocB = glo ? glo.map((r, i) => r.aps - ctl[i].aps) : DIVS.map(() => 0);
  return { k, n: C.n, key: C.key, diffB, diffNew, gLocB, dragB: diffB.map((x, i) => x - gLocB[i]), periodDays: runs.map((r) => r.periodDays), sidShiftSec: runs.map((r, i) => (r.periodDays - ctl[i].periodDays) * P3.DAY_S),
    ecc: runs.map((r) => r.ecc), stepsH: runs[0].steps, nan: runs.some((r) => r.nan || !r.complete), numErrB: Math.abs(diffB[2] - diffB[1]), numErrNew: Math.abs(diffNew[2] - diffNew[1]), xiMax: runs[0].xiMax,
    psiMax: runs[0].gLoc ? runs[0].gLoc.psiMax : null };
}
export function partM(HP, log = console.log) {
  const c = ctx(HP, MERCURY), q = c.tg.value, rows = [];
  for (const C of N_CASES) {
    const fit = fitK(HP, c, C, q);
    const row = { key: C.key, n: C.n, gl: C.gl, label: C.label, target: q, x0: C.x0, x1: C.x1, status: fit.status, evals: fit.evals, rootStop: fit.root.stop, iters: fit.root.iters, x: fit.x, final: fit.final };
    if (fit.x !== null) Object.assign(row, mRow(HP, c, C, fit.x), { analytic: analyticOf(c, fit.x, C.n) });
    row.gate = fit.final ? fit.final.gate : false;
    rows.push(row);
    log(`M ${C.key}(標的 q⋆ ${q}): k ${fit.x}(${fit.status}・評価 ${fit.evals})・差 h/h2/h4 ${row.diffB ? row.diffB.map((x) => x.toFixed(6)).join(' / ') : '—'}・G_loc ${row.gLocB ? row.gLocB[2].toFixed(4) : '—'}・門 ${row.gate}`);
  }
  // n = 2 の根を h/2 で取り直す(門は h/4)
  const C2 = N_CASES[0], f2 = fitK(HP, c, C2, q, { divA: 2, divB: 4 });
  const h2root = { key: 'n2', x: f2.x, status: f2.status, final: f2.final, evals: f2.evals, diffToMain: f2.x === null ? null : f2.x - rows[0].x };
  log(`M n2 の根を h/2 で(門 h/4): k ${f2.x}(${f2.status})・主の根との差 ${h2root.diffToMain}`);
  const legacy = legacyK();
  return { target: c.tg, rows, h2root, legacy, mercury: { h: c.h, wExt: c.wExt, wExtParts: c.wExtParts, rsBook: B.rsBook(c.base), ctl: DIVS.map((d) => ({ div: d, aps: c.ctl[d].aps, periodDays: c.ctl[d].periodDays, ecc: c.ctl[d].ecc })) } };
}

/* ── 段 T: 移送(同じ k・n = 2)── */
const XLAB = { new: '新しい抽出器', detB: '検出器 B' };
export function judgeOf(diff, width, numErr) {
  const ad = Math.abs(diff);
  if (width === null || width === undefined) return { kind: 'noWidth', ratio: null, text: '幅なし(A1 の行なし —— 1PN の式だけ)・差は数値の帯の ' + (numErr > 0 ? (ad / numErr).toPrecision(3) : '—') + ' 倍' };
  if (numErr !== null && width < numErr) return { kind: 'numeric', ratio: ad / width, text: '数値の帯 > 原資料の幅(幅との比は数値の精度の外 —— 差は数値の帯の ' + (ad / numErr).toPrecision(3) + ' 倍)' };
  return { kind: 'width', ratio: ad / width, text: '差は原資料の幅の ' + (ad / width).toPrecision(3) + ' 倍' };
}
export function partT(HP, M, log = console.log) {
  const k = M.rows.find((r) => r.key === 'n2').x, C = N_CASES[0], table = [];
  if (k === null) return { k: null, table, note: 'n = 2 の k が未達 —— 移送しない' };
  for (const id of PLANETS) {
    const c = ctx(HP, id, N_RUN), T = c.tg, an = analyticOf(c, k, C.n);
    // 第311便c(AN393 (a)): h と h/2 を先に測り、行の値の鍵が前の正本の同じ本の行と同じなら行を写す(rowOf は同じ式 —— 2 刻みの行は比べるためだけに作る)
    const runs2 = DIVS.filter((d) => d !== 4).map((d) => measure(HP, caseOf(c.base, c.wExt, { k, gl: C.gl }), c.h / d, N_RUN));
    if (DIVS.includes(4)) {
      const pr = CARRY && CARRY.prev && CARRY.prev.transfer ? (CARRY.prev.transfer.table || []).find((z) => z.id === id) : null;
      const ck = 'T:' + id;
      if (CARRY && pr && Array.isArray(pr.periodDays) && pr.periodDays.length === 3 && H4C.canCarry(CARRY, ck, tRowView(rowOf(runs2, [1, 2].map((d) => c.ctl[d]))), tRowView(pr))) {
        const row = JSON.parse(JSON.stringify(pr)); table.push(row); H4C.markCarried(CARRY, ck);
        log(`T ${c.emoji}: 転記(h と h/2 の行が前の正本とビット同一)—— 予言 ${row.pred.toPrecision(8)}`);
        continue;
      }
      if (CARRY) { if (!pr) H4C.canCarry(CARRY, ck, null, undefined); H4C.markMeasured(CARRY, ck); }
    }
    const runs = DIVS.includes(4) ? runs2.concat([measure(HP, caseOf(c.base, c.wExt, { k, gl: C.gl }), c.h / 4, N_RUN)]) : runs2;
    const ctl = DIVS.map((d) => c.ctl[d]);
    const row = rowOf(runs, ctl);
    table.push(row);
    log(`T ${c.emoji}: 予言 ${row.pred.toPrecision(8)}(新・±${row.numErr.toExponential(1)})・参照値 ${T.value.toPrecision(8)}${T.sourceWidth ? '(幅 ' + T.sourceWidth + ')' : '(幅なし)'}・${row.judge.text}`);
    continue;
    function rowOf(runs, ctl) {
    const wtab = WINDOWS.map((W) => {
      const det = runs.map((r, i) => (r.wins[W.key] && ctl[i].wins[W.key] && r.wins[W.key].detB !== null && ctl[i].wins[W.key].detB !== null) ? r.wins[W.key].detB - ctl[i].wins[W.key].detB : null);
      const nw = runs.map((r, i) => (r.wins[W.key] && ctl[i].wins[W.key] && r.wins[W.key].apsNew !== null) ? r.wins[W.key].apsNew - ctl[i].wins[W.key].apsNew : null);
      const ne = (a) => (a[2] === null || a[1] === null) ? null : Math.abs(a[2] - a[1]);
      return { key: W.key, N: W.N, phase: W.phase, label: W.label, new: nw, detB: det, numErrNew: ne(nw), numErrB: ne(det), t1: runs.map((r) => r.wins[W.key] ? r.wins[W.key].t1 : null),
        nSamples: runs.map((r) => r.wins[W.key] ? r.wins[W.key].nNew : null), nPeri: runs.map((r) => r.wins[W.key] ? r.wins[W.key].nPeri : null) };
    });
    const main = wtab.find((w) => w.key === MAIN_WINDOW), pred = main.new[2], numErr = main.numErrNew, diff = pred - T.value;
    const predB = main.detB[2], numErrB = main.numErrB;
    const spreadNew = (() => { const v = wtab.map((w) => w.new[2]).filter((x) => x !== null); return Math.max(...v) - Math.min(...v); })();
    const spreadB = (() => { const v = wtab.map((w) => w.detB[2]).filter((x) => x !== null); return v.length ? Math.max(...v) - Math.min(...v) : null; })();
    const row = { id, emoji: c.emoji, e: c.e, h: c.h, wExt: c.wExt, target: { value: T.value, pn1: T.pn1.value, a1: T.a1 ? T.a1.value : null, recordId: T.a1 ? T.a1.recordId : null, sourceWidth: T.sourceWidth },
      k, primary: 'new', pred, numErr, diff, rel: diff / T.value, widthRatio: T.sourceWidth ? diff / T.sourceWidth : null, judge: judgeOf(diff, T.sourceWidth, numErr),
      secondary: { extractor: 'detB', pred: predB, numErr: numErrB, diff: predB - T.value, widthRatio: T.sourceWidth ? (predB - T.value) / T.sourceWidth : null, judge: judgeOf(predB - T.value, T.sourceWidth, numErrB) },
      windows: wtab, spreadNew, spreadB, analytic: an, analyticMinusMeasured: pred - an.total,
      sidShiftSec: runs.map((r, i) => (r.periodDays - ctl[i].periodDays) * P3.DAY_S), periodDays: runs.map((r) => r.periodDays),
      complete: runs.every((r) => r.revN >= N_RUN && r.complete && !r.nan) && ctl.every((r) => r.revN >= N_RUN && r.complete && !r.nan),
      finite: runs.every((r) => Object.values(r.wins).every((w) => w.complete && Number.isFinite(w.apsNew))), steps: runs.map((r) => r.steps) };
    return row;
    }
  }
  // A1 の幅からの δk の感度の見積り(誤差の伝播ではない —— 惑星間の相関があるので独立な 1σ として二乗和にしない)
  const mer = table.find((t) => t.id === MERCURY), Mr = M.rows.find((r) => r.key === 'n2');
  const dqdk = Mr.analytic.dragPerK, dk = AN.MERCURY_CONTRACT.sourceWidth / dqdk;
  const sens = { mercuryWidth: AN.MERCURY_CONTRACT.sourceWidth, dqdkAnalytic: dqdk, dk, perBook: table.map((t) => ({ id: t.id, emoji: t.emoji, dPred: dk * t.analytic.dragPerK, dPredOverWidth: t.target.sourceWidth ? dk * t.analytic.dragPerK / t.target.sourceWidth : null })),
    note: '感度の見積り(一次の解析の dq/dk —— 水星の原資料の幅 0.003″/世紀を k に写した δk の各本の予言への効き)。誤差の伝播ではない —— 惑星間の相関があるので独立な 1σ として二乗和にしない' };
  log(`T 感度: dq/dk(水星・解析)${dqdk.toFixed(5)}・δk ${dk.toExponential(3)}・🔴 への効き ${sens.perBook.find((z) => z.id === 'marsSunInertial3d').dPred.toExponential(2)}`);
  return { k, n: 2, table, sensitivity: sens, windows: WINDOWS, K: APSIS_K, mainWindow: MAIN_WINDOW, mercuryMainSame: !!mer && mer.windows.find((w) => w.key === MAIN_WINDOW).detB.every((x, i) => x === Mr.diffB[i]),
    note: '差 = 写し − 対照(引きずり OFF・G_loc なし —— 同じ刻み・同じ初期状態)。主は新しい抽出器(離心ベクトルの調和の回帰 K=3)・検出器 B を併記。数値の帯 = |h/2 − h/4|(回帰の標準誤差で置き換えない)。窓/位相の幅 = 4 つの窓の h/4 の予言の最大 − 最小' };
}

/* ── 段 R: 二体で対 = 行 ── */
const fpS = (S) => { let h = 0x811c9dc5; const f = new Float64Array(1), u8 = new Uint8Array(f.buffer);
  for (const k of ['x', 'y', 'z', 'vx', 'vy', 'vz']) { const A = S[k]; if (!A) continue; for (let i = 0; i < S.n; i++) { f[0] = A[i]; for (let j = 0; j < 8; j++) h = Math.imul(h ^ u8[j], 0x01000193) >>> 0; } }
  return h.toString(16); };
export function partR(HP, M, log = console.log) {
  const k = M.rows.find((r) => r.key === 'n2').x, c = ctx(HP, MERCURY), steps = 2000;
  const run = (denom) => { const q = caseOf(c.base, c.wExt, { k, gl: N_CASES[0].gl, denom }); const v = HP.validatePreset(clone(q)); if (!v.ok) throw new Error('受理されない ' + JSON.stringify(v.errors).slice(0, 200));
    const S = HP.coord3d.makeSim(); S.build(clone(v.preset)); for (let i = 0; i < steps; i++) S.step(c.h); return { fp: fpS(S), x: Array.from(S.x), vx: Array.from(S.vx), pairNorm: (HP.inertialDragState(S) || {}).pairNorm || null }; };
  const P = run('pair'), Rw = run('row');
  const same = P.fp === Rw.fp && P.x.every((v, i) => Object.is(v, Rw.x[i])) && P.vx.every((v, i) => Object.is(v, Rw.vx[i]));
  log(`R 二体の対と行: ${steps} 步の全状態の指紋 ${P.fp} / ${Rw.fp}・ビット同一 ${same}`);
  return { steps, dt: c.h, fpPair: P.fp, fpRow: Rw.fp, bitSame: same, pairNorm: P.pairNorm };
}

/* ── 宣言の写し(段 C で html に書く —— 段 G が html から読み直して照合)── */
export const DECL_NOTE_W306A = '第306便a(原仮定者の裁定〔第97報〕AN336・R204)';
export function physicsDecl(HP, id, k) {
  const c = ctx(HP, id), q = caseOf(c.base, c.wExt, { k, gl: N_CASES[0].gl });
  return q.physics;
}
const fmtQ = (x) => Number(x).toFixed(5);
export function recMer306(HP, M, live) {
  const c = ctx(HP, MERCURY), R = M.rows.find((r) => r.key === 'n2'), T = c.tg, ex = 'tests/exp-w299c-planets3d.mjs runPl3(' + PL.EXTRACTOR_VERSION + ')';
  const old = PIN.decl[MERCURY].fitRecord, obsD = P3.planetOf('mercury').period.s / P3.DAY_S, hh = c.h;
  const tolAps = { value: NUM_TOL, kind: 'declared', note: '数値フィットの停止許容の宣言 0.0009″/世紀 —— 旧い宣言の照合許容を数値の許容として継承した(A1 の幅でも和の統計誤差でもない)。標的は派生した参照値で σ を持たない(sigma null・原資料の幅 sourceWidth 0.003 は 68% の 1σ の定義が未確認)' };
  const src = '派生した参照値 q⋆ = q_1PN + A1 = ' + T.pn1.value + ' − 0.002 = ' + T.value + '″/世紀(原仮定者の裁定〔第97報〕AN336 —— 独立に観測された総量ではない・calibrationEligible false)。q_1PN は初期の接触要素 a₀・e₀・ケプラー周期の二体の 1PN の式・A1 は EPM2011 の近日点の追加の歳差(候補の行 A1-EPM2011・原資料の幅 0.003・sigma null —— 来歴〔記録 ID・入力 CSV の sha256・式の版・G・c₀・質量・単位〕は正本 tests/out/an336-w306a.json)。照合規約 43.0″/世紀は履歴の列。Park 2017 の 42.9799±0.0009 とは同一視しない';
  const targets = [
    { q: old.targets[0].q, obs: T.value, unit: '″/世紀', source: src.slice(0, 600), window: old.targets[0].window, tol: tolAps, extractor: old.targets[0].extractor,
      model: R.diffB[0], residual: R.diffB[0] - T.value, rel: (R.diffB[0] - T.value) / T.value, numerics: { h2: Math.abs(R.diffB[1] - R.diffB[0]), dtHalf: hh / 2 } },
    { q: old.targets[1].q, obs: obsD, unit: 'd', source: old.targets[1].source, window: old.targets[1].window, tol: clone(old.targets[1].tol), extractor: old.targets[1].extractor,
      model: R.periodDays[0], residual: R.periodDays[0] - obsD, rel: (R.periodDays[0] - obsD) / obsD, numerics: { h2: Math.abs(R.periodDays[1] - R.periodDays[0]), dtHalf: hh / 2 } }];
  const gateOk = targets.every((t) => Math.abs(t.residual) + t.numerics.h2 <= t.tol.value);
  const legacyRow = (M.legacy.rows || []).find((r) => r.key === 'n2' && r.targetKind === 'conv');
  const rec = { version: 'w298b-1', parent: old.parent,
    law: 'inertial-drag(三次元 —— physics.coord:"3d"・並進だけ)・λ ∝ m の inertialR2 {lambdaRs:k, sources:"all", denom:"pair"}(対ごとの正規化 —— 二体では行と同じ)・W_bg = W_ext・局所重力 G_loc n = 2(gLoc kappaC2 —— 第95報・AN332 の裁定による選択)・自己の項なし・λ_PN=0・積分器 semic(' + DECL_NOTE_W306A + ' の再フィット w306a-1)',
    targets, knobs: [{ key: 'physics.relativeDrag.inertialR2.lambdaRs', range: [0.5, 50], final: R.x }],
    fixed: [old.fixed[0], old.fixed[1],
      'geoPN=3・kFrame=0・λ_PN=0・積分器 semi(引きずりの步は semic)・重力の軟化 0.05・核の ε 0.05・pairs "all"・stateCarry "double"・W_bg = W_ext ' + c.wExt + '(W_cos + W_gal —— 第302便c の推定の値・太陽を含めない・合わせていない)・自己の項(self・dragCore・shellSelf)なし',
      '7 本(🌡️🌋🔴🏀🟡🔷💙)は同じ k を一括で宣言(水星のフィットの値 —— 他の 6 本は移送の記録で、惑星ごとに合わせ直していない)',
      '履歴の列(第306便a で退いた標的と模型): 照合規約 43.0″/世紀(n = 2 の k ' + (legacyRow ? legacyRow.k : '5.001362') + ' —— 第305便b の写し)・第303便a の W_bg 221.1204 で模型 43.00002(G_loc なし・旧 cond.sig ' + old.cond.sig + ')'],
    procedure: DECL_NOTE_W306A + ': 引きずり OFF・G_loc なしの対照との近点率の差(8 公転・semic・検出器 B)を派生した参照値 q⋆ に割線で合わせ(lib-w303e-fitstop —— x0 4.99986・x1 5・停止は許容の 1/10)、k を 7 桁に丸めて h と h/2 で測り直した(|残差| + |h − h/2| ≤ 0.0009 なら fitted —— 参照値と宣言の許容に対する数値フィットで、観測の較正の合格とは別)。器 tests/exp-w306a-an336.mjs',
    dt: hh, steps: R.stepsH, status: gateOk ? 'fitted' : 'not-identifiable',
    notFitted: ['恒星周期は合わせていない(近似要素の種の周期 —— 照合だけ)', '離心率・軌道傾斜は近似要素の種のまま(合わせていない)', '機構(1PN の近日点前進の機構の同定ではない)', 'n(近点では k − n が縮退 —— n = 2 は裁定による選択で、近点では決まらない)'],
    cond: { version: HP.FIT_COND_VERSION, sig: '', extractor: ex } };
  // 条件の署名(宣言の写しに当てる —— live が渡されれば html の宣言そのものに当てる)
  const p = clone(live || ctx(HP, MERCURY).base); if (!live) { p.physics = physicsDecl(HP, MERCURY, R.x); }
  p.fitRecord = rec; const v = HP.validatePreset(clone(p));
  rec.cond.sig = v.ok ? HP.fitCondSig(v.preset, rec) : '';
  const vr = HP.validateFitRecord(clone(rec));
  return { rec, accepted: !!vr.ok, err: vr.ok ? null : vr.err, gateOk };
}
export function declarationOf(HP, M) {
  const k = M.rows.find((r) => r.key === 'n2').x;
  if (k === null) return null;
  const books = PLANETS.map((id) => ({ id, emoji: ctx(HP, id).emoji, physics: physicsDecl(HP, id, k), wExt: ctx(HP, id).wExt }));
  const fr = recMer306(HP, M, null);
  return { k, books, fitRecord: fr.rec, fitRecordAccepted: fr.accepted, fitRecordErr: fr.err, fitRecordGate: fr.gateOk };
}

/* ── 段 G: 門(html に書いた宣言そのもの)── */
export function liveGen(HP) {
  return Object.fromEntries(PLANETS.map((id) => { const p = findPreset(HP, id), rd = p && p.physics && p.physics.relativeDrag;
    return [id, !!(rd && rd.inertialR2 && rd.inertialR2.denom === 'pair' && p.physics.gLoc && p.physics.gLoc.law === 'kappaC2')]; }));
}
export function partG(HP, M, T, D, log = console.log) {
  const out = { gen: liveGen(HP) }, mr = M.rows.find((r) => r.key === 'n2');
  out.G1 = { k: mr.x, status: mr.status, residual: mr.final ? mr.final.residual : null, h2: mr.final ? mr.final.h2 : null, sum: mr.final ? mr.final.sum : null, pass: mr.status === 'fitted' && !!mr.final && mr.final.sum <= NUM_TOL };
  out.G3 = { pass: !!T && T.table.length === PLANETS.length && T.table.every((t) => t.complete && t.finite), rows: T ? T.table.map((t) => ({ id: t.id, complete: t.complete, finite: t.finite, steps: t.steps })) : [] };
  const declared = Object.values(out.gen).every(Boolean);
  out.declared = declared;
  if (!declared) { out.G2 = { pass: null, note: '在位の 7 本はまだ宣言されていない(宣言前の html)—— 宣言の写しは declaration' }; log('G 宣言前の html —— G2 は宣言の後に'); return out; }
  // 宣言そのもの(physics)が宣言の写しと同じか・走らせた値が段 T の写しの値とビット同一か(h —— 8 公転の窓は段 M・T の同じ刻みの走行と比べる)
  const rows = PLANETS.map((id) => {
    const p = clone(findPreset(HP, id)), d = D.books.find((b) => b.id === id), c = ctx(HP, id, N_RUN);
    const v = HP.validatePreset(clone(p)), vd = HP.validatePreset(Object.assign(clone(p), { physics: clone(d.physics) }));
    const physSame = v.ok && vd.ok && JSON.stringify(v.preset.physics) === JSON.stringify(vd.preset.physics) && JSON.stringify(v.preset.bodies) === JSON.stringify(vd.preset.bodies);
    delete p.fitRecord;
    const r = measure(HP, p, c.h, N_RUN, { noMemo: true }), t = T.table.find((z) => z.id === id), ctl = c.ctl[1];   // 走らせ直す(写しの走行の記憶を使わない)
    const detB = r.wins[MAIN_WINDOW].detB - ctl.wins[MAIN_WINDOW].detB, nw = r.wins[MAIN_WINDOW].apsNew - ctl.wins[MAIN_WINDOW].apsNew;
    const w = t.windows.find((z) => z.key === MAIN_WINDOW);
    const bit = Object.is(detB, w.detB[0]) && Object.is(nw, w.new[0]) && Object.is(r.periodDays, t.periodDays[0]);
    return { id, physSame, fresh: true, steps: r.steps, detB, apsNew: nw, copyDetB: w.detB[0], copyNew: w.new[0], bitSame: bit, absDiff: Math.max(Math.abs(detB - w.detB[0]), Math.abs(nw - w.new[0])), nan: r.nan };
  });
  out.G2 = { pass: rows.every((z) => z.physSame && z.bitSame && !z.nan), rows };
  // 🌡️ の fitRecord(html)が宣言の写しの記録と同じか・受理・条件の署名が html の宣言で一致
  const pm = findPreset(HP, MERCURY), fr = pm.fitRecord, regen = recMer306(HP, M, pm);
  out.fitRecord = { present: !!fr, accepted: !!(fr && HP.validateFitRecord(clone(fr)).ok), sigHtml: fr && fr.cond ? fr.cond.sig : null, sigRegen: regen.rec.cond.sig,
    same: !!fr && JSON.stringify(fr) === JSON.stringify(regen.rec), status: fr ? fr.status : null };
  out.fitRecord.pass = out.fitRecord.present && out.fitRecord.accepted && out.fitRecord.same && out.fitRecord.sigHtml === out.fitRecord.sigRegen;
  log(`G2 宣言の 7 本: physics 同一 ${rows.filter((z) => z.physSame).length}/7・走行のビット同一 ${rows.filter((z) => z.bitSame).length}/7・fitRecord 同一 ${out.fitRecord.same}・署名 ${out.fitRecord.sigHtml}`);
  return out;
}

/* ── 文書の表(PHYSICS〔第306便a〕に貼る表と QA docs.an336_306 が照合する数 —— 同じ関数)── */
export const fmtK = (x) => String(x);
export const fmtP = (x, d = 7) => (x === null || x === undefined) ? '—' : Number(x).toPrecision(d);
export const fmtE = (x, d = 2) => (x === null || x === undefined) ? '—' : Number(x).toExponential(d);
export const cellSafe = (t) => String(t).replace(/\|/g, '\\|');
const NLAB = { n2: 'n = 2(kappaC2)', n1: 'n = +1(cRatio)', n0: 'n = 0(なし)' };
export function physicsTables(J) {
  const out = [], M = J.mercury;
  out.push('| n | 照合規約 43.0 の k(第305便b —— 履歴の列) | 1PN + A1 の参照値 q⋆ の k(本便 —— h/h2 の根) | 差 h / h/2 / h/4 [″/世紀] | 門(残差の絶対値 + h と h/2 の差 ≤ 0.0009) | G_loc だけ h/4 [″/世紀] | 引きずりの分 h/4 |', '|---|---|---|---|---|---|---|');
  for (const r of M.rows) {
    const lg = (M.legacy.rows || []).find((z) => z.key === r.key && z.targetKind === 'conv');
    if (r.x === null) { out.push(`| ${NLAB[r.key]} | ${lg ? fmtK(lg.k) : '—'} | この探索範囲では未達 | — | 偽 | — | — |`); continue; }
    out.push(`| ${NLAB[r.key]} | ${lg ? fmtK(lg.k) : '—'} | ${fmtK(r.x)} | ${r.diffB.map((x) => x.toFixed(6)).join(' / ')} | ${r.gate ? '真' : '偽'}(${fmtE(r.final.sum, 2)}) | ${r.gLocB[2].toFixed(4)} | ${r.dragB[2].toFixed(4)} |`);
  }
  out.push('');
  out.push(`n = 2 の根を h/2 で取り直す(門は h/4): k ${fmtK(M.h2root.x)}(${M.h2root.status})・h の根との差 ${fmtE(M.h2root.diffToMain, 1)}`);
  out.push('');
  const T = J.transfer;
  out.push('| 本(e) | 参照値 q⋆ [″/世紀](1PN + A1・記録) | 原資料の幅 | 予言(新しい抽出器・h/4・8 公転・位相 0) | 数値の帯 | 差 | 判定(原資料の幅の倍) | 検出器 B の予言(数値の帯) | 検出器 B の判定 | 窓/位相の幅(新) |', '|---|---|---|---|---|---|---|---|---|---|');
  for (const t of T.table) out.push(`| ${t.emoji}(${t.e.toFixed(4)}) | ${fmtP(t.target.value)}(${fmtP(t.target.pn1)}${t.target.a1 === null ? '・A1 なし' : (t.target.a1 < 0 ? ' − ' + Math.abs(t.target.a1) : ' + ' + t.target.a1) + '・' + t.target.recordId}) | ${t.target.sourceWidth === null ? '—' : t.target.sourceWidth} | ${fmtP(t.pred)} | ±${fmtE(t.numErr, 1)} | ${fmtE(t.diff, 2)} | ${cellSafe(t.judge.text)} | ${fmtP(t.secondary.pred)}(±${fmtE(t.secondary.numErr, 1)}) | ${cellSafe(t.secondary.judge.text)} | ${fmtE(t.spreadNew, 1)} |`);
  out.push('');
  out.push('| 本 | 窓・位相 | 新しい抽出器 h / h/2 / h/4 [″/世紀] | 数値の帯(新) | 検出器 B h / h/2 / h/4 | 数値の帯(B) |', '|---|---|---|---|---|---|');
  for (const t of T.table) for (const w of t.windows) out.push(`| ${t.emoji} | ${w.label} | ${w.new.map((x) => fmtP(x)).join(' / ')} | ${fmtE(w.numErrNew, 1)} | ${w.detB.map((x) => fmtP(x)).join(' / ')} | ${fmtE(w.numErrB, 1)} |`);
  out.push('');
  const S = T.sensitivity;
  out.push('| 本 | δk の効き [″/世紀](感度の見積り —— 誤差の伝播ではない) | 原資料の幅に対する比 |', '|---|---|---|');
  for (const z of S.perBook) out.push(`| ${z.emoji} | ${fmtE(z.dPred, 2)} | ${z.dPredOverWidth === null ? '—' : z.dPredOverWidth.toFixed(3)} |`);
  return out.join('\n');
}
/** QA docs.an336_306 が PHYSICS〔第306便a〕の中に探す数の文字列。 */
export function docNumbers(J) {
  const out = [];
  for (const r of J.mercury.rows) if (r.x !== null) out.push(fmtK(r.x));
  for (const t of J.transfer.table) out.push(fmtP(t.pred), fmtP(t.target.value));
  return [...new Set(out)];
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) {
  const t0 = Date.now();
  const OUT_PATH = process.env.W306A_OUT || path.join(ROOT, 'tests', 'out', 'an336-w306a.json');
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
  CARRY = H4C.openCarry(OUT_PATH, { harnessVersion: HARNESS_VERSION });   // 第311便c: h/4 の転記(前の正本 —— 書き換える前に開く)
  pinDecl307d(null, [MERCURY]);   // 第308便d: 🌡️ の fitRecord を第307便の宣言へ(標的の役割を外す —— 数・署名・門は同じ)
  const out = { meta: null, harnessVersion: HARNESS_VERSION, libVersion: AN.LIB_VERSION, contractVersion: CT.HARNESS_VERSION, gLocVersion: HP.GLOC_VERSION, i2Version: HP.REL_DRAG_I2_VERSION,
    pairNormVersion: HP.REL_DRAG_PAIRNORM_VERSION || null, apsisVersion: AP.APSIS_VERSION, fitstopVersion: FS.FITSTOP_VERSION, parts: PARTS, pin: { file: DECL_FILE, version: PIN.version, base: PIN.base } };
  const tp = {};
  const timed = (k, f) => { const t = Date.now(); const r = f(); tp[k] = { wallSec: (Date.now() - t) / 1000 }; console.log(`[${k}] ${tp[k].wallSec.toFixed(1)} s`); return r; };
  if (PARTS.includes('A')) out.an336 = timed('A', () => partA(HP));
  if (PARTS.includes('M')) out.mercury = timed('M', () => partM(HP));
  if (PARTS.includes('T') && out.mercury) out.transfer = timed('T', () => partT(HP, out.mercury));
  if (PARTS.includes('R') && out.mercury) out.pairRow = timed('R', () => partR(HP, out.mercury));
  if (out.mercury) out.declaration = declarationOf(HP, out.mercury);
  if (PARTS.includes('G') && out.mercury && out.declaration) out.gate = timed('G', () => partG(HP, out.mercury, out.transfer, out.declaration));
  const gates = {};
  if (out.an336) { gates.contract = out.an336.contract.ok === true; gates.targets = out.an336.targets.length === 7 && Math.abs(out.an336.targets[0].value - AN.MERCURY_CONTRACT.expected) <= 1e-12; }
  if (out.mercury) { gates.mercuryFits = out.mercury.rows.every((r) => r.status === 'fitted' && r.gate === true && !r.nan); gates.h2root = out.mercury.h2root.status === 'fitted'; }
  if (out.transfer) { gates.transferMeasured = out.transfer.table.length === 7 && out.transfer.table.every((t) => Number.isFinite(t.pred) && Number.isFinite(t.numErr)); gates.mercuryMainSame = out.transfer.mercuryMainSame === true; }
  if (out.pairRow) gates.pairRowBitSame = out.pairRow.bitSame === true;
  if (out.declaration) gates.fitRecordAccepted = out.declaration.fitRecordAccepted === true && out.declaration.fitRecordGate === true;
  if (out.gate) { gates.G1 = out.gate.G1.pass === true; gates.G3 = out.gate.G3.pass === true; if (out.gate.declared) { gates.G2 = out.gate.G2.pass === true; gates.fitRecordLive = out.gate.fitRecord.pass === true; } }
  out.gates = gates; out.ok = Object.values(gates).every(Boolean); out.timing = tp; out.stats = STATS;
  const h4c = H4C.carryStamp(CARRY, { unit: '段 T の移送の行(T:<本>)',
    valueKeys: '行の欄から h/4 で作る欄(pred・numErr・diff・rel・widthRatio・judge・secondary・spreadNew・spreadB・analyticMinusMeasured・complete・finite・窓の numErrNew・numErrB)を除き、配列は h と h/2(走行の数 stats と所要は値の鍵ではない)' });
  if (h4c) out.h4Carried = h4c;
  const CODE = ['tests/exp-w306a-an336.mjs', 'tests/lib-w306a-an336.mjs', 'tests/lib-w308d-pre.mjs', 'tests/exp-w306a-an336contract.mjs', 'tests/lib-w304e-apsis.mjs', 'tests/lib-w303e-fitstop.mjs', 'tests/exp-w303b-inertialr2.mjs', 'tests/lib-w297b-fit.mjs',
    'tests/exp-w299c-planets3d.mjs', 'tests/lib-w299c-planets3d.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs', 'tests/lib-w311c-h4carry.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第306便a', target: TARGET, code: CODE, inputs: [TARGET, DECL_FILE, AN.CANDIDATE_FILE, AN.AUDIT_FILE, 'tests/out/gfamily-w305b.json', DECL307D_DATA_FILE] }), {
    harnessVersion: HARNESS_VERSION, loadErrors: errors.length,
    ruling: '原仮定者の裁定〔第97報〕AN336「水星の標的を 1PN + A1 に替える」(派生した参照値 —— sigma null・原資料の幅は未確認・停止許容 0.0009 は宣言・43.0 は履歴の列)・第95報・AN332 の裁定(n = 2 を先・n = +1 は次点・n = 0 は対照・近点では n は決まらない)',
    reading: '統括の検証項目 R204(標的の生成器と契約・水星の再フィット・7 本への移送〔新しい抽出器が主 + 検出器 B・窓/位相/h〕・門を通れば在位の惑星 7 本の宣言を同じ k で一括)・決断事項 AN330・AN331・AN334',
    notClaim: ['43″ が出た', 'GR と一致した', 'GR を導いた', 'n が決まった', '移送が通った', '全惑星が 1σ の内', '観測の 1σ で較正済み', '法則を発見した'] });
  out.elapsedS = (Date.now() - t0) / 1000;
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 1) + '\n');
  console.log('gates ' + JSON.stringify(gates));
  console.log('→ ' + path.relative(ROOT, OUT_PATH) + '(' + out.elapsedS.toFixed(1) + ' s)・ok ' + out.ok);
  process.exit(out.ok ? 0 : 1);
}
