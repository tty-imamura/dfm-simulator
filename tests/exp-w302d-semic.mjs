// 第302便d(決断事項 AN303 ①②⑤・統括の検証項目 R188)—— **本体の積分器 semic を既定にした影響の器**(Node だけ —— 対象 html の inline script を
// tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、アプリの步〔sim.step —— 慣性決定力の引きずりは dfmInertialDragStep / dfmInertialDragStep3〕をそのまま走らせる)。
//
// ■ 何を測るか
//   段 gates(器の門 —— QA behavior.semic302 が正本と照合する):
//     ① closedForm: 源 1 つ(pinned・質量 M)と受け手 1 粒子・重力 0 の閉形式で、semic の u の評価点がドリフトの前の位置であること
//        (u = −a v/(1+a)・a = C M K_ε(|x₀|) —— 本体の 1 步の位置 x₁ = x₀ + h(v + u(x₀)) と相対 1e-12。ドリフトの後の位置 x₀ + h v で解いた値とは違う)。
//     ② libMatch: 器 tests/lib-w301d-coupled.mjs の 'semic' と本体の步が同じ軌道(🔗 二次元・🧨 三次元 —— 1 步目〔履歴なし〕の後から 2000 步・
//        位置の差 / 最大半径 ≤ 1e-9・帳簿 W の相対差 ≤ 1e-9)。
//     ③ splitBase: 明示の stepOrder:"split" が基点(第301便の本体 —— html W302D_BASE、既定 beta/_w302_base.html)とビット同一
//        (引きずりの本〔宣言から: law "inertial"・合成則 solve・gain>0〕を 600 步・dt 0.016 —— bitsame と同じ手順の指紋)。基点の html が無い世代は、
//        前の正本の門が真で、今の split の指紋が前の正本の split の指紋と同じなら真(推移で受ける)。
//        あわせて既定(semic)で基点と違う本の集合(semicDiff)と、gain 0 の慣性の本が既定でも基点と同じこと(gain0Same)。
//     ④ ledger: 読み口 inertialDragLedgerOf の R_E = (K+U) − E₀ − W が器の独立な計算と一致(相対 1e-12)・🔗 の t = 48 で h, h/2, h/4 の
//        |R_E| が 1 次で 0 へ(比 1.5〜2.6)・明示の split の本は R_E を出さない(workDef "transportDeltaU")。
//   段 fit(目的の量 —— フィットの 4 本と 🌔🐌。再フィットはしない —— 宣言の gain のまま semic と split を並べる。許容は本の fitRecord の tol と h/2 の帯):
//     🟫 近点率の差(gain 0 の対照との差・8 公転・二次元)・🌡️ 同(三次元・runPl3)と恒星周期・🟪 公転周期(8 公転の平均)・
//     🌦️ 近点回転の周期(118 公転窓・runEm3 の T1)と恒星月・🌔 恒星月・近点回転の周期(118 公転窓)・🐌 近点の移動(°/公転・8 公転)。
//   段 chain(連鎖の 5 本 —— 既存の器を**同じ器・同じ抽出器**で 2 回走らせる: 前置き tests/lib-w302d-orderpre.mjs で全本 split にした走行と既定の semic):
//     tests/exp-w296c-chain.mjs(🔗)・tests/exp-w298c-drag3d.mjs(🔩🪛)・tests/exp-w290c-inertial.mjs(🐌)・tests/exp-w299d-geo4stable.mjs(🍥)・
//     tests/exp-w301d-chainburst.mjs の A.base(🔗 の t=288)と F.engine.8(🧨 の宣言の刻み 0.002)—— 門の真偽の反転(split で真・semic で偽)と主要な数。
//
// ■ しないこと・言わないこと
//   ・再フィットしない(差を記録する —— 第 2 段 c が W_bg の推定と G_loc の後で行う)。目的の門の閾値を変えない。速度のクランプを入れない。
//   ・「semic で正しくなった」「保存則が成り立つ」と書かない(R_E は分割の誤差の大きさの診断 —— 外部支持を含む帳簿で孤立系の保存ではない)。
//
// 実行: node tests/exp-w302d-semic.mjs → 正本 tests/out/semic-w302d.json(W302D_OUT で出力先・W302D_PART=gates,fit,chain で段を絞る〔絞ったら正本にしない〕)
import { pre302c } from './lib-w302c-pre.mjs';   // 第302便c
import fs from 'node:fs';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as L from './lib-w301d-coupled.mjs';
import { runPl3, windowOf } from './exp-w299c-planets3d.mjs';
import { runEm3, windowsOf } from './exp-w300b-emonly.mjs';
import { ORDER_PRE_VERSION } from './lib-w302d-orderpre.mjs';
import * as W302A from './lib-w302a-wbg.mjs';   // 第302便m: gain ⇔ W_bg の読み書き(器の側 —— 第302便a の世代の宣言は Wbg)
import { pinDecl302, DECL302_DATA_FILE } from './lib-w303a-pre.mjs';   // 第303便a: 第302便の本の宣言の写し(この正本は第302便の宣言で測った歴史の記録 —— 器の中だけ・html と署名は変えない)
import { pinDecl303, DECL303_DATA_FILE } from './lib-w304c-pre.mjs';   // 第304便c: 第303便の 🌦️🌔 の宣言の写し(pinDecl302 の前に —— 軟化・初期配置・引きずりの宣言を第303便へ戻してから第302便の欄を戻す・歴史の値を保つ)
import { pinDecl315c, LEGACY7_DATA_FILE } from './lib-w315c-legacy7.mjs';   // 第315便c(決断事項 AN406・R244): 在位の 7 本を K1 へ移した世代では、この器は移行の前(af2f426)の宣言の写しで測る
const REGEN_SCOPE = {"presets":"all","roots":["FIT_RECORD_VERSION","HP.FIT_COND_VERSION","HP.PROBE_VERSION","HP.REL_DRAG_AXIAL_LAW","HP.REL_DRAG_CHAIN_VERSION","HP.REL_DRAG_COMPOSE_DEFAULT","HP.REL_DRAG_INERTIAL_VERSION","HP.REL_DRAG_SEMIC_VERSION","HP.REL_DRAG_SOLVER_TOL_DEFAULT","HP.REL_DRAG_SOLVE_FROM_DEFAULT","HP.REL_DRAG_SPIN3_VERSION","HP.REL_DRAG_SPIN_NODES","HP.allPresets","HP.ckRestoreOne","HP.ckSnapOne","HP.cloneSimStateNow","HP.coord3d","HP.dfmGaussLegendre01","HP.dfmInertialDragStep","HP.dfmMeshVelocityFieldAt","HP.fitCondSig","HP.geoEffectiveMode","HP.geoLawOfSim","HP.geoModeOf","HP.inertialDrag3AxialOmega","HP.inertialDrag3RotTerm","HP.inertialDragComposeSolve","HP.inertialDragEpoch","HP.inertialDragLedgerOf","HP.inertialDragProbeAt","HP.inertialDragProbeBilinear","HP.inertialDragProbeReady","HP.inertialDragProbeSample","HP.inertialDragProbeStreamlines","HP.inertialDragState","HP.inertialSpinMoment","HP.loadPreset","HP.modeSettingIssues","HP.presetSig","HP.relDragStepOrderOf","HP.sim","HP.stepCarryFrame","HP.synodic","HP.validateFitRecord","HP.validatePreset","HP.validateRelativeDrag","ckRestoreOne","ckSnapOne","dfmSphereKernelQEff"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w302d-semic-1';
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const BASE = process.env.W302D_BASE || 'beta/_w302_base.html';
const OUT_PATH = process.env.W302D_OUT || path.join(ROOT, 'tests', 'out', 'semic-w302d.json');
const PARTS = String(process.env.W302D_PART || 'gates,fit,chain').split(',').filter(Boolean);
const H0 = 0.016, FP_STEPS = 600;
const clone = (x) => JSON.parse(JSON.stringify(x));
const find = (HP, id) => { const p = HP.allPresets().find((q) => q.id === id); if (!p) throw new Error('no preset ' + id); return pre302c(p, { keepFit: true }); };   // 第302便c: G_loc の前の宣言の写し(G_loc を宣言しない本は clone と同じ)
const fnvState = (S) => { let h = 0x811c9dc5; const f = new Float64Array(1), u8 = new Uint8Array(f.buffer);
  for (const k of ['x', 'y', 'vx', 'vy', 'spin', 'R', 'm']) { const A = S[k]; if (!A) continue; for (let i = 0; i < S.n; i++) { f[0] = A[i]; for (let j = 0; j < 8; j++) h = Math.imul(h ^ u8[j], 16777619) >>> 0; } }
  f[0] = S.t; for (let j = 0; j < 8; j++) h = Math.imul(h ^ u8[j], 16777619) >>> 0;
  if (S.z) for (const k of ['z', 'vz']) for (let i = 0; i < S.n; i++) { f[0] = S[k][i]; for (let j = 0; j < 8; j++) h = Math.imul(h ^ u8[j], 16777619) >>> 0; }
  return h.toString(16); };

/* 宣言から導く本の集合(手書きの ID 一覧を持たない) */
export function idsOf(HP) {
  const all = HP.allPresets(), isInertial = (p) => !!(p.physics && p.physics.relativeDrag && p.physics.relativeDrag.law === 'inertial');
  const solve = (p) => isInertial(p) && p.physics.relativeDrag.compose !== 'sum';
  const coef = (p) => W302A.rdCoefOf(p.physics.relativeDrag);   // 第302便m: 引きずりが効くか(係数 c>0 —— Wbg の宣言は 1/W_bg・OFF と未推定は 0。前の世代は gain)
  const drag = all.filter((p) => solve(p) && coef(p) > 0 && p.physics.relativeDrag.stepOrder !== 'split').map((p) => p.id);
  const retired = new Set(all.filter((p) => p.familyRole === 'retired').map((p) => p.id));
  return { inertial: all.filter(isInertial).map((p) => p.id), drag, dragInService: drag.filter((id) => !retired.has(id)), dragRetired: drag.filter((id) => retired.has(id)),
    gain0: all.filter((p) => solve(p) && !(coef(p) > 0)).map((p) => p.id), splitDeclared: all.filter((p) => solve(p) && p.physics.relativeDrag.stepOrder === 'split').map((p) => p.id) };
}
const withOrder = (p, ord) => { const q = clone(p); delete q.abBody; if (ord === 'split') q.physics.relativeDrag.stepOrder = 'split'; else if (ord === 'semic') delete q.physics.relativeDrag.stepOrder; return q; };
function build(HP, p) { const v = HP.validatePreset(clone(p)); if (!v.ok) throw new Error(p.id + ' validatePreset: ' + JSON.stringify(v.errors).slice(0, 300)); HP.sim.build(v.preset); return HP.sim; }

/* ── 段 gates ─────────────────────────────────────────── */
export function closedForm(HP) {
  const C = 0.8, M = 50, r0 = 3, v0 = 1.7, eps = 0.5, h = H0;
  const p = find(HP, 'inertialDragPair');   // 🐌 の写しを閉形式の配置へ(重力 0・源は pinned)
  p.id = 'w302dClosed'; p.physics.G = 0; p.physics.relativeDrag = Object.assign({ law: 'inertial' }, (typeof globalThis.relDragCoefficientOf === 'function') ? W302A.wbgDeclOf(C) : { gain: C }, { eps, pairs: 'all' });   // 第302便m: 器の中の宣言は Wbg
  p.bodies = [Object.assign({}, p.bodies[0], { x: 0, y: 0, vx: 0, vy: 0, m: M, pinned: true, spin: 0 }), Object.assign({}, p.bodies[1], { x: r0, y: 0, vx: 0, vy: v0, m: 1, pinned: false, spin: 0 })];
  const K = (r) => r / ((r * r + eps * eps) ** 2);
  const run = (ord) => {
    const S = build(HP, withOrder(p, ord)); S.step(h);   // 1 步目は履歴なし(u = 0)
    const x0 = S.x[1], y0 = S.y[1], vx = S.vx[1], vy = S.vy[1];
    S.step(h);
    const pre = (xx, yy) => { const a = C * M * K(Math.hypot(xx, yy)); return [-a * vx / (1 + a), -a * vy / (1 + a)]; };
    const uPre = pre(x0, y0), uPost = pre(x0 + h * vx, y0 + h * vy);
    const xPre = [x0 + h * (vx + uPre[0]), y0 + h * (vy + uPre[1])], xPost = [x0 + h * (vx + uPost[0]), y0 + h * (vy + uPost[1])];
    const d = (q) => Math.hypot(S.x[1] - q[0], S.y[1] - q[1]) / Math.hypot(xPre[0] - x0, xPre[1] - y0);
    return { ord, relToPre: d(xPre), relToPost: d(xPost), uPre, uPost, vUnchanged: S.vx[1] === vx && S.vy[1] === vy };
  };
  const sm = run('semic'), sp = run('split');
  return { semic: sm, split: sp, ok: sm.relToPre <= 1e-12 && sm.relToPost >= 1e3 * Math.max(sm.relToPre, 1e-16) && sp.relToPost <= 1e-12 && sm.vUnchanged && sp.vUnchanged };
}
export function libMatch(HP, id) {
  const S = build(HP, withOrder(find(HP, id), 'semic')); S.step(H0);
  const d3 = S.coord3d === true;
  const { sys, st } = L.systemFromSim(S, HP.inertialSpinMoment, HP.dfmGaussLegendre01(HP.REL_DRAG_SPIN_NODES));
  const I = L.makeIntegrator(sys, 'semic'), W0 = S.inertialDragWork;
  let pos = 0, scale = 0;
  for (let k = 0; k < 2000; k++) { I.step(st, H0); S.step(H0);
    if ((k + 1) % 100 === 0) for (let i = 0; i < sys.n; i++) { pos = Math.max(pos, Math.hypot(st.x[i] - S.x[i], st.y[i] - S.y[i], st.z[i] - (d3 ? S.z[i] : 0))); scale = Math.max(scale, Math.hypot(st.x[i], st.y[i], st.z[i])); } }
  const Wb = S.inertialDragWork - W0;
  return { id, d3, steps: 2000, posDiffMax: pos, scale, posRel: pos / scale, Wlib: st.W, Wbody: Wb, Wrel: Math.abs(Wb - st.W) / Math.max(1e-300, Math.abs(st.W)), libVersion: L.COUPLED_LIB_VERSION };
}
function fingerprints(HP, ids, ord) { const o = {}; for (const id of ids) { const S = build(HP, ord ? withOrder(find(HP, id), ord) : withOrder(find(HP, id), null)); for (let k = 0; k < FP_STEPS; k++) S.step(H0); o[id] = fnvState(S); } return o; }
export function ledgerCheck(HP) {
  const id = 'chainDiskToy', T = 48, rows = [];
  for (const d of [1, 2, 4]) {
    const S = build(HP, withOrder(find(HP, id), 'semic')), dt = H0 / d, N = Math.round(T / dt);
    for (let k = 0; k < N; k++) S.step(dt);
    const g = HP.inertialDragLedgerOf(S), n = S.n, m = S.m, me = S.mEff, G = S.params.G, e2 = (S.params.softening || 0) ** 2;
    let K = 0, U = 0; for (let i = 0; i < n; i++) { K += 0.5 * m[i] * (S.vx[i] ** 2 + S.vy[i] ** 2); for (let j = i + 1; j < n; j++) { const dx = S.x[j] - S.x[i], dy = S.y[j] - S.y[i]; U -= G * me[i] * me[j] / Math.sqrt(dx * dx + dy * dy + e2); } }
    const REind = K + U - g.E0 - S.inertialDragWork;
    rows.push({ d, dt, steps: N, RE: g.RE, REind, agree: Math.abs(g.RE - REind) / Math.max(1e-300, Math.abs(REind)), W: g.work, E0: g.E0, workDef: g.workDef, semicMiss: g.semicMiss });
  }
  const S2 = build(HP, withOrder(find(HP, id), 'split')); for (let k = 0; k < 10; k++) S2.step(H0);
  const gs = HP.inertialDragLedgerOf(S2), st = HP.inertialDragState(S2);
  const r = rows.map((z) => Math.abs(z.RE)), ratio = [r[0] / r[1], r[1] / r[2]];
  return { id, T, rows, ratio, splitReadout: gs, splitStateHasLedger: !!(st && st.ledger),
    ok: rows.every((z) => z.agree <= 1e-12 && z.semicMiss === 0) && ratio.every((q) => q >= 1.5 && q <= 2.6) && gs && gs.RE === null && gs.workDef === 'transportDeltaU' && !(st && st.ledger) };
}

/* ── 段 fit ──────────────────────────────────────────── */
// 二次元の二体(中心 ci・周回 oi): 同方向の周回の通過・距離の極値の 3 点放物線(第297便b の runEmx と同じ流儀 —— 二次元)
export function run2(HP, preset, o) {
  const S = build(HP, preset), dt = o.dt, ci = o.ci, oi = o.oi;
  const rel = () => [S.x[oi] - S.x[ci], S.y[oi] - S.y[ci]];
  const [x0, y0] = rel();
  let angPrev = Math.atan2(y0, x0), angAcc = 0, r1 = Math.hypot(x0, y0), r2 = r1, th1 = angPrev, th2 = angPrev, k = 0, nan = false;
  const ev = { rev: [], peri: [], apo: [] };
  for (; ; k++) {
    S.step(dt);
    const [dx, dy] = rel(), rr = Math.hypot(dx, dy), th = Math.atan2(dy, dx);
    if (!Number.isFinite(rr)) { nan = true; break; }
    let d = th - angPrev; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
    const prevAcc = angAcc; angAcc += d; angPrev = th;
    const nP = Math.floor(Math.abs(prevAcc) / (2 * Math.PI)), nN = Math.floor(Math.abs(angAcc) / (2 * Math.PI));
    if (nN > nP) { const tg = Math.sign(angAcc) * nN * 2 * Math.PI, fr = (tg - prevAcc) / (angAcc - prevAcc); ev.rev.push((k + fr) * dt); }
    if (k >= 2 && ((r1 < r2 && r1 < rr) || (r1 > r2 && r1 > rr))) {
      const dd = (r2 - 2 * r1 + rr), fr = (dd !== 0) ? 0.5 * (r2 - rr) / dd : 0;
      let a1 = th2, a2 = th1, a3 = th;
      while (a2 - a1 > Math.PI) a2 -= 2 * Math.PI; while (a2 - a1 < -Math.PI) a2 += 2 * Math.PI;
      while (a3 - a2 > Math.PI) a3 -= 2 * Math.PI; while (a3 - a2 < -Math.PI) a3 += 2 * Math.PI;
      (r1 < r2 ? ev.peri : ev.apo).push({ t: (k + fr) * dt, ang: a2 + 0.5 * fr * (a3 - a1) + 0.5 * fr * fr * (a3 - 2 * a2 + a1) });
    }
    r2 = r1; r1 = rr; th2 = th1; th1 = th;
    if (ev.rev.length >= o.revMax) { k++; break; }
  }
  const st = HP.inertialDragState(S);
  return { ev, steps: k, nan: nan || S.hasNaN(), drag: st ? { boundMax: st.boundMax, uMax: st.uMax, work: st.work, ledger: st.ledger || null } : null };
}
const unwrap = (a) => { const o = [a[0]]; for (let i = 1; i < a.length; i++) { let d = a[i] - a[i - 1]; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; o.push(o[i - 1] + d); } return o; };
const linSlope = (x, y) => { const n = x.length, mx = x.reduce((s, v) => s + v, 0) / n, my = y.reduce((s, v) => s + v, 0) / n; let a = 0, b = 0; for (let i = 0; i < n; i++) { a += (x[i] - mx) * (y[i] - my); b += (x[i] - mx) ** 2; } return a / b; };
function q2(R, N, Tsec) {   // 窓 N 公転: 周期(平均間隔 —— s)・近点率(rad/単位時間 → ″/世紀・°/公転)
  const rev = R.ev.rev.slice(0, N), tEnd = rev[N - 1], pe = R.ev.peri.filter((z) => z.t <= tEnd);
  const per = (rev[N - 1] - rev[0]) / (N - 1), sl = pe.length >= 3 ? linSlope(pe.map((z) => z.t), unwrap(pe.map((z) => z.ang))) : null, cent = 36525 * 86400 / Tsec;
  return { N, periodSec: per * Tsec, period2Sec: (rev[1] - rev[0]) * Tsec, nPeri: pe.length, apsArcsecPerCentury: sl === null ? null : sl * cent * 180 / Math.PI * 3600, apsDegPerOrbit: sl === null ? null : sl * per * 180 / Math.PI };
}
const fitTol = (p, k) => { const t = p.fitRecord && p.fitRecord.targets && p.fitRecord.targets[k]; return t ? { tol: t.tol ? t.tol.value : null, h2: t.numerics ? t.numerics.h2 : (p.fitRecord.numerics ? p.fitRecord.numerics.h2 : null), model: (t.model !== undefined) ? t.model : (p.fitRecord.residual ? p.fitRecord.residual.model : null), q: t.q, unit: t.unit } : null; };
function row(id, emoji, q, unit, split, semic, tol, h2, extra) {
  const d = (semic === null || split === null) ? null : semic - split;
  return Object.assign({ id, emoji, q, unit, split, semic, diff: d, tol, h2, withinTol: (tol === null || d === null) ? null : Math.abs(d) <= tol, withinH2: (h2 === null || d === null) ? null : Math.abs(d) <= h2 }, extra || {});
}
export function fitPart(HP, log) {
  const rows = [];
  const g0 = (p) => { const q = clone(p); W302A.rdSetGain(q.physics.relativeDrag, 0); delete q.physics.relativeDrag.spinSource; delete q.physics.relativeDrag.spinDrag; return q; };
  { // 🟫 二次元・8 公転・gain 0 の対照との差
    const id = 'mercurySunInertialFit', p = find(HP, id), Ts = Math.pow(10, p.scaleExp.T), f = fitTol(p, 0), o = { dt: 0.016, revMax: 8, ci: 0, oi: 1 };
    const a0 = q2(run2(HP, withOrder(g0(p), 'semic'), o), 8, Ts), as = q2(run2(HP, withOrder(p, 'split'), o), 8, Ts), am = q2(run2(HP, withOrder(p, 'semic'), o), 8, Ts);
    const oh = Object.assign({}, o, { dt: o.dt / 2 }), a0h = q2(run2(HP, withOrder(g0(p), 'semic'), oh), 8, Ts), amh = q2(run2(HP, withOrder(p, 'semic'), oh), 8, Ts);   // h/2(semic の数値誤差の帯 —— QA ui.liveMeasure297 が照合)
    const vS = am.apsArcsecPerCentury - a0.apsArcsecPerCentury, vSh = amh.apsArcsecPerCentury - a0h.apsArcsecPerCentury;
    rows.push(row(id, '🟫', '近点率の差(gain 0 の対照との差・8 公転・二次元)', '″/世紀', as.apsArcsecPerCentury - a0.apsArcsecPerCentury, vS, f.tol, f.h2, { fitModel: f.model, gain0: a0.apsArcsecPerCentury, periodDaysSplit: as.periodSec / 86400, periodDaysSemic: am.periodSec / 86400,
      semicH2Value: vSh, semicNumErr: Math.abs(vS - vSh), semicResidual: vS - p.fitRecord.targets[0].obs }));
    log('🟫', JSON.stringify(rows[rows.length - 1]));
  }
  { // 🌡️ 三次元・runPl3・8 公転
    const id = 'mercurySunInertial3d', p = find(HP, id), Ts = Math.pow(10, p.scaleExp.T), f0 = fitTol(p, 0), f1 = fitTol(p, 1), o = { dt: 0.016, revMax: 8 };
    const W = (q) => windowOf(runPl3(HP, q, o), 8, Ts);
    const a0 = W(withOrder(g0(p), 'semic')), as = W(withOrder(p, 'split')), am = W(withOrder(p, 'semic'));
    rows.push(row(id, '🌡️', '近点率の差(gain 0 の対照との差・8 公転・三次元)', '″/世紀', as.apsArcsecPerCentury - a0.apsArcsecPerCentury, am.apsArcsecPerCentury - a0.apsArcsecPerCentury, f0.tol, f0.h2, { fitModel: f0.model, gain0: a0.apsArcsecPerCentury }));
    rows.push(row(id, '🌡️', '恒星周期(8 公転)', 'd', as.periodDays, am.periodDays, f1.tol, f1.h2, { fitModel: f1.model }));
    log('🌡️', JSON.stringify(rows.slice(-2)));
  }
  { // 🟪 二次元・dt 0.16・8 公転の平均周期
    const id = 'plutoCharonInertialFit', p = find(HP, id), Ts = Math.pow(10, p.scaleExp.T), f = fitTol(p, 0), o = { dt: 0.16, revMax: 8, ci: 0, oi: 1 };
    const as = q2(run2(HP, withOrder(p, 'split'), o), 8, Ts), am = q2(run2(HP, withOrder(p, 'semic'), o), 8, Ts);
    rows.push(row(id, '🟪', '公転周期(8 公転の平均)', 's', as.periodSec, am.periodSec, f.tol, f.h2, { fitModel: f.model }));
    log('🟪', JSON.stringify(rows[rows.length - 1]));
  }
  { // 🌦️ 三次元・runEm3(地球 1・月 2)・118 公転窓
    const id = 'earthMoonSunInertial3d', p = find(HP, id), f0 = fitTol(p, 0), f1 = fitTol(p, 1), o = { dt: 0.016, revMax: 118, ci: 1, oi: 2 };
    const W = (q) => windowsOf(runEm3(HP, q, o), [118], HP)[0];
    const as = W(withOrder(p, 'split')), am = W(withOrder(p, 'semic'));
    rows.push(row(id, '🌦️', '近点回転の周期(118 公転窓)', 'yr', as.T1, am.T1, f0.tol, f0.h2, { fitModel: f0.model }));
    rows.push(row(id, '🌦️', '恒星月(118 公転窓)', 'd', as.sid, am.sid, f1.tol, f1.h2, { fitModel: f1.model }));
    log('🌦️', JSON.stringify(rows.slice(-2)));
  }
  { // 🌔 三次元・runEm3(地球 0・月 1)・118 公転窓(gain は移送 —— 説明の主張の量)
    const id = 'earthMoonOnly3d', p = find(HP, id), o = { dt: 0.016, revMax: 118, ci: 0, oi: 1 };
    const W = (q) => windowsOf(runEm3(HP, q, o), [118], HP)[0];
    const as = W(withOrder(p, 'split')), am = W(withOrder(p, 'semic'));
    rows.push(row(id, '🌔', '恒星月(118 公転窓)', 'd', as.sid, am.sid, null, null));
    rows.push(row(id, '🌔', '朔望月(一様換算・118 公転窓)', 'd', as.synUniform, am.synUniform, null, null));
    rows.push(row(id, '🌔', '近点回転の周期(118 公転窓)', 'yr', as.T1, am.T1, null, null));
    log('🌔', JSON.stringify(rows.slice(-3)));
  }
  { // 🐌 二次元・8 公転・近点の移動(°/公転)と上界
    const id = 'inertialDragPair', p = find(HP, id), o = { dt: 0.016, revMax: 8, ci: 0, oi: 1 };
    const Rs = run2(HP, withOrder(p, 'split'), o), Rm = run2(HP, withOrder(p, 'semic'), o), Ts = 1;
    const as = q2(Rs, 8, Ts), am = q2(Rm, 8, Ts), a0 = q2(run2(HP, withOrder(g0(p), 'semic'), o), 8, Ts);
    rows.push(row(id, '🐌', '近点の移動(gain 0 の対照との差・8 公転)', '°/公転', as.apsDegPerOrbit - a0.apsDegPerOrbit, am.apsDegPerOrbit - a0.apsDegPerOrbit, null, null, { boundMaxSplit: Rs.drag.boundMax, boundMaxSemic: Rm.drag.boundMax }));
    log('🐌', JSON.stringify(rows[rows.length - 1]));
  }
  return { rows };
}

/* ── 段 chain: 既存の器を split(前置き)と semic(既定)で 2 回 ── */
const PRE_URL = pathToFileURL(path.join(ROOT, 'tests', 'lib-w302d-orderpre.mjs')).href;
export const SUBS = Object.freeze([
  { key: 'w296c', script: 'tests/exp-w296c-chain.mjs', outEnv: 'W296C_OUT', books: ['chainDiskToy'] },
  { key: 'w298c', script: 'tests/exp-w298c-drag3d.mjs', outEnv: 'W298C_OUT', books: ['chainDiskToy3d', 'chainDiskToy3dTilt'] },
  { key: 'w290c', script: 'tests/exp-w290c-inertial.mjs', outEnv: 'W290C_INERTIAL_OUT', books: ['inertialDragPair'] },
  { key: 'w299d', script: 'tests/exp-w299d-geo4stable.mjs', outEnv: 'W299D_OUT', books: ['chainSpreadToy3d'] },
  { key: 'w301d', script: 'tests/exp-w301d-chainburst.mjs', outEnv: 'W301D_OUT', books: ['chainDiskToy', 'chainBurstShell3d'], env: { W301D_ONLY: '^(A\\.base|F\\.engine\\.8)$' }, orderEnv: 'W301D_ORDER' },
]);
function boolLeaves(o, pre, out, depth) {
  if (depth > 4 || o === null || typeof o !== 'object') return out;
  for (const [k, v] of Object.entries(o)) { if (k === 'meta') continue; const p = pre ? pre + '.' + k : k;
    if (typeof v === 'boolean' && /(^|\.)(gates?|ok|gate[A-Z]\w*)(\.|$)|\.ok$|^ok$/.test(p)) out[p] = v; else if (typeof v === 'object') boolLeaves(v, p, out, depth + 1); }
  return out;
}
function runSub(sub, ord, tmp) {
  const out = path.join(tmp, sub.key + '-' + ord + '.json');
  const env = Object.assign({}, process.env, sub.env || {}, { [sub.outEnv]: out, QA_TARGET: TARGET });
  if (sub.orderEnv) env[sub.orderEnv] = ord; else if (ord === 'split') { env.W302D_FORCE_ORDER = 'split'; env.NODE_OPTIONS = ((env.NODE_OPTIONS || '') + ' --import=' + PRE_URL).trim(); }
  else { delete env.W302D_FORCE_ORDER; }
  const t0 = Date.now(), r = spawnSync(process.execPath, [path.join(ROOT, sub.script)], { cwd: ROOT, env, encoding: 'utf8', maxBuffer: 1 << 26 });
  const J = fs.existsSync(out) ? JSON.parse(fs.readFileSync(out, 'utf8')) : null;
  if (J) fs.unlinkSync(out);
  return { code: r.status, wallSec: (Date.now() - t0) / 1000, J, err: J ? null : String(r.stderr || '').slice(-600) };
}
const pick = (J, paths) => { const o = {}; for (const p of paths) { let v = J; for (const k of p.split('.')) { v = (v && typeof v === 'object') ? v[k] : undefined; } o[p] = (v === undefined) ? null : v; } return o; };
const TIME_KEY = /^(wallSec|elapsedS|elapsed|timing|wall|ms|tWall)$/;
const noTime = (v) => { if (Array.isArray(v)) return v.map(noTime); if (v && typeof v === 'object') { const o = {}; for (const [k, x] of Object.entries(v)) if (!TIME_KEY.test(k)) o[k] = noTime(x); return o; } return v; };
const slim = (k, J) => { if (!J || k === 'w301d') return null; const o = Object.assign({}, J); delete o.meta; return noTime(o); };   // 壁時計の欄は落とす(正本の安定 hash)
export function chainPart(log) {
  const tmp = fs.mkdtempSync(path.join(ROOT, 'tests', 'out', '.w302d-'));
  const res = {};
  try {
    for (const sub of SUBS) {
      const r = {};
      for (const ord of ['split', 'semic']) { r[ord] = runSub(sub, ord, tmp); log(sub.key, ord, 'code', r[ord].code, r[ord].wallSec.toFixed(0) + ' s', r[ord].err || ''); }
      const bs = r.split.J ? boolLeaves(r.split.J, '', {}, 0) : {}, bm = r.semic.J ? boolLeaves(r.semic.J, '', {}, 0) : {};
      const flips = Object.keys(bs).filter((k) => bs[k] === true && bm[k] === false), gains = Object.keys(bs).filter((k) => bs[k] === false && bm[k] === true);
      const fl = (J) => (J && sub.key === 'w301d') ? Object.fromEntries(Object.entries(J.results || {}).map(([k, v]) => [k, (v && v.summary) ? pick(v.summary, ['tEsc', 'tBurst', 'nEscT', 'vEscMaxT', 'rMedT', 'KMax', 'RT', 'WT']) : null])) : null;
      res[sub.key] = { script: sub.script, books: sub.books, env: sub.env || null, split: { code: r.split.code, ok: r.split.J ? r.split.J.ok : null, wallSec: r.split.wallSec, bools: bs, numbers: fl(r.split.J) },
        semic: { code: r.semic.code, ok: r.semic.J ? r.semic.J.ok : null, wallSec: r.semic.wallSec, bools: bm, numbers: fl(r.semic.J) }, flips, gains,
        rawSplit: slim(sub.key, r.split.J), rawSemic: slim(sub.key, r.semic.J) };
      log(sub.key, 'flips', JSON.stringify(flips), 'gains', JSON.stringify(gains));
    }
  } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
  return res;
}

/* ── 束ねる ── */
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN && process.argv.includes('--base-fp')) {   // 子プロセス: 基点の html で指紋(stepOrder の鍵を知らない世代 —— 宣言のまま)
  const { HP } = loadHtmlMain(path.join(ROOT, process.argv[process.argv.indexOf('--base-fp') + 1]));
  pinDecl315c();   // 第315便c(AN406): 在位の 7 本の宣言を移行の前の写しへ(本ごとの門 —— 基点の html では no-op・正本の欄は足さない)
  const ids = JSON.parse(process.argv[process.argv.indexOf('--ids') + 1]);
  process.stdout.write(JSON.stringify(fingerprints(HP, ids, null)));
  process.exit(0);
} else if (IS_MAIN) {
  const t0 = Date.now(), log = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a);
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
  pinDecl315c();   // 第315便c(AN406): 在位の 7 本の宣言を移行の前の写しへ(本ごとの門 —— 基点の html では no-op・正本の欄は足さない)
  pinDecl303();   // 第304便c: 🌦️🌔 を第303便の宣言へ(軟化 0.01・初期配置・W_bg —— 続く pinDecl302 が第302便の欄を戻す)
  pinDecl302();   // 第303便a: 在位の惑星の本の G_loc と フィットの本の W_bg・初期配置を第302便の宣言に戻して測る(歴史の値を保つ)
  const prev = fs.existsSync(OUT_PATH) ? JSON.parse(fs.readFileSync(OUT_PATH, 'utf8')) : null;
  const ids = idsOf(HP), out = { meta: null, ids, parts: PARTS };
  if (PARTS.includes('gates')) {
    const g = {}, tg = Date.now();
    g.closedForm = closedForm(HP); log('closedForm', JSON.stringify(g.closedForm));
    g.libMatch = ['chainDiskToy', 'chainBurstShell3d'].map((id) => libMatch(HP, id)); log('libMatch', JSON.stringify(g.libMatch));
    const fpSplit = fingerprints(HP, ids.drag, 'split'), fpSemic = fingerprints(HP, ids.drag, 'semic'), fpGain0 = fingerprints(HP, ids.gain0, null);
    const basePath = path.join(ROOT, BASE);
    let base = null, baseFrom = null;
    if (fs.existsSync(basePath)) {
      const r = spawnSync(process.execPath, [fileURLToPath(import.meta.url), '--base-fp', BASE, '--ids', JSON.stringify(ids.drag.concat(ids.gain0))], { cwd: ROOT, encoding: 'utf8', maxBuffer: 1 << 24 });
      if (r.status === 0) { base = JSON.parse(r.stdout); baseFrom = BASE; }
    }
    let splitBase, semicDiff, gain0Same;
    if (base) {
      splitBase = ids.drag.every((id) => fpSplit[id] === base[id]); semicDiff = ids.drag.filter((id) => fpSemic[id] !== base[id]); gain0Same = ids.gain0.every((id) => fpGain0[id] === base[id]);
    } else if (prev && prev.gates && prev.gates.split) {   // 推移: 前の正本の門が真 ∧ 今の split の指紋が前の正本と同じ
      const P = prev.gates.split; baseFrom = 'carried(' + (P.baseFrom || '?') + ')';
      splitBase = P.splitBase === true && ids.drag.every((id) => P.fpSplit && P.fpSplit[id] === fpSplit[id]);
      semicDiff = ids.drag.filter((id) => !(P.fpSplit && P.fpSplit[id] === fpSemic[id])); gain0Same = P.gain0Same === true && ids.gain0.every((id) => P.fpGain0 && P.fpGain0[id] === fpGain0[id]);
    } else { splitBase = null; semicDiff = null; gain0Same = null; }
    g.split = { steps: FP_STEPS, dt: H0, baseFrom, fpSplit, fpSemic, fpGain0, fpBase: base, splitBase, semicDiff, gain0Same,
      semicSameAsBase: semicDiff ? ids.drag.filter((id) => !semicDiff.includes(id)) : null };
    log('split', JSON.stringify({ baseFrom, splitBase, semicDiff, gain0Same }));
    g.ledger = ledgerCheck(HP); log('ledger', JSON.stringify(g.ledger.rows.map((z) => [z.d, z.RE, z.agree])), 'ratio', JSON.stringify(g.ledger.ratio));
    g.ok = { closedForm: g.closedForm.ok === true, libMatch: g.libMatch.every((z) => z.posRel <= 1e-9 && z.Wrel <= 1e-9), splitBase: g.split.splitBase === true, gain0Same: g.split.gain0Same === true, ledger: g.ledger.ok === true };
    g.wallSec = (Date.now() - tg) / 1000;
    out.gates = g;
  }
  if (PARTS.includes('fit')) { const tf = Date.now(); out.fit = fitPart(HP, log); out.fit.wallSec = (Date.now() - tf) / 1000; }
  if (PARTS.includes('chain')) { const tc = Date.now(); out.chain = chainPart(log); out.chain.wallSec = (Date.now() - tc) / 1000; }
  out.ok = out.gates ? Object.values(out.gates.ok).every(Boolean) : null;
  const CODE = ['tests/exp-w302d-semic.mjs', 'tests/lib-w315c-legacy7.mjs', 'tests/lib-w302c-pre.mjs', 'tests/lib-w302d-orderpre.mjs', 'tests/lib-w301d-coupled.mjs', 'tests/exp-w299c-planets3d.mjs', 'tests/exp-w300b-emonly.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs', 'tests/lib-w303a-pre.mjs', 'tests/lib-w304c-pre.mjs'].concat(SUBS.map((s) => s.script));
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第302便d', target: TARGET, code: CODE, inputs: [TARGET, LEGACY7_DATA_FILE, DECL302_DATA_FILE, DECL303_DATA_FILE] }), {
    harnessVersion: HARNESS_VERSION, semicVersion: HP.REL_DRAG_SEMIC_VERSION, orderPreVersion: ORDER_PRE_VERSION, coupledLibVersion: L.COUPLED_LIB_VERSION, loadErrors: errors.length,
    ruling: '決断事項 AN303 ①②⑤(semic を既定に・R_E を読み口に・inertialDragWork の記帳の定義)—— 原仮定者の裁定(第92報)で概ね同意',
    reading: '統括の検証項目 R188(本体の積分器 semic —— G_loc より先に既定化)',
    notClaim: ['semic で正しくなった', '保存則が成り立つ', '再フィットした', '目的の門を緩めた'] });
  out.elapsedS = (Date.now() - t0) / 1000;
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 1) + '\n');
  log('→ ' + path.relative(ROOT, OUT_PATH) + '(' + out.elapsedS.toFixed(1) + ' s)・ok ' + out.ok);
  process.exit(out.ok === false ? 1 : 0);
}
