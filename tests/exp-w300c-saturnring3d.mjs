// 第300便c(原仮定者の裁定(第90報)⑥「土星の輪の geoPN=3 版の三次元サンプルを作成する」・統括の検証項目 R177)——
// **🍩 saturnRingInertial3d(土星の輪の geoPN=3 三次元)の測定の器**(Node だけ —— 対象 html の inline script を tests/lib-w280b-emgrid.mjs の
// loadHtmlMain で読み、アプリの三次元の步〔dfmStep3・dfmInertialDragStep3〕を走らせる。走行は子プロセスで並列)。
// 宣言(physics・bodies・timeRef・camera)は tests/lib-w300c-saturnring3d.mjs の ringDecl3 が作る(html の内蔵はその写し —— QA preset.saturnRing3d300 が照合)。
//
// ■ 段(正本 tests/out/saturnring3d-w300c.json —— 段 saturnring3d-300c)
//   0 初期状態: 💍 の面(+z が法線)を 🟡 の土星の極の赤道面へ回した配置(群の incl・node と衛星の位置・速度を同じ回転)。初期の面外 |r·û|/r の最大。
//   1 走行(タイタン 2 公転 —— 画面の刻み h = stepDt と h/2): 環の面の保持(各粒子の軌道角運動量 r×v と極 û の角・面外 |r·û|/r の最大)・
//     粒子の損失(非有限・非束縛・最終の半径が自分の帯の [0.9 rIn, 1.1 rOut] の外・面外 > 10⁻³ のどれか)・帯の外へ出た粒子の数(厳密な帯)・
//     C環内縁(初期半径が最小の C帯の粒子)・ミマス・タイタンの公転周期(赤道面の中の方位の周回の平均間隔)・C環内縁の離心率の代理 (rmax−rmin)/(rmax+rmin)・
//     環と衛星(土星を除く)の重心の土星からの位置(タイタンの 1 公転ごとの平均 —— 歩かないことの検査)・系の重心・エネルギーと極まわりの角運動量の相対の変化。
//   2 試験粒子の扱いの感度: 帯の質量を 💍 の宣言 10⁻⁵ から下限 10⁻⁶ へ下げた写し(同じ h)との差 / 二次元の 💍(帯は試験粒子・geoPN=1)の同じ量との差。
//   3 回転引きずりの見え方(受動プローブ inertialDragProbeAt —— 質量ゼロ・反作用なしの受け手): gain 0 の本ではプローブは 0(何も描かない)。
//     水星の三次元のフィット値の移送(A/B の側 —— 同じ SI 4.522419×10⁻⁶ m³/kg・合わせていない)で 600 步の後に、赤道面の点と極の軸の上の点と
//     緯度 45° の点で回転の項 rot を読み、赤道面で接線(û×r̂)向き・軸の上で 0 を確かめる。移送の側のタイタン 2 公転(h)の面の保持と損失も記録。
//
// ■ しないこと・言わないこと
//   ・gain は 0 の基準(標的なし —— fitted と呼ばない)。「現実を再現した」と書かない。帯は実際の環の縮約(各帯 40 粒)。
//
// 実行(Node だけ・子プロセス 2 本 —— W300C_WORKERS で変える。結果は並列数に依らない):
//   node tests/exp-w300c-saturnring3d.mjs          → 正本 tests/out/saturnring3d-w300c.json(W300C_OUT で出力先を変える)
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as R3 from './lib-w300c-saturnring3d.mjs';
const REGEN_SCOPE = {"presets":"all","roots":["$","HP.allPresets","HP.coord3d","HP.inertialDragProbeAt","HP.inertialDragState","HP.sim","HP.validatePreset"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w300c-saturnring3d-1';
const clone = (x) => JSON.parse(JSON.stringify(x));
const TARGET = process.env.QA_TARGET || 'beta/index.html';
export const TITAN_ORBITS = 2;
export const SAMPLE_EVERY_H = 10;          // 全粒子の面と半径の標本の間隔(刻み h の步 —— h/2 は 20 步)
export const LOSS_RULE = Object.freeze({ bandSlack: [0.9, 1.1], outOfPlane: 1e-3 });
export const PROBE_STEPS = 600;
export const IDX = Object.freeze({ saturn: 0, mimas: 1, titan: 6, ringFrom: 7 });
export const SRC_GRAIN_MASS = 1e-5;   // 💍 の宣言の粒の質量(試験粒子 —— 三次元の写しでは源になる)

/** 宣言から本(検証前の生の形)を作る —— html の内蔵の本の physics・bodies・timeRef・camera はこの写し。 */
export function presetOf(HP, o = {}) {
  const d = R3.ringDecl3(HP, o);
  return { id: d.id, name: '土星の輪(器の写し)', description: '器の写し', emoji: d.emoji, seed: d.seed, sampleClass: 'principle', scaleExp: clone(d.scaleExp), timeRef: d.timeRef, camera: d.camera,
    world: { boundary: 'none', size: 0 }, physics: d.physics, bodies: d.bodies, overlays: { rotationCurve: false, tempHistogram: false, field: false, trail: true } };
}
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const norm = (a) => Math.hypot(a[0], a[1], a[2]);
const unit = (a) => { const n = norm(a); return [a[0] / n, a[1] / n, a[2] / n]; };

/** 帯の範囲(宣言の ring の順に粒子の番号へ —— build の並び: single の後に群)。 */
export function bandsOf(preset) {
  const out = []; let i = 0;
  preset.bodies.forEach((b) => { if (b.type === 'single') { i++; return; } out.push({ from: i, to: i + b.n, rIn: b.rIn, rOut: b.rOut, label: ['C', 'B', 'A'][out.length] || ('#' + out.length) }); i += b.n; });
  return out;
}

/**
 * 走行(アプリの三次元の步)。spec: {dt, duration, gain, grainMass, coord2d?}。土星は原点に pinned。
 * 二次元(💍 そのもの)の走行は coord2d:true —— 面は z=0・極は +z。
 */
export function runRing(HP, spec) {
  const t0 = Date.now();
  let preset, u;
  if (spec.coord2d) { preset = clone(HP.allPresets().find((q) => q.id === R3.SRC_ID)); u = [0, 0, 1]; }
  else { preset = presetOf(HP, { gain: spec.gain || 0, grainMass: spec.grainMass }); u = R3.ringDecl3(HP, {}).poleU; }
  const v = HP.validatePreset(clone(preset));
  if (!v.ok) throw new Error('validatePreset: ' + JSON.stringify(v.errors).slice(0, 300));
  const S = HP.coord3d.makeSim();
  S.build(clone(v.preset));
  const c3 = S.coord3d === true, n = S.n;
  const Z = (i) => c3 ? S.z[i] : 0, VZ = (i) => c3 ? S.vz[i] : 0;
  const pos = (i) => [S.x[i] - S.x[0], S.y[i] - S.y[0], Z(i) - Z(0)], vel = (i) => [S.vx[i] - S.vx[0], S.vy[i] - S.vy[0], VZ(i) - VZ(0)];
  // 赤道面の基底(e1 = û に垂直な初期の C環内縁の方向)
  const bands = bandsOf(v.preset);
  const C = bands[0];
  let cIn = C.from, rMin = Infinity;
  for (let i = C.from; i < C.to; i++) { const r = norm(pos(i)); if (r < rMin) { rMin = r; cIn = i; } }
  const e1 = unit((() => { const p = pos(cIn), d = dot(p, u); return [p[0] - d * u[0], p[1] - d * u[1], p[2] - d * u[2]]; })()), e2 = cross(u, e1);
  const track = { cIn, mimas: IDX.mimas, titan: IDX.titan };
  const tr = Object.fromEntries(Object.entries(track).map(([k, i]) => { const p = pos(i); return [k, { i, prev: Math.atan2(dot(p, e2), dot(p, e1)), acc: 0, rev: [], rmin: Infinity, rmax: 0 }]; }));
  const steps = Math.round(spec.duration / spec.dt), every = Math.max(1, Math.round(SAMPLE_EVERY_H * 0.58 / spec.dt));
  const g0 = IDX.ringFrom, gN = n - g0, gMin = new Float64Array(gN).fill(Infinity), gMax = new Float64Array(gN);
  const mAll = Array.from(S.m), mSat = mAll[0];
  let planeMaxDeg = 0, outMax = 0, nan = false, outMax0 = 0;
  for (let i = 1; i < n; i++) { const p = pos(i); outMax0 = Math.max(outMax0, Math.abs(dot(p, u)) / norm(p)); }
  const tot0 = c3 ? HP.coord3d.totals(S) : null, E0 = tot0 ? tot0.E : null, L0 = tot0 ? dot(tot0.L, u) : null;
  const PT = 13776.48;   // タイタンの公転の窓(💍 の観測の正本 1377648 s ÷ 10² s —— 重心の平均の窓)
  const comWin = []; let comAcc = [0, 0, 0], comN = 0, comMax = 0, sysMax = 0, win = 0;
  const mRest = mAll.slice(1).reduce((a, b) => a + b, 0), mTot = mRest + mSat;
  for (let k = 1; k <= steps; k++) {
    S.step(spec.dt);
    for (let i = g0; i < n; i++) { const r = Math.hypot(S.x[i] - S.x[0], S.y[i] - S.y[0], Z(i) - Z(0)); if (r < gMin[i - g0]) gMin[i - g0] = r; if (r > gMax[i - g0]) gMax[i - g0] = r; }
    for (const z of Object.values(tr)) {
      const p = pos(z.i), th = Math.atan2(dot(p, e2), dot(p, e1));
      let dd = th - z.prev; while (dd > Math.PI) dd -= 2 * Math.PI; while (dd < -Math.PI) dd += 2 * Math.PI;
      const a0 = z.acc; z.acc += dd; z.prev = th;
      const nP = Math.floor(Math.abs(a0) / (2 * Math.PI)), nN = Math.floor(Math.abs(z.acc) / (2 * Math.PI));
      if (nN > nP) { const tg = Math.sign(z.acc) * nN * 2 * Math.PI, fr = (tg - a0) / (z.acc - a0); z.rev.push((k - 1 + fr) * spec.dt); }
      const r = norm(p); if (r < z.rmin) z.rmin = r; if (r > z.rmax) z.rmax = r;
    }
    if (k % every === 0 || k === steps) {
      let cx = 0, cy = 0, cz = 0;
      for (let i = 1; i < n; i++) {
        const p = pos(i), w = vel(i), r = norm(p);
        if (!Number.isFinite(r)) { nan = true; continue; }
        const h = cross(p, w), ang = Math.acos(Math.max(-1, Math.min(1, dot(unit(h), u)))) * 180 / Math.PI;
        if (ang > planeMaxDeg) planeMaxDeg = ang;
        const o = Math.abs(dot(p, u)) / r; if (o > outMax) outMax = o;
        cx += mAll[i] * p[0]; cy += mAll[i] * p[1]; cz += mAll[i] * p[2];
      }
      const com = [cx / mRest, cy / mRest, cz / mRest], cm = norm(com);
      if (cm > comMax) comMax = cm;
      const sys = norm([cx / mTot, cy / mTot, cz / mTot]); if (sys > sysMax) sysMax = sys;
      comAcc = [comAcc[0] + com[0], comAcc[1] + com[1], comAcc[2] + com[2]]; comN++;
      const t = k * spec.dt;
      if (t >= (win + 1) * PT - 1e-9 || k === steps) { if (t >= (win + 1) * PT - 1e-9) { comWin.push({ t, mean: comAcc.map((x) => x / comN), n: comN }); win++; } comAcc = [0, 0, 0]; comN = 0; }
    }
  }
  if (S.hasNaN()) nan = true;
  // 損失と帯の外
  let lost = 0, outside = 0; const lostIdx = [];
  const G = S.params.G;
  for (const B of bands) for (let i = B.from; i < B.to; i++) {
    const p = pos(i), w = vel(i), r = norm(p), E = 0.5 * dot(w, w) - G * mSat / r, o = Math.abs(dot(p, u)) / r;
    const isLost = !Number.isFinite(r) || !(E < 0) || r < LOSS_RULE.bandSlack[0] * B.rIn || r > LOSS_RULE.bandSlack[1] * B.rOut || o > LOSS_RULE.outOfPlane;
    if (isLost) { lost++; lostIdx.push(i); }
    if (r < B.rIn || r > B.rOut) outside++;
  }
  const tot1 = c3 ? HP.coord3d.totals(S) : null;
  const per = (z) => z.rev.length >= 2 ? (z.rev[z.rev.length - 1] - z.rev[0]) / (z.rev.length - 1) : (z.rev.length === 1 ? z.rev[0] : null);
  const T = Math.pow(10, preset.scaleExp.T);
  const st = HP.inertialDragState(S);
  const comDrift = comWin.length >= 2 ? norm([0, 1, 2].map((q) => comWin[comWin.length - 1].mean[q] - comWin[0].mean[q])) : null;
  return {
    key: spec.key, coord: c3 ? '3d' : '2d', dt: spec.dt, steps, duration: steps * spec.dt, gain: spec.gain || 0, grainMass: spec.grainMass === undefined ? null : spec.grainMass,
    n, nRing: bands.reduce((a, B) => a + (B.to - B.from), 0), warnings: v.warnings || [], nan,
    plane: { outOfPlane0: outMax0, planeMaxDeg, outOfPlaneMax: outMax },
    loss: { rule: LOSS_RULE, lost, lostIdx, outsideBand: outside },
    grains: { from: g0, eccProxy: Array.from(gMin, (a, k) => Number(((gMax[k] - a) / (gMax[k] + a)).toPrecision(6))) },
    periods: Object.fromEntries(Object.entries(tr).map(([k, z]) => [k, { i: z.i, revs: z.rev.length, periodUnits: per(z), periodSec: per(z) === null ? null : per(z) * T,
      eccProxy: (z.rmax - z.rmin) / (z.rmax + z.rmin), rmin: z.rmin, rmax: z.rmax }])),
    com: { titanWindowUnits: PT, windows: comWin.map((w) => ({ t: w.t, mean: w.mean, absMean: norm(w.mean) })), driftAbs: comDrift, ringMoonComMaxAbs: comMax, systemComMaxAbs: sysMax },
    conserved: tot1 ? { dE: (tot1.E - E0) / Math.abs(E0), dLpole: (dot(tot1.L, u) - L0) / Math.abs(L0) } : null,
    drag: st ? { boundMax: st.boundMax, boundOver: st.boundOver, reject: st.reject, noHistory: st.noHistory, uMax: st.uMax,
      rot: st.spin3 ? { sources: st.spin3.rot.sources, max: st.spin3.rot.max } : null } : null,
    wallSec: (Date.now() - t0) / 1000 };
}

/** 回転引きずりの受動プローブ(移送の gain・PROBE_STEPS 步の後)。gain 0 の本も同じ点で読む(u ≡ 0 を確かめる)。 */
export function probeTask(HP, spec) {
  const t0 = Date.now();
  const out = {};
  for (const [lab, gain] of [['gain0', 0], ['transfer', spec.gain]]) {
    const v = HP.validatePreset(clone(presetOf(HP, { gain })));
    const S = HP.coord3d.makeSim(); S.build(clone(v.preset));
    for (let k = 0; k < PROBE_STEPS; k++) S.step(spec.dt);
    const d = R3.ringDecl3(HP, {}), u = d.poleU;
    const e1 = unit(cross(u, [0, 0, 1])), e2 = cross(u, e1);
    const rows = { equator: [], axis: [], lat45: [] };
    for (const r of [80, 100, 130]) for (let a = 0; a < 8; a++) {
      const ph = a * Math.PI / 4, rh = [Math.cos(ph) * e1[0] + Math.sin(ph) * e2[0], Math.cos(ph) * e1[1] + Math.sin(ph) * e2[1], Math.cos(ph) * e1[2] + Math.sin(ph) * e2[2]];
      const q = HP.inertialDragProbeAt(S, r * rh[0], r * rh[1], r * rh[2], {});
      const t = cross(u, rh), rot = q.rot, m = norm(rot);
      rows.equator.push({ r, ph: a * 45, rot: m, cosTangent: m > 0 ? dot(rot, t) / m : null, normalFrac: m > 0 ? Math.abs(dot(rot, u)) / m : null, u: norm(q.u) });
      const s2 = Math.SQRT1_2, pl = [s2 * rh[0] + s2 * u[0], s2 * rh[1] + s2 * u[1], s2 * rh[2] + s2 * u[2]];
      const q2 = HP.inertialDragProbeAt(S, r * pl[0], r * pl[1], r * pl[2], {});
      rows.lat45.push({ r, ph: a * 45, rot: norm(q2.rot) });
    }
    for (const r of [80, 100, 130, -100]) { const q = HP.inertialDragProbeAt(S, r * u[0], r * u[1], r * u[2], {}); rows.axis.push({ r, rot: norm(q.rot), u: norm(q.u) }); }
    const mx = (a, k) => a.reduce((s, z) => Math.max(s, Math.abs(z[k] === null ? 0 : z[k])), 0);
    const mn = (a, k) => a.reduce((s, z) => Math.min(s, z[k] === null ? Infinity : z[k]), Infinity);
    out[lab] = { gain, steps: PROBE_STEPS,
      equatorRotMax: mx(rows.equator, 'rot'), equatorRotMin: mn(rows.equator, 'rot'), equatorCosTangentMin: rows.equator.every((z) => z.cosTangent === null) ? null : mn(rows.equator.map((z) => ({ c: Math.abs(z.cosTangent) })), 'c'),
      equatorNormalFracMax: mx(rows.equator, 'normalFrac'), equatorUMax: mx(rows.equator, 'u'),
      axisRotMax: mx(rows.axis, 'rot'), axisUMax: mx(rows.axis, 'u'), lat45RotMax: mx(rows.lat45, 'rot'),
      ratioLat45ToEquator: (mx(rows.equator, 'rot') > 0) ? mx(rows.lat45, 'rot') / mx(rows.equator, 'rot') : null,
      byRadius: [80, 100, 130].map((r) => ({ r, equatorRot: mx(rows.equator.filter((z) => z.r === r), 'rot'), lat45Rot: mx(rows.lat45.filter((z) => z.r === r), 'rot') })) };
  }
  return { key: spec.key, probe: out, wallSec: (Date.now() - t0) / 1000 };
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

export function childTask(HP, spec) { return spec.kind === 'probe' ? probeTask(HP, spec) : runRing(HP, spec); }

/** 観測カードに転記する数(正本の値の文字列 —— QA が本の観測カードに含まれることを照合)。 */
export function obsNumbers(J) {
  const h = J.runs.h, h2 = J.runs.h2;
  return [h.periods.cIn.periodSec.toFixed(1), h2.periods.cIn.periodSec.toFixed(1), (h.periods.titan.periodSec / 86400).toFixed(4), String(h.loss.lost), h.plane.planeMaxDeg.toExponential(1)];
}

export async function main() {
  const OUT_PATH = process.env.W300C_OUT || path.join(ROOT, 'tests', 'out', 'saturnring3d-w300c.json');
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const t0 = Date.now();
  const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
  const NW = Math.max(1, Number(process.env.W300C_WORKERS) || 2);
  const run = makePool(NW, fileURLToPath(import.meta.url));
  const d = R3.ringDecl3(HP, {});
  const dt = d.physics.stepDt, dur = TITAN_ORBITS * 13776.48 * 1.01;   // 窓の境界(タイタン 2 公転)を越えるだけの 1% の余裕
  const gT = Number((R3.GAIN_SI_MERCURY3D / R3.gainUnit(d.scaleExp)).toPrecision(7));
  const specs = [
    { key: 'h2', dt: dt / 2, duration: dur, gain: 0 },
    { key: 'm5h2', dt: dt / 2, duration: dur, gain: 0, grainMass: SRC_GRAIN_MASS },
    { key: 'h', dt, duration: dur, gain: 0 },
    { key: 'm5', dt, duration: dur, gain: 0, grainMass: SRC_GRAIN_MASS },
    { key: 'transfer', dt, duration: dur, gain: gT },
    { key: 'flat2d', dt, duration: dur, gain: 0, coord2d: true },
    { key: 'flat2dh2', dt: dt / 2, duration: dur, gain: 0, coord2d: true },
    { key: 'probe', kind: 'probe', dt, gain: gT }];
  const res = await Promise.all(specs.map((s) => run(s)));
  const runs = Object.fromEntries(res.map((r) => [r.key, r]));
  const H = runs.h, H2 = runs.h2, M5 = runs.m5, M5h2 = runs.m5h2, F = runs.flat2d, F2 = runs.flat2dh2, TR = runs.transfer, PR = runs.probe.probe;
  const dif = (a, b) => (a === null || b === null) ? null : a - b;
  const med = (a) => { const q = a.slice().sort((x, y) => x - y); return q[Math.floor(q.length / 2)]; };
  /** 帯の粒ごとの離心率の代理の比較(同じ種・同じ並び —— 粒 k 同士)。 */
  const gcmp = (A, B) => { const a = A.grains.eccProxy, b = B.grains.eccProxy, d = a.map((x, k) => Math.abs(x - b[k]));
    return { maxAbsDiff: Math.max(...d), medianAbsDiff: med(d), medianA: med(a), maxA: Math.max(...a), medianB: med(b), maxB: Math.max(...b) }; };
  const per = (R, k) => R.periods[k].periodSec;
  const row = (A, B) => ({ cInPeriodSecDiff: dif(per(A, 'cIn'), per(B, 'cIn')), mimasPeriodSecDiff: dif(per(A, 'mimas'), per(B, 'mimas')), titanPeriodSecDiff: dif(per(A, 'titan'), per(B, 'titan')),
    grainsEcc: gcmp(A, B), lost: [A.loss.lost, B.loss.lost], outsideBand: [A.loss.outsideBand, B.loss.outsideBand] });
  const J = {
    version: HARNESS_VERSION, lib: R3.LIB_VERSION, id: R3.ID, emoji: R3.EMOJI,
    decl: { pole: d.pole, incl: d.incl, node: d.node, poleU: d.poleU, scaleExp: d.scaleExp, seed: d.seed, stepDt: dt, durationUnits: dur, titanOrbits: TITAN_ORBITS,
      grainMass: d.bodies.filter((b) => b.type === 'ring').map((b) => b.mMin), massFloor: d.physics.massFloor, ringTotalKg: R3.RING_TOTAL_KG, nBodies: H.n, nRing: H.nRing, transferGain: gT,
      transferGainNote: '水星の三次元のフィット値 0.004522419(10⁸ m・10²⁷ kg の単位)を同じ SI 4.522419×10⁻⁶ m³/kg で本の単位へ —— A/B の側だけ・本には宣言しない・合わせていない' },
    runs,
    stepDependence: {
      cInPeriodSec: { h: per(H, 'cIn'), h2: per(H2, 'cIn'), diff: dif(per(H, 'cIn'), per(H2, 'cIn')) },
      mimasPeriodSec: { h: per(H, 'mimas'), h2: per(H2, 'mimas'), diff: dif(per(H, 'mimas'), per(H2, 'mimas')) },
      titanPeriodSec: { h: per(H, 'titan'), h2: per(H2, 'titan'), diff: dif(per(H, 'titan'), per(H2, 'titan')) },
      grainsEcc: gcmp(H, H2), flat2dGrainsEcc: gcmp(F, F2), flat2dCInPeriodSecDiff: dif(per(F, 'cIn'), per(F2, 'cIn')), m5GrainsEcc: gcmp(M5, M5h2), m5CInPeriodSecDiff: dif(per(M5, 'cIn'), per(M5h2, 'cIn')),
      planeMaxDeg: { h: H.plane.planeMaxDeg, h2: H2.plane.planeMaxDeg }, lost: { h: H.loss.lost, h2: H2.loss.lost }, outsideBand: { h: H.loss.outsideBand, h2: H2.loss.outsideBand } },
    testParticle: {
      decision: 'finite-mass-real-total',
      note: '三次元の受理の門は testParticle を拒否する(coord3dDenyOf)。本の帯は数値の質量の有限粒子(源になる)として明示し、1 粒の質量は帯 120 粒の合計を 💍 の説明の実環の総質量 1.5×10¹⁹ kg に合わせた 1.25×10⁻⁸(massFloor 10⁻⁹ を宣言)。💍 の宣言の 10⁻⁵ の写し(m5)と二次元の 💍(試験粒子)との差を粒ごとに実測した。試験粒子の三次元の正式な対応(源集合・慣性決定力の受け手・反作用の契約)は決断事項の候補',
      vs2d: Object.assign({ note: '三次元(本の質量)− 二次元の 💍(帯は試験粒子・geoPN=1・λ_PN=1 —— 1PN は実深度で 10⁻⁸ の桁)。粒は同じ種・同じ並び' }, { h: row(H, F), h2: row(H2, F2) }),
      m5vs2d: Object.assign({ note: '💍 の宣言の質量 10⁻⁵ の写し − 二次元の 💍' }, { h: row(M5, F), h2: row(M5h2, F2) }) },
    probe: PR,
    transfer: { gain: gT, planeMaxDeg: TR.plane.planeMaxDeg, lost: TR.loss.lost, outsideBand: TR.loss.outsideBand, cInPeriodSecDiff: dif(TR.periods.cIn.periodSec, H.periods.cIn.periodSec),
      titanPeriodSecDiff: dif(TR.periods.titan.periodSec, H.periods.titan.periodSec), boundMax: TR.drag && TR.drag.boundMax, boundOver: TR.drag && TR.drag.boundOver },
  };
  const ref = { cInPeriodSec: 20880, titanPeriodSec: 1377648 };
  J.obsCompare = { note: '💍 の観測の正本 OBS_COMPARE_ROWS の行(C環内縁 20880 s —— 実半径の導出ケプラー周期の転記・タイタン 1377648 s)との差(h)',
    cInPeriodSecDiff: H.periods.cIn.periodSec - ref.cInPeriodSec, titanPeriodSecDiff: H.periods.titan.periodSec - ref.titanPeriodSec };
  J.gates = {
    finite: Object.values(runs).filter((r) => r.nan !== undefined).every((r) => r.nan !== true), coord3d: [H, H2, M5, M5h2, TR].every((r) => r.coord === '3d'), noWarn: [H, H2, M5, M5h2, TR].every((r) => (r.warnings || []).length === 0),
    rotated: H.plane.outOfPlane0 < 1e-12,
    planeKept: H.plane.planeMaxDeg < 0.05 && H2.plane.planeMaxDeg < 0.05 && H.plane.outOfPlaneMax < 1e-3,
    noLoss: H.loss.lost === 0 && H2.loss.lost === 0,
    comNoWalk: H.com.driftAbs !== null && H.com.windows.length >= 2 && H.com.driftAbs < 0.01 * H.com.ringMoonComMaxAbs,
    stepDep: Math.abs(J.stepDependence.cInPeriodSec.diff) <= 2 * Math.abs(J.stepDependence.flat2dCInPeriodSecDiff) + 1 && Math.abs(J.stepDependence.titanPeriodSec.diff) < 60,
    nearTestParticle: J.testParticle.vs2d.h.grainsEcc.maxAbsDiff < J.testParticle.m5vs2d.h.grainsEcc.maxAbsDiff,
    probeZeroAtGain0: PR.gain0.equatorRotMax === 0 && PR.gain0.equatorUMax === 0 && PR.gain0.axisUMax === 0,
    probeTangential: PR.transfer.equatorRotMin > 0 && PR.transfer.equatorCosTangentMin > 0.999 && PR.transfer.axisRotMax <= 1e-12 * PR.transfer.equatorRotMax,
    transferBound: TR.drag && TR.drag.boundOver === 0 };
  J.ok = Object.values(J.gates).every(Boolean);
  J.timing = Object.fromEntries(Object.entries(runs).map(([k, r]) => [k, { wallSec: Number(r.wallSec) || 0 }]));
  J.notClaim = ['「現実を再現した」', '「gain をフィットした」(gain 0 の基準 —— 標的なし)', '「環の全粒子を置いた」(各帯 40 粒の縮約)'];
  const CODE = ['tests/exp-w300c-saturnring3d.mjs', 'tests/lib-w300c-saturnring3d.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  J.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第300便c', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, loadErrors: errors.length,
    ruling: '原仮定者の裁定(第90報)⑥「土星の輪の geoPN=3 版の三次元サンプルを作成する」', reading: '統括の検証項目 R177(土星の輪の三次元の新本・試験粒子の扱い・面の保持と損失と刻み依存・回転引きずりの見え方)' });
  J.elapsedS = (Date.now() - t0) / 1000;
  Object.assign(J.meta, W281A_SCOPE, w281aStableInputs(ROOT, J.meta.inputs));
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(J, null, 1) + '\n');
  const f = (x, d2) => (x === null || x === undefined) ? '—' : Number(x).toFixed(d2);
  console.log(`h: C環内縁 ${f(H.periods.cIn.periodSec, 2)} s・ミマス ${f(H.periods.mimas.periodSec, 1)} s・タイタン ${f(H.periods.titan.periodSec / 86400, 5)} 日・面 ${H.plane.planeMaxDeg.toExponential(2)}°・損失 ${H.loss.lost}・帯の外 ${H.loss.outsideBand}`);
  console.log(`h/2: C環内縁 ${f(H2.periods.cIn.periodSec, 2)} s・タイタン ${f(H2.periods.titan.periodSec / 86400, 5)} 日・面 ${H2.plane.planeMaxDeg.toExponential(2)}°・損失 ${H2.loss.lost}`);
  console.log(`門: ${JSON.stringify(J.gates)} → ${path.relative(ROOT, OUT_PATH)}(${J.elapsedS.toFixed(0)} s)`);
}
function jsLit(v) {
  if (v === null) return 'null';
  if (Array.isArray(v)) return '[' + v.map(jsLit).join(', ') + ']';
  if (typeof v === 'object') return '{' + Object.keys(v).map((k) => (/^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k)) + ':' + jsLit(v[k])).join(', ') + '}';
  return JSON.stringify(v);
}
/** 内蔵の本の断片(html へ写す —— physics・bodies・timeRef・camera は ringDecl3 の写し・数は正本の転記)。 */
export function emitBook(HP, J) {
  const d = R3.ringDecl3(HP, {}), H = J.runs.h, H2 = J.runs.h2, TP = J.testParticle, PR = J.probe.transfer, TR = J.transfer, SD = J.stepDependence;
  const f = (x, k) => Number(x).toFixed(k), e1 = (x) => Number(x).toExponential(1);
  const [cH, cH2, tD] = [f(H.periods.cIn.periodSec, 1), f(H2.periods.cIn.periodSec, 1), f(H.periods.titan.periodSec / 86400, 4)];
  const pl = e1(H.plane.planeMaxDeg), gT = J.decl.transferGain;
  const card = (rows) => rows.map(([q, model, obs]) => { for (const x of [q, model, obs]) if (x.length > 120) throw new Error('観測カードの欄が 120 字を超える(' + x.length + '): ' + x); return { q, model, obs }; });
  const rowsJ = [
    ['何を置いたか', '💍 の土星・衛星 6・C/B/A 帯(各 40 粒・同じ種)を土星の赤道面へ回した三次元。geoPN=3・λ_PN=0・gain 0・土星 pinned', '—(原理サンプル —— 較正母集団の外)'],
    ['赤道面(入力)', `土星の極 傾き ${f(d.pole.tiltDeg, 2)}°・方位 ${f(d.pole.azimuthDeg, 2)}°(🟡 の宣言)→ 群の incl ${f(d.incl, 2)}°・node ${f(d.node, 2)}°`, 'IAU WGCCRE 2009 の極(軸は一定の近似)'],
    ['C環内縁の公転(実測・h)', `${cH} s(h/2 ${cH2} s)—— 二次元の 💍 との差 ${f(TP.vs2d.h.cInPeriodSecDiff, 3)} s`, '20880 s(💍 の導出ケプラー周期の転記)'],
    ['タイタンの公転(実測・h)', `${tD} 日(h/2 との差 ${f(SD.titanPeriodSec.diff, 3)} s)`, '15.945 日'],
    ['面の保持・損失(タイタン 2 公転)', `軌道面と赤道面の角の最大 ${pl}°・損失 ${H.loss.lost} 粒(h/2 ${H2.loss.lost})・帯の外 ${H.loss.outsideBand} 粒`, '—'],
    ['帯の粒(試験粒子の扱い)', `有限の質量 1.25×10⁻⁸(合計 = 実環 1.5×10¹⁹ kg)—— 二次元の試験粒子との離心率の差 最大 ${e1(TP.vs2d.h.grainsEcc.maxAbsDiff)}`, `💍 の質量 10⁻⁵ の写しでは ${e1(TP.m5vs2d.h.grainsEcc.maxAbsDiff)}`],
    ['回転引きずり(受動プローブ・移送の側)', `赤道面で接線向き(cos ${f(PR.equatorCosTangentMin, 6)})・極の軸の上 ${e1(PR.axisRotMax)}・緯度 45° は ${f(PR.ratioLat45ToEquator, 4)} 倍`, 'gain 0 の本では 0(何も描かない)'],
    ['言わないこと', '帯は実際の環の縮約(試験粒子ではない)・gain は合わせていない・土星の公転と太陽の潮汐は入れない', '—']];
  const rowsE = [
    ['What is placed', "💍's Saturn, 6 moons, C/B/A bands (same seed) rotated into Saturn's equator; geoPN=3, lambda_PN=0, gain 0; Saturn pinned", '- (a principle sample)'],
    ['Equator plane (input)', `Saturn's pole tilt ${f(d.pole.tiltDeg, 2)}, az ${f(d.pole.azimuthDeg, 2)} deg (🟡) -> incl ${f(d.incl, 2)}, node ${f(d.node, 2)} deg`, 'IAU WGCCRE 2009 pole (axis held fixed)'],
    ['C-ring inner-edge period (measured, h)', `${cH} s (h/2 ${cH2} s); vs 2D 💍 ${f(TP.vs2d.h.cInPeriodSecDiff, 3)} s`, '20880 s (💍 derived Kepler period)'],
    ["Titan's period (measured, h)", `${tD} d (vs h/2 ${f(SD.titanPeriodSec.diff, 3)} s)`, '15.945 d'],
    ['Plane and loss (2 Titan orbits)', `max angle orbit/equator ${pl} deg; lost ${H.loss.lost} (h/2 ${H2.loss.lost}); outside band ${H.loss.outsideBand}`, '-'],
    ['Band grains (test particles)', `finite mass 1.25e-8 (sum = real ring 1.5e19 kg); ecc diff vs 2D test particles <= ${e1(TP.vs2d.h.grainsEcc.maxAbsDiff)}`, `with 💍's mass 1e-5: ${e1(TP.m5vs2d.h.grainsEcc.maxAbsDiff)}`],
    ['Rotational drag (passive probe, transfer)', `tangential on the equator (cos ${f(PR.equatorCosTangentMin, 6)}); pole axis ${e1(PR.axisRotMax)}; lat 45: ${f(PR.ratioLat45ToEquator, 4)}x`, 'zero at gain 0 (nothing drawn)'],
    ['Not claimed', 'the bands are a reduction (not test particles); gain not matched; no Saturn orbit or solar tide', '-']];
  const summaryJ = `**慣性決定力版の土星の輪の三次元の基準 —— gain 0**(第300便c・原仮定者の裁定〔第90報〕⑥「土星の輪の geoPN=3 版の三次元サンプルを作成する」・統括の検証項目 R177)。💍 saturnRingReal の土星・主要衛星 6・C/B/A 帯(各 40 粒 —— 乱数の種を 💍 と同じに明示して同じ粒を生成)を、🟡 saturnSunInertial3d の土星の極(IAU WGCCRE 2009 —— 傾き ${f(d.pole.tiltDeg, 2)}°・方位 ${f(d.pole.azimuthDeg, 2)}°)の赤道面へ回した(群は incl ${f(d.incl, 2)}°・node ${f(d.node, 2)}° —— 衛星の位置と速度は同じ回転)。physics.coord:"3d"・geoPN=3・λ_PN=0・kFrame=0・stateCarry:"double"・timeScale=1・刻みは 💍 の時間の基準(C環内縁の 1 公転 ≈360 步)。土星は pinned(**局所の近似** —— 土星の公転・太陽の潮汐は入れない)。慣性引きずりは gain 0 の基準(標的なし)で、自転する源(土星・同期自転のタイタン)の軸を有効化し回転引きずり spinDrag:{rot:"surfaceFlip", axial:"off"} を宣言した。**三次元の受理の門は試験粒子を拒否する**ので、帯の粒は数値の質量の有限粒子(1 粒 1.25×10⁻⁸ = 1.25×10¹⁷ kg —— 120 粒の合計を実環の総質量 1.5×10¹⁹ kg に合わせた・massFloor 10⁻⁹)として明示した。`;
  const summaryE = `THE INERTIAL-DETERMINACY SATURN RINGS IN 3D - THE GAIN-0 BASELINE (wave 300c; the originator's ruling in report 90 item 6: make a 3D geoPN=3 sample of Saturn's rings; coordinator's check R177). 💍 saturnRingReal's Saturn, six major moons and C/B/A bands (40 grains each - the random seed is declared equal to 💍's so the same grains are generated) are rotated into the equator of Saturn's pole as declared in 🟡 saturnSunInertial3d (IAU WGCCRE 2009; tilt ${f(d.pole.tiltDeg, 2)}, azimuth ${f(d.pole.azimuthDeg, 2)} deg): the groups get incl ${f(d.incl, 2)} and node ${f(d.node, 2)} deg and the moons' positions and velocities the same rotation. physics.coord 3d, geoPN=3, lambda_PN=0, kFrame=0, stateCarry double, timeScale=1, the step of 💍's time standard (about 360 steps per C-ring inner-edge orbit). Saturn is pinned (A LOCAL APPROXIMATION - no Saturn orbit or solar tide). The inertial drag is the gain-0 baseline (no target); the spinning sources (Saturn and synchronously rotating Titan) have their axes enabled and the rotational drag spinDrag {rot surfaceFlip, axial off} is declared. THE 3D ACCEPTANCE GATE REFUSES TEST PARTICLES, so the band grains are declared as finite-mass grains (1.25e-8 = 1.25e17 kg each - the 120 grains sum to the real ring mass 1.5e19 kg; massFloor 1e-9).`;
  const observeJ = `視点のスライダーで横から見ると、環と衛星の面が黄道(xy 面)に対して土星の赤道の傾き ${f(d.pole.tiltDeg, 1)}° で傾いているのが見える。環は面を保つ(タイタン 2 公転で軌道面と赤道面の角の最大 ${pl}°・損失 ${H.loss.lost} 粒)。C環内縁の公転 ${cH} s(h/2 ${cH2} s)・タイタン ${tD} 日。帯の粒の離心率の代理は二次元の 💍(試験粒子)と最大 ${e1(TP.vs2d.h.grainsEcc.maxAbsDiff)} の差(💍 の宣言の質量 10⁻⁵ の写しでは ${e1(TP.m5vs2d.h.grainsEcc.maxAbsDiff)} —— 粒どうしの近接で動く)。gain 0 の本では空間メッシュ(受動プローブ)は 0 で何も描かない。`;
  const observeE = `Turn the view slider to look side-on: the ring and moon plane is tilted ${f(d.pole.tiltDeg, 1)} deg (Saturn's obliquity) to the ecliptic (the xy plane). The ring keeps its plane (over 2 Titan orbits the largest angle between an orbit plane and the equator is ${pl} deg; ${H.loss.lost} grains lost). C-ring inner edge ${cH} s (h/2 ${cH2} s); Titan ${tD} d. The grains' eccentricity proxies differ from 2D 💍 (test particles) by at most ${e1(TP.vs2d.h.grainsEcc.maxAbsDiff)} (with 💍's declared mass 1e-5 the difference is ${e1(TP.m5vs2d.h.grainsEcc.maxAbsDiff)} - close grain encounters move it). At gain 0 the space mesh (passive probe) is zero and draws nothing.`;
  const controlJ = `ワンタップの対照は水星の三次元のフィット値の移送(同じ SI の gain ${gT} —— 合わせていない診断)。回転引きずりが赤道面で接線向き・極の軸の上で 0 になるのを空間メッシュで見る(C環内縁の公転は gain 0 との差 ${f(TR.cInPeriodSecDiff, 1)} s)。比べる相手は 💍(二次元・試験粒子)と 🟡(三次元・太陽と土星)。`;
  const controlE = `The one-tap control carries Mercury's 3D fitted value (the same SI gain, ${gT} here - a diagnostic, not a fit). Watch the space mesh show the rotational drag tangential on the equator and zero on the pole axis (the C-ring inner-edge period moves ${f(TR.cInPeriodSecDiff, 1)} s from gain 0). Compare with 💍 (2D, test particles) and 🟡 (3D, Sun and Saturn).`;
  const audit = (J0) => ({
    observedInputs: J0 ? ['実 G=6.674', '実 c₀=29979.2458', '土星・主要衛星 6 の実質量・実半径・実軌道半径(💍 の写し)', '環 C/B/A 帯の実半径とカッシーニの間隙(💍 の写し)', '土星の極(IAU WGCCRE 2009 —— 🟡 の宣言の写し・一定の近似)', '実環の総質量 1.5×10¹⁹ kg(💍 の説明の値 —— 粒の質量へ)']
      : ['real G=6.674', 'real c0=29979.2458', "Saturn's and the six moons' real masses, radii and orbital radii (copied from 💍)", 'real radii of the C/B/A bands and the Cassini division (from 💍)', "Saturn's pole (IAU WGCCRE 2009 - copied from 🟡; held fixed)", "the real ring mass 1.5e19 kg (💍's text - split over the grains)"],
    fixedConventions: J0 ? ['サンプル別スケール指数(1単位=10^6m/10^2s/10^25kg —— 💍 と同じ)', 'physics.coord:"3d"(右手系・黄道は xy 面)', 'geoPN=3・kFrame=0・λ_PN=0', '慣性引きずり relativeDrag:{law:"inertial", gain:0, eps:0.05, pairs:"all", solver:"network-pcg-v1", spinDrag:{rot:"surfaceFlip", axial:"off"}}', '土星 pinned(局所の近似)', '乱数の種 seed を 💍 と同じに明示(同じ粒)', '帯は数値の質量の有限粒子(試験粒子ではない)・massFloor 10⁻⁹']
      : ['per-sample scale exponents (1 unit = 10^6 m / 10^2 s / 10^25 kg - as 💍)', 'physics.coord 3d (right-handed; the ecliptic is the xy plane)', 'geoPN=3, kFrame=0, lambda_PN=0', 'inertial drag relativeDrag {law inertial, gain 0, eps 0.05, pairs all, solver network-pcg-v1, spinDrag {rot surfaceFlip, axial off}}', 'Saturn pinned (a local approximation)', "the random seed declared equal to 💍's (the same grains)", 'band grains are finite-mass grains (not test particles); massFloor 1e-9'],
    fitted: J0 ? ['**無し** —— gain 0 の基準(標的なし)'] : ['NOTHING - the gain-0 baseline (no target)'],
    derived: J0 ? ['κ=G/c₀²=7.4258×10⁻⁹', `群の incl ${f(d.incl, 4)}°・node ${f(d.node, 4)}°(極の傾き・方位 + 90°)`, '帯の粒の質量 1.25×10⁻⁸ = 1.5×10¹⁹ kg / 120 粒'] : ['kappa=G/c0^2=7.4258e-9', `group incl ${f(d.incl, 4)}, node ${f(d.node, 4)} deg (pole tilt, azimuth + 90)`, 'grain mass 1.25e-8 = 1.5e19 kg / 120 grains'],
    numerical: J0 ? ['ソフトニング ε=0.05(=50 km —— 重力と引きずりの核)', '時間倍率 timeScale=1・画面の刻み stepDt=0.58(💍 の時間の基準)', '粒子表示倍率 dispMag=1・帯の粒の表示半径 0.1(明示半径)'] : ['softening eps=0.05 (=50 km - gravity and the drag kernel)', "time multiplier timeScale=1, screen step stepDt=0.58 (💍's time standard)", 'display magnification dispMag=1; grain display radius 0.1 (explicit radius)'] });
  const P = { id: R3.ID, name: '土星の輪(慣性決定力版・三次元)— gain 0 の基準', emoji: R3.EMOJI, group: '現実較正', familyId: 'saturn', familyRole: 'variant', scaleTier: 'planetary', scaleExp: d.scaleExp,
    sampleClass: 'principle', fidelity: 'real', notClaim: ['ring3d_grains', 'gain_universal_fit'], seed: d.seed,
    abBody: { label: { ja: `水星の三次元のフィット値を移送(gain ${gT} —— 同じ SI・合わせていない)`, en: `carry Mercury's 3D fitted value (gain ${gT} - the same SI, not a fit)` },
      physicsPatch: { relativeDrag: { law: 'inertial', gain: gT, eps: d.physics.relativeDrag.eps, history: 'positions', pairs: 'all', solver: 'network-pcg-v1', spinDrag: { rot: 'surfaceFlip', axial: 'off' } } } },
    obsCard: card(rowsJ), descStruct: { summary: summaryJ, observe: observeJ, control: controlJ },
    en: { name: "Saturn's Rings (inertial determinacy, 3D) — the gain-0 baseline", obsCard: card(rowsE), descStruct: { summary: summaryE, observe: observeE, control: controlE }, parameterAudit: audit(false) },
    parameterAudit: audit(true) };
  const lines = ['// ===== 第300便c(原仮定者の裁定(第90報)⑥・統括の検証項目 R177): 🍩 saturnRingInertial3d —— 土星の輪の geoPN=3 三次元(gain 0 の基準 —— 標的なし)=====',
    '// physics・bodies・timeRef・camera・seed は生成器 tests/lib-w300c-saturnring3d.mjs の ringDecl3 の写し(QA preset.saturnRing3d300 が照合)。数は正本 tests/out/saturnring3d-w300c.json の実測。'];
  let txt = '{ ' + Object.keys(P).map((k) => `  ${k}:${jsLit(P[k])}`).join(',\n').replace(/^  /, '') + ',\n';
  txt += '  activeParams:["geoPN","dispMag"],\n';
  txt += `  camera:${jsLit(d.camera)}, world:{boundary:"none",size:0},\n`;
  txt += `  timeRef:${jsLit(d.timeRef)},\n`;
  txt += `  physics:${jsLit(d.physics)},\n`;
  txt += '  bodies:[   // 0=土星(pinned・自転軸を有効化), 1〜6=ミマス〜タイタン(💍 の写しを赤道面へ), 7〜9=C/B/A 帯(数値の質量の有限粒子)\n' + d.bodies.map((z) => '    ' + jsLit(z)).join(',\n') + '\n  ],\n';
  txt += '  overlays:{rotationCurve:false,tempHistogram:false,field:false,trail:true} },';
  return lines.join('\n') + '\n' + txt + '\n';
}
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN && process.argv.includes('--child')) {
  const spec = JSON.parse(process.argv[process.argv.indexOf('--child') + 1]);
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const { HP } = loadHtmlMain(path.join(ROOT, TARGET));
  process.stdout.write(JSON.stringify(childTask(HP, spec)));
} else if (IS_MAIN && process.argv.includes('--emit')) {
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const { HP } = loadHtmlMain(path.join(ROOT, TARGET));
  const J = JSON.parse(fs.readFileSync(process.env.W300C_OUT || path.join(ROOT, 'tests', 'out', 'saturnring3d-w300c.json'), 'utf8'));
  fs.writeFileSync(process.argv[process.argv.indexOf('--emit') + 1], emitBook(HP, J));
} else if (IS_MAIN) await main();
