// 第353便zb(原仮定者の回答(2026-11-25 —— 第151報)AN1045・AN1039・統括の検証項目 R492):
//   **構造の係数を「質量 ÷ 観測半径」に比例させる置き方(c_R = C0 × 質量 ÷ 観測半径 —— 引きずられる側の半径 = C0 × 質量)の器 ——
//   表 1 σ の有無 2 × C0 9 の 17 組の x・帯に入る組/3 つの置き方の比べ(全部同じ c_R・c_R★ の倍・本枝)/表 2 頭打ち(受け手ごとの C0 の上限の閉じた形・最大の倍・衛星・環の粒子)/
//   表 3 題 × (C0, 残りの換算の係数 k) の線/表 4 受け手ごとの c_R と慣性モーメントの係数の並び**
//   (段 massradius-353zb —— 正本 tests/out/massradius-353zb.json・lib tests/lib-w353zb-massradius.mjs)。
//   **診断だけ** —— 構造の係数・C0・k は決めない・既定に置かない。エンジン・内蔵の本・受理器・前の便の lib の本文と正本と段は変えない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w353zb-massradius.mjs —— 領域の宣言なし)。入力のファイルなし。1 プロセス。正本は第338便c の settleRun で書く。
// 呼ぶ lib(第353便q・v)の閉包に仮の値の lib(第352便b)が入る —— 正本の最上位に provisional: true と、閉包の lib が使う鍵の一覧を置く(歳差の率の 2 題は仮の値の残りで割る)。
//
// ■ 探索の方針(第138報): 式の形は走行の前に決め打ちしない —— 正本の先頭(decl・plan)は、走らせたノブの格子と判定の物差しの記録。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as E from './lib-w347e-spintorque.mjs';
import * as L from './lib-w353zb-massradius.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w353zb-massradius-1';
export const OUT_MAIN = 'tests/out/massradius-353zb.json';
export const TARGET = 'tests/lib-w353zb-massradius.mjs';
/** 版の履歴(結果を見て変えた所 —— 理由つき) */
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '構造の係数(c_R = C0 × 質量 ÷ 観測半径)は決めていない —— 1 つのノブ C0 の走査の表',
  'C0 も残りの換算の係数 k も既定に置いていない(恒久の条件「ノブの既定を観測から決めない」)',
  'イオの x = 1 は 1 点の照合 —— イオと金星が同時に読めるとは書かない',
  '頭打ちの閉じた形 (3/2) ÷ 源の重み は候補の物差し —— 半分の点・最大の点との比を数で並べた',
  '慣性モーメントの係数はリポジトリに在る数(文献の値・未照合)だけ・仮の値の数は歳差の率の 2 題の割る数だけ(仮・未照合)',
  'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない(AN712)']);
/** 器の宣言(表に出す点) */
export const PLAN = Object.freeze({ pure: '零試験 7',
  t1: '表 1: σ の有無 2 × C0 ÷ Y_k 9(1・1e2・1e4・1e5・イオの x = 1・1e6・金星 2% の端・1e7・1e8)—— 17 組の x・金星の残り・イオの x と残り・月の x・帯 2 つの組',
  cmp: '3 つの置き方の比べ(金星の c_R をそろえる): 本枝(c_R ∝ 質量 ÷ 観測半径)・全部同じ c_R(〔第353便p〕)・c_R★ の倍(〔第353便v〕)—— イオの x・月の x・金星の残り',
  t2: '表 2: 頭打ち —— 受け手 10 の (3/2) ÷ 源の重み・倍が線形の半分になる点・最大の倍とその点/衛星 4(閉じた形)/環の粒子 4 × 区分 3(自分の重み ÷ 源の重み・環の率の倍)',
  t3: '表 3: 題 11(〔第353便q〕)× C0 9 —— 0.98 で金星を等大にする k(C0)= 0.98 ÷ uV(C0) の線の上の値 ÷ 物差し・C0 の走査での動き(桁)',
  t4: '表 4: 受け手 16 + 環の粒子 4 の c_R(C0 = Y_k・イオの x = 1)・質量 ÷ 観測半径・慣性モーメントの係数との順位の相関' });
export const PROV_KEYS = Object.freeze(['earth.psiA.rate', 'earth.precSense', 'mars.prec.rate', 'venus.prec.rate']);

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const ok = (x) => typeof x === 'number' && Number.isFinite(x), nG = L.DECL.c0Grid.length;
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 7,
    t1: J.t1.cols.length === 2 * nG && J.t1.cols.every((c) => Object.keys(c.x).length === 17 && Math.abs(c.x['Venus|Sun'] - 1) < 1e-12 && ok(c.venusRes) && c.bands.length === 2)
      && J.t1.cols.filter((c) => c.g === 'io1').every((c) => Math.abs(c.io.x - 1) < 1e-6) && J.t1.cols.filter((c) => c.g === 'v2').every((c) => Math.abs(c.venusRes - 0.02) < 1e-6),
    cmp: J.cmp.length === nG && J.cmp.every((r) => ok(r.zb.io) && ok(r.p.io) && ok(r.v.io) && Math.abs(r.zb.venus / r.p.venus - 1) < 1e-9),
    t2: J.t2.rows.length === 10 && J.t2.rows.every((r) => ok(r.ratioSat) && ok(r.half) && r.gainMax > 0) && J.t2.moons.length === 4 && J.t2.rings.length === 3 && J.t2.rings.every((r) => r.cells.length === 4),
    t3: J.t3.cols.length === nG && J.t3.cols.every((c) => Object.keys(c.cells).length === 11 && ok(c.k)) && J.t3.moves.length === 11,
    t4: J.t4.rows.length === 16 && J.t4.parts.length === 4 && ok(J.t4.rho) && J.t4.n >= 10,
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const T1 = E.t1Table(), GEO = E.geometry(), o = { T1, GEO, cache: {} };
  const PSc = L.pureScenes(T1, GEO), pure = { scenes: PSc, gates: L.pureGates(PSc) }; mark('pure');
  const t1 = L.table1(o); mark('t1');
  const cmp = L.compare3(o); mark('cmp');
  const t2 = L.table2(o); mark('t2');
  const t3 = L.table3(o); mark('t3');
  const t4 = L.table4(o); mark('t4');
  const J = { pure, t1, cmp, t2, t3, t4, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}
/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w353zb-massradius.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}
/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W353ZB_OUT ? (path.isAbsolute(process.env.W353ZB_OUT) ? process.env.W353ZB_OUT : path.join(ROOT, process.env.W353ZB_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第353便zb massradius(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w353zb-massradius.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-25 —— 第151報)AN1045・AN1039・統括の検証項目 R492', provisional: true, provKeys: PROV_KEYS.slice(), provMark: '仮・未照合(閉包の lib が使う鍵 —— 本器は歳差の率の 2 題の割る数だけを読む)',
    decl: L.DECL, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第353便zb', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'massradius', engine: 'Node(html を読まない —— 純関数の lib: 〔第353便p〕の localStd・stdCancel・〔第353便v〕の stateAtR・〔第353便q〕の topicAt・dragAz・〔第353便k〕の axStd・diskStd・planeStd を呼ぶ)・入力のファイルは無い',
    notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
