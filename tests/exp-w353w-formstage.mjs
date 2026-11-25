// 第353便w(原仮定者の整理(2026-11-24 —— 第148報)・原仮定者の回答(2026-11-25 —— 第151報)・統括の検証項目 R487):
//   **形成の段階の題の入口の器 —— 背景が時間で替わる模型(始めは (G−) の項を持つ背景 → いまの (N+))で、太陽の傾きを「作る段」と「保つ段」を 1 本の時間の列でつなぐ。
//   表 1 主の式 (g2−)(作る段 → 保つ段)/表 2 替わり方の急さ(残る角と閉じた形)/表 3 比べる式 (g2+)(f も時間で替わる列)・零試験 8**
//   (段 formstage-353w —— 正本 tests/out/formstage-353w.json・lib tests/lib-w353w-formstage.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・既存の lib の本文は変えない。physics の鍵を足さない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w353w-formstage.mjs —— 領域の宣言なし)。入力のファイルは無い(lib を呼んで作り直す)。
//   1 プロセス。正本は第338便c の settleRun で書く。lib の閉包に第352便b の仮の値の lib が入る(第353便o の lib を経て)—— 正本の最上位に provisional: true と鍵の一覧。
//   仮の値の欄は使わない(鍵の一覧は空 —— 閉包に入るための印だけ)。
//
// ■ 言わないこと: 太陽の傾きの由来の答え・形成の段階の再現とは書かない(この形・この格子・この幅での、ノブの走査の表)。背景が替わる理由は予想の文として引くだけ。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w353w-formstage.mjs';
import * as O from './lib-w353o-suntiltmain.mjs';
import * as RC from './lib-w352c-refaxis.mjs';
import * as PV from './lib-w352b-provisional.mjs';
import * as E from './lib-w347e-spintorque.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w353w-formstage-1';
export const OUT_MAIN = 'tests/out/formstage-353w.json';
export const TARGET = 'tests/lib-w353w-formstage.mjs';
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const PROV_KEYS = Object.freeze([]);
export const NOT_CLAIM = Object.freeze([
  'ノブの走査の表 —— 太陽の傾きの由来の答え・形成の段階の再現とは書かない(この形・この格子・この幅では、の表)',
  '背景の時間の替わり方(替わる時刻・幅・形・始めの比と大きさ・移った後の大きさ)はノブ —— 由来は書かない。背景が替わる理由(銀河の中の位置・上下の運動)は予想の文として引くだけ',
  '主の式は (g2−)・主の向きは (N+)・基準軸 L(第151報の回答)。比べる式 (g2+)・eq は消さずに並べる —— 主の列と同じ重さでは扱わない',
  '「届く」の幅(角 ± 0.5°・方位 ± 5°)と「保つ」の帯(いまの角 ±10%)は物差し —— 採否の判定ではない',
  '上下の揺れの共鳴の帯(背景の大きさ ÷ 銀河の公転の角速度 2.4〜3.7)は〔第352便r〕〔第352便y〕の数を引くだけ',
  'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない']);
export const PLAN = Object.freeze({
  pure: '零試験 8(統括の数え直し 3 の基準軸 L・ω_G・太陽の円錐・t_sw → ∞ で枝 o の届く組 18 と 36・t_sw → 0 で届き 0・進め方 = 枝 o の twoAxisBoth・帯の長さ = 枝 o の dwellOf・残る角の閉じた形の極限・背景の和と方位 = 第352便r・拒否)',
  t1: '表 1 主の式 (g2−): 読み 2 × 基準軸 2 × 替わる時刻 4 × 始めの比 6 × 始めの大きさ 2 × 係数の差 5 × (移った後の大きさ, f) 5(形 step)+ 幅の列(tanh 幅 0.01・基準軸 L・時刻 2・移った後 0.98・f 0)—— 角・方位・同時・作る段 → 保つ段の組の数・一番近い組の外れ',
  t2: '表 2 替わり方の急さ: 始めの比 4 × 形 2 × x(歳差の率 × 幅)6 —— 1 つの軸が背景に付いて回るか(残る角 ÷ θ)と閉じた形・境目の x(半分残る)・いまの角が残る条件',
  t3: '表 3 比べる式 (g2+): 読み B × 基準軸 2 × 替わる時刻 4 × 始めの比 3 × 始めの大きさ 2 × 係数の差 3 × f の列 4(一定 0.7・0.85/作る段だけ大きく 0.7・0.85 → 保つ上限)—— 作る段 → 保つ段の組の数' });

/* ───────── 小さな道具 ───────── */
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const RD = Object.freeze({
  axes: L.DECL.axes, reads: L.DECL.reads,
  /** 替わる時刻(年齢の倍)・始めの比 ρ₀(枝 o の届く組の格子 —— 0 を除く)・始めの大きさ u₀(上下の揺れの共鳴の帯の両端)・係数の差 q(枝 o の格子) */
  tSws: Object.freeze([0.01, 0.1, 0.3, 0.5]), rho0s: Object.freeze([0.0605, 0.075, 0.087, 0.1, 1, Infinity]), u0s: Object.freeze([2.4, 3.7]), qs: Object.freeze([-1, -0.5, -0.1, 0.1, 1]),
  /** 移った後の大きさ u₁(窓の下端・上端 (N+)・注目の列)と f(0・保つ上限 —— u₁ ごとの fKeepAt)の組 */
  afters: Object.freeze([Object.freeze({ u1: 0.0487, f: '0' }), Object.freeze({ u1: 0.835, f: '0' }), Object.freeze({ u1: 0.98, f: '0' }), Object.freeze({ u1: 0.0487, f: 'keep' }), Object.freeze({ u1: 0.98, f: 'keep' })]),
  /** 幅の列(tanh)*/
  widthCol: Object.freeze({ shape: 'tanh', width: 0.01, axis: 'L', tSws: Object.freeze([0.1, 0.3]), u1: 0.98 }),
  /** 表 2: 始めの比・形・x = 歳差の率 × 幅(背景の大きさ 10 —— x だけが効く無次元の量) */
  rRhos: Object.freeze([0.0605, 0.087, 1, Infinity]), rShapes: Object.freeze(['exp', 'tanh']), rXs: Object.freeze([0.1, 0.3, 1, 1.386, 3, 10]), rU: 10, rTsw: 0.3,
  /** 表 3: 比べる式 (g2+)・読み B・f の列 */
  cTsws: Object.freeze([0.001, 0.003, 0.01, 0.1]), cRhos: Object.freeze([0.075, 1, Infinity]), cQs: Object.freeze([-1, -0.5, -0.1]), cU1: 0.98,
  cFs: Object.freeze([Object.freeze({ id: 'c70', f1: 0.7, f2: 'same' }), Object.freeze({ id: 'c85', f1: 0.85, f2: 'same' }), Object.freeze({ id: 's70', f1: 0.7, f2: 'keep' }), Object.freeze({ id: 's85', f1: 0.85, f2: 'keep' })]),
  /** 枝 o の格子(届く組の数え直し)*/
  oRhos: Object.freeze([0, 0.0605, 0.075, 0.087, 0.1, 1, Infinity]), oFs: Object.freeze([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]),
  wobbleBand: Object.freeze([2.4, 3.7]) });
export const ROWDECL = RD;
const isoRho = (r) => (r === Infinity ? 'inf' : r);
const fKeepOf = (axn, u1) => { const k = O.fKeepAt({ thDeg: L.DECL.tiltDeg[axn], u: u1 }); return k.noLimit ? 1 : k.fMax; };
const r4 = (x) => (fin(x) ? Number(x.toPrecision(4)) : x);

/** 組の集まりを 1 行に(数・範囲・一番近い組の外れ) */
function sumRows(runs) {
  const nG = runs.filter((r) => r.gReach).length, nA = runs.filter((r) => r.azReach).length, nB = runs.filter((r) => r.both).length, mk = runs.filter((r) => r.make);
  const both = runs.filter((r) => r.both), nIll = runs.reduce((s, r) => s + r.nIll, 0);
  const nearKeep = both.length ? Math.min(...both.map((r) => r.keepDev)) : null, nearAz = runs.filter((r) => fin(r.nearAzDeg)).map((r) => r.nearAzDeg);
  return { n: runs.length, nG, nA, nB, nMake: mk.length, nMakeQm1: mk.filter((r) => r.q === -1).length, nMakeRingNow: mk.filter((r) => r.ringOffEndDeg <= L.DECL.tol.gammaDeg).length, nKeepSw: runs.filter((r) => r.keepSw).length, nNow: runs.filter((r) => r.nowBoth).length, nIll, nForm: both.filter((r) => r.hitStage === 'form').length, nAzEnd: runs.filter((r) => r.azEndReach).length,
    makeCone: mk.length ? [r4(Math.min(...mk.map((r) => r.coneEndDeg))), r4(Math.max(...mk.map((r) => r.coneEndDeg)))] : null,
    makeDwell: mk.length ? [r4(Math.min(...mk.map((r) => r.dwell))), r4(Math.max(...mk.map((r) => r.dwell)))] : null,
    makeTsw: mk.length ? [...new Set(mk.map((r) => r.tSwitch))].sort((a, b) => a - b) : [], makeRho: mk.length ? [...new Set(mk.map((r) => isoRho(r.rho0)))] : [],
    turnsAfter: runs.some((r) => fin(r.turnsAfter)) ? [r4(Math.min(...runs.filter((r) => fin(r.turnsAfter)).map((r) => r.turnsAfter))), r4(Math.max(...runs.filter((r) => fin(r.turnsAfter)).map((r) => r.turnsAfter)))] : null,
    nearKeepDev: nearKeep === null ? null : r4(nearKeep), nearAzDeg: nearAz.length ? Math.round(Math.min(...nearAz) * 10) / 10 : null };
}

/* ───────── 表 1: 主の式 (g2−) ───────── */
export function mainRuns(GEO, ax) {
  const runs = [];
  for (const read of RD.reads) for (const axn of RD.axes) for (const tSwitch of RD.tSws) for (const rho0 of RD.rho0s) for (const u0 of RD.u0s) for (const q of RD.qs) for (const af of RD.afters) {
    const f = af.f === '0' ? 0 : fKeepOf(axn, af.u1);
    const r = L.runForm({ GEO, axisVec: ax[axn], axn, rho0, u0, u1: af.u1, tSwitch, width: 0, shape: 'step', sense: 'g2m', f, q, read });
    runs.push({ read, axis: axn, tSwitch, rho0, u0, q, u1: af.u1, fKind: af.f, f, ...r });
  }
  return runs;
}
export function mainRows(runs) {
  const rows = [];
  for (const read of RD.reads) for (const axn of RD.axes) for (const af of RD.afters) {
    const rs = runs.filter((r) => r.read === read && r.axis === axn && r.u1 === af.u1 && r.fKind === af.f);
    rows.push({ read, axis: axn, u1: af.u1, fKind: af.f, f: r4(af.f === '0' ? 0 : fKeepOf(axn, af.u1)), ...sumRows(rs) });
  }
  return rows;
}
export function tswRows(runs) {
  const rows = [];
  for (const read of RD.reads) for (const tSwitch of RD.tSws) { const rs = runs.filter((r) => r.read === read && r.tSwitch === tSwitch); rows.push({ read, tSwitch, ...sumRows(rs) }); }
  return rows;
}
export function widthRows(GEO, ax) {
  const W = RD.widthCol, rows = [];
  for (const read of RD.reads) for (const tSwitch of W.tSws) {
    const rs = [];
    for (const rho0 of RD.rho0s) for (const u0 of RD.u0s) for (const q of RD.qs) {
      const r = L.runForm({ GEO, axisVec: ax[W.axis], axn: W.axis, rho0, u0, u1: W.u1, tSwitch, width: W.width, shape: W.shape, sense: 'g2m', f: 0, q, read });
      rs.push({ tSwitch, rho0, ...r });
    }
    rows.push({ read, axis: W.axis, tSwitch, shape: W.shape, width: W.width, u1: W.u1, ...sumRows(rs) });
  }
  return rows;
}

/** 枝 o の届く組(背景が一定のまま —— 第353便o の scanCell)。sense・read を受ける */
export function oHits(GEO, ax, sense, read) {
  const out = [];
  for (const axn of RD.axes) for (const rho of RD.oRhos) for (const f of RD.oFs) for (const q of RD.qs) {
    const c = O.scanCell({ GEO, axisVec: ax[axn], axn, rho, sense, f, q, read });
    if (c.both) out.push({ axis: axn, rho, f, q, tauHit: c.tauHit });
  }
  return out;
}
/** 届いた時刻に背景が (N+) へ替わる(t_sw = τ_hit ÷ (abs(Ω₁) × 年齢))—— 始めの大きさ u₀ ごと。f は一定か { f1, f2 } */
function atHit(GEO, ax, h, { sense, read, u0, u1, fOf }) {
  const om1 = O.frameOf(GEO, ax[h.axis], h.axis, h.rho).om1, tSwitch = h.tauHit / (u0 * om1 * L.DECL.ageYr * L.YR);
  if (!(tSwitch < 1)) return null;
  const r = L.runForm({ GEO, axisVec: ax[h.axis], axn: h.axis, rho0: h.rho, u0, u1, tSwitch, width: 0, shape: 'step', sense, f: fOf(h), q: h.q, read });
  return { axis: h.axis, rho0: h.rho, f0: h.f, q: h.q, tauHit: h.tauHit, u0, tSwitch, ...r };
}
/** 表 1 の 2: 枝 o の (g2−) 読み A の 18 組で、届いた時刻に背景を (N+) へ替える(f は同じ)—— 届いた後の帯の長さ ÷ 年齢・終わりの輪の外れ */
export function oARuns(GEO, ax, hits) {
  const runs = [];
  for (const h of hits) for (const u0 of RD.u0s) { const r = atHit(GEO, ax, h, { sense: 'g2m', read: 'A', u0, u1: 0.98, fOf: (x) => x.f }); if (r) runs.push(r); }
  return runs;
}

/* ───────── 表 2: 替わり方の急さ ───────── */
export function retainRows(ax) {
  const rows = [], N = ax.L;
  for (const rho0 of RD.rRhos) {
    const base = L.retainOf({ axisVec: N, rho0, u0: RD.rU, u1: RD.rU, width: 0, shape: 'step', tSwitch: RD.rTsw });
    rows.push({ rho0: isoRho(rho0), shape: 'step', x: 0, thDeg: base.thDeg, residDeg: base.residDeg, ratio: base.ratio, closed: 1 });
    for (const shape of RD.rShapes) for (const x of RD.rXs) {
      // x = p w(p = 替わりの中ほどの背景での歳差の率 × 年齢)→ 幅 w を x から逆に置く
      const p0 = L.retainOf({ axisVec: N, rho0, u0: RD.rU, u1: RD.rU, width: 1, shape, tSwitch: RD.rTsw }).x;
      const r = L.retainOf({ axisVec: N, rho0, u0: RD.rU, u1: RD.rU, width: x / p0, shape, tSwitch: RD.rTsw });
      rows.push({ rho0: isoRho(rho0), shape, x: r.x, perTurn: r.perTurn, thDeg: r.thDeg, residDeg: r.residDeg, ratio: r.ratio, closed: L.retainClosed(shape, r.x) });
    }
  }
  return rows;
}
/** いまの角が残る条件: θ × R(x) ≥ いまの角(L)→ x ≤ x★(閉じた形)・幅 ÷ 歳差の 1 周 ≤ x★ ÷ 2π */
export function keepCondRows(GEO, ax) {
  const rows = [], gT = L.DECL.tiltDeg.L;
  for (const rho0 of RD.rRhos) {
    const th = O.frameOf(GEO, ax.L, 'L', rho0).thDeg, r = gT / th;
    const row = { rho0: isoRho(rho0), thDeg: th, need: r };
    for (const shape of RD.rShapes) { const xs = r >= 1 ? null : L.xForRetain(shape, r); row[shape] = xs === null ? null : { x: xs, perTurn: xs / (2 * Math.PI) }; }
    rows.push(row);
  }
  return rows;
}

/* ───────── 表 3: 比べる式 (g2+)(f も時間で替わる列)───────── */
export function cmpRuns(GEO, ax) {
  const runs = [];
  for (const axn of RD.axes) for (const tSwitch of RD.cTsws) for (const rho0 of RD.cRhos) for (const u0 of RD.u0s) for (const q of RD.cQs) for (const fc of RD.cFs) {
    const f2 = fc.f2 === 'same' ? fc.f1 : fKeepOf(axn, RD.cU1), f = fc.f2 === 'same' ? fc.f1 : { f1: fc.f1, f2 };
    const r = L.runForm({ GEO, axisVec: ax[axn], axn, rho0, u0, u1: RD.cU1, tSwitch, width: 0, shape: 'step', sense: 'g2p', f, q, read: 'B' });
    runs.push({ axis: axn, tSwitch, rho0, u0, q, fId: fc.id, f1: fc.f1, f2, ...r });
  }
  return runs;
}
/** 表 3 の 2: 枝 o の (g2+) 読み B の 36 組で、届いた時刻に背景を (N+) へ替える —— f 一定(作る段の f のまま)と、替わった後は保つ上限へ */
export function oBRuns(GEO, ax, hits) {
  const runs = [];
  for (const h of hits) for (const u0 of RD.u0s) for (const mode of ['same', 'keep']) {
    const r = atHit(GEO, ax, h, { sense: 'g2p', read: 'B', u0, u1: RD.cU1, fOf: (x) => (mode === 'same' ? x.f : { f1: x.f, f2: fKeepOf(x.axis, RD.cU1) }) });
    if (r) runs.push({ mode, ...r });
  }
  return runs;
}
export function cmpRows(runs) {
  const rows = [];
  for (const axn of RD.axes) for (const fc of RD.cFs) { const rs = runs.filter((r) => r.axis === axn && r.fId === fc.id); rows.push({ axis: axn, fId: fc.id, f1: fc.f1, f2: r4(rs[0].f2), ...sumRows(rs) }); }
  return rows;
}

export function gatesOf(J) {
  const nMain = RD.reads.length * RD.axes.length * RD.tSws.length * RD.rho0s.length * RD.u0s.length * RD.qs.length * RD.afters.length;
  const sumN = (rows) => rows.reduce((s, r) => s + r.n, 0);
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 8,
    t1: J.t1.rows.length === RD.reads.length * RD.axes.length * RD.afters.length && sumN(J.t1.rows) === nMain && sumN(J.t1.tsw) === nMain
      && J.t1.rows.every((r) => r.nMake <= r.nB && r.nB <= r.nG && r.nNow <= r.nKeepSw) && J.t1.width.length === RD.reads.length * RD.widthCol.tSws.length && J.t1.oA.nHit === L.ANCHOR.oA18,
    t2: J.t2.rows.length === RD.rRhos.length * (1 + RD.rShapes.length * RD.rXs.length) && J.t2.rows.filter((r) => r.shape === 'step').every((r) => Math.abs(r.ratio - 1) < 1e-9) && J.t2.cond.length === RD.rRhos.length,
    t3: J.t3.rows.length === RD.axes.length * RD.cFs.length && J.t3.oB.nHit === L.ANCHOR.oB36 && sumN(J.t3.rows) === RD.axes.length * RD.cTsws.length * RD.cRhos.length * RD.u0s.length * RD.cQs.length * RD.cFs.length,
  };
}
const strip = (runs) => runs.map((r) => ({ read: r.read, axis: r.axis, tSwitch: r.tSwitch, rho0: isoRho(r.rho0), u0: r.u0, q: r.q, u1: r.u1, fKind: r.fKind, fId: r.fId, mode: r.mode, f0: r.f0, both: r.both, make: r.make, keepSw: r.keepSw, nowBoth: r.nowBoth, tHit: r.tHit, coneEndDeg: r.coneEndDeg, gammaEndDeg: r.gammaEndDeg, ringOffEndDeg: r.ringOffEndDeg, dwell: r.dwell, keepDev: r.keepDev }));
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const T1 = E.t1Table(), GEO = E.geometry(), RA = RC.refAxes(T1, GEO), ax = { L: RA.L, eq: RA.eq }; mark('input');
  const PS = L.pureScenes(T1, GEO), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const mr = mainRuns(GEO, ax);
  const hA = oHits(GEO, ax, 'g2m', 'A'), oa = oARuns(GEO, ax, hA);
  const t1 = { rows: mainRows(mr), tsw: tswRows(mr), width: widthRows(GEO, ax), makes: strip(mr.filter((r) => r.make)), nowRuns: strip(mr.filter((r) => r.nowBoth)),
    oA: { nHit: hA.length, sum: sumRows(oa), byU0: RD.u0s.map((u0) => ({ u0, ...sumRows(oa.filter((r) => r.u0 === u0)) })), runs: strip(oa) } }; mark('t1');
  const t2 = { rows: retainRows(ax), cond: keepCondRows(GEO, ax), xHalf: { exp: L.xForRetain('exp', 0.5), tanh: L.xForRetain('tanh', 0.5) } }; mark('t2');
  const cr = cmpRuns(GEO, ax);
  const hB = oHits(GEO, ax, 'g2p', 'B'), ob = oBRuns(GEO, ax, hB);
  const t3 = { rows: cmpRows(cr), makes: strip(cr.filter((r) => r.make)),
    oB: { nHit: hB.length, byMode: ['same', 'keep'].map((mode) => ({ mode, ...sumRows(ob.filter((r) => r.mode === mode)) })),
      byModeQ: ['same', 'keep'].flatMap((mode) => [...new Set(ob.map((r) => r.q))].sort((a, b) => a - b).map((q) => ({ mode, q, ...sumRows(ob.filter((r) => r.mode === mode && r.q === q)) }))), runs: strip(ob) }, wobbleBand: RD.wobbleBand.slice() }; mark('t3');
  const J = { pure, t1, t2, t3, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w353w-formstage.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W353W_OUT ? (path.isAbsolute(process.env.W353W_OUT) ? process.env.W353W_OUT : path.join(ROOT, process.env.W353W_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第353便w formstage(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { provisional: true, provKeys: PROV_KEYS.slice(), provMark: PV.MARK, version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w353w-formstage.mjs', target: TARGET,
    ruling: '原仮定者の整理(2026-11-24 —— 第148報)・原仮定者の回答(2026-11-25 —— 第151報)・統括の検証項目 R487',
    decl: L.DECL, rowDecl: RD, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第353便w', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'formstage', engine: 'Node(html を読まない —— 純関数の lib・第353便o・第352便x・r・l の lib を呼ぶ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
