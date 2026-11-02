// 第324便a(原仮定者の回答(2026-11-01 —— AN500「3D銀河プリセットは、傾き無しと有りの両方を用意する」)・決断事項 AN513・AN510・統括の検証項目 R279):
// **geoPN=2(v−u 則)の 3D の S3 の器**(段 geo2thick-324a —— 正本 tests/out/geo2thick-w324a.json)。
//
// 対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み(html の本文をそのまま実行 —— QA は tests/lib-w279b-headless.mjs の headless で
// 同じ段を試走の計画 QUICK で回す)、disk の有限厚の宣言 thickness(受理器 thickValidate・thickCrossCheck・build の coord3dPlace)と有限厚の対の本
// 🥞 galaxyGeo2Thick3d(傾き無し)・🧇 galaxyGeo2ThickTilt3d(同じ入力を全体で回した対)を測る。
//
// ■ 段(W324A_PART で絞れる)
//   flat    平面の写しの門の再確認: 🫓 galaxyGeo2Flat3d の外縁の比が二次元の 💫 の凍結の基準と同じビット(第322便a の器の gateRow をそのまま —— 12000 步)
//   accept  受理の表(正準形・既定・未知の鍵の拒否・h = 0 の旧署名・中心の参照・二次元の本と disk 以外の型の警告・中心の軸の警告)・乱数の系列の分離
//           (厚みを外した写しと面内の状態が同じビット)・h = 0 の build が鍵の無い本と同じビット・再抽選の上限(純関数 thickDraws と受理器の突き合わせを直に)・
//           抽選の統計(本の 380 粒子の抽選の回数・z の二乗平均と h の比 —— 記録だけ)・対の本の宣言の差(🥞 = 🫓 + thickness + 倍精度・🧇 = 🥞 + incl・node + 中心の軸)
//   pair    対の本の走行(子プロセス —— 12000 步 × A〔kFrame=1〕と B〔kFrame=0 の写し〕):
//             thick・tilt …… 内蔵の本を HP.loadPreset → HP.abStart('kFrame', 0)(claim の手続きと同じ)・面の座標の外縁帯 [156,286] の比・z の広がり・脱落・
//                             自転軸と面の法線の角・エネルギーの台帳(記録だけ)・回転共変の照合の写し(600・6000・12000 步の A の状態)
//             thin・thinTilt …… 厚み 0 の対(🫓 に倍精度の状態を足した写しと、それを全体で回した写し —— 器の build・内蔵しない)
//             thick-h2・tilt-h2 …… 刻み h/2(dt 0.008 × 24000 步 —— 同じ時刻)の刻みの感度
//   an510   AN510 の門(全粒子の向きを "vector" で —— 小さい系 41 体・倍精度の状態の有限厚の本の写し・傾き無しと傾き有り):
//             零自転からの立ち上がり・符号反転(群の自転 −0.05 から)・上限への到達(群の自転 39.95 から —— |s| ≤ 40 のクランプ)で、html の步と第321便a の
//             純関数(spinPolicy "vector")が全状態で同じビット・クランプが動いた場合は保存則の範囲(P の閉じ)と落とした角運動量・自転のエネルギーを分けて
//   ckpt    保存と復帰(🥞 の build —— ckSnapOne → M 步 → ckRestoreOne → M 步 が保存しなかった走行と同じビット)・A/B の複製(cloneSimState)
//   wide    回転共変の差の出どころの切り分け(器の中だけの診断 —— エンジンは変えない): 🥞🧇 の build の後に、単精度の配列(場 u・u の履歴・重み和・Δp —— 次に自転・質量・
//           対距離・半径)を同じ値の Float64Array に差し替えた写しで、回転共変の差が倍精度の丸めへ下がるか(三次元では framePrecision の宣言が無いので器の差し替え)
//
// ■ 試走: W324A_QUICK=1(W324A_OUT が要る —— 正本を書かない)。W324A_WORKERS(既定 2 —— flat と pair の行を子プロセスで並走)。
// ■ 言わないこと: 3D で銀河を表せたと書かない・有限厚は初期の近似(円盤の自己重力を含む平衡ではない)・抽選の後の z の二乗平均は h にならない(切断と再抽選)・
//   外縁の比は原理の本の機構の値(実在の銀河の観測の較正ではない)・h と h/2 は刻みの感度診断。
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
import * as X2 from './exp-w322a-geo2flat.mjs';
// 第281便a の領域 hash の宣言(器と lib から deriveScope で引いた下限 —— 読む本は 🫓🥞🧇 と 💫〔.find で引く —— 第322便a の器の gateRow も〕・
//   受理器と build の関数は HP.validatePreset・HP.coord3d.makeSim から辿る・純関数 thickDraws・thickCrossCheck・thickSeedOf・thickSeed0Of は式の評価で直に読む)
const REGEN_SCOPE = {"presets":["galaxyGeo2","galaxyGeo2Flat3d","galaxyGeo2Thick3d","galaxyGeo2ThickTilt3d"],"roots":["CK_ARRS","CK_SC","HP.ab","HP.abStart","HP.abStop","HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.loadPreset","HP.presetSig","HP.sim","HP.validatePreset","T","THICK_REDRAW_MAX","THICK_VERSION","ckRestoreOne","ckSnapOne","cloneSimState","ctx","cw","sim","thickCrossCheck","thickDraws","thickSeed0Of","thickSeedOf"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w324a-geo2thick-1';
export const OUT_GEO2THICK = 'tests/out/geo2thick-w324a.json';
const TARGET = process.env.W324A_TARGET || 'beta/index.html';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (x) => JSON.parse(JSON.stringify(x));
export const THICK_ID = 'galaxyGeo2Thick3d', TILT_ID = 'galaxyGeo2ThickTilt3d', FLAT_ID = X2.BOOK_ID, GAL2D_ID = X2.GAL2D_ID;
export const NEW_IDS = Object.freeze([THICK_ID, TILT_ID]);
export const PLAN = Object.freeze({ dt: 0.016, steps: 12000, mid: 6000, snaps: Object.freeze([600, 6000, 12000]), h2dt: 0.008, h2steps: 24000, h2mid: 12000,
  an510Disk: 40, an510Steps: 400, flipSpin: 3e-4, capSpin: 39.9999, ckN: 20, ckM: 20, thickH: 8, incl: 30, node: 40, wideSteps: 300, wideSnaps: Object.freeze([30, 300]) });
export const QUICK = Object.freeze({ dt: 0.016, steps: 300, mid: 150, snaps: Object.freeze([30, 150, 300]), h2dt: 0.008, h2steps: 600, h2mid: 300,
  an510Disk: 12, an510Steps: 60, flipSpin: 3e-4, capSpin: 39.9999, ckN: 6, ckM: 6, thickH: 8, incl: 30, node: 40, wideSteps: 30, wideSnaps: Object.freeze([10, 30]) });
const NOT_CLAIM = ['3D で銀河を表せたと書かない(v−u 則の三次元の步の本 —— 原理の本の機構の値)', '有限厚は初期の近似(円盤の自己重力を含む平衡ではない)',
  '抽選の後の z の二乗平均は h にならない(切断と再抽選)', '外縁の比は実在の銀河の観測の較正ではない', 'h と h/2 は刻みの感度診断(収束の判定に使わない)'];
const BAND = X2.FROZEN.band;

/* ───────── 道具 ───────── */
const bitsOf = (a, b) => { let nd = 0; for (let i = 0; i < a.length; i++) if (!Object.is(a[i], b[i])) nd++; return nd; };
const bookCopy = (HP, id) => { const p = clone(HP.allPresets().find((q) => q.id === id)); delete p.claims; return p; };
function simOf(HP, preset) {
  const v = HP.validatePreset(clone(preset));
  if (!v.ok) throw new Error('受理されない: ' + JSON.stringify(v.errors).slice(0, 300));
  const S = HP.coord3d.makeSim(); S.build(clone(v.preset));
  return S;
}
/** 円盤の基底: R = R_z(node)·R_x(incl)(受理器の coord3dPlace と同じ回転)・T = Rᵀ・n = R ẑ(第322便a の器と同じ)。 */
export const frameOf = (incl, node) => X2.tiltFrameOf(incl, node);
const mv = (M, v) => G3.mv3(M, v);
/** 面の座標の外縁帯 [156,286] の平均の vφ(固定中心の 0 行を除く)。 */
function outerOf(S, F) {
  let sum = 0, c = 0;
  for (let i = 1; i < S.n; i++) {
    let x = S.x[i], y = S.y[i], vx = S.vx[i], vy = S.vy[i];
    if (F) { const r = mv(F.T, [S.x[i], S.y[i], S.z[i]]), v = mv(F.T, [S.vx[i], S.vy[i], S.vz[i]]); x = r[0]; y = r[1]; vx = v[0]; vy = v[1]; }
    const rr = Math.hypot(x, y); if (rr >= BAND[0] && rr <= BAND[1]) { sum += (x * vy - y * vx) / rr; c++; }
  }
  return { v: c ? sum / c : 0, c };
}
/** 面の外への広がり(面の座標の z)・脱落(原点から 2R = 520 の外)・自転する粒子の軸と面の法線の角の最大。 */
function spreadOf(S, F) {
  let zm = 0, z2 = 0, vzm = 0, vz2 = 0, axm = 0, out = 0, nSp = 0, n = 0;
  const nz = F ? F.n : [0, 0, 1];
  for (let i = 1; i < S.n; i++) {
    let z = S.z[i], vz = S.vz[i];
    if (F) { z = mv(F.T, [S.x[i], S.y[i], S.z[i]])[2]; vz = mv(F.T, [S.vx[i], S.vy[i], S.vz[i]])[2]; }
    zm = Math.max(zm, Math.abs(z)); z2 += z * z; vzm = Math.max(vzm, Math.abs(vz)); vz2 += vz * vz; n++;
    if (S.spin[i] !== 0) { nSp++; const d = S.sax[i] * nz[0] + S.say[i] * nz[1] + S.saz[i] * nz[2]; axm = Math.max(axm, Math.acos(Math.min(1, Math.abs(d)))); }
    if (Math.hypot(S.x[i], S.y[i], S.z[i]) > 520) out++;
  }
  return { zRms: n ? Math.sqrt(z2 / n) : 0, zMax: zm, vzRms: n ? Math.sqrt(vz2 / n) : 0, vzMax: vzm, beyond2R: out, nSpin: nSp, axisDevRad: axm };
}
function energyOf(HP, S) { const t = HP.coord3d.totals(S); return { E: t.E, P: t.P, L: t.L }; }
/** 回転共変の照合の写し(A の状態 —— 位置・速度・自転のベクトル Ω = s â)。 */
function snapOf(S) {
  const o = { x: [], y: [], z: [], vx: [], vy: [], vz: [], ox: [], oy: [], oz: [] };
  for (let i = 0; i < S.n; i++) { o.x.push(S.x[i]); o.y.push(S.y[i]); o.z.push(S.z[i]); o.vx.push(S.vx[i]); o.vy.push(S.vy[i]); o.vz.push(S.vz[i]);
    o.ox.push(S.spin[i] * S.sax[i]); o.oy.push(S.spin[i] * S.say[i]); o.oz.push(S.spin[i] * S.saz[i]); }
  return o;
}
/** 回転共変の程度: 傾き有りの写し b と、傾き無しの写し a を R で回した像の差(位置は円盤の半径・速度と自転は最大の大きさで割る)。 */
export function covOf(a, b, F) {
  let dr = 0, dv = 0, dO = 0, vs = 0, os = 0, zp = 0; const rs = 260;
  const dl = []; // 粒子ごとの位置の差(中央値のため)
  for (let i = 0; i < a.x.length; i++) {
    const r = mv(F.R, [a.x[i], a.y[i], a.z[i]]), v = mv(F.R, [a.vx[i], a.vy[i], a.vz[i]]), O = mv(F.R, [a.ox[i], a.oy[i], a.oz[i]]);
    const d = Math.hypot(r[0] - b.x[i], r[1] - b.y[i], r[2] - b.z[i]); dl.push(d); dr = Math.max(dr, d);
    dv = Math.max(dv, Math.hypot(v[0] - b.vx[i], v[1] - b.vy[i], v[2] - b.vz[i])); vs = Math.max(vs, Math.hypot(b.vx[i], b.vy[i], b.vz[i]));
    dO = Math.max(dO, Math.hypot(O[0] - b.ox[i], O[1] - b.oy[i], O[2] - b.oz[i])); os = Math.max(os, Math.hypot(b.ox[i], b.oy[i], b.oz[i]));
  }
  dl.sort((p, q) => p - q);
  return { posMaxRel: dr / rs, posMedRel: dl[dl.length >> 1] / rs, velMaxRel: vs > 0 ? dv / vs : 0, spinVecMaxRel: os > 0 ? dO / os : 0 };
}
/** 厚み 0 の面の外の揺らぎ(傾き有りの写しを面の座標へ戻した z の最大)。 */
function outOfPlane(b, F) { let m = 0; for (let i = 0; i < b.x.length; i++) m = Math.max(m, Math.abs(mv(F.T, [b.x[i], b.y[i], b.z[i]])[2])); return m; }

/* ───────── pair(子プロセスでも走る 1 行)───────── */
/** 厚み 0 の対の写し(🫓 に倍精度の状態を足す —— 傾き有りは群の incl・node と中心の自転軸 R ẑ)。 */
export function thinBookOf(HP, plan, tilt) {
  const p = bookCopy(HP, FLAT_ID); p.physics.stateCarry = 'double';
  if (tilt) { const F = frameOf(plan.incl, plan.node); p.bodies[1].incl = plan.incl; p.bodies[1].node = plan.node;
    p.bodies[0].spinAxis = { enable: true, tiltDeg: F.axisDecl.tiltDeg, azimuthDeg: F.axisDecl.azimuthDeg, source: 'w324a' }; }
  return p;
}
export function pairRow(HP, plan, kind) {
  const t0 = Date.now();
  const h2 = /-h2$/.test(kind), base = kind.replace(/-h2$/, ''), tilt = (base === 'tilt' || base === 'thinTilt');
  const dt = h2 ? plan.h2dt : plan.dt, steps = h2 ? plan.h2steps : plan.steps, mid = h2 ? plan.h2mid : plan.mid, F = tilt ? frameOf(plan.incl, plan.node) : null;
  let A, B, how;
  if (base === 'thick' || base === 'tilt') { HP.loadPreset(base === 'thick' ? THICK_ID : TILT_ID, false); HP.abStart('kFrame', 0); A = HP.sim; B = HP.ab().simB; how = 'HP.loadPreset → HP.abStart(\'kFrame\', 0)'; }
  else { const p = thinBookOf(HP, plan, tilt), q = clone(p); q.physics.kFrame = 0; A = simOf(HP, p); B = simOf(HP, q); how = '器の build(🫓 の写しに stateCarry:"double")'; }
  const at = { kind, how, n: A.n, dt, steps, kFrameA: A.params.kFrame, kFrameB: B.params.kFrame, stateType: Object.prototype.toString.call(A.x).slice(8, -1), integrator: A.integrator };
  const z0 = spreadOf(A, F), e0A = energyOf(HP, A), e0B = energyOf(HP, B), snaps = {};
  if (!h2) snaps[0] = snapOf(A);
  let midRow = null;
  for (let k = 0; k < steps; k++) {
    A.step(dt); B.step(dt);
    if (k + 1 === mid) { const a = outerOf(A, F), b = outerOf(B, F); midRow = { steps: k + 1, ratio: a.v / b.v }; }
    if (!h2 && plan.snaps.indexOf(k + 1) >= 0) snaps[k + 1] = snapOf(A);
  }
  const a = outerOf(A, F), b = outerOf(B, F), eA = energyOf(HP, A), eB = energyOf(HP, B), g2 = HP.coord3d.geo2.state(A);
  const dEA = eA.E - e0A.E, wA = g2.work.KE + g2.work.spinE, dEB = eB.E - e0B.E;
  const row = Object.assign(at, { t: A.t, ratio: a.v / b.v, vphiKF1: a.v, vphiKF0: b.v, nBand: [a.c, b.c], mid: midRow, z0, zA: spreadOf(A, F), zB: spreadOf(B, F),
    energy: { E0: e0A.E, dE_KF1: dEA, workKF1: wA, relResidualKF1: Math.abs(dEA - wA) / Math.abs(e0A.E), relKF0: Math.abs(dEB) / Math.abs(e0B.E) },
    axisTurnN: g2.axisTurnN, clampVN: [A.clampVN, B.clampVN], clampSN: [A.clampSN, B.clampSN], clampRN: [A.clampRN || 0, B.clampRN || 0],
    halt: [A.coord3dHalt || null, B.coord3dHalt || null], nan: A.hasNaN() || B.hasNaN(), snaps: h2 ? null : snaps, wallSec: (Date.now() - t0) / 1000 });
  if (base === 'thick' || base === 'tilt') HP.abStop();
  return row;
}
function childRow(args) {
  return new Promise((res, rej) => {
    const cp = spawn(process.execPath, [fileURLToPath(import.meta.url), '--row', ...args], { cwd: ROOT, env: process.env, stdio: ['ignore', 'pipe', 'inherit'] });
    let buf = ''; cp.stdout.on('data', (d) => { buf += d; });
    cp.on('close', (code) => { const ln = buf.trim().split('\n').filter((l) => l.startsWith('{')).pop(); if (code !== 0 || !ln) rej(new Error('子プロセスの行が無い(' + code + ')')); else res(JSON.parse(ln)); });
  });
}
function oneRow(HP, plan, j) { return j[0] === 'flat' ? X2.gateRow(HP, plan === QUICK ? X2.QUICK : X2.PLAN) : pairRow(HP, plan, j[1]); }
async function runRows(HP, plan, quick, workers, jobs) {
  if (workers < 2) return jobs.map((j) => oneRow(HP, plan, j));
  const out = new Array(jobs.length); let next = 0;
  const lane = async () => { while (next < jobs.length) { const k = next++; out[k] = await childRow([quick ? 'quick' : 'full', ...jobs[k]]); } };
  await Promise.all(Array.from({ length: Math.min(workers, jobs.length) }, lane));
  return out;
}
export const PAIR_KINDS = Object.freeze(['thick', 'tilt', 'thin', 'thinTilt', 'thick-h2', 'tilt-h2']);
/** 対の行から表(回転共変の程度・刻みの感度)を作る(行の snaps は表に要る分だけ残す)。 */
export function partPairOf(rows, plan) {
  const by = {}; for (const r of rows) by[r.kind] = r;
  const F = frameOf(plan.incl, plan.node), cov = {};
  for (const [a, b, key] of [['thick', 'tilt', 'thick'], ['thin', 'thinTilt', 'thin']]) {
    const A = by[a], B = by[b]; if (!A || !B) continue;
    cov[key] = { at: Object.keys(A.snaps).map(Number).sort((p, q) => p - q).map((s) => Object.assign({ steps: s }, covOf(A.snaps[s], B.snaps[s], F),
      { outOfPlane: key === 'thin' ? outOfPlane(B.snaps[s], F) : null })), ratioDiff: Math.abs(B.ratio - A.ratio), midRatioDiff: (A.mid && B.mid) ? Math.abs(B.mid.ratio - A.mid.ratio) : null };
  }
  const h2 = {};
  for (const k of ['thick', 'tilt']) { const a = by[k], b = by[k + '-h2']; if (a && b) h2[k] = { ratioH: a.ratio, ratioH2: b.ratio, diff: Math.abs(a.ratio - b.ratio), midDiff: (a.mid && b.mid) ? Math.abs(a.mid.ratio - b.mid.ratio) : null }; }
  const slim = rows.map((r) => { const o = Object.assign({}, r); delete o.snaps; return o; });
  return { rows: slim, cov, h2 };
}

/* ───────── accept(受理の表・乱数の系列・h = 0・再抽選の上限・統計)───────── */
const A_CASES = [
  ['book', '内蔵の本の宣言(h 8・cut 3・scale 1・center 0)', (q) => q, true, ''],
  ['defaults', 'cut・scale を省く(既定 3・1 を正準形に書き出す)', (q) => { delete q.bodies[1].thickness.z.cut; delete q.bodies[1].thickness.vz.scale; }, true, ''],
  ['h0', 'h = 0(鍵を正準形から外す —— 警告)', (q) => { q.bodies[1].thickness.z.h = 0; }, true, 'h = 0'],
  ['unknownTop', '未知の鍵 thickness.foo', (q) => { q.bodies[1].thickness.foo = 1; }, false, '未知の鍵 foo'],
  ['unknownZ', '未知の鍵 thickness.z.sigma', (q) => { q.bodies[1].thickness.z.sigma = 1; }, false, '未知の鍵 sigma'],
  ['unknownVz', '未知の鍵 thickness.vz.centerId', (q) => { q.bodies[1].thickness.vz.centerId = 'c'; }, false, '未知の鍵 centerId'],
  ['noVz', 'vz を書かない', (q) => { delete q.bodies[1].thickness.vz; }, false, '.vz が無い'],
  ['noCenter', 'center を書かない(配列の先頭を黙って中心とみなさない)', (q) => { delete q.bodies[1].thickness.vz.center; }, false, '.vz.center'],
  ['kindZ', 'z.kind "exp"', (q) => { q.bodies[1].thickness.z.kind = 'exp'; }, false, '.z.kind'],
  ['kindVz', 'vz.kind "isothermal"', (q) => { q.bodies[1].thickness.vz.kind = 'isothermal'; }, false, '.vz.kind'],
  ['hNeg', 'h = −1', (q) => { q.bodies[1].thickness.z.h = -1; }, false, '.z.h'],
  ['hBig', 'h が円盤の半径を超える', (q) => { q.bodies[1].thickness.z.h = 300; }, false, '.z.h'],
  ['cutLow', 'cut = 0.5', (q) => { q.bodies[1].thickness.z.cut = 0.5; }, false, '.z.cut'],
  ['scaleNeg', 'scale = −1', (q) => { q.bodies[1].thickness.vz.scale = -1; }, false, '.vz.scale'],
  ['centerOut', 'center が bodies の行の外', (q) => { q.bodies[1].thickness.vz.center = 5; }, false, '行の外'],
  ['centerDisk', 'center が disk の行', (q) => { q.bodies[1].thickness.vz.center = 1; }, false, '正の質量の single'],
  ['centerMoved', '中心の single が円盤の中心と違う位置', (q) => { q.bodies[0].x = 10; }, false, '位置が円盤の中心'],
  ['axisWarn', '円盤を傾けて中心の軸を +z のまま(警告 —— 受理)', (q) => { q.bodies[1].incl = 30; q.bodies[1].node = 40; }, true, '円盤の法線'],
  ['ringWarn', 'ring の群の thickness(disk 専用 —— 警告して落とす)', (q) => { const d = q.bodies[1]; q.bodies[1] = { type: 'ring', n: 40, cx: 0, cy: 0, rIn: 60, rOut: 200, mMin: 0.16, mMax: 0.5, spinMin: 0, spinMax: 0, vMode: 'kepler', aroundMass: 2500, direction: 1, omega: 0, vNoise: 0, pinned: false, thickness: d.thickness }; }, true, 'disk 専用'],
  ['coord2d', '二次元の本の thickness(値は捨てない —— Z の宣言の警告)', (q) => { delete q.physics.coord; delete q.physics.stateCarry; }, true, 'Z の宣言'],
];
export function partAccept(H, plan) {
  const HP = H.HP, E = H.evalExpr, rows = [];
  for (const [key, label, f, ok, want] of A_CASES) {
    const q = bookCopy(HP, THICK_ID); f(q);
    const v = HP.validatePreset(clone(q));
    const msg = v.ok ? (v.warnings || []).join(' | ') : (v.errors || []).join(' | ');
    const th = v.ok ? ((v.preset.bodies[1] || {}).thickness || null) : null;
    const pass = (v.ok === ok) && (want === '' ? (v.warnings || []).length === 0 : msg.indexOf(want) >= 0) && (key !== 'h0' || th === null) && (key !== 'ringWarn' || th === null)
      && (key !== 'defaults' || JSON.stringify(th) === '{"z":{"kind":"gauss","h":8,"cut":3},"vz":{"kind":"local-nu","scale":1,"center":0}}');
    rows.push({ key, label, expect: ok ? 'accept' : 'reject', ok: v.ok, canon: th, msg: msg.slice(0, 200), pass });
  }
  // 乱数の系列の分離: 厚みを外した写しと面内の状態(位置・速度・質量・自転)が同じビット・z と v_z だけが違う
  const pT = bookCopy(HP, THICK_ID), pN = clone(pT); delete pN.bodies[1].thickness;
  const ST = simOf(HP, pT), SN = simOf(HP, pN);
  let nIn = 0, dIn = 0; for (const f of ['x', 'y', 'vx', 'vy', 'm', 'spin', 'R']) { nIn += ST.n; dIn += bitsOf(ST[f], SN[f]); }
  let zNon0 = 0, vzNon0 = 0; for (let i = 1; i < ST.n; i++) { if (ST.z[i] !== 0) zNon0++; if (ST.vz[i] !== 0) vzNon0++; }
  // h = 0 の宣言は鍵の無い本と同じ署名・同じ build(全欄)
  const p0 = clone(pT); p0.bodies[1].thickness.z.h = 0;
  const S0 = simOf(HP, p0); let n0 = 0, d0 = 0; for (const f of ['x', 'y', 'z', 'vx', 'vy', 'vz', 'm', 'spin', 'R', 'sax', 'say', 'saz']) { n0 += S0.n; d0 += bitsOf(S0[f], SN[f]); }
  const sig0 = HP.presetSig(clone(p0)) === HP.presetSig(clone(pN));
  // 傾き有りの本の build は傾き無しの本の build を R で回した像(初期の状態 —— 丸めの程度)
  const SR = simOf(HP, bookCopy(HP, TILT_ID)), F = frameOf(plan.incl, plan.node), c0 = covOf(snapOf(ST), snapOf(SR), F);
  let axE = 0; for (let i = 1; i < SR.n; i++) axE = Math.max(axE, Math.hypot(SR.sax[i] - F.n[0], SR.say[i] - F.n[1], SR.saz[i] - F.n[2]));
  const ax0 = Math.hypot(SR.sax[0] - F.n[0], SR.say[0] - F.n[1], SR.saz[0] - F.n[2]);
  // 再抽選の上限(純関数 thickDraws と受理器の突き合わせを直に —— 受理器の cut は 1 以上なので本の宣言では上限に届かない)
  const draws = E('thickDraws'), cross = E('thickCrossCheck'), seedOf = E('thickSeedOf'), seed0Of = E('thickSeed0Of'), MAXT = E('THICK_REDRAW_MAX');
  const dLow = draws(12345, 40, 1e-3);
  const fake = { seed: 1, bodies: [{ type: 'single', m: 1, x: 0, y: 0, spin: 0 }, { type: 'disk', n: 40, cx: 0, cy: 0, thickness: { z: { kind: 'gauss', h: 1, cut: 1e-3 }, vz: { kind: 'local-nu', scale: 1, center: 0 } } }] };
  const crossMsg = cross(fake, []);
  const dBook = draws(seedOf(seed0Of(pT), 1), pT.bodies[1].n, 3), dCut1 = draws(seedOf(seed0Of(pT), 1), pT.bodies[1].n, 1);
  let zr = 0; for (let i = 1; i < ST.n; i++) zr += ST.z[i] * ST.z[i]; zr = Math.sqrt(zr / (ST.n - 1));
  // 内蔵の三次元の geoPN=2 の本と宣言の差(🥞 = 🫓 + thickness + stateCarry・🧇 = 🥞 + incl・node + 中心の spinAxis)
  const fl = bookCopy(HP, FLAT_ID), th = bookCopy(HP, THICK_ID), tt = bookCopy(HP, TILT_ID);
  const phOf = (p) => { const o = Object.assign({}, p.physics); delete o.stateCarry; return JSON.stringify(o); };
  const bOf = (p, drop) => JSON.stringify(p.bodies.map((b, k) => { const o = clone(b); for (const d of drop) { if (d[0] === k) delete o[d[1]]; } return o; }));
  const declDiff = {
    thickVsFlat: th.seed === fl.seed && phOf(th) === phOf(fl) && th.physics.stateCarry === 'double' && fl.physics.stateCarry === undefined && bOf(th, [[1, 'thickness']]) === bOf(fl, []),
    tiltVsThick: tt.seed === th.seed && JSON.stringify(tt.physics) === JSON.stringify(th.physics) && bOf(tt, [[0, 'spinAxis'], [1, 'incl'], [1, 'node']]) === bOf(th, [])
      && tt.bodies[1].incl === plan.incl && tt.bodies[1].node === plan.node && tt.bodies[0].spinAxis.enable === true
      && tt.bodies[0].spinAxis.tiltDeg === F.axisDecl.tiltDeg && tt.bodies[0].spinAxis.azimuthDeg === F.axisDecl.azimuthDeg };
  return { rows, nPass: rows.filter((r) => r.pass).length, nCases: rows.length,
    rng: { nVal: nIn, nDiff: dIn, zNonZero: zNon0, vzNonZero: vzNon0, nDisk: ST.n - 1 },
    h0: { nVal: n0, nDiff: d0, sigSame: sig0 },
    tiltInit: Object.assign({}, c0, { diskAxisDev: axE, centerAxisDev: ax0, saOn: Array.from(SR.saOn).reduce((s, x) => s + x, 0) }),
    redraw: { max: MAXT, lowCutFail: dLow.fail, crossMsg: crossMsg || null, book: { draws: dBook.draws, maxTries: dBook.maxTries, n: pT.bodies[1].n, fail: dBook.fail }, cut1: { draws: dCut1.draws, maxTries: dCut1.maxTries, fail: dCut1.fail } },
    stats: { h: plan.thickH, zRms: zr, zRmsOverH: zr / plan.thickH },
    census: { declDiff },   // 内蔵の三次元の geoPN=2 の本の数え上げは QA(全本を走査する —— 器の領域を all にしない)
    pass: rows.every((r) => r.pass) && dIn === 0 && zNon0 === ST.n - 1 && vzNon0 === ST.n - 1 && d0 === 0 && sig0 && c0.posMaxRel < 1e-12 && c0.velMaxRel < 1e-12 && axE < 1e-12 && ax0 < 1e-12
      && dLow.fail === 0 && typeof crossMsg === 'string' && dBook.fail < 0 && declDiff.thickVsFlat && declDiff.tiltVsThick };
}

/* ───────── an510(小さい系 —— html の步と純関数 "vector")───────── */
/** 自転を置いた写しの s を "vector" の 1 步で作り直す(純関数 applySpin3 と同じ式 —— 上限のクランプの前の値)。 */
function spinPreClamp(s, ax, ay, az, dsx, dsy, dsz) {
  if (dsx === 0 && dsy === 0 && dsz === 0) return s;
  const dpar = dsx * ax + dsy * ay + dsz * az, px = dsx - dpar * ax, py = dsy - dpar * ay, pz = dsz - dpar * az;
  if (px === 0 && py === 0 && pz === 0) return s + dpar;
  const Ox = s * ax + dsx, Oy = s * ay + dsy, Oz = s * az + dsz, mag = Math.sqrt(Ox * Ox + Oy * Oy + Oz * Oz);
  if (!(mag > 0)) return 0;
  return ((Ox * ax + Oy * ay + Oz * az) < 0 ? -1 : 1) * mag;
}
function an510Case(HP, plan, id, mode) {
  const p = bookCopy(HP, id); p.bodies[1].n = plan.an510Disk; p.overlays = {};
  const S = simOf(HP, p);
  // 符号反転と上限への到達は build の後の**状態の写しの編集**(宣言ではない —— 宣言の自転の値域は ±20 で、步の上限 |s| ≤ 40 に宣言では届かない):
  //   円盤の粒子の自転を ±flipSpin(残余トルクの 1 步の増分 10⁻⁴ 級より少し大きい —— 0 を横切る)・±capSpin(上限 40 のすぐ内)に交互の符号で置く
  if (mode === 'flip' || mode === 'cap') { const v = mode === 'flip' ? plan.flipSpin : plan.capSpin; for (let i = 1; i < S.n; i++) S.spin[i] = (i % 2 ? 1 : -1) * v; }
  let st = G3.stateOf3D(S, null, { spinPolicy: 'vector' });
  const s0 = Array.from(S.spin), I = Array.from({ length: S.n }, (_, i) => 0.5 * st.m[i] * st.R[i] * st.R[i]);
  const L0 = G3.totals3(st);
  let nVal = 0, nDiff = 0, flips = 0, firstRise = null, dropL = [0, 0, 0], dropE = 0, capEvents = 0;
  const F = ['x', 'y', 'z', 'vx', 'vy', 'vz', 'spin', 'sax', 'say', 'saz', 'uPx', 'uPy', 'uPz', 'hasU', 'rotA'];
  for (let k = 0; k < plan.an510Steps; k++) {
    const prev = G3.cloneState(st);
    S.step(FROZEN_DT); st = G3.geo2Step3(st, FROZEN_DT, { trace: true });
    for (const f of F) { nVal += S.n; nDiff += bitsOf(S[f], st[f]); }
    const tr = st.trace[st.trace.length - 1];
    for (let i = 0; i < S.n; i++) {
      if (prev.spin[i] !== 0 && st.spin[i] !== 0 && Math.sign(prev.spin[i]) !== Math.sign(st.spin[i])) flips++;
      if (firstRise === null && i > 0 && s0[i] === 0 && st.spin[i] !== 0) firstRise = k + 1;
      if (tr && tr.accS && !st.pinned[i]) {   // 上限のクランプが落とした分(クランプの前の s —— 純関数の式で作り直す)
        const sp = spinPreClamp(prev.spin[i], prev.sax[i], prev.say[i], prev.saz[i], tr.accS[0][i], tr.accS[1][i], tr.accS[2][i]);
        if (sp !== st.spin[i] && Math.abs(sp) > 40) { const ds = sp - st.spin[i]; capEvents++;
          dropL[0] += I[i] * ds * st.sax[i]; dropL[1] += I[i] * ds * st.say[i]; dropL[2] += I[i] * ds * st.saz[i]; dropE += 0.25 * st.m[i] * st.R[i] * st.R[i] * (sp * sp - st.spin[i] * st.spin[i]); }
      }
    }
    delete st.trace;
  }
  const L1 = G3.totals3(st), sc = ledgerScale(st);
  const dP = Math.max(...[0, 1, 2].map((k) => Math.abs(L1.P[k] - L0.P[k]))) / sc.P;
  const dL = Math.max(...[0, 1, 2].map((k) => Math.abs(L1.L[k] - L0.L[k]))) / sc.L;
  const dLwithDrop = Math.max(...[0, 1, 2].map((k) => Math.abs(L1.L[k] + dropL[k] - L0.L[k]))) / sc.L;
  let rise = 0, axTilt = 0; for (let i = 1; i < S.n; i++) { if (s0[i] === 0 && S.spin[i] !== 0) rise++; if (S.spin[i] !== 0) axTilt = Math.max(axTilt, Math.acos(Math.min(1, Math.abs(S.saz[i])))); }
  return { id, mode, n: S.n, steps: plan.an510Steps, prec: Object.prototype.toString.call(S.x).slice(8, -1), nVal, nDiff, same: nDiff === 0, axisTurns: S.g3AxisTurnN, saOn: Array.from(S.saOn).reduce((s, x) => s + x, 0),
    rise, firstRise, flips, clampSN: S.clampSN, clampVN: S.clampVN, clampRN: S.clampRN || 0, capEvents, dP, dL, dLwithDrop, dropL: Math.hypot(...dropL) / sc.L, dropSpinE: dropE, axisFromZMax: axTilt };
}
const FROZEN_DT = X2.FROZEN.dt;
function ledgerScale(st) { let P = 0, L = 0; for (let i = 0; i < st.n; i++) { const m = Math.abs(st.m[i]), v = Math.hypot(st.vx[i], st.vy[i], st.vz[i]); P += m * v; L += m * Math.hypot(st.x[i], st.y[i], st.z[i]) * v + 0.5 * m * st.R[i] * st.R[i] * Math.abs(st.spin[i]); } return { P, L }; }
export function partAN510(HP, plan) {
  const rows = [];
  for (const id of NEW_IDS) for (const mode of ['rise', 'flip', 'cap']) rows.push(an510Case(HP, plan, id, mode));
  const g = (m) => rows.filter((r) => r.mode === m);
  return { rows, htmlSame: rows.every((r) => r.same), rise: g('rise').every((r) => r.rise === r.n - 1 && r.firstRise === 2 && r.axisTurns > 0),
    flip: g('flip').every((r) => r.flips > 0), cap: g('cap').every((r) => r.clampSN > 0 && r.capEvents === r.clampSN && r.clampVN === 0 && r.clampRN === 0),
    capLedger: g('cap').every((r) => r.dP < 1e-9 && r.dLwithDrop < 1e-9 && r.dL > 100 * r.dLwithDrop),
    centerEnabled: rows.filter((r) => r.id === TILT_ID).every((r) => r.saOn === 1) };
}

/* ───────── ckpt(🥞 —— 保存と復帰・A/B の複製)───────── */
const CK3 = ['x', 'y', 'z', 'vx', 'vy', 'vz', 'spin', 'sax', 'say', 'saz', 'uPx', 'uPy', 'uPz', 'hasU', 'rotA'];
const CKL = ['resPx', 'resPy', 'resPz', 'resLx', 'resLy', 'resL', 'g3ConPx', 'g3ConPy', 'g3ConPz', 'g3ConLx', 'g3ConLy', 'g3ConLz', 'g3WorkE', 'g3WorkKE', 'g3SpinE', 'g3WorkN', 'g3AxisTurnN', 'clampVN', 'clampSN', 'clampRN'];
function fieldsOf(S) { const o = {}; for (const a of CK3) o[a] = Array.from(S[a].subarray(0, S.n)); for (const a of CKL) o[a] = S[a]; o.t = S.t; return o; }
function fieldDiff(a, b) { let nd = 0, nv = 0; for (const k of Object.keys(a)) { if (Array.isArray(a[k])) { nv += a[k].length; for (let i = 0; i < a[k].length; i++) if (!Object.is(a[k][i], b[k][i])) nd++; } else { nv++; if (!Object.is(a[k], b[k])) nd++; } } return { nv, nd }; }
export function partCkpt(H, plan) {
  const HP = H.HP, E = H.evalExpr, out = {};
  for (const id of NEW_IDS) {
    HP.loadPreset(id, false);
    const S = E('sim');
    for (let k = 0; k < plan.ckN; k++) S.step(FROZEN_DT);
    let zAbs = 0, uzAbs = 0; for (let i = 0; i < S.n; i++) { zAbs = Math.max(zAbs, Math.abs(S.z[i])); uzAbs = Math.max(uzAbs, Math.abs(S.uPz[i])); }
    const C = E('cloneSimState')();
    const o = E('ckSnapOne')(S);
    for (let k = 0; k < plan.ckM; k++) S.step(FROZEN_DT);
    const ref = fieldsOf(S);
    for (let k = 0; k < plan.ckM; k++) C.step(FROZEN_DT);
    const dc = fieldDiff(ref, fieldsOf(C));
    E('ckRestoreOne')(S, o);
    for (let k = 0; k < plan.ckM; k++) S.step(FROZEN_DT);
    const dr = fieldDiff(ref, fieldsOf(S));
    out[id] = { restore: { nVal: dr.nv, nDiff: dr.nd }, clone: { nVal: dc.nv, nDiff: dc.nd }, zMax: zAbs, uPzMax: uzAbs, prec: Object.prototype.toString.call(S.x).slice(8, -1) };
  }
  return { rows: out, pass: NEW_IDS.every((id) => out[id].restore.nDiff === 0 && out[id].clone.nDiff === 0 && out[id].zMax > 0 && out[id].uPzMax > 0) };
}

/* ───────── wide(回転共変の差の出どころ —— 器の中だけの配列の差し替え)───────── */
export const WIDE_SETS = Object.freeze([
  ['asIs', '本のまま(場の配列・自転・質量は単精度 —— stateCarry:"double" は位置・速度だけ)', []],
  ['fields', '場の配列を倍精度に(u・u の履歴・重み和・Δp —— 器の差し替え)', ['uAx', 'uAy', 'uPx', 'uPy', 'uPz', 'sumW', 'dpx', 'dpy']],
  ['all', '場の配列・自転・質量・対距離・半径を倍精度に(器の差し替え)', ['uAx', 'uAy', 'uPx', 'uPy', 'uPz', 'sumW', 'dpx', 'dpy', 'spin', 'm', 'mEff', 'pairD', 'R']]]);
function widenOf(S, keys) { let n = 0; for (const k of keys) if (S[k] && S[k].constructor === Float32Array) { S[k] = Float64Array.from(S[k]); n++; } S._g3 = null; return n; }
export function partWide(HP, plan) {
  const F = frameOf(plan.incl, plan.node), rows = [];
  for (const [key, label, keys] of WIDE_SETS) {
    const A = simOf(HP, bookCopy(HP, THICK_ID)), B = simOf(HP, bookCopy(HP, TILT_ID));
    const nA = widenOf(A, keys); widenOf(B, keys);
    const at = [];
    for (let k = 1; k <= plan.wideSteps; k++) { A.step(FROZEN_DT); B.step(FROZEN_DT); if (plan.wideSnaps.indexOf(k) >= 0) at.push(Object.assign({ steps: k }, covOf(snapOf(A), snapOf(B), F))); }
    rows.push({ key, label, nWidened: nA, at, fieldType: Object.prototype.toString.call(A.uAx).slice(8, -1), spinType: Object.prototype.toString.call(A.spin).slice(8, -1) });
  }
  const end = (r) => r.at[r.at.length - 1], asIs = end(rows[0]), all = end(rows[2]);
  return { rows, steps: plan.wideSteps, pass: all.posMaxRel < 1e-12 && all.velMaxRel < 1e-12 && all.spinVecMaxRel < 1e-12 && asIs.spinVecMaxRel > 1e3 * all.spinVecMaxRel };
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const P = J.parts, f = P.flat, a = P.accept, n = P.an510, c = P.ckpt, pr = P.pair;
  const rowsOk = !!(pr && pr.rows.length === PAIR_KINDS.length && pr.rows.every((r) => !r.nan && r.halt.every((h) => h === null)));
  return {
    flatFrozen: !!(f && (J.quick ? true : Object.is(f.row.ratio, X2.FROZEN.ratio))), flatClean: !!(f && f.row.clampVN.concat(f.row.clampSN, f.row.clampRN).every((x) => x === 0) && !f.row.nan),
    accept: !!(a && a.pass), an510Html: !!(n && n.htmlSame), an510Rise: !!(n && n.rise), an510Flip: !!(n && n.flip), an510Cap: !!(n && n.cap), an510CapLedger: !!(n && n.capLedger),
    ckpt: !!(c && c.pass), wideCov: !!(P.wide && P.wide.pass), pairFinite: rowsOk,
    pairCovInit: !!(pr && pr.cov.thick && pr.cov.thin && [pr.cov.thick.at[0], pr.cov.thin.at[0]].every((r) => r.steps === 0 && r.posMaxRel < 1e-12 && r.velMaxRel < 1e-12)),
    pairRatioInH2: !!(pr && pr.cov.thick && pr.h2.thick && pr.h2.tilt && pr.cov.thick.ratioDiff <= Math.max(pr.h2.thick.diff, pr.h2.tilt.diff)) };
}

/* ───────── 実行 ───────── */
async function main() {
  const quick = process.env.W324A_QUICK === '1', outRel = process.env.W324A_OUT || OUT_GEO2THICK;
  if (quick && !process.env.W324A_OUT) throw new Error('W324A_QUICK=1 には W324A_OUT が要る(正本を書かない)');
  const plan = quick ? QUICK : PLAN, workers = Math.max(1, Number(process.env.W324A_WORKERS || 2));
  const parts = String(process.env.W324A_PART || 'flat,accept,an510,ckpt,wide,pair').split(',').filter(Boolean);
  const html = path.join(ROOT, TARGET), targetSha256 = crypto.createHash('sha256').update(fs.readFileSync(html)).digest('hex');
  const HP = loadHtmlMain(html).HP, H = { HP, evalExpr: (code) => vm.runInThisContext(code) };   // 主の文脈(最上位の const は runInThisContext で読む)
  const outAbs = path.isAbsolute(outRel) ? outRel : path.join(ROOT, outRel);
  const prev = (process.env.W324A_PART && fs.existsSync(outAbs)) ? JSON.parse(fs.readFileSync(outAbs, 'utf8')) : null;
  const t0 = Date.now(), timing = {};
  const out = { version: HARNESS_VERSION, libVersion: G3.GEO2V3_VERSION, flatHarness: X2.HARNESS_VERSION, engineVersion: HP.coord3d.geo2.version, thickVersion: H.evalExpr('THICK_VERSION'),
    generator: 'tests/exp-w324a-geo2thick.mjs', quick, plan: clone(plan), target: TARGET, targetSha256,
    ruling: '原仮定者の回答(2026-11-01 —— AN500)・決断事項 AN513・AN510・統括の検証項目 R279', parts: (prev && prev.parts) || {}, notClaim: NOT_CLAIM };
  // 重い行(flat の 1 本と pair の 6 本)は子プロセスで先に並走させ、その間に軽い段を主で回す
  const heavy = [];
  if (parts.includes('pair')) for (const k of ['thick-h2', 'tilt-h2']) heavy.push(['pair', k]);   // 長い行を先に(2 本の子プロセスの負荷をそろえる)
  if (parts.includes('flat')) heavy.push(['flat']);
  if (parts.includes('pair')) for (const k of ['thick', 'tilt', 'thin', 'thinTilt']) heavy.push(['pair', k]);
  const th = Date.now();
  const heavyP = (workers >= 2 && heavy.length) ? runRows(HP, plan, quick, workers, heavy) : null;
  const RUN = { accept: () => partAccept(H, plan), an510: () => partAN510(HP, plan), ckpt: () => partCkpt(H, plan), wide: () => partWide(HP, plan) };
  for (const k of parts) { if (!RUN[k]) continue; const t = Date.now(); out.parts[k] = await RUN[k](); timing[k] = { wallSec: (Date.now() - t) / 1000 }; console.log(new Date().toISOString().slice(11, 19), 'part', k, timing[k].wallSec + ' s'); }
  const heavyRows = heavyP ? await heavyP : (heavy.length ? await runRows(HP, plan, quick, 1, heavy) : []);
  timing.heavy = { wallSec: (Date.now() - th) / 1000 };
  if (parts.includes('flat')) { const r = heavyRows.find((x) => x.kind === undefined); out.parts.flat = { row: r, frozen: clone(X2.FROZEN), sameAsFrozen: quick ? null : Object.is(r.ratio, X2.FROZEN.ratio) }; timing.flat = { wallSec: r.wallSec }; }
  if (parts.includes('pair')) { const rs = heavyRows.filter((x) => x.kind); out.parts.pair = partPairOf(rs, plan); timing.pair = { wallSec: Math.max(...rs.map((r) => r.wallSec)) }; }
  out.timing = timing; out.elapsedS = (Date.now() - t0) / 1000;
  out.gates = gatesOf(out); out.ok = Object.values(out.gates).every(Boolean);
  const CODE = ['tests/exp-w324a-geo2thick.mjs', 'tests/exp-w322a-geo2flat.mjs', 'tests/lib-w321a-geo2v3.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第324便a', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, stage: 'geo2thick', parts: Object.keys(out.parts), ruling: '原仮定者の回答(2026-11-01 —— AN500「3D銀河プリセットは、傾き無しと有りの両方を用意する」)・決断事項 AN513・AN510',
    reading: '統括の検証項目 R279(geoPN=2 の 3D の S3 —— disk の有限厚の宣言 thickness・有限厚の対の本・AN510 の門)',
    engine: 'Node の主の文脈(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・最上位の const は vm.runInThisContext で読む)・flat と pair の行は子プロセス(W324A_WORKERS ≥ 2)', notClaim: NOT_CLAIM });
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
    console.log(JSON.stringify(kind === 'flat' ? X2.gateRow(HP, mode === 'quick' ? X2.QUICK : X2.PLAN) : pairRow(HP, plan, sub)));
  } else await main();
}
