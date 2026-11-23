// 第348便c(原仮定者の回答(2026-11-23 —— 第145報の回答 10)の AN976・統括の検証項目 R411):
//   **釣り合う向き = 銀河由来と太陽由来の軸引きずりの重みつきの合成(重みの型 3 つ —— W1 軸引きずりの率の大きさ・W2〔第344便e〕の釣り合いの比・W3 重みをノブに)・
//   観測の自転軸とのなす角 δ と、ジャイロトルクの式からの歳差の率・「引きずられ半径 ÷ 観測半径」の係数 c_R のノブ(冪の候補 4 つ)・熱の窓の純関数 —— 診断だけ**
//   (器 tests/exp-w348c-axisbalance.mjs と QA behavior.axisbalance348c・docs.axisbalance348c が読む —— html を読まない・ファイルを読まない・状態を持たない)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない(AN712 —— エンジンへ足す操作ではない)。
//   既存の lib は呼ぶだけ(本文は変えない): 第347便h(makeField・rotOf・curlOf・bodyRows —— c_R = 1・q 2・3・D₀ 0 の照合)・第347便e(DECL.pairs・geometry・t1Table・LIT)・
//   第344便e(composeBalance —— 120° の例の比 ρ)・第343便e(poles)・第342便e(galUnit)・第341便f(熱の物差し・土星の質量)・第337便c(GALAXY・BODY_SRC・定数)・
//   第330便a(観測の歳差の角速度 —— 文献の値・未照合の比べる列)。
//
// ■ 由来ごとの軸引きずりの回転 Ω_k(〔第347便h〕の候補 (W) 中心の ½ ∇×u・(P2) 2 点の差分 —— 腕 R_b = c_R R_obs):
//   太陽由来・母天体由来: 〔第347便h〕の (iv) と同じ作り(源 1 つ・自転 ŝ ws・半径 R_s・受け手は半径 a = G M ÷ (β c²) の円の道・1 公転の平均)を q 0・2・3 × D₀ 2 通りで。
//   銀河由来: 銀河を源 1 つの回転の場に置く宣言(回転の向き = 第342便e の galUnit・ws = 第337便c の GALAXY.omega・受け手は銀河の面の上〔緯度 0 —— 第347便e の窓の表と同じ宣言〕・
//   距離 ÷ 銀河の半径 = DECL.galDOverR〔宣言のノブ —— リポジトリに値が無い〕)。(P2) は腕 ÷ 距離が 1e-13 の桁で差分が丸めに負けるので、腕 → 0 の極限 ê × (J ê) で数える(零試験で有限の腕と照合)。
//   D₀ は源の重み m d^(−p) の受け手の道での値を単位に DECL.d0k 倍(0 と 1)。
// ■ 釣り合う向き(原文「銀河由来と太陽由来の軸引きずりを重みで合成した方向」の読み): ê_釣 ∝ w_G â_G + w_S â_S(â_k = Ω_k ÷ abs(Ω_k))。
//   (W1) w_k = abs(Ω_k)(= ベクトルの和 Ω_G + Ω_S の向き)/(W2) w_G ÷ w_S = ρ(〔第344便e〕の 120° の例の三次元・rev の行の比)/(W3) w_G ÷ w_S = r(ノブ)。
//   衛星は母天体由来の項 Ω_P を足す列(W1 だけ —— 3 つの源の和)。合成の回転の大きさ abs(Ω_釣): W1 は和の大きさ・W2・W3 は abs(Ω_S) abs(â_S + r â_G)。
// ■ 歳差(原文「ジャイロトルクで釣り合いつつ歳差運動」の読み): δ = 観測の自転軸と ê_釣 の角。トルク τ = I ω abs(Ω_釣) sin δ(補足 1 の「慣性モーメント × 自転速度 × 直交する回転成分」)・
//   歳差の率 Ω_p = τ ÷ (I ω sin δ) = abs(Ω_釣)(δ ≠ 0)・軸の先の速さ abs(Ω_釣) sin δ。向きは〔第347便h〕の読み (g2+) 順(Ω_釣 と同じ回り)・(g2−) 逆。
// ■ 係数 c_R = 引きずられ半径 ÷ 観測半径(原文「観測半径に対する引きずられ半径の係数がノブの候補」の読み)の入り方の候補:
//   (k0) (W) —— c_R に依らない/(kP2) (P2) の腕 R_b = c_R R_obs(数で)/(kI2) 引きずられる分の慣性 I_d = c_R² I(質量は同じ・半径だけ —— 歳差の率 ∝ c_R²)/
//   (kI5) 一様な密度の球の半径 c_R R(I_d ∝ c_R⁵)。「要る c_R」= 比べる列と同じ歳差の率になる c_R(kI2・kI5 だけ —— 診断の列)。
// ■ 言わないこと: 釣り合いの向き・歳差の由来・係数の値・構造との関係の答えとは書かない。この重み・この候補・このノブでは、の表。観測の歳差は固定の比べる列(合わせない)。
import * as H from './lib-w347h-axisdiff.mjs';
import * as E from './lib-w347e-spintorque.mjs';
import * as C344 from './lib-w344e-spincompose.mjs';
import * as E343 from './lib-w343e-spintransfer.mjs';
import * as P from './lib-w342e-powerball.mjs';
import * as F from './lib-w341f-gyroheat.mjs';
import * as TL from './lib-w337c-tidelock.mjs';
import * as S330 from './lib-w330a-spinclass.mjs';

export const LIB_VERSION = 'w348c-axisbalance-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const D2R = Math.PI / 180, YR = TL.YR, G = TL.G_SI, C0 = TL.C_SI, AS = 180 * 3600 / Math.PI;

/* ───────── 宣言 ───────── */
export const DECL = Object.freeze({
  cands: Object.freeze(['W', 'P2']), q: Object.freeze([0, 2, 3]), d0k: Object.freeze([0, 1]), weights: Object.freeze(['W1', 'W2', 'W3']),
  /** W3 の重みの比 w_G ÷ w_S(表の主は 1) */
  w3r: Object.freeze([0.1, 1, 10]), w3Main: 1,
  /** 銀河の場の宣言: 受け手の距離 ÷ 銀河の半径(リポジトリに値が無い —— 宣言のノブ)・重みのべき p(第347便h の (iv) と同じ 1) */
  galDOverR: 1, p: 1, nPhase: 360, galSnap: 1e-12,
  /** c_R の格子と入り方の候補 */
  cR: Object.freeze([0.5, 1, 2]), cRpow: Object.freeze(['k0', 'kP2', 'kI2', 'kI5']), cRexp: Object.freeze({ k0: 0, kI2: 2, kI5: 5 }),
  /** 構造の組(宣言) */
  groups: Object.freeze({ rock: Object.freeze(['Mercury', 'Venus', 'Earth', 'Mars']), gas: Object.freeze(['Jupiter', 'Saturn']), ice: Object.freeze(['Uranus', 'Neptune', 'Pluto']), moon: Object.freeze(['Moon', 'Io']) }),
  /** 衛星の行(源が母天体)と、その天体の太陽由来の行 */
  parentRows: Object.freeze({ 'Moon|EarthHi': 'Moon|Sun', 'Moon|EarthLo': 'Moon|Sun', 'Io|Jupiter': 'Io|Sun', 'Pluto|Charon': 'Pluto|Sun' }),
  /** 熱の窓(第347便e・第347便h と同じ物差し): イオの熱 ≤ 物差し・木星の熱 ≥ 物差しの 0.1 倍 */
  highFrac: 0.1,
});

/** 文献の値(固定の比べる列 —— 合わせない)。歳差の角速度は第330便a の lib の値(地球は一般歳差・月は節の 18.61 年・水星は桁) */
export const LIT = Object.freeze({
  note: '文献の値・未照合(この環境から一次資料に当たっていない)',
  precArcsecPerYr: S330.DECL.lit.precessionArcsecPerYear, precRole: S330.DECL.lit.precessionRole,
  precSrc: '第330便a の lib の「実際の自転軸の歳差の角速度」(地球 50.28792″/年・火星 7.594″/年・金星 44.58″/年・月 = 節の 18.613 年・水星は桁)—— 文献の値・未照合',
  galaxy: TL.GALAXY, galaxySrc: '第337便c の lib の GALAXY(銀河の円運動の速さと太陽の銀河中心からの距離の桁 —— 文献の値・未照合)',
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
const angDeg = (a, b) => Math.atan2(nrm(crs(a, b)), dot(a, b)) / D2R;
const perpPair = (a) => { const t = Math.abs(a[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0], e2 = unit(crs(a, t)), e3 = crs(a, e2); return [e2, e3]; };
const srcId = (s) => (s === 'EarthHi' || s === 'EarthLo' ? 'Earth' : s);
const NAME = Object.freeze({ Mercury: 'mercury', Venus: 'venus', Earth: 'earth', Mars: 'mars', Moon: 'moon' });

/** 観測半径 [m](第347便h の lib と同じ引き方) */
export function radiusOf(id) {
  return TL.BODY_SRC[id] && TL.BODY_SRC[id].R ? TL.BODY_SRC[id].R[0] : id === 'Saturn' ? H.LIT.saturnR : id === 'Uranus' ? E.LIT.uranus.R : id === 'Neptune' ? E.LIT.neptune.R : null;
}
/** 質量 [kg](BODY_SRC・第341便f の土星・第347便e の天王星と海王星) */
export function massOf(id) {
  if (TL.BODY_SRC[id] && TL.BODY_SRC[id].M) return TL.BODY_SRC[id].M[0];
  if (id === 'Uranus') return E.LIT.uranus.M; if (id === 'Neptune') return E.LIT.neptune.M;
  const r = F.bodyRows().find((x) => x.id === id); return r ? r.M : null;
}

/* ───────── 由来ごとの軸引きずりの回転 ───────── */
/** P2 の腕 → 0 の極限: ê × (J ê) */
export function p2Limit(field, rc, e) { const J = field.J(rc), Je = [J[0] * e[0] + J[1] * e[1] + J[2] * e[2], J[3] * e[0] + J[4] * e[1] + J[5] * e[2], J[6] * e[0] + J[7] * e[1] + J[8] * e[2]]; return crs(e, Je); }
/**
 * 太陽由来・母天体由来(第347便h の (iv) の作り): 1 公転の平均の (W) と (P2)。o = { q, d0k, cR(P2 の腕 = c_R R_obs), mut }
 * 戻り値 { W:[3], P2:[3], a, Rs, Rb, ws }
 */
export function srcRot(T1, GEO, id, src, { q, d0k = 0, cR = 1, nPhase = DECL.nPhase } = {}) {
  if (!(fin(q) && q >= 0 && fin(d0k) && d0k >= 0 && fin(cR) && cR > 0)) throw new RangeError('srcRot: q ≥ 0・d0k ≥ 0・c_R > 0');
  const r2 = T1.find((r) => r.id === id && r.src === src && r.mag === 'm2'), g = GEO[id + '|' + src];
  if (!r2 || !g) throw new RangeError('srcRot: 組 ' + id + '|' + src);
  const ws = r2.OmegaT, beta = r2.Om1 / ws, Ms = TL.BODY_SRC[srcId(src)].M[0], Rs = radiusOf(srcId(src)), Rb = cR * radiusOf(id), a = G * Ms / (beta * C0 * C0);
  const s = unit(g.s), n = unit(g.n), x0 = crs(s, n), x = nrm(x0) > 1e-12 ? unit(x0) : perpPair(n)[0], y = crs(n, x);
  const field = H.makeField({ sources: [{ m: 1, R: Rs, spin: scl(s, ws), r: [0, 0, 0], v: [0, 0, 0] }], D0: d0k * Math.pow(a, -DECL.p), p: DECL.p, q });
  let mW = [0, 0, 0], mP = [0, 0, 0];
  for (let k = 0; k < nPhase; k++) {
    const ph = 2 * Math.PI * (k + 0.5) / nPhase, rh = add(scl(x, Math.cos(ph)), scl(y, Math.sin(ph))), rc = scl(rh, a);
    mW = add(mW, scl(H.rotOf('W', field, rc, { Rb }).Om, 1 / nPhase)); mP = add(mP, scl(H.rotOf('P2', field, rc, { e: rh, Rb }).Om, 1 / nPhase));
  }
  return { W: mW, P2: mP, a, Rs, Rb, ws };
}
/** 銀河由来(宣言の場 —— 単位: 銀河の半径 1・距離 DECL.galDOverR)。(P2) は腕 → 0 の極限。8 つの方位の平均(方位に依らないことを零試験で見る) */
export function galRot({ q, d0k = 0, mut = null } = {}) {
  if (!(fin(q) && q >= 0 && fin(d0k) && d0k >= 0)) throw new RangeError('galRot: q ≥ 0・d0k ≥ 0');
  const g = scl(P.galUnit(), mut === 'galSign' ? -1 : 1), ws = TL.GALAXY.omega, d = DECL.galDOverR, [e1, e2] = perpPair(g);
  const field = H.makeField({ sources: [{ m: 1, R: 1, spin: scl(g, ws), r: [0, 0, 0], v: [0, 0, 0] }], D0: d0k * Math.pow(d, -DECL.p), p: DECL.p, q });
  let mW = [0, 0, 0], mP = [0, 0, 0], spread = 0; const N = 8, Ws = [];
  for (let k = 0; k < N; k++) {
    const ph = 2 * Math.PI * k / N, rh = add(scl(e1, Math.cos(ph)), scl(e2, Math.sin(ph))), rc = scl(rh, d), W = H.rotOf('W', field, rc, { Rb: 1e-6 }).Om, P2 = p2Limit(field, rc, rh);
    mW = add(mW, scl(W, 1 / N)); mP = add(mP, scl(P2, 1 / N)); Ws.push(W);
  }
  for (const W of Ws) spread = Math.max(spread, nrm(sub(W, mW)) / Math.max(nrm(mW), 1e-300));
  // 打ち消しで 0 になる組(距離 ÷ 半径 = 1 の宣言の下で (P2) の q 2・D₀ 0 は f + f′d = 0・(W) の q 3・D₀ 1 も 0)は丸めの残りの向きを持たせない(ws の 1e-12 倍以下は 0 と置く)
  const snap = (v) => (nrm(v) <= DECL.galSnap * ws ? [0, 0, 0] : v), zW = nrm(mW) <= DECL.galSnap * ws, zP = nrm(mP) <= DECL.galSnap * ws;
  return { W: snap(mW), P2: snap(mP), g, ws, spread: zW ? 0 : spread, zero: { W: zW, P2: zP }, field };
}
/** 銀河の受け手の道の距離 [m](円の道: β = v²/c²・ω = v/d —— GALAXY の 2 つの値から) */
export const galDistM = () => C0 * Math.sqrt(TL.GALAXY.beta) / TL.GALAXY.omega;

/* ───────── 合成 ───────── */
/**
 * 合成の向きと大きさ。terms: [{ Om:[3], w? }]。type: 'W1'(w = abs(Ω))/'ratio'(w を与える)。mut: 'noWeight'(重みを落として向きの和)
 * 戻り値 { e:[3], mag(合成の回転の大きさ [rad/s]) }
 */
export function compose(terms, { type = 'W1', mut = null } = {}) {
  if (!(Array.isArray(terms) && terms.length >= 1 && terms.every((t) => isVec(t.Om)))) throw new RangeError('compose: 項');
  let v = [0, 0, 0];
  for (const t of terms) {
    const a = unit(t.Om), w = mut === 'noWeight' ? 1 : type === 'W1' ? nrm(t.Om) : t.w;
    if (!(fin(w) && w >= 0)) throw new RangeError('compose: 重み ≥ 0');
    v = add(v, scl(a, w));
  }
  return { e: unit(v), mag: nrm(v), vec: v };
}
/** 重みの型ごとの合成(2 つの源 G・S —— 衛星は母天体の項 P を W1 で足す列も) */
export function composeAll(OmG, OmS, OmP = null, { mut = null, rho = C344.composeBalance().rows.find((r) => r.frame === '3d' && r.place === 'rev').rho } = {}) {
  const mS = nrm(OmS), out = {};
  out.W1 = compose([{ Om: OmG }, { Om: OmS }], { type: 'W1', mut });
  out.W2 = compose([{ Om: OmG, w: rho * mS }, { Om: OmS, w: mS }], { type: 'ratio', mut });
  out.W3 = Object.fromEntries(DECL.w3r.map((r) => [r, compose([{ Om: OmG, w: r * mS }, { Om: OmS, w: mS }], { type: 'ratio', mut })]));
  if (OmP) out.W1P = compose([{ Om: OmG }, { Om: OmS }, { Om: OmP }], { type: 'W1', mut });
  return out;
}
/** 歳差(ジャイロトルクの式): δ・トルク・歳差の率・軸の先の速さ(I・ω は受け手の値) */
export function precess(eBal, mag, wAxis, I, omega) {
  if (!(isVec(eBal) && isVec(wAxis) && fin(mag) && mag >= 0 && fin(I) && I > 0 && fin(omega) && omega > 0)) throw new RangeError('precess: 入力');
  const dl = angDeg(wAxis, eBal), sd = Math.sin(dl * D2R), torque = I * omega * mag * sd, tip = mag * sd;
  return { deltaDeg: dl, torque, tipRadYr: tip * YR, precRadYr: sd > 0 ? mag * YR : 0, precAsYr: sd > 0 ? mag * YR * AS : 0 };
}
/** c_R の入り方ごとの歳差の率の倍(kP2 は数で別に) */
export function cRfactor(pow, cR, mut = null) {
  if (!(fin(cR) && cR > 0)) throw new RangeError('cRfactor: c_R > 0');
  if (pow === 'k0') return 1;
  if (pow === 'kI2') return mut === 'crNoPow' ? 1 : cR * cR;
  if (pow === 'kI5') return mut === 'crNoPow' ? 1 : Math.pow(cR, 5);
  throw new RangeError('cRfactor: 入り方は k0・kI2・kI5(kP2 は腕で数える)');
}
/** 要る c_R(比べる列と同じ率になる c_R): (obs ÷ model)^(1/k) */
export function cRneed(pow, obs, model) {
  const k = DECL.cRexp[pow];
  if (!(k > 0) || !(fin(obs) && obs > 0 && fin(model) && model > 0)) return null;
  return Math.pow(obs / model, 1 / k);
}

/* ───────── T2 ê_釣 の表(15 組 × 候補 2 × q 3 × D₀ 2 × 重みの型)───────── */
export function makeBase(T1 = E.t1Table()) {
  const GEO = E.geometry(), base = {};
  for (const q of DECL.q) for (const d0k of DECL.d0k) {
    const gal = galRot({ q, d0k }), rows = {};
    for (const [id, src] of E.DECL.pairs) rows[id + '|' + src] = srcRot(T1, GEO, id, src, { q, d0k });
    base[q + '|' + d0k] = { gal, rows };
  }
  return { T1, GEO, base };
}
export function balanceRows(B = makeBase()) {
  const { T1, GEO, base } = B, { S, G: Gv, E: Ecl } = E343.poles(), out = [];
  for (const [id, src] of E.DECL.pairs) {
    const key = id + '|' + src, g = GEO[key], r2 = T1.find((r) => r.id === id && r.src === src && r.mag === 'm2'), wAx = unit(g.w), sunKey = src === 'Sun' ? key : DECL.parentRows[key];
    for (const cand of DECL.cands) for (const q of DECL.q) for (const d0k of DECL.d0k) {
      const b = base[q + '|' + d0k], OmG = b.gal[cand], OmS = b.rows[sunKey][cand], OmP = src === 'Sun' ? null : b.rows[key][cand], C = composeAll(OmG, OmS, OmP);
      const one = (c) => ({ eclDeg: angDeg(c.e, Ecl), galDeg: angDeg(c.e, Gv), sunAxDeg: angDeg(c.e, S), magYr: c.mag * YR, ...precess(c.e, c.mag, wAx, r2.I, r2.omega) });
      out.push({ id, src, cand, q, d0k, I: r2.I, omega: r2.omega, galZero: b.gal.zero[cand], galMag: nrm(OmG), sunMag: nrm(OmS), parentMag: OmP ? nrm(OmP) : null, galOverSun: nrm(OmG) / nrm(OmS),
        galToSpinDeg: b.gal.zero[cand] ? null : angDeg(OmG, wAx), sunToSpinDeg: angDeg(OmS, wAx), galSunDeg: b.gal.zero[cand] ? null : angDeg(OmG, OmS),
        W1: one(C.W1), W2: one(C.W2), W3: Object.fromEntries(DECL.w3r.map((r) => [r, one(C.W3[r])])), W1P: C.W1P ? one(C.W1P) : null });
    }
  }
  return out;
}
/** 120° の例(〔第344便e〕—— â_S = 太陽の軸 S・â_G = −G〔rev〕)の重みの型ごとの釣り合いの向き(W1 は地球の行の大きさの比 —— 候補・q・D₀ ごと) */
export function example120(R) {
  const { S, G: Gv, E: Ecl } = E343.poles(), row = C344.composeBalance().rows.find((r) => r.frame === '3d' && r.place === 'rev'), rho = row.rho, aG = scl(Gv, -1), out = [];
  const at = (ratio) => { const c = unit(add(S, scl(aG, ratio))); return { ratio, galDeg: angDeg(c, Gv), eclDeg: angDeg(c, Ecl), sunDeg: angDeg(c, S) }; };
  out.push({ type: 'W2', ...at(rho) });
  for (const r of DECL.w3r) out.push({ type: 'W3', ...at(r) });
  for (const x of R.filter((x) => x.id === 'Earth' && x.src === 'Sun')) out.push({ type: 'W1', cand: x.cand, q: x.q, d0k: x.d0k, ...at(x.galOverSun) });
  return { rho, sunGalDeg: angDeg(S, Gv), rows: out };
}

/* ───────── T3 δ と歳差 —— 比べる列 ───────── */
const precObs = (id) => { const k = NAME[id]; return k && LIT.precArcsecPerYr[k] !== undefined ? { asYr: LIT.precArcsecPerYr[k], role: LIT.precRole[k] } : null; };
/** 天体ごとの代表の行(衛星は母天体の行 —— 3 つの源の列を持つ) */
const repKey = (id) => (id === 'Moon' ? 'Moon|EarthHi' : id === 'Io' ? 'Io|Jupiter' : id === 'Pluto' ? 'Pluto|Charon' : id + '|Sun');
export function precRows(R) {
  const out = [];
  for (const x of R.filter((r) => r.d0k === 0)) {
    const o = precObs(x.id), rep = repKey(x.id) === x.id + '|' + x.src;
    const ratio = (m) => (o && m.precAsYr > 0 ? m.precAsYr / o.asYr : null);
    out.push({ id: x.id, src: x.src, cand: x.cand, q: x.q, rep, obsAsYr: o ? o.asYr : null, obsRole: o ? o.role : null,
      W1: { deltaDeg: x.W1.deltaDeg, precAsYr: x.W1.precAsYr, torque: x.W1.torque, ratio: ratio(x.W1) }, W2: { deltaDeg: x.W2.deltaDeg, precAsYr: x.W2.precAsYr, torque: x.W2.torque, ratio: ratio(x.W2) },
      W1P: x.W1P ? { deltaDeg: x.W1P.deltaDeg, precAsYr: x.W1P.precAsYr, torque: x.W1P.torque, ratio: ratio(x.W1P) } : null });
  }
  return out;
}

/* ───────── T4 係数 c_R ───────── */
/** (kP2) 腕 R_b = c_R R_obs の (P2) の大きさの変わり(代表の行・q 2・D₀ 0 —— c_R 1 に対する相対の差) */
export function cRp2Rows(B) {
  const out = [];
  for (const id of ['Earth', 'Jupiter', 'Moon', 'Io']) {
    const key = id === 'Moon' ? ['Moon', 'EarthHi'] : id === 'Io' ? ['Io', 'Jupiter'] : [id, 'Sun'];
    for (const q of [0, 2, 3]) {
      const base1 = srcRot(B.T1, B.GEO, key[0], key[1], { q, cR: 1 }).P2, rel = {};
      for (const cR of DECL.cR) { const v = srcRot(B.T1, B.GEO, key[0], key[1], { q, cR }).P2; rel[cR] = nrm(sub(v, base1)) / nrm(base1); }
      out.push({ id, src: key[1], q, rel, RbOverA: radiusOf(id) / srcRot(B.T1, B.GEO, key[0], key[1], { q, cR: 1, nPhase: 4 }).a });
    }
  }
  return out;
}
/** c_R を振った歳差の率(代表の行・候補 (W)・D₀ 0・重み W1・W2)と要る c_R(比べる列が在る天体) */
export function cRRows(R) {
  const out = [];
  for (const x of R.filter((r) => r.d0k === 0 && r.cand === 'W' && repKey(r.id) === r.id + '|' + r.src)) {
    const o = precObs(x.id), grp = Object.entries(DECL.groups).find(([, v]) => v.includes(x.id)), per = {};
    for (const wt of ['W1', 'W2', ...(x.W1P ? ['W1P'] : [])]) {
      const m = x[wt], swept = {};
      for (const pow of ['kI2', 'kI5']) swept[pow] = Object.fromEntries(DECL.cR.map((c) => [c, m.precAsYr * cRfactor(pow, c)]));
      per[wt] = { precAsYr: m.precAsYr, swept, need: o ? { kI2: cRneed('kI2', o.asYr, m.precAsYr), kI5: cRneed('kI5', o.asYr, m.precAsYr) } : null };
    }
    out.push({ id: x.id, src: x.src, q: x.q, group: grp ? grp[0] : null, obsAsYr: o ? o.asYr : null, obsRole: o ? o.role : null, per });
  }
  return out;
}
/** 構造の組ごとの「要る c_R」のそろい方(最大 ÷ 最小 —— 比べる列が 2 つ以上在る組だけ。水星の桁の行は除く) */
export function cRspread(CR) {
  const out = [];
  for (const g of Object.keys(DECL.groups)) for (const q of DECL.q) for (const wt of ['W1', 'W2']) for (const pow of ['kI2', 'kI5']) {
    const vals = CR.filter((r) => r.group === g && r.q === q && r.per[wt].need && r.obsRole === 'lit').map((r) => ({ id: r.id, v: r.per[wt].need[pow] })).filter((x) => fin(x.v));
    out.push({ group: g, q, weight: wt, pow, n: vals.length, ids: vals.map((x) => x.id), min: vals.length ? Math.min(...vals.map((x) => x.v)) : null, max: vals.length ? Math.max(...vals.map((x) => x.v)) : null,
      spread: vals.length >= 2 ? Math.max(...vals.map((x) => x.v)) / Math.min(...vals.map((x) => x.v)) : null });
  }
  return out;
}
/** 引きずり半径の既存の量(計算式の一覧の EQ-14: R_d = Y_k m・Y_k = 10 G₀ ÷ (C₁ c₀²))との関係 */
export function rdRows(CR) {
  const C1 = 6 * ((Math.sqrt(3) / 2) * Math.log(2 + Math.sqrt(3)) - 1), Yk = 10 * G / (C1 * C0 * C0), out = [];
  for (const id of ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Moon', 'Io', 'Pluto']) {
    const m = massOf(id), R = radiusOf(id), Rd = m === null ? null : Yk * m, c = CR.find((r) => r.id === id && r.q === 2);
    out.push({ id, m, R, Rd, RdOverR: Rd === null || !R ? null : Rd / R, needQ2W1kI2: c && c.per.W1.need ? c.per.W1.need.kI2 : null, needQ2W1kI5: c && c.per.W1.need ? c.per.W1.need.kI5 : null });
  }
  return { C1, Yk, rows: out };
}

/* ───────── T5 熱と帳簿 ───────── */
/** イオ・木星: 釣り合いつつ歳差している状態の熱の上の限り(h 1・f 0 —— 〔第347便i〕の P = (1 − f) I ω Ω⊥²)を 2 つの読み(合成 abs(Ω_釣⊥)²・源ごとの和 Σ abs(Ω_k⊥)²)で・散逸の項の無い型は 0 */
export function heatRows(B) {
  const out = [];
  for (const q of DECL.q) for (const cand of DECL.cands) {
    const b = B.base[q + '|0'], OmG = b.gal[cand];
    for (const [id, key, sunKey] of [['Io', 'Io|Jupiter', 'Io|Sun'], ['Jupiter', 'Jupiter|Sun', 'Jupiter|Sun']]) {
      const r2 = B.T1.find((r) => r.id + '|' + r.src === key && r.mag === 'm2'), wAx = unit(B.GEO[key].w), OmS = b.rows[sunKey][cand], OmP = id === 'Io' ? b.rows[key][cand] : null;
      const terms = [OmG, OmS].concat(OmP ? [OmP] : []), perp = (v) => sub(v, scl(wAx, dot(v, wAx)));
      const sum = terms.reduce((t, v) => add(t, v), [0, 0, 0]), Psum = r2.I * r2.omega * dot(perp(sum), perp(sum)), Peach = r2.I * r2.omega * terms.reduce((t, v) => t + dot(perp(v), perp(v)), 0);
      const ruler = F.LIT.heat[id];
      out.push({ id, q, cand, srcs: id === 'Io' ? 'G+S+P' : 'G+S', sum: Psum, each: Peach, none: 0, ruler, sumRatio: Psum / ruler, eachRatio: Peach / ruler });
    }
  }
  const win = (rd) => DECL.q.flatMap((q) => DECL.cands.map((cand) => {
    const io = out.find((r) => r.id === 'Io' && r.q === q && r.cand === cand), ju = out.find((r) => r.id === 'Jupiter' && r.q === q && r.cand === cand);
    return io[rd + 'Ratio'] <= 1 && ju[rd + 'Ratio'] >= DECL.highFrac; })).filter(Boolean).length;
  return { rows: out, windowSum: win('sum'), windowEach: win('each') };
}

/* ───────── T6 零試験・変異・照合 ───────── */
export function pureScenes(B = null) {
  const T1 = B ? B.T1 : E.t1Table(), GEO = B ? B.GEO : E.geometry();
  const OmS = srcRot(T1, GEO, 'Earth', 'Sun', { q: 2 }).W, OmG = galRot({ q: 2 }).W, aS = unit(OmS), aG = unit(OmG), mS = nrm(OmS);
  // ① w_G = 0 で太陽由来の軸に一致・② w_S = 0 で銀河由来の軸に一致
  const z1 = angDeg(compose([{ Om: OmG, w: 0 }, { Om: OmS, w: mS }], { type: 'ratio' }).e, aS), z2 = angDeg(compose([{ Om: OmG, w: mS }, { Om: OmS, w: 0 }], { type: 'ratio' }).e, aG);
  // ③ 重みの入れ替え: 比 r の向きの太陽からの角 = 比 1/r の向きの銀河からの角
  const sw = DECL.w3r.map((r) => Math.abs(angDeg(compose([{ Om: OmG, w: r }, { Om: OmS, w: 1 }], { type: 'ratio' }).e, aS) - angDeg(compose([{ Om: OmG, w: 1 }, { Om: OmS, w: r }], { type: 'ratio' }).e, aG)));
  // ④ δ = 0 で歳差 0(トルク 0・軸の先の速さ 0)
  const p4 = precess(aS, mS, aS, 1, 1);
  // ⑤ c_R = 1・q 2・3・D₀ 0 で第347便h の (iv)(bodyRows)に一致(15 組 × q 2 × 候補 2 の相対の差の最大)
  const HB = H.bodyRows(T1); let hMax = 0;
  for (const r of HB) { const m = srcRot(T1, GEO, r.id, r.src, { q: r.q }); hMax = Math.max(hMax, nrm(sub(m.W, r.Wvec)) / nrm(r.Wvec), nrm(sub(m.P2, r.P2vec)) / Math.max(nrm(r.P2vec), 1e-300)); }
  // ⑥ q = 0・D₀ 0 は剛体の回転(太陽由来の (W) = ws ŝ・銀河由来 = ω_G ĝ)
  const r6 = srcRot(T1, GEO, 'Earth', 'Sun', { q: 0 }), g6 = galRot({ q: 0 }), want6 = scl(unit(GEO['Earth|Sun'].s), r6.ws);
  const rigid = Math.max(nrm(sub(r6.W, want6)) / r6.ws, nrm(sub(g6.W, scl(g6.g, g6.ws))) / g6.ws);
  // ⑦ (P2) の極限 ê × (J ê) と有限の腕の照合(銀河の場・腕 1e-4)・銀河の方位に依らない
  const g7 = galRot({ q: 3 }), rh = perpPair(g7.g)[0], fin7 = H.rotOf('P2', g7.field, rh, { e: rh, Rb: 1e-4 }).Om, lim7 = p2Limit(g7.field, rh, rh), p2lim = nrm(sub(fin7, lim7)) / nrm(lim7);
  // ⑧ W2 で 120° の例(〔第344便e〕)に戻る —— 変異(重みを落とす・銀河の向きを逆に)で落ちる
  const { S, G: Gv } = E343.poles(), rho = C344.composeBalance().rows.find((r) => r.frame === '3d' && r.place === 'rev').rho;
  const e8 = compose([{ Om: scl(Gv, -1), w: rho }, { Om: S, w: 1 }], { type: 'ratio' }).e, m8 = compose([{ Om: scl(Gv, -1), w: rho }, { Om: S, w: 1 }], { type: 'ratio', mut: 'noWeight' }).e;
  const deg120 = angDeg(e8, Gv), mut120 = angDeg(m8, Gv), galFlip = angDeg(galRot({ q: 2, mut: 'galSign' }).W, OmG);
  // ⑨ c_R の倍(c_R 2 で kI2 4・kI5 32・k0 1)と変異(冪を落とす)・要る c_R の往復
  const crf = [cRfactor('k0', 2), cRfactor('kI2', 2), cRfactor('kI5', 2)], crMut = cRfactor('kI2', 2, 'crNoPow'), rt = cRfactor('kI5', cRneed('kI5', 50.29, 7.3)) * 7.3;
  // ⑩ 入力の拒否
  const rej = [() => compose([]), () => compose([{ Om: [1, 0, 0], w: -1 }], { type: 'ratio' }), () => precess([1, 0, 0], 1, [1, 0, 0], 0, 1), () => cRfactor('k9', 1), () => cRfactor('kI2', 0), () => srcRot(T1, GEO, 'Earth', 'Sun', { q: -1 })]
    .map((fn) => { try { fn(); return false; } catch (e) { return e instanceof RangeError; } });
  return { z1, z2, sw: Math.max(...sw), p4tq: p4.torque, p4tip: p4.tipRadYr, p4prec: p4.precRadYr, hMax, rigid, galSpread: Math.max(galRot({ q: 2 }).spread, g7.spread), p2lim, deg120, mut120, galFlip, crf, crMut, rt: Math.abs(rt - 50.29) / 50.29, rejects: rej };
}
export function pureGates(S) {
  return {
    galZero: S.z1 < 1e-9,
    sunZero: S.z2 < 1e-9,
    swap: S.sw < 1e-9,
    deltaZero: S.p4tq === 0 && S.p4tip === 0 && S.p4prec === 0,
    vsH: S.hMax < 1e-8,   // 丸めをずらした走り直しで 2.5e-10 の桁(P2 の腕の差分の打ち消し)—— 素の走りでは 0
    rigid: S.rigid < 1e-12,
    p2limit: S.p2lim < 1e-6 && S.galSpread < 1e-9,
    w120: Math.abs(S.deg120 - 120) < 1e-9 && Math.abs(S.mut120 - 120) > 1 && Math.abs(S.galFlip - 180) < 1e-9,
    cR: S.crf[0] === 1 && Math.abs(S.crf[1] - 4) < 1e-12 && Math.abs(S.crf[2] - 32) < 1e-12 && S.crMut === 1 && S.rt < 1e-9,
    rejects: S.rejects.length === 6 && S.rejects.every(Boolean),
  };
}
