// 第334便c(原仮定者の整理(2026-11-11)「水星の近点移動について: 斜め軌道の交点での並進の回転が有望」「引き続き、様々な組み合わせを調べる」・
//   原仮定者の回答(2026-11-11 —— AN633・AN634・AN635・AN636)・統括の検証項目 R324): **斜め軌道の交点の窓の積分の器 —— 統合した並進引きずりの回転の分・並進の分・両方を、
//   交点の前後・交点から離れた部分・全周に分けて同じ量で(L̂ の変化・e の変化〔面内の回転・面外〕・交点・傾き・近点引数・近点経度 —— 太陽の赤道面と黄道)・交点の非対称の仮説の検査(e と近点引数の格子)・
//   組み合わせの表(今の組を凍結の基準に —— G_loc の型 × K1 の有無・K1 の代わりの統合した並進 × α × 揃えた自己の形 × 自己の半径・回転の分の源の自転 s と s_d)・文献の値(未照合)との比と係数の上限・
//   太陽の J₂ と Lense–Thirring の物差し・純粋な積分器・金星・地球・火星の対照**(段 mercurynode-334c —— 正本 tests/out/mercurynode-w334c.json・lib tests/lib-w334c-mercurynode.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・前の便の lib と器の本文は変えない。
//
// Node だけ(html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、第333便c の器の readBooks・systemOf を呼んで 🌡️ mercurySunInertial3d・🌋 venusSunInertial3d・
//   🔴 marsSunInertial3d の宣言の値を読む —— 本の JSON は 1 bit も変えない・步は進めない)。1 プロセス。
// ■ 言わないこと: 表は宣言した型の一次の率・文献の値(未照合)との比・係数に付く上限。交点の並進の回転で水星の近点の値を出したとは書かない・観測の余りに合った/合わなかったので棄却とは書かない。
//   一次の率は無摂動の軌道の平均(写しの時間発展ではない)—— 率 × 周期が 1e-3 を超える列は一次外挿が壊れる印。文献の値はこの箱から一次資料に当たれない(記憶の値は確かさを書く)。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import { readBooks, systemOf } from './exp-w333c-mercury3d.mjs';
import * as L from './lib-w334c-mercurynode.mjs';
// 第281便a の領域 hash の宣言(版 8 —— 器と lib と import の閉包から deriveScope で引いた下限。器が引く本は 🌡️🌋🔴 の 3 本〔第333便c の器の readBooks が宣言の値を .find で引いて読む〕。
//   エンジンは読まない〔core:false —— 步を進めない・写しを作らない〕・ワンタップ対照 A/B は走らせない〔abBody:false〕・説明文の欄は読まない)
const REGEN_SCOPE = {"presets":["marsSunInertial3d","mercurySunInertial3d","venusSunInertial3d"],"roots":["HP.allPresets","HP.dfmMeshVelocityFieldAt","HP.sim","HP.validatePreset","T","ch","ctx","cw"],"core":false,"consts":[],"complete":true,"abBody":false};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w334c-mercurynode-1';
export const OUT_MAIN = 'tests/out/mercurynode-w334c.json';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const { add, sub, scl, dot, crs, nrm, unit } = { ...L.vecOps };
const DEG = Math.PI / 180;
const asec = L.asec;
const relD = (a, b) => (a === b ? 0 : Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b)));
export const NOT_CLAIM = Object.freeze(['表は宣言した型の一次の率・文献の値(未照合)との比・係数に付く上限(交点の並進の回転で水星の近点の値を出したとは書かない)',
  '観測の余りに合った/合わなかったので棄却とは書かない —— 上限は宣言した物差しの比', '一次の率は無摂動の軌道の平均(写しの時間発展ではない)—— 率 × 周期が 1e-3 を超える列は一次外挿が壊れる印',
  '統合した並進引きずり(並進の分・回転の分・両方)・対称の G_loc・引きずり自転 s_d の J 案は宣言(未接続 —— 今のエンジンに無い)', '今の組(G_loc 受け手 n = 2 + K1)は凍結の基準(AN634)',
  '既存の K1 の並進と統合した並進を重ねて足さない(統合した並進は K1 の代わり)', '文献の値はこの箱から一次資料に当たれない(記憶の値・未照合 —— 確かさの程度を書く)',
  '速度の型の窓の値は読みに依る(接触の速度の読みと、引きずりを除いた速度の読みは窓の端の境界の項だけ違う —— 全周では同じ)', '交点の非対称の仮説は検査する仮説(採用ではない)']);
/** 器の宣言(走行の前に置く —— 結果を見て変えない) */
export const PLAN = Object.freeze({
  /** 窓の表の効果(源は太陽 —— 第333便c の主の列と同じ: 統合した並進は α = 1・ballHarmonic・R = Y_k m・観測自転) */
  windowEffects: Object.freeze([
    Object.freeze({ key: 'rot', label: '統合した並進の回転の分(α = 1・ballHarmonic・Y_k m・観測自転 s)', spec: Object.freeze({ kind: 'trans', alpha: 1, shape: 'ballHarmonic', radius: 'kappaM', part: 'rot' }) }),
    Object.freeze({ key: 'trans', label: '統合した並進の並進の分(同)', spec: Object.freeze({ kind: 'trans', alpha: 1, shape: 'ballHarmonic', radius: 'kappaM', part: 'trans' }) }),
    Object.freeze({ key: 'both', label: '統合した並進の両方(同)', spec: Object.freeze({ kind: 'trans', alpha: 1, shape: 'ballHarmonic', radius: 'kappaM', part: 'both' }) }),
    Object.freeze({ key: 'k1', label: 'K1 の並進(今の組 —— 実装)', spec: Object.freeze({ kind: 'k1' }) }),
    Object.freeze({ key: 'gloc', label: 'G_loc 受け手 n = 2(今の組 —— 実装)', spec: Object.freeze({ kind: 'gloc', pair: 'receiver', n: 2 }) }),
    Object.freeze({ key: 'j2', label: '太陽の J₂(文献の値 —— 物差し)', spec: Object.freeze({ kind: 'j2' }) }),
    Object.freeze({ key: 'lt', label: 'Lense–Thirring(J = 0.07 M R² s —— 物差し)', spec: Object.freeze({ kind: 'lt' }) }),
  ]),
  /** 交点の窓の組(太陽の赤道面の交点 ±5°・±15°・±45° と黄道の交点 ±15° の対照)と高さの帯 */
  nodeSets: Object.freeze([Object.freeze({ key: 'sun5', pole: 'sun', half: 5 }), Object.freeze({ key: 'sun15', pole: 'sun', half: 15 }), Object.freeze({ key: 'sun45', pole: 'sun', half: 45 }), Object.freeze({ key: 'ecl15', pole: 'ecl', half: 15 })]),
  /** 本・対照の惑星(地球は文献の値の宣言 —— 第333便c の systemOf と同じ) */
  books: Object.freeze({ merc: 'mercurySunInertial3d', venus: 'venusSunInertial3d', mars: 'marsSunInertial3d' }),
  controls: Object.freeze(['venus', 'earth', 'mars']),
  /** 太陽の慣性モーメントの係数(第333便c の GEOM と同じ値 —— J = f M R² s) */
  sunMoI: L.GEOM333C.sunMoI.value,
  /** 数値の照合の上限(一次 ÷ 数値 —— h/2 の比の 1 からの外れ・h と h/2・窓の長さ 2 つの差) */
  numericTol: 2e-3,
  /** 二次の結合の照合(c と 2c の面内の回転の比が 4 から外れる上限) */
  secondTol: 0.05,
  G: L.DECL.G, c: L.DECL.c,
});

/* ───────── 行(rad/s → ″/世紀)───────── */
function rowOf(S, R, extra = {}) {
  const pk = (k) => (R.per && R.per[k] && !R.per[k].degenerate ? { di: asec(R.per[k].di), dnode: asec(R.per[k].dnode), domega: asec(R.per[k].domega), dvarpi: asec(R.per[k].dvarpi) } : null);
  const sp = L.splitL(R.Ldot, S.orb.W, S.sunAxis), Pd = 2 * Math.PI / Math.sqrt(S.orb.mu / S.orb.a ** 3);
  const rates = [R.LdotMag, R.apsW === null ? 0 : Math.abs(R.apsW), Math.abs(R.dlnA), ...['ecl', 'sun'].filter((k) => R.per && R.per[k] && !R.per[k].degenerate).map((k) => Math.max(Math.abs(R.per[k].di), Math.abs(R.per[k].dnode)))];
  return Object.assign({ apsW: asec(R.apsW), Lmag: asec(R.LdotMag), Lvec: R.Ldot.map(asec), prec: asec(sp.prec), toward: asec(sp.toward), eOut: asec(R.eOut), apsWfromW: asec(R.apsW_fromW), LfromW: asec(nrm(R.LdotFromW)),
    decy: R.dedt * L.CENTURY_S, dlnAcy: R.dlnA * L.CENTURY_S, ecl: pk('ecl'), sun: pk('sun'), breaks: Math.max(...rates) * Pd > L.DECL.breakPerOrbit }, extra);
}
const polesOf = (S) => (S.key === 'earth' ? { sun: S.sunAxis } : { ecl: [0, 0, 1], sun: S.sunAxis });
const specOf = (S, spec) => (spec.kind === 'j2' ? { ...spec, J2: L.LIT.sunJ2.value } : spec.kind === 'lt' ? { ...spec, J: PLAN.sunMoI * S.M * S.Rsun * S.Rsun * S.sSun } : spec);
const sumRows = (rows) => { const out = { apsW: 0, Lvec: [0, 0, 0], ecl: rows.every((q) => q.ecl) ? { di: 0, dnode: 0, domega: 0, dvarpi: 0 } : null, sun: { di: 0, dnode: 0, domega: 0, dvarpi: 0 }, breaks: false };
  for (const q of rows) { out.apsW += q.apsW || 0; out.Lvec = add(out.Lvec, q.Lvec); for (const f of ['ecl', 'sun']) if (out[f]) for (const k of ['di', 'dnode', 'domega', 'dvarpi']) out[f][k] += q[f][k]; out.breaks = out.breaks || q.breaks; }
  out.Lmag = nrm(out.Lvec); return out; };

/* ───────── W 窓の表 ───────── */
export function partWindows(S) {
  const poles = polesOf(S), out = [];
  for (const E of PLAN.windowEffects) {
    const eff = L.effectOf(S, specOf(S, E.spec)), full = rowOf(S, L.vectorRates(S.orb, eff, { poles }));
    const fullFine = rowOf(S, L.vectorRates(S.orb, eff, { nodes: L.DECL.nodesFine })), scF = Math.max(full.Lmag, Math.abs(full.apsW || 0), 1e-300);
    const sets = [];
    const winSets = PLAN.nodeSets.filter((ns) => ns.pole === 'sun' || poles.ecl).map((ns) => ({ key: ns.key, half: ns.half, pole: ns.pole, W: L.nodeWindows(S.orb, ns.pole === 'sun' ? S.sunAxis : [0, 0, 1], ns.half) }));
    const Rd = L.kappaMRadius(S.M);
    for (const k of L.DECL.heightRd) winSets.push({ key: 'hRd' + k, h: k * Rd, hLabel: k + ' R_d', pole: 'sun', W: L.heightWindows(S.orb, S.sunAxis, k * Rd) });
    for (const k of L.DECL.heightRsun) winSets.push({ key: 'hRs' + k, h: k * S.Rsun, hLabel: k + ' R_☉', pole: 'sun', W: L.heightWindows(S.orb, S.sunAxis, k * S.Rsun) });
    for (const ws of winSets) {
      const pieces = {}, bnd = {};
      for (const pc of ['asc', 'desc', 'away']) {
        const R = L.vectorRates(S.orb, eff, { windows: ws.W[pc], poles });
        pieces[pc] = rowOf(S, R);
        if (eff.kind === 'vel') { let b = { Ldot: [0, 0, 0], apsW: 0 }; for (const [E0, E1] of ws.W[pc]) { const q = L.boundaryTerm(S.orb, eff, E0, E1); b = { Ldot: add(b.Ldot, q.Ldot), apsW: b.apsW + (q.apsW || 0) }; }
          const LB = sub(R.Ldot, b.Ldot), spB = L.splitL(LB, S.orb.W, S.sunAxis);   // 引きずりを除いた速度の読み(v = w − d)の窓の値 = 窓の値 − 境界の項
          bnd[pc] = { Lmag: asec(nrm(b.Ldot)), apsW: asec(b.apsW), overL: nrm(b.Ldot) / Math.max(nrm(R.Ldot), 1e-300), readB: { Lvec: LB.map(asec), Lmag: asec(nrm(LB)), prec: asec(spB.prec), toward: asec(spB.toward), apsW: R.apsW === null ? null : asec(R.apsW - b.apsW) } }; }
      }
      const fine = rowOf(S, L.vectorRates(S.orb, eff, { windows: ws.W.asc, poles, gl: L.DECL.glWinFine }));
      const sm = sumRows([pieces.asc, pieces.desc, pieces.away]), sc = Math.max(full.Lmag, Math.abs(full.apsW || 0), 1e-300);
      const devOf = (a, b) => Math.max(nrm(sub(a.Lvec, b.Lvec)), Math.abs((a.apsW || 0) - (b.apsW || 0))) / sc;
      const sumDev = Math.max(nrm(sub(sm.Lvec, full.Lvec)), Math.abs(sm.apsW - (full.apsW || 0))) / sc;
      const timeFrac = Object.fromEntries(['asc', 'desc', 'away'].map((pc) => [pc, ws.W[pc].reduce((s1, [E0, E1]) => s1 + ((E1 - S.orb.e * Math.sin(E1)) - (E0 - S.orb.e * Math.sin(E0))) / (2 * Math.PI), 0)]));
      const sumDevB = eff.kind === 'vel' ? Math.max(nrm(sub(['asc', 'desc', 'away'].reduce((s1, pc) => add(s1, bnd[pc].readB.Lvec), [0, 0, 0]), full.Lvec)), Math.abs(['asc', 'desc', 'away'].reduce((s1, pc) => s1 + (bnd[pc].readB.apsW || 0), 0) - (full.apsW || 0))) / sc : null;
      sets.push({ key: ws.key, sumDevB, pole: ws.pole, half: ws.half || null, h: ws.h || null, hLabel: ws.hLabel || null, rAsc: ws.W.rAsc || null, rDesc: ws.W.rDesc || null, timeFrac, pieces, boundary: eff.kind === 'vel' ? bnd : null,
        sumDev, fineRel: devOf(fine, pieces.asc) });
    }
    out.push({ key: E.key, label: E.label, kind: eff.kind, full, fineFullRel: Math.max(nrm(sub(fullFine.Lvec, full.Lvec)), Math.abs((fullFine.apsW || 0) - (full.apsW || 0))) / scF, sets });
  }
  return out;
}

/* ───────── H 交点の非対称の仮説(e × 近点引数 —— 太陽の赤道面の要素)───────── */
export function partHypo(S) {
  const g = L.anglesOnPlane(S.orb, S.sunAxis), iDeg = g.i / DEG, z = [0, 0, 1], rows = [];
  const sysZ = { ...S, sunAxis: z };
  for (const alpha of L.DECL.hypoAlpha) for (const e of L.DECL.eGrid) {
    const pts = [];
    for (const om of L.DECL.omegaGridDeg) {
      const orb = L.hypoOrbit({ a: S.orb.a, mu: S.orb.mu, e, iDeg, nodeDeg: 0, omegaDeg: om }), sys = { ...sysZ, orb };
      const eff = L.effectOf(sys, { kind: 'trans', alpha, shape: 'ballHarmonic', radius: 'kappaM', part: 'rot' }), nw = L.nodeWindows(orb, z, L.DECL.hypoHalfDeg);
      const piece = (ws) => { const R = L.vectorRates(orb, eff, { windows: ws, poles: { sun: z } }), sp = L.splitL(R.Ldot, orb.W, z);
        return { apsW: asec(R.apsW), apsWfromW: asec(R.apsW_fromW), prec: asec(sp.prec), toward: asec(sp.toward), Lmag: asec(R.LdotMag), dnode: asec(R.per.sun.dnode) }; };
      const full = piece(null);
      pts.push({ omegaDeg: om, rAscOverA: nw.rAsc / S.orb.a, rDescOverA: nw.rDesc / S.orb.a, asc: piece(nw.asc), desc: piece(nw.desc), away: piece(nw.away), full });
    }
    const aw = pts.map((q) => q.full.apsW), mean = e > 0 ? aw.reduce((s1, q) => s1 + q, 0) / aw.length : null;
    const spread = e > 0 ? Math.max(...aw.map((q) => Math.abs(q - mean))) / Math.abs(mean) : null;
    const tw = pts.map((q) => q.full.toward), twSpread = Math.max(...tw) - Math.min(...tw);
    rows.push({ alpha, e, pts, apsWmean: mean, apsWspread: spread, omegaDependent: spread === null ? null : spread > L.DECL.omegaDependenceTol, towardRange: twSpread,
      fromWmax: e > 0 ? Math.max(...pts.flatMap((q) => ['asc', 'desc', 'away', 'full'].map((k) => Math.abs(q[k].apsWfromW) / Math.max(q.full.Lmag, 1e-300)))) : null });
  }
  // 元の見積りの対照: 黄道の上の近点引数 29.1°(第333便c の黄道の ω)と太陽の赤道面の上の 109.58° の r_asc/r_desc
  const gE = L.anglesOnPlane(S.orb, [0, 0, 1]), rr = (om) => (1 - S.orb.e * Math.cos(om)) / (1 + S.orb.e * Math.cos(om));
  return { iDeg, rows, ratioEcl: { omegaDeg: gE.omega / DEG, rAscOverRDesc: rr(gE.omega) }, ratioSun: { omegaDeg: g.omega / DEG, rAscOverRDesc: rr(g.omega) },
    note: '太陽の赤道面の要素(傾きは水星の値・交点の経度は 0・ŝ を z 軸に)で e と近点引数 ω を振る。窓は交点 ±15°(位相の原点は太陽の赤道面の昇交点)。e = 0 は面内の回転が定まらない(null)' };
}

/* ───────── C 組み合わせの表 ───────── */
export function partCombos(S) {
  const poles = polesOf(S), q1 = L.q1PNPerOrbit(S.orb.mu, S.orb.a, S.orb.e), P = 2 * Math.PI / Math.sqrt(S.orb.mu / S.orb.a ** 3), q1cy = asec(q1 / P);
  const R = (spec) => { const eff = L.effectOf(S, spec); return eff ? rowOf(S, L.vectorRates(S.orb, eff, { poles })) : null; };
  const k1 = R({ kind: 'k1' }), glocs = L.DECL.gLocTypes.map((t) => ({ ...t, row: R({ kind: 'gloc', pair: t.pair, n: t.n }) }));
  const base = sumRows([glocs[0].row, k1]);
  const gl = glocs.flatMap((t) => [true, false].map((wk) => { const s = sumRows(wk ? [t.row, k1] : [t.row]); return { pair: t.pair, n: t.n, k1: wk, trans: false, apsW: s.apsW, overQ: s.apsW / q1cy, eclVarpi: s.ecl ? s.ecl.dvarpi : null, vsBase: s.apsW - base.apsW }; }));
  const single = [];
  for (const radius of L.DECL.radii) for (const shape of L.DECL.shapes) for (const alpha of L.DECL.alphaGrid) for (const part of L.DECL.parts) {
    const spec = { kind: 'trans', alpha, shape, radius, part }, eff = L.effectOf(S, spec);
    if (!eff) { single.push({ radius, shape, alpha, part, defined: false }); continue; }
    const row = rowOf(S, L.vectorRates(S.orb, eff, { poles }));
    const betaA = L.weightOf(S.M, S.orb.a, alpha) / (eff.self.w + L.weightOf(S.M, S.orb.a, alpha));
    single.push(Object.assign(row, { radius, shape, alpha, part, defined: true, Rself: eff.Rself, betaAtA: betaA }));
  }
  // K1 の代わりの統合した並進(両方)+ G_loc 受け手 n = 2(重ねない —— k1 は偽)
  const instead = single.filter((q) => q.part === 'both').map((q) => { if (!q.defined) return { radius: q.radius, shape: q.shape, alpha: q.alpha, defined: false, k1: false, trans: true };
    const s = sumRows([glocs[0].row, q]); return { radius: q.radius, shape: q.shape, alpha: q.alpha, defined: true, k1: false, trans: true, apsW: s.apsW, overQ: s.apsW / q1cy, eclVarpi: s.ecl ? s.ecl.dvarpi : null, eclNode: s.ecl ? s.ecl.dnode : null, eclDi: s.ecl ? s.ecl.di : null, sunNode: s.sun.dnode, Lmag: s.Lmag, breaks: s.breaks }; });
  // 回転の分の源の自転(観測自転 s・J 案 s_d —— λ_J の格子 × 連動させない —— 率は自転に一次なので倍する)
  const Rd = L.kappaMRadius(S.M), spins = [{ key: 'observed', label: '観測自転 s', factor: 1 }].concat(L.DECL.lambdaJ.map((lj) => ({ key: 'lambdaJ=' + lj, label: 'λ_J = ' + lj, lambdaJ: lj,
    factor: L.dragSpin({ s: S.sSun, Robs: S.Rsun, Rd, fObs: PLAN.sunMoI, lambdaJ: lj }) / S.sSun })));
  const spinRows = [];
  for (const shape of L.DECL.shapes) for (const alpha of [1, 2]) {
    const b = single.find((q) => q.radius === 'kappaM' && q.shape === shape && q.alpha === alpha && q.part === 'rot');
    for (const sp of spins) { const k = sp.factor, s1 = sumRows([base, { apsW: b.apsW * k, Lvec: b.Lvec.map((x) => x * k), ecl: b.ecl ? Object.fromEntries(Object.entries(b.ecl).map(([kk, v]) => [kk, v * k])) : null, sun: Object.fromEntries(Object.entries(b.sun).map(([kk, v]) => [kk, v * k])), breaks: false }]);
      const Pd = P, perOrbit = Math.max(b.Lmag, Math.abs(b.apsW)) * Math.abs(k) / (L.CENTURY_S * 206264.80624709636) * Pd;
      spinRows.push({ shape, alpha, spin: sp.key, label: sp.label, factor: k, sdRdOverC: sp.lambdaJ !== undefined ? S.sSun * k * Rd / PLAN.c : null, Lmag: b.Lmag * Math.abs(k), eclNode: b.ecl ? b.ecl.dnode * k : null, eclDi: b.ecl ? b.ecl.di * k : null,
        sunNode: b.sun.dnode * k, apsW: b.apsW * k, totalEclVarpi: s1.ecl ? s1.ecl.dvarpi : null, totalApsW: s1.apsW, breaks: perOrbit > L.DECL.breakPerOrbit }); }
  }
  return { q1cy, base: { apsW: base.apsW, overQ: base.apsW / q1cy, eclVarpi: base.ecl ? base.ecl.dvarpi : null }, k1: { apsW: k1.apsW }, gl, single, instead, spinRows,
    note: '今の組(G_loc 受け手 n = 2 + K1)は凍結の基準。G_loc の型 × K1 の有無は中心力と公転面の中の力(交点・傾きは 0)。統合した並進は K1 の代わり(重ねない —— 両方の行は k1 が偽)。自己の形を揃えた 2 列(point・ballHarmonic —— α = 3 の ballHarmonic は定義できない)× 自己の半径(Y_k m が基準・観測の半径は対照)。回転の分の源の自転は率に一次(倍する —— 連動させない)' };
}

/* ───────── R 文献の値との比・係数の上限・J₂ と Lense–Thirring の物差し ───────── */
export function partLit(BK) {
  return ['merc', 'venus', 'earth', 'mars'].map((key) => {
    const S = systemOf(BK, key), poles = polesOf(S), rows = {};
    for (const [k, spec] of [['rot', { kind: 'trans', alpha: 1, shape: 'ballHarmonic', radius: 'kappaM', part: 'rot' }], ['rotPt', { kind: 'trans', alpha: 1, shape: 'point', radius: 'kappaM', part: 'rot' }],
      ['j2', { kind: 'j2' }], ['lt', { kind: 'lt' }]]) rows[k] = rowOf(S, L.vectorRates(S.orb, L.effectOf(S, specOf(S, spec)), { poles }));
    const lv = L.LIT.dvarpi[key], ln = L.LIT.dnode[key], sV = lv ? Math.abs(lv[0]) + lv[1] : null, sN = ln ? Math.abs(ln[0]) + ln[1] : null;
    const varpiOf = (q) => (q.ecl ? q.ecl.dvarpi : q.apsW), nodeOf = (q) => (q.ecl ? q.ecl.dnode : null);
    const ratio = (q) => ({ varpi: sV ? varpiOf(q) / sV : null, node: sN && nodeOf(q) !== null ? nodeOf(q) / sN : null });
    const kmax = (q) => { const a = sV ? sV / Math.abs(varpiOf(q)) : Infinity, b = sN && nodeOf(q) !== null ? sN / Math.abs(nodeOf(q)) : Infinity; return { varpi: sV ? a : null, node: sN && nodeOf(q) !== null ? b : null, min: Math.min(a, b) }; };
    const K = kmax(rows.rot), Rd = L.kappaMRadius(S.M), sdFac = (PLAN.sunMoI / L.DECL.fDrag) * (S.Rsun / Rd) ** 2, Rk = L.kappaMRadius(S.m);
    return { key, ja: L.GEOM333C.planets[key].ja, scale: { varpi: sV, node: sN },   // 比べる尺度 |値| + 幅(第335便c で欄の名 sigma → scale —— 統計の σ ではない)
      lit: { varpi: lv, node: ln }, rows, ratio: { rot: ratio(rows.rot), rotPt: ratio(rows.rotPt), j2: ratio(rows.j2), lt: ratio(rows.lt) },
      kmax: K, kmaxPt: kmax(rows.rotPt), lambdaJmax: K.min / sdFac, RselfMaxOverYkm: K.min, RselfMaxOverRobs: K.min * Rk / S.R, rotOverLt: { node: nodeOf(rows.rot) !== null ? nodeOf(rows.rot) / nodeOf(rows.lt) : null, Lmag: rows.rot.Lmag / rows.lt.Lmag } };
  });
}

/* ───────── N 純粋な積分器 ───────── */
export function partNumeric(S) {
  const g = L.anglesOnPlane(S.orb, S.sunAxis), orb0 = L.hypoOrbit({ a: 1, mu: 1, e: S.orb.e, iDeg: g.i / DEG, nodeDeg: 0, omegaDeg: g.omega / DEG }), pole = [0, 0, 1], IN = L.DECL.integ;
  const types = [{ key: 'rot1', label: '回転の分(α = 1 —— d = c (ẑ × p)/r)', velX: (x) => scl(crs(pole, x), IN.cRot / nrm(x)) },
    { key: 'trans1', label: '並進の分(α = 1 —— d = −c w/r)', velX: (x, v) => scl(v, -IN.cTrans / nrm(x)) }];
  const rows = types.map((T) => {
    const an = L.vectorRates(orb0, { kind: 'vel', d: T.velX }, { poles: { p: pole } }), Pd = 2 * Math.PI;
    const ana = { aps: an.apsIn * Pd, di: an.per.p.di * Pd, dnode: an.per.p.dnode * Pd, Lmag: an.LdotMag * Pd };
    const runs = [];
    for (const st of IN.steps) for (const no of IN.nOrb) { const q = L.integrate3d({ orb0, velX: T.velX, pole, stepsPerOrbit: st, nOrb: no }); runs.push({ steps: st, nOrb: no, aps: q.aps, di: q.di, dnode: q.dnode }); }
    const sc = Math.max(Math.abs(ana.aps), Math.abs(ana.di), Math.abs(ana.dnode)), ref = runs.find((q) => q.steps === IN.steps[1] && q.nOrb === IN.nOrb[1]);
    const dev = Math.max(...['aps', 'di', 'dnode'].map((k) => Math.abs(ref[k] - ana[k]))) / sc, band = Math.max(...runs.flatMap((q) => ['aps', 'di', 'dnode'].map((k) => Math.abs(q[k] - ref[k])))) / sc;
    const per = L.periodicAmplitude(orb0, { kind: 'vel', d: T.velX });
    return { key: T.key, label: T.label, analytic: ana, runs, devOverScale: dev, bandOverScale: band, periodicAmp: per.amp, periodicOverSecular: per.amp / per.perOrbit };
  });
  // 二次の結合(回転の分 α = 1 —— 一次の面内の回転は 0。c と 2c の面内の回転の c² の項 → 本物の係数へ)
  const sec = IN.secondC.map((c) => ({ c, ...L.integrateFrame({ orb0, velX: (x) => scl(crs(pole, x), c / nrm(x)), stepsPerOrbit: IN.secondSteps, nOrb: IN.secondNOrb }) }));
  const q2 = sec[0].apsW / (sec[0].c * sec[0].c), ratio = sec[1].apsW / sec[0].apsW;
  const eff = L.effectOf(S, { kind: 'trans', alpha: 1, shape: 'ballHarmonic', radius: 'kappaM', part: 'rot' }), betaA = L.weightOf(S.M, S.orb.a, 1) / (eff.self.w + L.weightOf(S.M, S.orb.a, 1));
  const n = Math.sqrt(S.orb.mu / S.orb.a ** 3), cReal = betaA * S.sSun / n, Pd = 2 * Math.PI / n, realPerOrbit = q2 * cReal * cReal;
  const first = L.vectorRates(orb0, { kind: 'vel', d: (x) => scl(crs(pole, x), sec[0].c / nrm(x)) }, {});
  // 二次の結合の e × ω の格子(交点の非対称の仮説なら ω に依る)と傾きの対照(係数 c = secondC[0])
  const c0 = IN.secondC[0], q2at = (e, om, iDeg) => L.integrateFrame({ orb0: L.hypoOrbit({ a: 1, mu: 1, e, iDeg, nodeDeg: 0, omegaDeg: om }), velX: (x) => scl(crs(pole, x), c0 / nrm(x)), stepsPerOrbit: IN.secondGridSteps, nOrb: IN.secondNOrb }).apsW / (c0 * c0);
  const grid2 = L.DECL.eGrid.filter((e) => e > 0).map((e) => { const q = L.DECL.omegaGridDeg.map((om) => q2at(e, om, g.i / DEG)), m = q.reduce((s1, x) => s1 + x, 0) / q.length;
    return { e, q2: q, mean: m, spread: Math.max(...q.map((x) => Math.abs(x - m))) / Math.abs(m), omegaDependent: Math.max(...q.map((x) => Math.abs(x - m))) / Math.abs(m) > L.DECL.omegaDependenceTol }; });
  const inc2 = IN.secondIncDeg.map((iDeg) => ({ iDeg, q2: q2at(S.orb.e, g.omega / DEG, iDeg) }));
  return { orb0: { e: orb0.e, iDeg: g.i / DEG, omegaDeg: g.omega / DEG }, rows,
    second: { runs: sec.map((q) => ({ c: q.c, apsW: q.apsW, tilt: q.tilt })), q2, ratio, tiltOverFirst: sec[0].tilt / (first.LdotMag * 2 * Math.PI), firstApsW: first.apsW * 2 * Math.PI, cReal, realArcsecCy: asec(realPerOrbit / Pd), grid: grid2, inc: inc2 },
    note: '単位の軌道(μ = a = 1・e と面は太陽の赤道面に対する水星の値)。一次の率と integrate3d(公転ごとの同じ位相の標本・無摂動を引く —— 永年の項)を h と h/2・窓の長さ 12 と 24 公転で。周期の項は一次の公転の中の累積の振れ(同じ位相の標本では消える)。二次の結合は接触の要素の枠の面内の回転(c と 2c)' };
}

/* ───────── K 対照(金星・地球・火星 —— 大きさ)───────── */
export function partControls(BK) {
  return PLAN.controls.map((k) => {
    const S = systemOf(BK, k), poles = polesOf(S), eff = L.effectOf(S, { kind: 'trans', alpha: 1, shape: 'ballHarmonic', radius: 'kappaM', part: 'rot' }), nw = L.nodeWindows(S.orb, S.sunAxis, 15);
    const pc = Object.fromEntries(['asc', 'desc', 'away'].map((p) => [p, rowOf(S, L.vectorRates(S.orb, eff, { windows: nw[p], poles }))])), full = rowOf(S, L.vectorRates(S.orb, eff, { poles }));
    const CB = partCombos(S), inst = CB.instead.find((q) => q.radius === 'kappaM' && q.shape === 'ballHarmonic' && q.alpha === 1);
    return { key: k, ja: L.GEOM333C.planets[k].ja, iSunDeg: L.anglesOnPlane(S.orb, S.sunAxis).i / DEG, rAscOverRDesc: nw.rAsc / nw.rDesc, q1cy: CB.q1cy, baseApsW: CB.base.apsW, rot: { asc: pc.asc, desc: pc.desc, away: pc.away, full },
      instead: inst ? { apsW: inst.apsW, overQ: inst.overQ, sunNode: inst.sunNode, Lmag: inst.Lmag } : null };
  });
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const Wm = J.mercury.windows, C = J.mercury.combos, H = J.mercury.hypo, N = J.numeric;
  const rot = Wm.find((q) => q.key === 'rot'), k1 = Wm.find((q) => q.key === 'k1'), tr = Wm.find((q) => q.key === 'trans');
  return {
    pure: Object.values(J.pure.gates).every(Boolean),
    windowSum: Wm.every((q) => q.sets.every((s) => s.sumDev <= L.DECL.sumTol && s.fineRel <= 1e-8 && (s.sumDevB === null || s.sumDevB <= L.DECL.sumTol)) && q.fineFullRel <= 1e-8),
    vecFrames: J.mercury.frameCheck.length > 0 && J.mercury.frameCheck.every((x) => x <= 1e-9),
    transIsK1: Math.abs(tr.full.apsW / k1.full.apsW - 1) <= 1e-5 && tr.full.Lmag <= 1e-9 * Math.abs(tr.full.apsW),
    noStack: C.gl.length === L.DECL.gLocTypes.length * 2 && C.instead.every((q) => q.k1 === false && q.trans === true) && C.gl.every((q) => q.trans === false),
    alignedGrid: C.single.length === L.DECL.radii.length * L.DECL.shapes.length * L.DECL.alphaGrid.length * L.DECL.parts.length && C.single.filter((q) => !q.defined).every((q) => q.shape === 'ballHarmonic' && q.alpha === 3)
      && C.single.filter((q) => !q.defined).length === L.DECL.radii.length * L.DECL.parts.length,
    fromWzero: H.rows.filter((q) => q.e > 0).every((q) => q.fromWmax <= 1e-9) && Wm.every((q) => q.full.apsWfromW === null || Math.abs(q.full.apsWfromW) <= 1e-9 * Math.max(q.full.Lmag, Math.abs(q.full.apsW || 0), 1e-300)),
    hypoGrid: H.rows.length === L.DECL.hypoAlpha.length * L.DECL.eGrid.length && H.rows.every((q) => q.pts.length === L.DECL.omegaGridDeg.length),
    numeric: N.rows.every((q) => q.devOverScale <= PLAN.numericTol && q.bandOverScale <= PLAN.numericTol) && Math.abs(N.second.ratio - 4) <= 4 * PLAN.secondTol,
    lit: J.litRows.length === 4 && J.litRows.every((q) => Number.isFinite(q.kmax.min) && q.kmax.min > 0),
    controls: J.controls.length === PLAN.controls.length && J.controls.every((q) => Number.isFinite(q.rot.full.Lmag)),
    rotNode: rot.full.Lmag > 0 && rot.sets.length === PLAN.nodeSets.length + L.DECL.heightRd.length + L.DECL.heightRsun.length,
  };
}
export function runAll(HP) {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const BK = readBooks(HP); mark('books');
  const S = systemOf(BK, 'merc');
  const windows = partWindows(S); mark('windows');
  // 面を変えても L̂ のベクトルの変化は同じ(全周の行 —— 黄道と太陽の赤道面の (di, dΩ) から作り直す)
  const frameCheck = [];
  for (const E of PLAN.windowEffects) { const R = L.vectorRates(S.orb, L.effectOf(S, specOf(S, E.spec)), { poles: polesOf(S) }), sc = Math.max(R.LdotMag, 1e-300);
    if (R.LdotMag > 1e-9 * Math.max(Math.abs(R.apsW || 0), Math.abs(R.dlnA))) for (const [k, pl] of [['ecl', [0, 0, 1]], ['sun', S.sunAxis]]) { const v = L.ldotFromAngles(S.orb, pl, R.per[k]); frameCheck.push(nrm(sub(v, R.Ldot)) / sc); } }
  const hypo = partHypo(S); mark('hypo');
  const combos = partCombos(S); mark('combos');
  const lit = partLit(BK); mark('lit');
  const numeric = partNumeric(S); mark('numeric');
  const controls = partControls(BK); mark('controls');
  const geom = { a: S.orb.a, e: S.orb.e, iSunDeg: L.anglesOnPlane(S.orb, S.sunAxis).i / DEG, omegaSunDeg: L.anglesOnPlane(S.orb, S.sunAxis).omega / DEG, iEclDeg: L.anglesOnPlane(S.orb, [0, 0, 1]).i / DEG,
    omegaEclDeg: L.anglesOnPlane(S.orb, [0, 0, 1]).omega / DEG, sSun: S.sSun, Rd: L.kappaMRadius(S.M), Rsun: S.Rsun, period: 2 * Math.PI / Math.sqrt(S.orb.mu / S.orb.a ** 3) };
  const J = { geom, pure, mercury: { windows, frameCheck, hypo, combos }, litRows: lit, numeric, controls, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/* ───────── 走らせる ───────── */
export async function main() {
  const TARGET = process.env.W334C_TARGET || 'beta/index.html';
  const OUT = process.env.W334C_OUT ? (path.isAbsolute(process.env.W334C_OUT) ? process.env.W334C_OUT : path.join(ROOT, process.env.W334C_OUT)) : path.join(ROOT, OUT_MAIN);
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now(), text = fs.readFileSync(html, 'utf8'), targetSha256 = crypto.createHash('sha256').update(text).digest('hex');
  const W281A_SCOPE = REGEN_SCOPE ? w281aScopeStamp(html, REGEN_SCOPE) : {};
  const { HP } = loadHtmlMain(html);
  console.log('第334便c mercurynode(版 ' + HARNESS_VERSION + ')');
  const R = runAll(HP);
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w334c-mercurynode.mjs', target: TARGET, targetSha256, reuseFrom: null,
    ruling: '原仮定者の整理(2026-11-11)「水星の近点移動について: 斜め軌道の交点での並進の回転が有望」「引き続き、様々な組み合わせを調べる」・原仮定者の回答(2026-11-11 —— AN633)交点・傾き・ベクトルの変化を比べる量に・原仮定者の回答(2026-11-11 —— AN634)今の受け手 n = 2 + K1 は凍結の基準・原仮定者の回答(2026-11-11 —— AN635)統合した並進の回転の分を先に・原仮定者の回答(2026-11-11 —— AN636)自己の半径は Y_k m を基準・次数と自己の形を揃えた格子・統括の検証項目 R324',
    decl: L.DECL, literature: L.LIT, plan: PLAN, notClaim: NOT_CLAIM, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w334c-mercurynode.mjs', 'tests/lib-w334c-mercurynode.mjs', 'tests/exp-w333c-mercury3d.mjs', 'tests/lib-w333c-mercury3d.mjs', 'tests/lib-w332a-eqband.mjs', 'tests/lib-w331c-k1scale.mjs', 'tests/lib-w330b-dragweight.mjs',
    'tests/lib-w309a-invsq.mjs', 'tests/lib-w312a-decay.mjs', 'tests/lib-w310d-shell.mjs', 'tests/lib-w307a-sphereaxial.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第334便c', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, stage: 'mercurynode', engine: 'Node(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・1 プロセス)・🌡️🌋🔴 の本の宣言を読む(步を進めない)・純関数(lib)', notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();
