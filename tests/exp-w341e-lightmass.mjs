// 第341便e(原仮定者の補足(2026-11-18 —— 第141報)「質量ゼロの慣性移動が光の経路で有り、光が決定力場による座標空間の物差しになる。質量の有る物体は、
//   局所光速に近付くにつれて加速しにくくなる」・統括の検証項目 R368):
//   **T1 候補の型を並べる(一様な場・一定の力 —— 型 (0)〜(3))/T2 質量 0 の極限と光の経路(不均一な場の曲がり・光の物差し)/
//   T3 既存の検証へ持ち出したときに動く量(水星の近点・GPS)/T4 零試験(天体が 1 つ・静止の 2 体・低速の極限)**
//   (段 lightmass-341e —— 正本 tests/out/lightmass-341e.json・lib tests/lib-w341e-lightmass.mjs)。**診断だけ** —— エンジン・時計の式・運動の式・内蔵の本・受理器・既存の lib の本文は変えない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w341e-lightmass.mjs —— 領域の宣言なし)・入力のファイルは無い。1 プロセス。
//
// ■ 走らせたノブの格子と判定の物差し(正本の先頭 —— 式の形の宣言ではなく、何を測ったかの記録)
//   T1: 型 (0)・型 (1) ψ ∈ {0, 0.1}・型 (2) p ∈ {½, 1, 3⁄2}・型 (3) g ∈ {R1, R2} × ε₊ ∈ {0.1, 1} × 減速の列 {対称, 非対称}。読む量: β(τ = 1, 2, 10)・c_loc に達するか・越えるか・
//     近付き方・加速に要るエネルギー ÷ ½ m w²(β = 0.5, 0.9, 0.99)・1 往復の損失 ÷ ½ m w²。物差し: なし(型の表)。
//   T2: 衝突径数 ÷ μ ∈ {1e3, 1e4, 1e5} × (光・型 (0) β∞ ∈ {1, 0.9, 0.99, 0.999}・型 (1) β∞ ∈ {0.9, 0.99, 0.999}・型 (2) p × β∞・型 (3) R2 ε 1 対称 β∞ ∈ {0.9, 0.99})の
//     曲がりの角 ÷ (μ/b)・÷ 弱い場の一次の閉じた式・÷ 光。物差し: 光の曲がり(今のアプリの屈折率 e^(2ψ) —— 弱い場の一次 4μ/b)。光の物差しの表(ψ(r₁) ∈ {1e-6, 1e-3, 0.1})。
//   T3: 軌道 a = 1・μ = 1e-5・e = 水星・1 周 6000 刻み・4 周。近点の回り ÷ 1PN・閉じた式・水星の ″/世紀(1PN 42.98 —— 第333便c の q1PNPerOrbit)。
//   T4: 天体が 1 つ(並進と剛体の回転の u)・静止の 2 体(水星の距離の ψ)・低速の極限(β ∈ {1e-2, 1e-3, 1e-4} の差の次数)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w341e-lightmass.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w341e-lightmass-1';
export const AMEND = Object.freeze([]);
export const OUT_MAIN = 'tests/out/lightmass-341e.json';
export const TARGET = 'tests/lib-w341e-lightmass.mjs';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
export const NOT_CLAIM = Object.freeze(['局所光速を超えない運動の則を結論しない(型ごとの表まで —— 型 (0) と型 (3) R1 は越える)',
  '光の経路が運動の式から出ると結論しない(型 (1) は質量 0 で光の形になるように作った統括の参考の試作 —— その型の中の恒等式)',
  '型 (1) を DFM の式として採らない(置き換えの型 —— 今のアプリの重力と同時には足せない)', '光速を、引きずりの候補の採否に使わない(本器の速さは場に対する物質の相対の速さ —— 座標を運ぶ速さは切らない)',
  '水星の数は誇張した場(μ/a = 1e-5)の比を水星へ写したもの(弱い場の一次の比)', 'GPS の地球の値は文献の値・未照合']);
export const PLAN = Object.freeze({ t2Kinds: Object.freeze(['light', 'type0', 'type1', 'type2', 'type3']), roles: Object.freeze({ control: '対照', replace: '置き換えの型', part: '置き換えの型の静止の部分', add: '足す型' }) });

export function partT1() { return { rows: L.t1Rows() }; }
export function partT2() { return { defl: L.t2Rows(), ruler: L.DECL.psiRuler.map((p) => L.rulerRow(p)) }; }
export function partT3() { return L.t3Rows(); }
export function partT4() { return L.zeroTests(); }

export function gatesOf(J) {
  const t1 = J.t1.rows, t2 = J.t2, t3 = J.t3, t4 = J.t4;
  const r = (k, f) => t3.rows.find((x) => x.kind === k && (!f || f(x.knob)));
  const lastB = t2.defl[t2.defl.length - 1].rows;
  return {
    pure: Object.values(J.pure.gates).every(Boolean),
    t1Complete: t1.length === 1 + L.DECL.psiT1.length + L.DECL.pGrid.length + 2 * L.DECL.gForms.length * L.DECL.epsGrid.length && t1.every((x) => x.energyRatio.every(fin) && x.cycleLoss.every(fin)),
    t1Conservative: t1.filter((x) => x.type !== 3).every((x) => x.cycleLoss.every((v) => v === 0)) && t1.filter((x) => x.type === 3).every((x) => x.cycleLoss.every((v) => v > 0)),
    t2Complete: t2.defl.length === L.DECL.bGrid.length && t2.defl.every((g) => g.rows.every((x) => fin(x.alphaOverMuB) && x.alphaOverMuB >= 0)),
    // 弱い場の一次の閉じた式への寄り(いちばん弱い場 b = 1e5 μ —— 光・型 (0)・型 (1) の相対の差 ≤ 1e-4)
    t2Weak: lastB.filter((x) => x.kind === 'light' || x.kind === 'type0' || x.kind === 'type1').every((x) => Math.abs(x.overClosed - 1) < 1e-4),
    rulerIdentity: t2.ruler.every((x) => Math.abs(x.cLocInt - 1) < 1e-12),
    t3Closed: t3.rows.filter((x) => x.closed !== null).every((x) => Math.abs(x.overPN - x.closed) < 1e-4) && Math.abs(t3.pn.arcsecCy - 42.98) < 0.01,
    t3Conservative: t3.rows.filter((x) => x.kind !== 'type3').every((x) => Math.abs(x.dLnAperOrbit) < 1e-12) && r('type3', (k) => k.sym).dLnAperOrbit < 0 && r('type3', (k) => !k.sym).dLnAperOrbit < 0,
    single: t4.single.maxSlip === 0 && t4.single.maxForce === 0 && t4.single.maxHeat === 0,
    staticPair: t4.staticPair.type0 === 1 && t4.staticPair.type2 === 1 && t4.staticPair.type3 === 1 && t4.staticPair.type1replace < 1 && t4.staticPair.type1added > 1.99,
    lowOrder: [t4.low.type1psi0].concat(t4.low.type2, t4.low.type3).every((x) => Math.abs(x.order - 2) < 1e-3),
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const t1 = partT1(); mark('t1');
  const t2 = partT2(); mark('t2');
  const t3 = partT3(); mark('t3');
  const t4 = partT4(); mark('t4');
  const J = { pure, t1, t2, t3, t4, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}
/** 正本へ書く形(第338便c の settleRun) */
export function runSettled() {
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const { gates, ok, ...rest } = S.value;
  return { J: Object.assign(rest, { timing: tm, gates, ok }), recheck: S.meta };
}

const writeJson = (OUT, out) => { fs.mkdirSync(path.dirname(OUT), { recursive: true }); fs.writeFileSync(OUT, JSON.stringify(out, null, 1).replace(/\[\s*(-?[\d.eE+-]+(?:,\s*-?[\d.eE+-]+|,\s*null)*)\s*\]/g, (m, a) => '[' + a.replace(/\s+/g, '') + ']') + '\n'); };
export const CODE = Object.freeze(['tests/exp-w341e-lightmass.mjs', 'tests/lib-w341e-lightmass.mjs', 'tests/lib-w333c-mercury3d.mjs', 'tests/lib-w331c-k1scale.mjs', 'tests/lib-w330b-dragweight.mjs', 'tests/lib-w332a-eqband.mjs', 'tests/lib-w340h-thin.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w338c-recheck.mjs']);
export async function main() {
  const t0 = Date.now();
  const OUT = process.env.W341E_OUT ? (path.isAbsolute(process.env.W341E_OUT) ? process.env.W341E_OUT : path.join(ROOT, process.env.W341E_OUT)) : path.join(ROOT, OUT_MAIN);
  console.log('第341便e lightmass(版 ' + HARNESS_VERSION + ')');
  const { J: R, recheck } = runSettled();
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w341e-lightmass.mjs', target: TARGET,
    ruling: '原仮定者の補足(2026-11-18 —— 第141報)「質量ゼロの慣性移動が光の経路で有り、光が決定力場による座標空間の物差しになる。質量の有る物体は、局所光速に近付くにつれて加速しにくくなる」・統括の検証項目 R368',
    decl: L.DECL, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第341便e', target: TARGET, code: CODE, inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'lightmass', engine: 'Node の純関数だけ(html を読まない・エンジンの步を進めない —— 自前の RK4 と求積)', notClaim: NOT_CLAIM, recheck });
  writeJson(OUT, out);
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();
