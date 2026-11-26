// 第355便c(原仮定者の回答(2026-11-25)「推奨。ただし、必ず0.98 倍である必要は無い」・原仮定者の指示(2026-11-25)「この結果を尊重する」・統括の検証項目 R506):
//   **第353便zf の 35 の題を、主の作り(換算の係数 = 金星で等大になる値)で、背景の大きさ u の範囲の内の代表の値ごとに並べ直す器 ——
//   表 1 題 × u の列/表 2 題ごとの形(u に依らない・u の冪・なだらかに曲がる)と切り替わる u/比べる列 (ウ)(ア)**
//   (段 rangecols-355c —— 正本 tests/out/rangecols-355c.json・lib tests/lib-w355c-rangecols.mjs)。
//   **診断だけ** —— 範囲の内のどこかの u を選ばない(代表の値ごとの表)。エンジン・内蔵の本・受理器・前の便の lib の本文と正本と段は変えない。
//   範囲の端は数えない(ノブ —— 環境の変数 W355C_ENDS="lo,hi" で置き直せる。既定は lib の DECL.ends)。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w355c-rangecols.mjs —— 領域の宣言なし)。入力のファイルなし。1 プロセス。正本は第338便c の settleRun で書く。
// 呼ぶ lib(第353便zf・u・za)の閉包に仮の値の lib(第352便b)が入る —— 正本の最上位に provisional: true と、閉包の lib が使う鍵の一覧を置く。
//
// ■ 探索の方針(第138報): 式の形は走行の前に決め打ちしない —— 正本の先頭(decl・plan)は、走らせたノブの格子と判定の物差しの記録。
// ■ 判定の物差し(零試験 5): u 0.98 の列 = 第353便zf の列 (イ)(35 行・相対 1e-9)・λ(0.98) = 第353便zf の lamVenus・両端で金星が等大・u の列・拒否。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as E from './lib-w347e-spintorque.mjs';
import * as L from './lib-w355c-rangecols.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w355c-rangecols-1';
export const OUT_MAIN = 'tests/out/rangecols-355c.json';
export const TARGET = 'tests/lib-w355c-rangecols.mjs';
/** 版の履歴(結果を見て変えた所 —— 理由つき) */
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '範囲の内のどこかの u を選んだのではない —— 同じ題を u の代表の値ごとに並べた表(判定はしない)',
  '範囲の端は数えていない —— 前倒しの数の主の行を仮に置いたノブ(仮・未照合)',
  '題の読みは第353便zf の節の語のまま —— 新しい物理を足していない',
  '物差しは文献の値・未照合・歳差の率の残りと回る向きは仮の値(仮・未照合)・重力の側の潮汐のトルクの列は比べる列(DFM の式ではない)',
  'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない(AN712)']);
export const PROV_KEYS = Object.freeze(['earth.precSense', 'earth.psiA.rate', 'mars.prec.rate']);
/** 器の宣言(表に出す点) */
export const PLAN = Object.freeze({ pure: '零試験 5', t1: '表 1: 題 35 × u の列(範囲の下端・0.41・0.84・0.98・3.2・範囲の上端)—— 主の作り(換算の係数 = 金星で等大になる値)',
  t2: '表 2: 題ごとの形(u に依らない・u の冪〔指数〕・なだらかに曲がる)・下端と上端の比・状態の印(帯・符号・順位・印)が替わる u(二分)・数の一覧',
  cmp: '比べる列: 第353便zf の列 (ウ)(換算の係数 1・背景 = 金星の条件)と (ア)(換算の係数 1・0.98)' });

/** 端のノブ(環境の変数で置き直す —— 範囲を数える枝の正本が載った後に統括が使う口) */
export function endsOf(env = process.env) {
  if (!env.W355C_ENDS) return L.DECL.ends;
  const [lo, hi] = String(env.W355C_ENDS).split(',').map(Number);
  return { lo, hi, src: '環境の変数 W355C_ENDS で置いた端' };
}
/* ───────── 門 ───────── */
export function gatesOf(J) {
  const ok = (x) => typeof x === 'number' && Number.isFinite(x), n = J.t1.us.length, c = J.t2.count;
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 5,
    t1: n >= 3 && J.t1.cols.length === n && J.t1.rows.length === 35 && J.t1.rows.every((r) => r.cells.length === n) && J.t1.us.includes(0.98) && J.t1.cols.every((x) => ok(x.lam) && ok(x.u)),
    t2: J.t2.rows.length === 35 && c.indep.length + c.power.length + c.bend.length + c.discrete.filter((id) => !c.indep.includes(id)).length === 35 && J.t2.rows.every((r) => r.switches.every((s) => s && ok(s.uSwitch) && s.uSwitch > s.lo * (1 - 1e-12) && s.uSwitch < s.hi * (1 + 1e-12))),
    cmp: J.cmp.U.rows.length === 35 && J.cmp.A.rows.length === 35,
  };
}
export function runAll(ends = L.DECL.ends) {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const T1 = E.t1Table(), GEO = E.geometry(), o = { T1, GEO };
  const PSc = L.pureScenes(T1, GEO), pure = { scenes: PSc, gates: L.pureGates(PSc) }; mark('pure');
  const t1 = L.table(ends, o); mark('t1');
  const t2 = L.summary(t1, o); mark('t2');
  const C = L.compareCols(o), cmp = { U: { u: C.U.u, lam: C.U.lam, rows: C.U.rows }, A: { u: C.A.u, lam: C.A.lam, rows: C.A.rows } }; mark('cmp');
  const J = { pure, t1, t2, cmp, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}
/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w355c-rangecols.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}
/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W355C_OUT ? (path.isAbsolute(process.env.W355C_OUT) ? process.env.W355C_OUT : path.join(ROOT, process.env.W355C_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now(), ends = endsOf();
  console.log('第355便c rangecols(版 ' + HARNESS_VERSION + ')・端 ' + ends.lo + '〜' + ends.hi);
  let tm = null;
  const S = settleRun(() => { const R = runAll(ends); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w355c-rangecols.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-25)「推奨。ただし、必ず0.98 倍である必要は無い」・原仮定者の指示(2026-11-25)「この結果を尊重する」・統括の検証項目 R506', provisional: true, provKeys: PROV_KEYS.slice(), provMark: '仮・未照合(閉包の lib が使う鍵 —— 本器は歳差の率の残りと回る向きと見ている時間の題だけが読む)・範囲の端も仮・未照合のノブ',
    decl: L.DECL, ends, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第355便c', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'rangecols', engine: 'Node(html を読まない —— 純関数の lib: 〔第353便zf〕の topicRow・localSumAt・dirRank・ioX・table1・〔第353便zg〕の aStar・〔第353便u〕の obsRow・〔第353便za〕の kWatch・fWindow・kState を呼ぶ)・入力のファイルは無い',
    notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
