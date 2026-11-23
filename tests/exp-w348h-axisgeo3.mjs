// 第348便h(原仮定者の指示(2026-11-23 —— 第145報の補足 2)・統括の検証項目 R416):
//   **軸引きずりの候補の回転を geoPN=3(慣性決定力の引きずり)の場で数え直す器 —— 場の形の無次元の例・天体 15 組の由来ごとの回転と〔第348便c〕の重みの型の合成・δ・歳差の率・
//   〔第348便c〕の q 0・2・3 の列との並び・係数 c_R の入り方・背景 W₀ の効き・エネルギーの行き先「慣性回転」と「引きずり回転」の 2 列(〔第348便b〕の步の形の上)**
//   (段 axisgeo3-348h —— 正本 tests/out/axisgeo3-348h.json・lib tests/lib-w348h-axisgeo3.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・前の便の lib の本文は変えない。physics の鍵を足さない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w348h-axisgeo3.mjs —— 領域の宣言なし)。入力のファイルは無い(前の便の lib を呼んで作り直す)。
//   1 プロセス。正本は第338便c の settleRun で書く。
//
// ■ 探索の方針(第138報): 式の形は走行の前に決め打ちしない —— 正本の先頭(decl・lit・plan)は、走らせたノブの格子と判定の物差しの記録。
// ■ 判定の物差し(零試験 10): 静止の源で 0/源 1 つ・背景 0・自分の重み 0 で一様/自分の重み 0・W₀ = D₀・点の冪で〔第347便h〕の場に一致/ガリレイの変換で不変(〔第347便h〕の場と
//   変異は変わる)/自転しない源の (W) の閉じた形/(P2) の極限と有限の腕/核の式/行き先を慣性回転だけにすると〔第348便b〕の行に一致/変異 2 つで落ちる/入力の拒否。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w348h-axisgeo3.mjs';
import * as C from './lib-w348c-axisbalance.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w348h-axisgeo3-1';
export const OUT_MAIN = 'tests/out/axisgeo3-348h.json';
export const TARGET = 'tests/lib-w348h-axisgeo3.mjs';
/** 版の履歴(結果を見て変えた所 —— 理由つき) */
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  'geoPN=3 の場の形・候補 (W)・(P2)・場の組 4 つごとの見え方の表(geoPN=3 の場の軸引きずりや歳差の答えではない)', '場の組・源の回転の形・自分の重みの入り方・背景 W₀ はどれも候補 —— 主は決めていない',
  '銀河由来の項は、銀河を円の道の中心の質量 1 つに置く宣言(第337便c の 2 値から)の下の数', 'エネルギーの行き先の 2 列(慣性回転・引きずり回転)は並べて比べる表 —— 行き先は決めていない',
  '観測の歳差の角速度は第330便a の lib の値(文献の値・未照合)の固定の比べる列(合わせない)', 'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない(AN712)']);
/** 器の宣言(表に出す点) */
export const PLAN = Object.freeze({ pure: '零試験 10', dim: '自分の重み 3 × 背景 2 × 源の回転の形 4 × 距離 3 × 緯度 2', body: '15 組 × 場の組 4 × 候補 2(重みの型 W1・W2・W3 比 1・W1 + 母天体)',
  vsQ: '15 組 × 場の組 2 × 候補 2 と〔第348便c〕の q 0・2・3(D₀ 0)', cR: '4 天体 × 候補 2 × c_R 3 と規則の半径', w0: '3 組 × 候補 2 × W₀ 2', dest: '例 3 × 型と行き先 4 × 行き先 2', bodyE: '4 組(geoPN=3 の主の場の組の (W))× 型と行き先 4 × 行き先 2' });

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const D = L.DECL;
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 10,
    dim: J.dim.length === D.dim.selfA.length * D.dim.w0.length * (D.dim.q.length + 1) * D.dim.d.length * 2,
    body: J.body.length === 15 * D.combos.length * D.cands.length && J.body.every((r) => Number.isFinite(r.W1.deltaDeg) && Number.isFinite(r.W1.magYr) && r.W1.magYr > 0),
    vsQ: J.vsQ.length === 15 * 2 * D.cands.length,
    cR: J.cR.length === D.cRbodies.length * D.cands.length,
    w0: J.w0.length === 3 * D.cands.length && J.w0.every((r) => r.ratio > 0 && r.ratio <= 1),
    dest: J.dest.length === 3 * D.kinds.length * 2 && J.dest.every((r) => Math.abs(r.ledgerResid) < 1e-9),
    bodyE: J.bodyE.length === 4,
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const dim = L.dimRows(); mark('dim');
  const body = L.bodyRows3(); mark('body');
  const CB = C.balanceRows(C.makeBase()), vsQ = L.vsQRows(body, CB); mark('vsQ');
  const cR = L.cRRows3(), w0 = L.w0Rows(); mark('cR');
  const th3 = body.find((r) => r.combo === L.DECL.mainCombo && r.id === 'Earth' && r.src === 'Sun' && r.cand === 'W').W1.deltaDeg;
  const dest = L.destRows(th3), bodyE = L.bodyEnergy(L.geo3BodyInput(body)); mark('dest');
  for (const r of body) delete r.vec;
  const J = { pure, dim, body, vsQ, cR, w0, dest, bodyE, theta3Deg: th3, yk: L.YK, galMass: L.galMass(), timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w348h-axisgeo3.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W348H_OUT ? (path.isAbsolute(process.env.W348H_OUT) ? process.env.W348H_OUT : path.join(ROOT, process.env.W348H_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第348便h axisgeo3(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w348h-axisgeo3.mjs', target: TARGET,
    ruling: '原仮定者の指示(2026-11-23 —— 第145報の補足 2)・統括の検証項目 R416',
    decl: L.DECL, lit: L.LIT, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第348便h', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'axisgeo3', engine: 'Node(html を読まない —— 純関数の lib・第347便h・第348便b・第348便c の lib を呼ぶ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
