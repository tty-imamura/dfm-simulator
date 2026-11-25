// 第353便b(原仮定者の回答(2026-11-25 —— 第151報)・統括の検証項目 R466):
//   **主の列の表の器 —— 表 1 主の表(8 惑星と太陽 × 背景の倍率 6 —— 合成と基準軸の角・円錐・局所 ÷ 背景・(g2−) の回る向き・単位の応答の率と一周の年数 + 比べる列 (g2+)・(G−)・eq)・
//   表 2 回る向きのまとめ(倍率 0.98 —— 順回転か → (g2−) で回る向き + 仮の値との並べ〔仮・未照合〕)・表 3 u への依存・零試験 13**
//   (段 maincol-353b —— 正本 tests/out/maincol-353b.json・lib tests/lib-w353b-maincol.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・既存の lib の本文は変えない。physics の鍵を足さない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w353b-maincol.mjs —— 領域の宣言なし)。入力のファイルは無い(lib を呼んで作り直す)。
//   1 プロセス。正本は第338便c の settleRun で書く。仮の値(第352便b)を表 2 の並べに使うので、正本の最上位に provisional: true と使った鍵の一覧を持つ。
//
// ■ 言わないこと: 歳差の向きの答え・観測との比べの答えとは書かない(この列・この倍率では、の表)。仮の値との並べは合否にしない。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as M from './lib-w353b-maincol.mjs';
import * as B from './lib-w352b-provisional.mjs';
import * as E from './lib-w347e-spintorque.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w353b-maincol-1';
export const OUT_MAIN = 'tests/out/maincol-353b.json';
export const TARGET = 'tests/lib-w353b-maincol.mjs';
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '候補の表 —— 歳差の向きの答え・観測との比べの答えとは書かない(この列・この倍率では)',
  '歳差の率と向きの本体は重力の側の潮汐のトルクの列(比べる列 —— DFM の式ではない)で読むのが主の読み。ここの率は軸引きずりの単位の応答(k₂ 1・比 1)',
  '仮の値(第352便b)との並べは「仮・未照合」の印つき —— 較正の合否・サンプルの状況・ノブの採否に入れない',
  '比べる列 (g2+)・(G−)・eq は消さずに残す(主の列と同じ重さでは扱わない)',
  '倍率 0.98 は (N+) の窓の上端 0.835 より上(窓の外)—— 注目の列として置くだけ',
  'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない']);
export const PLAN = Object.freeze({
  pure: '零試験 13(第352便j の cellOf・第352便w の stateW・第352便e の sunTotal と同じ数・統括の数え直し 3〔基準軸 L・金星の受け手の半径の表・8 惑星の φ〕・(g2±) の符号・単位の応答・k・太陽の円錐・変異 3・仮の値の印・拒否)',
  t1: '表 1 主の表: 受け手 9 × 倍率 6(主の列 + 比べる列 3)',
  t2: '表 2 回る向きのまとめ: 受け手 9(倍率 0.98)+ 仮の値との並べ(地球・火星・金星 × (g2−)・(g2+))',
  t3: '表 3 u への依存: 受け手 9(倍率 6 の上の幅)',
  t4: '表 4 受け手の半径の置き方 cR への依存(窓の下端 0.0487・8 惑星 × cR 3 —— 枝 c の候補の前の物差し)',
});
export const PROV_BODIES = Object.freeze(['Earth', 'Mars', 'Venus']);

export function gatesOf(J) {
  const D = M.DECL, nB = D.bodies.length, nU = D.uGrid.length;
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 13,
    t1: J.t1.length === nB * nU && J.t1.every((r) => r.main && r.cmp && D.cmps.every((c) => r.cmp[c.id])) && J.t1.every((r) => r.main.relOm === -r.main.spinOm && r.cmp.g2p.relOm === r.main.spinOm),
    t2: J.t2.rows.length === nB && J.t2.prov.length === PROV_BODIES.length * 2 && J.t2.prov.every((r) => r.provisional === true && r.provMark === B.MARK),
    t3: J.t3.length === nB && J.t3.every((r) => r.flipsOm === 0 && r.flipsAx === 0),
    t4: J.t4.length === D.planets.length && J.t4.every((r) => r.rows.length === 3),
    mark: J.provisional === true && Array.isArray(J.provKeys) && J.provKeys.length > 0 && B.outMarkProblems(J).length === 0,
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const T1 = E.t1Table(), GEO = E.geometry(), cache = {}; mark('input');
  const PS = M.pureScenes(T1, GEO), pure = { scenes: PS, gates: M.pureGates(PS) }; mark('pure');
  const t1 = M.mainTable(M.DECL.uGrid, T1, GEO, cache); mark('t1');
  const rows = M.DECL.bodies.map((id) => M.senseRow(T1, GEO, id, {}, cache));
  const prov = PROV_BODIES.flatMap((id) => M.DECL.senses.map((sense) => ({ ...M.provRow(T1, GEO, id, { sense }, cache), sense })));
  const t2 = { rows, prov }; mark('t2');
  const t3 = M.DECL.bodies.map((id) => M.uDepRow(T1, GEO, id, {}, cache)); mark('t3');
  const t4 = M.DECL.planets.map((id) => M.cRDepRow(T1, GEO, id, {}, cache)); mark('t4');
  const provKeys = [...new Set(prov.flatMap((r) => r.provKeys))].sort();
  const J = { provisional: true, provKeys, pure, t1, t2, t3, t4, timing: tm };
  J.gates = gatesOf({ ...J, meta: { code: [B.PROV_LIB] } }); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w353b-maincol.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W353B_OUT ? (path.isAbsolute(process.env.W353B_OUT) ? process.env.W353B_OUT : path.join(ROOT, process.env.W353B_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第353便b maincol(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const { provisional, provKeys, ...rest } = S.value;
  const out = { provisional, provKeys, provMark: B.MARK, version: HARNESS_VERSION, libVersion: M.LIB_VERSION, generator: 'tests/exp-w353b-maincol.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-25 —— 第151報)・統括の検証項目 R466', main: M.MAIN, decl: M.DECL, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...rest, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第353便b', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'maincol', engine: 'Node(html を読まない —— 純関数の lib・第352便k・d・c・e・w・j・b の lib を呼ぶ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
