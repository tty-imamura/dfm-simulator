// 第352便n(原仮定者の回答(2026-11-24 —— 第148報)「AN1019: Aで進める。金星の自転の逆回転は、釣り合った状態で地球とも共鳴した結果である」・
//   「AN1016: (乙)で進める。ただし、「釣り合う」に「安定した歳差運動」を含む」・統括の検証項目 R451):
//   **金星(と比べる行に地球・火星・水星)—— 打ち消しの残りの回転(合成の回転)の下で (R3) の 2 経路の步を長く回す閉じた形の步・最後に落ち着く向き・
//   背景の倍率を金星の条件の前後で振ったときの合成の向き・公転面の向きを基準軸のまわりに一周させたときの残り・「安定した歳差」の判定の量 —— 診断だけ**
//   (器 tests/exp-w352n-venuslong.mjs と QA behavior.venuslong352n・docs.venuslong352n が読む —— html を読まない・ファイルを読まない・状態を持たない。後のラウンドの枝もこの口を import してよい)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない。
//   既存の lib は呼ぶだけ(本文は変えない): 第351便d(r3Step・closedR3・r3Coeffs —— 閉じた形の照合)・第352便c(refAxes —— 基準軸は必ずここから)・
//   第352便d(rowOf・poleRates・precDs —— 合成の Ω と方位の率)・第352便h(cancelOf・cancelRow・sDirClosed・b1・bgUnit —— 打ち消しの閉じた形)・
//   第352便i(kOf・judgeConst・invertTarget・lockGeom・rotAbout —— 判定の量と回る合成の軸)・第352便e(rotOf —— 公転の法線を替えた (S))・第351便c(pairInput)・第347便e(t1Table・geometry)。
//
// ■ 語(本便の共通の語): ŝ = 受け手の自転軸(逆行の天体は ŝ の向きに入れる)・n̂ = 公転の北極・Ω = 合成の軸引きずり回転(背景 + 太陽由来の (S) —— rad/s)・W = abs(Ω)・Ω̂ = Ω ÷ W。
//   θ = ŝ と Ω̂ の角(半頂角)・ε = ŝ と n̂ の角(傾き —— 90° より大 = 逆行の側)・ι = Ω̂ と n̂ の角。τ = W t(無次元の時間)。
//   流れ(一定の Ω): dŝ/dt = k₁ W (Ω̂ − (ŝ·Ω̂) ŝ) + σ k₂ W (Ω̂ × ŝ)(σ = +1 (g2+)・−1 (g2−)・(k₂, k₁) は第351便d の r3Coeffs の (N1))。ratio = ω_T ÷ ω_L は 1。
//   **閉じた形の步**: tan(θ/2) = tan(θ₀/2) e^(−k₁ τ)((α) —— 全ての θ₀)・Ω̂ のまわりの方位 = 方位₀ + σ k₂ τ。
//   (β)(第351便d): θ₀ > 90° は τ* = ln(tan(θ₀/2)) ÷ k₁ で 90° に着き、その後は θ = 90° に留まる(方位は σ k₂ τ で回り続ける)。
// ■ 行き着く向き(f > 0): (α) と θ₀ ≤ 90° の (β) は点 Ω̂(ε = ι)。θ₀ > 90° の (β) は Ω̂ に直交する大円 —— k₂ > 0 なら大円の上を回り続け ε は abs(90° − ι) から 180° − abs(90° − ι) の間・
//   k₂ = 0(f 1)なら着いた点で止まる。f 0 は Ω̂ のまわりの円錐(半頂角 θ₀)—— ε は abs(ι − θ₀) から min(ι + θ₀, 360° − ι − θ₀) の間。
//   側の名: 'pro'(順行の側 ε < 90° − 帯)・'retro'(逆行の側 ε > 90° + 帯)・'side'(横倒し —— 90° ± 帯)・範囲の行は 'both'(90° を挟む)。帯は宣言(1°)。
// ■ 言わないこと: 金星の逆回転が導けた・説明できた、とは書かない(行き先の表と、要る時間 —— この場・この成分・この背景の向き・この基準軸・このノブでは)。
//   歳差の向き (g2±)・背景の向き (N+)(G−)・基準軸 L/eq・読み (α)(β)・比率 f はどれにも寄せない。
import * as R3 from './lib-w351d-r3step.mjs';
import * as RA from './lib-w352c-refaxis.mjs';
import * as PS from './lib-w352d-precsense.mjs';
import * as VB from './lib-w352h-venusbal.mjs';
import * as SI from './lib-w352i-stableprec.mjs';
import * as SR from './lib-w352e-sunrecv.mjs';
import * as SP from './lib-w351c-srcparts.mjs';
import * as E from './lib-w347e-spintorque.mjs';

export const LIB_VERSION = 'w352n-venuslong-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const D2R = Math.PI / 180;
const { dot, crs, nrm, scl, add, sub, unit } = RA.vec;
const isVec = (a) => Array.isArray(a) && a.length === 3 && a.every(fin);
const YR = 365.25 * 86400;
export const ASYR = PS.ASYR;
export const angDeg = RA.angDeg;

/* ───────── 宣言 ───────── */
export const DECL = Object.freeze({
  bodies: Object.freeze(['Venus', 'Earth', 'Mars', 'Mercury']),
  fGrid: Object.freeze([0, 0.1, 0.5, 1]), norm: 'N1',
  senses: PS.DECL.senses, reads: Object.freeze(['alpha', 'beta']),
  axes: Object.freeze(['L', 'eq']), dirs: Object.freeze(['Np', 'Gm']),
  /** 背景の列: (N+) は基準軸 L・eq の 2 つ・(G−) は軸に依らない */
  bgCols: Object.freeze([Object.freeze(['Np', 'L']), Object.freeze(['Np', 'eq']), Object.freeze(['Gm', 'gal'])]),
  part: 'S', read: 'C2', k: 1,
  /** 初めの自転軸(順行): 公転の北極からの傾き(°)× 傾ける方位(Ω̂ を公転面に写した向きから n̂ のまわりに右ねじで —— °) */
  startObl: Object.freeze([0, 2.6, 23]), startAz: Object.freeze([0, 90, 180, 270]),
  /** 軌跡を出す k₁ τ の格子 */
  k1tauGrid: Object.freeze([0, 0.5, 1, 2, 5, 10, 20]),
  /** 横倒しの帯(°)・落ち着いたと読む Ω̂ との角(°) */
  sideBandDeg: 1, settleDeg: 1,
  /** 背景の倍率の振り(÷ (uV)) */
  uScan: Object.freeze([0.5, 0.8, 0.9, 0.95, 0.98, 0.99, 0.995, 1, 1.005, 1.01, 1.02, 1.05, 1.1, 1.25, 1.5, 2]),
  scanBodies: Object.freeze(['Venus', 'Mercury', 'Earth']),
  /** 公転の法線を基準軸のまわりに回す角の刻み(°) */
  psiStepDeg: 10,
  /** 判定の量の f・逆に解く f */
  judgeF: Object.freeze([0, 0.1, 0.5, 1]), invF: Object.freeze([0, 0.5, 1]),
  /** 統括と第 2 ラウンドの起点の数 */
  anchor: Object.freeze({ venusResEq: 0.010, venusResL: 0.013, venusThL: 90.49, venusThEq: 88.96, venusObl: 177.36 }),
  judge: '丸めの桁の床: 打ち消しで小さくなる量は差で作らず角と比から直接に数える・角は 1e-9° 以下を 0 と書く',
});

/* ───────── 合成の Ω ───────── */
/** 金星で (S) と背景の大きさが同じになる倍率 (uV)(第352便d の uVenus —— k 1) */
export const uVOf = (T1, GEO, cache = null) => PS.uVenus(T1, GEO, { part: DECL.part, k: DECL.k }, cache);
/**
 * 1 つの受け手 × 背景の向き × 基準軸 × 倍率 u: 第352便d の rowOf(主の成分 (S)・(C2)・k 1)から Ω・ŝ・n̂・θ・ε・ι。
 * 返す { id, dir, axis, u, sHat, nHat, Om, W, bVec, local, ref, thDeg, oblDeg, iotaDeg, resOverBg }
 */
export function stateOf(T1, GEO, id, { dir, axis = 'eq', u, AX = null }, cache = null) {
  if (!DECL.dirs.includes(dir)) throw new RangeError('stateOf: 背景の向きは Np・Gm');
  if (dir === 'Np' && !DECL.axes.includes(axis)) throw new RangeError('stateOf: (N+) の基準軸は L・eq');
  if (!(fin(u) && u > 0)) throw new RangeError('stateOf: 倍率 u > 0');
  const ax = AX || RA.refAxes(T1, GEO), ref = dir === 'Np' ? ax[axis] : ax.eq;
  const R = PS.rowOf(T1, GEO, id, { bg: dir, sense: 'g2p', u, part: DECL.part, k: DECL.k, axis: ref }, cache);
  const W = nrm(R.Om);
  return { id, dir, axis: dir === 'Np' ? axis : 'gal', u, sHat: R.sHat, nHat: R.nHat, Om: R.Om, W, bVec: R.bgVec, local: R.local, ref,
    thDeg: angDeg(R.sHat, R.Om), oblDeg: angDeg(R.sHat, R.nHat), iotaDeg: angDeg(R.Om, R.nHat), resOverBg: W / nrm(R.bgVec) };
}

/* ───────── 閉じた形の步 ───────── */
/** Ω̂ に直交する右手の基底(e1, e2, Ω̂) */
export function frameOf(oh, hint = null) {
  const o = unit(oh); let t = hint && nrm(crs(o, hint)) > 1e-9 ? hint : (Math.abs(o[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0]);
  const e1 = unit(sub(t, scl(o, dot(t, o)))), e2 = crs(o, e1); return [e1, e2, o];
}
/**
 * 一定の Ω̂ の下の閉じた形の步: s0・Ω̂・k₁・σk₂(k2s)・読み・τ → ŝ(τ)。mut(変異): 'fullAngle'(tan θ を使う)・'flipPrec'(方位の符号を逆)
 * 返す { s, thDeg, azRad, stuck, tauStar }
 */
export function closedStep({ s0, oh, k1, k2s, read = 'alpha', tau, mut = null }) {
  if (!(isVec(s0) && nrm(s0) > 0 && isVec(oh) && nrm(oh) > 0 && fin(k1) && k1 >= 0 && fin(k2s) && fin(tau) && tau >= 0)) throw new RangeError('closedStep: s0・Ω̂・k₁ ≥ 0・σk₂・τ ≥ 0');
  if (!DECL.reads.includes(read)) throw new RangeError('closedStep: 読みは alpha・beta');
  const s = unit(s0), [e1, e2, o] = frameOf(oh), th0 = angDeg(s, o) * D2R, az0 = Math.atan2(dot(s, e2), dot(s, e1));
  let th, stuck = false, tauStar = null;
  const decay = (x) => (mut === 'fullAngle' ? Math.atan(Math.tan(th0) * Math.exp(-k1 * x)) : 2 * Math.atan(Math.tan(th0 / 2) * Math.exp(-k1 * x)));
  if (k1 === 0 || th0 === 0 || th0 === Math.PI) th = th0;
  else if (read === 'beta' && th0 > Math.PI / 2) { tauStar = Math.log(Math.tan(th0 / 2)) / k1; if (tau >= tauStar) { th = Math.PI / 2; stuck = true; } else th = decay(tau); }
  else th = decay(tau);
  const az = az0 + (mut === 'flipPrec' ? -1 : 1) * k2s * tau;
  const sv = add(scl(o, Math.cos(th)), add(scl(e1, Math.sin(th) * Math.cos(az)), scl(e2, Math.sin(th) * Math.sin(az))));
  return { s: unit(sv), thDeg: th / D2R, azRad: az, stuck, tauStar };
}
/** 初めの順行の自転軸: n̂ から obl° 傾け、方位は Ω̂ を公転面に写した向きから n̂ のまわりに az°(Ω̂ ∥ n̂ なら任意の直交の向き) */
export function startSpin(nHat, oh, oblDeg, azDeg) {
  const n = unit(nHat), [e1, e2] = frameOf(n, oh), a = azDeg * D2R, e = oblDeg * D2R;
  return unit(add(scl(n, Math.cos(e)), scl(add(scl(e1, Math.cos(a)), scl(e2, Math.sin(a))), Math.sin(e))));
}
const sideOf = (eps) => (eps < 90 - DECL.sideBandDeg ? 'pro' : eps > 90 + DECL.sideBandDeg ? 'retro' : 'side');
/**
 * 行き着く向き(閉じた形 —— 上の ■)。s0・Ω̂・n̂・f・向きの読み・読み → { kind: 'point'|'cone'|'circle', epsDeg | epsMin・epsMax, side, beyond90, tauSettle(k₁ τ の単位でなく τ —— 落ち着くまで), thetaEndDeg }
 * tauSettle: 点へ行く行は Ω̂ との角が settleDeg になるまで・大円へ行く行は τ*・円錐は null(初めから円錐の上)。
 */
export function finalOf({ s0, oh, nHat, f, sense, read }) {
  const { k1, k2, k2s } = SI.kOf(f, sense), s = unit(s0), o = unit(oh), n = unit(nHat), th0 = angDeg(s, o), iota = angDeg(o, n);
  if (k1 === 0) {
    const lo = Math.abs(iota - th0), hi = Math.min(iota + th0, 360 - iota - th0);
    return { kind: 'cone', epsMin: lo, epsMax: hi, side: hi < 90 ? 'pro' : lo > 90 ? 'retro' : 'both', beyond90: hi > 90, tauSettle: null, thetaEndDeg: th0, k1, k2s };
  }
  if (read === 'alpha' || th0 <= 90) {
    const ts = th0 > DECL.settleDeg ? Math.log(Math.tan(th0 * D2R / 2) / Math.tan(DECL.settleDeg * D2R / 2)) / k1 : 0;
    return { kind: 'point', epsDeg: iota, side: sideOf(iota), beyond90: iota > 90, tauSettle: ts, thetaEndDeg: 0, k1, k2s };
  }
  const tauStar = Math.log(Math.tan(th0 * D2R / 2)) / k1;
  if (k2 === 0) {
    const p = closedStep({ s0: s, oh: o, k1, k2s, read: 'beta', tau: tauStar * (1 + 1e-12) + 1e-12 }), e = angDeg(p.s, n);
    return { kind: 'point', epsDeg: e, side: sideOf(e), beyond90: e > 90, tauSettle: tauStar, thetaEndDeg: 90, k1, k2s };
  }
  const lo = Math.abs(90 - iota), hi = 180 - lo;
  return { kind: 'circle', epsMin: lo, epsMax: hi, side: 'both', beyond90: true, tauSettle: tauStar, thetaEndDeg: 90, k1, k2s };
}
/** 軌跡: k₁ τ の格子(k₁ 0 の行は τ の格子)ごとの θ・ε。返す [{ k1tau, tau, thDeg, epsDeg }] */
export function trajectory({ s0, oh, nHat, f, sense, read, grid = DECL.k1tauGrid }) {
  const { k1, k2s } = SI.kOf(f, sense);
  return grid.map((g) => { const tau = k1 > 0 ? g / k1 : g, p = closedStep({ s0, oh, k1, k2s, read, tau }); return { k1tau: g, tau, thDeg: p.thDeg, epsDeg: angDeg(p.s, nHat), stuck: p.stuck }; });
}
/** τ(無次元)→ 年: t = τ ÷ W */
export const tauToYr = (tau, W) => (tau === null ? null : tau / W / YR);

/* ───────── 倍率の振り(T3)───────── */
/**
 * 受け手 id の Ω を倍率 u で: 打ち消しの閉じた形(第352便h の cancelOf)の uMag・φ と、Ω̂ と背景の向き b̂ の角を直接に
 * (Ω ∥ r (−cos φ b̂ + sin φ p̂) + b̂・r = uMag ÷ u —— 差を作らない)。合成 ÷ 背景 = √((r − 1)² + 4 r sin²(φ/2))。
 * 入れ替わりの u(Ω̂ ⊥ b̂)= uMag cos φ・幅(Ω̂ と b̂ の角が 135° → 45°)= 2 uMag sin φ。
 */
export function scanOf(T1, GEO, id, { dir, axis = 'eq', u, AX = null }, cache = null) {
  const st = stateOf(T1, GEO, id, { dir, axis, u, AX }, cache), bh = unit(st.bVec), b1 = nrm(st.bVec) / u;
  const C = VB.cancelOf(st.local, bh, b1), r = C.uMag / u, ph = C.phiDeg * D2R;
  const res = Math.sqrt((r - 1) * (r - 1) + 4 * r * Math.sin(ph / 2) ** 2);
  const angBg = Math.atan2(r * Math.sin(ph), 1 - r * Math.cos(ph)) / D2R;
  return { ...st, uMag: C.uMag, phiDeg: C.phiDeg, rS: r, resDirect: res, angBgDeg: angBg, angRefDeg: angDeg(st.Om, st.ref), uCross: C.uMag * Math.cos(ph), uWidth: 2 * C.uMag * Math.sin(ph) };
}

/* ───────── 公転面の向きを回す(T4)───────── */
/** 金星の公転の法線を基準軸 ref のまわりに ψ 回した法線(傾きは保つ) */
export const turnNormal = (nHat, ref, psiDeg) => unit(SI.rotAbout(unit(nHat), unit(ref), psiDeg * D2R));
/** 法線 n′ の金星の (S)(rad/s —— 第352便e の rotOf・第351便c の pairInput の nHat を替える)と閉じた形の向き・大きさの比 */
export function sOfNormal(T1, GEO, nNew, id = 'Venus') {
  const P = { ...SP.pairInput(T1, GEO, id, 'Sun') }; P.nHat = unit(nNew);
  const S = SR.rotOf(P, { part: DECL.part, read: DECL.read }).Om, sun = unit(GEO['Earth|Sun'].s), v = sub(scl(P.nHat, 3 * dot(sun, P.nHat)), sun);
  return { S, closedDir: scl(unit(v), -1), closedMag: nrm(v) };
}
/**
 * 1 つの ψ: 法線 n′ → (S)′・合成 ÷ 背景(u = uV 固定・b̂ 固定 —— 直接の式)・合成の向きと基準軸の角・合成と n′ の角 ι′・合成と今の金星の自転軸の角。
 * S0mag = いまの (S) の大きさ(r の基準)。
 */
export function turnRow(T1, GEO, { psiDeg, ref, bHat, uV, b1, nHat0, sHat0 }) {
  const n = turnNormal(nHat0, ref, psiDeg), Q = sOfNormal(T1, GEO, n), bh = unit(bHat), sm = nrm(Q.S), sh = scl(Q.S, 1 / sm);
  const r = sm / (uV * b1), c = -dot(sh, bh), ph = Math.atan2(nrm(crs(sh, bh)), c);
  const res = Math.sqrt((r - 1) * (r - 1) + 4 * r * Math.sin(ph / 2) ** 2), Om = add(scl(sh, r), bh);
  return { psiDeg, n, r, phiDeg: ph / D2R, res, angRefDeg: angDeg(Om, ref), iotaDeg: angDeg(Om, n), thSpinDeg: angDeg(Om, sHat0), dirErrDeg: angDeg(Q.S, Q.closedDir), closedMag: Q.closedMag, sMag: sm, Om };
}

/* ───────── 零試験・変異 ───────── */
export function pureScenes(T1 = E.t1Table(), GEO = E.geometry()) {
  const cache = {}, AX = RA.refAxes(T1, GEO), uV = uVOf(T1, GEO, cache);
  // ① 起点の数: (N+)・(uV) の金星の残り(eq・L)・残りと自転軸の角・傾き
  const vL = stateOf(T1, GEO, 'Venus', { dir: 'Np', axis: 'L', u: uV, AX }, cache), vE = stateOf(T1, GEO, 'Venus', { dir: 'Np', axis: 'eq', u: uV, AX }, cache);
  const anc = { resL: vL.resOverBg, resE: vE.resOverBg, thL: vL.thDeg, thE: vE.thDeg, obl: vL.oblDeg };
  // ② 同じ Ω: 第352便d の rowOf・第352便i の bodyState・第352便h の cancelRow の残り(倍率 uMag = uV で 2 sin(φ/2))
  const bs = SI.bodyState(T1, GEO, 'Venus', { bg: 'Np', axis: AX.eq, u: uV }, cache), cr = VB.cancelRow(T1, GEO, 'Venus', { dir: 'Np', axis: 'eq', AX }, cache);
  const same = { vsI: nrm(sub(bs.Om, vE.Om)) / vE.W, vsH: Math.abs(cr.resMag / vE.resOverBg - 1) };
  // ③ f 0 は Ω̂ との角を保つ(閉じた形と第351便d の r3Step の数値)
  const s40 = [Math.sin(40 * D2R), 0, Math.cos(40 * D2R)], z = [0, 0, 1];
  let f0 = 0, f0n = 0;
  for (const sense of DECL.senses) { const { k1, k2s } = SI.kOf(0, sense);
    for (const tau of [0.3, 3, 30]) f0 = Math.max(f0, Math.abs(closedStep({ s0: s40, oh: z, k1, k2s, tau }).thDeg - 40));
    const N = R3.r3Step({ s0: s40, om: z, T: 6, dt: 0.01, kTilt: k1, kPrec: k2s, integ: 'mid' }); f0n = Math.max(f0n, Math.abs(N.thEndDeg - 40)); }
  // ④ f > 0 は第351便d の closedR3(tan(θ/2) の減り・(β) の τ*)と一致・r3Step(中点)の数値とベクトルで近い
  let vsClosed = 0, vsStep = 0, tStar = 0;
  for (const f of [0.1, 0.5, 1]) for (const sense of DECL.senses) for (const read of DECL.reads) for (const th0 of [30, 91, 150, 177]) {
    const { k1, k2s } = SI.kOf(f, sense), s0 = [Math.sin(th0 * D2R), 0, Math.cos(th0 * D2R)];
    for (const tau of [0.5, 2, 8]) { const p = closedStep({ s0, oh: z, k1, k2s, read, tau }), q = R3.closedR3({ th0Deg: th0, Om: 1, t: tau, kTilt: k1, kPrec: k2s, read });
      vsClosed = Math.max(vsClosed, Math.abs(p.thDeg - q.thDeg)); if (read === 'beta' && th0 > 90) tStar = Math.max(tStar, Math.abs((p.tauStar - q.tStar) / q.tStar)); }
    if (read === 'alpha') { const N = R3.r3Step({ s0, om: z, T: 4, dt: 0.002, kTilt: k1, kPrec: k2s, integ: 'mid' }), p = closedStep({ s0, oh: z, k1, k2s, tau: 4 });
      vsStep = Math.max(vsStep, nrm(sub(N.sEnd, p.s))); }
  }
  // ⑤ (g2−) は Ω̂ のまわりの方位の率が (g2+) と逆(第352便d の precDs・poleRates)・閉じた形の方位も逆
  const sA = unit([0.3, 0.2, 0.9]), pp = PS.poleRates(z, sA, PS.precDs(sA, z, { sense: 'g2p' })).az, pm = PS.poleRates(z, sA, PS.precDs(sA, z, { sense: 'g2m' })).az;
  const ap = closedStep({ s0: sA, oh: z, k1: 0, k2s: SI.kOf(0, 'g2p').k2s, tau: 0.2 }).azRad, am = closedStep({ s0: sA, oh: z, k1: 0, k2s: SI.kOf(0, 'g2m').k2s, tau: 0.2 }).azRad, a0 = Math.atan2(sA[1], sA[0]);
  const g2m = { poles: pp > 0 && Math.abs(pp + pm) < 1e-15, closed: Math.abs((ap - a0) + (am - a0)) < 1e-14 && ap - a0 > 0 };
  // ⑥ 行き着く向きの範囲: 円錐(f 0)と大円((β))の ε の範囲を 7200 点の数値と照合
  const n0 = unit([0.2, 0, 1]), o0 = unit([1, 0.1, 0.05]);
  let rng = 0;
  { const s0 = startSpin(n0, o0, 23, 90), F = finalOf({ s0, oh: o0, nHat: n0, f: 0, sense: 'g2p', read: 'alpha' }); let lo = 180, hi = 0;
    for (let j = 0; j < 7200; j++) { const e = angDeg(closedStep({ s0, oh: o0, k1: 0, k2s: 1, tau: 2 * Math.PI * j / 7200 }).s, n0); lo = Math.min(lo, e); hi = Math.max(hi, e); }
    rng = Math.max(rng, Math.abs(lo - F.epsMin), Math.abs(hi - F.epsMax)); }
  { const s0 = scl(o0, -1), sx = unit(add(s0, [0, 0.3, 0])), F = finalOf({ s0: sx, oh: o0, nHat: n0, f: 0.5, sense: 'g2p', read: 'beta' }); let lo = 180, hi = 0; const { k1, k2s } = SI.kOf(0.5, 'g2p');
    for (let j = 0; j < 7200; j++) { const e = angDeg(closedStep({ s0: sx, oh: o0, k1, k2s, read: 'beta', tau: F.tauSettle + 2 * Math.PI * j / 7200 / Math.abs(k2s) }).s, n0); lo = Math.min(lo, e); hi = Math.max(hi, e); }
    rng = Math.max(rng, Math.abs(lo - F.epsMin), Math.abs(hi - F.epsMax)); }
  // ⑦ 公転の法線を回したときの (S): 閉じた形の向き(第352便h の sDirClosed と同じ)と rotOf の向き・大きさの比
  const sun = unit(GEO['Earth|Sun'].s), nV = vE.nHat, Q0 = sOfNormal(T1, GEO, nV);
  let dirMax = 0, magMax = 0, vsH2 = 0;
  for (const psi of [0, 45, 90, 135, 180, 225, 270, 315]) { const n = turnNormal(nV, AX.eq, psi), Q = sOfNormal(T1, GEO, n);
    dirMax = Math.max(dirMax, angDeg(scl(Q.S, -1), VB.sDirClosed(sun, n))); vsH2 = Math.max(vsH2, angDeg(Q.closedDir, scl(VB.sDirClosed(sun, n), -1)));
    magMax = Math.max(magMax, Math.abs((nrm(Q.S) / nrm(Q0.S)) / (Q.closedMag / Q0.closedMag) - 1)); }
  // ⑧ ψ 0 の残り = 第352便h の (ア) の残り 2 sin(φ/2)(r = 1)
  const b1 = VB.b1(), t0 = turnRow(T1, GEO, { psiDeg: 0, ref: AX.eq, bHat: vE.bVec, uV, b1, nHat0: nV, sHat0: vE.sHat });
  const turn0 = { r1: Math.abs(t0.r - 1), vsRes: Math.abs(t0.res / cr.resMag - 1), vsState: Math.abs(t0.res / vE.resOverBg - 1) };
  // ⑨ 倍率の振り: 入れ替わりの u で Ω̂ ⊥ b̂・直接の合成 ÷ 背景が大きい数の差の式と近い
  const sc = scanOf(T1, GEO, 'Venus', { dir: 'Np', axis: 'eq', u: uV, AX }, cache), scx = scanOf(T1, GEO, 'Venus', { dir: 'Np', axis: 'eq', u: sc.uCross, AX }, cache);
  const scan = { cross90: Math.abs(scx.angBgDeg - 90), vsBig: Math.abs(sc.resDirect / sc.resOverBg - 1), angVs: Math.abs(sc.angBgDeg - angDeg(sc.Om, sc.bVec)) };
  // 変異
  const muts = { fullAngle: Math.abs(closedStep({ s0: s40, oh: z, k1: 1, k2s: 0, tau: 1, mut: 'fullAngle' }).thDeg - R3.closedR3({ th0Deg: 40, Om: 1, t: 1, kTilt: 1 }).thDeg) > 1e-3,
    flipPrec: Math.abs(closedStep({ s0: sA, oh: z, k1: 0, k2s: 1, tau: 0.2, mut: 'flipPrec' }).azRad - ap) > 1e-3 };
  const rej = [() => stateOf(T1, GEO, 'Venus', { dir: 'Gp', u: 1 }), () => stateOf(T1, GEO, 'Venus', { dir: 'Np', axis: 'ecl', u: 1 }), () => stateOf(T1, GEO, 'Venus', { dir: 'Np', axis: 'L', u: 0 }),
    () => closedStep({ s0: z, oh: z, k1: -1, k2s: 0, tau: 1 }), () => closedStep({ s0: z, oh: z, k1: 1, k2s: 0, tau: -1 }), () => closedStep({ s0: z, oh: z, k1: 1, k2s: 0, tau: 1, read: 'gamma' }),
    () => finalOf({ s0: z, oh: z, nHat: z, f: 2, sense: 'g2p', read: 'alpha' }), () => finalOf({ s0: z, oh: z, nHat: z, f: 0.5, sense: 'g3', read: 'alpha' })]
    .map((fn) => { try { fn(); return false; } catch (e) { return e instanceof RangeError; } });
  return { uV, anc, same, f0, f0n, vsClosed, vsStep, tStar, g2m, rng, dirMax, magMax, vsH2, turn0, scan, muts, rejects: rej };
}
export function pureGates(S) {
  const A = DECL.anchor, a = S.anc;
  return {
    anchorRes: Number(a.resE.toFixed(3)) === A.venusResEq && Number(a.resL.toFixed(3)) === A.venusResL,
    anchorAngle: Number(a.thL.toFixed(2)) === A.venusThL && Number(a.thE.toFixed(2)) === A.venusThEq && Number(a.obl.toFixed(2)) === A.venusObl,
    sameOm: S.same.vsI < 1e-15 && S.same.vsH < 1e-9,
    f0Keep: S.f0 < 1e-9 && S.f0n < 1e-4,
    closedR3: S.vsClosed < 1e-9 && S.tStar < 1e-12,
    stepNumeric: S.vsStep < 1e-5,
    g2m: S.g2m.poles && S.g2m.closed,
    finalRange: S.rng < 1e-3,
    turnClosed: S.dirMax < 1e-5 && S.vsH2 < 1e-9 && S.magMax < 1e-6,
    turnZero: S.turn0.r1 < 1e-12 && S.turn0.vsRes < 1e-9 && S.turn0.vsState < 1e-9,
    scanCross: S.scan.cross90 < 1e-9 && S.scan.vsBig < 1e-9 && S.scan.angVs < 1e-6,
    mutants: S.muts.fullAngle && S.muts.flipPrec,
    rejects: S.rejects.length === 8 && S.rejects.every(Boolean),
  };
}
