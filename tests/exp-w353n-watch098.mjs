// 第353便n(原仮定者の回答(2026-11-25 —— 第151報)「AN1046: C」・統括の検証項目 R478):
//   **注目の列 u = 0.98 での「見ている時間の間は変わらない」の器 —— 表 1 見ている時間 5 × 受け手 9 × 寄る割合 f 3(円錐の半頂角の変化・歳差の位相の進み・
//   公転の極に対する観測の傾きの揺れ)/表 1b 変わらないと言える時間の幅(傾きの変化が 0.1°・1° に達する時間・公転の位相ごとの揺れ)/
//   表 2 重力の側の歳差(比べる列 —— 率は仮の値)と軸引きずりの歳差の 2 つの軸の合成/表 3 応答の側の構造の係数を入れた率・零試験 10**
//   (段 watch098-353n —— 正本 tests/out/watch098-353n.json・lib tests/lib-w353n-watch098.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・既存の lib の本文は変えない。physics の鍵を足さない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w353n-watch098.mjs —— 領域の宣言なし)。入力のファイルは無い(lib を呼んで作り直す)。
//   1 プロセス。正本は第338便c の settleRun で書く。仮の値は第352便b の器の数だけ(表 2 —— 正本の最上位に provisional: true と鍵の一覧)。
//
// ■ 言わないこと: 安定している・保たれた、と結論を書かない(時間と変化の表)。背景の大きさを 0.98 に置いたとは書かない(注目の列)。0.98 を (N+) の窓の内とは書かない。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as N from './lib-w353n-watch098.mjs';
import * as E from './lib-w347e-spintorque.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w353n-watch098-1';
export const OUT_MAIN = 'tests/out/watch098-353n.json';
export const TARGET = 'tests/lib-w353n-watch098.mjs';
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '時間と変化の表 —— 安定している・保たれた、とは書かない。「変わらない」と言えるかは物差し(0.1°・1°)と見ている時間の置き方による',
  '背景の大きさを 0.98 に置いたとは書かない(注目の列)。0.98 は (N+) の窓の上端 0.835 より上 —— 「窓の内」とは書かない',
  '公転の法線は慣性の枠に固定(主)—— 公転面も同じ係数で共回りする列は比べる列',
  '重力の側の歳差は比べる列(DFM の式ではない)・その率は仮の値(未照合)—— 合否にしない。平均した形の式は候補の式(刻みの步で照らす)',
  '応答の側の構造の係数は第353便c の (P-応) の倍(文献の慣性モーメントの係数 —— 未照合)を率に掛けた列',
  'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない']);
export const PLAN = Object.freeze({
  pure: '零試験 10(統括の数え直し 3 と第353便e の共通の点検の数・第353便b の mainState と同じ合成と步・一周の幅 = coneRange・χ の閉じた形・達する時間・位相ごとの步・2 つの軸の閉じた形と平均した形と共回り・率の倍・仮の値・拒否)',
  t1: '表 1: 受け手 9 × f 3 × 見ている時間 5((g2−) が主・揺れの幅は (g2+) も)',
  t1b: '表 1b: 受け手 9 × f 3 —— ε の変化が 0.1°・1° に達する時間((g2−)・(g2+))・χ の変化が 0.1°・1° に達する時間・一周の幅・公転の位相ごとの揺れ',
  t2: '表 2: 地球・火星 × 歳差の向き 2 × f 3 —— 2 つの軸の合成(閉じた形・照らしの步・共回り・平均した形)',
  t3: '表 3: 受け手 9 × R_ref 2 —— 率の倍・一周・周の数・f の上限・ε が 0.1° 変わる時間',
});
export const PROV_KEYS = Object.freeze(N.DECL.provKeys.slice().sort());

export function gatesOf(J) {
  const D = N.DECL, nf = D.fGrid.length;
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 10,
    t1: J.t1.length === D.keys.length * nf * D.windowsYr.length && J.t1.filter((r) => r.f === 0).every((r) => r.dChiDeg === 0) && J.t1.every((r) => Number.isFinite(r.swingDeg)),
    t1b: J.t1b.length === D.keys.length * nf && J.t1b.filter((r) => r.key === 'Sun|-' && r.f === 0).every((r) => r.tEps.g2m[0] === null && r.cone.swingDeg < 1e-9),
    t2: J.t2.length === D.gravBodies.length * D.senses.length * nf && J.t2.every((r) => r.provisional === true && r.coSwingDeg < 1e-9) && J.t2.filter((r) => r.f === 0).every((r) => r.stepVsClosedDeg < 1e-6),
    t3: J.t3.length === D.keys.length * D.refs.length && J.t3.filter((r) => r.ref === 'obs').every((r) => r.mult > 1),
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const T1 = E.t1Table(), GEO = E.geometry(), cache = {}; mark('input');
  const PS = N.pureScenes(T1, GEO), pure = { scenes: PS, gates: N.pureGates(PS) }; mark('pure');
  const fGrid = N.fGridNum(T1, GEO, cache);
  const t1 = N.table1Rows(T1, GEO, cache); mark('t1');
  const t1b = N.table1bRows(T1, GEO, cache); mark('t1b');
  const t2 = N.table2Rows(T1, GEO, cache); mark('t2');
  const t3 = N.table3Rows(T1, GEO, cache); mark('t3');
  const J = { pure, fGrid, t1, t1b, t2, t3, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w353n-watch098.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W353N_OUT ? (path.isAbsolute(process.env.W353N_OUT) ? process.env.W353N_OUT : path.join(ROOT, process.env.W353N_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第353便n watch098(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: N.LIB_VERSION, generator: 'tests/exp-w353n-watch098.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-25 —— 第151報)・統括の検証項目 R478', provisional: true, provKeys: PROV_KEYS.slice(), provMark: '仮・未照合',
    decl: N.DECL, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第353便n', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'watch098', engine: 'Node(html を読まない —— 純関数の lib・第353便e・b・c・第352便w・l・i・c・b・第351便d の lib を呼ぶ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
