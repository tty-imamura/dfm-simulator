// 第348便b(原仮定者の回答(2026-11-23 —— 第145報の回答 10)「AN975」・統括の検証項目 R410):
//   **トルクの式の自転速度 = 前のステップの「慣性回転 + 引きずり回転」・引きずり回転は毎ステップリセット —— 步の形の型 S1・S2・S2′(対照 S2″)と
//   リセットの後の行き先 E1・E2・E3 を、〔第347便i〕のケース 1・ケース 2・(Td)・刻みの依り方・天体の桁で数える器**
//   (段 spinreset-348b —— 正本 tests/out/spinreset-348b.json・lib tests/lib-w348b-spinreset.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・前の便の lib の本文は変えない。physics の鍵を足さない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w348b-spinreset.mjs —— 領域の宣言なし)。入力のファイルは無い(前の便の lib を呼んで作り直す)。
//   1 プロセス。正本は第338便c の settleRun で書く。
//
// ■ 探索の方針(第138報): 式の形は走行の前に決め打ちしない —— 正本の先頭(decl・plan)は、走らせたノブの格子と判定の物差しの記録。
// ■ 判定の物差し(零試験 10): Ω⊥ = 0 で変化 0/引きずり回転を積む形に戻すと〔第347便i〕の (D1) に一致(刻み → 0 で 1 次)/θ 固定の連続の閉じた形/
//   〔第347便i〕の (D3) の τ → 0 が (S1) の E1・E3 の極限/帳簿(場との交換を落とす変異・δ を移さない変異で落ちる)/(S2′) で引きずり回転 0 のとき (S1) と同じ/
//   軸が起きる型の連続の閉じた形/(S2″) の毎步の積み/(Td) の釣り合いの向き/入力の拒否。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w348b-spinreset.mjs';
import * as H from './lib-w347h-axisdiff.mjs';
import * as E from './lib-w347e-spintorque.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w348b-spinreset-1';
export const OUT_MAIN = 'tests/out/spinreset-348b.json';
export const TARGET = 'tests/lib-w348b-spinreset.mjs';
/** 版の履歴(結果を見て変えた所 —— 理由つき) */
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '步の形の型 S1・S2・S2′ と行き先 E1・E2・E3 の動作の確かめと、型ごとの見え方の表(自転の式や釣り合いの形の答えではない)', '型 S1・S2・S2′ はどれも候補 —— 主は決めていない(S2″ は対照)',
  '原文の句の順が成り立つ型の表は、この型・この例・このノブの組では、の表', '天体の数は〔第347便h〕の (W) の Ω(D₀ = 0・源 1 つ)の例 —— 観測の自転の変化の率は固定の比べる列(合わせない)',
  'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない(AN712・AN950 と同じ扱い)']);
/** 器の宣言(表に出す点) */
export const PLAN = Object.freeze({ pure: '零試験 10', case1: '種 7(S1・S2 × E1・E2・E3 と S2′)× 行き先の割合 5 × 動いた割合 2', vsI: '〔第347便i〕の (D1)(D2)(D3) と同じ入力 10 組',
  case2: '種 4(S1 × E1・E2・E3 と S2′)× 行き先 2 × 釣り合いの型 9', td: '型 2 × k_g 2 × 尺度の型 2 × 自転の倍 2 × 熱の読み 2', dt: '代表 8 × 刻み 3', body: '天体 4 組 × q 2' });

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const D = L.DECL;
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 10,
    case1: J.case1.length === D.kinds1.length * D.splits.length * D.fCase1.length && J.case1.every((r) => Math.abs(r.ledgerResid) < 1e-9 && r.closedDiff < 1e-3),
    vsI: J.vsI.length === D.splits.length * D.fCase1.length,
    case2: J.case2.length === D.kinds2.length * D.splitsCase2.length * (D.bals.length + 2) && J.case2.every((r) => Math.abs(r.ledgerResid) < 1e-9 && (r.closedDiff === null || r.closedDiff < 1e-3)),
    td: J.td.rows.length === 32 && J.td.rows.every((r) => Math.abs(r.ledgerOverE0) < 1e-11) && Math.abs(J.td.eqGalDeg - 120) < 1e-9,
    dt: J.dt.length === 8 && J.dt.every((r) => r.runs.length === 3 && r.runs.every((x) => Math.abs(x.ledgerResid) < 1e-9)) && J.dt.filter((r) => r.lin !== null).every((r) => r.lin > 9 && r.lin < 11),
    body: J.body.length === D.bodies.length * D.bodyQ.length,
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const case1 = L.case1Rows(), vsI = L.vsIRows(case1); mark('case1');
  const case2 = L.case2Rows(); mark('case2');
  const td = L.tdRows(); mark('td');
  const dt = L.dtRows(); mark('dt');
  const body = L.bodyRows(H.bodyRows(E.t1Table())); mark('body');
  const J = { pure, case1, vsI, case2, td, dt, body, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w348b-spinreset.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W348B_OUT ? (path.isAbsolute(process.env.W348B_OUT) ? process.env.W348B_OUT : path.join(ROOT, process.env.W348B_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第348便b spinreset(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w348b-spinreset.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-23 —— 第145報の回答 10)・統括の検証項目 R410',
    decl: L.DECL, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第348便b', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'spinreset', engine: 'Node(html を読まない —— 純関数の lib の步の形・閉じた形・〔第347便i〕の lib を呼ぶ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
