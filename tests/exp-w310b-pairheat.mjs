// 第310便b(決断事項 AN370「対の熱の規則 —— 在位で維持の型を使う前に、相反の関係をエンジンで測る(大きい側を自動で外す一般則は採らない・規則は裁定待ち)」・
// AN373「移動の補正の主の指標 abs(u(0))/abs(V_obs,i − V_obs,k)」・AN365「基準の刻みが宣言されていない本は "step" のまま間隔が未宣言と帳簿に書く」・
// AN371「実際の内部熱 E_i・帳簿の維持のコスト・負の E_speed に対応する背景からの供給を別の欄に」・原仮定者の裁定(第107報・第108報)・統括の検証項目 R223):
// **対の熱の相反の測定と帳簿の欄の器**。
//
// Node だけ(対象 html の inline script を tests/lib-w279b-headless.mjs の loadHtmlHeadless で読み、html の validatePreset・coord3d.makeSim・build・step・
// 読み口 inertialDrag3SpinState・inertialDragIsqState・inertialDragInitObsState をそのまま呼ぶ)。純関数は tests/lib-w310b-pairheat.mjs。
// **在位の本の宣言は変えない** —— 写しはすべて器の中で組む。新則の写しは invSq {Wbg2:0, order:8}・dragCoreDefault "cap6500km"(第309便a の器と同じ宣言)。
//
// ■ 段
//   P(純関数): 1 次の量・相反の比と破れ・大きい側を外す規則の外れ・k の決め方(同率は質量 → 番号)・分母 0 は null・帳簿の流れの和。
//   R(相反 —— エンジン): 維持の型(受け手の全部・reaction "background")の写しで、核が対ごとに作る ω_ij を**器の写しの中だけ**で記録する
//     (axisHold の駆動の型が使う対の記録の配列 _rdHoldP を写しに置く —— エンジンの和の演算・状態は変えない: 置かない走行と状態がビット同一であることを門で確かめる)。
//     E⁽¹⁾_{i←j} = I_i s_i (ω_ij·â_i)・Σ_j ω_ij = ω_D(ビット)・Σ_j E⁽¹⁾ + ½I abs(ω_D)² = エンジンの E_speed(丸めの順)。対の両側の 1 次の比と破れ・符号・
//     大きい側を外す規則の外れ。構成: 太陽–水星・太陽–金星・太陽–地球(🌦️ の写し —— 月を外し太陽を動かす)・太陽–木星・木星–イオ(🏀 と木星系の本から作る診断の配置)・
//     第三体あり(太陽–木星–イオ・太陽–地球–月)× 核(新則 invsq・旧則 sphere・bevel)。
//   T(非対称の 2 球の写し —— G = 0 の静止): 質量比 × 半径比 × 核。対称の配置(同じ球・鏡映の軸)で比 1(器の確かめ)。第三の球を置いた写し。
//   F(帳簿の流れ): 受け手を 1 つずつにした走行の和 = 全部の受け手の走行(流入・流出・熱・供給)—— 受け手ごとの局所の記帳か対で共有する予算かの区別。
//   U(AN373 の表 —— 新則・Wbg2 = 0・cap6500km): 在位の惑星 7 本・🌦️(地球・月)・🌔・木星–イオ・太陽–木星–イオの写しに initSpin・initMotion を宣言して
//     abs(u(0))/abs(V_obs,i − V_obs,k)(k = β 最大の源・同率は質量 → 番号)と abs(u(0))。第309便c の修正版の参照(正本 recheck-w309c.json)の同じ行を並べる。
//   H(帳簿の欄 —— AN365・AN371): 間隔が未宣言(省略・"step")/{tauHold}(本の刻み physics.stepDt の宣言あり・なし)・欄(実際の内部熱 E_i・帳簿の維持のコスト・背景からの供給)
//     が今の和と同じビット・潮汐の内部熱を宣言した写し(E_i へ入る)。
//
// ■ 言わないこと: 「二重計上を解消した」(規則は裁定待ち —— 測っただけ)・「帳簿が完全に閉じた」(器の範囲を数で)・「規則を決めた」・「完全に一致」・
//   「内部の温度が上がった」(帳簿の維持のコストは E_i へ入れない)・「τ_hold を導いた」。
//
// ■ 使い方
//   node tests/exp-w310b-pairheat.mjs   → 正本 tests/out/pairheat-w310b.json(段 pairheat-310b)
//   W310B_OUT=<json> で出力先を変える・W310B_TARGET=<html>(既定 beta/index.html)・W310B_QUICK=1(U の本を縮める —— 試走・正本は書かない)。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlHeadless } from './lib-w279b-headless.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import { idsFromDecl as idsJovian, buildConfigs as buildConfigs307 } from './exp-w307c-spindecomp.mjs';
import { planetIds } from './exp-w309c-recheck.mjs';
import * as L from './lib-w310b-pairheat.mjs';
import { pinDecl315c, LEGACY7_DATA_FILE } from './lib-w315c-legacy7.mjs';   // 第315便c(決断事項 AN406・R244): 在位の 7 本を K1 へ移した世代では、この器は移行の前(af2f426)の宣言の写しで測る
// 第281便a の領域 hash の宣言(器と lib から deriveScope で引いた下限 + 述語で探す 🌦️・🌔)
const REGEN_SCOPE = {"presets":["earthMoonOnly3d","earthMoonSunInertial3d","galaxy","galaxyGeo2","galaxyStd","jupiterGalilean","jupiterSunInertial3d","marsSunInertial3d","mercurySunInertial3d","neptuneSunInertial3d","saturnSunInertial3d","uranusSunInertial3d","venusSunInertial3d"],"roots":["$","HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.inertialDrag3HoldF","HP.sim","HP.validatePreset","INERTIAL_DRAG3_MAINT_SC","REL_DRAG_AXIS_HOLD_INTERVAL_UNDECLARED","REL_DRAG_AXIS_HOLD_LEDGER_VERSION","REL_DRAG_AXIS_HOLD_MAINT_VERSION","REL_DRAG_INIT_OBS_VERSION","REL_DRAG_INVSQ_VERSION","T","appStepDt","ckRestoreOne","ckSnapOne","ctx","cw","inertialDrag3SpinState","inertialDragInitObsRedo","inertialDragInitObsState","inertialDragInverseMap","inertialDragIsqState","retiredOf","sim"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w310b-pairheat-1';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (o) => JSON.parse(JSON.stringify(o));
const { dot, norm, sub, add, scale } = L;
const e4 = (v) => (v === null || v === undefined || !Number.isFinite(v)) ? (v === undefined ? null : v) : Number(v.toExponential(4));
const rel = (a, b) => Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b), 1e-300);
const pow10 = (e) => Number('1e' + e);

/* ───────── 規格(正本に記録 —— QA は正本から読む) ───────── */
export const KERNELS = Object.freeze(['invsq', 'sphere', 'bevel']);
export const INVSQ = Object.freeze({ invSq: { Wbg2: 0, order: 8 }, dragCoreDefault: 'cap6500km' });
export const MAINT = Object.freeze({ mode: 'maintain', reaction: 'background' });
/** 写しの走行: 1 步の刻み(本の画面の刻み h₀ の 1e-6 倍 —— 配置を t = 0 のまま読む)と核が走るまでの步の上限 */
export const RUN = Object.freeze({ hFrac: 1e-6, maxSteps: 4 });
/** 非対称の 2 球(G = 0 の静止): 質量比 q・半径比 ρ(受け手 B の値 / A の値)・旧則の W_bg と ε(第309便b の写しと同じ) */
export const TOY = Object.freeze({ qs: [1, 0.1, 0.01], rhos: [1, 0.25], d: 2, mA: 1, RA: 0.3, Wbg: 0.125, eps: 0.05, h: 0.016, tiltA: 20, azA: 30, tiltB: 50, azB: 100, sA: 0.6, sB: -0.4 });
/** 帳簿の欄の写しの步の数 */
export const HSTEPS = 6;

/* ───────── 写しの本 ───────── */
const toyPhysics = (extra) => Object.assign({ coord: '3d', G: 0, D0: 2, kFrame: 0, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, kappaT: 0.0001, cLight: 30, bM: 1, etaRad: 0, pRad: 4,
  gravityX: 0, gravityY: 0, geoPN: 0, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 0.01, stateCarry: 'double', massPrecision: 'double' }, extra || {});
const toyPreset = (bodies, phys) => ({ id: 'w310bToy', name: 'w310b toy', description: '器の中の写し(内蔵ではない)', emoji: '·', group: '運動と時空',
  sampleClass: 'principle', fidelity: 'toy', camera: { scale: 50 }, world: { boundary: 'none', size: 0 }, physics: toyPhysics(phys), bodies });
const axisDeg = (tiltDeg, azimuthDeg) => ({ enable: true, tiltDeg, azimuthDeg, source: 'w310b 器の宣言(診断)' });
const presetOf = (HP, id) => { const p = HP.allPresets().find((q) => q.id === id); if (!p) throw new Error('本が無い: ' + id); return clone(p); };
/** spinDrag の宣言(核の名前から —— 新則は bevel の軸の核) */
export function spinDragOf(kernel, hold, rot) {
  const sd = { rot: rot ? 'surfaceFlip' : 'off', axial: 'on', axialModel: kernel === 'invsq' ? 'bevel' : kernel };
  if (hold) sd.axisHold = hold;
  return sd;
}
/** 写しの relativeDrag: 新則は INVSQ(pairs は本のまま)・旧則は本の宣言(old —— 地球の本のように引きずりを宣言しない本は惑星の本の宣言を移す) */
function dragOf(kernel, old, hold, rot, extra) {
  const pairs = old && old.pairs ? old.pairs : 'all';
  if (kernel === 'invsq') return Object.assign({ law: 'inertial', ...clone(INVSQ), pairs, spinDrag: spinDragOf(kernel, hold, rot) }, extra || {});
  const rd = clone(old); delete rd.enabled; return Object.assign(rd, { spinDrag: spinDragOf(kernel, hold, rot) }, extra || {});
}
function simOf(H, p) {
  const v = H.HP.validatePreset(clone(p));
  if (!v.ok) return { err: JSON.stringify(v.errors || v.err).slice(0, 300) };
  const S = H.HP.coord3d.makeSim(); S.build(clone(v.preset));
  return { S, dt: H.evalExpr('appStepDt')(S), preset: v.preset };
}
const maintOf = (H, S) => { const st = H.evalExpr('inertialDrag3SpinState')(S); return st && st.axisHold ? st.axisHold.maintain : null; };
const axisOf = (S, k) => [S.sax[k], S.say[k], S.saz[k]];

/** 構成(写しの本の素 —— 核と axisHold は後から): key・ja・本の素(preset)・旧則の宣言(old)・天体の名前 */
export function configsOf(H) {
  const HP = H.HP, out = [];
  const pl = Object.fromEntries(planetIds(HP).map((id) => [id, presetOf(HP, id)]));
  const find = (re) => Object.keys(pl).find((id) => re.test(id));
  const oldPlanet = clone(pl[find(/^mercury/)].physics.relativeDrag);   // 惑星の本に共通の旧則の宣言(水星の k の移送 —— 地球の写しへ移す)
  for (const [key, re, nm] of [['SMe', /^mercury/, '水星'], ['SV', /^venus/, '金星'], ['SJ', /^jupiter/, '木星']]) {
    const p = pl[find(re)];
    out.push({ key, ja: '太陽–' + nm, base: p, old: clone(p.physics.relativeDrag), names: ['太陽', nm], from: p.id });
  }
  // 地球(🌦️ の写し): 太陽を動かす(受け手にする)・引きずりの対を全部へ・旧則は惑星の本の宣言を移す(🌦️ は引きずりを宣言しない —— enabled:false)
  const em = HP.allPresets().find((p) => p.physics && p.physics.coord === '3d' && p.bodies.length === 3 && p.physics.relativeDrag && p.timeRef && p.timeRef.pair && p.timeRef.pair[0] === 1 && p.timeRef.pair[1] === 2
    && p.scaleExp && p.bodies[0].pinned === true && Math.abs(p.bodies[1].m * pow10(p.scaleExp.M) / 5.9724e24 - 1) < 1e-3 && !H.evalExpr('retiredOf')(p));
  if (em) {
    const se = clone(em); se.bodies = se.bodies.slice(0, 2); se.bodies[0].pinned = false; se.timeRef = Object.assign({}, se.timeRef, { pair: [0, 1] });
    const old = Object.assign(clone(oldPlanet), { pairs: 'all' });
    out.push({ key: 'SE', ja: '太陽–地球(🌦️ の写し —— 月を外す)', base: se, old, names: ['太陽', '地球'], from: em.id });
    const sem = clone(em); sem.bodies[0].pinned = false;
    out.push({ key: 'SEM', ja: '太陽–地球–月(🌦️ の写し —— 第三体あり)', base: sem, old: clone(old), names: ['太陽', '地球', '月'], from: em.id });
  }
  // 木星–イオ・太陽–木星–イオ(第307便c の診断の配置 —— 🏀 の太陽と木星・木星系の本のイオを SI で受け取る)。🏀 の長さの単位(10⁹ m)ではイオの半径が
  //   明示半径の下限 0.01 に丸められる(1.8e6 m → 1e7 m)ので、水星の本の単位(10⁸ m・10⁴ s・10²⁷ kg —— 惑星の本に共通の旧則の宣言もこの単位)の写しに置く
  const ids = idsJovian(HP), cf = buildConfigs307(HP, ids), SJ3 = cf.configs.find((c) => c.key === 'SJIo'), tm = pl[find(/^mercury/)], e = tm.scaleExp;
  const Lm = pow10(e.L), T = pow10(e.T), M = pow10(e.M), R2D = 180 / Math.PI;
  //   位置は座標の上限(±5000 —— 受理の丸め)の内へ平行移動する(木星–イオは木星を原点・太陽–木星–イオは太陽と木星の中点を原点 —— 配置の相対は変えない)
  const bodyOfSI = (b, src, o) => ({ type: 'single', m: b.m / M, radius: b.R / Lm, x: (b.x[0] - o[0]) / Lm, y: (b.x[1] - o[1]) / Lm, z: (b.x[2] - o[2]) / Lm, vx: b.v[0] * T / Lm, vy: b.v[1] * T / Lm, vz: b.v[2] * T / Lm,
    spin: b.omega * T, pinned: false, spinAxis: { enable: true, tiltDeg: Math.acos(Math.max(-1, Math.min(1, b.axis[2]))) * R2D, azimuthDeg: ((Math.atan2(b.axis[1], b.axis[0]) * R2D) % 360 + 360) % 360, source: src } });
  const [sunSI, jupSI, ioSI] = SJ3.bodies;
  const mk = (bs) => { const q = clone(tm); q.bodies = bs; delete q.timeRef; q.orbitObs = { center: 0, orbiter: 1, ghostAmp: 20 }; return q; };
  const sJ = 'w310b 器の写し(🏀 の木星の極)', sIo = 'w310b 器の写し(イオの軸は木星の極 —— 第307便c の診断の配置)', sS = 'w310b 器の写し(🏀 の太陽の極)';
  const oJ = jupSI.x, oSJ = scale(add(sunSI.x, jupSI.x), 0.5);
  out.push({ key: 'JIo', ja: '木星–イオ(診断の配置)', base: mk([bodyOfSI(jupSI, sJ, oJ), bodyOfSI(ioSI, sIo, oJ)]), old: clone(oldPlanet), names: ['木星', 'イオ'], from: ids.jupiter + '+' + ids.jovian });
  out.push({ key: 'SJIo', ja: '太陽–木星–イオ(第三体あり)', base: mk([bodyOfSI(sunSI, sS, oSJ), bodyOfSI(jupSI, sJ, oSJ), bodyOfSI(ioSI, sIo, oSJ)]), old: clone(oldPlanet), names: ['太陽', '木星', 'イオ'], from: ids.jupiter + '+' + ids.jovian });
  return { configs: out, ioPlacement: cf.ioPlacement, emId: em ? em.id : null };
}
/** 写しの本: 核 kernel・axisHold hold・回転 rot・relativeDrag の足し extra */
export function copyOf(C, kernel, hold, rot, extra) {
  const p = clone(C.base);
  p.id = 'w310b_' + C.key; delete p.abBody; delete p.fitRecord;
  if (kernel !== 'invsq') for (const b of p.bodies) if (b.dragCore) delete b.dragCore;   // 旧則の軸の核(sphere・bevel)は dragCore と一緒に宣言しない(受理器)—— 旧則の写しだけ外す
  p.physics = { ...p.physics, relativeDrag: dragOf(kernel, C.old, hold, rot, extra) };
  return p;
}

/* ───────── R(相反 —— エンジン) ───────── */
/** 走行(核が走るまで): 対の記録の配列を置くか(rec)。戻り値 S と步の数 */
function runToKernel(H, p, rec) {
  const o = simOf(H, p);
  if (o.err) return o;
  const S = o.S, n = S.n, h = o.dt * RUN.hFrac;
  if (rec) S._rdHoldP = new Float64Array(n * n * 4);   // 器の写しの中だけ: 核が対ごとの ω_ij を書く(エンジンは維持の型でこの配列を読まない)
  let k = 0;
  for (; k < RUN.maxSteps; k++) { S.step(h); if (S.inertialDrag3MaintN > 0 && S.inertialDrag3MaintRcvN > 0) break; }
  return { S, h, steps: k + 1, dt: o.dt };
}
const STATE_KEYS = ['x', 'y', 'z', 'vx', 'vy', 'vz', 'spin', 'sax', 'say', 'saz', 'rotA', 'rotAIn', 'rotADr', '_rdMaintQ', '_rdMaintLast', '_rdWX', '_rdWY', '_rdWZ', '_rdWS'];
function sameState(H, A, B) {
  let d = 0;
  for (const k of STATE_KEYS) { const a = A[k], b = B[k]; if (!a && !b) continue; if (!a || !b) { d++; continue; } for (let i = 0; i < Math.min(a.length, b.length); i++) if (!Object.is(a[i], b[i])) d++; }
  for (const k of H.evalExpr('INERTIAL_DRAG3_MAINT_SC')) if (!Object.is(A[k], B[k])) d++;
  return d;
}
/** 対ごとの 1 次(エンジンの記録から) */
export function pairTable(H, S, names) {
  const n = S.n, PR = S._rdHoldP, f = H.HP.inertialDrag3HoldF(S), m = maintOf(H, S), rows = [];
  let sumBits = 0, espMax = 0;
  const E1 = [], I = [], flat = [];
  for (let i = 0; i < n; i++) {
    I[i] = f * S.m[i] * S.R[i] * S.R[i]; flat[i] = !S.saOn[i]; E1[i] = [];
    let wx = 0, wy = 0, wz = 0, ws = 0;
    for (let j = 0; j < n; j++) { const b = (i * n + j) * 4; wx += PR[b]; wy += PR[b + 1]; wz += PR[b + 2]; ws += PR[b + 3]; }
    if (!(Object.is(wx, S._rdWX[i]) && Object.is(wy, S._rdWY[i]) && Object.is(wz, S._rdWZ[i]) && Object.is(ws, S._rdWS[i]))) sumBits++;
    const a = axisOf(S, i);
    let e1s = 0;
    for (let j = 0; j < n; j++) {
      if (j === i) { E1[i][j] = null; continue; }
      const b = (i * n + j) * 4, q = L.firstOrder({ I: I[i], s: S.spin[i], a, flat: flat[i], omega: [PR[b], PR[b + 1], PR[b + 2]], sigma: PR[b + 3] });
      E1[i][j] = q.E1; e1s += q.E1;
    }
    const last = m.lastStep[i];
    if (m.heat.sink[i] !== null && last[1] !== 0) {
      const e2 = L.secondOrder({ I: I[i], flat: flat[i], omegaD: [S._rdWX[i], S._rdWY[i], S._rdWZ[i]], sigmaD: S._rdWS[i] });
      espMax = Math.max(espMax, rel(e1s + e2, last[1]));
    }
  }
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
    const r = L.reciprocity(E1[i][j], E1[j][i]), d = L.dropLargerSide(E1[i][j], E1[j][i], I[i], I[j]);
    const ci = S.spin[j] !== 0 ? E1[i][j] / (I[i] * S.spin[i] * S.spin[j]) : null, cj = S.spin[i] !== 0 ? E1[j][i] / (I[j] * S.spin[j] * S.spin[i]) : null;
    rows.push({ i, j, recv: names[i], src: names[j], Ii: e4(I[i]), Ij: e4(I[j]), IiOverIj: e4(I[i] / I[j]), si: e4(S.spin[i]), sj: e4(S.spin[j]), flat: [flat[i], flat[j]],
      Eij: e4(r.Eij), Eji: e4(r.Eji), ratio: e4(r.ratio), asym: e4(r.asym), absLogRatio: e4(r.absLogRatio), sameSign: r.sameSign,
      cij: e4(ci), cji: e4(cj), IcRatio: (ci !== null && cj !== null && cj !== 0) ? e4((I[i] * ci) / (I[j] * cj)) : null,
      keptSide: d.keptSide === 'i' ? names[i] : names[j], droppedOverKept: e4(d.droppedOverKept), totalChangeRel: e4(d.totalChangeRel) });
  }
  return { rows, sumBitsDiff: sumBits, espRelMax: espMax, E1: E1.map((r) => r.map(e4)), I: I.map(e4), espeed: m.lastStep.map((l) => e4(l[1])), sink: m.heat.sink };
}
export function partR(H) {
  const { configs, ioPlacement } = configsOf(H), out = [];
  for (const C of configs) for (const kernel of KERNELS) {
    const p = copyOf(C, kernel, MAINT, false);
    const a = runToKernel(H, p, true);
    if (a.err) { out.push({ key: C.key, kernel, err: a.err }); continue; }
    const b = runToKernel(H, p, false);
    const t = pairTable(H, a.S, C.names);
    out.push({ key: C.key, ja: C.ja, from: C.from, kernel, steps: a.steps, events: a.S.inertialDrag3MaintN, n: a.S.n, injectStateDiff: sameState(H, a.S, b.S), ...t });
  }
  return { rows: out, ioPlacement, run: RUN };
}

/* ───────── T(非対称の 2 球の写し) ───────── */
function twoBall(kernel, q, rho, mirror, third) {
  const A = { type: 'single', m: TOY.mA, radius: TOY.RA, x: -TOY.d / 2, y: 0, z: 0, vx: 0, vy: 0, vz: 0, spin: TOY.sA, pinned: false, spinAxis: axisDeg(TOY.tiltA, TOY.azA) };
  const B = mirror ? { type: 'single', m: TOY.mA, radius: TOY.RA, x: TOY.d / 2, y: 0, z: 0, vx: 0, vy: 0, vz: 0, spin: TOY.sA, pinned: false, spinAxis: axisDeg(TOY.tiltA, 180 - TOY.azA) }
    : { type: 'single', m: TOY.mA * q, radius: TOY.RA * rho, x: TOY.d / 2, y: 0.3, z: 0.2, vx: 0, vy: 0, vz: 0, spin: TOY.sB, pinned: false, spinAxis: axisDeg(TOY.tiltB, TOY.azB) };
  const bodies = [A, B];
  if (third) bodies.push({ type: 'single', m: TOY.mA * 2, radius: TOY.RA, x: 0.3, y: 2.2, z: -0.4, vx: 0, vy: 0, vz: 0, spin: 0.2, pinned: false, spinAxis: axisDeg(35, 250) });
  const rd = kernel === 'invsq' ? { law: 'inertial', invSq: { Wbg2: 0, order: 8 }, pairs: 'all', spinDrag: spinDragOf(kernel, MAINT, false) }
    : { law: 'inertial', Wbg: TOY.Wbg, eps: TOY.eps, pairs: 'all', spinDrag: spinDragOf(kernel, MAINT, false) };
  return toyPreset(bodies, { relativeDrag: rd });
}
function toyRun(H, p) {
  const o = simOf(H, p);
  if (o.err) return o;
  const S = o.S;
  S._rdHoldP = new Float64Array(S.n * S.n * 4);
  let k = 0; for (; k < RUN.maxSteps; k++) { S.step(TOY.h * RUN.hFrac); if (S.inertialDrag3MaintN > 0 && S.inertialDrag3MaintRcvN > 0) break; }
  return { S, steps: k + 1 };
}
export function partT(H) {
  const rows = [];
  for (const kernel of KERNELS) {
    const sym = toyRun(H, twoBall(kernel, 1, 1, true, false));
    if (sym.err) rows.push({ kernel, case: 'mirror', err: sym.err });
    else { const t = pairTable(H, sym.S, ['A', 'B']); rows.push({ kernel, case: 'mirror', q: 1, rho: 1, ...t.rows[0], sumBitsDiff: t.sumBitsDiff, espRelMax: t.espRelMax }); }
    for (const q of TOY.qs) for (const rho of TOY.rhos) {
      const r = toyRun(H, twoBall(kernel, q, rho, false, false));
      if (r.err) { rows.push({ kernel, case: 'pair', q, rho, err: r.err }); continue; }
      const t = pairTable(H, r.S, ['A', 'B']);
      rows.push({ kernel, case: 'pair', q, rho, ...t.rows[0], sumBitsDiff: t.sumBitsDiff, espRelMax: t.espRelMax });
    }
    for (const q of [1, 0.1]) {
      const r = toyRun(H, twoBall(kernel, q, 1, false, true));
      if (r.err) { rows.push({ kernel, case: 'third', q, rho: 1, err: r.err }); continue; }
      const t = pairTable(H, r.S, ['A', 'B', 'C']);
      rows.push({ kernel, case: 'third', q, rho: 1, ...t.rows[0], sumBitsDiff: t.sumBitsDiff, espRelMax: t.espRelMax });
    }
  }
  return { rows, toy: TOY };
}

/* ───────── F(帳簿の流れ) ───────── */
export function partF(H) {
  const { configs } = configsOf(H), rows = [];
  const pick = configs.filter((c) => ['SMe', 'SJ', 'JIo', 'SJIo'].includes(c.key));
  for (const C of pick) for (const kernel of KERNELS) {
    const n = C.base.bodies.length, run = (rc) => { const h = rc ? Object.assign({}, MAINT, { receivers: rc }) : MAINT; const r = runToKernel(H, copyOf(C, kernel, h, false), false); return r; };
    const all = run(null);
    if (all.err) { rows.push({ key: C.key, kernel, err: all.err }); continue; }
    const parts = [], spinsSame = [];
    for (let i = 0; i < n; i++) {
      const r = run([i]); parts.push(L.flowOf(maintOf(H, r.S)));
      spinsSame.push(Array.from(r.S.spin.subarray(0, n)).every((x, k) => Object.is(x, all.S.spin[k])) && [0, 1, 2].every((c) => Array.from({ length: n }, (_, k) => axisOf(r.S, k)[c]).every((x, k) => Object.is(x, axisOf(all.S, k)[c]))));
    }
    const fa = L.flowOf(maintOf(H, all.S)), ad = L.additivity(fa, parts);
    rows.push({ key: C.key, kernel, n, flowAll: { fieldE: e4(fa.fieldE), sinkE: e4(fa.sinkE), heat: e4(fa.heat), supply: e4(fa.supply) },
      flowParts: parts.map((p, i) => ({ body: C.names[i], fieldE: e4(p.fieldE), sinkE: e4(p.sinkE), heat: e4(p.heat), supply: e4(p.supply), speedSigned: e4(p.speedSigned) })),
      additivity: Object.fromEntries(Object.entries(ad).map(([k, v]) => [k, e4(v)])), statesSame: spinsSame.every(Boolean), sharedAccount: false });
  }
  return { rows };
}

/* ───────── U(AN373 の表 —— 新則) ───────── */
export function partU(H, quick) {
  const { configs } = configsOf(H), HP = H.HP, rows = [];
  let ref = null; try { ref = JSON.parse(fs.readFileSync(path.join(ROOT, 'tests', 'out', 'recheck-w309c.json'), 'utf8')); } catch (e) { ref = null; }
  const books = [];
  for (const id of planetIds(HP)) { const p = presetOf(HP, id); books.push({ key: id, base: p, names: ['太陽', null], refKey: id }); }
  const { emId } = configsOf(H); if (emId) books.push({ key: emId, base: presetOf(HP, emId), names: ['太陽', '地球', '月'], refKey: null });   // 在位の宣言のまま(太陽は pinned —— 受け手にしない)
  const eo = HP.allPresets().find((p) => p.physics && p.physics.coord === '3d' && p.bodies.length === 2 && p.timeRef && p.scaleExp && Math.abs(p.bodies[0].m * pow10(p.scaleExp.M) / 5.9724e24 - 1) < 1e-3
    && Math.abs(p.bodies[1].m * pow10(p.scaleExp.M) / 7.346e22 - 1) < 1e-3 && !H.evalExpr('retiredOf')(p));
  if (eo) books.push({ key: eo.id, base: clone(eo), names: ['地球', '月'], refKey: null });
  for (const k of ['JIo', 'SJIo']) { const c = configs.find((x) => x.key === k); books.push({ key: k, base: c.base, names: c.names, refKey: k }); }
  const use = quick ? books.filter((b) => /^mercury|JIo$/.test(b.key)) : books;
  for (const B of use) {
    const C = { key: B.key, base: B.base, old: B.base.physics.relativeDrag || {} };
    const p = copyOf(C, 'invsq', null, true, { initMotion: 'observed' });
    p.physics.relativeDrag.spinDrag.initSpin = 'observed';
    const o = simOf(H, p);
    if (o.err) { rows.push({ key: B.key, err: o.err }); continue; }
    const S = o.S, n = S.n, st = H.evalExpr('inertialDragInitObsState')(S), iq = H.evalExpr('inertialDragIsqState')(S), sc = p.scaleExp, vSI = pow10(sc.L - sc.T);
    const names = B.names.map((x, i) => x || (B.base.bodies[i] && B.base.bodies[i].spinAxis && /の(\S+?)の極/.exec(B.base.bodies[i].spinAxis.source || '') ? /の(\S+?)の極/.exec(B.base.bodies[i].spinAxis.source)[1] : '天体' + i));
    const mass = Array.from(S.m.subarray(0, n));
    const refC = ref && B.refKey ? ref.recheck.configs.find((c) => c.key === B.refKey) : null;
    for (let i = 0; i < n; i++) {
      const rr = iq.receivers.find((r) => r.i === i), mr = st.motion.rows[i];
      if (!rr || !mr || S.pinned[i]) continue;
      const k = L.dominantSource(rr.beta, mass, i), Vi = mr.V, Vk = k >= 0 ? st.motion.rows[k].V : null, ix = L.motionIndex(mr.u, Vi, Vk);
      const rf = refC ? refC.rows[i] : null;
      rows.push({ key: B.key, from: B.base.id || B.key, body: names[i], i, k, src: k >= 0 ? names[k] : null, betaK: k >= 0 ? e4(rr.beta[k]) : null, sumBeta: e4(rr.betaSum),
        uAbsSI: e4(ix.uAbs * vSI), denomSI: ix.denom === null ? null : e4(ix.denom * vSI), ratio: e4(ix.ratio),
        refUAbs: rf ? rf.uAbs : null, refRatio: rf ? rf.uOverVrel : null, refBody: rf ? rf.body : null,
        ratioVsRef: (rf && rf.uOverVrel && ix.ratio) ? e4(ix.ratio / rf.uOverVrel - 1) : null });
    }
  }
  return { rows, refSource: ref ? 'tests/out/recheck-w309c.json(第309便c の修正版の参照 —— recheck.configs の rows の uAbs・uOverVrel)' : null };
}

/* ───────── H(帳簿の欄 —— AN365・AN371) ───────── */
function threeBody(hold, phys) {
  const bodies = [
    { type: 'single', m: 1, radius: 0.3, x: -1.5, y: 0.4, z: 0.3, vx: 0, vy: 0, vz: 0, spin: 0.6, pinned: false, spinAxis: axisDeg(20, 30) },
    { type: 'single', m: 0.4, radius: 0.2, x: 1.8, y: -0.5, z: -0.6, vx: 0, vy: 0, vz: 0, spin: -0.4, pinned: false },
    { type: 'single', m: 0.7, radius: 0.25, x: 0.2, y: 2.1, z: 0.9, vx: 0, vy: 0, vz: 0, spin: 0.3, pinned: false, spinAxis: axisDeg(50, 100) }];
  return toyPreset(bodies, Object.assign({ relativeDrag: { law: 'inertial', Wbg: TOY.Wbg, eps: TOY.eps, pairs: 'all', spinDrag: spinDragOf('sphere', hold, false) } }, phys || {}));
}
export function partH(H) {
  const rows = [];
  const cases = [['omitted', { mode: 'maintain' }, null], ['step', { mode: 'maintain', heatTiming: 'step', reaction: 'background' }, null],
    ['tauHold', { mode: 'maintain', heatTiming: { tauHold: 0.04 } }, null], ['tauHoldStepDt', { mode: 'maintain', heatTiming: { tauHold: 0.016 } }, { stepDt: 0.016 }],
    ['tauHoldStepDt2', { mode: 'maintain', heatTiming: { tauHold: 0.016 }, reaction: 'background' }, { stepDt: 0.008 }]];
  for (const [label, hold, phys] of cases) {
    const o = simOf(H, threeBody(hold, phys));
    if (o.err) { rows.push({ label, err: o.err }); continue; }
    const S = o.S;
    for (let k = 0; k < HSTEPS; k++) S.step(TOY.h);
    const m = maintOf(H, S), c = m.columns, hi = m.holdInterval;
    const perIn = c.perBody.internalE.reduce((s, x) => s + (x || 0), 0), perLed = c.perBody.ledgerCost.reduce((s, x) => s + (x || 0), 0);
    rows.push({ label, holdInterval: hi, ledgerVersion: m.ledgerVersion, heatTiming: m.heatTiming,
      columns: { internalE: c.internalE, ledgerCost: c.ledgerCost, backgroundSupply: c.backgroundSupply },
      sameAsSums: Object.is(c.internalE, m.heat.toInternal) && Object.is(c.ledgerCost, m.heat.toLedger) && Object.is(c.backgroundSupply, m.speed.supply),
      perBodyRel: e4(rel(perIn + perLed, m.heat.total)), weight: e4(m.events / m.steps) });
  }
  // 潮汐の内部熱を宣言した写し(金星の写し —— 惑星だけ明示潮汐・内部熱の線形の緩和 —— 第309便b の写しと同じ規格化): E_i へ入る欄と帳簿だけの欄
  const tide = (() => {
    const p0 = H.HP.allPresets().find((q) => q.id === planetIds(H.HP).find((id) => /^venus/.test(id)));
    const p = clone(p0); p.id = 'w310b_venusTide'; delete p.abBody; delete p.fitRecord;
    const tp = p.timeRef.pRef, sun = p.bodies[0], pl = p.bodies[1], G = p.physics.G, r0 = norm(sub([pl.x, pl.y, pl.z], [sun.x, sun.y, sun.z]));
    delete pl.spinAxis;
    p.physics = { ...p.physics, relativeDrag: { ...p.physics.relativeDrag, spinDrag: spinDragOf('sphere', MAINT, false) } };
    const I = 0.4 * pl.m * pl.radius * pl.radius, tauT = 4 * tp;
    pl.tide = { k2: 1, lag: I * Math.pow(r0, 6) / (tauT * 3 * G * sun.m * sun.m * Math.pow(pl.radius, 5)) };
    p.physics.tide = { maxN: 4, inertia: 'sphere', heat: { model: 'linear', tau: tp } };
    const o = simOf(H, p); if (o.err) return { err: o.err };
    const S = o.S; for (let k = 0; k < 20; k++) S.step(o.dt);
    const m = maintOf(H, S), c = m.columns;
    return { internalE: e4(c.internalE), ledgerCost: e4(c.ledgerCost), backgroundSupply: e4(c.backgroundSupply), perBody: { internalE: c.perBody.internalE.map(e4), ledgerCost: c.perBody.ledgerCost.map(e4) },
      sink: m.heat.sink, sameAsSums: Object.is(c.internalE, m.heat.toInternal) && Object.is(c.ledgerCost, m.heat.toLedger) && Object.is(c.backgroundSupply, m.speed.supply),
      holdInterval: m.holdInterval, stepDt: o.dt };
  })();
  return { rows, tide, version: H.evalExpr('REL_DRAG_AXIS_HOLD_LEDGER_VERSION'), label: H.evalExpr('REL_DRAG_AXIS_HOLD_INTERVAL_UNDECLARED') };
}

/* ───────── 門と表 ───────── */
export function gatesOf(J) {
  const g = {};
  g.pure = J.P.pass;
  const R = J.R.rows.filter((r) => !r.err);
  g.builtR = J.R.rows.every((r) => !r.err) && R.length >= 21;
  g.injectionNeutral = R.every((r) => r.injectStateDiff === 0);
  g.pairSumBits = R.every((r) => r.sumBitsDiff === 0) && J.T.rows.filter((r) => !r.err).every((r) => r.sumBitsDiff === 0);
  g.firstPlusSecond = R.every((r) => r.espRelMax < 1e-12) && J.T.rows.filter((r) => !r.err).every((r) => r.espRelMax < 1e-12);
  g.mirrorReciprocal = J.T.rows.filter((r) => r.case === 'mirror').length === 3 && J.T.rows.filter((r) => r.case === 'mirror').every((r) => !r.err && Math.abs(r.asym) < 1e-12);
  g.builtT = J.T.rows.every((r) => !r.err);
  g.ledgerLocal = J.F.rows.length >= 12 && J.F.rows.every((r) => !r.err && r.statesSame && Object.values(r.additivity).every((x) => x < 1e-12));
  g.tableU = J.U.rows.length >= (J.quick ? 3 : 12) && J.U.rows.every((r) => !r.err) && J.U.rows.every((r) => r.ratio === null || r.ratio > 0);
  const Hr = J.H.rows;
  g.holdInterval = Hr.length === 5 && Hr.every((r) => !r.err) && Hr.filter((r) => r.label === 'omitted' || r.label === 'step').every((r) => r.holdInterval.declared === false && r.holdInterval.timing === 'step' && r.holdInterval.label === J.H.label)
    && Hr.filter((r) => /^tauHold/.test(r.label)).every((r) => r.holdInterval.declared === true && r.holdInterval.timing === 'tauHold')
    && Hr.find((r) => r.label === 'tauHold').holdInterval.basis.h0 === null && Hr.find((r) => r.label === 'tauHoldStepDt').holdInterval.basis.ratio === 1
    && Hr.find((r) => r.label === 'tauHoldStepDt2').holdInterval.basis.ratio === 2;
  g.columns = Hr.every((r) => r.sameAsSums && r.perBodyRel < 1e-14) && J.H.tide && !J.H.tide.err && J.H.tide.sameAsSums && J.H.tide.internalE > 0;
  return g;
}
const f4 = (x) => (x === null || x === undefined) ? '—' : (typeof x === 'number' ? (x === 0 ? '0' : (Math.abs(x) >= 1e-3 && Math.abs(x) < 1e4 ? Number(x.toPrecision(4)).toString() : x.toExponential(3).replace('e+', 'e'))) : String(x));
// 第310便(統括の統合): 丸めの程度の欄(破れ・帳簿の和の差)は床より小さいとき「< 床」と書く —— 核の計算の丸めの順
//   (枝 a の自己の場の前計算)や CI の Node の版で 1e-15〜1e-17 の桁が動いても、表と QA の逐語照合が揺れないように
const fz = (x, floor) => (typeof x === 'number' && x !== 0 && Number.isFinite(x) && Math.abs(x) < floor) ? '< ' + floor.toExponential(0) : f4(x);
/** PHYSICS〔第310便b〕の表(正本から作る —— QA docs.pairHeat310 が同じ関数で作り直して逐語照合) */
export function physicsTables(J) {
  const L1 = ['| 構成 | 核 | 受け手 i | 源 j | I_i/I_j | E⁽¹⁾_{i←j} | E⁽¹⁾_{j←i} | 比 | 破れ (E_ij − E_ji)/max | 同符号 | 大きい I の側を外すと外れる量/残る量 |', '|---|---|---|---|---|---|---|---|---|---|---|'];
  for (const r of J.R.rows) for (const q of r.rows) L1.push(`| ${r.key} | ${r.kernel} | ${q.recv} | ${q.src} | ${f4(q.IiOverIj)} | ${f4(q.Eij)} | ${f4(q.Eji)} | ${f4(q.ratio)} | ${fz(q.asym, 1e-12)} | ${q.sameSign ? '同' : '逆'} | ${f4(q.droppedOverKept)} |`);
  const L2 = ['| 核 | 型 | 質量比 q | 半径比 ρ | E⁽¹⁾_{A←B} | E⁽¹⁾_{B←A} | 比 | 破れ | 同符号 |', '|---|---|---|---|---|---|---|---|---|'];
  for (const r of J.T.rows) L2.push(`| ${r.kernel} | ${r.case} | ${f4(r.q)} | ${f4(r.rho)} | ${f4(r.Eij)} | ${f4(r.Eji)} | ${f4(r.ratio)} | ${fz(r.asym, 1e-12)} | ${r.sameSign ? '同' : '逆'} |`);
  const L3 = ['| 構成 | 核 | 受け手ごとの流入(合成場 ΔE = −E_speed) | 受け手ごとの供給 | 全部の受け手の走行との差(熱・流入 E・受け皿 L) | 相手の状態 |', '|---|---|---|---|---|---|'];
  for (const r of J.F.rows) L3.push(`| ${r.key} | ${r.kernel} | ${r.flowParts.map((q) => q.body + ' ' + f4(q.fieldE)).join('・')} | ${r.flowParts.map((q) => f4(q.supply)).join('・')} | ${fz(r.additivity.heat, 1e-14)}・${fz(r.additivity.fieldE, 1e-14)}・${fz(r.additivity.sinkL, 1e-14)} | ${r.statesSame ? 'ビット不変' : '動いた'} |`);
  const L4 = ['| 本 | 受け手 | 支配的な源 k | β_ik | Σβ | abs(u(0)) [m/s] | abs(V_obs,i − V_obs,k) [m/s] | 指標 | 第309便c の参照の指標 | 参照との差 |', '|---|---|---|---|---|---|---|---|---|---|'];
  for (const r of J.U.rows) L4.push(`| ${r.key} | ${r.body} | ${r.src || '—'} | ${f4(r.betaK)} | ${f4(r.sumBeta)} | ${f4(r.uAbsSI)} | ${f4(r.denomSI)} | ${f4(r.ratio)} | ${f4(r.refRatio)} | ${f4(r.ratioVsRef)} |`);
  return [L1, L2, L3, L4].map((x) => x.join('\n')).join('\n\n');
}
export function docNumbers(J) {
  const out = [], R = (k, kernel) => J.R.rows.find((x) => x.key === k && x.kernel === kernel);
  for (const [k, kernel] of [['SMe', 'invsq'], ['SV', 'invsq'], ['SE', 'invsq'], ['SJ', 'invsq'], ['JIo', 'invsq'], ['SMe', 'sphere'], ['SMe', 'bevel'], ['JIo', 'sphere']]) { const r = R(k, kernel); if (r && r.rows[0]) out.push(f4(r.rows[0].ratio)); }
  const sj = R('SJIo', 'sphere'); if (sj && sj.rows[0]) out.push(f4(sj.rows[0].ratio));
  const em = R('SEM', 'invsq'); if (em) { const q = em.rows.find((x) => x.recv === '地球' && x.src === '月'); if (q) out.push(f4(q.ratio)); }
  const tv = J.T.rows.filter((r) => r.kernel === 'invsq' && r.case === 'pair').map((r) => r.ratio);
  if (tv.length) out.push(f4(Math.min(...tv)), f4(Math.max(...tv)));
  const io = J.U.rows.find((r) => r.key === 'JIo' && r.body === 'イオ'), me = J.U.rows.find((r) => /^mercury/.test(r.key) && r.body === '水星');
  if (io) out.push(f4(io.ratio), f4(io.uAbsSI)); if (me) out.push(f4(me.ratio), f4(me.uAbsSI));
  return out.filter((x) => x !== '—' && x !== '0');
}
export function runAll(H, { quick = false } = {}) {
  const t = {};
  let t0 = Date.now();
  const lap = (k) => { t[k] = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now(); };
  const P = L.checksOf(); lap('P');
  const R = partR(H); lap('R');
  const T = partT(H); lap('T');
  const F = partF(H); lap('F');
  const U = partU(H, quick); lap('U');
  const Hh = partH(H); lap('H');
  const J = { quick, kernels: KERNELS, invsq: INVSQ, P, R, T, F, U, H: Hh };
  J.gates = gatesOf(J);
  J.ok = Object.values(J.gates).every(Boolean);
  J.timing = t;
  return J;
}
export async function main() {
  const TARGET = process.env.W310B_TARGET || 'beta/index.html';
  const QUICK = process.env.W310B_QUICK === '1';
  const OUT = process.env.W310B_OUT || path.join(ROOT, 'tests', 'out', 'pairheat-w310b.json');
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now();
  const W281A_SCOPE = w281aScopeStamp(html, REGEN_SCOPE);
  const H = loadHtmlHeadless(html);
  pinDecl315c(H.evalExpr);   // 第315便c(AN406): 在位の 7 本の宣言を移行の前の写しへ(本ごとの門 —— 基点の html では no-op・正本の欄は足さない)
  const R = runAll(H, { quick: QUICK });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w310b-pairheat.mjs', target: TARGET,
    targetSha256: crypto.createHash('sha256').update(fs.readFileSync(html)).digest('hex'),
    ruling: '決断事項 AN370(対の熱 —— 相反の関係を測る・規則は裁定待ち)・AN373・AN365・AN371・原仮定者の裁定(第107報・第108報)・統括の検証項目 R223',
    maintainVersion: H.evalExpr('REL_DRAG_AXIS_HOLD_MAINT_VERSION'), ledgerVersion: H.evalExpr('REL_DRAG_AXIS_HOLD_LEDGER_VERSION'), invsqVersion: H.evalExpr('REL_DRAG_INVSQ_VERSION'), ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w310b-pairheat.mjs', 'tests/lib-w315c-legacy7.mjs', 'tests/lib-w310b-pairheat.mjs', 'tests/exp-w309c-recheck.mjs', 'tests/exp-w307c-spindecomp.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第310便b', target: TARGET, code: CODE, inputs: [TARGET, LEGACY7_DATA_FILE, 'tests/out/recheck-w309c.json'] }), {
    harnessVersion: HARNESS_VERSION,
    engine: 'Node の headless(tests/lib-w279b-headless.mjs の loadHtmlHeadless —— html の本文をそのまま実行・1 プロセス)',
    notClaim: ['規則を決めた', '帳簿が完全に閉じた', '完全に一致', '内部の温度が上がった', 'τ_hold を導いた'] });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  if (!QUICK || process.env.W310B_OUT) { fs.mkdirSync(path.dirname(OUT), { recursive: true }); fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n'); }
  console.log('→', QUICK && !process.env.W310B_OUT ? '(試走 —— 正本は書かない)' : path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(Object.entries(out.gates).filter(([, v]) => !v).map(([k]) => k)), out.elapsedS + ' s', JSON.stringify(out.timing));
}
if (IS_MAIN) await main();
