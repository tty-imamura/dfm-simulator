// 第352便d(原仮定者の回答(2026-11-24 —— 第148報)「AN1017: これまでの向き。自転と、主に銀河由来の軸引きずりが順回転なら、歳差運動は逆回転になる」・統括の検証項目 R441):
//   **歳差の回る向きの 2 つの読み (g2+)・(g2−) × 背景の向きの候補 (G−)(G+)(N+)(N−) × 基準の極 —— 方位の率・傾きの率の口 poleRates と、
//   経路 ② の向きの口 precDs・順回転の符号 spinSense・合成の軸のまわりの相対の回り relSense・背景の向き bgDir —— 診断だけ**
//   (器 tests/exp-w352d-precsense.mjs と QA behavior.precsense352d・docs.precsense352d が読む —— 後のラウンドの枝もこの lib を import する。
//   html を読まない・ファイルを読まない・状態を持たない)。アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない。
//   既存の lib は呼ぶだけ(本文は変えない): 第351便d(r3Rate・r3Coeffs —— (g2+) が経路 ② の prec と同じことを零試験で見る)・
//   第351便e(bgTerm・localOf・uEqMag —— 背景の向きと大きさ・主の成分 (S) の局所の項)・第347便e(t1Table・geometry)。
//
// ■ 語(本便の共通の語 —— 後のラウンドで同じ):
//   ŝ = 受け手の自転軸の単位ベクトル(逆行の天体は ŝ の向きに入れる)。Ω = 符号つきの軸引きずり回転のベクトル(rad/s)。
//   **(g2+)** dŝ/dt = +k₂ ratio (Ω × ŝ)(記号「これまでの向き」—— 第350便c の正の歳差・第351便d の経路 ②)/
//   **(g2−)** dŝ/dt = −k₂ ratio (Ω × ŝ)(「順回転なら逆回転」の文を、合成の軸のまわりで読んだ形 —— 統括の数え直し)。**どちらを主にするかは決めない(2 列を同じ重さで)。**
//   極 p のまわりの**方位の率** az = (p × ŝ)·dŝ/dt ÷ abs(p × ŝ)²(p のまわりを右ねじで正)/**傾きの率** inc = −(p·dŝ/dt) ÷ abs(p × ŝ)(p に対する傾きが増える向きを正)。
//   ŝ が p と平行(abs(p × ŝ) < 1e-10)なら null(方位が定まらない)。
//   **順回転** = ŝ·Ω > 0(spinSense +1)・逆回転 = ŝ·Ω < 0(−1)。**relSense** = sign(Ω̂ のまわりの方位の率) × spinSense
//   (+1 = 合成の軸のまわりを自転と同じ回りに歳差・−1 = 逆回り)。閉じた形: Ω̂ のまわりの方位の率 = ±k₂ ratio abs(Ω)((g2+) で +・(g2−) で −)。
// ■ 背景の向きの名: 'Gm' (G−) = 第351便e の bgTerm の主(sign −1 —— 銀河の回転と逆向き)/'Gp' (G+) = sign +1/
//   'Np' (N+) = 引数の軸(太陽系の基準軸の候補)の向き/'Nm' (N−) = 引数の軸の逆。基準軸の定数は統括の数え直し 1 の 8 惑星の公転の法線の等しい重みの平均。
// ■ 言わないこと: 歳差の向きの答え・観測の向きとの比べの答えとは書かない(この向きの読み・この背景の向き・この極では、の表)。
import * as R3 from './lib-w351d-r3step.mjs';
import * as BB from './lib-w351e-bgbalance.mjs';
import * as E from './lib-w347e-spintorque.mjs';

export const LIB_VERSION = 'w352d-precsense-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const D2R = Math.PI / 180;
const { dot, crs, nrm, scl, add, sub, unit } = R3.vec;
const isVec = (a) => Array.isArray(a) && a.length === 3 && a.every(fin);
/** rad/s → ″/年(ユリウス年 365.25 日) */
export const ASYR = 365.25 * 86400 * 180 * 3600 / Math.PI;

/* ───────── 宣言 ───────── */
export const DECL = Object.freeze({
  senses: Object.freeze(['g2p', 'g2m']),
  senseNames: Object.freeze({ g2p: '(g2+)', g2m: '(g2−)' }),
  bgNames: Object.freeze(['Gm', 'Gp', 'Np', 'Nm']),
  bgLabels: Object.freeze({ Gm: '(G−)', Gp: '(G+)', Np: '(N+)', Nm: '(N−)' }),
  /** 極の名: 合成の軸 Ω̂・自分の公転の北極 n̂・基準軸(等重み)・黄道の極 */
  poles: Object.freeze(['om', 'orb', 'ref', 'ecl']),
  poleLabels: Object.freeze({ om: '合成の軸', orb: '自分の公転の北極', ref: '基準軸(等重み)', ecl: '黄道の極' }),
  /** 太陽系の基準軸の候補(統括の数え直し 1 —— 8 惑星の公転の法線の等しい重みの平均・黄道 J2000 の成分 —— geometry() の枠) */
  refEq: Object.freeze([0.0339521, -0.0096634, 0.9993767]),
  ecl: Object.freeze([0, 0, 1]),
  planets: BB.DECL.planets,
  /** 平行の閾(abs(p × ŝ)) */
  parallel: 1e-10,
  /** 統括の数え直し 1 の点検の数(3 桁 —— 主の成分 (S)・(C2)・k 1・背景の倍率 (uV)・(g2+)・″/年) */
  anchor: Object.freeze({
    uV: 1.19282e-12, uVms: 25.4221,
    earthGmRef: -2.87e-16, earthGmOrb: 9.56e-16, earthNpRef: 4.6e-15, marsGmRef: 1.59e-14, venusGmRef: -1.48e-13, venusNpOm: 7.09e-17,
    angRefSun: 5.230, angRefBg: 62.136,
  }),
  judge: '丸めの桁の床: 打ち消しで 0 になる量は尺度の 1e-12 倍以下を 0 と書く',
});

/* ───────── 約束の口 ───────── */
/**
 * 極 p のまわりの方位の率と傾きの率(単位は ds と同じ —— rad/s を入れれば rad/s)。
 * az = (p × ŝ)·ds ÷ abs(p × ŝ)²(右ねじで正)・inc = −(p·ds) ÷ abs(p × ŝ)(傾きが増える向きを正)。ŝ ∥ p なら null。
 * mut(変異 —— 零試験で落ちることを見る): 'flipAz'・'noSquare'(abs(p × ŝ) で 1 回だけ割る)・'swapCross'(ŝ × p)
 */
export function poleRates(pole, sHat, ds, { mut = null } = {}) {
  if (!(isVec(pole) && nrm(pole) > 0 && isVec(sHat) && nrm(sHat) > 0 && isVec(ds))) throw new RangeError('poleRates: 極・ŝ・dŝ/dt は長さのある [3]');
  const p = unit(pole), s = unit(sHat), t = mut === 'swapCross' ? crs(s, p) : crs(p, s), st = nrm(t);
  if (st < DECL.parallel) return null;
  let az = dot(t, ds) / (mut === 'noSquare' ? st : st * st);
  if (mut === 'flipAz') az = -az;
  return { inc: -dot(p, ds) / st, az };
}
/** 経路 ② の dŝ/dt: sense 'g2p' = +k₂ ratio (Ω × ŝ)・'g2m' = −k₂ ratio (Ω × ŝ) */
export function precDs(sHat, Om, { sense, kPrec = 1, ratio = 1 } = {}) {
  if (!DECL.senses.includes(sense)) throw new RangeError('precDs: 向きの読みは g2p・g2m');
  if (!(isVec(sHat) && nrm(sHat) > 0 && isVec(Om) && fin(kPrec) && fin(ratio))) throw new RangeError('precDs: ŝ・Ω・kPrec・ratio');
  return scl(crs(Om, unit(sHat)), (sense === 'g2p' ? 1 : -1) * kPrec * ratio);
}
/** 経路 ① + 経路 ②(向きの読みつき)の dŝ/dt —— 経路 ① は第351便d の r3Rate の tilt をそのまま */
export function r3Ds(sHat, Om, { sense, kTilt = 0, kPrec = 1, ratio = 1 } = {}) {
  const R = R3.r3Rate(sHat, Om, { kTilt, kPrec: 0, ratio });
  return add(R.tilt, precDs(sHat, Om, { sense, kPrec, ratio }));
}
/** ŝ·Ω の符号(+1 順回転・−1 逆回転・0 直交か Ω 0) */
export function spinSense(sHat, Om) {
  if (!(isVec(sHat) && isVec(Om))) throw new RangeError('spinSense: ベクトル');
  const d = dot(sHat, Om); return d > 0 ? 1 : d < 0 ? -1 : 0;
}
/** 合成の軸 Ω̂ のまわりの歳差が自転と同じ回り(+1)か逆回り(−1)か。Ω 0・ŝ ∥ Ω・方位の率 0 なら 0 */
export function relSense(sHat, Om, ds) {
  if (!(isVec(sHat) && isVec(Om) && isVec(ds))) throw new RangeError('relSense: ベクトル');
  if (!(nrm(Om) > 0)) return 0;
  const pr = poleRates(Om, sHat, ds);
  if (pr === null || pr.az === 0) return 0;
  return (pr.az > 0 ? 1 : -1) * spinSense(sHat, Om);
}
/** 背景の向きの単位ベクトル: 'Gm'・'Gp' は第351便e の bgTerm の向き(受け手に依らない)・'Np'・'Nm' は引数の軸 axis(省けば基準軸の定数 refEq) */
export function bgDir(name, { axis = null } = {}) {
  if (!DECL.bgNames.includes(name)) throw new RangeError('bgDir: 背景の向きは ' + DECL.bgNames.join('・'));
  if (name === 'Gm' || name === 'Gp') return unit(BB.bgTerm('Earth', { u: 1, sign: name === 'Gm' ? -1 : 1 }).vec);
  const a = axis === null ? DECL.refEq.slice() : axis;
  if (!(isVec(a) && nrm(a) > 0)) throw new RangeError('bgDir: (N±) の軸は長さのある [3]');
  return scl(unit(a), name === 'Np' ? 1 : -1);
}
/** 背景のベクトル(rad/s): 大きさは第351便e の bgTerm(ω_G × u)・向きは bgDir */
export function bgVec(name, { u = 1, axis = null } = {}) {
  if (!(fin(u) && u >= 0)) throw new RangeError('bgVec: 倍率 u ≥ 0');
  return scl(bgDir(name, { axis }), nrm(BB.bgTerm('Earth', { u: 1 }).vec) * u);
}
/** 金星で太陽由来の成分 part と背景の大きさが同じになる倍率(÷ k —— 第351便e の uEqMag) */
export function uVenus(T1, GEO, { part = 'S', k = 1 } = {}, cache = null) {
  const V = BB.localOf(T1, GEO, 'Venus', 'Sun', { k }, cache);
  return BB.uEqMag(V.sun[part], BB.bgTerm('Venus', { u: 1 }).vec);
}
/** 8 惑星の公転の法線の等しい重みの平均(geometry() の枠 —— 定数 refEq と照合する用) */
export function refAxisEq(GEO) { return unit(DECL.planets.reduce((t, id) => add(t, unit(GEO[id + '|Sun'].n)), [0, 0, 0])); }

/**
 * 1 つの受け手の行: 局所の太陽由来の成分 part(k)+ 背景(name・u)・向きの読み sense・経路 ① の比率(f・norm —— 第351便d の r3Coeffs)。
 * 4 つの極(合成の軸・自分の公転の北極・基準軸 axis〔省けば refEq〕・黄道の極)のまわりの方位の率と傾きの率(rad/s)。
 * 戻り値の poleDot は ŝ と各極の内積(極に対する自転の向き —— 極の向きの相対の回りを読む用)。kTilt・kPrec は (N3) のときだけ(第351便d の r3Coeffs)。
 * id 'Sun' は背景だけに応答する受け手(自転軸 = geometry() の太陽の自転軸・公転の北極の極は無し)。
 */
export function rowOf(T1, GEO, id, { bg, sense, u, part = 'S', k = 1, f = 0, norm = 'N1', kTilt, kPrec, axis = null }, cache = null) {
  const ref = axis === null ? DECL.refEq.slice() : unit(axis), b = bgVec(bg, { u, axis: ref });
  let s, n, loc;
  if (id === 'Sun') { s = unit(GEO['Earth|Sun'].s); n = null; loc = [0, 0, 0]; }
  else { const L = BB.localOf(T1, GEO, id, 'Sun', { k }, cache); s = unit(L.sHat); n = unit(L.nHat); loc = L.sun[part]; }
  const Om = add(b, loc), c = R3.r3Coeffs(f, norm, { kTilt, kPrec }), ds = r3Ds(s, Om, { sense, kTilt: c.kTilt, kPrec: c.kPrec });
  const poles = { om: nrm(Om) > 0 ? unit(Om) : null, orb: n, ref, ecl: DECL.ecl.slice() }, rates = {};
  const poleDot = {};
  for (const p of DECL.poles) { rates[p] = poles[p] === null ? null : poleRates(poles[p], s, ds); poleDot[p] = poles[p] === null ? null : dot(s, poles[p]); }
  return { id, bg, sense, u, part, k, f, norm, sHat: s, nHat: n, Om, bgVec: b, local: loc, ds, poleDot,
    cosBg: dot(s, unit(b)), cosOm: nrm(Om) > 0 ? dot(s, unit(Om)) : null, spin: spinSense(s, Om), rel: relSense(s, Om, ds), rates };
}

/* ───────── 零試験・変異 ───────── */
export function pureScenes(T1 = E.t1Table(), GEO = E.geometry()) {
  const cache = {}, Oz = [0, 0, 1], sT = (deg) => [Math.sin(deg * D2R), 0, Math.cos(deg * D2R)];
  // ① (g2+) = 第351便d の r3Rate の prec(f 0・(N1))—— 傾けた 6 場面 × Ω 2 種
  let vsR3 = 0;
  for (const deg of [10, 40, 80, 100, 140, 170]) for (const Om of [[0, 0, 2.5], [0.3, -0.7, 1.1]]) {
    const c0 = R3.r3Coeffs(0, 'N1'), r = R3.r3Rate(sT(deg), Om, c0);
    vsR3 = Math.max(vsR3, nrm(sub(precDs(sT(deg), Om, { sense: 'g2p', kPrec: c0.kPrec }), r.prec)), nrm(sub(r3Ds(sT(deg), Om, { sense: 'g2p', kTilt: 0, kPrec: 1 }), r.ds)));
  }
  // ② relSense と閉じた形(abs(Ω) 2・k₂ 0.7・ratio 1.3): 方位の率 = ±k₂ ratio abs(Ω)・傾きの率 0(なす角を保つ)
  const om2 = [0, 0, 2], kp = 0.7, ra = 1.3, want = kp * ra * 2, sc = [];
  for (const deg of [15, 45, 75, 105, 135, 165]) for (const sense of DECL.senses) {
    const s = sT(deg), ds = precDs(s, om2, { sense, kPrec: kp, ratio: ra }), pr = poleRates(om2, s, ds);
    sc.push({ deg, sense, azErr: Math.abs(pr.az - (sense === 'g2p' ? 1 : -1) * want) / want, inc: Math.abs(pr.inc), keep: Math.abs(dot(ds, unit(om2))), rel: relSense(s, om2, ds), spin: spinSense(s, om2) });
  }
  // ③ 経路 ① の傾きの率の閉じた形(Ω̂ のまわり: inc = −k₁ ratio abs(Ω) sin θ)と、経路 ① は Ω̂ のまわりの方位の率を変えない
  let incErr = 0, azKeep = 0;
  for (const deg of [20, 60, 120, 160]) {
    const s = sT(deg), d1 = r3Ds(s, om2, { sense: 'g2m', kTilt: 0.6, kPrec: 0.8 }), d0 = r3Ds(s, om2, { sense: 'g2m', kTilt: 0, kPrec: 0.8 });
    const p1 = poleRates(om2, s, d1), p0 = poleRates(om2, s, d0);
    incErr = Math.max(incErr, Math.abs(p1.inc + 0.6 * 2 * Math.sin(deg * D2R)));
    azKeep = Math.max(azKeep, Math.abs(p1.az - p0.az) / Math.abs(p0.az));
  }
  // ④ 平行で null・極の反転で方位の率の符号が逆・傾きの率の符号も逆(傾き = 180° − 傾き)
  const nul = poleRates(Oz, [0, 0, 3], [1, 0, 0]) === null && poleRates(Oz, [0, 0, -1], [1, 0, 0]) === null;
  const s40 = sT(40), dsx = precDs(s40, [0.2, 0.5, 1], { sense: 'g2p' }), pA = poleRates(Oz, s40, dsx), pB = poleRates([0, 0, -1], s40, dsx);
  const poleFlip = Math.abs(pA.az + pB.az) + Math.abs(pA.inc + pB.inc);
  // ⑤ 自転の反転(ŝ → −ŝ)で spinSense が逆・(g2+) の relSense も逆((g2+) の Ω̂ のまわりの方位の率は ŝ の向きに依らず +)
  const flipS = spinSense(scl(s40, -1), om2) === -1 && relSense(scl(s40, -1), om2, precDs(scl(s40, -1), om2, { sense: 'g2p' })) === -1;
  // ⑥ (g2−) = −(g2+)
  const anti = nrm(add(precDs(s40, [0.2, 0.5, 1], { sense: 'g2m' }), dsx));
  // ⑦ 背景の向き: (G−) = bgTerm の主・(G+) = −(G−)・(N±) = ± 軸・大きさは bgTerm と同じ
  const gm = bgDir('Gm'), bgOk = nrm(sub(gm, unit(BB.bgTerm('Mars', { u: 3 }).vec))) < 1e-15 && nrm(add(bgDir('Gp'), gm)) < 1e-15
    && nrm(sub(bgDir('Np', { axis: [0, 0, 5] }), Oz)) < 1e-15 && nrm(add(bgDir('Nm'), unit(DECL.refEq))) < 1e-15
    && Math.abs(nrm(bgVec('Np', { u: 7 })) / nrm(BB.bgTerm('Earth', { u: 7 }).vec) - 1) < 1e-12;
  // ⑧ 統括の数え直し 1 の数(3 桁)
  const uV = uVenus(T1, GEO, { part: 'S' }, cache), uVms = uVenus(T1, GEO, { part: 'MS' }, cache), refG = refAxisEq(GEO);
  const az = (id, bg, pole) => rowOf(T1, GEO, id, { bg, sense: 'g2p', u: uV }, cache).rates[pole].az * ASYR;
  const anc = { uV, uVms, refErr: nrm(sub(refG, DECL.refEq)),
    angRefSun: R3.angDeg(DECL.refEq, GEO['Earth|Sun'].s), angRefBg: R3.angDeg(DECL.refEq, bgDir('Gm')),
    earthGmRef: az('Earth', 'Gm', 'ref'), earthGmOrb: az('Earth', 'Gm', 'orb'), earthNpRef: az('Earth', 'Np', 'ref'),
    marsGmRef: az('Mars', 'Gm', 'ref'), venusGmRef: az('Venus', 'Gm', 'ref'), venusNpOm: az('Venus', 'Np', 'om') };
  // (g2−) は符号が全部逆
  const r2p = rowOf(T1, GEO, 'Earth', { bg: 'Gm', sense: 'g2p', u: uV }, cache), r2m = rowOf(T1, GEO, 'Earth', { bg: 'Gm', sense: 'g2m', u: uV }, cache);
  const allFlip = DECL.poles.every((p) => r2p.rates[p] && Math.abs(r2p.rates[p].az + r2m.rates[p].az) <= 1e-12 * Math.abs(r2p.rates[p].az)) && r2p.rel === 1 && r2m.rel === -1;
  // 変異
  const muts = {
    flipAz: poleRates(om2, s40, precDs(s40, om2, { sense: 'g2p' }), { mut: 'flipAz' }).az < 0,
    noSquare: Math.abs(poleRates(om2, s40, precDs(s40, om2, { sense: 'g2p' }), { mut: 'noSquare' }).az - 2) > 0.1,
    swapCross: poleRates(om2, s40, precDs(s40, om2, { sense: 'g2p' }), { mut: 'swapCross' }).az < 0,
  };
  const rej = [() => poleRates([0, 0, 0], s40, dsx), () => poleRates(Oz, [1, 0], dsx), () => precDs(s40, Oz, { sense: 'g2' }), () => precDs(s40, Oz, {}),
    () => bgDir('Gx'), () => bgDir('Np', { axis: [0, 0, 0] }), () => bgVec('Gm', { u: -1 }), () => spinSense([1, 0, 0], 'x')]
    .map((fn) => { try { fn(); return false; } catch (e) { return e instanceof RangeError; } });
  return { vsR3, sc, incErr, azKeep, nul, poleFlip, flipS, anti, bgOk, anc, allFlip, muts, rejects: rej };
}
const p3 = (x, w) => Number(x.toPrecision(3)) === Number(w.toPrecision(3));
export function pureGates(S) {
  const A = DECL.anchor, a = S.anc;
  return {
    g2pIsR3: S.vsR3 < 1e-12,
    closedAz: S.sc.length === 12 && S.sc.every((r) => r.azErr < 1e-12 && r.inc < 1e-12 && r.keep < 1e-12),
    relSense: S.sc.every((r) => r.rel === (r.sense === 'g2p' ? 1 : -1) * r.spin) && S.sc.filter((r) => r.deg < 90).every((r) => r.rel === (r.sense === 'g2p' ? 1 : -1)),
    path1: S.incErr < 1e-12 && S.azKeep < 1e-12,
    parallelNull: S.nul,
    poleFlip: S.poleFlip < 1e-12,
    spinFlip: S.flipS && S.anti < 1e-15,
    bgDir: S.bgOk,
    anchor352: p3(a.uV, A.uV) && Math.abs(a.uVms - A.uVms) < 5e-5 && a.refErr < 1e-7 && Math.abs(a.angRefSun - A.angRefSun) < 5e-4 && Math.abs(a.angRefBg - A.angRefBg) < 5e-4
      && p3(a.earthGmRef, A.earthGmRef) && p3(a.earthGmOrb, A.earthGmOrb) && p3(a.earthNpRef, A.earthNpRef) && p3(a.marsGmRef, A.marsGmRef) && p3(a.venusGmRef, A.venusGmRef) && p3(a.venusNpOm, A.venusNpOm),
    g2mFlip: S.allFlip,
    mutants: S.muts.flipAz && S.muts.noSquare && S.muts.swapCross,
    rejects: S.rejects.length === 8 && S.rejects.every(Boolean),
  };
}
