// 第356便b(統括の検証項目 R514): **論文 2 の仕上げの材料の器** —— 図の並びの宣言(今の 22 ゲートを図ごとに数えて、残す図と移す図に分ける)・
//   模式図 2 枚(天体が 1 つの箱・膨張の 3 層の比べ)の描く量・図 6 の精度の書き方(走査 24 区間 × 較正 3 と V29 の 3 区間)・「同水準」の字の在りか。
//   (段 p2figs-356b —— 正本 tests/out/p2figs-356b.json・lib tests/lib-w356b-p2figs.mjs)。
//   **材料だけ** —— 論文の原稿(paper/*.tex)・今の図のデータ(paper/figures/)・図の生成器と論文の検査・アプリは変えない。図そのもの(PDF・SVG)は作らない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w356b-p2figs.mjs —— 領域の宣言なし)。入力のファイルは今の図のデータ 7 つ
//   (p2figs-gates.json・p2fig1.json〜p2fig6.json —— 読むだけ)と、字の在りかを見る生成器 tools/gen-figures2.mjs(読むだけ)。
//   1 プロセス。正本は第338便c の settleRun で書く。仮の値の lib は閉包に入らない。
//
// ■ 言わないこと: 模式図は「模式(数の図ではない)」。図の行き先は構成案の ⑥ の行に合わせた案(決めていない)。現実の宇宙の主張をしない(今の原稿の言い方の範囲 —— 「類似」)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w356b-p2figs.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w356b-p2figs-1';
export const OUT_MAIN = 'tests/out/p2figs-356b.json';
export const TARGET = 'tests/lib-w356b-p2figs.mjs';
export const INPUTS = Object.freeze(['paper/figures/p2figs-gates.json', 'paper/figures/p2fig1.json', 'paper/figures/p2fig2.json', 'paper/figures/p2fig3.json',
  'paper/figures/p2fig4.json', 'paper/figures/p2fig5.json', 'paper/figures/p2fig6.json', 'tools/gen-figures2.mjs']);
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '模式図 2 枚は「模式(数の図ではない)」—— 座標は描く位置で、物理の量ではない。ラベルの数は今の図のデータの写し',
  '図の並びは構成案の案 —— 図の行き先(移す先)は構成案 ⑥ の行に合わせた読みで、決めていない',
  '論文の原稿・今の図のデータ・図の生成器と論文の検査・アプリは変えない。図そのもの(PDF・SVG)は作らない',
  '現実の宇宙の主張をしない —— 今の原稿の言い方の範囲(「類似」)']);
export const PLAN = Object.freeze({
  pure: '零試験 8(図ごとに数える・拒否 8・走査の誤差を行から作り直す・V29 の字の読み・模式図 A の数は入力から・模式図 B の層の境と光の z・字の在りか・決定的)',
  gates: '今の 22 ゲートを図ごとに数え、残す図(p2fig1〜p2fig6)と移す図(p2fig7・p2fig8)に分ける',
  schem: '模式図 A(天体が 1 つの箱 —— 図 2 の g(20))・模式図 B(膨張の 3 層 —— 図 3 の錨・図 4 の z・図 5 の a_eff)',
  prec: '図 6 の精度: 走査(p2fig6.analytic・24 区間 × 較正 3)の最大の相対の誤差を行から作り直す・V29(3 区間)の誤差を V29 の記録の字から読む・比',
  phrase: '「同水準」の字の在りか(図のゲートの記録・V29 の記録・図の生成器)',
});

export function runAll(read) {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { gates: L.pureGates(PS), z1: PS.z1, z3: PS.z3 }; mark('pure');
  const G = read('paper/figures/p2figs-gates.json'), F = {};
  for (let i = 1; i <= 6; i++) F[i] = read('paper/figures/p2fig' + i + '.json');
  const gates = L.gateCounts(G); mark('gates');
  const schematicA = L.schematicA(F[2]), schematicB = L.schematicB(F[3], F[4], F[5]); mark('schem');
  const prec = L.precisionOf(F[6]); mark('prec');
  const g6 = G.gates.find((g) => g.id === 'p2fig6.analytic');
  const gen = read('tools/gen-figures2.mjs', 'text');
  const genLines = gen.split('\n'), genHits = [];
  genLines.forEach((l, k) => { if (l.indexOf('同水準') >= 0) genHits.push({ line: k + 1, text: l.trim().slice(0, 160) }); });
  const phrase = { gateLog: L.phraseHits({ 'paper/figures/p2figs-gates.json#p2fig6.analytic': g6 ? g6.detail : null, 'paper/figures/p2fig6.json#v29Gate.detail': F[6].v29Gate.detail }), gen: genHits };
  mark('phrase');
  const fig1 = { kind: F[1].kind, note: F[1].note };
  const J = { pure, figPlan: L.FIG_PLAN, gates, fig1, schematicA, schematicB, prec, phrase, timing: tm };
  J.gatesOk = gatesOf(J); J.ok = Object.values(J.gatesOk).every(Boolean);
  return J;
}
export function gatesOf(J) {
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 8,
    gates: J.gates.total === 22 && J.gates.keep + J.gates.move === J.gates.total && J.gates.allPass === true,
    plan: L.FIG_PLAN.filter((f) => f.state === 'keep').map((f) => f.id).join(',') === L.KEEP.join(',') && L.FIG_PLAN.filter((f) => f.state === 'move').map((f) => f.id).join(',') === L.MOVE.join(',')
      && L.FIG_PLAN.filter((f) => f.state === 'new').length === 2,
    schem: J.schematicA.schematic === true && J.schematicB.schematic === true && J.schematicA.panels.length === 3 && J.schematicB.layers.length === 3,
    prec: J.prec.scan.sameAsStored === true && J.prec.scan.nWin === L.DECL.nWin6 && J.prec.scan.nCal === L.DECL.nCal6 && J.prec.v29.nWin === L.DECL.nWinV29 && J.prec.bothWithin === true
      && J.prec.v29.maxOfPer === J.prec.v29.maxRel,
  };
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w356b-p2figs.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}
export function readRepo(rel, kind = 'json') {
  const t = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  return kind === 'json' ? JSON.parse(t) : t;
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W356B_OUT ? (path.isAbsolute(process.env.W356B_OUT) ? process.env.W356B_OUT : path.join(ROOT, process.env.W356B_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第356便b p2figs(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(readRepo); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w356b-p2figs.mjs', target: TARGET,
    ruling: '統括の検証項目 R514(構成案 論文2 の ⑧ の V2-5 —— アプリを変えずに埋められる分)',
    decl: L.DECL, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第356便b', target: TARGET, code: codeClosure(), inputs: [...INPUTS] }), {
    harnessVersion: HARNESS_VERSION, stage: 'p2figs', engine: 'Node(html を読まない —— 純関数の lib・今の図のデータを読むだけ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gatesOk), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
