// 第351便e(原仮定者の回答(2026-11-24 —— 第147報)「AN1009: B2で進める」・統括の検証項目 R431):
//   **背景軸引きずり (B2) を主に置いた全体の軸引きずりの回転 Ω = Ω_bg + Σ(局所の項 × k) —— 背景の入り方 (B2)(主)・(B1)(比べる列)・局所の分母の列 in/out・
//   合成の向き・自転軸とのなす角 δ・公転の北極を基準の起こす率の和と由来ごとの内訳・歳差の率・「釣り合う」の 3 つの読み (甲)(乙)(丙) の閉じた形・
//   2 本のベクトルの和が向ける範囲(向きの幾何)の純関数 —— 診断だけ**
//   (器 tests/exp-w351e-bgbalance.mjs と QA behavior.bgbalance351e・docs.bgbalance351e が読む —— html を読まない・ファイルを読まない・状態を持たない)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない(AN712 —— エンジンへ足す操作ではない)。背景軸引きずりの鍵はアプリに足さない。
//   既存の lib は呼ぶだけ(本文は変えない): 本便の枝 c(partRot・pairParts・pairInput・bgOm・perpOf・cosTo・raiseRate・PAIRS16)・本便の枝 d(eqAxis・r3Coeffs・r3Step)・
//   本便の枝 b(applyK —— 局所だけに k を掛ける掛け先の照合と、二度数えの検査)・第350便e(uVec・UDECL —— 一様な背景の角速度)。
//
// ■ 背景軸引きずり (B2)(主): 一様な背景の角速度 Ω_bg = 第350便e の uVec(ω_G × u, 'rd0', m, 向き)(受け手の係数なし)。並進の背景の重み W₀ を掛けない・換算の係数 k を掛けない。
//   向き −1(銀河の回転と逆向き)が主・+1 は比べる列。倍率 u は宣言の格子(0・1・10・100・1e3・1e4)—— 比べる数から逆算した値を既定にしない。
// ■ (B1)(比べる列 —— 第350便e の inclRows の読み): Ω_bg × (1 − f)・f = 箱の中の重みの取り分 =(自分 + 太陽 + 母天体)÷(W₀ + 自分 + 太陽 + 母天体)。在位の形(W₀ = 0)では 0。
// ■ 局所の項(本便の枝 c の pairParts): 太陽由来 + 母天体由来(衛星・冥王星–カロン)の成分 (M)(S)(MS)。読み (C2)(主)・(W)。分母の列 out(主の列は決めない —— 決断事項の候補)・in。
// ■ 起こす率(本便で共通の定義): ε = acos(ŝ·n̂)・起こす率 = −dε/dt = (dŝ/dt · n̂) ÷ sin ε(正 = 傾きが減る)。経路 ① だけ・係数 1(dŝ/dt = Ω⊥)。由来ごとの和に分ける(線形)。
// ■ 「釣り合う」の 3 つの読み(列で分ける —— 1 つに決めない):
//   (甲) 起こす率の和が 0: 背景の起こす率は u に比例するので u* = −(局所の起こす率)÷(背景〔u 1〕の起こす率)—— u* > 0 のときだけ(符号が同じなら「解なし」)。
//   (乙) 自転軸が合成の向きにそろう(δ = 0 —— 経路 ① の行き先): 合成の向き L + u b(u ≥ 0)の弧と ŝ の最小の角(閉じた形 —— u = 0・停留点・u → ∞ の 3 候補)。
//   (丙) 太陽由来と背景の大きさが同じ: u = abs(太陽由来) ÷ abs(背景〔u 1〕)。
// ■ 言わないこと: 釣り合いの成否・予想の成否・背景の大きさの答えとは書かない(この成分・この読み・この倍率では、の表)。観測の値は固定の比べる列(合わせない)。
import * as SP from './lib-w351c-srcparts.mjs';
import * as R3 from './lib-w351d-r3step.mjs';
import * as CB from './lib-w351b-c2main.mjs';
import * as BG from './lib-w350e-bgaxial.mjs';
import * as E from './lib-w347e-spintorque.mjs';

export const LIB_VERSION = 'w351e-bgbalance-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const D2R = Math.PI / 180;

/* ───────── 宣言 ───────── */
export const DECL = Object.freeze({
  /** 背景の倍率 u(銀河の公転の角速度 ω_G の倍 —— 宣言の格子) */
  uGrid: Object.freeze([0, 1, 10, 100, 1e3, 1e4]),
  signs: Object.freeze([-1, 1]), mainSign: -1,
  reads: Object.freeze(['C2', 'W']), mainRead: 'C2',
  dens: Object.freeze(['out', 'in']), mainDenCol: 'out',
  incls: Object.freeze(['B2', 'B1']), mainIncl: 'B2',
  /** (B1) の表の W₀ ÷ 自分の重みの中心の値(0 = 在位の形) */
  w0kGrid: Object.freeze([0, 1]),
  parts: SP.DECL.parts,
  /** 起こす率を書く傾きの床(同期の宣言の組は書かない —— 本便の枝 c の表と同じ) */
  sinTable: 1e-6,
  /** (R3) の步(本便の枝 d の r3Step —— 無次元の時間: Ω を abs(Ω) で割る) */
  fShow: Object.freeze([0, 0.5, 1]), norm: 'N1', stepT: 10, stepDt: 0.05,
  stepBodies: Object.freeze([['Earth', 'Sun'], ['Venus', 'Sun']]),
  planets: Object.freeze(['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune']),
  /** 〔第337便c〕の目標の分類(原仮定者の補足(2026-11-14 —— 第138報の補足 2)の読み —— 比べる列) */
  class337c: Object.freeze({ Mercury: '太陽', Venus: '釣り合い', Earth: '銀河', Mars: '銀河', Jupiter: '銀河' }),
  degenerate: R3.DECL.degenerate,
  judge: '丸めの桁の床: 打ち消しで 0 になる量は尺度の 1e-12 倍以下を 0 と書く・角は 1e-9° 以下を 0 と書く',
});

/* ───────── 小さな道具 ───────── */
const { dot, crs, nrm, scl, add, sub, unit } = R3.vec;
const isVec = (a) => Array.isArray(a) && a.length === 3 && a.every(fin);
const rel = (a, b) => nrm(sub(a, b)) / Math.max(nrm(b), 1e-300);
export const angDeg = R3.angDeg;
const sumV = (vs) => vs.reduce((t, v) => add(t, v), [0, 0, 0]);

/* ───────── 局所の項(本便の枝 c の口を包む —— 同じ組を 1 回だけ作る)───────── */
/** 組の入力(ŝ・n̂)と局所の項 {sun:{M,S,MS}, parent|null, wSun, wPar, wGal}(読み・分母の列・k)。cache は { key → pairParts の戻り値 } */
export function localOf(T1, GEO, id, src, { read = 'C2', den = 'out', k = 1 } = {}, cache = null) {
  const key = [id, src, read, den, k].join('|');
  if (cache && cache[key]) return cache[key];
  const pp = SP.pairParts(T1, GEO, id, src, { read, den, k }), P = SP.pairInput(T1, GEO, id, src);
  const v = { ...pp, sHat: P.sHat, nHat: P.nHat, m: P.m };
  if (cache) cache[key] = v;
  return v;
}
/** 自分の重みの中心の値(規則の半径 —— 本便の枝 c の partRot の A0 と同じ) */
export function selfA0(T1, GEO, id, src) { return SP.partRot(T1, GEO, id, src, { part: 'M', read: 'W', nPhase: 1 }).A0; }

/* ───────── 背景の項 ───────── */
/**
 * 背景の項のベクトル(rad/s)。incl 'B2'(主)= 本便の枝 c の bgOm(= 第350便e の uVec(ω_G × u, 'rd0', m, 向き))—— W₀ と k に依らない。
 * incl 'B1' = (1 − f) × 同じベクトル・f = box ÷ (W₀ + box)(box = 自分 + 太陽 + 母天体の重みの中心の値・W₀ = w0k × A0)。
 */
export function bgTerm(id, { u = 1, sign = DECL.mainSign, incl = DECL.mainIncl, w0k = 0, A0 = null, box = null } = {}) {
  if (!(fin(u) && u >= 0)) throw new RangeError('bgTerm: 倍率 u ≥ 0');
  if (!DECL.incls.includes(incl)) throw new RangeError('bgTerm: 入り方は B2・B1');
  const b = SP.bgOm(id, { mult: u, sign });
  if (incl === 'B2') return { vec: b, coef: 1 };
  if (!(fin(w0k) && w0k >= 0 && fin(A0) && A0 > 0 && fin(box) && box > 0)) throw new RangeError('bgTerm: (B1) は w0k ≥ 0・A0 > 0・box > 0');
  const f = box / (w0k * A0 + box), coef = 1 - f;
  return { vec: scl(b, coef), coef };
}

/* ───────── 全体の Ω ───────── */
/**
 * 全体の軸引きずりの回転 Ω = Ω_bg + Σ(局所の項 × k)(rad/s)。局所 = 太陽由来 + 母天体由来の成分 part。k は局所だけ(本便の枝 c の pairParts の口)・背景には掛けない。
 * 戻り値 { Om, bg, sun, parent, terms, eq(合成の向き —— 本便の枝 d の eqAxis・ほぼ 0 なら null), sHat, nHat, coef, local }
 */
export function totalOm(T1, GEO, { id, src, part = 'MS', read = DECL.mainRead, den = DECL.mainDenCol, k = 1, u = 1, sign = DECL.mainSign, incl = DECL.mainIncl, w0k = 0 } = {}, cache = null) {
  if (!DECL.parts.includes(part)) throw new RangeError('totalOm: 成分は M・S・MS');
  if (!(fin(k) && k >= 0)) throw new RangeError('totalOm: 換算の係数 k ≥ 0');
  const L = localOf(T1, GEO, id, src, { read, den, k }, cache);
  let A0 = null, box = null;
  if (incl === 'B1') { A0 = selfA0(T1, GEO, id, src); box = A0 + L.wSun + L.wPar; }
  const B = bgTerm(id, { u, sign, incl, w0k, A0, box });
  const sun = L.sun[part], parent = L.parent ? L.parent[part] : null, terms = [B.vec, sun].concat(parent ? [parent] : []);
  const local = parent ? add(sun, parent) : sun.slice(), Om = add(B.vec, local);
  return { Om, bg: B.vec, sun, parent, local, terms, eq: R3.eqAxis(terms), sHat: L.sHat, nHat: L.nHat, coef: B.coef, A0, box };
}

/* ───────── 率と向き ───────── */
/** 起こす率(経路 ① 係数 1・rad/s)—— 傾きが床より小さい(同期の宣言の組)なら null */
export function raiseOf(sHat, nHat, v) {
  const c = Math.max(-1, Math.min(1, dot(unit(sHat), unit(nHat))));
  return Math.sqrt(1 - c * c) < DECL.sinTable ? null : SP.raiseRate(sHat, nHat, SP.perpOf(sHat, v));
}
/** 1 行の統計: 由来ごとの起こす率と和・合成の向きとのなす角 δ・歳差の率(経路 ② 係数 1 —— abs(Ω) と、δ を円錐の半頂角にした ŝ の速さ abs(Ω) sin δ)(rad/s) */
export function rowStats(R) {
  const rb = raiseOf(R.sHat, R.nHat, R.bg), rs = raiseOf(R.sHat, R.nHat, R.sun), rp = R.parent ? raiseOf(R.sHat, R.nHat, R.parent) : null, rt = raiseOf(R.sHat, R.nHat, R.Om);
  const d = R.eq ? angDeg(R.sHat, R.eq) : null, mag = nrm(R.Om);
  return { raiseBg: rb, raiseSun: rs, raiseParent: rp, raiseSum: rt, deltaDeg: d === null ? null : (d <= 1e-9 ? 0 : d), precMag: mag, precCone: d === null ? null : mag * Math.sin(d * D2R), cosOm: SP.cosTo(R.sHat, R.Om) };
}

/* ───────── 「釣り合う」の 3 つの読み ───────── */
/** (甲) 起こす率の和が 0 になる背景の倍率: u* = −rl ÷ rb(rb = 背景 u 1 の起こす率・rl = 局所の起こす率)。u* > 0 のときだけ・符号が同じなら null(解なし) */
export function uStarRaise(rb, rl) {
  if (!(fin(rb) && fin(rl)) || rb === 0) return null;
  const u = -rl / rb; return u > 0 ? u : null;
}
/**
 * (乙) 合成の向き v(u) = L + u b(u ≥ 0)と ŝ のなす角の最小(閉じた形)。d/du cos δ = 0 は u について 1 次: u₀ = (sL·Lb − sb·LL) ÷ (sb·Lb − sL·bb)。
 * 候補 u = 0・u₀(> 0 のとき)・u → ∞(b の向き)の中の最小。戻り値 { uBest(数・Infinity), deltaMinDeg, delta0Deg, deltaInfDeg, u0 }
 */
export function deltaMin(sHat, L, b) {
  if (!(isVec(sHat) && isVec(L) && isVec(b))) throw new RangeError('deltaMin: ベクトル');
  const s = unit(sHat), sL = dot(s, L), sb = dot(s, b), LL = dot(L, L), Lb = dot(L, b), bb = dot(b, b);
  const at = (u) => { const v = add(L, scl(b, u)); return nrm(v) > 0 ? angDeg(s, v) : null; };
  const den = sb * Lb - sL * bb, u0 = den !== 0 ? (sL * Lb - sb * LL) / den : null;
  const cand = [];
  if (LL > 0) cand.push([0, at(0)]);
  if (u0 !== null && u0 > 0 && fin(u0)) cand.push([u0, at(u0)]);
  if (bb > 0) cand.push([Infinity, angDeg(s, b)]);
  const ok = cand.filter((c) => c[1] !== null);
  if (!ok.length) return { uBest: null, deltaMinDeg: null, delta0Deg: null, deltaInfDeg: null, u0 };
  const best = ok.reduce((x, y) => (y[1] < x[1] ? y : x));
  return { uBest: best[0], deltaMinDeg: best[1] <= 1e-9 ? 0 : best[1], delta0Deg: LL > 0 ? at(0) : null, deltaInfDeg: bb > 0 ? angDeg(s, b) : null, u0 };
}
/** (丙) 太陽由来と背景の大きさが同じになる倍率 u = abs(太陽由来) ÷ abs(背景 u 1) */
export function uEqMag(sun, b1) { const m = nrm(b1); return m > 0 ? nrm(sun) / m : null; }

/* ───────── 向きの幾何(T5)───────── */
/**
 * 2 本のベクトル a・b の非負の和が向ける向き = â と b̂ を結ぶ大円の短い弧。公転の北極 n̂ からの角の範囲 [θmin, θmax] を閉じた形で:
 * p(t) = â cos t + ê sin t(t ∈ [0, γ]・γ = ∠(â, b̂))・n̂·p = A cos t + B sin t → 最大は t* = atan2(B, A)(弧の内なら)・最小は t* + π(弧の内なら)か端。
 */
export function arcRange(nHat, a, b) {
  if (!(isVec(nHat) && isVec(a) && isVec(b) && nrm(a) > 0 && nrm(b) > 0)) throw new RangeError('arcRange: ベクトル');
  const n = unit(nHat), ah = unit(a), bh = unit(b), g = angDeg(ah, bh) * D2R, eRaw = sub(bh, scl(ah, dot(ah, bh)));
  const ends = [angDeg(n, ah), angDeg(n, bh)];
  if (nrm(eRaw) < 1e-15) return { minDeg: Math.min(...ends), maxDeg: Math.max(...ends), gammaDeg: g / D2R, endsDeg: ends };
  const e = unit(eRaw), A = dot(n, ah), B = dot(n, e), ts = [Math.atan2(B, A), Math.atan2(B, A) + Math.PI, Math.atan2(B, A) - Math.PI].filter((t) => t > 0 && t < g);
  const angs = ends.concat(ts.map((t) => Math.acos(Math.max(-1, Math.min(1, A * Math.cos(t) + B * Math.sin(t)))) / D2R));
  return { minDeg: Math.min(...angs), maxDeg: Math.max(...angs), gammaDeg: g / D2R, endsDeg: ends };
}
/** ŝ が 2 本のベクトルの張る面からどれだけ外れているか(°)= asin(abs(ŝ·(â × b̂)) ÷ abs(â × b̂)) */
export function planeOffDeg(sHat, a, b) { const c = crs(unit(a), unit(b)), m = nrm(c); return m > 0 ? Math.asin(Math.min(1, Math.abs(dot(unit(sHat), c)) / m)) / D2R : null; }
/** ŝ と弧(â → b̂)の最小の角(°)—— 弧の内の最も近い点か端(幾何で —— (乙) の閉じた形の照合に使う) */
export function arcDistDeg(sHat, a, b) {
  const s = unit(sHat), ah = unit(a), bh = unit(b), g = angDeg(ah, bh) * D2R, eRaw = sub(bh, scl(ah, dot(ah, bh)));
  const ends = [angDeg(s, ah), angDeg(s, bh)];
  if (nrm(eRaw) < 1e-15) return Math.min(...ends);
  const e = unit(eRaw), t = Math.atan2(dot(s, e), dot(s, ah));
  return t > 0 && t < g ? Math.min(...ends, angDeg(s, add(scl(ah, Math.cos(t)), scl(e, Math.sin(t))))) : Math.min(...ends);
}

/* ───────── (R3) の步(T7)───────── */
/** 全体の Ω を abs(Ω) で割った無次元の步(本便の枝 d の r3Step・(N1))。傾き ε の始めと終わり・合成の向きとのなす角・歳差の率(無次元)を返す */
export function stepRun(sHat, nHat, Om, f, { T = DECL.stepT, dt = DECL.stepDt, norm = DECL.norm } = {}) {
  const m = nrm(Om); if (!(m > 0)) return null;
  const om = scl(Om, 1 / m), c = R3.r3Coeffs(f, norm), R = R3.r3Step({ s0: unit(sHat), om, T, dt, kTilt: c.kTilt, kPrec: c.kPrec, integ: 'mid' });
  const eps = (s) => angDeg(s, nHat);
  return { f, kTilt: c.kTilt, kPrec: c.kPrec, eps0Deg: eps(sHat), epsEndDeg: eps(R.sEnd), dEpsDeg: eps(R.sEnd) - eps(sHat), th0Deg: R.th0Deg, thEndDeg: R.thEndDeg, precRate: R.precRate, lenErr: R.lenErr };
}

/* ───────── 零試験 ───────── */
export function pureScenes(T1 = E.t1Table(), GEO = E.geometry()) {
  const cache = {};
  // ① (B2): W₀ を変えても背景の項は不変・(B1) は在位の形(W₀ 0)で 0・W₀ = A0 で 0 と 1 の間
  const A0 = selfA0(T1, GEO, 'Earth', 'Sun'), Le = localOf(T1, GEO, 'Earth', 'Sun', {}, cache), box = A0 + Le.wSun + Le.wPar;
  const b2a = bgTerm('Earth', { u: 10, incl: 'B2', w0k: 0 }).vec, b2b = bgTerm('Earth', { u: 10, incl: 'B2', w0k: 1 }).vec;
  const b1z = bgTerm('Earth', { u: 10, incl: 'B1', w0k: 0, A0, box }), b1o = bgTerm('Earth', { u: 10, incl: 'B1', w0k: 1, A0, box });
  const tB1 = totalOm(T1, GEO, { id: 'Earth', src: 'Sun', u: 10, incl: 'B1', w0k: 0 }, cache);
  const incl = { b2same: rel(b2a, b2b), b1zero: nrm(b1z.vec), b1coef: b1o.coef, b1total: rel(tB1.Om, tB1.local) };
  // ② 背景の項 = 第350便e の uVec(ω_G × u, 'rd0', m, 向き)・本便の枝 b の bgB2 と同じ
  const vsU = Math.max(rel(bgTerm('Mars', { u: 100, sign: -1 }).vec, BG.uVec(BG.UDECL.omegaGalRadS * 100, 'rd0', 1, -1)), rel(bgTerm('Mars', { u: 100, sign: 1 }).vec, CB.bgB2('Mars', 100, 1)));
  // ③ k は局所だけ: k 2 で局所が 2 倍・背景は同じビット/本便の枝 b の applyK と同じ合計
  const t1 = totalOm(T1, GEO, { id: 'Moon', src: 'EarthHi', u: 10, k: 1 }, cache), t2 = totalOm(T1, GEO, { id: 'Moon', src: 'EarthHi', u: 10, k: 2 }, cache);
  const ak = CB.applyK({ local: [t1.sun, t1.parent], bg: t1.bg, k: 2 });
  const kk = { local: rel(t2.local, scl(t1.local, 2)), bg: rel(t2.bg, t1.bg), vsApplyK: rel(t2.Om, ak.total) };
  // ④ u 0 と k 0 で「向きは決まらない」(eqAxis が null)・u 0 だけでは決まる
  const z = totalOm(T1, GEO, { id: 'Earth', src: 'Sun', u: 0, k: 0 }, cache), z1 = totalOm(T1, GEO, { id: 'Earth', src: 'Sun', u: 0, k: 1 }, cache);
  const undet = { zero: z.eq === null && nrm(z.Om) === 0, uOnly: z1.eq !== null };
  // ⑤ 二度数え: 一様な背景を局所の入力にも入れると合計が 2 倍(本便の枝 b の applyK)—— 本 lib の totalOm は背景を局所に入れない(局所 = 太陽 + 母天体だけ)
  const bE = bgTerm('Earth', { u: 1 }).vec, dbl = CB.applyK({ local: [bE], bg: bE, k: 1 }), tE = totalOm(T1, GEO, { id: 'Earth', src: 'Sun', u: 1 }, cache);
  const twice = { doubled: rel(dbl.total, scl(bE, 2)), once: rel(sub(tE.Om, tE.local), bE), terms: tE.terms.length };
  // ⑥ 起こす率は線形(由来ごとの和 = 合計の率)
  const st = rowStats(totalOm(T1, GEO, { id: 'Moon', src: 'EarthHi', u: 100 }, cache)), lin = Math.abs(st.raiseBg + st.raiseSun + st.raiseParent - st.raiseSum) / (Math.abs(st.raiseBg) + Math.abs(st.raiseSun) + Math.abs(st.raiseParent));
  // ⑦ (甲) u* で起こす率の和が 0(火星・(S))・符号が同じなら解なし
  const rM = rowStats(totalOm(T1, GEO, { id: 'Mars', src: 'Sun', part: 'S', u: 1 }, cache)), us = uStarRaise(rM.raiseBg, rM.raiseSun);
  const rMs = us === null ? null : rowStats(totalOm(T1, GEO, { id: 'Mars', src: 'Sun', part: 'S', u: us }, cache));
  const ko = { back: rMs === null ? null : Math.abs(rMs.raiseSum) / Math.abs(rM.raiseSun), none: uStarRaise(1, 2) === null && uStarRaise(0, 1) === null && uStarRaise(-1, 2) === 2 };
  // ⑧ (乙) 閉じた形の最小 = 弧と ŝ の最小の角(幾何)・格子の走査は最小を下回らない(8 惑星 × 成分 3)
  let otsu = 0, scan = Infinity;
  for (const id of DECL.planets) for (const part of DECL.parts) {
    const R = totalOm(T1, GEO, { id, src: 'Sun', part, u: 0 }, cache), b = bgTerm(id, { u: 1 }).vec, D = deltaMin(R.sHat, R.local, b);
    otsu = Math.max(otsu, Math.abs(D.deltaMinDeg - arcDistDeg(R.sHat, R.local, b)));
    for (let j = -16; j <= 20; j++) { const u = Math.pow(10, j / 2) * (nrm(R.local) / nrm(b)); scan = Math.min(scan, angDeg(R.sHat, add(R.local, scl(b, u))) - D.deltaMinDeg); }
  }
  // ⑨ 向きの幾何: 共面の例(n̂ = ẑ・a 60°・b 180°)で範囲 [60, 180]・a 0°・b 60° で [0, 60]・面から外れる角
  const n = [0, 0, 1], a60 = [Math.sin(60 * D2R), 0, Math.cos(60 * D2R)], ar1 = arcRange(n, a60, [0, 0, -1]), ar2 = arcRange(n, [0, 0, 1], a60), off = planeOffDeg([0, 1, 0], a60, [0, 0, 1]);
  const geo = { r1: [ar1.minDeg, ar1.maxDeg], r2: [ar2.minDeg, ar2.maxDeg], off, ar3: arcRange(n, [1, 0, 0.2], [-1, 0.01, 0.2]) };
  // ⑩ eqAxis は本便の枝 d と第350便e の composeBal と同じ向き
  const RE = totalOm(T1, GEO, { id: 'Earth', src: 'Sun', u: 100 }, cache), cbE = BG.composeBal(RE.terms), eqSame = rel(RE.eq, cbE.e);
  // ⑪ 第350便までの共通の点検の数(自転しない源の通過)
  const common = BG.commonChecks();
  // ⑫ 拒否
  const rej = [() => totalOm(T1, GEO, { id: 'Earth', src: 'Sun', part: 'X' }), () => totalOm(T1, GEO, { id: 'Earth', src: 'Sun', k: -1 }), () => bgTerm('Earth', { u: -1 }), () => bgTerm('Earth', { incl: 'B3' }),
    () => bgTerm('Earth', { incl: 'B1', w0k: 0 }), () => deltaMin([1, 0], [1, 0, 0], [0, 1, 0]), () => arcRange([0, 0, 1], [0, 0, 0], [1, 0, 0])]
    .map((fn) => { try { fn(); return false; } catch (e) { return e instanceof RangeError; } });
  return { incl, vsU, kk, undet, twice, lin, ko, otsu, scan, geo, eqSame, common, rejects: rej };
}
export function pureGates(S) {
  const c = S.common, W = BG.COMMON_WANT, nearA = (x, y) => Math.abs(x[0] - y[0]) < 1e-9 && Math.abs(x[1] - y[1]) < 1e-9;
  return {
    inclB2: S.incl.b2same < 1e-12 && S.incl.b1zero < 1e-30 && S.incl.b1coef > 0 && S.incl.b1coef < 1 && S.incl.b1total < 1e-12,
    bgIsU: S.vsU < 1e-12,
    kLocalOnly: S.kk.local < 1e-12 && S.kk.bg < 1e-12 && S.kk.vsApplyK < 1e-12,
    undetermined: S.undet.zero && S.undet.uOnly,
    doubleCount: S.twice.doubled < 1e-12 && S.twice.once < 1e-12 && S.twice.terms === 2,
    raiseLinear: S.lin < 1e-12,
    uStar: S.ko.back !== null && S.ko.back < 1e-9 && S.ko.none,
    deltaMin: S.otsu < 1e-6 && S.scan > -1e-9,
    arcGeo: nearA(S.geo.r1, [60, 180]) && nearA(S.geo.r2, [0, 60]) && Math.abs(S.geo.off - 90) < 1e-9 && S.geo.ar3.minDeg < S.geo.ar3.maxDeg,
    eqAxis: S.eqSame < 1e-15,
    common350: Math.abs(c.diaXz - W.diaXz) < W.tol && Math.abs(c.sixZ - W.sixZ) < W.tol && Math.abs(c.rotWz - W.rotWz) < W.tol,
    rejects: S.rejects.length === 7 && S.rejects.every(Boolean),
  };
}
