// 第344便e(原仮定者の回答(2026-11-19 —— 第143報の回答 3)AN880「「目標とする軸と回転」は、「今の自転に合成する目標とする軸と回転」に訂正」・原仮定者の指示(2026-11-19 —— 第144報)「AN891: 中身を足して進める」・
//   統括の検証項目 R389): **「今の自転に合成する」の型(C1 一度だけ足すベクトル・C2 続けて足すトルク・C3 2 倍角の則を通した和・C4 飽和と重みつきの和)の零試験と天体の表・
//   120° の釣り合いの三次元の残りを極の選び方と向ける先の写像で分けた表の器**(段 spincompose-344e —— 正本 tests/out/spincompose-344e.json・lib tests/lib-w344e-spincompose.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・前の便の lib の本文は変えない。physics の鍵を足さない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w344e-spincompose.mjs —— 領域の宣言なし)。入力のファイルは無い(第343便e・第342便e・第341便f・第337便c の lib を呼んで作り直す)。
//   1 プロセス。正本は第338便c の settleRun で書く(丸めの残りは 0 —— 尺度と床は meta.recheck)。
//
// ■ 探索の方針(第138報): 式の形は走行の前に決め打ちしない —— 正本の先頭(decl・lit・plan)は、走らせたノブの格子と判定の物差しの記録。
// ■ 判定の物差し: C1 の大きさの二乗の差の 3 値(119°・120°・121°)・毎步足すと率で足すの刻み 2 つ/C2 の角運動量の和と「回転のエネルギー + 積んだ熱」の保存・刻み 200 と 400 の差・
//   閉じた形との差・統括の参考の試作の表と有効数字 3 桁/C4 の零試験(足す分 0・上限 → ∞)/三次元の残りの最小 = abs(sin ずれ)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w344e-spincompose.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w344e-spincompose-1';
export const OUT_MAIN = 'tests/out/spincompose-344e.json';
export const TARGET = 'tests/lib-w344e-spincompose.mjs';
/** 版の履歴(結果を見て変えた所 —— 理由つき) */
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '合成の型の動作の確かめと、要るノブの範囲の表(天体の自転や熱の予測ではない)', '合成の型 5 つ(C1・C2・C3・C4a・C4b)・目標の回転の大きさの読み 2 つ・向ける先の写像 3 つはどれも候補(どれも採っていない)',
  'C2 の尺度 c は〔第343便e〕の向ける力の前の係数に合わせて置いたノブ —— (m1) の届くまでの時間が天体に依らないのはこの置き方の結果', 'C4 の上限と飽和はノブ —— 観測の自転に合わせた値ではない',
  '三次元の残りは宣言の極(文献の値・未照合)での値', 'AN711 の 120° は消さない・112.8° で置き換えない', '〔第343便e〕の「置き換わる先」の表は当時の読みの列として残る', 'エンジン・内蔵の本へは入れない(AN712)']);
/** 器の宣言(表に出す点) */
export const PLAN = Object.freeze({ pure: 'C1 の 3 値 3 角・毎步と率の刻み 2・C2 の場面 4 組 × 刻み 2・C4 の零試験・入力の拒否', t2: '天体 5 × 源(2〜3)× 読み 2 × 型(C1・C2 の 4 組・C3・C4a の上限 4)',
  c4b: '天体 5 × 読み 2 × 飽和 3', win: '読み 2(C2 の熱の率・b = 1 を単位)', t3: '極 2 × 銀河の写像 3 × 太陽の写像 3', bal: '平面と三次元 × 銀河の向ける先 2' });

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const D = L.DECL;
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 7,
    t2: J.t2.length === 2 * (4 * 2 + 3) && J.t2.every((r) => r.c2.length === 4 && r.c4a.length === D.capOverOmega.length && r.c2HeatTotalJ >= 0
      && ['up', 'down', 'unresolved'].includes(r.c1.judge) && ['up', 'down', 'unresolved'].includes(r.c3.judge)),
    c4b: J.c4b.length === D.t2Bodies.length * 2 * D.satOverOmega.length && J.c4b.every((r) => r.lambda > 0 && r.lambda <= 1),
    win: J.win.length === 2,
    t3: J.t3.length === 2 * 3 * 3 && J.t3.every((r) => r.minResidOverSun >= 0 && r.phaseNeedDeg >= 0 && r.phaseNeedDeg <= 90),
    bal: J.bal.rows.length === 4 && J.bal.sameMag120 === 'unresolved',
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const ctx = L.makeCtx(); mark('ctx');
  const PS = L.pureScenes(), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const t2 = L.t2Table(ctx), c4b = L.c4bTable(ctx), win = L.windowC2(ctx); mark('t2');
  const t3 = L.t3Table(), bal = L.composeBalance(), t3side = L.t3Side(ctx); mark('t3');
  const J = { pure, t2, c4b, win, t3, bal, t3side, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w344e-spincompose.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W344E_OUT ? (path.isAbsolute(process.env.W344E_OUT) ? process.env.W344E_OUT : path.join(ROOT, process.env.W344E_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第344便e spincompose(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w344e-spincompose.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-19 —— 第143報の回答 3)AN880「「目標とする軸と回転」は、「今の自転に合成する目標とする軸と回転」に訂正」・原仮定者の指示(2026-11-19 —— 第144報)「AN891: 中身を足して進める」・統括の検証項目 R389',
    decl: L.DECL, toyRef: L.TOY_REF, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第344便e', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'spincompose', engine: 'Node(html を読まない —— 純関数の lib の表・ベクトルの和・陰の中点の積分)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
