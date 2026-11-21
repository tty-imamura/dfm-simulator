// 第347便d(原仮定者の回答(2026-11-21 —— 第145報)「AN909: 推奨で進める」・統括の検証項目 R403):
//   **T1 引きずりの 3 体(太陽–地球–月の型・水星の型 + 木星の型 —— 宣言 D0〜D3 の近点と交点の率・重心の漂い・E と角運動量の残り・第344便d の 2 体の数に戻る極限)/
//   T2 長い走り(2 体を周期の 1e3・1e4・1e5 倍 —— 帳簿 E_mod の残りが時間に比例して積むか有界か・刻み 2 つ)/T3 重力の換算 (α) と D0 の組を現行の近似 (0) と D0 の組と並べる**
//   (段 draglong-347d —— 正本 tests/out/draglong-347d.json・lib tests/lib-w347d-draglong.mjs)。**診断だけ** —— アプリの引きずり・重力・時計・積分・内蔵の本・受理器・既存の lib の本文は変えない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w347d-draglong.mjs —— 領域の宣言なし)・入力のファイルは無い。1 プロセス。
//
// ■ 走らせたノブの格子と判定の物差し(正本の先頭 —— 式の形の宣言ではなく、何を測ったかの記録)
//   T1: 系 2(太陽–地球–月の型〔質量 1e-3・1e-5・1e-7・月の軌道 a = 0.05・e = 0.055・傾き 5°・外の 10 周〕・水星の型 + 木星の型〔太陽 1e-4・水星の型 a = 1・e = 0.2056・傾き 7°・
//       木星の型 1e-7・a = 3・外の 4 周〕)× 引きずり なし・D0〜D3 × 内側の周期の刻み 2(160・320/400・800)。重力はニュートン。率は内側の軌道の LRL のベクトルと角運動量の向きの
//       線形の当てはめ(rad / 内側の周期)。2 体の極限: 水星の型で木星の型の質量を 0 —— 第344便d の試験粒子の近点(μ = 1e-4)と照合。
//   T2: 2 体(第343便b の系)× D0〜D3 × 1 周の刻み 128・256 × 1e3(尺度の走り直しに入る)・1e4 周、D0・D1 × 128・160 × 1e5 周(1 回だけ —— QA は 1e4 周までを走らせ直す)。
//       物差し: 帳簿 E_mod = E − m₁m₂K/(2r²)(D0 で保たれる量)の残り ÷ |E₀| の 10 倍ごとの窓の最大・平均・傾き。
//   T3: 試験粒子(中心は固定)× 重力 (0)(指数 2)・(α)(指数 1)× 引きずり なし・D0・D1 × 1 周 3000・6000 刻み(μ = 1e-5)・二次の読み μ = 1e-4・2e-4・4e-4。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w347d-draglong.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w347d-draglong-1';
export const AMEND = Object.freeze([]);
export const OUT_MAIN = 'tests/out/draglong-347d.json';
export const TARGET = 'tests/lib-w347d-draglong.mjs';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze(['引きずりの換算が決まったとは書かない(D0 は原仮定者の回答〔AN909〕で主に置いた列 —— 掛ける型 D1〜D3 は比べる列)',
  '引きずりは熱を出さないと確かめられた、とは書かない(この宣言・この長さ・この刻み・この系では、帳簿の残りが有界か時間に比例して積むか、の表)',
  '数は誇張した系の比 —— 水星や月の観測の値へ合わせたものではない・今の収支(42.98″/世紀)に項を足さない',
  'アプリの引きずり・重力・積分を変える提案は決断事項の候補に置く(本器はアプリに何も入れない)',
  '光速を、候補の採否に使わない(座標を運ぶ速さ u は切らない)']);
export const PLAN = Object.freeze({ emod: 'D0 の 2 体: dE/dt = −m₁m₂K (dr/dt)/r³ → E_mod = E − m₁m₂K/(2r²) が保たれる(K = 10 (m₁ + m₂))',
  angmom: 'D0 の多体: M(I + L)⁻¹L が対称なので Σ m U × v = 0(ニュートンの角運動量 Σ m p × v が保たれる)・Σ m U = 0(重心が運ばれない)',
  t3expect: '近点の一次: 重力 −(2 n_G + ℓ + s)/6(現行 ℓ + s = 0 で n_G = 2・(α) で ℓ + s = 2・n_G = 1 —— どちらも −2/3)+ K1 の +5/3 = 1(× 42.98″/世紀)' });

export function gatesOf(J) {
  const t1 = J.t1, t2 = J.t2short, t3 = J.t3, lim = t1.limit;
  const row = (k, d) => t1[k].rows.find((r) => r.drag === d);
  const sm = L.t2Summary(t2.rows), smAt = (d, st) => sm.find((r) => r.drag === d && r.steps === st);
  const [s1, s2] = L.DECL.long.steps;
  return {
    pure: Object.values(J.pure.gates).every(Boolean),
    t1Limit: Math.abs(lim.d0OverPN - lim.ref344dD0) < 5e-3 && Math.abs(lim.d1MinusD0 - lim.ref344dD1MinusD0) < 0.02 * Math.abs(lim.ref344dD1MinusD0) && Math.abs(lim.d0OverPN - lim.k1) < 5e-3,
    t1Bary: ['sem', 'mj'].every((k) => row(k, 'D0').xp < 1e-9 && ['D1', 'D2', 'D3'].every((d) => row(k, d).xp > 1e-7)),
    t1AngMom: row('sem', 'D0').dLmax < 1e-10 && ['D1', 'D2', 'D3'].every((d) => row('sem', d).dLmax > 100 * row('sem', 'D0').dLmax) && row('mj', 'D0').dLmax < 1e-10,
    t1Step: ['sem', 'mj'].every((k) => t1[k].diff.every((d) => Math.abs(d.dPeri - d.dPeriCoarse) < 0.01 * Math.abs(d.dPeri) && Math.abs(d.dNode - d.dNodeCoarse) < 0.01 * Math.abs(d.dNode))),
    t2D0Numeric: smAt('D0', s2).slopeLast < 0 && Math.abs(smAt('D0', s2).slopeLast) < 0.1 * Math.abs(smAt('D0', s1).slopeLast),
    t2Bounded: ['D1', 'D2', 'D3'].every((d) => { const r = smAt(d, s2); return r.maxRfirst > 1e-4 && Math.abs(r.maxRlast / r.maxRfirst - 1) < 0.05; }),
    t2DiffShrinks: ['D1', 'D2', 'D3'].every((d) => Math.abs(smAt(d, s2).dSlope) < 0.25 * Math.abs(smAt(d, s1).dSlope)),
    t3First: t3.rows.every((r) => Math.abs(r.dExpect) < 4e-4 && r.halfDiff < 1e-6),
    t3Ref: t3.ref344dMax < 1e-9,
    t3Second: (() => { const v = t3.slope.map((r) => r.alphaMinusCurD0); return v.every((x) => x < 0 && Math.abs(x / v[0] - 1) < 0.05); })(),
    t3Mercury: Math.abs(t3.pn.arcsecCy - 42.98) < 0.01,
  };
}
/** 長い形(1 回だけ —— 尺度の走り直しに入れない)の門 */
export function longGatesOf(T) {
  const sm = L.t2Summary(T.rows), smL = L.t2Summary(T.longest), [s1, s2] = L.DECL.long.steps, [m1, m2] = L.DECL.long.stepsMax;
  const at = (a, d, st) => a.find((r) => r.drag === d && r.steps === st);
  return {
    d0Numeric: Math.abs(at(sm, 'D0', s2).slopeLast) < 0.1 * Math.abs(at(sm, 'D0', s1).slopeLast),
    bounded1e4: ['D1', 'D2', 'D3'].every((d) => { const r = at(sm, d, s2); return Math.abs(r.maxRlast / r.maxRfirst - 1) < 0.05; }),
    diffShrinks1e4: ['D1', 'D2', 'D3'].every((d) => Math.abs(at(sm, d, s2).dSlope) < 0.1 * Math.abs(at(sm, d, s1).dSlope)),
    d0Numeric1e5: Math.abs(at(smL, 'D0', m2).slopeLast) < 0.5 * Math.abs(at(smL, 'D0', m1).slopeLast),
    diffShrinks1e5: Math.abs(at(smL, 'D1', m2).dSlope) < 0.5 * Math.abs(at(smL, 'D1', m1).dSlope),
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const t1 = L.t1Rows(); mark('t1');
  const t2short = L.t2Short(); mark('t2short');
  const t3 = L.t3Rows(); mark('t3');
  const J = { pure, t1, t2short, t3, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}
/** 正本へ書く形(第338便c の settleRun)+ 長い形を 1 回 */
export function runSettled({ long = true } = {}) {
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const { gates, ok, ...rest } = S.value;
  const J = Object.assign(rest, { timing: tm });
  J.gates = gatesOf(J);
  const t0 = Date.now();
  if (long) { J.t2long = L.t2Long(); J.t2long.summary = L.t2Summary(J.t2long.rows); J.t2long.summaryMax = L.t2Summary(J.t2long.longest); J.t2long.gates = longGatesOf(J.t2long); J.timing.t2long = { wallSec: (Date.now() - t0) / 1000 }; }
  J.ok = Object.values(J.gates).every(Boolean) && (!long || Object.values(J.t2long.gates).every(Boolean));
  return { J, recheck: S.meta, gatesRaw: gates, okRaw: ok };
}

const writeJson = (OUT, out) => { fs.mkdirSync(path.dirname(OUT), { recursive: true }); fs.writeFileSync(OUT, JSON.stringify(out, null, 1).replace(/\[\s*(-?[\d.eE+-]+(?:,\s*-?[\d.eE+-]+|,\s*null)*)\s*\]/g, (m, a) => '[' + a.replace(/\s+/g, '') + ']') + '\n'); };
export const CODE = Object.freeze(['tests/exp-w347d-draglong.mjs', 'tests/lib-w347d-draglong.mjs', 'tests/lib-w344d-dragconv.mjs', 'tests/lib-w343b-partytime.mjs', 'tests/lib-w342b-clockstop.mjs', 'tests/lib-w341e-lightmass.mjs', 'tests/lib-w331c-k1scale.mjs', 'tests/lib-w330b-dragweight.mjs', 'tests/lib-w340h-thin.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w338c-recheck.mjs']);
export async function main() {
  const t0 = Date.now();
  const OUT = process.env.W347D_OUT ? (path.isAbsolute(process.env.W347D_OUT) ? process.env.W347D_OUT : path.join(ROOT, process.env.W347D_OUT)) : path.join(ROOT, OUT_MAIN);
  console.log('第347便d draglong(版 ' + HARNESS_VERSION + ')');
  const { J: R, recheck, okRaw } = runSettled();
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w347d-draglong.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-21 —— 第145報)「AN909: 推奨で進める」(引きずりには当事者時間の因子を掛けない型 D0 を主・掛ける型は比べる列)・原仮定者の回答(2026-11-19 —— 第143報の回答 2)「当事者時間については、相対的な時間に換算して重力加速度などの加減速を計算する」・原仮定者の補足(2026-11-18 —— 第141報)「引きずり自体は、座標変換なので熱を発生しない」・統括の検証項目 R403',
    decl: L.DECL, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...R, okRaw };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第347便d', target: TARGET, code: CODE, inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'draglong', engine: 'Node の純関数だけ(html を読まない・エンジンの步を進めない —— 自前の RK4 の積分・第344便d の宣言と 2 体の移送と試験粒子の近点・第343便b の系・第331便c の K1 の一次・第341便e の RK4 の 1 步と水星の 1PN を呼ぶ)', notClaim: NOT_CLAIM, recheck });
  writeJson(OUT, out);
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), JSON.stringify(out.t2long.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();
