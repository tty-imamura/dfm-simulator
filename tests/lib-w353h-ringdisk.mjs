// 第353便h(原仮定者の回答(2026-11-25 —— 第151報)AN1045・統括の検証項目 R472):
//   **土星の環を円盤引きずりの側で数え直す口 —— 環の区分 5 × 傾きの格子で、輪の法線が源(土星)の赤道面へ寄る率 ÷ 環の物差しを 3 つの列で並べる —— 診断だけ**
//   (器 tests/exp-w353h-ringdisk.mjs と QA behavior.ringdisk353h・docs.ringdisk353h が読む —— html を読まない・ファイルを読まない・状態を持たない)。
//   列: (i) 軸引きずりの (S)(源 = 土星の自転の分・源の半径 = 規則の半径 —— 比べる列のうち規則の半径の列)/(ii) 同・観測の半径(比べる列)/
//   (iii) 円盤引きずりの側の候補(これまでの節に在る式を呼ぶだけ —— 新しい式は作らない):
//     (iii-a) 〔第351便j〕の saturnRows(〔第350便g〕の在位の形の場 —— 源の半径 1 = 土星の観測の半径・受け手の自分の重みは規則の半径・成分 (MS)・読み (C1)(C2)・順行)の起こす率 ÷ 傾き、
//     (iii-b) 〔第351便j〕の rotvertRows(🛟 saturnRotVertExplore3d の傾きの減りの率 —— 本の強さのまま/見える倍率で割った「目安の強さ」)の率。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵・🛟 の本と鍵は変えない(AN712)。既存の lib は呼ぶだけ(本文と版は変えない):
//   第352便s(ringRot・ringRates・saturnSpin・tiltedNormal・saturnRing・uVt —— 軸引きずりの (S) の輪)・第352便k(spinRot・srcRadius)・第352便c(refAxis)・
//   第351便j(ringOmega・ringRate・normalAt・saturnRows・rotvertRows・DECL)・第348便d(saturnUnits・LIT・DECL)・第348便c(massOf)・第338便d(centerKm)・第312便a(Kball)・第347便e(t1Table・geometry)。
//
// ■ 物差し: 環の物差し(第348便d の LIT —— 1e7 年で傾きが e 分の 1 —— 文献の値・未照合 —— 第352便s のまま)。
//   「率 ÷ 物差し」= (起こす率 ÷ 傾き)×(物差しの年数)—— 1 で物差しと同じ率・正 = 傾きが減る(源の赤道面へ寄る)・負 = 傾きが増える。
// ■ 言わないこと: 環の傾きの答え・円盤引きずりの型とは書かない。🛟 の本の「達」はその本の目的(探索用・未較正)—— 円盤引きずりの型を採ったことではない。この場・この列・このノブでは、の表。
import * as S2 from './lib-w352s-satring.mjs';
import * as K from './lib-w352k-spinform.mjs';
import * as CR from './lib-w352c-refaxis.mjs';
import * as RJ from './lib-w351j-ringstep.mjs';
import * as DA from './lib-w348d-diskaxis.mjs';
import * as C from './lib-w348c-axisbalance.mjs';
import * as RB from './lib-w338d-ringbook.mjs';
import * as DK from './lib-w312a-decay.mjs';
import * as E from './lib-w347e-spintorque.mjs';

export const LIB_VERSION = 'w353h-ringdisk-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const D2R = Math.PI / 180;
const AS_PER_RAD = 206264.80624709636;
const nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const rel = (a, b) => Math.abs(a - b) / Math.max(Math.abs(b), 1e-300);
/** rad/s → rad/年(第352便s の ASYR〔″/年 ÷ rad/s〕÷ 206264.8″) */
export const PER_S_TO_PER_YR = S2.ASYR / AS_PER_RAD;

/* ───────── 宣言(走らせた格子と物差しの記録 —— 式の形の宣言ではない)───────── */
export const DECL = Object.freeze({
  /** 環の区分(第352便s の区分 = 第348便d の区分の中心) */
  centers: S2.DECL.ringCenters,
  /** 傾きの格子(度 —— 1° は第352便s・第351便j と同じ) */
  tilts: Object.freeze([0.1, 1, 3, 10, 30]),
  tSrcs: Object.freeze([0, 1]), tNames: Object.freeze({ 0: '規則の半径', 1: '観測の半径' }),
  diskReads: Object.freeze(['C1', 'C2']),
  cols: Object.freeze(['axRule', 'axObs', 'diskC1', 'diskC2', 'bookNeed', 'bookRaw']),
  colNames: Object.freeze({ axRule: '(i) 軸引きずりの (S)・規則の半径', axObs: '(ii) 軸引きずりの (S)・観測の半径(比べる列)',
    diskC1: '(iii-a) 円盤引きずりの側・第351便j の輪 (C1)', diskC2: '(iii-a) 円盤引きずりの側・第351便j の輪 (C2)',
    bookNeed: '(iii-b) 🛟 の率(目安の強さ —— 見える倍率で割った値)', bookRaw: '(iii-b) 🛟 の率(本の強さのまま)' }),
  /** 物差しの年数(第348便d の LIT —— 文献の値・未照合) */
  tYardYr: DA.LIT.tYardYr,
  /** 第352便s の比べる数(零試験: 規則の半径 1e-13 の桁・観測の半径 14〜109) */
  anchor: Object.freeze({ ruleOrder: -13, obsLo: 14, obsHi: 109, uV: 1.19282e-12, L: Object.freeze([0.026257, 0.008317, 0.999621]) }),
  floor: 1e-12,
  judge: '「物差しの桁」= 率 ÷ 物差しが 0.1〜10 の内(正の向き)・逐語の表は有効数字 3 桁',
});

/** (起こす率 rad/s)÷(傾き rad)× 物差しの年数 */
export function yardOf(raisePerS, epsRad) {
  if (!(fin(raisePerS) && fin(epsRad) && epsRad > 0)) return null;
  return raisePerS * PER_S_TO_PER_YR / epsRad * DECL.tYardYr;
}
/** 率(1/s —— 傾きの e 分の 1 の率)× 物差しの年数 */
export const yardOfRate = (ratePerS) => (fin(ratePerS) ? ratePerS * PER_S_TO_PER_YR * DECL.tYardYr : null);

/* ───────── (i)(ii) 軸引きずりの (S)(第352便s の saturnRing の tilt1.satS と同じ作り —— 傾きを引数に)───────── */
/**
 * 区分 key × 源の半径 t × 傾き iDeg: 土星の自転の分 (S) だけ(太陽の重みを分母に —— 第352便s と同じ)で輪の法線が土星の赤道面へ寄る率。
 * 戻り: { key, tSrc, tiltDeg, raiseAsYr(″/年 —— 正 = 傾きが減る), raiseOverEpsPerYr, yard, cosSL }
 */
export function axialRow(T1, GEO, key, { tSrc = 0, tiltDeg = 1 } = {}) {
  if (!DECL.tSrcs.includes(tSrc)) throw new RangeError('axialRow: 源の半径の置き方は 0・1');
  if (!(fin(tiltDeg) && tiltDeg > 0 && tiltDeg < 90)) throw new RangeError('axialRow: 0 < 傾き < 90');
  const sp = S2.saturnSpin(T1, GEO), Ms = C.massOf('Saturn'), Rs = K.srcRadius('Saturn', tSrc), r = RB.centerKm(key) * 1e3;
  const wSun = K.spinRot(T1, GEO, 'Saturn', 'Sun', { part: 'S', tSrc }).wS;
  const L0 = sp.ax, L1 = S2.tiltedNormal(sp.ax, tiltDeg);
  const Om = S2.ringRot({ Ms, Rs, spinVec: sp.vec, L: L1, r, extraW: wSun, part: 'S' }).Om, q = S2.ringRates(L1, Om, { ref: L0 });
  const eps = tiltDeg * D2R, raisePerYr = q.raiseAsYr === null ? null : q.raiseAsYr / AS_PER_RAD;
  return { key, tSrc, tiltDeg, raiseAsYr: q.raiseAsYr, raiseOverEpsPerYr: raisePerYr === null ? null : raisePerYr / eps, yard: raisePerYr === null ? null : raisePerYr / eps * DECL.tYardYr,
    omAsYr: q.omAsYr, perpAsYr: q.perpAsYr };
}

/* ───────── (iii-a) 円盤引きずりの側: 第351便j の輪(saturnRows と同じ場 —— 傾きを引数に)───────── */
/**
 * 区分 key × 読み × 傾き iDeg × 成分(既定 (MS) —— 第351便j の rotvertRows が使う列)× 順逆。
 * 戻り: { key, read, tiltDeg, part, sense, raisePerS, raiseOverEpsPerS, yard, perpPerS, magPerS, cos }
 */
export function diskRow(key, { read = 'C2', tiltDeg = 1, part = 'MS', sense = 'pro' } = {}) {
  if (!DECL.diskReads.includes(read)) throw new RangeError('diskRow: 読みは C1・C2');
  if (!(fin(tiltDeg) && tiltDeg > 0 && tiltDeg < 90)) throw new RangeError('diskRow: 0 < 傾き < 90');
  const U = DA.saturnUnits(), Wr = ruleWiiOf(), r = RB.centerKm(key) * 1e3 / U.R;
  const L = RJ.normalAt(tiltDeg, -90, sense), o = { read, s: U.sDim, r0: r, N: RJ.DECL.sat.N, Wii: Wr, Rself: DA.DECL.Rb, part };
  const Om = RJ.ringOmega(L, o), q = RJ.ringRate(L, Om, { kTilt: 1, kPrec: 0 });
  const raisePerS = q.raise / U.tU;
  return { key, read, tiltDeg, part, sense, raisePerS, raiseOverEpsPerS: q.raiseOverEps / U.tU, yard: yardOfRate(q.raiseOverEps / U.tU), perpPerS: q.perp / U.tU, magPerS: q.om / U.tU, cos: q.cos };
}
/** 第351便j の saturnRows の自分の重み(第350便g の ruleWii —— saturnRows の戻りの Wrule と同じ数) */
let WR = null;
function ruleWiiOf() { if (WR === null) WR = RJ.saturnRows().Wrule; return WR; }

/* ───────── (iii-b) 🛟 の率(第351便j の rotvertRows の main —— 器が 🛟 の正本の要点を渡す)───────── */
/** RS = 第350便g の rotvertSummary(器が読んで渡す)。戻り: { rateBook, rateNeed, yardBook, yardNeed, lambdaScale }(傾きに依らない —— 傾きの比の e 分の 1 の率) */
export function bookRow(RS) {
  const R = RJ.rotvertRows(RS, { rows: [] }), m = R.main;
  return { steps: m.steps, rateBook: m.rateBook, rateNeed: m.rateNeed, yardBook: yardOfRate(m.rateBook), yardNeed: yardOfRate(m.rateNeed), lambdaScale: R.lambdaScale };
}

/* ───────── 表 1 の 1 行(区分 × 傾き —— 6 列)───────── */
export function cellRow(T1, GEO, key, tiltDeg, book = null) {
  const a0 = axialRow(T1, GEO, key, { tSrc: 0, tiltDeg }), a1 = axialRow(T1, GEO, key, { tSrc: 1, tiltDeg });
  const d1 = diskRow(key, { read: 'C1', tiltDeg }), d2 = diskRow(key, { read: 'C2', tiltDeg });
  const y = { axRule: a0.yard, axObs: a1.yard, diskC1: d1.yard, diskC2: d2.yard, bookNeed: book ? book.yardNeed : null, bookRaw: book ? book.yardBook : null };
  /** 物差しに届くのに要る倍(1 ÷ 率 ÷ 物差し —— 負の列は向きが逆で倍では届かない → null) */
  const need = Object.fromEntries(Object.entries(y).map(([k, v]) => [k, fin(v) && v > 0 ? 1 / v : null]));
  const inYard = Object.fromEntries(Object.entries(y).map(([k, v]) => [k, fin(v) && v >= 0.1 && v <= 10]));
  return { key, tiltDeg, yard: y, need, inYard, rOverRobs: RB.centerKm(key) * 1e3 / C.radiusOf('Saturn') };
}

/* ───────── 零試験 ───────── */
export function pureScenes(T1 = E.t1Table(), GEO = E.geometry()) {
  const S = {}, A = DECL.anchor, cache = {};
  // ① 傾き 1° の (i)(ii) は第352便s の saturnRing の tilt1.satS と同じ数(区分 5 × 源の半径 2)
  S.vs352s = []; S.rule = []; S.obs = [];
  for (const key of DECL.centers) for (const t of DECL.tSrcs) {
    const a = axialRow(T1, GEO, key, { tSrc: t, tiltDeg: 1 }), b = S2.saturnRing(T1, GEO, key, { tSrc: t }, cache).tilt1.satS;
    S.vs352s.push(Math.max(rel(a.raiseAsYr, b.raiseAsYr), rel(a.yard, b.yard))); (t === 0 ? S.rule : S.obs).push(a.yard);
  }
  // ② 第352便s の比べる数: 規則の半径 1e-13 の桁・観測の半径 14〜109
  S.ruleExp = S.rule.map((y) => Math.floor(Math.log10(y))); S.obsLo = Math.min(...S.obs); S.obsHi = Math.max(...S.obs);
  // ③ (iii-a) の傾き 1°・順行は第351便j の saturnRows の (MS) の起こす率 ÷ 傾きと同じ数(区分 5 × 読み 2)
  { const sat = RJ.saturnRows(); S.vs351j = [];
    for (const key of DECL.centers) for (const read of DECL.diskReads) { const x = sat.rows.find((q) => q.key === key && q.read === read && q.sense === 'pro'), d = diskRow(key, { read, tiltDeg: 1 });
      S.vs351j.push(Math.max(rel(d.raiseOverEpsPerS, x.MS.raiseOverEpsPerS), rel(d.raisePerS, x.MS.raisePerS))); } }
  // ④ 円盤引きずりの側の輪で、(MS) の直交の成分(傾きを動かす分)は (S) の分と同じ((M) は輪の法線に平行 —— 第351便j の ⑤ と同じ見方を土星の場で)
  S.msEqS = DECL.centers.map((key) => Math.max(...DECL.diskReads.map((read) => rel(diskRow(key, { read, tiltDeg: 3, part: 'MS' }).perpPerS, diskRow(key, { read, tiltDeg: 3, part: 'S' }).perpPerS))));
  // ⑤ 小さい傾きでは 起こす率 ÷ 傾き は傾きに依らない(0.1° と 1° —— 両方の場)
  S.smallTilt = DECL.centers.map((key) => Math.max(rel(axialRow(T1, GEO, key, { tSrc: 1, tiltDeg: 0.1 }).yard, axialRow(T1, GEO, key, { tSrc: 1, tiltDeg: 1 }).yard),
    rel(diskRow(key, { read: 'C2', tiltDeg: 0.1 }).yard, diskRow(key, { read: 'C2', tiltDeg: 1 }).yard)));
  // ⑥ 共通の点検の数(統括の数え直し 3): 基準軸 L・(uV)
  S.L = CR.refAxis('L', T1, GEO); S.uV = S2.uVt(T1, GEO, 0, cache);
  // ⑦ 物差しの換算: 1/(物差しの年数)の率は 1
  S.unitYard = yardOfRate(1 / (DECL.tYardYr * PER_S_TO_PER_YR));
  // ⑧ 入力の拒否
  S.rejects = [() => axialRow(T1, GEO, 'ringB', { tSrc: 2 }), () => axialRow(T1, GEO, 'ringB', { tiltDeg: 0 }), () => diskRow('ringB', { read: 'C3' }), () => diskRow('ringB', { tiltDeg: 95 })]
    .map((fn) => { try { fn(); return false; } catch (e) { return e instanceof RangeError; } });
  return S;
}
export function pureGates(S) {
  const A = DECL.anchor;
  return {
    vs352s: S.vs352s.length === 10 && S.vs352s.every((x) => x < 1e-12),
    anchor352s: S.ruleExp.every((e) => e === A.ruleOrder) && Math.floor(S.obsLo) === A.obsLo && Math.round(S.obsHi) === A.obsHi,
    vs351j: S.vs351j.length === 10 && S.vs351j.every((x) => x < 1e-12),
    msEqS: S.msEqS.every((x) => x < 1e-9),
    smallTilt: S.smallTilt.every((x) => x < 1e-3),
    common: S.L.every((v, i) => Math.abs(v - A.L[i]) < 5e-7) && Math.abs(S.uV / A.uV - 1) < 5e-6,
    unitYard: Math.abs(S.unitYard - 1) < 1e-12,
    rejects: S.rejects.length === 4 && S.rejects.every(Boolean),
  };
}
