// 第352便s(原仮定者の回答(2026-11-24 —— 第148報)AN1015・原仮定者の回答(2026-11-24 —— 第147報)AN1001・統括の検証項目 R456):
//   **衛星と輪を、主の成分 (S) で数え直す器 —— 表 1 衛星の由来(母天体由来 (S) ÷ 太陽由来 (S)・÷ 背景)と潮汐ロックの 3 列・潮汐のトルク ÷ 軸引きずりの直交成分のトルク/
//   表 2 打ち消し(金星と同じ形 —— 局所の (S) と背景)とイオの倍率 ÷ 金星の倍率/表 3 互いにロックした冥王星–カロン/表 4 土星の環と太陽系の公転面の輪**
//   (段 satring-352s —— 正本 tests/out/satring-352s.json・lib tests/lib-w352s-satring.mjs)。
//   **診断だけ** —— 潮汐ロックの成り立ち・内部熱の出どころ・イオの状態は決めない。エンジン・内蔵の本・受理器・前の便の lib の本文と正本と段は変えない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w352s-satring.mjs —— 領域の宣言なし)。入力のファイルなし。1 プロセス。正本は第338便c の settleRun で書く。仮の値は使わない。
//
// ■ 探索の方針(第138報): 式の形は走行の前に決め打ちしない —— 正本の先頭(decl・plan)は、走らせたノブの格子と判定の物差しの記録。
// ■ 判定の物差し(零試験 11): 規則の半径・成分 (MS)/(S) で第351便f の satTerms と同じ/(MS) で第351便f の比(イオ 4.32e3・月 1.56e-2)に戻る/第352便j の satRow・cellOf と同じ/
//   (uV)/打ち消しの倍率/輪の口が第352便k の spinRot と同じ/赤道面の輪で土星由来は法線に平行/源の半径の 2 乗/変異 (G−)/拒否。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as E from './lib-w347e-spintorque.mjs';
import * as F from './lib-w351f-satlock.mjs';
import * as L from './lib-w352s-satring.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w352s-satring-1';
export const OUT_MAIN = 'tests/out/satring-352s.json';
export const TARGET = 'tests/lib-w352s-satring.mjs';
/** 版の履歴(結果を見て変えた所 —— 理由つき) */
export const AMEND = Object.freeze([
  'lib: 打ち消しの行の uMin の残りを「合成 ÷ 局所」にした(背景の大きさが局所より小さい所で「合成 ÷ 背景」は 1 を越え、打ち消しの度合いに読めない —— 走らせて見た後の変更)',
]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '潮汐ロックの成り立ち・内部熱の出どころ・イオの状態は決めていない(比と残りの数だけ)',
  'トルクの比が 1 を越えることは、恒久の文「潮汐力が上回っている」と同じ向きの数というだけ —— 文の当否の判定ではない',
  '衛星の主の列(母天体の自転の分 (S) だけ/母天体の (MS) を残す)は決めていない —— 両方の列を並べた',
  '金星とイオを同じ背景で読むかは決めていない —— 打ち消しの倍率の比を並べただけ',
  '背景の向き (N+)/(G−)・基準軸 L/eq・(S) の源の半径(規則/観測)は伺っている項 —— どちらにも寄せずに同じ重さで並べた',
  'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない(AN712)']);
/** 器の宣言(表に出す点) */
export const PLAN = Object.freeze({ pure: '零試験 11', sat: '表 1: 衛星 5 組 × 源の半径 2 × 背景の向き 2 × 基準軸 2 × (uV)(t)', torque: '表 1c: 潮汐の天体 4 × 源の半径 2 × 背景 4 + 局所だけ + 第351便f の列',
  cancel: '表 2: 金星 + 衛星 5 組 × 源の半径 2 × 背景の向き 2 × 基準軸 2(uEq・uMin・残り・走査 17 点)', mut: '表 3: 冥王星–カロン 2 向き × 源の回転の形 2 × 源の自転 3 × 相対の速さ 2 + 源の半径 2',
  ring: '表 4: 土星の環の区分 5 × 源の半径 2(傾き 0 と 1°・背景 4)', plane: '表 4b: 公転面の輪(地球・土星の道)× 法線 3 × 源の半径 2 × 背景 4' });

/* ───────── 表 ───────── */
export function satRows(T1, GEO, c) {
  const out = [];
  for (const key of L.DECL.sats) for (const t of L.DECL.tSrcs) {
    const u = L.uVt(T1, GEO, t, c), row = { key, tSrc: t, u, cells: {} };
    for (const bg of L.DECL.bgs) for (const axis of L.DECL.axes) row.cells[bg + axis] = L.satCell(T1, GEO, key, { tSrc: t, bg, axis, u }, c);
    const ms = L.satParts(T1, GEO, key, { tSrc: t, part: 'MS' }, c), nrm = (a) => Math.hypot(a[0], a[1], a[2]);
    row.msParOverSun = nrm(ms.parent) / nrm(ms.sun);
    out.push(row);
  }
  return out;
}
export function torqueRows(T1, GEO, c) {
  const out = [];
  for (const id of L.DECL.tideBodies) {
    const key = L.DECL.tideKey[id], [, src] = key.split('|'), S = F.satInput(T1, GEO, id, src), T = F.tideOf(id), r351 = F.torqueRatio(T, S, F.satTerms(T1, GEO, id, src).A);
    for (const t of L.DECL.tSrcs) {
      const row = { id, key, tSrc: t, r351f: r351.rTide, r351fK: r351.rTideK, cells: {} };
      const loc = L.satCell(T1, GEO, key, { tSrc: t, bg: 'Np', axis: 'L', u: 0 }, c);
      row.local = loc.torque;
      for (const bg of L.DECL.bgs) for (const axis of L.DECL.axes) row.cells[bg + axis] = L.satCell(T1, GEO, key, { tSrc: t, bg, axis, u: L.uVt(T1, GEO, t, c) }, c).torque;
      out.push(row);
    }
  }
  return out;
}
export function cancelRows(T1, GEO, c) {
  const out = [];
  for (const key of ['Venus|Sun', ...L.DECL.sats]) for (const t of L.DECL.tSrcs) for (const bg of L.DECL.bgs) for (const axis of L.DECL.axes) out.push(L.cancelRow(T1, GEO, key, { tSrc: t, bg, axis }, c));
  return out;
}
/* ───────── 門 ───────── */
export function gatesOf(J) {
  const D = L.DECL, nS = D.sats.length, nT = D.tSrcs.length;
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 11,
    sat: J.sat.length === nS * nT && J.sat.every((r) => Object.keys(r.cells).length === 4 && Object.values(r.cells).every((x) => x.omAsYr > 0)),
    torque: J.torque.length === D.tideBodies.length * nT && J.torque.every((r) => Object.values(r.cells).every((x) => x && x.rTide > 0)),
    cancel: J.cancel.length === (nS + 1) * nT * 4 && J.cancel.every((r) => r.uEq > 0 && r.scan.length === D.scanExp.length),
    mut: J.mut.length === 2 * 2 * 5 && J.mutR.length === 2 * nT,
    ring: J.ring.length === D.ringCenters.length * nT && J.ring.every((r) => r.satS.perpOverMag < 1e-9 && r.satM.perpOverMag < 1e-9),
    plane: J.plane.length === D.planeRingAt.length * 3 * nT,
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const T1 = E.t1Table(), GEO = E.geometry(), c = {};
  const PSc = L.pureScenes(T1, GEO), pure = { scenes: PSc, gates: L.pureGates(PSc) }; mark('pure');
  const uV = Object.fromEntries(L.DECL.tSrcs.map((t) => [t, L.uVt(T1, GEO, t, c)]));
  const strip = (x) => { const { Om, ...rest } = x; return rest; };
  const sat = satRows(T1, GEO, c).map((r) => ({ ...r, cells: Object.fromEntries(Object.entries(r.cells).map(([k, v]) => [k, strip(v)])) })); mark('sat');
  const torque = torqueRows(T1, GEO, c); mark('torque');
  const cancel = cancelRows(T1, GEO, c); mark('cancel');
  const mut = L.mutualRows(T1, GEO, c), mutR = L.mutualRadiusRows(T1, GEO, c); mark('mut');
  const ring = []; for (const k of L.DECL.ringCenters) for (const t of L.DECL.tSrcs) ring.push(L.saturnRing(T1, GEO, k, { tSrc: t }, c)); mark('ring');
  const plane = []; for (const at of L.DECL.planeRingAt) for (const n of ['L', 'eq', 'ecl']) for (const t of L.DECL.tSrcs) plane.push(L.planeRing(T1, GEO, at, n, { tSrc: t }, c)); mark('plane');
  const J = { pure, uV, sat, torque, cancel, mut, mutR, ring, plane, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}
/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w352s-satring.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}
/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W352S_OUT ? (path.isAbsolute(process.env.W352S_OUT) ? process.env.W352S_OUT : path.join(ROOT, process.env.W352S_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第352便s satring(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w352s-satring.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-24 —— 第148報)・原仮定者の回答(2026-11-24 —— 第147報)・統括の検証項目 R456',
    decl: L.DECL, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第352便s', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'satring', engine: 'Node(html を読まない —— 純関数の lib: 〔第352便k〕の spinRot・〔第352便j〕の cellOf・〔第351便f〕の衛星の口・〔第352便c〕の基準軸・〔第352便d〕の背景の向き)・入力のファイルなし・1 プロセス',
    notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
