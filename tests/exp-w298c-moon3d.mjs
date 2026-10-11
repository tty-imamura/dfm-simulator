// 第298便c(原仮定者の裁定(第88報)「三次元座標化する」「geoPN=4 は慣性決定力の多粒子版・三次元が既定」・統括の検証項目 R167)——
// **🌥️ の三次元の写し —— 月の軌道傾斜 5.145° の再現作業の器**(Node だけ —— 対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、
// アプリの三次元の步〔dfmStep3・dfmInertialDragStep3〕を走らせる。走行は子プロセスで並列)。
//
// ■ 段(正本 tests/out/moon3d-w298c.json —— 段 moon3d-298c)
//   0 参照: 器の中だけの 3 次元のニュートンの参照積分器(第297便b の ref3dRun の写し —— 同じ式・アプリの物理ではない)で、第297便b の直した初期配置(平面の平均要素)に
//     傾斜 0 と 5.145° を当てた周期(第297便b の 8.8643 年の再測定)。
//   1 平面の一致: アプリの三次元の步で傾斜 0 の写し(z=vz=0)と 🌥️(二次元)の 118 公転窓の近点周期が同じ値か(三次元の步の零試験の延長)。
//   2 初期配置の見直し(三次元): 月の軌道面を黄道(xy 面)に対し 5.145° 傾け(昇交点 = t=0 の地球→月の方向 —— 近地点を昇交点に置く・太陽の反対方向)、
//     (近地点距離 rp, t=0 の接触離心率 e0)を 118 公転・h・gain 0 の走行の平均で 平均離心率 0.0549・恒星月 27.321661 日 に合わせる 2 元の Newton。
//     地球–月の重心の位置・速度は 🌥️ のまま(太陽 pinned・地球の公転は円・面は xy)。
//   3 抽出器(三次元): 近点の向きは**軌道面の中の近点経度** ϖ = Ω + u(瞬間の軌道面 —— 連続する 2 点の位置の外積の法線・昇交点 Ω・面内の角 u)で数える
//     (xy の atan2 だけでは数えない)。M1 = 検出器 B(距離の極小の 3 点放物線)の ϖ の時刻への直線 fit / M2 = 接触離心ベクトルの ϖ(位置の中心差分の
//     座標速度・64 步ごと)/ M3 = 位相の回帰。周回(恒星月)は黄道経度(xy の atan2)の通過。窓 118 / 354 公転・刻み h / h2 / h4。
//   4 gain の探索(0 から): 直した初期配置で gain の対数格子(SI 10⁻⁶〜0.0514182 m³/kg・13 点)+0 を h と h/2 で走り、8.85 年を挟めるか。
//     挟めたら Illinois で根を詰め、根の gain で初期配置を解き直して(gain が平均要素を動かす分)もう一度根を詰める(外側 2 回)。最終値は 6 桁に丸めて
//     h / h2 / h4 と 354 公転窓で測り直し、fitRecord(w298b-1 —— 近点回転・恒星月・平均離心率の 3 標的)を作る。挟めなければ
//     「この探索範囲では未達 —— 次の見直し」と、118 と 354 公転の窓の差を記録する。
//
// ■ しないこと・言わないこと
//   ・参照積分だけで fitted にしない(fitted の門はアプリの三次元の步の値だけ)。刻み依存の誤差を gain で吸収しない。架空の σ を作らない。
//   ・「現実を再現した」「月を再現した」「8.85 年を出した」「gain は普遍定数」「再現しない」「合わせられない」と書かない。
//
// 実行(Node だけ・子プロセス 3 本 —— W298C_WORKERS で変える。結果は並列数に依らない):
//   node tests/exp-w298c-moon3d.mjs            → 正本 tests/out/moon3d-w298c.json(W298C_MOON_OUT で出力先を変える)
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as L from './lib-w297b-fit.mjs';
const REGEN_SCOPE = {"presets":"all","roots":["$","DT","FIT_COND_KEYS","FIT_COND_VERSION","FIT_KNOB_KEYS","FIT_NUMERICS_KEYS","FIT_RECORD_KEYS","FIT_RECORD_VERSION","FIT_RECORD_VERSIONS","FIT_RESIDUAL_KEYS","FIT_TARGET_KEYS","FIT_TOL_KEYS","HP.FIT_COND_VERSION","HP.REL_DRAG_INERTIAL_VERSION","HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.fitCondSig","HP.inertialDragState","HP.sim","HP.validateFitRecord","HP.validatePreset","T","ch","cw","validateFitRecord"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w298c-moon3d-1';
export const EXTRACTOR_VERSION = 'w298c-emx3-1';
const clone = (x) => JSON.parse(JSON.stringify(x));
const find = (HP, id) => HP.allPresets().find((q) => q.id === id);
const TARGET = process.env.QA_TARGET || 'beta/index.html';
export const SRC_ID = 'earthMoonSunInertialFit';      // 🌥️(二次元)—— 写しの元
export const FIT_ID = 'earthMoonSunInertial3d';       // 三次元の写し(この器の正本が宣言の数を持つ)
export const DT = 0.016;
export const YEAR = 3155.76, DAY = 8.64;              // 本の時間単位(10⁴ s)で 1 ユリウス年・1 日
export const MOON = Object.freeze({
  inc: Object.freeze({ deg: 5.145, record: 'NASA NSSDC Moon Fact Sheet の軌道傾斜(黄道に対して)5.145°', note: '平均要素(σ なし)' }),
  eMean: Object.freeze({ value: 0.0549, record: 'SOL-47b082ec', note: '月の平均離心率 0.0549(NASA NSSDC —— JPL SSD は 0.0554)' }),
  sid: Object.freeze({ days: 27.321661, record: 'SOL-432f643e', note: '恒星月 27.321661 日(Chapront 2002)' }),
  target: Object.freeze({ q: 'apsidalPeriod118', obs: 8.85, unit: '年', record: 'SOL-59edf981' }),
  wins: Object.freeze([118, 354]),
  solveTol: 2e-6, solveIter: 8,
});
// 照合許容の宣言(出典に σ の無い量は kind:"declared" —— 第297便b の TOLS と同じ流儀)
export const TOLS3 = Object.freeze({
  aps: Object.freeze({ value: 0.005, kind: 'declared', note: '照合許容の宣言 0.005 年 —— 8.85 年は表記の末位まで(σ なし)。慣性系の平均の近地点経度の率(Chapront 2002 Table 4・40.67616758°/年 → 8.85038 年)はこの幅の中' }),
  sid: Object.freeze({ value: 0.00005, kind: 'declared', note: '照合許容の宣言 0.00005 日 —— 恒星月 27.321661 日(Chapront 2002)の初期配置の入力(走行の平均に合わせた量 —— 予言ではない)' }),
  ecc: Object.freeze({ value: 0.00005, kind: 'declared', note: '照合許容の宣言 0.00005 —— 平均離心率 0.0549 は表記の末位まで(JPL SSD は 0.0554・σ なし)。初期配置の入力(走行の平均に合わせた量)' }),
});
export const SI_RANGE = Object.freeze([1e-6, 0.0514182]);
export const GRID_N = 13;

/* ── 写し: 🌥️ の写しに coord:"3d"・gain・三次元の初期配置を当てる ── */
/** 地球–月の重心(位置・速度 —— 🌥️ のまま・面は xy)を保ち、地球→月の相対ベクトルを近地点(+x —— 太陽の反対方向)に置き、相対速度を x 軸のまわりに inc 度傾ける(昇交点 = 近地点)。 */
export function icBodies3(bodies, G, o) {
  const B = clone(bodies);
  const E = B[1], M = B[2], mt = E.m + M.m, fM = M.m / mt, mu = G * mt;
  const bx = (E.m * E.x + M.m * M.x) / mt, by = (E.m * E.y + M.m * M.y) / mt, bvx = (E.m * E.vx + M.m * M.vx) / mt, bvy = (E.m * E.vy + M.m * M.vy) / mt;
  const vp = Math.sqrt(mu * (1 + o.e0) / o.rp), ci = Math.cos((o.inc || 0) * Math.PI / 180), si = Math.sin((o.inc || 0) * Math.PI / 180);
  const r = [o.rp, 0, 0], w = [0, vp * ci, vp * si];
  E.x = bx - fM * r[0]; E.y = by - fM * r[1]; E.z = -fM * r[2]; E.vx = bvx - fM * w[0]; E.vy = bvy - fM * w[1]; E.vz = -fM * w[2];
  M.x = bx + (1 - fM) * r[0]; M.y = by + (1 - fM) * r[1]; M.z = (1 - fM) * r[2]; M.vx = bvx + (1 - fM) * w[0]; M.vy = bvy + (1 - fM) * w[1]; M.vz = (1 - fM) * w[2];
  B[0].z = 0; B[0].vz = 0;
  return B;
}
export function variant3(HP, o) {
  const q = clone(find(HP, SRC_ID));
  delete q.fitRecord; delete q.id;
  q.physics.coord = '3d';
  q.physics.relativeDrag.gain = o.gain;
  q.bodies = icBodies3(q.bodies, q.physics.G, { rp: o.rp, e0: o.e0, inc: o.inc });
  return q;
}
export function gainGrid3(HP) {
  const p = find(HP, SRC_ID), unit = Math.pow(10, 3 * p.scaleExp.L) / Math.pow(10, p.scaleExp.M);
  const lo = Number((SI_RANGE[0] / unit).toPrecision(12)), hi = Number((SI_RANGE[1] / unit).toPrecision(12));
  return [0].concat(L.logGrid(lo, hi, GRID_N).map((x, i) => (i === 0 || i === GRID_N - 1) ? x : Number(x.toPrecision(6))));
}

/* ── 走行(アプリの步 —— 三次元の本は dfmStep3)と事象列 ── */
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
/** 軌道面の中の経度 ϖ = Ω + u(面の法線 h —— 向きは公転の向き)。h が z にほぼ平行なら xy の方位(Ω+u と連続)。 */
export function inPlaneLongitude(v, h) {
  const hn = Math.hypot(h[0], h[1], h[2]), nx = -h[1], ny = h[0], nn = Math.hypot(nx, ny);
  if (!(hn > 0)) return Math.atan2(v[1], v[0]);
  if (nn < 1e-12 * hn) return Math.atan2(v[1], v[0]);
  const Om = Math.atan2(ny, nx), nu = [nx / nn, ny / nn, 0], hu = [h[0] / hn, h[1] / hn, h[2] / hn];
  return Om + Math.atan2(dot(cross(nu, v), hu), dot(nu, v));
}
export function runEmx3(HP, preset, o) {
  const v = HP.validatePreset(clone(preset));
  if (!v.ok) throw new Error('validatePreset: ' + JSON.stringify(v.errors).slice(0, 300));
  const S = HP.coord3d.makeSim(); S.build(clone(v.preset));
  const c3 = S.coord3d === true, dt = o.dt, revMax = o.revMax, ci = 1, oi = 2, EV = 64, mu = S.params.G * (S.m[ci] + S.m[oi]);
  const rel = () => [S.x[oi] - S.x[ci], S.y[oi] - S.y[ci], c3 ? S.z[oi] - S.z[ci] : 0];
  let p0 = rel();
  let angPrev = Math.atan2(p0[1], p0[0]), angAcc = 0, r1 = Math.hypot(...p0), r2 = r1, P1 = p0, P2 = p0, PP = p0, nan = false, k = 0;
  let hPrev = null;
  const ev = { rev: [], peri: [], apo: [], ecc: [] };
  const lonOf = (q, h) => inPlaneLongitude(q, h);
  for (; ; k++) {
    S.step(dt);
    const d = rel(), rr = Math.hypot(...d), th = Math.atan2(d[1], d[0]);
    if (!Number.isFinite(rr)) { nan = true; break; }
    let dd = th - angPrev; while (dd > Math.PI) dd -= 2 * Math.PI; while (dd < -Math.PI) dd += 2 * Math.PI;
    const prevAcc = angAcc; angAcc += dd; angPrev = th;
    const nP = Math.floor(Math.abs(prevAcc) / (2 * Math.PI)), nN = Math.floor(Math.abs(angAcc) / (2 * Math.PI));
    if (nN > nP) { const tg = Math.sign(angAcc) * nN * 2 * Math.PI; const fr = (tg - prevAcc) / (angAcc - prevAcc); ev.rev.push((k + fr) * dt); }
    const h = cross(P1, d);   // 位置だけの面の法線(1 步前の点と今の点)
    if (k >= 2 && ((r1 < r2 && r1 < rr) || (r1 > r2 && r1 > rr))) {
      const den = (r2 - 2 * r1 + rr), fr = (den !== 0) ? 0.5 * (r2 - rr) / den : 0;
      const hh = hPrev || h;
      let a1 = lonOf(P2, hh), a2 = lonOf(P1, hh), a3 = lonOf(d, hh);
      while (a2 - a1 > Math.PI) a2 -= 2 * Math.PI; while (a2 - a1 < -Math.PI) a2 += 2 * Math.PI;
      while (a3 - a2 > Math.PI) a3 -= 2 * Math.PI; while (a3 - a2 < -Math.PI) a3 += 2 * Math.PI;
      const ang = a2 + 0.5 * fr * (a3 - a1) + 0.5 * fr * fr * (a3 - 2 * a2 + a1), rv = (den !== 0) ? r1 - (r2 - rr) * (r2 - rr) / (8 * den) : r1;
      (r1 < r2 ? ev.peri : ev.apo).push({ t: (k + fr) * dt, ang, r: rv });
    }
    if (k >= 1 && (k % EV) === 0) {   // 接触離心ベクトル(位置の中心差分の座標速度 —— 1 步前の点で)の軌道面の中の経度
      const w = [(d[0] - PP[0]) / (2 * dt), (d[1] - PP[1]) / (2 * dt), (d[2] - PP[2]) / (2 * dt)], r = Math.hypot(...P1), hv = cross(P1, w);
      const vxh = cross(w, hv), e = [vxh[0] / mu - P1[0] / r, vxh[1] / mu - P1[1] / r, vxh[2] / mu - P1[2] / r];
      ev.ecc.push([k * dt, lonOf(e, hv), Math.hypot(...e), 1 / (2 / r - dot(w, w) / mu), Math.acos(Math.max(-1, Math.min(1, hv[2] / Math.hypot(...hv)))) * 180 / Math.PI]);
    }
    PP = P1; P2 = P1; P1 = d; r2 = r1; r1 = rr; hPrev = h;
    if (ev.rev.length >= revMax) { k++; break; }
  }
  const st = HP.inertialDragState(S);
  return { ev, steps: k, nan: nan || S.hasNaN(), coord3d: c3, warnings: v.warnings || [],
    drag: st ? { boundMax: st.boundMax, boundOver: st.boundOver, reject: st.reject, noHistory: st.noHistory, uMax: st.uMax } : null };
}
// 窓ごとの 3 方式(lib の emMethods —— 事象列は三次元の ϖ)と傾斜の平均
function windowsOf(R, wins) {
  const U = { year: YEAR, day: DAY };
  return wins.map((N) => {
    const w = L.emMethods(R.ev, N, U);
    if (w.complete) { const tB = R.ev.rev[N - 1], E = R.ev.ecc.filter((z) => z[0] <= tB && z[4] !== undefined); w.incMean = E.length ? E.reduce((s, z) => s + z[4], 0) / E.length : null; }
    return w;
  });
}

/* ── 器の中だけの 3 次元の参照積分器(第297便b の tests/exp-w297b-fit.mjs ref3dRun の写し —— 同じ式・同じ順序。アプリの物理ではない)── */
export function ref3dRun(o) {
  const G = 6.674, Ms = 1988.5, Me = 0.0059724, Mm = 0.00007346, eps = 0.01;
  const { rp, e0, incDeg = 0, revMax = 354, dt = 0.016, R = 1495.98 } = o;
  const mu = G * (Me + Mm), fM = Mm / (Me + Mm), Vb = Math.sqrt(G * Ms / R), vp = Math.sqrt(mu * (1 + e0) / rp);
  const ci = Math.cos(incDeg * Math.PI / 180), si = Math.sin(incDeg * Math.PI / 180);
  const rel = [rp, 0, 0], vrel = [0, vp * ci, vp * si];
  const x = [[R - fM * rel[0], 0, 0], [R + (1 - fM) * rel[0], 0, 0]];
  const v = [[-fM * vrel[0], Vb - fM * vrel[1], -fM * vrel[2]], [(1 - fM) * vrel[0], Vb + (1 - fM) * vrel[1], (1 - fM) * vrel[2]]];
  const m = [Me, Mm], e2 = eps * eps;
  const acc = () => { const a = [[0, 0, 0], [0, 0, 0]];
    for (let i = 0; i < 2; i++) { const r2 = x[i][0] ** 2 + x[i][1] ** 2 + x[i][2] ** 2 + e2, f = -G * Ms / (r2 * Math.sqrt(r2)); for (let k = 0; k < 3; k++) a[i][k] += f * x[i][k]; }
    const d = [x[1][0] - x[0][0], x[1][1] - x[0][1], x[1][2] - x[0][2]], r2 = d[0] ** 2 + d[1] ** 2 + d[2] ** 2 + e2, f = G / (r2 * Math.sqrt(r2));
    for (let k = 0; k < 3; k++) { a[0][k] += f * m[1] * d[k]; a[1][k] -= f * m[0] * d[k]; } return a; };
  let a = acc(), angPrev = 0, angAcc = 0; const rev = [], W = [], E = [];
  for (let k = 1; ; k++) {
    for (let i = 0; i < 2; i++) for (let j = 0; j < 3; j++) { v[i][j] += 0.5 * dt * a[i][j]; x[i][j] += dt * v[i][j]; }
    a = acc();
    for (let i = 0; i < 2; i++) for (let j = 0; j < 3; j++) v[i][j] += 0.5 * dt * a[i][j];
    const t = k * dt, r = [0, 1, 2].map((j) => x[1][j] - x[0][j]), w = [0, 1, 2].map((j) => v[1][j] - v[0][j]);
    const th = Math.atan2(r[1], r[0]); let d = th - angPrev; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
    const pa = angAcc; angAcc += d; angPrev = th;
    if (Math.floor(angAcc / (2 * Math.PI)) > Math.floor(pa / (2 * Math.PI))) rev.push(t);
    if (k % 64 === 0) {
      const rn = Math.hypot(...r), h = [r[1] * w[2] - r[2] * w[1], r[2] * w[0] - r[0] * w[2], r[0] * w[1] - r[1] * w[0]];
      const vxh = [w[1] * h[2] - w[2] * h[1], w[2] * h[0] - w[0] * h[2], w[0] * h[1] - w[1] * h[0]];
      const ev = [0, 1, 2].map((j) => vxh[j] / mu - r[j] / rn), hn = Math.hypot(...h), hu = h.map((z) => z / hn);
      const n = [-h[1], h[0], 0], nn = Math.hypot(n[0], n[1]);
      let varpi;
      if (nn < 1e-12 * hn) varpi = Math.atan2(ev[1], ev[0]);
      else { const Om = Math.atan2(n[1], n[0]), nu = n.map((z) => z / nn), nxe = [nu[1] * ev[2] - nu[2] * ev[1], nu[2] * ev[0] - nu[0] * ev[2], nu[0] * ev[1] - nu[1] * ev[0]];
        varpi = Om + Math.atan2(nxe[0] * hu[0] + nxe[1] * hu[1] + nxe[2] * hu[2], nu[0] * ev[0] + nu[1] * ev[1] + nu[2] * ev[2]); }
      W.push([t, varpi]); E.push(Math.hypot(...ev));
    }
    if (rev.length >= revMax) break;
  }
  const un = L.unwrap(W.map((z) => z[1])), fit = L.linfit(W.map((z) => z[0]), un);
  return { key: o.key, book: 'ref3d', incDeg, T2: 2 * Math.PI / fit.slope / YEAR, sid: (rev[rev.length - 1] - rev[0]) / (rev.length - 1) / DAY, eMean: E.reduce((s, z) => s + z, 0) / E.length, revN: rev.length };
}

/* ── 子プロセスの仕事 ── */
export function childTask(HP, spec) {
  const t0 = Date.now();
  if (spec.kind === 'ref3d') return Object.assign(ref3dRun(spec), { key: spec.key, kind: 'ref3d', wallSec: (Date.now() - t0) / 1000 });
  let q;
  if (spec.kind === 'flat2d') { q = clone(find(HP, SRC_ID)); delete q.fitRecord; delete q.id; }
  else q = variant3(HP, spec);
  const R = runEmx3(HP, q, { dt: spec.dt, revMax: spec.revMax });
  const windows = windowsOf(R, spec.wins || [118]);
  const w118 = windows.find((w) => w.N === 118) || null;
  return { key: spec.key, kind: spec.kind || 'app3d', gain: spec.gain, rp: spec.rp, e0: spec.e0, inc: spec.inc, dt: spec.dt, revN: R.ev.rev.length, steps: R.steps, nan: R.nan, coord3d: R.coord3d,
    warnings: R.warnings, drag: R.drag, windows, y: w118 ? w118.T1 : null, wallSec: (Date.now() - t0) / 1000 };
}
function makePool(NW, self) {
  let active = 0; const q = [];
  const pump = () => { while (active < NW && q.length) { const { sp, res, rej } = q.shift(); active++;
    const ch = spawn(process.execPath, [self, '--child', JSON.stringify(sp)], { cwd: ROOT, env: process.env });
    let out = '', err = '';
    ch.stdout.on('data', (d) => { out += d; }); ch.stderr.on('data', (d) => { err += d; });
    ch.on('close', (code) => { active--; pump(); if (code !== 0) return rej(new Error(sp.key + ': ' + err.slice(0, 600)));
      try { res(JSON.parse(out)); } catch (e) { rej(e); } }); } };
  return (sp) => new Promise((res, rej) => { q.push({ sp, res, rej }); pump(); });
}
const T6 = (x) => Number(x.toPrecision(6));

/* ── 本の宣言の写し(html の三次元の本と同じであるべき形 —— QA docs.moon3d298 が照合する)── */
export function derivedPreset3(HP, J) {
  const f = J.final;
  return variant3(HP, { gain: f.gain, rp: f.rp, e0: f.e0, inc: f.inc });
}
/** fitRecord(w298b-1 —— 複数標的)。挟めた本だけ status は門で決める(挟めなければ unreachable-in-bounds)。 */
export function fitRecordOf3(HP, J) {
  const f = J.final, s = J.search, src = find(HP, SRC_ID);
  const w = f.h.w118, w2 = f.h2.w118;
  const tg = (q, obs, unit, source, window, tol, extractor, model, h2v) => ({ q, obs, unit, source, window, tol: clone(tol), extractor, model, residual: model - obs, rel: (model - obs) / obs,
    numerics: { h2: Math.abs(h2v - model), dtHalf: DT / 2 } });
  const ex = 'tests/exp-w298c-moon3d.mjs runEmx3(' + EXTRACTOR_VERSION + ')';
  const targets = [
    tg('近点回転の周期(軌道面の中の近点経度 ϖ=Ω+u・検出器 B・118 公転窓の時刻への直線 fit)', MOON.target.obs, 'yr', '月の近地点経度の周期 8.85 年(🌥️ と同じ観測欄 —— JPL SSD の行 SOL-59edf981 の注記が ~8.85 年の量と記す・σ なし)',
      '118 公転の窓 [0,118]・A1(慣性の対は地球と月だけ)', TOLS3.aps, ex + ' —— 距離の極小の 3 点放物線・瞬間の軌道面(位置の外積)で ϖ', w.T1, w2.T1),
    tg('恒星月(黄道経度の周回の平均間隔・118 公転窓)', MOON.sid.days, 'd', MOON.sid.note + '(' + MOON.sid.record + ')—— 初期配置の入力', '118 公転の窓', TOLS3.sid, ex + ' —— 黄道経度(xy の方位)の通過', w.sid, w2.sid),
    tg('平均離心率(接触離心率の時間平均・118 公転窓)', MOON.eMean.value, '無次元', MOON.eMean.note + '(' + MOON.eMean.record + ')—— 初期配置の入力', '118 公転の窓', TOLS3.ecc, ex + ' —— 位置の中心差分の座標速度から作る接触離心率・64 步ごと', w.eOsc, w2.eOsc)];
  const gateOk = targets.every((t) => Math.abs(t.residual) + t.numerics.h2 <= t.tol.value);
  const status = !s.bracketed ? 'unreachable-in-bounds' : (gateOk ? 'fitted' : 'not-identifiable');
  const rec = { version: 'w298b-1', parent: SRC_ID, law: 'inertial-drag(三次元 —— physics.coord:"3d"・並進だけ・回転引きずりと軸引きずりは宣言しない)・λ_PN=0', targets,
    knobs: [{ key: 'physics.relativeDrag.gain', range: [s.grid.gains[0], s.grid.gains[s.grid.gains.length - 1]], final: f.gain },
      { key: 'initial.moonPerigeeDistance', range: [3.4, 3.8], final: f.rp }, { key: 'initial.moonOscEccentricity0', range: [0.02, 0.12], final: f.e0 },
      { key: 'initial.moonOscInclination0', range: [4.5, 6], final: f.inc }],
    fixed: ['太陽・地球–月の重心(位置・速度)・質量・半径・自転・地球の構造核は 🌥️(二次元)の写し・太陽 pinned・地球の公転は円(面は xy = 黄道)',
      '月の軌道傾斜は平均 ' + MOON.inc.deg + '°(' + MOON.inc.record + ')を 118 公転の走行の平均で満たす t=0 の接触傾斜 ' + f.inc + '°・昇交点を t=0 の地球→月の方向(近地点・太陽の反対方向)に置いた(元期の宣言なし)',
      'geoPN=3・kFrame=0・λ_PN=0・積分器 semi・重力の軟化 0.01・核の ε 0.01・pairs [[1,2]](🌥️ のまま)・地球の自転軸は有効化しない(回転引きずり・軸引きずりの宣言なし)'],
    procedure: '段 2 の 3 元 Newton(近地点距離・t=0 の接触離心率・接触傾斜 → 平均離心率・恒星月・平均傾斜 —— gain 0・118 公転・h)→ 段 4 の gain の対数格子(SI 10⁻⁶〜0.0514182 m³/kg・13 点+0)を h と h/2 → 挟めたら Illinois → 根の gain で初期配置を解き直す(外側 ' + (J.outer ? J.outer.length : 0) + ' 回)→ 6 桁に丸めて h / h/2 / h/4 と 354 公転窓で測り直した(器 tests/exp-w298c-moon3d.mjs)',
    dt: DT, steps: f.h.steps, status,
    notFitted: status === 'fitted' ? ['機構(実際の主因は太陽摂動 —— 機構の同定ではない)', '恒星月と平均離心率は初期配置の入力として平均に合わせた(法則の予言として数えない)']
      : ['この探索範囲では未達 —— 次の見直し(118 公転窓と 354 公転窓の差・刻みの差を記録)', '恒星月と平均離心率は初期配置の入力として平均に合わせた(法則の予言として数えない)'],
    cond: { version: HP.FIT_COND_VERSION, sig: '', extractor: ex } };
  return rec;
}

export async function main() {
  const OUT_PATH = process.env.W298C_MOON_OUT || path.join(ROOT, 'tests', 'out', 'moon3d-w298c.json');
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const t0 = Date.now();
  const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
  const NW = Math.max(1, Number(process.env.W298C_WORKERS) || 3);
  const run = makePool(NW, fileURLToPath(import.meta.url));
  const runs = {};
  const log = (r) => { runs[r.key] = r; const w = r.windows ? r.windows.find((z) => z.N === 118) : null;
    console.log(`  ${r.key}: ${r.kind === 'ref3d' ? `参照 傾斜 ${r.incDeg}° T ${L.fx(r.T2, 4)} 年` : `gain ${r.gain}・dt ${r.dt}・${r.revN} 公転・T118 ${w ? L.fx(w.T1, 5) + '/' + L.fx(w.T2, 5) : '—'} 年・e ${w ? L.fx(w.eOsc, 6) : '—'}・恒星月 ${w ? L.fx(w.sid, 6) : '—'}`}(${(r.wallSec || 0).toFixed(0)} s)`); return r; };
  const R = (sp) => run(Object.assign({ dt: DT, revMax: 118, wins: [118], inc: MOON.inc.deg, gain: 0 }, sp)).then(log);
  const src = find(HP, SRC_ID), fr2 = src.fitRecord, fix2 = { rp: fr2.knobs.find((k) => k.key === 'initial.moonPerigeeDistance').final, e0: fr2.knobs.find((k) => k.key === 'initial.moonOscEccentricity0').final };
  // 段 0・1: 参照と平面の一致
  const [ref0, refI, flat2, flat3] = await Promise.all([
    run({ key: 'ref3d-0', kind: 'ref3d', rp: fix2.rp, e0: fix2.e0, incDeg: 0, revMax: 354, dt: DT }).then(log),
    run({ key: 'ref3d-inc', kind: 'ref3d', rp: fix2.rp, e0: fix2.e0, incDeg: MOON.inc.deg, revMax: 354, dt: DT }).then(log),
    R({ key: 'flat-2d', kind: 'flat2d', wins: [118, 354], revMax: 354 }),
    R({ key: 'flat-3d', rp: fix2.rp, e0: fix2.e0, inc: 0, wins: [118, 354], revMax: 354 })]);
  const W = (r, N = 118) => r.windows.find((w) => w.N === N);
  const flat = { w2d: W(flat2), w3d: W(flat3), w2d354: W(flat2, 354), w3d354: W(flat3, 354), sameT1: W(flat2).T1 === W(flat3).T1, sameAll: JSON.stringify(flat2.windows) === JSON.stringify(flat3.windows) };
  const ref = { note: '器の中だけの 3 次元ニュートンの参照積分器(第297便b の ref3dRun —— 太陽固定・地球と月・アプリの物理ではない)・第297便b の直した初期配置(平面の平均要素)のまま傾けた',
    flat: ref0, incl: refI, rp: fix2.rp, e0: fix2.e0 };
  console.log(`段0 参照 平面 ${L.fx(ref0.T2, 4)}・傾斜 ${L.fx(refI.T2, 4)} 年 / 段1 平面 2D ${L.fx(flat.w2d.T1, 5)} ⇔ 3D ${L.fx(flat.w3d.T1, 5)}(同値 ${flat.sameT1}・全窓 ${flat.sameAll})`);
  // 段 2: 初期配置の見直し(三次元・gain の関数)
  const sidT = MOON.sid.days, eT = MOON.eMean.value;
  // 3 元の Newton: (rp, e0, inc0) → (平均離心率, 恒星月, 平均傾斜)。傾斜の平均も平均要素 5.145° に合わせる(t=0 の接触傾斜は解いた値)
  const incT = MOON.inc.deg;
  const solve3 = (Jm, F) => {   // 3×3 の Cramer
    const d3 = (m) => m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
    const D = d3(Jm); return [0, 1, 2].map((c) => d3(Jm.map((row, i) => row.map((v, j) => (j === c ? F[i] : v)))) / D);
  };
  const solveIc = async (gain, x0, tag) => {
    let x = x0.slice(); const hist = [];
    for (let it = 0; it < MOON.solveIter; it++) {
      const dr = 0.002, de = 0.002, di = 0.05;
      const [o, a, c, e] = await Promise.all([R({ key: `${tag}-it${it}`, gain, rp: x[0], e0: x[1], inc: x[2] }), R({ key: `${tag}-it${it}-dr`, gain, rp: x[0] + dr, e0: x[1], inc: x[2] }),
        R({ key: `${tag}-it${it}-de`, gain, rp: x[0], e0: x[1] + de, inc: x[2] }), R({ key: `${tag}-it${it}-di`, gain, rp: x[0], e0: x[1], inc: x[2] + di })]);
      const wo = W(o), wa = W(a), wc = W(c), we = W(e);
      const F = [wo.eOsc - eT, wo.sid - sidT, wo.incMean - incT];
      hist.push({ it, rp: x[0], e0: x[1], inc0: x[2], eOsc: wo.eOsc, sid: wo.sid, incMean: wo.incMean, T1: wo.T1, T2: wo.T2 });
      if (Math.abs(F[0]) < MOON.solveTol && Math.abs(F[1]) < MOON.solveTol && Math.abs(F[2]) < 1e-4) return { gain, rp: x[0], e0: x[1], inc0: x[2], w118: wo, hist, converged: true };
      const col = (w, h) => [(w.eOsc - wo.eOsc) / h, (w.sid - wo.sid) / h, (w.incMean - wo.incMean) / h];
      const cA = col(wa, dr), cC = col(wc, de), cE = col(we, di);
      const Jm = [[cA[0], cC[0], cE[0]], [cA[1], cC[1], cE[1]], [cA[2], cC[2], cE[2]]];
      const dx = solve3(Jm, F);
      x = [Number((x[0] - dx[0]).toPrecision(8)), Number((x[1] - dx[1]).toPrecision(6)), Number((x[2] - dx[2]).toPrecision(6))];
    }
    const wl = W(await R({ key: `${tag}-last`, gain, rp: x[0], e0: x[1], inc: x[2] }));
    return { gain, rp: x[0], e0: x[1], inc0: x[2], w118: wl, hist, converged: false };
  };
  const ic0 = await solveIc(0, [fix2.rp, fix2.e0, incT], 'ic-g0');
  console.log(`段2 gain 0: rp ${ic0.rp}・e0 ${ic0.e0}・inc0 ${ic0.inc0}・収束 ${ic0.converged}・T118 ${L.fx(ic0.w118.T1, 5)} 年`);
  // 段 3: 直した初期配置の抽出器 × 窓 × 刻み
  const icA = { rp: ic0.rp, e0: ic0.e0, inc: ic0.inc0 };
  const [x_h, x_h2, x_h4, x_long, x_flat] = await Promise.all([R(Object.assign({ key: 'fix-h', wins: [118] }, icA)), R(Object.assign({ key: 'fix-h2', dt: DT / 2 }, icA)), R(Object.assign({ key: 'fix-h4', dt: DT / 4 }, icA)),
    R(Object.assign({ key: 'fix-long', wins: [118, 354], revMax: 354 }, icA)), R(Object.assign({}, icA, { key: 'fix-inc0', inc: 0, wins: [118, 354], revMax: 354 }))]);
  const fix0 = { rp: ic0.rp, e0: ic0.e0, inc: ic0.inc0, w118: W(x_h), h2: W(x_h2), h4: W(x_h4), w354: W(x_long, 354), w118long: W(x_long), inc0: { w118: W(x_flat), w354: W(x_flat, 354) }, steps: x_h.steps };
  // 段 4: gain の探索(直した初期配置・h と h/2)
  const grid = gainGrid3(HP);
  const gRuns = await Promise.all(grid.flatMap((g, i) => [R(Object.assign({ key: `grid${i}-h`, gain: g }, icA)), R(Object.assign({ key: `grid${i}-h2`, gain: g, dt: DT / 2 }, icA))]));
  const rows = grid.map((g, i) => ({ g, y: gRuns[2 * i].y })), rowsH2 = grid.map((g, i) => ({ g, y: gRuns[2 * i + 1].y }));
  const tObs = MOON.target.obs, br = L.bracketOf(rows, tObs), brH2 = L.bracketOf(rowsH2, tObs), nr = L.nearestOf(rows, tObs);
  const search = { grid: { gains: grid, unit: '[L³/M]', rangeSI: SI_RANGE }, rows, rowsH2, bracketed: !!br, bracketedH2: !!brH2, nearest: nr,
    bracket: br ? { lo: br.lo.g, hi: br.hi.g, yLo: br.lo.y, yHi: br.hi.y } : null, monotone: rows.every((z, i) => i === 0 || z.y <= rows[i - 1].y) };
  console.log(`段4 格子: ${rows.map((z) => L.ex(z.g, 3) + '→' + L.fx(z.y, 4)).join(' ')}・挟めた ${search.bracketed}`);
  let final = null; const outer = [];
  if (br) {
    let ic = { rp: ic0.rp, e0: ic0.e0, inc: ic0.inc0 }, lo = br.lo, hi = br.hi;
    for (let o = 0; o < 2; o++) {
      let st = { a: lo.g, fa: lo.y - tObs, b: hi.g, fb: hi.y - tObs, side: 0 };
      const iters = [];
      for (let it = 0; it < 30; it++) {
        const xg = L.illinoisNext(st);
        const r = await R(Object.assign({ key: `o${o}-it${it}`, gain: xg }, ic));
        const fv = r.y - tObs; iters.push({ g: xg, y: r.y, f: fv });
        if (Math.abs(fv) <= 2e-5) break;
        st = L.illinoisUpdate(st, xg, fv);
      }
      const g6 = T6(iters[iters.length - 1].g);
      const icN = await solveIc(g6, [ic.rp, ic.e0, ic.inc], `ic-o${o}`);
      outer.push({ o, iters, gain: g6, ic: { rp: icN.rp, e0: icN.e0, inc0: icN.inc0, converged: icN.converged, w118: icN.w118 } });
      console.log(`段4 外側 ${o}: gain ${g6}・初期配置 rp ${icN.rp}・e0 ${icN.e0}・inc0 ${icN.inc0}・T118 ${L.fx(icN.w118.T1, 5)} 年`);
      ic = { rp: icN.rp, e0: icN.e0, inc: icN.inc0 };
      // 解き直した初期配置で根の両側を取り直す(gain を ±10% —— 片側なら広げる)
      const span = async (g) => (await R(Object.assign({ key: `o${o}-br-${g}`, gain: g }, ic))).y;
      const yc = icN.w118.T1; let gA = g6 * 0.9, gB = g6 * 1.1, yA = await span(gA), yB = await span(gB);
      for (let k = 0; k < 4 && (yA - tObs) * (yB - tObs) > 0; k++) { gA = gA * 0.5; gB = gB * 2; yA = await span(gA); yB = await span(gB); }
      if ((yc - tObs) * (yA - tObs) <= 0) { lo = { g: gA, y: yA }; hi = { g: g6, y: yc }; }
      else { lo = { g: g6, y: yc }; hi = { g: gB, y: yB }; }
      if ((lo.y - tObs) * (hi.y - tObs) > 0) break;
    }
    const last = outer[outer.length - 1];
    const fin = { gain: last.gain, rp: last.ic.rp, e0: last.ic.e0, inc: last.ic.inc0 };
    const [fh, fh2, fh4, fl] = await Promise.all([R(Object.assign({ key: 'final-h' }, fin)), R(Object.assign({ key: 'final-h2', dt: DT / 2 }, fin)), R(Object.assign({ key: 'final-h4', dt: DT / 4 }, fin)),
      R(Object.assign({ key: 'final-long', wins: [118, 354], revMax: 354 }, fin))]);
    final = Object.assign({}, fin, { h: { w118: W(fh), steps: fh.steps }, h2: { w118: W(fh2) }, h4: { w118: W(fh4) }, long: { w118: W(fl), w354: W(fl, 354) } });
  } else {
    final = { gain: nr.g, rp: ic0.rp, e0: ic0.e0, inc: ic0.inc0, h: { w118: fix0.w118, steps: fix0.steps }, h2: { w118: fix0.h2 }, h4: { w118: fix0.h4 }, long: { w118: fix0.w118long, w354: fix0.w354 } };
  }
  const J = { meta: null, ref, flat, ic0: { rp: ic0.rp, e0: ic0.e0, inc0: ic0.inc0, converged: ic0.converged, iters: ic0.hist }, fix0, search, outer, final, moon: MOON, tols: TOLS3 };
  final.windowDiff = { T1: final.long.w354.T1 - final.long.w118.T1, T2: final.long.w354.T2 - final.long.w118.T2 };
  const rec = fitRecordOf3(HP, J);
  const dp = derivedPreset3(HP, J); dp.fitRecord = rec;
  const v = HP.validatePreset(clone(dp));
  rec.cond.sig = v.ok ? HP.fitCondSig(v.preset, rec) : '';
  const vr = HP.validateFitRecord(clone(rec));
  J.fitRecord = rec; J.recordAccepted = !!vr.ok; J.recordErr = vr.ok ? null : vr.err; J.status = rec.status;
  J.derived = { bodies: dp.bodies, gain: dp.physics.relativeDrag.gain };
  const all = Object.values(runs);
  J.gates = { runsOk: all.every((r) => r.kind === 'ref3d' || (!r.nan && (!r.drag || (r.drag.boundOver === 0 && r.drag.reject === 0)))),
    complete: all.every((r) => r.kind === 'ref3d' || r.revN >= 118), coord3d: all.every((r) => r.kind === 'ref3d' || r.kind === 'flat2d' || r.coord3d === true),
    flatSame: flat.sameT1, icSolved: ic0.converged && outer.every((z) => z.ic.converged), record: J.recordAccepted };
  J.ok = Object.values(J.gates).every(Boolean);
  J.timing = Object.fromEntries(Object.entries(runs).map(([k, r]) => [k, { wallSec: Number(r.wallSec) || 0 }]));
  J.notClaim = ['「現実を再現した」', '「月を再現した」', '「8.85 年を出した」', '「gain は普遍定数」', '「参照積分で fitted」'];   // 書かない語(引用 —— 本文には書かない)
  const CODE = ['tests/exp-w298c-moon3d.mjs', 'tests/lib-w297b-fit.mjs', 'tests/lib-w296b-fit.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  J.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第298便c', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, extractorVersion: EXTRACTOR_VERSION, loadErrors: errors.length,
    ruling: '原仮定者の裁定(第88報)「三次元座標化する」「geoPN=4 は慣性決定力の多粒子版・三次元が既定」', reading: '統括の検証項目 R167(🌥️ の三次元 —— 月の傾斜 5.145° の再現作業)' });
  J.elapsedS = (Date.now() - t0) / 1000;
  Object.assign(J.meta, W281A_SCOPE, w281aStableInputs(ROOT, J.meta.inputs));
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(J, null, 1) + '\n');
  console.log(`最終: gain ${final.gain}・rp ${final.rp}・e0 ${final.e0}・T118 ${L.fx(final.h.w118.T1, 5)}(h2 ${L.fx(final.h2.w118.T1, 5)}・h4 ${L.fx(final.h4.w118.T1, 5)})・T354 ${L.fx(final.long.w354.T1, 5)}・status ${rec.status}・記録 ${J.recordAccepted}${J.recordErr ? ' ' + J.recordErr : ''}`);
  console.log(`門: ${JSON.stringify(J.gates)} → ${path.relative(ROOT, OUT_PATH)}(${J.elapsedS.toFixed(0)} s)`);
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN && process.argv.includes('--child')) {
  const spec = JSON.parse(process.argv[process.argv.indexOf('--child') + 1]);
  if (spec.kind === 'ref3d') process.stdout.write(JSON.stringify(childTask(null, spec)));
  else {
    const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
    const { HP } = loadHtmlMain(path.join(ROOT, TARGET));
    process.stdout.write(JSON.stringify(childTask(HP, spec)));
  }
} else if (IS_MAIN) await main();
