// 第305便b(第95報・AN332 の裁定〔読み (ii) n = 2 を先・読み (i) n = +1 は次点・n = 0 は対照〕・決断事項 AN331・AN330・統括の検証項目 R200)——
// **惑星の G_loc の n の族 × λ ∝ m の写し**: 水星の k・6 本への移送(新しい抽出器 + 検出器 B)・恒星周期と近点周期の表・🟫(二次元)の扱いの得失
// (Node だけ —— 対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、アプリの三次元の步〔semic・dfmInertialDragStep3・
// dfmCore3 の gLocKick3〕と二次元の步〔S._core〕をそのまま走らせる・1 プロセス)。
//
// ■ 何を写したか(在位の本の宣言・html・エンジンの式は変えない —— 器の中の写し)
//   ・本の写し: 在位の惑星 7 本(🌡️🌋🔴🏀🟡🔷💙)と 🟫 の physics・bodies・scaleExp・timeRef は**基点 bdb7ae5 の宣言**(凍結のデータ
//     tests/data-w305b-declbdb.json)に器の中で固定する(後の枝が宣言を変えても本器の数は動かない —— 生きている html と同じかは pin.liveSame に記録)。
//     fitRecord と gLoc は外す。惑星の本は二体(太陽 + 惑星)—— 外部の源が 1 つなので、行の和と対ごとの正規化は同じ式(本器は今のエンジンの行の和で測る)。
//   ・引きずり: W_bg = W_ext(W_cos + W_gal —— 第302便c の推定・太陽を含めない)・inertialR2:{lambdaRs:k, sources:"all"}(λ ∝ m —— w_I = c₀²/(2kG(r²+ε²))・
//     源の質量によらない)。G_loc: n = 2 は gLoc:{law:"kappaC2"}・n = +1 は gLoc:{law:"cRatio"}・n = 0 は宣言なし(G_loc = G·(c_loc/c₀)^n・
//     c_loc = c₀·e^(−2ψ)・ψ = Σ G m_j/(c₀² r) —— 背景に対する比・力は受け手の慣性速度 v のキックだけ)。
//   ・対照は引きずり OFF・G_loc なし(在位の 🌋〜💙 の宣言と同じ {Wbg:null, enabled:false})。差 = 写し − 対照(同じ刻み・同じ初期状態)。
//
// ■ 段(正本 tests/out/gfamily-w305b.json —— 段 gfamily-305b)。W305B_PARTS=Z,M,T,P,S,D で段を選ぶ(正本は全段)・W305B_OUT で出力先
//   Z 写しの記録(pin.liveSame)・新しい抽出器の自己試験・G_loc だけの近点(水星の写し)と一次の解析 −2nπμ_eff/(c₀²a(1−e²))の照合
//   M 水星(🌡️ の写し・8 公転・検出器 B)で n = 2/+1/0 の k を照合規約 43.0″/世紀(許容 0.0009)に合わせる(lib-w303e-fitstop —— 停止は許容の 1/10・
//     丸め 7 桁・最後の h/h2 の門)・h/4 で測り直す。G_loc だけの分と引きずりの分・恒星周期・近点周期・離心率の変化。参考の標的(1PN の式 + EPM2011 の追加)の k も。
//     照合の値(統括の伝達 —— h/2 の根 3.001360/4.001357/5.001361)を、根を h/2(門は h/4)で取り直して確かめる
//   T 6 本への移送(再フィットしない —— 標的 = 1PN の式 + EPM2011 の追加 ± σ): n ごとの近点の予言と相対・σ の倍。低離心率(e < 0.06 —— 作業上の切替値)は
//     新しい抽出器(tests/lib-w304e-apsis.mjs —— 接触の離心ベクトルの成分に位置の黄経の調和 K=3 を足した最小二乗)を主・検出器 B を併記。窓・位相・h/h2/h4 を記録
//   P 周期の表(本便の主の数 —— n は近点で決まらず周期で分かれる): 7 本の恒星周期・近点周期・離心率の変化を n ごとに(同じ初期状態を固定した診断・
//     観測の周期との照合はしない —— 時間標準の対応が未定〔AN333〕)。走行は M・T の走行を使う(新しい走行なし)
//   S 太陽の小さい η☉(S3 = m/R_d³ を太陽の行の分母へ —— 器 exp-w304b-shell の installSelfWrap の包み)を入れた写しで n = 2 と n = 0 の k
//   D 🟫(二次元)の扱い: 器の中だけの G_loc のキック(二次元の步の前に v += δa(x)·dt —— semic の力の評価に足すのと同じ)で二次元の写しの近点と
//     W_bg を n ごとに・同じキックを三次元の 🌡️ の写しで当ててエンジンの gLoc と照合(器のキックの検証)・三次元の 🌡️ の写しの W_bg・S._core の予算
//
// ■ しないこと・言わないこと
//   ・在位の本の宣言・html・エンジンの式・S._core を変えない(在位の惑星の本は凍結 —— 写しの門が通るまで入れない)。標的(照合規約 43.0)を書き換えない。
//   ・近点では n は決まらない(λ との足し算)—— n は裁定による選択として記録する。周期で分かれる量は同じ初期状態の診断(観測の周期と照合しない)。
//   ・届かないものは「この探索範囲では未達 —— 次の見直し」。
//
// 実行(Node だけ・1 プロセス): node tests/exp-w305b-gfamily.mjs → 正本 tests/out/gfamily-w305b.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import { assessCoreBudget } from './lib-core-budget.mjs';
import * as FS from './lib-w303e-fitstop.mjs';
import * as AP from './lib-w304e-apsis.mjs';
import * as B from './exp-w303b-inertialr2.mjs';
import * as SH from './exp-w304b-shell.mjs';
import * as PL from './exp-w299c-planets3d.mjs';
import * as P3 from './lib-w299c-planets3d.mjs';
import * as I3 from './exp-w295c-inertial3.mjs';
const REGEN_SCOPE = {"presets":"all","roots":["$","DT","FIT_COND_KEYS","FIT_COND_VERSION","FIT_KNOB_KEYS","FIT_NUMERICS_KEYS","FIT_RECORD_KEYS","FIT_RECORD_VERSION","FIT_RECORD_VERSIONS","FIT_RESIDUAL_KEYS","FIT_TARGET_KEYS","FIT_TOL_KEYS","HP.DRAG_CORE_RMAX_FACTOR","HP.DRAG_CORE_VERSION","HP.FIT_COND_VERSION","HP.GLOC_VERSION","HP.REL_DRAG_COMPOSE_DEFAULT","HP.REL_DRAG_I2_VERSION","HP.REL_DRAG_INERTIAL_VERSION","HP.REL_DRAG_SOLVE_FROM_DEFAULT","HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.dragCoreState","HP.fitCondSig","HP.gLocPeriAdvance","HP.gLocState","HP.geoEffectiveMode","HP.geoLawOfSim","HP.inertialDragLedgerOf","HP.inertialDragState","HP.inertialR2Q","HP.inertialR2State","HP.sim","HP.synodic","HP.validateFitRecord","HP.validatePreset","HP.wbgEstimateOf","LAWS","T","ab","ch","ctx","cw","dfmGaussLegendre01","dfmInertialDrag3Build","dfmInertialDrag3Solve","dfmInertialDragStep","dfmInertialDragStep3","dragCoreAngular","dragCoreAvgK","dragCoreLookup","dragCoreTableBuild","fmt","inertialDragComposeSolve","inertialDragI2Apply","inertialDragNormApply","inertialR2SumOf","pnSource","relDragCoefficientOf","relDragSolveFromOf","synUniform","validateFitRecord"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w305b-gfamily-1';
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const PARTS = (process.env.W305B_PARTS || 'Z,M,T,P,S,D').split(',');
const clone = (x) => JSON.parse(JSON.stringify(x));
const ARCSEC = 180 * 3600 / Math.PI;
const r7 = (x) => Number(Number(x).toPrecision(7));
export const DECL_FILE = 'tests/data-w305b-declbdb.json';
export const PIN = JSON.parse(fs.readFileSync(new URL('./data-w305b-declbdb.json', import.meta.url), 'utf8'));
export const MERCURY = B.MERCURY, TRANSFER = B.TRANSFER, PLANETS = [B.MERCURY].concat(B.TRANSFER), MER2D = 'mercurySunInertialFit';
export const TARGET_APS = B.TARGET_APS, TOL_APS = B.TOL_APS;
export const DIVS = [1, 2, 4];
export const N_WIN = 8;
export const APSIS_K = 3;                 // 新しい抽出器の位置の黄経の調和の数(第304便e の既定)
export const E_SWITCH = 0.06;             // 低離心率の作業上の切替値(AN330 —— e < 0.06 は新しい抽出器を主に)
export const ETA_SUN = 0.1;               // 段 S の太陽の η☉(第304便b の既定 ETA_SUN_DEFAULT と同じ)
/** n の族(第95報・AN332 の裁定: n = 2 を先・n = +1 は次点・n = 0 は対照)。 */
export const N_CASES = Object.freeze([
  Object.freeze({ key: 'n2', n: 2, gl: Object.freeze({ law: 'kappaC2' }), label: 'n = 2(G·(c_loc/c₀)² —— law:"kappaC2"・読み (ii))' }),
  Object.freeze({ key: 'n1', n: 1, gl: Object.freeze({ law: 'cRatio' }), label: 'n = +1(G·c_loc/c₀ —— law:"cRatio"・読み (i))' }),
  Object.freeze({ key: 'n0', n: 0, gl: null, label: 'n = 0(G_loc なし —— 対照)' }),
]);
/** 照合の値(統括の伝達 —— 水星・Br・自己なし・二体・8 公転・h/2 の根)。本器が根を h/2 で取り直して確かめる。 */
export const REF_K_H2 = Object.freeze({ n0: 3.001360, n1: 4.001357, n2: 5.001361, gLocPart: Object.freeze({ n0: 0, n1: -14.3268, n2: -28.6537 }),
  source: '統括の伝達(第305便の起動 —— 水星・Br・自己なし・二体・8 公転・h/2 の根)' });
export const TARGET_KINDS = Object.freeze(['conv', 'ref']);   // conv = 照合規約 43.0・ref = 1PN の式 + EPM2011 の追加(参考 —— AN319 ②)

/* ── 写し(基点 bdb7ae5 の宣言に固定)── */
export const lenM = (p) => Math.pow(10, p.scaleExp.L);
export const findPreset = (HP, id) => HP.allPresets().find((q) => q.id === id);
/** 生きている html の宣言(physics・bodies・scaleExp・timeRef)が凍結の写しと同じか */
export function liveSame(HP) {
  return Object.fromEntries(Object.keys(PIN.decl).map((id) => { const p = findPreset(HP, id), d = PIN.decl[id];
    const pb = !!p && JSON.stringify(p.physics) === JSON.stringify(d.physics) && JSON.stringify(p.bodies) === JSON.stringify(d.bodies);
    return [id, { physicsBodies: pb, all: pb && JSON.stringify(p.scaleExp) === JSON.stringify(d.scaleExp) && JSON.stringify(p.timeRef) === JSON.stringify(d.timeRef) }]; }));
}
/** 本の写し(本の他の鍵は html から・physics/bodies/scaleExp/timeRef は凍結の写し・fitRecord と gLoc を外す) */
export function pinned(HP, id) {
  const p = findPreset(HP, id); if (!p) throw new Error('本が無い: ' + id);
  const d = PIN.decl[id]; if (!d) throw new Error('凍結の写しが無い: ' + id);
  const q = clone(p); q.physics = clone(d.physics); q.bodies = clone(d.bodies); q.scaleExp = clone(d.scaleExp); q.timeRef = clone(d.timeRef);
  delete q.fitRecord; delete q.physics.gLoc;
  return q;
}
/** 写しの組み立て: c = {k(λ ∝ m の k —— null は引きずり OFF), gl(G_loc の宣言 —— null は無し), Wbg(定数の W_bg の写し —— 段 D)}。 */
export function caseOf(base, wExt, c) {
  const q = clone(base), rd0 = base.physics.relativeDrag;
  const rd = { law: 'inertial', eps: rd0.eps, history: 'positions', pairs: clone(rd0.pairs) };
  if (c.Wbg !== undefined && c.Wbg !== null) rd.Wbg = c.Wbg;
  else if (c.k === null || c.k === undefined) { rd.Wbg = null; rd.enabled = false; }
  else { rd.Wbg = wExt; rd.inertialR2 = { lambdaRs: c.k, sources: 'all' }; }
  q.physics.relativeDrag = rd;
  if (c.gl) q.physics.gLoc = clone(c.gl); else delete q.physics.gLoc;
  return q;
}
const hOf = (p) => P3.stepsOf(p.timeRef.pRef).h;

/* ── 器の中だけの G_loc のキック(段 D —— 二次元の写しと、その検証の三次元の写し)── */
// 步の前に v_i += δa_i(x)·dt(δa_i = −(G_i − G) Σ_j m_j d_ij/(d²+ε²)^{3/2}・G_i = G·e^(−2nψ_i)・ψ_i = (G/c₀²) Σ_{j≠i} m_j/√(d²+ε²) —— 受け手ごと)。
// semic の步は v += h a(x) → u → x += h(v + u) なので、步の前に同じ x で δa を足すのはエンジンの力の評価に足すのと同じ(丸めの順序だけ違う)。
export function kickWrap(S, nn, d3) {
  const had = Object.prototype.hasOwnProperty.call(S, 'step'), orig = S.step;
  let PS = null, n0 = -1;
  S.step = function (dt) {
    const n = S.n, m = S.mEff || S.m, x = S.x, y = S.y, z = d3 ? S.z : null, p = S.params, G = p.G, kap = G / (p.cLight * p.cLight), eps2 = p.softening * p.softening;
    if (n !== n0) { PS = new Float64Array(n); n0 = n; }
    for (let i = 0; i < n; i++) PS[i] = 0;
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      const dx = x[i] - x[j], dy = y[i] - y[j], dz = d3 ? z[i] - z[j] : 0, iw = 1 / Math.sqrt(dx * dx + dy * dy + dz * dz + eps2);
      PS[i] += m[j] * iw; PS[j] += m[i] * iw;
    }
    for (let i = 0; i < n; i++) {
      if (S.pinned[i]) continue;
      const dG = G * Math.expm1(-2 * nn * kap * PS[i]);
      let ax = 0, ay = 0, az = 0;
      for (let j = 0; j < n; j++) { if (j === i) continue;
        const dx = x[i] - x[j], dy = y[i] - y[j], dz = d3 ? z[i] - z[j] : 0, iw = 1 / Math.sqrt(dx * dx + dy * dy + dz * dz + eps2), f = dG * iw * iw * iw * m[j];
        ax -= f * dx; ay -= f * dy; az -= f * dz; }
      S.vx[i] += ax * dt; S.vy[i] += ay * dt; if (d3) S.vz[i] += az * dt;
    }
    return orig.apply(this, arguments);
  };
  return () => { if (had) S.step = orig; else delete S.step; };
}

/* ── 1 走行(三次元 —— 8 公転・検出器 B と新しい抽出器を同じ走行から)── */
const MEMO = new Map();
export const STATS = { measures: 0, memoHits: 0, measures2d: 0 };
let SELF = null;   // 段 S: 自己の項(器 exp-w304b-shell の包みへ渡す配列)
// 近点周期(窓の中の近点の時刻の直線 fit の傾き —— 日)
function anomPeriodDays(R, N, Tsec) {
  const rev = R.ev.rev; if (rev.length < N) return null;
  const pe = R.ev.peri.filter((z) => z.t <= rev[N - 1]); if (pe.length < 2) return null;
  const n = pe.length, ys = pe.map((z) => z.t), mx = (n - 1) / 2, my = ys.reduce((s, v) => s + v, 0) / n;
  let sxy = 0, sxx = 0; for (let i = 0; i < n; i++) { sxy += (i - mx) * (ys[i] - my); sxx += (i - mx) ** 2; }
  return sxy / sxx * Tsec / P3.DAY_S;
}
/** o.kickN: 器の中の G_loc のキック(段 D の検証 —— エンジンの gLoc の代わり) */
export function measure(HP, q, dt, o = {}) {
  const kickN = o.kickN || 0;
  const key = JSON.stringify([q.id, q.physics, q.bodies]) + '|' + dt + '|' + JSON.stringify(SELF) + '|' + kickN;
  if (MEMO.has(key)) { STATS.memoHits++; return MEMO.get(key); }
  STATS.measures++;
  const mu = q.physics.G * (q.bodies[0].m + q.bodies[1].m), Tsec = Math.pow(10, q.scaleExp.T);
  let smp = null, S = null, undo = null;
  const run = () => AP.captureSim(HP, (s) => { S = s; smp = AP.attachSampler(s, { ci: 0, oi: 1, mu }); if (kickN) undo = kickWrap(s, kickN, true); }, () => PL.runPl3(HP, q, { dt, revMax: N_WIN }));
  let R;
  try { R = SELF ? SH.withSelf(SELF, run) : run(); } finally { if (undo) undo(); }
  const w = PL.windowOf(R, N_WIN, Tsec), t1 = R.ev.rev[N_WIN - 1];
  const f = (t1 !== undefined) ? AP.apsisRate(smp.samples(), { t0: 0, t1, K: APSIS_K }) : null;
  const gl = S ? HP.gLocState(S) : null, i2 = S ? HP.inertialR2State(S) : null;
  const r = { aps: w.apsArcsecPerCentury, periodDays: w.periodDays, ecc: w.ecc, nPeri: w.nPeri, complete: w.complete, steps: R.steps, nan: R.nan,
    anomDays: anomPeriodDays(R, N_WIN, Tsec),
    apsNew: f ? AP.toArcsecPerCentury(f.rate, Tsec) : null, rateNew: f ? f.rate : null, eNew: f ? f.e : null, varpiNew: f ? f.varpi : null, rmsNew: f ? f.rms : null, nNew: f ? f.n : null, t1,
    gLoc: gl ? { psiMax: gl.psiMax, dGMax: gl.dGMax, work: gl.work } : null, xiMax: i2 ? i2.xiMax : null };
  MEMO.set(key, r);
  return r;
}
/**
 * 近点周期を恒星周期と近点率から [日]。恒星周期は**初期の位置の方向を通る周回の間隔**(runPl3 の周回の数え方)なので、近点が 1 公転に Δϖ = ϖ̇P 進むと
 * その方向を通る時刻は Δϖ/(df/dt) だけずれる(df/dt = n(1 + e cos f₀)²/(1 − e²)^{3/2}・f₀ は初期の方向の真近点離角 = −ϖ〔抽出器の基底は P̂ = 初期の位置の方向〕)。
 * よって P_anom = P_sid/(1 − ϖ̇P_sid·g/2π)・g = (1 − e²)^{3/2}/(1 + e cos ϖ)²(一次 —— e → 0 で平均運動の式 P_sid/(1 − ϖ̇P_sid/2π))。
 */
export const anomGeomOf = (e, varpi) => Math.pow(1 - e * e, 1.5) / ((1 + e * Math.cos(varpi)) ** 2);
const anomFromRate = (r, Tsec) => (r.rateNew === null) ? null : r.periodDays / (1 - r.rateNew * (r.periodDays * P3.DAY_S / Tsec) * anomGeomOf(r.eNew, r.varpiNew) / (2 * Math.PI));

/* ── 本ごとの文脈(写し・刻み・W_ext・対照・G_loc だけの走行)── */
const CTX = new Map();
function ctx(HP, id) {
  if (CTX.has(id)) return CTX.get(id);
  const base = pinned(HP, id), h = hOf(base), wExt = B.wExtOf(HP, base).book, tg = B.targetOf(base), f = B.pn1Formula(base), Tsec = Math.pow(10, base.scaleExp.T);
  const ctl = Object.fromEntries(DIVS.map((d) => [d, measure(HP, caseOf(base, wExt, { k: null, gl: null }), h / d)]));
  const glo = {};
  for (const C of N_CASES) if (C.gl) glo[C.key] = Object.fromEntries(DIVS.map((d) => [d, measure(HP, caseOf(base, wExt, { k: null, gl: C.gl }), h / d)]));
  const c = { id, emoji: base.emoji, base, h, wExt, tg, f, Tsec, ctl, glo, e: f.e, primary: f.e < E_SWITCH ? 'new' : 'detB' };
  CTX.set(id, c);
  return c;
}
const apsOf = (r, ex) => ex === 'new' ? r.apsNew : r.aps;
/** 一次の解析(固定の初期の接触要素): 引きずり(λ ∝ m・両方が受け手)2πk G(M+m)/(c₀²a(1−e²))・G_loc(受け手)−2nπ G(M²+m²)/(M+m)/(c₀²a(1−e²)) [″/世紀] */
export function analyticOf(c, k, n) {
  const q = c.base, G = q.physics.G, c0 = q.physics.cLight, M = q.bodies[0].m, m = q.bodies[1].m, f = c.f, century = 36525 * 86400 / c.Tsec;
  const conv = (rad) => rad / f.P * century * ARCSEC, den = c0 * c0 * f.a * (1 - f.e * f.e);
  const drag = conv(2 * Math.PI * k * G * (M + m) / den), gLoc = conv(-2 * n * Math.PI * G * (M * M + m * m) / (M + m) / den);
  return { drag, gLoc, total: drag + gLoc, pn1: f.arcsecCy };
}

/* ── 段 Z ── */
export function partZ(HP, log = console.log) {
  const out = { liveSame: liveSame(HP), apsisSelfTest: AP.apsisSelfTest() };
  log(`Z 写しと生きている宣言 ${Object.values(out.liveSame).filter((z) => z.physicsBodies).length}/${Object.keys(out.liveSame).length}・抽出器の自己試験 ${out.apsisSelfTest.ok}`);
  // G_loc だけの近点(水星の写し —— h/h2/h4)と一次の解析
  const c = ctx(HP, MERCURY);
  out.gLocOnly = N_CASES.filter((C) => C.gl).map((C) => {
    const d = DIVS.map((dv) => c.glo[C.key][dv].aps - c.ctl[dv].aps), dn = DIVS.map((dv) => c.glo[C.key][dv].apsNew - c.ctl[dv].apsNew), an = analyticOf(c, 0, C.n).gLoc;
    log(`Z G_loc だけ(${C.key}): 検出器 B ${d.map((x) => x.toFixed(6)).join(' / ')}・新 ${dn.map((x) => x.toFixed(6)).join(' / ')}・一次の解析 ${an.toFixed(6)}(比 ${(d[2] / an).toFixed(6)})`);
    return { key: C.key, n: C.n, diffs: d, diffsNew: dn, analytic: an, ratio: d[2] / an, psiMax: c.glo[C.key][1].gLoc ? c.glo[C.key][1].gLoc.psiMax : null };
  });
  return out;
}

/* ── 段 M: 水星の k ── */
function fitK(HP, c, C, target, o = {}) {
  const dA = o.divA || 1, dB = o.divB || 2;
  const mk = (k) => caseOf(c.base, c.wExt, { k, gl: C.gl });
  const y = (k, d) => measure(HP, mk(k), c.h / d).aps - c.ctl[d].aps;
  const gPart = C.gl ? c.glo[C.key][dA].aps - c.ctl[dA].aps : 0;
  const k0 = 3 * (target - gPart) / c.f.arcsecCy;   // 引きずりの一次の分 = k·(1PN の式)/3
  const fit = FS.fitStopSync({ yH: (k) => y(k, dA), yH2: (k) => y(k, dB), target, tol: TOL_APS, method: 'secant', x0: k0, x1: k0 * 1.0005, round: r7 });
  return { fit, k0 };
}
/** 1 つの k の行(h/h2/h4 —— 近点・周期・離心率の変化を全体・G_loc だけ・引きずりの分で) */
export function rowOf(HP, c, C, k) {
  const runs = DIVS.map((d) => measure(HP, caseOf(c.base, c.wExt, { k, gl: C.gl }), c.h / d));
  const ctl = DIVS.map((d) => c.ctl[d]), glo = DIVS.map((d) => C.gl ? c.glo[C.key][d] : c.ctl[d]);
  const sec = (d) => d * P3.DAY_S;
  const diff = (ex) => runs.map((r, i) => apsOf(r, ex) - apsOf(ctl[i], ex));
  const gl = (ex) => glo.map((r, i) => apsOf(r, ex) - apsOf(ctl[i], ex));
  const dB = diff('detB'), dN = diff('new'), gB = gl('detB'), gN = gl('new');
  const per = { sid: runs.map((r, i) => sec(r.periodDays - ctl[i].periodDays)), sidG: glo.map((r, i) => sec(r.periodDays - ctl[i].periodDays)),
    anom: runs.map((r, i) => (r.anomDays === null || ctl[i].anomDays === null) ? null : sec(r.anomDays - ctl[i].anomDays)),
    anomG: glo.map((r, i) => (r.anomDays === null || ctl[i].anomDays === null) ? null : sec(r.anomDays - ctl[i].anomDays)),
    anomRate: runs.map((r, i) => sec(anomFromRate(r, c.Tsec) - anomFromRate(ctl[i], c.Tsec))), anomRateG: glo.map((r, i) => sec(anomFromRate(r, c.Tsec) - anomFromRate(ctl[i], c.Tsec))),
    ecc: runs.map((r, i) => r.ecc - ctl[i].ecc), eccG: glo.map((r, i) => r.ecc - ctl[i].ecc), eNew: runs.map((r, i) => r.eNew - ctl[i].eNew), eNewG: glo.map((r, i) => r.eNew - ctl[i].eNew) };
  per.sidD = per.sid.map((x, i) => x - per.sidG[i]); per.anomRateD = per.anomRate.map((x, i) => x - per.anomRateG[i]);
  const last = DIVS.length - 1, ne = (a) => Math.abs(a[last] - a[last - 1]);
  return { k, n: C.n, key: C.key, diffB: dB, diffNew: dN, gLocB: gB, gLocNew: gN, dragB: dB.map((x, i) => x - gB[i]), dragNew: dN.map((x, i) => x - gN[i]),
    numErrB: ne(dB), numErrNew: ne(dN), per, numErrSid: ne(per.sid), numErrAnomRate: ne(per.anomRate), numErrEcc: ne(per.ecc),
    win: { N: N_WIN, t1Units: runs.map((r) => r.t1), K: APSIS_K, phase: '位置の黄経(初期の軌道面)', nSamples: runs.map((r) => r.nNew), rmsNew: runs.map((r) => r.rmsNew), dt: DIVS.map((d) => c.h / d) },
    nan: runs.some((r) => r.nan) || runs.some((r) => !r.complete), xiMax: runs[0].xiMax, psiMax: runs[0].gLoc ? runs[0].gLoc.psiMax : null };
}
export function partM(HP, log = console.log) {
  const c = ctx(HP, MERCURY), rows = [];
  for (const C of N_CASES) for (const tk of TARGET_KINDS) {
    const target = tk === 'conv' ? TARGET_APS : c.tg.value;
    const { fit, k0 } = fitK(HP, c, C, target);
    const row = { key: C.key, n: C.n, gl: C.gl, label: C.label, targetKind: tk, target, k0, status: fit.status, evals: fit.evals, rootStop: fit.root.stop, x: fit.x, final: fit.final };
    if (fit.x !== null) Object.assign(row, rowOf(HP, c, C, fit.x), { analytic: analyticOf(c, fit.x, C.n) });
    row.gate = fit.final ? fit.final.gate : false;
    rows.push(row);
    log(`M ${C.key}・${tk}(標的 ${target.toFixed(5)}): k ${fit.x}(${fit.status}・評価 ${fit.evals})・差 ${row.diffB ? row.diffB.map((x) => x.toFixed(6)).join(' / ') : '—'}・G_loc ${row.gLocB ? row.gLocB[2].toFixed(4) : '—'}・恒星周期 ${row.per ? row.per.sid.map((x) => x.toFixed(4)).join(' / ') : '—'} s`);
  }
  // h/2 の根(門は h/4)—— 照合の値の確かめ
  const h2roots = N_CASES.map((C) => {
    const { fit } = fitK(HP, c, C, TARGET_APS, { divA: 2, divB: 4 });
    const ref = REF_K_H2[C.key];
    log(`M h/2 の根 ${C.key}: k ${fit.x}(${fit.status})・照合の値 ${ref}・差 ${fit.x === null ? '—' : (fit.x - ref).toExponential(2)}`);
    return { key: C.key, n: C.n, x: fit.x, status: fit.status, final: fit.final, evals: fit.evals, refK: ref, diff: fit.x === null ? null : fit.x - ref,
      gLocPartH2: C.gl ? c.glo[C.key][2].aps - c.ctl[2].aps : 0, refGLocPart: REF_K_H2.gLocPart[C.key] };
  });
  return { rows, h2roots, mercury: { target: c.tg, pn1: c.f.arcsecCy, a: c.f.a, e: c.f.e, h: c.h, wExt: c.wExt, rsBook: B.rsBook(c.base), ctl: DIVS.map((d) => ({ div: d, aps: c.ctl[d].aps, apsNew: c.ctl[d].apsNew, periodDays: c.ctl[d].periodDays, ecc: c.ctl[d].ecc })) },
    refSource: REF_K_H2.source };
}

/* ── 段 T: 6 本への移送(再フィットしない)── */
export function partT(HP, M, log = console.log) {
  const fits = M.rows.filter((r) => r.x !== null), table = [];
  for (const id of TRANSFER) {
    const c = ctx(HP, id), ex = c.primary, ex2 = ex === 'new' ? 'detB' : 'new', T = c.tg, rows = [];
    for (const fr of fits) {
      const C = N_CASES.find((z) => z.key === fr.key), r = rowOf(HP, c, C, fr.x), an = analyticOf(c, fr.x, C.n);
      const pick = (ex_) => ex_ === 'new' ? { d: r.diffNew, ne: r.numErrNew, g: r.gLocNew } : { d: r.diffB, ne: r.numErrB, g: r.gLocB };
      const P1 = pick(ex), P2 = pick(ex2), last = DIVS.length - 1;
      const pred = P1.d[last], diff = pred - T.value, judge = B.judgeOf(diff, T.sigma, P1.ne), pred2 = P2.d[last], judge2 = B.judgeOf(pred2 - T.value, T.sigma, P2.ne);
      rows.push({ key: fr.key, n: C.n, targetKind: fr.targetKind, k: fr.x, primary: ex, preds: P1.d, pred, numErr: P1.ne, gLocPart: P1.g[last], dragPart: pred - P1.g[last],
        diff, rel: diff / T.value, diffSigma: T.sigma ? diff / T.sigma : null, judge, secondary: { extractor: ex2, preds: P2.d, pred: pred2, numErr: P2.ne, judge: judge2 },
        analytic: an, analyticMinusMeasured: pred - an.total, rowRef: r });
      log(`T ${c.emoji} ${fr.key}・${fr.targetKind}: 予言 ${pred.toPrecision(7)}(${ex}・${P1.d.map((x) => x.toPrecision(7)).join(' / ')}・数値の誤差 ${P1.ne.toExponential(2)})・標的 ${T.value.toPrecision(7)}${T.sigma === null ? '' : ' ± ' + T.sigma}・${judge.text}・併記 ${ex2} ${pred2.toPrecision(7)}(±${P2.ne.toExponential(1)})・解析 ${an.total.toPrecision(7)}`);
    }
    table.push({ id, emoji: c.emoji, e: c.e, primary: ex, h: c.h, target: T, rows });
  }
  return { table, eSwitch: E_SWITCH, K: APSIS_K, window: N_WIN + ' 公転(t0 = 0 〜 8 回目の周回の時刻)・刻み h/h2/h4・対照は引きずり OFF・G_loc なし' };
}

/* ── 段 P: 周期の表(M・T の走行から)── */
export function partP(HP, M, T, log = console.log) {
  const rows = [];
  for (const id of PLANETS) {
    const c = ctx(HP, id), byN = {};
    for (const C of N_CASES) {
      const src = id === MERCURY ? M.rows.find((r) => r.key === C.key && r.targetKind === 'conv') : T.table.find((t) => t.id === id).rows.find((r) => r.key === C.key && r.targetKind === 'conv').rowRef;
      if (!src || !src.per) continue;
      const last = DIVS.length - 1, p = src.per;
      byN[C.key] = { n: C.n, k: src.k === undefined ? src.x : src.k, sid: p.sid[last], sidG: p.sidG[last], sidD: p.sidD[last], numErrSid: src.numErrSid,
        anomRate: p.anomRate[last], anomRateG: p.anomRateG[last], anomRateD: p.anomRateD[last], numErrAnomRate: src.numErrAnomRate,
        anom: p.anom[last], ecc: p.ecc[last], eccG: p.eccG[last], eNew: p.eNew[last], numErrEcc: src.numErrEcc, sidAll: p.sid, anomRateAll: p.anomRate };
    }
    const sep = (a, b, q, e) => (byN[a] && byN[b]) ? { d: byN[a][q] - byN[b][q], err: byN[a][e] + byN[b][e], ratio: Math.abs(byN[a][q] - byN[b][q]) / (byN[a][e] + byN[b][e]) } : null;
    const row = { id, emoji: c.emoji, e: c.e, periodDays: c.ctl[4].periodDays, byN,
      sepSid20: sep('n2', 'n0', 'sid', 'numErrSid'), sepSid10: sep('n1', 'n0', 'sid', 'numErrSid'), sepSid21: sep('n2', 'n1', 'sid', 'numErrSid'),
      sepAnom20: sep('n2', 'n0', 'anomRate', 'numErrAnomRate'), sepAnom10: sep('n1', 'n0', 'anomRate', 'numErrAnomRate') };
    rows.push(row);
    log(`P ${c.emoji}: 恒星周期の変化 [s] n2 ${byN.n2.sid.toExponential(4)}・n1 ${byN.n1.sid.toExponential(4)}・n0 ${byN.n0.sid.toExponential(4)}(数値の誤差 ${byN.n0.numErrSid.toExponential(1)})・n2−n0 は誤差の ${row.sepSid20.ratio.toExponential(2)} 倍・近点周期 n2 ${byN.n2.anomRate.toExponential(4)}・n0 ${byN.n0.anomRate.toExponential(4)}`);
  }
  return { rows, unit: 's', note: '同じ初期状態(本の写しの位置・速度・元期・GM)を固定した診断 —— 差 = 写し − 対照(引きずり OFF・G_loc なし)の h/4 の値・数値の誤差 |h/2 − h/4|。恒星周期は初期の位置の方向を通る周回の平均間隔(8 公転)。近点周期は恒星周期と新しい抽出器の近点率から P_anom = P_sid/(1 − ϖ̇P_sid·g/2π)・g = (1 − e²)^{3/2}/(1 + e cos ϖ)²(近点の時刻の直線 fit の値は anom に併記)' };
}

/* ── 段 S: 太陽の小さい η☉(S3)を入れた写し ── */
export function partS(HP, M, log = console.log) {
  SH.installSelfWrap();
  const c = ctx(HP, MERCURY), sun = c.base.bodies[0], Rd = ETA_SUN * sun.radius, selfSun = sun.m / (Rd * Rd * Rd);
  const rows = [];
  for (const C of N_CASES.filter((z) => z.key !== 'n1')) {
    SELF = [selfSun, 0];
    let fit, row;
    try {
      // 対照(引きずり OFF)は自己の項が分母に入っても動かない(引きずりが無い)—— 対照と G_loc だけは自己なしの値を使う
      const mk = (k) => caseOf(c.base, c.wExt, { k, gl: C.gl });
      const y = (k, d) => measure(HP, mk(k), c.h / d).aps - c.ctl[d].aps;
      const noSelf = M.rows.find((r) => r.key === C.key && r.targetKind === 'conv');
      fit = FS.fitStopSync({ yH: (k) => y(k, 1), yH2: (k) => y(k, 2), target: TARGET_APS, tol: TOL_APS, method: 'secant', x0: noSelf.x, x1: noSelf.x * 1.0005, round: r7 });
      const d4 = fit.x === null ? null : y(fit.x, 4);
      row = { key: C.key, n: C.n, etaSun: ETA_SUN, selfSun, sunWext: c.wExt, selfOverWext: selfSun / c.wExt, x: fit.x, status: fit.status, final: fit.final, evals: fit.evals, diffH4: d4,
        kNoSelf: noSelf.x, ratioToNoSelf: fit.x === null ? null : fit.x / noSelf.x };
    } finally { SELF = null; }
    rows.push(row);
    log(`S ${C.key}: η☉ ${ETA_SUN}(自己 ${selfSun.toExponential(3)}・W_ext の ${row.selfOverWext.toExponential(2)} 倍)k ${row.x}(${row.status})・自己なしの k ${row.kNoSelf}・比 ${row.ratioToNoSelf}`);
  }
  return { rows, wrap: { installed: SH.WRAP.installed, calls: SH.WRAP.calls }, note: '自己の項 S3 = m☉/(η☉R☉)³ を太陽の行の分母へ(器 exp-w304b-shell の installSelfWrap —— 分子の自己は 0)・水星は自己なし(η∞)' };
}

/* ── 段 D: 🟫(二次元)の扱い ── */
function run2(HP, q, dt, nn) {
  const S = HP.sim, ownB = Object.prototype.hasOwnProperty.call(S, 'build'), b = S.build; let undo = null;
  STATS.measures2d++;
  S.build = function () { const r = b.apply(this, arguments); if (nn) undo = kickWrap(S, nn, false); return r; };
  let R;
  try { R = I3.runPair(HP, q, { ci: 0, oi: 1, dt, revMax: N_WIN }); } finally { if (undo) undo(); if (ownB) S.build = b; else delete S.build; }
  const U = I3.timeUnits(q.scaleExp), n = R.rev.length;
  return { aps: R.B ? R.B.slopeDegPerTime * U.century * 3600 : null, periodSec: (R.rev[n - 1] - R.rev[0]) / (n - 1) * U.sec, eProxy: R.eProxy, steps: R.steps, nan: R.nan, revN: n };
}
export const D_DT = 0.016;   // 🟫 のフィットの刻み(fitRecord.dt)
function wbgOf(p, W) { const q = clone(p), rd = q.physics.relativeDrag; delete rd.gain; delete rd.inertialR2; if (W === null) { rd.Wbg = null; rd.enabled = false; } else { rd.Wbg = W; delete rd.enabled; } delete q.physics.gLoc; return q; }
export function partD(HP, log = console.log) {
  const out = {};
  // (a) 二次元の写し(器の中のキック)
  const p2 = pinned(HP, MER2D), W2 = p2.physics.relativeDrag.Wbg, divs2 = [1, 2, 4];
  const c2 = divs2.map((d) => run2(HP, wbgOf(p2, null), D_DT / d, 0));
  const g2 = {}; for (const nn of [1, 2]) g2['n' + nn] = divs2.map((d) => run2(HP, wbgOf(p2, null), D_DT / d, nn));
  const mu2 = p2.physics.G * p2.bodies[0].m, c0 = p2.physics.cLight, B0 = p2.bodies[1], r0 = Math.hypot(B0.x, B0.y), v2 = B0.vx * B0.vx + B0.vy * B0.vy, a2 = 1 / (2 / r0 - v2 / mu2);
  const e2 = Math.sqrt(Math.max(0, 1 - (r0 * r0 * v2 - (B0.x * B0.vx + B0.y * B0.vy) ** 2) / (mu2 * a2))), P2 = 2 * Math.PI * Math.sqrt(a2 ** 3 / mu2);
  const U2 = I3.timeUnits(p2.scaleExp), an2 = (nn) => HP.gLocPeriAdvance(nn, mu2, c0, a2, e2) / P2 * U2.century * ARCSEC;
  out.twoD = { id: MER2D, emoji: p2.emoji, Wbg: W2, dt: D_DT, ctl: c2.map((z) => ({ aps: z.aps, periodSec: z.periodSec })), a: a2, e: e2,
    gLocOnly: [1, 2].map((nn) => { const g = g2['n' + nn], d = g.map((z, i) => z.aps - c2[i].aps), ds = g.map((z, i) => z.periodSec - c2[i].periodSec);
      return { n: nn, diffs: d, analytic: an2(nn), ratio: d[2] / an2(nn), periodShiftSec: ds }; }) };
  for (const z of out.twoD.gLocOnly) log(`D 二次元 G_loc だけ n ${z.n}: ${z.diffs.map((x) => x.toFixed(6)).join(' / ')}(解析 ${z.analytic.toFixed(6)}・比 ${z.ratio.toFixed(6)})・恒星周期 ${z.periodShiftSec.map((x) => x.toFixed(4)).join(' / ')} s`);
  // W_bg の根(二次元 —— n ごと)
  out.twoD.fits = [0, 1, 2].map((nn) => {
    const y = (W, d) => run2(HP, wbgOf(p2, W), D_DT / d, nn).aps - c2[divs2.indexOf(d)].aps;
    const gPart = nn ? out.twoD.gLocOnly[nn - 1].diffs[0] : 0, W0 = W2 * TARGET_APS / (TARGET_APS - gPart);
    const fit = FS.fitStopSync({ yH: (W) => y(W, 1), yH2: (W) => y(W, 2), target: TARGET_APS, tol: TOL_APS, method: 'secant', x0: W0, x1: W0 * 1.0005, round: r7 });
    const d4 = fit.x === null ? null : y(fit.x, 4);
    log(`D 二次元 W_bg(n ${nn}): ${fit.x}(${fit.status}・評価 ${fit.evals})・比 W_n/W_book ${(fit.x / W2).toFixed(6)}`);
    return { n: nn, x: fit.x, status: fit.status, final: fit.final, evals: fit.evals, diffH4: d4, ratioToBook: fit.x / W2 };
  });
  // (b) 三次元の 🌡️ の写し(定数の W_bg + エンジンの gLoc)—— W_bg の根(案 ② の比較)と器のキックの検証
  const c3 = ctx(HP, MERCURY), W3 = c3.base.physics.relativeDrag.Wbg;
  const y3 = (W, d, gl) => measure(HP, caseOf(c3.base, c3.wExt, { Wbg: W, gl }), c3.h / d).aps - c3.ctl[d].aps;
  out.threeD = { id: MERCURY, Wbg: W3, fits: N_CASES.slice().reverse().map((C) => {
    const gPart = C.gl ? c3.glo[C.key][1].aps - c3.ctl[1].aps : 0, W0 = W3 * TARGET_APS / (TARGET_APS - gPart);
    const fit = FS.fitStopSync({ yH: (W) => y3(W, 1, C.gl), yH2: (W) => y3(W, 2, C.gl), target: TARGET_APS, tol: TOL_APS, method: 'secant', x0: W0, x1: W0 * 1.0005, round: r7 });
    log(`D 三次元 🌡️ の写し W_bg(${C.key}): ${fit.x}(${fit.status})・比 ${(fit.x / W3).toFixed(6)}`);
    return { key: C.key, n: C.n, x: fit.x, status: fit.status, final: fit.final, ratioToBook: fit.x / W3 };
  }) };
  // 器のキックの検証(三次元・G_loc だけ・n = 2): エンジンの gLoc と器のキック
  const v = [2, 1].map((nn) => { const C = N_CASES.find((z) => z.n === nn);
    const eng = measure(HP, caseOf(c3.base, c3.wExt, { k: null, gl: C.gl }), c3.h), dev = measure(HP, caseOf(c3.base, c3.wExt, { k: null, gl: null }), c3.h, { kickN: nn }), ctl = c3.ctl[1];
    const dE = eng.aps - ctl.aps, dD = dev.aps - ctl.aps, pE = (eng.periodDays - ctl.periodDays) * P3.DAY_S, pD = (dev.periodDays - ctl.periodDays) * P3.DAY_S;
    log(`D 器のキックの検証 n ${nn}: 近点 エンジン ${dE.toFixed(6)}・器 ${dD.toFixed(6)}(相対差 ${Math.abs(dD / dE - 1).toExponential(2)})・恒星周期 ${pE.toFixed(5)} / ${pD.toFixed(5)} s`);
    return { n: nn, apsEngine: dE, apsDevice: dD, apsRelDiff: Math.abs(dD / dE - 1), periodEngineSec: pE, periodDeviceSec: pD, periodRelDiff: Math.abs(pD / pE - 1) }; });
  out.kickCheck = v;
  // (c) 案 ③ の費用: S._core の予算と三次元の呼び出しの文字数
  const html = fs.readFileSync(path.join(ROOT, TARGET), 'utf8'), cb = assessCoreBudget(html);
  const callLines = (html.match(/^.*const GLs=S\._gLoc\|\|null;.*$|^.*if\(GLs!==null\) gLocKick3\(.*$|^.*if\(GLs!==null\) gLocLedger3\(.*$/mg) || []).map((l) => l.replace(/\/\/.*$/, '').replace(/\s+/g, ' ').trim());
  out.core = { chars: cb.chars, budget: cb.budget, remaining: cb.remaining, callChars3d: callLines.reduce((s, l) => s + l.length, 0), callLines: callLines.length };
  log(`D S._core ${cb.chars}/${cb.budget}(残 ${cb.remaining})・三次元の G_loc の呼び出し ${out.core.callLines} 行 ${out.core.callChars3d} 字`);
  return out;
}

/* ── 文書の表(docs/PHYSICS.md〔第305便b〕に貼る表と、QA docs.gfamily305 が照合する数の文字列 —— 同じ関数)── */
export const fmtK = (x) => String(x);
export const fmtP = (x) => (x === null || x === undefined) ? '—' : Number(x).toPrecision(6);
export const fmtE = (x, d = 2) => (x === null || x === undefined) ? '—' : Number(x).toExponential(d);
export const fmtF = (x, d = 4) => (x === null || x === undefined) ? '—' : Number(x).toFixed(d);
const NLAB = { n2: 'n = 2(kappaC2)', n1: 'n = +1(cRatio)', n0: 'n = 0(なし)' };
const TLAB = { conv: '照合規約 43.0', ref: '参考 1PN + A1' };
const XLAB = { new: '新', detB: 'B' };
/** 表の欄の中の縦棒をエスケープする(判定の文の「|差|/σ」が表の区切りにならないように)。 */
export const cellSafe = (t) => String(t).replace(/\|/g, '\\|');
export function physicsTables(J) {
  const out = [];
  const M = J.mercury;
  out.push('| n・標的 | k(= λ/r_s) | 近点率の差 h / h/2 / h/4 [″/世紀] | 門 | G_loc だけ [″/世紀](一次の解析) | 引きずりの分 | 恒星周期の変化 [s] | 近点周期の変化 [s] | 離心率の変化 |', '|---|---|---|---|---|---|---|---|---|');
  for (const r of M.rows) {
    if (r.x === null) { out.push(`| ${NLAB[r.key]}・${TLAB[r.targetKind]} | この探索範囲では未達 | — | 偽 | — | — | — | — | — |`); continue; }
    out.push(`| ${NLAB[r.key]}・${TLAB[r.targetKind]} | ${fmtK(r.x)} | ${r.diffB.map((x) => fmtF(x, 5)).join(' / ')} | ${r.gate ? '真' : '偽'} | ${fmtF(r.gLocB[2])}(${fmtF(r.analytic.gLoc)}) | ${fmtF(r.dragB[2])} | ${fmtF(r.per.sid[2], 4)} | ${fmtF(r.per.anomRate[2], 4)} | ${fmtE(r.per.ecc[2], 2)} |`);
  }
  out.push('');
  out.push('| n | 根を h/2 で取った k(門は h/4) | 照合の値 | 差 | 門 |', '|---|---|---|---|---|');
  for (const z of M.h2roots) out.push(`| ${NLAB[z.key]} | ${fmtK(z.x)} | ${z.refK} | ${fmtE(z.diff, 1)} | ${z.final && z.final.gate ? '真' : '偽'} |`);
  out.push('');
  const T = J.transfer;
  out.push('| 本(e・主の抽出器) | 標的 = 1PN の式 + EPM2011 の追加 ± σ | n = 2 の予言(数値の誤差) | n = +1 | n = 0 | n = 2 の判定 | n = 0 の判定 | 併記(n = 2・他の抽出器) |', '|---|---|---|---|---|---|---|---|');
  for (const t of T.table) {
    const R = (k) => t.rows.find((r) => r.key === k && r.targetKind === 'conv');
    const cell = (r) => r ? `${fmtP(r.pred)}(±${fmtE(r.numErr, 1)}・${r.rel >= 0 ? '+' : ''}${(100 * r.rel).toFixed(2)}%)` : '—';
    out.push(`| ${t.emoji}(${t.e.toFixed(4)}・${XLAB[t.primary]}) | ${fmtP(t.target.value)}${t.target.sigma === null ? '(σ なし)' : ' ± ' + t.target.sigma} | ${cell(R('n2'))} | ${cell(R('n1'))} | ${cell(R('n0'))} | ${R('n2') ? cellSafe(R('n2').judge.text) : '—'} | ${R('n0') ? cellSafe(R('n0').judge.text) : '—'} | ${R('n2') ? XLAB[R('n2').secondary.extractor] + ' ' + fmtP(R('n2').secondary.pred) + '(±' + fmtE(R('n2').secondary.numErr, 1) + ')' : '—'} |`);
  }
  out.push('');
  out.push('| 本(参考の k —— 1PN + A1 の標的) | n = 2 の予言 | n = 0 の予言 | n = 2 の 差/σ(絶対値) | n = 0 の 差/σ(絶対値) |', '|---|---|---|---|---|');
  for (const t of T.table) {
    const R = (k) => t.rows.find((r) => r.key === k && r.targetKind === 'ref');
    const sg = (r) => (r && r.diffSigma !== null) ? Math.abs(r.diffSigma).toFixed(2) : '—';
    out.push(`| ${t.emoji} | ${R('n2') ? fmtP(R('n2').pred) : '—'} | ${R('n0') ? fmtP(R('n0').pred) : '—'} | ${sg(R('n2'))} | ${sg(R('n0'))} |`);
  }
  out.push('');
  out.push('| 本(e) | 検出器 B の数値の誤差 n = 2 / +1 / 0 [″/世紀] | 新しい抽出器の数値の誤差 n = 2 / +1 / 0 | 主 |', '|---|---|---|---|');
  const exErr = (r, ex) => (r.primary === ex ? r.numErr : r.secondary.numErr);
  for (const t of T.table) { const rs = ['n2', 'n1', 'n0'].map((k) => t.rows.find((r) => r.key === k && r.targetKind === 'conv'));
    out.push(`| ${t.emoji}(${t.e.toFixed(4)}) | ${rs.map((r) => fmtE(exErr(r, 'detB'), 1)).join(' / ')} | ${rs.map((r) => fmtE(exErr(r, 'new'), 1)).join(' / ')} | ${XLAB[t.primary]} |`); }
  out.push('');
  const mars = T.table.find((t) => t.id === 'marsSunInertial3d');
  if (mars) {
    out.push('| 🔴 の行(n・標的) | 検出器 B の予言(数値の誤差・差/σ の絶対値) | 新しい抽出器の予言(数値の誤差・差/σ の絶対値) |', '|---|---|---|');
    const sg = mars.target.sigma, tv = mars.target.value;
    for (const r of mars.rows) { const b = r.primary === 'detB' ? { p: r.pred, e: r.numErr } : { p: r.secondary.pred, e: r.secondary.numErr }, nw = r.primary === 'new' ? { p: r.pred, e: r.numErr } : { p: r.secondary.pred, e: r.secondary.numErr };
      out.push(`| ${NLAB[r.key]}・${TLAB[r.targetKind]} | ${fmtP(b.p)}(±${fmtE(b.e, 1)}・${(Math.abs(b.p - tv) / sg).toFixed(2)}) | ${fmtP(nw.p)}(±${fmtE(nw.e, 1)}・${(Math.abs(nw.p - tv) / sg).toFixed(2)}) |`); }
    out.push('');
  }
  const P = J.periods;
  out.push('| 本 | 恒星周期の変化 [s] n = 2 / +1 / 0(数値の誤差) | うち G_loc だけ n = 2 / +1 | n = 2 − n = 0 の差 / 数値の誤差の和 | 近点周期の変化 [s] n = 2 / +1 / 0 | n = 2 − n = 0 の差 / 数値の誤差の和 | 近点周期(近点の時刻の fit)n = 2 / 0 | 離心率の変化 n = 2 / 0 |', '|---|---|---|---|---|---|---|---|');
  for (const r of P.rows) { const b = r.byN;
    out.push(`| ${r.emoji} | ${fmtE(b.n2.sid, 3)} / ${fmtE(b.n1.sid, 3)} / ${fmtE(b.n0.sid, 3)}(±${fmtE(b.n0.numErrSid, 1)}) | ${fmtE(b.n2.sidG, 3)} / ${fmtE(b.n1.sidG, 3)} | ${fmtE(r.sepSid20.d, 3)} / ${fmtE(r.sepSid20.err, 1)}(${fmtE(r.sepSid20.ratio, 2)} 倍) | ${fmtE(b.n2.anomRate, 3)} / ${fmtE(b.n1.anomRate, 3)} / ${fmtE(b.n0.anomRate, 3)} | ${fmtE(r.sepAnom20.d, 3)} / ${fmtE(r.sepAnom20.err, 1)}(${fmtE(r.sepAnom20.ratio, 2)} 倍) | ${fmtE(b.n2.anom, 3)} / ${fmtE(b.n0.anom, 3)} | ${fmtE(b.n2.ecc, 2)} / ${fmtE(b.n0.ecc, 2)} |`); }
  out.push('');
  const S = J.sunSelf;
  if (S) {
    out.push('| n | η☉ | 太陽の自己 S3 / W_ext | k(太陽に自己あり) | k(自己なし) | 比 | 門 |', '|---|---|---|---|---|---|---|');
    for (const r of S.rows) out.push(`| ${NLAB[r.key]} | ${r.etaSun} | ${fmtE(r.selfOverWext, 2)} | ${fmtK(r.x)} | ${fmtK(r.kNoSelf)} | ${r.ratioToNoSelf === null ? '—' : r.ratioToNoSelf.toFixed(7)} | ${r.final && r.final.gate ? '真' : '偽'} |`);
    out.push('');
  }
  const D = J.flat2d;
  if (D) {
    out.push('| 🟫 の写し(二次元・器の中のキック) | 近点率の差 h / h/2 / h/4 [″/世紀] | 一次の解析 | 比 | 恒星周期の変化 h/4 [s] |', '|---|---|---|---|---|');
    for (const z of D.twoD.gLocOnly) out.push(`| G_loc だけ n = ${z.n} | ${z.diffs.map((x) => fmtF(x, 5)).join(' / ')} | ${fmtF(z.analytic, 5)} | ${z.ratio.toFixed(6)} | ${fmtF(z.periodShiftSec[2], 4)} |`);
    out.push('');
    out.push('| n | 🟫 の写しの W_bg(二次元) | 本の W_bg との比 | 🌡️ の写しの W_bg(三次元・定数の W_bg) | 本の W_bg との比 |', '|---|---|---|---|---|');
    for (const nn of [2, 1, 0]) { const a = D.twoD.fits.find((z) => z.n === nn), b = D.threeD.fits.find((z) => z.n === nn);
      out.push(`| ${nn} | ${fmtK(a.x)}(${a.status}) | ${a.ratioToBook.toFixed(6)} | ${fmtK(b.x)}(${b.status}) | ${b.ratioToBook.toFixed(6)} |`); }
    out.push('');
  }
  return out.join('\n');
}
/** QA docs.gfamily305 が PHYSICS〔第305便b〕の中に探す数の文字列(表と同じ書式)。 */
export function docNumbers(J) {
  const out = [];
  for (const r of J.mercury.rows) if (r.x !== null) out.push(fmtK(r.x));
  for (const t of J.transfer.table) for (const r of t.rows) if (r.targetKind === 'conv') out.push(fmtP(r.pred));
  for (const r of J.periods.rows) for (const k of ['n2', 'n0']) out.push(fmtE(r.byN[k].sid, 3));
  if (J.sunSelf) for (const r of J.sunSelf.rows) out.push(fmtK(r.x));
  if (J.flat2d) for (const z of J.flat2d.twoD.fits) out.push(fmtK(z.x));
  return [...new Set(out)];
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) {
  const t0 = Date.now();
  const OUT_PATH = process.env.W305B_OUT || path.join(ROOT, 'tests', 'out', 'gfamily-w305b.json');
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
  const out = { meta: null, harnessVersion: HARNESS_VERSION, gLocVersion: HP.GLOC_VERSION, i2Version: HP.REL_DRAG_I2_VERSION, apsisVersion: AP.APSIS_VERSION, fitstopVersion: FS.FITSTOP_VERSION, parts: PARTS,
    pin: { file: DECL_FILE, version: PIN.version, base: PIN.base, liveSame: liveSame(HP) } };
  const tp = {};
  const timed = (k, f) => { const t = Date.now(); const r = f(); tp[k] = { wallSec: (Date.now() - t) / 1000 }; console.log(`[${k}] ${tp[k].wallSec.toFixed(1)} s`); return r; };
  if (PARTS.includes('Z')) out.zero = timed('Z', () => partZ(HP));
  if (PARTS.includes('M')) out.mercury = timed('M', () => partM(HP));
  if (PARTS.includes('T') && out.mercury) out.transfer = timed('T', () => partT(HP, out.mercury));
  if (PARTS.includes('P') && out.mercury && out.transfer) out.periods = timed('P', () => partP(HP, out.mercury, out.transfer));
  if (PARTS.includes('S') && out.mercury) out.sunSelf = timed('S', () => partS(HP, out.mercury));
  if (PARTS.includes('D')) out.flat2d = timed('D', () => partD(HP));
  // 正本に残さない作業の参照(rowRef —— 段 P が読んだ後)を外す
  if (out.transfer) for (const t of out.transfer.table) for (const r of t.rows) delete r.rowRef;
  const gates = {};
  if (out.zero) {
    gates.pinLive = Object.values(out.zero.liveSame).every((z) => z.physicsBodies);
    gates.apsisSelfTest = out.zero.apsisSelfTest.ok === true;
    gates.gLocAnalytic = out.zero.gLocOnly.every((z) => Math.abs(z.ratio - 1) < 2e-3);
  }
  if (out.mercury) {
    gates.mercuryFits = out.mercury.rows.every((r) => r.status === 'fitted' && r.gate === true && !r.nan);
    gates.mercuryH2Roots = out.mercury.h2roots.every((z) => z.status === 'fitted');
  }
  if (out.transfer) gates.transferMeasured = out.transfer.table.length === TRANSFER.length && out.transfer.table.every((t) => t.rows.length === 2 * N_CASES.length && t.rows.every((r) => Number.isFinite(r.pred) && Number.isFinite(r.numErr)));
  if (out.periods) gates.periodTable = out.periods.rows.length === PLANETS.length && out.periods.rows.every((r) => N_CASES.every((C) => r.byN[C.key] && Number.isFinite(r.byN[C.key].sid) && Number.isFinite(r.byN[C.key].anomRate)));
  // 近点周期の二つの出し方(恒星周期と近点率から〔g の補正〕/ 近点の時刻の直線 fit)が、離心率の大きい本(e ≥ 切替値 —— 近点の時刻の検出が素直)で 1e-3 s の内で合う
  if (out.periods) gates.anomCrossCheck = out.periods.rows.filter((r) => r.e >= E_SWITCH).every((r) => N_CASES.every((C) => r.byN[C.key].anom !== null && Math.abs(r.byN[C.key].anomRate - r.byN[C.key].anom) < 1e-3));
  if (out.sunSelf) gates.sunSelfFits = out.sunSelf.rows.every((r) => r.status === 'fitted');
  if (out.flat2d) {
    gates.kickCheck = out.flat2d.kickCheck.every((z) => z.apsRelDiff < 1e-3);
    gates.flat2dFits = out.flat2d.twoD.fits.every((z) => z.status === 'fitted') && out.flat2d.threeD.fits.every((z) => z.status === 'fitted');
    gates.flat2dAnalytic = out.flat2d.twoD.gLocOnly.every((z) => Math.abs(z.ratio - 1) < 2e-3);
  }
  out.gates = gates; out.ok = Object.values(gates).every(Boolean); out.timing = tp; out.stats = STATS;
  const CODE = ['tests/exp-w305b-gfamily.mjs', 'tests/lib-w304e-apsis.mjs', 'tests/lib-w303e-fitstop.mjs', 'tests/exp-w304b-shell.mjs', 'tests/exp-w303b-inertialr2.mjs', 'tests/exp-w299c-planets3d.mjs', 'tests/lib-w299c-planets3d.mjs',
    'tests/exp-w295c-inertial3.mjs', 'tests/lib-core-budget.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第305便b', target: TARGET, code: CODE, inputs: [TARGET, DECL_FILE] }), {
    harnessVersion: HARNESS_VERSION, loadErrors: errors.length,
    ruling: '第95報・AN332 の裁定(アプリは絶対時間・慣性速度は絶対時間の慣性速度を維持・観察者の時計の率 α = c_loc/c₀・読み (ii) n = 2 を先に確認・読み (i) n = +1 は次点・n = 0 は対照・近点では n は決まらない)',
    reading: '統括の検証項目 R200(惑星の n の族 × λ ∝ m の写し —— 水星の k・6 本への移送〔新しい抽出器 + 検出器 B〕・周期の表・🟫 の扱いの得失)・決断事項 AN331・AN330',
    notClaim: ['n が決まった', 'n = 2 が正しい', 'GR を導いた', 'GR と一致した', '43″ が出た', '法則を発見した', 'η が決まった'] });
  out.elapsedS = (Date.now() - t0) / 1000;
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 1) + '\n');
  console.log('gates ' + JSON.stringify(gates));
  console.log('→ ' + path.relative(ROOT, OUT_PATH) + '(' + out.elapsedS.toFixed(1) + ' s)・ok ' + out.ok);
  process.exit(out.ok ? 0 : 1);
}
