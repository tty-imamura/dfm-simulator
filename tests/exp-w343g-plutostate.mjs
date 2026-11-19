// 第343便g(原仮定者の補足(2026-11-18 —— 第141報)「冥王星とカロンは、引きずりの影響が少ない、理想的な連星」・決断事項 AN807・AN822・統括の検証項目 R384):
//   **冥王星–カロンを同じ解・同じ元期の状態へ繋ぐ器**(段 plutostate-343g —— 正本 tests/out/plutostate-343g.json・lib tests/lib-w343g-plutostate.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・第341便g の lib の本文は変えない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w343g-plutostate.mjs —— 領域の宣言なし)・入力のファイルは paper/data/pluto-system-states.csv だけ(リポジトリの中 —— 外へ接続しない)。1 プロセス。
//
// ■ 走らせたノブの格子と判定の物差し(正本の先頭 —— 式の形の宣言ではなく、何を測ったかの記録)
//   T1: csv の行の一覧(天体・元期・量・単位・解の名・record_id)と、同じ元期どうしのカロン − 冥王星の相対の状態。
//   T2: 元期 2 × GM の出どころ 2(リポジトリの値 975.4・csv の要素の行から逆に読んだ値)の接触の要素・桁の幅から来る e と a の幅・往復の差・csv の要素の行を同じ定義で作り直した差・元期の間の差。
//   T3: 冥王星の極(リポジトリの中の文献の値)と軌道の法線のなす角(相互ロックなら軸 ≈ 法線は仮定)。
//   T4: 第341便g の関数の 4 量 + 太陽の近日点の段を、第341便g の入力と同じ解の入力 4 列で。対照の段 (2) の作り直し・(3)(4) と、そろえた後に残る差を ÷ n の 1 表に。
//   T5: 元期 A の状態を 2 体のケプラーで元期 B へ(GM 2 つ)。物差し: なし(差の大きさの記録 —— 内訳はこの入力からは分けられない)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w343g-plutostate.mjs';
import * as P341 from './lib-w341g-plutocontrol.mjs';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w343g-plutostate-1';
export const AMEND = Object.freeze([]);
export const OUT_MAIN = 'tests/out/plutostate-343g.json';
export const TARGET = 'tests/lib-w343g-plutostate.mjs';
export const INPUT = L.DECL.csv;
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
export const NOT_CLAIM = Object.freeze(['冥王星–カロンで型が確かめられた、と書かない', '残差が合った・合わない、と書かない(大きさの桁の比べ —— 周期の予言ではない)',
  '引きずりが少ないと分かった、と書かない(補足 3 は原仮定者の補足として引く)', '離心率が決まった、と書かない(接触の e は元期と GM の出どころで動く)',
  '桁の幅を σ と書かない(sigma_kind=digits は 1σ ではない —— 共分散の無い値を σ の判定に流さない)', '入力の定義の差(+7.216805 s)を引きずりの係数・ノブに吸収しない(AN807)',
  '自転の軸と潮汐の係数はこの 6 成分からは得られない(軸 ≈ 法線は仮定)', '文献の値は未照合(行の出どころを書く)']);
export const PLAN = Object.freeze({ epochs: L.DECL.epochs, gmKeys: L.DECL.gmKeys, t4Cols: 5 });

let CACHE = null;
function input() {
  if (CACHE) return CACHE;
  const fp = path.join(ROOT, INPUT), text = fs.readFileSync(fp, 'utf8');
  CACHE = { LD: L.loadPlutoStates(fp), raw: L.rawRows(text) };
  return CACHE;
}
export function gatesOf(J) {
  const t2 = J.t2, inv = J.t1.inventory;
  return {
    pure: Object.values(J.pure.gates).every(Boolean),
    inventory: inv.nRows === 92 && inv.epochsState.length === 2 && inv.ephemeris.length === 1 && inv.gmRows === 0 && inv.sigmaNonEmpty === 0,
    roundTrip: t2.epochs.every((r) => L.DECL.gmKeys.every((k) => r.byGM[k].roundTrip.r <= L.DECL.roundTripTol && r.byGM[k].roundTrip.v <= L.DECL.roundTripTol)),
    remakeBary: t2.epochs.every((r) => Math.abs(r.remakeBary.aRel) <= L.DECL.remakeTol && Math.abs(r.remakeBary.eRel) <= L.DECL.remakeTol && Math.abs(r.remakeBary.PRel) <= L.DECL.remakeTol
      && Math.abs(r.remakeBary.incDeg) <= 1e-9 && Math.abs(r.remakeBary.nodeDeg) <= 1e-9),
    elements: t2.epochs.every((r) => L.DECL.gmKeys.every((k) => fin(r.byGM[k].aKm) && r.byGM[k].e > 0 && r.byGM[k].e < 1e-3 && fin(r.byGM[k].eWidth))),
    t4: J.t4.rows.length === PLAN.t4Cols && J.t4.split.length === PLAN.t4Cols && J.t4.rows.every((r) => fin(r.mutAxObs) && r.syncCirc === 0 && r.mutRotMismatch === 0),
    t5: L.DECL.gmKeys.every((k) => fin(J.t5.byGM[k].posDiffKm)),
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const { LD, raw } = input();
  const PS = L.pureScenes(), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const t1 = { inventory: L.inventory(LD), rel: L.DECL.epochs.map((ep) => { const s = L.relState(LD, ep); return { epoch: ep, r: s.r, v: s.v, qPos: s.qPos, qVel: s.qVel }; }) }; mark('t1');
  const t2 = L.t2Table(LD, raw); mark('t2');
  const t3 = L.t3Table(t2); mark('t3');
  const t4 = L.t4Table(t2); mark('t4');
  const resid = L.residualTable(t2, t4, P341.t3Table().cand); mark('resid');
  const t5 = L.t5Table(LD, t2); mark('t5');
  const J = { pure, t1, t2, t3, t4, resid, t5, timing: tm };
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
export const CODE = Object.freeze(['tests/exp-w343g-plutostate.mjs', 'tests/lib-w343g-plutostate.mjs', 'tests/lib-w277a-plutostates.mjs', 'tests/lib-w270b-obscsv.mjs', 'tests/lib-w341g-plutocontrol.mjs',
  'tests/lib-w340h-thin.mjs', 'tests/lib-w337j-spinorbit.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w338c-recheck.mjs']);
export async function main() {
  const t0 = Date.now();
  const OUT = process.env.W343G_OUT ? (path.isAbsolute(process.env.W343G_OUT) ? process.env.W343G_OUT : path.join(ROOT, process.env.W343G_OUT)) : path.join(ROOT, OUT_MAIN);
  console.log('第343便g plutostate(版 ' + HARNESS_VERSION + ')');
  const { J: R, recheck } = runSettled();
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w343g-plutostate.mjs', target: TARGET,
    ruling: '原仮定者の補足(2026-11-18 —— 第141報)「冥王星とカロンは、引きずりの影響が少ない、理想的な連星」・原仮定者の指示(2026-11-11 —— 第135報)「冥王星とカロンが、連星のヒントになると想定」・決断事項 AN807・AN822(同一解・同一元期の状態ベクトルをそろえてから残差と比べる)・統括の検証項目 R384',
    decl: L.DECL, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第343便g', target: TARGET, code: CODE, inputs: [INPUT] }), {
    harnessVersion: HARNESS_VERSION, stage: 'plutostate', engine: 'Node の純関数だけ(html を読まない・エンジンの步を進めない —— 2 体のケプラーは自前)', notClaim: NOT_CLAIM, recheck });
  writeJson(OUT, out);
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();
