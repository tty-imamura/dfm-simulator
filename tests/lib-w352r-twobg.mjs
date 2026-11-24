// 第352便r(原仮定者の整理(2026-11-24 —— 第148報)・原仮定者の回答(2026-11-24 —— 第148報)・統括の検証項目 R455):
//   **背景の向きの項を 2 つ同時に置いた候補(基準軸の向きの項 (N+) + 銀河の回転と逆向きの項 (G−))を、大きさの比 b ÷ a をノブにして数える純関数 —— 診断だけ**
//   (器 tests/exp-w352r-twobg.mjs と QA behavior.twobg352r・docs.twobg352r が読む —— html を読まない・ファイルを読まない・状態を持たない。後のラウンドの枝もこの口を import してよい)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない。
//   既存の lib は呼ぶだけ(本文は変えない): 第352便c(refAxes・galDirs・azimuthDeg・dAz)・第352便d(bgVec・uVenus・r3Ds)・第352便e(sunInput・rotOf・sunLocal)・
//   第352便j(cellOf —— 零試験の照合)・第352便k(spinRot —— 源の半径の置き方)・第352便l(closedAxis・twoAxisStep・openTime・dphiFor・wobbleRadius)・
//   第351便c(partRot —— 零試験の照合)・第348便c(radiusOf)・第347便e(t1Table・geometry)・第337便c(年の長さ・年齢の宣言)。
//
// ■ 背景(候補 —— 1 つに決めない): Ω_bg = a ω_G N̂ + b ω_G Ĝ₋(a・b ≥ 0・ω_G = 銀河の公転の角速度・N̂ = 基準軸 L か eq・Ĝ₋ = 第351便e の bgTerm の主の向き)。
//   比 ρ = b ÷ a がノブ。大きさは「a を金星の条件で置く」(a = 金星で (S) と大きさが同じになる倍率 —— 源の半径の列ごと)・ρ = ∞ は a 0・b = 同じ倍率(純粋な (G−))。
// ■ 局所の (S): 惑星は太陽由来の (S)(第352便k の spinRot —— 源の半径 規則 tSrc 0 /観測 tSrc 1)・太陽は惑星由来の (S) の和(第352便e の rotOf —— 源の半径を P.Rs で)。
//   合成 Ω = Ω_bg + k × 局所(k 既定 1)。輪(公転面の法線)は背景だけを受ける(第352便l の候補 (b) と同じ置き方)。
// ■ 2 つの軸が開く率(第352便l の閉じた形): 初めにそろった 2 つの軸(基準軸 X₀)の開き始めの率 = sin θ × (係数の差) × abs(Ω)(θ = X₀ と Ω の角)。
//   経路 ② だけなら γ に要る方位の差 Δφ = dphiFor(θ, γ) —— 年数 = Δφ ÷ (係数の差 × abs(Ω))・届く角の上限は 2θ。
// ■ 作られる方位: 開き始めの「ŝ − n̂」の向きの、基準軸のまわりの方位(第352便c の azimuthDeg —— 右ねじで正)を (G+) の方位から測る。
//   その後の歳差(合成の軸のまわり —— (g2+) は右ねじで正・(g2−) は負)で、いまの方位まで進む角と時間(率 = abs(Ω) × 係数 —— 合成の軸 ≈ 基準軸の読み)。
// ■ 上下の運動の揺れ(減りの率 γ_d を入れた形 —— 候補の式): 円の半径 = (A/2) [1 ÷ hypot(Ω_p − ω_z, γ_d) + 1 ÷ hypot(Ω_p + ω_z, γ_d)](γ_d 0 で第352便l の wobbleRadius)。
// ■ 言わないこと: 背景が 2 つの項から成るとは書かない(候補の走査)。太陽の傾きの由来の答えとは書かない。この場・この比・この係数では、の表。
import * as RC from './lib-w352c-refaxis.mjs';
import * as PD from './lib-w352d-precsense.mjs';
import * as SR from './lib-w352e-sunrecv.mjs';
import * as MJ from './lib-w352j-maintable.mjs';
import * as SK from './lib-w352k-spinform.mjs';
import * as SL from './lib-w352l-suntilt.mjs';
import * as SP from './lib-w351c-srcparts.mjs';
import * as C from './lib-w348c-axisbalance.mjs';
import * as E from './lib-w347e-spintorque.mjs';
import * as TL from './lib-w337c-tidelock.mjs';

export const LIB_VERSION = 'w352r-twobg-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const D2R = Math.PI / 180;
const { dot, crs, nrm, scl, add, sub, unit } = SL.vec;
const isVec = (a) => Array.isArray(a) && a.length === 3 && a.every(fin);
const rel = (a, b) => nrm(sub(a, b)) / Math.max(nrm(b), 1e-300);
export const angDeg = SL.angDeg;
export const YR = TL.YR;
export const ASYR = PD.ASYR;
export const vec = Object.freeze({ dot, crs, nrm, scl, add, sub, unit });

/* ───────── 宣言(走らせたノブの格子と判定の物差しの記録 —— 式の形の宣言ではない)───────── */
export const DECL = Object.freeze({
  planets: SR.PLANETS, axes: Object.freeze(['L', 'eq']), rads: Object.freeze(['rule', 'obs']),
  radLabels: Object.freeze({ rule: '規則の半径(在位)', obs: '観測の半径' }), radT: Object.freeze({ rule: 0, obs: 1 }),
  /** 比 b ÷ a の表の格子(∞ = 純粋な (G−)) */
  rhos: Object.freeze([0, 1e-3, 1e-2, 0.1, 0.3, 1, 3, Infinity]),
  /** 同時の条件の走査(比の対数の格子)と、条件の物差し */
  scan: Object.freeze({ lo: -5, hi: 3, perDecade: 200 }),
  conds: Object.freeze({ sunConeDeg: 10, venusRes: 0.1, earthRefDeg: 10 }),
  /** 係数の差の列(輪 1・太陽の自転軸 1 − δ) */
  deltas: Object.freeze([0.01, 0.001]),
  tiltDeg: SL.DECL.tiltDeg, ageYr: SL.DECL.ageYr, omegaG: SL.DECL.omegaG, uV: 1.19282e-12,
  floor: 1e-12, judge: '丸めの桁の床: 打ち消しで 0 になる量は尺度の 1e-12 倍以下を 0 と書く',
});

/* ───────── 背景の 2 つの項 ───────── */
/** 背景のベクトル(rad/s): a ω_G N̂ + b ω_G Ĝ₋(a・b は ω_G の倍・N̂ = axis) */
export function bgTwo({ a, b, axis }) {
  if (!(fin(a) && a >= 0 && fin(b) && b >= 0 && isVec(axis) && nrm(axis) > 0)) throw new RangeError('bgTwo: a・b ≥ 0・軸');
  return add(PD.bgVec('Np', { u: a, axis }), PD.bgVec('Gm', { u: b }));
}
/** 比 ρ と a から (a, b)(ρ ∞ は a 0・b = a₀ —— 純粋な (G−)) */
export function abOf(rho, a0) {
  if (!(fin(a0) && a0 >= 0 && (rho === Infinity || (fin(rho) && rho >= 0)))) throw new RangeError('abOf: ρ ≥ 0 か ∞・a₀ ≥ 0');
  return rho === Infinity ? { a: 0, b: a0 } : { a: a0, b: rho * a0 };
}

/* ───────── 局所の (S)(源の半径 2 列)───────── */
/** 惑星 id の太陽由来の (S)(rad/s)・rad 'rule' | 'obs'。太陽 'Sun' は惑星由来の (S) の和(源 = 惑星の半径を規則/観測で) */
export function localS(T1, GEO, id, { rad = 'rule', k = 1 } = {}, cache = null) {
  if (!DECL.rads.includes(rad)) throw new RangeError('localS: 源の半径は rule・obs');
  const ck = 'S|' + id + '|' + rad + '|' + k;
  if (cache && cache[ck]) return cache[ck];
  let v;
  if (id === 'Sun') {
    let sum = [0, 0, 0], sHat = null;
    for (const p of DECL.planets) {
      const P = SR.sunInput(T1, GEO, p); if (rad === 'obs') P.Rs = C.radiusOf(p);
      sum = add(sum, SR.rotOf(P, { part: 'S', k }).Om); sHat = P.sHat;
    }
    v = { S: sum, sHat: unit(sHat), nHat: null };
  } else {
    const r = SK.spinRot(T1, GEO, id, 'Sun', { part: 'S', tSrc: DECL.radT[rad], k });
    v = { S: r.Om, sHat: unit(r.sHat), nHat: unit(r.nHat) };
  }
  if (cache) cache[ck] = v;
  return v;
}
/** 金星で (S)(源の半径の列)と背景の大きさが同じになる倍率(ω_G の倍)—— 「a を金星の条件で置く」 */
export function uVenusRad(T1, GEO, { rad = 'rule', k = 1 } = {}, cache = null) {
  return nrm(localS(T1, GEO, 'Venus', { rad, k }, cache).S) / nrm(PD.bgVec('Np', { u: 1 }));
}

/* ───────── 1 つの天体の量 ───────── */
/**
 * 受け手 id(太陽か 8 惑星)の合成と角: { Om, omAsYr, coneDeg(合成と ŝ)・refDeg(合成と基準軸)・res(abs(合成) ÷ abs(背景))・cosBg }。
 * 基準軸との角は N̂ の項を外積から外して直接に数える(N̂ × N̂ = 0 —— 大きい数の差で作らない)。
 */
export function bodyOf(T1, GEO, id, { a, b, axis, rad = 'rule', k = 1 }, cache = null) {
  const L = localS(T1, GEO, id, { rad, k }, cache), bg = bgTwo({ a, b, axis }), Om = add(bg, L.S), om = nrm(Om), ax = unit(axis);
  const off = add(PD.bgVec('Gm', { u: b }), L.S);   // N̂ に直交しうる分(N̂ の項は外積に寄与しない)
  return { id, Om, omAsYr: om * ASYR, bgAsYr: nrm(bg) * ASYR,
    coneDeg: om > 0 ? angDeg(Om, L.sHat) : null, refDeg: om > 0 ? Math.atan2(nrm(crs(off, ax)), dot(Om, ax)) / D2R : null,
    res: nrm(bg) > 0 ? om / nrm(bg) : null, cosBg: nrm(bg) > 0 ? dot(L.sHat, unit(bg)) : null, sHat: L.sHat };
}

/* ───────── 2 つの軸が開く(第352便l の閉じた形)───────── */
/** 開き始めの率(rad/s): sin θ × δ × abs(Ω)(θ = X₀ と Ω の角)。N̂ の項を外して sin θ を直接に */
export function openRate({ X0, Om, delta, offOm = null }) {
  if (!(isVec(X0) && isVec(Om) && fin(delta) && delta >= 0)) throw new RangeError('openRate: X₀・Ω・δ ≥ 0');
  const om = nrm(Om); if (!(om > 0)) return 0;
  const sinT = nrm(crs(offOm === null ? Om : offOm, unit(X0))) / om;
  return sinT * delta * om;
}
/** 経路 ② だけ(f 0)で γ 開くのに要る年数 —— 届かない(2θ < γ)なら null */
export function openYears2({ thDeg, om, delta, gammaDeg }) {
  if (!(fin(om) && om >= 0 && fin(delta) && delta > 0)) throw new RangeError('openYears2: abs(Ω) ≥ 0・δ > 0');
  const dp = SL.dphiFor({ thDeg, gammaDeg });
  if (dp === null || !(om > 0)) return null;
  return dp / (delta * om) / YR;
}
/** 経路 ② だけで、太陽系の年齢の内に γ 開くのに要る係数の差 —— 届かないなら null */
export function deltaForAge({ thDeg, om, gammaDeg, ageYr = DECL.ageYr }) {
  const dp = SL.dphiFor({ thDeg, gammaDeg });
  if (dp === null || !(om > 0)) return null;
  return dp / (om * ageYr * YR);
}
/** 経路 ① だけ(f 1)で γ 開く年数(第352便l の openTime —— 輪 1・太陽 1 − δ)—— 届かないなら null */
export function openYears1({ X0, Om, delta, gammaDeg }) {
  const om = nrm(Om); if (!(om > 0)) return null;
  const th = angDeg(X0, Om), est = (gammaDeg * D2R) / Math.max(Math.sin(th * D2R) * delta * om, 1e-300);
  const t = SL.openTime({ X0, Om, gammaDeg, ring: SL.axisCoef(1), spin: SL.axisCoef(1, { ratio: 1 - delta }), tMax: est * 1e3 });
  return t === null ? null : t / YR;
}

/* ───────── 作られる方位とその後の歳差 ───────── */
/**
 * 開き始めの ŝ − n̂ の向き(輪の係数 1・太陽の係数 1 − δ —— 符号 sign +1 = 太陽が遅い/−1 = 太陽が速い)の、基準軸のまわりの方位 − (G+) の方位(°)。
 * f 0(経路 ② だけ)か 1(経路 ① だけ)・歳差の向き sense。
 */
export function createdDAz(GEO, { axis, Om, f, sense, sign = 1, delta = 0.01 }) {
  const c1 = SL.axisCoef(f, { sense, ratio: 1 }), c2 = SL.axisCoef(f, { sense, ratio: 1 + (sign > 0 ? -delta : delta) });
  const d = sub(SL.axisDs(axis, Om, c2), SL.axisDs(axis, Om, c1)), g = RC.galDirs(GEO);
  return RC.dAz(RC.azimuthDeg(axis, d).az, RC.azimuthDeg(axis, g.Gp).az);
}
/** いまの方位(太陽の自転軸 − (G+)・基準軸のまわり) */
export function nowDAz(GEO, axis) { const g = RC.galDirs(GEO), s = unit(GEO['Earth|Sun'].s); return RC.dAz(RC.azimuthDeg(axis, s).az, RC.azimuthDeg(axis, g.Gp).az); }
/** 作られた方位からいまの方位まで、歳差の向き sense で進む角(°・0〜360)—— (g2+) は右ねじで正の向きに進む */
export function advanceDeg(fromDAz, toDAz, sense) {
  if (!PD.DECL.senses.includes(sense)) throw new RangeError('advanceDeg: 歳差の向きは g2p・g2m');
  const d = sense === 'g2p' ? toDAz - fromDAz : fromDAz - toDAz;
  return ((d % 360) + 360) % 360;
}

/* ───────── 上下の運動の揺れ(減りの率つき)───────── */
/** 円の半径(rad)= (A/2)/hypot(Ω_p − ω, γ_d) + (A/2)/hypot(Ω_p + ω, γ_d)。γ_d 0・Ω_p ≠ ω で第352便l の wobbleRadius の max と同じ */
export function wobbleDamped({ A, Op, w, gam = 0 }) {
  if (!(fin(A) && A >= 0 && fin(Op) && Op >= 0 && fin(w) && w > 0 && fin(gam) && gam >= 0 && (gam > 0 || Op !== w))) throw new RangeError('wobbleDamped: A ≥ 0・Ω_p ≥ 0・ω > 0・γ ≥ 0(γ 0 なら Ω_p ≠ ω)');
  const a = A / 2 / Math.hypot(Op - w, gam), b = A / 2 / Math.hypot(Op + w, gam);
  return { max: a + b, a, b };
}
/** 共鳴の円だけで半径 target(rad)に届く減りの率の上限(Ω_p = ω のとき)= A ÷ (2 target) */
export const gamMaxFor = ({ A, target }) => A / (2 * target);
/** 減りの率 γ_d のもとで半径 target に届く Ω_p − ω の幅(片側・rad/s)—— 届かないなら null(共鳴の円だけの式) */
export function windowHalf({ A, target, gam = 0 }) {
  const q = A / (2 * target); if (!(q > gam)) return null;
  return Math.sqrt(q * q - gam * gam);
}

/* ───────── 零試験 ───────── */
export const ANCHOR = Object.freeze({ uV: 1.19282e-12, sunConeDeg: Object.freeze({ eq: '5.230', L: '5.968', Gm: '67.231' }) });
const f3 = (x) => x.toFixed(3);
export function pureScenes(T1 = E.t1Table(), GEO = E.geometry()) {
  const cache = {}, RA = RC.refAxes(T1, GEO), uV = uVenusRad(T1, GEO, { rad: 'rule' }, cache);
  // ① b 0 で (N+) の表・a 0 で (G−) の表(第352便j の cellOf —— 基準軸 eq・(S)・(uV)・(g2+))と同じ数(合成と ŝ・合成と基準軸・cos(ŝ, 背景))
  let vsJ = 0;
  for (const id of DECL.planets) for (const axn of DECL.axes) for (const [bg, rho] of [['Np', 0], ['Gm', Infinity]]) {
    const { a, b } = abOf(rho, uV), me = bodyOf(T1, GEO, id, { a, b, axis: RA[axn] }, cache);
    const j = MJ.cellOf(T1, GEO, id + '|Sun', { bg, axis: axn, sense: 'g2p', u: uV, part: 'S' }, cache);
    vsJ = Math.max(vsJ, Math.abs(me.coneDeg - j.coneDeg), Math.abs(me.refDeg - j.refDeg), Math.abs(me.cosBg - j.cosBg), rel(me.Om, j.Om));
  }
  // 統括の数え直し 1 の表(eq)の 3 桁と照合
  const anc = MJ.DECL.anchor; let vsAnchor = 0;
  for (const id of DECL.planets) for (const [bg, rho] of [['Np', 0], ['Gm', Infinity]]) {
    const { a, b } = abOf(rho, uV), me = bodyOf(T1, GEO, id, { a, b, axis: RA.eq }, cache), r = anc[bg][id];
    vsAnchor = Math.max(vsAnchor, Math.abs(me.cosBg - r[0]) / 5e-4, Math.abs(me.coneDeg - r[1]) / 5e-4, Math.abs(me.refDeg - r[2]) / 5e-4);
  }
  // ② 局所の (S) の規則の列 = 第351便c の partRot(part 'S')・太陽の規則の列 = 第352便e の sunLocal の和
  const vsPart = Math.max(...DECL.planets.map((id) => rel(localS(T1, GEO, id, {}, cache).S, SP.partRot(T1, GEO, id, 'Sun', { part: 'S' }).Om)));
  const vsSun = rel(localS(T1, GEO, 'Sun', {}, cache).S, SR.sunLocal(T1, GEO).sum.S);
  const obsBig = nrm(localS(T1, GEO, 'Earth', { rad: 'obs' }, cache).S) / nrm(localS(T1, GEO, 'Earth', {}, cache).S);
  // ③ 金星の条件の倍率(規則)= 1.19282e-12 = 第352便d の uVenus
  const uVd = PD.uVenus(T1, GEO);
  // ④ 太陽の円錐(局所を入れた合成): (N+) eq 5.230°・L 5.968°・(G−) 67.231°
  const sunCone = { eq: f3(bodyOf(T1, GEO, 'Sun', { a: uV, b: 0, axis: RA.eq }, cache).coneDeg), L: f3(bodyOf(T1, GEO, 'Sun', { a: uV, b: 0, axis: RA.L }, cache).coneDeg),
    Gm: f3(bodyOf(T1, GEO, 'Sun', { a: 0, b: uV, axis: RA.L }, cache).coneDeg) };
  // ⑤ 開き始めの率の閉じた形と第352便l の twoAxisStep(短い時間の差分 —— 経路 ②)
  const Om = bgTwo({ a: 1, b: 0.3, axis: RA.L }), dlt = 0.01, tS = 1e-4 / nrm(Om);
  const st = SL.twoAxisStep({ n0: RA.L, s0: RA.L, om: Om, T: tS, steps: 1, ring: SL.axisCoef(0), spin: SL.axisCoef(0, { ratio: 1 - dlt }) });
  const rateVs = Math.abs(st.gammaDeg * D2R / tS / openRate({ X0: RA.L, Om, delta: dlt }) - 1);
  // ⑥ 経路 ② の年数の往復: その年数で twoAxisStep が γ に届く
  const th = angDeg(RA.L, Om), yrs = openYears2({ thDeg: th, om: nrm(Om), delta: dlt, gammaDeg: 5.968 });
  const back = SL.twoAxisStep({ n0: RA.L, s0: RA.L, om: Om, T: yrs * YR, steps: 1, ring: SL.axisCoef(0), spin: SL.axisCoef(0, { ratio: 1 - dlt }) }).gammaDeg;
  const yrRound = Math.abs(back - 5.968);
  const dAge = deltaForAge({ thDeg: th, om: nrm(Om), gammaDeg: 5.968, ageYr: yrs }), dRound = Math.abs(dAge / dlt - 1);
  // ⑦ 作られる方位と短い步の向きが同じ(経路 ②・(g2+)・太陽が遅い)
  const cz = createdDAz(GEO, { axis: RA.L, Om, f: 0, sense: 'g2p' });
  const stepDir = sub(st.s, st.n), g = RC.galDirs(GEO), stepAz = RC.dAz(RC.azimuthDeg(RA.L, stepDir).az, RC.azimuthDeg(RA.L, g.Gp).az);
  const azVs = Math.abs(RC.dAz(cz, stepAz));
  // ⑧ 進む角: (g2+) と (g2−) の和は 360(0 でないとき)・同じ方位で 0
  const adv = [advanceDeg(10, -20, 'g2p'), advanceDeg(10, -20, 'g2m'), advanceDeg(5, 5, 'g2p')];
  // ⑨ 揺れ: γ_d 0 で第352便l の wobbleRadius・共鳴で (A/2)/γ_d + (A/2)/(2ω)・窓の端で共鳴の円が target
  const wl = SL.wobbleRadius({ A: 0.01, Op: 1, w: 2.5 }), wd = wobbleDamped({ A: 0.01, Op: 1, w: 2.5 }), wVs = Math.abs(wd.max / wl.max - 1);
  const wr = wobbleDamped({ A: 0.01, Op: 2.5, w: 2.5, gam: 0.02 }), wrVs = Math.abs(wr.max / (0.005 / 0.02 + 0.005 / Math.hypot(5, 0.02)) - 1);
  const hw = windowHalf({ A: 0.01, target: 0.1, gam: 0.03 }), wEdge = Math.abs(0.005 / Math.hypot(hw, 0.03) - 0.1);
  // ⑩ 揺れの步(減りの率つき —— 小角の複素の式 dζ/dt = i Ω_p ζ − γ_d ζ + i A sin(ω t))で、過渡が減った後の最大が閉じた形と同じ
  const Op = 1, w = 2.5, A = 0.01, gm = 0.3; let z = [0, 0], mx = 0; const h = 2e-3, F = (t, q) => [-Op * q[1] - gm * q[0], Op * q[0] - gm * q[1] + A * Math.sin(w * t)];
  for (let i = 0, t = 0; i < 200000; i++, t += h) {
    const k1 = F(t, z), k2 = F(t + h / 2, [z[0] + k1[0] * h / 2, z[1] + k1[1] * h / 2]), k3 = F(t + h / 2, [z[0] + k2[0] * h / 2, z[1] + k2[1] * h / 2]), k4 = F(t + h, [z[0] + k3[0] * h, z[1] + k3[1] * h]);
    z = [z[0] + (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]) * h / 6, z[1] + (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]) * h / 6];
    if (t > 100) mx = Math.max(mx, Math.hypot(z[0], z[1]));
  }
  const wStep = Math.abs(mx / wobbleDamped({ A, Op, w, gam: gm }).max - 1);
  // ⑪ 拒否
  const rej = [() => bgTwo({ a: -1, b: 0, axis: RA.L }), () => abOf(-1, 1), () => localS(T1, GEO, 'Earth', { rad: 'x' }), () => openRate({ X0: [0, 0], Om, delta: 1 }),
    () => advanceDeg(0, 0, 'x'), () => wobbleDamped({ A: 1, Op: 1, w: 1 }), () => openYears2({ thDeg: 10, om: 1, delta: 0, gammaDeg: 1 })]
    .map((fn) => { try { fn(); return false; } catch (er) { return er instanceof RangeError; } });
  return { vsJ, vsAnchor, vsPart, vsSun, obsBig, uV, uVd, sunCone, rateVs, yrRound, dRound, azVs, cz, adv, wVs, wrVs, wEdge, wStep, rejects: rej };
}
export function pureGates(S) {
  return {
    rhoEndsVsMainTable: S.vsJ < 1e-9,
    anchorTable: S.vsAnchor <= 1,
    localRuleVsPartRot: S.vsPart < 1e-12 && S.vsSun < 1e-12,
    obsRadiusLarger: S.obsBig > 1e6,
    venusCondition: Math.abs(S.uV / ANCHOR.uV - 1) < 5e-6 && Math.abs(S.uV / S.uVd - 1) < 1e-12,
    sunCone: S.sunCone.eq === ANCHOR.sunConeDeg.eq && S.sunCone.L === ANCHOR.sunConeDeg.L && S.sunCone.Gm === ANCHOR.sunConeDeg.Gm,
    openRateVsStep: S.rateVs < 1e-3,
    openYearsRound: S.yrRound < 1e-6 && S.dRound < 1e-9,
    createdAzVsStep: S.azVs < 0.05,
    advance: S.adv[0] + S.adv[1] === 360 && S.adv[2] === 0,
    wobble: S.wVs < 1e-12 && S.wrVs < 1e-12 && S.wEdge < 1e-12 && S.wStep < 2e-3,
    rejects: S.rejects.every(Boolean),
  };
}
