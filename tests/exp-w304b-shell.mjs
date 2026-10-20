// 第304便b(原仮定者の裁定(第94報)「引きずり核球面近似係数」・前便の指摘「1PN 相当は、引きずりだけでは合わない量を埋める為(引きずりが主)」・
// 統括の検証項目 R196)—— **引きずり核の球面近似を器の中の写しで測る器**(Node だけ —— 対象 html の inline script を tests/lib-w280b-emgrid.mjs の
// loadHtmlMain で読み、アプリの步〔三次元の semic・dfmInertialDragStep3 / 二次元の dfmInertialDragStep〕をそのまま走らせる・1 プロセス)。
//
// ■ 裁定(第94報 —— 要点)
//   中心座標のままでは自分自身への影響が距離ゼロで無限になる。「引きずり核の球面に質量が集まっている」とする便宜上の近似で、自分の引きずり核の球面の移動で
//   自分の重心を引きずる —— **引きずり量の分母の慣性決定力に自分自身を入れられる**。恒星は引きずり核に小さな半径を設定する。天体の半径と引きずり核の
//   半径の比が「引きずり核球面近似係数」η = R_d/R_body(似た天体では近い値を予想)。まずは「引きずり核表面」を導入して検証する。
//
// ■ 何を写したか(在位の本の宣言は変えない —— 器の中の写し)
//   ・本の写し: 🌡️🌋🔴🏀🟡🔷💙・🌦️・🟪 の physics・bodies・scaleExp・timeRef は**基点 945f2a4 の宣言**(凍結のデータ tests/data-w304b-decl945.json)に
//     器の中で固定する(後の枝が宣言を変えても本器の数は動かない —— 生きている html の宣言と同じかは pin.liveSame に記録)。fitRecord と gLoc は外す。
//   ・自己の項: エンジンの関数 inertialDragNormApply を**器の process の中で包み**(第303便c の installDenWrap の型)、合成則 solve の行の対角 1+deg_i に
//     c·w_self,i(c = 1/W_bg)を足す —— (W_bg + w_I,i + w_self,i + Σ_j w_ij) u_i − Σ_j w_ij u_j = Σ_j w_ij (v_j − v_i)。**分子の自己項は 0**(殻は重心と同じ速度)。
//       S3(引きずりの核の殻の中心): w_self = m_i K3_shell(0; R_d, 0) = m_i/R_d³
//       S2(r⁻² の慣性決定力の読み): w_self = q_i/R_d²(q = m_i/λ か c₀²/(2kG) —— inertialR2 と同じ q)
//     既定は軟化しない(R_d > 0 が正則化)。エンジンの宣言は使わない(枝 a が並走で作る —— 統合後に統括が照合)。html・S._core・在位の本の宣言は 1 bit も変えない。
//   ・W_bg = W_ext(W_cos + W_gal —— 第302便c の推定・太陽を含めない)。源の r⁻²(太陽)は inertialR2(普遍の λ / λ ∝ m の k —— 第303便b の鍵)で入れる。
//
// ■ 構成(段 M・T の行)
//   M1 S3 だけ(太陽の r⁻² なし)—— 水星の η を照合規約 43.0″/世紀に合わせる(太陽の η☉ ∈ {1, 0.1, 0.01})・η の格子
//   M2 B + S3(普遍の λ の r⁻² + 自己 S3)—— η の格子ごとに λ を合わせる(太陽の η☉ = 0.1 が既定・η☉ を変えた行も)
//   M3 Br + S3(λ ∝ m・k)—— 同じ
//   M4 B + S2(自己を r⁻² の読み q/R_d² —— 普遍の λ)/ M4r Br + S2(λ ∝ m)
//   ref: 水星の標的を 1PN の式 + EPM2011 の追加(42.97851 —— 第303便b の Bref)にした行(移送の比較用)
//
// ■ 段(正本 tests/out/shell-w304b.json —— 段 shell-304b)。W304B_PARTS=Z,M,T,E,K,P,A で段を選ぶ(正本は全段)・W304B_OUT で出力先
//   Z 式の確かめ: 殻の核 K3_shell・K2_shell の閉形式と数値積分・自己項を包んだ 1 步の u と閉形式(固定中心の ξ = w/(W_bg + w_I + w_self + w)・自由な二体の 2×2)・
//     総速度 W = v + u の式の残差・包みの素通り(ビット同一)と S3 ≡ 定数の W_bg・源の殻の核の補正の大きさ(本ごと)
//   M 水星(🌡️ の写し・G_loc なし・8 公転・検出器 B・対照は引きずり OFF)で M1〜M4 の根(lib-w303e-fitstop —— 停止は許容の 1/10・最後の h/h2 の門)と h/4・
//     η の格子・固定の λ での s の走査(水星・金星・火星 —— 自己項と太陽の r⁻² の比 s で近点がどう動くか・解析の形と照合)
//   T 移送(再フィットしない): (i) 共通の η(水星の η・λ/k をそのまま 6 本へ)の予言と標的(1PN の式 + EPM2011 の追加 ± σ)・(ii) 惑星ごとに要る η の逆算
//   E 地球–月(🌦️ の写し —— 118 公転窓 M1・刻み 0.016 と 0.008)と冥王星–カロン(🟪 の写し —— 8 公転の平均周期)の η × 構成
//   K 多体(🌦️ の写し・pairs 全対・1 步の読み口と器の中の直接法)と火星・木星の衛星の解析の型
//   P 対ごとの正規化の対照(式の値だけ —— 器の解法には入れない)
//   A 解析の表(自己項 m/(ηR)³・太陽の r⁻²・太陽の引きずりの重み・s・近点の形の比 —— 実測と分ける)
//
// ■ しないこと・言わないこと
//   ・在位の本の宣言・html・エンジンの式・S._core を変えない。較正母集団 19 本・4 値・閾値を動かさない。標的(照合規約 43.0)を書き換えない。
//   ・形が同じこと(距離・離心率の依存)と値が合うこと(量・窓・σ・数値の誤差)を分けて数で書く。届かないものは「この探索範囲では未達 —— 次の見直し」。
//   ・「η が決まった」「核を同定した」「1PN を導いた」「似た天体で同じ値になった/ならない」を数なしで書かない。
//
// 実行(Node だけ・1 プロセス): node tests/exp-w304b-shell.mjs → 正本 tests/out/shell-w304b.json
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as FS from './lib-w303e-fitstop.mjs';
import * as B from './exp-w303b-inertialr2.mjs';
import * as P3 from './lib-w299c-planets3d.mjs';
import * as EMO from './exp-w300b-emonly.mjs';
import * as I3 from './exp-w295c-inertial3.mjs';
import * as DC from './lib-w292c-dragcore.mjs';
import * as H4C from './lib-w311c-h4carry.mjs';   // 第311便c(AN393 (a)・R228): h/4 の転記の型
const REGEN_SCOPE = {"presets":"all","roots":["$","DT","FIT_COND_KEYS","FIT_COND_VERSION","FIT_KNOB_KEYS","FIT_NUMERICS_KEYS","FIT_RECORD_KEYS","FIT_RECORD_VERSION","FIT_RECORD_VERSIONS","FIT_RESIDUAL_KEYS","FIT_TARGET_KEYS","FIT_TOL_KEYS","HP.DRAG_CORE_RMAX_FACTOR","HP.DRAG_CORE_VERSION","HP.FIT_COND_VERSION","HP.GLOC_VERSION","HP.REL_DRAG_COMPOSE_DEFAULT","HP.REL_DRAG_I2_VERSION","HP.REL_DRAG_INERTIAL_VERSION","HP.REL_DRAG_SOLVE_FROM_DEFAULT","HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.dragCoreState","HP.fitCondSig","HP.gLocPeriAdvance","HP.gLocState","HP.geoEffectiveMode","HP.geoLawOfSim","HP.inertialDragLedgerOf","HP.inertialDragState","HP.inertialR2Q","HP.inertialR2State","HP.sim","HP.synodic","HP.validateFitRecord","HP.validatePreset","HP.wbgEstimateOf","LAWS","T","ab","ch","ctx","cw","dfmGaussLegendre01","dfmInertialDrag3Build","dfmInertialDrag3Solve","dfmInertialDragStep","dfmInertialDragStep3","dragCoreAngular","dragCoreAvgK","dragCoreLookup","dragCoreTableBuild","fmt","inertialDragComposeSolve","inertialDragI2Apply","inertialDragNormApply","inertialR2SumOf","pnSource","relDragCoefficientOf","relDragSolveFromOf","synUniform","validateFitRecord"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w304b-shell-1';
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const PARTS = (process.env.W304B_PARTS || 'Z,M,T,E,K,P,A').split(',');
const clone = (x) => JSON.parse(JSON.stringify(x));
const ARCSEC = 180 * 3600 / Math.PI;
const r7 = (x) => Number(Number(x).toPrecision(7));
export const DECL_FILE = 'tests/data-w304b-decl945.json';
export const PIN = JSON.parse(fs.readFileSync(new URL('./data-w304b-decl945.json', import.meta.url), 'utf8'));
export const MERCURY = B.MERCURY, TRANSFER = B.TRANSFER, PLANETS = [B.MERCURY].concat(B.TRANSFER);
export const EM_ID = 'earthMoonSunInertial3d', PC_ID = 'plutoCharonInertialFit';
export const TARGET_APS = B.TARGET_APS, TOL_APS = B.TOL_APS;
export const DIVS = [1, 2, 4];
export const TOL_NOSIGMA_REL = 1e-3;   // 標的に σ の無い本(🔷💙)の逆算の許容(器の宣言 —— 標的の 0.1%)
// 格子(統括の依頼 —— 大きい側 10・30・50・100 まで)
export const ETA_SUN_DEFAULT = 0.1;
export const M1_ETA_SUN = Object.freeze([1, 0.1, 0.01]);
export const M1_GRID = Object.freeze([0.05, 0.1, 0.2, 0.3, 0.4, 0.45, 0.5, 0.6, 0.8, 1, 2, 5]);
export const M2_GRID = Object.freeze([0.5, 1, 2, 5, 10, 30, 50, 100, null]);   // null = ∞(水星の自己なし)
export const M3_GRID = Object.freeze([0.5, 1, 2, 5, 10, 30, 50, 100, null]);
export const M4_GRID = Object.freeze([1, 10, 30, 100, 300, 1000, 3000]);
export const M4R_GRID = Object.freeze([1, 100]);
export const REF_GRID = Object.freeze({ M2: [10, 30, 50, 100, null], M3: [50, 100, null] });
export const SUN_ALT = Object.freeze([{ etaSun: 'none' }, { etaSun: 1 }, { etaSun: 0.01 }]);   // M2 の η ∈ {1, ∞} で太陽の η☉ を変えた行
export const S_SCAN = Object.freeze([0.01, 0.03, 0.1, 0.3, 1, 3, 10]);
export const S_SCAN_IDS = Object.freeze([MERCURY, 'venusSunInertial3d', 'marsSunInertial3d']);
const etaLab = (e) => (e === null || e === undefined) ? '∞' : (e === 'none' ? 'なし' : String(e));
const isEta = (e) => typeof e === 'number' && e > 0 && Number.isFinite(e);

/* ── 写し(基点 945f2a4 の宣言に固定)── */
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

/* ── 自己の項(器の process の中で inertialDragNormApply を包む)── */
let CUR = null, SNAP = null;   // SNAP: 段 Z の確かめだけ —— 包みの中で解く直前の v(合成則 solve の既定 solveFrom:"velocity" は S.vx を読む)と行の対角を写す
export const WRAP = { installed: false, calls: 0 };
export function installSelfWrap() {
  const G = globalThis;
  if (typeof G.inertialDragNormApply !== 'function') throw new Error('html に inertialDragNormApply が無い');
  if (G.inertialDragNormApply.__w304b) return WRAP;
  const orig = G.inertialDragNormApply;
  const wrap = function (S, n, comp, om) {
    const out = orig(S, n, comp, om);
    const D = CUR;
    if (D && comp) {
      if (D.length !== n) throw new Error('自己の項の配列の長さ ' + D.length + ' ≠ n ' + n);
      const c = G.relDragCoefficientOf(S.relDrag), DG = S._rdDeg;
      if (c > 0) for (let i = 0; i < n; i++) if (D[i] > 0) DG[i] += c * D[i];
      WRAP.calls++;
    }
    if (SNAP && comp) { SNAP.vx = Float64Array.from(S.vx); SNAP.vy = Float64Array.from(S.vy); SNAP.vz = Float64Array.from(S.vz); SNAP.DG = Float64Array.from(S._rdDeg); SNAP.n = n; SNAP.solveFrom = G.relDragSolveFromOf(S.relDrag); }
    return out;
  };
  wrap.__w304b = true;
  G.inertialDragNormApply = wrap;
  WRAP.installed = true;
  return WRAP;
}
export function withSelf(arr, f) { const prev = CUR; CUR = (arr && arr.some((x) => x > 0)) ? arr : null; try { return f(); } finally { CUR = prev; } }

/** 写しの組み立て: c = {r2: null | {lambdaM} | {k}, mode: 'S3'|'S2', eta: [本ごとの η —— null/'none'/∞ は自己なし]}・W_bg = wExt(既定)。
 *  relativeDrag は本の宣言の写しから(coreTable・pairs・eps・history を保つ)—— Wbg を差し替え・inertialR2 を差し替え・enabled を外す */
export function buildCase(HP, base, wExt, c) {
  const q = clone(base), rd = clone(base.physics.relativeDrag), L = lenM(base);
  delete rd.inertialR2; delete rd.enabled; delete rd.gain;
  rd.Wbg = (c.Wbg !== undefined) ? c.Wbg : wExt;
  let i2 = null;
  if (c.r2) { i2 = (c.r2.k !== undefined) ? { lambdaRs: c.r2.k } : { lambda: c.r2.lambdaM / L }; if (c.sources) i2.sources = c.sources; rd.inertialR2 = clone(i2); }
  if (c.pairs !== undefined) rd.pairs = clone(c.pairs);
  q.physics.relativeDrag = rd;
  const G = q.physics.G, c0 = q.physics.cLight;
  const sOf = (b, eta) => {
    if (!isEta(eta) || b.pinned) return 0;
    const Rd = eta * b.radius;
    if (c.mode === 'S2') { if (!i2) throw new Error('S2 には inertialR2 の読み(λ か k)が要る'); return HP.inertialR2Q(i2, b.m, G, c0) / (Rd * Rd); }
    return b.m / (Rd * Rd * Rd);
  };
  const self = q.bodies.map((b, i) => sOf(b, c.eta ? c.eta[i] : null));
  return { q, self, i2, wExt: rd.Wbg, c };
}
export function offCase(base) { const q = clone(base), rd = clone(base.physics.relativeDrag); delete rd.inertialR2; rd.Wbg = null; rd.enabled = false; q.physics.relativeDrag = rd; return { q, self: null, i2: null }; }
export function bookCase(base) { return { q: clone(base), self: null, i2: null }; }
const MEMO = new Map();
const keyOf = (cs, dt, tag) => tag + '|' + cs.q.id + '|' + JSON.stringify(cs.q.physics.relativeDrag) + '|' + JSON.stringify(cs.self) + '|' + JSON.stringify(cs.q.bodies.map((b) => [b.m, b.x, b.vx])) + '|' + dt;
export const STATS = { measures: 0, memoHits: 0 };
/** 惑星の写しの 1 走行(8 公転・検出器 B —— 第303便b の measure)。同じ写し・同じ刻みは 1 回だけ走らせる */
export const XI_CAP = 1e-2;   // 摂動の範囲の門(近日点の ξ —— これを超える写しは走らせない: ξ → 1 では総速度 → 0 で公転が進まず 8 公転に届かない)
export function meas(HP, cs, dt) {
  const k = keyOf(cs, dt, 'pl');
  if (MEMO.has(k)) { STATS.memoHits++; return MEMO.get(k); }
  if (cs.wExt !== undefined && cs.q.bodies.length === 2) { const a = anaOf(HP, cs); if (!(a.xiPeri < XI_CAP)) { STATS.skippedXi = (STATS.skippedXi || 0) + 1; const r = { aps: NaN, periodDays: NaN, ecc: NaN, skipped: 'xi', xiPeri: a.xiPeri }; MEMO.set(k, r); return r; } }
  STATS.measures++;
  const r = withSelf(cs.self, () => B.measure(HP, cs.q, dt));
  MEMO.set(k, r);
  return r;
}
const hOf = (p) => P3.stepsOf(p.timeRef.pRef).h;

/* ── 殻の核(閉形式)と解析の形 ── */
/** K3_shell(r; R, ε) = ½∫₋₁¹ s/(s²+ε²)² dμ(s² = r²+R²−2rRμ)。ε=0: 1/(max(r,R)|r²−R²|)・中心 R/(R²+ε²)² */
export function K3shell(r, R, eps) {
  const e2 = eps * eps;
  if (!(R > 0)) return r / ((r * r + e2) ** 2);
  if (r === 0) return R / ((R * R + e2) ** 2);
  if (eps === 0) return 1 / (Math.max(r, R) * Math.abs(r * r - R * R));
  const F = (t) => -t / (t * t + e2) + Math.atan(t / eps) / eps;
  return (F(r + R) - F(Math.abs(r - R))) / (4 * r * R);
}
/** K2_shell(r; R, ε) = ½∫ dμ/(s²+ε²) = ln(1+4rR/((r−R)²+ε²))/(4rR)・中心 1/(R²+ε²) */
export function K2shell(r, R, eps) {
  const e2 = eps * eps;
  if (!(R > 0)) return 1 / (r * r + e2);
  if (r === 0) return 1 / (R * R + e2);
  return Math.log1p(4 * r * R / ((r - R) * (r - R) + e2)) / (4 * r * R);
}
/** 数値積分(μ の区間 [−1, 1] を μ=1 側へ幾何に細かくした区分 Gauss–Legendre)—— 閉形式の確かめ */
export function shellNumeric(r, R, eps, kind, panels = 96, n = 24) {
  const gl = DC.gaussLegendre01(n), e2 = eps * eps;
  const f = (mu) => { const s2 = Math.max(0, r * r + R * R - 2 * r * R * mu); return kind === 3 ? Math.sqrt(s2) / ((s2 + e2) ** 2) : 1 / (s2 + e2); };
  // 区切り: t ∈ [0, 2](t = 1 − μ)を t_k = 2·q^(panels−k)(q < 1)で —— μ=1(s 最小)の近くを細かく
  const qq = Math.pow(1e-12, 1 / panels), cuts = [0];
  for (let k = panels; k >= 0; k--) cuts.push(2 * Math.pow(qq, k));
  let s = 0;
  for (let k = 0; k + 1 < cuts.length; k++) { const a = cuts[k], b = cuts[k + 1], h = b - a; if (!(h > 0)) continue; for (let j = 0; j < n; j++) s += gl.w[j] * h * f(1 - (a + h * gl.x[j])); }
  return 0.5 * s;
}
/** 固定中心の近点の形: ξ(r) を 1 公転で cos ν と重みをつけて積分した Δϖ = (1/e)∫₀^{2π} ξ(r(ν)) cos ν dν(r = p/(1+e cos ν)・一次の摂動 ——
 *  x' = v(1−ξ) は時間の付け替えで動径の加速度 −μξ/r² と同じ形)。台形則(周期関数 —— 指数収束) */
export function dvarpiOf(xiOf, a, e, N = 1440) {
  const p = a * (1 - e * e); let s = 0;
  for (let k = 0; k < N; k++) { const nu = 2 * Math.PI * k / N; s += xiOf(p / (1 + e * Math.cos(nu))) * Math.cos(nu); }
  return s * (2 * Math.PI / N) / e;
}
/** 惑星の写し(太陽 0・惑星 1)の解析の近点率(″/世紀)と分母の内訳(半長径 a で)—— 相対の ξ = ξ_惑星 + ξ_太陽 */
export function anaOf(HP, cs) {
  const q = cs.q, f = B.pn1Formula(q), G = q.physics.G, c0 = q.physics.cLight, eps = q.physics.relativeDrag.eps, e2 = eps * eps, W = cs.wExt;
  const m0 = q.bodies[0].m, m1 = q.bodies[1].m, S0 = cs.self ? cs.self[0] : 0, S1 = cs.self ? cs.self[1] : 0;
  const Q0 = cs.i2 ? HP.inertialR2Q(cs.i2, m0, G, c0) : 0, Q1 = cs.i2 ? HP.inertialR2Q(cs.i2, m1, G, c0) : 0;
  const parts = (r) => { const s = r * r + e2, K = r / (s * s), wP = m0 * K, wS = m1 * K, IP = Q0 / s, IS = Q1 / s;
    return { wP, wS, IP, IS, xiP: wP / (W + S1 + IP + wP), xiS: wS / (W + S0 + IS + wS) }; };
  const dv = dvarpiOf((r) => { const z = parts(r); return z.xiP + z.xiS; }, f.a, f.e);
  const T = Math.pow(10, q.scaleExp.T), century = 36525 * 86400 / T;
  const z = parts(f.a), zp = parts(f.a * (1 - f.e));
  return { rate: dv / f.P * century * ARCSEC, perOrbit: dv, a: f.a, e: f.e, P: f.P, xiPeri: zp.xiP + zp.xiS,
    at: { Wext: W, selfP: S1, IP: z.IP, wDP: z.wP, xiP: z.xiP, selfS: S0, IS: z.IS, wDS: z.wS, xiS: z.xiS,
      selfShare: S1 / (W + S1 + z.IP), s: z.IP > 0 ? S1 / z.IP : null } };
}
/** 近点の形の比 F(s, e) = Δϖ(s)/Δϖ(0)・ξ = (λ/r)/(1 + s(r/a)²)(固定中心・太陽の r⁻² の分母に自己項 S を足した形 —— s = Sλa²/M) */
export function formRatio(s, e) {
  const a = 1, lam = 1e-8;
  return dvarpiOf((r) => (lam / r) / (1 + s * (r / a) ** 2), a, e) / (Math.PI * lam / (a * (1 - e * e)));
}
/** 単調増加の f(x) の根を対数の二分法で(解析の初期値)—— 挟めなければ null */
export function logBisect(f, lo, hi, it = 200) {
  let a = Math.log(lo), b = Math.log(hi), fa = f(lo), fb = f(hi);
  if (!(Number.isFinite(fa) && Number.isFinite(fb)) || fa * fb > 0) return null;
  for (let k = 0; k < it; k++) { const m = 0.5 * (a + b), fm = f(Math.exp(m)); if (fm === 0) return Math.exp(m); if (fa * fm < 0) { b = m; fb = fm; } else { a = m; fa = fm; } if (b - a < 1e-13) break; }
  return Math.exp(0.5 * (a + b));
}

/** 解析の根(対数の格子で x を増やし、近日点の ξ が XI_CAP/10 を超えたら打ち切る —— 摂動の範囲の内で f が負から非負へ変わる最初の区間を二分法で)。
 *  all:true は範囲の内の符号の変わる区間を全部(向きを問わず)返す */
export function anaRoots(f, xiOf, lo, hi, o = {}) {
  const n = o.n || 400, xs = [], fs = [];
  for (let j = 0; j <= n; j++) { const x = lo * Math.pow(hi / lo, j / n); if (!(xiOf(x) < XI_CAP / 10)) break; xs.push(x); fs.push(f(x)); }
  const out = [];
  for (let j = 0; j + 1 < xs.length; j++) {
    const up = fs[j] < 0 && fs[j + 1] >= 0, down = fs[j] >= 0 && fs[j + 1] < 0;
    if (!(up || (o.all && down))) continue;
    const sg = up ? 1 : -1, r = logBisect((x) => sg * f(x), xs[j], xs[j + 1]);
    if (r !== null) out.push({ x: r, dir: up ? 'up' : 'down' });
    if (!o.all) break;
  }
  return { roots: out, xMaxScanned: xs.length ? xs[xs.length - 1] : null, fMax: fs.length ? Math.max(...fs) : null };
}

/* ── 構成 ── */
// cfg = {fam, eta(水星の η —— null は ∞), etaSun(数 / 'none'), target:'conv'|'ref'}・x は根(M1: η・M2/M4: λ[m]・M3/M4r: k)
export const FAMS = Object.freeze({
  M1: { r2: null, mode: 'S3', param: 'eta', label: 'M1 S3 だけ(自己 m/R_d³ —— 太陽の r⁻² なし)' },
  M2: { r2: 'B', mode: 'S3', param: 'lambdaM', label: 'M2 B + S3(普遍の λ の r⁻² + 自己 m/R_d³)' },
  M3: { r2: 'Br', mode: 'S3', param: 'k', label: 'M3 Br + S3(λ ∝ m の r⁻² + 自己 m/R_d³)' },
  M4: { r2: 'B', mode: 'S2', param: 'lambdaM', label: 'M4 B + S2(普遍の λ —— 自己を r⁻² の読み m/(λR_d²))' },
  M4r: { r2: 'Br', mode: 'S2', param: 'k', label: 'M4r Br + S2(λ ∝ m —— 自己 c₀²/(2kG R_d²))' },
});
export function caseOf(HP, base, wExt, cfg, x) {
  const F = FAMS[cfg.fam], etaP = F.param === 'eta' ? x : cfg.eta, etaS = cfg.etaSun === 'none' ? null : cfg.etaSun;
  const r2 = F.r2 === 'B' ? { lambdaM: x } : F.r2 === 'Br' ? { k: x } : null;
  return buildCase(HP, base, wExt, { r2, mode: F.mode, eta: [etaS, etaP] });
}
const cfgKey = (cfg) => `${cfg.fam}${cfg.target === 'ref' ? 'ref' : ''}:η${etaLab(cfg.eta)}:η☉${etaLab(cfg.etaSun)}`;
// 解析の初期値の範囲
const XR = { eta: [1e-3, 1e4], lambdaM: [1e-2, 1e12], k: [1e-4, 1e14] };

// ==== 第311便c の塊(ここから)====
// 第311便c(決断事項 AN393 (a)・統括の検証項目 R228): **h/4 の転記**(tests/lib-w311c-h4carry.mjs)。h/4 を測る 3 か所 —— 水星の根の行の最後の h/4(段 M)・
//   移送の T_FINE の行の h/4(段 T)・本ごとの対照(引きずり OFF)の h/4 —— は、同じ単位の h と h/2 の値の鍵が前の正本(書き換える前の W304B_OUT)と
//   ビット同一なら前の正本の h/4 の値を写す(違えば測る —— 古い h/4 と新しい h/h2 を混ぜない)。対照の h/4 は要るときだけ走らせる(水星の対照は
//   正本の mercury.control に h/h2/h4 の生の値があるので、h/h2 が同じなら写す —— 他の本の対照は転記した行が読まないので走らせない)。
//   値の鍵: 段 M の行は h/4 の欄(diffs[2]・periodShiftDays[2]・eccShift[2]・h4gap・analyticOverMeasured)を除く全欄 / 段 T の行は h/4 から作る欄
//   (preds[2]・pred・numErr・diff・diffSigma・rel・judge・periodShiftDays・eccShift)を除く全欄と表の行の鍵(key・x・divs ほか)/ 対照は h と h/2 の
//   aps・periodDays・ecc。走行の数(stats)と所要(timing・elapsedS)は値の鍵ではない(転記の分だけ減る)。H4_CARRY=0 で全部測る
let CARRY = null;
/** 転記の文脈を差し替える(試験用 —— 器の本走は main が前の正本で開く) */
export function setH4Carry(c) { CARRY = c; CTX.clear(); }
const pickKeys = (o, keys) => { const r = {}; for (const k of keys) if (o && Object.prototype.hasOwnProperty.call(o, k)) r[k] = o[k]; return r; };
const M_H4_DROP = ['h4gap', 'analyticOverMeasured'];
const mView = (row) => { const v = H4C.omit(row, M_H4_DROP); for (const k of ['diffs', 'periodShiftDays', 'eccShift']) if (Array.isArray(v[k])) v[k] = v[k].slice(0, 2); return v; };
const T_VIEW_KEYS = ['id', 'emoji', 'preds', 'target', 'pn1', 'a1', 'sigma', 'analytic', 'analyticRel', 'analyticJudge', 'formRatioAnalytic', 'selfShare', 's', 'selfPlanet', 'e'];
const T_TABLE_KEYS = ['key', 'fam', 'targetKind', 'etaMercury', 'etaSun', 'x', 'param', 'lambdaOverRs', 'divs'];
const tView = (tab, row) => ({ table: pickKeys(tab, T_TABLE_KEYS), row: Object.assign(pickKeys(row, T_VIEW_KEYS), { preds: (row.preds || []).slice(0, 2) }) });
/** 本ごとの対照の h/4(要るときだけ —— 水星は前の正本の mercury.control の h/h2 が同じなら写す) */
function ctlH4(HP, id, off, h, ctl) {
  const pc = id === MERCURY && CARRY && CARRY.prev && CARRY.prev.mercury ? CARRY.prev.mercury.control : null;
  const raw = (z) => ({ aps: z.aps, periodDays: z.periodDays, ecc: z.ecc });
  if (pc && pc.length === 3 && H4C.canCarry(CARRY, 'control:' + id, [1, 2].map((d) => Object.assign({ div: d }, raw(ctl[d]))), pc.slice(0, 2))) {
    H4C.markCarried(CARRY, 'control:' + id); return raw(pc[2]);
  }
  if (CARRY) H4C.markMeasured(CARRY, 'control:' + id);
  return meas(HP, off, h / 4);
}
// ==== 第311便c の塊(ここまで)====
function ctxOf(HP, id) {
  const base = pinned(HP, id), h = hOf(base), wExt = B.wExtOf(HP, base).book, off = offCase(base);
  // 第311便c: h/4 の対照は要るときだけ(ctlH4 —— 読まれた時に走らせるか前の正本から写す)
  const ctl = Object.fromEntries(DIVS.filter((d) => d !== 4).map((d) => [d, meas(HP, off, h / d)]));
  let c4 = null;
  Object.defineProperty(ctl, 4, { enumerable: true, configurable: true, get() { if (c4 === null) c4 = ctlH4(HP, id, off, h, ctl); return c4; } });
  return { id, base, h, wExt, ctl, target: B.targetOf(base), rsBook: B.rsBook(base), L: lenM(base) };
}
const CTX = new Map();
function ctx(HP, id) { if (!CTX.has(id)) CTX.set(id, ctxOf(HP, id)); return CTX.get(id); }

/** 水星で根(M1: η・他: λ か k)を標的に合わせる —— lib-w303e-fitstop(割線・停止は許容の 1/10・丸め 7 桁・最後の h/h2 の門)・h/4 で測り直す */
export function fitMercury(HP, cfg, log = () => {}) {
  const C = ctx(HP, MERCURY), F = FAMS[cfg.fam];
  const target = cfg.target === 'ref' ? C.target.value : TARGET_APS;
  const mk = (x) => caseOf(HP, C.base, C.wExt, cfg, x);
  const yAt = (x, d) => meas(HP, mk(x), C.h / d).aps - C.ctl[d].aps;
  const ar = anaRoots((x) => anaOf(HP, mk(x)).rate - target, (x) => anaOf(HP, mk(x)).xiPeri, XR[F.param][0], XR[F.param][1]), xa = ar.roots.length ? ar.roots[0].x : null;
  const row = { key: cfgKey(cfg), fam: cfg.fam, label: F.label, eta: cfg.eta === undefined ? null : cfg.eta, etaSun: cfg.etaSun, target, targetKind: cfg.target || 'conv', param: F.param, xAnalytic: xa };
  if (xa === null) { row.status = 'unreachable-analytic'; row.why = '解析の形で標的に届かない(探索範囲の端でも標的の外)'; log(row); return row; }
  const fit = FS.fitStopSync({ yH: (x) => yAt(x, 1), yH2: (x) => yAt(x, 2), target, tol: TOL_APS, method: 'secant', x0: xa, x1: xa * 1.001, round: r7 });
  row.status = fit.status; row.evals = fit.evals; row.rootStop = fit.root.stop; row.x = fit.x;
  if (fit.x === null) { log(row); return row; }
  // 第311便c(AN393 (a)): h と h/2 を先に測り、行の値の鍵(h/4 の欄を除く全欄)が前の正本と同じなら h/4 を写す(欄の並びは従来と同じ)
  const x = fit.x, cs = mk(x), runs = [1, 2].map((d) => meas(HP, cs, C.h / d)), an = anaOf(HP, cs);
  row.diffs = runs.map((r, i) => r.aps - C.ctl[DIVS[i]].aps);
  row.final = fit.final; row.gate = fit.final.gate;
  row.h4gap = null;
  row.periodShiftDays = runs.map((r, i) => r.periodDays - C.ctl[DIVS[i]].periodDays);
  row.eccShift = runs.map((r, i) => r.ecc - C.ctl[DIVS[i]].ecc);
  row.analyticRate = an.rate; row.analyticOverMeasured = null;
  row.den = an.at;
  row.lambdaOverRs = F.param === 'lambdaM' ? (x / C.L) / C.rsBook : F.param === 'k' ? x : null;
  row.selfMercury = cs.self[1]; row.selfSun = cs.self[0];
  const prevRow = CARRY && CARRY.prev && CARRY.prev.mercury ? (CARRY.prev.mercury.rows || []).find((z) => z.key === row.key) : undefined;
  if (CARRY && prevRow && Array.isArray(prevRow.diffs) && prevRow.diffs.length === 3 && H4C.canCarry(CARRY, 'M:' + row.key, mView(row), mView(prevRow))) {
    row.diffs.push(prevRow.diffs[2]); row.periodShiftDays.push(prevRow.periodShiftDays[2]); row.eccShift.push(prevRow.eccShift[2]); H4C.markCarried(CARRY, 'M:' + row.key);
  } else {
    const r4 = meas(HP, cs, C.h / 4);
    row.diffs.push(r4.aps - C.ctl[4].aps); row.periodShiftDays.push(r4.periodDays - C.ctl[4].periodDays); row.eccShift.push(r4.ecc - C.ctl[4].ecc);
    if (CARRY) H4C.markMeasured(CARRY, 'M:' + row.key);
  }
  row.h4gap = Math.abs(row.diffs[2] - row.diffs[1]);
  row.analyticOverMeasured = an.rate / row.diffs[2];
  log(row);
  return row;
}

/* ── 段 Z ── */
function stepSim(HP, q, steps, self, snap) {
  const v = HP.validatePreset(clone(q)); if (!v.ok) throw new Error('validatePreset: ' + JSON.stringify(v.errors).slice(0, 300));
  return withSelf(self, () => { const S = (q.physics.coord === '3d') ? HP.coord3d.makeSim() : null; if (!S) throw new Error('三次元の本だけ');
    S.build(clone(v.preset)); const dt = q.physics.stepDt || 0.01;
    for (let k = 0; k < steps; k++) { if (snap && k === steps - 1) SNAP = {}; S.step(dt); }
    if (snap) { S.__snap = SNAP; SNAP = null; }
    return S; });
}
const fpS = (S) => { let h = 0x811c9dc5; const f = new Float64Array(1), u8 = new Uint8Array(f.buffer);
  for (const k of ['x', 'y', 'z', 'vx', 'vy', 'vz']) { const A = S[k]; if (!A) continue; for (let i = 0; i < S.n; i++) { f[0] = A[i]; for (let j = 0; j < 8; j++) h = Math.imul(h ^ u8[j], 0x01000193) >>> 0; } }
  return h.toString(16); };
export function zKernels() {
  const rows = [];
  const pts = [[0, 0.05], [0.3, 0.05], [0.9, 0.05], [0.99, 0.05], [1, 0.05], [1.01, 0.05], [1.1, 0.05], [2, 0.05], [10, 0.05], [1000, 0.05],
    [0.3, 0], [0.9, 0], [1.1, 0], [2, 0], [10, 0], [1000, 0], [1, 0.5], [0.5, 2], [3, 2]];
  for (const [x, ep] of pts) {
    const R = 1, r = x * R, eps = ep * R;
    const k3 = K3shell(r, R, eps), k2 = K2shell(r, R, eps), n3 = shellNumeric(r, R, eps, 3), n2 = shellNumeric(r, R, eps, 2);
    rows.push({ rOverR: x, epsOverR: ep, K3: k3, K3num: n3, relErr3: Math.abs(k3 / n3 - 1), K2: k2, K2num: n2, relErr2: Math.abs(k2 / n2 - 1) });
  }
  // 遠方: K3_shell/K3_point − 1 → R²/r²(ε=0)・K2: R²/(3r²)
  const far = [10, 100, 1000].map((x) => { const r = x;
    return { rOverR: x, k3rel: K3shell(r, 1, 0) * r ** 3 - 1, k3form: 1 / (x * x), k2rel: K2shell(r, 1, 0) * r * r - 1, k2form: 1 / (3 * x * x) }; });
  return { rows, far, maxRelErr: Math.max(...rows.map((z) => Math.max(z.relErr3, z.relErr2))),
    note: '中心 r=0 は K3 = R/(R²+ε²)²(殻の全点が距離 R)・ε=0 の r=R は発散(外部の対は ε で軟化)' };
}
/** 1 步の u と閉形式: (a) 太陽を pinned にした水星の写し(固定中心 —— u = −ξ V・ξ = w/(W_bg + w_I + w_self + w))・(b) 自由な二体の 2×2・(c) 三体(🌦️ の写し・pairs 全対)の直接法 */
export function zOneStep(HP) {
  const out = {};
  const mer = pinned(HP, MERCURY), wExt = B.wExtOf(HP, mer).book, lamM = 8000, L = lenM(mer);
  for (const [key, r2, mode, eta] of [['pinS3', null, 'S3', 0.5], ['pinBS3', { lambdaM: lamM }, 'S3', 1], ['pinBS2', { lambdaM: lamM }, 'S2', 30]]) {
    const b = clone(mer); b.bodies[0].pinned = true; b.bodies[0].vx = 0; b.bodies[0].vy = 0; b.bodies[0].vz = 0;
    const cs = buildCase(HP, b, wExt, { r2, mode, eta: [null, eta] });
    const S = stepSim(HP, cs.q, 3, cs.self, true), e2 = cs.q.physics.relativeDrag.eps ** 2, P = S.__snap;
    const X = S._rdQX, Y = S._rdQY, Z = S._rdQZ, dx = X[0] - X[1], dy = Y[0] - Y[1], dz = Z[0] - Z[1], r2v = dx * dx + dy * dy + dz * dz, s = r2v + e2, w = S.m[0] * Math.sqrt(r2v) / (s * s);
    const wI = cs.i2 ? HP.inertialR2Q(cs.i2, S.m[0], S.params.G, S.params.cLight) / s : 0, xi = w / (cs.wExt + wI + cs.self[1] + w);
    const ue = [S._rdUX[1], S._rdUY[1], S._rdUZ[1]], uf = [xi * (P.vx[0] - P.vx[1]), xi * (P.vy[0] - P.vy[1]), xi * (P.vz[0] - P.vz[1])];
    out[key] = { eta, mode, lambdaM: r2 ? r2.lambdaM : null, solveFrom: P.solveFrom, xi, xiReadout: Math.hypot(...ue) / Math.hypot(P.vx[0] - P.vx[1], P.vy[0] - P.vy[1], P.vz[0] - P.vz[1]),
      relErr: Math.hypot(ue[0] - uf[0], ue[1] - uf[1], ue[2] - uf[2]) / Math.hypot(...uf), selfShare: cs.self[1] / (cs.wExt + wI + cs.self[1] + w), wrapCalls: WRAP.calls };
  }
  { // (b) 自由な二体(太陽と水星の両方に自己 —— η☉ 0.1・η 0.6)
    const cs = buildCase(HP, mer, wExt, { r2: { lambdaM: lamM }, mode: 'S3', eta: [0.1, 0.6] });
    const S = stepSim(HP, cs.q, 3, cs.self, true), e2 = cs.q.physics.relativeDrag.eps ** 2, C = 1 / cs.wExt, P = S.__snap, VV = { _rdVX: P.vx, _rdVY: P.vy, _rdVZ: P.vz };
    const X = S._rdQX, Y = S._rdQY, Z = S._rdQZ, dx = X[1] - X[0], dy = Y[1] - Y[0], dz = Z[1] - Z[0], r2v = dx * dx + dy * dy + dz * dz, s = r2v + e2, K = Math.sqrt(r2v) / (s * s);
    const Q = (m) => HP.inertialR2Q(cs.i2, m, S.params.G, S.params.cLight);
    const a01 = C * S.m[1] * K, a10 = C * S.m[0] * K, d0 = 1 + a01 + C * (Q(S.m[1]) / s + cs.self[0]), d1 = 1 + a10 + C * (Q(S.m[0]) / s + cs.self[1]), det = d0 * d1 - a01 * a10;
    let mx = 0;
    for (const [V, U] of [['_rdVX', '_rdUX'], ['_rdVY', '_rdUY'], ['_rdVZ', '_rdUZ']]) {
      const s0 = a01 * (VV[V][1] - VV[V][0]), s1 = a10 * (VV[V][0] - VV[V][1]), u0 = (s0 * d1 + a01 * s1) / det, u1 = (s1 * d0 + a10 * s0) / det;
      mx = Math.max(mx, Math.abs(S[U][0] - u0) / Math.max(Math.abs(u0), 1e-300), Math.abs(S[U][1] - u1) / Math.max(Math.abs(u1), 1e-300));
    }
    out.free2 = { relErrMax: mx, selfSun: cs.self[0], selfMercury: cs.self[1], xiSunOverMercury: (a01 / d0) / (a10 / d1) };
  }
  out.three = zThree(HP);
  return out;
}
/** (c) 三体(🌦️ の写し・pairs 全対・B + S3)の直接法(器の中 —— 位置と速度から行列を作り直す)と総速度 W = v + u の式の残差 */
export function zThree(HP, o = {}) {
  const em = pinned(HP, EM_ID), wExt = B.wExtOf(HP, em).book;
  const cs = buildCase(HP, em, wExt, { r2: o.r2 || { lambdaM: 8000 }, mode: 'S3', eta: [null, o.etaE || 1, o.etaM || 1], pairs: 'all' });
  const S = stepSim(HP, cs.q, 3, cs.self, true), n = S.n, e2 = cs.q.physics.relativeDrag.eps ** 2, C = 1 / cs.wExt, CT = S._dragCoreT || null, P = S.__snap;
  const X = S._rdQX, Y = S._rdQY, Z = S._rdQZ, V = [P.vx, P.vy, P.vz], U = [S._rdUX, S._rdUY, S._rdUZ];
  const A = new Float64Array(n * n), D = new Float64Array(n), Iv = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    let deg = 0, wI = 0;
    for (let j = 0; j < n; j++) { if (j === i) continue;
      const dx = X[j] - X[i], dy = Y[j] - Y[i], dz = Z[j] - Z[i], r2v = dx * dx + dy * dy + dz * dz, r = Math.sqrt(r2v), s = r2v + e2;
      const kv = (CT && CT[j]) ? globalThis.dragCoreLookup(CT[j], r) : null, a = C * S.m[j] * ((kv === null) ? r / (s * s) : kv);
      A[i * n + j] = a; deg += a; wI += HP.inertialR2Q(cs.i2, S.m[j], S.params.G, S.params.cLight) / s; }
    Iv[i] = cs.wExt + wI + cs.self[i]; D[i] = 1 + deg + C * (wI + cs.self[i]);
  }
  // 受け取る行(pinned でない)だけの直接法(pinned は u = 0)
  const fr = [], idx = []; for (let i = 0; i < n; i++) if (!S.pinned[i]) { idx.push(i); }
  let mx = 0, um = 0, resW = 0, nrm = 0, iRel = 0;
  for (let c = 0; c < 3; c++) {
    const m = idx.length, M = new Float64Array(m * m), b = new Float64Array(m);
    idx.forEach((i, a) => { idx.forEach((j, bb) => { M[a * m + bb] = (i === j) ? D[i] : -A[i * n + j]; }); let sv = 0; for (let j = 0; j < n; j++) if (j !== i) sv += A[i * n + j] * (V[c][j] - V[c][i]); b[a] = sv; });
    for (let k = 0; k < m; k++) for (let i = k + 1; i < m; i++) { const f = M[i * m + k] / M[k * m + k]; for (let j = k; j < m; j++) M[i * m + j] -= f * M[k * m + j]; b[i] -= f * b[k]; }
    const u = new Float64Array(m); for (let i = m - 1; i >= 0; i--) { let sv = b[i]; for (let j = i + 1; j < m; j++) sv -= M[i * m + j] * u[j]; u[i] = sv / M[i * m + i]; }
    idx.forEach((i, a) => { mx = Math.max(mx, Math.abs(U[c][i] - u[a])); um = Math.max(um, Math.abs(u[a])); });
    // 総速度 W = v + u: (I_i + Σ_j w_ij) W_i − Σ_j w_ij W_j = I_i v_i(W_bg を掛けた形 —— ここでは c 倍の行で)
    for (const i of idx) { const Wi = V[c][i] + U[c][i]; let lhs = D[i] * Wi; for (let j = 0; j < n; j++) if (j !== i) lhs -= A[i * n + j] * (V[c][j] + (S.pinned[j] ? 0 : U[c][j]));
      let sA = 0; for (let j = 0; j < n; j++) if (j !== i) sA += A[i * n + j];
      const rhs = (D[i] - sA) * V[c][i]; resW = Math.max(resW, Math.abs(lhs - rhs)); nrm = Math.max(nrm, Math.abs(rhs));
      iRel = Math.max(iRel, Math.abs((D[i] - sA) * cs.wExt / Iv[i] - 1)); }
  }
  let dgRel = 0; for (const i of idx) dgRel = Math.max(dgRel, Math.abs(P.DG[i] / (D[i] - 1) - 1));
  return { n, relErrDirect: mx / um, totalVelocityResidual: resW / nrm, iIdentity: iRel, diagRelErr: dgRel, solveFrom: P.solveFrom, self: cs.self, I: Array.from(Iv), method: HP.inertialDragState(S).compose.method };
}
/** 包みの素通り(ビット同一)と S3 ≡ 定数の W_bg(自己 = W − W_ext を両方の行に足した写しと、本の定数の W_bg の写し) */
export function zPass(HP, fpBefore) {
  const mer = pinned(HP, MERCURY), W0 = mer.physics.relativeDrag.Wbg, steps = 2000;
  const S1 = stepSim(HP, bookCase(mer).q, steps, null), S2 = stepSim(HP, bookCase(mer).q, steps, [0, 0]);
  const wExt = B.wExtOf(HP, mer).book, cs = buildCase(HP, mer, wExt, { mode: 'S3', eta: [null, null] });
  const selfC = [W0 - wExt, W0 - wExt], S3 = stepSim(HP, cs.q, steps, selfC);
  let dmax = 0; for (let i = 0; i < 2; i++) dmax = Math.max(dmax, Math.hypot(S3.x[i] - S1.x[i], S3.y[i] - S1.y[i], S3.z[i] - S1.z[i]));
  const rel = dmax / Math.hypot(S1.x[1] - S1.x[0], S1.y[1] - S1.y[0], S1.z[1] - S1.z[0]);
  const C = ctx(HP, MERCURY), book = meas(HP, bookCase(mer), C.h), sc = meas(HP, { q: cs.q, self: selfC, i2: null }, C.h);
  return { steps, fpBefore, fpWrapNull: fpS(S1), fpWrapZero: fpS(S2), bitSameNull: fpBefore === null ? null : fpBefore === fpS(S1), bitSameZero: fpS(S1) === fpS(S2),
    constEquiv: { W0, posRelDiff: rel, apsBook: book.aps - C.ctl[1].aps, apsS3: sc.aps - C.ctl[1].aps, apsDiff: sc.aps - book.aps } };
}
/** 源の殻の核の補正の大きさ: K3_shell(a; R_d, ε)/K3_point(a; ε) − 1(本の宣言の ε・a は初期の接触要素)と遠方の形 (R_d/a)² */
export function zSourceShell(HP, etaMerc) {
  const rows = [];
  const add = (label, p, ci, oi, etas) => { const b0 = p.bodies[ci], b1 = p.bodies[oi], mu = p.physics.G * (b0.m + b1.m);
    const rv = [b1.x - b0.x, b1.y - b0.y, (b1.z || 0) - (b0.z || 0)], vv = [b1.vx - b0.vx, b1.vy - b0.vy, (b1.vz || 0) - (b0.vz || 0)];
    const r = Math.hypot(...rv), a = 1 / (2 / r - (vv[0] ** 2 + vv[1] ** 2 + vv[2] ** 2) / mu), eps = p.physics.relativeDrag.eps, R = b0.radius, kp = a / ((a * a + eps * eps) ** 2);
    for (const eta of etas) rows.push({ label, source: ci, eta, a, Rd: eta * R, eps, corr: K3shell(a, eta * R, eps) / kp - 1, form: (eta * R / a) ** 2 }); };
  add('太陽 → 水星(🌡️)', pinned(HP, MERCURY), 0, 1, [1, 0.1, 0.01]);
  add('太陽 → 海王星(💙)', pinned(HP, 'neptuneSunInertial3d'), 0, 1, [1, 0.1]);
  add('地球 → 月(🌦️)', pinned(HP, EM_ID), 1, 2, [etaMerc, 1]);
  add('冥王星 → カロン(🟪)', pinned(HP, PC_ID), 0, 1, [etaMerc, 1]);
  add('カロン → 冥王星(🟪)', pinned(HP, PC_ID), 1, 0, [etaMerc, 1]);
  return { rows, note: '源を点のまま測ってよいかの目安(本器の走行では源は宣言のまま —— 🌦️ の地球と 🟪 は宣言の dragCore の表)' };
}
export function partZ(HP, fpBefore, log = console.log) {
  const out = {};
  out.kernels = zKernels();
  log(`Z1 殻の核の閉形式と数値積分の最大相対差 ${out.kernels.maxRelErr.toExponential(2)}・遠方 K3 ${out.kernels.far.map((z) => z.k3rel.toExponential(3) + '(' + z.k3form.toExponential(3) + ')').join(' ')}`);
  out.oneStep = zOneStep(HP);
  for (const k of ['pinS3', 'pinBS3', 'pinBS2']) { const z = out.oneStep[k]; log(`Z2 ${k}: ξ ${z.xi.toExponential(6)}・1 步の u の相対差 ${z.relErr.toExponential(2)}・自己の割合 ${z.selfShare.toFixed(4)}`); }
  log(`Z2 自由な二体 2×2 の相対差 ${out.oneStep.free2.relErrMax.toExponential(2)}・三体の直接法 ${out.oneStep.three.relErrDirect.toExponential(2)}・総速度の式の残差 ${out.oneStep.three.totalVelocityResidual.toExponential(2)}・I の恒等 ${out.oneStep.three.iIdentity.toExponential(2)}`);
  out.pass = zPass(HP, fpBefore);
  log(`Z3 包みの素通り ${out.pass.bitSameNull}/${out.pass.bitSameZero}・S3 ≡ 定数の W_bg: 位置の相対差 ${out.pass.constEquiv.posRelDiff.toExponential(2)}・近点率の差 ${out.pass.constEquiv.apsDiff.toExponential(2)}″/世紀`);
  return out;
}

/* ── 段 M ── */
export function partM(HP, log = console.log) {
  const out = { rows: [] };
  const lg = (z) => log(`M ${z.key}: ${z.param} ${z.x === undefined ? '—' : z.x}(解析 ${z.xAnalytic === null ? '—' : Number(z.xAnalytic).toPrecision(7)})・${z.status}${z.diffs ? '・差 ' + z.diffs.map((x) => x.toFixed(6)).join(' / ') : ''}${z.den ? '・自己の割合 ' + z.den.selfShare.toFixed(4) : ''}`);
  for (const es of M1_ETA_SUN) out.rows.push(fitMercury(HP, { fam: 'M1', etaSun: es }, lg));
  for (const e of M2_GRID) out.rows.push(fitMercury(HP, { fam: 'M2', eta: e, etaSun: ETA_SUN_DEFAULT }, lg));
  for (const e of [1, null]) for (const s of SUN_ALT) out.rows.push(fitMercury(HP, { fam: 'M2', eta: e, etaSun: s.etaSun }, lg));
  for (const e of M3_GRID) out.rows.push(fitMercury(HP, { fam: 'M3', eta: e, etaSun: ETA_SUN_DEFAULT }, lg));
  for (const e of M4_GRID) out.rows.push(fitMercury(HP, { fam: 'M4', eta: e, etaSun: ETA_SUN_DEFAULT }, lg));
  for (const e of M4R_GRID) out.rows.push(fitMercury(HP, { fam: 'M4r', eta: e, etaSun: ETA_SUN_DEFAULT }, lg));
  for (const [fam, g] of Object.entries(REF_GRID)) for (const e of g) out.rows.push(fitMercury(HP, { fam, eta: e, etaSun: ETA_SUN_DEFAULT, target: 'ref' }, lg));
  // M1 の η の格子(η☉ = 0.1・h だけ —— 近点率 ∝ η³ の形)
  const C = ctx(HP, MERCURY);
  out.m1Grid = M1_GRID.map((e) => { const cs = caseOf(HP, C.base, C.wExt, { fam: 'M1', etaSun: ETA_SUN_DEFAULT }, e), m = meas(HP, cs, C.h), an = anaOf(HP, cs);
    return { eta: e, diff: m.aps - C.ctl[1].aps, analytic: an.rate, selfMercury: cs.self[1], periodShiftDays: m.periodDays - C.ctl[1].periodDays, eccShift: m.ecc - C.ctl[1].ecc }; });
  log('M1 格子: ' + out.m1Grid.map((z) => `η ${z.eta} → ${z.diff.toPrecision(5)}(解析 ${z.analytic.toPrecision(5)})`).join(' / '));
  // 固定の λ(M2 η=∞・η☉ 0.1 の根)での s の走査(水星・金星・火星 —— 惑星の η を s ∈ S_SCAN になるように)
  const r0 = out.rows.find((z) => z.key === cfgKey({ fam: 'M2', eta: null, etaSun: ETA_SUN_DEFAULT }));
  out.sScan = { lambdaM: r0 && r0.x, rows: [] };
  if (r0 && r0.x) for (const id of S_SCAN_IDS) {
    const Cp = ctx(HP, id), mk = (eta) => caseOf(HP, Cp.base, Cp.wExt, { fam: 'M2', eta, etaSun: ETA_SUN_DEFAULT }, r0.x);
    const base0 = mk(null), an0 = anaOf(HP, base0), m0 = [1, 2].map((d) => meas(HP, base0, Cp.h / d).aps - Cp.ctl[d].aps);
    const selfAt1 = Cp.base.bodies[1].m / Cp.base.bodies[1].radius ** 3, Isun = an0.at.IP;
    for (const s of S_SCAN) {
      const eta = Math.cbrt(selfAt1 / (s * Isun)), cs = mk(eta), an = anaOf(HP, cs), m = [1, 2].map((d) => meas(HP, cs, Cp.h / d).aps - Cp.ctl[d].aps);
      out.sScan.rows.push({ id, emoji: Cp.base.emoji, s, eta, e: an.e, measured: m, ratio: m[1] / m0[1], ratioH: m[0] / m0[0], numErr: Math.abs(m[1] / m0[1] - m[0] / m0[0]),
        analyticRatio: an.rate / an0.rate, formRatio: formRatio(s, an.e), base: m0 });
    }
  }
  for (const z of out.sScan.rows) log(`M s 走査 ${z.emoji} s ${z.s}(η ${z.eta.toPrecision(4)}): 実測の比 ${z.ratio.toFixed(5)}(h ${z.ratioH.toFixed(5)})・解析 ${z.analyticRatio.toFixed(5)}・F(s,e) ${z.formRatio.toFixed(5)}`);
  out.mercury = { target: C.target, h: C.h, wExt: C.wExt, rsM: C.rsBook * C.L, control: DIVS.map((d) => ({ div: d, aps: C.ctl[d].aps, periodDays: C.ctl[d].periodDays, ecc: C.ctl[d].ecc })) };
  return out;
}

/* ── 段 T ── */
export const T_CFGS = Object.freeze([
  { fam: 'M1', etaSun: 0.1 }, { fam: 'M1', etaSun: 1 }, { fam: 'M1', etaSun: 0.01 },
  ...M2_GRID.map((e) => ({ fam: 'M2', eta: e, etaSun: 0.1 })), { fam: 'M2', eta: null, etaSun: 'none' },
  ...M3_GRID.map((e) => ({ fam: 'M3', eta: e, etaSun: 0.1 })),
  ...M4_GRID.map((e) => ({ fam: 'M4', eta: e, etaSun: 0.1 })), ...M4R_GRID.map((e) => ({ fam: 'M4r', eta: e, etaSun: 0.1 })),
  ...REF_GRID.M2.map((e) => ({ fam: 'M2', eta: e, etaSun: 0.1, target: 'ref' })), ...REF_GRID.M3.map((e) => ({ fam: 'M3', eta: e, etaSun: 0.1, target: 'ref' })),
]);
// h/4 まで測る行(他は h と h/2 —— 数値の誤差は最後の 2 つの刻みの差)
const T_FINE = new Set(['M1:η∞:η☉0.1', 'M2:η1:η☉0.1', 'M2:η10:η☉0.1', 'M2:η50:η☉0.1', 'M2:η∞:η☉0.1', 'M2ref:η50:η☉0.1', 'M2ref:η∞:η☉0.1', 'M3:η1:η☉0.1', 'M3:η∞:η☉0.1', 'M4:η1:η☉0.1', 'M4:η1000:η☉0.1']);
export const T_INV = Object.freeze(['M1:η∞:η☉0.1', 'M2:η1:η☉0.1', 'M2:η50:η☉0.1', 'M2ref:η∞:η☉0.1', 'M3:η1:η☉0.1', 'M4:η1:η☉0.1', 'M4:η1000:η☉0.1']);
export const GROUPS = Object.freeze([{ key: 'terrestrial', ja: '地球型', ids: [MERCURY, 'venusSunInertial3d', 'marsSunInertial3d'] },
  { key: 'gas', ja: '巨大ガス', ids: ['jupiterSunInertial3d', 'saturnSunInertial3d'] }, { key: 'ice', ja: '巨大氷', ids: ['uranusSunInertial3d', 'neptuneSunInertial3d'] }]);
export function partT(HP, M, log = console.log, opt = {}) {
  const table = [], inverse = [], CFGS = opt.cfgs || T_CFGS, INV = opt.inv || T_INV, TR = opt.ids || TRANSFER, PL = opt.invIds || PLANETS;
  const etaMercOf = (row) => FAMS[row.fam].param === 'eta' ? row.x : row.eta;
  for (const cfg of CFGS) {
    const k = cfgKey(cfg), row = M.rows.find((z) => z.key === k);
    if (!row || row.x === null || row.x === undefined) { table.push({ key: k, skipped: true, why: row ? row.status : '水星の行なし' }); continue; }
    const divs = T_FINE.has(k) ? [1, 2, 4] : [1, 2];
    const tcfg = Object.assign({}, cfg, FAMS[cfg.fam].param === 'eta' ? { eta: row.x } : {});
    const x = row.x, rows = [];
    for (const id of TR) {
      const C = ctx(HP, id), cs = caseOf(HP, C.base, C.wExt, Object.assign({}, tcfg, { fam: cfg.fam === 'M1' ? 'M1' : cfg.fam }), x);
      // 第311便c(AN393 (a)): h と h/2 を先に測る。T_FINE の行の h/4 は、行の値の鍵(h/4 から作る欄を除く)と表の行の鍵が前の正本と同じなら写す
      const runs = [1, 2].map((d) => meas(HP, cs, C.h / d)), preds = runs.map((r, i) => r.aps - C.ctl[divs[i]].aps);
      let lastP = runs[1].periodDays - C.ctl[2].periodDays, lastE = runs[1].ecc - C.ctl[2].ecc;
      const T = C.target;
      const an = anaOf(HP, cs), csB = caseOf(HP, C.base, C.wExt, Object.assign({}, tcfg, { eta: null }), FAMS[cfg.fam].param === 'eta' ? null : x);
      const anB = FAMS[cfg.fam].param === 'eta' ? null : anaOf(HP, csB);
      if (divs.length === 3) {
        const tab = { key: k, fam: cfg.fam, targetKind: cfg.target || 'conv', etaMercury: etaMercOf(row), etaSun: cfg.etaSun, x, param: FAMS[cfg.fam].param, lambdaOverRs: row.lambdaOverRs, divs };
        const fresh = tView(tab, { id, emoji: C.base.emoji, preds, target: T.value, pn1: T.pn1, a1: T.a1, sigma: T.sigma, analytic: an.rate, analyticRel: an.rate / T.value - 1,
          analyticJudge: B.judgeOf(an.rate - T.value, T.sigma, null), formRatioAnalytic: anB ? an.rate / anB.rate : null, selfShare: an.at.selfShare, s: an.at.s, selfPlanet: cs.self[1], e: an.e });
        const pt = CARRY && CARRY.prev && CARRY.prev.transfer ? (CARRY.prev.transfer.table || []).find((z) => z.key === k) : null;
        const pr = pt && pt.rows ? pt.rows.find((z) => z.id === id) : null;
        const ck = 'T:' + k + ':' + id;
        if (CARRY && pr && Array.isArray(pr.preds) && pr.preds.length === 3 && H4C.canCarry(CARRY, ck, fresh, tView(pt, pr))) {
          preds.push(pr.preds[2]); lastP = pr.periodShiftDays; lastE = pr.eccShift; H4C.markCarried(CARRY, ck);
        } else {
          const r4 = meas(HP, cs, C.h / 4);
          preds.push(r4.aps - C.ctl[4].aps); lastP = r4.periodDays - C.ctl[4].periodDays; lastE = r4.ecc - C.ctl[4].ecc; if (CARRY) H4C.markMeasured(CARRY, ck);
        }
      }
      const best = preds[preds.length - 1], numErr = Math.abs(preds[preds.length - 1] - preds[preds.length - 2]), d = best - T.value;
      rows.push({ id, emoji: C.base.emoji, preds, pred: best, numErr, target: T.value, pn1: T.pn1, a1: T.a1, sigma: T.sigma, diff: d, diffSigma: T.sigma ? d / T.sigma : null,
        rel: best / T.value - 1, judge: B.judgeOf(d, T.sigma, numErr), analytic: an.rate, analyticRel: an.rate / T.value - 1, analyticJudge: B.judgeOf(an.rate - T.value, T.sigma, null),
        formRatioAnalytic: anB ? an.rate / anB.rate : null, selfShare: an.at.selfShare, s: an.at.s, selfPlanet: cs.self[1], e: an.e,
        periodShiftDays: lastP, eccShift: lastE });
      const z = rows[rows.length - 1];
      log(`T ${k} → ${z.emoji} 予言 ${z.pred.toPrecision(7)}(${z.preds.map((v) => v.toPrecision(7)).join(' / ')})・標的 ${z.target.toPrecision(7)}${z.sigma === null ? '' : ' ± ' + z.sigma}・相対 ${(100 * z.rel).toFixed(2)}%・${z.judge.text}・解析 ${z.analytic.toPrecision(7)}・自己の割合 ${z.selfShare.toFixed(4)}${z.s === null ? '' : '・s ' + z.s.toPrecision(3)}`);
    }
    table.push({ key: k, fam: cfg.fam, targetKind: cfg.target || 'conv', etaMercury: etaMercOf(row), etaSun: cfg.etaSun, x, param: FAMS[cfg.fam].param, lambdaOverRs: row.lambdaOverRs, divs, rows });
  }
  // (ii) 惑星ごとに要る η の逆算(λ/k は水星の行のまま)
  for (const k of INV) {
    const row = M.rows.find((z) => z.key === k); if (!row || row.x === null || row.x === undefined) { inverse.push({ key: k, skipped: true }); continue; }
    const fam = row.fam, x = FAMS[fam].param === 'eta' ? null : row.x, rows = [];
    const cfg0 = { fam, eta: null, etaSun: row.etaSun, target: row.targetKind };
    for (const id of PL) {
      const C = ctx(HP, id), T = C.target, tol = T.sigma !== null ? T.sigma : TOL_NOSIGMA_REL * T.value;
      const mk = (eta) => FAMS[fam].param === 'eta' ? caseOf(HP, C.base, C.wExt, { fam, etaSun: row.etaSun }, eta) : caseOf(HP, C.base, C.wExt, Object.assign({}, cfg0, { eta }), x);
      // 解析で根を探す(対数の格子 η ∈ [0.01, 10⁵] —— 太陽の r⁻² がある構成は η の大きい側で近点が増える非単調があるので、符号の変わる区間を全部。
      //   近日点の ξ が摂動の範囲〔XI_CAP/10〕を超える η は探さない —— S3 だけの構成で η → ∞ は分母 → W_ext で ξ → 1)
      const AR = anaRoots((e) => anaOf(HP, mk(e)).rate - T.value, (e) => anaOf(HP, mk(e)).xiPeri, 0.01, 1e5, { n: 280, all: true }), roots = AR.roots.map((z) => z.x);
      const anInf = FAMS[fam].param === 'eta' ? null : anaOf(HP, mk(null)).rate, anMax = AR.fMax === null ? null : AR.fMax + T.value;
      const meas1 = [];
      for (const ra of roots.filter((z) => z !== null)) {
        const yAt = (e, d) => meas(HP, mk(e), C.h / d).aps - C.ctl[d].aps;
        let fit = null, fac = null;
        for (fac of [1.15, 2, 10]) {   // 実測で挟めるまで区間を広げる(解析の根の周り —— 挟めなければ unreachable-in-bounds を記録)
          fit = FS.fitStopSync({ yH: (e) => yAt(e, 1), yH2: (e) => yAt(e, 2), target: T.value, tol, method: 'illinois', bracket: { lo: ra / fac, hi: ra * fac }, round: r7, maxIter: 16 });
          if (fit.status !== 'unreachable-in-bounds') break;
        }
        meas1.push({ etaAnalytic: ra, status: fit.status, eta: fit.x, final: fit.final, evals: fit.evals, stop: fit.root.stop, bracketFactor: fac });
      }
      rows.push({ id, emoji: C.base.emoji, target: T.value, sigma: T.sigma, tol, tolKind: T.sigma !== null ? 'σ' : '標的の 0.1%(器の宣言)', roots: meas1, analyticBLimit: anInf, analyticMax: anMax, etaMaxScanned: AR.xMaxScanned,
        rootDirs: AR.roots.map((z) => z.dir),
        reachable: meas1.length > 0 });
      const z = rows[rows.length - 1];
      log(`T(ii) ${k} → ${z.emoji}: ${z.roots.length ? z.roots.map((r) => `η ${r.eta === null ? '—' : r.eta}(解析 ${r.etaAnalytic.toPrecision(5)}・${r.status})`).join(' / ') : '根なし(解析の最大 ' + anMax.toPrecision(6) + '・標的 ' + T.value.toPrecision(6) + ')'}`);
    }
    // 群の中のばらつき(大きい η 側の根 —— 実測の根が無ければ解析の根)
    const pick = (r) => { const rr = r.roots.slice().sort((a, b) => (b.eta || b.etaAnalytic) - (a.eta || a.etaAnalytic)); return rr.length ? (rr[0].eta || rr[0].etaAnalytic) : null; };
    const groups = GROUPS.map((g) => { const v = g.ids.map((id) => rows.find((z) => z.id === id)).filter(Boolean).map(pick).filter((z) => z !== null && Number.isFinite(z));
      return { key: g.key, ja: g.ja, etas: v, n: v.length, ratioMaxMin: v.length > 1 ? Math.max(...v) / Math.min(...v) : null, geoMean: v.length ? Math.exp(v.reduce((s, z) => s + Math.log(z), 0) / v.length) : null }; });
    inverse.push({ key: k, fam, x: row.x, param: FAMS[fam].param, etaMercury: etaMercOf(row), rows, groups });
  }
  return { table, inverse, targets: Object.fromEntries(PLANETS.map((id) => [id, ctx(HP, id).target])), a1Source: B.A1_SOURCE, tolNoSigmaRel: TOL_NOSIGMA_REL };
}

/* ── 段 E ── */
export const EM_BASELINE_303C = Object.freeze({ residYears: -0.00101, tolYears: 0.005, targetYears: 8.850391, sidTolDays: 0.00005,
  source: '第303便c の正本 earthmoon-w303c.json の基線の監査(全部入りの純ニュートン − B1 = −0.00101 年・照合許容 0.005 年)—— 入力として記録' });
export function partE(HP, M, log = console.log, opt = {}) {
  const out = {}, REV = opt.rev || 118, PCREV = opt.pcRev || 8;   // opt は試走だけ(正本は 118 公転窓・8 公転)
  const get = (k) => M.rows.find((z) => z.key === k);
  const etaMerc = (get('M1:η∞:η☉0.1') || {}).x;
  const lam = (e) => (get(cfgKey({ fam: 'M2', eta: e, etaSun: 0.1 })) || {}).x, kk = (e) => (get(cfgKey({ fam: 'M3', eta: e, etaSun: 0.1 })) || {}).x;
  // 🌦️
  { const base = pinned(HP, EM_ID), wExt = B.wExtOf(HP, base).book, L = lenM(base), hs = [0.016, 0.008];
    const B0 = base.bodies;
    const cases = [{ key: 'off', label: '引きずり OFF', cs: offCase(base) }, { key: 'book', label: '本の宣言(W_bg 3.85583・自己なし)', cs: bookCase(base) }];
    for (const e of [0.1, 0.3, etaMerc, 1, 3]) cases.push({ key: `S3:η${e === etaMerc ? 'Merc' : e}`, read: 'S3', eta: e, label: `S3 だけ(η_地球 = η_月 = ${e === etaMerc ? Number(e).toPrecision(5) + '(水星の M1)' : e})`,
      cs: buildCase(HP, base, wExt, { mode: 'S3', eta: [null, e, e] }) });
    cases.push({ key: 'B303', read: 'B', eta: null, label: 'B(第303便b の λ 4431.88 m・自己なし)', cs: buildCase(HP, base, wExt, { r2: { lambdaM: 4431.88 }, mode: 'S3', eta: [null, null, null] }) });
    cases.push({ key: 'B303S3:η1', read: 'B+S3', eta: 1, label: 'B(第303便b の λ 4431.88 m)+ S3(η_地球 = η_月 = 1)—— 同じ λ で自己項の効きだけを見る', cs: buildCase(HP, base, wExt, { r2: { lambdaM: 4431.88 }, mode: 'S3', eta: [null, 1, 1] }) });
    for (const e of [1, 10, 50, null]) if (lam(e)) cases.push({ key: `BS3:η${etaLab(e)}`, read: 'B+S3', eta: e, lambdaM: lam(e), label: `B + S3(λ ${lam(e)} m —— 水星の M2 η ${etaLab(e)}・η_地球 = η_月 = ${etaLab(e)})`,
      cs: buildCase(HP, base, wExt, { r2: { lambdaM: lam(e) }, mode: 'S3', eta: [null, e, e] }) });
    for (const e of [1, null]) if (kk(e)) cases.push({ key: `BrS3:η${etaLab(e)}`, read: 'Br+S3', eta: e, k: kk(e), label: `Br + S3(k ${kk(e)} —— 水星の M3 η ${etaLab(e)}・η_地球 = η_月 = ${etaLab(e)})`,
      cs: buildCase(HP, base, wExt, { r2: { k: kk(e) }, mode: 'S3', eta: [null, e, e] }) });
    const runW = (cs, dt) => { const k = keyOf(cs, dt, 'em'); if (MEMO.has(k)) return MEMO.get(k); STATS.measures++;
      const R = withSelf(cs.self, () => EMO.runEm3(HP, cs.q, { dt, revMax: REV, ci: 1, oi: 2 })), w = EMO.windowsOf(R, [REV], HP)[0];
      const r = { T1: w.T1, sid: w.sid, complete: R.complete, steps: R.steps }; MEMO.set(k, r); return r; };
    const res = cases.map((c) => ({ c, w: hs.map((dt) => runW(c.cs, dt)) }));
    const off = res[0].w, E = B0[1], Mo = B0[2], mu = base.physics.G * (E.m + Mo.m);
    const rv = [Mo.x - E.x, Mo.y - E.y, Mo.z - E.z], vv = [Mo.vx - E.vx, Mo.vy - E.vy, Mo.vz - E.vz], r0 = Math.hypot(...rv), a = 1 / (2 / r0 - (vv[0] ** 2 + vv[1] ** 2 + vv[2] ** 2) / mu);
    const eps = base.physics.relativeDrag.eps, Ka = a / ((a * a + eps * eps) ** 2), dS = Math.hypot(E.x - B0[0].x, E.y - B0[0].y, E.z - B0[0].z);
    const rows = res.slice(1).map(({ c, w }) => {
      const d = w.map((z, i) => ({ dT1: z.T1 - off[i].T1, dSid: z.sid - off[i].sid })), dT1 = d[d.length - 1].dT1, num = Math.abs(d[1].dT1 - d[0].dT1);
      const cs = c.cs, Wb = cs.wExt !== undefined ? cs.wExt : cs.q.physics.relativeDrag.Wbg, G = base.physics.G, c0 = base.physics.cLight;
      const Q = (m) => cs.i2 ? HP.inertialR2Q(cs.i2, m, G, c0) : 0, selfM = cs.self ? cs.self[2] : 0;
      const IM = Q(E.m) / (a * a + eps * eps) + Q(B0[0].m) / (dS * dS + eps * eps), wD = E.m * Ka;
      const xiMoon = wD / (Wb + selfM + IM + wD), tot = EM_BASELINE_303C.residYears + dT1;
      return { key: c.key, read: c.read || c.key, eta: c.eta === undefined ? null : c.eta, label: c.label, lambdaM: c.lambdaM || null, k: c.k || null,
        selfEarth: cs.self ? cs.self[1] : 0, selfMoon: selfM, IMoon: IM, Wbg: Wb, xiMoon, sunShareOfI: IM > 0 ? (Q(B0[0].m) / (dS * dS + eps * eps)) / IM : null,
        dT1Years: d.map((z) => z.dT1), dSidDays: d.map((z) => z.dSid), dT1, numErrYears: num, ratioToTol: Math.abs(dT1) / EM_BASELINE_303C.tolYears,
        residPlusDelta: tot, withinTol: Math.abs(tot) <= EM_BASELINE_303C.tolYears, sidRatioToTol: Math.abs(d[d.length - 1].dSid) / EM_BASELINE_303C.sidTolDays };
    });
    out.earthMoonSun = { id: EM_ID, emoji: base.emoji, a, aM: a * L, eps, wExt, hs, baseline: EM_BASELINE_303C, T1off: off.map((z) => z.T1), sidOff: off.map((z) => z.sid), rows,
      selfMoonEta1: Mo.m / Mo.radius ** 3, selfEarthEta1: E.m / E.radius ** 3,
      quantity: '月の近地点の回転の周期 T1(118 公転窓・M1 —— 第300便b の runEm3 と同じ抽出器)と恒星月 —— 引きずり OFF との同じ窓・同じ刻みの差 Δ' };
    for (const r of out.earthMoonSun.rows) log(`E 🌦️ ${r.key}: ξ(月)${r.xiMoon.toExponential(3)}・Δ ${r.dT1Years.map((x) => x.toExponential(3)).join(' / ')} 年(許容の ${r.ratioToTol.toFixed(2)} 倍)・残差 + Δ ${r.residPlusDelta.toFixed(4)} → ${r.withinTol ? '内' : '外'}・恒星月 ${r.dSidDays.map((x) => x.toExponential(2)).join(' / ')} 日`);
  }
  // 🟪(二次元)
  { const base = pinned(HP, PC_ID), wExt = B.wExtOf(HP, base).book, L = lenM(base), divs = [1, 2], B0 = base.bodies;
    const cases = [{ key: 'off', cs: offCase(base) }, { key: 'book', cs: bookCase(base) }];
    for (const e of [0.1, 0.3, etaMerc, 1]) cases.push({ key: `S3:η${e === etaMerc ? 'Merc' : e}`, read: 'S3', eta: e, cs: buildCase(HP, base, wExt, { mode: 'S3', eta: [e, e] }) });
    for (const e of [1, null]) if (lam(e)) cases.push({ key: `BS3:η${etaLab(e)}`, read: 'B+S3', eta: e, lambdaM: lam(e), cs: buildCase(HP, base, wExt, { r2: { lambdaM: lam(e) }, mode: 'S3', eta: [e, e] }) });
    for (const e of [1, null]) if (kk(e)) cases.push({ key: `BrS3:η${etaLab(e)}`, read: 'Br+S3', eta: e, k: kk(e), cs: buildCase(HP, base, wExt, { r2: { k: kk(e) }, mode: 'S3', eta: [e, e] }) });
    const per = (cs, div) => { const k = keyOf(cs, div, 'pc'); if (MEMO.has(k)) return MEMO.get(k); STATS.measures++;
      const r = withSelf(cs.self, () => I3.runPair(HP, cs.q, { ci: 0, oi: 1, dt: B.PC_DT / div, revMax: PCREV })), n = r.rev.length, v = (r.rev[n - 1] - r.rev[0]) / (n - 1) * Math.pow(10, base.scaleExp.T);
      MEMO.set(k, v); return v; };
    const tg = findPreset(HP, PC_ID), fr = tg && tg.fitRecord && tg.fitRecord.targets ? tg.fitRecord.targets[0] : null;
    const obs = fr ? fr.obs : 551856.43872, tol = fr ? fr.tol.value : 0.02592;
    const P = cases.map((c) => divs.map((d) => per(c.cs, d))), offP = P[0];
    const mu = base.physics.G * (B0[0].m + B0[1].m), rv = [B0[1].x - B0[0].x, B0[1].y - B0[0].y], vv = [B0[1].vx - B0[0].vx, B0[1].vy - B0[0].vy];
    const a = 1 / (2 / Math.hypot(...rv) - (vv[0] ** 2 + vv[1] ** 2) / mu), eps = base.physics.relativeDrag.eps, Ka = a / ((a * a + eps * eps) ** 2);
    const rows = cases.map((c, i) => { const v = P[i][P[i].length - 1], num = Math.abs(P[i][1] - P[i][0]), d = v - obs, cs = c.cs, Wb = cs.wExt !== undefined ? cs.wExt : cs.q.physics.relativeDrag.Wbg;
      const Q = (m) => cs.i2 ? HP.inertialR2Q(cs.i2, m, base.physics.G, base.physics.cLight) : 0, sC = cs.self ? cs.self[1] : 0;
      const xiC = c.key === 'off' ? 0 : B0[0].m * Ka / ((Wb || 0) + sC + Q(B0[0].m) / (a * a + eps * eps) + B0[0].m * Ka);
      return { key: c.key, read: c.read || c.key, eta: c.eta === undefined ? null : c.eta, lambdaM: c.lambdaM || null, k: c.k || null, periods: P[i], period: v, numErr: num, diff: d, judge: B.judgeOf(d, tol, num),
        dFromOff: v - offP[offP.length - 1], selfPluto: cs.self ? cs.self[0] : 0, selfCharon: sC, xiCharon: xiC }; });
    out.plutoCharon = { id: PC_ID, emoji: base.emoji, a, aM: a * L, eps, wExt, target: { obs, tol, unit: 's' }, rows, selfCharonEta1: B0[1].m / B0[1].radius ** 3, selfPlutoEta1: B0[0].m / B0[0].radius ** 3,
      quantity: '公転周期(8 公転の平均 —— runPair・刻み 0.16 と 0.08)' };
    for (const r of out.plutoCharon.rows) log(`E 🟪 ${r.key}: 周期 ${r.period.toFixed(5)} s(${r.periods.map((x) => x.toFixed(5)).join(' / ')})・標的との差 ${r.diff.toExponential(3)}・OFF との差 ${r.dFromOff.toExponential(3)}・ξ(カロン)${r.xiCharon.toExponential(3)}`);
  }
  return out;
}

/* ── 段 K・P ── */
export function partK(HP, M, log = console.log) {
  const get = (k) => (M ? M.rows.find((z) => z.key === k) : null) || {};
  const etaMerc = get('M1:η∞:η☉0.1').x || 0.468, lam1 = get('M2:η1:η☉0.1').x, lamInf = get('M2:η∞:η☉0.1').x, k1 = get('M3:η1:η☉0.1').x, kInf = get('M3:η∞:η☉0.1').x;
  const reads = [
    { key: 'S3', label: `S3 だけ(η ${Number(etaMerc).toPrecision(5)})`, r2: null, eta: etaMerc },
    { key: 'BS3', label: 'B + S3(η 1・λ は M2 η 1)', r2: { lambdaM: lam1 }, eta: 1 },
    { key: 'B', label: 'B(η ∞・λ は M2 η ∞)', r2: { lambdaM: lamInf }, eta: null },
    { key: 'BrS3', label: 'Br + S3(η 1・k は M3 η 1)', r2: { k: k1 }, eta: 1 },
    { key: 'Br', label: 'Br(η ∞・k は M3 η ∞)', r2: { k: kInf }, eta: null },
    { key: 'BrS3e0.1', label: 'Br + S3(η 0.1・k は M3 η 1)', r2: { k: k1 }, eta: 0.1 },
    { key: 'BrS3e0.01', label: 'Br + S3(η 0.01・k は M3 η 1)', r2: { k: k1 }, eta: 0.01 },
  ].filter((r) => !r.r2 || (r.r2.lambdaM || r.r2.k));
  const cfgs = [{ key: 'withMoon', bodies: [0, 1, 2], pairs: 'all', sources: 'all' }, { key: 'noMoon', bodies: [0, 1], pairs: 'all', sources: 'all' },
    { key: 'pairsNoEM', bodies: [0, 1, 2], pairs: [[0, 1], [0, 2]], sources: 'pairs' }];
  const em = pinned(HP, EM_ID), wExt = B.wExtOf(HP, em).book, G = em.physics.G, c0 = em.physics.cLight, eps = em.physics.relativeDrag.eps, e2 = eps * eps;
  const rows = [];
  for (const rd of reads) for (const cf of cfgs) {
    const b = clone(em); b.bodies = cf.bodies.map((i) => clone(em.bodies[i]));
    if (cf.bodies.length === 2) { b.timeRef = Object.assign({}, b.timeRef, { pair: [0, 1] }); b.orbitObs = Object.assign({}, b.orbitObs, { center: 0, orbiter: 1 }); }
    const cs = buildCase(HP, b, wExt, { r2: rd.r2, mode: 'S3', eta: cf.bodies.map((i) => i === 0 ? null : rd.eta), pairs: cf.pairs, sources: rd.r2 ? cf.sources : undefined });
    const S = stepSim(HP, cs.q, 1, cs.self), d = (i, j) => Math.hypot(S.x[j] - S.x[i], S.y[j] - S.y[i], S.z[j] - S.z[i]), Kf = (r) => r / ((r * r + e2) ** 2);
    const Q = (m) => cs.i2 ? HP.inertialR2Q(cs.i2, m, G, c0) : 0, hasM = cf.bodies.length === 3, rES = d(1, 0), rEM = hasM ? d(1, 2) : null;
    const wDSun = S.m[0] * Kf(rES), wISun = Q(S.m[0]) / (rES * rES + e2), wIMoon = (hasM && cs.i2 && (cf.sources === 'all')) ? Q(S.m[2]) / (rEM * rEM + e2) : 0, self = cs.self[1];
    const den = wExt + wISun + wIMoon + self;
    const wDMoon = hasM ? S.m[2] * Kf(rEM) : 0;
    rows.push({ read: rd.key, cfg: cf.key, label: rd.label, eta: rd.eta, wDSun, wDMoon, wISun, wIMoon, self, Wbg: wExt, den, xiSun: wDSun / den, moonShareOfDen: wIMoon / den, selfShareOfDen: self / den,
      pairNorm: { sun: wDSun / (wExt + self + wISun), moon: hasM ? S.m[2] * Kf(rEM) / (wExt + self + Q(S.m[2]) / (rEM * rEM + e2)) : null } });
  }
  for (const r of rows) { const ref = rows.find((z) => z.read === r.read && z.cfg === 'noMoon'); r.ratioToNoMoon = r.xiSun / ref.xiSun; }
  for (const r of rows) log(`K ${r.read} ${r.cfg}: 分母 ${r.den.toExponential(4)}(月 ${r.moonShareOfDen.toExponential(3)}・自己 ${r.selfShareOfDen.toExponential(3)})・ξ(太陽から)${r.xiSun.toExponential(4)}・月なしとの比 ${r.ratioToNoMoon.toExponential(4)}`);
  // 器の中の直接法(三体・pairs 全対・自己あり)の照合 —— Br + S3 と B + S3
  const direct = [];
  for (const rd of reads.filter((z) => z.r2)) { const z = zThree(HP, { r2: rd.r2, etaE: isEta(rd.eta) ? rd.eta : null, etaM: isEta(rd.eta) ? rd.eta : null }); direct.push({ read: rd.key, relErrDirect: z.relErrDirect, totalVelocityResidual: z.totalVelocityResidual }); }
  // 解析の型(SI): 火星–フォボス・ダイモス・木星–ガリレオ衛星・地球–月 —— 惑星の分母 = 自己 + 太陽の r⁻² + 衛星の r⁻²
  const mSun = 1.98847e30, c = 299792458, Gsi = 6.6743e-11, lamInfM = lamInf || 8863, kI = kInf || 3;
  const sys = [];
  const addSys = (key, ja, aSI, mP, RP, moons) => {
    for (const eta of [null, 1, etaMerc, 0.1, 0.01]) {
      const S = isEta(eta) ? mP / (eta * RP) ** 3 : 0;
      const Iu = mSun / (lamInfM * aSI * aSI), Iuo = moons.reduce((s, z) => s + z.mSI / (lamInfM * z.aSI ** 2), 0);
      const q = c * c / (2 * kI * Gsi), Ir = q / (aSI * aSI), Iro = moons.reduce((s, z) => s + q / z.aSI ** 2, 0);
      sys.push({ key, ja, eta, aSI, self: S, ratioUniv: (S + Iu) / (S + Iu + Iuo), ratioPropM: (S + Ir) / (S + Ir + Iro), moonShareUniv: Iuo / (S + Iu + Iuo), moonSharePropM: Iro / (S + Ir + Iro) });
    }
  };
  { const E = em.bodies[1], Mo = em.bodies[2], L = lenM(em), Mu = Math.pow(10, em.scaleExp.M), mu = G * (E.m + Mo.m), rv = [Mo.x - E.x, Mo.y - E.y, Mo.z - E.z], vv = [Mo.vx - E.vx, Mo.vy - E.vy, Mo.vz - E.vz];
    const a = 1 / (2 / Math.hypot(...rv) - (vv[0] ** 2 + vv[1] ** 2 + vv[2] ** 2) / mu);
    addSys('earth', '地球–月', Math.hypot(E.x, E.y, E.z) * L, E.m * Mu, E.radius * L, [{ ja: '月', aSI: a * L, mSI: Mo.m * Mu }]); }
  for (const [id, pk, names, pid] of [['marsMoonsReal', 'mars', ['フォボス', 'ダイモス'], 'marsSunInertial3d'], ['jupiterGalilean', 'jupiter', ['イオ', 'エウロパ', 'ガニメデ', 'カリスト'], 'jupiterSunInertial3d']]) {
    const p = findPreset(HP, id); if (!p) continue;
    const Lp = lenM(p), Mp = Math.pow(10, p.scaleExp.M), pp = pinned(HP, pid), aSI = P3.planetOf(pk).el.a * P3.AU_M;
    const oscA = (k) => { const b0 = p.bodies[0], b1 = p.bodies[k], mu = p.physics.G * (b0.m + b1.m), rv = [b1.x - b0.x, b1.y - b0.y, (b1.z || 0) - (b0.z || 0)], vv = [b1.vx - b0.vx, b1.vy - b0.vy, (b1.vz || 0) - (b0.vz || 0)];
      return 1 / (2 / Math.hypot(...rv) - (vv[0] ** 2 + vv[1] ** 2 + vv[2] ** 2) / mu); };
    addSys(pk, (pk === 'mars' ? '火星–' : '木星–') + names.join('・'), aSI, pp.bodies[1].m * Math.pow(10, pp.scaleExp.M), pp.bodies[1].radius * lenM(pp),
      names.map((ja, k) => ({ ja, aSI: oscA(k + 1) * Lp, mSI: p.bodies[k + 1].m * Mp })));
  }
  for (const z of sys) log(`K 解析 ${z.ja} η ${etaLab(z.eta)}: 普遍の λ の比 ${z.ratioUniv.toExponential(4)}・λ ∝ m の比 ${z.ratioPropM.toExponential(4)}`);
  return { id: EM_ID, wExt, reads, rows, direct, systems: sys, lambdaInfM: lamInfM, kInf: kI,
    quantity: '1 步の後の地球の行(太陽からの ξ = w_D,☉/(W_bg + Σw_I + w_self))と、月なしの写しとの比 —— 近点の走行はしない(近点は ξ に比例 —— 変種 B の形)' };
}
/** 段 P: 対ごとの正規化の対照(式の値だけ —— 器の解法には入れない)—— 段 K の行から ξ_ij(和)と ξ_ij(対ごと)を並べる */
export function partP(K) {
  const rows = K.rows.filter((r) => r.cfg === 'withMoon').map((r) => { const nm = K.rows.find((z) => z.read === r.read && z.cfg === 'noMoon');
    return { read: r.read, label: r.label, sumSun: r.xiSun, pairSun: r.pairNorm.sun, noMoonSun: nm.xiSun, pairOverNoMoon: r.pairNorm.sun / nm.xiSun, sumOverNoMoon: r.xiSun / nm.xiSun,
      sumMoon: r.wDMoon / r.den, pairMoon: r.pairNorm.moon, moonOverSunDrag: r.wDMoon / r.wDSun, selfShare: r.selfShareOfDen }; });
  return { rows, note: 'ξ_ij(対ごと)= w_D,ij/(W_bg + w_self,i + w_I,ij)・ξ_ij(和)= w_D,ij/(W_bg + w_self,i + Σ_k w_I,ik)—— 器の解法には入れていない(同じ位置での式の値)。'
    + '自己項は両方の分母に同じに入る —— 自己が分母の主なら、和と対ごとの差は小さくなる(自己の割合を併記)' };
}

/* ── 段 A: 解析の表 ── */
export function partA(HP, M, T, log = console.log) {
  const get = (k) => (M ? M.rows.find((z) => z.key === k) : null) || {};
  const etaMerc = get('M1:η∞:η☉0.1').x, lamInf = get('M2:η∞:η☉0.1').x || 8863;
  const rows = PLANETS.map((id) => {
    const p = pinned(HP, id), L = lenM(p), Mu = Math.pow(10, p.scaleExp.M), b = p.bodies[1], f = B.pn1Formula(p), dens = Mu / (L ** 3);
    const self1 = b.m / b.radius ** 3, Isun = p.bodies[0].m / ((lamInf / L) * f.a * f.a), wD = p.bodies[0].m / f.a ** 3;
    return { id, emoji: p.emoji, a: f.a, aAU: f.a * L / P3.AU_M, e: f.e, mSI: b.m * Mu, RSI: b.radius * L, rhoMean: b.m * Mu / ((4 * Math.PI / 3) * (b.radius * L) ** 3),
      self1, self1SI: self1 * dens, selfMerc: etaMerc ? self1 / etaMerc ** 3 : null, IsunLamInf: Isun, wDSun: wD, s1: self1 / Isun, sMerc: etaMerc ? self1 / etaMerc ** 3 / Isun : null,
      etaFor_s4e5: Math.cbrt(self1 / (4e-5 * Isun)), formRatio: [0, 0.1, 1, 10].map((s) => ({ s, F: formRatio(s, f.e) })) };
  });
  // 統括の見込みとの照合(M1 —— 共通の η の予言の相対: 金星 −73%・火星 −92%・木星 −98%)
  const m1 = T ? T.table.find((t) => t.key === 'M1:η∞:η☉0.1') : null;
  const brief = [{ id: 'venusSunInertial3d', relBrief: -0.73, predBrief: 2.3 }, { id: 'marsSunInertial3d', relBrief: -0.92, predBrief: 0.11 }, { id: 'jupiterSunInertial3d', relBrief: -0.98, predBrief: 0.0013 }]
    .map((z) => { const r = m1 ? m1.rows.find((q) => q.id === z.id) : null; return Object.assign(z, { pred: r ? r.pred : null, rel: r ? r.rel : null, relToPn1: r ? r.pred / r.pn1 - 1 : null, analytic: r ? r.analytic : null }); });
  const coord = { s1: { mercury: 0.34, venus: 1.15, mars: 3.8, jupiter: 15, neptune: 620 },
    F: { s0: [1, 1, 1], s01: [1.071, 1.074, 1.074], s1: [1.013, 1.000, 1.003], s10: [0.276, 0.256, 0.260] }, e: [0.2056, 0.0068, 0.0934], etaNeed: 46 };
  const Fmine = Object.fromEntries([['s0', 0], ['s01', 0.1], ['s1', 1], ['s10', 10]].map(([k, s]) => [k, coord.e.map((e) => formRatio(s, e))]));
  for (const r of rows) log(`A ${r.emoji}: ρ̄ ${r.rhoMean.toFixed(0)} kg/m³・自己(η 1)${r.self1.toPrecision(4)}・太陽の r⁻²(λ ${Number(lamInf).toPrecision(6)} m)${r.IsunLamInf.toPrecision(4)}・s(η 1)${r.s1.toPrecision(4)}・s ≤ 4e-5 の η ≥ ${r.etaFor_s4e5.toPrecision(3)}`);
  log('A F(s,e)(統括の数): ' + Object.entries(Fmine).map(([k, v]) => k + ' ' + v.map((x) => x.toFixed(4)).join('/') + '(' + coord.F[k].join('/') + ')').join(' · '));
  return { rows, lambdaInfM: lamInf, etaMercury: etaMerc, brief, coordinator: coord, formRatioMine: Fmine,
    note: 's = 自己 / 太陽の r⁻²(半長径 a で)—— s ∝ ρ̄ a²/η³。λ は M2 η ∞(太陽の η☉ 0.1)の根' };
}

/* ── 文書の表(docs/PHYSICS.md〔第304便b〕と QA docs.shell304b が照合する数 —— 同じ関数)── */
export const fP = (x, d = 6) => (x === null || x === undefined || !Number.isFinite(x)) ? '—' : Number(x).toPrecision(d);
export const fE = (x, d = 2) => (x === null || x === undefined || !Number.isFinite(x)) ? '—' : Number(x).toExponential(d);
export const fPct = (x, d = 1) => (x === null || x === undefined || !Number.isFinite(x)) ? '—' : (100 * x).toFixed(d) + '%';
const xLab = (r) => r.x === null || r.x === undefined ? '—' : (r.param === 'eta' ? 'η ' + r.x : r.param === 'k' ? 'k ' + r.x : r.x + ' m');
export function physicsTables(J) {
  const out = [], M = J.mercury;
  out.push('| 構成 | 水星の η | 太陽の η☉ | 根 | λ/r_s☉(k) | 近点率の差 h / h/2 / h/4 [″/世紀] | 自己の割合(a で) | 門 |', '|---|---|---|---|---|---|---|---|');
  for (const r of M.rows) {
    if (r.x === null || r.x === undefined) { out.push(`| ${r.fam}${r.targetKind === 'ref' ? '(1PN+A1)' : ''} | ${etaLab(r.eta)} | ${etaLab(r.etaSun)} | ${r.status} | — | — | — | 偽 |`); continue; }
    out.push(`| ${r.fam}${r.targetKind === 'ref' ? '(1PN+A1)' : ''} | ${r.param === 'eta' ? r.x : etaLab(r.eta)} | ${etaLab(r.etaSun)} | ${xLab(r)} | ${r.lambdaOverRs === null ? '—' : fP(r.lambdaOverRs, 5)} | ${r.diffs.map((x) => x.toFixed(5)).join(' / ')} | ${fP(r.den.selfShare, 4)} | ${r.gate ? '真' : '偽'} |`);
  }
  out.push('');
  out.push('| 本(s の走査・λ 固定) | s | η | 実測の比 Δϖ(s)/Δϖ(∞)(h/2) | 解析の比 | F(s,e)(固定中心の形) |', '|---|---|---|---|---|---|');
  for (const z of M.sScan.rows) out.push(`| ${z.emoji} | ${z.s} | ${fP(z.eta, 4)} | ${z.ratio.toFixed(5)} | ${z.analyticRatio.toFixed(5)} | ${z.formRatio.toFixed(5)} |`);
  out.push('');
  const T = J.transfer, ids = TRANSFER;
  const show = ['M1:η∞:η☉0.1', 'M2:η1:η☉0.1', 'M2:η10:η☉0.1', 'M2:η50:η☉0.1', 'M2:η100:η☉0.1', 'M2:η∞:η☉0.1', 'M2ref:η50:η☉0.1', 'M2ref:η∞:η☉0.1', 'M3:η1:η☉0.1', 'M3:η∞:η☉0.1', 'M4:η1:η☉0.1', 'M4:η1000:η☉0.1', 'M4r:η1:η☉0.1'];
  out.push('| 構成(水星の根) | ' + ids.map((id) => T.table.find((t) => t.rows)?.rows.find((z) => z.id === id)?.emoji || id).join(' | ') + ' |', '|---|' + ids.map(() => '---').join('|') + '|');
  out.push('| 標的 = 1PN の式 + EPM2011 の追加 ± σ | ' + ids.map((id) => { const t = T.targets[id]; return fP(t.value) + (t.sigma === null ? '(σ なし)' : ' ± ' + t.sigma); }).join(' | ') + ' |');
  for (const k of show) { const t = T.table.find((z) => z.key === k); if (!t || t.skipped) continue;
    out.push(`| ${k} | ` + ids.map((id) => { const r = t.rows.find((z) => z.id === id); return `${fP(r.pred)}(${fPct(r.rel)}・s ${fE(r.s, 1)})`; }).join(' | ') + ' |'); }
  out.push('');
  out.push('| 構成(惑星ごとに要る η) | ' + PLANETS.map((id) => ctxEmoji(J, id)).join(' | ') + ' | 地球型の比(最大/最小) | 巨大ガス | 巨大氷 |', '|---|' + PLANETS.map(() => '---').join('|') + '|---|---|---|');
  for (const inv of T.inverse) { if (inv.skipped) continue;
    out.push(`| ${inv.key} | ` + PLANETS.map((id) => { const r = inv.rows.find((z) => z.id === id); return r.roots.length ? r.roots.map((q) => (q.eta === null ? '(' + fP(q.etaAnalytic, 4) + ')' : fP(q.eta, 4)) + (q.status === 'fitted' ? '' : '*')).join('・') : '届かない'; }).join(' | ')
      + ' | ' + inv.groups.map((g) => g.ratioMaxMin === null ? '—' : fP(g.ratioMaxMin, 3)).join(' | ') + ' |'); }
  out.push('');
  const E = J.earthMoon;
  if (E && E.earthMoonSun) {
    out.push('| 🌦️ の写し | ξ(月 —— 初期の a) | 近地点の周期の差 Δ [年](h / h/2) | Δ/許容 0.005 | 残差 −0.00101 + Δ [年] | 恒星月の差 [日] |', '|---|---|---|---|---|---|');
    for (const r of E.earthMoonSun.rows) out.push(`| ${r.key} | ${fE(r.xiMoon, 3)} | ${r.dT1Years.map((x) => fE(x, 3)).join(' / ')} | ${r.ratioToTol.toFixed(2)} | ${r.residPlusDelta.toFixed(4)}(${r.withinTol ? '許容の内' : '許容の外'}) | ${r.dSidDays.map((x) => fE(x, 2)).join(' / ')} |`);
    out.push('');
  }
  if (E && E.plutoCharon) {
    out.push('| 🟪 の写し | ξ(カロン —— 初期の a) | 公転周期 [s](h / h/2) | 標的との差 [s] | 引きずり OFF との差 [s] |', '|---|---|---|---|---|');
    for (const r of E.plutoCharon.rows) out.push(`| ${r.key} | ${fE(r.xiCharon, 3)} | ${r.periods.map((x) => x.toFixed(4)).join(' / ')} | ${fE(r.diff, 3)} | ${fE(r.dFromOff, 3)} |`);
    out.push('');
  }
  const K = J.manyBody;
  if (K) {
    out.push('| 読み(🌦️ の写し・pairs 全対・1 步) | 地球の分母(月の割合・自己の割合) | ξ(太陽から)月あり | 月なしとの比 | 対ごとの正規化なら ξ(太陽から) |', '|---|---|---|---|---|');
    for (const r of K.rows.filter((z) => z.cfg === 'withMoon')) out.push(`| ${r.label} | ${fE(r.den, 4)}(${fE(r.moonShareOfDen, 3)}・${fE(r.selfShareOfDen, 3)}) | ${fE(r.xiSun, 4)} | ${fE(r.ratioToNoMoon, 4)} | ${fE(r.pairNorm.sun, 4)} |`);
    out.push('');
    out.push('| 系(解析) | η | 普遍の λ: 太陽からの ξ の比 | λ ∝ m: 太陽からの ξ の比 |', '|---|---|---|---|');
    for (const z of K.systems) out.push(`| ${z.ja} | ${z.eta === null ? '∞' : fP(z.eta, 4)} | ${fE(z.ratioUniv, 3)} | ${fE(z.ratioPropM, 3)} |`);
    out.push('');
  }
  const A = J.analytic;
  if (A) {
    out.push('| 本 | ρ̄ [kg/m³] | 自己 m/R³(η 1・本の単位) | 太陽の r⁻²(a で) | s(η 1) | s(水星の M1 の η) | s ≤ 4×10⁻⁵ に要る η |', '|---|---|---|---|---|---|---|');
    for (const r of A.rows) out.push(`| ${r.emoji} | ${r.rhoMean.toFixed(0)} | ${fP(r.self1, 4)} | ${fP(r.IsunLamInf, 4)} | ${fP(r.s1, 3)} | ${fP(r.sMerc, 3)} | ${fP(r.etaFor_s4e5, 3)} |`);
    out.push('');
  }
  return out.join('\n');
}
const ctxEmoji = (J, id) => { const t = J.transfer.table.find((z) => z.rows); const r = t && t.rows.find((z) => z.id === id); return r ? r.emoji : (id === MERCURY ? '🌡️' : id); };
/** QA docs.shell304b が PHYSICS〔第304便b〕の中に探す数の文字列(表と同じ書式)。 */
export function docNumbers(J) {
  const out = [];
  for (const r of J.mercury.rows) if (r.x !== null && r.x !== undefined) { out.push(xLab(r)); if (r.diffs) out.push(r.diffs[2].toFixed(5)); }
  for (const z of J.mercury.sScan.rows) out.push(z.ratio.toFixed(5));
  for (const k of ['M1:η∞:η☉0.1', 'M2:η1:η☉0.1', 'M2:η50:η☉0.1', 'M2:η∞:η☉0.1']) { const t = J.transfer.table.find((z) => z.key === k); if (t && !t.skipped) for (const r of t.rows) out.push(fP(r.pred)); }
  if (J.earthMoon && J.earthMoon.earthMoonSun) for (const r of J.earthMoon.earthMoonSun.rows) out.push(fE(r.xiMoon, 3), r.residPlusDelta.toFixed(4));
  if (J.manyBody) for (const r of J.manyBody.rows.filter((z) => z.cfg === 'withMoon')) out.push(fE(r.ratioToNoMoon, 4));
  if (J.analytic) for (const r of J.analytic.rows) out.push(fP(r.s1, 3));
  return [...new Set(out)];
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) {
  const t0 = Date.now();
  const OUT_PATH = process.env.W304B_OUT || path.join(ROOT, 'tests', 'out', 'shell-w304b.json');
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
  const prev = (() => { try { return JSON.parse(fs.readFileSync(OUT_PATH, 'utf8')); } catch { return null; } })();
  CARRY = H4C.openCarry(OUT_PATH, { harnessVersion: HARNESS_VERSION });   // 第311便c: h/4 の転記(前の正本 —— 書き換える前に開く)
  // 包みを入れる前の指紋(段 Z の素通りのビット同一)
  let fpBefore = null;
  if (PARTS.includes('Z')) { const S = stepSim(HP, bookCase(pinned(HP, MERCURY)).q, 2000, null); fpBefore = fpS(S); }
  installSelfWrap();
  const out = { meta: null, harnessVersion: HARNESS_VERSION, parts: PARTS };
  out.pin = { file: DECL_FILE, base: PIN.base, version: PIN.version, liveSame: liveSame(HP) };
  const tp = {};
  const timed = (k, f) => { const t = Date.now(); const r = f(); tp[k] = { wallSec: (Date.now() - t) / 1000 }; console.log(`[${k}] ${tp[k].wallSec.toFixed(1)} s・走行 ${STATS.measures}`); return r; };
  const keep = (k) => (prev && prev[k] !== undefined) ? prev[k] : undefined;
  out.zero = PARTS.includes('Z') ? timed('Z', () => partZ(HP, fpBefore)) : keep('zero');
  out.mercury = PARTS.includes('M') ? timed('M', () => partM(HP)) : keep('mercury');
  out.transfer = (PARTS.includes('T') && out.mercury) ? timed('T', () => partT(HP, out.mercury)) : keep('transfer');
  out.earthMoon = (PARTS.includes('E') && out.mercury) ? timed('E', () => partE(HP, out.mercury)) : keep('earthMoon');
  out.manyBody = PARTS.includes('K') ? timed('K', () => partK(HP, out.mercury || null)) : keep('manyBody');
  out.pairNorm = (PARTS.includes('P') && out.manyBody) ? timed('P', () => partP(out.manyBody)) : keep('pairNorm');
  if (out.zero && out.mercury && (PARTS.includes('Z') || PARTS.includes('M') || !out.zero.sourceShell)) { const m = out.mercury.rows.find((z) => z.key === 'M1:η∞:η☉0.1'); if (m && m.x) out.zero.sourceShell = zSourceShell(HP, m.x); }
  out.analytic = PARTS.includes('A') ? timed('A', () => partA(HP, out.mercury || null, out.transfer || null)) : keep('analytic');
  const gates = {};
  if (out.zero) {
    const Z = out.zero;
    gates.kernelsClosedForm = Z.kernels.maxRelErr < 1e-9 && Z.kernels.far.every((z) => Math.abs(z.k3rel / z.k3form - 1) < 0.02 && Math.abs(z.k2rel / z.k2form - 1) < 0.02);
    gates.oneStepClosedForm = ['pinS3', 'pinBS3', 'pinBS2'].every((k) => Z.oneStep[k].relErr < 1e-12) && Z.oneStep.free2.relErrMax < 1e-12 && Z.oneStep.three.relErrDirect < 1e-12;
    gates.totalVelocity = Z.oneStep.three.totalVelocityResidual < 1e-12 && Z.oneStep.three.iIdentity < 1e-12;
    gates.wrapPassThrough = Z.pass.bitSameNull === true && Z.pass.bitSameZero === true && Math.abs(Z.pass.constEquiv.apsDiff) < 1e-6;
  }
  if (out.mercury) {
    const prim = out.mercury.rows.filter((r) => r.targetKind === 'conv' && r.etaSun === ETA_SUN_DEFAULT);
    gates.mercuryFits = prim.length >= 20 && prim.every((r) => r.status === 'fitted') && out.mercury.rows.filter((r) => r.x !== null && r.x !== undefined).every((r) => r.gate === true);
    gates.sScan = out.mercury.sScan.rows.length === S_SCAN.length * S_SCAN_IDS.length && out.mercury.sScan.rows.every((z) => Number.isFinite(z.ratio));
  }
  if (out.transfer) gates.transferMeasured = out.transfer.table.filter((t) => !t.skipped).length >= 30 && out.transfer.table.filter((t) => !t.skipped).every((t) => t.rows.length === TRANSFER.length && t.rows.every((r) => Number.isFinite(r.pred)))
    && out.transfer.inverse.length === T_INV.length;
  if (out.earthMoon) gates.earthMoonTable = out.earthMoon.earthMoonSun.rows.every((r) => Number.isFinite(r.dT1) && Number.isFinite(r.xiMoon)) && out.earthMoon.plutoCharon.rows.every((r) => Number.isFinite(r.period));
  if (out.manyBody) gates.manyBodyReadout = out.manyBody.rows.length >= 15 && out.manyBody.rows.every((r) => Number.isFinite(r.xiSun) && Number.isFinite(r.ratioToNoMoon)) && out.manyBody.direct.every((z) => z.relErrDirect < 1e-12 && z.totalVelocityResidual < 1e-12);
  if (out.analytic) gates.analyticTable = out.analytic.rows.length === PLANETS.length;
  out.gates = gates; out.ok = Object.values(gates).every(Boolean) && Object.keys(gates).length > 0; out.timing = tp; out.stats = Object.assign({}, STATS, { wrapCalls: WRAP.calls });
  const h4c = H4C.carryStamp(CARRY, { unit: '段 M の水星の根の行(M:<構成>)・段 T の T_FINE の行(T:<構成>:<本>)・本ごとの対照(control:<本>)',
    valueKeys: '段 M の行は h/4 の欄(diffs[2]・periodShiftDays[2]・eccShift[2]・h4gap・analyticOverMeasured)を除く全欄 / 段 T は h/4 から作る欄を除く行の欄と表の行の鍵 / 対照は h と h/2 の aps・periodDays・ecc(走行の数 stats と所要は値の鍵ではない)' });
  if (h4c) out.h4Carried = h4c;
  const CODE = ['tests/exp-w304b-shell.mjs', 'tests/exp-w303b-inertialr2.mjs', 'tests/exp-w299c-planets3d.mjs', 'tests/lib-w299c-planets3d.mjs', 'tests/exp-w302b-gloc.mjs', 'tests/lib-w302a-wbg.mjs', 'tests/lib-w302c-pre.mjs',
    'tests/lib-w303a-pre.mjs', 'tests/lib-w297b-fit.mjs', 'tests/exp-w298c-moon3d.mjs', 'tests/exp-w300b-emonly.mjs', 'tests/exp-w295c-inertial3.mjs', 'tests/lib-w302h-splitrec.mjs', 'tests/lib-w280b-emgrid.mjs',
    'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs', 'tests/lib-w303e-fitstop.mjs', 'tests/lib-w292c-dragcore.mjs', 'tests/lib-w311c-h4carry.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第304便b', target: TARGET, code: CODE, inputs: [TARGET, DECL_FILE] }), {
    harnessVersion: HARNESS_VERSION, loadErrors: errors.length, fitstop: FS.FITSTOP_VERSION,
    ruling: '原仮定者の裁定(第94報)「引きずり核球面近似係数」(引きずり核の球面に質量が集まるとする便宜上の近似 —— 引きずり量の分母の慣性決定力に自分自身を入れる・恒星は小さい半径・似た天体では近い値を予想・まず引きずり核表面で検証)・前便の指摘(1PN 相当は引きずりだけでは合わない量を埋める為 —— 引きずりが主)',
    reading: '統括の検証項目 R196(器の中の写しで η〔と λ〕・移送・太陽の η・地球–月・冥王星–カロン・多体・対ごとの正規化の対照)',
    notClaim: ['η が決まった', '核を同定した', '1PN を導いた', 'GR と一致した', '43″ が出た', '法則を発見した', '現実を再現した'] });
  out.elapsedS = (Date.now() - t0) / 1000;
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 1) + '\n');
  console.log('gates ' + JSON.stringify(gates));
  console.log('→ ' + path.relative(ROOT, OUT_PATH) + '(' + out.elapsedS.toFixed(1) + ' s)・ok ' + out.ok);
  process.exit(out.ok ? 0 : 1);
}
