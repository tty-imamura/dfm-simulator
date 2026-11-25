// 第353便zb(原仮定者の回答(2026-11-25 —— 第151報)AN1045・AN1039・統括の検証項目 R492):
//   **受け手の半径を場の式に入れる置き方 (P-場)(〔第353便c〕)で、構造の係数を受け手ごとに c_R = C0 × (質量 ÷ 観測半径) と置く口 —— 診断だけ**
//   (C0 は全部の受け手に同じ 1 つの数 —— 単位 m/kg。引きずられる側の半径 = c_R × 観測半径 = C0 × 質量。C0 = Y_k〔規則の係数〕なら規則の半径の列そのもの)。
//   器 tests/exp-w353zb-massradius.mjs と QA behavior.massradius353zb・docs.massradius353zb が読む —— html を読まない・ファイルを読まない・状態を持たない。
//   後のラウンドの枝もこの口を import してよい。アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない。既存の lib は呼ぶだけ(本文は変えない):
//   第353便p(localStd・stdCancel・bg1)・第353便v(cRStarOf・stateAtR)・第353便k(axStd・diskStd・planeStd・DECL)・第353便q(topicAt・dragAz・residOf・TOPICS)・第353便c(moiOf)・第334便a(LIT334A —— 衛星の質量・半径・軌道の半径〔文献の値・未照合〕)・
//   第352便k(spinRot・srcRadius)・第352便v(allPairs・uForMin)・第348便h(YK)・第348便c(massOf・radiusOf)・第312便a(Kball)・第347便e(t1Table・geometry)。
//   **第353便v・q を import するので、仮の値の lib(第352便b)が閉包に入る —— この lib を呼ぶ段の正本は最上位に provisional: true と鍵の一覧が要る。**
//
// ■ 量: 局所 = 組の (S) の和(衛星は太陽由来 + 母天体由来 —— 〔第353便p〕の localStd と同じ作り)。uEq = abs(局所) ÷ abs(倍率 1 の背景)・x = uEq ÷ uV ——
//   uV は金星 ← 太陽を**同じ C0**(金星の c_R = C0 × 金星の質量 ÷ 金星の観測半径)で数えた等大の倍率。resEq = 等大の倍率での残り・resAtUV = 金星の条件の倍率での残り。
//   gain = abs(局所(C0)) ÷ abs(局所(規則の半径))(「規則の半径の列に対する局所の倍」)。
//   自分の重み A0 = m K1(0, C0 m) = 3 ÷ (2 C0) —— **受け手の質量に依らない**(規則の半径の列と同じ性質 —— 規則の半径では 3 ÷ (2 Y_k))。
//   頭打ちの C0(satC0)= 自分の重み = 源の重み(場の分母の源の重みの和)となる C0 = (3/2) ÷ 源の重み。
// ■ 構造の係数・C0・残りの換算の係数は決めない(1 つのノブの走査 —— イオの x = 1 は 1 点の照合)。この場・この置き方・このノブでは、の表。
import * as P from './lib-w353p-cancelstd.mjs';
import * as Vv from './lib-w353v-recvscale.mjs';
import * as Q from './lib-w353q-onek.mjs';
import * as KR from './lib-w353k-ringstd.mjs';
import * as Cc from './lib-w353c-recvradius.mjs';
import { LIT334A } from './lib-w334a-heightlaw.mjs';
import * as V from './lib-w352v-cancelmap.mjs';
import * as K from './lib-w352k-spinform.mjs';
import * as G3 from './lib-w348h-axisgeo3.mjs';
import * as C from './lib-w348c-axisbalance.mjs';
import * as D from './lib-w312a-decay.mjs';
import * as E from './lib-w347e-spintorque.mjs';

export const LIB_VERSION = 'w353zb-massradius-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const D2R = Math.PI / 180;
const { dot, crs, nrm, scl, add, sub, unit } = K.vec;
const rel = (a, b) => nrm(sub(a, b)) / Math.max(nrm(b), 1e-300);
export const YK = G3.YK;

/* ───────── 宣言 ───────── */
export const DECL = Object.freeze({
  /** 表 1 の C0 ÷ Y_k(数と、解いて決まる 2 点: 'io1' = イオの x = 1・'v2' = 金星の残り 2% の端) */
  c0Grid: Object.freeze([1, 1e2, 1e4, 1e5, 'io1', 1e6, 'v2', 1e7, 1e8]),
  pairs: V.allPairs(),
  bands: Object.freeze([[0.9, 1.1], [0.5, 2]]),
  venusBand: 0.02,
  uFocus: 0.98,
  /** 金星の条件(規則の半径・k 1)の倍率 ÷ k —— 便の始めの数え直し 3 の数 */
  uVrule: 1.192817e-12,
  /** 走査(頭打ち)の範囲 log10(C0 ÷ Y_k) */
  scanLo: 0, scanHi: 12,
  /** 便の始めの数え直し 5 の数(有効数字 3 桁 —— 「最大 1.7e6」は格子 C0 ÷ Y_k 1e7 の 1.71e6。詰めた最大は 1.76e6〔C0 ÷ Y_k 7.13e6〕) */
  anchor: Object.freeze({ io1: '5.99e+5', io1VenusRes: '0.0135', io1CRV: '4.25e-3', io1K: '1.62e+6', v2: '1.81e+6', v2CRV: '1.28e-2', v2IoX: '1.21', gain1e7V: '1.71e+6', gainMaxV: '1.76e+6',
    ruleVenusRes: '0.0133', ruleIoX: '0.894', cRVrule: '7.09e-9' }),
  main: Object.freeze({ part: 'S', tSrc: 0, read: 'C2', bg: 'Np', axis: 'L', place: '(P-場)' }),
  judge: '丸めの桁の床: 零試験は相対 1e-9(尺度の走り直しで揺れる)・表の照合は有効数字 3 桁(便の始めの数え直しの桁)',
});

const ctx = (o = {}) => ({ T1: o.T1 || CTX.T1 || (CTX.T1 = E.t1Table()), GEO: o.GEO || CTX.GEO || (CTX.GEO = E.geometry()), cache: o.cache || CTX.cache });
const CTX = { T1: null, GEO: null, cache: {} };

/* ───────── 受け手の質量と観測半径(既存の lib の口)───────── */
/** 組 key('Io|Jupiter' ほか)か受け手の名('Io')→ 受け手の名 */
export const recvOf = (key) => { if (typeof key !== 'string' || !key) throw new RangeError('recvOf: 組か受け手の名'); return key.split('|')[0]; };
/** 受け手の質量と観測半径(〔第348便c〕の massOf・radiusOf —— 〔第352便k〕の recvRadius と同じ引き方) */
export function mrOf(key) {
  const id = recvOf(key), m = C.massOf(id), R = C.radiusOf(id);
  if (!(fin(m) && m > 0 && fin(R) && R > 0)) throw new RangeError('mrOf: 質量と観測半径の無い受け手 ' + id);
  return { id, m, R };
}
/** 約束の口: 受け手ごとの構造の係数 c_R = C0 × 質量 ÷ 観測半径(C0 は m/kg) */
export function cRMass(key, C0) {
  if (!(fin(C0) && C0 > 0)) throw new RangeError('cRMass: C0 > 0');
  const { m, R } = mrOf(key); return C0 * m / R;
}

/* ───────── 局所(C0 つき)───────── */
/** 組 key の局所(C0 null = 規則の半径)。ob: 〔第353便p〕の obPlan の引数(null 球・'lit' (O2b) の σ) */
export function localMass(key, C0, { ob = null } = {}, o = {}) {
  const c = ctx(o);
  if (!(C0 === null || (fin(C0) && C0 > 0))) throw new RangeError('localMass: C0 は null か > 0');
  return P.localStd(c.T1, c.GEO, key, { ob, cR: C0 === null ? null : cRMass(key, C0) }, c.cache);
}
/** 約束の口: 規則の半径の列に対する局所の倍 gain = abs(局所(C0)) ÷ abs(局所(規則の半径)) */
export function gainOf(key, C0, { ob = null } = {}, o = {}) {
  return nrm(localMass(key, C0, { ob }, o).loc) / nrm(localMass(key, null, { ob }, o).loc);
}
/**
 * 約束の口: 組 key を C0 で(金星の側も同じ C0)。戻り値 { key, C0, ratio(C0 ÷ Y_k), cR, cRV, x, uEq, uV, resEq, resAtUV, resMin, phiDeg, cosLocBg, mode, gain, gainV, kLine }。
 * kLine = 背景 u(既定 0.98)で金星の局所を背景と等大にする残りの換算の係数 = u ÷ uV。C0 = Y_k で〔第353便p〕の stdCancel(rule)と同じ(零試験)。
 */
export function stdMass(key, C0, { ob = null, bg = 'Np', axis = 'L', u = DECL.uFocus } = {}, o = {}) {
  const c = ctx(o);
  if (!(fin(C0) && C0 > 0)) throw new RangeError('stdMass: C0 > 0');
  const Lc = localMass(key, C0, { ob }, c), Lv = localMass('Venus|Sun', C0, { ob }, c), b1 = P.bg1(c.T1, c.GEO, bg, axis), nb = nrm(b1);
  const uEq = nrm(Lc.loc) / nb, uV = nrm(Lv.loc) / nb, uMin = V.uForMin(b1, Lc.loc), cosLB = dot(unit(Lc.loc), unit(b1));
  const res = (uu) => nrm(add(scl(b1, uu), Lc.loc)) / (uu * nb);
  const phiDeg = Math.atan2(nrm(crs(scl(Lc.loc, -1), b1)), dot(scl(Lc.loc, -1), b1)) / D2R;
  return { key, C0, ratio: C0 / YK, ob, cR: cRMass(key, C0), cRV: cRMass('Venus', C0), x: uEq / uV, uEq, uV, resEq: res(uEq), resAtUV: res(uV),
    resMin: nrm(add(scl(b1, uMin), Lc.loc)) / nrm(Lc.loc), phiDeg, cosLocBg: cosLB, mode: cosLB < 0 ? 'cancel' : 'add',
    gain: gainOf(key, C0, { ob }, c), gainV: gainOf('Venus|Sun', C0, { ob }, c), kLine: u / uV };
}

/* ───────── 頭打ち ───────── */
/** 組 key の源の重み(場の分母に入る源の重みの和 —— 衛星は母天体 + 太陽〔母天体の距離〕・太陽の受け手は惑星ごとの最大) */
export function srcWeights(key, o = {}) {
  const c = ctx(o);
  if (key === V.DECL.sunRecv) {
    const ws = K.DECL.planets.map((p) => { const R = K.spinRot(c.T1, c.GEO, p, 'Sun', { part: 'M', read: 'W', nPhase: 1 }); return { p, w: C.massOf(p) * D.Kball(1, R.a, K.srcRadius(p, 0)) }; });
    const mx = ws.reduce((b, x) => (x.w > b.w ? x : b), ws[0]);
    return { main: mx.w, extra: 0, total: mx.w, by: ws, mainSrc: mx.p };
  }
  const [id, src] = key.split('|');
  if (src === 'Sun') { const w = K.spinRot(c.T1, c.GEO, id, 'Sun', { part: 'M', read: 'W', nPhase: 1 }).wS; return { main: w, extra: 0, total: w, mainSrc: 'Sun' }; }
  const sunKey = (P.DECL.pairs.includes(key) && key) ? key : null;
  if (!sunKey) throw new RangeError('srcWeights: 組 ' + key);
  const wPar = K.spinRot(c.T1, c.GEO, id, src, { part: 'M', read: 'W', tSrc: 0, nPhase: 1 }).wS;
  const host = src === 'EarthHi' || src === 'EarthLo' ? 'Earth' : src;
  const wSun = K.spinRot(c.T1, c.GEO, host, 'Sun', { part: 'M', read: 'W', tSrc: 0, nPhase: 1 }).wS;
  return { main: wPar, extra: wSun, total: wPar + wSun, mainSrc: src };
}
/** 約束の口: 頭打ちの C0(自分の重み 3 ÷ (2 C0) = 源の重み)。{ key, wSrc, wMain, c0Sat, ratioSat, c0SatMain, A0rule } */
export function satC0(key, o = {}) {
  const w = srcWeights(key, o);
  return { key, wSrc: w.total, wMain: w.main, mainSrc: w.mainSrc, c0Sat: 1.5 / w.total, ratioSat: 1.5 / w.total / YK, c0SatMain: 1.5 / w.main, A0rule: 1.5 / YK };
}
/** 局所の倍の最大(log10(C0 ÷ Y_k) を格子 0.25 で探り、黄金分割で詰める) */
export function gainMax(key, { ob = null, lo = DECL.scanLo, hi = DECL.scanHi } = {}, o = {}) {
  const c = ctx(o), g = (lr) => gainOf(key, YK * Math.pow(10, lr), { ob }, c);
  let best = lo, gb = -Infinity;
  for (let lr = lo; lr <= hi + 1e-9; lr += 0.25) { const v = g(lr); if (v > gb) { gb = v; best = lr; } }
  let a = Math.max(lo, best - 0.25), b = Math.min(hi, best + 0.25); const r = (Math.sqrt(5) - 1) / 2;
  for (let i = 0; i < 50; i++) { const m1 = b - r * (b - a), m2 = a + r * (b - a); if (g(m1) > g(m2)) b = m2; else a = m1; }
  const lr = 0.5 * (a + b);
  return { key, ratio: Math.pow(10, lr), gain: g(lr) };
}

/* ───────── 解いて決まる点(二分 —— 対数で)───────── */
function bisectLog(f, lo, hi, n = 80) { let a = lo, b = hi; const fa = f(a); for (let i = 0; i < n; i++) { const m = Math.sqrt(a * b); if ((f(m) < 0) === (fa < 0)) a = m; else b = m; } return Math.sqrt(a * b); }
/** イオ ← 木星の x = 1 になる C0 ÷ Y_k(1e4〜1e7) */
export function ioOne({ ob = null } = {}, o = {}) { const c = ctx(o); return bisectLog((r) => stdMass('Io|Jupiter', YK * r, { ob }, c).x - 1, 1e4, 1e7); }
/** 金星の等大の残りが band になる C0 ÷ Y_k(1e5〜1e7 —— 上の端) */
export function venusEdge({ ob = null, band = DECL.venusBand } = {}, o = {}) { const c = ctx(o); return bisectLog((r) => stdMass('Venus|Sun', YK * r, { ob }, c).resEq - band, 1e5, 1e7); }
/** 格子の点を数に('io1'・'v2' を解く) */
export function c0Ratio(g, { ob = null } = {}, o = {}) { if (g === 'io1') return ioOne({ ob }, o); if (g === 'v2') return venusEdge({ ob }, o); if (fin(g) && g > 0) return g; throw new RangeError('c0Ratio: 数か io1・v2'); }

/* ───────── 零試験 ───────── */
export function pureScenes(T1 = E.t1Table(), GEO = E.geometry()) {
  const o = { T1, GEO, cache: {} };
  // ① C0 = Y_k は規則の半径の列(〔第353便p〕の stdCancel(rule)・(ob)と同じ —— 17 組 × σ 2)
  const vsRule = Math.max(...DECL.pairs.flatMap((k) => [null, 'lit'].map((ob) => { const a = stdMass(k, YK, { ob }, o), b = P.stdCancel(T1, GEO, k, { place: ob === null ? 'rule' : 'ob' }, {});
    return Math.max(Math.abs(a.x / b.x - 1), Math.abs(a.resEq / b.resEq - 1), Math.abs(a.resAtUV / b.resAtUV - 1), Math.abs(a.cosLocBg - b.cosLocBg)); })));
  const gain1 = Math.max(...DECL.pairs.map((k) => Math.abs(gainOf(k, YK, {}, o) - 1)));
  // ② 金星の側: stdMass の金星は〔第353便p〕の stdCancel(field・c_R = 金星の cRMass)と同じ残り(C0 = 1e6 Y_k)
  const C6 = 1e6 * YK, mV = stdMass('Venus|Sun', C6, {}, o), pV = P.stdCancel(T1, GEO, 'Venus|Sun', { place: 'field', cR: cRMass('Venus', C6) }, {});
  const vsField = Math.max(Math.abs(mV.resEq / pV.resEq - 1), Math.abs(mV.x - 1), Math.abs(mV.phiDeg - pV.phiDeg) / Math.max(1, pV.phiDeg));
  // ③ 便の始めの数え直し 5 の数
  const io1 = ioOne({}, o), s1 = stdMass('Venus|Sun', YK * io1, {}, o), v2 = venusEdge({}, o), s2 = stdMass('Io|Jupiter', YK * v2, {}, o), gm = gainMax('Venus|Sun', {}, o);
  const rule = { venusRes: P.stdCancel(T1, GEO, 'Venus|Sun', { place: 'rule' }, {}).resEq, ioX: P.stdCancel(T1, GEO, 'Io|Jupiter', { place: 'rule' }, {}).x };
  const a5 = { io1, io1VenusRes: s1.resEq, io1CRV: s1.cRV, io1K: DECL.uFocus / DECL.uVrule / s1.gainV, v2, v2CRV: cRMass('Venus', YK * v2), v2IoX: s2.x, gain1e7V: gainOf('Venus|Sun', 1e7 * YK, {}, o), gainMaxV: gm.gain, gainMaxRatio: gm.ratio,
    ruleVenusRes: rule.venusRes, ruleIoX: rule.ioX, cRVrule: cRMass('Venus', YK) };
  // ④ 自分の重みは受け手の質量に依らない: A0 = m K1(0, C0 m) = 3 ÷ (2 C0)(金星・イオ・月・太陽・粒子の質量 1 kg)
  const A0s = ['Venus', 'Io', 'Moon', 'Sun'].map((id) => { const m = C.massOf(id); return m * D.Kball(1, 0, C6 * m); }).concat([1 * D.Kball(1, 0, C6)]);
  const vsA0 = Math.max(...A0s.map((a) => Math.abs(a / (1.5 / C6) - 1)));
  // ⑤ 頭打ちの閉じた形: 金星の satC0 で自分の重み = 源の重み(〔第352便k〕の spinRot の A0・wS —— c_R = cRMass)
  const sV = satC0('Venus|Sun', o), Rk = K.spinRot(T1, GEO, 'Venus', 'Sun', { part: 'S', cR: cRMass('Venus', sV.c0Sat) }), vsSat = Math.abs(Rk.A0 / Rk.wS - 1);
  // ⑥ 局所の倍は小さい C0 で C0 ÷ Y_k に比例(1e2 で 1e2 の 1e-3 の内 —— 金星・イオ・地球)
  const lin = ['Venus|Sun', 'Io|Jupiter', 'Earth|Sun'].map((k) => gainOf(k, 1e2 * YK, {}, o) / 1e2);
  // ⑦ cRMass の拒否
  const rejects = [() => cRMass('Venus', 0), () => cRMass('Venus', -1), () => cRMass('Titan', 1), () => stdMass('Venus|Sun', null), () => localMass('Venus|Sun', -1), () => c0Ratio('x'), () => recvOf(''), () => srcWeights('Io|Saturn', o)]
    .map((fn) => { try { fn(); return false; } catch (e) { return e instanceof RangeError; } });
  return { vsRule, gain1, vsField, a5, vsA0, vsSat, lin, rejects, anchor: DECL.anchor };
}
export function pureGates(S) {
  const A = DECL.anchor, p3 = (x) => Number(Number(x).toPrecision(3)).toString(), e3 = (x) => Number(x).toExponential(2);
  return {
    rule353p: S.vsRule < 1e-9 && S.gain1 < 1e-9,
    field353p: S.vsField < 1e-9,
    anchor5: e3(S.a5.io1) === A.io1 && p3(S.a5.io1VenusRes) === A.io1VenusRes && e3(S.a5.io1CRV) === A.io1CRV && e3(S.a5.io1K) === A.io1K && e3(S.a5.v2) === A.v2 && e3(S.a5.v2CRV) === A.v2CRV
      && p3(S.a5.v2IoX) === A.v2IoX && e3(S.a5.gain1e7V) === A.gain1e7V && e3(S.a5.gainMaxV) === A.gainMaxV && p3(S.a5.ruleVenusRes) === A.ruleVenusRes && p3(S.a5.ruleIoX) === A.ruleIoX && e3(S.a5.cRVrule) === A.cRVrule,
    selfWeight: S.vsA0 < 1e-12,
    satClosed: S.vsSat < 1e-9,
    linear: S.lin.every((g) => Math.abs(g - 1) < 1e-3),
    rejects: S.rejects.length === 8 && S.rejects.every(Boolean),
  };
}

/* ───────── 表(T2〜T5)───────── */
const inBand = (x, [lo, hi]) => x >= lo && x <= hi;
const gridRatios = (ob, o) => DECL.c0Grid.map((g) => ({ g, ratio: c0Ratio(g, { ob }, o) }));
/** 表 1: σ の有無 2 × C0 9 —— 17 組の x・金星の等大の残り・イオの x と金星の条件での残り・月の x・帯に入る組(金星を除く)・金星とイオの c_R・金星の局所の倍 */
export function table1(o = {}) {
  const c = ctx(o), cols = [];
  for (const ob of [null, 'lit']) for (const { g, ratio } of gridRatios(ob, c)) {
    const C0 = YK * ratio, st = Object.fromEntries(DECL.pairs.map((k) => [k, stdMass(k, C0, { ob }, c)]));
    const bands = DECL.bands.map((b) => { const hit = DECL.pairs.filter((k) => k !== 'Venus|Sun' && inBand(st[k].x, b)); return { band: b, n: hit.length, keys: hit }; });
    cols.push({ ob, g, ratio, cRV: cRMass('Venus', C0), cRIo: cRMass('Io', C0), venusRes: st['Venus|Sun'].resEq, gainV: st['Venus|Sun'].gainV, kLine: st['Venus|Sun'].kLine,
      x: Object.fromEntries(DECL.pairs.map((k) => [k, st[k].x])), io: { x: st['Io|Jupiter'].x, resAtUV: st['Io|Jupiter'].resAtUV, gain: st['Io|Jupiter'].gain }, moonX: st['Moon|EarthHi'].x, bands });
  }
  return { cols };
}
/** 3 つの置き方の比べ(金星の c_R を同じにそろえて): (zb) c_R = C0 m ÷ R/(p) 全部同じ c_R(〔第353便p〕の stdCancel field)/(v) c_R = r × c_R★(〔第353便v〕の stateAtR)—— イオの x・月の x・金星の残り */
export function compare3(o = {}) {
  const c = ctx(o), sV = Vv.cRStarOf('Venus', c.T1, c.GEO, c.cache).cR;
  return gridRatios(null, c).map(({ g, ratio }) => {
    const C0 = YK * ratio, cRV = cRMass('Venus', C0), r = cRV / sV;
    const zb = { io: stdMass('Io|Jupiter', C0, {}, c).x, moon: stdMass('Moon|EarthHi', C0, {}, c).x, venus: stdMass('Venus|Sun', C0, {}, c).resEq };
    const pp = (k) => P.stdCancel(c.T1, c.GEO, k, { place: 'field', cR: cRV }, c.cache);
    const p = { io: pp('Io|Jupiter').x, moon: pp('Moon|EarthHi').x, venus: pp('Venus|Sun').resEq };
    const vv = (k) => Vv.stateAtR(c.T1, c.GEO, k, r, {}, c.cache);
    const v = { io: vv('Io|Jupiter').x, moon: vv('Moon|EarthHi').x, venus: vv('Venus|Sun').venusResEq };
    return { g, ratio, cRV, r, zb, p, v };
  });
}
/** 環の粒子の受け手(〔第353便k〕の obs —— 質量 ρ(4/3)π a³・半径 c_R a)を C0 で: c_R = C0 m ÷ a(半径 = C0 m) */
export const ringRecv = (a, C0) => { const m = KR.DECL.rho * 4 / 3 * Math.PI * a * a * a; return { kind: 'obs', a, cR: C0 * m / a }; };
/** 環の率 ÷ 物差し(F1 軸引きずりの (S) の作り・F2 円盤引きずりの側の作り —— 〔第353便k〕の axStd・diskStd・源 = 規則の半径・球) */
export function ringYard(key, a, C0, frame = 'F1', o = {}) {
  const c = ctx(o), ck = ['zb|ring', key, a, C0, frame].join('|'); if (c.cache[ck] !== undefined) return c.cache[ck];
  const rv = ringRecv(a, C0), R = frame === 'F1' ? KR.axStd(c.T1, c.GEO, key, { src: 'rule', ob: 'O0', recv: rv }) : KR.diskStd(key, { src: 'rule', ob: 'O0', recv: rv });
  const v = { yard: R.yard, A0: R.A0, wS: R.wS, wSun: R.wSun === undefined ? 0 : R.wSun }; c.cache[ck] = v; return v;
}
/** 衛星(LIT334A)の頭打ちの C0(母天体の重み + 太陽の重み〔母天体の距離〕)—— 組の作りに無い衛星は閉じた形だけ */
export function satMoon(mk, o = {}) {
  const c = ctx(o), M = LIT334A.moons.find((x) => x.key === mk); if (!M) throw new RangeError('satMoon: 衛星 ' + mk);
  const host = { jupiter: 'Jupiter', saturn: 'Saturn' }[M.host], wPar = C.massOf(host) * D.Kball(1, M.a, K.srcRadius(host, 0)), wSun = K.spinRot(c.T1, c.GEO, host, 'Sun', { part: 'M', read: 'W', nPhase: 1 }).wS;
  return { key: mk, name: M.name, host, m: M.m, R: M.R, wSrc: wPar + wSun, wMain: wPar, c0Sat: 1.5 / (wPar + wSun), ratioSat: 1.5 / (wPar + wSun) / YK, mOverR: M.m / M.R };
}
/** 倍が線形の半分に落ちる C0 ÷ Y_k(gain ÷ (C0 ÷ Y_k) = 1/2 —— 頭打ちの閉じた形の候補を数で照合する点) */
export function halfPoint(key, { ob = null } = {}, o = {}) {
  const c = ctx(o); return bisectLog((r) => gainOf(key, YK * r, { ob }, c) / r - 0.5, 1e2, 1e12);
}
/** 表 2(頭打ち): 組の受け手 10(8 惑星・月・イオ)—— 頭打ちの C0(閉じた形)・半分の点・最大の倍とその C0/衛星 4(閉じた形だけ)/環の粒子 4 × 区分 3(自分の重み ÷ 源の重み・環の率の倍) */
export const T2KEYS = Object.freeze(['Mercury|Sun', 'Venus|Sun', 'Earth|Sun', 'Mars|Sun', 'Jupiter|Sun', 'Saturn|Sun', 'Uranus|Sun', 'Neptune|Sun', 'Moon|EarthHi', 'Io|Jupiter']);
export const RINGA = Object.freeze([0.01, 0.1, 1, 10]);
export const RINGS = Object.freeze(['ringC', 'ringB', 'ringA']);
export function table2(o = {}) {
  const c = ctx(o), io1 = c0Ratio('io1', {}, c), v2 = c0Ratio('v2', {}, c);
  const rows = T2KEYS.map((k) => { const s = satC0(k, c), h = halfPoint(k, {}, c), gm = gainMax(k, {}, c), mr = mrOf(k);
    return { key: k, mOverR: mr.m / mr.R, cRrule: cRMass(k, YK), wSrc: s.wSrc, wMain: s.wMain, ratioSat: s.ratioSat, half: h, halfOverSat: h / s.ratioSat, gainMax: gm.gain, gainMaxAt: gm.ratio, gainMaxOverSat: gm.gain / s.ratioSat,
      gIo1: gainOf(k, YK * io1, {}, c), gV2: gainOf(k, YK * v2, {}, c) }; });
  const moons = ['europa', 'ganymede', 'callisto', 'titan'].map((m) => satMoon(m, c));
  const rings = RINGS.map((key) => {
    const base = ringYard(key, 1, YK, 'F1', c), kRef = KR.axStd(c.T1, c.GEO, key, { src: 'rule', ob: 'O0', recv: KR.DECL.recvMain });
    const wSrc = base.wS + base.wSun, ratioSat = 1.5 / wSrc / YK;
    const cells = RINGA.map((a) => ({ a, A0overW: ringYard(key, a, YK, 'F1', c).A0 / wSrc, A0overWio1: ringYard(key, a, YK * io1, 'F1', c).A0 / wSrc,
      kA0overW: KR.recvOf({ kind: 'obs', a, cR: 1 }).A0 / (kRef.wS + kRef.wSun), g: [1e2, io1, v2, 1e7].map((r) => ringYard(key, a, YK * r, 'F1', c).yard / ringYard(key, a, YK, 'F1', c).yard) }));
    return { key, wSrc, ratioSat, yardRule: base.yard, yardK: kRef.yard, cells };
  });
  return { io1, v2, rows, moons, rings };
}
/** 表 3(題 × (C0, 残りの換算の係数 k)の線): k(C0) = 0.98 ÷ uV(C0)。題の値 ÷ 物差し(〔第353便q〕の題 —— 局所の大きさの冪 pow の題は、規則の半径の組の値 × (gain_受け手 ÷ gain_金星)^pow で写す。
 *  土星の環・公転面の集まり・歳差の率は、受け手の c_R を C0 で置いて直に数える) */
export function table3(o = {}) {
  const c = ctx(o), pts = gridRatios(null, c), b98 = DECL.uFocus;
  const rule = Object.fromEntries(Q.TOPICS.map((t) => [t.id, Q.topicAt(t.id, 'rule', {}, c)]));
  const recvOfTopic = { io: 'Io|Jupiter', moon: 'Moon|EarthHi', mercury: 'Mercury|Sun', tilt: 'Earth|Sun', ioHeat: 'Io|Jupiter', ioLock: 'Io|Jupiter' };
  const R0 = Q.residOf(c);
  const cols = pts.map(({ g, ratio }) => {
    const C0 = YK * ratio, sv = stdMass('Venus|Sun', C0, {}, c), k = sv.kLine, gV = sv.gainV, cells = {};
    for (const t of Q.TOPICS) {
      let v;
      if (t.id === 'ringAx' || t.id === 'ringDisk') v = k * ringYard(Q.DECL.ringMain, Q.DECL.particleA, C0, t.id === 'ringAx' ? 'F1' : 'F2', c).yard;
      else if (t.id === 'plane') v = k * KR.planeStd(c.T1, c.GEO, 'Earth', { src: 'rule', ob: 'O0', recv: { cR: cRMass('Earth', C0) } }).v;
      else if (t.id === 'precEarth' || t.id === 'precMars') { const id = t.id === 'precEarth' ? 'Earth' : 'Mars', set = { id: 'zb-' + id + '-' + ratio, place: 'field', cR: cRMass(id, C0), sig: false };
        v = Q.dragAz(id, set, { u: b98, k }, c) / R0[id]; }
      else v = rule[t.id].v * Math.pow(gainOf(recvOfTopic[t.id], C0, {}, c) / gV, t.pow);
      cells[t.id] = { v, inBand: Math.abs(v) >= Q.DECL.band.lo && Math.abs(v) <= Q.DECL.band.hi };
    }
    return { g, ratio, k, gainV: gV, venusRes: sv.resEq, cells };
  });
  const moves = Q.TOPICS.map((t) => { const vs = cols.map((x) => Math.abs(x.cells[t.id].v)); return { topic: t.id, pow: t.pow, spanDec: Math.log10(Math.max(...vs) / Math.min(...vs)), first: cols[0].cells[t.id].v, ruleQ: rule[t.id].v }; });
  return { cols, moves, provKeys: R0.provKeys };
}
/** 表 4(係数の読み): 受け手ごとの c_R(C0 = Y_k・イオの x = 1 の C0)・引きずられる側の半径 ÷ 観測半径・慣性モーメントの係数(〔第353便c〕の moiOf —— 文献の値・未照合)・順位の相関 */
export const T4IDS = Object.freeze(['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Moon', 'Io', 'Europa', 'Ganymede', 'Callisto', 'Pluto', 'Charon', 'Sun']);
export function table4(o = {}) {
  const c = ctx(o), io1 = c0Ratio('io1', {}, c);
  const rows = T4IDS.map((id) => { const mr = mrOf(id), moi = Cc.moiOf(id); return { id, m: mr.m, R: mr.R, mOverR: mr.m / mr.R, cRrule: cRMass(id, YK), cRio1: cRMass(id, YK * io1), Rdrag: YK * io1 * mr.m, moi }; });
  const parts = RINGA.map((a) => { const rv = ringRecv(a, YK * io1); return { a, cRrule: ringRecv(a, YK).cR, cRio1: rv.cR }; });
  const w = rows.filter((x) => x.moi !== null && x.moi !== undefined), rank = (f) => { const s = [...w].sort((a, b) => f(a) - f(b)).map((x) => x.id); return Object.fromEntries(s.map((id, i) => [id, i + 1])); };
  const rA = rank((x) => x.mOverR), rB = rank((x) => x.moi), n = w.length, d2 = w.reduce((s, x) => s + (rA[x.id] - rB[x.id]) ** 2, 0);
  return { io1, rows: rows.map((x) => ({ ...x, rankMR: rA[x.id] || null, rankMoi: rB[x.id] || null })), parts, n, rho: 1 - 6 * d2 / (n * (n * n - 1)),
    spanDec: Math.log10(Math.max(...rows.map((x) => x.mOverR)) / Math.min(...rows.map((x) => x.mOverR))) };
}
