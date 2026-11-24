// 第351便k(原仮定者の整理(2026-11-23 —— 第146報)・原仮定者の回答(2026-11-24 —— 第147報)・統括の検証項目 R437):
//   **係数の当てはめの診断の器 —— ノブ(換算の係数 k・構造の係数 c_R の入り方 (ii)(i)・経路の比率 f・背景の倍率 u)と観測量の対数の感度の行列と階数(地球・火星・金星 × 成分 3 × 基準 2)・
//   分けられる組と分けられない組((あ)(い)(う)と 2 つのノブの組)・当てはめの段 (全)(組)(個) の要る値(主の読み (C2)・成分 (MS)(S)・背景 u 0・1・月は外す列が主)・構造の組の順位の相関**
//   (段 knobrank-351k —— 正本 tests/out/knobrank-351k.json・lib tests/lib-w351k-knobrank.mjs)。
//   **診断だけ** —— 当てはめた値を結果として出すものではない。エンジン・内蔵の本・受理器・前の便の lib の本文は変えない。physics の鍵を足さない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w351k-knobrank.mjs —— 領域の宣言なし)。入力のファイルは無い(前の便の lib を呼んで作り直す)。
//   1 プロセス。正本は第338便c の settleRun で書く。
//
// ■ 探索の方針(第138報): 式の形は走行の前に決め打ちしない —— 正本の先頭(decl・lit・plan)は、走らせたノブの格子と判定の物差しの記録。ノブの値は観測から選ばない(要る値を並べるだけ)。
// ■ 判定の物差し(零試験 10): 共通の点検の数/書き直した口と第351便c の partRot の照合/第351便b の c2BallPair との照合/統括の数え直しの数/観測量の式/比の不変/特異値/当てはめの道具/順位の相関/入力の拒否。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as E from './lib-w347e-spintorque.mjs';
import * as CB from './lib-w351b-c2main.mjs';
import * as L from './lib-w351k-knobrank.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w351k-knobrank-1';
export const OUT_MAIN = 'tests/out/knobrank-351k.json';
export const TARGET = 'tests/lib-w351k-knobrank.mjs';
/** 版の履歴(結果を見て変えた所 —— 理由つき) */
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '当てはめの診断だけ —— どのノブがどの観測量で分けられるか(係数・比率・倍率の値は選んでいない)',
  'ノブは同時に当てはめていない(当てはめの段は 1 つのノブを振り、ほかは基準の値に固定)', '天体ごとの段は自由度 0 —— 要る値を並べるだけ(残差の良し悪しを言わない)',
  '場は geoPN=3 の在位の形(〔第348便h〕の makeField3 の既定の引数)・主の読み (C2)・局所の分母は自分 + 太陽 + 母天体',
  '比べる数は第330便a の lib の歳差の率(文献の値・未照合)の固定の比べる列(合わせない)—— 月は比べる数が軌道の交点の率なので外す列が主', 'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない(AN712)']);
/** 器の宣言(表に出す点) */
export const PLAN = Object.freeze({ pure: '零試験 10', sens: '3 天体 × 成分 3 × 基準 u 2(ノブ 4〜5 × 観測量 5)', ratio: '3 天体 × 成分 2 × u 2', kcr: '3 天体 × q 8(第351便b の格子)', moon: '月 × q 6',
  uk: '3 天体 × 成分 2 × (u, k) 6', pair: '3 天体 × ノブの組 10 × 観測量の集まり 5', fit: 'ノブ 2 × 成分 2 × u 2 × 月 2 × (全 1 + 組 2 + 個 4〜5)', corr: 'ノブ 2 × 成分 2 × u 2 × 水星の有無 2' });

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const D = L.DECL, nb = D.bodies3.length;
  const u0 = J.sens.filter((r) => r.u === 0);
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 10,
    sens: J.sens.length === nb * D.parts.length * D.base.us.length && u0.every((r) => r.knobs.length === 4) && J.sens.filter((r) => r.u === 1).every((r) => r.knobs.length === 5)
      && J.sens.every((r) => r.nObs === 5 && r.rank[0] <= r.rank[1] && r.rank[1] <= r.knobs.length && r.singleUndetermined.every((x) => x === r.knobs.length - 1 || x === r.knobs.length)),
    ratio: J.ratio.length === nb * D.fitParts.length * D.base.us.length && J.ratio.every((r) => r.closed < 1e-9 && r.fN1 < 1e-9) && J.ratio.filter((r) => r.u === 0).every((r) => r.kSpread < 1e-9),
    kcr: J.kcr.length === nb * CB.DECL.qGrid.length && J.kcr.every((r) => r.vsC2Ball < 1e-9) && J.kcrVs351b < 1e-9,
    moon: J.moon.length === D.qMoon.length,
    uk: J.uk.length === nb * D.fitParts.length * D.uk.length && D.bodies3.every(([id]) => D.fitParts.every((p) => { const a = J.uk.find((r) => r.id === id && r.part === p && r.u === 1 && r.k === 1), b = J.uk.find((r) => r.id === id && r.part === p && r.u === 2 && r.k === 2);
      return Math.abs(a.delta - b.delta) < 1e-9 && Math.abs(b.prec / a.prec - 2) < 1e-9; })),
    pair: J.pair.length === nb * 10 && J.pair.every((r) => r.ratio.length === L.OBS_SETS.length),
    fit: J.fit.length === D.fitKnobs.length * D.fitParts.length * D.fitUs.length * (2 * 3 + D.fitBodies.length * 2 + 1) && J.fit.filter((r) => r.level === 'body' && r.set === 'Moon').every((r) => r.moon === 'in'),
    corr: J.corr.length === D.fitKnobs.length * D.fitParts.length * D.fitUs.length * 2,
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const T1 = E.t1Table(), GEO = E.geometry(), X = L.makeCtx(T1, GEO);
  const PS = L.pureScenes(X), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const sens = L.sensRows(X); mark('sens');
  const ratio = L.ratioRows(X); mark('ratio');
  const kcr = L.kcrRows(X), DR = CB.degenRows(T1, GEO);
  const kcrVs351b = Math.max(...kcr.map((r) => { const d = DR.find((x) => x.id === r.id && x.q === r.q); return Math.abs(r.iiOverK - d.iiOverK); })); mark('kcr');
  const moon = L.moonRows(X); mark('moon');
  const uk = L.ukRows(X); mark('uk');
  const pair = L.pairRows(sens); mark('pair');
  const fit = L.fitStages(X); mark('fit');
  const corr = L.corrRows(X, fit); mark('corr');
  const props = [...L.DECL.fitBodies].map(([id, src]) => ({ id, ...L.propOf(X, id, src), group: 'rock' }));
  const J = { pure, sens, ratio, kcr, kcrVs351b, moon, uk, pair, fit, corr, props, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w351k-knobrank.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W351K_OUT ? (path.isAbsolute(process.env.W351K_OUT) ? process.env.W351K_OUT : path.join(ROOT, process.env.W351K_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第351便k knobrank(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w351k-knobrank.mjs', target: TARGET,
    ruling: '原仮定者の整理(2026-11-23 —— 第146報)・原仮定者の回答(2026-11-24 —— 第147報)・統括の検証項目 R437',
    decl: L.DECL, lit: L.LIT, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第351便k', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'knobrank', engine: 'Node(html を読まない —— 純関数の lib・第351便c・第351便d・第351便b・第350便f・第350便e・第348便h の lib を呼ぶ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
