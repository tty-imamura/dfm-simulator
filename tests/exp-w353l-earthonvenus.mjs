// 第353便l(原仮定者の回答(2026-11-25 —— 第151報)・統括の検証項目 R476):
//   **「金星は、自転に地球の影響が出るほどに釣り合っている」(原仮定者の文)を DFM の側で読む材料の器 —— 表 2 (E-S) ÷ 残り の走査(受け手の半径 × 源の半径 × (uV) の置き方)・
//   表 3 成分 × 位相・表 4 内合の前後の (E-M)・(E-S)・表 5 1 会合の平均と太陽由来の列・表 6 (L2) を全部の受け手で・表 7 残りの軸と内合の時の地球の向き・零試験 10**
//   (段 earthonvenus-353l —— 正本 tests/out/earthonvenus-353l.json・lib tests/lib-w353l-earthonvenus.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・既存の lib の本文は変えない。physics の鍵を足さない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w353l-earthonvenus.mjs —— 領域の宣言なし)。入力のファイルは無い(lib を呼んで作り直す)。
//   1 プロセス。正本は第338便c の settleRun で書く。**第353便g の lib を通して仮の値の lib(第352便b)に届く —— 正本の最上位に provisional: true と使った鍵の一覧**(表 7 の内合ごとの自転のずれだけ)。
//
// ■ 言わないこと: 地球の影響で逆回転した・ロックした、とは書かない(原仮定者の文として引く)。(E-M) と太陽由来の (M) は比べる列。置き方を決めない。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as Z from './lib-w353l-earthonvenus.mjs';
import * as E from './lib-w347e-spintorque.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w353l-earthonvenus-1';
export const OUT_MAIN = 'tests/out/earthonvenus-353l.json';
export const TARGET = 'tests/lib-w353l-earthonvenus.mjs';
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '候補の表 —— 地球の影響で逆回転した・ロックした、とは書かない(原仮定者の文として引くときだけ)',
  '(E-M) 地球との相対の運動の分と、太陽由来の (M) は比べる列(主の列は (S))—— 主の列を替える提案はしない',
  '受け手の半径の置き方・源の半径の置き方・(uV) の置き方は決めない。地球だけ観測の半径の列は、源の半径の基準(引きずる側は規則の半径)と違う比べる列',
  'ガリレオ衛星 3 つとタイタンは母天体の赤道の円の道(自転軸 = 母天体の自転軸)・太陽由来は母天体の位置の値で代える近似',
  '内合の時の地球の向きの経度はリポジトリに無い —— 最初の内合の経度はノブの格子。内合ごとの自転のずれ 0.513° は仮の値(仮・未照合)',
  'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない']);
export const PLAN = Object.freeze({
  pure: '零試験 10(第353便g の 1.10e-12・9.31e-14・4.93e9・(L2) 0.013274・第353便g と同じ・pointRot と otherSrc と同じ・統括の数え直し 3 の c_R の 5 行・(P-応) は比が規則の半径と同じ・(L2) を全部の受け手で〔第352便v と同じ〕・円の道の衛星・内合の算術・変異・拒否)',
  scan: '表 2 (E-S) ÷ 残り: 受け手の半径 10 × 源の半径の組 3 × (uV) の置き方 2',
  parts: '表 3 成分 3 × 位相 4',
  phase: '表 4 内合の前後の位相 12 × (E-M)・(E-S)',
  mean: '表 5 1 会合の平均と太陽由来の列 4',
  l2: '表 6 受け手 14 × 背景の倍率 4',
  conj: '表 7 最初の内合の経度の格子 6 × 内合 5',
});

export function gatesOf(J) {
  const D = Z.DECL;
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 10,
    scan: J.scan.length === D.cRGrid.length + 1 && J.scan.every((r) => D.srcCols.every((s) => D.uModes.every((u) => Number.isFinite(r[s.id + '|' + u]) && r[s.id + '|' + u] > 0))) && Math.abs(J.scanMax.pow - 2) < 1e-6,
    parts: J.parts.length === 3 && J.parts.every((r) => ['inf', 'sup', 'mean', 'mag'].every((k) => r[k] > 0)),
    phase: J.phase.length === D.phases.length && Number.isFinite(J.emZeroDeg) && J.emZeroDeg > 3 && J.emZeroDeg < 60,
    mean: J.mean.length === 4 && J.mean.every((r) => Math.abs(r.cosN) <= 1 + 1e-12),
    l2: J.l2.length === D.recvs.length && J.l2.every((r) => Math.abs(r['L2_0.98'] - 1) < 1e-9) && J.l2.find((r) => r.key === 'Venus').rankUV === 1,
    conj: J.conj.length === D.dGrid.length && J.conj.every((r) => r.angles.length === D.nConj && r.min <= r.max),
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const T1 = E.t1Table(), GEO = E.geometry(), cache = {}; mark('input');
  const PS = Z.pureScenes(T1, GEO), pure = { scenes: PS, gates: Z.pureGates(PS) }; mark('pure');
  const scan = Z.scanRows(T1, GEO, cache), scanMax = Z.scanMax(scan, T1, GEO, cache); mark('scan');
  const parts = Z.partRows(T1, GEO, cache); mark('parts');
  const phase = Z.phaseRows(T1, GEO, cache), emZeroDeg = Z.emZeroDeg(T1, GEO); mark('phase');
  const mean = Z.meanRows(T1, GEO, cache); mark('mean');
  const l2 = Z.l2Rows(T1, GEO, cache); mark('l2');
  const resAxis = Z.resAxis(T1, GEO), conjStep = Z.conjStep(), conj = Z.conjRows(T1, GEO); mark('conj');
  const J = { pure, scan, scanMax, parts, phase, emZeroDeg, mean, l2, resAxis, conjStep, conj, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w353l-earthonvenus.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W353L_OUT ? (path.isAbsolute(process.env.W353L_OUT) ? process.env.W353L_OUT : path.join(ROOT, process.env.W353L_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第353便l earthonvenus(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { provisional: true, provKeys: [...Z.DECL.provKeys], provMark: '仮・未照合',
    version: HARNESS_VERSION, libVersion: Z.LIB_VERSION, generator: 'tests/exp-w353l-earthonvenus.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-25 —— 第151報)・統括の検証項目 R476', decl: Z.DECL, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第353便l', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'earthonvenus', engine: 'Node(html を読まない —— 純関数の lib・第353便g・c・d・第352便h・k・v・c・d・第351便c ほかの lib を呼ぶ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
