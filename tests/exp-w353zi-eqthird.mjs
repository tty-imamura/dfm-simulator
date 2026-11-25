// 第353便zi(原仮定者の回答(2026-11-25 —— 第151報)「向きと幾何」・AN1045・AN1039・統括の検証項目 R498):
//   **等大の半径 a★(〔第353便zg〕)の続きの器 —— 表 1 3 組目の照合(冥王星 ⇄ カロン・地球・火星・天王星・海王星)/表 2 土星の環の区分を帯として読む見込み(置き方 4 × 範囲 2)/
//   表 3 受け手の半径の置き方 9 を替えた a★(イオ・環の粒子 —— 金星も同じ置き方)/表 4 a★ を作る因子と、構造を a★ に置く扁平の倍の冪**
//   (段 eqthird-353zi —— 正本 tests/out/eqthird-353zi.json・lib tests/lib-w353zi-eqthird.mjs)。
//   **診断だけ** —— 衛星や環の位置・背景の大きさは決めない(照合の表 —— 見込みは概算)。エンジン・内蔵の本・受理器・前の便の lib の本文と正本と段は変えない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w353zi-eqthird.mjs —— 領域の宣言なし)。入力のファイルなし。1 プロセス。正本は第338便c の settleRun で書く。仮の値は使わない。
//
// ■ 探索の方針(第138報): 式の形は走行の前に決め打ちしない —— 正本の先頭(decl・plan)は、走らせたノブの格子と判定の物差しの記録。
// ■ 判定の物差し(零試験 7): 〔第353便zg〕の内訳と a★・受け手の質量と置き方 'mass' C0 1・c_R★(〔第353便p〕〔第353便c〕)・(P-場) の x(〔第353便p〕)・2 天体の距離(〔第351便c〕)・拒否。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as E from './lib-w347e-spintorque.mjs';
import * as L from './lib-w353zi-eqthird.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w353zi-eqthird-1';
export const OUT_MAIN = 'tests/out/eqthird-353zi.json';
export const TARGET = 'tests/lib-w353zi-eqthird.mjs';
/** 版の履歴(結果を見て変えた所 —— 理由つき) */
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  'イオの道やカッシーニの間隙・カロンの道の位置を、等大の半径で書き換えたのではない —— リポジトリの半径の数と a★ を並べた照合の表',
  '3 組目の照合の有無から、背景の大きさや a★ の意味を選び出したのではない —— 2 組の並びと偶然の並びの区別はついていない(見込みは置き方に依る概算)',
  '受け手の半径の置き方の表は、置き方ごとの a★ の動き —— 置き方を選んだ表ではない',
  '扁平の倍の冪の表は、いまの式の冪の勘定 —— 冪を選んだ表ではない',
  'カッシーニの間隙の成り立ちには触れない —— 環の区分の内縁と外縁は〔第338便d〕の表の数(文献の値・未照合)',
  '質量・距離・自転の周期・扁平率・衛星と環の半径はリポジトリに在る数(文献の値・未照合)だけ。環の粒子の大きさと密度はノブ(値は未照合)',
  'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない(AN712)']);
/** 器の宣言(表に出す点) */
export const PLAN = Object.freeze({ pure: '零試験 7', t1: '表 1: 3 組目の照合 —— 木星 → イオ・土星 → カッシーニの間隙(扁平の倍 3 通り)・冥王星 → カロンの道・カロン → 冥王星の道(重心のまわりと 2 天体の距離)・地球 → 月・火星 → フォボスとダイモス・天王星 → ε 環・海王星(行なし)。±5% と ±50%',
  t2: '表 2: 土星の環の区分(内縁〜外縁)と木星のガリレオ衛星の道 ± 間隔の割合を帯として、a★(3 通り)の入る帯と見込み(置き方 4 × 観測の半径の 1〜30 倍・1〜10 倍)',
  t3: '表 3: 受け手の半径の置き方 9(規則の半径・(P-場) c_R 1e-3・0.0128・c_R★ の 0.195 倍と 1 倍・質量に比例 C0 ÷ Y_k 1・1e5・5.99e5・(P-応))でイオ ← 木星と環の粒子 ← 土星の a★ と照合の比',
  t4: '表 4: a★ を作る因子(金星の道・質量の比・自転の率の比の 1/3 乗・幾何の因子・太陽由来の分)と、構造を a★ に置く扁平の倍の冪 n(イオ・カッシーニの間隙・A 環・B 環)とその n での他方の比' });

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const D = L.DECL, ok = (x) => typeof x === 'number' && Number.isFinite(x);
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 7,
    t1: J.t1.rows.length >= 14 && J.t1.rows.every((r) => ok(r.aStar) && ok(r.overRo)) && J.t1.rows.filter((r) => r.r !== null).every((r) => ok(r.ratio) && ok(r.x)),
    t2: J.t2.inBand.length === D.nList.length && J.t2.probs.length === 4 * D.ranges.length && J.t2.probs.every((p) => ok(p.pJ) && ok(p.pS) && ok(p.both)),
    t3: J.t3.rows.length === D.places.length && J.t3.rows.every((r) => ok(r.io.aStar) && ok(r.ring.aStar) && ok(r.io.ratio) && ok(r.ring.ratio)),
    t4: J.t4.fac.length === 3 && J.t4.fac.every((f) => ok(f.aStar) && ok(f.prod)) && J.t4.need.length === 4 && J.t4.need.every((q) => ok(q.n)) && J.t4.cross.length === 2,
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const T1 = E.t1Table(), GEO = E.geometry();
  const PSc = L.pureScenes(T1, GEO), pure = { scenes: PSc, gates: L.pureGates(PSc) }; mark('pure');
  const t1 = L.table1(T1, GEO); mark('t1');
  const t2 = L.table2(T1, GEO); mark('t2');
  const t3 = L.table3(T1, GEO); mark('t3');
  const t4 = L.table4(T1, GEO); mark('t4');
  const J = { pure, t1, t2, t3, t4, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}
/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w353zi-eqthird.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}
/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W353ZI_OUT ? (path.isAbsolute(process.env.W353ZI_OUT) ? process.env.W353ZI_OUT : path.join(ROOT, process.env.W353ZI_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第353便zi eqthird(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w353zi-eqthird.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-25 —— 第151報)「向きと幾何」・AN1045・AN1039・統括の検証項目 R498',
    decl: L.DECL, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第353便zi', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'eqthird', engine: 'Node(html を読まない —— 純関数の lib: 〔第353便zg〕の aStar・partsAt・〔第353便k〕の ringStdOm・〔第353便p〕の rotP・〔第353便c〕の rateMult を呼ぶ)・入力のファイルは無い',
    notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
