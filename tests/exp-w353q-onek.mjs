// 第353便q(原仮定者の回答(2026-11-25 —— 第151報)・統括の検証項目 R481):
//   **1 つの換算の係数で全部の題を並べる器 —— 表 1 組ごとの k(注目の列 u = 0.98 で金星を打ち消す k)と題 11 × 組 6 の「k を掛けた値 ÷ 物差し」・物差しの桁に入る題の数/
//   表 2 環が物差しと同じ率になる k ÷ 金星の k(区分 5 × 作り 2 × 受け手の半径を当てる/当てない)と題ごとの比/表 3 食い違う題(10 倍を越える・1/10 に届かない)と副作用の受け手・零試験 12**
//   (段 onek-353q —— 正本 tests/out/onek-353q.json・lib tests/lib-w353q-onek.mjs)。**診断だけ** —— エンジン・内蔵の本・受理器・既存の lib の本文は変えない。physics の鍵を足さない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w353q-onek.mjs —— 領域の宣言なし)。入力のファイルは無い(lib を呼んで作り直す)。
//   1 プロセス。正本は第338便c の settleRun で書く。仮の値は第352便b の器の数だけ(歳差の率の残り —— 正本の最上位に provisional: true と鍵の一覧)。
//
// ■ 言わないこと: 係数が決まった・環が説明できた・計算が合った、と書かない(同じ k を掛けたときの桁の表)。物差しは文献の値・未照合。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as Q from './lib-w353q-onek.mjs';
import * as E from './lib-w347e-spintorque.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w353q-onek-1';
export const OUT_MAIN = 'tests/out/onek-353q.json';
export const TARGET = 'tests/lib-w353q-onek.mjs';
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '同じ換算の係数 k を全部の題に掛けたときの桁の表 —— k・c_R・σ を決めない(どの組も候補)',
  '物差し(環の率・23°・熱・潮汐のトルク・歳差の率の残り)は文献の値か仮の値(未照合)—— 比べる列で、合わせない。「物差しの桁」(0.1〜10)は目安で合否ではない',
  '重力の側の潮汐のトルクの列(歳差の率の残りの基準・潮汐ロックの物差し)は比べる列(DFM の式ではない)',
  '局所 ÷ 背景の題(イオ・月・水星)は、1 に近いほど局所と背景が同じ大きさ —— イオでは打ち消しの側・水星と月では副作用の側(同じ物差しで読みが違う)',
  'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない']);
export const PLAN = Object.freeze({
  pure: '零試験 12(第353便j の kFor・sideRow・ioRow と同じ・第353便h の axialRow と第353便k の t1Row と同じ・公転面 = 第352便za・軸引きずりの率 = 第353便f の dragRate・要る c = 第353便m・傾きと熱とロック = 第352便za の topicCell・金星の局所 ÷ 背景 = 1・基準軸 L と端・拒否)',
  t1: '表 1: 組 6 の k と題 11 × 組 6 の値(k を掛けた局所の量 ÷ 物差し)と背景を含む値・物差しの桁(0.1〜10)に入る題の数',
  t2: '表 2: 環の要る k ÷ 金星の k(区分 5 × 作り F1・F2 × 受け手の半径を当てる/当てない)・題ごとの比',
  t3: '表 3: 組ごとに 10 倍を越える題・1/10 に届かない題・副作用の受け手(局所 ÷ 背景 > 0.1)',
});
export const PROV_KEYS = Object.freeze(['earth.psiA.rate', 'mars.prec.rate']);
const SIDE_J = Object.freeze(['Mercury', 'Earth', 'Mars', 'Moon', 'Io']);   // 第353便j の表 2(どの組でも 0.1 を越える受け手 —— 金星を除く)

export function gatesOf(J) {
  const D = Q.DECL, nS = D.sets.length, nT = D.topics.length;
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 12,
    t1: J.t1.ks.length === nS && J.t1.rows.length === nT && J.t1.rows.every((r) => r.cells.length === nS) && J.t1.count.length === nS
      && J.t1.count.every((c, i) => c === J.t1.rows.filter((r) => r.cells[i].inBand).length) && J.t1.ks.every((k) => k.k > 0 && k.residEqual < 0.021),
    t2: J.t2.ring.length === D.rings.length * 4 && J.t2.ring.every((r) => r.cells.length === nS && r.cells.every((c) => Math.abs(c.ratio * c.v - 1) < 1e-9)),
    t3: J.t3.length === nS && J.t3.every((r) => r.over.length + r.under.length + r.within.length === nT),
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const T1 = E.t1Table(), GEO = E.geometry(), o = { T1, GEO, cache: {} }; mark('input');
  const PS = Q.pureScenes(T1, GEO), pure = { scenes: PS, gates: Q.pureGates(PS) }; mark('pure');
  const t1 = Q.table1({}, o); mark('t1');
  const t2 = { ...Q.table2({}, o), topics: t1.rows.map((r) => ({ topic: r.topic, ratio: r.cells.map((c) => c.ratio) })) }; mark('t2');
  const t3r = Q.table3({}, o), t3 = t3r.map((r) => ({ ...r, sameAsJ: JSON.stringify(r.side) === JSON.stringify(SIDE_J) })); mark('t3');
  const J = { pure, t1, t2, t3, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w353q-onek.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W353Q_OUT ? (path.isAbsolute(process.env.W353Q_OUT) ? process.env.W353Q_OUT : path.join(ROOT, process.env.W353Q_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第353便q onek(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const RS = Q.residOf();
  const out = { version: HARNESS_VERSION, libVersion: Q.LIB_VERSION, generator: 'tests/exp-w353q-onek.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-25 —— 第151報)・統括の検証項目 R481', provisional: true, provKeys: PROV_KEYS.slice(), provMark: RS.provMark,
    decl: Q.DECL, sets: Q.SETS, topics: Q.TOPICS, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第353便q', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'onek', engine: 'Node(html を読まない —— 純関数の lib・第353便j・k・h・c・d・f・m・e・第352便w・za・d・k・第351便d・c・f の lib を呼ぶ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
