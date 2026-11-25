// 第353便u(原仮定者の回答(2026-11-25 —— 第151報)・統括の検証項目 R485):
//   **注目の列 u = 0.98 で金星を打ち消す換算の係数 k を置いたときの、局所の項が背景に並ぶ受け手(水星・地球・火星・月・イオ)の状態の器 ——
//   表 1 受け手 5 × 組 9(k 1 + 第353便j の組 8)の合成の向き・円錐・順逆・回る向き・率・一周・f の上限・公転の極に対する傾きの揺れ/
//   表 2 観測の当たり所との並べ(地球・火星の歳差の率 —— 重力の側の列は比べる列・仮の値は印つき/水星・月・イオのリポジトリの自転と公転)/
//   表 3 並びを決める量(8 惑星 × 組 9 —— 距離の比の 3 乗・自分の重み ÷ 源の重み・閉じた形の候補)・零試験 12**
//   (段 nearrecv-353u —— 正本 tests/out/nearrecv-353u.json・lib tests/lib-w353u-nearrecv.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・既存の lib の本文は変えない。physics の鍵を足さない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w353u-nearrecv.mjs —— 領域の宣言なし)。入力のファイルは無い(lib を呼んで作り直す)。
//   1 プロセス。正本は第338便c の settleRun で書く。仮の値は第352便b の器の数だけ(表 2 の地球・火星 —— 正本の最上位に provisional: true と鍵の一覧)。
//
// ■ 言わないこと: k・c_R を決めない。水星の歳差を説明する表ではない・食い違いが無いとも書かない(状態の表)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as U from './lib-w353u-nearrecv.mjs';
import * as E from './lib-w347e-spintorque.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w353u-nearrecv-1';
export const OUT_MAIN = 'tests/out/nearrecv-353u.json';
export const TARGET = 'tests/lib-w353u-nearrecv.mjs';
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '受け手 5 つの状態の表 —— 換算の係数 k と受け手の半径の係数 c_R を決めない(どの組も候補)',
  '観測の当たり所との並べは食い違いの表 —— 合否にしない。水星の歳差を説明する表ではない・食い違いが無いとも書かない',
  '地球・火星の歳差の率の残りと回る向きは仮の値(未照合)を使う —— 合否にしない。重力の側の潮汐のトルクの列は比べる列(DFM の式ではない)',
  '並びの閉じた形 (A0_規則 + wS) ÷ (A0 + wS) は自分の重みが源の重みより十分大きい側の候補 —— 外れの大きさを並べる',
  'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない']);
export const PLAN = Object.freeze({
  pure: '零試験 12(第353便j の表 4・表 5 の数・衛星の作り直し = sideRow・率 = 第353便b の precRate・f の上限 = 第353便e の fMaxAt・揺れ = 第353便n の watchRow・軸引きずり = 第353便f の dragRate・自転と公転 = 第352便q の structOf・閉じた形の候補・k 8.22e11・基準軸 L と ω_G・拒否)',
  t1: '表 1: 受け手 5 × 組 9 —— 合成と L の角・円錐・自転と合成の順逆・(g2−) の回る向き・率・一周の年数・f の上限・公転の極に対する傾き ε₀ と揺れの幅',
  t2: '表 2: 地球・火星 —— 軸引きずり ÷ 重力の側の列・残りを埋める c(地球は月の道の平均の列も)・仮の値の回る向き/水星・月・イオ —— リポジトリの自転 ÷ 公転・ε₀・合成と公転の極の角',
  t3: '表 3: 8 惑星 × 組 9 —— 距離の比の 3 乗・自分の重み ÷ 源の重み・(S) の倍 g と候補 g*・局所 ÷ 背景・閉じた形の候補 ÷ 局所 ÷ 背景・「岩石の惑星は局所・木星より外は背景」の分け',
});
export const PROV_KEYS = Object.freeze(['earth.precSense', 'earth.psiA.rate', 'mars.prec.rate']);

export function gatesOf(J) {
  const nC = U.DECL.comboIds.length, rocky = ['Mercury', 'Earth', 'Mars'], outer = ['Jupiter', 'Saturn', 'Uranus', 'Neptune'];
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 12,
    t1: J.t1.length === U.DECL.recvs.length && J.t1.every((b) => b.rows.length === nC && b.rows[0].combo === 'k1' && b.rows[0].k === 1 && b.rows.every((r) => r.W > 0 && Math.abs(r.periodYr * r.W * 365.25 * 86400 / (2 * Math.PI) - 1) < 1e-12)),
    t2: J.t2.prec.length === 2 * nC && J.t2.prec.every((r) => r.provisional === true && Math.abs(r.cNeed * r.drag / r.resid - 1) < 1e-12) && J.t2.spin.length === 3 * nC,
    t3: J.t3.rows.length === nC && J.t3.rows.every((c) => c.items.length === 8) && J.t3.picture.length === nC
      && J.t3.picture.every((p) => p.k1 || (p.rockyOver === rocky.every((k) => J.t3.rows.find((c) => c.combo === p.combo).items.find((x) => x.key === k).over)
        && p.outerUnder === outer.every((k) => !J.t3.rows.find((c) => c.combo === p.combo).items.find((x) => x.key === k).over))),
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const T1 = E.t1Table(), GEO = E.geometry(), cache = {}, fc = {}; mark('input');
  const PS = U.pureScenes(T1, GEO), pure = { scenes: PS, gates: U.pureGates(PS) }; mark('pure');
  const C = U.comboList(T1, GEO);
  const t1 = U.DECL.recvs.map((key) => ({ key, rows: C.map((c) => U.pub(U.nearState(key, c, { T1, GEO, cache }))) })); mark('t1');
  const obs = U.DECL.recvs.flatMap((key) => C.map((c) => U.obsRow(key, c, { T1, GEO, cache, fc })));
  const pick = (r, ks) => Object.fromEntries(ks.map((k) => [k, r[k] === undefined ? null : r[k]]));
  const prec = obs.filter((r) => r.kind === 'prec').map((r) => pick(r, ['key', 'combo', 'k', 'pole', 'drag', 'tide', 'dragOverTide', 'resid', 'cNeed', 'residAvg', 'cNeedAvg', 'provSame', 'relOrb', 'relAx', 'coneDeg', 'provisional', 'provMark', 'provKeys']));
  const spin = obs.filter((r) => r.kind === 'spin').map((r) => pick(r, ['key', 'combo', 'k', 'src', 'spinOverOrbit', 'spinPeriodDay', 'orbitPeriodDay', 'eps0Deg', 'omToOrbDeg', 'coneDeg', 'spinOm', 'relOm', 'relOrb', 'wob']));
  const t2 = { prec, spin }; mark('t2');
  const rows = C.map((c) => ({ combo: c.id, items: U.DECL.orderRecvs.map((key) => U.orderRow(key, c, { T1, GEO, cache })) }));
  const rocky = ['Mercury', 'Earth', 'Mars'], outer = ['Jupiter', 'Saturn', 'Uranus', 'Neptune'];
  const picture = rows.map((c) => ({ combo: c.combo, k1: c.combo === 'k1', rockyOver: rocky.every((k) => c.items.find((x) => x.key === k).over), outerUnder: outer.every((k) => !c.items.find((x) => x.key === k).over),
    minRocky: Math.min(...rocky.map((k) => c.items.find((x) => x.key === k).locOverBg)), maxOuter: Math.max(...outer.map((k) => c.items.find((x) => x.key === k).locOverBg)) }));
  const t3 = { rows, picture }; mark('t3');
  const J = { pure, t1, t2, t3, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w353u-nearrecv.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W353U_OUT ? (path.isAbsolute(process.env.W353U_OUT) ? process.env.W353U_OUT : path.join(ROOT, process.env.W353U_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第353便u nearrecv(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: U.LIB_VERSION, generator: 'tests/exp-w353u-nearrecv.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-25 —— 第151報)・統括の検証項目 R485', provisional: true, provKeys: PROV_KEYS.slice(), provMark: S.value.t2.prec[0].provMark,
    decl: U.DECL, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第353便u', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'nearrecv', engine: 'Node(html を読まない —— 純関数の lib・第353便j・e・n・f・m・c・第352便w・d・k・q・第351便c の lib を呼ぶ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
