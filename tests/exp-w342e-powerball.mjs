// 第342便e(原仮定者の回答(2026-11-18 —— 第141報の回答 AN803)「…ジャイロトルクで動かなかった分のエネルギーは消えない。熱になるか、自転速度を増す。
//   自転速度を増す経路が「パワーボール効果」」・統括の検証項目 R376):
//   **動かなかった分の出口を 2 つ(熱・自転の速さの増加)に分ける帳簿と、向ける先の軸が複数(太陽・銀河)の場合の探索の器**
//   (段 powerball-342e —— 正本 tests/out/powerball-342e.json・lib tests/lib-w342e-powerball.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・前の便の lib の本文は変えない。physics の鍵を足さない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w342e-powerball.mjs —— 領域の宣言なし)。入力のファイルは無い(第341便f・第341便b・第337便c・第330便a の
//   lib を呼んで作り直す)。1 プロセス。正本は第338便c の settleRun で書く(丸めの残りは 0 —— 尺度と床は meta.recheck)。
//
// ■ 探索の方針(第138報): 式の形は走行の前に決め打ちしない —— 正本の先頭(decl・lit・plan)は、走らせたノブの格子と判定の物差しの記録。
// ■ 判定の物差し: 零試験(駆動 0・理想のジャイロ・η = 0 で第341便f と同じ・帳簿の恒等式・sin の型の 2 つの軸の合成)/窓は (i) イオの熱 ≤ 観測(全球)
//   (ii) 木星の熱 ≥ 物差しの 0.1 倍(観測の内部の熱の放射の超過 —— 判定)(iii) 第337便c の分類の帯(係数 1 のとき)—— 金星は並べる列(熱流は測られていない)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w342e-powerball.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w342e-powerball-1';
export const OUT_MAIN = 'tests/out/powerball-342e.json';
export const TARGET = 'tests/lib-w342e-powerball.mjs';
/** 版の履歴(結果を見て変えた所 —— 理由つき) */
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '帳簿の動作の確かめと、要るノブの範囲の表(天体の熱や自転の予測ではない)', '分け方 η の型は 3 つとも候補(どれも採っていない)',
  '保つ仕事率 P_hold は第341便f の型 (α) の置き方(ノブ)—— 理想の直交するトルクの仕事率は 0', '角運動量の出どころ(源の自転・軌道・外)は決めていない —— 使い切るまでの時間を並べただけ',
  '天体の特性の係数は 1・第341便b の読み 2 つを並べた(1 に置いた結果を合ったと読まない)', '金星の熱流は測られていない —— 上限の目安(観測ではない)',
  '文献の値は本環境では一次資料に当たっていない(未照合)', 'エンジン・内蔵の本へは入れない(AN712)']);
/** 器の宣言(表に出す点) */
export const PLAN = Object.freeze({ t1: '天体 7 × 分け方 13', t2: '則 3 × C_b の読み 3 × 結びつきの係数 3(木星・金星・イオ)', t3: '天体 7(基準の組)', win: '則 3 × C_b の読み 3 × 分け方 13',
  t4: '木星・金星 × 符号 2 × 則 3 × 向ける先 3' });

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const D = L.DECL, nSplit = Object.values(D.splits).reduce((s, a) => s + a.length, 0);
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 7,
    t1: J.t1.length === D.bodies.length * nSplit && J.t1.every((r) => r.spinW >= 0 && r.heat >= 0 && r.residERel < 1e-12),
    t2: J.t2.length === D.laws.length * D.cbReadings.length * D.kPicks.length,
    t3: J.t3.length === D.bodies.length && J.t3.every((r) => r.tauParMax > 0 && r.residLMax === r.tauParMax),
    win: J.win.length === D.laws.length * D.cbReadings.length * nSplit && J.win.every((w) => w.outside || w.openK1 === false),
    t4: J.t4.length === D.t4Bodies.length * D.targetSigns.length * D.laws.length && J.t4.every((r) => r.galShare < 1e-9 && r.bothOverSunMinus1 < 1e-4 && r.sets.every((q) => q.power === 0)),
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const ctx = L.makeCtx(); mark('ctx');
  const PS = L.pureScenes(ctx), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const t1 = L.t1Table(ctx), t2 = L.t2Table(ctx), t3 = L.t3Table(ctx); mark('t123');
  const win = L.windowTable(ctx); mark('win');
  const t4 = L.t4Table(ctx); mark('t4');
  const J = { band: ctx.KB.band, kLo: ctx.KB.kLo, kHi: ctx.KB.kHi, pure, t1, t2, t3, win, t4, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w342e-powerball.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W342E_OUT ? (path.isAbsolute(process.env.W342E_OUT) ? process.env.W342E_OUT : path.join(ROOT, process.env.W342E_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第342便e powerball(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w342e-powerball.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-18 —— 第141報の回答 AN803)「…ジャイロトルクで動かなかった分のエネルギーは消えない。熱になるか、自転速度を増す。自転速度を増す経路が「パワーボール効果」」・AN812・AN813・統括の検証項目 R376',
    decl: L.DECL, lit: L.LIT, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第342便e', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'powerball', engine: 'Node(html を読まない —— 純関数の lib の表・窓の 2 分・ベクトルの和)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
