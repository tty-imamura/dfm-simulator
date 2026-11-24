// 第352便y(原仮定者の整理(2026-11-24 —— 第148報)・統括の検証項目 R462):
//   **背景軸引きずりの大きさの窓 —— 太陽系の側から置ける上限と下限の条件を、1 件ずつ「何を・どの枝の口で・上限か下限か・前提」つきで持ち、
//   同じ単位(銀河の公転の角速度 ω_G の倍 u・″/年・一周の年数)に直して重ねる純関数。重力の側の列(比べる列)の入力の感度・離心率のある軌道での (M) の歪みの平均 —— 診断だけ**
//   (器 tests/exp-w352y-bgwindow.mjs と QA behavior.bgwindow352y・docs.bgwindow352y が読む —— html を読まない・ファイルを読まない・状態を持たない。後のラウンドの枝もこの口を import してよい)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない。
//   既存の lib は呼ぶだけ(本文は変えない): 第352便e(invertBg・bgPeriod)・第352便w(fRingMin・fKeep・stateW・uOf・keplerE)・第352便p(fOfK1)・第352便l(dphiFor)・
//   第352便c(refAxes)・第352便d(bgDir・bgVec・poleRates)・第352便u(shapeOf・axesOf・gravSrcs・tG・tA・tB・rateOf・strainOf・pairSpec・extraWOf・symOf・axialOf・fro)・
//   第352便q(refRate)・第352便o(uVenusO)・第352便b(prov・provValue —— 仮の値)・第351便d(r3Coeffs)・第348便h(makeField3)・第347便e(t1Table・geometry)。
//
// ■ 語: u = 背景の大きさ ÷ ω_G(ω_G = 銀河の公転の角速度 9.09e-16 rad/s)。比率 f は第351便d の (N1)(k₁ = 縮める経路 ① の係数・k₂ = 歳差の経路 ② の係数)。
//   条件は「下限」(背景がこれより小さいと、その読みの事柄が太陽系の年齢 4.5e9 年の内に起きない)と「上限」(背景がこれより大きいと、その読みの事柄が保てない・残りの率を越える)と「固定の点」。
// ■ 条件(どれも読み —— 決めない):
//   (i) 太陽の自転軸が年齢の内に 1 周以上歳差する: u ≥ 2π ÷ (k₂ ω_G t)(第352便e の invertBg —— 周期 = 年齢)。
//   (ii) 公転面の散らばり 30° → 7° が年齢の内に寄る: u ≥ ln(tan 15° ÷ tan 3.5°) ÷ (k₁(f_輪) ω_G t)(第352便w の fRingMin の uMin ÷ k₁)。
//   (iii) 公転面と自転軸の係数の差 Δc で太陽の傾きを年齢の内に作る(経路 ② だけ・f 0): u ≥ Δφ ÷ (Δc ω_G t)・Δφ = 第352便l の dphiFor(背景と基準軸の角 θ・傾き γ)—— θ < γ/2 なら作れない。
//   (iv) 地球のいまの傾き(合成との角)を年齢の間 10% 以内に保つ: k₁(f) W(u) t ≤ x(θ(u))(第352便w の fKeep)を満たす u の上限(状態は第352便w の stateW —— 源の半径の列つき)。
//   (v) 歳差の率の残り(仮の値 − 重力の側の列)の大きさを、一様な背景 × 単位の応答 c の率の上限と読む: u ≤ abs(残り) ÷ (c k₂ ω_G)(第352便w の uOf('uP'))。
//   (vi) 金星の条件(大きさが同じ): u = k × u_V(源の半径の列)(第352便o の uVenusO)—— この条件が決めるのは u ÷ k。
//   固定の点: u = 1(銀河の公転の角速度そのもの)・上下の運動の揺れの周期 P と共鳴する u = 2π ÷ (P ω_G)(仮の値 —— 印つき)。
// ■ T4(重力の側の列の入力の感度): 第352便u の (T-g) = −(3/2)(G M ÷ a³)(H ÷ ω)(n̂·ŝ)(n̂ × ŝ) を、J2・慣性モーメントの係数(最後の桁 ± 1)・傾き・月の道の傾き(± 宣言の角)を振って数え直す。
// ■ T5(離心率のある軌道の (M) の歪みの平均): 第352便u の位相ごとの場と同じ置き方(受け手は原点・源は −r r̂)で、距離 r = a(1 − e cos E)・真近点離角 ν・
//   相対の速度 = v_c (e sin ν r̂ + (1 + e cos ν) n̂ × r̂) ÷ √(1 − e²)(v_c = 組の円の速さ —— e 0 で第352便u と同じ)。位相は平均近点離角の等しい刻み(等しい時間)。近点の向きは宣言(x̂ = 源の自転軸 × n̂ から ϖ)。
// ■ 言わないこと: 背景の大きさが決まったとは書かない(条件の一覧と窓)。重力の側の列を DFM の結果と書かない。仮の値を使う行は「仮・未照合」の印つきで合否にしない。
import * as SR from './lib-w352e-sunrecv.mjs';
import * as W from './lib-w352w-keepcone.mjs';
import * as P from './lib-w352p-coprec.mjs';
import * as LS from './lib-w352l-suntilt.mjs';
import * as RC from './lib-w352c-refaxis.mjs';
import * as D from './lib-w352d-precsense.mjs';
import * as U from './lib-w352u-tidaldrag.mjs';
import * as Q from './lib-w352q-response.mjs';
import * as O from './lib-w352o-obsradius.mjs';
import * as B from './lib-w352b-provisional.mjs';
import * as R3 from './lib-w351d-r3step.mjs';
import * as G3 from './lib-w348h-axisgeo3.mjs';
import * as E from './lib-w347e-spintorque.mjs';

export const LIB_VERSION = 'w352y-bgwindow-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const D2R = Math.PI / 180;
const { dot, crs, nrm, scl, add, sub, unit } = U.vec;
const isVec = (a) => Array.isArray(a) && a.length === 3 && a.every(fin);
export const ASYR = D.ASYR;
export const YR = W.YR;
export const vec = U.vec;

/* ───────── 宣言(走らせたノブの格子と判定の物差しの記録 —— 式の形の宣言ではない)───────── */
export const DECL = Object.freeze({
  omegaG: W.DECL.omegaG, ageYr: W.DECL.ageYr,
  dirs: Object.freeze(['Np', 'Gm']), axes: Object.freeze(['L', 'eq']), tSrcs: Object.freeze([0, 1]),
  /** 比率 f(自転軸)・係数の差 Δc・換算の係数 k の格子 */
  fs: Object.freeze([1, 0.1, 1e-3]), dcs: Object.freeze([1, 0.1, 1e-3]), ks: Object.freeze([1, 5.31e2, 8.38e11]),
  /** 公転面の散らばり(第352便p・w と同じ)・太陽の傾き(基準軸ごと —— 第352便c) */
  spread: Object.freeze([30, 7]), tiltDeg: Object.freeze({ L: 5.968, eq: 5.23 }),
  /** (iv) の受け手と物差し(割合 10% —— 第352便w の q10) */
  keepKey: 'Earth|Sun', keepCrit: Object.freeze({ id: 'q10', kind: 'frac', X: 0.1 }),
  /** (v) の受け手・源の組・極(第352便u の比べる列の約束)・単位の応答の係数 */
  resBodies: Object.freeze(['Earth', 'Mars', 'Venus']), resSet: Object.freeze({ Earth: 'sunMoon', Mars: 'sun', Venus: 'sun' }), resPole: Object.freeze({ Earth: 'ecl', Mars: 'orb', Venus: 'orb' }), cResp: 1,
  /** 仮の値の鍵(第352便b の器 —— 表に入れる数はこれだけ) */
  provKeys: Object.freeze(['earth.psiA.rate', 'gal.vertical.period', 'mars.prec.rate', 'venus.prec.rate']),
  /** T4: 振る幅(J2・慣性モーメントの係数はリポジトリの数の最後の桁 ± 1・角は宣言の幅) */
  pertDeg: 0.01,
  /** T5: 離心率の格子・位相の数・近点の向き */
  eGrid: Object.freeze([0, 0.0068, 0.0167, 0.093, 0.206]), nPhase: 72, periDeg: Object.freeze([0, 90]),
  eOwn: Object.freeze({ Venus: 0.0068, Earth: 0.0167, Mars: 0.093, Mercury: 0.206 }),
  floor: 1e-12, judge: '丸めの桁の床: 打ち消しで 0 になる量は尺度の 1e-12 倍以下を 0 と書く',
});
const T_S = () => DECL.ageYr * YR;

/** (N1) の係数 k₁・k₂(第351便d の r3Coeffs) */
export function kOf(f) { const c = R3.r3Coeffs(f, 'N1'); return { k1: c.kTilt, k2: c.kPrec }; }

/* ───────── 条件(ω_G の倍 u)───────── */
/** (i) 太陽の自転軸が年齢の内に 1 周以上: 下限(k₂ 0 なら満たせない —— null) */
export function condSunTurn({ f = 0 } = {}) {
  const { k2 } = kOf(f);
  if (!(k2 > 0)) return { kind: 'lower', u: null, why: 'k₂ = 0(f 1)では歳差しない' };
  return { kind: 'lower', u: SR.invertBg({ periodYr: DECL.ageYr, ratio: 1, kPrec: k2 }).mult, k2 };
}
/** (ii) 公転面の散らばり θ₀ → θ₁ が年齢の内に寄る: 下限(k₁(f_輪) 0 なら満たせない) */
export function condRing({ fRing = 1, th0Deg = DECL.spread[0], th1Deg = DECL.spread[1] } = {}) {
  const { k1 } = kOf(fRing), r = W.fRingMin({ th0Deg, th1Deg, Wb: DECL.omegaG });
  if (!(k1 > 0)) return { kind: 'lower', u: null, why: 'k₁ = 0(f_輪 0)では寄らない' };
  return { kind: 'lower', u: r.uMin / k1, k1, x: r.x };
}
/** 背景の向きと基準軸 */
export function axesOf(T1 = E.t1Table(), GEO = E.geometry(), cache = null) {
  const A = (cache && cache.__ax) || RC.refAxes(T1, GEO); if (cache) cache.__ax = A;
  return A;
}
/** (iii) 係数の差 Δc で太陽の傾き γ を年齢の内に作る(経路 ② だけ・f 0): 下限(θ < γ/2 なら作れない —— null) */
export function condSunTilt(T1, GEO, { dir, axis, dc }, cache = null) {
  if (!(fin(dc) && dc > 0)) throw new RangeError('condSunTilt: Δc > 0');
  const ax = axesOf(T1, GEO, cache)[axis];
  if (!ax || !DECL.axes.includes(axis)) throw new RangeError('condSunTilt: 基準軸は L・eq');
  const thDeg = W.angDeg(D.bgDir(dir, { axis: ax }), ax), gammaDeg = DECL.tiltDeg[axis], dphi = thDeg > 1e-9 ? LS.dphiFor({ thDeg, gammaDeg }) : null;
  if (dphi === null) return { kind: 'lower', u: null, thDeg, why: '背景と基準軸がそろう —— 2 つの軸は開かない' };
  return { kind: 'lower', u: dphi / (dc * DECL.omegaG * T_S()), thDeg, dphi };
}
/** (iv) 地球のいまの傾き(合成との角)を年齢の間保つ: 上限(f 0 なら上限なし —— Infinity) */
export function condKeep(T1, GEO, { dir, axis, tSrc = 0, f, key = DECL.keepKey, crit = DECL.keepCrit }, cache = null) {
  const { k1 } = kOf(f);
  if (!(k1 > 0)) return { kind: 'upper', u: Infinity, why: 'k₁ = 0(f 0)では縮まない' };
  const k1At = (u) => W.fKeep({ thDeg: W.stateW(T1, GEO, key, { dir, axis, u, tSrc }, cache).thDeg, W: W.stateW(T1, GEO, key, { dir, axis, u, tSrc }, cache).W, crit }).k1Max;
  let lo = -16, hi = 12;   // log10 u
  if (!(k1At(10 ** lo) > k1)) return { kind: 'upper', u: 10 ** lo, why: '格子の下端で既に越える' };
  if (k1At(10 ** hi) > k1) return { kind: 'upper', u: Infinity, why: '格子の上端でも越えない' };
  for (let i = 0; i < 90; i++) { const m = 0.5 * (lo + hi); if (k1At(10 ** m) > k1) lo = m; else hi = m; }
  const u = 10 ** (0.5 * (lo + hi)), st = W.stateW(T1, GEO, key, { dir, axis, u, tSrc }, cache);
  return { kind: 'upper', u, k1, thDeg: st.thDeg, locOverBg: st.locOverBg };
}
/** 歳差の率の残り(仮の値 − 重力の側の列 —— 第352便u の (T-g)・比べる列)。ref は第352便q の refRate(大きさ) */
export function residualOf(T1, GEO, id, cache = null) {
  const R = Q.refRate(id), set = DECL.resSet[id], pole = DECL.resPole[id], g = U.rateOf(T1, GEO, id, set, 'Tg', 'nat', {}, cache), grav = Math.abs(g.az[pole]);
  return B.tagProv({ id, set, pole, ref: R.rate, grav, res: R.rate - grav, overRef: grav / R.rate }, [R.provKey]);
}
/** (v) 残りの大きさ abs ÷ (c k₂ ω_G): 上限(k₂ 0 なら上限なし) */
export function condResid({ resAs, f = 0, c = DECL.cResp }) {
  const { k2 } = kOf(f);
  if (!(fin(resAs) && resAs > 0)) throw new RangeError('condResid: 残りの大きさ > 0');
  if (!(k2 > 0)) return { kind: 'upper', u: Infinity, why: 'k₂ = 0(f 1)では歳差の率に出ない' };
  return { kind: 'upper', u: W.uOf('uP', null, null, {}, null, resAs) / (c * k2), k2 };
}
/** (vi) 金星の条件: u = k × u_V(源の半径 tSrc) */
export function condVenus(T1, GEO, { tSrc = 0, k = 1 }, cache = null) {
  return { kind: 'point', u: k * O.uVenusO(T1, GEO, { tSrc }, cache), uV: O.uVenusO(T1, GEO, { tSrc }, cache), k };
}
/** 固定の点: 上下の運動の揺れの周期(仮の値)と共鳴する u の帯 */
export function resonanceBand() {
  const lo = B.provValue('gal.vertical.period', 'lo'), hi = B.provValue('gal.vertical.period', 'hi');
  const uOfP = (Pyr) => 2 * Math.PI / (Pyr * YR * DECL.omegaG);
  return B.tagProv({ kind: 'point', uLo: uOfP(hi), uHi: uOfP(lo), Plo: lo, Phi: hi }, ['gal.vertical.period']);
}
/** 単位の換算: u → ″/年・一周の年数 */
export function unitsOf(u) {
  if (!fin(u) || u <= 0) return { u, asYr: fin(u) ? u * DECL.omegaG * ASYR : null, periodYr: null };
  return { u, asYr: u * DECL.omegaG * ASYR, periodYr: 2 * Math.PI / (u * DECL.omegaG * YR) };
}

/* ───────── 窓 ───────── */
/**
 * 条件の列 conds([{ id, kind: 'lower'|'upper', u }])を重ねる。u null の下限は「満たせない」(窓は空)。
 * 返す { lo, loBy, hi, hiBy, open, blocked(満たせない条件の id), conflicts(lo > hi のときの [下限の id, 上限の id] の組) }
 */
export function windowOf(conds) {
  if (!Array.isArray(conds)) throw new RangeError('windowOf: 条件の列');
  let lo = 0, loBy = null, hi = Infinity, hiBy = null; const blocked = [];
  for (const c of conds) {
    if (!c || !['lower', 'upper'].includes(c.kind)) throw new RangeError('windowOf: 条件の種類は lower・upper');
    if (c.kind === 'lower') { if (c.u === null) { blocked.push(c.id); continue; } if (c.u > lo) { lo = c.u; loBy = c.id; } }
    else if (c.u < hi) { hi = c.u; hiBy = c.id; }
  }
  const conflicts = [];
  for (const a of conds) if (a.kind === 'lower' && a.u !== null) for (const b of conds) if (b.kind === 'upper' && a.u > b.u) conflicts.push([a.id, b.id]);
  return { lo, loBy, hi, hiBy, open: blocked.length === 0 && lo <= hi, blocked, conflicts };
}
/** 点 u が窓 W のどこにあるか('in'・'below'・'above'・窓が空なら 'closed') */
export function placeOf(u, Wd) { if (!Wd.open) return 'closed'; if (u < Wd.lo) return 'below'; if (u > Wd.hi) return 'above'; return 'in'; }

/* ───────── T4: 重力の側の列の入力を振る ───────── */
const LITKEY = Object.freeze({ Earth: 'earth', Mars: 'mars', Venus: 'venus' });
/** 最後の桁の 1(数の書き方の桁 —— 0.33 → 0.01・1.08263e-3 → 1e-8) */
export function lastDigit(x) {
  if (!(fin(x) && x !== 0)) throw new RangeError('lastDigit: 0 でない数');
  const s = Math.abs(x).toExponential(), [m, ex] = s.split('e'), dec = (m.split('.')[1] || '').length;
  return 10 ** (Number(ex) - dec);
}
const rotAbout = (v, axis, ang) => { const k = unit(axis), c = Math.cos(ang), s = Math.sin(ang); return add(add(scl(v, c), scl(crs(k, v), s)), scl(k, dot(k, v) * (1 - c))); };
/**
 * (T-g) の方位の率(″/年)を、入力を振って数え直す: dJ2・dMoi(加える量)・dOblDeg(ŝ を n̂ から離す向きに)・dMoonDeg(月の公転の北極を黄道の極から離す向きに)。
 * 振らなければ第352便u の rateOf(…, 'Tg', 'nat').az と同じ。
 */
export function gravPert(T1, GEO, id, { dJ2 = 0, dMoi = 0, dOblDeg = 0, dMoonDeg = 0 } = {}) {
  const set = DECL.resSet[id], pole = DECL.resPole[id], sh = U.shapeOf(T1, GEO, id), ax = U.axesOf(T1, GEO, id);
  const H = (sh.J2 + dJ2) / (sh.moi + dMoi);
  const tAx = crs(ax.nHat, ax.sHat), s = nrm(tAx) > 1e-12 ? unit(rotAbout(ax.sHat, tAx, dOblDeg * D2R)) : ax.sHat;
  const srcs = U.gravSrcs(T1, GEO, id, set).map((q) => {
    if (q.src !== 'Moon' || dMoonDeg === 0) return q;
    const t = crs([0, 0, 1], q.nHat); return { ...q, nHat: nrm(t) > 1e-12 ? unit(rotAbout(q.nHat, t, dMoonDeg * D2R)) : q.nHat };
  });
  const ds = U.tG(s, srcs, { H, omega: sh.omega }), pv = pole === 'ecl' ? [0, 0, 1] : ax.nHat, r = D.poleRates(pv, s, ds);
  return { id, set, pole, az: r.az * ASYR, H, oblDeg: W.angDeg(s, ax.nHat) };
}
/** 振る幅の一覧(受け手 id): J2・慣性モーメントの係数は最後の桁・角は宣言の幅(月の道は地球だけ) */
export function pertSteps(T1, GEO, id) {
  const sh = U.shapeOf(T1, GEO, id), o = [['J2', { dJ2: lastDigit(sh.J2) }, lastDigit(sh.J2)], ['moi', { dMoi: lastDigit(sh.moi) }, lastDigit(sh.moi)], ['obl', { dOblDeg: DECL.pertDeg }, DECL.pertDeg]];
  if (DECL.resSet[id] === 'sunMoon') o.push(['moon', { dMoonDeg: DECL.pertDeg }, DECL.pertDeg]);
  return o;
}

/* ───────── T5: 離心率のある軌道の (M) の歪み ───────── */
/**
 * 組(id ← src)の勾配のテンソルの 1 公転の平均(等しい時間の刻み)と位相ごとの大きさ。part 'M'・'S'・'MS'(第352便u の切り方)。
 * e 0・ϖ 0 で第352便u の strainOf と同じ置き方(位相 (k + ½) 2π ÷ N)。
 */
export function eccStrain(T1, GEO, id, src, { part = 'M', e = 0, nPhase = DECL.nPhase, periDeg = 0 } = {}) {
  if (!(fin(e) && e >= 0 && e < 1)) throw new RangeError('eccStrain: 0 ≤ e < 1');
  if (!(Number.isInteger(nPhase) && nPhase >= 4)) throw new RangeError('eccStrain: 位相の数 ≥ 4');
  const sc = part === 'M' ? [1, 0] : part === 'S' ? [0, 1] : part === 'MS' ? [1, 1] : null;
  if (!sc) throw new RangeError('eccStrain: 成分は M・S・MS');
  const Pp = U.pairSpec(T1, GEO, id, src), extraW = U.extraWOf(T1, GEO, id, src), Rr = G3.YK * Pp.m, Rs = G3.YK * Pp.Ms;
  const x0 = crs(Pp.sAx, Pp.nHat), xa = nrm(x0) > 1e-12 ? unit(x0) : unit(crs(Pp.nHat, Math.abs(Pp.nHat[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0])), ya = crs(Pp.nHat, xa);
  const pw = periDeg * D2R, xh = add(scl(xa, Math.cos(pw)), scl(ya, Math.sin(pw))), yh = crs(Pp.nHat, xh), q = 1 / Math.sqrt(1 - e * e);
  let Jm = new Array(9).fill(0), e2 = 0;
  for (let k = 0; k < nPhase; k++) {
    const M = 2 * Math.PI * (k + 0.5) / nPhase, Ek = e === 0 ? M : W.keplerE(M, e);
    const nu = e === 0 ? M : 2 * Math.atan2(Math.sqrt(1 + e) * Math.sin(Ek / 2), Math.sqrt(1 - e) * Math.cos(Ek / 2)), r = Pp.a * (1 - e * Math.cos(Ek));
    const rh = add(scl(xh, Math.cos(nu)), scl(yh, Math.sin(nu))), vh = crs(Pp.nHat, rh);
    const v = e === 0 ? scl(vh, Pp.vOrb) : add(scl(rh, Pp.vOrb * q * e * Math.sin(nu)), scl(vh, Pp.vOrb * q * (1 + e * Math.cos(nu))));
    const f = G3.makeField3({ sources: [{ m: Pp.Ms, R: Rs, p: scl(rh, -r), v: [0, 0, 0], spin: scl(Pp.sAx, Pp.ws * sc[1]) }], recv: { m: Pp.m, R: Rr, p: [0, 0, 0], v: scl(v, sc[0]) },
      W0: 0, extraW, kernel: { kind: 'ball', al: 1 }, rot: { form: 'M' }, self: true, mut: null });
    const J = f.J([0, 0, 0]);
    Jm = Jm.map((x, i) => x + J[i] / nPhase); e2 += U.fro(U.symOf(J)) ** 2 / nPhase;
  }
  const Eavg = U.symOf(Jm);
  return { id, src, part, e, periDeg, Eavg, eAvg: U.fro(Eavg), ePhaseRms: Math.sqrt(e2), Wavg: U.axialOf(Jm), sHat: unit(Pp.sHat), nHat: unit(Pp.nHat) };
}
/** 歪み Em を第352便u の (T-a)(T-b) に入れた方位の率(″/年 —— 極は地球 黄道の極・ほか公転の北極)と比べる数(仮の値)との比 */
export function eccRate(T1, GEO, id, Em, { cand, sense }) {
  const sh = U.shapeOf(T1, GEO, id), ax = U.axesOf(T1, GEO, id), pole = id === 'Earth' ? [0, 0, 1] : ax.nHat;
  const ds = cand === 'Ta' ? U.tA(ax.sHat, Em, { H: sh.H, sense }) : cand === 'Tb' ? U.tB(ax.sHat, Em, { H: sh.H, omega: sh.omega, sense }) : undefined;
  if (ds === undefined) throw new RangeError('eccRate: 候補は Ta・Tb');
  if (ds === null) return { id, cand, sense, az: null, overRef: null };
  const r = D.poleRates(pole, ax.sHat, ds), az = r === null ? null : r.az * ASYR, R = Q.refRate(id);
  const row = { id, cand, sense, az, ref: R.rate, overRef: fin(az) ? Math.abs(az) / R.rate : null };
  return R.kind === 'prov' ? B.tagProv(row, [R.provKey]) : row;
}

/* ───────── 零試験 ───────── */
/** 元の枝の正本の数(報告と正本 —— 文字で持つ) */
export const ANCHOR = Object.freeze({ sunTurn: '0.049', ringU: '1.1e-2', tiltGmL: '9.17e-4', keepEarthU1: '8.4e-4', res: Object.freeze({ Earth: '-5.5', Mars: '0.14', Venus: '-1.5' }),
  uV: 1.19282e-12, kRule: '8.38e+11', kObs: '5.31e+2', band: Object.freeze(['2.4', '3.7']) });
export function pureScenes(T1 = E.t1Table(), GEO = E.geometry()) {
  const cache = {};
  const sunTurn = condSunTurn({ f: 0 }), sunTurnE = SR.invertBg({ periodYr: 4.5e9 }).mult, sunTurnF1 = condSunTurn({ f: 1 });
  const ring1 = condRing({ fRing: 1 }), ringW = W.fRingMin({ th0Deg: 30, th1Deg: 7, Wb: DECL.omegaG });
  const tiltG = condSunTilt(T1, GEO, { dir: 'Gm', axis: 'L', dc: 1 }, cache), tiltN = condSunTilt(T1, GEO, { dir: 'Np', axis: 'L', dc: 1 }, cache), tiltG3 = condSunTilt(T1, GEO, { dir: 'Gm', axis: 'L', dc: 1e-3 }, cache);
  const keepF1 = condKeep(T1, GEO, { dir: 'Np', axis: 'L', tSrc: 0, f: 1 }, cache);
  const stU1 = W.stateW(T1, GEO, 'Earth|Sun', { dir: 'Np', axis: 'L', u: 1, tSrc: 0 }, cache), keepAtU1 = W.fKeep({ thDeg: stU1.thDeg, W: stU1.W, crit: DECL.keepCrit });
  const keepCheck = W.fKeep({ thDeg: W.stateW(T1, GEO, 'Earth|Sun', { dir: 'Np', axis: 'L', u: keepF1.u, tSrc: 0 }, cache).thDeg, W: W.stateW(T1, GEO, 'Earth|Sun', { dir: 'Np', axis: 'L', u: keepF1.u, tSrc: 0 }, cache).W, crit: DECL.keepCrit }).k1Max;
  const res = Object.fromEntries(DECL.resBodies.map((id) => [id, residualOf(T1, GEO, id, cache)]));
  const vR = condVenus(T1, GEO, { tSrc: 0, k: 1 }, cache), vO = condVenus(T1, GEO, { tSrc: 1, k: 1 }, cache);
  const band = resonanceBand(), bgU1 = nrm(D.bgVec('Gm', { u: 1 })) / DECL.omegaG;
  const ec0 = eccStrain(T1, GEO, 'Earth', 'Sun', { part: 'M', e: 0 }), ecU = U.strainOf(T1, GEO, 'Earth', 'Sun', { part: 'M', extraW: U.extraWOf(T1, GEO, 'Earth', 'Sun') });
  const es0 = eccStrain(T1, GEO, 'Mars', 'Sun', { part: 'S', e: 0 }), esU = U.strainOf(T1, GEO, 'Mars', 'Sun', { part: 'S', extraW: U.extraWOf(T1, GEO, 'Mars', 'Sun') });
  const gp0 = Object.fromEntries(DECL.resBodies.map((id) => [id, [gravPert(T1, GEO, id).az, U.rateOf(T1, GEO, id, DECL.resSet[id], 'Tg', 'nat').az[DECL.resPole[id]]]]));
  const win = { a: windowOf([{ id: 'L1', kind: 'lower', u: 1e-3 }, { id: 'L2', kind: 'lower', u: 1e-2 }, { id: 'U1', kind: 'upper', u: 5 }, { id: 'U2', kind: 'upper', u: 0.5 }]),
    b: windowOf([{ id: 'L1', kind: 'lower', u: 1 }, { id: 'U1', kind: 'upper', u: 0.1 }]), c: windowOf([{ id: 'L1', kind: 'lower', u: null }, { id: 'U1', kind: 'upper', u: 1 }]) };
  const ld = [lastDigit(0.33), lastDigit(1.08263e-3), lastDigit(0.3307), lastDigit(4.458e-6)];
  const rej = [() => condSunTilt(T1, GEO, { dir: 'Gm', axis: 'L', dc: 0 }), () => condResid({ resAs: -1 }), () => eccStrain(T1, GEO, 'Earth', 'Sun', { e: 1 }), () => windowOf([{ id: 'x', kind: 'mid', u: 1 }]), () => lastDigit(0)]
    .map((g) => { try { g(); return false; } catch (e) { return e instanceof RangeError; } });
  return { sunTurn: sunTurn.u, sunTurnE, sunTurnF1: sunTurnF1.u, ring1: ring1.u, ringWf: ringW.f, ringWu: ringW.uMin, tiltG: tiltG.u, tiltN: tiltN.u, tiltG3: tiltG3.u, keepF1: keepF1.u, keepAtU1: keepAtU1.fMax, keepCheck,
    res: Object.fromEntries(Object.entries(res).map(([k, v]) => [k, v.res])), uVrule: vR.uV, uVobs: vO.uV, band: [band.uLo, band.uHi], bgU1,
    ecM: [ec0.eAvg <= DECL.floor * ec0.ePhaseRms ? 0 : ec0.eAvg, ecU.eAvg <= DECL.floor * ecU.ePhaseRms ? 0 : ecU.eAvg, ec0.ePhaseRms, ecU.ePhaseRms], ecS: [es0.Eavg, esU.Eavg], gp0, win, ld, rejects: rej };
}
export function pureGates(S) {
  const rel = (a, b, t) => Math.abs(a / b - 1) <= t, p2 = (x) => Number(x).toPrecision(2);
  return {
    sunTurn: p2(S.sunTurn) === '0.049' && rel(S.sunTurn, S.sunTurnE, 1e-12) && S.sunTurnF1 === null,
    ring: Number(S.ringWf).toExponential(1) === ANCHOR.ringU && rel(S.ring1, S.ringWu, 1e-12),
    tilt: Number(S.tiltG).toExponential(2) === ANCHOR.tiltGmL && S.tiltN === null && rel(S.tiltG3 / S.tiltG, 1e3, 1e-12),
    keep: Number(S.keepAtU1).toExponential(1) === ANCHOR.keepEarthU1 && rel(S.keepCheck, 1, 1e-9) && Number(S.keepF1).toExponential(1) === ANCHOR.keepEarthU1,
    resid: Object.entries(ANCHOR.res).every(([k, v]) => p2(S.res[k]) === v),
    venus: rel(S.uVrule, ANCHOR.uV, 5e-6) && Number(1 / S.uVrule).toPrecision(3) === ANCHOR.kRule && Number(1 / S.uVobs).toExponential(2) === ANCHOR.kObs,
    band: S.band[0].toFixed(1) === ANCHOR.band[0] && S.band[1].toFixed(1) === ANCHOR.band[1],
    bgUnit: rel(S.bgU1, 1, 1e-12),
    eccZero: S.ecM[0] <= DECL.floor * S.ecM[2] && S.ecM[1] <= DECL.floor * S.ecM[3] && rel(S.ecM[2], S.ecM[3], 1e-12) && S.ecS[0].every((x, i) => Math.abs(x - S.ecS[1][i]) <= 1e-12 * U.fro(S.ecS[1])),
    gravBase: Object.values(S.gp0).every(([a, b]) => rel(a, b, 1e-12)),
    window: S.win.a.open && S.win.a.lo === 1e-2 && S.win.a.loBy === 'L2' && S.win.a.hi === 0.5 && S.win.a.hiBy === 'U2' && !S.win.b.open && JSON.stringify(S.win.b.conflicts) === '[["L1","U1"]]'
      && !S.win.c.open && JSON.stringify(S.win.c.blocked) === '["L1"]',
    lastDigit: rel(S.ld[0], 0.01, 1e-12) && rel(S.ld[1], 1e-8, 1e-9) && rel(S.ld[2], 1e-4, 1e-9) && rel(S.ld[3], 1e-9, 1e-9),
    rejects: S.rejects.every(Boolean),
  };
}
