// 第348便d(原仮定者の指示(2026-11-22 —— 第145報の補足 1)・原仮定者の回答(2026-11-23 —— 第145報の回答 10)・統括の検証項目 R412):
//   **軸引きずりの回転の候補(〔第347便h〕の (P2)・(P6)・(W)・(G)・(V))を、円盤引きずりの既存の器の入口(第340便d の gyroRow の場の口)に入れて、
//   環の粒子の赤道面へ寄せる向き・向きが変わる高さ・経路の比(扁平 ÷ 球)・土星の環の物差し・自転しない源の通過での輪の傾きと厚みの候補を、
//   候補 × 引きずり減衰 q(0・2・3)× D₀(0・0.1)で今の式(2 倍角の則の型 h₁・h₀)の列と並べる器**
//   (段 diskaxis-348d —— 正本 tests/out/diskaxis-348d.json・lib tests/lib-w348d-diskaxis.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・前の便の lib の本文は変えない。physics の鍵を足さない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w348d-diskaxis.mjs —— 領域の宣言なし)。入力のファイルは無い(前の便の lib を呼んで作り直す)。
//   1 プロセス。正本は第338便c の settleRun で書く。
//
// ■ 探索の方針(第138報): 式の形は走行の前に決め打ちしない —— 正本の先頭(decl・lit・plan)は、走らせたノブの格子と判定の物差しの記録。
// ■ 判定の物差し(零試験 9): 今の式の列が第340便d の summaryRow と同じ数(変異: h₁ と h₀ の入れ替えで離れる)/候補の回転 0 で円盤の側の変化 0(変異: 一様の ẑ で 0 でない)/
//   q 0・D₀ 0 の組の極限(剛体の回転 —— 一様の Ω で corS・drag90 は 0)/経路の比の剛体の極限 1/(G) = (W)/(W) の符号の変異で corV の符号が反転/
//   通過の D₀ = 0 で輪の相対の量 0/小さな輪の傾き = 一次の項 ∫(Jᵀ L̂)_面 dt(変異: J で作ると離れる)/入力の拒否。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w348d-diskaxis.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w348d-diskaxis-1';
export const OUT_MAIN = 'tests/out/diskaxis-348d.json';
export const TARGET = 'tests/lib-w348d-diskaxis.mjs';
/** 版の履歴(結果を見て変えた所 —— 理由つき) */
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '軸引きずりの回転の候補を円盤引きずりの器に入れたときの見え方の表(円盤引きずりの式・軸引きずりの型の答えではない)', '候補 5 つ(P2・P6・W・G・V)はどれも候補 —— 主は決めていない',
  '今の式の列(h₁・h₀)は第340便d の場の型(A 1・場のべき 2 の宣言)—— 大きさの桁は比べない', '向きが変わる高さは格子の括りか二分の値で、環の厚みの答えではない',
  '土星の環の厚み 10 m・帯の幅・一様の物差し・区分の縁はリポジトリの中の数(文献の値・未照合)—— 固定の比べる列(合わせない)',
  '通過の輪の傾きと残りは、輪を動かさずに枠の運ぶ量を積んだ一次の読み(輪の力学は入れていない)', 'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない(AN712)']);
/** 器の宣言(表に出す点) */
export const PLAN = Object.freeze({ pure: '零試験 9', A: '列 7(今の式 2 + 候補 5)× q 3 × D₀ 2 × 距離 2 × 作用 3 × 高さ ±6((V) は距離 10・高さ ±4)',
  B: '扁平率 2 × 距離 3 × 高さ 2 × q 3 × D₀ 2(軸の傾きの比 —— (P2)・(P6)・(W)・(G)・(V) 1 行/寄せる力の比 —— (P2)・(W)・扁平率 0.098)',
  C: '区分の中心 5 × 列 7 × q 3 × D₀ 2(点の受け手・corV・高さ 16 点 + 二分)+ 輪の受け手(corS・drag90・(P2)・(P6)・(W))', D: 'D₀ 3 × 輪の半径 2 × 輪の傾き 3(候補 5 の ∫Ω dt と並べる)' });

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const D = L.DECL, nq = D.q.length * D.D0.length, A = D.A, B = D.B, C = D.C, Dd = D.D;
  const nA = D.cur.length * A.d.length * A.actions.length + (D.cands.length - 1) * nq * A.d.length * A.actions.length + nq * A.vD.length * A.actions.length;
  const nB = (D.cur.length + B.tiltCands.length * nq) * B.f.length * B.rOverReq.length * B.z.length + 1;
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 9,
    A: J.A.length === nA && J.A.every((r) => ['toward', 'away', 'mixed', 'none'].includes(r.dir)),
    B: J.B.length === nB && J.B.filter((r) => r.path).every((r) => D.B.actions.every((a) => r.path[a])),
    C: J.C.rows.length === (D.cur.length + D.cands.length * nq) * C.centers.length && J.C.ring.length === (D.cur.length + C.ringCands.length * nq) * C.centers.length * C.ringActions.length,
    D: J.D.length === Dd.D0.length * Dd.Rr.length * Dd.inc.length && J.D.filter((r) => r.D0 === 0).every((r) => r.tilt === 0 && r.rest === 0 && r.mean === 0),
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const A = L.tableA(); mark('A');
  const B = L.tableB(); mark('B');
  const C = L.tableC(); mark('C');
  const D = L.tableD(); mark('D');
  const J = { pure, A, B, C, D, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w348d-diskaxis.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W348D_OUT ? (path.isAbsolute(process.env.W348D_OUT) ? process.env.W348D_OUT : path.join(ROOT, process.env.W348D_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第348便d diskaxis(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w348d-diskaxis.mjs', target: TARGET,
    ruling: '原仮定者の指示(2026-11-22 —— 第145報の補足 1)・原仮定者の回答(2026-11-23 —— 第145報の回答 10)・統括の検証項目 R412',
    decl: L.DECL, lit: L.LIT, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第348便d', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'diskaxis', engine: 'Node(html を読まない —— 純関数の lib の場と候補・第340便d の部位の力・求積)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
