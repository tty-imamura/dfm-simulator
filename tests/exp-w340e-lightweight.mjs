// 第340便e(原仮定者の指示(2026-11-17 —— 第140報)「引きずりでの光速」・原仮定者の回答 AN756 = A・AN765・統括の検証項目 R360):
//   **T1 受け手の重みを入れた速さの表(25 系 × 速さの型 7)と ⑩ の効き(5 系 × 列 2 × 場の型 7)・詰まり具合のべき × 離心率の依存のノブ(5 系)/
//   T2 共通の零試験(天体が 1 つ・離して静止させた 2 体・二重に足さない・次元)**(段 lightweight-340e —— 正本 tests/out/lightweight-340e.json・lib tests/lib-w340e-lightweight.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・第338便e までの lib の本文は変えない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w340e-lightweight.mjs —— 領域の宣言なし)・入力のファイルは無い。1 プロセス。
//
// ■ 走らせたノブの格子と判定の物差し(正本の先頭 —— 式の形の宣言ではなく、何を測ったかの記録)
//   T1: 系 25(第338便e の SYSTEMS)× 速さの型 7(剛体・(R_d/r)¹・(R_d/r)²・自己の重み R_d・R_obs・(R_d/r)¹ と自己の重みの両方 2)—— 軌道の 720 点の最大 ÷ c。
//     物差し: なし(光速との比は表に残すだけ —— 判定には使わない)。取り分 f と Ω a/c の平面の位置(log10 f + log10(Ω a/c) が 0 より上か)を数える。
//   ⑩ の効き: 観測の目安のある 5 系 × 列 L1・S0 × 場の型 7(⑩ なし・剛体・(R_d/r)¹・(R_d/r)²・自己の重み 2・(R_d/r)¹ と自己の重み R_obs)の ȧ の比 ÷ ⑩ なし(ノブ 1・k = 0)。
//   AN765: 詰まり具合のべき k(−4〜4・0.05)× 離心率の依存 (e/0.1)^j(−8〜8・0.01)—— 5 系の上限の広がり(物差し ≤ 10 —— 第338便e と同じ)・列 L1・S0 × 場の型 ⑩ なし・(R_d/r)¹。
//   T2: (a) 源 1 つ(太陽の質量)を並進・回転 —— 場の歪み(対称 ÷ 反対称)・試験点の相対の速さ・熱の口(静止系・一緒に回る系)/(b) 静止・等速・円・離心の 4 場面 × 系 3/
//     (c) 水星と月で GM → 2GM・並進引きずりの近点の回り × 2/(d) 次元の一覧。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w340e-lightweight.mjs';
import * as S338 from './lib-w338e-spinfield.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w340e-lightweight-1';
export const AMEND = Object.freeze([]);
export const OUT_MAIN = 'tests/out/lightweight-340e.json';
export const TARGET = 'tests/lib-w340e-lightweight.mjs';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
export const NOT_CLAIM = Object.freeze(['速さが光速の内に収まると結論しない(この 25 系・この型で何桁下がるかまで —— 受け手の重みが有っても入力が光速を超えれば平均も超え得る)',
  '⑩ の当否を結論しない(落ちる型・自己の重みの型での効きの表まで)', '重力を引きずりから出せるかどうかを結論しない(静止の 2 体で読みの候補 3 つが出す数まで)',
  '光速との比は判定に使わない(表に残すだけ)・光速で切り詰める処理は持たない', '文献の値は未照合(行の出どころを書く)']);
/** 器の宣言 */
export const PLAN = Object.freeze({
  pairs: Object.freeze([
    Object.freeze({ key: 'sunMercury', mi: 3.3011e23, mj: 1.98847e30, a: 5.790905e10, e: 0.20563593, Robs: 2.4397e6 }),
    Object.freeze({ key: 'earthMoon', mi: 7.342e22, mj: 5.9722e24, a: 3.84399e8, e: 0.0549, Robs: 1.7374e6 }),
    Object.freeze({ key: 'j0737', mi: 2.483370041e30, mj: 2.660982861e30, a: 8.788367196901313e8, e: 0.087777036, Robs: 1.175e4 }),
  ]),
  scans: Object.freeze([Object.freeze({ col: 'S0', field: 'none' }), Object.freeze({ col: 'S0', field: 'pow1' }), Object.freeze({ col: 'L1', field: 'none' }), Object.freeze({ col: 'L1', field: 'pow1' })]),
});

/* ───────── T1 ───────── */
export function partT1() {
  const rows = S338.SYSTEM_KEYS.map((k) => L.t1Row(k));
  const types = L.DECL.speedTypes;
  const lg = (x) => (x > 0 ? Math.log10(x) : null);
  for (const r of rows) r.dropFromRigid = Object.fromEntries(types.filter((t) => t !== 'rigid').map((t) => [t, r.maxOverC[t] > 0 ? lg(r.maxOverC.rigid / r.maxOverC[t]) : null]));
  const summary = Object.fromEntries(types.map((t) => {
    const xs = rows.map((r) => r.maxOverC[t]);
    return [t, { min: Math.min(...xs), max: Math.max(...xs), nOver: rows.filter((r) => r.superluminal[t]).length, over: rows.filter((r) => r.superluminal[t]).map((r) => r.key) }];
  }));
  const plane = { aboveRd: rows.filter((r) => r.marginRd !== null && r.marginRd > 0).map((r) => r.key), aboveRobs: rows.filter((r) => r.marginRobs !== null && r.marginRobs > 0).map((r) => r.key),
    rigidAbove: rows.filter((r) => r.log10OmegaAOverC > 0).map((r) => r.key),
    maxMarginRd: Math.max(...rows.map((r) => r.marginRd)), maxMarginRobs: Math.max(...rows.map((r) => r.marginRobs)) };
  const drops = Object.fromEntries(types.filter((t) => t !== 'rigid').map((t) => { const ds = rows.map((r) => r.dropFromRigid[t]).filter(fin); return [t, { min: Math.min(...ds), max: Math.max(...ds) }]; }));
  return { rows, summary, plane, drops };
}
/* ───────── ⑩ の効き ───────── */
export function partEff() {
  const rows = S338.BOUND_KEYS.map((k) => L.effRow(k));
  // 効き = |比 − 1|(⑩ なしとの差)
  const eff = {};
  for (const col of L.DECL.effCols) for (const t of L.DECL.effFields.filter((x) => x !== 'none')) {
    const ds = rows.map((r) => Math.abs(r.cols[col].ratio[t] - 1));
    eff[col + '|' + t] = { min: Math.min(...ds), max: Math.max(...ds) };
  }
  return { rows, eff };
}
/* ───────── AN765 ───────── */
export function partScan() {
  return PLAN.scans.map((q) => L.spreadScan(S338.BOUND_KEYS, q.col, q.field));
}
/* ───────── T2 ───────── */
export function partT2() {
  const single = L.zeroSingle();
  const pairs = PLAN.pairs.map((q) => L.zeroPair(q));
  return { single, pairs, readings: L.READINGS, double: L.doubleCount(), dims: L.DIMENSIONS };
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const t1 = J.t1, ef = J.eff, sc = J.scan, t2 = J.t2;
  const st = t2.pairs.every((p) => { const [s, u, c, e] = p.rows; return s.dDdtOverDn === 0 && s.dragRd === 0 && s.dragRobs === 0 && u.dDdtOverDn === 0 && u.dragRd === 0 && c.dDdtOverDn === 0 && c.dragRadialShare === 0 && e.dDdtOverDn !== 0 && p.rows.every((r) => r.gOverGM_r2 === 1); });
  return {
    pure: Object.values(J.pure.gates).every(Boolean),
    t1Complete: t1.rows.length === S338.SYSTEM_KEYS.length && t1.rows.every((r) => L.DECL.speedTypes.every((t) => fin(r.maxOverC[t]) && r.maxOverC[t] >= 0)),
    t1Order: t1.rows.every((r) => r.maxOverC.pow1 <= r.maxOverC.rigid * (1 + 1e-12) && r.maxOverC.selfRd <= r.maxOverC.rigid && r.maxOverC.selfRobs <= r.maxOverC.rigid && r.maxOverC.pow1selfRobs <= r.maxOverC.pow1 * (1 + 1e-12)),
    effComplete: ef.rows.length === S338.BOUND_KEYS.length && ef.rows.every((r) => L.DECL.effCols.every((c) => fin(r.cols[c].none) && r.cols[c].none !== 0)),
    scanComplete: sc.length === PLAN.scans.length && sc.every((s) => s.best && fin(s.best.log10Spread) && s.nK === 161),
    single: t2.single.strainMax.rigid === 0 && t2.single.strainMax.selfZero === 0 && t2.single.relSpeed === 0 && t2.single.heatRest === 0 && t2.single.heatRot === 0 && t2.single.ctlHeatRel === 0,
    staticPair: st,
    double: Math.abs(t2.double.mercury.periodRatio - Math.SQRT1_2) < 1e-12 && Math.abs(t2.double.mercury.pnRatio - 2 * Math.SQRT2) < 1e-9 && Math.abs(t2.double.mercury.dragExtraOverPN - 5 / 3) < 1e-9,
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const t1 = partT1(); mark('t1');
  const eff = partEff(); mark('eff');
  const scan = partScan(); mark('scan');
  const t2 = partT2(); mark('t2');
  const J = { pure, t1, eff, scan, t2, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}
/** 正本へ書く形(第338便c の settleRun —— Math の関数を ±1〜2 ulp ずらした走り直しの差の最大を尺度に、|値| ≤ 4 σ の葉を 0 と書く) */
export function runSettled() {
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const { gates, ok, ...rest } = S.value;
  return { J: Object.assign(rest, { timing: tm, gates, ok }), recheck: S.meta };
}

const writeJson = (OUT, out) => { fs.mkdirSync(path.dirname(OUT), { recursive: true }); fs.writeFileSync(OUT, JSON.stringify(out, null, 1).replace(/\[\s*(-?[\d.eE+-]+(?:,\s*-?[\d.eE+-]+|,\s*null)*)\s*\]/g, (m, a) => '[' + a.replace(/\s+/g, '') + ']') + '\n'); };
export const CODE = Object.freeze(['tests/exp-w340e-lightweight.mjs', 'tests/lib-w340e-lightweight.mjs', 'tests/lib-w338e-spinfield.mjs', 'tests/lib-w337d-accelloss.mjs', 'tests/lib-w335b-carryledger.mjs',
  'tests/lib-w326d-axialheat.mjs', 'tests/lib-w333c-mercury3d.mjs', 'tests/lib-w335e-moonapsis.mjs', 'tests/lib-w330b-dragweight.mjs', 'tests/lib-w331c-k1scale.mjs', 'tests/lib-w332a-eqband.mjs',
  'tests/lib-w272e-provenance.mjs', 'tests/lib-w338c-recheck.mjs']);
export async function main() {
  const t0 = Date.now();
  const OUT = process.env.W340E_OUT ? (path.isAbsolute(process.env.W340E_OUT) ? process.env.W340E_OUT : path.join(ROOT, process.env.W340E_OUT)) : path.join(ROOT, OUT_MAIN);
  console.log('第340便e lightweight(版 ' + HARNESS_VERSION + ')');
  const { J: R, recheck } = runSettled();
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w340e-lightweight.mjs', target: TARGET,
    ruling: '原仮定者の指示(2026-11-17 —— 第140報)「引きずりの計算で、光速を超えるか超えないかは判断基準にならない」「引きずられる側の重みが有るので、計算結果は簡単には光速を超えないのではないか」(後の文は予想 —— 数で確かめる題)・原仮定者の回答 AN756 = A・AN765・統括の検証項目 R360',
    decl: L.DECL, recvR: L.RECV_R, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第340便e', target: TARGET, code: CODE, inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'lightweight', engine: 'Node の純関数だけ(html を読まない・エンジンの步を進めない —— 自前の求積)', notClaim: NOT_CLAIM, recheck });
  writeJson(OUT, out);
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();
