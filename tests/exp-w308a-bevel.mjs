// 第308便a(原仮定者の裁定(第101報)「源の軸回転が、軸方向に対する角度差の 2 倍の角度差で傾いた軸で作用する —— 接触する 2 つの球で片方だけ回るとき、
// 赤道での接触は逆回転・軸方向での接触は順回転・仰角 45° ではベベルギヤの様に 90° 傾いた回転」「軸引きずりは回転引きずりの差分であり、仰角が上がると
// 回転引きずりが弱くなる」「軸引きずりの受け手も体積平均で構わない」・決断事項 AN346・AN347・AN354・統括の検証項目 R214):
// **軸引きずりの鏡映の核の参照の器**(参照の関数とエンジンの opt-in spinDrag.axialModel:"bevel" の一致・幾何・球面の核 "sphere" との比較・体積平均・
// 遠方の M1 の外部の級数・本の写しの走行・金星/木星/イオの配置)。
//
// Node だけ(対象 html の inline script を tests/lib-w279b-headless.mjs の loadHtmlHeadless で読み、html の関数 inertialDrag3AxialBevelAt・
// inertialDrag3AxialSphereAt・inertialSpinMomentFar・inertialSpinMoment と本の入口 validatePreset・coord3d.makeSim・build・step をそのまま呼ぶ)。
// 参照は tests/lib-w308a-bevel.mjs(源の一様球の直接の求積・点の核の分母・数値の微分 —— エンジンの閉じた式・級数と独立)。
// **在位の本の宣言は変えない**(写しは器の中で組む)。
//
// ■ 段
//   G(幾何): 仰角 0/15/30/45/60/75/90° の強さ・源の軸への射影・作用の軸と源の軸のなす角(エンジンの値を赤道の強さで割って閉じた式と照合)・回転の共変・
//     自転の反転で反転・南北の鏡映(擬ベクトル)・対蹠で同じ。
//   K(球面の核との比較): 分母の 3 つの型 × 仰角の走査で bevel(差分の型・速さの型)と "sphere"(½∇×u)の源の軸方向の成分・横成分 ——
//     0 になる仰角(45° 対 asin√((q−2)/q))・赤道の大きさの比(理論 2(q−1)/(q−2)・2/(q−2))・極(bevel は強さ 0・sphere は赤道の 2/(2−q) 倍)・q = 1 + 差分/速さ。
//   L(エンジンとの一致): エンジンの inertialDrag3AxialBevelAt と参照(求積 + 数値の微分)—— 配置・軸・ε・源 2 つ・対の除外・inertialR2・対ごとの分母・遠方。
//   S(遠方の M1): エンジンの外部の級数(ε = 0 と ε > 0)と lib の級数・独立な求積・数値の導関数(r/R 4・8・100・10⁴・10⁶)・今の式(求積 + 5 点)の誤差。
//   V(体積平均): 受け手の半径比の走査(中心の値との差)・極の残り (3π/16)(R_i/r)・天体の配置(イオ → 木星ほか)。
//   E(エンジンの走行): 🔩🪛🍥🍩 の写しに axialModel:"bevel" を宣言した走行(受け手の符号の数・S.spin の不変・rotA = rotAIn + rotADr・差分の型の強さが負の対)・
//     極の受け手の写し(仰角ごとの符号・傾きを持つ受け手の軸と帳簿)・axialGain 0 と axial off の位置・速度の同一。
//   P(天体の配置): 第307便c の 4 構成(太陽–金星・太陽–木星・木星–イオ・太陽–木星–イオ —— 宣言から)で bevel の ω_D/ω_obs(差分の型・速さの型・A = 1)と
//     "sphere" との比・対ごとの分母で太陽の項がイオの有無で同じビット・行の分母との対照・宣言の ε と ε = 0。
//
// ■ 言わないこと: 「法則を発見した」「金星の逆行を説明した」「イオの加熱を説明した」「自転が釣り合った」「磁気双極子と同じ」「係数 A が決まった」。
//   sinθ は第101報の「仰角が上がると回転引きずりが弱まる」を具体化した**仮定**(接触の例だけからは一意に導けない)・規格化の 2 型は決断事項の候補。
//
// ■ 使い方
//   node tests/exp-w308a-bevel.mjs   → 正本 tests/out/bevel-w308a.json(段 bevel-308a)
//   W308A_OUT=<json> で出力先を変える(試走は正本を書かない)・W308A_TARGET=<html>(既定 beta/index.html)・W308A_QUICK=1(求積と步数を縮める —— 煙試験の窓)。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlHeadless } from './lib-w279b-headless.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import { idsFromDecl as idsToys } from './exp-w307a-sphereaxial.mjs';
import { idsFromDecl as idsPlanets, buildConfigs } from './exp-w307c-spindecomp.mjs';
import * as L from './lib-w308a-bevel.mjs';
import { pinDecl315c, LEGACY7_DATA_FILE } from './lib-w315c-legacy7.mjs';   // 第315便c(決断事項 AN406・R244): 在位の 7 本を K1 へ移した世代では、この器は移行の前(af2f426)の宣言の写しで測る
// 第281便a の領域 hash の宣言(器と lib から deriveScope で引いた下限 + 本 7 本)
const REGEN_SCOPE = {"presets":["chainDiskToy3d","chainDiskToy3dTilt","chainSpreadToy3d","jupiterGalilean","jupiterSunInertial3d","saturnRingInertial3d","venusSunInertial3d"],"roots":["$","HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.inertialDrag3SpinState","HP.sim","HP.validatePreset","REL_DRAG_AXIAL_BEVEL_VERSION","REL_DRAG_AXIAL_LAW_BEVEL","REL_DRAG_AXIAL_LAW_SPHERE","REL_DRAG_AXIAL_NORMS","REL_DRAG_AXIAL_SPHERE_H","REL_DRAG_AXIAL_SPHERE_VERSION","REL_DRAG_M1_FAR_MIN","REL_DRAG_M1_FAR_TERMS","REL_DRAG_M1_FAR_VERSION","REL_DRAG_SPIN_NODES","T","ab","appStepDt","ctx","cw","dfmGaussLegendre01","dfmInertialDragStep3","inertialDrag3AxialApply","inertialDrag3AxialBevel","inertialDrag3AxialBevelAt","inertialDrag3AxialSphere","inertialDrag3AxialSphereAt","inertialDrag3RigidStep","inertialSpinMoment","inertialSpinMomentDr","inertialSpinMomentFar","relDrag3SpinOf","relDragCoefficientOf","sim"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w308a-bevel-1';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (o) => JSON.parse(JSON.stringify(o));
const E = (H, name) => H.evalExpr(name);
const { dot, cross, norm, add, sub, scale, unit } = L;
const rel = (a, b) => norm(sub(a, b)) / Math.max(norm(b), 1e-300);
const r6 = (v) => (typeof v === 'number' && Number.isFinite(v)) ? Number(v.toPrecision(10)) : v;
const vr = (a) => a.map(r6);
const D2R = Math.PI / 180;
const NOT_CLAIM = ['法則を発見した', '金星の逆行を説明した', 'イオの加熱を説明した', '自転が釣り合った', '磁気双極子と同じ', '係数 A が決まった', '観測の 1σ で較正済み'];

/* ───────── 分母の 3 つの型(第307便a と同じ —— 単一の源 m=1・R=1・Ω=1・軸 +z・ε=0)───────── */
export const REGIMES = [
  { key: 'bg', ja: '背景が支配(D ≈ 1 —— q = 5)', C: 1e-6, lambda: null, qTheory: 5 },
  { key: 'inertial', ja: '源の慣性決定力 r⁻² が支配(D ∝ r⁻² —— q = 3)', C: 1, lambda: 1e-8, qTheory: 3 },
  { key: 'drag', ja: '引きずりの核 r⁻³ が支配(D ∝ r⁻³ —— q = 2)', C: 1e9, lambda: null, qTheory: 2 },
];

/* ───────── エンジンの関数を呼ぶための最小の状態 ───────── */
/** bodies = [{p, m, Om(符号つき), a(単位の軸), R}]・o = {Wbg, G, c, i2:{lambda}|{lambdaRs}, pair, pairs:[[i,j],…]} */
function engineState(bodies, o = {}) {
  const n = bodies.length, F = (f) => Float64Array.from(bodies.map(f));
  const i2 = o.i2 ? { ...(o.i2.lambdaRs !== undefined ? { lambdaRs: o.i2.lambdaRs } : { lambda: o.i2.lambda }), sources: 'all', self: 'off', env: 'off', ...(o.pair ? { denom: 'pair' } : {}) } : null;
  const S = { n, m: F((b) => b.m), x: F((b) => b.p[0]), y: F((b) => b.p[1]), z: F((b) => b.p[2]), spin: F((b) => b.Om || 0), radOv: F((b) => b.R || 0),
    sax: F((b) => (b.a || [0, 0, 1])[0]), say: F((b) => (b.a || [0, 0, 1])[1]), saz: F((b) => (b.a || [0, 0, 1])[2]), pinned: new Uint8Array(n),
    relDrag: { law: 'inertial', Wbg: o.Wbg === undefined ? 1 : o.Wbg, ...(i2 ? { inertialR2: i2 } : null) },
    params: { G: o.G === undefined ? 1 : o.G, cLight: o.c === undefined ? 1 : o.c }, _rdPairSet: null, _rdPairN: n, _amKind: null };
  if (o.pairs) { S._rdPairSet = new Set(); for (const [i, j] of o.pairs) S._rdPairSet.add(i * n + j); }
  return S;
}
function engBevel(H, S, C, eps, i, nm = 'diff', gain = 1, at = null) {
  const p = at || [S.x[i], S.y[i], S.z[i]];
  return E(H, 'inertialDrag3AxialBevelAt')(S, S.n, C, eps, S.x, S.y, S.z, S.sax, S.say, S.saz, p[0], p[1], p[2], i, gain, nm);
}
function engSphere(H, S, C, eps, i, gain = 1) {
  return E(H, 'inertialDrag3AxialSphereAt')(S, S.n, C, eps, S.x, S.y, S.z, S.sax, S.say, S.saz, S.x[i], S.y[i], S.z[i], i, gain);
}
const W3 = (q) => (q ? [q.wx, q.wy, q.wz] : null);
/** 参照の構成(受け手 recv から見た源・分母 —— エンジンと同じ規則: 宣言した対・自転 ≠ 0・半径 > 0 の源・inertialR2 は sources:"all") */
function refCfg(bodies, recv, C, eps, o = {}) {
  const pairOk = (j) => !o.pairs || o.pairs.some(([a, b]) => a === recv && b === j);
  const qOf = (b) => (o.i2 ? (o.i2.lambdaRs !== undefined ? (o.c * o.c) / (2 * o.i2.lambdaRs * o.G) : b.m / o.i2.lambda) : null);
  const cfg = { C, eps, sources: [], masses: [], i2: o.i2 ? [] : null, Dconst: 0, pair: !!o.pair };
  bodies.forEach((b, j) => {
    if (j === recv) return;
    if (pairOk(j)) { cfg.masses.push({ p: b.p, m: b.m }); if (b.Om && b.R > 0) cfg.sources.push({ p: b.p, m: b.m, Om: b.Om, a: unit(b.a || [0, 0, 1]), R: b.R, q: qOf(b) }); }
    if (o.i2) cfg.i2.push({ p: b.p, q: qOf(b) });
  });
  return cfg;
}

/* ───────── 段 G ───────── */
const ELS_G = [0, 15, 30, 45, 60, 75, 90];
function partG(H) {
  const reg = REGIMES[1], r = 30, rows = [];
  const mk = (d, Om, a) => engineState([{ p: [0, 0, 0], m: 1, Om, a, R: 1 }, { p: scale(d, r), m: 1e-3 }], { i2: { lambda: reg.lambda } });
  const eq = W3(engBevel(H, mk(L.dirAt([0, 0, 1], 0, 0), 1, [0, 0, 1]), reg.C, 0, 1)), amp = norm(eq);
  for (const el of ELS_G) {
    const g = L.geometryRow(el), w = W3(engBevel(H, mk(L.dirAt([0, 0, 1], el, 0), 1, [0, 0, 1]), reg.C, 0, 1)), wn = scale(w, 1 / amp);
    const closed = { strength: Math.cos(el * D2R), projection: -Math.cos(el * D2R) * Math.cos(2 * el * D2R), axisAngleDeg: el === 90 ? null : 180 - 2 * el };
    rows.push({ elDeg: el, strength: r6(g.strength), projection: r6(g.projection), axisAngleDeg: r6(g.axisAngleDeg), transverse: r6(g.transverse),
      engineStrength: r6(norm(wn)), engineProjection: r6(wn[2]), closedStrength: r6(closed.strength), closedProjection: r6(closed.projection), closedAxisAngleDeg: closed.axisAngleDeg,
      relEngine: r6(norm(sub(wn, L.bevelPoint(L.dirAt([0, 0, 1], el, 0), [0, 0, 1], 1)))) });
  }
  // 対称: 回転の共変・自転の反転・南北の鏡映(擬ベクトル)・対蹠
  const d0 = unit([0.4, -0.3, 0.55]), a0 = unit([0.2, 0.1, 0.97]), rot = (v) => { const ax = unit([0.3, 0.2, -0.7]), t = 0.81, c = Math.cos(t), s = Math.sin(t); return add(add(scale(v, c), scale(cross(ax, v), s)), scale(ax, dot(ax, v) * (1 - c))); };
  const base = W3(engBevel(H, mk(d0, 0.7, a0), reg.C, 0, 1));
  const rotated = W3(engBevel(H, mk(rot(d0), 0.7, rot(a0)), reg.C, 0, 1));
  const reversed = W3(engBevel(H, mk(d0, -0.7, a0), reg.C, 0, 1));
  const axisFlip = W3(engBevel(H, mk(d0, -0.7, scale(a0, -1)), reg.C, 0, 1));
  const M = (v) => [v[0], v[1], -v[2]];
  const dS = [0.5, -0.2, 0.6], aZ = [0, 0, 1];
  const north = W3(engBevel(H, mk(unit(dS), 1, aZ), reg.C, 0, 1)), south = W3(engBevel(H, mk(unit(M(dS)), 1, aZ), reg.C, 0, 1));
  const anti = W3(engBevel(H, mk(scale(unit(dS), -1), 1, aZ), reg.C, 0, 1));
  return { r, regime: reg.key, equatorAmp: r6(amp), rows,
    rotationRel: r6(rel(rotated, rot(base))), spinReverseRel: r6(rel(reversed, scale(base, -1))), axisFlipRel: r6(rel(axisFlip, base)),
    mirrorRel: r6(rel(south, [-north[0], -north[1], north[2]])), antipodalRel: r6(rel(anti, north)), northSouthAxial: [r6(north[2]), r6(south[2])] };
}

/* ───────── 段 K ───────── */
const ELS_K = [0, 10, 20, 30, 35.26438968, 40, 45, 50, 50.76847952, 60, 70, 80, 90];
function partK(H) {
  const r = 30, out = [];
  for (const reg of REGIMES) {
    const mk = (el) => engineState([{ p: [0, 0, 0], m: 1, Om: 1, a: [0, 0, 1], R: 1 }, { p: scale(L.dirAt([0, 0, 1], el, 0), r), m: 1e-3 }], reg.lambda ? { i2: { lambda: reg.lambda } } : {});
    const rows = [];
    for (const el of ELS_K) {
      const S = mk(el), bd = W3(engBevel(H, S, reg.C, 0, 1, 'diff')), bs = W3(engBevel(H, S, reg.C, 0, 1, 'speed')), sp = W3(engSphere(H, S, reg.C, 0, 1));
      rows.push({ el: r6(el), bevelDiffAxial: r6(bd[2]), bevelSpeedAxial: r6(bs[2]), sphereAxial: r6(sp[2]), bevelDiffTrans: r6(Math.hypot(bd[0], bd[1])), sphereTrans: r6(Math.hypot(sp[0], sp[1])),
        bevelMag: r6(norm(bd)), sphereMag: r6(norm(sp)) });
    }
    const zeroOf = (key) => { for (let k = 1; k < rows.length; k++) if (rows[k - 1][key] < 0 && rows[k][key] >= 0) { const a = rows[k - 1], b = rows[k]; return a.el + (b.el - a.el) * (-a[key]) / (b[key] - a[key]); } return null; };
    const eq = rows[0], po = rows[rows.length - 1], q = 1 + eq.bevelDiffAxial / eq.bevelSpeedAxial;
    out.push({ regime: reg.key, ja: reg.ja, r, qTheory: reg.qTheory, qEff: r6(q), rows,
      zeroBevelDeg: r6(zeroOf('bevelDiffAxial')), zeroSphereDeg: r6(zeroOf('sphereAxial')), zeroSphereTheoryDeg: r6(reg.qTheory > 2 ? Math.asin(Math.sqrt((reg.qTheory - 2) / reg.qTheory)) / D2R : null),
      eqDiffOverSphere: r6(eq.sphereAxial !== 0 ? eq.bevelDiffAxial / eq.sphereAxial : null), eqDiffOverSphereTheory: r6(reg.qTheory > 2 ? 2 * (reg.qTheory - 1) / (reg.qTheory - 2) : null),
      eqSpeedOverSphere: r6(eq.sphereAxial !== 0 ? eq.bevelSpeedAxial / eq.sphereAxial : null), eqSpeedOverSphereTheory: r6(reg.qTheory > 2 ? 2 / (reg.qTheory - 2) : null),
      diffOverSpeed: r6(eq.bevelDiffAxial / eq.bevelSpeedAxial), bevelPoleOverEq: r6(po.bevelMag / eq.bevelMag), spherePoleOverEq: r6(eq.sphereAxial !== 0 ? po.sphereAxial / eq.sphereAxial : null),
      spherePoleOverEqTheory: r6(reg.qTheory !== 2 ? 2 / (2 - reg.qTheory) : null), bevel45Trans: r6(rows.find((x) => x.el === 45).bevelDiffTrans / eq.bevelMag) });
  }
  return out;
}

/* ───────── 段 L ───────── */
function partL(H, quick) {
  const n = quick ? 12 : 16, out = [];
  const add1 = (name, bodies, recv, C, eps, o = {}, nm = 'diff') => {
    const S = engineState(bodies, o), eng = W3(engBevel(H, S, C, eps, recv, nm));
    const cfg = refCfg(bodies, recv, C, eps, o), ref = L.bevelRef(bodies[recv].p, cfg, { norm: nm, n, hRel: 1e-3 });
    // 尺度: 源ごとの |amp|·|Ω|(sinθ を掛けない —— 極の 0 の点でも相対の誤差が意味を持つ)
    let sc = 0; for (const t of ref.terms) sc += Math.abs(t.amp) * Math.abs(cfg.sources[ref.terms.indexOf(t)].Om);
    out.push({ name, C, eps, norm: nm, pair: !!o.pair, rOverR: r6(norm(sub(bodies[recv].p, bodies[0].p)) / (bodies[0].R || 1)), ref: vr(ref.omega), engine: vr(eng),
      relScale: r6(norm(sub(eng, ref.omega)) / Math.max(sc, 1e-300)), scale: r6(sc) });
  };
  const ax30 = L.dirAt([0, 0, 1], 60, 40);
  for (const reg of REGIMES) for (const eps of [0, 0.3]) for (const r of [3, 10, 100]) for (const el of [0, 30, 60, 90]) {
    const bodies = [{ p: [0, 0, 0], m: 1, Om: 1, a: [0, 0, 1], R: 1 }, { p: scale(L.dirAt([0, 0, 1], el, 25), r), m: 1e-3 }];
    add1(`single/${reg.key}/eps${eps}/r${r}/el${el}`, bodies, 1, reg.C, eps, reg.lambda ? { i2: { lambda: reg.lambda } } : {});
  }
  for (const reg of REGIMES) {
    const i2 = reg.lambda ? { i2: { lambda: reg.lambda } } : {};
    add1(`speed/${reg.key}`, [{ p: [0, 0, 0], m: 1, Om: 1, a: [0, 0, 1], R: 1 }, { p: scale(L.dirAt([0, 0, 1], 20, 25), 10), m: 1e-3 }], 1, reg.C, 0, i2, 'speed');
    add1(`tilted/${reg.key}`, [{ p: [0.5, -0.2, 0.1], m: 2, Om: -0.7, a: ax30, R: 1.2 }, { p: [8, 5, 3], m: 1e-3 }], 1, reg.C, 0.1, reg.lambda ? { i2: { lambda: 2 * reg.lambda } } : {});
    const two = [{ p: [0, 0, 0], m: 1, Om: 1, a: [0, 0, 1], R: 1 }, { p: [12, 1, 6], m: 0.6, Om: -1.4, a: L.dirAt([0, 0, 1], 20, 200), R: 0.8 }, { p: [6, 4, 2], m: 1e-3 }, { p: [-9, 3, -4], m: 0.3 }];
    add1(`twoSources/${reg.key}`, two, 2, reg.C, 0.05, i2);
    add1(`mask/${reg.key}`, two, 2, reg.C, 0.05, { ...i2, pairs: [[2, 0], [2, 3]] });
    if (reg.lambda) {
      add1(`pair/twoSources/${reg.key}`, two, 2, reg.C, 0.05, { ...i2, pair: true });
      add1(`pair/twoSources/speed/${reg.key}`, two, 2, reg.C, 0.05, { ...i2, pair: true }, 'speed');
    }
  }
  for (const r of [300, 1000, 1e4]) add1(`far/inertial/r${r}`, [{ p: [0, 0, 0], m: 1, Om: 1, a: [0, 0, 1], R: 1 }, { p: [r, 0, 0], m: 1e-3 }], 1, 1, 0, { i2: { lambda: 1e-8 } });
  for (const r of [1000, 1e4]) add1(`far/inertial/eps0.05/r${r}`, [{ p: [0, 0, 0], m: 1, Om: 1, a: [0, 0, 1], R: 1 }, { p: scale(L.dirAt([0, 0, 1], 30, 0), r), m: 1e-3 }], 1, 1, 0.05, { i2: { lambda: 1e-8 } });
  const maxRel = Math.max(...out.map((q) => q.relScale));
  return { rows: out, maxRel, near: Math.max(...out.filter((q) => !q.name.startsWith('far/')).map((q) => q.relScale)), far: out.filter((q) => q.name.startsWith('far/')).map((q) => ({ name: q.name, relScale: q.relScale })) };
}

/* ───────── 段 S ───────── */
function partS(H) {
  const far = E(H, 'inertialSpinMomentFar'), M1e = E(H, 'inertialSpinMoment'), Dre = E(H, 'inertialSpinMomentDr'), gl = E(H, 'dfmGaussLegendre01')(E(H, 'REL_DRAG_SPIN_NODES'));
  const rows = [];
  for (const eps of [0, 0.05, 0.3]) for (const r of [4, 8, 100, 1e4, 1e6]) {
    const s = far(r, 1, eps);
    if (!s) { rows.push({ eps, rOverR: r, series: null }); continue; }
    const q = L.m1Quad(r, 1, eps, 24), dq = L.dM1Quad(r, 1, eps, 24, 1e-3), lib = eps === 0 ? L.m1Series(r, 1) : null;
    const old = M1e(r, 1, eps, gl), oldD = Dre(r, 1, eps, gl);
    rows.push({ eps, rOverR: r, series: { M1: s.M1, dM1: s.dM1 }, relQuad: r6(s.M1 / q - 1), relDQuad: r6(s.dM1 / dq - 1), relLib: lib ? r6(s.M1 / lib.M - 1) : null, relLibD: lib ? r6(s.dM1 / lib.dM - 1) : null,
      slope: r6(s.dM1 * r / s.M1), farLead: r6(s.M1 / (0.6 / r ** 4)), oldRelQuad: r6(old / q - 1), oldRelDQuad: (oldD === null) ? null : r6(oldD / dq - 1) });
  }
  // 内側(r < 4(R+ε))は null —— 呼び手は今の式へ戻る
  const inside = [far(3.99, 1, 0), far(5, 1, 0.3), far(1, 1, 0), far(10, 1, -1), far(10, 0, 0)].map((x) => x === null);
  return { rows, insideNull: inside.every(Boolean), min: E(H, 'REL_DRAG_M1_FAR_MIN'), terms: E(H, 'REL_DRAG_M1_FAR_TERMS') };
}

/* ───────── 段 V ───────── */
function partV(H, configs, quick) {
  const ord = quick ? 8 : 12, reg = REGIMES[1], r = 10, scan = [];
  for (const el of [0, 45, 90]) for (const k of [0.01, 0.03, 0.1, 0.3]) {
    const d = L.dirAt([0, 0, 1], el, 0), S = engineState([{ p: [0, 0, 0], m: 1, Om: 1, a: [0, 0, 1], R: 1 }, { p: scale(d, r), m: 1e-3 }], { i2: { lambda: reg.lambda } });
    const field = (p) => W3(engBevel(H, S, reg.C, 0, 1, 'diff', 1, p)), c = field(scale(d, r)), mean = L.volumeMean(scale(d, r), k * r, field, ord);
    const amp = norm(W3(engBevel(H, engineState([{ p: [0, 0, 0], m: 1, Om: 1, a: [0, 0, 1], R: 1 }, { p: [r, 0, 0], m: 1e-3 }], { i2: { lambda: reg.lambda } }), reg.C, 0, 1)));
    scan.push({ el, RiOverR: k, relCenter: r6(norm(sub(mean, c)) / amp), coef: r6(norm(sub(mean, c)) / amp / (k * k)), meanAxial: r6(mean[2] / amp), centerAxial: r6(c[2] / amp) });
  }
  // 極の残り: 一定の強さの場(幾何だけ)を R_i/r = 10⁻³ で平均(sinθ の非滑らかさで収束が遅い —— 次数 48)
  const pole = [];
  for (const o of quick ? [16] : [16, 32, 48]) { const w = L.volumeMean([0, 0, 1], 1e-3, (p) => L.bevelPoint(p, [0, 0, 1], 1), o); pole.push({ order: o, axial: w[2], overTheory: r6(w[2] / L.poleResidualTheory(1e-3)) }); }
  // 天体の配置(SI —— 対ごとの分母・差分の型・ε = 0): 受け手の球の体積平均と中心の値
  const bodiesOf = (C) => C.bodies.map((b) => ({ p: b.x, m: b.m, Om: b.omega, a: b.axis, R: b.R }));
  const cases = [['SV', 1, 0], ['SJ', 1, 0], ['JIo', 1, 0], ['JIo', 0, 1]], bodiesRows = [];
  for (const [key, i, j] of cases) {
    const C = configs.find((c) => c.key === key), B = bodiesOf(C).map((b, k) => (k === j || k === i) ? b : { ...b, Om: 0 });
    const S = engineState(B, { Wbg: C.Wbg, G: C.G, c: C.c, i2: { lambdaRs: C.k }, pair: true }), Cc = 1 / C.Wbg;
    for (const nm of ['diff', 'speed']) {
      const field = (p) => W3(engBevel(H, S, Cc, 0, i, nm, 1, p)), c = field(B[i].p), mean = L.volumeMean(B[i].p, B[i].R, field, ord);
      bodiesRow(bodiesRows, key, C, i, j, nm, c, mean);
    }
  }
  return { regime: reg.key, r, order: ord, scan, pole, bodies: bodiesRows };
}
function bodiesRow(rows, key, C, i, j, nm, c, mean) {
  const a = C.bodies[i], b = C.bodies[j], d = norm(sub(a.x, b.x));
  rows.push({ config: key, recv: a.label, src: b.label, norm: nm, RiOverR: r6(a.R / d), relCenter: r6(norm(sub(mean, c)) / norm(c)), axialRel: r6(dot(mean, a.axis) / dot(c, a.axis) - 1) });
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
export const BEVEL = { rot: 'surfaceFlip', axial: 'on', axialModel: 'bevel' };
function runBook(H, id, patch, N, nm) {
  const HP = H.HP, base = presetOf(HP, id);
  if (patch === 'ab') base.physics.relativeDrag = clone(base.abBody.physicsPatch.relativeDrag);
  const q = clone(base); q.physics.relativeDrag.spinDrag = { ...BEVEL, ...(nm ? { axialNorm: nm } : {}) };
  const a = build(H, q), S = a.S, spin0 = Float64Array.from(S.spin.subarray(0, S.n));
  for (let k = 0; k < N; k++) a.S.step(a.dt);
  const n = S.n, src = [];
  for (let j = 0; j < n; j++) if (S.spin[j] !== 0 && S.radOv[j] > 0 && S.m[j] > 0) src.push(j);
  let neg = 0, pos = 0, zero = 0, sumRes = 0, spinSame = true, finite = true;
  for (let i = 0; i < n; i++) {
    if (!Object.is(S.spin[i], spin0[i])) spinSame = false;
    const w = S._rdWS ? S._rdWS[i] : 0;
    if (!Number.isFinite(w) || !Number.isFinite(S.rotADr[i]) || !Number.isFinite(S.x[i])) finite = false;
    if (S.pinned[i] || !(S.m[i] > 0)) continue;
    const sgn = Math.sign(w) * Math.sign(S.spin[src[0]] || 1);
    if (sgn < 0) neg++; else if (sgn > 0) pos++; else zero++;
    sumRes = Math.max(sumRes, Math.abs(S.rotA[i] - (S.rotAIn[i] + S.rotADr[i])) / Math.max(1, Math.abs(S.rotA[i])));
  }
  const st = HP.inertialDrag3SpinState(S);
  // 源が 1 つの本: 分母を源だけにした対照(受け手どうしの質量が作る分母の勾配を除く)の符号
  let sourceOnly = null;
  if (src.length === 1) {
    const j = src[0], rd = S.relDrag, C = E(H, 'relDragCoefficientOf')(rd), eps = (rd.eps !== undefined) ? rd.eps : (S.params.softening || 0);
    const T = Object.create(S); T.m = Float64Array.from(S.m.subarray(0, n)); for (let k = 0; k < n; k++) if (k !== j) T.m[k] = 0;
    let n0 = 0, p0 = 0, negAmp0 = 0;
    for (let i = 0; i < n; i++) {
      if (i === j || S.pinned[i] || !(S.m[i] > 0)) continue;
      const qq = E(H, 'inertialDrag3AxialBevelAt')(T, n, C, eps, S.x, S.y, S.z, S.sax, S.say, S.saz, S.x[i], S.y[i], S.z[i], i, 1, nm || 'diff');
      if (qq) { const sg = Math.sign(qq.ws) * Math.sign(S.spin[j]); if (sg < 0) n0++; else if (sg > 0) p0++; negAmp0 += qq.neg; }
    }
    sourceOnly = { neg: n0, pos: p0, negAmp: negAmp0 };
  }
  return { id, patch, norm: nm || 'diff', steps: N, n, sources: src.length, receiversNeg: neg, receiversPos: pos, receiversZero: zero, finite, spinUntouched: spinSame, splitResidualMax: sumRes,
    sourceOnly, bevel: st.bevel, axial: { terms: st.axial.terms, omegaMax: r6(st.axial.omegaMax), rotA: r6(st.axial.rotA), dLspin: st.axial.dLspin } };
}
/** 極の受け手の写し(第307便a の配置): 源(pinned・m 100・R 6・Ω 0.5・軸 +z)と仰角 0〜90° の受け手(G = 0・速度 0)。受け手の半分は傾きを持つ */
function polarCase(H, o = {}) {
  const els = [0, 15, 30, 35.26, 45, 50.77, 60, 75, 85, 90], r = 20, bodies = [];
  bodies.push({ type: 'single', m: 100, x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, radius: 6, spin: 0.5, pinned: true, spinAxis: { enable: true, source: 'declared', tiltDeg: 0, azimuthDeg: 0 } });
  for (const el of els) for (const tilt of [false, true]) {
    const d = L.dirAt([0, 0, 1], el, 0), rr = tilt ? 1.5 * r : r;
    bodies.push({ type: 'single', m: 0.01, x: rr * d[0], y: rr * d[1], z: rr * d[2], vx: 0, vy: 0, vz: 0, radius: 0.5, spin: tilt ? 0.3 : 0, pinned: false,
      ...(tilt ? { spinAxis: { enable: true, source: 'declared', tiltDeg: 20, azimuthDeg: 30 } } : {}) });
  }
  const p = presetOf(H.HP, 'chainDiskToy3dTilt');
  p.id = 'w308aPolar'; p.bodies = bodies; delete p.abBody; delete p.timeRef;
  p.physics = { ...p.physics, G: 0, relativeDrag: { law: 'inertial', Wbg: o.Wbg || 0.125, eps: 0.5, pairs: 'all', ...(o.i2 ? { inertialR2: o.i2 } : {}), spinDrag: o.spinDrag || { ...BEVEL } } };
  if (o.i2 && o.i2.denom === 'pair') delete p.physics.relativeDrag.solver;
  return { p, els };
}
function partE(H, quick) {
  const HP = H.HP, ids = idsToys(HP), N = quick ? 20 : 120, books = [];
  for (const e of ['🔩', '🪛', '🍥', '🍩']) if (ids[e]) books.push({ emoji: e, ...runBook(H, ids[e], e === '🍩' ? 'ab' : null, e === '🍥' ? Math.min(N, 40) : N) });
  if (ids['🪛']) books.push({ emoji: '🪛', ...runBook(H, ids['🪛'], null, N, 'speed') });
  const polar = [];
  for (const variant of [{ key: 'wbg', o: {} }, { key: 'inertialR2', o: { i2: { lambda: 1e-6, sources: 'all' } } }, { key: 'inertialR2pair', o: { i2: { lambda: 1e-6, sources: 'all', denom: 'pair' } } }]) {
    const { p, els } = polarCase(H, variant.o), a = build(H, p), S = a.S;
    const n0 = S.n, spin0 = Float64Array.from(S.spin.subarray(0, n0)), ax0 = [Float64Array.from(S.sax.subarray(0, n0)), Float64Array.from(S.say.subarray(0, n0)), Float64Array.from(S.saz.subarray(0, n0))];
    const steps = quick ? 10 : 40;
    for (let k = 0; k < steps; k++) S.step(a.dt);
    const rows = [];
    let Js = [0, 0, 0];
    els.forEach((el, k) => {
      const flat = 1 + 2 * k, tilt = flat + 1, wvec = [S._rdWX[flat], S._rdWY[flat], S._rdWZ[flat]];
      rows.push({ el, wsFlat: r6(S._rdWS[flat]), rotADrFlat: r6(S.rotADr[flat]), omegaFlat: vr(wvec), tiltDeg: r6(Math.atan2(Math.hypot(wvec[0], wvec[1]), wvec[2]) * 180 / Math.PI),
        rotADrTilt: r6(S.rotADr[tilt]), axisTurnDeg: r6(Math.acos(Math.max(-1, Math.min(1, S.sax[tilt] * ax0[0][tilt] + S.say[tilt] * ax0[1][tilt] + S.saz[tilt] * ax0[2][tilt]))) * 180 / Math.PI) });
      const J = 0.5 * S.m[tilt] * S.R[tilt] * S.R[tilt] * S.spin[tilt];
      Js = add(Js, scale([S.sax[tilt] - ax0[0][tilt], S.say[tilt] - ax0[1][tilt], S.saz[tilt] - ax0[2][tilt]], J));
    });
    let spinSame = true; for (let i = 0; i < n0; i++) if (!Object.is(S.spin[i], spin0[i])) spinSame = false;
    const st = HP.inertialDrag3SpinState(S), zeroCross = (() => { for (let k = 1; k < rows.length; k++) if (rows[k - 1].wsFlat < 0 && rows[k].wsFlat >= 0) return r6(rows[k - 1].el + (rows[k].el - rows[k - 1].el) * (-rows[k - 1].wsFlat) / (rows[k].wsFlat - rows[k - 1].wsFlat)); return null; })();
    const eqMag = norm(rows[0].omegaFlat), poleMag = norm(rows[rows.length - 1].omegaFlat);
    polar.push({ variant: variant.key, steps, rows, zeroCrossDeg: zeroCross, equatorNeg: rows[0].wsFlat < 0, nearPoleSame: rows[rows.length - 2].wsFlat > 0, poleOverEquator: r6(poleMag / eqMag),
      spinUntouched: spinSame, bevel: st.bevel, dLspinLedger: vr(st.axial.dLspin), dLspinIndependent: vr(Js), ledgerRel: r6(rel(st.axial.dLspin, Js)) });
  }
  // axialGain 0 と axial off の位置・速度の同一(🔩 の写し)・bevel の 2 回の走行のビット同一(決定的)
  const diskId = ids['🔩'], K = quick ? 20 : 80;
  const runFp = (id, sd) => { const q = presetOf(HP, id); if (sd) q.physics.relativeDrag.spinDrag = sd; const a = build(H, q); for (let k = 0; k < K; k++) a.S.step(a.dt); return a.S; };
  const keysXV = ['x', 'y', 'z', 'vx', 'vy', 'vz', 'spin'], keysAll = keysXV.concat(['rotA', 'sax', 'say', 'saz', 'rotAIn', 'rotADr']);
  const B0 = runFp(diskId, { rot: 'surfaceFlip', axial: 'off' }), B1 = runFp(diskId, { ...BEVEL, axialGain: 0 });
  let gain0Zero = true; for (let i = 0; i < B1.n; i++) if (B1.rotADr[i] !== 0) gain0Zero = false;
  const R1 = runFp(ids['🪛'], { ...BEVEL }), R2 = runFp(ids['🪛'], { ...BEVEL, axialNorm: 'diff', axialGain: 1 });
  return { ids, steps: N, books, polar, gain0: { id: diskId, steps: K, xvSame: fp(B0, keysXV) === fp(B1, keysXV), rotADrZero: gain0Zero },
    explicitDefault: { id: ids['🪛'], steps: K, same: fp(R1, keysAll) === fp(R2, keysAll) } };
}

/* ───────── 段 P ───────── */
function partP(H, configs) {
  const bodiesOf = (C) => C.bodies.map((b) => ({ p: b.x, m: b.m, Om: b.omega, a: b.axis, R: b.R }));
  const only = (B, j) => B.map((b, k) => (k === j ? b : { ...b, Om: 0 }));
  const terms = [];
  const termOf = (C, i, j, o) => {
    const B = only(bodiesOf(C), j), S = engineState(B, { Wbg: C.Wbg, G: C.G, c: C.c, i2: { lambdaRs: C.k }, pair: o.pair }), Cc = 1 / C.Wbg, eps = o.eps ? C.eps : 0;
    return o.model === 'sphere' ? W3(engSphere(H, S, Cc, eps, i)) : W3(engBevel(H, S, Cc, eps, i, o.norm));
  };
  for (const C of configs) C.bodies.forEach((a, i) => {
    if (C.fixed.includes(i)) return;
    C.bodies.forEach((b, j) => {
      if (j === i) return;
      const row = { config: C.key, recv: a.label, src: b.label, omegaObs: a.omega, rOverRsrc: r6(norm(sub(a.x, b.x)) / b.R), elevDeg: r6(Math.asin(dot(sub(a.x, b.x), b.axis) / norm(sub(a.x, b.x))) / D2R) };
      for (const [k, o] of [['diffPair', { norm: 'diff', pair: true }], ['speedPair', { norm: 'speed', pair: true }], ['diffRow', { norm: 'diff', pair: false }], ['speedRow', { norm: 'speed', pair: false }],
        ['diffPairEps', { norm: 'diff', pair: true, eps: true }], ['sphereRow', { model: 'sphere', pair: false }], ['sphereRowEps', { model: 'sphere', pair: false, eps: true }]]) {
        const w = termOf(C, i, j, o);
        row[k] = r6(dot(w, a.axis) / a.omega);
        if (k === 'diffPair') { row.diffPairVec = w; row.perpRel = r6(norm(sub(w, scale(a.axis, dot(w, a.axis)))) / norm(w)); }
      }
      row.bevelOverSphere = r6(row.diffPair / row.sphereRow);
      row.epsEffect = r6(row.diffPairEps / row.diffPair - 1);
      terms.push(row);
    });
  });
  // 対ごとの分母: 太陽の項(木星へ)がイオの有無で同じビット・木星の項(イオへ)が太陽の有無で同じビット・二体で行と対が同じビット
  const get = (key, recv, src) => terms.find((t) => t.config === key && t.recv === recv && t.src === src);
  const same = (a, b) => a.every((x, k) => Object.is(x, b[k]));
  const sjP = get('SJ', 'Jupiter', 'Sun'), s3P = get('SJIo', 'Jupiter', 'Sun'), jiP = get('JIo', 'Io', 'Jupiter'), s3I = get('SJIo', 'Io', 'Jupiter');
  const SJ = configs.find((c) => c.key === 'SJ');
  const rowVec = termOf(SJ, 1, 0, { norm: 'diff', pair: false });
  const pairGate = { sunOnJupiterSame: same(sjP.diffPairVec, s3P.diffPairVec), jupiterOnIoSame: same(jiP.diffPairVec, s3I.diffPairVec), twoBodyRowEqualsPair: same(rowVec, sjP.diffPairVec),
    sunOnJupiterRowOverPair: r6(s3P.diffRow / s3P.diffPair), jupiterOnIoRowOverPair: r6(s3I.diffRow / s3I.diffPair) };
  for (const t of terms) { t.diffPairVec = vr(t.diffPairVec); }
  return { terms, pairGate, note: '比 = (ω_D·â_受け手)/ω_obs(A = 1・源の自転は宣言の値 —— 分解しない)。diff/speed = 差分の型/速さの型・Pair/Row = 対ごと/行の分母・Eps = 宣言の ε(他は ε = 0)・sphere は ½∇×u(行 —— 第307便a)' };
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const G = J.G, K = J.K, Lr = J.L, S = J.S, V = J.V, Er = J.E, P = J.P;
  const k = (key) => K.find((x) => x.regime === key);
  const sRows = S.rows.filter((r) => r.series);
  return {
    geometryClosedForm: G.rows.every((r) => Math.abs(r.strength - r.closedStrength) < 1e-12 && Math.abs(r.projection - r.closedProjection) < 1e-12),
    geometryEngine: G.rows.every((r) => r.relEngine < 1e-12),
    projectionZeroAt45: Math.abs(G.rows.find((r) => r.elDeg === 45).projection) < 1e-12 && G.rows.find((r) => r.elDeg === 45).transverse > 0.7,
    poleStrengthZero: G.rows.find((r) => r.elDeg === 90).strength < 1e-12,
    rotationCovariant: G.rotationRel < 1e-12, spinReverseOdd: G.spinReverseRel < 1e-14, axisFlipInvariant: G.axisFlipRel < 1e-14, mirrorPseudovector: G.mirrorRel < 1e-12, antipodalSame: G.antipodalRel < 1e-12,
    bevelZeroAt45: K.every((x) => x.zeroBevelDeg !== null && Math.abs(x.zeroBevelDeg - 45) < 0.05),
    sphereZeroMatches: ['bg', 'inertial'].every((key) => Math.abs(k(key).zeroSphereDeg - k(key).zeroSphereTheoryDeg) < 1.0),
    qEffMatchesRegime: K.every((x) => Math.abs(x.qEff - x.qTheory) < 0.05),
    equatorRatioTheory: ['bg', 'inertial'].every((key) => Math.abs(k(key).eqDiffOverSphere / k(key).eqDiffOverSphereTheory - 1) < 0.03 && Math.abs(k(key).eqSpeedOverSphere / k(key).eqSpeedOverSphereTheory - 1) < 0.03),
    bevelEquatorReversed: K.every((x) => x.rows[0].bevelDiffAxial < 0 && x.rows[0].bevelSpeedAxial < 0),
    bevelPoleWeak: K.every((x) => x.bevelPoleOverEq < 1e-12),
    engineMatchesReference: Lr.maxRel < 1e-8,
    seriesMatchesQuadrature: sRows.every((r) => Math.abs(r.relQuad) < 1e-12 && Math.abs(r.relDQuad) < 1e-9),
    seriesMatchesLib: sRows.filter((r) => r.eps === 0).every((r) => Math.abs(r.relLib) < 1e-15 && Math.abs(r.relLibD) < 1e-15),
    seriesFarSlope: sRows.filter((r) => r.rOverR >= 1e4).every((r) => Math.abs(r.slope + 4) < 1e-7 && Math.abs(r.farLead - 1) < 1e-7),
    seriesInsideNull: S.insideNull,
    volumeMeanQuadratic: [0, 45].every((el) => { const c = (k) => V.scan.find((r) => r.el === el && r.RiOverR === k).coef; return Math.abs(c(0.03) / c(0.01) - 1) < 0.01; }),
    poleLinear: Math.abs(V.scan.find((r) => r.el === 90 && r.RiOverR === 0.01).relCenter / (3 * Math.PI / 16 * 0.01) - 1) < 0.01,
    poleResidual: Math.abs(V.pole[V.pole.length - 1].overTheory - 1) < 1e-3,
    ioJupiterFinite: (() => { const x = V.bodies.find((r) => r.config === 'JIo' && r.recv === 'Jupiter' && r.norm === 'diff'); return x.relCenter > 1e-3 && x.relCenter < 1e-2; })(),
    booksFinite: Er.books.every((b) => b.finite && b.spinUntouched && b.splitResidualMax < 1e-12),
    polarSigns: Er.polar.every((p) => p.equatorNeg && p.nearPoleSame && p.spinUntouched),
    polarLedger: Er.polar.every((p) => p.ledgerRel < 1e-9),
    gain0NoTranslationChange: Er.gain0.xvSame && Er.gain0.rotADrZero,
    explicitDefaultBitSame: Er.explicitDefault.same,
    pairSunTermIoIndependent: P.pairGate.sunOnJupiterSame && P.pairGate.jupiterOnIoSame,
    pairTwoBodyEqualsRow: P.pairGate.twoBodyRowEqualsPair,
  };
}

/* ───────── 文書の表と数(PHYSICS〔第308便a〕—— QA docs.bevel308 が正本から作り直して逐語で照合する)───────── */
const e2s = (v) => (v === null || v === undefined) ? '—' : Number(v).toExponential(2);
const f3 = (v) => (v === null || v === undefined) ? '—' : (Math.abs(v) < 5e-4 ? (0).toFixed(3) : Number(v).toFixed(3));
const f2 = (v) => (v === null || v === undefined) ? '—' : Number(v).toFixed(2);
const REG_JA = { bg: '背景が支配', inertial: 'r⁻² が支配', drag: '引きずりの核 r⁻³ が支配' };
export function physicsTables(J) {
  const out = [];
  out.push('| 仰角 | 強さ(sinθ) | 源の軸への射影 | 作用の軸と源の軸のなす角 |', '|---|---|---|---|');
  for (const r of J.G.rows) out.push(`| ${r.elDeg}° | ${f3(r.strength)} | ${f3(r.projection)} | ${r.axisAngleDeg === null ? '—(強さ 0)' : f2(r.axisAngleDeg) + '°'} |`);
  out.push('', '| 分母の型(r = 30R) | q(1 + 差分/速さ) | 0 になる仰角 bevel/sphere(理論) | 赤道の比 差分/sphere(理論) | 赤道の比 速さ/sphere(理論) | 極/赤道 bevel・sphere |', '|---|---|---|---|---|---|');
  for (const x of J.K) {
    const q2 = x.qTheory <= 2, na = '—(sphere の赤道 ≈ 0)';
    out.push(`| ${REG_JA[x.regime]} | ${f3(x.qEff)} | ${f2(x.zeroBevelDeg)}°/${q2 ? '—' : f2(x.zeroSphereDeg) + '°'}(${x.zeroSphereTheoryDeg === null ? '—' : f2(x.zeroSphereTheoryDeg) + '°'}) | ${q2 ? na : f3(x.eqDiffOverSphere) + '(' + f3(x.eqDiffOverSphereTheory) + ')'} | ${q2 ? na : f3(x.eqSpeedOverSphere) + '(' + f3(x.eqSpeedOverSphereTheory) + ')'} | ${e2s(x.bevelPoleOverEq)}・${q2 ? '—' : f3(x.spherePoleOverEq)} |`);
  }
  out.push('', '| 照合 | 値 |', '|---|---|');
  out.push(`| エンジンの bevel と参照(求積 + 数値の微分)の尺度つきの相対の差の最大(配置 ${J.L.rows.length} 通り —— 遠方を含む) | ${e2s(J.L.maxRel)} |`);
  for (const r of J.L.far) out.push(`| 遠方 ${r.name} | ${e2s(r.relScale)} |`);
  const s = (eps, r) => J.S.rows.find((x) => x.eps === eps && x.rOverR === r);
  out.push('', '| 遠方の M1(ε, r/R) | 級数/求積 − 1 | 級数の dM1/dr / 数値の微分 − 1 | 今の式(求積)− 1 | 今の式(5 点)− 1 |', '|---|---|---|---|---|');
  for (const [eps, r] of [[0, 4], [0, 100], [0, 1e4], [0, 1e6], [0.05, 1e4], [0.3, 100]]) { const x = s(eps, r); out.push(`| ${eps}, ${r} | ${e2s(x.relQuad)} | ${e2s(x.relDQuad)} | ${e2s(x.oldRelQuad)} | ${e2s(x.oldRelDQuad)} |`); }
  out.push('', '| 体積平均 − 中心(r⁻² が支配・r = 10R・赤道の強さで割る) | R_i/r = 0.01 | 0.1 | 0.3 |', '|---|---|---|---|');
  for (const el of [0, 45, 90]) { const g = (k) => J.V.scan.find((x) => x.el === el && x.RiOverR === k).relCenter; out.push(`| 仰角 ${el}° | ${e2s(g(0.01))} | ${e2s(g(0.1))} | ${e2s(g(0.3))} |`); }
  out.push(`| 極の残り(一定の強さ・R_i/r = 10⁻³・次数 ${J.V.pole[J.V.pole.length - 1].order})/ (3π/16)(R_i/r) | ${f3(J.V.pole[J.V.pole.length - 1].overTheory)} | — | — |`);
  out.push('', '| 天体の受け手 ← 源 | R_i/r | 体積平均 − 中心(差分の型) | 体積平均 − 中心(速さの型) |', '|---|---|---|---|');
  for (const [key, recv] of [['SV', 'Venus'], ['SJ', 'Jupiter'], ['JIo', 'Io'], ['JIo', 'Jupiter']]) {
    const g = (nm) => J.V.bodies.find((x) => x.config === key && x.recv === recv && x.norm === nm);
    out.push(`| ${recv} ← ${g('diff').src}(${key}) | ${e2s(g('diff').RiOverR)} | ${e2s(g('diff').relCenter)} | ${e2s(g('speed').relCenter)} |`);
  }
  out.push('', '| 本の写し(axialModel:"bevel") | 規格化 | 受け手 逆/同 | 分母を源だけにした対照 逆/同 | 差分の型の強さが負の対(全步) | S.spin 不変 |', '|---|---|---|---|---|---|');
  for (const b of J.E.books) out.push(`| ${b.emoji} ${b.id} | ${b.norm} | ${b.receiversNeg}/${b.receiversPos} | ${b.sourceOnly ? b.sourceOnly.neg + '/' + b.sourceOnly.pos : '—'} | ${b.bevel ? b.bevel.negAmp + '/' + b.bevel.terms : '—'} | ${b.spinUntouched ? 'はい' : 'いいえ'} |`);
  out.push('', '| 極の受け手の写し | 源の軸方向の成分が 0 になる仰角 | 赤道 | 85° | 極/赤道の大きさ | 帳簿 I s Δâ の一致 |', '|---|---|---|---|---|---|');
  const PV = { wbg: 'W_bg 0.125(背景に近い)', inertialR2: 'inertialR2 λ 10⁻⁶(行)', inertialR2pair: 'inertialR2 λ 10⁻⁶(対ごと)' };
  for (const p of J.E.polar) out.push(`| ${PV[p.variant]} | ${f2(p.zeroCrossDeg)}° | ${p.equatorNeg ? '逆' : '同'} | ${p.nearPoleSame ? '同' : '逆'} | ${e2s(p.poleOverEquator)} | ${e2s(p.ledgerRel)} |`);
  out.push('', '| 天体(A = 1・ω_D·â/ω_obs) | 源 | 差分の型(対) | 速さの型(対) | 差分の型(行) | sphere(行) | bevel/sphere | 宣言の ε の効き |', '|---|---|---|---|---|---|---|---|');
  for (const [key, recv, src] of [['SV', 'Venus', 'Sun'], ['SJ', 'Jupiter', 'Sun'], ['JIo', 'Io', 'Jupiter'], ['JIo', 'Jupiter', 'Io'], ['SJIo', 'Jupiter', 'Sun'], ['SJIo', 'Io', 'Jupiter'], ['SJIo', 'Io', 'Sun']]) {
    const t = J.P.terms.find((x) => x.config === key && x.recv === recv && x.src === src);
    out.push(`| ${recv}(${key}) | ${src} | ${e2s(t.diffPair)} | ${e2s(t.speedPair)} | ${e2s(t.diffRow)} | ${e2s(t.sphereRow)} | ${e2s(t.bevelOverSphere)} | ${e2s(t.epsEffect)} |`);
  }
  return out.join('\n');
}
export function docNumbers(J) {
  const t = (key, recv, src) => J.P.terms.find((x) => x.config === key && x.recv === recv && x.src === src);
  const k = (key) => J.K.find((x) => x.regime === key);
  return [e2s(J.L.maxRel), e2s(t('SV', 'Venus', 'Sun').diffPair), e2s(t('SJ', 'Jupiter', 'Sun').diffPair), e2s(t('JIo', 'Io', 'Jupiter').diffPair),
    f3(k('inertial').eqDiffOverSphere), f2(k('inertial').zeroSphereDeg), f3(J.V.pole[J.V.pole.length - 1].overTheory)];
}

export function runAll(H, o = {}) {
  const quick = !!o.quick, t = {};
  let t0 = Date.now();
  const { configs, ioPlacement } = buildConfigs(H.HP, idsPlanets(H.HP));
  const G = partG(H); t.G = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now();
  const K = partK(H); t.K = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now();
  const Lr = partL(H, quick); t.L = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now();
  const S = partS(H); t.S = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now();
  const V = partV(H, configs, quick); t.V = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now();
  const Er = partE(H, quick); t.E = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now();
  const P = partP(H, configs); t.P = { wallSec: (Date.now() - t0) / 1000 };
  const J = { quick, regimes: REGIMES, ioPlacement, G, K, L: Lr, S, V, E: Er, P };
  J.gates = gatesOf(J);
  J.ok = Object.values(J.gates).every(Boolean);
  J.timing = t;
  return J;
}

export async function main() {
  const TARGET = process.env.W308A_TARGET || 'beta/index.html';
  const OUT = process.env.W308A_OUT || path.join(ROOT, 'tests', 'out', 'bevel-w308a.json');
  const quick = process.env.W308A_QUICK === '1';
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now();
  const W281A_SCOPE = w281aScopeStamp(html, REGEN_SCOPE);
  const H = loadHtmlHeadless(html);
  pinDecl315c(H.evalExpr);   // 第315便c(AN406): 在位の 7 本の宣言を移行の前の写しへ(本ごとの門 —— 基点の html では no-op・正本の欄は足さない)
  const R = runAll(H, { quick });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w308a-bevel.mjs', target: TARGET,
    targetSha256: crypto.createHash('sha256').update(fs.readFileSync(html)).digest('hex'),
    ruling: '原仮定者の裁定(第101報)(源の軸回転は軸方向に対する角度差の 2 倍で傾いた軸で作用する —— 赤道で逆・軸方向で順・45° でベベルギヤの様に 90°・軸引きずりは回転引きずりの差分で仰角が上がると弱まる・受け手は体積平均)・決断事項 AN346・AN347・AN354・統括の検証項目 R214',
    axialVersion: E(H, 'REL_DRAG_AXIAL_BEVEL_VERSION'), axialLaw: E(H, 'REL_DRAG_AXIAL_LAW_BEVEL'), m1FarVersion: E(H, 'REL_DRAG_M1_FAR_VERSION'), norms: E(H, 'REL_DRAG_AXIAL_NORMS'), ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w308a-bevel.mjs', 'tests/lib-w315c-legacy7.mjs', 'tests/lib-w308a-bevel.mjs', 'tests/lib-w307a-sphereaxial.mjs', 'tests/exp-w307a-sphereaxial.mjs', 'tests/exp-w307c-spindecomp.mjs',
    'tests/lib-w307c-spindecomp.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第308便a', target: TARGET, code: CODE, inputs: [TARGET, LEGACY7_DATA_FILE] }), {
    harnessVersion: HARNESS_VERSION,
    engine: 'Node の headless(tests/lib-w279b-headless.mjs の loadHtmlHeadless —— html の本文をそのまま実行・1 プロセス)',
    notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s', JSON.stringify(out.timing));
}
if (IS_MAIN) await main();
