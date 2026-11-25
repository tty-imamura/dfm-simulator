// 第353便zf(原仮定者の回答(2026-11-25 —— 第151報)「向きと幾何」・「銀河由来の背景軸引きずりの大きさ」・AN1034・AN1039・AN1045・AN1046・AN1058・統括の検証項目 R496):
//   **主の列の候補を 3 本に並べた 1 枚の器 —— (ア) 規則の係数そのまま・背景 0.98/(イ) 規則の係数を λ 倍(源と受け手に同じ)・背景 0.98/
//   (ウ) 規則の係数そのまま・背景を金星の条件の大きさに —— 表 1 題 × 3 列/表 2 (イ) を換算の係数で書くか規則の係数で書くかで動く所**
//   (段 threecols-353zf —— 正本 tests/out/threecols-353zf.json・lib tests/lib-w353zf-threecols.mjs)。
//   **診断だけ** —— 主の列は選ばない(3 列の表)。エンジン・内蔵の本・受理器・前の便の lib の本文と正本と段は変えない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w353zf-threecols.mjs —— 領域の宣言なし)。入力のファイルなし。1 プロセス。正本は第338便c の settleRun で書く。
// 呼ぶ lib(第353便q・u・za)の閉包に仮の値の lib(第352便b)が入る —— 正本の最上位に provisional: true と、閉包の lib が使う鍵の一覧を置く(歳差の率の残りと回る向きの題だけが読む)。
//
// ■ 探索の方針(第138報): 式の形は走行の前に決め打ちしない —— 正本の先頭(decl・plan)は、走らせたノブの格子と判定の物差しの記録。
// ■ 判定の物差し(零試験 9): 便の始めの数え直し 6 の数・k の 3 乗根・第353便q の localUnit と表 4・第353便j の副作用・第353便k の axStd と planeStd・(ウ) の k = 1・拒否。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as E from './lib-w347e-spintorque.mjs';
import * as L from './lib-w353zf-threecols.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w353zf-threecols-1';
export const OUT_MAIN = 'tests/out/threecols-353zf.json';
export const TARGET = 'tests/lib-w353zf-threecols.mjs';
/** 版の履歴(結果を見て変えた所 —— 理由つき) */
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '主の列を (ア)(イ)(ウ) のどれかに選んだのではない —— 同じ題を 3 列で並べた表(判定はしない)',
  '背景の大きさは置いていない(AN1058 —— 窓のまま)—— 0.98 と金星の条件の大きさは列の名',
  '規則の係数の倍 λ は換算の係数 k の言い換えの候補 —— 規則の係数の値を替えたのではない',
  '物差しは文献の値・未照合・歳差の率の残りと回る向きは仮の値(仮・未照合)・重力の側の潮汐のトルクの列は比べる列(DFM の式ではない)',
  'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない(AN712)']);
export const PROV_KEYS = Object.freeze(['earth.precSense', 'earth.psiA.rate', 'mars.prec.rate']);
/** 器の宣言(表に出す点) */
export const PLAN = Object.freeze({ pure: '零試験 9', t1: '表 1: 題 × 3 列((ア)(イ)(ウ))—— 値と、物差しが在る題は値 ÷ 物差し・列ごとの数(0.1〜10 倍に入る・越える・届かない・物差しの無い)',
  t2: '表 2: (イ) を換算の係数(局所の (S) の項だけ)で書くか規則の係数の倍 λ(源と受け手の半径)で書くかで動く所 —— 受け手ごとの局所の倍・題ごとの比・頭打ちの境・回答の基準の輪の場と慣性モーメントの読み' });

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const ok = (x) => typeof x === 'number' && Number.isFinite(x);
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 9,
    t1: J.t1.cols.length === 3 && J.t1.rows.length === 35 && J.t1.rows.every((r) => r.cells.length === 3) && J.t1.rows.filter((r) => r.ruler !== null).length === 11 && J.t1.count.every((c) => c.inBand + c.over + c.under === 11 && c.noRuler === 24),
    t2: ok(J.t2.lam) && J.t2.recv.length === 12 && J.t2.recv.every((r) => ok(r.gainOverLam3) && ok(r.lamOverK)) && J.t2.topics.length === 11 && J.t2.cap.length === 8 && J.t2.differ.length === 2,
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const T1 = E.t1Table(), GEO = E.geometry();
  const PSc = L.pureScenes(T1, GEO), pure = { scenes: PSc, gates: L.pureGates(PSc) }; mark('pure');
  const t1 = L.table1({ T1, GEO }); mark('t1');
  const t2 = L.table2({ T1, GEO }); mark('t2');
  const J = { pure, t1, t2, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}
/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w353zf-threecols.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}
/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W353ZF_OUT ? (path.isAbsolute(process.env.W353ZF_OUT) ? process.env.W353ZF_OUT : path.join(ROOT, process.env.W353ZF_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第353便zf threecols(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w353zf-threecols.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-25 —— 第151報)「向きと幾何」・「銀河由来の背景軸引きずりの大きさ」・AN1034・AN1039・AN1045・AN1046・AN1058・統括の検証項目 R496', provisional: true, provKeys: PROV_KEYS.slice(), provMark: '仮・未照合(閉包の lib が使う鍵 —— 本器は歳差の率の残りと回る向きの題だけが読む)',
    decl: L.DECL, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第353便zf', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'threecols', engine: 'Node(html を読まない —— 純関数の lib: 〔第353便q〕の topicAt・〔第353便d〕の obRot・〔第353便k〕の ringStdOm・〔第353便u〕の obsRow・〔第353便za〕の kWatch・〔第353便zg〕の aStar を呼ぶ)・入力のファイルは無い',
    notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
