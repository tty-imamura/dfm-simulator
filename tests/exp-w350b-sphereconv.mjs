// 第350便b(原仮定者の整理(2026-11-23 —— 第146報)・統括の検証項目 R419):
//   **「球体に換算して計算する」の 3 つの読み (C1)(C2)(C3) を geoPN=3 の場(在位の形)で並べる器 —— 読みの式と次数・回転の読みの試し(共通の点検の数)・回転する源の「源の回転の分」と
//   「移動の分」・天体 15 組の由来ごとの回転と (W1) の釣り合う向きと歳差の率**(段 sphereconv-350b —— 正本 tests/out/sphereconv-350b.json・lib tests/lib-w350b-sphereconv.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・前の便の lib の本文は変えない。physics の鍵を足さない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w350b-sphereconv.mjs —— 領域の宣言なし)。入力のファイルは無い(前の便の lib を呼んで作り直す)。
//   1 プロセス。正本は第338便c の settleRun で書く。
//
// ■ 探索の方針(第138報): 式の形は走行の前に決め打ちしない —— 正本の先頭(decl・lit・plan)は、走らせたノブの格子と判定の物差しの記録。
// ■ 判定の物差し(零試験 8): 共通の点検の数/反転・中心線・相対静止・自分の重みも背景も 0・同じ速度を足す/剛体回転/純粋なずれ/(C2) の求積と〔第347便h〕の (V)・(C3) は k 倍/
//   自分の重みの閉じた形と (C2) の球の天体の口/変異 4 つで共通の点検の数から外れる/入力の拒否。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w350b-sphereconv.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w350b-sphereconv-1';
export const OUT_MAIN = 'tests/out/sphereconv-350b.json';
export const TARGET = 'tests/lib-w350b-sphereconv.mjs';
/** 版の履歴(結果を見て変えた所 —— 理由つき) */
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '「球体に換算」の 3 つの読み (C1)(C2)(C3) を同じ場で並べた表(読みは決めていない —— 主の列は原仮定者に伺っている)', '2 点の差分が球の自転を表すとは言わない(この場・この配置・この読みでは、の表)',
  '場は geoPN=3 の在位の形(〔第348便h〕の makeField3 の既定の引数)だけ —— 比べる形の場は数えていない', '天体の表の (C2) は場の一次の展開の下の数(腕 ≪ 距離)',
  '観測の歳差の角速度は第330便a の lib の値(文献の値・未照合)の固定の比べる列(合わせない)', 'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない(AN712)']);
/** 器の宣言(表に出す点) */
export const PLAN = Object.freeze({ pure: '零試験 8', order: '球の半径・腕 5 つ(共通の点検の場)', ballCheck: '距離 3 つ(腕 ≪ 距離 —— 球の求積と半径の平均)', trial: '場面 8 × 読み 6',
  spinSrc: '緯度 3 × 距離 4 × 腕 3(適用の外の件数つき)× 対 2', body: '15 組 × 読み 4(主の場の組 —— (C1)・(C2)・(C2) の球・(C3) k 2/5)' });

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const D = L.DECL, sp = J.spinSrc.filter((r) => r.applicable), SF = J.selfFactors;
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 8,
    order: J.order.length === D.orderA.length && J.order.slice(1).every((r) => Math.abs(r.ordC2W - 2) < 0.05 && Math.abs(r.ordP6W - 2) < 0.05 && Math.abs(r.ordC1lim - 2) < 0.05),
    ballCheck: J.ballCheck.length === D.ballCheck.d.length && J.ballCheck.every((r, k) => k === 0 || (r.dQB < J.ballCheck[k - 1].dQB / 3)) && J.ballCheck[J.ballCheck.length - 1].dQB < 1e-6,
    trial: J.trial.length === 8,
    spinSrc: J.spinSrc.length === D.spinSrc.lat.length * D.spinSrc.d.length * D.spinSrc.h.length && J.spinSrc.filter((r) => !r.applicable).length === J.outCount
      && sp.every((r) => ['C1', 'C1lim', 'P6', 'C2', 'W'].every((k) => r[k].split < 1e-9)),
    body: J.body.length === 15 && J.body.every((r) => Math.abs(r.c1OverC2S - 3) < 1e-5 && Math.abs(r.ballOverC2S - SF.ball1) < 1e-5 && Number.isFinite(r.C2.W1.precAsYr)),
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const order = L.orderRows(), ballCheck = L.ballCheckRows(); mark('order');
  const trial = L.trialRows(); mark('trial');
  const spinSrc = L.spinSrcRows(); mark('spinSrc');
  const body = L.bodyRowsC(); mark('body');
  for (const r of body) for (const k of ['C1', 'C2', 'C2ball', 'C3']) delete r[k].vec;
  const J = { pure, order, ballCheck, trial, spinSrc, outCount: spinSrc.filter((r) => !r.applicable).length, body, selfFactors: L.selfFactors(), timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w350b-sphereconv.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W350B_OUT ? (path.isAbsolute(process.env.W350B_OUT) ? process.env.W350B_OUT : path.join(ROOT, process.env.W350B_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第350便b sphereconv(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w350b-sphereconv.mjs', target: TARGET,
    ruling: '原仮定者の整理(2026-11-23 —— 第146報)・統括の検証項目 R419',
    decl: L.DECL, lit: L.LIT, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第350便b', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'sphereconv', engine: 'Node(html を読まない —— 純関数の lib・第348便h・第347便h・第348便c・第347便e の lib を呼ぶ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
