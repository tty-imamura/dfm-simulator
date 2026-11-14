// 第337便i(原仮定者の回答(2026-11-14 —— 第138報の回答)「並進引きずりの結果と思われるので、回転引きずりも検証する。回転引きずりは、源の引きずり半径が影響する。
//   土星の環に影響する計算を求めてから、水星での影響を確認する」・探索の方針(第138報 —— 式の形を走行の前に決め打ちしない・1 つのノブで同時に満たせないならノブを足す)・統括の検証項目 R345):
//   **回転引きずり(源の引きずり半径 R_d が効く型)の純関数 —— 型の棚卸し(R_d がどこに入るか)・方位の速度の場の高さの型 6(切り口・帯 + 尾 3・球の遠方・源のモーメント)×
//   作用の型 5(座標を運ぶ方位の場・方位の押し・鉛直へ寄せる場〔高さ則 T2 の向きを鉛直に〕・相対の速度の全部・相対の速度の鉛直だけ)× R_d の読み 4 × 速さの列 2 の、
//   土星の環の粒子と惑星の一次の率(部分積分の読み〔速度の型〕と Gauss の式〔押しの型〕—— 第337便b の lib の ratesOn を呼ぶ)・環の物差し・代表の時間積分**
//   (器 tests/exp-w337i-rotring.mjs と QA behavior.rotring337i・docs.rotring337i が読む —— html を読まない・状態を持たない・第332〜334便と第337便b の lib は呼ぶだけ・エンジンの式を写さない)。
//   **本枝は回転引きずりの環と水星の候補の唯一の持ち主**(枝 b の赤道帯の候補〔並進の型〕・軸引きずり・供給・ロック・流体は持たない)。
//
// ■ 区別(各表・各式に付ける): 宣言(未接続)= この lib の場の型と作用の型(今のエンジンに無い)/実装〔opt-in〕= EQ-15 の回転の項(源のモーメント —— 本 lib は型 src として
//   一次の率の比べる列に置くだけ)/比べる列(凍結の対照)= 第332〜333便の切り口・球・帯と尾(第333便a の lib の関数を呼んで同じ値か門で照らす)/
//   対照 = 回転引きずり OFF(λ = 0)・並進引きずりの K1(実装)・源の自転が運ぶ速度の剛体の場(並進引きずりの回転の分 —— R_d が入らない)。
// ■ 記号: 源の自転軸 k̂・受け手の円柱座標 (ρ, z)(z は赤道面からの符号付きの高さ)・距離 r = √(ρ² + z²)・t = |z|/R_d・引きずり半径 R_d(読み 4: Yk = Y_k m〔今の規則〕・Req = 扁平の則の軸比
//   R_d/(1 − f_flat)^{1/3}・Robs = 観測半径・Rsrc = EQ-15 の J 案の源のモーメントの半径 R_obs √(5 f_obs/2))・観測自転 s・引きずり自転 s_d = (f_obs/f_d)(R_obs/R_d)² s(J 案・f_d = 2/5・λ_J = 1 ——
//   第333便a の dragSpin)・速さの列 s_*(obs = s・sd = s_d)・強さ λ(無次元 —— 一次の率は λ に比例するので、要る λ は単位の λ の率から読む)。
// ■ 場の高さの型(方位の速度 U_φ —— 源の自転の向きが正・z の偶関数)と半渦度の動径の成分 ω_ρ = −½ ∂U_φ/∂z(z の奇関数)
//   slice: U = s_* (R_d² − z²)/ρ(|z| ≤ R_d)・0(外)—— 第332便a・第333便a の切り口/ω = s_* z/ρ(帯の内)
//   lor2・lor4・lor8: U = s_* R_d²/(ρ (1 + t^n))(R_d を超えた所の落ち方のべき n —— ノブ・lor8 = 第333便a の lorentz)/ω = ½ s_* R_d n t^{n−1} sgn(z)/(ρ (1 + t^n)²)
//   ball: U = 2 s_* R_d² ρ/(5 r²)(第333便a の球の遠方・α = 2)/ω = 2 s_* R_d² ρ z/(5 r⁴)
//   src: U = (C₁ R_K1/r) s_* R_m² ρ/(5 r²)(EQ-15 の型の写しではなく、源のモーメント R_m²/(5r²) × K1 の結合 C₁R_K1/r の遠方の形 —— R_K1 = Y_k m・R_m = R_d の読み)/ω = (3/2) A ρ z/r⁵(A = C₁ R_K1 s_* R_m²/5)
// ■ 作用の型(どれも λ = 0 で 0): vel = 座標を運ぶ方位の場 d = λ U φ̂/push = 方位の押し a = λ|s| U φ̂/focus = 鉛直へ寄せる場 d = −λ r ω_ρ k̂(第334便a の高さ則 T2 を鉛直の速度の場の
//   向き〔第334便a の厚みの対照 focus〕に割り当てた型 —— 割り当ての向きはノブ)/damp = 相対の速度の全部 a = −λ|s| S (w − U φ̂)(S = U(ρ, z)/U(ρ, 0) —— 帯の形)/
//   dampz = 相対の速度の鉛直だけ a = −λ|s| S (w·k̂) k̂(場は鉛直の速度を持たない —— 鉛直の相対の速度だけを残す型)。押しと相対の型の率 |s| は観測自転(第333便a の fixed の読み)。
// ■ 言わないこと: 表は「候補」「探索」「未較正」「このノブの組では」。土星の環が回転引きずりで薄くなるとも、水星の近点移動が回転引きずりで出るとも書かない。環の厚みと公転の物差しは
//   宣言の物差し(文献の値・未照合の目安)。一次の率は無摂動の軌道の平均(写しの時間発展ではない)。s_d R_d は物質の表面の速度ではない(J を表す等価なパラメータ)。
import { ratesOn, quadSegments, quadPoints, anglesRates, rowOf, systemOfLit, contribEffect, LIT as LIT337B, DECL as DECL337B, kappaMRadius, nOf, periodOf, q1PNPerOrbit, CENTURY_S, vec } from './lib-w337b-mercuryband.mjs';
import { sliceVel, farVel, tailVel, dragSpin as dragSpin333A, fObsOf } from './lib-w333a-rotdiff.mjs';
import { t1Twist, t2Vort, t3Scalar, propRange, dominance, oblateRule, LIT334A } from './lib-w334a-heightlaw.mjs';
import { C1, LIT as LIT332A } from './lib-w332a-eqband.mjs';
import { frameOfElements, anglesOn, stateAt, toArcsecCy } from './lib-w333c-mercury3d.mjs';

export const LIB_VERSION = 'w337i-rotring-lib-1';
const isFin = Number.isFinite;
const D2R = Math.PI / 180, YR = 365.25 * 86400, ARCSEC = Math.PI / (180 * 3600);
const { add, sub, scl, dot, crs, nrm, unit } = vec;
export const PROFILES = Object.freeze(['slice', 'lor2', 'lor4', 'lor8', 'ball', 'src']);
export const ACTIONS = Object.freeze(['vel', 'push', 'focus', 'damp', 'dampz']);
export const READINGS = Object.freeze(['Yk', 'Req', 'Robs', 'Rsrc']);
export const SPEEDS = Object.freeze(['obs', 'sd']);

/* ───────── 宣言(走らせた格子と判定の物差しの記録 —— 式の形の宣言ではない)───────── */
export const DECL = Object.freeze({
  G: DECL337B.G, c: DECL337B.c,
  profiles: PROFILES, actions: ACTIONS, readings: READINGS, speeds: SPEEDS,
  /** 引きずり自転の J 案(第333便a の dragSpin —— f_d = 2/5・λ_J = 1)と扁平の則(軸比 q = 1/3 —— 原仮定者の回答(2026-11-12 —— AN648・AN649)) */
  fD: 0.4, lambdaJ: 1, oblateQ: 1 / 3,
  /** 主の読み(原仮定者の補足(2026-11-14 —— 第138報の補足 4)「回転引きずりは、AN648 の扁平率を適用し」—— 扁平の則は定義の一部・残すノブは次数 q)と次数の格子 */
  mainReading: 'Req', oblateQs: Object.freeze([1 / 3, 1 / 2, 1, 2, 3]),
  /** 一様厚みの区間(原仮定者の指示(2026-11-11 —— 第135報)—— 高さ則の型 T1〜T3 を鉛直へ寄せる場に置く)・環の半径の格子(D〜F)・測る高さの振れ [m]・T3 の宣言(第334便a の主: A = 1・ℓ = 4・H = R_d・β = 1) */
  uniform: Object.freeze({ laws: Object.freeze(['T1', 'T2slice', 'T2ball', 'T3']), rings: Object.freeze(['satD', 'satC', 'satB', 'satCD', 'satA', 'satF']), zMax: 0.5, t3: Object.freeze({ A: 1, ell: 4, beta: 1 }), sunDistAU: 9.5826 }),
  /** 軸引きずりの 2 つの読み(第337便a の lib を呼ぶ —— 重みのべき α = 2・背景慣性決定力 W₀ は太陽の取り分が ½ になる距離 0.723 AU〔金星の釣り合いの読み〕から) */
  axial: Object.freeze({ alpha: 2, rHalfAU: 0.723 }),
  /** 環の粒子の点(土星の赤道面・半径は LIT の環の中央 + F 環・赤道面からの高さの振れ z_max〔m〕—— 主は 10 m〔文献の値・未照合の典型の厚み〕)と小さな離心率・近点引数・交点 */
  ring: Object.freeze({ keys: Object.freeze(['satC', 'satB', 'satCD', 'satA', 'satF']), zMax: Object.freeze([1, 10, 100]), zMain: 10, e: 1e-5, omegaDeg: 40, nodeDeg: 0 }),
  /** 環の物差し(宣言 —— 文献の幅ではない): 薄くなる時間 T_thin(若い環の下限 1e7 年 —— 第332便a の LIT.ringAge の下限)の内に全部の点の傾きが e 分の 1 になる強さ λ_need・
   *  そのときケプラーの値からの公転の角速度のずれ |δΩ/Ω| ≤ keplerTol・T_thin の間の半長軸の変化 |Δ ln a| ≤ driftTol・離心率の伸び Δ ln e ≤ eccTol */
  ringJudge: Object.freeze({ tThinYr: 1e7, keplerTol: 1e-5, driftTol: 1e-5, eccTol: 1 }),
  /** 惑星(第337便b の系 —— 太陽の極と JPL の要素)と物差し(第337便b と同じ: 暦表の追加の近点と交点の歳差の [値 − 幅, 値 + 幅]・周期と離心率の宣言の物差し) */
  planets: Object.freeze(['merc', 'venus', 'earth', 'mars']),
  /** 赤道面の近くの分け(|z| ≤ nearMult × R_d の点の寄与の割合 —— 赤道面を横切る 2 点の近くで効くか) */
  nearMult: 10,
  /** 引きずり半径を振る格子(T4 —— Y_k m × 10^k) */
  rdScan: Object.freeze([-2, -1, 0, 1, 2, 3, 4, 5, 6, 7]),
  /** 代表の時間積分(RK4 —— 1 周の步の数 2 つ・周の数) */
  integ: Object.freeze({ steps: Object.freeze([2000, 4000]), nOrb: 20 }),
});
/** 文献の値(本環境では未照合 —— 既存の lib の写しと出典の名) */
export const LIT = Object.freeze({
  note: '文献の値・未照合(この環境から一次資料のサイトに届かない —— 出典の名と値は既存の lib〔第334便a の LIT334A・第332便a の LIT〕と記憶の値)',
  saturn: Object.freeze(Object.assign({}, LIT334A.bodies.find((b) => b.key === 'saturn'), { fObs: fObsOf(11), src: LIT334A.bodiesSrc })),
  sunFlat: Object.freeze({ value: 9e-6, src: LIT334A.bodiesSrc }),
  rings: Object.freeze([...LIT334A.rings.filter((r) => r.host === 'saturn').map((r) => Object.freeze({ key: r.key, name: r.name, r: r.r })),
    Object.freeze({ key: 'satF', name: '土星 F 環', r: 140180e3 })]),
  ringsSrc: LIT334A.ringsSrc + '・F 環 140 180 km・D 環 66 900〜74 510 km(NASA NSSDC の土星の環の表 —— 文献の値・未照合)',
  ringD: Object.freeze({ key: 'satD', name: '土星 D 環', r: 0.5 * (66900e3 + 74510e3) }),
  /** 源の自転の半分より速く公転する受け手(原仮定者の補足(2026-11-14 —— 第138報の補足 4)の比べる相手)—— NASA NSSDC の衛星の表の値の記憶(文献の値・未照合) */
  receivers: Object.freeze([
    Object.freeze({ key: 'ringD', name: '土星 D 環の粒子', host: 'saturn', a: 0.5 * (66900e3 + 74510e3), e: 1e-5, iDeg: 10 / 70705e3 * 180 / Math.PI, m: 3.77e3, R: 1 }),
    Object.freeze({ key: 'ringB', name: '土星 B 環の粒子', host: 'saturn', a: 0.5 * (92000e3 + 117580e3), e: 1e-5, iDeg: 10 / 104790e3 * 180 / Math.PI, m: 3.77e3, R: 1 }),
    Object.freeze({ key: 'ringF', name: '土星 F 環の粒子', host: 'saturn', a: 140180e3, e: 1e-5, iDeg: 10 / 140180e3 * 180 / Math.PI, m: 3.77e3, R: 1 }),
    Object.freeze({ key: 'phobos', name: 'フォボス', host: 'mars', a: 9376e3, e: 0.0151, iDeg: 1.08, m: 1.0659e16, R: 11.1e3 }),
    Object.freeze({ key: 'metis', name: 'メティス(木星)', host: 'jupiter', a: 128000e3, e: 0.0002, iDeg: 0.06, m: 3.6e16, R: 21.5e3 }),
    Object.freeze({ key: 'adrastea', name: 'アドラステア(木星)', host: 'jupiter', a: 129000e3, e: 0.0015, iDeg: 0.03, m: 2e15, R: 8.2e3 }),
    Object.freeze({ key: 'pan', name: 'パン(土星)', host: 'saturn', a: 133584e3, e: 1.44e-5, iDeg: 1e-4, m: 4.95e15, R: 14.1e3 }),
  ]),
  receiversSrc: 'NASA NSSDC の衛星の表(半長軸・離心率・赤道面に対する傾き・質量・平均半径)の記憶の値 —— 文献の値・未照合。環の粒子は第334便a の LIT334A.particle の宣言(半径 1 m・密度 900 —— 文献の値ではない)・傾きは高さの振れ 10 m の宣言',
  thickness: LIT332A.thickness ? LIT332A.thickness : null,
  ringAge: LIT332A.ringAge,
  dvarpi: LIT337B.dvarpi, dnode: LIT337B.dnode,
});

/* ───────── 源(土星・太陽)───────── */
/** 源の宣言: m・R_obs・観測自転 s・扁平率・慣性係数 f_obs・自転軸(環の系は k̂ = ẑ・惑星の系は太陽の極) */
export function sourceOf(key) {
  if (key === 'saturn') { const S = LIT.saturn; return { key, ja: '土星', m: S.m, Robs: S.R, s: 2 * Math.PI / (S.P * 3600), fFlat: S.f, fObs: S.fObs, axis: [0, 0, 1] }; }
  if (key === 'sun') { const M = systemOfLit('merc'); return { key, ja: '太陽', m: M.M, Robs: M.Rsun, s: M.sSun, fFlat: LIT.sunFlat.value, fObs: fObsOf(0), axis: M.sunAxis }; }
  if (key === 'mars' || key === 'jupiter') { const B = LIT334A.bodies.find((b) => b.key === key); return { key, ja: B.name, m: B.m, Robs: B.R, s: 2 * Math.PI / (B.P * 3600), fFlat: B.f, fObs: fObsOf(B.moi), axis: [0, 0, 1] }; }
  throw new RangeError('sourceOf: 源 ' + key);
}
/** 引きずり半径の読み(kScale は Y_k の倍 —— T4 の格子・Yk と Req にだけ掛ける) */
export function rdOf(src, reading, kScale = 1, q = DECL.oblateQ) {
  if (!(kScale > 0) || !(q > 0)) throw new RangeError('rdOf: 倍 > 0・次数 > 0');
  if (reading === 'Yk') return kappaMRadius(src.m) * kScale;
  if (reading === 'Req') return oblateRule({ Rd: kappaMRadius(src.m) * kScale, fFlat: src.fFlat, q, law: 'axisRatio' }).Req;
  if (reading === 'Robs') return src.Robs;
  if (reading === 'Rsrc') return src.Robs * Math.sqrt(2.5 * src.fObs);
  throw new RangeError('rdOf: 読み ' + reading);
}
/** 速さの列 s_*(obs = 観測自転・sd = J 案の引きずり自転 —— 第333便a の dragSpin) */
export function speedOf(src, speed, Rd) {
  if (speed === 'obs') return src.s;
  if (speed === 'sd') return dragSpin333A({ m: src.m, Robs: src.Robs, s: src.s, fObs: src.fObs, fD: DECL.fD, lambdaJ: DECL.lambdaJ, Rd }).sd;
  throw new RangeError('speedOf: 速さ ' + speed);
}

/* ───────── 場の高さの型 ───────── */
/** U_φ と ω_ρ(ρ > 0)。sp = s_*・Rd = R_d の読み・RK1 = K1 の半径(src だけ) */
export function profileUW(prof, rho, z, Rd, sp, RK1 = null) {
  if (!(rho > 0) || !isFin(z) || !(Rd > 0) || !isFin(sp)) throw new RangeError('profileUW: ρ > 0・R_d > 0・z と s 有限');
  const t = Math.abs(z) / Rd, sg = z > 0 ? 1 : z < 0 ? -1 : 0;
  if (prof === 'slice') { const inb = t <= 1; return { U: inb ? sp * (Rd * Rd - z * z) / rho : 0, om: t < 1 ? sp * z / rho : 0 }; }
  const ml = /^lor(\d)$/.exec(prof);
  if (ml) { const n = Number(ml[1]), tn = Math.pow(t, n), den = 1 + tn; return { U: sp * Rd * Rd / (rho * den), om: t === 0 ? 0 : 0.5 * sp * Rd * n * Math.pow(t, n - 1) * sg / (rho * den * den) }; }
  const r2 = rho * rho + z * z;
  if (prof === 'ball') return { U: 2 * sp * Rd * Rd * rho / (5 * r2), om: 2 * sp * Rd * Rd * rho * z / (5 * r2 * r2) };
  if (prof === 'src') { if (!(RK1 > 0)) throw new RangeError('profileUW: src は R_K1 > 0'); const r = Math.sqrt(r2), A = C1 * RK1 * sp * Rd * Rd / 5; return { U: A * rho / (r2 * r), om: 1.5 * A * rho * z / (r2 * r2 * r) }; }
  throw new RangeError('profileUW: 型 ' + prof);
}
/** 帯の形 S = U(ρ, z)/U(ρ, 0)(damp・dampz の重み) */
export function bandShape(prof, rho, z, Rd, RK1 = null) {
  const a = profileUW(prof, rho, z, Rd, 1, RK1).U, b = profileUW(prof, rho, 0, Rd, 1, RK1).U;
  return b > 0 ? a / b : 0;
}

/* ───────── 作用の型 → 効果(第337便b の ratesOn の型: { kind:'vel', d(x, w) } か { kind:'acc', a(st) })───────── */
/** spec = { prof, action, reading, speed, lambda, kScale }・src(源)。位置は源の中心から */
export function effectOfSpec(src, spec) {
  const { prof, action, reading, speed, lambda = 1, kScale = 1, oblateQ = DECL.oblateQ } = spec;
  if (!PROFILES.includes(prof) || !ACTIONS.includes(action) || !isFin(lambda)) throw new RangeError('effectOfSpec: 宣言');
  const k = unit(src.axis), Rd = rdOf(src, reading, kScale, oblateQ), sp = speedOf(src, speed, Rd), RK1 = kappaMRadius(src.m) * kScale, sAbs = Math.abs(src.s);
  const geo = (x) => { const z = dot(x, k), rv = sub(x, scl(k, z)), rho = nrm(rv); return { z, rho, phi: scl(crs(k, rv), 1 / rho) }; };
  const meta = { Rd, sp, RK1 };
  if (action === 'vel') return { kind: 'vel', d: (x) => { const g = geo(x); return scl(g.phi, lambda * profileUW(prof, g.rho, g.z, Rd, sp, RK1).U); }, meta };
  if (action === 'focus') return { kind: 'vel', d: (x) => { const g = geo(x); return scl(k, -lambda * nrm(x) * profileUW(prof, g.rho, g.z, Rd, sp, RK1).om); }, meta };
  if (action === 'push') return { kind: 'acc', a: (st) => { const g = geo(st.x); return scl(g.phi, lambda * sAbs * profileUW(prof, g.rho, g.z, Rd, sp, RK1).U); }, meta };
  if (action === 'damp') return { kind: 'acc', a: (st) => { const g = geo(st.x), S = bandShape(prof, g.rho, g.z, Rd, RK1), U = profileUW(prof, g.rho, g.z, Rd, sp, RK1).U;
    return scl(sub(st.v, scl(g.phi, U)), -lambda * sAbs * S); }, meta };
  return { kind: 'acc', a: (st) => { const g = geo(st.x), S = bandShape(prof, g.rho, g.z, Rd, RK1); return scl(k, -lambda * sAbs * S * dot(st.v, k)); }, meta };
}
/* ───────── 一様厚みの区間(高さ則 T1〜T3 を鉛直へ寄せる場に置く —— 原仮定者の指示(2026-11-11 —— 第135報)・第334便a の関数を呼ぶ)───────── */
/** 鉛直へ寄せる速さ V(z の奇関数 —— 赤道面へ向ける): T1 = s_* z・T2slice/T2ball = r ω_ρ(第334便a の t2Vort)・T3 = β A s_* ρ (z/r)/(1 + (|z|/H)^ℓ)(H = R_d) */
export function heightLawV(law, rho, z, Rd, sp) {
  const T3 = DECL.uniform.t3;
  if (law === 'T1') return t1Twist({ rho, z, sd: sp }).par;
  if (law === 'T2slice') return t2Vort({ rho, z, Rd, sd: sp, col: 'slice' }).V;
  if (law === 'T2ball') return t2Vort({ rho, z, Rd, sd: sp, col: 'ball' }).V;
  if (law === 'T3') return t3Scalar({ rho, z, sd: sp, beta: T3.beta, A: T3.A, H: Rd, ell: T3.ell });
  throw new RangeError('heightLawV: 型 ' + law);
}
/** 高さ則の鉛直へ寄せる場 d = −λ V k̂(spec = { law, reading, speed, lambda }) */
export function heightLawEffect(src, { law, reading = DECL.mainReading, speed = 'obs', lambda = 1 }) {
  if (!DECL.uniform.laws.includes(law) || !isFin(lambda)) throw new RangeError('heightLawEffect: 宣言');
  const k = unit(src.axis), Rd = rdOf(src, reading), sp = speedOf(src, speed, Rd);
  return { kind: 'vel', d: (x) => { const z = dot(x, k), rho = nrm(sub(x, scl(k, z))); return scl(k, -lambda * heightLawV(law, rho, z, Rd, sp)); }, meta: { Rd, sp } };
}
/** 鉛直の振幅を減らす率(z → 0 の傾き a = ∂U_z/∂z の大きさ —— 単位の高さあたり [1/s])を点で: 場の型と作用の型の組(focus は −λ r ∂ω/∂z・dampz は γ S)か高さ則 */
export function verticalRateAt(src, spec, rho, z) {
  if (spec.law) { const e = heightLawEffect(src, spec), h = z * 1e-3, f = (zz) => -dot(e.d([rho, 0, zz]), [0, 0, 1]); return (f(z + h) - f(z - h)) / (2 * h); }
  const e = effectOfSpec(src, spec);
  if (spec.action === 'focus') { const h = z * 1e-3, f = (zz) => -dot(e.d([rho, 0, zz]), [0, 0, 1]); return (f(z + h) - f(z - h)) / (2 * h); }
  if (spec.action === 'dampz') return (spec.lambda === undefined ? 1 : spec.lambda) * Math.abs(src.s) * bandShape(spec.prof, rho, z, e.meta.Rd, e.meta.RK1);
  throw new RangeError('verticalRateAt: 作用の型は focus・dampz か高さ則');
}
export { propRange, dominance };

/** 対照の効果: off(λ = 0 の回転引きずり —— 0)・k1(並進引きずりの K1 —— 実装)・rigid(源の自転が運ぶ速度の剛体の場 d = λ s k̂ × p —— 並進引きずりの回転の分・R_d が入らない) */
export function controlEffect(sys, src, key, lambda = 1) {
  if (key === 'off') return { kind: 'acc', a: () => [0, 0, 0] };
  if (key === 'k1') return contribEffect(sys, 'k1');
  if (key === 'rigid') { const k = unit(src.axis); return { kind: 'vel', d: (x) => scl(crs(k, x), lambda * src.s) }; }
  throw new RangeError('controlEffect: ' + key);
}

/* ───────── 系(環の粒子・惑星)───────── */
/** 環の粒子の系(源の赤道面 = xy 面・k̂ = ẑ): 半径 r・離心率 e・傾き i(z_max/r)・近点引数・交点 */
export function ringSys(src, { r, zMax, e = DECL.ring.e, omegaDeg = DECL.ring.omegaDeg, nodeDeg = DECL.ring.nodeDeg }) {
  if (!(r > 0) || !(zMax > 0) || !(e > 0 && e < 1)) throw new RangeError('ringSys: r・z_max > 0・0 < e < 1');
  const I = Math.asin(zMax / r) / D2R, fr = frameOfElements({ I, Om: nodeDeg, varpi: nodeDeg + omegaDeg });
  const orb = { a: r, e, mu: DECL.G * src.m, P: fr.P, Q: fr.Q, W: fr.W };
  return { key: 'ring', orb, sunAxis: src.axis, M: src.m, m: 0, R: 1, sSun: src.s, Rsun: src.Robs, iRad: I * D2R, zMax };
}
/** 惑星の系(第337便b の systemOfLit —— 源は太陽) */
export const planetSys = (key) => systemOfLit(key);

/* ───────── 一次の率 ───────── */
/** 点の一覧(交点の近くへ寄せる —— H0 = 帯の厚みの尺度) */
export const pointsOf = (sys, H0) => quadPoints(sys, quadSegments(sys, H0));
/** 速度の型の公転の角速度のずれ ⟨(d·φ̂)/ρ⟩/n(座標を運ぶ方位の場 —— 押しと相対の型は 0 を返し、ずれは半長軸の率で読む) */
export function omegaShift(sys, eff, pts) {
  if (eff.kind !== 'vel') return 0;
  const k = unit(sys.sunAxis), n = nOf(sys.orb); let s = 0, wsum = 0;
  for (const { st, tw } of pts) { const z = dot(st.x, k), rv = sub(st.x, scl(k, z)), rho = nrm(rv), phi = scl(crs(k, rv), 1 / rho); s += tw * dot(eff.d(st.x, st.v), phi) / rho; wsum += tw; }
  return s / wsum / n;
}
/** 環の行(単位の λ —— 率は 1/s): d ln i/dt・d ln e/dt・近点と交点の率・d ln a/dt・δΩ/Ω・赤道面の近くの割合 */
export function ringRow(sys, eff, pts) {
  const R = ratesOn(sys.orb, eff, pts), A = anglesRates(sys.orb, R, sys.sunAxis), e = sys.orb.e, dOm = omegaShift(sys, eff, pts), n = nOf(sys.orb);
  // 傾きの率が丸めの程度か(|di/dt| < 1e-12 × 同じ行の率の最大 —— 傾きを動かさない型を「薄くする」と数えない)
  const big = Math.max(Math.abs(A.di), Math.abs(A.dnode), Math.abs(R.apsW), Math.abs(R.dlnA), n * Math.abs(dOm));
  return { dlnI: A.di / sys.iRad, dlnE: R.dedt / e, apsW: R.apsW, dnode: A.dnode, dvarpi: A.dvarpi, dlnA: R.dlnA, dOmOverOm: dOm, tiltSignif: big > 0 && Math.abs(A.di) >= 1e-12 * big };
}
/** 惑星の行(第337便b の rowOf —— ″/世紀)+ 赤道面の近く(|z| ≤ nearMult R_d)の点の寄与の割合(近点の面内の回転 ω_W と L̂ の率) */
export function planetRow(sys, eff, pts, Rd) {
  const R = ratesOn(sys.orb, eff, pts), row = rowOf(sys, R), k = unit(sys.sunAxis), cut = DECL.nearMult * Rd;
  const near = pts.filter((p) => Math.abs(dot(p.st.x, k)) <= cut), Rn = near.length ? ratesOn(sys.orb, eff, near) : null;
  row.nearShare = { apsW: Rn && R.apsW ? Rn.apsW / R.apsW : 0, Lmag: Rn && R.LdotMag > 0 ? nrm(Rn.Ldot) / R.LdotMag : 0, nPts: near.length };
  return row;
}
/** 1PN の面内の近点の率(″/世紀) */
export const q1cyOf = (sys) => toArcsecCy(q1PNPerOrbit(sys.orb.mu, sys.orb.a, sys.orb.e) / periodOf(sys.orb));
/** 惑星の物差しの比(第337便b の ratiosOf と同じ物差し —— 1 以下が内): 近点(黄道の ϖ)・交点(黄道・地球は太陽の赤道面の交点を ϖ の尺度で)・周期・離心率 */
export function planetRatios(sys, row) {
  const v = LIT.dvarpi[sys.key], n = LIT.dnode[sys.key], scaleV = Math.abs(v[0]) + v[1], e = sys.orb.e, radScale = scaleV * ARCSEC;
  const node = n ? Math.abs(row.ecl.dnode - n[0]) / n[1] : Math.abs(row.sun.dnode) / scaleV;
  return { varpi: Math.abs(row.ecl.dvarpi - v[0]) / v[1], node, period: row.lonDriftArcsec / scaleV, ecc: Math.abs(row.decy) / (e * radScale) };
}
/** 対照(λ = 0)の比 —— 物差しの中心が 0 から幅より遠い量(金星の近点など)は、λ = 0 でも外になる */
export function baseRatios(sys) {
  const zero = { ecl: { dvarpi: 0, dnode: 0 }, sun: { dnode: 0 }, lonDriftArcsec: 0, decy: 0 };
  return planetRatios(sys, zero);
}
/** 尺度の比(候補の寄与の大きさ ÷ 比べる尺度 |値| + 幅 —— 物差しの中心が 0 から遠い量でも、候補が足す大きさを同じ尺度で読む・1 以下が内): 近点・交点・周期・離心率 */
export function planetScaleRatios(sys, row) {
  const v = LIT.dvarpi[sys.key], n = LIT.dnode[sys.key], scaleV = Math.abs(v[0]) + v[1], e = sys.orb.e, radScale = scaleV * ARCSEC;
  return { varpi: Math.abs(row.ecl.dvarpi) / scaleV, node: n ? Math.abs(row.ecl.dnode) / (Math.abs(n[0]) + n[1]) : Math.abs(row.sun.dnode) / scaleV, period: row.lonDriftArcsec / scaleV, ecc: Math.abs(row.decy) / (e * radScale) };
}
/** 行を λ 倍(一次) */
export function scalePlanetRow(r, k) {
  return { apsW: r.apsW * k, decy: r.decy * k, deMagCy: Math.abs(k) * r.deMagCy, dlnAcy: r.dlnAcy * k, dlnPcy: r.dlnPcy * k, lonDriftArcsec: Math.abs(k) * r.lonDriftArcsec, Lmag: Math.abs(k) * r.Lmag,
    ecl: { di: r.ecl.di * k, dnode: r.ecl.dnode * k, dvarpi: r.ecl.dvarpi * k }, sun: r.sun ? { di: r.sun.di * k, dnode: r.sun.dnode * k, dvarpi: r.sun.dvarpi * k } : null, nearShare: r.nearShare };
}

/* ───────── 環の判定(宣言の物差し)───────── */
/** 点ごとの単位の行の一覧 rows → 要る λ(全部の点が T_thin の内に e 分の 1)と、その λ での量。符号が点で違えば thin: false */
export function ringJudge(rows, jd = DECL.ringJudge) {
  const T = jd.tThinYr * YR, sgn = rows.map((q) => Math.sign(q.dlnI));
  if (!rows.every((q) => q.tiltSignif)) return { thin: false, why: '傾きの率が丸めの程度の点がある(この組は傾きを動かさない)', lambdaNeed: null };
  const sameSign = sgn.every((x) => x !== 0 && x === sgn[0]);
  if (!sameSign) return { thin: false, why: sgn.some((x) => x === 0) ? '傾きの率が 0 の点がある' : '傾きの率の符号が点で違う', lambdaNeed: null };
  const lam = -1 / (T * Math.min(...rows.map((q) => Math.abs(q.dlnI)))) * sgn[0];   // いちばん遅い点が T_thin で e 分の 1
  const kep = Math.max(...rows.map((q) => Math.abs(lam * q.dOmOverOm))), drift = Math.max(...rows.map((q) => Math.abs(lam * q.dlnA) * T)), ecc = Math.max(...rows.map((q) => lam * q.dlnE * T));
  const fastest = Math.max(...rows.map((q) => Math.abs(lam * q.dlnI))) * T;
  const pass = kep <= jd.keplerTol && drift <= jd.driftTol && ecc <= jd.eccTol;
  return { thin: true, lambdaNeed: lam, prograde: lam > 0, kepler: kep, drift, ecc, fastestEfolds: fastest, pass, keplerMaxLambda: Math.max(...rows.map((q) => Math.abs(q.dOmOverOm))) > 0 ? jd.keplerTol / Math.max(...rows.map((q) => Math.abs(q.dOmOverOm))) : null };
}

/* ───────── 代表の時間積分(RK4 —— 源の中心は固定・試験粒子)───────── */
/** 傾き(源の軸に対する)と近点の面内の回転・離心率・半長軸を始めと終わりで比べる(正準の (x, v) の接触の要素) */
export function integrate(sys, eff, { nOrb = DECL.integ.nOrb, steps = DECL.integ.steps[0] } = {}) {
  const orb = sys.orb, mu = orb.mu, k = unit(sys.sunAxis), T = periodOf(orb), h = T / steps, N = nOrb * steps;
  const s0 = stateAt(orb, 0);
  let x = s0.x, v = s0.v;
  const der = (x, v) => { const r = nrm(x), g = scl(x, -mu / (r * r * r)); if (eff.kind === 'vel') return [add(v, eff.d(x, v)), g]; return [v, add(g, eff.a({ x, v, r }))]; };
  const el = (x, v) => { const r = nrm(x), hv = crs(x, v), hn = nrm(hv), W = scl(hv, 1 / hn), ev = sub(scl(crs(v, hv), 1 / mu), scl(x, 1 / r)), a = 1 / (2 / r - dot(v, v) / mu);
    return { i: Math.atan2(nrm(crs(k, W)), dot(W, k)), W, ev, e: nrm(ev), a }; };
  const e0 = el(x, v);
  for (let j = 0; j < N; j++) {
    const [a1, b1] = der(x, v), [a2, b2] = der(add(x, scl(a1, h / 2)), add(v, scl(b1, h / 2))), [a3, b3] = der(add(x, scl(a2, h / 2)), add(v, scl(b2, h / 2))), [a4, b4] = der(add(x, scl(a3, h)), add(v, scl(b3, h)));
    x = add(x, scl(add(add(a1, scl(a2, 2)), add(scl(a3, 2), a4)), h / 6)); v = add(v, scl(add(add(b1, scl(b2, 2)), add(scl(b3, 2), b4)), h / 6));
  }
  const e1 = el(x, v), tt = N * h;
  // 面内の回転(離心率ベクトルの、元の面の法線のまわりの角)
  const Qd = crs(e0.W, unit(e0.ev)), apsAng = Math.atan2(dot(e1.ev, Qd), dot(e1.ev, unit(e0.ev)));
  return { dlnI: Math.log(e1.i / e0.i) / tt, apsW: apsAng / tt, dlnE: Math.log(e1.e / e0.e) / tt, dlnA: Math.log(e1.a / e0.a) / tt, tSec: tt, i0: e0.i, i1: e1.i };
}

/* ───────── 型の棚卸し(静的な表 —— 式の文と R_d の入り方)───────── */
export const INVENTORY = Object.freeze([
  Object.freeze({ key: 'slice', wave: '第332便a・第333便a ①(EQ-29 の切り口 —— 比べる列)', formula: 'U = s_d (R_d² − z²)/ρ(|z| ≤ R_d)', rd: '帯の厚み(|z| ≤ R_d)と大きさ R_d²', speed: 's_d(本枝は s も)', zdep: '赤道面で最大・1 − t²', eqDir: '順(源の自転の向き)', beyond: '0(途切れる)' }),
  Object.freeze({ key: 'pair', wave: '第333便a ②(対向 2 点 —— 比べる列)', formula: 'U = s_d R_d tanh((α/4) ln(1 + 4ρR_d/r₋²))', rd: '源の点の半径 R_d(遠方 α s_d R_d² ρ/r²)', speed: 's_d', zdep: 'ρ/r²(遠方)', eqDir: '順', beyond: '急減なし(ρ/r²)' }),
  Object.freeze({ key: 'ball', wave: '第333便a ②(一様に回る球 —— 比べる列)', formula: 'U = α s_d R_d² ρ/(5r²)(遠方)', rd: '大きさ R_d²(形に入らない)', speed: 's_d', zdep: 'ρ/r²', eqDir: '順', beyond: '急減なし' }),
  Object.freeze({ key: 'lorentz', wave: '第333便a ③(帯と尾 —— 比べる列)', formula: 'U = s_d R_d²/(ρ(1 + t⁸))', rd: '帯の厚み・尾の始まり・大きさ R_d²', speed: 's_d', zdep: '1/(1 + t⁸)', eqDir: '順', beyond: 't⁻⁸(本枝はべき n をノブに)' }),
  Object.freeze({ key: 'T1', wave: '第334便a T1(視線方向の捩れ —— 主の候補・AN646)', formula: 'V = s_d z(β 倍の列は β s_d z)', rd: 's_d を通して(J 案 s_d ∝ R_d⁻²)・β の自己の重み', speed: 's_d', zdep: 'z に比例(赤道面で 0)', eqDir: '赤道面で 0(線のまわりの捩れ)', beyond: 'R_d で区切らない' }),
  Object.freeze({ key: 'T2', wave: '第334便a T2(半渦度の動径の成分 × r)', formula: 'V = r ω_ρ・ω_ρ = −½ ∂U_φ/∂z', rd: '親の U の R_d(切り口は帯の内だけ)', speed: 's_d', zdep: 'z の奇関数', eqDir: '赤道面で 0', beyond: '親の U に従う' }),
  Object.freeze({ key: 'T3', wave: '第334便a T3(比較用のスカラー則)', formula: 'V = β A s_d ρ (z/r)/(1 + (|z|/H)^ℓ)', rd: 'H = R_d(主)', speed: 's_d', zdep: 'z/r', eqDir: '赤道面で 0', beyond: '(|z|/H)^−ℓ' }),
  Object.freeze({ key: 'oblate', wave: '第334便a 扁平の則(AN648・AN649)', formula: 'R_eq = R_d/(1 − f_flat)^{1/3}(体積を保つ・J 固定)', rd: '赤道の引きずり半径を広げる', speed: 'J 固定で s_d R_eq² 一定', zdep: '—', eqDir: '—', beyond: '—' }),
  Object.freeze({ key: 'EQ15', wave: 'エンジンの opt-in の回転の項(EQ-15 —— 実装〔opt-in〕)', formula: '源の球の内部の速度の近い側と遠い側の差のモーメント(遠方 C₁R_d/r × s R_src²/(5r²) の桁)', rd: 'K1 の核 R_d と源のモーメントの半径 R_src(invSq.sourceMoment)', speed: 's(観測自転)', zdep: '源のモーメントの形', eqDir: '順', beyond: '遠方 1/r² の桁' }),
  Object.freeze({ key: 'T1part', wave: '第335便b(T1 の部位の速さ)', formula: '横のずれ b⊥ の部位で Ω∥ × b⊥(Ω∥ = s z/r)', rd: '入らない(s は観測自転)', speed: 's', zdep: 'z/r', eqDir: '赤道面で 0', beyond: '—' }),
  Object.freeze({ key: 'R1R4', wave: '第335便c(水星の回転の列 R1〜R4)', formula: '対向 2 点 α = 2 の押し・切り口・T1 の 4 向き', rd: '切り口と対向 2 点は R_d(Y_k m)・T1 は入らない', speed: 's/s_d', zdep: '列ごと', eqDir: '列ごと', beyond: '列ごと' }),
]);

/* ───────── 純関数の場面と門 ───────── */
export function pureScenes() {
  const S = {}, sat = sourceOf('saturn'), sun = sourceOf('sun');
  // ① 場の型が第333便a・第334便a の関数と同じ(切り口・lorentz〔lor8〕・球の遠方・ω の切り口と球)
  { const Rd = 5, sp = 1.3, pts = [[1e8, 0], [1e8, 2], [1e8, 4.9], [1e8, 7], [3e4, 1]]; let dU = 0, dW = 0;
    for (const [rho, z] of pts) {
      dU = Math.max(dU, Math.abs(profileUW('slice', rho, z, Rd, sp).U - sliceVel({ rho, z, Rd, sd: sp })) / (sp * Rd * Rd / rho));
      dU = Math.max(dU, Math.abs(profileUW('lor8', rho, z, Rd, sp).U - tailVel('lorentz', { rho, z, Rd, sd: sp })) / (sp * Rd * Rd / rho));
      dU = Math.max(dU, Math.abs(profileUW('ball', rho, z, Rd, sp).U - farVel({ rho, z, Rd, sd: sp, alpha: 2, kind: 'ball' })) / (sp * Rd * Rd / rho));
      const ws = t2Vort({ rho, z, Rd, sd: sp, col: 'slice' }).omega, wb = t2Vort({ rho, z, Rd, sd: sp, col: 'ball' }).omega, sc = sp / rho;
      dW = Math.max(dW, Math.abs(profileUW('slice', rho, z, Rd, sp).om - ws) / sc, Math.abs(profileUW('ball', rho, z, Rd, sp).om - wb) / sc);
    }
    S.match = { U: dU, om: dW }; }
  // ② ω = −½ ∂U/∂z(中心差分 —— lor2・lor4・src・ball)
  { const Rd = 5, sp = 1, RK1 = 5; let d = 0;
    for (const prof of ['lor2', 'lor4', 'src', 'ball']) for (const [rho, z] of [[1e3, 3], [1e3, 7], [50, 20]]) {
      const hh = 1e-4 * Rd, f = (zz) => profileUW(prof, rho, zz, Rd, sp, RK1).U, num = -0.5 * (f(z + hh) - f(z - hh)) / (2 * hh), an = profileUW(prof, rho, z, Rd, sp, RK1).om;
      d = Math.max(d, Math.abs(num - an) / Math.max(Math.abs(an), 1e-300)); }
    S.deriv = d; }
  // ③ 引きずり半径の読み: Req ÷ Yk = (1 − f)^{−1/3}・J 案の s_d R_d² は R_d に依らない・Rsrc = R_obs √(5f/2)
  { const y = rdOf(sat, 'Yk'), q = rdOf(sat, 'Req'), m1 = speedOf(sat, 'sd', y) * y * y, m2 = speedOf(sat, 'sd', 10 * y) * 100 * y * y;
    S.readings = { req: Math.abs(q / y / Math.pow(1 - sat.fFlat, -1 / 3) - 1), jfix: Math.abs(m2 / m1 - 1), rsrc: Math.abs(rdOf(sat, 'Rsrc') / (sat.Robs * Math.sqrt(2.5 * sat.fObs)) - 1), kscale: Math.abs(rdOf(sun, 'Yk', 1e3) / (1e3 * kappaMRadius(sun.m)) - 1) }; }
  // ④ λ = 0 で全部の作用の型の率が 0・λ に比例(一次)
  { const sys = ringSys(sat, { r: 1.0e8, zMax: 3 }), pts = pointsOf(sys, rdOf(sat, 'Yk')); let z0 = 0, lin = 0;
    for (const action of ACTIONS) { const sp = { prof: 'lor4', action, reading: 'Yk', speed: 'obs' };
      const R0 = ringRow(sys, effectOfSpec(sat, { ...sp, lambda: 0 }), pts), R1 = ringRow(sys, effectOfSpec(sat, { ...sp, lambda: 1e-9 }), pts), R2 = ringRow(sys, effectOfSpec(sat, { ...sp, lambda: 2e-9 }), pts);
      z0 = Math.max(z0, ...['dlnI', 'dlnE', 'apsW', 'dnode', 'dlnA', 'dOmOverOm'].map((k) => Math.abs(R0[k])));
      const big = ['dlnI', 'dlnA', 'dnode', 'dOmOverOm'].map((k) => [k, Math.abs(R1[k])]).reduce((a, b) => (b[1] > a[1] ? b : a));
      lin = Math.max(lin, Math.abs(R2[big[0]] - 2 * R1[big[0]]) / Math.abs(R1[big[0]])); }
    S.zero = { zero: z0, lin }; }
  // ⑤ 閉じた式: 帯の内(z_max ≪ R_d)の鉛直へ寄せる場(切り口 —— a = λ s r/ρ)は di/dt = −(a/2) sin i cos i・相対の鉛直(dampz —— S ≈ 1 − t²)は di/dt ≈ −(γ/2) tan i 〔小さい i〕
  { const sys = ringSys(sat, { r: 1.0e8, zMax: 0.05 }), pts = pointsOf(sys, rdOf(sat, 'Yk')), lam = 1e-9, i = sys.iRad;
    const Rf = ringRow(sys, effectOfSpec(sat, { prof: 'slice', action: 'focus', reading: 'Yk', speed: 'obs', lambda: lam }), pts), af = lam * sat.s;
    const Rz = ringRow(sys, effectOfSpec(sat, { prof: 'slice', action: 'dampz', reading: 'Yk', speed: 'obs', lambda: lam }), pts), gz = lam * Math.abs(sat.s);
    S.closed = { focus: Math.abs(Rf.dlnI * i / (-(af / 2) * Math.sin(i) * Math.cos(i)) - 1), dampz: Math.abs(Rz.dlnI / (-gz / 2) - 1) }; }
  // ⑥ 座標を運ぶ方位の場(vel)は半長軸を動かさない(⟨a·d⟩ = 0)・傾きの率は交点の率より桁で小さい/剛体の場(並進の回転の分)の公転のずれ = λ s/n
  { const sys = ringSys(sat, { r: 1.2e8, zMax: 10 }), pts = pointsOf(sys, rdOf(sat, 'Yk')), R = ringRow(sys, effectOfSpec(sat, { prof: 'lor2', action: 'vel', reading: 'Yk', speed: 'obs', lambda: 1e-9 }), pts);
    const Rg = ringRow(sys, controlEffect(sys, sat, 'rigid', 1e-9), pts);
    S.vel = { dlnA: Math.abs(R.dlnA) / Math.abs(R.dnode), tilt: Math.abs(R.dlnI * sys.iRad) / Math.abs(R.dnode), rigid: Math.abs(Rg.dOmOverOm / (1e-9 * sat.s / nOf(sys.orb)) - 1) }; }
  // ⑦ 高さ則 T1 の鉛直へ寄せる場は半径に依らず d ln i/dt = −λ s/2(小さい i —— 一様厚みの区間の恒等式)・主の読みは扁平の則(R_eq)
  { const lam = 1e-9, a = [7.07e7, 1.40e8].map((r) => { const sys = ringSys(sat, { r, zMax: 0.5 }); return ringRow(sys, heightLawEffect(sat, { law: 'T1', lambda: lam }), pointsOf(sys, rdOf(sat, 'Req'))).dlnI; });
    S.uniform = { t1: Math.max(...a.map((x) => Math.abs(x / (-lam * sat.s / 2) - 1))), main: DECL.mainReading === 'Req' ? 0 : 1 }; }
  // ⑧ 入力の拒否
  const rejects = (f) => { try { f(); return false; } catch (e) { return e instanceof RangeError; } };
  S.rejects = [rejects(() => profileUW('box', 1, 0, 1, 1)), rejects(() => profileUW('slice', 0, 0, 1, 1)), rejects(() => rdOf(sat, 'Rx')), rejects(() => speedOf(sat, 'fast', 1)),
    rejects(() => effectOfSpec(sat, { prof: 'slice', action: 'spin', reading: 'Yk', speed: 'obs' })), rejects(() => sourceOf('moon')), rejects(() => ringSys(sat, { r: 1e8, zMax: 0 })), rejects(() => profileUW('src', 1, 0, 1, 1, null))];
  return S;
}
export function pureGates(S) {
  return {
    match: S.match.U <= 1e-12 && S.match.om <= 1e-12,
    deriv: S.deriv <= 1e-6,
    readings: S.readings.req <= 1e-12 && S.readings.jfix <= 1e-12 && S.readings.rsrc <= 1e-12 && S.readings.kscale <= 1e-12,
    zero: S.zero.zero === 0 && S.zero.lin <= 1e-9,
    closed: S.closed.focus <= 1e-6 && S.closed.dampz <= 1e-4,
    vel: S.vel.dlnA <= 1e-9 && S.vel.tilt <= 1e-6 && S.vel.rigid <= 1e-9,
    uniform: S.uniform.t1 <= 1e-6 && S.uniform.main === 0,
    rejects: S.rejects.length === 8 && S.rejects.every(Boolean),
  };
}
export { kappaMRadius, nOf, periodOf, CENTURY_S, toArcsecCy, anglesOn, YR, ARCSEC };
