// 第350便g(原仮定者の整理(2026-11-23 —— 第146報)・統括の検証項目 R424):
//   **円盤引きずりの側を geoPN=3 の在位の形の場で数える器 —— 通過の輪の傾きを 3 つの読みで(表 1)・🛟 saturnRotVertExplore3d の傾きの比と並べる(表 2 —— 読むだけ)・
//   受け手の速度で向きが入れ替わる行の切り分け(表 3)・輪の傾き/復元の成分/厚みを分ける(表 4)・厚みの帳簿へ候補の回転を入れる口(表 5)**
//   (段 diskcheck-350g —— 正本 tests/out/diskcheck-350g.json・lib tests/lib-w350g-diskcheck.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・前の便の lib の本文と正本と段は変えない。physics の鍵を足さない。🛟 の本と鍵 physics.rotDragVert は変えない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w350g-diskcheck.mjs —— 領域の宣言なし)。入力のファイルは 🛟 の正本 tests/out/rotvert-w339a.json(読むだけ)。
//   1 プロセス。正本は第338便c の settleRun で書く。
//
// ■ 探索の方針(第138報): 式の形は走行の前に決め打ちしない —— 正本の先頭(decl・lit・plan)は、走らせたノブの格子と判定の物差しの記録。
// ■ 判定の物差し(零試験 8): 共通の点検の数(統括の数え直し)/剛体回転と純粋なずれ/輪の傾きと球の剛体回転の区別/〔第348便i〕の (Rk1) の場との一致/
//   通過の輪の比と自分の重みも背景も無い場合の 0/寄せる力の受け手の速度の倍についての線形/粒子の輪の重力だけの L の保存と源の回転の符号/入力の拒否。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w350g-diskcheck.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w350g-diskcheck-1';
export const OUT_MAIN = 'tests/out/diskcheck-350g.json';
export const TARGET = 'tests/lib-w350g-diskcheck.mjs';
export const INPUT_ROTVERT = 'tests/out/rotvert-w339a.json';
/** 版の履歴(結果を見て変えた所 —— 理由つき) */
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  'geoPN=3 の在位の形の場(枝 h の makeField3 の既定の引数 —— 受け手 1 つ・源の側の連立は解かない)で円盤引きずりの側の量を数えた表(円盤引きずりの式・型の答えではない)',
  '回転の読み (C1)・(C2)・(C3) はどれも候補 —— 主は決めていない。輪の直径の傾きが (C1) と同じでも、球全体の自転が (C1) だという確かめにはならない',
  '🛟 saturnRotVertExplore3d の傾きの比の達は、軸引きずり・ジャイロトルクの型を採ることを意味しない(🛟 の型は円盤引きずりの鉛直の型 —— 強さと帯の半幅は見えるように大きくした値)',
  '向きが変わる高さは格子の括りか二分の値で、環の厚みの答えではない。帳簿に入れた高さは口の試し(合わせていない)',
  '粒子の輪は、輪の傾き・上下で符号が反転する復元の成分・厚みを分けて読む器(輪が傾く・傾きが減る・厚みを保つは別の結果)',
  '土星の環の厚み 10 m ほかはリポジトリの中の数(文献の値・未照合)—— 固定の比べる列(合わせない)', 'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない(AN712)']);
/** 器の宣言(表に出す点) */
export const PLAN = Object.freeze({ pure: '零試験 8', T1: '輪の半径 2 × 輪の傾き 3 ×(在位の形 1 + 〔第348便i〕の (Rk1) の W_ii 定数 3)× 読み (C1)(C2)(C2six)(C3)',
  T2: '🛟 の正本の要点(600・3000 步の傾きの比)+ 区分の中心 5 × 読み (C1)(C2) の回転の大きさと z の偶奇(在位の形 —— 規則の半径の自分の重み)',
  T3: '((Rk1) の (W₀, W_ii) 4 + 在位の形 1)× 候補 2 × 距離 2 × 作用 3 × 受け手の速度の倍 3(0・1・−1)× 高さ ±6',
  T4: '粒子の輪 7 列(両方・源の回転だけ・並進だけ・両方 OFF・刻み半分・粒子数・初期位相)× 3 公転',
  T5: '自分の重みの列 3(規則・0.1・無し)× 読み 2 × 区分の中心 5(点・corV の向きが変わる高さ・K・帳簿の高さ + 輪の corS・drag90)' });

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const D = L.DECL, nT1 = D.T1.Rr.length * D.T1.inc.length * (1 + D.T1.ref.length), nT3 = (D.T3.den.length + 1) * D.T3.cands.length * 2 * 3;
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 8,
    T1: J.T1.length === nT1 && J.T1.filter((r) => r.inc === 0).every((r) => r.tilt === 0) && J.T1.filter((r) => r.inc > 0).every((r) => r.tilt > 0 && Math.abs(r.vsRing.C1 - 1) < 1e-2),
    T2: J.T2.rotvert.ok === true && J.T2.rotvert.inDefault === false && J.T2.rows.length === D.T2.centers.length,
    T3: J.T3.rows.length === nT3 && J.T3.summary.linMax < 1e-8 && J.T3.rows.filter((r) => r.Wbg + r.Wself === 0).every((r) => !r.swap),
    T4: J.T4.length === D.T4.cfgs.length && J.T4.find((r) => r.cfg === 'off').dTilt === 0 && Math.abs(J.T4.find((r) => r.cfg === 'halfStep').dTilt - J.T4.find((r) => r.cfg === 'both').dTilt) < 1e-3 * Math.abs(J.T4.find((r) => r.cfg === 'both').dTilt),
    T5: J.T5.rows.length === D.T5.cols.length * D.T5.reads.length * D.T5.centers.length,
  };
}
/** 🛟 の正本を読む(器だけがファイルを読む) */
export function readRotvert() { return JSON.parse(fs.readFileSync(path.join(ROOT, INPUT_ROTVERT), 'utf8')); }
const snap0 = (x) => (Math.abs(x) < 1e-12 ? 0 : x);
export function runAll(RV = readRotvert()) {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const T1 = L.table1(); mark('T1');
  const S = L.rotvertSummary(RV), T2r = L.table2(S); mark('T2');
  const T3r = L.swapRows(), T3 = { rows: T3r, summary: L.swapSummary(T3r) }; mark('T3');
  const T4 = L.table4().map((r) => Object.assign(r, { dTilt: snap0(r.dTilt) })); mark('T4');
  const T5 = L.table5(); mark('T5');
  const J = { pure, T1, T2: { rotvert: S, units: T2r.units, Wrule: T2r.Wrule, rows: T2r.rows }, T3, T4, T5, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w350g-diskcheck.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W350G_OUT ? (path.isAbsolute(process.env.W350G_OUT) ? process.env.W350G_OUT : path.join(ROOT, process.env.W350G_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第350便g diskcheck(版 ' + HARNESS_VERSION + ')');
  let tm = null; const RV = readRotvert();
  const S = settleRun(() => { const R = runAll(RV); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w350g-diskcheck.mjs', target: TARGET,
    ruling: '原仮定者の整理(2026-11-23 —— 第146報)・統括の検証項目 R424',
    decl: L.DECL, lit: L.LIT, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第350便g', target: TARGET, code: codeClosure(), inputs: [INPUT_ROTVERT] }), {
    harnessVersion: HARNESS_VERSION, stage: 'diskcheck', engine: 'Node(html を読まない —— 純関数の lib: 枝 h の makeField3 の在位の形の場・第348便i/第348便d の器・第340便d の部位の力・第338便d の帳簿)・🛟 の正本は読むだけ・1 プロセス',
    notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
