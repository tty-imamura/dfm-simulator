// 第307便b(原仮定者の裁定(第100報)「潮汐のブレーキが効く相手は慣性軸回転そのもの。ブレーキで失われる回転のエネルギーは潮汐加熱として内部熱になる。
// 増え続けるので放射も必要」・決断事項 AN345 ③⑤・統括の検証項目 R210): **三次元の明示潮汐(定時間遅延 CTL のベクトル形)と天体の内部熱・放射の器**。
//
// Node だけ(対象 html の inline script を tests/lib-w279b-headless.mjs の loadHtmlHeadless で読み、html の validatePreset・coord3d.makeSim・build・step・
// tideEvalRates3・tideState・tideHeatAdvance をそのまま呼ぶ)。純関数は tests/lib-w307b-tide3d.mjs(エンジンと同じ式・同じ演算順)。
// **在位の本の宣言は変えない** —— 写しはすべて器の中で組む(潮汐を宣言した在位の本は無い)。
//
// ■ 段
//   P(純関数): 二次元の極限(tests/lib-w292d-tide.mjs の ctlPair とビット同一)・非共面の仕事と熱の恒等式・角運動量の交換・回転の共変性・円軌道の解析式と符号・
//     内部熱の 1 区間(非負・収支・半歩 2 回・級数の継ぎ目・定常 E → Hτ)・定義域。
//   E(エンジンの 1 回の評価 = 純関数): 非共面の 3 体(軸を動かせる傾いた受け手・傾きの無い受け手・受けない点質量)で tideEvalRates3 の力・トルク・発熱率が lib とビット同一。
//   Z(二次元の極限のエンジン): 二次元の潮汐の本の写しと同じ本の physics.coord:"3d" が x・y・vx・vy・spin・rotA・t・帳簿でビット同一
//     (semi/leapfrog × split full/half・inertia sphere・内部熱あり)。内部熱は力学に戻らない(内部熱の有無で軌道と自転がビット同一 —— 二次元と三次元)。
//   L(非共面の帳簿): 軌道が赤道に 25° 傾いた惑星–衛星(衛星は軸を動かせる受け手・惑星は傾きの無い受け手)—— 仕事と熱の恒等式・角運動量の帳簿(成分ごと)・
//     全角運動量(軌道 + 慣性自転 I s â)の保存(動かさなかった τ⊥ の力積を足して)・力学的エネルギー + 熱。
//   C(回転の共変性): 同じ配置を回して走らせ R⁻¹ で戻す(位置・速度・自転・軸)。
//   K(状態の契約): チェックポイントの往復(保存 → 走行 → 復帰 → 同じ走行)で全状態と帳簿・内部熱がビット同一。
//   H(内部熱と放射): 発熱率を一定に置いた 1 歩と半歩 2 回(エンジンの tideHeatAdvance)・長い走行で E ≥ 0・収支・Σ入力 = tideHeat・τ_cool ≪ 走行で放射の率 → 発熱率。
//   S(同期へ向かう時間発展): 惑星–衛星の写し(G = 1 の規格化)で慣性自転が公転 n へ向かう(速い順行は減速・遅い順行と逆行は加速)・傾いた軸は軌道の法線へ・
//     軸を動かせない受け手は τ⊥ を数えて回さない。
//   R(規格化した率): 🌋(太陽–金星)・🏀(太陽–木星)・木星–イオ(🏀 の木星 + 🟠 の宣言のイオを木星の赤道面へ)・太陽–木星–イオ —— k₂ = 1・Δt = 1 s の規格化
//     (観測の k₂・遅延ではない)で慣性自転へのブレーキの角加速度と発熱率(SI)。イオの配置は診断の配置(同じ元期の暦ではない)。
//   X(velocity:"xdot" の三次元): 🌋 の写し(慣性決定力あり)で混合の帳簿を含む恒等式。
//
// ■ 言わないこと: 「金星の逆行を説明した」「イオの加熱を再現した」「自転が釣り合った」「観測の 1σ で較正済み」「熱力学を導いた」(器は規格化した率と帳簿を測るだけ)。
//
// ■ 使い方
//   node tests/exp-w307b-tide3d.mjs   → 正本 tests/out/tide3d-w307b.json(段 tide3d-307b)
//   W307B_OUT=<json> で出力先を変える(試走は正本を書かない)・W307B_TARGET=<html>(既定 beta/index.html)・W307B_QUICK=1(步を縮める —— 煙試験の窓。正本は書かない用途)。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlHeadless } from './lib-w279b-headless.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as L from './lib-w307b-tide3d.mjs';
import { ctlPair } from './lib-w292d-tide.mjs';
import { pinDecl315c, LEGACY7_DATA_FILE } from './lib-w315c-legacy7.mjs';   // 第315便c(決断事項 AN406・R244): 在位の 7 本を K1 へ移した世代では、この器は移行の前(af2f426)の宣言の写しで測る
// 第281便a の領域 hash の宣言(器と lib から引いた下限 + 写しの本 3 本)
const REGEN_SCOPE = {"presets":["jupiterGalilean","jupiterSunInertial3d","venusSunInertial3d"],"roots":["$","CK_ARRS","CK_SC","HP.allPresets","HP.coord3d","HP.tideEvalRates3","HP.tideHeatAdvance","HP.tideState","HP.validatePreset","T","TIDE3_STEP_VERSION","TIDE_HEAT_VERSION","ckRestoreOne","ckSnapOne","ctx"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w307b-tide3d-1';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (o) => JSON.parse(JSON.stringify(o));
const { dot, cross, add, sub, scale, norm, unit } = L;

/** 写しの本(宣言から探す —— 在位の本の宣言は変えない) */
export const BOOKS = Object.freeze({ venus: 'venusSunInertial3d', jupiter: 'jupiterSunInertial3d', galilean: 'jupiterGalilean' });
/** 規格化(k₂ = 1・Δt = 1 s —— 観測の値ではない)と慣性の因子(一様球 ⅖mR² —— 診断の仮定) */
export const NORM = Object.freeze({ k2: 1, lagSec: 1, inertia: 'sphere' });
/** G = 1 の規格化の写し(惑星–衛星) */
export const TOY = Object.freeze({ M: 1, m: 0.01, Rp: 0.3, Rs: 0.1, a: 2, k2: 0.5, lag: 0.5, k2p: 0.3, lagp: 0.05, stepsPerOrbit: 360 });
export const SYNC = Object.freeze({ tauMult: 3, samples: 24 });
export const ROT = Object.freeze({ axis: [0.3, -0.7, 0.4], angle: 0.83 });

const toyPhysics = (extra) => Object.assign({ G: 1, D0: 2, kFrame: 0, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, kappaT: 0.0001, cLight: 30, bM: 1, etaRad: 0, pRad: 4,
  gravityX: 0, gravityY: 0, geoPN: 0, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 0.01, stateCarry: 'double', massPrecision: 'double' }, extra || {});
const toyPreset = (bodies, phys, integrator) => Object.assign({ id: 'w307bToy', name: 'w307b toy', description: '器の中の写し(内蔵ではない)', emoji: '·', group: '運動と時空',
  sampleClass: 'principle', fidelity: 'toy', camera: { scale: 50 }, world: { boundary: 'none', size: 0 }, physics: toyPhysics(phys), bodies }, integrator ? { integrator } : {});
function simOf(HP, p) {
  const v = HP.validatePreset(clone(p));
  if (!v.ok) throw new Error('validatePreset: ' + JSON.stringify(v.errors).slice(0, 300));
  const S = HP.coord3d.makeSim(); S.build(clone(v.preset));
  return { S, warnings: v.warnings || [] };
}
const axisDeg = (tiltDeg, azimuthDeg) => ({ enable: true, tiltDeg, azimuthDeg, source: 'w307b 器の宣言(診断)' });
const KEYS2 = ['x', 'y', 'vx', 'vy', 'spin', 'rotA'];
const KEYS3 = ['x', 'y', 'z', 'vx', 'vy', 'vz', 'spin', 'rotA', 'sax', 'say', 'saz'];
const TIDE_SC = ['tideWork', 'tideWorkCons', 'tideHeat', 'tideMix', 'tideDL', 'tideN', 'tideSubsteps'];
function nDiff(A, B, keys, n) { let d = 0; for (const k of keys) for (let i = 0; i < n; i++) if (!Object.is(A[k][i], B[k][i])) d++; return d; }
const rel = (a, b) => Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b), 1e-300);
const e3 = (v) => Number(v.toExponential(3));

/* ───────── 写しの組み立て ───────── */
/** 惑星–衛星の円軌道(重心系)。incl: 軌道面の傾き(x 軸まわり —— 度)。sat/planet の自転と軸・受け手の宣言 */
export function toyPair({ incl = 0, satSpin, satAxis = null, planetSpin = 0.2, planetAxis = null, planetTide = true, satTide = true, heat = null, coolTau = null, coord = '3d', split = null, inertia = 'sphere', integrator = null, k2 = TOY.k2, lag = TOY.lag }) {
  const { M, m, a } = TOY, n = Math.sqrt((M + m) / (a * a * a)), v = n * a, ci = Math.cos(incl * Math.PI / 180), si = Math.sin(incl * Math.PI / 180);
  const xp = -a * m / (M + m), xs = a * M / (M + m), vp = -v * m / (M + m), vs = v * M / (M + m);
  const P = { type: 'single', m: M, radius: TOY.Rp, x: xp, y: 0, vx: 0, vy: vp * ci, spin: planetSpin, pinned: false };
  const Sx = { type: 'single', m, radius: TOY.Rs, x: xs, y: 0, vx: 0, vy: vs * ci, spin: satSpin, pinned: false };
  if (coord === '3d') { P.z = 0; P.vz = vp * si; Sx.z = 0; Sx.vz = vs * si; }
  if (planetTide) P.tide = { k2: TOY.k2p, lag: TOY.lagp };
  if (satTide) Sx.tide = Object.assign({ k2, lag }, coolTau ? { coolTau } : {});
  if (satAxis) Sx.spinAxis = satAxis;
  if (planetAxis) P.spinAxis = planetAxis;
  const tide = Object.assign({ maxN: 8, inertia }, split ? { split } : {}, heat ? { heat } : {});
  return { preset: toyPreset([P, Sx], Object.assign({ tide }, coord === '3d' ? { coord: '3d' } : {}), integrator), n, P: 2 * Math.PI / n };
}

/* ───────── P ───────── */
export function partP() { return L.runChecks(ctlPair); }

/* ───────── E ───────── */
function bodiesFromSim(S, recv) {
  const out = [];
  for (let i = 0; i < S.n; i++) out.push({ m: S.m[i], x: [S.x[i], S.y[i], S.z[i]], v: [S.vx[i], S.vy[i], S.vz[i]], spin: S.spin[i], axis: [S.sax[i], S.say[i], S.saz[i]], R: S.R[i],
    tide: recv.indexOf(i) >= 0 ? { k2: S.tideK2[i], lag: S.tideLag[i] } : null });
  return out;
}
export function partE(HP) {
  const p = toyPreset([
    { type: 'single', m: 1, radius: 0.3, x: 0, y: 0, z: 0, vx: 0, vy: -0.01, vz: 0.004, spin: 0.7, pinned: false, tide: { k2: 0.5, lag: 0.05 }, spinAxis: axisDeg(23, 40) },
    { type: 'single', m: 0.1, radius: 0.12, x: 2.6, y: 0.5, z: 0.9, vx: -0.1, vy: 0.55, vz: 0.12, spin: -0.3, pinned: false, tide: { k2: 0.3, lag: 0.08 } },
    { type: 'single', m: 0.05, radius: 0.05, x: -3.1, y: 1.2, z: -0.7, vx: 0.2, vy: -0.4, vz: -0.05, spin: 0, pinned: false }], { coord: '3d', tide: { maxN: 8, inertia: 'sphere' } });
  const { S } = simOf(HP, p);
  const recv = Array.from(S.tideRecv);
  const ev = HP.tideEvalRates3(S);
  const lib = L.ctl3System(bodiesFromSim(S, recv), { G: S.params.G, inertia: 'sphere' });
  let nd = 0;
  for (let i = 0; i < S.n; i++) {
    if (!Object.is(S._tdFX[i], lib.F[i][0]) || !Object.is(S._tdFY[i], lib.F[i][1]) || !Object.is(S._tdFZ[i], lib.F[i][2])) nd++;
    if (!Object.is(S._tdTX[i], lib.torque[i][0]) || !Object.is(S._tdTY[i], lib.torque[i][1]) || !Object.is(S._tdTQ[i], lib.torque[i][2])) nd++;
    if (!Object.is(S._tdHQ[i], lib.heatRate[i])) nd++;
  }
  const heatSame = Object.is(ev.heat, lib.heat), tauSame = Object.is(ev.tauMin, lib.tauMin);
  return { receivers: recv, nDiff: nd, heatBitSame: heatSame, tauMinBitSame: tauSame, heat: ev.heat, tauMin: ev.tauMin, pairs: lib.pairs,
    torque0: lib.torque[0].map(e3), torque1: lib.torque[1].map(e3), turnable: recv.map((i) => !!(S.saOn[i] && S.saOm[i] === 0)) };
}

/* ───────── Z ───────── */
export function partZ(HP, quick) {
  const steps = quick ? 400 : 4000;
  const cfgs = [
    { key: 'semi_full', integrator: null, split: null, inertia: 'half' },
    { key: 'semi_half', integrator: null, split: 'half', inertia: 'half' },
    { key: 'leap_full', integrator: 'leapfrog', split: null, inertia: 'sphere' },
    { key: 'leap_half_heat', integrator: 'leapfrog', split: 'half', inertia: 'sphere', heat: { model: 'linear', tau: 40 } }];
  const rows = {};
  for (const c of cfgs) {
    const mk = (coord) => toyPair({ satSpin: 1.2, planetSpin: 0.3, coord, split: c.split, inertia: c.inertia, integrator: c.integrator, heat: c.heat || null, lag: 0.05 });
    const A = simOf(HP, mk('2d').preset).S, B = simOf(HP, mk('3d').preset).S;
    const dt = mk('2d').P / TOY.stepsPerOrbit;
    for (let k = 0; k < steps; k++) { A.step(dt); B.step(dt); }
    let d = nDiff(A, B, KEYS2, A.n) + (Object.is(A.t, B.t) ? 0 : 1);
    for (const k of TIDE_SC) if (!Object.is(A[k], B[k])) d++;
    for (const k of ['tideJh', 'tideJl', 'tideDJ']) for (let i = 0; i < A.n; i++) if (!Object.is(A[k][i], B[k][i])) d++;
    if (c.heat) for (const k of ['tideEi', 'tideRad', 'tideHin']) for (let i = 0; i < A.n; i++) if (!Object.is(A[k][i], B[k][i])) d++;
    rows[c.key] = { nDiff: d, steps, threeD: B.coord3d === true, vzMax: Math.max(...Array.from(B.vz).map(Math.abs)), dSpinRel: e3((A.spin[1] - 1.2) / 1.2), heat: e3(A.tideHeat) };
  }
  // 内部熱は力学に戻らない(二次元・三次元 —— 熱あり/なしで軌道と自転がビット同一)
  const heatOff = {};
  for (const coord of ['2d', '3d']) {
    const a = toyPair({ satSpin: 1.2, coord, lag: 0.05 }), b = toyPair({ satSpin: 1.2, coord, lag: 0.05, heat: { model: 'linear', tau: 25 }, coolTau: 7 });
    const A = simOf(HP, a.preset).S, B = simOf(HP, b.preset).S, dt = a.P / TOY.stepsPerOrbit;
    for (let k = 0; k < steps; k++) { A.step(dt); B.step(dt); }
    let d = nDiff(A, B, coord === '3d' ? KEYS3 : KEYS2, A.n); for (const k of TIDE_SC) if (!Object.is(A[k], B[k])) d++;
    heatOff[coord] = { nDiff: d, E1: e3(B.tideEi[1]), coolTau: [B.tideCoolTau[0], B.tideCoolTau[1]] };
  }
  return { rows, heatOff, allSame: Object.values(rows).every((r) => r.nDiff === 0 && r.threeD && r.vzMax === 0) && Object.values(heatOff).every((r) => r.nDiff === 0) };
}

/* ───────── L ───────── */
function totalsOf(S, f) {
  let px = 0, py = 0, pz = 0, Lo = [0, 0, 0], Ls = [0, 0, 0], K = 0, Erot = 0, U = 0, Ut = 0;
  const G = S.params.G, e2 = S.params.softening * S.params.softening;
  for (let i = 0; i < S.n; i++) {
    const m = S.m[i], r = [S.x[i], S.y[i], S.z[i]], v = [S.vx[i], S.vy[i], S.vz[i]];
    px += m * v[0]; py += m * v[1]; pz += m * v[2];
    Lo = add(Lo, scale(cross(r, v), m));
    const I = f * m * S.R[i] * S.R[i];
    Ls = add(Ls, scale([S.sax[i], S.say[i], S.saz[i]], I * S.spin[i]));
    K += 0.5 * m * dot(v, v); Erot += 0.5 * I * S.spin[i] * S.spin[i];
    for (let j = i + 1; j < S.n; j++) { const d = sub([S.x[j], S.y[j], S.z[j]], r); U -= G * m * S.m[j] / Math.sqrt(dot(d, d) + e2); }
  }
  for (const i of S.tideRecv) for (let j = 0; j < S.n; j++) { if (j === i) continue; const d = sub([S.x[j], S.y[j], S.z[j]], [S.x[i], S.y[i], S.z[i]]), r2 = dot(d, d), R = S.R[i], R5 = R * R * R * R * R;
    Ut -= G * S.tideK2[i] * S.m[j] * S.m[j] * R5 / (2 * r2 * r2 * r2); }
  return { P: [px, py, pz], Lo, Ls, L: add(Lo, Ls), E: K + Erot + U + Ut, Erot };
}
export function partL(HP, quick) {
  const out = {};
  for (const [key, turn] of [['turnable', true], ['fixedAxis', false]]) {
    // 衛星の軸: 軸を動かせる受け手(傾き 10°・歳差なし)/ 軸を動かせない受け手(傾きなし +z)。惑星は傾きなし(τ⊥ は数えて回さない)
    const c = toyPair({ incl: 25, satSpin: 1.0, satAxis: turn ? axisDeg(10, 30) : null, planetSpin: 0.4, integrator: 'leapfrog', lag: 0.5 });
    const { S } = simOf(HP, c.preset), f = L.INERTIA_FACTOR.sphere, dt = c.P / TOY.stepsPerOrbit, steps = quick ? 720 : 7200;
    const T0 = totalsOf(S, f), Lsat0 = scale([S.sax[1], S.say[1], S.saz[1]], f * S.m[1] * S.R[1] * S.R[1] * S.spin[1]);
    for (let k = 0; k < steps; k++) S.step(dt);
    const T1 = totalsOf(S, f), st = HP.tideState(S), d3 = st.d3;
    const scaleW = Math.max(Math.abs(st.work), st.heat, Math.abs(st.workCons)), scaleL = norm(d3.sumDJ3);
    const dL = sub(T1.L, T0.L), dLfix = add(dL, d3.perpL);   // 動かさなかった τ⊥ の力積を足すと閉じる
    out[key] = { steps, residualE: e3(st.residualE / scaleW), residualL3: d3.residualL3.map((v) => e3(v / scaleL)), axisTurns: d3.axisTurns, perpSkip: d3.perpSkip,
      perpSkipMax: e3(d3.perpSkipMax), dLtotRel: e3(norm(dL) / scaleL), dLclosedRel: e3(norm(dLfix) / scaleL), satSpinLvsImpulse: null,
      dP: e3(norm(sub(T1.P, T0.P))), heat: e3(st.heat), dEplusHeatRel: e3((T1.E - T0.E + st.heat) / st.heat), dErot: e3(T1.Erot - T0.Erot),
      satSpin: [1.0, e3(S.spin[1])], satAxis: [S.sax[1], S.say[1], S.saz[1]].map((v) => Number(v.toFixed(9))) };
    // 軸を動かせる衛星: 自転の角運動量のベクトルの実際の変化 I s′ â′ − I s â = Σ τ h(潮汐のトルクの力積)—— 丸め床まで
    if (turn) { const sat = Array.from(S.tideRecv).indexOf(1), Lsat1 = scale([S.sax[1], S.say[1], S.saz[1]], f * S.m[1] * S.R[1] * S.R[1] * S.spin[1]);
      out[key].satSpinLvsImpulse = e3(norm(sub(sub(Lsat1, Lsat0), d3.dJ3[sat])) / norm(d3.dJ3[sat])); }
  }
  return out;
}

/* ───────── C ───────── */
export function partC(HP, quick) {
  const steps = quick ? 400 : 3000;
  const base = toyPair({ incl: 25, satSpin: 1.0, satAxis: axisDeg(10, 30), planetSpin: 0.4, planetAxis: axisDeg(5, 100), integrator: 'leapfrog', lag: 0.5 });   // 両方とも軸を動かせる受け手(回した側と同じ扱い)
  const Rv = (v) => L.rotate(v, ROT.axis, ROT.angle), Ri = (v) => L.rotate(v, ROT.axis, -ROT.angle);
  const A = simOf(HP, base.preset).S, B = simOf(HP, base.preset).S;
  // B の状態を回す(位置・速度・軸 —— build の後に置き直す)
  for (let i = 0; i < B.n; i++) {
    const x = Rv([B.x[i], B.y[i], B.z[i]]), v = Rv([B.vx[i], B.vy[i], B.vz[i]]), a = Rv([B.sax[i], B.say[i], B.saz[i]]);
    B.x[i] = x[0]; B.y[i] = x[1]; B.z[i] = x[2]; B.vx[i] = v[0]; B.vy[i] = v[1]; B.vz[i] = v[2];
    B.sax[i] = a[0]; B.say[i] = a[1]; B.saz[i] = a[2]; B.sa0x[i] = a[0]; B.sa0y[i] = a[1]; B.sa0z[i] = a[2];
  }
  const dt = base.P / TOY.stepsPerOrbit;
  for (let k = 0; k < steps; k++) { A.step(dt); B.step(dt); }
  let worst = 0, worstAx = 0, worstSpin = 0;
  for (let i = 0; i < A.n; i++) {
    const xa = [A.x[i], A.y[i], A.z[i]], xb = Ri([B.x[i], B.y[i], B.z[i]]), va = [A.vx[i], A.vy[i], A.vz[i]], vb = Ri([B.vx[i], B.vy[i], B.vz[i]]);
    worst = Math.max(worst, norm(sub(xa, xb)) / Math.max(norm(xa), 1e-12), norm(sub(va, vb)) / Math.max(norm(va), 1e-12));
    worstAx = Math.max(worstAx, norm(sub([A.sax[i], A.say[i], A.saz[i]], Ri([B.sax[i], B.say[i], B.saz[i]]))));
    worstSpin = Math.max(worstSpin, rel(A.spin[i], B.spin[i]));
  }
  // 惑星(傾きなし)は B では軸が回った(有効化した)ので動かせる受け手になる —— 比較は衛星と軌道だけで行う注記
  return { steps, worstRel: e3(worst), worstAxis: e3(worstAx), worstSpinRel: e3(worstSpin), heatRel: e3(rel(A.tideHeat, B.tideHeat)), axisTurns: [A.tideAxN, B.tideAxN] };
}

/* ───────── K ───────── */
export function partK(H, quick) {
  const HP = H.HP, snapF = H.evalExpr('ckSnapOne'), restF = H.evalExpr('ckRestoreOne');
  const c = toyPair({ incl: 25, satSpin: 1.0, satAxis: axisDeg(10, 30), planetSpin: 0.4, integrator: 'leapfrog', lag: 0.5, heat: { model: 'linear', tau: 30 } });
  const { S } = simOf(HP, c.preset), dt = c.P / TOY.stepsPerOrbit, n1 = quick ? 100 : 500, n2 = quick ? 100 : 500;
  for (let k = 0; k < n1; k++) S.step(dt);
  const ck = snapF(S);
  for (let k = 0; k < n2; k++) S.step(dt);
  const after = {}; for (const k of KEYS3.concat(['tideEi', 'tideRad', 'tideHin', 'tideDJx', 'tideDJy', 'tideDJz', 'tideJh', 'tideJl'])) after[k] = Array.from(S[k].subarray(0, S.n));
  const sc = {}; for (const k of ['tideWork', 'tideHeat', 'tideDL', 'tideDLx', 'tideDLy', 'tideAxN', 'tideAxLx', 'tidePerpN', 'tidePerpLz', 't']) sc[k] = S[k];
  restF(S, ck);
  for (let k = 0; k < n2; k++) S.step(dt);
  let d = 0; for (const k of Object.keys(after)) for (let i = 0; i < S.n; i++) if (!Object.is(after[k][i], S[k][i])) d++;
  for (const k of Object.keys(sc)) if (!Object.is(sc[k], S[k])) d++;
  return { steps: [n1, n2], nDiff: d, keys: Object.keys(after).length + Object.keys(sc).length };
}

/* ───────── H ───────── */
export function partH(HP, quick) {
  // ① エンジンの tideHeatAdvance: 一定の発熱率の 1 歩と半歩 2 回
  const c = toyPair({ satSpin: 1.0, heat: { model: 'linear', tau: 3 }, coolTau: 2 });
  const A = simOf(HP, c.preset).S, B = simOf(HP, c.preset).S;
  for (const S of [A, B]) { S._tdHQ[0] = 2.5e-4; S._tdHQ[1] = 7e-6; S.tideEi[0] = 1e-3; S.tideEi[1] = 0; }
  HP.tideHeatAdvance(A, 0.8); HP.tideHeatAdvance(B, 0.4); HP.tideHeatAdvance(B, 0.4);
  const half = [0, 1].map((i) => ({ E: rel(A.tideEi[i], B.tideEi[i]), rad: rel(A.tideRad[i], B.tideRad[i]), budget: Math.abs(A.tideHin[i] - (A.tideEi[i] - (i === 0 ? 1e-3 : 0)) - A.tideRad[i]) / A.tideHin[i] }));
  // ② 長い走行: E ≥ 0・収支・Σ入力 = tideHeat・τ_cool ≪ 走行で放射の率 → 発熱率
  const run = toyPair({ satSpin: 1.0, lag: 0.5, heat: { model: 'linear', tau: 20 }, coolTau: 5 });
  const { S } = simOf(HP, run.preset), dt = run.P / TOY.stepsPerOrbit, steps = quick ? 2000 : 20000;
  let Emin = Infinity, negN = 0;
  for (let k = 0; k < steps; k++) { S.step(dt); for (const i of S.tideRecv) { const e = S.tideEi[i]; if (e < Emin) Emin = e; if (e < 0) negN++; } }
  const st = HP.tideState(S).internalHeat;
  const lumRatio = st.receivers.map((i, k) => st.luminosity[k] / st.rate[k]);
  return { half, steps, Emin, negN, residual: st.residual.map((r, k) => e3(r / st.input[k])), inputMinusHeatRel: e3(st.inputMinusHeat / S.tideHeat),
    coolTau: st.coolTau, luminosityOverRate: lumRatio.map((x) => Number(x.toFixed(6))), E: st.E.map(e3), radiated: st.radiated.map(e3), input: st.input.map(e3),
    tSpanOverTau: st.coolTau.map((t) => Number((S.t / t).toFixed(1))) };
}

/* ───────── S ───────── */
export function partS(HP, quick) {
  const { M, m, Rs, a, k2, lag } = TOY, n = Math.sqrt((M + m) / (a * a * a));
  const I = L.INERTIA_FACTOR.sphere * m * Rs * Rs, R5 = Rs * Rs * Rs * Rs * Rs, a6 = a * a * a * a * a * a;
  const tauSpin = I / (3 * 1 * k2 * M * M * R5 * lag / a6);
  const cases = [
    { key: 'fastPrograde', spin: 3 * n, axis: null, incl: 0 },
    { key: 'slowPrograde', spin: 0.3 * n, axis: null, incl: 0 },
    { key: 'retrograde', spin: -n, axis: null, incl: 0 },
    { key: 'obliqueSlow', spin: 1.5 * n, axis: axisDeg(30, 0), incl: 0 },    // Ω cos ε = 1.30 n < 2n → 傾きは減る
    { key: 'obliqueFast', spin: 3 * n, axis: axisDeg(30, 0), incl: 0 },      // Ω cos ε = 2.60 n > 2n → 傾きは初め増える(CTL の既知の性質)
    { key: 'inclinedFixed', spin: 3 * n, axis: null, incl: 30 }];
  // 円軌道で平均した CTL(K = 3BΔt/a⁶・I = ⅖mR²): ⟨τ⟩ = K[n ĥ − ½Ω − ½(ĥ·Ω)ĥ] → dΩ/dt = (K/I)[n cos ε − ½Ω(1 + cos²ε)]・dε/dt = −(K/(IΩ))(n − ½Ω cos ε) sin ε
  const Kc = 3 * 1 * k2 * M * M * R5 * lag / a6;
  const avg = (Om, epsDeg) => { const ce = Math.cos(epsDeg * Math.PI / 180), se = Math.sin(epsDeg * Math.PI / 180);
    return { dOm: Kc / I * (n * ce - 0.5 * Om * (1 + ce * ce)), dEpsDeg: -Kc / (I * Om) * (n - 0.5 * Om * ce) * se * 180 / Math.PI }; };
  const out = { n, tauSpin: e3(tauSpin), K: Kc, I, avgFormula: '⟨τ⟩ = K[n ĥ − ½Ω − ½(ĥ·Ω)ĥ]・K = 3BΔt/a⁶', cases: {} };
  for (const c of cases) {
    const T = toyPair({ incl: c.incl, satSpin: c.spin, satAxis: c.axis, planetTide: false, planetSpin: 0, lag, heat: { model: 'linear', tau: tauSpin } });
    const { S } = simOf(HP, T.preset), dt = T.P / TOY.stepsPerOrbit, tEnd = (quick ? 0.3 : SYNC.tauMult) * tauSpin, steps = Math.ceil(tEnd / dt), every = Math.max(1, Math.floor(steps / SYNC.samples));
    const series = [];
    const obl = () => { const r = [S.x[1] - S.x[0], S.y[1] - S.y[0], S.z[1] - S.z[0]], v = [S.vx[1] - S.vx[0], S.vy[1] - S.vy[0], S.vz[1] - S.vz[0]], h = unit(cross(r, v));
      return Math.acos(Math.max(-1, Math.min(1, dot(h, [S.sax[1], S.say[1], S.saz[1]])))) * 180 / Math.PI; };
    const nNow = () => { const r = [S.x[1] - S.x[0], S.y[1] - S.y[0], S.z[1] - S.z[0]], v = [S.vx[1] - S.vx[0], S.vy[1] - S.vy[0], S.vz[1] - S.vz[0]]; return norm(cross(r, v)) / dot(r, r); };
    const rec = () => series.push({ tOverTau: Number((S.t / tauSpin).toFixed(4)), spinOverN: Number((S.spin[1] / nNow()).toFixed(6)), obliquityDeg: Number(obl().toFixed(4)), Ei: e3(S.tideEi[1]) });
    rec();
    // 初めの 1 公転の変化率(実測)と平均した解析式(窓の頭と終わりの台形)
    const w0 = { t: S.t, Om: S.spin[1], eps: obl() }, nWin = TOY.stepsPerOrbit;
    for (let k = 1; k <= steps; k++) {
      S.step(dt);
      if (k === nWin) {
        const w1 = { t: S.t, Om: S.spin[1], eps: obl() }, a0 = avg(w0.Om, w0.eps), a1 = avg(w1.Om, w1.eps), T = w1.t - w0.t;
        const mOm = (w1.Om - w0.Om) / T, mEps = (w1.eps - w0.eps) / T, pOm = 0.5 * (a0.dOm + a1.dOm), pEps = 0.5 * (a0.dEpsDeg + a1.dEpsDeg);
        var win = { dOmMeasured: e3(mOm), dOmAvgFormula: e3(pOm), dOmRel: e3(rel(mOm, pOm)), dEpsMeasured: e3(mEps), dEpsAvgFormula: e3(pEps), dEpsRel: (Math.abs(pEps) > 0 && c.axis) ? e3(rel(mEps, pEps)) : null };
      }
      if (k % every === 0 || k === steps) rec();
    }
    const st = HP.tideState(S);
    const first = series[0], last = series[series.length - 1];
    const mono = series.every((r, k) => k === 0 || Math.abs(r.spinOverN - 1) <= Math.abs(series[k - 1].spinOverN - 1) + 1e-9);
    const s1 = series[1];
    out.cases[c.key] = { spin0OverN: Number((c.spin / n).toFixed(6)), steps, first, last, towardSync: Math.abs(last.spinOverN - 1) < Math.abs(first.spinOverN - 1), monotone: mono,
      obliquityDecreased: last.obliquityDeg < first.obliquityDeg - 1e-6, obliquityFirstUp: s1.obliquityDeg > first.obliquityDeg, obliquityMax: Math.max(...series.map((r) => r.obliquityDeg)),
      window: win, axisTurns: st.d3.axisTurns, perpSkip: st.d3.perpSkip, residualE: e3(st.residualE / st.heat), heat: e3(st.heat), series };
  }
  return out;
}

/* ───────── R ───────── */
const findP = (HP, id) => HP.allPresets().find((q) => q.id === id);
function unitsOf(p) { const s = p.scaleExp; return { L: Math.pow(10, s.L), T: Math.pow(10, s.T), M: Math.pow(10, s.M) }; }
/** 🟠 の宣言のイオを 🏀 の木星の赤道面へ(昇交点の方向 ẑ×â・順行の円軌道の速さは 🟠 の宣言の値)。単位は 🏀 へ換算 */
export function ioFromGalilean(HP, jup) {
  const gal = findP(HP, BOOKS.galilean), ug = unitsOf(gal), uj = unitsOf(findP(HP, BOOKS.jupiter));
  const io = gal.bodies[1];
  const aSI = Math.hypot(io.x, io.y) * ug.L, vSI = Math.hypot(io.vx, io.vy) * ug.L / ug.T, spinSI = io.spin / ug.T;
  const ax = jup.axis, e1 = unit(cross([0, 0, 1], ax)), e2 = cross(ax, e1);
  return { m: io.m * ug.M / uj.M, R: io.radius * ug.L / uj.L, rel: scale(e1, aSI / uj.L), vrel: scale(e2, vSI * uj.T / uj.L), spin: spinSI * uj.T, axis: ax.slice(),
    src: { aSI, vSI, spinSI, mSI: io.m * ug.M, RSI: io.radius * ug.L } };
}
function rateCopy(HP, base, recvIdx, extra) {
  const p = clone(base);
  p.id = 'w307bRate'; delete p.claims; delete p.abBody; delete p.fitRecord;
  // 潮汐の率は t = 0 の相対の位置・速度・慣性自転・軸だけで決まる —— 引きずり・局所重力の宣言は外す(build が宣言の速度を変えない写し・測地線は宣言しない)
  delete p.physics.relativeDrag; delete p.physics.gLoc; p.physics.geoPN = 0;
  p.sampleClass = 'principle'; p.physics.radiusFloor = 0.001;   // イオの半径 0.0018216(🏀 の単位)を下限 0.01 で丸めない(写しだけの宣言)
  const u = unitsOf(p);
  p.physics.tide = { maxN: 8, inertia: NORM.inertia };
  if (extra) extra(p, u);
  for (const i of recvIdx) p.bodies[i].tide = { k2: NORM.k2, lag: NORM.lagSec / u.T };
  return { p, u };
}
function ratesOf(HP, p, u, labels) {
  const { S } = simOf(HP, p);
  HP.tideEvalRates3(S);
  const recv = Array.from(S.tideRecv), lib = L.ctl3System(bodiesFromSim(S, recv), { G: S.params.G, inertia: NORM.inertia });
  const rows = recv.map((i) => {
    const ax = [S.sax[i], S.say[i], S.saz[i]], tq = [S._tdTX[i], S._tdTY[i], S._tdTQ[i]], br = dot(tq, ax), I = L.INERTIA_FACTOR[NORM.inertia] * S.m[i] * S.R[i] * S.R[i];
    const perp = norm(sub(tq, scale(ax, br)));
    return { body: labels[i], i, spinPerSec: e3(S.spin[i] / u.T), brakeNm: e3(br * u.M * u.L * u.L / (u.T * u.T)), alphaRadS2: e3(br / I / (u.T * u.T)),
      perpNm: e3(perp * u.M * u.L * u.L / (u.T * u.T)), heatW: e3(S._tdHQ[i] * u.M * u.L * u.L / (u.T * u.T * u.T)),
      bitSameLib: Object.is(S._tdHQ[i], lib.heatRate[i]) && Object.is(tq[0], lib.torque[i][0]) && Object.is(tq[1], lib.torque[i][1]) && Object.is(tq[2], lib.torque[i][2]) };
  });
  return { n: S.n, rows };
}
export function partR(HP) {
  const ven = findP(HP, BOOKS.venus), jup = findP(HP, BOOKS.jupiter);
  const out = { norm: NORM, cases: {} };
  { const { p, u } = rateCopy(HP, ven, [1]); out.cases.sunVenus = Object.assign({ book: BOOKS.venus, receivers: ['金星'] }, ratesOf(HP, p, u, ['太陽', '金星'])); }
  { const { p, u } = rateCopy(HP, jup, [1]); out.cases.sunJupiter = Object.assign({ book: BOOKS.jupiter, receivers: ['木星'] }, ratesOf(HP, p, u, ['太陽', '木星'])); }
  // 木星の軸(🏀 の宣言 —— spinAxis.tiltDeg/azimuthDeg)
  const vj = HP.validatePreset(clone(jup)).preset, Sj = HP.coord3d.makeSim(); Sj.build(clone(vj));
  const jAxis = [Sj.sax[1], Sj.say[1], Sj.saz[1]];
  const io = ioFromGalilean(HP, { axis: jAxis });
  out.io = { transcribedFrom: BOOKS.galilean, mSI: io.src.mSI, RSI: io.src.RSI, aSI: io.src.aSI, vSI: io.src.vSI, spinSI: io.src.spinSI, placement: '木星の赤道面・昇交点の方向 ẑ×â・順行の円軌道(🟠 の宣言の速さ)—— 診断の配置' };
  const addIo = (withSun) => (p) => {
    const J = p.bodies[1], ioB = { type: 'single', m: io.m, radius: io.R, x: J.x + io.rel[0], y: J.y + io.rel[1], z: (J.z || 0) + io.rel[2],
      vx: J.vx + io.vrel[0], vy: J.vy + io.vrel[1], vz: (J.vz || 0) + io.vrel[2], spin: io.spin, pinned: false, spinAxis: clone(J.spinAxis) };
    if (!withSun) { p.bodies = [J, ioB]; } else p.bodies.push(ioB);
    p.physics.softeningFloor = 1e-4; p.physics.softening = 1e-4;   // 🏀 の軟化 0.05(5×10⁷ m)はイオの軌道 4.2×10⁸ m で重力を 2% 弱める —— 写しだけ 10⁵ m へ
  };
  { const { p, u } = rateCopy(HP, jup, [0, 1], (q) => addIo(false)(q)); out.cases.jupiterIo = Object.assign({ book: BOOKS.jupiter + ' の木星 + ' + BOOKS.galilean + ' のイオ', receivers: ['木星', 'イオ'] }, ratesOf(HP, p, u, ['木星', 'イオ'])); }
  { const { p, u } = rateCopy(HP, jup, [1, 2], (q) => addIo(true)(q)); out.cases.sunJupiterIo = Object.assign({ book: BOOKS.jupiter + ' + イオ', receivers: ['木星', 'イオ'] }, ratesOf(HP, p, u, ['太陽', '木星', 'イオ'])); }
  const aJ = (c) => out.cases[c].rows.find((r) => r.body === '木星').alphaRadS2;
  out.jupiterIoOverSun = e3(aJ('jupiterIo') / aJ('sunJupiter'));
  out.jupiterThreeOverIo = e3(aJ('sunJupiterIo') / aJ('jupiterIo'));
  out.allBitSameLib = Object.values(out.cases).every((c) => c.rows.every((r) => r.bitSameLib));
  // 木星–イオの写しを 1 公転だけ走らせ(leapfrog・質量の倍精度・1 公転 8000 步)、受け手ごとの発熱の時間平均(内部熱の入力の積算 / 時間 —— 宣言の離心の近点から
  // 始まる)と、離心の潮汐の定時間遅延の式 Ė = (21/2) k₂ G M² R⁵ n² Δt e² / a⁶(同期の受け手・小さい e)の比。e・a は走行の最小と最大の距離から
  // (診断の比較 —— 実在のイオの値ではない。イオの自転は 🟠 の宣言 = 平均運動の 1.0004 倍)
  {
    const { p, u } = rateCopy(HP, jup, [0, 1], (q) => { addIo(false)(q); q.physics.tide.heat = { model: 'linear', tau: 1e12 }; q.physics.massPrecision = 'double'; q.integrator = 'leapfrog'; });
    const { S } = simOf(HP, p), G = S.params.G;
    const r0 = [S.x[1] - S.x[0], S.y[1] - S.y[0], S.z[1] - S.z[0]], v0 = [S.vx[1] - S.vx[0], S.vy[1] - S.vy[0], S.vz[1] - S.vz[0]], mu = G * (S.m[0] + S.m[1]);
    const rr = norm(r0), v2 = dot(v0, v0), aE = 1 / (2 / rr - v2 / mu), nE = Math.sqrt(mu / (aE * aE * aE));
    const P = 2 * Math.PI / nE, steps = 8000, dt = P / steps;
    let rmin = Infinity, rmax = 0;
    for (let k = 0; k < steps; k++) { S.step(dt); const r = Math.hypot(S.x[1] - S.x[0], S.y[1] - S.y[0], S.z[1] - S.z[0]); if (r < rmin) rmin = r; if (r > rmax) rmax = r; }
    const e = (rmax - rmin) / (rmax + rmin), aM = 0.5 * (rmax + rmin), nM = Math.sqrt(mu / (aM * aM * aM));
    const st = HP.tideState(S).internalHeat, lagB = NORM.lagSec / u.T, Rio = S.R[1], R5 = Rio * Rio * Rio * Rio * Rio, aM6 = aM * aM * aM * aM * aM * aM;
    const formula = 10.5 * NORM.k2 * G * S.m[0] * S.m[0] * R5 * nM * nM * lagB * e * e / aM6;
    const W = u.M * u.L * u.L / (u.T * u.T * u.T);
    out.ioOrbitAverage = { e: Number(e.toFixed(6)), e0: Number((1 - rr / aE).toFixed(6)), aSI: e3(aM * u.L), periodDays: Number((P * u.T / 86400).toFixed(6)), steps,
      meanHeatW: st.input.map((x) => e3(x / S.t * W)), receivers: ['木星', 'イオ'], ioSpinOverMeanMotion: Number((io.spin / nM).toFixed(6)),
      eccFormulaW: e3(formula * W), ioOverFormula: Number((st.input[1] / S.t / formula).toFixed(4)) };
  }
  return out;
}

/* ───────── X ───────── */
export function partX(HP, quick) {
  const ven = findP(HP, BOOKS.venus), u = unitsOf(ven);
  const p = clone(ven); p.id = 'w307bXdot'; delete p.claims; delete p.abBody; delete p.fitRecord;
  p.physics.tide = { maxN: 8, velocity: 'xdot', inertia: 'sphere' };
  p.bodies[1].tide = { k2: 1, lag: 1e6 / u.T };   // 交差項を見るための大きな遅延(診断)
  const { S } = simOf(HP, p), dt = p.physics.stepDt || 5, steps = quick ? 100 : 1000;
  for (let k = 0; k < steps; k++) S.step(dt);
  const st = HP.tideState(S), sc = Math.max(Math.abs(st.work), st.heat, Math.abs(st.workCons), Math.abs(st.mix));
  return { steps, drag: !!(S.relDrag && S.relDrag.law === 'inertial'), mix: e3(st.mix), heat: e3(st.heat), residualE: e3(st.residualE / sc), residualL3: st.d3.residualL3.map((v) => e3(v / Math.max(norm(st.d3.sumDJ3), 1e-300))) };
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const P = J.P, Z = J.Z, Lp = J.L, C = J.C, K = J.K, Hh = J.H, Sy = J.S, R = J.R, X = J.X;
  return {
    pure: P.ok === true,
    engineEqualsLib: J.E.nDiff === 0 && J.E.heatBitSame && J.E.tauMinBitSame,
    planarLimitBitSame: Z.allSame === true,
    ledgerWorkHeat: Object.values(Lp).every((r) => Math.abs(r.residualE) < 1e-10),
    ledgerAngMom: Object.values(Lp).every((r) => r.residualL3.every((v) => Math.abs(v) < 1e-10)),
    angMomClosed: Object.values(Lp).every((r) => r.dLclosedRel < 1e-9) && Lp.turnable.axisTurns > 0 && Lp.fixedAxis.perpSkip > 0 && Lp.fixedAxis.axisTurns === 0 && Lp.turnable.satSpinLvsImpulse < 1e-9,
    covariant: C.worstRel < 1e-9 && C.worstSpinRel < 1e-9,
    checkpoint: K.nDiff === 0,
    heatHalfTwice: Hh.half.every((r) => r.E < 1e-14 && r.rad < 1e-13 && r.budget < 1e-13),
    heatLedger: Hh.negN === 0 && Hh.residual.every((r) => Math.abs(r) < 1e-12) && Math.abs(Hh.inputMinusHeatRel) < 1e-12,
    syncDirection: Sy.cases.fastPrograde.towardSync && Sy.cases.slowPrograde.towardSync && Sy.cases.retrograde.towardSync
      && Sy.cases.fastPrograde.first.spinOverN > Sy.cases.fastPrograde.last.spinOverN && Sy.cases.slowPrograde.last.spinOverN > Sy.cases.slowPrograde.first.spinOverN
      && Sy.cases.retrograde.last.spinOverN > Sy.cases.retrograde.first.spinOverN,
    obliquity: Sy.cases.obliqueSlow.obliquityDecreased && Sy.cases.obliqueSlow.axisTurns > 0 && Sy.cases.obliqueFast.obliquityFirstUp && Sy.cases.obliqueFast.window.dEpsMeasured > 0
      && Sy.cases.inclinedFixed.perpSkip > 0 && Sy.cases.inclinedFixed.axisTurns === 0,
    averagedFormula: Object.values(Sy.cases).filter((c) => c.window && c.spin0OverN !== 0).every((c) => c.window.dOmRel < 1e-2 && (c.window.dEpsRel === null || c.window.dEpsRel < 5e-2)),
    ioEccentricityTide: Math.abs(R.ioOrbitAverage.ioOverFormula - 1) < 2e-2,
    ratesBitSameLib: R.allBitSameLib === true,
    xdotLedger: X.drag === true && Math.abs(X.residualE) < 1e-10,
  };
}

/* ───────── 文書の表(PHYSICS〔第307便b〕と QA が同じ関数で作る)───────── */
export function physicsTables(J) {
  const L1 = ['| 段 | 測ったもの | 値 |', '|---|---|---|'];
  const P = J.P;
  L1.push(`| P | 二次元の極限(ctlPair とビット同一)・回転の共変(循環置換ビット同一・一般の回転 ${P.rotCovRel.toExponential(1)})・仕事と熱 ${P.workHeatResidual.toExponential(1)} | ${P.ok ? '通過' : '不通過'} |`);
  L1.push(`| E | エンジンの 1 回の評価と純関数(3 体・非共面) | 差 ${J.E.nDiff} 値 |`);
  L1.push(`| Z | 二次元の本と coord:"3d" の写し(${Object.keys(J.Z.rows).join('・')}・熱あり/なし) | 差 ${Object.values(J.Z.rows).reduce((a, r) => a + r.nDiff, 0)} 値 |`);
  L1.push(`| L | 非共面の帳簿(軸を動かせる受け手): 仕事と熱 ${J.L.turnable.residualE}・全角運動量 ${J.L.turnable.dLclosedRel} | 軸の更新 ${J.L.turnable.axisTurns} 回 |`);
  L1.push(`| L | 同(軸を動かせない受け手): τ⊥ を数えて回さない ${J.L.fixedAxis.perpSkip} 回・足すと閉じる ${J.L.fixedAxis.dLclosedRel} | 力学的エネルギー + 熱 ${J.L.fixedAxis.dEplusHeatRel} |`);
  L1.push(`| C | 回転の共変性(${J.C.steps} 步) | 位置と速度 ${J.C.worstRel}・自転 ${J.C.worstSpinRel} |`);
  L1.push(`| K | チェックポイントの往復(${J.K.keys} 鍵) | 差 ${J.K.nDiff} 値 |`);
  L1.push(`| H | 内部熱: 半歩 2 回 ${Math.max(...J.H.half.map((r) => r.E)).toExponential(1)}・E の最小 ${J.H.Emin.toExponential(2)}・放射の率/発熱率 ${J.H.luminosityOverRate.join('/')} | 収支 ${J.H.residual.join('/')} |`);
  const L2 = ['| 写し | 初め Ω/n | 終わり Ω/n | 傾き(度) | 軸の更新/数えた τ⊥ |', '|---|---|---|---|---|'];
  for (const [k, c] of Object.entries(J.S.cases)) L2.push(`| ${k} | ${c.first.spinOverN} | ${c.last.spinOverN} | ${c.first.obliquityDeg} → ${c.last.obliquityDeg} | ${c.axisTurns}/${c.perpSkip} |`);
  const fx = (v) => Number(v).toExponential(3);
  const L3 = ['| 配置 | 受け手 | 慣性自転へのブレーキの角加速度 (rad/s²) | 発熱率 (W) | 垂直のトルク (N·m) |', '|---|---|---|---|---|'];
  for (const [k, c] of Object.entries(J.R.cases)) for (const r of c.rows) L3.push(`| ${k} | ${r.body} | ${fx(r.alphaRadS2)} | ${fx(r.heatW)} | ${fx(r.perpNm)} |`);
  const io = J.R.ioOrbitAverage;
  L3.push(`| jupiterIo の 1 公転の平均(e ${io.e}) | イオ | — | ${fx(io.meanHeatW[1])}(離心の潮汐の式 ${fx(io.eccFormulaW)} の ${io.ioOverFormula} 倍) | — |`);
  return [L1.join('\n'), L2.join('\n'), L3.join('\n')].join('\n\n');
}
export function docNumbers(J) {
  return [String(J.R.jupiterIoOverSun), String(J.S.tauSpin), String(J.X.residualE), String(J.H.inputMinusHeatRel)];
}

export function runAll(H, { quick = false } = {}) {
  const HP = H.HP, t = {};
  let t0 = Date.now();
  const lap = (k) => { t[k] = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now(); };
  const P = partP(); lap('P');
  const E = partE(HP); lap('E');
  const Z = partZ(HP, quick); lap('Z');
  const Lp = partL(HP, quick); lap('L');
  const C = partC(HP, quick); lap('C');
  const K = partK(H, quick); lap('K');
  const Hh = partH(HP, quick); lap('H');
  const Sy = partS(HP, quick); lap('S');
  const R = partR(HP); lap('R');
  const X = partX(HP, quick); lap('X');
  const J = { quick, toy: TOY, P, E, Z, L: Lp, C, K, H: Hh, S: Sy, R, X };
  J.gates = gatesOf(J);
  J.ok = Object.values(J.gates).every(Boolean);
  J.timing = t;
  return J;
}

export async function main() {
  const TARGET = process.env.W307B_TARGET || 'beta/index.html';
  const OUT = process.env.W307B_OUT || path.join(ROOT, 'tests', 'out', 'tide3d-w307b.json');
  const quick = process.env.W307B_QUICK === '1';
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now();
  const W281A_SCOPE = w281aScopeStamp(html, REGEN_SCOPE);
  const H = loadHtmlHeadless(html);
  pinDecl315c(H.evalExpr);   // 第315便c(AN406): 在位の 7 本の宣言を移行の前の写しへ(本ごとの門 —— 基点の html では no-op・正本の欄は足さない)
  const R = runAll(H, { quick });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w307b-tide3d.mjs', target: TARGET,
    targetSha256: crypto.createHash('sha256').update(fs.readFileSync(html)).digest('hex'),
    ruling: '原仮定者の裁定(第100報)「潮汐のブレーキが効く相手は慣性軸回転そのもの・失われる回転のエネルギーは内部熱・増え続けるので放射も」・決断事項 AN345 ③⑤・統括の検証項目 R210',
    tide3Version: H.evalExpr('TIDE3_STEP_VERSION'), heatVersion: H.evalExpr('TIDE_HEAT_VERSION'), ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w307b-tide3d.mjs', 'tests/lib-w315c-legacy7.mjs', 'tests/lib-w307b-tide3d.mjs', 'tests/lib-w292d-tide.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第307便b', target: TARGET, code: CODE, inputs: [TARGET, LEGACY7_DATA_FILE] }), {
    harnessVersion: HARNESS_VERSION,
    engine: 'Node の headless(tests/lib-w279b-headless.mjs の loadHtmlHeadless —— html の本文をそのまま実行・1 プロセス)',
    notClaim: ['金星の逆行を説明した', 'イオの加熱を再現した', '自転が釣り合った', '観測の 1σ で較正済み', '熱力学を導いた'] });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s', JSON.stringify(out.timing));
}
if (IS_MAIN) await main();
