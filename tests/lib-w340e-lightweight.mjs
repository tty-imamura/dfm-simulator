// 第340便e(原仮定者の指示(2026-11-17 —— 第140報)「引きずりでの光速」の節・原仮定者の回答 AN756 = A・AN765・統括の検証項目 R360):
//   **引きずりでの光速と受け手の重み —— 受け手の自己の重みを分母に入れた型の速さの表・⑩(加減速の差で源の自転を場の速度に入れる読み)を落ちる型で候補に・
//   詰まり具合のべきに離心率の依存のノブを足す・共通の零試験(天体が 1 つ・離して静止させた 2 体・二重に足さない・次元)の純関数**
//   (器 tests/exp-w340e-lightweight.mjs と QA behavior.lightweight340e・docs.lightweight340e が読む —— html を読まない・状態を持たない。第338便e の lib〔tests/lib-w338e-spinfield.mjs〕・
//   第337便d の lib〔dragOf・keplerAt〕・第335便b の lib〔carriedVelocity・coordVelocity〕・第326便d の lib〔port —— 熱の口〕・第333便c の lib〔q1PNPerOrbit〕・第335便e の lib〔closedApsPerOrbit〕・
//   第330便b の lib〔kappaMRadius〕は呼ぶだけ —— 本文は変えない)。**全部「診断」**(エンジン・在位の本・受理器へ足す操作ではない)。
//
// ■ 記号: 位置 p・距離 r・質量 m・速度 v・観測自転 s・本の光速 c(第338便e の lib の DECL.c —— 座標を運ぶ速さを比べる物差し)。R_d = Y_k m(K1 の規則)・R_obs = 観測半径。
//   受け手 i・源 j。重み w_j = m_j/r²(並進引きずりの重み —— 第132報)・受け手の自己の重み w_self = m_i/R_self²(R_self = R_d か R_obs —— 距離 0 をそのまま入れない)。
//
// ■ 速さの型(受け手の位置で源の自転が「座標を運ぶ速さ」—— どれも読みの候補)
//   (i)   rigid    : |s × d|(源の座標の剛体の回転を受け手の距離まで伸ばした読み —— 天体が 1 つのときの座標変換・比べる列)
//   (ii)  pow1・pow2: g |s × d|・g = (R_d/r)^q(R_d の外で落ちる型 —— 第338便e の fieldAt を呼ぶ)
//   (iii) selfRd・selfRobs: f |s × d|・取り分 f = w_src/(w_src + w_self)(受け手の自己の重みを分母に入れた型 —— 第132報の Σ(速度 × 重み)/Σ重み〔自分を含む〕の 1 源の形)
//   (iv)  pow1selfRd・pow1selfRobs: f g |s × d|((ii) と (iii) を両方)
//   光速との比は**表に残すだけ・判定には使わない**(第140報「光速を超えるか超えないかは判断基準にならない」)。光速で切り詰める処理は持たない。
//   重みつきの平均は入力の最大を超えないが、入力が光速を超えていれば平均も超え得る(重み 100 と 1 で 10c → 9.90c —— 純関数の場面 ①)。
//
// ■ 零試験(候補の式を比べる物差し —— 式を 1 つに決めない)
//   (a) 天体が 1 つ: 源だけ(受け手は重み 0 の試験点・背景なし)—— 運ばれる速度の場の歪み(ヤコビアンの対称の部分)・試験点の相対の速さ・熱の口(第326便d の port)を、静止系と源と一緒に回る系で。
//   (b) 離して静止させた 2 体: d/dt(m/r) = −(m/r²) r̂·(v − v_j)・相対の速度の型の引きずり・重力の加速度 G m/r²(アプリの基準の形)を、静止・等速・円・離心の 4 つの場面で。読みの候補 3 つが出す量を並べる(決めない)。
//   (c) 二重に足さない: 重力をもう 1 度足した場合(GM → 2GM)と並進引きずりをもう 1 度足した場合の、水星の近点と月の周期の変化の桁。
//   (d) 次元: D・dD/dt・w・Y_k・X_k・G₀ の単位と、速度・角速度・加速度へ写す係数の一覧(今のコードが置いている所と置いていない所)。
//
// ■ 言わないこと: 「光速を超えないことが分かった」「⑩ が正しい/誤り」「重力が引きずりから導けた/導けない」とは書かない —— この型・このノブの組で出る数の表。文献の値は未照合(行の出どころを書く)。
import * as S338 from './lib-w338e-spinfield.mjs';
import * as AL from './lib-w337d-accelloss.mjs';
import * as CL from './lib-w335b-carryledger.mjs';
import { port } from './lib-w326d-axialheat.mjs';
import { q1PNPerOrbit } from './lib-w333c-mercury3d.mjs';
import { closedApsPerOrbit } from './lib-w335e-moonapsis.mjs';

export const LIB_VERSION = 'w340e-lightweight-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const v3 = (a) => Array.isArray(a) && a.length === 3 && a.every(fin);
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], scl = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

/** 宣言 */
export const DECL = Object.freeze({
  G: S338.DECL.G, c: S338.DECL.c, yearS: S338.DECL.yearS,
  /** T1 の速さの型(列の順) */
  speedTypes: Object.freeze(['rigid', 'pow1', 'pow2', 'selfRd', 'selfRobs', 'pow1selfRd', 'pow1selfRobs']),
  /** T1 の軌道の点(離心近点角の一様な点 —— 速さの最大を読む) */
  nOrbitT1: 720,
  /** ⑩ の効きを測る場の型(5 系 × 列 2) */
  effFields: Object.freeze(['none', 'rigid', 'pow1', 'pow2', 'selfRd', 'selfRobs', 'pow1selfRobs']),
  effCols: Object.freeze(['L1', 'S0']),
  nQuad: 4096,
  /** AN765: 詰まり具合のべき k の格子と、離心率の依存 (e/e_ref)^j の j の格子 */
  kGrid: Object.freeze({ from: -4, to: 4, step: 0.05 }), jGrid: Object.freeze({ from: -8, to: 8, step: 0.01 }), eRef: 0.1,
  /** 「同じ桁の効き」の物差し(第338便e と同じ —— 5 系の上限の広がり ≤ 10) */
  spreadGoal: 10,
  /** 丸めの床(同じ単位の尺度に対して) */
  zeroFloor: 1e-12,
});

/* ───────── 受け手の観測半径(文献の値・未照合 —— 行の出どころ)───────── */
/** 系の受け手(m1)の観測半径 [m]。逆の向き(m2 が受け手)は第338便e の SYSTEMS の R2 を使う */
export const RECV_R = Object.freeze({
  mercury: Object.freeze({ R: 2.4397e6, src: 'lit(水星の平均半径 2439.7 km の桁)' }),
  venus: Object.freeze({ R: 6.05e6, src: 'csv(Venus radius —— 本の宣言の写し)' }),
  earth: Object.freeze({ R: 6.371e6, src: 'lit(地球の平均半径)' }),
  mars: Object.freeze({ R: 3389500, src: 'csv SOL-115bcbaf' }),
  jupiter: Object.freeze({ R: 6.9911e7, src: 'lit(木星の平均半径の桁)' }),
  saturn: Object.freeze({ R: 5.8232e7, src: 'lit(土星の平均半径の桁)' }),
  uranus: Object.freeze({ R: 25559000, src: 'csv(Uranus radius —— NSSDC)' }),
  neptune: Object.freeze({ R: 24764000, src: 'csv(Neptune radius —— NSSDC)' }),
  moon: Object.freeze({ R: 1.7374e6, src: 'lit(月の平均半径)' }),
  phobos: Object.freeze({ R: 11080, src: 'csv(Phobos radius)' }),
  io: Object.freeze({ R: 1.8216e6, src: 'lit(イオの平均半径の桁)' }),
  ganymede: Object.freeze({ R: 2.6341e6, src: 'lit(ガニメデの平均半径の桁)' }),
  titan: Object.freeze({ R: 2.5747e6, src: 'lit(タイタンの平均半径の桁)' }),
  triton: Object.freeze({ R: 1353400, src: 'csv(Triton radius —— NSSDC)' }),
  charon: Object.freeze({ R: 606000, src: 'csv(Charon radius —— NSSDC)' }),
  alphacen: Object.freeze({ R: 5.979336e8, src: 'csv(Alpha Centauri B radius —— Akeson et al. 2021)' }),
  sirius: Object.freeze({ R: 5.636208e6, src: 'csv(Sirius B radius —— Bond et al. 2017)' }),
  j0651: Object.freeze({ R: 2.6e7, src: 'lit(0.26 太陽質量の白色矮星の半径の桁 —— Brown et al. 2011・未照合)' }),
  j0348: Object.freeze({ R: 4.5e7, src: 'lit(0.172 太陽質量の白色矮星の半径の桁 —— Antoniadis et al. 2013・未照合)' }),
  j1141: Object.freeze({ R: 7e6, src: 'lit(1.0 太陽質量の白色矮星の半径の桁 —— 未照合)' }),
  b1913: Object.freeze({ R: 1.175e4, src: 'csv(中性子星の半径 1.175e4 m —— Dietrich et al. 2020 の行と同じ値)' }),
  b1534: Object.freeze({ R: 1.175e4, src: '同上' }),
  j1757: Object.freeze({ R: 1.175e4, src: 'csv(PSR J1757−1854 radius)' }),
  j1946: Object.freeze({ R: 1.175e4, src: 'csv(PSR J1946+2052 radius)' }),
  j0737: Object.freeze({ R: 1.175e4, src: 'csv(PSR J0737−3039 B radius)' }),
});

/* ───────── 取り分と場の型 ───────── */
/** 受け手の自己の重み w_self = m/R²(点の形 —— R は R_d か R_obs) */
export function selfWeight(m, R) { if (!fin(m) || !(m > 0) || !fin(R) || !(R > 0)) throw new RangeError('selfWeight: m > 0・R > 0'); return m / (R * R); }
/** 取り分 f = w_src/(w_src + w_self)(w_src = m_src/r²)と f(1 − f)(時間の変化に要る) */
export function shareOf(mSrc, r, wSelf) {
  if (!fin(mSrc) || !(mSrc > 0) || !fin(r) || !(r > 0) || !fin(wSelf) || wSelf < 0) throw new RangeError('shareOf: m_src > 0・r > 0・w_self ≥ 0');
  const ws = mSrc / (r * r), W = ws + wSelf;
  return { f: ws / W, g: wSelf / W, wSrc: ws };
}
/**
 * 一般の場の型(受け手の位置で源の自転が運ぶ分 U_s と時間の変化 dU)。type は DECL.effFields/speedTypes のどれか。
 * ctx = { RdSrc, mSrc, wSelfRd, wSelfRobs }。none・rigid・pow1・pow2 は第338便e の fieldAt を呼ぶ。self の型: U = f s × d・dU = f s × w + (s × d) df/dt(df/dt = −2 f(1 − f) (d·w)/r²)
 */
export function fieldOf(type, s, d, w, ctx) {
  if (['none', 'rigid', 'pow1', 'pow2'].includes(type)) return S338.fieldAt(type, s, ctx.RdSrc, d, w);
  if (!v3(s) || !v3(d) || !v3(w)) throw new RangeError('fieldOf: s・d・w は有限の 3 成分');
  const m = /^(pow1)?self(Rd|Robs)$/.exec(type);
  if (!m) throw new RangeError('fieldOf: 型は ' + DECL.speedTypes.concat(['none']).join('・'));
  const wSelf = m[2] === 'Rd' ? ctx.wSelfRd : ctx.wSelfRobs, r = nrm(d), rw = dot(d, w);
  const sh = shareOf(ctx.mSrc, r, wSelf), f = sh.f, dfdt = -2 * f * sh.g * rw / (r * r);
  const base = m[1] ? S338.fieldAt('pow1', s, ctx.RdSrc, d, w) : { U: crs(s, d), dU: crs(s, w) };
  return { U: scl(base.U, f), dU: add(scl(base.dU, f), scl(base.U, dfdt)), f };
}

/* ───────── 二体の 1 点と軌道平均(第338便e の pairForcesF・secularF を一般の場の型へ —— k = 0 だけ)───────── */
/** ctx1 = 受け手 1 の場の文脈(源 2)・ctx2 = 受け手 2 の場の文脈(源 1) */
export function pairForcesG(S, col, knob, r, v, type, ctx1, ctx2) {
  const { G, m1, m2, M, s1, s2, c, mode } = S, rm = nrm(r), r3 = rm * rm * rm;
  const aRel = scl(r, -G * M / r3);
  const v1 = scl(v, m2 / M), v2 = scl(v, -m1 / M);
  const F1 = fieldOf(type, s2, r, v, ctx1);
  const U1 = add(v2, F1.U), u1 = sub(v1, U1);
  const d1 = AL.dragOf(col, knob, { u: u1, du0: sub(aRel, F1.dU), a0mag: G * m2 / (rm * rm), c });
  let f2 = [0, 0, 0];
  if (mode === 'both') {
    const F2 = fieldOf(type, s1, scl(r, -1), scl(v, -1), ctx2);
    const U2 = add(v1, F2.U), u2 = sub(v2, U2);
    f2 = AL.dragOf(col, knob, { u: u2, du0: sub(scl(aRel, -1), F2.dU), a0mag: G * m1 / (rm * rm), c }).f;
  }
  return { fRel: sub(d1.f, f2), u1, U1 };
}
/** 軌道平均の ȧ(第338便e の secularF と同じ点・同じ重み —— ȧ だけ) */
export function adotG(S, col, knob, type, ctx1, ctx2, { nQ = DECL.nQuad } = {}) {
  let sw = 0, eps = 0;
  for (let i = 0; i < nQ; i++) {
    const E = 2 * Math.PI * i / nQ, K = AL.keplerAt(S, E), F = pairForcesG(S, col, knob, K.r, K.v, type, ctx1, ctx2);
    sw += K.w; eps += K.w * dot(K.v, F.fRel);
  }
  eps /= sw;
  return 2 * S.a * S.a * eps / S.GM;
}
/** 系の場の文脈(受け手 1 = m1 の場 ctx1〔源 2〕・受け手 2 = m2 の場 ctx2〔源 1〕) */
export function ctxFor(key) {
  const d = S338.SYSTEMS[key], rr = RECV_R[key];
  if (!d || !rr) throw new RangeError('ctxFor: 系が無い ' + key);
  const Rd1 = S338.rdOf(d.m1), Rd2 = S338.rdOf(d.m2);
  return { ctx1: { RdSrc: Rd2, mSrc: d.m2, wSelfRd: selfWeight(d.m1, Rd1), wSelfRobs: selfWeight(d.m1, rr.R) },
    ctx2: { RdSrc: Rd1, mSrc: d.m1, wSelfRd: selfWeight(d.m2, Rd2), wSelfRobs: selfWeight(d.m2, d.R2) }, Rd1, Rd2, R1: rr.R, R2: d.R2 };
}

/* ───────── T1 速さの表 ───────── */
/** 1 つの向き(受け手 recv の位置・源の自転 s)の速さの最大(軌道の上 —— nOrbit 点)と r = a の取り分 */
export function speedRow(S, s, ctx, sign, { nOrbit = DECL.nOrbitT1 } = {}) {
  const out = {}; for (const t of DECL.speedTypes) out[t] = 0;
  for (let i = 0; i < nOrbit; i++) {
    const K = AL.keplerAt(S, 2 * Math.PI * i / nOrbit), d = scl(K.r, sign), w = scl(K.v, sign);
    for (const t of DECL.speedTypes) out[t] = Math.max(out[t], nrm(fieldOf(t, s, d, w, ctx).U));
  }
  const om = nrm(s), fa = (wS) => shareOf(ctx.mSrc, S.a, wS).f;
  return { maxOverC: Object.fromEntries(DECL.speedTypes.map((t) => [t, out[t] / S.c])), omega: om, omegaAOverC: om * S.a / S.c,
    fRd: fa(ctx.wSelfRd), fRobs: fa(ctx.wSelfRobs), gA: Math.min(1, ctx.RdSrc / S.a) };
}
/** T1 の 1 系: 向き 2 つ(受け手 1〔源 2〕・受け手 2〔源 1 —— 両方の読みで源 1 が自転するときだけ〕)のうち剛体の速さが大きい向きを主の行に */
export function t1Row(key) {
  const d = S338.SYSTEMS[key], S = S338.sysFor(key), C = ctxFor(key);
  const fwd = speedRow(S, S.s2, C.ctx1, 1);
  let back = null;
  if (S.mode === 'both' && nrm(S.s1) > 0) back = speedRow(S, S.s1, C.ctx2, -1);
  const main = back && back.maxOverC.rigid > fwd.maxOverC.rigid * (1 + 1e-9) ? 'back' : 'fwd'   // 同じ速さ(同期の連星)は受け手 1 の向き —— 丸めで向きが入れ替わらない
 , R = main === 'back' ? back : fwd;
  const lg = (x) => (x > 0 ? Math.log10(x) : null);
  const margin = (f) => lg(f * R.omegaAOverC);
  return { key, name: d.name, kind: d.kind, mode: S.mode, dir: main, a: S.a, e: S.e, mRecv: main === 'back' ? d.m2 : d.m1, mSrc: main === 'back' ? d.m1 : d.m2,
    RdRecv: main === 'back' ? C.Rd2 : C.Rd1, RobsRecv: main === 'back' ? C.R2 : C.R1, RdSrc: main === 'back' ? C.Rd1 : C.Rd2,
    equatorOverC: nrm(main === 'back' ? S.s1 : S.s2) * (main === 'back' ? C.R1 : C.R2) / S.c,
    omegaAOverC: R.omegaAOverC, fRd: R.fRd, fRobs: R.fRobs, gA: R.gA, maxOverC: R.maxOverC,
    log10fRd: lg(R.fRd), log10fRobs: lg(R.fRobs), log10OmegaAOverC: lg(R.omegaAOverC), marginRd: margin(R.fRd), marginRobs: margin(R.fRobs),
    superluminal: Object.fromEntries(DECL.speedTypes.map((t) => [t, R.maxOverC[t] > 1])) };
}

/* ───────── ⑩ の効き(5 系)───────── */
export function effRow(key) {
  const S = S338.sysFor(key), C = ctxFor(key), out = {};
  for (const col of DECL.effCols) {
    const base = adotG(S, col, 1, 'none', C.ctx1, C.ctx2);
    out[col] = { none: base };
    for (const t of DECL.effFields) if (t !== 'none') { const ad = adotG(S, col, 1, t, C.ctx1, C.ctx2); out[col][t] = ad; }
    out[col].ratio = Object.fromEntries(DECL.effFields.filter((t) => t !== 'none').map((t) => [t, base === 0 ? null : out[col][t] / base]));
  }
  return { key, cols: out };
}

/* ───────── AN765: 詰まり具合のべき k × 離心率の依存 (e/e_ref)^j ───────── */
/** 系 → k の関数としての上限の log10(ノブ 1 の率に (Ξ/Ξ_ref)^k を掛けた率で観測の目安を割る) */
export function upperOfK(key, col, field) {
  const S = S338.sysFor(key), fK = S338.adotOfK(S, col, S338.cfgFor(key, field)), b = S338.boundOf(key);
  return (k) => { const ad = fK(k), rate = S338.boundRate(b.kind, { adot: ad, PdotOverP: 1.5 * ad / S.a }, S); return rate > 0 ? Math.log10(b.value / rate) : null; };
}
/** 5 系の広がり(log10)を k と j で: x_i(k) − j y_i の最大 − 最小(y_i = log10(e_i/e_ref))。j は格子の最小 */
export function spreadScan(keys, col, field, { kGrid = DECL.kGrid, jGrid = DECL.jGrid, eRef = DECL.eRef } = {}) {
  const fs = keys.map((k) => upperOfK(k, col, field)), ys = keys.map((k) => Math.log10(S338.SYSTEMS[k].e / eRef));
  const nK = Math.round((kGrid.to - kGrid.from) / kGrid.step), nJ = Math.round((jGrid.to - jGrid.from) / jGrid.step);
  const sp = (xs, j) => { let mx = -Infinity, mn = Infinity; for (let i = 0; i < xs.length; i++) { const z = xs[i] - j * ys[i]; if (z > mx) mx = z; if (z < mn) mn = z; } return mx - mn; };
  let best = null, bestJ0 = null;
  const rows = [];
  for (let a = 0; a <= nK; a++) {
    const k = Math.round((kGrid.from + a * kGrid.step) * 1e6) / 1e6, xs = fs.map((f) => f(k));
    if (xs.some((x) => x === null)) { rows.push({ k, ok: false }); continue; }
    let bj = 0, bs = sp(xs, 0);
    for (let b = 0; b <= nJ; b++) { const j = Math.round((jGrid.from + b * jGrid.step) * 1e6) / 1e6, s = sp(xs, j); if (s < bs - 1e-12) { bs = s; bj = j; } }
    const s0 = sp(xs, 0);
    rows.push({ k, ok: true, spreadJ0: s0, jBest: bj, spreadBest: bs });
    if (!best || bs < best.spreadBest) best = { k, j: bj, spreadBest: bs, xs };
    if (!bestJ0 || s0 < bestJ0.spread) bestJ0 = { k, spread: s0 };
  }
  // 決める系(広がりの両端): best の組で
  const zs = best ? best.xs.map((x, i) => x - best.j * ys[i]) : [];
  const hi = zs.length ? keys[zs.indexOf(Math.max(...zs))] : null, lo = zs.length ? keys[zs.indexOf(Math.min(...zs))] : null;
  return { col, field, keys, y: ys, best: best ? { k: best.k, j: best.j, log10Spread: best.spreadBest, spread: Math.pow(10, best.spreadBest), loosest: hi, tightest: lo } : null,
    bestJ0: bestJ0 ? { k: bestJ0.k, log10Spread: bestJ0.spread, spread: Math.pow(10, bestJ0.spread) } : null,
    atK0: (() => { const r = rows.find((q) => q.k === 0); return r && r.ok ? { log10SpreadJ0: r.spreadJ0, jBest: r.jBest, log10SpreadBest: r.spreadBest } : null; })(),
    reach: best ? Math.pow(10, best.spreadBest) <= DECL.spreadGoal : false, nK: rows.length,
    // 第338便e の k*(S0・⑩ なし —— 水星と J0737 を揃える −1.185)での j = 0 の広がり(照らし)
    atKstar338e: (() => { const xs = fs.map((f) => f(-1.185)); return xs.some((x) => x === null) ? null : Math.max(...xs) - Math.min(...xs); })() };
}

/* ───────── T2 零試験 ───────── */
/** 速度の場 U(p) のヤコビアン(中心差分)の対称の部分の大きさ ÷ 反対称の部分の大きさ(剛体の運動なら 0 —— 一様な並進は差分で消えるので源の自転が運ぶ分だけで測る) */
export function strainOf(Ufn, p, h) {
  const J = [0, 1, 2].map((b) => { const e = [0, 0, 0]; e[b] = h; return scl(sub(Ufn(add(p, e)), Ufn(sub(p, e))), 1 / (2 * h)); });   // J[b] = ∂U/∂p_b
  let s2 = 0, a2 = 0; for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) { const sab = 0.5 * (J[b][a] + J[a][b]), aab = 0.5 * (J[b][a] - J[a][b]); s2 += sab * sab; a2 += aab * aab; }
  return Math.sqrt(s2) / Math.sqrt(a2);
}
/** (a) 天体が 1 つ —— 源 m・速度 V・自転 s。試験点は重み 0(背景なし)。場の型 rigid・pow1・pow2・selfRd(試験点の重み 0 なら f = 1) */
export function zeroSingle({ m = 1.98847e30, V = [3e3, -2e3, 1e3], s = [1e-6, -2e-6, 2.865e-6] } = {}) {
  const pj = [0, 0, 0], Rd = S338.rdOf(m), sm = nrm(s), floor = DECL.zeroFloor;
  const pts = [[1e5, 2e4, -3e4], [4e7, -1e7, 2e7], [-6e9, 3e9, 1e9], [5.8e10, 0, 1e9], [1e12, -4e11, 2e11]];
  const Ufns = {
    rigid: (p) => sub(CL.coordVelocity({ p: pj, v: V, s }, p), V),
    pow1: (p) => S338.fieldAt('pow1', s, Rd, sub(p, pj), [0, 0, 0]).U,
    pow2: (p) => S338.fieldAt('pow2', s, Rd, sub(p, pj), [0, 0, 0]).U,
    // 試験点の重み 0: 取り分 f = 1 —— 第132報の式で分母は源の重みだけ
    selfZero: (p) => fieldOf('selfRd', s, sub(p, pj), [0, 0, 0], { RdSrc: Rd, mSrc: m, wSelfRd: 0, wSelfRobs: 0 }).U,
  };
  const strain = {};
  for (const [t, fn] of Object.entries(Ufns)) strain[t] = pts.map((p) => { const st = strainOf(fn, p, 1e-3 * nrm(p)); return st < 1e-6 ? 0 : st; });   // 中心差分の丸め(相対 1e-12 の桁)は 0 と書く —— 剛体の場は解析的に 0
  // 試験点が場と一緒に動く(重み 0 —— carriedVelocity の selfW 0)・相対の速さ・熱の口(試験点の回り Ω = 場が運ぶ回り s・源の供給 ν = s)
  const carry = pts.map((p) => { const C = CL.coordVelocity({ p: pj, v: V, s }, p), cv = CL.carriedVelocity({ v: C, selfW: 0, sources: [{ w: m / dot(p, p), C }] }); return nrm(sub(cv.U, C)) / nrm(C); });
  const relSpeed = Math.max(...carry); const relSpeed0 = relSpeed < floor ? 0 : relSpeed;
  const heatRest = port(s, s, 1).heat, heatRot = port(sub(s, s), sub(s, s), 1).heat;   // 静止系・源と一緒に回る系(Ω′ = Ω − s・ν′ = ν − s)
  // 対照: 試験点が回らない(Ω = 0)—— 熱 Γ|s|² は系に依らない
  const ctlRest = port([0, 0, 0], s, 1).heat, ctlRot = port(sub([0, 0, 0], s), sub(s, s), 1).heat;
  // 並進だけ(s = 0): 場は V 一様
  const tr = pts.map((p) => nrm(sub(CL.coordVelocity({ p: pj, v: V, s: [0, 0, 0] }, p), V))); const transOnly = Math.max(...tr) === 0 ? 0 : Math.max(...tr);
  return { m, Rd, sMag: sm, points: pts.map((p) => nrm(p)), strain, strainMax: Object.fromEntries(Object.entries(strain).map(([k, v]) => [k, Math.max(...v)])),
    relSpeed: relSpeed0, heatRest, heatRot, ctlHeatRest: ctlRest, ctlHeatRot: ctlRot, ctlHeatRel: Math.abs(ctlRest - ctlRot) / ctlRest < floor ? 0 : Math.abs(ctlRest - ctlRot) / ctlRest, transOnly };
}
/** (b) 離して静止させた 2 体と比べる場面: 受け手 i(m_i)・源 j(m_j)・場面 static / uniform / circular / eccentric。G m/r² はアプリの基準の形(G_loc の補正は弱い場で 1 に寄る —— 数は G₀ で書く) */
export function zeroPair({ key, mi, mj, a, e = 0.2, Robs }) {
  const G = DECL.G, M = mi + mj, GM = G * M, r0 = a;
  const selfW = selfWeight(mi, S338.rdOf(mi)), selfWo = selfWeight(mi, Robs);
  const scene = (nm, pi, vi, pjj, vj) => {
    const dvec = sub(pi, pjj), r = nrm(dvec), rh = scl(dvec, 1 / r), vrel = sub(vi, vj);
    const dDdt = -(mj / (r * r)) * dot(rh, vrel), D = mj / r;
    const C = CL.coordVelocity({ p: pjj, v: vj, s: [0, 0, 0] }, pi), cv = CL.carriedVelocity({ v: vi, selfW, sources: [{ w: mj / (r * r), C }] });
    const cvo = CL.carriedVelocity({ v: vi, selfW: selfWo, sources: [{ w: mj / (r * r), C }] });
    const dn = nrm(cv.d), dRad = dot(cv.d, rh), gAcc = G * mj / (r * r);
    const vs = Math.max(nrm(vi), nrm(vj), 1e-300);
    const z = (x, sc) => (Math.abs(x) < DECL.zeroFloor * sc ? 0 : x);
    return { scene: nm, r, D, dDdtOverDn: z(dDdt / (D * Math.sqrt(GM / (r * r * r))), 1), dragRd: dn / vs, dragRobs: nrm(cvo.d) / vs, dragRadialShare: dn === 0 ? 0 : z(dRad / dn, 1), gAcc, gOverGM_r2: gAcc / (G * mj / (r * r)) };
  };
  const V = [1.2e4, -3e3, 5e2];
  const vc = Math.sqrt(GM / r0), pe = [r0, 0, 0];
  // 離心の場面: 離心近点角 90° の点(ṙ ≠ 0)
  const Sx = AL.sysOf({ G, m1: mi, m2: mj, a, e }), Ke = AL.keplerAt(Sx, Math.PI / 2);
  return { key, mi, mj, a, e, selfW, selfWobs: selfWo, rows: [
    scene('static', pe, [0, 0, 0], [0, 0, 0], [0, 0, 0]),
    scene('uniform', pe, V, [0, 0, 0], V),
    scene('circular', pe, [0, vc, 0], [0, 0, 0], [0, 0, 0]),
    scene('eccentric', Ke.r, Ke.v, [0, 0, 0], [0, 0, 0]),
  ] };
}
/** 読みの候補 3 つが 4 つの場面で出す中心向きの加速度(G m/r² を 1 とする)。null = 式が立たない(係数か向きを置かない限り) */
export const READINGS = Object.freeze([
  Object.freeze({ key: 'r1', name: '(1) 第140報の文は読み(解釈)で、計算は決定力の勾配(今のアプリ)', central: Object.freeze({ static: 1, uniform: 1, circular: 1, eccentric: 1 }),
    note: '中心向き G₀ m/r²(今のアプリの重力 —— G_loc つき)。時間差分の量は計算に入らない' }),
  Object.freeze({ key: 'r2', name: '(2) 「差分」を時間だけでなく空間の差分(勾配)も含む量と読む', central: Object.freeze({ static: 1, uniform: 1, circular: 1, eccentric: 1 }),
    note: '空間の差分 G₀ ∇D が中心向きの 1 を出す(数は (1) と同じ)。時間の差分の部分 d/dt(m/r) は静止・等速・円で 0・離心で 0 でない —— この部分を加速度へ写す係数と向きは式が立たない(スカラーの率 —— 質量/長さ/時間)' }),
  Object.freeze({ key: 'r3', name: '(3) 自分自身の引きずり(慣性)との差として現れる加速度と読む(a = (U − v)/τ の形)', central: Object.freeze({ static: 0, uniform: 0, circular: 0, eccentric: null }),
    note: '相対の速度の型の引きずり d = U − v は静止・等速で 0・円では接線の向き(中心向きの成分 0)—— 中心向きの G m/r² は出ない。応答の時間 τ を置かない限り大きさの式が立たない・離心では動径の成分が出るが τ に依る' }),
]);
/** (c) 二重に足さない —— 水星と月 */
export function doubleCount() {
  const G = DECL.G, c = DECL.c, CY = 36525 * 86400;
  const sys = { mercury: { GM: G * (1.98847e30 + 3.3011e23), a: 5.790905e10, e: 0.20563593 }, moon: { GM: G * (5.9722e24 + 7.342e22), a: 3.84399e8, e: 0.0549 } };
  const out = {};
  for (const [k, q] of Object.entries(sys)) {
    const P = 2 * Math.PI * Math.sqrt(q.a ** 3 / q.GM), P2 = 2 * Math.PI * Math.sqrt(q.a ** 3 / (2 * q.GM));
    const pn = q1PNPerOrbit(q.GM, q.a, q.e, c), pn2 = q1PNPerOrbit(2 * q.GM, q.a, q.e, c);
    const toAs = (perOrbit, Pp) => perOrbit * (CY / Pp) * 180 / Math.PI * 3600;
    const b = 10 * q.GM / (c * c), p = q.a * (1 - q.e * q.e), drag = closedApsPerOrbit('both', b, p);
    out[k] = { periodS: P, periodS2: P2, periodRatio: P2 / P, pn1Cy: toAs(pn, P), pn1Cy2: toAs(pn2, P2), pnRatio: toAs(pn2, P2) / toAs(pn, P),
      dragCy: toAs(drag, P), dragCy2: toAs(2 * drag, P), dragExtraOverPN: drag / pn };
  }
  return out;
}
/** (d) 次元の一覧(単位と写す係数 —— 今のコードが置いている所) */
export const DIMENSIONS = Object.freeze([
  Object.freeze({ q: 'D = m/r(決定力)', unit: '質量/長さ', code: '時間と光(D_loc = ΣD + D₀)', map: '—' }),
  Object.freeze({ q: 'dD/dt = −(m/r²) r̂·(v − v_j)', unit: '質量/長さ/時間', code: '置いていない(この節の零試験だけ)', map: 'X_k dD/dt は 1/時間(角速度の次元)—— 置く式は無い' }),
  Object.freeze({ q: 'w = m/r²(並進引きずりの重み)', unit: '質量/長さ²', code: '並進引きずりの重み(比 w/Σw だけを使う —— 係数なしで速度へ)', map: '速度 U = Σ w C/Σ w(重みの比は次元なし)' }),
  Object.freeze({ q: 'w_self = m/R_self²(自己の重み)', unit: '質量/長さ²', code: 'R_self = Y_k m のとき 1/(Y_k² m)', map: '同上(分母に入る)' }),
  Object.freeze({ q: 'Y_k = 10G/(C₁c₀²)', unit: '長さ/質量', code: 'R_d = Y_k m(K1)', map: '近点の回り π b/p・b = 10GM/c₀² = C₁ Y_k M' }),
  Object.freeze({ q: 'X_k = G₀/c₀²', unit: '長さ/質量', code: '物理対応のロック(AN530)', map: 'X_k D は次元なし(場の強さの比)' }),
  Object.freeze({ q: 'G₀', unit: '長さ³/(質量 時間²)', code: '重力 a = G₀ ∇D(G_loc つき)', map: '加速度 G₀ m/r²(長さ/時間²)' }),
]);

/* ───────── 純関数の場面(QA と器の門)───────── */
export function pureScenes() {
  const O = {};
  // ① 重みつきの平均は入力の最大を超えない —— 入力が 10c なら 9.90c(重み 100 と 1)
  { const c = DECL.c, cv = CL.carriedVelocity({ v: [0, 0, 0], selfW: 1, sources: [{ w: 100, C: [10 * c, 0, 0] }] });
    O.mean10c = cv.U[0] / c; O.meanBound = cv.U[0] <= 10 * c; }
  // ② 速さの最大(rigid・pow1)が第338便e の secularF の usMaxOverC と同じ(水星 —— 受け手だけ・同じ点の数)
  { const S = S338.sysFor('mercury'), C = ctxFor('mercury'), n = 256, R = speedRow(S, S.s2, C.ctx1, 1, { nOrbit: n });
    const a = S338.secularF(S, 'L1', 0, S338.cfgFor('mercury', 'rigid'), { nQ: n }), b = S338.secularF(S, 'L1', 0, S338.cfgFor('mercury', 'pow1'), { nQ: n });
    O.speedSame = Math.max(Math.abs(R.maxOverC.rigid / a.usMaxOverC - 1), Math.abs(R.maxOverC.pow1 / b.usMaxOverC - 1)); }
  // ③ 一般の場の ȧ が第338便e の secularF の ȧ と同じ(J0737 —— 両方・rigid・pow1・L1・S0)
  { const S = S338.sysFor('j0737'), C = ctxFor('j0737'); let mx = 0;
    for (const t of ['rigid', 'pow1']) for (const col of ['L1', 'S0']) { const x = adotG(S, col, 1, t, C.ctx1, C.ctx2, { nQ: 512 }), y = S338.secularF(S, col, 1, S338.cfgFor('j0737', t), { nQ: 512 }).adot; mx = Math.max(mx, Math.abs(x / y - 1)); }
    O.adotSame = mx; }
  // ④ 自己の重みの型の dU と中心差分(selfRobs・pow1selfRd)
  { const s = [0, 1e-4, 3e-4], ctx = { RdSrc: 1e3, mSrc: 2e30, wSelfRd: 1e17, wSelfRobs: 4e9 }, d0 = [3e8, 1e8, 2e7], w = [-2e4, 5e4, 1e3], h = 1e-2; let mx = 0;
    for (const t of ['selfRobs', 'pow1selfRd']) { const F = fieldOf(t, s, d0, w, ctx), Fp = fieldOf(t, s, add(d0, scl(w, h)), w, ctx), Fm = fieldOf(t, s, sub(d0, scl(w, h)), w, ctx);
      const fd = scl(sub(Fp.U, Fm.U), 1 / (2 * h)); mx = Math.max(mx, nrm(sub(fd, F.dU)) / nrm(F.dU)); }
    O.dUfd = mx <= 1e-6 ? -6 : Math.ceil(Math.log10(mx)); }   // 差分の打ち切りと丸め(1e-10〜1e-9 の桁 —— 実行系で末尾が動く)は桁の上限 1e-6 だけを書く
  // ⑤ 取り分: 自己の重み 0 で f = 1(天体が 1 つの座標変換)・自己の重み = 源の重みで f = ½
  { O.shareOne = shareOf(2e30, 1e9, 0).f === 1; O.shareHalf = shareOf(2e30, 1e9, 2e30 / 1e18).f === 0.5; }
  // ⑥ 零試験 (a) の剛体の場の歪み 0・試験点の相対 0・熱 0・対照の熱が系に依らない
  { const Z = zeroSingle(); O.single = Z.strainMax.rigid === 0 && Z.strainMax.selfZero === 0 && Z.relSpeed === 0 && Z.heatRest === 0 && Z.heatRot === 0 && Z.ctlHeatRest > 0 && Z.ctlHeatRel === 0 && Z.transOnly === 0 && Z.strainMax.pow1 > 0; }
  // ⑦ 零試験 (b) の静止: 時間差分 0・引きずり 0・重力 1
  { const P = zeroPair({ key: 'earthMoon', mi: 7.342e22, mj: 5.9722e24, a: 3.84399e8, Robs: 1.7374e6 }), st = P.rows[0], ci = P.rows[2];
    O.staticPair = st.dDdtOverDn === 0 && st.dragRd === 0 && st.dragRobs === 0 && st.gOverGM_r2 === 1 && ci.dDdtOverDn === 0 && ci.dragRadialShare === 0 && ci.dragRd > 0 && ci.dragRobs > 0; }
  // ⑧ 入力の拒否
  { const tries = [() => selfWeight(0, 1), () => shareOf(1, 0, 1), () => fieldOf('x', [0, 0, 1], [1, 0, 0], [0, 1, 0], {}), () => ctxFor('nope'), () => fieldOf('selfRd', [0, 0, NaN], [1, 0, 0], [0, 1, 0], {})];
    let n = 0; for (const t of tries) { try { t(); } catch (e) { if (e instanceof RangeError) n++; } } O.reject = { n, of: tries.length }; }
  for (const k of ['speedSame', 'adotSame']) O[k] = O[k] < 1e-12 ? 0 : O[k];
  return O;
}
export function pureGates(O) {
  return { mean10c: Math.abs(O.mean10c - 1000 / 101) < 1e-12 && O.meanBound === true, speedSame: O.speedSame <= 1e-9, adotSame: O.adotSame <= 1e-9, dUfd: O.dUfd <= -6,
    share: O.shareOne === true && O.shareHalf === true, single: O.single === true, staticPair: O.staticPair === true, reject: O.reject.n === O.reject.of };
}
