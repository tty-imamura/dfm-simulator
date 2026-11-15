// 第338便f(原仮定者の回答(2026-11-15 —— 第138報の回答 4)「イオは潮汐ロックしているので、内部熱の検証用」
//   「金星の「地球との共鳴」は、向きが合う共鳴なので軸引きずりでは無い。月の潮汐ロックと同じ力なので、候補は潮汐力、次点は地球磁場」・原仮定者の指示(2026-11-15 —— 第139報)・統括の検証項目 R354):
//   **熱と共鳴の探索の器**(段 heatlock-338f —— 正本 tests/out/heatlock-338f.json・lib tests/lib-w338f-heatlock.mjs)。**診断だけ** ——
//   エンジン・内蔵の本・受理器・前の便の lib の本文は変えない。physics の鍵を足さない。金星の釣り合いの根は解かない(枝 b の題 —— 残り ε を入力のノブに置くだけ)。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w338f-heatlock.mjs —— 領域の宣言なし)。入力のファイルは無い(第337便d の合わせた上限は第337便d の器の
//   `t3Rows`・`jointOf` を呼んで作り直す・第337便c の比のしきいの帯は第337便c の lib の `bodyTable` を呼んで作り直す)。1 プロセス。
//
// ■ 探索の方針(第138報): 式の形は走行の前に決め打ちしない —— 正本の先頭(decl・lit・plan)は、走らせたノブの格子と判定の物差し(何と比べて「合う」と言うか)の記録。
// ■ 判定の物差し: T1 は各量 ÷ 観測の熱流(文献の値・未照合 —— 観測の無い天体は比を書かない)。T2 は定常の解 |N_net| ≤ K(第337便c の型)と捕まった位相の数。T3 は最短の距離 ÷ 尾の半径・トルク ÷ K。
// ■ 丸めの残り(教訓 2): 解析的に 0 になる量・打ち消しの残りは値のまま書かない(真偽か、尺度に対して 1e-12 より小さければ 0 —— 床は meta.zeroFloor)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import * as L from './lib-w338f-heatlock.mjs';
import * as TL from './lib-w337c-tidelock.mjs';
import * as XD from './exp-w337d-accelloss.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w338f-heatlock-1';
export const OUT_MAIN = 'tests/out/heatlock-338f.json';
export const TARGET = 'tests/lib-w338f-heatlock.mjs';
/** 版の履歴(結果を見て変えた所 —— 理由つき) */
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const ZERO_FLOOR = Object.freeze({ rel: 1e-12, note: '解析的に 0 になる量・打ち消しの残りは、同じ単位の尺度に対して 1e-12 より小さければ 0 と書く(値のまま書かない)—— 収束と帳簿の残りは真偽で書く' });
export const NOT_CLAIM = Object.freeze([
  '候補の型とノブの表(観測と比べた比 —— イオの熱の出どころを決めたのではない)', '共鳴の原因が潮汐とは書かない(潮汐の調和の成分の桁と、保てるノブの範囲の表)',
  '金星の釣り合いの根は解かない(枝 b の題 —— 釣り合いの残り ε を入力のノブに置いた)', '金星の大気の熱潮汐は扱わない(原仮定者の回答 3)',
  '文献の値は本環境では一次資料に当たっていない(未照合)', '(i) 離心軌道の潮汐と (ii) 秤動の散逸は同じ源(主星の潮汐)の 2 つの読み —— 足さない',
  '地球磁場の列は桁の見積り(誘導のトルクの上限 —— 式の形は決め打ちしない)']);
/** 器の宣言(QA の作り直しの部分集合と、表に出す Γ₀ の点) */
export const PLAN = Object.freeze({
  gammaPoints: Object.freeze(['lo', 'mid', 'hi']),
  libBac: Object.freeze([0, 1e-4, 1e-3]),
  t4Bac: Object.freeze([1e-6, 1e-5, 1e-4, 1e-3]), t4K2q: Object.freeze([1e-5, 1e-3]),
  behaviorSubset: Object.freeze({ capture: Object.freeze([[0.5, 0.1], [0.9, 1], [1.1, 1]]) }),
});
const fin = (x) => typeof x === 'number' && Number.isFinite(x);

/* ───────── T1 イオの内部熱(と同じノブの組で 4 天体)───────── */
export function partHeat() {
  const D = L.DECL.t1, rows = L.satRows(), io = rows[0];
  const sep = TL.bodyTable().sepX, band = { lo: sep.band[0], hi: sep.band[1], mid: Math.sqrt(sep.band[0] * sep.band[1]), separable: sep.separable };
  const J = XD.jointOf(XD.t3Rows()), joint = Object.fromEntries(D.accelCols.map((c) => [c, { kMax: J[c].joint, binding: J[c].binding }]));
  const kStar = io.heatW / L.eccTide(io, 1);   // イオの観測の熱流に (i) を合わせる k₂/Q(同じノブの組 —— 他の天体へ持ち出す)
  const out = rows.map((r) => {
    const obs = fin(r.heatW) ? r.heatW : null, rel = (x) => (obs && fin(x) ? x / obs : null);
    const tide = D.k2q.map((k) => ({ k2q: k, heatW: L.eccTide(r, k), rel: rel(L.eccTide(r, k)) }));
    const tStar = L.eccTide(r, kStar), tLit = fin(r.k2qLit) ? L.eccTide(r, r.k2qLit) : null;
    const libr = PLAN.libBac.concat(fin(r.bacLit) ? [r.bacLit] : []).map((bac) => { const q = L.librHeat(r, kStar, bac);
      return { bac, K: q.K, G: q.G, ok: q.ok, closureOk: q.ok && q.closure < 1e-9, heatW: q.heatW, overTide: q.ok ? q.heatW / tStar : null, rel: rel(q.heatW), smallEOverUnit: q.ok ? q.smallE / q.perUnit : null }; });
    const axial = D.readings.map((rd) => { const pts = Object.fromEntries(PLAN.gammaPoints.map((g) => { const A = L.axialHeat(r, band[g], rd);
      return [g, { gamma0: band[g], heatW: A.heat, rel: rel(A.heat), netTorque: A.netTorque, bySrc: A.ports.map((p) => ({ src: p.src, heatW: p.heat, share: p.heat / A.heat })) }]; }));
      const b = L.budgetOf(r, rd, obs); return { reading: rd, pts, budget: { g0Src: b.g0Src, g0One: b.g0One, tauMinYr: b.tauMinYr, srcOverOne: b.srcOverOne, gapOverN: b.gapOverN,
        bandLoOverMax: b.g0Src ? band.lo / b.g0Src : null } }; });
    const accel = D.accelCols.map((c) => { const q = L.accelHeatPerKnob(r, c); return { col: c, perKnob: q.perKnob, ledgerOk: q.ledgerRel < 1e-9, kMax: joint[c].kMax, heatW: q.perKnob * joint[c].kMax, rel: rel(q.perKnob * joint[c].kMax) }; });
    const accMax = accel.reduce((a, q) => (q.heatW > a.heatW ? q : a), accel[0]);
    return { key: r.key, host: r.host, e: r.e, n: r.n, I: r.I, heatW: obs, k2qLit: fin(r.k2qLit) ? r.k2qLit : null, bacLit: fin(r.bacLit) ? r.bacLit : null,
      tide, tideStar: { heatW: tStar, rel: rel(tStar) }, tideLit: tLit === null ? null : { heatW: tLit, rel: rel(tLit) }, libr, axial, accel, accelMax: { col: accMax.col, heatW: accMax.heatW, rel: accMax.rel } };
  });
  return { band, joint, kStar, rows: out };
}

/* ───────── T2 金星と地球の共鳴(潮汐力 —— 候補 1)───────── */
export function partResonance(heat) {
  const D = L.DECL.t2, P = L.venusEarthPeriods(), V = L.venusScales(), GM_E = TL.G_SI * TL.BODY_SRC.Earth.M[0];
  const aV = TL.BODY_SRC.Venus.aHel[0], aE = TL.BODY_SRC.Earth.aHel[0];
  const harm = D.kList.map((k) => { const h = L.harmonicA({ aV, aE, nV: P.nV, nE: P.nE, k, nQuad: D.nQuad }); return { k, A: h.A, overPeak: h.A / h.peak, resonantNow: k === P.k }; });
  const A = harm.find((h) => h.k === P.k).A;
  const Kof = (bac) => 1.5 * bac * V.I * GM_E * A;
  // 地球の共鳴の調和の成分 ÷ 太陽の同期の復元(同じ (B − A)/C で)—— 誘起の変形の比(第337便c の 2.9e-9)・永久の変形の瞬間の最大の比と並べる
  const earthResOverSunSync = GM_E * A / (TL.G_SI * TL.BODY_SRC.Sun.M[0] / Math.pow(aV, 3));
  const band = heat.band, NstOf = (k2q) => 1.5 * k2q * V.tideUnit;
  const kres = D.bac.map((bac) => ({ bac, K: Kof(bac), tauLibYr: Math.sqrt(V.I / Kof(bac)) / TL.YR, sunForcedLibRad: L.sunForcedLib(bac),
    overAxSunLo: Kof(bac) / (band.lo * V.axSunAligned), overAxSunHi: Kof(bac) / (band.hi * V.axSunAligned) }));
  // 定常の解: |N_st ± ε N_ax| ≤ K(N_ax = Γ₀ × 太陽の軸引きずりの 1 Γ₀ あたり —— 揃える読み)。同じ向きの ε の上限・逆向きの ε の窓(太陽の潮汐を打ち消す側)
  const steady = [];
  for (const bac of D.bac) for (const k2q of D.k2q) {
    const K = Kof(bac), Nst = NstOf(k2q), row = { bac, k2q, K, Nst, NstOverK: Nst / K, existsEps0: Nst <= K };
    for (const g of ['lo', 'hi']) { const Nax = band[g] * V.axSunAligned;
      row[g] = { Nax, epsSameMax: K >= Nst ? (K - Nst) / Nax : null, epsOppLo: Math.max(0, Nst - K) / Nax, epsOppHi: (Nst + K) / Nax,
        epsGrid: D.eps.map((eps) => ({ eps, same: Nst + eps * Nax <= K, opp: Math.abs(Nst - eps * Nax) <= K })) }; }
    steady.push(row);
  }
  // 今の自転(CSV の値)が共鳴の秤動の幅の内に入るのに要る復元の強さ: K ≥ I Δs²/2
  const Kwidth = V.I * P.slip * P.slip / 2, width = { Kwidth, bacNeeded: Kwidth / Kof(1) };
  // 月の対照(同じ式 —— 同期の調和の成分 1/a³・月の (B − A)/C は文献の値)と、第337便c の外部の軸引きずりの物差し
  const mo = TL.bodyRow(TL.BODY_ROWS.find((x) => x.id === 'Moon')), aM = TL.BODY_SRC.Moon.a[0], nM = 2 * Math.PI / TL.BODY_SRC.Moon.porb[0];
  const syncM = L.syncA({ a: aM, n: nM, nQuad: 4096 }), Kmoon = 1.5 * L.LIT.moonBac * mo.I * GM_E * syncM.A;
  const moon = { bac: L.LIT.moonBac, K: Kmoon, syncAOverClosed: syncM.A / syncM.closed, axUnit: mo.NaxSum, overAxLo: Kmoon / (band.lo * mo.NaxSum), overAxHi: Kmoon / (band.hi * mo.NaxSum), tauLibYr: Math.sqrt(mo.I / Kmoon) / TL.YR };
  // 捕まる範囲(無次元 —— 2 段の 2 段目)
  const C = D.capture, capture = [];
  for (const N of C.nOverK) for (const g of C.gammas) {
    const ph = []; for (let j = 0; j < C.nPhase; j++) ph.push(L.captureRow({ N, G: g, d0: j * Math.PI / C.nPhase }));
    capture.push({ N, G: g, exists: N <= 1, nTrapped: ph.filter((q) => q.trapped).length, n: C.nPhase, T: ph[0].T });
  }
  // 金星の物理の値を無次元へ写す(線形の型の太陽の潮汐 Γ_t = N_st/|s_res − n_♀| —— 捕まる表のどこに来るか)
  const mapping = [];
  for (const bac of D.bac) for (const k2q of D.k2q) { const K = Kof(bac), Nst = NstOf(k2q), tau = Math.sqrt(V.I / K), Gt = Nst / Math.abs(P.sRes - P.nV);
    mapping.push({ bac, k2q, tauYr: tau / TL.YR, Gprime: Gt * tau / V.I, Nprime: Nst / K, slipPrimeNow: P.slip * tau }); }
  return { periods: P, scales: V, earthResOverSunSync, harm, kres, steady, width, moon, capture, mapping };
}

/* ───────── T3 地球磁場(候補 2 —— 次点)───────── */
export function partMagnetic(res) {
  const D = L.DECL.t3, aV = TL.BODY_SRC.Venus.aHel[0], aE = TL.BODY_SRC.Earth.aHel[0], vE = 2 * Math.PI * aE / TL.BODY_SRC.Earth.porb[0], R_E = 6.371e6;
  const aberr = D.vsw.map((v) => ({ vsw: v, abDeg: Math.atan(vE / v) * 180 / Math.PI }));
  const abList = D.abDeg.concat(aberr.map((q) => q.abDeg)).sort((a, b) => a - b);
  const geom = [];
  for (const ab of abList) for (const Lre of D.tailRe) { const q = L.tailMinDist({ aE, aV, abDeg: ab, L: Lre * R_E }); geom.push({ abDeg: ab, tailRe: Lre, minDistAU: q.minDist / 1.495978707e11, overRadius: q.minDist / (D.tailRadiusRe * R_E), reaches: q.minDist <= D.tailRadiusRe * R_E }); }
  const firstReach = (Lre) => { const g = geom.filter((x) => x.tailRe === Lre && x.reaches); return g.length ? Math.min(...g.map((x) => x.abDeg)) : null; };
  const dMin = aE - aV, Rv = TL.BODY_SRC.Venus.R[0];
  const fields = [
    { key: 'dipole', B: L.dipoleAt(dMin), note: '地球の双極子を最接近の距離へ(太陽風の閉じ込めを入れない上限)' },
    { key: 'tailLobe', B: L.LIT.tailLobeT, note: '尾の葉の磁束密度が金星まで弱まらずに届いたとした反実の上限' },
    { key: 'imf', B: L.LIT.imfVenusT, note: '金星の軌道の惑星間の磁場(太陽の場 —— 桁を並べるだけ)' },
  ].map((f) => { const N = L.inducedTorqueMax({ R: Rv, B: f.B }); return Object.assign(f, { Nmax: N, overK: res.kres.map((q) => ({ bac: q.bac, ratio: N / q.K })) }); });
  return { vE, aberr, geom, firstReach: L.DECL.t3.tailRe.map((Lre) => ({ tailRe: Lre, abDeg: firstReach(Lre) })), dMinAU: dMin / 1.495978707e11, fields };
}

/* ───────── T4 3 つを 1 表に ───────── */
export function partJoint(heat, res, mag) {
  const rows = [];
  for (const bac of PLAN.t4Bac) for (const k2q of PLAN.t4K2q) {
    const K = res.kres.find((q) => q.bac === bac).K, st = res.steady.find((q) => q.bac === bac && q.k2q === k2q), mDip = mag.fields.find((f) => f.key === 'dipole').Nmax;
    const mp = res.mapping.find((q) => q.bac === bac && q.k2q === k2q);
    rows.push({ bac, k2q, K, Nst: st.Nst, magDipole: mDip, magOverK: mDip / K, epsSameMaxLo: st.lo.epsSameMax, epsSameMaxHi: st.hi.epsSameMax, epsOppLo: st.lo.epsOppLo, epsOppHi: st.lo.epsOppHi,
      existsEps0: st.existsEps0, Nprime: mp.Nprime, Gprime: mp.Gprime, tauYr: mp.tauYr });
  }
  return { rows, widthBac: res.width.bacNeeded };
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const D = L.DECL, H = J.heat, R = J.res, M = J.mag;
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 7,
    heat: H.rows.length === 5 && H.band.separable === true && H.band.lo < H.band.hi && H.rows.every((r) => r.tide.length === D.t1.k2q.length && r.libr.every((q) => q.ok && q.closureOk && q.heatW >= 0)
      && r.axial.every((a) => Object.values(a.pts).every((p) => p.heatW > 0 && Math.abs(p.bySrc.reduce((s, q) => s + q.share, 0) - 1) < 1e-12)) && r.accel.every((q) => q.ledgerOk && q.heatW >= 0))
      && Math.abs(H.rows[0].tideStar.rel - 1) < 1e-12 && H.rows.filter((r) => r.heatW).every((r) => r.axial.every((a) => a.budget.srcOverOne >= 1 - 1e-12)),
    resonance: R.periods.k === -10 && R.harm.length === D.t2.kList.length && R.harm.every((h) => h.A > 0 && h.overPeak < 1) && R.kres.length === D.t2.bac.length
      && R.steady.length === D.t2.bac.length * D.t2.k2q.length && R.steady.every((s) => s.existsEps0 === (s.Nst <= s.K)) && Math.abs(R.moon.syncAOverClosed - 1) < 1e-12,
    capture: R.capture.length === D.t2.capture.nOverK.length * D.t2.capture.gammas.length && R.capture.filter((c) => !c.exists).every((c) => c.nTrapped === 0),
    magnetic: M.geom.filter((g) => g.abDeg <= 90).every((g) => !g.reaches) && M.fields.length === 3 && M.fields.every((f) => f.Nmax > 0),
    joint: J.joint.rows.length === PLAN.t4Bac.length * PLAN.t4K2q.length,
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const heat = partHeat(); mark('heat');
  const res = partResonance(heat); mark('res');
  const mag = partMagnetic(res); mark('mag');
  const joint = partJoint(heat, res, mag); mark('joint');
  const J = { pure, heat, res, mag, joint, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w338f-heatlock.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W338F_OUT ? (path.isAbsolute(process.env.W338F_OUT) ? process.env.W338F_OUT : path.join(ROOT, process.env.W338F_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第338便f heatlock(版 ' + HARNESS_VERSION + ')');
  const R = runAll();
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w338f-heatlock.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-15 —— 第138報の回答 4)「イオは潮汐ロックしているので、内部熱の検証用」「金星の「地球との共鳴」は、向きが合う共鳴なので軸引きずりでは無い。月の潮汐ロックと同じ力なので、候補は潮汐力、次点は地球磁場」・原仮定者の指示(2026-11-15 —— 第139報)・統括の検証項目 R354',
    decl: L.DECL, lit: L.LIT, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, zeroFloor: ZERO_FLOOR, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第338便f', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'heatlock', engine: 'Node(html を読まない —— 純関数の lib の表・射撃と RK4・求積)・1 プロセス', notClaim: NOT_CLAIM, zeroFloor: ZERO_FLOOR });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();
