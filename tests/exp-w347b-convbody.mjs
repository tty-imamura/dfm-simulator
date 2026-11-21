// 第347便b(原仮定者の回答(2026-11-21 —— 第145報)「AN902: 推奨で進める。現状も近似として比較可能にする」・統括の検証項目 R401):
//   **当事者時間の換算の多体 —— (0)「現行の近似」・(α) 主の候補・(β) 比べる列を並べる器**
//   T1 太陽–地球–月の型の 3 体(無次元と実の比・ε 2 点・刻みと窓の幅・枠 3 つ —— 絶対・今の点の時計・主星)/T2 金星の型と水星の型(試験粒子の第344便b との照合・外の摂動の天体を足した多体)/
//   T3 時計に入れる背景(アプリの水星の本の背景の値での大きさ)/T4 場の側の運動量の帳簿(2 体・3 体)/T5「現行の近似」の表(8 惑星 + 月の型)
//   (段 convbody-347b —— 正本 tests/out/convbody-347b.json・lib tests/lib-w347b-convbody.mjs)。**診断だけ** —— アプリの積分・重力の式・時計・内蔵の本・受理器・既存の lib の本文は変えない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w347b-convbody.mjs —— 領域の宣言なし)・入力のファイルは無い。1 プロセス。
// 正本の作り方: 純関数の場面・T3・T5 は第338便c の settleRun(±ulp の走り直しで丸めの残りを 0 に)/T1・T2・T4 は 1 回の走り(差の時系列の率 —— 刻みと窓の幅を表に載せる。
//   ±ulp の走り直しは 60 s に収まらないため行わない —— 照合は QA の門と正本の自己一致で)。
//
// ■ 判定の物差し(式の形の宣言ではなく、何を測ったかの記録)
//   T1: 率は「型 − ニュートン」(同じ刻み・同じ初期の状態)を、差の時系列 Δy に [1, t, t (y_N′ − 平均)] を最小二乗で当てた t の係数で(固定の係数で平均の運動の速さが違う分の一次の漏れを除く)。
//       一次の係数 c₁ = 量 ÷ ε を ε の 2 点から外挿・幅 = 刻みを倍・窓を倍にしたときの量 ÷ ε の動きの最大(幅は二次の漏れ・長い周期の項の残りを含む —— 二次の係数 c₂ は幅より小さいときは読まない)。
//   T2: 近点の進み ÷ 1PN(第344便b と同じ測り方)—— 試験粒子の照合の門は 1e-8・多体は (型 − ニュートン)÷ 1PN。
//   T5: (0) 指数 2 − (α) 指数 1 の近点 ÷ 1PN = 解析の一次 0 + 数値の二次 c₂ ψ(μ 3 点)・円の周期の比 = ψ/4(解析)と数値。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w347b-convbody.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w347b-convbody-1';
export const AMEND = Object.freeze([]);
export const OUT_MAIN = 'tests/out/convbody-347b.json';
export const TARGET = 'tests/lib-w347b-convbody.mjs';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze(['換算の型を決めない((α) は主の候補・(β) は比べる列・(0) は「現行の近似」の列 —— 並べるだけ)',
  '「現行の近似」は (α) との差がどの次数・どの大きさかを表で示す意味 —— 現行が正しい/誤り、とは書かない・足りる/足りないも書かない',
  '月・惑星の数は宣言した系と ε の比 —— 観測の値へ合わせていない・合った/合わないとは書かない・今の収支(42.98″/世紀)に項を足さない',
  '実の比の系の質量と要素は文献の値・未照合の比べる列の入力(データの表に足さない・採否に使わない)',
  '場の側の帳簿は置けば全体が恒等で 0 になる帳簿 —— 帳簿が周ごとに戻るか(位置と速さの関数に置けるか)を数で並べるだけ・閉じると決め打ちしない',
  'アプリの積分を変える提案は決断事項の候補に置く(本器はアプリに何も入れない)',
  '光速を、候補の採否に使わない(本器の速さは場に対する物質の相対の速さ)']);
export const PLAN = Object.freeze({ kinds: '(0) dv/dt = a(指数 2)・(α) dv/dt = q a(指数 1)・(β) dp/dt = q U・dU/dt = q a(指数 1)・(N) ニュートン(物差し)',
  frames: 'abs = u 0・clock = Σ_j W_j v_j ÷(D₀ + Σ_j W_j)(W_j = m_j ÷ r_ij —— アプリの点の時計の枠の形・D₀ = 0)・host = 主星の速さ',
  t5: '(0) − (α) の近点 ÷ 1PN = 0(解析の一次)+ c₂ ψ(数値の二次)・円の周期の比 P₀ ÷ P_α − 1 = ψ/4',
  currentBudget: '−28.65 + 71.63 = 42.98″/世紀(G_loc n_G = 2 受け手 + K1 —— 動かさない)' });

export function gatesOf(J) {
  const t1 = J.t1, t2 = J.t2, t3 = J.t3, t4 = J.t4, t5 = J.t5;
  const fr = t1.frameSpeeds.x2;
  return {
    pure: Object.values(J.pure.gates).every(Boolean),
    t1Finite: ['dimless', 'real'].every((w) => t1[w].every((c) => c.rows.every((r) => L.T1_QTY.every((q) => Number.isFinite(r[q]))))),
    t1Newton: Math.abs(t1.realNewton.varpiAsYr / 3600 - 40.7) < 3 && Math.abs(t1.realNewton.OmAsYr / 3600 + 19.35) < 1.5,   // ニュートンの物差し(月の近地点 約 40.7°/年・交点 約 −19.35°/年 —— 測り方の確かめ)
    t1Frames: fr.host < fr.abs * 1e-2 && Math.abs(fr.clock / fr.abs - 1) < 1e-2,
    t2Cross: t2.rows.every((r) => r.diff < 1e-8 && r.nPeri === 5),
    t2Pert: t2.pert.every((r) => Number.isFinite(r.overPN)),
    t3Closed: t3.rows.every((r) => Math.abs(r.dFirst - r.dFirstLin) <= 1e-6 * Math.abs(r.dFirstLin) + 1e-18) && t3.num.every((r) => Math.abs(r.slope - r.closedSlope) < 2e-4),
    t4Base: t4.rows.filter((r) => r.kind === '0').every((r) => r.dP < 1e-12 && r.ledgerTotal < 1e-12),
    t4Ledger: t4.rows.every((r) => r.ledgerTotal < 1e-12) && t4.rows.filter((r) => r.kind !== '0').every((r) => r.dP > 1e-4),
    t5Period: t5.rows.every((r) => Math.abs(r.periodRel / r.periodRelClosed - 1) < 1e-3),
    t5Second: t5.rows.every((r) => Math.abs(r.c2 - r.c2From12) < 2e-3 && Math.abs(r.c1) < 1e-7),
  };
}
export const settledPart = () => { const PS = L.pureScenes(); return { pure: { scenes: PS, gates: L.pureGates(PS) }, t3: L.t3Rows(), t5: L.t5Rows() }; };
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const S = settleRun(settledPart); mark('settled');
  const t1 = L.t1Rows(); mark('t1');
  const t2 = L.t2Rows(); mark('t2');
  const t4 = L.t4Rows(); mark('t4');
  const J = Object.assign({}, S.value, { t1, t2, t4, timing: tm });
  J.t5Moon = L.t5Moon(t1);
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return { J, recheck: S.meta };
}

const writeJson = (OUT, out) => { fs.mkdirSync(path.dirname(OUT), { recursive: true }); fs.writeFileSync(OUT, JSON.stringify(out, null, 1).replace(/\[\s*(-?[\d.eE+-]+(?:,\s*-?[\d.eE+-]+|,\s*null)*)\s*\]/g, (m, a) => '[' + a.replace(/\s+/g, '') + ']') + '\n'); };
export const CODE = Object.freeze(['tests/exp-w347b-convbody.mjs', 'tests/lib-w347b-convbody.mjs', 'tests/lib-w344b-partyconv.mjs', 'tests/lib-w343b-partytime.mjs', 'tests/lib-w342b-clockstop.mjs', 'tests/lib-w341e-lightmass.mjs', 'tests/lib-w299c-planets3d.mjs', 'tests/lib-w333c-mercury3d.mjs', 'tests/lib-w331c-k1scale.mjs', 'tests/lib-w330b-dragweight.mjs', 'tests/lib-w332a-eqband.mjs', 'tests/lib-w340h-thin.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w338c-recheck.mjs']);
export async function main() {
  const t0 = Date.now();
  const OUT = process.env.W347B_OUT ? (path.isAbsolute(process.env.W347B_OUT) ? process.env.W347B_OUT : path.join(ROOT, process.env.W347B_OUT)) : path.join(ROOT, OUT_MAIN);
  console.log('第347便b convbody(版 ' + HARNESS_VERSION + ')');
  const { J: R, recheck } = runAll();
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w347b-convbody.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-21 —— 第145報)「AN902: 推奨で進める。現状も近似として比較可能にする」・統括の検証項目 R401',
    decl: L.DECL, real: L.REAL, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第347便b', target: TARGET, code: CODE, inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'convbody', engine: 'Node の純関数だけ(html を読まない・エンジンの步を進めない —— 自前の多体の右辺・第341便e の RK4 の 1 步と水星の 1PN・第343便b の G_loc の因子と小さい系・第344便b の試験粒子の近点と背景の見込み・第299便c の惑星の要素を呼ぶ)', notClaim: NOT_CLAIM, recheck });
  writeJson(OUT, out);
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s', JSON.stringify(R.timing));
}
if (IS_MAIN) await main();
