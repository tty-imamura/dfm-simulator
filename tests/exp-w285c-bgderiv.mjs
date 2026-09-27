// 第285便c(原仮定者の裁定(第75報)⑥「W₀・A₀ を設定することで gradW・gradA・dWdt・dAdt が算出できるか調査する」・
// 統括の検証項目 R99)—— **背景場の微分の算出可否と宣言の型 bgModel** の器。
//
// ■ 結論(機械で示す —— 数値はすべて本器の実測)
//   **1 点の (W₀, A₀) だけからは ∇W・∇A・∂ₜW・∂ₜA は一意に出ない**。出るのは次の宣言をしたときだけ:
//     (a) 一様・凍結の宣言(bgModel "uniform")—— 微分はすべて**宣言による 0**(算出ではない)。一様に流れる背景は A₀=W₀U で、
//         A₀=0 は「背景が静止する座標系」を選ぶ追加条件である。
//     (b) 背景源の台帳 (m,X,V,a)(bgModel "sources")—— p=2 の核で全 6 項を算出。∂ₜA には源の加速度 a が要る。
//     (c) 遠方の 1 源(bgModel "distantSource")—— (b) の特別な場合の閉じた式。
//
// ■ 何を測るか(Node だけ —— 対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読む)
//   (i)   反例: 同じ (W₀,A₀)=(0.5,(0,0)) を与える台帳 6 つ(源対 (±2,0) の速度 (0,±3) とその向きの反転・静止・1 源・呼吸・加速)で
//         ∇W・∇A・∂ₜW・∂ₜA が違う(html の `dfmComplexMomentsOf` と器の中の独立な実装 `momentsP2` を相対 1e-12 で照合)。
//   (ii)  一様・凍結の宣言: 受理器 bgModel "uniform" の微分は宣言による 0(A0=0 と、流れる背景 U で A0=W0·U)。
//         裏付け: 有限の環(N 個の等質量・半径 R)を一様速度 U で動かすと、中心で A₀=W₀U・∇W₀=∇A₀=∂ₜW₀=∂ₜA₀=0(丸め誤差まで)・
//         U で動く系へ移ると A₀′=A₀−W₀U=0(A₀=0 は座標系の条件)。中心を外すと ∇W₀≠0(一様は宣言であって有限の源の性質ではない)。
//   (iii) 背景源の台帳: 受理器 bgModel "sources" の 6 項が独立な実装と一致・源の加速度 a だけを変えると ∂ₜA₀ だけが Σ w_j Δa_j 動き
//         (他の 5 項はビット一致)・a の欠落は受理器が拒否。
//   (iv)  遠方 1 源の閉じた式(A₀=W₀V・∇W₀=−2W₀n/R・(∇A₀)_ab=V_a ∂_b W₀・∂ₜW₀=−∇W₀·V・∂ₜA₀=(∂ₜW₀)V+W₀a)が、
//         (iii) の台帳(源 m=W₀R² を評価点から −Rn に置く・ε=0)と相対 1e-12 で一致(html の `bgcDistantClosed` と器の式の両方)。
//   (v)   単位の検算: 台帳を質量 α・長さ β・時間 γ で拡大した写しで 6 項の指数を測り、`BG_COMPLEX_UNITS` の単位
//         (W₀ M/L²・A₀ M/(L·T) …)と一致。A₀/W₀ は速度 L/T。D₀=Σm/√(r²+ε²) は M/L で指数が違い、同じ D₀ で違う W₀ の台帳がある
//         → **D₀ から W₀ を換算しない**(受理器は D0 の鍵を拒否)。
//   (vi)  発散: 無限一様 3D の p=2 和(一様密度の球の中心)は半径に比例して増える(格子の和と閉じた式 4πρ(R−ε·atan(R/ε)))・
//         2D の一様円盤も対数で増える → **有限領域か境界モデルの宣言が要る**(受理器は domain "infinite" を拒否)。
//   表: 「与える情報 → 算出できるもの/不足するもの」(判定表)と、受理器の受理/拒否の事例。
//
// ■ しないこと・言わないこと
//   ・html の力学に触らない(本器は純関数と受理器だけを呼ぶ —— 1 步も走らせない)。💮🌚 の share 経路は未接続のまま
//     (接続の法則版は AN47 の後)。
//   ・「W₀・A₀ から微分が出る」「W₀ は D₀ から出せる」「新発見」と書かない。
//
// 実行(Node だけ・Chromium 不要・1 秒未満): node tests/exp-w285c-bgderiv.mjs
// 読む正本: なし(html だけ)。正本: tests/out/bgderiv-w285c.json(target=beta/index.html・領域 hash REGEN_SCOPE)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
// 第281便a(AN16・R71): **この器が読む html の領域**の宣言(1 行の JSON —— lint.regenScope が読む)
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
const REGEN_SCOPE = {"presets":[],"roots":["$","BG_COMPLEX_UNITS","HP.BGC_DERIV_VERSION","HP.BG_COMPLEX_UNITS","HP.bgcDerivation","HP.bgcDistantClosed","HP.dfmComplexMomentsOf","HP.dfmMeshVelocityFieldAt","HP.sim","HP.validateBackgroundComplex","HP.validatePreset","bgcDerivation","bgcDistantClosed","bgcModelDerive","cw","dfmComplexMomentsOf","isNum","validateBackgroundComplex"],"core":false,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w285c-bgderiv-1';
export const REL_TOL = 1e-12;
/** 6 成分の並びと単位の鍵(html の BG_COMPLEX_UNITS と同じ鍵)。 */
export const COMPONENTS = ['W0', 'A0', 'gradW', 'gradA', 'dWdt', 'dAdt'];
export const MOMENT_KEY = { W0: 'W', A0: 'A', gradW: 'gradW', gradA: 'gradA', dWdt: 'dWdt', dAdt: 'dAdt' };
export const SYM = { W0: 'W₀', A0: 'A₀', gradW: '∇W₀', gradA: '∇A₀', dWdt: '∂ₜW₀', dAdt: '∂ₜA₀' };
/** 表示の 4 語(+「宣言による 0」)—— UI の #bgcDerived と PHYSICS の表で同じ文字列。 */
export const WORDS = Object.freeze({ computed: '算出', declared: '宣言', declaredZero: '宣言による 0', undetermined: '未確定', unwired: '未接続', applied: '適用中' });

/** p=2 の複素モーメント(器の中の独立な実装 —— html の dfmComplexMomentsOf と同じ式を別に書く)。 */
export function momentsP2(list, px, py, eps2) {
  let W = 0, gWx = 0, gWy = 0, dW = 0, Ax = 0, Ay = 0, g0 = 0, g1 = 0, g2 = 0, g3 = 0, Tx = 0, Ty = 0;
  for (const b of list) {
    const rx = px - b.x, ry = py - b.y, s = rx * rx + ry * ry + eps2;
    if (!(s > 0)) return null;
    const w = b.m / s, k = -2 * b.m / (s * s), gx = k * rx, gy = k * ry;
    const vx = b.vx, vy = b.vy, dw = -(gx * vx + gy * vy);
    W += w; gWx += gx; gWy += gy; dW += dw; Ax += w * vx; Ay += w * vy;
    g0 += vx * gx; g1 += vx * gy; g2 += vy * gx; g3 += vy * gy;
    Tx += dw * vx + w * b.ax; Ty += dw * vy + w * b.ay;
  }
  return { W, A: [Ax, Ay], gradW: [gWx, gWy], gradA: [g0, g1, g2, g3], dWdt: dW, dAdt: [Tx, Ty] };
}
/** 遠方 1 源の閉じた式(器の中の独立な実装)。n=(cosθ, sinθ) は源 → 評価点。 */
export function distantClosed(W0, R, th, V, a) {
  const n = [Math.cos(th), Math.sin(th)], gW = [-2 * W0 * n[0] / R, -2 * W0 * n[1] / R];
  const dW = -(gW[0] * V[0] + gW[1] * V[1]);
  return { W: W0, A: [W0 * V[0], W0 * V[1]], gradW: gW, gradA: [V[0] * gW[0], V[0] * gW[1], V[1] * gW[0], V[1] * gW[1]], dWdt: dW,
    dAdt: [dW * V[0] + W0 * a[0], dW * V[1] + W0 * a[1]] };
}
const flat = (M) => [M.W].concat(M.A, M.gradW, M.gradA, [M.dWdt], M.dAdt);
const vecOf = (M, c) => { const v = M[MOMENT_KEY[c]]; return Array.isArray(v) ? v : [v]; };
/** 量ごとの相対差(成分の最大差 / 成分の最大絶対値 —— 0 に近い成分で割らない)。 */
export function qRel(a, b) {
  let d = 0, s = 0;
  for (let i = 0; i < a.length; i++) { d = Math.max(d, Math.abs(a[i] - b[i])); s = Math.max(s, Math.abs(a[i]), Math.abs(b[i])); }
  return d === 0 ? 0 : d / Math.max(s, 1e-300);
}
export function worstRel(M1, M2) { return COMPONENTS.reduce((m, c) => Math.max(m, qRel(vecOf(M1, c), vecOf(M2, c))), 0); }
const declToM = (d) => ({ W: d.W0, A: d.A0, gradW: d.gradW, gradA: d.gradA, dWdt: d.dWdt, dAdt: d.dAdt });

// ---- (i) 反例: 同じ (W₀,A₀)=(0.5,(0,0))
const src = (id, m, x, y, vx, vy, ax, ay) => ({ id, m, x, y, vx, vy, ax, ay });
export const SAME_W0A0 = { at: [0, 0], eps2: 0, W0: 0.5, A0: [0, 0], ledgers: [
  { key: 'pairUp', label: '源対 (±2,0)・速度 (0,±3)', list: [src('p', 1, 2, 0, 0, 3, 0, 0), src('q', 1, -2, 0, 0, -3, 0, 0)] },
  { key: 'pairDown', label: '同じ源対・速度の向きを反転 (0,∓3)', list: [src('p', 1, 2, 0, 0, -3, 0, 0), src('q', 1, -2, 0, 0, 3, 0, 0)] },
  { key: 'pairStatic', label: '同じ源対・静止', list: [src('p', 1, 2, 0, 0, 0, 0, 0), src('q', 1, -2, 0, 0, 0, 0, 0)] },
  { key: 'single', label: '1 源 m=2 を (2,0)・静止', list: [src('s', 2, 2, 0, 0, 0, 0, 0)] },
  { key: 'breathing', label: '源対 (±2,0)・速度 (±1,0)(離れていく)', list: [src('p', 1, 2, 0, 1, 0, 0, 0), src('q', 1, -2, 0, -1, 0, 0, 0)] },
  { key: 'pairAccel', label: '源対 (±2,0)・速度 (0,±3)・加速度 (0,1)(同じ向き)', list: [src('p', 1, 2, 0, 0, 3, 0, 1), src('q', 1, -2, 0, 0, -3, 0, 1)] }] };
export function counterexample(HP) {
  const CX = SAME_W0A0, rows = [];
  for (const L of CX.ledgers) {
    const h = HP.dfmComplexMomentsOf(L.list, CX.at[0], CX.at[1], CX.eps2), m = momentsP2(L.list, CX.at[0], CX.at[1], CX.eps2);
    rows.push({ key: L.key, label: L.label, html: h, mine: m, relHtml: worstRel(h, m),
      sameW0A0: h.W === CX.W0 && h.A[0] === CX.A0[0] && h.A[1] === CX.A0[1] });
  }
  const sig = (M) => JSON.stringify([M.gradW, M.gradA, M.dWdt, M.dAdt]);
  const distinct = new Set(rows.map((r) => sig(r.html))).size;
  const byQ = {};
  for (const c of ['gradW', 'gradA', 'dWdt', 'dAdt']) byQ[c] = new Set(rows.map((r) => JSON.stringify(vecOf(r.html, c)))).size;
  const up = rows.find((r) => r.key === 'pairUp'), dn = rows.find((r) => r.key === 'pairDown');
  return { at: CX.at, eps2: CX.eps2, W0: CX.W0, A0: CX.A0, rows, distinctDerivatives: distinct, distinctByQuantity: byQ,
    allSameW0A0: rows.every((r) => r.sameW0A0), worstRelHtml: rows.reduce((mx, r) => Math.max(mx, r.relHtml), 0),
    dAydx: { pairUp: up.html.gradA[2], pairDown: dn.html.gradA[2] },
    notAFunction: distinct === rows.length && rows.every((r) => r.sameW0A0) };
}

// ---- (ii) 一様・凍結の宣言
export const RING = { N: 64, m: 0.25, R: 10, eps2: 0.01, U: [0.3, -0.7], offset: 5 };
export const UNIFORM_DECLS = [
  { key: 'rest', decl: { background: 'declared', note: '第285便c 一様・凍結(背景が静止する系)', bgModel: 'uniform', domain: 'finite', W0: 0.5, A0: [0, 0] } },
  { key: 'flow', decl: { background: 'declared', note: '第285便c 一様に流れる背景', bgModel: 'uniform', domain: 'boundary', W0: 0.5, U: [0.3, -0.7] } }];
export function uniformChecks(HP) {
  const decls = UNIFORM_DECLS.map((u) => {
    const v = HP.validateBackgroundComplex(JSON.parse(JSON.stringify(u.decl)));
    const d = v.ok ? v.backgroundComplex : null;
    const der = d ? HP.bgcDerivation(d) : null;
    return { key: u.key, ok: v.ok, err: v.ok ? null : v.err, decl: d, derivation: der,
      derivZero: !!d && d.gradW.every((z) => z === 0) && d.gradA.every((z) => z === 0) && d.dWdt === 0 && d.dAdt.every((z) => z === 0),
      a0IsW0U: !!d && (u.decl.U ? (d.A0[0] === d.W0 * u.decl.U[0] && d.A0[1] === d.W0 * u.decl.U[1]) : (d.A0[0] === 0 && d.A0[1] === 0)),
      statusDeclaredZero: !!der && ['gradW', 'gradA', 'dWdt', 'dAdt'].every((k) => der[k] === 'declaredZero') };
  });
  // 有限の環を一様速度 U で動かす(中心で評価)
  const G = RING, list = [];
  for (let k = 0; k < G.N; k++) { const t = 2 * Math.PI * k / G.N; list.push(src('r' + k, G.m, G.R * Math.cos(t), G.R * Math.sin(t), G.U[0], G.U[1], 0, 0)); }
  const M = HP.dfmComplexMomentsOf(list, 0, 0, G.eps2), Mi = momentsP2(list, 0, 0, G.eps2);
  const Wexact = G.N * G.m / (G.R * G.R + G.eps2);
  // 無次元の残り(∇W₀·R/W₀・∇A₀·R/(W₀|U|)・∂ₜW₀·R/(W₀|U|)・|A₀−W₀U|/(W₀|U|))
  const Un = Math.hypot(G.U[0], G.U[1]);
  const res = { gradW: Math.hypot(M.gradW[0], M.gradW[1]) * G.R / M.W, gradA: Math.max(...M.gradA.map(Math.abs)) * G.R / (M.W * Un),
    dWdt: Math.abs(M.dWdt) * G.R / (M.W * Un), dAdt: Math.hypot(M.dAdt[0], M.dAdt[1]) * G.R * G.R / (M.W * Un * Un),
    A0minusW0U: Math.hypot(M.A[0] - M.W * G.U[0], M.A[1] - M.W * G.U[1]) / (M.W * Un) };
  // U で動く系へ(源の速度から U を引く)→ A₀′ = 0
  const listRest = list.map((b) => Object.assign({}, b, { vx: b.vx - G.U[0], vy: b.vy - G.U[1] }));
  const Mr = HP.dfmComplexMomentsOf(listRest, 0, 0, G.eps2);
  const Moff = HP.dfmComplexMomentsOf(list, G.offset, 0, G.eps2);
  const TOL_RES = 1e-12;
  return { decls, ring: { cfg: G, W: M.W, Wexact, relWexact: Math.abs(M.W - Wexact) / Wexact, relHtml: worstRel(M, Mi), residual: res,
    uniformAtCenter: Object.values(res).every((z) => z <= TOL_RES), restFrameA0: Mr.A, restFrameA0Zero: Math.hypot(Mr.A[0], Mr.A[1]) / (M.W * Un) <= TOL_RES,
    offCenterGradW: Moff.gradW, offCenterGradWNonZero: Math.hypot(Moff.gradW[0], Moff.gradW[1]) * G.R / Moff.W > 1e-3, tolResidual: TOL_RES },
    ok: decls.every((d) => d.ok && d.derivZero && d.a0IsW0U && d.statusDeclaredZero) };
}

// ---- (iii) 背景源の台帳
export const LEDGER3 = { at: [0.4, -0.3], eps: 0.5, list: [
  src('g1', 2.0, 5.0, 1.0, 0.3, -1.2, 0.01, -0.02), src('g2', 0.7, -3.0, 4.0, -0.8, 0.5, -0.03, 0.004), src('g3', 1.3, 1.5, -6.0, 1.1, 0.9, 0.002, 0.015)],
  dA: [[0.5, -0.25], [0, 0.125], [-0.375, 0]] };
export function sourcesChecks(HP) {
  const L = LEDGER3, e2 = L.eps * L.eps;
  const decl = { background: 'declared', note: '第285便c 背景源の台帳(明示天体と重複しない 3 源)', bgModel: 'sources', ledger: L.list, refPos: L.at, eps: L.eps };
  const v = HP.validateBackgroundComplex(JSON.parse(JSON.stringify(decl)));
  const d = v.ok ? v.backgroundComplex : null;
  const mine = momentsP2(L.list, L.at[0], L.at[1], e2);
  const html = HP.dfmComplexMomentsOf(L.list, L.at[0], L.at[1], e2);
  const relDecl = d ? worstRel(declToM(d), mine) : null;
  // 加速度だけを変える
  const list2 = L.list.map((b, j) => Object.assign({}, b, { ax: b.ax + L.dA[j][0], ay: b.ay + L.dA[j][1] }));
  const h2 = HP.dfmComplexMomentsOf(list2, L.at[0], L.at[1], e2);
  const five = ['W', 'A', 'gradW', 'gradA', 'dWdt'].every((k) => JSON.stringify(html[k]) === JSON.stringify(h2[k]));
  let px = 0, py = 0;
  for (let j = 0; j < L.list.length; j++) { const b = L.list[j], rx = L.at[0] - b.x, ry = L.at[1] - b.y, w = b.m / (rx * rx + ry * ry + e2); px += w * L.dA[j][0]; py += w * L.dA[j][1]; }
  const got = [h2.dAdt[0] - html.dAdt[0], h2.dAdt[1] - html.dAdt[1]];
  const relShift = qRel(got, [px, py]);
  // 加速度の欠落は拒否
  const noA = JSON.parse(JSON.stringify(decl)); delete noA.ledger[0].ax; delete noA.ledger[0].ay;
  const vr = HP.validateBackgroundComplex(noA);
  const der = d ? HP.bgcDerivation(d) : null;
  return { ok: v.ok, err: v.ok ? null : v.err, decl: d, mine, relDecl, relHtml: worstRel(html, mine),
    accelOnly: { dA: L.dA, fiveBitSame: five, dAdtShift: got, predicted: [px, py], relShift },
    missingAccelRejected: vr.ok === false, missingAccelErr: vr.err || null,
    allComputed: !!der && COMPONENTS.every((k) => der[k] === 'computed') };
}

// ---- (iv) 遠方 1 源
export const DISTANT_CASES = [
  { W0: 0.25, R: 2, th: 0.3, V: [0.3, -0.2], a: [0.01, 0.02] },
  { W0: 1.5e-3, R: 40, th: 2.1, V: [-1.1, 0.4], a: [0, -0.05] },
  { W0: 7.3e-6, R: 900, th: -1.2, V: [0.05, 2.5], a: [3e-4, 1e-4] },
  { W0: 4.2, R: 0.75, th: 4.0, V: [0, 0], a: [0.2, -0.1] }];
export const DISTANT_AT = [1.25, -0.5];
export function distantChecks(HP) {
  const rows = [];
  for (const c of DISTANT_CASES) {
    const n = [Math.cos(c.th), Math.sin(c.th)], m = c.W0 * c.R * c.R;
    const X = [DISTANT_AT[0] - c.R * n[0], DISTANT_AT[1] - c.R * n[1]];
    const led = [src('far', m, X[0], X[1], c.V[0], c.V[1], c.a[0], c.a[1])];
    const Ml = HP.dfmComplexMomentsOf(led, DISTANT_AT[0], DISTANT_AT[1], 0);
    const Mc = distantClosed(c.W0, c.R, c.th, c.V, c.a);
    const Hc = declToM(HP.bgcDistantClosed(c.W0, c.R, c.th, c.V, c.a));
    const v = HP.validateBackgroundComplex({ background: 'declared', note: '第285便c 遠方 1 源', bgModel: 'distantSource', W0: c.W0, Rbg: c.R, thetaBg: c.th, Vext: c.V, aExt: c.a });
    const Mv = v.ok ? declToM(v.backgroundComplex) : null;
    rows.push({ ...c, m, X, relLedger: worstRel(Mc, Ml), relHtmlClosed: worstRel(Mc, Hc), relValidator: Mv ? worstRel(Mc, Mv) : null, accepted: v.ok,
      closed: Mc });
  }
  const worst = rows.reduce((mx, r) => Math.max(mx, r.relLedger, r.relHtmlClosed, r.relValidator === null ? Infinity : r.relValidator), 0);
  return { at: DISTANT_AT, rows, worstRel: worst, ok: worst <= REL_TOL && rows.every((r) => r.accepted) };
}

// ---- (v) 単位
/** "M/L^2"・"M/(L·T)"・"M/(L^2·T)"・"M/(L·T^2)" → [eM, eL, eT] */
export function parseUnit(u) {
  const e = { M: 0, L: 0, T: 0 };
  const [num, den0] = u.split('/');
  const den = (den0 || '').replace(/[()]/g, '');
  const add = (part, sgn) => { for (const f of part.split('·')) { if (!f) continue; const [b, p] = f.split('^'); e[b] += sgn * (p ? Number(p) : 1); } };
  add(num, 1); add(den, -1);
  return [e.M, e.L, e.T];
}
export const UNIT_SCALE = { alpha: 3, beta: 5, gamma: 7 };
export function unitChecks(HP) {
  const L = LEDGER3, base = HP.dfmComplexMomentsOf(L.list, L.at[0], L.at[1], L.eps * L.eps);
  const scaled = (a, b, g) => HP.dfmComplexMomentsOf(L.list.map((s) => ({ m: a * s.m, x: b * s.x, y: b * s.y, vx: b / g * s.vx, vy: b / g * s.vy, ax: b / (g * g) * s.ax, ay: b / (g * g) * s.ay })),
    b * L.at[0], b * L.at[1], (b * L.eps) * (b * L.eps));
  const S = UNIT_SCALE;
  const Ms = [scaled(S.alpha, 1, 1), scaled(1, S.beta, 1), scaled(1, 1, S.gamma)], fac = [S.alpha, S.beta, S.gamma];
  const units = HP.BG_COMPLEX_UNITS, rows = [];
  for (const c of COMPONENTS) {
    const b0 = vecOf(base, c), exps = [];
    for (let k = 0; k < 3; k++) {
      const b1 = vecOf(Ms[k], c);
      let i = 0; for (let j = 1; j < b0.length; j++) if (Math.abs(b0[j]) > Math.abs(b0[i])) i = j;   // いちばん大きな成分で測る
      exps.push(Math.log(b1[i] / b0[i]) / Math.log(fac[k]));
    }
    const want = parseUnit(units[c]);
    rows.push({ key: c, sym: SYM[c], unit: units[c], want, measured: exps.map((z) => Math.round(z * 1e9) / 1e9), ok: exps.every((z, k) => Math.abs(z - want[k]) <= 1e-9) });
  }
  // A₀/W₀ は速度・D₀ は M/L
  const d0 = (list, p, e2) => list.reduce((s, b) => s + b.m / Math.sqrt((p[0] - b.x) ** 2 + (p[1] - b.y) ** 2 + e2), 0);
  const D0b = d0(L.list, L.at, L.eps * L.eps), D0beta = d0(L.list.map((s) => ({ m: s.m, x: S.beta * s.x, y: S.beta * s.y })), [S.beta * L.at[0], S.beta * L.at[1]], (S.beta * L.eps) ** 2);
  const eD0L = Math.log(D0beta / D0b) / Math.log(S.beta);
  const pair = [{ list: [{ m: 1, x: 1, y: 0 }], at: [0, 0] }, { list: [{ m: 2, x: 2, y: 0 }], at: [0, 0] }];
  const pr = pair.map((q) => ({ D0: d0(q.list, q.at, 0), W0: momentsP2(q.list.map((b) => ({ ...b, vx: 0, vy: 0, ax: 0, ay: 0 })), q.at[0], q.at[1], 0).W }));
  const vD = HP.validateBackgroundComplex({ background: 'declared', note: 'x', W0: 1, A0: [0, 0], gradW: [0, 0], gradA: [0, 0, 0, 0], dWdt: 0, dAdt: [0, 0], D0: 1 });
  return { scale: S, rows, ok: rows.every((r) => r.ok), velocityUnit: parseUnit(units.A0).map((z, k) => z - parseUnit(units.W0)[k]),
    D0: { unit: 'M/L', lengthExponent: Math.round(eD0L * 1e9) / 1e9, pair: pr, sameD0DifferentW0: pr[0].D0 === pr[1].D0 && pr[0].W0 !== pr[1].W0 },
    d0KeyRejected: vD.ok === false, d0KeyErr: vD.err || null };
}

// ---- (vi) 発散
export const UNIFORM3D = { rho: 1, h: 1, eps: 0.5, radii: [4, 8, 16, 32] };
export const UNIFORM2D = { sigma: 1, h: 0.5, eps: 0.5, radii: [8, 32, 128, 512] };
export function divergence(HP) {
  const c3 = UNIFORM3D, e2 = c3.eps * c3.eps, m3 = c3.rho * c3.h ** 3;
  const r3 = c3.radii.map((R) => { const K = Math.floor(R / c3.h); let W = 0, n = 0;
    for (let i = -K; i <= K; i++) for (let j = -K; j <= K; j++) for (let k = -K; k <= K; k++) {
      const x = i * c3.h, y = j * c3.h, z = k * c3.h, r2 = x * x + y * y + z * z; if (r2 > R * R) continue; n++; W += m3 / (r2 + e2); }
    return { R, n, W, Wclosed: 4 * Math.PI * c3.rho * (R - c3.eps * Math.atan(R / c3.eps)), WoverR: W / R }; });
  const c2 = UNIFORM2D, f2 = c2.eps * c2.eps, m2 = c2.sigma * c2.h * c2.h;
  const r2 = c2.radii.map((R) => { const K = Math.floor(R / c2.h); let W = 0, n = 0;
    for (let i = -K; i <= K; i++) for (let j = -K; j <= K; j++) { const x = i * c2.h, y = j * c2.h, q = x * x + y * y; if (q > R * R) continue; n++; W += m2 / (q + f2); }
    return { R, n, W, Wclosed: Math.PI * c2.sigma * Math.log(1 + R * R / f2) }; });
  const ratio3 = r3.slice(1).map((z, i) => z.W / r3[i].W), inc2 = r2.slice(1).map((z, i) => z.W - r2[i].W);
  const vInf = HP.validateBackgroundComplex({ background: 'declared', note: 'x', bgModel: 'uniform', domain: 'infinite', W0: 1, A0: [0, 0] });
  const vFin = HP.validateBackgroundComplex({ background: 'declared', note: 'x', bgModel: 'uniform', domain: 'finite', W0: 1, A0: [0, 0] });
  return { d3: { cfg: c3, rows: r3, ratios: ratio3, diverges: ratio3.every((r) => r > 1.8) },
    d2: { cfg: c2, rows: r2, increments: inc2, logSlope: inc2.map((d) => d / Math.log(4)), diverges: inc2.every((d) => d > 0.9 * 2 * Math.PI * c2.sigma * Math.log(4)) },
    infiniteRejected: vInf.ok === false, infiniteErr: vInf.err || null, finiteAccepted: vFin.ok === true };
}

// ---- 判定表と受理器の事例
/** 「与える情報 → 算出できるもの/不足するもの」(型・6 成分の由来の語)。 */
export function judgmentTable() {
  const W = WORDS, all = (w) => Object.fromEntries(COMPONENTS.map((c) => [c, w]));
  return [
    { given: '1 点の W₀・A₀ だけ', model: 'null', status: { W0: W.declared, A0: W.declared, gradW: W.undetermined, gradA: W.undetermined, dWdt: W.undetermined, dAdt: W.undetermined },
      computable: 'なし(W₀・A₀ は宣言の値)', missing: '∇W₀・∇A₀・∂ₜW₀・∂ₜA₀(同じ W₀・A₀ で違う値の台帳がある —— (i))' },
    { given: 'W₀・A₀ + 一様・凍結の宣言(有限領域/境界モデル)', model: 'uniform', status: { W0: W.declared, A0: W.declared, gradW: W.declaredZero, gradA: W.declaredZero, dWdt: W.declaredZero, dAdt: W.declaredZero },
      computable: '微分 4 つ = 宣言による 0(算出ではない)', missing: 'なし(A₀=0 は背景が静止する座標系の宣言・流れる背景は U で A₀=W₀U)' },
    { given: '背景源の台帳 (m, X, V) + 評価点 + ε(加速度なし)', model: '—(受理しない)', status: { W0: W.computed, A0: W.computed, gradW: W.computed, gradA: W.computed, dWdt: W.computed, dAdt: W.undetermined },
      computable: 'W₀・A₀・∇W₀・∇A₀・∂ₜW₀', missing: '∂ₜA₀(源の加速度 a が要る —— 受理器は a の欠落を拒否)' },
    { given: '背景源の台帳 (m, X, V, a) + 評価点 + ε', model: 'sources', status: all(W.computed), computable: '6 項すべて', missing: 'なし(明示天体と重複しない源・有限個)' },
    { given: '遠方 1 源 (W₀, R_bg, θ_bg, V, a)', model: 'distantSource', status: { W0: W.declared, A0: W.computed, gradW: W.computed, gradA: W.computed, dWdt: W.computed, dAdt: W.computed },
      computable: 'A₀・∇W₀・∇A₀・∂ₜW₀・∂ₜA₀(閉じた式 —— sources の特別な場合)', missing: 'なし(軟化を無視 R≫ε)' },
    { given: 'D₀ だけ', model: '—(受理しない)', status: all(W.undetermined), computable: 'なし(D₀ は M/L・W₀ は M/L² —— 換算しない)', missing: '6 項すべて' },
    { given: '無限一様 3D の背景', model: '—(受理しない)', status: all(W.undetermined), computable: 'なし(p=2 の和が半径に比例して発散)', missing: '有限領域か境界モデルの宣言' }];
}
/** 受理器の事例(期待と実際)。 */
export const VALIDATOR_CASES = [
  ['uniform・A0=0・finite', { background: 'declared', note: 'x', bgModel: 'uniform', domain: 'finite', W0: 0.5, A0: [0, 0] }, true],
  ['uniform・U(A0=W0·U)・boundary', { background: 'declared', note: 'x', bgModel: 'uniform', domain: 'boundary', W0: 0.5, U: [1, 2] }, true],
  ['uniform・domain なし', { background: 'declared', note: 'x', bgModel: 'uniform', W0: 0.5, A0: [0, 0] }, false],
  ['uniform・domain "infinite"(発散)', { background: 'declared', note: 'x', bgModel: 'uniform', domain: 'infinite', W0: 0.5, A0: [0, 0] }, false],
  ['uniform・A0 も U も無い', { background: 'declared', note: 'x', bgModel: 'uniform', domain: 'finite', W0: 0.5 }, false],
  ['uniform・gradW を 0 でない値で書く', { background: 'declared', note: 'x', bgModel: 'uniform', domain: 'finite', W0: 0.5, A0: [0, 0], gradW: [0.1, 0] }, false],
  ['uniform・A0 と U が矛盾', { background: 'declared', note: 'x', bgModel: 'uniform', domain: 'finite', W0: 0.5, U: [1, 2], A0: [0, 0] }, false],
  ['sources・源対', { background: 'declared', note: 'x', bgModel: 'sources', refPos: [0, 0], eps: 0, ledger: [src('p', 1, 2, 0, 0, 3, 0, 0), src('q', 1, -2, 0, 0, -3, 0, 0)] }, true],
  ['sources・加速度の欠落', { background: 'declared', note: 'x', bgModel: 'sources', refPos: [0, 0], eps: 0, ledger: [{ id: 'p', m: 1, x: 2, y: 0, vx: 0, vy: 3 }] }, false],
  ['sources・id "body:0"(明示天体と重複)', { background: 'declared', note: 'x', bgModel: 'sources', refPos: [0, 0], eps: 0, ledger: [src('body:0', 1, 2, 0, 0, 0, 0, 0)] }, false],
  ['sources・refPos なし', { background: 'declared', note: 'x', bgModel: 'sources', eps: 0, ledger: [src('p', 1, 2, 0, 0, 0, 0, 0)] }, false],
  ['sources・源が評価点の上(ε=0)', { background: 'declared', note: 'x', bgModel: 'sources', refPos: [2, 0], eps: 0, ledger: [src('p', 1, 2, 0, 0, 0, 0, 0)] }, false],
  ['sources・W0 を算出値と違う値で書く', { background: 'declared', note: 'x', bgModel: 'sources', refPos: [0, 0], eps: 0, W0: 1, ledger: [src('p', 1, 2, 0, 0, 0, 0, 0)] }, false],
  ['distantSource', { background: 'declared', note: 'x', bgModel: 'distantSource', W0: 0.25, Rbg: 2, thetaBg: 0.3, Vext: [0.3, -0.2], aExt: [0.01, 0.02] }, true],
  ['distantSource・aExt なし', { background: 'declared', note: 'x', bgModel: 'distantSource', W0: 0.25, Rbg: 2, thetaBg: 0.3, Vext: [0.3, -0.2] }, false],
  ['distantSource・Rbg=0', { background: 'declared', note: 'x', bgModel: 'distantSource', W0: 0.25, Rbg: 0, thetaBg: 0.3, Vext: [0, 0], aExt: [0, 0] }, false],
  ['null・W0 と A0 だけ(微分は未確定)', { background: 'declared', note: 'x', bgModel: null, W0: 0.5, A0: [0, 0] }, true],
  ['null・微分を書く', { background: 'declared', note: 'x', bgModel: null, W0: 0.5, A0: [0, 0], dWdt: 0 }, false],
  ['知らない型', { background: 'declared', note: 'x', bgModel: 'grid', W0: 0.5, A0: [0, 0] }, false],
  ['bgModel と background:"zero"', { background: 'zero', W0: 0, bgModel: 'uniform', domain: 'finite', A0: [0, 0] }, false],
  ['型の入力を bgModel なしで書く', { background: 'declared', note: 'x', W0: 0.5, A0: [0, 0], gradW: [0, 0], gradA: [0, 0, 0, 0], dWdt: 0, dAdt: [0, 0], domain: 'finite' }, false],
  ['D0 の鍵を中へ入れる', { background: 'declared', note: 'x', W0: 0.5, A0: [0, 0], gradW: [0, 0], gradA: [0, 0, 0, 0], dWdt: 0, dAdt: [0, 0], D0: 0.5 }, false],
  ['手入力(従来どおり 6 成分)', { background: 'declared', note: 'x', W0: 0.5, A0: [0, 0], gradW: [0, 0], gradA: [0, 0, 1.5, 0], dWdt: 0, dAdt: [0, 0] }, true]];
export function validatorCases(HP) {
  return VALIDATOR_CASES.map(([label, decl, want]) => {
    const v = HP.validateBackgroundComplex(JSON.parse(JSON.stringify(decl)));
    let idem = null;
    if (v.ok) { const v2 = HP.validateBackgroundComplex(JSON.parse(JSON.stringify(v.backgroundComplex))); idem = v2.ok && JSON.stringify(v2.backgroundComplex) === JSON.stringify(v.backgroundComplex); }
    return { label, want, got: v.ok, ok: v.ok === want && (idem === null || idem === true), idempotent: idem, err: v.ok ? null : v.err,
      derivation: v.ok ? HP.bgcDerivation(v.backgroundComplex) : null };
  });
}

const f6 = (x) => (Number.isFinite(x) ? Number(x.toPrecision(6)).toString() : '—');
const fv = (v) => (Array.isArray(v) ? '(' + v.map(f6).join(', ') + ')' : f6(v));
/** PHYSICS〔第285便c〕の表の行(QA docs.bgDerivatives が PHYSICS にあるかを照合する)。 */
export function docRows(J) {
  const out = { judgment: [], counter: [], distant: [], units: [], div3: [], div2: [] };
  for (const r of J.judgment) out.judgment.push(`| ${r.given} | ${r.model} | ${COMPONENTS.map((c) => r.status[c]).join(' / ')} | ${r.computable} | ${r.missing} |`);
  for (const r of J.counterexample.rows) out.counter.push(`| ${r.label} | ${f6(r.html.W)} | ${fv(r.html.A)} | ${fv(r.html.gradW)} | ${fv(r.html.gradA)} | ${f6(r.html.dWdt)} | ${fv(r.html.dAdt)} |`);
  for (const r of J.distant.rows) out.distant.push(`| ${f6(r.W0)} | ${f6(r.R)} | ${f6(r.th)} | ${fv(r.V)} | ${fv(r.a)} | ${r.relLedger.toExponential(1)} | ${r.relValidator.toExponential(1)} |`);
  for (const r of J.units.rows) out.units.push(`| ${r.sym} | ${r.unit} | (${r.want.join(', ')}) | (${r.measured.join(', ')}) |`);
  for (const r of J.divergence.d3.rows) out.div3.push(`| ${r.R} | ${r.n} | ${f6(r.W)} | ${f6(r.Wclosed)} | ${f6(r.WoverR)} |`);
  for (const r of J.divergence.d2.rows) out.div2.push(`| ${r.R} | ${r.n} | ${f6(r.W)} | ${f6(r.Wclosed)} |`);
  return out;
}

/** 全部の検算(QA が器の純関数で作り直して正本と照合する)。 */
export function computeAll(HP) {
  return { counterexample: counterexample(HP), uniform: uniformChecks(HP), sources: sourcesChecks(HP), distant: distantChecks(HP),
    units: unitChecks(HP), divergence: divergence(HP), judgment: judgmentTable(), validator: validatorCases(HP), words: WORDS,
    htmlVersion: HP.BGC_DERIV_VERSION };
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) {
  const TARGET = process.env.QA_TARGET || 'beta/index.html';
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const t0 = Date.now();
  const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
  const R = computeAll(HP);
  const C = R.counterexample;
  console.log(`(i) 反例: 同じ (W₀,A₀)=(${C.W0},[${C.A0}]) の台帳 ${C.rows.length} 個・微分の組は ${C.distinctDerivatives} 通り・∂A_y/∂x ${C.dAydx.pairUp} / ${C.dAydx.pairDown}・html と ${C.worstRelHtml.toExponential(1)}`);
  const U = R.uniform;
  console.log(`(ii) 一様: 宣言 ${U.decls.map((d) => d.key + ' ' + d.ok + '/' + d.derivZero + '/' + d.a0IsW0U).join('・')}・環の中心の残り ${Object.entries(U.ring.residual).map(([k, v]) => k + ' ' + v.toExponential(1)).join(' ')}・静止系 A₀′=0 ${U.ring.restFrameA0Zero}・中心外 ∇W₀≠0 ${U.ring.offCenterGradWNonZero}`);
  const S = R.sources;
  console.log(`(iii) 台帳: 受理 ${S.ok}・受理器と ${S.relDecl.toExponential(1)}・加速度だけ → 5 項ビット一致 ${S.accelOnly.fiveBitSame}・∂ₜA₀ の差 ${S.accelOnly.relShift.toExponential(1)}・a の欠落を拒否 ${S.missingAccelRejected}`);
  console.log(`(iv) 遠方 1 源: ${R.distant.rows.length} 例・最大相対差 ${R.distant.worstRel.toExponential(1)}`);
  console.log(`(v) 単位: ${R.units.rows.map((r) => r.key + ' ' + r.measured.join('/')).join(' · ')}・D₀ の長さ指数 ${R.units.D0.lengthExponent}・D0 鍵の拒否 ${R.units.d0KeyRejected}`);
  console.log(`(vi) 発散: 3D W₀/R ${R.divergence.d3.rows.map((z) => z.WoverR.toFixed(3)).join(' / ')}・2D の増分 ${R.divergence.d2.increments.map((z) => z.toFixed(3)).join(' / ')}・infinite 拒否 ${R.divergence.infiniteRejected}`);
  console.log(`受理器の事例 ${R.validator.filter((z) => z.ok).length}/${R.validator.length}`);
  const CODE = ['tests/exp-w285c-bgderiv.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  const meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第285便c', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, loadErrors: errors.length,
    ruling: '原仮定者の裁定(第75報)⑥: 背景複素決定力の W₀・A₀ を設定することで gradW・gradA・dWdt・dAdt が算出できるか調査する',
    reading: '統括の検証項目 R99: 1 点の (W₀,A₀) だけから微分は一意に出ない。出るのは一様・凍結の宣言(微分 0)・背景源の台帳 (m,X,V,a)・遠方 1 源(台帳の特別な場合)。W は M/L²・A は W×速度・D₀ から換算しない・無限一様 3D の p=2 和は発散',
    kernel: 'p=2(w=m/(r²+ε²) —— HP.dfmComplexMomentsOf と同じ)', relTol: REL_TOL,
    engine: 'Node の headless(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま vm で実行・1 步も走らせない)',
    notClaim: ['W₀・A₀ から微分が出る', 'W₀ は D₀ から出せる', '観測一致を達成した', '新発見'] });
  const out = { meta, ...R, elapsedS: (Date.now() - t0) / 1000 };
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  const outDir = path.join(ROOT, 'tests', 'out');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'bgderiv-w285c.json'), JSON.stringify(out, null, 1) + '\n');
  console.log('→ tests/out/bgderiv-w285c.json(' + out.elapsedS.toFixed(2) + ' s)');
}
