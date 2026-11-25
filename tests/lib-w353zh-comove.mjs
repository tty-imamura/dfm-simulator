// 第353便zh(原仮定者の回答(2026-11-25 —— 第151報)「向きと幾何: …」「AN1034: …」「AN1046: C」・統括の検証項目 R497):
//   **向きの一致が「時間の間」保たれる条件 —— 主の列では歳差の率が受け手に依らない(背景の倍率 × 銀河の公転の角速度)ので、公転面も自転軸と同じ係数で背景に応えるなら、
//   太陽の自転軸と受け手の公転の法線は基準軸のまわりを同じ率で回り、相対の位相が止まる。その条件と破れる条件(公転面の応える比・重力の側の交点の回り〔ノブ〕・太陽の寄る割合 f)を数え、
//   あわせて水星・月・イオの 2 つの軸(第353便za の引き継ぎ)を数える純関数。診断だけ**
//   (器 tests/exp-w353zh-comove.mjs と QA behavior.comove353zh・docs.comove353zh が読む —— html を読まない・ファイルを読まない・状態を持たない。後のラウンドの枝もこの口を import してよい)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない。既存の lib は呼ぶだけ(本文は変えない):
//   第353便zc(frame・phiOf・phiAt・nodeScan・sunScan・relPeriodYr・sunPeriodYr —— 向きの一致の幾何)・第353便x(ocOf・winSwing・ringSteps —— 公転面の応える比)・第353便b(mainState —— 主の列)・
//   第353便n(sAt・coefOf —— 寄る割合 f の閉じた形)・第353便za(kState・kWatch —— 換算の係数を置いた組)・第352便w(coneRange)・第352l(closedAxis)・第347便e(t1Table・geometry)。
//   **第353便zc・x・b・n・za の lib は仮の値の lib(第352便b)を閉包に持つ —— この lib を呼ぶ段の正本は最上位に provisional: true と使った鍵の一覧(本 lib の数には使わない)。**
//
// ■ 語: b̂ = 基準軸 L(背景 (N+) の向き)。ŝ☉ = 太陽の自転軸。n̂ = 受け手の公転の法線。φ = 第353便zc の閉じた形の角(own = 2 sin(φ/2))。
//   (g2−): dX/dt = −Ω × X(主の列 —— 合成 Ω のまわりを −abs(Ω) の率で回る)。公転面の応える比 c_輪 ÷ c(第353便x の記号 —— 公転の法線は Ω のまわりを c_輪 ÷ c 倍の率で回る)。
//   太陽の自転軸の比 ratioSpin(既定 1)。相対の率 = 公転の法線の b̂ のまわりの方位の率 − 太陽の自転軸の b̂ のまわりの方位の率(rad/年 —— 右ねじで正)。
//   φ は相対の位相だけで決まる(第353便zc の relSame)ので、主の列では「φ がいまの factor 倍以下で在る年数」= 相対の 1 周 × 窓の角 ÷ 360(閉じた形)。
//   重力の側の交点の回り(公転面どうしの重力の側の歳差)はリポジトリに数が無い —— **ノブ(値は未照合)の格子で、DFM の式ではない比べる列**。b̂ のまわりの回転として足す。
// ■ 言わないこと: 配置が保たれると分かった・金星の自転の状態を言い当てる、と書かない(比の走査の表)。公転面の応える比を決めない。この場・この読み・このノブでは、の表。
import * as ZC from './lib-w353zc-dirgeo.mjs';
import * as X from './lib-w353x-twoaxis.mjs';
import * as B from './lib-w353b-maincol.mjs';
import * as N from './lib-w353n-watch098.mjs';
import * as ZA from './lib-w353za-ktilt.mjs';
import * as W from './lib-w352w-keepcone.mjs';
import * as L from './lib-w352l-suntilt.mjs';
import * as E from './lib-w347e-spintorque.mjs';

export const LIB_VERSION = 'w353zh-comove-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const D2R = Math.PI / 180, YR = 365.25 * 86400, TAU = 2 * Math.PI;
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const nrm = (a) => Math.sqrt(dot(a, a)), scl = (a, s) => [a[0] * s, a[1] * s, a[2] * s], add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const unit = (a) => scl(a, 1 / nrm(a));
const angDeg = (a, b) => Math.atan2(nrm(crs(a, b)), dot(a, b)) / D2R;

/* ───────── 宣言(走らせたノブの格子と物差しの記録 —— 式の形の宣言ではない)───────── */
export const DECL = Object.freeze({
  planets: ZC.DECL.planets, uFocus: 0.98, ageYr: 4.5e9, sense: 'g2m', sd: -1,
  /** 表 1: 公転面の応える比 c_輪 ÷ c */
  ratios: Object.freeze([0, 0.5, 0.9, 0.99, 1, 1.01, 1.1, 2]),
  factor: 2,
  /** 表 2: 組(第353便za の comboList の id)× 受け手(公転面) */
  comboIds: ZA.DECL.comboIds, t2Recvs: Object.freeze(['Venus', 'Earth', 'Mercury']),
  /** 表 3: 破れる条件 —— (i) 1 からのずれ (ii) 重力の側の交点の回りの周期(年 —— ノブ・未照合)と向き (iii) 太陽の自転軸の寄る割合 f */
  devs: Object.freeze([1e-4, 1e-3, 7.6e-3, 1e-2, 0.1]),
  gravPeriodsYr: Object.freeze([1e4, 1e5, 1e6, 1e7]), gravSenses: Object.freeze([-1, 1]),
  fGrid: Object.freeze([1e-5, 1e-4, 8.34e-4, 1e-3, 1e-2, 0.1]),
  /** 表 4: 水星の 2 つの軸(第353便za の kWatch —— 重力の側の潮汐のトルクの列・比べる列)の窓・月とイオの道の面の歳差の周期の格子(年 —— ノブ・未照合) */
  windowsYr: ZA.DECL.windowsYr, thrDeg: 0.1,
  moonKeys: Object.freeze(['Moon', 'Io']), moonPeriodsYr: Object.freeze([1, 10, 100, 1e3, 1e4, 1e5, 1e6]), moonSenses: Object.freeze([-1, 1]), moonWinYr: 1e6,
  /** 数える格子: 1 周を nTurn 点・窓の外へ出る年は格子で挟んで二分 */
  nTurn: 720, nMax: 200000, bisect: 60, nPhase: 3600,
  /** 零試験の点検の数(第353便zc の表 5・表 7) */
  anchor: Object.freeze({ pct: '7.1%', first: '17.7%', holdYr: '3.41e+7', sunPeriodYr: '2.24e+8' }),
  /** 仮の値の台帳の鍵(第353便zc・x・za の lib の閉包に入る —— 本 lib の数には使わない) */
  provKeys: ZC.DECL.provKeys,
  floor: 1e-12, judge: '丸めの桁の床: 相対の率は b̂ のまわりの方位の率の差を直接に数える(主の列で背景だけなら 0)・零試験は相対 1e-9・表の照合は有効数字 3〜4 桁',
});
const ctx = (o = {}) => ({ T1: o.T1 || E.t1Table(), GEO: o.GEO || E.geometry(), cache: o.cache || {} });

/* ───────── 幾何の口 ───────── */
/** X を回転のベクトル w(rad/年)のもとで t 年回す(右ねじ・Rodrigues —— t < 0 も可) */
export function rotBy(X, w, tYr) {
  const om = nrm(w); if (!(om > 0) || tYr === 0) return X.slice();
  const a = unit(w), th = om * tYr, c = Math.cos(th), s = Math.sin(th);
  return add(add(scl(X, c), scl(crs(a, X), s)), scl(a, dot(a, X) * (1 - c)));
}
/** v が回転のベクトル w のもとで動くときの、b̂ のまわりの方位の率(w と同じ単位 —— 右ねじで正) */
export function azRate(b, v, w) { const bv = crs(b, v), q = dot(bv, bv); return q > 0 ? dot(bv, crs(w, v)) / q : 0; }

/* ───────── 状態 ───────── */
/**
 * pairState(key, { u, k, combo, noLocal }) —— 太陽と受け手 key の合成(主の列は第353便b の mainState・組は第353便za の kState):
 *   { key, combo, b, s0, n0, OmSun, OmRing(rad/s), sunLocOverBg, ringLocOverBg }。n0・s0 は第353便zc の frame(8 惑星 —— 衛星は組の nRing)。
 */
export function pairState(key, { u = DECL.uFocus, k = 1, combo = null, noLocal = false, T1, GEO, cache } = {}) {
  if (!(fin(u) && u > 0 && fin(k) && k >= 0)) throw new RangeError('pairState: u > 0・k ≥ 0');
  const C = ctx({ T1, GEO, cache }), F = ZC.frame(C.T1, C.GEO), ck = ['zhF'].join('|');
  if (combo === null) {
    if (!DECL.planets.includes(key)) throw new RangeError('pairState: 主の列の受け手は 8 惑星');
    const mut = noLocal ? 'noLocal' : null, sun = B.mainState(C.T1, C.GEO, 'Sun', { u, k, mut }, C.cache), ring = B.mainState(C.T1, C.GEO, key, { u, k, mut }, C.cache);
    return { key, combo: null, u, k, b: F.b, s0: F.s, n0: F.normals[key], OmSun: sun.Om, OmRing: ring.Om, sunLocOverBg: sun.locOverBg, ringLocOverBg: ring.locOverBg, ck };
  }
  if (!DECL.comboIds.includes(combo)) throw new RangeError('pairState: 組は ' + DECL.comboIds.join('・'));
  if (!ZA.DECL.recvs.includes(key) || key === 'Sun') throw new RangeError('pairState: 組の受け手は ' + ZA.DECL.recvs.filter((x) => x !== 'Sun').join('・'));
  const sun = ZA.kState('Sun', combo, { u, ...C }), ring = ZA.kState(key, combo, { u, ...C });
  return { key, combo, u, k: ring.k, b: F.b, s0: F.s, n0: DECL.planets.includes(key) ? F.normals[key] : ring.nRing, OmSun: sun.Om, OmRing: ring.Om, sunLocOverBg: sun.locOverBg, ringLocOverBg: ring.locOverBg, ck };
}
/** 回転のベクトル(rad/年): 太陽 = σ_d × ratioSpin × Ω☉・公転の法線 = σ_d × ratioRing × Ω_受け手 + σ_g (2π ÷ P_g) b̂(重力の側の交点の回り —— ノブ) */
function rotVecs(P, { ratioRing, ratioSpin, gravRing }) {
  const wSun = scl(P.OmSun, DECL.sd * ratioSpin * YR); let wRing = scl(P.OmRing, DECL.sd * ratioRing * YR);
  if (gravRing) wRing = add(wRing, scl(P.b, gravRing.sense * TAU / gravRing.periodYr));
  return { wSun, wRing };
}
const chkOpt = (ratioRing, ratioSpin, gravRing, f) => {
  if (!(fin(ratioRing) && ratioRing >= 0 && fin(ratioSpin) && ratioSpin >= 0)) throw new RangeError('比 c_輪 ÷ c・ratioSpin ≥ 0');
  if (gravRing && !(fin(gravRing.periodYr) && gravRing.periodYr > 0 && (gravRing.sense === 1 || gravRing.sense === -1))) throw new RangeError('重力の側の交点の回り: 周期 > 0・向き ±1');
  if (!(fin(f) && f >= 0 && f <= 1)) throw new RangeError('0 ≤ f ≤ 1');
};

/* ───────── 約束の口 ───────── */
/**
 * relPhaseRate(key, { u, ratioRing = 0, ratioSpin = 1, k = 1, combo = null, gravRing = null, noLocal }) —— 太陽の自転軸の位相と受け手の公転の法線(交点)の、b̂ のまわりの相対の進む率:
 *   { key, combo, ratioRing, ratioSpin, sunAz, ringAz, relRate(rad/年 = ringAz − sunAz), relPeriodYr(2π ÷ abs(相対の率) —— 0 なら Infinity), sunW, ringW(rad/年), ringOverSun, sunOmToBDeg, ringOmToBDeg, sunLocOverBg, ringLocOverBg }
 */
export function relPhaseRate(key, { u = DECL.uFocus, ratioRing = 0, ratioSpin = 1, k = 1, combo = null, gravRing = null, noLocal = false, T1, GEO, cache } = {}) {
  chkOpt(ratioRing, ratioSpin, gravRing, 0);
  const P = pairState(key, { u, k, combo, noLocal, T1, GEO, cache }), { wSun, wRing } = rotVecs(P, { ratioRing, ratioSpin, gravRing });
  const sunAz = azRate(P.b, P.s0, wSun), ringAz = azRate(P.b, P.n0, wRing), rr = ringAz - sunAz, sW = nrm(P.OmSun) * YR, rW = nrm(P.OmRing) * YR;
  const zero = Math.abs(rr) <= DECL.floor * Math.max(Math.abs(sunAz), Math.abs(ringAz), 1e-300) || rr === 0;
  return { key, combo, u, k: P.k, ratioRing, ratioSpin, gravRing, sunAz, ringAz, relRate: zero ? 0 : rr, relPeriodYr: zero ? Infinity : TAU / Math.abs(rr), sunW: sW, ringW: rW, ringOverSun: rW / sW,
    sunOmToBDeg: angDeg(P.OmSun, P.b), ringOmToBDeg: angDeg(P.OmRing, P.b), sunLocOverBg: P.sunLocOverBg, ringLocOverBg: P.ringLocOverBg };
}
/** t 年の後の太陽の自転軸と公転の法線(f > 0 は第353便n の sAt —— 閉じた形・t ≥ 0) */
function vecsAt(P, R, tYr, f) {
  const s = f > 0 ? N.sAt({ sHat: P.s0, Om: scl(P.OmSun, R.ratioSpin) }, tYr, { f, sense: DECL.sense }) : rotBy(P.s0, R.wSun, tYr);
  return { s, n: rotBy(P.n0, R.wRing, tYr) };
}
/**
 * phiTrack(key, { years, u, ratioRing, ratioSpin, k, combo, gravRing, f, noLocal }) —— φ(t)(years は年の配列か 1 つの数)。
 *   返す [{ tYr, phiDeg, own, sunToBDeg, nToBDeg }]。
 */
export function phiTrack(key, { years, u = DECL.uFocus, ratioRing = 0, ratioSpin = 1, k = 1, combo = null, gravRing = null, f = 0, noLocal = false, T1, GEO, cache } = {}) {
  chkOpt(ratioRing, ratioSpin, gravRing, f);
  const ys = Array.isArray(years) ? years : [years];
  if (!(ys.length > 0 && ys.every(fin))) throw new RangeError('phiTrack: 年は有限の数');
  if (f > 0 && ys.some((t) => t < 0)) throw new RangeError('phiTrack: f > 0 は t ≥ 0 だけ');
  if (!DECL.planets.includes(key)) throw new RangeError('phiTrack: φ は 8 惑星だけ');
  const P = pairState(key, { u, k, combo, noLocal, T1, GEO, cache }), R = { ...rotVecs(P, { ratioRing, ratioSpin, gravRing }), ratioSpin };
  return ys.map((t) => { const v = vecsAt(P, R, t, f), ph = ZC.phiOf(v.s, v.n, P.b); return { tYr: t, phiDeg: ph.phiDeg, own: ph.own, sunToBDeg: angDeg(v.s, P.b), nToBDeg: angDeg(v.n, P.b) }; });
}
/** 窓の外へ出る年(向き dir = +1 前・−1 後)—— 格子で挟んで二分。tMax の内に出なければ null */
function exitYr(P, R, f, lim, dir, tMax, step) {
  const g = (t) => ZC.phiOf(...Object.values(vecsAt(P, R, dir * t, f)), P.b).phiDeg - lim;
  const n = Math.min(DECL.nMax, Math.ceil(tMax / step)), h = tMax / n;
  for (let i = 1; i <= n; i++) {
    if (g(h * i) > 0) { let a = h * (i - 1), c = h * i; for (let j = 0; j < DECL.bisect; j++) { const m = 0.5 * (a + c); if (g(m) > 0) c = m; else a = m; } return c; }
  }
  return null;
}
/**
 * holdYears(key, { factor = 2, u, ratioRing, ratioSpin, k, combo, gravRing, f, tMaxYr, closed = true }) —— φ がいまの factor 倍以下で在る年数:
 *   { key, phi0, lim, relPeriodYr, fwdYr(前へ窓を出るまで —— tMax の内に出なければ null), bwdYr(後へ —— f > 0 は null), winYr(前 + 後), closed(主の列の閉じた形: 相対の 1 周 × 窓の角 ÷ 360・前と後 —— 組・f > 0 では null), tMaxYr }
 */
export function holdYears(key, { factor = DECL.factor, u = DECL.uFocus, ratioRing = 0, ratioSpin = 1, k = 1, combo = null, gravRing = null, f = 0, tMaxYr = DECL.ageYr, closed = true, noLocal = false, T1, GEO, cache } = {}) {
  chkOpt(ratioRing, ratioSpin, gravRing, f);
  if (!(fin(factor) && factor > 1 && fin(tMaxYr) && tMaxYr > 0)) throw new RangeError('holdYears: factor > 1・tMax > 0');
  if (!DECL.planets.includes(key)) throw new RangeError('holdYears: 8 惑星だけ');
  const C = ctx({ T1, GEO, cache }), rp = relPhaseRate(key, { u, ratioRing, ratioSpin, k, combo, gravRing, noLocal, ...C });
  const P = pairState(key, { u, k, combo, noLocal, ...C }), R = { ...rotVecs(P, { ratioRing, ratioSpin, gravRing }), ratioSpin };
  const phi0 = ZC.phiOf(P.s0, P.n0, P.b).phiDeg, lim = factor * phi0;
  const wMax = Math.max(nrm(R.wSun), nrm(R.wRing), Math.abs(rp.relRate), 1e-300), step = Math.min(tMaxYr / 4000, TAU / wMax / DECL.nTurn);
  const fwd = exitYr(P, R, f, lim, 1, tMaxYr, step), bwd = f > 0 ? null : exitYr(P, R, f, lim, -1, tMaxYr, step);
  let cl = null;
  if (closed && combo === null && f === 0) {
    const ck = 'zhNS|' + key + '|' + factor; let ns = C.cache[ck];
    if (!ns) { ns = ZC.nodeScan(C.T1, C.GEO, { id: key, factor }); C.cache[ck] = ns; }
    const per = rp.relPeriodYr, toHi = Math.abs(ns.winHi) / 360 * per, toLo = Math.abs(ns.winLo) / 360 * per;
    cl = { winDeg: ns.winDeg, winYr: per * ns.winDeg / 360, fwdYr: rp.relRate >= 0 ? toHi : toLo, bwdYr: rp.relRate >= 0 ? toLo : toHi };
  }
  return { key, combo, factor, ratioRing, f, gravRing, phi0, lim, relRate: rp.relRate, relPeriodYr: rp.relPeriodYr, fwdYr: fwd, bwdYr: bwd, winYr: fwd !== null && bwd !== null ? fwd + bwd : null, closed: cl, tMaxYr };
}
/**
 * phaseStats({ ratioRing, n }) —— 主の列で相対の 1 周を n 点で回したときの、金星の φ がいまより小さい時間の割合と、金星が 8 惑星で 1 番(φ が最小)の時間の割合
 *   (比 0 = 第353便zc の表 5 の 7.1%・17.7%。比が 1 でない限り比に依らない —— 相対の位相だけで決まる)。
 */
export function phaseStats({ ratioRing = 0, n = DECL.nPhase, u = DECL.uFocus, T1, GEO, cache } = {}) {
  const C = ctx({ T1, GEO, cache }), rp = relPhaseRate('Venus', { u, ratioRing, ...C });
  if (!fin(rp.relPeriodYr)) return { ratioRing, n, relPeriodYr: Infinity, pct: null, first: null };
  const ts = Array.from({ length: n }, (_, j) => rp.relPeriodYr * j / n), tr = Object.fromEntries(DECL.planets.map((id) => [id, phiTrack(id, { years: ts, u, ratioRing, ...C }).map((r) => r.phiDeg)]));
  const v = tr.Venus, v0 = v[0], firsts = ts.map((_, j) => DECL.planets.every((id) => id === 'Venus' || tr[id][j] > v[j]));
  return { ratioRing, n, relPeriodYr: rp.relPeriodYr, pct: v.filter((x) => x < v0).length / n, first: firsts.filter(Boolean).length / n };
}

/* ───────── 表 4 の口(水星・月・イオの 2 つの軸)───────── */
/**
 * moonTwo(key, combo, { periodYr, signG, Tyr }) —— 月・イオの公転の法線のまわりの重力の側の歳差(周期 periodYr —— ノブ・未照合・DFM の式ではない比べる列)+ 軸引きずり(組の合成 —— 第353便za の kState)の
 *   2 つの軸(第353便x の ocOf・winSwing・第352便w の coneRange):{ key, combo, periodYr, signG, swingDeg(一周の揺れの幅の上限 —— 一周の内の abs(ε − ε₀) の最大), winDeg(Tyr 年の内), eps0Deg, W }
 */
export function moonTwo(key, combo, { periodYr, signG = -1, Tyr = DECL.moonWinYr, u = DECL.uFocus, T1, GEO, cache } = {}) {
  if (!DECL.moonKeys.includes(key)) throw new RangeError('moonTwo: 受け手は ' + DECL.moonKeys.join('・'));
  if (!(fin(periodYr) && periodYr > 0 && (signG === 1 || signG === -1) && fin(Tyr) && Tyr >= 0)) throw new RangeError('moonTwo: 周期 > 0・向き ±1・T ≥ 0');
  const C = ctx({ T1, GEO, cache }), st = ZA.kState(key, combo, { u, ...C }), omG = TAU / (periodYr * YR);
  const Oc = X.ocOf(st, { omG, signG, sense: DECL.sense, kRing: 0 }), cr = W.coneRange(Oc, st.sHat, st.nRing);
  return { key, combo: st.combo, k: st.k, periodYr, signG, eps0Deg: st.eps0Deg, W: st.W, ratio: st.W / omG,
    swingDeg: Math.max(cr.oblMaxDeg - st.eps0Deg, st.eps0Deg - cr.oblMinDeg), winDeg: X.winSwing(Oc, st.sHat, st.nRing, Tyr, 400) };
}
/** 月・イオで一周の揺れが thr 以内に収まる重力の側の周期の上限(年 —— 二分・対数)と率の下限(″/年)。下の端 1e-3 年でも越えれば null */
export function moonNeed(key, combo, { signG = -1, thrDeg = DECL.thrDeg, u = DECL.uFocus, T1, GEO, cache } = {}) {
  const C = ctx({ T1, GEO, cache }), sw = (lp) => moonTwo(key, combo, { periodYr: Math.pow(10, lp), signG, Tyr: 0, u, ...C }).swingDeg;
  let a = -3, b = 12;
  if (sw(a) > thrDeg) return { key, combo, signG, periodMaxYr: null, rateMinAsYr: null };
  if (sw(b) <= thrDeg) return { key, combo, signG, periodMaxYr: Infinity, rateMinAsYr: 0 };
  for (let j = 0; j < DECL.bisect; j++) { const m = 0.5 * (a + b); if (sw(m) <= thrDeg) a = m; else b = m; }
  const P = Math.pow(10, a); return { key, combo, signG, periodMaxYr: P, rateMinAsYr: 1296000 / P };
}

/* ───────── 零試験・変異 ───────── */
export function pureScenes(T1 = E.t1Table(), GEO = E.geometry()) {
  const cache = {}, C = { T1, GEO, cache }, rel = (a, b) => Math.abs(a / b - 1);
  // ① 比 0(公転面を固定): 相対の 1 周 = 第353便zc の太陽の円錐の周期(2.24 億年)・窓の年 = 第353便zc の timeRows の sunOnly(3.41e7 年)・前へ出るまで同じ
  const r0 = relPhaseRate('Venus', { ratioRing: 0, ...C }), h0 = holdYears('Venus', { ratioRing: 0, ...C }), NS = ZC.nodeScan(T1, GEO, {}), tr0 = ZC.timeRows(NS)[0];
  const dPer = rel(r0.relPeriodYr, ZC.sunPeriodYr()), dWin = rel(h0.closed.winYr, tr0.inWinYr), dExit = rel(h0.closed.fwdYr, tr0.toExitYr), dNum = Math.max(Math.abs(h0.fwdYr - h0.closed.fwdYr), Math.abs(h0.bwdYr - h0.closed.bwdYr)) * 360 / r0.relPeriodYr;   // 数えた出口と閉じた形(第353便zc の交点の格子 0.1°)の差 —— 相対の位相の度
  // ② 比 0 の位相の割合 = 第353便zc の表 5(7.1%・17.7% —— sunScan の金星の行と相対 1e-12)
  const ps = phaseStats({ ratioRing: 0, ...C }), sc = ZC.sunScan(T1, GEO, {}).rows.find((r) => r.id === 'Venus');
  // ③ 比 1: 背景だけ(局所を外す)なら相対の率 0(1 周 Infinity)・局所つき(主の列)でも相対の率 ÷ 太陽の率 ≤ 2e-10・窓を出ない
  const r1 = relPhaseRate('Venus', { ratioRing: 1, noLocal: true, ...C }), r1L = relPhaseRate('Venus', { ratioRing: 1, ...C }), h1 = holdYears('Venus', { ratioRing: 1, ...C, closed: false });
  // ④ 閉じた形: 主の列の相対の率 = (1 − 比) × u ω_G(8 惑星・比 3 つ —— 相対 1e-9)・方位の率の口 = 第353便b の mainState の az.ax(太陽)
  const W0 = DECL.uFocus * 9.09e-16, wG = r0.sunW / DECL.uFocus;
  let dLin = 0; for (const id of DECL.planets) for (const q of [0, 0.5, 2]) { const r = relPhaseRate(id, { ratioRing: q, noLocal: true, ...C }); dLin = Math.max(dLin, rel(r.relRate, (1 - q) * r.sunW)); }
  const ms = B.mainState(T1, GEO, 'Sun', { u: DECL.uFocus }, cache), dAz = rel(r0.sunAz, ms.az.ax * YR);
  // ⑤ φ(t) = 第353便zc の phiAt(相対の位相): 比 0.5 で t 年の後の φ = phiAt(交点 −(1 − 比) W t の度)—— 局所を外して相対 1e-9
  const tt = 3.7e7, pt = phiTrack('Venus', { years: tt, ratioRing: 0.5, noLocal: true, ...C })[0], psi = (0.5 * r0.sunW * tt) / D2R, pz = ZC.phiAt('Venus', { nodeDeg: psi, F: ZC.frame(T1, GEO) });
  const dPhi = rel(pt.phiDeg, pz.phiDeg);
  // ⑥ 回転の口 = 第352便l の closedAxis(経路 ② だけ)・第353便x の ringSteps(比 0.7・f_輪 0)の公転の法線と同じ・第353便n の sAt(f 0)
  const st = N.watchState(T1, GEO, 'Venus|Sun', {}, cache), kr = 0.7, Ty = 5e7;
  const rs = X.ringSteps(st, { kRing: kr, Tyr: Ty, steps: 1 }), nMine = rotBy(st.nRing, scl(st.Om, DECL.sd * kr * YR), Ty), dRing = nrm(add(rs.n, scl(nMine, -1)));
  const sMine = rotBy(st.sHat, scl(st.Om, DECL.sd * YR), Ty), dSat = nrm(add(N.sAt(st, Ty, {}), scl(sMine, -1)));
  const dCl = nrm(add(L.closedAxis(st.sHat, st.Om, Ty * YR, { sense: 'g2m', kTilt: 0, kPrec: 1 }), scl(sMine, -1)));
  // ⑦ 組の状態: k1 の組の金星の公転の法線 = 第353便zc の frame の法線・太陽の合成の向き = b̂(1e-6° の内)・第353便za の kWatch(水星・two・tide・1 万年)を呼べる
  const pk = pairState('Venus', { combo: 'k1', ...C }), F = ZC.frame(T1, GEO), dN = angDeg(ZA.kState('Venus', 'k1', C).nRing, F.normals.Venus), sunB = angDeg(pk.OmSun, pk.b);
  const kw = ZA.kWatch('Mercury', 'k1', { years: 1e4, mode: 'two', grav: 'tide', ...C }), kwOk = kw.none === false && fin(kw.winDeg);
  // ⑧ 月・イオ: 重力の側の周期を短くすると一周の揺れは小さくなる(単調の見本)・第353便x の twoRow(地球・omG を渡す)と moonTwo の作りが同じ型(ocOf・coneRange)
  const m1 = moonTwo('Moon', 'k1', { periodYr: 10, Tyr: 0, ...C }).swingDeg, m2 = moonTwo('Moon', 'k1', { periodYr: 1e5, Tyr: 0, ...C }).swingDeg;
  // ⑨ 変異: 太陽の向きの符号を替えると比 1 で止まらない・比を 1 に置いても重力の側の交点の回りを足すと止まらない
  const mutSun = (() => { const P = pairState('Venus', { noLocal: true, ...C }), a = azRate(P.b, P.s0, scl(P.OmSun, +1 * YR)), b2 = azRate(P.b, P.n0, scl(P.OmRing, -1 * YR)); return Math.abs(b2 - a) > 0.5 * r0.sunW; })();
  const mutG = fin(relPhaseRate('Venus', { ratioRing: 1, noLocal: true, gravRing: { periodYr: 1e6, sense: -1 }, ...C }).relPeriodYr);
  const rej = [() => relPhaseRate('Pluto'), () => relPhaseRate('Venus', { ratioRing: -1 }), () => pairState('Venus', { combo: 'zz' }), () => phiTrack('Moon', { years: 1 }), () => phiTrack('Venus', { years: -1, f: 0.1 }),
    () => holdYears('Venus', { factor: 1 }), () => relPhaseRate('Venus', { gravRing: { periodYr: 0, sense: 1 } }), () => moonTwo('Venus', 'k1', { periodYr: 1 }), () => moonTwo('Moon', 'k1', { periodYr: 1, signG: 0 })]
    .map((fn) => { try { fn(); return false; } catch (er) { return er instanceof RangeError; } });
  return { dPer, dWin, dExit, dNum, holdWinYr: h0.closed.winYr, sunPeriodYr: r0.relPeriodYr, pct: ps.pct, first: ps.first, scPct: sc.pct, scFirst: sc.firstFrac,
    r1Rate: r1.relRate, r1PerInf: r1.relPeriodYr === Infinity, r1LRel: Math.abs(r1L.relRate) / r1L.sunW, h1Fwd: h1.fwdYr, h1Bwd: h1.bwdYr, dLin, dAz, wG, W0, dPhi, dRing, dSat, dCl, dN, sunB, kwOk, m1, m2, mutSun, mutG, rejects: rej };
}
const p3 = (x, w) => Number(Number(x).toPrecision(3)).toExponential(2) === Number(w).toExponential(2);
const pc1 = (x) => (100 * x).toFixed(1) + '%';
export function pureGates(S) {
  const A = DECL.anchor;
  return {
    fixedPeriod: S.dPer < 1e-9 && p3(S.sunPeriodYr, A.sunPeriodYr),
    fixedHold: S.dWin < 1e-9 && S.dExit < 1e-9 && S.dNum <= 0.1 && p3(S.holdWinYr, A.holdYr),
    fixedPhase: Math.abs(S.pct - S.scPct) < 1e-12 && Math.abs(S.first - S.scFirst) < 1e-12 && pc1(S.pct) === A.pct && pc1(S.first) === A.first,
    coStop: S.r1Rate === 0 && S.r1PerInf && S.r1LRel <= 2e-10 && S.h1Fwd === null && S.h1Bwd === null,
    linear: S.dLin < 1e-9 && S.dAz < 1e-9 && Math.abs(S.wG / 9.09e-16 / (365.25 * 86400) - 1) < 1e-2,
    phiPhase: S.dPhi < 1e-9,
    rotations: S.dRing < 1e-9 && S.dSat < 1e-12 && S.dCl < 1e-12,
    combos: S.dN < 1e-9 && S.sunB < 1e-6 && S.kwOk && S.m1 < S.m2,
    mutants: S.mutSun && S.mutG && S.rejects.length === 9 && S.rejects.every(Boolean),
  };
}
