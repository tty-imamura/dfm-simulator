// 第348便c(原仮定者の回答(2026-11-23 —— 第145報の回答 10)の AN976・統括の検証項目 R411):
//   **釣り合う向き(銀河由来と太陽由来の軸引きずりの重みつきの合成 —— 重みの型 3)・観測の自転軸とのなす角と歳差の率・「引きずられ半径 ÷ 観測半径」の係数 c_R のノブ・熱の窓を数える器**
//   (段 axisbalance-348c —— 正本 tests/out/axisbalance-348c.json・lib tests/lib-w348c-axisbalance.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・前の便の lib の本文は変えない。physics の鍵を足さない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w348c-axisbalance.mjs —— 領域の宣言なし)。入力のファイルは無い(前の便の lib を呼んで作り直す)。
//   1 プロセス。正本は第338便c の settleRun で書く。
//
// ■ 探索の方針(第138報): 式の形は走行の前に決め打ちしない —— 正本の先頭(decl・lit・plan)は、走らせたノブの格子と判定の物差しの記録。
// ■ 判定の物差し(零試験 10): w_G = 0 で太陽由来の軸/w_S = 0 で銀河由来の軸/重みの入れ替え/δ = 0 で歳差 0/c_R = 1 で枝 h の (iv) に一致/
//   q = 0 は剛体の回転/(P2) の極限と有限の腕/W2 で 120° の例(重みを落とす変異・銀河の向きを逆にする変異で落ちる)/c_R の倍(冪を落とす変異で落ちる)/入力の拒否。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w348c-axisbalance.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w348c-axisbalance-1';
export const OUT_MAIN = 'tests/out/axisbalance-348c.json';
export const TARGET = 'tests/lib-w348c-axisbalance.mjs';
/** 版の履歴(結果を見て変えた所 —— 理由つき) */
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '釣り合う向きの重みの型・軸引きずりの候補・q・D₀ ごとの見え方の表(釣り合いの向きや歳差の由来の答えではない)', '重みの型 W1・W2・W3 はどれも候補 —— 主は決めていない',
  '銀河由来の項は、銀河を源 1 つの回転の場に置く宣言(距離 ÷ 銀河の半径は宣言のノブ)の下の数', '係数 c_R の入り方 k0・kP2・kI2・kI5 はどれも候補 —— 「要る c_R」は診断の列',
  '観測の歳差の角速度は第330便a の lib の値(文献の値・未照合)の固定の比べる列(合わせない)', 'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない(AN712)']);
/** 器の宣言(表に出す点) */
export const PLAN = Object.freeze({ pure: '零試験 10', balance: '15 組 × 候補 2 × q 3 × D₀ 2 × 重みの型 3(W3 は比 3)・衛星は母天体の項の列', ex120: '120° の例 × 重みの型(W1 は地球の行 × 候補 2 × q 3 × D₀ 2)',
  prec: '15 組 × 候補 2 × q 3(D₀ 0)', cRp2: '4 天体 × q 3 × c_R 3', cR: '代表の行 11 × q 3 × 入り方 2 × c_R 3', spread: '構造の組 4 × q 3 × 重み 2 × 入り方 2', rd: '11 天体', heat: 'イオ・木星 × q 3 × 候補 2 × 読み 3' });

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const D = L.DECL;
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 10,
    balance: J.balance.length === 15 * D.cands.length * D.q.length * D.d0k.length && J.balance.every((r) => Number.isFinite(r.W1.deltaDeg) && Number.isFinite(r.W2.deltaDeg)),
    ex120: J.ex120.rows.length === 1 + D.w3r.length + D.cands.length * D.q.length * D.d0k.length && Math.abs(J.ex120.rows[0].galDeg - 120) < 1e-9,
    prec: J.prec.length === 15 * D.cands.length * D.q.length,
    cRp2: J.cRp2.length === 12,
    cR: J.cR.length === 11 * D.q.length,
    spread: J.spread.length === 4 * D.q.length * 2 * 2,
    rd: J.rd.rows.length === 11,
    heat: J.heat.rows.length === 2 * D.q.length * D.cands.length,
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const B = L.makeBase(); mark('base');
  const PS = L.pureScenes(B), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const balance = L.balanceRows(B), ex120 = L.example120(balance); mark('balance');
  const prec = L.precRows(balance); mark('prec');
  const cRp2 = L.cRp2Rows(B), cR = L.cRRows(balance), spread = L.cRspread(cR), rd = L.rdRows(cR); mark('cR');
  const heat = L.heatRows(B); mark('heat');
  const J = { pure, balance, ex120, prec, cRp2, cR, spread, rd, heat, galDistM: L.galDistM(), timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w348c-axisbalance.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W348C_OUT ? (path.isAbsolute(process.env.W348C_OUT) ? process.env.W348C_OUT : path.join(ROOT, process.env.W348C_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第348便c axisbalance(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w348c-axisbalance.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-23 —— 第145報の回答 10)の AN976・統括の検証項目 R411',
    decl: L.DECL, lit: L.LIT, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第348便c', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'axisbalance', engine: 'Node(html を読まない —— 純関数の lib・枝 h の場の式を呼ぶ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
