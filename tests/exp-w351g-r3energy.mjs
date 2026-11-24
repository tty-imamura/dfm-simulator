// 第351便g(原仮定者の整理(2026-11-23 —— 第146報)・原仮定者の回答(2026-11-24 —— 第147報)・統括の検証項目 R433):
//   **エネルギーの帳簿を (R3) の 2 経路の步の上で数える器 —— 零試験・m と f の関係の置き方 (m1)(m2)(m3) × 置き方 (N1)(N2) × f 3(表 1)・釣り合い方 R3・(K1)・(K2) × f 3 × 行き先 4(表 2)・
//   潮汐ロックの天体(イオ・月)の由来 × 成分 (M)(S)(MS) × 読み (C2) の熱の率の桁(表 3)・軸が起きる仕事の読み (A0)(A1)(表 4)**
//   (段 r3energy-351g —— 正本 tests/out/r3energy-351g.json・lib tests/lib-w351g-r3energy.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・前の便の lib の本文は変えない。physics の鍵を足さない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w351g-r3energy.mjs —— 領域の宣言なし)。入力のファイルは無い(前の便の lib を呼んで作り直す)。
//   1 プロセス。正本は第338便c の settleRun で書く。
//
// ■ 探索の方針(第138報): 式の形は走行の前に決め打ちしない —— 正本の先頭(decl・lit・plan)は、走らせたノブの格子と判定の物差しの記録。供給の率は仮定の列 —— 供給 0 の対照 (P0) を必ず並べる。
// ■ 判定の物差し(零試験 11): トルクの仕事率 τ·ω = 0/(P0) で熱 0・慣性回転は不変/帳簿の残差(二重に数える変異・場との交換を落とす変異で落ちる)/f 0 = 〔第350便d〕の歳差だけの列/
//   步 = 第351便d の r3Step と closedR3/Ω⊥ → 0 で供給が止まる/(A1) の和/m の置き方/ロックの拘束/共通の点検の数/入力の拒否。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w351g-r3energy.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w351g-r3energy-1';
export const OUT_MAIN = 'tests/out/r3energy-351g.json';
export const TARGET = 'tests/lib-w351g-r3energy.mjs';
/** 版の履歴(結果を見て変えた所 —— 理由つき) */
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '供給の則 (P1) は〔第350便d〕の仮定の式(軸が動かなかった分の率 = (1 − m) × トルクの大きさ × abs(Ω⊥))—— 供給の率の出どころは決まっていない。供給 0 の対照 (P0) を必ず並べた',
  '行き先(内部熱・慣性回転・引きずり回転 × (E1)(E2)(E3))・m と f の関係の置き方 (m1)(m2)(m3)・釣り合い方 (K1)(K2)・軸が起きる仕事の読み (A0)(A1) はどれも並べて比べる列 —— どれも決めていない',
  'イオと月の熱の率は、この供給の則の仮定・この成分・読み (C2) の下の桁(天体の内部熱の答えではない)。比べる列(熱の物差し)は〔第341便f〕の lib の値(文献の値・未照合)の固定の列(合わせない)',
  'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない(AN712)']);
/** 器の宣言(表に出す点) */
export const PLAN = Object.freeze({ pure: '零試験 11', mf: '置き方 2 × f 3 × m の置き方 4((m1) 0・0.5・(m2)・(m3))× 行き先 2 + 対照 (P0)', bal: '釣り合い方 3 × f 3 × 行き先 4((m2)・(N1))',
  lock: '2 天体 × (由来 3 × 成分 3 + 局所 + 背景 1)', axis: 'f 3 × 則 2((m2)・(N1)・行き先 慣性回転)' });

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const D = L.DECL;
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 11,
    mf: J.mf.length === D.norms.length * D.fShow.length * 4 && J.mf.every((r) => r.ledger < 1e-9 && r.p0Heat === 0 && r.p0Wi === 0),
    bal: J.bal.length === D.bals.length * D.fShow.length * 4 && J.bal.every((r) => r.ledger < 1e-9),
    lock: J.lock.length === D.lockBodies.length * (D.origins.length * D.parts.length + 1) && J.lock.every((r) => Number.isFinite(r.supplyW) && r.supplyW >= 0 && r.p0W === 0 && r.lockFieldW === 0),
    axis: J.axis.length === D.fShow.length * D.rules.length && J.axis.every((r) => r.ledger < 1e-9 && Math.abs(r.sumA1 - r.gross) <= 1e-12 * Math.max(1, r.gross)),
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const mf = L.mfRows(); mark('mf');
  const bal = L.balRows(); mark('bal');
  const lock = L.lockRows(); mark('lock');
  const axis = L.axisWorkRows(); mark('axis');
  const J = { pure, mf, bal, lock, axis, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w351g-r3energy.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W351G_OUT ? (path.isAbsolute(process.env.W351G_OUT) ? process.env.W351G_OUT : path.join(ROOT, process.env.W351G_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第351便g r3energy(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w351g-r3energy.mjs', target: TARGET,
    ruling: '原仮定者の整理(2026-11-23 —— 第146報)・原仮定者の回答(2026-11-24 —— 第147報)・統括の検証項目 R433',
    decl: L.DECL, lit: L.LIT, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第351便g', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'r3energy', engine: 'Node(html を読まない —— 純関数の lib・第350便d・第351便d・第351便c・第347便e の lib を呼ぶ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
