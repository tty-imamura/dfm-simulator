// 第352便j(原仮定者の回答(2026-11-24 —— 第148報)・原仮定者の整理(2026-11-24 —— 第148報)・統括の検証項目 R447):
//   **主の表 —— 天体 16 組 + 太陽 × 背景の向き {(N+)・(G−)} × 基準軸 {L・eq} × 歳差の向き {(g2−)・(g2+)} × 背景の大きさ {(uV)・(uMin)・倍率 1・(仮)} × 成分 {(S)・(MS)} の格子と、
//   推奨の組・次点を 1 つずつ替えた組・その差の表・仮の比べる数との並べ(「仮・未照合」の印つき —— 合否にしない)・8 惑星の傾きと円錐・衛星の (S) の主**
//   (段 maintable-352j —— 正本 tests/out/maintable-352j.json・lib tests/lib-w352j-maintable.mjs)。
//   **診断だけ** —— 伺っている項のどれも選ばない(推奨と次点を同じ重さで)。エンジン・内蔵の本・受理器・前の便の lib の本文は変えない。physics の鍵を足さない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w352j-maintable.mjs —— 領域の宣言なし)。入力のファイルは無い(前の便と第 1 ラウンドの lib を呼んで作り直す)。
//   1 プロセス。正本は第338便c の settleRun で書く。仮の値を使うので、正本の最上位に provisional: true と使った鍵の一覧を持つ(第352便b の門)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as E from './lib-w347e-spintorque.mjs';
import * as B from './lib-w352b-provisional.mjs';
import * as L from './lib-w352j-maintable.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w352j-maintable-1';
export const OUT_MAIN = 'tests/out/maintable-352j.json';
export const TARGET = 'tests/lib-w352j-maintable.mjs';
/** 版の履歴(結果を見て変えた所 —— 理由つき) */
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '伺っている 4 項(歳差の向き・背景の向き・金星の条件の中身・基準軸の定義)のどれも選んでいない —— 推奨と次点を同じ重さの列で並べた',
  '仮の値との並べは「仮・未照合」の印つき —— 符号と比の表で、合否・較正・サンプルの状況・ノブの採否に入れない',
  '背景の大きさの列は宣言の列((uV)・(uMin)・倍率 1・(仮))—— 比べる数から既定の値を決めていない',
  '場は geoPN=3 の在位の形(〔第348便h〕の makeField3 の既定の引数)・主の読み (C2)・局所の分母は自分 + 太陽 + 母天体・k 1',
  '潮汐ロックは観測の事実として置いた列(第351便f の 3 列)—— 軸引きずりの結果とは書かない',
  'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない']);
export const BGAX = Object.freeze([['Np', 'L'], ['Np', 'eq'], ['Gm', 'L'], ['Gm', 'eq']]);
export const PROV_BODIES = Object.freeze(['Earth', 'Mars', 'Venus']);
export const PLAN = Object.freeze({ pure: '零試験 12', grid: '行 17 × 背景の向きと基準軸 4 × 歳差の向き 2 × 大きさの列 4 × 成分 2', rec: '推奨の組(N+・L・g2−・uV・S)と、1 つずつ次点に替えた組 4',
  prov: '地球・火星・金星 × 背景の向きと基準軸 4 × 歳差の向き 2 × 大きさの列 4 × 成分 2(印つき)', tilt: '8 惑星 × 基準軸 2', sat: '衛星 5 × 背景の向き 2 × 成分 2' });

const sg = (x) => (x > 0 ? 1 : x < 0 ? -1 : 0);
/** 1 つのセルを ″/年 の表の行に(打ち消しで 0 になる量は abs(Ω) の 1e-12 倍以下を 0 と書く) */
function pack(c) {
  const om = c.omAsYr, fl = (x) => (x === null ? null : Math.abs(x * L.ASYR) <= 1e-12 * om ? 0 : x * L.ASYR);
  const az = {}, inc = {};
  for (const p of L.DECL.poles) { az[p] = fl(c.az[p]); inc[p] = fl(c.inc[p]); }
  return { key: c.key, bg: c.bg, axis: c.axis, sense: c.sense, uCol: c.uCol, part: c.part, u: c.u, omAsYr: om, bgAsYr: c.bgAsYr, locAsYr: c.locAsYr,
    refDeg: c.refDeg, coneDeg: c.coneDeg, orbDeg: c.orbDeg, cosBg: c.cosBg, spinBg: c.spinBg, spin: c.spin, az, inc, raise: fl(c.raise) };
}
const find = (G, o) => G.find((r) => Object.entries(o).every(([k, v]) => r[k] === v));

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const nG = L.DECL.rows.length * BGAX.length * L.DECL.senses.length * L.DECL.uCols.length * L.DECL.parts.length;
  const flipOk = J.grid.filter((r) => r.sense === 'g2p').every((a) => { const b = find(J.grid, { key: a.key, bg: a.bg, axis: a.axis, sense: 'g2m', uCol: a.uCol, part: a.part });
    return b && L.DECL.poles.every((p) => (a.az[p] === null && b.az[p] === null) || Math.abs(a.az[p] + b.az[p]) <= 1e-9 * Math.max(Math.abs(a.az[p]), 1e-300)); });
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 12,
    grid: J.grid.length === nG && J.grid.every((r) => r.omAsYr > 0 && r.coneDeg !== null && r.az.om !== null && Math.abs(Math.abs(r.az.om) - r.omAsYr) <= 1e-9 * r.omAsYr) && flipOk,
    rec: J.rec.length === L.DECL.rows.length && J.swap.length === L.DECL.swaps.length && J.swap.every((s) => s.rows.length === L.DECL.rows.length)
      && J.diff.length === L.DECL.rows.length && J.diff.every((d) => L.DECL.swaps.every(([k]) => d[k] && typeof d[k].marked === 'boolean')) && J.diffG.length === L.DECL.rows.length,
    uCols: J.uTab.length === BGAX.length * L.DECL.parts.length && J.uTab.every((r) => r.uV > 0 && r.uP > 0 && r.uMin >= 0),
    prov: J.prov.length === PROV_BODIES.length * BGAX.length * L.DECL.senses.length * L.DECL.uCols.length * L.DECL.parts.length && J.prov.every((r) => r.provisional === true)
      && J.spread.length === BGAX.length * L.DECL.senses.length * L.DECL.uCols.length * L.DECL.parts.length && J.tilt.provisional === true,
    tilt5: J.tilt5.length === 8 * L.DECL.axes.length && J.tilt5.every((r) => r.obsTiltDeg >= 0 && r.refConeDeg >= 0),
    sat: J.sat.length === L.DECL.sats.length * 2 * L.DECL.parts.length && J.sat.every((r) => r.parOverSun > 0 && r.parOverBg > 0),
    mark: J.provisional === true && Array.isArray(J.provKeys) && J.provKeys.length > 0 && B.outMarkProblems(J).length === 0,
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const T1 = E.t1Table(), GEO = E.geometry(), cache = {};
  const PS = L.pureScenes(T1, GEO), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  // 大きさの列の倍率
  const uTab = [];
  for (const [bg, axis] of BGAX) for (const part of L.DECL.parts) {
    const o = { bg, axis, part };
    uTab.push({ bg, axis, part, uV: L.uOf(T1, GEO, 'uV', o, cache), uMin: L.uOf(T1, GEO, 'uMin', o, cache), uP: L.uOf(T1, GEO, 'uP', o, cache) });
  }
  mark('uTab');
  // 格子
  const grid = [];
  for (const key of L.DECL.rows) for (const [bg, axis] of BGAX) for (const sense of L.DECL.senses) for (const uCol of L.DECL.uCols) for (const part of L.DECL.parts)
    grid.push(pack(L.cellNamed(T1, GEO, key, { bg, axis, sense, uCol, part }, cache)));
  mark('grid');
  // 推奨の組と、1 つずつ次点に替えた組・差
  const R = L.DECL.rec, pick = (key, o) => find(grid, { key, bg: o.bg, axis: o.axis, sense: o.sense, uCol: o.u, part: o.part });
  const rec = L.DECL.rows.map((key) => pick(key, R));
  const swap = L.DECL.swaps.map(([k, v]) => ({ item: k, to: v, rows: L.DECL.rows.map((key) => pick(key, { ...R, [k]: v })) }));
  const diff = L.DECL.rows.map((key, j) => Object.assign({ key }, Object.fromEntries(swap.map((s) => [s.item, L.diffOf(rec[j], s.rows[j])]))));
  const marks = Object.fromEntries(swap.map((s) => [s.item, diff.filter((d) => d[s.item].marked).map((d) => d.key)]));
  // 金星の条件の 2 つの読みは (N+) ではほぼ同じ倍率 —— (G−) の側でも同じ差を数える(比べる表)
  const gBase = { ...R, bg: 'Gm' }, diffG = L.DECL.rows.map((key) => ({ key, ...L.diffOf(pick(key, gBase), pick(key, { ...gBase, u: 'uMin' })) }));
  mark('rec');
  // 仮の比べる数との並べ(印つき)
  const refs = L.provRefs(), prov = [], spread = [];
  for (const [bg, axis] of BGAX) for (const sense of L.DECL.senses) for (const uCol of L.DECL.uCols) for (const part of L.DECL.parts) {
    const rows = PROV_BODIES.map((id) => { const c = find(grid, { key: id + '|Sun', bg, axis, sense, uCol, part }); return { bg, axis, sense, uCol, part, ...L.provCompare(c, id, refs) }; });
    prov.push(...rows);
    spread.push(B.tagProv({ bg, axis, sense, uCol, part, spreadOm: L.spreadOf(rows.map((r) => r.needOm)), spreadPole: L.spreadOf(rows.filter((r) => r.id !== 'Venus').map((r) => r.needPole)),
      venusOverEarth: rows[2].needOm / rows[0].needOm, marsOverEarth: rows[1].needOm / rows[0].needOm }, ['earth.psiA.rate', 'mars.prec.rate', 'venus.prec.rate']));
  }
  const tilt = L.tiltRatios(T1, GEO, refs);
  mark('prov');
  // 表 5: 8 惑星の傾きと基準軸のまわりの円錐((N+)・(uV)・(S) と 倍率 1)
  const tilt5 = [];
  for (const id of L.DECL.planets) for (const axis of L.DECL.axes) {
    const a = L.tiltRow(T1, GEO, id, { axis, uCol: 'uV' }, cache), b = L.tiltRow(T1, GEO, id, { axis, uCol: 'u1' }, cache);
    tilt5.push({ ...a, omConeDegU1: b.omConeDeg, omRefDegU1: b.omRefDeg });
  }
  mark('tilt5');
  // 衛星の行
  const sat = [];
  for (const key of L.DECL.sats) for (const [bg, axis] of [['Np', 'L'], ['Gm', 'L']]) for (const part of L.DECL.parts) sat.push(L.satRow(T1, GEO, key, { bg, axis, uCol: 'uV', part }, cache));
  mark('sat');
  const provKeys = [...new Set(prov.flatMap((r) => r.provKeys).concat(spread.flatMap((r) => r.provKeys), tilt.provKeys))].sort();
  const J = B.tagProv({ pure, uTab, grid, rec, swap, diff, marks, diffG, prov, spread, tilt, tilt5, sat, timing: tm }, provKeys);
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w352j-maintable.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W352J_OUT ? (path.isAbsolute(process.env.W352J_OUT) ? process.env.W352J_OUT : path.join(ROOT, process.env.W352J_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第352便j maintable(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w352j-maintable.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-24 —— 第148報)・原仮定者の整理(2026-11-24 —— 第148報)・統括の検証項目 R447',
    decl: L.DECL, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第352便j', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'maintable', engine: 'Node(html を読まない —— 純関数の lib・第352便b〜e・第351便c〜f・第347便e の lib を呼ぶ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  out.gates = gatesOf(out); out.ok = Object.values(out.gates).every(Boolean);
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
