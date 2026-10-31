// 第309便a(原仮定者の裁定(第103報)「正確な引きずり(修正版)」①〜⑧・第104報 AN363「dragCore は各天体でフィットさせるノブ・未宣言の既定は質量 = 全質量・
// 半径 = 天体の半径を 6.5×10⁶ m 以下にクランプ」・第106報・決断事項 AN359・AN363・統括の検証項目 R218):
// **新しい引きずり則(逆二乗の体積平均・トータルの分母・比の平均)と dragCore の既定の参照の器**
// (独立な求積による核の確かめ・エンジンの opt-in relativeDrag.invSq と参照の一致・2 体と 3 体・天体の写し・dragCore の既定の数え上げ・受理)。
//
// Node だけ(対象 html の inline script を tests/lib-w279b-headless.mjs の loadHtmlHeadless で読み、html の関数 inertialDragIsqK2・inertialDragIsqM2・
// inertialDragIsqPointAt・inertialDragIsqState・dragCoreDefaultState と本の入口 validatePreset・coord3d.makeSim・build・step をそのまま呼ぶ)。
// 参照は tests/lib-w309a-invsq.mjs(源の球の直接の 3 次元の求積・自前の閉じた式と級数・数値の微分 —— エンジンの式と独立)。
// **在位の本の宣言は変えない**(写しは器の中で組む)。
//
// ■ 段
//   Q(核): K2・M2・dK2/dr・dM2/dr —— lib の閉じた式と源の球の直接の 3 次元の求積(外部)・殻の角度の閉じた式の動径の求積(内部 —— 自己の場)・
//     エンジンの閉じた式/級数と lib・数値の微分。自己の中心 3/R²・表面 1.5/R²・二重体積平均 9/(4R²)(エンジンの規則の次数の走査)・遠方の先頭 M2 = 2R²/(5r³)。
//   P(点): 受け手の体積の点でエンジンの W・β の被積分・回転の係数・軸の amp と lib(閉じた式の連鎖と数値の方向微分)。
//   A(平均): 比の平均 ⟨N/W⟩ と平均の比 ⟨N⟩/⟨W⟩・中心の値の差(天体の写し)・求積の次数の収束(β・ω)。
//   E(エンジンと参照): 配置の走査(2 体・3 体・軸・距離・半径・対の除外)でエンジンの β・回転の係数・軸の ω と lib・本の写しの 1 步の u と lib の連立の解。
//   T(2 体と 3 体): 第三体が分母を通じて β を変える量(「同じビット」は求めない —— 新則の仕様)。
//   B(天体の写し): 太陽–金星・太陽–木星・木星–イオ・太陽–木星–イオ(第307便c の配置・W_bg′ = 0・既定の半径)の |u|/|v|・ω_D·â/ω_obs・負の点の割合と
//     旧則(第308便a の正本 —— bevel の差分の型・対ごと)の値・在位の金星/木星の写しの走行(新則・既定の半径)。
//   D(dragCore の既定): 在位で既定を当てたら半径が変わる本とレコード(inertial で有効・単位あり・未宣言・R > 6.5×10⁶ m)・旧則のまま既定を足した走行の
//     ビット同一の数(在位の本は半径を読む項を宣言していない)・回転/軸の引きずりを足した写しで R_d² の比。
//   G(受理): 正準形・拒否の理由・enabled:false の走りが引きずり無しと同じ・チェックポイントの復元の後の同一。
//
// ■ 言わないこと: 「法則を発見した」「自転が釣り合った」「帳簿が完全に閉じた」「2 倍角を導いた」「完全に一致」。sinθ は仮定・軸の向き(鏡映)は構成則
//   (球の積分から一意に導かれたとは書かない)・W_bg′ = 0 は参照条件(同定ではない)。
//
// ■ 使い方
//   node tests/exp-w309a-invsq.mjs   → 正本 tests/out/invsq-w309a.json(段 invsq-309a)
//   W309A_OUT=<json> で出力先を変える(試走は正本を書かない)・W309A_TARGET=<html>(既定 beta/index.html)・W309A_QUICK=1(求積と步数を縮める —— 煙試験の窓)。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlHeadless } from './lib-w279b-headless.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import { idsFromDecl as idsPlanets, buildConfigs } from './exp-w307c-spindecomp.mjs';
import * as L from './lib-w309a-invsq.mjs';
import { pinDecl315c, LEGACY7_DATA_FILE } from './lib-w315c-legacy7.mjs';   // 第315便c(決断事項 AN406・R244): 在位の 7 本を K1 へ移した世代では、この器は移行の前(af2f426)の宣言の写しで測る
// 第281便a の領域 hash の宣言(器と lib から deriveScope で引いた下限 —— 段 D が在位の全本を数えるので presets は "all")
const REGEN_SCOPE = {"presets":"all","roots":["$","DRAG_CORE_DEFAULT_VERSION","HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.sim","HP.validatePreset","REL_DRAG_INVSQ_LAW","REL_DRAG_INVSQ_VERSION","REL_DRAG_SPIN_NODES","T","appStepDt","ckRestoreOne","ckSnapOne","ctx","cw","dfmGaussLegendre01","dragCoreDefaultState","inertialDragIsqK2","inertialDragIsqM2","inertialDragIsqPointAt","inertialDragIsqRule","inertialDragIsqState","inertialSpinMoment","inertialSpinMomentFar","relDragEnabledOf","retiredOf","sim"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w309a-invsq-1';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (o) => JSON.parse(JSON.stringify(o));
const E = (H, name) => H.evalExpr(name);
const { dot, cross, norm, add, sub, scale, unit } = L;
const rel = (a, b) => Math.abs(a - b) / Math.max(Math.abs(b), 1e-300);
const relv = (a, b) => norm(sub(a, b)) / Math.max(norm(b), 1e-300);
const r6 = (v) => (typeof v === 'number' && Number.isFinite(v)) ? Number(v.toPrecision(10)) : v;
const vr = (a) => a.map(r6);
const NOT_CLAIM = ['法則を発見した', '自転が釣り合った', '帳簿が完全に閉じた', '2 倍角を導いた', '完全に一致', 'W_bg′ を同定した'];
const CAP = 6.5e6;

/* ───────── エンジンの関数を呼ぶための最小の状態(三次元・新則)───────── */
/** bodies = [{x, m, Rd, md?, Om, a}]・o = {Wbg2, order, rot, axial, gain, pairs:[[i,j]…]} */
function engineState(bodies, o = {}) {
  const n = bodies.length, F = (f) => Float64Array.from(bodies.map(f));
  const sd = (o.rot || o.axial) ? { rot: o.rot ? 'surfaceFlip' : 'off', axial: o.axial ? 'on' : 'off', ...(o.axial ? { axialModel: 'bevel', axialGain: o.gain === undefined ? 1 : o.gain, axialNorm: 'diff' } : {}) } : null;
  const S = { n, coord3d: true, m: F((b) => b.m), x: F((b) => b.x[0]), y: F((b) => b.x[1]), z: F((b) => b.x[2]), spin: F((b) => b.Om || 0), radOv: F((b) => b.Rd),
    sax: F((b) => (b.a || [0, 0, 1])[0]), say: F((b) => (b.a || [0, 0, 1])[1]), saz: F((b) => (b.a || [0, 0, 1])[2]), pinned: new Uint8Array(n),
    relDrag: { law: 'inertial', invSq: { Wbg2: o.Wbg2 || 0, order: o.order || 8 }, pairs: 'all', history: 'positions', ...(sd ? { spinDrag: sd } : {}) },
    dragCoreD: bodies.some((b) => b.md !== undefined) ? bodies.map((b) => (b.md !== undefined ? { massFrac: b.md / b.m, radius: b.Rd, R: b.Rd } : null)) : null,
    _rdPairSet: null, _rdPairN: n, _amKind: null, params: { G: 1, cLight: 1 } };
  if (o.pairs) { S._rdPairSet = new Set(); for (const [i, j] of o.pairs) { S._rdPairSet.add(i * n + j); } S.relDrag.pairs = o.pairs; }
  return S;
}
const libBodies = (bodies) => bodies.map((b) => ({ x: b.x, m: b.m, Rd: b.Rd, ...(b.md !== undefined ? { md: b.md } : {}), Om: b.Om || 0, a: b.a || [0, 0, 1] }));
const pairSetLib = (pairs) => pairs ? new Set(pairs.flatMap(([i, j]) => [i + ',' + j])) : null;

/* ───────── 段 Q(核)───────── */
function partQ(H, quick) {
  const B = new Float64Array(4), k2 = E(H, 'inertialDragIsqK2'), m2 = E(H, 'inertialDragIsqM2'), R = 1;
  const ext = [], nq = quick ? 32 : 64;
  for (const x of [1.05, 1.5, 2, 2.9, 3.1, 5, 30, 1e3, 1e6]) {
    const d = scale([0.36, 0.48, 0.8], x), n = (x < 1.2) ? (quick ? 64 : 160) : nq;
    const q = L.sourceQuad(d, R, n, n), h = 1e-3 * (x - R) * (x < 10 ? 1 : 1);
    const dq = L.numDr((t) => L.sourceQuad(scale([0.36, 0.48, 0.8], t), R, nq, nq).K, x, Math.min(h, 0.01 * x));
    const dmq = L.numDr((t) => L.sourceQuad(scale([0.36, 0.48, 0.8], t), R, nq, nq).M, x, Math.min(h, 0.01 * x));
    k2(x, R, B); m2(x, R, B);
    ext.push({ rOverR: x, libVsQuadK: r6(rel(L.K2(x, R), q.K)), libVsQuadM: r6(rel(L.M2(x, R), q.M)), engVsLibK: r6(rel(B[0], L.K2(x, R))), engVsLibM: r6(rel(B[2], L.M2(x, R))),
      engVsLibDK: r6(rel(B[1], L.K2Dr(x, R))), engVsLibDM: r6(rel(B[3], L.M2Dr(x, R))), engDKVsQuadDeriv: r6(rel(B[1], dq)), engDMVsQuadDeriv: r6(rel(B[3], dmq)),
      M2lead: r6(B[2] * x ** 3 / (2 / 5)), M2overM1lead: r6(B[2] / (3 / (5 * x ** 4))) });
  }
  const inn = [];
  for (const x of [0.001, 0.1, 0.29, 0.31, 0.5, 0.9, 0.99]) {
    k2(x, R, B);
    inn.push({ rOverR: x, engVsLibK: r6(rel(B[0], L.K2(x, R))), libVsShellQuad: r6(rel(L.K2(x, R), L.selfK2Quad(x, R, quick ? 120 : 200))),
      engDKVsLibNum: r6(rel(B[1], L.numDr((t) => L.K2(t, R), x, 1e-4 * Math.min(x, 1 - x)))) });
  }
  k2(0, 2, B); const center = B[0] * 4 / 3;
  k2(2 * (1 - 1e-13), 2, B); const surf = B[0] * 4 / 1.5;
  const rule = E(H, 'inertialDragIsqRule'), dbl = [];
  for (const n of [4, 6, 8, 12, 16, 24]) {
    const q = rule(n); let s = 0, w = 0;
    for (let k = 0; k < q.N; k++) { k2(q.T[k], 1, B); s += q.W[k] * B[0]; w += q.W[k]; }
    dbl.push({ order: n, nodes: q.N, weightSum: r6(w), overTheory: r6(s / (9 / 4)) });
  }
  return { ext, inn, centerOverTheory: r6(center), surfaceOverTheory: r6(surf), doubleMean: dbl,
    // 門の範囲は r/R 1.5〜10³(r/R = 1.05 は求積が表面の近くで遅い・10⁶ の M2 は求積の打ち消し〔先頭が O(R/r) で消える〕の丸め —— どちらも行に残す)
    maxLibVsQuad: r6(Math.max(...ext.filter((r) => r.rOverR >= 1.5 && r.rOverR <= 1e3).flatMap((r) => [r.libVsQuadK, r.libVsQuadM]))),
    farQuadM: r6(ext.find((r) => r.rOverR === 1e6).libVsQuadM),
    maxEngVsLib: r6(Math.max(...ext.flatMap((r) => [r.engVsLibK, r.engVsLibM, r.engVsLibDK, r.engVsLibDM]), ...inn.map((r) => r.engVsLibK))),
    maxDerivVsQuad: r6(Math.max(...ext.filter((r) => r.rOverR >= 1.5 && r.rOverR <= 1e3).flatMap((r) => [r.engDKVsQuadDeriv, r.engDMVsQuadDeriv]))),
    farQuadDM: r6(ext.find((r) => r.rOverR === 1e6).engDMVsQuadDeriv) };
}

/* ───────── 段 P(点)───────── */
const TOYS = [
  { key: 'toy2', bodies: [{ x: [0, 0, 0], m: 3, Rd: 1, Om: 0.7, a: unit([0.2, 0.1, 1]) }, { x: [6, 1.5, -0.8], m: 1, Rd: 0.5, Om: -0.3, a: [0, 0, 1] }] },
  { key: 'toy3', bodies: [{ x: [0, 0, 0], m: 5, Rd: 1.2, Om: 1, a: [0, 0, 1] }, { x: [7, 0, 1], m: 1, Rd: 0.4, Om: 0.5, a: unit([1, 0, 1]) }, { x: [-3, 6, -2], m: 2, Rd: 0.8, Om: -0.2, a: unit([0, 1, 1]) }] },
  { key: 'toyNear', bodies: [{ x: [0, 0, 0], m: 2, Rd: 1, Om: 1, a: [0, 0, 1] }, { x: [1.3, 0.9, 0.4], m: 1, Rd: 0.4, Om: 0.4, a: [1, 0, 0] }] },
  { key: 'toyMd', bodies: [{ x: [0, 0, 0], m: 4, md: 1.3, Rd: 0.6, Om: 1, a: [0, 0, 1] }, { x: [0, 5, 2], m: 1, Rd: 0.5, Om: 2, a: unit([1, 1, 0]) }] },
  { key: 'toyPairs', bodies: [{ x: [0, 0, 0], m: 5, Rd: 1, Om: 1, a: [0, 0, 1] }, { x: [8, 0, 0], m: 1, Rd: 0.5, Om: 0.5, a: [0, 0, 1] }, { x: [0, 9, 3], m: 2, Rd: 0.7, Om: 0.3, a: [1, 0, 0] }], pairs: [[1, 0], [2, 0]] },
  { key: 'toyWbg', bodies: [{ x: [0, 0, 0], m: 3, Rd: 1, Om: 1, a: [0, 0, 1] }, { x: [5, 2, 0], m: 1, Rd: 0.5, Om: 0.2, a: [0, 0, 1] }], Wbg2: 0.4 },
];
function partP(H, cfgs) {
  const rows = [];
  const pointAt = E(H, 'inertialDragIsqPointAt');
  const cases = TOYS.map((t) => ({ key: t.key, bodies: t.bodies, Wbg2: t.Wbg2 || 0 }))
    .concat(cfgs.map((C) => ({ key: C.key, bodies: C.bodies.map((b) => ({ x: b.x, m: b.m, Rd: L.defaultCoreRadius(b.R, 0).Rd, Om: b.omega, a: b.axis })), Wbg2: 0 })));
  for (const C of cases) {
    const S = engineState(C.bodies, { Wbg2: C.Wbg2 }), lb = libBodies(C.bodies);
    for (let i = 0; i < C.bodies.length; i++) for (const [t, s] of [[0.2, [0.6, 0, 0.8]], [0.7, [-0.48, 0.6, -0.64]], [0.97, [0, -1, 0]], [0.999, unit([1, 1, 1])]]) {
      const p = add(C.bodies[i].x, scale(s, C.bodies[i].Rd * t)), e = pointAt(S, i, p[0], p[1], p[2]), l = L.pointTerms(lb, i, p, { Wbg2: C.Wbg2 });
      let mb = 0, mr = 0, ma = 0, mn = 0;
      for (const te of e.terms) { const tl = l.terms.find((x) => x.j === te.j); mb = Math.max(mb, rel(te.beta, tl.beta)); mr = Math.max(mr, rel(te.rotC, tl.rotC)); ma = Math.max(ma, rel(te.amp, tl.ampAna)); mn = Math.max(mn, rel(te.amp, tl.ampNum)); }
      rows.push({ config: C.key, recv: i, t, W: r6(rel(e.W, l.W)), beta: r6(mb), rotC: r6(mr), ampAnalytic: r6(ma), ampNumeric: r6(mn) });
    }
  }
  return { rows, maxW: r6(Math.max(...rows.map((r) => r.W))), maxBeta: r6(Math.max(...rows.map((r) => r.beta))), maxRot: r6(Math.max(...rows.map((r) => r.rotC))),
    maxAmpAnalytic: r6(Math.max(...rows.map((r) => r.ampAnalytic))), maxAmpNumeric: r6(Math.max(...rows.map((r) => r.ampNumeric))) };
}

/* ───────── 段 A(比の平均と平均の比・次数の収束)・E(エンジンと参照)───────── */
function planetBodies(C) { return C.bodies.map((b) => ({ x: b.x, m: b.m, Rd: L.defaultCoreRadius(b.R, 0).Rd, Om: b.omega, a: b.axis, label: b.label, R: b.R, v: b.v })); }
function partA(H, cfgs, quick) {
  const state = E(H, 'inertialDragIsqState'), rows = [], conv = [];
  for (const C of cfgs) {
    const bs = planetBodies(C), lb = libBodies(bs), S = engineState(bs, { rot: true, axial: true, order: 8 }), st = state(S);
    for (let i = 0; i < bs.length; i++) {
      const R = L.refReceiver(lb, i, { order: 8, axial: true }), P0 = L.pointTerms(lb, i, bs[i].x, {});
      // 第310便a(§2 —— 自己の場の前計算): エンジンの自己の場は節点の動径 t そのもの(桁落ちなし)。lib は節点 − 中心の差の長さで作るので、中心の座標が大きい天体
      //   (SI の太陽系の写し)では lib の側に |x_i|·2⁻⁵³/(t R) の桁落ちが残る —— 照合は受け手を原点に置いた lib(並進で同じ式)と取る(Raw は今の座標の lib との差)
      const Rc = L.refReceiver(lb.map((b) => ({ ...b, x: sub(b.x, lb[i].x) })), i, { order: 8, axial: true });
      for (let j = 0; j < bs.length; j++) {
        if (j === i) continue;
        const c0 = P0.terms.find((x) => x.j === j).beta, eb = st.receivers.find((x) => x.i === i).beta[j];
        rows.push({ config: C.key, recv: bs[i].label, src: bs[j].label, beta: r6(R.beta[j]), ratioOfMeansMinus1: r6(R.betaRatioOfMeans[j] / R.beta[j] - 1), centerMinus1: r6(c0 / R.beta[j] - 1),
          engVsLib: r6(rel(eb, Rc.beta[j])), engVsLibRaw: r6(rel(eb, R.beta[j])) });
      }
    }
  }
  // 次数の収束(太陽–木星–イオ: イオ・木星の β と ω —— 24 次に対して)
  const C = cfgs.find((c) => c.key === 'SJIo'), bs = planetBodies(C), ref = {}, ords = quick ? [4, 8, 12] : [4, 6, 8, 12, 16, 24];
  for (const n of ords) {
    const st = state(engineState(bs, { rot: true, axial: true, order: n }));
    ref[n] = st.receivers;
  }
  const top = ords[ords.length - 1];
  for (const n of ords) for (const i of [1, 2]) {
    const a = ref[n].find((x) => x.i === i), b = ref[top].find((x) => x.i === i);
    conv.push({ order: n, recv: bs[i].label, betaSum: r6(rel(a.betaSum, b.betaSum)), omega: r6(relv(a.omega, b.omega)) });
  }
  return { rows, conv, maxEngVsLib: r6(Math.max(...rows.map((r) => r.engVsLib))) };
}
function rndUnit(rng) { const z = 2 * rng() - 1, p = 2 * Math.PI * rng(), s = Math.sqrt(1 - z * z); return [s * Math.cos(p), s * Math.sin(p), z]; }
function mulberry(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function partE(H, quick) {
  const state = E(H, 'inertialDragIsqState'), rng = mulberry(30901), rows = [];
  const N = quick ? 6 : 24;
  for (let c = 0; c < N; c++) {
    const n = 2 + (c % 2), bodies = [];
    for (let k = 0; k < n; k++) {
      const Rd = 0.3 + rng(), m = 0.5 + 4 * rng();
      let x;
      for (let t = 0; t < 100; t++) { x = scale(rndUnit(rng), (k === 0 ? 0 : 3 + 12 * rng())); if (bodies.every((b) => norm(sub(b.x, x)) > b.Rd + Rd + 0.2)) break; }
      bodies.push({ x, m, Rd, Om: (rng() - 0.5) * 2, a: rndUnit(rng) });
    }
    const pairs = (c % 5 === 4 && n === 3) ? [[0, 1], [1, 0], [2, 0]] : null, Wbg2 = (c % 3 === 1) ? 0.05 : 0, order = [6, 8, 10][c % 3];
    const S = engineState(bodies, { rot: true, axial: true, pairs, Wbg2, order }), st = state(S), lb = libBodies(bodies);
    let mb = 0, mr = 0, mo = 0;
    for (let i = 0; i < n; i++) {
      const R = L.refReceiver(lb, i, { order, axial: true, Wbg2, pairs: pairSetLib(pairs) }), e = st.receivers.find((x) => x.i === i);
      for (let j = 0; j < n; j++) { if (j === i || R.beta[j] === 0) continue; mb = Math.max(mb, rel(e.beta[j], R.beta[j])); mr = Math.max(mr, relv(e.rot.slice(3 * j, 3 * j + 3), R.rot[j])); }
      mo = Math.max(mo, relv(e.omega, R.omega));
    }
    rows.push({ case: c, n, order, Wbg2, pairs: !!pairs, beta: r6(mb), rot: r6(mr), omega: r6(mo), negFrac: r6(st.negFrac) });
  }
  // 本の写しの 1 步(木星の写し・新則・既定の半径・回転/軸): エンジンの u と lib の連立の解(同じ核の位置 S._rdQX… と力学速度)
  const step = stepCheck(H);
  return { rows, step, maxBeta: r6(Math.max(...rows.map((r) => r.beta))), maxRot: r6(Math.max(...rows.map((r) => r.rot))), maxOmega: r6(Math.max(...rows.map((r) => r.omega))) };
}
function presetOf(HP, id) { const p = HP.allPresets().find((q) => q.id === id); if (!p) throw new Error('本が無い: ' + id); return clone(p); }
function build(H, q) {
  const HP = H.HP, v = HP.validatePreset(q);
  if (!v.ok) throw new Error('validatePreset: ' + JSON.stringify(v.errors || v.err).slice(0, 300));
  const S = HP.coord3d.makeSim(); S.build(clone(v.preset));
  return { S, dt: E(H, 'appStepDt')(S), preset: v.preset };
}
export const INVSQ = { invSq: { Wbg2: 0, order: 8 }, dragCoreDefault: 'cap6500km', spinDrag: { rot: 'surfaceFlip', axial: 'on', axialModel: 'bevel' } };
function invSqCopy(HP, id, extra = {}) {
  const q = presetOf(HP, id), rd = q.physics.relativeDrag;
  q.physics.relativeDrag = { law: 'inertial', ...clone(INVSQ), ...(rd.pairs && rd.pairs !== 'all' ? { pairs: rd.pairs } : {}), ...extra };
  return q;
}
function stepCheck(H) {
  const HP = H.HP, a = build(H, invSqCopy(HP, 'jupiterSunInertial3d')), S = a.S;
  for (let k = 0; k < 3; k++) S.step(a.dt);
  const n = S.n, st = E(H, 'dragCoreDefaultState')(S), bs = [];
  for (let i = 0; i < n; i++) bs.push({ x: [S._rdQX[i], S._rdQY[i], S._rdQZ[i]], m: S.m[i], Rd: st.rows.find((r) => r.i === i).Rd, Om: S.spin[i], a: [S._rdSAX[i], S._rdSAY[i], S._rdSAZ[i]] });
  const lb = libBodies(bs), R = bs.map((_, i) => L.refReceiver(lb, i, { order: 8, axial: true })), v = bs.map((_, i) => [S.vx[i], S.vy[i], S.vz[i]]);
  const u = L.solveMotion(lb, R, v), ue = bs.map((_, i) => [S._rdUX[i], S._rdUY[i], S._rdUZ[i]]), we = bs.map((_, i) => [S._rdWX[i], S._rdWY[i], S._rdWZ[i]]);
  return { book: 'jupiterSunInertial3d', steps: 3, uRel: vr(ue.map((x, i) => relv(x, u[i]))), omegaRel: vr(we.map((x, i) => relv(x, R[i].omega))),
    uOverV: vr(ue.map((x, i) => norm(x) / norm(v[i]))), ledger: { steps: S.inertialDragIsqN, betaMax: r6(S.inertialDragIsqBetaMax), neg: r6(S.inertialDragIsqNeg), why: S.inertialDragWhy || null } };
}

/* ───────── 段 T(2 体と 3 体)───────── */
function partT(cfgs) {
  const SJ = cfgs.find((c) => c.key === 'SJ'), SJIo = cfgs.find((c) => c.key === 'SJIo'), JIo = cfgs.find((c) => c.key === 'JIo');
  const b2 = libBodies(planetBodies(SJ)), b3 = libBodies(planetBodies(SJIo)), bJ = libBodies(planetBodies(JIo));
  const r2 = L.refReceiver(b2, 1, { order: 8 }), r3 = L.refReceiver(b3, 1, { order: 8 }), rIo3 = L.refReceiver(b3, 2, { order: 8 }), rIo2 = L.refReceiver(bJ, 1, { order: 8 });
  return { jupiterFromSun2: r6(r2.beta[0]), jupiterFromSun3: r6(r3.beta[0]), jupiterFromSunRatioMinus1: r6(r3.beta[0] / r2.beta[0] - 1),
    ioFromJupiter2: r6(rIo2.beta[0]), ioFromJupiter3: r6(rIo3.beta[1]), ioFromJupiterRatioMinus1: r6(rIo3.beta[1] / rIo2.beta[0] - 1), ioFromSun3: r6(rIo3.beta[0]),
    note: '第三体は分母 W を通じて β を変える(新則の仕様 —— 旧 pair の「第三体の有無で同じビット」は求めない)' };
}

/* ───────── 段 B(天体の写し)───────── */
function partB(H, cfgs) {
  const rows = [];
  let old = null;
  try { old = JSON.parse(fs.readFileSync(path.join(ROOT, 'tests', 'out', 'bevel-w308a.json'), 'utf8')); } catch (e) { old = null; }
  const oldOf = (key, recv, src) => { const t = old && old.P && old.P.terms ? old.P.terms.find((x) => x.config === key && x.recv === recv && x.src === src) : null; return t ? t.diffPair : null; };
  for (const C of cfgs) {
    const bs = planetBodies(C), lb = libBodies(bs), R = bs.map((_, i) => L.refReceiver(lb, i, { order: 8, axial: true }));
    const v = bs.map((b) => b.v), u = L.solveMotion(lb, R, v);
    for (let i = 0; i < bs.length; i++) {
      const b = bs[i];
      for (let j = 0; j < bs.length; j++) {
        if (j === i) continue;
        // 源 j だけの軸の ω(単一の源 —— 他の源の自転を 0 にした写し)
        const lj = lb.map((x, k) => ({ ...x, Om: k === j ? x.Om : 0 })), Rj = L.refReceiver(lj, i, { order: 8, axial: true });
        rows.push({ config: C.key, recv: b.label, src: bs[j].label, RdRecv: r6(b.Rd), RdSrc: r6(bs[j].Rd), beta: r6(R[i].beta[j]),
          omegaAxialOverObs: r6(dot(Rj.omega, b.a) / b.Om), omegaPerpOverObs: r6(norm(sub(Rj.omega, scale(b.a, dot(Rj.omega, b.a)))) / Math.abs(b.Om)), negFrac: r6(Rj.negFrac),
          oldBevelDiffPair: r6(oldOf(C.key, b.label, bs[j].label)) });
      }
      rows.push({ config: C.key, recv: b.label, src: '(合計)', uOverV: r6(norm(u[i]) / norm(v[i])), betaSum: r6(R[i].beta.reduce((a, x) => a + x, 0)) });
    }
  }
  // 在位の金星・木星の写し(新則・既定の半径・回転/軸)の走行
  const HP = H.HP, books = [];
  for (const id of ['venusSunInertial3d', 'jupiterSunInertial3d']) {
    const a = build(H, invSqCopy(HP, id)), S = a.S, K = 20;
    for (let k = 0; k < K; k++) S.step(a.dt);
    const n = S.n, finite = Array.from({ length: n }, (_, i) => [S.x[i], S.y[i], S.z[i], S.vx[i], S.vy[i], S.vz[i]]).flat().every(Number.isFinite);
    books.push({ id, steps: K, finite, uOverV: vr(Array.from({ length: n }, (_, i) => Math.hypot(S._rdUX[i], S._rdUY[i], S._rdUZ[i]) / Math.hypot(S.vx[i], S.vy[i], S.vz[i]))),
      omegaDrag: vr(Array.from({ length: n }, (_, i) => Math.hypot(S._rdWX[i], S._rdWY[i], S._rdWZ[i]))), betaMax: r6(S.inertialDragIsqBetaMax), negMax: r6(S.inertialDragIsqNegMax),
      rotADr: vr(Array.from(S.rotADr.subarray(0, n))), why: S.inertialDragWhy || null });
  }
  return { rows, books, oldSource: old ? 'tests/out/bevel-w308a.json(第308便a の正本 —— P.terms の diffPair)' : null };
}

// 第320便d(決断事項 AN477・AN462・R265): 後に入った本の名指しの除外の集合(第318便 —— 🗺️)を**宣言の条件**へ。K1 の規則の宣言の本(relativeDrag.invSq.rdRule ——
//   在位の 7 本は pinDecl315c で移行の前の写しへ戻すので、写しの無い K1 の短い形で生まれた本だけが当たる)は dragCore の既定の候補の外に置く
//   (受理器の規則「dragCoreDefault は rdRule と一緒に宣言しない」—— 候補の写しが受理されない)。外した本は段 D の ruleBooks に数える(既存の欄と値は不変)
const isRuleBookW320 = (p) => { const r = p && p.physics && p.physics.relativeDrag; return !!(r && r.invSq && r.invSq.rdRule); };
/* ───────── 段 D(dragCore の既定の数え上げ)───────── */
function partD(H, quick) {
  const HP = H.HP, all = HP.allPresets(), retired = E(H, 'retiredOf'), cand = [], ruleBooks = [];
  for (const p of all) {
    const rd = p.physics && p.physics.relativeDrag;
    if (!rd || rd.law !== 'inertial' || !p.scaleExp || !Number.isFinite(p.scaleExp.L)) continue;
    if (isRuleBookW320(p)) { ruleBooks.push(p.id); continue; }   // 第320便d(AN477): K1 の規則の宣言の本は候補の外(数える —— ruleBooks)
    const en = E(H, 'relDragEnabledOf')(rd);
    p.bodies.forEach((b, i) => {
      if (b.type !== 'single' || !(b.m > 0) || !(b.radius > 0) || b.dragCore) return;
      const d = L.defaultCoreRadius(b.radius, p.scaleExp.L);
      if (d.clamped) cand.push({ id: p.id, emoji: p.emoji || null, index: i, retired: retired(p), enabled: en, coord: p.physics.coord || '2d', RSI: r6(d.RSI), RdOverR2: r6(d.ratio2),
        readsRadius: !!(rd.spinDrag || rd.spinSource || (rd.inertialR2 && rd.inertialR2.self === 'radius')) });
    });
  }
  const live = cand.filter((r) => !r.retired && r.enabled), books = [...new Set(live.map((r) => r.id))];
  const allEn = cand.filter((r) => r.enabled), booksAllEn = [...new Set(allEn.map((r) => r.id))];
  // 旧則のまま dragCoreDefault を足した写しの走行(在位で有効な本 —— 宣言半径を読む項が無ければビット同一)
  const runs = [], K = quick ? 5 : 30;
  for (const id of books) {
    const base = presetOf(HP, id), withD = presetOf(HP, id); withD.physics.relativeDrag.dragCoreDefault = 'cap6500km';
    const a = build(H, base), b = build(H, withD);
    for (let k = 0; k < K; k++) { a.S.step(a.dt); b.S.step(b.dt); }
    const keys = ['x', 'y', 'vx', 'vy', 'spin', ...(a.S.coord3d === true ? ['z', 'vz'] : [])];
    const same = keys.every((k) => Buffer.from(Float64Array.from(a.S[k].subarray(0, a.S.n)).buffer).equals(Buffer.from(Float64Array.from(b.S[k].subarray(0, b.S.n)).buffer)));
    runs.push({ id, steps: K, bitSame: same, readsRadius: live.some((r) => r.id === id && r.readsRadius) });
  }
  // 回転/軸の引きずりを足した写し(旧則・bevel): 既定の半径の有無で惑星の ω_D と回転の u の比(太陽 R_d² の比 ≈ 8.75×10⁻⁵)
  const ratios = [];
  for (const id of ['venusSunInertial3d', 'jupiterSunInertial3d']) {
    const mk = (def) => { const q = presetOf(HP, id); q.physics.relativeDrag.spinDrag = { rot: 'surfaceFlip', axial: 'on', axialModel: 'bevel' }; if (def) q.physics.relativeDrag.dragCoreDefault = 'cap6500km'; return q; };
    const a = build(H, mk(false)), b = build(H, mk(true));
    for (let k = 0; k < 2; k++) { a.S.step(a.dt); b.S.step(b.dt); }
    const w = (S) => Math.hypot(S._rdWX[1], S._rdWY[1], S._rdWZ[1]), RA = E(H, 'dragCoreDefaultState')(b.S);
    const sun = RA.rows.find((r) => r.i === 0);
    ratios.push({ id, planetOmegaRatio: r6(w(b.S) / w(a.S)), sunRd2Ratio: r6((sun.Rd / sun.R) ** 2), rotDrop: r6(b.S.inertialDrag3RotMax / a.S.inertialDrag3RotMax) });
  }
  // 旧則の回転引きずりの M1(inertialSpinMoment —— 外部の級数を使わない今の式)を既定の半径で読むときの桁落ち: 惑星の距離 r の近く(相対 2×10⁻⁴ の幅・200 点)で
  //   外部の級数 inertialSpinMomentFar(第308便a —— 独立な求積と 2.04e-13)との相対の差の最大(宣言半径 R と既定の半径 R_d)
  const M1 = E(H, 'inertialSpinMoment'), M1far = E(H, 'inertialSpinMomentFar'), GL = E(H, 'dfmGaussLegendre01')(E(H, 'REL_DRAG_SPIN_NODES')), oldM1 = [];
  for (const id of ['venusSunInertial3d', 'jupiterSunInertial3d']) {
    const p = presetOf(HP, id), eps = p.physics.relativeDrag.eps, b = p.bodies, r0 = Math.hypot(b[1].x - b[0].x, b[1].y - b[0].y, (b[1].z || 0) - (b[0].z || 0));
    for (const [which, R] of [['R', b[0].radius], ['Rd', L.defaultCoreRadius(b[0].radius, p.scaleExp.L).Rd]]) {
      let mx = 0;
      for (let k = 0; k < 200; k++) { const r = r0 * (1 + k * 1e-6), f = M1far(r, R, eps); mx = Math.max(mx, Math.abs(M1(r, R, eps, GL) / f.M1 - 1)); }
      oldM1.push({ id, source: 'Sun', which, rOverR: r6(r0 / R), eps, maxRelVsFar: r6(mx) });
    }
  }
  return { ruleBooks, ruleBooksWhy: 'K1 の規則の宣言(relativeDrag.invSq.rdRule)の本 —— dragCoreDefault は rdRule と一緒に宣言しない(第320便d・AN477)', capM: CAP, candidates: cand, liveBooks: books, liveRecords: live.length, enabledBooksInclRetired: booksAllEn.length, enabledRecordsInclRetired: allEn.length,
    allBooks: [...new Set(cand.map((r) => r.id))].length, allRecords: cand.length, runs, oldLawRatios: ratios, oldRotM1: oldM1 };
}

/* ───────── 段 G(受理・enabled:false・チェックポイント)───────── */
function partG(H) {
  const HP = H.HP, base = () => invSqCopy(HP, 'jupiterSunInertial3d'), out = [];
  const tryV = (name, mut, expectOk, why) => { const q = base(); mut(q); const v = HP.validatePreset(q), err = v.ok ? null : String((v.errors || [])[0] || ''); out.push({ name, ok: v.ok, expectOk, pass: v.ok === expectOk && (!why || why.test(err || '')), err: err === null ? null : err.slice(0, 140) }); return v; };
  const v0 = tryV('正準形', () => {}, true);
  const canon = v0.ok ? v0.preset.physics.relativeDrag : null;
  tryV('Wbg と一緒', (q) => { q.physics.relativeDrag.Wbg = 1e-19; }, false);
  tryV('inertialR2 と一緒', (q) => { q.physics.relativeDrag.inertialR2 = { lambdaRs: 5 }; }, false);
  tryV('eps と一緒', (q) => { q.physics.relativeDrag.eps = 0.05; }, false);
  tryV('未知の鍵', (q) => { q.physics.relativeDrag.invSq.foo = 1; }, false);
  tryV('次数 1', (q) => { q.physics.relativeDrag.invSq.order = 1; }, false);
  tryV('次数 25', (q) => { q.physics.relativeDrag.invSq.order = 25; }, false);
  tryV('Wbg2 負', (q) => { q.physics.relativeDrag.invSq.Wbg2 = -1; }, false);
  // 第310便a(AN378): 版 w310a-invsq-wbg0-1 から Wbg2 は 0 だけ —— 正は版 w309a-invsq-1 の html でだけ受理(正本の中身の invSqVersion で世代が分かる)
  tryV('Wbg2 正', (q) => { q.physics.relativeDrag.invSq.Wbg2 = 3; }, E(H, 'REL_DRAG_INVSQ_VERSION') === 'w309a-invsq-1');
  tryV('sphere の核', (q) => { q.physics.relativeDrag.spinDrag.axialModel = 'sphere'; }, false);
  tryV('速さの型', (q) => { q.physics.relativeDrag.spinDrag.axialNorm = 'speed'; }, false);
  tryV('rigid の步', (q) => { q.physics.relativeDrag.spinDrag.rotStep = 'rigid'; }, false);
  tryV('二次元の本', (q) => { q.physics.coord = '2d'; delete q.physics.gLoc; delete q.physics.relativeDrag.spinDrag; q.bodies.forEach((b) => { b.z = 0; b.vz = 0; delete b.spinAxis; }); }, false, /invSq は三次元の本/);
  tryV('dragCore の殻', (q) => { q.bodies[0].dragCore = { shellRatio: 0.01 }; }, false);
  tryV('dragCore の一様球', (q) => { q.bodies[0].dragCore = { massFrac: 1, radius: 0.0065 }; }, true);
  tryV('既定の名前の誤り', (q) => { q.physics.relativeDrag.dragCoreDefault = 'cap1'; }, false);
  tryV('scaleExp の無い本の既定', (q) => { delete q.scaleExp; }, false);
  tryV('axisHold(維持 —— 枝 b の鍵)と一緒', (q) => { q.physics.relativeDrag.spinDrag.axisHold = { tauC: 1e9 }; }, true);
  // enabled:false の走りは旧則の未推定の OFF {Wbg:null, enabled:false}(引きずり無し)の走りと同じ(位置・速度・自転)
  const K = 20, off = base(); off.physics.relativeDrag.enabled = false;
  const none = presetOf(HP, 'jupiterSunInertial3d'); none.physics.relativeDrag = { law: 'inertial', Wbg: null, enabled: false, eps: none.physics.relativeDrag.eps };   // 旧則の未推定の OFF(引きずり無し)
  const a = build(H, off), b = build(H, none);
  for (let k = 0; k < K; k++) { a.S.step(a.dt); b.S.step(b.dt); }
  const eq = (S1, S2, k) => Buffer.from(Float64Array.from(S1[k].subarray(0, S1.n)).buffer).equals(Buffer.from(Float64Array.from(S2[k].subarray(0, S2.n)).buffer));
  const offSame = ['x', 'y', 'z', 'vx', 'vy', 'vz', 'spin'].every((k) => eq(a.S, b.S, k));
  // チェックポイント(ckSnapOne → 走る → ckRestoreOne → 同じ步数 —— 位置・速度・帳簿が同じ)
  const ck = (() => {
    const snap = E(H, 'ckSnapOne'), rest = E(H, 'ckRestoreOne'), c = build(H, base()), S = c.S;
    for (let k = 0; k < 5; k++) S.step(c.dt);
    const o = snap(S);
    for (let k = 0; k < 7; k++) S.step(c.dt);
    const A = { x: Array.from(S.x.subarray(0, S.n)), vx: Array.from(S.vx.subarray(0, S.n)), rotA: Array.from(S.rotA.subarray(0, S.n)), N: S.inertialDragIsqN, neg: S.inertialDragIsqNeg, beta: S.inertialDragIsqBetaMax };
    rest(S, o);
    for (let k = 0; k < 7; k++) S.step(c.dt);
    const B2 = { x: Array.from(S.x.subarray(0, S.n)), vx: Array.from(S.vx.subarray(0, S.n)), rotA: Array.from(S.rotA.subarray(0, S.n)), N: S.inertialDragIsqN, neg: S.inertialDragIsqNeg, beta: S.inertialDragIsqBetaMax };
    return { same: JSON.stringify(A) === JSON.stringify(B2) };
  })();
  return { cases: out, canonical: canon, enabledFalseSameAsOldOff: offSame, checkpoint: ck, allPass: out.every((r) => r.pass) };
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  return {
    kernelClosedVsQuadrature: J.Q.maxLibVsQuad < 1e-11,
    kernelEngineVsLib: J.Q.maxEngVsLib < 1e-12,
    kernelDerivVsQuadrature: J.Q.maxDerivVsQuad < 1e-7,
    selfCenter3overR2: Math.abs(J.Q.centerOverTheory - 1) < 1e-14 && Math.abs(J.Q.surfaceOverTheory - 1) < 1e-10,
    selfDoubleMean9over4: Math.abs(J.Q.doubleMean[J.Q.doubleMean.length - 1].overTheory - 1) < 1e-9,
    interiorShellQuad: J.Q.inn.every((r) => Math.abs(r.libVsShellQuad) < 1e-6 && Math.abs(r.engVsLibK) < 1e-13),
    m2FarLead: Math.abs(J.Q.ext.find((r) => r.rOverR === 1e6).M2lead - 1) < 1e-9,
    pointEngineVsLib: J.P.maxW < 1e-12 && J.P.maxBeta < 1e-12 && J.P.maxRot < 1e-12 && J.P.maxAmpAnalytic < 1e-9,
    pointAmpNumeric: J.P.maxAmpNumeric < 1e-4,
    meanEngineVsLib: J.A.maxEngVsLib < 1e-12,
    sweepEngineVsLib: J.E.maxBeta < 1e-12 && J.E.maxRot < 1e-11 && J.E.maxOmega < 1e-9,
    stepUMatchesLib: J.E.step.uRel.every((x) => x < 1e-9) && J.E.step.omegaRel.every((x) => x < 1e-9),
    thirdBodyChangesBeta: J.T.jupiterFromSunRatioMinus1 !== 0,
    booksFinite: J.B.books.every((b) => b.finite && b.why === null),
    defaultCensusLive: J.D.liveRecords > 0,
    oldLawLiveBitSame: J.D.runs.every((r) => r.bitSame === !r.readsRadius),
    oldLawRd2: J.D.oldLawRatios.every((r) => Math.abs(r.planetOmegaRatio / r.sunRd2Ratio - 1) < 0.05),
    acceptance: J.G.allPass,
    enabledFalseSame: J.G.enabledFalseSameAsOldOff,
    checkpointSame: J.G.checkpoint.same,
  };
}

/* ───────── 文書の表と数(PHYSICS〔第309便a〕—— QA docs.invSq309 が正本から作り直して逐語で照合する)───────── */
const e2s = (v) => (v === null || v === undefined) ? '—' : Number(v).toExponential(2);
const f3 = (v) => (v === null || v === undefined) ? '—' : Number(v).toFixed(3);
export function physicsTables(J) {
  const out = [];
  out.push('| 照合 | 値 |', '|---|---|');
  out.push(`| 閉じた式/級数と源の球の直接の 3 次元の求積(r/R 1.5〜10³ —— K2・M2)の相対の差の最大 | ${e2s(J.Q.maxLibVsQuad)} |`);
  out.push(`| エンジンの K2・M2・導関数と lib の閉じた式の相対の差の最大 | ${e2s(J.Q.maxEngVsLib)} |`);
  out.push(`| エンジンの dK2/dr・dM2/dr と求積の数値の微分の相対の差の最大(r/R 1.5〜10³) | ${e2s(J.Q.maxDerivVsQuad)} |`);
  for (const n of [8, 16]) { const d = J.Q.doubleMean.find((x) => x.order === n); out.push(`| 自己の二重体積平均 / (9/(4R²)) − 1(受け手の規則の次数 ${n}・${d.nodes} 点) | ${e2s(d.overTheory - 1)} |`); }
  const sv = J.A.rows.find((x) => x.config === 'SV' && x.recv === 'Venus');
  out.push(`| 比の平均と平均の比の差 ⟨N⟩/⟨W⟩ ÷ ⟨N/W⟩ − 1(金星 ← 太陽) | ${e2s(sv.ratioOfMeansMinus1)} |`);
  out.push(`| 中心の値と体積平均の差 (N/W)(中心) ÷ ⟨N/W⟩ − 1(金星 ← 太陽) | ${e2s(sv.centerMinus1)} |`);
  out.push(`| 第三体(イオ)の有無で木星 ← 太陽の β が変わる比 β₃/β₂ − 1 | ${e2s(J.T.jupiterFromSunRatioMinus1)} |`);
  out.push(`| 点のエンジンと lib(W・β・回転の係数・軸の amp)の相対の差の最大 | ${e2s(Math.max(J.P.maxW, J.P.maxBeta, J.P.maxRot, J.P.maxAmpAnalytic))} |`);
  out.push(`| 配置の走査 ${J.E.rows.length} 通りのエンジンと lib(β・回転・ω)の相対の差の最大 | ${e2s(Math.max(J.E.maxBeta, J.E.maxRot, J.E.maxOmega))} |`);
  out.push(`| 木星の写しの 1 步の u と lib の連立の解の相対の差の最大 | ${e2s(Math.max(...J.E.step.uRel))} |`);
  out.push('', '| 天体の写し(W_bg′ = 0・既定の半径) | 源 | β | ω_D·â/ω_obs(新則) | 負の点の割合 | 旧則の bevel 差分の型・対ごと(第308便a) |', '|---|---|---|---|---|---|');
  for (const [key, recv, src] of [['SV', 'Venus', 'Sun'], ['SJ', 'Jupiter', 'Sun'], ['JIo', 'Io', 'Jupiter'], ['SJIo', 'Io', 'Jupiter'], ['SJIo', 'Jupiter', 'Sun']]) {
    const r = J.B.rows.find((x) => x.config === key && x.recv === recv && x.src === src);
    out.push(`| ${recv}(${key}) | ${src} | ${e2s(r.beta)} | ${e2s(r.omegaAxialOverObs)} | ${f3(r.negFrac)} | ${e2s(r.oldBevelDiffPair)} |`);
  }
  out.push('', '| 天体の写し | 受け手 | Σβ | ‖u‖/‖v‖ |', '|---|---|---|---|');
  for (const [key, recv] of [['SV', 'Venus'], ['SJ', 'Jupiter'], ['JIo', 'Io'], ['SJIo', 'Io']]) {
    const r = J.B.rows.find((x) => x.config === key && x.recv === recv && x.src === '(合計)');
    out.push(`| ${key} | ${recv} | ${e2s(r.betaSum)} | ${e2s(r.uOverV)} |`);
  }
  out.push('', '| dragCore の既定(在位・有効) | 本 | レコード |', '|---|---|---|');
  out.push(`| 半径が変わる候補(単位あり・未宣言・R > 6.5×10⁶ m) | ${J.D.liveBooks.length} | ${J.D.liveRecords} |`);
  out.push(`| 旧則のまま既定を足した走行でビット同一 | ${J.D.runs.filter((r) => r.bitSame).length}/${J.D.runs.length} | — |`);
  return out.join('\n');
}
export function docNumbers(J) {
  return [e2s(J.Q.maxLibVsQuad), e2s(Math.max(J.E.maxBeta, J.E.maxRot, J.E.maxOmega)), String(J.D.liveBooks.length), String(J.D.liveRecords)];
}

export function runAll(H, o = {}) {
  const quick = !!o.quick, t = {};
  let t0 = Date.now();
  const { configs } = buildConfigs(H.HP, idsPlanets(H.HP));
  const tick = (k) => { t[k] = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now(); };
  const Q = partQ(H, quick); tick('Q');
  const P = partP(H, configs); tick('P');
  const A = partA(H, configs, quick); tick('A');
  const Er = partE(H, quick); tick('E');
  const T = partT(configs); tick('T');
  const B = partB(H, configs); tick('B');
  const D = partD(H, quick); tick('D');
  const G = partG(H); tick('G');
  const J = { quick, Q, P, A, E: Er, T, B, D, G };
  J.gates = gatesOf(J);
  J.ok = Object.values(J.gates).every(Boolean);
  J.timing = t;
  return J;
}

export async function main() {
  const TARGET = process.env.W309A_TARGET || 'beta/index.html';
  const OUT = process.env.W309A_OUT || path.join(ROOT, 'tests', 'out', 'invsq-w309a.json');
  const quick = process.env.W309A_QUICK === '1';
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now();
  const W281A_SCOPE = w281aScopeStamp(html, REGEN_SCOPE);
  const H = loadHtmlHeadless(html);
  pinDecl315c(H.evalExpr);   // 第315便c(AN406): 在位の 7 本の宣言を移行の前の写しへ(本ごとの門 —— 基点の html では no-op・正本の欄は足さない)
  const R = runAll(H, { quick });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w309a-invsq.mjs', target: TARGET,
    targetSha256: crypto.createHash('sha256').update(fs.readFileSync(html)).digest('hex'),
    ruling: '原仮定者の裁定(第103報)正確な引きずり(修正版)①球体による引きずり ②各引きずりは慣性決定力(質量に比例・距離の二乗に反比例)に比例しトータルの慣性決定力(背景・自分自身の体積平均を含む)で割る ③球の半径は dragCore の半径 ⑤回転は引きずる側の球の近い側と遠い側の移動の差分 ⑥軸は引きずられる側の球の近い側と遠い側の回転引きずりの差分 ⑦鏡映の向き ⑧軸方向で弱い・第104報 AN363(dragCore の既定)・決断事項 AN359・AN363・統括の検証項目 R218',
    invSqVersion: E(H, 'REL_DRAG_INVSQ_VERSION'), invSqLaw: E(H, 'REL_DRAG_INVSQ_LAW'), capVersion: E(H, 'DRAG_CORE_DEFAULT_VERSION'), ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w309a-invsq.mjs', 'tests/lib-w315c-legacy7.mjs', 'tests/lib-w309a-invsq.mjs', 'tests/lib-w307a-sphereaxial.mjs', 'tests/exp-w307c-spindecomp.mjs', 'tests/lib-w307c-spindecomp.mjs',
    'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第309便a', target: TARGET, code: CODE, inputs: [TARGET, LEGACY7_DATA_FILE, 'tests/out/bevel-w308a.json'] }), {
    harnessVersion: HARNESS_VERSION,
    engine: 'Node の headless(tests/lib-w279b-headless.mjs の loadHtmlHeadless —— html の本文をそのまま実行・1 プロセス)',
    notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s', JSON.stringify(out.timing));
}
if (IS_MAIN) await main();
