// 第341便g(原仮定者の補足(2026-11-18 —— 第141報)「冥王星とカロンは、引きずりの影響が少ない、理想的な連星」・原仮定者の指示(2026-11-11 —— 第135報)・統括の検証項目 R370):
//   **冥王星とカロンを候補の型の対照の表にする器**(段 plutocontrol-341g —— 正本 tests/out/plutocontrol-341g.json・lib tests/lib-w341g-plutocontrol.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・第340便までの lib の本文は変えない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w341g-plutocontrol.mjs —— 領域の宣言なし)・入力のファイルは無い(リポジトリの中の値は lib に写した)。1 プロセス。
//
// ■ 走らせたノブの格子と判定の物差し(正本の先頭 —— 式の形の宣言ではなく、何を測ったかの記録)
//   T1: 7 系 × 項 6((i) 外の取り分・(i) 外の並進引きずりの 2 体の間の差・(ii) 相互の部位差分〔円・同期〕と〔系の離心率〕・(iii) 外の源の部位差分・(v) G_loc の型の残差)の指数
//     (÷ n・速度は ÷ n a)と、小さい方からの順位。物差し: なし(順位は記録 —— 「少ない」の判定に使わない)。
//   T2: 9 天体 × 帯の半幅 3(🛟 の型の太陽の R_eq・太陽の半径・0.1 AU)× 時間の標本 7200 —— 太陽の赤道面と不変面に対する傾き・帯の外の時間の割合・🛟 の型の場が掛かる時間の割合と大きさ。
//   T3: 冥王星–カロンの段 (1)〜(4) —— 段ごとの候補の型の大きさ(÷ n)と、入力の相対の差(定義の差 +7.216805 s ÷ P・σ 0.02592 s ÷ P)の大小。二体の RK4 の刻み 360・720・1440・2880 步。
//   T4: 係数 1・0.5 × 置き方 (a)(b) × 系 2(冥王星–カロン・地球–月)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w341g-plutocontrol.mjs';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w341g-plutocontrol-1';
export const AMEND = Object.freeze([]);
export const OUT_MAIN = 'tests/out/plutocontrol-341g.json';
export const TARGET = 'tests/lib-w341g-plutocontrol.mjs';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
export const NOT_CLAIM = Object.freeze(['冥王星とカロンが合ったとは書かない(掲載の 🥶・🟪 は較正が保留のまま)', '引きずりが無いと確かめたとは書かない(項ごとの大きさの表 —— 外の寄与を初めから 0 と置かない)',
  '理想的な連星であることが導けたとは書かない(補足 3 は原仮定者の補足として引く)', '入力の定義の差(+7.216805 s)を引きずりの係数・ノブに吸収しない(AN807)',
  '順位は記録 —— 「少ない」の判定には使わない', '🛟 の型を冥王星に当てた数は探索用の型での数', '文献の値は未照合(行の出どころを書く)']);
export const PLAN = Object.freeze({ systems: Object.freeze(['plutoCharon', 'earthMoon', 'jupiterIo', 'saturnTitan', 'sunMercury', 'sunVenus', 'j0737']), t1Cols: L.T1_COLS });

export function gatesOf(J) {
  const t1 = J.t1, t2 = J.t2, t3 = J.t3;
  const pc = t1.rows.find((r) => r.key === 'plutoCharon');
  return {
    pure: Object.values(J.pure.gates).every(Boolean),
    t1Complete: t1.rows.length === PLAN.systems.length && t1.rows.every((r) => L.T1_COLS.every((c) => fin(r.idx[c]) && r.idx[c] >= 0)),
    lockZero: pc.idx.mutAxCirc === 0 && pc.sync.circ === 0 && pc.mutCirc.maxRotMismatchOverN === 0,
    nonLockNonZero: t1.rows.filter((r) => !r.mutualLock).every((r) => r.idx.mutAxCirc > 0),
    t2Complete: t2.rows.length === 9 && t2.rows.every((r) => fin(r.incSunDeg) && fin(r.incInvDeg) && L.DECL.t2Bands.every((b) => fin(r.outside[b]) && r.outside[b] >= 0 && r.outside[b] <= 1)),
    conv: t3.st1.conv.every((c, i, a) => i === 0 || Math.abs(c.relErr) <= Math.abs(a[i - 1].relErr)) && Math.abs(t3.st1.conv[t3.st1.conv.length - 1].relErr) <= 1e-11,
    split: Math.abs(t3.st2.split.total - L.DECL.defDiffS) <= 1e-6 && Math.abs(t3.st2.split.aPart + t3.st2.split.gmPart - t3.st2.split.total) <= 1e-6,
    t4: J.t4.pts.length === 8,
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const t1 = L.t1Table(); mark('t1');
  const t2 = L.t2Table(); mark('t2');
  const t3 = L.t3Table(); mark('t3');
  const t4 = L.t4Table(t1); mark('t4');
  const J = { pure, t1, t2, t3, t4, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}
/** 正本へ書く形(第338便c の settleRun) */
export function runSettled() {
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const { gates, ok, ...rest } = S.value;
  return { J: Object.assign(rest, { timing: tm, gates, ok }), recheck: S.meta };
}
const writeJson = (OUT, out) => { fs.mkdirSync(path.dirname(OUT), { recursive: true }); fs.writeFileSync(OUT, JSON.stringify(out, null, 1).replace(/\[\s*(-?[\d.eE+-]+(?:,\s*-?[\d.eE+-]+|,\s*null)*)\s*\]/g, (m, a) => '[' + a.replace(/\s+/g, '') + ']') + '\n'); };
export const CODE = Object.freeze(['tests/exp-w341g-plutocontrol.mjs', 'tests/lib-w341g-plutocontrol.mjs', 'tests/lib-w340b-axialsplit.mjs', 'tests/lib-w334d-binarylaw.mjs', 'tests/lib-w331c-k1scale.mjs',
  'tests/lib-w340e-lightweight.mjs', 'tests/lib-w340h-thin.mjs', 'tests/lib-w337l-bevel.mjs', 'tests/lib-w337j-spinorbit.mjs', 'tests/lib-w337c-tidelock.mjs', 'tests/lib-w337i-rotring.mjs',
  'tests/lib-w272e-provenance.mjs', 'tests/lib-w338c-recheck.mjs']);
export async function main() {
  const t0 = Date.now();
  const OUT = process.env.W341G_OUT ? (path.isAbsolute(process.env.W341G_OUT) ? process.env.W341G_OUT : path.join(ROOT, process.env.W341G_OUT)) : path.join(ROOT, OUT_MAIN);
  console.log('第341便g plutocontrol(版 ' + HARNESS_VERSION + ')');
  const { J: R, recheck } = runSettled();
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w341g-plutocontrol.mjs', target: TARGET,
    ruling: '原仮定者の補足(2026-11-18 —— 第141報)「冥王星は、太陽から遠く、斜め軌道で赤道面から離れる期間が長く、カロンと互いに潮汐ロックしている。冥王星とカロンは、引きずりの影響が少ない、理想的な連星」・原仮定者の指示(2026-11-11 —— 第135報)「冥王星とカロンが、連星のヒントになると想定」・統括の検証項目 R370',
    decl: L.DECL, lit: L.LIT, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第341便g', target: TARGET, code: CODE, inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'plutocontrol', engine: 'Node の純関数だけ(html を読まない・エンジンの步を進めない —— 二体の RK4 は自前)', notClaim: NOT_CLAIM, recheck });
  writeJson(OUT, out);
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();
