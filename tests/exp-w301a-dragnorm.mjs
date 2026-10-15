// 第301便a(原仮定者の裁定(第91報)⑤「慣性決定力場が空間位置を決めているので、引きずりの強さは慣性決定力の総和で割る。総和には背景慣性決定力を含む。
// シミュレーション対象が背景慣性決定力場に合わせて動く慣性系なので、背景慣性決定力による相対的な引きずりの大きさはゼロ。現状のサンプルにも適用する。
// 結果が変わるサンプルは再フィットする」・統括の検証項目 R179)—— **引きずりの強さの正規化 relativeDrag.norm の器**(Node だけ —— 対象 html の inline script を
// tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、アプリの步〔dfmInertialDragStep・dfmInertialDragStep3〕をそのまま走らせる)。
//
// ■ 法則(html の inertialDragNormOf・inertialDragNormApply —— 1 か所)
//   受け手 i の総和 W_i = W_bg + Σ_j w_ij(w_ij = m_j 𝒦_j(r_ij) —— 分子と同じ核・宣言した対だけ)。正規化の因子 ν_i = W_bg/W_i を
//   並進(s と a_ij の行)・回転引きずり(s に足した項)・軸引きずり(ω_i)に掛ける。gain = C_d/W_bg [L³/M](旧法則の係数の意味のまま)。
//   W_bg の既定は 1/gain(C_d = 1)—— このとき Σw/W_bg = deg_i(旧法則の行和)。
//
// ■ 段(正本 tests/out/dragnorm-w301a.json —— 段 dragnorm-301a)
//   ① 零試験(エンジン): 源 1 つの閉じた形 / W_bg→∞(宣言 background 1e30)で旧法則とビット同一 / C_d=1 で W_bg→0(gain 1e9)の極限 = 加重平均の相対速度 /
//      gain 0 で正規化の有無がビット同一 / 宣言した対の外の源は分母に入らない / 3 成分(行和・軸引きずりの ω)に同じ ν / 連鎖の PCG(重み m_i/ν_i)の収束
//   ② 境目の表: 慣性決定力の引きずりを宣言した本ごと(在位 17・退役)の Σw/W_bg の中央と最大(2000 步・20 步ごと)・W_bg(本の単位と kg/m³)
//      と、宇宙の平均密度から導いた背景 W_cos(核 K_ε を一様な球〔臨界密度・半径 c/H₀〕で積分)との比
//   ③ 旧法則と新法則の差(フィットの本の目的の量 —— 旧 gain のまま): 🟫 近点率の差・🟪 公転周期
//   ④ 候補 (iii) の実測: 🟫 に W_bg = W_cos を宣言し C_d を振る —— 近点率の差と周期
//   ⑤ 🔗 chainDiskToy の 18000 步(旧法則で 14000 步付近に飛ぶ —— 第 2 段 d の入力): 最大半径・最大の |u|・NaN・未収束
//
// ■ しないこと・言わないこと
//   ・「現実を再現した」「gain は普遍定数」「再現しない」「合わせられない」と書かない。届かないものは「この探索範囲では未達 —— 次の見直し」。
//
// 実行(Node だけ・1 プロセス):
//   node tests/exp-w301a-dragnorm.mjs          → 正本 tests/out/dragnorm-w301a.json(W301A_OUT で出力先を変える)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as C from './exp-w295c-inertial3.mjs';
import * as W302A from './lib-w302a-wbg.mjs';   // 第302便a: gain ⇔ W_bg の読み書き(器の側)
import { pinDecl302, DECL302_DATA_FILE } from './lib-w303a-pre.mjs';   // 第303便a: 第302便の本の宣言の写し(この正本は第302便の宣言で測った歴史の記録 —— 器の中だけ・html と署名は変えない)
import { pinDecl303, DECL303_DATA_FILE } from './lib-w304c-pre.mjs';   // 第304便c: 第303便の 🌦️🌔 の宣言の写し(pinDecl302 の前に —— 軟化・初期配置・引きずりの宣言を第303便へ戻してから第302便の欄を戻す・歴史の値を保つ)
const REGEN_SCOPE = {"presets":"all","roots":["HP.DRAG_CORE_RMAX_FACTOR","HP.DRAG_CORE_VERSION","HP.REL_DRAG_COMPOSE_DEFAULT","HP.REL_DRAG_INERTIAL_VERSION","HP.REL_DRAG_NORM_VERSION","HP.REL_DRAG_SOLVE_FROM_DEFAULT","HP.allPresets","HP.dfmMeshVelocityFieldAt","HP.dragCoreLookup","HP.dragCoreState","HP.geoEffectiveMode","HP.geoLawOfSim","HP.inertialDragNormOf","HP.inertialDragState","HP.relDragBackgroundOf","HP.relDragStepOrderOf","HP.sim","HP.validatePreset"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w301a-dragnorm-1';
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const clone = (x) => JSON.parse(JSON.stringify(x));
const find = (HP, id) => HP.allPresets().find((q) => q.id === id);
const fp = (S) => { let h = 0x811c9dc5; const f = new Float64Array(1), u8 = new Uint8Array(f.buffer);
  for (const k of ['x', 'y', 'z', 'vx', 'vy', 'vz', 'spin', 'sax', 'say', 'saz', 'rotA']) { const A = S[k]; if (!A) continue; for (let i = 0; i < S.n; i++) { f[0] = A[i]; for (let j = 0; j < 8; j++) h = Math.imul(h ^ u8[j], 16777619) >>> 0; } }
  return h.toString(16); };
const build = (HP, p) => { const v = HP.validatePreset(clone(p)); if (!v.ok) throw new Error('validatePreset: ' + JSON.stringify(v.errors).slice(0, 200)); HP.sim.build(v.preset); return HP.sim; };
const stepDtOf = (p) => (typeof (p.physics || {}).stepDt === 'number') ? p.physics.stepDt : 0.016;

/* 宇宙の平均密度から導く背景(候補 iii)—— 核 K_ε(r)=r/(r²+ε²)² を一様な密度 ρ の球(半径 R)で積分:
   ∫₀^R 4πr² ρ K_ε dr = 2πρ [ln((R²+ε²)/ε²) + ε²/(R²+ε²) − 1]。ρ = 臨界密度 3H₀²/(8πG)・R = c/H₀(H₀ = 67.4 km/s/Mpc)。 */
export const COSMO = Object.freeze({ H0kmsMpc: 67.4, Mpc: 3.0857e22, G: 6.674e-11, c: 2.99792458e8 });
export function cosmicBackground(scaleExp, eps) {
  const H0 = COSMO.H0kmsMpc * 1e3 / COSMO.Mpc, rho = 3 * H0 * H0 / (8 * Math.PI * COSMO.G), R = COSMO.c / H0;   // SI
  const Lm = Math.pow(10, scaleExp.L), dens = Math.pow(10, scaleExp.M) / Math.pow(10, 3 * scaleExp.L);   // 本の 1 長さ [m]・1 密度 [kg/m³]
  const Rb = R / Lm, rb = rho / dens, e2 = eps * eps;
  const W = 2 * Math.PI * rb * (Math.log((Rb * Rb + e2) / e2) + e2 / (Rb * Rb + e2) - 1);
  return { H0, rhoSI: rho, RSI: R, Wbook: W, WSI: W * dens };
}

/* ── ① 零試験 ─────────────────────────────────────────── */
let TOY_BASE = null;   // 🐌 inertialDragPair の写し(宣言の器だけを借りる —— bodies と relativeDrag を差し替える・G 0)
function toy(bodies, rd) {
  const q = clone(TOY_BASE); q.id = 'w301aToy'; q.bodies = bodies; q.physics.G = 0; q.physics.relativeDrag = rd; q.physics.contactMode = 'none';
  delete q.abBody; delete q.fitRecord; return q;
}
const B = (x, y, vx, vy, m, pinned) => ({ type: 'single', m, radius: 0.5, x, y, vx, vy, spin: 0, pinned: !!pinned });
export function part1(HP) {
  TOY_BASE = find(HP, 'inertialDragPair');
  const out = {};
  // z1: 源 1 つ(pinned・速度 1)・受け手 1 つ(静止)—— 合成則 solve(n=2)。既定(W_bg = 1/gain・C_d = 1): u = a/(1+a)·Δv = w/(W_bg + w)·Δv(第293便g の solve のまま)/
  //     宣言 background W(C_d = gain·W): u = a/(1 + w/W)·Δv = C_d w/(W + w)·Δv / norm:"none": u = a/(1+a)·Δv
  const z1 = (patch) => { const rd = Object.assign({ law: 'inertial', gain: 0.5, eps: 0.05, pairs: 'all', history: 'positions' }, patch);
    const S = build(HP, toy([B(0, 0, 0, 1, 1000, true), B(10, 0, 0, 0, 1)], rd)); S.step(0.001);
    const dx = S.x[1] - S.x[0], dy = S.y[1] - S.y[0], r2 = dx * dx + dy * dy, w = 1000 * Math.sqrt(r2) / ((r2 + 0.0025) ** 2);   // 入口の距離(1 步目は履歴なしで移送 0)
    S.step(0.001); return { u: S._rdUY[1], w, vrel: 1 }; };
  const rel = (x, y) => Math.abs(x - y) / Math.max(Math.abs(y), 1e-300);
  const zD = z1({}), zN = z1({ norm: 'none' }), WB = 2000, zB = z1({ background: WB, gain: 0.25 / WB });   // C_d = 0.25
  out.z1 = { w: zD.w, uDefault: zD.u, uNone: zN.u, uDeclared: zB.u, wantDefault: zD.w / (1 / 0.5 + zD.w), wantDeclared: 0.25 * zB.w / (WB + zB.w),
    defaultEqNone: zD.u === zN.u, relErr: Math.max(rel(zD.u, zD.w / (2 + zD.w)), rel(zB.u, 0.25 * zB.w / (WB + zB.w))) };
  // z2: W_bg ≫ Σw(宣言 background 1e8・C_d 0.5 → gain = 5e-9)は加算の旧法則 u = gain·w·Δv(compose:"sum" の値)に Σw/W_bg の相対で一致 /
  //     既定の本(🟫 —— 背景を宣言しない)は norm:"none" と 3000 步ビット同一
  { const zL = z1({ background: 1e8, gain: 0.5 / 1e8 });
    out.z2 = { uLargeBg: zL.u, wantLinear: (0.5 / 1e8) * zL.w, relErr: rel(zL.u, (0.5 / 1e8) * zL.w), xLargeBg: zL.w / 1e8 };
    const p = find(HP, 'mercurySunInertialFit'), dt = stepDtOf(p);
    // 第302便(統合): 凍結比較(norm:"none" など)は W302A.rdPatch で gain の宣言へ戻して重ねる(Wbg との併用は受理器が拒否)
    const run = (patch) => { const q = clone(p); W302A.rdPatch(q.physics.relativeDrag, patch); const S = build(HP, q); for (let k = 0; k < 3000; k++) S.step(dt); return fp(S); };
    out.z2.book = 'mercurySunInertialFit'; out.z2.steps = 3000; out.z2.defaultEqNone = run({ norm: 'none' }) === run({}); }
  // z3: C_d = 1(既定)で W_bg = 1/gain → 0(gain 1e9): u_i → Σ w (v_j − v_i)/Σ w(源 2 つ・pinned・速度 (1,0) と (0,2)・受け手は静止)
  { const rd = { law: 'inertial', gain: 1e9, eps: 0.05, pairs: 'all', history: 'positions' };
    const S = build(HP, toy([B(-10, 0, 1, 0, 300, true), B(0, 15, 0, 2, 700, true), B(0, 0, 0, 0, 1)], rd)); S.step(1e-6);
    let sw = 0, sx = 0, sy = 0; for (const j of [0, 1]) { const dx = S.x[j] - S.x[2], dy = S.y[j] - S.y[2], r2 = dx * dx + dy * dy, s = r2 + 0.0025, w = S.m[j] * Math.sqrt(r2) / (s * s); sw += w; sx += w * S.vx[j]; sy += w * S.vy[j]; }
    S.step(1e-6);
    const want = [sx / sw, sy / sw], got = [S._rdUX[2], S._rdUY[2]];
    out.z3 = { gain: 1e9, got, want, relErr: Math.hypot(got[0] - want[0], got[1] - want[1]) / Math.hypot(want[0], want[1]) }; }
  // z4: gain 0 の本は正規化の有無でビット同一(🌋・🍩 —— 400 步)
  out.z4 = ['venusSunInertial3d', 'saturnRingInertial3d'].map((id) => { const p = find(HP, id), dt = stepDtOf(p);
    const run = (patch) => { const q = clone(p); W302A.rdPatch(q.physics.relativeDrag, patch); const S = build(HP, q); for (let k = 0; k < 400; k++) S.step(dt); return { f: fp(S), norm: !!(HP.inertialDragState(S) || {}).norm }; };
    const a = run({ norm: 'none' }), b = run({}); return { id, same: a.f === b.f, normKey: b.norm }; });
  // z5: 宣言した対の外の源(pairs [[0,2]] —— 源 1 は受け手 2 の対でない)は分母に入らない: 源 1 の質量を 10 倍にしても受け手 2 の x = Σw/W_bg と u は同じ
  { const run = (m1) => { const rd = { law: 'inertial', gain: 0.02 / 50, background: 50, eps: 0.05, pairs: [[0, 2]], history: 'positions' };
      const S = build(HP, toy([B(-10, 0, 1, 0, 300, true), B(0, 3, 0, 2, m1, true), B(0, 0, 0, 0, 1)], rd)); S.step(1e-3); S.step(1e-3);
      return { x: S._rdDeg[2], u: [S._rdUX[2], S._rdUY[2]] }; };
    const a = run(100), b = run(1000);
    out.z5 = { xA: a.x, xB: b.x, same: a.x === b.x && a.u[0] === b.u[0] && a.u[1] === b.u[1], xPos: a.x > 0 }; }
  // z6: 3 成分に同じ分母 —— 🪛(軸引きずり on)の 2 步目: 並進・回転の行(行和 deg)は第301便a の前と同じ(solve の 1+deg がすでに総和で割る)・
  //     軸引きずりの ω は前の値 × ν(ν = 1/(1+deg) —— ビット)
  { const p = find(HP, 'chainDiskToy3dTilt'), dt = stepDtOf(p);
    const run = (patch) => { const q = clone(p); W302A.rdPatch(q.physics.relativeDrag, patch); const S = build(HP, q); S.step(dt); S.step(dt);
      return { DG: Array.from(S._rdDeg.subarray(0, S.n)), WX: Array.from(S._rdWX.subarray(0, S.n)), WZ: Array.from(S._rdWZ.subarray(0, S.n)), UX: Array.from(S._rdUX.subarray(0, S.n)), pin: Array.from(S.pinned.subarray(0, S.n)) }; };
    const o = run({ norm: 'none' }), t = run({});
    let bad = 0, nuMin = 1, nuMax = 0, nAx = 0;
    for (let i = 0; i < o.DG.length; i++) {
      const nu = (o.DG[i] > 0) ? 1 / (1 + o.DG[i]) : 1;
      if (t.DG[i] !== o.DG[i] || t.UX[i] !== o.UX[i]) bad++;
      if (t.WX[i] !== o.WX[i] * nu || t.WZ[i] !== o.WZ[i] * nu) bad++;
      if (o.WZ[i] !== 0) nAx++;
      if (!o.pin[i] && o.DG[i] > 0) { nuMin = Math.min(nuMin, nu); nuMax = Math.max(nuMax, nu); }
    }
    out.z6 = { book: 'chainDiskToy3dTilt', n: o.DG.length, bad, axialReceivers: nAx, nuMin, nuMax }; }
  // z7: 連鎖の PCG —— 背景を宣言した 🍥 の写し(C_d 0.5・W_bg = 0.5/gain —— 行の対角 1+x)の 300 步: 未収束 0・残差の最大 ≤ solverTol
  { const p = clone(find(HP, 'chainSpreadToy3d')); const g302 = W302A.rdGainOf(p.physics.relativeDrag); W302A.rdPatch(p.physics.relativeDrag, { gain: g302, background: 0.5 / g302 });   // 第302便a: background は旧法則の凍結比較(gain で書く)
    const dt = stepDtOf(p), S = build(HP, p); for (let k = 0; k < 300; k++) S.step(dt);
    const st = HP.inertialDragState(S), c = st.compose;
    out.z7 = { book: 'chainSpreadToy3d', steps: 300, method: c.method, resMax: c.resMax, fail: c.chain.fail, itersMax: c.chain.itersMax, tol: c.chain.solverTol }; }
  // z8: **既定の solve は正規化した法則そのもの**(代数の確認を実測で): 自由な 4 体(pairs all・G 0)の 2 步目の u_i が
  //     Σ_j w_ij (W_j − v_i)/(W_bg + Σ_j w_ij)(W_j = v_j + u_j・W_bg = 1/gain・w は移送の前の座標 rdPrev で引く)と丸めで一致
  { const g = 0.07, rd = { law: 'inertial', gain: g, eps: 0.05, pairs: 'all', history: 'positions' };
    const S = build(HP, toy([B(0, 0, 0.3, 0, 50), B(6, 1, 0, 0.8, 20), B(-4, 5, -0.5, 0.2, 35), B(2, -7, 0.1, -0.6, 10)], rd)); S.step(0.002); S.step(0.002);
    let errMax = 0;
    // 第302便(統合): semic の本は u をドリフトの前の写し(_rdQX/QY)で解く —— 解析の w も同じ位置で引く(分割の世代は rdPrev)
    const sq = (typeof HP.relDragStepOrderOf === 'function' && HP.relDragStepOrderOf(S.relDrag) === 'semic' && S._rdQX), PX = sq ? S._rdQX : S.rdPrevX, PY = sq ? S._rdQY : S.rdPrevY;
    for (let i = 0; i < 4; i++) { let sw = 0, nx = 0, ny = 0;
      for (let j = 0; j < 4; j++) { if (j === i) continue; const dx = PX[j] - PX[i], dy = PY[j] - PY[i], r2 = dx * dx + dy * dy, q = r2 + 0.0025, w = S.m[j] * Math.sqrt(r2) / (q * q);
        sw += w; nx += w * (S.vx[j] + S._rdUX[j] - S.vx[i]); ny += w * (S.vy[j] + S._rdUY[j] - S.vy[i]); }
      const ux = nx / (1 / g + sw), uy = ny / (1 / g + sw), e = Math.hypot(ux - S._rdUX[i], uy - S._rdUY[i]) / Math.hypot(ux, uy); if (e > errMax) errMax = e; }
    out.z8 = { n: 4, gain: g, relErrMax: errMax, xMax: (() => { let m = 0; for (let i = 0; i < 4; i++) m = Math.max(m, S._rdDeg[i]); return m; })() }; }
  out.gates = { closedForm: out.z1.relErr <= 1e-12 && out.z1.defaultEqNone, bgLarge: out.z2.relErr <= 1e-6 && out.z2.defaultEqNone === true, bgZero: out.z3.relErr <= 1e-6,
    gain0: out.z4.every((z) => z.same && !z.normKey), mask: out.z5.same && out.z5.xPos, sameNu: out.z6.bad === 0 && out.z6.axialReceivers > 0 && out.z6.nuMin < 1,
    pcg: out.z7.method === 'pcg' && out.z7.fail === 0 && out.z7.resMax <= out.z7.tol, solveIsNormalized: out.z8.relErrMax <= 1e-12 };
  return out;
}

/* ── ② 境目の表 ─────────────────────────────────────────── */
export function part2(HP, o = {}) {
  const STEPS = o.steps || 2000, EVERY = o.every || 20, rows = [];
  for (const p0 of HP.allPresets()) {
    const rd = (p0.physics || {}).relativeDrag; if (!rd || rd.law !== 'inertial') continue;
    const S = build(HP, p0), dt = stepDtOf(p0), eps = (rd.eps !== undefined) ? rd.eps : (S.params.softening || 0), e2 = eps * eps;
    const sw = [];
    const sample = () => { const n = S.n, set = S._rdPairSet, NP = S._rdPairN, CT = S._dragCoreT, Z = S.coord3d ? S.z : null;
      for (let i = 0; i < n; i++) { if (!(S.m[i] > 0) || S.pinned[i]) continue; let s = 0, k = 0;
        for (let j = 0; j < n; j++) { if (j === i || !(S.m[j] > 0)) continue; if (set && !set.has(i * NP + j)) continue;
          const dx = S.x[j] - S.x[i], dy = S.y[j] - S.y[i], dz = Z ? Z[j] - Z[i] : 0, r2 = dx * dx + dy * dy + dz * dz, r = Math.sqrt(r2), q = r2 + e2;
          const kv = (CT && CT[j]) ? HP.dragCoreLookup(CT[j], r) : null; s += S.m[j] * ((kv === null) ? r / (q * q) : kv); k++; }
        if (k) sw.push(s); } };
    let nan = false;
    for (let k = 0; k <= STEPS; k++) { if (k % EVERY === 0) sample(); S.step(dt); if (S.hasNaN()) { nan = true; break; } }
    sw.sort((a, b) => a - b);
    const med = sw.length ? sw[Math.floor(sw.length / 2)] : 0, mx = sw.length ? sw[sw.length - 1] : 0;
    const bg = HP.relDragBackgroundOf(p0.physics.relativeDrag);
    const dens = p0.scaleExp ? Math.pow(10, p0.scaleExp.M) / Math.pow(10, 3 * p0.scaleExp.L) : null;
    const cos = p0.scaleExp ? cosmicBackground(p0.scaleExp, eps) : null;
    const retired = p0.familyRole === 'retired';
    rows.push({ id: p0.id, emoji: p0.emoji, retired, gain: W302A.rdGainOf(rd), eps, n: S.n, dt, steps: STEPS, every: EVERY, samples: sw.length,
      sumWMed: med, sumWMax: mx, Wbg: bg ? bg.Wbg : null, WbgSI: (bg && dens) ? bg.Wbg * dens : null, Cd: bg ? bg.Cd : null,
      xMed: bg ? med / bg.Wbg : 0, xMax: bg ? mx / bg.Wbg : 0, Wcos: cos ? cos.Wbook : null, xCosMed: cos ? med / cos.Wbook : null, nan,
      regime: !bg ? 'gain0' : (mx / bg.Wbg < 1e-3 ? 'background' : (mx / bg.Wbg < 1 ? 'mixed' : 'local')) });
  }
  return rows;
}

/* ── ③④ 🟫🟪 の目的の量(旧 gain のまま・新旧)と候補 (iii) ─────────── */
function twoRun(HP, p, dt) {
  const U = C.timeUnits(p.scaleExp), R = C.runPair(HP, p, { ci: 0, oi: 1, dt, revMax: 8 }), n = R.rev.length;
  const st = HP.inertialDragState(HP.sim);
  return { aps: R.B ? R.B.slopeDegPerTime * U.century * 3600 : null, periodSec: (R.rev[n - 1] - R.rev[0]) / (n - 1) * U.sec, eProxy: R.eProxy, steps: R.steps, xMax: st && st.norm ? st.norm.xMax : null };
}
export function part3(HP) {
  const mer = find(HP, 'mercurySunInertialFit'), plu = find(HP, 'plutoCharonInertialFit');
  const with_ = (p, patch) => { const q = clone(p); W302A.rdPatch(q.physics.relativeDrag, patch); return q; };   // 第302便a: gain・norm:"none" は rdPatch(凍結比較は gain で書く)
  const m0 = twoRun(HP, with_(mer, { gain: 0 }), 0.016), mN = twoRun(HP, with_(mer, { norm: 'none' }), 0.016), mT = twoRun(HP, mer, 0.016);
  const p0 = twoRun(HP, with_(plu, { gain: 0 }), 0.16), pN = twoRun(HP, with_(plu, { norm: 'none' }), 0.16), pT = twoRun(HP, plu, 0.16);
  const mer3 = { gain: W302A.rdGainOf(mer.physics.relativeDrag), dt: 0.016, apsDiffNone: mN.aps - m0.aps, apsDiffTotal: mT.aps - m0.aps, obs: 43, xMax: mT.xMax };
  const plu3 = { gain: W302A.rdGainOf(plu.physics.relativeDrag), dt: 0.16, periodNone: pN.periodSec, periodTotal: pT.periodSec, periodGain0: p0.periodSec, obs: 551856.43872, xMax: pT.xMax };
  // ④ 候補 (iii): 🟫 に W_bg = W_cos を宣言し、C_d = gain·W_bg を振る
  const cos = cosmicBackground(mer.scaleExp, mer.physics.relativeDrag.eps);
  const cosRows = [1e-8, 1e-6, 1e-4, 1e-2].map((Cd) => { const r = twoRun(HP, with_(mer, { background: cos.Wbook, gain: Cd / cos.Wbook }), 0.016);
    return { Cd, gain: Cd / cos.Wbook, apsDiff: r.aps - m0.aps, periodSec: r.periodSec, xMax: r.xMax }; });
  return { mer: mer3, plu: plu3, cosmic: { book: 'mercurySunInertialFit', Wcos: cos.Wbook, WcosSI: cos.WSI, rhoSI: cos.rhoSI, RSI: cos.RSI, gain0: { aps: m0.aps, periodSec: m0.periodSec }, rows: cosRows } };
}

/* ── ⑤ 🔗 の 18000 步 ─────────────────────────────────────── */
export function part5(HP, o = {}) {
  const STEPS = o.steps || 18000, p = find(HP, 'chainDiskToy'), dt = 0.016;
  const run = (patch) => { const q = clone(p); W302A.rdPatch(q.physics.relativeDrag, patch); const S = build(HP, q); const marks = [];
    let nanAt = null, failAt = null;
    for (let k = 1; k <= STEPS; k++) { S.step(dt);
      if (nanAt === null && S.hasNaN()) nanAt = k;
      if (failAt === null && S.inertialDragHalt === true) failAt = k;
      if (k % 2000 === 0) { let rMax = 0, uMax = 0, rs = [];
        for (let i = 1; i < S.n; i++) { const r = Math.hypot(S.x[i] - S.x[0], S.y[i] - S.y[0]); rs.push(r); if (r > rMax) rMax = r; const u = Math.hypot(S._rdUX[i], S._rdUY[i]); if (u > uMax) uMax = u; }
        rs.sort((a, b) => a - b); marks.push({ step: k, rMax, rMed: rs[Math.floor(rs.length / 2)], uMax }); }
      if (nanAt !== null) break; }
    const st = HP.inertialDragState(S);
    return { marks, nanAt, failAt, xMax: st.norm ? st.norm.xMax : null }; };
  const none = run({ norm: 'none' }), total = run({});
  const jump = (r) => { const m = r.marks.find((z) => z.rMax > 100); return m ? m.step : null; };
  return { book: 'chainDiskToy', dt, steps: STEPS, none, total, jumpNone: jump(none), jumpTotal: jump(total), jumpRule: '2000 步ごとの標本で中心からの最大半径 > 100(初期の円盤 6〜24)の最初の步' };
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) {
  const t0 = Date.now();
  const OUT_PATH = process.env.W301A_OUT || path.join(ROOT, 'tests', 'out', 'dragnorm-w301a.json');
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
  pinDecl303();   // 第304便c: 🌦️🌔 を第303便の宣言へ(軟化 0.01・初期配置・W_bg —— 続く pinDecl302 が第302便の欄を戻す)
  pinDecl302();   // 第303便a: 在位の惑星の本の G_loc と フィットの本の W_bg・初期配置を第302便の宣言に戻して測る(歴史の値を保つ)
  const r1 = part1(HP); console.log('① ' + JSON.stringify(r1.gates));
  const r2 = part2(HP); for (const z of r2) console.log('② ' + z.emoji + ' ' + z.id + ' x med/max ' + z.xMed.toExponential(3) + '/' + z.xMax.toExponential(3) + ' ' + z.regime);
  const r3 = part3(HP); console.log('③ ' + JSON.stringify({ mer: r3.mer, plu: r3.plu })); console.log('④ ' + JSON.stringify(r3.cosmic.rows));
  const r5 = part5(HP); console.log('⑤ ' + JSON.stringify({ jumpNone: r5.jumpNone, jumpTotal: r5.jumpTotal, none: r5.none.marks.slice(-3), total: r5.total.marks.slice(-3) }));
  const gates = Object.assign({}, r1.gates, { table: r2.length > 0 && r2.every((z) => !z.nan || z.regime === 'local'), cosmicNoPrecession: r3.cosmic.rows.every((z) => Math.abs(z.apsDiff) < 1) });
  const out = { meta: null, version: HP.REL_DRAG_NORM_VERSION, part1: r1, table: r2, part3: r3, chain: r5, gates, ok: Object.values(gates).every(Boolean) };
  const CODE = ['tests/exp-w301a-dragnorm.mjs', 'tests/exp-w295c-inertial3.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs', 'tests/lib-w303a-pre.mjs', 'tests/lib-w304c-pre.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第301便a', target: TARGET, code: CODE, inputs: [TARGET, DECL302_DATA_FILE, DECL303_DATA_FILE] }), {
    harnessVersion: HARNESS_VERSION, normVersion: HP.REL_DRAG_NORM_VERSION, loadErrors: errors.length,
    ruling: '原仮定者の裁定(第91報)⑤(引きずりの強さは慣性決定力の総和で割る。総和には背景慣性決定力を含む。背景慣性決定力による相対的な引きずりの大きさはゼロ。現状のサンプルにも適用し、結果が変わるサンプルは再フィットする)',
    reading: '統括の検証項目 R179(u_i = C_d Σ_j w_ij (v_j − v_i)/(W_bg + Σ_j w_ij)・背景は分母にだけ・3 成分に同じ分母・W_bg の既定を実測で決める)',
    notClaim: ['現実を再現した', 'gain は普遍定数', '背景慣性決定力の値を観測で決めた'] });
  out.elapsedS = (Date.now() - t0) / 1000;
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 1) + '\n');
  console.log('gates ' + JSON.stringify(gates));
  console.log('→ ' + path.relative(ROOT, OUT_PATH) + '(' + out.elapsedS.toFixed(1) + ' s)・ok ' + out.ok);
  process.exit(out.ok ? 0 : 1);
}
