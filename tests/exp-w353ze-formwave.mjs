// 第353便ze(原仮定者の整理(2026-11-24 —— 第148報)・原仮定者の回答(2026-11-25 —— 第151報)・統括の検証項目 R494):
//   **形成の段階の題の続きの器 —— 替わる幅の細かい走査(表 1)/始めの背景が上下の揺れで回る形(表 2)/替わった後の方位の位相(表 3)/2 つのノブ(替わる時刻 ÷ 年齢・幅 ÷ 歳差の 1 周)で書いた条件(表 4)・零試験 8**
//   (段 formwave-353ze —— 正本 tests/out/formwave-353ze.json・lib tests/lib-w353ze-formwave.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・既存の lib の本文は変えない。physics の鍵を足さない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w353ze-formwave.mjs —— 領域の宣言なし)。入力のファイルは無い(lib を呼んで作り直す)。
//   1 プロセス。正本は第338便c の settleRun で書く。lib の閉包に第352便b の仮の値の lib が入る(第353便w の lib を経て・本 lib も直に)—— 正本の最上位に provisional: true と鍵の一覧。
//   仮の値を使う欄は表 2 の比べる欄 1 つ(上下の揺れの周期 —— 仮・未照合 —— を揺れの周期 P に置いた列)だけ。
//
// ■ 言わないこと: 太陽の傾きの由来の答え・形成の段階の再現とは書かない(この形・この格子・この幅での、ノブの走査の表)。背景が替わる理由・揺れの由来は予想の文として引くだけ。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w353ze-formwave.mjs';
import * as W from './lib-w353w-formstage.mjs';
import * as RC from './lib-w352c-refaxis.mjs';
import * as PV from './lib-w352b-provisional.mjs';
import * as E from './lib-w347e-spintorque.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w353ze-formwave-1';
export const OUT_MAIN = 'tests/out/formwave-353ze.json';
export const TARGET = 'tests/lib-w353ze-formwave.mjs';
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const PROV_KEYS = Object.freeze(['gal.vertical.period']);
export const NOT_CLAIM = Object.freeze([
  'ノブの走査の表 —— 太陽の傾きの由来の答え・形成の段階の再現とは書かない(この形・この格子・この幅では、の表)',
  '背景の替わり方(替わる時刻・幅)と揺れ方(周期・大きさ・形・位相)はノブ —— 由来は書かない。背景が替わる理由・上下の揺れは予想の文として引くだけ',
  '主の式は (g2−)・主の向きは (N+)・基準軸 L・読み B(第151報の回答と〔第353便w〕の推奨)。比べる式 (g2+) は消さずに並べる —— 主の列と同じ重さでは扱わない',
  '「届く」の幅(角 ± 0.5°・方位 ± 5°)・「保つ」の帯(いまの角 ±10%)・方位の帯 ±10° は物差し —— 採否の判定ではない',
  '上下の揺れの周期は格子(年齢の 0.01〜0.1 倍)で振るノブ(値は未照合)。仮の値の周期(鍵 gal.vertical.period —— 仮・未照合)は表 2 の比べる欄だけ(較正・サンプルの状況・ノブの採否に入れない)',
  '共鳴の帯(背景の大きさ ÷ 銀河の公転の角速度 2.4〜3.7)は〔第352便r〕〔第352便y〕の数を引くだけ',
  'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない']);
export const PLAN = Object.freeze({
  pure: '零試験 8(統括の数え直し 3 の基準軸 L・ω_G・太陽の円錐・揺れ 0 で〔第353便w〕の表 3 の 2 行〔17・2 と 23・0〕を組ごとに runForm と同じ・背景の形〔A 0 は bgOf と同じ・首を振る形は角と大きさを保つ・脈を打つ形は向きを保つ〕・刻んで進めても閉じた形と同じ・刻みを半分にした差・共鳴の式と帯・閉じた形の帯の境目・拒否)',
  t1: '表 1 替わる幅の細かい走査: 主の式 (g2−)・読み B・基準軸 L・f 0 で、形 step の作る段 → 保つ段の組を、形 tanh・x(歳差の率 × 幅)12 点に替える —— 替わる時刻 4 × 移った後の大きさ 3 の行ごとに残る割合・x の上限・半分残る x・残る角 ÷ 作った角と閉じた形',
  t2: '表 2 上下の揺れ: 主の式 (g2−)・読み B・L・u₁ 0.98・f 0 の 24 組(替わる時刻 2 × 始めの比 6 × 係数の差 2)× 始めの大きさ 3(共鳴の帯の外・中・外)× (揺れの形と大きさ 4 × 周期 3 + 仮の値の周期の比べる欄 × 形と大きさ 4)と揺れ無し —— 角・方位・同時・作る段 → 保つ段と、揺れ無しからの増減',
  t3: '表 3 方位の位相: 主の式 (g2−)・読み B・L・f 0・形 step の 240 組 × 移った後の大きさ 6 —— 替わった後にいまの角 ±10% に居る組の、t = 1 の方位の外れの分布(±10° に居る割合 —— 一様なら 20 ÷ 360)',
  t4: '表 4 2 つのノブの面: 替わる時刻 ÷ 年齢 5 × 幅 ÷ 歳差の 1 周 4 × 24 組(始めの比 6 × 始めの大きさ 2 × 係数の差 2)—— 主の式 (g2−) と比べる式 (g2+)(読み B・L・u₁ 0.98・f 0)の作る段 → 保つ段の組の数' });

/* ───────── 小さな道具 ───────── */
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const RD = Object.freeze({
  axis: 'L', read: 'B', sense: 'g2m', f: 0,
  /** 〔第353便w〕の格子(替わる時刻・始めの比・始めの大きさ・係数の差) */
  tSws: L.W_GRID.tSws, rho0s: L.W_GRID.rho0s, u0s: L.W_GRID.u0s, qs: L.W_GRID.qs,
  /** 表 1: 移った後の大きさと x(tanh) */
  u1s: Object.freeze([0.0487, 0.835, 0.98]), xs: Object.freeze([0.1, 0.15, 0.2, 0.3, 0.4, 0.5, 0.7, 1, 1.4, 2, 2.5, 3]), xShape: 'tanh',
  /** 表 2: 組(替わる時刻 2 × 始めの比 6 × 係数の差 2)・始めの大きさ(共鳴の帯の外・中・外)・揺れの形と大きさ・周期(年齢の倍 —— ノブの格子) */
  wTsws: Object.freeze([0.1, 0.3]), wQs: Object.freeze([-0.5, 0.1]), wU0s: Object.freeze([1.2, 3, 6]), wU1: 0.98,
  wAmps: Object.freeze([Object.freeze({ form: 'nod', A: 30 }), Object.freeze({ form: 'nod', A: 90 }), Object.freeze({ form: 'pulse', A: 0.3 }), Object.freeze({ form: 'pulse', A: 0.9 })]),
  wPs: Object.freeze([0.01, 0.03, 0.1]), wPhase: 0,
  /** 表 3: 移った後の大きさ(位相の格子) */
  pU1s: Object.freeze([0.0487, 0.15, 0.3, 0.5, 0.835, 0.98]),
  /** 表 4: 替わる時刻 ÷ 年齢・幅 ÷ 歳差の 1 周(0 = 形 step)・組(始めの比 6 × 始めの大きさ 2 × 係数の差 2) */
  fTsws: Object.freeze([0.01, 0.1, 0.3, 0.5, 0.8]), fTurns: Object.freeze([0, 0.04, 0.1, 0.25]), fQs: Object.freeze([-0.5, 0.1]), fU1: 0.98,
  band: L.DECL.band });
export const ROWDECL = RD;
const isoRho = (r) => (r === Infinity ? 'inf' : r);
const r4 = (x) => (fin(x) ? Number(x.toPrecision(4)) : x);
const cellOf = (ax, GEO, c) => ({ GEO, axisVec: ax[RD.axis], axn: RD.axis, rho0: c.rho0, u0: c.u0, u1: c.u1, tSwitch: c.tSwitch, sense: c.sense ?? RD.sense, f: RD.f, q: c.q, read: RD.read });
const keyOf = (c) => [c.tSwitch, isoRho(c.rho0), c.u0, c.q, c.u1].join('|');

/* ───────── 形 step の基の組(表 1・表 3 の共通)───────── */
export function baseRuns(GEO, ax, u1s) {
  const out = new Map();
  for (const u1 of u1s) for (const tSwitch of RD.tSws) for (const rho0 of RD.rho0s) for (const u0 of RD.u0s) for (const q of RD.qs) {
    const c = { tSwitch, rho0, u0, q, u1 }, r = L.runWave({ ...cellOf(ax, GEO, c), width: 0, shape: 'step', zAmp: 0 });
    out.set(keyOf(c), { ...c, ...r });
  }
  return out;
}

/* ───────── 表 1: 替わる幅の細かい走査 ───────── */
export function widthScan(GEO, ax, base) {
  const rows = [], cells = [];
  for (const u1 of RD.u1s) for (const tSwitch of RD.tSws) {
    const mk = [...base.values()].filter((r) => r.u1 === u1 && r.tSwitch === tSwitch && r.make);
    const per = RD.xs.map((x) => {
      let nKeep = 0, nBoth = 0, ratios = [];
      for (const m of mk) {
        const c = cellOf(ax, GEO, m), w = L.widthForX(c, x), r = W.runForm({ ...c, width: w, shape: RD.xShape });
        if (r.make) nKeep++; if (r.both) nBoth++;
        if (fin(r.gammaEndDeg) && m.gammaEndDeg > 0) ratios.push(r.gammaEndDeg / m.gammaEndDeg);
        cells.push({ u1, tSwitch, rho0: isoRho(m.rho0), u0: m.u0, q: m.q, x, width: w, make: r.make, both: r.both, gammaEndDeg: r.gammaEndDeg, ratio: fin(r.gammaEndDeg) ? r.gammaEndDeg / m.gammaEndDeg : null });
      }
      const mean = ratios.length ? ratios.reduce((s, v) => s + v, 0) / ratios.length : null, rc = L.retainClosed(RD.xShape, x);
      return { x, perTurn: x / (2 * Math.PI), nKeep, nBoth, frac: mk.length ? nKeep / mk.length : null, meanRatio: mean, minRatio: ratios.length ? Math.min(...ratios) : null, maxRatio: ratios.length ? Math.max(...ratios) : null, closed: rc, diff: mean === null ? null : mean - rc };
    });
    const kept = per.filter((p) => p.nKeep > 0), xMax = kept.length ? Math.max(...kept.map((p) => p.x)) : null;
    let xHalf = null;
    if (mk.length) for (let i = 0; i + 1 < per.length; i++) { const a = per[i], b = per[i + 1]; if (a.frac >= 0.5 && b.frac < 0.5) { xHalf = a.x + (a.frac - 0.5) / (a.frac - b.frac) * (b.x - a.x); break; } }
    rows.push({ u1, tSwitch, nStep: mk.length, per, xMax, xHalf });
  }
  return { rows, cells, xKeepClosed: L.xKeepClosed(RD.xShape), xHalfClosed: W.xForRetain(RD.xShape, 0.5) };
}

/* ───────── 表 2: 上下の揺れ ───────── */
const sumOf = (runs) => ({ n: runs.length, nG: runs.filter((r) => r.gReach).length, nA: runs.filter((r) => r.azReach).length, nB: runs.filter((r) => r.both).length, nMake: runs.filter((r) => r.make).length, nNow: runs.filter((r) => r.nowBoth).length, nIll: runs.reduce((s, r) => s + r.nIll, 0) });
export function waveRuns(GEO, ax) {
  const cells = [];
  for (const tSwitch of RD.wTsws) for (const rho0 of RD.rho0s) for (const q of RD.wQs) cells.push({ tSwitch, rho0, q, u1: RD.wU1 });
  const pProv = L.provPeriod('mid'), rows = [], diffs = [];
  for (const u0 of RD.wU0s) {
    const inBand = u0 >= RD.band[0] && u0 <= RD.band[1];
    const base = cells.map((c) => L.runWave({ ...cellOf(ax, GEO, { ...c, u0 }), zAmp: 0 }));
    rows.push({ u0, inBand, form: 'none', A: 0, P: null, prov: false, uResOfP: null, ...sumOf(base), gain: 0, lose: 0, gainMake: 0, loseMake: 0 });
    const cols = [];
    for (const am of RD.wAmps) { for (const P of RD.wPs) cols.push({ ...am, P, prov: false }); cols.push({ ...am, P: pProv, prov: true }); }
    for (const col of cols) {
      const rs = cells.map((c) => L.runWave({ ...cellOf(ax, GEO, { ...c, u0 }), zAmp: col.A, zPeriod: col.P, zPhase: RD.wPhase, form: col.form }));
      let gain = 0, lose = 0, gainMake = 0, loseMake = 0;
      rs.forEach((r, i) => { if (r.both && !base[i].both) gain++; if (!r.both && base[i].both) lose++; if (r.make && !base[i].make) gainMake++; if (!r.make && base[i].make) loseMake++; });
      rows.push({ u0, inBand, form: col.form, A: col.A, P: col.P, prov: col.prov, uResOfP: L.uRes(col.P), ...sumOf(rs), gain, lose, gainMake, loseMake });
    }
  }
  return { rows, nCell: cells.length, pProv, provisional: true, provKeys: ['gal.vertical.period'], provMark: PV.MARK, uResProv: L.uRes(pProv) };
}

/* ───────── 表 3: 方位の位相 ───────── */
export function phaseRows(GEO, ax, base) {
  const rows = [], all = [];
  for (const u1 of RD.pU1s) {
    const rs = [...base.values()].filter((r) => r.u1 === u1 && r.keepSw && fin(r.azEndDev));
    const pf = L.phaseFrac(rs.map((r) => r.azEndDev)), mk = rs.filter((r) => r.make);
    rows.push({ u1, nCell: [...base.values()].filter((r) => r.u1 === u1).length, nKeepSw: rs.length, nIn: pf.nIn, frac: pf.frac, nMake: mk.length, nMakeIn: L.phaseFrac(mk.map((r) => r.azEndDev)).nIn, nNow: rs.filter((r) => r.nowBoth).length,
      turns: rs.length ? [r4(Math.min(...rs.map((r) => r.turnsAfter))), r4(Math.max(...rs.map((r) => r.turnsAfter)))] : null });
    all.push(...rs);
  }
  const byT = RD.tSws.map((tSwitch) => { const rs = all.filter((r) => r.tSwitch === tSwitch), pf = L.phaseFrac(rs.map((r) => r.azEndDev)); return { tSwitch, nKeepSw: rs.length, nIn: pf.nIn, frac: pf.frac }; });
  const hist = Array.from({ length: 12 }, (_, k) => all.filter((r) => { const d = ((r.azEndDev % 360) + 540) % 360 - 180; return d >= -180 + 30 * k && d < -150 + 30 * k; }).length);
  const tot = L.phaseFrac(all.map((r) => r.azEndDev));
  return { rows, byT, hist, n: tot.n, nIn: tot.nIn, frac: tot.frac, uniform: tot.uniform };
}

/* ───────── 表 4: 2 つのノブの面 ───────── */
export function knobPlane(GEO, ax, base) {
  const cells = [];
  for (const rho0 of RD.rho0s) for (const u0 of RD.u0s) for (const q of RD.fQs) cells.push({ rho0, u0, q, u1: RD.fU1 });
  const rows = [];
  for (const sense of ['g2m', 'g2p']) for (const tSwitch of RD.fTsws) for (const turn of RD.fTurns) {
    let nMake = 0, nBoth = 0, nIll = 0, nNow = 0;
    for (const c0 of cells) {
      const c = cellOf(ax, GEO, { ...c0, tSwitch, sense }), k = keyOf({ ...c0, tSwitch });
      let r;
      if (turn === 0 && sense === 'g2m' && base.has(k)) r = base.get(k);
      else if (turn === 0) r = L.runWave({ ...c, width: 0, shape: 'step', zAmp: 0 });
      else { const p = L.rateAtSwitch(c); r = p > 0 ? W.runForm({ ...c, width: turn * 2 * Math.PI / p, shape: RD.xShape }) : L.runWave({ ...c, width: 0, shape: 'step', zAmp: 0 }); }
      if (r.make) nMake++; if (r.both) nBoth++; if (r.nowBoth) nNow++; nIll += r.nIll;
    }
    rows.push({ sense, tSwitch, turn, x: turn * 2 * Math.PI, n: cells.length, nB: nBoth, nMake, nNow, nIll });
  }
  return { rows, nCell: cells.length };
}

export function gatesOf(J) {
  const nW = RD.wU0s.length * (1 + RD.wAmps.length * (RD.wPs.length + 1));
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 8,
    t1: J.t1.rows.length === RD.u1s.length * RD.tSws.length && J.t1.rows.every((r) => r.per.length === RD.xs.length && r.per.every((p) => p.nKeep <= r.nStep)) && J.t1.rows.reduce((s, r) => s + r.nStep, 0) > 0,
    t2: J.t2.rows.length === nW && J.t2.nCell === RD.wTsws.length * RD.rho0s.length * RD.wQs.length && J.t2.rows.every((r) => r.n === J.t2.nCell && r.nMake <= r.nB && r.nB <= r.nG) && J.t2.provisional === true,
    t3: J.t3.rows.length === RD.pU1s.length && J.t3.rows.every((r) => r.nCell === RD.tSws.length * RD.rho0s.length * RD.u0s.length * RD.qs.length && r.nIn <= r.nKeepSw) && J.t3.hist.reduce((s, v) => s + v, 0) === J.t3.n,
    t4: J.t4.rows.length === 2 * RD.fTsws.length * RD.fTurns.length && J.t4.rows.every((r) => r.n === J.t4.nCell && r.nMake <= r.nB),
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const T1 = E.t1Table(), GEO = E.geometry(), RA = RC.refAxes(T1, GEO), ax = { L: RA.L, eq: RA.eq }; mark('input');
  const PS = L.pureScenes(T1, GEO), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const base = baseRuns(GEO, ax, [...new Set(RD.u1s.concat(RD.pU1s))]); mark('base');
  const t1 = widthScan(GEO, ax, base); mark('t1');
  const t2 = waveRuns(GEO, ax); mark('t2');
  const t3 = phaseRows(GEO, ax, base); mark('t3');
  const t4 = knobPlane(GEO, ax, base); mark('t4');
  const J = { pure, t1, t2, t3, t4, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w353ze-formwave.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W353ZE_OUT ? (path.isAbsolute(process.env.W353ZE_OUT) ? process.env.W353ZE_OUT : path.join(ROOT, process.env.W353ZE_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第353便ze formwave(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { provisional: true, provKeys: PROV_KEYS.slice(), provMark: PV.MARK, version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w353ze-formwave.mjs', target: TARGET,
    ruling: '原仮定者の整理(2026-11-24 —— 第148報)・原仮定者の回答(2026-11-25 —— 第151報)・統括の検証項目 R494',
    decl: L.DECL, rowDecl: RD, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第353便ze', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'formwave', engine: 'Node(html を読まない —— 純関数の lib・第353便w・第352便x・r・c・b の lib を呼ぶ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
