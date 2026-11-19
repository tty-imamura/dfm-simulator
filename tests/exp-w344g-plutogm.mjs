// 第344便g(原仮定者の指示(2026-11-19 —— 第144報)「AN891: 中身を足して進める」・決断事項 AN807・AN822・AN885・統括の検証項目 R391):
//   **冥王星–カロン: 重力定数の出どころの追加の列の器**(段 plutogm-344g —— 正本 tests/out/plutogm-344g.json・lib tests/lib-w344g-plutogm.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・第343便g と第341便g の lib の本文は変えない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w344g-plutogm.mjs —— 領域の宣言なし)・入力のファイルは paper/data/pluto-system-states.csv だけ(リポジトリの中 —— 外へ接続しない)。1 プロセス。
// (3)(4) の重力定数は lib の宣言の入力(文献の値・未照合 —— データの表には足さない)。
//
// ■ 走らせた列と判定の物差し(正本の先頭 —— 何を測ったかの記録)
//   T1: 元期 2 × 重力定数の出どころ 4 列の接触の要素・往復の差・(3) の列と統括の参考の試作の表(印字の桁の半分の内か)。(1)(2) の列は〔第343便g〕の同じ関数の数に戻る(門)。
//   T2: 接触の周期と平均の経度の進みから読む平均の周期の差(4 列)・2 つの元期の接触の周期の差。
//   T3: e と近点の引数の 4 列(2 元期)・元期の間の e の差・重力定数に対する e の感度。
//   T4: 第341便g の 4 量 + 近日点の段を 9 列で(第341便g の入力 + 元期 2 × 4)・定義の差の内訳の作り直し 9 列。
//   T5: 質量の比 q(個別の重力定数・推定の値・重心からの距離の比)・2 体のケプラーで元期 A → B の位置の差(4 列)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w344g-plutogm.mjs';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w344g-plutogm-1';
export const AMEND = Object.freeze([]);
export const OUT_MAIN = 'tests/out/plutogm-344g.json';
export const TARGET = 'tests/lib-w344g-plutogm.mjs';
export const INPUT = L.DECL.csv;
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
export const NOT_CLAIM = Object.freeze(['重力定数が決まった、と書かない(4 列を並べる —— (3)(4) は文献の値・未照合)', '周期が合った、と書かない(接触の周期と平均の周期は定義が違う)',
  '離心率が決まった、と書かない(接触の e は元期と重力定数の出どころで動く)', '近点の引数の元期の差を歳差として読まない(入力に無い量 —— AN885)',
  '入力の定義の差(+7.216805 s)を引きずりの係数・ノブに吸収しない(AN807)', '共分散の無い値の 1σ は空欄(推定の値の幅を足し合わせて σ と書かない)', '未照合の数をデータの表に足さない']);
export const PLAN = Object.freeze({ epochs: L.S343.DECL.epochs, gmKeys: L.DECL.gmKeys, t4Cols: 9 });

let CACHE = null;
function input() {
  if (CACHE) return CACHE;
  const fp = path.join(ROOT, INPUT), text = fs.readFileSync(fp, 'utf8');
  CACHE = { LD: L.S343.loadPlutoStates(fp), raw: L.S343.rawRows(text) };
  return CACHE;
}
/** (1)(2) の列が〔第343便g〕の同じ関数の数に戻るか(相対 —— 同じ関数を呼ぶので丸めの内) */
export function same343(t1, t2_343) {
  const tol = L.DECL.same343Tol, eq = (a, b) => a === b || Math.abs(a - b) <= tol * Math.max(Math.abs(a), Math.abs(b));
  let n = 0, off = 0;
  t1.epochs.forEach((r, i) => { for (const k of L.DECL.gmKeys343) { const a = r.byGM[k], b = t2_343.epochs[i].byGM[k]; for (const q of ['GM', 'aKm', 'e', 'incDeg', 'nodeDeg', 'periDeg', 'P']) { n++; if (!eq(a[q], b[q])) off++; } } });
  return { n, off };
}
export function gatesOf(J) {
  return {
    pure: Object.values(J.pure.gates).every(Boolean),
    same343: J.same343.n === 28 && J.same343.off === 0,
    roundTrip: J.t1.epochs.every((r) => L.DECL.gmKeys.every((k) => r.byGM[k].roundTrip <= L.DECL.roundTripTol)),
    elements: J.t1.epochs.every((r) => L.DECL.gmKeys.every((k) => fin(r.byGM[k].aKm) && r.byGM[k].e > 0 && r.byGM[k].e < 1e-3)),
    ref: J.t1.ref.length === 2 && J.t1.ref.every((x) => typeof x.within === 'boolean'),
    t4: J.t4.rows.length === PLAN.t4Cols && J.t4.split.length === PLAN.t4Cols && J.t4.rows.every((r) => fin(r.mutAxObs) && r.syncCirc === 0),
    t5: L.DECL.gmKeys.every((k) => fin(J.t5.kep[k].posDiffKm)),
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const { LD, raw } = input();
  const PS = L.pureScenes(), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const t1 = L.t1Table(LD); mark('t1');
  const s3 = same343(t1, L.S343.t2Table(LD, raw)); mark('same343');
  const t2 = L.t2Table(t1); mark('t2');
  const t3 = L.t3Table(t1); mark('t3');
  const t4 = L.t4Table(t1); mark('t4');
  const t5 = L.t5Table(LD, t1); mark('t5');
  const J = { pure, t1, same343: s3, t2, t3, t4, t5, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}
export function runSettled() {
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const { gates, ok, ...rest } = S.value;
  return { J: Object.assign(rest, { timing: tm, gates, ok }), recheck: S.meta };
}
const writeJson = (OUT, out) => { fs.mkdirSync(path.dirname(OUT), { recursive: true }); fs.writeFileSync(OUT, JSON.stringify(out, null, 1).replace(/\[\s*(-?[\d.eE+-]+(?:,\s*-?[\d.eE+-]+|,\s*null)*)\s*\]/g, (m, a) => '[' + a.replace(/\s+/g, '') + ']') + '\n'); };
export const CODE = Object.freeze(['tests/exp-w344g-plutogm.mjs', 'tests/lib-w344g-plutogm.mjs', 'tests/lib-w343g-plutostate.mjs', 'tests/lib-w277a-plutostates.mjs', 'tests/lib-w270b-obscsv.mjs',
  'tests/lib-w341g-plutocontrol.mjs', 'tests/lib-w340h-thin.mjs', 'tests/lib-w337j-spinorbit.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w338c-recheck.mjs']);
export async function main() {
  const t0 = Date.now();
  const OUT = process.env.W344G_OUT ? (path.isAbsolute(process.env.W344G_OUT) ? process.env.W344G_OUT : path.join(ROOT, process.env.W344G_OUT)) : path.join(ROOT, OUT_MAIN);
  console.log('第344便g plutogm(版 ' + HARNESS_VERSION + ')');
  const { J: R, recheck } = runSettled();
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w344g-plutogm.mjs', target: TARGET,
    ruling: '原仮定者の指示(2026-11-19 —— 第144報)「AN891: 中身を足して進める」・決断事項 AN807・AN822(同一解・同一元期の状態ベクトルをそろえてから残差と比べる)・AN885(重力定数は列で並べる・平均の周期を主に・近点の率は比べない)・統括の検証項目 R391',
    decl: L.DECL, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第344便g', target: TARGET, code: CODE, inputs: [INPUT] }), {
    harnessVersion: HARNESS_VERSION, stage: 'plutogm', engine: 'Node の純関数だけ(html を読まない・エンジンの步を進めない —— 2 体のケプラーは第343便g の lib)', notClaim: NOT_CLAIM, recheck });
  writeJson(OUT, out);
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();
