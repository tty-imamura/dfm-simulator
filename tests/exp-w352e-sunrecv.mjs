// 第352便e(原仮定者の整理(2026-11-24 —— 第148報)・原仮定者の回答(2026-11-24 —— 第148報)・統括の検証項目 R442):
//   **太陽を受け手に置いた診断の器 —— 惑星由来の局所の項(表 1)・背景の向き 4 × 成分 2 × 大きさ 2 の太陽の合成の向きと円錐の半頂角(表 2)・歳差の周期と時間の物差し(表 3)・
//   周期から背景の大きさを出す逆算と、半頂角を保つのに要る「一定の向きへ倒す率」(表 4)・太陽の応答の係数の置き方(表 5)・零試験 13**
//   (段 sunrecv-352e —— 正本 tests/out/sunrecv-352e.json・lib tests/lib-w352e-sunrecv.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・既存の lib の本文は変えない。physics の鍵を足さない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w352e-sunrecv.mjs —— 領域の宣言なし)。入力のファイルは無い(lib を呼んで作り直す)。
//   1 プロセス。正本は第338便c の settleRun で書く。表を作る関数は器に置く。
//
// ■ 探索の方針: 式の形は走行の前に決め打ちしない —— 正本の先頭(decl・plan)は、走らせた格子と判定の物差しの記録。
// ■ 言わないこと: 背景軸引きずりの大きさの答え・太陽の傾きの原因の答えとは書かない。背景の大きさは 1 つに決めない(列で持つ)。背景の向きの (N+) と (G−) はどちらにも寄せない。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w352e-sunrecv.mjs';
import * as E from './lib-w347e-spintorque.mjs';
import * as TL from './lib-w337c-tidelock.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w352e-sunrecv-1';
export const OUT_MAIN = 'tests/out/sunrecv-352e.json';
export const TARGET = 'tests/lib-w352e-sunrecv.mjs';
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const YR = TL.YR, AY = L.AS_YR;
export const NOT_CLAIM = Object.freeze([
  '背景の大きさは列(金星で (S) と同じ・銀河の公転の角速度の 1・10・100・8500 倍)の表 —— 背景軸引きずりの大きさの答えではない(太陽の歳差の率の観測が無いので 1 つに決まらない)',
  '背景の向きの (N+) と (G−) はどちらにも寄せていない((G+)・(N−) は比べる列)', '太陽の傾きの原因とは書かない —— 合成の軸のまわりの円錐と読める候補の数だけ',
  '中心の点の式(一定の向きへ倒す率と歳差の率)は候補の式 —— 要る率は「その式なら」の数', '太陽の応答の係数(比・k₂・構造)は 1 を主に置いた —— 構造のノブは背景の向きと円錐を置いた後',
  '換算の係数 k を大きくして (S) を背景の桁に持ち上げた列は診断の列(主にしない)', 'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない']);
export const PLAN = Object.freeze({
  pure: '零試験 13(partRot と同じ入力で同じ数・線形・(S) を直接に・質量 0 で 0・入れ替えの入力・統括の数え直し 1 の数〔基準軸・角・背景・金星の倍率〕・向きの約束・背景だけの円錐・周期の往復・中心の点の步・拒否)',
  t1: '惑星由来の局所の項(受け手 = 太陽・源 = 8 惑星 × 成分 3 —— 大きさ・太陽の自転軸との cos・基準軸〔等重み・角運動量の重み・黄道の極〕との角・背景との比)+ 8 惑星の和',
  t2: '太陽の合成(背景の向き 4 × 成分 (S)(MS) × 大きさ (uV)・倍率 1): 合成と自転軸の角(円錐の半頂角)・合成と基準軸 3 つの角・方位の率(経路 ② だけ・(g2+) —— (g2−) は符号が逆)',
  t3: '歳差の周期(比 1・k₂ 1)と時間の物差し(太陽系の年齢の宣言 4.5e9 年・銀河の公転の周期 2π ÷ ω_G): 向き (N+)(G−) × 成分 2 × 大きさ 5',
  t4: '逆算の器: (i) 周期 → 背景の大きさ(比 1・k₂ 1)/(ii) 半頂角 3 つを中心の点の離れに保つのに要る A(大きさ 5)/(iii) 步の照合(無次元)',
  t5: '太陽の応答の係数(比 × k₂ の 5 通り)× 向き (N+)(G−): 向きと円錐は同じ・周期は 1 ÷ (比 × k₂)/診断の列: 局所 (S) を背景 (uV) の大きさに持ち上げる k' });

/* ───────── 小さな道具 ───────── */
const { dot, crs, nrm, scl, add, unit } = L.vec;
const PL = L.PLANETS;
const RD = Object.freeze({ dirs: L.DECL.dirs, partsT2: Object.freeze(['S', 'MS']), magsT2: Object.freeze(['uV', 1]), dirsT3: Object.freeze(['N+', 'G-']), magsT3: Object.freeze(['uV', 1, 10, 100, 8500]),
  periodsYr: Object.freeze([1e6, 1e8, 'gal', 'age', 1e12]), angles: Object.freeze(['eq', 'lw', 'ecl']), resp: Object.freeze([[1, 1], [0.5, 1], [1, 0.5], [0.1, 1], [10, 1]]), nearDeg: 0.5 });
export const ROWDECL = RD;
const multOf = (m, uV) => (m === 'uV' ? uV : m);
/** 背景の線に沿う軸 u(単位)と合成 Ω = s u + loc のなす角(°)—— 打ち消しで小さくなる角は大きい数の差で作らず、u × loc から直接に数える(u × Ω の背景の分は 0 と置く) */
const parAng = (u, sMag, loc) => Math.atan2(nrm(crs(u, loc)), sMag + dot(u, loc)) * 180 / Math.PI;
/** 合成と背景の角・合成と等重みの軸の角(背景の向きが N± なら等重みの軸も背景の線の上 —— 直接に数える) */
function bgEqAng(dir, bg, loc, ax) {
  const mag = nrm(bg);
  if (dir === 'N+' || dir === 'N-') { const u = unit(ax.eq), sg = dir === 'N+' ? 1 : -1; return { bgDeg: parAng(scl(u, sg), mag, loc), eqDeg: parAng(u, sg * mag, loc) }; }
  return { bgDeg: parAng(unit(bg), mag, loc), eqDeg: L.angDeg(ax.eq, add(bg, loc)) };
}

/* ───────── 表 1: 惑星由来の局所の項 ───────── */
export function localRows(LOC, ax, uV) {
  const b1 = nrm(L.bgVecOf({ dir: 'G-', mult: 1 })), bV = nrm(L.bgVecOf({ dir: 'G-', mult: uV })), s = LOC.sHat, rows = [];
  const one = (id, v) => ({ id, parts: Object.fromEntries(L.DECL.parts.map((p) => [p, { asYr: nrm(v[p]) * AY, cosSun: nrm(v[p]) > 0 ? dot(s, unit(v[p])) : null,
    eqDeg: L.angDeg(ax.eq, v[p]), lwDeg: L.angDeg(ax.lw, v[p]), eclDeg: L.angDeg(ax.ecl, v[p]), overBg1: nrm(v[p]) / b1, overBgV: nrm(v[p]) / bV }])) });
  for (const id of PL) rows.push(one(id, LOC.byPlanet[id]));
  rows.push(one('sum', LOC.sum));
  return rows;
}

/* ───────── 表 2: 太陽の合成と円錐 ───────── */
export function coneRows(T1, GEO, LOC, ax, uV) {
  const rows = [];
  for (const dir of RD.dirs) for (const part of RD.partsT2) for (const m of RD.magsT2) {
    const bg = L.bgVecOf({ dir, mult: multOf(m, uV), ref: ax.eq }), R = L.sunTotal(T1, GEO, { part, bg, loc: LOC, ref: ax.eq }), s = LOC.sHat, ds = crs(R.Om, s);
    const pc = L.poleRatesLocal(R.Om, s, ds), pr = L.poleRatesLocal(ax.eq, s, ds), A2 = bgEqAng(dir, bg, LOC.sum[part], ax);
    rows.push({ dir, part, mag: m, mult: multOf(m, uV), coneDeg: R.coneDeg, eqDeg: A2.eqDeg, lwDeg: L.angDeg(ax.lw, R.Om), eclDeg: L.angDeg(ax.ecl, R.Om), bgDeg: A2.bgDeg, magAsYr: R.mag * AY,
      locOverBg: nrm(LOC.sum[part]) / nrm(bg), near: A2.eqDeg <= RD.nearDeg, azComb: pc.az === null ? null : pc.az * AY, azRef: pr.az === null ? null : pr.az * AY, incRef: pr.inc === null ? null : pr.inc * AY });
  }
  return rows;
}

/* ───────── 表 3: 周期と時間の物差し ───────── */
export function periodRows(T1, GEO, LOC, ax, uV) {
  const rows = [], galYr = 2 * Math.PI / L.DECL.omegaG / YR, age = L.DECL.ageYr;
  for (const dir of RD.dirsT3) for (const part of RD.partsT2) for (const m of RD.magsT3) {
    const bg = L.bgVecOf({ dir, mult: multOf(m, uV), ref: ax.eq }), R = L.sunTotal(T1, GEO, { part, bg, loc: LOC, ref: ax.eq }), P = L.bgPeriod({ radS: R.mag });
    const aA = L.azAdvance({ rateRadS: P.rateRadS, tYr: age }), aG = L.azAdvance({ rateRadS: P.rateRadS, tYr: galYr });
    rows.push({ dir, part, mag: m, mult: multOf(m, uV), magAsYr: R.mag * AY, periodYr: P.periodYr, ageDeg: aA.deg, ageTurns: aA.turns, galDeg: aG.deg, galTurns: aG.turns, coneDeg: R.coneDeg });
  }
  return { rows, galYr, ageYr: age };
}

/* ───────── 表 4: 逆算の器 ───────── */
export function invertRows(T1, GEO, LOC, ax, uV, galYr) {
  const inv = RD.periodsYr.map((p) => { const yr = p === 'gal' ? galYr : p === 'age' ? L.DECL.ageYr : p, r = L.invertBg({ periodYr: yr }); return { key: String(p), periodYr: yr, radS: r.radS, mult: r.mult, asYr: r.asYr, overUV: r.mult / uV }; });
  const sun = LOC.sHat, th = Object.fromEntries(RD.angles.map((a) => [a, L.angDeg(ax[a], sun)]));
  const need = [];
  for (const m of RD.magsT3) {
    const mult = multOf(m, uV), Op = L.bgPeriod({ mult }).rateRadS;
    for (const a of RD.angles) { const f = L.fixedOffset({ Op, thDeg: th[a] }); need.push({ mag: m, mult, axis: a, thDeg: th[a], OpAsYr: Op * AY, AAsYr: f.A * AY, AsmallAsYr: f.Asmall * AY, smallRel: f.Asmall / f.A - 1 }); }
  }
  // 步の照合(無次元: Ω_p 1・刻み 1e-3)—— ŝ* から始めると止まる・p̂ から始めると ŝ* のまわりを回る(角の範囲)
  const step = RD.angles.map((a) => {
    const p = ax[a], e0 = crs(p, [0, 0, 1]), e = nrm(e0) > 1e-9 ? e0 : [1, 0, 0], ep = unit(add(e, scl(unit(p), -dot(e, unit(p))))), A = L.fixedOffset({ Op: 1, thDeg: th[a] }).A, sStar = L.fixedPoint({ p, e: ep, Op: 1, A });
    const s0 = L.tiltPrecStep({ s0: sStar, p, e: ep, Op: 1, A, T: 20, dt: 1e-3, center: sStar }), s1 = L.tiltPrecStep({ s0: p, p, e: ep, Op: 1, A, T: 2 * Math.PI, dt: 1e-3, center: sStar });
    return { axis: a, thDeg: th[a], offDeg: L.angDeg(p, sStar), stayDeg: s0.maxDeg, circMinDeg: s1.minDeg, circMaxDeg: s1.maxDeg };
  });
  return { inv, need, step, th };
}

/* ───────── 表 5: 太陽の応答の係数 ───────── */
export function respRows(T1, GEO, LOC, ax, uV) {
  const rows = [];
  for (const dir of RD.dirsT3) {
    const bg = L.bgVecOf({ dir, mult: uV, ref: ax.eq }), R = L.sunTotal(T1, GEO, { part: 'S', bg, loc: LOC, ref: ax.eq }), base = L.bgPeriod({ radS: R.mag });
    for (const [ratio, kPrec] of RD.resp) { const P = L.bgPeriod({ radS: R.mag, ratio, kPrec }); rows.push({ dir, ratio, kPrec, coneDeg: R.coneDeg, eqDeg: bgEqAng(dir, bg, LOC.sum.S, ax).eqDeg, periodYr: P.periodYr, periodOverBase: P.periodYr / base.periodYr, rateAsYr: P.rateAsYr }); }
  }
  // 診断の列: 局所 (S) の和を背景 (uV) の大きさに持ち上げる k と、そのときの円錐
  const kStar = nrm(L.bgVecOf({ dir: 'G-', mult: uV })) / nrm(LOC.sum.S), diag = [];
  for (const dir of RD.dirsT3) for (const k of [1, kStar]) {
    const bg = L.bgVecOf({ dir, mult: uV, ref: ax.eq }), Lk = { sum: { M: scl(LOC.sum.M, k), S: scl(LOC.sum.S, k), MS: scl(LOC.sum.MS, k) }, sHat: LOC.sHat }, R = L.sunTotal(T1, GEO, { part: 'S', bg, loc: Lk, ref: ax.eq });
    diag.push({ dir, k, coneDeg: R.coneDeg, eqDeg: bgEqAng(dir, bg, Lk.sum.S, ax).eqDeg, magAsYr: R.mag * AY });
  }
  return { rows, kStar, diag };
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const nD = RD.dirs.length, c = (dir, part, mag) => J.cone.find((r) => r.dir === dir && r.part === part && r.mag === mag);
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 13,
    t1: J.local.length === PL.length + 1 && J.local.every((r) => L.DECL.parts.every((p) => Number.isFinite(r.parts[p].asYr))) && J.local[PL.length].parts.S.overBgV < 1,
    t2: J.cone.length === nD * 2 * 2 && J.cone.every((r) => r.coneDeg !== null) && c('N+', 'S', 'uV').coneDeg.toFixed(3) === L.REF.sunDeg.eq && c('G-', 'S', 'uV').coneDeg.toFixed(3) === L.ANCHOR.gmSunDeg,
    t3: J.period.rows.length === 2 * 2 * RD.magsT3.length && J.period.rows.every((r) => r.periodYr > 0) && Math.abs(J.period.rows.find((r) => r.dir === 'G-' && r.part === 'S' && r.mag === 1).periodYr / J.period.galYr - 1) < 1e-6,
    t4: J.invert.inv.length === RD.periodsYr.length && J.invert.need.length === RD.magsT3.length * RD.angles.length && J.invert.step.every((r) => r.stayDeg < 1e-6 && Math.abs(r.offDeg - r.thDeg) < 1e-9),
    t5: J.resp.rows.length === 2 * RD.resp.length && J.resp.rows.every((r) => Math.abs(r.periodOverBase * r.ratio * r.kPrec - 1) < 1e-12) && J.resp.diag.length === 4,
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const T1 = E.t1Table(), GEO = E.geometry(); mark('input');
  const PS = L.pureScenes(T1, GEO), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const LOC = L.sunLocal(T1, GEO, { read: 'C2' }), ax = L.refAxesFrom(T1, GEO), uV = L.uVenus(T1, GEO).S; mark('loc');
  const local = localRows(LOC, ax, uV); mark('t1');
  const cone = coneRows(T1, GEO, LOC, ax, uV); mark('t2');
  const period = periodRows(T1, GEO, LOC, ax, uV); mark('t3');
  const invert = invertRows(T1, GEO, LOC, ax, uV, period.galYr); mark('t4');
  const resp = respRows(T1, GEO, LOC, ax, uV); mark('t5');
  const J = { pure, uV, wSelf: LOC.wSelf, local, cone, period, invert, resp, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w352e-sunrecv.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W352E_OUT ? (path.isAbsolute(process.env.W352E_OUT) ? process.env.W352E_OUT : path.join(ROOT, process.env.W352E_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第352便e sunrecv(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w352e-sunrecv.mjs', target: TARGET,
    ruling: '原仮定者の整理(2026-11-24 —— 第148報)・原仮定者の回答(2026-11-24 —— 第148報)・統括の検証項目 R442',
    decl: L.DECL, rowDecl: RD, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第352便e', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'sunrecv', engine: 'Node(html を読まない —— 純関数の lib・第351便c・第351便e・第348便h・第350便e・第347便e の lib を呼ぶ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
