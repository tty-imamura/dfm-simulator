// 第353便y(原仮定者の回答(2026-11-25 —— 第151報)AN1045・統括の検証項目 R489):
//   **土星の環の「受け手の重み」の器 —— 表 1 面密度の走査(区分 5 × 面密度〔格子 5 + 比べる列 1 + 格子の外 5〕× 読みと作り 3)・
//   表 2 受け手の読み 3 つ(粒子 1 つ・周りの粒子の集まり・輪全体を 1 つの剛体の輪)・表 3 公転面の集まりを内側と巨大な惑星に分けて(基準軸 L・eq)・零試験 10**
//   (段 ringsurf-353y —— 正本 tests/out/ringsurf-353y.json・lib tests/lib-w353y-ringsurf.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・既存の lib の本文は変えない。physics の鍵を足さない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w353y-ringsurf.mjs —— 領域の宣言なし)。入力のファイルは無い。
//   1 プロセス。正本は第338便c の settleRun で書く。仮の値の lib は使わない(閉包に入らない —— 〔第353便k〕の lib は届かない)。
//
// ■ 言わないこと: 環の傾きの答え・面密度の値・円盤引きずりの型とは書かない。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w353y-ringsurf.mjs';
import * as E from './lib-w347e-spintorque.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w353y-ringsurf-1';
export const OUT_MAIN = 'tests/out/ringsurf-353y.json';
export const TARGET = 'tests/lib-w353y-ringsurf.mjs';
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '候補の表 —— 環の傾きの答えとは書かない。円盤引きずりの型を決めていない(〔第353便k〕の場の作りの分母に、周りの粒子の重みの和を足しただけ —— 重みの核は既存の K1)',
  '面密度 Σ はノブ(値は未照合)の格子 —— 環の面密度の観測の値ではない。〔第338便d〕の LIT.regions の Σ は比べる列(文献の値・未照合)',
  '粒子の大きさ・密度・構造の係数 c_R はノブ(値は未照合)—— 〔第353便k〕の代表の受け手のまま',
  '環の物差し(1e7 年で傾きが e 分の 1)と公転面の物差し(30° → 7° の 23°)は文献の値・未照合の比べる列(合わせない)',
  'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない']);
export const PLAN = Object.freeze({
  pure: '零試験 10(Σ 0 で〔第353便k〕の diskStd・axStd と同じ数・〔第353便k〕の正本の主の最小と最大・輪の中心の閉じた形 2π Σ dr・区切りの細かさと Σ への比例・extraW の口・閉じた形 v(W) = α (W + w_S) ÷ W²・公転面の planeStd と同じ数・剛体の受け手・拒否)',
  t1: '表 1: 面密度の走査 —— 区分 5 × Σ(格子 1〜1e4 kg/m² + LIT.regions の Σ〔比べる列〕+ 格子の外 1e6〜1e14)× (F2)(C2)・(F2)(C1)・(F1)(C2) の率 ÷ 物差しと、Σ 0 からの変化(C2 は閉じた形で直接)',
  t1star: '表 1 の補い: 分母の内訳(源・粒子 1 つ・太陽)と、周りの粒子の重みが粒子 1 つ・源の重みと同じになる面密度 Σ★・そのときの率の比',
  t2: '表 2: 受け手の読み 3 つ —— 粒子 1 つ(〔第353便k〕)・周りの粒子の集まり(Σ = LIT.regions・1e4)・輪全体を 1 つの剛体の輪(質量 = Σ × 面積・半径 = 輪の半径 × c_R 0.01・0.1・1)の物差しとの桁',
  t3: '表 3: 公転面の集まり —— 内側の惑星(水星〜火星)と巨大な惑星(木星〜海王星)× 基準軸 L・eq(背景 (N+) は基準軸に平行 —— 直交成分に入らない)・自分の重み ÷ 源の重みと閉じた形・公転面の法線と基準軸の角',
});

export function gatesOf(J) {
  const D = L.DECL, nS = D.sigmas.length + 1;
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 10,
    t1: J.t1.length === D.centers.length && J.t1.every((r) => r.rows.length === nS && r.wide.length === D.sigmaWide.length
      && r.rows.concat(r.wide).every((q) => q.F2C2.yard > 0 && q.F1C2.yard > 0 && q.F2C1.yard < 0 && q.F2C2.d <= 0 && q.F1C2.d <= 0 && q.F2C1.d <= 0)),
    t1closed: J.t1.every((r) => r.rows.concat(r.wide).every((q) => q.F2C2.closedRel < 1e-6 && q.F1C2.closedRel < 1e-6)),
    t1star: J.t1.every((r) => r.star.F2.sigmaSrc > D.sigmas[D.sigmas.length - 1] && r.star.F2.sigmaOne < D.sigmas[0] && r.star.F2.ratio > 0 && r.star.F2.ratio < 1),
    t2: J.t2.length === D.centers.length && J.t2.every((r) => r.rigid.length === D.rigidCRs.length * 2 && r.collective.length === 2),
    t3: J.t3.length === (D.inner.length + D.giant.length) * D.planeAxes.length && J.t3.every((r) => r.v > 0 && r.vW > 0 && r.vStar > 0 && Math.abs(r.vOverStar / r.closed - 1) < 1e-6),
  };
}

function rowOf(T1, GEO, key, per, d2, d1, x1, sigma, lit) {
  const W = sigma * per;
  // (F2)(C2): 数えた率と閉じた形(x = W_surf ÷ W₀・s = w_S ÷ W₀ —— 比 − 1 は差を取らずに直接)
  const W02 = d2.src + d2.one, s2 = d2.src / W02, x2 = W / W02;
  const a2 = L.diskSurf(key, { extraWSI: W }), r2 = a2.yard / d2.yard;
  const a1 = L.diskSurf(key, { extraWSI: W, read: 'C1' }), r1 = a1.yard / d1.yard, dd1 = r1 - 1;
  const W01 = x1.src + x1.sun + x1.one, s1 = x1.src / W01, xx1 = W / W01;
  const b1 = L.axSurf(T1, GEO, key, { extraWSI: W }), q1 = b1.yard / x1.yard;
  return { sigma, lit, surfOverSrc: W / d2.src, surfOverOne: W / d2.one,
    F2C2: { yard: a2.yard, d: L.dOf(x2, s2), closedRel: Math.abs(r2 / L.ratioOf(x2, s2) - 1) },
    F2C1: { yard: a1.yard, d: Math.abs(dd1) < 1e-9 ? 0 : dd1 },
    F1C2: { yard: b1.yard, d: L.dOf(xx1, s1), closedRel: Math.abs(q1 / L.ratioOf(xx1, s1) - 1) } };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const T1 = E.t1Table(), GEO = E.geometry(); mark('input');
  const PS = L.pureScenes(T1, GEO), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const D = L.DECL, t1 = [], t2 = [];
  for (const key of D.centers) {
    const g = L.regionOf(key), per = L.surfOf(key, 1).W;
    const z2 = L.diskSurf(key, {}), z1 = L.diskSurf(key, { read: 'C1' }), zx = L.axSurf(T1, GEO, key, {});
    const st2 = L.sigmaStar(key), stx = L.sigmaStar(key, { frame: 'F1', T1, GEO });
    const d2 = { yard: z2.yard, src: st2.srcSI, one: st2.oneSI }, d1 = { yard: z1.yard }, x1 = { yard: zx.yard, src: zx.wS, sun: zx.wSun, one: zx.A0 };
    const rows = D.sigmas.map((s) => rowOf(T1, GEO, key, per, d2, d1, x1, s, false)).concat([rowOf(T1, GEO, key, per, d2, d1, x1, g.sigmaLit, true)]);
    const wide = D.sigmaWide.map((s) => rowOf(T1, GEO, key, per, d2, d1, x1, s, false));
    const sx = st2.srcSI / (st2.srcSI + st2.oneSI), sxF1 = zx.wS / (zx.wS + zx.wSun + zx.A0), xF1 = (zx.wS + zx.wSun) / (zx.wS + zx.wSun + zx.A0);
    const star = { F2: { sigmaSrc: st2.sigmaSrc, sigmaOne: st2.sigmaOne, ratio: L.ratioOf(sx, sx), yard: z2.yard * L.ratioOf(sx, sx) },
      F1: { sigmaSrc: stx.sigmaSrc, sigmaOne: stx.sigmaOne, ratio: L.ratioOf(xF1, sxF1), yard: zx.yard * L.ratioOf(xF1, sxF1) } };
    t1.push({ key, r0: g.r0, r1: g.r1, dr: g.dr, sigmaLit: g.sigmaLit, perSigma: per, den: { srcF2: st2.srcSI, oneF2: st2.oneSI, srcF1: zx.wS, sunF1: zx.wSun, oneF1: zx.A0 }, rows, wide, star });
    // 表 2: 受け手の読み 3 つ
    const collective = [g.sigmaLit, D.sigmas[D.sigmas.length - 1]].map((s) => { const r = rows.find((q) => q.sigma === s); return { sigma: s, yardF2: r.F2C2.yard, yardF1: r.F1C2.yard }; });
    const rigid = [];
    for (const s of [g.sigmaLit, D.sigmas[D.sigmas.length - 1]]) for (const cR of D.rigidCRs) {
      const rg = L.rigidOf(key, s, cR), a = L.diskSurf(key, { recv: rg }), b = L.axSurf(T1, GEO, key, { recv: rg });
      // 剛体の輪の自分の重み = 源の重みになる面密度(自分の重みは Σ に比例)
      rigid.push({ sigma: s, cR, m: rg.m, R: rg.R, yardF2: a.yard, yardF1: b.yard, A0OverWS: a.A0u / a.wSu, sigmaStar: s * a.wSu / a.A0u });
    }
    t2.push({ key, particle: { yardF2: z2.yard, yardF1: zx.yard, A0OverWS: z2.A0u / z2.wSu }, collective, rigid });
  }
  mark('t1t2');
  const t3 = [];
  for (const axis of D.planeAxes) for (const [grp, ids] of [['inner', D.inner], ['giant', D.giant]]) for (const id of ids) {
    const p1 = L.planeAx(T1, GEO, id, { axis, recv: { cR: 1 } }), p01 = L.planeAx(T1, GEO, id, { axis, recv: { cR: 0.1 } }), c = L.planeClosed(T1, GEO, id, { axis });
    t3.push({ id, group: grp, axis, a: p1.a, R: p1.R, v: p1.v, v01: p01.v, q: p1.A0OverWS, q01: p01.A0OverWS, mOverMsun: p1.mOverMsun, scatterDeg: p1.scatterDeg, vW: c.vW, vStar: c.vStar, vOverStar: c.vOverStar, closed: c.closed });
  }
  mark('t3');
  const J = { pure, t1, t2, t3, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w353y-ringsurf.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W353Y_OUT ? (path.isAbsolute(process.env.W353Y_OUT) ? process.env.W353Y_OUT : path.join(ROOT, process.env.W353Y_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第353便y ringsurf(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w353y-ringsurf.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-25 —— 第151報)・統括の検証項目 R489', decl: L.DECL, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第353便y', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'ringsurf', engine: 'Node(html を読まない —— 純関数の lib・第353便k・d・h・第352便s・k・za・c・第351便j・c ほかの lib を呼ぶ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
