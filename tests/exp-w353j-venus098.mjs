// 第353便j(原仮定者の回答(2026-11-25 —— 第151報)・統括の検証項目 R474):
//   **金星の条件と注目の列 u = 0.98 を同時に置く道の器 —— 表 1 金星が打ち消す組(入れ方 × c_R → 要る k・金星の残り・金星の合成の向き)/
//   表 2 その組を全部の受け手(8 惑星 + 太陽 + 月・イオ・冥王星)に同じに掛けたときの副作用と題の欄(土星の環・地球の傾き・公転面の集まり)/
//   表 3 金星とイオを同じ組で・零試験 11**(段 venus098-353j —— 正本 tests/out/venus098-353j.json・lib tests/lib-w353j-venus098.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・既存の lib の本文は変えない。physics の鍵を足さない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w353j-venus098.mjs —— 領域の宣言なし)。入力のファイルは無い(lib を呼んで作り直す)。
//   1 プロセス。正本は第338便c の settleRun で書く。仮の値は第352便b の器の数だけ(表 2 の地球・火星・金星の並べ —— 正本の最上位に provisional: true と鍵の一覧)。
//
// ■ 言わないこと: 係数 k・c_R を決めない。金星の打ち消しが保たれるとも、組が選べたとも書かない(この場・この入れ方・この係数では、の表)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as F from './lib-w353j-venus098.mjs';
import * as E from './lib-w347e-spintorque.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w353j-venus098-1';
export const OUT_MAIN = 'tests/out/venus098-353j.json';
export const TARGET = 'tests/lib-w353j-venus098.mjs';
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '金星が打ち消す組の表 —— 換算の係数 k と受け手の半径の係数 c_R を決めない(どの組も候補)',
  '金星の残りは大きさが同じ点の幾何(2 sin(φ/2))—— 打ち消しが保たれるとは書かない',
  '副作用の表の物差し(局所 ÷ 背景 0.1)は目安 —— 合否にしない。観測の当たり所との食い違いは印で並べる(合否ではない)',
  '地球・火星・金星の歳差の回る向きの並べは仮の値(未照合)を使う —— 合否にしない',
  '太陽の受け手は受け手の半径の口が無い(規則の半径のまま)・土星の環と公転面の集まりは輪の受け手(受け手の半径の口が無い —— k だけ)',
  'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない']);
export const PLAN = Object.freeze({
  pure: '零試験 11(枝 e の k 8.22e11・統括の数え直し 3 の金星の 6 行・枝 e の table3Recv と fMaxAt と同じ・(P-応) の k = 規則・(P-場) = 枝 c の sOf・衛星の局所 = 第352便za・地球の傾きの欄 = 第352便za・金星の等大の残りの直接と閉じた形・基準軸 L と ω_G・拒否)',
  t1: '表 1: 組 8(規則の半径・(P-場) c_R 6・(P-応))—— 要る k・金星の残り・金星の合成の向き',
  t2: '表 2: 組 8 × 受け手 12 —— 局所 ÷ 背景・合成と L の角・円錐・自転と合成の順逆・f の上限・(g2−) の回る向き・仮の値との並べ/題の欄 3',
  t3: '表 3: 組 8 —— イオの x・イオ自身の残り・金星の k でのイオの合成 ÷ 背景・σ(第353便d (O2b) 木星)の列',
});
export const PROV_KEYS = Object.freeze(['earth.psiA.rate', 'earth.precSense', 'mars.prec.rate', 'venus.prec.rate']);

export function gatesOf(J) {
  const D = F.DECL, nC = 2 + D.cRField.length;
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 11,
    t1: J.t1.length === nC && J.t1.every((r) => Math.abs(r.kv.k * r.kv.uEqualOverK / D.uFocus - 1) < 1e-12)
      && J.t1.filter((r) => r.combo.edge === 'e2').every((r) => Math.abs(r.kv.residEqual - 0.02) < 1e-6) && J.t1.filter((r) => r.combo.edge === 'e5').every((r) => Math.abs(r.kv.residEqual - 0.05) < 1e-6),
    t2: J.t2.pairs.length === nC && J.t2.pairs.every((p) => p.rows.length === D.recvs.length && Math.abs(p.rows.find((r) => r.key === 'Venus').locOverBg - 1) < 1e-9)
      && J.t2.topics.length === nC && J.t2.topic1.k === 1 && J.t2.summary.overAll.length + J.t2.summary.overNone.length + J.t2.summary.overSome.length === D.recvs.length,
    t3: J.t3.length === nC && J.t3.every((r) => r.ioTot > 0 && r.sigma > 1),
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const T1 = E.t1Table(), GEO = E.geometry(), cache = {}; mark('input');
  const PS = F.pureScenes(T1, GEO), pure = { scenes: PS, gates: F.pureGates(PS) }; mark('pure');
  const C = F.combos(T1, GEO), P = C.map((c) => F.pairRow(c, { T1, GEO, cache }));
  const t1 = P.map((p) => { const v = p.rows.find((r) => r.key === 'Venus'); return { combo: p.combo, kv: p.kv, venus: { omOverBg: v.omOverBg, omToAxisDeg: v.omToAxisDeg, coneDeg: v.coneDeg, relOm: v.relOm, relAx: v.relAx } }; }); mark('t1');
  const topics = C.map((c, i) => F.topicRow({ k: P[i].kv.k, cR: c.cR, place: c.place, T1, GEO, cache }));
  const overIn = (key) => P.filter((p) => p.rows.find((r) => r.key === key).over).length;
  const summary = { overAll: F.DECL.recvs.filter((k) => overIn(k) === P.length), overNone: F.DECL.recvs.filter((k) => overIn(k) === 0), overSome: F.DECL.recvs.filter((k) => overIn(k) > 0 && overIn(k) < P.length),
    topicAll: F.DECL.topics.filter((t) => topics.every((r) => r[t] > 1 + 1e-6)), topicNone: F.DECL.topics.filter((t) => topics.every((r) => !(r[t] > 1 + 1e-6))) };
  const topic1 = F.topicRow({ k: 1, place: 'rule', T1, GEO, cache });   // k 1・規則の半径(比べる列 —— 背景だけの分)
  const t2 = { pairs: P.map((p) => ({ id: p.combo.id, rows: p.rows })), topics, topic1, summary }; mark('t2');
  const t3 = C.map((c) => ({ id: c.id, ...F.ioRow(c.place === 'resp' ? null : c.cR, { place: c.place === 'resp' ? 'rule' : c.place, T1, GEO }) }))
    .map((r) => ({ ...r, both10: r.venusResid <= 0.1 && r.ioTot <= 0.1, both20: r.venusResid <= 0.2 && r.ioTot <= 0.2, both10s: r.venusResid <= 0.1 && r.ioTotSigma <= 0.1, both20s: r.venusResid <= 0.2 && r.ioTotSigma <= 0.2 })); mark('t3');
  const J = { pure, t1, t2, t3, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w353j-venus098.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W353J_OUT ? (path.isAbsolute(process.env.W353J_OUT) ? process.env.W353J_OUT : path.join(ROOT, process.env.W353J_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第353便j venus098(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const pv = S.value.t2.pairs[0].rows.find((r) => r.key === 'Earth').prov;
  const out = { version: HARNESS_VERSION, libVersion: F.LIB_VERSION, generator: 'tests/exp-w353j-venus098.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-25 —— 第151報)・統括の検証項目 R474', provisional: true, provKeys: PROV_KEYS.slice(), provMark: pv.provMark,
    decl: F.DECL, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第353便j', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'venus098', engine: 'Node(html を読まない —— 純関数の lib・第353便b・c・d・e・第352便w・za・d・k・j の lib を呼ぶ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
