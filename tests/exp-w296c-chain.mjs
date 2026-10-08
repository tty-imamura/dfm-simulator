// 第296便c(原仮定者の裁定(第86報)「geoPN=4 のサンプルは、多粒子での、磁石に付いたパチンコ玉のように連鎖する引きずりを実装する」・
// 統括の検証項目 R159)—— **連鎖引きずりの器**(Node だけ —— 対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、
// エンジン本体を走らせる。1 プロセス)。純関数は tests/lib-w296c-chain.mjs(エンジンの inertialDragPCG・inertialSpinMoment を html から取り出し、
// 独立な直接法・独立な 2 次元求積と突き合わせる)。
//
// ■ 何を測るか(零試験は「同じか・0 か」の照合・数は値の記録 —— 物理の合否は書かない)
//   ① 3 粒子 0–1–2(辺の重み 1・v₀=(1,0)): PCG と直接法が u=(−0.375, 0.25, 0.125)・辺 1–2 を切ると端 u₂=0・共通の並進で u 不変・
//      質量の違う 3 粒子(核 K_ε の結合)で PCG と直接法の差・Σm u・固定粒子 u=0・反復上限 1 で未収束 → 採用しない(エンジンの走行でも)・重複辺の拒否。
//   ② 65 粒子の鎖(隣接の辺の重み 1e4・端の 1 粒子だけ速度 1): エンジンの現行 Gauss–Seidel 8 回と PCG の元の式の残差
//      (∞: max|r|/max|s| —— エンジンの帳簿と同じ・2: ‖r‖₂/‖s‖₂)・直接法との差・番号を反転した系の PCG の u との差。
//   ③ 4 層 × 16 点の環(最内層は規定運動 —— 接線速度 1・受け取らない/隣接層の辺 100・同層の隣 10): 層ごとの平均接線移動速度
//      (連鎖の解 vs 直接の項だけ s/(1+deg))・層 2–3 を切ると外側 2 層は 0。共通の剛体回転の残差(引かずに残す —— 記録だけ)。
//   ④ 自転源: 一様球の M1(r) = ⟨K_ε(|d−ρ|)(ρ·ê)⟩ をエンジンの閉じた式と独立な 2 次元求積(第280便b の sphere2D の組み方)で照合・p=2 の核では
//      第280便b の sphere2D の G と同じ数・中心の一様球(pinned・spin・radius)と点の受け手 1 個の接線 u がエンジンの走行で s/(1+a) と一致(距離 3 通り)・
//      スピン 0 なら spinSource 無しと全状態ビット同一(試作本 🔗 の 200 步)。
//   ⑤ 試作本 🔗 chainDiskToy の 2000 步(dt 0.016): NaN・残差の最大 ≤ 門・未収束 0・反復の最大・Σm u の帳簿・h/2(dt 0.008 × 4000 步)との差・
//      連鎖の診断(半径の帯ごとに、自転源だけを入れた系の連鎖の解と直接の項の比)・ワンタップ対照(中心と各粒子の対だけ —— 連鎖を切る)の角変位。
//
// ■ しないこと・言わないこと
//   ・隣の u を再加算する緩和反復は作らない・固定回数の反復を収束と呼ばない・距離で辺を切らない(全対)。gain をフィットしない(宣言値)。
//   ・円盤の形成・回転曲線・「銀河ができた」とは書かない(連鎖が外へ伝わる原理だけ)。
//
// 実行(Node だけ・Chromium 不要):
//   node tests/exp-w296c-chain.mjs            → 正本 tests/out/chain-w296c.json(W296C_OUT で出力先を変える)
//   W296C_STEPS=200 node tests/exp-w296c-chain.mjs   → 短走(正本の既定は 2000 步 —— 短走の結果を正本にしない)
// 読む正本: なし(html だけ)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import * as L from './lib-w296c-chain.mjs';
import * as SK from './lib-w280b-sphereKernel.mjs';
import { buildRows } from './lib-w293e-compose.mjs';
const REGEN_SCOPE = {"presets":"all","roots":["HP.REL_DRAG_CHAIN_VERSION","HP.REL_DRAG_SOLVER_TOL_DEFAULT","HP.REL_DRAG_SPIN_NODES","HP.allPresets","HP.dfmMeshVelocityFieldAt","HP.geoEffectiveMode","HP.geoLawOfSim","HP.geoModeOf","HP.inertialDragComposeSolve","HP.inertialDragState","HP.loadPreset","HP.modeSettingIssues","HP.sim","HP.validatePreset","HP.validateRelativeDrag","T","ab","ch","ctx","cw","dfmAddMoments","dfmBlendComplexMoments","dfmComplexMomentsOf","dfmField","dfmGaussLegendre01","dfmGeoToyStep","dfmInertialDragStep","dfmLaneEmden","dfmLocalMeshField","dfmMeshVelocityRHS","dfmSphereKernelMomentsOf","dfmSphereKernelQEff","dfmSphereKernelRadial","dfmSphereOmega","dfmSphereProfile","dfmSphereRho","inertialDragComposeBuild","inertialDragComposeSolve","inertialDragPCG","inertialSpinMoment","isNum","sim"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w296c-chain-1';
export const BOOK_ID = 'chainDiskToy';
export const RUN = Object.freeze({ dt: 0.016, steps: Number(process.env.W296C_STEPS || 2000) });
const TARGET = 'beta/index.html';
const clone = (x) => JSON.parse(JSON.stringify(x));
const find = (HP, id) => HP.allPresets().find((q) => q.id === id);
const sci = (v) => (Number.isFinite(v) ? Number(v.toPrecision(6)) : v);

/* ── 状態の指紋(FNV-1a —— Float64 のビット列)── */
function hasher() {
  let a = 0x811c9dc5;
  const buf = new ArrayBuffer(8), f = new Float64Array(buf), u = new Uint8Array(buf);
  return { push(v) { f[0] = v; for (let b = 0; b < 8; b++) { a ^= u[b]; a = Math.imul(a, 0x01000193) >>> 0; } }, hex() { return a.toString(16); } };
}
function fingerprint(S) {
  const h = hasher();
  for (const k of ['x', 'y', 'vx', 'vy', 'spin', 'm']) { const A = S[k]; for (let i = 0; i < S.n; i++) h.push(A[i]); }
  h.push(S.t); h.push(S.hasNaN() ? 1 : 0);
  return h.hex();
}
/** 内蔵の本の physics を一時的に書き換えて HP.loadPreset で読む(アプリの読み込みと同じ経路)。 */
function withBook(HP, id, mutate, fn) {
  const p = find(HP, id);
  const keepPh = clone(p.physics), keepB = clone(p.bodies);
  if (mutate) mutate(p);
  try { HP.loadPreset(id, false); return fn(HP.sim, p); } finally { p.physics = keepPh; p.bodies = keepB; }
}

/* ───────── ① 3 粒子 ───────── */
function part1(HP, P) {
  const tol = 1e-12, out = {};
  const one = (m, edges, VX, VY, FX) => {
    const g = L.graphFromEdges(3, m, edges);
    const fx = FX || new Uint8Array(3);
    const s = L.sourceOf(3, g.A, VX, VY, fx);
    const d = L.directSolve(3, g.A, g.DG, fx, s.SX, s.SY);
    const p = L.pcgSolve(P, 3, m, g.A, g.DG, fx, s.SX, s.SY, tol, 1000);
    return { g, s, d, p, fx };
  };
  const m1 = [1, 1, 1], E = [[0, 1, 1], [1, 2, 1]];
  const VX = Float64Array.from([1, 0, 0]), VY = new Float64Array(3);
  const a = one(m1, E, VX, VY);
  const want = [-0.375, 0.25, 0.125];
  out.path = { uPCG: Array.from(a.p.UX), uDirect: Array.from(a.d.UX), want, errPCG: L.maxDiff(a.p.UX, want), errDirect: L.maxDiff(a.d.UX, want),
    iters: a.p.iters, converged: a.p.converged, uyZero: L.maxAbs(a.p.UY) === 0 };
  const c = one(m1, [[0, 1, 1]], VX, VY);
  out.cut12 = { uPCG: Array.from(c.p.UX), uDirect: Array.from(c.d.UX), endZero: c.p.UX[2] === 0 && c.d.UX[2] === 0 };
  // 共通の並進(2 進で表せる V と表せない V)
  const tr = (Vx, Vy) => { const b = one(m1, E, VX.map((v) => v + Vx), VY.map((v) => v + Vy)); return { V: [Vx, Vy], dU: Math.max(L.maxDiff(b.p.UX, a.p.UX), L.maxDiff(b.p.UY, a.p.UY)) }; };
  out.translation = [tr(0.25, -0.5), tr(0.3, -0.7)];
  // 質量の違う 3 粒子(核 K_ε の結合 —— エンジンの build と同じ式)
  const x = [0, 1.3, -0.7], y = [0, 0.4, 1.1], m3 = [1, 2.5, 0.4], vx = [0.2, -0.35, 0.6], vy = [-0.1, 0.45, 0.05];
  const rows = buildRows({ n: 3, x, y, m: m3, C: 0.9, eps: 0.2, VX: vx, VY: vy, hist: true });
  const fx0 = new Uint8Array(3);
  const dm = L.directSolve(3, rows.A, rows.DG, fx0, rows.SX, rows.SY);
  const pm = L.pcgSolve(P, 3, m3, rows.A, rows.DG, fx0, rows.SX, rows.SY, tol, 1000);
  const uScale = Math.max(L.maxAbs(dm.UX), L.maxAbs(dm.UY));
  let smx = 0, smy = 0, sab = 0;
  for (let i = 0; i < 3; i++) { smx += m3[i] * pm.UX[i]; smy += m3[i] * pm.UY[i]; sab += m3[i] * Math.hypot(pm.UX[i], pm.UY[i]); }
  out.massDiff = { m: m3, relDiffPCGvsDirect: Math.max(L.maxDiff(pm.UX, dm.UX), L.maxDiff(pm.UY, dm.UY)) / uScale, iters: pm.iters,
    sumMu: [smx, smy], sumMuRel: Math.hypot(smx, smy) / sab, res: L.residualOf(3, rows.A, rows.DG, fx0, rows.SX, rows.SY, pm.UX, pm.UY) };
  // 固定粒子(0 を規定運動に)
  const fx1 = Uint8Array.from([1, 0, 0]);
  const sF = L.sourceOf(3, rows.A, Float64Array.from(vx), Float64Array.from(vy), fx1);
  const pF = L.pcgSolve(P, 3, m3, rows.A, rows.DG, fx1, sF.SX, sF.SY, tol, 1000), dF = L.directSolve(3, rows.A, rows.DG, fx1, sF.SX, sF.SY);
  out.fixed = { u0: [pF.UX[0], pF.UY[0]], u0Zero: pF.UX[0] === 0 && pF.UY[0] === 0, relDiffPCGvsDirect: Math.max(L.maxDiff(pF.UX, dF.UX), L.maxDiff(pF.UY, dF.UY)) / Math.max(L.maxAbs(dF.UX), L.maxAbs(dF.UY)) };
  // 反復上限 1(純関数)
  const p1 = L.pcgSolve(P, 3, m3, rows.A, rows.DG, fx0, rows.SX, rows.SY, tol, 1);
  out.maxIter1Pure = { converged: p1.converged, iters: p1.iters, res: L.residualOf(3, rows.A, rows.DG, fx0, rows.SX, rows.SY, p1.UX, p1.UY).inf };
  // 反復上限 1(エンジンの走行 —— 🔗 に solverMaxIter:1 を足した写し / 対照は gain 0 の写し〔自転源なし —— u=0〕。3 步の全状態)
  const runFP = (mut, k) => withBook(HP, BOOK_ID, mut, (S) => { for (let i = 0; i < k; i++) S.step(RUN.dt); const st = HP.inertialDragState(S);
    return { fp: fingerprint(S), fail: S.inertialDragSolveFail, halt: S.inertialDragHalt === true, why: S.inertialDragWhy, chain: st && st.compose ? st.compose.chain : null }; });
  const f1 = runFP((p) => { p.physics.relativeDrag = Object.assign({}, p.physics.relativeDrag, { solverMaxIter: 1 }); }, 3);
  const f0 = runFP((p) => { const rd = Object.assign({}, p.physics.relativeDrag, { gain: 0 }); delete rd.spinSource; p.physics.relativeDrag = rd; }, 3);
  out.maxIter1Engine = { fail: f1.fail, halt: f1.halt, why: f1.why, failAt: f1.chain ? f1.chain.failAt : null, sameAsNoDrag: f1.fp === f0.fp, fpFail: f1.fp, fpNoDrag: f0.fp };
  // 重複辺の拒否(純関数と受理器)
  const dup = L.graphFromEdges(3, m1, [[0, 1, 1], [1, 0, 2]]);
  const vr = HP.validateRelativeDrag({ law: 'inertial', gain: 1, pairs: [[0, 1], [1, 0]], solver: 'network-pcg-v1' });
  out.duplicate = { pure: dup.ok === false ? dup.err : null, validator: vr.ok === false ? vr.err : null };
  return out;
}

/* ───────── ② 65 粒子の鎖 ───────── */
function fakeS(n, m, A, DG, SX, SY, FX, rd) {
  return { _rdA: A, _rdUX: Float64Array.from(SX), _rdUY: Float64Array.from(SY), _rdDeg: DG, m, pinned: Uint8Array.from(FX), relDrag: rd,
    inertialDragSolveN: 0, inertialDragSolveRes: 0, inertialDragSolveResMax: 0, inertialDragSolveMethod: null,
    inertialDragSolveFail: 0, inertialDragHalt: false, inertialDragSolveIters: 0, inertialDragSolveItersMax: 0, inertialDragSolveRestarts: 0, t: 0 };
}
function part2(HP, P) {
  const n = 65, m = new Float64Array(n).fill(1), FX = new Uint8Array(n);
  const mk = (rev) => { const id = (k) => (rev ? n - 1 - k : k); const E = []; for (let k = 0; k + 1 < n; k++) E.push([id(k), id(k + 1), 1e4]);
    const g = L.graphFromEdges(n, m, E); const VX = new Float64Array(n), VY = new Float64Array(n); VX[id(0)] = 1;
    const s = L.sourceOf(n, g.A, VX, VY, FX); return { g, s, id }; };
  const a = mk(false), b = mk(true);
  const d = L.directSolve(n, a.g.A, a.g.DG, FX, a.s.SX, a.s.SY);
  const run = (sys, rd) => { const S = fakeS(n, m, sys.g.A, sys.g.DG, sys.s.SX, sys.s.SY, FX, rd); const r = HP.inertialDragComposeSolve(S, n);
    return { r, UX: S._rdUX, UY: S._rdUY, res2: L.residualOf(n, sys.g.A, sys.g.DG, FX, sys.s.SX, sys.s.SY, S._rdUX, S._rdUY) }; };
  const gs = run(a, { law: 'inertial', gain: 1 }), pc = run(a, { law: 'inertial', gain: 1, solver: 'network-pcg-v1' });
  const gsR = run(b, { law: 'inertial', gain: 1 }), pcR = run(b, { law: 'inertial', gain: 1, solver: 'network-pcg-v1' });
  const unperm = (U) => { const o = new Float64Array(n); for (let k = 0; k < n; k++) o[k] = U[b.id(k)]; return o; };
  const uS = L.maxAbs(d.UX);
  return {
    n, weight: 1e4, normalisation: { inf: 'max_i max(|r_x|,|r_y|) / max_i |s_i|(エンジンの帳簿 inertialDragSolveRes と同じ)', two: '‖r‖₂ / ‖s‖₂' },
    gs8: { method: gs.r.method, resInf: gs.r.res, resInfLib: gs.res2.inf, resTwo: gs.res2.two, errVsDirect: L.maxDiff(gs.UX, d.UX) / uS },
    pcg: { method: pc.r.method, resInf: pc.r.res, resInfLib: pc.res2.inf, resTwo: pc.res2.two, errVsDirect: L.maxDiff(pc.UX, d.UX) / uS, iters: pc.r.iters,
      restarts: pc.r.restarts, converged: pc.r.converged, adopted: pc.r.adopted },
    reversed: { pcgDiff: L.maxDiff(unperm(pcR.UX), pc.UX) / uS, pcgIters: pcR.r.iters, gsDiff: L.maxDiff(unperm(gsR.UX), gs.UX) / uS, gsResInf: gsR.r.res },
    uEnds: [d.UX[0], d.UX[n - 1]],
  };
}

/* ───────── ③ 環 ───────── */
function part3(P) {
  const solveNet = (net) => {
    const g = L.graphFromEdges(net.n, net.m, net.edges);
    const s = L.sourceOf(net.n, g.A, net.VX, net.VY, net.FX);
    const p = L.pcgSolve(P, net.n, net.m, g.A, g.DG, net.FX, s.SX, s.SY, 1e-12, 1000);
    const d = L.directSolve(net.n, g.A, g.DG, net.FX, s.SX, s.SY);
    const dx = new Float64Array(net.n), dy = new Float64Array(net.n);
    for (let i = 0; i < net.n; i++) if (!net.FX[i]) { dx[i] = s.SX[i] / (1 + g.DG[i]); dy[i] = s.SY[i] / (1 + g.DG[i]); }
    return { pcgLayers: L.layerTangential(net, p.UX, p.UY), directLayers: L.layerTangential(net, d.UX, d.UY), sOnlyLayers: L.layerTangential(net, dx, dy),
      pcgVsDirect: Math.max(L.maxDiff(p.UX, d.UX), L.maxDiff(p.UY, d.UY)), iters: p.iters, converged: p.converged, UX: p.UX, UY: p.UY };
  };
  const full = solveNet(L.ringNetwork({}));
  const cutNet = L.ringNetwork({ cut: [2, 3] }), cut = solveNet(cutNet);
  let outerMax = 0;
  for (let i = 2 * cutNet.K; i < cutNet.n; i++) outerMax = Math.max(outerMax, Math.abs(cut.UX[i]), Math.abs(cut.UY[i]));
  // 共通の剛体回転(全員が自由・v_i = Ω₀ ẑ×x_i)—— 並進と違い s から消えない。残差を記録(引かずに残す)
  const rig = L.ringNetwork({});
  rig.FX.fill(0);
  for (let i = 0; i < rig.n; i++) { rig.VX[i] = -rig.y[i]; rig.VY[i] = rig.x[i]; }
  const gR = L.graphFromEdges(rig.n, rig.m, rig.edges), sR = L.sourceOf(rig.n, gR.A, rig.VX, rig.VY, rig.FX);
  const pR = L.pcgSolve(P, rig.n, rig.m, gR.A, gR.DG, rig.FX, sR.SX, sR.SY, 1e-12, 1000);
  let vMax = 0, uMax = 0, smx = 0, smy = 0, Lz = 0;
  for (let i = 0; i < rig.n; i++) { vMax = Math.max(vMax, Math.hypot(rig.VX[i], rig.VY[i])); uMax = Math.max(uMax, Math.hypot(pR.UX[i], pR.UY[i]));
    smx += pR.UX[i]; smy += pR.UY[i]; Lz += rig.x[i] * pR.UY[i] - rig.y[i] * pR.UX[i]; }
  const strip = (z) => ({ pcgLayers: z.pcgLayers, directLayers: z.directLayers, sOnlyLayers: z.sOnlyLayers, pcgVsDirect: z.pcgVsDirect, iters: z.iters, converged: z.converged });
  return { layers: 4, per: 16, wAdj: 100, wSame: 10, vIn: 1, full: strip(full), cut23: Object.assign(strip(cut), { outerTwoMaxAbsU: outerMax, outerZero: outerMax === 0 }),
    rigidRotation: { omega: 1, uMaxOverVMax: uMax / vMax, sumMu: [smx, smy], sumMxU: Lz, policy: 'kept' } };
}

/* ───────── ④ 自転源 ───────── */
function part4(HP, P, html) {
  const P2 = SK.makePure(html);
  const gl = P.dfmGaussLegendre01(HP.REL_DRAG_SPIN_NODES);
  const prC = P2.dfmSphereProfile({ densityClass: 'compact' }, 32);
  const moment = [];
  for (const [rR, eR] of [[1.5, 0], [3, 0], [10, 0], [1.5, 0.1], [3, 0.1], [10, 0.1], [0.5, 0.2]]) {
    const R = 2, r = rR * R, eps = eR * R;
    const eng = P.inertialSpinMoment(r, R, eps, gl), ref48 = L.sphere2DK(L.kernelK, r, eps, R, 48), ref64 = L.sphere2DK(L.kernelK, r, eps, R, 64);
    const p2 = L.sphere2DK(L.kernelP2, rR, eR, 1, 48), g280 = SK.sphere2D(P2, prC, rR, eR, 48).G;
    moment.push({ rOverR: rR, epsOverR: eR, engine: eng, ref2D48: ref48, ref2D64: ref64, relEngineVsRef: (eng - ref64) / ref64, relRef48vs64: (ref48 - ref64) / ref64,
      farLimit: eR === 0 ? 0.6 * R * R / (r * r * r * r) : null, p2Generalised: p2, p2Sphere2D280b: g280, relP2: (p2 - g280) / g280 });
  }
  // エンジンの走行: 中心の一様球(pinned)+ 点の受け手(静止)—— 2 步目の u と s/(1+a)
  const M = 50, R = 2, Om = 0.75, C = 3, eps = 0.3;
  const tangential = [];
  for (const rR of [1.5, 3, 10]) {
    const r = rR * R;
    const row = withBook(HP, BOOK_ID, (p) => {
      p.physics = Object.assign({}, p.physics, { G: 0, relativeDrag: { law: 'inertial', gain: C, eps, pairs: 'all', spinSource: 'surfaceFlip' } });
      p.bodies = [{ type: 'single', m: M, radius: R, x: 0, y: 0, vx: 0, vy: 0, spin: Om, pinned: true },
        { type: 'single', m: 0.001, x: r, y: 0, vx: 0, vy: 0, spin: 0, pinned: false }];
    }, (S) => {
      S.step(RUN.dt); S.step(RUN.dt);
      const M1 = L.sphere2DK(L.kernelK, r, eps, R, 64), a = C * S.m[0] * L.kernelK(r, eps), sT = C * S.m[0] * S.spin[0] * M1;
      const want = sT / (1 + a);
      return { rOverR: rR, uEngine: [S._rdUX[1], S._rdUY[1]], uWant: want, rel: (S._rdUY[1] - want) / want, radialZero: S._rdUX[1] === 0, a, spin: S.spin[0],
        method: S.inertialDragSolveMethod };
    });
    tangential.push(row);
  }
  // スピン 0 ⇒ spinSource 無しと全状態ビット同一(🔗 の 200 步)
  const k = Math.min(200, RUN.steps);
  const fpA = withBook(HP, BOOK_ID, (p) => { p.bodies = clone(p.bodies); p.bodies[0].spin = 0; }, (S) => { const f = []; for (let i = 0; i < k; i++) { S.step(RUN.dt); f.push(fingerprint(S)); } return f; });
  const fpB = withBook(HP, BOOK_ID, (p) => { p.bodies = clone(p.bodies); p.bodies[0].spin = 0; const rd = Object.assign({}, p.physics.relativeDrag); delete rd.spinSource; p.physics.relativeDrag = rd; },
    (S) => { const f = []; for (let i = 0; i < k; i++) { S.step(RUN.dt); f.push(fingerprint(S)); } return f; });
  let first = null; for (let i = 0; i < k; i++) if (fpA[i] !== fpB[i]) { first = i; break; }
  return { kernel: 'K_ε(d) = d/(d²+ε²)²(並進の a_ij と同じ核)', p2Kernel: '1/(d²+ε²)(第280便b の表裏核)', moment, tangential: { M, R, spin: Om, gain: C, eps, rows: tangential },
    spinZero: { steps: k, firstDiffStep: first, identical: first === null } };
}

/* ───────── ⑤ 試作本 🔗 ───────── */
function chainDiag(HP, P, S, rd, R0, Om, bins, rMaxBin) {
  // 自転源だけを入れた系の連鎖の解(lib の直接法)と直接の項 s/(1+deg) を半径の帯で
  const n = S.n, x = Array.from(S.x), y = Array.from(S.y), m = Array.from(S.m);
  const rows = buildRows({ n, x, y, m, C: rd.gain, eps: rd.eps, VX: new Array(n).fill(0), VY: new Array(n).fill(0), hist: true });
  const FX = new Uint8Array(n); for (let i = 0; i < n; i++) FX[i] = S.pinned[i] ? 1 : 0;
  const gl = P.dfmGaussLegendre01(HP.REL_DRAG_SPIN_NODES), SX = new Float64Array(n), SY = new Float64Array(n);
  for (let i = 0; i < n; i++) { if (FX[i]) continue; const dx = x[i] - x[0], dy = y[i] - y[0], r = Math.hypot(dx, dy);
    const M1 = P.inertialSpinMoment(r, R0, rd.eps, gl); const f = rd.gain * m[0] * Om * M1 / r; SX[i] = -f * dy; SY[i] = f * dx; }
  const d = L.directSolve(n, rows.A, rows.DG, FX, SX, SY);
  const B = []; for (let b = 0; b < bins; b++) B.push({ rLo: b * rMaxBin / bins, rHi: (b + 1) * rMaxBin / bins, n: 0, uChain: 0, uDirect: 0, deg: 0, aCenter: 0 });
  for (let i = 1; i < n; i++) { const r = Math.hypot(x[i] - x[0], y[i] - y[0]); const b = Math.min(bins - 1, Math.floor(r / (rMaxBin / bins))); const tx = -(y[i] - y[0]) / r, ty = (x[i] - x[0]) / r;
    B[b].n++; B[b].uChain += d.UX[i] * tx + d.UY[i] * ty; B[b].uDirect += (SX[i] * tx + SY[i] * ty) / (1 + rows.DG[i]); B[b].deg += rows.DG[i]; B[b].aCenter += rows.A[i * n]; }
  return B.map((z) => ({ rLo: z.rLo, rHi: z.rHi, n: z.n, uChain: z.n ? sci(z.uChain / z.n) : null, uDirect: z.n ? sci(z.uDirect / z.n) : null,
    ratio: z.n ? sci(z.uChain / z.uDirect) : null, deg: z.n ? sci(z.deg / z.n) : null, aCenter: z.n ? sci(z.aCenter / z.n) : null }));
}
function runToy(HP, P, dt, steps, mutate, wantDiag) {
  return withBook(HP, BOOK_ID, mutate, (S, p) => {
    const rd = p.physics.relativeDrag, R0 = p.bodies[0].radius, Om = p.bodies[0].spin;
    const x0 = Float64Array.from(S.x), y0 = Float64Array.from(S.y), r0 = new Float64Array(S.n), th0 = new Float64Array(S.n);
    for (let i = 0; i < S.n; i++) { r0[i] = Math.hypot(S.x[i], S.y[i]); th0[i] = Math.atan2(S.y[i], S.x[i]); }
    const unwrap = new Float64Array(S.n), prevTh = Float64Array.from(th0);
    const RD = p.bodies[1].radius, W = RD / 4;
    const diag0 = wantDiag ? chainDiag(HP, P, S, rd, R0, Om, 4, RD) : null;
    let nanStep = null, sumMuMax = 0, sumMuRelMax = 0, failSteps = 0;
    const t0 = Date.now();
    for (let k = 0; k < steps; k++) {
      S.step(dt);
      if (nanStep === null && S.hasNaN()) nanStep = k + 1;
      const smu = Math.hypot(S.inertialDragPx, S.inertialDragPy); if (smu > sumMuMax) sumMuMax = smu;
      let sab = 0; for (let i = 0; i < S.n; i++) sab += S.m[i] * Math.hypot(S._rdUX[i], S._rdUY[i]);
      if (sab > 0 && smu / sab > sumMuRelMax) sumMuRelMax = smu / sab;
      if (S.inertialDragHalt === true) { failSteps++; S.inertialDragHalt = false; }
      for (let i = 1; i < S.n; i++) { const th = Math.atan2(S.y[i], S.x[i]); let dth = th - prevTh[i]; while (dth > Math.PI) dth -= 2 * Math.PI; while (dth < -Math.PI) dth += 2 * Math.PI; unwrap[i] += dth; prevTh[i] = th; }
    }
    const wallSec = (Date.now() - t0) / 1000;
    const st = HP.inertialDragState(S);
    // 初期半径の帯ごとの角変位(rad)
    const bins = [];
    for (let b = 0; b < 4; b++) bins.push({ r0Lo: b * W, r0Hi: (b + 1) * W, n: 0, dTheta: 0 });
    for (let i = 1; i < S.n; i++) { const b = Math.min(3, Math.floor(r0[i] / W)); bins[b].n++; bins[b].dTheta += unwrap[i]; }
    let rMin = Infinity, rMax = 0; for (let i = 1; i < S.n; i++) { const r = Math.hypot(S.x[i], S.y[i]); rMin = Math.min(rMin, r); rMax = Math.max(rMax, r); }
    return { dt, steps, n: S.n, t: S.t, wallSec, nanStep, method: S.inertialDragSolveMethod, compose: st.compose, sumMuMax, sumMuRelMax, failSteps,
      dThetaByR0: bins.map((z) => ({ r0Lo: z.r0Lo, r0Hi: z.r0Hi, n: z.n, dTheta: z.n ? sci(z.dTheta / z.n) : null })), rMin, rMax,
      diag0, diagEnd: wantDiag ? chainDiag(HP, P, S, rd, R0, Om, 4, RD) : null, x: Float64Array.from(S.x), y: Float64Array.from(S.y), x0, y0 };
  });
}
function part5(HP, P) {
  const p = find(HP, BOOK_ID);
  const v = HP.validatePreset(clone(p));
  const g = HP.geoModeOf(Object.assign({}, p.physics));
  const issues = HP.modeSettingIssues(Object.assign({}, p.physics)).map((z) => z.code);
  const others = HP.allPresets().filter((q) => q.id !== BOOK_ID && !String(q.id).startsWith('custom_'));
  const emojiFree = !others.some((q) => q.emoji === p.emoji);
  const sim = withBook(HP, BOOK_ID, null, (S) => ({ n: S.n, law: HP.geoLawOfSim(S), ge: HP.geoEffectiveMode(S) }));
  const A = runToy(HP, P, RUN.dt, RUN.steps, null, true);
  const H = runToy(HP, P, RUN.dt / 2, RUN.steps * 2, null, false);
  const Bc = runToy(HP, P, RUN.dt, RUN.steps, (q) => { q.physics = Object.assign({}, q.physics, { relativeDrag: clone(q.abBody.physicsPatch.relativeDrag) }); }, false);
  let dPos = 0; for (let i = 1; i < A.n; i++) dPos = Math.max(dPos, Math.hypot(A.x[i] - H.x[i], A.y[i] - H.y[i]));
  const strip = (r) => { const o = Object.assign({}, r); delete o.x; delete o.y; delete o.x0; delete o.y0; return o; };
  const tol = HP.REL_DRAG_SOLVER_TOL_DEFAULT;
  return {
    decl: { id: p.id, emoji: p.emoji, emojiFree, group: p.group, sampleClass: p.sampleClass, notClaim: p.notClaim, geoPN: p.physics.geoPN, kFrame: p.physics.kFrame,
      relativeDrag: p.physics.relativeDrag, G: p.physics.G, center: p.bodies[0], disk: p.bodies[1] },
    accept: { ok: v.ok, warnings: (v.warnings || []).length, warningText: v.warnings || [] },
    resolve: { law: g.law, geodesic: g.geodesic, standard: g.standard, purpose: g.purpose, issues, lawOfSim: sim.law, ge: sim.ge, n: sim.n },
    run: strip(A), half: strip(H), chainCut: strip(Bc),
    hHalf: { maxPosDiff: dPos, dThetaA: A.dThetaByR0, dThetaHalf: H.dThetaByR0 },
    chainVsCut: A.dThetaByR0.map((z, i) => ({ r0Lo: z.r0Lo, r0Hi: z.r0Hi, n: z.n, dThetaChain: z.dTheta, dThetaCut: Bc.dThetaByR0[i].dTheta,
      ratio: (z.dTheta !== null && Bc.dThetaByR0[i].dTheta) ? sci(z.dTheta / Bc.dThetaByR0[i].dTheta) : null })),
    gates: { noNaN: A.nanStep === null && H.nanStep === null && Bc.nanStep === null, resWithinTol: A.compose.resMax <= tol && H.compose.resMax <= tol,
      noFail: A.compose.chain.fail === 0 && H.compose.chain.fail === 0 && Bc.compose.chain.fail === 0, pcg: A.method === 'pcg' && A.n > 64 },
  };
}

/* ───────── 転記(obsCard の値・PHYSICS〔第296便c〕の表の行 —— QA docs.chainContract296 が正本から作り直して照合する)───────── */
const f3 = (v) => (v === 0 ? '0' : Math.abs(v) >= 0.1 ? v.toFixed(3) : v.toPrecision(3));
const e2 = (v) => (v === 0 ? '0' : v.toExponential(2));
/** 🔗 の obsCard(ja/en の model 欄)に入っている正本の値(文字列)。 */
export function obsNumbers(J) {
  const r = J.part5, d0 = r.run.diag0.filter((z) => z.n > 0), cv = r.chainVsCut.filter((z) => z.n > 0);
  return [String(r.run.compose.chain.itersMax), d0.map((z) => f3(z.uChain)).join('/'), d0.map((z) => f3(z.uDirect)).join('/'),
    cv.map((z) => f3(z.dThetaChain)).join('/'), cv.map((z) => f3(z.dThetaCut)).join('/'), cv[cv.length - 1].ratio.toFixed(2),
    f3(r.hHalf.dThetaA.find((z) => z.n > 0).dTheta) + '/' + f3(r.hHalf.dThetaHalf.find((z) => z.n > 0).dTheta)];
}
/** PHYSICS〔第296便c〕の表の行(器が正本から作る —— 書式の正本)。 */
export function docRows(J) {
  const a = J.part1, b = J.part2, c = J.part3, d = J.part4, t = J.part5;
  const zero = [
    `| ① 3 粒子 0–1–2(辺 1・v₀=(1,0)) | u = (${a.path.uPCG.map((v) => v.toFixed(6)).join(', ')}) | PCG ${a.path.iters} 回・期待との差 ${e2(a.path.errPCG)}(直接法 ${e2(a.path.errDirect)}) |`,
    `| ① 辺 1–2 を切る | u₂ = ${a.cut12.uPCG[2]} | 端は厳密に 0(PCG・直接法)= ${a.cut12.endZero} |`,
    `| ① 共通の並進 V=(0.25,−0.5)/(0.3,−0.7) | max|Δu| = ${a.translation.map((z) => e2(z.dU)).join(' / ')} | 並進は s の差で消える |`,
    `| ① 質量の違う 3 粒子(m=1/2.5/0.4・核 K_ε) | PCG と直接法の差 ${e2(a.massDiff.relDiffPCGvsDirect)} | Σm u/Σm|u| = ${e2(a.massDiff.sumMuRel)}・PCG ${a.massDiff.iters} 回 |`,
    `| ① 固定粒子(0 を規定運動) | u₀ = (${a.fixed.u0.join(', ')}) | PCG と直接法の差 ${e2(a.fixed.relDiffPCGvsDirect)} |`,
    `| ① 反復上限 1 | 純関数: 収束 ${a.maxIter1Pure.converged}・残差 ${e2(a.maxIter1Pure.res)} | 走行: 未収束 ${a.maxIter1Engine.fail} 回・停止の旗 ${a.maxIter1Engine.halt}・引きずりなしと全状態同一 ${a.maxIter1Engine.sameAsNoDrag} |`,
    `| ① 重複辺 | 純関数・受理器とも拒否 | ${!!a.duplicate.pure && !!a.duplicate.validator} |`];
  const chain = [
    `| Gauss–Seidel 8 回(現行) | ${e2(b.gs8.resInf)} | ${e2(b.gs8.resTwo)} | ${e2(b.gs8.errVsDirect)} | — |`,
    `| PCG(network-pcg-v1) | ${e2(b.pcg.resInf)} | ${e2(b.pcg.resTwo)} | ${e2(b.pcg.errVsDirect)} | ${b.pcg.iters} |`,
    `| 番号を反転した系 | PCG ${e2(b.reversed.pcgDiff)}(反復 ${b.reversed.pcgIters}) | GS 8 回 ${e2(b.reversed.gsDiff)}(残差 ${e2(b.reversed.gsResInf)}) | — | — |`];
  const ring = c.full.pcgLayers.map((z, i) => `| ${z.layer} | ${f3(z.wT)} | ${f3(c.full.sOnlyLayers[i].uT)} | ${f3(c.cut23.pcgLayers[i].wT)} |`);
  const ringNote = `| 剛体回転(全員自由・v=ẑ×x) | max|u|/max|v| = ${f3(c.rigidRotation.uMaxOverVMax)} | Σm u = (${c.rigidRotation.sumMu.map(e2).join(', ')}) | 引かずに残す(kept) |`;
  const moment = d.moment.map((z) => `| ${z.rOverR} | ${z.epsOverR} | ${z.engine.toPrecision(10)} | ${e2(z.relEngineVsRef)} | ${e2(z.relP2)} |`);
  const tang = d.tangential.rows.map((z) => `| ${z.rOverR} | ${z.uEngine[1].toPrecision(10)} | ${z.uWant.toPrecision(10)} | ${e2(z.rel)} | ${f3(z.a)} |`);
  const toy = [
    `| 解法 | n=${t.run.n}・${t.run.method}・反復 最大 ${t.run.compose.chain.itersMax}・残差 最大 ${e2(t.run.compose.resMax)}(門 ${t.run.compose.chain.solverTol})・未収束 ${t.run.compose.chain.fail}・NaN ${t.run.nanStep === null ? 0 : 1} |`,
    `| 連鎖の診断 t=0(帯 ${t.run.diag0.filter((z) => z.n > 0).map((z) => z.rLo + '–' + z.rHi).join('/')}) | 連鎖の解 ${t.run.diag0.filter((z) => z.n > 0).map((z) => f3(z.uChain)).join('/')}・直接の項 ${t.run.diag0.filter((z) => z.n > 0).map((z) => f3(z.uDirect)).join('/')} |`,
    `| 連鎖の診断 2000 步後 | 連鎖の解 ${t.run.diagEnd.filter((z) => z.n > 0).map((z) => f3(z.uChain)).join('/')}・直接の項 ${t.run.diagEnd.filter((z) => z.n > 0).map((z) => f3(z.uDirect)).join('/')} |`,
    `| 角変位 Δθ(rad・2000 步) | 連鎖 ${t.chainVsCut.filter((z) => z.n > 0).map((z) => f3(z.dThetaChain)).join('/')}・連鎖を切った対照 ${t.chainVsCut.filter((z) => z.n > 0).map((z) => f3(z.dThetaCut)).join('/')}・比 ${t.chainVsCut.filter((z) => z.n > 0).map((z) => z.ratio.toFixed(2)).join('/')} |`,
    `| h/2(dt 0.008 × 4000 步) | Δθ ${t.half.dThetaByR0.filter((z) => z.n > 0).map((z) => f3(z.dTheta)).join('/')}・位置の差 最大 ${f3(t.hHalf.maxPosDiff)} |`,
    `| Σm u の帳簿 | 最大 ${f3(t.run.sumMuMax)}・Σm u/Σm|u| 最大 ${f3(t.run.sumMuRelMax)}(pinned の中心と自転源があるので 0 にならない —— 記録だけ) |`,
    `| 半径の範囲(2000 步後) | ${f3(t.run.rMin)}〜${f3(t.run.rMax)} |`];
  return { zero, chain, ring, ringNote, moment, tang, toy };
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) {
  const t0 = Date.now();
  const OUT_PATH = process.env.W296C_OUT || path.join(ROOT, 'tests', 'out', 'chain-w296c.json');
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const html = fs.readFileSync(path.join(ROOT, TARGET), 'utf8');
  const P = L.makeChainPure(html);
  const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
  const r1 = part1(HP, P); console.log('① ' + JSON.stringify({ path: r1.path.errPCG, cut: r1.cut12.endZero, tr: r1.translation.map((z) => z.dU), mass: r1.massDiff.relDiffPCGvsDirect, sumMuRel: r1.massDiff.sumMuRel, fixed: r1.fixed.u0Zero, it1: r1.maxIter1Engine }));
  const r2 = part2(HP, P); console.log('② ' + JSON.stringify({ gs: r2.gs8, pcg: r2.pcg, rev: r2.reversed }));
  const r3 = part3(P); console.log('③ ' + JSON.stringify({ full: r3.full.pcgLayers, cut: r3.cut23.outerZero, rig: r3.rigidRotation }));
  const r4 = part4(HP, P, html); console.log('④ ' + JSON.stringify({ moment: r4.moment.map((z) => [z.rOverR, z.epsOverR, sci(z.relEngineVsRef), sci(z.relP2)]), tan: r4.tangential.rows.map((z) => sci(z.rel)), spin0: r4.spinZero }));
  const r5 = part5(HP, P); console.log('⑤ ' + JSON.stringify({ accept: r5.accept.ok, warn: r5.accept.warnings, resolve: r5.resolve, gates: r5.gates, wall: r5.run.wallSec, itersMax: r5.run.compose.chain.itersMax, resMax: r5.run.compose.resMax, dPos: r5.hHalf.maxPosDiff }));
  const gates = {
    path3: r1.path.errPCG <= 1e-12 && r1.path.errDirect <= 1e-12 && r1.path.converged,
    cut12: r1.cut12.endZero,
    translation: r1.translation[0].dU === 0 && r1.translation[1].dU <= 1e-15,
    massDiff: r1.massDiff.relDiffPCGvsDirect <= 1e-12 && r1.massDiff.sumMuRel <= 1e-12,
    fixed: r1.fixed.u0Zero && r1.fixed.relDiffPCGvsDirect <= 1e-12,
    maxIter1: r1.maxIter1Pure.converged === false && r1.maxIter1Engine.fail >= 1 && r1.maxIter1Engine.halt === true && r1.maxIter1Engine.sameAsNoDrag === true,
    duplicate: !!r1.duplicate.pure && !!r1.duplicate.validator,
    chain65: r2.pcg.method === 'pcg' && r2.pcg.adopted === true && r2.pcg.resInf <= HP.REL_DRAG_SOLVER_TOL_DEFAULT && r2.gs8.method === 'gs' && r2.reversed.pcgDiff <= 1e-9,
    ring: r3.full.pcgVsDirect <= 1e-12 && r3.cut23.outerZero === true,
    spinMoment: r4.moment.every((z) => Math.abs(z.relEngineVsRef) <= 1e-7 && Math.abs(z.relP2) <= 1e-12),
    spinTangential: r4.tangential.rows.every((z) => Math.abs(z.rel) <= 1e-9 && z.radialZero),
    spinZero: r4.spinZero.identical,
    toy: r5.accept.ok && r5.accept.warnings === 0 && r5.resolve.standard === true && r5.resolve.issues.length === 0 && r5.resolve.law === 'inertial-drag'
      && r5.resolve.ge === 0 && r5.decl.emojiFree && Object.values(r5.gates).every(Boolean),
  };
  const out = { meta: null, run: RUN, part1: r1, part2: r2, part3: r3, part4: r4, part5: r5, gates, ok: Object.values(gates).every(Boolean) };
  const CODE = ['tests/exp-w296c-chain.mjs', 'tests/lib-w296c-chain.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w280b-sphereKernel.mjs', 'tests/lib-w279c-bgcompose.mjs',
    'tests/lib-w293e-compose.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第296便c', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, libVersion: L.CHAIN_LIB_VERSION, chainVersion: HP.REL_DRAG_CHAIN_VERSION, loadErrors: errors.length,
    ruling: '原仮定者の裁定(第86報)(geoPN=4 のサンプルは、多粒子での、磁石に付いたパチンコ玉のように連鎖する引きずりを実装する)',
    reading: '統括の検証項目 R159(geoPN=4 = 多粒子の連鎖引きずり —— 既存の全体 solve の上に、収束を確かめる解法〔PCG〕と自転する源の表裏核)',
    engine: 'Node の headless(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・1 プロセス・HP.loadPreset で読む)',
    notClaim: ['円盤の形成', '平坦な回転曲線', '銀河ができた', 'gain は普遍定数', '隣の u を再加算する緩和反復'] });
  out.elapsedS = (Date.now() - t0) / 1000;
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 1) + '\n');
  console.log('gates ' + JSON.stringify(gates));
  console.log('→ ' + path.relative(ROOT, OUT_PATH) + '(' + out.elapsedS.toFixed(1) + ' s)・ok ' + out.ok);
  process.exit(out.ok ? 0 : 1);
}
