// 第353便d(原仮定者の回答(2026-11-25 —— 第151報)AN1045・統括の検証項目 R468):
//   **源(引きずる側)の扁平率を (S) に入れる式の候補 (O0)〜(O3) を数える器 —— 表 1 遠い場(太陽 → 8 惑星)/表 2 近い場(木星 → ガリレオ衛星・土星 → タイタンと環の 5 区分・地球 → 月)/
//   表 3 金星とイオの打ち消し(φ・残り・x)と、イオを金星と同じ背景で読む列が保たれる扁平の重みの範囲/表 4 四重極の項の半径(規則の半径・観測の赤道半径)**
//   (段 srcoblate-353d —— 正本 tests/out/srcoblate-353d.json・lib tests/lib-w353d-srcoblate.mjs)。
//   **診断だけ** —— 扁平率の効き方は決めない。エンジン・内蔵の本・受理器・前の便の lib の本文と正本と段は変えない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w353d-srcoblate.mjs —— 領域の宣言なし)。入力のファイルなし。1 プロセス。正本は第338便c の settleRun で書く。仮の値は使わない。
//
// ■ 探索の方針(第138報): 式の形は走行の前に決め打ちしない —— 正本の先頭(decl・plan)は、走らせたノブの格子と判定の物差しの記録。
// ■ 判定の物差し(零試験 9): 扁平率 0 で第352便k の spinRot と同じ・第352便s の ringRot・satParts・cancelRow と同じ/統括の数え直し 3 の金星とイオの数/解析の勾配と差分/
//   一次の比例(ε と R_q²)/候補の恒等/リポジトリの数/一次の係数(実在の組と円の道・赤道 1.5・直接の値)/拒否。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as E from './lib-w347e-spintorque.mjs';
import * as L from './lib-w353d-srcoblate.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w353d-srcoblate-1';
export const OUT_MAIN = 'tests/out/srcoblate-353d.json';
export const TARGET = 'tests/lib-w353d-srcoblate.mjs';
/** 版の履歴(結果を見て変えた所 —— 理由つき) */
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '源の扁平率の効き方((O1)(O2)(O3) のどれか)は決めていない —— 候補を並べた',
  '四重極の項の半径(規則の半径/観測の赤道半径)は決めていない —— 両方の列を並べた',
  '受け手の側の J2 ÷ 慣性モーメントの係数(重力の側の潮汐の列の量)は使っていない —— 源の幾何の扁平率・源の J2 だけ',
  'イオの打ち消しの x が動く範囲は、イオの状態の答えではない(この候補・この半径では、の数)',
  '扁平率・J2 はリポジトリに在る数(文献の値・未照合)と、ノブ(値は未照合)の格子だけ',
  'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない(AN712)']);
/** 器の宣言(表に出す点) */
export const PLAN = Object.freeze({ pure: '零試験 9', far: '表 1: 太陽 → 8 惑星(一次の係数 c_lin・(R_q/a)² 2 つ・四重極の項 6 列・向きの変化 3 列・σ − 1 2 列)',
  near: '表 2: 実在の組 2(イオ・月)+ 円の道 5(ガリレオ衛星 4・タイタン)+ 土星の環 5 区分(同じ列)', cancel: '表 3: 金星とイオの打ち消し × 候補の列 9((N+)・基準軸 L)',
  range: '表 3b: イオの母天体由来 (S) の倍 m 0.5〜2(301 点)で金星の条件での残りが球の値以下に留まる範囲 → (O2b) の f・(O3) の η', radius: '表 4: 源 4 × 代表の受け手 5 の四重極の項の半径' });

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const D = L.DECL, ok = (x) => typeof x === 'number' && Number.isFinite(x);
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 9,
    far: J.far.length === D.planets.length && J.far.every((r) => ok(r.cLin) && r.cLin > 0 && r.x2obs > r.x2rule && ok(r.quad.k01obs) && r.quad.J2obs === null),
    near: J.near.length === D.nearPairs.length + D.circMoons.length + D.rings.length && J.near.every((r) => ok(r.cLin) && r.cLin > 0 && ok(r.quad.J2obs) && r.x2obs > r.x2rule),
    cancel: J.cancel.length === L.CANCEL_COLS.length && J.cancel[0].id === 'O0' && J.cancel.every((r) => ok(r.io.x) && ok(r.io.resAtVenus) && ok(r.venus.phiDeg)),
    range: J.range.n === 301 && J.range.mLo <= 1 && J.range.mHi > 1 && J.range.mBest > 1 && J.range.resBest < J.range.res0,
    radius: J.radius.length === L.T4_ROWS.length && J.radius.every((r) => r.ruleOverObs < 1e-3 && r.termRule < r.termObs * 1e-6),
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const T1 = E.t1Table(), GEO = E.geometry();
  const PSc = L.pureScenes(T1, GEO), pure = { scenes: PSc, gates: L.pureGates(PSc) }; mark('pure');
  const far = L.farRows(T1, GEO); mark('far');
  const near = L.nearRows(T1, GEO); mark('near');
  const cancel = L.cancelRows(T1, GEO); mark('cancel');
  const range = L.ioRange(T1, GEO); mark('range');
  const radius = L.radiusRows(far, near); mark('radius');
  const src = ['Sun', 'Earth', 'Jupiter', 'Saturn'].map((s) => L.srcRow(s));
  const J = { pure, src, far, near, cancel, range, radius, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}
/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w353d-srcoblate.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}
/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W353D_OUT ? (path.isAbsolute(process.env.W353D_OUT) ? process.env.W353D_OUT : path.join(ROOT, process.env.W353D_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第353便d srcoblate(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w353d-srcoblate.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-25 —— 第151報)AN1045・統括の検証項目 R468',
    decl: L.DECL, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第353便d', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'srcoblate', engine: 'Node(html を読まない —— 純関数の lib: 〔第352便k〕の spinRot と同じ作りの場に源の扁平の因子を足した obRot・circRot・〔第352便s〕の衛星と輪の口)・入力のファイルは無い',
    notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
