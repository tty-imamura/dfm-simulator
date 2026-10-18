// 第307便a(原仮定者の裁定(第100報)「軸引きずりは、引きずられる側の球面の、近い側と遠い側の『回転引きずりの差分』が引きずり軸回転として作用する。
// 源の軸回転の赤道面では歯車の様に逆回転。仰角が源の軸方向に近付くにつれて、弱まりつつ、軸と軸が同じ方向に回る様に逆さになる」・決断事項 AN345 ①②・
// 統括の検証項目 R209): **軸引きずりの球面の核の参照の器**(参照の求積とエンジンの opt-in spinDrag.axialModel:"sphere" の一致・角度分布・距離則の依存)。
//
// Node だけ(対象 html の inline script を tests/lib-w279b-headless.mjs の loadHtmlHeadless で読み、html の関数 inertialSpinMoment・inertialDrag3AxialSphereAt・
// dfmGaussLegendre01 と本の入口 validatePreset・coord3d.makeSim・build・step をそのまま呼ぶ)。参照は tests/lib-w307a-sphereaxial.mjs の**独立な求積**
// (源の球〔一様球の体積平均 = 今のエンジンの定義〕と薄い球面〔第100報の「球面」〕の上で直接・受け手の球面の上で剛体回転の成分を最小二乗で)。
// **在位の本の宣言は変えない**(写しは器の中で組む)。
//
// ■ 段
//   Q(求積と M1): 球面・球の求積のモーメント・M1 の直接の求積とエンジンの inertialSpinMoment(球)・薄い球面の閉じた式と求積・遠方の極限(球 3/5・球面 1)。
//   Z(零と奇): 自転 0 で 0・自転の反転で反転・(â, Ω) → (−â, −Ω) で不変・受け手の球面の上の一様な流れ(剛体の並進)で Ω = 0。
//   A(角度分布と距離則): 分母の 3 つの型(背景が支配 / 源の慣性決定力 r⁻² が支配 / 引きずりの核 r⁻³ が支配)× 源の球・球面で、仰角 0〜90° の
//     軸方向の成分・ベクトルの傾き・大きさ・局所の q_eff と遠方の型 (f/2)[(2−q)Ω + q r̂(r̂·Ω)] の一致・軸方向の成分が 0 になる仰角。
//   L(エンジンとの一致): エンジンの閉じた式(½∇×u —— 小さい受け手の極限)と参照の Richardson(R_i → 0)の相対の誤差(配置・軸・ε・源 2 つ・対の除外・inertialR2)。
//   F(有限の受け手の補正): Ω(R_i)/Ω(0) − 1 と (R_i/r)² の係数。
//   C(求積の収束): 源の次数 8/12/16 と受け手の次数 4/6/8。
//   E(エンジンの走行): 🔩🪛🍥🍩 の写しに axialModel:"sphere" を宣言した走行(受け手の符号の数・S.spin の不変・rotA = rotAIn + rotADr)・極の受け手の写し
//     (仰角ごとの引きずり軸回転の符号・傾きを持つ受け手の軸と帳簿)・μ² の明示/省略のビット同一・axialGain 0 と axial off の位置・速度の同一。
//
// ■ 言わないこと: 「磁気双極子と同じ」(向きの反転が似ている —— 強さの比は核の距離則に依る)・「金星の逆行を説明した」・「イオの加熱を再現した」・
//   「自転が釣り合った」・「法則を発見した」。器は候補の核の幾何と数値の一致を測るだけ。
//
// ■ 使い方
//   node tests/exp-w307a-sphereaxial.mjs   → 正本 tests/out/sphereaxial-w307a.json(段 sphereaxial-307a)
//   W307A_OUT=<json> で出力先を変える(試走は正本を書かない)・W307A_TARGET=<html>(既定 beta/index.html)・W307A_QUICK=1(求積と步数を縮める —— 煙試験の窓)。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlHeadless } from './lib-w279b-headless.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as L from './lib-w307a-sphereaxial.mjs';
// 第281便a の領域 hash の宣言(器と lib から deriveScope で引いた下限 + 本 4 本)
const REGEN_SCOPE = {"presets":["chainDiskToy3d","chainDiskToy3dTilt","chainSpreadToy3d","saturnRingInertial3d"],"roots":["$","HP.allPresets","HP.coord3d","HP.inertialDrag3SpinState","HP.validatePreset","REL_DRAG_AXIAL_LAW_SPHERE","REL_DRAG_AXIAL_SPHERE_H","REL_DRAG_AXIAL_SPHERE_VERSION","REL_DRAG_SPIN_NODES","T","ab","appStepDt","ctx","dfmGaussLegendre01","dfmInertialDragStep3","inertialDrag3AxialApply","inertialDrag3AxialSphere","inertialDrag3AxialSphereAt","inertialDrag3RigidStep","inertialSpinMoment","inertialSpinMomentDr","relDrag3SpinOf","relDragCoefficientOf"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w307a-sphereaxial-1';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (o) => JSON.parse(JSON.stringify(o));
const E = (H, name) => H.evalExpr(name);
const { dot, cross, norm, add, sub, scale, unit } = L;
const rel = (a, b) => norm(sub(a, b)) / Math.max(norm(b), 1e-300);
const r6 = (v) => (typeof v === 'number' && Number.isFinite(v)) ? Number(v.toPrecision(10)) : v;
const vr = (a) => a.map(r6);
const NOT_CLAIM = ['磁気双極子と同じ(向きの反転が似ている —— 強さの比は核の距離則に依る)', '金星の逆行を説明した', 'イオの加熱を再現した', '自転が釣り合った',
  '法則を発見した', '観測の 1σ で較正済み'];

/* ───────── 分母の 3 つの型 ───────── */
// 単一の源 m=1・R=1・Ω=1・軸 +z・ε=0。受け手は r = 30(遠方)。c と inertialR2 の q で分母の距離則を選ぶ
export const REGIMES = [
  { key: 'bg', ja: '背景が支配(D ≈ 1 —— f ∝ r⁻⁵ で q = 5)', C: 1e-6, i2q: null, qTheory: 5 },
  { key: 'inertial', ja: '源の慣性決定力 r⁻² が支配(D ∝ r⁻² —— q = 3)', C: 1, i2q: 1e8, qTheory: 3 },
  { key: 'drag', ja: '引きずりの核 r⁻³ が支配(D ∝ r⁻³ —— q = 2)', C: 1e9, i2q: null, qTheory: 2 },
];
const SRC0 = { p: [0, 0, 0], m: 1, Om: 1, a: [0, 0, 1], R: 1 };
function cfgOf(reg, kind, o = {}) {
  const src = { ...SRC0, ...(o.src || {}), kind };
  return { C: reg.C, eps: o.eps || 0, sources: [src], masses: [{ p: src.p, m: src.m }], i2: reg.i2q ? [{ p: src.p, q: reg.i2q }] : null, Dconst: 0 };
}

/* ───────── エンジンの閉じた式を呼ぶための最小の状態 ───────── */
/** bodies = [{p, m, Om, a, R}](受け手は Om 0・R 0 でよい)・o.i2 = {lambda}(sources:"all")・o.pairs = [[i, j], …](宣言した対 —— 省略は全対) */
function engineState(bodies, o = {}) {
  const n = bodies.length, F = (f) => Float64Array.from(bodies.map(f));
  const S = { n, m: F((b) => b.m), x: F((b) => b.p[0]), y: F((b) => b.p[1]), z: F((b) => b.p[2]), spin: F((b) => b.Om || 0), radOv: F((b) => b.R || 0),
    sax: F((b) => (b.a || [0, 0, 1])[0]), say: F((b) => (b.a || [0, 0, 1])[1]), saz: F((b) => (b.a || [0, 0, 1])[2]), pinned: new Uint8Array(n),
    relDrag: { law: 'inertial', Wbg: 1, ...(o.i2 ? { inertialR2: { lambda: o.i2.lambda, sources: 'all', self: 'off', env: 'off' } } : null) },
    params: { G: 1, cLight: 1 }, _rdPairSet: null, _rdPairN: n, _amKind: null };
  if (o.pairs) { S._rdPairSet = new Set(); for (const [i, j] of o.pairs) S._rdPairSet.add(i * n + j); }
  return S;
}
function engineOmega(H, S, C, eps, i) {
  const f = E(H, 'inertialDrag3AxialSphereAt');
  const q = f(S, S.n, C, eps, S.x, S.y, S.z, S.sax, S.say, S.saz, S.x[i], S.y[i], S.z[i], i, 1);
  return q ? [q.wx, q.wy, q.wz] : null;
}

/* ───────── 段 Q ───────── */
function partQ(H, quick) {
  const gl = E(H, 'dfmGaussLegendre01')(E(H, 'REL_DRAG_SPIN_NODES')), M1e = E(H, 'inertialSpinMoment');
  const rule = L.sphereRule(12), sum = (f) => rule.reduce((a, q) => a + q.w * f(q.s), 0);
  const moments = { one: sum(() => 1) - 1, x2: sum((s) => s[0] * s[0]) - 1 / 3, z4: sum((s) => s[2] ** 4) - 0.2, ballT2: L.ballRadial(8).reduce((a, q) => a + q.w * q.t * q.t, 0) - 0.6 };
  const rows = [];
  for (const eps of [0, 0.3]) for (const r of [1.5, 2, 3, 10, 100, 1000, 1e4]) {
    const e = M1e(r, 1, eps, gl), b = L.sourceM1(r, 1, 'ball', { nS: quick ? 12 : 16, nR: quick ? 12 : 16, eps }), s = L.sourceM1(r, 1, 'shell', { nS: quick ? 12 : 16, eps }), sc = L.shellM1Closed(r, 1, eps);
    rows.push({ eps, rOverR: r, engineBall: e, quadBall: b, relEngineVsQuad: e / b - 1, quadShell: s, closedShell: sc, relShellClosed: sc / s - 1,
      farBall: e / (0.6 / r ** 4), farShell: s / (1 / r ** 4), shellOverBall: s / b });
  }
  return { moments, rows };
}

/* ───────── 段 Z ───────── */
function partZ(quick) {
  const opt = { nS: quick ? 8 : 12, nR: quick ? 8 : 12, nRec: 6 }, reg = REGIMES[1], x = L.scale(L.dirAt([0, 0, 1], 20, 30), 30);
  const base = L.rigidLimit(x, 0.03, cfgOf(reg, 'ball'), opt).Om;
  const zero = L.rigidLimit(x, 0.03, cfgOf(reg, 'ball', { src: { Om: 0 } }), opt).Om;
  const rev = L.rigidLimit(x, 0.03, cfgOf(reg, 'ball', { src: { Om: -1 } }), opt).Om;
  const flip = L.rigidLimit(x, 0.03, cfgOf(reg, 'ball', { src: { Om: -1, a: [0, 0, -1] } }), opt).Om;
  // 一様な流れ(剛体の並進)は回転を作らない —— 受け手の球面の抽出器そのものの零試験
  const rule = L.sphereRule(6);
  let O = [0, 0, 0]; for (const { s, w } of rule) O = add(O, scale(cross(scale(s, 0.1), [0.3, -0.2, 0.7]), w));
  // 剛体流 u = Ω0 × x の抽出は Ω0(curl の半分 —— 2 倍の取り違えの検出)
  const Om0 = [0.2, -0.5, 0.9]; let O2 = [0, 0, 0];
  for (const { s, w } of rule) { const xi = scale(s, 0.7); O2 = add(O2, scale(cross(xi, cross(Om0, add([3, 1, 2], xi))), w)); }
  O2 = scale(O2, 3 / (2 * 0.49));
  return { base: vr(base), zeroMax: norm(zero), revRel: rel(rev, scale(base, -1)), flipRel: rel(flip, base), uniformMax: norm(O), rigidRel: rel(O2, Om0) };
}

/* ───────── 段 A ───────── */
const ELS = [0, 10, 20, 30, L.zeroElevationDeg(3), 40, 45, 50, L.zeroElevationDeg(5), 60, 70, 80, 90];
function qEff(cfg, opt, r) {
  // 赤道の |u|/(r Ω) の局所の対数勾配(r(1 ± 0.01) —— 中心差分)
  const f = (rr) => norm(L.fieldU([rr, 0, 0], cfg, opt)) / rr;
  const h = 0.01;
  return -(Math.log(f(r * (1 + h))) - Math.log(f(r * (1 - h)))) / (Math.log(1 + h) - Math.log(1 - h));
}
function partA(quick) {
  const opt = { nS: quick ? 8 : 12, nR: quick ? 8 : 12, nRec: 6 }, r = 30, Ri = 0.03, out = [];
  for (const reg of REGIMES) for (const kind of ['ball', 'shell']) {
    const cfg = cfgOf(reg, kind), q = qEff(cfg, opt, r), f = norm(L.fieldU([r, 0, 0], cfg, opt)) / r;
    const pole = L.rigidLimit([0, 0, r], Ri, cfg, opt).Om[2];
    const rows = [];
    for (const el of ELS) {
      const rh = L.dirAt([0, 0, 1], el, 0), x = scale(rh, r);
      const Om = L.rigidLimit(x, Ri, cfg, opt).Om, far = L.farForm(f, q, [0, 0, 1], rh);
      const ax = Om[2], tr = Math.hypot(Om[0], Om[1]);
      rows.push({ el: r6(el), axial: r6(ax), axialOverPole: r6(ax / pole), transverse: r6(tr), mag: r6(norm(Om)), tiltDeg: r6(Math.atan2(tr, ax) * 180 / Math.PI),
        farRel: r6(rel(Om, far)), theoryAxialOverPole: r6(((2 - q) + q * Math.sin(el * Math.PI / 180) ** 2) / 2) });
    }
    const eq = rows[0], po = rows[rows.length - 1];
    // 軸方向の成分が 0 になる仰角(行の符号の変わり目を線形で)
    let zeroEl = null;
    for (let k = 1; k < rows.length; k++) if (rows[k - 1].axial < 0 && rows[k].axial >= 0) { const a = rows[k - 1], b = rows[k]; zeroEl = a.el + (b.el - a.el) * (-a.axial) / (b.axial - a.axial); break; }
    out.push({ regime: reg.key, ja: reg.ja, kind, r, qTheory: reg.qTheory, qEff: r6(q), f: r6(f), equatorOverPole: r6(eq.axial / po.axial), zeroElevationDeg: r6(zeroEl),
      zeroElevationTheoryDeg: r6(L.zeroElevationDeg(q)), weakerTowardAxis: Math.abs(po.axial) < Math.abs(eq.axial), rows });
  }
  return out;
}

/* ───────── 段 L ───────── */
function partL(H, quick) {
  const opt = { nS: quick ? 10 : 14, nR: quick ? 10 : 14, nRec: 6 }, out = [];
  const add1 = (name, bodies, recv, C, eps, o = {}) => {
    // 参照: 受け手 recv から見た源(自転・半径のある体)と分母の質量(受け手以外・宣言した対)・inertialR2(sources:"all")
    const pairOk = (j) => !o.pairs || o.pairs.some(([a, b]) => a === recv && b === j);
    const cfg = { C, eps, sources: [], masses: [], i2: o.i2 ? [] : null, Dconst: 0 };
    bodies.forEach((b, j) => {
      if (j === recv) return;
      if (pairOk(j)) { cfg.masses.push({ p: b.p, m: b.m }); if (b.Om && b.R > 0) cfg.sources.push({ p: b.p, m: b.m, Om: b.Om, a: unit(b.a || [0, 0, 1]), R: b.R, kind: 'ball' }); }
      if (o.i2) cfg.i2.push({ p: b.p, q: b.m / o.i2.lambda });
    });
    const xr = bodies[recv].p, d = norm(sub(xr, bodies[0].p)), Ri = 1e-3 * d;
    const ref = L.rigidLimit(xr, Ri, cfg, opt).Om, eng = engineOmega(H, engineState(bodies, o), C, eps, recv);
    // 尺度: 源ごとの f|Ω| = |c m Ω| M1(r)/(r D)(Ω_D ~ (f/2)·O(q) —— 赤道で q ≈ 2 の打ち消しの点でも相対の誤差が意味を持つ尺度)
    const Dx = L.denomOf(xr, cfg);
    let sc = 0; for (const s of cfg.sources) { const rr = norm(sub(xr, s.p)); sc += Math.abs(C * s.m * s.Om) * L.sourceM1(rr, s.R, 'ball', { nS: opt.nS, nR: opt.nR, eps }) / (rr * Dx); }
    out.push({ name, C, eps, rOverR: r6(d / (bodies[0].R || 1)), ref: vr(ref), engine: vr(eng), rel: r6(rel(eng, ref)), relScale: r6(norm(sub(eng, ref)) / Math.max(sc, norm(ref), 1e-300)), scale: r6(sc), RiOverR: 1e-3 });
  };
  const ax30 = L.dirAt([0, 0, 1], 60, 40);   // 軸を +z から 30° 傾けた(方位 40°)
  for (const reg of REGIMES) for (const eps of [0, 0.3]) for (const r of [3, 10, 100]) for (const el of [0, 30, 60, 90]) {
    const bodies = [{ p: [0, 0, 0], m: 1, Om: 1, a: [0, 0, 1], R: 1 }, { p: scale(L.dirAt([0, 0, 1], el, 25), r), m: 1e-3 }];
    add1(`single/${reg.key}/eps${eps}/r${r}/el${el}`, bodies, 1, reg.C, eps, reg.i2q ? { i2: { lambda: 1 / reg.i2q } } : {});
  }
  for (const reg of REGIMES) {
    add1(`tilted/${reg.key}`, [{ p: [0.5, -0.2, 0.1], m: 2, Om: -0.7, a: ax30, R: 1.2 }, { p: [8, 5, 3], m: 1e-3 }], 1, reg.C, 0.1, reg.i2q ? { i2: { lambda: 2 / reg.i2q } } : {});
    const two = [{ p: [0, 0, 0], m: 1, Om: 1, a: [0, 0, 1], R: 1 }, { p: [12, 1, 6], m: 0.6, Om: -1.4, a: L.dirAt([0, 0, 1], 20, 200), R: 0.8 }, { p: [6, 4, 2], m: 1e-3 }, { p: [-9, 3, -4], m: 0.3 }];
    add1(`twoSources/${reg.key}`, two, 2, reg.C, 0.05, reg.i2q ? { i2: { lambda: 1 / reg.i2q } } : {});
    add1(`mask/${reg.key}`, two, 2, reg.C, 0.05, { ...(reg.i2q ? { i2: { lambda: 1 / reg.i2q } } : {}), pairs: [[2, 0], [2, 3]] });
  }
  // 遠方(r/R = 10³・10⁴): 第307便a ではエンジンの M1 の桁落ち(既存の式)が 5 点の微分で増幅された(r/R 10⁴ で 3.21e-3)。第308便a(R214)から r ≥ 4(R+ε) は
  //   M1 と dM1/dr を外部の級数(inertialSpinMomentFar)で作る —— 記録だけ(門に入れない)
  const far = [];
  for (const r of [300, 1000, 1e4]) {
    const before = out.length;
    add1(`far/inertial/r${r}`, [{ p: [0, 0, 0], m: 1, Om: 1, a: [0, 0, 1], R: 1 }, { p: [r, 0, 0], m: 1e-3 }], 1, 1, 0, { i2: { lambda: 1e-8 } });
    far.push(out.splice(before, 1)[0]);
  }
  const gated = out, maxRel = Math.max(...gated.map((q) => q.relScale)), maxRelRaw = Math.max(...gated.map((q) => q.rel));
  return { rows: gated, maxRel, maxRelRaw, far };
}

/* ───────── 段 F ───────── */
function partF(quick) {
  const opt = { nS: quick ? 10 : 14, nR: quick ? 10 : 14, nRec: 8 }, r = 10, out = [];
  for (const reg of REGIMES) for (const el of [0, 45, 90]) {
    const cfg = cfgOf(reg, 'ball'), x = scale(L.dirAt([0, 0, 1], el, 0), r), O0 = L.rigidLimit(x, 1e-3 * r, cfg, opt).Om, rows = [];
    for (const k of [0.01, 0.03, 0.1, 0.2, 0.3]) { const O = L.rigidPart(x, k * r, cfg, opt).Om, d = rel(O, O0); rows.push({ RiOverR: k, rel: r6(d), coef: r6(d / (k * k)) }); }
    out.push({ regime: reg.key, el, rows });
  }
  return out;
}

/* ───────── 段 C ───────── */
function partC() {
  const reg = REGIMES[1], cfg = cfgOf(reg, 'ball'), x = scale(L.dirAt([0, 0, 1], 25, 0), 3), rows = [];
  const ref = L.rigidPart(x, 0.5, cfg, { nS: 20, nR: 20, nRec: 10 }).Om;
  for (const nS of [8, 12, 16]) rows.push({ nS, nR: nS, nRec: 8, rel: r6(rel(L.rigidPart(x, 0.5, cfg, { nS, nR: nS, nRec: 8 }).Om, ref)) });
  for (const nRec of [4, 6, 8]) rows.push({ nS: 20, nR: 20, nRec, rel: r6(rel(L.rigidPart(x, 0.5, cfg, { nS: 20, nR: 20, nRec }).Om, ref)) });
  return { at: { rOverR: 3, RiOverR: 0.5, el: 25 }, rows };
}

/* ───────── 段 E ───────── */
function presetOf(HP, id) { const p = HP.allPresets().find((q) => q.id === id); if (!p) throw new Error('本が無い: ' + id); return clone(p); }
function build(H, q) {
  const HP = H.HP, v = HP.validatePreset(q);
  if (!v.ok) throw new Error('validatePreset: ' + JSON.stringify(v.errors || v.err).slice(0, 300));
  const S = HP.coord3d.makeSim(); S.build(clone(v.preset));
  return { S, dt: E(H, 'appStepDt')(S), preset: v.preset };
}
const fp = (S, keys) => { const h = crypto.createHash('sha1'); for (const k of keys) { const a = S[k]; if (a) h.update(Buffer.from(Float64Array.from(a.subarray(0, S.n)).buffer)); } return h.digest('hex').slice(0, 16); };
const SPHERE = { rot: 'surfaceFlip', axial: 'on', axialModel: 'sphere' };
/** 宣言から本を探す: 三次元で spinDrag.rot を宣言した本(本の宣言か一押し)—— 🔩🪛🍥🍩 */
export function idsFromDecl(HP) {
  const on = (r) => !!(r && r.spinDrag && r.spinDrag.rot === 'surfaceFlip');
  const hit = (e) => (p) => (p.physics || {}).coord === '3d' && p.familyRole !== 'retired' && p.emoji === e
    && (on((p.physics || {}).relativeDrag) || on(p.abBody && p.abBody.physicsPatch && p.abBody.physicsPatch.relativeDrag));
  const out = {};
  for (const e of ['🔩', '🪛', '🍥', '🍩']) { const p = HP.allPresets().find(hit(e)); if (p) out[e] = p.id; }
  return out;
}
function runBook(H, id, patch, N) {
  const HP = H.HP, base = presetOf(HP, id);
  if (patch === 'ab') base.physics.relativeDrag = clone(base.abBody.physicsPatch.relativeDrag);
  const q = clone(base); q.physics.relativeDrag.spinDrag = { ...SPHERE };
  const a = build(H, q), S = a.S, spin0 = Float64Array.from(S.spin.subarray(0, S.n));
  let finite = true;
  for (let k = 0; k < N; k++) { a.S.step(a.dt); }
  const n = S.n, src = [];
  for (let j = 0; j < n; j++) if (S.spin[j] !== 0 && S.radOv[j] > 0 && S.m[j] > 0) src.push(j);
  let neg = 0, pos = 0, zero = 0, sumRes = 0, spinSame = true;
  for (let i = 0; i < n; i++) {
    if (!Object.is(S.spin[i], spin0[i])) spinSame = false;
    const w = S._rdWS ? S._rdWS[i] : 0;
    if (!Number.isFinite(w) || !Number.isFinite(S.rotADr[i])) finite = false;
    if (S.pinned[i] || !(S.m[i] > 0)) continue;
    const sgn = Math.sign(w) * Math.sign(S.spin[src[0]] || 1);
    if (sgn < 0) neg++; else if (sgn > 0) pos++; else zero++;
    sumRes = Math.max(sumRes, Math.abs(S.rotA[i] - (S.rotAIn[i] + S.rotADr[i])) / Math.max(1, Math.abs(S.rotA[i])));
  }
  const st = HP.inertialDrag3SpinState(S);
  // 源が 1 つの本: 受け手ごとの距離・源の赤道面からの仰角・符号と分母の ξ = D − 1(引きずりの核と r⁻² の項の和 × c)—— 符号の変わる ξ を読む
  let profile = null;
  if (src.length === 1) {
    const j = src[0], f = E(H, 'inertialDrag3AxialSphereAt'), rd = S.relDrag, C = E(H, 'relDragCoefficientOf')(rd), eps = (rd.eps !== undefined) ? rd.eps : (S.params.softening || 0), rows = [];
    for (let i = 0; i < n; i++) {
      if (i === j || S.pinned[i] || !(S.m[i] > 0)) continue;
      const d = [S.x[i] - S.x[j], S.y[i] - S.y[j], S.z[i] - S.z[j]], r = norm(d), mu = dot(d, [S.sax[j], S.say[j], S.saz[j]]) / r;
      const q = f(S, n, C, eps, S.x, S.y, S.z, S.sax, S.say, S.saz, S.x[i], S.y[i], S.z[i], i, 1);
      if (q) rows.push({ r, el: Math.asin(Math.max(-1, Math.min(1, mu))) * 180 / Math.PI, sgn: Math.sign(q.ws) * Math.sign(S.spin[j]), xi: q.D - 1 });
    }
    // 対照: 分母から源以外の質量を外した写し(受け手どうしの質量が作る ∇D の寄与を除く —— 単一の源の型そのもの)
    const T = Object.create(S); T.m = Float64Array.from(S.m.subarray(0, n)); for (let k = 0; k < n; k++) if (k !== j) T.m[k] = 0;
    let neg0 = 0, pos0 = 0;
    for (let i = 0; i < n; i++) {
      if (i === j || S.pinned[i] || !(S.m[i] > 0)) continue;
      const q = f(T, n, C, eps, S.x, S.y, S.z, S.sax, S.say, S.saz, S.x[i], S.y[i], S.z[i], i, 1);
      if (q) { const sg = Math.sign(q.ws) * Math.sign(S.spin[j]); if (sg < 0) neg0++; else if (sg > 0) pos0++; }
    }
    const pos = rows.filter((q) => q.sgn > 0), neg = rows.filter((q) => q.sgn < 0);
    profile = { receivers: rows.length, posXiMin: pos.length ? r6(Math.min(...pos.map((q) => q.xi))) : null, negXiMax: neg.length ? r6(Math.max(...neg.map((q) => q.xi))) : null,
      posRMax: pos.length ? r6(Math.max(...pos.map((q) => q.r))) : null, negRMin: neg.length ? r6(Math.min(...neg.map((q) => q.r))) : null,
      posElAbsMax: pos.length ? r6(Math.max(...pos.map((q) => Math.abs(q.el)))) : null, negElAbsMax: neg.length ? r6(Math.max(...neg.map((q) => Math.abs(q.el)))) : null, sourceR: S.radOv[j],
      sourceOnlyDenominator: { neg: neg0, pos: pos0 } };
  }
  return { id, patch, steps: N, n, sources: src.length, receiversNeg: neg, receiversPos: pos, receiversZero: zero, finite, spinUntouched: spinSame, splitResidualMax: sumRes, profile,
    sphere: st.sphere, axial: { terms: st.axial.terms, omegaMax: r6(st.axial.omegaMax), rotA: r6(st.axial.rotA), dLspin: st.axial.dLspin } };
}
/** 極の受け手の写し: 源(pinned・m 100・R 6・Ω 0.5・軸 +z)と仰角 0〜90° の受け手(G = 0・速度 0)。受け手の半分は傾きを持つ(軸を有効化 —— 歳差なし・自転 0.3) */
function polarCase(H, o = {}) {
  const els = [0, 15, 30, 35.26, 45, 50.77, 60, 75, 90], r = 20, bodies = [];
  bodies.push({ type: 'single', m: 100, x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, radius: 6, spin: 0.5, pinned: true, spinAxis: { enable: true, source: 'declared', tiltDeg: 0, azimuthDeg: 0 } });
  for (const el of els) for (const tilt of [false, true]) {
    const d = L.dirAt([0, 0, 1], el, 0), rr = tilt ? 1.5 * r : r;   // 傾きを持つ受け手は同じ向きの 1.5 倍の距離(一致点を作らない)
    bodies.push({ type: 'single', m: 0.01, x: rr * d[0], y: rr * d[1], z: rr * d[2], vx: 0, vy: 0, vz: 0, radius: 0.5, spin: tilt ? 0.3 : 0, pinned: false,
      ...(tilt ? { spinAxis: { enable: true, source: 'declared', tiltDeg: 20, azimuthDeg: 30 } } : {}) });
  }
  // 🪛 の写しの外枠(camera・world ほか)に体と物理だけを差し替える(G = 0 —— 速度 0 の受け手は回転引きずりの移送だけで動く)
  const p = presetOf(H.HP, 'chainDiskToy3dTilt');
  p.id = 'w307aPolar'; p.bodies = bodies; delete p.abBody; delete p.timeRef;
  p.physics = { ...p.physics, G: 0, relativeDrag: { law: 'inertial', Wbg: o.Wbg || 0.125, eps: 0.5, pairs: 'all', ...(o.i2 ? { inertialR2: o.i2 } : {}), spinDrag: o.spinDrag || { ...SPHERE } } };
  return { p, els };
}
function partE(H, quick) {
  const HP = H.HP, ids = idsFromDecl(HP), N = quick ? 20 : 120, books = [];
  for (const e of ['🔩', '🪛', '🍥', '🍩']) if (ids[e]) books.push({ emoji: e, ...runBook(H, ids[e], e === '🍩' ? 'ab' : null, e === '🍥' ? Math.min(N, 40) : N) });
  // 極の受け手(背景が支配に近い既定 W_bg と、inertialR2 を足して r⁻² が支配の 2 通り)
  const polar = [];
  for (const variant of [{ key: 'wbg', o: {} }, { key: 'inertialR2', o: { i2: { lambda: 1e-6, sources: 'all' } } }]) {
    const { p, els } = polarCase(H, variant.o), a = build(H, p), S = a.S;
    const n0 = S.n, spin0 = Float64Array.from(S.spin.subarray(0, n0)), ax0 = [Float64Array.from(S.sax.subarray(0, n0)), Float64Array.from(S.say.subarray(0, n0)), Float64Array.from(S.saz.subarray(0, n0))];
    const steps = quick ? 10 : 40;
    for (let k = 0; k < steps; k++) S.step(a.dt);
    const rows = [];
    let Js = [0, 0, 0];
    els.forEach((el, k) => {
      const flat = 1 + 2 * k, tilt = flat + 1;
      const wvec = [S._rdWX[flat], S._rdWY[flat], S._rdWZ[flat]];
      rows.push({ el, wsFlat: r6(S._rdWS[flat]), rotADrFlat: r6(S.rotADr[flat]), omegaFlat: vr(wvec), tiltDeg: r6(Math.atan2(Math.hypot(wvec[0], wvec[1]), wvec[2]) * 180 / Math.PI),
        rotADrTilt: r6(S.rotADr[tilt]), axisTurnDeg: r6(Math.acos(Math.max(-1, Math.min(1, S.sax[tilt] * ax0[0][tilt] + S.say[tilt] * ax0[1][tilt] + S.saz[tilt] * ax0[2][tilt]))) * 180 / Math.PI) });
      const J = 0.5 * S.m[tilt] * S.R[tilt] * S.R[tilt] * S.spin[tilt];
      Js = add(Js, scale([S.sax[tilt] - ax0[0][tilt], S.say[tilt] - ax0[1][tilt], S.saz[tilt] - ax0[2][tilt]], J));
    });
    let spinSame = true; for (let i = 0; i < n0; i++) if (!Object.is(S.spin[i], spin0[i])) spinSame = false;
    const st = HP.inertialDrag3SpinState(S), zeroCross = (() => { for (let k = 1; k < rows.length; k++) if (rows[k - 1].wsFlat < 0 && rows[k].wsFlat >= 0) return r6(rows[k - 1].el + (rows[k].el - rows[k - 1].el) * (-rows[k - 1].wsFlat) / (rows[k].wsFlat - rows[k - 1].wsFlat)); return null; })();
    polar.push({ variant: variant.key, steps, rows, zeroCrossDeg: zeroCross, equatorNeg: rows[0].wsFlat < 0, poleSame: rows[rows.length - 1].wsFlat > 0, spinUntouched: spinSame,
      dLspinLedger: vr(st.axial.dLspin), dLspinIndependent: vr(Js), ledgerRel: r6(rel(st.axial.dLspin, Js)) });
  }
  // μ² の明示("mu2")と省略のビット同一(🪛 の写し)・axialGain 0 と axial off の位置・速度の同一(🔩 の写し)
  const tiltId = ids['🪛'], diskId = ids['🔩'], K = quick ? 20 : 80;
  const runFp = (id, sd) => { const q = presetOf(HP, id); if (sd) q.physics.relativeDrag.spinDrag = sd; const a = build(H, q); for (let k = 0; k < K; k++) a.S.step(a.dt); return a.S; };
  const A0 = runFp(tiltId, null), A1 = runFp(tiltId, { ...presetOf(HP, tiltId).physics.relativeDrag.spinDrag, axialModel: 'mu2' });
  const keysAll = ['x', 'y', 'z', 'vx', 'vy', 'vz', 'rotA', 'sax', 'say', 'saz', 'spin', 'rotAIn', 'rotADr'], keysXV = ['x', 'y', 'z', 'vx', 'vy', 'vz', 'spin'];
  const B0 = runFp(diskId, { rot: 'surfaceFlip', axial: 'off' }), B1 = runFp(diskId, { ...SPHERE, axialGain: 0 });
  let gain0Zero = true; for (let i = 0; i < B1.n; i++) if (B1.rotADr[i] !== 0) gain0Zero = false;
  return { ids, steps: N, books, polar, mu2Explicit: { id: tiltId, steps: K, same: fp(A0, keysAll) === fp(A1, keysAll), fp: fp(A0, keysAll) },
    gain0: { id: diskId, steps: K, xvSame: fp(B0, keysXV) === fp(B1, keysXV), rotADrZero: gain0Zero } };
}

/* ───────── 段 R(第 2 段 —— spinDrag.rotStep:"rigid")───────── */
/** 対称な環: 源(pinned・m 100・R 6・Ω 0.5・軸 +z)と半径 20・高さ 3 の環の k 個の受け手(G = 0・速度 0 —— 回転引きずりの移送だけで動く) */
function ringCase(H, rotStep, k, h) {
  const p = presetOf(H.HP, 'chainDiskToy3dTilt');
  delete p.abBody; delete p.timeRef;
  const bodies = [{ type: 'single', m: 100, x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, radius: 6, spin: 0.5, pinned: true, spinAxis: { enable: true, source: 'declared', tiltDeg: 0, azimuthDeg: 0 } }];
  for (let i = 0; i < k; i++) { const a = 2 * Math.PI * i / k; bodies.push({ type: 'single', m: 0.01, x: 20 * Math.cos(a), y: 20 * Math.sin(a), z: 3, vx: 0, vy: 0, vz: 0, radius: 0.5, spin: 0, pinned: false }); }
  p.bodies = bodies;
  p.physics = { ...p.physics, G: 0, stepDt: h, relativeDrag: { law: 'inertial', Wbg: 0.125, eps: 0.5, pairs: 'all', spinDrag: { rot: 'surfaceFlip', axial: 'off', ...(rotStep ? { rotStep } : {}) } } };
  return p;
}
function pairDist(S) { const o = []; for (let i = 1; i < S.n; i++) for (let j = i + 1; j < S.n; j++) o.push(Math.hypot(S.x[i] - S.x[j], S.y[i] - S.y[j], S.z[i] - S.z[j])); return o; }
function partR(H, quick) {
  const HP = H.HP, ring = [], T = quick ? 2 : 10;
  for (const rs of ['linear', 'rigid']) for (const h of [0.05, 0.025]) {
    const a = build(H, ringCase(H, rs, 12, h)), S = a.S, d0 = pairDist(S), N = Math.round(T / h);
    for (let k = 0; k < N; k++) S.step(h);
    const d1 = pairDist(S); let pr = 0; d0.forEach((d, q) => { pr = Math.max(pr, Math.abs(d1[q] / d - 1)); });
    let rho = 0; for (let i = 1; i < S.n; i++) rho += Math.hypot(S.x[i], S.y[i]) - 20; rho /= S.n - 1;
    let vmax = 0; for (let i = 0; i < S.n; i++) vmax = Math.max(vmax, Math.abs(S.vx[i]), Math.abs(S.vy[i]), Math.abs(S.vz[i]));
    const st = HP.inertialDrag3SpinState(S);
    ring.push({ rotStep: rs, h, steps: N, pairRelMax: pr, drhoMean: rho, vMax: vmax, ledger: st.rotStep || null });
  }
  const g = (rs, h) => ring.find((q) => q.rotStep === rs && q.h === h);
  // 省略と "linear" の明示のビット同一(🔩 の写し)
  const ids = idsFromDecl(HP), K = quick ? 20 : 60;
  const runFp = (id, sd, patch, steps, keys) => { const q = presetOf(HP, id); if (patch === 'ab') q.physics.relativeDrag = clone(q.abBody.physicsPatch.relativeDrag); if (sd) q.physics.relativeDrag.spinDrag = sd; const a = build(H, q); for (let k = 0; k < steps; k++) a.S.step(a.dt); return { S: a.S, dt: a.dt }; };
  const keysAll = ['x', 'y', 'z', 'vx', 'vy', 'vz', 'rotA', 'sax', 'say', 'saz', 'spin'];
  const A0 = runFp(ids['🔩'], null, null, K).S, A1 = runFp(ids['🔩'], { rot: 'surfaceFlip', axial: 'off', rotStep: 'linear' }, null, K).S;
  // 🍩 の一押し(W_bg 0.02211)の写し: 線形と剛体の差(h と h/2 —— 同じ連続の極限なら差は h に比例)・1 步の後の速度のビット同一
  const ringId = ids['🍩'], N2 = quick ? 40 : 200, rows = [];
  const rhoOf = (S) => { let s = 0, k = 0; for (let i = 0; i < S.n; i++) { if (S.pinned[i]) continue; s += Math.hypot(S.x[i] - S.x[0], S.y[i] - S.y[0], S.z[i] - S.z[0]); k++; } return s / k; };
  for (const div of [1, 2]) {
    const mk = (rs) => { const q = presetOf(HP, ringId); q.physics.relativeDrag = clone(q.abBody.physicsPatch.relativeDrag); q.physics.relativeDrag.spinDrag = { rot: 'surfaceFlip', axial: 'off', ...(rs ? { rotStep: rs } : {}) }; q.physics.stepDt = (q.physics.stepDt || 0.58) / div; return build(H, q); };
    const Lb = mk(null), Rb = mk('rigid');
    for (let k = 0; k < N2 * div; k++) { Lb.S.step(Lb.dt); Rb.S.step(Rb.dt); }
    let d2 = 0, c = 0; for (let i = 0; i < Lb.S.n; i++) { if (Lb.S.pinned[i]) continue; d2 += (Lb.S.x[i] - Rb.S.x[i]) ** 2 + (Lb.S.y[i] - Rb.S.y[i]) ** 2 + (Lb.S.z[i] - Rb.S.z[i]) ** 2; c++; }
    rows.push({ div, dt: Lb.dt, steps: N2 * div, rmsDiff: Math.sqrt(d2 / c), meanRhoLinear: rhoOf(Lb.S), meanRhoRigid: rhoOf(Rb.S), dRho: rhoOf(Lb.S) - rhoOf(Rb.S), ledger: HP.inertialDrag3SpinState(Rb.S).rotStep });
  }
  const one = (rs) => { const q = presetOf(HP, ringId); q.physics.relativeDrag = clone(q.abBody.physicsPatch.relativeDrag); q.physics.relativeDrag.spinDrag = { rot: 'surfaceFlip', axial: 'off', ...(rs ? { rotStep: rs } : {}) }; const a = build(H, q); a.S.step(a.dt); a.S.step(a.dt); return a.S; };
  const V0 = one(null), V1 = one('rigid');
  // 剛体の位置の步と球面の軸引きずりを一緒に(🪛 の写し —— 有限・慣性自転の不変)
  const both = runFp(ids['🪛'], { rot: 'surfaceFlip', axial: 'on', axialModel: 'sphere', rotStep: 'rigid' }, null, K).S;
  let bothFinite = true; for (let i = 0; i < both.n; i++) if (![both.x[i], both.y[i], both.z[i], both.rotA[i]].every(Number.isFinite)) bothFinite = false;
  return { ring, ringRatio: { linear: g('linear', 0.05).drhoMean / g('linear', 0.025).drhoMean },
    linearExplicit: { id: ids['🔩'], steps: K, same: fp(A0, keysAll) === fp(A1, keysAll) },
    donut: { id: ringId, rows, ratio: rows[0].rmsDiff / rows[1].rmsDiff, dRhoRatio: rows[0].dRho / rows[1].dRho,
      velocityAfterTwoSteps: { posSame: fp(V0, ['x', 'y', 'z']) === fp(V1, ['x', 'y', 'z']), velSame: fp(V0, ['vx', 'vy', 'vz']) === fp(V1, ['vx', 'vy', 'vz']) } },
    withSphere: { id: ids['🪛'], steps: K, finite: bothFinite, state: HP.inertialDrag3SpinState(both).rotStep } };
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const Q = J.Q, Z = J.Z, A = J.A, Lr = J.L, F = J.F, C = J.C, Er = J.E;
  const near = Q.rows.filter((r) => r.rOverR >= 3 && r.rOverR <= 100);
  const byReg = (k, kind) => A.find((a) => a.regime === k && a.kind === kind);
  return {
    quadratureMoments: Object.values(Q.moments).every((v) => Math.abs(v) < 1e-13),
    m1EngineMatchesQuadrature: near.every((r) => Math.abs(r.relEngineVsQuad) < 1e-8),
    shellClosedMatchesQuadrature: near.every((r) => Math.abs(r.relShellClosed) < 1e-7),
    farLimits: Q.rows.filter((r) => r.rOverR === 1000).every((r) => Math.abs(r.farBall - 1) < 1e-5 && Math.abs(r.farShell - 1) < 1e-5),
    zeroSpinZero: Z.zeroMax === 0, spinOdd: Z.revRel < 1e-12, axisFlipInvariant: Z.flipRel < 1e-12, uniformFlowNoRotation: Z.uniformMax < 1e-15, rigidFlowHalfCurl: Z.rigidRel < 1e-12,
    equatorReversed: A.filter((a) => a.qTheory > 2).every((a) => a.rows[0].axial < 0),
    poleSameSense: A.every((a) => a.rows[a.rows.length - 1].axial > 0),
    qEffMatchesRegime: A.every((a) => Math.abs(a.qEff - a.qTheory) < 0.05),
    farFormMatches: A.every((a) => a.rows.every((r) => r.farRel < 0.05)),
    zeroElevationMatches: ['bg', 'inertial'].every((k) => ['ball', 'shell'].every((kind) => { const a = byReg(k, kind); return a.zeroElevationDeg !== null && Math.abs(a.zeroElevationDeg - a.zeroElevationTheoryDeg) < 1.0; })),
    vectorTiltsAtMidLatitude: A.every((a) => a.rows.filter((r) => r.el > 5 && r.el < 85).every((r) => r.transverse > 0)),
    engineMatchesReference: Lr.maxRel < 1e-7,
    finiteReceiverQuadratic: F.every((f) => Math.abs(f.rows[1].coef / f.rows[0].coef - 1) < 0.02),
    quadratureConverges: C.rows.filter((r) => r.nS >= 12 && r.nRec >= 6).every((r) => r.rel < 1e-7),
    booksFinite: Er.books.every((b) => b.finite && b.spinUntouched && b.splitResidualMax < 1e-12),
    polarSigns: Er.polar.every((p) => p.equatorNeg && p.poleSame && p.spinUntouched),
    polarLedger: Er.polar.every((p) => p.ledgerRel < 1e-9),
    mu2ExplicitBitSame: Er.mu2Explicit.same,
    gain0NoTranslationChange: Er.gain0.xvSame && Er.gain0.rotADrZero,
    rigidRingKeepsDistances: J.R.ring.filter((q) => q.rotStep === 'rigid').every((q) => q.pairRelMax < 1e-12 && Math.abs(q.drhoMean) < 1e-10 && q.vMax === 0),
    linearRingDriftsWithH: J.R.ring.filter((q) => q.rotStep === 'linear').every((q) => q.drhoMean > 0) && Math.abs(J.R.ringRatio.linear - 2) < 0.1,
    linearExplicitBitSame: J.R.linearExplicit.same,
    rigidSameContinuumLimit: Math.abs(J.R.donut.ratio - 2) < 0.3,
    rigidNoVelocityKick: J.R.donut.velocityAfterTwoSteps.velSame === true && J.R.donut.velocityAfterTwoSteps.posSame === false,
    rigidWithSphereFinite: J.R.withSphere.finite,
  };
}

/* ───────── 文書の表と数(PHYSICS〔第307便a〕—— QA docs.sphereAxial307 が正本から作り直して逐語で照合する)───────── */
const e2s = (v) => (v === null || v === undefined) ? '—' : Number(v).toExponential(2);
const f3 = (v) => (v === null || v === undefined) ? '—' : Number(v).toFixed(3);
const f2 = (v) => (v === null || v === undefined) ? '—' : Number(v).toFixed(2);
const REG_JA = { bg: '背景が支配', inertial: 'r⁻² が支配', drag: '引きずりの核 r⁻³ が支配' };
export function physicsTables(J) {
  const out = [];
  out.push('| 分母の型 | 源 | q_eff(理論) | 赤道/極(軸方向の成分) | 0 になる仰角(実測/理論) | 軸へ弱まる |', '|---|---|---|---|---|---|');
  for (const a of J.A) out.push(`| ${REG_JA[a.regime]} | ${a.kind === 'ball' ? '球(体積平均)' : '球面'} | ${f3(a.qEff)}(${a.qTheory}) | ${f3(a.equatorOverPole)} | ${a.zeroElevationDeg === null ? '—' : f2(a.zeroElevationDeg) + '°'}/${f2(a.zeroElevationTheoryDeg)}° | ${a.weakerTowardAxis ? 'はい' : 'いいえ'} |`);
  out.push('', '| 照合(エンジンの閉じた式 ½∇×u と参照の求積 R_i → 0) | 値 |', '|---|---|');
  out.push(`| 配置 ${J.L.rows.length} 通り(r/R 3〜100・ε 0/0.3・軸の傾き・源 2 つ・対の除外・inertialR2)の尺度つきの相対の差の最大 | ${e2s(J.L.maxRel)} |`);
  for (const r of J.L.far) out.push(`| 遠方 ${r.name}(門の外 —— 第308便a から M1 の外部の級数) | ${e2s(r.relScale)} |`);
  out.push('', '| 有限の受け手 Ω(R_i)/Ω(0) − 1 の (R_i/r)² の係数(r = 10R・R_i/r = 0.01) | 赤道 | 45° | 極 |', '|---|---|---|---|');
  for (const k of ['bg', 'inertial', 'drag']) { const g = (el) => J.F.find((f) => f.regime === k && f.el === el).rows[0].coef; out.push(`| ${REG_JA[k]} | ${f3(g(0))} | ${f3(g(45))} | ${f3(g(90))} |`); }
  out.push('', '| 本の写し(axialModel:"sphere") | 受け手 逆/同 | 分母を源だけにした対照 逆/同 | S.spin 不変 |', '|---|---|---|---|');
  for (const b of J.E.books) out.push(`| ${b.emoji} ${b.id} | ${b.receiversNeg}/${b.receiversPos} | ${b.profile ? b.profile.sourceOnlyDenominator.neg + '/' + b.profile.sourceOnlyDenominator.pos : '—'} | ${b.spinUntouched ? 'はい' : 'いいえ'} |`);
  out.push('', '| 極の受け手の写し | 軸方向の成分が 0 になる仰角 | 赤道 | 極 | 帳簿 I s Δâ の一致 |', '|---|---|---|---|---|');
  for (const p of J.E.polar) out.push(`| ${p.variant === 'wbg' ? 'W_bg 0.125(背景に近い)' : 'inertialR2 λ 10⁻⁶(r⁻² が支配)'} | ${f2(p.zeroCrossDeg)}° | ${p.equatorNeg ? '逆' : '同'} | ${p.poleSame ? '同' : '逆'} | ${e2s(p.ledgerRel)} |`);
  const g = (rs, h) => J.R.ring.find((q) => q.rotStep === rs && q.h === h);
  out.push('', '| 回転の位置の步(環 12 個・G = 0) | h | 粒子間距離の相対の変化の最大 | 軸からの距離の平均の変化 |', '|---|---|---|---|');
  for (const rs of ['linear', 'rigid']) for (const h of [0.05, 0.025]) { const q = g(rs, h); out.push(`| ${rs} | ${h} | ${e2s(q.pairRelMax)} | ${e2s(q.drhoMean)} |`); }
  out.push(`| 🍩 の一押しの写し: 線形 − 剛体の平均半径(h / h/2) | ${J.R.donut.rows[0].dt} | ${e2s(J.R.donut.rows[0].dRho)} / ${e2s(J.R.donut.rows[1].dRho)} | 比 ${f3(J.R.donut.dRhoRatio)} |`);
  return out.join('\n');
}
export function docNumbers(J) {
  const a = (k, kind) => J.A.find((q) => q.regime === k && q.kind === kind);
  return [f3(a('bg', 'ball').equatorOverPole), f3(a('inertial', 'ball').equatorOverPole), f2(a('bg', 'ball').zeroElevationDeg), f2(a('inertial', 'ball').zeroElevationDeg),
    e2s(J.L.maxRel), f3(J.R.donut.dRhoRatio), e2s(J.R.donut.rows[0].dRho)];
}

export function runAll(H, o = {}) {
  const quick = !!o.quick, t = {};
  let t0 = Date.now();
  const Q = partQ(H, quick); t.Q = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now();
  const Z = partZ(quick); t.Z = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now();
  const A = partA(quick); t.A = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now();
  const Lr = partL(H, quick); t.L = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now();
  const F = partF(quick); t.F = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now();
  const C = partC(); t.C = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now();
  const Er = partE(H, quick); t.E = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now();
  const Rr = partR(H, quick); t.R = { wallSec: (Date.now() - t0) / 1000 };
  const J = { quick, regimes: REGIMES, Q, Z, A, L: Lr, F, C, E: Er, R: Rr };
  J.gates = gatesOf(J);
  J.ok = Object.values(J.gates).every(Boolean);
  J.timing = t;
  return J;
}

export async function main() {
  const TARGET = process.env.W307A_TARGET || 'beta/index.html';
  const OUT = process.env.W307A_OUT || path.join(ROOT, 'tests', 'out', 'sphereaxial-w307a.json');
  const quick = process.env.W307A_QUICK === '1';
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now();
  const W281A_SCOPE = w281aScopeStamp(html, REGEN_SCOPE);
  const H = loadHtmlHeadless(html);
  const R = runAll(H, { quick });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w307a-sphereaxial.mjs', target: TARGET,
    targetSha256: crypto.createHash('sha256').update(fs.readFileSync(html)).digest('hex'),
    ruling: '原仮定者の裁定(第100報)(軸引きずり = 受け手の球面の近い側と遠い側の回転引きずりの差分 —— 赤道で歯車の逆回転・軸へ近付くと弱まりつつ同じ向きへ)・決断事項 AN345 ①②(今の μ² の符号の反転では作れない・角度分布は分母の距離則に依る)・統括の検証項目 R209',
    axialVersion: E(H, 'REL_DRAG_AXIAL_SPHERE_VERSION'), axialLaw: E(H, 'REL_DRAG_AXIAL_LAW_SPHERE'), stencilH: E(H, 'REL_DRAG_AXIAL_SPHERE_H'), ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w307a-sphereaxial.mjs', 'tests/lib-w307a-sphereaxial.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第307便a', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION,
    engine: 'Node の headless(tests/lib-w279b-headless.mjs の loadHtmlHeadless —— html の本文をそのまま実行・1 プロセス)',
    notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s', JSON.stringify(out.timing));
}
if (IS_MAIN) await main();
