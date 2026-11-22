// 第347便c(原仮定者の回答(2026-11-21 —— 第145報)「AN904: 探索のアプローチを変える。粒子が局所光速に達した時も、自分自身の決定力により、わずかに当事者時間が進む。
//   時間が進む半径と、シュバルツシルト半径を比較する。ガンマ線バーストへの影響も調べる」・統括の検証項目 R402): **T1 局所光速での時計の進みの表(型 S0〜S3 × 物 11 × 外の決定力 3)と
//   イオンの時計の測定(文献の値・未照合)の不確かさの内に収まるノブの範囲/T2 「時間が進む半径」の定義 3 つとシュバルツシルト半径の比/T3 ガンマ線バーストの放出の時刻の幅(光の伝わりは今のまま)/
//   T4 整合の零試験** (段 selfclock-347c —— 正本 tests/out/selfclock-347c.json・lib tests/lib-w347c-selfclock.mjs)。**診断だけ** —— アプリの点の時計・表面の時計・光学・積分・内蔵の本・受理器は変えない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w347c-selfclock.mjs —— 領域の宣言なし)・入力のファイルは無い。1 プロセス。
//
// ■ 走らせたノブの格子と判定の物差し(正本の先頭 —— 式の形の宣言ではなく、何を測ったかの記録)
//   T1: 型 6(S0p・S0s・S1・S2・S3L・S3Q)× 物 11 × 外 3 の局所光速での因子・代表の物 4 × 型 6 × 速さ 5(外は銀河の中)・S0s の止まる速さ。既定のノブ: 重みは物の半径で測る・n = 4・a₁ = a₂ = 1。
//   T1′: イオンの測定(〔第344便c〕の DECL.ion —— 文献の値・未照合)の報告の値 ± 1σ・2σ の内に入るノブの上の限り(S1 の重み・S2 の床 n 3 つ・S3 の床・S0s の自己)とリチウムのイオンへの置き直し。
//   T2: 定義 R1(重み ½)・R2(局所光速の時計がしきい値 e^(−½)・½・1e-3 に届く)・R3(型ごとの長さ)× 外 3 の r ÷ r_s(解析の式と数値)・物理の半径(質量 4 つ)。
//   T3: 噴き出す塊 —— 速さ 5(標準の読みの Γ 10・100・1000・0.99・1)× 床の形 3 × 床 3 と対照/落ち込む物質 —— ψ_c 3 × 速さ 3 × 形 3 × 床 2 と対照 2。
//   T4: 自己 0・遅い極限・0〜1 の内・単調・局所光速の閉じた形・丸め・拒否。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w347c-selfclock.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w347c-selfclock-1';
export const AMEND = Object.freeze([]);
export const OUT_MAIN = 'tests/out/selfclock-347c.json';
export const TARGET = 'tests/lib-w347c-selfclock.mjs';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze(['時計の形を結論しない(型 × ノブ × 物の表まで —— 今のアプリの点の時計と表面の時計は局所光速で止まる形のまま)',
  'どの定義を「時間が進む半径」と読むかを決めない(定義ごとの r ÷ r_s の表)',
  'イオンの測定の文献の値(未照合)で型を採用・棄却しない(ノブの範囲の事実だけ)',
  'ガンマ線バーストの観測の数(未照合)と見込みを照らして結論しない(放出する側の時計だけを変えた列の表)',
  'しきい値 ½・係数 1 で r_s と同じ長さが出る行は宣言の帰結(ψ(r_s) = ½ の置き方)として書く']);
export const PLAN = Object.freeze({ observable: '〔第344便c〕の ε の見込み = g ÷ √(1 − x²) − 1(比べる仮定もそのまま)',
  light: '光の伝わりは今のまま固定(局所光速 c_loc・場は静的)—— 放出する側の時計だけを型で変える(台帳 AN929)',
  arrive: '到着の時刻の幅 = 固有の時間幅 ×(1 ∓ x)÷(N g)× N_obs',
  reading: '「自分自身の決定力」は粒子と一緒に動く —— 粒子は自分の決定力に対しては静止している、と読む(型 S1 の出発点)' });

export function partT1() { return L.t1Rows(); }
export function partIon() { return L.ionRanges(); }
export function partT2() { return L.t2Rows(); }
export function partT3() { return L.t3Rows(); }

export function gatesOf(J) {
  const ac = (b, e) => J.t1.atC.find((r) => r.body === b && r.ext === e), ty = (t) => L.DECL.types.indexOf(t);
  const r2 = (def, type, ext, theta) => J.t2.rows.find((r) => r.def === def && r.type === type && r.ext === ext && r.theta === theta);
  const i1 = J.ion.rows[0];
  return {
    pure: Object.values(J.pure.gates).every(Boolean),
    t1Stop: J.t1.atC.every((r) => r.g[ty('S0p')] === 0 && r.g[ty('S0s')] === 0) && J.t1.atC.every((r) => r.g[ty('S1')] > 0 && r.g[ty('S2')] > 0 && r.g[ty('S3L')] > 0 && r.g[ty('S3Q')] > 0)
      && Math.abs(ac('bh1', 'galaxy').g[ty('S3L')] - 0.5) < 1e-12 && Math.abs(ac('li', 'galaxy').g[ty('S1')] / Math.sqrt(2 * ac('li', 'galaxy').w) - 1) < 1e-9,
    ionRange: Math.abs(i1.S1.epsAt / i1.up - 1) < 1e-6 && Math.abs(i1.S3.epsAt / i1.up - 1) < 1e-6 && i1.S2.every((q) => Math.abs(q.epsAt / i1.up - 1) < 1e-6)
      && i1.S2[0].phiMax < i1.S2[1].phiMax && i1.S2[1].phiMax < i1.S2[2].phiMax && J.ion.same344.F < 1e-15 && J.ion.same344.formula < 1e-15 && J.ion.conv.wNow.every((q) => q.w < i1.S1.wMax),
    t2Radius: J.t2.rows.filter((r) => r.ratio !== null).every((r) => Math.abs(r.ratio / r.closed - 1) < 1e-9) && Math.abs(r2('R2', 'S3L', null, 0.5).ratio - 1) < 1e-12
      && Math.abs(J.t2.rsLine.clockAtRs - Math.exp(-0.5)) < 1e-12 && J.t2.rows.filter((r) => r.def === 'R1').every((r) => r.ratio > 1e4),
    t3Grb: J.t3.s0chk < 1e-12 && J.t3.jet.filter((r) => r.pt === '1').every((r) => (r.shape === 'S0p' ? r.halt === true : r.halt === false && r.arrive === 0))
      && J.t3.fall.filter((r) => r.x === 1).every((r) => (r.shape === 'S0p' || r.shape === 'S0s' ? r.halt === true : r.halt === false && r.away > 0)),
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const t1 = partT1(); mark('t1');
  const ion = partIon(); mark('ion');
  const t2 = partT2(); mark('t2');
  const t3 = partT3(); mark('t3');
  const J = { pure, t1, ion, t2, t3, timing: tm };
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
export const CODE = Object.freeze(['tests/exp-w347c-selfclock.mjs', 'tests/lib-w347c-selfclock.mjs', 'tests/lib-w344c-clockmid.mjs', 'tests/lib-w343c-clockread.mjs', 'tests/lib-w342b-clockstop.mjs', 'tests/lib-w341e-lightmass.mjs', 'tests/lib-w333c-mercury3d.mjs', 'tests/lib-w331c-k1scale.mjs', 'tests/lib-w330b-dragweight.mjs', 'tests/lib-w332a-eqband.mjs', 'tests/lib-w340h-thin.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w338c-recheck.mjs']);
export async function main() {
  const t0 = Date.now();
  const OUT = process.env.W347C_OUT ? (path.isAbsolute(process.env.W347C_OUT) ? process.env.W347C_OUT : path.join(ROOT, process.env.W347C_OUT)) : path.join(ROOT, OUT_MAIN);
  console.log('第347便c selfclock(版 ' + HARNESS_VERSION + ')');
  const { J: R, recheck } = runSettled();
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w347c-selfclock.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-21 —— 第145報)「AN904: 探索のアプローチを変える。粒子が局所光速に達した時も、自分自身の決定力により、わずかに当事者時間が進む。'
      + '時間が進む半径と、シュバルツシルト半径を比較する。ガンマ線バーストへの影響も調べる」・統括の検証項目 R402',
    decl: L.DECL, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第347便c', target: TARGET, code: CODE, inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'selfclock', engine: 'Node の純関数だけ(html を読まない・エンジンの步を進めない —— 第344便c・第342便b の器を呼ぶ)', notClaim: NOT_CLAIM, recheck });
  writeJson(OUT, out);
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();
