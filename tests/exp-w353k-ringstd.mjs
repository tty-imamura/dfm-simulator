// 第353便k(原仮定者の回答(2026-11-25 —— 第151報)AN1045・統括の検証項目 R475):
//   **回答の基準(引きずる側 = 規則の半径 + 扁平率・引きずられる側 = 観測半径 × 構造の係数のノブ)で作った円盤引きずりの側の輪の場の器 ——
//   表 1 土星の環(区分 5 × 傾き 1° × 置き方の組 9)・表 2 受け手の自分の重み(粒子の大きさ 4 × c_R 4)・表 3 公転面の集まり(8 惑星 × 置き方の組 6)・零試験 9**
//   (段 ringstd-353k —— 正本 tests/out/ringstd-353k.json・lib tests/lib-w353k-ringstd.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・既存の lib の本文は変えない。physics の鍵を足さない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w353k-ringstd.mjs —— 領域の宣言なし)。入力のファイルは無い。
//   1 プロセス。正本は第338便c の settleRun で書く。仮の値の lib は使わない(閉包に入らない)。
//
// ■ 言わないこと: 環の傾きの答え・円盤引きずりの型とは書かない。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w353k-ringstd.mjs';
import * as E from './lib-w347e-spintorque.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w353k-ringstd-1';
export const OUT_MAIN = 'tests/out/ringstd-353k.json';
export const TARGET = 'tests/lib-w353k-ringstd.mjs';
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '候補の表 —— 環の傾きの答えとは書かない。円盤引きずりの型を決めていない(これまでの節に在る場の作りの、源の半径・源の扁平・受け手の自分の重みを引数にしただけ)',
  '粒子の大きさ・密度・構造の係数 c_R はノブ(値は未照合)の格子 —— 環の粒子の大きさの観測の値ではない',
  '環の物差し(1e7 年で傾きが e 分の 1)と公転面の物差し(30° → 7° の 23°)は文献の値・未照合の比べる列(合わせない)',
  '〔第353便h〕の円盤引きずりの側の (C2)・軸引きずりの (S) の 2 列・源 観測 + 受け手 観測は比べる列(第151報の回答の基準は源 = 規則の半径 + 扁平率・受け手 = 観測半径 × 構造の係数)',
  'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない']);
export const PLAN = Object.freeze({
  pure: '零試験 9(〔第353便h〕の diskRow・axialRow と同じ数・〔第353便h〕の比べる数 0.809・11.4〜88.6・1.04e-13・〔第352便s〕の ringRot と同じ数・〔第352便za〕の公転面の題と同じ数・(O2b) の倍 σ・共通の点検の数・閉じた形 a★・拒否)',
  t1: '表 1: 土星の環 区分 5 × 置き方の組 9(主の列 5 + 比べる列 4)の率 ÷ 物差し・物差しに届くのに要る倍',
  t1dir: '表 1 の補い: B 環の向き(輪の回転と輪の法線の cos)と読み (C1)',
  t1ob: '表 1 の補い: (O1) ÷ (O0) − 1 を受け手の置き方 3 つで(F2)',
  t2: '表 2: 受け手の自分の重み —— 粒子の大きさ 4 × c_R 4(B 環・源 = 規則の半径・球)と、自分の重みが源の重みと同じになる大きさ a★・規則の半径と同じ重みになる c_R・格子の外の大きさの走査',
  t3: '表 3: 公転面の集まり —— 8 惑星 × 置き方の組 6(源 = 太陽・輪の法線 = 基準軸 L・受け手 = 惑星そのもの)',
});
export const SWEEP = Object.freeze([1e3, 1e5, 1e6, 1e7, 3e7, 1e8]);

export function gatesOf(J) {
  const D = L.DECL;
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 9,
    t1: J.t1.length === D.centers.length && J.t1.every((r) => Object.keys(r.yard).length === L.T1COLS.length && Object.values(r.yard).every((v) => Number.isFinite(v) && v > 0)),
    t1ob: J.t1ob.length === D.centers.length && J.t1ob.every((r) => Math.abs(r.std) < 1e-9 && r.h353 > 0),
    t2: J.t2.rows.length === D.sizes.length * D.cRs.length && J.t2.rows.every((r) => r.A0OverWS < 1e-6) && J.t2.sweep.length === SWEEP.length,
    t3: J.t3.length === D.planePlanets.length && J.t3.every((r) => L.T3COLS.every((c) => Number.isFinite(r.v[c]) && r.v[c] > 0)),
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const T1 = E.t1Table(), GEO = E.geometry(); mark('input');
  const PS = L.pureScenes(T1, GEO), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const t1 = L.DECL.centers.map((k) => L.t1Row(T1, GEO, k)); mark('t1');
  const pick = (d) => ({ yard: d.yard, cos: d.cos, A0OverWS: d.A0OverWS });
  const t1dir = [['std', 'rule', { kind: 'obs', a: 1, cR: 1 }], ['h353C2', 'obs', { kind: 'rule' }], ['ruleRule', 'rule', { kind: 'rule' }], ['obsObs', 'obs', { kind: 'obs', a: 1, cR: 1 }]]
    .map(([id, src, recv]) => ({ id, C2: pick(L.diskStd('ringB', { src, recv })), C1: pick(L.diskStd('ringB', { src, recv, read: 'C1' })) })); mark('t1dir');
  const obR = (key, src, recv) => L.diskStd(key, { src, recv, ob: 'O1' }).yard / L.diskStd(key, { src, recv, ob: 'O0' }).yard - 1;
  const t1ob = L.DECL.centers.map((key) => ({ key, std: obR(key, 'rule', L.DECL.recvMain), h353: obR(key, 'obs', { kind: 'rule' }), obsObs: obR(key, 'obs', L.DECL.recvMain) })); mark('t1ob');
  const t2 = { rows: L.t2Rows(T1, GEO), aStar: L.DECL.cRs.map((cR) => ({ cR, a: L.aStar('ringB', cR) })), cRRule: L.DECL.sizes.map((a) => ({ a, cR: L.cRRuleEq(a) })),
    sweep: SWEEP.map((a) => ({ a, ...pick(L.diskStd('ringB', { recv: { kind: 'obs', a, cR: 1 } })) })) }; mark('t2');
  const t3 = L.t3Rows(T1, GEO); mark('t3');
  const J = { pure, t1, t1dir, t1ob, t2, t3, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w353k-ringstd.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W353K_OUT ? (path.isAbsolute(process.env.W353K_OUT) ? process.env.W353K_OUT : path.join(ROOT, process.env.W353K_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第353便k ringstd(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w353k-ringstd.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-25 —— 第151報)・統括の検証項目 R475', decl: L.DECL, cols: L.T1COLS, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第353便k', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'ringstd', engine: 'Node(html を読まない —— 純関数の lib・第353便h・d・c・第352便s・k・za・c・第351便j・c ほかの lib を呼ぶ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
