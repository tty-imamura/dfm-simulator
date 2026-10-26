// 第309便b(原仮定者の裁定(第103報)AN356「トルクの反作用は太陽の慣性自転へ戻さない —— 天体の自転軸が向くのは遠方宇宙なので反作用は背景宇宙へ」・
// AN358「異なる軸の回転を与えると本来は新しい軸の回転になるが、安定な天体の近似として軸も回転も維持し、失われるエネルギーを内部熱に、反作用を背景宇宙へ」・
// (第104報)AN362「内部熱に変換するエネルギー量は、慣性自転に引きずり軸回転を合成した自転軸を慣性自転の自転軸に 1 ステップで回すのに必要なトルク・
// 回転速度の差分のエネルギー量も計算する」・統括の検証項目 R219): **維持の型・背景の口座・内部熱の器**。
//
// Node だけ(対象 html の inline script を tests/lib-w279b-headless.mjs の loadHtmlHeadless で読み、html の validatePreset・coord3d.makeSim・build・step・
// inertialDrag3SpinState・tideState・ckSnapOne/ckRestoreOne をそのまま呼ぶ)。純関数は tests/lib-w309b-maintain.mjs(エンジンと同じ式・同じ演算順の参照 restoreCell)。
// **在位の本の宣言は変えない** —— 写しはすべて器の中で組む(維持の型を宣言した在位の本は無い)。核は引数(KERNELS —— "sphere"・"bevel"。新しい引きずり則の核は
// 統合の後に名前を KERNELS に足すだけで表が回る形)。
//
// ■ 段
//   P(純関数): 例の値・素朴な式との一致・桁落ちの対照・復元の力積の和 = −I ω_D・実際の軸の仕事 0・口座の和 0・赤道の歯車(軸のコスト 0)・熱の時間の型の走査・逆行の自転。
//   A(受理): 正準形(維持の型の最小と全部・駆動の型の mode:"drive" は鍵を出さない)・拒否の一覧。
//   E(エンジンの 1 步 = 参照): 3 体(傾きの受け手 2・傾きの無い受け手 1)× 核で inertialDrag3MaintStep の 1 步の量・受け手ごとの熱・帳簿の增分が参照とビット同一。
//   L(維持の門・表示の門・口座): 長い走行で慣性自転と軸がビットで不変(維持の門)・表示の自転の率 = Ω_I + ω_D∥(表示の門)・口座の和の残り・
//     reaction:"none" と "background" は状態が同じビット(読み口だけが違う)。
//   T(dt の走査 —— エンジン): 静止した 3 体(ω_D が一定)で h・h/2・h/4・h/8 —— "step" は同じ時間の熱が 1・2・4・8 倍・{tauHold} は不変。赤道の歯車の配置の 2 行。
//   K(状態の契約): チェックポイントの往復(3 体 —— 帳簿・受け手ごとの熱・作業 / 金星の写しの潮汐の内部熱 —— E_i へ入る熱)。S: 步で変わる鍵の登録・宣言しない本に鍵が無い。
//   D(τ_C の駆動の型との比較 —— 比較の写し): 同じ写しで駆動の型(reaction "none"・"source")と維持の型 —— 自転の変化・別に要るエネルギーと熱・供給。
//   V(金星・木星の写し —— 🌋🏀 の bodies・宣言の傾き・在位の宣言は変えない): 軸引きずり "sphere"・"bevel"(A = 1)× 維持の型(背景の口座)で 1 公転 ——
//     受け手ごとの ω_D の大きさ・熱・軸のコストの割合・速さの差・供給・背景の口座の量。h・h/2・h/4・h/8 の走査(1 公転)。潮汐の内部熱へ入れる写し
//     (惑星だけ明示潮汐 —— 規格化した CTL・内部熱の線形の緩和)—— E_i の残り・自転の変化 = 潮汐の力積(維持は CTL の変化を消さない)。
//
// ■ 言わないこと: 「帳簿が完全に閉じた」(器が示した範囲を数で)・「熱を説明した」・「τ_hold を導いた」(比較の仮定)・「イオの加熱を説明した」・
//   軸のコストを「トルクの実際の仕事」と書くこと(大きさを保つ回転の実際の仕事は 0)・背景の口座を「遠方宇宙の物理の経路」と書くこと。
//
// ■ 使い方
//   node tests/exp-w309b-maintain.mjs   → 正本 tests/out/maintain-w309b.json(段 maintain-309b)
//   W309B_OUT=<json> で出力先を変える(試走は正本を書かない)・W309B_TARGET=<html>(既定 beta/index.html)・W309B_QUICK=1(步を縮める —— 煙試験の窓)。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlHeadless } from './lib-w279b-headless.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as L from './lib-w309b-maintain.mjs';
import { pinDecl315c, LEGACY7_DATA_FILE } from './lib-w315c-legacy7.mjs';   // 第315便c(決断事項 AN406・R244): 在位の 7 本を K1 へ移した世代では、この器は移行の前(af2f426)の宣言の写しで測る
// 第281便a の領域 hash の宣言(器と lib から引いた下限 —— 写しの本 2 本と状態の契約の確かめの 🪛)
const REGEN_SCOPE = {"presets":["chainDiskToy3dTilt","jupiterSunInertial3d","venusSunInertial3d"],"roots":["$","HP.allPresets","HP.coord3d","HP.inertialDrag3HoldF","HP.tideState","HP.validatePreset","INERTIAL_DRAG3_HOLD_SC","INERTIAL_DRAG3_MAINT_SC","INERTIAL_DRAG3_SC","INERTIAL_DRAG_CK_SAMPLES","REL_DRAG_AXIS_HOLD_MAINT_KEYS","REL_DRAG_AXIS_HOLD_MAINT_REACTIONS","REL_DRAG_AXIS_HOLD_MAINT_VERSION","REL_DRAG_AXIS_HOLD_MODES","SIM_BUILD_RESET","SIM_STEP_SCRATCH","T","appStepDt","ckRestoreOne","ckSnapOne","ctx","inertialDrag3SpinState","tideInertiaOf"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w309b-maintain-1';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (o) => JSON.parse(JSON.stringify(o));
const { dot, add, sub, scale, norm } = L;
const e4 = (v) => (v === null || v === undefined || !Number.isFinite(v)) ? v : Number(v.toExponential(4));
const v4 = (a) => a ? a.map(e4) : a;
const rel = (a, b) => Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b), 1e-300);

/** 写しの本(宣言から —— 在位の本の宣言は変えない) */
export const BOOKS = Object.freeze({ venus: 'venusSunInertial3d', jupiter: 'jupiterSunInertial3d' });
/** 核(新しい引きずり則の核は統合の後に名前を足す) */
export const KERNELS = Object.freeze(['sphere', 'bevel']);
/** G = 0 の静止した写し(ω_D が一定)・走行の長さ・dt の走査 */
export const TOY = Object.freeze({ Wbg: 0.125, eps: 0.05, kappa: 4, h: 0.016, steps: 2000, quickSteps: 200, scanSteps: 64, scanDiv: [1, 2, 4, 8] });
/** 写しの規格化: 走行の公転の数・潮汐の写し(τ_T を公転の数で —— 観測の k₂・遅延ではない)・内部熱の緩和の時間(公転の数) */
export const VNORM = Object.freeze({ orbits: 1, tideOrbits: 2, tauTOrbits: 4, coolOrbits: 1, k2: 1, inertia: 'sphere', scanDiv: [1, 2, 4, 8] });
const MAINT = Object.freeze({ mode: 'maintain', reaction: 'background' });

const toyPhysics = (extra) => Object.assign({ coord: '3d', G: 0, D0: 2, kFrame: 0, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, kappaT: 0.0001, cLight: 30, bM: 1, etaRad: 0, pRad: 4,
  gravityX: 0, gravityY: 0, geoPN: 0, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 0.01, stateCarry: 'double', massPrecision: 'double' }, extra || {});
const toyPreset = (bodies, phys) => ({ id: 'w309bToy', name: 'w309b toy', description: '器の中の写し(内蔵ではない)', emoji: '·', group: '運動と時空',
  sampleClass: 'principle', fidelity: 'toy', camera: { scale: 50 }, world: { boundary: 'none', size: 0 }, physics: toyPhysics(phys), bodies });
const axisDeg = (tiltDeg, azimuthDeg) => ({ enable: true, tiltDeg, azimuthDeg, source: 'w309b 器の宣言(診断)' });
/** 核の名前から spinDrag の宣言(核を引数で受ける —— 新しい核は統合の後にここへ足す) */
export function spinDragOf(kernel, hold) {
  const sd = { rot: 'off', axial: 'on' };
  if (kernel === 'mu2') sd.axialCoupling = TOY.kappa; else sd.axialModel = kernel;
  if (hold) sd.axisHold = hold;
  return sd;
}
const dragOf = (kernel, hold) => ({ law: 'inertial', Wbg: TOY.Wbg, eps: TOY.eps, pairs: 'all', spinDrag: spinDragOf(kernel, hold) });
function simOf(H, p) {
  const v = H.HP.validatePreset(clone(p));
  if (!v.ok) throw new Error('validatePreset: ' + JSON.stringify(v.errors || v.err).slice(0, 300));
  const S = H.HP.coord3d.makeSim(); S.build(clone(v.preset));
  return { S, dt: H.evalExpr('appStepDt')(S), preset: v.preset };
}
const holdOf = (H, S) => H.evalExpr('inertialDrag3SpinState')(S).axisHold;
const maintOf = (H, S) => holdOf(H, S).maintain;
const axisOf = (S, k) => [S.sax[k], S.say[k], S.saz[k]];

/* ───────── 3 体の写し(静止 —— G = 0・速度 0) ───────── */
function threeBody(kernel, hold) {
  const bodies = [
    { type: 'single', m: 1, radius: 0.3, x: -1.5, y: 0.4, z: 0.3, vx: 0, vy: 0, vz: 0, spin: 0.6, pinned: false, spinAxis: axisDeg(20, 30) },
    { type: 'single', m: 0.4, radius: 0.2, x: 1.8, y: -0.5, z: -0.6, vx: 0, vy: 0, vz: 0, spin: -0.4, pinned: false },
    { type: 'single', m: 0.7, radius: 0.25, x: 0.2, y: 2.1, z: 0.9, vx: 0, vy: 0, vz: 0, spin: 0.3, pinned: false, spinAxis: axisDeg(50, 100) }];
  return toyPreset(bodies, { relativeDrag: dragOf(kernel, hold) });
}
/** 赤道の歯車の配置: 源(軸 ẑ・自転 0.5)の赤道に傾きを持たない受け手(自転 sRecv)—— ω_D は受け手の軸に沿う符号つきのスカラー */
function gearPair(kernel, sRecv, hold) {
  const bodies = [
    { type: 'single', m: 1, radius: 0.3, x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, spin: 0.5, pinned: true },
    { type: 'single', m: 0.3, radius: 0.2, x: 2, y: 0, z: 0, vx: 0, vy: 0, vz: 0, spin: sRecv, pinned: false }];
  return toyPreset(bodies, { relativeDrag: dragOf(kernel, Object.assign({}, hold, { receivers: [1] })) });
}

/* ───────── A(受理) ───────── */
export function partA(H) {
  const HP = H.HP, base = [{ type: 'single', m: 1, radius: 0.3, x: -2, y: 0, z: 0, vx: 0, vy: 0, vz: 0, spin: 0.5, pinned: false },
    { type: 'single', m: 1, radius: 0.3, x: 2, y: 0, z: 0, vx: 0, vy: 0, vz: 0, spin: 0.5, pinned: false }];
  const tryDecl = (sd) => HP.validatePreset(clone(toyPreset(base, { relativeDrag: { law: 'inertial', Wbg: TOY.Wbg, eps: TOY.eps, pairs: 'all', spinDrag: sd } })));
  const canonOf = (sd) => { const v = tryDecl(sd); return v.ok ? v.preset.physics.relativeDrag.spinDrag : { err: JSON.stringify(v.errors || v.err).slice(0, 160) }; };
  const sph = (h) => ({ rot: 'off', axial: 'on', axialModel: 'sphere', axisHold: h });
  const minimal = canonOf(sph({ mode: 'maintain' }));
  const full = canonOf(sph({ mode: 'maintain', reaction: 'background', heatTiming: { tauHold: 0.5 }, receivers: [2, 0] }));
  const bevel = canonOf({ rot: 'off', axial: 'on', axialModel: 'bevel', axisHold: { mode: 'maintain', heatTiming: 'step' } });
  const driveExplicit = canonOf(sph({ mode: 'drive', tauC: 2 }));
  const driveFull = canonOf(sph({ tauC: 2, reaction: 'source', sourceHold: [1, 0], receivers: [1] }));
  const rejects = {
    maintainTauC: sph({ mode: 'maintain', tauC: 1 }), maintainSourceHold: sph({ mode: 'maintain', sourceHold: [0] }),
    maintainSource: sph({ mode: 'maintain', reaction: 'source' }), maintainUnknown: sph({ mode: 'maintain', gain: 2 }),
    heatTimingBad: sph({ mode: 'maintain', heatTiming: 'event' }), tauHoldZero: sph({ mode: 'maintain', heatTiming: { tauHold: 0 } }),
    tauHoldNaN: sph({ mode: 'maintain', heatTiming: { tauHold: NaN } }), tauHoldExtra: sph({ mode: 'maintain', heatTiming: { tauHold: 1, h: 2 } }),
    receiversEmpty: sph({ mode: 'maintain', receivers: [] }), driveHeatTiming: sph({ tauC: 1, heatTiming: 'step' }),
    driveBackground: sph({ tauC: 1, reaction: 'background' }), modeBad: sph({ mode: 'hold' }),
    maintainAxialOff: { rot: 'surfaceFlip', axial: 'off', axisHold: { mode: 'maintain' } } };
  const rej = {}; for (const [k, sd] of Object.entries(rejects)) rej[k] = !tryDecl(sd).ok;
  return { minimal, full, bevel, driveExplicit, driveFull, rejects: rej, allRejected: Object.values(rej).every(Boolean),
    modes: H.evalExpr('REL_DRAG_AXIS_HOLD_MODES'), keys: H.evalExpr('REL_DRAG_AXIS_HOLD_MAINT_KEYS'), reactions: H.evalExpr('REL_DRAG_AXIS_HOLD_MAINT_REACTIONS'),
    version: H.evalExpr('REL_DRAG_AXIS_HOLD_MAINT_VERSION') };
}

/* ───────── E(エンジンの 1 步 = 参照) ───────── */
/** エンジンの步の和の参照(同じ受け手の順・同じ演算順)—— 步の後の ω_D(核の出力 —— 次の步まで残る)と状態から */
function maintStepRef(S, f, rcv, wt) {
  const n = S.n, W9 = 9, LS = new Float64Array(n * W9), dQ = new Float64Array(n);
  let qS = 0, eaS = 0, esS = 0, epS = 0, suS = 0, awS = 0, fx = 0, fy = 0, fz = 0, ajx = 0, ajy = 0, ajz = 0, sjx = 0, sjy = 0, sjz = 0, nR = 0;
  for (let i = 0; i < n; i++) {
    if (S.pinned[i] || !rcv[i]) continue;
    const flat = (!S.saOn[i] && S._rdWS), wD = [S._rdWX[i], S._rdWY[i], S._rdWZ[i]];
    if (flat ? S._rdWS[i] === 0 : (wD[0] === 0 && wD[1] === 0 && wD[2] === 0)) continue;
    const I = f * S.m[i] * S.R[i] * S.R[i], a = axisOf(S, i), o = i * W9;
    const sp = L.splitDrag(wD, a, flat, flat ? S._rdWS[i] : 0), c = L.restoreCell(I, S.spin[i], a, sp.wp, sp.q);
    LS.set([c.Eax, c.Esp, c.heat, ...c.Jaxis, ...c.Jspeed], o); nR++;
    const h1 = c.heat * wt, e1 = c.Esp * wt;
    dQ[i] = h1; qS += h1; eaS += c.Eax * wt; esS += e1; if (e1 > 0) epS += e1; else suS -= e1; awS += c.axisWork * wt;
    fx -= I * sp.d[0] * wt; fy -= I * sp.d[1] * wt; fz -= I * sp.d[2] * wt;
    ajx += c.Jaxis[0] * wt; ajy += c.Jaxis[1] * wt; ajz += c.Jaxis[2] * wt; sjx += c.Jspeed[0] * wt; sjy += c.Jspeed[1] * wt; sjz += c.Jspeed[2] * wt;
  }
  return { LS, dQ, nR, sums: { Q: qS, Eax: eaS, Esp: esS, EspPos: epS, Sup: suS, AxW: awS, FldLx: fx, FldLy: fy, FldLz: fz, AxJx: ajx, AxJy: ajy, AxJz: ajz, SpJx: sjx, SpJy: sjy, SpJz: sjz } };
}
export function partE(H) {
  const rows = [];
  for (const kernel of KERNELS) for (const hold of [MAINT, { mode: 'maintain', heatTiming: { tauHold: 0.04 } }]) {
    const { S } = simOf(H, threeBody(kernel, hold)), h = TOY.h, f = H.HP.inertialDrag3HoldF(S), wt = L.timingWeight(S._rdHold.heatTiming, h);
    let nd = 0, steps = 0, cmp = 0;
    for (let s = 0; s < 6; s++) {
      const pre = {}; for (const k of H.evalExpr('INERTIAL_DRAG3_MAINT_SC')) pre[k] = S[k];
      const q0 = S._rdMaintQ.slice();
      S.step(h);
      if (S.inertialDrag3MaintN === pre.inertialDrag3MaintN) continue;   // 履歴の無い步(核が走らない)
      steps++;
      const ref = maintStepRef(S, f, S._rdMaintRcv, wt);
      for (let k = 0; k < ref.LS.length; k++) { cmp++; if (!Object.is(S._rdMaintLast[k], ref.LS[k])) nd++; }
      for (let i = 0; i < S.n; i++) { cmp++; if (!Object.is(S._rdMaintQ[i], q0[i] + ref.dQ[i])) nd++; }
      for (const [k, d] of Object.entries(ref.sums)) { cmp++; if (!Object.is(S['inertialDrag3Maint' + k], pre['inertialDrag3Maint' + k] + d)) nd++; }
    }
    rows.push({ kernel, heatTiming: hold.heatTiming || 'step', steps, compared: cmp, nDiff: nd });
  }
  return { rows, allSame: rows.every((r) => r.nDiff === 0 && r.steps > 0) };
}

/* ───────── L(維持の門・表示の門・口座) ───────── */
const ST_ARR = ['x', 'y', 'z', 'vx', 'vy', 'vz', 'spin', 'sax', 'say', 'saz', 'rotA', 'rotAIn', 'rotADr', '_rdMaintQ'];
function stateBits(S, extra = []) { const o = {}; for (const k of ST_ARR.concat(extra)) o[k] = S[k] ? Array.from(S[k].subarray(0, S.n)) : null; return o; }
const sameBits = (a, b) => Object.keys(a).every((k) => (a[k] === null && b[k] === null) || (a[k] && b[k] && a[k].every((x, i) => Object.is(x, b[k][i]))));
export function partL(H, quick) {
  const rows = [], N = quick ? TOY.quickSteps : TOY.steps, h = TOY.h;
  for (const kernel of KERNELS) {
    const { S } = simOf(H, threeBody(kernel, MAINT));
    S.step(h);   // 最初の步(履歴なし)の後を起点に
    const s0 = Array.from(S.spin.subarray(0, S.n)), ax0 = [0, 1, 2].map((k) => axisOf(S, k));
    // 表示の門(1 步): 引きずり軸回転の角の增分 = ω_D∥ h・表示の角の增分 = 慣性 + 引きずり・表示の自転の率 = Ω_I + ω_D∥
    const r0 = { A: Array.from(S.rotA.subarray(0, S.n)), I: Array.from(S.rotAIn.subarray(0, S.n)), D: Array.from(S.rotADr.subarray(0, S.n)) };
    S.step(h);
    let dispDr = 0, dispSum = 0, dispRate = 0;
    for (let i = 0; i < S.n; i++) {
      const a = axisOf(S, i), flat = !S.saOn[i] && S._rdWS, wp = flat ? S._rdWS[i] : dot([S._rdWX[i], S._rdWY[i], S._rdWZ[i]], a);
      const dD = S.rotADr[i] - r0.D[i], dI = S.rotAIn[i] - r0.I[i], dA = S.rotA[i] - r0.A[i];
      dispDr = Math.max(dispDr, rel(dD, wp * h)); dispSum = Math.max(dispSum, Math.abs(dA - dI - dD) / Math.abs(dA)); dispRate = Math.max(dispRate, rel(dA / h, S.spin[i] + wp));
    }
    for (let s = 2; s < N; s++) S.step(h);
    const m = maintOf(H, S);
    const spinSame = s0.every((x, i) => Object.is(x, S.spin[i])), axisSame = ax0.every((a, k) => a.every((x, c) => Object.is(x, axisOf(S, k)[c])));
    const resLRel = norm(m.residual.L) / Math.max(norm(m.field.L), 1e-300), resERel = Math.abs(m.residual.E) / Math.max(m.heat.total, Math.abs(m.field.E), 1e-300);
    const sumQ = m.heat.perBody.reduce((a, b) => a + b, 0);
    let K1 = 0; for (let i = 0; i < S.n; i++) K1 += 0.5 * m.inertia[i] * S.spin[i] * S.spin[i];   // 実際の軸の仕事の丸め床の尺度(自転の運動エネルギー × 復元の回数)
    rows.push({ kernel, steps: N, spinBitSame: spinSame, axisBitSame: axisSame, dispDrRel: e4(dispDr), dispSumRel: e4(dispSum), dispRateRel: e4(dispRate),
      heat: e4(m.heat.total), axisCost: e4(m.heat.axisCost), speedSigned: e4(m.speed.signed), supply: e4(m.speed.supply), axisWorkRel: e4(Math.abs(m.axisWork) / (K1 * m.events)),
      residualLRel: e4(resLRel), residualERel: e4(resERel), perBodySumRel: e4(rel(sumQ, m.heat.total)), fieldL: v4(m.field.L), backgroundL: v4(m.background.L), backgroundE: e4(m.background.E),
      inflowL: v4(m.background.inflowL), outflowL: v4(m.background.outflowL), holdWork: e4(holdOf(H, S).hold.work), axesHeld: holdOf(H, S).hold.axesHeld });
  }
  // reaction "none" と "background" は状態が同じビット(読み口だけが違う)
  const run = (hold) => { const { S } = simOf(H, threeBody('sphere', hold)); for (let s = 0; s < 40; s++) S.step(h); return { S, m: maintOf(H, S) }; };
  const a = run({ mode: 'maintain' }), b = run(MAINT);
  const scA = H.evalExpr('INERTIAL_DRAG3_MAINT_SC').every((k) => Object.is(a.S[k], b.S[k]));
  const noneVsBg = { stateSame: sameBits(stateBits(a.S), stateBits(b.S)) && scA, noneBackground: a.m.background, bgHas: !!b.m.background };
  return { rows, noneVsBg };
}

/* ───────── T(dt の走査 —— エンジン) ───────── */
function scanRun(H, preset, h, N) {
  const { S } = simOf(H, preset);
  S.step(h);   // 履歴の步(熱なし)
  const q0 = S.inertialDrag3MaintQ, ax0 = S.inertialDrag3MaintEax, es0 = S.inertialDrag3MaintEsp, w0 = S.inertialDrag3MaintW;
  for (let s = 0; s < N; s++) S.step(h);
  return { heat: S.inertialDrag3MaintQ - q0, Eax: S.inertialDrag3MaintEax - ax0, Esp: S.inertialDrag3MaintEsp - es0, events: S.inertialDrag3MaintW - w0, S };
}
export function partT(H) {
  const rows = [], h0 = TOY.h, T = TOY.scanSteps * h0;
  for (const kernel of KERNELS) {
    const base = {};
    for (const div of TOY.scanDiv) {
      const h = h0 / div, N = TOY.scanSteps * div;
      const st = scanRun(H, threeBody(kernel, MAINT), h, N), th = scanRun(H, threeBody(kernel, { mode: 'maintain', reaction: 'background', heatTiming: { tauHold: h0 } }), h, N);
      if (div === 1) { base.st = st.heat; base.th = th.heat; }
      rows.push({ kernel, div, h, steps: N, time: e4(N * h), heatStep: st.heat, heatHold: th.heat, eventsStep: st.events, eventsHold: e4(th.events),
        stepRatio: st.heat / base.st, holdRatio: th.heat / base.th, rateStep: e4(st.heat / (N * h)), rateHold: e4(th.heat / (N * h)), axisShare: e4(st.Eax / st.heat) });
    }
  }
  // 赤道の歯車の配置(傾きを持たない受け手 —— 軸のコスト 0・熱は max(E_speed, 0))
  const gear = [];
  for (const kernel of KERNELS) for (const sR of [0.4, -0.4]) {
    const { S } = simOf(H, gearPair(kernel, sR, MAINT));
    S.step(h0); S.step(h0);
    const m = maintOf(H, S), last = m.lastStep[1], sig = S._rdWS[1];
    gear.push({ kernel, recvSpin: sR, sigma: e4(sig), sigmaOverSpin: e4(sig / sR), Eaxis: last[0], Espeed: e4(last[1]), heat: e4(last[2]), supply: e4(m.speed.supply), heatTotal: e4(m.heat.total),
      axisZero: last[0] === 0, heatIsPosSpeed: last[2] === Math.max(last[1], 0) });
  }
  return { T, h0, rows, gear };
}

/* ───────── V(金星・木星の写し) ───────── */
function presetOf(HP, id) { const p = HP.allPresets().find((q) => q.id === id); if (!p) throw new Error('本が無い: ' + id); return clone(p); }
/** 写し: 軸引きずり kernel(A = 1)× axisHold(hold)・宣言の傾きのまま。opts.tide: 惑星だけ明示潮汐(規格化)+ 内部熱 / opts.flat: 惑星の傾きを外す */
function planetCopy(H, key, kernel, hold, opts = {}) {
  const p = presetOf(H.HP, BOOKS[key]);
  p.id = 'w309b_' + key; delete p.abBody; delete p.fitRecord;
  const tp = p.timeRef.pRef, n = 2 * Math.PI / tp, sun = p.bodies[0], pl = p.bodies[1], G = p.physics.G;
  const r0 = norm(sub([pl.x, pl.y, pl.z], [sun.x, sun.y, sun.z]));
  if (opts.flat) delete pl.spinAxis;
  p.physics = { ...p.physics, relativeDrag: { ...p.physics.relativeDrag, spinDrag: spinDragOf(kernel, hold) } };
  let lag = null;
  if (opts.tide) {
    const I = 0.4 * pl.m * pl.radius * pl.radius, tauT = VNORM.tauTOrbits * tp;
    lag = I * Math.pow(r0, 6) / (tauT * 3 * G * VNORM.k2 * sun.m * sun.m * Math.pow(pl.radius, 5));
    pl.tide = { k2: VNORM.k2, lag };
    p.physics.tide = { maxN: 4, inertia: VNORM.inertia, heat: { model: 'linear', tau: VNORM.coolOrbits * tp } };
  }
  return { p, n, tp, r0, lag };
}
function runCopy(H, key, kernel, hold, orbits, opts = {}) {
  const c = planetCopy(H, key, kernel, hold, opts);
  const { S, dt } = simOf(H, c.p);
  const h = dt / (opts.div || 1), steps = Math.round(orbits * c.tp / h);
  const s0 = Array.from(S.spin.subarray(0, S.n)), ax0 = [0, 1].map((k) => axisOf(S, k));
  S.step(h);   // 履歴の步(核が走らない —— 熱なし)の後から数える(刻みを変えても同じ時間に同じ数の步)
  let wPar = [0, 0], wPerp = [0, 0], nW = 0;
  for (let s = 1; s <= steps; s++) {
    S.step(h);
    if (S._rdWX) for (let i = 0; i < 2; i++) {   // ω_D の大きさ(平行・垂直)の 1 公転の平均
      const a = axisOf(S, i), flat = !S.saOn[i] && S._rdWS, wD = [S._rdWX[i], S._rdWY[i], S._rdWZ[i]];
      const sp = L.splitDrag(wD, a, flat, flat ? S._rdWS[i] : 0);
      wPar[i] += Math.abs(sp.wp); wPerp[i] += norm(sp.q); if (i === 1) nW++;
    }
  }
  return { c, S, h, steps, s0, ax0, wPar: wPar.map((x) => x / Math.max(nW, 1)), wPerp: wPerp.map((x) => x / Math.max(nW, 1)) };
}
export function partV(H, quick) {
  const out = { rows: [], scan: [], tide: [] }, orbits = VNORM.orbits;
  for (const key of Object.keys(BOOKS)) for (const kernel of KERNELS) {
    const r = runCopy(H, key, kernel, MAINT, orbits), m = maintOf(H, r.S), S = r.S, f = H.HP.inertialDrag3HoldF(S), lastE = [0, 0];
    const spinSame = r.s0.every((x, i) => Object.is(x, S.spin[i])), axisSame = r.ax0.every((a, k) => a.every((x, cc) => Object.is(x, axisOf(S, k)[cc])));
    for (const i of [0, 1]) {
      const I = f * S.m[i] * S.R[i] * S.R[i], W = Math.abs(S.spin[i]), K = 0.5 * I * W * W, Q = m.heat.perBody[i];
      // 受け手ごとの口座(1 步の量の和は読み口の合計にしか無い —— 受け手ごとの熱と、1 步の量から軸のコストの割合を読む)
      const last = m.lastStep[i];
      lastE[i] = last[1];
      out.rows.push({ book: key, kernel, body: i === 0 ? 'sun' : 'planet', spin: e4(S.spin[i]), wParOverSpin: e4(r.wPar[i] / W), wPerpOverSpin: e4(r.wPerp[i] / W),
        heatPerOrbit: e4(Q / orbits), heatOverSpinK: e4(Q / orbits / K), heatRate: e4(Q / (orbits * r.c.tp)),
        lastAxisShare: e4(last[2] > 0 ? last[0] / last[2] : 0), lastEspeed: e4(last[1]), lastSign: Math.sign(last[1]) });
    }
    out.rows.push({ book: key, kernel, body: 'total', heatPerOrbit: e4(m.heat.total / orbits), axisCost: e4(m.heat.axisCost), speedSigned: e4(m.speed.signed), supply: e4(m.speed.supply),
      speedSunOverPlanet: e4(lastE[0] / lastE[1]), bgL: e4(norm(m.background.L)), bgLOverJ: e4(norm(m.background.L) / (f * S.m[1] * S.R[1] * S.R[1] * Math.abs(S.spin[1]))), bgE: e4(m.background.E),
      residualLRel: e4(norm(m.residual.L) / Math.max(norm(m.field.L), 1e-300)), residualERel: e4(Math.abs(m.residual.E) / Math.max(m.heat.total, Math.abs(m.field.E), 1e-300)),
      spinBitSame: spinSame, axisBitSame: axisSame, steps: r.steps, h: e4(r.h) });
  }
  // dt の走査(1 公転・sphere): "step" は 1/h・{tauHold: h₀} は刻みに依らない(軌道の標本の違いの分だけ —— 数で)
  for (const key of Object.keys(BOOKS)) {
    const base = {};
    for (const div of (quick ? [1, 2] : VNORM.scanDiv)) {
      const a = runCopy(H, key, 'sphere', MAINT, orbits, { div }), h0 = a.h * div;
      const b = runCopy(H, key, 'sphere', { mode: 'maintain', reaction: 'background', heatTiming: { tauHold: h0 } }, orbits, { div });
      const qa = maintOf(H, a.S).heat.total, qb = maintOf(H, b.S).heat.total;
      if (div === 1) { base.a = qa; base.b = qb; }
      out.scan.push({ book: key, div, steps: a.steps, heatStep: e4(qa), heatHold: e4(qb), stepRatio: e4(qa / base.a), holdRatio: e4(qb / base.b), holdDevRel: e4(rel(qb, base.b)) });
    }
  }
  // 潮汐の内部熱へ入れる写し(金星・木星 —— 惑星は傾きを外す・規格化した CTL・内部熱の線形の緩和): 維持の熱が E_i へ・潮汐の入力とは別の欄・自転の変化 = 潮汐の力積
  for (const key of Object.keys(BOOKS)) {
    const r = runCopy(H, key, 'sphere', MAINT, quick ? 1 : VNORM.tideOrbits, { tide: true, flat: true }), S = r.S, m = maintOf(H, S), ts = H.HP.tideState(S), ih = ts.internalHeat;
    const k = ih.receivers.indexOf(1), I = H.evalExpr('tideInertiaOf')(S, 1);
    const dJ = I * (S.spin[1] - r.s0[1]), tdj = S.tideDJx ? S.tideDJz[1] : S.tideDJ[1];
    out.tide.push({ book: key, orbits: quick ? 1 : VNORM.tideOrbits, maintainInput: e4(ih.maintainInput[k]), tideInput: e4(ih.input[k]), E: e4(ih.E[k]), radiated: e4(ih.radiated[k]),
      residualRel: e4(Math.abs(ih.residual[k]) / Math.max(ih.input[k] + ih.maintainInput[k], 1e-300)), toInternal: e4(m.heat.toInternal), toLedger: e4(m.heat.toLedger),
      sink: m.heat.sink, maintOverTide: e4(ih.maintainInput[k] / ih.input[k]), spinChangeRel: e4((S.spin[1] - r.s0[1]) / r.s0[1]),
      spinVsTideRel: e4(Math.abs(dJ - tdj) / Math.max(Math.abs(tdj), 1e-300)), tideHeat: e4(ts.heat), inputMinusHeat: e4(ih.inputMinusHeat) });
  }
  return { orbits, norm: VNORM, ...out };
}

/* ───────── D(τ_C の駆動の型との比較 —— 比較の写し) ───────── */
export function partD(H, quick) {
  const rows = [];
  // 3 体の写し(静止): 同じ 200 步
  const N = quick ? 60 : 200, h = TOY.h;
  for (const [label, hold] of [['drive-none', { tauC: 0.7 }], ['drive-source', { tauC: 0.7, reaction: 'source' }], ['maintain', MAINT]]) {
    const { S } = simOf(H, threeBody('sphere', hold));
    const s0 = Array.from(S.spin.subarray(0, S.n));
    for (let s = 0; s < N; s++) S.step(h);
    const hs = holdOf(H, S), m = hs.maintain || null;
    rows.push({ copy: 'toy3', mode: label, steps: N, dSpinRel: S.spin.subarray(0, S.n).length ? Array.from(S.spin.subarray(0, S.n)).map((x, i) => e4((x - s0[i]) / s0[i])) : null,
      Ereq: e4(hs.Ereq), heat: m ? e4(m.heat.total) : null, supply: m ? e4(m.speed.supply) : null, driveL: v4(hs.driveL), reactL: v4(hs.reactL), bgL: m ? v4(m.background.L) : null });
  }
  // 金星・木星の写し(sphere・宣言の傾き): 1 公転 —— τ_C = 公転周期(比較の宣言)・receivers:[惑星]
  for (const key of Object.keys(BOOKS)) {
    const tp = presetOf(H.HP, BOOKS[key]).timeRef.pRef;
    for (const [label, hold] of [['drive-none', { tauC: tp, receivers: [1] }], ['drive-source', { tauC: tp, reaction: 'source', receivers: [1] }], ['maintain', { mode: 'maintain', reaction: 'background', receivers: [1] }]]) {
      const r = runCopy(H, key, 'sphere', hold, 1), S = r.S, hs = holdOf(H, S), m = hs.maintain || null;
      rows.push({ copy: key, mode: label, steps: r.steps, dSpinRel: [0, 1].map((i) => e4((S.spin[i] - r.s0[i]) / r.s0[i])), Ereq: e4(hs.Ereq), heat: m ? e4(m.heat.total) : null,
        supply: m ? e4(m.speed.supply) : null, driveL: v4(hs.driveL), reactL: v4(hs.reactL), bgL: m ? v4(m.background.L) : null });
    }
  }
  return { rows };
}

/* ───────── K(状態の契約) ───────── */
export function partK(H, quick) {
  const snapF = H.evalExpr('ckSnapOne'), restF = H.evalExpr('ckRestoreOne'), SC = H.evalExpr('INERTIAL_DRAG3_MAINT_SC').concat(H.evalExpr('INERTIAL_DRAG3_HOLD_SC'));
  const rows = [];
  const cases = [['toy3', () => ({ ...simOf(H, threeBody('sphere', MAINT)), h: TOY.h })],
    ['venusTide', () => { const c = planetCopy(H, 'venus', 'sphere', MAINT, { tide: true, flat: true }); const r = simOf(H, c.p); return { ...r, h: r.dt }; }]];
  for (const [label, mk] of cases) {
    const { S, h } = mk(), n1 = quick ? 20 : 100, n2 = quick ? 20 : 100;
    for (let k = 0; k < n1; k++) S.step(h);
    const ck = snapF(S);
    for (let k = 0; k < n2; k++) S.step(h);
    const AR = ST_ARR.concat(S.tideEi ? ['tideEi', 'tideRad', 'tideHin'] : []);
    const after = {}; for (const k of AR) after[k] = S[k] ? Array.from(S[k].subarray(0, S.n)) : null;
    const sc = {}; for (const k of SC) sc[k] = S[k];
    restF(S, ck);
    for (let k = 0; k < n2; k++) S.step(h);
    let d = 0; for (const k of AR) if (after[k]) for (let i = 0; i < S.n; i++) if (!Object.is(after[k][i], S[k][i])) d++;
    for (const k of SC) if (!Object.is(sc[k], S[k])) d++;
    rows.push({ copy: label, steps: [n1, n2], nDiff: d, keys: AR.length + SC.length });
  }
  return { rows, allSame: rows.every((r) => r.nDiff === 0) };
}
/* ───────── S(步で変わる鍵の登録・宣言しない本に鍵が無い) ───────── */
export function partS(H) {
  const SC = H.evalExpr('INERTIAL_DRAG3_SC'), SA = H.evalExpr('INERTIAL_DRAG_CK_SAMPLES'), SCR = H.evalExpr('SIM_STEP_SCRATCH'), SBR = H.evalExpr('SIM_BUILD_RESET');
  const re = /^(inertialDrag3Maint|_rdMaint)/;
  const { S } = simOf(H, threeBody('bevel', MAINT));
  const snap = (Z) => Object.fromEntries(Object.keys(Z).filter((k) => re.test(k)).map((k) => [k, ArrayBuffer.isView(Z[k]) ? Array.from(Z[k]) : Z[k]]));
  const a0 = snap(S); for (let k = 0; k < 6; k++) S.step(TOY.h); const a1 = snap(S);
  const changed = Object.keys(a1).filter((k) => JSON.stringify(a0[k]) !== JSON.stringify(a1[k]));
  const miss = changed.filter((k) => SC.indexOf(k) < 0 && SA.indexOf(k) < 0 && SCR.indexOf(k) < 0);
  const g = SBR.find((z) => z.feature === 'inertialDrag');
  const resetCovers = !!(g && g.re && g.re.test('_rdMaintQ') && g.re.test('_rdMaintLast') && g.re.test('inertialDrag3MaintQ'));
  // 宣言しない本(第308便b の駆動の型・在位の 🪛)に維持の型の鍵が無い
  const d = simOf(H, threeBody('sphere', { tauC: 0.5 })).S; d.step(TOY.h); d.step(TOY.h);
  const tilt = H.HP.allPresets().find((z) => z.id === 'chainDiskToy3dTilt'), S2 = H.HP.coord3d.makeSim(); S2.build(clone(H.HP.validatePreset(clone(tilt)).preset)); S2.step(0.016); S2.step(0.016);
  const leak = Object.keys(d).filter((k) => re.test(k) && d[k] !== undefined).concat(Object.keys(S2).filter((k) => re.test(k) && S2[k] !== undefined));
  return { changed: changed.length, miss, resetCovers, leak, spinPrec: S.spinPrec, tiltSpinPrec: S2.spinPrec };
}

/* ───────── 門と表 ───────── */
export function gatesOf(J) {
  const g = {};
  g.pure = J.P.pass;
  g.acceptCanon = J.A.allRejected && JSON.stringify(J.A.minimal.axisHold) === JSON.stringify({ mode: 'maintain', reaction: 'none', heatTiming: 'step' })
    && JSON.stringify(J.A.full.axisHold) === JSON.stringify({ mode: 'maintain', reaction: 'background', heatTiming: { tauHold: 0.5 }, receivers: [0, 2] })
    && JSON.stringify(J.A.driveExplicit.axisHold) === JSON.stringify({ tauC: 2, reaction: 'none' });
  g.engineEqualsRef = J.E.allSame;
  g.maintainGate = J.L.rows.every((r) => r.spinBitSame && r.axisBitSame) && J.V.rows.filter((r) => r.body === 'total').every((r) => r.spinBitSame && r.axisBitSame);
  g.displayGate = J.L.rows.every((r) => r.dispDrRel < 1e-12 && r.dispSumRel < 1e-9 && r.dispRateRel < 1e-9);
  g.accounts = J.L.rows.every((r) => r.residualLRel < 1e-13 && r.residualERel < 1e-13 && r.axisWorkRel < 1e-12) && J.L.noneVsBg.stateSame && J.L.noneVsBg.noneBackground === null && J.L.noneVsBg.bgHas;
  g.stepInvH = J.T.rows.every((r) => Math.abs(r.stepRatio - r.div) < 1e-12 * r.div);
  g.holdInvariant = J.T.rows.every((r) => Math.abs(r.holdRatio - 1) < 1e-12);
  g.gearAxisZero = J.T.gear.length >= 4 && J.T.gear.every((r) => r.axisZero && r.heatIsPosSpeed);
  g.checkpoint = J.K.allSame;
  g.stateContract = J.S.changed > 0 && J.S.miss.length === 0 && J.S.resetCovers && J.S.leak.length === 0 && J.S.spinPrec === 'double' && J.S.tiltSpinPrec === 'single';
  g.tideSink = J.V.tide.length >= 2 && J.V.tide.every((r) => r.residualRel < 1e-9 && r.spinVsTideRel < 1e-9 && r.toInternal >= 0) && J.V.tide.some((r) => r.toInternal > 0);
  g.copyAccounts = J.V.rows.filter((r) => r.body === 'total').every((r) => r.residualLRel < 1e-12 && r.residualERel < 1e-12);
  g.driveCompare = J.D.rows.filter((r) => r.mode === 'maintain').every((r) => r.dSpinRel.every((x) => x === 0));
  return g;
}
const f4 = (x) => (x === null || x === undefined) ? '—' : (typeof x === 'number' ? (Number.isInteger(x) ? String(x) : Number(x.toPrecision(4)).toString()) : String(x));
/** PHYSICS〔第309便b〕の表(正本から作る —— QA docs.maintain309 が同じ関数で作り直して逐語照合) */
export function physicsTables(J) {
  const L1 = ['| h | 時間 1 の步の数 | 熱(1 步の型) | 熱(τ_hold = 1 の型) | 復元を 1 步の平均のトルクとして読む大きさ |', '|---|---|---|---|---|'];
  for (const r of J.P.values.scan) L1.push(`| ${f4(r.h)} | ${f4(1 / r.h)} | ${f4(r.heatStep)} | ${f4(r.heatHold)} | ${f4(r.torque)} |`);
  const L2 = ['| 核 | h/h₀ | 步の数 | 熱の比(1 步の型) | 熱の比(τ_hold = h₀ の型) | 軸のコストの割合 |', '|---|---|---|---|---|---|'];
  for (const r of J.T.rows) L2.push(`| ${r.kernel} | 1/${r.div} | ${r.steps} | ${f4(r.stepRatio)} | ${f4(r.holdRatio)} | ${f4(r.axisShare)} |`);
  const L3 = ['| 核 | 受け手の自転 | σ/自転 | E_axis^cost | E_speed | 熱 | 供給 |', '|---|---|---|---|---|---|---|'];
  for (const r of J.T.gear) L3.push(`| ${r.kernel} | ${f4(r.recvSpin)} | ${f4(r.sigmaOverSpin)} | ${f4(r.Eaxis)} | ${f4(r.Espeed)} | ${f4(r.heat)} | ${f4(r.supply)} |`);
  const L4 = ['| 写し | 核 | 天体 | abs(ω_D∥)/abs(Ω_I) | abs(ω_D⊥)/abs(Ω_I) | 熱/公転 | 熱/(½IΩ_I²)/公転 | 直近の步の軸のコストの割合 | 直近の步の E_speed の符号 |', '|---|---|---|---|---|---|---|---|---|'];
  for (const r of J.V.rows) if (r.body !== 'total') L4.push(`| ${r.book} | ${r.kernel} | ${r.body} | ${f4(r.wParOverSpin)} | ${f4(r.wPerpOverSpin)} | ${f4(r.heatPerOrbit)} | ${f4(r.heatOverSpinK)} | ${f4(r.lastAxisShare)} | ${f4(r.lastSign)} |`);
  const L5 = ['| 写し | 核 | 熱/公転 | 軸のコスト | E_speed(符号つきの和) | 直近の步の E_speed の太陽/惑星 | 供給 | 背景の L の大きさ | 背景の L/(I_惑星 abs(Ω_I)) | 背景の E | 口座の残り L | 口座の残り E |', '|---|---|---|---|---|---|---|---|---|---|---|---|'];
  for (const r of J.V.rows) if (r.body === 'total') L5.push(`| ${r.book} | ${r.kernel} | ${f4(r.heatPerOrbit)} | ${f4(r.axisCost)} | ${f4(r.speedSigned)} | ${f4(r.speedSunOverPlanet)} | ${f4(r.supply)} | ${f4(r.bgL)} | ${f4(r.bgLOverJ)} | ${f4(r.bgE)} | ${f4(r.residualLRel)} | ${f4(r.residualERel)} |`);
  const L6 = ['| 写し | h/h₀ | 步の数 | 熱の比(1 步の型) | 熱の比(τ_hold = h₀ の型) |', '|---|---|---|---|---|'];
  for (const r of J.V.scan) L6.push(`| ${r.book} | 1/${r.div} | ${r.steps} | ${f4(r.stepRatio)} | ${f4(r.holdRatio)} |`);
  const L7 = ['| 写し | 型 | 太陽の自転の相対の変化 | 惑星の自転の相対の変化 | 別に要るエネルギー | 維持の熱 | 供給 |', '|---|---|---|---|---|---|---|'];
  for (const r of J.D.rows) if (r.copy !== 'toy3') L7.push(`| ${r.copy} | ${r.mode} | ${f4(r.dSpinRel[0])} | ${f4(r.dSpinRel[1])} | ${f4(r.Ereq)} | ${f4(r.heat)} | ${f4(r.supply)} |`);
  const L8 = ['| 写し | 公転 | 維持の熱の入力 | 潮汐の入力 | 維持/潮汐 | E_i | 放射 | E_i の残り(相対) | 自転の変化 − 潮汐の力積(相対) |', '|---|---|---|---|---|---|---|---|---|'];
  for (const r of J.V.tide) L8.push(`| ${r.book} | ${r.orbits} | ${f4(r.maintainInput)} | ${f4(r.tideInput)} | ${f4(r.maintOverTide)} | ${f4(r.E)} | ${f4(r.radiated)} | ${f4(r.residualRel)} | ${f4(r.spinVsTideRel)} |`);
  return [L1, L2, L3, L4, L5, L6, L7, L8].map((x) => x.join('\n')).join('\n\n');
}
export function docNumbers(J) {
  const ex = J.P.values.example;
  return [f4(ex.Eax1), f4(ex.Esp2), f4(J.L.rows[0].residualLRel), f4(J.L.rows[0].residualERel), f4(J.L.rows[0].axisWorkRel)];
}
export function runAll(H, { quick = false } = {}) {
  const t = {};
  let t0 = Date.now();
  const lap = (k) => { t[k] = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now(); };
  const P = L.checksOf(); lap('P');
  const A = partA(H); lap('A');
  const E = partE(H); lap('E');
  const Lb = partL(H, quick); lap('L');
  const T = partT(H); lap('T');
  const K = partK(H, quick); lap('K');
  const Sx = partS(H); lap('S');
  const D = partD(H, quick); lap('D');
  const V = partV(H, quick); lap('V');
  const J = { quick, toy: TOY, P, A, E, L: Lb, T, K, S: Sx, D, V };
  J.gates = gatesOf(J);
  J.ok = Object.values(J.gates).every(Boolean);
  J.timing = t;
  return J;
}
export async function main() {
  const TARGET = process.env.W309B_TARGET || 'beta/index.html';
  const OUT = process.env.W309B_OUT || path.join(ROOT, 'tests', 'out', 'maintain-w309b.json');
  const quick = process.env.W309B_QUICK === '1';
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now();
  const W281A_SCOPE = w281aScopeStamp(html, REGEN_SCOPE);
  const H = loadHtmlHeadless(html);
  pinDecl315c(H.evalExpr);   // 第315便c(AN406): 在位の 7 本の宣言を移行の前の写しへ(本ごとの門 —— 基点の html では no-op・正本の欄は足さない)
  const R = runAll(H, { quick });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w309b-maintain.mjs', target: TARGET,
    targetSha256: crypto.createHash('sha256').update(fs.readFileSync(html)).digest('hex'),
    ruling: '原仮定者の裁定(第103報)AN356・AN358・(第104報)AN362・統括の検証項目 R219',
    maintainVersion: H.evalExpr('REL_DRAG_AXIS_HOLD_MAINT_VERSION'), ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w309b-maintain.mjs', 'tests/lib-w315c-legacy7.mjs', 'tests/lib-w309b-maintain.mjs', 'tests/lib-w308b-hold.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第309便b', target: TARGET, code: CODE, inputs: [TARGET, LEGACY7_DATA_FILE] }), {
    harnessVersion: HARNESS_VERSION,
    engine: 'Node の headless(tests/lib-w279b-headless.mjs の loadHtmlHeadless —— html の本文をそのまま実行・1 プロセス)',
    notClaim: ['帳簿が完全に閉じた', '熱を説明した', 'τ_hold を導いた', 'イオの加熱を説明した', '軸のコストはトルクの実際の仕事', '背景の口座は遠方宇宙の物理の経路'] });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s', JSON.stringify(out.timing));
}
if (IS_MAIN) await main();
