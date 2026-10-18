// 第308便b(原仮定者の裁定(第101報)「AN348 は (C) —— 引きずり軸回転は慣性自転に直接は作用しないが、異なる軸の回転が合成されるとき、引きずられた天体の回転の
// バランスと潮汐で元の自転軸を維持するトルクが生じる。エネルギーの出所は源の慣性自転(反作用)」・(第102報)①「引きずりの計算は相互に行われているので、反作用を
// 返すと二重計上にならないかを確認する」・決断事項 AN348・AN349・AN355・統括の検証項目 R215): **元の自転軸の維持と慣性自転への駆動の器**。
//
// Node だけ(対象 html の inline script を tests/lib-w279b-headless.mjs の loadHtmlHeadless で読み、html の validatePreset・coord3d.makeSim・build・step・
// inertialDrag3SpinState・tideState・ckSnapOne/ckRestoreOne をそのまま呼ぶ)。純関数は tests/lib-w308b-hold.mjs(エンジンと同じ式・同じ演算順の参照 holdStepRef)。
// **在位の本の宣言は変えない** —— 写しはすべて器の中で組む(axisHold を宣言した在位の本は無い)。核は引数(KERNELS —— "sphere"・"mu2"。第308便a の "bevel" は
// 統合の後に同じ器へ足す —— 核の名前を KERNELS に足すだけで二重計上の表 D と時間発展 V が回る形)。
//
// ■ 段
//   P(純関数): 維持のトルクの仕事 0・厳密な ΔK・P_pair・二重計上の恒等式((b) の交換 = 2 × (c)・同じ向きの対で (b) = 0・作用・反作用の対で (b) = 2(a))・
//     接点 1 つの散逸の結合(両側から数えると 2 倍・赤道は同じ向きのトルク〔受け皿 2τ〕・極の逆回転は自転どうしで交換)・核の遠方の形。
//   A(受理): 正準形(省略は出さない)・拒否の一覧。
//   E(エンジンの 1 步 = 参照): 3 体(傾きの受け手・傾きの無い受け手・供給項の天体)で inertialDrag3HoldStep の力積・帳簿の増分が holdStepRef とビット同一。
//   L(帳簿): 3 体の長い走行で、全自転の角運動量(J の補償和 × 軸)の変化 = 駆動 + 反作用 − 入れなかった力積 + 供給(成分ごと)・運動エネルギーの変化 = SpinDK・
//     維持のトルクの仕事 ≈ 0・軸を回さない(軸の成分がビットで不変)。
//   K(状態の契約): チェックポイントの往復で状態・J の補償和・帳簿がビット同一。
//   D(二重計上 —— 第102報 ①): 対称な二体(同じ質量と自転・赤道 —— 同じ向き/逆向き)・非対称な二体・核 2 つ × 型 (a) reaction:"none"・(b) reaction:"source"・
//     (c) 対ごとに 1 回(receivers で片側だけ)をエンジンで走らせ、駆動 D(i←j)・D(j←i)・ρ・対称の分の割合・(b)/(a)・(b)/(c)・全 L・全 E・別に要るエネルギーの表。
//     接点 1 つの散逸の結合(赤道・45°・極 × 同じ向き/逆向き)と CTL(両方が潮汐の受け手 —— 反作用は軌道へ)の型を並べる。
//   V(金星・木星の写し —— 🌋🏀 の bodies・在位の宣言は変えない): 軸引きずり "sphere"(A = 1)+ 三次元の CTL(規格化 —— τ_T を公転の数で置く・観測の k₂・遅延ではない)
//     + axisHold(receivers:[惑星]・reaction:"source")で β = (τ_T/τ_C)(|ω_D∥|/n) を走査 —— 慣性自転の時間発展・駆動と潮汐のトルクの和・熱・P_pair・
//     別に要るエネルギー・太陽の自転の変化・供給項(sourceHold:[0])・維持のトルク。相互の駆動(receivers 省略)の 1 公転の率も記録。
//     太陽を受け手とする向き(遠い小さい源 —— r/R ≳ 10⁴)の ω_D は遠方の閉じた式の参照と比べる(M1 の閉じた式の桁落ちの範囲を記録 —— 第307便a)。
//
// ■ 言わないこと: 「帳簿が完全に閉じた」「自転が釣り合った」(時間発展の表で示した範囲を数で)・「金星の逆行を説明した」・「イオの加熱を説明した」・
//   τ_C の応答則を「導出」と書くこと(候補の応答則)・「太陽の自転を分解した」。
//
// ■ 使い方
//   node tests/exp-w308b-hold.mjs   → 正本 tests/out/hold-w308b.json(段 hold-308b)
//   W308B_OUT=<json> で出力先を変える(試走は正本を書かない)・W308B_TARGET=<html>(既定 beta/index.html)・W308B_QUICK=1(步を縮める —— 煙試験の窓)。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlHeadless } from './lib-w279b-headless.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as L from './lib-w308b-hold.mjs';
import { ctl3 } from './lib-w307b-tide3d.mjs';
// 第281便a の領域 hash の宣言(器と lib から引いた下限 + 写しの本 2 本)
const REGEN_SCOPE = {"presets":["jupiterSunInertial3d","venusSunInertial3d"],"roots":["$","CK_ARRS","CK_SC","HP.allPresets","HP.coord3d","HP.tideState","HP.validatePreset","INERTIAL_DRAG3_HOLD_SC_CK","REL_DRAG_AXIS_HOLD_KEYS","REL_DRAG_AXIS_HOLD_REACTIONS","REL_DRAG_AXIS_HOLD_VERSION","T","appStepDt","ckRestoreOne","ckSnapOne","ctx","inertialDrag3AxialSign","inertialDrag3SpinState","inertialR2Q"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w308b-hold-1';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (o) => JSON.parse(JSON.stringify(o));
const { dot, cross, add, sub, scale, norm } = L;
const e4 = (v) => (v === null || v === undefined || !Number.isFinite(v)) ? v : Number(v.toExponential(4));
const v4 = (a) => a ? a.map(e4) : a;
const rel = (a, b) => Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b), 1e-300);

/** 写しの本(宣言から —— 在位の本の宣言は変えない) */
export const BOOKS = Object.freeze({ venus: 'venusSunInertial3d', jupiter: 'jupiterSunInertial3d' });
/** 核(二重計上の表 D と時間発展 V を回す —— 第308便a の "bevel" は統合の後に足す) */
export const KERNELS = Object.freeze(['sphere', 'mu2']);
/** 写しの規格化: 潮汐の時間尺度 τ_T を公転の数で(観測の k₂・遅延ではない)・走行の長さ・β の走査 */
export const VNORM = Object.freeze({ tauTOrbits: { venus: 4, jupiter: 2 }, orbits: 40, quickOrbits: 6, betas: [0, 0.5, 1, 2], inertia: 'sphere', k2: 1 });
/** G = 1 の規格化の写し(二重計上の二体・3 体の帳簿) */
export const TOY = Object.freeze({ Wbg: 0.125, eps: 0.05, kappa: 4, sep: 4, R: 0.3, m: 1, spin: 0.5, tauC: 1, steps: 400, quickSteps: 60 });

const toyPhysics = (extra) => Object.assign({ coord: '3d', G: 0, D0: 2, kFrame: 0, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, kappaT: 0.0001, cLight: 30, bM: 1, etaRad: 0, pRad: 4,
  gravityX: 0, gravityY: 0, geoPN: 0, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 0.01, stateCarry: 'double', massPrecision: 'double' }, extra || {});
const toyPreset = (bodies, phys) => ({ id: 'w308bToy', name: 'w308b toy', description: '器の中の写し(内蔵ではない)', emoji: '·', group: '運動と時空',
  sampleClass: 'principle', fidelity: 'toy', camera: { scale: 50 }, world: { boundary: 'none', size: 0 }, physics: toyPhysics(phys), bodies });
const axisDeg = (tiltDeg, azimuthDeg) => ({ enable: true, tiltDeg, azimuthDeg, source: 'w308b 器の宣言(診断)' });
function spinDragOf(kernel, hold) {
  const sd = { rot: 'off', axial: 'on' };
  if (kernel === 'sphere') sd.axialModel = 'sphere'; else sd.axialCoupling = TOY.kappa;
  if (hold) sd.axisHold = hold;
  return sd;
}
const dragOf = (kernel, hold, extra) => Object.assign({ law: 'inertial', Wbg: TOY.Wbg, eps: TOY.eps, pairs: 'all', spinDrag: spinDragOf(kernel, hold) }, extra || {});
function simOf(H, p) {
  const v = H.HP.validatePreset(clone(p));
  if (!v.ok) throw new Error('validatePreset: ' + JSON.stringify(v.errors || v.err).slice(0, 300));
  const S = H.HP.coord3d.makeSim(); S.build(clone(v.preset));
  return { S, dt: H.evalExpr('appStepDt')(S), preset: v.preset };
}
const holdOf = (H, S) => H.evalExpr('inertialDrag3SpinState')(S).axisHold;
/** 天体 k の慣性自転の角運動量(軸方向のスカラー —— J の補償和が今の自転と合えばその和・合わなければ I s) */
function Jscalar(S, k, I) {
  const tide = S.hasTide === true && S.tideRecv && Array.from(S.tideRecv).indexOf(k) >= 0;
  const H = tide ? S.tideJh : S._rdHoldJh, Lo = tide ? S.tideJl : S._rdHoldJl, W = tide ? S.tideOmW : S._rdHoldOmW;
  return (H && Object.is(S.spin[k], W[k])) ? H[k] + Lo[k] : I * S.spin[k];
}
const axisOf = (S, k) => [S.sax[k], S.say[k], S.saz[k]];
function totalJ(S, I) { let J = [0, 0, 0]; for (let k = 0; k < S.n; k++) J = add(J, scale(axisOf(S, k), Jscalar(S, k, I[k]))); return J; }
function totalK(S, I) { let K = 0; for (let k = 0; k < S.n; k++) { const J = Jscalar(S, k, I[k]); K += I[k] > 0 ? J * J / (2 * I[k]) : 0; } return K; }

/* ───────── A(受理) ───────── */
export function partA(H) {
  const HP = H.HP, base = [{ type: 'single', m: 1, radius: 0.3, x: -2, y: 0, z: 0, vx: 0, vy: 0, vz: 0, spin: 0.5, pinned: false },
    { type: 'single', m: 1, radius: 0.3, x: 2, y: 0, z: 0, vx: 0, vy: 0, vz: 0, spin: 0.5, pinned: false }];
  const tryDecl = (sd) => HP.validatePreset(clone(toyPreset(base, { relativeDrag: { law: 'inertial', Wbg: TOY.Wbg, eps: TOY.eps, pairs: 'all', spinDrag: sd } })));
  const canonOf = (sd) => { const v = tryDecl(sd); return v.ok ? v.preset.physics.relativeDrag.spinDrag : { err: JSON.stringify(v.errors || v.err).slice(0, 120) }; };
  const omitted = canonOf({ rot: 'off', axial: 'on', axialModel: 'sphere' });
  const full = canonOf({ rot: 'off', axial: 'on', axialModel: 'sphere', axisHold: { tauC: 2, reaction: 'source', sourceHold: [1, 0], receivers: [1] } });
  const minimal = canonOf({ rot: 'off', axial: 'on', axialCoupling: 3, axisHold: { tauC: 2 } });
  const rejects = {
    axialOff: { rot: 'surfaceFlip', axial: 'off', axisHold: { tauC: 1 } },
    unknownKey: { rot: 'off', axial: 'on', axialModel: 'sphere', axisHold: { tauC: 1, gain: 2 } },
    tauZero: { rot: 'off', axial: 'on', axialModel: 'sphere', axisHold: { tauC: 0 } },
    tauNaN: { rot: 'off', axial: 'on', axialModel: 'sphere', axisHold: { tauC: NaN } },
    reactionBad: { rot: 'off', axial: 'on', axialModel: 'sphere', axisHold: { tauC: 1, reaction: 'orbit' } },
    sourceHoldDup: { rot: 'off', axial: 'on', axialModel: 'sphere', axisHold: { tauC: 1, sourceHold: [0, 0] } },
    receiversEmpty: { rot: 'off', axial: 'on', axialModel: 'sphere', axisHold: { tauC: 1, receivers: [] } },
    notObject: { rot: 'off', axial: 'on', axialModel: 'sphere', axisHold: 3 } };
  const rej = {}; for (const [k, sd] of Object.entries(rejects)) rej[k] = !tryDecl(sd).ok;
  return { omitted, full, minimal, omittedHasNoKey: !('axisHold' in omitted), rejects: rej, allRejected: Object.values(rej).every(Boolean),
    keys: H.evalExpr('REL_DRAG_AXIS_HOLD_KEYS'), reactions: H.evalExpr('REL_DRAG_AXIS_HOLD_REACTIONS'), version: H.evalExpr('REL_DRAG_AXIS_HOLD_VERSION') };
}

/* ───────── 3 体の写し(E・L・K) ───────── */
function threeBody(kernel, hold) {
  const bodies = [
    { type: 'single', m: 1, radius: 0.3, x: -1.5, y: 0.4, z: 0.3, vx: 0, vy: 0, vz: 0, spin: 0.6, pinned: false, spinAxis: axisDeg(20, 30) },
    { type: 'single', m: 0.4, radius: 0.2, x: 1.8, y: -0.5, z: -0.6, vx: 0, vy: 0, vz: 0, spin: -0.4, pinned: false },
    { type: 'single', m: 0.7, radius: 0.25, x: 0.2, y: 2.1, z: 0.9, vx: 0, vy: 0, vz: 0, spin: 0.3, pinned: false, spinAxis: axisDeg(50, 100) }];
  return toyPreset(bodies, { relativeDrag: dragOf(kernel, hold) });
}
const THREE_HOLD = Object.freeze({ tauC: 0.7, reaction: 'source', sourceHold: [2] });
function bodiesNow(S, f, decl) {
  const out = [];
  for (let k = 0; k < S.n; k++) out.push({ m: S.m[k], R: S.R[k], s: S.spin[k], a: axisOf(S, k), tilt: !!S.saOn[k], pin: !!S.pinned[k],
    held: (decl.sourceHold || []).indexOf(k) >= 0, rcv: decl.receivers ? decl.receivers.indexOf(k) >= 0 : true });
  return out;
}
/* ───────── E(エンジンの 1 步 = 参照) ───────── */
export function partE(H) {
  const rows = [];
  for (const kernel of KERNELS) {
    const { S, dt } = simOf(H, threeBody(kernel, THREE_HOLD));
    let nd = 0, steps = 0, cmp = 0;
    for (let s = 0; s < 6; s++) {
      const h0 = holdOf(H, S), f = h0.inertiaFactor, pre = bodiesNow(S, f, h0.decl);
      S.step(dt);
      const h1 = holdOf(H, S);
      if (h1.steps === h0.steps) continue;   // 履歴の無い步(駆動なし)
      steps++;
      const ref = L.holdStepRef({ bodies: pre, rec: S._rdHoldP, f, tauC: h0.decl.tauC, reaction: h0.decl.reaction, dt });
      // 帳簿は累計 —— 前の累計に参照の增分を同じ順で足した値とビットで比べる
      for (const [k, b] of [['driveL', ref.driveL], ['reactL', ref.reactL], ['outL', ref.outL]]) for (let c = 0; c < 3; c++) { cmp++; if (!Object.is(h1[k][c], h0[k][c] + b[c])) nd++; }
      for (let k = 0; k < S.n; k++) { cmp += 4; if (!Object.is(S._rdHoldDJ[k], ref.DJ[k])) nd++; if (!Object.is(S._rdHoldQX[k], ref.Q[0][k])) nd++; if (!Object.is(S._rdHoldQY[k], ref.Q[1][k])) nd++; if (!Object.is(S._rdHoldQZ[k], ref.Q[2][k])) nd++; }
      cmp++; if (!Object.is(h1.Ppair, ref.p1)) nd++;
    }
    rows.push({ kernel, steps, compared: cmp, nDiff: nd });
  }
  return { rows, allSame: rows.every((r) => r.nDiff === 0 && r.steps > 0) };
}
/* ───────── L(帳簿) ───────── */
export function partL(H, quick) {
  const rows = [];
  for (const kernel of KERNELS) {
    const { S, dt } = simOf(H, threeBody(kernel, THREE_HOLD)), N = quick ? 200 : 2000;
    S.step(dt);   // 最初の步(履歴なし —— 駆動なし)の後を起点に
    const h0 = holdOf(H, S), I = h0.inertia;
    const J0 = totalJ(S, I), K0 = totalK(S, I), ax0 = [0, 2].map((k) => axisOf(S, k));
    for (let s = 0; s < N; s++) S.step(dt);
    const h = holdOf(H, S), J1 = totalJ(S, I), K1 = totalK(S, I);
    const dJ = sub(J1, J0), dS = sub(h.stateL, h0.stateL), resL = sub(dJ, dS);
    const scaleL = Math.max(norm(sub(h.driveL, h0.driveL)), 1e-300);
    const axisSame = [0, 2].every((k, q) => axisOf(S, k).every((x, c) => Object.is(x, ax0[q][c])));
    rows.push({ kernel, steps: N, dJ: v4(dJ), stateL: v4(dS), residualL: v4(resL), residualLRel: e4(norm(resL) / scaleL),
      pairL: v4(sub(h.pairL, h0.pairL)), pairLRel: e4(norm(sub(h.pairL, h0.pairL)) / scaleL), outL: v4(sub(h.outL, h0.outL)), supplyL: v4(sub(h.supplyL, h0.supplyL)),
      dK: e4(K1 - K0), spinDK: e4(h.spinDK - h0.spinDK), residualKRel: e4(rel(K1 - K0, h.spinDK - h0.spinDK)),
      Ereq: e4(h.Ereq - h0.Ereq), supplyE: e4(h.supplyE - h0.supplyE), P1: e4(h.P1 - h0.P1), EreqMinusP1Rel: e4(rel(h.Ereq - h0.Ereq, h.P1 - h0.P1)),
      holdWork: h.hold.work, holdL: v4(h.hold.L), holdWorkRel: e4(Math.abs(h.hold.work) / Math.max(norm(h.hold.L) * Math.max(...[0, 2].map((k) => Math.abs(S.spin[k]))), 1e-300)),
      axesHeld: h.hold.axesHeld, axisBitSame: axisSame, heldSpinSame: Object.is(S.spin[2], 0.3) });
  }
  return { rows };
}
/* ───────── K(状態の契約) ───────── */
export function partK(H, quick) {
  const snapF = H.evalExpr('ckSnapOne'), restF = H.evalExpr('ckRestoreOne');
  const { S, dt } = simOf(H, threeBody('sphere', THREE_HOLD)), n1 = quick ? 20 : 100, n2 = quick ? 20 : 100;
  for (let k = 0; k < n1; k++) S.step(dt);
  const ck = snapF(S);
  for (let k = 0; k < n2; k++) S.step(dt);
  const AR = ['x', 'y', 'z', 'spin', 'sax', 'say', 'saz', 'rotA', '_rdHoldJh', '_rdHoldJl', '_rdHoldOmW'], SC = H.evalExpr('INERTIAL_DRAG3_HOLD_SC_CK');
  const after = {}; for (const k of AR) after[k] = Array.from(S[k].subarray(0, S.n));
  const sc = {}; for (const k of SC) sc[k] = S[k];
  restF(S, ck);
  for (let k = 0; k < n2; k++) S.step(dt);
  let d = 0; for (const k of AR) for (let i = 0; i < S.n; i++) if (!Object.is(after[k][i], S[k][i])) d++;
  for (const k of SC) if (!Object.is(sc[k], S[k])) d++;
  return { steps: [n1, n2], nDiff: d, keys: AR.length + SC.length };
}

/* ───────── D(二重計上 —— 第102報 ①) ───────── */
/** 二体(G = 0 —— 静止に近い)。cfg: twinCo(同じ質量と自転・同じ向き・赤道)/ twinAnti(逆向き)/ asym(質量・半径・自転・軸が違う) */
function twoBody(cfg, kernel, hold) {
  const ax = (k) => (cfg.axes ? axisDeg(cfg.axes[k][0], cfg.axes[k][1]) : axisDeg(0, 0));
  const h = TOY.sep / 2, pos = (k) => cfg.pole ? [0, 0, k ? h : -h] : [k ? h : -h, 0, k ? cfg.dz || 0 : 0];
  const bodies = [0, 1].map((k) => ({ type: 'single', m: cfg.m[k], radius: cfg.R[k], x: pos(k)[0], y: pos(k)[1], z: pos(k)[2], vx: 0, vy: 0, vz: 0,
    spin: cfg.s[k], pinned: false, spinAxis: ax(k) }));
  return toyPreset(bodies, { relativeDrag: dragOf(kernel, hold) });
}
export const DCFG = Object.freeze({
  twinCo: { m: [1, 1], R: [0.3, 0.3], s: [0.5, 0.5] },
  twinAnti: { m: [1, 1], R: [0.3, 0.3], s: [0.5, -0.5] },
  twinCoPole: { m: [1, 1], R: [0.3, 0.3], s: [0.5, 0.5], pole: true },
  twinAntiPole: { m: [1, 1], R: [0.3, 0.3], s: [0.5, -0.5], pole: true },
  asym: { m: [1, 0.3], R: [0.35, 0.15], s: [0.5, 1.2], axes: [[10, 0], [35, 120]], dz: 0.8 } });
function runScheme(H, cfg, kernel, hold, N) {
  const { S, dt } = simOf(H, twoBody(cfg, kernel, hold));
  S.step(dt);
  const h0 = holdOf(H, S), I = h0.inertia, J0 = totalJ(S, I), K0 = totalK(S, I), s0 = [S.spin[0], S.spin[1]];
  // 1 步の対の記録(相互の駆動 D(i←j)・D(j←i) —— 平行な成分 × 受け手の軸)
  S.step(dt);
  const HP = S._rdHoldP, n = S.n, f = h0.inertiaFactor, tc = hold.tauC;
  const D = (i, j) => { const b = (i * n + j) * 4, a = axisOf(S, i), p = S.saOn[i] ? HP[b] * a[0] + HP[b + 1] * a[1] + HP[b + 2] * a[2] : HP[b + 3]; return scale(a, f * S.m[i] * S.R[i] * S.R[i] * p / tc); };
  const D01 = D(0, 1), D10 = D(1, 0), O0 = scale(axisOf(S, 0), s0[0]), O1 = scale(axisOf(S, 1), s0[1]), dSpin1 = [S.spin[0] - s0[0], S.spin[1] - s0[1]];
  for (let s = 1; s < N; s++) S.step(dt);
  const h = holdOf(H, S), J1 = totalJ(S, I), K1 = totalK(S, I);
  return { D01, D10, O0, O1, dSpin1, dSpin: [S.spin[0] - s0[0], S.spin[1] - s0[1]], dJ: sub(J1, J0), dK: K1 - K0, Ereq: h.Ereq - h0.Ereq, P1: h.P1 - h0.P1,
    driveL: sub(h.driveL, h0.driveL), reactL: sub(h.reactL, h0.reactL), outL: sub(h.outL, h0.outL), N, dt };
}
export function partD(H, quick) {
  const N = quick ? TOY.quickSteps : TOY.steps, rows = [];
  for (const kernel of KERNELS) for (const [ck, cfg] of Object.entries(DCFG)) {
    const a = runScheme(H, cfg, kernel, { tauC: TOY.tauC, reaction: 'none' }, N);
    const b = runScheme(H, cfg, kernel, { tauC: TOY.tauC, reaction: 'source' }, N);
    const c0 = runScheme(H, cfg, kernel, { tauC: TOY.tauC, reaction: 'source', receivers: [0] }, N);   // 対ごとに 1 回(0 ← 1 の向きだけ —— 反作用は 1 へ)
    const sch = L.pairSchemes({ Dij: a.D01, Dji: a.D10, Oi: a.O0, Oj: a.O1 });
    const ratio = (x, y) => (Math.abs(y) > 0 ? x / y : null);
    rows.push({ kernel, config: ck,
      D01: v4(a.D01), D10: v4(a.D10), rho: e4(sch.rho), symFrac: e4(sch.symFrac),
      schemes: {
        a: { dSpin: v4(a.dSpin), dJ: v4(a.dJ), dK: e4(a.dK), Ereq: e4(a.Ereq), driveL: v4(a.driveL) },
        b: { dSpin: v4(b.dSpin), dJ: v4(b.dJ), dK: e4(b.dK), Ereq: e4(b.Ereq), P1: e4(b.P1), outL: v4(b.outL) },
        c: { dSpin: v4(c0.dSpin), dJ: v4(c0.dJ), dK: e4(c0.dK), Ereq: e4(c0.Ereq), P1: e4(c0.P1), outL: v4(c0.outL) } },
      // 受け手 0 の自転の変化の比(エンジンの実測 —— 最初の駆動の 1 步〔瞬間の率〕と N 步〔自転が動いた後 —— 相互の駆動は自転に依る〕)
      bOverA0: ratio(b.dSpin1[0], a.dSpin1[0]), bOverC0: ratio(b.dSpin1[0], c0.dSpin1[0]), cOverA0: ratio(c0.dSpin1[0], a.dSpin1[0]),
      bOverA0N: e4(ratio(b.dSpin[0], a.dSpin[0])), bOverC0N: e4(ratio(b.dSpin[0], c0.dSpin[0])),
      // 純関数の型(同じ D から): (b)/(c) の交換・(a) の全 L の率・(b) の P
      pure: { bOverC: e4(sch.bOverC), bOverA: e4(sch.bOverA), aL: v4(sch.a.L), bP: e4(sch.b.P), cP: e4(sch.c.P), receptacle: v4(sch.c.receptacle) } });
  }
  // 接点 1 つの散逸の結合(候補の構成法・導出ではない): 鏡映 B(赤道・45°・極)× 同じ向き/逆向き
  const contact = [];
  for (const [g, rh] of [['equator', [1, 0, 0]], ['45deg', L.unit([1, 0, 1])], ['pole', [0, 0, 1]]]) for (const [sk, Oj] of [['co', [0, 0, 0.5]], ['anti', [0, 0, -0.5]]]) {
    const q = L.contactBothViews({ Oi: [0, 0, 0.5], Oj, rh, Gamma: 0.2 });
    const exch = norm(q.ij.ti) > 0 ? 1 - norm(q.ij.L) / (2 * norm(q.ij.ti)) : null;   // 自転どうしで交換した割合(1 = 等しく反対・0 = 同じ向き —— 受け皿 2τ)
    contact.push({ geom: g, spins: sk, ti: v4(q.ij.ti), tj: v4(q.ij.tj), spinL: v4(q.ij.L), P: e4(q.ij.P), exchangeFrac: e4(exch), bothViewsFactor: e4(q.factor) });
  }
  // CTL の型(両方が潮汐の受け手 —— 各自の潮汐のふくらみのトルク・反作用は軌道へ): 同じ自転の双子で τ_0・τ_1 と軌道の受け皿
  const G = 1, r = [4, 0, 0], V = [0, 0.3, 0], k2 = 0.5, lag = 0.1, R = 0.3;
  const t0 = ctl3({ G, k2, lag, R, mj: 1, r, V, spin: 0.5, axis: [0, 0, 1] }), t1 = ctl3({ G, k2, lag, R, mj: 1, r: scale(r, -1), V: scale(V, -1), spin: 0.5, axis: [0, 0, 1] });
  const ctl = { tau0: v4(t0.torque), tau1: v4(t1.torque), rho: e4(dot(t1.torque, t0.torque) / dot(t0.torque, t0.torque)),
    note: '各自の潮汐のふくらみのトルク(相手の自転へは返さない —— 反作用は軌道へ)' };
  return { steps: N, rows, contact, ctl };
}

/* ───────── V(金星・木星の写し) ───────── */
function presetOf(HP, id) { const p = HP.allPresets().find((q) => q.id === id); if (!p) throw new Error('本が無い: ' + id); return clone(p); }
function planetCopy(H, key, hold, opts = {}) {
  const p = presetOf(H.HP, BOOKS[key]);
  p.id = 'w308b_' + key; delete p.abBody; delete p.fitRecord;
  const tp = p.timeRef.pRef, n = 2 * Math.PI / tp, sun = p.bodies[0], pl = p.bodies[1], G = p.physics.G;
  const r0 = norm(sub([pl.x, pl.y, pl.z], [sun.x, sun.y, sun.z]));
  // 規格化: τ_T = I/K_spin(K_spin = 3 G k₂ m☉² R⁵ Δt / a⁶)を公転の数で —— Δt を解く(観測の k₂・遅延ではない)
  const I = 0.4 * pl.m * pl.radius * pl.radius, tauT = VNORM.tauTOrbits[key] * tp;
  const lag = I * Math.pow(r0, 6) / (tauT * 3 * G * VNORM.k2 * sun.m * sun.m * Math.pow(pl.radius, 5));
  pl.tide = { k2: VNORM.k2, lag };
  if (!opts.tilt) delete pl.spinAxis;   // 既定は傾きを外した写し(惑星は傾きを持たない受け手 —— 慣性自転 s ẑ・潮汐の τ⊥ は数えて回さない・駆動は源の軸方向のスカラー)
  p.physics = { ...p.physics, tide: { maxN: 4, inertia: VNORM.inertia }, relativeDrag: { ...p.physics.relativeDrag, spinDrag: { rot: 'off', axial: 'on', axialModel: 'sphere', ...(hold ? { axisHold: hold } : {}) } } };
  if (opts.noTide) { delete p.physics.tide; delete pl.tide; }
  return { p, n, tp, tauT, lag, I, r0 };
}
/** 遠方の閉じた式の参照(一様球の源 M1 ≈ (3/5)R²/r⁴ —— 分母は受け手の点の行 W_bg + Σ m K + Σ q/r²)の ω_D(i←j) */
function farRef(H, S, i, j) {
  const rd = S.relDrag, i2 = rd.inertialR2 || null, Gc = S.params.G, c0 = S.params.cLight, eps = rd.eps || 0, e2 = eps * eps, Q = H.evalExpr('inertialR2Q');
  const KX = (S._rdQX && S._rdQX.length >= S.n) ? S._rdQX : S.x, KY = (S._rdQY && S._rdQY.length >= S.n) ? S._rdQY : S.y, KZ = (S._rdQZ && S._rdQZ.length >= S.n) ? S._rdQZ : S.z;   // 核が読んだ位置(semic の写し)
  const P = (k) => [KX[k], KY[k], KZ[k]];
  const d = sub(P(i), P(j)), r = norm(d), rh = scale(d, 1 / r);
  let W = 0; for (let k = 0; k < S.n; k++) { if (k === i) continue; const z = sub(P(i), P(k)), r2 = dot(z, z), s = r2 + e2; W += S.m[k] * Math.sqrt(r2) / (s * s) + (i2 ? Q(i2, S.m[k], Gc, c0) / s : 0); }
  if (i2 && i2.self === 'radius') W += Q(i2, S.m[i], Gc, c0) / (S.radOv[i] * S.radOv[i]);
  // q_eff = −dln(den)/dln r + 4(分子 g ∝ r⁻⁵ → u ∝ r⁻⁴ × r)—— 源 j の項だけが r に依る近似(二体)
  const Rj = S.radOv[j], qj = i2 ? Q(i2, S.m[j], Gc, c0) : 0, Wbg = rd.Wbg;
  const den = Wbg + W, dden = -2 * qj / (r * r) - 3 * S.m[j] / (r * r * r);   // r d(den)/dr
  const qEff = 5 + dden / den, f = 0.6 * S.m[j] * Rj * Rj / Math.pow(r, 5) / den;
  const Om = scale(axisOf(S, j), S.spin[j]);
  return L.kernelFar('sphere', Om, rh, f, qEff);
}
/** 惑星の慣性自転のベクトル s â の軌道の法線 ĥ(太陽に対する相対の r × v)への射影 */
function spinOnNormal(S) {
  const r = sub([S.x[1], S.y[1], S.z[1]], [S.x[0], S.y[0], S.z[0]]), v = sub([S.vx[1], S.vy[1], S.vz[1]], [S.vx[0], S.vy[0], S.vz[0]]), h = L.unit(cross(r, v));
  return S.spin[1] * dot(axisOf(S, 1), h);
}
function runPlanet(H, key, beta, variant, orbits, omegaProbe, opts = {}) {
  // variant: "c"(receivers:[1]・reaction:"source")/ "cHold"(+ sourceHold:[0])/ "a"(receivers:[1]・reaction:"none")/ "b"(receivers 省略 —— 相互・反作用)
  const probe = planetCopy(H, key, null);
  const tauC = beta > 0 ? probe.tauT * Math.abs(omegaProbe) / (beta * probe.n) : null;
  const hold = beta > 0 ? (variant === 'b' ? { tauC, reaction: 'source' } : { tauC, reaction: variant === 'a' ? 'none' : 'source', receivers: [1], ...(variant === 'cHold' ? { sourceHold: [0] } : {}) }) : null;
  const c = planetCopy(H, key, hold, opts);
  const { S, dt } = simOf(H, c.p);
  const steps = Math.round(orbits * c.tp / dt), every = Math.max(1, Math.round(steps / 8));
  const sun0 = S.spin[0], pl0 = spinOnNormal(S), ax0 = axisOf(S, 1), f = 0.4, Ipl = f * S.m[1] * S.R[1] * S.R[1], Isun = f * S.m[0] * S.R[0] * S.R[0];
  const rec = [];
  let tTide = 0, tDrive = 0, nT = 0;
  for (let s = 1; s <= steps; s++) {
    S.step(dt);
    if (s > steps - Math.round(c.tp / dt)) {   // 最後の 1 公転の平均(トルクの軸方向の成分)
      const ts = H.HP.tideState(S), br = ts.d3.brake[0];
      const hs = hold ? holdOf(H, S) : null, dj = hs ? hs.lastDJ[1] / dt : 0;
      tTide += br; tDrive += dj; nT++;
    }
    if (s % every === 0 || s === steps) {
      const ts = H.HP.tideState(S), hs = hold ? holdOf(H, S) : null;
      rec.push({ orbit: e4(s * dt / c.tp), spinOverN: e4(spinOnNormal(S) / c.n), axisZ: e4(S.saz[1]), heat: e4(ts.heat), Ereq: hs ? e4(hs.Ereq) : null, P1: hs ? e4(hs.P1) : null,
        sunSpinRel: e4((S.spin[0] - sun0) / sun0), supplyE: hs ? e4(hs.supplyE) : null });
    }
  }
  const ts = H.HP.tideState(S), hs = hold ? holdOf(H, S) : null;
  const axTurn = Math.acos(Math.max(-1, Math.min(1, dot(axisOf(S, 1), ax0))));
  const mT = tTide / nT, mD = tDrive / nT;
  return { key, beta, variant, tilt: !!opts.tilt, tauC: e4(tauC), steps, dt, orbits, spin0OverN: e4(pl0 / c.n), spinOverN: e4(spinOnNormal(S) / c.n), rec,
    meanTideTorque: e4(mT), meanDriveTorque: e4(mD), balanceRel: e4((mT + mD) / Math.max(Math.abs(mT), Math.abs(mD), 1e-300)),
    predictedShiftOverN: beta > 0 ? e4(Math.sign(omegaProbe) * beta) : 0,
    heat: e4(ts.heat), work: e4(ts.work), tideResidualE: e4(ts.residualE), sunSpinRel: e4((S.spin[0] - sun0) / sun0), sunJchange: e4(Isun * (S.spin[0] - sun0)),
    hold: hs ? { Ereq: e4(hs.Ereq), EreqPos: e4(hs.EreqPos), EreqNeg: e4(hs.EreqNeg), P1: e4(hs.P1), spinDK: e4(hs.spinDK), supplyE: e4(hs.supplyE), supplyL: v4(hs.supplyL),
      driveL: v4(hs.driveL), reactL: v4(hs.reactL), outL: v4(hs.outL), holdL: v4(hs.hold.L), holdWork: e4(hs.hold.work), axesHeld: hs.hold.axesHeld,
      heatOverEreq: e4(ts.heat / Math.max(Math.abs(hs.Ereq), 1e-300)) } : null,
    axisTurnRad: e4(axTurn), Iplanet: e4(Ipl), Isun: e4(Isun) };
}
export function partV(H, quick) {
  const out = {}, orbits = quick ? VNORM.quickOrbits : VNORM.orbits;
  for (const key of Object.keys(BOOKS)) {
    // 1 步の記録で ω_D(惑星←太陽)・ω_D(太陽←惑星)の平行な成分(エンジン)と遠方の閉じた式の参照
    const c = planetCopy(H, key, { tauC: 1, reaction: 'source' }, { noTide: true });
    const { S, dt } = simOf(H, c.p);
    S.step(dt); S.step(dt);
    const HP = S._rdHoldP, n = S.n, w = (i, j) => [HP[(i * n + j) * 4], HP[(i * n + j) * 4 + 1], HP[(i * n + j) * 4 + 2]];
    const wPS = w(1, 0), wSP = w(0, 1), rPS = farRef(H, S, 1, 0), rSP = farRef(H, S, 0, 1);
    const pPS = S.saOn[1] ? dot(wPS, axisOf(S, 1)) : HP[(1 * n + 0) * 4 + 3], pSP = dot(wSP, axisOf(S, 0));   // 駆動が読む平行な率(傾きの無い惑星は源の軸方向のスカラー)
    const Ipl = 0.5 * S.m[1] * S.R[1] * S.R[1], Isun = 0.5 * S.m[0] * S.R[0] * S.R[0];
    const omega = { planetFromSun: v4(wPS), planetFromSunRef: v4(rPS), relErrPS: e4(norm(sub(wPS, rPS)) / norm(rPS)), sunFromPlanet: v4(wSP), sunFromPlanetRef: v4(rSP),
      relErrSP: e4(norm(sub(wSP, rSP)) / norm(rSP)), parPS: e4(pPS), parSP: e4(pSP), parPSRef: e4(S.saOn[1] ? dot(rPS, axisOf(S, 1)) : dot(rPS, axisOf(S, 0)) * H.evalExpr('inertialDrag3AxialSign')(S.sax[0], S.say[0], S.saz[0])), parSPRef: e4(dot(rSP, axisOf(S, 0))),
      overSpinPS: e4(pPS / S.spin[1]), rOverRsun: e4(norm(sub([S.x[1], S.y[1], S.z[1]], [S.x[0], S.y[0], S.z[0]])) / S.radOv[0]),
      rOverRplanet: e4(norm(sub([S.x[1], S.y[1], S.z[1]], [S.x[0], S.y[0], S.z[0]])) / S.radOv[1]),
      // 相互の駆動のトルクの比(同じ τ_C —— 参照の値で): D(太陽←惑星)/D(惑星←太陽) = I☉ p_SP / (I_p p_PS)
      driveRatioSunOverPlanet: e4((Isun * dot(rSP, axisOf(S, 0))) / (Ipl * dot(rPS, axisOf(S, 0)))) };
    const omegaProbe = omega.parPS;
    const runs = [];
    for (const beta of VNORM.betas) runs.push(runPlanet(H, key, beta, 'c', orbits, omegaProbe));
    runs.push(runPlanet(H, key, 1, 'cHold', orbits, omegaProbe));
    runs.push(runPlanet(H, key, 1, 'a', orbits, omegaProbe));
    const base = runs[0].spinOverN;
    for (const r of runs) r.shiftOverN = e4(r.spinOverN - base);
    // 相互(receivers 省略 —— 太陽も惑星の引きずりから駆動を受け、その反作用が惑星へ)—— 1 公転だけ・同じ 1 公転の (c) と β = 0 と並べる
    const mutual = runPlanet(H, key, 1, 'b', 1, omegaProbe), one = { c: runPlanet(H, key, 1, 'c', 1, omegaProbe), base: runPlanet(H, key, 0, 'c', 1, omegaProbe) };
    mutual.shiftOverN = e4(mutual.spinOverN - one.base.spinOverN); mutual.shiftOverNc = e4(one.c.spinOverN - one.base.spinOverN);
    mutual.mutualOverC = e4((mutual.spinOverN - one.base.spinOverN) / (one.c.spinOverN - one.base.spinOverN));
    mutual.sunSpinRelC = one.c.sunSpinRel;
    // 傾きを持つ受け手の写し(宣言の軸 —— 潮汐の τ⊥ は軸を回す・軸引きずりの ω⊥ は axisHold で回さない)—— β = 1 と β = 0
    const tilted = [runPlanet(H, key, 0, 'c', orbits, omegaProbe, { tilt: true }), runPlanet(H, key, 1, 'c', orbits, omegaProbe, { tilt: true })];
    out[key] = { n: e4(c.n), tauTOrbits: VNORM.tauTOrbits[key], lag: e4(c.lag), omega, runs, mutual, tilted };
  }
  return { orbits, norm: VNORM, books: out };
}

/* ───────── 門と表 ───────── */
export function gatesOf(J) {
  const g = {};
  g.pure = J.P.pass;
  g.acceptCanon = J.A.omittedHasNoKey && J.A.allRejected && !!J.A.full.axisHold && J.A.full.axisHold.reaction === 'source';
  g.engineEqualsRef = J.E.allSame;
  g.ledgerL = J.L.rows.every((r) => r.residualLRel < 1e-12 && r.pairLRel < 1e-12);
  g.ledgerK = J.L.rows.every((r) => r.residualKRel < 1e-9);
  g.holdNoWork = J.L.rows.every((r) => r.holdWorkRel < 1e-12 && r.axesHeld > 0);
  g.axisHeld = J.L.rows.every((r) => r.axisBitSame && r.heldSpinSame);
  g.checkpoint = J.K.nDiff === 0;
  const live = J.D.rows.filter((r) => r.rho !== null);   // 駆動が 0 の配置(μ² の赤道)は比を持たない
  const tw = live.filter((r) => r.config.startsWith('twinCo')), an = live.filter((r) => r.config.startsWith('twinAnti'));
  g.twinCoCancels = tw.length >= 3 && tw.every((r) => r.schemes.b.dSpin[0] === 0 && r.schemes.b.dSpin[1] === 0);
  g.twinAntiDoubles = an.length >= 3 && an.every((r) => Math.abs(r.bOverA0 - 2) < 1e-9 && Math.abs(r.bOverC0 - 2) < 1e-9);
  const ct = J.D.contact.filter((r) => r.bothViewsFactor !== null);
  g.contact2x = ct.length >= 4 && ct.every((r) => Math.abs(r.bothViewsFactor - 2) < 1e-12);
  return g;
}
const f4 = (x) => (x === null || x === undefined) ? '—' : (typeof x === 'number' ? (Number.isInteger(x) ? String(x) : Number(x.toPrecision(4)).toString()) : String(x));
/** PHYSICS〔第308便b〕の表(正本から作る —— QA docs.axisHold308 が同じ関数で作り直して逐語照合) */
export function physicsTables(J) {
  const L1 = ['| 核 | 配置 | ρ = D(j←i)·D(i←j)/abs(D(i←j))² | 対称の分の割合 | (b)/(a) | (b)/(c) | (c)/(a) | (a) 全 L の変化(z) | (b) 別に要る E | (c) 別に要る E |', '|---|---|---|---|---|---|---|---|---|---|'];
  for (const r of J.D.rows) if (r.rho !== null) L1.push(`| ${r.kernel} | ${r.config} | ${f4(r.rho)} | ${f4(r.symFrac)} | ${f4(r.bOverA0)} | ${f4(r.bOverC0)} | ${f4(r.cOverA0)} | ${f4(r.schemes.a.dJ[2])} | ${f4(r.schemes.b.Ereq)} | ${f4(r.schemes.c.Ereq)} |`);
  const L2 = ['| 接点の向き | 自転 | τ_i(z) | τ_j(z) | 自転の L の和(z) | 自転どうしで交換した割合 | 両側から数えた倍率 | 仕事率 |', '|---|---|---|---|---|---|---|---|'];
  for (const r of J.D.contact) L2.push(`| ${r.geom} | ${r.spins} | ${f4(r.ti[2])} | ${f4(r.tj[2])} | ${f4(r.spinL[2])} | ${f4(r.exchangeFrac)} | ${f4(r.bothViewsFactor)} | ${f4(r.P)} |`);
  const L3 = ['| 写し | ω_D(惑星←太陽)の誤差 | ω_D(太陽←惑星)の誤差 | r/R☉ | r/R_惑星 | D(太陽←惑星)/D(惑星←太陽) | 惑星の駆動の率/自転 |', '|---|---|---|---|---|---|---|'];
  for (const [k, b] of Object.entries(J.V.books)) L3.push(`| ${k} | ${f4(b.omega.relErrPS)} | ${f4(b.omega.relErrSP)} | ${f4(b.omega.rOverRsun)} | ${f4(b.omega.rOverRplanet)} | ${f4(b.omega.driveRatioSunOverPlanet)} | ${f4(b.omega.overSpinPS)} |`);
  const L4 = ['| 写し | 型 | β | 傾き | 始め Ω·ĥ/n | 終わり Ω·ĥ/n | β = 0 からのずれ/n | 予想 | 最後の 1 公転の (τ_潮汐 + τ_駆動)/max | 熱 | 別に要る E | 太陽の自転の相対の変化 | 供給の仕事 |', '|---|---|---|---|---|---|---|---|---|---|---|---|---|'];
  for (const [k, b] of Object.entries(J.V.books)) for (const r of b.runs.concat(b.tilted)) L4.push(`| ${k} | ${r.variant} | ${f4(r.beta)} | ${r.tilt ? '有' : '無'} | ${f4(r.spin0OverN)} | ${f4(r.spinOverN)} | ${f4(r.shiftOverN)} | ${f4(r.predictedShiftOverN)} | ${f4(r.balanceRel)} | ${f4(r.heat)} | ${f4(r.hold && r.hold.Ereq)} | ${f4(r.sunSpinRel)} | ${f4(r.hold && r.hold.supplyE)} |`);
  const L5 = ['| 写し | 相互(b)の 1 公転のずれ/n | 片側(c)の 1 公転のずれ/n | (b)/(c) | 太陽の自転の相対の変化(b) | 同(c) |', '|---|---|---|---|---|---|'];
  for (const [k, b] of Object.entries(J.V.books)) L5.push(`| ${k} | ${f4(b.mutual.shiftOverN)} | ${f4(b.mutual.shiftOverNc)} | ${f4(b.mutual.mutualOverC)} | ${f4(b.mutual.sunSpinRel)} | ${f4(b.mutual.sunSpinRelC)} |`);
  return [L1.join('\n'), L2.join('\n'), L3.join('\n'), L4.join('\n'), L5.join('\n')].join('\n\n');
}
export function docNumbers(J) {
  const an = J.D.rows.find((r) => r.kernel === 'sphere' && r.config === 'twinAnti'), as = J.D.rows.find((r) => r.kernel === 'sphere' && r.config === 'asym');
  return [f4(an.bOverA0), f4(as.rho), f4(J.V.books.jupiter.omega.driveRatioSunOverPlanet), f4(J.V.books.venus.omega.driveRatioSunOverPlanet), f4(J.L.rows[0].residualLRel), f4(J.L.rows[0].holdWorkRel)];
}
export function runAll(H, { quick = false } = {}) {
  const t = {};
  let t0 = Date.now();
  const lap = (k) => { t[k] = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now(); };
  const P = L.checksOf(); lap('P');
  const A = partA(H); lap('A');
  const E = partE(H); lap('E');
  const Lb = partL(H, quick); lap('L');
  const K = partK(H, quick); lap('K');
  const D = partD(H, quick); lap('D');
  const V = partV(H, quick); lap('V');
  const J = { quick, toy: TOY, P, A, E, L: Lb, K, D, V };
  J.gates = gatesOf(J);
  J.ok = Object.values(J.gates).every(Boolean);
  J.timing = t;
  return J;
}
export async function main() {
  const TARGET = process.env.W308B_TARGET || 'beta/index.html';
  const OUT = process.env.W308B_OUT || path.join(ROOT, 'tests', 'out', 'hold-w308b.json');
  const quick = process.env.W308B_QUICK === '1';
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now();
  const W281A_SCOPE = w281aScopeStamp(html, REGEN_SCOPE);
  const H = loadHtmlHeadless(html);
  const R = runAll(H, { quick });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w308b-hold.mjs', target: TARGET,
    targetSha256: crypto.createHash('sha256').update(fs.readFileSync(html)).digest('hex'),
    ruling: '原仮定者の裁定(第101報)AN348 → (C)・(第102報)①「引きずりの計算は相互 —— 反作用を返すと二重計上にならないかを確認する」・決断事項 AN348・AN349・AN355・統括の検証項目 R215',
    holdVersion: H.evalExpr('REL_DRAG_AXIS_HOLD_VERSION'), ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w308b-hold.mjs', 'tests/lib-w308b-hold.mjs', 'tests/lib-w307b-tide3d.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第308便b', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION,
    engine: 'Node の headless(tests/lib-w279b-headless.mjs の loadHtmlHeadless —— html の本文をそのまま実行・1 プロセス)',
    notClaim: ['帳簿が完全に閉じた', '自転が釣り合った', '金星の逆行を説明した', 'イオの加熱を説明した', '太陽の自転を分解した', 'τ_C の応答則の導出'] });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s', JSON.stringify(out.timing));
}
if (IS_MAIN) await main();
