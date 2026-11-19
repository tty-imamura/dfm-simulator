// 第344便c(原仮定者の回答(2026-11-19 —— 第143報の回答 3)AN879「推奨で進める」・原仮定者の回答(2026-11-19 —— 第143報の回答 1)AN866・原仮定者の回答(2026-11-19 —— 第143報)AN853 = B・
//   原仮定者の指示(2026-11-19 —— 第144報)「AN891: 中身を足して進める」・統括の検証項目 R387): **T1 atX1 の定義域/T2 中くらいの速さのイオンの時計の測定(文献の値・未照合)に対する見込み/
//   T3 h の立ち上がりの鋭さのノブ/T4 光の経路(当事者時間で測った速さの読み —— 主の列)/T5 速さ 0.6・0.9 の見込み**
//   (段 clockmid-344c —— 正本 tests/out/clockmid-344c.json・lib tests/lib-w344c-clockmid.mjs)。**診断だけ** —— エンジン・時計の式・運動の式・光線・内蔵の本・受理器は変えない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w344c-clockmid.mjs —— 領域の宣言なし)・入力のファイルは無い。1 プロセス。
//
// ■ 走らせたノブの格子と判定の物差し(正本の先頭 —— 式の形の宣言ではなく、何を測ったかの記録)
//   T1: atX1 の範囲の外 5 つ(k = 0・½・1・∞・−0.25)と範囲の内(k = 0.25・0.4・k*)。物差し: 例外か・k* で e^(−½)。
//   T2: 形 8 つ(今の点の時計の形・1 ノブの族 k = 1・2・∞・k*・2 ノブの族 h1・h2・h3)× x ∈ {0.064, 0.338} の ε の見込み。物差し: 文献の値(未照合)(1.5 ± 2.3)e-9(x = 0.338 だけ)。
//   T3: 有理の型 S(n ∈ {4, 8, 12, 16, 20, 24, 32}・遠くの型 2・c = ½)・対照 c = 0・指数の立ち上がりの型 X(a₀ ∈ {3, 4, 6}・p ∈ {1, 2, 3, 4, 6})の (a)〜(d) と n の下限・速さ 0.5〜0.9 の ε。
//   T4: 形 3 つ × 駆動のべき n ∈ {0, 1} × y ∈ {1, 2, 4, 8, 16} の絶対時間の速さ・飛行の時間・曲がり ÷ 光と解析の極限・比べる列(絶対時間の速さが無限)・数値の走り 2 本(衝突径数 1e5 μ)。
//   T5: 形 8 つ × x ∈ {0.6, 0.9} の ε の見込み(比べる測定の数は書かない)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w344c-clockmid.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w344c-clockmid-1';
export const AMEND = Object.freeze([]);
export const OUT_MAIN = 'tests/out/clockmid-344c.json';
export const TARGET = 'tests/lib-w344c-clockmid.mjs';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze(['時計の形を結論しない(形 × 比べる仮定ごとの見込みの表まで —— 今のアプリの点の時計と表面の時計は局所光速で止まる形のまま)',
  'イオンの測定の文献の値(未照合)で形を採用・棄却しない(見込みと報告の値の差を、報告の不確かさの何倍かで並べるだけ)',
  '光学と原子の遷移の側も変える候補には、この表を流用しない',
  'ノブの範囲の事実を、参考の値に合う形として書かない(形は決めない)',
  '光の経路を結論しない(宣言ごとの速さ・飛行の時間・曲がりの表 —— アプリの光線は変えない)']);
export const PLAN = Object.freeze({ observable: 'ε = √(ν_a ν_p ÷(ν_1 ν_2))− 1(速いイオンに同方向と逆方向の光を当てた 2 つの周波数と静止の 2 つの遷移の周波数)',
  predict: '比べる仮定の下の ε の見込み = g ÷ √(1 − x²) − 1',
  readB: '主の列(原仮定者の回答(2026-11-19 —— 第143報)AN853 = B): 形を当事者時間で測った速さ y の関数として与える(〔第343便c〕と同じ)',
  drive: Object.freeze({ 0: '今のアプリの力学(時計の因子を加速に掛けない)', 1: '第342便b のべき 1(dw/dτ = a*)' }) });

export function partT1() { return L.t1Rows(); }
export function partT2() { return L.t2Rows(); }
export function partT3() { return L.t3Rows(); }
export function partT4() { return L.t4Rows(); }
export function partT5() { return L.t5Rows(); }

export function gatesOf(J) {
  const r2 = (f) => J.t2.rows.find((r) => r.form === f), r3 = (far, n) => J.t3.rows.find((r) => r.far === far && r.n === n);
  const rx = (a0, p) => J.t3.xrows.find((r) => r.a0 === a0 && r.p === p), r4 = (read, f, n) => J.t4.rows.find((r) => r.read === read && r.form === f && r.n === n);
  return {
    pure: Object.values(J.pure.gates).every(Boolean),
    t1Domain: J.t1.outs.every((r) => r.threw === true) && Math.abs(J.t1.dRefKStar) < 1e-12 && J.t1.ins.length === 2,
    t2Values: r2('F').eps.every((v) => v === 0) && Math.abs(J.t2.epsArith - 1.47448e-9) < 1e-14 && Math.abs(r2('h2').eps[1] + 0.0122958) < 1e-7
      && Math.abs(r2('k1').eps[1] + 0.0020904) < 1e-7 && r2('kstar').eps[1] > 0 && ['k1', 'k2', 'kinf', 'h1', 'h2', 'h3'].every((f) => r2(f).eps.every((v) => v < 0)),
    t3Shape: J.t3.rows.every((r) => Math.abs(r.dRef) < 1e-15) && r3('m2n', 4).monotone && r3('m2n', 8).monotone && !r3('m2n', 20).monotone && J.t3.ctrl.every((r) => !r.monotone && r.xLimit === 0)
      && J.t3.nmin.every((q) => q.n1 > 19 && q.n1 < 21 && q.n2 < q.n1) && rx(4, 3).monotone && rx(4, 3).inSig1 && J.t3.joint.length > 0,
    t4Light: J.t4.rows.filter((r) => r.read === 'B').every((r) => r.limit.speed === 1 && r.limit.time === 1 && r.sameAsLight === false)
      && r4('B', 'F', 0).limit.bend === 0.5 && r4('B', 'F', 1).limit.bend === 0 && r4('A', 'F', 0).limit.speed === 'inf' && J.t4.numRel < 1e-3,
    t5Fast: J.t5.find((r) => r.form === 'F').eps.every((v) => v === 0),
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const t1 = partT1(); mark('t1');
  const t2 = partT2(); mark('t2');
  const t3 = partT3(); mark('t3');
  const t4 = partT4(); mark('t4');
  const t5 = partT5(); mark('t5');
  const J = { pure, t1, t2, t3, t4, t5, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}
/** 正本へ書く形(第338便c の settleRun) */
export function runSettled() {
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const { gates, ok, ...rest } = S.value;
  return { J: Object.assign(rest, { timing: tm, gates, ok }), recheck: S.meta };
}

const writeJson = (OUT, out) => { fs.mkdirSync(path.dirname(OUT), { recursive: true }); fs.writeFileSync(OUT, JSON.stringify(out, null, 1).replace(/\[\s*(-?[\d.eE+-]+(?:,\s*-?[\d.eE+-]+|,\s*null)*)\s*\]/g, (m, a) => '[' + a.replace(/\s+/g, '') + ']') + '\n'); };
export const CODE = Object.freeze(['tests/exp-w344c-clockmid.mjs', 'tests/lib-w344c-clockmid.mjs', 'tests/lib-w343c-clockread.mjs', 'tests/lib-w342b-clockstop.mjs', 'tests/lib-w341e-lightmass.mjs', 'tests/lib-w333c-mercury3d.mjs', 'tests/lib-w331c-k1scale.mjs', 'tests/lib-w330b-dragweight.mjs', 'tests/lib-w332a-eqband.mjs', 'tests/lib-w340h-thin.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w338c-recheck.mjs']);
export async function main() {
  const t0 = Date.now();
  const OUT = process.env.W344C_OUT ? (path.isAbsolute(process.env.W344C_OUT) ? process.env.W344C_OUT : path.join(ROOT, process.env.W344C_OUT)) : path.join(ROOT, OUT_MAIN);
  console.log('第344便c clockmid(版 ' + HARNESS_VERSION + ')');
  const { J: R, recheck } = runSettled();
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w344c-clockmid.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-19 —— 第143報の回答 3)「AN879: 推奨で進める」(形は決めず、中くらいの速さでの時計の測定との並びを先に)・'
      + '原仮定者の回答(2026-11-19 —— 第143報の回答 1)「AN866: 推奨で進める。無限速度で当事者時間が止まる場合での、局所光速の時の参考値である。局所光速で当事者時間が止まる場合は、考慮しなくて良い」・'
      + '原仮定者の回答(2026-11-19 —— 第143報)AN853「Bに変更する」・原仮定者の指示(2026-11-19 —— 第144報)「AN891: 中身を足して進める」・統括の検証項目 R387',
    decl: L.DECL, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第344便c', target: TARGET, code: CODE, inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'clockmid', engine: 'Node の純関数だけ(html を読まない・エンジンの步を進めない —— 第343便c・第342便b・第341便e の器を呼ぶ)', notClaim: NOT_CLAIM, recheck });
  writeJson(OUT, out);
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();
