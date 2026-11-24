// 第351便f(原仮定者の回答(2026-11-24 —— 第147報)「AN1001: Aで進める。主要衛星は潮汐ロックしている」・統括の検証項目 R432):
//   **衛星の器 —— 衛星の組の由来の表(表 1・カロン–冥王星の組の作り)・潮汐ロックの 3 列(表 2)・潮汐のトルクの桁と軸引きずりの直交成分のトルクの比(表 3)・
//   互いにロックした連星の (M) と (S) を源の回転の形 2 つで(表 4)・月の比べる数の印(表 5)・零試験 14**
//   (段 satlock-351f —— 正本 tests/out/satlock-351f.json・lib tests/lib-w351f-satlock.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・前の便の lib の本文は変えない。physics の鍵を足さない。エネルギー・熱は持たない(第 2 段の枝 g)。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w351f-satlock.mjs —— 領域の宣言なし)。入力のファイルは無い(前の便の lib を呼んで作り直す)。
//   1 プロセス。正本は第338便c の settleRun で書く。表を作る関数は器に置く。
//
// ■ 探索の方針(第138報): 式の形は走行の前に決め打ちしない —— 正本の先頭(decl・plan)は、走らせたノブの格子と判定の物差しの記録。
// ■ 言わないこと: 潮汐ロックの成り立ちの答え・「潮汐力が上回っている」の当否とは書かない(比の数だけ)。ロックは観測の事実として置く(積分で作らない)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as F from './lib-w351f-satlock.mjs';
import * as L from './lib-w351c-srcparts.mjs';
import * as BG from './lib-w350e-bgaxial.mjs';
import * as E from './lib-w347e-spintorque.mjs';
import * as TL from './lib-w337c-tidelock.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w351f-satlock-1';
export const OUT_MAIN = 'tests/out/satlock-351f.json';
export const TARGET = 'tests/lib-w351f-satlock.mjs';
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const YR = TL.YR, AS = 180 * 3600 / Math.PI, AY = YR * AS;
export const NOT_CLAIM = Object.freeze([
  '潮汐ロックは観測の事実として置いた(積分でロックを作っていない) —— ロックの成り立ちの答えではない', '表 3 は比の数(「潮汐力が上回っている」の当否ではない —— 潮汐の係数はノブ・衛星の (B − A) は公開の lib に無い)',
  '衛星の歳差を軸引きずりだけで読んだ数は成績ではない', '一様な背景の倍率 1 はノブの格子の 1 点', 'カロン–冥王星の組は第351便c の作り(相対の速さは源の質量だけ —— 2 体の和は比べる列)',
  'エネルギー・熱は持たない(第 2 段の枝 g)', 'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない(AN712)']);
export const PLAN = Object.freeze({ pure: '零試験 14(第351便c の partRot と同じ・q0 = 第348便h の srcRot3(K1rQ0)・列の和・第350便e の比・2 体の和の線形と平均運動・質量の比・剛体の打ち消し・球のモーメントは打ち消さない・3 列・月の起こす率・潮汐の物差し・共通の点検の数・拒否)',
  t1: '衛星 5 組 × 由来(母天体・太陽)× 成分 3 × 読み 2 + 背景 + 列 A・B + 2 体の和の (M)・カロン–冥王星の組の作り 2 行', t2: '衛星 5 組 × 3 列((ア)(イ)(ウ))—— 列 A の Ω・列 B の経路 ①', t3: '4 天体 × 成分 4(母天体の (M)(S)(MS)・列 A の合計)',
  t4: '冥王星–カロン 2 組 × 源の回転の形 2 × 相対の速さ 2 × 源の自転 2 + 源に固定して回る座標系の読み 2', t5: '比べる数の印 5 行(値は作らない)' });

/* ───────── 小さな道具 ───────── */
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const key = (id, src) => id + '|' + src;

/* ───────── 表 1: 由来 ───────── */
export function originRows(T1, GEO) {
  const rows = [];
  for (const [id, src] of F.DECL.sats) {
    const S = F.satInput(T1, GEO, id, src), per = {};
    for (const read of L.DECL.reads) {
      const t = F.satTerms(T1, GEO, id, src, { read }), comp = (v) => ({ mag: nrm(v) * AY, cos: L.cosTo(S.sHat, v) });
      per[read] = { parent: Object.fromEntries(L.DECL.parts.map((p) => [p, comp(t.parent[p])])), sun: Object.fromEntries(L.DECL.parts.map((p) => [p, comp(t.sun[p])])),
        ratio: Object.fromEntries(L.DECL.parts.map((p) => [p, nrm(t.parent[p]) / nrm(t.sun[p])])), bg: comp(t.bg), A: comp(t.A), B: comp(t.B), pairM: comp(t.pairM), sunB: comp(t.sunB.MS) };
    }
    let e350 = null;
    if (C350.includes(key(id, src))) { const To = BG.termsOf(T1, GEO, id, src, 'in'); e350 = { p2: nrm(To.P.P2) / nrm(To.S.P2), w: nrm(To.P.W) / nrm(To.S.W) }; }
    rows.push({ id, src, epsDeg: S.epsDeg, ...per, e350 });
  }
  return rows;
}
const C350 = Object.freeze(['Moon|EarthHi', 'Moon|EarthLo', 'Io|Jupiter', 'Pluto|Charon']);
/** カロン–冥王星の組の作り(Pluto|Charon と並べる) */
export function makeRows(T1, GEO) {
  return [['Pluto', 'Charon'], ['Charon', 'Pluto']].map(([id, src]) => {
    const S = F.satInput(T1, GEO, id, src);
    return { id, src, m: S.m, Ms: S.Ms, a: S.a, beta: S.beta, vOrb: S.vOrb, nField: S.nField, nPair: S.nPair, nDecl: S.nDecl, wSpin: S.wSpin, spinFrom: S.spinFrom, ws: S.ws, fieldOverDecl: S.nField / S.nDecl, pairOverDecl: S.nPair / S.nDecl,
      sAxToN: S.epsDeg, made: S.made };
  });
}

/* ───────── 表 2: 3 列 ───────── */
export function lockRows(T1, GEO) {
  const rows = [];
  for (const [id, src] of F.DECL.sats) {
    const S = F.satInput(T1, GEO, id, src), t = F.satTerms(T1, GEO, id, src), A = F.lockCols(S, t.A), B = F.lockCols(S, t.B);
    for (const col of F.DECL.lockCols) {
      const a = A[col];
      rows.push({ id, src, col, epsDeg: a.epsDeg, ratioM1: a.ratioM1, path1: a.path1 * AY, path2: a.path2 * AY, precRate: a.precRate * AY, raise: a.raise === null ? null : a.raise * AY,
        parOverN: a.parOverN, lonOverN: a.lonOverN, lonAsYr: a.lonRate * AY, inPlaneOverN: a.inPlaneOverN, path1B: B[col].path1 * AY, raiseB: B[col].raise === null ? null : B[col].raise * AY,
        spinMinusN: (S.wSpin - S.nDecl) / S.nDecl, yrPerDeg: a.path1 > 0 ? 3600 / (a.path1 * AY) : null });
    }
  }
  return rows;
}

/* ───────── 表 3: 潮汐のトルクと軸引きずりの直交成分のトルク ───────── */
export function torqueRows(T1, GEO) {
  const rows = [];
  for (const id of F.DECL.tideBodies) {
    const [rid, src] = F.DECL.tideKey[id].split('|'), S = F.satInput(T1, GEO, rid, src), t = F.satTerms(T1, GEO, rid, src), T = F.tideOf(id);
    for (const [part, Om] of [['M', t.parent.M], ['S', t.parent.S], ['MS', t.parent.MS], ['A', t.A]]) {
      const r = F.torqueRatio(T, S, Om);
      rows.push({ id, partner: T.partner, part, perpAsYr: r.perp * AY, Nax: r.Nax, Ntide: T.Ntide, NtideK: T.NtideK, rTide: r.rTide, rTideK: r.rTideK, baNeed: r.baNeed, over1: r.rTide === null ? null : r.rTide > 1, over1K: r.rTideK === null ? null : r.rTideK > 1 });
    }
  }
  return rows;
}

/* ───────── 表 4: 互いにロックした連星 ───────── */
export function mutualRows(T1, GEO) {
  const rows = [];
  for (const [id, src] of [['Pluto', 'Charon'], ['Charon', 'Pluto']]) for (const rot of F.DECL.rotForms) for (const speed of F.DECL.speeds) for (const spin of ['decl', 'sync']) {
    const r = F.mutualRow(T1, GEO, id, src, { rot, speed, spin }), w = F.mutualRow(T1, GEO, id, src, { rot, speed, spin, read: 'W' });
    rows.push({ id, src, rot, speed, spin, resid: r.resid, M: nrm(r.M) * AY, S: nrm(r.S) * AY, MS: nrm(r.MS) * AY, MSoverM: nrm(r.MS) / nrm(r.M), parMS: r.par.MS * AY, perpMS: r.perp.MS <= 1e-12 * nrm(r.MS) ? 0 : r.perp.MS * AY,
      wMSoverRigid: nrm(w.MS) / w.rigidW, wOverW: w.wOverW, wsOverDecl: r.ws / F.satInput(T1, GEO, id, src).wSpin });
  }
  for (const [id, src] of [['Pluto', 'Charon'], ['Charon', 'Pluto']]) {
    const r = F.mutualRow(T1, GEO, id, src, { rot: 'q0', speed: 'src', spin: 'frame' });
    rows.push({ id, src, rot: 'q0', speed: 'src', spin: 'frame', resid: 0, M: 0, S: 0, MS: nrm(r.MS) * AY, MSoverM: null, parMS: 0, perpMS: 0, wMSoverRigid: null, wOverW: null, wsOverDecl: 0 });
  }
  return rows;
}

/* ───────── 表 5: 比べる数の印 ───────── */
export function compareRows() {
  return F.DECL.sats.map(([id, src]) => (id === 'Moon'
    ? { id, src, cmp: F.DECL.moonNodeYr + ' 年(軌道の交点の率)', role: '自転軸の歳差とは別の量(〔第350便f〕)—— 自転軸の当てはめから外す(主)', value: null }
    : { id, src, cmp: null, role: '比べる数なし —— 値を作らない', value: null }));
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 14,
    t1: J.origin.length === 5 && J.origin.every((r) => L.DECL.reads.every((rd) => L.DECL.parts.every((p) => r[rd].parent[p].mag > 0 && r[rd].sun[p].mag > 0))) && J.make.length === 2,
    t2: J.lock.length === 5 * 3 && J.lock.filter((r) => r.col === 'i').every((r) => r.lonOverN === 0) && J.lock.every((r) => Math.abs(r.path1 - r.path2) <= 1e-12 * Math.max(r.path1, 1e-300)),
    t3: J.torque.length === 4 * 4 && J.torque.every((r) => r.Ntide > 0),
    t4: J.mutual.length === 18 && J.mutual.filter((r) => r.spin === 'frame').every((r) => r.MS === 0) && J.mutual.filter((r) => r.rot === 'q0' && r.spin === 'sync').every((r) => r.resid < 1e-12 && Math.abs(r.wMSoverRigid - 1) < 1e-9),
    t5: J.compare.length === 5 && J.compare.every((r) => r.value === null),
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const T1 = E.t1Table(), GEO = E.geometry(); mark('input');
  const PS = F.pureScenes(T1, GEO), pure = { scenes: PS, gates: F.pureGates(PS) }; mark('pure');
  const origin = originRows(T1, GEO), make = makeRows(T1, GEO); mark('t1');
  const lock = lockRows(T1, GEO); mark('t2');
  const torque = torqueRows(T1, GEO); mark('t3');
  const mutual = mutualRows(T1, GEO); mark('t4');
  const compare = compareRows();
  const J = { pure, origin, make, lock, torque, mutual, compare, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w351f-satlock.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W351F_OUT ? (path.isAbsolute(process.env.W351F_OUT) ? process.env.W351F_OUT : path.join(ROOT, process.env.W351F_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第351便f satlock(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: F.LIB_VERSION, generator: 'tests/exp-w351f-satlock.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-24 —— 第147報)・統括の検証項目 R432',
    decl: F.DECL, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第351便f', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'satlock', engine: 'Node(html を読まない —— 純関数の lib・第351便c・第351便d・第348便h・第350便e・第337便c の lib を呼ぶ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
