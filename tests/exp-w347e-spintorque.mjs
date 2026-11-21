// 第347便e(原仮定者の回答(2026-11-21 —— 第145報)「AN910: 推奨で進める」「AN911: 推奨で進める」・推奨で進める項 AN912・AN913・統括の検証項目 R404):
//   **続けて足すトルク(C2)を主の候補にした天体の表(2 倍角の則の引数 2 つ —— 受け手の位置の緯度を主の候補・軸どうしの角を比べる列)・尺度の置き方 3 列・熱の窓・
//   120° の三次元の残りの候補 2 つの器**(段 spintorque-347e —— 正本 tests/out/spintorque-347e.json・lib tests/lib-w347e-spintorque.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・前の便の lib の本文は変えない。physics の鍵を足さない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w347e-spintorque.mjs —— 領域の宣言なし)。入力のファイルは無い(前の便の lib を呼んで作り直す)。
//   1 プロセス。正本は第338便c の settleRun で書く。
//
// ■ 探索の方針(第138報): 式の形は走行の前に決め打ちしない —— 正本の先頭(decl・lit・plan)は、走らせたノブの格子と判定の物差しの記録。
// ■ 判定の物差し: 1 公転の平均の閉じた形(−cos i n̂)と位相の点の平均・第337便j の lib の平均の内積/2 倍角の則の 3 点/軸どうしの角の向き(0°・30°・90°)/C2 の初めのトルクの項の分け方/
//   3 値の境(第341便c の型)/T4 の接線の向きの反転と 1 公転の平均の接線 0/入力の拒否。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w347e-spintorque.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w347e-spintorque-1';
export const OUT_MAIN = 'tests/out/spintorque-347e.json';
export const TARGET = 'tests/lib-w347e-spintorque.mjs';
/** 版の履歴(結果を見て変えた所 —— 理由つき) */
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '合成の型・角の引数・尺度の置き方の動作の確かめと、要るノブの範囲の表(天体の自転や熱の予測ではない)', '続けて足すトルク(C2)は主の候補・一度だけ足すベクトル(C1)は合成した先の目安 —— どちらも採っていない',
  '角の引数 2 つ(受け手の位置の緯度・軸どうしの角)はどちらも候補', '尺度の置き方 3 つ(今・軸引きずりの率に結ぶ・トルクを固定して天体の性質のノブ)はどれも候補 —— 観測の自転の数は固定の比べる列(合わせない)',
  '極の向き・公転の要素はリポジトリの中の値(文献の値・未照合)', '月・イオ・冥王星の向きの一部は宣言の面', '積分の時間は絶対時間(現行の近似)', 'AN711 の 120° は消さない', 'エンジン・内蔵の本へは入れない(AN712)']);
/** 器の宣言(表に出す点) */
export const PLAN = Object.freeze({ pure: '1 公転の平均 4 つの傾き・2 倍角の則の 3 点・軸どうしの角 3 つ・C2 の項・3 値の境 5・T4 の反転・入力の拒否 6',
  t1: '受け手と源 15 × 読み 2 × 引数 2 × 尺度 3 × (k, b) 4', t2: '受け手と源 15(読み m1)× 尺度 3', obs: '地球・火星(固定の比べる列)', win: '読み 2 × 尺度 3 × 引数 2', t4: '極 2 × 銀河の向ける先 2 × 太陽の項の向きの読み 4' });

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const D = L.DECL, W = ['up', 'down', 'unresolved'];
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 7,
    t1: J.t1.length === D.pairs.length * 2 && J.t1.every((r) => D.args.every((a) => W.includes(r[a].judge) && D.scales.every((s) => r[a].scales[s].judges.length === 4 && r[a].scales[s].judges.every((j) => W.includes(j))))
      && r.latMeanDiff < 1e-12 && Math.abs(r.latProjJ337 - r.lat.proj * r.cosI) < 1e-9),
    t2: J.t2.length === D.pairs.length && J.t2.every((r) => r.reachS0 > 0 && r.reachS1 > 0 && r.reachS2 > 0),
    obs: J.obs.length === 2,
    win: J.win.length === 2 * 3 * 2,
    t4: J.t4.length === 2 * 2 * 4 && J.t4.every((r) => (r.sun === 'latMean') === r.sunTanZero),
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const ctx = L.makeCtx(); mark('ctx');
  const PS = L.pureScenes(), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const t1 = L.t1Table(ctx), t2 = L.t2Scale(t1), obs = L.observedRates(); mark('t1');
  const win = L.windowTable(ctx); mark('win');
  const t4 = L.t4Table(); mark('t4');
  const J = { pure, t1, t2, obs, win, t4, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w347e-spintorque.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W347E_OUT ? (path.isAbsolute(process.env.W347E_OUT) ? process.env.W347E_OUT : path.join(ROOT, process.env.W347E_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第347便e spintorque(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w347e-spintorque.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-21 —— 第145報)「AN910: 推奨で進める」「AN911: 推奨で進める」・推奨で進める項 AN912・AN913・統括の検証項目 R404',
    decl: L.DECL, lit: L.LIT, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第347便e', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'spintorque', engine: 'Node(html を読まない —— 純関数の lib の表・ベクトルの和・1 公転の平均)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
