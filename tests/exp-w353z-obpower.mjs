// 第353便z(原仮定者の回答(2026-11-25 —— 第151報)AN1045・AN1039・統括の検証項目 R490):
//   **源の扁平率の入れ方を「冪の指数 n」(母天体由来の (S) に掛ける倍 σ_n = (1 − f)^(−n/3))で振る器 ——
//   表 1 イオ ← 木星の n の走査・n★(x = 1 の n)と入力の幅・置き方/表 2 (S) の冪と読み替えの候補の n/表 3 同じ n をほかの題に(ガリレオ衛星とタイタン・土星の環・公転面の集まり・金星・0.98 の列)**
//   (段 obpower-353z —— 正本 tests/out/obpower-353z.json・lib tests/lib-w353z-obpower.mjs)。
//   **診断だけ** —— 扁平率の式・n の値は決めない(1 組の照合 —— 候補の表)。エンジン・内蔵の本・受理器・前の便の lib の本文と正本と段は変えない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w353z-obpower.mjs —— 領域の宣言なし)。入力のファイルなし。1 プロセス。正本は第338便c の settleRun で書く。仮の値は使わない。
//
// ■ 探索の方針(第138報): 式の形は走行の前に決め打ちしない —— 正本の先頭(decl・plan)は、走らせたノブの格子と判定の物差しの記録。
// ■ 判定の物差し(零試験 9): 統括の数え直し 4 の数・第353便d の obCancel・第353便p の (ii) の列・入力を振らない内訳の恒等・冪の閉じた形・第353便k の O2b の列・第353便l の φ・0.98 の列・拒否。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as E from './lib-w347e-spintorque.mjs';
import * as L from './lib-w353z-obpower.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w353z-obpower-1';
export const OUT_MAIN = 'tests/out/obpower-353z.json';
export const TARGET = 'tests/lib-w353z-obpower.mjs';
/** 版の履歴(結果を見て変えた所 —— 理由つき) */
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '源の扁平率の式は決めていない —— 冪の指数 n を連続に振り、読み替えの候補の n を式の冪から数えて並べた',
  'n★ が 5 の近くに在るのは、照合できる組がイオ ← 木星の 1 組だけの数 —— 偶然の並びと区別できていない',
  '読み替えの候補は、いまの (S) の式の冪の勘定 —— 当てはめで作った式ではない',
  '扁平率・質量・距離・自転の周期はリポジトリに在る数(文献の値・未照合)だけ',
  'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない(AN712)']);
/** 器の宣言(表に出す点) */
export const PLAN = Object.freeze({ pure: '零試験 9', t1: '表 1: イオ ← 木星の n 0〜6・4.5・5.5 の x と残り・n★ と入力 7 つの最後の桁 ±1 の幅・置き方 7(背景の向き・基準軸・(P-応)・太陽の σ・(P-場) c_R 2)',
  t2: '表 2: (S) の大きさの源の質量・半径・自転の率への冪(中央差と閉じた形)と、読み替えの候補 11 の n(冪の勘定・数)', t3: '表 3: n 2・5・n★ で、ガリレオ衛星 4 とタイタン(母天体の赤道の円の道)の x と残り・土星の環 3 区分・公転面の集まり・金星・0.98 の列のイオ' });

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const D = L.DECL, ok = (x) => typeof x === 'number' && Number.isFinite(x);
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 9,
    t1: J.t1.scan.length === 9 && J.t1.scan.every((r) => ok(r.x) && ok(r.resAtUV)) && ok(J.t1.base.nStar) && J.t1.widths.length === D.inputs.length && J.t1.widths.every((w) => ok(w.nPlus) && ok(w.nMinus))
      && J.t1.probes.length === 3 && J.t1.places.length === 7,
    t2: J.t2.forms.length === L.FORMS.length && J.t2.forms.every((x) => ok(x.nCount) && ok(x.nNum) && ok(x.sigma)) && ok(J.t2.powers.a) && ok(J.t2.powers.b) && Array.isArray(J.t2.hits5),
    t3: J.t3.moons.length === D.moons.length && J.t3.moons.every((m) => m.cells.length === 3 && m.cells.every((c) => ok(c.x) && ok(c.resAtUV))) && J.t3.rings.length === D.rings.length && J.t3.venus.length === 3 && J.t3.io098.length === 3,
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const T1 = E.t1Table(), GEO = E.geometry(), cache = {};
  const PSc = L.pureScenes(T1, GEO), pure = { scenes: PSc, gates: L.pureGates(PSc) }; mark('pure');
  const t1 = L.table1(T1, GEO, cache); mark('t1');
  const t2 = L.table2(T1, GEO, cache); mark('t2');
  const t3 = L.table3(T1, GEO, t1.base.nStar, cache); mark('t3');
  const J = { pure, t1, t2, t3, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}
/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w353z-obpower.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}
/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W353Z_OUT ? (path.isAbsolute(process.env.W353Z_OUT) ? process.env.W353Z_OUT : path.join(ROOT, process.env.W353Z_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第353便z obpower(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w353z-obpower.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-25 —— 第151報)AN1045・AN1039・統括の検証項目 R490',
    decl: L.DECL, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第353便z', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'obpower', engine: 'Node(html を読まない —— 純関数の lib: 〔第353便p〕の localStd・rotP・〔第353便d〕の obCancel・circRot・〔第353便k〕の diskStd・planeStd を呼ぶ)・入力のファイルは無い',
    notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
