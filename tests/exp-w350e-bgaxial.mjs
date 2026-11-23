// 第350便e(原仮定者の整理(2026-11-23 —— 第146報)・統括の検証項目 R422):
//   **背景軸引きずりと、釣り合う軸の向き・歳差を数える器 —— 置き方 3 列 (B1)(B2)(B3)・サンプルの中の源との合成(母天体あり/なし・分母に銀河の重みを含む/含まない)・
//   天体 15 組の合成の方向と δ と歳差の率・地球・火星・土星・月の k_bg × 向きの格子と比べる数に届く k_bg・零試験と変異と共通の点検の数**
//   (段 bgaxial-350e —— 正本 tests/out/bgaxial-350e.json・lib tests/lib-w350e-bgaxial.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・前の便の lib の本文は変えない。physics の鍵を足さない。背景軸引きずりの鍵はアプリに足さない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w350e-bgaxial.mjs —— 領域の宣言なし)。入力のファイルは無い(前の便の lib を呼んで作り直す)。
//   1 プロセス。正本は第338便c の settleRun で書く。
//
// ■ 探索の方針(第138報): 式の形は走行の前に決め打ちしない —— 正本の先頭(decl・lit・plan)は、走らせたノブの格子と判定の物差しの記録。
// ■ 判定の物差し(零試験 10): 共通の点検の数 3 つ/反転・中心線・相対静止・源 1 つ・ガリレイ/剛体回転と純粋なずれ/(B1) k 1 は第348便c の合成と同じ・k 0 は源の項だけ/
//   背景を 2 倍にすると背景の項だけ 2 倍/母天体の列の切り替え/同じ重みを 2 度掛けない/ほぼ 0 の合成は向きを決めない/分母の列と k_bg の根/入力の拒否。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w350e-bgaxial.mjs';
import * as E from './lib-w347e-spintorque.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w350e-bgaxial-1';
export const OUT_MAIN = 'tests/out/bgaxial-350e.json';
export const TARGET = 'tests/lib-w350e-bgaxial.mjs';
/** 版の履歴(結果を見て変えた所 —— 理由つき) */
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '背景軸引きずりの置き方 3 列・合成の方向・δ・歳差の率の表(歳差の答え・釣り合う向きの答えではない)', '背景軸引きずりの大きさ・向きはノブ —— 大きさは決めていない(比べる数に届く k_bg は並べる数)',
  '(B1) は銀河を円の道の中心の質量 1 つに置く宣言(第337便c の 2 値)の下で、銀河を geoPN=3 の場の源として数えた値', '母天体の列 2 つ・分母の列 2 つはどちらも候補 —— 主は決めていない(AN1001 は伺っている)',
  '観測の歳差の角速度は第330便a の lib の値(文献の値・未照合)の固定の比べる列(合わせない)—— 月の比べる数は軌道の交点の周期(軸の歳差とは別の量)', 'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない(AN712)']);
/** 器の宣言(表に出す点) */
export const PLAN = Object.freeze({ pure: '零試験 10(共通の点検の数を含む)', bg: '15 組 × 候補 2((B1) の大きさと向き)', bal: '15 組 × 分母 2 × 候補 2 × 母天体 2 × k_bg 0・1',
  grid: '4 組 × 候補 2 × 向き 3 × k_bg 6', need: '4 組 × 候補 2 × 向き 3(比べる数に届く k_bg)', den: '15 組 × 候補 2(分母の列 in と out の差)' });

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const D = L.DECL;
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 10,
    bg: J.bg.length === 15 * D.cands.length && J.bg.every((r) => r.b1MagYr > 0 && r.b1OverS > 0),
    bal: J.bal.length === 15 * D.dens.length * D.cands.length * D.parents.length * D.t3k.length && J.bal.every((r) => r.undetermined === false && Number.isFinite(r.precAsYr) && r.precAsYr > 0),
    grid: J.grid.length === D.t4.length * D.cands.length * D.dirs.length * D.kbg.length && J.grid.every((r) => Number.isFinite(r.precAsYr)),
    need: J.need.length === D.t4.length * D.cands.length * D.dirs.length,
    den: J.den.length === 15 * D.cands.length,
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const T1 = E.t1Table(), GEO = E.geometry(), cache = L.makeCache(T1, GEO); mark('cache');
  const PS = L.pureScenes(T1, GEO, cache), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const bg = L.bgRows(T1, GEO, cache), bal = L.balRows(T1, GEO, cache); mark('bal');
  const G = L.gridRows(T1, GEO, cache), den = L.denRows(cache, GEO); mark('grid');
  const J = { pure, bg, bal, grid: G.grid, need: G.need, den, dirUnits: L.dirUnits(GEO), timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w350e-bgaxial.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W350E_OUT ? (path.isAbsolute(process.env.W350E_OUT) ? process.env.W350E_OUT : path.join(ROOT, process.env.W350E_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第350便e bgaxial(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w350e-bgaxial.mjs', target: TARGET,
    ruling: '原仮定者の整理(2026-11-23 —— 第146報)・統括の検証項目 R422',
    decl: L.DECL, lit: L.LIT, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第350便e', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'bgaxial', engine: 'Node(html を読まない —— 純関数の lib・第348便h・第348便c・第347便e の lib を呼ぶ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
