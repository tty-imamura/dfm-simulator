// 第343便d(原仮定者の回答(2026-11-19 —— 第142報の回答 2)AN841・AN842・原仮定者の回答(2026-11-18 —— 第142報)AN800・統括の検証項目 R381):
//   **扁平の源の h1 の場を、物理の表面にだけ点を置く求積(発散定理)で数え、弦の向きの積分(第342便c)と 61440 点の表(第341便d)と並べる・極の例外の直しの試験・適用の境目**
//   (段 surfquad-343d —— 正本 tests/out/surfquad-343d.json・lib tests/lib-w343d-surfquad.mjs)。**診断だけ** —— エンジン・内蔵の本・受理器は変えない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w343d-surfquad.mjs —— 領域の宣言なし)。入力のファイルは第341便d の正本 tests/out/oblatering-341d.json(比べる 42 条件 —— 読むだけ・点は増やさない)と
//   第342便c の正本 tests/out/oblateapprox-342c.json(弦の向きの積分の列 —— 読むだけ)。正本へ書く形は第338便c の settleRun。
//
// ■ 走らせたノブの格子と判定の物差し(正本の先頭 —— 何を測ったかの記録)
//   T1 極の試験: 扁平率 3 × 極の真上・真下・すぐ横(横のずれ 1e-6)で、弦(向き 16 × 32)と表面(96 × 192)の場のベクトルと体積。極では傾きの比は 0/0 なので場のベクトルと体積で比べる。
//      42 条件の弦の列(向き 32・128・512)を lib-2 で作り直して、第342便c の正本の数と同じか(数の葉ごとに完全一致)。
//   T2 独立の求積: 42 条件で表面の刻み 64 × 128 と 96 × 192。(a) 表面の刻みどうしの差 (b) 表面(細)と弦 128・弦 512 の差 (c) 表面(細)と第341便d の表の差(best —— Richardson の外挿)の最大。
//      加えて (c′) 表面(細)と第341便d の主の並び focus の区切りの最後の段(61440 点・外挿なし)の差。表面の刻みの差は厳密な誤差の上限ではない。
//   T4 適用の境目: 扁平率 3 × 距離 2 × 高さ 6(1 = 極の真上)で弦(16 × 32 と 32 × 64)と表面(96 × 192 と 192 × 384)の場の相対の差。源の内・密度の偏り・ほかの核は数えていない。
//   T5 外の試算の弦の 2 つの数と第342便c の数の違い: 比べる点の集合・向きの数・参照の読み方(best・区切りの最後の段)を変えた差の最大の表(原因を言い切らない)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w343d-surfquad.mjs';
import * as C from './lib-w342c-oblateapprox.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w343d-surfquad-1';
export const AMEND = Object.freeze([]);
export const OUT_MAIN = 'tests/out/surfquad-343d.json';
export const TARGET = 'tests/lib-w343d-surfquad.mjs';
export const INPUTS = Object.freeze([L.DECL.ref.file, L.DECL.chordFile]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze(['弦の積分が正しいと分かったとは書かない(この 42 条件・この刻みでは、の表)', '表の誤りが分かったとは書かない', '扁平の効きが導けたとは書かない',
  '表面の刻みの差を厳密な誤差の上限として使わない', '試した範囲は外の点・一様な密度の回転楕円体・逆二乗の核・h1 の軸の傾きと強さだけ(源の内・密度の偏り・経路の型・環の幅は数えていない)',
  '外の試算の数と違う所の原因を言い切らない(試した点の集合と読み方の表だけ)']);
const D = L.DECL;
const key = (f, d, s) => f + '|' + d + '|' + s;

/** 比べる 42 条件(第341便d の正本)と第342便c の弦の列 —— 器の外から数として渡す */
export function readInputs(root = ROOT) {
  const R = JSON.parse(fs.readFileSync(path.join(root, D.ref.file), 'utf8')), W = JSON.parse(fs.readFileSync(path.join(root, D.chordFile), 'utf8'));
  const ref = R.t1.summary.filter((r) => r.q === D.ref.q && r.ok).map((r) => {
    const cv = R.t1.conv.find((q) => q.arr === 'focus' && q.q === D.ref.q && q.f === r.f && q.rOverReq === r.rOverReq && q.zOverR === r.zOverR);
    return { f: r.f, d: r.rOverReq, s: r.zOverR, best: r.best, unc: r.unc, last: cv ? cv.qs[cv.qs.length - 1] : null, rich: cv ? cv.richardson : null };
  });
  const chord = W.t2.levels.map((lv) => ({ nDir: lv.nDir, dims: lv.dims, rows: lv.rows.map((x) => ({ f: x.f, d: x.d, s: x.s, tiltRatio: x.tiltRatio, magRatio: x.magRatio, volRatioOblate: x.volRatioOblate, volRatioSphere: x.volRatioSphere, nKernel: x.nKernel })) }));
  return { ref, chord, refVersion: R.version, chordVersion: W.version, chordLibVersion: W.libVersion };
}

/* ───────── T1 極の試験と 42 条件の不変 ───────── */
export function partT1(inp) {
  return { poles: L.poleRows() };
}
/** 42 条件の弦の列を lib-2 で作り直す(第342便c の正本の数と葉ごとに完全一致か —— Math をずらす settleRun の外で数える) */
export function unchanged42(inp) {
  let nLeaf = 0, nDiff = 0;
  const levels = C.DECL.dirLevels.map((lv, li) => {
    const canon = inp.chord[li], rows = inp.ref.map((r) => C.chordRow(r.f, r.d, r.s, lv));
    for (const x of rows) { const c = canon.rows.find((q) => q.f === x.f && q.d === x.d && q.s === x.s);
      for (const k of ['tiltRatio', 'magRatio', 'volRatioOblate', 'volRatioSphere', 'nKernel']) { nLeaf++; if (!c || c[k] !== x[k]) nDiff++; } }
    return { nDir: lv[0] * lv[1], n: rows.length };
  });
  return { levels, nLeaf, nDiff, chordLibVersion: inp.chordLibVersion, libVersionNow: C.LIB_VERSION };
}

/* ───────── T2 独立の求積 ───────── */
export function partT2(inp) {
  const lv = D.surfLevels.map(([nt, np]) => inp.ref.map((r) => L.surfaceRow(r.f, r.d, r.s, [nt, np])));
  const fine = lv[D.surfMain], coarse = lv[0], ch = new Map(inp.chord[D.chordMain].rows.map((x) => [key(x.f, x.d, x.s), x])), chF = new Map(inp.chord[D.chordFine].rows.map((x) => [key(x.f, x.d, x.s), x]));
  const rows = inp.ref.map((r, i) => {
    const sv = fine[i].tiltRatio, c128 = ch.get(key(r.f, r.d, r.s)).tiltRatio, c512 = chF.get(key(r.f, r.d, r.s)).tiltRatio;
    return { f: r.f, d: r.d, s: r.s, surf: sv, surfCoarse: coarse[i].tiltRatio, chord128: c128, chord512: c512, refBest: r.best, refUnc: r.unc, refLast: r.last,
      dSelf: Math.abs(sv - coarse[i].tiltRatio), dChord128: Math.abs(sv - c128), dChord512: Math.abs(sv - c512), dRef: Math.abs(sv - r.best), dRefLast: r.last === null ? null : Math.abs(sv - r.last),
      signRef: Math.sign(r.best - sv), inUnc: Math.abs(sv - r.best) <= r.unc, chordCloser: Math.abs(sv - c128) < Math.abs(sv - r.best), magSurf: fine[i].magRatio, magChord128: ch.get(key(r.f, r.d, r.s)).magRatio,
      volErr: Math.max(Math.abs(fine[i].volRatioOblate - 1), Math.abs(fine[i].volRatioSphere - 1)) };
  });
  const mxAt = (k) => rows.filter((x) => x[k] !== null).reduce((m, x) => (x[k] > m[k] ? x : m));
  const at = (x, k) => ({ value: x[k], f: x.f, d: x.d, s: x.s });
  const summary = { n: rows.length, a: at(mxAt('dSelf'), 'dSelf'), b128: at(mxAt('dChord128'), 'dChord128'), b512: at(mxAt('dChord512'), 'dChord512'), c: at(mxAt('dRef'), 'dRef'), cLast: at(mxAt('dRefLast'), 'dRefLast'),
    nRefLast: rows.filter((x) => x.dRefLast !== null).length, inUnc: rows.filter((x) => x.inUnc).length, chordCloser: rows.filter((x) => x.chordCloser).length,
    refAbove: rows.filter((x) => x.signRef > 0).length, refBelow: rows.filter((x) => x.signRef < 0).length,
    oblateRefBelowSurf: rows.filter((x) => x.f > 0 && x.signRef < 0).length, prolateRefAboveSurf: rows.filter((x) => x.f < 0 && x.signRef > 0).length,
    magMaxChord128: Math.max(...rows.map((x) => Math.abs(x.magSurf - x.magChord128))), volErr: Math.max(...rows.map((x) => x.volErr)), nSurf: D.surfLevels.map(([a, b]) => a * b) };
  return { rows, summary };
}

/* ───────── T4 適用の境目 ───────── */
export function partT4() {
  const rows = L.edgeRows(), out = rows.filter((r) => r.outside);
  const grp = (sel) => { const R = out.filter(sel); return R.length ? { n: R.length, fieldRelMax: Math.max(...R.map((r) => r.fieldRel)), fieldRelFineMax: Math.max(...R.map((r) => r.fieldRelFine)), chordSelfMax: Math.max(...R.map((r) => r.chordSelf)), surfSelfMax: Math.max(...R.map((r) => r.surfSelf)) } : { n: 0 }; };
  return { rows, scope: L.EDGE_SCOPE, groups: { smooth: grp((r) => !r.verticalHits), verticalHits: grp((r) => r.verticalHits), pole: grp((r) => r.s === 1) }, inside: rows.filter((r) => !r.outside).map((r) => ({ f: r.f, d: r.d, s: r.s })) };
}

/* ───────── T5 外の試算の弦の 2 つの数 ───────── */
export function partT5(inp, t2) {
  const sat = (x) => x.f === 0.098 && x.s === 0.01, s01 = (x) => x.f === 0.098 && x.s === 0.1;
  const sets = [['土星の型の 7 点(扁平率 0.098・高さ 0.01)', sat], ['同 6 点(1.5 を除く —— 第342便c の係数を決めた点)', (x) => sat(x) && x.d !== 1.5], ['同 6 点(1.1 を除く)', (x) => sat(x) && x.d !== 1.1],
    ['同 6 点(2.33 を除く)', (x) => sat(x) && x.d !== 2.33], ['高さ 0.1 の 7 点(扁平率 0.098)', s01], ['同 6 点(1.5 を除く)', (x) => s01(x) && x.d !== 1.5]];
  const reads = [['弦 128 − best', 'chord128', 'refBest'], ['弦 512 − best', 'chord512', 'refBest'], ['表面 − best', 'surf', 'refBest'], ['弦 128 − 最後の段', 'chord128', 'refLast'], ['弦 128 − 表面', 'chord128', 'surf']];
  const rows = [];
  for (const [nm, sel] of sets) { const R = t2.rows.filter(sel); const o = { set: nm, n: R.length };
    for (const [rn, a, b] of reads) { const v = R.filter((x) => x[a] !== null && x[b] !== null).map((x) => Math.abs(x[a] - x[b])); o[rn] = v.length ? Math.max(...v) : null; }
    rows.push(o); }
  return { rows, outside: { chordSat6: D.outside.chordSat6, chordS01: D.outside.chordS01 }, note: '外の試算の 2 つの数(7.905e-5・9.470e-5)は、この表のどの集合・どの読み方でも同じ数にならなかった —— 原因は言い切らない' };
}

export function gatesOf(J) {
  const t1 = J.t1, t2 = J.t2, P = t1.poles;
  return {
    pure: Object.values(J.pure.gates).every(Boolean),
    inputsComplete: J.inputs.nRef === D.ref.nPts && J.inputs.nChordLevels === 3,
    poleRuns: P.length === D.pole.fGrid.length && P.every((o) => ['top', 'bottom', 'topSide', 'bottomSide'].every((k) => o[k] && o[k].chord.every(Number.isFinite) && o[k].surf.every(Number.isFinite))),
    poleContinuous: P.every((o) => o.contChord <= D.poleTol && o.contSurf <= D.poleTol && o.contVol <= D.volTol && o.volErr <= 1e-9 && o.agreeMax <= D.agreeTol && o.mirror <= 1e-12),
    t2Complete: t2.rows.length === D.ref.nPts && t2.summary.volErr <= 1e-9,
    t4Complete: J.t4.rows.length === D.edge.fGrid.length * D.edge.dGrid.length * D.edge.sGrid.length,
    /** 42 条件の弦の列が第342便c の正本と葉ごとに同じ(settleRun の外で数えた J.unchanged42 —— 走り直しの中では無い) */
    unchanged42: !!J.unchanged42 && J.unchanged42.nDiff === 0 && J.unchanged42.nLeaf === 3 * D.ref.nPts * 5 && J.unchanged42.chordLibVersion === J.unchanged42.libVersionNow,
  };
}
export function runAll(inp) {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { scenes: L.pureView(PS), gates: L.pureGates(PS) }; mark('pure');
  const t1 = partT1(inp); mark('t1');
  const t2 = partT2(inp); mark('t2');
  const t4 = partT4(); mark('t4');
  const t5 = partT5(inp, t2); mark('t5');
  const J = { inputs: { nRef: inp.ref.length, nChordLevels: inp.chord.length, refVersion: inp.refVersion, chordVersion: inp.chordVersion, chordLibVersion: inp.chordLibVersion }, pure, t1, t2, t4, t5, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}
export function runSettled(inp) {
  let tm = null;
  const S = settleRun(() => { const R = runAll(inp); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const { gates, ok, ...rest } = S.value, J = Object.assign(rest, { unchanged42: unchanged42(inp) }), g2 = gatesOf(J);
  return { J: Object.assign(J, { timing: tm, gates: g2, ok: Object.values(g2).every(Boolean) }), recheck: S.meta };
}

const writeJson = (OUT, out) => { fs.mkdirSync(path.dirname(OUT), { recursive: true }); fs.writeFileSync(OUT, JSON.stringify(out, null, 1).replace(/\[\s*(-?[\d.eE+-]+(?:,\s*-?[\d.eE+-]+|,\s*null)*)\s*\]/g, (m, a) => '[' + a.replace(/\s+/g, '') + ']') + '\n'); };
export const CODE = Object.freeze(['tests/exp-w343d-surfquad.mjs', 'tests/lib-w343d-surfquad.mjs', 'tests/lib-w342c-oblateapprox.mjs', 'tests/lib-w341d-oblatering.mjs', 'tests/lib-w340h-thin.mjs', 'tests/lib-w338c-recheck.mjs', 'tests/lib-w272e-provenance.mjs']);
export async function main() {
  const t0 = Date.now();
  const OUT = process.env.W343D_OUT ? (path.isAbsolute(process.env.W343D_OUT) ? process.env.W343D_OUT : path.join(ROOT, process.env.W343D_OUT)) : path.join(ROOT, OUT_MAIN);
  console.log('第343便d surfquad(版 ' + HARNESS_VERSION + ')');
  const inp = readInputs();
  const { J: R, recheck } = runSettled(inp);
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w343d-surfquad.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-19 —— 第142報の回答 2)AN841・AN842・原仮定者の回答(2026-11-18 —— 第142報)AN800・統括の検証項目 R381',
    decl: L.DECL, amend: AMEND, notClaim: NOT_CLAIM, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第343便d', target: TARGET, code: CODE, inputs: [...INPUTS] }), {
    harnessVersion: HARNESS_VERSION, stage: 'surfquad', engine: 'Node の純関数だけ(html を読まない・エンジンの步を進めない —— 表面のフラックスの求積・弦の向きの積分)', notClaim: NOT_CLAIM, recheck,
    units: '無次元(源の R_d 1・質量の和 1)' });
  writeJson(OUT, out);
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();
