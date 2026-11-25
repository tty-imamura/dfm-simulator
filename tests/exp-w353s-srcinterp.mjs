// 第353便s(原仮定者の回答(2026-11-25 —— 第151報)AN1045・統括の検証項目 R483):
//   **源(引きずる側)の半径を規則の半径と観測の半径の間で振る(第352便k の srcRadius の t)器 ——
//   表 1 題ごとの「合う t」(土星の環 5 区分・0.98 の金星・イオ・地球の項 —— 同じ t と源ごとの t)/表 2 源ごとの量と源の量の式の候補 3 つの t(桁の表)/
//   表 3 金星の φ と残りは t で動くか(受け手の列 5)・イオの φ**
//   (段 srcinterp-353s —— 正本 tests/out/srcinterp-353s.json・lib tests/lib-w353s-srcinterp.mjs)。
//   **診断だけ** —— 源の半径は決めない。エンジン・内蔵の本・受理器・前の便の lib の本文と正本と段は変えない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w353s-srcinterp.mjs —— 領域の宣言なし)。入力のファイルなし。1 プロセス。正本は第338便c の settleRun で書く。
// **lib の閉包に仮の値の lib(第352便b)が入る(第353便j・l の lib を呼ぶため)—— 正本の最上位に provisional: true と鍵の一覧。表の数は仮の値を使わない。**
//
// ■ 探索の方針(第138報): 式の形は走行の前に決め打ちしない —— 正本の先頭(decl・plan)は、走らせたノブの格子と判定の物差しの記録。
// ■ 判定の物差し(零試験 9): 環が第353便k の diskStd と同じ/金星が第352便s の uVt・第353便j の kFor と同じ/イオが第353便d の obSatParts・obCancel と同じ/
//   地球が第353便l の ratioOf と同じ/共通の点検の数(L・(uV)・金星の φ)/半径の外挿の式/4 題の単調/二分/拒否。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as E from './lib-w347e-spintorque.mjs';
import * as Le from './lib-w353l-earthonvenus.mjs';
import * as L from './lib-w353s-srcinterp.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w353s-srcinterp-1';
export const OUT_MAIN = 'tests/out/srcinterp-353s.json';
export const TARGET = 'tests/lib-w353s-srcinterp.mjs';
/** 版の履歴(結果を見て変えた所 —— 理由つき) */
export const AMEND = Object.freeze([]);
/** 仮の値の鍵(呼んだ第353便l の lib が閉包に持つ鍵 —— 本段の表の数は仮の値を使わない) */
export const PROV_KEYS = Object.freeze([...Le.DECL.provKeys]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '源の半径は決めていない —— 規則の半径(t 0)と観測の半径(t 1)の間の幾何の補間 t を振り、題の量が 1 になる t を並べた',
  '「合う t」は、この場・この置き方・このノブでの q(t) = 1 の点 —— 題の答えではない',
  't 1 に届かない題の t は、t 0.9〜1 の対数の傾きで外へ延ばした外挿(数えた値ではない)',
  '源の量の式の候補 3 つは桁の表 —— 当てはめていない',
  '受け手の粒子の大きさ・密度・c_R はノブ(値は未照合)・扁平率はリポジトリの数(文献の値・未照合)',
  'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない(AN712)']);
/** 器の宣言(表に出す点) */
export const PLAN = Object.freeze({ pure: '零試験 9', t1: '表 1: 題ごとの「合う t」—— 行 ' + L.T1ROWS.length + '(主 8: 環 5 区分・0.98 の金星〔受け手 規則の半径〕・イオ・地球の項 —— 源に同じ t/比べる行 6: 金星の受け手 c_R 2・木星だけ・太陽だけ・地球だけ・太陽だけ)× t の格子 11 と二分',
  t2: '表 2: 源 4(太陽・木星・土星・地球)の規則の半径・観測の半径・扁平率・質量・自転の率と、源ごとに要る t・源の量の式の候補 3 つの t', t3: '表 3: 金星の φ と等大の残りを t の格子 11 × 受け手の列 5 で・イオの φ と金星の条件での残り' });

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const ok = (x) => typeof x === 'number' && Number.isFinite(x);
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 9,
    t1: J.t1.rows.length === L.T1ROWS.length && J.t1.rows.every((r) => ok(r.q0) && ok(r.q1) && (r.tStar === null ? r.kind === 'none' : ok(r.tStar) && ['inside', 'extrap', 'below'].includes(r.kind)))
      && J.t1.rows.filter((r) => r.main).every((r) => r.mono && r.tStar !== null) && J.t1.spread.nMain === 8,
    t2: J.t2.length === L.DECL.srcs.length && J.t2.every((s) => ok(s.Rrule) && ok(s.Robs) && ok(s.f) && s.cands.length === 3 && s.cands.every((c) => ok(c.t)) && s.need.length > 0),
    t3: J.t3.venus.length === L.DECL.phiCRs.length && J.t3.venus.every((v) => ok(v.dPhiMax) && v.dPhiMax < 1e-9 && v.dResRelMax < 1e-9) && J.t3.io.length === L.DECL.tGrid.length,
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const T1 = E.t1Table(), GEO = E.geometry();
  const PSc = L.pureScenes(T1, GEO), pure = { scenes: PSc, gates: L.pureGates(PSc) }; mark('pure');
  const rows = L.table1(T1, GEO), t1 = { rows, spread: L.spreadOf(rows) }; mark('t1');
  const t2 = L.table2(T1, GEO, rows); mark('t2');
  const t3 = L.table3(T1, GEO); mark('t3');
  const J = { pure, t1, t2, t3, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}
/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w353s-srcinterp.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}
/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W353S_OUT ? (path.isAbsolute(process.env.W353S_OUT) ? process.env.W353S_OUT : path.join(ROOT, process.env.W353S_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第353便s srcinterp(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w353s-srcinterp.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-25 —— 第151報)AN1045・統括の検証項目 R483', provisional: true, provKeys: PROV_KEYS.slice(), provMark: '仮・未照合',
    provNote: '呼んだ lib(第353便j・l)の閉包に仮の値の lib が入る —— 本段の表の数は仮の値を使わない',
    decl: L.DECL, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第353便s', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'srcinterp', engine: 'Node(html を読まない —— 純関数の lib: 〔第352便k〕の srcRadius の t を、〔第353便k〕の輪の場・〔第353便d〕の obCancel・〔第353便l〕の地球の項・〔第353便j〕の kFor に通す)・入力のファイルは無い',
    notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
