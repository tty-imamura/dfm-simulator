// 第343便c(原仮定者の回答(2026-11-19 —— 第142報の回答 2)AN840・原仮定者の補足(2026-11-19 —— 第142報の回答 2 の補足)・原仮定者の回答(2026-11-19 —— 第143報)AN853「Bに変更する」・
//   統括の検証項目 R380): **T1 時計の因子の引数の B の読みの表(主の列)/T2 シュバルツシルト半径の重力の時計との並び/T3 光の経路 = 質量 0 で無限速度の慣性移動の場合(2 つの読み)/
//   T4 ミューオンの寿命(文献の値・未照合)/T5 〔第342便b〕の連鎖律の文の訂正 —— 足りない項を入れた読み**
//   (段 clockread-343c —— 正本 tests/out/clockread-343c.json・lib tests/lib-w343c-clockread.mjs)。**診断だけ** —— エンジン・時計の式・運動の式・光線・内蔵の本・受理器・既存の lib の本文は変えない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w343c-clockread.mjs —— 領域の宣言なし)・入力のファイルは無い。1 プロセス。
//
// ■ 走らせたノブの格子と判定の物差し(正本の先頭 —— 式の形の宣言ではなく、何を測ったかの記録)
//   T1: 形の族 (1 + s²/(2k))^(−k) の k ∈ {0.25, ½, 1, 2, ∞} × B の読み(s = y)の x(y)(y ∈ {0.5, 1, 2, 4, 8, 16})・最大の x・y → ∞ の x・絶対時間の速さ x ∈ {0.1, 0.3, 0.5} で書き直した時計(2 つの枝)。物差し: なし(形の表)。
//   T2: 静止の時計 e^(−ψ) の r = r_s(ε/r_s ∈ {0, 0.1, 0.5}・ψ₀ ∈ {0, 0.05})と、形ごとの y = 1 の値・x → 1 の値。物差し: e^(−½)。
//   T3: 2 つの読み × k × 駆動のべき n ∈ {0, 1, 2} の極限(解析)と有限の列 s ∈ {1, 2, 4, 8} の絶対時間の速さ・曲がり ÷ 光・飛行の時間 ÷(L ÷ c_loc)。数値の走り 16 本(衝突径数 1e5 μ)。物差し: 今のアプリの光。
//   T4: 2 つの読み × k のミューオンの寿命の見込み。物差し: 文献の値(未照合)64.419 ± 0.058 µs。
//   T5: 型 F・U1・U2・U3 の連鎖律の第 2 項の割合と係数 f(x ∈ {0.1, 0.5, 0.9, 0.99})・到達の時間(x ∈ {0.5, 0.9, 0.99})をべき 2 の列と並べる。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w343c-clockread.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w343c-clockread-1';
export const AMEND = Object.freeze([]);
export const OUT_MAIN = 'tests/out/clockread-343c.json';
export const TARGET = 'tests/lib-w343c-clockread.mjs';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze(['時計の型を結論しない(2 つの読み × 形の族の表まで —— 今のアプリの点の時計と表面の時計は局所光速で止まる形のまま)',
  'ミューオンの文献の値(未照合)で形を採用・棄却しない(比べる仮定を明記した見込みの表)',
  '光の経路を結論しない(加速 × g^n を重力の加速にも当てた宣言ごとの曲がり・速さ・飛行の時間の表 —— アプリの光線は変えない)',
  '「無限速度」と「局所光速」が同じとは結論しない(k = ½ の形の B の読みが局所光速で止まる型と同じ時計になる恒等式を事実として書く)',
  '光速を、引きずりの候補の採否に使わない(本器の速さは場に対する物質の相対の速さ —— 座標を運ぶ速さは切らない)']);
export const PLAN = Object.freeze({ readB: '主の列(原仮定者の回答(2026-11-19 —— 第143報)AN853 = B): 形を当事者時間で測った速さ y = w ÷(c_loc g)の関数として与える',
  readA: '比べる列: 形を絶対時間で見た速さ x = w ÷ c_loc の関数として与える(第342便b の表)',
  drive: Object.freeze({ 0: '今のアプリの力学(時計の因子を加速に掛けない)', 1: '第342便b のべき 1(dw/dτ = a*)', 2: '第342便b のべき 2(時計の進みの二乗を掛ける、別の駆動の宣言)' }) });

export function partT1() { return L.t1Rows(); }
export function partT2() { return L.t2Rows(); }
export function partT3() { return L.t3Rows(); }
export function partT4() { return L.t4Rows(); }
export function partT5() { return L.t5Rows(); }

export function gatesOf(J) {
  const r1 = (k) => J.t1.rows.find((r) => r.k === k), f2 = (k) => J.t2.forms.find((r) => r.k === k);
  const r4 = (read, k) => J.t4.rows.find((r) => r.read === read && r.k === k);
  const r3 = (read, k, n) => J.t3.rows.find((r) => r.read === read && r.k === k && r.n === n);
  return {
    pure: Object.values(J.pure.gates).every(Boolean),
    t1Shape: r1(0.25).monotone && r1(0.5).monotone && !r1(1).monotone && !r1(2).monotone && !r1('inf').monotone
      && r1(0.25).xLimit === 'inf' && r1(0.5).xLimit === 1 && [1, 2, 'inf'].every((k) => r1(k).xLimit === 0)
      && Math.abs(r1(1).xMax - Math.SQRT1_2) < 1e-12 && Math.abs(r1('inf').xMax - Math.exp(-0.5)) < 1e-12,
    t1Same: J.t1.same.find((s) => s.k === 0.5).sameAs.join() === 'F' && J.t1.same.filter((s) => s.k !== 0.5).every((s) => s.sameAs.length === 0),
    t2Values: Math.abs(f2(0.5).aAtY1 - Math.SQRT1_2) < 1e-15 && Math.abs(f2(1).aAtY1 - 2 / 3) < 1e-15 && Math.abs(f2('inf').aAtY1 - Math.exp(-0.5)) < 1e-15
      && f2('inf').escapeSameForm === true && Math.abs(J.t2.rs[0].clock - Math.exp(-0.5)) < 1e-15,
    t3Limits: r3('B', 0.5, 0).limit.speed === 1 && r3('B', 0.5, 0).limit.bend === 0.5 && r3('B', 0.5, 1).limit.bend === 0 && r3('B', 1, 1).limit.bend === 0.25
      && r3('B', 1, 1).limit.speed === 0 && J.t3.rows.filter((r) => r.read === 'A').every((r) => r.limit.speed === 'inf' && r.limit.bend === 0)
      && J.t3.rows.every((r) => r.sameAsLight === false) && J.t3.appRatio === 0.5,
    t3Num: J.t3.numRel < 1e-3,
    t4Muon: Math.abs(J.t4.F.tauUs - 64.437) < 0.001 && Math.abs(r4('B', 0.5).tauUs - J.t4.F.tauUs) < 1e-6 && [1, 2, 'inf'].every((k) => r4('B', k).note === 'unreached')
      && Math.abs(r4('A', 0.5).tauUs - 3.106) < 0.001 && Math.abs(r4('A', 1).tauUs - 3.294) < 0.001 && Math.abs(r4('A', 'inf').tauUs - 3.620) < 0.001,
    t5Chain: J.t5.rows.every((r) => r.share.every((v) => v < 0) && r.f.every((v) => v > 0 && v < 1) && r.tReachFull.every((v, i) => v > r.tReachN2[i])),
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
export const CODE = Object.freeze(['tests/exp-w343c-clockread.mjs', 'tests/lib-w343c-clockread.mjs', 'tests/lib-w342b-clockstop.mjs', 'tests/lib-w341e-lightmass.mjs', 'tests/lib-w333c-mercury3d.mjs', 'tests/lib-w331c-k1scale.mjs', 'tests/lib-w330b-dragweight.mjs', 'tests/lib-w332a-eqband.mjs', 'tests/lib-w340h-thin.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w338c-recheck.mjs']);
export async function main() {
  const t0 = Date.now();
  const OUT = process.env.W343C_OUT ? (path.isAbsolute(process.env.W343C_OUT) ? process.env.W343C_OUT : path.join(ROOT, process.env.W343C_OUT)) : path.join(ROOT, OUT_MAIN);
  console.log('第343便c clockread(版 ' + HARNESS_VERSION + ')');
  const { J: R, recheck } = runSettled();
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w343c-clockread.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-19 —— 第142報の回答 2)AN840「…主とする案は、無限速度で当事者時間が止まり、局所光速での時間の速さは、シュバルツシルト半径の重力における時間の速さを参考にする。光の経路については、無限速度の場合を確認する」・'
      + '原仮定者の補足(2026-11-19 —— 第142報の回答 2 の補足)「光の経路は、質量ゼロで無限速度の慣性移動の場合を確認する」・原仮定者の回答(2026-11-19 —— 第143報)AN853「Bに変更する」・統括の検証項目 R380',
    decl: L.DECL, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第343便c', target: TARGET, code: CODE, inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'clockread', engine: 'Node の純関数だけ(html を読まない・エンジンの步を進めない —— 第342便b と第341便e の器を呼ぶ)', notClaim: NOT_CLAIM, recheck });
  writeJson(OUT, out);
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();
