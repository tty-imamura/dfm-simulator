// 第353便zk(原仮定者の補足(2026-11-25 —— 第152報)・原仮定者の回答(2026-11-25 —— 第151報)AN1034・原仮定者の指示(2026-11-14 —— 第138報)・統括の検証項目 R501):
//   **潮汐ロックの定義の不等式(軸引きずりの影響 < 潮汐力)を、主の列の候補 3 本((ア)(イ)(ウ))で、比 X = 潮汐のトルク ÷ 軸引きずりの直交成分のトルク として数える器 ——
//   表 1 X(天体 10 × 列 3 × 置き方 3 × k₂/Q 2)と X = 1 になる自転周期/表 2 1 本の線(比 1)で分かれるか・k₂/Q の範囲/表 3 背景の大きさ u で分かれる範囲/
//   表 4 金星 —— 地球の影響/表 5 同時にロックの整数の並び(算術・仮)/表 6 言えること・言えないこと・零試験 10**
//   (段 lockdef-353zk —— 正本 tests/out/lockdef-353zk.json・lib tests/lib-w353zk-lockdef.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・既存の lib の本文は変えない。physics の鍵を足さない。潮汐のトルクは全部「比べる列(DFM の式ではない)」。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w353zk-lockdef.mjs —— 領域の宣言なし)。入力のファイルは無い(lib を呼んで作り直す)。
//   1 プロセス。正本は第338便c の settleRun で書く。仮の値の lib(第352便b)は閉包に入る —— 表 5 は金星の仮の自転周期を読む(正本の最上位に provisional: true と鍵の一覧)。
//
// ■ 言わないこと: ロックの由来・定義との当否・背景の大きさを結論にしない(比の表 —— 候補)。k₂/Q は未照合のノブ。大気熱潮汐は数えない。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as Z from './lib-w353zk-lockdef.mjs';
import * as E from './lib-w347e-spintorque.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w353zk-lockdef-1';
export const OUT_MAIN = 'tests/out/lockdef-353zk.json';
export const TARGET = 'tests/lib-w353zk-lockdef.mjs';
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '比の表 —— ロックの状態を作ったとは書かない・定義との当否を結論にしない。ロックの状態は観測の事実として置く(積分で作らない)',
  '潮汐のトルクは比べる列(DFM の式ではない)—— k₂/Q はノブ(値は未照合)。大気熱潮汐は数えない',
  '背景の大きさを置かない —— 表 3 は線で分かれる u の範囲の並べ(窓に足すかは決断事項の候補)',
  '表 5 は算術(仮の自転周期 —— 仮・未照合)—— どの整数が選ばれるかは数えない',
  'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない']);
export const PLAN = Object.freeze({
  pure: '零試験 12(統括の数え直し 8・地球 → 金星の潮汐の比・第337便c の tide[].N・第353便zf の uV・第353便j の kFor・Ω = 第353便j の sideRow・第353便g の残り 1.44e-29 と (E-S) ÷ 残り・いまの N・k₂/Q に比例・衛星の母天体の扁平の倍 (O2b)・第337便c のロックへ入る時間 ÷ 年齢・土星の数の出どころ)',
  t1: '表 1: 天体 10 × 列 3 × 置き方 3 × k₂/Q 2 の X と、X = 1 になる自転周期(直交成分 2 通り)と公転の周期との比',
  t2: '表 2: 列 × 置き方 × k₂/Q × 「ある程度ロック」の数え方 2 の帯(ロックの側の最小・ロックしない側の最大)・線 1 で分かれるか・外れる天体・k₂/Q を共通で振ったときの範囲・表 2c 第337便c のロックへ入る時間 ÷ 年齢と要る k₂/Q(比べる列)の分かれ方',
  t3: '表 3: 列 (ア)(イ) × 置き方 3 × k₂/Q 2 で背景の倍率 u を 1e-3〜1e2 に振ったときの線 1 で分かれる範囲と、窓・0.98・(uV) の内外',
  t4: '表 4: 金星 × 列 3 —— 残る軸引きずりのトルクに対する地球の潮汐(内合・1 会合の平均)・(E-g) の最大(格子 3)・太陽の潮汐の比と、地球の項が届くのに要る残り ÷ 背景・(B − A)/C',
  t5: '表 5: 1 会合の間の金星の太陽日の数 N(いま)と、N = −8〜+3 の自転周期と向き(仮)',
  t6: '表 6: 言えること・言えないこと(列 3)',
});
export const PROV_KEYS = Object.freeze(['earth.precSense', 'earth.psiA.rate', 'mars.prec.rate', 'venus.prec.rate', 'venus.spin.period']);

export function gatesOf(J) {
  const D = Z.DECL, nT1 = D.cols.length * D.modes.length * D.k2qModes.length;
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 12,
    t1: J.t1.x.length === nT1 && J.t1.x.every((r) => r.rows.length === D.bodies.length && r.rows.every((q) => q.X > 0)) && J.t1.p.length === D.bodies.length * D.cols.length * D.k2qModes.length && J.t1.ob.length === 2 * D.cols.length * D.modes.length && J.t1.ob.every((r) => r.sigma > 1 && r.xNone > 0),
    t2: J.t2.sep.length === nT1 * 2 && J.t2.sep.every((r) => r.atOne === (r.lockMin > 1 && r.notMax < 1) && r.separable === (r.lockMin > r.notMax)) && J.t2.k2q.length === D.cols.length * D.modes.length * 2 && J.t2.despin.rows.length === D.bodies.length && J.t2.despin.sep.length === 4,
    t3: J.t3.length === 2 * D.modes.length * D.k2qModes.length && J.t3.every((r) => r.ranges.every((q) => q.lo < q.hi)),
    t4: J.t4.rows.length === D.cols.length && J.t4.rows.every((r) => r.eg.length === D.qGrid.length && Math.abs(r.qNeed * r.eg[0].ratio / r.eg[0].q - 1) <= 1e-9),
    t5: J.t5.grid.length === D.nGrid.length && J.t5.grid.every((r) => (r.sense === 'retro') === (r.spinDays < 0)),
    t6: J.t6.length === D.cols.length,
  };
}
const pickB = (b) => ({ id: b.id, state: b.state, kind: b.kind, M: b.M, R: b.R, C: b.C, I: b.I, spin: b.spin, nOrb: b.nOrb, a: b.a, pert: b.pert, Mp: b.Mp, src: b.src });
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const T1 = E.t1Table(), GEO = E.geometry(), o = { T1, GEO }, D = Z.DECL; mark('input');
  const PS = Z.pureScenes(T1, GEO), pure = { scenes: PS, gates: Z.pureGates(PS) }; mark('pure');
  const bodies = D.bodies.map((id) => pickB(Z.bodyOf(id, o)));
  const om = D.cols.flatMap((c) => D.bodies.map((id) => { const w = Z.omOf(id, c, {}, o); return { col: c, id, u: w.u, k: w.k, W: w.W, perp: w.perp, bgMag: w.bgMag }; }));
  const k2qv = Object.fromEntries(D.k2qModes.map((q) => [q, Object.fromEntries(D.bodies.map((id) => [id, Z.k2qOf(id, q)]))]));
  const x = D.cols.flatMap((c) => D.modes.flatMap((m) => D.k2qModes.map((q) => ({ col: c, mode: m, k2q: q, rows: Z.xRows(c, { mode: m, k2q: q }, o) }))));
  const p = D.cols.flatMap((c) => D.k2qModes.flatMap((q) => D.bodies.map((id) => { const a = Z.pCrit(id, c, { k2q: q }, o), b = Z.pCrit(id, c, { k2q: q, perpMode: 'abs' }, o);
    return { col: c, k2q: q, id, days: a.days, overPorb: a.overPorb, daysAbs: b.days, overPorbAbs: b.overPorb, porbDays: a.porbDays }; })));
  const ob = ['Moon', 'Io'].flatMap((id) => D.cols.flatMap((c) => D.modes.map((m) => ({ id, col: c, mode: m, sigma: Z.sigmaHost(id), xO2b: Z.xOf(id, c, { mode: m }, o), xNone: Z.xOf(id, c, { mode: m, ob: 'none' }, o) }))));
  const t1 = { bodies, om, k2qv, x, p, ob }; mark('t1');
  const sep = x.flatMap((r) => [true, false].map((pl) => ({ col: r.col, mode: r.mode, k2q: r.k2q, partAsLock: pl, ...Z.separateAt(r.rows, { partAsLock: pl }) })));
  const k2q = D.cols.flatMap((c) => D.modes.flatMap((m) => [true, false].map((pl) => ({ col: c, mode: m, partAsLock: pl, ...Z.k2qBand(c, { mode: m, partAsLock: pl }, o) }))));
  const dr = Z.despinRows(), despin = { rows: dr, sep: ['ageRatio', 'kqReq'].flatMap((key) => ['337c', 'zk'].map((rd) => Z.despinSep(dr, key, rd))) };
  const t2 = { sep, k2q, despin }; mark('t2');
  const rel3 = (rs, lo, hi) => { const ov = rs.filter((r) => r.hi > lo && r.lo < hi); if (!ov.length) return 'out'; return ov.some((r) => r.lo <= lo && r.hi >= hi) ? 'in' : 'part'; };
  const t3 = ['A', 'I'].flatMap((c) => D.modes.flatMap((m) => D.k2qModes.map((q) => { const B = Z.uBand(c, { mode: m, k2q: q }, o), uV = PS.uV;
    return { col: c, mode: m, k2q: q, ranges: B.ranges, window: rel3(B.ranges, D.window[0], D.window[1]), focus: Z.inRanges(D.uFocus, B.ranges), uV: Z.inRanges(uV, B.ranges), uVBelowGrid: uV < D.uLo,
      atLo: { lockMin: B.grid[0].lockMin, notMax: B.grid[0].notMax }, atHi: { lockMin: B.grid[B.grid.length - 1].lockMin, notMax: B.grid[B.grid.length - 1].notMax } }; }))); mark('t3');
  const t4 = { syn: Z.synAvg(), rows: D.cols.map((c) => Z.venusEarthRow(c, {}, o)), g: Z.gRows(o) }; mark('t4');
  const now = Z.solarDaysN(), t5 = { now, grid: D.nGrid.map((N) => Z.nRow(N)), moonN: 0, retroMax: Math.max(...D.nGrid.filter((N) => Z.nRow(N).sense === 'retro')), nearestN: Math.round(now.N) }; mark('t5');
  const t6 = D.cols.map((c) => { const main = sep.filter((r) => r.col === c && r.partAsLock), atOne = main.filter((r) => r.atOne).length, sepn = main.filter((r) => r.separable).length;
    const v = t4.rows.find((r) => r.col === c), ub = t3.filter((r) => r.col === c);
    return { col: c, atOne, separable: sepn, of: main.length, outs: [...new Set(main.flatMap((r) => r.outLock.concat(r.outNot)))], venusEarthInf: v.rInf, venusEgMax: v.eg[v.eg.length - 1].ratio, rNeedEgMax: v.rNeedEg[v.rNeedEg.length - 1].r, perpOverBg: v.perpOverBg,
      focusIn: ub.length ? ub.filter((r) => r.focus).length : null, nUb: ub.length }; }); mark('t6');
  const J = { pure, t1, t2, t3, t4, t5, t6, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w353zk-lockdef.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W353ZK_OUT ? (path.isAbsolute(process.env.W353ZK_OUT) ? process.env.W353ZK_OUT : path.join(ROOT, process.env.W353ZK_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第353便zk lockdef(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: Z.LIB_VERSION, generator: 'tests/exp-w353zk-lockdef.mjs', target: TARGET,
    ruling: '原仮定者の補足(2026-11-25 —— 第152報)・原仮定者の回答(2026-11-25 —— 第153報)AN1082・原仮定者の回答(2026-11-25 —— 第151報)AN1034・原仮定者の指示(2026-11-14 —— 第138報)・統括の検証項目 R501', provisional: true, provKeys: PROV_KEYS.slice(),
    provMark: '仮・未照合(表 5 は金星の仮の自転周期を読む・ほかの鍵は閉包の lib が使う鍵 —— 本器は値を読まない)',
    decl: Z.DECL, lockStates: Z.lockStates, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第353便zk', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'lockdef', engine: 'Node(html を読まない —— 純関数の lib・第337便c・第353便zf・j・g・z・第352便q・k・第351便c・第347便e の lib を呼ぶ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
