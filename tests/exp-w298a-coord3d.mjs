// 第298便a(原仮定者の裁定(第88報)「三次元座標化する。右手系。サンプルごとの選択。二次元の設定に Z の位置・速度が入っていたら警告。
// 三次元では自転軸の傾きを粒子ごとに有効化・歳差にも対応」・統括の検証項目 R165)—— **三次元座標の土台の器**(Node だけ —— 対象 html の
// inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、エンジン本体を走らせる。1 プロセス)。
//
// ■ 何を測るか(零試験は「同じか」の照合・数は値の記録 —— 物理の合否は書かない)
//   ① 零試験: 全粒子 z=vz=0・軸 +z の三次元の走行と、同じ本の二次元の走行の全状態(x・y・vx・vy・spin・rotA・radE・t)のビット一致
//      (a 二体 semi / b 二体 leapfrog / c 接触の塊 γn>0〔二次元は generic の対ループ〕/ d 🐌 の写し〔慣性決定力の並進 n=2 の展開形〕/
//       e 3 体の慣性決定力〔直接法〕/ f 🔗 の写し〔spinSource を外す —— PCG〕/ g stateCarry:"double" の二体)。違えば差の大きさを記録。
//   ② 共変: 非平面の 3 体(自転軸を 1 粒子有効化・歳差つき)を任意の回転 R で回した初期条件の走行と、元の走行を R で回した状態の差
//      (既定 Float32 の状態と stateCarry:"double" の状態の 2 通り —— 差は状態の丸めの大きさ)。
//   ③ 保存: 傾いた二体と非平面 3 体の P・L(3 成分 —— 自転 I s â と宣言した歳差の拘束の帳簿を含む)・E の相対のずれ。
//   ④ 拒否: COORD3D_REJECTED の各項目を 1 つずつ立てた三次元の JSON が受理で拒否されること・走行中の編集(kFrame=1)で步が止まること。
//   ⑤ 二次元の Z の警告: z(0 も)/vz/spinAxis.enable/群の incl を持つ二次元の JSON の警告 coord2dZ・値が残ること・走行が鍵なしとビット同一。
//   ⑥ 軸と歳差: 宣言の軸(傾き・方位)と歳差の解析値との差・|â|・傾きの保存・L+拘束の帳簿の保存。
//   ⑦ 保存往復: 受理 → JSON → 受理 で署名が同じ・二次元の双子と署名が違う・軸の傾きを変えると署名が変わる・A/B の複製とチェックポイントの復元。
//   ⑧ 新本: 🌐 coord3dKeplerTilt(傾いた軌道面の楕円 —— 軌道面の位相で数えた周期・軌道面の法線の向きのずれ)と
//      🎲 coord3dSpinPrecess(自転軸を 1 粒子だけ有効化して歳差させる本 —— 軸の解析値との差)。
//
// ■ しないこと・言わないこと
//   ・三次元の慣性決定力 3 成分(回転引きずり・軸引きずり)は第 2 段の仕事 —— 本器は並進だけを測る。トルクから求める歳差は作らない。
//   ・現実の軌道との一致は主張しない(原理の本 —— 観測の転写はしない)。
//
// 実行(Node だけ・Chromium 不要):
//   node tests/exp-w298a-coord3d.mjs            → 正本 tests/out/coord3d-w298a.json(W298A_OUT で出力先を変える)
// 読む正本: なし(html だけ)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
const REGEN_SCOPE = {"presets":"all","roots":["$","DT","HP.MODE_SAVE_WARN_CODES","HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.loadPreset","HP.modeSettingIssues","HP.sim","HP.timeStd","HP.validatePreset","T","_monCls","_ooLast","ab","applyLang","applyQLock","applySkin","applyUiScale","bgSourcesBodyCheck","buildParamRows","ch","ckRestoreOne","ckSnapOne","cloneSimState","coord2dZKeysOf","coord3dDenyOf","coord3dPlace","coord3dPrepare","coord3dRuntimeWhy","coord3dState","coord3dTotals","coreFieldInitState","ctx","cv","cw","dfmCore3","dfmCoreFieldStep","dfmInertialDragStep3","dfmMeshVelocityStep","dfmStep3","dpr","drawEmergence","drawOrbitObs","drawSpaceLinesOn","emHist","emTick","fitCondInputsOf","geo3InitVelocity","isNum","lcAfterStep","lcReset","liveCmp","loadPreset","makeSim","meshVelocityPrepare","modeIssuesOf","panelContentChanged","paramRowSync","pmCells","pmRender","presetSigHash","qLockCalc","render","renderCustomList","renderHelp","renderSaves","resizeCanvas","setCanvasSkin","setSkin","showFirstVisit","sim","spinAxisOf","syncPanelWideReserve","tempP90EMA","updateAbQuickRow","validateMeshVelocity","validatePreset"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w298a-coord3d-1';
export const BOOKS = Object.freeze({ kepler: 'coord3dKeplerTilt', spin: 'coord3dSpinPrecess' });
const TARGET = 'beta/index.html';
const DT = 0.016;
const clone = (x) => JSON.parse(JSON.stringify(x));
const sci = (v) => (Number.isFinite(v) ? Number(v.toPrecision(6)) : v);
const find = (HP, id) => HP.allPresets().find((q) => q.id === id);

/* ── 本を作る(受理を通した本 → 新しい sim で build)── */
function simOf(HP, preset) {
  const v = HP.validatePreset(preset);
  if (!v.ok) throw new Error('受理されない: ' + JSON.stringify(v.errors).slice(0, 300));
  const S = HP.coord3d.makeSim(); S.build(clone(v.preset));
  return { S, v };
}
/** 内蔵の本(受理を通さない —— アプリの loadPreset と同じ build)を写して sim を作る */
function simOfBuiltin(HP, id, mut) {
  const p = clone(find(HP, id));
  if (mut) mut(p);
  const S = HP.coord3d.makeSim(); S.build(p);
  return S;
}
const KEYS = ['x', 'y', 'vx', 'vy', 'spin', 'rotA'];
function compare(S2, S3) {
  let nDiff = 0, nVal = 0, maxAbs = 0;
  for (const k of KEYS) for (let i = 0; i < S2.n; i++) { nVal++; const a = S2[k][i], b = S3[k][i]; if (!Object.is(a, b)) { nDiff++; maxAbs = Math.max(maxAbs, Math.abs(a - b)); } }
  for (const k of ['t', 'radE', 'clampVN', 'clampSN']) { nVal++; if (!Object.is(S2[k], S3[k])) { nDiff++; maxAbs = Math.max(maxAbs, Math.abs(S2[k] - S3[k])); } }
  let zMax = 0; for (let i = 0; i < S3.n; i++) zMax = Math.max(zMax, Math.abs(S3.z[i]), Math.abs(S3.vz[i]));
  return { nVal, nDiff, maxAbs, same: nDiff === 0, zMax };
}
function base2(coord, extra) {
  const ph = Object.assign({ G: 1, D0: 2, kFrame: 0, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, etaRad: 0, geoPN: 0, softening: 0.05, radiusScale: 1, cLight: 30 }, coord ? { coord } : {});
  return Object.assign({ name: 'w298a', description: 'w298a', sampleClass: 'principle', camera: { scale: 100 }, world: { boundary: 'none', size: 0 },
    physics: ph, bodies: [{ type: 'single', m: 10, x: 0, y: 0, vx: 0, vy: -0.074, spin: 0, pinned: false, radius: 1 },
      { type: 'single', m: 1, x: 20, y: 0, vx: 0, vy: 0.74, spin: 0.3, pinned: false, radius: 0.5 }] }, extra || {});
}

/* ───────── ① 零試験 ───────── */
function part1(HP) {
  const out = {};
  const run = (name, mk2, mk3, steps) => {
    const S2 = mk2(), S3 = mk3();
    for (let k = 0; k < steps; k++) { S2.step(DT); S3.step(DT); }
    out[name] = Object.assign({ steps, coord3d: S3.coord3d === true, coord2d: S2.coord3d !== true }, compare(S2, S3));
  };
  const two = (c, o) => simOf(HP, (() => { const p = base2(c); if (o) o(p); return p; })()).S;
  run('a_twoBodySemi', () => two(null), () => two('3d'), 3000);
  run('b_twoBodyLeapfrog', () => two(null, (p) => { p.integrator = 'leapfrog'; }), () => two('3d', (p) => { p.integrator = 'leapfrog'; }), 3000);
  // c: 接触の塊(γn=0.4・muF=0 —— 二次元は generic の対ループ・接近時の法線減衰インパルス)
  const blob = (c) => { const p = base2(c); p.physics.gammaN = 0.4; p.bodies = [];
    for (let i = 0; i < 8; i++) { const a = 2 * Math.PI * i / 8; p.bodies.push({ type: 'single', m: 1 + 0.1 * i, x: 1.6 * Math.cos(a), y: 1.6 * Math.sin(a), vx: -0.2 * Math.cos(a), vy: -0.2 * Math.sin(a), spin: 0, pinned: false, radius: 0.8 }); }
    return simOf(HP, p).S; };
  run('c_contactGammaN', () => blob(null), () => blob('3d'), 1500);
  run('c2_contactLeapfrog', () => { const S = blob(null); S.integrator = 'leapfrog'; return S; }, () => { const S = blob('3d'); S.integrator = 'leapfrog'; return S; }, 1500);
  // d: 🐌 の写し(慣性決定力の並進・n=2 の展開形・stateCarry/massPrecision double)
  run('d_inertialPair', () => simOfBuiltin(HP, 'inertialDragPair'), () => simOfBuiltin(HP, 'inertialDragPair', (p) => { p.physics.coord = '3d'; }), 3000);
  // e: 3 体の慣性決定力(直接法・solveFrom history も)
  const tri = (c, hist) => { const p = base2(c); p.physics.relativeDrag = Object.assign({ law: 'inertial', gain: 2, pairs: 'all' }, hist ? { solveFrom: 'history' } : {});
    p.bodies.push({ type: 'single', m: 0.5, x: -30, y: 5, vx: 0.1, vy: -0.5, spin: 0, pinned: false, radius: 0.4 }); return simOf(HP, p).S; };
  run('e_inertialThreeDirect', () => tri(null, false), () => tri('3d', false), 2000);
  run('e2_inertialThreeHistory', () => tri(null, true), () => tri('3d', true), 2000);
  // f: 🔗 の写し(spinSource を外す —— n=81 で PCG)
  const chain = (c) => simOfBuiltin(HP, 'chainDiskToy', (p) => { const rd = Object.assign({}, p.physics.relativeDrag); delete rd.spinSource; p.physics.relativeDrag = rd; if (c) p.physics.coord = c; });
  run('f_chainPCG', () => chain(null), () => chain('3d'), 200);
  // g: stateCarry:"double"(補償和)
  run('g_stateCarryDouble', () => two(null, (p) => { p.physics.stateCarry = 'double'; }), () => two('3d', (p) => { p.physics.stateCarry = 'double'; }), 3000);
  out.allSame = Object.values(out).every((r) => r.same === true);
  return out;
}

/* ───────── ② 共変 ───────── */
function rotMat(a, b, c) {   // R = Rz(c)·Ry(b)·Rx(a)
  const ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b), cc = Math.cos(c), sc = Math.sin(c);
  const Rx = [[1, 0, 0], [0, ca, -sa], [0, sa, ca]], Ry = [[cb, 0, sb], [0, 1, 0], [-sb, 0, cb]], Rz = [[cc, -sc, 0], [sc, cc, 0], [0, 0, 1]];
  const mm = (A, B) => A.map((r, i) => B[0].map((_, j) => r.reduce((s, _, k) => s + A[i][k] * B[k][j], 0)));
  return mm(Rz, mm(Ry, Rx));
}
const mv = (R, v) => [R[0][0] * v[0] + R[0][1] * v[1] + R[0][2] * v[2], R[1][0] * v[0] + R[1][1] * v[1] + R[1][2] * v[2], R[2][0] * v[0] + R[2][1] * v[1] + R[2][2] * v[2]];
const toAngles = (u) => { const t = Math.acos(Math.max(-1, Math.min(1, u[2]))) * 180 / Math.PI, a = Math.atan2(u[1], u[0]) * 180 / Math.PI; return [t, a]; };
function threeBody(R, carry) {
  const B = [{ m: 10, r: [0, 0, 0], v: [0, 0, 0.02], s: 0.2 }, { m: 1, r: [18, 0, 3], v: [0, 0.7, 0.15], s: 0.4, ax: [30, 40], pr: 0.05 }, { m: 0.8, r: [-6, 25, -2], v: [-0.55, 0, 0.1], s: -0.1 }];
  const p = base2('3d'); if (carry) p.physics.stateCarry = 'double';
  p.bodies = B.map((b) => { const r = mv(R, b.r), v = mv(R, b.v);
    const o = { type: 'single', m: b.m, x: r[0], y: r[1], z: r[2], vx: v[0], vy: v[1], vz: v[2], spin: b.s, pinned: false, radius: 0.5 };
    if (b.ax) { const u = mv(R, HPg.coord3d.axisUnit(b.ax[0], b.ax[1])), pz = mv(R, [0, 0, 1]); const [t, a] = toAngles(u), [pt, pa] = toAngles(pz);
      o.spinAxis = { enable: true, tiltDeg: t, azimuthDeg: a, precessionRate: b.pr, precessAxis: { tiltDeg: pt, azimuthDeg: pa }, source: 'w298a 器の宣言(共変の試験)' }; }
    return o; });
  return p;
}
let HPg = null, GG = globalThis;   // HP と html の最上位の名前の置き場(loadHtmlMain は globalThis・QA の loadHtmlHeadless は ctx)
function part2(HP) {
  const R = rotMat(0.7, -0.4, 1.9), I = [[1, 0, 0], [0, 1, 0], [0, 0, 1]], steps = 3000, out = {};
  for (const carry of [false, true]) {
    const A = simOf(HP, threeBody(I, carry)).S, Bs = simOf(HP, threeBody(R, carry)).S;
    for (let k = 0; k < steps; k++) { A.step(DT); Bs.step(DT); }
    let dr = 0, dv = 0, da = 0, rs = 0, vs = 0;
    for (let i = 0; i < A.n; i++) {
      const ra = mv(R, [A.x[i], A.y[i], A.z[i]]), va = mv(R, [A.vx[i], A.vy[i], A.vz[i]]), aa = mv(R, [A.sax[i], A.say[i], A.saz[i]]);
      dr = Math.max(dr, Math.hypot(ra[0] - Bs.x[i], ra[1] - Bs.y[i], ra[2] - Bs.z[i])); dv = Math.max(dv, Math.hypot(va[0] - Bs.vx[i], va[1] - Bs.vy[i], va[2] - Bs.vz[i]));
      if (A.saOn[i]) da = Math.max(da, Math.hypot(aa[0] - Bs.sax[i], aa[1] - Bs.say[i], aa[2] - Bs.saz[i]));   // 有効化した軸だけ(有効化していない粒子の軸は定義で +z —— 回しても +z のまま)
      rs = Math.max(rs, Math.hypot(A.x[i], A.y[i], A.z[i])); vs = Math.max(vs, Math.hypot(A.vx[i], A.vy[i], A.vz[i]));
    }
    out[carry ? 'double' : 'float32'] = { steps, R: R.map((r) => r.map(sci)), maxDr: sci(dr), maxDv: sci(dv), maxDaxis: sci(da), relDr: sci(dr / rs), relDv: sci(dv / vs),
      arrayType: A.x.constructor.name };
  }
  return out;
}

/* ───────── ③ 保存 ───────── */
function drift(S, steps, ledger) {
  const T0 = HPg.coord3d.totals(S);
  const L0 = T0.L.map((v, k) => v + T0.prescL[k]);
  let maxP = 0, maxL = 0, maxE = 0;
  const Ls = Math.hypot(...L0), Ps = (() => { let s = 0; for (let i = 0; i < S.n; i++) s += S.m[i] * Math.hypot(S.vx[i], S.vy[i], S.vz[i]); return s; })();
  for (let k = 1; k <= steps; k++) {
    S.step(DT);
    if (k % 50) continue;
    const T = HPg.coord3d.totals(S);
    maxP = Math.max(maxP, Math.hypot(T.P[0] - T0.P[0], T.P[1] - T0.P[1], T.P[2] - T0.P[2]) / Ps);
    const L = T.L.map((v, q) => v + T.prescL[q]);
    maxL = Math.max(maxL, Math.hypot(L[0] - L0[0], L[1] - L0[1], L[2] - L0[2]) / Ls);
    maxE = Math.max(maxE, Math.abs(T.E + T.radE - T0.E - T0.radE) / Math.abs(T0.E));
  }
  return { steps, relP: sci(maxP), relL: sci(maxL), relE: sci(maxE), L0: L0.map(sci), arrayType: S.x.constructor.name, ledger: ledger || null };
}
function part3(HP) {
  const out = {};
  out.keplerTilt = drift(simOfBuiltin(HP, BOOKS.kepler), 8000);
  out.keplerTiltDouble = drift(simOfBuiltin(HP, BOOKS.kepler, (p) => { p.physics.stateCarry = 'double'; }), 8000);
  out.threeBodyAxis = drift(simOf(HP, threeBody([[1, 0, 0], [0, 1, 0], [0, 0, 1]], false)).S, 3000, '自転 I s â と歳差の拘束の帳簿 spin3PrescL を含む');
  out.threeBodyAxisDouble = drift(simOf(HP, threeBody([[1, 0, 0], [0, 1, 0], [0, 0, 1]], true)).S, 3000, '同上(stateCarry:"double")');
  return out;
}

/* ───────── ④ 拒否 ───────── */
function part4(HP) {
  const cases = {
    kFrame: (p) => { p.physics.kFrame = 1; }, kRep: (p) => { p.physics.kRep = 1; }, muF: (p) => { p.physics.muF = 0.5; }, kappaS: (p) => { p.physics.kappaS = 0.05; },
    etaRad: (p) => { p.physics.etaRad = 0.01; }, gravityXY: (p) => { p.physics.gravityX = 0.01; }, geoPN12: (p) => { p.physics.geoPN = 1; },
    geodesic: (p) => { p.physics.geodesic = true; }, geoLegacy: (p) => { p.physics.geoPN = 3; p.physics.spaceMesh = { mode: 'vertex', gravity: true }; },
    physicsOther: (p) => { p.physics.spinSpin = 1; }, relativeDragLaw: (p) => { p.physics.relativeDrag = { law: 'pairSlip', kappa: 0.1, pairs: [[0, 1]] }; },
    spinSource: (p) => { p.physics.relativeDrag = { law: 'inertial', gain: 1, pairs: 'all', spinSource: 'surfaceFlip' }; p.bodies[0].radius = 1; },
    dragCore: (p) => { p.physics.relativeDrag = { law: 'inertial', gain: 1, pairs: 'all' }; p.bodies[0].dragCore = { massFrac: 0.3, radius: 0.5 }; },
    thermal: (p) => { p.thermal = 'tint'; }, phaseChange: (p) => { p.thermal = 'tint'; p.phaseChange = { bondN: 3 }; }, fusion: (p) => { p.thermal = 'tint'; p.fusion = { dFrac: 0.35 }; },
    universeBox: (p) => { p.universeBox = { mode: 'static', D: 1 }; }, measureBox: (p) => { p.measureBox = true; p.bodies.push({ type: 'ring', n: 8, cx: 0, cy: 0, rIn: 40, rOut: 42, mMin: 0.1, mMax: 0.1, spinMin: 0, spinMax: 0, vMode: 'none', omega: 0, vNoise: 0, direction: 1, pinned: false }); },
    photonEmit: (p) => { p.photonEmit = [{ body: 0, t: 1 }]; }, rays: (p) => { p.rays = { n: 8, spread: 0.5 }; }, echoFlipAt: (p) => { p.echoFlipAt = 10; },
    capture: (p) => { p.physics.contactMode = 'none'; p.centerCapture = { version: 'w287a-capture-1', center: 0, rCap: 1.5, inertia: 'body' }; }, qLock: (p) => { p.qLock = true; }, boundary: (p) => { p.world = { boundary: 'box', size: 100 }; },
    overlays: (p) => { p.overlays = { field: true }; }, core: (p) => { p.bodies[0].core = { mode: 'differential', massFrac: 0.3, radius: 0.5, omega: 1 }; },
    layers: (p) => { p.bodies[0].layers = [{ role: 'core', m: 5, r: 0.5 }, { role: 'shell', m: 5, r: 1 }]; }, pulse: (p) => { p.bodies[0].pulse = { omega: 1, source: 'observed' }; },
    spinDipole: (p) => { p.bodies[0].spinDipole = { omega: 1, radius: 1, source: 'declared' }; }, tide: (p) => { p.bodies[0].tide = { k2: 0.3, lag: 0.01 }; },
    zonal: (p) => { p.bodies[0].zonal = { refR: 1, J: { 2: 0.001 } }; }, testParticle: (p) => { p.bodies[1].testParticle = true; },
    rail: (p) => { p.bodies[0].pinned = true; p.bodies[0].railOmega = 0.1; }, lightSweepAuto: (p) => { p.bodies[0].lightSweep = 'auto'; },
    dragQ: (p) => { p.bodies[0].dragQ = 3; }, densityClass: (p) => { p.bodies[0].densityClass = 'solid'; },
    spinAxisDisplay: (p) => { p.bodies[1].spinAxis = { tiltDeg: 30, source: 'w298a' }; },
    vModeEq: (p) => { p.bodies.push({ type: 'disk', n: 8, cx: 0, cy: 0, radius: 40, mMin: 0.01, mMax: 0.01, spinMin: 0, spinMax: 0, vMode: 'virial', vScale: 1, direction: 1 }); } };
  const rows = [];
  for (const key of HP.coord3d.rejected) {
    const f = cases[key];
    if (!f) { rows.push({ key, tested: false }); continue; }
    const p = base2('3d'); f(p);
    const v = HP.validatePreset(p);
    const d = v.ok ? [] : (v.errors || []).filter((e) => /三次元\(physics\.coord:"3d"\)では未対応/.test(e));
    rows.push({ key, tested: true, rejected: !v.ok && d.length > 0, otherErrors: v.ok ? [] : (v.errors || []).filter((e) => d.indexOf(e) < 0).slice(0, 2) });
  }
  // box の incl は拒否ではなく、受理器が警告して落とす(面内に置く)
  const pb = base2('3d'); pb.bodies.push({ type: 'box', n: 4, cx: 0, cy: 60, w: 5, h: 5, mMin: 0.01, mMax: 0.01, spinMin: 0, spinMax: 0, vScale: 0, incl: 20 });
  const vb = HP.validatePreset(pb);
  const boxTiltDropped = vb.ok && (vb.warnings || []).some((w) => /incl は ring\/disk 専用/.test(w)) && vb.preset.bodies[2].incl === undefined;
  // 走行中の編集(kFrame=1)で步が止まる
  const S = simOf(HP, base2('3d')).S; for (let k = 0; k < 10; k++) S.step(DT);
  const t0 = S.t; S.params.kFrame = 1; S.step(DT); const halt = { tBefore: t0, tAfter: S.t, stopped: S.t === t0, why: S.coord3dHalt };
  S.params.kFrame = 0; S.step(DT); halt.resumed = S.t > t0 && S.coord3dHalt === null;
  return { rows, nRejected: rows.filter((r) => r.rejected).length, nTested: rows.filter((r) => r.tested).length,
    allRejected: rows.every((r) => r.tested && r.rejected), boxTiltDropped, runtimeHalt: halt };
}

/* ───────── ⑤ 二次元の Z の警告 ───────── */
function part5(HP) {
  const p = base2(null); p.bodies[0].z = 0; p.bodies[1].vz = 0.05; p.bodies[1].spinAxis = { enable: true, tiltDeg: 30, source: 'w298a' };
  p.bodies.push({ type: 'ring', n: 6, cx: 0, cy: 0, rIn: 50, rOut: 52, mMin: 0.001, mMax: 0.001, spinMin: 0, spinMax: 0, vMode: 'kepler', aroundMass: 11, omega: 0, vNoise: 0, direction: 1, pinned: false, incl: 20 });
  const v = HP.validatePreset(p);
  const mi = HP.modeSettingIssues(v.preset.physics, { bodies: v.preset.bodies });
  const zi = mi.find((z) => z.code === 'coord2dZ');
  const kept = { z0: v.preset.bodies[0].z, vz1: v.preset.bodies[1].vz, enable: v.preset.bodies[1].spinAxis && v.preset.bodies[1].spinAxis.enable, incl: v.preset.bodies[2].incl };
  // 走行は二次元のまま(鍵なしの本とビット同一)
  const q = clone(p); delete q.bodies[0].z; delete q.bodies[1].vz; delete q.bodies[1].spinAxis; delete q.bodies[2].incl;
  const A = simOf(HP, p).S, B = simOf(HP, q).S;
  for (let k = 0; k < 1000; k++) { A.step(DT); B.step(DT); }
  const cmpAB = (() => { let nd = 0; for (const k of KEYS) for (let i = 0; i < A.n; i++) if (!Object.is(A[k][i], B[k][i])) nd++; return nd; })();
  const codes = HP.MODE_SAVE_WARN_CODES;
  return { ok: v.ok, warnCount: (v.warnings || []).filter((w) => /Z の宣言/.test(w)).length, issue: zi ? { code: zi.code, kind: zi.kind, keys: zi.keys } : null,
    kept, run2dSameAsNoKeys: cmpAB === 0, coord3dFlag: A.coord3d === true, zArray: A.z === null,
    codesLength: codes.length, lastCode: codes[codes.length - 1],
    noIssueIn3d: !HP.modeSettingIssues(Object.assign({}, v.preset.physics, { coord: '3d' }), { bodies: v.preset.bodies }).some((z) => z.code === 'coord2dZ') };
}

/* ───────── ⑥ 軸と歳差 ───────── */
function part6(HP) {
  const tilt = 30, az = 40, rate = 0.05, pt = 20, pa = -60;
  const p = base2('3d'); p.bodies[1].spinAxis = { enable: true, tiltDeg: tilt, azimuthDeg: az, precessionRate: rate, precessAxis: { tiltDeg: pt, azimuthDeg: pa }, source: 'w298a 器の宣言' };
  const S = simOf(HP, p).S;
  const u0 = HP.coord3d.axisUnit(tilt, az), k = HP.coord3d.axisUnit(pt, pa);
  const cosT0 = u0[0] * k[0] + u0[1] * k[1] + u0[2] * k[2];
  const T0 = HP.coord3d.totals(S), Ls0 = T0.L.map((v, q) => v + T0.prescL[q]);
  let maxErr = 0, maxNorm = 0, maxCone = 0;
  for (let n = 1; n <= 4000; n++) {
    S.step(DT);
    const want = HP.coord3d.rot(k[0], k[1], k[2], rate * S.t, u0[0], u0[1], u0[2]);
    const a = [S.sax[1], S.say[1], S.saz[1]];
    maxErr = Math.max(maxErr, Math.hypot(a[0] - want[0], a[1] - want[1], a[2] - want[2]));
    maxNorm = Math.max(maxNorm, Math.abs(Math.hypot(...a) - 1));
    maxCone = Math.max(maxCone, Math.abs(a[0] * k[0] + a[1] * k[1] + a[2] * k[2] - cosT0));
  }
  const T1 = HP.coord3d.totals(S), Ls1 = T1.L.map((v, q) => v + T1.prescL[q]);
  const st = HP.coord3d.state(S);
  // 歳差なし(precessionRate 省略)の軸は動かない
  const p0 = base2('3d'); p0.bodies[1].spinAxis = { enable: true, tiltDeg: tilt, azimuthDeg: az, source: 'w298a' };
  const S0 = simOf(HP, p0).S; for (let n = 0; n < 500; n++) S0.step(DT);
  return { tiltDeg: tilt, azimuthDeg: az, precessionRate: rate, precessAxis: [pt, pa], steps: 4000, t: sci(S.t),
    maxAxisErr: sci(maxErr), maxNormErr: sci(maxNorm), maxConeErr: sci(maxCone),
    LplusLedgerDrift: sci(Math.hypot(Ls1[0] - Ls0[0], Ls1[1] - Ls0[1], Ls1[2] - Ls0[2]) / Math.hypot(...Ls0)), prescL: T1.prescL.map(sci),
    displayAxis: st.axes[0] ? { tiltDeg: sci(st.axes[0].tiltDeg), azimuthDeg: sci(st.axes[0].azimuthDeg) } : null,
    staticAxisUnchanged: S0.sax[1] === u0[0] && S0.say[1] === u0[1] && S0.saz[1] === u0[2],
    spinAxisOfIs3d: (() => { HP.loadPreset(BOOKS.spin, false); const i = HP.sim.saOn ? Array.from(HP.sim.saOn).indexOf(1) : -1; const r = i >= 0 ? GG.spinAxisOf(HP.sim, i) : null; return !!(r && r.coord === '3d' && r.projX === HP.sim.sax[i]); })() };
}

/* ───────── ⑦ 保存往復・A/B・チェックポイント ───────── */
function part7(HP) {
  const sig = (p) => GG.presetSigHash(p);
  const p3 = clone(find(HP, BOOKS.spin)), v = HP.validatePreset(p3), rt = HP.validatePreset(JSON.parse(JSON.stringify(v.preset)));
  const twin = clone(p3); delete twin.physics.coord;
  const tilted = clone(p3); const sb = tilted.bodies.find((b) => b.spinAxis && b.spinAxis.enable); sb.spinAxis.tiltDeg += 1;
  const out = { roundTripSame: sig(v.preset) === sig(rt.preset), sig3d: sig(p3), sig2dTwin: sig(twin), differsFrom2d: sig(p3) !== sig(twin), axisInSig: sig(tilted) !== sig(p3),
    fitCondHasCoord: (() => { const q = GG.fitCondInputsOf(v.preset, HP.sim.params); return q.physics.coord === '3d'; })() };
  // A/B の複製(cloneSimState)とチェックポイント(ckSnapOne/ckRestoreOne)—— 同じ瞬間から同じ步数で全状態ビット同一
  HP.loadPreset(BOOKS.spin, false);
  for (let k = 0; k < 300; k++) HP.sim.step(HP.timeStd.appStepDt(HP.sim));
  const B = GG.cloneSimState();
  const snap = GG.ckSnapOne(HP.sim);
  const dt = HP.timeStd.appStepDt(HP.sim);
  const fp = (S) => { const a = []; for (const k of ['x', 'y', 'z', 'vx', 'vy', 'vz', 'spin', 'sax', 'say', 'saz']) for (let i = 0; i < S.n; i++) a.push(S[k][i]); a.push(S.t, ...S.spin3PrescL); return a; };
  for (let k = 0; k < 300; k++) { HP.sim.step(dt); B.step(dt); }
  const fA = fp(HP.sim), fB = fp(B);
  out.abClone = { coord3d: B.coord3d === true, same: fA.length === fB.length && fA.every((x, i) => Object.is(x, fB[i])) };
  GG.ckRestoreOne(HP.sim, snap);
  for (let k = 0; k < 300; k++) HP.sim.step(dt);
  const fC = fp(HP.sim);
  out.checkpoint = { same: fA.every((x, i) => Object.is(x, fC[i])) };
  return out;
}

/* ───────── ⑧ 新本 ───────── */
function part8(HP) {
  const out = {};
  const kepler = (half) => {   // 🌐 傾いた軌道面の楕円: 軌道面の位相で数えた同方向 1 周の周期(線形内挿)・軌道面の法線のずれ・近点距離と遠点距離(half: 刻み 1/2)
    const S = simOfBuiltin(HP, BOOKS.kepler), p = find(HP, BOOKS.kepler), dt = p.physics.stepDt / (half ? 2 : 1);
    const B = HP.coord3d.planeOf(S, 0, 1), n0 = B.n.slice();
    const mu = S.params.G * (S.m[0] + S.m[1]);
    const r0 = HP.coord3d.relInPlane(S, 0, 1, B), rr0 = Math.hypot(r0[0], r0[1]), v2 = r0[2] * r0[2] + r0[3] * r0[3], a = 1 / (2 / rr0 - v2 / mu), Pk = 2 * Math.PI * Math.sqrt(a * a * a / mu);
    let acc = 0, th = Math.atan2(r0[1], r0[0]), revT = [], rMin = Infinity, rMax = 0, maxTilt = 0;
    const steps = Math.ceil(8.2 * Pk / dt);
    for (let k = 1; k <= steps; k++) {
      S.step(dt);
      const q = HP.coord3d.relInPlane(S, 0, 1, B), r = Math.hypot(q[0], q[1]), t2 = Math.atan2(q[1], q[0]);
      let d = t2 - th; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
      const prev = acc; acc += d; th = t2;
      if (Math.floor(Math.abs(acc) / (2 * Math.PI)) > Math.floor(Math.abs(prev) / (2 * Math.PI))) { const tg = Math.sign(acc) * Math.floor(Math.abs(acc) / (2 * Math.PI)) * 2 * Math.PI; revT.push((k - 1 + (tg - prev) / (acc - prev)) * dt); }
      rMin = Math.min(rMin, r); rMax = Math.max(rMax, r);
      const Bn = HP.coord3d.planeOf(S, 0, 1); maxTilt = Math.max(maxTilt, Math.acos(Math.max(-1, Math.min(1, Bn.n[0] * n0[0] + Bn.n[1] * n0[1] + Bn.n[2] * n0[2]))));
    }
    const per = revT.map((t, i) => t - (i ? revT[i - 1] : 0)).slice(1);
    const pm = per.reduce((s, x) => s + x, 0) / per.length;
    return { id: BOOKS.kepler, dt, steps, inclDeg: sci(Math.acos(n0[2]) * 180 / Math.PI), aOsc: sci(a), pKepler: sci(Pk), revs: revT.length,
      periodMean: sci(pm), periodRelDiff: sci((pm - Pk) / Pk), eProxy: sci((rMax - rMin) / (rMax + rMin)), planeNormalDriftDeg: sci(maxTilt * 180 / Math.PI), timeRefP: p.timeRef ? p.timeRef.pRef : null };
  };
  out.kepler = kepler(false); out.keplerHalf = kepler(true);
  {   // 🎲 自転軸の歳差: 解析値との差・傾きの保存
    const S = simOfBuiltin(HP, BOOKS.spin), p = find(HP, BOOKS.spin), dt = p.physics.stepDt;
    const i = Array.from(S.saOn).indexOf(1), sa = p.bodies[i].spinAxis, u0 = HP.coord3d.axisUnit(sa.tiltDeg, sa.azimuthDeg);
    let maxErr = 0, maxTiltDev = 0;
    for (let k = 1; k <= 3600; k++) {
      S.step(dt);
      const w = HP.coord3d.rot(0, 0, 1, sa.precessionRate * S.t, u0[0], u0[1], u0[2]);
      maxErr = Math.max(maxErr, Math.hypot(S.sax[i] - w[0], S.say[i] - w[1], S.saz[i] - w[2]));
      maxTiltDev = Math.max(maxTiltDev, Math.abs(Math.acos(Math.max(-1, Math.min(1, S.saz[i]))) * 180 / Math.PI - sa.tiltDeg));
    }
    const azNow = Math.atan2(S.say[i], S.sax[i]) * 180 / Math.PI;
    out.spin = { id: BOOKS.spin, body: i, dt, steps: 3600, t: sci(S.t), tiltDeg: sa.tiltDeg, precessionRate: sa.precessionRate, maxAxisErr: sci(maxErr), maxTiltDevDeg: sci(maxTiltDev),
      azimuthNowDeg: sci(azNow), azimuthWantDeg: sci(((sa.azimuthDeg + sa.precessionRate * S.t * 180 / Math.PI + 180) % 360 + 360) % 360 - 180) };
  }
  return out;
}

/** 全部を測る(器の本体と QA が同じ関数を呼ぶ)。HP = html の HP・G = html の最上位の名前の置き場(関数宣言が載るオブジェクト) */
export function runAll(HP, G) {
  HPg = HP; GG = G || globalThis;
  const r1 = part1(HP), r2 = part2(HP), r3 = part3(HP), r4 = part4(HP), r5 = part5(HP), r6 = part6(HP), r7 = part7(HP), r8 = part8(HP);
  const gates = {
    zeroTestBitSame: r1.allSame === true,
    rejectAll: r4.allRejected === true && r4.boxTiltDropped === true && r4.runtimeHalt.stopped === true && r4.runtimeHalt.resumed === true,
    zWarn: r5.ok === true && !!r5.issue && r5.run2dSameAsNoKeys === true && r5.kept.z0 === 0 && r5.noIssueIn3d === true,
    axisExact: r6.maxAxisErr <= 1e-12 && r6.maxNormErr <= 1e-12 && r6.staticAxisUnchanged === true,
    saveRoundTrip: r7.roundTripSame && r7.differsFrom2d && r7.axisInSig && r7.abClone.same && r7.checkpoint.same,
    covariantDouble: r2.double.relDr <= 1e-9 && r2.double.maxDaxis <= 1e-9 };
  return { dt: DT, part1: r1, part2: r2, part3: r3, part4: r4, part5: r5, part6: r6, part7: r7, part8: r8, gates, ok: Object.values(gates).every(Boolean) };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const t0 = Date.now();
  const OUT_PATH = process.env.W298A_OUT || path.join(ROOT, 'tests', 'out', 'coord3d-w298a.json');
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
  if (!HP.coord3d) { console.error('html に HP.coord3d が無い(第298便a の前の世代)'); process.exit(2); }
  const R = runAll(HP, globalThis);
  const out = Object.assign({ meta: null }, R);
  const CODE = ['tests/exp-w298a-coord3d.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第298便a', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, coord3dVersion: HP.coord3d.version, loadErrors: errors.length,
    ruling: '原仮定者の裁定(第88報)(三次元座標化する。右手系。サンプル毎の選択。二次元に Z があれば警告。三次元では自転軸の傾きを粒子ごとに有効化・歳差にも対応)',
    reading: '統括の検証項目 R165(三次元の土台 —— 座標・状態・力・軸と歳差・警告・保存)',
    engine: 'Node の headless(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・1 プロセス)',
    notClaim: ['現実の軌道との一致', '三次元の慣性決定力(回転引きずり・軸引きずり)', 'トルクから求めた歳差'] });
  out.elapsedS = (Date.now() - t0) / 1000;
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 1) + '\n');
  console.log('gates ' + JSON.stringify(out.gates));
  console.log('→ ' + path.relative(ROOT, OUT_PATH) + '(' + out.elapsedS.toFixed(1) + ' s)・ok ' + out.ok);
  process.exit(out.ok ? 0 : 1);
}
