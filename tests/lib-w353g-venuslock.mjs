// 第353便g(原仮定者の回答(2026-11-25 —— 第151報)「AN1034: …」・統括の検証項目 R471):
//   **「金星の自転がロックした状態」の判定の量の候補 (L1)(L2)(L3) と、地球が金星の自転に及ぼす作用の候補 (E-S)(E-M)(E-g)(E-潮) を同じ単位で並べる純関数。診断だけ**
//   (器 tests/exp-w353g-venuslock.mjs と QA behavior.venuslock353g・docs.venuslock353g が読む —— html を読まない・ファイルを読まない・状態を持たない。後のラウンドの枝もこの口を import する)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない。既存の lib は呼ぶだけ(本文は変えない):
//   第352便k(spinRot —— 主の列の (S)・規則の半径)・第352便c(refAxes —— 基準軸は必ずここから)・第352便d(bgVec —— 背景の向きと大きさ)・
//   第352便h(b1・cancelOf・otherSrc・resonanceArith —— 打ち消しの閉じた形・地球を源にした (S)(M)・共鳴の算術)・第352便u(rateOf —— 重力の側の潮汐のトルクの列)・
//   第352便b(provValue・repoRef —— 仮の値は台帳に在る数だけ)・第351便c(pairInput)・第337便c(G_SI)・第347便e(t1Table・geometry)。
//
// ■ 語: 残り = 主の列の (S)(源 = 太陽・規則の半径・(C2))と背景 (N+) L の合成の大きさ(rad/s)。背景の大きさ u(銀河の公転の角速度の倍)の列 =
//   (uV)〔金星で (S) と等大〕・0.835〔(N+) の窓の上端〕・0.98〔注目の列 —— 窓の上端より上〕。比べる列は基準軸 eq。
//   **(L1)** 内合ごとの「地球を向く経度」のずれ(°/内合 —— 第352便h の resonanceArith)/**(L2)** 軸の拘束の大きさ = 残り ÷ 背景/
//   **(L3)** (自転の率 − 共鳴の率)÷ 共鳴の幅(幅は (E-g) のトルクの振り子の半幅 —— (B − A)/C の格子ごと)。
//   **(E-S)** 地球の自転の分 (S) の軸引きずり(内合の時・1 会合の平均 —— 第352便h の otherSrc)/**(E-M)** 地球との相対の運動の分(比べる列)/
//   **(E-g)** 地球の重力が金星の形の軸対称でない分 (B − A)/C に及ぼすトルク(**比べる列 —— DFM の式ではない**。(B − A)/C はリポジトリに無い → ノブ(値は未照合)の格子)/
//   **(E-潮)** 太陽の重力の潮汐のトルクの列(第352便u の (T-g) —— 金星の J2・慣性モーメントの係数はリポジトリの数。比べる列 —— DFM の式ではない)。
// ■ (E-g) の式(同じ面の円の道・金星の公転面の 2 次元の模型): 長軸と地球の向きの角 ψ について C ψ̈ = −(3/2)(G M_E ÷ d³)(B − A) sin 2ψ。
//   共鳴の自転(内合ごとに同じ面を地球に向ける周期 P_res —— 逆行)の 1 会合の平均で Z = ⟨e^{2iχ(t)} ÷ d(t)³⟩(χ = 共鳴の回転での ψ の動き)。
//   平均の振り子: x = 2ψ₀ + arg Z・ẍ = −Ω_p² sin x・**Ω_p² = 3 G M_E ((B − A)/C) abs(Z)**。共鳴の幅(自転の率の半幅)= Ω_p・秤動の周期 = 2π ÷ Ω_p。
//   捕まる条件(連続の極限): ν² < Ω_p² cos²(x/2)(ν = 自転の率の共鳴からのずれ)。步: 内合ごとに 1 步(ν ← ν − (Ω_p²/2) S sin x・x ← x + 2 ν S)。
// ■ 言わないこと: 金星はロックしている・逆回転の原因・共鳴しているとは書かない(判定の量の候補の表)。仮の値(自転周期 243.0226 日)を使う数は「仮・未照合」の印つき。
import * as K from './lib-w352k-spinform.mjs';
import * as RA from './lib-w352c-refaxis.mjs';
import * as PS from './lib-w352d-precsense.mjs';
import * as H from './lib-w352h-venusbal.mjs';
import * as U from './lib-w352u-tidaldrag.mjs';
import * as PV from './lib-w352b-provisional.mjs';
import * as SP from './lib-w351c-srcparts.mjs';
import * as TL from './lib-w337c-tidelock.mjs';
import * as E from './lib-w347e-spintorque.mjs';

export const LIB_VERSION = 'w353g-venuslock-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const D2R = Math.PI / 180, DAY = 86400;
const { dot, nrm, scl, add, sub, unit } = K.vec;
export const ASYR = PS.ASYR;

/* ───────── 宣言 ───────── */
export const DECL = Object.freeze({
  /** 背景の大きさの列(主の列の 3 つ —— (uV) は金星で (S) と等大の倍率) */
  mags: Object.freeze([Object.freeze({ id: 'uV', u: null, label: '(uV)〔等大〕' }), Object.freeze({ id: 'u0835', u: 0.835, label: '0.835〔(N+) の窓の上端〕' }), Object.freeze({ id: 'u098', u: 0.98, label: '0.98〔注目の列〕' })]),
  /** 基準軸: L が主・eq は比べる列 */
  axes: Object.freeze(['L', 'eq']), mainAxis: 'L', dir: 'Np',
  /** (B − A)/C のノブ(値は未照合)の格子 —— リポジトリに無い量 */
  qGrid: Object.freeze([1e-7, 1e-6, 1e-5]),
  /** (E-g) の 1 会合の平均の刻み(中点)と照合の刻み */
  nZ: 4096, nZcheck: 16384,
  /** 共鳴の自転の回数(1 会合周期あたりの地球の向きに対する回転 —— 第352便h の m) */
  mRes: 5,
  /** 捕まる範囲の步: 初めの位相 x₀ の格子の数・初めのずれ ν₀ ÷ Ω_p の格子・走らせる長さ(小振幅の秤動の周期の倍) */
  nX0: 12, nuGrid: Object.freeze([0, 0.5, 0.9, 1.1, 2]), runPeriods: 3,
  /** 仮の値の台帳の鍵(第352便b —— ここに無い数は使わない) */
  provKeys: Object.freeze(['venus.spin.period']),
  /** 統括の数え直し(共通ブリーフ 353・352)の点検の数 */
  anchor: Object.freeze({ uV: 1.19282e-12, phiLDeg: 0.7606, resL: 0.013274, resEq: 0.010, lonShift: 0.513, pRes: 243.167, dP: -0.144, L: Object.freeze([0.026257, 0.008317, 0.999621]) }),
  sepGuard: 0.05,
  judge: '丸めの桁の床: 打ち消しで小さくなる残りは差で作らず角から直接に数える(閉じた形 2 sin(φ/2) と照合)・比は有効数字 3 桁',
});
const MAG_IDS = DECL.mags.map((m) => m.id);

/* ───────── 主の列の残り ───────── */
/** 金星の (S)(源 = 太陽・規則の半径・(C2)・k 1 —— 第352便k の spinRot)と自転軸・公転の法線 */
export function venusS(T1, GEO, cache = null) {
  if (cache && cache.vS) return cache.vS;
  const st = K.spinRot(T1, GEO, 'Venus', 'Sun', { part: 'S', tSrc: 0, cR: null, read: 'C2' }), r = { S: st.Om, sHat: unit(st.sHat), nHat: unit(st.nHat) };
  if (cache) cache.vS = r; return r;
}
/** 背景の大きさの列の u(id → 倍率)。(uV) = abs(S) ÷ b₁ */
export function uOf(T1, GEO, magId, cache = null) {
  const m = DECL.mags.find((x) => x.id === magId); if (!m) throw new RangeError('uOf: 大きさの列は ' + MAG_IDS.join('・'));
  return m.u === null ? nrm(venusS(T1, GEO, cache).S) / H.b1() : m.u;
}
/**
 * 残り(主の列): 金星の (S) + 背景 (N+)(基準軸 axis)・倍率 u → { u, bgMag, resDirect(合成の大きさ rad/s —— 和から), resClosed(閉じた形 —— (uV) のとき 2 sin(φ/2) × 背景), res(採る値), resOverBg((L2)), phiDeg }。
 * (uV) の残りは閉じた形で採る(打ち消しで小さくなる量は差で作らない)・ほかは和で採る。
 */
export function residualOf(T1, GEO, { axis = DECL.mainAxis, magId }, cache = null) {
  if (!DECL.axes.includes(axis)) throw new RangeError('residualOf: 基準軸は ' + DECL.axes.join('・'));
  const V = venusS(T1, GEO, cache), u = uOf(T1, GEO, magId, cache), ax = RA.refAxis(axis, T1, GEO), bg = PS.bgVec(DECL.dir, { u, axis: ax }), bo = H.b1();
  const bgMag = nrm(bg), c = H.cancelOf(V.S, unit(bg), bo), direct = nrm(add(V.S, bg));
  const closed = magId === 'uV' ? c.resMag * bgMag : null, res = closed === null ? direct : closed;
  return { axis, magId, u, bgMag, resDirect: direct, resClosed: closed, res, resOverBg: res / bgMag, phiDeg: c.phiDeg };
}

/* ───────── (L1) 内合の位相・(L3) の率 ───────── */
/** 金星と地球の公転の周期(日 —— リポジトリの数)と仮の自転周期(日) */
export function periods() {
  return { orbV: PV.repoRef('repo.orbitDays.venus'), orbE: PV.repoRef('repo.orbitDays.earth'), spin: PV.provValue('venus.spin.period') };
}
/** (L1): 自転周期 spinDays(逆行)→ 第352便h の resonanceArith(内合ごとのずれ °・共鳴の周期・差)+ 自転の率と共鳴の率(rad/s)・ν = 位相 ψ₀ の率(逆行の体の角 −ω t に対する ψ₀ の率 = −(ω − ω_res)) */
export function lockPhase(spinDays = null) {
  const P = periods(), sd = spinDays === null ? P.spin : spinDays;
  if (!(fin(sd) && sd > 0)) throw new RangeError('lockPhase: 自転周期 > 0');
  const ra = H.resonanceArith({ spinDays: sd, orbV: P.orbV, orbE: P.orbE, m: DECL.mRes });
  const w = 2 * Math.PI / (sd * DAY), wRes = 2 * Math.PI / (ra.Pres * DAY);
  return { spinDays: sd, S: ra.S, shiftDeg: ra.shiftDeg, cycleYr: ra.cycleYr, Pres: ra.Pres, dP: ra.dP, turns: ra.turns, w, wRes, dW: w - wRes, nu: -(w - wRes) };
}

/* ───────── (E-g) 地球の重力が (B − A)/C に及ぼすトルク(比べる列 —— DFM の式ではない)───────── */
/** 金星と地球の道の半径(m —— 第351便c の pairInput の距離)・地球の G M(第337便c の G_SI × 質量) */
export function orbitGeom(T1, GEO) {
  const V = SP.pairInput(T1, GEO, 'Venus', 'Sun'), Q = SP.pairInput(T1, GEO, 'Earth', 'Sun');
  return { aV: V.a, aE: Q.a, GME: TL.G_SI * Q.m, dInf: Q.a - V.a };
}
/**
 * 1 会合の平均 Z = ⟨e^{2iχ} ÷ d³⟩(共鳴の自転・逆行・同じ面の円の道)。t = 0 が内合。体の角 θ = −ω_res t・地球の向き α(t)・χ = θ − α。
 * 戻り値 { re, im, abs, arg, meanInvD3(⟨1 ÷ d³⟩), peak(1 ÷ d_inf³), wrap2psi(1 会合で 2χ が進む量 ÷ 2π —— 整数なら周期的) }
 */
export function zAvg(T1, GEO, { n = DECL.nZ, spinDays = null } = {}) {
  if (!(Number.isInteger(n) && n >= 16)) throw new RangeError('zAvg: 刻み n ≥ 16 の整数');
  const G0 = orbitGeom(T1, GEO), Lp = lockPhase(), P = periods(), Sd = Lp.S * DAY, w = spinDays === null ? Lp.wRes : 2 * Math.PI / (spinDays * DAY);
  const nV = 2 * Math.PI / (P.orbV * DAY), nE = 2 * Math.PI / (P.orbE * DAY);
  let re = 0, im = 0, md = 0;
  const alphaAt = (t) => { const xe = G0.aE * Math.cos(nE * t) - G0.aV * Math.cos(nV * t), ye = G0.aE * Math.sin(nE * t) - G0.aV * Math.sin(nV * t); return { a: Math.atan2(ye, xe), d: Math.hypot(xe, ye) }; };
  const a0 = alphaAt(0).a;
  for (let j = 0; j < n; j++) {
    const t = (j + 0.5) / n * Sd, q = alphaAt(t), chi = -w * t - (q.a - a0), id3 = 1 / (q.d * q.d * q.d);
    re += Math.cos(2 * chi) * id3 / n; im += Math.sin(2 * chi) * id3 / n; md += id3 / n;
  }
  // 1 会合で地球の向きが進む角(連続の展開 —— 内合から内合へ: α は n_E S だけ進む)
  const wrap2psi = 2 * (-w * Sd - nE * Sd) / (2 * Math.PI);
  return { re, im, abs: Math.hypot(re, im), arg: Math.atan2(im, re), meanInvD3: md, peak: 1 / (G0.dInf ** 3), wrap2psi };
}
/** (E-g) の 1 行: (B − A)/C = q → { q, Om2, OmP(共鳴の幅 = 自転の率の半幅 rad/s), libYr(秤動の周期 年), dPday(幅の周期の半幅 日), torqueRate(K/C = 自転の率を変える率の最大 rad/s²), fracRate(K/(C ω) 1/s) } */
export function egRow(T1, GEO, q, Z = null) {
  if (!(fin(q) && q > 0)) throw new RangeError('egRow: (B − A)/C > 0');
  const z = Z || zAvg(T1, GEO), G0 = orbitGeom(T1, GEO), Lp = lockPhase();
  const Om2 = 3 * G0.GME * q * z.abs, OmP = Math.sqrt(Om2), kc = 1.5 * G0.GME * q * z.abs;
  const PresS = Lp.Pres * DAY, dPday = PresS * PresS * OmP / (2 * Math.PI) / DAY;
  return { q, Om2, OmP, libYr: 2 * Math.PI / OmP / (365.25 * DAY), dPday, torqueRate: kc, fracRate: kc / Lp.wRes, L3: Lp.nu / OmP };
}
/** 捕まる条件(連続の極限)ν² < Ω_p² cos²(x/2) */
export const boundClosed = (x, nu, OmP) => nu * nu < OmP * OmP * Math.cos(x / 2) ** 2;
/** 分界の近さ: ν² ÷ (Ω_p² cos²(x/2))(1 が分界) */
export const sepRatio = (x, nu, OmP) => (nu * nu) / Math.max(OmP * OmP * Math.cos(x / 2) ** 2, 1e-300);
/**
 * 振り子の形の步(内合ごとに 1 步): ν ← ν − (Ω_p²/2) S sin x・x ← x + 2 ν S。走らせる長さ = runPeriods × 小振幅の秤動の周期。
 * 戻り値 { bound(x の幅が 2π より小さい), span(x の幅 rad), steps, crossT(初めの 0 交差までの步の数 —— 周期の照合に) }。mut 'flip' はトルクの符号を逆に(変異)
 */
export function pendStep({ x0, nu0, OmP, Sd, periods: np = DECL.runPeriods, mut = null }) {
  if (!(fin(x0) && fin(nu0) && fin(OmP) && OmP > 0 && fin(Sd) && Sd > 0)) throw new RangeError('pendStep: 入力');
  const steps = Math.ceil(np * 2 * Math.PI / OmP / Sd), g = (mut === 'flip' ? -1 : 1) * 0.5 * OmP * OmP * Sd;
  let x = x0, nu = nu0, lo = x0, hi = x0, cross = null;
  for (let k = 1; k <= steps; k++) { const prev = x; nu -= g * Math.sin(x); x += 2 * nu * Sd; if (x < lo) lo = x; if (x > hi) hi = x; if (cross === null && prev !== 0 && Math.sign(prev) !== Math.sign(x)) cross = k; }
  return { bound: hi - lo < 2 * Math.PI, span: hi - lo, steps, crossT: cross };
}
/** 捕まる範囲の表: q ごとに x₀ の格子 × ν₀ の格子(÷ Ω_p)+ いまのずれ ν_now → 步と閉じた条件の数え */
export function captureRows(T1, GEO, Z = null) {
  const z = Z || zAvg(T1, GEO), Lp = lockPhase(), Sd = Lp.S * DAY, out = [];
  for (const q of DECL.qGrid) {
    const eg = egRow(T1, GEO, q, z);
    const nus = [...DECL.nuGrid.map((f) => ({ id: 'f' + f, f, nu: f * eg.OmP })), { id: 'now', f: Lp.nu / eg.OmP, nu: Lp.nu }];
    for (const N of nus) {
      let nb = 0, nc = 0, agree = 0, near = 0;
      for (let j = 0; j < DECL.nX0; j++) {
        const x0 = -Math.PI + (j + 0.5) * 2 * Math.PI / DECL.nX0, cl = boundClosed(x0, N.nu, eg.OmP), sr = sepRatio(x0, N.nu, eg.OmP);
        if (Math.abs(sr - 1) < DECL.sepGuard) { near++; continue; }
        const st = N.id === 'now' && Math.abs(N.f) > 10 ? { bound: false } : pendStep({ x0, nu0: N.nu, OmP: eg.OmP, Sd });
        if (st.bound) nb++; else nc++; if (st.bound === cl) agree++;
      }
      out.push({ q, nuId: N.id, nuOverOmP: N.f, bound: nb, circ: nc, near, agree, n: DECL.nX0 });
    }
  }
  return out;
}

/* ───────── 地球の作用の候補 (E-S)(E-M)(E-潮)───────── */
/** (E-S)(E-M): 地球を源にした金星の位置の (S)(M)(内合の時・1 会合のベクトルの平均・大きさの平均 —— 第352便h の otherSrc)。rad/s */
export function earthDrag(T1, GEO, cache = null) {
  if (cache && cache.eD) return cache.eD;
  const o = H.otherSrc(T1, GEO, 'Earth'), r = { infS: nrm(o.inf.S), meanS: nrm(o.mean.S), magS: o.meanMag.S, infM: nrm(o.inf.M), meanM: nrm(o.mean.M), magM: o.meanMag.M, dInf: o.dInf };
  if (cache) cache.eD = r; return r;
}
/** (E-潮): 太陽の重力の潮汐のトルクの列(第352便u の rateOf —— 'sun'・'Tg')の軸を動かす率(rad/s)と ″/年 */
export function sunTide(T1, GEO) {
  const r = U.rateOf(T1, GEO, 'Venus', 'sun', 'Tg', 'nat');
  return { rate: nrm(r.ds), asYr: r.mag, H: r.H, omega: r.omega };
}
/**
 * 候補の一覧(同じ単位: rad/s —— 軸を動かす率か自転の率の尺度)。kind 'axis'(軸を動かす率)・'spin'(自転の率の尺度)。main = 主の候補か比べる列か。
 */
export function candidates(T1, GEO, cache = null, Z = null) {
  const e = earthDrag(T1, GEO, cache), t = sunTide(T1, GEO), z = Z || zAvg(T1, GEO), out = [
    { id: 'ES_inf', fam: 'E-S', kind: 'axis', v: e.infS, unit: 'rad/s', note: '内合の時' },
    { id: 'ES_mean', fam: 'E-S', kind: 'axis', v: e.meanS, unit: 'rad/s', note: '1 会合のベクトルの平均' },
    { id: 'EM_inf', fam: 'E-M', kind: 'axis', v: e.infM, unit: 'rad/s', note: '内合の時(比べる列)' },
    { id: 'EM_mean', fam: 'E-M', kind: 'axis', v: e.meanM, unit: 'rad/s', note: '1 会合のベクトルの平均(比べる列)' }];
  for (const q of DECL.qGrid) { const g = egRow(T1, GEO, q, z); out.push({ id: 'Eg_OmP_' + q, fam: 'E-g', kind: 'spin', q, v: g.OmP, unit: 'rad/s', note: '共鳴の幅 Ω_p(比べる列 —— DFM の式ではない)' });
    out.push({ id: 'Eg_frac_' + q, fam: 'E-g', kind: 'spin', q, v: g.fracRate, unit: '1/s', note: 'K ÷ (C ω_res)(自転の率を変える率の最大 ÷ 自転の率 —— 比べる列)' }); }
  out.push({ id: 'Etide', fam: 'E-潮', kind: 'axis', v: t.rate, unit: 'rad/s', note: '太陽の重力の潮汐のトルクの列(第352便u —— 比べる列・DFM の式ではない)' });
  return out;
}

/* ───────── 零試験・変異 ───────── */
export function pureScenes(T1 = E.t1Table(), GEO = E.geometry()) {
  const cache = {}, A = DECL.anchor, ax = RA.refAxes(T1, GEO), Lv = unit(ax.L);
  // ① 統括の数え直し 3: 基準軸 L・金星の (uV)・φ・等大の残り ÷ 背景(L)・(N+) eq の残り 1.0%
  const V = venusS(T1, GEO, cache), uV = uOf(T1, GEO, 'uV', cache), rL = residualOf(T1, GEO, { axis: 'L', magId: 'uV' }, cache), rE = residualOf(T1, GEO, { axis: 'eq', magId: 'uV' }, cache);
  const hS = H.localSun(T1, GEO, 'Venus').S, vsH = nrm(sub(V.S, hS)) / nrm(hS);
  // ② 残りの閉じた形 = 和から(uV —— 1.3% なので差でも桁は落ちない)・倍率 0.98 で残り ÷ 背景 ≈ 1
  const closedVsDirect = Math.abs(rL.resClosed / rL.resDirect - 1), r098 = residualOf(T1, GEO, { magId: 'u098' }, cache);
  // ③ (L1): 仮の自転周期で 0.513°・共鳴の周期で 0・共鳴の周期 243.167 日・差 −0.144 日(第352便h の数)
  const Lp = lockPhase(), L0 = lockPhase(Lp.Pres);
  // ④ (E-g) の平均: 刻みを 4 倍にして同じ・2ψ が 1 会合で整数周(周期的)・abs(Z) ≤ ⟨1/d³⟩ ≤ 1/d_inf³
  const z = zAvg(T1, GEO), zc = zAvg(T1, GEO, { n: DECL.nZcheck });
  const zConv = Math.hypot(z.re - zc.re, z.im - zc.im) / zc.abs, wrapErr = Math.abs(z.wrap2psi - Math.round(z.wrap2psi));
  // ⑤ 振り子の步: 小振幅の周期 = 2π ÷ Ω_p(0 交差は 1/4 周期)・步と閉じた条件の数えが一致(分界の近くを除く)
  const eg = egRow(T1, GEO, 1e-6, z), Sd = Lp.S * DAY, sm = pendStep({ x0: 0.05, nu0: 0, OmP: eg.OmP, Sd, periods: 1 }), quarter = 0.5 * Math.PI / eg.OmP / Sd;
  const cap = captureRows(T1, GEO, z), capAgree = cap.every((r) => r.agree === r.n - r.near);
  // ⑥ (E-S)(E-M) は第352便h の otherSrc と同じ・(E-潮) は第352便u の rateOf と同じ(″/年 → rad/s)
  const e = earthDrag(T1, GEO, cache), o = H.otherSrc(T1, GEO, 'Earth'), t = sunTide(T1, GEO), r352u = U.rateOf(T1, GEO, 'Venus', 'sun', 'Tg', 'nat');
  const eSame = e.infS === nrm(o.inf.S) && e.meanM === nrm(o.mean.M), tSame = Math.abs(t.rate * ASYR / r352u.mag - 1) < 1e-12;
  // 変異: トルクの符号を逆にすると x₀ ≈ 0 は不安定の点になり、1/4 周期で 0 を横切らない(中心が π に移る)
  const fl = pendStep({ x0: 0.05, nu0: 0, OmP: eg.OmP, Sd, periods: 1, mut: 'flip' }), mFlip = fl.crossT === null || Math.abs(fl.crossT / quarter - 1) > 0.1;
  const rej = [() => uOf(T1, GEO, 'uX'), () => residualOf(T1, GEO, { axis: 'ecl', magId: 'uV' }), () => lockPhase(0), () => zAvg(T1, GEO, { n: 3 }), () => egRow(T1, GEO, 0), () => pendStep({ x0: 0, nu0: 0, OmP: 0, Sd: 1 })]
    .map((fn) => { try { fn(); return false; } catch (er) { return er instanceof RangeError; } });
  return { L: Lv, uV, phiL: rL.phiDeg, resL: rL.resOverBg, resEq: rE.resOverBg, vsH, closedVsDirect, r098: r098.resOverBg, shift: Lp.shiftDeg, zero: L0.shiftDeg, Pres: Lp.Pres, dP: Lp.dP,
    zConv, wrapErr, zAbs: z.abs, zMean: z.meanInvD3, zPeak: z.peak, smCross: sm.crossT, quarter, smBound: sm.bound, capAgree, eSame, tSame, mFlip, rejects: rej };
}
const p5 = (x, w) => Number(Number(x).toPrecision(5)) === Number(Number(w).toPrecision(5));
export function pureGates(S) {
  const A = DECL.anchor;
  return {
    anchorL: S.L.every((x, i) => Math.abs(x - A.L[i]) < 5e-7),
    anchorUV: Number(S.uV.toPrecision(6)) === A.uV && S.vsH < 1e-12,
    anchorRes: Number(S.phiL.toFixed(4)) === A.phiLDeg && p5(S.resL, A.resL) && Number(S.resEq.toFixed(3)) === A.resEq,
    closedRes: S.closedVsDirect < 1e-9 && Math.abs(S.r098 - 1) < 1e-9,
    lonShift: Number(S.shift.toFixed(3)) === A.lonShift && Math.abs(S.zero) < 1e-9 && Number(S.Pres.toFixed(3)) === A.pRes && Number(S.dP.toFixed(3)) === A.dP,
    zAvg: S.zConv < 1e-6 && S.wrapErr < 1e-6 && S.zAbs > 0 && S.zAbs <= S.zMean && S.zMean <= S.zPeak,
    pendulum: S.smBound && Number.isInteger(S.smCross) && Math.abs(S.smCross / S.quarter - 1) < 0.01 && S.capAgree,
    callsSame: S.eSame && S.tSame,
    mutant: S.mFlip,
    rejects: S.rejects.length === 6 && S.rejects.every(Boolean),
  };
}
