// 第343便e(原仮定者の回答(2026-11-19 —— 第142報の回答 2)AN843「パワーボール効果は、軸引きずりで回転が伝わる経路として見る。軸引きずりで、目標とする軸と回転が決まるが、
//   実際の経路は、ジャイロトルクを経由する」・AN844「銀河由来の軸引きずりに対する、太陽の軸は、112.8°。銀河由来の軸引きずりと、太陽由来の軸引きずりの釣り合いが、太陽系の軸の120°」・
//   統括の検証項目 R382): **「目標」と「経路」を分けた帳簿と保存の零試験・第342便e の残りの読み直し・釣り合いが 120° になる重みの比(平面)・宣言の極の三次元の角の探索の器**
//   (段 spintransfer-343e —— 正本 tests/out/spintransfer-343e.json・lib tests/lib-w343e-spintransfer.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・前の便の lib の本文は変えない。physics の鍵を足さない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w343e-spintransfer.mjs —— 領域の宣言なし)。入力のファイルは無い(第342便e・第340便f・第341便g・第337便j・
//   第337便c・第341便f の lib を呼んで作り直す)。1 プロセス。正本は第338便c の settleRun で書く(丸めの残りは 0 —— 尺度と床は meta.recheck)。
//
// ■ 探索の方針(第138報): 式の形は走行の前に決め打ちしない —— 正本の先頭(decl・lit・plan)は、走らせたノブの格子と判定の物差しの記録。
// ■ 判定の物差し: 保存の零試験(総トルク 0・総仕事率 0・h が自転の軸と同じなら自転の仕事率 0・駆動 0 → 全部 0・散逸の熱 ≥ 0)/平面の比は閉じた形と 2 分で戻した角の差/
//   窓は第342便e と同じ 3 つ(イオの熱 ≤ 観測・木星の熱 ≥ 物差しの 0.1 倍・分類の帯)—— 金星は並べる列。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w343e-spintransfer.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w343e-spintransfer-1';
export const OUT_MAIN = 'tests/out/spintransfer-343e.json';
export const TARGET = 'tests/lib-w343e-spintransfer.mjs';
/** 版の履歴(結果を見て変えた所 —— 理由つき) */
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '経路の型の動作の確かめと、要るノブの範囲の表(天体の自転や熱の予測ではない)', '経路の型 3 つ・目標の回転の大きさの読み 2 つ・内部の軸 h の向きはどれも候補(どれも採っていない)',
  '大きさの尺度 k・c は第342便e の向ける力の前の係数に合わせて置いたノブ —— 天体の内部の軸を観測で決めたものではない', '釣り合いの比は則の型と向ける先の置き方ごとの値(観測の値ではない)',
  '安定は緩和の型(角の速さが残りに比例)での傾きの符号 —— 実際の天体の安定ではない', '112.8° と極の向きは文献の値(本環境では一次資料に当たっていない —— 未照合)',
  'AN711 の 120° は消さない・112.8° で置き換えない', 'エンジン・内蔵の本へは入れない(AN712)']);
/** 器の宣言(表に出す点) */
export const PLAN = Object.freeze({ t1: '天体 7 × 源(2〜3)× 向ける先の符号 2 × 目標の回転の大きさの読み 2', path: '木星・金星・イオ × 読み 2 × 経路の型 5(P1 の h 3 つ・P2・P3)',
  t2: '木星・金星・イオ × 源 × 読み 2(第342便e の残りの上限)', win: '読み 2 × 符号 2(散逸のトルクを別に置く型の熱)', t3: '則 3 × 銀河の向ける先 2 × 角 9', t4: '極 2(黄道・不変面)× 銀河の向ける先 2 × 則 3',
  t5: '第342便e の T3(銀河の角)と T4(太陽の向ける先)の入れ替え' });

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const D = L.DECL;
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 7,
    t1: J.t1.length === 2 * 2 * (4 * 2 + 3 * 3) && J.t1.every((r) => r.OmegaT >= 0 && r.dAbs >= 0),
    path: J.path.length === D.t2Bodies.length * 2 * 5 && J.path.every((r) => r.totT === 0 && (r.path === 'P3' ? r.heat >= 0 : r.heat === 0) && (r.h === 'spin' ? r.spinW === 0 : true)),
    t2: J.t2.length === 2 * (2 + 2 + 3) && J.t2.every((r) => r.tauPar > 0 && r.reachYr > 0),
    win: J.win.length === 4,
    t3: J.t3.length === D.laws.length * D.galPlace.length * D.thetaGrid.length && J.t3.every((r) => r.backErrDeg === null || r.backErrDeg === 0),
    t4: J.t4.rows.length === 2 * 2 * 3 && J.t4.rows.every((r) => r.residOverSun >= r.minResidOverSun * (1 - 1e-12)),
    t5: J.t5.length === 5,
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const ctx = L.makeCtx(); mark('ctx');
  const PS = L.pureScenes(), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const t1 = L.t1Table(ctx), pathT = L.pathTable(ctx), t2 = L.t2Table(ctx), win = L.windowP3(ctx); mark('t12');
  const t3 = L.t3Table(ctx), t3side = L.t3Side(ctx), t4 = L.t4Table(ctx), t5 = L.t5Table(ctx); mark('t345');
  const J = { scale: L.baseScale(ctx), pure, t1, path: pathT, t2, win, t3, t3side, t4, t5, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w343e-spintransfer.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W343E_OUT ? (path.isAbsolute(process.env.W343E_OUT) ? process.env.W343E_OUT : path.join(ROOT, process.env.W343E_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第343便e spintransfer(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w343e-spintransfer.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-19 —— 第142報の回答 2)AN843「パワーボール効果は、軸引きずりで回転が伝わる経路として見る。軸引きずりで、目標とする軸と回転が決まるが、実際の経路は、ジャイロトルクを経由する」・AN844「銀河由来の軸引きずりに対する、太陽の軸は、112.8°。銀河由来の軸引きずりと、太陽由来の軸引きずりの釣り合いが、太陽系の軸の120°」・統括の検証項目 R382',
    decl: L.DECL, lit: L.LIT, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第343便e', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'spintransfer', engine: 'Node(html を読まない —— 純関数の lib の表・ベクトルの和・角の 2 分)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
