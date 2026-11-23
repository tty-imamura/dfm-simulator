// 第348便e(原仮定者の回答(2026-11-21 —— 第145報)「AN902: 推奨で進める。現状も近似として比較可能にする」・推奨で進める項 AN954 → AN980・統括の検証項目 R413):
//   **月の型の長い窓 —— (0)「現行の近似」・(α) 主の候補・(β) 比べる列の、月の近地点の率・交点の率・恒星月・離心率の代理を、窓 18.6〜186 年と刻み 2 通りで並べる器**
//   T1 長い窓(実の比・型 7 本 × 刻み 200/月・400/月 × 186 年の 1 本の走りの先頭からの窓 6・12・18.6・37.2・93・186 年 + 位相の平均の読み)/T2 幅を詰める(窓の動き ÷ 値・差 ÷ 幅)/
//   T3 月の本の表(固定の比べる列と (N)・(0)・(α)・(β))/T4 枠の依り方/T5 零試験・変異・〔第347便b〕の正本との照合
//   (段 moonwindow-348e —— 正本 tests/out/moonwindow-348e.json・lib tests/lib-w348e-moonwindow.mjs)。**診断だけ** —— アプリの積分・重力の式・時計・内蔵の本・受理器・既存の lib の本文は変えない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w348e-moonwindow.mjs —— 領域の宣言なし)。入力のファイルは〔第347便b〕の正本 tests/out/convbody-347b.json(照合だけ —— 数は使わない)。1 プロセス。
// 正本の作り方: 純関数の場面と短い部分(窓 6 年・刻み 200/月・刻みの次数)は第338便c の sigmaOf と settle(±ulp の走り直しで丸めの残りを 0 に —— 尺度は〔第347便b〕の正本との照合の許容にも使う)/
//   長い走り(186 年 × 型 8 × 刻み 2)は 1 回の走り(±ulp の走り直しは 300 s に収まらないため行わない —— 照合は門と短い部分の自己一致で)。
//
// ■ 判定の物差し(式の形の宣言ではなく、何を測ったかの記録)
//   率: 型 − ニュートン(同じ刻み・同じ初期の状態)の差の時系列の率(読み A —— lib-w347b の rateOf・先頭からの窓)と、部分窓の率の平均と散らばり(読み B)。
//   幅: 刻み 200/月 と 400/月 の差(同じ窓)・刻み 400/月 で一つ前の窓との差・部分窓の標準偏差。差 ÷ 幅 の幅は前の 2 つの大きい方。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { sigmaOf, settle, LIB_VERSION as RECHECK_VERSION, DECL as RECHECK_DECL } from './lib-w338c-recheck.mjs';
import * as L from './lib-w348e-moonwindow.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w348e-moonwindow-1';
export const AMEND = Object.freeze([]);
export const OUT_MAIN = 'tests/out/moonwindow-348e.json';
export const TARGET = 'tests/lib-w348e-moonwindow.mjs';
export const INPUT_347B = 'tests/out/convbody-347b.json';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze(['換算の型を決めない((α) は主の候補・(β) は比べる列・(0) は「現行の近似」の列 —— 並べるだけ)',
  '「現行の近似」は (α) との差の大きさと窓の幅の比を表で示す意味 —— 現行が正しい/誤り、とは書かない',
  '月の近点回転を得たとは書かない —— この器は点の質量の 3 体(惑星なし・引きずりなし・地球の J₂ なし)で、ニュートンの段で既に固定の比べる列から離れる',
  '観測の数は固定の比べる列(リポジトリの候補の行の写し —— 文献の値・未照合)。器はその数へ何も合わせない',
  '本 🌘・🌔 の設定そのものではない(本の宣言は読むだけ —— どちらも太陽を置かない二体)',
  'アプリの積分を変える提案は決断事項の候補に置く(本器はアプリに何も入れない)',
  '光速を、候補の採否に使わない']);
export const PLAN = Object.freeze({ kinds: '(0) dv/dt = a(指数 2)・(α) dv/dt = q a(指数 1)・(β) dp/dt = q U・dU/dt = q a(指数 1)・(N) ニュートン(物差し)—— 右辺は lib-w347b の makeDeriv',
  frames: 'abs = u 0・clock = 今の点の時計の枠(主の列 —— 推奨で進める項 AN954)・host = 主星の枠(比べる列)',
  windows: '1 本の 186 年の走りの先頭からの窓 6・12・18.6・37.2・93・186 年(交点の周期 18.6 年の 1・2・5・10 倍 + 〔第347便b〕の 6・12 年)',
  steps: '月の 1 公転あたり 200 步と 400 步(半分の刻み)—— 400 步の走りは記録を 1 個おきに間引いた読みも持つ(200 步と同じ記録の時刻)',
  knob: '(α) の因子 q のべき fpow(1 = (α)・0 と n_G 2 = (0) —— 零試験。0.5 は変異)' });

export function gatesOf(J) {
  const G = J.pure.gates, ord = J.short.order, nw = J.long[1].newton[J.long[1].windows.indexOf(186)], toDegYr = (r) => L.toAsYr(r, J.long[1]) / 3600;
  const fin = (x) => x === null || Number.isFinite(x);
  const finTree = (o) => (o && typeof o === 'object' ? Object.values(o).every(finTree) : (typeof o === 'number' ? Number.isFinite(o) : true));
  return {
    pure: Object.values(G).every(Boolean) && Object.values(J.exact.gates).every(Boolean),
    cross347b6: J.cross.h200w6.nBad === 0,
    cross347b12: J.cross.h200w12.nBad === 0,
    cross347b6h400: J.cross.h400w6.nBad === 0,
    shortVsLong: J.cross.shortVsLong.nBad === 0,
    knobZero: J.knob.zero.maxRel < 1e-3,
    order: ord.ratioNVarpi > 8 && ord.ratioNVarpi < 64 && ord.ratioNOm > 8 && ord.ratioNOm < 64
      && ['d0Varpi', 'dAVarpi'].every((k) => Math.abs(ord.rows[1][k] - ord.rows[2][k]) < Math.abs(ord.rows[0][k] - ord.rows[1][k])),   // 型の差の率は刻みを細かくすると動きが小さくなる(比そのものは丸めの尺度の内 —— 0 と書く)
    mutants: J.mutants.prefix > 1e-6 && !(J.mutants.unaligned > 8 && J.mutants.unaligned < 64) && J.mutants.knobHalf > 1e-2 && J.mutants.rate3 > 1e-6,
    newton: Math.abs(toDegYr(nw.varpi) - 40.7) < 3 && Math.abs(toDegYr(nw.Om) + 19.35) < 1.5,
    readB: J.long.every((c) => c.rows.every((r) => r.B.map((b) => b.n).join(',') === '10,5,2,1')),
    finite: finTree(J.long) && finTree(J.tables) && [J.knob.zero.maxRel, J.knob.half.maxRel].every(fin),
  };
}
/** 短い部分(QA が走らせ直す): 純関数の場面・窓 6 年 刻み 200/月の型 7 行・刻みの次数 */
export const settledPart = () => { const PS = L.pureScenes(); return { pure: { scenes: PS, gates: L.pureGates(PS) }, short: L.shortPart() }; };
/** 〔第347便b〕の正本の行との照合の許容: 相対 1e-9 か、短い部分の ±ulp の尺度の 8 倍(第338便c と同じ係数) */
export function crossShort(rowsFresh, sigmaRows, ref) {
  return L.crossRows(rowsFresh, ref, (a, b, r, q) => { const i = rowsFresh.findIndex((x) => x.kind === r.kind && x.frame === r.frame), s = sigmaRows && sigmaRows[i] && typeof sigmaRows[i][q] === 'number' ? sigmaRows[i][q] : 0; return Math.max(1e-9 * Math.max(Math.abs(a), Math.abs(b)), RECHECK_DECL.TOL_FACTOR * s); });
}
export function tablesFrom(long) {
  const Q = ['dVarpi', 'dOm', 'dLon', 'dE'];
  return { window: Object.fromEntries(Q.map((q) => [q, L.windowTable(long, q)])), shrink: Object.fromEntries(Q.map((q) => [q, L.shrinkTable(long, q)])), book: L.bookTable(long),
    frames: Object.fromEntries(['dVarpi', 'dOm'].map((q) => [q, L.frameTable(long, q)])) };
}
export function runAll(ref) {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const SG = sigmaOf(settledPart), ST = settle(SG.base, SG.sigma); mark('settled');
  const long = L.DECL.steps.map((st) => { const c = L.longCase(st); mark('long' + st); return c; });
  const R = ref.t1.real, cross = {
    h200w6: crossShort(SG.base.short.rows, SG.sigma.short.rows, R[0]),
    h200w12: L.crossRows(L.rowsAt(long, 200, 12), R[3], (a, b) => 1e-4 * Math.max(Math.abs(a), Math.abs(b))),
    h400w6: L.crossRows(L.rowsAt(long, 400, 6), R[2], (a, b) => 1e-4 * Math.max(Math.abs(a), Math.abs(b))),
    shortVsLong: L.crossRows(L.rowsAt(long, 200, 6), { rows: SG.base.short.rows }, (a, b) => 1e-12 * Math.max(Math.abs(a), Math.abs(b))),
    refMeta: { version: ref.version, libVersion: ref.libVersion, rows: [0, 3, 2].map((i) => ({ i, steps: R[i].stepsPerMoon, years: R[i].years, lam: R[i].lam })) },
  };
  const knob = { zero: L.knobRun(L.DECL.knob.fpowZero, 2), half: L.knobRun(L.DECL.knob.fpowMut, 2) }; mark('knob');
  const mutants = { prefix: L.prefixMutant(R[0].rows[0]), unaligned: L.unalignedOrderRatio(), knobHalf: knob.half.maxRel, rate3: SG.base.pure.scenes.rate3Err }; mark('mutants');
  const exact = L.exactScenes();
  const J = Object.assign({}, ST.value, { exact, long, cross, knob, mutants, tables: tablesFrom(long), timing: tm });
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  const recheck = { version: RECHECK_VERSION, decl: RECHECK_DECL, zeroed: ST.zeroed, kept: ST.kept, zeroPathsHead: ST.zeroPaths, unstable: SG.unstable.length, unstableHead: SG.unstable.slice(0, 20) };
  return { J, recheck };
}

const writeJson = (OUT, out) => { fs.mkdirSync(path.dirname(OUT), { recursive: true }); fs.writeFileSync(OUT, JSON.stringify(out, null, 1).replace(/\[\s*(-?[\d.eE+-]+(?:,\s*-?[\d.eE+-]+|,\s*null)*)\s*\]/g, (m, a) => '[' + a.replace(/\s+/g, '') + ']') + '\n'); };
export const CODE = Object.freeze(['tests/exp-w348e-moonwindow.mjs', 'tests/lib-w348e-moonwindow.mjs', 'tests/lib-w347b-convbody.mjs', 'tests/lib-w344b-partyconv.mjs', 'tests/lib-w343b-partytime.mjs', 'tests/lib-w342b-clockstop.mjs', 'tests/lib-w341e-lightmass.mjs', 'tests/lib-w299c-planets3d.mjs', 'tests/lib-w333c-mercury3d.mjs', 'tests/lib-w331c-k1scale.mjs', 'tests/lib-w330b-dragweight.mjs', 'tests/lib-w332a-eqband.mjs', 'tests/lib-w340h-thin.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w338c-recheck.mjs']);
export async function main() {
  const t0 = Date.now();
  const OUT = process.env.W348E_OUT ? (path.isAbsolute(process.env.W348E_OUT) ? process.env.W348E_OUT : path.join(ROOT, process.env.W348E_OUT)) : path.join(ROOT, OUT_MAIN);
  console.log('第348便e moonwindow(版 ' + HARNESS_VERSION + ')');
  const ref = JSON.parse(fs.readFileSync(path.join(ROOT, INPUT_347B), 'utf8'));
  const { J: R, recheck } = runAll(ref);
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w348e-moonwindow.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-21 —— 第145報)「AN902: 推奨で進める。現状も近似として比較可能にする」・推奨で進める項 AN954 → AN980・統括の検証項目 R413',
    decl: L.DECL, obs: L.OBS, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第348便e', target: TARGET, code: CODE, inputs: [INPUT_347B] }), {
    harnessVersion: HARNESS_VERSION, stage: 'moonwindow', engine: 'Node の純関数だけ(html を読まない・エンジンの步を進めない —— 第347便b の lib の多体の右辺・(β) の初期の U・系・接触の要素・率の読みと第341便e の RK4 の 1 步を呼ぶ)', notClaim: NOT_CLAIM, recheck });
  writeJson(OUT, out);
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s', JSON.stringify(R.timing));
}
if (IS_MAIN) await main();
