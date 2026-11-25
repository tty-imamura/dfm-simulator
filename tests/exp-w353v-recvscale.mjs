// 第353便v(原仮定者の回答(2026-11-25 —— 第151報)AN1045・統括の検証項目 R486):
//   **受け手ごとの構造の係数 —— c_R = r × c_R★(r は全部の受け手に同じ 1 つの倍)を振る器 ——
//   表 1 背景は金星の条件 (uV): σ の有無 2 × r 9(規則の半径 + 0.01〜10)の 17 組の x・帯に入る組・イオと月/走査(金星の残り 2% 以下とイオの x 0.9〜1.1 が同時に入る r)/
//   r → 0 の極限の閉じた形/表 2 注目の列 0.98: 金星を等大にする k(r)と受け手 6 の副作用・水星の回る向きの r の下限/表 3 c_R★ の閉じた形と慣性モーメントの係数の並び**
//   (段 recvscale-353v —— 正本 tests/out/recvscale-353v.json・lib tests/lib-w353v-recvscale.mjs)。
//   **診断だけ** —— 構造の係数は決めない・r を既定に置かない。エンジン・内蔵の本・受理器・前の便の lib の本文と正本と段は変えない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w353v-recvscale.mjs —— 領域の宣言なし)。入力のファイルなし。1 プロセス。正本は第338便c の settleRun で書く。
// 仮の値の数は読まない —— ただし呼ぶ lib(第353便j)の閉包に仮の値の lib(第352便b)が入るので、正本の最上位に provisional: true と、閉包の lib が使う鍵の一覧を置く。
//
// ■ 探索の方針(第138報): 式の形は走行の前に決め打ちしない —— 正本の先頭(decl・plan)は、走らせたノブの格子と判定の物差しの記録。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as E from './lib-w347e-spintorque.mjs';
import * as L from './lib-w353v-recvscale.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w353v-recvscale-1';
export const OUT_MAIN = 'tests/out/recvscale-353v.json';
export const TARGET = 'tests/lib-w353v-recvscale.mjs';
/** 版の履歴(結果を見て変えた所 —— 理由つき) */
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '構造の係数(全部の受け手に同じ c_R か、受け手ごとの c_R★ の倍 r か)は決めていない —— r の走査の表',
  'r は既定に置いていない(恒久の条件「ノブの既定を観測から決めない」)',
  'イオと金星が同時に読める組が在るとは書かない —— 同時に入る点の数え上げ(この場・この置き方では 0)',
  'c_R★ と慣性モーメントの係数の並びは桁の表 —— 当てはめていない',
  '慣性モーメントの係数と扁平率はリポジトリに在る数(文献の値・未照合)だけ・仮の値の数は読まない',
  '太陽の受け手は受け手の半径の口を持たない列(規則の半径のまま)',
  'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない(AN712)']);
/** 器の宣言(表に出す点) */
export const PLAN = Object.freeze({ pure: '零試験 8', t1: '表 1: σ の有無 2 × r 9(規則の半径・0.01・0.03・0.1・0.195・0.3・1・3・10)—— 金星の残り・17 組の x・帯 2 つの組・イオの x と残り・月の x',
  scan: '走査: log10 r = −8〜1(刻み 0.05・181 点)× σ の有無 2 —— 金星の残り ≤ 2% とイオの x 0.9〜1.1 が同時に入る点・イオの x の最小・金星の 2% の端(二分)・月の x が 0.9〜1.1 の幅',
  limit: 'r → 0 の極限(r 1e-8)の x と閉じた形 x(規則の半径)× wS_金星 ÷ wS_受け手(16 組)',
  t2: '表 2: 注目の列 0.98 —— r 9 × 受け手 6(水星・金星・地球・火星・月・イオ)の k(r)・局所 ÷ 背景・合成と L の角・回る向き/水星の回る向きが k 1 と替わらない r の下限(二分)',
  t3: '表 3: c_R★(二分と閉じた形 (3/2)(m/M)(a/R_観測))・m/M・a/R_観測・慣性モーメントの係数・(P-応) の率の倍・順位(12 受け手)' });
export const PROV_KEYS = Object.freeze(['earth.psiA.rate', 'earth.precSense', 'mars.prec.rate', 'venus.prec.rate']);

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const D = L.DECL, ok = (x) => typeof x === 'number' && Number.isFinite(x), nR = D.rGrid.length + 1;
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 8,
    t1: J.t1.cols.length === 2 * nR && J.t1.cols.every((c) => Object.keys(c.x).length === 17 && Math.abs(c.x['Venus|Sun'] - 1) < 1e-12 && ok(c.venusRes) && ok(c.io.x) && c.bands.length === 2),
    scan: J.scan.length === 2 && J.scan.every((s) => s.n === 181 && ok(s.ioMin.x) && Math.abs(s.venusEdge2 * 0.0657 / 0.0128 - 1) < 0.01),
    limit: J.limit.length === 16 && J.limit.every((r) => Math.abs(r.xSmall / r.closed - 1) < 1e-3),
    t2: J.t2.cols.length === nR && J.t2.cols.every((c) => c.rows.length === D.sideRecvs.length && Math.abs(c.rows.find((x) => x.key === 'Venus').locOverBg - 1) < 1e-9) && (J.merc.r === null || ok(J.merc.r)),
    t3: J.t3.rows.length === 12 && J.t3.rows.every((x) => ok(x.cRStar) && Math.abs(x.closed / x.cRStar - 1) < 1e-6) && J.t3.n === 10,
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const T1 = E.t1Table(), GEO = E.geometry(), cache = {};
  const PSc = L.pureScenes(T1, GEO), pure = { scenes: PSc, gates: L.pureGates(PSc) }; mark('pure');
  const t1 = L.table1(T1, GEO, cache); mark('t1');
  const scan = L.scanBoth(T1, GEO, {}, cache); mark('scan');
  const limit = L.limitRows(T1, GEO, {}, cache); mark('limit');
  const t2 = L.table2(T1, GEO, cache), merc = L.mercuryEdge(T1, GEO, {}, cache); mark('t2');
  const t3 = L.table3(T1, GEO, cache); mark('t3');
  const J = { pure, t1, scan, limit, t2, merc, t3, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}
/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w353v-recvscale.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}
/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W353V_OUT ? (path.isAbsolute(process.env.W353V_OUT) ? process.env.W353V_OUT : path.join(ROOT, process.env.W353V_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第353便v recvscale(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w353v-recvscale.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-25 —— 第151報)AN1045・統括の検証項目 R486', provisional: true, provKeys: PROV_KEYS.slice(), provMark: '仮・未照合(閉包の lib が使う鍵 —— 本器は値を読まない)',
    decl: L.DECL, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第353便v', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'recvscale', engine: 'Node(html を読まない —— 純関数の lib: 〔第353便p〕の stdCancel・〔第353便j〕の kFor と sideRow・〔第353便c〕の cRStar を呼ぶ)・入力のファイルは無い',
    notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
