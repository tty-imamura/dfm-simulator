// 第353便s(原仮定者の回答(2026-11-25 —— 第151報)AN1045「規則の半径」・統括の検証項目 R483):
//   **源(引きずる側)の半径を、規則の半径と観測の半径の間で振る(第352便k の srcRadius の t —— R_源 = R_規則^(1 − t) × R_観測^t)——
//   土星の環・0.98 の金星・イオ・地球の項の 4 つの題で「題の量が 1 になる t」を並べる口 —— 診断だけ**
//   (器 tests/exp-w353s-srcinterp.mjs と QA behavior.srcinterp353s・docs.srcinterp353s が読む —— html を読まない・ファイルを読まない・状態を持たない。
//   後のラウンドの枝もこの口を import してよい)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない。既存の lib は呼ぶだけ(本文と版は変えない):
//   第353便k(diskStd・recvOf・DECL —— 回答の基準の輪の場)・第353便d(obCancel・obSatParts・obRot・litOf)・第353便l(earthPart・venusRes・ratioOf・pointRotR・synGeom)・
//   第353便j(kFor)・第352便k(spinRot・srcRadius)・第352便s(uVt・bgOf・saturnSpin)・第352便c(refAxis)・第353便h(yardOfRate)・第351便j(ringBasis・normalAt・ringRate)・
//   第351便c(pairInput)・第348便h(rot3・YK)・第348便d(saturnUnits・DECL)・第348便c(massOf・radiusOf)・第338便d(centerKm・srcOf)・第312便a(Kball)・第347便e(t1Table・geometry)。
//   **第353便j・l の lib を import するので、仮の値の lib(第352便b)が閉包に入る —— 本 lib を呼ぶ段の正本は最上位に provisional: true と鍵の一覧が要る
//   (本 lib の表の数は仮の値を使わない —— 鍵は呼んだ lib が閉包に持つもの)。**
//
// ■ 題(topic)と、1 になると「合う」量 q(t)(どれも t で増える向き —— 零試験で確かめる):
//   'ring'   土星の環(区分 key)の率 ÷ 物差し(第353便k の (F2)・(O0)・受け手 = 回答の基準の粒子〔1 m・c_R 1 —— ノブ(値は未照合)〕・k 1・傾き 1°)。
//   'venus'  背景 0.98 ω_G((N+))で、金星の太陽由来 (S)(k 1)÷ 背景の大きさ = 1 ÷(要る k)。受け手は規則の半径(cR null)か c_R × 観測半径((P-場))。
//   'io'     イオ ← 木星の打ち消しの倍率 ÷ 金星の条件(第353便d の obCancel の x = eqOverUV)。tJ を渡すと木星だけ別の t(太陽は t)。
//   'earth'  地球の項 ÷ 金星の残り(第353便l の ratioOf と同じ量 —— 内合・等大の残り 2 sin(φ/2))。tSun を渡すと太陽だけ別の t(地球は t)。
// ■ t の外: t は 0〜1(srcRadius の範囲)。1 に届かない題は、t 0.9〜1 の対数の傾きで外へ延ばした t を「外挿」の印つきで出す(数えた値ではない)。
// ■ 言わないこと: 源の半径が決まった・合った とは書かない。この場・この置き方・このノブでは、の候補の表。
import * as KS from './lib-w353k-ringstd.mjs';
import * as Dd from './lib-w353d-srcoblate.mjs';
import * as Le from './lib-w353l-earthonvenus.mjs';
import * as Jv from './lib-w353j-venus098.mjs';
import * as H from './lib-w353h-ringdisk.mjs';
import * as K from './lib-w352k-spinform.mjs';
import * as S2 from './lib-w352s-satring.mjs';
import * as CR from './lib-w352c-refaxis.mjs';
import * as PS from './lib-w352d-precsense.mjs';
import * as RJ from './lib-w351j-ringstep.mjs';
import * as SP from './lib-w351c-srcparts.mjs';
import * as G3 from './lib-w348h-axisgeo3.mjs';
import * as DA from './lib-w348d-diskaxis.mjs';
import * as C from './lib-w348c-axisbalance.mjs';
import * as RB from './lib-w338d-ringbook.mjs';
import * as DK from './lib-w312a-decay.mjs';
import * as E from './lib-w347e-spintorque.mjs';

export const LIB_VERSION = 'w353s-srcinterp-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const D2R = Math.PI / 180;
const { dot, crs, nrm, scl, add, sub, unit } = K.vec;
const rel = (a, b) => Math.abs(a - b) / Math.max(Math.abs(b), 1e-300);
const relV = (a, b) => nrm(sub(a, b)) / Math.max(nrm(b), 1e-300);
const angDeg = (a, b) => Math.atan2(nrm(crs(a, b)), dot(a, b)) / D2R;

/* ───────── 宣言(走らせた格子と物差しの記録 —— 式の形の宣言ではない)───────── */
export const DECL = Object.freeze({
  topics: Object.freeze(['ring', 'venus', 'io', 'earth']),
  topicNames: Object.freeze({ ring: '(i) 土星の環の率 ÷ 物差し(k 1・回答の基準の受け手)', venus: '(ii) 0.98 の背景で金星の (S) ÷ 背景(= 1 ÷ 要る k)', io: '(iii) イオの打ち消しの倍率 ÷ 金星の条件(x)', earth: '(iv) 地球の項 ÷ 金星の残り' }),
  /** t の格子(0・0.1・…・1) */
  tGrid: Object.freeze([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]),
  ringKeys: Object.freeze(['ringD', 'ringC', 'ringB', 'ringA', 'ringF']),
  uFocus: 0.98,
  /** (ii) の受け手の列(null = 規則の半径 —— 主の題の文の形・c_R は (P-場) の比べる列 —— ノブ(値は未照合)) */
  venusCRs: Object.freeze([null, 0.0128, 1]),
  /** 表 3 の受け手の列(金星の φ と残り) */
  phiCRs: Object.freeze([null, 1e-3, 0.0128, 0.1, 1]),
  /** 表 2 の源(題の中で引きずる側) */
  srcs: Object.freeze(['Sun', 'Jupiter', 'Saturn', 'Earth']),
  /** 外挿の印 */
  extrapMark: '外挿(t > 1 —— 数えた値ではない)',
  /** 二分の回数(t の幅 1 を 2^-40 まで) */
  nBisect: 40,
  /** 零試験の比べる数(第353便k・d・l・j の報告と統括の数え直し 3 —— 有効数字 3〜6 桁) */
  anchor: Object.freeze({ ringRuleLo: '6.59e-6', ringRuleHi: '2.59e-5', ioX0: '0.894', ioX1: '1.03e+4', earthR0: '1.10e-12', earthR11: '1.03e-5', kRule: '8.22e+11',
    uV: 1.19282e-12, L: Object.freeze([0.026257, 0.008317, 0.999621]), venusPhiRule: 0.7606, venusPhiCR1: 52.06 }),
  judge: '丸めの桁の床: 零試験は相対 1e-9(尺度の走り直しで揺れる)・逐語の表は有効数字 3 桁・「合う t」は q(t) = 1 の二分(t の幅 2^-40)',
});

/* ───────── 源の半径(第352便k の srcRadius —— 範囲の外は外挿の式だけ)───────── */
/** 源 src の t での半径(m)。t は 0〜1(srcRadius)。外挿の t(> 1)は radiusAt(src, t, { extrap: true }) で式だけ */
export function radiusAt(src, t, { extrap = false } = {}) {
  if (!fin(t)) throw new RangeError('radiusAt: t は数');
  if (t >= 0 && t <= 1) return K.srcRadius(src, t);
  if (!extrap) throw new RangeError('radiusAt: t は 0〜1(外挿は extrap: true)');
  return Math.pow(K.srcRadius(src, 0), 1 - t) * Math.pow(K.srcRadius(src, 1), t);
}
const chkT = (t, nm) => { if (!(fin(t) && t >= 0 && t <= 1)) throw new RangeError(nm + ': t は 0〜1'); return t; };

/* ───────── (i) 土星の環 —— 第353便k の diskStd の源の半径を t に(O0・F2)───────── */
/**
 * 区分 key × 源の半径 t × 受け手 recv(第353便k の recvOf の形)× 読み × 傾き。土星の単位(半径 = 観測の半径)で R_源 = (Y_k M ÷ R)^(1 − t)(t 0 = 規則・t 1 = 1 = 観測)。
 * t 0・1 は第353便k の diskStd(src 'rule'・'obs'・ob 'O0')と同じ数(零試験)。戻り: { key, t, yard, raiseOverEpsPerS, cos, A0u, wSu, Rs(m) }
 */
export function ringAt(key, t, { recv = KS.DECL.recvMain, read = 'C2', tiltDeg = KS.DECL.tiltDeg } = {}) {
  chkT(t, 'ringAt');
  if (!['C1', 'C2'].includes(read)) throw new RangeError('ringAt: 読みは C1・C2');
  if (!(fin(tiltDeg) && tiltDeg > 0 && tiltDeg < 90)) throw new RangeError('ringAt: 0 < 傾き < 90');
  const U = DA.saturnUnits(), Sat = RB.srcOf('saturn'), r0 = RB.centerKm(key) * 1e3 / U.R;
  const Rs = t === 0 ? G3.YK * Sat.m / U.R : t === 1 ? 1 : Math.pow(G3.YK * Sat.m / U.R, 1 - t);
  const rv = KS.recvOf(recv), Rb = DA.DECL.Rb;
  const recvU = rv.kind === 'rule' ? { m: DA.DECL.Rb * 2 / 3 * (1.5 / (G3.YK * Sat.m / U.R)), R: DA.DECL.Rb } : { m: rv.m / Sat.m, R: rv.R / U.R };
  const L = RJ.normalAt(tiltDeg, -90, 'pro'), l = unit(L), [e1, e2] = RJ.ringBasis(l), N = RJ.DECL.sat.N;
  let Om = [0, 0, 0];
  for (let j = 0; j < N; j++) {
    const ph = 2 * Math.PI * (j + 0.5) / N, x = scl(add(scl(e1, Math.cos(ph)), scl(e2, Math.sin(ph))), r0);
    const F = Dd.makeFieldOb({ sources: [{ m: 1, R: Rs, p: [0, 0, 0], v: [0, 0, 0], spin: [0, 0, U.sDim], ob: null }], recv: { m: recvU.m, R: recvU.R, p: x, v: [0, 0, 0] }, W0: 0, self: true });
    const v = read === 'C2' ? G3.rot3('W', F, x, { Rb }) : G3.rot3('P2', F, x, { e: unit(x), Rb, lim: false });
    Om = add(Om, scl(v, 1 / N));
  }
  const q = RJ.ringRate(L, Om, { kTilt: 1, kPrec: 0 }), A0u = recvU.m * DK.Kball(1, 0, recvU.R), wSu = DK.Kball(1, r0, Rs);
  return { key, t, yard: H.yardOfRate(q.raiseOverEps / U.tU), raiseOverEpsPerS: q.raiseOverEps / U.tU, cos: q.cos, A0u, wSu, Rs: Rs * U.R };
}

/* ───────── (ii) 0.98 の金星 ───────── */
/** 金星の太陽由来 (S)(k 1・源の半径 t・受け手 cR)の大きさ ÷ 倍率 1 の背景の大きさ(= 等大の倍率 ÷ k)。cR null は第352便s の uVt と同じ */
export function venusUAt(t, { cR = null, T1 = E.t1Table(), GEO = E.geometry() } = {}) {
  chkT(t, 'venusUAt');
  if (!(cR === null || (fin(cR) && cR > 0))) throw new RangeError('venusUAt: c_R > 0 か null');
  const R = K.spinRot(T1, GEO, 'Venus', 'Sun', { part: 'S', tSrc: t, cR, read: 'C2' });
  return { uEqualOverK: nrm(R.Om) / nrm(PS.bgVec('Gm', { u: 1 })), S: R.Om, sHat: R.sHat, A0: R.A0, wS: R.wS, Rs: R.Rs };
}
/** 金星の φ(−S と基準軸 L のなす角)と等大の残り 2 sin(φ/2)・下限 sin φ(源の半径 t・受け手 cR) */
export function venusPhiAt(t, { cR = null, axis = 'L', T1 = E.t1Table(), GEO = E.geometry() } = {}) {
  const v = venusUAt(t, { cR, T1, GEO }), b = unit(CR.refAxis(axis, T1, GEO)), phi = angDeg(scl(v.S, -1), b);
  return { t, cR, phiDeg: phi, residEqual: 2 * Math.sin(phi * D2R / 2), residMin: Math.sin(phi * D2R), uEqualOverK: v.uEqualOverK, A0: v.A0, wS: v.wS, Rs: v.Rs };
}

/* ───────── (iii) イオ ← 木星(太陽と木星に別の t も)───────── */
/** イオの局所((S)・太陽由来 + 木星由来 —— 第353便d の obSatParts と同じ作り)。tS = 太陽の半径の t・tJ = 木星の半径の t */
export function ioLocal(tS, tJ, { T1 = E.t1Table(), GEO = E.geometry() } = {}) {
  chkT(tS, 'ioLocal tS'); chkT(tJ, 'ioLocal tJ');
  const key = 'Io|Jupiter', sunKey = SP.PARENT_ROWS[key], [sid, ssrc] = sunKey.split('|');
  const wSun = K.spinRot(T1, GEO, sid, ssrc, { part: 'M', read: 'W', tSrc: tS, nPhase: 1 }).wS, wPar = K.spinRot(T1, GEO, 'Io', 'Jupiter', { part: 'M', read: 'W', tSrc: tJ, nPhase: 1 }).wS;
  const sun = Dd.obRot(T1, GEO, sid, ssrc, { part: 'S', tSrc: tS, read: 'C2', extraW: wPar }).Om, par = Dd.obRot(T1, GEO, 'Io', 'Jupiter', { part: 'S', tSrc: tJ, read: 'C2', extraW: wSun }).Om;
  return { sun, parent: par, loc: add(sun, par) };
}
/** イオの x(打ち消しの倍率 ÷ 金星の条件 —— 背景 (N+)・L)。tJ null は第353便d の obCancel(tSrc t)を呼ぶ(太陽と木星に同じ t) */
export function ioXAt(t, { tJ = null, T1 = E.t1Table(), GEO = E.geometry() } = {}) {
  chkT(t, 'ioXAt');
  if (tJ === null) { const r = Dd.obCancel(T1, GEO, 'Io|Jupiter', { tSrc: t }); return { t, tJ: t, x: r.eqOverUV, resAtUV: r.resAtUV, phiDeg: r.phiDeg, loc: r.loc }; }
  const L = ioLocal(t, tJ, { T1, GEO }), b1 = S2.bgOf(T1, GEO, 'Np', 'L', 1), uV = S2.uVt(T1, GEO, t), uEq = nrm(L.loc) / nrm(b1);
  return { t, tJ, x: uEq / uV, resAtUV: nrm(add(scl(b1, uV), L.loc)) / (uV * nrm(b1)), phiDeg: angDeg(scl(L.loc, -1), b1), loc: L.loc };
}

/* ───────── (iv) 地球の項 ÷ 金星の残り(地球と太陽に別の t も)───────── */
/** 地球を源にした金星への (S)(内合・受け手は規則の半径)—— 第353便l の earthPart(phase 'inf')と同じ作りで tE・tS を 0〜1 の数に */
export function earthTermAt(tE, tS, { T1 = E.t1Table(), GEO = E.geometry() } = {}) {
  chkT(tE, 'earthTermAt tE'); chkT(tS, 'earthTermAt tS');
  const g = Le.synGeom(T1, GEO), { V: Vp, Q, x, y } = g, Rs = K.srcRadius('Earth', tE);
  const extraW = Vp.Ms * DK.Kball(1, Vp.a, K.srcRadius('Sun', tS)), p = sub(scl(x, Q.a), scl(x, Vp.a));
  const Om = Le.pointRotR({ m: Vp.m, v: [0, 0, 0], Ms: Q.m, p, spin: g.spinE, extraW, Rs, Rr: null });
  return { vec: Om, mag: nrm(Om), d: nrm(p), Rs };
}
/** 地球の項 ÷ 金星の残り(等大 —— 2 sin(φ/2) abs(S))。tSun null は太陽にも同じ t */
export function earthRatioAt(t, { tSun = null, T1 = E.t1Table(), GEO = E.geometry() } = {}) {
  chkT(t, 'earthRatioAt'); const tS = tSun === null ? t : chkT(tSun, 'earthRatioAt tSun');
  const e = earthTermAt(t, tS, { T1, GEO }), v = venusPhiAt(tS, { T1, GEO }), S = venusUAt(tS, { T1, GEO }), res = v.residEqual * nrm(S.S);
  return { t, tSun: tS, e: e.mag, res, ratio: e.mag / res, phiDeg: v.phiDeg };
}

/* ───────── 包み: atT(topic, t, opts) → { topic, t, q, … } ───────── */
/**
 * opts: ring { key, recv } / venus { cR, u } / io { tJ } / earth { tSun }。q は題の量(1 で「合う」)。
 */
export function atT(topic, t, opts = {}) {
  if (!DECL.topics.includes(topic)) throw new RangeError('atT: 題は ' + DECL.topics.join('・'));
  chkT(t, 'atT');
  const T1 = opts.T1 || E.t1Table(), GEO = opts.GEO || E.geometry();
  if (topic === 'ring') { const key = opts.key || 'ringB'; if (!KS.DECL.centers.includes(key) && !DECL.ringKeys.includes(key)) throw new RangeError('atT: 区分'); const r = ringAt(key, t, { recv: opts.recv || KS.DECL.recvMain }); return { topic, t, key, q: r.yard, row: r }; }
  if (topic === 'venus') { const u = opts.u === undefined ? DECL.uFocus : opts.u; if (!(fin(u) && u > 0)) throw new RangeError('atT: u > 0'); const cR = opts.cR === undefined ? null : opts.cR, v = venusUAt(t, { cR, T1, GEO }); return { topic, t, cR, u, q: v.uEqualOverK / u, k: u / v.uEqualOverK, row: v }; }
  if (topic === 'io') { const r = ioXAt(t, { tJ: opts.tJ === undefined ? null : opts.tJ, T1, GEO }); return { topic, t, tJ: r.tJ, q: r.x, row: r }; }
  const r = earthRatioAt(t, { tSun: opts.tSun === undefined ? null : opts.tSun, T1, GEO }); return { topic, t, tSun: r.tSun, q: r.ratio, row: r };
}
/** 1 つの変数の題 fn(t) → q を格子で数え、q = 1 の t を二分で(log q の符号の替わり)。届かなければ t 0.9〜1 の対数の傾きで外挿(印つき) */
export function solveT(fn, { grid = DECL.tGrid, nBisect = DECL.nBisect } = {}) {
  const pts = grid.map((t) => ({ t, q: fn(t) }));
  if (!pts.every((p) => fin(p.q) && p.q > 0)) throw new RangeError('solveT: q > 0 の数');
  const mono = pts.every((p, i) => i === 0 || p.q > pts[i - 1].q);
  let tStar = null, kind = null;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i];
    if ((a.q - 1) * (b.q - 1) <= 0) {
      let lo = a.t, hi = b.t, flo = Math.log(a.q);
      for (let n = 0; n < nBisect; n++) { const m = 0.5 * (lo + hi), fm = Math.log(fn(m)); if ((fm <= 0) === (flo <= 0)) { lo = m; flo = fm; } else hi = m; }
      tStar = 0.5 * (lo + hi); kind = 'inside'; break;
    }
  }
  if (tStar === null) {
    const n = pts.length, a = pts[n - 2], b = pts[n - 1], s = (Math.log(b.q) - Math.log(a.q)) / (b.t - a.t);
    if (pts[0].q > 1) { const a0 = pts[0], b0 = pts[1], s0 = (Math.log(b0.q) - Math.log(a0.q)) / (b0.t - a0.t); tStar = s0 > 0 ? a0.t - Math.log(a0.q) / s0 : null; kind = 'below'; }
    else { tStar = s > 0 ? b.t - Math.log(b.q) / s : null; kind = 'extrap'; }
  }
  const slopes = pts.slice(1).map((p, i) => (Math.log10(p.q) - Math.log10(pts[i].q)) / (p.t - pts[i].t));
  return { pts, tStar, kind, mono, slopeMin: Math.min(...slopes), slopeMax: Math.max(...slopes) };
}
/** 題ごとの「合う t」: topic × opts → solveT の戻り + 源の半径(太陽・木星・土星・地球の、その t での m と規則の半径の倍) */
export function tFor(topic, opts = {}) {
  const T1 = opts.T1 || E.t1Table(), GEO = opts.GEO || E.geometry();
  const r = solveT((t) => atT(topic, t, { ...opts, T1, GEO }).q);
  const src = topic === 'ring' ? 'Saturn' : topic === 'io' ? (opts.tJ === undefined ? 'Jupiter' : 'Sun') : topic === 'earth' ? (opts.tSun === undefined ? 'Earth' : 'Earth') : 'Sun';
  const R = r.tStar === null ? null : radiusAt(src, r.tStar, { extrap: true });
  return { topic, opts: { ...opts, T1: undefined, GEO: undefined }, ...r, src, R, overRule: R === null ? null : R / K.srcRadius(src, 0) };
}

/* ───────── 表 2: 源ごとの量 ───────── */
/** 源の規則の半径・観測の半径・比・扁平率 f(リポジトリ —— 文献の値・未照合)・質量・自転の率(rad/s)・同期の半径 (GM/ω²)^(1/3) */
export function srcRow(src, T1 = E.t1Table(), GEO = E.geometry()) {
  if (!DECL.srcs.includes(src)) throw new RangeError('srcRow: 源は ' + DECL.srcs.join('・'));
  const Rr = K.srcRadius(src, 0), Ro = K.srcRadius(src, 1), M = C.massOf(src), L = Dd.litOf(src);
  const w = src === 'Sun' ? SP.pairInput(T1, GEO, 'Venus', 'Sun').ws : src === 'Jupiter' ? SP.pairInput(T1, GEO, 'Io', 'Jupiter').ws : src === 'Saturn' ? nrm(S2.saturnSpin(T1, GEO).vec) : nrm(Le.synGeom(T1, GEO).spinE);
  const GM = 6.6743e-11 * M, rSync = Math.cbrt(GM / (w * w)), qRot = w * w * Ro * Ro * Ro / GM;
  return { src, Rrule: Rr, Robs: Ro, ruleOverObs: Rr / Ro, f: L.f, M, w, rSync, qRot };
}
/** 候補の半径 Rc の t(= ln(Rc ÷ R_規則) ÷ ln(R_観測 ÷ R_規則)) */
export const tOfRadius = (src, Rc) => Math.log(Rc / K.srcRadius(src, 0)) / Math.log(K.srcRadius(src, 1) / K.srcRadius(src, 0));

/* ───────── 零試験 ───────── */
export function pureScenes(T1 = E.t1Table(), GEO = E.geometry()) {
  const A = DECL.anchor;
  // ① 環: t 0・1 は第353便k の diskStd(rule・obs・O0)と同じ(5 区分)
  const ring = DECL.ringKeys.map((k) => { const a0 = ringAt(k, 0), a1 = ringAt(k, 1), b0 = KS.diskStd(k, { src: 'rule' }), b1 = KS.diskStd(k, { src: 'obs' }); return { key: k, y0: a0.yard, y1: a1.yard, d: Math.max(rel(a0.yard, b0.yard), rel(a1.yard, b1.yard)) }; });
  // ② 金星: venusUAt は第352便s の uVt と同じ(t 0・0.5・1)・k は第353便j の kFor(規則・(P-場) c_R 1)と同じ
  const uv = [0, 0.5, 1].map((t) => rel(venusUAt(t, { T1, GEO }).uEqualOverK, S2.uVt(T1, GEO, t)));
  const jR = Jv.kFor(null, { place: 'rule', T1, GEO }), jF = Jv.kFor(1, { place: 'field', T1, GEO }), mR = atT('venus', 0, { T1, GEO }), mF = atT('venus', 0, { cR: 1, T1, GEO });
  const venus = { uv: Math.max(...uv), kR: mR.k, dR: rel(mR.k, jR.k), dF: rel(mF.k, jF.k), phiR: venusPhiAt(0, { T1, GEO }).phiDeg, phi1: venusPhiAt(0, { cR: 1, T1, GEO }).phiDeg, phiJ1: jF.phiDeg };
  // ③ イオ: ioLocal(t, t) は第353便d の obSatParts と同じ・ioXAt(tJ = t)は obCancel と同じ(t 0・0.5・1)
  const io = [0, 0.5, 1].map((t) => { const a = ioLocal(t, t, { T1, GEO }), b = Dd.obSatParts(T1, GEO, 'Io|Jupiter', { tSrc: t }), x0 = ioXAt(t, { T1, GEO }).x, x1 = ioXAt(t, { tJ: t, T1, GEO }).x; return { t, x: x0, d: Math.max(relV(a.loc, add(b.sun, b.parent)), rel(x1, x0)) }; });
  // ④ 地球: earthRatioAt は第353便l の ratioOf と同じ((0,0)・(1,0)・(1,1))
  const earth = [[0, 0], [1, 0], [1, 1]].map(([tE, tS]) => { const a = earthRatioAt(tE, { tSun: tS, T1, GEO }), b = Le.ratioOf(T1, GEO, { tSrc: tE, tSun: tS }); return { tE, tS, r: a.ratio, d: Math.max(rel(a.ratio, b.ratio), rel(a.e, b.e), rel(a.res, b.res)) }; });
  // ⑤ 共通の点検の数(統括の数え直し 3): L・(uV)
  const L = unit(CR.refAxis('L', T1, GEO)), uV = venusUAt(0, { T1, GEO }).uEqualOverK;
  // ⑥ 半径: t 0・1 は srcRadius の端・外挿の式は t ≤ 1 で srcRadius と同じ
  const rad = DECL.srcs.map((s) => Math.max(rel(radiusAt(s, 0.37, { extrap: true }), K.srcRadius(s, 0.37)), rel(tOfRadius(s, K.srcRadius(s, 0.37)), 0.37)));
  // ⑦ 単調: 4 題の q は t で増える(格子)
  const mono = { ring: DECL.tGrid.map((t) => ringAt('ringB', t).yard), venus: DECL.tGrid.map((t) => venusUAt(t, { T1, GEO }).uEqualOverK), io: DECL.tGrid.map((t) => ioXAt(t, { T1, GEO }).x), earth: DECL.tGrid.map((t) => earthRatioAt(t, { T1, GEO }).ratio) };
  // ⑧ 二分: 既知の単調な関数で q = 1 の t(e^(10(t − 0.3)) → 0.3)と外挿(e^(5t − 8) → 1.6)
  const sv = solveT((t) => Math.exp(10 * (t - 0.3))), sx = solveT((t) => Math.exp(5 * t - 8));
  // ⑨ 拒否
  const rejects = [() => atT('X', 0.5), () => atT('ring', 1.2), () => ringAt('ringB', -0.1), () => venusUAt(0.5, { cR: -1 }), () => radiusAt('Sun', 1.5), () => srcRow('Mars'), () => ioLocal(0, 2), () => earthTermAt(0, NaN)]
    .map((fn) => { try { fn(); return false; } catch (e) { return e instanceof RangeError; } });
  return { ring, venus, io, earth, L, uV, rad, mono, sv: { t: sv.tStar, kind: sv.kind }, sx: { t: sx.tStar, kind: sx.kind }, rejects, anchor: A };
}
export function pureGates(S) {
  const A = S.anchor, p3 = (x) => Number(x).toPrecision(3), e3 = (x) => Number(x).toExponential(2), r9 = 1e-9, inc = (a) => a.every((v, i) => i === 0 || v > a[i - 1]);
  const ys = S.ring.map((r) => r.y0);
  return {
    ring353k: S.ring.length === 5 && S.ring.every((r) => r.d < r9) && e3(Math.min(...ys)) === A.ringRuleLo && e3(Math.max(...ys)) === A.ringRuleHi,
    venus352s353j: S.venus.uv < r9 && S.venus.dR < r9 && S.venus.dF < r9 && e3(S.venus.kR) === A.kRule && Math.abs(S.venus.phi1 - S.venus.phiJ1) < 1e-9 * S.venus.phiJ1,
    io353d: S.io.every((r) => r.d < r9) && p3(S.io[0].x) === A.ioX0 && e3(S.io[2].x) === A.ioX1,
    earth353l: S.earth.every((r) => r.d < r9) && e3(S.earth[0].r) === A.earthR0 && e3(S.earth[2].r) === A.earthR11,
    common: A.L.every((v, i) => Math.abs(S.L[i] - v) < 5e-7) && Number(S.uV).toPrecision(6) === String(A.uV) && Number(S.venus.phiR).toFixed(4) === String(A.venusPhiRule) && Number(S.venus.phi1).toFixed(2) === String(A.venusPhiCR1),
    radius: S.rad.every((d) => d < 1e-12),
    monotone: inc(S.mono.ring) && inc(S.mono.venus) && inc(S.mono.io) && inc(S.mono.earth),
    solver: Math.abs(S.sv.t - 0.3) < 1e-9 && S.sv.kind === 'inside' && Math.abs(S.sx.t - 1.6) < 1e-9 && S.sx.kind === 'extrap',
    rejects: S.rejects.length === 8 && S.rejects.every(Boolean),
  };
}
