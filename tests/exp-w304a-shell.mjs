// 第304便a(原仮定者の裁定(第94報)「引きずり核球面近似係数」・統括の検証項目 R195)—— **引きずり核の球面(dragCore の殻の形)・自己の項・総速度の読み口 の器**
// (Node だけ —— 対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、アプリの步〔semic・dfmInertialDragStep3 / dfmInertialDragStep〕をそのまま走らせる・1 プロセス)。
//
// ■ 裁定(第94報 —— そのまま)
//   「中心座標をそのまま使うと、自分自身への影響が距離ゼロで無限になってしまう。引きずり核の球面に質量が集まっているとする事で、便宜上の近似を行う。
//    これにより、自分の引きずり核の球面の移動で自分の重心を引きずる事が可能。引きずり量の分母の慣性決定力に自分自身を入れられる」
//   「恒星の、質点に近い引きずりは、引きずり核に小さな半径を設定する事で近似する」「天体の半径と、引きずり核の半径の比率が引きずり核球面近似係数」
//   「まずは引きずり核表面を導入して検証する。dragCore の拡張を想定」
//
// ■ 宣言(html —— 省略時オフ・在位の本は宣言しない)
//   天体 dragCore:{shellRatio:η}(R_d = η·radius)・本 relativeDrag.shellSelf:"drag"(S3 —— m/R_d³)・inertialR2.self:"shell"(S2 —— q/R_d²)・shellSelfEps:true(軟化の対照)
//
// ■ 段(正本 tests/out/shell-w304a.json —— 段 shell-304a)
//   Z 零試験: ② η → 0 で殻の核が点の核へ(比 ∝ R_d²/r²)③ 孤立した 1 体は W = v(位置は殻なしとビット同一)④ 二体の閉形式(1 步の u・ξ —— S3 と S2+I2)
//     ⑤ 少数体(二次元・三次元)の直接法と多粒子の Gauss–Seidel を器の中の直接法(部分ピボット)と・PCG は殻の源と一緒に拒否 ⑥ 共通の並進・回転の共変
//     ⑦ 総速度の方程式の残差と位置の更新 x₁ − x₀ = h W(二重に足していない)⑧ 殻の核の閉形式と数値積分(Gauss–Legendre)の一致 1e-10
//     (①省略時オフの 176 本と ⑨状態の契約は QA behavior.shell304 と bitsame/sigsame —— 本器は代表の本で鍵が無いことだけ)
//   M 🌡️ の写し(G_loc なし・在位の W_bg 221.1204・8 公転・検出器 B・同じ刻み h と h/2)に水星と太陽の殻 η ∈ {1, 0.5, 0.1}・shellSelf:"drag" を宣言し、
//     引きずり OFF の対照との近点率の差を測る。解析の見込み(水星の ξ ≪ 1 で近点率 ∝ 1/(W_bg + m/R_d³))と照合。
//     参考の行: W_bg を外部の推定 W_ext(宇宙のみ —— 太陽を含めない)に置き、水星の η を「m/(ηR)³ = 221.1204 − W_ext」の解析の値 η* にした行(S3 だけで 43 の大きさ)
//
// ■ しないこと・言わないこと
//   ・在位の本の宣言を変えない(器の写しだけ)。η を決めない(本格の探索は枝 b)。「η が決まった」「自分を引きずった」「慣性を導いた」と書かない。
//
// 実行: node tests/exp-w304a-shell.mjs → 正本 tests/out/shell-w304a.json(W304A_OUT で出力先を変える・W304A_PARTS=Z,M で段を選ぶ —— 正本は全段・
//   W304A_QUICK=1 は M の刻みを h だけにした試走 —— 正本にしない)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as PL from './exp-w299c-planets3d.mjs';
import * as P3 from './lib-w299c-planets3d.mjs';
import { pin305, DECL305_DATA_FILE } from './lib-w306a-pre.mjs';   // 第306便a(AN336): 在位の惑星 7 本の宣言を変えた世代では、この正本(歴史の記録)は第305便の 🌡️ の宣言の写しで測る
const REGEN_SCOPE = {"presets":"all","roots":["$","DT","FIT_COND_KEYS","FIT_COND_VERSION","FIT_KNOB_KEYS","FIT_NUMERICS_KEYS","FIT_RECORD_KEYS","FIT_RECORD_VERSION","FIT_RECORD_VERSIONS","FIT_RESIDUAL_KEYS","FIT_TARGET_KEYS","FIT_TOL_KEYS","HP.DRAG_SHELL_VERSION","HP.FIT_COND_VERSION","HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.dragShellK2","HP.dragShellK3","HP.fitCondSig","HP.inertialDragState","HP.sim","HP.validateFitRecord","HP.validatePreset","HP.wbgEstimateOf","T","ab","ch","ctx","cw","fmt","pnSource","validateFitRecord"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w304a-shell-1';
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const PARTS = (process.env.W304A_PARTS || 'Z,M').split(',');
const QUICK = process.env.W304A_QUICK === '1';
export const DIVS = QUICK ? [1] : [1, 2];
export const MERCURY = 'mercurySunInertial3d';
export const ETAS = Object.freeze([1, 0.5, 0.1]);
export const N_WIN = 8;
export const ETA_SUN_SMALL = 0.01;                  // 参考の行 2 の太陽の η(恒星は小さい半径 —— 裁定(第94報))
export const TARGET_APS = 43.0;                      // 照合規約の値(″/世紀)—— 参考の行の比較だけ(フィットしない)
const clone = (x) => JSON.parse(JSON.stringify(x));
const find = (HP, id) => HP.allPresets().find((q) => q.id === id);

/* ── 本の写し・走行 ── */
/** 🌡️ の写し(G_loc と fitRecord を外す —— 宣言の他の部分はそのまま)。 */
export function mercuryOf(HP) { const q = clone(pin305(find(HP, MERCURY))); delete q.physics.gLoc; delete q.fitRecord; return q; }   // 第306便a: pin305 は本ごとの門(第305便の html では写さない)
/** 殻の写し: etaSun・etaMer(null は殻なし)・self("drag" | null)・Wbg(省略は本の値)・off(引きずり OFF の対照)。 */
export function shellOf(p, o = {}) {
  const q = clone(p), rd = q.physics.relativeDrag;
  if (o.off) { q.physics.relativeDrag = { law: 'inertial', Wbg: null, enabled: false, eps: rd.eps, history: 'positions', pairs: rd.pairs }; }
  else if (o.Wbg !== undefined) rd.Wbg = o.Wbg;
  if (o.etaSun) q.bodies[0].dragCore = { shellRatio: o.etaSun };
  if (o.etaMer) q.bodies[1].dragCore = { shellRatio: o.etaMer };
  if (o.self && !o.off) q.physics.relativeDrag.shellSelf = o.self;
  if (o.i2 && !o.off) q.physics.relativeDrag.inertialR2 = clone(o.i2);
  return q;
}
export function stepS(HP, preset, steps, dt) {
  const v = HP.validatePreset(clone(preset)); if (!v.ok) throw new Error('validatePreset: ' + JSON.stringify(v.errors).slice(0, 300));
  const S = HP.coord3d.makeSim(); S.build(clone(v.preset));
  const h = dt || preset.physics.stepDt || 0.01;
  for (let k = 0; k < steps; k++) S.step(h);
  return S;
}
const fpS = (S) => { let h = 0x811c9dc5; const f = new Float64Array(1), u8 = new Uint8Array(f.buffer);
  for (const k of ['x', 'y', 'z', 'vx', 'vy', 'vz']) { const A = S[k]; if (!A) continue; for (let i = 0; i < S.n; i++) { f[0] = A[i]; for (let j = 0; j < 8; j++) h = Math.imul(h ^ u8[j], 0x01000193) >>> 0; } }
  return h.toString(16); };
/** 人工の多体の本(三次元 —— c3=false は二次元)。全粒子 free・半径 0.05・殻 eta(null は殻なし —— 奇数番だけ殻 は oddOnly)・乱数は線形合同法(決定的)。 */
export function toy(n, o = {}) {
  let s = 4321 + n; const rnd = () => { s = (Math.imul(s, 1103515245) + 12345) >>> 0; return s / 4294967296; };
  const c3 = o.c3 !== false, bodies = [];
  for (let i = 0; i < n; i++) {
    const b = { type: 'single', m: 0.5 + rnd(), x: 10 * (rnd() - 0.5), y: 10 * (rnd() - 0.5), vx: rnd() - 0.5, vy: rnd() - 0.5, spin: 0, radius: 0.05 + 0.05 * rnd(), pinned: false };
    if (c3) { b.z = 10 * (rnd() - 0.5); b.vz = rnd() - 0.5; } else { rnd(); rnd(); }
    if (o.eta && (!o.oddOnly || i % 2 === 1)) b.dragCore = { shellRatio: o.eta * (0.5 + rnd()) };
    bodies.push(b);
  }
  const rd = Object.assign({ law: 'inertial', Wbg: o.Wbg || 1e-3, eps: 0.3, history: 'positions', pairs: 'all' }, o.rd || {});
  if (o.noDrag) rd.Wbg = null, rd.enabled = false;
  const ph = { G: 1, D0: 0, kFrame: 0, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, kappaT: 1 / 900, cLight: 30, bM: 1, etaRad: 0, pRad: 4,
    gravityX: 0, gravityY: 0, massFloor: 1e-9, geoPN: 3, lambdaPN: 0, pnAlpha: 1.5, radiusScale: 1, softening: 0.3, softeningFloor: 0.3, radiusFloor: 0.001, timeScale: 1,
    contactMode: 'none', stepDt: 0.002, relativeDrag: rd };
  if (c3) { ph.coord = '3d'; ph.stateCarry = 'double'; }
  return { id: 'w304aToy', name: 'w304a toy', emoji: '🧪', group: '原理', sampleClass: 'principle', integrator: 'semi', description: 'w304a toy', camera: { scale: 30, x: 0, y: 0 },
    world: { boundary: 'none', size: 200 }, physics: ph, bodies };
}

/* ── 器の中の独立の式 ── */
let GL20 = null;
function gaussLegendre(n) {
  const x = [], w = [];
  for (let i = 1; i <= n; i++) {
    let z = Math.cos(Math.PI * (i - 0.25) / (n + 0.5)), pp = 1;
    for (let it = 0; it < 100; it++) { let p1 = 1, p2 = 0; for (let j = 1; j <= n; j++) { const p3 = p2; p2 = p1; p1 = ((2 * j - 1) * z * p2 - (j - 1) * p3) / j; }
      pp = n * (z * p1 - p2) / (z * z - 1); const z1 = z; z = z1 - p1 / pp; if (Math.abs(z - z1) < 1e-16) break; }
    x.push(z); w.push(2 / ((1 - z * z) * pp * pp));
  }
  return { x, w };
}
/**
 * 殻平均の**数値積分**(閉形式と独立 —— 定義 ½∫₋₁¹ f(s) dμ をそのまま積む): μ = 1 − u²(u ∈ [0, √2] —— 球面の近く r ≈ R の √ の特異を消す)・
 * 区間は u = 0 のまわりへ等比に細かく(特性の幅 √(((r−R)²+ε²)/(2rR)) の 1e-4 倍から 2 倍ずつ)・区間ごとに 20 点の Gauss–Legendre。kind 3: s/(s²+ε²)²・kind 2: 1/(s²+ε²)。
 */
export function shellNumeric(r, R, eps, kind) {
  if (!GL20) GL20 = gaussLegendre(20);
  const f = (t) => { const s2 = (r - R) * (r - R) + 2 * r * R * t, s = Math.sqrt(s2); return kind === 3 ? s / ((s2 + eps * eps) * (s2 + eps * eps)) : 1 / (s2 + eps * eps); };
  const U = Math.SQRT2, uc = Math.sqrt(Math.max(((r - R) * (r - R) + eps * eps) / (2 * r * R), 1e-300));
  const pts = [0]; for (let u = uc * 1e-4; u < U; u *= 2) pts.push(u); pts.push(U);
  let sum = 0;
  for (let k = 0; k + 1 < pts.length; k++) { const a = pts[k], b = pts[k + 1], h = (b - a) / 2, c = (a + b) / 2;
    for (let q = 0; q < GL20.x.length; q++) { const u = c + h * GL20.x[q]; sum += GL20.w[q] * h * f(u * u) * 2 * u; } }
  return sum / 2;
}
/** 器の中の直接法(密行列のガウス消去 —— 部分ピボット): 行 i の対角 1 + Σ_j a_ij + c·I_self,i・右辺 Σ a_ij (v_j − v_i)(3 成分 —— 二次元は z を 0)。 */
export function denseShellSolve(HP, S, o = {}) {
  const n = S.n, m = S.m, rd = S.relDrag, C = 1 / rd.Wbg, eps = rd.eps, e2 = eps * eps, SH = S._dragShellRd;
  const c3 = S.coord3d === true, X = S._rdQX || S.x, Y = S._rdQY || S.y, Z = c3 ? (S._rdQZ || S.z) : null, V = [S.vx, S.vy, c3 ? S.vz : null];
  const A = new Float64Array(n * n), B = [new Float64Array(n), new Float64Array(n), new Float64Array(n)];
  for (let i = 0; i < n; i++) {
    let deg = 0;
    for (let j = 0; j < n; j++) {
      if (j === i) continue;
      const dx = X[j] - X[i], dy = Y[j] - Y[i], dz = Z ? Z[j] - Z[i] : 0, r2 = dx * dx + dy * dy + dz * dz, r = Math.sqrt(r2), s = r2 + e2;
      const K = (SH && SH[j] > 0) ? HP.dragShellK3(r, SH[j], eps) : r / (s * s), a = C * m[j] * K;
      A[i * n + j] = -a; deg += a;
      for (let c = 0; c < 3; c++) if (V[c]) B[c][i] += a * (V[c][j] - V[c][i]);
    }
    const self = (rd.shellSelf === 'drag' && SH && SH[i] > 0) ? m[i] / (SH[i] * SH[i] * SH[i]) : 0;
    A[i * n + i] = 1 + deg + C * self;
  }
  const M = Float64Array.from(A), R = B.map((v) => Float64Array.from(v));
  for (let k = 0; k < n; k++) {
    let p = k; for (let i = k + 1; i < n; i++) if (Math.abs(M[i * n + k]) > Math.abs(M[p * n + k])) p = i;
    if (p !== k) { for (let j = 0; j < n; j++) { const t = M[k * n + j]; M[k * n + j] = M[p * n + j]; M[p * n + j] = t; } for (const v of R) { const t = v[k]; v[k] = v[p]; v[p] = t; } }
    for (let i = k + 1; i < n; i++) { const f = M[i * n + k] / M[k * n + k]; if (f === 0) continue; for (let j = k; j < n; j++) M[i * n + j] -= f * M[k * n + j]; for (const v of R) v[i] -= f * v[k]; }
  }
  for (let i = n - 1; i >= 0; i--) for (const v of R) { let s = v[i]; for (let j = i + 1; j < n; j++) s -= M[i * n + j] * v[j]; v[i] = s / M[i * n + i]; }
  return R;
}

/* ── 段 Z: 零試験 ── */
/** ① 代表の本(在位の宣言のまま)に殻の鍵が無く、走行で殻の帳簿・表の鍵ができない。 */
export function zDefault(HP) {
  const rows = [];
  for (const id of ['mercurySunInertial3d', 'earthMoonInertial']) {
    const p = find(HP, id); if (!p) { rows.push({ id, missing: true }); continue; }
    const v = HP.validatePreset(clone(p)), rd = v.ok ? v.preset.physics.relativeDrag : null;
    const declared = !!(rd && (rd.shellSelf !== undefined || rd.shellSelfEps !== undefined)) || (v.ok && v.preset.bodies.some((b) => b.dragCore && b.dragCore.shellRatio !== undefined));
    const S = stepS(HP, p, 20);
    const keys = Object.keys(S).filter((k) => (/^inertialDragShell|^_?dragShell/.test(k)) && S[k] !== undefined);
    const st = HP.inertialDragState(S), est = HP.wbgEstimateOf(clone(p));
    rows.push({ id, ok: v.ok, declared, keys, readoutShell: !!(st && st.shell !== undefined), estimateShell: !!(est && est.shellSelf !== undefined) });
  }
  return { rows, ok: rows.every((r) => r.ok && !r.declared && r.keys.length === 0 && !r.readoutShell && !r.estimateShell) };
}
/** ② η → 0: 殻の核 K3_shell/𝒦_ε − 1 が R_d²/r² で縮む(核)・🌡️ の写しで殻の源だけ(shellSelf なし)の 1 步の u の差が η² で縮む(エンジン)。 */
export function zEtaLimit(HP) {
  const r = 600, eps = 0.05, kp = r / ((r * r + eps * eps) ** 2);
  // 比 − 1 は R_d²/r²(遠方の次の項 —— ε/r ≪ 1)。小さい R_d では比の丸め(≈ 4e-16)が R_d²/r² に並ぶので、門は |比 − 1 − R_d²/r²| ≤ 1e-3·R_d²/r² + 4e-16
  const kern = [1e-1, 1e-2, 1e-3, 1e-4].map((Rd) => { const d = HP.dragShellK3(r, Rd, eps) / kp - 1, a = Rd * Rd / (r * r); return { Rd, relDiff: d, R2r2: a, overR2r2: d / a, gate: Math.abs(d - a) <= 1e-3 * a + 4e-16 }; });
  const p0 = mercuryOf(HP), S0 = stepS(HP, p0, 3), u0 = Math.hypot(S0._rdUX[1], S0._rdUY[1], S0._rdUZ[1]);
  const eng = [1e-1, 1e-2, 1e-3].map((eta) => { const S = stepS(HP, shellOf(p0, { etaSun: eta, etaMer: eta }), 3);
    return { eta, relDiffU: Math.hypot(S._rdUX[1] - S0._rdUX[1], S._rdUY[1] - S0._rdUY[1], S._rdUZ[1] - S0._rdUZ[1]) / u0, shellSteps: S.inertialDragShellN }; });
  const slope = Math.log10(eng[0].relDiffU / eng[2].relDiffU) / Math.log10(eng[0].eta / eng[2].eta);
  const tiny = stepS(HP, shellOf(p0, { etaSun: 1e-6, etaMer: 1e-6 }), 3), dTiny = Math.hypot(tiny._rdUX[1] - S0._rdUX[1], tiny._rdUY[1] - S0._rdUY[1], tiny._rdUZ[1] - S0._rdUZ[1]) / u0;
  return { kernel: kern, engine: eng, logSlope: slope, eta1e6RelDiffU: dTiny,
    ok: kern.every((z) => z.gate) && Math.abs(slope - 2) < 0.05 && eng[1].relDiffU <= 1e-8 && dTiny <= 1e-12 };
}
/** ③ 孤立した 1 体: 自己の項だけでは動きは変わらない(u = 0・W = v・位置と速度は殻なし・引きずりなしの走行とビット同一)。 */
export function zIsolated(HP) {
  const base = toy(1, { eta: 0.5 }), noSh = toy(1, {}), noDrag = toy(1, { noDrag: true });
  base.physics.relativeDrag.shellSelf = 'drag';
  const S = stepS(HP, base, 50), A = stepS(HP, noSh, 50), B = stepS(HP, noDrag, 50), st = HP.inertialDragState(S).shell, r0 = st.receivers[0];
  const uZero = S._rdUX[0] === 0 && S._rdUY[0] === 0 && S._rdUZ[0] === 0;
  const Weq = r0.W[0] === S.vx[0] && r0.W[1] === S.vy[0] && r0.W[2] === S.vz[0];
  return { uZero, WequalsV: Weq, bitSameNoShell: fpS(S) === fpS(A), bitSameNoDrag: fpS(S) === fpS(B), wSelf: r0.wSelf, shellSteps: st.steps, ok: uZero && Weq && fpS(S) === fpS(A) && fpS(S) === fpS(B) && st.steps > 0 };
}
/** ④ 二体の閉形式(🌡️ の写し —— 1 步の u を 2×2 で解いた式・読み口の ξ = Σw/(W_bg + w_self + Σw_I + Σw))。S3(shellSelf:"drag")と S2+I2(inertialR2 {lambda}・self:"shell")。 */
export function zClosed2(HP) {
  const p0 = mercuryOf(HP), out = [];
  for (const cfg of [{ key: 'S3', self: 'drag' }, { key: 'S2I2', i2: { lambda: 4.43e-5, self: 'shell' } }, { key: 'S3S2I2', self: 'drag', i2: { lambda: 4.43e-5, self: 'shell' } }]) {
    const q = shellOf(p0, { etaSun: 0.1, etaMer: 0.5, self: cfg.self, i2: cfg.i2 }), S = stepS(HP, q, 3), rd = S.relDrag, C = 1 / rd.Wbg, eps = rd.eps, e2 = eps * eps, m = S.m, SH = S._dragShellRd;
    const lam = cfg.i2 ? cfg.i2.lambda : null;
    const den = (X, Y, Z) => {   // 受け手 0・1 の I(W_bg を除く)と w(引きずりの重み)
      const dx = X[1] - X[0], dy = Y[1] - Y[0], dz = Z[1] - Z[0], r = Math.hypot(dx, dy, dz);
      const w01 = m[1] * HP.dragShellK3(r, SH[1], eps), w10 = m[0] * HP.dragShellK3(r, SH[0], eps);
      let I0 = 0, I1 = 0;
      if (cfg.self === 'drag') { I0 += m[0] / SH[0] ** 3; I1 += m[1] / SH[1] ** 3; }
      if (lam) { I0 += m[1] / lam * HP.dragShellK2(r, SH[1], eps) + m[0] / lam / SH[0] ** 2; I1 += m[0] / lam * HP.dragShellK2(r, SH[0], eps) + m[1] / lam / SH[1] ** 2; }
      return { w01, w10, I0, I1 };
    };
    const D = den(S._rdQX, S._rdQY, S._rdQZ), a01 = C * D.w01, a10 = C * D.w10, d0 = 1 + a01 + C * D.I0, d1 = 1 + a10 + C * D.I1, det = d0 * d1 - a01 * a10;
    let rel = 0;
    for (const [k, V] of [['X', 'vx'], ['Y', 'vy'], ['Z', 'vz']]) {
      const s0 = a01 * (S[V][1] - S[V][0]), s1 = a10 * (S[V][0] - S[V][1]), u0 = (s0 * d1 + a01 * s1) / det, u1 = (s1 * d0 + a10 * s0) / det, U = S['_rdU' + k];
      rel = Math.max(rel, Math.abs(U[0] - u0) / Math.max(Math.abs(u0), 1e-300), Math.abs(U[1] - u1) / Math.max(Math.abs(u1), 1e-300));
    }
    const st = HP.inertialDragState(S).shell, Dn = den(S.x, S.y, S.z), Wb = rd.Wbg;
    const xi1 = Dn.w10 / (Wb + Dn.I1 + Dn.w10), xi0 = Dn.w01 / (Wb + Dn.I0 + Dn.w01), r1 = st.receivers.find((z) => z.i === 1), r0 = st.receivers.find((z) => z.i === 0);
    out.push({ key: cfg.key, uRelErrMax: rel, xiMercury: r1.xi, xiMercuryForm: xi1, xiSun: r0.xi, xiSunForm: xi0, xiRelErr: Math.max(Math.abs(r1.xi / xi1 - 1), Math.abs(r0.xi / xi0 - 1)),
      wSelfMercury: r1.wSelf, wSelfIMercury: r1.wSelfI, inertiaMercury: r1.inertia });
  }
  return { rows: out, ok: out.every((z) => z.uRelErrMax < 1e-12 && z.xiRelErr < 1e-14) };
}
/** ⑤ 解法: 二次元・三次元の少数体(n=5 —— 直接法)と n=40(直接法)・n=80(Gauss–Seidel 1000 回)を器の中の直接法と。PCG は殻の源と一緒に拒否。 */
export function zSolver(HP) {
  const rows = [];
  for (const [key, n, o] of [['d2n5', 5, { c3: false }], ['d3n5', 5, {}], ['d3n40', 40, { oddOnly: true }], ['d3n80gs', 80, { rd: { solveIters: 1000 } }]]) {
    const tq = toy(n, Object.assign({ eta: 0.5 }, o)); tq.physics.relativeDrag.shellSelf = 'drag';
    const S = stepS(HP, tq, 2), B = denseShellSolve(HP, S), U = [S._rdUX, S._rdUY, S._rdUZ || null];
    let mx = 0, um = 0; for (let c = 0; c < 3; c++) { if (!U[c]) continue; for (let i = 0; i < n; i++) { mx = Math.max(mx, Math.abs(U[c][i] - B[c][i])); um = Math.max(um, Math.abs(B[c][i])); } }
    const cs = HP.inertialDragState(S).compose;
    rows.push({ key, n, coord: S.coord3d === true ? '3d' : '2d', relErrMax: mx / um, method: cs.method, res: cs.res });
  }
  const pq = toy(5, { eta: 0.5, rd: { solver: 'network-pcg-v1' } }), pv = HP.validatePreset(pq);
  const pcgRejected = !pv.ok && /solver/.test((pv.errors || []).join(' '));
  return { rows, pcgRejected, ok: pcgRejected && rows.every((z) => (z.method === 'direct' ? z.relErrMax < 1e-12 : (z.method === 'gs' && z.relErrMax < 1e-9))) };
}
// 三次元の回転(Rz(a)·Rx(b))
function rot3(a, b) { const ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b); return [[ca, -sa * cb, sa * sb], [sa, ca * cb, -ca * sb], [0, sb, cb]]; }
const mv = (M, v) => [M[0][0] * v[0] + M[0][1] * v[1] + M[0][2] * v[2], M[1][0] * v[0] + M[1][1] * v[1] + M[1][2] * v[2], M[2][0] * v[0] + M[2][1] * v[1] + M[2][2] * v[2]];
/** ⑥ 共通の並進(位置 +T・速度 +V)と回転(位置・速度を R で)の共変: 2 步の後の u が同じ・R u(相対の差)。 */
export function zCovariance(HP) {
  const tq = toy(5, { eta: 0.5 }); tq.physics.relativeDrag.shellSelf = 'drag';
  tq.physics.gravityX = 0; tq.physics.G = 1e-12;   // 共変の検査は引きずりの写像だけ(重力の差の丸めを小さく —— 重力も共変だが軌道の差を足さない)
  const S0 = stepS(HP, tq, 2), U0 = [S0._rdUX, S0._rdUY, S0._rdUZ];
  const tr = clone(tq); for (const b of tr.bodies) { b.x += 3; b.y -= 2; b.z += 1; b.vx += 0.3; b.vy -= 0.2; b.vz += 0.1; }
  const R = rot3(0.7, 0.4), ro = clone(tq);
  for (const b of ro.bodies) { const p = mv(R, [b.x, b.y, b.z]), v = mv(R, [b.vx, b.vy, b.vz]); b.x = p[0]; b.y = p[1]; b.z = p[2]; b.vx = v[0]; b.vy = v[1]; b.vz = v[2]; }
  const St = stepS(HP, tr, 2), Sr = stepS(HP, ro, 2);
  let um = 0, dt = 0, dr = 0;
  for (let i = 0; i < 5; i++) {
    const u = [U0[0][i], U0[1][i], U0[2][i]], ur = mv(R, u); um = Math.max(um, Math.hypot(...u));
    dt = Math.max(dt, Math.hypot(St._rdUX[i] - u[0], St._rdUY[i] - u[1], St._rdUZ[i] - u[2]));
    dr = Math.max(dr, Math.hypot(Sr._rdUX[i] - ur[0], Sr._rdUY[i] - ur[1], Sr._rdUZ[i] - ur[2]));
  }
  return { translateRelErr: dt / um, rotateRelErr: dr / um, ok: dt / um < 1e-9 && dr / um < 1e-9 };
}
/** ⑦ 総速度: W = v + u が (I_i + Σ_j D_ij) W_i − Σ_j D_ij W_j = I_i v_i を満たす(器の中の式 —— 残差の相対)・位置の更新 (x₁ − x₀)/h = W(u だけ・v + 2u とは違う)。 */
export function zTotal(HP) {
  const tq = toy(5, { eta: 0.5 }); tq.physics.relativeDrag.shellSelf = 'drag';
  const v = HP.validatePreset(clone(tq)), S = HP.coord3d.makeSim(); S.build(clone(v.preset));
  const h = tq.physics.stepDt; for (let k = 0; k < 3; k++) S.step(h);
  const x0 = [S.x.slice(), S.y.slice(), S.z.slice()]; S.step(h);
  const n = S.n, m = S.m, rd = S.relDrag, eps = rd.eps, SH = S._dragShellRd, X = [S._rdQX, S._rdQY, S._rdQZ], st = HP.inertialDragState(S).shell;
  let resMax = 0, rhsMax = 0, posErr = 0, posErrU = 0, posErr2U = 0, wMax = 0;
  for (let i = 0; i < n; i++) {
    const Wi = st.receivers[i].W, vi = [S.vx[i], S.vy[i], S.vz[i]], ui = st.receivers[i].u;
    let Ii = rd.Wbg + m[i] / SH[i] ** 3, sumD = 0; const acc = [0, 0, 0];
    for (let j = 0; j < n; j++) { if (j === i) continue;
      const r = Math.hypot(X[0][j] - X[0][i], X[1][j] - X[1][i], X[2][j] - X[2][i]), D = m[j] * HP.dragShellK3(r, SH[j], eps), Wj = st.receivers[j].W;
      sumD += D; for (let c = 0; c < 3; c++) acc[c] += D * Wj[c]; }
    for (let c = 0; c < 3; c++) {
      const res = (Ii + sumD) * Wi[c] - acc[c] - Ii * vi[c]; resMax = Math.max(resMax, Math.abs(res)); rhsMax = Math.max(rhsMax, Math.abs(Ii * vi[c]));
      const dx = (([S.x, S.y, S.z][c][i]) - x0[c][i]) / h; wMax = Math.max(wMax, Math.abs(Wi[c]));
      posErr = Math.max(posErr, Math.abs(dx - Wi[c])); posErrU = Math.max(posErrU, Math.abs(dx - ui[c])); posErr2U = Math.max(posErr2U, Math.abs(dx - (vi[c] + 2 * ui[c])));
    }
  }
  return { resRel: resMax / rhsMax, posRelErrW: posErr / wMax, posRelErrUOnly: posErrU / wMax, posRelErrV2U: posErr2U / wMax,
    ok: resMax / rhsMax < 1e-12 && posErr / wMax < 1e-9 && posErr2U > 1e3 * posErr };
}
/** ⑧ 殻の核の閉形式(html の dragShellK3・dragShellK2)と数値積分(器の shellNumeric)の一致 —— 中心・内部・外部・球面の近く(ε ≪ R)・遠方(r ≫ R)・R ≪ ε・ε=0。 */
export const KERNEL_CASES = Object.freeze([
  { key: 'center', r: 0, R: 1, eps: 0.1 }, { key: 'inside', r: 0.5, R: 1, eps: 0.1 }, { key: 'outside', r: 1.5, R: 1, eps: 0.1 },
  { key: 'onSphereSoft', r: 1, R: 1, eps: 1e-3 }, { key: 'nearOut', r: 1.001, R: 1, eps: 1e-3 }, { key: 'nearIn', r: 0.999, R: 1, eps: 1e-4 },
  { key: 'far', r: 1000, R: 1, eps: 0.05 }, { key: 'veryFar', r: 1e5, R: 0.7, eps: 0.05 }, { key: 'rInsideEps', r: 1e-3, R: 1, eps: 0.05 },
  { key: 'RllEps', r: 1e-3, R: 1e-3, eps: 1 }, { key: 'RllEpsOut', r: 0.5, R: 1e-4, eps: 0.1 }, { key: 'eps0out', r: 3, R: 1, eps: 0 }, { key: 'eps0in', r: 0.3, R: 1, eps: 0 },
  { key: 'mercurySun', r: 600, R: 0.695, eps: 0.05 }, { key: 'mercurySelf', r: 0, R: 0.0122, eps: 0.05 }]);
export function zKernel(HP) {
  const rows = KERNEL_CASES.map((c) => {
    const k3 = HP.dragShellK3(c.r, c.R, c.eps), k2 = HP.dragShellK2(c.r, c.R, c.eps);
    const n3 = c.r === 0 ? c.R / ((c.R * c.R + c.eps * c.eps) ** 2) : shellNumeric(c.r, c.R, c.eps, 3), n2 = c.r === 0 ? 1 / (c.R * c.R + c.eps * c.eps) : shellNumeric(c.r, c.R, c.eps, 2);
    return { key: c.key, r: c.r, R: c.R, eps: c.eps, K3: k3, K3num: n3, relErr3: Math.abs(k3 / n3 - 1), K2: k2, K2num: n2, relErr2: Math.abs(k2 / n2 - 1) };
  });
  // 遠方の次の項(ε=0): K3 ≈ r⁻³(1 + R²/r²)・K2 ≈ r⁻²(1 + R²/(3r²))
  const r = 1e3, R = 1, far3 = (HP.dragShellK3(r, R, 0) * r ** 3 - 1) / (R * R / (r * r)), far2 = (HP.dragShellK2(r, R, 0) * r ** 2 - 1) / (R * R / (3 * r * r));
  const selfS3 = HP.dragShellK3(0, 0.0122, 0) * (0.0122 ** 3);   // 中心・ε=0 は 1/R³(S3 の w_self = m/R_d³)
  return { rows, maxRelErr: Math.max(...rows.map((z) => Math.max(z.relErr3, z.relErr2))), farCoef3: far3, farCoef2: far2, selfS3Unit: selfS3,
    ok: rows.every((z) => z.relErr3 <= 1e-10 && z.relErr2 <= 1e-10) && Math.abs(far3 - 1) < 1e-5 && Math.abs(far2 - 1) < 1e-5 && Math.abs(selfS3 - 1) < 1e-15 };
}
export function partZ(HP, log = console.log) {
  const out = {};
  out.default = zDefault(HP); log(`① 代表の本に殻の鍵なし ${out.default.ok}`);
  out.etaLimit = zEtaLimit(HP); log(`② η→0: 核の比/(R²/r²) ${out.etaLimit.kernel.map((z) => z.overR2r2.toFixed(6)).join('/')}・u の差の傾き ${out.etaLimit.logSlope.toFixed(4)}・η=1e-6 の差 ${out.etaLimit.eta1e6RelDiffU.toExponential(2)}`);
  out.isolated = zIsolated(HP); log(`③ 孤立した 1 体: u=0 ${out.isolated.uZero}・W=v ${out.isolated.WequalsV}・殻なし/引きずりなしとビット同一 ${out.isolated.bitSameNoShell}/${out.isolated.bitSameNoDrag}`);
  out.closed2 = zClosed2(HP); for (const z of out.closed2.rows) log(`④ ${z.key}: 1 步の u の相対差 ${z.uRelErrMax.toExponential(2)}・ξ の相対差 ${z.xiRelErr.toExponential(2)}・ξ(水星)${z.xiMercury.toExponential(6)}`);
  out.solver = zSolver(HP); for (const z of out.solver.rows) log(`⑤ ${z.key}(${z.coord}・${z.method}): 器の直接法との差 ${z.relErrMax.toExponential(2)}・残差 ${z.res.toExponential(2)}`); log(`⑤ PCG と殻の源 拒否 ${out.solver.pcgRejected}`);
  out.covariance = zCovariance(HP); log(`⑥ 並進 ${out.covariance.translateRelErr.toExponential(2)}・回転 ${out.covariance.rotateRelErr.toExponential(2)}`);
  out.total = zTotal(HP); log(`⑦ 総速度の式の残差 ${out.total.resRel.toExponential(2)}・(x₁−x₀)/h と W ${out.total.posRelErrW.toExponential(2)}(u だけ ${out.total.posRelErrUOnly.toExponential(2)}・v+2u ${out.total.posRelErrV2U.toExponential(2)})`);
  out.kernel = zKernel(HP); log(`⑧ 閉形式と数値積分の最大の相対差 ${out.kernel.maxRelErr.toExponential(2)}(${out.kernel.rows.length} 例)・遠方の係数 ${out.kernel.farCoef3.toFixed(8)}/${out.kernel.farCoef2.toFixed(8)}`);
  out.count = Object.values(out).filter((z) => z && typeof z === 'object' && 'ok' in z).length;
  out.allOk = Object.values(out).filter((z) => z && typeof z === 'object' && 'ok' in z).every((z) => z.ok);
  return out;
}

/* ── 段 M: 🌡️ の写しで η ∈ {1, 0.5, 0.1} ── */
const hOf = (p) => P3.stepsOf(p.timeRef.pRef).h;
function measure(HP, q, dt) {
  const C3 = HP.coord3d, orig = C3.makeSim; let S = null;
  C3.makeSim = function () { S = orig.apply(this, arguments); return S; };
  let R; try { R = PL.runPl3(HP, q, { dt, revMax: N_WIN }); } finally { C3.makeSim = orig; }
  const w = PL.windowOf(R, N_WIN, Math.pow(10, q.scaleExp.T)), st = S ? HP.inertialDragState(S) : null;
  return { aps: w.apsArcsecPerCentury, periodDays: w.periodDays, ecc: w.ecc, nPeri: w.nPeri, steps: R.steps, nan: R.nan, complete: w.complete,
    shell: st && st.shell ? { steps: st.shell.steps, xMax: st.shell.xMax, xiMax: st.shell.xiMax, selfSkip: st.shell.selfSkip } : null };
}
/** 宇宙の項だけの外部の推定(本の単位 —— html の wbgEstimateOf の Wcos。銀河・太陽を含めない)。 */
function wCosOf(HP, p) { const e = HP.wbgEstimateOf(clone(p)); return e.ok ? e.Wcos.book : null; }
export function partM(HP, log = console.log) {
  const p0 = mercuryOf(HP), h = hOf(p0), Wbg = p0.physics.relativeDrag.Wbg, mM = p0.bodies[1].m, RM = p0.bodies[1].radius, mS = p0.bodies[0].m, RS = p0.bodies[0].radius;
  const ctl = DIVS.map((d) => measure(HP, shellOf(p0, { off: true }), h / d));
  const base = DIVS.map((d, k) => { const r = measure(HP, p0, h / d); return Object.assign(r, { diff: r.aps - ctl[k].aps }); });
  log(`M 対照(引きずり OFF)${ctl.map((z) => z.aps.toFixed(6)).join(' / ')}・殻なし(在位の宣言)の差 ${base.map((z) => z.diff.toFixed(6)).join(' / ')} ″/世紀`);
  const rows = [];
  for (const eta of ETAS) {
    const q = shellOf(p0, { etaSun: eta, etaMer: eta, self: 'drag' });
    const runs = DIVS.map((d, k) => { const r = measure(HP, q, h / d); return Object.assign(r, { diff: r.aps - ctl[k].aps }); });
    const wSelf = mM / Math.pow(eta * RM, 3), wSelfSun = mS / Math.pow(eta * RS, 3), predict = base[0].diff * Wbg / (Wbg + wSelf);
    rows.push({ eta, wSelfMercury: wSelf, wSelfSun, ratioSelfToWbg: wSelf / Wbg, runs, diff: runs[0].diff, diffH2: runs.length > 1 ? runs[1].diff : null,
      predictRatio: Wbg / (Wbg + wSelf), predict, measuredOverPredict: runs[0].diff / predict });
    log(`M η=${eta}: m/R_d³ ${wSelf.toPrecision(6)}(W_bg の ${(wSelf / Wbg).toFixed(4)} 倍)・差 ${runs.map((z) => z.diff.toFixed(6)).join(' / ')} ″/世紀・解析 ${predict.toFixed(6)}(実測/解析 ${(runs[0].diff / predict).toFixed(6)})`);
  }
  // 参考の行: W_bg = W_cos(外部の推定の宇宙の項)・水星の η* = (m/(W_bg,在位 − W_cos))^(1/3)/R(S3 だけで在位の W_bg と同じ分母)
  const Wc = wCosOf(HP, p0), etaStar = Math.cbrt(mM / (Wbg - Wc)) / RM;
  const qs = shellOf(p0, { etaSun: etaStar, etaMer: etaStar, self: 'drag', Wbg: Wc });
  const sr = DIVS.map((d, k) => { const r = measure(HP, qs, h / d); return Object.assign(r, { diff: r.aps - ctl[k].aps }); });
  const ref = { Wcos: Wc, etaStar, wSelfMercury: mM / Math.pow(etaStar * RM, 3), wSelfSun: mS / Math.pow(etaStar * RS, 3), runs: sr, diff: sr[0].diff, diffH2: sr.length > 1 ? sr[1].diff : null,
    baseDiff: base[0].diff, relToBase: sr[0].diff / base[0].diff - 1, note: 'W_bg = W_cos(宇宙の項だけ)と S3 の水星の自己の項 m/(η*R)³ = 221.1204 − W_cos —— 太陽も同じ η*(太陽の自己の項は大きく、太陽はほとんど引きずられない)' };
  log(`M 参考: W_cos ${Wc.toExponential(4)}・η* ${etaStar.toFixed(6)}・差 ${sr.map((z) => z.diff.toFixed(6)).join(' / ')} ″/世紀(在位の宣言の差との相対 ${ref.relToBase.toExponential(3)})`);
  // 参考の行 2: 太陽の η を小さく(0.01 —— 「恒星は小さい半径」)して水星は η* のまま —— 差の残り(太陽の殻の源の核 R_d☉²/r² の項)が消えるか
  const qs2 = shellOf(p0, { etaSun: ETA_SUN_SMALL, etaMer: etaStar, self: 'drag', Wbg: Wc });
  const sr2 = DIVS.map((d, k) => { const r = measure(HP, qs2, h / d); return Object.assign(r, { diff: r.aps - ctl[k].aps }); });
  const refSun = { etaSun: ETA_SUN_SMALL, etaMer: etaStar, wSelfSun: mS / Math.pow(ETA_SUN_SMALL * RS, 3), runs: sr2, diff: sr2[0].diff, diffH2: sr2.length > 1 ? sr2[1].diff : null,
    relToBase: sr2[0].diff / base[0].diff - 1, relToBaseH2: sr2.length > 1 ? sr2[1].diff / base[1].diff - 1 : null,
    note: '太陽の η を 0.01(小さい半径 —— 質点に近い)・水星は η* —— 太陽の殻の源の核の項 R_d☉²/r² が 1e-8 の桁へ' };
  log(`M 参考 2: η☉ ${ETA_SUN_SMALL}・η☿ η*・差 ${sr2.map((z) => z.diff.toFixed(6)).join(' / ')} ″/世紀(在位の宣言の差との相対 ${refSun.relToBase.toExponential(3)})`);
  return { id: MERCURY, h, divs: DIVS, Wbg, nWin: N_WIN, control: ctl, base, rows, ref, refSun };
}

/** QA docs.shell304 が PHYSICS〔第304便a〕の中に探す数の文字列。 */
export const fmt6 = (v) => Number(v).toFixed(6);
export function docNumbers(J) {
  const out = [];
  if (J.mercury) { out.push(fmt6(J.mercury.base[0].diff)); for (const r of J.mercury.rows) out.push(fmt6(r.diff), fmt6(r.predict)); out.push(fmt6(J.mercury.ref.etaStar), fmt6(J.mercury.ref.diff));
    if (J.mercury.refSun) out.push(fmt6(J.mercury.refSun.diff)); }
  if (J.zero) out.push(J.zero.etaLimit.logSlope.toFixed(4));
  return [...new Set(out)];
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) {
  const t0 = Date.now();
  const OUT_PATH = process.env.W304A_OUT || path.join(ROOT, 'tests', 'out', 'shell-w304a.json');
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
  const out = { meta: null, version: HP.DRAG_SHELL_VERSION, harnessVersion: HARNESS_VERSION, parts: PARTS, quick: QUICK };
  const tp = {};
  const timed = (k, f) => { const t = Date.now(); const r = f(); tp[k] = { wallSec: (Date.now() - t) / 1000 }; console.log(`[${k}] ${tp[k].wallSec.toFixed(1)} s`); return r; };
  if (PARTS.includes('Z')) out.zero = timed('Z', () => partZ(HP));
  if (PARTS.includes('M')) out.mercury = timed('M', () => partM(HP));
  const gates = {};
  if (out.zero) for (const k of ['default', 'etaLimit', 'isolated', 'closed2', 'solver', 'covariance', 'total', 'kernel']) gates['zero_' + k] = out.zero[k].ok === true;
  if (out.mercury) {
    const M = out.mercury;
    gates.mercuryMeasured = M.rows.length === ETAS.length && M.rows.every((r) => r.runs.every((z) => z.complete && !z.nan && Number.isFinite(z.diff)));
    gates.mercuryShellLedger = M.rows.every((r) => r.runs.every((z) => z.shell && z.shell.steps > 0 && z.shell.selfSkip === 0));
    gates.refMeasured = M.ref.runs.every((z) => z.complete && !z.nan && Number.isFinite(z.diff)) && M.refSun.runs.every((z) => z.complete && !z.nan && Number.isFinite(z.diff));
  }
  out.gates = gates; out.ok = Object.values(gates).every(Boolean); out.timing = tp;
  const CODE = ['tests/exp-w304a-shell.mjs', 'tests/exp-w299c-planets3d.mjs', 'tests/lib-w299c-planets3d.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs', 'tests/lib-w306a-pre.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第304便a', target: TARGET, code: CODE, inputs: [TARGET, DECL305_DATA_FILE] }), {
    harnessVersion: HARNESS_VERSION, shellVersion: HP.DRAG_SHELL_VERSION, loadErrors: errors.length, quick: QUICK,
    ruling: '原仮定者の裁定(第94報)「引きずり核球面近似係数」(引きずり核の球面に質量が集まるとして、自分の殻の移動で自分の重心を引きずる —— 引きずり量の分母の慣性決定力に自分自身を入れる・恒星は小さい半径・まずは引きずり核表面・dragCore の拡張)',
    reading: '統括の検証項目 R195(エンジンへ殻の形・自己の項 S3/S2・総速度の読み口 —— 省略時オフ・在位の本は宣言しない)',
    notClaim: ['η が決まった', '自分を引きずった', '慣性を導いた', 'GR を導いた', '43″ が出た', '現実を再現した'] });
  out.elapsedS = (Date.now() - t0) / 1000;
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 1) + '\n');
  console.log('gates ' + JSON.stringify(gates));
  console.log('→ ' + path.relative(ROOT, OUT_PATH) + '(' + out.elapsedS.toFixed(1) + ' s)・ok ' + out.ok);
  process.exit(out.ok ? 0 : 1);
}
