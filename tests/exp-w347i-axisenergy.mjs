// 第347便i(原仮定者の回答(2026-11-22 —— 第145報の回答 8)・原仮定者の回答(2026-11-22 —— 第145報の回答 9)・統括の検証項目 R408):
//   **軸引きずりのエネルギーの 2 つのケース(行き先「引きずり回転」の型 D1〜D3/「傾きにくくなり釣り合う」の型 Ta〜Td)と組合せ・天体の桁・熱の窓を数える器**
//   (段 axisenergy-347i —— 正本 tests/out/axisenergy-347i.json・lib tests/lib-w347i-axisenergy.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・前の便の lib の本文は変えない。physics の鍵を足さない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w347i-axisenergy.mjs —— 領域の宣言なし)。入力のファイルは無い(前の便の lib を呼んで作り直す)。
//   1 プロセス。正本は第338便c の settleRun で書く。
//
// ■ 探索の方針(第138報): 式の形は走行の前に決め打ちしない —— 正本の先頭(decl・lit・plan)は、走らせたノブの格子と判定の物差しの記録。
// ■ 判定の物差し(零試験 10): Ω⊥ = 0 で何も増えない/トルクの式の自転速度 0 でトルク 0/(D2) で慣性回転が増えない組はトルクが一定(変異で落ちる)/
//   (D1) の行き先の名札/(D3) の閉じた形/Tc・TaTc・Tbc・Tb+ の閉じた形(Ta の尺度を落とす変異で落ちる)/帳簿(戻した分を落とす変異で落ちる)/
//   枝 h の表 15 の (R1) との照合/Td の釣り合いの向き(銀河と 120°)と近づく速さ/入力の拒否。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w347i-axisenergy.mjs';
import * as H from './lib-w347h-axisdiff.mjs';
import * as E from './lib-w347e-spintorque.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w347i-axisenergy-1';
export const OUT_MAIN = 'tests/out/axisenergy-347i.json';
export const TARGET = 'tests/lib-w347i-axisenergy.mjs';
/** 版の履歴(結果を見て変えた所 —— 理由つき) */
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '軸引きずりのエネルギーの 2 つのケースの型の動作の確かめと、型ごとの見え方の表(釣り合いの形や自転の由来の答えではない)', '行き先の型 D1・D2・D3 はどれも候補 —— 主は決めていない',
  '「傾きにくくなる」と「釣り合う」の型 Ta・Tb・Tc・Td はどれも候補', '原文の句の順が成り立つ型の表は、この型・このノブの組では、の表',
  '天体の数は枝 h の (W) の Ω(D₀ = 0・源 1 つ)の例 —— 観測の値(自転の変化の率・地球の歳差の率・熱)は固定の比べる列(合わせない)',
  'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない(AN712)']);
/** 器の宣言(表に出す点) */
export const PLAN = Object.freeze({ pure: '零試験 10', case1: '行き先の型 3 × 行き先の割合 5 × 動いた割合 2(D3 は時定数 2 × 戻る先 2)', vsH: '枝 h の表 15 の (R1) の 9 組 × 行き先の型 3',
  case2: '行き先 2 × 釣り合いの型 7(Tc・TaTc は k_d 2)', td: 'k_g 2 × 尺度の型 2 × 自転の倍 2 × 熱の読み 2', combo: '行き先の型 3 × 釣り合いの型 6', body: '天体 4 組 × q 2', heat: 'イオ・木星 × q 2 × 行き先の列 5' });

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const D = L.DECL;
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 10,
    case1: J.case1.length === 60 && J.case1.every((r) => Math.abs(r.ledgerResid) < 1e-9),
    vsH: J.vsH.length === 9 && J.vsH.every((r) => r.diffs.every((x) => x < 1e-12)),
    case2: J.case2.length === D.splitsCase2.length * (D.bals.length + 2) && J.case2.every((r) => Math.abs(r.ledgerResid) < 1e-9),
    td: J.td.rows.length === 16 && J.td.rows.every((r) => Math.abs(r.ledgerResid) < 1e-8) && Math.abs(J.td.eqGalDeg - 120) < 1e-9,
    combo: J.combo.length === 18 && J.combo.every((r) => Math.abs(r.ledgerResid) < 1e-8),
    body: J.body.length === D.bodies.length * D.bodyQ.length,
    heat: J.heat.rows.length === 4 && Object.keys(J.heat.frac).length === 5,
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const case1 = L.case1Rows(), vsH = L.case1VsH(); mark('case1');
  const case2 = L.case2Rows(); mark('case2');
  const td = L.tdRows(); mark('td');
  const combo = L.comboRows(); mark('combo');
  const HB = H.bodyRows(E.t1Table()), body = L.bodyRows(HB), heat = L.heatRows(HB); mark('body');
  const J = { pure, case1, vsH, case2, td, combo, body, heat, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w347i-axisenergy.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W347I_OUT ? (path.isAbsolute(process.env.W347I_OUT) ? process.env.W347I_OUT : path.join(ROOT, process.env.W347I_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第347便i axisenergy(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w347i-axisenergy.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-22 —— 第145報の回答 8)・原仮定者の回答(2026-11-22 —— 第145報の回答 9)・統括の検証項目 R408',
    decl: L.DECL, lit: L.LIT, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第347便i', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'axisenergy', engine: 'Node(html を読まない —— 純関数の lib の RK4・閉じた形・枝 h の lib を呼ぶ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
