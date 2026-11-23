// 第348便i(原仮定者の指示(2026-11-23 —— 第145報の補足 2)・原仮定者の指示(2026-11-22 —— 第145報の補足 1)・統括の検証項目 R417):
//   **円盤引きずりの側の量(輪の寄せる向き・90° の成分・経路の比・土星の環の物差し・通過の輪の傾き)を、geoPN=3(慣性決定力の引きずり)の形の場で数え直し、
//   〔第348便d〕の場(geoPN=2 の形 —— q 0・2・3 × D₀ 0・0.1)の列と並べる器**
//   (段 diskgeo3-348i —— 正本 tests/out/diskgeo3-348i.json・lib tests/lib-w348i-diskgeo3.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・前の便の lib の本文は変えない。physics の鍵を足さない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w348i-diskgeo3.mjs —— 領域の宣言なし)。入力のファイルは無い(前の便の lib を呼んで作り直す)。
//   1 プロセス。正本は第338便c の settleRun で書く。
//
// ■ 探索の方針(第138報): 式の形は走行の前に決め打ちしない —— 正本の先頭(decl・lit・plan)は、走らせたノブの格子と判定の物差しの記録。
// ■ 判定の物差し(零試験 10 —— ⑥′ (Rk1) の点の式は第348便i の続きで足した): 源の回転 0 かつ W₀ = W_ii = 0 で 0(対照: W₀ > 0 で受け手の速度を引くと 0 でない)/(Rcv)・W₀ = W_ii = 0 の剛体の極限/
//   W₀ と W_ii は和だけが効く(変異: W_ii を分母から落とすと離れる)/〔第348便d〕の場の q 0 への極限/通過の極限と W₀ = W_ii = 0 の 0・自分の重みだけで 0 でない/
//   (Rm2) の点の式と遠方/変異 2 つ(受け手の速度の符号・(W) の符号)/差分の勾配と解析の勾配/入力の拒否。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w348i-diskgeo3.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w348i-diskgeo3-1';
export const OUT_MAIN = 'tests/out/diskgeo3-348i.json';
export const TARGET = 'tests/lib-w348i-diskgeo3.mjs';
/** 版の履歴(結果を見て変えた所 —— 理由つき) */
export const AMEND = Object.freeze([
  '統括の追加の依頼(第348便i の続き): 源の回転の分の読みに (Rk1)(在位の本が宣言している invSq の kernel:"k1"・rdRule:"kappaM" の形 —— 重み K1・源の回転の分 M1 = R²/(5d²)・自分の重みの K1 の球・W₀ 0 が主)を足した(A・C・D の列と零試験 ⑥′ —— 結果を見て変えたのではなく、列を足しただけ。(Rcv)・(Rm2) の行の値は不変)',
]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  'geoPN=3 の形の場(アプリの慣性決定力の引きずりの行の点の式 —— 受け手 1 つ・源の側の連立は解かない)で円盤引きずりの側の量を数えた表(円盤引きずりの式・型の答えではない)',
  '源の回転の分の読み 2 つ((Rcv) 座標変換の型・(Rm2) アプリの invSq の型)はどれも候補 —— 主は決めていない', '候補の回転 (P2)・(W) はどれも候補 —— 主は決めていない',
  '向きが変わる高さは格子の括りか二分の値で、環の厚みの答えではない',
  '土星の環の厚み 10 m・帯の幅・一様の物差し・区分の縁はリポジトリの中の数(文献の値・未照合)—— 固定の比べる列(合わせない・新しい数を足さない)',
  '通過の輪の傾きは、輪を動かさずに枠の運ぶ量を積んだ一次の読み(輪の力学は入れていない)', 'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない(AN712)']);
/** 器の宣言(表に出す点) */
export const PLAN = Object.freeze({ pure: '零試験 10', A: '源の回転の分 3((Rk1) は (W₀, W_ii) 4 の別の格子)× (W₀, W_ii) 4 × 受け手の速度 2 × 候補 2 × 距離 2 × 作用 3 × 高さ ±6 + 比べる列(〔第348便d〕の場の (P2)・(W) × q 3 × D₀ 2)',
  B: '(Rcv) × (W₀, W_ii) 3 × 候補 2 × 扁平率 2 × 距離 3 × 高さ 2(軸の傾きの比・寄せる力の比は扁平率 0.098)',
  C: '源の回転の分 3 × (W₀, W_ii) 4 × 受け手の速度 2 × 候補 2 × 区分の中心 5(点・corV —— 高さ 16 点 + 二分)+ 輪の受け手(corS・drag90)',
  D: '((Rcv) の (W₀, W_ii) 6 + (Rk1) の 4)× 輪の半径 2 × 輪の傾き 3 + 比べる列(〔第348便d〕の通過 D₀ 4 × 輪の半径 2 × 輪の傾き 3)' });

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const D = L.DECL, nCfg = D.rots.reduce((t, r) => t + L.denOf(r).length, 0) * D.vRec.length * D.cands.length;
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 10,
    A: J.A.rows.length === nCfg * D.A.d.length * D.A.actions.length && J.A.ref348d.length === D.cands.length * 6 * D.A.d.length * D.A.actions.length
      && J.A.rows.every((r) => ['toward', 'away', 'mixed', 'none'].includes(r.dir)),
    B: J.B.length === D.B.den.length * D.cands.length * D.B.f.length * D.B.rOverReq.length * D.B.z.length && J.B.filter((r) => r.path).every((r) => ['corV', 'corS', 'drag90'].every((a) => r.path[a])),
    C: J.C.rows.length === nCfg * D.C.centers.length && J.C.ring.length === nCfg * D.C.centers.length * D.C.ringActions.length,
    D: J.D.rows.length === (D.D.den.length + D.k1.denD.length) * D.D.Rr.length * D.D.inc.length && J.D.rows.filter((r) => r.Wbg + r.Wself === 0).every((r) => r.tilt === 0 && r.rest === 0 && r.mean === 0)
      && J.D.rows.filter((r) => r.Wbg + r.Wself > 0 && r.inc > 0).every((r) => r.tilt > 0),
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
  const seen = new Set(), stack = ['tests/exp-w348i-diskgeo3.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W348I_OUT ? (path.isAbsolute(process.env.W348I_OUT) ? process.env.W348I_OUT : path.join(ROOT, process.env.W348I_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第348便i diskgeo3(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w348i-diskgeo3.mjs', target: TARGET,
    ruling: '原仮定者の指示(2026-11-23 —— 第145報の補足 2)・原仮定者の指示(2026-11-22 —— 第145報の補足 1)・統括の検証項目 R417',
    decl: L.DECL, lit: L.LIT, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第348便i', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'diskgeo3', engine: 'Node(html を読まない —— 純関数の lib の geoPN=3 の形の場と候補・第340便d の部位の力・第348便d の器)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
