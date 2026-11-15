// 第338便d(原仮定者の指示(2026-11-15 —— 第139報)・原仮定者の回答(2026-11-15 —— 第138報の回答 4)AN742「土星の輪が先。木星と天王星は、土星程にはクッキリしていないので、参考」・
//   原仮定者の回答(2026-11-15 —— 第138報の回答 3)AN736・AN737・探索の方針(第138報)・統括の検証項目 R352):
//   **回転引きずり: 土星の環を先に —— 5 つの純関数の組**
//   T1 一様厚みの絶対値を同じ帳簿で(帯の幅・釣り合いの高さ・率が半径に依らない型・鉛直の減衰と乱しの釣り合い・粒子の大きさの床・自己重力の床 —— D〜F 環の半径の格子)/
//   T2 環の中のやり取りの収支(半径の輪の列 —— 回転引きずりのトルク・粘性の型で輪の間に運ぶ角運動量・境界・土星へ返る分・熱になる分)/
//   T3 4 天体から潮汐の分を積んだ残り(既存の潮汐の lib `ctlPair` を呼ぶ —— k₂/Q は自由)/T4 5 つ目の天体(公転 ÷ 源の自転が ½〜1)/
//   T5 ジャイロの直交を高さ則 T1 の捩れの率と第337便i の鉛直の場に当てる・扁平率のべきと環の厚み
//   (器 tests/exp-w338d-ringbook.mjs と QA behavior.ringbook338d・docs.ringbook338d が読む —— html を読まない・状態を持たない・第337便i・j・k と第292便d の lib は呼ぶだけ・エンジンの式を写さない)。
//
// ■ 区別: 回転引きずり(源の回転による空間の捩れ —— 源の引きずり半径 R_d〔扁平の則の R_eq〕が効く)・並進引きずり(本 lib では出さない)・軸引きずり(本 lib では出さない)・
//   潮汐(T3 と T4 で既存の lib の式で積む —— 担い手を決めない)。表は「候補」「探索」「未較正」「このノブの組では」。
// ■ 記号: n = 公転の角速度・ν_z = 鉛直の振動数(J₂ を入れない読みで n と同じ)・ν_ep = 周転円の振動数(同じ読みで n)・σ_z = 鉛直の速度の散らばり・Γ_d = 回転引きずりが鉛直の振幅を減らす率・
//   P = 乱しの加熱の率(単位の質量あたり m²/s³)・Σ = 面密度・τ = 光学的厚さ・d_p = 粒子の直径・ν = 粘性(動粘性 m²/s)・ℓ = √(G m r)(単位の質量の角運動量)。
// ■ 言わないこと: 環の厚みの値を決めたとは書かない(このノブの組で何 m の桁か・要るノブまで)。環の中のやり取りで外からのトルクが消えるとは書かない(消えないことを帳簿で読む)。
//   潮汐の残りを回転引きずりの寄与とは書かない(k₂/Q が自由・文献の値が未照合)。5 つ目の天体の観測の値はこの環境の記録に無い(予測だけ)。
import { sourceOf as sourceOfK, recvSysOf, sizeFactor, baseRatio, t1Set, ringRows, corrections, orthRow, SAT4, RINGS, LIT as LITK } from './lib-w337k-gyrodrag.mjs';
import { recvSys, dampRigEffect, t2Closed, obsDlnA, nOverS, rSyncOf, bandWidthH, zEqualHeight, LIT as LITJ, ringRow, pointsOf, rdOf, G, YR } from './lib-w337j-spinorbit.mjs';
import { effectOfSpec, ringSys } from './lib-w337i-rotring.mjs';
import { ctlPair } from './lib-w292d-tide.mjs';

export const LIB_VERSION = 'w338d-ringbook-lib-1';
const isFin = Number.isFinite;
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const scl = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
const pw = (x, p) => Math.exp(p * Math.log(x));   // 本 lib の中の非整数のべき(exp と log —— Node の版で末尾の bit が揃う関数)

/* ───────── 宣言(走らせた格子と判定の物差しの記録 —— 式の形の宣言ではない)───────── */
export const SETS = Object.freeze(['half', 'one']);   // 第337便k の主の組(χ ½・χ 1 —— 4 天体の連続の解・R_eq・半径の読み・速さ s)
export const DECL = Object.freeze({
  /** 4 天体で決めた強さの組(第337便k の t1Set を呼んで作り直す —— 写しを持たない) */
  k4: Object.freeze({ speed: 'obs', base: 'Req', size: 'R', chi: Object.freeze({ half: 0.5, one: 1 }) }),
  /** T1: D〜F 環の半径の格子・一様の物差し(局所のべき |d ln H/d ln r| ≤ 0.1)・典型の厚み 10 m(文献の値・未照合 —— 「同じ桁」= ⅓〜3 倍・採否は言い切らない)・
   *  床のノブ(粒子の直径 d_p〔第337便i の宣言の半径 1 m の 2 倍〕・σ_z = k_d n d_p の k_d)・自己重力の床(Toomre の Q_T・σ_z/σ_r の k_g)・衝突の頻度 ω_c = k_c n τ・
   *  鉛直の減衰の率 Γ_d の 3 つの読み(物差しの率 1/1e7 年・4 天体の強さの組の傾きの率・第337便i の鉛直へ寄せる場の要る λ の率) */
  t1: Object.freeze({ rMinKm: 66900, rMaxKm: 140180, nGrid: 74, uniformPow: 0.1, ref10m: 10, sameOrder: Object.freeze([1 / 3, 3]),
    dp: 2, kd: Object.freeze([1, 2.5]), QT: 2, kg: 1, kc: 3, gammas: Object.freeze(['yard', 'k4half', 'focus337i']), tYardYr: 1e7,
    focus337i: Object.freeze({ prof: 'slice', action: 'focus', reading: 'Req', speed: 'obs', lambda: 6.5606e-7, zMax: 10 }),
    ringCenters: Object.freeze(['ringD', 'ringC', 'ringB', 'ringA', 'ringF']), refRings: Object.freeze(['jupiterMain', 'uranusEps']) }),
  /** T2: 半径の輪の列(主の帯 D〜A を nMain 本・F 環を nF 本 —— F 環は A 環とつながない)・粘性 ν の格子・時間の終わり・節目・1 步の ln r の変化の上限・粘性の步の安全率・外へ出る半径(F 環の 2 倍)・
   *  帳簿の閉じの物差し(角運動量とエネルギーの残り ≤ 1e-9 × 初めの量 —— 値は正本に書かない)・漂いの物差し(第337便i・k の宣言と同じ 1e-5) */
  t2: Object.freeze({ nMain: 96, nF: 2, nuGrid: Object.freeze([1e-3, 1e-2, 1e-1, 1]), nuMain: 1e-2, tEndYr: 1e7, checkYr: Object.freeze([1e3, 1e4, 1e5, 1e6, 1e7]),
    dlnStep: 1e-3, viscCfl: 0.25, outerExit: 2, closeTol: 1e-9, drift: 1e-5,
    cases: Object.freeze([
      Object.freeze({ key: 'nuOnly', set: 'half', strength: 'zero', nu: 1e-2 }),
      Object.freeze({ key: 'dragOnlyHalf', set: 'half', strength: 'k4', nu: 0 }),
      Object.freeze({ key: 'dragOnlyOne', set: 'one', strength: 'k4', nu: 0 }),
      ...[1e-3, 1e-2, 1e-1, 1].map((nu) => Object.freeze({ key: 'k4Half|nu' + nu, set: 'half', strength: 'k4', nu })),
      ...[1e-3, 1e-2, 1e-1, 1].map((nu) => Object.freeze({ key: 'k4One|nu' + nu, set: 'one', strength: 'k4', nu })),
      Object.freeze({ key: 'epsHalf', set: 'half', strength: 'eps', nu: 1e-2 }),
      Object.freeze({ key: 'epsOne', set: 'one', strength: 'eps', nu: 1e-2 }),
      Object.freeze({ key: 'epsHalfNu0', set: 'half', strength: 'eps', nu: 0 }),
    ]) }),
  /** T3: k₂/Q の格子(潮汐の分 —— 自由)・強さの倍 f(4 天体の強さの組の λ に掛ける) */
  t3: Object.freeze({ k2qGrid: Object.freeze([1e-5, 1e-4, 1e-3, 1e-2, 1e-1]), fGrid: Object.freeze([1, 0.5, 0.1]) }),
  /** T4: 受け手(公転 ÷ 源の自転が ½〜1 の候補)・見える量の物差し(宣言 —— 20 年で公転の向きの位置のずれ ≥ 1 km を「見分けの候補」) */
  t4: Object.freeze({ bodies: Object.freeze(['deimos', 'amalthea', 'thebe', 'pan', 'daphnis', 'atlas', 'prometheus', 'pandora', 'janus', 'ringAedge', 'puck', 'mab', 'proteus']), baseYr: 20, driftKm: 1 }),
  /** T5: 受け手(環 5・衛星 4)・直交の係数 1・環の物差し 1e7 年・扁平率のべき・源 */
  t5: Object.freeze({ recv: Object.freeze(['ringD', 'ringC', 'ringB', 'ringA', 'ringF', 'phobos', 'moon', 'titan', 'triton']), c: 1, tThinYr: 1e7, kPow: Object.freeze([0, 1, 2]),
    hosts: Object.freeze(['saturn', 'jupiter', 'uranus', 'neptune']), rOverR: 2, iRad: 1e-5 }),
  /** 丸めの残り・O(e²) の残り(受け手の離心率 1e-4 —— 第337便j の recvSys の既定 —— の 2 乗の 10 倍)を 0 と書く床(同じ単位の尺度に対して)—— 正本の meta にも書く */
  snap: Object.freeze({ round: 1e-12, ecc2: 1e-7 }),
});

/* ───────── 文献の値(本環境では未照合 —— 出典の名と確かさ)───────── */
export const LIT = Object.freeze({
  note: '文献の値・未照合(この環境から一次資料のサイトに届かない —— 出典の名と値は記憶の値とリポジトリの中の値〔第337便j・k の LIT〕の写し)',
  /** 土星の環の区分(内縁・外縁 [km])と面密度 Σ [kg/m²]・光学的厚さ τ(τ は第337便k の LIT.tau) */
  regions: Object.freeze([
    Object.freeze({ key: 'ringD', r0: 66900, r1: 74510, sigma: 0.01, tau: 1e-3 }),
    Object.freeze({ key: 'ringC', r0: 74510, r1: 92000, sigma: 10, tau: 0.1 }),
    Object.freeze({ key: 'ringB', r0: 92000, r1: 117580, sigma: 1000, tau: 2 }),
    Object.freeze({ key: 'ringCD', r0: 117580, r1: 122170, sigma: 10, tau: 0.1 }),
    Object.freeze({ key: 'ringA', r0: 122170, r1: 136775, sigma: 400, tau: 0.5 }),
    Object.freeze({ key: 'ringF', r0: 140130, r1: 140230, sigma: 50, tau: 0.5 }),
  ]),
  regionsSrc: '環の縁の半径は Esposito 2002 Rep. Prog. Phys. 65, 1741 の表の桁(D 環の内縁 66 900 km・F 環の芯 140 180 km は第337便i・j の LIT と同じ)・Σ は Esposito 2002・Cuzzi et al. 2010 Science 327, 1470 の環ごとの桁(B 環 500〜2000・A 環 300〜600・C 環とカッシーニの間隙 5〜20 の中央の桁・D 環は塵の環で宣言の小さい値・F 環の芯は宣言)—— 記憶の値・文献の値・未照合・確かさ 低(桁)',
  ringMass: 1.54e19, ringMassSrc: 'Iess et al. 2019 Science 364, eaat2965(環の全質量 1.54e19 kg の桁)—— 記憶の値・文献の値・未照合・確かさ 中',
  nuRing: 1e-2, nuRingSrc: 'A 環の粘性 ν ≈ 1e-2 m²/s の桁(密度波の減衰から —— Tiscareno et al. 2007 Icarus 189, 14 の桁)—— 記憶の値・文献の値・未照合・確かさ 低',
  /** 参考の列の環(物差しにしない —— AN742) */
  refRings: Object.freeze({
    jupiterMain: Object.freeze({ host: 'jupiter', rKm: 125750, sigma: 1e-5, tau: 1e-6, H: 30000, kind: '上限', note: '塵の環(衝突が少ない —— 床の型は当てない)' }),
    uranusEps: Object.freeze({ host: 'uranus', rKm: 51149, sigma: 25, tau: 1, H: 150, kind: '上限', note: '狭い環(粒子 cm〜m)' }),
  }),
  refRingsSrc: '木星の主環の半径 122 500〜129 000 km の中央・τ 1e-6 の桁・厚みの上限 < 30 km は第337便j の LIT(Ockert-Bell et al. 1999 Icarus 138, 188)・天王星の ε 環の半径 51 149 km・τ 0.5〜2.3・厚みの上限 約 150 m は第337便j の LIT(Lane et al. 1986)・Σ はどちらも記憶の値の桁 —— 文献の値・未照合・確かさ 低',
  /** 潮汐の k₂/Q の記憶の値(その公転の観測から推した値を含む —— 残りは作り方から 0 に近い) */
  k2q: Object.freeze({ mars: 1.7e-3, earth: 2.5e-2, saturn: 1.59e-4, neptune: 1.2e-6, neptuneHi: 3.4e-5, jupiter: 1.1e-5, uranus: 1e-5 }),
  k2qSrc: '火星 k₂ 0.169(Konopliv et al. 2016)÷ Q 99.5(Jacobson & Lainey 2014 —— フォボスの公転から推した値)・地球 k₂ 0.30 ÷ 実効の Q 約 12(月のレーザー測距から推した値)・土星 1.59e-4(Lainey et al. 2017 —— 内側の衛星の位置から)・海王星 Q 1.2e4〜3.3e5 × k₂ 0.41(Banfield & Murray 1992 の範囲)・木星 1.1e-5(Lainey et al. 2009 —— イオから)・天王星 Q > 1e4 の桁 —— 記憶の値・文献の値・未照合・確かさ 低',
  /** 5 つ目の候補の受け手(半長軸 [m]・源の赤道面に対する傾き [deg]・半径 [m]・質量 [kg]) */
  fifth: Object.freeze({
    deimos: Object.freeze({ name: 'ダイモス', host: 'mars', a: 23463.2e3, iDeg: 0.93, R: 6.2e3, m: 1.4762e15 }),
    amalthea: Object.freeze({ name: 'アマルテア', host: 'jupiter', a: 181366e3, iDeg: 0.374, R: 83.5e3, m: 2.08e18 }),
    thebe: Object.freeze({ name: 'テーベ', host: 'jupiter', a: 221889e3, iDeg: 1.076, R: 49.3e3, m: 4.3e17 }),
    pan: Object.freeze({ name: 'パン', host: 'saturn', a: 133584e3, iDeg: 0.0001, R: 14.1e3, m: 4.95e15 }),
    daphnis: Object.freeze({ name: 'ダフニス', host: 'saturn', a: 136505e3, iDeg: 0.0036, R: 3.8e3, m: 7.7e13 }),
    atlas: Object.freeze({ name: 'アトラス', host: 'saturn', a: 137670e3, iDeg: 0.003, R: 15.1e3, m: 6.6e15 }),
    prometheus: Object.freeze({ name: 'プロメテウス', host: 'saturn', a: 139380e3, iDeg: 0.007, R: 43.1e3, m: 1.6e17 }),
    pandora: Object.freeze({ name: 'パンドラ', host: 'saturn', a: 141720e3, iDeg: 0.050, R: 40.7e3, m: 1.37e17 }),
    janus: Object.freeze({ name: 'ヤヌス', host: 'saturn', a: 151460e3, iDeg: 0.165, R: 89.5e3, m: 1.9e18 }),
    ringAedge: Object.freeze({ name: 'A 環の外縁の粒子', host: 'saturn', a: 136775e3, iDeg: null, R: 1, m: null }),
    puck: Object.freeze({ name: 'パック', host: 'uranus', a: 86004e3, iDeg: 0.32, R: 81e3, m: 1.9e18 }),
    mab: Object.freeze({ name: 'マブ', host: 'uranus', a: 97736e3, iDeg: 0.13, R: 12e3, m: 1e14 }),
    proteus: Object.freeze({ name: 'プロテウス', host: 'neptune', a: 117647e3, iDeg: 0.524, R: 210e3, m: 4.4e19 }),
  }),
  fifthSrc: 'NASA NSSDC の衛星の表と JPL の平均の要素の記憶の値(半長軸・傾き・平均の半径・質量 —— ダイモスとパンは第337便j の LIT と同じ値・A 環の外縁は Esposito 2002 の桁・粒子は第337便i の宣言の半径 1 m)—— 文献の値・未照合・確かさ 中(質量は 低)',
  fifthObs: '公転の変化(永年の加速・半長軸の率)の測定値はこの環境の記録に無い(未収載)—— 観測なし・予測だけ。プロメテウスとパンドラの位置の不規則なずれ(両者の相互作用)は永年の率ではない —— 記憶の記述・未照合',
  /** 4 天体の観測の由来の注(第337便j の LIT.orbitObs の読み) */
  obsNote: 'トリトンの値は観測ではなく潮汐の見積り(Chyba et al. 1989 —— ロッシュ限界までの時間)・フォボス・月・タイタンの値から推した k₂/Q は同じ観測を使う —— 確かさは第337便j の LIT のとおり',
});

/* ───────── 共通 ───────── */
export const snapZero = (x, scale, floor) => (isFin(x) && isFin(scale) && Math.abs(x) <= floor * Math.abs(scale) ? 0 : x);
export const srcOf = (key) => sourceOfK(key);
export const nOf = (src, r) => Math.sqrt(G * src.m / (r * r * r));
export function regionAt(rKm) { const R = LIT.regions.find((g) => rKm >= g.r0 && rKm <= g.r1); return R || null; }
export const centerKm = (key) => (key === 'ringF' ? 140180 : (() => { const R = LIT.regions.find((g) => g.key === key); return 0.5 * (R.r0 + R.r1); })());

/** 4 天体の強さの組(第337便k の t1Set の連続の解 —— χ ½・1)と環の補正の集まりの係数(第337便k の corrections の collOne) */
export function k4Sets() {
  const out = {};
  for (const k of SETS) {
    const chi = DECL.k4.chi[k], t = t1Set({ chi, speed: DECL.k4.speed, base: DECL.k4.base, size: DECL.k4.size }), f = t.fitQP;
    const spec = { chi, speed: DECL.k4.speed, base: DECL.k4.base, size: DECL.k4.size }, rows = ringRows({ ...spec, q: f.q, p: f.p, lambda: f.lambda }), cor = corrections(rows, { p: f.p, size: DECL.k4.size }, spec);
    out[k] = { chi, q: f.q, p: f.p, lambda: f.lambda, S: f.S, obsOverCalc: f.ratios, eps: cor.collOne };
  }
  return out;
}
/** 円に近い赤道の受け手の半長軸の率(第337便j の t2Closed の dampRig の閉じた式と同じ値 —— 本 lib では exp と log で: −2|s| g (1 − χ s/n)・g = (R_eq/R_obs)^q (R_obs/r)^q R^p) */
export function dlnAFast(src, r, set, Rrecv = 1) {
  const n = nOf(src, r), Kq = pw(baseRatio(src, DECL.k4.base) * src.Robs / r, set.q);
  return -2 * Math.abs(src.s) * set.lambda * Kq * pw(Rrecv, set.p) * (1 - set.chi * src.s / n);
}
/** 同じ率を第337便j の t2Closed から(照らし) */
export function dlnAClosedJ(src, r, set, Rrecv = 1) {
  const c = t2Closed(src, { action: 'dampRig', prof: 'ball', reading: 'Req', speed: 'obs', chi: set.chi, qFall: set.q, pSize: set.p, Rrecv }, r);
  return c.dlnA * set.lambda * Math.pow(baseRatio(src, DECL.k4.base), set.q);
}
/** 数の率(第337便j の ringRow —— 高さの振れ zMax の小さい傾きの受け手): ȧ/a と d ln i/dt */
export function ringRates(src, r, set, { zMax = 10, Rrecv = 1 } = {}) {
  const iDeg = Math.asin(zMax / r) * 180 / Math.PI, sys = recvSys(src, { a: r, iDeg }), eff = dampRigEffect(src, { prof: 'ball', chi: set.chi, speed: 'obs', qFall: set.q, lambda: 1 });
  const row = ringRow(sys, eff, pointsOf(sys, null)), g = set.lambda * Math.pow(baseRatio(src, DECL.k4.base), set.q) * Math.pow(Rrecv, set.p);
  return { dlnA: row.dlnA * g, dlnI: row.dlnI * g };
}

/* ───────── T1 一様厚みの絶対値(同じ帳簿)───────── */
/** 帯の幅を厚みと読む(全厚 —— 第337便j の bandWidthH・R_eq の読み) */
export const hBand = (src) => bandWidthH(src, 'Req');
/** 場と重力の鉛直の速さが等しい高さ(全厚 2 z* —— 第337便j の zEqualHeight・同期の内側では無し) */
export const hZeq = (src, r) => { const z = zEqualHeight(src, { r }); return z.zStar === null ? null : 2 * z.zStar; };
/** 粒子の大きさの床(全厚 2 σ_z/ν_z・σ_z = k_d n d_p —— 回転引きずりを入れない対照の型): 半径に依らない */
export const hFloor = (dp, kd) => 2 * kd * dp;
/** 自己重力の床(全厚 2 σ_z/ν_z・σ_z = k_g σ_r・σ_r = 3.36 G Σ Q_T/ν_ep —— Toomre の型・回転引きずりを入れない対照の型) */
export const hGrav = (src, r, sigma, { QT = DECL.t1.QT, kg = DECL.t1.kg } = {}) => { const n = nOf(src, r); return 2 * kg * 3.36 * G * sigma * QT / (n * n); };
/** 鉛直の減衰と乱しの釣り合い(線形の帳簿): dσ_z²/dt = P + A σ_z² − 2 Γ_d σ_z² → σ_z² = P/(2Γ_d − A)(2Γ_d > A のときだけ)・全厚 2 σ_z/ν_z */
export function linearLedger({ P, A = 0, Gam, nu }) {
  if (![P, A, Gam, nu].every(isFin) || !(nu > 0)) throw new RangeError('linearLedger: 有限・ν_z > 0');
  const den = 2 * Gam - A;
  if (P === 0) return { sigma2: den > 0 ? 0 : null, H: den > 0 ? 0 : null, free: den === 0, why: den === 0 ? 'P = 0 で 2Γ_d = A —— σ_z は何でも釣り合う(厚みは決まらない)' : den > 0 ? 'P = 0 —— 厚み 0 へ減る' : '増え続ける' };
  if (!(den > 0)) return { sigma2: null, H: null, free: false, why: '2Γ_d ≤ A —— 釣り合いが無い(増え続ける)' };
  const s2 = P / den; return { sigma2: s2, H: 2 * Math.sqrt(s2) / nu, free: false, why: null };
}
/** 厚み 10 m に要る乱しの率 P(線形の帳簿・A = 0)と衝突の加熱の尺度 P_coll = (k_d n d_p)² × k_c n τ */
export const pNeed = (src, r, Gam, Hfull = DECL.t1.ref10m) => { const n = nOf(src, r); return 2 * Gam * (n * Hfull / 2) ** 2; };
export const pColl = (src, r, tau, { dp = DECL.t1.dp, kd = DECL.t1.kd[0], kc = DECL.t1.kc } = {}) => { const n = nOf(src, r); return (kd * n * dp) ** 2 * kc * n * tau; };
/** 鉛直の減衰の率 Γ_d の読み(r での値): yard = 1/(1e7 年)・k4half = 4 天体の強さの組(χ ½)の |d ln i/dt|・focus337i = 第337便i の鉛直へ寄せる場(slice・R_eq・s・λ 6.56e-7)の |d ln i/dt| */
export function gammaAt(src, r, kind, sets) {
  if (kind === 'yard') return 1 / (DECL.t1.tYardYr * YR);
  if (kind === 'k4half') return Math.abs(ringRates(src, r, sets.half).dlnI);
  if (kind === 'focus337i') { const F = DECL.t1.focus337i, sys = ringSys(src, { r, zMax: F.zMax }); return Math.abs(ringRow(sys, effectOfSpec(src, { prof: F.prof, action: F.action, reading: F.reading, speed: F.speed, lambda: F.lambda }), pointsOf(sys, null)).dlnI); }
  throw new RangeError('gammaAt: 読み ' + kind);
}
/** 局所のべきと一様の区間の幅(隣の点が同じ区分の内のときだけ —— 幅は D〜F の半径の範囲に対する割合) */
export function uniformWidth(rs, Hs, regs, tol = DECL.t1.uniformPow) {
  const span = rs[rs.length - 1] - rs[0]; let w = 0, n = 0, cov = 0; const pows = [];
  for (let i = 0; i + 1 < rs.length; i++) {
    if (Hs[i] === null || Hs[i + 1] === null || !(Hs[i] > 0) || !(Hs[i + 1] > 0) || regs[i] !== regs[i + 1]) { pows.push(null); continue; }
    const p = Math.log(Hs[i + 1] / Hs[i]) / Math.log(rs[i + 1] / rs[i]); pows.push(p); n++; cov += rs[i + 1] - rs[i];
    if (Math.abs(p) <= tol) w += rs[i + 1] - rs[i];
  }
  const fin = pows.filter((p) => p !== null);
  return { width: w / span, covered: cov / span, nPairs: n, powMin: fin.length ? Math.min(...fin) : null, powMax: fin.length ? Math.max(...fin) : null };
}
/** 半径の格子(D〜F —— 区分の外〔A 環と F 環の間〕は区分 null) */
export function gridT1(D = DECL.t1) {
  const out = []; for (let i = 0; i < D.nGrid; i++) { const rKm = D.rMinKm + (D.rMaxKm - D.rMinKm) * i / (D.nGrid - 1), g = regionAt(rKm); out.push({ rKm, r: rKm * 1e3, region: g ? g.key : null, sigma: g ? g.sigma : null, tau: g ? g.tau : null }); }
  return out;
}

/* ───────── T2 環の中のやり取りの収支(半径の輪の列)───────── */
/** 輪の列(主の帯 D〜A は半径で等分・F 環は別の組 —— 質量は区分ごとの π(r_b² − r_a²) Σ の和) */
export function makeAnnuli(D = DECL.t2) {
  const regs = LIT.regions, mainR0 = regs[0].r0 * 1e3, mainR1 = regs[4].r1 * 1e3, F = regs[5], out = [];
  const massOf = (a, b) => regs.slice(0, 5).reduce((s, g) => { const lo = Math.max(a, g.r0 * 1e3), hi = Math.min(b, g.r1 * 1e3); return hi > lo ? s + Math.PI * (hi * hi - lo * lo) * g.sigma : s; }, 0);
  for (let i = 0; i < D.nMain; i++) { const a = mainR0 + (mainR1 - mainR0) * i / D.nMain, b = mainR0 + (mainR1 - mainR0) * (i + 1) / D.nMain; out.push({ r: 0.5 * (a + b), M: massOf(a, b), group: 'main' }); }
  for (let i = 0; i < D.nF; i++) { const a = (F.r0 + (F.r1 - F.r0) * i / D.nF) * 1e3, b = (F.r0 + (F.r1 - F.r0) * (i + 1) / D.nF) * 1e3; out.push({ r: 0.5 * (a + b), M: Math.PI * (b * b - a * a) * F.sigma, group: 'F' }); }
  return out;
}
/** 粘性のトルク(内の輪が外の輪に与える —— 正なら外へ角運動量を運ぶ): G = −2π r³ ν Σ dΩ/dr・境の Σ = 両隣の質量の調和平均 ÷ 2π r Δr
 *  (面密度が 3 桁違う区分の境〔D 環と C 環・B 環とカッシーニの間隙〕で軽い側が振り飛ばされないように —— 軽い側が流れを決める読み) */
export const massMean = (M1, M2) => 2 * M1 * M2 / (M1 + M2);
export const viscTorque = (r1, r2, M1, M2, nu, GM) => { const rm = 0.5 * (r1 + r2), dr = r2 - r1, dO = Math.sqrt(GM / (r2 * r2 * r2)) - Math.sqrt(GM / (r1 * r1 * r1)); return -rm * rm * nu * massMean(M1, M2) * dO / (dr * dr); };
/** 時間の発展(輪の質量は固定・角運動量 L_k = M_k ℓ(r_k) を動かす —— 外のトルク M_k Λ_k と粘性のトルクの差・土星の半径の内へ入った輪は土星へ・外へ出る半径を超えた輪は外へ)。
 *  返り値: 節目ごとの帳簿(質量・角運動量・エネルギーの行き先・縁の半径・漂い)と閉じ(値は書かない) */
export function evolveRing({ src, set, lamScale = 1, nu = 0, D = DECL.t2, onlyGroups = null }) {
  const GM = G * src.m, RS = src.Robs, A0 = makeAnnuli(D).filter((a) => !onlyGroups || onlyGroups.includes(a.group));
  const rOut = D.outerExit * 140180e3, Ts = D.checkYr.map((y) => y * YR), Tend = D.tEndYr * YR;
  let ring = A0.map((a, k) => ({ id: k, r0: a.r, M: a.M, group: a.group, L: a.M * Math.sqrt(GM * a.r) }));
  const rOfL = (q) => { const l = q.L / q.M; return l * l / GM; }, Eof = (q) => -GM * q.M / (2 * rOfL(q)), Om = (r) => Math.sqrt(GM / (r * r * r));
  const M0 = ring.reduce((s, q) => s + q.M, 0), L0 = ring.reduce((s, q) => s + q.L, 0), E0 = ring.reduce((s, q) => s + Eof(q), 0);
  const ext = (r) => (lamScale === 0 ? 0 : dlnAFast(src, r, set) * lamScale);
  // 初めの外のトルク(正味・大きさの和)
  const T0 = ring.map((q) => { const r = rOfL(q); return 0.5 * q.L * ext(r); }), Tnet0 = T0.reduce((s, x) => s + x, 0), Tabs0 = T0.reduce((s, x) => s + Math.abs(x), 0);
  let t = 0, it = 0, Wext = 0, heat = 0, heatD = 0, extL = 0, Msat = 0, Lsat = 0, Esat = 0, Mout = 0, Lout = 0, Eout = 0, cross = 0, ci = 0, nVisc = 0;
  const rIn0 = Math.min(...ring.filter((q) => q.group === 'main').map((q) => q.r0)), rOutMain0 = Math.max(...ring.filter((q) => q.group === 'main').map((q) => q.r0));
  const checks = [];
  const snapAt = (tt) => {
    const alive = ring, Mr = alive.reduce((s, q) => s + q.M, 0), Lr = alive.reduce((s, q) => s + q.L, 0), Er = alive.reduce((s, q) => s + Eof(q), 0);
    const main = alive.filter((q) => q.group === 'main'), dl = alive.map((q) => Math.log(rOfL(q) / q.r0)), mw = Mr > 0 ? alive.reduce((s, q, i) => s + q.M * dl[i], 0) / Mr : null;
    const resL = (Lr + Lsat + Lout) - (L0 + extL), resE = (Er + Esat + Eout) - (E0 + Wext - heat);
    return { tYr: tt / YR, nAlive: alive.length, M: Mr / M0, Msat: Msat / M0, Mout: Mout / M0, L: Lr / L0, Lsat: Lsat / L0, Lout: Lout / L0, extL: extL / L0,
      Wext: Wext / Math.abs(E0), heat: heat / Math.abs(E0), heatDirectBelow1e3: heat > 0 ? Math.abs(heat - heatD) <= 1e-3 * heat : null, rIn: main.length ? Math.min(...main.map(rOfL)) / rIn0 : null, rOutMain: main.length ? Math.max(...main.map(rOfL)) / rOutMain0 : null,
      dlnMean: mw, dlnMax: dl.length ? Math.max(...dl.map(Math.abs)) : null, amClosed: Math.abs(resL) <= D.closeTol * L0, enClosed: Math.abs(resE) <= D.closeTol * Math.abs(E0) };
  };
  while (t < Tend && ring.length) {
    const rs = ring.map(rOfL), rates = rs.map(ext);
    let dt = Tend - t; if (ci < Ts.length) dt = Math.min(dt, Ts[ci] - t);
    const mx = Math.max(...rates.map(Math.abs)); if (mx > 0) dt = Math.min(dt, D.dlnStep / mx);
    if (nu > 0) for (let k = 0; k < ring.length; k++) { for (const j of [k - 1, k + 1]) { if (j < 0 || j >= ring.length || ring[j].group !== ring[k].group) continue; const dr = Math.abs(rs[j] - rs[k]), Mb = massMean(ring[j].M, ring[k].M);
      dt = Math.min(dt, D.viscCfl * dr * dr * ring[k].M / (6 * nu * Mb)); } }
    // 外のトルク(厳密な ΔL・ΔE は E(L) の差)
    for (let k = 0; k < ring.length; k++) { if (rates[k] === 0) continue; const q = ring[k], e1 = Eof(q), dL = 0.5 * q.L * rates[k] * dt; q.L += dL; extL += dL; Wext += Eof(q) - e1; }
    // 粘性(同じ組の隣どうし —— ΔL は打ち消し合う・ΔE は熱)
    // 熱 = 粘性の步で減った軌道のエネルギー(輪ごとの E の差の和 —— 和どうしの差を取らない)・照らしの列 Σ G (Ω_k − Ω_{k+1}) dt
    if (nu > 0) { const r2 = ring.map(rOfL), Gt = []; for (let k = 0; k + 1 < ring.length; k++) Gt.push(ring[k].group === ring[k + 1].group ? viscTorque(r2[k], r2[k + 1], ring[k].M, ring[k + 1].M, nu, GM) : 0);
      for (let k = 0; k + 1 < ring.length; k++) if (Gt[k] !== 0) heatD += Gt[k] * (Om(r2[k]) - Om(r2[k + 1])) * dt;
      for (let k = 0; k < ring.length; k++) { const q = ring[k], e1 = Eof(q); q.L += ((k > 0 ? Gt[k - 1] : 0) - (k < Gt.length ? Gt[k] : 0)) * dt; heat += e1 - Eof(q); }
      nVisc++; }
    t += dt; it++;
    // 入れ替わり(同じ組の隣の順が崩れた数)と境界
    const r3 = ring.map(rOfL); for (let k = 0; k + 1 < ring.length; k++) if (ring[k].group === ring[k + 1].group && !(r3[k + 1] > r3[k])) cross++;
    const keep = [];
    for (let k = 0; k < ring.length; k++) { const q = ring[k]; if (r3[k] < RS) { Msat += q.M; Lsat += q.L; Esat += Eof(q); } else if (r3[k] > rOut) { Mout += q.M; Lout += q.L; Eout += Eof(q); } else keep.push(q); }
    ring = keep;
    while (ci < Ts.length && t >= Ts[ci] - 1e-6 * YR) { checks.push(snapAt(t)); ci++; }
    if (it > 5e6) throw new RangeError('evolveRing: 步が多すぎる');
  }
  while (ci < Ts.length) { checks.push(Object.assign(snapAt(t), { tYr: Ts[ci] / YR, emptyBefore: true })); ci++; }
  return { M0, L0, E0, nAnnuli: A0.length, Tnet0, Tabs0, cancel: Tabs0 > 0 ? Math.abs(Tnet0) / Tabs0 : null, netRate: Tnet0 / L0, steps: it, nVisc, crossings: cross, checks };
}

/* ───────── T3 4 天体から潮汐の分を積んだ残り ───────── */
/** 潮汐の半長軸の率(k₂/Q = 1 の単位 —— 既存の lib `ctlPair` を呼ぶ: 源を変形する側〔半径 R_obs・k₂ 1・遅れ Δt = 1/(2|s − n|)〕・受け手を伴星・平面の円の軌道・逆行は速度の向きを逆に)。
 *  ȧ/a = 2 a (F·V)/(G m_源 m_受け手)(m_受け手 ≪ m_源 の読み) */
export function tideUnit({ src, a, mRecv, pro = true }) {
  const n = nOf(src, a), Om = Math.abs(src.s), vs = pro ? 1 : -1, lag = 1 / (2 * Math.abs(Om - vs * n));
  const o = ctlPair({ G, k2: 1, lag, R: src.Robs, mj: mRecv, r: [a, 0], V: [0, vs * n * a], Omega: Om });
  return 2 * a * (o.diss[1] * vs * n * a) / (G * src.m * mRecv);
}
/** 閉じた式の照らし: 3 (k₂/Q) n (m/M)(R/a)⁵ × sign(s − n)(逆行は −) */
export const tideClosed = ({ src, a, mRecv, pro = true }) => { const n = nOf(src, a), Om = Math.abs(src.s), sg = pro ? Math.sign(Om - n) : -1; return sg * 3 * n * (mRecv / src.m) * (src.Robs / a) ** 5; };
/** 4 天体の行(観測・候補・潮汐の単位・潮汐だけで観測になる k₂/Q・記憶の k₂/Q の残り・候補が分を取ったときの潮汐の要る k₂/Q) */
export function tideRow(key, sets) {
  const R = recvSysOf(key), src = R.src, a = R.r.a, obs = obsDlnA(key, a, R.n), pro = R.iDeg < 90, tu = tideUnit({ src, a, mRecv: LITK.mass[key], pro });
  const hostK = R.r.host, kqLit = LIT.k2q[hostK];
  const cand = {}; for (const k of SETS) { const s = sets[k]; cand[k] = s.lambda * recvUnit(key, s); }
  const resLit = kqLit !== undefined ? obs - kqLit * tu : null;
  return { key, host: hostK, nOverS: R.n / src.s, obs, tideUnit: tu, tideClosed: tideClosed({ src, a, mRecv: LITK.mass[key], pro }), kqNeed: obs / tu, kqLit, tideLit: kqLit * tu, resLit,
    resLitSign: resLit === null ? null : Math.sign(resLit), cand, candOverRes: Object.fromEntries(SETS.map((k) => [k, resLit ? cand[k] / resLit : null])),
    kqJoint: Object.fromEntries(SETS.map((k) => [k, (obs - cand[k]) / tu])) };
}
/** 第337便k の unitRate × 大きさの因子(単位の λ) */
export function recvUnit(key, set) {
  const R = recvSysOf(key), eff = dampRigEffect(R.src, { prof: 'ball', chi: set.chi, speed: 'obs', qFall: set.q, lambda: 1 }), row = ringRow(R.sys, eff, pointsOf(R.sys, null));
  return row.dlnA * Math.pow(baseRatio(R.src, DECL.k4.base), set.q) * sizeFactor(key, DECL.k4.size, set.p);
}
/** 強さの倍 f で候補を縮めたときの潮汐の要る k₂/Q(全部が 0 以上なら「潮汐と候補で和が観測」の組がある)と、f の上限(全部の天体で 候補 ≤ 観測〔同じ符号〕) */
export function tideCombos(rows, setKey, fGrid = DECL.t3.fGrid) {
  const fMax = Math.min(...rows.map((r) => (Math.sign(r.cand[setKey]) === Math.sign(r.obs) ? r.obs / r.cand[setKey] : 0)));
  const at = (f) => ({ f, kq: Object.fromEntries(rows.map((r) => [r.key, snapZero((r.obs - f * r.cand[setKey]) / r.tideUnit, r.obs / r.tideUnit, DECL.snap.round)])) });   // 上限の f で決める天体の k₂/Q は打ち消しで 0
  const list = [...fGrid.map(at), at(fMax)].map((c) => Object.assign(c, { allNonNeg: Object.values(c.kq).every((v) => v >= 0) }));
  return { setKey, fMax, limiting: rows.reduce((b, r) => { const v = Math.sign(r.cand[setKey]) === Math.sign(r.obs) ? r.obs / r.cand[setKey] : 0; return v < b.v ? { key: r.key, v } : b; }, { key: null, v: Infinity }).key, list };
}

/* ───────── T4 5 つ目の天体 ───────── */
export function fifthRow(key, sets, D = DECL.t4) {
  const B = LIT.fifth[key], src = srcOf(B.host), iDeg = B.iDeg === null ? Math.asin(10 / B.a) * 180 / Math.PI : B.iDeg, sys = recvSys(src, { a: B.a, iDeg }), n = nOf(src, B.a), T = D.baseYr * YR;
  const pred = {};
  for (const k of SETS) { const s = sets[k], eff = dampRigEffect(src, { prof: 'ball', chi: s.chi, speed: 'obs', qFall: s.q, lambda: 1 }), row = ringRow(sys, eff, pointsOf(sys, null));
    const d = row.dlnA * s.lambda * Math.pow(baseRatio(src, DECL.k4.base), s.q) * Math.pow(B.R, s.p);
    pred[k] = { dlnA: d, sign: Math.sign(d), driftKm: 0.75 * n * d * T * T * B.a / 1e3 }; }
  const kq = LIT.k2q[B.host], tide = B.m && kq !== undefined ? kq * tideUnit({ src, a: B.a, mRecv: B.m, pro: true }) : null;
  return { key, name: B.name, host: B.host, nOverS: n / src.s, pred, opposite: pred.half.sign !== pred.one.sign, tide, tideSign: tide === null ? null : Math.sign(tide),
    tideDriftKm: tide === null ? null : 0.75 * n * tide * T * T * B.a / 1e3, visible: Math.min(Math.abs(pred.half.driftKm), Math.abs(pred.one.driftKm)) >= D.driftKm,
    candOverTide: tide ? Object.fromEntries(SETS.map((k) => [k, pred[k].dlnA / tide])) : null, obs: null };
}

/* ───────── T5 ジャイロの直交を高さ則 T1 の捩れの率と第337便i の鉛直の場に ───────── */
/** 高さ則 T1 の捩れの率(線 r̂ のまわりの角速度 s z/r)で受け手の速度を回す加速度の型: a = λ (s_* z/r)(r̂ × v)(速さ s_* = 観測自転・F·v = 0 —— 半長軸を動かさない) */
export function t1TwistEffect(src, { lambda = 1 } = {}) {
  const k = src.axis, sp = src.s;
  return { kind: 'acc', a: (st) => { const r = nrm(st.x), w = lambda * sp * dot(st.x, k) / r; return scl(crs(scl(st.x, 1 / r), st.v), w); } };
}
/** 受け手の行(単位の λ): 自分の傾きの率・交点の率・直交の読みの傾きの率(plus・replace)・赤道面へ寄るか(T1 の捩れ・第337便i の鉛直へ寄せる場) */
export function orthT5Row(key) {
  const R = recvSysOf(key), src = R.src, k = src.axis, pts = pointsOf(R.sys, null);
  const tw = orthRow(R.sys, t1TwistEffect(src), pts, k), F = DECL.t1.focus337i, fo = orthRow(R.sys, effectOfSpec(src, { prof: F.prof, action: F.action, reading: F.reading, speed: F.speed, lambda: 1 }), pts, k);
  const pr = (o) => ({ own: o.dlnIown, node: o.dnode, orth: o.per['plus|replace'].dlnIorth, toPlane: o.per['plus|replace'].toPlane, dlnA: o.dlnA });
  return { key, host: R.r.host, iDeg: R.iDeg, twist: pr(tw), focus: pr(fo) };
}
/** 扁平率のべき: 源ごとの T1 の捩れの直交の傾きの率(赤道面の近くの受け手 2 R_obs・単位の λ)× (f/f_土星)^k —— 土星で 1e7 年になる強さで並べた時間・帯の幅の厚み・文献の厚み */
export function flatT5Row(key) {
  const src = srcOf(key), r = DECL.t5.rOverR * src.Robs, sys = ringSys(src, { r, zMax: r * Math.sin(DECL.t5.iRad) }), o = orthRow(sys, t1TwistEffect(src), pointsOf(sys, null), src.axis);
  const thick = LITJ.ringThickness.find((x) => x.host === key) || null;
  return { key, fFlat: src.fFlat, orth: o.per['plus|replace'].dlnIorth, hBand: hBand(src), litH: thick ? thick.H : null, litKind: thick ? thick.kind : null };
}

/* ───────── 純関数の場面と門 ───────── */
export function pureScenes() {
  const S = {}, sat = srcOf('saturn');
  // ① 速い率(exp と log)と第337便j の t2Closed と数の ringRow の照らし(環の中心 5・χ ½ と 1 の宣言の組)
  { const sets = { half: { chi: 0.5, q: -0.02, p: -1.1, lambda: 1.5e-8 }, one: { chi: 1, q: 0.007, p: -1.3, lambda: 1.7e-7 } }; let dc = 0, dn = 0;
    for (const k of SETS) for (const rk of DECL.t1.ringCenters) { const r = centerKm(rk) * 1e3, a = dlnAFast(sat, r, sets[k]), b = dlnAClosedJ(sat, r, sets[k]), c = ringRates(sat, r, sets[k]).dlnA;
      dc = Math.max(dc, Math.abs(a - b) / Math.abs(b)); dn = Math.max(dn, Math.abs(a - c) / Math.abs(c)); }
    S.fast = { closed: dc, numeric: dn }; }
  // ② 輪の列の帳簿: 粘性だけで角運動量が閉じ・熱は正・エネルギーは減る(2 組の短い試走)
  { const set = { chi: 0.5, q: 0, p: 0, lambda: 1e-8 }, D = Object.assign({}, DECL.t2, { nMain: 8, nF: 0, tEndYr: 1e5, checkYr: [1e5] }), a = evolveRing({ src: sat, set, lamScale: 0, nu: 1, D }), c = a.checks[0];
    const b = evolveRing({ src: sat, set, lamScale: 1e-4, nu: 0.1, D }), cb = b.checks[0];
    S.ledger = { amClosedVisc: c.amClosed, enClosedVisc: c.enClosed, heatPos: c.heat > 0, extZero: c.extL === 0 && c.Wext === 0, amClosedExt: cb.amClosed, enClosedExt: cb.enClosed, cross: a.crossings + b.crossings }; }
  // ③ 線形の帳簿の斉次性: P を c² 倍すると厚みは c 倍(Γ_d だけでは決まらない)・加熱が σ_z² に比例する型(P = 0・2Γ_d = A)は σ_z が自由
  { const L1 = linearLedger({ P: 1e-20, Gam: 3e-15, nu: 1.5e-4 }), L2 = linearLedger({ P: 4e-20, Gam: 3e-15, nu: 1.5e-4 }), L3 = linearLedger({ P: 0, A: 6e-15, Gam: 3e-15, nu: 1.5e-4 }), L4 = linearLedger({ P: 1e-20, A: 7e-15, Gam: 3e-15, nu: 1.5e-4 });
    S.linear = { homog: Math.abs(L2.H / L1.H - 2), free: L3.free === true, noBal: L4.H === null }; }
  // ④ 潮汐の単位(ctlPair)と閉じた式の照らし(フォボス・トリトン)
  { const m = Math.max(...['phobos', 'triton'].map((k) => { const R = recvSysOf(k), x = { src: R.src, a: R.r.a, mRecv: LITK.mass[k], pro: R.iDeg < 90 }; return Math.abs(tideUnit(x) - tideClosed(x)) / Math.abs(tideClosed(x)); })); S.tide = m; }
  // ⑤ T1 の捩れの型は F·v = 0(半長軸を動かさない)・λ = 0 で 0
  { const e = t1TwistEffect(sat, { lambda: 1 }), st = { x: [1.2e8, 3e7, 40], v: [-3e3, 1.5e4, 0.2] }, F = e.a(st); S.twist = { power: Math.abs(dot(F, st.v)) / (nrm(F) * nrm(st.v)), zero: nrm(t1TwistEffect(sat, { lambda: 0 }).a(st)) }; }
  // ⑥ 入力の拒否
  const rejects = (f) => { try { f(); return false; } catch (e) { return e instanceof RangeError; } };
  S.rejects = [rejects(() => linearLedger({ P: 1, Gam: 1, nu: 0 })), rejects(() => gammaAt(sat, 1e8, 'x', {})), rejects(() => srcOf('venus')), rejects(() => recvSysOf('io2'))];
  return S;
}
/** 正本に書く場面の値(丸めの程度の差は「床より小さい」の真偽で —— 走らせ直しの照合で値を比べない) */
export function pureView(S) {
  return { fast: { closedBelow1e12: S.fast.closed <= 1e-12, numericBelow1e3: S.fast.numeric <= 1e-3 }, ledger: S.ledger, linear: { homogBelow1e12: S.linear.homog <= 1e-12, free: S.linear.free, noBal: S.linear.noBal },
    tide: { below1e12: S.tide <= 1e-12 }, twist: { powerBelow1e12: S.twist.power <= 1e-12, zero: S.twist.zero }, rejects: S.rejects };
}
export function pureGates(S) {
  return {
    fast: S.fast.closed <= 1e-12 && S.fast.numeric <= 1e-3,
    ledger: S.ledger.amClosedVisc && S.ledger.enClosedVisc && S.ledger.heatPos && S.ledger.extZero && S.ledger.amClosedExt && S.ledger.enClosedExt && S.ledger.cross === 0,
    linear: S.linear.homog <= 1e-12 && S.linear.free && S.linear.noBal,
    tide: S.tide <= 1e-12,
    twist: S.twist.power <= 1e-12 && S.twist.zero === 0,
    rejects: S.rejects.length === 4 && S.rejects.every(Boolean),
  };
}
export { SAT4, RINGS, nOverS, rSyncOf, rdOf, YR, G };
