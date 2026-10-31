// 第321便a(原仮定者の予定(第123報)「geoPN=2の予定: 3D対応する。現状、最も銀河を再現しているのがgalaxyGeo2であり、引きずり近似としての需要が有る」・
// 統括の検証項目 R266): **geoPN=2(v−u 則)の 3D の S1 の器**(段 geo2v3-321a —— 正本 tests/out/geo2v3-w321a.json)。html・エンジン・在位の本は変えない
// (器・lib・正本・文書だけ —— 3 成分の純関数は tests/lib-w321a-geo2v3.mjs)。
//
// Node だけ(対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、html の 2D の步・3D の步・受理の門を比べの相手にする)。
//
// ■ 何をするか(段)
//   base   💫 galaxyGeo2 の 2D の基準の凍結(claim galaxygeo2.outer-boost-ratio の手続き —— HP.loadPreset → A/B の kFrame=0 の写し・外縁帯 [156,286]・
//          c₀=30 の本なので 12000 步 × dt 0.016〔6000 步の値も記録〕・h/2 は dt 0.008 で同じ時刻まで)—— 3D の本は新しい ID なので、この記録が対照
//   degen  面への退化: z = v_z = 0・軸 +z の純関数の步と html の 2D の步(`S._core` の geoPN=2)の全状態の照合(小さい系 2〜5 体・20 步・semi/leapfrog・
//          特別化と generic の対ループ・q ≠ 2・倍精度の宣言・仕事の口座・galaxyGeo2 の写しの 4 体)
//   d3     三次元の html の步(dfmStep3 —— kFrame=0 の重力の部分)と純関数(kFrame=0)の照合(非平面・傾いた軸)と今の門(coord3dDenyOf・coord3dRuntimeWhy)
//   cov    回転共変: 非平面の 6 体(傾いた自転軸・固定中心)を回転 R で回した初期条件の步と、元の步を R で回した状態の差(倍精度・4 つの回転・semi/leapfrog)
//   field  解析の場: 静止(G=0)・一様並進(D₀=0)・剛体回転の演算子(∇u = [Ω]_× + H)・1 つの自転する源の殻の閉じた式(u・J・curl)・勾配の有限差分
//   hist   初回の u の履歴(初回の蹴りなし —— 純関数と html の両方)
//   ledger 口座: 運動量・角運動量(固定中心の拘束分 conP・conL を含む)の閉じ(倍精度と単精度)・G = 0 の写しで運動エネルギーの変化 = 引きずりの仕事
//
// ■ 試走: W321A_QUICK=1(W321A_OUT が要る —— 正本を書かない・base を 600 步に)。W321A_WORKERS(既定 2 —— base の h/2 の行を子プロセス 1 本で並走)。
//   W321A_PART=<段,…> で段を絞る(既存の出力の他の段を残して上書き —— 正本は全段で作る)。
// ■ 言わないこと: 3D で銀河を表せた・3D の回転曲線(本はまだ無い)・q 近似を導いた法則と呼ばない・退化の照合を「法則を確かめた」と書かない(同じ演算列の照合)。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as G3 from './lib-w321a-geo2v3.mjs';
// 第281便a の領域 hash の宣言(器と lib から deriveScope で引いた下限 —— 読む本は galaxyGeo2 だけ〔.find で引く〕・短い名 T・ctx・cv・cw は import した lib の綴り・
//   coord3dDenyOf・dfmCore3 は S2_PLAN の文字列 —— この器の局所の変数には使わない)
const REGEN_SCOPE = {"presets":["galaxyGeo2"],"roots":["HP.ab","HP.abStart","HP.abStop","HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.geoModeOf","HP.loadPreset","HP.sim","HP.validatePreset","T","coord3dDenyOf","ctx","cv","cw","dfmCore3"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w321a-geo2v3-1';
export const OUT_GEO2V3 = 'tests/out/geo2v3-w321a.json';
const TARGET = process.env.W321A_TARGET || 'beta/index.html';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (x) => JSON.parse(JSON.stringify(x));
export const GAL_ID = 'galaxyGeo2';
/** 凍結した 2D の基準(基点 a708bfe の正本 tests/out/refit-w297a.json の段 galaxy の λ_PN=0・dt 0.016 の行 —— 本の説明の「約1.18倍」・状態の文「1.180」)。 */
export const FROZEN = Object.freeze({ ratio: 1.1800727845699235, ratioH2: 1.1794824600661076, window: Object.freeze([1.14, 1.23]), steps: 12000, dt: 0.016, band: Object.freeze([156, 286]), text: '1.180' });
export const PLAN = Object.freeze({ dt: 0.016, degenSteps: 20, d3Steps: 20, covSteps: 12, ledgerSteps: 40, histSteps: 2,
  base: Object.freeze({ steps: 12000, mid: 6000, dt: 0.016, h2: true }), rotations: 4, fdH: 1e-4, shellPoints: 12 });
export const QUICK = Object.freeze({ dt: 0.016, degenSteps: 6, d3Steps: 6, covSteps: 4, ledgerSteps: 10, histSteps: 2,
  base: Object.freeze({ steps: 600, mid: 300, dt: 0.016, h2: false }), rotations: 2, fdH: 1e-4, shellPoints: 4 });
const NOT_CLAIM = ['3D で銀河を表せたと書かない(本はまだ無い —— 純関数と試験だけ)', '3D の回転曲線と書かない', 'q 近似を導いた法則と呼ばない',
  '退化の照合は同じ演算列の照合(法則の確かめではない)', 'galaxyGeo2 の外縁の比は原理の本の機構の値(実在の銀河の観測の較正ではない)', 'S2 の門の案は案(エンジンは変えていない)'];

/* ───────── 小さい系の本(受理を通す —— 宣言は galaxyGeo2 と同じ物理の欄)───────── */
const PH0 = Object.freeze({ G: 0.8, D0: 1.5, kFrame: 1, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, etaRad: 0, geoPN: 2, lambdaPN: 0, softening: 3, radiusScale: 1, cLight: 30, contactMode: 'none', frameWeight: 'share' });
export function bookOf(bodies, ph, extra) {
  return Object.assign({ name: 'w321a', description: 'w321a', sampleClass: 'principle', camera: { scale: 100 }, world: { boundary: 'none', size: 0 },
    physics: Object.assign({}, PH0, ph || {}), bodies: clone(bodies) }, extra || {});
}
const sg = (m, x, y, vx, vy, spin, radius, pinned) => ({ type: 'single', m, x, y, vx, vy, spin, pinned: !!pinned, radius });
export const SMALL = Object.freeze({
  b2: [sg(3, 0, 0, 0, -0.3, 0.8, 2), sg(1, 40, 0, 0, 0.9, -0.2, 1)],
  b3: [sg(2, -30, 0, 0, -0.4, 0.5, 1.5), sg(1.5, 35, 10, 0.1, 0.6, 0, 1.2), sg(1, 0, 45, -0.7, 0.05, 0.3, 1)],
  b5: [sg(2500, 0, 0, 0, 0, 1.2, 15, true), sg(0.3, 120, 10, -0.4, 4.0, 0, 0.6), sg(0.45, -60, 150, -3.6, -1.5, 0.2, 0.7), sg(0.2, 30, -200, 3.3, 0.5, -0.1, 0.5), sg(0.5, -210, -40, 0.7, -3.3, 0, 0.8)] });
export const DEGEN_CASES = Object.freeze([
  { key: 'b2-semi', bodies: 'b2', ph: {}, note: '自由な 2 体(片方が逆回り)' },
  { key: 'b3-D0zero', bodies: 'b3', ph: { D0: 0 }, note: '自由な 3 体・D₀ = 0(分母は Σw だけ)' },
  { key: 'b5-semi', bodies: 'b5', ph: {}, note: '固定中心(spin 1.2)+ 4 体' },
  { key: 'b5-leapfrog', bodies: 'b5', ph: {}, extra: { integrator: 'leapfrog' }, note: '同じ・leapfrog' },
  { key: 'b5-generic', bodies: 'b5', ph: {}, extra: { overlays: { mechSpectrum: true } }, note: '同じ・generic の対ループ(機構スペクトル ON)' },
  { key: 'b5-q15', bodies: 'b5', ph: { q: 1.5 }, note: '同じ・q = 1.5(Math.pow の枝)' },
  { key: 'b5-double', bodies: 'b5', ph: { stateCarry: 'double', framePrecision: 'double', massPrecision: 'double' }, note: '同じ・倍精度の宣言(補償和つき)' },
  { key: 'b5-work', bodies: 'b5', ph: { ledger: { dragWork: true } }, note: '同じ・仕事の口座(ledger.dragWork)' },
  { key: 'gal4', bodies: 'gal4', ph: null, note: 'galaxyGeo2 の写し(円盤の粒子を 4 に —— 同じ生成器・同じ seed)' }]);

function simOf(HP, preset) {
  const v = HP.validatePreset(preset);
  if (!v.ok) throw new Error('受理されない: ' + JSON.stringify(v.errors).slice(0, 300));
  const S = HP.coord3d.makeSim(); S.build(clone(v.preset));
  return S;
}
function galBook(HP, nDisk) {
  const p = clone(HP.allPresets().find((q) => q.id === GAL_ID));
  p.bodies[1].n = nDisk; delete p.claims; p.overlays = Object.assign({}, p.overlays, { mechSpectrum: false });
  return p;
}
const CMP2 = [['x', 'x'], ['y', 'y'], ['vx', 'vx'], ['vy', 'vy'], ['spin', 'spin'], ['uPx', 'uPx'], ['uPy', 'uPy'], ['rotA', 'rotA'], ['hasU', 'hasU']];
function cmp2D(S, st, acc) {
  for (const [a, b] of CMP2) { const d = G3.arrDiff(S[a], st[b]); acc.nVal += S.n; acc.nDiff += d.nDiff; if (d.rel > acc.maxRel) { acc.maxRel = d.rel; acc.at = a; } }
  for (const [a, b] of [['resPx', 'resPx'], ['resPy', 'resPy'], ['resL', 'resLz'], ['clampVN', 'clampVN'], ['clampSN', 'clampSN'], ['clampRN', 'clampRN']].concat(S.hasDragWork ? [['dragWorkE', 'dragWorkE'], ['dragWorkKE', 'dragWorkKE'], ['dragSpinE', 'dragSpinE'], ['dragWorkN', 'dragWorkN']] : [])) {
    const va = S[a] || 0, vb = st.ledger[b]; acc.nVal++; if (va !== vb) acc.nDiff++; const r = G3.relDiff(va, vb); if (r > acc.maxRel) { acc.maxRel = r; acc.at = a; } }
  acc.nVal++; if (S.t !== st.t) acc.nDiff++;
  let zm = 0; for (let i = 0; i < st.n; i++) zm = Math.max(zm, Math.abs(st.z[i]), Math.abs(st.vz[i]), Math.abs(st.uPz[i]), Math.abs(st.sax[i]), Math.abs(st.say[i]), Math.abs(st.saz[i] - 1));
  acc.zMax = Math.max(acc.zMax, zm);
  // 角運動量(軌道 + 自転 + リザーバ —— html の状態から同じ式で)
  const h = G3.totals3(G3.stateOf2D(S)), p = G3.totals3(st), r = G3.relDiff(h.L[2], p.L[2]);
  if (r > acc.Lrel) acc.Lrel = r;
}

/* ───────── base ───────── */
function galOuter(S) { let sum = 0, c = 0;
  for (let i = 1; i < S.n; i++) { const rr = Math.hypot(S.x[i], S.y[i]); if (rr >= FROZEN.band[0] && rr <= FROZEN.band[1]) { sum += (S.x[i] * S.vy[i] - S.y[i] * S.vx[i]) / rr; c++; } }
  return { v: c ? sum / c : 0, c }; }
/** claim の手続き(HP.loadPreset → HP.abStart('kFrame', 0) で B 側を作り、A と B を同じ步で進める)の 1 行。 */
export function baseRow(HP, dt, steps, mid) {
  const t0 = Date.now();
  HP.loadPreset(GAL_ID, false); HP.abStart('kFrame', 0);
  const pairAB = HP.ab(), A = HP.sim, B = pairAB.simB;
  const at = { n: A.n, kFrameA: A.params.kFrame, kFrameB: B.params.kFrame, lambdaPN: A.params.lambdaPN, lambdaPNB: B.params.lambdaPN, geoPN: A.params.geoPN, integrator: A.integrator, frameWeight: A.params.frameWeight, contactNone: A.contactNone === true, law: HP.geoModeOf(A.params).law };
  let midRow = null;
  for (let k = 0; k < steps; k++) {
    A.step(dt); B.step(dt);
    if (k + 1 === mid) { const a = galOuter(A), b = galOuter(B); midRow = { steps: k + 1, t: A.t, vphiKF1: a.v, vphiKF0: b.v, ratio: a.v / b.v, nBandKF1: a.c, nBandKF0: b.c }; }
  }
  const a = galOuter(A), b = galOuter(B);
  const row = Object.assign(at, { dt, steps, t: A.t, vphiKF1: a.v, vphiKF0: b.v, ratio: a.v / b.v, nBandKF1: a.c, nBandKF0: b.c, mid: midRow,
    clampVN: [A.clampVN, B.clampVN], clampSN: [A.clampSN, B.clampSN], clampRN: [A.clampRN || 0, B.clampRN || 0], nan: A.hasNaN() || B.hasNaN(), wallSec: (Date.now() - t0) / 1000 });
  HP.abStop();
  return row;
}
function childRow(dt, steps, mid) {
  return new Promise((res, rej) => {
    const cp = spawn(process.execPath, [fileURLToPath(import.meta.url), '--base-row', String(dt), String(steps), String(mid)], { cwd: ROOT, env: process.env, stdio: ['ignore', 'pipe', 'inherit'] });
    let buf = ''; cp.stdout.on('data', (d) => { buf += d; });
    cp.on('close', (code) => { const ln = buf.trim().split('\n').filter((l) => l.startsWith('{')).pop(); if (code !== 0 || !ln) rej(new Error('子プロセスの行が無い(' + code + ')')); else res(JSON.parse(ln)); });
  });
}
export async function partBase(HP, plan, workers) {
  const bp = HP.allPresets().find((q) => q.id === GAL_ID), b = plan.base;
  const input = { id: GAL_ID, seed: bp.seed, physics: clone(bp.physics), bodies: clone(bp.bodies), timeRef: clone(bp.timeRef || null), claim: clone((bp.claims || []).find((c) => c.metric === 'outerRotationBoostRatio') || null),
    band: FROZEN.band.slice(), procedure: 'claim galaxygeo2.outer-boost-ratio(HP.loadPreset → HP.abStart(kFrame, 0) —— A は kFrame=1 の本・B は kFrame=0 の写し・同じ步で進める)・外縁帯の平均 vφ の比 kF1/kF0',
    stepsNote: 'c₀=30 の本は 6000 × 2 = 12000 步(器 tests/exp-w297a-refit.mjs の段 galaxy と同じ)—— 6000 步の値は途中の記録' };
  const h2p = b.h2 ? ((workers >= 2) ? childRow(b.dt / 2, 2 * b.steps, 2 * b.mid) : null) : null;
  const h = baseRow(HP, b.dt, b.steps, b.mid);
  const h2 = b.h2 ? (h2p ? await h2p : baseRow(HP, b.dt / 2, 2 * b.steps, 2 * b.mid)) : null;
  const inWin = (r) => r >= FROZEN.window[0] && r <= FROZEN.window[1];
  return { input, rows: { h, h2 }, frozen: clone(FROZEN), sameAsFrozen: b.steps === FROZEN.steps ? Object.is(h.ratio, FROZEN.ratio) : null, sameAsFrozenH2: h2 ? Object.is(h2.ratio, FROZEN.ratioH2) : null,
    inWindow: inWin(h.ratio), midInWindow: h.mid ? inWin(h.mid.ratio) : null, h2Diff: h2 ? Math.abs(h2.ratio - h.ratio) : null, clampZero: [h, h2].filter(Boolean).every((r) => r.clampVN.concat(r.clampSN, r.clampRN).every((c) => c === 0) && !r.nan),
    textRound: h.ratio.toFixed(3) };
}

/* ───────── degen ───────── */
export function partDegen(HP, plan) {
  const rows = [];
  for (const c of DEGEN_CASES) {
    const t0 = Date.now();
    const preset = c.bodies === 'gal4' ? galBook(HP, 4) : bookOf(SMALL[c.bodies], c.ph, c.extra);
    const S = simOf(HP, preset);
    let st = G3.stateOf2D(S);
    const scope = G3.geo2v3ScopeOf(preset.physics, preset.bodies);
    const acc = { nVal: 0, nDiff: 0, maxRel: 0, at: null, zMax: 0, Lrel: 0 };
    let anyKick = 0;
    for (let k = 0; k < plan.degenSteps; k++) {
      S.step(plan.dt); st = G3.geo2Step3(st, plan.dt, { trace: k === 1 });
      if (st.trace) for (const tr of st.trace) for (const d of tr.du) if (d[1] !== 0 || d[2] !== 0) anyKick++;
      cmp2D(S, st, acc);
    }
    rows.push({ key: c.key, note: c.note, n: S.n, steps: plan.degenSteps, integrator: S.integrator, kKind: S._kKind, prec: clone(st.prec), dragWork: S.hasDragWork === true,
      scopeOk: scope.ok, scopeReasons: scope.reasons.map((r) => r.key), law: HP.geoModeOf(S.params).law, kicksStep2: anyKick,
      nVal: acc.nVal, nDiff: acc.nDiff, maxRel: acc.maxRel, at: acc.at, zMax: acc.zMax, LzRel: acc.Lrel, same: acc.nDiff === 0, wallSec: (Date.now() - t0) / 1000 });
  }
  return { rows, allSame: rows.every((r) => r.same), maxRel: Math.max(...rows.map((r) => r.maxRel)), nVal: rows.reduce((s, r) => s + r.nVal, 0) };
}

/* ───────── d3(三次元の html の步と門)───────── */
const B3D = Object.freeze([
  { type: 'single', m: 6, x: 0, y: 0, z: 0, vx: 0, vy: -0.05, vz: 0.02, spin: 0.6, pinned: false, radius: 2, spinAxis: { enable: true, tiltDeg: 25, azimuthDeg: 40, source: '第321便a の器の試験の宣言(観測値ではない)' } },
  { type: 'single', m: 1, x: 40, y: 5, z: 8, vx: 0.05, vy: 0.55, vz: -0.1, spin: 0.2, pinned: false, radius: 1 },
  { type: 'single', m: 0.8, x: -30, y: 25, z: -12, vx: -0.3, vy: -0.4, vz: 0.15, spin: -0.3, pinned: false, radius: 0.9 },
  { type: 'single', m: 0.5, x: 10, y: -45, z: 20, vx: 0.45, vy: 0.1, vz: -0.05, spin: 0, pinned: false, radius: 0.7 }]);
export function part3D(HP, plan) {
  const rows = [];
  for (const integ of ['semi', 'leapfrog']) {
    const p = bookOf(B3D, { coord: '3d', kFrame: 0, geoPN: 0, D0: 2, softening: 0.5 }, integ === 'leapfrog' ? { integrator: 'leapfrog' } : null);
    const S = simOf(HP, p);
    let st = G3.stateOf3D(S);
    let nVal = 0, nDiff = 0, maxRel = 0;
    for (let k = 0; k < plan.d3Steps; k++) {
      S.step(plan.dt); st = G3.geo2Step3(st, plan.dt);
      for (const a of ['x', 'y', 'z', 'vx', 'vy', 'vz', 'spin', 'rotA', 'sax', 'say', 'saz']) { const d = G3.arrDiff(S[a], st[a]); nVal += S.n; nDiff += d.nDiff; maxRel = Math.max(maxRel, d.rel); }
      nVal++; if (S.t !== st.t) nDiff++;
    }
    let zMin = Infinity; for (let i = 0; i < S.n; i++) zMin = Math.min(zMin, Math.abs(S.z[i]));
    rows.push({ integrator: integ, coord3d: S.coord3d === true, n: S.n, steps: plan.d3Steps, nVal, nDiff, maxRel, same: nDiff === 0, nonPlanar: zMin > 0, axisTilted: Math.abs(S.saz[0] - 1) > 1e-6 });
  }
  // 今の門(S2 で同時に開ける 2 つ —— 受理 coord3dDenyOf と実行時 coord3dRuntimeWhy)
  const gal3 = clone(HP.allPresets().find((q) => q.id === GAL_ID)); gal3.physics = Object.assign({}, gal3.physics, { coord: '3d' });
  const small3 = bookOf(SMALL.b5, { coord: '3d' });
  const denyGal = HP.coord3d.denyOf(HP.validatePreset(gal3).preset || gal3).map((d) => d.key);
  const denySmall = HP.coord3d.denyOf(HP.validatePreset(small3).preset || small3).map((d) => d.key);
  const S0 = simOf(HP, bookOf(B3D, { coord: '3d', kFrame: 0, geoPN: 0 }));
  const why0 = HP.coord3d.runtimeWhy(S0); S0.params.kFrame = 1; const whyK = HP.coord3d.runtimeWhy(S0); S0.params.kFrame = 0; S0.params.geoPN = 2; const whyG = HP.coord3d.runtimeWhy(S0);
  const accepted3 = HP.validatePreset(small3).ok === true;
  return { rows, allSame: rows.every((r) => r.same), gates: { denyGalaxyGeo2: denyGal, denySmallGeo2: denySmall, accepted3d: accepted3, runtimeNone: why0, runtimeKFrame: whyK, runtimeGeoPN2: whyG,
    lawSmall: HP.geoModeOf(small3.physics).law, rejectedList: HP.coord3d.rejected.slice() } };
}

/* ───────── cov ───────── */
const B6 = Object.freeze([
  { m: 2500, R: 15, x: 0, y: 0, z: 0, spin: 1.2, axis: [0.15, -0.1, 1], pinned: true },
  { m: 0.3, R: 0.6, x: 120, y: 10, z: 14, vx: -0.4, vy: 4.0, vz: 0.3, spin: 0 },
  { m: 0.45, R: 0.7, x: -60, y: 150, z: -22, vx: -3.6, vy: -1.5, vz: -0.2, spin: 0.2, axis: [0.3, 0.2, 1] },
  { m: 0.2, R: 0.5, x: 30, y: -200, z: 35, vx: 3.3, vy: 0.5, vz: 0.4, spin: -0.1, axis: [-0.5, 0.1, 0.8] },
  { m: 0.5, R: 0.8, x: -210, y: -40, z: -9, vx: 0.7, vy: -3.3, vz: -0.1, spin: 0 },
  { m: 0.35, R: 0.65, x: 80, y: 90, z: 60, vx: -2.9, vy: 2.4, vz: -0.6, spin: 0.15, axis: [0, 1, 0] }]);
const PARAMS = Object.freeze({ G: 0.8, D0: 1.5, kFrame: 1, q: 2, softening: 3 });
const DBL = Object.freeze({ state: 'double', frame: 'double', mass: 'double', spin: 'double' });
const ROTS = Object.freeze([{ k: [1, 2, 3], a: 0.7 }, { k: [-0.3, 0.9, 0.2], a: 2.1 }, { k: [1, 0, 0], a: Math.PI / 2 }, { k: [0.6, -0.8, 0.45], a: 4.4 }]);
/** 系の尺度: P = Σ |m||v|・L = Σ |m||r||v| + I|s|・K = 運動エネルギー(初期の状態)。 */
export function scalesOf(st) {
  let P = 0, L = 0, K = 0;
  for (let i = 0; i < st.n; i++) { const m = Math.abs(st.m[i]), v = Math.hypot(st.vx[i], st.vy[i], st.vz[i]); P += m * v; L += m * Math.hypot(st.x[i], st.y[i], st.z[i]) * v + 0.5 * m * st.R[i] * st.R[i] * Math.abs(st.spin[i]); K += 0.5 * m * v * v; }
  return { P, L, K };
}
/** 天体ごとの差で作る運動エネルギーと自転のエネルギーの変化(固定中心の大きな自転のエネルギーに小さい変化を足して引く打ち消しを避ける)。 */
export function energyChangeOf(a, b) {
  let dK = 0, dKs = 0;
  for (let i = 0; i < a.n; i++) {
    const m = a.m[i], I = 0.5 * m * a.R[i] * a.R[i];
    dK += 0.5 * m * ((b.vx[i] * b.vx[i] + b.vy[i] * b.vy[i] + b.vz[i] * b.vz[i]) - (a.vx[i] * a.vx[i] + a.vy[i] * a.vy[i] + a.vz[i] * a.vz[i]));
    dKs += 0.5 * I * (b.spin[i] * b.spin[i] - a.spin[i] * a.spin[i]);
  }
  return { dK, dKs };
}
function covRow(plan, integ, policy, prec, rot) {
  const st0 = G3.makeState(B6, PARAMS, prec, { integrator: integ, spinPolicy: policy });
  const M = G3.rotMat(rot.k, rot.a);
  const A = G3.rotateState(G3.geo2Run3(st0, plan.dt, plan.covSteps), M), B = G3.geo2Run3(G3.rotateState(st0, M), plan.dt, plan.covSteps);
  const grp = (keys) => { let mx = 0, sc = 0; for (let i = 0; i < A.n; i++) for (const k of keys) { mx = Math.max(mx, Math.abs(A[k][i] - B[k][i])); sc = Math.max(sc, Math.abs(A[k][i])); } return sc > 0 ? mx / sc : mx; };
  const spinVec = () => { let mx = 0, sc = 0; for (let i = 0; i < A.n; i++) { const a = [A.spin[i] * A.sax[i], A.spin[i] * A.say[i], A.spin[i] * A.saz[i]], b = [B.spin[i] * B.sax[i], B.spin[i] * B.say[i], B.spin[i] * B.saz[i]]; for (let k = 0; k < 3; k++) { mx = Math.max(mx, Math.abs(a[k] - b[k])); sc = Math.max(sc, Math.abs(a[k])); } } return sc > 0 ? mx / sc : mx; };
  // 口座のベクトルは系の尺度(Σ m|v|・Σ m|r||v| + I|s|)で・仕事の口座は初期の運動エネルギーで割る(口座は打ち消し合う項の和 —— 自分の大きさで割ると丸めが拡大する)
  const sc0 = scalesOf(st0);
  const led = (k, s) => { const a = [A.ledger[k + 'x'], A.ledger[k + 'y'], A.ledger[k + 'z']], b = [B.ledger[k + 'x'], B.ledger[k + 'y'], B.ledger[k + 'z']]; return Math.max(...a.map((v, q) => Math.abs(v - b[q]))) / s; };
  const scal = Math.max(...['dragWorkE', 'dragWorkKE', 'dragSpinE'].map((k) => Math.abs(A.ledger[k] - B.ledger[k]) / sc0.K));
  const r = { pos: grp(['x', 'y', 'z']), vel: grp(['vx', 'vy', 'vz']), uHist: grp(['uPx', 'uPy', 'uPz']), spinVec: spinVec(), rotA: grp(['rotA']), resP: led('resP', sc0.P), resL: led('resL', sc0.L), conP: led('conP', sc0.P), conL: led('conL', sc0.L), work: scal };
  r.max = Math.max(...Object.values(r)); r.axisTurns = A.ledger.axisTurnN; r.kicks = A.ledger.dragWorkN;
  return r;
}
export function partCov(plan) {
  const rows = [];
  for (let q = 0; q < plan.rotations; q++) for (const integ of ['semi', 'leapfrog']) rows.push(Object.assign({ rot: ROTS[q], integrator: integ, policy: 'vector', prec: 'double' }, covRow(plan, integ, 'vector', DBL, ROTS[q])));
  rows.push(Object.assign({ rot: ROTS[0], integrator: 'semi', policy: 'parallel', prec: 'double' }, covRow(plan, 'semi', 'parallel', DBL, ROTS[0])));
  const single = Object.assign({ rot: ROTS[0], integrator: 'semi', policy: 'vector', prec: 'single' }, covRow(plan, 'semi', 'vector', {}, ROTS[0]));
  const main = rows;
  return { rows: main, single, maxRel: Math.max(...main.map((r) => r.max)), steps: plan.covSteps, note: '単精度の行は記録だけ(Float32 の格納は軸ごとの丸め —— 回転で共変でない丸め)' };
}

/* ───────── field ───────── */
const rng = (seed) => { let s = seed >>> 0; return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
const vrel = (a, b) => { const sc = Math.max(...a.map(Math.abs), ...b.map(Math.abs)); return sc > 0 ? Math.max(...a.map((v, k) => Math.abs(v - b[k]))) / sc : 0; };
const cr = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export function partField(plan) {
  const out = {};
  // 静止(G = 0 —— 源は止まったまま・自転 0):u = 0・∇u = 0 → 輸送 0
  { const bodies = B6.map((b) => Object.assign({}, b, { vx: 0, vy: 0, vz: 0, spin: 0 }));
    const st0 = G3.makeState(bodies, Object.assign({}, PARAMS, { G: 0 }), DBL);
    let st = st0, maxDu = 0, maxU = 0;
    for (let k = 0; k < 3; k++) { st = G3.geo2Step3(st, plan.dt, { trace: true }); for (const d of st.trace[0].du) maxDu = Math.max(maxDu, Math.abs(d[1]), Math.abs(d[2]), Math.abs(d[3])); for (const u of st.trace[0].u) maxU = Math.max(maxU, Math.abs(u[1]), Math.abs(u[2]), Math.abs(u[3])); }
    let moved = 0; for (let i = 0; i < st.n; i++) for (const a of ['x', 'y', 'z', 'vx', 'vy', 'vz']) if (st[a][i] !== st0[a][i]) moved++;
    out.static = { steps: 3, maxU, maxDu, moved, pass: maxU === 0 && maxDu === 0 && moved === 0 }; }
  // 一様並進(G = 0・D₀ = 0・自転 0 —— 全天体が同じ V):u = V・∇u = 0・curl = 0 → Δu ≈ 0(丸め)
  { const V = [0.7, -0.4, 0.25], bodies = B6.map((b) => Object.assign({}, b, { vx: V[0], vy: V[1], vz: V[2], spin: 0, pinned: false }));
    let st = G3.makeState(bodies, Object.assign({}, PARAMS, { G: 0, D0: 0 }), DBL);
    let uRel = 0, Jmax = 0, duRel = 0, vRel = 0; const Vn = Math.hypot(...V);
    for (let k = 0; k < 4; k++) {
      st = G3.geo2Step3(st, plan.dt, { trace: true });
      for (const u of st.trace[0].u) uRel = Math.max(uRel, vrel(u.slice(1), V));
      for (const j of st.trace[0].J) Jmax = Math.max(Jmax, ...j.slice(1).map(Math.abs));
      if (k > 0) for (const d of st.trace[0].du) duRel = Math.max(duRel, Math.hypot(d[1], d[2], d[3]) / Vn);
    }
    for (let i = 0; i < st.n; i++) vRel = Math.max(vRel, vrel([st.vx[i], st.vy[i], st.vz[i]], V));
    const Lsc = 200;   // 系の大きさ(長さ)—— |J| L / |V| で無次元に
    out.uniform = { V, steps: 4, uRel, JRel: Jmax * Lsc / Vn, duRel, vRel, pass: uRel <= 1e-12 && Jmax * Lsc / Vn <= 1e-12 && duRel <= 1e-12 && vRel <= 1e-12 }; }
  // 剛体回転の演算子(∇u = [Ω]_× + H I —— curl = 2Ω・((v−u)·∇)u = Ω×(v−u) + H(v−u))
  { const r = rng(321001), rows = [];
    for (let k = 0; k < 8; k++) {
      const Om = [r() - 0.5, r() - 0.5, r() - 0.5], H = (k % 2) ? 0.07 * (r() - 0.5) : 0, u = [r() - 0.5, r() - 0.5, r() - 0.5], uP = u.map((x) => x + 0.01 * (r() - 0.5)), v = [2 * r() - 1, 2 * r() - 1, 2 * r() - 1], kF = (k % 3 === 0) ? 0.5 : 1, dt = 0.016;
      const T = G3.transportDelta3(u, G3.rigidJ(Om, H), uP, v, kF, dt, true);
      const vu = v.map((x, q) => x - u[q]), w = v.map((x, q) => x - kF * u[q]), a = cr(Om, vu), c = cr(Om, w);
      const exp = [0, 1, 2].map((q) => (u[q] - uP[q]) + (-(a[q] + H * vu[q]) + 2 * c[q]) * dt);
      rows.push({ kF, H, curlRel: vrel(T.curl, Om.map((x) => 2 * x)), duRel: vrel(T.du, exp), clamped: T.clamped });
    }
    const kf1 = (() => { const Om = [0.2, -0.1, 0.3], u = [0.1, 0.2, -0.05], v = [0.4, -0.3, 0.2]; const T = G3.transportDelta3(u, G3.rigidJ(Om), u, v, 1, 1, true); return vrel(T.du, cr(Om, v.map((x, q) => x - u[q]))); })();
    out.rigid = { rows, maxCurlRel: Math.max(...rows.map((x) => x.curlRel)), maxDuRel: Math.max(...rows.map((x) => x.duRel)), kF1ClosedRel: kf1, pass: rows.every((x) => x.curlRel <= 1e-12 && x.duRel <= 1e-12 && !x.clamped) && kf1 <= 1e-12 }; }
  // 1 つの自転する源の殻(源は静止・軸は傾いている): u = A(d) Ω × r・J = A [Ω]_× + (A′/d)(Ω × r) ⊗ r・curl = 2AΩ + (A′/d)(d²Ω − (r·Ω) r)
  { const rows = [], r = rng(321002);
    for (const q of [2, 1.5]) for (let k = 0; k < plan.shellPoints; k++) {
      const m = 50, R = 4, D0 = 1.5, eps = 3, s = 0.9, ax0 = [0.3, -0.5, 0.8], an = Math.hypot(...ax0), axv = ax0.map((x) => x / an), Om = axv.map((x) => s * x);
      const st = G3.makeState([{ m, R, x: 0, y: 0, z: 0, spin: s, axis: ax0, pinned: true }], { G: 0.8, D0, kFrame: 1, q, softening: eps }, DBL);
      const p = [60 * (r() - 0.5), 60 * (r() - 0.5), 60 * (r() - 0.5)], d = Math.hypot(...p);
      const w = m / Math.sqrt(d * d + eps * eps), wp = -m * d / Math.pow(d * d + eps * eps, 1.5), g = Math.pow(R / (R + d), q), gp = -q * g / (R + d);
      const A = w * g / (D0 + w), Ap = ((wp * g + w * gp) * (D0 + w) - w * g * wp) / ((D0 + w) * (D0 + w));
      const oxr = cr(Om, p), uE = oxr.map((x) => A * x), Ex = G3.rigidJ(Om), JE = new Array(9), rdO = p[0] * Om[0] + p[1] * Om[1] + p[2] * Om[2];
      for (let a = 0; a < 3; a++) for (let b2 = 0; b2 < 3; b2++) JE[3 * a + b2] = A * Ex[3 * a + b2] + (Ap / d) * oxr[a] * p[b2];
      const cE = [0, 1, 2].map((a) => 2 * A * Om[a] + (Ap / d) * (d * d * Om[a] - rdO * p[a]));
      const F = G3.frameAtPoint3(st, p);
      rows.push({ q, d, uRel: vrel(F.u, uE), JRel: vrel(F.J, JE), curlRel: vrel(F.curl, cE) });
    }
    out.shell = { rows: rows.length, maxURel: Math.max(...rows.map((x) => x.uRel)), maxJRel: Math.max(...rows.map((x) => x.JRel)), maxCurlRel: Math.max(...rows.map((x) => x.curlRel)),
      pass: rows.every((x) => x.uRel <= 1e-12 && x.JRel <= 1e-12 && x.curlRel <= 1e-12) }; }
  // 勾配の有限差分(非平面の 6 体の場 —— 受け手の位置を動かして u を中心差分)
  { const st = G3.makeState(B6, PARAMS, DBL), h = plan.fdH, rows = [];
    for (let i = 1; i < st.n; i++) {
      const p0 = [st.x[i], st.y[i], st.z[i]], F = G3.frameAtPoint3(st, p0, { exclude: i }), Jn = new Array(9);
      for (let b2 = 0; b2 < 3; b2++) { const pp = p0.slice(), pm = p0.slice(); pp[b2] += h; pm[b2] -= h; const up = G3.frameAtPoint3(st, pp, { exclude: i }).u, um = G3.frameAtPoint3(st, pm, { exclude: i }).u; for (let a = 0; a < 3; a++) Jn[3 * a + b2] = (up[a] - um[a]) / (2 * h); }
      rows.push({ i, JRel: vrel(F.J, Jn) });
    }
    out.fd = { h, rows, maxRel: Math.max(...rows.map((x) => x.JRel)), pass: rows.every((x) => x.JRel <= 1e-6) }; }
  return out;
}

/* ───────── hist ───────── */
export function partHist(HP, plan) {
  // 純関数: 初回の步は Δu = 0(履歴を置くだけ)・2 步目から蹴る
  let st = G3.makeState(B6, PARAMS, DBL), first = null, second = null;
  st = G3.geo2Step3(st, plan.dt, { trace: true }); first = { kicks: st.trace[0].du.filter((d) => d[1] !== 0 || d[2] !== 0 || d[3] !== 0).length, receivers: st.trace[0].du.length, hasU: Array.from(st.hasU) };
  st = G3.geo2Step3(st, plan.dt, { trace: true }); second = { kicks: st.trace[0].du.filter((d) => d[1] !== 0 || d[2] !== 0 || d[3] !== 0).length, receivers: st.trace[0].du.length };
  // html: 1 步目の kFrame=1 の本と、純関数の kFrame=0(輸送なし)の写しの位置・速度が同じビット(初回の蹴りなし)
  const S = simOf(HP, bookOf(SMALL.b5, {}));
  const st2 = G3.stateOf2D(S); const pure0 = G3.geo2Step3(Object.assign(G3.cloneState(st2), { params: Object.assign({}, st2.params, { kFrame: 0 }) }), plan.dt);
  S.step(plan.dt);
  let nDiff = 0, nVal = 0; for (const a of ['x', 'y', 'vx', 'vy', 'spin']) { const d = G3.arrDiff(S[a], pure0[a]); nDiff += d.nDiff; nVal += S.n; }
  const hasU1 = Array.from(S.hasU), pinned = Array.from(S.pinned);
  S.step(plan.dt); const pure1 = G3.geo2Step3(pure0, plan.dt); let moved2 = 0; for (const a of ['vx', 'vy']) moved2 += G3.arrDiff(S[a], pure1[a]).nDiff;
  return { pure: { first, second }, html: { nVal, nDiff, same: nDiff === 0, hasU: hasU1, pinned, hasUFree: hasU1.every((h, i) => h === (pinned[i] ? 0 : 1)), secondStepDiffers: moved2 > 0 },
    pass: first.kicks === 0 && second.kicks > 0 && first.hasU.every((h, i) => h === (B6[i].pinned ? 0 : 1)) && nDiff === 0 && hasU1.every((h, i) => h === (pinned[i] ? 0 : 1)) && moved2 > 0 };
}

/* ───────── ledger ───────── */
function closeOf(st0, st) {
  const a = G3.totals3(st0), b = G3.totals3(st);
  let Psc = 0, Lsc = 0; for (let i = 0; i < st0.n; i++) { const m = st0.m[i]; Psc += Math.abs(m) * Math.hypot(st0.vx[i], st0.vy[i], st0.vz[i]); Lsc += Math.abs(m) * Math.hypot(st0.x[i], st0.y[i], st0.z[i]) * Math.hypot(st0.vx[i], st0.vy[i], st0.vz[i]) + 0.5 * Math.abs(m) * st0.R[i] * st0.R[i] * Math.abs(st0.spin[i]); }
  return { dP: Math.max(...a.P.map((v, k) => Math.abs(v - b.P[k]))) / Psc, dL: Math.max(...a.L.map((v, k) => Math.abs(v - b.L[k]))) / Lsc, Psc, Lsc, conP: Math.hypot(st.ledger.conPx, st.ledger.conPy, st.ledger.conPz), resP: Math.hypot(st.ledger.resPx, st.ledger.resPy, st.ledger.resPz) };
}
export function partLedger(plan) {
  const rows = {};
  for (const [key, prec, integ] of [['double-semi', DBL, 'semi'], ['double-leapfrog', DBL, 'leapfrog'], ['single-semi', {}, 'semi']]) {
    const st0 = G3.makeState(B6, PARAMS, prec, { integrator: integ });
    const st = G3.geo2Run3(st0, plan.dt, plan.ledgerSteps);
    rows[key] = Object.assign({ steps: plan.ledgerSteps, kicks: st.ledger.dragWorkN, clamps: st.ledger.clampVN + st.ledger.clampSN + st.ledger.clampRN }, closeOf(st0, st));
  }
  // 拘束の口座を外すと閉じない(固定中心が受けた重力の力積の大きさ)
  { const st0 = G3.makeState(B6, PARAMS, DBL), st = G3.geo2Run3(st0, plan.dt, plan.ledgerSteps), a = G3.totals3(st0), b = G3.totals3(st);
    rows.withoutCon = { dP: Math.max(...[0, 1, 2].map((k) => Math.abs((a.P[k]) - (b.P[k] - [st.ledger.conPx, st.ledger.conPy, st.ledger.conPz][k])))) / closeOf(st0, st).Psc }; }
  // 仕事の口座(G = 0 —— 重力の仕事が無い写し): ΔK = dragWorkKE・ΔK_spin = dragSpinE
  const work = {};
  for (const pol of ['vector', 'parallel']) {
    const st0 = G3.makeState(B6, Object.assign({}, PARAMS, { G: 0 }), DBL, { spinPolicy: pol }), st = G3.geo2Run3(st0, plan.dt, plan.ledgerSteps), e = energyChangeOf(st0, st);
    work[pol] = { dK: e.dK, dragWorkKE: st.ledger.dragWorkKE, kRel: G3.relDiff(e.dK, st.ledger.dragWorkKE), dKs: e.dKs, dragSpinE: st.ledger.dragSpinE, ksRel: G3.relDiff(e.dKs, st.ledger.dragSpinE), axisTurns: st.ledger.axisTurnN, perpL: Math.hypot(st.ledger.spinPerpLx, st.ledger.spinPerpLy, st.ledger.spinPerpLz) };
  }
  return { rows, work, pass: rows['double-semi'].dP <= 1e-12 && rows['double-semi'].dL <= 1e-12 && rows['double-leapfrog'].dP <= 1e-12 && rows['double-leapfrog'].dL <= 1e-12 && rows.withoutCon.dP > 1e-6
    && work.vector.kRel <= 1e-10 && work.vector.ksRel <= 1e-10 && work.parallel.kRel <= 1e-10 && work.parallel.perpL > 0 && work.vector.perpL === 0 };
}

/* ───────── S2(dfmStep3 への接続)の変更の一覧(データ —— 文書と報告が読む)───────── */
export const S2_PLAN = Object.freeze([
  { area: '步', what: 'dfmStep3 の核の中(dfmCore3 の後ではなく同じ相)に輸送を入れる: semi は 1 パス・leapfrog は B のパス(doPost)だけで輸送と反作用 —— `S._core` の mode と同じ', where: 'dfmCore3(58622 行付近)・dfmStep3(58721 行付近)', gate: '退化の照合(degen)が 3D の步でも同じビット' },
  { area: '対ループ', what: 'dfmCore3 の対ループに決定力 w・フレームの分子 P(3)・勾配 ∂P(9)・∂W(3)を足す(kFrame>0 の本だけ —— 未宣言の 3D の本は真偽値 1 つで素通り)', where: 'dfmCore3', gate: '在位の 3D の本はビット同一(bitsame)' },
  { area: '状態', what: 'u の履歴 S.uPz(S.uPx/uPy と同じ型・framePrecision に従う)・S.hasU は共有・作業の配列 uAz・dpz・勾配 9 成分(S._g3 —— 遅延確保)', where: 'coord3dPrepare(58790 行付近)・COORD3D_ARRS(10944 行)・CK_ARRS(43168 行)', gate: 'A/B の複製・チェックポイント・保存往復で同じビット' },
  { area: '自転', what: '源の Ω = S.spin × (S.sax, S.say, S.saz)・残余トルクの入れ方(spinPolicy —— vector か parallel か)を裁定して 1 つに', where: '新しい関数(三次元の残余トルク)', gate: '回転共変(cov)・口座の閉じ' },
  { area: '反作用', what: 'φ_ij 分配・残余トルク(ベクトル)・‖Δv‖ ≤ 16・背景 D₀ と pinned の源のリザーバ(resPz・resLx・resLy を足す)', where: 'dfmCore3 の後段(倍精度へ集積して一括適用)', gate: '口座の閉じ(ledger)' },
  { area: '口座', what: '拘束の口座 conP・conL(固定中心が受けた重力の力積)・仕事の口座 dragWorkE/KE/dragSpinE の 3 成分', where: 'coord3dTotals(58839 行付近)・読み口', gate: '固定中心の本で P・L が閉じる' },
  { area: '受理の門', what: 'coord3dDenyOf の kFrame>0・geoPN=2 を**同時に**開ける —— 条件: geoPN 2 の宣言 ∧ kFrame>0 ∧ λ_PN=0 ∧ contactMode:"none" ∧ frameWeight:"share"(他は拒否のまま —— geoPN=3/4 が v−u 則に解決する宣言・geodesic:true・pull 族・λ_PN≠0・接触)', where: 'coord3dDenyOf(10972 行付近)', gate: '拒否の一覧(COORD3D_REJECTED)の行の更新と受理の試験' },
  { area: '実行時の門', what: 'coord3dRuntimeWhy の kFrame≠0・geoPN を同じ条件で通す(走行中の編集で範囲の外になったら步を止める)', where: 'coord3dRuntimeWhy(11040 行付近)', gate: '受理と実行時の門の一致の試験' },
  { area: '重ねない', what: '慣性決定力(geoPN=3 の relativeDrag.law:"inertial")・連鎖(geoPN=4)・軸保持・J と同時に ON にしない(二重の引きずり —— 受理で拒否)', where: 'coord3dDenyOf', gate: '組の拒否の試験' },
  { area: '診断', what: 'mechSpectrum の 3D は別(拒否のまま)・HUD の u・curl の読み口は 3 成分', where: 'coord3dDenyOf の overlays', gate: '—' },
  { area: 'QA', what: 'behavior(3D の步の退化 = 2D の步・回転共変・口座・初回の履歴・門)と docs(正本・文書)・root の部分 QA', where: 'tests/qa.mjs', gate: '部分 QA + フルゲート' },
  { area: '鎖', what: '步の関数(dfmCore3・dfmStep3)と受理の門の変更 —— ほぼ全段の鎖(AN481)', where: 'tools/regen-plan.mjs', gate: '鎖 1 回' },
  { area: '本', what: '平面の写し(galaxyGeo2 の 3D の新しい ID —— z = 0)→ 全体を傾けた円盤 → 有限厚(過渡の増速と定常の回転曲線を分けて測る)', where: '第322便〜(新しい ID)', gate: '平面の写しの外縁の比 = この正本の base(同じビットか差の出どころ)' }]);

/* ───────── 門(正本から作り直せる)───────── */
export function gatesOf(J) {
  const b = J.parts.base, dg = J.parts.degen, d3 = J.parts.d3, cv = J.parts.cov, fl = J.parts.field, hi = J.parts.hist, lg = J.parts.ledger;
  return {
    baseInWindow: !!(b && (J.quick ? true : b.inWindow)), baseClampZero: !!(b && b.clampZero), baseFrozen: !!(b && (J.quick ? true : b.sameAsFrozen === true && (b.rows.h2 === null || b.sameAsFrozenH2 === true))),
    degenSame: !!(dg && dg.allSame && dg.rows.every((r) => r.zMax === 0 && r.LzRel === 0)),
    degenScope: !!(dg && dg.rows.every((r) => r.scopeOk && r.law === 'vMinusU-q')),
    d3Same: !!(d3 && d3.allSame && d3.rows.every((r) => r.coord3d && r.nonPlanar)),
    d3GatesNow: !!(d3 && d3.gates.denySmallGeo2.includes('kFrame') && d3.gates.denySmallGeo2.includes('geoPN12') && d3.gates.runtimeNone === null && d3.gates.runtimeKFrame !== null && d3.gates.runtimeGeoPN2 !== null && d3.gates.accepted3d === false),
    covariant: !!(cv && cv.maxRel <= 1e-12),
    fieldStatic: !!(fl && fl.static.pass), fieldUniform: !!(fl && fl.uniform.pass), fieldRigid: !!(fl && fl.rigid.pass), fieldShell: !!(fl && fl.shell.pass), fieldFd: !!(fl && fl.fd.pass),
    histFirst: !!(hi && hi.pass), ledger: !!(lg && lg.pass) };
}

/* ───────── 実行 ───────── */
async function main() {
  const quick = process.env.W321A_QUICK === '1', outRel = process.env.W321A_OUT || OUT_GEO2V3;
  if (quick && !process.env.W321A_OUT) throw new Error('W321A_QUICK=1 には W321A_OUT が要る(正本を書かない)');
  const plan = quick ? QUICK : PLAN, workers = Math.max(1, Number(process.env.W321A_WORKERS || 2));
  const parts = String(process.env.W321A_PART || 'base,degen,d3,cov,field,hist,ledger').split(',').filter(Boolean);
  const html = path.join(ROOT, TARGET), targetSha256 = crypto.createHash('sha256').update(fs.readFileSync(html)).digest('hex');
  const { HP } = loadHtmlMain(html);
  const outAbs = path.isAbsolute(outRel) ? outRel : path.join(ROOT, outRel);
  const prev = (process.env.W321A_PART && fs.existsSync(outAbs)) ? JSON.parse(fs.readFileSync(outAbs, 'utf8')) : null;
  const t0 = Date.now(), timing = {};
  const out = { version: HARNESS_VERSION, libVersion: G3.GEO2V3_VERSION, generator: 'tests/exp-w321a-geo2v3.mjs', quick, plan: clone(plan), target: TARGET, targetSha256,
    ruling: '原仮定者の予定(第123報)・統括の検証項目 R266', parts: (prev && prev.parts) || {}, sourceLines: clone(G3.GEO2V3_SOURCE_LINES), limits: clone(G3.GEO2V3_LIMITS), s2Plan: clone(S2_PLAN), notClaim: NOT_CLAIM };
  const RUN = { base: () => partBase(HP, plan, workers), degen: () => partDegen(HP, plan), d3: () => part3D(HP, plan), cov: () => partCov(plan), field: () => partField(plan), hist: () => partHist(HP, plan), ledger: () => partLedger(plan) };
  for (const k of parts) { if (!RUN[k]) continue; const t = Date.now(); out.parts[k] = await RUN[k](); timing[k] = { wallSec: (Date.now() - t) / 1000 }; console.log(new Date().toISOString().slice(11, 19), 'part', k, timing[k].wallSec + ' s'); }
  out.timing = timing; out.elapsedS = (Date.now() - t0) / 1000;
  out.gates = gatesOf(out); out.ok = Object.values(out.gates).every(Boolean);
  const CODE = ['tests/exp-w321a-geo2v3.mjs', 'tests/lib-w321a-geo2v3.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第321便a', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, stage: 'geo2v3', parts: Object.keys(out.parts), ruling: '原仮定者の予定(第123報)「geoPN=2の予定: 3D対応する。現状、最も銀河を再現しているのがgalaxyGeo2であり、引きずり近似としての需要が有る」',
    reading: '統括の検証項目 R266(geoPN=2 の 3D の S1 —— 3 成分の純関数・退化・回転共変・解析の場・初回の履歴・galaxyGeo2 の 2D の基準・S2 の設計)',
    engine: 'Node の主コンテキスト(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行)・base の h/2 の行は子プロセス 1 本(W321A_WORKERS ≥ 2)', notClaim: NOT_CLAIM });
  Object.assign(out.meta, w281aScopeStamp(html, REGEN_SCOPE), w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(outAbs), { recursive: true });
  fs.writeFileSync(outAbs, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, outAbs), out.elapsedS + ' s', 'ok', out.ok, JSON.stringify(out.gates));
}
if (IS_MAIN) {
  const bi = process.argv.indexOf('--base-row');
  if (bi > 0) {
    const [dt, steps, mid] = process.argv.slice(bi + 1, bi + 4).map(Number);
    const { HP } = loadHtmlMain(path.join(ROOT, TARGET));
    console.log(JSON.stringify(baseRow(HP, dt, steps, mid)));
  } else await main();
}
