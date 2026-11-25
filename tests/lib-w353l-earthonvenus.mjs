// 第353便l(原仮定者の回答(2026-11-25 —— 第151報)「AN1034: …」・統括の検証項目 R476):
//   **「金星は、自転に地球の影響が出るほどに釣り合っている」(原仮定者の文)を DFM の側で読む材料 —— 地球を源にした金星への項の置き方の走査と、軸の拘束 (L2) を全部の受け手で数える純関数。診断だけ**
//   (器 tests/exp-w353l-earthonvenus.mjs と QA behavior.earthonvenus353l・docs.earthonvenus353l が読む —— html を読まない・ファイルを読まない・状態を持たない。後のラウンドの枝もこの口を import してよい)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない。既存の lib は呼ぶだけ(本文は変えない):
//   第353便g(earthDrag・residualOf・periods・lockPhase —— 零試験の数と内合の算術)・第353便c(cancelOf・rateMult —— 受け手の半径の置き方)・第353便d(circRot —— 母天体の赤道の円の道)・
//   第352便h(pointRot・otherSrc・b1 —— 地球を源にした点の回転・背景の大きさの物差し)・第352便k(spinRot・recvRadius・srcRadius)・第352便v(localOf・cancelPoint —— 打ち消しの点の一覧)・
//   第352便c(refAxis —— 基準軸は必ずここから)・第352便d(bgVec —— 背景の向きと大きさ)・第351便c(pairInput)・第348便h(makeField3・rot3・YK)・第350便b(equivR)・第347便h(gaussLegendre)・
//   第334便a(LIT334A —— 衛星の質量と道の半径)・第312便a(Kball)・第347便e(t1Table・geometry)。
//   **第353便g の lib は仮の値の lib(第352便b)を import する —— この lib を呼ぶ段の正本は最上位に provisional: true と使った鍵の一覧(venus.spin.period —— T5 の 0.513°/内合だけ)。**
//
// ■ 語: 残り = 金星の (S)(源 = 太陽)と背景 (N+)(基準軸 L)の合成の大きさ。(L2) = 残り ÷ 背景(軸の拘束 —— 第353便g)。
//   (E-S) = 地球の自転の分 (S) の金星への項・(E-M) = 地球との相対の運動の分(比べる列)・(E-MS) = 両方。
//   受け手(金星)の半径の置き方 place: 'rule' 規則の半径(第352便までの主の形)/'field' (P-場) 自分の重みと平均の球を c_R × 観測半径(第353便c)/'resp' (P-応) 応答の側だけ(場は規則の半径 —— 率の倍は (E-S) と残りに同じに掛かる)。
//   源の半径 tSrc(地球)・tSun(太陽): 0 規則の半径(主)・1 観測の半径(比べる列)。
//   背景の大きさの置き方 uMode: 'same' = (uV) を同じ置き方で数え直す(金星の (S) と背景が等大 —— 残り = 2 sin(φ/2) abs(S))/'fixed' = (uV) を規則の半径の値 1.19282e-12 に固定/数 = その倍率。
// ■ 言わないこと: 地球の影響で逆回転した・ロックした、とは書かない(原仮定者の文として引く)。置き方を決めない。この場・この置き方・このノブでは、の表。
import * as K from './lib-w352k-spinform.mjs';
import * as H from './lib-w352h-venusbal.mjs';
import * as G from './lib-w353g-venuslock.mjs';
import * as RC from './lib-w353c-recvradius.mjs';
import * as DD from './lib-w353d-srcoblate.mjs';
import * as V from './lib-w352v-cancelmap.mjs';
import * as RA from './lib-w352c-refaxis.mjs';
import * as PS from './lib-w352d-precsense.mjs';
import * as SP from './lib-w351c-srcparts.mjs';
import * as G3 from './lib-w348h-axisgeo3.mjs';
import * as SC from './lib-w350b-sphereconv.mjs';
import * as HD from './lib-w347h-axisdiff.mjs';
import * as C from './lib-w348c-axisbalance.mjs';
import * as D from './lib-w312a-decay.mjs';
import * as E from './lib-w347e-spintorque.mjs';
import { LIT334A } from './lib-w334a-heightlaw.mjs';

export const LIB_VERSION = 'w353l-earthonvenus-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const isVec = (a) => Array.isArray(a) && a.length === 3 && a.every(fin);
const D2R = Math.PI / 180;
const { dot, crs, nrm, scl, add, sub, unit } = K.vec;
const angDeg = RC.angDeg;

/* ───────── 宣言 ───────── */
export const DECL = Object.freeze({
  parts: Object.freeze(['S', 'M', 'MS']),
  places: Object.freeze(['rule', 'field', 'resp']),
  placeNames: Object.freeze({ rule: '規則の半径(第352便までの主の形)', field: '(P-場) 自分の重みと平均の球', resp: '(P-応) 応答の側だけ' }),
  tSrcs: Object.freeze([0, 1]),
  uModes: Object.freeze(['same', 'fixed']),
  uModeNames: Object.freeze({ same: '(uV) を同じ置き方で数え直す', fixed: '(uV) を規則の半径の値に固定' }),
  /** 表 1 の c_R の格子((P-場) —— 1e-4〜1) */
  cRGrid: Object.freeze([1e-4, 3e-4, 1e-3, 3e-3, 1e-2, 3e-2, 0.1, 0.3, 1]),
  /** 表 1 の源の半径の組(地球 tSrc・太陽 tSun) */
  srcCols: Object.freeze([Object.freeze({ id: 'rule', tSrc: 0, tSun: 0, label: '地球・太陽とも規則の半径(主)' }), Object.freeze({ id: 'Eobs', tSrc: 1, tSun: 0, label: '地球だけ観測の半径' }),
    Object.freeze({ id: 'obs', tSrc: 1, tSun: 1, label: '地球・太陽とも観測の半径(比べる列)' })]),
  /** 表 2 の会合の位相(内合からの角 °) */
  phases: Object.freeze([-60, -30, -10, -3, -1, 0, 1, 3, 10, 30, 60, 180]),
  /** 表 3 の受け手(8 惑星・月・ガリレオ衛星・タイタン) */
  recvs: Object.freeze(['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Moon', 'Io', 'Europa', 'Ganymede', 'Callisto', 'Titan']),
  planets: Object.freeze(['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune']),
  /** 衛星の作り: 'pair' = リポジトリの組(第352便v の localOf —— 太陽由来 + 母天体由来)/'circ' = 母天体の赤道の円の道(第353便d の circRot —— 自転軸 = 母天体の自転軸・太陽由来は母天体の位置の値で代える) */
  moonKind: Object.freeze({ Moon: 'pair', Io: 'pair', Europa: 'circ', Ganymede: 'circ', Callisto: 'circ', Titan: 'circ' }),
  moonKey: Object.freeze({ Moon: 'Moon|EarthHi', Io: 'Io|Jupiter' }),
  /** 表 3 の背景の倍率の列: (uV)(金星の条件)・(N+) の窓の下端 0.0487・上端 0.835・注目の列 0.98 */
  uCols: Object.freeze(['uV', 0.0487, 0.835, 0.98]),
  /** T5 の内合の経度の置き方(残りの軸の公転面の中の方位から測った最初の内合の経度 d —— 実際の位相はリポジトリに無い → ノブの格子 °) */
  dGrid: Object.freeze([0, 12, 24, 36, 48, 60]),
  nConj: 5,
  /** 仮の値の台帳の鍵(第352便b —— T5 の内合ごとの自転のずれ 0.513° だけ) */
  provKeys: Object.freeze(['venus.spin.period']),
  /** 零試験の点検の数(第353便g の報告・統括の数え直し 3) */
  anchor: Object.freeze({ esInf: '1.10e-12', esMean: '9.31e-14', emInf: '4.93e+9', L2: 0.013274,
    cR: Object.freeze([[1e-3, 0.013106, 1.61699e-7], [1e-2, 0.017295, 1.16430e-6], [0.1, 0.13219, 1.87673e-6], [0.3, 0.37565, 1.11483e-6], [1, 0.87772, 6.45938e-7]]), uVrule: 1.19282e-12 }),
  judge: '丸めの桁の床: 打ち消しで小さくなる残りは差で作らず角から直接に数える(2 sin(φ/2))・(L2) − 1 は差で作らず (2 l·b + abs(l)²) ÷ (abs(b)(abs(l + b) + abs(b))) で・比は有効数字 3 桁',
});

/* ───────── 点の回転(受け手の半径を引数に —— 第352便h の pointRot の Rr を口にした形)───────── */
const GL = HD.gaussLegendre(SP.DECL.ballN);
/** 1 つの配置の回転(rad/s)。Rr = 受け手の自分の重みの球の半径(null は規則の半径 Y_k m —— 第352便h の pointRot と同じ数)・Rs = 源の半径(null は規則の半径) */
export function pointRotR({ m, v, Ms, p, spin, read = 'C2', extraW = 0, Rs = null, Rr = null }) {
  if (!(fin(m) && m > 0 && fin(Ms) && Ms >= 0 && isVec(v) && isVec(p) && isVec(spin))) throw new RangeError('pointRotR: 入力');
  if (!(Rr === null || (fin(Rr) && Rr > 0))) throw new RangeError('pointRotR: Rr > 0 か null');
  const R1 = Rr === null ? G3.YK * m : Rr, R2 = Rs === null ? G3.YK * Ms : Rs;
  const radii = read === 'W' ? [[R1, 1]] : GL.x.map((xi, i) => { const rho = 0.5 * R1 * (xi + 1); return [SC.equivR(R1, rho), 0.5 * R1 * GL.w[i] * 5 * Math.pow(rho, 4) / Math.pow(R1, 5)]; });
  let Om = [0, 0, 0];
  for (const [Ri, wt] of radii) {
    const f = G3.makeField3({ sources: [{ m: Ms, R: R2, p, v: [0, 0, 0], spin }], recv: { m, R: Ri, p: [0, 0, 0], v }, W0: 0, extraW, kernel: { kind: 'ball', al: 1 }, rot: { form: 'M' }, self: true });
    Om = add(Om, scl(G3.rot3('W', f, [0, 0, 0], { Rb: Ri }), read === 'W' ? 1 : wt));
  }
  return Om;
}
const placeCR = (place, cR) => {
  if (!DECL.places.includes(place)) throw new RangeError('入れ方は ' + DECL.places.join('・'));
  if (place === 'field') { if (!(fin(cR) && cR > 0)) throw new RangeError('c_R > 0'); return cR; }
  return null;
};
const chkT = (t, nm) => { if (!DECL.tSrcs.includes(t)) throw new RangeError(nm + ' は 0・1'); return t; };

/** 会合の幾何(第352便h の otherSrc と同じ作り —— 金星の公転面・内合が位相 0): 基底 x(金星の位置の向き)・y・金星と地球の道の半径と速さ・地球の自転のベクトル */
export function synGeom(T1, GEO) {
  const Vp = SP.pairInput(T1, GEO, 'Venus', 'Sun'), Q = SP.pairInput(T1, GEO, 'Earth', 'Sun'), r2 = T1.find((r) => r.id === 'Earth' && r.src === 'Sun' && r.mag === 'm2');
  const n = Vp.nHat, x0 = crs(n, [0, 0, 1]), x = nrm(x0) > 1e-9 ? unit(x0) : [1, 0, 0], y = crs(n, x), spinE = scl(unit(GEO['Earth|Sun'].w), r2.omega);
  return { V: Vp, Q, n, x, y, spinE };
}

/* ───────── 約束の口 ───────── */
/**
 * 地球を源にした金星への項(rad/s)。part 'S'・'M'・'MS'/place・cR(受け手の半径)/tSrc(地球の半径)・tSun(分母の太陽の重みの半径 —— 既定は tSrc)/
 * phase 'inf'(内合)・'sup'(外合)・'mean'(1 会合のベクトルの平均)・'mag'(大きさの平均 —— vec は null)・数(内合からの会合の位相 rad)。
 * 戻り値 { vec, mag, d(距離 m —— 位相が 1 つのとき), Rr, Rs, rateMult('resp' のとき —— 文献の慣性モーメントの係数・物差しは規則の半径) }。
 * 既定の引数(S・rule・0・'inf')で第352便h の otherSrc(..., 'Earth').inf.S と同じ。
 */
export function earthPart(T1, GEO, { part = 'S', cR = null, place = null, tSrc = 0, tSun = null, phase = 'inf', nSyn = H.DECL.nSyn, sunW = true } = {}) {
  if (!DECL.parts.includes(part)) throw new RangeError('earthPart: 成分は ' + DECL.parts.join('・'));
  const pl = place === null ? (cR === null ? 'rule' : 'field') : place, cr = placeCR(pl, cR), ts = chkT(tSrc, 'earthPart: tSrc'), tu = chkT(tSun === null ? tSrc : tSun, 'earthPart: tSun');
  if (!(phase === 'inf' || phase === 'sup' || phase === 'mean' || phase === 'mag' || fin(phase))) throw new RangeError('earthPart: 位相は inf・sup・mean・mag・数');
  if (!(Number.isInteger(nSyn) && nSyn >= 8)) throw new RangeError('earthPart: nSyn ≥ 8 の整数');
  const g = synGeom(T1, GEO), { V: Vp, Q, x, y } = g, Rr = K.recvRadius('Venus', cr), Rs = K.srcRadius('Earth', ts);
  const extraW = sunW ? Vp.Ms * D.Kball(1, Vp.a, K.srcRadius('Sun', tu)) : 0, sp = part === 'M' ? [0, 0, 0] : g.spinE, vs = part === 'S' ? 0 : 1;
  const at = (ph) => { const eh = add(scl(x, Math.cos(ph)), scl(y, Math.sin(ph))), th = add(scl(x, -Math.sin(ph)), scl(y, Math.cos(ph)));
    const p = sub(scl(eh, Q.a), scl(x, Vp.a)), v = scl(sub(scl(y, Vp.vOrb), scl(th, Q.vOrb)), vs);
    return { d: nrm(p), Om: pointRotR({ m: Vp.m, v, Ms: Q.m, p, spin: sp, extraW, Rs, Rr }) }; };
  const rm = pl === 'resp' ? RC.rateMult('Venus', { cR: 1 }) : null;
  if (phase === 'mean' || phase === 'mag') {
    let s = [0, 0, 0], a = 0; for (let j = 0; j < nSyn; j++) { const q = at(2 * Math.PI * (j + 0.5) / nSyn); s = add(s, scl(q.Om, 1 / nSyn)); a += nrm(q.Om) / nSyn; }
    return phase === 'mean' ? { vec: s, mag: nrm(s), d: null, Rr, Rs, rateMult: rm } : { vec: null, mag: a, d: null, Rr, Rs, rateMult: rm };
  }
  const q = at(phase === 'inf' ? 0 : phase === 'sup' ? Math.PI : phase);
  return { vec: q.Om, mag: nrm(q.Om), d: q.d, Rr, Rs, rateMult: rm };
}
/**
 * 金星の残り(太陽由来の (S) + 背景 (N+))を同じ置き方で。uMode 'same'(等大 —— 残り = 2 sin(φ/2) abs(S))・'fixed'(倍率 = 規則の半径の (uV))・数(倍率)。
 * 戻り値 { S, sMag, phiDeg, u, bgMag, res, L2 }。
 */
export function venusRes(T1, GEO, { cR = null, place = null, tSun = 0, uMode = 'same', axis = 'L' } = {}, cache = null) {
  const pl = place === null ? (cR === null ? 'rule' : 'field') : place, cr = placeCR(pl, cR), tu = chkT(tSun, 'venusRes: tSun');
  if (!(DECL.uModes.includes(uMode) || (fin(uMode) && uMode > 0))) throw new RangeError('venusRes: 大きさの置き方は same・fixed・正の数');
  const ck = ['vr', pl, cr, tu, axis].join('|');
  let base = cache && cache[ck];
  if (!base) { const S = K.spinRot(T1, GEO, 'Venus', 'Sun', { part: 'S', tSrc: tu, cR: cr, read: 'C2' }).Om, b = unit(RA.refAxis(axis, T1, GEO)); base = { S, b, phiDeg: angDeg(scl(S, -1), b) }; if (cache) cache[ck] = base; }
  const b1 = H.b1(), sMag = nrm(base.S), uRule = uRuleOf(T1, GEO, cache);
  const u = uMode === 'same' ? sMag / b1 : uMode === 'fixed' ? uRule : uMode, bgMag = u * b1;
  const res = uMode === 'same' ? 2 * Math.sin(base.phiDeg * D2R / 2) * sMag : nrm(add(base.S, scl(base.b, bgMag)));
  return { S: base.S, sMag, phiDeg: base.phiDeg, u, bgMag, res, L2: res / bgMag };
}
/** 規則の半径の (uV)(金星の太陽由来 (S) と背景が等大の倍率 —— 1.19282e-12) */
export function uRuleOf(T1, GEO, cache = null) {
  if (cache && cache.uRule) return cache.uRule;
  const v = nrm(K.spinRot(T1, GEO, 'Venus', 'Sun', { part: 'S', tSrc: 0, cR: null, read: 'C2' }).Om) / H.b1();
  if (cache) cache.uRule = v; return v;
}
/** (E-x) ÷ 残り(同じ置き方): 地球の項と金星の残りを同じ place・cR で・地球は tSrc・太陽は tSun */
export function ratioOf(T1, GEO, { part = 'S', cR = null, place = null, tSrc = 0, tSun = 0, uMode = 'same', phase = 'inf', axis = 'L' } = {}, cache = null) {
  const e = earthPart(T1, GEO, { part, cR, place, tSrc, tSun, phase }), r = venusRes(T1, GEO, { cR, place, tSun, uMode, axis }, cache);
  return { e: e.mag, res: r.res, ratio: e.mag / r.res, L2: r.L2, phiDeg: r.phiDeg, u: r.u, Rr: e.Rr };
}

/* ───────── 受け手ごとの局所の (S) と (L2) ───────── */
const hostOf = (mk) => (mk === 'saturn' ? 'Saturn' : 'Jupiter');
/** 受け手 key の局所の (S)(主の列 —— 源の半径 tSrc)・自転軸 ŝ・作り。衛星の 'circ' は自転軸 = 母天体の自転軸 */
export function localOf(T1, GEO, key, { tSrc = 0 } = {}, cache = null) {
  if (!DECL.recvs.includes(key)) throw new RangeError('localOf: 受け手は ' + DECL.recvs.join('・'));
  chkT(tSrc, 'localOf: tSrc');
  const ck = ['lo', key, tSrc].join('|'); if (cache && cache[ck]) return cache[ck];
  let out;
  if (DECL.planets.includes(key)) { const R = K.spinRot(T1, GEO, key, 'Sun', { part: 'S', tSrc, read: 'C2' }); out = { loc: R.Om, sHat: unit(R.sHat), kind: 'sun', parts: { sun: R.Om } }; }
  else if (DECL.moonKind[key] === 'pair') { const L = V.localOf(T1, GEO, DECL.moonKey[key], tSrc, cache); out = { loc: L.loc, sHat: L.sHat, kind: 'pair', parts: L.parts }; }
  else {
    const M = LIT334A.moons.find((x) => x.key === key.toLowerCase()), src = hostOf(M.host), r2 = T1.find((r) => r.id === src && r.src === 'Sun' && r.mag === 'm2'), ax = unit(GEO[src + '|Sun'].w);
    const Ms = C.massOf(src), Rs = K.srcRadius(src, tSrc), wSun = K.spinRot(T1, GEO, src, 'Sun', { part: 'M', read: 'W', tSrc, nPhase: 1 }).wS, wPar = Ms * D.Kball(1, M.a, Rs);
    const par = DD.circRot({ Ms, Rs, spinVec: scl(ax, Math.abs(r2.omega)), L: ax, r: M.a, m: M.m, extraW: wSun }).Om, sun = K.spinRot(T1, GEO, src, 'Sun', { part: 'S', tSrc, read: 'C2', extraW: wPar }).Om;
    out = { loc: add(sun, par), sHat: ax, kind: 'circ', parts: { sun, parent: par } };
  }
  if (cache) cache[ck] = out; return out;
}
/**
 * 受け手 key の (L2) = abs(局所 + 背景) ÷ abs(背景)(背景 (N+)・基準軸 axis・倍率 u —— 'uV' は規則の半径の (uV) を全部の受け手に同じに)。
 * 戻り値 { key, u, L2, dL2(= L2 − 1 を差で作らず), phiDeg(−局所 と背景の角 —— u に依らない), own(2 sin(φ/2) —— 受け手ごとの等大), lowest(sin φ・φ > 90° は 1), x(abs(局所) ÷ 金星の abs(S)), cosLB, kind }
 */
export function residOf(key, { T1 = E.t1Table(), GEO = E.geometry(), u = 'uV', axis = 'L', tSrc = 0 } = {}, cache = null) {
  if (!(u === 'uV' || (fin(u) && u > 0))) throw new RangeError('residOf: 倍率は uV か正の数');
  const Lc = localOf(T1, GEO, key, { tSrc }, cache), l = Lc.loc, b1 = H.b1(), uu = u === 'uV' ? uRuleOf(T1, GEO, cache) : u, bh = unit(RA.refAxis(axis, T1, GEO)), b = scl(bh, uu * b1), bm = nrm(b);
  const tot = nrm(add(l, b)), dL2 = (2 * dot(l, b) + dot(l, l)) / (bm * (tot + bm)), phiDeg = angDeg(scl(l, -1), bh), ph = phiDeg * D2R;
  const vS = localOf(T1, GEO, 'Venus', { tSrc }, cache).loc;
  return { key, u: uu, uCol: u, L2: tot / bm, dL2, phiDeg, own: 2 * Math.sin(ph / 2), lowest: phiDeg >= 90 ? 1 : Math.sin(ph), x: nrm(l) / nrm(vS), cosLB: dot(unit(l), bh), kind: Lc.kind };
}

/* ───────── T5: 残りの軸と内合の時の地球の向き ───────── */
/** 残り(金星・(uV)・(N+) L)のベクトルの、金星の公転面に対する仰角 β と面の中の方位 ψ(基底 x・y —— 第352便h の otherSrc と同じ)・自転軸との角 */
export function resAxis(T1, GEO) {
  const g = synGeom(T1, GEO), r = venusRes(T1, GEO, {}), res = add(r.S, scl(unit(RA.refAxis('L', T1, GEO)), r.bgMag)), u = unit(res);
  return { beta: Math.asin(dot(u, g.n)) / D2R, psi: Math.atan2(dot(u, g.y), dot(u, g.x)) / D2R, toSpinDeg: angDeg(res, g.V.sHat), toLDeg: angDeg(res, RA.refAxis('L', T1, GEO)) };
}
/** 内合の経度の歩み: 1 会合で内合の経度が進む角 Δ(°)・5 回の後のずれ(°/5 会合)・内合ごとの自転のずれ(°/内合 —— 仮の値) */
export function conjStep() {
  const P = G.periods(), S = 1 / (1 / P.orbV - 1 / P.orbE), dl = ((S / P.orbE) % 1) * 360, five = ((5 * dl + 180) % 360 + 360) % 360 - 180;
  return { S, stepDeg: dl, driftDeg5: five, spinShiftDeg: G.lockPhase().shiftDeg };
}
/** 残りの軸と、内合 k(0〜nConj − 1)の時の地球の向き(金星から見て太陽と反対の向き = 金星の位置の向き)のなす角(°)—— 最初の内合の経度 = ψ + d(d はノブ) */
export function conjAngles(T1, GEO, d) {
  if (!fin(d)) throw new RangeError('conjAngles: d は数');
  const A = resAxis(T1, GEO), c = conjStep(), cb = Math.cos(A.beta * D2R);
  return Array.from({ length: DECL.nConj }, (_, k) => { const lam = d + k * c.stepDeg; return Math.acos(Math.max(-1, Math.min(1, cb * Math.cos(lam * D2R)))) / D2R; });
}

/* ───────── 零試験・変異 ───────── */
export function pureScenes(T1 = E.t1Table(), GEO = E.geometry()) {
  const cache = {}, gc = {}, rel = (a, b) => Math.abs(a / b - 1);
  // ① 第353便g の数: (E-S) 内合 ÷ 残り 1.10e-12・平均 9.31e-14・(E-M) 内合 4.93e9・(L2) 0.013274 —— 自分の口で
  const rS = ratioOf(T1, GEO, {}, cache), rSm = ratioOf(T1, GEO, { phase: 'mean' }, cache), rM = ratioOf(T1, GEO, { part: 'M' }, cache);
  const gE = G.earthDrag(T1, GEO, gc), gR = G.residualOf(T1, GEO, { magId: 'uV' }, gc);
  const sameG = rel(rS.e, gE.infS) < 1e-9 && rel(rSm.e, gE.meanS) < 1e-9 && rel(rM.e, gE.infM) < 1e-9 && rel(rS.res, gR.res) < 1e-9 && rel(rS.L2, gR.resOverBg) < 1e-9;
  // ② pointRotR(Rr = null)= 第352便h の pointRot・earthPart(既定)= otherSrc の inf.S
  const g = synGeom(T1, GEO), p = sub(scl(g.x, g.Q.a), scl(g.x, g.V.a)), a1 = pointRotR({ m: g.V.m, v: [0, 0, 0], Ms: g.Q.m, p, spin: g.spinE }), a2 = H.pointRot({ m: g.V.m, v: [0, 0, 0], Ms: g.Q.m, p, spin: g.spinE });
  const o = H.otherSrc(T1, GEO, 'Earth'), e0 = earthPart(T1, GEO, {});
  const pr = nrm(sub(a1, a2)) / nrm(a2), oS = nrm(sub(e0.vec, o.inf.S)) / nrm(o.inf.S);
  // ③ 統括の数え直し 3 の c_R の行(等大の残り ÷ 背景 = (L2)・等大の倍率 ÷ k)—— 自分の口と第353便c の cancelOf
  const cRrows = DECL.anchor.cR.map(([cR, L2w, uw]) => { const r = venusRes(T1, GEO, { cR }, cache), c = RC.cancelOf(T1, GEO, 'Venus', 'Sun', { place: 'field', cR });
    return { cR, L2: r.L2, u: r.u * H.b1() / K.DECL.omegaG, vsC: Math.abs(r.L2 / c.residEqual - 1), L2w, uw }; });
  // ④ (P-応): 場は規則の半径 —— 比は規則の半径と同じ・率の倍は両方に同じ(比に出ない)
  const rResp = ratioOf(T1, GEO, { place: 'resp' }, cache), respSame = rel(rResp.ratio, rS.ratio) < 1e-12;
  // ⑤ (L2) を全部の受け手で: 金星 = 0.013274・イオ・月 = 第352便v の cancelPoint の (uV) の残り・(L2) − 1 の差で作らない形 = 差(0.0487 の列)
  const rv = residOf('Venus', { T1, GEO }, cache), rio = residOf('Io', { T1, GEO }, cache), rmo = residOf('Moon', { T1, GEO }, cache);
  const vio = V.cancelPoint(T1, GEO, 'Io|Jupiter', { bg: 'Np', axis: 'L' }), vmo = V.cancelPoint(T1, GEO, 'Moon|EarthHi', { bg: 'Np', axis: 'L' });
  const vSame = rel(rv.L2, gR.resOverBg) < 1e-9 && rel(rio.L2, vio.resAtUV) < 1e-9 && rel(rmo.L2, vmo.resAtUV) < 1e-9;
  const r0487 = residOf('Mercury', { T1, GEO, u: 0.0487 }, cache), dDirect = r0487.L2 - 1, dStable = Math.abs(dDirect / r0487.dL2 - 1);
  // ⑥ 衛星の円の道: 母天体由来は母天体の自転と逆向き(赤道面・形 M —— 第352便k の閉じた形の向き)・(S) の大きさは距離の −3 乗の近く(エウロパ ÷ ガニメデ)
  const lE = localOf(T1, GEO, 'Europa', {}, cache), lG = localOf(T1, GEO, 'Ganymede', {}, cache), cosPar = dot(unit(lE.parts.parent), lE.sHat);
  const slope = Math.log(nrm(lE.parts.parent) / nrm(lG.parts.parent)) / Math.log(LIT334A.moons[1].a / LIT334A.moons[2].a);
  // ⑦ T5: 内合の経度の歩み(約 215.5°・5 回で −2.4° の桁)・残りの軸は金星の公転面の近く(第352便n —— 基準軸に 89.6〜89.7°)
  const cs = conjStep(), ra = resAxis(T1, GEO);
  // 変異: 内合を外合に替えると (E-S) は小さくなる(距離が大きい)・(L2) の差の形の符号を逆にすると差と合わない
  const mSup = earthPart(T1, GEO, { phase: 'sup' }).mag < e0.mag, mSign = Math.abs(dDirect / (-r0487.dL2) - 1) > 0.5;
  const rej = [() => earthPart(T1, GEO, { part: 'X' }), () => earthPart(T1, GEO, { cR: 0 }), () => earthPart(T1, GEO, { phase: 'now' }), () => venusRes(T1, GEO, { uMode: 'big' }),
    () => residOf('Pluto'), () => residOf('Venus', { u: -1 }), () => pointRotR({ m: 1, v: [0, 0, 0], Ms: 1, p: [1, 0, 0], spin: [0, 0, 0], Rr: 0 }), () => earthPart(T1, GEO, { tSrc: 0.5 })]
    .map((fn) => { try { fn(); return false; } catch (er) { return er instanceof RangeError; } });
  return { esInf: rS.ratio, esMean: rSm.ratio, emInf: rM.ratio, L2: rS.L2, sameG, pr, oS, cRrows, respSame, vSame, dStable, cosPar, slope, step: cs.stepDeg, drift: cs.driftDeg5, shift: cs.spinShiftDeg,
    resToL: ra.toLDeg, resBeta: ra.beta, mSup, mSign, rejects: rej };
}
const p3 = (x, w) => Number(Number(x).toPrecision(3)).toExponential(2) === Number(w).toExponential(2);
const p5 = (x, w) => Number(Number(x).toPrecision(5)) === Number(Number(w).toPrecision(5));
const p6 = (x, w) => Number(Number(x).toPrecision(6)) === Number(Number(w).toPrecision(6));
export function pureGates(S) {
  const A = DECL.anchor;
  return {
    anchorG: p3(S.esInf, A.esInf) && p3(S.esMean, A.esMean) && p3(S.emInf, A.emInf) && p5(S.L2, A.L2),
    sameAsG: S.sameG,
    pointRot: S.pr < 1e-12 && S.oS < 1e-12,
    anchorCR: S.cRrows.every((r) => p5(r.L2, r.L2w) && p6(r.u, r.uw) && r.vsC < 1e-9),
    respSame: S.respSame,
    residAll: S.vSame && S.dStable < 1e-3,
    circMoon: S.cosPar < -0.99 && Math.abs(S.slope + 3) < 0.05,
    conj: Math.abs(S.step - 215.5) < 0.2 && Math.abs(S.drift + 2.4) < 0.3 && Number(S.shift.toFixed(3)) === 0.513 && S.resToL > 89 && S.resToL < 91 && Math.abs(S.resBeta) < 10,
    mutants: S.mSup && S.mSign,
    rejects: S.rejects.length === 8 && S.rejects.every(Boolean),
  };
}
