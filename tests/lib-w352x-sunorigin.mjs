// 第352便x(原仮定者の整理(2026-11-24 —— 第148報)・統括の検証項目 R461):
//   **太陽の傾きを作る候補の続き —— 公転面(輪の法線)も背景に応えて動く組で、初めにそろっていた公転面の法線と太陽の自転軸が、
//   いまの角(基準軸に対して 5.968°〔L〕・5.230°〔eq〕)といまの方位((G+) の方位から −22.5°〔L〕・−13.3°〔eq〕)に同時に届くかを数える純関数 —— 届く組の走査・診断だけ**
//   (器 tests/exp-w352x-sunorigin.mjs と QA behavior.sunorigin352x・docs.sunorigin352x が読む —— html を読まない・ファイルを読まない・状態を持たない。後のラウンドの枝もこの口を import してよい)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない。
//   既存の lib は呼ぶだけ(本文は変えない): 第352便r(bgTwo・abOf・uVenusRad・localS・dAzAround・nowDAz・bodyOf)・第352便l(closedAxis・axisCoef・twoAxisStep・dphiFor —— 零試験の照合)・
//   第352便c(refAxes・galDirs・azimuthDeg・dAz)・第352便p(bodyNums・coefCand —— 係数の比の候補 (P1)(P2)(P3))・第351便d(r3Coeffs)・第347便e(t1Table・geometry)・第337便c(年の長さ・年齢の宣言)。
//
// ■ 背景(候補 —— 1 つに決めない): Ω_bg = a ω_G N̂ + b ω_G Ĝ₋(第352便r の bgTwo)。比 ρ = b ÷ a がノブ・大きさ a は (uV)(金星の条件 —— 源の半径 規則/観測)か倍率 1。
// ■ 2 つの軸: 輪の法線 n̂ と太陽の自転軸 ŝ は、どちらも同じ Ω に (R3) の 2 経路の形で応える(係数は軸ごと —— 輪 c_n・太陽 c_s・比率 f・歳差の向き (g2±))。
//   一定の Ω では、1 つの軸の写像は Ω̂ のまわりの極の角 θ(tan(θ/2) = tan(θ₀/2) e^(−k₁ c τ))と方位(±k₂ c τ)に分かれる(τ = abs(Ω) t —— 無次元の時間)。
//   この写像は Ω̂ のまわりの回転と入れ替えられる —— 背景の大きさは τ の物差しだけを変える(届くかどうかは「年齢の内の τ」= abs(Ω) × 年齢 で決まる)。
//   太陽の局所の (S)(惑星由来の和)は背景の 1e-10 の桁 —— 走査では入れない(零試験で大きさを記録)。
// ■ 始まりの置き方 2 つ(読み —— 1 つに決めない):
//   (読み A) 始まり = いまの基準軸(第352便r の表の作り): 2 つの軸がいまの基準軸から出て、時刻 τ の輪の法線のまわりで角と方位を測る(輪の法線は基準軸から回る)。
//   (読み B) 終わり = いまの基準軸: 時刻 τ の輪の法線がいまの基準軸に来るように、始まりの向きを輪の写像で逆に戻して置く(始まり X₀ = M_輪(τ)⁻¹ N̂)。
//     経路 ② だけ(f 0)なら、ŝ(τ) = (N̂ を Ω̂ のまわりに ±Δφ 回したもの)・Δφ = (c_s − c_n) k₂ τ —— 角と方位は Δφ だけで決まる。
// ■ 方位: 輪の法線のまわりの ŝ の方位 − (G+) の方位(第352便r の dAzAround —— 右ねじで正)。いまの方位は第352便r の nowDAz。
// ■ 言わないこと: 太陽の傾きの原因が分かったとは書かない。背景が 2 つの項から成るとは書かない(届く組の走査)。この場・この比・この係数・この読みでは、の表。
import * as T from './lib-w352r-twobg.mjs';
import * as SL from './lib-w352l-suntilt.mjs';
import * as RC from './lib-w352c-refaxis.mjs';
import * as P from './lib-w352p-coprec.mjs';
import * as R3 from './lib-w351d-r3step.mjs';
import * as E from './lib-w347e-spintorque.mjs';
import * as TL from './lib-w337c-tidelock.mjs';

export const LIB_VERSION = 'w352x-sunorigin-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const D2R = Math.PI / 180;
const { dot, crs, nrm, scl, add, sub, unit } = T.vec;
const isVec = (a) => Array.isArray(a) && a.length === 3 && a.every(fin);
export const angDeg = T.angDeg;
export const YR = TL.YR;
export const ASYR = T.ASYR;
export const vec = T.vec;

/* ───────── 宣言(走らせたノブの格子と判定の物差しの記録 —— 式の形の宣言ではない)───────── */
export const DECL = Object.freeze({
  axes: Object.freeze(['L', 'eq']), rads: T.DECL.rads, senses: Object.freeze(['g2m', 'g2p']), reads: Object.freeze(['A', 'B']),
  /** 届いたと数える幅(物差し —— 採否の判定ではない): 角 ± 0.5°・方位 ± 5° */
  tol: Object.freeze({ gammaDeg: 0.5, azDeg: 5 }),
  tiltDeg: Object.freeze({ L: T.DECL.tiltDeg.L, eq: T.DECL.tiltDeg.eq }),
  ageYr: T.DECL.ageYr, omegaG: T.DECL.omegaG, uV: T.DECL.uV,
  /** 公転面の散らばりの物差し(いまの 8 惑星の公転の法線と基準軸の角の上限の桁) */
  spreadDeg: 7,
  floor: 1e-12, judge: '丸めの桁の床: 打ち消しで 0 になる量は尺度の 1e-12 倍以下を 0 と書く',
});

/* ───────── 1 つの軸の写像(一定の Ω —— 負の時間も受ける)───────── */
/** 係数: { sense, kTilt, kPrec, ratio }(ratio = 軸の応答の係数 c)。f から作るときは第351便d の (N1) */
export function coefOf({ f = 0, sense = 'g2p', ratio = 1, kTilt = null, kPrec = null } = {}) {
  if (!DECL.senses.includes(sense)) throw new RangeError('coefOf: 歳差の向きは g2m・g2p');
  if (!(fin(ratio) && ratio >= 0)) throw new RangeError('coefOf: 係数 c ≥ 0');
  if (kTilt !== null || kPrec !== null) {
    if (!(fin(kTilt) && kTilt >= 0 && fin(kPrec) && kPrec >= 0)) throw new RangeError('coefOf: k₁・k₂ ≥ 0');
    return { sense, kTilt, kPrec, ratio };
  }
  if (!(fin(f) && f >= 0 && f <= 1)) throw new RangeError('coefOf: 0 ≤ f ≤ 1');
  const c = R3.r3Coeffs(f, 'N1');
  return { sense, kTilt: c.kTilt, kPrec: c.kPrec, ratio };
}
/** Ω̂ のまわりに右ねじで角 a(rad)回す */
export function rotAbout(v, w, a) { const c = Math.cos(a), s = Math.sin(a); return add(add(scl(v, c), scl(crs(w, v), s)), scl(w, dot(w, v) * (1 - c))); }
/**
 * 無次元の時間 τ(= abs(Ω) t —— 負も可)の後の軸(閉じた形): θ は tan(θ/2) = tan(θ₀/2) e^(−k₁ c τ)・方位は ±k₂ c τ((g2+) は右ねじで正)。
 * τ ≥ 0 では第352便l の closedAxis と同じ数(零試験)。
 */
export function mapAxis(X, w, tau, c) {
  if (!(isVec(X) && nrm(X) > 0 && isVec(w) && nrm(w) > 0 && fin(tau))) throw new RangeError('mapAxis: X・Ω̂・τ');
  const x = unit(X), W = unit(w), cth = dot(x, W), u0 = sub(x, scl(W, cth)), su = nrm(u0);
  if (su < 1e-14 || tau === 0) return x;
  const th0 = Math.atan2(su, cth), u = scl(u0, 1 / su), v = crs(W, u);
  const th = c.kTilt === 0 ? th0 : 2 * Math.atan(Math.tan(th0 / 2) * Math.exp(-c.kTilt * c.ratio * tau));
  const dphi = (c.sense === 'g2p' ? 1 : -1) * c.kPrec * c.ratio * tau, s = Math.sin(th);
  return add(scl(W, Math.cos(th)), add(scl(u, s * Math.cos(dphi)), scl(v, s * Math.sin(dphi))));
}

/* ───────── 2 つの軸の状態(T1 の約束の口)───────── */
/**
 * o: { GEO, axis(いまの基準軸 N̂), w(Ω̂ —— 背景の向き), tau, ring(c_n の係数), spin(c_s の係数), read 'A'|'B' }
 * 戻り値 { n, s, X0, gammaDeg(2 つの軸の角), dAzDeg(輪の法線のまわりの ŝ の方位 − (G+)・2 つの軸がそろっていれば null), turnDeg(輪の法線が始まりの向きから回った角), endOffDeg(終わりの輪の法線といまの基準軸の角) }
 */
export function stateAt({ GEO, axis, w, tau, ring, spin, read = 'B' }) {
  if (!DECL.reads.includes(read)) throw new RangeError('stateAt: 読みは A・B');
  if (!(fin(tau) && tau >= 0)) throw new RangeError('stateAt: τ ≥ 0');
  const N = unit(axis), X0 = read === 'A' ? N : mapAxis(N, w, -tau, ring);
  const n = mapAxis(X0, w, tau, ring), s = mapAxis(X0, w, tau, spin), g = angDeg(n, s);
  return { n, s, X0, gammaDeg: g, dAzDeg: g > 1e-9 ? T.dAzAround(GEO, n, s) : null, turnDeg: angDeg(X0, n), endOffDeg: angDeg(n, N) };
}
/** 背景の向き Ω̂(比 ρ —— ∞ は純粋な (G−))と、いまの基準軸と Ω̂ の角 θ(°)。大きさ 1 の a で作る(τ の物差しは別) */
export function bgDir(axis, rho) {
  const { a, b } = T.abOf(rho, 1), Om = T.bgTwo({ a, b, axis }), off = T.bgTwo({ a: 0, b, axis });
  return { w: unit(Om), om1: nrm(Om), thDeg: Math.atan2(nrm(crs(off, unit(axis))), dot(Om, unit(axis))) / D2R };
}
/** 年齢の内の τ(= abs(Ω_bg) × 年齢)—— a0 は (N+) の項の倍率(ω_G の倍)・om1 は bgDir の大きさ(a 1 のとき)・係数 c_n 1 の物差し */
export const tauAge = ({ a0, om1, ageYr = DECL.ageYr }) => a0 * om1 * ageYr * YR;

/* ───────── 届く組の探し方 ───────── */
const inBand = (g, z, gT, azT, tol) => g !== null && z !== null && Math.abs(g - gT) <= tol.gammaDeg && Math.abs(RC.dAz(z, azT)) <= tol.azDeg;
/**
 * 読み B・経路 ② だけ(f 0): 角と方位は Δφ だけで決まる —— Δφ ∈ (0, 2π) の格子で、届く Δφ の集まり(最小の Δφ と、方位のいちばん近い所)。
 * 戻り値 { dphiMin(rad)| null, nearAzDeg(角が幅の内の所での方位の差の最小)| null, azRange([min, max] 角が幅の内の方位), gMaxDeg(届く角の上限 2θ) }
 */
export function dphiReachB({ GEO, axis, w, sense, gT, azT, tol = DECL.tol, n = 7200 }) {
  const N = unit(axis), sg = sense === 'g2p' ? 1 : -1;
  let dMin = null, near = null, zLo = null, zHi = null;
  for (let i = 1; i < n; i++) {
    const d = 2 * Math.PI * i / n, s = rotAbout(N, unit(w), sg * d), g = angDeg(N, s);
    if (Math.abs(g - gT) > tol.gammaDeg) continue;
    const z = T.dAzAround(GEO, N, s), e = Math.abs(RC.dAz(z, azT));
    if (near === null || e < near) near = e;
    zLo = zLo === null ? z : Math.min(zLo, z); zHi = zHi === null ? z : Math.max(zHi, z);
    if (e <= tol.azDeg && dMin === null) dMin = d;
  }
  return { dphiMin: dMin, nearAzDeg: near, azRange: zLo === null ? null : [zLo, zHi], gMaxDeg: 2 * angDeg(N, w) };
}
/**
 * 一般の探し方(読み A・B・どの f でも): τ の対数の格子(tauMax × 10^(−dec) 〜 tauMax・nTau 点)で、角と方位の両方が幅の内に入る最初の τ。
 * 戻り値 { tau | null, nearAzDeg(角が幅の内の標本での方位の差の最小)| null, nearGDeg(標本の角といまの角の差の最小), turnDeg(届いた時の輪の回った角)| null, nGamma(角が幅の内の標本の数) }
 */
export function reachScan({ GEO, axis, w, ring, spin, read, gT, azT, tauMax, tol = DECL.tol, nTau = 400, dec = 10 }) {
  if (!(fin(tauMax) && tauMax > 0)) throw new RangeError('reachScan: τ の上限 > 0');
  let near = null, nearG = null, hit = null, nG = 0;
  for (let k = 0; k <= nTau; k++) {
    const tau = tauMax * Math.pow(10, -dec + dec * k / nTau), st = stateAt({ GEO, axis, w, tau, ring, spin, read });
    const eg = Math.abs(st.gammaDeg - gT); nearG = nearG === null ? eg : Math.min(nearG, eg);
    if (eg > tol.gammaDeg || st.dAzDeg === null) continue;
    nG++;
    const e = Math.abs(RC.dAz(st.dAzDeg, azT)); near = near === null ? e : Math.min(near, e);
    if (hit === null && e <= tol.azDeg) hit = { tau, turnDeg: st.turnDeg, dAzDeg: st.dAzDeg, gammaDeg: st.gammaDeg };
  }
  return { tau: hit ? hit.tau : null, nearAzDeg: near, nearGDeg: nearG, turnDeg: hit ? hit.turnDeg : null, nGamma: nG, hit };
}

/* ───────── 係数の比の候補(T3)───────── */
/**
 * 輪(木星の距離の粒子の輪)と太陽の自転軸の応答の係数の比 c_s ÷ c_n の候補(輪 c_n = 1 に置く)。
 * 第352便p の (P1)(P2)(P3)(coefCand —— 太陽の C・ω・輪の n は bodyNums('Sun'))と、第352便q の式の候補の物差し X を 2 つの軸に当てた比 X_太陽 ÷ X_輪:
 *   (ア)(S1) = 1・(ア)(S2) = (P2) と同じ・(イ) 1 ÷ ω(輪は ω = n_輪)・(ウ) n² ÷ ω(太陽の n = ω_G・輪は n_輪² ÷ n_輪)・(ウ′)・(エ) は輪に量が無い → null。
 * perp = 2 つの軸に直交する合成の大きさ(rad/s —— (P2) だけが使う)
 */
export function candRatios({ perp = 0 } = {}) {
  const S = P.bodyNums('Sun'), og = DECL.omegaG, out = {};
  const p2 = P.coefCand('P2', { w: S.w, nOrb: S.nOrb, perpS: perp, perpN: perp });
  out.P1 = { ratio: 1, q: 0, note: '(S1) —— 同じ式' };
  out.P2 = { ratio: 1 + p2.rel, q: p2.rel, note: '(S2) の外れ(差で作らず直接に)' };
  const p3 = P.coefCand('P3', { C: S.C }); out.P3 = { ratio: p3.cs, q: p3.rel, note: '慣性の形 0.4 ÷ C(太陽)' };
  out.a1 = { ratio: 1, q: 0, note: '(ア)(S1)' };
  out.a2 = { ratio: 1 + p2.rel, q: p2.rel, note: '(ア)(S2) = (P2)' };
  out.i = { ratio: S.nOrb / S.w, q: S.nOrb / S.w - 1, note: '(イ) 1 ÷ ω —— 輪の ω を n_輪 に' };
  out.u = { ratio: (og * og / S.w) / S.nOrb, q: (og * og / S.w) / S.nOrb - 1, note: '(ウ) n² ÷ ω —— 太陽の n = ω_G・輪は n_輪' };
  out.uJ = { ratio: null, q: null, note: '(ウ′) 輪に J2・慣性モーメントの係数が無い' };
  out.e = { ratio: null, q: null, note: '(エ) c_R は局所の項にだけ掛かる —— 背景の応答の比ではない' };
  return { S, cands: out };
}

/* ───────── 8 惑星の公転面(T4)───────── */
/** 8 惑星の公転の法線(いま)と、法線の等しい重みの平均からの角の最大(°) */
export function spreadOf(ns) { const m = unit(ns.reduce((s, n) => add(s, unit(n)), [0, 0, 0])); return { mean: m, maxDeg: Math.max(...ns.map((n) => angDeg(n, m))) }; }
/** 法線の応答の係数の法則: 'uni'(全部 1)・'i'(1 ÷ n —— 木星の輪を 1 に)・'u'(n —— 木星の輪を 1 に) */
export function orbitCoefs(law) {
  const ids = T.DECL.planets, nJ = P.bodyNums('Sun').nOrb;
  const nOf = (id) => P.bodyNums(id).nOrb;
  if (law === 'uni') return ids.map(() => 1);
  if (law === 'i') return ids.map((id) => nJ / nOf(id));
  if (law === 'u') return ids.map((id) => nOf(id) / nJ);
  throw new RangeError('orbitCoefs: 法則は uni・i・u');
}
/** τ(係数 1 の物差し)の後の 8 惑星の法線(各々の係数 c_i・比率 f・向き sense) */
export function orbitsAt(GEO, { w, tau, coefs, f = 0, sense = 'g2p' }) {
  return T.DECL.planets.map((id, i) => mapAxis(GEO[id + '|Sun'].n, w, tau, coefOf({ f, sense, ratio: coefs[i] })));
}

/* ───────── 零試験 ───────── */
export const ANCHOR = Object.freeze({ nowAz: Object.freeze({ L: '-22.5', eq: '-13.3' }), tilt: Object.freeze({ L: 5.968, eq: 5.23 }), bandL: Object.freeze([0.061, 0.087]), bandEq: Object.freeze([0.053, 0.100]) });
export function pureScenes(T1 = E.t1Table(), GEO = E.geometry()) {
  const RA = RC.refAxes(T1, GEO), ax = { L: RA.L, eq: RA.eq };
  // ① mapAxis(τ ≥ 0)= 第352便l の closedAxis(Ω を物差しつきで —— 経路 ① を含む f 0.5・(g2±))
  const Om = T.bgTwo({ a: 2.5, b: 0.7, axis: ax.L }), om = nrm(Om), X = [0.3, -0.5, 0.81];
  let vsL = 0;
  for (const sense of DECL.senses) for (const f of [0, 0.5, 1]) {
    const c = coefOf({ f, sense, ratio: 0.8 }), cl = SL.closedAxis(X, Om, 3.7 / om, SL.axisCoef(f, { sense, ratio: 0.8 }));
    vsL = Math.max(vsL, nrm(sub(mapAxis(X, unit(Om), 3.7, c), cl)));
  }
  // ② 逆の写像: M(−τ) M(τ) X = X(経路 ① を含む)
  const c5 = coefOf({ f: 0.5, sense: 'g2m', ratio: 1.3 }), back = nrm(sub(mapAxis(mapAxis(X, unit(Om), 2.2, c5), unit(Om), -2.2, c5), unit(X)));
  // ③ 読み A の状態 = 第352便l の twoAxisStep(同じ係数の組・同じ τ)
  const rg = coefOf({ f: 0, sense: 'g2p', ratio: 1 }), sp = coefOf({ f: 0, sense: 'g2p', ratio: 0.97 });
  const stA = stateAt({ GEO, axis: ax.L, w: unit(Om), tau: 40, ring: rg, spin: sp, read: 'A' });
  const tw = SL.twoAxisStep({ n0: ax.L, s0: ax.L, om: Om, T: 40 / om, steps: 1, ring: SL.axisCoef(0, { ratio: 1 }), spin: SL.axisCoef(0, { ratio: 0.97 }) });
  const vsStep = Math.abs(stA.gammaDeg - tw.gammaDeg);
  // ④ 係数が同じなら角は開かない(読み A・B・f 0 と 0.5)
  let same = 0;
  for (const read of DECL.reads) for (const f of [0, 0.5]) { const c = coefOf({ f, sense: 'g2m', ratio: 1.1 }); same = Math.max(same, stateAt({ GEO, axis: ax.eq, w: unit(Om), tau: 5, ring: c, spin: c, read }).gammaDeg); }
  // ⑤ 読み B: 終わりの輪の法線 = いまの基準軸・f 0 では ŝ = N̂ を Ω̂ のまわりに Δφ 回したもの
  const stB = stateAt({ GEO, axis: ax.L, w: unit(Om), tau: 40, ring: rg, spin: sp, read: 'B' });
  const sB = rotAbout(unit(ax.L), unit(Om), (0.97 - 1) * 40), vsB = Math.max(stB.endOffDeg, nrm(sub(stB.s, sB)));
  // ⑥ 枝 r の表の数: いまの方位(L −22.5°・eq −13.3°)・3 つの条件と経路 ② の帯の両端(比 0.061 で 2θ < 5.968 は届かない側・0.087 で届く側)
  const nowAz = { L: T.nowDAz(GEO, ax.L).toFixed(1), eq: T.nowDAz(GEO, ax.eq).toFixed(1) };
  const th = (axn, r) => bgDir(ax[axn], r).thDeg;
  const bandEnds = { Llo: 2 * th('L', 0.0605) < ANCHOR.tilt.L, Lhi: 2 * th('L', 0.087) >= ANCHOR.tilt.L, eqlo: 2 * th('eq', 0.0525) < ANCHOR.tilt.eq, eqhi: 2 * th('eq', 0.1) >= ANCHOR.tilt.eq };
  // ⑦ 枝 r の方位の側: 輪が動かない組(c_n 0)・経路 ②・読み A では ŝ の方位は (G−) の側(abs > 90°)
  const wMid = bgDir(ax.L, 0.075).w; let side = 0, nSide = 0;
  for (let k = 1; k <= 60; k++) { const st = stateAt({ GEO, axis: ax.L, w: wMid, tau: k * 0.1, ring: coefOf({ ratio: 0 }), spin: coefOf({ ratio: 1 }), read: 'A' }); if (st.dAzDeg !== null) { nSide++; if (Math.abs(st.dAzDeg) > 90) side++; } }
  // ⑧ 読み B・f 0 の Δφ の走査と一般の走査が同じ届き(比 ∞ —— (G−) だけ —— L)
  const wG = bgDir(ax.L, Infinity).w, dB = dphiReachB({ GEO, axis: ax.L, w: wG, sense: 'g2p', gT: 5.968, azT: T.nowDAz(GEO, ax.L) });
  const rB = reachScan({ GEO, axis: ax.L, w: wG, ring: coefOf({ ratio: 1 }), spin: coefOf({ ratio: 1.5 }), read: 'B', gT: 5.968, azT: T.nowDAz(GEO, ax.L), tauMax: 30, nTau: 2000, dec: 3 });
  const consistBG = (dB.dphiMin === null) === (rB.tau === null);
  // ⑨ 太陽の局所の (S) ÷ 背景((uV)・規則 —— 走査で入れない大きさ)
  const uV = T.uVenusRad(T1, GEO, { rad: 'rule' }), locOverBg = nrm(T.localS(T1, GEO, 'Sun', { rad: 'rule' }).S) / nrm(T.bgTwo({ a: uV, b: 0, axis: ax.L }));
  // ⑩ 係数の比の候補: (P1) 0・(P3) = 0.4 ÷ C − 1(第352便p の報告 4.71)
  const CR = candRatios({ perp: 1e-20 }).cands;
  // ⑪ 公転面: 係数がそろえば散らばりは変わらない(Ω̂ のまわりの剛体の回転)
  const ns0 = T.DECL.planets.map((id) => GEO[id + '|Sun'].n), sp0 = spreadOf(ns0).maxDeg;
  const sp1 = spreadOf(orbitsAt(GEO, { w: wG, tau: 2.3, coefs: orbitCoefs('uni') })).maxDeg;
  // ⑫ 拒否
  const rej = [() => coefOf({ sense: 'x' }), () => coefOf({ f: 2 }), () => mapAxis([0, 0], [0, 0, 1], 1, rg), () => stateAt({ GEO, axis: ax.L, w: wG, tau: -1, ring: rg, spin: rg }),
    () => stateAt({ GEO, axis: ax.L, w: wG, tau: 1, ring: rg, spin: rg, read: 'C' }), () => reachScan({ GEO, axis: ax.L, w: wG, ring: rg, spin: rg, read: 'A', gT: 1, azT: 0, tauMax: 0 }), () => orbitCoefs('x')]
    .map((fn) => { try { fn(); return false; } catch (er) { return er instanceof RangeError; } });
  return { vsL, back, vsStep, same, vsB, nowAz, bandEnds, side, nSide, dphiMinG: dB.dphiMin, nearG: dB.nearAzDeg, tauG: rB.tau, consistBG, locOverBg, qP1: CR.P1.q, qP3: CR.P3.q, sp0, sp1, rejects: rej };
}
export function pureGates(S) {
  return {
    mapVsClosedAxis: S.vsL < 1e-12,
    inverseMap: S.back < 1e-12,
    readAVsTwoAxisStep: S.vsStep < 1e-9,
    sameCoefNoOpen: S.same < 1e-9,
    readBEndAtAxis: S.vsB < 1e-9,
    nowAzimuth: S.nowAz.L === ANCHOR.nowAz.L && S.nowAz.eq === ANCHOR.nowAz.eq,
    bandEnds: Object.values(S.bandEnds).every(Boolean),
    ringFixedSide: S.nSide > 0 && S.side === S.nSide,
    readBScanConsistent: S.consistBG,
    sunLocalSmall: S.locOverBg > 0 && S.locOverBg < 1e-8,
    candRatios: S.qP1 === 0 && Math.abs(S.qP3 - 4.71) < 0.01,
    uniformSpreadKept: Math.abs(S.sp1 - S.sp0) < 1e-9,
    rejects: S.rejects.every(Boolean),
  };
}
