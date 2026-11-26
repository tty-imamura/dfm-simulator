// 第356便a(統括の検証項目 R513 —— 構成案 docs/PAPER_PLAN.md「## 2. 論文1」⑧ の V1-5): **論文1 の新しい図 3 枚の図のデータと図の門の器 ——
//   図 1 時計の遅れの 2 成分(重力と運動 —— 円の軌道の半径を振る・GPS の軌道の点・合計が 0 になる半径)/図 2 太陽縁の光の軌跡(x までに受けた偏向・直線からのずれ)/
//   図 3 シャピロ遅延の往復(衝突径数を振る・片道の 2 倍・原稿の式との差)/図の門 14/原稿の印字との照合 7/零試験 7**
//   (段 p1figs-356a —— 正本 tests/out/p1figs-356a.json・lib tests/lib-w356a-p1figs.mjs)。
//   **図のデータまで** —— 図そのもの(PDF・SVG)は作らない。論文の原稿・今の図のデータ(paper/figures/)・tools/gen-figures.mjs は変えない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w356a-p1figs.mjs —— 領域の宣言なし)。入力のファイルは無い(原稿の入力の表の字は lib に写してある)。
//   1 プロセス。正本は第338便c の settleRun で書く。仮の値の lib(第352便b)は閉包に入らない。
//
// ■ 言わないこと: 図のデータは模型の式の値。観測に届いた・論文の主張が確かめられた、とは書かない。原稿の印字との差は差のまま書く(原稿は変えない)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w356a-p1figs.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w356a-p1figs-1';
export const OUT_MAIN = 'tests/out/p1figs-356a.json';
export const TARGET = 'tests/lib-w356a-p1figs.mjs';
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '図のデータは模型の式の値(原稿の照合の表の列「DFM」と同じ式)—— 観測に届いた・論文の主張が確かめられた、とは書かない',
  '原稿の印字の数との照合は、入力の表から作り直した値との差だけ —— 差が在れば差のまま書き、原稿・今の図のデータは変えない',
  '原稿に字の無い定数は 2 つ(光の速さ c = SI の定義の値・重力定数 G = リポジトリの CODATA の字)—— 文献の値・未照合',
  '図そのもの(PDF・SVG)は作らない —— 公開の原稿へ移すのは別の便']);
export const PLAN = Object.freeze({
  pure: '零試験 7(第289便a の lawFn(\'e7r\').rate・bornDeflectionCoeff・shapiroCoeff の Λ・clockCoeff と同じ入力で照合/時計の比と打ち消しを避けた形/地上の点で重力の分 0/床 1e-6)',
  fig1: '図 1: 時計の遅れの 2 成分 —— r ÷ R⊕ = 1〜10(対数 37 点)× 地上の時計の速さ 2 系列(0.465 km/s・0)・GPS の軌道の点・合計 0 の半径',
  fig2: '図 2: 太陽縁の光の軌跡 —— x ÷ R☉ = −215〜+215(sinh で 61 点)・x までの偏向・直線からのずれ・全体・Fermat の RK4 の係数(参考)',
  fig3: '図 3: シャピロ遅延の往復 —— b ÷ R☉ = 1〜20(対数 27 点)・片道・往復・閉じた形・原稿の式',
  gates: '図の門 14(式との照合は第289便a の床 1e-6・原稿の印字との照合は印字の最後の桁の半分〔候補〕・作りで等しいもの)',
  printed: '原稿の印字との照合 7(GPS の 3 つ・太陽縁・シャピロ・X_k・v_sat —— 門ではない)',
});

export function gatesOf(J) {
  const D = L.DECL;
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 7,
    fig1: J.fig1.series.length === 2 && J.fig1.series.every((s) => s.rows.length === D.fig1.n) && J.fig1.zero.withGround.r0 > L.INPUTS.R_E,
    fig2: J.fig2.rows.length === D.fig2.n && J.fig2.totalArcsec > 0,
    fig3: J.fig3.rows.length === D.fig3.n && J.fig3.rows.every((r) => r.roundTripUs > 0),
    figGates: J.figGates.length === 14 && J.figGates.every((g) => g.pass),
    printed: J.printed.length === 7,
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { gates: L.pureGates(PS), shapiroCoeff: PS.shapiro.lib, clockCoeff: PS.clockCoeff }; mark('pure');
  const fig1 = L.fig1Data(); mark('fig1');
  const fig2 = L.fig2Data(); mark('fig2');
  const fig3 = L.fig3Data(); mark('fig3');
  const figGates = L.figGates(fig1, fig2, fig3), printed = L.printedCheck(fig1, fig2, fig3); mark('gates');
  const J = { pure, fig1, fig2, fig3, figGates, printed, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w356a-p1figs.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W356A_OUT ? (path.isAbsolute(process.env.W356A_OUT) ? process.env.W356A_OUT : path.join(ROOT, process.env.W356A_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第356便a p1figs(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w356a-p1figs.mjs', target: TARGET,
    ruling: '統括の検証項目 R513(構成案 docs/PAPER_PLAN.md「## 2. 論文1」⑧ の V1-5 —— 新しい図 3 枚の図のデータと門)',
    decl: L.DECL, inputs: L.INPUTS, consts: L.CONSTS, printedRefs: L.PRINTED, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第356便a', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'p1figs', engine: 'Node(html を読まない —— 純関数の lib・第289便a の弱場の lib を呼ぶ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
