// 第353便p(原仮定者の回答(2026-11-25 —— 第151報)AN1045・統括の検証項目 R480):
//   **打ち消しの点の一覧(第352便v の 17 組)を、源の扁平率((O2b) の σ —— 距離に依らない倍)と受け手の半径の係数((P-場) の c_R)で数え直す器 ——
//   表 1 17 組 × 置き方 7(x・等大の残り・金星の条件での残り・帯に入る組の数)/表 2 イオと金星(木星の f × c_R の格子)/表 3 衛星の受け手の自分の重み**
//   (段 cancelstd-353p —— 正本 tests/out/cancelstd-353p.json・lib tests/lib-w353p-cancelstd.mjs)。
//   **診断だけ** —— 扁平率の式・受け手の係数は決めない。エンジン・内蔵の本・受理器・前の便の lib の本文と正本と段は変えない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w353p-cancelstd.mjs —— 領域の宣言なし)。入力のファイルなし。1 プロセス。正本は第338便c の settleRun で書く。仮の値は使わない。
//
// ■ 探索の方針(第138報): 式の形は走行の前に決め打ちしない —— 正本の先頭(decl・plan)は、走らせたノブの格子と判定の物差しの記録。
// ■ 判定の物差し(零試験 9): (i) が第352便v と同じ(17 組)/(ii) が第353便d の (O2b) の列と同じ/第353便d の obCancel と同じ局所/(iii) が第353便c の cancelOf・ioRows と同じ/
//   太陽を受け手にした場が第352便e の rotOf と同じ/(v) が (i) と同じ/金星の x が 1・f 0 の恒等/c_R★/拒否。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as E from './lib-w347e-spintorque.mjs';
import * as L from './lib-w353p-cancelstd.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w353p-cancelstd-1';
export const OUT_MAIN = 'tests/out/cancelstd-353p.json';
export const TARGET = 'tests/lib-w353p-cancelstd.mjs';
/** 版の履歴(結果を見て変えた所 —— 理由つき) */
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '源の扁平率の式((O2b) を主に置くか)は決めていない —— (O2b) の σ を置いた列と置かない列を並べた',
  '受け手の係数 c_R(全部の受け手に同じ値か、天体ごとか)は決めていない —— 2 つの値の列と格子を並べた',
  'x が帯に入る組の数は、同じ背景で読める組の候補の数え上げ —— イオや月の状態の答えではない',
  '扁平率はリポジトリに在る数(文献の値・未照合)と、ノブ(値は未照合)だけ',
  '衛星の組の数え方(他の源の重みを分母に入れるか)は、2 つの作りを並べた —— どちらかに寄せていない',
  'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない(AN712)']);
/** 器の宣言(表に出す点) */
export const PLAN = Object.freeze({ pure: '零試験 9', t1: '表 1: 17 組 × 置き方 7((i)・(ii)・(iii) c_R 2・(iv) c_R 2・(v))× 欄(x・等大の残り・金星の条件での残り・(G−) の等大の残り〔比べる列〕)と帯 2 つ(0.9〜1.1・0.5〜2)の組の数',
  t2: '表 2: イオと金星 —— 木星の f 7 × c_R 10(規則の半径を含む)の 70 点・イオの x の数え方 3 つ', t3: '表 3: 衛星の受け手の自分の重み —— 円の道の 5 衛星・実在の組 3(c_R★)・イオと月の c_R の走査 5' });

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const D = L.DECL, ok = (x) => typeof x === 'number' && Number.isFinite(x);
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 9,
    t1: J.t1.rows.length === 17 && J.t1.cols.length === L.T1COLS.length && J.t1.rows.every((r) => L.T1COLS.every((c) => ok(r.cells[c.id].x) && ok(r.cells[c.id].resEq) && ok(r.cells[c.id].resAtUV)))
      && J.t1.rows.find((r) => r.key === 'Venus|Sun') && L.T1COLS.every((c) => Math.abs(J.t1.rows.find((r) => r.key === 'Venus|Sun').cells[c.id].x - 1) < 1e-12) && J.t1.counts.length === L.T1COLS.length,
    t2: J.t2.cells.length === D.fGrid.length * D.cRGrid.length && J.t2.cells.every((c) => ok(c.x) && ok(c.venusResEq) && ok(c.xParBare)) && J.t2.best && J.t2.nKeep > 0,
    t3: J.t3.moons.length === D.moons.length && J.t3.moons.every((m) => ok(m.cRStar) && m.cRStar > 0) && J.t3.pairs.length === 3 && J.t3.scan.length === 2,
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const T1 = E.t1Table(), GEO = E.geometry(), cache = {};
  const PSc = L.pureScenes(T1, GEO), pure = { scenes: PSc, gates: L.pureGates(PSc) }; mark('pure');
  const t1 = L.table1(T1, GEO, cache); mark('t1');
  const t2 = L.table2(T1, GEO, cache); mark('t2');
  const t3 = L.table3(T1, GEO, cache); mark('t3');
  const J = { pure, t1, t2, t3, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}
/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w353p-cancelstd.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}
/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W353P_OUT ? (path.isAbsolute(process.env.W353P_OUT) ? process.env.W353P_OUT : path.join(ROOT, process.env.W353P_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第353便p cancelstd(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w353p-cancelstd.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-25 —— 第151報)AN1045・統括の検証項目 R480',
    decl: L.DECL, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第353便p', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'cancelstd', engine: 'Node(html を読まない —— 純関数の lib: 〔第353便d〕の obRot・〔第353便c〕の cancelOf・〔第352便v〕の打ち消しの点の一覧の口を呼ぶ)・入力のファイルは無い',
    notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
