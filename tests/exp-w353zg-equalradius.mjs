// 第353便zg(原仮定者の回答(2026-11-25 —— 第151報)「向きと幾何」・AN1045・AN1039・AN1034・統括の検証項目 R495):
//   **局所の項(太陽由来 + 母天体の自転の分)が金星の局所の項と同じ大きさになる母天体の赤道の円の道の半径 a★(等大の半径)の器 ——
//   表 1 木星・土星 × 扁平の倍 3 通りの a★ と入力の幅・衛星と環の半径 ÷ a★ と x/表 2 閉じた形とほかの母天体(地球・火星・天王星・海王星)/
//   表 3 偶然の並びの見込み(概算)/表 4 a★ の内と外の合成の軸(金星の条件の背景・0.98 + 換算の係数)**
//   (段 equalradius-353zg —— 正本 tests/out/equalradius-353zg.json・lib tests/lib-w353zg-equalradius.mjs)。
//   **診断だけ** —— 衛星や環の位置・背景の大きさは決めない(2 組の照合 —— 候補の表。見込みは概算)。エンジン・内蔵の本・受理器・前の便の lib の本文と正本と段は変えない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w353zg-equalradius.mjs —— 領域の宣言なし)。入力のファイルなし。1 プロセス。正本は第338便c の settleRun で書く。仮の値は使わない。
//
// ■ 探索の方針(第138報): 式の形は走行の前に決め打ちしない —— 正本の先頭(decl・plan)は、走らせたノブの格子と判定の物差しの記録。
// ■ 判定の物差し(零試験 10): 便の始めの数え直しの数・第353便z の moonParts・受け手の質量に依らない・入力の倍 1 の恒等・母天体由来の冪 −3・0.98 の列・第352便v の uV・閉じた形・第338便d の区分・拒否。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as E from './lib-w347e-spintorque.mjs';
import * as L from './lib-w353zg-equalradius.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w353zg-equalradius-1';
export const OUT_MAIN = 'tests/out/equalradius-353zg.json';
export const TARGET = 'tests/lib-w353zg-equalradius.mjs';
/** 版の履歴(結果を見て変えた所 —— 理由つき) */
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  'イオの道やカッシーニの間隙の位置を、等大の半径で書き換えたのではない —— リポジトリの半径の数と a★ を並べた表',
  '照合できる組は木星 → イオと土星 → カッシーニの間隙の辺りの 2 組 —— 偶然の並びとまだ区別できていない(見込みは対数で一様に置いた概算)',
  '背景の大きさは決めていない —— 金星の条件の大きさを物差しに置いた列と 0.98 の列(比なので同じ軸)',
  '合成の軸の表は軸引きずりの合成の向き —— 環の形や衛星の道の面の材料ではない',
  '質量・距離・自転の周期・扁平率・衛星と環の半径はリポジトリに在る数(文献の値・未照合)だけ',
  'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない(AN712)']);
/** 器の宣言(表に出す点) */
export const PLAN = Object.freeze({ pure: '零試験 10', t1: '表 1: 木星・土星 × 扁平の倍 3 通り(倍なし・n 2・n 5)の a★ と入力 6 つの最後の桁 ±1 の幅・衛星と環の半径 ÷ a★ と x',
  t2: '表 2: a★ の閉じた形(冪だけ・幾何の補正・太陽由来の分)と数の差・地球・火星・天王星・海王星の a★ と構造', t3: '表 3: 偶然の並びの見込み(a★ を観測の半径の 1〜30 倍に対数で一様 —— ±5%・±2%・構造の置き方 2 つ)',
  t4: '表 4: 観測の半径の 1.2〜12 倍の格子・衛星と環・土星の環の区分の縁で、合成の軸と自転軸・基準軸の角(金星の条件の背景と 0.98 の列)・軸が半分替わる半径 ÷ a★' });

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const D = L.DECL, ok = (x) => typeof x === 'number' && Number.isFinite(x);
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 10,
    t1: J.t1.length === 2 && J.t1.every((h) => h.cols.length === D.nList.length && h.cols.every((c) => ok(c.aStar) && c.widths.length === 6 && c.widths.every((w) => ok(w.aPlus) && ok(w.aMinus))) && h.structs.length >= 5 && h.structs.every((s) => s.cells.every((c) => ok(c.ratio) && ok(c.x)))),
    t2: J.t2.rows.length === 2 * D.nList.length + D.others.length && J.t2.rows.every((r) => ok(r.a) && ok(r.a0) && ok(r.aGeo) && ok(r.aSun)) && J.t2.structs.length === D.others.length,
    t3: J.t3.hosts.length === 2 && J.t3.hosts.every((h) => h.probs.length === D.probTol.length && h.probs.every((p) => ok(p.rep.p) && ok(p.repEdges.p))) && J.t3.both.length === D.probTol.length,
    t4: J.t4.length === 2 && J.t4.every((h) => h.grid.length === D.axisGrid.length && h.grid.every((g) => ok(g.angRef) && ok(g.angRef098)) && h.halves.every((q) => ok(q.ratio))),
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const T1 = E.t1Table(), GEO = E.geometry();
  const PSc = L.pureScenes(T1, GEO), pure = { scenes: PSc, gates: L.pureGates(PSc) }; mark('pure');
  const t1 = L.table1(T1, GEO); mark('t1');
  const t2 = L.table2(T1, GEO); mark('t2');
  const t3 = L.table3(T1, GEO, t1); mark('t3');
  const t4 = L.table4(T1, GEO, t1); mark('t4');
  const J = { pure, t1, t2, t3, t4, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}
/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w353zg-equalradius.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}
/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W353ZG_OUT ? (path.isAbsolute(process.env.W353ZG_OUT) ? process.env.W353ZG_OUT : path.join(ROOT, process.env.W353ZG_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第353便zg equalradius(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w353zg-equalradius.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-25 —— 第151報)「向きと幾何」・AN1045・AN1039・AN1034・統括の検証項目 R495',
    decl: L.DECL, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第353便zg', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'equalradius', engine: 'Node(html を読まない —— 純関数の lib: 〔第353便d〕の circRot・〔第352便k〕の spinRot・〔第353便p〕の rotP・localStd・bg1・〔第353便z〕の moonParts を呼ぶ)・入力のファイルは無い',
    notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
