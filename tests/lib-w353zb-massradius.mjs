// 第353便zb(原仮定者の回答(2026-11-25 —— 第151報)AN1045・AN1039・統括の検証項目 R492):
//   **受け手の半径を場の式に入れる置き方 (P-場)(〔第353便c〕)で、構造の係数を受け手ごとに c_R = C0 × (質量 ÷ 観測半径) と置く口 —— 診断だけ**
//   (C0 は全部の受け手に同じ 1 つの数 —— 単位 m/kg。引きずられる側の半径 = c_R × 観測半径 = C0 × 質量。C0 = Y_k〔規則の係数〕なら規則の半径の列そのもの)。
//   器 tests/exp-w353zb-massradius.mjs と QA behavior.massradius353zb・docs.massradius353zb が読む —— html を読まない・ファイルを読まない・状態を持たない。
//   後のラウンドの枝もこの口を import してよい。アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない。既存の lib は呼ぶだけ(本文は変えない):
//   第353便p(localStd・stdCancel・bg1・obPlan)・第353便v(cRStarOf・cROf・stateAtR)・第353便k(axStd・recvOf)・第353便q(topicAt・kVenus・dragAz・residOf・TOPICS)・
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
