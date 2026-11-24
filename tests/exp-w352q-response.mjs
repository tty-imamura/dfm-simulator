// 第352便q(原仮定者の整理(2026-11-24 —— 第148報)・原仮定者の回答(2026-11-24 —— 第147報)・統括の検証項目 R454):
//   **応答の係数と天体の構造を数える器 —— 表 1 要る応答の係数(比べる数 ÷ 単位の応答の率 —— 天体 5 × 背景の向き 2 × 基準軸 2 × 源の半径 2 × 背景の大きさ 2)/
//   表 2 式の候補 (ア)〜(エ) の物差しと、比 C ÷ X のそろう度合い・べきの組の走査(整数と半整数・量 3 つまで)/表 3 背景を共通に置いたときの階数と、経路の比率の感度(第352便b)/
//   表 4 太陽の応答の係数を同じ式の候補で写した仮の列**(段 response-352q —— 正本 tests/out/response-352q.json・lib tests/lib-w352q-response.mjs)。
//   **並びの診断だけ** —— 応答の係数・構造の式・べきの値を決めない。エンジン・内蔵の本・受理器・前の便の lib の本文と正本と段は変えない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w352q-response.mjs —— 領域の宣言なし)。入力のファイルなし。1 プロセス。正本は第338便c の settleRun で書く。
// 仮の値は第352便b の lib の prov() に在る数だけ(表 1〜4 の比べる列)—— 正本の最上位に provisional: true と使った鍵の一覧を持つ。
//
// ■ 探索の方針(第138報): 式の形は走行の前に決め打ちしない —— 正本の先頭(decl・plan)は、走らせた列と物差しの記録。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as PV from './lib-w352b-provisional.mjs';
import * as JM from './lib-w352j-maintable.mjs';
import * as E from './lib-w347e-spintorque.mjs';
import * as L from './lib-w352q-response.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w352q-response-1';
export const OUT_MAIN = 'tests/out/response-352q.json';
export const TARGET = 'tests/lib-w352q-response.mjs';
/** 版の履歴(結果を見て変えた所 —— 理由つき) */
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '応答の係数・構造の式・べきの値は決めていない(並びの診断 —— どの列も候補の表)',
  '仮の値(第352便b)を使う列は「仮・未照合」—— 較正の合否・サンプルの状況・ノブの採否に入れない',
  'リポジトリの文献の値(水星 —— 役割「桁」・月 —— 軌道の交点の率)は固定の比べる列(合わせない)',
  'べきの組の走査の残差は、天体 3 つ(自由度 2)では小さくなる組が多い —— 残差の小ささは式の採否ではない',
  '太陽の列は地球の要る係数を式の候補の比で写した仮の数 —— 太陽の歳差の率とは書かない',
  'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない(AN712)']);
/** 器の宣言(表に出す点) */
export const PLAN = Object.freeze({ pure: '零試験 10', need: '表 1: 天体 5 × 背景の向き 2 × 基準軸 2 × 源の半径 2 × 背景の大きさ 2(月の観測の半径の列は持たない)',
  cand: '表 2: 式の候補 7 × 列 16(背景の向き × 基準軸 × 源の半径 × 背景の大きさ)', scan: '表 2′: べきの組の走査(量 6 —— ω・n・R・ρ・慣性モーメントの係数・J2 —— の 1〜3 つ × べき 8)× 列 5 × 天体 3 と 4',
  rank: '表 3: 背景を共通に置いたときの階数(天体の組 2 × f の置き方 2 × 背景の倍率をノブにする/宣言 × 列 4)と経路の比率の感度(第352便b)', sun: '表 4: 太陽(式の候補 7 + 走査の最良の組 × 列 4)',
  prov: '比べる列: 地球 ψ_A の率・火星の歳差の率・金星の歳差の率(仮・未照合)・水星と月(リポジトリの文献の値)' });
const BODIES = Object.freeze([...L.DECL.provBodies, ...L.DECL.repoBodies]);
/** 列(背景の向き × 基準軸 × 源の半径 × 背景の大きさ) */
export const COLS = Object.freeze(L.DECL.bgs.flatMap((bg) => L.DECL.axes.flatMap((axis) => L.DECL.tSrcs.flatMap((tSrc) => L.DECL.uCols.map((uCol) => Object.freeze({ bg, axis, tSrc, uCol }))))));
/** 走査の列(背景が主の 1 列と (uV) の 4 列) */
export const SCAN_COLS = Object.freeze([['Np', 'L', 0, 'u1'], ['Np', 'L', 0, 'uV'], ['Gm', 'L', 0, 'uV'], ['Np', 'L', 1, 'uV'], ['Gm', 'L', 1, 'uV']].map(([bg, axis, tSrc, uCol]) => Object.freeze({ bg, axis, tSrc, uCol })));
/** 階数の列 */
export const RANK_COLS = Object.freeze([['Np', 'L', 0, 'u1'], ['Np', 'L', 0, 'uV'], ['Gm', 'L', 0, 'uV'], ['Np', 'L', 1, 'uV']].map(([bg, axis, tSrc, uCol]) => Object.freeze({ bg, axis, tSrc, uCol })));
export const RANK_SETS = Object.freeze([Object.freeze(['Earth', 'Mars']), Object.freeze(['Earth', 'Mars', 'Venus'])]);
/** 太陽の列 */
export const SUN_COLS = Object.freeze([['Np', 'L', 0, 'u1'], ['Np', 'L', 0, 'uV'], ['Gm', 'L', 0, 'uV'], ['Np', 'L', 1, 'uV']].map(([bg, axis, tSrc, uCol]) => Object.freeze({ bg, axis, tSrc, uCol })));
const colKey = (c) => [c.bg, c.axis, c.tSrc, c.uCol].join('|');

export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const T1 = E.t1Table(), GEO = E.geometry(), cache = {};
  const PSc = L.pureScenes(T1, GEO), pure = { scenes: PSc, gates: L.pureGates(PSc) }; mark('pure');
  // 表 1 要る応答の係数
  const need = [];
  for (const c of COLS) {
    const u = L.uOfCol(T1, GEO, c.uCol, c.tSrc, cache), rows = BODIES.map((id) => L.needOf(T1, GEO, id, { bg: c.bg, axis: c.axis, tSrc: c.tSrc, u }, cache)), e = rows[0].need;
    for (const r of rows) need.push({ ...r, uCol: c.uCol, rel: r.need === null ? null : r.need / e, relPole: r.needPole === null || rows[0].needPole === null ? null : r.needPole / rows[0].needPole });
  }
  mark('need');
  // 構造の量
  const structs = [...BODIES, 'Sun'].map((id) => L.structOf(T1, GEO, id)), S = Object.fromEntries(structs.map((s) => [s.id, s]));
  mark('struct');
  // 表 2 式の候補
  const cand = [];
  for (const c of COLS) {
    const u = L.uOfCol(T1, GEO, c.uCol, c.tSrc, cache), col = { bg: c.bg, axis: c.axis, tSrc: c.tSrc, u };
    const xs = Object.fromEntries(BODIES.map((id) => [id, L.candOf(T1, GEO, id, col, cache)])), nd = BODIES.map((id) => need.find((r) => r.id === id && colKey(r) === colKey(c)).need);
    for (const k of L.DECL.cands) {
      const x = BODIES.map((id) => xs[id][k]), a3 = L.alignRow(nd.slice(0, 3), x.slice(0, 3), BODIES.slice(0, 3)), a4 = L.alignRow(nd.slice(0, 4), x.slice(0, 4), BODIES.slice(0, 4)), a5 = L.alignRow(nd, x, BODIES);
      cand.push({ ...c, cand: k, x, xRel: x.map((v) => (v === null || !x[0] ? null : v / x[0])), ratio: a5.ratio, spread3: a3.spread, spread4: a4.spread, spread5: a5.spread });
    }
  }
  mark('cand');
  // 表 2′ べきの組の走査
  const scan = [];
  for (const c of SCAN_COLS) for (const nB of [3, 4]) {
    const ids = BODIES.slice(0, nB), nd = ids.map((id) => need.find((r) => r.id === id && colKey(r) === colKey(c)).need), R = L.powerScan(nd, ids.map((id) => S[id]), { top: 8 });
    scan.push({ ...c, nBodies: nB, ids, usable: R.usable, counts: R.counts, top: R.top, bestBySize: R.bestBySize });
  }
  mark('scan');
  // 表 3 階数と経路の比率の感度
  const rank = [];
  for (const c of RANK_COLS) { const u = L.uOfCol(T1, GEO, c.uCol, c.tSrc, cache);
    for (const bodies of RANK_SETS) for (const fMode of ['shared', 'each']) for (const fixU of [false, true]) rank.push(L.rankCase(T1, GEO, { bodies: [...bodies], fMode, fixU, col: { ...c, u } }, cache)); }
  const tilt = JM.tiltRatios(T1, GEO);
  mark('rank');
  // 表 4 太陽
  const sun = [], best = scan.find((s) => colKey(s) === colKey(SCAN_COLS[0]) && s.nBodies === 3);
  const scanPicks = Object.values(best.bestBySize).concat(best.top.filter((r) => r.qs.indexOf('J2') < 0).slice(0, 1));
  for (const c of SUN_COLS) {
    for (const k of L.DECL.cands) sun.push({ ...L.sunRow(T1, GEO, { ...c, cand: k }, cache), label: L.DECL.candLabels[k] });
    for (const p of scanPicks) {
      const X = (id) => { const s = S[id]; let v = 1; for (let j = 0; j < p.qs.length; j++) { if (!(s[p.qs[j]] > 0)) return null; v *= Math.pow(s[p.qs[j]], p.pows[j]); } return v; };
      sun.push({ ...L.sunRow(T1, GEO, { ...c, cand: 'scan', xs: { Sun: X('Sun'), Earth: X('Earth') } }, cache), label: p.qs.map((q, j) => q + '^' + p.pows[j]).join(' '), pick: { qs: p.qs, pows: p.pows }, spread3: p.spread });
    }
  }
  mark('sun');
  const provKeys = [...new Set(need.filter((r) => r.provKeys).flatMap((r) => r.provKeys).concat(tilt.provKeys, sun.flatMap((r) => r.provKeys)))].sort();
  const J = PV.tagProv({ pure, need, structs, cand, scan, rank, tilt, sun, timing: tm }, provKeys);
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}
/* ───────── 門 ───────── */
export function gatesOf(J) {
  const nC = COLS.length;
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 10,
    need: J.need.length === nC * BODIES.length && J.need.filter((r) => r.need === null).length === nC / 2 && J.need.filter((r) => r.id === 'Earth').every((r) => r.rel === 1),
    structs: J.structs.length === BODIES.length + 1 && J.structs.every((s) => s.omega > 0 && s.R > 0 && s.rho > 0),
    cand: J.cand.length === nC * L.DECL.cands.length && J.cand.filter((r) => r.cand === 'a1').every((r) => r.x.every((v) => v === 1)),
    scan: J.scan.length === SCAN_COLS.length * 2 && J.scan.every((s) => s.counts.total > 0 && s.top.length === 8),
    rank: J.rank.length === RANK_COLS.length * RANK_SETS.length * 4 && J.rank.every((r) => r.rank[0] <= Math.min(r.nObs, r.nKnobs)),
    sun: J.sun.length > 0 && J.sun.every((r) => r.periodYr === null || Math.abs(r.periodYr * r.rateAsYr / 1296000 - 1) < 1e-9),
    prov: J.provisional === true && Array.isArray(J.provKeys) && J.provKeys.length >= 3 && PV.outMarkProblems(J).length === 0,
  };
}
/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w352q-response.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}
/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W352Q_OUT ? (path.isAbsolute(process.env.W352Q_OUT) ? process.env.W352Q_OUT : path.join(ROOT, process.env.W352Q_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第352便q response(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w352q-response.mjs', target: TARGET,
    ruling: '原仮定者の整理(2026-11-24 —— 第148報)・原仮定者の回答(2026-11-24 —— 第147報)・統括の検証項目 R454',
    decl: L.DECL, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第352便q', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'response', engine: 'Node(html を読まない —— 純関数の lib: 〔第352便k〕の (S)・〔第352便j〕の主の表・〔第352便d〕の背景・〔第352便c〕の基準軸・〔第352便b〕の仮の値・〔第351便k〕の階数の道具・〔第350便f〕の構造の比)・入力のファイルなし・1 プロセス',
    notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
