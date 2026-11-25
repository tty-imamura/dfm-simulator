// 第355便f(原仮定者の回答(2026-11-22 —— 第145報の回答 5・回答 6)AN948・AN962〜AN964・原仮定者の予定(第123報)・原仮定者の指示(2026-11-14 —— 第138報)・統括の検証項目 R509):
//   **新しい geoPN=4 の計算の候補の列(表 5c)の「低 N の診断で測れる量」を、いま在る純関数の組み合わせとノブで数える器** ——
//   列 6(対照 G0・場の契約の続き A1・A2・引きずりの定義をそのまま流体に B1・B2・両方 C1)× 模型 2(円盤・楕円の型)× γ 2 × N 2 × 種 3 の走りの要約と、
//   列ごとの効果(対照との差)・離散化の幅(N を倍に・種の間)・効果 ÷ 幅。加えて、表 5c の「いま在る器で数えた値」に写す既存の正本の数(出どころつき)。
//   (段 g4cols-355f —— 正本 tests/out/g4cols-355f.json・lib tests/lib-w355f-g4cols.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・既存の lib の本文は変えない。physics の鍵を足さない。新しい物理は足さない(列は在る項の組み合わせとノブ)。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w355f-g4cols.mjs —— 領域の宣言なし)。入力のファイルは既存の正本 2 つ(数の写しだけ)。
//   1 プロセス。正本は第338便c の settleRun で書く。仮の値の lib は閉包に入らない。
//
// ■ 言わないこと: 列の採否・回転曲線の当否・暗黒物質や渦状腕の説明を書かない(候補の表)。N は解像の要素の数。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w355f-g4cols.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w355f-g4cols-1';
export const OUT_MAIN = 'tests/out/g4cols-355f.json';
export const TARGET = 'tests/lib-w355f-g4cols.mjs';
export const INPUTS = Object.freeze(['tests/out/fluid-337e.json', 'tests/out/fluidconv-340g.json']);
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '候補の列の表 —— どの列を主にするかは原仮定者に伺う(この器は列を選ばない・1 つに絞らない)',
  '低 N の小さな系の測った数 —— 銀河の解・回転曲線の当否・暗黒物質や渦状腕の説明ではない。現実の銀河を主張しない',
  '新しい物理は足さない —— 力と引きずりは第335便f・第337便e の lib を呼ぶだけ。円盤引きずり・2 倍角の則の向き・背景(銀河の外)を有限に置く列は入れていない(足りない口)',
  '太陽系の主の列の換算の係数・背景の大きさは使わない(銀河の列で要る所は名で引く —— 数は同じ便の枝 b の正本の後)',
  'アプリの積分と、エンジン・内蔵の本へは入れない']);
export const PLAN = Object.freeze({
  pure: '零試験 8(γ 0 で対照とビット同一・自前の積分が第337便e の integrateFluid と同じ・C1 の λ 1 と 0 で A2 と B2・対の和の保存・初期の配置・回転曲線の測りの試し・幅の算術・入力の拒否)',
  runs: '走り: 模型 2 × N 2 × 種 3 × (対照 1 + 列 5 × γ 2) の要約(外の速さ・回転曲線の傾き・平坦の判定・r50 と c/a の変化〔時刻 0 から・短い窓から〕・L_z の変化)',
  eff: '効果: 列 − 対照(外の速さは比)と幅(N を倍に・種の間)と効果 ÷ 幅',
  copied: '表 5c の「いま在る器で数えた値」: 第337便e の正本(t1dyn の N 256・B)と第340便g の正本(t1 の乱数の並び・N 256・diff・B の種 3 の平均)の数の写し',
});

const mean = (a) => a.reduce((p, q) => p + q, 0) / a.length;
export function copiedOf(J337, J340) {
  const r = J337.analysis.t1dyn.find((q) => q.N === 256 && q.self === 'B');
  const rows = J340.t1.rows.filter((q) => q.arr === 'random' && q.N === 256 && q.field === 'diff');
  return {
    f337: { src: 'tests/out/fluid-337e.json#analysis.t1dyn[N=256,self=B]', shareMean: r.shareMean, effR50: r.eff.r50 },
    f340: { src: 'tests/out/fluidconv-340g.json#t1.rows[arr=random,N=256,field=diff].B(種 ' + rows.length + ' の平均)', n: rows.length, shareMean: mean(rows.map((q) => q.B.shareMean)), outerRatio: mean(rows.map((q) => q.B.outerRatio)) },
  };
}
export function gatesOf(J) {
  const D = L.DECL, nRuns = L.MODELS.length * D.Ns.length * D.seeds.length * (1 + (L.COLS.length - 1) * D.gammas.length);
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 8,
    runs: J.runs.length === nRuns && J.runs.every((r) => Number.isFinite(r.s.outer) && Number.isFinite(r.s.dR50)),
    eff: J.eff.length === L.MODELS.length * (L.COLS.length - 1) * D.gammas.length && J.eff.every((e) => e.w.dR50 && e.w.dR50.width >= 0),
    copied: J.copied.f340.n === 3 && J.copied.f337.shareMean > 0 && J.copied.f340.outerRatio > 0,
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const D = L.DECL;
  const PS = L.pureScenes(), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const runs = [];
  for (const model of L.MODELS) for (const N of D.Ns) for (const seed of D.seeds) {
    const S0 = L.modelOf(model, N, seed);
    runs.push({ model, N, seed, col: 'G0', gamma: 0, s: L.summaryOf(L.runCol(S0, { col: 'G0' }).series) });
    for (const col of L.COLS.filter((c) => c !== 'G0')) for (const gamma of D.gammas) runs.push({ model, N, seed, col, gamma, s: L.summaryOf(L.runCol(S0, { col, gamma }).series) });
  }
  mark('runs');
  const eff = [];
  for (const model of L.MODELS) for (const col of L.COLS.filter((c) => c !== 'G0')) for (const gamma of D.gammas) {
    const effs = runs.filter((r) => r.model === model && r.col === col && r.gamma === gamma).map((r) => {
      const c = runs.find((q) => q.model === model && q.col === 'G0' && q.N === r.N && q.seed === r.seed);
      return { N: r.N, seed: r.seed, eff: L.effectOf(r.s, c.s) }; });
    const flatN = runs.filter((r) => r.model === model && r.col === col && r.gamma === gamma && r.N === D.Ns[D.Ns.length - 1]).filter((r) => r.s.flat).length;
    eff.push({ model, col, gamma, w: L.widthOf(effs), flatN, of: D.seeds.length });
  }
  const ctrl = L.MODELS.map((model) => ({ model, flatN: runs.filter((r) => r.model === model && r.col === 'G0' && r.N === D.Ns[D.Ns.length - 1] && r.s.flat).length, of: D.seeds.length,
    slope: mean(runs.filter((r) => r.model === model && r.col === 'G0' && r.N === D.Ns[D.Ns.length - 1]).map((r) => r.s.slope)) }));
  mark('eff');
  const rd = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
  const copied = copiedOf(rd(INPUTS[0]), rd(INPUTS[1])); mark('copied');
  const J = { pure, runs, eff, ctrl, copied, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w355f-g4cols.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W355F_OUT ? (path.isAbsolute(process.env.W355F_OUT) ? process.env.W355F_OUT : path.join(ROOT, process.env.W355F_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第355便f g4cols(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w355f-g4cols.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-22 —— 第145報の回答 5・回答 6)AN948・AN962〜AN964・原仮定者の予定(第123報)・原仮定者の指示(2026-11-14 —— 第138報)・統括の検証項目 R509',
    decl: L.DECL, cols: L.COLS, colDrag: L.COL_DRAG, models: L.MODELS, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第355便f', target: TARGET, code: codeClosure(), inputs: [...INPUTS] }), {
    harnessVersion: HARNESS_VERSION, stage: 'g4cols', engine: 'Node(html を読まない —— 純関数の lib・第335便f・第337便e の lib を呼ぶ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
