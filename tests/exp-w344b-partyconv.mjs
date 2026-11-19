// 第344便b(原仮定者の回答(2026-11-19 —— 第143報の回答 2)「当事者時間については、相対的な時間に換算して重力加速度などの加減速を計算する」・
//   原仮定者の回答(2026-11-19 —— 第143報の回答 3)AN876・AN877・統括の検証項目 R386):
//   **T1 換算の 3 つの型〔(α) 速度の増し分・(β) 位置の 2 階・(γ) 対照: キックに q²〕と現行 (0) の近点(n_G 1・2 × 受け手と対称 × 離心率 3 × 刻み 2・連鎖律の第 2 項の効き・第343便b の lib との照合・足した列)/
//   T2 想定 X_k = G₀/c₀² = G_loc/c_loc² の零試験(単位の取り方 4 つ・背景の 3 つの組・閉じた形と数値)と背景の 3 つの組の近点/T3 二次の項(μ 3 つ)/
//   T4 対の力積と仕事(2 体・3 体 × n_G 0・1 × 型 4 + 対に共通の因子の対照 2)と共通の因子の近点**
//   (段 partyconv-344b —— 正本 tests/out/partyconv-344b.json・lib tests/lib-w344b-partyconv.mjs)。**診断だけ** —— アプリの積分・重力の式・時計・内蔵の本・受理器・既存の lib の本文は変えない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w344b-partyconv.mjs —— 領域の宣言なし)・入力のファイルは無い。1 プロセス。
//
// ■ 走らせたノブの格子と判定の物差し(正本の先頭 —— 式の形の宣言ではなく、何を測ったかの記録)
//   (一次の門は |数 − 見込み| < 2e-4 —— 誇張した場 μ = 1e-5 の二次の項が残る〔第343便b と同じ〕。刻みを半分にした差の門は 1e-6。第343便b の lib との照合の門は 1e-9)
//   T1: 型 (0)・(α)・(β)・(γ) × n_G ∈ {1, 2} × 受け手・対称 × e ∈ {0.20563593, 0.0068, 0.055} × 1 周の刻み 3000・6000(a = 1・μ = 1e-5・近点 4 回の差・同じ位置と同じ絶対時間の速度から)。
//   T2: 単位 4(絶対時間・静止の当事者・時計の背景の 3 つの組・動く当事者)× 型 (0)・(α)・(β) × n_G × ψ ∈ {1e-3, 0.1, 0.5} —— 閉じた形と数値(静止は短い落下・動く当事者は右辺)の相対の差 < 1e-4。
//       背景の 3 つの組の近点: e 3 × 型 3 × 組(なし・両方 ψ₀ 0.01・0.1・不揃い ψ₀ 0.01・0.1)—— 一様な倍率を初期の速さに入れて同じ形の軌道から。
//   T3: μ ∈ {1e-5, 2e-5, 4e-5} × 型 (0)・(α)・(β) × n_G ∈ {1, 2}(水星の型の e・受け手・刻み 6000)—— 二次の係数 c₂ を 2 組の差で。
//   T4: 2 体・3 体(第343便b の systemOf)× 対称の型 n_G ∈ {0, 1} × 型 4 と共通の因子 2(RK4 4000 步・2 周)の運動量の残り・仕事の残り(ニュートンの E)・重心の漂い。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w344b-partyconv.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w344b-partyconv-1';
export const AMEND = Object.freeze([]);
export const OUT_MAIN = 'tests/out/partyconv-344b.json';
export const TARGET = 'tests/lib-w344b-partyconv.mjs';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze(['換算の型を決めない(3 つの型と現行を並べる —— どれを採るかは原仮定者へ伺う)',
  '近点の数は誇張した場(μ/a = 1e-5 ほか)の比 —— 水星の観測の値へ合わせたものではない・今の収支(42.98″/世紀)に項を足さない(足した列は別に置く)',
  '想定 X_k = G₀/c₀² = G_loc/c_loc² が成り立つかを結論しない(この単位の取り方・この型・この ψ の作り方では、の表)',
  '場の側の運動量の収支は置いていない(対の力積の残りが場で閉じるとは書かない)',
  'アプリの積分を変える提案は決断事項の候補に置く(本器はアプリに何も入れない)',
  '光速を、候補の採否に使わない(本器の速さは場に対する物質の相対の速さ —— 座標を運ぶ速さは切らない)']);
export const PLAN = Object.freeze({ closed: '(0)・(β) = −2 n_G k/6・(α) = −(2 n_G k + 2)/6・(γ) = −(2 n_G k + 4)/6・共通の因子 = −(2 n_G k + 1)/6(k = 受け手 1・対称 ½)',
  chain: 'd²p/dt² = q² d²p/dτ² + (dq/dt)(dp/dτ)', xk: 'G_loc ÷ c_loc² ÷ X_k = e^(−2 n_G ψ_G + 4 ψ_c) × f × r^(2 − p)(f = 絶対時間に直した因子・r = 単位の時計の進み・p = その単位で時計の進みで割る回数)',
  currentBudget: '−28.65 + 71.63 = 42.98″/世紀(G_loc n_G = 2 受け手 + K1 —— 動かさない)' });

export function gatesOf(J) {
  const t1 = J.t1, t2 = J.t2, t3 = J.t3, t4 = J.t4, bg = J.bg;
  const r4 = (s, k) => t4.rows.filter((r) => r.sys === s && r.kind === k);
  return {
    pure: Object.values(J.pure.gates).every(Boolean),
    t1First: t1.rows.every((r) => Math.abs(r.dClosed) < 2e-4 && r.halfDiff < 1e-6 && r.nPeri === 5),
    t1Chain: t1.chain.every((c) => Math.abs(c.betaMinusGamma - 2 / 3) < 2e-4 && Math.abs(c.betaMinus0) < 1e-4 && Math.abs(c.alphaMinus0 + 1 / 3) < 2e-4),
    t1Cross: t1.cross.every((c) => c.diff < 1e-9),
    t1Mercury: Math.abs(t1.pn.arcsecCy - 42.98) < 0.01,
    t2Null: t2.rows.every((r) => r.rel < 1e-4),
    t2Sets: t2.sets.some((s) => s.unit === 'abs' && s.kind === '0' && s.nG === 2 && s.reading === '格子の全部で 1') && t2.sets.some((s) => s.unit === 'static' && s.kind === 'alpha' && s.nG === 1 && s.restMax < 1e-12),
    bgFirst: bg.rows.every((r) => Math.abs(r.dClosed) < 2e-4) && bg.rows.filter((r) => r.kind !== 'alpha').every((r) => Math.abs(r.dNone) < 1e-5),
    t3Second: t3.rows.every((r) => Math.abs(r.dC1) < 1e-6 && Math.abs(r.c2From14 - r.c2From12) < 1e-2),
    t4Base: ['two', 'three'].every((s) => r4(s, '0').every((r) => r.dP < 1e-12 && r.drift < 1e-12)),
    t4Break: t4.rows.filter((r) => ['alpha', 'beta', 'gamma'].includes(r.kind)).every((r) => r.dP > 1e-4 && r.drift > 1e-4),
    t4Common: t4.rows.filter((r) => L.DECL.common.includes(r.kind)).every((r) => r.dP < 1e-12 && r.drift < 1e-12) && t4.pairImpulse.diff < 1e-12,
    t4CommonApsis: t4.commonApsis.every((r) => Math.abs(r.dClosed) < 2e-4 && r.halfDiff < 1e-6),
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const t1 = L.t1Rows(); mark('t1');
  const t2 = L.t2Rows(); mark('t2');
  const bg = L.bgOrbitRows(); mark('bg');
  const t3 = L.t3Rows(); mark('t3');
  const t4 = L.t4Rows(); mark('t4');
  const J = { pure, t1, t2, bg, t3, t4, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}
/** 正本へ書く形(第338便c の settleRun) */
export function runSettled() {
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const { gates, ok, ...rest } = S.value;
  const J = Object.assign(rest, { timing: tm });
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return { J, recheck: S.meta, gatesRaw: gates, okRaw: ok };
}

const writeJson = (OUT, out) => { fs.mkdirSync(path.dirname(OUT), { recursive: true }); fs.writeFileSync(OUT, JSON.stringify(out, null, 1).replace(/\[\s*(-?[\d.eE+-]+(?:,\s*-?[\d.eE+-]+|,\s*null)*)\s*\]/g, (m, a) => '[' + a.replace(/\s+/g, '') + ']') + '\n'); };
export const CODE = Object.freeze(['tests/exp-w344b-partyconv.mjs', 'tests/lib-w344b-partyconv.mjs', 'tests/lib-w343b-partytime.mjs', 'tests/lib-w342b-clockstop.mjs', 'tests/lib-w341e-lightmass.mjs', 'tests/lib-w333c-mercury3d.mjs', 'tests/lib-w331c-k1scale.mjs', 'tests/lib-w330b-dragweight.mjs', 'tests/lib-w332a-eqband.mjs', 'tests/lib-w340h-thin.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w338c-recheck.mjs']);
export async function main() {
  const t0 = Date.now();
  const OUT = process.env.W344B_OUT ? (path.isAbsolute(process.env.W344B_OUT) ? process.env.W344B_OUT : path.join(ROOT, process.env.W344B_OUT)) : path.join(ROOT, OUT_MAIN);
  console.log('第344便b partyconv(版 ' + HARNESS_VERSION + ')');
  const { J: R, recheck, okRaw } = runSettled();
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w344b-partyconv.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-19 —— 第143報の回答 2)「当事者時間については、相対的な時間に換算して重力加速度などの加減速を計算する」・原仮定者の回答(2026-11-19 —— 第143報の回答 3)AN876「推奨で進める」・AN877「推奨で進める。X_k=G_0/c _0^2=G_loc/c_loc^2、となる想定」・統括の検証項目 R386',
    decl: L.DECL, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...R, okRaw };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第344便b', target: TARGET, code: CODE, inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'partyconv', engine: 'Node の純関数だけ(html を読まない・エンジンの步を進めない —— 自前の RK4 の積分・第343便b の G_loc の因子と時計の型と小さい系と近点・第341便e の RK4 の 1 步と水星の 1PN を呼ぶ)', notClaim: NOT_CLAIM, recheck });
  writeJson(OUT, out);
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();
