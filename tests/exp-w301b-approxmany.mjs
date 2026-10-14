// 第301便b(原仮定者の裁定(第91報)①③「環や銀河などの近似多粒子のサンプルでは、支配天体は固定する。近似多粒子同士は接触判定を切る。近似多粒子同士は、
// 塵の場合は重力も引きずりも無しで、天体の場合は自転を設定して重力も引きずりも有り」「chainSpreadToy3d を、近似多粒子サンプルのフォーマットに合わせる」・
// 統括の検証項目 R180)—— **近似多粒子の契約 physics.approxMany の器**(Node だけ —— 対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、
// アプリの三次元の步〔dfmStep3 → dfmCore3・dfmInertialDragStep3〕を走らせる。1 プロセス)。
//
// ■ 段(正本 tests/out/approxmany-w301b.json —— 段 approxmany-301b。W301B_OUT で出力先を変える)
//   1 受理: 内蔵で宣言した本(宣言から数える)が警告 0 で通ること・状態の読み口(塵・天体・対の数)。拒否の例(未対応の組は黙って落とさない —— 理由の文の一部で照合)。
//   2 マスクの零試験(小さな三次元のトイ —— 支配天体 1・天体 2・塵 2 と塵の群 4・宣言の外 1):
//     重力(核の加速度 = マスクした解析の和・塵どうしの項は無い)・ポテンシャル(coord3dTotals の U)・慣性決定力の辺(結合 a_ij と受け手の総和 deg ——
//     マスクした対は分子にも分母にも入らない)・回転引きずりの源の数・接触(宣言の中の粒子どうしは無し・支配天体との接触は本の宣言のまま)・
//     受動プローブの格子点(塵の源を数えない)・天体だけの宣言(🍥)は鍵の有無で 200 步の状態がビット同一(接触を切るだけ —— 本は contactMode:"none")。
//   3 🍩 の塵のマスクの効き(マスクあり = 本 / マスクなし = 器の対照〔approxMany を外した写し〕の 360 步の差)と 🍥 の塵型の対照(診断 —— 本にしない)。
//   4 測り直しの記録: 🍥 の安定の条件 8 項目(正本 tests/out/geo4stable-w299d.json —— 器 w299d が近似多粒子の宣言で作り直した本を測る)と
//     🍩 の面の保持・損失・C環内縁の周期(正本 tests/out/saturnring3d-w300c.json)を、マスク前の記録(e20535a の正本の値 —— BEFORE)と並べる。
//   5 監査: 宣言から「多数の粒子 + 支配天体」の在位の本を列挙し、移す/移さないを宣言から導いた理由で分類する(手書きの ID 一覧を持たない)。
//
// ■ しないこと・言わないこと: 閾値を緩めない(🍥 の 8 条件は器 w299d の宣言のまま)。塵どうしの重力を切ったことを「現実の環の再現」とは書かない。
//   二次元の本は移さない(二次元の核 S._core にマスクを入れない —— 計画だけ)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as SPA from './lib-w301b-approxmany.mjs';
import * as W302A from './lib-w302a-wbg.mjs';   // 第302便a: gain ⇔ W_bg の読み書き(器の側)
const REGEN_SCOPE = {"presets":"all","roots":["DT","HP.APPROX_MANY_STATE_VERSION","HP.REL_DRAG_SOLVER_TOL_DEFAULT","HP.allPresets","HP.approxManyCrossCheck","HP.approxManyPairOf","HP.approxManyState","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.inertialDragProbeAt","HP.inertialDragProbeReady","HP.inertialDragProbeSample","HP.inertialDragProbeStreamlines","HP.inertialDragState","HP.loadPreset","HP.presetSig","HP.sim","HP.stepCarryFrame","HP.validateApproxMany","HP.validatePreset","T","ab","abStart","abStop","appStepFn","ch","ckRestoreOne","ckSnapOne","cloneSimState","ctx","currentPreset","cw","sim"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w301b-approxmany-1';
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const clone = (x) => JSON.parse(JSON.stringify(x));
const sci = (v) => (typeof v === 'number' && Number.isFinite(v) ? Number(v.toPrecision(6)) : v);
export const SPREAD_ID = 'chainSpreadToy3d', RING_ID = 'saturnRingInertial3d';
export const CANON_SPREAD = 'tests/out/geo4stable-w299d.json', CANON_RING = 'tests/out/saturnring3d-w300c.json';
/** マスク前の記録(e20535a の正本の値 —— 第299便d・第300便c の測定。宣言を変えた後は「マスク前の記録」として並べる) */
export const BEFORE = Object.freeze({
  source: 'e20535a の正本(tests/out/geo4stable-w299d.json・tests/out/saturnring3d-w300c.json)',
  spread: { allPass: true, solverResMaxA: 6.32365e-12, solverResMaxB: 4.88346e-12, stepRelA: 0.000236762, stepRelB: 0.000218996, countRel160A: 0.0149161, countRel160B: 0.000893216,
    seedRelA: 0.0522418, seedRelB: 0.0373783, budgetRelL: 6.87458e-16, budgetRelP: 2.37253e-17,
    bandsA: [{ dth: 0.172305, dthU: 0.0126642, dr: 0.0239211 }, { dth: 0.105908, dthU: 3.10126e-05, dr: 0.000732308 }, { dth: 0.102275, dthU: -0.00135305, dr: -0.00477889 }],
    bandsB: [{ dth: 0.0236458, dthU: 0.0233986, dr: -0.322188 }, { dth: 0.00153647, dthU: 0.00159029, dr: -0.252423 }, { dth: 0.000316784, dthU: 0.000285804, dr: -0.336972 }],
    },
  ring: { cInPeriodSecH: 20828.424109452153, cInPeriodSecH2: 20824.84455224721, mimasPeriodSecH: 81514.9378046243, titanPeriodDayH: 15.94925587436363,
    planeMaxDegH: 1.4787793334710982e-06, lostH: 0, lostH2: 0, outsideBandH: 1, outsideBandH2: 0, grainsEccVs2dMax: 0.00068132, cInVs2dSec: 0.09485714843685855 } });
/** 監査の候補の規則(宣言から): 在位・粒子 ≥ 16・最も重い single が支配天体の候補で、残り全部の質量の 0.9 倍以上か pinned */
export const AUDIT_RULE = Object.freeze({ minParticles: 16, massRatio: 0.9 });

function simOf(HP, preset) {
  const v = HP.validatePreset(clone(preset));
  if (!v.ok) throw new Error('受理されない: ' + JSON.stringify(v.errors).slice(0, 300));
  const S = HP.coord3d.makeSim(); S.build(clone(v.preset));
  return S;
}
function stateFp(S) {
  let h = 0x811c9dc5; const f = new Float64Array(1), u8 = new Uint8Array(f.buffer);
  for (const k of ['x', 'y', 'z', 'vx', 'vy', 'vz', 'spin', 'rotA', 'sax', 'say', 'saz']) { const A = S[k]; if (!A) continue; for (let i = 0; i < S.n; i++) { f[0] = A[i]; for (let j = 0; j < 8; j++) h = Math.imul(h ^ u8[j], 16777619) >>> 0; } }
  f[0] = S.t; for (let j = 0; j < 8; j++) h = Math.imul(h ^ u8[j], 16777619) >>> 0;
  return h.toString(16);
}

/* ── 小さな三次元のトイ(零試験の材料)── */
export function toyPreset(o = {}) {
  const ax = (src) => ({ enable: true, tiltDeg: 0, azimuthDeg: 0, source: src });
  const P = {
    id: 'w301bToy', name: '近似多粒子の零試験(器)', description: '器の写し', emoji: '🧪', sampleClass: 'principle', seed: 301, world: { boundary: 'none', size: 0 }, camera: { scale: 1 },
    physics: { coord: '3d', G: 1, softening: 0.1, kFrame: 0, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, etaRad: 0, gravityX: 0, gravityY: 0, geoPN: 4, lambdaPN: 0,
      stateCarry: 'double', contactMode: o.contact ? 'normal' : 'none',
      relativeDrag: { law: 'inertial', gain: 0.5, eps: 0.2, pairs: 'all', solver: 'network-pcg-v1', spinDrag: { rot: 'surfaceFlip', axial: 'off' } },
      approxMany: { version: 'v1', governor: 0, groups: [{ kind: 'body', rows: [1, 2] }, { kind: 'dust', rows: [3, 5] }] } },
    bodies: [
      { type: 'single', m: 50, radius: 1, x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, spin: 0.3, pinned: true, spinAxis: ax('器のトイ') },
      { type: 'single', m: 1, radius: 0.3, x: 6, y: 0.5, z: 0.2, vx: 0, vy: 2.8, vz: 0, spin: 0.4, pinned: false, spinAxis: ax('器のトイ') },
      { type: 'single', m: 1.5, radius: 0.3, x: o.contact ? 6.4 : -5, y: o.contact ? 0.6 : 2, z: 0, vx: -1, vy: -2.5, vz: 0.1, spin: -0.2, pinned: false, spinAxis: ax('器のトイ') },
      { type: 'single', m: 0.5, radius: 0.2, x: 3, y: -4, z: 0.3, vx: 2.5, vy: 1.8, vz: 0, spin: 0, pinned: false },
      { type: 'single', m: 0.7, radius: 0.2, x: o.contact ? 1.35 : 3.4, y: o.contact ? 0.25 : -4.1, z: o.contact ? 0 : 0.25, vx: 2.4, vy: 1.9, vz: 0, spin: 0, pinned: false },
      { type: 'ring', n: 4, cx: 0, cy: 0, rIn: 8, rOut: 9, mMin: 0.2, mMax: 0.2, spinMin: 0, spinMax: 0, vMode: 'kepler', aroundMass: 50, omega: 0, vNoise: 0, direction: 1, pinned: false, particleRadius: 0.15 },
      { type: 'single', m: 1, radius: 0.3, x: o.contact ? 0.9 : -2, y: o.contact ? -0.3 : -9, z: o.contact ? 0 : 0.1, vx: 2.3, vy: 0, vz: 0, spin: 0, pinned: false }],
    overlays: { rotationCurve: false, tempHistogram: false, field: false, trail: true } };
  if (o.contact) { // 接触の試験: 塵どうし・天体どうし・支配天体と塵(宣言の外の粒子 6 は支配天体に重ねる)を重ねる
    P.bodies[3].x = 1.05; P.bodies[3].y = 0.2; P.bodies[3].z = 0;   // 支配天体(半径 1)と塵(0.2)が重なる
  }
  return P;
}
/** 解析の和(核と同じ形 G m_j d/(d²+ε²)^{3/2})。mask = (i,j) → 重力が有るか */
function accelOf(S, mask) {
  const n = S.n, G = S.params.G, e2 = S.params.softening * S.params.softening, out = [];
  for (let i = 0; i < n; i++) {
    let ax = 0, ay = 0, az = 0;
    for (let j = 0; j < n; j++) { if (j === i || !mask(i, j)) continue;
      const dx = S.x[j] - S.x[i], dy = S.y[j] - S.y[i], dz = S.z[j] - S.z[i], d2 = dx * dx + dy * dy + dz * dz + e2, f = G * S.mEff[j] / (d2 * Math.sqrt(d2));
      ax += f * dx; ay += f * dy; az += f * dz; }
    out.push([ax, ay, az]);
  }
  return out;
}

/* ───────── 1 受理 ───────── */
export function partAccept(HP) {
  const all = HP.allPresets();
  const books = all.filter((p) => p.physics && p.physics.approxMany).map((p) => p.id);
  const rows = books.map((id) => {
    const p = all.find((q) => q.id === id), v = HP.validatePreset(clone(p));
    const S = v.ok ? simOf(HP, p) : null, st = S ? HP.approxManyState(S) : null;
    return { id, emoji: p.emoji, retired: p.familyRole === 'retired', ok: v.ok, warnings: (v.warnings || []).length, decl: p.physics.approxMany, state: st && { n: st.n, governor: st.governor, dust: st.dust, body: st.body, pairs: st.pairs, masked: st.masked, dragEdges: st.dragEdges } };
  });
  // 拒否の例(宣言を 1 か所だけ壊す —— 理由の文の一部で照合)
  const base = toyPreset();
  const mut = (f) => { const q = clone(base); f(q); return q; };
  const cases = [
    ['coord2d', mut((q) => { delete q.physics.coord; }), '三次元の本'],
    ['unknownKey', mut((q) => { q.physics.approxMany.extra = 1; }), '未知の鍵'],
    ['version', mut((q) => { q.physics.approxMany.version = 'v2'; }), 'version'],
    ['governorRange', mut((q) => { q.physics.approxMany.governor = 99; }), '行の外'],
    ['governorGroup', mut((q) => { q.physics.approxMany.governor = 5; }), 'single'],
    ['governorUnpinned', mut((q) => { q.bodies[0].pinned = false; }), 'pinned:true'],
    ['governorInGroup', mut((q) => { q.physics.approxMany.groups[0].rows = [0, 2]; }), '支配天体の行'],
    ['rowTwice', mut((q) => { q.physics.approxMany.groups[1].rows = [2, 5]; }), '同じ行'],
    ['kind', mut((q) => { q.physics.approxMany.groups[0].kind = 'gas'; }), 'kind'],
    ['rowsForm', mut((q) => { q.physics.approxMany.groups[0].rows = [2, 1]; }), '閉区間'],
    ['bodySpinZero', mut((q) => { q.bodies[1].spin = 0; delete q.bodies[1].spinAxis; }), 'spinZero'],
    ['bodyNoAxis', mut((q) => { delete q.bodies[1].spinAxis; }), 'spinAxis.enable'],
    ['bodyNoRadius', mut((q) => { delete q.bodies[1].radius; }), '明示半径'],
    ['bodyGroupSpin', mut((q) => { q.physics.approxMany.groups = [{ kind: 'body', rows: [1, 2] }, { kind: 'dust', rows: [3, 4] }, { kind: 'body', rows: [5, 5] }]; q.bodies[5].spinMin = 0.1; q.bodies[5].spinMax = 0.1; }), '群の粒子の自転軸'],
    ['dustSpin', mut((q) => { q.bodies[3].spin = 0.2; }), '塵は自転しない'],
    ['spinZeroOnDust', mut((q) => { q.physics.approxMany.groups[1].spinZero = 'declared'; }), 'spinZero'],
  ];
  const rej = cases.map(([key, q, want]) => { const v = HP.validatePreset(q); const msg = v.ok ? '' : v.errors.join(' / ');
    return { key, rejected: !v.ok, matched: !v.ok && msg.indexOf(want) >= 0, want, msg: msg.slice(0, 200) }; });
  const okBase = HP.validatePreset(clone(base));
  const spinZeroOk = HP.validatePreset(mut((q) => { q.bodies[1].spin = 0; delete q.bodies[1].spinAxis; q.physics.approxMany.groups[0].spinZero = 'declared'; }));
  return { books, rows, toyAccepted: okBase.ok && (okBase.warnings || []).length === 0, spinZeroDeclaredAccepted: spinZeroOk.ok, rejects: rej,
    allRejected: rej.every((r) => r.rejected && r.matched) };
}

/* ───────── 2 マスクの零試験 ───────── */
export function partZero(HP) {
  const out = {};
  // 重力・ポテンシャル・辺(接触なしの配置)
  {
    const S = simOf(HP, toyPreset()), n = S.n, K = S._amKind;
    const pair = (i, j) => HP.approxManyPairOf(S, i, j);
    S.step(0.002);   // 1 步目(履歴なし)
    const x0 = { x: Float64Array.from(S.x), y: Float64Array.from(S.y), z: Float64Array.from(S.z) };
    const T = HP.coord3d.totals(S);
    const anaM = accelOf(S, (i, j) => pair(i, j).gravity), anaF = accelOf(S, () => true);
    let U = 0; const G = S.params.G, e2 = S.params.softening ** 2;
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (pair(i, j).gravity) { const d2 = (S.x[i] - S.x[j]) ** 2 + (S.y[i] - S.y[j]) ** 2 + (S.z[i] - S.z[j]) ** 2; U -= G * S.m[i] * S.m[j] / Math.sqrt(d2 + e2); }
    S.step(0.002);   // 2 步目: 核の加速度は x0 の位置で作る
    let errM = 0, scale = 0, dustTerm = 0;
    for (let i = 0; i < n; i++) { if (S.pinned[i]) continue; const a = [S.ax[i], S.ay[i], S.az3[i]];
      for (let c = 0; c < 3; c++) { errM = Math.max(errM, Math.abs(a[c] - anaM[i][c])); scale = Math.max(scale, Math.abs(anaM[i][c])); }
      if (K[i] === 1) dustTerm = Math.max(dustTerm, Math.hypot(anaF[i][0] - anaM[i][0], anaF[i][1] - anaM[i][1], anaF[i][2] - anaM[i][2])); }
    void x0;
    const A = S._rdA, DG = S._rdDeg, C = W302A.rdCoefOf(S.relDrag);
    let dd = 0, ddMax = 0, gd = 0, bb = 0, db = 0, od = 0, degErr = 0;
    for (let i = 0; i < n; i++) { let s = 0;
      for (let j = 0; j < n; j++) { if (i === j) continue; const a = A[i * n + j]; s += a;
        const ki = K[i], kj = K[j];
        if (ki === 1 && kj === 1) { dd++; ddMax = Math.max(ddMax, Math.abs(a)); }
        else if (a > 0) { if ((ki === 0 && i === 0) || (kj === 0 && j === 0)) gd++; else if (ki === 2 && kj === 2) bb++; else if (ki && kj) db++; else od++; } }
      degErr = Math.max(degErr, Math.abs(s - DG[i]) / Math.max(DG[i], 1e-300)); }
    const st = HP.inertialDragState(S);
    // 受動プローブ(格子点 —— 塵の源を数えない): deg = Σ_{塵でない源} C m_j K_ε(r)
    const eps = S.relDrag.eps, pt = [2, 7, 0.3], pr = HP.inertialDragProbeAt(S, pt[0], pt[1], pt[2], { frame: 'coordinate' });
    let degAna = 0, degAll = 0;
    for (let j = 0; j < n; j++) { const dx = S.rdPrevX[j] - pt[0], dy = S.rdPrevY[j] - pt[1], dz = S.rdPrevZ[j] - pt[2], r2 = dx * dx + dy * dy + dz * dz, r = Math.sqrt(r2), s2 = r2 + eps * eps, a = C * S.m[j] * r / (s2 * s2);
      degAll += a; if (K[j] !== 1) degAna += a; }
    out.gravity = { n, dust: K.filter((k) => k === 1).length, body: K.filter((k) => k === 2).length, maxAbsErr: sci(errM), scale: sci(scale), rel: sci(errM / scale), dustDustTermMax: sci(dustTerm),
      pass: errM <= 1e-12 * scale && dustTerm > 1e-3 * scale };
    out.potential = { U: sci(T.U), Uana: sci(U), rel: sci(Math.abs(T.U - U) / Math.abs(U)), pass: Math.abs(T.U - U) <= 1e-12 * Math.abs(U) };
    out.dragEdges = { dustDust: dd, dustDustMaxA: ddMax, governorEdges: gd, bodyBody: bb, dustBody: db, outside: od, degRowSumRel: sci(degErr), edges: S._rdPairSet ? S._rdPairSet.size : null,
      rotSources: st.spin3 ? st.spin3.rot.sources : null, method: st.compose.method,
      pass: dd > 0 && ddMax === 0 && gd > 0 && bb > 0 && db > 0 && od > 0 && degErr <= 1e-14 };
    out.probe = { deg: sci(pr.deg), degAna: sci(degAna), degAll: sci(degAll), rel: sci(Math.abs(pr.deg - degAna) / degAna), pass: Math.abs(pr.deg - degAna) <= 1e-12 * degAna && Math.abs(degAll - degAna) > 1e-6 * degAna };
    out.rot = { sources: st.spin3 ? st.spin3.rot.sources : null, expected: 3, pass: !!st.spin3 && st.spin3.rot.sources === 3 };
  }
  // 接触(重ねた配置 —— contactMode:"normal"): 宣言の中の粒子どうしは接触力なし・支配天体と塵は接触(本の宣言のまま)・宣言の外の粒子と支配天体も接触
  {
    const S = simOf(HP, toyPreset({ contact: true })), n = S.n, K = S._amKind;
    S.step(0.001);
    const pos = { x: Float64Array.from(S.x), y: Float64Array.from(S.y), z: Float64Array.from(S.z) };
    const ov = [];
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { const d = Math.hypot(S.x[i] - S.x[j], S.y[i] - S.y[j], S.z[i] - S.z[j]); if (d < S.R[i] + S.R[j]) ov.push([i, j, HP.approxManyPairOf(S, i, j).contact]); }
    const anaG = accelOf(S, (i, j) => HP.approxManyPairOf(S, i, j).gravity);
    S.step(0.001);
    void pos;
    // 接触力の残り = 核の加速度 − 重力の解析の和(粒子ごと)
    const res = []; for (let i = 0; i < n; i++) res.push(S.pinned[i] ? 0 : Math.hypot(S.ax[i] - anaG[i][0], S.ay[i] - anaG[i][1], S.az3[i] - anaG[i][2]));
    const withC = new Set(), noC = new Set();
    for (const [i, j, c] of ov) { (c ? withC : noC).add(i); (c ? withC : noC).add(j); }
    const noCOnly = [...noC].filter((i) => !withC.has(i) && !S.pinned[i]);
    const withCFree = [...withC].filter((i) => !S.pinned[i]);
    out.contact = { overlaps: ov.map(([i, j, c]) => ({ i, j, kinds: [K[i], K[j]], contact: c })), residualNoContact: noCOnly.map((i) => ({ i, res: sci(res[i]) })), residualWithContact: withCFree.map((i) => ({ i, res: sci(res[i]) })),
      pass: ov.some((z) => !z[2]) && ov.some((z) => z[2]) && noCOnly.length > 0 && noCOnly.every((i) => res[i] <= 1e-12 * Math.max(1, Math.hypot(...anaG[i]))) && withCFree.length > 0 && withCFree.every((i) => res[i] > 1e-6) };
  }
  // 天体だけの宣言(🍥)は鍵の有無で状態がビット同一(本は contactMode:"none" —— 宣言の中の接触を切るのは既に切れている)
  {
    const p = HP.allPresets().find((q) => q.id === SPREAD_ID);
    if (p && p.physics.approxMany) {
      const q = clone(p); delete q.physics.approxMany;
      const X = simOf(HP, p), Y = simOf(HP, q);
      for (let k = 0; k < 200; k++) { X.step(0.016); Y.step(0.016); }
      out.bodyOnlySame = { steps: 200, same: stateFp(X) === stateFp(Y), pass: stateFp(X) === stateFp(Y) };
    } else out.bodyOnlySame = { skipped: 'no-decl', pass: false };
  }
  out.pass = ['gravity', 'potential', 'dragEdges', 'probe', 'rot', 'contact', 'bodyOnlySame'].every((k) => out[k] && out[k].pass === true);
  return out;
}

/* ───────── 3 🍩 の塵のマスクの効き・🍥 の塵型の対照 ───────── */
async function partEffect(HP) {
  const out = {};
  const p = HP.allPresets().find((q) => q.id === RING_ID);
  if (p && p.physics.approxMany) {
    const q = clone(p); delete q.physics.approxMany;
    const X = simOf(HP, p), Y = simOf(HP, q), dt = p.physics.stepDt, N = 360;
    for (let k = 0; k < N; k++) { X.step(dt); Y.step(dt); }
    let dGr = 0, dMo = 0; const K = X._amKind;
    for (let i = 1; i < X.n; i++) { const d = Math.hypot(X.x[i] - Y.x[i], X.y[i] - Y.y[i], X.z[i] - Y.z[i]); if (K[i] === 1) dGr = Math.max(dGr, d); else dMo = Math.max(dMo, d); }
    const TX = HP.coord3d.totals(X), TY = HP.coord3d.totals(Y);
    out.ring = { steps: N, dt, maxGrainPosDiff: sci(dGr), maxMoonPosDiff: sci(dMo), UmaskedVsFull: [sci(TX.U), sci(TY.U)], note: '本(塵どうしの重力・引きずりなし)− 器の対照(approxMany を外した写し —— 第300便c の相互作用)の 360 步(C環内縁の約 1 公転)の位置の差の最大' };
  }
  const W = await import('./exp-w299d-geo4stable.mjs');
  if (SPA.approxOn(HP, {})) {
    const qA = W.spreadPreset(HP, { vel: 'radial', kind: 'dust' }), qB = W.spreadPreset(HP, { vel: 'zero', kind: 'dust' });
    const A = W.runBands(HP, qA), B = W.runBands(HP, qB);
    const bo = (r) => r.bands.map((b) => ({ dth: sci(b.dth), dthU: sci(b.dthU), dr: sci(b.dr) }));
    out.spreadDust = { note: '診断(本にしない): 🍥 の写しで粒子を塵型に(粒子どうしの重力・引きずりなし・自転 0)—— 連鎖は中心からの 1 段だけ', A: { bands: bo(A), resMax: sci(A.solver.resMax), fail: A.solver.fail, wallSec: A.wallSec }, B: { bands: bo(B), resMax: sci(B.solver.resMax), fail: B.solver.fail } };
  }
  return out;
}

/* ───────── 4 測り直しの記録 ───────── */
function partRemeasure(HP) {
  const rd = (f) => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8')); } catch (e) { return null; } };
  const J9 = rd(CANON_SPREAD), J0 = rd(CANON_RING);
  const all = HP.allPresets(), sp = all.find((q) => q.id === SPREAD_ID), rg = all.find((q) => q.id === RING_ID);
  const out = { before: BEFORE };
  if (J9) {
    const S = J9.stable, C = S.conditions, b = (r) => r.bands.map((z) => ({ dth: z.dth, dthU: z.dthU, dr: z.dr }));
    out.spread = { canon: CANON_SPREAD, declApprox: !!(sp && sp.physics.approxMany), measuredApprox: !!(S.layout && S.layout.approxMany), htmlSame: S.layout && S.layout.htmlSame === true, allPass: S.allPass,
      table: S.table.map((z) => ({ key: z.key, pass: z.pass })),
      solverResMaxA: C.solver.value.A.resMax, solverResMaxB: C.solver.value.B.resMax, stepRelA: C.step.value.relA, stepRelB: C.step.value.relB,
      countRel160A: C.count.value.rel160A, countRel160B: C.count.value.rel160B, seedRelA: C.seed.value.relA, seedRelB: C.seed.value.relB,
      budgetRelL: C.budget.value.relLresid, budgetRelP: C.budget.value.relP, bandsA: b(S.runs.A), bandsB: b(S.runs.B),
      failed: S.table.filter((z) => !z.pass).map((z) => ({ key: z.key, note: '型を変えたので未達(閾値は器 w299d の宣言のまま)' })) };
  }
  if (J0) {
    const H = J0.runs.h, H2 = J0.runs.h2;
    out.ring = { canon: CANON_RING, declApprox: !!(rg && rg.physics.approxMany), measuredApprox: !!(J0.decl && J0.decl.approxMany), ok: J0.ok, gates: J0.gates,
      cInPeriodSecH: H.periods.cIn.periodSec, cInPeriodSecH2: H2.periods.cIn.periodSec, mimasPeriodSecH: H.periods.mimas.periodSec, titanPeriodDayH: H.periods.titan.periodSec / 86400,
      planeMaxDegH: H.plane.planeMaxDeg, lostH: H.loss.lost, lostH2: H2.loss.lost, outsideBandH: H.loss.outsideBand, outsideBandH2: H2.loss.outsideBand,
      grainsEccVs2dMax: J0.testParticle.vs2d.h.grainsEcc.maxAbsDiff, cInVs2dSec: J0.testParticle.vs2d.h.cInPeriodSecDiff };
    out.ring.diff = { cInPeriodSecH: sci(out.ring.cInPeriodSecH - BEFORE.ring.cInPeriodSecH), cInPeriodSecH2: sci(out.ring.cInPeriodSecH2 - BEFORE.ring.cInPeriodSecH2),
      titanPeriodSecH: sci((out.ring.titanPeriodDayH - BEFORE.ring.titanPeriodDayH) * 86400), mimasPeriodSecH: sci(out.ring.mimasPeriodSecH - BEFORE.ring.mimasPeriodSecH) };
  }
  return out;
}

/* ───────── 5 監査 ───────── */
export function auditOf(HP) {
  const all = HP.allPresets(), rows = [];
  for (const p of all) {
    if (p.familyRole === 'retired') continue;
    const B = p.bodies || [], ph = p.physics || {};
    let n = 0, groups = 0, gi = -1, gm = -Infinity;
    B.forEach((b, k) => { if (b.type === 'single') { n++; if (b.m > gm) { gm = b.m; gi = k; } } else { n += (b.n || 0); groups++; } });
    if (n < AUDIT_RULE.minParticles || gi < 0) continue;
    let mOther = 0; B.forEach((b, k) => { if (b.type === 'single') { if (k !== gi) mOther += b.m; } else mOther += (b.n || 0) * (((b.mMin || 0) + (b.mMax || 0)) / 2); });
    const g = B[gi], ratio = gm / Math.max(mOther, 1e-300);
    if (!(ratio >= AUDIT_RULE.massRatio || g.pinned === true)) continue;
    const c3 = ph.coord === '3d', rd = ph.relativeDrag && ph.relativeDrag.law, tp = B.some((b) => b.testParticle === true);
    const reasons = [];
    let cls;
    if (ph.approxMany) cls = 'moved';
    else {
      if (p.sampleClass === 'calibration') reasons.push('calibration');                  // 較正母集団・5 区分の判定語を動かさない(帯は試験粒子)
      if (!c3) reasons.push('core2d');                                                   // 二次元の核 S._core にマスクを入れない(未対応)
      if (tp) reasons.push('testParticle');                                              // 環は既に試験粒子契約(源にならない —— 塵の表と別の契約)
      if (g.pinned !== true) reasons.push('governorFree');                                // 支配天体の候補が自由(連星・固定しない中心 —— 「支配天体は固定する」と衝突)
      if (ph.shapeToy) reasons.push('referenceModel');                                   // 規定運動の参照模型(重力の近似多粒子ではない)
      if (ph.contactMode === 'normal') reasons.push('contactPurpose');                   // 接触(衝突・合体)を明示した本 —— 接触を切ると目的が変わる
      if (c3 && rd === 'inertial' && B.some((b) => b.type === 'disk')) reasons.push('chainZeroTest');   // 🔗 の零試験の写し(群 disk の配置 —— 1 字も書き換えない本)
      if (!reasons.length) reasons.push('purposeOther');
      cls = 'notMoved';
    }
    rows.push({ id: p.id, emoji: p.emoji, group: p.group, coord: c3 ? '3d' : '2d', n, groups, governorRow: gi, governorMass: gm, governorPinned: g.pinned === true, ratio: sci(ratio),
      relativeDrag: rd || null, contactMode: ph.contactMode || null, testParticle: tp, sampleClass: p.sampleClass, cls, reasons });
  }
  const count = (f) => rows.filter(f).length;
  return { rule: AUDIT_RULE, n: rows.length, moved: rows.filter((r) => r.cls === 'moved').map((r) => r.id), notMoved: count((r) => r.cls === 'notMoved'),
    byReason: Object.fromEntries(['calibration', 'core2d', 'testParticle', 'governorFree', 'referenceModel', 'contactPurpose', 'chainZeroTest', 'purposeOther'].map((k) => [k, count((r) => r.reasons.indexOf(k) >= 0)])),
    rows };
}

export async function runAll(HP) {
  const t0 = Date.now(), T = {};
  const tm = async (k, f) => { const a = Date.now(); const r = await f(); T[k] = { wallSec: (Date.now() - a) / 1000 }; return r; };
  const accept = await tm('accept', () => partAccept(HP));
  const zero = await tm('zero', () => partZero(HP));
  const effect = await tm('effect', () => partEffect(HP));
  const remeasure = await tm('remeasure', () => partRemeasure(HP));
  const audit = await tm('audit', () => auditOf(HP));
  const gates = {
    accept: accept.rows.length > 0 && accept.rows.every((r) => r.ok && r.warnings === 0 && r.state) && accept.toyAccepted && accept.spinZeroDeclaredAccepted && accept.allRejected,
    zero: zero.pass === true,
    effect: !!(effect.ring && effect.ring.maxGrainPosDiff > 0),
    remeasureSpread: !!(remeasure.spread && remeasure.spread.declApprox && remeasure.spread.measuredApprox && remeasure.spread.htmlSame),
    remeasureRing: !!(remeasure.ring && remeasure.ring.declApprox && remeasure.ring.measuredApprox && remeasure.ring.ok === true),
    audit: audit.moved.length === accept.rows.filter((r) => !r.retired).length && audit.moved.every((id) => accept.books.indexOf(id) >= 0),
  };
  return { version: HARNESS_VERSION, lib: SPA.LIB_VERSION, stateVersion: HP.APPROX_MANY_STATE_VERSION, accept, zero, effect, remeasure, audit, gates, ok: Object.values(gates).every(Boolean), timing: T, elapsedS: (Date.now() - t0) / 1000 };
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) {
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
  const R = await runAll(HP);
  const CODE = ['tests/exp-w301b-approxmany.mjs', 'tests/lib-w301b-approxmany.mjs', 'tests/exp-w299d-geo4stable.mjs', 'tests/lib-w299d-spread.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  R.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第301便b', target: TARGET, code: CODE, inputs: [TARGET, CANON_SPREAD, CANON_RING] }), {
    harnessVersion: HARNESS_VERSION, loadErrors: (errors || []).length,
    ruling: '原仮定者の裁定(第91報)①③「近似多粒子のサンプルでは支配天体は固定する。近似多粒子同士は接触判定を切る。塵は重力も引きずりも無し・天体は自転を設定して重力も引きずりも有り」「chainSpreadToy3d を近似多粒子のフォーマットに合わせる」',
    reading: '統括の検証項目 R180(対のマスクを辺を作る段で・宣言は physics の 1 つの鍵・🍥 は天体型・🍩 の帯は塵・銀河などの本の監査)' });
  Object.assign(R.meta, W281A_SCOPE, w281aStableInputs(ROOT, R.meta.inputs));
  const out = process.env.W301B_OUT || path.join(ROOT, 'tests', 'out', 'approxmany-w301b.json');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(R, null, 1) + '\n');
  console.log(JSON.stringify({ ok: R.ok, gates: R.gates, elapsedS: R.elapsedS, out: path.relative(ROOT, out) }));
}
