// 第352便e(原仮定者の整理(2026-11-24 —— 第148報)・統括の検証項目 R442):
//   **太陽を受け手に置いた診断の純関数 —— 惑星由来の局所の項(受け手 = 太陽・源 = 8 惑星の 1 つずつ・(M)(S)(MS))・背景だけに応答するときの合成の向きと円錐の半頂角・
//   歳差の周期と背景の大きさの行き来(逆算の器)・「一定の向きへ倒す率と歳差の率が同時に在るときの中心の点」の候補の式 —— 診断だけ**
//   (器 tests/exp-w352e-sunrecv.mjs と QA behavior.sunrecv352e・docs.sunrecv352e が読む —— html を読まない・ファイルを読まない・状態を持たない。後のラウンドの枝もこの口を import する)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない。
//   既存の lib は呼ぶだけ(本文は変えない): 第351便c(pairInput・partRot・galWeight)・第351便e(localOf・bgTerm・uEqMag)・第348便h(makeField3・rot3・YK)・第350便b(equivR)・
//   第350便e(uVec・UDECL)・第347便h(gaussLegendre)・第348便c(massOf)・第347便e(t1Table・geometry)・第312便a(Kball)・第337便c(定数・年齢の宣言)。
//
// ■ 作り: 第351便c の partRot と同じ(在位の形の makeField3・位相 72 の平均・読み (C2) 球の半径の平均〔GL 8 点〕/(W) 中心)。源の入力だけを切り替える約束も同じ
//   ((M) 相対の速度だけ・(S) 源の自転だけ・(MS) 両方)。本 lib の rotOf は、組の入力 P を引数で受ける形に書き直した同じ式 —— partRot の地球|太陽と同じ入力で数値の一致を pureGates に置く。
// ■ 受け手と源の入れ替え(太陽を受け手に): 受け手の質量 = 太陽・受け手の自転軸 = geometry() の s(太陽の自転軸)・源の質量 = 惑星・源の自転軸 = geometry() の w(逆行は向きに入れてある)・
//   源の自転の率 = 第347便e の t1Table の omega(惑星の自転)・距離 a と公転の法線 n は惑星|太陽の組と同じ・相対の速さは公転の速さ √(G M_太陽 ÷ a)(惑星|太陽の組と同じ)。
//   受け手を原点・源を −a r̂ に静止・受け手が +v r̂ の直交の向きに動く形は、位相の平均の下で「源が +a r̂・受け手が −v」と同じ(r̂ → −r̂ の置き換え)。
//   分母は自分(太陽)と源(その惑星)だけ(extraW で足せる —— 既定 0)。半径は規則の半径 Y_k m。
// ■ 背景: 一様な背景の角速度(第350便e の uVec —— rdPow 0・銀河の公転の角速度 × 倍率)。向きの名: (G−) 銀河の回転と逆向き・(G+) 同じ向き・(N+) 太陽系の基準軸の向き・(N−) その逆。
//   基準軸は引数で渡す(既定は共通ブリーフの等重みの軸の定数 REF.eq —— 零試験で 8 惑星の公転の法線から作り直して照合)。
// ■ 周期と背景の大きさ: 周期 P = 2π ÷ (比 × k₂ × |Ω|)(比 = ω_T ÷ ω_L・k₂ = 歳差の経路の係数 —— 太陽の応答の係数は 1 を主に置く)。
// ■ 中心の点の候補の式(T5): dŝ/dt = Ω_p p̂ × ŝ + A ê(p̂ = 基準軸・ê = p̂ に直交する一定の向き・A 一定)→ 止まる点 ŝ* は p̂ から sin θ* = A ÷ Ω_p だけ離れ、軸はそのまわりを回る —— 候補の式。
//   本 lib の步(RK4・正規化)で数値と照合する(半頂角を保つのに要る A は、ŝ* を太陽の自転軸の角に置いた値)。
// ■ 言わないこと: 背景軸引きずりが算出できた・太陽の傾きの原因が分かった、とは書かない。この場・この成分・この読み・この係数では、の表。
import * as SP from './lib-w351c-srcparts.mjs';
import * as BB from './lib-w351e-bgbalance.mjs';
import * as G3 from './lib-w348h-axisgeo3.mjs';
import * as SC from './lib-w350b-sphereconv.mjs';
import * as BG from './lib-w350e-bgaxial.mjs';
import * as H from './lib-w347h-axisdiff.mjs';
import * as C from './lib-w348c-axisbalance.mjs';
import * as E from './lib-w347e-spintorque.mjs';
import * as D from './lib-w312a-decay.mjs';
import * as TL from './lib-w337c-tidelock.mjs';

export const LIB_VERSION = 'w352e-sunrecv-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const YR = TL.YR, G = TL.G_SI, C0 = TL.C_SI, AS = 180 * 3600 / Math.PI, D2R = Math.PI / 180;
export const AS_YR = YR * AS;

/* ───────── 宣言 ───────── */
export const PLANETS = Object.freeze(['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune']);
/** 太陽系の基準軸の候補(黄道 J2000 の成分 —— 共通ブリーフの統括の数え直し 1 の数・7 桁) */
export const REF = Object.freeze({
  eq: Object.freeze([0.0339521, -0.0096634, 0.9993767]), lw: Object.freeze([0.0262660, 0.0083219, 0.9996203]), ecl: Object.freeze([0, 0, 1]),
  names: Object.freeze({ eq: '等しい重み(8 惑星の公転の法線)', lw: '質量 × √a の重み(角運動量の代わり)', ecl: '黄道の極' }),
  sunDeg: Object.freeze({ eq: '5.230', lw: '5.968', ecl: '7.252' }),
});
export const DECL = Object.freeze({
  parts: SP.DECL.parts, reads: SP.DECL.reads, mainRead: 'C2', mainPart: 'S',
  dirs: Object.freeze(['G-', 'G+', 'N+', 'N-']),
  dirNames: Object.freeze({ 'G-': '(G−) 銀河の回転と逆向き', 'G+': '(G+) 銀河の回転と同じ向き', 'N+': '(N+) 太陽系の基準軸の向き', 'N-': '(N−) 基準軸と逆向き' }),
  omegaG: BG.UDECL.omegaGalRadS,
  /** 背景の大きさの列(銀河の公転の角速度の倍)—— uV は金星で (S) と大きさが同じ(k 1 —— 零試験で作り直す)・格子・比べる列 8500 */
  uV: 1.19282e-12, mults: Object.freeze([1, 10, 100, 8500]),
  ageYr: TL.DECL.bodies.ageYr,
  nPhase: SP.DECL.nPhase, ballN: SP.DECL.ballN,
  sinFloor: 1e-12,
});

/* ───────── 小さな道具 ───────── */
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const scl = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const unit = (a) => { const m = nrm(a); return m > 0 ? scl(a, 1 / m) : [0, 0, 0]; };
const isVec = (a) => Array.isArray(a) && a.length === 3 && a.every(fin);
const rel = (a, b) => nrm(sub(a, b)) / Math.max(nrm(b), 1e-300);
const perpPair = (a) => { const t = Math.abs(a[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0], e2 = unit(crs(a, t)), e3 = crs(a, e2); return [e2, e3]; };
/** 2 つのベクトルのなす角(°・atan2 の形)—— どちらかが 0 なら null */
export const angDeg = (a, b) => (nrm(a) > 0 && nrm(b) > 0 ? Math.atan2(nrm(crs(a, b)), dot(a, b)) / D2R : null);
export const vec = Object.freeze({ dot, crs, nrm, scl, add, sub, unit });
const GL = H.gaussLegendre(DECL.ballN);
const partScales = (part) => {
  if (part === 'M') return [1, 0]; if (part === 'S') return [0, 1]; if (part === 'MS') return [1, 1];
  throw new RangeError('rotOf: 成分は M・S・MS');
};

/* ───────── 組の入力 ───────── */
/** 受け手 = 太陽・源 = 惑星 id の入力(上の ■ の入れ替え)。P は rotOf が読む形 { m, Ms, Rs?, sHat, nHat, sAx, ws, a, vOrb } */
export function sunInput(T1, GEO, id) {
  if (!PLANETS.includes(id)) throw new RangeError('sunInput: 源は 8 惑星');
  const B = SP.pairInput(T1, GEO, id, 'Sun'), r2 = T1.find((r) => r.id === id && r.src === 'Sun' && r.mag === 'm2');
  return { id: 'Sun', src: id, m: B.Ms, Ms: B.m, sHat: B.sAx, nHat: B.nHat, sAx: B.sHat, ws: r2.omega, a: B.a, vOrb: B.vOrb, beta: B.beta, made: '惑星|太陽の組の受け手と源を入れ替え(相対の速さは公転の速さ)' };
}

/* ───────── 成分の回転(第351便c の partRot と同じ式 —— 入力 P を引数で受ける)───────── */
/**
 * 由来 1 つの成分の回転(1 公転の平均・rad/s)。part 'M'・'S'・'MS'/read 'C2'・'W'/extraW = 他の由来の重み(分母だけ)/k = 換算の係数(局所の項に掛ける)/
 * mut = makeField3 の変異/velScale・spinScale = 零試験の口。戻り値 { Om:[3], A0(受け手の自分の重みの中心の値), wS(源の重みの中心の値) }
 */
export function rotOf(P, { part, read = 'C2', extraW = 0, k = 1, mut = null, velScale = null, spinScale = null, nPhase = DECL.nPhase } = {}) {
  const [v0, s0] = partScales(part);
  if (!DECL.reads.includes(read)) throw new RangeError('rotOf: 読みは C2・W');
  if (!(fin(k) && k >= 0)) throw new RangeError('rotOf: 換算の係数 k ≥ 0');
  if (!(fin(extraW) && extraW >= 0)) throw new RangeError('rotOf: extraW ≥ 0');
  const vs = velScale === null ? v0 : velScale, ss = spinScale === null ? s0 : spinScale;
  const Rr = G3.YK * P.m, Rs = fin(P.Rs) ? P.Rs : G3.YK * P.Ms;
  const x0 = crs(P.sAx, P.nHat), x = nrm(x0) > 1e-12 ? unit(x0) : perpPair(P.nHat)[0], y = crs(P.nHat, x);
  const radii = read === 'W' ? [[Rr, 1]] : GL.x.map((xi, i) => { const rho = 0.5 * Rr * (xi + 1); return [SC.equivR(Rr, rho), 0.5 * Rr * GL.w[i] * 5 * Math.pow(rho, 4) / Math.pow(Rr, 5)]; });
  const spin = scl(P.sAx, P.ws * ss);
  let Om = [0, 0, 0];
  for (const [Ri, wt] of radii) {
    let mW = [0, 0, 0];
    for (let j = 0; j < nPhase; j++) {
      const ph = 2 * Math.PI * (j + 0.5) / nPhase, rh = add(scl(x, Math.cos(ph)), scl(y, Math.sin(ph))), vh = crs(P.nHat, rh);
      const f = G3.makeField3({ sources: [{ m: P.Ms, R: Rs, p: scl(rh, -P.a), v: [0, 0, 0], spin }], recv: { m: P.m, R: Ri, p: [0, 0, 0], v: scl(vh, P.vOrb * vs) },
        W0: 0, extraW, kernel: { kind: 'ball', al: 1 }, rot: { form: 'M' }, self: true, mut });
      mW = add(mW, scl(G3.rot3('W', f, [0, 0, 0], { Rb: Ri }), 1 / nPhase));
    }
    Om = read === 'W' ? mW : add(Om, scl(mW, wt));
  }
  return { Om: k === 1 ? Om : scl(Om, k), A0: P.m * D.Kball(1, 0, Rr), wS: P.Ms * D.Kball(1, P.a, Rs) };
}

/* ───────── 約束の口 ───────── */
/**
 * 太陽を受け手にした惑星由来の局所の項。戻り値 { byPlanet: { <id>: { M, S, MS } }, sum: { M, S, MS }, sHat(太陽の自転軸), wSelf(太陽の自分の重みの中心の値) }(各 [3]・rad/s・k を掛けた後)
 */
export function sunLocal(T1 = E.t1Table(), GEO = E.geometry(), { read = DECL.mainRead, k = 1, extraW = 0, planets = PLANETS } = {}) {
  const byPlanet = {}, sum = { M: [0, 0, 0], S: [0, 0, 0], MS: [0, 0, 0] };
  let sHat = null, wSelf = null;
  for (const id of planets) {
    const P = sunInput(T1, GEO, id), row = {};
    for (const p of DECL.parts) { const r = rotOf(P, { part: p, read, k, extraW }); row[p] = r.Om; sum[p] = add(sum[p], r.Om); wSelf = r.A0; }
    byPlanet[id] = row; sHat = P.sHat;
  }
  return { byPlanet, sum, sHat, wSelf };
}
/** 背景のベクトル(rad/s): 向き dir('G-'・'G+'・'N+'・'N-')・倍率 mult(銀河の公転の角速度の倍)・基準軸 ref(N± のとき) */
export function bgVecOf({ dir = 'G-', mult = 1, ref = REF.eq } = {}) {
  if (!DECL.dirs.includes(dir)) throw new RangeError('bgVecOf: 向きは G-・G+・N+・N-');
  if (!(fin(mult) && mult >= 0)) throw new RangeError('bgVecOf: 倍率 ≥ 0');
  if (!isVec(ref) || nrm(ref) === 0) throw new RangeError('bgVecOf: 基準軸');
  const mag = DECL.omegaG * mult;
  if (dir === 'G-' || dir === 'G+') return BG.uVec(mag, 'rd0', C.massOf('Sun'), dir === 'G-' ? -1 : 1);
  return scl(unit(ref), dir === 'N+' ? mag : -mag);
}
/**
 * 太陽の合成: Ω = bg + Σ(局所の part)(局所は sunLocal の k を掛けた後)。戻り値 { Om, eq(合成の向き —— 0 なら null), coneDeg(合成と太陽の自転軸の角), refDeg(合成と ref の角) }
 * loc を渡すと sunLocal を数え直さない。
 */
export function sunTotal(T1 = E.t1Table(), GEO = E.geometry(), { part = DECL.mainPart, bg = [0, 0, 0], read = DECL.mainRead, k = 1, ref = REF.eq, loc = null } = {}) {
  if (!DECL.parts.includes(part)) throw new RangeError('sunTotal: 成分は M・S・MS');
  if (!isVec(bg)) throw new RangeError('sunTotal: bg は [3]');
  const L = loc || sunLocal(T1, GEO, { read, k });
  const Om = add(bg, L.sum[part]), m = nrm(Om);
  return { Om, eq: m > 0 ? scl(Om, 1 / m) : null, coneDeg: angDeg(L.sHat, Om), refDeg: angDeg(ref, Om), mag: m };
}
/**
 * 歳差の周期と背景の大きさの行き来。周期 periodYr(年)を与えると { radS, mult(ω_G の倍) }・P = 2π ÷ (ratio × kPrec × |Ω|)。
 */
export function invertBg({ periodYr, ratio = 1, kPrec = 1 } = {}) {
  if (!(fin(periodYr) && periodYr > 0 && fin(ratio) && ratio > 0 && fin(kPrec) && kPrec > 0)) throw new RangeError('invertBg: 周期・比・係数 > 0');
  const radS = 2 * Math.PI / (periodYr * YR * ratio * kPrec);
  return { radS, mult: radS / DECL.omegaG, asYr: radS * AS_YR };
}
/** 逆の口: 背景の大きさ(radS か mult)から歳差の周期(年)・方位の率(rad/s) */
export function bgPeriod({ radS = null, mult = null, ratio = 1, kPrec = 1 } = {}) {
  const w = radS !== null ? radS : (mult !== null ? mult * DECL.omegaG : NaN);
  if (!(fin(w) && w > 0 && fin(ratio) && ratio > 0 && fin(kPrec) && kPrec > 0)) throw new RangeError('bgPeriod: 大きさ・比・係数 > 0');
  const rate = ratio * kPrec * w;
  return { periodYr: 2 * Math.PI / rate / YR, rateRadS: rate, rateAsYr: rate * AS_YR };
}
/** 時間 tYr の間に方位が進む角(°)と周の数 */
export function azAdvance({ rateRadS, tYr }) {
  if (!(fin(rateRadS) && rateRadS >= 0 && fin(tYr) && tYr >= 0)) throw new RangeError('azAdvance: 率 ≥ 0・時間 ≥ 0');
  const rad = rateRadS * tYr * YR;
  return { deg: rad / D2R, turns: rad / (2 * Math.PI) };
}
/** 方位の率と傾きの率(極 pole のまわり —— az は右ねじで正・inc は極に対する傾きが増える向きを正)—— 枝 d の poleRates と同じ定義(本 lib の写し) */
export function poleRatesLocal(pole, s, ds) {
  const p = unit(pole), t = crs(p, s), st = nrm(t);
  return st < 1e-10 ? { inc: null, az: null } : { inc: -dot(p, ds) / st, az: dot(t, ds) / (st * st) };
}

/* ───────── 中心の点の候補の式(T5)───────── */
/** 止まる点の離れ(候補の式): sin θ* = A ÷ Ω_p(A ≤ Ω_p)—— A を与えると θ*(°)/逆に θ*(°)を与えると A = Ω_p sin θ*(小角では Ω_p θ*) */
export function fixedOffset({ A = null, Op, thDeg = null }) {
  if (!(fin(Op) && Op > 0)) throw new RangeError('fixedOffset: Ω_p > 0');
  if (thDeg !== null) { if (!(fin(thDeg) && thDeg >= 0 && thDeg <= 90)) throw new RangeError('fixedOffset: 0 ≤ θ ≤ 90'); return { A: Op * Math.sin(thDeg * D2R), Asmall: Op * thDeg * D2R }; }
  if (!(fin(A) && A >= 0 && A <= Op)) throw new RangeError('fixedOffset: 0 ≤ A ≤ Ω_p');
  return { thDeg: Math.asin(A / Op) / D2R };
}
/** 步(RK4・刻みごとに正規化): dŝ/dt = Op p̂ × ŝ + A ê(ê = p̂ に直交する一定の向き)。戻り値 { s, minDeg, maxDeg }(ŝ と中心 c のなす角の範囲) */
export function tiltPrecStep({ s0, p, e, Op, A, T, dt, center = null }) {
  if (!(isVec(s0) && isVec(p) && isVec(e) && fin(Op) && fin(A) && fin(T) && fin(dt) && dt > 0 && T > 0)) throw new RangeError('tiltPrecStep: 入力');
  const pu = unit(p), eu = unit(sub(e, scl(pu, dot(e, pu)))), f = (s) => add(scl(crs(pu, s), Op), scl(eu, A));
  let s = unit(s0), mn = Infinity, mx = -Infinity;
  const c = center ? unit(center) : null, n = Math.round(T / dt);
  for (let i = 0; i < n; i++) {
    const k1 = f(s), k2 = f(add(s, scl(k1, dt / 2))), k3 = f(add(s, scl(k2, dt / 2))), k4 = f(add(s, scl(k3, dt)));
    s = unit(add(s, scl(add(add(k1, scl(k2, 2)), add(scl(k3, 2), k4)), dt / 6)));
    if (c) { const a = angDeg(c, s); mn = Math.min(mn, a); mx = Math.max(mx, a); }
  }
  return { s, minDeg: c ? mn : null, maxDeg: c ? mx : null };
}
/** 止まる点 ŝ*(p̂ と ê の面の中 —— p̂ × ŝ* が −ê の向きに A ÷ Ω_p)。Op p̂ × ŝ* = −A ê ⇒ ŝ* = cos θ* p̂ + sin θ* (p̂ × ê)(ê ⊥ p̂ のとき —— ê·ŝ* = 0 なので球面の上でも止まる) */
export function fixedPoint({ p, e, Op, A }) {
  const pu = unit(p), eu = unit(sub(e, scl(pu, dot(e, pu)))), th = Math.asin(A / Op);
  return add(scl(pu, Math.cos(th)), scl(crs(pu, eu), Math.sin(th)));
}

/* ───────── 零試験 ───────── */
/** 統括の数え直し 1 の数(共通ブリーフ)—— 自分の lib で作り直して照合する */
export const ANCHOR = Object.freeze({
  refEq: '0.0339521 -0.0096634 0.9993767', refLw: '0.0262660 0.0083219 0.9996203', sunDeg: REF.sunDeg,
  gmSunDeg: '67.231', gmRefDeg: Object.freeze({ eq: '62.136', lw: '61.695', ecl: '60.189' }),
  uV: '1.19282e-12', uVMS: '25.4221', bgVRadS: '1.08427e-27',
});
const aOfSun = (T1, id) => { const r2 = T1.find((r) => r.id === id && r.src === 'Sun' && r.mag === 'm2'); const beta = r2.Om1 / r2.OmegaT; return G * C.massOf('Sun') / (beta * C0 * C0); };
/** 8 惑星の公転の法線から基準軸を作る(等重み・質量 × √a の重み)—— 零試験と表の照合用(基準軸の口は枝 c が持つ) */
export function refAxesFrom(T1 = E.t1Table(), GEO = E.geometry()) {
  const ns = PLANETS.map((id) => unit(GEO[id + '|Sun'].n));
  return { eq: unit(ns.reduce((s, n) => add(s, n), [0, 0, 0])), lw: unit(PLANETS.reduce((s, id, i) => add(s, scl(ns[i], C.massOf(id) * Math.sqrt(aOfSun(T1, id)))), [0, 0, 0])), ecl: [0, 0, 1] };
}
/** 金星で (S)(と (MS))と背景の大きさが同じになる倍率(第351便e の localOf・uEqMag —— k 1・(C2)・分母 out) */
export function uVenus(T1 = E.t1Table(), GEO = E.geometry(), cache = null) {
  const V = BB.localOf(T1, GEO, 'Venus', 'Sun', { k: 1 }, cache), b1 = BB.bgTerm('Venus', { u: 1 }).vec;
  return { S: BB.uEqMag(V.sun.S, b1), MS: BB.uEqMag(V.sun.MS, b1) };
}
const f3 = (v) => v.toFixed(3), f7 = (a) => a.map((x) => x.toFixed(7)).join(' ');
export function pureScenes(T1 = E.t1Table(), GEO = E.geometry()) {
  // ① 入れ替える前の形(partRot の地球|太陽)と同じ入力で rotOf が同じ数(3 成分 × 2 読み)
  let vsPart = 0;
  const PE = SP.pairInput(T1, GEO, 'Earth', 'Sun');
  for (const part of DECL.parts) for (const read of DECL.reads) vsPart = Math.max(vsPart, rel(rotOf(PE, { part, read }).Om, SP.partRot(T1, GEO, 'Earth', 'Sun', { part, read }).Om));
  // ② 太陽を受け手に: (M) + (S) = (MS)(線形)・(S) は直接に数える(相対の速度 0)・惑星の質量 0 の変異で 0
  const L = sunLocal(T1, GEO, { read: 'C2' }), LW = sunLocal(T1, GEO, { read: 'W' });
  let lin = 0;
  for (const id of PLANETS) { const r = L.byPlanet[id]; lin = Math.max(lin, nrm(sub(add(r.M, r.S), r.MS)) / Math.max(nrm(r.M), nrm(r.S))); }
  const PJ = sunInput(T1, GEO, 'Jupiter');
  const sDirect = { velOfS: partScales('S')[0], vel0: rel(rotOf(PJ, { part: 'MS', velScale: 0 }).Om, L.byPlanet.Jupiter.S) };
  const mass0 = DECL.parts.map((part) => nrm(rotOf({ ...PJ, Ms: 0, Rs: G3.YK * PJ.Ms }, { part }).Om));
  // ③ 入れ替えの入力: 受け手の質量 = 太陽・自転軸 = 太陽(8 組で同じ)・距離は惑星|太陽と同じ・源の軸 = 惑星の w
  let swap = 0;
  for (const id of PLANETS) { const P = sunInput(T1, GEO, id), B = SP.pairInput(T1, GEO, id, 'Sun'); swap = Math.max(swap, Math.abs(P.m - C.massOf('Sun')) / P.m, rel(P.sHat, unit(GEO['Earth|Sun'].s)), Math.abs(P.a / B.a - 1), rel(P.sAx, unit(GEO[id + '|Sun'].w))); }
  // ④ 統括の数え直し 1 の数
  const ax = refAxesFrom(T1, GEO), sunS = L.sHat, gm = bgVecOf({ dir: 'G-', mult: 1 }), uv = uVenus(T1, GEO);
  const anchor = { refEq: f7(ax.eq), refLw: f7(ax.lw), sunDeg: { eq: f3(angDeg(ax.eq, sunS)), lw: f3(angDeg(ax.lw, sunS)), ecl: f3(angDeg(ax.ecl, sunS)) },
    gmSunDeg: f3(angDeg(sunS, gm)), gmRefDeg: { eq: f3(angDeg(ax.eq, gm)), lw: f3(angDeg(ax.lw, gm)), ecl: f3(angDeg(ax.ecl, gm)) },
    uV: uv.S.toExponential(5), uVMS: uv.MS.toFixed(4), bgVRadS: nrm(bgVecOf({ dir: 'G-', mult: uv.S })).toExponential(5) };
  const refConst = rel(ax.eq, REF.eq) < 1e-6 && rel(ax.lw, REF.lw) < 1e-6;
  // ⑤ 背景の向きの約束: G+ = −G−・N− = −N+・(G−) は第351便e の bgTerm と同じ・大きさは ω_G × 倍率
  const dirs = { gpm: rel(bgVecOf({ dir: 'G+', mult: 3 }), scl(bgVecOf({ dir: 'G-', mult: 3 }), -1)), npm: rel(bgVecOf({ dir: 'N-', mult: 3 }), scl(bgVecOf({ dir: 'N+', mult: 3 }), -1)),
    vsBB: rel(bgVecOf({ dir: 'G-', mult: 7 }), BB.bgTerm('Sun', { u: 7 }).vec), mag: Math.abs(nrm(bgVecOf({ dir: 'N+', mult: 7 })) / (7 * DECL.omegaG) - 1) };
  // ⑥ 合成: 背景だけ(局所 0 の場合)の円錐 = 背景と自転軸の角・(N+) は 5.230°
  const zeroLoc = { sum: { M: [0, 0, 0], S: [0, 0, 0], MS: [0, 0, 0] }, sHat: sunS };
  const cone = { np: f3(sunTotal(T1, GEO, { bg: bgVecOf({ dir: 'N+' }), loc: zeroLoc }).coneDeg), gm: f3(sunTotal(T1, GEO, { bg: gm, loc: zeroLoc }).coneDeg), nul: sunTotal(T1, GEO, { loc: zeroLoc }).eq === null };
  // ⑦ 周期と背景の大きさの行き来(往復)・倍率 1 の周期 = 2π ÷ ω_G・率は比 × k₂ に比例
  const P1 = bgPeriod({ mult: 1 }), back = invertBg({ periodYr: P1.periodYr }), P2 = bgPeriod({ mult: 1, ratio: 2, kPrec: 5 });
  const period = { galYr: Math.abs(P1.periodYr / (2 * Math.PI / DECL.omegaG / YR) - 1), round: Math.abs(back.mult - 1), scale: Math.abs(P2.periodYr * 10 / P1.periodYr - 1) };
  // ⑧ 中心の点の候補の式と步: ŝ* から始めると動かない・p̂ から始めると ŝ* のまわりを角 θ* で回る(Op 1・A = sin 5.230°)
  const th = 5.230, Op = 1, A = fixedOffset({ Op, thDeg: th }).A, p = [0, 0, 1], e = [1, 0, 0], sStar = fixedPoint({ p, e, Op, A });
  const st0 = tiltPrecStep({ s0: sStar, p, e, Op, A, T: 20, dt: 1e-3, center: sStar }), st1 = tiltPrecStep({ s0: p, p, e, Op, A, T: 2 * Math.PI, dt: 1e-3, center: sStar });
  const fixed = { atStar: st0.maxDeg, offDeg: angDeg(p, sStar) - th, circMin: st1.minDeg - th, circMax: st1.maxDeg - th, inv: fixedOffset({ Op, A }).thDeg - th };
  // ⑨ 拒否
  const rej = [() => rotOf(PE, { part: 'X' }), () => rotOf(PE, { part: 'M', read: 'P2' }), () => rotOf(PE, { part: 'M', k: -1 }), () => sunInput(T1, GEO, 'Moon'), () => bgVecOf({ dir: 'X' }),
    () => bgVecOf({ mult: -1 }), () => invertBg({ periodYr: 0 }), () => bgPeriod({}), () => fixedOffset({ Op: 1, A: 2 }), () => sunTotal(T1, GEO, { part: 'Q', loc: zeroLoc })]
    .map((fn) => { try { fn(); return false; } catch (er) { return er instanceof RangeError; } });
  // 表の素(器が使う)
  const mags = Object.fromEntries(PLANETS.map((id) => [id, Object.fromEntries(DECL.parts.map((pp) => [pp, nrm(L.byPlanet[id][pp]) * AS_YR]))]));
  return { vsPart, lin, sDirect, mass0, swap, anchor, refConst, dirs, cone, period, fixed, rejects: rej, mags, sumAsYr: Object.fromEntries(DECL.parts.map((pp) => [pp, nrm(L.sum[pp]) * AS_YR])),
    wLin: Math.max(...PLANETS.map((id) => nrm(sub(add(LW.byPlanet[id].M, LW.byPlanet[id].S), LW.byPlanet[id].MS)) / Math.max(nrm(LW.byPlanet[id].M), nrm(LW.byPlanet[id].S)))) };
}
export function pureGates(S) {
  const A = ANCHOR, a = S.anchor;
  return {
    vsPartRot: S.vsPart < 1e-12,
    linear: S.lin < 1e-12 && S.wLin < 1e-12,
    sDirect: S.sDirect.velOfS === 0 && S.sDirect.vel0 < 1e-12,
    mass0: S.mass0.every((v) => v === 0),
    swapInput: S.swap < 1e-12,
    anchorRef: a.refEq === A.refEq && a.refLw === A.refLw && S.refConst && Object.entries(A.sunDeg).every(([kk, v]) => a.sunDeg[kk] === v),
    anchorBg: a.gmSunDeg === A.gmSunDeg && Object.entries(A.gmRefDeg).every(([kk, v]) => a.gmRefDeg[kk] === v),
    anchorUV: a.uV === A.uV && a.uVMS === A.uVMS && a.bgVRadS === A.bgVRadS,
    dirs: S.dirs.gpm < 1e-15 && S.dirs.npm < 1e-15 && S.dirs.vsBB < 1e-12 && S.dirs.mag < 1e-12,
    coneBgOnly: S.cone.np === A.sunDeg.eq && S.cone.gm === A.gmSunDeg && S.cone.nul,
    period: S.period.galYr < 1e-12 && S.period.round < 1e-12 && S.period.scale < 1e-12,
    fixedPoint: S.fixed.atStar < 1e-6 && Math.abs(S.fixed.offDeg) < 1e-9 && Math.abs(S.fixed.circMin) < 0.05 && Math.abs(S.fixed.circMax) < 0.05 && Math.abs(S.fixed.inv) < 1e-9,
    rejects: S.rejects.length === 10 && S.rejects.every(Boolean),
  };
}
