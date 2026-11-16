// 第340便f(原仮定者の指示(2026-11-17 —— 第140報)→ 台帳の AN760 = A・AN761 = C・統括の検証項目 R361):
//   **熱と共鳴の探索の器(第2段)**(段 heatsource-340f —— 正本 tests/out/heatsource-340f.json・lib tests/lib-w340f-heatsource.mjs)。**診断だけ** ——
//   エンジン・内蔵の本・受理器・前の便の lib の本文は変えない。physics の鍵を足さない。帯(第337便c のロックの有無の分類のしきい)は動かさない(AN760)。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w340f-heatsource.mjs —— 領域の宣言なし)。入力のファイルは無い(第337便c の分類の行・第338便f の熱の口・第338便b の 3 成分の残りは
//   lib を呼んで作り直す)。1 プロセス。正本は第338便c の settleRun で書く(丸めの残りは 0 —— 尺度と床は meta.recheck)。
//
// ■ 探索の方針(第138報): 式の形は走行の前に決め打ちしない —— 正本の先頭(decl・rulers・plan)は、走らせたノブの格子と判定の物差し(何と比べて「合う」と言うか)の記録。
// ■ 判定の物差し: T1 は (i) 第337便c の 14 行の分類が今のまま(ロックしている 9 行は外部の軸引きずり < 潮汐・していない 4 行と太陽は >)・(ii) イオの軸引きずりの熱 ≤ 観測の熱流
//   (全球の物差し —— イオだけを超過の判定に使う。月とエンケラドゥスは物差しの領域が違うので比を並べるだけ)・(iii) 金星で釣り合う比 ρ_V が窓の内か。T2 は秤動の幅(滑り ÷ ω_lib < 1)と、
//   第338便f の定常の解の式に第338便b の残りを入れた判定。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w340f-heatsource.mjs';
import * as HL from './lib-w338f-heatlock.mjs';
import * as TL from './lib-w337c-tidelock.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w340f-heatsource-1';
export const OUT_MAIN = 'tests/out/heatsource-340f.json';
export const TARGET = 'tests/lib-w340f-heatsource.mjs';
/** 版の履歴(結果を見て変えた所 —— 理由つき) */
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '候補の型とノブの表(このノブの組では、の窓 —— イオの熱の出どころを決めたのではない)', '帯と熱の同時の成否で閉じない(窓と、次に足すノブの試し)',
  '共鳴へ捕まる途中か通り過ぎたかは書かない(秤動の幅との比・滑りの向き・2 つの物差しの表)', '共鳴の原因が潮汐とは書かない',
  '金星の釣り合いの根は解かない(第338便b の根の 3 成分の残りを入力に置いた)', '金星の大気の熱潮汐は扱わない(原仮定者の回答 3)',
  '文献の値は本環境では一次資料に当たっていない(未照合)', 'エンケラドゥスと月の比は物差しの領域が違う —— 観測を超える判定に使わない(イオだけ)']);
/** 器の宣言(表に出す点) */
export const PLAN = Object.freeze({
  rulerPoints: Object.freeze(['equal-bandLo', 'equal-bandHi', 'best-aligned', 'shield-0.1']),
  bacExtra: 'needed',   // 読み A(秤動の幅の内)に要る (B − A)/C の行を足す
});
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const val = (id, k) => TL.BODY_SRC[id][k][0];

/* ───────── T1 源ごとの応答の係数 ───────── */
export function partT1() {
  const D = L.DECL.t1, cls = L.classRows(), sats = HL.satRows(), io = sats[0], H = io.heatW;
  // 源ごとの熱の単位(Γ = 1)と、ρ = 1 の銀河の取り分・その分け(β の比 × 滑りの比)
  const units = sats.map((r) => ({ key: r.key, host: r.host, heatW: fin(r.heatW) ? r.heatW : null, ruler: D.rulers[r.key] || null,
    readings: D.readings.map((rd) => { const hu = L.heatUnits(r, rd), A = HL.axialHeat(r, 1, rd);
      const bHost = A.ports.filter((q) => q.src !== 'galaxy').reduce((s, q) => s + q.beta, 0), bG = A.ports.find((q) => q.src === 'galaxy').beta;
      return { reading: rd, uHost: hu.uHost, uBg: hu.uBg, hostAlong: hu.host.along, hostPerp: hu.host.perp, bgAlong: hu.bg.along, bgPerp: hu.bg.perp,
        bgShareEqual: hu.uBg / (hu.uHost + hu.uBg), betaRatio: bG / bHost, slipRatio: (hu.uBg / bG) / (hu.uHost / bHost) }; }) }));
  const hus = Object.fromEntries(D.readings.map((rd) => [rd, L.heatUnits(io, rd)]));
  const grid = D.readings.map((rd) => ({ reading: rd, rows: D.rho.map((rho) => { const w = L.windowAt(rho, cls, hus[rd], H);
    return { rho, lo: w.lo, loBy: w.loBy, hiCls: w.hiCls, hiBy: w.hiBy, hiHeat: w.hiHeat, clsOk: w.clsOk, ok: w.ok }; }),
    hostOff: L.windowHostOff(cls, hus[rd], H), okRho: L.rhoIntervals(cls, hus[rd], H, 'ok'), clsRho: L.rhoIntervals(cls, hus[rd], H, 'clsOk') }));
  const venus = D.readings.flatMap((rd) => D.venusRefs.map((ref) => L.venusBalance(rd, ref)));
  const vMain = venus.find((v) => v.reading === D.shieldReading && v.ref === D.shieldRef);
  const atV = D.readings.map((rd) => { const w = L.windowAt(vMain.rhoV, cls, hus[rd], H); return { reading: rd, rho: vMain.rhoV, lo: w.lo, hiCls: w.hiCls, hiHeat: w.hiHeat, clsOk: w.clsOk, ok: w.ok }; });
  const shield = D.readings.map((rd) => Object.assign({ reading: rd }, L.shieldTable(cls, hus[rd], H, vMain.rhoV)));
  // 物差しの領域の表(イオ・月・エンケラドゥス): 4 つの点の (Γ_host, Γ_bg) で熱 ÷ 観測
  const g1 = grid.find((g) => g.reading === 'aligned'), r0 = g1.rows.find((q) => q.rho === 0), rho1 = g1.rows.find((q) => q.rho === 1);
  const sh = shield.find((s) => s.reading === 'aligned').rows.find((q) => q.sigma === 0.1);
  const pts = [
    { key: 'equal-bandLo', gHost: rho1.lo, rhoSat: 1, note: 'ρ = 1・帯の下端(第338便f の帳簿の点)' },
    { key: 'equal-bandHi', gHost: rho1.hiCls, rhoSat: 1, note: 'ρ = 1・帯の上端' },
    { key: 'best-aligned', gHost: r0.ok ? Math.sqrt(r0.lo * Math.min(r0.hiCls, r0.hiHeat)) : null, rhoSat: 0, note: 'ρ = 0(銀河の項なし)・揃える読みの窓の中(幾何の平均)' },
    { key: 'shield-0.1', gHost: sh.ok ? Math.sqrt(sh.lo * Math.min(sh.hiCls, sh.hiHeat)) : null, rhoSat: 0.1 * vMain.rhoV, note: 'ρ = ρ_V(金星で釣り合う)・衛星の遮り σ 0.1・揃える読みの窓の中' },
  ];
  const rulers = units.filter((u) => u.ruler).map((u) => ({ key: u.key, ruler: u.ruler, heatW: u.heatW, judge: u.ruler === 'global',
    pts: pts.map((p) => { const q = u.readings.find((x) => x.reading === 'aligned'), Q = fin(p.gHost) ? p.gHost * (q.uHost + p.rhoSat * q.uBg) : null;
      return { key: p.key, heatW: Q, rel: fin(Q) && u.heatW ? Q / u.heatW : null }; }) }));
  return { cls, units, grid, venus, venusMain: { reading: vMain.reading, ref: vMain.ref, rhoV: vMain.rhoV }, atV, shield, points: pts, rulers };
}

/* ───────── T2 金星と地球の共鳴の 2 つの読み ───────── */
export function partT2(t1) {
  const D = L.DECL.t2, B = L.resonanceBase(), P = B.P, V = B.V, K1 = 1.5 * V.I * B.GM_E * B.A;
  const bacNeed = V.I * P.slip * P.slip / 2 / K1;
  const phase = L.phaseDrift(B);
  const readings = D.bac.concat([bacNeed]).map((bac) => { const q = Object.assign({ needed: bac === bacNeed }, L.readingRow(B, bac));
    if (q.needed) q.inside = null;   // 境目の行(滑り ÷ ω_lib = 1 —— 内外の真偽は丸めで反転するので書かない)
    return q; });
  // 保つ力(永久の変形への復元 K)と入る減衰(太陽の潮汐 —— 線形の型 Γ_t = N_st/|s_res − n_♀|)の 2 つの物差し
  const rulers2 = [];
  for (const bac of D.bac) for (const k2q of D.k2q) { const K = K1 * bac, Nst = 1.5 * k2q * V.tideUnit, tau = Math.sqrt(V.I / K), Gt = Nst / Math.abs(P.sRes - P.nV);
    rulers2.push({ bac, k2q, K, Nst, NstOverK: Nst / K, Gprime: Gt * tau / V.I }); }
  const eps = L.residualEps(), e0 = eps[0];
  // 帯の 2 点(第337便c —— 太陽の軸引きずりの物差し N_ax = Γ₀ × 揃える読みの 1 Γ₀ あたり)
  const bandRow = t1.grid.find((g) => g.reading === 'aligned').rows.find((q) => q.rho === 1), band = { lo: bandRow.lo, hi: bandRow.hiCls };
  const dMin = val('Earth', 'aHel') - val('Venus', 'aHel'), mag = HL.inducedTorqueMax({ R: val('Venus', 'R'), B: HL.dipoleAt(dMin) });
  const joint = [];
  for (const bac of D.bac) for (const k2q of D.k2q) for (const g of D.bandPts) {
    const K = K1 * bac, Nst = 1.5 * k2q * V.tideUnit, Nax = band[g] * V.axSunAligned, sA = L.steadyOk(K, Nst, Nax, e0.epsAlong), sT = L.steadyOk(K, Nst, Nax, e0.epsTot);
    joint.push({ bac, k2q, band: g, K, Nst, Nax, epsSameMax: K >= Nst ? (K - Nst) / Nax : null, epsOppLo: Math.max(0, Nst - K) / Nax, epsOppHi: (Nst + K) / Nax,
      alongSame: sA.same, alongOpp: sA.opp, totSame: sT.same, totOpp: sT.opp, magOverK: mag / K });
  }
  // 第338便b の残りを入れたとき、定常に要る (B − A)/C(同じ向き K ≥ N_st + ε N_ax・逆向き K ≥ |N_st − ε N_ax|)
  const need = [];
  for (const k2q of D.k2q) for (const g of D.bandPts) { const Nst = 1.5 * k2q * V.tideUnit, Nax = band[g] * V.axSunAligned;
    need.push({ k2q, band: g, alongSame: (Nst + e0.epsAlong * Nax) / K1, alongOpp: Math.abs(Nst - e0.epsAlong * Nax) / K1, totSame: (Nst + e0.epsTot * Nax) / K1, totOpp: Math.abs(Nst - e0.epsTot * Nax) / K1 }); }
  return { periods: { k: P.k, kObs: P.kObs, slip: P.slip, slipRel: P.slipRel, TsynDay: P.TsynDay, periodObsDay: P.periodObsDay, periodResDay: P.periodResDay },
    A: B.A, K1, bacNeed, phase, readings, rulers2, eps, band, joint, need, magDipole: mag, earthOverSunPermPeak: V.earthOverSunPermPeak, earthOverSunRaised: V.earthOverSunRaised };
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const D = L.DECL, T1 = J.t1, T2 = J.t2;
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 8,
    cls: T1.cls.length === 14 && T1.cls.filter((c) => c.locked).length === 9 && T1.cls.filter((c) => c.bound).length === 9,
    grid: T1.grid.length === 2 && T1.grid.every((g) => g.rows.length === D.t1.rho.length && g.rows.every((q) => q.clsOk === true) && g.rows.filter((q) => q.ok).every((q) => q.hiHeat > q.lo)),
    equalBand: T1.grid.every((g) => { const q = g.rows.find((x) => x.rho === 1); return q.ok === false && q.lo < q.hiCls; }),
    venus: T1.venus.length === 4 && T1.venus.every((v) => (v.rhoV === null) === !v.opposite) && fin(T1.venusMain.rhoV),
    shield: T1.shield.length === 2 && T1.shield.every((s) => s.rows.length === D.t1.sigma.length),
    rulers: T1.rulers.length === 3 && T1.rulers.filter((r) => r.judge).length === 1 && T1.rulers.find((r) => r.judge).key === 'Io',
    t2: T2.periods.k === -10 && T2.readings.length === D.t2.bac.length + 1 && T2.readings.filter((r) => r.needed).length === 1 && T2.readings.filter((r) => !r.needed).every((r) => r.inside === false)
      && T2.joint.length === D.t2.bac.length * D.t2.k2q.length * 2 && T2.eps.length === 4,
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const t1 = partT1(); mark('t1');
  const t2 = partT2(t1); mark('t2');
  const J = { pure, t1, t2, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w340f-heatsource.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W340F_OUT ? (path.isAbsolute(process.env.W340F_OUT) ? process.env.W340F_OUT : path.join(ROOT, process.env.W340F_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第340便f heatsource(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w340f-heatsource.mjs', target: TARGET,
    ruling: '原仮定者の指示(2026-11-17 —— 第140報)の決断事項 → AN760 = A(源ごとの応答の係数 —— 銀河の項と主星の項で係数を分ける)・AN761 = C(2 つの読みを両方表に —— 「内合のたびにほぼ同じ面」を先に)・統括の検証項目 R361',
    decl: L.DECL, rulersDecl: L.RULERS, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第340便f', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'heatsource', engine: 'Node(html を読まない —— 純関数の lib の表・窓の走査と二分・求積)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
