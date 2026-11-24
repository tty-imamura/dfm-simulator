// 第352便v(原仮定者の回答(2026-11-24 —— 第148報)AN1019・AN1015・統括の検証項目 R459):
//   **打ち消しの点の一覧の器 —— 表 1 全部の組の x(局所の (S) と背景が同じ大きさの倍率 ÷ 金星の条件の値)と残り・打ち消すか足し合うか/表 1b x の閉じた形の一次/
//   表 2 背景 1 つ((uV))で読む合成と受け手の観測の状態/表 3 イオと衛星 —— 打ち消しの近くの判定の量と潮汐のトルクの比/表 4 源の半径の置き方の材料**
//   (段 cancelmap-352v —— 正本 tests/out/cancelmap-352v.json・lib tests/lib-w352v-cancelmap.mjs)。
//   **診断だけ** —— 金星とイオの状態の答えとは書かない。x が 1 の近くに来る組が偶然かどうかは決めない。エンジン・内蔵の本・受理器・前の便の lib の本文と正本と段は変えない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w352v-cancelmap.mjs —— 領域の宣言なし)。入力のファイルなし。1 プロセス。正本は第338便c の settleRun で書く。
// 仮の値は使わない(import の閉包に仮の値の lib を入れない —— 第352便s・j の lib は呼ばず、要る式は本枝の lib に同じ式で書き直した)。
//
// ■ 探索の方針(第138報): 式の形は走行の前に決め打ちしない —— 正本の先頭(decl・plan)は、走らせた組の格子と判定の物差しの記録。
// ■ 判定の物差し(零試験 10): (uV)/金星の x が 1 と残り/イオ・月の x が第352便s の数/太陽 ← 惑星の和が第352便e と同じ/x が背景の向きに依らない・uMin/閉じた形の一次/
//   源の半径の 2 乗/変異 (G−)/拒否。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as E from './lib-w347e-spintorque.mjs';
import * as L from './lib-w352v-cancelmap.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w352v-cancelmap-1';
export const OUT_MAIN = 'tests/out/cancelmap-352v.json';
export const TARGET = 'tests/lib-w352v-cancelmap.mjs';
/** 版の履歴(結果を見て変えた所 —— 理由つき) */
export const AMEND = Object.freeze([
  '方針: 第352便s・j の lib を import せず、satParts・cancelRow・uVt・uForMin を同じ式で書き直した(両 lib は仮の値の lib に import の閉包で届く —— 統括の追加の指示。同じ数になることは QA で第352便s の lib を呼んで見る)',
]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '金星とイオが釣り合いの状態にある・同じ背景で説明がつく、とは書かない —— x の一覧と式と残りの数だけ',
  'x が 1 の近くに来る組が偶然かどうかは決めていない —— 式の上で何がそろうと x が 1 になるかを書いただけ',
  'トルクの比が 1 を越えることは、恒久の文「潮汐力が上回っている」と同じ向きの数というだけ —— 文の当否の判定ではない',
  '受け手の観測の状態(逆行・潮汐ロック・傾き)は、リポジトリの数を横に並べただけ —— 残りの数と関係づけない',
  '背景の向き (N+)/(G−)・基準軸 L/eq・(S) の源の半径(規則/観測)は伺っている項 —— どちらにも寄せずに同じ重さで並べた',
  'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない(AN712)']);
/** 器の宣言(表に出す点) */
export const PLAN = Object.freeze({ pure: '零試験 10', points: '表 1: 組 17 × 源の半径 2 × 背景の向き 2 × 基準軸 2(x・残り・打ち消すか足し合うか)', lead: '表 1b: 組 17 × 源の半径 2(閉じた形の一次)',
  oneBg: '表 2: 組 17 × 源の半径 2 × 背景 4((uV)(t) の背景 1 つ)+ 受け手の観測の状態', near: '表 3: 潮汐の天体 4 × 源の半径 2 × 背景 4 × 倍率 4(局所だけ・(uV)・uEq・uMin)',
  radius: '表 4: 源の半径の置き方の材料(惑星の率・要る換算の係数・イオの x・土星の環の物差し〔第352便s〕・月とカロンの潮汐の余裕)' });

/* ───────── 表 ───────── */
export function pointRows(T1, GEO, c) {
  const out = [];
  for (const key of L.allPairs()) for (const t of L.DECL.tSrcs) for (const bg of L.DECL.bgs) for (const axis of L.DECL.axes) out.push(L.cancelPoint(T1, GEO, key, { tSrc: t, bg, axis }, c));
  return out;
}
export function leadRows(T1, GEO) { const out = []; for (const key of L.allPairs()) for (const t of L.DECL.tSrcs) out.push(L.leadX(T1, GEO, key, t)); return out; }
export function oneBgRows(T1, GEO, c) {
  const out = [];
  for (const key of L.allPairs()) for (const t of L.DECL.tSrcs) { const row = { key, tSrc: t, cells: {} }; for (const bg of L.DECL.bgs) for (const axis of L.DECL.axes) row.cells[bg + axis] = L.oneBg(T1, GEO, key, { tSrc: t, bg, axis }, c); out.push(row); }
  return out;
}
export function nearRows(T1, GEO, c) {
  const out = [];
  for (const id of L.DECL.tideBodies) for (const t of L.DECL.tSrcs) for (const bg of L.DECL.bgs) for (const axis of L.DECL.axes) out.push(L.nearRow(T1, GEO, id, { tSrc: t, bg, axis }, c));
  return out;
}
export function radiusOf(T1, GEO, c, near) {
  const uV = Object.fromEntries(L.DECL.tSrcs.map((t) => [t, L.uVt(T1, GEO, t, c)]));
  const io = Object.fromEntries(L.DECL.tSrcs.map((t) => [t, L.cancelPoint(T1, GEO, 'Io|Jupiter', { tSrc: t, bg: 'Np', axis: 'L' }, c).x]));
  const tide = {};
  for (const id of ['Moon', 'Charon']) for (const t of L.DECL.tSrcs) { const rs = near.filter((r) => r.id === id && r.tSrc === t).map((r) => r.cells.uV.rTide).filter((x) => x !== null); tide[id + '|' + t] = { lo: Math.min(...rs), hi: Math.max(...rs) }; }
  return { planets: L.radiusPlanetRows(T1, GEO), kNeed: { 0: 1 / uV[0], 1: 1 / uV[1] }, io, saturn: L.saturnR2(), ring352s: L.DECL.ring352s, tide };
}
/* ───────── 門 ───────── */
export function gatesOf(J) {
  const D = L.DECL, nP = L.allPairs().length, nT = D.tSrcs.length;
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 10,
    points: J.points.length === nP * nT * 4 && J.points.every((r) => r.uEq > 0 && r.x > 0 && ['cancel', 'add'].includes(r.mode)),
    lead: J.lead.length === nP * nT && J.lead.every((r) => r.x > 0),
    oneBg: J.oneBg.length === nP * nT && J.oneBg.every((r) => Object.keys(r.cells).length === 4) && Object.keys(J.state).length === nP,
    near: J.near.length === D.tideBodies.length * nT * 4 && J.near.every((r) => Object.keys(r.cells).length === 4),
    radius: J.radius.planets.length === 8 && J.radius.kNeed[0] > 0 && J.radius.kNeed[1] > 0,
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const T1 = E.t1Table(), GEO = E.geometry(), c = {};
  const PSc = L.pureScenes(T1, GEO), pure = { scenes: PSc, gates: L.pureGates(PSc) }; mark('pure');
  const uV = Object.fromEntries(L.DECL.tSrcs.map((t) => [t, L.uVt(T1, GEO, t, c)]));
  const points = pointRows(T1, GEO, c); mark('points');
  const lead = leadRows(T1, GEO); mark('lead');
  const oneBg = oneBgRows(T1, GEO, c), state = Object.fromEntries(L.allPairs().map((k) => [k, L.stateOf(T1, GEO, k)])); mark('oneBg');
  const near = nearRows(T1, GEO, c); mark('near');
  const radius = radiusOf(T1, GEO, c, near); mark('radius');
  const J = { pure, uV, points, lead, oneBg, state, near, radius, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}
/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w352v-cancelmap.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}
/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W352V_OUT ? (path.isAbsolute(process.env.W352V_OUT) ? process.env.W352V_OUT : path.join(ROOT, process.env.W352V_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第352便v cancelmap(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w352v-cancelmap.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-24 —— 第148報)・統括の検証項目 R459',
    decl: L.DECL, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第352便v', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'cancelmap', engine: 'Node(html を読まない —— 純関数の lib: 〔第352便k〕の spinRot・〔第352便e〕の rotOf・〔第352便i〕の judgeConst・〔第351便f〕の衛星の口・〔第352便c〕の基準軸・〔第352便d〕の背景の向き)・入力のファイルなし・1 プロセス',
    notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
