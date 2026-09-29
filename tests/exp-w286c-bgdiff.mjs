// 第286便c(原仮定者の裁定(第76報)・第76報で閉じた AN7′/AN47/AN56)—— **背景場の解析微分と有限差分の照合**・**背景の法則版
// (share-p1/complex-p2)の受理と接続の診断コピー**の器。
//
// ■ 何を測るか(Node だけ —— 対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読む)
//   (A) 解析微分 ↔ 中心差分(AN7′): 源台帳 (m,X,V,a) の複素モーメント(第285便c の式 —— p=2 は HP.dfmComplexMomentsOf、
//       p=1/2 の一般形は HP.dfmComplexMomentsP)の ∇W・∇A(空間の中心差分)と ∂ₜW・∂ₜA(源を X+Vt+½at² で動かした時間の中心差分)を、
//       幅 h・h/2・h/4 の 3 段で照合し、誤差と収束次数 log₂(e_h/e_{h/2}) を測る(中心差分の主次数は 2)。
//       合成 u=(A_loc+A_bg)/(W_loc+W_bg) の ∇u・∂ₜu(分母を含む商の微分 —— HP.dfmBlendComplexMoments)も同じ 3 段で照合する
//       (背景は凍結参照系のまわりの一次の値・時間は宣言した ∂ₜ で一次)。
//       事例: 等速源/加速源・遠方 1 源(閉じた式 ∇W₀=−pW₀n/R)・W→0(遠方の評価点 —— 相対誤差で測る)・W=0(源も背景も無い点は
//       u が未定義 = null であって 0 ではない)・並進基準系(速度 V で動く系の値: A′=A−WV・∇A′=∇A−V⊗∇W・∂ₜW′=∂ₜW+∇W·V・
//       ∂ₜA′=∂ₜA+(∇A)V−V∂ₜW′・u′=u−V・∇u′=∇u・∂ₜu′=∂ₜu+(∇u)V —— 相対 1e-12)。
//       **微分が合うことと力学が保存則を満たすことは別の試験**(下の (C) の帳簿)。
//   (B) 法則版の受理器と相互検査の事例(受理/拒否・冪等)・内蔵の宣言 0 本・p=2 の一般形 = dfmComplexMomentsOf(ビット一致)。
//   (C) 接続の診断コピー(**内蔵にはしない —— 器の中だけ**):
//       share-p1 … 💮 clusterAnalogyBH を縮めた写し(中心 1 + 恒星 40 + DR 10・centerSpin と spaceMesh.D0 を外す)に
//         背景なし(background:"zero")・共動一様背景(W_bg=D₀=1.5・A_bg=0)・遠方 1 源(p=1 の閉じた式)の 3 つを宣言して N 步。
//         背景なし ↔ 法則版なしで physics.D0=0 のトイ・共動一様 ↔ 法則版なしで D₀=1.5 のトイ(同じ式 —— 状態の一致を測る)・
//         法則版なしで同じ背景の値を書いた写し ↔ 背景なしの写し(未接続 = ビット一致)。帳簿: トイが粒子へ当てた Δp・ΔL・仕事と
//         メッシュ側の口座の和(厳密に 0)・真空規約の点の数・χ の範囲。
//       complex-p2 … 🔁 mercuryGeoToy3 の写しに法則版の鍵だけを足す(同じ経路 —— 2000 步のビット一致)・背景なし(真空規約 /
//         未定義の規約)・遠方 1 源(bgModel "distantSource"・源の速度 (2.3, 0.4)・加速度 (0, 0.01) —— 源の速度が一様背景と同じ
//         (2.3, 0) だと u=V が一様のまま ∇u=0 で状態は一様背景とビット一致する〔枝の実測〕ので、違う速度で接続を見る)の 3 つ。帳簿: 正準項の仕事 meshVelWork・未定義点・不正点。
//   (D) 旧記述の検算: geoPN=1 と「geoPN=2 ∧ kFrame=0」の 400 步の状態(自由な二体を含む 6 本 —— 同じ kF0 の EIH 経路に送られる)。
//
// ■ しないこと・言わないこと
//   ・html の力学に触らない(写しは器の中だけ)。内蔵に法則版を宣言しない。既定は未接続のまま。
//   ・「W₀・A₀ から微分が出る」「法則版で成立した」「新発見」と書かない。
//
// 実行(Node だけ・Chromium 不要): node tests/exp-w286c-bgdiff.mjs
// 読む正本: なし(html だけ)。正本: tests/out/bgdiff-w286c.json(target=beta/index.html・領域 hash REGEN_SCOPE)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
// 第281便a(AN16・R71): **この器が読む html の領域**の宣言(1 行の JSON —— lint.regenScope が読む)
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
const REGEN_SCOPE = {"presets":"all","roots":["$","DT","HP.BGC_LAW_UNITS","HP.BGC_LAW_VERSION_TAG","HP.allPresets","HP.bgcDistantClosed","HP.bgcWireState","HP.dfmBlendComplexMoments","HP.dfmComplexMomentsOf","HP.dfmComplexMomentsP","HP.dfmMeshVelocityFieldAt","HP.sim","HP.validateBackgroundComplex","HP.validatePreset","bgLawCrossCheck","bgLawPrepare","bgcLawCheck","dfmGeoToyBgLawStep","dfmMeshVelocityStep"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w286c-bgdiff-1';
export const REL_TOL = 1e-12;
export const DT = 0.016;
export const STEPS = { share: 200, mesh: 2000, geo12: 400 };
/** 中心差分の幅(3 段)。空間は評価点を動かす・時間は源を X+Vt+½at² で動かす。 */
export const H0 = { space: 0.02, time: 0.02 };
/** 収束次数の許容(中心差分の主次数 2 —— 丸め床に入った段は数えない)。 */
export const ORDER_WINDOW = [1.8, 2.2];

const src = (id, m, x, y, vx, vy, ax, ay) => ({ id, m, x, y, vx, vy, ax, ay });
const clone = (x) => JSON.parse(JSON.stringify(x));
const flatM = (M) => [M.W].concat(M.A, M.gradW, M.gradA, [M.dWdt], M.dAdt);
function relErr(a, b) { let d = 0, s = 0; for (let i = 0; i < a.length; i++) { d = Math.max(d, Math.abs(a[i] - b[i])); s = Math.max(s, Math.abs(a[i]), Math.abs(b[i])); } return d === 0 ? 0 : d / Math.max(s, 1e-300); }

/** 源を時間 t だけ進めた台帳(X+Vt+½at²・V+at・a)。 */
export function advance(list, t) { return list.map((b) => ({ ...b, x: b.x + b.vx * t + 0.5 * b.ax * t * t, y: b.y + b.vy * t + 0.5 * b.ay * t * t, vx: b.vx + b.ax * t, vy: b.vy + b.ay * t })); }

/** 事例(台帳・評価点・軟化・p)。 */
export const CASES = [
  { key: 'uniformVel', label: '等速源 3 個(a=0)', p: 2, at: [0.4, -0.3], eps: 0.5,
    list: [src('g1', 2.0, 5.0, 1.0, 0.3, -1.2, 0, 0), src('g2', 0.7, -3.0, 4.0, -0.8, 0.5, 0, 0), src('g3', 1.3, 1.5, -6.0, 1.1, 0.9, 0, 0)] },
  { key: 'accel', label: '加速源 3 個', p: 2, at: [0.4, -0.3], eps: 0.5,
    list: [src('g1', 2.0, 5.0, 1.0, 0.3, -1.2, 0.2, -0.4), src('g2', 0.7, -3.0, 4.0, -0.8, 0.5, -0.6, 0.08), src('g3', 1.3, 1.5, -6.0, 1.1, 0.9, 0.04, 0.3)] },
  { key: 'accelP1', label: '加速源 3 個(p=1 —— share の核)', p: 1, at: [0.4, -0.3], eps: 0.5,
    list: [src('g1', 2.0, 5.0, 1.0, 0.3, -1.2, 0.2, -0.4), src('g2', 0.7, -3.0, 4.0, -0.8, 0.5, -0.6, 0.08), src('g3', 1.3, 1.5, -6.0, 1.1, 0.9, 0.04, 0.3)] },
  { key: 'distant', label: '遠方 1 源(R=40・ε=0)', p: 2, at: [1.25, -0.5], eps: 0,
    list: [src('far', 2.4, 1.25 - 40 * Math.cos(2.1), -0.5 - 40 * Math.sin(2.1), -1.1, 0.4, 0, -0.05)] },
  { key: 'distantP1', label: '遠方 1 源(R=40・ε=0・p=1)', p: 1, at: [1.25, -0.5], eps: 0,
    list: [src('far', 2.4, 1.25 - 40 * Math.cos(2.1), -0.5 - 40 * Math.sin(2.1), -1.1, 0.4, 0, -0.05)] },
  { key: 'farW0', label: 'W→0(評価点が源から 10⁴ 離れる)', p: 2, at: [1.0e4, 0.7e4], eps: 0.5,
    list: [src('g1', 2.0, 5.0, 1.0, 0.3, -1.2, 0.2, -0.4), src('g2', 0.7, -3.0, 4.0, -0.8, 0.5, -0.6, 0.08)] }];

function momentsFor(HP, c, list, px, py) { return c.p === 2 ? HP.dfmComplexMomentsOf(list, px, py, c.eps * c.eps) : HP.dfmComplexMomentsP(list, px, py, c.eps * c.eps, c.p); }
/** 解析値と中心差分(3 段)。 */
export function derivCheck(HP, c) {
  const M = momentsFor(HP, c, c.list, c.at[0], c.at[1]);
  const steps = [];
  for (const k of [1, 2, 4]) {
    const hs = H0.space * (c.key === 'farW0' ? 1e3 : 1) / k, ht = H0.time / k;
    const Mx1 = momentsFor(HP, c, c.list, c.at[0] + hs, c.at[1]), Mx0 = momentsFor(HP, c, c.list, c.at[0] - hs, c.at[1]);
    const My1 = momentsFor(HP, c, c.list, c.at[0], c.at[1] + hs), My0 = momentsFor(HP, c, c.list, c.at[0], c.at[1] - hs);
    const Mt1 = momentsFor(HP, c, advance(c.list, ht), c.at[0], c.at[1]), Mt0 = momentsFor(HP, c, advance(c.list, -ht), c.at[0], c.at[1]);
    const fdGradW = [(Mx1.W - Mx0.W) / (2 * hs), (My1.W - My0.W) / (2 * hs)];
    const fdGradA = [(Mx1.A[0] - Mx0.A[0]) / (2 * hs), (My1.A[0] - My0.A[0]) / (2 * hs), (Mx1.A[1] - Mx0.A[1]) / (2 * hs), (My1.A[1] - My0.A[1]) / (2 * hs)];
    const fdDW = (Mt1.W - Mt0.W) / (2 * ht), fdDA = [(Mt1.A[0] - Mt0.A[0]) / (2 * ht), (Mt1.A[1] - Mt0.A[1]) / (2 * ht)];
    steps.push({ hSpace: hs, hTime: ht, err: { gradW: relErr(fdGradW, M.gradW), gradA: relErr(fdGradA, M.gradA), dWdt: relErr([fdDW], [M.dWdt]), dAdt: relErr(fdDA, M.dAdt) } });
  }
  const order = {};
  for (const q of ['gradW', 'gradA', 'dWdt', 'dAdt']) order[q] = [0, 1].map((i) => { const a = steps[i].err[q], b = steps[i + 1].err[q]; return (a > 0 && b > 0) ? Math.log2(a / b) : null; });
  const floor = 1e-8;   // 丸め床(この相対誤差より下の段は次数に数えない —— W→0 の時間差分)
  const ok = ['gradW', 'gradA', 'dWdt', 'dAdt'].every((q) => steps[2].err[q] <= 1e-4
    && order[q].every((o, i) => o === null || steps[i + 1].err[q] < floor || (o >= ORDER_WINDOW[0] && o <= ORDER_WINDOW[1])));
  return { key: c.key, label: c.label, p: c.p, at: c.at, eps: c.eps, W: M.W, steps, order, ok };
}

/** 遠方 1 源の閉じた式(p 一般 —— ∇W₀=−pW₀n/R)。p=2 は html の bgcDistantClosed と同じ。 */
export function distantClosedP(p, W0, R, th, V, a) {
  const n = [Math.cos(th), Math.sin(th)], gW = [-p * W0 * n[0] / R, -p * W0 * n[1] / R], dW = -(gW[0] * V[0] + gW[1] * V[1]);
  return { W0, A0: [W0 * V[0], W0 * V[1]], gradW: gW, gradA: [V[0] * gW[0], V[0] * gW[1], V[1] * gW[0], V[1] * gW[1]], dWdt: dW, dAdt: [dW * V[0] + W0 * a[0], dW * V[1] + W0 * a[1]] };
}
export function distantClosedCheck(HP) {
  const rows = [];
  for (const p of [1, 2]) {
    const W0 = 1.5e-3, R = 40, th = 2.1, V = [-1.1, 0.4], a = [0, -0.05], at = [1.25, -0.5];
    const m = W0 * Math.pow(R, p), X = [at[0] - R * Math.cos(th), at[1] - R * Math.sin(th)];
    const M = HP.dfmComplexMomentsP([src('far', m, X[0], X[1], V[0], V[1], a[0], a[1])], at[0], at[1], 0, p);
    const C = distantClosedP(p, W0, R, th, V, a);
    const rel = relErr(flatM(M), [C.W0].concat(C.A0, C.gradW, C.gradA, [C.dWdt], C.dAdt));
    const Hc = p === 2 ? HP.bgcDistantClosed(W0, R, th, V, a) : null;
    rows.push({ p, W0, R, th, V, a, rel, relHtmlP2: Hc ? relErr([Hc.W0].concat(Hc.A0, Hc.gradW, Hc.gradA, [Hc.dWdt], Hc.dAdt), [C.W0].concat(C.A0, C.gradW, C.gradA, [C.dWdt], C.dAdt)) : null });
  }
  return { rows, ok: rows.every((r) => r.rel <= REL_TOL && (r.relHtmlP2 === null || r.relHtmlP2 <= REL_TOL)) };
}

/** 合成 u の商の微分(∇u・∂ₜu)↔ u の中心差分。背景は O のまわりの一次・∂ₜ は宣言値で一次。 */
export const BLEND = { at: [0.4, -0.3], eps: 0.5, O: [0, 0],
  bg: { W: 0.8, A: [0.25, -0.4], gradW: [0.03, -0.02], gradA: [0.01, -0.005, 0.02, 0.004], dWdt: -0.015, dAdt: [0.006, -0.009] } };
function bgAt(B, x, y, t) { const dx = x - BLEND.O[0], dy = y - BLEND.O[1];
  return { W: B.W + B.gradW[0] * dx + B.gradW[1] * dy + B.dWdt * t, A: [B.A[0] + B.gradA[0] * dx + B.gradA[1] * dy + B.dAdt[0] * t, B.A[1] + B.gradA[2] * dx + B.gradA[3] * dy + B.dAdt[1] * t],
    gradW: B.gradW.slice(), gradA: B.gradA.slice(), dWdt: B.dWdt, dAdt: B.dAdt.slice() }; }
export function blendCheck(HP) {
  const out = [];
  for (const c of [CASES[1], CASES[2]]) {
    const uAt = (x, y, t) => { const L = momentsFor(HP, c, advance(c.list, t), x, y); L.selfExcluded = true; return HP.dfmBlendComplexMoments(L, bgAt(BLEND.bg, x, y, t)); };
    const F = uAt(BLEND.at[0], BLEND.at[1], 0);
    const steps = [];
    for (const k of [1, 2, 4]) {
      const h = H0.space / k;
      const x1 = uAt(BLEND.at[0] + h, BLEND.at[1], 0).u, x0 = uAt(BLEND.at[0] - h, BLEND.at[1], 0).u, y1 = uAt(BLEND.at[0], BLEND.at[1] + h, 0).u, y0 = uAt(BLEND.at[0], BLEND.at[1] - h, 0).u;
      const t1 = uAt(BLEND.at[0], BLEND.at[1], h).u, t0 = uAt(BLEND.at[0], BLEND.at[1], -h).u;
      const fdJ = [(x1[0] - x0[0]) / (2 * h), (y1[0] - y0[0]) / (2 * h), (x1[1] - x0[1]) / (2 * h), (y1[1] - y0[1]) / (2 * h)];
      const fdT = [(t1[0] - t0[0]) / (2 * h), (t1[1] - t0[1]) / (2 * h)];
      steps.push({ h, errGradU: relErr(fdJ, F.gradU), errDUdt: relErr(fdT, F.dUdt) });
    }
    const order = { gradU: [0, 1].map((i) => Math.log2(steps[i].errGradU / steps[i + 1].errGradU)), dUdt: [0, 1].map((i) => Math.log2(steps[i].errDUdt / steps[i + 1].errDUdt)) };
    const ok = steps[2].errGradU <= 1e-5 && steps[2].errDUdt <= 1e-5
      && [...order.gradU, ...order.dUdt].every((o) => o >= ORDER_WINDOW[0] && o <= ORDER_WINDOW[1]);
    out.push({ key: c.key, p: c.p, u: F.u, chi: F.chi, steps, order, ok });
  }
  // W=0: 源も背景も無い点(局所 null・背景 W=0)は未定義(u=null —— 0 ではない)
  const Z = HP.dfmBlendComplexMoments(null, { W: 0, A: [0, 0], gradW: [0, 0], gradA: [0, 0, 0, 0], dWdt: 0, dAdt: [0, 0] });
  // W→0: 遠方の点でも u は源の速度の重み付き平均(有限)で、商の微分の相対誤差は近くと同じ桁
  return { rows: out, wZero: { ok: Z.ok, defined: Z.defined, u: Z.u, why: Z.why || null }, ok: out.every((r) => r.ok) && Z.ok === true && Z.defined === false && Z.u === null };
}

/** 並進基準系(速度 V で動く系)の値の変換(相対 1e-12)。 */
export const BOOST_V = [0.7, -0.35];
export function boostCheck(HP) {
  const rows = [];
  for (const c of [CASES[1], CASES[2]]) {
    const V = BOOST_V, M = momentsFor(HP, c, c.list, c.at[0], c.at[1]);
    const Mp = momentsFor(HP, c, c.list.map((b) => ({ ...b, vx: b.vx - V[0], vy: b.vy - V[1] })), c.at[0], c.at[1]);
    const dWp = M.dWdt + M.gradW[0] * V[0] + M.gradW[1] * V[1];
    const pred = { W: M.W, A: [M.A[0] - M.W * V[0], M.A[1] - M.W * V[1]], gradW: M.gradW, gradA: [M.gradA[0] - V[0] * M.gradW[0], M.gradA[1] - V[0] * M.gradW[1], M.gradA[2] - V[1] * M.gradW[0], M.gradA[3] - V[1] * M.gradW[1]],
      dWdt: dWp, dAdt: [M.dAdt[0] + M.gradA[0] * V[0] + M.gradA[1] * V[1] - V[0] * dWp, M.dAdt[1] + M.gradA[2] * V[0] + M.gradA[3] * V[1] - V[1] * dWp] };
    const relM = relErr(flatM(Mp), flatM(pred));
    const L = { ...M, selfExcluded: true }, Lp = { ...Mp, selfExcluded: true };
    const F = HP.dfmBlendComplexMoments(L, null), Fp = HP.dfmBlendComplexMoments(Lp, null);
    const J = F.gradU;
    const relU = relErr(Fp.u, [F.u[0] - V[0], F.u[1] - V[1]]), relJ = relErr(Fp.gradU, J);
    const relT = relErr(Fp.dUdt, [F.dUdt[0] + J[0] * V[0] + J[1] * V[1], F.dUdt[1] + J[2] * V[0] + J[3] * V[1]]);
    rows.push({ key: c.key, p: c.p, V, relMoments: relM, relU, relGradU: relJ, relDUdt: relT });
  }
  return { rows, ok: rows.every((r) => Math.max(r.relMoments, r.relU, r.relGradU, r.relDUdt) <= 1e-12) };
}

// ---- (B) 法則版の受理器
const FRAME = { origin: 'barycenter', epoch: 't0', rotation: 'none', translation: 'comoving' };
export function lawDecl(HP, lv, extra) {
  return Object.assign({ background: 'declared', note: '第286便c 法則版の診断', W0: 1.5, A0: [0, 0], gradW: [0, 0], gradA: [0, 0, 0, 0], dWdt: 0, dAdt: [0, 0],
    sources: [{ id: 'bg:field', kind: 'field', excludedExplicit: true }], frame: clone(FRAME),
    lawVersion: lv, lawUnits: clone(HP.BGC_LAW_UNITS[lv]), lawDomainR: 1e6, lawWZero: 'vacuum' }, extra || {});
}
export function validatorCases(HP) {
  const base = (lv, extra) => lawDecl(HP, lv, extra);
  const drop = (o, k) => { const q = clone(o); delete q[k]; return q; };
  const C = [
    ['share-p1(単位・有限領域・真空規約・源の分割・凍結参照系)', base('share-p1'), true],
    ['complex-p2', base('complex-p2'), true],
    ['complex-p2・lawWZero "undefined"', base('complex-p2', { lawWZero: 'undefined' }), true],
    ['未知の lawVersion', base('share-p1', { lawVersion: 'p3' }), false],
    ['lawUnits なし', drop(base('share-p1'), 'lawUnits'), false],
    ['share-p1 に p=2 の単位', base('share-p1', { lawUnits: clone(HP.BGC_LAW_UNITS['complex-p2']) }), false],
    ['lawUnits に知らない鍵', base('complex-p2', { lawUnits: Object.assign(clone(HP.BGC_LAW_UNITS['complex-p2']), { D0: 'M/L' }) }), false],
    ['lawDomainR なし(無限領域)', drop(base('share-p1'), 'lawDomainR'), false],
    ['lawDomainR=0', base('share-p1', { lawDomainR: 0 }), false],
    ['lawWZero なし', drop(base('share-p1'), 'lawWZero'), false],
    ['lawWZero "zero"(u を 0 にする規約)', base('share-p1', { lawWZero: 'zero' }), false],
    ['sources なし(重複計上の宣言なし)', drop(base('share-p1'), 'sources'), false],
    ['frame なし(座標系の宣言なし)', drop(base('complex-p2'), 'frame'), false],
    ['share-p1 と bgModel "distantSource"(p=2 の核で算出)', drop(drop(drop(drop(drop(drop(base('share-p1', { bgModel: 'distantSource', W0: 0.25, Rbg: 2, thetaBg: 0.3, Vext: [0.3, -0.2], aExt: [0, 0] }), 'A0'), 'gradW'), 'gradA'), 'dWdt'), 'dAdt'), 'x'), false],
    ['complex-p2 と bgModel "distantSource"', drop(drop(drop(drop(drop(base('complex-p2', { bgModel: 'distantSource', W0: 0.25, Rbg: 2, thetaBg: 0.3, Vext: [0.3, -0.2], aExt: [0, 0] }), 'A0'), 'gradW'), 'gradA'), 'dWdt'), 'dAdt'), true],
    ['lawVersion と bgModel:null', drop(drop(drop(drop(base('complex-p2', { bgModel: null }), 'gradW'), 'gradA'), 'dWdt'), 'dAdt'), false],
    ['法則版の鍵だけ(lawVersion なし)', drop(base('share-p1'), 'lawVersion'), false],
    ['D0 の鍵を中へ(D₀ は別量)', base('share-p1', { D0: 1.5 }), false],
    ['背景なし(background "zero")+ share-p1', { background: 'zero', W0: 0, sources: [{ id: 'bg:none', kind: 'field', excludedExplicit: true }], frame: clone(FRAME), lawVersion: 'share-p1', lawUnits: clone(HP.BGC_LAW_UNITS['share-p1']), lawDomainR: 1e6, lawWZero: 'vacuum' }, true]];
  return C.map(([label, decl, want]) => {
    const v = HP.validateBackgroundComplex(clone(decl));
    let idem = null;
    if (v.ok) { const v2 = HP.validateBackgroundComplex(clone(v.backgroundComplex)); idem = v2.ok && JSON.stringify(v2.backgroundComplex) === JSON.stringify(v.backgroundComplex); }
    return { label, want, got: v.ok, idempotent: idem, ok: v.ok === want && idem !== false, err: v.ok ? null : v.err };
  });
}

// ---- (C) 接続の診断コピー
export const MINI = { stars: 40, dr: 10 };
export function miniCluster(HP) {
  const P = clone(HP.allPresets().find((q) => q.id === 'clusterAnalogyBH'));
  delete P.physics.spaceMesh.centerSpin; delete P.physics.spaceMesh.D0;
  // 第286便a の統合(統括): 💮 は R_drag(spaceMesh.dragR —— centerSpin:"read" の宇宙だけ)を宣言する。中心の自転を読まない写しでは受理器が拒否するので外す
  delete P.physics.spaceMesh.dragR;
  // 第286便a の統合(統括): 💮 は vMode:"jeans"(σ² の分母に W_bg=D₀ を読む)・D₀=0.15 になった。この診断は**法則版の経路**の照合であって
  //   初速の生成ではないので、写しは基点の vMode:"equilibrium"(D₀ を読まない)に戻し、D₀ は本器の宣言 W_bg=1.5 に合わせる(uniform の写しと同じ値)
  for (const b of P.bodies) if (b.vMode === 'jeans') { b.vMode = 'equilibrium'; delete b.jeansRot; delete b.angularSym; }
  P.physics.D0 = 1.5;
  P.bodies[1].n = MINI.stars; P.bodies[2].n = MINI.dr;
  P.id = 'w286cDiagShare'; P.name = '第286便c 診断コピー(💮 の縮小写し)';
  return P;
}
function runCopy(HP, p, N) {
  const v = HP.validatePreset(clone(p));
  if (!v.ok) return { ok: false, err: String(JSON.stringify(v.errors || v.err)).slice(0, 300) };
  HP.sim.build(v.preset); const S = HP.sim;
  const w0 = S.meshVelWork || 0;
  for (let k = 0; k < N; k++) S.step(DT);
  const st = []; for (let i = 0; i < S.n; i++) st.push(S.x[i], S.y[i], S.vx[i], S.vy[i]);
  return { ok: true, n: S.n, state: st, stop: S.geoToyStop || null, bgLaw: S.bgLaw ? { law: S.bgLaw.law || null, deny: S.bgLaw.deny || null } : null,
    bgLawSteps: S.bgLawSteps || 0, bgLawVacuum: S.bgLawVacuum || 0, chi: [S.bgLawChiMin, S.bgLawChiMax],
    toyP: [S.geoToyPx || 0, S.geoToyPy || 0], meshP: [S.geoToyMeshPx || 0, S.geoToyMeshPy || 0], toyL: S.geoToyL || 0, meshL: S.geoToyMeshL || 0,
    toyE: S.geoToyE || 0, meshE: S.geoToyEmesh || 0,
    meshVel: S.hasMeshVelocity ? { n: S.meshVelN, undef: S.meshVelUndef, bad: S.meshVelBad, work: S.meshVelWork - w0, uMax: S.meshVelUMax } : null,
    wire: HP.bgcWireState ? HP.bgcWireState(S) : null };
}
function stateDiff(a, b) { if (!a.ok || !b.ok || a.state.length !== b.state.length) return { same: false, maxRel: null };
  let d = 0; for (let i = 0; i < a.state.length; i++) d = Math.max(d, Math.abs(a.state[i] - b.state[i]) / Math.max(1e-12, Math.abs(a.state[i])));
  return { same: a.state.every((v, i) => Object.is(v, b.state[i])), maxRel: d }; }
const ledger = (r) => ({ pSum: Math.hypot(r.toyP[0] + r.meshP[0], r.toyP[1] + r.meshP[1]), pScale: Math.hypot(r.toyP[0], r.toyP[1]), lSum: Math.abs(r.toyL + r.meshL), eSum: Math.abs(r.toyE + r.meshE), toyE: r.toyE });
export function shareCopies(HP) {
  const N = STEPS.share, B = miniCluster(HP);
  const U = HP.BGC_LAW_UNITS['share-p1'];
  const dist = distantClosedP(1, 0.2, 400, 0.4, [0.05, -0.02], [0, 0]);
  const law = (bg) => Object.assign({ sources: [{ id: 'bg:diag', kind: 'field', excludedExplicit: true }], frame: clone(FRAME), lawVersion: 'share-p1', lawUnits: clone(U), lawDomainR: 1e6, lawWZero: 'vacuum' }, bg);
  const V = {
    none: law({ background: 'zero', W0: 0, note: '第286便c 背景なし' }),
    uniform: law({ background: 'declared', note: '第286便c 共動一様背景(W_bg=1.5・A_bg=0)', W0: 1.5, A0: [0, 0], gradW: [0, 0], gradA: [0, 0, 0, 0], dWdt: 0, dAdt: [0, 0] }),
    distant: law(Object.assign({ background: 'declared', note: '第286便c 遠方 1 源(p=1 の閉じた式・R=400)' }, { W0: dist.W0, A0: dist.A0, gradW: dist.gradW, gradA: dist.gradA, dWdt: dist.dWdt, dAdt: dist.dAdt })) };
  const mk = (bg, D0) => { const q = clone(B); if (bg) q.physics.backgroundComplex = bg; if (D0 !== undefined) q.physics.D0 = D0; return q; };
  const toyD0 = runCopy(HP, mk(null), N), toyZero = runCopy(HP, mk(null, 0), N);
  const rows = {};
  for (const k of Object.keys(V)) rows[k] = runCopy(HP, mk(V[k]), N);
  const unwiredDecl = clone(V.distant); for (const k of ['lawVersion', 'lawUnits', 'lawDomainR', 'lawWZero']) delete unwiredDecl[k];
  const unwired = runCopy(HP, mk(unwiredDecl), N);
  const cmp = { noneVsToyD0zero: stateDiff(rows.none, toyZero), uniformVsToyD0: stateDiff(rows.uniform, toyD0), distantVsUniform: stateDiff(rows.distant, rows.uniform),
    unwiredVsToyD0: stateDiff(unwired, toyD0) };
  const out = { steps: N, dt: DT, mini: MINI, n: toyD0.n, distantDecl: { W0: dist.W0, R: 400, theta: 0.4, V: [0.05, -0.02] }, compare: cmp, rows: {} };
  for (const k of Object.keys(rows)) { const r = rows[k]; out.rows[k] = r.ok ? { ok: true, stop: r.stop, law: r.bgLaw, steps: r.bgLawSteps, vacuum: r.bgLawVacuum, chi: r.chi, ledger: ledger(r), wire: r.wire } : { ok: false, err: r.err }; }
  out.unwired = { ok: unwired.ok, law: unwired.bgLaw, wire: unwired.wire };
  const books = Object.values(rows).every((r) => r.ok && r.stop === null && r.bgLawSteps === N && ledger(r).pSum <= 1e-12 * Math.max(1, ledger(r).pScale) && ledger(r).eSum <= 1e-12 * Math.max(1, Math.abs(ledger(r).toyE)));
  out.ok = books && cmp.unwiredVsToyD0.same && cmp.noneVsToyD0zero.maxRel !== null && cmp.noneVsToyD0zero.maxRel <= 1e-9 && cmp.uniformVsToyD0.maxRel <= 1e-9 && !cmp.distantVsUniform.same;
  return out;
}
export function meshCopies(HP) {
  const N = STEPS.mesh, P = clone(HP.allPresets().find((q) => q.id === 'mercuryGeoToy3'));
  const bc = P.physics.backgroundComplex, U = HP.BGC_LAW_UNITS['complex-p2'];
  const add = (b, wz) => Object.assign(clone(b), { lawVersion: 'complex-p2', lawUnits: clone(U), lawDomainR: 1e6, lawWZero: wz || 'vacuum' });
  const mk = (b) => { const q = clone(P); q.physics.backgroundComplex = b; return q; };
  const base = runCopy(HP, P, N);
  const same = runCopy(HP, mk(add(bc)), N);
  const zeroB = { background: 'zero', W0: 0, sources: bc.sources, frame: bc.frame };
  const noneV = runCopy(HP, mk(add(zeroB, 'vacuum')), N), noneU = runCopy(HP, mk(add(zeroB, 'undefined')), N);
  const dd = { background: 'declared', note: '第286便c 遠方 1 源(p=2・bgModel distantSource)', bgModel: 'distantSource', W0: bc.W0, Rbg: 1e4, thetaBg: 0.3, Vext: [bc.A0[0] / bc.W0, 0.4], aExt: [0, 0.01], sources: bc.sources, frame: bc.frame };
  const dist = runCopy(HP, mk(add(dd)), N);
  const row = (r) => r.ok ? { ok: true, meshVel: r.meshVel, wire: r.wire } : { ok: false, err: r.err };
  const out = { steps: N, dt: DT, base: row(base), sameLaw: row(same), noneVacuum: row(noneV), noneUndefined: row(noneU), distant: row(dist),
    compare: { sameVsBase: stateDiff(same, base), distantVsBase: stateDiff(dist, base) } };
  out.ok = out.compare.sameVsBase.same && noneV.ok && noneV.meshVel.undef > 0 && noneV.meshVel.bad === 0 && noneU.ok && noneU.meshVel.bad > 0 && noneU.meshVel.undef === 0
    && dist.ok && dist.meshVel.bad === 0 && !out.compare.distantVsBase.same;
  return out;
}

// ---- (D) geoPN=1 と geoPN=2 ∧ kFrame=0(第285便b 以降 —— kF0 の役割で同じ EIH 経路へ送られる)
export const GEO12_IDS = ['earthMoonReal', 'mercuryReal', 'plutoCharonDFM', 'alphaCenAB', 'siriusAB', 'psrDoubleAB'];
export function geo12(HP) {
  const rows = [];
  for (const id of GEO12_IDS) {
    const P = HP.allPresets().find((q) => q.id === id);
    const a = runCopy(HP, P, STEPS.geo12), q = clone(P); q.physics.geoPN = 2; const b = runCopy(HP, q, STEPS.geo12);
    const pinned = (P.bodies || []).some((z) => z.pinned);
    rows.push({ id, free: !pinned, kFrame: P.physics.kFrame, same: stateDiff(a, b).same });
  }
  return { steps: STEPS.geo12, rows, allSame: rows.every((r) => r.same) };
}

export function census(HP) {
  const declared = HP.allPresets().filter((p) => p.physics && p.physics.backgroundComplex && p.physics.backgroundComplex.lawVersion !== undefined).map((p) => p.id);
  // p=2 の一般形は dfmComplexMomentsOf とビット一致
  const c = CASES[1], a = HP.dfmComplexMomentsOf(c.list, c.at[0], c.at[1], c.eps * c.eps), b = HP.dfmComplexMomentsP(c.list, c.at[0], c.at[1], c.eps * c.eps, 2);
  return { nPresets: HP.allPresets().length, declared, p2BitSame: flatM(a).every((v, i) => Object.is(v, flatM(b)[i])) };
}

const f3 = (x) => (x === null || x === undefined) ? '—' : (x === 0 ? '0' : Number(x).toExponential(2));
const f2 = (x) => (x === null || x === undefined) ? '—' : Number(x).toFixed(2);
/** PHYSICS〔第286便c〕の表の行(QA docs が照合する)。 */
export function docRows(J) {
  const out = { deriv: [], blend: [], boost: [], law: [], share: [], mesh: [] };
  for (const r of J.deriv) out.deriv.push(`| ${r.label} | ${r.p} | ${['gradW', 'gradA', 'dWdt', 'dAdt'].map((q) => f3(r.steps[2].err[q])).join(' | ')} | ${['gradW', 'gradA', 'dWdt', 'dAdt'].map((q) => r.order[q].map(f2).join('/')).join(' | ')} |`);
  for (const r of J.blend.rows) out.blend.push(`| ${r.key} | ${r.p} | ${f3(r.steps[2].errGradU)} | ${f3(r.steps[2].errDUdt)} | ${r.order.gradU.map(f2).join('/')} | ${r.order.dUdt.map(f2).join('/')} |`);
  for (const r of J.boost.rows) out.boost.push(`| ${r.key} | ${r.p} | ${f3(r.relMoments)} | ${f3(r.relU)} | ${f3(r.relGradU)} | ${f3(r.relDUdt)} |`);
  for (const r of J.validator) out.law.push(`| ${r.label} | ${r.want ? '受理' : '拒否'} | ${r.got ? '受理' : '拒否'} |`);
  for (const k of Object.keys(J.share.rows)) { const r = J.share.rows[k]; out.share.push(`| ${k} | ${r.steps} | ${r.vacuum} | ${f3(r.chi[0])}〜${f3(r.chi[1])} | ${f3(r.ledger.pSum)} | ${f3(r.ledger.eSum)} | ${f3(r.ledger.toyE)} |`); }
  for (const k of ['base', 'sameLaw', 'noneVacuum', 'noneUndefined', 'distant']) { const r = J.mesh[k]; out.mesh.push(`| ${k} | ${r.meshVel.n} | ${r.meshVel.undef} | ${r.meshVel.bad} | ${f3(r.meshVel.work)} |`); }
  return out;
}

export function computeAll(HP) {
  return { deriv: CASES.map((c) => derivCheck(HP, c)), distant: distantClosedCheck(HP), blend: blendCheck(HP), boost: boostCheck(HP),
    validator: validatorCases(HP), census: census(HP), htmlVersion: HP.BGC_LAW_VERSION_TAG };
}
export function computeRuns(HP) { return { share: shareCopies(HP), mesh: meshCopies(HP), geo12: geo12(HP) }; }

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) {
  const TARGET = process.env.QA_TARGET || 'beta/index.html';
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const t0 = Date.now();
  const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
  const R = computeAll(HP);
  for (const d of R.deriv) console.log(`(A) ${d.key} p=${d.p} W=${d.W.toExponential(2)} err(h/4) ${['gradW', 'gradA', 'dWdt', 'dAdt'].map((q) => q + ' ' + d.steps[2].err[q].toExponential(1)).join(' ')} 次数 ${['gradW', 'gradA', 'dWdt', 'dAdt'].map((q) => d.order[q].map(f2).join('/')).join(' ')} ok ${d.ok}`);
  console.log(`(A) 遠方 1 源の閉じた式 ok ${R.distant.ok}・合成 u の商の微分 ok ${R.blend.ok}(W=0 → u ${R.blend.wZero.u})・並進基準系 ok ${R.boost.ok}`);
  console.log(`(B) 受理器 ${R.validator.filter((z) => z.ok).length}/${R.validator.length}・内蔵の宣言 ${R.census.declared.length} 本・p=2 一般形ビット一致 ${R.census.p2BitSame}`);
  const Q = computeRuns(HP);
  console.log(`(C) share-p1: ${JSON.stringify(Q.share.compare)} ok ${Q.share.ok}`);
  console.log(`(C) complex-p2: ${JSON.stringify(Q.mesh.compare)} none(vacuum) undef ${Q.mesh.noneVacuum.meshVel && Q.mesh.noneVacuum.meshVel.undef}・none(undefined) bad ${Q.mesh.noneUndefined.meshVel && Q.mesh.noneUndefined.meshVel.bad} ok ${Q.mesh.ok}`);
  console.log(`(D) geoPN 1 vs 2∧kF0: ${Q.geo12.rows.map((r) => r.id + ' ' + r.same).join(' · ')}`);
  const CODE = ['tests/exp-w286c-bgdiff.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  const meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第286便c', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, loadErrors: errors.length,
    ruling: '原仮定者の裁定(第76報)と第76報で閉じた AN7′(解析微分と有限差分の照合)・AN47(share p=1 と複素 p=2 を法則版で分け、単位・有限領域・基準系を宣言してから接続)・AN56(台帳はプリセットの宣言の中・座標系は宣言必須)',
    engine: 'Node の headless(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行)',
    notClaim: ['W₀・A₀ から微分が出る', '法則版で成立した', '観測一致を達成した', '新発見'] });
  const out = { meta, ...R, ...Q, elapsedS: (Date.now() - t0) / 1000 };
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  const outDir = path.join(ROOT, 'tests', 'out');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'bgdiff-w286c.json'), JSON.stringify(out, null, 1) + '\n');
  console.log('→ tests/out/bgdiff-w286c.json(' + out.elapsedS.toFixed(1) + ' s)');
}
