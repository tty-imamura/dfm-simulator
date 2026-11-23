// 第350便d(原仮定者の整理(2026-11-23 —— 第146報)・統括の検証項目 R421):
//   **軸引きずりの「軸が動かなかった分のエネルギー」の行き先を数える器 —— 供給の則の列((P1) 既存の仮定・(P0) 供給 0)・行き先の表(主の 2 列 内部熱・慣性回転とその間・
//   比べる列 引きずり回転 × (E1)(E2)(E3))・釣り合い方の 2 列((K1)・(K2)・対照 歳差だけ)× 軸の応答 m × 熱の割合 h・天体 4 組の桁(在位の形の場の Ω)**
//   (段 axisheat-350d —— 正本 tests/out/axisheat-350d.json・lib tests/lib-w350d-axisheat.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・前の便の lib の本文は変えない。physics の鍵を足さない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w350d-axisheat.mjs —— 領域の宣言なし)。入力のファイルは無い(前の便の lib を呼んで作り直す)。
//   1 プロセス。正本は第338便c の settleRun で書く。
//
// ■ 探索の方針(第138報): 式の形は走行の前に決め打ちしない —— 正本の先頭(decl・lit・plan)は、走らせたノブの格子と判定の物差しの記録。
// ■ 判定の物差し(零試験 11): Ω⊥ = 0 で熱 0・自転の増し 0/(P0) で熱 0/第348便h の 22.4 倍・1.77 倍/〔第348便b〕の步と同じ数/帳簿の残差(二重に数える変異 2 つ・
//   場との交換を落とす変異で落ちる)/逆自転の鏡映/θ 固定の閉じた形/(K1) の届く先の対/torqueMag/共通の点検の数/入力の拒否。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w350d-axisheat.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w350d-axisheat-1';
export const OUT_MAIN = 'tests/out/axisheat-350d.json';
export const TARGET = 'tests/lib-w350d-axisheat.mjs';
/** 版の履歴(結果を見て変えた所 —— 理由つき) */
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '供給の則 (P1) は既存の診断の仮定(軸が動かなかった分の率 = トルクの大きさ × abs(Ω⊥))—— 理想の直交トルクは自転に仕事をしない((P0))。熱の出どころの答えではない',
  '行き先(内部熱・慣性回転・引きずり回転 × (E1)(E2)(E3))は並べて比べる列 —— 行き先は決めていない', '釣り合い方 (K1)・(K2) はどちらも読みの候補 —— どちらが原文の意味かは決めていない',
  '天体 4 組の熱の率と自転の変化の率は、この供給の則の仮定・この行き先・在位の形の場の (W)・(P2) の下の桁(天体の内部熱の答えではない)',
  '比べる列(熱の物差し・観測の自転の変化の率)は第341便f・第347便e の lib の値(文献の値・未照合)の固定の列(合わせない)', 'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない(AN712)']);
/** 器の宣言(表に出す点) */
export const PLAN = Object.freeze({ pure: '零試験 11', supply: '供給の則 5 行(既存の lib 3・本節 1・対照 1)', dest: '則 2 × (主の格子 5 + 比べる列 3)', bal: '釣り合い方 3 × m 4 × h 3', body: '4 組 × 候補 2 × 行き先の列 7' });

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const D = L.DECL;
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 11,
    supply: J.supply.rows.length === 5 && J.supply.rows.filter((r) => r.rule === 'P1').every((r) => Math.abs(r.ratio - 1) < 1e-9) && J.supply.rows.filter((r) => r.rule === 'P0').every((r) => r.rate === 0),
    dest: J.dest.length === D.rules.length * (D.hGrid.length + D.cols.length) && J.dest.every((r) => Math.abs(r.ledgerResid) < 1e-9 && r.stepResid < 1e-9),
    bal: J.bal.length === D.bals.length * D.bal.mGrid.length * D.bal.hGrid.length && J.bal.every((r) => Math.abs(r.ledgerResid) < 1e-9),
    body: J.body.length === D.bodies.length * D.cands.length && J.body.every((r) => Number.isFinite(r.supplyW) && r.supplyW >= 0),
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const supply = L.supplyRows(); mark('supply');
  const dest = L.destRows(); mark('dest');
  const bal = L.balRows(); mark('bal');
  const body = L.bodyRows(); mark('body');
  const J = { pure, supply, dest, bal, body, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w350d-axisheat.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W350D_OUT ? (path.isAbsolute(process.env.W350D_OUT) ? process.env.W350D_OUT : path.join(ROOT, process.env.W350D_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第350便d axisheat(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w350d-axisheat.mjs', target: TARGET,
    ruling: '原仮定者の整理(2026-11-23 —— 第146報)・統括の検証項目 R421',
    decl: L.DECL, lit: L.LIT, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第350便d', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'axisheat', engine: 'Node(html を読まない —— 純関数の lib・第348便h・第348便b・第347便i・第347便e・第341便f の lib を呼ぶ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
