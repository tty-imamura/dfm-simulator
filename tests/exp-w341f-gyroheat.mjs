// 第341便f(原仮定者の補足(2026-11-18 —— 第141報)の熱の文・統括の検証項目 R369):
//   **熱の帳簿(座標変換の分は熱 0・軸を傾ける力 → ジャイロ → 動かなかった分が熱)の探索の器**(段 gyroheat-341f —— 正本 tests/out/gyroheat-341f.json・lib tests/lib-w341f-gyroheat.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・前の便の lib の本文は変えない。physics の鍵を足さない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w341f-gyroheat.mjs —— 領域の宣言なし)。入力のファイルは無い(第337便c の分類の帯・第338便f の天体の値・
//   第330便a の文献の値は lib を呼んで作り直す)。1 プロセス。正本は第338便c の settleRun で書く(丸めの残りは 0 —— 尺度と床は meta.recheck)。
//
// ■ 探索の方針(第138報): 式の形は走行の前に決め打ちしない —— 正本の先頭(decl・lit・plan)は、走らせたノブの格子と判定の物差しの記録。
// ■ 判定の物差し: 零試験 5(駆動 0・ジャイロだけ・座標変換・一定のトルクで静かな変形・周期の駆動 + 散逸 —— 刻みを半分にして同じ・収支の残りは尺度つき)/
//   T2 は続く熱(定常の式と同じ)と止まる熱(緩和の後の熱の率 ÷ 最大)/T3 は (i) イオの熱 ≤ 観測(全球の物差し —— イオだけを判定に使う)
//   (ii) 金星と木星の熱 ≥ 物差しの 0.1 倍(「高い内部熱」の読み —— 木星は観測の内部の熱の放射・金星は上限の目安)(iii) 第337便c の分類の帯 —— 3 つが同じノブで重なるか。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w341f-gyroheat.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w341f-gyroheat-1';
export const OUT_MAIN = 'tests/out/gyroheat-341f.json';
export const TARGET = 'tests/lib-w341f-gyroheat.mjs';
/** 版の履歴(結果を見て変えた所 —— 理由つき) */
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '帳簿の動作の確かめと、要るノブの範囲の表(天体の熱の予測ではない)', '軸引きずりの部位差分を傾ける力に数えるか(列 A)数えないか(列 B)は伺っている —— 2 列を並べた',
  '型 (β) は統括の参考の試作(収支を満たす応答の候補の 1 つ)', '天体の特性の係数は 1 に置いた(枝 b の係数は次の便で当てる)',
  '従来の型の数は従来の型の結果(新しい帳簿の値として引き継がない)', '金星の大気の熱潮汐は扱わない(原仮定者の回答 3)',
  '文献の値は本環境では一次資料に当たっていない(未照合)', 'エンケラドゥス・月・地球・木星・土星の比は物差しの領域が違う —— 観測を超える判定はイオだけ']);
/** 器の宣言(表に出す点) */
export const PLAN = Object.freeze({ t2Rows: 'ω 7 × τ 3 × c_g 2 + 回っているがトルクが一緒に回る行 6', t3Types: Object.freeze(['alpha', 'betaRel', 'betaAbs', 'gamma']), cols: Object.freeze(['A', 'B']) });
const fin = (x) => typeof x === 'number' && Number.isFinite(x);

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const D = L.DECL, T2 = J.t2, T3 = J.t3;
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 8,
    t2: T2.length === D.t2.cg.length * D.t2.tau.length * (D.t2.omega.length + 1)
      && T2.filter((r) => r.start === 'steady').every((r) => r.persists === true && r.steadyRel < 1e-6 && r.residRel < 1e-6)
      && T2.filter((r) => r.start === 'rest').every((r) => r.persists === false && r.endOverPeak < 1e-6 && Math.abs(r.Q - r.Qwant) < 1e-6),
    ledger: T3.ledger.length === 10 && T3.ledger.every((r) => r.galShareNew < 1e-9) && T3.ledger.every((r) => r.uHold > 0 && r.uGammaDiff > 0),
    band: T3.band.separable === true && T3.band.lo < T3.band.hi,
    io: T3.alpha.ioOk === true && T3.alpha.ioTideOverObs > 0.9 && T3.alpha.ioTideOverObs < 1,
    alpha: T3.alpha.hotOk === true && T3.alpha.overlapMu === false && T3.alpha.overlapFixed === false,
    beta: T3.betaRel.length === 18 && T3.betaRel.every((b) => b.overlapFixed === false) && T3.betaAbs.length === D.t3.tauAbs.length && T3.betaAbs.every((b) => b.overlapFixed === false),
    gamma: T3.gamma.length === 2 && T3.gamma.every((g) => g.overlapFixed === false && g.ioAtBandLo > 1),
    colB: T3.hotB.every((h) => h.high === false),
    kTilt: T3.kTilt.open === true && T3.kTilt.kLo < T3.kTilt.kHi,
    t4: T3.t4.every((t) => t.netMaxOverSep >= 1 - 1e-12 && t.netMinOverSep <= 1 + 1e-12),
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const t2 = L.t2Table(); mark('t2');
  const t3 = L.t3Tables(); mark('t3');
  const J = { pure, t2, t3, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w341f-gyroheat.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W341F_OUT ? (path.isAbsolute(process.env.W341F_OUT) ? process.env.W341F_OUT : path.join(ROOT, process.env.W341F_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第341便f gyroheat(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w341f-gyroheat.mjs', target: TARGET,
    ruling: '原仮定者の補足(2026-11-18 —— 第141報)「引きずり自体は、座標変換なので熱を発生しない。…動かなかった分が熱になる」・台帳の AN803(列 A を主・列 B を比べる列)・AN810・統括の検証項目 R369',
    decl: L.DECL, lit: L.LIT, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第341便f', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'gyroheat', engine: 'Node(html を読まない —— 純関数の lib の表・RK4 の積分・窓の比)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
