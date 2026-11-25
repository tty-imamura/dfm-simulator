// 第353便zc(原仮定者の回答(2026-11-25 —— 第151報)・統括の検証項目 R493):
//   **向きの一致の幾何の器 —— 表 1 8 惑星の法線の並び(弧の上の位置・横のずれ・n★ からの角・φ)・表 1b 1/3 の由来の照合(重み・弧の上の厳密な点・平均と閉じた形)・
//   表 2 太陽の自転軸の円錐の位相を回したとき(8 惑星の φ の幅・いまの百分位・1 番の割合)・表 3 公転面の交点を回したとき(金星・地球・土星・木星)と時間の窓(交点の周期と向きはノブ)・
//   表 3b n★ の近くに法線が来る見込み・表 4 受け手の半径の置き方 3 つ・表 4b 衛星の道の面・零試験 8**
//   (段 dirgeo-353zc —— 正本 tests/out/dirgeo-353zc.json・lib tests/lib-w353zc-dirgeo.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・既存の lib の本文は変えない。physics の鍵を足さない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w353zc-dirgeo.mjs —— 領域の宣言なし)。入力のファイルは無い(lib を呼んで作り直す)。
//   1 プロセス。正本は第338便c の settleRun で書く。**第353便t・第353便v の lib を通して仮の値の lib(第352便b)に届く —— 正本の最上位に provisional: true と使った鍵の一覧**(本器の数には使わない)。
//
// ■ 言わないこと: 金星が選ばれた理由・配置を言い当てる表ではない(配置の表と百分位)。交点の周期と向きはノブ(値は未照合)の格子で、DFM の式ではない比べる列。置き方を決めない。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as Z from './lib-w353zc-dirgeo.mjs';
import * as T from './lib-w353t-dirmatch.mjs';
import * as E from './lib-w347e-spintorque.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w353zc-dirgeo-1';
export const OUT_MAIN = 'tests/out/dirgeo-353zc.json';
export const TARGET = 'tests/lib-w353zc-dirgeo.mjs';
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '配置の表と百分位 —— 金星が選ばれた理由・いまの配置を言い当てる表ではない',
  '公転面の交点が回る周期と向きは、リポジトリに数が無い —— ノブ(値は未照合)の格子で、DFM の式ではない比べる列',
  '太陽の位相の走査では公転面は固定・交点の走査では太陽の自転軸は固定(φ は相対の位相だけで決まる)。衛星は太陽の位相の走査でいまの値に固定(近似)',
  '受け手の半径の置き方・衛星の道の面・基準軸は決めない。向きの一致を「いまの配置の量」か「時間の間の量」かは決めない',
  'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない']);
export const PLAN = Object.freeze({
  pure: '零試験 8(第353便t の表 2a と同じ・金星 0.508°・土星 1.66°・φ 0.7606°/閉じた形と数えた φ/1/3 の由来〔平均の数 = 閉じた形の重み・弧の上の厳密な点〕/phiAt と相対の位相/円錐の半頂角と周期/一律の c_R = 第353便t の rankAll・衛星の道 w 0・1 = 第353便t の eq・orb/c_R★/変異と拒否)',
  t1: '表 1 8 惑星の法線の並び(基準軸 L・eq・黄道の極)',
  t1b: '表 1b 1/3 の由来の照合(基準軸 3)',
  t2: '表 2 太陽の自転軸の円錐の位相 0〜360°(3600 点)の 8 惑星の φ(基準軸 L・eq)',
  t3: '表 3 交点を 0〜360° 回したとき(金星・地球・土星・木星)・時間の窓(交点の周期 5 × 向き 2 —— ノブ)',
  t3b: '表 3b n★ の近くに法線が来る見込み(惑星ごと・帽子の見本 3)',
  t4: '表 4 受け手の半径の置き方(全部同じ c_R 7・r × c_R★ 8・C0 × 質量 ÷ 観測半径 8)と金星が 1 番を保つ端',
  t4b: '表 4b 衛星の道の面(母天体の赤道面 → 公転面 11 点)',
});

export function gatesOf(J) {
  const D = Z.DECL, ok = (x) => typeof x === 'number' && Number.isFinite(x);
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 8,
    t1: J.t1.length === D.axes.length && J.t1.every((a) => a.rows.length === D.planets.length && a.rows.every((r) => ok(r.t) && ok(r.sideDeg) && Math.abs(r.ratio - 1.5) < 0.05)),
    t1b: J.t1b.length === D.axes.length && J.t1b.every((r) => Math.abs(r.fracExact - 1 / 3) < 0.01 && r.avgRel < 1e-9),
    t2: J.t2.length === 2 && J.t2.every((a) => a.rows.length === D.planets.length && a.rows.every((r) => r.min <= r.phi0 && r.phi0 <= r.max && r.pct >= 0 && r.pct <= 1)),
    t3: J.t3.nodes.length === 4 && J.t3.nodes.every((r) => r.min <= r.phi0 && ok(r.fracLe)) && J.t3.time.length === 1 + D.nodePeriodsYr.length * D.nodeSenses.length && J.t3.relSame < 1e-9,
    t3b: J.t3b.rows.length === D.planets.length && J.t3b.caps.length === D.capDeg.length,
    t4: J.t4.rows.length === 1 + D.cRUni.length + D.rGrid.length + D.c0Grid.length && J.t4.rows.every((r) => r.venusRank >= 1 && r.venusRank <= 14) && ok(J.t4.edges.uni.at) && ok(J.t4.edges.star.at) && ok(J.t4.edges.mass.at),
    t4b: J.t4b.length === D.moonW.length && J.t4b.every((r) => ok(r.venusOwn) && ok(r.bestMoonOwn)),
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const T1 = E.t1Table(), GEO = E.geometry(), cache = {}; mark('input');
  const PS = Z.pureScenes(T1, GEO), pure = { scenes: PS, gates: Z.pureGates(PS) }; mark('pure');
  const t1 = Z.DECL.axes.map((axis) => ({ axis, rows: Z.table1(T1, GEO, { axis }) })), t1b = Z.table1b(T1, GEO); mark('t1');
  const moonsOwn = Object.fromEntries(T.rankAll(T1, GEO, {}, cache).filter((r) => Z.DECL.moons.includes(r.key)).map((r) => [r.key, r.own]));
  const t2 = ['L', 'eq'].map((axis) => Z.sunScan(T1, GEO, { axis, moonsOwn })); mark('t2');
  const nodes = ['Venus', 'Earth', 'Saturn', 'Jupiter'].map((id) => Z.nodeScan(T1, GEO, { id })), nodesEq = Z.nodeScan(T1, GEO, { axis: 'eq' });
  const t3 = { nodes, nodeEq: nodesEq, time: Z.timeRows(nodes[0]), sunPeriodYr: Z.sunPeriodYr(), relSame: Z.relSame(T1, GEO) }; mark('t3');
  const t3b = Z.chanceRows(T1, GEO); mark('t3b');
  const t4 = Z.placeRows(T1, GEO, cache); mark('t4');
  const t4b = Z.moonPlaneRows(T1, GEO, {}, cache); mark('t4b');
  const J = { pure, t1, t1b, t2, t3, t3b, t4, t4b, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w353zc-dirgeo.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W353ZC_OUT ? (path.isAbsolute(process.env.W353ZC_OUT) ? process.env.W353ZC_OUT : path.join(ROOT, process.env.W353ZC_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第353便zc dirgeo(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { provisional: true, provKeys: [...Z.DECL.provKeys], provMark: '仮・未照合(閉包の lib が使う鍵 —— 本器は値を読まない)',
    version: HARNESS_VERSION, libVersion: Z.LIB_VERSION, generator: 'tests/exp-w353zc-dirgeo.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-25 —— 第151報)・統括の検証項目 R493', decl: Z.DECL, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第353便zc', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'dirgeo', engine: 'Node(html を読まない —— 純関数の lib・第353便t・v・第352便h・k・c・第351便c ほかの lib を呼ぶ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
