// 第352便za(原仮定者の回答(2026-11-24 —— 第148報)・統括の検証項目 R463):
//   **主の成分を (S) に替えたときの帰結の一覧の器 —— 表 1 内部熱と供給(イオ・金星・木星・地球)・表 2 慣性回転(金星・水星・地球)・
//   表 3 題ごとのまとめ(9 題 × 成分 3 × 背景 3 × 大きさ 2)・表 4 換算の係数 k を金星の条件で置いたとき(背景 倍率 1)・零試験 14**
//   (段 sconseq-352za —— 正本 tests/out/sconseq-352za.json・lib tests/lib-w352za-sconseq.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・既存の lib の本文は変えない。physics の鍵を足さない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w352za-sconseq.mjs —— 領域の宣言なし)。入力のファイルは無い(lib を呼んで作り直す)。
//   1 プロセス。正本は第338便c の settleRun で書く。仮の値の lib は使わない(閉包に入らない)。
//
// ■ 言わないこと: 内部熱の出どころ・(S) で足りる/足りないの判定・題が軸引きずりの内か外かを決めない(桁の表)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as Z from './lib-w352za-sconseq.mjs';
import * as E from './lib-w347e-spintorque.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w352za-sconseq-1';
export const OUT_MAIN = 'tests/out/sconseq-352za.json';
export const TARGET = 'tests/lib-w352za-sconseq.mjs';
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '桁の表 —— 内部熱の出どころとは書かない。(S) で足りる/足りないの判定とは書かない。題が軸引きずりの内か外かを決めない',
  '供給の則 (P1) は仮定の列(〔第350便d〕)—— 供給 0 の対照 (P0) を必ず並べる',
  '物差し(熱の物差し・一般歳差)は文献の値・未照合の比べる列(合わせない)。1e-3〜1e3 倍の印は桁の帯の印 —— 判定ではない',
  '背景の向き (N+)・(G−)・基準軸 L・eq・(S) の源の半径の規則・観測はどれにも寄せていない(同じ重さで)',
  '換算の係数 k を金星の条件から置いた列(表 4)は比べる列 —— k の既定の値を観測から決めない',
  'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない']);
export const PLAN = Object.freeze({
  pure: '零試験 14((MS) を明示すると第351便の数〔地球の太陽由来・イオの由来の和・第351便g の潮汐ロックの熱 局所と局所 + 背景・(S) の局所〕・太陽を受け手にした (S) の式と第352便e・金星の条件の倍率・直交成分の作り方・(P0)・k²・輪の (M) は法線に沿う・拒否)',
  t1: '表 1 内部熱と供給: 受け手 4 × 成分 3 × (背景なし + 背景 3 × 大きさ 2)',
  t2: '表 2 慣性回転: 受け手 3 × 成分 3 × (背景なし + 背景 3 × 大きさ 2)',
  t3: '表 3 題ごとのまとめ: 題 9 × 成分 3 × 背景 3 × 大きさ 2(k 1)',
  t4: '表 4 k を金星の条件で置いたとき: 成分 3 × 題 9 × 背景 3(倍率 1)',
});

export function gatesOf(J) {
  const D = Z.DECL, nb = 1 + D.bgs.length * D.mags.length;
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 14,
    t1: J.t1.length === D.heatBodies.length * D.cols.length * nb && J.t1.every((r) => r.p0W === 0),
    t2: J.t2.length === D.spinBodies.length * D.cols.length * nb,
    t3: J.t3.length === D.topics.length * D.cols.length * D.bgs.length * D.mags.length && J.t3.filter((r) => r.topic === 'vCancel' && r.mag === 'uV').every((r) => Math.abs(r.v - 1) < 1e-9),
    t4: J.t4.length === D.cols.length * D.topics.length * D.bgs.length && J.t4.filter((r) => r.topic === 'vCancel').every((r) => Math.abs(r.v - 1) < 1e-9),
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const T1 = E.t1Table(), GEO = E.geometry(), cache = {}; mark('input');
  const PS = Z.pureScenes(T1, GEO), pure = { scenes: PS, gates: Z.pureGates(PS) }; mark('pure');
  const uV = Object.fromEntries(Z.DECL.cols.map((c) => [c, Z.uVofCol(T1, GEO, c, cache)]));
  const t1 = Z.heatRows(T1, GEO, cache); mark('t1');
  const t2 = Z.spinRows(T1, GEO, cache); mark('t2');
  const t3 = Z.summaryRows(T1, GEO, cache); mark('t3');
  const t4 = Z.kRows(T1, GEO, cache); mark('t4');
  const J = { pure, uV, t1, t2, t3, t4, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w352za-sconseq.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W352ZA_OUT ? (path.isAbsolute(process.env.W352ZA_OUT) ? process.env.W352ZA_OUT : path.join(ROOT, process.env.W352ZA_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第352便za sconseq(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: Z.LIB_VERSION, generator: 'tests/exp-w352za-sconseq.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-24 —— 第148報)・統括の検証項目 R463', decl: Z.DECL, cols: Z.COLS, bgs: Z.BGS, topics: Z.TOPICS, lit: Z.LIT, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第352便za', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'sconseq', engine: 'Node(html を読まない —— 純関数の lib・第352便k・s・d・c・e・第351便g・f・c・第350便d の lib を呼ぶ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
