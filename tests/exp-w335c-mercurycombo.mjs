// 第335便c(原仮定者の決断(2026-11-12)「回転の並進引きずりが近点移動に効くのではないか —— 斜め軌道なので、位置で影響が変化する」「回転引きずり有りの組み合わせも検証する」・
//   原仮定者の補足(2026-11-12)「距離の変化による並進引きずりについて、水星での影響を組み合わせとして確認する」・原仮定者の回答(2026-11-12 —— AN646・AN650・AN655・AN657)・統括の検証項目 R330):
//   **水星の組み合わせの器 —— 並進の分の動径/接線/法線の分解(距離の変化の分 —— 今の K1 に含まれている・別に足すと二重の否定対照)・回転引きずり有りの組み合わせの表
//   (基準 = G_loc 受け手 n = 2 + 統合した並進〔K1 の代わり〕に R1 座標変換の回転の分・R2 旧い回転の差分・R3 切り口・R4 T1 の向き × 結合を単独と和で)・軌道の位置の区間ごとの面内の近点の回転と
//   e × 近点引数 × 傾きの格子の型の判定・二次の結合(列どうしの混合の差)・文献の値(第335便c で訂正・本環境では未照合)との参考の比・金星・地球・火星の対照**
//   (段 mercurycombo-335c —— 正本 tests/out/mercurycombo-w335c.json・lib tests/lib-w335c-mercurycombo.mjs)。**診断だけ** —— エンジン・内蔵の本・受理器・前の便の lib と器の本文は変えない。
//
// Node だけ(html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、第333便c の器の readBooks・systemOf を呼んで 🌡️🌋🔴 の宣言の値を読む —— 本の JSON は 1 bit も変えない・步は進めない)。
// ■ 言わないこと: 表は宣言した型の一次の率・位置の依存の型の有無・文献の値(本環境では未照合)との参考の比。回転引きずりで水星の近点が出たとは書かない・距離の変化の並進で不足が埋まったとは書かない・
//   T1 の向きの候補を採用と書かない。一次の率は無摂動の軌道の平均 —— 率 × 周期が 1e-3 を超える列は一次外挿が壊れる印。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import { readBooks, systemOf } from './exp-w333c-mercury3d.mjs';
import * as L from './lib-w335c-mercurycombo.mjs';
// 第281便a の領域 hash の宣言(版 8 —— 器と lib と import の閉包から deriveScope で引いた下限。器が引く本は 🌡️🌋🔴 の 3 本〔第333便c の器の readBooks〕・core:false・abBody:false)
const REGEN_SCOPE = {"presets":["marsSunInertial3d","mercurySunInertial3d","venusSunInertial3d"],"roots":["HP.allPresets","HP.dfmMeshVelocityFieldAt","HP.sim","HP.validatePreset","T","ch","ctx","cw"],"core":false,"consts":[],"complete":true,"abBody":false};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w335c-mercurycombo-1';
export const OUT_MAIN = 'tests/out/mercurycombo-w335c.json';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const { add, sub, scl, nrm } = L.vec;
const DEG = Math.PI / 180;
const asec = L.asec;
export const NOT_CLAIM = Object.freeze(['表は宣言した型の一次の率・位置の依存の型の有無・文献の値(本環境では未照合)との参考の比(回転引きずりで水星の近点が出たとは書かない)',
  '距離の変化による並進引きずり(並進の分の動径の成分)は今の K1 の並進の分に含まれている —— 別の項として足すと二重(否定対照)・不足が埋まったとは書かない',
  'T1 の向き(方位・接線・法線・動径)と結合(速度の場・自己なしの場・押し)は宣言した比べる列 —— 採用ではない・結果を見て選ばない',
  '同時のフィットはしない(列ごとに単独と基準に足した和)', '一次の率は無摂動の軌道の平均(写しの時間発展ではない)—— 率 × 周期が 1e-3 を超える列は一次外挿が壊れる印',
  '係数の比の最小は特定の暦表・量・幅からの参考の比(厳密な信頼の上限ではない)', '文献の値は外の照合の記録 + 記憶の値(本環境から一次資料は未到達 —— 一次資料で照らしたとは書かない)',
  '統合した並進引きずり・旧い回転の差分・切り口・T1 の列は宣言(未接続 —— 今のエンジンに無い)', '今の組(G_loc 受け手 n = 2 + K1)は凍結の基準']);
/** 器の宣言(走行の前 —— 結果を見て変えない) */
export const PLAN = Object.freeze({
  /** 回転引きずり有りの足す列(R1・R2・R3・R4 —— 名は lib の columnEffect) */
  comboCols: Object.freeze([
    Object.freeze({ key: 'rot', group: 'R1', label: 'R1 座標変換の回転の分(観測自転 s・α = 1・ballHarmonic・Y_k m)' }),
    Object.freeze({ key: 'pair1obs', group: 'R2', label: 'R2 旧い回転の差分(対向 2 点・NF・α = 1・観測自転の振幅)' }),
    Object.freeze({ key: 'pair2obs', group: 'R2', label: 'R2 旧い回転の差分(対向 2 点・NF・α = 2・観測自転の振幅)' }),
    Object.freeze({ key: 'pair1jEquiv', group: 'R2', label: 'R2 旧い回転の差分(α = 1・J 等価の振幅・応答率は観測自転で固定)' }),
    Object.freeze({ key: 'pair2jEquiv', group: 'R2', label: 'R2 旧い回転の差分(α = 2・J 等価の振幅・応答率は観測自転で固定)' }),
    Object.freeze({ key: 'cut', group: 'R3', label: 'R3 切り口(帯 —— 第332便a の主・観測自転)' }),
  ].concat(L.DECL.t1Dirs.flatMap((d) => L.DECL.t1Couplings.map((c) => Object.freeze({ key: 't1' + d + (c === 'vel' ? 'Vel' : c === 'velNoSelf' ? 'VelNoSelf' : 'Push'), group: 'R4', dir: d, coupling: c,
    label: 'R4 T1(s z)× 向き ' + ({ phi: '方位 ŝ × p', tangent: '軌道の接線', normal: '公転面の法線', radial: '動径' })[d] + ' × ' + ({ vel: '速度の場(座標変換の重み β)', velNoSelf: '速度の場(自己なし β = 1)', push: '押し(NF の強さ γ)' })[c] }))))),
  /** 分解の行(並進の分 —— 名は lib の columnEffect) */
  decompCols: Object.freeze(['transRadial', 'transTangent', 'transNormal', 'trans']),
  controls: Object.freeze(['venus', 'earth', 'mars']),
  sunMoI: 0.07,
  G: L.DECL.G, c: L.DECL.c,
});

/* ───────── 行 ───────── */
const polesOf = (S) => (S.key === 'earth' ? { sun: S.sunAxis } : { ecl: [0, 0, 1], sun: S.sunAxis });
function rowOf(S, R) {
  const pk = (k) => (R.per && R.per[k] && !R.per[k].degenerate ? { di: asec(R.per[k].di), dnode: asec(R.per[k].dnode), dvarpi: asec(R.per[k].dvarpi) } : null);
  const sp = L.splitAbout(R.Ldot, S.orb.W, S.sunAxis), Pd = 2 * Math.PI / Math.sqrt(S.orb.mu / S.orb.a ** 3);
  const rates = [R.LdotMag, R.apsW === null ? 0 : Math.abs(R.apsW), Math.abs(R.dlnA), Math.abs(R.eOut || 0)];
  return { apsW: asec(R.apsW), Lmag: asec(R.LdotMag), Lvec: R.Ldot.map(asec), prec: asec(sp.prec), toward: asec(sp.toward), eOut: asec(R.eOut), decy: R.dedt * L.CENTURY_S, dlnAcy: R.dlnA * L.CENTURY_S,
    ecl: pk('ecl'), sun: pk('sun'), breaks: Math.max(...rates) * Pd > L.DECL.breakPerOrbit };
}
const sumRows = (rows) => { const z = () => ({ di: 0, dnode: 0, dvarpi: 0 }), out = { apsW: 0, Lvec: [0, 0, 0], eOut: 0, dlnAcy: 0, ecl: rows.every((q) => q.ecl) ? z() : null, sun: z(), breaks: false };
  for (const q of rows) { out.apsW += q.apsW || 0; out.eOut += q.eOut || 0; out.dlnAcy += q.dlnAcy || 0; out.Lvec = add(out.Lvec, q.Lvec);
    for (const f of ['ecl', 'sun']) if (out[f]) for (const k of ['di', 'dnode', 'dvarpi']) out[f][k] += q[f][k]; out.breaks = out.breaks || q.breaks; }
  out.Lmag = nrm(out.Lvec); return out; };
const q1cyOf = (S) => { const q = 6 * Math.PI * S.orb.mu / (PLAN.c ** 2 * S.orb.a * (1 - S.orb.e ** 2)), P = 2 * Math.PI / Math.sqrt(S.orb.mu / S.orb.a ** 3); return asec(q / P); };
/** 文献の比べる尺度(第334便c の LIT —— 第335便c の訂正の後)と比・係数の参考の比 */
function litOf(key, row) {
  const lv = L.LIT.dvarpi[key], ln = L.LIT.dnode[key], sV = lv ? Math.abs(lv[0]) + lv[1] : null, sN = ln ? Math.abs(ln[0]) + ln[1] : null;
  const vp = row.ecl ? row.ecl.dvarpi : row.apsW, nd = row.ecl ? row.ecl.dnode : null;
  const rV = sV && vp ? vp / sV : (sV ? 0 : null), rN = sN && nd !== null ? nd / sN : null;
  const kV = rV ? 1 / Math.abs(rV) : null, kN = rN ? 1 / Math.abs(rN) : null, ks = [kV, kN].filter((x) => x !== null && Number.isFinite(x));
  return { scale: { varpi: sV, node: sN }, ratio: { varpi: rV, node: rN }, kRatio: { varpi: kV, node: kN, min: ks.length ? Math.min(...ks) : null } };
}

/* ───────── D 並進の分の動径/接線/法線の分解(距離の変化の分)───────── */
export function partDecomp(S) {
  const poles = polesOf(S), q1 = q1cyOf(S), R = (k) => rowOf(S, L.columnRates(S, k, poles));
  const main = Object.fromEntries(['gloc', 'k1', ...PLAN.decompCols, 'rot', 'both'].map((k) => [k, R(k)]));
  // 回転の分の分解(動径は 0 —— s × p ⊥ p)
  const effRot = L.columnEffect(S, 'rot'), rotParts = Object.fromEntries(['radial', 'tangent', 'normal'].map((c) => [c, rowOf(S, vecR(S, { kind: 'vel', d: L.splitField(effRot.d, c) }, poles))]));
  const sc = Math.max(Math.abs(main.trans.apsW), main.trans.Lmag), clos = Math.abs(main.transRadial.apsW + main.transTangent.apsW + main.transNormal.apsW - main.trans.apsW) / sc;
  const closL = nrm(sub(add(add(main.transRadial.Lvec, main.transTangent.Lvec), main.transNormal.Lvec), main.trans.Lvec)) / sc;
  const scR = Math.max(Math.abs(main.rot.apsW), main.rot.Lmag), closR = Math.max(Math.abs(rotParts.radial.apsW + rotParts.tangent.apsW + rotParts.normal.apsW - main.rot.apsW), nrm(sub(add(add(rotParts.radial.Lvec, rotParts.tangent.Lvec), rotParts.normal.Lvec), main.rot.Lvec))) / scR;
  // 組み合わせの読み(÷ q_1PN): 今の組・基準(K1 の代わり)・二重の否定対照(今の組 + 動径の分)・動径だけ/接線だけを基準に
  const combos = [
    { key: 'now', label: '今の組: G_loc 受け手 n = 2 + K1(凍結の基準)', cols: ['gloc', 'k1'] },
    { key: 'base', label: '基準: G_loc 受け手 n = 2 + 統合した並進の並進の分(K1 の代わり)', cols: ['gloc', 'trans'] },
    { key: 'double', label: '否定対照(二重): 今の組 + 距離の変化の分(動径の成分)', cols: ['gloc', 'k1', 'transRadial'], negative: true },
    { key: 'glocRadial', label: 'G_loc + 動径の成分だけ', cols: ['gloc', 'transRadial'] },
    { key: 'glocTangent', label: 'G_loc + 面内の横(接線)の成分だけ', cols: ['gloc', 'transTangent'] },
    { key: 'glocOnly', label: 'G_loc だけ', cols: ['gloc'] },
  ].map((c) => { const s = sumRows(c.cols.map((k) => main[k])); return { ...c, apsW: s.apsW, overQ: s.apsW / q1, eclVarpi: s.ecl ? s.ecl.dvarpi : null, Lmag: s.Lmag }; });
  // 格子(第334便c の α × 自己の形 × 自己の半径 —— 並進の分の動径・接線・法線・全体)
  const grid = [];
  for (const radius of ['kappaM', 'radius']) for (const shape of ['point', 'ballHarmonic']) for (const alpha of [1, 1.5, 2, 3]) {
    const spec = { kind: 'trans', alpha, shape, radius, part: 'trans' }, e = L.effectOfSpec(S, spec);
    if (!e) { grid.push({ radius, shape, alpha, defined: false }); continue; }
    const parts = Object.fromEntries(['radial', 'tangent', 'normal'].map((c) => [c, asec(vecR(S, { kind: 'vel', d: L.splitField(e.d, c) }, {}).apsW)]));
    const all = vecR(S, e, {}), apsAll = asec(all.apsW), s1 = Math.max(Math.abs(apsAll), 1e-300);
    grid.push({ radius, shape, alpha, defined: true, radial: parts.radial, tangent: parts.tangent, normal: parts.normal, all: apsAll, radialOverAll: parts.radial / s1, tangentOverAll: parts.tangent / s1,
      closure: Math.abs(parts.radial + parts.tangent + parts.normal - apsAll) / s1, overQ: apsAll / q1 });
  }
  return { q1cy: q1, main, rotParts, closure: { trans: Math.max(clos, closL), rot: closR }, combos, grid,
    note: '並進の分 d = −β(r) w(源は静止)を r̂・Ŵ × r̂・Ŵ に分けた一次の永年率。動径の成分 = −β ṙ r̂(距離の変化による並進引きずり)。今の K1 の並進の分と同じ係数(α = 1・ballHarmonic・Y_k m)なので、今の組に動径の分を足すのは二重(否定対照)' };
}
function vecR(S, eff, poles) { return L.vectorRatesOf(S.orb, eff, poles); }

/* ───────── C 回転引きずり有りの組み合わせ ───────── */
export function partCombos(S, { withLit = true } = {}) {
  const poles = polesOf(S), q1 = q1cyOf(S), base = ['gloc', 'trans'].map((k) => rowOf(S, L.columnRates(S, k, poles))), b = sumRows(base);
  const cols = PLAN.comboCols.map((C) => { const r = rowOf(S, L.columnRates(S, C.key, poles)), s = sumRows([...base, r]);
    return { key: C.key, group: C.group, dir: C.dir || null, coupling: C.coupling || null, label: C.label, alone: r,
      withBase: { apsW: s.apsW, overQ: s.apsW / q1, dApsW: s.apsW - b.apsW, Lmag: s.Lmag, eclNode: s.ecl ? s.ecl.dnode : null, eclDi: s.ecl ? s.ecl.di : null, eclVarpi: s.ecl ? s.ecl.dvarpi : null, sunNode: s.sun.dnode, sunDi: s.sun.di, breaks: s.breaks },
      lit: withLit ? litOf(S.key, r) : null }; });
  return { q1cy: q1, base: { apsW: b.apsW, overQ: b.apsW / q1, Lmag: b.Lmag, eclVarpi: b.ecl ? b.ecl.dvarpi : null }, cols,
    note: '基準 = G_loc 受け手 n = 2 + 統合した並進の並進の分(K1 の代わり —— 重ねない)。各列は単独の一次の率と、基準に足した和(一次で足し算)。同時のフィットはしない' };
}

/* ───────── P 軌道の位置の区間と型の判定 ───────── */
export function partPosition(S) {
  const z = [0, 0, 1], sysZ = { ...S, sunAxis: z }, g = L.anglesOnPlane(S.orb, S.sunAxis), DG = L.DECL;
  // 水星の軌道そのもの(区間ごと)
  // 区間の和 = 全周の照合の床(並進の分の全周の 1e-6 —— 対称で 0 の列〔法線の成分・旧い差分の面内〕の丸めの桁を比べない)
  const floorAbs = 1e-6 * Math.abs(L.vectorRatesOf(S.orb, L.columnEffect(S, 'trans'), {}).apsW);
  const mercury = DG.gridCols.map((k) => { const B = L.binRates(S.orb, L.columnEffect(S, k), S.sunAxis);
    const sc = Math.max(Math.abs(B.full.apsW), B.full.LdotMag, B.grossApsW || 0, floorAbs), share = (ks) => ks.filter((x) => x !== null).reduce((s1, kk) => s1 + Math.abs(B.per[kk].apsW), 0) / B.grossApsW;
    const near = (k0) => (k0 === null ? [] : [k0 - 1, k0, k0 + 1].map((x) => (x + DG.nBins) % DG.nBins));
    return { key: k, fullApsW: asec(B.full.apsW), sumApsW: asec(B.sumApsW), grossApsW: asec(B.grossApsW), netOverGross: B.netOverGross, binSumDev: Math.max(Math.abs(B.sumApsW - B.full.apsW), nrm(sub(B.sumLdot, B.full.Ldot))) / sc,
      perBin: B.per.map((q) => asec(q.apsW)), marks: B.marks,
      shares: { peri: share(near(B.marks.peri)), apo: share(near(B.marks.apo)), nodes: share([...new Set([...near(B.marks.asc), ...near(B.marks.desc)])]), zMax: share([...new Set([...near(B.marks.zMax[0]), ...near(B.marks.zMax[1])])]) } }; });
  // e × ω × 傾きの格子(太陽の赤道面の要素 —— ŝ を z 軸に・a と μ は水星)
  const at = (k, e, om, iDeg) => { const orb = L.hypoOrbit({ a: S.orb.a, mu: S.orb.mu, e, iDeg, nodeDeg: 0, omegaDeg: om }), sys = { ...sysZ, orb }, B = L.binRates(orb, L.columnEffect(sys, k), z, { full: false });
    return { apsW: B.sumApsW === null ? null : asec(B.sumApsW), netOverGross: B.netOverGross, Lmag: asec(nrm(B.sumLdot)), dedt: B.per.reduce((s1, q) => s1 + q.dedt, 0) * L.CENTURY_S, deInCy: B.deInMag * L.CENTURY_S }; };
  const cols = DG.gridCols.map((k) => {
    const grid = [];
    for (const iDeg of DG.incGridDeg) for (const e of DG.eGrid) { const pts = DG.omegaGridDeg.map((om) => ({ omegaDeg: om, ...at(k, e, om, iDeg) }));
      const a = pts.map((p) => p.apsW), ok = a.every((x) => x !== null), mean = ok ? a.reduce((s1, x) => s1 + x, 0) / a.length : null, amp = ok ? (Math.max(...a) - Math.min(...a)) / 2 : null;
      grid.push({ iDeg, e, pts, mean, ampOmega: amp, spread: ok && mean !== 0 ? amp * 2 / Math.abs(mean) : null, deInMean: pts.reduce((s1, p) => s1 + p.deInCy, 0) / pts.length }); }
    const scale = Math.max(...grid.flatMap((r) => r.pts.map((p) => Math.abs(p.apsW || 0))), 1e-300);
    const A = (e, i) => grid.find((r) => r.e === e && r.iDeg === i).ampOmega, mE = DG.eGrid.includes(0.2056) ? 0.2056 : null;
    // 形(水星の e・傾き —— ω の 12 点の格子)
    const ys = DG.shapeOmegaDeg.map((om) => at(k, mE, om, 3.381).apsW), F = L.harmonicFit(DG.shapeOmegaDeg, ys), mean12 = F.coef[0];
    const iSpread = grid.find((r) => r.e === mE && r.iDeg === 3.381);
    const c1 = iSpread.spread !== null && iSpread.spread > DG.omegaDependenceTol;
    const c2 = Math.abs(A(mE, 0)) <= DG.zeroTol * scale && A(mE, 3.381) < A(mE, 7);
    const c3 = A(0.1, 3.381) < A(0.2056, 3.381) && A(0.2056, 3.381) < A(0.4, 3.381);
    const sI = (d) => Math.sin(d * DEG), Aw = A(mE, 3.381);
    const typeOf = { omegaDependent: c1, vanishesFlatGrowsWithInc: c2, growsWithE: c3, has: c1 && c2 && c3,
      fit: { coef: F.coef, rms: F.rms, overAmp: F.coef.map((q) => q / Math.max(...F.coef.slice(1).map(Math.abs), 1e-300)), dominant: F.coef.slice(1).reduce((bi, q, j, arr) => (Math.abs(q) > Math.abs(arr[bi]) ? j : bi), 0) + 1, meanOverAmp: mean12 / Math.max(...F.coef.slice(1).map(Math.abs), 1e-300) },
      scaling: { AoverE: Aw / mE, AoverE2: Aw / (mE * mE), AoverSinI: Aw / sI(3.381), AoverSin2I: Aw / (sI(3.381) ** 2), incRatio: A(mE, 7) / Aw, incRatioSin: sI(7) / sI(3.381), incRatioSin2: (sI(7) / sI(3.381)) ** 2,
        eRatio04: A(0.4, 3.381) / Aw, eRatio01: A(0.1, 3.381) / Aw } };
    // 走行の後に足した読み(宣言の型の判定 has は変えない): A_ω × e が e に依らないか(e ベクトルへの一定の押し —— ω_W ∝ 1/e)・面内の e ベクトルの率 |ė| の e = 0 と水星の e の比
    const Ae = [0.1, 0.2056, 0.4].map((e) => A(e, 3.381) * e), meanAe = Ae.reduce((s1, x) => s1 + x, 0) / 3, rowE = (e) => grid.find((r) => r.e === e && r.iDeg === 3.381);
    const postRead = { note: '走行の後に足した読み —— 宣言の型の判定(has)は変えない', AtimesE: Ae, AtimesESpread: meanAe !== 0 ? (Math.max(...Ae) - Math.min(...Ae)) / Math.abs(meanAe) : null,
      deInE0OverMerc: rowE(mE).deInMean > 0 ? rowE(0).deInMean / rowE(mE).deInMean : null, deInMercCy: rowE(mE).deInMean, incLinear: Aw > 0 ? Math.abs(A(mE, 7) / Aw - sI(7) / sI(3.381)) / (sI(7) / sI(3.381)) : null };
    return { key: k, grid, scale, typeOf, postRead };
  });
  return { iSunDeg: g.i / DEG, omegaSunDeg: g.omega / DEG, mercury, cols,
    note: '区間は真近点角の中心 10k°(幅 10°)。寄与は全周の率への寄与(区間の和 = 全周)。格子は太陽の赤道面の要素(交点の経度 0・ŝ を z 軸に)。型の判定は lib の宣言(走行の前)。e = 0 は面内の回転が定まらない(null)' };
}

/* ───────── M 二次の結合(列どうしの混合の差)───────── */
export function partMix(S) {
  const g = L.anglesOnPlane(S.orb, S.sunAxis), MX = L.DECL.mix, z = [0, 0, 1], orb0 = L.hypoOrbit({ a: 1, mu: 1, e: S.orb.e, iDeg: g.i / DEG, nodeDeg: 0, omegaDeg: g.omega / DEG });
  const betaA = L.betaOf(S)(S.orb.a), n = Math.sqrt(S.orb.mu / S.orb.a ** 3), Pd = 2 * Math.PI / n, cTreal = betaA, cXreal = betaA * S.sSun / n;
  const rows = MX.partners.map((key) => {
    const runs = [];
    for (const st of MX.steps) for (const no of MX.nOrb) runs.push({ steps: st, nOrb: no, ...L.mixing({ orb0, sHat: z, key, cT: MX.cT, cX: MX.cX, stepsPerOrbit: st, nOrb: no }) });
    const ref = runs.find((q) => q.steps === MX.steps[1] && q.nOrb === MX.nOrb[1]), spreadNum = Math.max(...runs.map((q) => Math.abs(q.mix - ref.mix)));
    const dbl = L.mixing({ orb0, sHat: z, key, cT: MX.cT, cX: 2 * MX.cX, stepsPerOrbit: MX.steps[1], nOrb: MX.nOrb[1] });
    const resolved = Math.abs(ref.mix) > MX.resolveFactor * spreadNum, bilin = dbl.mix / ref.mix;
    const qMix = ref.mix / (MX.cT * MX.cX), real = qMix * cTreal * cXreal;
    return { key, runs: runs.map((q) => ({ steps: q.steps, nOrb: q.nOrb, mix: q.mix, partner: q.partner, trans: q.trans })), mixRef: ref.mix, numSpread: spreadNum, resolved, bilinRatio: bilin, bilinOk: resolved ? Math.abs(bilin - 2) <= 2 * MX.bilinTol : null,
      qMix, realPerOrbit: real, realArcsecCy: asec(real / Pd) };
  });
  return { orb0: { e: orb0.e, iDeg: g.i / DEG, omegaDeg: g.omega / DEG }, cTreal, cXreal, rows,
    note: '単位の軌道(μ = a = 1・e と面は太陽の赤道面に対する水星の値)。M = F(並進 + 相手) − F(並進) − F(相手)(F は接触の要素の枠の面内の回転 —— 第334便c の integrateFrame)。本物の係数へは M ÷ (c_T c_X) × c_T,real c_X,real(双線形の宣言 —— 相手の係数を倍にして比 2 を照らす)' };
}

/* ───────── K 対照(金星・地球・火星)───────── */
export function partControls(BK) {
  return PLAN.controls.map((k) => { const S = systemOf(BK, k), D = partDecomp(S), C = partCombos(S);
    return { key: k, ja: S.lit.ja, iSunDeg: L.anglesOnPlane(S.orb, S.sunAxis).i / DEG, q1cy: D.q1cy, decomp: { main: Object.fromEntries(['gloc', 'k1', ...PLAN.decompCols, 'rot'].map((q) => [q, D.main[q]])), closure: D.closure, combos: D.combos },
      combos: { base: C.base, cols: C.cols.map((q) => ({ key: q.key, alone: q.alone, withBase: q.withBase, lit: q.lit })) } }; });
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const D = J.mercury.decomp, C = J.mercury.combos, P = J.mercury.position, M = J.mercury.mix, DG = L.DECL;
  const dbl = D.combos.find((q) => q.key === 'double'), now = D.combos.find((q) => q.key === 'now'), base = D.combos.find((q) => q.key === 'base');
  return {
    pure: Object.values(J.pure.gates).every(Boolean),
    closure: D.closure.trans <= DG.closureTol && D.closure.rot <= DG.closureTol && D.grid.filter((q) => q.defined).every((q) => q.closure <= DG.closureTol) && J.controls.every((q) => q.decomp.closure.trans <= DG.closureTol),
    rotNoRadial: Math.abs(D.rotParts.radial.apsW) <= 1e-12 * Math.max(Math.abs(D.main.rot.apsW), D.main.rot.Lmag) && D.rotParts.radial.Lmag <= 1e-12 * D.main.rot.Lmag,
    baseIsNow: Math.abs(base.overQ - now.overQ) <= 1e-5,
    doubleFlagged: dbl.negative === true && Math.abs(dbl.overQ - now.overQ) > 0.5,
    comboGrid: C.cols.length === PLAN.comboCols.length && C.cols.filter((q) => q.group === 'R4').length === DG.t1Dirs.length * DG.t1Couplings.length,
    binSum: P.mercury.every((q) => q.binSumDev <= DG.binSumTol) && P.mercury.length === DG.gridCols.length,
    posGrid: P.cols.every((q) => q.grid.length === DG.incGridDeg.length * DG.eGrid.length && q.grid.every((r) => r.pts.length === DG.omegaGridDeg.length)),
    t1FlatZero: P.cols.filter((q) => q.key.startsWith('t1')).every((q) => q.grid.filter((r) => r.iDeg === 0).every((r) => r.pts.every((p) => p.Lmag === 0 && (p.apsW === null || p.apsW === 0)))),
    mixNumeric: M.rows.length === DG.mix.partners.length && M.rows.every((q) => q.bilinOk !== false),
    controls: J.controls.length === PLAN.controls.length,
  };
}
export function runAll(HP) {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const BK = readBooks(HP); mark('books');
  const S = systemOf(BK, 'merc');
  const decomp = partDecomp(S); mark('decomp');
  const combos = partCombos(S); mark('combos');
  const position = partPosition(S); mark('position');
  const mix = partMix(S); mark('mix');
  const controls = partControls(BK); mark('controls');
  const geom = { a: S.orb.a, e: S.orb.e, iSunDeg: L.anglesOnPlane(S.orb, S.sunAxis).i / DEG, omegaSunDeg: L.anglesOnPlane(S.orb, S.sunAxis).omega / DEG, sSun: S.sSun, Rd: L.kappaMRadius(S.M), Rsun: S.Rsun,
    period: 2 * Math.PI / Math.sqrt(S.orb.mu / S.orb.a ** 3), betaA: L.betaOf(S)(S.orb.a), zMax: S.orb.a * (1 + S.orb.e) * Math.sin(L.anglesOnPlane(S.orb, S.sunAxis).i), t1SpeedMax: S.sSun * S.orb.a * (1 + S.orb.e) * Math.sin(L.anglesOnPlane(S.orb, S.sunAxis).i) };
  const J = { geom, pure, mercury: { decomp, combos, position, mix }, controls, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/* ───────── 走らせる ───────── */
export async function main() {
  const TARGET = process.env.W335C_TARGET || 'beta/index.html';
  const OUT = process.env.W335C_OUT ? (path.isAbsolute(process.env.W335C_OUT) ? process.env.W335C_OUT : path.join(ROOT, process.env.W335C_OUT)) : path.join(ROOT, OUT_MAIN);
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now(), text = fs.readFileSync(html, 'utf8'), targetSha256 = crypto.createHash('sha256').update(text).digest('hex');
  const W281A_SCOPE = REGEN_SCOPE ? w281aScopeStamp(html, REGEN_SCOPE) : {};
  const { HP } = loadHtmlMain(html);
  console.log('第335便c mercurycombo(版 ' + HARNESS_VERSION + ')');
  // 宣言を正本の先頭に(走行の前に書いた lib の DECL と器の PLAN)
  const head = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w335c-mercurycombo.mjs', decl: L.DECL, plan: PLAN, literature: L.LIT, notClaim: NOT_CLAIM, target: TARGET, targetSha256, reuseFrom: null,
    ruling: '原仮定者の決断(2026-11-12)「回転の並進引きずりが近点移動に効くのではないか —— 斜め軌道なので位置で影響が変化する」「回転引きずり有りの組み合わせも検証する」・原仮定者の補足(2026-11-12)「距離の変化による並進引きずりについて、水星での影響を組み合わせとして確認する」・原仮定者の回答(2026-11-12 —— AN646・AN650・AN655・AN657)・統括の検証項目 R330' };
  const R = runAll(HP);
  const out = { ...head, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w335c-mercurycombo.mjs', 'tests/lib-w335c-mercurycombo.mjs', 'tests/lib-w334c-mercurynode.mjs', 'tests/lib-w334a-heightlaw.mjs', 'tests/exp-w333c-mercury3d.mjs', 'tests/lib-w333c-mercury3d.mjs', 'tests/lib-w332a-eqband.mjs',
    'tests/lib-w331c-k1scale.mjs', 'tests/lib-w330b-dragweight.mjs', 'tests/lib-w309a-invsq.mjs', 'tests/lib-w312a-decay.mjs', 'tests/lib-w310d-shell.mjs', 'tests/lib-w307a-sphereaxial.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第335便c', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, stage: 'mercurycombo', engine: 'Node(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・1 プロセス)・🌡️🌋🔴 の本の宣言を読む(步を進めない)・純関数(lib)', notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s', JSON.stringify(out.timing));
}
if (IS_MAIN) await main();
