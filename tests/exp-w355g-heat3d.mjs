// 第355便g(統括の検証項目 R510): **論文 5 の三次元の熱の項 —— 形の候補の表のための状態方程式の診断の器**
//   表 1 候補の列ごとの圧力の冪(密度への冪・温度への冪 —— 粒 64・箱・柔らかい壁)/表 2 斥力の強さの倍を振ったときの全体の密度の冪(並進あり の列)/
//   表 3 粒の数で密度を変えたときの冪(示量の性のちがい —— 並進なし の列)/表 4 熱への依り方(積・和・相手だけ)の性質/
//   表 5 三次元の摩擦と拡散の候補の保存の量/零試験 10
//   (段 heat3d-355g —— 正本 tests/out/heat3d-355g.json・lib tests/lib-w355g-heat3d.mjs)。
//   **診断だけ** —— アプリ・エンジン・内蔵の本・受理器・既存の lib の本文は変えない。physics の鍵を足さない。三次元の受理の門は変えない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w355g-heat3d.mjs —— 領域の宣言なし)。入力のファイルは無い。1 プロセス。正本は第338便c の settleRun で書く。
//   仮の値の lib は閉包に入らない。乱数は使わない(決まった種の線形合同)。
//
// ■ 言わないこと: アナロジーとしての玩具の量 —— 現実の熱力学の記述ではない。列を 1 つに絞らない。微視状態の数・エントロピーの主張は足さない。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as H from './lib-w355g-heat3d.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w355g-heat3d-1';
export const OUT_MAIN = 'tests/out/heat3d-355g.json';
export const TARGET = 'tests/lib-w355g-heat3d.mjs';
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  'アナロジーとしての玩具の量 —— 現実の熱力学の記述ではない。現実の宇宙の主張はしない',
  '列を 1 つに絞らない(候補の表)—— 冪は「窓の内/外」と書く。どの列で進めるかは伺う',
  '微視状態の数・エントロピーの主張は足さない(論文 5 の限界の表のまま)',
  'アプリの積分・受理の門・内蔵の本へは入れない(三次元の熱の項のアプリは後の便)',
  '斥力の強さ kRep・壁の硬さ・粒の半径は器のノブ(値は玩具の単位 —— 未照合)']);
export const PLAN = Object.freeze({
  pure: '零試験 10(L0 = アプリの E5′〔tint〕の式・L1 は二次元で L0 に戻る・熱への依り方の対称・三次元の摩擦 (F-vec) は面内でアプリの E9 に戻る・(F-vec) は運動量と角運動量を保つ・拡散は Σ I ω と熱を保つ・結合の角・並進だけの箱で P ÷ (ρ T) が 1 の近く・二次元の今の形で ρ²T の形・決まった手順)',
  t1: '表 1: 候補の列 10 × (密度 3 点・温度 3 点)の圧力と、密度への冪・温度への冪・斥力の分の冪・斥力の分 ÷ 並進の分・P ÷ (ρ T)',
  t2: '表 2: 並進あり の列 4 × 斥力の強さの倍 2(0.1・10 —— 倍 1 は表 1)の全体の密度の冪',
  t3: '表 3: 並進なし の列 4 × 粒の数 3(箱の一辺は固定)の密度の冪',
  t4: '表 4: 熱への依り方 3(積・和・相手だけ)× 性質(対の力の和・片方が 0 の温度のとき・二次元の今の式)',
  t5: '表 5: 三次元の摩擦の候補 2・拡散の候補 2 の保存の量(運動量・角運動量・熱・散逸)',
});
export const MULTS = Object.freeze([0.1, 10]);   // 倍 1 は表 1 の値
export const NS = Object.freeze({ 2: Object.freeze([36, 64, 100]), 3: Object.freeze([27, 64, 125]) });
export const KCOLS = Object.freeze(['K2-L0t', 'A3-L0t', 'B3-L1t', 'C3-L2t']);
export const NCOLS = Object.freeze(['K2-L0', 'A3-L0', 'B3-L1', 'C3-L2']);

export function gatesOf(J) {
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 10,
    t1: J.t1.length === H.COLS.length && J.t1.every((r) => r.rhoPts.length === 3 && r.tPts.length === 3 && r.rhoPts.every((p) => p.P > 0) && Number.isFinite(r.aRho) && Number.isFinite(r.aT)),
    t2: J.t2.length === KCOLS.length * MULTS.length && J.t2.every((r) => Number.isFinite(r.aRho) && r.pOverRhoTMid > 0),
    t3: J.t3.length === NCOLS.length && J.t3.every((r) => r.pts.length === 3 && Number.isFinite(r.aRhoN)),
    t4: J.t4.length === H.DECL.heatForms.length,
    t5: J.t5.length === 4,
  };
}
const pickP = (p) => ({ rho: p.rho, T: p.T, L: p.L, P: p.P, Pkin: p.Pkin, Prep: p.Prep, Ttr: p.Ttr });
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = H.pureScenes(), pure = { scenes: PS, gates: H.pureGates(PS) }; mark('pure');
  const t1 = H.COLS.map((c) => { const r = H.colPowers(c.id);
    return { col: c.id, D: c.D, rep: c.rep, law: c.law, tr: c.tr, rhoPts: r.rhoPts.map(pickP), tPts: r.tPts.map(pickP), aRho: r.aRho, aT: r.aT, aRhoRep: r.aRhoRep, aTRep: r.aTRep, repOverKin: r.repOverKin, pOverRhoT: r.pOverRhoT }; }); mark('t1');
  const t2 = KCOLS.flatMap((id) => H.kScan(id, MULTS)); mark('t2');
  const t3 = NCOLS.map((id) => H.nScan(id, NS[H.colOf(id).D])); mark('t3');
  const t4 = H.DECL.heatForms.map((f) => { const neq = H.heatH(f, 0.5, 2), z = H.heatH(f, 0, 2);
    return { form: f, onI: neq[0], onJ: neq[1], pairSum: neq[0] - neq[1], zeroOnI: z[0], zeroOnJ: z[1], momentum: neq[0] === neq[1] ? 'keep' : 'break', twoD: f === 'prod' ? 'tint' : (f === 'sum' ? 'spin' : 'none') }; }); mark('t4');
  const z5 = PS.z5, z6 = PS.z6, nrm = (p) => Math.hypot(...p), dif = (p, q) => nrm(p.map((x, k) => x - q[k]));
  const t5 = [
    { id: 'F-vec', what: 'friction', dP: dif(z5.P0, z5.P1), dL: dif(z5.L0, z5.L1), dE: z5.dE, keep: z5.keep },
    { id: 'F-scal', what: 'friction', dP: dif(z5.scal.P0, z5.scal.P1), dL: dif(z5.scal.L0, z5.scal.L1), dE: z5.scal.dE, keep: 1 - z5.muF },
    { id: 'D-vec', what: 'diffusion', dSpin: dif(z6.before, z6.after) },
    { id: 'D-scal', what: 'diffusion', dHeat: Math.abs(z6.heatBefore - z6.heatAfter) },
  ]; mark('t5');
  const J = { pure, t1, t2, t3, t4, t5, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w355g-heat3d.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W355G_OUT ? (path.isAbsolute(process.env.W355G_OUT) ? process.env.W355G_OUT : path.join(ROOT, process.env.W355G_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第355便g heat3d(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: H.LIB_VERSION, generator: 'tests/exp-w355g-heat3d.mjs', target: TARGET,
    ruling: '原仮定者の指示(2026-11-21)・原仮定者の回答(2026-11-22)AN949・AN951・AN962〜AN964・統括の検証項目 R510',
    decl: H.DECL, cols: H.COLS, mults: MULTS, ns: NS, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第355便g', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'heat3d', engine: 'Node(html を読まない —— 純関数の lib の小さな積分器)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
