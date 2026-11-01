// 第322便a(原仮定者の予定(第123報)「geoPN=2の予定: 3D対応する。現状、最も銀河を再現しているのがgalaxyGeo2であり、引きずり近似としての需要が有る」・
// 原仮定者の回答(2026-11-01 —— AN499・AN500「3D銀河プリセットは、傾き無しと有りの両方を用意する」)・DECISIONS v81 の AN504・統括の検証項目 R270):
// **geoPN=2(v−u 則)の 3D の S2 の器**(段 geo2flat-322a —— 正本 tests/out/geo2flat-w322a.json)。
//
// 対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み(html の本文をそのまま実行 —— QA は tests/lib-w279b-headless.mjs の headless で同じ段を試走の計画で回す)、三次元の步 dfmStep3 → dfmCore3G2
// (第322便a で v−u 則の輸送の 3 成分を接続した核)を、二次元の步(`S._core` の geoPN=2)と第321便a の純関数 tests/lib-w321a-geo2v3.mjs(版 w321a-geo2v3-1)と比べる。
//
// ■ 段(W322A_PART で絞れる)
//   gate   平面の 3D 銀河の本 galaxyGeo2Flat3d の外縁帯 [156,286] の増強 kF1/kF0(claim galaxygeo2.outer-boost-ratio と同じ手続き —— HP.loadPreset → HP.abStart('kFrame', 0)・
//          12000 步 × dt 0.016)が二次元の 💫 の凍結の基準 1.1800727845699235 と同じビットか(6000 步の途中の値も記録)・クランプ 0・z = v_z = 0・軸 +z
//   degen  面への退化: 三次元の html の步と二次元の html の步の全状態(x・y・v・自転・u の履歴・rotA・口座・t)の照合(galaxyGeo2 の写し semi/leapfrog・小さい系の
//          D₀ = 0・q = 1.5・倍精度の宣言)—— 同じビット
//   pure   非平面(傾いた自転軸・固定中心・z ≠ 0)の小さい系で、三次元の html の步と純関数の步(spinPolicy "vector")の全状態と口座の照合(単精度と倍精度・semi/leapfrog)
//   hist   初回の u の履歴(1 步目は蹴らない —— kFrame=1 の 1 步目 = kFrame=0 の 1 步目・2 步目から蹴る)
//   ckpt   保存と復帰(ckSnapOne → M 步 → ckRestoreOne → M 步 が保存しなかった走行と同じビット・uPz を塗ると違う)・A/B の複製(cloneSimState)の M 步が元と同じビット
//   ledger 口座: 非平面の小さい系の運動量・角運動量の閉じ(リザーバ resP・resL と固定中心の拘束 conP・conL を含む —— 倍精度の状態・単精度の場の配列)・
//          平面の本の P_z・L_x・L_y が 0 のまま
//   table  受理と実行の門の表(範囲の内は受理・範囲の外の宣言は全部拒否 —— 理由の鍵)
//   trial  傾き有り(円盤の incl・node と中心の自転軸を同じ直交回転で回した正規の宣言)と有限厚(build の後に器が z・v_z を置く試走)の対を同じ窓で
//          (面内の比・面の外への広がり・脱落・エネルギーの台帳)/AN510 の 2 案(軸を有効化しない粒子の軸を力学で回す "vector" と回さない "parallel")の差を
//          純関数の小さい系で(平面では差 0)
//
// ■ 試走: W322A_QUICK=1(W322A_OUT が要る —— 正本を書かない・gate と trial を縮める)。W322A_WORKERS(既定 2 —— gate・trial の重い行を子プロセスで並走)。
// ■ 言わないこと: 3D で銀河を表せたと書かない(面内の写し —— 二次元と同じ式の同じ演算列)・傾き有りと有限厚の本はまだ無い(器の試走だけ)・
//   退化の照合を法則の確かめと書かない・galaxyGeo2 の外縁の比は原理の本の機構の値(実在の銀河の観測の較正ではない)。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as G3 from './lib-w321a-geo2v3.mjs';
// 第281便a の領域 hash の宣言(器と lib から deriveScope で引いた下限 —— 読む本は galaxyGeo2Flat3d と galaxyGeo2〔.find で引く〕・ほかは器の中の小さい系の本を受理に通す)
const REGEN_SCOPE = {"presets":["galaxyGeo2","galaxyGeo2Flat3d"],"roots":["HP.ab","HP.abStart","HP.abStop","HP.allPresets","HP.coord3d","HP.loadPreset","HP.sim","HP.validatePreset","ckRestoreOne","ckSnapOne","cloneSimState","sim"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w322a-geo2flat-1';
export const OUT_GEO2FLAT = 'tests/out/geo2flat-w322a.json';
const TARGET = process.env.W322A_TARGET || 'beta/index.html';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (x) => JSON.parse(JSON.stringify(x));
export const BOOK_ID = 'galaxyGeo2Flat3d', GAL2D_ID = 'galaxyGeo2';
/** 二次元の 💫 の凍結の基準(第321便a の正本 tests/out/geo2v3-w321a.json の段 base の h 行 —— refit-297a の段 galaxy と同じビット)。 */
export const FROZEN = Object.freeze({ ratio: 1.1800727845699235, window: Object.freeze([1.14, 1.23]), steps: 12000, mid: 6000, dt: 0.016, band: Object.freeze([156, 286]) });
export const PLAN = Object.freeze({ dt: 0.016, gateSteps: 12000, gateMid: 6000, degenGal: 120, degenGalLf: 60, degenSmall: 40, pureSteps: 30, histSteps: 3, ckN: 20, ckM: 20,
  ledgerSteps: 400, flatLedgerSteps: 300, trialSteps: 12000, trialMid: 6000, an510Steps: 400, an510Disk: 40, tiltIncl: 30, tiltNode: 40, thickH: 8, thickSeed: 20261101 });
export const QUICK = Object.freeze({ dt: 0.016, gateSteps: 600, gateMid: 300, degenGal: 12, degenGalLf: 6, degenSmall: 8, pureSteps: 6, histSteps: 3, ckN: 6, ckM: 6,
  ledgerSteps: 40, flatLedgerSteps: 30, trialSteps: 300, trialMid: 150, an510Steps: 40, an510Disk: 12, tiltIncl: 30, tiltNode: 40, thickH: 8, thickSeed: 20261101 });
const NOT_CLAIM = ['3D で銀河を表せたと書かない(面内の写し —— 二次元と同じ式の同じ演算列)', '傾き有りと有限厚の本はまだ無い(器の試走と設計だけ)',
  '退化の照合は同じ演算列の照合(法則の確かめではない)', 'galaxyGeo2 の外縁の比は原理の本の機構の値(実在の銀河の観測の較正ではない)', 'q 近似を導いた法則と呼ばない'];

/* ───────── 小さい系の本(第321便a の器と同じ物理の欄 —— 三次元の範囲の内)───────── */
const PH0 = Object.freeze({ G: 0.8, D0: 1.5, kFrame: 1, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, etaRad: 0, geoPN: 2, lambdaPN: 0, softening: 3, radiusScale: 1, cLight: 30, contactMode: 'none', frameWeight: 'share' });
export function bookOf(bodies, ph, extra) {
  return Object.assign({ name: 'w322a', description: 'w322a', sampleClass: 'principle', camera: { scale: 100 }, world: { boundary: 'none', size: 0 },
    physics: Object.assign({}, PH0, ph || {}), bodies: clone(bodies) }, extra || {});
}
const bookOf3 = (bodies, ph, extra) => bookOf(bodies, Object.assign({ coord: '3d' }, ph || {}), extra);
const sg = (m, x, y, vx, vy, spin, radius, pinned, z, vz, axis) => Object.assign({ type: 'single', m, x, y, vx, vy, spin, pinned: !!pinned, radius },
  z !== undefined ? { z, vz } : {}, axis ? { spinAxis: { enable: true, tiltDeg: axis[0], azimuthDeg: axis[1], source: 'w322a' } } : {});
export const SMALL = Object.freeze({
  b5: [sg(2500, 0, 0, 0, 0, 1.2, 15, true), sg(0.3, 120, 10, -0.4, 4.0, 0, 0.6), sg(0.45, -60, 150, -3.6, -1.5, 0.2, 0.7), sg(0.2, 30, -200, 3.3, 0.5, -0.1, 0.5), sg(0.5, -210, -40, 0.7, -3.3, 0, 0.8)],
  // 非平面の 6 体(傾いた自転軸の固定中心・傾いた軸の自転する粒子 —— 第321便a の B6 と同じ配置を受理器の宣言〔spinAxis.enable の傾きと方位〕で)
  n6: [sg(2500, 0, 0, 0, 0, 1.2, 15, true, 0, 0, [10.2, -33.7]), sg(0.3, 120, 10, -0.4, 4.0, 0, 0.6, false, 14, 0.3), sg(0.45, -60, 150, -3.6, -1.5, 0.2, 0.7, false, -22, -0.2, [19.9, 33.7]),
    sg(0.2, 30, -200, 3.3, 0.5, -0.1, 0.5, false, 35, 0.4, [32.6, 168.7]), sg(0.5, -210, -40, 0.7, -3.3, 0, 0.8, false, -9, -0.1), sg(0.35, 80, 90, -2.9, 2.4, 0.15, 0.65, false, 60, -0.6, [90, 90])] });

function simOf(HP, preset) {
  const v = HP.validatePreset(clone(preset));
  if (!v.ok) throw new Error('受理されない: ' + JSON.stringify(v.errors).slice(0, 300));
  const S = HP.coord3d.makeSim(); S.build(clone(v.preset));
  return S;
}
const bookCopy = (HP, id) => { const p = clone(HP.allPresets().find((q) => q.id === id)); delete p.claims; return p; };
/** 二次元の 💫 を三次元の本の写しの宣言に(本の宣言と同じ —— 器の照合の入力)。 */
function flatOf(p) { const q = clone(p); q.physics = Object.assign({}, q.physics, { coord: '3d' }); q.overlays = Object.assign({}, q.overlays, { mechSpectrum: false }); return q; }
const bitsOf = (a, b) => { let nd = 0; for (let i = 0; i < a.length; i++) if (!Object.is(a[i], b[i])) nd++; return nd; };

/* ───────── gate(子プロセスでも走る 1 行)───────── */
const outer = (S, frame) => { let sum = 0, c = 0;
  for (let i = 1; i < S.n; i++) {
    let x = S.x[i], y = S.y[i], vx = S.vx[i], vy = S.vy[i];
    if (frame) { const r = G3.mv3(frame.T, [S.x[i], S.y[i], S.z ? S.z[i] : 0]), v = G3.mv3(frame.T, [S.vx[i], S.vy[i], S.vz ? S.vz[i] : 0]); x = r[0]; y = r[1]; vx = v[0]; vy = v[1]; }
    const rr = Math.hypot(x, y); if (rr >= FROZEN.band[0] && rr <= FROZEN.band[1]) { sum += (x * vy - y * vx) / rr; c++; } }
  return { v: c ? sum / c : 0, c }; };
function z3Of(S, frame) { let zm = 0, z2 = 0, vzm = 0, uzm = 0, axm = 0, out3 = 0, n = 0;
  for (let i = 1; i < S.n; i++) {
    let z = S.z[i], vz = S.vz[i];
    if (frame) { z = G3.mv3(frame.T, [S.x[i], S.y[i], S.z[i]])[2]; vz = G3.mv3(frame.T, [S.vx[i], S.vy[i], S.vz[i]])[2]; }
    const uz = frame ? G3.mv3(frame.T, [S.uPx[i], S.uPy[i], S.uPz[i]])[2] : S.uPz[i];   // u の履歴の面の法線の成分
    zm = Math.max(zm, Math.abs(z)); z2 += z * z; n++; vzm = Math.max(vzm, Math.abs(vz)); uzm = Math.max(uzm, Math.abs(uz));
    const nz = frame ? frame.n : [0, 0, 1]; const dot = S.sax[i] * nz[0] + S.say[i] * nz[1] + S.saz[i] * nz[2]; if (S.spin[i] !== 0) axm = Math.max(axm, Math.acos(Math.min(1, Math.abs(dot))));
    if (Math.hypot(S.x[i], S.y[i], S.z[i]) > 520) out3++; }
  return { zMax: zm, zRms: n ? Math.sqrt(z2 / n) : 0, vzMax: vzm, uPzMax: uzm, axisDevRad: axm, beyond2R: out3 }; }
function energyOf(HP, S) { const T = HP.coord3d.totals(S); return { E: T.E, K: T.K, Erot: T.Erot, U: T.U, P: T.P, L: T.L, geo2: T.geo2 }; }
export function gateRow(HP, plan) {
  const t0 = Date.now();
  HP.loadPreset(BOOK_ID, false); HP.abStart('kFrame', 0);
  const A = HP.sim, B = HP.ab().simB;
  const at = { n: A.n, coord3d: A.coord3d === true, kFrameA: A.params.kFrame, kFrameB: B.params.kFrame, geoPN: A.params.geoPN, lambdaPN: A.params.lambdaPN, integrator: A.integrator,
    stateType: Object.prototype.toString.call(A.x).slice(8, -1), law: HP.coord3d.geo2.version };
  let midRow = null;
  for (let k = 0; k < plan.gateSteps; k++) {
    A.step(plan.dt); B.step(plan.dt);
    if (k + 1 === plan.gateMid) { const a = outer(A), b = outer(B); midRow = { steps: k + 1, vphiKF1: a.v, vphiKF0: b.v, ratio: a.v / b.v }; }
  }
  const a = outer(A), b = outer(B), zA = z3Of(A), zB = z3Of(B);
  const row = Object.assign(at, { dt: plan.dt, steps: plan.gateSteps, t: A.t, vphiKF1: a.v, vphiKF0: b.v, ratio: a.v / b.v, nBandKF1: a.c, nBandKF0: b.c, mid: midRow,
    haltA: A.coord3dHalt || null, haltB: B.coord3dHalt || null, clampVN: [A.clampVN, B.clampVN], clampSN: [A.clampSN, B.clampSN], clampRN: [A.clampRN || 0, B.clampRN || 0],
    nan: A.hasNaN() || B.hasNaN(), zA, zB, geo2A: HP.coord3d.geo2.state(A), wallSec: (Date.now() - t0) / 1000 });
  HP.abStop();
  return row;
}

/* ───────── trial(傾き有り・有限厚 —— 子プロセスでも走る 1 行)───────── */
/** 傾けた円盤の基底: R = R_z(node)·R_x(incl)(受理器の群の incl・node と同じ回転 coord3dPlace)。T = Rᵀ(面の座標へ)・n = R ẑ。 */
export function tiltFrameOf(inclDeg, nodeDeg) {
  const i = inclDeg * Math.PI / 180, o = nodeDeg * Math.PI / 180, ci = Math.cos(i), si = Math.sin(i), cn = Math.cos(o), sn = Math.sin(o);
  const R = [cn, -sn * ci, sn * si, sn, cn * ci, -cn * si, 0, si, ci];
  return { R, T: [R[0], R[3], R[6], R[1], R[4], R[7], R[2], R[5], R[8]], n: [R[2], R[5], R[8]], axisDecl: { tiltDeg: inclDeg, azimuthDeg: nodeDeg - 90 } };
}
/** 傾き有りの正規の宣言(位置・速度は群の incl・node・中心の自転軸は同じ回転の像 R ẑ を spinAxis.enable の傾きと方位で —— 固定中心は原点なので拘束の点は不変)。 */
export function tiltBookOf(HP, plan) {
  const p = bookCopy(HP, BOOK_ID), F = tiltFrameOf(plan.tiltIncl, plan.tiltNode);
  p.bodies[1].incl = plan.tiltIncl; p.bodies[1].node = plan.tiltNode;
  p.bodies[0].spinAxis = { enable: true, tiltDeg: F.axisDecl.tiltDeg, azimuthDeg: F.axisDecl.azimuthDeg, source: 'w322a' };
  return { book: p, frame: F };
}
/** 有限厚の試走(器が build の後に z・v_z を置く —— 本の宣言の鍵はまだ無い。設計の案は THICK_DECL)。z ~ N(0, h²)(±3h で切る)・v_z ~ N(0, (ν h)²)・ν² = G M_c/(r²+ε²)^{3/2}。 */
export function thickenOf(S, h, seed) {
  let s = seed >>> 0; const rnd = () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const gauss = () => { let u = 0, v = 0; while (u === 0) u = rnd(); v = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  const G = S.params.G, M = S.m[0], e2 = S.params.softening * S.params.softening;
  for (let i = 1; i < S.n; i++) {
    let g = gauss(); while (Math.abs(g) > 3) g = gauss();
    const r2 = S.x[i] * S.x[i] + S.y[i] * S.y[i], nu = Math.sqrt(G * M / Math.pow(r2 + e2, 1.5));
    S.z[i] = h * g; S.vz[i] = nu * h * gauss();
  }
}
export function trialRow(HP, plan, kind) {
  const t0 = Date.now();
  let book = bookCopy(HP, BOOK_ID), frame = null;
  if (kind === 'tilt') { const tb = tiltBookOf(HP, plan); book = tb.book; frame = tb.frame; }
  const bookB = clone(book); bookB.physics.kFrame = 0;
  const A = simOf(HP, book), B = simOf(HP, bookB);
  if (kind === 'thick') { thickenOf(A, plan.thickH, plan.thickSeed); thickenOf(B, plan.thickH, plan.thickSeed); }
  const z0 = z3Of(A, frame), e0A = energyOf(HP, A), e0B = energyOf(HP, B);
  let midRow = null;
  for (let k = 0; k < plan.trialSteps; k++) {
    A.step(plan.dt); B.step(plan.dt);
    if (k + 1 === plan.trialMid) { const a = outer(A, frame), b = outer(B, frame); midRow = { steps: k + 1, ratio: a.v / b.v, zA: z3Of(A, frame) }; }
  }
  const a = outer(A, frame), b = outer(B, frame), eA = energyOf(HP, A), eB = energyOf(HP, B), g2 = HP.coord3d.geo2.state(A);
  const dEA = eA.E - e0A.E, dEB = eB.E - e0B.E, wA = g2.work.KE + g2.work.spinE;
  return { kind, steps: plan.trialSteps, dt: plan.dt, incl: kind === 'tilt' ? plan.tiltIncl : 0, node: kind === 'tilt' ? plan.tiltNode : 0, thickH: kind === 'thick' ? plan.thickH : 0,
    ratio: a.v / b.v, vphiKF1: a.v, vphiKF0: b.v, nBand: [a.c, b.c], mid: midRow, z0, zA: z3Of(A, frame), zB: z3Of(B, frame),
    energy: { dE_KF1: dEA, workKF1: wA, residualKF1: dEA - wA, dE_KF0: dEB, E0: e0A.E, relResidualKF1: Math.abs(dEA - wA) / Math.abs(e0A.E), relKF0: Math.abs(dEB) / Math.abs(e0B.E) },
    axisTurnN: g2.axisTurnN, clampVN: [A.clampVN, B.clampVN], clampRN: [A.clampRN || 0, B.clampRN || 0], halt: [A.coord3dHalt || null, B.coord3dHalt || null], nan: A.hasNaN() || B.hasNaN(),
    wallSec: (Date.now() - t0) / 1000 };
}
function childRow(args) {
  return new Promise((res, rej) => {
    const cp = spawn(process.execPath, [fileURLToPath(import.meta.url), '--row', ...args], { cwd: ROOT, env: process.env, stdio: ['ignore', 'pipe', 'inherit'] });
    let buf = ''; cp.stdout.on('data', (d) => { buf += d; });
    cp.on('close', (code) => { const ln = buf.trim().split('\n').filter((l) => l.startsWith('{')).pop(); if (code !== 0 || !ln) rej(new Error('子プロセスの行が無い(' + code + ')')); else res(JSON.parse(ln)); });
  });
}
async function runRows(HP, plan, quick, workers, jobs) {
  // jobs: [['gate'], ['trial','tilt'], ...] —— workers ≥ 2 なら子プロセスで(同時に workers 本まで)
  const one = (j) => (j[0] === 'gate' ? gateRow(HP, plan) : trialRow(HP, plan, j[1]));
  if (workers < 2) return jobs.map(one);
  const out = new Array(jobs.length); let next = 0;
  const lane = async () => { while (next < jobs.length) { const k = next++; out[k] = await childRow([quick ? 'quick' : 'full', ...jobs[k]]); } };
  await Promise.all(Array.from({ length: Math.min(workers, jobs.length) }, lane));
  return out;
}
export async function partGate(HP, plan, quick, workers, pre) {
  const h = pre || (await runRows(HP, plan, quick, workers, [['gate']]))[0];
  const inWin = (r) => r >= FROZEN.window[0] && r <= FROZEN.window[1];
  const full = plan.gateSteps === FROZEN.steps;
  return { row: h, frozen: clone(FROZEN), sameAsFrozen: full ? Object.is(h.ratio, FROZEN.ratio) : null, inWindow: inWin(h.ratio), midInWindow: h.mid ? inWin(h.mid.ratio) : null,
    clampZero: h.clampVN.concat(h.clampSN, h.clampRN).every((c) => c === 0) && !h.nan, flat: h.zA.zMax === 0 && h.zA.vzMax === 0 && h.zA.uPzMax === 0 && h.zA.axisDevRad === 0 && h.geo2A.axisTurnN === 0,
    textRound: h.ratio.toFixed(3) };
}
export async function partTrial(HP, plan, quick, workers, pre) {
  const rows = pre || await runRows(HP, plan, quick, workers, [['trial', 'tilt'], ['trial', 'thick']]);
  const tilt = rows.find((r) => r.kind === 'tilt'), thick = rows.find((r) => r.kind === 'thick');
  return { tilt, thick, an510: partAN510(HP, plan), tiltDecl: TILT_DECL, thickDecl: THICK_DECL };
}

/* ───────── AN510 の 2 案(純関数の小さい系 —— 平面・傾き有り・有限厚)───────── */
function an510Case(HP, plan, kind) {
  const p = bookCopy(HP, BOOK_ID); p.bodies[1].n = plan.an510Disk; p.overlays = {};
  let frame = null;
  if (kind === 'tilt') { const F = tiltFrameOf(plan.tiltIncl, plan.tiltNode); frame = F; p.bodies[1].incl = plan.tiltIncl; p.bodies[1].node = plan.tiltNode; p.bodies[0].spinAxis = { enable: true, tiltDeg: F.axisDecl.tiltDeg, azimuthDeg: F.axisDecl.azimuthDeg, source: 'w322a' }; }
  const S = simOf(HP, p);
  if (kind === 'thick') thickenOf(S, plan.thickH, plan.thickSeed);
  const st0 = G3.stateOf3D(S, null, {});
  const stV = G3.cloneState(st0); stV.spinPolicy = 'vector';
  const stP = G3.cloneState(st0); stP.spinPolicy = 'parallel';
  let a = stV, b = stP, nHtmlDiff = 0, nHtmlVal = 0;
  for (let k = 0; k < plan.an510Steps; k++) {
    S.step(plan.dt); a = G3.geo2Step3(a, plan.dt); b = G3.geo2Step3(b, plan.dt);
    for (const f of ['x', 'y', 'z', 'vx', 'vy', 'vz', 'spin', 'sax', 'say', 'saz']) { nHtmlVal += S.n; nHtmlDiff += bitsOf(S[f], a[f]); }
  }
  let dr = 0, dv = 0, ds = 0, rs = 0, vs = 0, ss = 0;
  for (let i = 0; i < a.n; i++) {
    dr = Math.max(dr, Math.hypot(a.x[i] - b.x[i], a.y[i] - b.y[i], a.z[i] - b.z[i])); rs = Math.max(rs, Math.hypot(a.x[i], a.y[i], a.z[i]));
    dv = Math.max(dv, Math.hypot(a.vx[i] - b.vx[i], a.vy[i] - b.vy[i], a.vz[i] - b.vz[i])); vs = Math.max(vs, Math.hypot(a.vx[i], a.vy[i], a.vz[i]));
    const sa = [a.spin[i] * a.sax[i], a.spin[i] * a.say[i], a.spin[i] * a.saz[i]], sb = [b.spin[i] * b.sax[i], b.spin[i] * b.say[i], b.spin[i] * b.saz[i]];
    ds = Math.max(ds, Math.hypot(sa[0] - sb[0], sa[1] - sb[1], sa[2] - sb[2])); ss = Math.max(ss, Math.hypot(...sa));
  }
  const Lp = Math.hypot(b.ledger.spinPerpLx, b.ledger.spinPerpLy, b.ledger.spinPerpLz);
  const TV = G3.totals3(a), TP = G3.totals3(b);
  return { kind, n: S.n, steps: plan.an510Steps, html: { nVal: nHtmlVal, nDiff: nHtmlDiff, same: nHtmlDiff === 0 }, posRel: rs > 0 ? dr / rs : 0, velRel: vs > 0 ? dv / vs : 0, spinVecRel: ss > 0 ? ds / ss : 0,
    spinVecMax: ss, axisTurnsVector: a.ledger.axisTurnN, spinPerpL: Lp, Lz: [TV.L[2], TP.L[2]], same: dr === 0 && dv === 0 && ds === 0, frame: frame ? frame.axisDecl : null };
}
export function partAN510(HP, plan) {
  const rows = ['flat', 'tilt', 'thick'].map((k) => an510Case(HP, plan, k));
  return { rows, flatSame: rows[0].same, htmlSameAsVector: rows.every((r) => r.html.same) };
}

/* ───────── degen ───────── */
const CMP2 = ['x', 'y', 'vx', 'vy', 'spin', 'uPx', 'uPy', 'rotA', 'hasU'];
const SC2 = ['resPx', 'resPy', 'resL', 'clampVN', 'clampSN', 'clampRN', 't'];
function degenRun(HP, p2, steps, key, note) {
  const S2 = simOf(HP, p2), S3 = simOf(HP, flatOf(p2));
  let nVal = 0, nDiff = 0, zMax = 0;
  for (let k = 0; k < steps; k++) {
    S2.step(FROZEN.dt); S3.step(FROZEN.dt);
    for (const a of CMP2) { nVal += S2.n; nDiff += bitsOf(S2[a].subarray(0, S2.n), S3[a].subarray(0, S3.n)); }
    for (const a of SC2) { nVal++; if (!Object.is(S2[a] || 0, S3[a] || 0)) nDiff++; }
    for (let i = 0; i < S3.n; i++) zMax = Math.max(zMax, Math.abs(S3.z[i]), Math.abs(S3.vz[i]), Math.abs(S3.uPz[i]), Math.abs(S3.sax[i]), Math.abs(S3.say[i]), Math.abs(S3.saz[i] - 1));
  }
  const g = HP.coord3d.geo2.state(S3);
  return { key, note, n: S2.n, steps, integrator: S3.integrator, prec: Object.prototype.toString.call(S3.x).slice(8, -1), nVal, nDiff, same: nDiff === 0, zMax,
    ledger3Zero: g.resP[2] === 0 && g.resL[0] === 0 && g.resL[1] === 0 && g.conP[2] === 0 && g.conL[0] === 0 && g.conL[1] === 0 && g.axisTurnN === 0, kicked: g.work.N };
}
export function partDegen(HP, plan) {
  const gal = bookCopy(HP, GAL2D_ID), galLf = Object.assign(clone(gal), { integrator: 'leapfrog' });
  const rows = [degenRun(HP, gal, plan.degenGal, 'galaxyGeo2-semi', '💫 の写し(381 体)・semi'), degenRun(HP, galLf, plan.degenGalLf, 'galaxyGeo2-leapfrog', '同じ・leapfrog')];
  const small = [['b5-semi', {}, null, '固定中心(spin 1.2)+ 4 体'], ['b5-D0zero', { D0: 0 }, null, '同じ・D₀ = 0'], ['b5-q15', { q: 1.5 }, null, '同じ・q = 1.5(Math.pow の枝)'],
    ['b5-leapfrog', {}, { integrator: 'leapfrog' }, '同じ・leapfrog'], ['b5-double', { stateCarry: 'double', massPrecision: 'double' }, null, '同じ・倍精度の状態と質量(補償和つき)']];
  for (const [key, ph, ex, note] of small) rows.push(degenRun(HP, bookOf(SMALL.b5, ph, ex), plan.degenSmall, key, note));
  return { rows, allSame: rows.every((r) => r.same && r.zMax === 0 && r.ledger3Zero), nVal: rows.reduce((s, r) => s + r.nVal, 0) };
}

/* ───────── pure ───────── */
const CMP3 = ['x', 'y', 'z', 'vx', 'vy', 'vz', 'spin', 'sax', 'say', 'saz', 'uPx', 'uPy', 'uPz', 'hasU', 'rotA'];
const LEDGER_MAP = [['resPx', 'resPx'], ['resPy', 'resPy'], ['resPz', 'resPz'], ['resLx', 'resLx'], ['resLy', 'resLy'], ['resL', 'resLz'], ['g3ConPx', 'conPx'], ['g3ConPy', 'conPy'], ['g3ConPz', 'conPz'],
  ['g3ConLx', 'conLx'], ['g3ConLy', 'conLy'], ['g3ConLz', 'conLz'], ['g3WorkE', 'dragWorkE'], ['g3WorkKE', 'dragWorkKE'], ['g3SpinE', 'dragSpinE'], ['g3WorkN', 'dragWorkN'], ['clampVN', 'clampVN'], ['clampSN', 'clampSN'], ['clampRN', 'clampRN'], ['g3AxisTurnN', 'axisTurnN']];
function pureRun(HP, plan, integ, dbl) {
  const p = bookOf3(SMALL.n6, dbl ? { stateCarry: 'double', massPrecision: 'double' } : {}, integ === 'leapfrog' ? { integrator: 'leapfrog' } : null);
  const S = simOf(HP, p);
  let st = G3.stateOf3D(S, null, { spinPolicy: 'vector' });
  let nVal = 0, nDiff = 0, maxRel = 0;
  for (let k = 0; k < plan.pureSteps; k++) {
    S.step(FROZEN.dt); st = G3.geo2Step3(st, FROZEN.dt);
    for (const a of CMP3) { const d = G3.arrDiff(S[a], st[a]); nVal += S.n; nDiff += d.nDiff; maxRel = Math.max(maxRel, d.rel); }
    for (const [a, b] of LEDGER_MAP) { nVal++; if (!Object.is(S[a] || 0, st.ledger[b] || 0)) { nDiff++; maxRel = Math.max(maxRel, G3.relDiff(S[a] || 0, st.ledger[b] || 0)); } }
    nVal++; if (S.t !== st.t) nDiff++;
  }
  let zMin = Infinity, tilt = 0; for (let i = 0; i < S.n; i++) { zMin = Math.min(zMin, Math.abs(S.z[i])); tilt = Math.max(tilt, Math.abs(1 - S.saz[i])); }
  return { integrator: integ, prec: dbl ? 'double' : 'single', n: S.n, steps: plan.pureSteps, nVal, nDiff, same: nDiff === 0, maxRel, nonPlanar: S.z[1] !== 0, axisTilted: tilt > 1e-6, axisTurns: S.g3AxisTurnN, kicks: S.g3WorkN };
}
export function partPure(HP, plan) {
  const rows = [];
  for (const dbl of [false, true]) for (const integ of ['semi', 'leapfrog']) rows.push(pureRun(HP, plan, integ, dbl));
  return { rows, allSame: rows.every((r) => r.same && r.nonPlanar && r.axisTilted && r.axisTurns > 0) };
}

/* ───────── hist ───────── */
export function partHist(HP, plan) {
  const p = bookCopy(HP, BOOK_ID), q = clone(p); q.physics.kFrame = 0;
  const A = simOf(HP, p), B = simOf(HP, q), rows = [];
  for (let k = 0; k < plan.histSteps; k++) {
    A.step(FROZEN.dt); B.step(FROZEN.dt);
    let nd = 0, nv = 0; for (const a of ['x', 'y', 'z', 'vx', 'vy', 'vz', 'spin']) { nv += A.n; nd += bitsOf(A[a], B[a]); }
    let nU = 0; for (let i = 0; i < A.n; i++) if (A.hasU[i]) nU++;
    rows.push({ step: k + 1, nVal: nv, nDiff: nd, kicks: A.g3WorkN, hasU: nU, hasUB: Array.from(B.hasU).reduce((s, v) => s + v, 0) });
  }
  const nFree = A.n - Array.from(A.pinned).reduce((s, v) => s + v, 0);
  return { rows, nFree, pass: rows[0].nDiff === 0 && rows[0].kicks === 0 && rows[0].hasU === nFree && rows[1].kicks > 0 && rows[1].nDiff > 0 && rows.every((r) => r.hasUB === 0) };
}

/* ───────── ckpt ───────── */
function fieldsOf(S) { const o = {}; for (const a of CMP3) o[a] = Array.from(S[a].subarray(0, S.n)); for (const [a] of LEDGER_MAP) o[a] = S[a]; o.t = S.t; return o; }
function fieldDiff(a, b) { let nd = 0, nv = 0; for (const k of Object.keys(a)) { if (Array.isArray(a[k])) { nv += a[k].length; for (let i = 0; i < a[k].length; i++) if (!Object.is(a[k][i], b[k][i])) nd++; } else { nv++; if (!Object.is(a[k], b[k])) nd++; } } return { nv, nd }; }
export function partCkpt(H, plan) {
  const HP = H.HP, E = H.evalExpr;
  // ① 保存と復帰(非平面の小さい系 —— u の履歴の z が 0 でない)
  const S = simOf(HP, bookOf3(SMALL.n6, {}));
  for (let k = 0; k < plan.ckN; k++) S.step(FROZEN.dt);
  let uzAbs = 0; for (let i = 0; i < S.n; i++) uzAbs = Math.max(uzAbs, Math.abs(S.uPz[i]));
  const o = E('ckSnapOne')(S);
  for (let k = 0; k < plan.ckM; k++) S.step(FROZEN.dt);
  const ref = fieldsOf(S);
  E('ckRestoreOne')(S, o);
  for (let k = 0; k < plan.ckM; k++) S.step(FROZEN.dt);
  const d1 = fieldDiff(ref, fieldsOf(S));
  // 否定対照: 復帰の後に uPz を塗ると違う(uPz を読んでいる)
  E('ckRestoreOne')(S, o); for (let i = 0; i < S.n; i++) S.uPz[i] = S.uPz[i] * 0.5 + 0.01;
  for (let k = 0; k < plan.ckM; k++) S.step(FROZEN.dt);
  const d2 = fieldDiff(ref, fieldsOf(S));
  // ② A/B の複製(平面の本 —— cloneSimState は今の sim を写す)
  HP.loadPreset(BOOK_ID, false);
  const G = E('sim');
  for (let k = 0; k < plan.ckN; k++) G.step(FROZEN.dt);
  const C = E('cloneSimState')();
  for (let k = 0; k < plan.ckM; k++) { G.step(FROZEN.dt); C.step(FROZEN.dt); }
  const d3 = fieldDiff(fieldsOf(G), fieldsOf(C));
  const inArrs = { ck: E('CK_ARRS').indexOf('uPz') >= 0, coord3d: HP.coord3d.arrs.indexOf('uPz') >= 0, sc: ['resPz', 'resLx', 'resLy', 'g3ConPx', 'g3WorkE', 'g3AxisTurnN'].every((k) => E('CK_SC').indexOf(k) >= 0) };
  return { restore: { nVal: d1.nv, nDiff: d1.nd, uPzMax: uzAbs }, paintedUPz: { nDiff: d2.nd }, clone: { nVal: d3.nv, nDiff: d3.nd }, inArrs,
    pass: d1.nd === 0 && uzAbs > 0 && d2.nd > 0 && d3.nd === 0 && inArrs.ck && inArrs.coord3d && inArrs.sc };
}

/* ───────── ledger ───────── */
/** 系の尺度: P = Σ |m||v|・L = Σ |m||r||v| + I|s|(初期の状態 —— 第321便a の器と同じ定義)。 */
function scalesOf(st) {
  let P = 0, L = 0;
  for (let i = 0; i < st.n; i++) { const m = Math.abs(st.m[i]), v = Math.hypot(st.vx[i], st.vy[i], st.vz[i]); P += m * v; L += m * Math.hypot(st.x[i], st.y[i], st.z[i]) * v + 0.5 * m * st.R[i] * st.R[i] * Math.abs(st.spin[i]); }
  return { P, L };
}
function ledgerTotals(HP, S) { const T = HP.coord3d.totals(S), g = T.geo2;
  return { P: [0, 1, 2].map((k) => T.P[k] + g.resP[k] + g.conP[k]), L: [0, 1, 2].map((k) => T.L[k] + g.resL[k] + g.conL[k]), Pfree: T.P, Lfree: T.L }; }
export function partLedger(HP, plan) {
  const rows = {};
  for (const [key, ph] of [['double', { stateCarry: 'double', massPrecision: 'double' }], ['single', {}]]) {
    const S = simOf(HP, bookOf3(SMALL.n6, ph)), sc = scalesOf(G3.stateOf3D(S));
    const a = ledgerTotals(HP, S);
    for (let k = 0; k < plan.ledgerSteps; k++) S.step(FROZEN.dt);
    const b = ledgerTotals(HP, S);
    const dP = Math.max(...[0, 1, 2].map((k) => Math.abs(b.P[k] - a.P[k]))) / sc.P, dL = Math.max(...[0, 1, 2].map((k) => Math.abs(b.L[k] - a.L[k]))) / sc.L;
    const dPfree = Math.max(...[0, 1, 2].map((k) => Math.abs(b.Pfree[k] - a.Pfree[k]))) / sc.P;
    rows[key] = { steps: plan.ledgerSteps, dP, dL, dPwithoutLedger: dPfree, kicks: S.g3WorkN, axisTurns: S.g3AxisTurnN };
  }
  // 平面の本: z の成分(P_z・L_x・L_y・口座の z 成分)が 0 のまま
  const F = simOf(HP, bookCopy(HP, BOOK_ID));
  for (let k = 0; k < plan.flatLedgerSteps; k++) F.step(FROZEN.dt);
  const T = HP.coord3d.totals(F), g = T.geo2;
  const flat = { steps: plan.flatLedgerSteps, Pz: T.P[2], Lx: T.L[0], Ly: T.L[1], resPz: g.resP[2], resLx: g.resL[0], resLy: g.resL[1], conPz: g.conP[2], conLx: g.conL[0], conLy: g.conL[1],
    conPxy: Math.hypot(g.conP[0], g.conP[1]), resLz: g.resL[2], workN: g.work.N };
  flat.zero = [flat.Pz, flat.Lx, flat.Ly, flat.resPz, flat.resLx, flat.resLy, flat.conPz, flat.conLx, flat.conLy].every((v) => v === 0);
  return { rows, flat, pass: rows.double.dP < 1e-6 && rows.double.dL < 1e-6 && rows.double.dPwithoutLedger > 10 * rows.double.dP && flat.zero };
}

/* ───────── table(受理と実行の門)───────── */
const T_CASES = [
  ['in-scope', '範囲の内(平面の本の宣言)', (q) => q, true, []],
  ['kFrame0', 'kFrame = 0(輸送が消えたニュートンの步 —— A/B の対照)', (q) => { q.physics.kFrame = 0; }, true, []],
  ['leapfrog', 'integrator leapfrog', (q) => { q.integrator = 'leapfrog'; }, true, []],
  ['double', 'stateCarry・massPrecision の倍精度', (q) => { q.physics.stateCarry = 'double'; q.physics.massPrecision = 'double'; }, true, []],
  ['axisTilt', '中心の自転軸 spinAxis.enable(傾き 30°)', (q) => { q.bodies[0].spinAxis = { enable: true, tiltDeg: 30, azimuthDeg: -50, source: 'w322a' }; }, true, []],
  ['diskTilt', '円盤の incl・node(傾き有り)', (q) => { q.bodies[1].incl = 30; q.bodies[1].node = 40; }, true, []],
  ['lambdaPN1', 'λ_PN = 1', (q) => { q.physics.lambdaPN = 1; }, false, ['kFrame', 'geoPN12']],
  ['contactNormal', 'contactMode "normal"', (q) => { q.physics.contactMode = 'normal'; }, false, ['kFrame', 'geoPN12']],
  ['pull', 'frameWeight "pull"', (q) => { q.physics.frameWeight = 'pull'; }, false, ['kFrame', 'geoPN12']],
  ['geoPN1kF1', 'geoPN = 1 ∧ kFrame = 1(v−u 則に解決する宣言)', (q) => { q.physics.geoPN = 1; }, false, ['kFrame']],
  ['geoPN3', 'geoPN = 3(慣性の宣言なし —— v−u 則に解決)', (q) => { q.physics.geoPN = 3; }, false, ['kFrame', 'geoPN12']],
  ['geoPN0kF1', 'geoPN = 0 ∧ kFrame = 1(E6′ の legacy)', (q) => { q.physics.geoPN = 0; }, false, ['kFrame']],
  ['geodesic', 'physics.geodesic:true', (q) => { q.physics.geodesic = true; }, false, ['geodesic']],
  ['relDrag', 'relativeDrag.law "inertial" と重ねる', (q) => { q.physics.relativeDrag = { law: 'inertial', Wbg: 0.125, eps: 0.05, pairs: 'all' }; }, false, ['kFrame', 'geoPN12']],
  ['tide', '明示潮汐と重ねる', (q) => { q.physics.tide = { maxN: 8 }; q.bodies[0].tide = { k2: 0.3, lag: 6 }; }, false, ['kFrame', 'geoPN12']],
  ['precession', '歳差の宣言と重ねる', (q) => { q.bodies[0].spinAxis = { enable: true, tiltDeg: 10, azimuthDeg: 0, precessionRate: 0.01, source: 'w322a' }; }, false, ['kFrame', 'geoPN12']],
  ['mechSpectrum', 'overlays.mechSpectrum', (q) => { q.overlays = Object.assign({}, q.overlays, { mechSpectrum: true }); }, false, ['overlays']],
  ['framePrecision', 'framePrecision "double"(三次元では未対応の鍵)', (q) => { q.physics.framePrecision = 'double'; }, false, ['physicsOther']],
];
export function partTable(HP) {
  const rows = [];
  for (const [key, label, f, ok, want] of T_CASES) {
    const q = bookCopy(HP, BOOK_ID); f(q);
    const v = HP.validatePreset(clone(q));
    const deny = [...new Set(HP.coord3d.denyOf(v.ok ? v.preset : q).map((z) => z.key))].sort();
    const pass = ok ? (v.ok && deny.length === 0) : (!v.ok && JSON.stringify(deny) === JSON.stringify(want.slice().sort()));
    rows.push({ key, label, expect: ok ? 'accept' : 'reject', ok: v.ok, deny, pass, why: v.ok ? null : String((v.errors || [])[0] || '').slice(0, 160) });
  }
  // 走行中の門(平面の本を build して params を編集 —— 進んだか・止めた理由)
  const S = simOf(HP, bookCopy(HP, BOOK_ID)), rt = [];
  const edit = (label, f, back) => { f(S.params); const t0 = S.t; S.step(FROZEN.dt); rt.push({ label, advanced: S.t > t0, halt: S.coord3dHalt || null, why: HP.coord3d.runtimeWhy(S) }); back(S.params); };
  edit('そのまま', () => {}, () => {});
  edit('kFrame → 0', (p) => { p.kFrame = 0; }, (p) => { p.kFrame = 1; });
  edit('λ_PN → 1', (p) => { p.lambdaPN = 1; }, (p) => { p.lambdaPN = 0; });
  edit('geoPN → 1', (p) => { p.geoPN = 1; }, (p) => { p.geoPN = 2; });
  edit('geoPN → 0', (p) => { p.geoPN = 0; }, (p) => { p.geoPN = 2; });
  edit('frameWeight → pull', (p) => { p.frameWeight = 'pull'; }, (p) => { p.frameWeight = 'share'; });
  edit('kRep → 1', (p) => { p.kRep = 1; }, (p) => { p.kRep = 0; });
  edit('kFrame → −0.5', (p) => { p.kFrame = -0.5; }, (p) => { p.kFrame = 1; });
  edit('もとに戻した', () => {}, () => {});
  const want = [true, true, false, false, false, false, false, false, true];
  const runtimeOk = rt.every((r, i) => r.advanced === want[i] && (want[i] ? r.halt === null : !!r.halt));
  return { rows, nPass: rows.filter((r) => r.pass).length, nCases: rows.length, runtime: rt, runtimeOk, supported: HP.coord3d.supported.map((z) => z.key), rejected: HP.coord3d.rejected.slice(),
    pass: rows.every((r) => r.pass) && runtimeOk && HP.coord3d.supported.some((z) => z.key === 'geo2') && HP.coord3d.rejected.indexOf('geoPN12') >= 0 && HP.coord3d.rejected.indexOf('kFrame') >= 0 };
}

/* ───────── 設計(内蔵しない —— 文書と正本の表)───────── */
export const TILT_DECL = Object.freeze({ what: '傾き有りの正規の宣言(位置・速度・自転軸・拘束の向きを同じ直交回転 R = R_z(node)·R_x(incl) で)',
  disk: '円盤の群に incl・node(受理器の coord3dPlace —— 位置と群の並進を引いた速度を同じ R で回す)', center: '中心の自転軸 spinAxis:{enable:true, tiltDeg: incl, azimuthDeg: node − 90}(= R ẑ)',
  constraint: '固定中心は原点(拘束の点は R で不変)・拘束の口座 conP・conL は R で回るベクトル', notUsed: '印の鍵(_tiltTransform など)は使わない —— 宣言の鍵だけ' });
export const THICK_DECL = Object.freeze({ what: '有限厚の宣言の案(受理器の鍵はまだ無い —— 器が build の後に z・v_z を置いて試走)',
  keys: 'disk の群に thickness:{z:{kind:"gauss", h, cut:3}, vz:{kind:"local-nu", scale:1}}(ν² = G M_c/(r²+ε²)^{3/2} —— 中心質量の鉛直の振動数)・seed は本の seed から',
  measure: '同じ窓(12000 步)で面内の比・z の二乗平均と最大・2R の外へ出た数(脱落)・エネルギーの台帳(ΔE − 引きずりの仕事)', open: 'AN510(軸を有効化しない粒子の軸を力学で回すか)の裁定の後に内蔵' });
export const S3_PLAN = Object.freeze([
  { area: '本', what: '傾き有りの本(新しい ID —— TILT_DECL の宣言)と有限厚の本(THICK_DECL の鍵を受理器へ)', where: 'beta/index.html の本の宣言・受理器 coord3dBodyKeys', gate: '傾き有りの面内の比が平面の比の刻みの感度の内・軸の向きの差(AN510 の裁定)' },
  { area: '自転軸', what: 'AN510 の裁定の型(軸を有効化しない粒子の軸 —— "vector" のまま/有効化しない粒子は "parallel" + 拘束の口座)', where: 'dfmCore3G2 の自転の更新', gate: '平面は差 0(試走で確かめた)・傾き有りの差を表に' },
  { area: '受理器', what: 'disk の z の分布と v_z の分散の宣言(thickness)・incl/node の群と中心の軸の整合の検査(印の鍵を使わない)', where: 'coord3dBodyKeys・coord3dPlace', gate: '在位の本の署名 1 字も不変' },
  { area: '器', what: '傾き有り・有限厚の正本(同じ窓の比・広がり・脱落・台帳)と h/2 の刻みの感度', where: 'tests/exp-w322a-geo2flat.mjs の段 trial を本の段へ', gate: '鎖の段(presets は本の id を名指し)' },
  { area: '読み口', what: '三次元の回転曲線の表示(面の座標 —— 本の宣言の R)', where: 'overlays.rotationCurve の三次元版', gate: '平面の本で二次元と同じ値' },
  { area: 'QA', what: 'behavior/docs の新設(傾き有りの比・有限厚の台帳)・在位の本の bitsame/sigsame', where: 'tests/qa.mjs', gate: 'QA_FAST・root の部分 QA' }]);

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const g = J.parts.gate, dg = J.parts.degen, pu = J.parts.pure, hi = J.parts.hist, ck = J.parts.ckpt, lg = J.parts.ledger, tb = J.parts.table, tr = J.parts.trial;
  return {
    gateFrozen: !!(g && (J.quick ? true : g.sameAsFrozen === true)), gateWindow: !!(g && (J.quick ? true : g.inWindow)), gateClampZero: !!(g && g.clampZero), gateFlat: !!(g && g.flat),
    degenSame: !!(dg && dg.allSame), pureSame: !!(pu && pu.allSame), histFirst: !!(hi && hi.pass), ckpt: !!(ck && ck.pass), ledger: !!(lg && lg.pass), table: !!(tb && tb.pass),
    trialFinite: !!(tr && tr.tilt && tr.thick && !tr.tilt.nan && !tr.thick.nan && tr.tilt.halt.every((h) => h === null) && tr.thick.halt.every((h) => h === null)),
    an510FlatSame: !!(tr && tr.an510.flatSame), an510Html: !!(tr && tr.an510.htmlSameAsVector) };
}

/* ───────── 実行 ───────── */
async function main() {
  const quick = process.env.W322A_QUICK === '1', outRel = process.env.W322A_OUT || OUT_GEO2FLAT;
  if (quick && !process.env.W322A_OUT) throw new Error('W322A_QUICK=1 には W322A_OUT が要る(正本を書かない)');
  const plan = quick ? QUICK : PLAN, workers = Math.max(1, Number(process.env.W322A_WORKERS || 2));
  const parts = String(process.env.W322A_PART || 'gate,degen,pure,hist,ckpt,ledger,table,trial').split(',').filter(Boolean);
  const html = path.join(ROOT, TARGET), targetSha256 = crypto.createHash('sha256').update(fs.readFileSync(html)).digest('hex');
  const HP = loadHtmlMain(html).HP, H = { HP, evalExpr: (code) => vm.runInThisContext(code) };   // 主の文脈(headless の vm の文脈より約 5 倍速い —— 最上位の const は runInThisContext で読む)
  const outAbs = path.isAbsolute(outRel) ? outRel : path.join(ROOT, outRel);
  const prev = (process.env.W322A_PART && fs.existsSync(outAbs)) ? JSON.parse(fs.readFileSync(outAbs, 'utf8')) : null;
  const t0 = Date.now(), timing = {};
  const out = { version: HARNESS_VERSION, libVersion: G3.GEO2V3_VERSION, engineVersion: HP.coord3d.geo2.version, generator: 'tests/exp-w322a-geo2flat.mjs', quick, plan: clone(plan), target: TARGET, targetSha256,
    ruling: '原仮定者の予定(第123報)・原仮定者の回答(2026-11-01 —— AN499・AN500)・AN504・統括の検証項目 R270', parts: (prev && prev.parts) || {}, s3Plan: clone(S3_PLAN), notClaim: NOT_CLAIM };
  // 重い行(gate・trial の 2 本)は子プロセスで先に並走させ、その間に軽い段を主で回す
  const heavy = [];
  if (parts.includes('gate')) heavy.push(['gate']);
  if (parts.includes('trial')) heavy.push(['trial', 'tilt'], ['trial', 'thick']);
  const th = Date.now();
  const heavyP = (workers >= 2 && heavy.length) ? runRows(HP, plan, quick, workers, heavy) : null;
  const RUN = { degen: () => partDegen(HP, plan), pure: () => partPure(HP, plan), hist: () => partHist(HP, plan), ckpt: () => partCkpt(H, plan), ledger: () => partLedger(HP, plan), table: () => partTable(HP) };
  for (const k of parts) { if (!RUN[k]) continue; const t = Date.now(); out.parts[k] = await RUN[k](); timing[k] = { wallSec: (Date.now() - t) / 1000 }; console.log(new Date().toISOString().slice(11, 19), 'part', k, timing[k].wallSec + ' s'); }
  const heavyRows = heavyP ? await heavyP : (heavy.length ? await runRows(HP, plan, quick, 1, heavy) : []);
  const hWall = (Date.now() - th) / 1000;
  if (parts.includes('gate')) { out.parts.gate = await partGate(HP, plan, quick, workers, heavyRows.find((r) => r.kind === undefined)); timing.gate = { wallSec: out.parts.gate.row.wallSec }; }
  if (parts.includes('trial')) { const t = Date.now(); out.parts.trial = await partTrial(HP, plan, quick, workers, heavyRows.filter((r) => r.kind)); timing.trial = { wallSec: Math.max(...heavyRows.filter((r) => r.kind).map((r) => r.wallSec)) + (Date.now() - t) / 1000 }; }
  timing.heavy = { wallSec: hWall };
  out.timing = timing; out.elapsedS = (Date.now() - t0) / 1000;
  out.gates = gatesOf(out); out.ok = Object.values(out.gates).every(Boolean);
  const CODE = ['tests/exp-w322a-geo2flat.mjs', 'tests/lib-w321a-geo2v3.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第322便a', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, stage: 'geo2flat', parts: Object.keys(out.parts), ruling: '原仮定者の予定(第123報)「geoPN=2の予定: 3D対応する。現状、最も銀河を再現しているのがgalaxyGeo2であり、引きずり近似としての需要が有る」・原仮定者の回答(2026-11-01 —— AN499・AN500)',
    reading: '統括の検証項目 R270(geoPN=2 の 3D の S2 —— dfmStep3 への接続・受理と実行の門・平面の 3D 銀河の本・傾き有りと有限厚の試走と設計)',
    engine: 'Node の主の文脈(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・最上位の const は vm.runInThisContext で読む)・gate と trial の行は子プロセス(W322A_WORKERS ≥ 2)', notClaim: NOT_CLAIM });
  Object.assign(out.meta, w281aScopeStamp(html, REGEN_SCOPE), w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(outAbs), { recursive: true });
  fs.writeFileSync(outAbs, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, outAbs), out.elapsedS + ' s', 'ok', out.ok, JSON.stringify(out.gates));
}
if (IS_MAIN) {
  const bi = process.argv.indexOf('--row');
  if (bi > 0) {
    const [mode, kind, sub] = process.argv.slice(bi + 1, bi + 4);
    const { HP } = loadHtmlMain(path.join(ROOT, TARGET)), plan = mode === 'quick' ? QUICK : PLAN;
    console.log(JSON.stringify(kind === 'gate' ? gateRow(HP, plan) : trialRow(HP, plan, sub)));
  } else await main();
}
