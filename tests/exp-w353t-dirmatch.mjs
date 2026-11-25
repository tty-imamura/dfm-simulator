// 第353便t(原仮定者の回答(2026-11-25 —— 第151報)・統括の検証項目 R484):
//   **「金星で釣り合う」を選び出す量の候補 —— 背景の大きさに依らない「向きの一致」2 sin(φ/2) の器 ——
//   表 1a 置き方の組 180 の金星の順位・表 1b 14 の受け手 × 列 7・表 1c 金星が 1 番を保つ c_R の上端・表 2a 8 惑星の幾何(閉じた形と n★)・
//   表 2b 金星の公転の法線を回したとき・表 2c 基準軸の定義と金星の φ・表 3 成分 S・M・MS × 背景の向き・表 3b (MS) + (N−) の φ・零試験 8**
//   (段 dirmatch-353t —— 正本 tests/out/dirmatch-353t.json・lib tests/lib-w353t-dirmatch.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・既存の lib の本文は変えない。physics の鍵を足さない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w353t-dirmatch.mjs —— 領域の宣言なし)。入力のファイルは無い(lib を呼んで作り直す)。
//   1 プロセス。正本は第338便c の settleRun で書く。**第353便l の lib(→ 第353便g の lib)を通して仮の値の lib(第352便b)に届く —— 正本の最上位に provisional: true と使った鍵の一覧**(本器の数には使わない)。
//
// ■ 言わないこと: 金星が釣り合っている・金星が選ばれた理由を言い当てる表ではない(順位の表)。(M)・(MS)・(N−) は比べる列。置き方を決めない。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as Z from './lib-w353t-dirmatch.mjs';
import * as E from './lib-w347e-spintorque.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w353t-dirmatch-1';
export const OUT_MAIN = 'tests/out/dirmatch-353t.json';
export const TARGET = 'tests/lib-w353t-dirmatch.mjs';
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '順位の表 —— 金星が釣り合っている・金星が選ばれた理由を言い当てる表ではない',
  '「金星で釣り合う」を選び出す量(大きさの一致・向きの一致)は決めない —— 2 つを並べた',
  '受け手の半径・源の半径・源の扁平・衛星の置き方・基準軸は決めない。(M)・(MS)・背景の向き (N−) は比べる列',
  '衛星の円の道は近似(母天体の赤道の面か公転の面の円・太陽由来は母天体の位置と速さの値で代える)。扁平率の無い源はノブ 0.1(値は未照合)',
  'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない']);
export const PLAN = Object.freeze({
  pure: '零試験 8(第353便l の 14 の受け手の own・φ と同じ・金星 0.013274・土星 0.0436/第353便c の cancelOf と同じ・統括の数え直し 3 の c_R/第353便d の obCancel・第353便p の localStd と同じ/円の道の衛星が第353便l と同じ/基準軸 L/閉じた形と (M) ÷ (S)/変異/拒否)',
  t1a: '表 1a 置き方の組 180(基準軸 3 × 源の半径 2 × 受け手の半径 5 × 源の扁平 2 × 衛星の置き方 3)の金星の順位と 1 番・2 番',
  t1b: '表 1b 14 の受け手 × 列 7(受け手の半径 4・衛星の置き方 2・源の扁平 1)の φ・own・順位',
  t1c: '表 1c 金星が 1 番を保つ c_R の上端(基準軸 3 × 源の半径 2)',
  t2a: '表 2a 8 惑星の幾何: 数えた φ・閉じた形・小さい角の形・太陽の自転軸と公転の法線と基準軸の角・n★ からの角',
  t2b: '表 2b 金星の公転の法線を回す(δ 5 × 方位 12・基準軸のまわりの ψ)× 基準軸 3',
  t2c: '表 2c 基準軸の定義(L・eq・ecl・La・金星を外した L・金星の重み 2 倍・L と eq の間 5)と金星の φ',
  t3: '表 3 成分 3 × 背景の向き 2 の順位と金星の打ち消し・(uV) のままの (L2)・表 3b (MS) + (N−) の φ',
});

export function gatesOf(J) {
  const D = Z.DECL, ok = (x) => typeof x === 'number' && Number.isFinite(x);
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 8,
    t1a: J.t1a.length === D.axes.length * D.tSrcs.length * D.recvCols.length * D.obs.length * D.moonAxes.length && J.t1a.every((r) => ok(r.venusOwn) && r.venusRank >= 1 && r.venusRank <= 14) && J.t1sum.keep + J.t1sum.lose === J.t1a.length,
    t1b: J.t1b.length === D.recvs.length && J.t1b.every((r) => ok(r.own_rule) && ok(r.own_f1) && ok(r.own_mOrb)),
    t1c: J.t1c.length === D.axes.length * D.tSrcs.length && J.t1c.every((r) => ok(r.cRcross) && r.cRcross > 0.0128 && r.cRcross < 1),
    t2a: J.t2a.length === D.planets.length && J.t2a.every((r) => Math.abs(r.phiNum - r.phiClosed) < 0.05),
    t2b: J.t2b.length === D.axes.length && J.t2b.every((r) => r.tilt.rows.length === D.tiltDeg.length && r.tilt.phiMin < 1e-3 && ok(r.turn.psiMin)),
    t2c: J.t2c.length === 11 && J.t2c.every((r) => ok(r.phiDeg)),
    t3: J.t3.length === D.parts.length * D.bgs.length && J.t3.every((r) => ok(r.venusOwn) && r.order.length === 14) && J.t3b.length === D.planets.length,
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const T1 = E.t1Table(), GEO = E.geometry(), cache = {}; mark('input');
  const PS = Z.pureScenes(T1, GEO), pure = { scenes: PS, gates: Z.pureGates(PS) }; mark('pure');
  const t1a = Z.table1(T1, GEO, cache), t1sum = Z.table1Sum(t1a); mark('t1a');
  const t1b = Z.table1b(T1, GEO, cache); mark('t1b');
  const t1c = Z.table1c(T1, GEO, cache); mark('t1c');
  const t2a = Z.table2a(T1, GEO, cache); mark('t2a');
  const t2b = Z.table2b(T1, GEO); mark('t2b');
  const t2c = Z.axisRows(T1, GEO, {}, cache); mark('t2c');
  const t3 = Z.table3(T1, GEO, cache), t3b = Z.table3b(T1, GEO, cache), pg = Z.partGeom(T1, GEO, {}, cache); mark('t3');
  const J = { pure, t1a, t1sum, t1b, t1c, t2a, t2b, t2c, t3, t3b, partGeom: pg, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w353t-dirmatch.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W353T_OUT ? (path.isAbsolute(process.env.W353T_OUT) ? process.env.W353T_OUT : path.join(ROOT, process.env.W353T_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第353便t dirmatch(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { provisional: true, provKeys: [...Z.DECL.provKeys], provMark: '仮・未照合',
    version: HARNESS_VERSION, libVersion: Z.LIB_VERSION, generator: 'tests/exp-w353t-dirmatch.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-25 —— 第151報)・統括の検証項目 R484', decl: Z.DECL, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第353便t', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'dirmatch', engine: 'Node(html を読まない —— 純関数の lib・第353便l・c・d・p・第352便h・k・c・第351便c ほかの lib を呼ぶ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
