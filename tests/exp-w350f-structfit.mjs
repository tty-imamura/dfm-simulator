// 第350便f(原仮定者の整理(2026-11-23 —— 第146報)・統括の検証項目 R423):
//   **構造別の参考値と、個別の当てはめの診断の器 —— 係数 c_R の入り方 2 つ(腕だけ・自分の重みの球の半径も)と規則の半径の対照・リポジトリに在る比べる数の一覧・
//   当てはめの診断 3 段(全体で 1 つ → 構造の組ごと → 天体ごと —— 同じ量〔歳差の率〕・同じ誤差の置き方)・構造の組の参考値・当てはめに使っていない量の予測の列**
//   (段 structfit-350f —— 正本 tests/out/structfit-350f.json・lib tests/lib-w350f-structfit.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・前の便の lib の本文は変えない。physics の鍵を足さない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w350f-structfit.mjs —— 領域の宣言なし)。入力のファイルは無い(前の便の lib を呼んで作り直す)。
//   1 プロセス。正本は第338便c の settleRun で書く。
//
// ■ 探索の方針(第138報): 式の形は走行の前に決め打ちしない —— 正本の先頭(decl・lit・plan)は、走らせたノブの格子と判定の物差しの記録。
// ■ 判定の物差し(零試験 8): 共通の点検の数(統括の数え直し)/反転・中心線・相対静止・自分の重みと背景 0・同じ速度を足して不変/剛体回転と純粋なずれ/
//   第348便h の表との一致(規則の半径・c_R 1)/地球の 5.06e-2″/年/当てはめの道具の自己試験/変異/入力の拒否。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w350f-structfit.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w350f-structfit-1';
export const OUT_MAIN = 'tests/out/structfit-350f.json';
export const TARGET = 'tests/lib-w350f-structfit.mjs';
/** 版の履歴(結果を見て変えた所 —— 理由つき) */
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '係数 c_R の入り方 2 つ・背景軸引きずりの 2 列・候補 (W)・(P2) ごとの当てはめの診断の表(係数の値や天体の構造の答えではない)', '個別の当てはめは構造を見るための診断 —— 較正の合格ではない・比べる数が増えるまで判定しない',
  '比べる数は第330便a の lib の値(文献の値・未照合)の固定の比べる列(合わせない)', '解が無い・桁違い・平ら・範囲の端は、その事実の表(最適化で任意の 1 点を選ばない)',
  '当てはめに使っていない量の列は予測の列(合わせない)', 'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない(AN712)']);
/** 器の宣言(表に出す点) */
export const PLAN = Object.freeze({ pure: '零試験 8', entry: '代表の 11 天体 × 候補 2(規則の半径・(i) 腕だけ 3 点・(ii) 61 点)', obs: '代表の 11 天体 × 比べる数 3 種(歳差の率・自転の変化の率・熱)',
  fit: '入り方 2 × 候補 2 × 背景 2 × (全体 1 + 組 4 + 天体 11)', ref: '入り方 2 × 候補 2 × 背景 2 × 組 4', pred: '候補 2 × 背景 2 × 代表の 11 天体((ii) の当てはめの c —— 天体 → 組 → 全体の順に在るもの)' });

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const D = L.DECL, nR = D.reps.length, nS = D.modes.length * D.cands.length * D.bgs.length;
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 8,
    entry: J.entry.length === nR * D.cands.length && J.entry.every((r) => r.rule > 0 && r.self1 > 0 && r.arm1 > 0),
    obs: J.obs.length === nR,
    fit: J.fit.length === nS * (1 + Object.keys(D.groups).length + nR) && J.fit.filter((r) => r.level === 'body' && r.n === 0).every((r) => r.c === null),
    ref: J.ref.length === nS * Object.keys(D.groups).length,
    pred: J.pred.length === D.cands.length * D.bgs.length * nR,
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const X = L.makeCtx();
  const PS = L.pureScenes(X), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const entry = L.entryRows(X); mark('entry');
  const obs = L.obsRows(); mark('obs');
  const fit = L.fitRows(X); mark('fit');
  const ref = L.refRows(fit); mark('ref');
  const pred = L.predRows(X, fit); mark('pred');
  const J = { pure, entry, obs, fit, ref, pred, grid: L.cGrid().length, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w350f-structfit.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W350F_OUT ? (path.isAbsolute(process.env.W350F_OUT) ? process.env.W350F_OUT : path.join(ROOT, process.env.W350F_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第350便f structfit(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w350f-structfit.mjs', target: TARGET,
    ruling: '原仮定者の整理(2026-11-23 —— 第146報)・統括の検証項目 R423',
    decl: L.DECL, lit: L.LIT, where: L.WHERE, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第350便f', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'structfit', engine: 'Node(html を読まない —— 純関数の lib・第348便h・第348便c・第347便h・第347便e の lib を呼ぶ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
