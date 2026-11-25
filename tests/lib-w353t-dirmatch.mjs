// 第353便t(原仮定者の回答(2026-11-25 —— 第151報)「AN1034: …」「向きと大きさは別々に合わせて良い」・統括の検証項目 R484):
//   **「金星で釣り合う」を選び出す量の候補 —— 背景の大きさに依らない「向きの一致」2 sin(φ/2)(局所の (S) の逆向きと基準軸のなす角 φ)の順位の頑健さ・φ を決める幾何・相対の運動の分を入れたときの打ち消しを数える純関数。診断だけ**
//   (器 tests/exp-w353t-dirmatch.mjs と QA behavior.dirmatch353t・docs.dirmatch353t が読む —— html を読まない・ファイルを読まない・状態を持たない。後のラウンドの枝もこの口を import してよい)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない。既存の lib は呼ぶだけ(本文は変えない):
//   第353便l(residOf・localOf・pointRotR —— 零試験の表と 14 の受け手)・第353便c(cancelOf —— 受け手の半径の置き方)・第353便d(obRot・obCancel・makeFieldOb・specFor —— 源の扁平)・
//   第353便p(obPlan・localStd —— (O2b) の σ と衛星の組の c_R)・第352便h(sDirClosed・phiSmallDeg —— (S) の向きの閉じた形)・第352便k(spinRot・recvRadius・srcRadius)・
//   第352便c(refAxis・refAxes・members・meanAxis —— 基準軸は必ずここから)・第351便c(pairInput・PARENT_ROWS)・第351便j(ringBasis)・第348便h(rot3・YK)・第350便b(equivR)・第347便h(gaussLegendre)・
//   第334便a(LIT334A —— 衛星の質量・半径・道の半径 —— 文献の値・未照合)・第337便c(G_SI)・第312便a(Kball)・第348便c(massOf・radiusOf)・第347便e(t1Table・geometry)。
//   **第353便l の lib は第353便g の lib を通して仮の値の lib(第352便b)を import する —— この lib を呼ぶ段の正本は最上位に provisional: true と使った鍵の一覧(venus.spin.period —— 本 lib の数には使わない)。**
//
// ■ 語: φ = 局所の成分の逆向き(−局所)と基準軸 axis(背景 (N+) の向き)のなす角。own = 2 sin(φ/2) = 局所と背景が同じ大きさのときの残り ÷ 背景(背景の大きさに依らない —— 向きの一致の量)。
//   rank = 同じ置き方の 14 の受け手の own の小さい順の順位(1 が一番そろう)。
//   受け手の半径 place: 'rule' 規則の半径/'field' (P-場) c_R × 観測半径(場の自分の重みと平均の球 —— 第353便c)/'resp' (P-応)(場は規則の半径 —— φ は 'rule' と同じ)。
//   源の扁平 ob: null 球/'lit' (O2b) の σ(リポジトリの扁平率・R_q 規則の半径 —— 扁平率の無い源はノブ 0.1・値は未照合 —— 第353便p の obPlan)。
//   衛星の自転軸と道の面の置き方 moonAx: 'repo'(第353便l と同じ —— 月とイオはリポジトリの組・ほかは母天体の赤道の円の道で自転軸 = 母天体の自転軸)/
//   'eq'(6 つとも母天体の赤道の円の道)/'orb'(6 つとも母天体の公転面の円の道 —— 自転軸 = 母天体の公転の法線)。
//   成分 part: 'S'(主の列)/'M'・'MS'(比べる列 —— 相対の運動の分を入れた形)。
// ■ 言わないこと: 金星が釣り合っている・金星が選ばれた理由が分かった、とは書かない(順位の表)。置き方を決めない。この場・この置き方・このノブでは、の表。
import * as L from './lib-w353l-earthonvenus.mjs';
import * as RC from './lib-w353c-recvradius.mjs';
import * as DD from './lib-w353d-srcoblate.mjs';
import * as P from './lib-w353p-cancelstd.mjs';
import * as H from './lib-w352h-venusbal.mjs';
import * as K from './lib-w352k-spinform.mjs';
import * as RA from './lib-w352c-refaxis.mjs';
import * as SP from './lib-w351c-srcparts.mjs';
import * as RJ from './lib-w351j-ringstep.mjs';
import * as G3 from './lib-w348h-axisgeo3.mjs';
import * as SC from './lib-w350b-sphereconv.mjs';
import * as HD from './lib-w347h-axisdiff.mjs';
import * as C from './lib-w348c-axisbalance.mjs';
import * as D from './lib-w312a-decay.mjs';
import * as E from './lib-w347e-spintorque.mjs';
import * as TL from './lib-w337c-tidelock.mjs';
import { LIT334A } from './lib-w334a-heightlaw.mjs';

export const LIB_VERSION = 'w353t-dirmatch-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const D2R = Math.PI / 180;
const { dot, crs, nrm, scl, add, sub, unit } = K.vec;
const angDeg = RC.angDeg;

/* ───────── 宣言 ───────── */
export const DECL = Object.freeze({
  recvs: L.DECL.recvs,
  planets: L.DECL.planets,
  moons: Object.freeze(['Moon', 'Io', 'Europa', 'Ganymede', 'Callisto', 'Titan']),
  host: Object.freeze({ Moon: 'Earth', Io: 'Jupiter', Europa: 'Jupiter', Ganymede: 'Jupiter', Callisto: 'Jupiter', Titan: 'Saturn' }),
  pairKey: Object.freeze({ Moon: 'Moon|EarthHi', Io: 'Io|Jupiter' }),
  axes: Object.freeze(['L', 'eq', 'ecl']),
  axisNames: Object.freeze({ L: 'L(角運動量の重み —— 主の列)', eq: 'eq(等重み —— 比べる列)', ecl: '黄道の極(比べる列)' }),
  parts: Object.freeze(['S', 'M', 'MS']),
  places: Object.freeze(['rule', 'field', 'resp']),
  obs: Object.freeze([null, 'lit']),
  moonAxes: Object.freeze(['repo', 'eq', 'orb']),
  moonAxNames: Object.freeze({ repo: '第353便l と同じ(月・イオはリポジトリの組・ほかは母天体の赤道の円の道)', eq: '6 つとも母天体の赤道の円の道', orb: '6 つとも母天体の公転面の円の道' }),
  /** 表 1 の受け手の半径の列(c_R —— (P-場) の 1e-3・0.0128〔第353便c の金星 2% の上端〕・1・(P-応)) */
  recvCols: Object.freeze([Object.freeze({ id: 'rule', place: 'rule', cR: null }), Object.freeze({ id: 'f1e-3', place: 'field', cR: 1e-3 }), Object.freeze({ id: 'f0.0128', place: 'field', cR: 0.0128 }),
    Object.freeze({ id: 'f1', place: 'field', cR: 1 }), Object.freeze({ id: 'resp', place: 'resp', cR: null })]),
  tSrcs: Object.freeze([0, 1]),
  /** 表 2 の金星の公転の法線を回す角(°)と方位の数 */
  tiltDeg: Object.freeze([0.25, 0.5, 1, 2, 4]), nAz: 12,
  /** 零試験の点検の数(第353便l の表 7・統括の数え直し 3) */
  anchor: Object.freeze({ venusOwn: 0.013274, saturnOwn: '0.0436', venusPhi: '0.761', L: Object.freeze([0.026257, 0.008317, 0.999621]), eqDeg: 1.1207,
    cR: Object.freeze([[1e-3, 0.013106], [1e-2, 0.017295], [1, 0.87772]]), mOverS: '2.13e+13' }),
  /** 第352便n の報告の「いまの金星の公転面の向きは、残りが最小の近く(最小から 4〜13°)」・統括の 0.576°(eq の φ の見込み) */
  refText: Object.freeze({ n352: [4, 13], eqPhi: 0.576 }),
  judge: '丸めの桁の床: φ は atan2 の形で直接に数える(打ち消しの残りは差で作らない —— 2 sin(φ/2))・零試験は相対 1e-9・表の照合は有効数字 5 桁(φ・own)/3 桁(比)',
});

/* ───────── 場の平均(受け手の半径 Rr・源の扁平 ob の口つき —— 第353便d の obRot・circRot と同じ作り)───────── */
const GL = HD.gaussLegendre(SP.DECL.ballN);
const radiiOf = (Rr) => GL.x.map((xi, i) => { const rho = 0.5 * Rr * (xi + 1); return [SC.equivR(Rr, rho), 0.5 * Rr * GL.w[i] * 5 * Math.pow(rho, 4) / Math.pow(Rr, 5)]; });
/** pts = [{ p(源の位置 —— 受け手が原点), v(受け手の速度) }] の平均の回転((C2)・形 M1) */
export function avgRot({ Ms, Rs, spin, ob = null, m, Rr, extraW = 0, pts }) {
  if (!(fin(Ms) && Ms > 0 && fin(Rs) && Rs > 0 && fin(m) && m > 0 && fin(Rr) && Rr > 0 && Array.isArray(pts) && pts.length > 0)) throw new RangeError('avgRot: 入力');
  let Om = [0, 0, 0];
  for (const [Ri, wt] of radiiOf(Rr)) {
    let mW = [0, 0, 0];
    for (const q of pts) {
      const f = DD.makeFieldOb({ sources: [{ m: Ms, R: Rs, p: q.p, v: [0, 0, 0], spin, ob }], recv: { m, R: Ri, p: [0, 0, 0], v: q.v }, W0: 0, extraW, kernel: { kind: 'ball', al: 1 }, rot: { form: 'M' }, self: true });
      mW = add(mW, scl(G3.rot3('W', f, [0, 0, 0], { Rb: Ri }), 1 / pts.length));
    }
    Om = add(Om, scl(mW, wt));
  }
  return Om;
}
const sc = (part) => (part === 'M' ? [1, 0] : part === 'S' ? [0, 1] : [1, 1]);
/** 円の道 r・法線 l の N 点(源 = 母天体 —— 受け手の速度は √(G M ÷ r) × (l × r̂)) */
function circPts(l, r, Ms, part, N = 24) {
  const [x, y] = RJ.ringBasis(unit(l)), vc = Math.sqrt(TL.G_SI * Ms / r), s = sc(part);
  return Array.from({ length: N }, (_, j) => { const ph = 2 * Math.PI * (j + 0.5) / N, rh = add(scl(x, Math.cos(ph)), scl(y, Math.sin(ph))); return { p: scl(rh, -r), v: scl(crs(unit(l), rh), vc * s[0]) }; });
}
/** 母天体の太陽のまわりの道の点(第353便d の obRot と同じ基底・同じ位相 —— 受け手の速度は母天体の公転の速さ) */
function helioPts(Q, part, n = K.DECL.nPhase) {
  const x0 = crs(Q.sAx, Q.nHat), x = nrm(x0) > 1e-12 ? unit(x0) : unit(crs(Q.nHat, Math.abs(Q.nHat[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0])), y = crs(Q.nHat, x), s = sc(part);
  return Array.from({ length: n }, (_, j) => { const ph = 2 * Math.PI * (j + 0.5) / n, rh = add(scl(x, Math.cos(ph)), scl(y, Math.sin(ph))); return { p: scl(rh, -Q.a), v: scl(crs(Q.nHat, rh), Q.vOrb * s[0]) }; });
}
const moonData = (key, T1, GEO) => {
  if (key === 'Moon') { const Q = SP.pairInput(T1, GEO, 'Moon', 'EarthHi'); return { m: Q.m, a: Q.a, R: C.radiusOf('Moon') }; }
  const M = LIT334A.moons.find((x) => x.key === key.toLowerCase()); return { m: M.m, a: M.a, R: M.R };
};

/* ───────── 局所の成分(置き方つき)───────── */
const chk = (o) => {
  const { part, tSrc, place, cR, ob, moonAx } = o;
  if (!DECL.parts.includes(part)) throw new RangeError('成分は ' + DECL.parts.join('・'));
  if (!DECL.tSrcs.includes(tSrc)) throw new RangeError('源の半径 tSrc は 0・1');
  if (!DECL.places.includes(place)) throw new RangeError('受け手の半径は ' + DECL.places.join('・'));
  if (place === 'field' && !(fin(cR) && cR > 0)) throw new RangeError('(P-場) は c_R > 0');
  if (!DECL.obs.includes(ob)) throw new RangeError('源の扁平は null・lit');
  if (!DECL.moonAxes.includes(moonAx)) throw new RangeError('衛星の置き方は ' + DECL.moonAxes.join('・'));
};
/**
 * 受け手 key の局所の成分(rad/s)。o: { part, tSrc, place, cR, ob, moonAx }。戻り値 { loc, kind('sun'|'pair'|'circ'), parts, knob }。
 * 既定(S・0・rule・null・repo)で第353便l の localOf と同じ数(零試験)。
 */
export function localT(T1, GEO, key, { part = 'S', tSrc = 0, place = 'rule', cR = null, ob = null, moonAx = 'repo' } = {}, cache = null) {
  if (!DECL.recvs.includes(key)) throw new RangeError('localT: 受け手は ' + DECL.recvs.join('・'));
  chk({ part, tSrc, place, cR, ob, moonAx });
  const cr = place === 'field' ? cR : null, ck = ['lt', key, part, tSrc, cr, ob, DECL.planets.includes(key) ? '' : moonAx].join('|');
  if (cache && cache[ck]) return cache[ck];
  const pl = P.obPlan(ob), spec = (s) => pl.spec(s);
  let out;
  if (DECL.planets.includes(key)) {
    const R = DD.obRot(T1, GEO, key, 'Sun', { part, tSrc, cR: cr, read: 'C2', ob: spec('Sun') });
    out = { loc: R.Om, kind: 'sun', parts: { sun: R.Om } };
  } else if (moonAx === 'repo' && DECL.pairKey[key]) {
    const pk = DECL.pairKey[key], [id, src] = pk.split('|'), [sid, ssrc] = SP.PARENT_ROWS[pk].split('|');
    const wSun = K.spinRot(T1, GEO, sid, ssrc, { part: 'M', read: 'W', tSrc, nPhase: 1 }).wS, wPar = K.spinRot(T1, GEO, id, src, { part: 'M', read: 'W', tSrc, nPhase: 1 }).wS;
    const sun = DD.obRot(T1, GEO, sid, ssrc, { part, tSrc, cR: cr, read: 'C2', extraW: wPar, ob: spec(ssrc) }).Om, par = DD.obRot(T1, GEO, id, src, { part, tSrc, cR: cr, read: 'C2', extraW: wSun, ob: spec(src) }).Om;
    out = { loc: add(sun, par), kind: 'pair', parts: { sun, parent: par } };
  } else {
    const host = DECL.host[key], md = moonData(key, T1, GEO), Q = SP.pairInput(T1, GEO, host, 'Sun'), r2 = T1.find((r) => r.id === host && r.src === 'Sun' && r.mag === 'm2');
    const ax = unit(GEO[host + '|Sun'].w), l = moonAx === 'orb' ? unit(Q.nHat) : ax, Mh = C.massOf(host), Rh = K.srcRadius(host, tSrc), s = sc(part);
    const Rr = cr === null ? G3.YK * md.m : cr * md.R, wSun = K.spinRot(T1, GEO, host, 'Sun', { part: 'M', read: 'W', tSrc, nPhase: 1 }).wS, wPar = Mh * D.Kball(1, md.a, Rh);
    const par = avgRot({ Ms: Mh, Rs: Rh, spin: scl(ax, Math.abs(r2.omega) * s[1]), ob: spec(host), m: md.m, Rr, extraW: wSun, pts: circPts(l, md.a, Mh, part) });
    const sun = avgRot({ Ms: Q.Ms, Rs: K.srcRadius('Sun', tSrc), spin: scl(Q.sAx, Q.ws * s[1]), ob: spec('Sun'), m: md.m, Rr, extraW: wPar, pts: helioPts(Q, part) });
    out = { loc: add(sun, par), kind: 'circ', parts: { sun, parent: par } };
  }
  out.knob = [...pl.knob].sort();
  if (cache) cache[ck] = out; return out;
}

/* ───────── 約束の口 ───────── */
/**
 * 向きの一致: dirMatch(key, { axis, part, tSrc, cR, place, ob, moonAx, T1, GEO }) → { key, phiDeg, own(2 sin(φ/2)), lowest(sin φ —— φ ≥ 90° は 1), rank(14 の受け手の own の小さい順), cosLB, kind }。
 * 既定の引数で第353便l の residOf(key).own・phiDeg と同じ数(零試験)。
 */
export function dirMatch(key, { axis = 'L', part = 'S', tSrc = 0, cR = null, place = null, ob = null, moonAx = 'repo', T1 = E.t1Table(), GEO = E.geometry() } = {}, cache = null) {
  if (!DECL.axes.includes(axis)) throw new RangeError('dirMatch: 基準軸は ' + DECL.axes.join('・'));
  const pl = place === null ? (cR === null ? 'rule' : 'field') : place, o = { part, tSrc, place: pl, cR, ob, moonAx };
  const b = unit(RA.refAxis(axis, T1, GEO));
  const one = (k) => { const l = localT(T1, GEO, k, o, cache).loc, ph = angDeg(scl(l, -1), b); return { key: k, phiDeg: ph, own: 2 * Math.sin(ph * D2R / 2), lowest: ph >= 90 ? 1 : Math.sin(ph * D2R), cosLB: dot(unit(l), b), kind: localT(T1, GEO, k, o, cache).kind }; };
  const all = DECL.recvs.map(one), sorted = [...all].sort((p, q) => p.own - q.own).map((r) => r.key), me = all.find((r) => r.key === key);
  if (!me) throw new RangeError('dirMatch: 受け手は ' + DECL.recvs.join('・'));
  return { ...me, rank: sorted.indexOf(key) + 1, order: sorted };
}
/** 1 つの置き方の 14 の受け手の表(own の小さい順の順位つき) */
export function rankAll(T1, GEO, opt = {}, cache = null) {
  const d = dirMatch('Venus', { ...opt, T1, GEO }, cache), b = unit(RA.refAxis(opt.axis || 'L', T1, GEO));
  return d.order.map((k, i) => { const l = localT(T1, GEO, k, { part: opt.part || 'S', tSrc: opt.tSrc || 0, place: opt.place || (opt.cR ? 'field' : 'rule'), cR: opt.cR === undefined ? null : opt.cR, ob: opt.ob === undefined ? null : opt.ob, moonAx: opt.moonAx || 'repo' }, cache).loc, ph = angDeg(scl(l, -1), b);
    return { key: k, rank: i + 1, phiDeg: ph, own: 2 * Math.sin(ph * D2R / 2) }; });
}

/* ───────── T3: φ を決める幾何(閉じた形 —— 第352便h の sDirClosed: −Ŝ ∥ 3(ŝ☉·n̂)n̂ − ŝ☉)───────── */
/** 閉じた形の φ(°)= ∠(3(ŝ☉·n̂)n̂ − ŝ☉, b̂)と小さい角の形(第352便h の phiSmallDeg) */
export function closedPhi(sunHat, nHat, bHat) { return { phiDeg: angDeg(H.sDirClosed(sunHat, nHat), bHat), smallDeg: H.phiSmallDeg(sunHat, nHat, bHat) }; }
/** 惑星 id の幾何: 数えた φ・閉じた形・小さい角の形・太陽の自転軸と b の角(円錐)・公転の法線と b の角・公転の法線と太陽の自転軸の角 */
export function geomRow(T1, GEO, id, { axis = 'L' } = {}, cache = null) {
  const Q = SP.pairInput(T1, GEO, id, 'Sun'), s = unit(Q.sAx), n = unit(Q.nHat), b = unit(RA.refAxis(axis, T1, GEO)), cf = closedPhi(s, n, b);
  const num = angDeg(scl(localT(T1, GEO, id, {}, cache).loc, -1), b);
  return { id, axis, phiNum: num, phiClosed: cf.phiDeg, phiSmall: cf.smallDeg, sunToB: angDeg(s, b), nToB: angDeg(n, b), nToSun: angDeg(n, s) };
}
/** 金星の公転の法線を δ° 回したときの閉じた形の φ(方位 nAz 点)・φ が 0 になる法線 n★(いまの法線に一番近い解 —— 接平面の二分のない最小化)とその角 */
export function tiltScan(T1, GEO, { axis = 'L', id = 'Venus' } = {}) {
  const Q = SP.pairInput(T1, GEO, id, 'Sun'), s = unit(Q.sAx), n = unit(Q.nHat), b = unit(RA.refAxis(axis, T1, GEO));
  const [ex, ey] = RJ.ringBasis(n), at = (u, v) => unit(add(n, add(scl(ex, Math.tan(u * D2R)), scl(ey, Math.tan(v * D2R)))));
  const f = (u, v) => angDeg(H.sDirClosed(s, at(u, v)), b), phi0 = f(0, 0);
  const rows = DECL.tiltDeg.map((dlt) => { const ph = Array.from({ length: DECL.nAz }, (_, j) => { const az = 2 * Math.PI * j / DECL.nAz; return f(dlt * Math.cos(az), dlt * Math.sin(az)); });
    return { tiltDeg: dlt, min: Math.min(...ph), max: Math.max(...ph), mean: ph.reduce((a, c) => a + c, 0) / ph.length }; });
  // 最小化(座標の降下 —— 刻みを半分ずつ)
  let u = 0, v = 0, h = 2;
  for (let it = 0; it < 400 && h > 1e-7; it++) { const c = f(u, v), cand = [[u + h, v], [u - h, v], [u, v + h], [u, v - h]].map(([a, bb]) => [a, bb, f(a, bb)]).sort((p, q) => p[2] - q[2])[0]; if (cand[2] < c) { u = cand[0]; v = cand[1]; } else h /= 2; }
  const nStar = at(u, v), dd = 1e-4, grad = Math.hypot((f(dd, 0) - f(-dd, 0)) / (2 * dd), (f(0, dd) - f(0, -dd)) / (2 * dd));
  return { id, axis, phi0, rows, nStarDeg: angDeg(n, nStar), phiMin: f(u, v), gradDegPerDeg: grad, nStarToB: angDeg(nStar, b) };
}
/** 基準軸の定義と金星の φ: L・eq・ecl・La・L から金星を外した軸・金星の重みを 2 倍にした軸・L と eq の間(t = 0〜1)の軸 */
export function axisRows(T1, GEO, { id = 'Venus' } = {}, cache = null) {
  const l = localT(T1, GEO, id, {}, cache).loc, m = scl(l, -1), M = RA.members(T1, GEO), A = RA.refAxes(T1, GEO);
  const noV = RA.meanAxis(M.filter((r) => r.id !== id), 'wL'), dbl = RA.meanAxis(M.map((r) => (r.id === id ? { ...r, wL: 2 * r.wL } : r)), 'wL');
  const row = (name, ax, note) => { const ph = angDeg(m, ax); return { name, phiDeg: ph, own: 2 * Math.sin(ph * D2R / 2), toL: angDeg(ax, A.L), note }; };
  const mix = [0, 0.25, 0.5, 0.75, 1].map((t) => row('mix' + t, unit(add(scl(A.L, 1 - t), scl(A.eq, t))), 'L と eq の間 t = ' + t));
  return [row('L', A.L, '角運動量の重み(主の列)'), row('eq', A.eq, '等重み(比べる列)'), row('ecl', A.ecl, '黄道の極(比べる列)'), row('La', A.La, '質量 × √a(比べる列)'),
    row('LnoV', noV, 'L から金星を外す'), row('L2V', dbl, 'L の金星の重みを 2 倍'), ...mix];
}

/* ───────── T4: 相対の運動の分を入れたとき ───────── */
/** 金星の (M)・(S)・(MS) の大きさの比・(M) と公転の法線の cos・各成分の φ と own */
export function partGeom(T1, GEO, { id = 'Venus', axis = 'L' } = {}, cache = null) {
  const b = unit(RA.refAxis(axis, T1, GEO)), n = unit(SP.pairInput(T1, GEO, id, 'Sun').nHat), o = {};
  for (const part of DECL.parts) { const l = localT(T1, GEO, id, { part }, cache).loc, ph = angDeg(scl(l, -1), b); o[part] = { mag: nrm(l), phiDeg: ph, own: 2 * Math.sin(ph * D2R / 2), cosN: dot(unit(l), n) }; }
  return { id, axis, mOverS: o.M.mag / o.S.mag, ...o };
}

/* ───────── 零試験・変異 ───────── */
export function pureScenes(T1 = E.t1Table(), GEO = E.geometry()) {
  const cache = {}, lc = {}, rel = (a, b) => Math.abs(a / b - 1), relv = (a, b) => nrm(sub(a, b)) / nrm(b);
  // ① 第353便l の表 7: 14 の受け手の own・φ を第353便l の residOf と照合(相対 1e-9)・金星 0.013274・土星 0.0436
  const rows = DECL.recvs.map((k) => { const d = dirMatch(k, { T1, GEO }, cache), r = L.residOf(k, { T1, GEO }, lc); return { k, own: d.own, rank: d.rank, phi: d.phiDeg, dOwn: rel(d.own, r.own), dPhi: rel(d.phiDeg, r.phiDeg) }; });
  const v = rows.find((r) => r.k === 'Venus'), s = rows.find((r) => r.k === 'Saturn');
  // ② 受け手の半径: (P-場) の金星の own = 第353便c の cancelOf の residEqual(相対 1e-9)と統括の数え直し 3
  const cRrows = DECL.anchor.cR.map(([cR, w]) => { const d = dirMatch('Venus', { T1, GEO, cR }, cache), c = RC.cancelOf(T1, GEO, 'Venus', 'Sun', { place: 'field', cR }); return { cR, own: d.own, w, dC: rel(d.own, c.residEqual) }; });
  const respSame = rel(dirMatch('Venus', { T1, GEO, place: 'resp' }, cache).own, v.own) < 1e-12;
  // ③ 源の扁平 (O2b): 金星・イオの φ = 第353便d の obCancel(相対 1e-9)・イオと月の組の c_R = 第353便p の localStd(ベクトル 相対 1e-9)
  const pl = P.obPlan('lit');
  const oV = DD.obCancel(T1, GEO, 'Venus|Sun', { obSun: pl.spec('Sun') }), oI = DD.obCancel(T1, GEO, 'Io|Jupiter', { obPar: pl.spec('Jupiter'), obSun: pl.spec('Sun') });
  const dObV = rel(dirMatch('Venus', { T1, GEO, ob: 'lit' }, cache).phiDeg, oV.phiDeg), dObI = rel(dirMatch('Io', { T1, GEO, ob: 'lit' }, cache).phiDeg, oI.phiDeg);
  const pc = {}, dPI = relv(localT(T1, GEO, 'Io', { place: 'field', cR: 0.0128 }, cache).loc, P.localStd(T1, GEO, 'Io|Jupiter', { cR: 0.0128 }, pc).loc), dPM = relv(localT(T1, GEO, 'Moon', { place: 'field', cR: 1e-3 }, cache).loc, P.localStd(T1, GEO, 'Moon|EarthHi', { cR: 1e-3 }, pc).loc);
  // ④ 円の道の衛星(規則の半径・球)= 第353便l の localOf(ベクトル 相対 1e-9 —— 受け手を衛星の質量で置いても自分の重み A0 = 1.5 ÷ Y_k が変わらない)
  const dCirc = Math.max(...['Europa', 'Ganymede', 'Callisto', 'Titan'].map((k) => relv(localT(T1, GEO, k, {}, cache).loc, L.localOf(T1, GEO, k, {}, lc).loc)));
  // ⑤ 基準軸 L の成分・eq との角(統括の数え直し 3)
  const A = RA.refAxes(T1, GEO), eqDeg = angDeg(A.L, A.eq);
  // ⑥ 閉じた形と数えた φ(8 惑星 —— 差の最大 °)・金星の (M) ÷ (S)(第353便l の 2.13e13)と (M) の向き(公転の法線)
  const gmax = Math.max(...DECL.planets.map((id) => Math.abs(geomRow(T1, GEO, id, {}, cache).phiNum - geomRow(T1, GEO, id, {}, cache).phiClosed))), pg = partGeom(T1, GEO, {}, cache);
  // ⑦ 変異: −局所 を +局所 にすると金星の φ は 179° の近く(打ち消さない)・閉じた形の 3 を 1 にすると φ が動く
  const b = unit(A.L), mFlip = angDeg(localT(T1, GEO, 'Venus', {}, cache).loc, b) > 170;
  const Q = SP.pairInput(T1, GEO, 'Venus', 'Sun'), alt = sub(scl(unit(Q.nHat), dot(unit(Q.sAx), unit(Q.nHat))), unit(Q.sAx)), mClosed = Math.abs(angDeg(alt, b) - closedPhi(unit(Q.sAx), unit(Q.nHat), b).phiDeg) > 0.1;
  const rej = [() => dirMatch('Pluto'), () => dirMatch('Venus', { axis: 'La' }), () => dirMatch('Venus', { part: 'X' }), () => dirMatch('Venus', { tSrc: 0.5 }), () => dirMatch('Venus', { place: 'field' }),
    () => dirMatch('Venus', { ob: 'O3' }), () => dirMatch('Venus', { moonAx: 'host' }), () => avgRot({ Ms: 1, Rs: 1, spin: [0, 0, 0], m: 1, Rr: 0, pts: [{ p: [1, 0, 0], v: [0, 0, 0] }] })]
    .map((fn) => { try { fn(); return false; } catch (er) { return er instanceof RangeError; } });
  return { rows, venusOwn: v.own, venusRank: v.rank, venusPhi: v.phi, saturnOwn: s.own, saturnRank: s.rank, cRrows, respSame, dObV, dObI, dPI, dPM, dCirc, Lvec: A.L, eqDeg, gmax, mOverS: pg.mOverS, mCosN: pg.M.cosN,
    mFlip, mClosed, rejects: rej };
}
const p3 = (x, w) => Number(Number(x).toPrecision(3)).toExponential(2) === Number(w).toExponential(2);
const p5 = (x, w) => Number(Number(x).toPrecision(5)) === Number(Number(w).toPrecision(5));
export function pureGates(S) {
  const A = DECL.anchor;
  return {
    anchorL: S.rows.every((r) => r.dOwn < 1e-9 && r.dPhi < 1e-9) && p5(S.venusOwn, A.venusOwn) && p3(S.saturnOwn, A.saturnOwn) && S.venusRank === 1 && S.saturnRank === 2 && Number(S.venusPhi.toFixed(3)) === Number(A.venusPhi),
    recvRadius: S.cRrows.every((r) => p5(r.own, r.w) && r.dC < 1e-9) && S.respSame,
    srcOblate: S.dObV < 1e-9 && S.dObI < 1e-9 && S.dPI < 1e-9 && S.dPM < 1e-9,
    circMoon: S.dCirc < 1e-9,
    axisL: A.L.every((c, i) => Math.abs(S.Lvec[i] - c) < 5e-7) && Math.abs(S.eqDeg - A.eqDeg) < 5e-4,
    closed: S.gmax < 0.05 && p3(S.mOverS, A.mOverS) && S.mCosN > 0.9999,
    mutants: S.mFlip && S.mClosed,
    rejects: S.rejects.length === 8 && S.rejects.every(Boolean),
  };
}
