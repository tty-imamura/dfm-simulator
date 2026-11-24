// 第351便b(原仮定者の回答(2026-11-24 —— 第147報)AN1000・統括の検証項目 R428):
//   **球体換算の主の列を (C2)(球全体の剛体回転への平均)に替えた表と、換算の係数 k のノブ(掛け先・構造の係数 c_R との縮退)の器 —— 主の列の切り替え(天体 15 組)・
//   k の掛け先(局所の項だけ)・k と c_R の区別(3 組 × 格子)・(C2) の定義の門・球の中の自分の重みの置き方 3 列**(段 c2main-351b —— 正本 tests/out/c2main-351b.json・lib tests/lib-w351b-c2main.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・前の便の lib の本文は変えない。physics の鍵を足さない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w351b-c2main.mjs —— 領域の宣言なし)。入力のファイルは無い(前の便の lib を呼んで作り直す)。
//   1 プロセス。正本は第338便c の settleRun で書く。
//
// ■ 探索の方針(第138報): 式の形は走行の前に決め打ちしない —— 正本の先頭(decl・lit・plan)は、走らせたノブの格子と判定の物差しの記録。k の値は観測から選ばない。
// ■ 判定の物差し(零試験 10): 第350便b の門 8/純粋なずれで (C2) 0・(C1) ≠ 0/剛体回転で (C2) = Ω₀/共通の点検の数/球の求積と一次の展開の差の次数 ≥ 2/
//   k の掛け先(局所だけ 2 倍・背景は不変・k 0 で背景だけ・k 0 と背景 0 で向きが決まらない)/一様な剛体の場の二度数え/変異 2 つ/書き直した口の照合/入力の拒否。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as B from './lib-w350b-sphereconv.mjs';
import * as E from './lib-w347e-spintorque.mjs';
import * as G3 from './lib-w348h-axisgeo3.mjs';
import * as C from './lib-w348c-axisbalance.mjs';
import * as L from './lib-w351b-c2main.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w351b-c2main-1';
export const OUT_MAIN = 'tests/out/c2main-351b.json';
export const TARGET = 'tests/lib-w351b-c2main.mjs';
/** 版の履歴(結果を見て変えた所 —— 理由つき) */
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '主の列を (C2) に替えた表(お答えで主の列になった —— (C2) が正しい読みだとは言わない・(C1)・(W)・(C3) は比べる列として残る)',
  '換算の係数 k は局所の項(太陽・母天体由来)だけに掛けた列 —— k の値は選んでいない(既定 1・格子 0.5・1・2 と 2/5)',
  'k と構造の係数 c_R は片方を固定して振った列だけ(同時に当てはめていない)', '場は geoPN=3 の在位の形(〔第348便h〕の makeField3 の既定の引数)だけ —— 天体の (C2) は場の一次の展開の下の数(腕 ≪ 距離)',
  '観測の歳差の角速度は第330便a の lib の値(文献の値・未照合)の固定の比べる列(合わせない)', 'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない(AN712)']);
/** 器の宣言(表に出す点) */
export const PLAN = Object.freeze({ pure: '零試験 10', switch: '15 組 × 読み 4((C2) 主・(W)・(C1)・(C3) k 2/5)', k: '3 組 × 背景の倍率 2 × k 5(0・2/5・0.5・1・2)',
  degen: '3 組 × q 8 × 列 3(k・(ii) c_R・(i) 腕だけ)× 合成 3(背景なし・(B2)・(B1))', self: '15 組 × 置き方 3(中心・腕の点・球の平均)' });

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const D = L.DECL, A = D.earthAnchor, e = J.switch.find((r) => r.id === 'Earth' && r.src === 'Sun'), eb = J.k.find((r) => r.id === 'Earth' && r.mult === 1 && r.k === 0);
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 10,
    switch: J.switch.length === 15 && J.switch.every((r) => Math.abs(r.c2OverW - J.selfFactors.ball1) < 1e-5 && Number.isFinite(r.prec.C2) && r.prec.C2 < r.prec.C1)
      && !!e && ['C1', 'W', 'C2', 'C3'].every((k) => Math.abs(e.prec[k] - A[k]) <= A.tol),
    k: J.k.length === D.bodies3.length * D.bgMult.length * (1 + D.kGrid.length) && J.k.filter((r) => r.undetermined).length === D.bodies3.length
      && J.k.filter((r) => r.undetermined).every((r) => r.mult === 0 && r.k === 0) && !!eb && Math.abs(eb.raiseAsYr - D.earthBgRaise.v) <= D.earthBgRaise.tol,
    degen: J.degen.length === D.bodies3.length * D.qGrid.length && J.degen.filter((r) => r.q === 1).every((r) => Math.abs(r.iiOverK - 1) < 1e-9 && Math.abs(r.iOverK - 1) < 1e-9) && J.overlap.length === D.bodies3.length,
    ballSame: J.ballSame < 1e-15,
    self: J.self.length === 15 && J.self.every((r) => Math.abs(r.armOverCenter - 1.5) < 1e-5 && Math.abs(r.ballOverCenter - J.selfFactors.ball1) < 1e-5),
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const T1 = E.t1Table(), GEO = E.geometry(), BR = B.bodyRowsC(T1, GEO); mark('body');
  const sw = L.switchRows(BR); mark('switch');
  const k = L.kRows(BR, T1, GEO); mark('k');
  const degen = L.degenRows(T1, GEO), overlap = L.overlapOf(degen); mark('degen');
  const self = L.selfRows(BR, T1, GEO); mark('self');
  // 書き直した (C2) の天体の口と第350便b の bodyRowsC の C2ball の照合(地球・火星・金星 —— 同じ入力)
  const ballSame = Math.max(...L.DECL.bodies3.map(([id, src]) => { const c = L.c2BallPair(T1, GEO, id, src, { Rd: G3.YK * C.massOf(id) }), r = BR.find((x) => x.id === id && x.src === src);
    return Math.max(...[0, 1, 2].map((i) => Math.abs(c.S[i] - r.C2ball.vec.S[i]))) / Math.hypot(...r.C2ball.vec.S); }));
  const J = { pure, switch: sw, k, degen, overlap, self, ballSame, selfFactors: B.selfFactors(), timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w351b-c2main.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W351B_OUT ? (path.isAbsolute(process.env.W351B_OUT) ? process.env.W351B_OUT : path.join(ROOT, process.env.W351B_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第351便b c2main(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w351b-c2main.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-24 —— 第147報)AN1000・統括の検証項目 R428',
    decl: L.DECL, lit: L.LIT, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第351便b', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'c2main', engine: 'Node(html を読まない —— 純関数の lib・第350便b・第348便h・第348便c・第350便e・第347便e の lib を呼ぶ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
