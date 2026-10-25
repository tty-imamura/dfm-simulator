// 第302便b(原仮定者の裁定(第92報)AN304 ①「慣性速度に影響する重力の計算に、1PN 相当の補正の導入を進める。局所光速が変化する事で、局所重力が変化する。
// G_loc = κ·c_loc²」・補足「G_loc = κ·c_loc² の他にも広く検討する。例えば局所時間が遅くなる事で局所重力が相対的に強くなる G_loc = G·(c/c_loc)²」・
// 統括の検証項目 R187)—— **局所重力 G_loc の族の実測の器**(Node だけ —— 対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、
// アプリの步〔dfmCore3 の gLocKick3・二次元の核〔E の EIH〕〕をそのまま走らせる)。
//
// ■ 族(html の validateGLoc・gLocKick3 —— 1 か所)
//   G_loc = G·(c_loc/c₀)^n = G·e^(−2nψ)・ψ_i = κ_g Σ_{j≠i} m_j/√(d²+ε²)(κ_g = G/c₀²)。n=2 が κ·c_loc²(kappaC2)・n=−2 が G·(c₀/c_loc)²(timeRatio)。
//   弱場・一次の解析(固定中心): a_r = −μ/r² + 2nμ²/(c₀² r³) → 1 公転の近点の移動 Δϖ ≈ −2nπ μ/(c₀² a(1−e²))。
//   自由な二体: receiver は μ_eff = G(m₁²+m₂²)/(m₁+m₂)・symmetric は μ_eff = G(m₁+m₂)/2 を同じ式へ。
//
// ■ 実験の行列(同じ初期状態・同じ終端時刻・刻み h・h/2・h/4)
//   A ニュートン(G 一定)・引きずり OFF / B G_loc の族(n = 2, −2, −3, 1, −1 —— receiver と symmetric)・引きずり OFF /
//   C ニュートン・本の引きずり / D G_loc + 本の引きずり / E 既存の 1PN(geoPN=1 の EIH —— 二次元の本の経路)・引きずり OFF。
//   量: 近点の移動(1 周あたり・世紀あたり —— 近点の頂点〔距離の極小の 3 点の放物線〕の方位の直線 fit と、軌道ごとに平均した接触 Laplace–Runge–Lenz の方位の直線 fit)・
//   近点周期・恒星周期(基準方向の通過の間隔)・離心率((r_max−r_min)/(r_max+r_min))・エネルギー(ニュートンの E_N の変化と帳簿 gLocWork)と運動量(帳簿 gLocP)。
//   ① 人工二体(μ=1・c₀=30・a=1・e=0.2・ε=0.001)の固定中心(試験粒子 m=10⁻⁶)と自由な二体(m₂/m₁ = 0.25・自由な軽い二体 m₂=10⁻⁶ —— E の対照)。
//   ② 実単位の惑星の本: 🌡️ mercurySunInertial3d(A・B・C・D)と E の対照(🌞 mercuryReal —— 二次元・geoPN=1 の本の EIH と、同じ本の geoPN=0 の写しの差)。
//      🌋 venusSunInertial3d・🔴 marsSunInertial3d(gain 0 の本 —— A と B だけ)。
//   ③ 零試験(QA behavior.gLoc302 と同じ問い): 未宣言と n=0 のビット同一・c₀ を 10¹² 倍にした極限・symmetric の運動量・二次元の拒否。
//
// ■ しないこと・言わないこと
//   ・どの本にもオンにしない(在位の本の宣言は変えない —— 第 2 段 c が統括の裁定で入れる)。係数を黙って替えない(n は宣言のまま —— 差は表に残す)。
//   ・「G_loc で 43″/世紀が出た」「GR と一致した」と書かない —— n=−3 の近点の係数が GR の試験粒子の近点の係数と同じなのは**近点の一次だけ**
//     (GR の 1PN は速度に依る項を持ち、周期・形の他の量は別)。一致は量と窓を限って数で書く。
//
// 実行(Node だけ・1 プロセス):
//   node tests/exp-w302b-gloc.mjs          → 正本 tests/out/gloc-w302b.json(W302B_OUT で出力先を変える)
//   W302B_QUICK=1 で刻みを h・h/2 の 2 段に縮める(器の試走 —— 正本は全段)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as W302A from './lib-w302a-wbg.mjs';   // 第302便c: gain ⇔ W_bg の読み書き(第302便a の後の世代)
import { pre302c } from './lib-w302c-pre.mjs';
import { pinDecl302, DECL302_DATA_FILE } from './lib-w303a-pre.mjs';   // 第303便a: 第302便の本の宣言の写し(この正本は第302便の宣言で測った歴史の記録 —— 器の中だけ・html と署名は変えない)
import { pinDecl303, DECL303_DATA_FILE } from './lib-w304c-pre.mjs';   // 第304便c: 第303便の 🌦️🌔 の宣言の写し(pinDecl302 の前に —— 軟化・初期配置・引きずりの宣言を第303便へ戻してから第302便の欄を戻す・歴史の値を保つ)
import { pinDecl315c, LEGACY7_DATA_FILE } from './lib-w315c-legacy7.mjs';   // 第315便c(決断事項 AN406・R244): 在位の 7 本を K1 へ移した世代では、この器は移行の前(af2f426)の宣言の写しで測る
const REGEN_SCOPE = {"presets":["chainDiskToy3d","earthMoonSunInertial3d","marsSunInertial3d","mercuryReal","mercurySunInertial3d","mercurySunInertialFit","venusSunInertial3d"],"roots":["HP.GLOC_VERSION","HP.allPresets","HP.dfmMeshVelocityFieldAt","HP.gLocPeriAdvance","HP.gLocState","HP.sim","HP.validatePreset"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w302b-gloc-1';
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const QUICK = process.env.W302B_QUICK === '1';
const clone = (x) => JSON.parse(JSON.stringify(x));
const find0 = (HP, id) => HP.allPresets().find((q) => q.id === id);
// 第302便c: 惑星の本が physics.gLoc を宣言した後の世代でも、この器の測定は**G_loc の前の本の宣言**で行う(G_loc は器が条件として足す —— tests/lib-w302c-pre.mjs)
const find = (HP, id) => pre302c(find0(HP, id));
const ARCSEC = 180 * 3600 / Math.PI;
export const DIVS = QUICK ? [1, 2] : [1, 2, 4];
export const FAMILY = Object.freeze([
  { key: 'n2', gl: { law: 'kappaC2' }, n: 2, label: 'κ·c_loc²(n=2 —— 裁定の式)' },
  { key: 'nm2', gl: { law: 'timeRatio' }, n: -2, label: 'G·(c₀/c_loc)²(n=−2 —— 補足の例)' },
  { key: 'nm3', gl: { law: 'cLocPow', n: -3 }, n: -3, label: 'G·(c₀/c_loc)³(n=−3)' },
  { key: 'n1', gl: { law: 'cLocPow', n: 1 }, n: 1, label: 'G·(c_loc/c₀)(n=1)' },
  { key: 'nm1', gl: { law: 'cLocPow', n: -1 }, n: -1, label: 'G·(c₀/c_loc)(n=−1)' },
]);

/* ── 抽出器(全行で同じ)───────────────────────────────── */
// 相対ベクトル(受け手 oi − 中心 ci)を軌道面の基底(初期の r̂ と L̂ × r̂)へ射影して面内の方位を作る。
// 近点: 距離の極小の 3 点の放物線の頂点(時刻)と、unwrap した方位の 2 次補間。LRL: 接触 A = v×L − μ r̂ の面内の方位を、近点から近点までの各軌道で平均。
export function makeTracker(S, ci, oi, mu) {
  const Z = S.coord3d ? S.z : null, VZ = S.coord3d ? S.vz : null;
  const rel = () => { const z = Z ? Z[oi] - Z[ci] : 0, vz = VZ ? VZ[oi] - VZ[ci] : 0;
    return [S.x[oi] - S.x[ci], S.y[oi] - S.y[ci], z, S.vx[oi] - S.vx[ci], S.vy[oi] - S.vy[ci], vz]; };
  const q0 = rel();
  const L = [q0[1] * q0[5] - q0[2] * q0[4], q0[2] * q0[3] - q0[0] * q0[5], q0[0] * q0[4] - q0[1] * q0[3]];
  const nL = Math.hypot(...L), nh = L.map((v) => v / nL);
  const r0 = Math.hypot(q0[0], q0[1], q0[2]), e1 = [q0[0] / r0, q0[1] / r0, q0[2] / r0];
  const e2 = [nh[1] * e1[2] - nh[2] * e1[1], nh[2] * e1[0] - nh[0] * e1[2], nh[0] * e1[1] - nh[1] * e1[0]];
  const T = { k: 0, rs: [], phis: [], peri: [], apo: [], cross: [], lrlSum: 0, lrlN: 0, lrlOrb: [], lastLrl: null, phiPrev: null, phiUn: 0, rel, e1, e2, nh, mu };
  return T;
}
export function trackStep(T, t) {
  const q = T.rel();
  const px = q[0] * T.e1[0] + q[1] * T.e1[1] + q[2] * T.e1[2], py = q[0] * T.e2[0] + q[1] * T.e2[1] + q[2] * T.e2[2];
  const r = Math.hypot(q[0], q[1], q[2]);
  let ph = Math.atan2(py, px);
  if (T.phiPrev === null) T.phiUn = ph; else { let d = ph - T.phiPrev; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; T.phiUn += d; }
  T.phiPrev = ph;
  // LRL(接触): A = v × (r × v) − μ r̂ の面内の方位(unwrap)
  const Lx = q[1] * q[5] - q[2] * q[4], Ly = q[2] * q[3] - q[0] * q[5], Lz = q[0] * q[4] - q[1] * q[3];
  const Ax = q[4] * Lz - q[5] * Ly - T.mu * q[0] / r, Ay = q[5] * Lx - q[3] * Lz - T.mu * q[1] / r, Az = q[3] * Ly - q[4] * Lx - T.mu * q[2] / r;
  let la = Math.atan2(Ax * T.e2[0] + Ay * T.e2[1] + Az * T.e2[2], Ax * T.e1[0] + Ay * T.e1[1] + Az * T.e1[2]);
  if (T.lastLrl !== null) { let d = la - T.lastLrl.raw; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; T.lastLrl = { raw: la, un: T.lastLrl.un + d }; }
  else T.lastLrl = { raw: la, un: la };
  T.lrlSum += T.lastLrl.un; T.lrlN++;
  // 基準方向(初期の r̂)の通過: unwrap した方位が 2πk を越えた步(線形補間の時刻)
  const kPrev = (T.rs.length) ? Math.floor(T.phis[T.phis.length - 1] / (2 * Math.PI)) : 0, kNow = Math.floor(T.phiUn / (2 * Math.PI));
  if (T.rs.length && kNow > kPrev) { const p0 = T.phis[T.phis.length - 1], f = (2 * Math.PI * kNow - p0) / (T.phiUn - p0); T.cross.push(t.prev + f * (t.now - t.prev)); }
  T.rs.push(r); T.phis.push(T.phiUn);
  const n = T.rs.length;
  if (n >= 3) {
    const a = T.rs[n - 3], b = T.rs[n - 2], c = T.rs[n - 1], den = a - 2 * b + c;
    if (b < a && b <= c && den > 0) {   // 極小(近点)
      const d = 0.5 * (a - c) / den, f0 = T.phis[n - 3], f1 = T.phis[n - 2], f2 = T.phis[n - 1];
      const phiV = f1 + 0.5 * d * (f2 - f0) + 0.5 * d * d * (f2 - 2 * f1 + f0), rV = b - 0.25 * (a - c) * d;
      T.peri.push({ t: t.prev + d * (t.now - t.prev), phi: phiV, r: rV });
      if (T.lrlN > 1 && T.peri.length > 1) T.lrlOrb.push(T.lrlSum / T.lrlN);
      T.lrlSum = 0; T.lrlN = 0;
    } else if (b > a && b >= c && den < 0) {   // 極大(遠点)
      const d = 0.5 * (a - c) / den; T.apo.push({ r: b - 0.25 * (a - c) * d });
    }
  }
}
function linfit(xs, ys) {
  const n = xs.length; if (n < 2) return { slope: null, se: null };
  const mx = xs.reduce((s, v) => s + v, 0) / n, my = ys.reduce((s, v) => s + v, 0) / n;
  let sxy = 0, sxx = 0; for (let i = 0; i < n; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) * (xs[i] - mx); }
  const sl = sxy / sxx; let ss = 0; for (let i = 0; i < n; i++) { const e = ys[i] - my - sl * (xs[i] - mx); ss += e * e; }
  return { slope: sl, se: n > 2 ? Math.sqrt(ss / (n - 2) / sxx) : null, rms: Math.sqrt(ss / n) };
}
export function trackSummary(T) {
  const P = T.peri;
  const idx = P.map((_, i) => i), phis = P.map((p, i) => p.phi - 2 * Math.PI * i), ts = P.map((p) => p.t);
  const fP = linfit(idx, phis), fT = linfit(idx, ts);
  const lo = T.lrlOrb, fL = linfit(lo.map((_, i) => i), lo);
  const fC = linfit(T.cross.map((_, i) => i), T.cross);
  const rMin = P.length ? P.reduce((s, p) => s + p.r, 0) / P.length : null, rMax = T.apo.length ? T.apo.reduce((s, p) => s + p.r, 0) / T.apo.length : null;
  return { nPeri: P.length, dVarpiPeri: fP.slope, dVarpiPeriSe: fP.se, dVarpiLrl: fL.slope, dVarpiLrlSe: fL.se, nLrlOrb: lo.length,
    pAnom: fT.slope, pSid: fC.slope, nCross: T.cross.length, rMin, rMax, ecc: (rMin !== null && rMax !== null) ? (rMax - rMin) / (rMax + rMin) : null,
    aGeom: (rMin !== null && rMax !== null) ? 0.5 * (rMin + rMax) : null };
}
// ニュートンの E_N(G 一定 —— 宣言の補正を含めない)と運動量
export function energyN(S) {
  const G = S.params.G, e2 = S.params.softening * S.params.softening, m = S.mEff, Z = S.coord3d ? S.z : null, VZ = S.coord3d ? S.vz : null;
  let K = 0, U = 0, P = [0, 0, 0];
  for (let i = 0; i < S.n; i++) { if (S.pinned[i]) continue; const vz = VZ ? VZ[i] : 0; K += 0.5 * m[i] * (S.vx[i] ** 2 + S.vy[i] ** 2 + vz * vz); P[0] += m[i] * S.vx[i]; P[1] += m[i] * S.vy[i]; P[2] += m[i] * vz; }
  for (let i = 0; i < S.n; i++) for (let j = i + 1; j < S.n; j++) { const dz = Z ? Z[i] - Z[j] : 0; U -= G * m[i] * m[j] / Math.sqrt((S.x[i] - S.x[j]) ** 2 + (S.y[i] - S.y[j]) ** 2 + dz * dz + e2); }
  return { E: K + U, P };
}
// 1 走行: preset を build し、刻み dt で tEnd まで(步数は丸め)。ci/oi は中心/受け手の粒子の添字・mu は LRL の μ
export function runCase(HP, preset, o) {
  const v = HP.validatePreset(clone(preset)); if (!v.ok) throw new Error('validatePreset: ' + JSON.stringify(v.errors).slice(0, 300));
  HP.sim.build(v.preset); const S = HP.sim;
  const steps = Math.round(o.tEnd / o.dt), T = makeTracker(S, o.ci, o.oi, o.mu), E0 = energyN(S);
  const t0w = Date.now(); let tPrev = S.t;
  trackStep(T, { prev: tPrev, now: S.t });
  for (let k = 0; k < steps; k++) { S.step(o.dt); trackStep(T, { prev: tPrev, now: S.t }); tPrev = S.t; if (S.hasNaN()) return { nan: k }; }
  const E1 = energyN(S), st = HP.gLocState(S);
  const out = Object.assign(trackSummary(T), { steps, dt: o.dt, tEnd: S.t, dEN: E1.E - E0.E, EN0: E0.E, dP: [E1.P[0] - E0.P[0], E1.P[1] - E0.P[1], E1.P[2] - E0.P[2]],
    gLoc: st ? { work: st.work, dP: st.dP, psiMax: st.psiMax, dGMax: st.dGMax, evals: st.evals } : null, wallSec: (Date.now() - t0w) / 1000 });
  if (st) out.ledgerResid = out.dEN - st.work;
  return out;
}

/* ── ① 人工二体 ─────────────────────────────────────────── */
export const TOY = Object.freeze({ G: 1, M: 1, c: 30, a: 1, e: 0.2, eps: 0.001, orbits: 20, perOrbit: 1000 });
export function toyPreset(cfg) {
  const c = Object.assign({}, TOY, cfg), M = c.M, m = c.m, pin = !!c.pinned, mu = c.G * (pin ? M : M + m);
  const rp = c.a * (1 - c.e), vp = Math.sqrt(mu * (1 + c.e) / (c.a * (1 - c.e)));
  const f1 = pin ? 0 : m / (M + m), f2 = pin ? 1 : M / (M + m);
  const body = (mm, x, vy, pinned) => Object.assign({ type: 'single', m: mm, x, y: 0, vx: 0, vy, spin: 0, radius: 0.001, pinned: !!pinned }, c.d3 ? { z: 0, vz: 0 } : {});
  const ph = { G: c.G, D0: 0, kFrame: 0, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, kappaT: c.G / (c.c * c.c), cLight: c.c, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
    massFloor: 1e-9, geoPN: c.geoPN || 0, lambdaPN: (c.geoPN === 1) ? 1 : 0, pnAlpha: 1.5, radiusScale: 1, softening: c.eps, softeningFloor: c.eps, radiusFloor: 0.001, timeScale: 1,
    contactMode: 'none', stateCarry: 'double' };
  if (c.d3) ph.coord = '3d';
  if (c.gl) ph.gLoc = c.gl;
  if (c.drag) ph.relativeDrag = c.drag;
  return { id: 'w302bToy', name: 'w302b toy', emoji: '🧪', group: '原理', sampleClass: 'principle', integrator: c.integrator || 'leapfrog', description: 'w302b toy', camera: { scale: 100, x: 0, y: 0 },
    world: { boundary: 'none', size: 50 }, physics: ph,
    bodies: [body(M, -f1 * rp, -f1 * vp, pin), body(m, f2 * rp, f2 * vp, false)], mu };
}
function toyCase(HP, cfg, div) {
  const p = toyPreset(cfg), P = 2 * Math.PI * Math.sqrt(TOY.a ** 3 / p.mu), dt = P / (TOY.perOrbit * div);
  return runCase(HP, p, { dt, tEnd: TOY.orbits * P, ci: 0, oi: 1, mu: p.mu });
}
export function part1(HP) {
  const cfgs = [
    { key: 'fixed', label: '固定中心(M=1 pinned・試験粒子 m=10⁻⁶)', base: { pinned: true, m: 1e-6, d3: true }, muEff: { receiver: 1, symmetric: 0.5 } },
    { key: 'free', label: '自由な二体(m₁=1・m₂=0.25)', base: { pinned: false, m: 0.25, d3: true }, muEff: { receiver: (1 + 0.0625) / 1.25, symmetric: 1.25 / 2 } },
    { key: 'freeLight', label: '自由な軽い二体(m₁=1・m₂=10⁻⁶ —— E の対照の形)', base: { pinned: false, m: 1e-6, d3: true }, muEff: { receiver: (1 + 1e-12) / (1 + 1e-6), symmetric: (1 + 1e-6) / 2 } },
  ];
  const rows = [];
  for (const C of cfgs) {
    const muRel = C.base.pinned ? 1 : 1 + C.base.m;
    const grGeo = 6 * Math.PI * muRel / (TOY.c ** 2 * TOY.a * (1 - TOY.e ** 2));
    const conds = [{ key: 'A', label: 'A ニュートン', cfg: {} }];
    for (const F of FAMILY) for (const pair of ['receiver', 'symmetric']) {
      if (C.key === 'freeLight' && pair === 'symmetric' && F.key !== 'n2') continue;
      if (C.key === 'fixed' && pair === 'symmetric' && !(F.key === 'n2' || F.key === 'nm2')) continue;
      conds.push({ key: 'B_' + F.key + (pair === 'symmetric' ? '_sym' : ''), label: 'B ' + F.label + (pair === 'symmetric' ? '・symmetric' : ''), cfg: { gl: Object.assign({}, F.gl, pair === 'symmetric' ? { pair } : {}) },
        n: F.n, pair, analytic: HP.gLocPeriAdvance(F.n, C.muEff[pair], TOY.c, TOY.a, TOY.e) });
    }
    if (!C.base.pinned) conds.push({ key: 'E', label: 'E 既存の 1PN(二次元の本の EIH・geoPN=1)', cfg: { d3: false, geoPN: 1 }, analytic: grGeo, analyticNote: '6πG(m₁+m₂)/(c₀²a(1−e²))(GR の 1PN 二体の近点 —— 比較の物差し)' });
    for (const K of conds) {
      const runs = DIVS.map((div) => toyCase(HP, Object.assign({}, C.base, K.cfg), div));
      rows.push({ cfg: C.key, cfgLabel: C.label, key: K.key, label: K.label, n: K.n ?? null, pair: K.pair ?? null, analytic: K.analytic ?? null, analyticNote: K.analyticNote ?? null, runs });
    }
  }
  // B−A(同じ刻みの差 —— 積分器と軟化の近点の移動を引く)と解析の比
  for (const r of rows) {
    const A = rows.find((z) => z.cfg === r.cfg && z.key === 'A');
    r.diff = r.runs.map((run, i) => ({ div: DIVS[i], dPeri: run.dVarpiPeri - A.runs[i].dVarpiPeri, dLrl: run.dVarpiLrl - A.runs[i].dVarpiLrl,
      dPAnom: run.pAnom - A.runs[i].pAnom, dPSid: run.pSid - A.runs[i].pSid, dEcc: run.ecc - A.runs[i].ecc }));
    const last = r.diff[r.diff.length - 1];
    r.ratio = (r.analytic && r.key !== 'A') ? last.dPeri / r.analytic : null;
  }
  return { toy: TOY, divs: DIVS, rows };
}

/* ── ② 実単位の惑星の本 ───────────────────────────────── */
export const PLANETS = Object.freeze([
  { key: 'mer', id: 'mercurySunInertial3d', emoji: '🌡️', orbits: 20, drag: true, family: ['n2', 'nm2', 'nm3'], e2d: 'mercuryReal' },
  { key: 'ven', id: 'venusSunInertial3d', emoji: '🌋', orbits: 12, drag: false, family: ['n2', 'nm2', 'nm3'] },
  { key: 'mar', id: 'marsSunInertial3d', emoji: '🔴', orbits: 8, drag: false, family: ['n2', 'nm2', 'nm3'] },
]);
function oscul(mu, q) {
  const r = Math.hypot(q[0], q[1], q[2]), v2 = q[3] ** 2 + q[4] ** 2 + q[5] ** 2, a = 1 / (2 / r - v2 / mu);
  const Lx = q[1] * q[5] - q[2] * q[4], Ly = q[2] * q[3] - q[0] * q[5], Lz = q[0] * q[4] - q[1] * q[3], h2 = Lx * Lx + Ly * Ly + Lz * Lz;
  return { a, e: Math.sqrt(Math.max(0, 1 - h2 / (mu * a))), P: 2 * Math.PI * Math.sqrt(a ** 3 / mu) };
}
function bodyIdx(p) { const B = p.bodies; const ci = B.reduce((b, x, i) => (x.m > B[b].m ? i : b), 0); return { ci, oi: ci === 0 ? 1 : 0 }; }
export function part2(HP, keys = null) {
  const out = [];
  for (const PL of PLANETS) {
    if (keys && !keys.includes(PL.key)) continue;
    const p0 = find(HP, PL.id), ph = p0.physics, { ci, oi } = bodyIdx(p0), G = ph.G, c0 = ph.cLight;
    const Mi = p0.bodies[ci].m, mo = p0.bodies[oi].m, mu = G * (Mi + mo);
    const b0 = p0.bodies[ci], b1 = p0.bodies[oi];
    const el = oscul(mu, [b1.x - b0.x, b1.y - b0.y, (b1.z || 0) - (b0.z || 0), b1.vx - b0.vx, b1.vy - b0.vy, (b1.vz || 0) - (b0.vz || 0)]);
    const T = Math.pow(10, p0.scaleExp.T), century = 36525 * 86400 / T, hBook = ph.stepDt, tEnd = PL.orbits * el.P;
    const gain = W302A.rdGainOf(ph.relativeDrag);
    const withGain = (g) => { const q = clone(p0); W302A.rdSetGain(q.physics.relativeDrag, g); return q; };
    const withGl = (q, gl) => { const r = clone(q); r.physics.gLoc = gl; return r; };
    const conds = [{ key: 'A', label: 'A ニュートン(gain 0)', p: withGain(0) }];
    for (const fk of PL.family) { const F = FAMILY.find((z) => z.key === fk); conds.push({ key: 'B_' + fk, label: 'B ' + F.label + '(gain 0)', p: withGl(withGain(0), F.gl), n: F.n,
      analytic: HP.gLocPeriAdvance(F.n, G * (Mi * Mi + mo * mo) / (Mi + mo), c0, el.a, el.e) }); }
    if (PL.drag && gain !== 0) {
      conds.push({ key: 'C', label: 'C ニュートン + 本の引きずり(gain ' + gain + ')', p: clone(p0) });
      for (const fk of PL.family) { const F = FAMILY.find((z) => z.key === fk); conds.push({ key: 'D_' + fk, label: 'D ' + F.label + ' + 本の引きずり', p: withGl(clone(p0), F.gl), n: F.n }); }
    }
    const rows = [];
    for (const K of conds) {
      const runs = DIVS.map((div) => runCase(HP, K.p, { dt: hBook / div, tEnd, ci, oi, mu }));
      rows.push({ key: K.key, label: K.label, n: K.n ?? null, analytic: K.analytic ?? null, runs });
    }
    const conv = (x, P) => (x === null || P === null) ? null : x * century / P * ARCSEC;   // rad/周 → ″/世紀(近点周期で)
    for (const r of rows) {
      const A = rows.find((z) => z.key === 'A');
      r.diff = r.runs.map((run, i) => { const dP = run.dVarpiPeri - A.runs[i].dVarpiPeri, dL = run.dVarpiLrl - A.runs[i].dVarpiLrl;
        return { div: DIVS[i], dPeri: dP, dLrl: dL, arcsecCyPeri: conv(dP, run.pAnom), arcsecCyLrl: conv(dL, run.pAnom), dPAnom: run.pAnom - A.runs[i].pAnom, dPSid: run.pSid - A.runs[i].pSid, dEcc: run.ecc - A.runs[i].ecc }; });
      r.analyticArcsecCy = r.analytic === null ? null : r.analytic * century / el.P * ARCSEC;
      const last = r.diff[r.diff.length - 1];
      r.ratio = r.analytic ? last.dPeri / r.analytic : null;   // 主の量は近点の頂点(LRL の軌道平均は低離心率〔🌋 e≈0.007〕で semi の (x,v) のずれが e を越えて方位が一周する —— 参考値)
    }
    // D − C(引きずりの上に重ねた G_loc の分)と B − A の比べ(足し算が成り立つか)
    const add = [];
    for (const fk of PL.family) { const B = rows.find((z) => z.key === 'B_' + fk), D = rows.find((z) => z.key === 'D_' + fk), C = rows.find((z) => z.key === 'C');
      if (!B || !D || !C) continue;
      add.push({ fk, perDiv: DIVS.map((div, i) => ({ div, BminusA: B.diff[i].arcsecCyPeri, DminusC: conv(D.runs[i].dVarpiPeri - C.runs[i].dVarpiPeri, D.runs[i].pAnom), C: C.diff[i].arcsecCyPeri, D: D.diff[i].arcsecCyPeri })) }); }
    // 引きずりが担う量(第 2 段 c の入力 —— 推定): C の近点(本のフィットの値)を保つのに要る gain を、引きずりの近点が gain に比例すると置いて
    //   gain_n = gain × (C − B_n)/C で見積もり、D の写し(G_loc + gain_n)を h/2 で走らせて合計が C に戻るかを確かめる(比例の置き方の検算)
    const need = [];
    if (PL.drag && gain !== 0) {
      const C = rows.find((z) => z.key === 'C'), iH = Math.min(1, DIVS.length - 1), cVal = C.diff[iH].arcsecCyPeri;
      for (const fk of PL.family) { const F = FAMILY.find((z) => z.key === fk), B = rows.find((z) => z.key === 'B_' + fk), bVal = B.diff[iH].arcsecCyPeri;
        const gN = gain * (cVal - bVal) / cVal, q = withGl(withGain(gN), F.gl);
        const run = runCase(HP, q, { dt: hBook / DIVS[iH], tEnd, ci, oi, mu }), A = rows.find((z) => z.key === 'A').runs[iH];
        const tot = conv(run.dVarpiPeri - A.dVarpiPeri, run.pAnom);
        need.push({ fk, n: F.n, div: DIVS[iH], target: cVal, gLocPart: bVal, dragPart: cVal - bVal, gainNeeded: gN, gainRatio: gN / gain, total: tot, totalMinusTarget: tot - cVal,
          dPAnom: run.pAnom - A.pAnom, dPSid: run.pSid - A.pSid, wallSec: run.wallSec }); }
    }
    const grRad = 6 * Math.PI * mu / (c0 * c0 * el.a * (1 - el.e ** 2));
    const rec = { key: PL.key, id: PL.id, emoji: PL.emoji, orbits: PL.orbits, hBook, tEnd, elements: el, century, gainBook: gain, rows, additivity: add, dragNeed: need,
      grTestParticle: { radPerOrbit: grRad, arcsecCy: grRad * century / el.P * ARCSEC, note: '6πμ/(c₀²a(1−e²))(GR の試験粒子の近点の一次 —— 比較の物差し・観測値ではない)' } };
    // E の対照(二次元の本の EIH): 🌞 mercuryReal と、その geoPN=0 の写しの差(同じ抽出器・本の刻み h・h/2・h/4)
    if (PL.e2d) {
      const e0 = find(HP, PL.e2d), ix = bodyIdx(e0), Me = e0.bodies[ix.ci].m, me = e0.bodies[ix.oi].m, mue = e0.physics.G * (Me + me);
      const be0 = e0.bodies[ix.ci], be1 = e0.bodies[ix.oi];
      const ele = oscul(mue, [be1.x - be0.x, be1.y - be0.y, 0, be1.vx - be0.vx, be1.vy - be0.vy, 0]);
      const g0 = clone(e0); g0.physics.geoPN = 0;
      const tE = PL.orbits * ele.P, hE = e0.physics.stepDt;
      const rE = DIVS.map((div) => runCase(HP, e0, { dt: hE / div, tEnd: tE, ci: ix.ci, oi: ix.oi, mu: mue }));
      const rA = DIVS.map((div) => runCase(HP, g0, { dt: hE / div, tEnd: tE, ci: ix.ci, oi: ix.oi, mu: mue }));
      rec.E = { id: PL.e2d, elements: ele, hBook: hE, runsE: rE, runsA: rA,
        diff: DIVS.map((div, i) => ({ div, dPeri: rE[i].dVarpiPeri - rA[i].dVarpiPeri, dLrl: rE[i].dVarpiLrl - rA[i].dVarpiLrl,
          arcsecCyLrl: conv(rE[i].dVarpiLrl - rA[i].dVarpiLrl, rE[i].pAnom), arcsecCyPeri: conv(rE[i].dVarpiPeri - rA[i].dVarpiPeri, rE[i].pAnom),
          dPAnom: rE[i].pAnom - rA[i].pAnom, dPSid: rE[i].pSid - rA[i].pSid })) };
    }
    out.push(rec);
  }
  return out;
}

/* ── ③ 零試験 ─────────────────────────────────────────── */
const fpS = (S) => { let h = 0x811c9dc5; const f = new Float64Array(1), u8 = new Uint8Array(f.buffer);
  for (const k of ['x', 'y', 'z', 'vx', 'vy', 'vz', 'spin']) { const A = S[k]; if (!A) continue; for (let i = 0; i < S.n; i++) { f[0] = A[i]; for (let j = 0; j < 8; j++) h = Math.imul(h ^ u8[j], 0x01000193) >>> 0; } }
  return h.toString(16); };
export function part3(HP) {
  const runFp = (p, steps) => { const v = HP.validatePreset(clone(p)); if (!v.ok) return 'REJ'; HP.sim.build(v.preset); const S = HP.sim, dt = p.physics.stepDt || 0.016; for (let k = 0; k < steps; k++) S.step(dt); return { fp: fpS(S), S }; };
  const books = ['mercurySunInertial3d', 'earthMoonSunInertial3d', 'venusSunInertial3d', 'chainDiskToy3d'];
  const z1 = books.map((id) => { const p = find(HP, id), a = runFp(p, 400).fp, q = clone(p); q.physics.gLoc = { law: 'cLocPow', n: 0 }; const b = runFp(q, 400);
    return { id, same: a === b.fp, evals: HP.gLocState(b.S).evals }; });
  // κ → 0 と c₀ → ∞ で G に戻る: 固定中心の人工二体 2000 步の位置。κ_T = 0 を kappa:"kappaT" で読む宣言はビット同一(ψ = 0 → expm1(0) = 0)/
  //   c₀ の走査(受理の上限 cLight ≤ 10⁶ の中 —— 10⁴・10⁵・10⁶)で G 一定との位置の相対差が c₀⁻² で縮む(対数の傾き ≈ −2)
  const dt = 2 * Math.PI / 1000, step = (p) => { const v = HP.validatePreset(clone(p)); HP.sim.build(v.preset); const S = HP.sim; for (let k = 0; k < 2000; k++) S.step(dt); return [S.x[1], S.y[1]]; };
  const k0A = toyPreset({ pinned: true, m: 1e-6, d3: true }), k0B = toyPreset({ pinned: true, m: 1e-6, d3: true, gl: { law: 'kappaC2', kappa: 'kappaT' } });
  k0A.physics.kappaT = 0; k0B.physics.kappaT = 0;
  const ka = step(k0A), kb = step(k0B);
  const scan = [1e4, 1e5, 1e6].map((c) => { const a = step(toyPreset({ pinned: true, m: 1e-6, d3: true, c })), b = step(toyPreset({ pinned: true, m: 1e-6, d3: true, c, gl: { law: 'kappaC2' } }));
    return { c, relDiff: Math.hypot(a[0] - b[0], a[1] - b[1]) / Math.hypot(a[0], a[1]) }; });
  const slope = Math.log10(scan[2].relDiff / scan[0].relDiff) / 2;
  const z2 = { kappa0Same: ka[0] === kb[0] && ka[1] === kb[1], scan, logSlope: slope };
  // symmetric の運動量(自由な二体 m₂/m₁ = 0.25・20 公転)と receiver の交換の帳簿
  const sym = toyCase(HP, { pinned: false, m: 0.25, d3: true, gl: { law: 'kappaC2', pair: 'symmetric' } }, 1);
  const rec = toyCase(HP, { pinned: false, m: 0.25, d3: true, gl: { law: 'kappaC2' } }, 1);
  const z3 = { symDP: sym.gLoc.dP, symDPNorm: Math.hypot(...sym.gLoc.dP), recDP: rec.gLoc.dP, recDPNorm: Math.hypot(...rec.gLoc.dP), recMeasuredDP: rec.dP };
  // 二次元の拒否
  const p2 = clone(find(HP, 'mercurySunInertialFit')); p2.physics.gLoc = { law: 'kappaC2' };
  const v2 = HP.validatePreset(p2), z4 = { ok: v2.ok, errors: v2.errors };
  const gates = { offBitSame: z1.every((z) => z.same && z.evals > 0), cInf: z2.kappa0Same && Math.abs(z2.logSlope + 2) < 0.1, symMomentum: z3.symDPNorm < 1e-12 * Math.max(1, z3.recDPNorm) || z3.symDPNorm < 1e-15,
    reject2d: !z4.ok && /三次元/.test(z4.errors.join(' ')) };
  return { offBitSame: z1, cInf: z2, momentum: z3, reject2d: z4, gates };
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) {
  const t0 = Date.now();
  const OUT_PATH = process.env.W302B_OUT || path.join(ROOT, 'tests', 'out', 'gloc-w302b.json');
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
  pinDecl315c();   // 第315便c(AN406): 在位の 7 本の宣言を移行の前の写しへ(本ごとの門 —— 基点の html では no-op・正本の欄は足さない)
  pinDecl303(null, ['earthMoonSunInertial3d']);   // 第304便c: 🌦️🌔 を第303便の宣言へ(軟化 0.01・初期配置・W_bg —— 続く pinDecl302 が第302便の欄を戻す)
  pinDecl302(null, ['earthMoonSunInertial3d', 'marsSunInertial3d', 'mercurySunInertial3d', 'mercurySunInertialFit', 'venusSunInertial3d']);   // 第303便a: 在位の惑星の本の G_loc と フィットの本の W_bg・初期配置を第302便の宣言に戻して測る(歴史の値を保つ —— 写すのは再生成範囲の宣言の本だけ)
  const r3 = part3(HP); console.log('③ ' + JSON.stringify(r3.gates));
  const r1 = part1(HP);
  for (const r of r1.rows) { const d = r.diff[r.diff.length - 1]; console.log('① ' + r.cfg + ' ' + r.key + ' Δϖ(B−A) ' + d.dPeri.toExponential(5) + ' / LRL ' + d.dLrl.toExponential(5) + (r.analytic ? ' 解析 ' + r.analytic.toExponential(5) + ' 比 ' + r.ratio.toFixed(4) : '')); }
  const r2 = part2(HP);
  for (const P of r2) for (const r of P.rows) { const d = r.diff[r.diff.length - 1]; console.log('② ' + P.emoji + ' ' + r.key + ' ″/世紀 ' + (d.arcsecCyPeri === null ? '-' : d.arcsecCyPeri.toFixed(3)) + (r.analyticArcsecCy !== null ? ' 解析 ' + r.analyticArcsecCy.toFixed(3) : '')); }
  for (const P of r2) if (P.E) console.log('② E ' + P.E.id + ' ″/世紀 ' + P.E.diff.map((d) => d.arcsecCyPeri.toFixed(3)).join(' / '));
  const toyN2 = r1.rows.find((r) => r.cfg === 'fixed' && r.key === 'B_n2'), toyNm2 = r1.rows.find((r) => r.cfg === 'fixed' && r.key === 'B_nm2');
  const gates = Object.assign({}, r3.gates, { toyN2Within3pct: Math.abs(toyN2.ratio - 1) <= 0.03, toyNm2Within3pct: Math.abs(toyNm2.ratio - 1) <= 0.03 });
  const out = { meta: null, version: HP.GLOC_VERSION, part3: r3, toy: r1, planets: r2, gates, ok: Object.values(gates).every(Boolean) };
  const CODE = ['tests/exp-w302b-gloc.mjs', 'tests/lib-w315c-legacy7.mjs', 'tests/lib-w302a-wbg.mjs', 'tests/lib-w302c-pre.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs', 'tests/lib-w303a-pre.mjs', 'tests/lib-w304c-pre.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第302便b', target: TARGET, code: CODE, inputs: [TARGET, LEGACY7_DATA_FILE, DECL302_DATA_FILE, DECL303_DATA_FILE] }), {
    harnessVersion: HARNESS_VERSION, glocVersion: HP.GLOC_VERSION, loadErrors: errors.length, quick: QUICK,
    ruling: '原仮定者の裁定(第92報)AN304 ①(慣性速度に影響する重力の計算に 1PN 相当の補正 —— 局所光速の変化で局所重力が変化する G_loc = κ·c_loc²)・補足(G_loc = G·(c/c_loc)² ほかも広く検討する)',
    reading: '統括の検証項目 R187(族 G_loc = G·(c_loc/c₀)^n・弱場の一次の近点 Δϖ ≈ −2nπμ/(c₀²a(1−e²))・実験の行列 A〜E・h/h2/h4)',
    notClaim: ['G_loc で 43″/世紀が出た', 'GR の係数と一致した', '現実を再現した', 'どの n が正しいかを決めた'] });
  out.elapsedS = (Date.now() - t0) / 1000;
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 1) + '\n');
  console.log('gates ' + JSON.stringify(gates));
  console.log('→ ' + path.relative(ROOT, OUT_PATH) + '(' + out.elapsedS.toFixed(1) + ' s)・ok ' + out.ok);
  process.exit(out.ok ? 0 : 1);
}
