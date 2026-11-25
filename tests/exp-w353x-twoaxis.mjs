// 第353便x(原仮定者の回答(2026-11-25 —— 第151報)「AN1046: C」「AN1052: イ」・統括の検証項目 R488):
//   **2 つの軸(重力の側の歳差 —— 比べる列・DFM の式ではない —— と軸引きずりの歳差)を金星・天王星・火星ほかで数え、公転面が背景に応える係数の比 c_輪 ÷ c を振る器 ——
//   表 1 天体 6 × 重力の側の率の列 3 × 歳差の向き 2/表 2 天体 6 × c_輪 ÷ c(主 6 + 共回りの近く 5)/表 2b c_輪 ÷ c の帯(見ている時間 3 × 列 2)/
//   表 3 見ている時間 3 × 受け手 9 × 列 3(軸引きずりだけ・2 つの軸・共回り)・零試験 10**
//   (段 twoaxis-353x —— 正本 tests/out/twoaxis-353x.json・lib tests/lib-w353x-twoaxis.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・既存の lib の本文は変えない。physics の鍵を足さない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w353x-twoaxis.mjs —— 領域の宣言なし)。入力のファイルは無い(lib を呼んで作り直す)。
//   1 プロセス。正本は第338便c の settleRun で書く。仮の値は第352便b の器の数だけ(正本の最上位に provisional: true と鍵の一覧・行に印)。
//
// ■ 言わないこと: 傾きが安定している・保たれた、と結論を書かない(幅の表)。重力の側の列は比べる列(DFM の式ではない)。仮の値は合否に使わない。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as X from './lib-w353x-twoaxis.mjs';
import * as E from './lib-w347e-spintorque.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w353x-twoaxis-1';
export const OUT_MAIN = 'tests/out/twoaxis-353x.json';
export const TARGET = 'tests/lib-w353x-twoaxis.mjs';
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '幅の表 —— 傾きが安定している・保たれた、とは書かない。「変わらない」と言えるかは物差し(0.1°)と見ている時間の置き方による',
  '重力の側の歳差は比べる列(DFM の式ではない)。率は 仮の値(未照合・印)/重力の側の潮汐のトルクの列/地球の月の道の 18.6 年の平均の列 —— 合否にしない',
  '天王星・海王星・水星・木星・土星の重力の側の列は太陽だけ(衛星の分なし)—— 列の作り方の限り',
  'c_輪 ÷ c は公転面が背景に応える係数の比のノブ(値は未照合 —— 格子で振る)。閉じた形は f 0・一定の Ω の候補の式(刻みの步で照らす)',
  '0.98 は注目の列(背景の大きさを 0.98 に置いたとは書かない・(N+) の窓の内とは書かない)',
  'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない']);
export const PLAN = Object.freeze({
  pure: '零試験 10(共通の点検の数・第353便n の表(地球 3.157° → 3.63e-4°・火星 3.358° → 2.56e-3°)・刻みの步 = 第353便n の fixed・co・c_輪 ÷ c の閉じた形・軸引きずりだけの幅と一周・金星の回り・潮汐の列 = 第353便f・月の道の平均 = 第353便m・公転面が寄る f_輪 の下限・断熱の不変量・拒否)',
  t1: '表 1: 天体 6 × 重力の側の率の列(仮の値・潮汐のトルク・月の道の平均 —— 在るもの)× 歳差の向き 2 —— 合成の軸の傾き・回り・ε の幅・照らしの步・平均した形の縮み',
  t2: '表 2: 天体 6(潮汐の列)× c_輪 ÷ c 11 —— 2 つの軸の ε の幅・軸引きずりだけの幅と一周と年齢の内の変化・公転面が寄る f_輪 の下限と輪の動き',
  t2b: '表 2b: 天体 6 × 見ている時間 3 × 列 2 —— ε の変化が 0.1° 以下の c_輪 ÷ c の帯と、公転面が寄る下限との重なり',
  t3: '表 3: 受け手 9 × 見ている時間 3 —— 軸引きずりだけ/2 つの軸(潮汐の列・仮の値の列)/共回り の ε の変化',
});
export const PROV_KEYS = Object.freeze(X.DECL.provKeys.slice().sort());

export function gatesOf(J) {
  const D = X.DECL;
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 10,
    t1: J.t1.length === 20 && J.t1.every((r) => r.stepErrRel < 1e-4 && Number.isFinite(r.combSwingDeg)) && J.t1.filter((r) => r.kind === 'prov').every((r) => r.provisional === true && r.provKeys.length === 2)
      && J.t1.filter((r) => r.key === 'Venus|Sun').every((r) => r.signG === 1),
    t2: J.t2.length === D.t1Keys.length * (D.kappas.length + D.kappasNear.length) && J.t2.filter((r) => r.kRing === 1).every((r) => r.twoSwingDeg < 1e-9 && r.dragSwingDeg < 1e-9)
      && J.t2.filter((r) => r.main && r.kRing !== 1).every((r) => Math.abs(r.stepSwingDeg / r.twoSwingDeg - 1) < 1e-4),
    t2b: J.t2b.length === D.t1Keys.length * D.windowsYr.length * 2 && J.t2b.every((r) => r.lo <= 1 && (r.hiOpen || r.hi >= 1)),
    t3: J.t3.length === D.keys.length * D.windowsYr.length && J.t3.every((r) => r.coDeg < 1e-9) && J.t3.filter((r) => r.key === 'Sun|-').every((r) => r.twoDeg === null),
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const T1 = E.t1Table(), GEO = E.geometry(), cache = {}; mark('input');
  const PS = X.pureScenes(T1, GEO), pure = { scenes: PS, gates: X.pureGates(PS) }; mark('pure');
  const fMin = X.fMinOf(T1, GEO, cache), ring = X.ringNeed(1);
  const t1 = X.table1Rows(T1, GEO, cache); mark('t1');
  const t2 = X.table2Rows(T1, GEO, cache); mark('t2');
  const t2b = X.table2bRows(T1, GEO, cache); mark('t2b');
  const t3 = X.table3Rows(T1, GEO, cache); mark('t3');
  const J = { pure, fMin, ring, t1, t2, t2b, t3, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w353x-twoaxis.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W353X_OUT ? (path.isAbsolute(process.env.W353X_OUT) ? process.env.W353X_OUT : path.join(ROOT, process.env.W353X_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第353便x twoaxis(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: X.LIB_VERSION, generator: 'tests/exp-w353x-twoaxis.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-25 —— 第151報)・統括の検証項目 R488', provisional: true, provKeys: PROV_KEYS.slice(), provMark: '仮・未照合',
    decl: X.DECL, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第353便x', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'twoaxis', engine: 'Node(html を読まない —— 純関数の lib・第353便n・f・m・e・第352便u・w・l・i・c・b・第351便d の lib を呼ぶ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
