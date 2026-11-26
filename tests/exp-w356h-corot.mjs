// 第356便h(原仮定者の指示(2026-11-26)・原仮定者の回答(2026-11-22)・統括の検証項目 R520):
//   **「空間ごと回転して見える」量の候補(一緒に回る度合い・円運動からのずれ・外縁の速さ)を、第355便f の列(対照 G0・A1・A2・B1・B2・C1)で並べる小さい診断の器** ——
//   列 6 × 模型 2(円盤・楕円の型)× 押しの係数 2 × 粒 2(96・192)× 種 3(第355便f と同じ格子)の時刻 0 と終わりの量と、
//   列ごとの効果(対照との差)・離散化の幅(粒の数を倍に・種の間)・効果 ÷ 幅・「幅の内/幅の外」の印。
//   (段 corot-356h —— 正本 tests/out/corot-356h.json・lib tests/lib-w356h-corot.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・既存の lib の本文は変えない。physics の鍵を足さない。新しい物理は足さない。列を選ばない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w356h-corot.mjs —— 領域の宣言なし)。入力のファイルは無い。
//   1 プロセス。正本は第338便c の settleRun で書く。仮の値の lib は閉包に入らない。
//
// ■ 言わないこと: 列の採否・どの引きずりで読むか・回転曲線の当否・暗黒物質の要否を書かない(候補の表)。N は解像の要素の数。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w356h-corot.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w356h-corot-1';
export const OUT_MAIN = 'tests/out/corot-356h.json';
export const TARGET = 'tests/lib-w356h-corot.mjs';
export const INPUTS = Object.freeze([]);
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '量の候補の表 —— 「空間ごと回転して見える」をどの量で読むかは原仮定者に伺う(この器は量を 1 つに決めない)',
  '候補の列の表 —— どの列を主にするか・どの引きずりで読むかは決めない(第355便f の表 5c の列は候補のまま)',
  '低 N の小さな系の測った数 —— 銀河の解・回転曲線の当否・暗黒物質の要否ではない。現実の銀河を主張しない',
  '新しい物理は足さない —— 列・模型・積分は第355便f の lib を呼ぶだけ。流体の要素への軸引きずりの口は無い(足りない口)',
  'アプリの積分と、エンジン・内蔵の本・空間メッシュの表示へは入れない']);
export const PLAN = Object.freeze({
  pure: '零試験 8(押しの係数 0 で対照と同じ・剛体の回転の作りものの円盤で散り 0 と傾き +1・ケプラーで傾き −1/2 と平坦で 0・外縁が第355便f の measureAt と同じ・向きのずれの物差し 0°/90°/180°・幅の算術が第355便f の widthOf と同じ・対照どうしの効果 0・入力の拒否)',
  runs: '走り: 模型 2 × 粒 2 × 種 3 × (対照 1 + 列 5 × 押しの係数 2) の時刻 0 と終わりの量の候補 4 つ(角速度の散り・回転曲線の log の傾き・円運動からの向きのずれ・外縁の速さ)',
  eff: '効果: 列 − 対照(外縁は比)と幅(粒の数を倍に・種の間)と効果 ÷ 幅(2 以上を幅の外)—— 効果と幅は絶対の桁 9 で持つ',
  ctrl: '対照の絶対の値(粒 192・種 3 の平均と種の間の差の最大 —— 時刻 0 と終わり)',
});

export function gatesOf(J) {
  const D = L.DECL, nRuns = D.models.length * D.Ns.length * D.seeds.length * (1 + (D.cols.length - 1) * D.gammas.length);
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 8,
    runs: J.runs.length === nRuns && J.runs.every((r) => Number.isFinite(r.q.outer) && Number.isFinite(r.q.dirDev) && Number.isFinite(r.q0.outer)),
    eff: J.eff.length === D.models.length * (D.cols.length - 1) * D.gammas.length && J.eff.every((e) => L.EFF_KEYS.every((k) => e.w[k] === null || e.w[k].width >= 0)),
    ctrl: J.ctrl.length === D.models.length && J.ctrl.every((c) => c.end.dirDev && c.start.dirDev),
  };
}
/** 効果と幅(正本の走りからも作り直せる形 —— QA が同じ関数を呼ぶ) */
export function effOf(runs) {
  const D = L.DECL, eff = [];
  for (const model of D.models) for (const col of D.cols.filter((c) => c !== 'G0')) for (const gamma of D.gammas) {
    const effs = runs.filter((r) => r.model === model && r.col === col && r.gamma === gamma).map((r) => {
      const c = runs.find((q) => q.model === model && q.col === 'G0' && q.N === r.N && q.seed === r.seed);
      return { N: r.N, seed: r.seed, eff: L.effectOf(r.q, c.q) }; });
    eff.push({ model, col, gamma, w: L.widthRound(L.widthOf(effs)) });
  }
  return eff;
}
export function ctrlOf(runs) {
  const D = L.DECL, hi = D.Ns[D.Ns.length - 1];
  return D.models.map((model) => { const rs = runs.filter((r) => r.model === model && r.col === 'G0' && r.N === hi);
    return { model, N: hi, start: L.ctrlAbs(rs.map((r) => r.q0)), end: L.ctrlAbs(rs.map((r) => r.q)) }; });
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const D = L.DECL;
  const PS = L.pureScenes(), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const runs = [];
  for (const model of D.models) for (const N of D.Ns) for (const seed of D.seeds) {
    runs.push({ model, N, seed, col: 'G0', gamma: 0, ...L.runOne(model, N, seed, 'G0', 0) });
    for (const col of D.cols.filter((c) => c !== 'G0')) for (const gamma of D.gammas) runs.push({ model, N, seed, col, gamma, ...L.runOne(model, N, seed, col, gamma) });
  }
  mark('runs');
  const eff = effOf(runs); mark('eff');
  const ctrl = ctrlOf(runs); mark('ctrl');
  const J = { pure, runs, eff, ctrl, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w356h-corot.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W356H_OUT ? (path.isAbsolute(process.env.W356H_OUT) ? process.env.W356H_OUT : path.join(ROOT, process.env.W356H_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第356便h corot(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w356h-corot.mjs', target: TARGET,
    ruling: '原仮定者の指示(2026-11-26)・原仮定者の回答(2026-11-22)・統括の検証項目 R520',
    decl: L.DECL, quants: L.QUANTS, effKeys: L.EFF_KEYS, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第356便h', target: TARGET, code: codeClosure(), inputs: [...INPUTS] }), {
    harnessVersion: HARNESS_VERSION, stage: 'corot', engine: 'Node(html を読まない —— 純関数の lib・第355便f の lib を呼ぶ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
