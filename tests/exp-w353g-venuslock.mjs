// 第353便g(原仮定者の回答(2026-11-25 —— 第151報)・統括の検証項目 R471):
//   **「金星の自転がロックした状態」の判定の量の候補と、地球の影響の大きさの器 —— 表 0 残りの列・表 1 大きさの比べ(地球の作用 ÷ 残り)・
//   表 2 共鳴の幅といまの周期・捕まる範囲(振り子の形の步)・表 3 釣り合いが外れたとき・零試験 10**
//   (段 venuslock-353g —— 正本 tests/out/venuslock-353g.json・lib tests/lib-w353g-venuslock.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・既存の lib の本文は変えない。physics の鍵を足さない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w353g-venuslock.mjs —— 領域の宣言なし)。入力のファイルは無い(lib を呼んで作り直す)。
//   1 プロセス。正本は第338便c の settleRun で書く。**仮の値の lib(第352便b)を使う —— 正本の最上位に provisional: true と使った鍵の一覧**。
//
// ■ 言わないこと: 金星はロックしている・逆回転の原因・共鳴しているとは書かない(判定の量の候補の表)。(E-g)・(E-潮) は比べる列(DFM の式ではない)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as Z from './lib-w353g-venuslock.mjs';
import * as E from './lib-w347e-spintorque.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w353g-venuslock-1';
export const OUT_MAIN = 'tests/out/venuslock-353g.json';
export const TARGET = 'tests/lib-w353g-venuslock.mjs';
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '判定の量の候補の表 —— 金星はロックしている・逆回転の原因・共鳴しているとは書かない(原仮定者の文として引くときだけ)',
  '(E-g) 地球の重力が金星の形の軸対称でない分に及ぼすトルクと (E-潮) 太陽の重力の潮汐のトルクの列は比べる列(DFM の式ではない)',
  '(B − A)/C はリポジトリに無い量 —— ノブ(値は未照合)の格子 1e-7・1e-6・1e-5。どれにも寄せていない',
  '金星の自転周期 243.0226 日は仮の値(仮・未照合 —— 第352便b の台帳)。(L1)(L3) といまのずれの列は印つき。較正の合否・サンプルの状況・ノブの採否に入れない',
  '(E-g) の模型は同じ面の円の道の 2 次元(金星の公転面)—— 離心率と軌道の傾きは入れていない',
  'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない']);
export const PLAN = Object.freeze({
  pure: '零試験 10(基準軸 L・(uV)・φ と残り 0.013274・(N+) eq 1.0%・閉じた形 = 和・(L1) 0.513°/共鳴の周期で 0/243.167 日/−0.144 日・(E-g) の平均の刻みと周期性・振り子の步の小振幅の周期と捕まる条件・呼ぶ lib と同じ・変異・拒否)',
  t0: '表 0 残りの列: 基準軸 2 × 大きさ 3',
  t1: '表 1 大きさの比べ: 候補 11 × 大きさ 3(基準軸 L)',
  t2: '表 2 共鳴の幅: (B − A)/C 3 + 捕まる範囲 3 × (ν₀ の格子 5 + いまのずれ)',
  t3: '表 3 釣り合いが外れたとき: 基準軸 2',
});

export function gatesOf(J) {
  const D = Z.DECL;
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 10,
    t0: J.t0.length === D.axes.length * D.mags.length && J.t0.filter((r) => r.magId === 'uV' && r.axis === 'L').every((r) => Math.abs(r.L2 - 0.013274) < 5e-7),
    t1: J.t1.length === 5 + 2 * D.qGrid.length && J.t1.every((r) => D.mags.every((m) => Number.isFinite(r['over_' + m.id]) && r['over_' + m.id] > 0)),
    t2: J.t2.length === D.qGrid.length && J.cap.length === D.qGrid.length * (D.nuGrid.length + 1) && J.cap.every((r) => r.agree === r.n - r.near),
    t3: J.t3.length === D.axes.length && J.t3.every((r) => r.gain > 1),
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const T1 = E.t1Table(), GEO = E.geometry(), cache = {}; mark('input');
  const PS = Z.pureScenes(T1, GEO), pure = { scenes: PS, gates: Z.pureGates(PS) }; mark('pure');
  const zz = Z.zAvg(T1, GEO), lock = Z.lockPhase(), earth = Z.earthDrag(T1, GEO, cache), tide = Z.sunTide(T1, GEO);
  const t0r = Z.resRows(T1, GEO, cache); mark('t0');
  const t1 = Z.ratioRows(T1, GEO, cache, zz); mark('t1');
  const t2 = Z.widthRows(T1, GEO, zz), cap = Z.captureRows(T1, GEO, zz); mark('t2');
  const t3 = Z.offRows(T1, GEO, cache); mark('t3');
  const J = { pure, z: zz, lock, earth, tide, t0: t0r, t1, t2, cap, t3, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w353g-venuslock.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W353G_OUT ? (path.isAbsolute(process.env.W353G_OUT) ? process.env.W353G_OUT : path.join(ROOT, process.env.W353G_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第353便g venuslock(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { provisional: true, provKeys: [...Z.DECL.provKeys], provMark: '仮・未照合',
    version: HARNESS_VERSION, libVersion: Z.LIB_VERSION, generator: 'tests/exp-w353g-venuslock.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-25 —— 第151報)・統括の検証項目 R471', decl: Z.DECL, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第353便g', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'venuslock', engine: 'Node(html を読まない —— 純関数の lib・第352便k・c・d・h・u・b・第351便c・第337便c の lib を呼ぶ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
