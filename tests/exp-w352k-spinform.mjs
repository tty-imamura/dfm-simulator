// 第352便k(原仮定者の回答(2026-11-24 —— 第148報)AN1015・AN1019・AN1026・原仮定者の回答(2026-11-24 —— 第147報)AN1000・統括の検証項目 R448):
//   **太陽の自転の分 (S) の強さと符号のノブを数える器 —— 表 1 (S) の大きさ・(S) ÷ (M)・太陽の自転との向き(8 惑星 × 源の回転の形 9 × 源の半径の置き方 5)と距離のべき・
//   「逆向きで大きい」形の探し/表 2 金星の条件が決める「背景の倍率 ÷ k」と、倍率 1 のときに要る k・背景の向きごとの金星の残り/
//   表 3 そのときの地球・火星・太陽の率と一周の年数・仮の比べる数に単位の応答で届くのに要る倍(仮・未照合 —— 合否にしない)/表 4 受け手の半径の置き方 c_R と源の半径の置き方の入り方**
//   (段 spinform-352k —— 正本 tests/out/spinform-352k.json・lib tests/lib-w352k-spinform.mjs)。
//   **診断だけ** —— (S) の強さ・係数・源の半径の置き方を決めない。エンジン・内蔵の本・受理器・前の便の lib の本文と正本と段は変えない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w352k-spinform.mjs —— 領域の宣言なし)。入力のファイルなし。1 プロセス。正本は第338便c の settleRun で書く。
// 仮の値は第352便b の lib の prov() に在る数だけ(表 3 の比べる列)—— 正本の最上位に provisional: true と使った鍵の一覧を持つ。
//
// ■ 探索の方針(第138報): 式の形は走行の前に決め打ちしない —— 正本の先頭(decl・plan)は、走らせたノブの格子と判定の物差しの記録。
// ■ 判定の物差し(零試験 10): 既定で第351便c の partRot と同じ(相対の差 < 1e-12)/源の半径の 2 乗に比例/q0 は源の半径に依らない・(M) は形と源の半径に依らない/
//   統括の数え直し 2(在位 3.973e-14・観測の半径で 1e-4 の桁・落ちない形で 15 倍の桁と向き)/閉じた形/一次の符号/反転と k/(uV)/半径の関数/拒否。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as PV from './lib-w352b-provisional.mjs';
import * as L from './lib-w352k-spinform.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w352k-spinform-1';
export const OUT_MAIN = 'tests/out/spinform-352k.json';
export const TARGET = 'tests/lib-w352k-spinform.mjs';
/** 版の履歴(結果を見て変えた所 —— 理由つき) */
export const AMEND = Object.freeze([]);
/** 表 3 の比べる列に使う仮の値の鍵(第352便b の台帳) */
export const PROV_KEYS = Object.freeze(['earth.psiA.rate', 'mars.prec.rate']);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '(S) の強さ・源の回転の形・源の半径の置き方・換算の係数 k は決めていない(どの列も候補の表)',
  '在位の形(球のモーメント・K1・規則の半径)の列は残してある —— 既定の形は変えていない',
  '表 3 の仮の比べる数は「仮・未照合」—— 届くのに要る倍は数だけで、較正の合否・サンプルの状況・ノブの採否に入れない',
  '受け手の半径の置き方 c_R と源の半径の置き方が同じノブか別のノブかは決めていない(式の上の入り方と数を並べただけ)',
  '金星の残りは打ち消しの度合いの数だけ —— 金星の自転の逆回転の説明とは書かない', 'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない(AN712)']);
/** 器の宣言(表に出す点) */
export const PLAN = Object.freeze({ pure: '零試験 10', t1: '表 1: 8 惑星 × 形 9 × 源の半径の置き方 5 =(S)・(C2)・k 1', slope: '距離のべき: 形 9 × 置き方 5(8 惑星の最小二乗)',
  qscan: '「逆向きで大きい」形の探し: 地球・q 0.8〜3(0.05 刻み)× 置き方 5', venus: '表 2: 形 9 × 置き方 5 × 背景の向き 3', rate: '表 3: 表 2 の 45 組 × 背景の向き 3 × 受け手 3(地球・火星・太陽)',
  cr: '表 4: 地球・形 2 × 源の半径 2 × 受け手の半径 5', prov: '表 3 の比べる列: 地球の歳差の率・火星の歳差の率(仮・未照合)' });

/* ───────── 表 3 の比べる列(仮・未照合)───────── */
export function needRows(rate) {
  const wantE = Math.abs(PV.toRH('earth.psiA.rate')), wantM = Math.abs(PV.toRH('mars.prec.rate'));
  return rate.map((r) => ({ form: r.form, tSrc: r.tSrc, bg: r.bg, needEarth: wantE / r.rates.Earth.asYr, needMars: wantM / r.rates.Mars.asYr }));
}
export function needSummary(need) {
  const minBy = (k) => need.reduce((b, r) => (b === null || r[k] < b[k] ? r : b), null);
  const e = minBy('needEarth'), m = minBy('needMars'), main = need.filter((r) => r.form === 'M1' && r.tSrc === 0);
  return { minEarth: { form: e.form, tSrc: e.tSrc, bg: e.bg, need: e.needEarth }, minMars: { form: m.form, tSrc: m.tSrc, bg: m.bg, need: m.needMars },
    mainEarth: main.map((r) => r.needEarth), mainMars: main.map((r) => r.needMars), allAboveOne: need.every((r) => r.needEarth > 1 && r.needMars > 1) };
}
/* ───────── 門 ───────── */
export function gatesOf(J) {
  const D = L.DECL, nF = D.forms.length, nT = D.tSrcs.length;
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 10,
    t1: J.t1.length === nF * nT * D.planets.length && J.t1.every((r) => r.magRadS > 0 && [1, -1].includes(r.sense)),
    main: J.t1.filter((r) => r.form === 'M1' && r.tSrc === 0).every((r) => r.overM < 1e-12),
    slope: J.slope.length === nF * nT && J.slope.every((r) => Math.abs(r.slope - r.lead) < 0.6),
    qscan: J.qscan.length === nT && J.qscan.every((r) => r.best !== null && r.best.overM < 1),
    venus: J.venus.length === nF * nT && J.venus.every((r) => Math.abs(r.uk * r.kAtU1 - 1) < 1e-12),
    rate: J.rate.length === nF * nT * D.bgCols.length && J.need.length === J.rate.length,
    cr: J.cr.length === 2 * 2 * D.cRs.length,
    prov: J.provisional === true && JSON.stringify(J.provKeys) === JSON.stringify([...PROV_KEYS].sort()),
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PSc = L.pureScenes(), pure = { scenes: PSc, gates: L.pureGates(PSc) }; mark('pure');
  const t1full = L.table1(); mark('t1');
  const t1 = t1full.map((r) => ({ id: r.id, form: r.form, tSrc: r.tSrc, Rs: r.Rs, a: r.a, S: r.S, magRadS: r.magRadS, magAsYr: r.magAsYr, overM: r.overM, sense: r.sense, cosSrc: r.cosSrc, cosSpin: r.cosSpin }));
  const slope = L.slopeRows(t1full); mark('slope');
  const qscan = L.qScanRows().map((r) => ({ tSrc: r.tSrc, best: r.best, cross: r.cross, nOpp: r.nOpp, nPts: r.nPts })); mark('qscan');
  const venus = L.venusRows(t1full); mark('venus');
  const rate = L.rateRows(t1full, venus); mark('rate');
  const need = needRows(rate), needSum = needSummary(need); mark('need');
  const cr = L.cRRows(); mark('cr');
  const J = PV.tagProv({ pure, t1, slope, qscan, venus, rate, need, needSum, cr, timing: tm }, [...PROV_KEYS]);
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}
/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w352k-spinform.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}
/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W352K_OUT ? (path.isAbsolute(process.env.W352K_OUT) ? process.env.W352K_OUT : path.join(ROOT, process.env.W352K_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第352便k spinform(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w352k-spinform.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-24 —— 第148報)・原仮定者の回答(2026-11-24 —— 第147報)・統括の検証項目 R448',
    decl: L.DECL, forms: L.FORMS, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第352便k', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'spinform', engine: 'Node(html を読まない —— 純関数の lib: 〔第348便h〕の在位の形の場・〔第351便c〕の源の成分・〔第352便c〕の基準軸・〔第352便d〕の背景の向き・〔第352便b〕の仮の値)・入力のファイルなし・1 プロセス',
    notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
