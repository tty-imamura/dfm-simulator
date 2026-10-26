// 第310便a(原仮定者の裁定(第107報)「分母に背景宇宙を入れると二重計上 —— 自分が分母に入れば良い」・(第109報)AN380「dragCore(R_d, m_d)と、
// 外殻(観測半径, 観測質量 − m_d)の引きずりを、それぞれ計算する」・決断事項 AN378・AN384・AN385・AN386・AN382・DECISIONS v69 §0b ②・§2・統括の検証項目 R222):
// **新則の受理と核の直しの器**(Wbg2 は 0 だけの受理・中心の向き・外殻の源・自己の場の前計算・自己の無い受け手の今の挙動)。
//
// Node だけ(対象 html の inline script を tests/lib-w279b-headless.mjs の loadHtmlHeadless で読み、html の関数 validatePreset・inertialDragIsqK2・
// inertialDragIsqShellK・inertialDragIsqShellM・inertialDragIsqRule・inertialDragIsqPointAt・inertialDragIsqState・inertialDragIsqEval と本の入口 coord3d.makeSim・build・step を
// そのまま呼ぶ)。参照は tests/lib-w310a-shell.mjs(外殻の球の差・薄い殻の閉じた式・動径と 3 次元の求積・外殻つきの参照の受け手)と tests/lib-w309a-invsq.mjs
// (源の球の閉じた式・参照の新則 —— エンジンの式と独立)。**在位の本の宣言は変えない**(写しは器の中で組む)。
//
// ■ 段
//   A(受理 —— AN378): invSq.Wbg2 の 16 通り(省略・0・−0 は受理して正準形 0・正・負・NaN・±Infinity・null・"0"・文字・真偽値・配列・オブジェクトは拒否)・outerShell の受理・
//     外殻の質量が無い本の警告・省略の正準形は第309便a と同じ・**内部状態で Wbg2 ≠ 0 を組む参照の比較**(公開の受理を通らない —— エンジンの評価は状態の値を読む)。
//   C(中心 —— §0b ②): 孤立の球の中心で ∇W = 0・W = 3m/R²(有限)・他の球を置いた中心で他の球の勾配だけ・正の r の点はエンジンと lib が一致。
//   N(節点): 規則の動径 t の範囲(次数 2〜24 で 0 < t < 1 —— r = 0 は起きない)・内蔵の本で invSq を宣言する本の数(0)・在位の三次元の慣性の本の新則の写しの 1 步が有限。
//   S(外殻の核 —— AN384): エンジンの K_s・M_s と導関数と lib(球の差・薄い殻の閉じた式)・lib と薄い殻の動径の求積・lib と殻の直接の 3 次元の求積・遠方で w → M/r²・M2 の遠方の係数。
//   E(外殻の受け手と源 —— AN385): 写しの配置でエンジンの β・回転の係数・軸の ω と lib の参照の受け手・m_d = M(外殻の質量 0)は外殻の宣言の有無でビット同一(読み口と 20 步)・
//     外殻つきのチェックポイントの往復。
//   M(太陽–水星の写し —— AN380・AN386): ☿ 3D の写しで太陽の dragCore = (6.5×10⁶ m, m_d)・m_d/M = 1・0.1・0.001 × 外殻 uniform/thin の β(水星 ← 太陽)・
//     源の外殻の分・回転引きずりの速さ u_rot と ω_D·â/Ω・太陽を受け手にした β(枝 d の掃引の照合に使う)。
//   P(前計算 —— §2): 単位の球の表(SK・SD)と今の経路の自己の場(全節点・次数 4〜16・受け手の半径 5 通り・受け手を原点と大きい座標に)・読み口の
//     direct(今の経路)と前計算の β・回転・ω(原点の写しと SI の太陽系の写し —— 大きい座標の差は今の経路の桁落ち)・速さ(評価 1 回の壁時計 —— 揮発)。
//   Z(AN382 —— 測るだけ): 質量 0 の受け手(massFloor のクランプ)・小さい質量で Σβ → 1・1 − Σβ と観測の移動の分解・半径の無い受け手(源にも受け手にも入らない)・小さい R_d で Σβ → 0。
//
// ■ 言わないこと: 「法則を発見した」「帳簿が完全に閉じた」「完全に一致」「二重計上を解消した」「フィットした」。外殻の形(一様の厚い殻)は統括の読み(AN384 —— 違えば次報)・
//   薄い殻は比較・m_d の値は探索の材料(在位へ入れない —— AN386)。前計算は今の経路の桁落ちを除く(物理の式は同じ)。
//
// ■ 使い方
//   node tests/exp-w310a-invsq.mjs   → 正本 tests/out/invsq-w310a.json(段 invsq-310a)
//   W310A_OUT=<json> で出力先を変える(試走は正本を書かない)・W310A_TARGET=<html>(既定 beta/index.html)・W310A_QUICK=1(次数と步数を縮める —— 煙試験の窓)。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlHeadless } from './lib-w279b-headless.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import { idsFromDecl as idsPlanets, buildConfigs } from './exp-w307c-spindecomp.mjs';
import * as L from './lib-w310a-shell.mjs';
import * as L9 from './lib-w309a-invsq.mjs';
import { pinDecl315c, LEGACY7_DATA_FILE } from './lib-w315c-legacy7.mjs';   // 第315便c(決断事項 AN406・R244): 在位の 7 本を K1 へ移した世代では、この器は移行の前(af2f426)の宣言の写しで測る
// 第281便a の領域 hash の宣言(器と lib から deriveScope で引いた下限 —— 段 N が内蔵の全本を数えるので presets は "all")
const REGEN_SCOPE = {"presets":"all","roots":["$","HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.sim","HP.validatePreset","REL_DRAG_INVSQ_LAW","REL_DRAG_INVSQ_SHELL_VERSION","REL_DRAG_INVSQ_VERSION","T","appStepDt","ckRestoreOne","ckSnapOne","ctx","cw","inertialDragInitObsState","inertialDragIsqEval","inertialDragIsqK2","inertialDragIsqPointAt","inertialDragIsqRule","inertialDragIsqShellK","inertialDragIsqShellM","inertialDragIsqState","retiredOf","sim"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w310a-invsq-1';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (o) => JSON.parse(JSON.stringify(o));
const E = (H, name) => H.evalExpr(name);
const { dot, cross, norm, add, sub, scale, unit } = L;
const rel = (a, b) => Math.abs(a - b) / Math.max(Math.abs(b), 1e-300);
const relv = (a, b) => norm(sub(a, b)) / Math.max(norm(b), 1e-300);
const r6 = (v) => (typeof v === 'number' && Number.isFinite(v)) ? Number(v.toPrecision(10)) : v;
const NOT_CLAIM = ['法則を発見した', '帳簿が完全に閉じた', '完全に一致', '二重計上を解消した', 'フィットした', 'm_d を同定した'];
const CAP = 6.5e6;
const MER = 'mercurySunInertial3d';

/* ───────── エンジンの関数を呼ぶための最小の状態(三次元・新則)───────── */
/** bodies = [{x, m, Rd, md?, Ro?, Om, a}]・o = {Wbg2, order, rot, axial, gain, shell:'uniform'|'thin'|null} */
function engineState(bodies, o = {}) {
  const n = bodies.length, F = (f) => Float64Array.from(bodies.map(f));
  const sd = (o.rot || o.axial) ? { rot: o.rot ? 'surfaceFlip' : 'off', axial: o.axial ? 'on' : 'off', ...(o.axial ? { axialModel: 'bevel', axialGain: o.gain === undefined ? 1 : o.gain, axialNorm: 'diff' } : {}) } : null;
  const isq = { Wbg2: o.Wbg2 || 0, order: o.order || 8, ...(o.shell ? { outerShell: o.shell } : {}) };
  return { n, coord3d: true, m: F((b) => b.m), x: F((b) => b.x[0]), y: F((b) => b.x[1]), z: F((b) => b.x[2]), spin: F((b) => b.Om || 0), radOv: F((b) => b.Ro || b.Rd),
    sax: F((b) => (b.a || [0, 0, 1])[0]), say: F((b) => (b.a || [0, 0, 1])[1]), saz: F((b) => (b.a || [0, 0, 1])[2]), pinned: new Uint8Array(n),
    relDrag: { law: 'inertial', invSq: isq, pairs: 'all', history: 'positions', ...(sd ? { spinDrag: sd } : {}) },
    dragCoreD: bodies.some((b) => b.md !== undefined) ? bodies.map((b) => (b.md !== undefined ? { massFrac: b.md / b.m, radius: b.Rd, R: b.Ro || b.Rd } : null)) : null,
    _rdPairSet: null, _rdPairN: n, _amKind: null, params: { G: 1, cLight: 1 } };
}
function presetOf(HP, id) { const p = HP.allPresets().find((q) => q.id === id); if (!p) throw new Error('本が無い: ' + id); return clone(p); }
function build(H, q) {
  const HP = H.HP, v = HP.validatePreset(q);
  if (!v.ok) throw new Error('validatePreset: ' + JSON.stringify(v.errors || v.err).slice(0, 300));
  const S = HP.coord3d.makeSim(); S.build(clone(v.preset));
  return { S, dt: E(H, 'appStepDt')(S), preset: v.preset, warnings: v.warnings || [] };
}
export const INVSQ = { invSq: { order: 8 }, dragCoreDefault: 'cap6500km', spinDrag: { rot: 'surfaceFlip', axial: 'on', axialModel: 'bevel' } };
/** ☿ 3D の写し(新則・既定の半径・太陽の dragCore = (6.5×10⁶ m, f·M) —— f = null は太陽の dragCore を宣言しない)。shell = outerShell の宣言 */
function merCopy(HP, f, shell, extra = {}) {
  const q = presetOf(HP, MER), L0 = q.scaleExp.L;
  q.physics.relativeDrag = { law: 'inertial', ...clone(INVSQ), ...extra };
  if (shell) q.physics.relativeDrag.invSq.outerShell = shell;
  if (f !== null && f !== undefined) q.bodies[0].dragCore = { massFrac: f, radius: CAP / Math.pow(10, L0) };
  return q;
}
const fpS = (S, keys) => { const h = crypto.createHash('sha1'); for (const k of keys) h.update(Buffer.from(Float64Array.from(S[k].subarray(0, S.n)).buffer)); return h.digest('hex'); };
const XV = ['x', 'y', 'z', 'vx', 'vy', 'vz', 'spin', 'rotA'];

/* ───────── 段 A(受理 —— AN378)───────── */
function partA(H) {
  const HP = H.HP, base = () => merCopy(HP, null, null), out = [];
  const cases = [['省略', undefined, true], ['0', 0, true], ['−0', -0, true], ['正 1e-30', 1e-30, false], ['正 3', 3, false], ['負 −1', -1, false], ['NaN', NaN, false], ['+Infinity', Infinity, false],
    ['−Infinity', -Infinity, false], ['null', null, false], ['文字列 "0"', '0', false], ['文字列 "a"', 'a', false], ['true', true, false], ['false', false, false], ['配列 []', [], false], ['オブジェクト {}', {}, false]];
  for (const [name, w, expectOk] of cases) {
    const q = base(); if (w !== undefined) q.physics.relativeDrag.invSq.Wbg2 = w;
    // 第316便(統括): 受理の理由の文から来歴の語を外した世代(第316便c)は「第107報」を含まない —— 理由の文の本体(二重計上・省略は 0)で同じ拒否を見る
    const v = HP.validatePreset(q), err = v.ok ? null : String((v.errors || [])[0] || '');
    const canon0 = v.ok ? Object.is(v.preset.physics.relativeDrag.invSq.Wbg2, 0) : null;
    out.push({ key: 'Wbg2', name, ok: v.ok, expectOk, canonicalPlusZero: canon0, pass: v.ok === expectOk && (v.ok ? canon0 === true : /invSq\.Wbg2 は 0 だけ/.test(err) && /二重計上/.test(err) && /第107報|二重計上・省略は 0/.test(err)), err: err === null ? null : err.slice(0, 120) });
  }
  const sh = [['uniform', 'uniform', true], ['thin', 'thin', true], ['null(省略)', null, true], ['"ball"', 'ball', false], ['1', 1, false], ['true', true, false]];
  for (const [name, s, expectOk] of sh) {
    const q = merCopy(HP, 0.1, null); q.physics.relativeDrag.invSq.outerShell = s;
    const v = HP.validatePreset(q), err = v.ok ? null : String((v.errors || [])[0] || '');
    const kept = v.ok ? v.preset.physics.relativeDrag.invSq.outerShell : undefined;
    out.push({ key: 'outerShell', name, ok: v.ok, expectOk, canonical: kept === undefined ? null : kept, pass: v.ok === expectOk && (!v.ok ? /outerShell は "uniform"/.test(err) : (s === null ? kept === undefined : kept === s)), err: err === null ? null : err.slice(0, 120) });
  }
  // 省略の正準形は第309便a と同じ形(鍵が増えない)
  const v0 = HP.validatePreset(base()), canon = v0.ok ? v0.preset.physics.relativeDrag : null;
  const canonSame = !!canon && JSON.stringify(canon.invSq) === JSON.stringify({ Wbg2: 0, order: 8 });
  // 外殻の質量が無い本の警告(太陽の dragCore 無し・uniform)/ある本は警告なし
  const wNo = build(H, merCopy(HP, null, 'uniform')).warnings.filter((w) => /outerShell/.test(w)).length;
  const wYes = build(H, merCopy(HP, 0.1, 'uniform')).warnings.filter((w) => /outerShell/.test(w)).length;
  // 内部状態で Wbg2 ≠ 0 を組む参照の比較(公開の受理を通らない —— エンジンの評価は状態の値を読む)
  const toy = [{ x: [0, 0, 0], m: 3, Rd: 1, Om: 0.7, a: [0, 0, 1] }, { x: [6, 1.5, -0.8], m: 1, Rd: 0.5, Om: -0.3, a: [0, 0, 1] }];
  const st = E(H, 'inertialDragIsqState'), s0 = st(engineState(toy, { rot: true, axial: true })), s1 = st(engineState(toy, { rot: true, axial: true, Wbg2: 0.05 }));
  const r0 = L9.refReceiver(toy, 1, { order: 8, axial: true, Wbg2: 0.05 }), e1 = s1.receivers.find((x) => x.i === 1);
  const internal = { betaWbg0: r6(s0.receivers.find((x) => x.i === 1).beta[0]), betaWbg005: r6(e1.beta[0]), engVsLibWbg005: r6(rel(e1.beta[0], r0.beta[0])) };
  return { cases: out, nCases: out.length, nPass: out.filter((r) => r.pass).length, canonicalOmittedSame: canonSame, warnNoShellMass: wNo, warnWithShellMass: wYes, internal,
    allPass: out.every((r) => r.pass) && canonSame && wNo === 1 && wYes === 0 && internal.engVsLibWbg005 < 1e-12 && internal.betaWbg005 < internal.betaWbg0 };
}

/* ───────── 段 C(中心 —— §0b ②)───────── */
function partC(H) {
  const at = E(H, 'inertialDragIsqPointAt'), rows = [];
  // 孤立の球(源も受け手も 1 個 —— 他の源なし)
  const one = engineState([{ x: [0.3, -0.2, 0.1], m: 2, Rd: 0.7, Om: 0, a: [0, 0, 1] }]);
  const p1 = at(one, 0, 0.3, -0.2, 0.1), W1 = p1.W, g1 = p1.grad;
  const isoOk = Number.isFinite(W1) && Math.abs(W1 / (3 * 2 / (0.7 * 0.7)) - 1) < 1e-15 && g1.every((v) => v === 0);
  rows.push({ case: '孤立の球の中心', W: r6(W1), WoverTheory: r6(W1 / (3 * 2 / 0.49)), grad: g1.map(r6), finite: Number.isFinite(W1) && g1.every(Number.isFinite) });
  // 他の球を置いた中心: 勾配は他の球の勾配だけ(lib の閉じた式の導関数)
  const two = [{ x: [0, 0, 0], m: 3, Rd: 1, Om: 0.7, a: [0, 0, 1] }, { x: [6, 1.5, -0.8], m: 1, Rd: 0.5, Om: -0.3, a: [0, 0, 1] }];
  const p2 = at(engineState(two), 0, 0, 0, 0), d = sub([0, 0, 0], two[1].x), r = norm(d), gl = scale(d, two[1].m * L9.K2Dr(r, two[1].Rd) / r);
  const Wl = 3 * 3 / 1 + two[1].m * L9.K2(r, two[1].Rd), eg = relv(p2.grad, gl), ew = rel(p2.W, Wl);
  const term = p2.terms.find((t) => t.j === 1), termsFinite = [term.beta, term.rotC, term.amp, term.K, term.dK, term.M, term.dM].every(Number.isFinite);
  rows.push({ case: '他の球を置いた中心', W: r6(p2.W), gradVsOther: r6(eg), WVsLib: r6(ew), termsFinite });
  // 正の r の点(エンジンと lib —— 第309便a の照合の型)
  let ep = 0;
  for (const [i, t, s] of [[0, 0.3, [0.36, 0.48, 0.8]], [0, 0.9, [0, 0, 1]], [1, 0.5, [1, 0, 0]], [1, 0.05, unit([1, -2, 0.5])]]) {
    const p = add(two[i].x, scale(s, two[i].Rd * t)), e = at(engineState(two), i, p[0], p[1], p[2]), l = L9.pointTerms(two, i, p, {});
    ep = Math.max(ep, rel(e.W, l.W), ...e.terms.map((x) => { const y = l.terms.find((z) => z.j === x.j); return Math.max(rel(x.beta, y.beta), rel(x.rotC, y.rotC)); }));
  }
  rows.push({ case: '正の r の点(4 点)', engVsLib: r6(ep) });
  return { rows, isolatedOk: isoOk, otherOnlyRel: r6(Math.max(eg, ew)), termsFinite, positiveREngVsLib: r6(ep) };
}

/* ───────── 段 N(節点で r = 0 は起きない)───────── */
function partN(H, quick) {
  const rule = E(H, 'inertialDragIsqRule'), HP = H.HP, retired = E(H, 'retiredOf');
  let tMin = 1, tMax = 0;
  for (let n = 2; n <= 24; n++) { const R = rule(n); for (let k = 0; k < R.N; k++) { if (R.T[k] < tMin) tMin = R.T[k]; if (R.T[k] > tMax) tMax = R.T[k]; } }
  const all = HP.allPresets();
  const decl = all.filter((q) => { const r = (q.physics || {}).relativeDrag, r2 = q.abBody && q.abBody.physicsPatch && q.abBody.physicsPatch.relativeDrag;
    return [r, r2].some((x) => x && x.invSq !== undefined); }).map((q) => q.id);
  // 在位の三次元の慣性の本(単位あり)の新則の写し(既定の半径)の 1 步が有限
  const live3 = all.filter((p) => !retired(p) && p.physics && p.physics.coord === '3d' && p.physics.relativeDrag && p.physics.relativeDrag.law === 'inertial' && p.scaleExp && Number.isFinite(p.scaleExp.L)).map((p) => p.id);
  const runs = [];
  for (const id of (quick ? live3.slice(0, 2) : live3)) {
    try {
      const q = presetOf(HP, id), rd = q.physics.relativeDrag;
      q.physics.relativeDrag = { law: 'inertial', ...clone(INVSQ), ...(rd.pairs && rd.pairs !== 'all' ? { pairs: rd.pairs } : {}) };
      const a = build(H, q); a.S.step(a.dt);
      const st = E(H, 'inertialDragIsqState')(a.S), fin = XV.every((k) => Array.from(a.S[k].subarray(0, a.S.n)).every(Number.isFinite));
      runs.push({ id, n: a.S.n, finite: fin, overlap: st.overlap, betaMax: r6(st.receivers.reduce((m, r) => Math.max(m, r.betaSum), 0)), nan: st.receivers.some((r) => r.beta.some((b) => !Number.isFinite(b))) });
    } catch (e) { const m = String(e); runs.push({ id, rejected: /approxMany と一緒に宣言しない/.test(m) ? 'approxMany(新則の受理が拒否 —— 第309便a)' : null, error: m.slice(0, 160) }); }
  }
  return { tMin: r6(tMin), tMax: r6(1 - tMax), builtins: all.length, declaringInvSq: decl, live3d: live3.length, runs,
    allFinite: runs.every((r) => (r.finite === true && r.nan === false) || !!r.rejected), nRun: runs.filter((r) => r.finite === true).length, nRejected: runs.filter((r) => !!r.rejected).length };
}

/* ───────── 段 S(外殻の核 —— AN384)───────── */
function partS(H, quick) {
  const SK = E(H, 'inertialDragIsqShellK'), SM = E(H, 'inertialDragIsqShellM'), B = new Float64Array(4), C = new Float64Array(4), rows = [];
  let eEng = 0, eRad = 0, eQ3 = 0, eQ3near = 0;
  for (const mode of ['uniform', 'thin']) for (const [Ri, Ro] of [[CAP / 1e8, 6.95], [0.5, 1], [0.9, 1]]) {
    for (const x of [0.01, 0.2, 0.5, 0.95, 1.05, 1.5, 2, 2.9, 3.1, 10, 100, 1e4]) {
      const r = x * Ro;
      if (mode === 'uniform' && Math.abs(r - Ri) < 1e-12 * Ro) continue;
      SK(r, Ri, Ro, mode === 'thin', B, C); const l = L.srcShell(r, Ri, Ro, mode);
      const e = [rel(B[0], l.K), rel(B[1], l.KDr)];
      if (r > Ro) { SM(r, Ri, Ro, mode === 'thin', B, C); e.push(rel(B[2], l.M), rel(B[3], l.MDr)); }
      eEng = Math.max(eEng, ...e);
    }
    for (const x of [1.2, 1.5, 2, 5, 30, 1e3]) {
      const r = x * Ro, l = L.srcShell(r, Ri, Ro, mode), q3 = L.shellQuad3(scale([0.36, 0.48, 0.8], r), Ri, Ro, mode, 48, 64);
      const e3 = Math.max(rel(l.K, q3.K), rel(l.M, q3.M));
      if (x < 1.5) eQ3near = Math.max(eQ3near, e3); else eQ3 = Math.max(eQ3, e3);
      let er = null;
      if (mode === 'uniform') { const q1 = L.shellRadialQuad(r, Ri, Ro, 96); er = Math.max(rel(l.K, q1.K), rel(l.M, q1.M)); eRad = Math.max(eRad, er); }
      rows.push({ mode, Ri: r6(Ri), Ro, rOverRo: x, libVsQuad3: r6(e3), libVsRadial: er === null ? null : r6(er) });
    }
    if (mode === 'uniform') for (const x of [0.005, 0.03, 0.1, 0.5, 0.9]) { const r = x * Ro; if (r === Ri) continue; const q1 = L.shellRadialQuad(r, Ri, Ro, 96); eRad = Math.max(eRad, rel(L.shellK(r, Ri, Ro), q1.K)); }
  }
  // 遠方で w = m_d K2 + M_s K_s → M/r²(分け方に依らない)と M2 の遠方の係数
  const Ri = CAP / 1e8, Ro = 6.95, M = 1988.5, far = [];
  for (const mode of ['uniform', 'thin']) for (const f of [1, 0.1, 0.001]) for (const x of [1e2, 1e3, 1e6]) {
    const r = x * Ro, md = f * M, ms = M - md, w = md * L9.K2(r, Ri) + (ms > 0 ? ms * L.srcShell(r, Ri, Ro, mode).K : 0);
    far.push({ mode, f, rOverRo: x, wR2overMminus1: r6(w * r * r / M - 1) });
  }
  const r6e = 1e6 * Ro, ml = L.shellM(r6e, Ri, Ro) * r6e ** 3 / (0.4 * (Ro ** 5 - Ri ** 5) / (Ro ** 3 - Ri ** 3)) - 1, mt = L.thinM(r6e, Ro) * r6e ** 3 / (2 * Ro * Ro / 3) - 1;
  SM(r6e, Ri, Ro, false, B, C); const me = B[2] * r6e ** 3 / (0.4 * (Ro ** 5 - Ri ** 5) / (Ro ** 3 - Ri ** 3)) - 1;
  SM(r6e, Ri, Ro, true, B, C); const mte = B[2] * r6e ** 3 / (2 * Ro * Ro / 3) - 1;
  return { rows, maxEngVsLib: r6(eEng), maxLibVsRadial: r6(eRad), maxLibVsQuad3: r6(eQ3), maxLibVsQuad3Near: r6(eQ3near), far,
    farMaxAt1e6: r6(Math.max(...far.filter((z) => z.rOverRo === 1e6).map((z) => Math.abs(z.wR2overMminus1)))),
    m2FarLead: { uniformLib: r6(ml), thinLib: r6(mt), uniformEngine: r6(me), thinEngine: r6(mte) } };
}

/* ───────── 段 E(外殻の受け手と源 —— AN385)───────── */
const TOYS = [
  { key: 'S2u', mode: 'uniform', bodies: [{ x: [0, 0, 0], m: 5, md: 1, Rd: 0.3, Ro: 1.2, Om: 0.8, a: unit([0.2, 0.1, 1]) }, { x: [7, 1.5, -0.8], m: 1, Rd: 0.4, Om: -0.3, a: [0, 0, 1] }] },
  { key: 'S2t', mode: 'thin', bodies: [{ x: [0, 0, 0], m: 5, md: 1, Rd: 0.3, Ro: 1.2, Om: 0.8, a: unit([0.2, 0.1, 1]) }, { x: [7, 1.5, -0.8], m: 1, Rd: 0.4, Om: -0.3, a: [0, 0, 1] }] },
  { key: 'S3u', mode: 'uniform', bodies: [{ x: [0, 0, 0], m: 5, md: 0.5, Rd: 0.2, Ro: 1.1, Om: 1, a: [0, 0, 1] }, { x: [8, 0, 1], m: 1, md: 0.6, Rd: 0.25, Ro: 0.5, Om: 0.5, a: unit([1, 0, 1]) }, { x: [-3, 7, -2], m: 2, Rd: 0.8, Om: -0.2, a: unit([0, 1, 1]) }] },
  { key: 'S3t', mode: 'thin', bodies: [{ x: [0, 0, 0], m: 5, md: 0.5, Rd: 0.2, Ro: 1.1, Om: 1, a: [0, 0, 1] }, { x: [8, 0, 1], m: 1, md: 0.6, Rd: 0.25, Ro: 0.5, Om: 0.5, a: unit([1, 0, 1]) }, { x: [-3, 7, -2], m: 2, Rd: 0.8, Om: -0.2, a: unit([0, 1, 1]) }] }];
function partE(H, quick) {
  const st = E(H, 'inertialDragIsqState'), rows = [];
  let eb = 0, er = 0, eo = 0, ebs = 0;
  for (const T of TOYS) for (const order of (quick ? [6] : [6, 8])) {
    const s = st(engineState(T.bodies, { rot: true, axial: true, order, shell: T.mode }));
    for (let i = 0; i < T.bodies.length; i++) {
      const R = L.refReceiverShell(T.bodies, i, { order, mode: T.mode, axial: true }), e = s.receivers.find((x) => x.i === i);
      let mb = 0, mr = 0, mbs = 0;
      for (let j = 0; j < T.bodies.length; j++) if (j !== i) {
        mb = Math.max(mb, rel(e.beta[j], R.beta[j])); mr = Math.max(mr, relv(e.rot.slice(3 * j, 3 * j + 3), R.rot[j]));
        if (R.betaShell[j] > 0) mbs = Math.max(mbs, rel(e.betaSrcShell[j], R.betaShell[j]));
      }
      const mo = relv(e.omega, R.omega);
      eb = Math.max(eb, mb); er = Math.max(er, mr); eo = Math.max(eo, mo); ebs = Math.max(ebs, mbs);
      rows.push({ key: T.key, order, recv: i, beta: e.beta.map(r6), betaSum: r6(e.betaSum), engVsLibBeta: r6(mb), engVsLibRot: r6(mr), engVsLibOmega: r6(mo), engVsLibSrcShell: r6(mbs),
        shellNodes: s.outerShell.shellNodes, recvShell: e.shell ? { wCore: r6(e.shell.wCore), wShell: r6(e.shell.wShell) } : null });
    }
  }
  // m_d = M(外殻の質量 0): 外殻の宣言の有無でビット同一(読み口と ☿ 3D の写しの 20 步)
  const HP = H.HP, K = quick ? 5 : 20;
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const twoM = [{ x: [0, 0, 0], m: 5, md: 5, Rd: 0.3, Ro: 1.2, Om: 0.8, a: [0, 0, 1] }, { x: [7, 1.5, -0.8], m: 1, Rd: 0.4, Om: -0.3, a: [0, 0, 1] }];
  const pick = (s) => s.receivers.map((r) => [r.beta, r.rot, r.omega]);
  const stSame = same(pick(st(engineState(twoM, { rot: true, axial: true, shell: 'uniform' }))), pick(st(engineState(twoM, { rot: true, axial: true }))))
    && same(pick(st(engineState(twoM, { rot: true, axial: true, shell: 'thin' }))), pick(st(engineState(twoM, { rot: true, axial: true }))));
  const runs = {};
  for (const [k, f, sh] of [['f1-none', 1, null], ['f1-uniform', 1, 'uniform'], ['f1-thin', 1, 'thin'], ['none-uniform', null, 'uniform'], ['none-none', null, null], ['f01-none', 0.1, null], ['f01-uniform', 0.1, 'uniform']]) {
    const a = build(H, merCopy(HP, f, sh)); for (let s = 0; s < K; s++) a.S.step(a.dt); runs[k] = fpS(a.S, XV);
  }
  const runSame = runs['f1-none'] === runs['f1-uniform'] && runs['f1-none'] === runs['f1-thin'] && runs['none-uniform'] === runs['none-none'];
  const shellChanges = runs['f01-none'] !== runs['f01-uniform'];
  // 外殻つきのチェックポイントの往復
  const ck = (() => {
    const snap = E(H, 'ckSnapOne'), rest = E(H, 'ckRestoreOne'), c = build(H, merCopy(HP, 0.01, 'uniform')), S = c.S;
    for (let k = 0; k < 4; k++) S.step(c.dt);
    const o = snap(S); for (let k = 0; k < 5; k++) S.step(c.dt); const A = fpS(S, XV) + JSON.stringify([S.inertialDragIsqN, S.inertialDragIsqBetaMax, S.inertialDragIsqNeg]);
    rest(S, o); for (let k = 0; k < 5; k++) S.step(c.dt); const B2 = fpS(S, XV) + JSON.stringify([S.inertialDragIsqN, S.inertialDragIsqBetaMax, S.inertialDragIsqNeg]);
    return A === B2;
  })();
  return { rows, maxBeta: r6(eb), maxRot: r6(er), maxOmega: r6(eo), maxSrcShell: r6(ebs), mdEqualsMStateSame: stSame, mdEqualsMRunSame: runSame, shellChangesRun: shellChanges, steps: K, checkpointSame: ck };
}

/* ───────── 段 M(太陽–水星の写し —— AN380・AN386)───────── */
function partM(H) {
  const HP = H.HP, st = E(H, 'inertialDragIsqState'), rows = [];
  const q0 = presetOf(HP, MER), Lm = Math.pow(10, q0.scaleExp.L), Tm = Math.pow(10, q0.scaleExp.T), vu = Lm / Tm;
  for (const shell of ['uniform', 'thin']) for (const f of [1, 0.1, 0.001]) {
    const a = build(H, merCopy(HP, f, shell)), S = a.S, s = st(S);
    const sun = s.receivers.find((r) => r.i === 0), mer = s.receivers.find((r) => r.i === 1);
    const Om = S.spin[0], ah = [S.sax[0], S.say[0], S.saz[0]], rc = mer.rot.slice(0, 3), urot = cross(scale(ah, Om), rc);
    const vrel = norm([S.vx[0] - S.vx[1], S.vy[0] - S.vy[1], S.vz[0] - S.vz[1]]), am = [S.sax[1], S.say[1], S.saz[1]];
    rows.push({ shell, mdOverM: f, mdKg: r6(f * S.m[0] * Math.pow(10, q0.scaleExp.M)), betaMerFromSun: r6(mer.beta[0]), betaMerFromSunShell: r6(mer.betaSrcShell[0]),
      rotCoef: r6(norm(rc)), uRotBook: r6(norm(urot)), uRotMs: r6(norm(urot) * vu), uRotOverVrel: r6(norm(urot) / vrel), omegaMerAxialOverSpin: r6(dot(mer.omega, am) / S.spin[1]),
      omegaMerNorm: r6(norm(mer.omega)), betaSunFromMer: r6(sun.beta[1]), sunPartCore: r6(sun.parts.core[1]), sunPartShell: r6(sun.parts.shell[1]), sunWCore: sun.shell ? r6(sun.shell.wCore) : 1,
      shells: s.outerShell.shells, shellNodes: s.outerShell.shellNodes });
  }
  const base = rows.find((r) => r.shell === 'uniform' && r.mdOverM === 1);
  for (const r of rows) { r.betaMerRatioToMd1 = r6(r.betaMerFromSun / base.betaMerFromSun - 1); r.uRotRatioToMd1 = r6(r.uRotBook / base.uRotBook); }
  return { id: MER, units: { L: q0.scaleExp.L, T: q0.scaleExp.T, M: q0.scaleExp.M, velocityMs: vu }, RdM: CAP, RobsM: r6(q0.bodies[0].radius * Lm), rows,
    allFinite: rows.every((r) => [r.betaMerFromSun, r.uRotBook, r.omegaMerNorm, r.betaSunFromMer].every(Number.isFinite)) };
}

/* ───────── 段 P(自己の場の前計算 —— §2)───────── */
function partP(H, quick) {
  const rule = E(H, 'inertialDragIsqRule'), k2 = E(H, 'inertialDragIsqK2'), B = new Float64Array(4), nodes = [];
  let maxOrigin = 0, maxFar = 0, maxOriginG = 0, maxFarG = 0, maxOriginGN = 0;
  // 動径の微分 g(t) = dK2/dr(t; 1) の条件数 κ = |t g′/g|(表面 t → 1 で対数で大きい —— x の 1 ulp の差が κ 倍に増える)。原点の受け手の勾配の差は (1 + κ)·2⁻⁵² で割って読む
  const kap = (t) => { const h = 1e-6, b1 = new Float64Array(4), b2 = new Float64Array(4), b0 = new Float64Array(4); k2(t * (1 + h), 1, b1); k2(t * (1 - h), 1, b2); k2(t, 1, b0); return Math.abs((b1[1] - b2[1]) / (2 * h * b0[1])); };
  const centers = { origin: [0, 0, 0], far: [-194.6097738328244, -669.1397002774223, -36.799304401607955] };   // far = ☿ 3D の水星の位置(本の単位)
  for (let n = 4; n <= 16; n++) {
    const R0 = rule(n), NA = R0.NA, KA = Array.from(R0.TA, kap);
    for (const Rd of [1e-3, 0.0244, 1, 6.95, 1e3]) for (const [ck, c] of Object.entries(centers)) {
      let mw = 0, mg = 0, mgn = 0;
      for (let q = 0; q < R0.N; q++) {
        const a = (q / NA) | 0, tR = Rd * R0.T[q], px = c[0] + tR * R0.SX[q], py = c[1] + tR * R0.SY[q], pz = c[2] + tR * R0.SZ[q];
        const dx = px - c[0], dy = py - c[1], dz = pz - c[2], r = Math.sqrt(dx * dx + dy * dy + dz * dz);
        k2(r, Rd, B);
        const wt = R0.SK[a] / (Rd * Rd), gt = R0.SD[a] / (Rd * Rd * Rd);
        mw = Math.max(mw, rel(wt, B[0]));
        const eg = relv([gt * R0.SX[q], gt * R0.SY[q], gt * R0.SZ[q]], [B[1] * dx / r, B[1] * dy / r, B[1] * dz / r]);
        mg = Math.max(mg, eg); mgn = Math.max(mgn, eg / ((1 + KA[a]) * Math.pow(2, -52)));
      }
      if (ck === 'origin') { maxOrigin = Math.max(maxOrigin, mw); maxOriginG = Math.max(maxOriginG, mg); maxOriginGN = Math.max(maxOriginGN, mgn); } else { maxFar = Math.max(maxFar, mw); maxFarG = Math.max(maxFarG, mg); }
      if (Rd === 0.0244 || Rd === 1) nodes.push({ order: n, Rd, center: ck, maxRelW: r6(mw), maxRelGrad: r6(mg), maxGradOverCondUlp: r6(mgn), kappaMax: r6(Math.max(...KA)) });
    }
  }
  // 読み口の direct(今の経路)と前計算 —— 原点の写し(桁落ちなし)と SI の太陽系の写し(大きい座標)・受け手を原点へ移した direct
  const st = E(H, 'inertialDragIsqState'), e2e = [];
  const cmp = (a, b) => { let mb = 0, mr = 0, mo = 0; for (const x of a.receivers) { const y = b.receivers.find((z) => z.i === x.i);
    x.beta.forEach((v, j) => { if (y.beta[j]) mb = Math.max(mb, rel(v, y.beta[j])); });
    if (x.rot) for (let j = 0; j < x.beta.length; j++) { const u = x.rot.slice(3 * j, 3 * j + 3), w = y.rot.slice(3 * j, 3 * j + 3); if (norm(w) > 0) mr = Math.max(mr, relv(u, w)); }
    if (x.omega && norm(y.omega) > 0) mo = Math.max(mo, relv(x.omega, y.omega)); } return { beta: mb, rot: mr, omega: mo }; };
  const toys = [[{ x: [0, 0, 0], m: 3, Rd: 1, Om: 0.7, a: unit([0.2, 0.1, 1]) }, { x: [6, 1.5, -0.8], m: 1, Rd: 0.5, Om: -0.3, a: [0, 0, 1] }],
    [{ x: [0, 0, 0], m: 5, Rd: 1.2, Om: 1, a: [0, 0, 1] }, { x: [7, 0, 1], m: 1, Rd: 0.4, Om: 0.5, a: unit([1, 0, 1]) }, { x: [-3, 6, -2], m: 2, Rd: 0.8, Om: -0.2, a: unit([0, 1, 1]) }]];
  let toyMax = 0;
  for (const [k, bs] of toys.entries()) for (const order of [4, 8, 16]) {
    const S = engineState(bs, { rot: true, axial: true, order }), c = cmp(st(S), st(S, { direct: true }));
    e2e.push({ case: 'toy' + k, order, ...Object.fromEntries(Object.entries(c).map(([a, b]) => [a, r6(b)])) });
    toyMax = Math.max(toyMax, c.beta, c.rot);
  }
  const { configs } = buildConfigs(H.HP, idsPlanets(H.HP));
  const pl = (C) => C.bodies.map((b) => ({ x: b.x, m: b.m, Rd: L9.defaultCoreRadius(b.R, 0).Rd, Om: b.omega, a: b.axis }));
  let siMax = 0, siCenteredMax = 0;
  const t8 = Math.min(...Array.from(E(H, 'inertialDragIsqRule')(8).TA));
  for (const C of configs) {
    const bs = pl(C), S = engineState(bs, { rot: true, axial: true, order: 8 }), T = st(S), D = st(S, { direct: true }), c = cmp(T, D);
    // 受け手ごとに受け手を原点へ移した direct(並進で同じ式 —— 桁落ちを除いた今の経路)
    let cb = 0, cr = 0, co = 0;
    for (let i = 0; i < bs.length; i++) {
      const Dc = st(engineState(bs.map((b) => ({ ...b, x: sub(b.x, bs[i].x) })), { rot: true, axial: true, order: 8 }), { direct: true });
      const one = cmp({ receivers: [T.receivers.find((z) => z.i === i)] }, { receivers: Dc.receivers });
      cb = Math.max(cb, one.beta); cr = Math.max(cr, one.rot); co = Math.max(co, one.omega);
    }
    e2e.push({ case: C.key, order: 8, beta: r6(c.beta), rot: r6(c.rot), omega: r6(c.omega), centeredBeta: r6(cb), centeredRot: r6(cr), centeredOmega: r6(co),
      cancelEstimate: r6(Math.max(...bs.map((b) => norm(b.x) * Math.pow(2, -53) / (b.Rd * t8)))) });
    siMax = Math.max(siMax, c.beta, c.rot); siCenteredMax = Math.max(siCenteredMax, cb, cr);
  }
  // 速さ(評価 1 回の ms —— 太陽–木星–イオの写し・次数 4/8/16・前計算と今の経路を交互に 3 回 —— 中央値)
  const ev = E(H, 'inertialDragIsqEval'), C = configs.find((c) => c.key === 'SJIo'), bs = pl(C), speed = [];
  for (const order of (quick ? [4] : [4, 8, 16])) {
    const S = engineState(bs, { rot: true, axial: true, order }), n = S.n, BE = new Float64Array(n * n), RV = new Float64Array(n * n * 3), OP = new Float64Array(n * n * 4);
    const K = order >= 16 ? 6 : order >= 8 ? 20 : 60, T = [], D = [];
    const run = (opt) => { const t0 = process.hrtime.bigint(); for (let k = 0; k < K; k++) ev(S, n, S.x, S.y, S.z, BE, RV, OP, true, true, 1, opt); return Number(process.hrtime.bigint() - t0) / 1e6 / K; };
    run(undefined); run({ direct: true });
    for (let r = 0; r < 3; r++) { T.push(run(undefined)); D.push(run({ direct: true })); }
    const med = (a) => a.slice().sort((x, y) => x - y)[1];
    speed.push({ order, nodes: S.n * order * order * 2 * order, table: { wallSec: r6(med(T) / 1000) }, direct: { wallSec: r6(med(D) / 1000) } });   // 比 table/direct は読み手が作る(揮発)
  }
  return { nodes, maxOriginW: r6(maxOrigin), maxOriginGrad: r6(maxOriginG), maxOriginGradOverCondUlp: r6(maxOriginGN), maxFarW: r6(maxFar), maxFarGrad: r6(maxFarG), e2e, toyMax: r6(toyMax), siMax: r6(siMax), siCenteredMax: r6(siCenteredMax), speed };
}

/* ───────── 段 Z(AN382 —— 自己の無い受け手の今の挙動を測るだけ)───────── */
function partZ(H) {
  const HP = H.HP, st = E(H, 'inertialDragIsqState'), rows = [];
  const one = (name, mut, extra) => {
    const q = merCopy(HP, null, null, extra || {}); mut(q);
    const v = HP.validatePreset(q);
    if (!v.ok) { rows.push({ name, accepted: false, err: String((v.errors || [])[0]).slice(0, 120) }); return; }
    const a = build(H, q), S = a.S, s = st(S), mr = s.receivers.find((r) => r.i === 1) || null;
    const row = { name, accepted: true, mCanon: r6(v.preset.bodies[1].m), mSim: r6(S.m[1]), noR: s.noR, merIsReceiver: !!mr, merBetaSum: mr ? r6(mr.betaSum) : null, oneMinusSum: mr ? r6(1 - mr.betaSum) : null,
      merRd: mr ? r6(mr.Rd) : null, sunBetaFromMer: r6((s.receivers.find((r) => r.i === 0) || { beta: [0, 0] }).beta[1]) };
    const io = E(H, 'inertialDragInitObsState') ? E(H, 'inertialDragInitObsState')(S) : null;
    if (io && io.motion && io.motion.rows) { const u = io.motion.rows[1].u, V = [io.obs.vx[1] - io.obs.vx[0], io.obs.vy[1] - io.obs.vy[0], io.obs.vz[1] - io.obs.vz[0]]; row.initMotion = { ok: io.ok, uOverVrel: r6(norm(u) / norm(V)) }; }
    else if (io && io.motion) row.initMotion = { ok: io.ok, why: io.why, at: io.motion.at, den: r6(io.motion.den === undefined ? null : io.motion.den) };   // 第311便b(AN389): 分母 1 − Σβ < 1e-2 の行は分解しない(motionDenomSmall —— 記録だけ)
    a.S.step(a.dt); row.stepFinite = XV.every((k) => Array.from(S[k].subarray(0, S.n)).every(Number.isFinite));
    rows.push(row);
  };
  one('質量 0(既定の massFloor)', (q) => { q.bodies[1].m = 0; });
  for (const m of [3.3011e-4, 1e-8, 1e-12, 1e-16, 1e-20]) one('質量 ' + m + '(massFloor 1e-30)', (q) => { q.physics.massFloor = 1e-30; q.bodies[1].m = m; });
  one('質量 1e-16 + initMotion(massFloor 1e-30)', (q) => { q.physics.massFloor = 1e-30; q.bodies[1].m = 1e-16; }, { initMotion: 'observed' });
  one('質量 0(massFloor 0)', (q) => { q.physics.massFloor = 0; q.bodies[1].m = 0; });
  one('半径の宣言なし', (q) => { delete q.bodies[1].radius; });
  for (const rd of [1e-3, 1e-6, 1e-9]) one('dragCore の半径 ' + rd + '(質量は全質量)', (q) => { q.bodies[1].dragCore = { massFrac: 1, radius: rd }; });
  return { rows };
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  return {
    acceptanceWbg2Only0: J.A.allPass,
    internalNonzeroReference: J.A.internal.engVsLibWbg005 < 1e-12,
    centerIsolatedZeroGrad: J.C.isolatedOk,
    centerOtherOnly: J.C.otherOnlyRel < 1e-14 && J.C.termsFinite,
    positiveRUnchanged: J.C.positiveREngVsLib < 1e-12,
    nodesNeverAtCenter: J.N.tMin > 0 && J.N.tMax > 0,
    noBuiltinDeclaresInvSq: J.N.declaringInvSq.length === 0,
    liveCopiesFinite: J.N.allFinite,
    shellKernelEngineVsLib: J.S.maxEngVsLib < 1e-12,
    shellLibVsRadialQuad: J.S.maxLibVsRadial < 1e-13,
    shellLibVsQuad3: J.S.maxLibVsQuad3 < 1e-11 && J.S.maxLibVsQuad3Near < 1e-10,
    shellFarMoverR2: J.S.farMaxAt1e6 < 1e-11,
    shellM2FarLead: Object.values(J.S.m2FarLead).every((v) => Math.abs(v) < 1e-9),
    shellReceiverEngineVsLib: J.E.maxBeta < 1e-12 && J.E.maxRot < 1e-11 && J.E.maxOmega < 1e-9 && J.E.maxSrcShell < 1e-12,
    mdEqualsMBitSame: J.E.mdEqualsMStateSame && J.E.mdEqualsMRunSame,
    shellChangesRun: J.E.shellChangesRun,
    shellCheckpointSame: J.E.checkpointSame,
    mercuryTableFinite: J.M.allFinite,
    precomputeOriginNodes: J.P.maxOriginW < 1e-13 && J.P.maxOriginGradOverCondUlp < 8,
    precomputeToyEndToEnd: J.P.toyMax < 1e-13,
    precomputeSICentered: J.P.siCenteredMax < 1e-13,
    an382Measured: J.Z.rows.length >= 10 && J.Z.rows.every((r) => r.accepted === false || r.stepFinite === true),
  };
}

/* ───────── 文書の表と数(PHYSICS〔第310便a〕—— QA docs.invSq310 が正本から作り直して逐語で照合する)───────── */
const e2s = (v) => (v === null || v === undefined) ? '—' : Number(v).toExponential(2);
const f3 = (v) => (v === null || v === undefined) ? '—' : Number(v).toFixed(3);
export function physicsTables(J) {
  const out = [];
  out.push('| 照合 | 値 |', '|---|---|');
  out.push(`| invSq.Wbg2 と outerShell の受理の表(省略・0・−0 は正準形 +0・それ以外の Wbg2 は拒否) | ${J.A.nPass}/${J.A.nCases} |`);
  out.push(`| 内部状態で Wbg2 = 0.05 を組んだ参照の比較(エンジンと lib の β の相対の差) | ${e2s(J.A.internal.engVsLibWbg005)} |`);
  out.push(`| 他の球を置いた中心の W・∇W と他の球の閉じた式の相対の差 | ${e2s(J.C.otherOnlyRel)} |`);
  out.push(`| 規則の動径の最小 t と最大の 1 − t(次数 2〜24) | ${e2s(J.N.tMin)}・${e2s(J.N.tMax)} |`);
  out.push(`| 内蔵 ${J.N.builtins} 本で invSq を宣言する本・在位の三次元の慣性の本の新則の写しの 1 步(有限 / 受理が拒否) | ${J.N.declaringInvSq.length}・${J.N.nRun}/${J.N.nRejected} |`);
  out.push(`| 外殻の核 K_s・M_s と導関数のエンジンと lib の相対の差の最大 | ${e2s(J.S.maxEngVsLib)} |`);
  out.push(`| 一様の厚い殻の球の差と薄い殻の閉じた式の動径の求積の相対の差の最大 | ${e2s(J.S.maxLibVsRadial)} |`);
  out.push(`| 外殻の閉じた式と殻の直接の 3 次元の求積(r/R 1.5〜10³)の相対の差の最大 | ${e2s(J.S.maxLibVsQuad3)} |`);
  out.push(`| 遠方 r/R = 10⁶ で w r²/M − 1(m_d/M = 1・0.1・0.001 × uniform・thin)の最大 | ${e2s(J.S.farMaxAt1e6)} |`);
  out.push(`| 外殻つきの受け手と源のエンジンと lib(β・回転・ω)の相対の差の最大 | ${e2s(Math.max(J.E.maxBeta, J.E.maxRot))}・${e2s(J.E.maxOmega)} |`);
  out.push(`| 自己の場の前計算と今の経路(受け手を原点に・次数 4〜16・半径 5 通り・全節点)の場 W の相対の差の最大 | ${e2s(J.P.maxOriginW)} |`);
  out.push(`| 同じ —— 動径の微分(表面の節点 t → 1 で条件数 κ が大きい)の相対の差の最大・(1 + κ)·2⁻⁵² で割った最大 | ${e2s(J.P.maxOriginGrad)}・${f3(J.P.maxOriginGradOverCondUlp)} |`);
  out.push(`| 同じ(受け手を ☿ 3D の水星の位置に —— 今の経路の桁落ち) | ${e2s(Math.max(J.P.maxFarW, J.P.maxFarGrad))} |`);
  out.push(`| SI の太陽系の写しの前計算と今の経路の β・回転の相対の差の最大(受け手を原点へ移した今の経路とは) | ${e2s(J.P.siMax)}(${e2s(J.P.siCenteredMax)}) |`);
  out.push('', '| ☿ 3D の写し(太陽の dragCore 6.5×10⁶ m) | m_d/M | β(☿ ← ☉) | うち外殻 | u_rot [m/s] | ω_D·â/Ω(☿) | β(☉ ← ☿) |', '|---|---|---|---|---|---|---|');
  for (const r of J.M.rows) out.push(`| ${r.shell} | ${r.mdOverM} | ${e2s(r.betaMerFromSun)} | ${e2s(r.betaMerFromSunShell)} | ${e2s(r.uRotMs)} | ${e2s(r.omegaMerAxialOverSpin)} | ${e2s(r.betaSunFromMer)} |`);
  out.push('', '| AN382(測るだけ —— 水星の写し) | 受理 | 受理後の質量 [本の単位] | 水星の Σβ | 1 − Σβ |', '|---|---|---|---|---|');
  for (const r of J.Z.rows) out.push(`| ${r.name} | ${r.accepted ? (r.merIsReceiver ? '受理・受け手' : '受理・受け手でない') : '拒否'} | ${r.accepted ? e2s(r.mCanon) : '—'} | ${r.accepted && r.merBetaSum !== null ? e2s(r.merBetaSum) : '—'} | ${r.accepted && r.oneMinusSum !== null ? e2s(r.oneMinusSum) : '—'} |`);
  return out.join('\n');
}
export function docNumbers(J) {
  const u1 = J.M.rows.find((r) => r.shell === 'uniform' && r.mdOverM === 1), u3 = J.M.rows.find((r) => r.shell === 'uniform' && r.mdOverM === 0.001);
  return [e2s(J.S.maxEngVsLib), e2s(u1.betaMerFromSun), e2s(u3.uRotMs), e2s(J.P.siMax)];
}

export function runAll(H, o = {}) {
  const quick = !!o.quick, t = {};
  let t0 = Date.now();
  const tick = (k) => { t[k] = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now(); };
  const A = partA(H); tick('A');
  const C = partC(H); tick('C');
  const N = partN(H, quick); tick('N');
  const S = partS(H, quick); tick('S');
  const Er = partE(H, quick); tick('E');
  const M = partM(H); tick('M');
  const P = partP(H, quick); tick('P');
  const Z = partZ(H); tick('Z');
  const J = { quick, A, C, N, S, E: Er, M, P, Z };
  J.gates = gatesOf(J);
  J.ok = Object.values(J.gates).every(Boolean);
  J.timing = t;
  return J;
}

// 版を読む器・QA・正本の扱い(AN378 の版上げ —— 第310便a の枝で列挙して走らせた。正本の中身の invSqVersion で世代を見分ける)
export const VERSION_READERS = [
  { file: 'tests/qa.mjs behavior.invSq309', reads: 'html の REL_DRAG_INVSQ_VERSION', handling: '両方の版で走る(③ の Wbg2 = 0.05 は内部状態の参照の比較 —— 公開の受理と分ける)' },
  { file: 'tests/qa.mjs docs.invSq309', reads: '第309便a の正本(段 invsq-309a)の invSqVersion', handling: '両方の版を受ける(正本は鎖で新版の html から作り直される)' },
  { file: 'tests/exp-w309a-invsq.mjs(段 G の受理の表)', reads: 'REL_DRAG_INVSQ_VERSION', handling: 'Wbg2 正は版 w309a-invsq-1 のときだけ受理を期待(新版では拒否)—— 正本の契約を新版へ' },
  { file: '段 invsq-309a の正本', reads: '—(invSqVersion を刻む)', handling: '新版の html で作り直した(段 A の照合は受け手を原点に置いた lib と)・PHYSICS〔第309便a〕の 2 行を正本の値へ' },
  { file: '段 recheck-309c・段 maintain-309b の正本', reads: '版を読まない(Wbg2 を宣言しない)', handling: 'そのまま(鎖が領域で判定)' },
];

export async function main() {
  const TARGET = process.env.W310A_TARGET || 'beta/index.html';
  const OUT = process.env.W310A_OUT || path.join(ROOT, 'tests', 'out', 'invsq-w310a.json');
  const quick = process.env.W310A_QUICK === '1';
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now();
  const W281A_SCOPE = w281aScopeStamp(html, REGEN_SCOPE);
  const H = loadHtmlHeadless(html);
  pinDecl315c(H.evalExpr);   // 第315便c(AN406): 在位の 7 本の宣言を移行の前の写しへ(本ごとの門 —— 基点の html では no-op・正本の欄は足さない)
  const R = runAll(H, { quick });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w310a-invsq.mjs', target: TARGET,
    targetSha256: crypto.createHash('sha256').update(fs.readFileSync(html)).digest('hex'),
    ruling: '原仮定者の裁定(第107報)分母に背景宇宙を入れると二重計上 —— 自分が分母に入れば良い・(第109報)AN380 太陽の R_d は cap6500km で固定し m_d の適正値を探索・dragCore(R_d, m_d)と外殻(観測半径, 観測質量 − m_d)の引きずりをそれぞれ計算・決断事項 AN378・AN384・AN385・AN386・AN382・DECISIONS v69 §0b ②・§2・統括の検証項目 R222',
    invSqVersion: E(H, 'REL_DRAG_INVSQ_VERSION'), invSqLaw: E(H, 'REL_DRAG_INVSQ_LAW'), shellVersion: E(H, 'REL_DRAG_INVSQ_SHELL_VERSION'), versionReaders: VERSION_READERS, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w310a-invsq.mjs', 'tests/lib-w315c-legacy7.mjs', 'tests/lib-w310a-shell.mjs', 'tests/lib-w309a-invsq.mjs', 'tests/lib-w307a-sphereaxial.mjs', 'tests/exp-w307c-spindecomp.mjs', 'tests/lib-w307c-spindecomp.mjs',
    'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第310便a', target: TARGET, code: CODE, inputs: [TARGET, LEGACY7_DATA_FILE] }), {
    harnessVersion: HARNESS_VERSION,
    engine: 'Node の headless(tests/lib-w279b-headless.mjs の loadHtmlHeadless —— html の本文をそのまま実行・1 プロセス)',
    notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s', JSON.stringify(out.timing));
}
if (IS_MAIN) await main();
