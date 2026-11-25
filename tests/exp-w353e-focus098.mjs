// 第353便e(原仮定者の回答(2026-11-25 —— 第151報)・統括の検証項目 R469):
//   **注目の列 u = 0.98 の器 —— 表 1 0.98 を (N+) に置いた列(受け手 = 8 惑星 + 太陽 × 列 4 —— 主の列は (N+) × 0.98・比べる列は (G−) × 0.98・(N+) × 窓の上端・(N+) × 倍率 1)と
//   最小の受け手・窓の上端を向きと f で/表 2 向きと大きさを分ける表(条件 8 × 向き 2 × 大きさの格子 9)/表 3 金星の条件と 0.98(題 9 × 背景 2 × k 2・受け手 9 × k 2)・零試験 11**
//   (段 focus098-353e —— 正本 tests/out/focus098-353e.json・lib tests/lib-w353e-focus098.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・既存の lib の本文は変えない。physics の鍵を足さない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w353e-focus098.mjs —— 領域の宣言なし)。入力のファイルは無い(lib を呼んで作り直す)。
//   1 プロセス。正本は第338便c の settleRun で書く。仮の値は第352便b の器の数だけ(表 2 の 1 行 —— 正本の最上位に provisional: true と鍵の一覧)。
//
// ■ 言わないこと: 背景の大きさを 0.98 に置いたとは書かない(注目の列)。0.98 を (N+) の窓の内とは書かない(窓の上端より上 —— 寄る割合が上限以下のときだけ傾きは保たれる)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as F from './lib-w353e-focus098.mjs';
import * as E from './lib-w347e-spintorque.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w353e-focus098-1';
export const OUT_MAIN = 'tests/out/focus098-353e.json';
export const TARGET = 'tests/lib-w353e-focus098.mjs';
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '注目の列の表 —— 背景の大きさを 0.98 に置いたとは書かない。窓(下限 0.0487・上限 0.835 (N+)/0.984 (G−) —— 寄る割合 f 1e-3 の前提)は閉じていない',
  '0.98 は (N+) の窓の上端 0.835 より上 —— 「窓の内」とは書かない。寄る割合 f が受け手ごとの上限以下なら、その受け手の傾きは年齢の間 10% 以内に保たれる、の表',
  '向きと大きさを分ける表は、この格子・この幅(角 1e-3°・比 1e-3)での動く/動かないの分け',
  '換算の係数 k を金星の条件から置いた列(表 3)は比べる列 —— k の既定の値を観測から決めない',
  '歳差の率の残りの行は仮の値(未照合)を使う —— 合否にしない',
  'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない']);
export const PLAN = Object.freeze({
  pure: '零試験 11(統括の数え直し 3 の f の上限 (N+) 8 惑星・(G−) 地球と木星・第352便y の窓の数・stateW と同じ状態・k は局所だけ・合成と背景の角の直接の式・背景だけの一周・金星の k・基準軸 L と ω_G・分けの関数・拒否)',
  t1: '表 1: 受け手 9 × 列 4・列ごとの最小の受け手・窓の上端を向き 2 × f 3 で',
  t2: '表 2: 条件 8 × 向き 2 × 大きさの格子 9(全格子と窓の下限から上の 2 つの範囲で分け)',
  t3: '表 3: 題 9 × 背景 2 × k 2(u 0.98)・受け手 9 × k 2((N+) 0.98)',
});
export const PROV_KEYS = Object.freeze(['earth.psiA.rate']);

export function gatesOf(J) {
  const D = F.DECL;
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 11,
    t1: J.t1.rows.length === D.keys.length * 4 && J.t1.min.length === 4 && J.t1.top.length === 6 && J.t1.rows.filter((r) => r.col === 'NpF').every((r) => r.omAxisDeg < 1e-6),
    t2: J.t2.length === F.SEP_CONDS.length && J.t2.every((r) => r.vals.Np.length === D.uGrid.length && r.vals.Gm.length === D.uGrid.length) && J.t2.filter((r) => r.provisional === true).length === 1,
    t3: J.t3.topics.length === 9 * F.T3_BGS.length && J.t3.recv.length === D.keys.length * 2 && J.t3.topics.filter((r) => r.topic === 'vCancel').every((r) => Math.abs(r.vK - 1) < 1e-9),
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const T1 = E.t1Table(), GEO = E.geometry(), cache = {}; mark('input');
  const PS = F.pureScenes(T1, GEO), pure = { scenes: PS, gates: F.pureGates(PS) }; mark('pure');
  const rows = F.table1Rows(T1, GEO, cache), t1 = { cols: F.colsOf(T1, GEO, cache), rows, min: F.table1Min(rows), top: F.topRows(T1, GEO, cache) }; mark('t1');
  const t2 = F.sepTable(T1, GEO, cache); mark('t2');
  const t3 = { uV: F.uVenus(T1, GEO, cache), kV: F.kVenusAt(F.DECL.uFocus, T1, GEO, cache), topics: F.table3Rows(T1, GEO, cache), recv: F.table3Recv(T1, GEO, cache) }; mark('t3');
  const J = { pure, t1, t2, t3, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w353e-focus098.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W353E_OUT ? (path.isAbsolute(process.env.W353E_OUT) ? process.env.W353E_OUT : path.join(ROOT, process.env.W353E_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第353便e focus098(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: F.LIB_VERSION, generator: 'tests/exp-w353e-focus098.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-25 —— 第151報)・統括の検証項目 R469', provisional: true, provKeys: PROV_KEYS.slice(), provMark: S.value.t2.find((r) => r.provisional).provMark,
    decl: F.DECL, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第353便e', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'focus098', engine: 'Node(html を読まない —— 純関数の lib・第352便w・y・za・c・d・第351便d の lib を呼ぶ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
