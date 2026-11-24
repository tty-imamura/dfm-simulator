// 第352便b(原仮定者の回答(2026-11-24 —— 第148報)「AN1026: Aで進める。未照合でも確度の高い数値で仮計算し、後追いで照合する」・統括の検証項目 R439):
//   **仮の値の器 —— 台帳 PROV(全部「仮・未照合」の印)・リポジトリの数との照合の列・経路の比率の感度の仮計算(地球 3 列・火星 2 列)と、極が動く速さと主の列の合成の率の比**
//   (段 provisional-352b —— 正本 tests/out/provisional-352b.json・lib tests/lib-w352b-provisional.mjs)。
//   **診断だけ** —— 仮の値から係数・比率・背景の大きさの答えを出すものではない。正本の最上位に provisional: true と使った鍵の一覧を持つ(較正の合否・サンプルの状況・ノブの採否に入れない)。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w352b-provisional.mjs —— 領域の宣言なし)。入力のファイルは無い(前の便の lib を呼んで作り直す)。1 プロセス。正本は第338便c の settleRun で書く。
// ■ 判定の物差し(零試験 10): 台帳の欄と印/変異/口/向きの符号/照合の列/使ってよい所の門/統括の数え直し 1 の数/共通の点検の数/比の式/主の列の合成の率。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as E from './lib-w347e-spintorque.mjs';
import * as L from './lib-w352b-provisional.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w352b-provisional-1';
export const OUT_MAIN = 'tests/out/provisional-352b.json';
export const TARGET = 'tests/lib-w352b-provisional.mjs';
/** 版の履歴(結果を見て変えた所 —— 理由つき) */
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '仮の値は統括の手元の知識の数で、一次の資料に当たっていない(仮・未照合)—— 較正の合否・サンプルの状況・ノブの採否・正式判定値に入れない',
  '経路の比率の感度の数は、前提(観測の基準の極 = 合成の軸・一定の場・ほかのトルクなし)の下の数 —— この前提は今の候補では成り立っていない。ノブの値ではない',
  '照合の列は、仮の値とリポジトリの数の差を並べるだけ(どちらかを正しいとは言わない)',
  'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない']);
/** 器の宣言(表に出す点) */
export const PLAN = Object.freeze({ pure: '零試験 10', prov: '台帳 20 件', cross: '照合の列 11', t4: '地球 3 列 + 火星 2 列 × 背景の向き 4' });

/* ───────── 門 ───────── */
export function gatesOf(J) {
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 10,
    prov: J.prov.length === L.DECL.nProv && J.prov.every((e) => L.entryProblems(e).length === 0),
    cross: J.cross.length === 11,
    t4: J.t4.length === 5 && J.t4.every((r) => r.provisional === true && r.provKeys.length > 0 && L.DECL.bgDirs.every((d) => r.mainRateAsYr[d] > 0)),
    mark: J.provisional === true && J.provKeys.length > 0 && L.outMarkProblems(J).length === 0,
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const T1 = E.t1Table(), GEO = E.geometry(), cache = {};
  const PS = L.pureScenes(T1, GEO), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const prov = L.provJson(), repoRefs = L.repoRefList(); mark('prov');
  const cross = L.crossRows(GEO); mark('cross');
  const t4 = L.t4Rows(T1, GEO, cache); mark('t4');
  const used = [...new Set(t4.flatMap((r) => r.provKeys).concat(cross.filter((r) => r.prov !== null).flatMap((r) => r.key.split('・'))))].sort();
  const J = { pure, prov, repoRefs, cross, t4, t4Premise: L.T4_PREMISE, usedKeys: used, timing: tm };
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w352b-provisional.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W352B_OUT ? (path.isAbsolute(process.env.W352B_OUT) ? process.env.W352B_OUT : path.join(ROOT, process.env.W352B_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第352便b provisional(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = L.tagProv({ version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w352b-provisional.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-24 —— 第148報)・統括の検証項目 R439',
    decl: L.DECL, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm }, S.value.usedKeys);
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第352便b', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'provisional', engine: 'Node(html を読まない —— 純関数の lib・第351便e・第350便e・第347便e・第337便c・第330便a の lib を呼ぶ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  out.gates = gatesOf(out); out.ok = Object.values(out.gates).every(Boolean);
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
