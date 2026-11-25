// 第353便p(原仮定者の回答(2026-11-25 —— 第151報)AN1045「規則の半径」・統括の検証項目 R480):
//   **打ち消しの点の一覧(第352便v の 17 組)を、源の扁平率(第353便d の (O2b) —— 距離に依らない倍 σ = (1 − f)^(−2/3))と、受け手の半径の係数
//   (第353便c の (P-場) —— 場の式の自分の重みと平均の球の半径を c_R × 観測半径に)を同時に置いて数え直す口 —— 診断だけ**
//   (器 tests/exp-w353p-cancelstd.mjs と QA behavior.cancelstd353p・docs.cancelstd353p が読む —— html を読まない・ファイルを読まない・状態を持たない。
//   後のラウンドの枝もこの口を import してよい)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない。既存の lib は呼ぶだけ(本文は変えない):
//   第353便d(obRot・obSatParts・obCancel・specFor・litOf・makeFieldOb・cancelRows)・第353便c(cancelOf・cRStar・ioRows)・第352便v(cancelPoint・allPairs・uVt・localOf)・
//   第352便k(spinRot・srcRadius・recvRadius・formOf)・第352便e(sunInput・rotOf)・第352便c(refAxis)・第352便d(bgVec)・第351便c(pairInput・PARENT_ROWS)・
//   第348便h(rot3・YK)・第350便b(equivR)・第347便h(gaussLegendre)・第348便c(massOf・radiusOf)・第312便a(Kball)・第334便a(LIT334A —— 衛星の質量・半径・軌道の半径〔文献の値・未照合〕)・
//   第347便e(t1Table・geometry)。仮の値の lib(第352便b)には届かない(import の閉包に入れない)。
//
// ■ 置き方(place —— 表 1 の列):
//   (i)  'rule'  これまで(源は球・受け手は規則の半径 —— 第352便v と同じ数)。
//   (ii) 'ob'    源に (O2b) の σ(扁平率 = リポジトリの値〔第334便a の LIT334A —— 文献の値・未照合〕・R_q = 規則の半径。扁平率の無い源〔冥王星・カロン〕はノブ f_knob〔値は未照合〕)。
//   (iii)'field' 受け手に (P-場) の c_R(全部の受け手に同じ c_R)。
//   (iv) 'both'  (ii) + (iii)。
//   (v)  'resp'  (P-応)(場の式は規則の半径 —— 向きと打ち消しは (i) と同じ・率の倍だけが第353便c の rateMult)。
// ■ 量: 局所 = 組の (S) の和(衛星は太陽由来 + 母天体由来)。uEq = abs(局所) ÷ abs(倍率 1 の背景)・x = uEq ÷ uV(置き方)—— uV(置き方)は金星 ← 太陽を**同じ置き方**で数えた
//   等大の倍率(金星の x は 1)。resEq = 等大の倍率での残り(合成 ÷ 背景)・resAtUV = 金星の条件の倍率 uV(置き方)での残り・phiDeg = −局所と背景のなす角。
//   打ち消しで小さくなる量は、大きい数の差で作らず、ベクトルの和の大きさで数える(第352便v と同じ)。
// ■ 扁平率の式・受け手の係数・イオの状態は決めない(「同じ背景で読める組」は x の帯に入る組の数え上げ —— 候補の表)。この場・この置き方・このノブでは、の表。
import * as Dd from './lib-w353d-srcoblate.mjs';
import * as Cc from './lib-w353c-recvradius.mjs';
import * as V from './lib-w352v-cancelmap.mjs';
import * as K from './lib-w352k-spinform.mjs';
import * as SE from './lib-w352e-sunrecv.mjs';
import * as CR from './lib-w352c-refaxis.mjs';
import * as PS from './lib-w352d-precsense.mjs';
import * as SP from './lib-w351c-srcparts.mjs';
import * as G3 from './lib-w348h-axisgeo3.mjs';
import * as SC from './lib-w350b-sphereconv.mjs';
import * as H from './lib-w347h-axisdiff.mjs';
import * as C from './lib-w348c-axisbalance.mjs';
import * as D from './lib-w312a-decay.mjs';
import * as E from './lib-w347e-spintorque.mjs';
import { LIT334A } from './lib-w334a-heightlaw.mjs';

export const LIB_VERSION = 'w353p-cancelstd-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const D2R = Math.PI / 180;
const { dot, crs, nrm, scl, add, sub, unit } = K.vec;
const rel = (a, b) => nrm(sub(a, b)) / Math.max(nrm(b), 1e-300);
const GL = H.gaussLegendre(K.DECL.ballN);

/* ───────── 宣言 ───────── */
export const DECL = Object.freeze({
  places: Object.freeze(['rule', 'ob', 'field', 'both', 'resp']),
  placeNames: Object.freeze({ rule: '(i) これまで(球・規則の半径)', ob: '(ii) 源に (O2b) の σ', field: '(iii) 受け手に (P-場) の c_R', both: '(iv) (ii) + (iii)', resp: '(v) (P-応)' }),
  /** 表 1 の c_R(第353便c の金星の残り 2% 以下の上端 0.0128 と、谷の 1e-3) */
  cRs: Object.freeze([1e-3, 0.0128]),
  /** 扁平率の無い源のノブ(値は未照合)—— 表 1 は 0.1・表 2 は格子 */
  fKnob: 0.1,
  /** 表 2(イオと金星)の格子: 木星の扁平率 f(リポジトリの値 0.06487 を含む —— ほかはノブ)× c_R(null = 規則の半径) */
  fGrid: Object.freeze([0, 0.03, 0.06487, 0.1, 0.15, 0.2, 0.3]),
  cRGrid: Object.freeze([null, 1e-4, 3e-4, 1e-3, 3e-3, 0.0128, 0.03, 0.1, 0.3, 1]),
  /** x の帯(表 1 の数える欄) */
  bands: Object.freeze([[0.9, 1.1], [0.5, 2]]),
  /** 金星の残りの目安(表 2 —— 第353便c の 2%) */
  venusBand: 0.02,
  pairs: V.allPairs(),
  /** 表 3 の衛星(LIT334A —— 文献の値・未照合)と母天体 */
  moons: Object.freeze(['io', 'europa', 'ganymede', 'callisto', 'titan']), moonHost: Object.freeze({ jupiter: 'Jupiter', saturn: 'Saturn' }),
  /** 点検の数(第353便d の報告 0.935・0.086(3 桁で 0.0864)/第353便c の 0.573/第352便v の 17 組の x —— 有効数字 5 桁・統括の脚本の桁) */
  anchor: Object.freeze({ ioXob: '0.935', ioResOb: '0.0864', ioXcR1: '0.573', ioXrule: '0.891',
    x17: Object.freeze({ 'Mercury|Sun': '6.5270', 'Venus|Sun': '1.0000', 'Earth|Sun': '0.37680', 'Mars|Sun': '0.10678', 'Jupiter|Sun': '0.0026778', 'Saturn|Sun': '0.00042933',
      'Uranus|Sun': '0.000053376', 'Neptune|Sun': '0.000013878', 'Moon|Sun': '0.37680', 'Io|Sun': '0.0026778', 'Pluto|Sun': '0.0000060606', 'Moon|EarthHi': '0.37680',
      'Moon|EarthLo': '0.37680', 'Io|Jupiter': '0.89414', 'Pluto|Charon': '0.0000060606', 'Charon|Pluto': '0.0000060606', 'Sun|Planets': '1.4200e-10' }) }),
  main: Object.freeze({ part: 'S', tSrc: 0, read: 'C2', bg: 'Np', axis: 'L' }),
  judge: '丸めの桁の床: 零試験は相対 1e-9(尺度の走り直しで揺れる)・表の照合は有効数字 5 桁・逐語の表は 3 桁',
});

/* ───────── 源の扁平の仕様 ───────── */
/**
 * ob: null(球)/'lit'(全部の源に (O2b)・リポジトリの f・R_q 規則の半径 —— f の無い源は fKnob)/{ base: null|'lit', f: { 源の名: f } }(源ごとに f を上書き)。
 * 戻り値 { spec(src) → obSpec の戻り値か null, knob: Set(ノブを使った源) }
 */
export function obPlan(ob, { fKnob = DECL.fKnob } = {}) {
  if (!(ob === null || ob === 'lit' || (typeof ob === 'object' && (ob.base === null || ob.base === 'lit' || ob.base === undefined)))) throw new RangeError('obPlan: ob は null・lit・{ base, f }');
  const base = ob === null ? null : ob === 'lit' ? 'lit' : (ob.base === undefined ? null : ob.base), over = ob && typeof ob === 'object' ? (ob.f || {}) : {};
  const knob = new Set();
  const spec = (src) => {
    if (Object.prototype.hasOwnProperty.call(over, src)) { const f = over[src]; if (!(fin(f) && f >= 0 && f < 1)) throw new RangeError('obPlan: 0 ≤ f < 1'); return f === 0 ? null : Dd.specFor(src, { model: 'O2b', f, rq: 'rule' }); }
    if (base === null) return null;
    const L = Dd.litOf(src);
    if (L.f === null) { knob.add(src); return fKnob === 0 ? null : Dd.specFor(src, { model: 'O2b', f: fKnob, rq: 'rule' }); }
    return L.f === 0 ? null : Dd.specFor(src, { model: 'O2b', f: 'lit', rq: 'rule' });
  };
  return { spec, knob };
}

/* ───────── 太陽を受け手にした組の場(第352便e の rotOf と同じ作り + 受け手の半径 Rr と源の扁平 ob)───────── */
/** P(sunInput の形)・Rs(源の半径)・Rr(受け手の半径)・ob(obSpec の戻り値か null)。Rr = 規則の半径・ob null で第352便e の rotOf(part 'S')と同じ数(零試験) */
export function rotP(P, { Rs, Rr, ob = null, extraW = 0, nPhase = K.DECL.nPhase } = {}) {
  if (!(fin(Rs) && Rs > 0 && fin(Rr) && Rr > 0)) throw new RangeError('rotP: R_s・R_r > 0');
  const F = K.formOf('M1');
  const x0 = crs(P.sAx, P.nHat), x = nrm(x0) > 1e-12 ? unit(x0) : unit(crs(P.nHat, Math.abs(P.nHat[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0])), y = crs(P.nHat, x);
  const radii = GL.x.map((xi, i) => { const rho = 0.5 * Rr * (xi + 1); return [SC.equivR(Rr, rho), 0.5 * Rr * GL.w[i] * 5 * Math.pow(rho, 4) / Math.pow(Rr, 5)]; });
  const spin = scl(P.sAx, P.ws), kernel = { kind: 'ball', al: F.al }, rot = F.form === 'M' ? { form: 'M' } : { form: 'q', q: F.q };
  let Om = [0, 0, 0];
  for (const [Ri, wt] of radii) {
    let mW = [0, 0, 0];
    for (let j = 0; j < nPhase; j++) {
      const ph = 2 * Math.PI * (j + 0.5) / nPhase, rh = add(scl(x, Math.cos(ph)), scl(y, Math.sin(ph)));
      const f = Dd.makeFieldOb({ sources: [{ m: P.Ms, R: Rs, p: scl(rh, -P.a), v: [0, 0, 0], spin, ob }], recv: { m: P.m, R: Ri, p: [0, 0, 0], v: [0, 0, 0] }, W0: 0, extraW, kernel, rot, self: true });
      mW = add(mW, scl(G3.rot3('W', f, [0, 0, 0], { Rb: Ri }), 1 / nPhase));
    }
    Om = add(Om, scl(mW, wt));
  }
  return { Om, A0: P.m * D.Kball(F.al, 0, Rr), wS: P.Ms * D.Kball(F.al, P.a, Rs) };
}

/* ───────── 局所の (S)(置き方つき)───────── */
const cROf = (place, cR) => (place === 'field' || place === 'both' ? cR : null);
const obOf = (place, ob) => (place === 'ob' || place === 'both' ? (ob === undefined ? 'lit' : ob) : null);
/**
 * 組 key の局所の (S)。o: { ob(obPlan の引数), cR(null = 規則の半径) }。戻り値 { loc, parts, sHat, knob:[…] }。
 * ob null・cR null で第352便v の localOf(t 0)と同じ数(零試験)。衛星の組は第353便d の obSatParts と同じ作りに cR を足す(obRot の cR の口)。
 */
export function localStd(T1, GEO, key, { ob = null, cR = null } = {}, cache = null) {
  const ck = ['loc', key, JSON.stringify(ob), cR].join('|'); if (cache && cache[ck]) return cache[ck];
  if (!(cR === null || (fin(cR) && cR > 0))) throw new RangeError('localStd: c_R は null か > 0');
  const pl = obPlan(ob); let v;
  if (key === V.DECL.sunRecv) {
    let sum = [0, 0, 0], sHat = null; const by = {};
    for (const p of SE.PLANETS) { const P = SE.sunInput(T1, GEO, p), Rr = cR === null ? G3.YK * P.m : cR * C.radiusOf('Sun'); const Om = rotP(P, { Rs: K.srcRadius(p, 0), Rr, ob: pl.spec(p) }).Om; by[p] = Om; sum = add(sum, Om); sHat = unit(P.sHat); }
    v = { loc: sum, parts: { planets: sum }, by, sHat };
  } else if (key.endsWith('|Sun')) {
    const [id] = key.split('|'), R = Dd.obRot(T1, GEO, id, 'Sun', { part: 'S', tSrc: 0, cR, ob: pl.spec('Sun') });
    v = { loc: R.Om, parts: { sun: R.Om }, sHat: unit(R.sHat) };
  } else {
    const [id, src] = key.split('|'), sunKey = SP.PARENT_ROWS[key];
    if (!sunKey) throw new RangeError('localStd: 組 ' + key);
    const [sid, ssrc] = sunKey.split('|');
    const wSun = K.spinRot(T1, GEO, sid, ssrc, { part: 'M', read: 'W', tSrc: 0, nPhase: 1 }).wS, wPar = K.spinRot(T1, GEO, id, src, { part: 'M', read: 'W', tSrc: 0, nPhase: 1 }).wS;
    const sun = Dd.obRot(T1, GEO, sid, ssrc, { part: 'S', tSrc: 0, cR, extraW: wPar, ob: pl.spec(ssrc) }).Om, par = Dd.obRot(T1, GEO, id, src, { part: 'S', tSrc: 0, cR, extraW: wSun, ob: pl.spec(src) });
    v = { loc: add(sun, par.Om), parts: { sun, parent: par.Om }, sHat: unit(par.sHat) };
  }
  v.knob = [...pl.knob].sort();
  if (cache) cache[ck] = v; return v;
}
/** 背景のベクトル(向き bg・基準軸 axis・倍率 1) */
export const bg1 = (T1, GEO, bg = 'Np', axis = 'L') => V.bgOf(T1, GEO, bg, axis, 1);

/**
 * 約束の口: 組 key を置き方 place で。o: { ob(place 'ob'・'both' の扁平 —— 既定 'lit'), place, cR(place 'field'・'both'・'resp' の c_R), bg, axis }。
 * 戻り値 { key, place, x, uEq, uV, resEq, resAtUV, resMin, phiDeg, cosLocBg, mode, xPar, knob, rateMult('resp' のとき —— 受け手の率の倍) }。
 */
export function stdCancel(T1, GEO, key, { ob = 'lit', place = 'rule', cR = null, bg = 'Np', axis = 'L' } = {}, cache = null) {
  if (!DECL.places.includes(place)) throw new RangeError('stdCancel: 置き方は ' + DECL.places.join('・'));
  if ((place === 'field' || place === 'both') && !(fin(cR) && cR > 0)) throw new RangeError('stdCancel: (P-場) は c_R > 0');
  const cr = cROf(place, cR), o = obOf(place, ob);
  const Lc = localStd(T1, GEO, key, { ob: o, cR: cr }, cache), Lv = localStd(T1, GEO, 'Venus|Sun', { ob: o, cR: cr }, cache), b1 = bg1(T1, GEO, bg, axis), nb = nrm(b1);
  const uEq = nrm(Lc.loc) / nb, uV = nrm(Lv.loc) / nb, uMin = V.uForMin(b1, Lc.loc), cosLB = dot(unit(Lc.loc), unit(b1));
  const res = (u) => nrm(add(scl(b1, u), Lc.loc)) / (u * nb);
  const phiDeg = Math.atan2(nrm(crs(scl(Lc.loc, -1), b1)), dot(scl(Lc.loc, -1), b1)) / D2R;
  let rm = null;
  if (place === 'resp') { const id = key.split('|')[0]; rm = id === 'Sun' ? null : Cc.rateMult(id, { cR: cR === null ? 1 : cR, ref: 'obs' }); }
  return { key, place, cR: cr, x: uEq / uV, uEq, uV, resEq: res(uEq), resAtUV: res(uV), resMin: nrm(add(scl(b1, uMin), Lc.loc)) / nrm(Lc.loc), phiDeg, cosLocBg: cosLB, mode: cosLB < 0 ? 'cancel' : 'add',
    xPar: Lc.parts.parent ? nrm(Lc.parts.parent) / nb / uV : null, knob: Lc.knob, rateMult: rm };
}

/* ───────── 表 3 の材料: 受け手の自分の重み ───────── */
/**
 * 衛星 mk(LIT334A)の自分の重み A0(c_R)= m K1(0, c_R R) と母天体の重み wS = M K1(a, R_源 規則)・太陽の重み wSun(母天体の距離)・
 * c_R★(A0 = wS —— 二分)・母天体の重み ÷ 自分の重み(規則の半径・c_R 1)。
 */
export function moonWeights(T1, GEO, mk) {
  const M = LIT334A.moons.find((x) => x.key === mk); if (!M) throw new RangeError('moonWeights: 衛星 ' + mk);
  const src = DECL.moonHost[M.host], Ms = C.massOf(src), Rs = K.srcRadius(src, 0), wS = Ms * D.Kball(1, M.a, Rs);
  const wSun = K.spinRot(T1, GEO, src, 'Sun', { part: 'M', read: 'W', nPhase: 1 }).wS;
  const A0 = (cR) => M.m * D.Kball(1, 0, cR === null ? G3.YK * M.m : cR * M.R);
  const f = (lc) => Math.log(A0(Math.pow(10, lc)) / wS);
  let lo = -30, hi = 10, cRs = null;
  if (f(lo) > 0 && f(hi) < 0) { for (let i = 0; i < 200; i++) { const mid = 0.5 * (lo + hi); if (f(mid) > 0) lo = mid; else hi = mid; } cRs = Math.pow(10, 0.5 * (lo + hi)); }
  return { key: mk, name: M.name, src, m: M.m, R: M.R, a: M.a, wS, wSun, A0rule: A0(null), A0cR1: A0(1), cRStar: cRs, wSoverA0rule: wS / A0(null), wSoverA0cR1: wS / A0(1), closed: A0(1) / wS };
}

/* ───────── 零試験 ───────── */
export function pureScenes(T1 = E.t1Table(), GEO = E.geometry()) {
  const cache = {}, A = DECL.anchor;
  // ① (i) は第352便v の cancelPoint と同じ(17 組 —— x・resEq・resAtUV・cos)
  const vs17 = DECL.pairs.map((k) => { const a = stdCancel(T1, GEO, k, { place: 'rule' }, cache), b = V.cancelPoint(T1, GEO, k, { tSrc: 0, bg: 'Np', axis: 'L' });
    return { key: k, x: a.x, xV: b.x, d: Math.max(Math.abs(a.x / b.x - 1), Math.abs(a.resEq / b.resEq - 1), Math.abs(a.resAtUV / b.resAtUV - 1), Math.abs(a.cosLocBg - b.cosLocBg)) }; });
  // ② (ii) のイオ・金星は第353便d の cancelRows の (O2b) リポジトリの f・規則の半径の列と同じ(x 0.935・金星の条件での残り 0.0864)
  const dRow = Dd.cancelRows(T1, GEO).find((r) => r.id === 'O2bLitRule'), ioOb = stdCancel(T1, GEO, 'Io|Jupiter', { place: 'ob' }, cache), vOb = stdCancel(T1, GEO, 'Venus|Sun', { place: 'ob' }, cache);
  const vsD = { x: ioOb.x, xD: dRow.io.x, res: ioOb.resAtUV, resD: dRow.io.resAtVenus, vRes: vOb.resEq, vResD: dRow.venus.resEq };
  // ③ 第353便d の obCancel(扁平なし・cR null)と同じ局所(衛星と太陽の組)
  const vsObCancel = Math.max(...['Io|Jupiter', 'Moon|EarthHi', 'Earth|Sun'].map((k) => rel(localStd(T1, GEO, k, {}, cache).loc, Dd.obCancel(T1, GEO, k, {}).loc)));
  // ④ (iii) の金星は第353便c の cancelOf (P-場) と同じ(φ)・イオの母天体由来だけの x は第353便c の ioRows(c_R 1 —— 0.573)
  const cV = Cc.cancelOf(T1, GEO, 'Venus', 'Sun', { place: 'field', cR: 0.0128 }), sV = stdCancel(T1, GEO, 'Venus|Sun', { place: 'field', cR: 0.0128 }, cache);
  const ioC = Cc.ioRows(T1, GEO).find((r) => r.place === 'field' && r.cR === 1), ioS = stdCancel(T1, GEO, 'Io|Jupiter', { place: 'field', cR: 1 }, cache);
  const ioParOnly = nrm(Dd.obRot(T1, GEO, 'Io', 'Jupiter', { cR: 1 }).Om) / nrm(Dd.obRot(T1, GEO, 'Venus', 'Sun', { cR: 1 }).Om);
  const vsC = { phi: sV.phiDeg, phiC: cV.phiDeg, xPar1: ioParOnly, xParC: ioC.x, xFull1: ioS.x };
  // ⑤ 太陽を受け手にした場 rotP は第352便e の rotOf と同じ(規則の半径・扁平なし)
  const vsRotOf = Math.max(...SE.PLANETS.map((p) => { const P = SE.sunInput(T1, GEO, p), Rs = K.srcRadius(p, 0); return rel(rotP(P, { Rs, Rr: G3.YK * P.m }).Om, SE.rotOf({ ...P, Rs }, { part: 'S' }).Om); }));
  // ⑥ (v) (P-応) は (i) と同じ x・残り(17 組)
  const vsResp = Math.max(...DECL.pairs.map((k) => { const a = stdCancel(T1, GEO, k, { place: 'resp', cR: 1 }, cache), b = stdCancel(T1, GEO, k, { place: 'rule' }, cache); return Math.max(Math.abs(a.x / b.x - 1), Math.abs(a.resEq / b.resEq - 1)); }));
  // ⑦ 置き方の恒等: 金星の x は全部の置き方で 1・ob の f 0 の上書きは球と同じ
  const venus1 = DECL.places.map((p) => stdCancel(T1, GEO, 'Venus|Sun', { place: p, cR: 0.0128 }, cache).x);
  const f0 = rel(localStd(T1, GEO, 'Io|Jupiter', { ob: { base: null, f: { Jupiter: 0 } } }, cache).loc, localStd(T1, GEO, 'Io|Jupiter', {}, cache).loc);
  // ⑧ c_R★: イオ・月(第353便c の cRStar と同じ —— 実在の組)と moonWeights のイオ(円の道 —— 同じ桁)
  const csIo = Cc.cRStar('Io', 'Jupiter', T1, GEO), mwIo = moonWeights(T1, GEO, 'io');
  // ⑨ 拒否
  const rejects = [() => stdCancel(T1, GEO, 'Io|Jupiter', { place: 'X' }), () => stdCancel(T1, GEO, 'Io|Jupiter', { place: 'field' }), () => obPlan('obs'), () => obPlan({ f: { Jupiter: 1.2 } }).spec('Jupiter'),
    () => localStd(T1, GEO, 'Io|Saturn'), () => localStd(T1, GEO, 'Io|Jupiter', { cR: -1 }), () => moonWeights(T1, GEO, 'phobos'), () => rotP({}, { Rs: 0, Rr: 1 })]
    .map((fn) => { try { fn(); return false; } catch (e) { return e instanceof RangeError; } });
  return { vs17, vsD, vsObCancel, vsC, vsRotOf, vsResp, venus1, f0, csIo: { cR: csIo.cR, mw: mwIo.cRStar }, rejects, anchor: A };
}
export function pureGates(S) {
  const A = DECL.anchor, p = (x, n) => Number(x).toPrecision(n), r9 = (a, b) => Math.abs(a / b - 1) < 1e-9;
  return {
    rule17: S.vs17.length === 17 && S.vs17.every((r) => r.d < 1e-9 && (A.x17[r.key].includes('e') ? Number(r.x).toExponential(4) === A.x17[r.key] : p(r.x, 5) === A.x17[r.key])),
    ob353d: r9(S.vsD.x, S.vsD.xD) && r9(S.vsD.res, S.vsD.resD) && r9(S.vsD.vRes, S.vsD.vResD) && p(S.vsD.x, 3) === A.ioXob && p(S.vsD.res, 3) === A.ioResOb,
    obCancel353d: S.vsObCancel < 1e-9,
    field353c: Math.abs(S.vsC.phi - S.vsC.phiC) < 1e-9 * Math.max(1, S.vsC.phiC) && r9(S.vsC.xPar1, S.vsC.xParC) && p(S.vsC.xPar1, 3) === A.ioXcR1,
    rotOf352e: S.vsRotOf < 1e-9,
    resp: S.vsResp < 1e-12,
    identity: S.venus1.every((x) => Math.abs(x - 1) < 1e-12) && S.f0 < 1e-12,
    cRStar: S.csIo.cR > 0 && S.csIo.mw > 0 && Math.abs(Math.log10(S.csIo.cR / S.csIo.mw)) < 0.5,
    rejects: S.rejects.length === 8 && S.rejects.every(Boolean),
  };
}
