// 第303便b(原仮定者の裁定(第93報)④⑤・前便の指摘「1PN 相当は、引きずりだけでは合わない量を埋める為 —— 引きずりを無くすのは本末転倒」・
// 統括の検証項目 R192)—— **源の慣性決定力 r⁻² を引きずりの分母へ(relativeDrag.inertialR2)・公転半径からの太陽の重み・移送の予言・G_loc の候補 の器**
// (Node だけ —— 対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、アプリの三次元の步〔semic・dfmInertialDragStep3・
// dfmCore3 の gLocKick3〕をそのまま走らせる・1 プロセス)。
//
// ■ 裁定(第93報 —— そのまま)
//   「太陽からの慣性決定力は r⁻²、引きずりは r⁻³ とみなせる。各惑星に対する太陽の影響は、公転半径から簡単に得られる。
//    太陽が背景側に含まれる時の W_bg を、そのまま別の惑星に使わない」「それらを踏まえて、G_loc に迫る。『G_loc = G·c_loc/c』も候補」
//
// ■ 変種(在位の本の宣言は変えない —— 器の中の写しで測る。写しは本の宣言から physics.gLoc と fitRecord を外し、引きずりの宣言だけを差し替える)
//   A   公転半径の定数: W_bg = W_ext + M☉/(λ a²)(a は惑星の近似要素の半長径 —— 新しい鍵なし・宣言だけ)
//   B   瞬間の距離: inertialR2 {lambda: λ}(w_I = m_j/(λ(r²+ε²)) を分母へ・W_bg = W_ext)—— 普遍の長さ λ・太陽も受け手(自己の項なし)
//   Bs  B に受け手の自己の決定力 m_i/(λR_i²) を足した形(inertialR2.self:"radius")
//   Br  λ ∝ m: inertialR2 {lambdaRs: k}(λ_j = k·r_s(m_j) —— w_I = c₀²/(2kG(r²+ε²))・源の質量によらない)
//   W_ext = W_cos + W_gal(第302便c の推定 wbgEstimateOf —— 銀河の局所密度は同便の試算 GAL_TRIAL・太陽を含めない)。λ は本の間を**メートルで**運ぶ(本の長さの単位で割る)。
//
// ■ 段(正本 tests/out/inertialr2-w303b.json —— 段 inertialr2-303b)
//   Z 零試験と閉形式: λ → ∞(λ = 1e300)で旧の式とビット同一・λ の走査で差が 1/λ で縮む・二体の閉形式(1 步の u)・少数体の直接法・多粒子(n=80)の PCG と
//     器の中の直接法・cRatio と cLocPow n=1 のビット同一・推定の読み口の単位の別欄・人工二体の近点(固定中心 A/B/Br・自由な二体 B〔太陽も受け手〕/Br〔全質量〕)
//   M 水星(🌡️ の写し —— G_loc なし・semic・8 公転・検出器 B)で各変種の λ を照合規約の 43.0″/世紀に割線で合わせる(停止は照合許容の 1/10・
//     7 桁に丸めて h・h/2・h/4 で測り直す —— 門は |残差| + h/2 の差 ≤ 許容)。参考の行: B を 1PN の式 + EPM2011 の追加の標的に合わせた λ
//   T 同じ λ(A・B・Bs・Br・参考)を 🌋🔴🏀🟡🔷💙 の写しへ移送(再フィットしない)→ 近点率の差の予言と標的(1PN の式 + EPM2011 の追加 ± σ)の差を
//     σ と数値の誤差(h/h2/h4)の両方で(σ が数値の誤差より小さい行は「数値の精度の内」—— σ の合否と言わない)
//   N G_loc の候補(変種 B の上): n ∈ {0, +1〔cRatio —— G·c_loc/c₀〕, −1, −2, +2, −3} —— 水星で λ を合わせ直し・移送の予言・近点のうち引きずりが担う割合
//     (門: 引きずりが主 —— 過半)・恒星周期と近点周期と離心率の変化・帳簿(W・gLocWork・R_E)
//   E 地球–月(🌦️ —— 定数の W_bg のフィット)と冥王星–カロン(🟪 —— 周期の標的)で各読みが要る λ の逆算(標的の量が近日点の 1PN と違う)・
//     🌔(太陽が背景側 —— env.bodies に 1 au の太陽)へ水星の λ を移したときの月の ξ と走行(🌦️ の W_bg を他の本へ写さない —— 写すのは λ)
//
// ■ しないこと・言わないこと
//   ・在位の本の宣言を変えない(器の写しだけ)。W_bg を本から本へ写さない(写すのは λ)。標的(照合規約 43.0″/世紀)を書き換えない。
//   ・形が同じこと(距離・離心率の依存)と値が合うこと(量・窓・σ・数値の誤差)を分けて数で書く。届かないものは「この探索範囲では未達 —— 次の見直し」。
//
// 実行(Node だけ・1 プロセス):
//   node tests/exp-w303b-inertialr2.mjs          → 正本 tests/out/inertialr2-w303b.json(W303B_OUT で出力先を変える・W303B_PARTS=Z,M,T,N,E で段を選ぶ —— 正本は全段・
//   W303B_QUICK=1 は刻みを h・h/2 に縮めた試走 —— 正本にしない)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as PL from './exp-w299c-planets3d.mjs';
import * as P3 from './lib-w299c-planets3d.mjs';
import * as B302 from './exp-w302b-gloc.mjs';
import * as EMO from './exp-w300b-emonly.mjs';
import * as I3 from './exp-w295c-inertial3.mjs';   // 🟪 の公転周期(runPair —— フィットの器 exp-w296b-fit と同じ抽出器)   // 🌦️ の近地点の周期と恒星月(runEm3・windowsOf —— 118 公転窓)
const REGEN_SCOPE = {"presets":"all","roots":["$","DT","FIT_COND_KEYS","FIT_COND_VERSION","FIT_KNOB_KEYS","FIT_NUMERICS_KEYS","FIT_RECORD_KEYS","FIT_RECORD_VERSION","FIT_RECORD_VERSIONS","FIT_RESIDUAL_KEYS","FIT_TARGET_KEYS","FIT_TOL_KEYS","HP.DRAG_CORE_RMAX_FACTOR","HP.DRAG_CORE_VERSION","HP.FIT_COND_VERSION","HP.GLOC_VERSION","HP.REL_DRAG_COMPOSE_DEFAULT","HP.REL_DRAG_I2_VERSION","HP.REL_DRAG_INERTIAL_VERSION","HP.REL_DRAG_SOLVE_FROM_DEFAULT","HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.dragCoreState","HP.fitCondSig","HP.gLocPeriAdvance","HP.gLocState","HP.geoEffectiveMode","HP.geoLawOfSim","HP.inertialDragLedgerOf","HP.inertialDragState","HP.inertialR2Q","HP.inertialR2State","HP.sim","HP.synodic","HP.validateFitRecord","HP.validatePreset","HP.wbgEstimateOf","LAWS","T","ab","ch","ctx","cw","fmt","pnSource","synUniform","validateFitRecord"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w303b-inertialr2-1';
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const PARTS = (process.env.W303B_PARTS || 'Z,M,T,N,E').split(',');
const QUICK = process.env.W303B_QUICK === '1';
export const DIVS = QUICK ? [1, 2] : [1, 2, 4];
const clone = (x) => JSON.parse(JSON.stringify(x));
const find = (HP, id) => HP.allPresets().find((q) => q.id === id);
const ARCSEC = 180 * 3600 / Math.PI;
export const N_WIN = 8;                              // 窓(公転)—— 🌡️ の fitRecord と同じ
export const TARGET_APS = 43.0;                      // 照合規約の値(″/世紀)—— 書き換えない
export const TOL_APS = 0.0009;                       // 照合許容の宣言(″/世紀)
export const STOP_APS = TOL_APS / 10;                // 割線の停止の幅(許容の 1/10)
export const MERCURY = 'mercurySunInertial3d';
export const TRANSFER = Object.freeze(['venusSunInertial3d', 'marsSunInertial3d', 'jupiterSunInertial3d', 'saturnSunInertial3d', 'uranusSunInertial3d', 'neptuneSunInertial3d']);
/** 器の中だけの試算(本に宣言しない)—— 第302便c の器 exp-w302c-wbgest の GAL_TRIAL と同じ値(太陽近傍の局所の全密度 0.097 M☉/pc³・銀河中心距離 8.2 kpc)。 */
export const GAL_TRIAL = Object.freeze({ rhoSI: 0.097 * 1.98847e30 / Math.pow(3.0857e16, 3), RSI: 8.2 * 3.0857e19,
  source: '第302便c の試算と同じ値(McKee, Parravano & Hollenbach 2015 の局所の全密度・Bland-Hawthorn & Gerhard 2016 の R₀ の転記 —— 原表は未取得)' });
/**
 * 近日点の**追加の**歳差(GR を含む暦表のモデルの残り)[″/世紀]: EPM2011(Pitjeva & Pitjev 2013, MNRAS 432, 3431 —— 原単位 mas/年 × 0.1)。
 * σ は原資料の σ(形式誤差の数倍の現実的な誤差)。**一次資料での確認は未(sigma_primary=unverified)**。天王星・海王星の行は無い(標的は 1PN の式だけ・σ なし)。
 */
export const A1 = Object.freeze({
  mercury: Object.freeze({ v: -0.0020, s: 0.0030 }), venus: Object.freeze({ v: 0.0026, s: 0.0016 }), earth: Object.freeze({ v: 0.00019, s: 0.00019 }),
  mars: Object.freeze({ v: -0.000020, s: 0.000037 }), jupiter: Object.freeze({ v: 0.0587, s: 0.0283 }), saturn: Object.freeze({ v: -0.00032, s: 0.00047 }) });
export const A1_SOURCE = 'EPM2011(Pitjeva & Pitjev 2013, MNRAS 432, 3431)の近日点の追加の歳差 —— σ は原資料の σ・一次資料での確認は未(sigma_primary=unverified)';
export const VARIANTS = Object.freeze([
  { key: 'A', label: 'A 公転半径の定数 W_bg = W_ext + M☉/(λa²)', param: 'lambdaM' },
  { key: 'B', label: 'B 瞬間の距離 inertialR2 {lambda}(普遍の長さ・太陽も受け手・自己の項なし)', param: 'lambdaM' },
  { key: 'Bs', label: 'Bs B + 受け手の自己の決定力 m_i/(λR_i²)(self:"radius")', param: 'lambdaM' },
  { key: 'Br', label: 'Br λ ∝ m(inertialR2 {lambdaRs: k} —— λ_j = k·r_s(m_j))', param: 'k' },
]);
export const N_CASES = Object.freeze([
  { key: 'n0', n: 0, gl: null, label: 'G_loc なし(n=0)' },
  { key: 'n1', n: 1, gl: { law: 'cRatio' }, label: 'G·c_loc/c₀(n=+1 —— 第93報の候補・law:"cRatio")' },
  { key: 'nm1', n: -1, gl: { law: 'cLocPow', n: -1 }, label: 'G·(c₀/c_loc)(n=−1)' },
  { key: 'nm2', n: -2, gl: { law: 'timeRatio' }, label: 'G·(c₀/c_loc)²(n=−2)' },
  { key: 'n2', n: 2, gl: { law: 'kappaC2' }, label: 'κ·c_loc²(n=+2)' },
  { key: 'nm3', n: -3, gl: { law: 'cLocPow', n: -3 }, label: 'G·(c₀/c_loc)³(n=−3 —— 引きずり ≈ 0 の記録)' },
]);

/* ── 単位・宣言の写し ── */
export const lenM = (p) => Math.pow(10, p.scaleExp.L);                // 本の長さ 1 単位のメートル
export const keyOf = (id) => P3.planetOf(id).key;
/** 惑星の近似要素の半長径(本の単位)—— 変種 A の「公転半径」。 */
export const aBook = (p) => P3.planetOf(p.id).el.a * P3.AU_M / lenM(p);
/** 太陽のシュヴァルツシルト半径 r_s = 2GM/c₀²(本の単位 —— 宣言の G・c₀・太陽の質量)。 */
export const rsBook = (p, m) => 2 * p.physics.G * (m === undefined ? p.bodies[0].m : m) / (p.physics.cLight * p.physics.cLight);
/** W_ext = W_cos + W_gal(本の単位 —— html の wbgEstimateOf・銀河は GAL_TRIAL の試算)。 */
export function wExtOf(HP, p) {
  const q = clone(p); q.physics.relativeDrag = { law: 'inertial', Wbg: 1, eps: p.physics.relativeDrag.eps, history: 'positions', pairs: p.physics.relativeDrag.pairs,
    env: { galaxy: { rhoSI: GAL_TRIAL.rhoSI, RSI: GAL_TRIAL.RSI } } };
  const e = HP.wbgEstimateOf(q);
  return { book: e.Wcos.book + e.Wgal.book, SI: e.Wcos.SI + e.Wgal.SI, WcosBook: e.Wcos.book, WgalBook: e.Wgal.book };
}
/** 本の写し(G_loc と fitRecord を外す —— 宣言の他の部分はそのまま)。 */
export function baseOf(HP, id) { const q = clone(find(HP, id)); delete q.physics.gLoc; delete q.fitRecord; return q; }
/**
 * 変種の写し。v = {kind:'off'} | {kind:'A', lambdaM} | {kind:'B'|'Bs', lambdaM} | {kind:'Br', k} | {kind:'Wbg', Wbg}・gl(G_loc の宣言 —— null は無し)・
 * extra(inertialR2 に足す鍵 —— 器の対照だけ)。W_ext は呼び手が渡す(本ごと)。
 */
export function variantOf(p, v, gl, wExt) {
  const q = clone(p), rd0 = q.physics.relativeDrag;
  const rd = { law: 'inertial', eps: rd0.eps, history: 'positions', pairs: rd0.pairs };
  if (rd0.env) rd.env = clone(rd0.env);
  if (v.kind === 'off') { rd.Wbg = null; rd.enabled = false; }
  else if (v.kind === 'Wbg') rd.Wbg = v.Wbg;
  else if (v.kind === 'A') rd.Wbg = wExt + q.bodies[0].m / ((v.lambdaM / lenM(q)) * aBook(q) ** 2);
  else {
    rd.Wbg = wExt;
    rd.inertialR2 = Object.assign(v.kind === 'Br' ? { lambdaRs: v.k } : { lambda: v.lambdaM / lenM(q) }, v.kind === 'Bs' ? { self: 'radius' } : {}, v.extra || {});
  }
  q.physics.relativeDrag = rd;
  if (gl) q.physics.gLoc = clone(gl); else delete q.physics.gLoc;
  return q;
}
const hOf = (p) => P3.stepsOf(p.timeRef.pRef).h;
/** 1 走行(runPl3 —— 8 公転・検出器 B)。走らせた sim を捕まえて帳簿(R_E・W・gLocWork)と ξ の読み口も返す。 */
export function measure(HP, q, dt, N = N_WIN) {
  const C3 = HP.coord3d, orig = C3.makeSim; let S = null;
  C3.makeSim = function () { S = orig.apply(this, arguments); return S; };
  let R;
  try { R = PL.runPl3(HP, q, { dt, revMax: N }); } finally { C3.makeSim = orig; }
  const w = PL.windowOf(R, N, Math.pow(10, q.scaleExp.T));
  const led = S ? HP.inertialDragLedgerOf(S) : null, gl = S ? HP.gLocState(S) : null, i2 = S ? HP.inertialR2State(S) : null;
  return { aps: w.apsArcsecPerCentury, periodDays: w.periodDays, ecc: w.ecc, nPeri: w.nPeri, steps: R.steps, nan: R.nan, complete: w.complete,
    anomDays: anomPeriodDays(R, N, q), ledger: led ? { work: led.work, RE: led.RE, gLocWork: led.gLocWork === undefined ? null : led.gLocWork } : null,
    gLocWork: gl ? gl.work : null, xiMax: i2 ? i2.xiMax : null, xIMax: i2 ? i2.xIMax : null };
}
// 近点周期(窓の中の近点の時刻の直線 fit の傾き —— 日)
function anomPeriodDays(R, N, q) {
  const rev = R.ev.rev; if (rev.length < N) return null;
  const pe = R.ev.peri.filter((z) => z.t <= rev[N - 1]); if (pe.length < 2) return null;
  const n = pe.length, xs = pe.map((_, i) => i), ys = pe.map((z) => z.t), mx = (n - 1) / 2, my = ys.reduce((s, v) => s + v, 0) / n;
  let sxy = 0, sxx = 0; for (let i = 0; i < n; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; }
  return sxy / sxx * Math.pow(10, q.scaleExp.T) / P3.DAY_S;
}

/* ── 1PN の式(比較の物差し —— 観測ではない)と標的 ── */
/** 二体の 1PN の近点の式 6πG(M+m)/(c₀²a(1−e²)) を本の初期の接触要素で ″/世紀(ケプラー周期で換算)。 */
export function pn1Formula(p3) {
  const B = p3.bodies, mu = p3.physics.G * (B[0].m + B[1].m), c = p3.physics.cLight;
  const rv = [B[1].x - B[0].x, B[1].y - B[0].y, (B[1].z || 0) - (B[0].z || 0)], vv = [B[1].vx - B[0].vx, B[1].vy - B[0].vy, (B[1].vz || 0) - (B[0].vz || 0)];
  const r = Math.hypot(...rv), v2 = vv[0] ** 2 + vv[1] ** 2 + vv[2] ** 2, a = 1 / (2 / r - v2 / mu);
  const L = [rv[1] * vv[2] - rv[2] * vv[1], rv[2] * vv[0] - rv[0] * vv[2], rv[0] * vv[1] - rv[1] * vv[0]], h2 = L[0] ** 2 + L[1] ** 2 + L[2] ** 2;
  const e = Math.sqrt(Math.max(0, 1 - h2 / (mu * a))), P = 2 * Math.PI * Math.sqrt(a ** 3 / mu);
  const T = Math.pow(10, p3.scaleExp.T), century = 36525 * 86400 / T;
  return { a, e, P, mu, arcsecCy: 6 * Math.PI * mu / (c * c * a * (1 - e * e)) * century / P * ARCSEC, perOrbitRad: 6 * Math.PI * mu / (c * c * a * (1 - e * e)) };
}
/** 標的(1PN の式 + EPM2011 の追加 ± σ)。EPM2011 の行が無い惑星は 1PN の式だけ(σ なし)。 */
export function targetOf(p) {
  const f = pn1Formula(p), k = keyOf(p.id), a1 = A1[k] || null;
  return { pn1: f.arcsecCy, a1: a1 ? a1.v : null, sigma: a1 ? a1.s : null, value: f.arcsecCy + (a1 ? a1.v : 0), a: f.a, e: f.e, source: a1 ? A1_SOURCE : '1PN の式だけ(EPM2011 の行なし —— 標的の観測行なし)' };
}

/* ── 割線(1 次元の根)── */
// f(x) = 差 − 標的。x0 は解析の初期値・need = 標的 − G_loc の分(引きずりが担う量 —— 近点は x に比例に近い)
function secant(evalF, x0, need, stop, log, maxIt = 12) {
  const it = [];
  let f0 = evalF(x0); it.push({ x: x0, f: f0 });
  if (Math.abs(f0) <= stop) return { x: x0, f: f0, iters: it };
  let x1 = x0 * (need / (need + f0)), f1 = evalF(x1); it.push({ x: x1, f: f1 });
  for (let k = 0; k < maxIt && Math.abs(f1) > stop; k++) {
    const x2 = x1 - f1 * (x1 - x0) / (f1 - f0);
    x0 = x1; f0 = f1; x1 = x2; f1 = evalF(x1); it.push({ x: x1, f: f1 });
  }
  if (log) log(`  割線 ${it.length} 回 → x ${x1.toPrecision(10)}・f ${f1.toExponential(3)}`);
  return { x: x1, f: f1, iters: it };
}
const r7 = (x) => Number(Number(x).toPrecision(7));

/* ── 段 Z: 零試験と閉形式 ── */
// 1 步の u を読む(合成則 solve の作業配列 —— 步の後に残る解)。preset は受理の前の形
function stepU(HP, preset, steps) {
  const v = HP.validatePreset(clone(preset)); if (!v.ok) throw new Error('validatePreset: ' + JSON.stringify(v.errors).slice(0, 300));
  const S = HP.coord3d.makeSim(); S.build(clone(v.preset));
  const dt = preset.physics.stepDt || 0.01;
  for (let k = 0; k < steps; k++) S.step(dt);
  return S;
}
const fpS = (S) => { let h = 0x811c9dc5; const f = new Float64Array(1), u8 = new Uint8Array(f.buffer);
  for (const k of ['x', 'y', 'z', 'vx', 'vy', 'vz']) { const A = S[k]; if (!A) continue; for (let i = 0; i < S.n; i++) { f[0] = A[i]; for (let j = 0; j < 8; j++) h = Math.imul(h ^ u8[j], 0x01000193) >>> 0; } }
  return h.toString(16); };
/** 三次元の多体の人工の本(全粒子 free・乱数は線形合同法 —— 決定的)。 */
export function toyMany(n, o = {}) {
  let s = 12345; const rnd = () => { s = (Math.imul(s, 1103515245) + 12345) >>> 0; return s / 4294967296; };
  const bodies = [];
  for (let i = 0; i < n; i++) bodies.push({ type: 'single', m: 0.5 + rnd(), x: 10 * (rnd() - 0.5), y: 10 * (rnd() - 0.5), z: 10 * (rnd() - 0.5), vx: rnd() - 0.5, vy: rnd() - 0.5, vz: rnd() - 0.5,
    spin: 0, radius: 0.05, pinned: false });
  const rd = Object.assign({ law: 'inertial', Wbg: o.Wbg || 1e-3, eps: 0.3, history: 'positions', pairs: 'all' }, o.rd || {});
  return { id: 'w303bToyMany', name: 'w303b many', emoji: '🧪', group: '原理', sampleClass: 'principle', integrator: 'semi', description: 'w303b toy many', camera: { scale: 30, x: 0, y: 0 },
    world: { boundary: 'none', size: 200 }, physics: { coord: '3d', G: 1, D0: 0, kFrame: 0, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, kappaT: 1 / 900, cLight: 30, bM: 1, etaRad: 0, pRad: 4,
      gravityX: 0, gravityY: 0, massFloor: 1e-9, geoPN: 3, lambdaPN: 0, pnAlpha: 1.5, radiusScale: 1, softening: 0.3, softeningFloor: 0.3, radiusFloor: 0.001, timeScale: 1,
      contactMode: 'none', stateCarry: 'double', stepDt: 0.002, relativeDrag: rd }, bodies };
}
// 器の中の直接法(密行列のガウス消去 —— 部分ピボット)で (I+L)u = s を解く。行の対角は 1 + Σ_j a_ij + x_I
function directSolve3(S, e2, C, i2) {
  const n = S.n, m = S.m, X = S._rdQX || S.x, Y = S._rdQY || S.y, Z = S._rdQZ || S.z;
  const M = new Float64Array(n * n), b = [new Float64Array(n), new Float64Array(n), new Float64Array(n)], V = [S.vx, S.vy, S.vz];
  for (let i = 0; i < n; i++) {
    let deg = 0;
    for (let j = 0; j < n; j++) {
      if (j === i) continue;
      const dx = X[j] - X[i], dy = Y[j] - Y[i], dz = Z[j] - Z[i], r2 = dx * dx + dy * dy + dz * dz, r = Math.sqrt(r2), s = r2 + e2, a = C * m[j] * (r / (s * s));
      M[i * n + j] = -a; deg += a;
      for (let c = 0; c < 3; c++) b[c][i] += a * (V[c][j] - V[c][i]);
    }
    let wI = 0;
    if (i2) for (let j = 0; j < n; j++) { if (j === i) continue; const dx = X[j] - X[i], dy = Y[j] - Y[i], dz = Z[j] - Z[i]; wI += m[j] / i2.lambda / (dx * dx + dy * dy + dz * dz + e2); }
    M[i * n + i] = 1 + deg + C * wI;
  }
  // ガウス消去(3 右辺)
  const A = Float64Array.from(M), B = b.map((v) => Float64Array.from(v));
  for (let k = 0; k < n; k++) {
    let p = k; for (let i = k + 1; i < n; i++) if (Math.abs(A[i * n + k]) > Math.abs(A[p * n + k])) p = i;
    if (p !== k) { for (let j = 0; j < n; j++) { const t = A[k * n + j]; A[k * n + j] = A[p * n + j]; A[p * n + j] = t; } for (const v of B) { const t = v[k]; v[k] = v[p]; v[p] = t; } }
    for (let i = k + 1; i < n; i++) { const f = A[i * n + k] / A[k * n + k]; if (f === 0) continue; for (let j = k; j < n; j++) A[i * n + j] -= f * A[k * n + j]; for (const v of B) v[i] -= f * v[k]; }
  }
  for (let i = n - 1; i >= 0; i--) for (const v of B) { let s = v[i]; for (let j = i + 1; j < n; j++) s -= A[i * n + j] * v[j]; v[i] = s / A[i * n + i]; }
  return B;
}
/** Z1 λ → ∞(1e300)は旧の式とビット同一(x_I が非正規化数の桁 —— 対角に足しても丸めで消える)・λ の走査で 1 步の u の差が 1/λ で縮む。 */
export function zLambdaInf(HP, steps = 2000) {
  const mer = baseOf(HP, MERCURY), W0 = 221.1205993960312;
  const q0 = variantOf(mer, { kind: 'Wbg', Wbg: W0 }, null), qInf = clone(q0); qInf.physics.relativeDrag.inertialR2 = { lambda: 1e300 };
  const S0 = stepU(HP, q0, steps), S1 = stepU(HP, qInf, steps);
  const lambdaInf = { steps, fpOff: fpS(S0), fpInf: fpS(S1), bitSame: fpS(S0) === fpS(S1), i2Steps: S1.inertialDragI2N, offHasNoKeys: S0.inertialDragI2N === undefined };
  // 走査は x_I = c Σ w_I ≪ 1 の領域(W_bg 221 の写し —— 1 步の u の相対の差 ≈ x_I ∝ 1/λ)
  const scan = [10, 100, 1000].map((lam) => { const q = clone(q0); q.physics.relativeDrag.inertialR2 = { lambda: lam };
    const Sa = stepU(HP, q0, 3), Sb = stepU(HP, q, 3), du = Math.hypot(Sb._rdUX[1] - Sa._rdUX[1], Sb._rdUY[1] - Sa._rdUY[1], Sb._rdUZ[1] - Sa._rdUZ[1]), u = Math.hypot(Sa._rdUX[1], Sa._rdUY[1], Sa._rdUZ[1]);
    return { lambda: lam, relDiffU: du / u }; });
  return { lambdaInf, lambdaScan: { rows: scan, logSlope: Math.log10(scan[2].relDiffU / scan[0].relDiffU) / Math.log10(scan[2].lambda / scan[0].lambda) } };
}
/** Z2 二体の閉形式(1 步の u —— 行 (1 + x_I,i + deg_i) u_i − a_ij u_j = s_i を 2×2 で解いた式)と ξ = Σw/(W_bg + Σw_I)。 */
export function zClosedForm2(HP) {
  const mer = baseOf(HP, MERCURY), lam = 1e-4, q = variantOf(mer, { kind: 'B', lambdaM: lam * lenM(mer) }, null, 1e-9);
  const S = stepU(HP, q, 3), C = 1 / q.physics.relativeDrag.Wbg, eps = q.physics.relativeDrag.eps, e2 = eps * eps;
  const X = S._rdQX, Y = S._rdQY, Z = S._rdQZ, m = S.m;
  const dx = X[1] - X[0], dy = Y[1] - Y[0], dz = Z[1] - Z[0], r2 = dx * dx + dy * dy + dz * dz, r = Math.sqrt(r2), s = r2 + e2, K = r / (s * s);
  const a01 = C * m[1] * K, a10 = C * m[0] * K, x0 = C * m[1] / lam / s, x1 = C * m[0] / lam / s;
  const d0 = 1 + x0 + a01, d1 = 1 + x1 + a10, det = d0 * d1 - a01 * a10;
  const res = [];
  for (const [k, V] of [['x', 'vx'], ['y', 'vy'], ['z', 'vz']]) {
    const s0 = a01 * (S[V][1] - S[V][0]), s1 = a10 * (S[V][0] - S[V][1]);
    const u0 = (s0 * d1 + a01 * s1) / det, u1 = (s1 * d0 + a10 * s0) / det;
    const U = k === 'x' ? S._rdUX : k === 'y' ? S._rdUY : S._rdUZ;
    res.push(Math.abs(U[0] - u0) / Math.max(Math.abs(u0), 1e-300), Math.abs(U[1] - u1) / Math.max(Math.abs(u1), 1e-300));
  }
  // 読み口の ξ は今の位置(步の後)で作る —— 同じ位置で ξ = Σw/(W_bg + Σw_I) = λ(r² + ε²)𝒦/(1 + W_bg λ(r² + ε²)/m)(遠方 r ≫ ε で λ/r)
  const ex = S.x[1] - S.x[0], ey = S.y[1] - S.y[0], ez = S.z[1] - S.z[0], q2 = ex * ex + ey * ey + ez * ez, qr = Math.sqrt(q2), qs = q2 + e2, qK = qr / (qs * qs), Wb = q.physics.relativeDrag.Wbg;
  const st = HP.inertialR2State(S), xiForm = lam * qs * qK / (1 + Wb * lam * qs / m[0]), xiSunForm = lam * qs * qK / (1 + Wb * lam * qs / m[1]);
  const xM = st.receivers.find((z) => z.i === 1).xi, xS = st.receivers.find((z) => z.i === 0).xi;
  return { lambda: lam, relErrMax: Math.max(...res), xiReadout: xM, xiForm, xiOverLamR: xiForm / (lam / qr), xiSun: xS, xiSunForm, xiSunOverMercury: xS / xM };
}
/** Z3 少数体(n=5 —— 本体は直接法)と多粒子(n=80 —— 宣言 solver:"network-pcg-v1" の PCG)を器の中の直接法(部分ピボット)と比べる。 */
export function zSolver(HP, key, n, rdx) {
  const lam = 0.5, tq = toyMany(n, { rd: Object.assign({ inertialR2: { lambda: lam } }, rdx) });
  const S = stepU(HP, tq, 2), e2 = 0.3 * 0.3, C = 1 / tq.physics.relativeDrag.Wbg;
  const B = directSolve3(S, e2, C, { lambda: lam }), U = [S._rdUX, S._rdUY, S._rdUZ];
  let mx = 0, um = 0; for (let c = 0; c < 3; c++) for (let i = 0; i < n; i++) { mx = Math.max(mx, Math.abs(U[c][i] - B[c][i])); um = Math.max(um, Math.abs(B[c][i])); }
  const cs = HP.inertialDragState(S).compose;
  return { key, n, relErrMax: mx / um, method: cs.method, res: cs.res, xiMax: HP.inertialR2State(S).xiMax };
}
/** Z4 cRatio と cLocPow n=1 のビット同一(🌡️ の写し・引きずりあり)と正準形。 */
export function zCRatio(HP, steps = 2000) {
  const mer = baseOf(HP, MERCURY), q0 = variantOf(mer, { kind: 'Wbg', Wbg: 221.1205993960312 }, null);
  const a = clone(q0), b = clone(q0); a.physics.gLoc = { law: 'cRatio' }; b.physics.gLoc = { law: 'cLocPow', n: 1 };
  const Sa = stepU(HP, a, steps), Sb = stepU(HP, b, steps), va = HP.validatePreset(clone(a));
  return { steps, bitSame: fpS(Sa) === fpS(Sb), fp: fpS(Sa), canon: va.ok ? va.preset.physics.gLoc : null, evals: HP.gLocState(Sa).evals };
}
/** Z5 推定の読み口の単位の別欄(r⁻² と r⁻³)・W_bg の欄(total)は inertialR2 の宣言で変わらない・Σw_I の欄。 */
export function zUnits(HP) {
  const mer = baseOf(HP, MERCURY), q0 = variantOf(mer, { kind: 'Wbg', Wbg: 221.1205993960312 }, null);
  const qa = variantOf(mer, { kind: 'B', lambdaM: 4000 }, null, 1e-9), e1 = HP.wbgEstimateOf(q0), e2 = HP.wbgEstimateOf(qa);
  const row = e1.perSource.rows.find((z) => z.index === 0), B0 = mer.bodies[0], B1 = mer.bodies[1], eps = mer.physics.relativeDrag.eps;
  const d = Math.hypot(B0.x - B1.x, B0.y - B1.y, B0.z - B1.z), qq = d * d + eps * eps;
  return { r2: row.r2.book, r2Form: B0.m / qq, r3: row.r3.book, r3Form: B0.m * d / (qq * qq), unitsR2: e1.perSource.units.r2, unitsR3: e1.perSource.units.r3,
    totalSame: e1.total.book === e2.total.book, wI: e2.inertialR2 ? e2.inertialR2.wI.book : null, wIForm: B0.m / (4000 / lenM(mer)) / qq };
}
export function partZ(HP, log = console.log) {
  const out = {};
  Object.assign(out, zLambdaInf(HP));
  log(`Z1 λ=1e300 ビット同一 ${out.lambdaInf.bitSame}・走査の傾き ${out.lambdaScan.logSlope.toFixed(4)}(期待 −1)`);
  out.closedForm2 = zClosedForm2(HP);
  log(`Z2 二体の閉形式の相対差 ${out.closedForm2.relErrMax.toExponential(2)}・ξ(水星)${out.closedForm2.xiReadout.toExponential(6)} = λ(r²+ε²)𝒦 ${out.closedForm2.xiForm.toExponential(6)}・ξ(太陽)${out.closedForm2.xiSun.toExponential(6)}`);
  for (const [key, n, rdx] of [['few5', 5, {}], ['pcg80', 80, { solver: 'network-pcg-v1', solverTol: 1e-13 }]]) {
    out[key] = zSolver(HP, key, n, rdx);
    log(`Z3 ${key}: 本体(${out[key].method})と器の直接法の差 ${out[key].relErrMax.toExponential(2)}・残差 ${out[key].res.toExponential(2)}`);
  }
  out.cRatio = zCRatio(HP);
  log(`Z4 cRatio = cLocPow n=1 ビット同一 ${out.cRatio.bitSame}・正準形 ${JSON.stringify(out.cRatio.canon)}`);
  out.units = zUnits(HP);
  log(`Z5 r⁻² ${out.units.r2.toExponential(6)}(式 ${out.units.r2Form.toExponential(6)} ${out.units.unitsR2})・r⁻³ ${out.units.r3.toExponential(6)}(${out.units.unitsR3})・W_bg の欄 不変 ${out.units.totalSame}`);
  // Z6 人工二体の近点(器 exp-w302b-gloc の toyPreset・runCase —— μ=1・c₀=30・a=1・e=0.2・ε=0.001・20 公転・h/h2/h4)
  out.toy = partZtoy(HP, log);
  return out;
}
function partZtoy(HP, log) {
  const T = B302.TOY, lam = 1e-4, rs1 = 2 * T.G * T.M / (T.c * T.c), p = T.a * (1 - T.e * T.e);
  const conds = [
    { key: 'fixA', base: { pinned: true, m: 1e-6, d3: true }, drag: { law: 'inertial', Wbg: T.M / (lam * T.a * T.a), eps: T.eps, history: 'positions', pairs: 'all' },
      analytic: 3 * Math.PI * lam * (1 + T.e * T.e / 4) / (T.a * Math.pow(1 - T.e * T.e, 3)), note: '定数の W = M/(λa²): 3πλ(1+e²/4)/(a(1−e²)³)' },
    { key: 'fixB', base: { pinned: true, m: 1e-6, d3: true }, drag: { law: 'inertial', Wbg: 1e-12, eps: T.eps, history: 'positions', pairs: 'all', inertialR2: { lambda: lam } },
      analytic: Math.PI * lam / p, note: '瞬間の距離 ξ = λ/r: πλ/(a(1−e²))' },
    { key: 'fixBr', base: { pinned: true, m: 1e-6, d3: true }, drag: { law: 'inertial', Wbg: 1e-12, eps: T.eps, history: 'positions', pairs: 'all', inertialR2: { lambdaRs: lam / rs1 } },
      analytic: Math.PI * lam / p, note: 'λ ∝ m(k = λ/r_s(M)): πk r_s(M)/(a(1−e²))' },
    { key: 'freeB', base: { pinned: false, m: 0.25, d3: true }, drag: { law: 'inertial', Wbg: 1e-12, eps: T.eps, history: 'positions', pairs: 'all', inertialR2: { lambda: lam } },
      analytic: 2 * Math.PI * lam / p, note: '普遍の長さ・両方が受け手(質量によらず ξ = λ/r ずつ): 2πλ/(a(1−e²))' },
    { key: 'freeBr', base: { pinned: false, m: 0.25, d3: true }, drag: { law: 'inertial', Wbg: 1e-12, eps: T.eps, history: 'positions', pairs: 'all', inertialR2: { lambdaRs: lam / rs1 } },
      analytic: Math.PI * (lam / rs1) * (2 * T.G * (T.M + 0.25) / (T.c * T.c)) / p, note: 'λ ∝ m・両方が受け手: πk r_s(M+m)/(a(1−e²))(全質量)' },
  ];
  const rows = [];
  for (const C of conds) {
    const runs = DIVS.map((div) => {
      const ctl = B302.toyPreset(Object.assign({}, C.base)), cur = B302.toyPreset(Object.assign({}, C.base, { drag: C.drag }));
      const P = 2 * Math.PI * Math.sqrt(T.a ** 3 / ctl.mu), dt = P / (T.perOrbit * div);
      const a = B302.runCase(HP, ctl, { dt, tEnd: T.orbits * P, ci: 0, oi: 1, mu: ctl.mu }), b = B302.runCase(HP, cur, { dt, tEnd: T.orbits * P, ci: 0, oi: 1, mu: cur.mu });
      return { div, dVarpi: b.dVarpiPeri - a.dVarpiPeri, dPAnom: b.pAnom - a.pAnom, dPSid: b.pSid - a.pSid, dEcc: b.ecc - a.ecc, pAnom: a.pAnom };
    });
    const last = runs[runs.length - 1];
    rows.push({ key: C.key, note: C.note, analytic: C.analytic, runs, ratio: last.dVarpi / C.analytic });
    log(`Z6 ${C.key}: Δϖ ${last.dVarpi.toExponential(5)} rad/周 ÷ 解析 ${C.analytic.toExponential(5)} = ${(last.dVarpi / C.analytic).toFixed(5)}・恒星周期の変化 ${last.dPSid.toExponential(3)}・近点周期の変化 ${last.dPAnom.toExponential(3)}`);
  }
  return { toy: { G: T.G, M: T.M, c: T.c, a: T.a, e: T.e, eps: T.eps, orbits: T.orbits, perOrbit: T.perOrbit, lambda: lam, rs: rs1 }, rows };
}

/* ── 段 M: 水星で各変種の λ を合わせる ── */
export function fitMercury(HP, V, o, log = () => {}) {
  // o: {gl, target, x0}(gl は G_loc の宣言・target は標的 ″/世紀・x0 は初期値)
  const p0 = baseOf(HP, MERCURY), h = hOf(p0), wExt = wExtOf(HP, p0).book, gl = o.gl || null, target = o.target === undefined ? TARGET_APS : o.target;
  const ctl = measure(HP, variantOf(p0, { kind: 'off' }, null, wExt), h);
  const glOnly = gl ? measure(HP, variantOf(p0, { kind: 'off' }, gl, wExt), h) : ctl;
  const gPart = glOnly.aps - ctl.aps, need = target - gPart;
  const mk = (x) => variantOf(p0, V.param === 'k' ? { kind: V.key, k: x } : { kind: V.key, lambdaM: x }, gl, wExt);
  if (!(need > 0)) return { variant: V.key, gl, reachable: false, why: 'G_loc だけで標的を越える —— 正の λ では届かない(引きずりは近点を進める向き)', gLocPart: gPart };
  const evalF = (x) => measure(HP, mk(x), h).aps - ctl.aps - target;
  const sc = secant(evalF, o.x0 * need / TARGET_APS, need, STOP_APS, log);
  const x = r7(sc.x), runs = DIVS.map((d) => ({ div: d, ctl: d === 1 ? ctl : measure(HP, variantOf(p0, { kind: 'off' }, null, wExt), h / d), cur: measure(HP, mk(x), h / d),
    glo: gl ? (d === 1 ? glOnly : measure(HP, variantOf(p0, { kind: 'off' }, gl, wExt), h / d)) : null }));
  const diffs = runs.map((r) => r.cur.aps - r.ctl.aps), last = diffs[diffs.length - 1];
  const glParts = runs.map((r) => r.glo ? r.glo.aps - r.ctl.aps : 0);
  const r = { variant: V.key, label: V.label, gl, target, reachable: true, x, param: V.param, wExt, iters: sc.iters, h,
    diff: diffs[0], diffH2: diffs[1], diffH4: diffs[2] === undefined ? null : diffs[2], residual: diffs[0] - target, h2gap: Math.abs(diffs[1] - diffs[0]),
    h4gap: diffs[2] === undefined ? null : Math.abs(diffs[2] - diffs[1]), gLocPart: glParts[0], gLocPartH2: glParts[1], dragPart: diffs[0] - glParts[0], dragFrac: (diffs[0] - glParts[0]) / diffs[0],
    gate: Math.abs(diffs[0] - target) + Math.abs(diffs[1] - diffs[0]) <= TOL_APS,
    periodShiftDays: runs.map((z) => z.cur.periodDays - z.ctl.periodDays), anomShiftDays: runs.map((z) => (z.cur.anomDays === null || z.ctl.anomDays === null) ? null : z.cur.anomDays - z.ctl.anomDays),
    eccShift: runs.map((z) => z.cur.ecc - z.ctl.ecc), ledger: runs.map((z) => z.cur.ledger), gLocWork: runs.map((z) => z.cur.gLocWork), xiMax: runs[0].cur.xiMax, xIMax: runs[0].cur.xIMax,
    lambdaOverRs: V.param === 'k' ? x : (x / lenM(p0)) / rsBook(p0), rsM: rsBook(p0) * lenM(p0), last };
  log(r);
  return r;
}
export function partM(HP, log = console.log) {
  const p0 = baseOf(HP, MERCURY), rsM = rsBook(p0) * lenM(p0), aM = aBook(p0) * lenM(p0), M = p0.bodies[0].m;
  const x0 = { A: M / (221.1205993960312 * aBook(p0) ** 2) * lenM(p0), B: 1.5 * rsM, Bs: 85 * rsM, Br: 3 };
  const rows = [];
  for (const V of VARIANTS) {
    const r = fitMercury(HP, V, { x0: x0[V.key] }, (z) => (typeof z === 'string') ? log(z) : log(`M ${V.key}: ${V.param === 'k' ? 'k' : 'λ'} ${z.x}${V.param === 'k' ? '' : ' m'}(λ/r_s ${z.lambdaOverRs.toFixed(6)})・差 ${z.diff.toFixed(6)}(h/2 ${z.diffH2.toFixed(6)}${z.diffH4 === null ? '' : '・h/4 ' + z.diffH4.toFixed(6)})・門 ${z.gate}`));
    rows.push(r);
  }
  // 参考: B を「1PN の式 + EPM2011 の追加」の標的に合わせた λ(照合規約 43.0 を書き換えない —— 移送の差が規約の 0.05% から来る分を見る)
  const tg = targetOf(p0), VB = VARIANTS.find((v) => v.key === 'B');
  const ref = fitMercury(HP, VB, { x0: 1.5 * rsM, target: tg.value }, (z) => (typeof z === 'string') ? log(z) : log(`M 参考 B(標的 ${tg.value.toFixed(5)}): λ ${z.x} m・差 ${z.diff.toFixed(6)}`));
  ref.variant = 'Bref'; ref.label = 'B(参考 —— 水星の標的を 1PN の式 + EPM2011 の追加にした λ)';
  return { rows, ref, mercury: { rsM, aM, target: tg, a1: A1.mercury, conventionMinusA1Target: TARGET_APS - tg.value, conventionMinusA1TargetSigma: (TARGET_APS - tg.value) / A1.mercury.s } };
}

/* ── 段 T: 同じ λ を 6 本へ移送(再フィットしない)── */
/**
 * 判定の語(σ と数値の誤差を分ける): σ なし → 数値の誤差との比だけ / σ < 数値の誤差 → σ の合否は言わない(差が数値の誤差の内か外か)/
 * それ以外 → 1σ・2σ の内か外か。k は |差| を物差しで割った値。
 */
export function judgeOf(d, sig, numErr) {
  const ad = Math.abs(d), ne = (numErr === null || numErr === undefined) ? null : numErr;
  if (sig === null || sig === undefined) return { kind: 'noSigma', k: ne ? ad / ne : null, text: 'σ なし(標的の観測行なし)—— ' + (ne !== null && ad <= ne ? '差は数値の誤差の内' : '差は数値の誤差の ' + (ne ? (ad / ne).toPrecision(3) : '—') + ' 倍') };
  if (ne !== null && sig < ne) return { kind: 'numeric', k: ad / ne, text: ad <= ne ? '数値の精度の内(σ < 数値の誤差 —— σ の合否と言わない)' : '数値の誤差の外(σ < 数値の誤差 —— 差は数値の誤差の ' + (ad / ne).toPrecision(3) + ' 倍・σ の合否と言わない)' };
  return { kind: 'sigma', k: ad / sig, text: ad <= sig ? '1σ の内' : (ad <= 2 * sig ? '2σ の内' : '2σ の外(|差|/σ = ' + (ad / sig).toPrecision(3) + ')') };
}
export function transferOne(HP, id, spec, ctlRuns, gl, divs = DIVS) {
  const p = baseOf(HP, id), h = hOf(p), wExt = wExtOf(HP, p).book;
  const v = spec.param === 'k' ? { kind: spec.variant === 'Bref' ? 'B' : spec.variant, k: spec.x } : { kind: spec.variant === 'Bref' ? 'B' : spec.variant, lambdaM: spec.x };
  const runs = divs.map((d, i) => { const c = ctlRuns[i], cur = measure(HP, variantOf(p, v, gl, wExt), h / d); return { div: d, pred: cur.aps - c.aps, periodShiftDays: cur.periodDays - c.periodDays,
    anomShiftDays: (cur.anomDays === null || c.anomDays === null) ? null : cur.anomDays - c.anomDays, eccShift: cur.ecc - c.ecc, xiMax: cur.xiMax }; });
  return { p, runs };
}
export function partT(HP, M, log = console.log) {
  const ids = [MERCURY].concat(TRANSFER), ctl = {}, tg = {};
  for (const id of ids) {
    const p = baseOf(HP, id), h = hOf(p), wExt = wExtOf(HP, p).book;
    ctl[id] = DIVS.map((d) => measure(HP, variantOf(p, { kind: 'off' }, null, wExt), h / d));
    tg[id] = targetOf(p);
  }
  const specs = M.rows.concat([M.ref]).filter((r) => r.reachable);
  const table = [];
  const pM = baseOf(HP, MERCURY), fM = pn1Formula(pM), gE = (e) => (1 + e * e / 4) / ((1 - e * e) ** 2);
  for (const sp of specs) {
    const rows = [];
    // 解析の移送(形の式に水星の差を入れた値 —— 数値の誤差なし): B・Bref は 2πλ/(a(1−e²))(質量によらない —— 1PN の式の G(M+m) との比で補う)・
    //   Br は πk r_s(M+m)/(a(1−e²))(1PN の式と同じ形)・A は 3πλ(1+e²/4)/(a(1−e²)³)(1PN の式との比 g(e) = (1+e²/4)/(1−e²)²)
    const dM = (sp.diffH4 !== null && sp.diffH4 !== undefined) ? sp.diffH4 : sp.diffH2;   // 水星の差の最も細かい刻みの値
    const muSI = (q, mu) => mu * Math.pow(10, 3 * q.scaleExp.L - 2 * q.scaleExp.T);   // G(M+m) を SI へ(本ごとに指数系が違う —— 内惑星 10⁸ m・外惑星 10⁹ m)
    const anOf = (p) => { const f = pn1Formula(p), base = f.arcsecCy * dM / fM.arcsecCy;
      if (sp.variant === 'B' || sp.variant === 'Bref') return base * muSI(pM, fM.mu) / muSI(p, f.mu);
      if (sp.variant === 'Br') return base;
      if (sp.variant === 'A') return base * gE(f.e) / gE(fM.e);
      return null; };
    for (const id of TRANSFER) {
      const { p, runs } = transferOne(HP, id, sp, ctl[id], null);
      const best = runs[runs.length - 1].pred, numErr = runs.length >= 2 ? Math.abs(runs[runs.length - 1].pred - runs[runs.length - 2].pred) : null;
      const T = tg[id], d = best - T.value;
      const sig = T.sigma, judge = judgeOf(d, sig, numErr);
      const an = anOf(p), dAn = an === null ? null : an - T.value;
      rows.push({ id, emoji: p.emoji, preds: runs.map((r) => r.pred), pred: best, numErr, target: T.value, pn1: T.pn1, a1: T.a1, sigma: sig, diff: d, diffSigma: sig ? d / sig : null,
        analytic: an, analyticMinusMeasured: an === null ? null : best - an, analyticDiff: dAn, analyticJudge: an === null ? null : judgeOf(dAn, sig, null),
        diffNum: numErr ? d / numErr : null, ratioToPn1: best / T.pn1, judge, periodShiftDays: runs[runs.length - 1].periodShiftDays, anomShiftDays: runs[runs.length - 1].anomShiftDays,
        eccShift: runs[runs.length - 1].eccShift, xiMax: runs[0].xiMax });
      log(`T ${sp.variant} → ${p.emoji} 予言 ${best.toPrecision(7)}(${runs.map((r) => r.pred.toPrecision(7)).join(' / ')})・標的 ${T.value.toPrecision(7)}${sig === null ? '' : ' ± ' + sig}・差 ${d.toExponential(3)}・数値の誤差 ${numErr === null ? '—' : numErr.toExponential(2)}・${judge.text}${an === null ? '' : `・解析の移送 ${an.toPrecision(7)}(差 ${dAn.toExponential(3)}・${judgeOf(dAn, sig, null).text})`}`);
    }
    table.push({ variant: sp.variant, x: sp.x, param: sp.param, lambdaOverRs: sp.lambdaOverRs, rows });
  }
  return { targets: tg, controls: Object.fromEntries(ids.map((id) => [id, ctl[id].map((c) => ({ aps: c.aps, periodDays: c.periodDays, ecc: c.ecc }))])), table, a1Source: A1_SOURCE };
}

/* ── 段 N: G_loc の候補(変種 B の上)── */
export function partN(HP, M, T, log = console.log) {
  const VB = VARIANTS.find((v) => v.key === 'B'), p0 = baseOf(HP, MERCURY), rsM = rsBook(p0) * lenM(p0);
  const divs = QUICK ? [1, 2] : [1, 2];
  const rows = [];
  for (const C of N_CASES) {
    let fit;
    if (C.n === 0) fit = M.rows.find((r) => r.variant === 'B');
    else fit = fitMercury(HP, VB, { gl: C.gl, x0: Math.max(1e-3, (3 + C.n) / 2) * rsM }, (z) => (typeof z === 'string') ? log(z) : log(`N ${C.key}: λ ${z.x} m(λ/r_s ${z.lambdaOverRs.toFixed(5)})・G_loc ${z.gLocPart.toFixed(5)}・引きずり ${z.dragPart.toFixed(5)}(割合 ${(100 * z.dragFrac).toFixed(1)}%)・門 ${z.gate}`));
    const tr = [];
    if (fit.reachable) for (const id of TRANSFER) {
      const p = baseOf(HP, id), h = hOf(p), wExt = wExtOf(HP, p).book;
      const ctl = divs.map((d, i) => { const cc = T.controls[id][i]; return cc; });
      const runs = divs.map((d, i) => { const cur = measure(HP, variantOf(p, { kind: 'B', lambdaM: fit.x }, C.gl, wExt), h / d), c = T.controls[id][i];
        return { div: d, total: cur.aps - c.aps, periodShiftDays: cur.periodDays - c.periodDays, eccShift: cur.ecc - c.ecc, anom: cur.anomDays }; });
      const glo = C.gl ? measure(HP, variantOf(p, { kind: 'off' }, C.gl, wExt), h) : null, c0 = T.controls[id][0];
      const gPart = glo ? glo.aps - c0.aps : 0, tot = runs[0].total, tgt = T.targets[id];
      tr.push({ id, emoji: p.emoji, totals: runs.map((r) => r.total), total: tot, numErr: Math.abs(runs[1].total - runs[0].total), gLocPart: gPart, dragPart: tot - gPart, dragFrac: (tot - gPart) / tot,
        target: tgt.value, sigma: tgt.sigma, diff: runs[runs.length - 1].total - tgt.value, periodShiftDays: runs[0].periodShiftDays, eccShift: runs[0].eccShift, gLocPeriodShiftDays: glo ? glo.periodDays - c0.periodDays : 0 });
      log(`N ${C.key} → ${p.emoji} 計 ${tot.toPrecision(7)} = G_loc ${gPart.toPrecision(5)} + 引きずり ${(tot - gPart).toPrecision(5)}(${(100 * (tot - gPart) / tot).toFixed(1)}%)・標的との差 ${(runs[runs.length - 1].total - tgt.value).toExponential(3)}`);
    }
    const a = (3 + C.n) / 2;   // 解析(普遍の長さ・太陽も受け手 —— 相対は 2λ): 2πλ_eff… λ = (6+2n)GM/(2c²) = (3+n) r_s/2
    rows.push({ key: C.key, n: C.n, gl: C.gl, label: C.label, analyticLambdaOverRs: a, fit: Object.assign({}, fit, { last: undefined }), transfer: tr,
      dragMajority: fit.reachable ? fit.dragFrac > 0.5 : false, dragFracMercury: fit.reachable ? fit.dragFrac : null });
  }
  return { rows, divs, rule: '引きずりが主(水星の近点率の差のうち引きずりが担う割合 > 1/2)を門として並べる —— n だけでは近点の一次は決まらない(λ と足して同じ量)' };
}

/* ── 段 E: 地球–月・冥王星–カロン・🌔 —— 各読みの予言が許容と残差に収まるか ── */
// 統括の伝達(第303便 —— 枝 c の基線の監査の中間): 🌦️ の近地点の周期は、抽出器の偏り(118 窓)・軟化 ε・平均の要素・e′ を直した純ニュートンで
//   B1 の 8.850391 年に −0.0010 年(照合許容 0.005 年の内)—— 地球–月で引きずりが埋めるべき差は許容の内で 0。この器はその値を**入力**として記録し(枝 c の正本ではない)、
//   各読みの引きずりが近地点の周期を動かす量 Δ(同じ窓・同じ刻みの引きずり無しとの差 —— 器の実測)を、許容と「残差 + Δ」で並べる。
export const PC_DT = 0.16;   // 🟪 のフィットの刻み(器 exp-w296b-fit の BOOKS の plu.dt —— 本の時間単位 10 s)
export const EM_BASELINE_303C = Object.freeze({ residYears: Number(process.env.W303B_EM_RESID || -0.0010), tolYears: 0.005, targetYears: 8.850391,
  source: '統括の伝達(第303便 —— 枝 c の基線の監査の中間・純ニュートンの三体で B1 の近地点の周期 8.850391 年との差)—— 枝 c の正本ではない(統合で照合)' });
/** 読みの写しの宣言(地球–月・冥王星–カロン —— 本の他の宣言はそのまま)。read = off | book | B | Bpairs | Br | A。 */
function readingRd(rd0, read, o) {
  const rd = clone(rd0); delete rd.inertialR2;
  if (read === 'off') { rd.Wbg = null; rd.enabled = false; return rd; }
  if (read === 'book') return rd;
  if (read === 'A') { rd.Wbg = o.WA; return rd; }
  rd.Wbg = o.wExt;
  rd.inertialR2 = read === 'Br' ? { lambdaRs: o.k } : Object.assign({ lambda: o.lamBook }, read === 'Bpairs' ? { sources: 'pairs' } : {});
  return rd;
}
export function partE(HP, M, log = console.log) {
  const out = {};
  const B = M.rows.find((r) => r.variant === 'B'), Br = M.rows.find((r) => r.variant === 'Br'), A = M.rows.find((r) => r.variant === 'A');
  const lamB = B.x, kBr = Br.x, lamA = A.x;
  const osc = (p, ci, oi) => { const b0 = p.bodies[ci], b1 = p.bodies[oi], mu = p.physics.G * (b0.m + b1.m);
    const rv = [b1.x - b0.x, b1.y - b0.y, (b1.z || 0) - (b0.z || 0)], vv = [b1.vx - b0.vx, b1.vy - b0.vy, (b1.vz || 0) - (b0.vz || 0)];
    const r = Math.hypot(...rv), v2 = vv[0] ** 2 + vv[1] ** 2 + vv[2] ** 2, a = 1 / (2 / r - v2 / mu);
    const L = [rv[1] * vv[2] - rv[2] * vv[1], rv[2] * vv[0] - rv[0] * vv[2], rv[0] * vv[1] - rv[1] * vv[0]], e = Math.sqrt(Math.max(0, 1 - (L[0] ** 2 + L[1] ** 2 + L[2] ** 2) / (mu * a)));
    return { a, e, r0: r }; };
  const wExtOf2 = (p) => { const q = clone(p); q.physics.relativeDrag = Object.assign({}, p.physics.relativeDrag, { env: { galaxy: { rhoSI: GAL_TRIAL.rhoSI, RSI: GAL_TRIAL.RSI } } }); delete q.physics.relativeDrag.inertialR2;
    const e = HP.wbgEstimateOf(q); return e.Wcos.book + e.Wgal.book; };
  const NOTE_RS = 'λ ∝ m(w_I = c₀²/(2kG r²))は源の質量によらない —— 多体では質量の小さい近い天体が分母を支配する(例: 月の近くの小天体)。一般化の形(分母の和で割る今の式か、ξ_ij = k·2G m_j/(c₀² r_ij) の重ね合わせか)は未決';
  // 🌦️(太陽 pinned・地球 1・月 2・引きずりの対 [[1,2]])—— 読みごとの近地点の周期 T1 と恒星月の差(118 公転・刻み 0.016 と 0.008 —— 器 exp-w300b-emonly の runEm3)
  { const p0 = find(HP, 'earthMoonSunInertial3d'), p = clone(p0); delete p.fitRecord; delete p.physics.gLoc;
    const rd0 = p.physics.relativeDrag, L = lenM(p), el = osc(p, 1, 2), a = el.a, eps = rd0.eps, K = a / ((a * a + eps * eps) ** 2);
    const mE = p.bodies[1].m, mM = p.bodies[2].m, mS = p.bodies[0].m, dS = P3.AU_M / L, wExt = wExtOf2(p), lamBook = lamB / L;
    const WA = wExt + mE / ((lamA / L) * a * a) + mS / ((lamA / L) * dS * dS);   // 変種 A: 公転半径(月の a・地球の 1 au)からの定数
    const o = { wExt, lamBook, k: kBr, WA };
    const tol = (p0.fitRecord && p0.fitRecord.targets) ? p0.fitRecord.targets.map((t) => ({ q: t.q, unit: t.unit, tol: t.tol.value })) : null;
    const sidTol = tol && tol[1] ? tol[1].tol : null;
    const W = (read, dt) => { const q = clone(p); q.physics.relativeDrag = readingRd(rd0, read, o);
      return EMO.windowsOf(EMO.runEm3(HP, q, { dt, revMax: 118, ci: 1, oi: 2 }), [118], HP)[0]; };
    const reads = ['off', 'book', 'B', 'Bpairs', 'Br', 'A'], hs = QUICK ? [0.016] : [0.016, 0.008];
    const runs = {}; for (const r of reads) runs[r] = hs.map((dt) => W(r, dt));
    // ξ の見積もり(月 —— 初期の a):各読みの分母
    const xiM = { book: mE * K / rd0.Wbg, B: mE * K / (wExt + mE / (lamBook * (a * a + eps * eps)) + mS / (lamBook * (dS * dS + eps * eps))), Bpairs: mE * K / (wExt + mE / (lamBook * (a * a + eps * eps))),
      Br: mE * K / (wExt + HP.inertialR2Q({ lambdaRs: kBr }, mE, p.physics.G, p.physics.cLight) / (a * a + eps * eps) + HP.inertialR2Q({ lambdaRs: kBr }, mS, p.physics.G, p.physics.cLight) / (dS * dS)),
      A: mE * K / WA, off: 0 };
    const rows = reads.filter((r) => r !== 'off').map((r) => {
      const d = runs[r].map((w, i) => ({ dT1: w.T1 - runs.off[i].T1, dSid: w.sid - runs.off[i].sid }));
      const dT1 = d[d.length - 1].dT1, num = d.length > 1 ? Math.abs(d[1].dT1 - d[0].dT1) : null, tot = EM_BASELINE_303C.residYears + dT1;
      return { read: r, xiMoon: xiM[r], dT1Years: d.map((z) => z.dT1), dSidDays: d.map((z) => z.dSid), dT1, numErrYears: num, ratioToTol: Math.abs(dT1) / EM_BASELINE_303C.tolYears,
        residPlusDelta: tot, withinTol: Math.abs(tot) <= EM_BASELINE_303C.tolYears, sidRatioToTol: sidTol ? Math.abs(d[d.length - 1].dSid) / sidTol : null };
    });
    out.earthMoonSun = { id: p0.id, emoji: p0.emoji, a, aM: a * L, e: el.e, eps, WbgBook: rd0.Wbg, wExt, lambdaBM: lamB, kBr, lambdaAM: lamA, WA, baseline: EM_BASELINE_303C, tol, hs,
      T1off: runs.off.map((w) => w.T1), sidOff: runs.off.map((w) => w.sid), rows,
      analytic: { note: '統括の粗い見積もり: 普遍の λ の相対の割合 2λ/r(地球と月の両方が受け手)→ 近地点の前進 2πλ/(a(1−e²)) rad/恒星月(形の式 —— 太陽の摂動の近地点の率に足す)',
        dVarpiPerMonthB: 2 * Math.PI * lamBook / (a * (1 - el.e * el.e)), rsEarthM: rsBook(p, mE) * L, xiBrEarthSource: kBr * rsBook(p, mE) / a },
      quantity: '月の近地点の回転の周期(三体のニュートンの近点 —— 1PN の近点ではない)・恒星月', noteRs: NOTE_RS,
      legacyInversion: { note: '参考(旧の定数の W_bg 3.856 を読みに当てた λ —— 枝 c の監査で基線の偏りを埋めていたと分かったので読みの根拠にしない)',
        lambdaPairsM: (mE + mM) * K / rd0.Wbg * a / 2 * L } };
    for (const r of rows) log(`E 🌦️ ${r.read}: ξ(月)${r.xiMoon.toExponential(3)}・近地点の周期の差 ${r.dT1Years.map((x) => x.toExponential(3)).join(' / ')} 年(許容 0.005 の ${r.ratioToTol.toFixed(2)} 倍)・残差 −0.0010 + Δ = ${r.residPlusDelta.toFixed(4)} 年 → ${r.withinTol ? '許容の内' : '許容の外'}・恒星月の差 ${r.dSidDays.map((x) => x.toExponential(2)).join(' / ')} 日`);
  }
  // 🟪(二次元・冥王星 0・カロン 1・両方 free・pairs all・dragCore)—— 読みごとの公転周期と標的(551856.43872 ± 0.02592 s)
  { const p0 = find(HP, 'plutoCharonInertialFit'), p = clone(p0); delete p.fitRecord;
    const rd0 = p.physics.relativeDrag, L = lenM(p), el = osc(p, 0, 1), a = el.a, eps = rd0.eps, K = a / ((a * a + eps * eps) ** 2), mP = p.bodies[0].m, mC = p.bodies[1].m;
    const wExt = wExtOf2(p), lamBook = lamB / L, WA = wExt + mP / ((lamA / L) * a * a), o = { wExt, lamBook, k: kBr, WA };
    const tg = p0.fitRecord && p0.fitRecord.targets ? p0.fitRecord.targets[0] : null;
    // 抽出器はフィットの器(exp-w296b-fit → exp-w295c-inertial3 の runPair・刻み 0.16 と h/2・8 公転の平均 (rev[7] − rev[0])/7)と同じ
    const per = (read, div) => { const q = clone(p); q.physics.relativeDrag = readingRd(rd0, read, o);
      const r = I3.runPair(HP, q, { ci: 0, oi: 1, dt: PC_DT / div, revMax: 8 }), n = r.rev.length; return (r.rev[n - 1] - r.rev[0]) / (n - 1) * Math.pow(10, q.scaleExp.T); };
    const reads = ['off', 'book', 'B', 'Br', 'A'], divs = QUICK ? [1] : [1, 2], P = {};
    for (const r of reads) P[r] = divs.map((d) => per(r, d));
    const obs = tg ? tg.obs : null, tol = tg ? tg.tol.value : null;
    const xi = { book: mP * K / rd0.Wbg, B: mP * K / (wExt + mP / (lamBook * (a * a + eps * eps))), Br: mP * K / (wExt + HP.inertialR2Q({ lambdaRs: kBr }, mP, p.physics.G, p.physics.cLight) / (a * a + eps * eps)), A: mP * K / WA, off: 0 };
    const rows = reads.map((r) => { const v = P[r][P[r].length - 1], num = P[r].length > 1 ? Math.abs(P[r][1] - P[r][0]) : null, d = obs === null ? null : v - obs;
      return { read: r, xiCharon: xi[r], periods: P[r], period: v, numErr: num, diff: d, judge: (obs === null) ? null : judgeOf(d, tol, num), dFromOff: v - P.off[P.off.length - 1] }; });
    out.plutoCharon = { id: p0.id, emoji: p0.emoji, a, aM: a * L, e: el.e, eps, WbgBook: rd0.Wbg, wExt, lambdaBM: lamB, kBr, lambdaAM: lamA, WA, target: { obs, tol, unit: 's', source: tg ? tg.source : null },
      rows, quantity: '公転周期(8 公転の平均 —— フィットの器と同じ runPair・刻み 0.16 と 0.08 —— 近点ではない)', dt: PC_DT, noteRs: NOTE_RS };
    for (const r of rows) log(`E 🟪 ${r.read}: ξ(カロン)${r.xiCharon.toExponential(3)}・周期 ${r.period.toFixed(5)} s(${r.periods.map((x) => x.toFixed(5)).join(' / ')})・標的との差 ${r.diff === null ? '—' : r.diff.toExponential(3)} s・${r.judge ? r.judge.text : ''}`);
  }
  // 🌔(地球+月だけ —— 太陽は背景側 env.bodies に 1 au)へ水星の λ(B・Br)を移したときの月の ξ と走行(🌦️ の W_bg は写さない —— 写すのは λ)
  { const p = find(HP, 'earthMoonOnly3d'), rd = p.physics.relativeDrag, L = lenM(p), eps = rd.eps, el = osc(p, 0, 1), a = el.a, mE = p.bodies[0].m, mM = p.bodies[1].m;
    const mS = find(HP, 'earthMoonSunInertial3d').bodies[0].m, dS = P3.AU_M / L, K = a / ((a * a + eps * eps) ** 2);
    const env = { bodies: [{ m: mS, d: dS, label: '太陽(背景側 —— 公転半径 1 au)' }] };
    const wExt = wExtOf2(p), lamBook = lamB / L;
    const xiMoonB = mE * K / (wExt + mE / (lamBook * (a * a + eps * eps)) + mS / (lamBook * (dS * dS + eps * eps)));
    const xiMoonBnoSun = mE * K / (wExt + mE / (lamBook * (a * a + eps * eps)));
    const qB = clone(p); delete qB.fitRecord; qB.physics.relativeDrag = Object.assign({}, rd, { Wbg: wExt, env, inertialR2: { lambda: lamBook, env: 'bodies' } });
    const qBr = clone(p); delete qBr.fitRecord; qBr.physics.relativeDrag = Object.assign({}, rd, { Wbg: wExt, env, inertialR2: { lambdaRs: kBr, env: 'bodies' } });
    const e1 = HP.wbgEstimateOf(qB), e2 = HP.wbgEstimateOf(qBr), xiBook = (p.bodies[0].m * K) / rd.Wbg;
    out.earthMoonOnly = { id: p.id, emoji: p.emoji, a, aM: a * L, lambdaM: lamB, kBr, wExt, xiBook, xiMoonB, xiMoonBnoSun, xiReadoutB: e1.inertialR2 ? e1.inertialR2.xi : null, xiReadoutBr: e2.inertialR2 ? e2.inertialR2.xi : null,
      sunShareOfDenominator: (mS / (dS * dS)) / (mE / (a * a) + mS / (dS * dS)) };
    log(`E 🌔: 月の ξ(λ=${lamB} m・太陽 1 au を分母へ)${xiMoonB.toExponential(4)}(太陽なし ${xiMoonBnoSun.toExponential(4)}・読み口 ${out.earthMoonOnly.xiReadoutB === null ? '—' : out.earthMoonOnly.xiReadoutB.toExponential(4)})・λ∝m ${out.earthMoonOnly.xiReadoutBr === null ? '—' : out.earthMoonOnly.xiReadoutBr.toExponential(4)}・本の定数の W_bg ${xiBook.toExponential(4)}`);
    try {
      const off = clone(p); delete off.fitRecord; off.physics.relativeDrag = Object.assign({}, rd, { Wbg: null, enabled: false });
      const book = clone(p); delete book.fitRecord;
      const run = (q) => { const r = B302.runCase(HP, q, { dt: q.physics.stepDt / 4, tEnd: 27.2 * q.timeRef.pRef, ci: 0, oi: 1, mu: q.physics.G * (mE + mM) });
        const yr = 365.25 * 86400 / Math.pow(10, q.scaleExp.T); return { dVarpiPeri: r.dVarpiPeri, pAnom: r.pAnom, pSid: r.pSid, apsArcsecPerYear: r.dVarpiPeri / r.pAnom * yr * ARCSEC, sidDays: r.pSid * Math.pow(10, q.scaleExp.T) / 86400 }; };
      const R = { off: run(off), book: run(book), B: run(qB), Br: run(qBr) };
      for (const k of ['book', 'B', 'Br']) R[k].dAps = R[k].apsArcsecPerYear - R.off.apsArcsecPerYear;
      out.earthMoonOnly.run = Object.assign(R, { note: '27 公転・刻み stepDt/4・器 exp-w302b-gloc の runCase(近点の頂点の方位の直線 fit)—— 近点の回転率は引きずり無しとの差' });
      log(`E 🌔 走行: 近点の回転率の差 ″/年 本 ${R.book.dAps.toFixed(4)}・B ${R.B.dAps.toFixed(4)}・Br ${R.Br.dAps.toExponential(3)}`);
    } catch (e) { out.earthMoonOnly.run = { err: String(e).slice(0, 200) }; }
  }
  return out;
}

/* ── 文書の表(docs/PHYSICS.md〔第303便b〕に貼る表と、QA docs.inertialR2_303 が照合する数の文字列 —— 同じ関数)── */
export const fmtX = (r) => String(r.x);
export const fmtRs = (x) => Number(x).toFixed(4);
export const fmtP = (x) => (x === null || x === undefined) ? '—' : Number(x).toPrecision(6);
export const fmtE = (x, d = 2) => (x === null || x === undefined) ? '—' : Number(x).toExponential(d);
export const fmtPct = (x) => (100 * x).toFixed(1) + '%';
const VLAB = { A: 'A 公転半径の定数', B: 'B 瞬間の距離(普遍の λ)', Bs: 'Bs B + 自己の決定力', Br: 'Br λ ∝ m(k)', Bref: 'B(参考 —— 1PN の式 + EPM2011 の標的)' };
/** PHYSICS に貼る表(markdown)。 */
export function physicsTables(J) {
  const out = [];
  const M = J.mercury, R = Object.fromEntries(M.rows.concat([M.ref]).map((r) => [r.variant, r]));
  out.push('| 変種 | λ(または k) | λ/r_s☉ | 近点率の差 h / h/2 / h/4 [″/世紀] | 門 |', '|---|---|---|---|---|');
  for (const k of ['A', 'B', 'Bs', 'Br', 'Bref']) { const r = R[k]; if (!r) continue;
    out.push(`| ${VLAB[k]} | ${r.param === 'k' ? 'k = ' + fmtX(r) : fmtX(r) + ' m'} | ${fmtRs(r.lambdaOverRs)} | ${r.diff.toFixed(5)} / ${r.diffH2.toFixed(5)} / ${r.diffH4 === null ? '—' : r.diffH4.toFixed(5)} | ${r.gate ? '真' : '偽'} |`); }
  out.push('');
  const T = J.transfer, ids = T.table[0].rows.map((z) => z.id), tg = T.targets;
  out.push('| 本 | 標的 = 1PN の式 + EPM2011 の追加 ± σ | ' + ['A', 'B', 'Br', 'Bs', 'Bref'].filter((k) => T.table.some((t) => t.variant === k)).map((k) => VLAB[k] + '(実測 h/4・数値の誤差・解析の移送)').join(' | ') + ' |',
    '|---|---|' + T.table.map(() => '---').join('|') + '|');
  for (const id of ids) {
    const t = tg[id], em = T.table[0].rows.find((z) => z.id === id).emoji;
    const cells = ['A', 'B', 'Br', 'Bs', 'Bref'].map((k) => T.table.find((x) => x.variant === k)).filter(Boolean).map((tb) => { const r = tb.rows.find((z) => z.id === id);
      return `${fmtP(r.pred)}(±${fmtE(r.numErr, 1)}${r.analytic === null || r.analytic === undefined ? '' : '・' + fmtP(r.analytic)})`; });
    out.push(`| ${em} | ${fmtP(t.value)}${t.sigma === null ? '(σ なし)' : ' ± ' + t.sigma} | ${cells.join(' | ')} |`);
  }
  out.push('');
  const N = J.gLocTable;
  out.push('| n(G_loc = G·(c_loc/c₀)^n) | 水星の λ/r_s☉(解析 (3+n)/2) | 水星の G_loc 分 / 引きずり分 [″/世紀] | 引きずりの割合 | 🌋 計 | 🔴 計 | 🏀 計 | 水星の恒星周期の変化 [日] | 水星の近点周期の変化 [s] | 水星の離心率の変化 | 門(引きずりが主) |',
    '|---|---|---|---|---|---|---|---|---|---|---|');
  for (const r of N.rows) { const f = r.fit;
    if (!f.reachable) { out.push(`| ${r.n}(${r.label}) | 届かない | — | — | — | — | — | — | — | — | 偽 |`); continue; }
    const tr = (id) => { const z = r.transfer.find((q) => q.id === id); return z ? fmtP(z.total) : '—'; };
    out.push(`| ${r.n} | ${fmtRs(f.lambdaOverRs)}(${r.analyticLambdaOverRs.toFixed(1)}) | ${f.gLocPart.toFixed(4)} / ${f.dragPart.toFixed(4)} | ${fmtPct(f.dragFrac)} | ${tr('venusSunInertial3d')} | ${tr('marsSunInertial3d')} | ${tr('jupiterSunInertial3d')} | ${fmtE(f.periodShiftDays[0], 2)} | ${f.anomShiftDays[0] === null ? '—' : (f.anomShiftDays[0] * 86400).toFixed(3)} | ${fmtE(f.eccShift[0], 2)} | ${r.dragMajority ? '真' : '偽'} |`); }
  out.push('');
  const E = J.earthMoon;
  if (E && E.earthMoonSun) {
    out.push('| 🌦️ の読み | ξ(月 —— 初期の a) | 近地点の周期の差 Δ [年](h / h/2) | Δ/許容 0.005 | 残差 −0.0010 + Δ [年] | 恒星月の差 [日] |', '|---|---|---|---|---|---|');
    for (const r of E.earthMoonSun.rows) out.push(`| ${r.read} | ${fmtE(r.xiMoon, 3)} | ${r.dT1Years.map((x) => fmtE(x, 3)).join(' / ')} | ${r.ratioToTol.toFixed(2)} | ${r.residPlusDelta.toFixed(4)}(${r.withinTol ? '許容の内' : '許容の外'}) | ${r.dSidDays.map((x) => fmtE(x, 2)).join(' / ')} |`);
    out.push('');
  }
  if (E && E.plutoCharon) {
    out.push('| 🟪 の読み | ξ(カロン —— 初期の a) | 公転周期 [s](h / h/2) | 標的との差 [s] | 判定 |', '|---|---|---|---|---|');
    for (const r of E.plutoCharon.rows) out.push(`| ${r.read} | ${fmtE(r.xiCharon, 3)} | ${r.periods.map((x) => x.toFixed(5)).join(' / ')} | ${fmtE(r.diff, 3)} | ${r.judge ? r.judge.text : '—'} |`);
    out.push('');
  }
  return out.join('\n');
}
/** QA docs.inertialR2_303 が PHYSICS〔第303便b〕の中に探す数の文字列(表と同じ書式)。 */
export function docNumbers(J) {
  const out = [];
  const M = J.mercury;
  for (const r of M.rows.concat([M.ref])) { out.push(fmtX(r), fmtRs(r.lambdaOverRs)); }
  for (const tb of J.transfer.table) if (tb.variant === 'A' || tb.variant === 'B' || tb.variant === 'Br')
    for (const id of ['venusSunInertial3d', 'marsSunInertial3d']) { const r = tb.rows.find((z) => z.id === id); if (r) out.push(fmtP(r.pred)); }
  for (const r of J.gLocTable.rows) if (r.fit.reachable) out.push(fmtRs(r.fit.lambdaOverRs), fmtPct(r.fit.dragFrac));
  if (J.earthMoon && J.earthMoon.earthMoonSun) for (const r of J.earthMoon.earthMoonSun.rows) out.push(fmtE(r.xiMoon, 3));
  return [...new Set(out)];
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) {
  const t0 = Date.now();
  const OUT_PATH = process.env.W303B_OUT || path.join(ROOT, 'tests', 'out', 'inertialr2-w303b.json');
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
  const out = { meta: null, version: HP.REL_DRAG_I2_VERSION, harnessVersion: HARNESS_VERSION, parts: PARTS, quick: QUICK };
  const tp = {};
  const timed = (k, f) => { const t = Date.now(); const r = f(); tp[k] = { wallSec: (Date.now() - t) / 1000 }; console.log(`[${k}] ${tp[k].wallSec.toFixed(1)} s`); return r; };
  if (PARTS.includes('Z')) out.zero = timed('Z', () => partZ(HP));
  if (PARTS.includes('M')) out.mercury = timed('M', () => partM(HP));
  else if (process.env.W303B_M_FROM) out.mercury = JSON.parse(fs.readFileSync(process.env.W303B_M_FROM, 'utf8')).mercury;   // 試走だけ(正本は全段)
  if (PARTS.includes('T') && out.mercury) out.transfer = timed('T', () => partT(HP, out.mercury));
  else if (process.env.W303B_M_FROM && out.mercury) out.transfer = JSON.parse(fs.readFileSync(process.env.W303B_M_FROM, 'utf8')).transfer;
  if (PARTS.includes('N') && out.mercury && out.transfer) out.gLocTable = timed('N', () => partN(HP, out.mercury, out.transfer));
  if (PARTS.includes('E') && out.mercury) out.earthMoon = timed('E', () => partE(HP, out.mercury));
  const gates = {};
  if (out.zero) {
    const Z = out.zero;
    gates.lambdaInfBitSame = Z.lambdaInf.bitSame && Z.lambdaInf.offHasNoKeys && Z.lambdaInf.i2Steps > 0;
    gates.lambdaScanSlope = Math.abs(Z.lambdaScan.logSlope + 1) < 0.05;
    gates.closedForm2 = Z.closedForm2.relErrMax < 1e-12 && Math.abs(Z.closedForm2.xiReadout / Z.closedForm2.xiForm - 1) < 1e-12 && Math.abs(Z.closedForm2.xiSun / Z.closedForm2.xiSunForm - 1) < 1e-12;
    gates.fewDirect = Z.few5.relErrMax < 1e-12 && Z.few5.method === 'direct';
    gates.pcgVsDirect = Z.pcg80.relErrMax < 1e-9 && Z.pcg80.method === 'pcg';
    gates.cRatioBitSame = Z.cRatio.bitSame && Z.cRatio.canon && Z.cRatio.canon.law === 'cRatio' && Z.cRatio.canon.n === 1;
    gates.unitColumns = Math.abs(Z.units.r2 / Z.units.r2Form - 1) < 1e-12 && Math.abs(Z.units.r3 / Z.units.r3Form - 1) < 1e-12 && Z.units.totalSame && Math.abs(Z.units.wI / Z.units.wIForm - 1) < 1e-12;
    gates.toyAnalytic = Z.toy.rows.every((r) => Math.abs(r.ratio - 1) < 0.03);
  }
  if (out.mercury) gates.mercuryFits = out.mercury.rows.every((r) => r.reachable && r.gate) && out.mercury.ref.gate;
  if (out.transfer) gates.transferMeasured = out.transfer.table.every((t) => t.rows.length === TRANSFER.length && t.rows.every((r) => Number.isFinite(r.pred)));
  if (out.gLocTable) gates.gLocFits = out.gLocTable.rows.filter((r) => r.fit.reachable).every((r) => r.fit.gate) && out.gLocTable.rows.some((r) => r.n === 1 && r.transfer.length === TRANSFER.length);
  if (out.earthMoon) gates.earthMoonTable = out.earthMoon.earthMoonSun.rows.every((r) => Number.isFinite(r.dT1) && Number.isFinite(r.xiMoon)) && out.earthMoon.plutoCharon.rows.every((r) => Number.isFinite(r.period)) && Number.isFinite(out.earthMoon.earthMoonOnly.xiMoonB);
  out.gates = gates; out.ok = Object.values(gates).every(Boolean); out.timing = tp;
  const CODE = ['tests/exp-w303b-inertialr2.mjs', 'tests/exp-w299c-planets3d.mjs', 'tests/lib-w299c-planets3d.mjs', 'tests/exp-w302b-gloc.mjs', 'tests/lib-w302a-wbg.mjs', 'tests/lib-w302c-pre.mjs',
    'tests/lib-w297b-fit.mjs', 'tests/exp-w298c-moon3d.mjs', 'tests/exp-w300b-emonly.mjs', 'tests/exp-w295c-inertial3.mjs', 'tests/lib-w302h-splitrec.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第303便b', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, i2Version: HP.REL_DRAG_I2_VERSION, loadErrors: errors.length, quick: QUICK,
    ruling: '原仮定者の裁定(第93報)④(太陽からの慣性決定力は r⁻²・引きずりは r⁻³・各惑星に対する太陽の影響は公転半径から・太陽が背景側に含まれる時の W_bg をそのまま別の惑星に使わない)・⑤(G_loc に迫る —— G_loc = G·c_loc/c も候補)・前便の指摘(1PN 相当は引きずりだけでは合わない量を埋める為 —— 引きずりを無くすのは本末転倒)',
    reading: '統括の検証項目 R192(分母に源の慣性決定力 w_I = m/(λr²)・変種 A〔公転半径の定数〕と B〔瞬間の距離〕・水星で λ を決めて移送の予言・G_loc の候補の表・λ の読み〔普遍の長さ / λ ∝ m〕・太陽の受け手)',
    notClaim: ['GR を導いた', 'GR と一致した', '43″ が出た', '法則を発見した', 'W_bg の宇宙の値が決まった', '現実を再現した'] });
  out.elapsedS = (Date.now() - t0) / 1000;
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 1) + '\n');
  console.log('gates ' + JSON.stringify(gates));
  console.log('→ ' + path.relative(ROOT, OUT_PATH) + '(' + out.elapsedS.toFixed(1) + ' s)・ok ' + out.ok);
  process.exit(out.ok ? 0 : 1);
}
