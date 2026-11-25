// 第353便o(原仮定者の回答(2026-11-25 —— 第151報)・原仮定者の整理(2026-11-24 —— 第148報)・統括の検証項目 R479):
//   **太陽の自転軸の傾きを「作る」話と、いまの円錐の読みを分ける器 —— 表 1 主の列((N+)・(g2−))の「作る」届きと「保つ」読み/
//   表 2 比べる列((G−)・2 つの向きの項・公転面も応える組)を (g2−) と (g2+) で数え直す/表 3 「作る」に要る条件と「保つ」に要る条件を並べる・零試験 10**
//   (段 suntiltmain-353o —— 正本 tests/out/suntiltmain-353o.json・lib tests/lib-w353o-suntiltmain.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・既存の lib の本文は変えない。physics の鍵を足さない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w353o-suntiltmain.mjs —— 領域の宣言なし)。入力のファイルは無い(lib を呼んで作り直す)。
//   1 プロセス。正本は第338便c の settleRun で書く。lib の閉包に第352便b の仮の値の lib が入る(第352便r の lib を経て)—— 正本の最上位に provisional: true と鍵の一覧。
//   仮の値を使う欄は表 1 の比べる欄 1 つ(黄道の極に対する太陽の傾き —— 仮・未照合)だけ。
//
// ■ 言わないこと: 太陽の傾きの原因の答え・作れない事の答えとは書かない(この式・この列・この格子での届きの表)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w353o-suntiltmain.mjs';
import * as T from './lib-w352r-twobg.mjs';
import * as RC from './lib-w352c-refaxis.mjs';
import * as PV from './lib-w352b-provisional.mjs';
import * as E from './lib-w347e-spintorque.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w353o-suntiltmain-1';
export const OUT_MAIN = 'tests/out/suntiltmain-353o.json';
export const TARGET = 'tests/lib-w353o-suntiltmain.mjs';
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const PROV_KEYS = Object.freeze(['sun.obliquity.ecl']);
export const NOT_CLAIM = Object.freeze([
  '届きの表 —— 太陽の傾きの原因の答えとは書かない。作れない事の答えとも書かない(この式・この列・この格子・この幅では、の表)',
  '主の列は (N+)・(g2−)・基準軸 L(第151報の回答)。比べる列((g2+)・(G−)・2 つの向きの項・eq)は消さずに並べる —— 主の列と同じ重さでは扱わない',
  '「届く」の幅(角 ± 0.5°・方位 ± 5°)と「保つ」の物差し(年齢の間に円錐が 10% より縮まない —— 第352便w の q10)は物差し —— 採否の判定ではない',
  '形成の文(上下の運動の際に生じる)は予想の文 —— 今の積分に入れない。上下の揺れの共鳴の帯は〔第352便r〕〔第352便y〕の数を引くだけ',
  '黄道の極に対する太陽の傾き 7.25° は仮の値・未照合(較正・サンプルの状況・ノブの採否に入れない)',
  'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない']);
export const PLAN = Object.freeze({
  pure: '零試験 10(統括の数え直し 3 の基準軸 L・ω_G・太陽の円錐・包みと第352便x の stateAt・経路 ② だけの角は 2 つの式で同じ・主の列で動かない・f 0 で円錐を保つ・第352便x の f の窓・第352便r の帯の両端・第353便e の f の上限・走査の同時 = reachScan・拒否)',
  t1: '表 1 主の列: 純粋な (N+)(基準軸 L)× 大きさ 6 × 式 2 —— 初めの傾き 0 から年齢の間に動く角(f 3 × 係数の差 2 の最大)・f 0 の終わりの円錐・f 1e-3 の終わりの円錐・傾きを保つ f の上限・歳差の周の数/初めのずれ δ 3 つで届く角の上限',
  t2: '表 2 比べる列: 基準軸 2 × 比 ρ 7(0 = 主の (N+)・帯 0.0605〜0.1・1・∞ = (G−))× 読み 2 × 式 2 × f 11 × 係数の差 5 —— 角に届く組・方位に届く組・同時に届く組/輪が動かない組(第352便r の帯)',
  t3: '表 3 分ける表: 式 2 × 基準軸 2 —— 「作る」に要る条件(背景の向き・f の範囲・係数の差)と「保つ」に要る条件(f の上限 —— 大きさ 3)・同じ組で両方を満たすか・届いた後にいまの角の帯に居る長さ ÷ 届くまでの長さ/読み B の f の窓' });

/* ───────── 小さな道具 ───────── */
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const RD = Object.freeze({
  axes: L.DECL.axes, senses: L.DECL.senses, reads: L.DECL.reads,
  rhos: Object.freeze([0, 0.0605, 0.075, 0.087, 0.1, 1, Infinity]), bandRhos: Object.freeze([0.0605, 0.075, 0.087, 0.1]),
  fs: Object.freeze([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]), qs: Object.freeze([-1, -0.5, -0.1, 0.1, 1]),
  /** 表 1 の大きさ(ω_G の倍): 金星の条件(規則・観測)・窓の下端・窓の上端 (N+)・注目の列・倍率 1 */
  mags: Object.freeze(['uVrule', 'uVobs', 'lo', 'top', 'focus', 'one']), magU: Object.freeze({ lo: 0.0487, top: 0.835, focus: 0.98, one: 1 }),
  makeFs: Object.freeze([0, 0.5, 1]), makeQs: Object.freeze([-0.5, 1]), keepF: 1e-3, offs: Object.freeze([1, 2.984, 3.5]),
  winRhos: Object.freeze([0.075, 1, Infinity]), winQ: -1,
  /** 形成の文の数える範囲(上下の揺れの共鳴の帯 —— 背景の大きさ ÷ 銀河の公転の角速度 —— 〔第352便r〕〔第352便y〕の数を引くだけ) */
  wobbleBand: Object.freeze([2.4, 3.7]), dwellFrac: 0.1 });
export const ROWDECL = RD;
const isoRho = (r) => (r === Infinity ? 'inf' : r);
function magU(T1, GEO, m, cache) { return m === 'uVrule' ? T.uVenusRad(T1, GEO, { rad: 'rule' }, cache) : m === 'uVobs' ? T.uVenusRad(T1, GEO, { rad: 'obs' }, cache) : RD.magU[m]; }

/* ───────── 表 1: 主の列 ───────── */
export function mainRows(T1, GEO, ax, cache) {
  const rows = [], N = ax.L, th = L.DECL.tiltDeg.L;
  for (const m of RD.mags) {
    const u = magU(T1, GEO, m, cache), tauAge = u * L.DECL.omegaG * L.DECL.ageYr * L.YR;
    const make = { g2m: 0, g2p: 0 };
    for (const f of RD.makeFs) for (const q of RD.makeQs) { const M = L.mainMake({ axisVec: N, u, f, q, tilt0Deg: 0 }); for (const s of RD.senses) make[s] = Math.max(make[s], M[s].movedDeg, M[s].gammaEndDeg); }
    const K0 = L.mainMake({ axisVec: N, u, f: 0, tilt0Deg: th }), K3 = L.mainMake({ axisVec: N, u, f: RD.keepF, tilt0Deg: th }), fk = L.fKeepAt({ thDeg: th, u });
    rows.push({ mag: m, u, tauAge, turnsAge: tauAge / (2 * Math.PI), make, cone0: { g2m: K0.g2m.coneEndDeg, g2p: K0.g2p.coneEndDeg },
      cone3: { g2m: K3.g2m.coneEndDeg, g2p: K3.g2p.coneEndDeg }, cone3Closed: L.coneAfter({ th0Deg: th, f: RD.keepF, tau: tauAge }), fKeep: fk.noLimit ? null : fk.fMax, fKeepNoLimit: fk.noLimit });
  }
  return rows;
}
/** 初めに 2 つの軸がそろって基準軸から δ ずれているとき(倍率 1・f 0・係数の差 −0.5)の、年齢の間の 2 つの軸の角の最大(届く上限は 2δ) */
export function offsetRows(ax) {
  const N = ax.L, out = [];
  for (const d of RD.offs) {
    const v = tiltVec(N, d), om = L.vec.scl(L.vec.unit(N), L.DECL.omegaG);
    const R = L.twoAxisBoth({ n0: v, s0: v, om, T: L.DECL.ageYr * L.YR, steps: 4000, ring: { f: 0, ratio: 1 }, spin: { f: 0, ratio: 0.5 }, track: true });
    out.push({ offDeg: d, gMax: { g2m: R.g2m.gammaMaxDeg, g2p: R.g2p.gammaMaxDeg }, closed: 2 * d, reachL: 2 * d >= L.DECL.tiltDeg.L - L.DECL.tol.gammaDeg });
  }
  return out;
}
function tiltVec(N, d) { const { unit, crs, scl, add, dot } = L.vec, n = unit(N), p = unit(crs(n, Math.abs(n[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0])), a = d * Math.PI / 180;
  // N を p のまわりに a 回す(lib の mainMake と同じ作り)
  return add(add(scl(n, Math.cos(a)), scl(crs(p, n), Math.sin(a))), scl(p, dot(p, n) * (1 - Math.cos(a)))); }
/** 黄道の極の比べる欄(仮の値 —— 太陽の傾き 7.25° を初めの角に置いたときの f の上限 —— u 0.98) */
export function eclRow() {
  const p = PV.provValue('sun.obliquity.ecl', 'mid'), fk = L.fKeepAt({ thDeg: p, u: RD.magU.focus });
  return { provisional: true, provKeys: ['sun.obliquity.ecl'], thDeg: p, fKeep: fk.noLimit ? null : fk.fMax, provMark: PV.MARK };
}

/* ───────── 表 2: 比べる列 ───────── */
export function cmpRows(GEO, ax) {
  const rows = [];
  for (const axn of RD.axes) for (const rho of RD.rhos) for (const read of RD.reads) for (const sense of RD.senses) {
    let nG = 0, nA = 0, nB = 0, near = null, nearAny = null, nIll = 0; const hits = [];
    for (const f of RD.fs) for (const q of RD.qs) {
      const c = L.scanCell({ GEO, axisVec: ax[axn], axn, rho, sense, f, q, read });
      if (c.gReach) nG++; if (c.azReach) nA++; nIll += c.nIll;
      if (fin(c.nearAzDeg)) near = near === null ? c.nearAzDeg : Math.min(near, c.nearAzDeg);
      if (fin(c.nearAzAnyDeg)) nearAny = nearAny === null ? c.nearAzAnyDeg : Math.min(nearAny, c.nearAzAnyDeg);
      if (c.both) { nB++; hits.push({ f, q, tau: c.tauHit, turnDeg: c.turnDeg }); }
    }
    rows.push({ axis: axn, rho: isoRho(rho), read, sense, nAll: RD.fs.length * RD.qs.length, nG, nA, nB, nIll,
      nearAzDeg: fin(near) ? Math.round(near * 10) / 10 : null, nearAzAnyDeg: fin(nearAny) ? Math.round(nearAny * 10) / 10 : null,   // 方位の差の最小は 0.1° に丸めて書く(標本の格子の上の量)
      fLo: hits.length ? Math.min(...hits.map((h) => h.f)) : null, fHi: hits.length ? Math.max(...hits.map((h) => h.f)) : null, qs: [...new Set(hits.map((h) => h.q))].sort((a, b) => a - b), hits });
  }
  return rows;
}
export function bandRows(GEO, ax) {
  const rows = [];
  for (const axn of RD.axes) for (const rho of [...RD.bandRhos, 1, Infinity]) { const b = L.ringFixedBand(GEO, ax[axn], axn, rho); rows.push({ axis: axn, rho: isoRho(rho), thDeg: b.thDeg, gMaxDeg: b.gMaxDeg, gReach: b.gReach, azReach: b.azReach, wAzDeg: b.wAzDeg, azT: b.azT }); }
  return rows;
}

/* ───────── 表 3: 分ける表 ───────── */
export function sepRows(T1, GEO, ax, t2, cache) {
  const rows = [], uOf = (m) => magU(T1, GEO, m, cache);
  for (const sense of RD.senses) for (const axn of RD.axes) for (const read of RD.reads) {
    const rs = t2.filter((r) => r.axis === axn && r.sense === sense && r.read === read && r.nB > 0), hits = [];
    for (const r of rs) for (const h of r.hits) {
      const rho = r.rho === 'inf' ? Infinity : r.rho, d = L.dwellOf({ GEO, axisVec: ax[axn], axn, rho, sense, f: h.f, q: h.q, read, tauHit: h.tau, frac: RD.dwellFrac });
      hits.push({ rho: r.rho, f: h.f, q: h.q, tau: h.tau, dwell: d.ratio, open: d.open });
    }
    const th = L.DECL.tiltDeg[axn], fk = {};
    for (const m of ['uVrule', 'focus', 'one']) { const k = L.fKeepAt({ thDeg: th, u: uOf(m) }); fk[m] = k.noLimit ? null : k.fMax; }
    const fLo = hits.length ? Math.min(...hits.map((h) => h.f)) : null, fHi = hits.length ? Math.max(...hits.map((h) => h.f)) : null;
    const fPos = hits.filter((h) => h.f > 0), fLoPos = fPos.length ? Math.min(...fPos.map((h) => h.f)) : null;
    const dw = hits.map((h) => h.dwell);
    rows.push({ sense, axis: axn, read, nHit: hits.length, rhos: [...new Set(hits.map((h) => h.rho))], fLo, fHi, fLoPos, qs: [...new Set(hits.map((h) => h.q))].sort((a, b) => a - b),
      fKeep: fk, overlapFocus: hits.length ? (fk.focus === null ? true : fLo <= fk.focus) : null, f0Hits: hits.filter((h) => h.f === 0).length,
      dwellMin: dw.length ? Math.min(...dw) : null, dwellMax: dw.length ? Math.max(...dw) : null, nOpen: hits.filter((h) => h.open).length });
  }
  return rows;
}
export function windowRows(GEO, ax) {
  const rows = [];
  for (const axn of RD.axes) for (const rho of RD.winRhos) for (const sense of RD.senses) {
    const w = L.fWindowB({ GEO, axisVec: ax[axn], axn, rho, sense, q: RD.winQ });
    rows.push({ axis: axn, rho: isoRho(rho), sense, q: RD.winQ, fLo: w.fLo, fHi: w.fHi, n: w.n, midTau: w.mid ? w.mid.tau : null });
  }
  return rows;
}

export function gatesOf(J) {
  const nCmp = RD.axes.length * RD.rhos.length * RD.reads.length * RD.senses.length;
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 10,
    t1: J.t1.rows.length === RD.mags.length && J.t1.rows.every((r) => r.make.g2m < 1e-9 && r.make.g2p < 1e-9 && Math.abs(r.cone0.g2m - L.DECL.tiltDeg.L) < 1e-9)
      && J.t1.offs.length === RD.offs.length && J.t1.ecl.provisional === true,
    t2: J.t2.rows.length === nCmp && J.t2.rows.filter((r) => r.rho === 0).every((r) => r.nG === 0 && r.nB === 0) && J.t2.band.length === RD.axes.length * (RD.bandRhos.length + 2),
    t3: J.t3.rows.length === RD.senses.length * RD.axes.length * RD.reads.length && J.t3.win.length === RD.axes.length * RD.winRhos.length * RD.senses.length,
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const T1 = E.t1Table(), GEO = E.geometry(), cache = {}, RA = RC.refAxes(T1, GEO), ax = { L: RA.L, eq: RA.eq }; mark('input');
  const PS = L.pureScenes(T1, GEO), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const t1 = { rows: mainRows(T1, GEO, ax, cache), offs: offsetRows(ax), ecl: eclRow() }; mark('t1');
  const t2 = { rows: cmpRows(GEO, ax), band: bandRows(GEO, ax) }; mark('t2');
  const t3 = { rows: sepRows(T1, GEO, ax, t2.rows, cache), win: windowRows(GEO, ax), wobbleBand: RD.wobbleBand.slice() }; mark('t3');
  const J = { pure, t1, t2, t3, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w353o-suntiltmain.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W353O_OUT ? (path.isAbsolute(process.env.W353O_OUT) ? process.env.W353O_OUT : path.join(ROOT, process.env.W353O_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第353便o suntiltmain(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { provisional: true, provKeys: PROV_KEYS.slice(), provMark: PV.MARK, version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w353o-suntiltmain.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-25 —— 第151報)・原仮定者の整理(2026-11-24 —— 第148報)・統括の検証項目 R479',
    decl: L.DECL, rowDecl: RD, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第353便o', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'suntiltmain', engine: 'Node(html を読まない —— 純関数の lib・第352便l・x・r・w・第353便e の lib を呼ぶ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
