// 第350便c(原仮定者の整理(2026-11-23 —— 第146報)・統括の検証項目 R420):
//   **軸引きずりの案の步の形と向きを数える器 —— 1 ステップの式(3D の姿勢・平行 = 引きずり回転・直交 = ジャイロトルク)と自転速度の読み (S1)・(S1e)・(S2)・(S2′)・
//   向きの読み〔第347便h〕の (g1)・(g2+)・(g2−)・(g3) と原文の 3 句・閉じた形と刻みの依り方・仕事率・天体 4 組の歳差の周期と向き**
//   (段 gyrostep-350c —— 正本 tests/out/gyrostep-350c.json・lib tests/lib-w350c-gyrostep.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・前の便の lib の本文は変えない。physics の鍵を足さない。エネルギーの行き先は本便の枝 d(本器は持たない)。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w350c-gyrostep.mjs —— 領域の宣言なし)。入力のファイルは無い(前の便の lib を呼んで作り直す)。
//   1 プロセス。正本は第338便c の settleRun で書く。
//
// ■ 探索の方針(第138報): 式の形は走行の前に決め打ちしない —— 正本の先頭(decl・lit・plan)は、走らせたノブの格子と判定の物差しの記録。
// ■ 判定の物差し(零試験 12): 共通の点検の数(統括の数え直し)/その対称(反転・中心線・相対静止・自分の重みと背景 0・速度の足し算)/剛体回転と純粋なずれ/torqueMag(I 1・ω_T 1・abs(Ω⊥) 1 で 1)/
//   (g1) は厳密な回転/刻みの依り方の次数((g2+) の rot 1・mid 2)/仕事率 τ·(ω ŝ) と τ·Θ が丸めの床/〔第348便b〕のスカラーの器と同じ数/ŝ の長さ/(S1) と (S1e) が違う所/変異 3 つで落ちる/入力の拒否。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w350c-gyrostep.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w350c-gyrostep-1';
export const OUT_MAIN = 'tests/out/gyrostep-350c.json';
export const TARGET = 'tests/lib-w350c-gyrostep.mjs';
/** 版の履歴(結果を見て変えた所 —— 理由つき) */
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '1 ステップの式・自転速度の読み 4 つ・向きの読み 5 行は候補の表(ジャイロトルクの向きや歳差の答えではない)', '(S1)・(S1e)・(S2)・(S2′) と (g1)〜(g3) のどれを採るかは決めていない',
  'エネルギーの行き先(内部熱・自転の増し分)は本便の枝 d —— 本器の慣性回転は (S2′) の列のほかは一定', '天体 4 組の Ω は第348便h の在位の形の場(主の組 K1rM)の値 —— 観測の歳差は第330便a の lib の値(文献の値・未照合)の固定の比べる列(合わせない)',
  'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない(AN712)']);
/** 器の宣言(表に出す点) */
export const PLAN = Object.freeze({ pure: '零試験 12', step: '例 2 × 向きの読み 2((g2+)・(g3) k_d 1 —— cone は (g2+) だけ)× ω_I(0) 2 × 自転速度の読み 4', dir: '向きの読み 5 × 変え方 5(基準・自転の反転・Ω の反転・合成の自転 0・ŝ ∥ Ω)',
  conv: '向きの読み 5 × 積分 2 × 刻み 4', work: '向きの読み 5 × 自転速度の読み 2', body: '4 組 × 候補 2 × 合成((W1)・母天体の在る 2 組は (W1) + 母天体も)', common: '共通の点検の数 1 組' });

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const D = L.DECL;
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 12,
    step: J.step.length === (2 + 1) * D.wI0.length * D.wReads.length && J.step.every((r) => r.lenErr === 0),
    dir: J.dir.length === D.reads.length && J.dir.every((r) => r.parallel.moved === 0 && r.parallel.torque0 === 0 && r.zeroSpin.torque0 === 0 && r.spinRev.sMovedSame === true),
    conv: J.conv.length === D.reads.length * D.integ.length && J.conv.every((r) => r.errs.length === D.dtFrac.length),
    work: J.work.length === D.reads.length * 2 && J.work.every((r) => r.tauDotSpin === 0 && r.tauDotTheta === 0),
    body: J.body.length === D.cands.length * (2 * 1 + 2 * 2) && J.body.every((r) => Number.isFinite(r.magYr) && r.magYr > 0),
    torqueOne: J.torqueOne === 1,
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const step = L.stepRows(); mark('step');
  const dir = L.dirRows(); mark('dir');
  const conv = L.convRows(); mark('conv');
  const work = L.workRows(); mark('work');
  const body = L.bodyRows(); mark('body');
  const common = L.commonCheck();
  const J = { pure, step, dir, conv, work, body, common, torqueOne: L.torqueMag({ I: 1, wT: 1, omPerp: 1 }), timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w350c-gyrostep.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W350C_OUT ? (path.isAbsolute(process.env.W350C_OUT) ? process.env.W350C_OUT : path.join(ROOT, process.env.W350C_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第350便c gyrostep(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w350c-gyrostep.mjs', target: TARGET,
    ruling: '原仮定者の整理(2026-11-23 —— 第146報)・統括の検証項目 R420',
    decl: L.DECL, lit: { note: '文献の値・未照合(この環境から一次資料に当たっていない)', precArcsecPerYr: { earth: L.LIT_PREC.earth, venus: L.LIT_PREC.venus } }, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第350便c', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'gyrostep', engine: 'Node(html を読まない —— 純関数の lib・第348便h・第347便h・第348便b・第348便c・第347便e の lib を呼ぶ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
