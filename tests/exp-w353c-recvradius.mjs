// 第353便c(原仮定者の回答(2026-11-25 —— 第151報)AN1045・向きと幾何の採用・統括の検証項目 R467):
//   **受け手(引きずられる側)の半径 = 観測半径 × 構造の係数 —— 入れ方の候補 3 つ((P-場)・(P-応)・(P-平))で、金星とイオの打ち消し・全部の受け手の向き・主の表の合成の向き・応答の側の率の倍を数える器 ——
//   表 1 金星(入れ方 3 × c_R 1e-6〜1)と帯の端・表 2 全部の受け手(15 組)とイオ・表 3 主の表への影響(8 惑星 × 列 5 × 背景の倍率 3)と動き始める倍率・表 4 (P-応) の率の倍・零試験 8**
//   (段 recvradius-353c —— 正本 tests/out/recvradius-353c.json・lib tests/lib-w353c-recvradius.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・既存の lib の本文は変えない。physics の鍵を足さない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w353c-recvradius.mjs —— 領域の宣言なし)。入力のファイルは無い(lib を呼んで作り直す)。
//   1 プロセス。正本は第338便c の settleRun で書く。仮の値の lib は使わない(閉包に入らない)。
//
// ■ 言わないこと: 構造の係数・入れ方を決めない。金星の構造が測れたとは書かない。打ち消しが保たれると決まったとは書かない(この場・この入れ方・この係数では、の表)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as Z from './lib-w353c-recvradius.mjs';
import * as E from './lib-w347e-spintorque.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w353c-recvradius-1';
export const OUT_MAIN = 'tests/out/recvradius-353c.json';
export const TARGET = 'tests/lib-w353c-recvradius.mjs';
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '候補の表 —— 構造の係数・受け手の半径の入れ方を決めない。金星の構造が測れたとは書かない',
  '打ち消しの残りの帯(2%・5%)は数える目安の帯 —— 判定ではない',
  '(P-応) の物差し(c_ref 0.4・R_ref 規則/観測)はノブ —— どちらにも寄せない',
  '慣性モーメントの係数はリポジトリに在る文献の値(未照合)—— 無い天体はノブ',
  '主の列 (S)・(N+)・基準軸 L を先頭に・比べる列 (G−)・eq・規則の半径を残す',
  'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない']);
export const PLAN = Object.freeze({
  pure: '零試験 8(基準軸 L と ω_G・統括の数え直し 3 の金星の 6 行・8 惑星の φ・入れ方の照合〔(P-場) = spinRot の cR・(P-応) の向き = 規則・(P-平) で a = 規則 = 規則〕・cR★・率の倍・残りの式・拒否)',
  t1: '表 1 金星: 入れ方 3 × c_R 14(φ・等大の残り・下限・等大の倍率 ÷ k・比べる列 eq と (G−))と帯の端(入れ方 3 × 基準軸 2 × 帯 2)',
  t2: '表 2 全部の受け手: 組 15(cR★・自分の重み ÷ 源の重み・φ と残り〔規則・(P-場) 1・(P-平) 1〕)とイオ(x と残り —— 入れ方 2 × c_R 14 + 規則)',
  t3: '表 3 主の表への影響: 8 惑星 × 背景の倍率 3 × 列 5(合成と L の角・円錐・回る向き)と動き始める倍率(8 惑星 × (P-場) 3)',
  t4: '表 4 (P-応) の率の倍: 天体 11 × R_ref 2 × 係数(文献の値・格子 2)',
});

export function gatesOf(J) {
  const D = Z.DECL;
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 8,
    t1: J.t1.length === 3 * D.cRGrid.length && J.t1.filter((r) => r.place === 'resp').every((r) => Math.abs(r.phiDeg / J.bands.rule.phiDeg - 1) < 1e-9)
      && J.bands.rows.length === 3 * D.axes.length * D.bands.length && J.bands.rows.filter((r) => r.place === 'resp').every((r) => r.cR === null && r.below === false),
    t2: J.t2.length === D.pairs.length && J.io.length === 1 + 2 * D.cRGrid.length,
    t3: J.t3.length === D.planets.length * D.uCols.length * Z.T3COLS.length && J.t3.filter((r) => r.col === 'rule' || r.col === 'resp').every((r) => Math.abs(r.dTot) < 1e-6) && J.uMove.length === D.planets.length * 3,
    t4: J.t4.length === 11 && J.t4.find((r) => r.id === 'Earth').relRule === 1 && J.t4.find((r) => r.id === 'Pluto').multRule === null,
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const T1 = E.t1Table(), GEO = E.geometry(); mark('input');
  const PS = Z.pureScenes(T1, GEO), pure = { scenes: PS, gates: Z.pureGates(PS) }; mark('pure');
  const t1 = Z.t1Rows(T1, GEO), bands = Z.t1Bands(T1, GEO); mark('t1');
  const t2 = Z.t2Rows(T1, GEO), io = Z.ioRows(T1, GEO); mark('t2');
  const t3 = Z.t3Rows(T1, GEO), uMove = Z.uMoveRows(T1, GEO); mark('t3');
  const t4 = Z.t4Rows(); mark('t4');
  const J = { pure, t1, bands, t2, io, t3, uMove, t4, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w353c-recvradius.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W353C_OUT ? (path.isAbsolute(process.env.W353C_OUT) ? process.env.W353C_OUT : path.join(ROOT, process.env.W353C_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第353便c recvradius(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: Z.LIB_VERSION, generator: 'tests/exp-w353c-recvradius.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-25 —— 第151報)・統括の検証項目 R467', decl: Z.DECL, t3cols: Z.T3COLS, anchor: Z.ANCHOR, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第353便c', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'recvradius', engine: 'Node(html を読まない —— 純関数の lib・第352便k・c・d・第351便k ほかの lib を呼ぶ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
