// 第347便h(原仮定者の指示(2026-11-22 —— 第145報の補足 1)・統括の検証項目 R407):
//   **軸引きずりの回転の候補 5 つ(2 点の差分・3 軸 6 点の差分・中心の ½ ∇×u・勾配の分け方・球の中の重みつきの平均)と比べる列(2 倍角の則)を、自転する源・
//   自転しない源の通過・公転する受け手・天体の 15 組で並べ、自転 = 慣性回転 + 引きずり回転の帳簿・ジャイロトルクの向きの読みの列・エネルギーの行き先の 2 列を数える器**
//   (段 axisdiff-347h —— 正本 tests/out/axisdiff-347h.json・lib tests/lib-w347h-axisdiff.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・前の便の lib の本文は変えない。physics の鍵を足さない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w347h-axisdiff.mjs —— 領域の宣言なし)。入力のファイルは無い(前の便の lib を呼んで作り直す)。
//   1 プロセス。正本は第338便c の settleRun で書く。
//
// ■ 探索の方針(第138報): 式の形は走行の前に決め打ちしない —— 正本の先頭(decl・lit・plan)は、走らせたノブの格子と判定の物差しの記録。
// ■ 判定の物差し(零試験 12): 静止・無回転の源 → 0/一様な u → 0/剛体回転の場 → Ω₀(P2 は ê の成分を除いた Ω₀)/対称な 2 源 → 0/R_b → 0 で (P6)・(V) → (W)/
//   解析の勾配と数の差分/(P2) は軸の上で 0/½∇×(f ŝ × r) の閉じた形/変異 4 つで落ちる/ジャイロの読み(角を保つ・起こす・歳差の率)/エネルギーの帳簿/入力の拒否。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w347h-axisdiff.mjs';
import * as E from './lib-w347e-spintorque.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w347h-axisdiff-1';
export const OUT_MAIN = 'tests/out/axisdiff-347h.json';
export const TARGET = 'tests/lib-w347h-axisdiff.mjs';
/** 版の履歴(結果を見て変えた所 —— 理由つき) */
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '軸引きずりの回転の候補の動作の確かめと、候補ごとの見え方の表(軸引きずりの型の答えではない)', '候補 5 つ(P2・P6・W・G・V)はどれも候補 —— 主は決めていない',
  '慣性回転と引きずり回転の計上の型 2 つ(L1・L2)はどちらも候補', 'ジャイロトルクの向きの読み(g1・g2±・g3)は列 —— 採否は決めていない',
  'エネルギーの行き先の割合と最後の文の読み(R1・R2)はノブと候補', '天体の数は D₀ = 0・源 1 つ・q 2 つの例 —— 観測の値(自転の変化の率・地球の歳差の率・熱)は固定の比べる列(合わせない)',
  '極の向き・公転の要素・半径はリポジトリの中の値(文献の値・未照合)', 'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない(AN712)']);
/** 器の宣言(表に出す点) */
export const PLAN = Object.freeze({ pure: '零試験 12', spin: '重みのべき 2 × q 2 × D₀ 3 × 距離 3 × 緯度 4 × 候補 5', fly: '重みのべき 2 × D₀ 3 × 衝突径数 3 × 速さ 2 × 質量 2 × 候補 5',
  orb: 'q 2 × D₀ 2 × 傾き 3 × 質量の割合 2(1 公転の平均)', body: '受け手と源 15 × q 2(D₀ = 0・1 公転の平均)', ledger: '通過の例 1 × 時定数 3', gyro: '読み 5(句の表)+ 天体 15 × q 2',
  energy: '動いた割合 3 × 行き先 3 × 読み 2', heat: 'イオ・木星・金星 × q 2' });

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const D = L.DECL, W = ['up', 'down', 'unresolved'], S = D.spin, Fy = D.fly, O = D.orb;
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 12,
    spin: J.spin.length === S.p.length * S.q.length * S.D0.length * S.d.length * S.lat.length && J.spin.every((r) => D.cands.every((c) => W.includes(r[c].judge))) && J.spinSum.length === J.spin.length / S.lat.length,
    fly: J.fly.length === Fy.p.length * Fy.D0.length * Fy.b.length * Fy.v.length * Fy.m.length && J.fly.filter((r) => r.D0 === 0).every((r) => D.cands.every((c) => r[c].judge === 'unresolved')),
    orb: J.orb.length === O.q.length * O.D0.length * O.inc.length * O.mu.length && J.orb.every((r) => r.sumDiff <= 1e-12 * (r.both.mag + 1e-300) || r.sumDiff < 1e-15),
    body: J.body.length === E.DECL.pairs.length * D.bodyQ.length,
    ledger: J.ledger.rows.length === D.tauOverPass.length && J.ledger.rows.every((r) => Math.abs(r.intRel) < 1e-4),
    gyro: J.gyroPh.length === 5 && J.gyroBody.length === J.body.length,
    energy: J.energy.length === D.energy.f.length * D.energy.h.length * 2 && J.energy.every((r) => Math.abs(r.ledgerResid) < 1e-9),
    heat: J.heat.length === 6,
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const spin = L.spinRows(), spinSum = L.spinSummary(spin); mark('spin');
  const fly = L.flyRows(); mark('fly');
  const orb = L.orbRows(); mark('orb');
  const T1 = E.t1Table(), T2e = E.t2Scale(T1), body = L.bodyRows(T1); mark('body');
  const ledger = L.ledgerFly(); mark('ledger');
  const gyroPh = L.gyroPhrases(), gyroBody = L.gyroBodies(body, T2e); mark('gyro');
  const energy = L.energyRows(), heat = L.heatWindow(body), obs = E.observedRates(); mark('energy');
  const J = { pure, spin, spinSum, fly, orb, body, ledger, ledgerTerms: L.LEDGER, gyroPh, gyroBody, energy, heat, obs, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w347h-axisdiff.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W347H_OUT ? (path.isAbsolute(process.env.W347H_OUT) ? process.env.W347H_OUT : path.join(ROOT, process.env.W347H_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第347便h axisdiff(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w347h-axisdiff.mjs', target: TARGET,
    ruling: '原仮定者の指示(2026-11-22 —— 第145報の補足 1)・統括の検証項目 R407',
    decl: L.DECL, lit: L.LIT, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第347便h', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'axisdiff', engine: 'Node(html を読まない —— 純関数の lib の場と候補・求積・1 公転の平均・RK4)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
