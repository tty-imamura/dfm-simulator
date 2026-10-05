// 第293便e(原仮定者の裁定(第83報)「引きずりは相対的な速度差で発生する座標変換なので、同じ方向の複数の引きずりが単純に足されることは無い」・
// 統括の検証項目 R145)—— **引きずりの合成則(compose:"sum"|"solve")の器**(Node だけ —— 対象 html の inline script を
// tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、エンジン本体を走らせる。走行は子プロセスで並列)。
//
// ■ 何を測るか
//   (i)  純関数 tests/lib-w293e-compose.mjs の 8 項(2 源の代数例・共通並進不変・共動・弱結合極限・順序不変・分割/併合不変・
//        強結合の有界性・帳簿)と履歴則の不動点(項の外 —— 加算+履歴の定常点は solve(velocity) と同じ点)。
//   門(エンジン):
//     (a) 宣言の受理: 未宣言と compose:"sum" は同じ正準形・同じ署名/ compose:"solve" の正準形(solveFrom を必ず出す・solveIters は宣言した本だけ)/
//         拒否(未知の値・solve 専用の鍵を sum で・solveIters の値域)/ 内蔵に compose を宣言した本は無い。
//     (b) エンジン≡純関数(ビット): 🐌 の sum(現行の加算の u が純関数の行とビット同一)・🐌 の solve(history・velocity)・
//         🌛 の solve(history・velocity —— 構造核の表を純関数の表で引き直す)・規定源つきの 3 体(受け取らない行)・
//         粒子 70 の環(n>64 の Gauss–Seidel —— solveIters 既定と 30)。各步で u・残差・移送の帳簿(ΔU・Σmu・Σm x×u・ΔL)。
//     (c) 非相反性(iv): 源だけ有限の dragCore では m_i a_ij ≠ m_j a_ji(🌛 の地球⇄月)—— Σ m u は sum でも solve でも 0 にならない
//         (点源の対照では両方とも丸めまで 0)。合成を正規化しても消えないことを数値で記録する。
//   走行(ii): 🐌 inertialDragPair と 🌛 earthMoonInertial を sum / solve(history)/ solve(velocity)で 27 公転(dt 0.016・宣言の gain のまま)
//     —— 近点周期・Δϖ・離心率の代理・u の桁・安定上界 2·max deg と超えた步の数・solve の残差。
//   フィット(iii): 🌛 で solve(history)と solve(velocity)の C_d を、27 公転窓の近点周期 = 8.85 年へ**別に** 1 次元フィット(割線法・log–log)。
//     **採用値にしない**(🌛 の宣言 gain は変えない —— 旧 q 版・現行 sum 版・solve 版のフィットは別の実験で、係数は移植しない)。
//
// ■ しないこと・言わないこと
//   ・既定(compose 未宣言 = "sum")を差し替えない・🌛 の宣言 gain を変えない・「正しい合成則」と断定しない・回転引きずり(Ω)を足さない。
//   ・「月を再現した」「較正 合」「C_d は普遍定数」と書かない。新しい内蔵本を足さない(走らせる本は器の中の一時プリセット)。
//
// 実行(Node だけ・Chromium 不要・子プロセス 3 本 —— W293E_WORKERS で変える。結果は並列数に依らない):
//   node tests/exp-w293e-compose.mjs            → 正本 tests/out/compose-w293e.json(W293E_OUT で出力先を変える)
// 読む正本: なし(html だけ)。
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import { runEM, windowFit } from './exp-w292c-dragcore.mjs';
import * as LC from './lib-w293e-compose.mjs';
import * as LD from './lib-w292c-dragcore.mjs';
const REGEN_SCOPE = {"presets":"all","roots":["HP.DRAG_CORE_NR","HP.DRAG_CORE_VERSION","HP.REL_DRAG_COMPOSE_VERSION","HP.REL_DRAG_INERTIAL_VERSION","HP.REL_DRAG_SOLVE_DIRECT_MAX","HP.REL_DRAG_SOLVE_ITERS_DEFAULT","HP.allPresets","HP.dfmGaussLegendre01","HP.dfmMeshVelocityFieldAt","HP.dragCoreAvgK","HP.dragCoreLookup","HP.dragCoreState","HP.inertialDragComposeState","HP.inertialDragState","HP.presetSigHash","HP.sim","HP.validatePreset","HP.validateRelativeDrag"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w293e-compose-1';
export const SNAIL_ID = 'inertialDragPair';
export const BOOK_ID = 'earthMoonInertial';
export const TARGET_YEARS = 8.85;
export const MODES = Object.freeze([
  Object.freeze({ key: 'sum', label: 'sum(現行・未宣言)' }),
  Object.freeze({ key: 'solveH', label: 'solve(history)', compose: 'solve', solveFrom: 'history' }),
  Object.freeze({ key: 'solveV', label: 'solve(velocity)', compose: 'solve', solveFrom: 'velocity' })]);
export const RUN = Object.freeze({ dt: 0.016, orbits: 27, spans: [[0, 8], [0, 27]], gateSteps: 6 });
export const FIT = Object.freeze({ tol: 2e-6, maxIter: 7 });
const clone = (x) => JSON.parse(JSON.stringify(x));
const find = (HP, id) => HP.allPresets().find((q) => q.id === id);
const modeOf = (k) => MODES.find((z) => z.key === k);

/** 本の写しに合成則を宣言する(sum は宣言しない = 現行)。 */
export function withMode(p, modeKey, extra) {
  const q = clone(p), md = modeOf(modeKey), rd = q.physics.relativeDrag;
  if (md.compose) { rd.compose = md.compose; rd.solveFrom = md.solveFrom; }
  Object.assign(rd, extra || {});
  return q;
}

/* ── (a) 宣言の受理 ─────────────────────────────────────────── */
export function declGate(HP) {
  const VR = HP.validateRelativeDrag, base = { law: 'inertial', gain: 0.8, pairs: 'all', history: 'positions' };
  const u = VR(clone(base)), s = VR(Object.assign(clone(base), { compose: 'sum' })), n = VR(Object.assign(clone(base), { compose: null }));
  const sumSame = u.ok && s.ok && n.ok && JSON.stringify(u.relativeDrag) === JSON.stringify(s.relativeDrag) && JSON.stringify(u.relativeDrag) === JSON.stringify(n.relativeDrag)
    && !('compose' in u.relativeDrag);
  const sh = VR(Object.assign(clone(base), { compose: 'solve' })), sv = VR(Object.assign(clone(base), { compose: 'solve', solveFrom: 'velocity', solveIters: 12 }));
  const solveCanon = sh.ok && sh.relativeDrag.compose === 'solve' && sh.relativeDrag.solveFrom === 'history' && !('solveIters' in sh.relativeDrag)
    && sv.ok && sv.relativeDrag.solveFrom === 'velocity' && sv.relativeDrag.solveIters === 12;
  const rej = [{ compose: 'add' }, { compose: 1 }, { compose: 'sum', solveFrom: 'history' }, { compose: 'sum', solveIters: 4 }, { solveFrom: 'velocity' },
    { compose: 'solve', solveFrom: 'positions' }, { compose: 'solve', solveIters: 0 }, { compose: 'solve', solveIters: 2.5 }, { compose: 'solve', solveIters: 1001 }, { compose: 'solve', solveIters: '8' }];
  const nRej = rej.filter((z) => !VR(Object.assign(clone(base), z)).ok).length;
  // 署名: 🐌 に compose:"sum" を書いても署名は未宣言と同じ・solve は違う
  const p = find(HP, SNAIL_ID), pS = clone(p); pS.physics.relativeDrag.compose = 'sum';
  const sigU = HP.presetSigHash(clone(p)), sigS = HP.presetSigHash(pS), sigH = HP.presetSigHash(withMode(p, 'solveH'));
  const declIds = HP.allPresets().filter((q) => q.physics && q.physics.relativeDrag && q.physics.relativeDrag.compose !== undefined).map((q) => q.id);
  const out = { sumSame, solveCanon, rejected: nRej, rejectCases: rej.length, sigSumSame: sigU === sigS, sigSolveDiffers: sigU !== sigH, builtinDeclaring: declIds };
  out.ok = sumSame && solveCanon && nRej === rej.length && out.sigSumSame && out.sigSolveDiffers && declIds.length === 0;
  return out;
}

/* ── (b) エンジン≡純関数(ビット)──────────────────────────────── */
export const RING_GAIN = 400;
function ringPreset(HP, nRing, pinnedIdx) {
  const p = clone(find(HP, SNAIL_ID));
  const bodies = [{ type: 'single', m: 10, radius: 1, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: false }];
  for (let k = 0; k < nRing; k++) {
    const th = 2 * Math.PI * k / nRing, r = 20 + 0.37 * (k % 5), vc = Math.sqrt(10 / r);
    bodies.push({ type: 'single', m: 0.01, radius: 0.05, x: r * Math.cos(th), y: r * Math.sin(th), vx: -vc * Math.sin(th), vy: vc * Math.cos(th), spin: 0, pinned: k === pinnedIdx });
  }
  p.bodies = bodies;
  return p;
}
function pinned3Preset(HP) {
  const p = clone(find(HP, SNAIL_ID));
  p.bodies.push({ type: 'single', m: 4, radius: 0.5, x: 0, y: 30, vx: 0, vy: 0, spin: 0, pinned: true });
  return p;
}
/** 1 つの事例: build して steps 步・各步で純関数と照合(hist の步だけ)。 */
export function engineCase(HP, key, preset, opt) {
  const v = HP.validatePreset(clone(preset));
  if (!v.ok) return { key, ok: false, why: 'validatePreset: ' + JSON.stringify(v.errors).slice(0, 200) };
  HP.sim.build(v.preset);
  const S = HP.sim, rd = S.relDrag, n = S.n, eps = (rd.eps !== undefined) ? rd.eps : (S.params.softening || 0);
  const solveMode = rd.compose === 'solve';
  let kernel = null, tableNote = null;
  if (S._dragCoreT) {
    const DC = HP.dragCoreState(S), src = DC.sources[0], d = { massFrac: src.massFrac, radius: src.radius };
    const TLib = LD.tableBuild(d, src.R, eps, src.n, src.rMax, HP.DRAG_CORE_NR);
    kernel = (j, r) => (j === src.index) ? LD.tableLookup(TLib, r) : null;
    tableNote = { source: src.index, n: src.n, rMax: src.rMax };
  }
  const rows = [];
  for (let s = 1; s <= (opt.steps || RUN.gateSteps); s++) {
    const DL0 = S.inertialDragDL, W0 = S.inertialDragWork;
    S.step(opt.dt || RUN.dt);
    if (!(S.inertialDragN > 0) || S.inertialDragN !== s - 1) { rows.push({ step: s, hist: false }); continue; }
    const X = Array.from(S.rdPrevX.subarray(0, n)), Y = Array.from(S.rdPrevY.subarray(0, n));
    const vel = solveMode && rd.solveFrom === 'velocity';
    const VX = vel ? Array.from(S.vx.subarray ? S.vx.subarray(0, n) : S.vx.slice(0, n)) : Array.from(S._rdVX.subarray(0, n));
    const VY = vel ? Array.from(S.vy.subarray ? S.vy.subarray(0, n) : S.vy.slice(0, n)) : Array.from(S._rdVY.subarray(0, n));
    const pin = Array.from({ length: n }, (_, i) => !!(S.pinned && S.pinned[i]));
    const B = LC.buildRows({ n, x: X, y: Y, m: S.m, pinned: pin, pairSet: S._rdPairSet, NP: S._rdPairN, C: rd.gain, eps, VX, VY, hist: true, kernel });
    const fixed = Array.from({ length: n }, (_, i) => (!(S.m[i] > 0) || !Number.isFinite(S.m[i]) || pin[i]) ? 1 : 0);
    let U, res = null, method = 'sum';
    if (solveMode) { const q = LC.solve({ n, A: B.A, SX: B.SX, SY: B.SY, DG: B.DG, fixed, iters: rd.solveIters }); U = q; res = q.res; method = q.method; }
    else U = { UX: B.SX.map((z, i) => pin[i] ? 0 : z), UY: B.SY.map((z, i) => pin[i] ? 0 : z) };
    let uSame = true;
    for (let i = 0; i < n; i++) if (!Object.is(U.UX[i], S._rdUX[i]) || !Object.is(U.UY[i], S._rdUY[i])) { uSame = false; break; }
    let aSame = null;
    if (solveMode) { aSame = true; for (let k = 0; k < n * n; k++) if (!Object.is(B.A[k], S._rdA[k])) { aSame = false; break; } }
    const L = LC.ledger({ n, x: X, y: Y, m: S.m, mEff: S.mEff, vx: S.vx, vy: S.vy, UX: U.UX, UY: U.UY, pinned: pin, dt: opt.dt || RUN.dt, G: S.params.G, soft: S.params.softening || 0 });
    const ledgerSame = Object.is(L.dU, S.inertialDragDU) && Object.is(L.Px, S.inertialDragPx) && Object.is(L.Py, S.inertialDragPy) && Object.is(L.Jz, S.inertialDragJz)
      && Object.is(DL0 + L.dL, S.inertialDragDL) && Object.is(W0 + L.dU, S.inertialDragWork);
    const st = solveMode ? HP.inertialDragComposeState(S) : null;
    const resSame = solveMode ? (Object.is(res, st.res) && st.method === method) : null;
    let ab = 0; for (let i = 0; i < n; i++) ab += S.m[i] * Math.hypot(U.UX[i], U.UY[i]);
    rows.push({ step: s, hist: true, uSame, aSame, ledgerSame, resSame, method, res, uMax: L.uMax, sumMuRel: ab > 0 ? Math.hypot(L.Px, L.Py) / ab : 0,
      dUPinned: L.dUPinned, degMax: B.degMax });
  }
  const hs = rows.filter((z) => z.hist);
  const ok = hs.length >= (opt.steps || RUN.gateSteps) - 1 && hs.every((z) => z.uSame && z.ledgerSame && (z.aSame !== false) && (z.resSame !== false))
    && (!opt.method || hs.every((z) => z.method === opt.method)) && (opt.maxRes === undefined || hs.every((z) => z.res <= opt.maxRes));
  return { key, n, compose: solveMode ? 'solve' : 'sum', solveFrom: solveMode ? rd.solveFrom : null, solveIters: solveMode ? (rd.solveIters === undefined ? HP.REL_DRAG_SOLVE_ITERS_DEFAULT : rd.solveIters) : null,
    table: tableNote, rows, ok, state: HP.inertialDragState(S) };
}
export function engineGate(HP) {
  const snail = find(HP, SNAIL_ID), em = find(HP, BOOK_ID);
  const cases = [
    engineCase(HP, 'snail-sum', snail, {}),
    engineCase(HP, 'snail-solveH', withMode(snail, 'solveH'), { method: 'direct', maxRes: 1e-14 }),
    engineCase(HP, 'snail-solveV', withMode(snail, 'solveV'), { method: 'direct', maxRes: 1e-14 }),
    engineCase(HP, 'em-sum', em, {}),
    engineCase(HP, 'em-solveH', withMode(em, 'solveH'), { method: 'direct', maxRes: 1e-14 }),
    engineCase(HP, 'em-solveV', withMode(em, 'solveV'), { method: 'direct', maxRes: 1e-14 }),
    engineCase(HP, 'pinned3-solveH', withMode(pinned3Preset(HP), 'solveH'), { method: 'direct', maxRes: 1e-14 }),
    // 粒子 70(n>64)の環 —— 強い結合(gain 400・2·max deg ≫ 1)で Gauss–Seidel の残差が反復回数で減ることを見る(既定 8 回は打ち切りの残差を帳簿に出す)
    engineCase(HP, 'ring70-solveH', withMode(ringPreset(HP, 69, 5), 'solveH', { gain: RING_GAIN }), { method: 'gs', steps: 4 }),
    engineCase(HP, 'ring70-solveH-it30', withMode(ringPreset(HP, 69, 5), 'solveH', { gain: RING_GAIN, solveIters: 30 }), { method: 'gs', steps: 4 }),
    engineCase(HP, 'ring70-solveV', withMode(ringPreset(HP, 69, 5), 'solveV', { gain: RING_GAIN }), { method: 'gs', steps: 4 }),
  ];
  // 規定源の行が u=0 に固定されている・GS の残差が反復で減る
  const p3 = cases.find((z) => z.key === 'pinned3-solveH'), r8 = cases.find((z) => z.key === 'ring70-solveH'), r30 = cases.find((z) => z.key === 'ring70-solveH-it30');
  const lastRes = (c) => c.rows.filter((z) => z.hist).slice(-1)[0].res;
  const lastDeg = (c) => c.rows.filter((z) => z.hist).slice(-1)[0].degMax;
  const gs = { gain: RING_GAIN, degMax: lastDeg(r8), res8: lastRes(r8), res30: lastRes(r30), iters8: r8.solveIters, iters30: r30.solveIters };
  const out = { cases: cases.map((c) => ({ key: c.key, n: c.n, compose: c.compose, solveFrom: c.solveFrom, solveIters: c.solveIters, table: c.table, ok: c.ok,
    rows: c.rows.map((z) => z.hist ? { step: z.step, uSame: z.uSame, aSame: z.aSame, ledgerSame: z.ledgerSame, resSame: z.resSame, method: z.method, res: z.res, uMax: z.uMax, sumMuRel: z.sumMuRel, degMax: z.degMax } : { step: z.step, hist: false }),
    compose: c.state && c.state.compose ? c.state.compose : null })), gs, pinnedDUExternal: p3.rows.filter((z) => z.hist).slice(-1)[0].dUPinned };
  out.ok = cases.every((c) => c.ok) && gs.res30 < gs.res8;
  return out;
}

/* ── (c) 非相反性(iv)── */
export function nonRecip(HP) {
  const em = find(HP, BOOK_ID), rows = [];
  const pointCtl = (p) => { const q = clone(p); delete q.bodies[0].dragCore; return q; };
  for (const src of ['dragCore', 'point']) for (const md of MODES) {
    const base = src === 'point' ? pointCtl(em) : em;
    const v = HP.validatePreset(withMode(base, md.key));
    HP.sim.build(v.preset);
    const S = HP.sim;
    for (let s = 0; s < 3; s++) S.step(RUN.dt);
    const n = S.n; let ab = 0; for (let i = 0; i < n; i++) ab += S.m[i] * Math.hypot(S._rdUX[i], S._rdUY[i]);
    let asym = null;
    if (md.compose === 'solve') { const A = S._rdA; asym = (S.m[1] * A[1 * n + 0]) / (S.m[0] * A[0 * n + 1]) - 1; }
    rows.push({ source: src, mode: md.key, sumMu: [S.inertialDragPx, S.inertialDragPy], sumMuRel: Math.hypot(S.inertialDragPx, S.inertialDragPy) / ab, asymMiAij: asym });
  }
  const dc = rows.filter((z) => z.source === 'dragCore'), pt = rows.filter((z) => z.source === 'point');
  return { rows, note: 'Σ m u / Σ m|u|(3 步目)—— 相反な点源では丸めまで 0・dragCore(源だけ有限)では合成則に依らず 0 にならない。asymMiAij = m_月 a_月地 /(m_地 a_地月)− 1 = ⟨K⟩/K_ε − 1',
    ok: dc.every((z) => z.sumMuRel > 1e-6) && pt.every((z) => z.sumMuRel < 1e-12) };
}

/* ── 走行(子プロセス)───────────────────────────────────────── */
function summarize(HP, raw, spans) {
  const st = HP.inertialDragComposeState(HP.sim);
  return { dt: raw.dt, steps: raw.steps, wallSec: raw.wallSec, nan: raw.nan, osc0: raw.osc0, revN: raw.rev.length, nB: raw.B.length, ledger: raw.ledger,
    compose: st ? { method: st.method, resMax: st.resMax, solves: st.solves, uSumMax: st.uSumMax, uSolveMax: st.uSolveMax, tooLarge: st.tooLarge } : null,
    windows: spans.map(([a, b]) => windowFit(raw, a, b)) };
}
export function runBook(HP, id, modeKey, gain) {
  const p = withMode(find(HP, id), modeKey, gain === undefined ? undefined : { gain });
  const raw = runEM(HP, p, { dt: RUN.dt, revMax: RUN.orbits });
  return Object.assign(summarize(HP, raw, RUN.spans), { book: id, mode: modeKey, gain: p.physics.relativeDrag.gain });
}
/** 1 次元フィット(割線法・log g と log P —— exp-w292c-dragcore の fitGain と同じ手順・合成則だけ違う)。 */
export function fitGain(HP, modeKey, g0) {
  const runs = [];
  const evalAt = (g) => { const s = runBook(HP, BOOK_ID, modeKey, g); const P = s.windows[1].apsPeriodYr; runs.push({ gain: g, P27: P, P8: s.windows[0].apsPeriodYr, summary: s }); return P; };
  let gA = g0, PA = evalAt(gA), fit = null;
  if (Math.abs(PA / TARGET_YEARS - 1) <= FIT.tol) fit = gA;
  let gB = gA * PA / TARGET_YEARS, PB = null;
  for (let it = 1; fit === null && it < FIT.maxIter; it++) {
    PB = evalAt(gB);
    if (Math.abs(PB / TARGET_YEARS - 1) <= FIT.tol) { fit = gB; break; }
    const lgA = Math.log(gA), lgB = Math.log(gB), fA = Math.log(PA / TARGET_YEARS), fB = Math.log(PB / TARGET_YEARS);
    const lgC = (fB !== fA) ? lgB - fB * (lgB - lgA) / (fB - fA) : lgB - fB;
    gA = gB; PA = PB; gB = Math.exp(lgC);
  }
  if (fit !== null && runs.length === 1) evalAt(g0 * (1 - 2e-3));
  const last = runs[0].gain === fit ? runs[0] : runs[runs.length - 1];
  let root = fit;
  if (root === null && runs.length >= 2) { const a = runs[runs.length - 2], b = runs[runs.length - 1];
    const fa = Math.log(a.P27 / TARGET_YEARS), fb = Math.log(b.P27 / TARGET_YEARS); root = Math.exp(Math.log(b.gain) - fb * (Math.log(b.gain) - Math.log(a.gain)) / (fb - fa)); }
  const slope = runs.length >= 2 ? (Math.log(runs[runs.length - 1].P27) - Math.log(runs[runs.length - 2].P27)) / (Math.log(runs[runs.length - 1].gain) - Math.log(runs[runs.length - 2].gain)) : null;
  return { mode: modeKey, start: g0, gain: root, converged: fit !== null, lastP27: last.P27, lastRel: last.P27 / TARGET_YEARS - 1, logSlope: slope, iterations: runs.length,
    runs: runs.map((z) => ({ gain: z.gain, P27: z.P27, P8: z.P8 })), first: runs[0].summary };
}
export function childTask(HP, spec) {
  if (spec.kind === 'fit') return fitGain(HP, spec.mode, spec.g0);
  if (spec.kind === 'snail') return MODES.map((md) => runBook(HP, SNAIL_ID, md.key));
  return runBook(HP, spec.book, spec.mode);
}
export function taskSpecs(gDecl) {
  return [{ key: 'fitH', kind: 'fit', mode: 'solveH', g0: gDecl }, { key: 'fitV', kind: 'fit', mode: 'solveV', g0: gDecl },
    { key: 'emSum', kind: 'run', book: BOOK_ID, mode: 'sum' }, { key: 'snail', kind: 'snail' }];
}

/* ── 表(PHYSICS〔第293便e〕の行 —— QA docs.composeContract が照合する)── */
const f4 = (x) => (x === null || x === undefined) ? '—' : Number(x).toFixed(4);
const f5 = (x) => (x === null || x === undefined) ? '—' : Number(x).toFixed(5);
const f6 = (x) => (x === null || x === undefined) ? '—' : Number(x).toFixed(6);
const e3 = (x) => (x === null || x === undefined) ? '—' : (x === 0 ? '0' : Number(x).toExponential(2));
export function docRows(J) {
  const out = { pure: [], snail: [], em: [], fit: [], recip: [] };
  const it = J.selfTest.items;
  out.pure.push(`| 2 源の代数例 | sum ${it.algebra.sum1}・${it.algebra.sum2} / solve ${f6(it.algebra.solve1)}・${f6(it.algebra.solve2)} |`);
  out.pure.push(`| 弱結合極限 | 差の傾き ${it.weak.slopes.map(f4).join('・')}(O(a²)) |`);
  out.pure.push(`| 強結合の有界性 | 2·max deg ${it.bounded.rows.map((z) => z.bound2deg.toPrecision(3)).join('/')} で solve ${it.bounded.rows.map((z) => f4(z.solveOverBound)).join('/')}・sum ${it.bounded.rows.map((z) => f4(z.sumOverBound)).join('/')} |`);
  out.pure.push(`| 履歴則の不動点 | 2 源 a=0.2: ${f6(J.selfTest.history['a0.2'].u200)}(solve ${f6(J.selfTest.history['a0.2'].solve)})・a=1: 発散 / 2 体 A=${J.selfTest.history.pair.A}: sum+履歴 ${f6(J.selfTest.history.pair.sumHistory)}・solve(velocity) ${f6(J.selfTest.history.pair.solveVelocity)}・solve(history) ${f6(J.selfTest.history.pair.solveHistory)} |`);
  for (const r of J.snail.rows) { const w8 = r.windows[0], w27 = r.windows[1];
    out.snail.push(`| ${modeOf(r.mode).label} | ${f6(w8.dwRadPerPeri)} | ${f6(w27.dwRadPerPeri)} | ${e3(r.relDw27)} | ${f5(w27.eProxy)} | ${e3(r.ledger.uMax)} | ${e3(r.ledger.boundMax)} | ${r.ledger.boundOver} | ${e3(r.compose ? r.compose.resMax : null)} |`); }
  for (const r of J.em.rows) { const w8 = r.windows[0], w27 = r.windows[1];
    out.em.push(`| ${modeOf(r.mode).label} | ${f5(w27.apsPeriodYr)} | ${f6(w8.dwRadPerPeri)} | ${e3(r.relDw27)} | ${f5(w27.eProxy)} | ${e3(r.ledger.uMax)} | ${e3(r.ledger.boundMax)} | ${r.ledger.boundOver} | ${e3(r.compose ? r.compose.resMax : null)} |`); }
  for (const f of [J.fit.H, J.fit.V]) out.fit.push(`| ${modeOf(f.mode).label} | ${Number(f.gain).toPrecision(7)} | ${e3(f.gain / J.fit.declaredGain - 1)} | ${f.iterations} | ${f5(f.lastP27)} | ${f4(f.logSlope)} |`);
  for (const r of J.nonRecip.rows) out.recip.push(`| ${r.source === 'point' ? '点源(対照)' : 'dragCore(🌛 の宣言)'} | ${modeOf(r.mode).label} | ${e3(r.sumMuRel)} | ${e3(r.asymMiAij)} |`);
  return out;
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const TARGET = process.env.QA_TARGET || 'beta/index.html';
if (IS_MAIN && process.argv.includes('--child')) {
  const spec = JSON.parse(process.argv[process.argv.indexOf('--child') + 1]);
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const { HP } = loadHtmlMain(path.join(ROOT, TARGET));
  process.stdout.write(JSON.stringify(childTask(HP, spec)));
} else if (IS_MAIN) {
  const OUT_PATH = process.env.W293E_OUT || path.join(ROOT, 'tests', 'out', 'compose-w293e.json');
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const t0 = Date.now();
  const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
  const selfTest = LC.selfTest();
  console.log(`(i) 純関数 ${selfTest.nOk}/${selfTest.nItems}・履歴則の不動点 ${selfTest.history.ok}・2 源 sum ${selfTest.items.algebra.sum2} / solve ${selfTest.items.algebra.solve2}`);
  const decl = declGate(HP), eng = engineGate(HP), rec = nonRecip(HP);
  console.log(`(a) 宣言 ${decl.ok}(拒否 ${decl.rejected}/${decl.rejectCases})・(b) エンジン≡純関数 ${eng.ok}(${eng.cases.map((c) => c.key + ':' + c.ok).join(' ')})・GS 残差 ${e3(eng.gs.res8)}→${e3(eng.gs.res30)}・(c) 非相反 ${rec.ok}`);
  const gDecl = find(HP, BOOK_ID).physics.relativeDrag.gain;
  const ONLY = process.env.W293E_ONLY ? process.env.W293E_ONLY.split(',') : null;   // 開発用(指定したら正本を書かずに終わる)
  const specs = taskSpecs(gDecl).filter((z) => !ONLY || ONLY.includes(z.key));
  const NW = Math.max(1, Number(process.env.W293E_WORKERS) || 3);
  const results = {};
  const self = fileURLToPath(import.meta.url);
  const runChild = (sp) => new Promise((res, rej) => {
    const ch = spawn(process.execPath, [self, '--child', JSON.stringify(sp)], { cwd: ROOT, env: process.env });
    let out = '', err = '';
    ch.stdout.on('data', (d) => { out += d; }); ch.stderr.on('data', (d) => { err += d; });
    ch.on('close', (code) => { if (code !== 0) return rej(new Error(sp.key + ': ' + err.slice(0, 600)));
      try { results[sp.key] = JSON.parse(out); } catch (e) { return rej(e); }
      const r = results[sp.key];
      if (sp.kind === 'fit') console.log(`  ${sp.key}: gain ${r.gain}・P27 ${f5(r.lastP27)}(${e3(r.lastRel)})・評価 ${r.iterations} 回・${r.runs.map((z) => z.gain.toPrecision(7) + '→' + f5(z.P27)).join(' / ')}`);
      else if (sp.kind === 'snail') console.log(`  snail: ${r.map((z) => z.mode + ' Δϖ27 ' + f6(z.windows[1].dwRadPerPeri)).join(' | ')}`);
      else console.log(`  ${sp.key}: ${r.windows.map((w) => `[${w.from},${w.to}) ${f4(w.apsPeriodYr)} 年・Δϖ ${f6(w.dwRadPerPeri)}・e ${f5(w.eProxy)}`).join(' | ')}(${r.wallSec.toFixed(0)} s)`);
      res(); });
  });
  const order = specs.slice();
  let next = 0;
  const lane = async () => { while (next < order.length) { const sp = order[next++]; await runChild(sp); } };
  await Promise.all(Array.from({ length: Math.min(NW, order.length) }, lane));
  if (ONLY) { console.log('W293E_ONLY —— 正本は書かない'); process.exit(0); }
  // ---- 集計
  const rel27 = (rows) => { const s0 = rows.find((z) => z.mode === 'sum').windows[1].dwRadPerPeri; for (const r of rows) r.relDw27 = r.windows[1].dwRadPerPeri / s0 - 1; return rows; };
  const snailRows = rel27(results.snail);
  const emRows = rel27([results.emSum, results.fitH.first, results.fitV.first]);
  // 1 次の見積り(門ではない): 2 体の相対モードの結合 A = C(m_1 K + m_0 ⟨K⟩)(初期の接触軌道の長半径で)—— solve(history)の実効の結合は A/(1+A)
  const fit = { target: TARGET_YEARS, window: RUN.orbits, detector: 'B(相対距離の極小 —— 3 点の放物線の頂点・位置だけ)', declaredGain: gDecl, H: results.fitH, V: results.fitV,
    note: '採用値にしない(🌛 の宣言 gain は sum 版の推定のまま —— 旧 q 版・sum 版・solve 版のフィットは別の実験で、係数は移植しない)' };
  fit.relH = fit.H.gain / gDecl - 1; fit.relV = fit.V.gain / gDecl - 1;
  const okRuns = snailRows.concat(emRows).every((s) => !s.nan && s.ledger && s.ledger.reject === 0 && s.ledger.noHistory === 1 && s.ledger.boundOver === 0
    && (!s.compose || (s.compose.resMax <= 1e-14 && s.compose.tooLarge === 0)));
  const out = {
    meta: null, selfTest, gates: { decl, engine: eng }, nonRecip: rec, snail: { book: SNAIL_ID, rows: snailRows }, em: { book: BOOK_ID, gain: gDecl, rows: emRows }, fit,
    decl: { modes: MODES, run: RUN, fitDecl: FIT, targetYears: TARGET_YEARS },
    ok: selfTest.ok && decl.ok && eng.ok && rec.ok && okRuns && fit.H.converged && fit.V.converged };
  const CODE = ['tests/exp-w293e-compose.mjs', 'tests/lib-w293e-compose.mjs', 'tests/exp-w292c-dragcore.mjs', 'tests/lib-w292c-dragcore.mjs', 'tests/lib-w280b-emgrid.mjs',
    'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第293便e', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, libVersion: LC.COMPOSE_LIB_VERSION, engineVersion: HP.REL_DRAG_COMPOSE_VERSION, inertialVersion: HP.REL_DRAG_INERTIAL_VERSION, loadErrors: errors.length,
    ruling: '原仮定者の裁定(第83報)(引きずりは相対的な速度差で発生する座標変換なので、同じ方向の複数の引きずりが単純に足されることは無い)',
    reading: '統括の検証項目 R145(合成則の法則版を opt-in で実装し、同じ質量配置で現行の加算と比べる・既定は現行のままビット同一)',
    engine: 'Node の headless(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・子プロセスで並列)',
    gateA: '宣言なしの本の基点とのビット同一は tests/exp-w258c-bitsame.mjs・tests/exp-w272d-sigsame.mjs で示す(基点 html が要るので本正本に載せない)',
    notClaim: ['正しい合成則を決めた', '月を再現した', '較正 合', 'C_d は普遍定数', '既定を差し替えた', '相対速度を使うこと自体から非加算性が導かれる'] });
  out.elapsedS = (Date.now() - t0) / 1000;
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 1) + '\n');
  console.log(`🌛 宣言 gain ${gDecl}: 27 公転の近点周期 sum ${f5(emRows[0].windows[1].apsPeriodYr)}・solve(history) ${f5(emRows[1].windows[1].apsPeriodYr)}・solve(velocity) ${f5(emRows[2].windows[1].apsPeriodYr)} 年`);
  console.log(`フィット(採用値にしない): solve(history) ${fit.H.gain}(${e3(fit.relH)})・solve(velocity) ${fit.V.gain}(${e3(fit.relV)})`);
  console.log('→ ' + path.relative(ROOT, OUT_PATH) + '(' + out.elapsedS.toFixed(1) + ' s)・ok ' + out.ok);
}
