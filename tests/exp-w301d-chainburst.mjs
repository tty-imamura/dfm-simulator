// 第301便d(原仮定者の裁定(第91報)④「chainDiskToy 系が 14000 歩付近で爆発するのが興味深い。超新星爆発サンプルへの応用の可能性を探る」・
// 統括の検証項目 R182)—— **連鎖円盤の 14000 步付近の飛びの器**(Node だけ —— 対象 html の inline script を tests/lib-w280b-emgrid.mjs の
// loadHtmlMain で読み、アプリの步〔sim.step —— 慣性決定力の引きずりは dfmInertialDragStep / dfmInertialDragStep3〕をそのまま走らせる。描画は入れない)。
//
// ■ 何を測るか
//   ① 再現(本体の步・h = 0.016): 🔗 chainDiskToy・🔩 chainDiskToy3d(xy が 🔗 とビット同一か)・🔗 の norm:"none"(第301便a の前の法則 —— 走りがビット同一か)の
//      t = 288(18000 步)までの標本(8 時間単位ごと: 最大半径・中央半径・半径 100 を越えた数とその最大の速さ・最大の |v|・|u|・K・U・引きずりの仕事 W・帳簿の残差 R_E = ΔE − W)。
//      本体の帳簿を分ける: 1 步の中の重力の段(キック → ドリフト)の ΔK とドリフトの ΔU、移送の ΔU(= W —— 本体の inertialDragWork と照合)。
//      R_E = Σ(ΔK_kick + ΔU_drift)= 分割した重力の段の残差(厳密解では 0)。
//   ② 器の検証: 独立な器(tests/lib-w301d-coupled.mjs)の 'split'(本体の分割の写し)が本体と同じ軌道を辿ること(2000 步・位置の差)と、
//      本体の步の入口で解いた u と器の u の差(PCG の許容の桁)—— 二次元の 🔗 と三次元の 🧨 で。
//   ③ 刻み: 本体 h, h/2, h/4, h/8 と独立な器の結合積分(各段で引きずりを引き直す)rk4 h, h/2, h/4・rk2 h, h/2・半陰的の結合 semic h, h/2, h/4(直し方の案)—— t = 288 まで。
//   ④ 対照(本体 h と rk4 h): gain 0・中心の spin 0・乱数種 2 つ・粒子数 40 / 120(総質量 400 を保つ)・gain 4 / 16。粒子数 40 は rk4 h/2 も。
//   ⑤ 長い窓: rk4 h と h/2 を t = 480 まで(🔗 の円盤の大半が飛ぶか・刻みで同じか)。
//   ⑥ 探索の写し 🧨 chainBurstShell3d(三次元・殻): rk4 0.016 / 0.008・本体 0.016〜0.001(宣言の刻み stepDt を含む)・帳簿・対照
//      (gain 0・中心の spin 0・配置を回した 2 種・粒子 80 個)—— t = 320 まで。
//
// ■ 判定の語
//   「飛び」= 中央半径 > 100(大半が半径 100 の外 —— 初期の配置は半径 24 以内)。「放出」= 半径 100 を越えた粒子がある(少数でも)。
//   刻みで収束する = rk4 の h と h/2 の標本(K・中央半径)が相対 1e-3 で一致し、本体の刻みを細かくすると rk4 に近づく。
//
// ■ しないこと・言わないこと
//   ・本体の積分器は変えない(独立な器は比較の基準)。「超新星の機構を導いた」「爆発を再現した」と書かない。gain は宣言値(フィットしない)。
//
// 実行(Node だけ —— 子プロセス W301D_PAR 本〔既定 2〕で走らせて束ねる):
//   node tests/exp-w301d-chainburst.mjs          → 正本 tests/out/chainburst-w301d.json(W301D_OUT で出力先を変える・W301D_ONLY=<正規表現> で仕事を絞る〔門は出さない〕)
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as L from './lib-w301d-coupled.mjs';
import { shellBodies, shellStats, SHELL_VERSION } from './lib-w301d-shell.mjs';
import * as W302A from './lib-w302a-wbg.mjs';   // 第302便a: gain ⇔ W_bg の読み書き(器の側)
const REGEN_SCOPE = {"presets":["chainBurstShell3d","chainDiskToy","chainDiskToy3d"],"roots":["HP.REL_DRAG_INERTIAL_VERSION","HP.REL_DRAG_SPIN_NODES","HP.allPresets","HP.dfmGaussLegendre01","HP.dfmMeshVelocityFieldAt","HP.inertialDragState","HP.inertialSpinMoment","HP.sim","HP.validatePreset"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w301d-chainburst-1';
const TARGET = process.env.QA_TARGET || 'beta/index.html';
export const COPY_ID = 'chainBurstShell3d';
const H0 = 0.016, T_MAIN = 288, T_LONG = 480, T_COPY = 320, EVERY = 8, R_ESC = 100;
const clone = (x) => JSON.parse(JSON.stringify(x));
const find = (HP, id) => HP.allPresets().find((q) => q.id === id);
const fpXY = (x, y, vx, vy, n) => { let h = 0x811c9dc5; const f = new Float64Array(1), u8 = new Uint8Array(f.buffer);
  for (const A of [x, y, vx, vy]) for (let i = 0; i < n; i++) { f[0] = A[i]; for (let j = 0; j < 8; j++) h = Math.imul(h ^ u8[j], 16777619) >>> 0; }
  return h.toString(16); };

/* 本の変種(宣言から —— 写しを 1 か所だけ変える)。🔗 の変種と 🧨 の変種 */
const reMass = (d, n) => { const M = d.n * d.mMin; d.n = n; d.mMin = d.mMax = M / n; };
export const VARIANTS = {
  base: (p) => p,
  normNone: (p) => { W302A.rdPatch(p.physics.relativeDrag, { norm: 'none' }); return p; },
  gain0: (p) => { W302A.rdSetGain(p.physics.relativeDrag, 0); delete p.physics.relativeDrag.spinSource; delete p.physics.relativeDrag.spinDrag; return p; },
  spin0: (p) => { p.bodies[0].spin = 0; return p; },
  seedA: (p) => { p.seed = 20261009; return p; },
  seedB: (p) => { p.seed = 20261010; return p; },
  n40: (p) => { reMass(p.bodies[1], 40); return p; },
  n120: (p) => { reMass(p.bodies[1], 120); return p; },
  gain4: (p) => { W302A.rdSetGain(p.physics.relativeDrag, 4); return p; },
  gain16: (p) => { W302A.rdSetGain(p.physics.relativeDrag, 16); return p; },
  // 🧨 の変種(殻の生成器から —— 中心は宣言のまま)
  rot1: (p) => { p.bodies = [p.bodies[0], ...shellBodies({ rot: 1 })]; return p; },
  rot2: (p) => { p.bodies = [p.bodies[0], ...shellBodies({ rot: 2 })]; return p; },
  shell80: (p) => { p.bodies = [p.bodies[0], ...shellBodies({ n: 80, m: 5 })]; return p; },
};
// 第302便d(R188): 世代切替 —— 本体の既定が semic になった世代(html に relDragStepOrderOf がある)では、この器の本体の走行は
//   **分割を明示**(stepOrder:"split" —— 世代は大域の関数 relDragStepOrderOf の有無で判定)して第301便d の記録と同じ量を測る(器の門 ledgerMatchesEngine・splitHarnessMatches は分割の本体が前提)。
//   W301D_ORDER=semic で既定の semic の本体を測る(第302便d の影響の測定 —— 正本は出さない・W301D_ONLY と一緒に使う)。
export const ENGINE_ORDER = process.env.W301D_ORDER || 'split';
function buildVariant(HP, id, variant) {
  const p = VARIANTS[variant](clone(find(HP, id))); delete p.abBody;
  if (typeof globalThis.relDragStepOrderOf === 'function' && p.physics.relativeDrag && p.physics.relativeDrag.law === 'inertial' && p.physics.relativeDrag.compose !== 'sum') {
    if (ENGINE_ORDER === 'split') p.physics.relativeDrag.stepOrder = 'split'; else delete p.physics.relativeDrag.stepOrder;
  }
  const v = HP.validatePreset(p); if (!v.ok) throw new Error(id + '/' + variant + ' validatePreset: ' + JSON.stringify(v.errors).slice(0, 300));
  HP.sim.build(v.preset); return HP.sim;
}

/* 標本(中心 = 粒子 0)—— 二次元の本は z = 0 */
function sampleOf(n, x, y, z, vx, vy, vz, U3, m, G, eg2, extra) {
  const rs = []; let rMax = 0, vMax = 0, uMax = 0, nEsc = 0, vEsc = 0, K = 0, U = 0;
  for (let i = 0; i < n; i++) { K += 0.5 * m[i] * (vx[i] * vx[i] + vy[i] * vy[i] + vz[i] * vz[i]);
    for (let j = i + 1; j < n; j++) { const dx = x[j] - x[i], dy = y[j] - y[i], dz = z[j] - z[i]; U -= G * m[i] * m[j] / Math.sqrt(dx * dx + dy * dy + dz * dz + eg2); } }
  for (let i = 1; i < n; i++) { const r = Math.hypot(x[i] - x[0], y[i] - y[0], z[i] - z[0]); rs.push(r); if (r > rMax) rMax = r;
    const v = Math.hypot(vx[i], vy[i], vz[i]); if (v > vMax) vMax = v; if (r > R_ESC) { nEsc++; if (v > vEsc) vEsc = v; }
    if (U3) { const u = Math.hypot(U3[0][i], U3[1][i], U3[2] ? U3[2][i] : 0); if (u > uMax) uMax = u; } }
  rs.sort((a, b) => a - b);
  return Object.assign({ rMax, rMed: rs[Math.floor(rs.length / 2)], nEsc, vEscMax: vEsc, vMax, uMax: U3 ? uMax : null, K, U }, extra);
}
function summarize(samples, E0, n) {
  const last = samples[samples.length - 1], rt = (t) => (t === null ? null : Math.round(t * 1000) / 1000);
  const esc = samples.find((s) => s.rMax > R_ESC), burst = samples.find((s) => s.rMed > R_ESC);
  let kMax = -Infinity, tK = null; for (const s of samples) if (s.K > kMax) { kMax = s.K; tK = s.t; }
  const at = (t) => samples.reduce((b, s) => (Math.abs(s.t - t) < Math.abs(b.t - t) ? s : b), samples[0]);
  return { n, E0, T: rt(last.t), tEsc: esc ? rt(esc.t) : null, tBurst: burst ? rt(burst.t) : null, nEscT: last.nEsc, vEscMaxT: last.vEscMax, rMedT: last.rMed, rMaxT: last.rMax,
    KMax: kMax, tKMax: rt(tK), K160: at(160).K, R160: at(160).R, RT: last.R, WT: last.W, vMaxT: last.vMax };
}
const zeros = (n) => new Float64Array(n);

/* ── 本体の走行 ─────────────────────────────────────────── */
export function engineRun(HP, job) {
  const S = buildVariant(HP, job.id, job.variant), n = S.n, dt = job.dt, N = Math.round(job.T / dt), every = Math.round(EVERY / dt), d3 = S.coord3d === true;
  const G = S.params.G, eg2 = (S.params.softening || 0) ** 2, m = Float64Array.from(S.m.subarray(0, n)), Z0 = zeros(n);
  const Zs = () => (d3 ? S.z : Z0), VZs = () => (d3 ? S.vz : Z0);
  const Uof = (x, y, z) => { let U = 0; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { const dx = x[j] - x[i], dy = y[j] - y[i], dz = z[j] - z[i]; U -= G * m[i] * m[j] / Math.sqrt(dx * dx + dy * dy + dz * dz + eg2); } return U; };
  const Kof = () => { const vz = VZs(); let K = 0; for (let i = 0; i < n; i++) K += 0.5 * m[i] * (S.vx[i] * S.vx[i] + S.vy[i] * S.vy[i] + vz[i] * vz[i]); return K; };
  const E0 = Kof() + Uof(S.x, S.y, Zs());
  const led = job.ledger ? { kickK: 0, driftU: 0, transportU: 0 } : null;
  const xc = zeros(n), yc = zeros(n), zc = zeros(n);
  let K0 = led ? Kof() : 0, U0 = led ? Uof(S.x, S.y, Zs()) : 0, nanAt = null, failAt = null;
  const samples = [], fps = [];
  const take = () => { const W = S.inertialDragWork || 0;
    const s = sampleOf(n, S.x, S.y, Zs(), S.vx, S.vy, VZs(), [S._rdUX, S._rdUY, d3 ? S._rdUZ : null], m, G, eg2, { t: S.t, W });
    s.R = s.K + s.U - E0 - W; samples.push(s); if (job.fp) fps.push(fpXY(S.x, S.y, S.vx, S.vy, n)); };
  take();
  for (let k = 1; k <= N; k++) {
    S.step(dt);
    if (led) {   // 本体の 1 步を重力の段と移送に分ける: 移送の前の座標 x_core = x − u·dt(移送したのは受け手だけ —— pinned と履歴なしの步は u = 0)
      const z = Zs();
      for (let i = 0; i < n; i++) { const ux = S._rdUX[i], uy = S._rdUY[i], uz = d3 ? S._rdUZ[i] : 0;
        xc[i] = (ux !== 0) ? S.x[i] - ux * dt : S.x[i]; yc[i] = (uy !== 0) ? S.y[i] - uy * dt : S.y[i]; zc[i] = (uz !== 0) ? z[i] - uz * dt : z[i]; }
      const K1 = Kof(), Uc = Uof(xc, yc, zc), U1 = Uof(S.x, S.y, z);
      led.kickK += K1 - K0; led.driftU += Uc - U0; led.transportU += U1 - Uc; K0 = K1; U0 = U1;
    }
    if (nanAt === null && S.hasNaN()) { nanAt = k; break; }
    if (failAt === null && S.inertialDragHalt === true) failAt = k;
    if (k % every === 0 || k === N) take();
  }
  if (led) { led.engineWork = S.inertialDragWork; led.splitResidual = led.kickK + led.driftU; led.transportVsEngineRel = Math.abs(led.transportU - S.inertialDragWork) / Math.max(1, Math.abs(S.inertialDragWork)); }
  const st = HP.inertialDragState(S), ch = (st && st.compose && st.compose.chain) || {};
  return { kind: 'engine', id: job.id, variant: job.variant, dt, steps: N, samples, fps: job.fp ? fps : undefined, ledger: led || undefined,
    nanAt, failAt, solveFail: (ch.fail !== undefined) ? ch.fail : null, itersMax: (ch.itersMax !== undefined) ? ch.itersMax : null, summary: summarize(samples, E0, n) };
}

/* ── 独立な器の走行(rk4 / rk2 / split / semic)—— t = 0 の build の状態から(1 步目から u を解く) ── */
export function coupledRun(HP, job) {
  const S = buildVariant(HP, job.id, job.variant);
  const { sys, st } = L.systemFromSim(S, HP.inertialSpinMoment, HP.dfmGaussLegendre01(HP.REL_DRAG_SPIN_NODES));
  const I = L.makeIntegrator(sys, job.scheme), dt = job.dt, N = Math.round(job.T / dt), every = Math.round(EVERY / dt), n = sys.n;
  const E0 = L.kinetic(sys, st.vx, st.vy, st.vz) + L.potential(sys, st.x, st.y, st.z);
  const samples = []; let nanAt = null;
  const take = () => { const uk = I.uNow(st); const s = sampleOf(n, st.x, st.y, st.z, st.vx, st.vy, st.vz, [uk.ux, uk.uy, uk.uz], sys.m, sys.G, sys.eg2, { t: st.t, W: st.W }); s.R = s.K + s.U - E0 - st.W; samples.push(s); };
  take();
  for (let k = 1; k <= N; k++) { I.step(st, dt); if (!Number.isFinite(st.x[1]) || !Number.isFinite(st.vx[1])) { nanAt = k; break; } if (k % every === 0 || k === N) take(); }
  return { kind: 'coupled', id: job.id, variant: job.variant, scheme: job.scheme, dt, steps: N, samples, nanAt,
    ledger: job.scheme === 'split' ? Object.assign({}, I.led, { splitResidual: I.led.kickK + I.led.driftU }) : undefined, summary: summarize(samples, E0, n) };
}

/* ── ② 器の検証(本体の 1 步目〔履歴なし〕の後から 2000 步) ── */
export function validate(HP, id) {
  const S = buildVariant(HP, id, 'base'); S.step(H0);
  const d3 = S.coord3d === true;
  const { sys, st } = L.systemFromSim(S, HP.inertialSpinMoment, HP.dfmGaussLegendre01(HP.REL_DRAG_SPIN_NODES));
  const I = L.makeIntegrator(sys, 'split'), n = sys.n, ws = L.makeWork(n), ux = zeros(n), uy = zeros(n), uz = zeros(n);
  let posMax = 0, uRelMax = 0;
  for (let k = 0; k < 2000; k++) {
    I.step(st, H0); S.step(H0);
    if ((k + 1) % 200 === 0) {
      const Z = d3 ? S.z : zeros(n), UZ = d3 ? S._rdUZ : zeros(n), VZ = d3 ? S.vz : zeros(n);
      for (let i = 0; i < n; i++) posMax = Math.max(posMax, Math.hypot(st.x[i] - S.x[i], st.y[i] - S.y[i], st.z[i] - Z[i]));
      const xc = zeros(n), yc = zeros(n), zc = zeros(n);
      for (let i = 0; i < n; i++) { xc[i] = S.x[i] - S._rdUX[i] * H0; yc[i] = S.y[i] - S._rdUY[i] * H0; zc[i] = Z[i] - UZ[i] * H0; }
      L.uSolve(sys, xc, yc, zc, Float64Array.from(S.vx.subarray(0, n)), Float64Array.from(S.vy.subarray(0, n)), Float64Array.from(VZ.subarray(0, n)), ux, uy, uz, ws);
      let du = 0, um = 0; for (let i = 0; i < n; i++) { du = Math.max(du, Math.hypot(ux[i] - S._rdUX[i], uy[i] - S._rdUY[i], uz[i] - UZ[i])); um = Math.max(um, Math.hypot(ux[i], uy[i], uz[i])); }
      uRelMax = Math.max(uRelMax, du / um);
    }
  }
  return { id, d3, steps: 2000, posDiffMax: posMax, uRelDiffMax: uRelMax, solverTol: S.relDrag.solverTol || 1e-10 };
}

/* 仕事の一覧 */
export function jobs(HP) {
  const J = [], cd = 'chainDiskToy';
  J.push({ key: 'A.base', kind: 'engine', id: cd, variant: 'base', dt: H0, T: T_MAIN, ledger: true, fp: true });
  J.push({ key: 'A.normNone', kind: 'engine', id: cd, variant: 'normNone', dt: H0, T: T_MAIN, fp: true });
  J.push({ key: 'A.3d', kind: 'engine', id: 'chainDiskToy3d', variant: 'base', dt: H0, T: T_MAIN, fp: true });
  J.push({ key: 'B.validate', kind: 'validate', id: cd });
  J.push({ key: 'B.validate3d', kind: 'validate', id: COPY_ID });
  for (const d of [2, 4, 8]) J.push({ key: 'C.engine.' + d, kind: 'engine', id: cd, variant: 'base', dt: H0 / d, T: T_MAIN, ledger: true });
  for (const d of [1, 2, 4]) J.push({ key: 'C.rk4.' + d, kind: 'coupled', scheme: 'rk4', id: cd, variant: 'base', dt: H0 / d, T: T_MAIN });
  for (const d of [1, 2]) J.push({ key: 'C.rk2.' + d, kind: 'coupled', scheme: 'rk2', id: cd, variant: 'base', dt: H0 / d, T: T_MAIN });
  J.push({ key: 'C.split.1', kind: 'coupled', scheme: 'split', id: cd, variant: 'base', dt: H0, T: T_MAIN });
  for (const d of [1, 2, 4]) J.push({ key: 'C.semic.' + d, kind: 'coupled', scheme: 'semic', id: cd, variant: 'base', dt: H0 / d, T: T_MAIN });
  for (const v of ['gain0', 'spin0', 'seedA', 'seedB', 'n40', 'n120', 'gain4', 'gain16']) {
    J.push({ key: 'D.engine.' + v, kind: 'engine', id: cd, variant: v, dt: H0, T: T_MAIN });
    J.push({ key: 'D.rk4.' + v, kind: 'coupled', scheme: 'rk4', id: cd, variant: v, dt: H0, T: T_MAIN });
  }
  J.push({ key: 'D.rk4.n40.2', kind: 'coupled', scheme: 'rk4', id: cd, variant: 'n40', dt: H0 / 2, T: T_MAIN });
  for (const d of [1, 2]) J.push({ key: 'E.rk4.' + d, kind: 'coupled', scheme: 'rk4', id: cd, variant: 'base', dt: H0 / d, T: T_LONG });
  // ⑥ 探索の写し(宣言の刻み stepDt を本から読む)
  const cp = HP ? find(HP, COPY_ID) : null, hc = (cp && cp.physics && cp.physics.stepDt) || 0.002;
  for (const d of [1, 2, 4, 8, 16]) J.push({ key: 'F.engine.' + d, kind: 'engine', id: COPY_ID, variant: 'base', dt: H0 / d, T: T_COPY, ledger: (H0 / d === hc) });
  for (const d of [1, 2]) J.push({ key: 'F.rk4.' + d, kind: 'coupled', scheme: 'rk4', id: COPY_ID, variant: 'base', dt: H0 / d, T: T_COPY });
  for (const v of ['gain0', 'spin0', 'rot1', 'rot2', 'shell80']) {
    J.push({ key: 'G.engine.' + v, kind: 'engine', id: COPY_ID, variant: v, dt: hc, T: T_COPY });
    J.push({ key: 'G.rk4.' + v, kind: 'coupled', scheme: 'rk4', id: COPY_ID, variant: v, dt: H0, T: T_COPY });
  }
  return J;
}
function runJob(HP, job) {
  const t0 = Date.now();
  const r = job.kind === 'validate' ? validate(HP, job.id) : (job.kind === 'engine' ? engineRun(HP, job) : coupledRun(HP, job));
  r.wallSec = (Date.now() - t0) / 1000; return r;
}

/* 束ねる: 判定の門 */
const relD = (a, b) => Math.abs(a - b) / Math.max(Math.abs(b), 1e-300);
const conv = (a, b) => { let m = 0; for (let i = 0; i < Math.min(a.samples.length, b.samples.length); i++) m = Math.max(m, relD(a.samples[i].K, b.samples[i].K), relD(a.samples[i].rMed, b.samples[i].rMed)); return m; };
export function gatesOf(R, HP) {
  const A = R['A.base'], An = R['A.normNone'], A3 = R['A.3d'];
  const same = (a, b) => a.fps.length === b.fps.length && a.fps.every((f, i) => f === b.fps[i]);
  const rk4Conv288 = conv(R['C.rk4.1'], R['C.rk4.2']), rk4Conv480 = conv(R['E.rk4.1'], R['E.rk4.2']), n40Conv = conv(R['D.rk4.n40'], R['D.rk4.n40.2']);
  const engK160 = [1, 2, 4, 8].map((d) => (d === 1 ? A : R['C.engine.' + d]).summary.K160), rkK160 = R['C.rk4.4'].summary.K160;
  const engErr160 = engK160.map((k) => Math.abs(k - rkK160));
  const copyConv = conv(R['F.rk4.1'], R['F.rk4.2']);
  const tB = (k) => R[k].summary.tBurst;
  const copyErr = [1, 2, 4, 8, 16].map((d) => Math.abs(tB('F.engine.' + d) - tB('F.rk4.2')));
  const cp = HP ? find(HP, COPY_ID) : null, hc = cp ? cp.physics.stepDt : null, hcKey = hc ? 'F.engine.' + Math.round(H0 / hc) : null;
  const nCopy = R['F.rk4.1'].summary.n - 1;
  const ledgerOk = (k) => Math.abs(R[k].summary.RT) <= 1e-6 * Math.max(1, Math.abs(R[k].summary.WT));
  return {
    reproduced: A.summary.tBurst !== null && A.summary.rMaxT > 1000 && A.nanAt === null && A.solveFail === 0,
    normNoneBitsame: same(A, An), threeDxyBitsame: same(A, A3),
    ledgerMatchesEngine: A.ledger.transportVsEngineRel <= 1e-9,
    splitHarnessMatches: ['B.validate', 'B.validate3d'].every((k) => R[k].posDiffMax <= 1e-6 && R[k].uRelDiffMax <= 1e-6),
    rk4LedgerCloses: ['C.rk4.1', 'C.rk4.2', 'C.rk4.4', 'E.rk4.1', 'E.rk4.2', 'F.rk4.1', 'F.rk4.2'].every(ledgerOk),
    rk4StepConverged288: rk4Conv288 <= 1e-3,
    engineApproachesRk4: engErr160[3] < engErr160[0] && engErr160[2] < engErr160[0],
    chainDiskBurstEarlyNumerical: A.summary.tBurst !== null && R['C.rk4.1'].summary.tBurst === null && R['C.rk4.2'].summary.tBurst === null && R['E.rk4.1'].summary.tBurst === null,
    mechanismConvergedN40: n40Conv <= 1e-3 && tB('D.rk4.n40') !== null && tB('D.rk4.n40.2') !== null,
    copyDeclared: !!(cp && hc && R[hcKey]),
    copyBurstConverged: copyConv <= 1e-3 && tB('F.rk4.1') !== null && tB('F.rk4.2') !== null && R['F.rk4.2'].summary.nEscT >= 0.75 * nCopy,
    // 本体の刻みを細かくすると放出の時刻が rk4 に近づく(0.016 の差より宣言の刻みの差が小さい)・宣言の刻み以下では差 ≤ 4 標本(放出の時刻は塊の配置に敏感 —— 標本 8 単位)
    copyEngineConverges: copyErr.every((e) => Number.isFinite(e)) && copyErr[3] < copyErr[0] && copyErr[3] <= 4 * EVERY && copyErr[4] <= 4 * EVERY,
    copyDeclaredStepBursts: !!(hcKey && R[hcKey] && R[hcKey].summary.tBurst !== null && R[hcKey].summary.nEscT >= 0.75 * nCopy && R[hcKey].nanAt === null && R[hcKey].solveFail === 0),
    copyGain0NoBurst: tB('G.rk4.gain0') === null && tB('G.engine.gain0') === null,
    copyRobust: ['G.rk4.rot1', 'G.rk4.rot2', 'G.rk4.shell80'].every((k) => tB(k) !== null),
    numbers: { rk4Conv288, rk4Conv480, n40Conv, engK160, rkK160, engErr160, copyConv, copyErr, copyStepDt: hc },
  };
}
/* 🔗 と 🧨 の宣言(QA が html の宣言と照合する —— 正本はこの条件の記録) */
export function condOf(HP) {
  const p = find(HP, 'chainDiskToy'), ph = p.physics, rd = ph.relativeDrag, c = p.bodies[0], d = p.bodies[1];
  const q = find(HP, COPY_ID);
  const copy = q ? { id: q.id, stepDt: q.physics.stepDt, coord: q.physics.coord, gain: W302A.rdGainOf(q.physics.relativeDrag), eps: q.physics.relativeDrag.eps, G: q.physics.G, softening: q.physics.softening,
    center: { m: q.bodies[0].m, radius: q.bodies[0].radius, spin: q.bodies[0].spin, pinned: q.bodies[0].pinned }, shellVersion: SHELL_VERSION, shell: shellStats(q.bodies.slice(1)) } : null;
  return { id: p.id, seed: p.seed, G: ph.G, softening: ph.softening, integrator: p.integrator || 'semi', gain: W302A.rdGainOf(rd), eps: rd.eps, pairs: rd.pairs, solver: rd.solver, spinSource: rd.spinSource,
    center: { m: c.m, radius: c.radius, spin: c.spin, pinned: c.pinned }, disk: { n: d.n, m: d.mMin, radius: d.radius }, copy };
}
/* 写しを作るか(R182 の規則: 飛びが刻みで収束して残るなら探索の写し 1 本・刻みで消えるなら「数値の飛び」と記録して写しは作らない) */
export function decisionOf(R, g) {
  const e = (k) => R[k].summary.nEscT;
  const mech = g.mechanismConvergedN40 === true && g.copyBurstConverged === true;
  return { chainDiskBurstEarlyNumerical: g.chainDiskBurstEarlyNumerical === true, mechanismConverged: mech, copy: mech, copyId: mech ? COPY_ID : null,
    escByStep: { engine: [1, 2, 4, 8].map((d) => e(d === 1 ? 'A.base' : 'C.engine.' + d)), rk4: [1, 2, 4].map((d) => e('C.rk4.' + d)) },
    why: mech ? '🔗 の既定の刻み(h = 0.016)で円盤の大半が飛ぶのは本体の分割で早まった分(刻みを細かくすると半径 100 を越える数が減り、結合積分 rk4 では t = 480 まで大半は飛ばない)。'
      + 'ただし機構(引きずりの支える仕事で慣性速度が積み上がり、塊がほどけて放出する)は刻みで収束した解に残る(🔗 の粒子 40 個の変種・三次元の殻)—— 探索の写し 1 本(🧨)を作る'
      : '飛びが刻みで消える —— 数値の飛びとして記録し、写しは作らない' };
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN && process.env.W301D_JOB) {   // 子プロセス: 1 つの仕事を走らせて JSON を書く
  const job = JSON.parse(process.env.W301D_JOB);
  const { HP } = loadHtmlMain(path.join(ROOT, TARGET));
  const r = runJob(HP, job); r.key = job.key;
  fs.writeFileSync(process.env.W301D_JOBOUT, JSON.stringify(r));
  process.exit(0);
} else if (IS_MAIN) {
  const t0 = Date.now();
  const OUT_PATH = process.env.W301D_OUT || path.join(ROOT, 'tests', 'out', 'chainburst-w301d.json');
  const PAR = Math.max(1, +(process.env.W301D_PAR || 2));
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
  const ONLY = process.env.W301D_ONLY ? new RegExp(process.env.W301D_ONLY) : null;
  if (ENGINE_ORDER !== 'split' && !ONLY) { console.error('W301D_ORDER=' + ENGINE_ORDER + ' は W301D_ONLY と一緒にだけ(正本は分割の本体の記録 —— 第302便d)'); process.exit(2); }
  const list = jobs(HP).filter((j) => !ONLY || ONLY.test(j.key));
  const tmpDir = fs.mkdtempSync(path.join(path.dirname(OUT_PATH), '.w301d-'));
  const R = {};
  await new Promise((resolve, reject) => {
    let next = 0, live = 0;
    const launch = () => {
      if (next >= list.length && live === 0) return resolve();
      while (live < PAR && next < list.length) {
        const job = list[next++], jo = path.join(tmpDir, job.key + '.json'); live++;
        const c = spawn(process.execPath, [fileURLToPath(import.meta.url)], { env: Object.assign({}, process.env, { W301D_JOB: JSON.stringify(job), W301D_JOBOUT: jo }), stdio: ['ignore', 'ignore', 'inherit'] });
        c.on('exit', (code) => { live--; if (code !== 0) return reject(new Error(job.key + ' exit ' + code));
          R[job.key] = JSON.parse(fs.readFileSync(jo, 'utf8')); fs.unlinkSync(jo);
          const s = R[job.key].summary; console.log(job.key + ' ' + (s ? JSON.stringify({ tEsc: s.tEsc, tBurst: s.tBurst, nEscT: s.nEscT, vEsc: +s.vEscMaxT.toPrecision(3), rMedT: +s.rMedT.toPrecision(4), KMax: +s.KMax.toPrecision(4), RT: +s.RT.toPrecision(4) }) : JSON.stringify(R[job.key])) + ' (' + R[job.key].wallSec.toFixed(0) + ' s)');
          launch(); });
      }
    };
    launch();
  });
  fs.rmSync(tmpDir, { recursive: true, force: true });
  const ordered = {}; for (const j of list) ordered[j.key] = R[j.key];
  const out = { meta: null, rEsc: R_ESC, h: H0, every: EVERY, cond: condOf(HP), results: ordered };
  if (!ONLY) { out.gates = gatesOf(R, HP); const { numbers, ...g } = out.gates; out.ok = Object.values(g).every(Boolean); out.decision = decisionOf(R, out.gates); }
  const CODE = ['tests/exp-w301d-chainburst.mjs', 'tests/lib-w301d-coupled.mjs', 'tests/lib-w301d-shell.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第301便d', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, engineOrder: (typeof globalThis.relDragStepOrderOf === 'function') ? ENGINE_ORDER : 'split(基点の世代 —— 鍵なし)', coupledLibVersion: L.COUPLED_LIB_VERSION, shellVersion: SHELL_VERSION, dragVersion: HP.REL_DRAG_INERTIAL_VERSION, loadErrors: errors.length, parallel: PAR,
    ruling: '原仮定者の裁定(第91報)④(chainDiskToy 系が 14000 歩付近で爆発するのが興味深い。超新星爆発サンプルへの応用の可能性を探る)',
    reading: '統括の検証項目 R182(新法則で飛びが残るか・結合積分の独立な器と今の分割の比較・帳簿の分離・刻みで収束するなら探索の写し 1 本 / 消えるなら数値の飛びとして記録)',
    notClaim: ['超新星の機構を導いた', '爆発を再現した', 'gain は普遍定数'] });
  out.elapsedS = (Date.now() - t0) / 1000;
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 1) + '\n');
  if (out.gates) console.log('gates ' + JSON.stringify(out.gates));
  console.log('→ ' + path.relative(ROOT, OUT_PATH) + '(' + out.elapsedS.toFixed(1) + ' s)・ok ' + out.ok);
  process.exit(ONLY || out.ok ? 0 : 1);
}
