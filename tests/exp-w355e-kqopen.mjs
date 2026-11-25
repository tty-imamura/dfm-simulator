// 第355便e(原仮定者の指示(2026-11-25)「この結果を尊重する」・原仮定者の回答(2026-11-25)「推奨。ただし、必ず0.98 倍である必要は無い」・統括の検証項目 R508):
//   **6 組の共通部分が開く k₂/Q を閉じた形で数える器 —— 表 1 k₂/Q 1 あたりの X(u 1)と種類/表 2 3 つの比の下限と上限(閉じた形)/表 3 1 つの値だけを動かして開く区間/
//   表 4 開いた所の共通部分/表 5 全体の係数で読む 3 つの題/表 6 枝 c の端と枝 b の正本の照合・零試験 7**
//   (段 kqopen-355e —— 正本 tests/out/kqopen-355e.json・lib tests/lib-w355e-kqopen.mjs)。**診断だけ** —— エンジン・内蔵の本・受理器・既存の lib の本文は変えない。physics の鍵を足さない。
//   潮汐のトルクは全部「比べる列(DFM の式ではない)」。k₂/Q は仮の値・未照合(照合の依頼に書く候補の数)。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w355e-kqopen.mjs)。入力のファイルは 2 本(〔第355便b〕の正本 tests/out/bgrange-355b.json —— 零試験の照合と表 5 の (c)・
//   〔第355便c〕の正本 tests/out/rangecols-355c.json —— 表 6 の端の照合)。1 プロセス。正本は第338便c の settleRun で書く。仮の値の lib(第352便b)は閉包に入る(正本の最上位に provisional: true と鍵の一覧)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w355e-kqopen.mjs';
import * as E from './lib-w347e-spintorque.mjs';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w355e-kqopen-1';
export const OUT_MAIN = 'tests/out/kqopen-355e.json';
export const TARGET = 'tests/lib-w355e-kqopen.mjs';
export const INPUTS = Object.freeze(['tests/out/bgrange-355b.json', 'tests/out/rangecols-355c.json']);
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '共通部分が空であることを外れとは書かない —— 「この置き方の組では、共通部分は空 —— 開く k₂/Q は表 3」',
  '潮汐のトルクは比べる列(DFM の式ではない)—— k₂/Q は仮の値・未照合(照合の依頼に書く候補の数 —— 値を置いたとは書かない)',
  '範囲を 1 つの値に置かない —— 0.98 倍は範囲の内の 1 点',
  'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない']);
export const PLAN = Object.freeze({
  pure: '零試験 7(種類が固体か気体・いまの k₂/Q の 6 組の共通部分と組ごとの範囲が〔第355便b〕の正本と同じ・k₂/Q に比例・定数の条件・開く下限の両側・いまは閉じている)',
  t1: '表 1: 天体ごとの k₂/Q 1 あたりの X(u 1)—— 置き方 3 × 10 天体・ロックの側か・固体か気体か',
  t2: '表 2: 3 つの比(固体 ÷ 共通・気体 ÷ 共通・固体 ÷ 気体)の下限と上限と、決める組と天体(閉じた形 —— 最大と最小)・いまの値',
  t3: '表 3: 1 つの値だけを動かして開く区間(共通・固体・気体)',
  t4: '表 4: 開いた所の共通部分(固体を開く下限の倍・共通を開く上限の倍)',
  t5: '表 5: 全体の係数(= u ÷ 金星の条件の値)で読む 3 つの題と共通部分・重なり',
  t6: '表 6: 枝 c の端(ノブ)と枝 b の正本の主の行の端(3 桁)',
});
export const PROV_KEYS = Object.freeze(['earth.precSense', 'earth.psiA.rate', 'mars.prec.rate', 'venus.prec.rate', 'venus.spin.period']);
const nz = (x) => (Number.isFinite(x) ? x : null);
export function gatesOf(J) {
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 7,
    t1: J.t1.length === L.DECL.modes.length && J.t1.every((r) => r.rows.length === 10 && r.rows.every((q) => q.a > 0 && (q.kind === 's' || q.kind === 'g'))),
    t2: J.t2.ratios.length === 3 && J.t2.ratios.every((r) => r.lo === null || r.hi === null || r.lo < r.hi),
    t3: J.t3.length === 3 && J.t3.every((r) => r.open === (r.lo < (r.hi === null ? Infinity : r.hi))),
    t4: J.t4.length === L.DECL.over.length * 2 && J.t4.every((r) => r.open === true),
    t5: J.t5.rows.length === 7 && J.t5.uV > 0,
    t6: J.t6.bad.length === 0 && J.t6.rows.length === 2,
  };
}
export function runAll(Jb, Jc) {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const o = { T1: E.t1Table(), GEO: E.geometry() }; mark('input');
  const S = L.pureScenes(Jb, o), G = L.pureGates(S);
  const pure = { gates: G, cur: { lo: S.cur.lo, hi: S.cur.hi, open: S.cur.open, gap: S.cur.gap, loFrom: S.cur.loFrom, hiFrom: S.cur.hiFrom } }; mark('pure');
  const t1 = L.DECL.modes.map((m) => ({ mode: m, rows: S.U[m].map((r) => ({ id: r.id, state: r.state, kind: r.kind, a: r.a })) })); mark('t1');
  const t2 = { ratios: L.violated(S.Bd).map((r) => ({ x: r.x, y: r.y, lo: nz(r.lo) === 0 ? null : nz(r.lo), loFrom: r.loFrom, hi: nz(r.hi), hiFrom: r.hiFrom, now: r.now, inside: r.inside })),
    consts: S.Bd.consts }; mark('t2');
  const t3 = ['c', 's', 'g'].map((s) => { const q = L.openOne(S.Bd, s); return { sym: s, lo: q.lo, hi: nz(q.hi), open: q.open, now: q.now, inside: q.inside, loFrom: q.loFrom, hiFrom: q.hiFrom, fLo: q.lo / q.now, fHi: nz(q.hi / q.now) }; }); mark('t3');
  const t4 = ['s', 'c'].flatMap((s) => L.DECL.over.map((f) => { const q = L.openedAt(S.Bd, S.U, s, f); return { sym: s, f, k: q.k, lo: q.part.lo, hi: q.part.hi, open: q.part.open, width: q.part.hi / q.part.lo, loFrom: q.part.loFrom, hiFrom: q.part.hiFrom, in098: q.part.open && 0.98 > q.part.lo && 0.98 < q.part.hi }; })); mark('t4');
  const t5 = L.coefTopics(Jb, S.U, S.Bd, o); mark('t5');
  const t6 = L.seamC(Jb, Jc); mark('t6');
  const J = { pure, t1, t2, t3, t4, t5, t6, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w355e-kqopen.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}
export const readInputs = () => INPUTS.map((f) => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8')));
export async function main() {
  const OUT = process.env.W355E_OUT ? (path.isAbsolute(process.env.W355E_OUT) ? process.env.W355E_OUT : path.join(ROOT, process.env.W355E_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第355便e kqopen(版 ' + HARNESS_VERSION + ')');
  const [Jb, Jc] = readInputs();
  let tm = null;
  const S = settleRun(() => { const R = runAll(Jb, Jc); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w355e-kqopen.mjs', target: TARGET,
    ruling: '原仮定者の指示(2026-11-25)「この結果を尊重する」・原仮定者の回答(2026-11-25)「推奨。ただし、必ず0.98 倍である必要は無い」・統括の検証項目 R508', provisional: true, provKeys: PROV_KEYS.slice(),
    provMark: '仮・未照合(閉包の〔第355便b〕の lib → 第353便zk の lib が仮の値の lib を import する —— 本器は値を読まない。k₂/Q も仮の値・未照合)',
    decl: L.DECL, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第355便e', target: TARGET, code: codeClosure(), inputs: INPUTS.slice() }), {
    harnessVersion: HARNESS_VERSION, stage: 'kqopen', engine: 'Node(html を読まない —— 純関数の lib・〔第355便b〕の lib を呼ぶ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
