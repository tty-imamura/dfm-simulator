// 第352便x(原仮定者の整理(2026-11-24 —— 第148報)・統括の検証項目 R461):
//   **太陽の傾きを作る候補の続きの器 —— 公転面(輪の法線)も背景に応えて動く組で、いまの角といまの方位に同時に届く組の走査(表 1・表 2)・
//   係数の比を式の候補で置いたとき(表 3)・8 惑星の公転面の散らばり(表 4)・候補の一覧(表 5)・黄道の極の比べる列(表 6 —— 仮の値・印つき)・零試験 13**
//   (段 sunorigin-352x —— 正本 tests/out/sunorigin-352x.json・lib tests/lib-w352x-sunorigin.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・既存の lib の本文は変えない。physics の鍵を足さない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w352x-sunorigin.mjs —— 領域の宣言なし)。入力のファイルは無い(lib を呼んで作り直す)。
//   1 プロセス。正本は第338便c の settleRun で書く。仮の値は第352便b の器の数だけ(表 6 —— 正本の最上位に provisional: true と鍵の一覧)。
//
// ■ 探索の方針: 式の形は走行の前に決め打ちしない —— 正本の先頭(decl・plan)は、走らせた格子と判定の物差しの記録。
// ■ 言わないこと: 太陽の傾きの由来の答えとは書かない。背景が 2 つの項から成るとは書かない(届く組の走査)。どの組が正しいとは書かない。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as X from './lib-w352x-sunorigin.mjs';
import * as T from './lib-w352r-twobg.mjs';
import * as RC from './lib-w352c-refaxis.mjs';
import * as PV from './lib-w352b-provisional.mjs';
import * as E from './lib-w347e-spintorque.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w352x-sunorigin-1';
export const OUT_MAIN = 'tests/out/sunorigin-352x.json';
export const TARGET = 'tests/lib-w352x-sunorigin.mjs';
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const PROV_KEYS = Object.freeze(['sun.obliquity.ecl']);
export const NOT_CLAIM = Object.freeze([
  '届く組の走査 —— 太陽の傾きの由来の答えとは書かない。背景を 2 つの向きの項の和に置いたのは候補(比 b ÷ a はノブ)—— 背景が 2 つの項から成るとは書かない',
  '「届く」の幅(角 ± 0.5°・方位 ± 5°)と散らばりの物差し 7° は走査の物差し —— 採否の判定ではない',
  '始まりの置き方の読み A(始まり = いまの基準軸)と読み B(終わりの輪の法線 = いまの基準軸)はどちらにも寄せていない',
  '背景の向き (N+)・(G−)・歳差の向き (g2+)・(g2−)・基準軸の L・eq・(S) の源の半径の規則・観測はどれにも寄せていない(両方の列を同じ重さで)',
  '太陽の局所の (S) は背景の 1e-10 の桁 —— 走査では入れない(零試験で大きさを記録)。輪は背景だけを受ける置き方(第352便l の候補 (b)・第352便r と同じ)',
  '係数の比の候補(第352便p の (P1)(P2)(P3)・第352便q の式の候補)を輪と太陽に当てた置き方は読み —— 候補を選ばない',
  '黄道の極の比べる列の太陽の傾き 7.25° は仮の値・未照合(較正・サンプルの状況・ノブの採否に入れない)',
  'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない']);
export const PLAN = Object.freeze({
  pure: '零試験 13(写像と第352便l の closedAxis・逆の写像・読み A と twoAxisStep・係数が同じなら開かない・読み B の終わり・いまの方位・枝 r の帯の両端・輪が動かない組の方位の側・読み B の 2 つの探し方・太陽の局所の大きさ・係数の比の候補・係数がそろった散らばり・拒否)',
  t1: '届く組の走査: 基準軸 2 × 読み 2 × 歳差の向き 2 × 比 7 × f 11 × 係数の比 c_s ÷ c_n 5 —— 最初に届く τ・そのとき輪が回った角・方位の差の最小。大きさ 3((uV) 規則・観測・倍率 1)で年齢の内に届くのに要る輪の係数',
  t2: '読み B の f の窓: 基準軸 2 × 歳差の向き 2 × 比 3 × 係数の比 2 —— f 0.5〜1(刻み 0.0025)で届く f の範囲・中の τ・輪の回った角',
  t3: '係数の比の候補 9 つ((P1)(P2)(P3)・(ア)(S1)(S2)・(イ)・(ウ)・(ウ′)・(エ))—— c_s ÷ c_n・届く組の有無(読み 2 × 向き 2 × 基準軸 2 × 比 3 × f 21)・要る輪の係数',
  t4: '8 惑星の公転面: 係数の法則 3(一様・1 ÷ n・n)× f 2 × 基準軸 2 × 大きさ 3 × 比の格子 —— 年齢の間の散らばりの最大・平均の軸の動き・散らばり 7° と両立する比の上限',
  t5: 'まとめ: 候補ごとに 角・方位・金星の残り・公転面の散らばり・要るノブの数・足りない量',
  t6: '黄道の極の比べる列(仮の値 —— 太陽の傾き 7.25°): 読み B の f の窓' });

/* ───────── 小さな道具 ───────── */
const { nrm } = X.vec;
const RD = Object.freeze({ axes: X.DECL.axes, reads: X.DECL.reads, senses: X.DECL.senses,
  rhos: Object.freeze([0.0605, 0.075, 0.087, 0.1, 0.3, 1, Infinity]), fs: Object.freeze([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]),
  qs: Object.freeze([-1, -0.5, -0.1, 0.1, 1]), mags: Object.freeze(['uVrule', 'uVobs', 'u1']), nTau: 200, dec: 8,
  winRhos: Object.freeze({ L: Object.freeze([0.075, 1, Infinity]), eq: Object.freeze([0.075, 1, Infinity]) }), winQs: Object.freeze([-1, -0.5]), winF: Object.freeze({ lo: 0.5, hi: 1, step: 0.005 }),
  candRhos: Object.freeze([0.075, 1, Infinity]), candFs: Object.freeze(Array.from({ length: 21 }, (_, i) => i / 20)),
  orbLaws: Object.freeze(['uni', 'i', 'u']), orbFs: Object.freeze([0, 0.5]), orbScan: Object.freeze({ lo: -3, hi: 2, perDecade: 6 }), orbNT: 120 });
export const ROWDECL = RD;
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const isoRho = (r) => (r === Infinity ? 'inf' : r);
const tauMaxOf = (q) => Math.max(200, 50 / Math.abs(q));
function a0Of(T1, GEO, m, cache) { return m === 'u1' ? 1 : T.uVenusRad(T1, GEO, { rad: m === 'uVobs' ? 'obs' : 'rule' }, cache); }
function needC(T1, GEO, tau, om1, cache) { const o = {}; for (const m of RD.mags) o[m] = tau === null ? null : tau / X.tauAge({ a0: a0Of(T1, GEO, m, cache), om1 }); return o; }

/* ───────── 表 1: 届く組の走査 ───────── */
export function reachRows(T1, GEO, ax, cache) {
  const rows = [];
  for (const axn of RD.axes) {
    const gT = X.DECL.tiltDeg[axn], azT = T.nowDAz(GEO, ax[axn]);
    for (const rho of RD.rhos) {
      const d = X.bgDir(ax[axn], rho);
      for (const read of RD.reads) for (const sense of RD.senses) for (const q of RD.qs) {
        const tau = [], turn = [], near = [], nearG = [];
        for (const f of RD.fs) {
          const r = X.reachScan({ GEO, axis: ax[axn], w: d.w, ring: X.coefOf({ f, sense, ratio: 1 }), spin: X.coefOf({ f, sense, ratio: 1 + q }), read, gT, azT, tauMax: tauMaxOf(q), nTau: RD.nTau, dec: RD.dec });
          tau.push(r.tau); turn.push(r.turnDeg); near.push(r.nearAzDeg); nearG.push(r.nearGDeg);
        }
        const tMin = tau.filter(fin).length ? Math.min(...tau.filter(fin)) : null;
        rows.push({ axis: axn, rho: isoRho(rho), thDeg: d.thDeg, read, sense, q, tau, turnDeg: turn, gReach: nearG.map((x) => x <= X.DECL.tol.gammaDeg), nearAzDeg: near.map((x) => (fin(x) ? Math.round(x * 10) / 10 : null)),   // 方位の差の最小は 0.1° に丸めて書く(標本の格子の上の量)
         tauMin: tMin, needC: needC(T1, GEO, tMin, d.om1, cache) });
      }
    }
  }
  return rows;
}
/** 表 1 の集計: 基準軸 × 読み × 向き ごとに、届いた組の数・f の範囲・比の範囲・係数の比・要る輪の係数の最小 */
export function reachSummary(R1) {
  const out = [];
  for (const axn of RD.axes) for (const read of RD.reads) for (const sense of RD.senses) {
    const rs = R1.filter((r) => r.axis === axn && r.read === read && r.sense === sense);
    let n = 0, fLo = null, fHi = null; const rhoSet = new Set(), qSet = new Set(); let near = null; const cMin = { uVrule: null, uVobs: null, u1: null };
    for (const r of rs) r.tau.forEach((t, k) => {
      const nz = r.nearAzDeg[k]; if (fin(nz)) near = near === null ? nz : Math.min(near, nz);
      if (t === null) return;
      n++; const f = RD.fs[k]; fLo = fLo === null ? f : Math.min(fLo, f); fHi = fHi === null ? f : Math.max(fHi, f); rhoSet.add(r.rho); qSet.add(r.q);
    });
    for (const r of rs) for (const m of RD.mags) { const c = r.needC[m]; if (fin(c)) cMin[m] = cMin[m] === null ? c : Math.min(cMin[m], c); }
    out.push({ axis: axn, read, sense, nHit: n, nAll: rs.length * RD.fs.length, fLo, fHi, rhos: [...rhoSet], qs: [...qSet].sort((a, b) => a - b), nearAzDeg: near, needCMin: cMin });
  }
  return out;
}

/* ───────── 表 2: 読み B の f の窓 ───────── */
export function fWindow(GEO, { axis, w, sense, q, gT, azT }) {
  const W = RD.winF, hits = [];
  const nF = Math.round((W.hi - W.lo) / W.step);
  for (let i = 0; i <= nF; i++) {
    const ff = Math.round((W.lo + i * W.step) * 1e6) / 1e6;
    const r = X.reachScan({ GEO, axis, w, ring: X.coefOf({ f: ff, sense, ratio: 1 }), spin: X.coefOf({ f: ff, sense, ratio: 1 + q }), read: 'B', gT, azT, tauMax: tauMaxOf(q), nTau: RD.nTau, dec: RD.dec });
    if (r.tau !== null) hits.push({ f: ff, tau: r.tau, turnDeg: r.turnDeg, dAzDeg: r.hit.dAzDeg });
  }
  if (!hits.length) return { fLo: null, fHi: null, n: 0, mid: null };
  const mid = hits[Math.floor(hits.length / 2)], c = X.coefOf({ f: mid.f });
  mid.azApproxDeg = (sense === 'g2p' ? -1 : 1) * Math.atan(c.kPrec / c.kTilt) * 180 / Math.PI;   // 角の大きい所の近い形 ∓atan(k₂ ÷ k₁)(比べる列)
  return { fLo: hits[0].f, fHi: hits[hits.length - 1].f, n: hits.length, mid };
}
export function windowRows(T1, GEO, ax, cache) {
  const rows = [];
  for (const axn of RD.axes) {
    const gT = X.DECL.tiltDeg[axn], azT = T.nowDAz(GEO, ax[axn]);
    for (const rho of RD.winRhos[axn]) {
      const d = X.bgDir(ax[axn], rho);
      for (const sense of RD.senses) for (const q of RD.winQs) {
        const w = fWindow(GEO, { axis: ax[axn], w: d.w, sense, q, gT, azT });
        rows.push({ axis: axn, rho: isoRho(rho), thDeg: d.thDeg, sense, q, azT, ...w, needC: needC(T1, GEO, w.mid ? w.mid.tau : null, d.om1, cache) });
      }
    }
  }
  return rows;
}

/* ───────── 表 3: 係数の比の候補 ───────── */
export function candRows(T1, GEO, ax, cache) {
  const S0 = X.candRatios({ perp: 0 }), rows = [];
  // (P2)・(ア)(S2) の直交の大きさは、背景の大きさの列ごとに(太陽の自転軸に直交する背景 —— (G−) だけの最大)
  const perpOf = (m) => a0Of(T1, GEO, m, cache) * T.DECL.omegaG * Math.sin(X.bgDir(ax.L, Infinity).thDeg * Math.PI / 180);
  for (const key of Object.keys(S0.cands)) {
    const c0 = S0.cands[key], qByMag = {};
    for (const m of RD.mags) { const c = X.candRatios({ perp: perpOf(m) }).cands[key]; qByMag[m] = c.q; }
    const q = c0.q, row = { key, note: c0.note, ratio: c0.ratio, q, qByMag, scanned: false, nHit: 0, nAll: 0, hits: [], nearAzDeg: null, needCMin: { uVrule: null, uVobs: null, u1: null } };
    const qMax = Math.max(...Object.values(qByMag).map((x) => (x === null ? 0 : Math.abs(x))));
    if (q === null || qMax < X.DECL.floor) { rows.push(row); continue; }
    row.scanned = true;
    for (const axn of RD.axes) {
      const gT = X.DECL.tiltDeg[axn], azT = T.nowDAz(GEO, ax[axn]);
      for (const rho of RD.candRhos) {
        const d = X.bgDir(ax[axn], rho);
        for (const read of RD.reads) for (const sense of RD.senses) for (const f of RD.candFs) {
          row.nAll++;
          const r = X.reachScan({ GEO, axis: ax[axn], w: d.w, ring: X.coefOf({ f, sense, ratio: 1 }), spin: X.coefOf({ f, sense, ratio: 1 + q }), read, gT, azT, tauMax: tauMaxOf(q), nTau: RD.nTau, dec: RD.dec });
          if (fin(r.nearAzDeg)) row.nearAzDeg = Math.round(10 * (row.nearAzDeg === null ? r.nearAzDeg : Math.min(row.nearAzDeg, r.nearAzDeg))) / 10;
          if (r.tau === null) continue;
          row.nHit++;
          const nc = needC(T1, GEO, r.tau, d.om1, cache);
          for (const m of RD.mags) row.needCMin[m] = row.needCMin[m] === null ? nc[m] : Math.min(row.needCMin[m], nc[m]);
          row.hits.push({ axis: axn, rho: isoRho(rho), read, sense, f });
        }
      }
    }
    row.hitSummary = summarizeHits(row.hits);
    delete row.hits;
    rows.push(row);
  }
  return { sun: { w: S0.S.w, nOrb: S0.S.nOrb, C: S0.S.C }, rows };
}
function summarizeHits(hits) {
  const o = {};
  for (const h of hits) { const k = h.axis + '|' + h.read + '|' + h.sense; const e = o[k] || (o[k] = { n: 0, fLo: null, fHi: null, rhos: [] });
    e.n++; e.fLo = e.fLo === null ? h.f : Math.min(e.fLo, h.f); e.fHi = e.fHi === null ? h.f : Math.max(e.fHi, h.f); if (!e.rhos.includes(h.rho)) e.rhos.push(h.rho); }
  return o;
}

/* ───────── 表 4: 8 惑星の公転面 ───────── */
export function orbitRows(T1, GEO, ax, cache) {
  const S = RD.orbScan, grid = []; for (let k = 0; k <= (S.hi - S.lo) * S.perDecade; k++) grid.push(Number(Math.pow(10, S.lo + k / S.perDecade).toPrecision(4)));   // 格子の点は 4 桁に丸めた数(走り直しで同じ点)
  for (const r of RD.rhos) if (r !== Infinity && !grid.includes(r)) grid.push(r);
  grid.sort((a, b) => a - b); grid.push(Infinity);
  const ns0 = T.DECL.planets.map((id) => GEO[id + '|Sun'].n), sp0 = X.spreadOf(ns0), rows = [];
  for (const law of RD.orbLaws) {
    const coefs = X.orbitCoefs(law);
    for (const f of RD.orbFs) for (const axn of RD.axes) for (const m of RD.mags) {
      const a0 = a0Of(T1, GEO, m, cache), per = [];
      let rhoMax = null, broke = false;
      for (const rho of grid) {
        const d = X.bgDir(ax[axn], rho), tA = X.tauAge({ a0, om1: d.om1 });
        let mx = sp0.maxDeg, last = null;
        for (let k = 1; k <= RD.orbNT; k++) { const sp = X.spreadOf(X.orbitsAt(GEO, { w: d.w, tau: tA * k / RD.orbNT, coefs, f })); mx = Math.max(mx, sp.maxDeg); last = sp; }
        const ok = mx <= X.DECL.spreadDeg;
        if (!broke && ok) rhoMax = rho; else broke = true;
        per.push({ rho: isoRho(rho), thDeg: d.thDeg, tauAge: tA, spreadMaxDeg: mx, spreadEndDeg: last.maxDeg, meanMoveDeg: X.angDeg(last.mean, sp0.mean), ok });
      }
      rows.push({ law, f, axis: axn, mag: m, rhoMax: rhoMax === null ? null : isoRho(rhoMax), allOk: !broke, spread0Deg: sp0.maxDeg, per });
    }
  }
  return { spread0Deg: sp0.maxDeg, coefs: Object.fromEntries(RD.orbLaws.map((l) => [l, X.orbitCoefs(l)])), rows };
}

/* ───────── 表 5: まとめ ───────── */
export function sumRows(T1, GEO, ax, R1, W2, C3, O4, cache) {
  const rows = [], uV = a0Of(T1, GEO, 'uVrule', cache);
  const ven = (axn, rho) => { const { a, b } = T.abOf(rho === 'inf' ? Infinity : rho, uV); return T.bodyOf(T1, GEO, 'Venus', { a, b, axis: ax[axn] }, cache).res; };
  const orb = (axn, rho, law, f) => { const r = O4.rows.find((x) => x.law === law && x.f === f && x.axis === axn && x.mag === 'u1'); return r.per.find((x) => x.rho === rho).spreadMaxDeg; };
  const pick = (axn, read, sense, rho, fSel, qs = RD.qs) => {
    const rs = R1.filter((r) => r.axis === axn && r.read === read && r.sense === sense && r.rho === rho && qs.includes(r.q));
    let hit = false, near = null, cMin = { uVrule: null, uVobs: null, u1: null }, gOk = false;
    for (const r of rs) RD.fs.forEach((f, k) => { if (!fSel(f)) return; if (r.gReach[k]) gOk = true; const nz = r.nearAzDeg[k]; if (fin(nz)) near = near === null ? nz : Math.min(near, nz);
      if (r.tau[k] !== null) { hit = true; const nc = needC(T1, GEO, r.tau[k], X.bgDir(ax[axn], rho === 'inf' ? Infinity : rho).om1, cache); for (const m of RD.mags) cMin[m] = cMin[m] === null ? nc[m] : Math.min(cMin[m], nc[m]); } });
    return { gOk, hit, near, cMin };
  };
  for (const axn of RD.axes) {
    const cases = [
      { id: 'Np-only', rho: 0, read: '—', sense: '—', f: '—', knobs: 2 },
      { id: 'Gm-only-A-f0', rho: 'inf', read: 'A', f: 'f0', knobs: 2 },
      { id: 'Gm-only-B-f0', rho: 'inf', read: 'B', f: 'f0', knobs: 2 },
      { id: 'two-A-f0', rho: 0.075, read: 'A', f: 'f0', knobs: 3 },
      { id: 'two-B-f0', rho: 0.075, read: 'B', f: 'f0', knobs: 3 },
      { id: 'two-B-mix', rho: 0.075, read: 'B', f: 'mix', knobs: 4 },
      { id: 'Gm-only-B-mix', rho: 'inf', read: 'B', f: 'mix', knobs: 3 },
    ];
    for (const c of cases) for (const sense of (c.id === 'Np-only' ? ['—'] : RD.senses)) {
      if (c.id === 'Np-only') { rows.push({ axis: axn, id: c.id, rho: 0, read: c.read, sense, f: c.f, angle: false, azimuth: false, nearAzDeg: null, venusRes: ven(axn, 0), spreadUniDeg: O4.spread0Deg, spreadIDeg: O4.spread0Deg, knobs: c.knobs, needC: null }); continue; }
      const fSel = c.f === 'f0' ? (f) => f === 0 : (f) => f > 0 && f < 1, p = pick(axn, c.read, sense, c.rho, fSel);
      rows.push({ axis: axn, id: c.id, rho: c.rho, read: c.read, sense, f: c.f, angle: p.gOk, azimuth: p.hit, nearAzDeg: p.near, venusRes: ven(axn, c.rho),
        spreadUniDeg: orb(axn, c.rho, 'uni', 0), spreadIDeg: orb(axn, c.rho, 'i', 0), knobs: c.knobs, needC: p.cMin });
    }
  }
  const cand = C3.rows.filter((r) => r.scanned).map((r) => ({ key: r.key, q: r.q, nHit: r.nHit, nearAzDeg: r.nearAzDeg, needCMin: r.needCMin }));
  return { rows, cand };
}

/* ───────── 表 6: 黄道の極の比べる列(仮の値)───────── */
export function eclRows(GEO) {
  const ecl = [0, 0, 1], gT = PV.prov('sun.obliquity.ecl').value, azT = T.nowDAz(GEO, ecl), rows = [];
  for (const rho of [1, Infinity]) {
    const d = X.bgDir(ecl, rho);
    for (const sense of RD.senses) { const w = fWindow(GEO, { axis: ecl, w: d.w, sense, q: -1, gT, azT }); rows.push({ rho: isoRho(rho), thDeg: d.thDeg, sense, gT, azT, ...w }); }
  }
  return PV.tagProv({ rows, keys: PROV_KEYS.slice() }, PROV_KEYS.slice());
}

export function gatesOf(J) {
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 13,
    t1: J.t1.length === RD.axes.length * RD.rhos.length * RD.reads.length * RD.senses.length * RD.qs.length && J.t1.every((r) => r.tau.length === RD.fs.length)
      && J.t1.filter((r) => r.read === 'B').every((r) => r.tau[0] === null),
    t2: J.t2.length === RD.axes.length * 3 * RD.senses.length * RD.winQs.length,
    t3: J.t3.rows.length === 9 && J.t3.rows.filter((r) => r.key === 'P1' || r.key === 'a1').every((r) => r.scanned === false),
    t4: J.t4.rows.length === RD.orbLaws.length * RD.orbFs.length * RD.axes.length * RD.mags.length && J.t4.rows.filter((r) => r.law === 'uni' && r.f === 0).every((r) => r.allOk),
    t5: J.t5.rows.length === RD.axes.length * (1 + 6 * 2),
    t6: J.t6.provisional === true && J.t6.rows.length === 4,
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const T1 = E.t1Table(), GEO = E.geometry(), cache = {}; mark('input');
  const PS = X.pureScenes(T1, GEO), pure = { scenes: PS, gates: X.pureGates(PS) }; mark('pure');
  const R = RC.refAxes(T1, GEO), ax = { L: R.L, eq: R.eq };
  const tauAge = {}; for (const axn of RD.axes) for (const m of RD.mags) tauAge[axn + '|' + m] = X.tauAge({ a0: a0Of(T1, GEO, m, cache), om1: X.bgDir(ax[axn], 0).om1 });
  const now = { L: T.nowDAz(GEO, ax.L), eq: T.nowDAz(GEO, ax.eq) }; mark('ax');
  const t1 = reachRows(T1, GEO, ax, cache), t1s = reachSummary(t1); mark('t1');
  const t2 = windowRows(T1, GEO, ax, cache); mark('t2');
  const t3 = candRows(T1, GEO, ax, cache); mark('t3');
  const t4 = orbitRows(T1, GEO, ax, cache); mark('t4');
  const t5 = sumRows(T1, GEO, ax, t1, t2, t3, t4, cache); mark('t5');
  const t6 = eclRows(GEO); mark('t6');
  const J = { pure, axes: ax, now, tauAgePerUnit: tauAge, t1, t1s, t2, t3, t4, t5, t6, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w352x-sunorigin.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W352X_OUT ? (path.isAbsolute(process.env.W352X_OUT) ? process.env.W352X_OUT : path.join(ROOT, process.env.W352X_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第352便x sunorigin(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: X.LIB_VERSION, generator: 'tests/exp-w352x-sunorigin.mjs', target: TARGET,
    ruling: '原仮定者の整理(2026-11-24 —— 第148報)・統括の検証項目 R461', provisional: true, provKeys: PROV_KEYS.slice(), provMark: PV.MARK,
    decl: X.DECL, rowDecl: RD, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第352便x', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'sunorigin', engine: 'Node(html を読まない —— 純関数の lib・第352便b・c・l・p・r の lib を呼ぶ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
