// 第342便b(原仮定者の回答(2026-11-18 —— 第142報)AN806「局所光速に近づくと、時間の進みが局所時間からさらに遅くなり、絶対時間側から見ると加速しにくく見える。
//   速度が局所光速に達した時に時間が止まる場合と、速度が無限になった時に時間が止まる場合を、比較する」・統括の検証項目 R373):
//   **T1 時計の型の表(F・U1・U2・U3)/T2 絶対時間から見た加速(駆動の宣言 n = 1・2 —— 到達の時間・同じ絶対時間の x と粒子の時計)/T3 変数の取り違えの零試験/
//   T4 第341便e の候補の型の速さの曲線と同じ表/T5 不均一な場の曲がり ÷ 光/T6 水星の近点を動かす量(アプリには足さない)**
//   (段 clockstop-342b —— 正本 tests/out/clockstop-342b.json・lib tests/lib-w342b-clockstop.mjs)。**診断だけ** —— エンジン・時計の式・運動の式・光線・内蔵の本・受理器・既存の lib の本文は変えない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w342b-clockstop.mjs —— 領域の宣言なし)・入力のファイルは無い。1 プロセス。
//
// ■ 走らせたノブの格子と判定の物差し(正本の先頭 —— 式の形の宣言ではなく、何を測ったかの記録)
//   T1: 時計の型 F・U1・U2・U3 × x ∈ {0, 0.1, 0.5, 0.9, 0.99, 1, 2, 10}・低速の展開の係数(x = 1e-2 と 5e-3 の 2 点)。物差し: なし(型の表)。
//   T2: 型 × 駆動のべき n ∈ {1, 2} × 届く x ∈ {0.5, 0.9, 0.99, 1, 2, 10}(閉じた形と Simpson)・同じ絶対時間 T ∈ {0.5, 1, 1.5, 2, 3, 5} の x と粒子の時計 θ(閉じた形の逆と RK4)。
//   T3: x ∈ {0, 0.1, 0.5, 0.9, 0.99, 0.999} の U1(粒子の時計で測った速さ)と F(x)。T4: 第341便e の 10 本の曲線 × 時計の型 9 列(F の n = 3 を参考の列に)。
//   T5: 衝突径数 ÷ μ ∈ {1e4, 1e5} × 型 × n × x∞ ∈ {0.5, 0.9, 0.99, 1} の曲がり ÷ 光(今のアプリの屈折率 e^(2ψ))。物差し: 光の曲がり。
//   T6: 第341便e の軌道(μ = 1e-5)の近点の回り ÷ 1PN・型の間の差(μ ∈ {1e-3, 5e-4, 2.5e-4})を水星の ψ へ写した ″/世紀。物差し: 1PN 42.98″/世紀(第333便c)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w342b-clockstop.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w342b-clockstop-1';
export const AMEND = Object.freeze([]);
export const OUT_MAIN = 'tests/out/clockstop-342b.json';
export const TARGET = 'tests/lib-w342b-clockstop.mjs';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
export const NOT_CLAIM = Object.freeze(['時間が止まる速さを結論しない(型ごとの表まで —— 今のアプリの点の時計は型 F のまま)',
  '局所光速を超えられるか超えられないかを結論しない(駆動の宣言ごとの表 —— F・n = 1 は有限の時間で x = 1 に届き、F・n = 2 は届かない・U は通り抜ける)',
  '加速しにくさの機構を結論しない(駆動の宣言は比べるための宣言 —— 放射の抵抗の型〔第341便e の型 (3)〕は比べる列のまま)',
  '水星の数は誇張した場(μ/a = 1e-5)の比を水星へ写したもの —— 今の収支(42.98″/世紀)に項を足さない',
  '光速を、引きずりの候補の採否に使わない(本器の速さは場に対する物質の相対の速さ —— 座標を運ぶ速さは切らない)']);
export const PLAN = Object.freeze({ drive: Object.freeze({ 1: '粒子の時計 1 秒あたり同じ速度の増し分 dw/dτ = a*(dw/dt = a* N g)', 2: 'べき n = 2 の読み d²/dt² = (dτ/dt)² d²/dτ²(dw/dt = a* N² g²)' }),
  t4Expect: Object.freeze([['type1', 'psi', 0, 'F', 3], ['type2', 'p', 0.5, 'F', 1], ['type2', 'p', 1, 'F', 2], ['type2', 'p', 1.5, 'F', 3], ['type3', 'eps', 1, 'U1', 2, 'R1'], ['type3', 'eps', 1, 'F', 2, 'R2']]) });

export function partT1() { return { rows: L.t1Rows() }; }
export function partT2() { return { rows: L.t2Rows() }; }
export function partT3() { return L.t3Rows(); }
export function partT4() { return L.t4Rows(); }
export function partT5() { return L.t5Rows(); }
export function partT6() { return L.t6Rows(); }

export function gatesOf(J) {
  const t1 = J.t1.rows, t2 = J.t2.rows, t4 = J.t4.rows, t5 = J.t5, t6 = J.t6;
  const r2 = (type, n) => t2.find((x) => x.type === type && x.n === n);
  const lastB = t5.defl[t5.defl.length - 1].rows;
  const ex = PLAN.t4Expect.every(([lab, k, v, ty, n, form]) => { const r = t4.find((x) => x.label === lab && x.knob[k] === v && (!form || x.knob.form === form)); return r && r.sameAs && r.sameAs.type === ty && r.sameAs.n === n; });
  const pd = t6.diffs.map((d) => d.perDc4), pm = pd.reduce((a, b) => a + b, 0) / pd.length;
  return {
    pure: Object.values(J.pure.gates).every(Boolean),
    t1Domain: t1.length === 4 && t1.every((r) => Math.abs(r.g[0] - 1) < 1e-15) && t1.find((r) => r.type === 'F').g.slice(-2).every((v) => v === null) && t1.filter((r) => r.type !== 'F').every((r) => r.g.every((v) => fin(v) && v > 0)),
    t1Low: t1.every((r) => Math.abs(r.c2 + 0.5) < 1e-6 && Math.abs(r.c4 - r.c4Closed) < 1e-5),
    t2Reach: Math.abs(r2('F', 1).tAtOne - Math.PI / 2) < 1e-15 && r2('F', 2).tAtOne === 'inf' && t2.filter((r) => r.type !== 'F').every((r) => r.reachesOneFinite && r.passesOne),
    t2Clock: t2.filter((r) => r.n === 1).every((r) => r.xAtT.every((x, i) => Math.abs(x - r.thetaAtT[i]) < 1e-14)),
    t3Identity: J.t3.identityMax < 1e-15,
    t4Same: ex && t4.find((x) => x.label === 'type0').sameAs === null,
    t5Weak: lastB.filter((x) => !x.byDecl && (x.xInf <= 0.9 || x.type === 'light' || x.type === 'type0')).every((x) => Math.abs(x.alphaOverMuB / x.closed - 1) < 2e-4),
    t5Ident: t5.ident.every((x) => x.rel < 1e-12) && Math.abs(lastB.find((x) => x.type === 'type0').overLight - 0.5) < 1e-3,
    t5Photon: t5.photon.find((x) => x.type === 'F').gAtOne === 0 && t5.photon.filter((x) => x.type !== 'F').every((x) => x.gAtOne > 0),
    t6First: t6.rows.every((r) => Math.abs(r.overPN - r.closed) < 1e-4) && t6.same.every((s) => Math.abs(s.overPN / t6.rows.find((r) => r.type === 'F' && r.n === s.n).overPN - 1) < 1e-8) && Math.abs(t6.pn.arcsecCy - 42.98) < 0.01,
    t6Diff: t6.diffs.every((d) => d.coef > 0 && Math.abs(d.perDc4 / pm - 1) < 0.01),
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const t1 = partT1(); mark('t1');
  const t2 = partT2(); mark('t2');
  const t3 = partT3(); mark('t3');
  const t4 = partT4(); mark('t4');
  const t5 = partT5(); mark('t5');
  const t6 = partT6(); mark('t6');
  const J = { pure, t1, t2, t3, t4, t5, t6, timing: tm };
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
export const CODE = Object.freeze(['tests/exp-w342b-clockstop.mjs', 'tests/lib-w342b-clockstop.mjs', 'tests/lib-w341e-lightmass.mjs', 'tests/lib-w333c-mercury3d.mjs', 'tests/lib-w331c-k1scale.mjs', 'tests/lib-w330b-dragweight.mjs', 'tests/lib-w332a-eqband.mjs', 'tests/lib-w340h-thin.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w338c-recheck.mjs']);
export async function main() {
  const t0 = Date.now();
  const OUT = process.env.W342B_OUT ? (path.isAbsolute(process.env.W342B_OUT) ? process.env.W342B_OUT : path.join(ROOT, process.env.W342B_OUT)) : path.join(ROOT, OUT_MAIN);
  console.log('第342便b clockstop(版 ' + HARNESS_VERSION + ')');
  const { J: R, recheck } = runSettled();
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w342b-clockstop.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-18 —— 第142報)AN806「局所光速に近づくと、時間の進みが局所時間からさらに遅くなり、絶対時間側から見ると加速しにくく見える。速度が局所光速に達した時に時間が止まる場合と、速度が無限になった時に時間が止まる場合を、比較する」・統括の検証項目 R373',
    decl: L.DECL, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第342便b', target: TARGET, code: CODE, inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'clockstop', engine: 'Node の純関数だけ(html を読まない・エンジンの步を進めない —— 自前の RK4 と求積・第341便e の器を呼ぶ)', notClaim: NOT_CLAIM, recheck });
  writeJson(OUT, out);
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();
