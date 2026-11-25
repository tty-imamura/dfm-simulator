// 第353便k(原仮定者の回答(2026-11-25 —— 第151報)AN1045・統括の検証項目 R475):
//   **回答の基準(引きずる側 = 規則の半径 + 扁平率・引きずられる側 = 観測半径 × 構造の係数のノブ)で作った円盤引きずりの側の輪の場 —— 土星の環と公転面の集まり —— 診断だけ**
//   (器 tests/exp-w353k-ringstd.mjs と QA behavior.ringstd353k・docs.ringstd353k が読む —— html を読まない・ファイルを読まない・状態を持たない)。
//   〔第353便h〕の結果: これまでの円盤引きずりの側の輪の場(〔第351便j〕の輪 = 〔第350便g〕の在位の形の場)は、源の半径 = 土星の観測の半径・受け手の自分の重み = 規則の半径 ——
//   回答の基準と逆の置き方。本 lib は同じ場の作り(源 1 つ・在位の形・核 K1・源の回転は球のモーメント・自分の重みを分母に)のまま、
//   (1) 源の半径(規則/観測)、(2) 源の扁平((O0) 球・(O1) 重みの四重極〔観測の赤道半径・J2 はリポジトリの数〕・(O2b) 体積を保つ扁平の倍 σ —— 〔第353便d〕の obSpec・specFor・makeFieldOb)、
//   (3) 受け手(輪の粒子)の自分の重み(規則の半径/観測半径 × c_R —— 粒子の「観測半径」は無いので粒子の大きさ a と密度 ρ をノブ(値は未照合)の格子で振る)を引数にする。
//   場は 2 つの作りで持つ: (F2) 円盤引きずりの側の作り(〔第351便j〕の ringOmega と同じ —— 土星の単位・源 1 つ・太陽の重み無し)/
//   (F1) 軸引きずりの (S) の作り(〔第352便s〕の ringRot・〔第353便d〕の circRot と同じ —— SI・太陽の重みを分母に)。どちらも輪の法線を傾けるのは源の自転の分 (S) だけ(〔第353便h〕の ④)。
//   アプリの引きずり・自転・内蔵の本・受理器・physics の鍵は変えない。既存の lib は呼ぶだけ(本文と版は変えない):
//   第353便h(diskRow・axialRow・yardOfRate・DECL)・第353便d(obSpec・specFor・makeFieldOb・litOf)・第353便c(cancelOf —— 共通の点検の数)・第351便j(ringBasis・normalAt・ringRate)・
//   第352便s(saturnSpin・tiltedNormal・ringRates・uVt)・第352便k(srcRadius・spinRot)・第352便za(topicCell・DECL —— 公転面の題の物差し)・第352便c(refAxis)・第351便c(pairInput・perpOf・raiseRate)・
//   第350b(equivR)・第347便h(gaussLegendre)・第348便h(rot3・YK)・第348便d(saturnUnits・LIT・DECL)・第348便c(massOf・radiusOf)・第338便d(centerKm・srcOf)・第312便a(Kball)・第347便e(t1Table・geometry)。
//
// ■ 物差し: 環は〔第353便h〕のまま(第348便d の LIT —— 1e7 年で傾きが e 分の 1 —— 文献の値・未照合)。公転面は〔第352便za〕の題「公転面の集まり」(30° → 7° の 23°・太陽系の年齢)。
// ■ 言わないこと: 環の傾きの答え・円盤引きずりの型とは書かない。この場・この置き方・このノブでは、の表。
import * as H from './lib-w353h-ringdisk.mjs';
import * as OB from './lib-w353d-srcoblate.mjs';
import * as RC from './lib-w353c-recvradius.mjs';
import * as RJ from './lib-w351j-ringstep.mjs';
import * as S2 from './lib-w352s-satring.mjs';
import * as K from './lib-w352k-spinform.mjs';
import * as Z from './lib-w352za-sconseq.mjs';
import * as CR from './lib-w352c-refaxis.mjs';
import * as SP from './lib-w351c-srcparts.mjs';
import * as SC from './lib-w350b-sphereconv.mjs';
import * as AD from './lib-w347h-axisdiff.mjs';
import * as G3 from './lib-w348h-axisgeo3.mjs';
import * as DA from './lib-w348d-diskaxis.mjs';
import * as C from './lib-w348c-axisbalance.mjs';
import * as RB from './lib-w338d-ringbook.mjs';
import * as DK from './lib-w312a-decay.mjs';
import * as E from './lib-w347e-spintorque.mjs';

export const LIB_VERSION = 'w353k-ringstd-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const D2R = Math.PI / 180;
const { dot, crs, nrm, scl, add, sub, unit } = K.vec;
const rel = (a, b) => Math.abs(a - b) / Math.max(Math.abs(b), 1e-300);
const GL = AD.gaussLegendre(K.DECL.ballN);
const YR = 365.25 * 86400;

/* ───────── 宣言(走らせた格子と物差しの記録 —— 式の形の宣言ではない)───────── */
export const DECL = Object.freeze({
  centers: H.DECL.centers, tiltDeg: 1,
  srcs: Object.freeze(['rule', 'obs']), srcNames: Object.freeze({ rule: '規則の半径', obs: '観測の半径' }),
  obs: Object.freeze(['O0', 'O1', 'O2b']),
  obNames: Object.freeze({ O0: '(O0) 球', O1: '(O1) 重みの四重極(観測の赤道半径・J2 はリポジトリの数)', O2b: '(O2b) 体積を保つ扁平の倍 σ(f はリポジトリの数)' }),
  recvKinds: Object.freeze(['rule', 'obs']),
  /** 粒子の大きさ a(m)・構造の係数 c_R・粒子の密度 ρ(kg/m³)—— どれもノブ(値は未照合) */
  sizes: Object.freeze([0.01, 0.1, 1, 10]), cRs: Object.freeze([1e-3, 1e-2, 0.1, 1]), rho: 900,
  /** 表 1 の代表の受け手(粒子 1 m・c_R 1 —— ノブ(値は未照合)) */
  recvMain: Object.freeze({ kind: 'obs', a: 1, cR: 1 }),
  frames: Object.freeze(['F2', 'F1']),
  frameNames: Object.freeze({ F2: '(F2) 円盤引きずりの側の作り(〔第351便j〕の輪の場・源 1 つ)', F1: '(F1) 軸引きずりの (S) の作り(〔第352便s〕の輪・太陽の重みを分母に)' }),
  /** 公転面の集まり(〔第352便za〕の題): 源 = 太陽・輪の法線 = 基準軸 L・受け手 = 惑星そのもの(観測半径 × c_R)/規則の半径 */
  planePlanets: K.DECL.planets, planeAxis: 'L',
  /** 零試験の比べる数(〔第353便h〕の正本・統括の数え直し 3) */
  anchor: Object.freeze({ c2OverObs: 0.809, c2Lo: 11.4, c2Hi: 88.6, ruleLo: 1.04e-13, uV: 1.19282e-12, L: Object.freeze([0.026257, 0.008317, 0.999621]), venusPhiCR1Deg: 52.06 }),
  floor: 1e-12,
  judge: '「物差しの桁」= 率 ÷ 物差しが 0.1〜10 の内(正の向き)・逐語の表は有効数字 3 桁・零試験は相対 1e-9 の床',
});

/* ───────── 受け手の自分の重み(SI)───────── */
/** 受け手 { kind: 'rule' | 'obs', a(m), cR, rho }: rule = 〔第352便s〕の ringRot の既定(m 1e3・規則の半径 Y_k m —— 自分の重みは m に依らない)/obs = 粒子 m = ρ (4/3)π a³・半径 c_R a */
export function recvOf(recv = { kind: 'rule' }) {
  const kind = recv.kind || 'rule';
  if (!DECL.recvKinds.includes(kind)) throw new RangeError('recvOf: 受け手は rule・obs');
  if (kind === 'rule') { const m = 1e3; return { kind, m, R: G3.YK * m, A0: m * DK.Kball(1, 0, G3.YK * m) }; }
  const a = recv.a, cR = recv.cR, rho = recv.rho === undefined ? DECL.rho : recv.rho;
  if (!(fin(a) && a > 0 && fin(cR) && cR > 0 && fin(rho) && rho > 0)) throw new RangeError('recvOf: a > 0・c_R > 0・ρ > 0');
  const m = rho * 4 / 3 * Math.PI * a * a * a, R = cR * a;
  return { kind, a, cR, rho, m, R, A0: m * DK.Kball(1, 0, R) };
}
/** 源の扁平の仕様(SI): ob 'O0'|'O1'|'O2b'・源の半径 src 'rule'|'obs' */
export function obOf(srcBody, ob = 'O0', src = 'rule') {
  if (!DECL.obs.includes(ob)) throw new RangeError('obOf: 扁平は ' + DECL.obs.join('・'));
  if (!DECL.srcs.includes(src)) throw new RangeError('obOf: 源の半径は rule・obs');
  const tSrc = src === 'rule' ? 0 : 1;
  if (ob === 'O0') return null;
  if (ob === 'O1') { const L = OB.litOf(srcBody); return OB.specFor(srcBody, { model: 'O1', f: 'lit', J2: L.J2 !== null ? 'lit' : null, rq: 'obs', tSrc }); }
  return OB.specFor(srcBody, { model: 'O2b', f: 'lit', rq: 'rule', tSrc });
}

/* ───────── (F2) 円盤引きずりの側の作り(〔第351便j〕の ringOmega の (S)・〔第353便h〕の diskRow と同じ場 —— 置き方を引数に)───────── */
/**
 * 区分 key × 源の半径 src × 扁平 ob × 受け手 recv × 読み × 傾き。土星の単位(半径 = 観測の半径・質量 = 土星)。
 * src 'obs' + recv 'rule' + O0 は〔第353便h〕の diskRow(part 'S')と同じ数(零試験)。
 * 戻り: { key, src, ob, recv, read, tiltDeg, raiseOverEpsPerS, yard, perpPerS, magPerS, A0u(受け手の自分の重み —— 単位), wSu(源の重み), A0OverWS }
 */
export function diskStd(key, { src = 'rule', ob = 'O0', recv = DECL.recvMain, read = 'C2', tiltDeg = DECL.tiltDeg, rot = null } = {}) {
  if (!['C1', 'C2'].includes(read)) throw new RangeError('diskStd: 読みは C1・C2');
  if (!(fin(tiltDeg) && tiltDeg > 0 && tiltDeg < 90)) throw new RangeError('diskStd: 0 < 傾き < 90');
  const U = DA.saturnUnits(), Sat = RB.srcOf('saturn'), r0 = RB.centerKm(key) * 1e3 / U.R;
  const Rs = src === 'rule' ? G3.YK * Sat.m / U.R : src === 'obs' ? 1 : null;
  if (Rs === null) throw new RangeError('diskStd: 源の半径は rule・obs');
  const o0 = obOf('Saturn', ob, src), obU = o0 ? { ...o0, Rq: o0.Rq / U.R } : null;
  const rv = recvOf(recv), Rb = DA.DECL.Rb;
  // 受け手: rule は〔第350便g〕の ruleWii(自分の重み 1.5/y_k)・半径 R_b(〔第353便h〕の diskRow と同じ)/obs は粒子の m・c_R a を土星の単位に
  const recvU = rv.kind === 'rule' ? { m: DA.DECL.Rb * 2 / 3 * (1.5 / (G3.YK * Sat.m / U.R)), R: DA.DECL.Rb } : { m: rv.m / Sat.m, R: rv.R / U.R };
  const L = RJ.normalAt(tiltDeg, -90, 'pro'), l = unit(L), [e1, e2] = RJ.ringBasis(l), N = RJ.DECL.sat.N;
  let Om = [0, 0, 0];
  for (let j = 0; j < N; j++) {
    const ph = 2 * Math.PI * (j + 0.5) / N, x = scl(add(scl(e1, Math.cos(ph)), scl(e2, Math.sin(ph))), r0);
    const F = OB.makeFieldOb({ sources: [{ m: 1, R: Rs, p: [0, 0, 0], v: [0, 0, 0], spin: [0, 0, U.sDim * (rot === null ? 1 : rot)], ob: obU }], recv: { m: recvU.m, R: recvU.R, p: x, v: [0, 0, 0] }, W0: 0, self: true });
    const v = read === 'C2' ? G3.rot3('W', F, x, { Rb }) : G3.rot3('P2', F, x, { e: unit(x), Rb, lim: false });
    Om = add(Om, scl(v, 1 / N));
  }
  const q = RJ.ringRate(L, Om, { kTilt: 1, kPrec: 0 }), A0u = recvU.m * DK.Kball(1, 0, recvU.R), wSu = DK.Kball(1, r0, Rs);
  return { key, src, ob, recv: rv.kind === 'rule' ? 'rule' : { a: rv.a, cR: rv.cR, rho: rv.rho }, read, tiltDeg, raiseOverEpsPerS: q.raiseOverEps / U.tU, yard: H.yardOfRate(q.raiseOverEps / U.tU),
    perpPerS: q.perp / U.tU, magPerS: q.om / U.tU, cos: q.cos, A0u, wSu, A0OverWS: A0u / wSu, sigma: o0 ? o0.sigma : 1 };
}

/* ───────── (F1) 軸引きずりの (S) の作り(〔第353便d〕の circRot・〔第352便s〕の ringRot と同じ —— 受け手の半径と質量を引数に)───────── */
/** 輪の (S)(SI・rad/s)。recvR・recvM で受け手を置く(省けば ringRot の既定 = 規則の半径 Y_k 1e3)。ob は SI の仕様か null */
export function ringStdOm({ Ms, Rs, spinVec, L, r, N = S2.DECL.ringN, read = 'C2', extraW = 0, recvM = 1e3, recvR = null, ob = null }) {
  if (!(fin(r) && r > 0 && fin(Ms) && Ms > 0 && fin(Rs) && Rs > 0 && fin(recvM) && recvM > 0)) throw new RangeError('ringStdOm: r・M・R・m > 0');
  const l = unit(L), [x, y] = RJ.ringBasis(l), Rr = recvR === null ? G3.YK * recvM : recvR;
  if (!(fin(Rr) && Rr > 0)) throw new RangeError('ringStdOm: 受け手の半径 > 0');
  const radii = read === 'W' ? [[Rr, 1]] : GL.x.map((xi, i) => { const rho = 0.5 * Rr * (xi + 1); return [SC.equivR(Rr, rho), 0.5 * Rr * GL.w[i] * 5 * Math.pow(rho, 4) / Math.pow(Rr, 5)]; });
  let Om = [0, 0, 0];
  for (const [Ri, wt] of radii) {
    let mW = [0, 0, 0];
    for (let j = 0; j < N; j++) {
      const ph = 2 * Math.PI * (j + 0.5) / N, rh = add(scl(x, Math.cos(ph)), scl(y, Math.sin(ph)));
      const f = OB.makeFieldOb({ sources: [{ m: Ms, R: Rs, p: scl(rh, -r), v: [0, 0, 0], spin: spinVec, ob }], recv: { m: recvM, R: Ri, p: [0, 0, 0], v: [0, 0, 0] }, W0: 0, extraW, kernel: { kind: 'ball', al: 1 }, rot: { form: 'M' }, self: true });
      mW = add(mW, scl(G3.rot3('W', f, [0, 0, 0], { Rb: Ri }), 1 / N));
    }
    Om = read === 'W' ? mW : add(Om, scl(mW, wt));
  }
  return { Om, A0: recvM * DK.Kball(1, 0, Rr), wS: Ms * DK.Kball(1, r, Rs), Rr };
}
/**
 * 区分 key × 置き方(F1): 〔第353便h〕の axialRow と同じ作り(太陽の重みを分母に)。src 'rule'|'obs' + recv rule + O0 は axialRow(tSrc 0|1)と同じ数(零試験)。
 */
export function axStd(T1, GEO, key, { src = 'rule', ob = 'O0', recv = DECL.recvMain, tiltDeg = DECL.tiltDeg } = {}) {
  if (!DECL.srcs.includes(src)) throw new RangeError('axStd: 源の半径は rule・obs');
  if (!(fin(tiltDeg) && tiltDeg > 0 && tiltDeg < 90)) throw new RangeError('axStd: 0 < 傾き < 90');
  const tSrc = src === 'rule' ? 0 : 1, sp = S2.saturnSpin(T1, GEO), Ms = C.massOf('Saturn'), Rs = K.srcRadius('Saturn', tSrc), r = RB.centerKm(key) * 1e3;
  const wSun = K.spinRot(T1, GEO, 'Saturn', 'Sun', { part: 'S', tSrc }).wS, rv = recvOf(recv);
  const L0 = sp.ax, L1 = S2.tiltedNormal(sp.ax, tiltDeg);
  const R = ringStdOm({ Ms, Rs, spinVec: sp.vec, L: L1, r, extraW: wSun, recvM: rv.m, recvR: rv.R, ob: obOf('Saturn', ob, src) }), q = S2.ringRates(L1, R.Om, { ref: L0 });
  const eps = tiltDeg * D2R, rpy = q.raiseAsYr === null ? null : q.raiseAsYr / 206264.80624709636;
  return { key, src, ob, tiltDeg, raiseAsYr: q.raiseAsYr, yard: rpy === null ? null : rpy / eps * H.DECL.tYardYr, perpAsYr: q.perpAsYr, A0: R.A0, wS: R.wS, wSun, A0OverW: R.A0 / (R.wS + wSun) };
}

/* ───────── 表 1 の 1 行(区分 —— 置き方の組)───────── */
/** 列(主の列を先頭に): 回答の基準(源 = 規則 + 扁平 3 × 受け手 = 観測 × c_R)を F2・F1 で/比べる列: 〔第353便h〕の (C2)(源 観測・受け手 規則)・(S) 規則・(S) 観測・源 観測 + 受け手 観測 */
export const T1COLS = Object.freeze([
  Object.freeze({ id: 'stdO0F2', main: true, frame: 'F2', src: 'rule', ob: 'O0', recv: 'obs' }),
  Object.freeze({ id: 'stdO1F2', main: true, frame: 'F2', src: 'rule', ob: 'O1', recv: 'obs' }),
  Object.freeze({ id: 'stdO2bF2', main: true, frame: 'F2', src: 'rule', ob: 'O2b', recv: 'obs' }),
  Object.freeze({ id: 'stdO0F1', main: true, frame: 'F1', src: 'rule', ob: 'O0', recv: 'obs' }),
  Object.freeze({ id: 'stdO2bF1', main: true, frame: 'F1', src: 'rule', ob: 'O2b', recv: 'obs' }),
  Object.freeze({ id: 'h353C2', main: false, frame: 'F2', src: 'obs', ob: 'O0', recv: 'rule' }),
  Object.freeze({ id: 'ruleRule', main: false, frame: 'F1', src: 'rule', ob: 'O0', recv: 'rule' }),
  Object.freeze({ id: 'obsRule', main: false, frame: 'F1', src: 'obs', ob: 'O0', recv: 'rule' }),
  Object.freeze({ id: 'obsObsF2', main: false, frame: 'F2', src: 'obs', ob: 'O1', recv: 'obs' }),
]);
export function colYard(T1, GEO, key, col, recvMain = DECL.recvMain) {
  const recv = col.recv === 'rule' ? { kind: 'rule' } : recvMain;
  return col.frame === 'F2' ? diskStd(key, { src: col.src, ob: col.ob, recv }).yard : axStd(T1, GEO, key, { src: col.src, ob: col.ob, recv }).yard;
}
export function t1Row(T1, GEO, key) {
  const y = Object.fromEntries(T1COLS.map((c) => [c.id, colYard(T1, GEO, key, c)]));
  return { key, rOverRobs: RB.centerKm(key) * 1e3 / C.radiusOf('Saturn'), yard: y, need: Object.fromEntries(Object.entries(y).map(([k, v]) => [k, fin(v) && v > 0 ? 1 / v : null])) };
}

/* ───────── 表 2(受け手の自分の重み): 粒子の大きさ × c_R ───────── */
/** 区分 key(既定 B 環)× a × c_R: F2・F1 の率 ÷ 物差し・受け手の自分の重み ÷ 源の重み・向き(cos 正 = 寄る) */
export function t2Rows(T1, GEO, key = 'ringB', { src = 'rule', ob = 'O0' } = {}) {
  const out = [];
  for (const a of DECL.sizes) for (const cR of DECL.cRs) {
    const recv = { kind: 'obs', a, cR }, d = diskStd(key, { src, ob, recv }), x = axStd(T1, GEO, key, { src, ob, recv });
    out.push({ key, a, cR, yardF2: d.yard, yardF1: x.yard, A0OverWS: d.A0OverWS, A0OverWF1: x.A0OverW });
  }
  return out;
}
/** 自分の重みが源の重みと同じになる粒子の大きさ(F2・O0 —— A0 = ρ (4/3)π a² × 1.5 ÷ c_R = w_S(土星の単位を SI に戻して))。閉じた形 a★ = √(c_R w_S ÷ (2π ρ)) */
export function aStar(key, cR, src = 'rule') {
  const U = DA.saturnUnits(), Sat = RB.srcOf('saturn'), r0 = RB.centerKm(key) * 1e3 / U.R, Rs = src === 'rule' ? G3.YK * Sat.m / U.R : 1;
  const wSI = DK.Kball(1, r0, Rs) * Sat.m / U.R; // 単位の重み × (M ÷ R) = SI の m K
  return Math.sqrt(cR * wSI / (2 * Math.PI * DECL.rho));
}
/** 規則の半径の受け手と同じ自分の重みになる c_R(粒子 a・F2 と同じ式 —— 1.5 m ÷ (c_R a) = 1.5 ÷ Y_k) */
export const cRRuleEq = (a) => G3.YK * DECL.rho * 4 / 3 * Math.PI * a * a;

/* ───────── 表 3(公転面の集まり —— 〔第352便za〕の題 plane と同じ作り・置き方を引数に)───────── */
/**
 * 惑星 id の道の輪(源 = 太陽の自転の分・法線 = 基準軸 L)。受け手 recv: 'rule'(ringRot の既定 —— 〔第352便za〕と同じ)/{ cR }(受け手 = その惑星・半径 c_R × 観測半径)。
 * 値 = (輪の法線に直交する成分 × 太陽系の年齢)÷ 23°(〔第352便za〕の物差し)。背景 (N+) L は法線に平行 —— 直交成分は局所の (S) の輪だけ。
 */
export function planeStd(T1, GEO, id, { src = 'rule', ob = 'O0', recv = 'rule' } = {}) {
  const tSrc = src === 'rule' ? 0 : 1, P = SP.pairInput(T1, GEO, id, 'Sun'), Lh = unit(CR.refAxis(DECL.planeAxis, T1, GEO)), Rs = K.srcRadius('Sun', tSrc);
  const rv = recv === 'rule' ? { m: 1e3, R: null } : (fin(recv.cR) && recv.cR > 0 ? { m: C.massOf(id), R: recv.cR * C.radiusOf(id) } : null);
  if (rv === null) throw new RangeError('planeStd: 受け手は rule か { cR > 0 }');
  const R = ringStdOm({ Ms: P.Ms, Rs, spinVec: scl(P.sAx, P.ws), L: Lh, r: P.a, recvM: rv.m, recvR: rv.R, ob: obOf('Sun', ob, src) });
  const perp = nrm(SP.perpOf(Lh, R.Om)), v = perp * Z.DECL.ageYr * YR / (Z.DECL.planeSpreadDeg * D2R);
  return { id, src, ob, recv, a: P.a, perpAsYr: perp * S2.ASYR, v, A0OverWS: R.A0 / R.wS };
}
export function t3Rows(T1, GEO) {
  const cols = [['stdO0', 'rule', 'O0', { cR: 1 }], ['stdO2b', 'rule', 'O2b', { cR: 1 }], ['stdO0cR01', 'rule', 'O0', { cR: 0.1 }], ['ruleRule', 'rule', 'O0', 'rule'], ['obsRule', 'obs', 'O0', 'rule'], ['obsObs', 'obs', 'O1', { cR: 1 }]];
  return DECL.planePlanets.map((id) => {
    const v = {}, w = {};
    for (const [cid, src, ob, recv] of cols) { const p = planeStd(T1, GEO, id, { src, ob, recv }); v[cid] = p.v; w[cid] = p.A0OverWS; }
    return { id, v, A0OverWS: w };
  });
}
export const T3COLS = Object.freeze(['stdO0', 'stdO2b', 'stdO0cR01', 'ruleRule', 'obsRule', 'obsObs']);

/* ───────── 零試験 ───────── */
export function pureScenes(T1 = E.t1Table(), GEO = E.geometry()) {
  const S = {}, A = DECL.anchor, cache = {};
  // ① (F2) の源 観測 + 受け手 規則 + 球 は〔第353便h〕の diskRow(part 'S'・C1・C2)と同じ数(区分 5 × 読み 2)
  S.vsDisk = []; for (const key of DECL.centers) for (const read of ['C1', 'C2']) {
    const a = diskStd(key, { src: 'obs', ob: 'O0', recv: { kind: 'rule' }, read }), b = H.diskRow(key, { read, tiltDeg: 1, part: 'S' });
    S.vsDisk.push(Math.max(rel(a.raiseOverEpsPerS, b.raiseOverEpsPerS), rel(a.perpPerS, b.perpPerS))); }
  // ② (F1) の受け手 規則 + 球 は〔第353便h〕の axialRow(tSrc 0・1)と同じ数
  S.vsAx = []; for (const key of DECL.centers) for (const src of DECL.srcs) {
    const a = axStd(T1, GEO, key, { src, ob: 'O0', recv: { kind: 'rule' } }), b = H.axialRow(T1, GEO, key, { tSrc: src === 'rule' ? 0 : 1, tiltDeg: 1 });
    S.vsAx.push(rel(a.yard, b.yard)); }
  // ③ 〔第353便h〕の比べる数: (C2) ÷ (S) 観測 = 0.809(区分に依らない)・(C2) 11.4〜88.6・(S) 規則の最小 1.04e-13
  const hc2 = DECL.centers.map((k) => H.diskRow(k, { read: 'C2', tiltDeg: 1 }).yard), hob = DECL.centers.map((k) => H.axialRow(T1, GEO, k, { tSrc: 1, tiltDeg: 1 }).yard), hru = DECL.centers.map((k) => H.axialRow(T1, GEO, k, { tSrc: 0, tiltDeg: 1 }).yard);
  S.c2OverObs = hc2.map((v, i) => v / hob[i]); S.c2Lo = Math.min(...hc2); S.c2Hi = Math.max(...hc2); S.ruleLo = Math.min(...hru);
  // ④ ringStdOm の既定(受け手 = 規則の半径 1e3・扁平なし)は〔第352便s〕の ringRot(part 'S')と同じ数
  { const sp = S2.saturnSpin(T1, GEO), Ms = C.massOf('Saturn'), Rs = K.srcRadius('Saturn', 1), r = RB.centerKm('ringA') * 1e3, L = S2.tiltedNormal(sp.ax, 3);
    const a = ringStdOm({ Ms, Rs, spinVec: sp.vec, L, r }).Om, b = S2.ringRot({ Ms, Rs, spinVec: sp.vec, L, r, part: 'S' }).Om; S.vsRingRot = nrm(sub(a, b)) / nrm(b); }
  // ⑤ 公転面: 受け手 規則 + 球 は〔第352便za〕の topicCell(plane・Srule/Sobs・(N+) L・倍率 0 —— 背景の丸めの直交の分を入れない)と同じ数(地球)
  S.vsPlane = ['rule', 'obs'].map((src) => rel(planeStd(T1, GEO, 'Earth', { src, ob: 'O0', recv: 'rule' }).v, Z.topicCell(T1, GEO, 'plane', src === 'rule' ? 'Srule' : 'Sobs', 'NpL', 0, {}, cache).v));
  // ⑥ 扁平 (O2b) の倍は σ(F2 —— 自分の重みが源の重みより十分小さい受け手では率 ÷ 球の率 ≈ σ —— 下限の見る量)・扁平 0 の (O1) は球と同じ
  { const d0 = diskStd('ringB', { src: 'rule', ob: 'O0' }), d2 = diskStd('ringB', { src: 'rule', ob: 'O2b' }); S.o2bRatio = d2.yard / d0.yard; S.o2bSigma = d2.sigma; }
  // ⑦ 共通の点検の数(統括の数え直し 3): 基準軸 L・(uV)・金星の φ(c_R 1 —— 第353便c の口)
  S.L = CR.refAxis('L', T1, GEO); S.uV = S2.uVt(T1, GEO, 0, cache); S.venusPhiCR1 = RC.cancelOf(T1, GEO, 'Venus', 'Sun', { place: 'field', cR: 1 }).phiDeg;
  // ⑧ 閉じた形 a★ と、規則の半径と同じ重みになる c_R の式の照合(F2 の A0 ÷ w_S = 1 の点・c_R の式で A0 が規則の受け手と同じ)
  { const k = 'ringB', cR = 1, as = aStar(k, cR), d = diskStd(k, { recv: { kind: 'obs', a: as, cR } }); S.aStarRatio = d.A0OverWS;
    const a1 = 1, c1 = cRRuleEq(a1), rv = recvOf({ kind: 'obs', a: a1, cR: c1 }), rr = recvOf({ kind: 'rule' }); S.cRRule = rv.A0 / rr.A0; }
  // ⑨ 入力の拒否
  S.rejects = [() => diskStd('ringB', { src: 'mid' }), () => diskStd('ringB', { ob: 'O3' }), () => diskStd('ringB', { read: 'C3' }), () => recvOf({ kind: 'obs', a: -1, cR: 1 }),
    () => axStd(T1, GEO, 'ringB', { tiltDeg: 0 }), () => planeStd(T1, GEO, 'Earth', { recv: { cR: 0 } })]
    .map((fn) => { try { fn(); return false; } catch (e) { return e instanceof RangeError; } });
  return S;
}
export function pureGates(S) {
  const A = DECL.anchor;
  return {
    vsDisk: S.vsDisk.length === 10 && S.vsDisk.every((x) => x < 1e-9),
    vsAx: S.vsAx.length === 10 && S.vsAx.every((x) => x < 1e-9),
    anchor353h: S.c2OverObs.every((x) => x.toFixed(3) === String(A.c2OverObs)) && Number(S.c2Lo.toPrecision(3)) === A.c2Lo && Number(S.c2Hi.toPrecision(3)) === A.c2Hi && Number(S.ruleLo.toPrecision(3)) === A.ruleLo,
    vsRingRot: S.vsRingRot < 1e-9,
    vsPlane: S.vsPlane.every((x) => x < 1e-9),
    o2b: S.o2bSigma > 1 && rel(S.o2bRatio, S.o2bSigma) < 1e-3,
    common: S.L.every((v, i) => Math.abs(v - A.L[i]) < 5e-7) && Math.abs(S.uV / A.uV - 1) < 5e-6 && S.venusPhiCR1.toFixed(2) === String(A.venusPhiCR1Deg),
    closed: Math.abs(S.aStarRatio - 1) < 1e-2 && Math.abs(S.cRRule - 1) < 1e-9,
    rejects: S.rejects.length === 6 && S.rejects.every(Boolean),
  };
}
