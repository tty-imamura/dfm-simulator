// 第337便l(原仮定者の回答(2026-11-15 —— 第138報の回答 3)・原仮定者の指示(2026-10-18 —— 第101報・第103報)・統括の検証項目 R348):
//   **軸引きずりの向き —— 2 倍角の則を並進引きずりに対する向きとして置く(回転の分と並進の分)**の器。
//   T1 2 倍角の則の向きと強さの仰角の依存の候補・T2 並進の分(並進引きずりが運ぶ速度 c の 1 つの式・公転する受け手・ロックした連星・近づく/遠ざかる分)・
//   T3 天体への当てはめ(太陽 → 8 惑星と金星の釣り合い・銀河 → 太陽系・惑星 → 衛星と冥王星 – カロン・比べる天体と逆行や横倒しの天体の配置)・T4 合成の 60° の規則。
//   (段 bevel-337l —— 正本 tests/out/bevel-337l.json・lib tests/lib-w337l-bevel.mjs)。**診断だけ** —— エンジン・内蔵の本・受理器・既存の lib の本文は変えない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w337l-bevel.mjs —— 領域の宣言なし)・入力のファイルは無い(第337便a の正本の値は lib の宣言に写した —— 出どころを書いた)。1 プロセス。
//
// ■ 走らせたノブの格子と判定の物差し(正本の先頭 —— 式の形の宣言ではなく、何を測ったかの記録)
//   T1: 仰角 0〜90°(7 点)× 向きの候補 3(reflect・diff・diffTwist〔q 0・1〕)× 強さ p 0・1・2・ε 0・0.1。物差し: 原文の 3 点(赤道面で源の軸から 180°・45° で 90°・軸の方向で 0°)・
//     「軸方向で弱くなる」(|ω| が 90° で 0° より小さい)・歯車の読み(源の最も近い表面の移動の向きと受け手の近い面の移動の向きの余弦 = 1)。
//   T2: 差分の読みの閉じた形と第337便a の数値の差分(今の形 axialAt・静止 complementDiff)の相対の差 ≤ 1e-6・c の 1 つの式と閉じた形の差 ≤ 1e-12・第333便b の通過の場面の符号。
//     公転する受け手 n/s 7 点 × (今の形 diff・reflect T 1・reflect T α/(α − 1)・背景が静止 diff・reflect)。
//   T3: 背景慣性決定力 W₀ は第337便a の解のまま(解き直さない)。太陽 → 8 惑星の取り分 f・α_e・軌道の平均の向きの因子・太陽の項と背景の項・2 倍角の則で自転の向きになる仰角 el* と実際の仰角の範囲。
//     金星の釣り合い: 向きの因子 P(reflect の平均・diff の平均)× 振幅(signed・share)の根 f。銀河 → 太陽系・衛星 7・冥王星 – カロン・比べる天体。
//   T4: 太陽の項(符号つきの reflect)と背景の項のなす角・ベクトルの和・第121報の規則どおりの読み(なす角 ≤ 120° なら大きい方より小さくしない)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import * as L from './lib-w337l-bevel.mjs';
import { galacticAxes } from './lib-w335b-carryledger.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w337l-bevel-1';
export const AMEND = Object.freeze([]);
export const OUT_MAIN = 'tests/out/bevel-337l.json';
export const TARGET = 'tests/lib-w337l-bevel.mjs';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
export const NOT_CLAIM = Object.freeze(['自転の軸の傾きが 2 倍角の則で出るとは書かない(この則ではこの向き・この配置に当たる、まで)', '金星の逆行が軸引きずりで出るとは書かない(金星の大気の熱潮汐は本枝では扱わない)',
  '向きの候補を法則と書かない(探索の候補の表)', '文献の値は未照合(出典と確かさを書く)', '背景慣性決定力 W₀ は第337便a の解のまま(解き直さない)']);
/** 器の宣言 */
export const PLAN = Object.freeze({
  /** T2 の数値の照らしの配置(固定 —— 乱数を使わない) */
  checks: Object.freeze([
    Object.freeze({ s: [0.1, -0.3, 1.2], rhat: [1, 0.2, 0.1], r: 3, vSrc: [0.2, 0.5, -0.1], vRecv: [0, 0.3, 0.05] }),
    Object.freeze({ s: [0, 0, 1], rhat: [1, 0, 0], r: 2, vSrc: [0, 0, 0], vRecv: [0, 0.4, 0] }),
    Object.freeze({ s: [0.5, 0.5, 0.2], rhat: [0.3, -1, 0.7], r: 5, vSrc: [1, 0, 0], vRecv: [0, 0, 0] }),
    Object.freeze({ s: [0, 0, 0], rhat: [0, 1, 0], r: 1.5, vSrc: [0.7, 0, 0.2], vRecv: [0.1, 0, 0] }),
    Object.freeze({ s: [0, 0, 1], rhat: [0.7, 0, 0.7], r: 1, vSrc: [0, 0, 0], vRecv: [0, 0, 0] }),
    Object.freeze({ s: [0, 0, 1], rhat: [0, 0, 1], r: 1, vSrc: [0, 0.3, 0], vRecv: [0, 0, 0] }),
  ]),
  venusP: Object.freeze(['reflectP1', 'reflectP0', 'diff', 'diffTwist']),
});

/* ───────── T1 ───────── */
export function partT1() {
  const rows = L.DECL.elevDeg.map((e) => L.elevRow(e));
  const at = (e) => rows.find((r) => r.elDeg === e);
  const LIM = { twist1Ang: 'twist1Lim', diffAng: 'diffLim' }, pole = (k) => (at(90)[k] !== null ? at(90)[k] : (LIM[k] ? at(90)[LIM[k]] : null));
  const three = (k) => at(0)[k] !== null && Math.abs(at(0)[k] - 180) <= 1e-9 && at(45)[k] !== null && Math.abs(at(45)[k] - 90) <= 1e-9 && pole(k) !== null && Math.abs(pole(k)) <= 1e-3;
  const cands = [
    { key: 'reflectP0', dirKey: 'reflectAng', magKey: 'reflectP0', note: '半回転 × 1(大きさ一定)' },
    { key: 'reflectP1', dirKey: 'reflectAng', magKey: 'reflectP1', note: '半回転 × cos el(今のコードの EQ-16 の sinθ と同じ —— 回転引きずりの速さ s r cos el の差分)' },
    { key: 'reflectP2', dirKey: 'reflectAng', magKey: 'reflectP2', note: '半回転 × cos² el' },
    { key: 'reflectP1e', dirKey: 'reflectAng', magKey: 'reflectP1e', note: '半回転 × (0.1 + 0.9 cos el)(軸の方向で 0 にしない)' },
    { key: 'diff', dirKey: 'diffAng', magKey: 'diff', note: '差分の読み(第337便a の diff —— 線に垂直な分だけ)' },
    { key: 'twist0', dirKey: 'twist0Ang', magKey: 'twist0', note: '差分の読み + 捩れ μ 1・q 0(= 半回転 × 1)' },
    { key: 'twist1', dirKey: 'twist1Ang', magKey: 'twist1', note: '差分の読み + 捩れ μ √2・q 1' },
  ].map((c) => ({ ...c, three: three(c.dirKey), weakAxis: at(90).mag[c.magKey] < at(0).mag[c.magKey], poleAng: pole(c.dirKey), twoAngleAll: rows.every((r) => r[c.dirKey] !== null ? Math.abs(r[c.dirKey] - r.reflectAngClosed) <= 1e-9 : r.elDeg === 90),
    mag: rows.map((r) => r.mag[c.magKey]) }));
  return { rows, cands, gearAll: rows.filter((r) => r.elDeg < 90).every((r) => Math.abs(r.gear - 1) <= 1e-12) && rows.every((r) => r.gearTwist) };
}

/* ───────── T2 ───────── */
export function partT2() {
  const checks = PLAN.checks.map((c, i) => { const a = L.checkSelf(c), b = L.checkStatic(c), cf = L.READINGS.map((rd) => { const x = L.diffClosed({ ...c, f: 0.37, reading: rd }).tot, y = L.diffFromC({ ...c, f: 0.37, reading: rd });
    const n = Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]); return n / Math.max(Math.hypot(...x), 1e-300); });
    return { i, selfRel: a.rel, staticRel: b.rel, cformRel: Math.max(...cf), fSelf: a.f, fStatic: b.f }; });
  const orbit = L.DECL.nOverS.map((x) => L.orbitRow(x));
  const locked = L.lockedRow(), radial = L.radialRow(), passing = L.passingScene();
  // 符号の境目(今の形・赤道面): diff は n/s = (α − 1)/α・reflect T 1 は n/s = 1
  const a = L.DECL.alpha;
  return { checks, orbit, locked: { ref1: locked.ref1[2], diff: locked.diff[2], staticRef: locked.staticRef[2] }, radial, passing, flip: { diff: (a - 1) / a, ref1: 1 },
    maxSelf: Math.max(...checks.map((c) => c.selfRel)), maxStatic: Math.max(...checks.map((c) => c.staticRel)), maxCform: Math.max(...checks.map((c) => c.cformRel)) };
}

/* ───────── T3 ───────── */
export function partT3() {
  const planets = L.planetRows(), ven = planets.find((p) => p.key === 'venus');
  const venus = [];
  for (const k of PLAN.venusP) for (const amp of ['signed', 'share']) { const P = ven.dirMean[k], v = L.venusBalance({ P, amp }); venus.push({ dir: k, amp, P, f: v.f, df: v.df, W0: v.W0, nRoots: v.roots.length, bgFactorNeeded: v.bgFactorNeeded }); }
  const v0 = L.venusBalance({ P: 1, amp: 'signed' });
  const galaxy = L.galaxyRow(), moons = L.moonRows(), compare = L.compareRows();
  return { planets, venus, venusRef: { galN: v0.galN, sunN: v0.sunN, W0: v0.W0, f: v0.f }, galaxy, moons, compare,
    summary: { agreeSigned: planets.filter((p) => (p.sunRefSigned > 0) === p.prograde).length, agreeShare: planets.filter((p) => (p.sunRefShare > 0) === p.prograde).length,
      inRange: planets.filter((p) => p.inRange).map((p) => p.key), moonsFlip: moons.moons.filter((m) => m.eqSign > 0).map((m) => m.key) } };
}

/* ───────── T4 ───────── */
export function partT4(T3) {
  const sun = L.DECL.spins.sun.sHat, Lhat = galacticAxes().Lhat;
  return { rows: T3.planets.map((p) => { const a = [sun[0] * p.sunRefSigned, sun[1] * p.sunRefSigned, sun[2] * p.sunRefSigned], b = [Lhat[0] * p.bg, Lhat[1] * p.bg, Lhat[2] * p.bg], r = L.rule60({ a, b });
    return { key: p.key, angDeg: r.angDeg, vecSum: r.vecSum, ruleRead: r.ruleRead, noDecel: r.noDecel, ratio: Math.abs(p.sunRefSigned / p.bg) }; }),
    equal: [0, 60, 90, 120, 150, 180].map((d) => { const a = [0, 0, 1], b = [Math.sin(d * Math.PI / 180), 0, Math.cos(d * Math.PI / 180)], r = L.rule60({ a, b }); return { angDeg: d, vecSum: r.vecSum, ruleRead: r.ruleRead, noDecel: r.noDecel }; }) };
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const t1 = J.t1, t2 = J.t2, t3 = J.t3, t4 = J.t4, c = (k) => t1.cands.find((x) => x.key === k);
  return {
    pure: Object.values(J.pure.gates).every(Boolean),
    t1Three: c('reflectP0').three && c('reflectP1').three && c('twist0').three && !c('twist1').three && !c('diff').three && t1.gearAll,
    t1Weak: c('reflectP1').weakAxis && !c('reflectP0').weakAxis,
    t2Num: t2.maxSelf <= L.DECL.numTol && t2.maxStatic <= L.DECL.numTol && t2.maxCform <= L.DECL.idTol,
    t2Closed: t2.orbit.every((o) => Math.abs(o.selfDiff - o.selfDiffClosed) <= 1e-12 && Math.abs(o.ref1 - o.ref1Closed) <= 1e-12 && Math.abs(o.staticDiff - o.staticDiffClosed) <= 1e-12),
    t2Zero: t2.radial.every((r) => r.mag === 0) && Math.abs(t2.locked.ref1) <= 1e-15 && Math.abs(t2.passing.ratio - 2) <= 1e-9,
    t3Complete: t3.planets.length === 8 && t3.planets.every((p) => fin(p.f) && fin(p.sunRefSigned) && fin(p.bg)) && t3.venus.length === PLAN.venusP.length * 2 && t3.moons.moons.length === 7 && t3.compare.length >= 7,
    t3Venus: t3.venus.filter((v) => v.amp === 'signed').every((v) => v.nRoots >= 1 && Math.abs(v.df) <= 1e-9) && t3.venus.filter((v) => v.amp === 'share').every((v) => v.nRoots === 0),
    t4Complete: t4.rows.length === 8 && t4.equal.length === 6 && Math.abs(t4.equal.find((e) => e.angDeg === 120).vecSum - 1) <= 1e-12,
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const t1 = partT1(); mark('t1');
  const t2 = partT2(); mark('t2');
  const t3 = partT3(); mark('t3');
  const t4 = partT4(t3); mark('t4');
  const J = { pure, t1, t2, t3, t4, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

const writeJson = (OUT, out) => { fs.mkdirSync(path.dirname(OUT), { recursive: true }); fs.writeFileSync(OUT, JSON.stringify(out, null, 1).replace(/\[\s*(-?[\d.eE+-]+(?:,\s*-?[\d.eE+-]+|,\s*null)*)\s*\]/g, (m, a) => '[' + a.replace(/\s+/g, '') + ']') + '\n'); };
export const CODE = Object.freeze(['tests/exp-w337l-bevel.mjs', 'tests/lib-w337l-bevel.mjs']);
export async function main() {
  const t0 = Date.now();
  const OUT = process.env.W337L_OUT ? (path.isAbsolute(process.env.W337L_OUT) ? process.env.W337L_OUT : path.join(ROOT, process.env.W337L_OUT)) : path.join(ROOT, OUT_MAIN);
  console.log('第337便l bevel(版 ' + HARNESS_VERSION + ')');
  const R = runAll();
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w337l-bevel.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-15 —— 第138報の回答 3)「第101報、第103報の『２倍角の則』を、並進引きずりに対する軸引きずりの向きとして進める。回転だけでなく並進も考慮する」・原仮定者の指示(2026-10-18 —— 第101報・第103報)・統括の検証項目 R348',
    decl: L.DECL, lit: L.LIT, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第337便l', target: TARGET, code: CODE_ALL, inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'bevel', engine: 'Node の純関数だけ(html を読まない・エンジンの步を進めない)', notClaim: NOT_CLAIM });
  writeJson(OUT, out);
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
/** 来歴のコード(器・lib と import の閉包 —— 器が起動時に辿る) */
function closure(start) {
  const seen = new Set(), st = [...start];
  while (st.length) { const f = st.pop(); if (seen.has(f)) continue; seen.add(f); let t = ''; try { t = fs.readFileSync(path.join(ROOT, f), 'utf8'); } catch (e) { continue; }
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) st.push('tests/' + m[1]); }
  return [...seen].sort();
}
const CODE_ALL = closure([...CODE, 'tests/lib-w272e-provenance.mjs']);
if (IS_MAIN) await main();
