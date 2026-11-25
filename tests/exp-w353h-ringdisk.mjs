// 第353便h(原仮定者の回答(2026-11-25 —— 第151報)AN1045・統括の検証項目 R472):
//   **土星の環を円盤引きずりの側で数え直す器 —— 表 1 環の区分 5 × 傾き 5 × 列 6(軸引きずりの (S) 規則の半径・観測の半径〔比べる列〕・円盤引きずりの側の候補 (C1)(C2)・🛟 の率 2)の
//   率 ÷ 物差し・表 2 第352便za の題 9 の切り分け・零試験 9**
//   (段 ringdisk-353h —— 正本 tests/out/ringdisk-353h.json・lib tests/lib-w353h-ringdisk.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・🛟 の本と鍵・既存の lib の本文は変えない。physics の鍵を足さない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w353h-ringdisk.mjs —— 領域の宣言なし)。入力のファイルは 🛟 の正本 tests/out/rotvert-w339a.json(読むだけ —— 第351便j と同じ)。
//   1 プロセス。正本は第338便c の settleRun で書く。仮の値の lib は使わない(閉包に入らない)。
//
// ■ 言わないこと: 環の傾きの答え・円盤引きずりの型とは書かない。🛟 の本の「達」はその本の目的 —— 円盤引きずりの型を採ったことではない。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w353h-ringdisk.mjs';
import * as G from './lib-w350g-diskcheck.mjs';
import * as E from './lib-w347e-spintorque.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w353h-ringdisk-1';
export const OUT_MAIN = 'tests/out/ringdisk-353h.json';
export const TARGET = 'tests/lib-w353h-ringdisk.mjs';
export const INPUT_ROTVERT = 'tests/out/rotvert-w339a.json';
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '候補の表 —— 環の傾きの答えとは書かない。円盤引きずりの型を決めていない(これまでの節に在る式の候補を呼んだだけ)',
  '🛟 の本の「達」はその本の目的(探索用・未較正)—— 円盤引きずりの型を採ったことではない。🛟 の率は見える倍率のまま/倍率で割った目安の強さ',
  '環の物差し(1e7 年で傾きが e 分の 1)は文献の値・未照合の比べる列(合わせない)',
  '軸引きずりの (S) の観測の半径の列は比べる列(第151報の主の列は源 = 規則の半径)',
  '表 2 の切り分けは統括の読みの表 —— 題が軸引きずりの内か外かの判定ではない',
  'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない']);
export const PLAN = Object.freeze({
  pure: '零試験 9(傾き 1° の (i)(ii) = 第352便s・第352便s の比べる数 1e-13 の桁と 14〜109・(iii-a) = 第351便j の saturnRows・円盤引きずりの側の直交成分は (S) の分・小さい傾き・共通の点検の数・物差しの換算・切り分けの覆い・拒否)',
  book: '🛟 の率(第351便j の rotvertRows の main —— 本の強さ・目安の強さ)',
  t1: '表 1: 環の区分 5 × 傾き 5 × 列 6(率 ÷ 物差し・物差しに届くのに要る倍・物差しの桁の印)',
  t2: '表 2: 第352便za の題 9 × (S) 規則の半径・観測の半径(背景 (N+) L・(uV))× 読む側',
});

export function gatesOf(J) {
  const D = L.DECL, t1 = J.t1;
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 9,
    book: J.book.lambdaScale > 0 && J.book.yardNeed > 0 && Math.abs(J.book.yardBook / J.book.yardNeed / J.book.lambdaScale - 1) < 1e-9,
    t1: t1.length === D.centers.length * D.tilts.length && t1.every((r) => Object.keys(r.yard).length === D.cols.length),
    t1sign: t1.every((r) => r.yard.axRule > 0 && r.yard.axObs > 0 && r.yard.diskC2 > 0 && r.yard.diskC1 < 0),
    t2: J.t2.length === 9 && J.t2.find((r) => r.topic === 'vCancel').bandRule === true,
  };
}
export function readInputs() { return { RV: JSON.parse(fs.readFileSync(path.join(ROOT, INPUT_ROTVERT), 'utf8')) }; }
export function runAll(IN = readInputs()) {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const T1 = E.t1Table(), GEO = E.geometry(), cache = {}; mark('input');
  const PS = L.pureScenes(T1, GEO), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const RS = G.rotvertSummary(IN.RV), book = Object.assign({ version: RS.version, ok: RS.ok, key: RS.key, inDefault: RS.inDefault, bookId: RS.book }, L.bookRow(RS)); mark('book');
  const t1 = []; for (const key of L.DECL.centers) for (const t of L.DECL.tilts) t1.push(L.cellRow(T1, GEO, key, t, book)); mark('t1');
  const t2 = L.splitRows(T1, GEO, cache); mark('t2');
  const J = { pure, book, t1, t2, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w353h-ringdisk.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W353H_OUT ? (path.isAbsolute(process.env.W353H_OUT) ? process.env.W353H_OUT : path.join(ROOT, process.env.W353H_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第353便h ringdisk(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const IN = readInputs();
  const S = settleRun(() => { const R = runAll(IN); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w353h-ringdisk.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-25 —— 第151報)・統括の検証項目 R472', decl: L.DECL, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第353便h', target: TARGET, code: codeClosure(), inputs: [INPUT_ROTVERT] }), {
    harnessVersion: HARNESS_VERSION, stage: 'ringdisk', engine: 'Node(html を読まない —— 純関数の lib・第352便s・k・c・za・第351便j・第350便g ほかの lib を呼ぶ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
