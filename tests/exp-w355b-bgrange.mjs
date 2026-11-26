// 第355便b(原仮定者の指示(2026-11-25)「この結果を尊重する」・原仮定者の回答(2026-11-25)「推奨。ただし、必ず0.98 倍である必要は無い」・統括の検証項目 R505):
//   **「潮汐力 ÷ 軸引きずり = 1」の線で惑星が分かれる背景の大きさ u の範囲を、主の作り(換算の係数 = 金星で等大になる値・(P-応)・(O2b))で閉じた形で数える器 ——
//   表 1 第353便zk の範囲と X の照合/表 2 X(作り 4 × 物差しの半径 × 置き方 3 × k₂/Q 2)と (P-応) の倍/表 3 範囲 72 行(作り × 物差しの半径 × 置き方 × k₂/Q × 読み)・
//   k₂/Q を共通で 1e-4〜1e-1 に振った表・比べる読み(c_R)・作りを変えたときの動き/表 4 6 組の共通部分/表 5 範囲の内の金星の代表の値/表 6 全体の係数で読む 3 つの題・零試験 13**
//   (段 bgrange-355b —— 正本 tests/out/bgrange-355b.json・lib tests/lib-w355b-bgrange.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・既存の lib の本文は変えない。physics の鍵を足さない。潮汐のトルクは全部「比べる列(DFM の式ではない)」。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w355b-bgrange.mjs —— 領域の宣言なし)。入力のファイルは 1 本(第353便zk の正本 tests/out/lockdef-353zk.json —— 零試験 ②③ の照合にだけ使う)。
//   1 プロセス。正本は第338便c の settleRun で書く。仮の値の lib(第352便b)は閉包に入る(第353便zk の lib 経由 —— 本器は値を読まない・正本の最上位に provisional: true と鍵の一覧)。
//
// ■ 言わないこと: 背景の大きさを 1 つの値に置かない(範囲の表 —— 候補)。0.98 倍は範囲の内の 1 点で、固定しない。k₂/Q・観測の自転は仮の値・未照合のノブ。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w355b-bgrange.mjs';
import * as E from './lib-w347e-spintorque.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w355b-bgrange-1';
export const OUT_MAIN = 'tests/out/bgrange-355b.json';
export const TARGET = 'tests/lib-w355b-bgrange.mjs';
export const INPUT = 'tests/out/lockdef-353zk.json';
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '範囲の表 —— 背景の大きさを 1 つの値に置かない。0.98 倍は範囲の内の 1 点で、固定しない',
  '潮汐のトルクは比べる列(DFM の式ではない)—— k₂/Q・観測の自転・構造の係数は仮の値・未照合のノブ。大気熱潮汐は数えない',
  'ロックの状態は観測の事実として置く(積分で作らない)—— 比の表から由来を結論にしない',
  'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない']);
export const PLAN = Object.freeze({
  pure: '零試験 13(第353便zk の xOf・正本の X と範囲・uBand の走らせ直し・omOf・ob none・venusEarthRow/第353便zf の uVenus/第353便c の rateMult/u に反比例・k₂/Q に比例・(O2b) で惑星の Ω が同じ・比べる読みは c_R² に比例)',
  t1: '表 1: 第353便zk の範囲(列 (イ)・置き方 3 × k₂/Q 2)と X(列 (イ)・0.98)を作り R で数え直して並べる',
  t2: '表 2: X(u 0.98)—— 作り 4(P・M は物差しの半径 2)× 置き方 3 × k₂/Q 2 × 10 天体・(P-応) の倍・比べる読み(c_R の格子)',
  t3: '表 3: 範囲 72 行(作り 4〔P・M は物差しの半径 2〕× 置き方 3 × k₂/Q 2 × 読み 2)と 0.98・窓・金星の条件・第353便zk の範囲との重なり/k₂/Q 走査/比べる読み/作りの動き',
  t4: '表 4: 共通部分(作り × 物差しの半径 × 読み —— 6 組・k₂/Q 共通の 3 組・第337便c の 3 組)',
  t5: '表 5: 範囲の内の金星の代表の値(主の作り・R_ref 観測・観測の自転・共通 1e-2)',
  t6: '表 6: 全体の係数(= u ÷ 金星の条件の値)で読む 3 つの題',
  cmp: '比べる列: (ア)(換算の係数 1 —— 第353便zk の格子の範囲)・(ウ)(背景 = 金星の条件の大きさ —— X の帯)',
});
export const PROV_KEYS = Object.freeze(['earth.precSense', 'earth.psiA.rate', 'mars.prec.rate', 'venus.prec.rate', 'venus.spin.period']);

const D = L.DECL;
const combos = () => { const c = []; for (const b of D.builds) for (const ref of (b === 'P' || b === 'M') ? D.refs : ['—']) c.push({ build: b, ref }); return c; };
const refOf = (c) => (c.ref === '—' ? 'obs' : c.ref);

export function gatesOf(J) {
  const nC = combos().length, nM = D.modes.length, nQ = D.k2qModes.length;
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 13,
    t1: J.t1.t3.length === 6 && J.t1.x.length === 60,
    t2: J.t2.x.length === nC * nM * nQ && J.t2.x.every((r) => r.rows.length === D.bodies.length && r.rows.every((q) => q.X > 0)) && J.t2.resp.length === D.bodies.length && J.t2.alt.length === D.cRShow.length,
    t3: J.t3.rows.length === nC * nM * nQ * 2 && J.t3.rows.length === 72 && J.t3.rows.every((r) => r.open === (r.lo < r.hi) && Math.abs(r.width * r.lo / r.hi - 1) <= 1e-12)
      && J.t3.k2q.length === nC * nM && J.t3.k2q.every((r) => r.scan.length === D.k2qScan.length) && J.t3.alt.length === D.cRShow.length * nM && J.t3.move.length === nC,
    t4: J.t4.length === nC * 2 * 3 && J.t4.every((r) => r.open === (r.lo < r.hi)),
    t5: J.t5.rows.length === D.reps.length + 2 && J.t5.rows.every((r) => r.k > 0),
    t6: J.t6.uV > 0 && J.t6.b.lo < J.t6.b.hi,
    cmp: J.cmp.A.length === 6 && J.cmp.U.length === 6,
  };
}
export function runAll(J353) {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const T1 = E.t1Table(), GEO = E.geometry(), o = { T1, GEO }; mark('input');
  const PS = L.pureScenes(J353, o), PG = L.pureGates(PS);
  const pure = { gates: PG, sigmaSun: PS.sS, uVR: PS.uR, uVO: PS.uO, uVZF: PS.uZF, band: PS.band, kq: PS.kq }; mark('pure');
  const C = combos();
  // 表 1
  const t1 = {
    t3: PS.t3.map((r) => ({ mode: r.mode, k2q: r.k2q, zkLo: r.json.lo, zkLoClipped: r.json.loClipped, zkHi: r.json.hi, zkLoBody: r.json.loEdgeBody, zkHiBody: r.json.hiEdgeBody, lo: r.mine.lo, hi: r.mine.hi, loBody: r.mine.loBody, hiBody: r.mine.hiBody })),
    x: PS.xJ.map((r) => ({ id: r.id, mode: r.mode, k2q: r.k2q, zk: r.json, mine: r.mine })),
  }; mark('t1');
  // 表 2
  const t2 = {
    x: C.flatMap((c) => D.modes.flatMap((m) => D.k2qModes.map((q) => ({ ...c, mode: m, k2q: q, rows: L.xRowsB(c.build, { mode: m, k2q: q, u: D.uFocus, ref: refOf(c) }, o) })))),
    resp: D.bodies.map((id) => ({ id, obs: L.respFactor(id, 'obs'), rule: L.respFactor(id, 'rule') })),
    alt: D.cRShow.map((cR) => ({ cR, Earth: L.xOfB('Earth', 'M', { alt: { cR }, ref: 'obs' }, o), Venus: L.xOfB('Venus', 'M', { alt: { cR }, ref: 'obs' }, o) })),
  }; mark('t2');
  // 表 3
  const uVR = PS.uR, uVO = PS.uO;
  const rows = C.flatMap((c) => D.modes.flatMap((m) => D.k2qModes.flatMap((q) => [true, false].map((pl) => {
    const r = L.uRange(c.build, { mode: m, k2q: q, ref: refOf(c), partAsLock: pl }, o), z = L.uRange('R', { mode: m, k2q: q, partAsLock: pl }, o);
    const uV = (c.build === 'O' || c.build === 'M') ? uVO : uVR;
    return { ...c, mode: m, k2q: q, partAsLock: pl, lo: r.lo, hi: r.hi, loBody: r.loBody, hiBody: r.hiBody, open: r.open, width: r.width,
      in098: L.inRange(D.uFocus, r), window: L.relWin(r, D.window[0], D.window[1]), uV, inUV: L.inRange(uV, r), zkLo: z.lo, zkHi: z.hi, overlapZk: L.overlap(r, z), loOverZk: r.lo / z.lo, hiOverZk: r.hi / z.hi };
  }))));
  const k2q = C.flatMap((c) => D.modes.map((m) => ({ ...c, mode: m, scan: D.k2qScan.map((q) => { const r = L.uRange(c.build, { mode: m, k2q: q, ref: refOf(c) }, o); return { k2q: q, lo: r.lo, hi: r.hi, open: r.open }; }) })));
  const alt = D.cRShow.flatMap((cR) => D.modes.map((m) => { const r = L.uRange('M', { mode: m, k2q: 'common', ref: 'obs', alt: { cR } }, o); return { cR, mode: m, lo: r.lo, hi: r.hi, loBody: r.loBody, hiBody: r.hiBody, open: r.open }; }));
  const move = C.map((c) => { const rr = rows.filter((r) => r.build === c.build && r.ref === c.ref && r.partAsLock), l = rr.flatMap((r) => [Math.log10(r.loOverZk), Math.log10(r.hiOverZk)]); return { ...c, minLog10: Math.min(...l), maxLog10: Math.max(...l) }; });
  const t3 = { rows, k2q, alt, move }; mark('t3');
  // 表 4 共通部分
  const SETS = { six: null, common: D.modes.map((m) => ({ mode: m, k2q: 'common' })), c337: D.modes.map((m) => ({ mode: m, k2q: 'c337' })) };
  const t4 = C.flatMap((c) => [true, false].flatMap((pl) => Object.entries(SETS).map(([nm, sets]) => { const p = L.commonPart(c.build, { ref: refOf(c), partAsLock: pl, sets }, o);
    return { ...c, partAsLock: pl, sets: nm, n: p.n, lo: p.lo, hi: p.hi, open: p.open, gap: p.gap, loFrom: p.loFrom, hiFrom: p.hiFrom, in098: p.open && D.uFocus > p.lo && D.uFocus < p.hi, n098: p.each.filter((e) => e.in098).length }; }))); mark('t4');
  // 表 5
  const main = L.uRange('M', { mode: 'obs', k2q: 'common', ref: 'obs' }, o);
  const t5 = { range: { lo: main.lo, hi: main.hi }, egQ: D.egQ, rows: [main.lo, ...D.reps, main.hi].map((u) => L.repOf(u, o)) }; mark('t5');
  // 表 6(比は u に反比例 → 届く u の上端 = u 1 での比)
  const r1 = L.repOf(1, o), cT = r1.earthTideInfOverRes, cM = r1.earthTideMeanOverRes, cE = r1.egMaxOverRes;
  const ovl = (x) => (main.open && main.lo < x ? { lo: main.lo, hi: Math.min(main.hi, x) } : null);
  const t6 = { uV: uVO, a: { u: D.uFocus, coef: D.uFocus / uVO }, b: { lo: main.lo, hi: main.hi, coefLo: main.lo / uVO, coefHi: main.hi / uVO },
    c: { tideInfUMax: cT, tideMeanUMax: cM, egUMax: cE, coefTideInf: cT / uVO, coefTideMean: cM / uVO, coefEg: cE / uVO },
    overlapTideInf: ovl(cT), overlapTideMean: ovl(cM), overlapEg: ovl(cE) }; mark('t6');
  // 比べる列(第353便zk の正本から写す —— (ア) は換算の係数 1 で u を格子 1e-3〜1e2 で振った範囲〔格子の端で切る〕・(ウ) は背景を金星の条件の大きさに置いた X の帯〔u を振る列ではない〕)
  const cmp = {
    A: J353.t3.filter((r) => r.col === 'A').map((r) => ({ mode: r.mode, k2q: r.k2q, ranges: r.ranges, window: r.window, focus: r.focus })),
    U: J353.t2.sep.filter((r) => r.col === 'U' && r.partAsLock).map((r) => ({ mode: r.mode, k2q: r.k2q, lockMin: r.lockMin, lockMinId: r.lockMinId, notMax: r.notMax, notMaxId: r.notMaxId, separable: r.separable, atOne: r.atOne })),
  }; mark('cmp');
  const J = { pure, t1, t2, t3, t4, t5, t6, cmp, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w355b-bgrange.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}
export const readInput = () => JSON.parse(fs.readFileSync(path.join(ROOT, INPUT), 'utf8'));

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W355B_OUT ? (path.isAbsolute(process.env.W355B_OUT) ? process.env.W355B_OUT : path.join(ROOT, process.env.W355B_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第355便b bgrange(版 ' + HARNESS_VERSION + ')');
  const J353 = readInput();
  let tm = null;
  const S = settleRun(() => { const R = runAll(J353); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w355b-bgrange.mjs', target: TARGET,
    ruling: '原仮定者の指示(2026-11-25)「この結果を尊重する」・原仮定者の回答(2026-11-25)「推奨。ただし、必ず0.98 倍である必要は無い」・統括の検証項目 R505', provisional: true, provKeys: PROV_KEYS.slice(),
    provMark: '仮・未照合(閉包の第353便zk の lib が仮の値の lib を import する —— 本器は値を読まない)',
    decl: L.DECL, builds: L.BUILDS, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第355便b', target: TARGET, code: codeClosure(), inputs: [INPUT] }), {
    harnessVersion: HARNESS_VERSION, stage: 'bgrange', engine: 'Node(html を読まない —— 純関数の lib・第353便zk・zf・c・z・g・第352便k・第348便c・第337便c・第347便e の lib を呼ぶ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
