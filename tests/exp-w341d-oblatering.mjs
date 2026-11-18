// 第341便d(原仮定者の回答(2026-11-17 —— 第140報の回答)の扁平の則の予想・原仮定者の指示(2026-11-12 —— 第135報)の回転引きずりの条件・原仮定者の補足(2026-11-18 —— 第141報)の熱の文・
//   統括の検証項目 R367): **扁平の源の区切りを細かく(T1)・R_eq の内と外で落ち方を変える型(T2)・環の口の熱を補足 1 で読み直す(T3)**
//   (段 oblatering-341d —— 正本 tests/out/oblatering-341d.json・lib tests/lib-w341d-oblatering.mjs)。**診断だけ** —— エンジン・内蔵の本・受理器・既存の lib の本文は変えない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w341d-oblatering.mjs —— 領域の宣言なし)・入力のファイルは無い(4 天体の強さの組は第338便d の lib の k4Sets を呼んで作り直す)。1 プロセス。
// 正本へ書く形は第338便c の settleRun(Math の関数の戻り値を ±1〜2 ulp ずらした走り直しの差の最大を葉ごとの尺度 σ とし、|値| ≤ 4 σ の葉〔丸めの残り〕を 0 と書く)。
// 区切りの 4 段(960・3840・15360・61440 点)は全部この段で作る(1 回の走行 約 10 s —— 収束の口を別に分けなくても 60 s の内)。
//
// ■ 走らせたノブの格子と判定の物差し(正本の先頭 —— 式の形の宣言ではなく、何を測ったかの記録)
//   T1: 並び 5(focus〔主〕・surf・uni・ang・lay)× 区切り 4 × 扁平率(focus は 6・surf と uni は 0 と 0.098・ang と lay は 0)× 距離 ÷ 赤道半径 7 × 高さ(focus は 0.01 と 0.1〔0.1 は扁平率 0 と 0.098〕・ほかは 0.01)+ 起点(第340便d の 960 点)。
//     物差し: 隣どうしの差・Richardson の外挿・収束した桁・並びどうしの開き。「区切りで消える差」= 起点 − 外挿・「細かくしても残る差」= 外挿 − 1(3 × 最後の差より大きいとき)。
//   T2: 高さの形 2(slice = 帯を入力・fall = 落ち方 p 3 × 滑らかさ m 3)× 経路の型の距離のべき k 3。物差し: 一様の物差し(局所のべき ≤ 0.1)・帯の型(z* ≤ 3 R_eq・外 ÷ 内 ≤ 0.1)・第337便i の環の物差しと 4 惑星の尺度。
//   T3: 口 2 × 組 2 × 中心 5 = 20 行 × 座標変換の取り分の列 3 × 動いた割合 μ_m。物差し: 帳簿の閉じ(a + b + c = q)・(c) の負の行の数と総残差。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w341d-oblatering.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w341d-oblatering-1';
export const AMEND = Object.freeze([]);
export const OUT_MAIN = 'tests/out/oblatering-341d.json';
export const TARGET = 'tests/lib-w341d-oblatering.mjs';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze(['扁平で回転引きずりが強くなると分かったとは書かない(この区切り・このノブの組では、の表と収束した桁)', '一様厚みが導けたとは書かない',
  '負の熱が解消したとは書かない(分け方ごとの負の行の数)', '環が薄い理由が分かったとは書かない', '光速を超えるかどうかを判定に使わない', '文献の値は未照合(出典と確かさを書く)']);
const D1 = L.DECL.t1, D2 = L.DECL.t2, D3 = L.DECL.t3;
const Q0 = ['magH1', 'corV', 'corS', 'drag90'], QF = ['h1Mag', 'h1Tilt', 'rotUMag', 'rotUTilt', 'corV', 'corS', 'drag90'];
const pickF = (r, q) => (q === 'h1Mag' ? r.field.h1.magRatio : q === 'h1Tilt' ? r.field.h1.axisTiltRatio : q === 'rotUMag' ? r.field.rotU.magRatio : q === 'rotUTilt' ? r.field.rotU.axisTiltRatio : r.pull[q].ratio);
const pick0 = (r, q) => r.vsPoint[q];

/* ───────── T1 ───────── */
export function partT1() {
  const fOf = (arr) => (arr === 'focus' ? D1.fGrid : arr === 'surf' || arr === 'uni' ? D1.fSub : D1.fDiag);
  const byArr = {};
  const zOf = (arr) => (arr === 'focus' ? D1.zOverR : [D1.zMain]);
  for (const arr of L.ARRS) byArr[arr] = D1.levels.map((_, lv) => L.levelRows(arr, lv, fOf(arr), zOf(arr)));
  const anchor = L.levelRows('cyl340', 0, D1.fSub, D1.zOverR);
  const conv = [];
  for (const arr of L.ARRS) for (const z of zOf(arr)) for (const f of fOf(arr)) { if (z !== D1.zMain && !D1.fSub.includes(f)) continue;
    for (const rr of D1.rOverReq) { const rowsAt = byArr[arr].map((R) => R.find((x) => x.f === f && x.rOverReq === rr && x.zOverR === z));
      const qs = f === 0 ? Q0 : QF;
      for (const q of qs) { const seq = rowsAt.map((x) => (f === 0 ? pick0(x, q) : pickF(x, q))), a = anchor.find((x) => x.f === f && x.rOverReq === rr && x.zOverR === z);
        const c = L.convergeOf(seq); conv.push(Object.assign({ arr, f, rOverReq: rr, zOverR: z, q, anchor340: a ? (f === 0 ? pick0(a, q) : pickF(a, q)) : null }, c)); } } }
  // 並びどうしの開き(区切り 61440 の外挿 —— focus・surf・uni)と、要約の不確かさ = max(最後の差 + 外挿の幅, 並びどうしの開き)
  const get = (arr, f, rr, z, q) => conv.find((c) => c.arr === arr && c.f === f && c.rOverReq === rr && c.zOverR === z && c.q === q);
  const summary = [];
  for (const z of D1.zOverR) for (const f of D1.fGrid) { if (z !== D1.zMain && !D1.fSub.includes(f)) continue;
    for (const rr of D1.rOverReq) for (const q of (f === 0 ? Q0 : QF)) { const m = get('focus', f, rr, z, q), others = D1.fSub.includes(f) && z === D1.zMain ? ['surf', 'uni'].map((a) => get(a, f, rr, z, q)).filter(Boolean) : [];
      if (!m || !m.ok) { summary.push({ f, rOverReq: rr, zOverR: z, q, ok: false }); continue; }
      const spread = others.length ? Math.max(...others.map((o) => Math.abs(o.best - m.best))) : null, lastW = Math.abs(m.diffs[m.diffs.length - 1]) + (m.richardson !== null ? Math.abs(m.richardson - m.qs[m.qs.length - 1]) : 0);
      const unc = Math.max(lastW, spread === null ? 0 : spread), digits = unc > 0 && m.best !== 0 ? Math.max(0, Math.floor(-Math.log10(unc / Math.abs(m.best)))) : 15;
      const dev = m.best - 1, verdict = Math.abs(dev) > unc ? (dev > 0 ? 1 : -1) : 0;
      summary.push({ f, rOverReq: rr, zOverR: z, q, ok: true, best: m.best, anchor340: m.anchor340, unc, digits, spread, vanish: m.anchor340 === null ? null : Math.abs(m.anchor340 - m.best), remain: Math.abs(dev), remainKept: Math.abs(dev) > D1.keepFactor * unc, above1: verdict }); } }
  // 回答 1 の予想の向き(扁平で軸の傾きが強くなる —— 軸の傾きの比 > 1)の表: 扁平率 × 距離(高さ 0.01・h1 と rotU)
  const tiltTable = D1.fGrid.filter((f) => f !== 0).map((f) => ({ f, by: D1.rOverReq.map((rr) => { const h = summary.find((s) => s.f === f && s.rOverReq === rr && s.zOverR === D1.zMain && s.q === 'h1Tilt'), u = summary.find((s) => s.f === f && s.rOverReq === rr && s.zOverR === D1.zMain && s.q === 'rotUTilt');
    return { rOverReq: rr, h1: h.best, h1Unc: h.unc, h1Dir: h.above1, rotU: u.best, rotUUnc: u.unc, rotUDir: u.above1, h1Anchor340: h.anchor340 }; }) }));
  const counts = { nConv: conv.length, nSummary: summary.length, nRows: Object.values(byArr).reduce((t, a) => t + a.reduce((s, R) => s + R.length, 0), 0), nAnchor: anchor.length };
  const nPts = Object.fromEntries(L.ARRS.map((a) => [a, byArr[a].map((R) => R[0].n)]));
  return { nPts, nAnchorPts: anchor[0].n, conv, summary, tiltTable, counts, anchor: anchor.map((r) => ({ f: r.f, rOverReq: r.rOverReq, zOverR: r.zOverR, vsPoint: r.vsPoint || null, h1Tilt: r.field.h1.axisTiltRatio, h1Mag: r.field.h1.magRatio, pull: Object.fromEntries(Object.entries(r.pull).map(([k, v]) => [k, v.ratio])) })) };
}

/* ───────── T2 ───────── */
export function partT2() {
  const specs = L.t2Specs(), uniform = specs.map((s) => L.uniformRow(s)), judge = specs.map((s) => L.judgeRow(s));
  const table = specs.map((s, i) => { const u = uniform[i], j = judge[i];
    return { key: s.key, prof: s.prof, given: s.given, p: s.p || null, m: s.m || null, k: s.k, allThin: u.allThin, uniform: u.uniform, bandLike: u.bandLike, tStarMax: u.tStarMax, Hmin: u.allThin ? Math.min(...u.rows.map((r) => r.H)) : null, Hmax: u.allThin ? Math.max(...u.rows.map((r) => r.H)) : null,
      powMax: u.pows.every((x) => x !== null) ? Math.max(...u.pows.map((x) => Math.abs(x))) : null, outIn: u.outIn, ringThin: j.ring.thin, ringPass: j.ring.pass, lambdaNeed: j.ring.lambdaNeed, planetsInside: j.planets ? j.planets.allInside : null, planetsWorst: j.planets ? j.planets.worst : null }; });
  return { specs, uniform, judge, table, ReqSat: uniform[0].Req };
}

/* ───────── T3 ───────── */
export function partT3() {
  const sets = L.k4Sets(), rows = L.portSplitRows(sets), summary = L.portSplitSummary(rows);
  return { sets: Object.fromEntries(L.SETS.map((k) => [k, { chi: sets[k].chi, q: sets[k].q, p: sets[k].p, lambda: sets[k].lambda }])), rows, summary };
}

export function gatesOf(J) {
  const t1 = J.t1, t2 = J.t2, t3 = J.t3;
  const a340 = (rr, a) => (t1.anchor.find((x) => x.f === 0 && x.rOverReq === rr && x.zOverR === 0.01) || {}).vsPoint?.[a];
  return {
    pure: Object.values(J.pure.gates).every(Boolean),
    t1Complete: L.ARRS.every((a) => t1.nPts[a].join(',') === D1.levels.join(',')) && t1.nAnchorPts === 960 && t1.counts.nAnchor === D1.fSub.length * D1.rOverReq.length * D1.zOverR.length,
    t1SphereControl: t1.conv.filter((c) => c.f === 0).length > 0 && t1.summary.filter((s) => s.f === 0 && s.q === 'magH1').every((s) => s.ok && s.best > 0 && s.best <= 1),
    t1AnchorFinite: [1.1, 1.5, 2].every((rr) => ['corV', 'corS', 'drag90'].every((a) => typeof a340(rr, a) === 'number')),
    t1Tilt: t1.tiltTable.length === D1.fGrid.length - 1 && t1.tiltTable.every((t) => t.by.length === D1.rOverReq.length),
    t2Complete: t2.table.length === D2.kGrid.length * (1 + D2.pGrid.length * D2.mGrid.length),
    t2SliceBand: t2.uniform.filter((u) => u.prof === 'slice').every((u) => u.allThin && u.rows.every((r) => Math.abs(r.H - 2 * u.Req) <= 1e-9 * u.Req)),
    t3Closed: t3.rows.length === 20 && L.SETS.length === 2 && Object.values(t3.summary.colA).every((by) => Object.values(by).every((x) => x.closedAll)),
    t3OldNeg: t3.summary.old.n === 20,
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { scenes: L.pureView(PS), gates: L.pureGates(PS) }; mark('pure');
  const t1 = partT1(); mark('t1');
  const t2 = partT2(); mark('t2');
  const t3 = partT3(); mark('t3');
  const J = { pure, t1, t2, t3, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}
export function runSettled() {
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const { gates, ok, ...rest } = S.value, g2 = gatesOf(S.value);
  return { J: Object.assign(rest, { timing: tm, gates: g2, ok: Object.values(g2).every(Boolean) }), recheck: S.meta };
}

const writeJson = (OUT, out) => { fs.mkdirSync(path.dirname(OUT), { recursive: true }); fs.writeFileSync(OUT, JSON.stringify(out, null, 1).replace(/\[\s*(-?[\d.eE+-]+(?:,\s*-?[\d.eE+-]+|,\s*null)*)\s*\]/g, (m, a) => '[' + a.replace(/\s+/g, '') + ']') + '\n'); };
export const CODE = Object.freeze(['tests/exp-w341d-oblatering.mjs', 'tests/lib-w341d-oblatering.mjs', 'tests/lib-w340d-gyropath.mjs', 'tests/lib-w338b-bevelknob.mjs', 'tests/lib-w338d-ringbook.mjs', 'tests/lib-w337i-rotring.mjs',
  'tests/lib-w339a-rotvert.mjs', 'tests/lib-w337l-bevel.mjs', 'tests/lib-w337a-supply.mjs', 'tests/lib-w338c-recheck.mjs', 'tests/lib-w272e-provenance.mjs']);
export async function main() {
  const t0 = Date.now();
  const OUT = process.env.W341D_OUT ? (path.isAbsolute(process.env.W341D_OUT) ? process.env.W341D_OUT : path.join(ROOT, process.env.W341D_OUT)) : path.join(ROOT, OUT_MAIN);
  console.log('第341便d oblatering(版 ' + HARNESS_VERSION + ')');
  const { J: R, recheck } = runSettled();
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w341d-oblatering.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-17 —— 第140報の回答)の扁平の則の予想・原仮定者の指示(2026-11-12 —— 第135報)の回転引きずりの条件・原仮定者の補足(2026-11-18 —— 第141報)の熱の文・統括の検証項目 R367',
    decl: L.DECL, arrs: L.ARR_JA, amend: AMEND, notClaim: NOT_CLAIM, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第341便d', target: TARGET, code: CODE, inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'oblatering', engine: 'Node の純関数だけ(html を読まない・エンジンの步を進めない —— 源の求積の部位の和・第337便i の率・第338便d の環の組)', notClaim: NOT_CLAIM, recheck,
    units: 'T1 は無次元(源の R_d 1・質量の和 1・自転 1)・T2 と T3 は SI(土星の環・太陽と 4 惑星)' });
  writeJson(OUT, out);
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();
