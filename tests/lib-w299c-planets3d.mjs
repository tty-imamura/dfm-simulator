// 第299便c(原仮定者の裁定(第89報)②「太陽系の各惑星の geoPN=3 版を、それぞれ三次元で用意する」・統括の検証項目 R171)——
// **惑星の geoPN=3 三次元の本(太陽+惑星の二体)の初期状態と宣言の生成器**(純関数 —— html の HP を受け取って既存の本から質量・半径・自転を読む。
// エンジンは走らせない。器 tests/exp-w299c-planets3d.mjs と QA preset.planets3d299 が同じ関数で宣言を作り、内蔵の本と照合する)。
//
// ■ 何を持つか
//   ・軌道要素の種 ELEMENTS(JPL SSD「Approximate Positions of the Planets」Table 1 —— E. M. Standish の近似要素・1800〜2050 年・
//     J2000 の平均黄道と分点・T=0 の行の a・e・I・L・ϖ・Ω)。**近似要素であって精密な接触状態ではない**(暦表の状態ベクトルではない)。
//   ・自転軸の極 POLES(IAU WGCCRE 2009 報告 —— Archinal et al. 2011, Celest. Mech. Dyn. Astr. 109, 101 の Table 1・2 の J2000 の α0・δ0〔T=0〕と
//     自転角 W の率の符号)。ICRF の赤道座標の極を J2000 の黄道座標(傾斜角 ε0 = 84381.406″ —— IAU 2006)へ回して、
//     spinAxis の傾き tiltDeg(+z = 黄道の北から)と方位 azimuthDeg(+x = 春分点から)にする。**軸は一定の近似**(極の歳差・章動は入れない)。
//   ・恒星周期の観測値 PERIODS(内惑星は内蔵の観測の正本 OBS_COMPARE_ROWS の行・外惑星は NASA NSSDC Planetary Fact Sheet の値 ——
//     本便のコンテナはネットワークに出られず原表を取得できなかった。値は公表値の転記で、原表との照合は次の見直し)。
//   ・要素 → 状態ベクトル(Kepler 方程式・回転 Rz(Ω)Rx(I)Rz(ω)・μ = G(M☉+m))と重心系(全運動量 0・重心 0)への置き直し。
//   ・本の宣言(physics・bodies・timeRef・camera)の生成 `planetDecl3`(既存の geoPN=1 の本 ☄️🌇🥔🟠💍💠🌊 の太陽・惑星の m・radius・spin を
//     本の単位 1 = 10⁸ m / 10⁴ s / 10²⁷ kg へ換算)。
//
// ■ 言わないこと
//   ・「現実を再現した」「43″ を再現した」「gain は普遍定数」。初期状態は近似要素の種で、惑星どうしの摂動(多体)は入っていない(二体)。
import * as W302A from './lib-w302a-wbg.mjs';   // 第302便a: gain ⇔ W_bg の読み書き(器の側)
export const LIB_VERSION = 'w299c-planets3d-lib-1';
export const SCALE_EXP = Object.freeze({ L: 8, T: 4, M: 27 });   // 内惑星: 1 単位 = 10⁸ m / 10⁴ s / 10²⁷ kg(☄️・🟫 と同じ指数系)
// 外惑星: 1 単位 = 10⁹ m / 10⁵ s / 10²⁸ kg(座標の値域 ±5000 単位に海王星の遠日点 4.54×10¹² m を収める —— G=6.674・c₀=29979.2458 は同じ数)
export const SCALE_EXP_OUTER = Object.freeze({ L: 9, T: 5, M: 28 });
export const AU_M = 1.495978707e11;                               // IAU 2012 決議 B2 の天文単位(m)
export const DAY_S = 86400;
export const OBLIQUITY_ARCSEC = 84381.406;                        // J2000 の黄道傾斜角 ε0(IAU 2006 —— Capitaine et al. 2003)
export const ELEM_SOURCE = 'JPL SSD「Approximate Positions of the Planets」Table 1(E. M. Standish・1800〜2050 年の近似要素・J2000 の平均黄道と分点)の T=0 の行';
export const POLE_SOURCE = 'IAU WGCCRE 2009 報告(Archinal et al. 2011, Celest. Mech. Dyn. Astr. 109, 101)Table 1・2 の J2000 の極 α0・δ0(T=0)と自転角 W の率の符号';
export const NETWORK_NOTE = '本便のコンテナはネットワークに出られず(JPL SSD・NASA NSSDC への接続が拒否された)原表を取得できなかった —— 値は公表値の転記で、原表との照合は次の見直し';
/** 太陽(☄️ mercuryReal の bodies[0] を写す —— 単位は同じ)。極は IAU WGCCRE の太陽の行。 */
export const SUN = Object.freeze({ src: 'mercuryReal', index: 0, pole: Object.freeze({ ra: 286.13, dec: 63.87, wSign: 1 }) });
/**
 * 惑星の表(並びは太陽からの順 —— 地球は 🌦️ earthMoonSunInertial3d を地球の geoPN=3 三次元版として数える〔太陽–地球の二体は作らない〕)。
 * el: a[au]・e・I[°]・L[°]・varpi[°](近日点経度 ϖ)・Om[°](昇交点経度 Ω)。pole: α0・δ0[°](J2000・T=0)・wSign(W の率の符号 —— 負は IAU の北極に対し逆行)。
 * src: 質量・半径・自転を読む既存の geoPN=1 の本と粒子の番号。period: 恒星周期の観測値 [日] と出典。
 */
export const PLANETS = Object.freeze([
  Object.freeze({ key: 'mercury', id: 'mercurySunInertial3d', emoji: '🌡️', family: 'mercury', ja: '水星', en: 'Mercury', src: 'mercuryReal', index: 1,
    el: Object.freeze({ a: 0.38709927, e: 0.20563593, I: 7.00497902, L: 252.25032350, varpi: 77.45779628, Om: 48.33076593 }),
    pole: Object.freeze({ ra: 281.0097, dec: 61.4143, wSign: 1 }),
    period: Object.freeze({ s: 7600521.6, source: '観測の正本 OBS_COMPARE_ROWS(mercuryReal の 水星 の公転周期 7600521.6 s —— NASA NSSDC Mercury Fact Sheet の 87.969 日)', builtIn: true }) }),
  Object.freeze({ key: 'venus', id: 'venusSunInertial3d', emoji: '🌋', family: 'venusReal', ja: '金星', en: 'Venus', src: 'venusReal', index: 1,
    el: Object.freeze({ a: 0.72333566, e: 0.00677672, I: 3.39467605, L: 181.97909950, varpi: 131.60246718, Om: 76.67984255 }),
    pole: Object.freeze({ ra: 272.76, dec: 67.16, wSign: -1 }),
    period: Object.freeze({ s: 19414166.4, source: '観測の正本 OBS_COMPARE_ROWS(venusReal の 金星 の公転周期 19414166.4 s = 224.701 日)', builtIn: true }) }),
  Object.freeze({ key: 'mars', id: 'marsSunInertial3d', emoji: '🔴', family: 'mars', ja: '火星', en: 'Mars', src: 'marsMoonsReal', index: 0,
    el: Object.freeze({ a: 1.52371034, e: 0.09339410, I: 1.84969142, L: -4.55343205, varpi: -23.94362959, Om: 49.55953891 }),
    pole: Object.freeze({ ra: 317.68143, dec: 52.88650, wSign: 1 }),
    period: Object.freeze({ s: 59355072, source: '内蔵の宣言値 59355072 s(NASA NSSDC Mars Fact Sheet の 686.980 日 —— 第131便に内蔵へ転記した観測値)', builtIn: true }) }),
  Object.freeze({ key: 'jupiter', id: 'jupiterSunInertial3d', emoji: '🏀', family: 'jupiter', ja: '木星', en: 'Jupiter', src: 'jupiterGalilean', index: 0,
    el: Object.freeze({ a: 5.20288700, e: 0.04838624, I: 1.30439695, L: 34.39644051, varpi: 14.72847983, Om: 100.47390909 }),
    pole: Object.freeze({ ra: 268.056595, dec: 64.495303, wSign: 1 }),
    period: Object.freeze({ s: 4332.589 * 86400, source: 'NASA NSSDC Planetary Fact Sheet の恒星周期 4332.589 日(ネットワーク不通で原表は未取得 —— 公表値の転記)', builtIn: false }) }),
  Object.freeze({ key: 'saturn', id: 'saturnSunInertial3d', emoji: '🟡', family: 'saturn', ja: '土星', en: 'Saturn', src: 'saturnRingReal', index: 0,
    el: Object.freeze({ a: 9.53667594, e: 0.05386179, I: 2.48599187, L: 49.95424423, varpi: 92.59887831, Om: 113.66242448 }),
    pole: Object.freeze({ ra: 40.589, dec: 83.537, wSign: 1 }),
    period: Object.freeze({ s: 10759.22 * 86400, source: 'NASA NSSDC Planetary Fact Sheet の恒星周期 10759.22 日(ネットワーク不通で原表は未取得 —— 公表値の転記)', builtIn: false }) }),
  Object.freeze({ key: 'uranus', id: 'uranusSunInertial3d', emoji: '🔷', family: 'uranus', ja: '天王星', en: 'Uranus', src: 'uranusReal', index: 0,
    el: Object.freeze({ a: 19.18916464, e: 0.04725744, I: 0.77263783, L: 313.23810451, varpi: 170.95427630, Om: 74.01692503 }),
    pole: Object.freeze({ ra: 257.311, dec: -15.175, wSign: -1 }),
    period: Object.freeze({ s: 30685.4 * 86400, source: 'NASA NSSDC Planetary Fact Sheet の恒星周期 30685.4 日(ネットワーク不通で原表は未取得 —— 公表値の転記)', builtIn: false }) }),
  Object.freeze({ key: 'neptune', id: 'neptuneSunInertial3d', emoji: '💙', family: 'neptune', ja: '海王星', en: 'Neptune', src: 'neptuneReal', index: 0,
    el: Object.freeze({ a: 30.06992276, e: 0.00859048, I: 1.77004347, L: -55.12002969, varpi: 44.96476227, Om: 131.78422574 }),
    // 海王星の極は N = 357.85° + 52.316°T の周期項を持つ(α0 = 299.36 + 0.70 sin N・δ0 = 43.46 − 0.51 cos N)—— T=0 の値を固定した
    pole: Object.freeze({ ra: 299.36 + 0.70 * Math.sin(357.85 * Math.PI / 180), dec: 43.46 - 0.51 * Math.cos(357.85 * Math.PI / 180), wSign: 1 }),
    period: Object.freeze({ s: 60189 * 86400, source: 'NASA NSSDC Planetary Fact Sheet の恒星周期 60189 日(ネットワーク不通で原表は未取得 —— 公表値の転記)', builtIn: false }) }),
]);
export const planetOf = (k) => PLANETS.find((p) => p.key === k || p.id === k) || null;
const D2R = Math.PI / 180;
const r12 = (x) => Number(x.toPrecision(12));
/** 惑星の本の指数系(水星・金星・火星は SCALE_EXP・木星〜海王星は SCALE_EXP_OUTER)。 */
export const expOf = (pl) => (['jupiter', 'saturn', 'uranus', 'neptune'].includes(pl.key) ? SCALE_EXP_OUTER : SCALE_EXP);
/** 本の単位への換算(既存の本の scaleExp → 指数系 to)。 */
export function convUnits(fromExp, to = SCALE_EXP) {
  const dL = fromExp.L - to.L, dT = fromExp.T - to.T, dM = fromExp.M - to.M;
  return { m: Math.pow(10, dM), len: Math.pow(10, dL), spin: Math.pow(10, -dT) };
}
/** ICRF の赤道座標の極 (α0, δ0) → J2000 の黄道座標の単位ベクトルと spinAxis の傾き・方位(度)。 */
export function poleEcliptic(ra, dec) {
  const e = OBLIQUITY_ARCSEC / 3600 * D2R, a = ra * D2R, d = dec * D2R;
  const x = Math.cos(d) * Math.cos(a), y = Math.cos(d) * Math.sin(a), z = Math.sin(d);
  const ye = Math.cos(e) * y + Math.sin(e) * z, ze = -Math.sin(e) * y + Math.cos(e) * z;
  let az = Math.atan2(ye, x) / D2R; if (az < 0) az += 360;
  return { u: [x, ye, ze], tiltDeg: Math.acos(Math.max(-1, Math.min(1, ze))) / D2R, azimuthDeg: az };
}
/** Kepler 方程式 E − e sin E = M(Newton —— 機械精度まで)。 */
export function keplerE(M, e) {
  let E = e < 0.8 ? M : Math.PI;
  for (let k = 0; k < 50; k++) { const d = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E)); E -= d; if (Math.abs(d) < 1e-15) break; }
  return E;
}
/** 回転 Rz(Ω)Rx(I)Rz(ω) を軌道面の (x′, y′, 0) にかける。 */
export function rotPQ(Om, I, w, xp, yp) {
  const cO = Math.cos(Om), sO = Math.sin(Om), cI = Math.cos(I), sI = Math.sin(I), cw = Math.cos(w), sw = Math.sin(w);
  const x1 = cw * xp - sw * yp, y1 = sw * xp + cw * yp;   // Rz(ω)
  const y2 = cI * y1, z2 = sI * y1;                        // Rx(I)
  return [cO * x1 - sO * y2, sO * x1 + cO * y2, z2];       // Rz(Ω)
}
/** 要素 → 太陽に対する惑星の相対の位置・速度(本の単位)。a は単位長・μ = G(M☉+m)。 */
export function elementsToState(el, mu, aLen) {
  const e = el.e, I = el.I * D2R, Om = el.Om * D2R, w = (el.varpi - el.Om) * D2R;
  let M = (el.L - el.varpi) * D2R; M = Math.atan2(Math.sin(M), Math.cos(M));
  const E = keplerE(M, e), cE = Math.cos(E), sE = Math.sin(E), sq = Math.sqrt(1 - e * e), n = Math.sqrt(mu / (aLen * aLen * aLen)), den = 1 - e * cE;
  const r = rotPQ(Om, I, w, aLen * (cE - e), aLen * sq * sE);
  const v = rotPQ(Om, I, w, -aLen * n * sE / den, aLen * n * sq * cE / den);
  return { r, v, E, M, n, P: 2 * Math.PI / n };
}
/** 軌道面の法線(単位 —— 公転の向き)と近日点の方向(単位)。 */
export function orbitFrame(el) {
  const I = el.I * D2R, Om = el.Om * D2R, w = (el.varpi - el.Om) * D2R;
  return { P: rotPQ(Om, I, w, 1, 0), Q: rotPQ(Om, I, w, 0, 1), W: [Math.sin(Om) * Math.sin(I), -Math.cos(Om) * Math.sin(I), Math.cos(I)] };
}
/** 既存の本(HP.allPresets)から太陽と惑星の m・radius・spin を本の単位で読む。 */
export function sourceBodies(HP, pl) {
  // 第319便c(原仮定者の指示(第121報)・AN454・統括の検証項目 R260): 名指しの 2 本だけを `.find` で直に引く(変数に受けると領域の下限が「内蔵の全本」になる —— 値は同じ)
  const sp = HP.allPresets().find((q) => q.id === SUN.src), pp = HP.allPresets().find((q) => q.id === pl.src);
  if (!sp || !pp) throw new Error('元の本が無い ' + SUN.src + '/' + pl.src);
  const X = expOf(pl), cs = convUnits(sp.scaleExp, X), cp = convUnits(pp.scaleExp, X), sb = sp.bodies[SUN.index], pb = pp.bodies[pl.index];
  const sun = { m: r12(sb.m * cs.m), radius: r12(sb.radius * cs.len), spin: r12(Math.abs(sb.spin) * cs.spin) * SUN.pole.wSign };
  const pla = { m: r12(pb.m * cp.m), radius: r12(pb.radius * cp.len), spin: r12(Math.abs(pb.spin) * cp.spin) * pl.pole.wSign };
  return { sun, pla, from: { sun: SUN.src + '.bodies[' + SUN.index + ']', planet: pl.src + '.bodies[' + pl.index + ']', sunExp: sp.scaleExp, planetExp: pp.scaleExp,
    planetSpin2d: pb.spin } };
}
/** 1PN の近日点前進の式の値(参考 —— 観測ではない): Δϖ = 6πGM/(c²a(1−e²)) / 公転 → ″/世紀(ユリウス世紀)。 */
export function pn1RateArcsecPerCentury(G, M, c, aLen, e, Punits, X = SCALE_EXP) {
  const dPerOrbit = 6 * Math.PI * G * M / (c * c * aLen * (1 - e * e));
  const T = Math.pow(10, X.T), cent = 36525 * DAY_S / T;
  return dPerOrbit * (cent / Punits) * 180 / Math.PI * 3600;
}
/** 画面の刻み(1 公転 360 步)と器の刻み h(水星の 0.016 と同じ步数/公転 —— 4 桁に丸めた P/47503.26)。 */
export function stepsOf(pRef) {
  return { stepDt: pRef / 360, h: Number((0.016 * pRef / (7600521.6 / 1e4)).toPrecision(4)) };
}
/**
 * 本の宣言の生成(physics・bodies・timeRef・camera)。gain は器が決めた値(標的の無い本は 0)。
 * 太陽も free(pinned なし)—— 重心 0・全運動量 0。太陽と惑星の自転軸は明示して有効化(極の J2000 値 —— 軸は一定の近似)。
 */
export function planetDecl3(HP, key, o = {}) {
  const pl = planetOf(key);
  if (!pl) throw new Error('惑星が無い ' + key);
  const X = expOf(pl), G = 6.674, c0 = 29979.2458, L = Math.pow(10, X.L), T = Math.pow(10, X.T);
  const { sun, pla } = sourceBodies(HP, pl);
  const Mt = sun.m + pla.m, mu = G * Mt, aLen = pl.el.a * AU_M / L;
  const st = elementsToState(pl.el, mu, aLen);
  const fS = pla.m / Mt, fP = sun.m / Mt;
  const sp = poleEcliptic(SUN.pole.ra, SUN.pole.dec), pp = poleEcliptic(pl.pole.ra, pl.pole.dec);
  const ax = (q, src) => ({ enable: true, tiltDeg: r12(q.tiltDeg), azimuthDeg: r12(q.azimuthDeg), source: src });
  const pRef = r12(pl.period.s / T), { stepDt } = stepsOf(pRef);
  const gain = (typeof o.gain === 'number') ? o.gain : 0;
  const physics = { coord: '3d', G, D0: 0.1, kFrame: 0, q: 3, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, kappaT: 7.425826474101849e-9,
    cLight: c0, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0, massFloor: 1e-6,
    geoPN: 3, lambdaPN: 0, pnAlpha: 1.5, radiusScale: 1, softening: 0.05, timeScale: 1, stepDt, dispMag: 10, stateCarry: 'double', frameWeight: 'share',
    relativeDrag: Object.assign({ law: 'inertial' }, W302A.wbgDeclOf(gain), { eps: 0.05, history: 'positions', pairs: 'all' }) };   // 第302便a: 強さは Wbg(gain は廃止)
  const sunAx = 'IAU WGCCRE 2009(Archinal et al. 2011)の太陽の極 α0 286.13°・δ0 63.87° を J2000 の黄道へ(軸は一定の近似)';
  const plAx = 'IAU WGCCRE 2009(Archinal et al. 2011)の' + pl.ja + 'の極 α0 ' + r12(pl.pole.ra) + '°・δ0 ' + r12(pl.pole.dec) + '° を J2000 の黄道へ(軸は一定の近似' + (pl.pole.wSign < 0 ? '・自転は IAU の北極に対し逆行 —— spin は負' : '') + ')';
  const bodies = [
    { type: 'single', m: sun.m, radius: sun.radius, x: -fS * st.r[0], y: -fS * st.r[1], z: -fS * st.r[2], vx: -fS * st.v[0], vy: -fS * st.v[1], vz: -fS * st.v[2],
      spin: sun.spin, pinned: false, pnSource: true, spinAxis: ax(sp, sunAx) },
    { type: 'single', m: pla.m, radius: pla.radius, x: fP * st.r[0], y: fP * st.r[1], z: fP * st.r[2], vx: fP * st.v[0], vy: fP * st.v[1], vz: fP * st.v[2],
      spin: pla.spin, pinned: false, spinAxis: ax(pp, plAx) }];
  const timeRef = { basis: 'orbit', pRef, pair: [0, 1], def: 'revolution', source: pl.period.builtIn ? pl.period.source : ('NASA NSSDC Planetary Fact Sheet の' + pl.ja + 'の恒星周期 ' + r12(pl.period.s / DAY_S) + ' 日 × 86400 s ÷ 10^' + X.T + ' s(原表は未取得 —— 公表値の転記)'), stepsPerOrbit: 360 };
  const camera = { scale: Number((1.8 * aLen * (1 + pl.el.e)).toPrecision(2)) };
  return { pl, scaleExp: { L: X.L, T: X.T, M: X.M }, physics, bodies, timeRef, camera, kepler: { aLen, mu, P: st.P, M0deg: st.M / D2R, E0: st.E }, poles: { sun: sp, planet: pp } };
}
