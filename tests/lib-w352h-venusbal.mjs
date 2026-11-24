// 第352便h(原仮定者の回答(2026-11-24 —— 第148報)「AN1019: Aで進める。金星の自転の逆回転は、釣り合った状態で地球とも共鳴した結果である」・統括の検証項目 R445):
//   **金星 —— 太陽由来の (S) と背景の打ち消し・釣り合いの点(外からの軸の拘束が小さい点)・ほかの源の残り・地球との共鳴の算術の純関数。診断だけ**
//   (器 tests/exp-w352h-venusbal.mjs と QA behavior.venusbal352h・docs.venusbal352h が読む —— html を読まない・ファイルを読まない・状態を持たない。後のラウンドの枝もこの口を import する)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない。
//   既存の lib は呼ぶだけ(本文は変えない): 第352便c(refAxes —— 基準軸は必ずここから)・第352便d(bgDir・bgVec・poleRates —— 背景の向きと大きさ)・第352便e(rotOf —— 入力 P を受ける成分の回転)・
//   第352便b(prov・repoRef・resonancePeriod —— 仮の値は台帳に在る数だけ)・第351便e(localOf・bgTerm・uEqMag)・第351便c(pairInput・closedSEq)・第348便h(makeField3・rot3・YK)・
//   第350便b(equivR)・第347便h(gaussLegendre)・第312便a(Kball)・第347便e(t1Table・geometry)。
//
// ■ 語(本便の共通の語): 主の成分 (S)(源の自転の分)・比べる列 (MS)。背景の向き (N+)(N−)(基準軸の向き/逆)・(G−)(G+)(銀河の回転と逆/同じ向き)。基準軸 eq(等重み)・L(角運動量の重み)・ecl(黄道の極)。
//   b̂ = 背景の単位の向き・b₁ = 倍率 1 の背景の大きさ(銀河の公転の角速度 ω_G)・S = 受け手の位置の太陽由来の成分(rad/s)。
//   **(ア) 大きさが同じ**: uMag = abs(S) ÷ b₁(第351便e の uEqMag)/**(イ) 合成が最小**: uMin × b₁ = −(b̂·S)(正のときだけ —— 負か 0 なら「打ち消さない」)。
//   φ = −S と b̂ のなす角(atan2 —— 小さい角も桁を落とさない)。残り(合成 ÷ 背景): (ア) 2 sin(φ/2)・(イ) tan φ(φ < 90°)。(イ) ÷ (ア) の倍率 = cos φ。
//   **閉じた形(第351便c の (S) の円の道の平均の向き)**: −Ŝ ∥ 3 (ŝ☉·n̂) n̂ − ŝ☉(ŝ☉ = 太陽の自転軸・n̂ = 受け手の公転の法線 —— 双極子の場の円の平均と同じ形。零試験で 8 惑星の数値と照合)。
//   小角の式: φ ≈ abs((3 n̂ − ŝ☉) ÷ 2 − b̂)(どれも b̂ の近くに在るとき —— 太陽の傾きと公転面の傾きの 1 次)。
// ■ 釣り合いの点(T3): 基準軸に垂直な円の道の試しの受け手(金星の質量・自転軸は基準軸)を距離 r で動かす。(S) は r の −3 乗(第351便c の closedSEq と照合)。
// ■ ほかの源(T4): 受け手 = 金星・源 = 惑星(源の自転軸 = geometry() の w・自転の率 = t1Table の omega)。同じ面の円の道(金星の公転面)に置き、会合の位相 φ で
//   源の位置 a_src ê(φ) − a_V x̂・受け手の相対の速度 v_V ŷ − v_src t̂(φ)(源を静止に置く —— 第351便c の partRot と同じ約束)。分母 = 自分 + 源 + 太陽(extraW = 太陽の重みの中心の値 —— 主)。
// ■ 言わないこと: 金星が釣り合っている・共鳴している・逆回転を説明した、とは書かない(この場・この成分・この背景の向き・この基準軸では、の表)。仮の値を使った数は「仮・未照合」の印つき。
import * as RA from './lib-w352c-refaxis.mjs';
import * as PS from './lib-w352d-precsense.mjs';
import * as SR from './lib-w352e-sunrecv.mjs';
import * as PV from './lib-w352b-provisional.mjs';
import * as BB from './lib-w351e-bgbalance.mjs';
import * as SP from './lib-w351c-srcparts.mjs';
import * as G3 from './lib-w348h-axisgeo3.mjs';
import * as SC from './lib-w350b-sphereconv.mjs';
import * as H from './lib-w347h-axisdiff.mjs';
import * as D from './lib-w312a-decay.mjs';
import * as E from './lib-w347e-spintorque.mjs';

export const LIB_VERSION = 'w352h-venusbal-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const D2R = Math.PI / 180;
const { dot, crs, nrm, scl, add, sub, unit } = RA.vec;
const isVec = (a) => Array.isArray(a) && a.length === 3 && a.every(fin);
const rel = (a, b) => nrm(sub(a, b)) / Math.max(nrm(b), 1e-300);
export const AS_YR = PS.ASYR;
export const AU = 1.495978707e11;

/* ───────── 宣言 ───────── */
export const DECL = Object.freeze({
  planets: Object.freeze(['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune']),
  dirs: Object.freeze(['Np', 'Nm', 'Gm', 'Gp']),
  dirLabels: PS.DECL.bgLabels,
  axes: Object.freeze(['eq', 'L', 'ecl']),
  axisLabels: Object.freeze({ eq: '等重み (eq)', L: '角運動量の重み (L)', ecl: '黄道の極 (ecl)', gal: '(銀河の向き —— 基準軸に依らない)' }),
  parts: Object.freeze(['S', 'MS']), mainPart: 'S', read: 'C2', den: 'out',
  /** 釣り合いの点の距離の格子(AU) */
  rGridAU: Object.freeze([0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.2, 1.5, 2]),
  /** ほかの源(受け手 = 金星) */
  others: Object.freeze(['Earth', 'Jupiter', 'Mercury']), othParts: Object.freeze(['S', 'M']), nSyn: 72,
  /** 仮の値の台帳の鍵(第352便b —— ここに無い数は使わない) */
  provKeys: Object.freeze(['venus.spin.period', 'venus.resonance.period', 'venusEarth.synodic']),
  /** 統括の数え直し 1(共通ブリーフ・枝のブリーフ)の点検の数 */
  anchor: Object.freeze({ uV: 1.19282e-12, uVms: 25.4221, venusNpEqRes: 0.010, venusNpCombAsYr: 7.09e-17, venusBgAsYr: 7.06e-15, venusGmCombAsYr: 7.23e-15,
    combOverBg: Object.freeze({ Earth: 0.63, Mars: 0.89, Mercury: 5.5 }), lonShift: 0.513 }),
  parallel: 1e-12,
  judge: '丸めの桁の床: 打ち消しで小さくなる量は差で作らず角から直接に数える・角は 1e-9° 以下を 0 と書く',
});

/* ───────── 背景と打ち消し ───────── */
/** 倍率 1 の背景の大きさ b₁(rad/s —— 第351便e の bgTerm の大きさ = ω_G) */
export const b1 = () => nrm(BB.bgTerm('Venus', { u: 1 }).vec);
/** 背景の単位の向き(第352便d の bgDir —— (N±) の軸は引数) */
export function bgUnit(dir, axis) {
  if (!DECL.dirs.includes(dir)) throw new RangeError('bgUnit: 背景の向きは ' + DECL.dirs.join('・'));
  return PS.bgDir(dir, dir === 'Np' || dir === 'Nm' ? { axis } : {});
}
/**
 * 打ち消しの閉じた形。S(rad/s)・b̂(単位)・b₁ → { uMag, uMin(打ち消さないなら null), cancels, phiDeg, resMag(合成 ÷ 背景 at uMag), resMin(at uMin), minOverMag, resMinOverS }。
 * mut(変異): 'noHalf'(2 sin φ を使う)・'cosSign'(uMin の符号を逆)
 */
export function cancelOf(S, bHat, bOne, { mut = null } = {}) {
  if (!(isVec(S) && isVec(bHat) && nrm(bHat) > 0 && fin(bOne) && bOne > 0)) throw new RangeError('cancelOf: S・b̂・b₁ > 0');
  const sm = nrm(S); if (!(sm > 0)) throw new RangeError('cancelOf: S の大きさ 0');
  const sh = scl(S, 1 / sm), bh = unit(bHat), c = -dot(sh, bh), sn = nrm(crs(sh, bh)), phi = Math.atan2(sn, c);
  const uMag = sm / bOne, proj = mut === 'cosSign' ? dot(bh, S) : -dot(bh, S), cancels = proj > 0;
  const uMin = cancels ? proj / bOne : null;
  return { uMag, uMin, cancels, phiDeg: phi / D2R, resMag: mut === 'noHalf' ? 2 * Math.sin(phi) : 2 * Math.sin(phi / 2), resMin: cancels && c > 0 ? sn / c : null,
    minOverMag: cancels ? uMin / uMag : null, resMinOverS: cancels ? sn : null };
}
/** 合成 ÷ 背景を直接に(倍率 u・b̂)—— 照合用(大きい数の差) */
export const resDirect = (S, bHat, bOne, u) => nrm(add(S, scl(unit(bHat), u * bOne))) / (u * bOne);
/** 閉じた形の向き: −Ŝ の予想 = unit(3 (ŝ☉·n̂) n̂ − ŝ☉) */
export function sDirClosed(sunHat, nHat) {
  if (!(isVec(sunHat) && isVec(nHat))) throw new RangeError('sDirClosed: ベクトル');
  const s = unit(sunHat), n = unit(nHat); return unit(sub(scl(n, 3 * dot(s, n)), s));
}
/** 小角の式の φ(°)= abs((3 n̂ − ŝ☉) ÷ 2 − b̂) を rad として */
export function phiSmallDeg(sunHat, nHat, bHat) { return nrm(sub(scl(sub(scl(unit(nHat), 3), unit(sunHat)), 0.5), unit(bHat))) / D2R; }

/** 1 つの惑星の局所の太陽由来の成分(第351便e の localOf —— (C2)・分母 out・k)と自転軸・公転の法線 */
export function localSun(T1, GEO, id, { k = 1 } = {}, cache = null) {
  const L = BB.localOf(T1, GEO, id, 'Sun', { read: DECL.read, den: DECL.den, k }, cache);
  return { S: L.sun.S, MS: L.sun.MS, M: L.sun.M, sHat: unit(L.sHat), nHat: unit(L.nHat) };
}
/** 1 行: 惑星 id × 成分 part × 背景の向き dir × 基準軸 axis(名 —— G± は 'gal') */
export function cancelRow(T1, GEO, id, { part = 'S', dir, axis = 'eq', k = 1, AX = null } = {}, cache = null) {
  if (!DECL.parts.includes(part)) throw new RangeError('cancelRow: 成分は S・MS');
  const ax = AX || RA.refAxes(T1, GEO), L = localSun(T1, GEO, id, { k }, cache), isN = dir === 'Np' || dir === 'Nm';
  if (isN && !DECL.axes.includes(axis)) throw new RangeError('cancelRow: (N±) の基準軸は eq・L・ecl');
  const bh = bgUnit(dir, isN ? ax[axis] : null), bo = b1(), c = cancelOf(L[part], bh, bo), sun = unit(GEO['Earth|Sun'].s);
  const closed = part === 'S' ? { dirErrDeg: RA.angDeg(scl(L.S, -1), sDirClosed(sun, L.nHat)), phiClosedDeg: RA.angDeg(sDirClosed(sun, L.nHat), bh), phiSmallDeg: phiSmallDeg(sun, L.nHat, bh) } : null;
  return { id, part, dir, axis: isN ? axis : 'gal', k, ...c, closed, sMagAsYr: nrm(L[part]) * AS_YR, bHat: bh };
}

/* ───────── 釣り合いの点(T3)───────── */
/** 試しの受け手の入力(第352便e の rotOf が読む形): 金星の質量・公転の法線 = 自転軸 = axis・源 = 太陽(自転軸・自転の率は金星|太陽の組と同じ)・距離 r [m] */
export function testInput(T1, GEO, axis, r) {
  if (!(isVec(axis) && nrm(axis) > 0 && fin(r) && r > 0)) throw new RangeError('testInput: 軸・距離 > 0');
  const P = SP.pairInput(T1, GEO, 'Venus', 'Sun'), a = unit(axis);
  return { ...P, nHat: a, sHat: a, a: r, vOrb: Math.sqrt(P.beta * P.a / r) * 2.99792458e8, made: '金星|太陽の組の入力・道と自転軸を基準軸に・距離 r' };
}
/** 試しの受け手の (S)(rad/s・(C2))*/
export const testS = (T1, GEO, axis, r) => SR.rotOf(testInput(T1, GEO, axis, r), { part: 'S', read: DECL.read }).Om;
/** 距離 r の合成 ÷ 背景・合成と b̂ の角・合成と −Ŝ の角(背景は大きさ B [rad/s]・向き b̂) */
export function scanAt(T1, GEO, axis, r, bHat, B) {
  const S = testS(T1, GEO, axis, r), sm = nrm(S), bh = unit(bHat), Om = add(S, scl(bh, B));
  return { rAU: r / AU, sMag: sm, sOverB: sm / B, combOverB: nrm(Om) / B, angToBg: RA.angDeg(Om, bh), angToS: RA.angDeg(Om, S), phiDeg: RA.angDeg(scl(S, -1), bh) };
}
/** (イ) の条件 −b̂·S(r) = B を満たす r(二分 —— 対数の距離で)。無ければ null */
export function rStar(T1, GEO, axis, bHat, B, { lo = 0.05 * AU, hi = 50 * AU, iter = 80 } = {}) {
  const g = (r) => -dot(unit(bHat), testS(T1, GEO, axis, r)) - B;
  let gl = g(lo), gh = g(hi); if (!(gl > 0 && gh < 0)) return null;
  let a = Math.log(lo), b = Math.log(hi);
  for (let i = 0; i < iter; i++) { const m = 0.5 * (a + b), gm = g(Math.exp(m)); if (gm > 0) a = m; else b = m; }
  return Math.exp(0.5 * (a + b));
}

/* ───────── ほかの源(T4)───────── */
const GL = H.gaussLegendre(SP.DECL.ballN);
/** 1 つの配置の回転(rad/s): 受け手(質量 m・原点・相対の速度 v)・源(質量 Ms・位置 p・自転のベクトル spin・静止)。read 'C2'(球の半径の平均)・'W'。extraW は分母だけ */
export function pointRot({ m, v, Ms, p, spin, read = 'C2', extraW = 0, Rs = null }) {
  if (!(fin(m) && m > 0 && fin(Ms) && Ms >= 0 && isVec(v) && isVec(p) && isVec(spin))) throw new RangeError('pointRot: 入力');
  const Rr = G3.YK * m, R2 = Rs === null ? G3.YK * Ms : Rs;
  const radii = read === 'W' ? [[Rr, 1]] : GL.x.map((xi, i) => { const rho = 0.5 * Rr * (xi + 1); return [SC.equivR(Rr, rho), 0.5 * Rr * GL.w[i] * 5 * Math.pow(rho, 4) / Math.pow(Rr, 5)]; });
  let Om = [0, 0, 0];
  for (const [Ri, wt] of radii) {
    const f = G3.makeField3({ sources: [{ m: Ms, R: R2, p, v: [0, 0, 0], spin }], recv: { m, R: Ri, p: [0, 0, 0], v }, W0: 0, extraW, kernel: { kind: 'ball', al: 1 }, rot: { form: 'M' }, self: true });
    Om = add(Om, scl(G3.rot3('W', f, [0, 0, 0], { Rb: Ri }), read === 'W' ? 1 : wt));
  }
  return Om;
}
/** 会合の位相ごとの源 src の項(受け手 = 金星)。戻り値 { inf(位相 0 = 源と金星が太陽から同じ向き), sup(位相 π), mean(ベクトルの平均), meanMag(大きさの平均), dInf, dSup }(各 { S, M } [3]・rad/s) */
export function otherSrc(T1, GEO, src, { nSyn = DECL.nSyn, sunW = true } = {}) {
  if (!DECL.planets.includes(src) || src === 'Venus') throw new RangeError('otherSrc: 源は金星以外の惑星');
  const V = SP.pairInput(T1, GEO, 'Venus', 'Sun'), Q = SP.pairInput(T1, GEO, src, 'Sun'), r2 = T1.find((r) => r.id === src && r.src === 'Sun' && r.mag === 'm2');
  const n = V.nHat, x0 = crs(n, [0, 0, 1]), x = nrm(x0) > 1e-9 ? unit(x0) : [1, 0, 0], y = crs(n, x), spinV = scl(unit(GEO[src + '|Sun'].w), r2.omega);
  const extraW = sunW ? V.Ms * D.Kball(1, V.a, G3.YK * V.Ms) : 0;
  const at = (ph) => { const eh = add(scl(x, Math.cos(ph)), scl(y, Math.sin(ph))), th = add(scl(x, -Math.sin(ph)), scl(y, Math.cos(ph)));
    const p = sub(scl(eh, Q.a), scl(x, V.a)), v = sub(scl(y, V.vOrb), scl(th, Q.vOrb));
    return { d: nrm(p), S: pointRot({ m: V.m, v: [0, 0, 0], Ms: Q.m, p, spin: spinV, extraW }), M: pointRot({ m: V.m, v, Ms: Q.m, p, spin: [0, 0, 0], extraW }) }; };
  const inf = at(0), sup = at(Math.PI);
  let mS = [0, 0, 0], mM = [0, 0, 0], aS = 0, aM = 0;
  for (let j = 0; j < nSyn; j++) { const q = at(2 * Math.PI * (j + 0.5) / nSyn); mS = add(mS, scl(q.S, 1 / nSyn)); mM = add(mM, scl(q.M, 1 / nSyn)); aS += nrm(q.S) / nSyn; aM += nrm(q.M) / nSyn; }
  return { src, inf: { S: inf.S, M: inf.M }, sup: { S: sup.S, M: sup.M }, mean: { S: mS, M: mM }, meanMag: { S: aS, M: aM }, dInf: inf.d, dSup: sup.d, extraW };
}

/* ───────── 地球との共鳴の算術(T5 —— 仮の値)───────── */
/**
 * 自転周期 spinDays(正の数)・逆行 retro・金星と地球の公転の周期(日)→ 会合周期・太陽日・1 会合周期あたりの地球の向きに対する回転の数・
 * 内合ごとの地球を向く経度のずれ(°)・一巡の年数・共鳴の周期(m 回)。逆行では回転の数 = S ÷ P + S ÷ P_V。
 */
export function resonanceArith({ spinDays, retro = true, orbV, orbE, m = 5 }) {
  if (!(fin(spinDays) && spinDays > 0 && fin(orbV) && orbV > 0 && fin(orbE) && orbE > orbV)) throw new RangeError('resonanceArith: 周期 > 0・P_E > P_V');
  const S = PV.synodicOf(orbV, orbE), sg = retro ? 1 : -1, solar = 1 / (1 / spinDays + sg / orbV), turns = S / solar, frac = turns - Math.round(turns);
  const shiftDeg = frac * 360, cycleYr = shiftDeg === 0 ? Infinity : Math.abs(360 / shiftDeg) * S / 365.25, Pres = PV.resonancePeriod(S, orbV, m);
  return { S, solar, turns, nearest: Math.round(turns), frac, shiftDeg, cycleYr, Pres, dP: spinDays - Pres };
}

/* ───────── 零試験・変異 ───────── */
export function pureScenes(T1 = E.t1Table(), GEO = E.geometry()) {
  const cache = {}, AX = RA.refAxes(T1, GEO), bo = b1(), sun = unit(GEO['Earth|Sun'].s);
  // ① 統括の数え直し: (uV)・(MS) の倍率・(N+) eq の残り 1.0%・合成の率・背景の率・(G−) の合成
  const V = localSun(T1, GEO, 'Venus', {}, cache), uV = nrm(V.S) / bo, uVms = nrm(V.MS) / bo, ucm = BB.uEqMag(V.S, BB.bgTerm('Venus', { u: 1 }).vec);
  const npV = cancelRow(T1, GEO, 'Venus', { dir: 'Np', axis: 'eq', AX }, cache), gmV = cancelRow(T1, GEO, 'Venus', { dir: 'Gm', AX }, cache);
  const bgAs = uV * bo * AS_YR, npComb = npV.resMag * bgAs, gmComb = gmV.resMag * bgAs;
  const direct = resDirect(V.S, npV.bHat, bo, uV);
  const cob = Object.fromEntries(['Earth', 'Mars', 'Mercury'].map((id) => [id, resDirect(localSun(T1, GEO, id, {}, cache).S, npV.bHat, bo, uV)]));
  const anc = { uV, uVms, ucm, npRes: npV.resMag, npDirect: direct, npComb, bgAs, gmComb, cob, uVd: PS.uVenus(T1, GEO, { part: 'S' }, cache) };
  // ② 反平行なら残り 0・直交なら uMin 無し・平行なら打ち消さない・閉じた形の残りと直接の照合(格子)
  const z = [0, 0, 1], anti = cancelOf([0, 0, -3e-20], z, 1e-20), orth = cancelOf([2e-20, 0, 0], z, 1e-20), par = cancelOf([0, 0, 5e-20], z, 1e-20);
  let vsDirect = 0;
  for (const deg of [0.3, 2, 10, 45, 80]) { const S = scl([Math.sin(deg * D2R), 0, -Math.cos(deg * D2R)], 7e-20), c = cancelOf(S, z, 1e-20);
    vsDirect = Math.max(vsDirect, Math.abs(c.resMag / resDirect(S, z, 1e-20, c.uMag) - 1), Math.abs(c.resMin / resDirect(S, z, 1e-20, c.uMin) - 1), Math.abs(c.minOverMag - Math.cos(deg * D2R))); }
  // ③ 閉じた形の向き: 8 惑星の −Ŝ と unit(3 (ŝ☉·n̂) n̂ − ŝ☉) の角の最大
  let closedMax = 0; for (const id of DECL.planets) { const L = localSun(T1, GEO, id, {}, cache); closedMax = Math.max(closedMax, RA.angDeg(scl(L.S, -1), sDirClosed(sun, L.nHat))); }
  // ④ 試しの受け手の (S): 赤道面(道の法線 = 太陽の自転軸)・(W) で第351便c の closedSEq と同じ・距離の −3 乗
  const P0 = { ...SP.pairInput(T1, GEO, 'Venus', 'Sun') }; P0.nHat = sun; P0.sHat = sun;
  const w0 = SR.rotOf(P0, { part: 'S', read: 'W' }), cs = SP.closedSEq({ A: P0.m * D.Kball(1, 0, G3.YK * P0.m), mj: P0.Ms, Rj: G3.YK * P0.Ms, r: P0.a });
  const closedS = Math.abs(nrm(w0.Om) / (Math.abs(cs) * P0.ws) - 1), eqAnti = dot(unit(w0.Om), sun);
  const s1 = nrm(testS(T1, GEO, AX.eq, 0.5 * AU)), s2 = nrm(testS(T1, GEO, AX.eq, 1.0 * AU)), slope = Math.log(s2 / s1) / Math.log(2);
  // ⑤ pointRot は第352便e の rotOf と同じ(1 つの位相 —— 金星|太陽の (S)・(M) を pointRot で作り直す: 位相 72 の平均)
  const PVn = SP.pairInput(T1, GEO, 'Venus', 'Sun');
  let vsRot = 0;
  for (const part of ['S', 'M']) {
    const x0 = crs(PVn.sAx, PVn.nHat), x = unit(x0), y = crs(PVn.nHat, x); let acc = [0, 0, 0];
    for (let j = 0; j < 72; j++) { const ph = 2 * Math.PI * (j + 0.5) / 72, rh = add(scl(x, Math.cos(ph)), scl(y, Math.sin(ph))), vh = crs(PVn.nHat, rh);
      acc = add(acc, scl(pointRot({ m: PVn.m, v: part === 'M' ? scl(vh, PVn.vOrb) : [0, 0, 0], Ms: PVn.Ms, p: scl(rh, -PVn.a), spin: part === 'S' ? scl(PVn.sAx, PVn.ws) : [0, 0, 0] }), 1 / 72)); }
    vsRot = Math.max(vsRot, rel(acc, SR.rotOf(PVn, { part, read: 'C2' }).Om));
  }
  // ⑥ 源の質量 0 で 0・自転 0 で (S) 0
  const m0 = nrm(pointRot({ m: PVn.m, v: [1e3, 0, 0], Ms: 0, p: [1e11, 0, 0], spin: [0, 0, 1e-5], Rs: 1 })), sp0 = nrm(pointRot({ m: PVn.m, v: [0, 0, 0], Ms: 6e24, p: [1e11, 0, 0], spin: [0, 0, 0] }));
  // ⑦ 共鳴の算術: 統括の点検(仮の自転周期で 0.513°)・共鳴の周期で 0・第352便b の resonancePeriod と同じ
  const oV = PV.repoRef('repo.orbitDays.venus'), oE = PV.repoRef('repo.orbitDays.earth');
  const ra = resonanceArith({ spinDays: PV.provValue('venus.spin.period'), orbV: oV, orbE: oE }), rz = resonanceArith({ spinDays: ra.Pres, orbV: oV, orbE: oE });
  const res = { shift: ra.shiftDeg, zero: Math.abs(rz.shiftDeg), presVsB: Math.abs(ra.Pres - PV.resonancePeriod(PV.synodicOf(oV, oE), oV)), turns: ra.turns };
  // 変異
  const S0 = scl([Math.sin(3 * D2R), 0, -Math.cos(3 * D2R)], 1), muts = { noHalf: Math.abs(cancelOf(S0, z, 1, { mut: 'noHalf' }).resMag / resDirect(S0, z, 1, 1) - 1) > 0.5,
    cosSign: cancelOf(S0, z, 1, { mut: 'cosSign' }).cancels === false };
  const rej = [() => cancelOf([0, 0, 0], z, 1), () => cancelOf([1, 0, 0], [0, 0, 0], 1), () => cancelOf([1, 0, 0], z, 0), () => bgUnit('Xx', z), () => cancelRow(T1, GEO, 'Venus', { part: 'M', dir: 'Np' }),
    () => cancelRow(T1, GEO, 'Venus', { dir: 'Np', axis: 'La' }), () => testInput(T1, GEO, z, 0), () => otherSrc(T1, GEO, 'Venus'), () => resonanceArith({ spinDays: 243, orbV: 400, orbE: 365 }), () => pointRot({ m: 0, v: z, Ms: 1, p: z, spin: z })]
    .map((fn) => { try { fn(); return false; } catch (e) { return e instanceof RangeError; } });
  return { anc, anti, orth, par, vsDirect, closedMax, closedS, eqAnti, slope, vsRot, m0, sp0, res, muts, rejects: rej };
}
const p3 = (x, w) => Number(Number(x).toPrecision(3)) === Number(Number(w).toPrecision(3));
const p2 = (x, w) => Number(Number(x).toPrecision(2)) === Number(Number(w).toPrecision(2));
export function pureGates(S) {
  const A = DECL.anchor, a = S.anc;
  return {
    anchorUV: Number(a.uV.toPrecision(6)) === A.uV && Math.abs(a.uVms - A.uVms) < 5e-5 && Math.abs(a.ucm / a.uV - 1) < 1e-12 && Math.abs(a.uVd / a.uV - 1) < 1e-12,
    anchorCancel: Number(a.npRes.toFixed(3)) === A.venusNpEqRes && Math.abs(a.npDirect / a.npRes - 1) < 1e-9 && p3(a.npComb, A.venusNpCombAsYr) && p3(a.bgAs, A.venusBgAsYr) && p3(a.gmComb, A.venusGmCombAsYr),
    anchorRatio: Object.entries(A.combOverBg).every(([id, w]) => p2(a.cob[id], w)),
    antiZero: S.anti.cancels && S.anti.resMag === 0 && S.anti.resMin === 0 && Math.abs(S.anti.uMin - 3) < 1e-12 && Math.abs(S.anti.uMag - 3) < 1e-12,
    orthNone: S.orth.uMin === null && !S.orth.cancels && Math.abs(S.orth.phiDeg - 90) < 1e-12 && S.par.uMin === null && Math.abs(S.par.phiDeg - 180) < 1e-12,
    closedVsDirect: S.vsDirect < 1e-9,
    closedDir: S.closedMax < 1e-5,
    closedSEq: S.closedS < 1e-9 && S.eqAnti < -0.999999 && Math.abs(S.slope + 3) < 1e-3,
    pointRot: S.vsRot < 1e-12 && S.m0 === 0 && S.sp0 === 0,
    resonance: Number(S.res.shift.toFixed(3)) === A.lonShift && S.res.zero < 1e-9 && S.res.presVsB < 1e-12 && Math.round(S.res.turns) === 5,
    mutants: S.muts.noHalf && S.muts.cosSign,
    rejects: S.rejects.length === 10 && S.rejects.every(Boolean),
  };
}
