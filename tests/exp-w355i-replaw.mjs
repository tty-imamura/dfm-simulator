// 第355便i(統括の検証項目 R512): **論文 5 の思考実験「圧力 = 粒の間の斥力」のまま、斥力の則の族をノブで振る診断の器**
//   表 A1 形 × 距離の冪(切らない・割らない)/表 A2 届く距離を切る(なめらか・段 × 切る距離)/表 A3 近くの粒の数で割る(p × 近くの半径)/
//   表 A4 切る × 割る の組/表 A5 熱への依り方(和 —— 積と同じ数)/表 A6 二次元/表 A7 並進ありの箱の斥力の分/表 A8 窓に入る組の粒の数を上げた箱/
//   表 B 並進の運動の寄与を主にする列(比べる列 —— 第355便g の列の斥力の強さの倍を振る)/零試験 10
//   (段 replaw-355i —— 正本 tests/out/replaw-355i.json・lib tests/lib-w355i-replaw.mjs)。
//   **診断だけ** —— アプリ・エンジン・内蔵の本・受理器・既存の lib の本文は変えない。physics の鍵を足さない。三次元の受理の門は変えない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w355i-replaw.mjs —— 領域の宣言なし)。入力のファイルは無い。1 プロセス。正本は第338便c の settleRun で書く。
//   仮の値の lib は閉包に入らない。乱数は使わない(定めた種の線形合同)。
//
// ■ 言わないこと: アナロジーとしての玩具の量 —— 現実の熱力学の記述ではない。族の外の則は数えていない。微視状態の数・エントロピーの主張は足さない。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as I from './lib-w355i-replaw.mjs';
import * as H from './lib-w355g-heat3d.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w355i-replaw-1';
export const OUT_MAIN = 'tests/out/replaw-355i.json';
export const TARGET = 'tests/lib-w355i-replaw.mjs';
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  'アナロジーとしての玩具の量 —— 現実の熱力学の記述ではない。現実の宇宙の主張はしない',
  '宣言した族(形 × 冪・切る・割る・熱への依り方)の内だけを数えた —— 族の外の則は数えていない。冪は「窓の内/外」と書く',
  '微視状態の数・エントロピーの主張は足さない(論文 5 の限界の表のまま)',
  'アプリの積分・受理の門・内蔵の本へは入れない',
  '斥力の強さ kRep・壁の硬さ・粒の半径・切る距離・近くの半径は器のノブ(値は玩具の単位 —— 未照合)・粒 64 の小さな箱(壁の近くの粒の割合が大きい)']);
const S = (o) => I.specOf(o);
export const GRID = Object.freeze({
  a1: Object.freeze([S({}), S({ shape: 'P1', s: 1 }), S({ shape: 'P2', s: 1 }), S({ shape: 'P2', s: 2 }), S({ shape: 'P2', s: 3 }), S({ shape: 'P2', s: 6 })]),
  a2: Object.freeze([...[1, 2, 4].map((c) => S({ shape: 'P2', s: 1, cut: 'smooth', c })), ...[2, 4].map((c) => S({ shape: 'P2', s: 1, cut: 'step', c }))]),
  a3: Object.freeze([S({ shape: 'P2', s: 1, p: 1, cn: 1 }), ...[1, 2].flatMap((s) => [2, 3].map((cn) => S({ shape: 'P2', s, p: 1, cn }))), S({ shape: 'P2', s: 3, p: 1, cn: 3 }), S({ shape: 'P2', s: 2, p: 0.5, cn: 3 }), S({ shape: 'G', p: 1, cn: 3 })]),
  a4: Object.freeze([S({ shape: 'P2', s: 1, cut: 'smooth', c: 2, p: 1, cn: 3 }), S({ shape: 'P2', s: 1, cut: 'smooth', c: 4, p: 1, cn: 3 }), S({ shape: 'P2', s: 2, cut: 'smooth', c: 4, p: 1, cn: 3 }),
    S({ shape: 'P2', s: 1, cut: 'step', c: 4, p: 1, cn: 3 }), S({ shape: 'P1', s: 1, cut: 'smooth', c: 4, p: 1, cn: 3 }), S({ shape: 'P2', s: 1, cut: 'smooth', c: 4, p: 1, cn: 2 }), S({ shape: 'P2', s: 1, cut: 'smooth', c: 4, p: 0.5, cn: 3 })]),
  a5: Object.freeze([S({ shape: 'P2', s: 1, cut: 'smooth', c: 4, p: 1, cn: 3, form: 'sum' })]),
  a6: Object.freeze([S({ shape: 'P2', s: 1, cut: 'smooth', c: 4, p: 1, cn: 3 })]),
  a7: Object.freeze([S({}), S({ shape: 'P2', s: 1, cut: 'smooth', c: 4, p: 1, cn: 3 })]),
});
export const A8_MAX = 2;   // 表 A8 は窓に入った組のうち格子の順の先頭 2 組(1 回の走行の予算 —— ほかは未)
export const BCOLS = Object.freeze(['K2-L0t', 'A3-L0t', 'B3-L1t']);
export const BMULTS = Object.freeze([0, 0.3, 1, 3]);
export const PLAN = Object.freeze({
  pure: '零試験 10(今の形 = g の lib の L0 = アプリの E5′〔tint〕・P1 の s 3 = 今の形・遠くの冪 −s・切る因子・運動量の保存〔内力の和 0〕・積と和は温度をそろえた箱で同じ数・既定の積分器 = g の lib の simulate〔三次元・二次元・並進あり〕・g の L2 と同じ作り・二次元へ落とす条件・定めた手順)',
  a: '表 A1〜A7: 組ごとに 斥力だけの圧力(並進なし)の密度への冪(箱で振る —— ρ 0.02・0.08・0.32/粒の数で振る —— 粒 27・64・125・箱の一辺は ρ 0.08 の値)・温度への冪(T 0.5・1・2)・示量の印(2 つの冪の差 ≤ 0.1)・窓 0.9〜1.1 の印・近くの数の平均・切る距離の内の対の割合',
  a8: '表 A8: 表 A1〜A4 で窓に入った組のうち格子の順の先頭 2 組を、粒 216 の箱(密度の格子は同じ)で振り直した箱の冪(ほかの組と粒 512 は 1 回の走行の予算の外 —— 未)',
  b: '表 B: 第355便g の並進ありの列 3 × 斥力の強さの倍 4(0・0.3・1・3 —— 0.1 と 10 は第355便g の正本)の全体の密度の冪・斥力の分 ÷ 並進の分・窓に入る倍の上端(格子の上の線形の内挿)',
  zero: '零試験の照合: 自分の器の既定の組が第355便g の列 K2-L0・A3-L0・G3 と同じ数(g の lib の point を呼んだ値と、相対 1e-12)',
});
/** 表 A8: 窓に入った組を粒 216 の箱で(密度の格子は同じ・切る距離と近くの半径は a★ の物差しのまま) */
export function bigRow(r) {
  const N = I.DECL.nBig[0], pts = I.DECL.rho3.map((rho) => I.point(r.sp, 3, rho, 1, { N })), ok = pts.every((p) => p.Prep > I.DECL.pFloor);
  const aBig = ok ? H.slope(pts.map((p) => p.rho), pts.map((p) => p.Prep)) : null;
  return { id: r.id, sp: r.sp, aBox64: r.aBox, aN64: r.aN, big: [{ N, pts: pts.map((p) => ({ rho: p.rho, P: p.P, nMean: p.nMean, inCut: p.inCut })), aBox: aBig, shift: aBig === null ? null : aBig - r.aBox, inWin: aBig !== null && aBig >= I.DECL.window[0] && aBig <= I.DECL.window[1] }] };
}
export const rowOf = (r) => ({ id: r.id, sp: r.sp, D: r.D, tr: r.tr, reach: r.reach, rhoPts: r.rhoPts, tPts: r.tPts, nPts: r.nPts, aBox: r.aBox, aN: r.aN, aT: r.aT, extensive: r.extensive, inWin: r.inWin, dist: Number.isFinite(I.dist1(r)) ? I.dist1(r) : null, nMeanMid: r.nMeanMid, inCutMid: r.inCutMid, reduces2D: r.reduces2D, big: r.big });

/** 零試験の照合: 自分の器の既定の組 = g の lib の point(K2-L0・A3-L0 の密度の格子の 3 点 —— g の正本の t1 と同じ入力)・G3(並進だけ) */
export function zeroRows() {
  const out = [];
  for (const [col, D, rhos] of [['K2-L0', 2, H.DECL.rho2], ['A3-L0', 3, H.DECL.rho3]]) for (const rho of rhos) {
    const g = H.point(col, rho, 1), m = I.point(I.specOf(), D, rho, 1, {}); out.push({ col, rho, gP: g.P, mineP: m.P }); }
  for (const rho of H.DECL.rho3) { const g = H.point('G3', rho, 1), m = I.point(I.specOf(), 3, rho, 1, { tr: true, rep: false }); out.push({ col: 'G3', rho, gP: g.P, mineP: m.P }); }
  return out;
}

export function gatesOf(J) {
  const nA = (k) => J[k].length === GRID[k].length && J[k].every((r) => r.rhoPts.length === 3 && r.tPts.length === 3 && r.nPts.length === 3 && (r.reach ? Number.isFinite(r.aBox) && Number.isFinite(r.aN) && Number.isFinite(r.aT) : r.aBox === null));
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 10,
    a: ['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7'].every(nA),
    a5same: J.a5[0].reach && Math.abs(J.a5[0].aBox - J.a4.find((r) => r.id === 'P2s1/cs4/p1n3').aBox) <= 1e-9,
    a8: J.a8.length === Math.min(A8_MAX, J.summary.inWin.length) && J.a8.every((r, k) => r.id === J.summary.inWin[k] && r.big.length === 1 && r.big[0].pts.length === 3),
    b: J.b.length === BCOLS.length && J.b.every((c) => c.rows.length === BMULTS.length && c.rows.every((r) => Number.isFinite(r.aRho))),
    zero: J.zero.length === 9 && J.zero.every((r) => Math.abs(r.gP - r.mineP) <= 1e-12 * Math.max(Math.abs(r.gP), 1e-300) && r.gP > 0),
  };
}
/** 本体(同期 —— settleRun が Math の関数をずらして走らせ直す) */
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = I.pureScenes(), pure = { scenes: PS }; mark('pure');
  const J = { pure };
  for (const k of ['a1', 'a2', 'a3', 'a4', 'a5']) { J[k] = GRID[k].map((sp) => rowOf(I.comboPowers(sp, 3))); mark(k); }
  J.a6 = GRID.a6.map((sp) => rowOf(I.comboPowers(sp, 2))); mark('a6');
  J.a7 = GRID.a7.map((sp) => rowOf(I.comboPowers(sp, 3, { tr: true }))); mark('a7');
  const inRows = ['a1', 'a2', 'a3', 'a4'].flatMap((k) => J[k].filter((r) => r.inWin));
  J.a8 = inRows.slice(0, A8_MAX).map((r) => bigRow(r)); mark('a8');
  J.b = BCOLS.map((c) => I.bScan(c, BMULTS)); mark('b');
  J.zero = zeroRows(); mark('zero');
  J.timing = tm;
  return J;
}
/** 尺度の走り直しの後に足す欄(零試験の門・まとめ・門 —— 2 つの走行を比べる門と順位は、ずらした走り直しでは揺れるので、settle の後の値から作る) */
export function finish(J) {
  J.pure.gates = I.pureGates(J.pure.scenes);
  const all = ['a1', 'a2', 'a3', 'a4'].flatMap((k) => J[k]), inRows = all.filter((r) => r.inWin);
  const ranked = all.filter((r) => r.dist !== null).sort((p, q) => p.dist - q.dist);
  J.summary = { nCombos: all.length, nReach: all.filter((r) => r.reach).length, inWin: inRows.map((r) => r.id), a8Not: inRows.slice(A8_MAX).map((r) => r.id), nearest: ranked.slice(0, 5).map((r) => ({ id: r.id, aBox: r.aBox, aN: r.aN, aT: r.aT, dist: r.dist, extensive: r.extensive })) };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}
/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w355i-replaw.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W355I_OUT ? (path.isAbsolute(process.env.W355I_OUT) ? process.env.W355I_OUT : path.join(ROOT, process.env.W355I_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第355便i replaw(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const St = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  finish(St.value);
  const out = { version: HARNESS_VERSION, libVersion: I.LIB_VERSION, generator: 'tests/exp-w355i-replaw.mjs', target: TARGET,
    ruling: '原仮定者の指示(2026-11-21)・原仮定者の回答(2026-11-22)・統括の検証項目 R512', decl: I.DECL, grid: GRID, bCols: BCOLS, bMults: BMULTS, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...St.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第355便i', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'replaw', engine: 'Node(html を読まない —— 純関数の lib の小さな積分器)・1 プロセス', notClaim: NOT_CLAIM, recheck: St.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + St.meta.zeroed + '・不安定 ' + St.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
