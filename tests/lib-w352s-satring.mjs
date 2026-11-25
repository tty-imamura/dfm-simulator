// 第352便s(原仮定者の回答(2026-11-24 —— 第148報)AN1015・原仮定者の回答(2026-11-24 —— 第147報)AN1001・統括の検証項目 R456):
//   **衛星と輪を、主の成分 (S)(源の自転の分)で数え直す口 —— 母天体由来の (S)(母天体の自転の分)・太陽由来の (S)・背景((N+)/(G−) × 基準軸 L/eq × 大きさ)の合成、
//   潮汐ロックの 3 列 (ア)(イ)(ウ)、潮汐のトルク ÷ 軸引きずりの直交成分のトルク、イオの打ち消し(金星と同じ形)、互いにロックした冥王星–カロン、土星の環と太陽系の公転面の輪 —— 診断だけ**
//   (器 tests/exp-w352s-satring.mjs と QA behavior.satring352s・docs.satring352s が読む —— html を読まない・ファイルを読まない・状態を持たない)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない。既存の lib と第 1・第 2 ラウンドの lib は呼ぶだけ(本文は変えない):
//   第352便k(spinRot・srcRadius —— 源の半径の置き方 t: 0 規則の半径・1 観測の半径)・第352便d(bgVec・poleRates・precDs・uVenus)・
//   第352便c(refAxis)・第351便f(satInput・satTerms・lockCols・tideOf・torqueRatio・mutualRow)・第351便c(pairInput・partRot・pairParts・PARENT_ROWS・PAIRS16・perpOf)・
//   第351便d(r3Rate)・第351便j(saturnRows —— 土星の環の比べる列)・第348便h(makeField3・rot3・YK)・第350便b(equivR)・第347便h(gaussLegendre)・第348便c(massOf・radiusOf)・
//   第348便d(DECL.C.centers)・第338便d(centerKm)・第312便a(Kball)・第337便c(G_SI)・第347便e(t1Table・geometry)。
//
// ■ 語: 衛星の組 = 第351便c の PAIRS16 の衛星の行(月 2 位相・イオ・冥王星 ← カロン・カロン ← 冥王星 —— エウロパはサンプルの組に無い)。
//   母天体由来の (S) = 母天体の自転の分(相対の速度 0)・太陽由来の (S) = その天体の太陽のまわりの道での太陽の自転の分(第351便c の pairParts の作り —— 分母は自分 + 太陽 + 母天体)。
//   源の半径の置き方 t は**全部の源に同じ t**(t 0 = 規則の半径 Y_k M_源 —— 在位/t 1 = 観測の半径)。背景の大きさ (uV) は、その t で金星の太陽由来 (S) と大きさが同じ倍率(÷ k)。
// ■ 打ち消しで小さくなる量は、大きい数の差で作らない: (N+) で基準軸に平行な背景の直交成分は 0 —— 直交成分は局所の分から直接に数える。
// ■ 言わないこと: 潮汐ロックの成り立ち・内部熱の出どころ・イオの状態の答えとは書かない(比と残りの数だけ)。この場・この成分・この半径では、の表。
import * as K from './lib-w352k-spinform.mjs';
import * as PS from './lib-w352d-precsense.mjs';
import * as CR from './lib-w352c-refaxis.mjs';
import * as F from './lib-w351f-satlock.mjs';
import * as SP from './lib-w351c-srcparts.mjs';
import * as R3 from './lib-w351d-r3step.mjs';
import * as RJ from './lib-w351j-ringstep.mjs';
import * as G3 from './lib-w348h-axisgeo3.mjs';
import * as SC from './lib-w350b-sphereconv.mjs';
import * as H from './lib-w347h-axisdiff.mjs';
import * as C from './lib-w348c-axisbalance.mjs';
import * as DA from './lib-w348d-diskaxis.mjs';
import * as RB from './lib-w338d-ringbook.mjs';
import * as DK from './lib-w312a-decay.mjs';
import * as TL from './lib-w337c-tidelock.mjs';
import * as E from './lib-w347e-spintorque.mjs';

export const LIB_VERSION = 'w352s-satring-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const D2R = Math.PI / 180;
const { dot, crs, nrm, scl, add, sub, unit } = R3.vec;
const rel = (a, b) => nrm(sub(a, b)) / Math.max(nrm(b), 1e-300);
const angDeg = (a, b) => Math.atan2(nrm(crs(a, b)), dot(a, b)) / D2R;
export const ASYR = PS.ASYR;
const GL = H.gaussLegendre(SP.DECL.ballN);
const G = TL.G_SI;

/* ───────── 宣言 ───────── */
export const DECL = Object.freeze({
  sats: Object.freeze(['Moon|EarthHi', 'Moon|EarthLo', 'Io|Jupiter', 'Pluto|Charon', 'Charon|Pluto']),
  tSrcs: Object.freeze([0, 1]), tNames: Object.freeze({ 0: '規則の半径(在位)', 1: '観測の半径' }),
  bgs: Object.freeze(['Np', 'Gm']), bgLabels: Object.freeze({ Np: '(N+)', Gm: '(G−)' }),
  axes: Object.freeze(['L', 'eq']),
  parts: Object.freeze(['S', 'MS']),
  /** 背景の倍率の走査(÷ (uV) —— 10 の −3〜+5 乗を 0.5 刻み) */
  scanExp: Object.freeze([-3, -2.5, -2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]),
  /** 潮汐のトルクを数える天体(第351便f の tideBodies と同じ) */
  tideBodies: F.DECL.tideBodies, tideKey: F.DECL.tideKey,
  /** 互いにロックした連星の列(第351便f の mutualRow の引数) */
  mutRots: Object.freeze(['M', 'q0']), mutSpins: Object.freeze(['decl', 'sync', 'frame']), mutSpeeds: Object.freeze(['src', 'pair']),
  /** 輪: 土星の環の区分の中心(第348便d)・輪の粒子の数・小さい傾き 1°(第351便j と同じ)/太陽系の公転面の輪の半径(地球と土星の道の a) */
  ringCenters: DA.DECL.C.centers, ringN: 24, ringTiltDeg: 1, planeRingAt: Object.freeze(['Earth', 'Saturn']),
  /** 第351便f・第352便j の比べる数(点検) */
  anchor: Object.freeze({ io351fMS: '4.32e+3', moon351fMS: '1.56e-2', io352jS: 333, ioParBg: 0.891, ioNpRes: 0.120, uV: 1.19282e-12 }),
  judge: '丸めの桁の床: 打ち消しで 0 になる量は尺度の 1e-12 倍以下を 0 と書く・逐語の表は有効数字 3 桁',
});

/* ───────── 材料 ───────── */
const omegaG = () => K.DECL.omegaG;
/** 背景の大きさ (uV)(源の半径の置き方 t —— 金星の太陽由来 (S) と大きさが同じ倍率 ÷ k) */
export function uVt(T1, GEO, tSrc = 0, cache = null) {
  const ck = 'uV|' + tSrc; if (cache && cache[ck] !== undefined) return cache[ck];
  const v = nrm(K.spinRot(T1, GEO, 'Venus', 'Sun', { part: 'S', tSrc }).Om) / nrm(PS.bgVec('Gm', { u: 1 }));
  if (cache) cache[ck] = v; return v;
}
/** 背景のベクトル(背景の向き bg・基準軸 axis・倍率 u) */
export function bgOf(T1, GEO, bg, axis, u) { return PS.bgVec(bg, { u, axis: CR.refAxis(axis, T1, GEO) }); }

/**
 * 衛星の組 key の由来(源の半径の置き方 t・成分 part・k)。太陽由来は PARENT_ROWS の行・分母に母天体の重み/母天体由来は分母に太陽の重み(第351便c の pairParts と同じ作り)。
 * t 0 では pairParts と同じ数(零試験)。返す { sun, parent, wSun, wPar, sHat, nHat }(rad/s)
 */
export function satParts(T1, GEO, key, { tSrc = 0, part = 'S', k = 1, read = 'C2' } = {}, cache = null) {
  const ck = ['sp', key, tSrc, part, k, read].join('|'); if (cache && cache[ck]) return cache[ck];
  const [id, src] = key.split('|'), sunKey = SP.PARENT_ROWS[key];
  if (!sunKey) throw new RangeError('satParts: 衛星の組 ' + key);
  const [sid, ssrc] = sunKey.split('|');
  const wSun = K.spinRot(T1, GEO, sid, ssrc, { part: 'M', read: 'W', tSrc, nPhase: 1 }).wS, wPar = K.spinRot(T1, GEO, id, src, { part: 'M', read: 'W', tSrc, nPhase: 1 }).wS;
  const sun = K.spinRot(T1, GEO, sid, ssrc, { part, tSrc, read, extraW: wPar, k }).Om, par = K.spinRot(T1, GEO, id, src, { part, tSrc, read, extraW: wSun, k });
  const v = { key, tSrc, part, sun, parent: par.Om, wSun, wPar, sHat: unit(par.sHat), nHat: unit(par.nHat) };
  if (cache) cache[ck] = v; return v;
}

/* ───────── 表 1: 衛星の 1 つのセル ───────── */
/**
 * 衛星の組 key × 源の半径 t × 背景の向き bg × 基準軸 axis × 倍率 u(数)× 成分 part。
 * 返す: 母天体由来 ÷ 太陽由来・÷ 背景・cos(ŝ, 母天体由来)・合成の大きさ(″/年)・合成 ÷ 背景・3 列(第351便f の lockCols)・トルクの比(潮汐の天体だけ)。
 */
export function satCell(T1, GEO, key, { tSrc = 0, bg, axis, u, part = 'S', k = 1 }, cache = null) {
  if (!DECL.bgs.includes(bg)) throw new RangeError('satCell: 背景の向きは Np・Gm');
  if (!DECL.axes.includes(axis)) throw new RangeError('satCell: 基準軸は L・eq');
  if (!(fin(u) && u >= 0)) throw new RangeError('satCell: 倍率 u ≥ 0');
  const P = satParts(T1, GEO, key, { tSrc, part, k }, cache), b = bgOf(T1, GEO, bg, axis, u), loc = add(P.sun, P.parent), Om = add(b, loc);
  const [id, src] = key.split('|'), S = F.satInput(T1, GEO, id, src), cols = F.lockCols(S, Om);
  // (N+) では背景は基準軸に平行 —— 直交成分は背景の分を局所の分と分けて直接に数える(ŝ に対する Ω⊥ = 背景の Ω⊥ + 局所の Ω⊥)
  const perpLoc = nrm(SP.perpOf(S.sHat, loc)), perpBg = nrm(SP.perpOf(S.sHat, b));
  let torque = null;
  if (DECL.tideBodies.includes(id) && DECL.tideKey[id] === key) torque = F.torqueRatio(F.tideOf(id), S, Om);
  return { key, tSrc, bg, axis, u, part, k, Om, sunAsYr: nrm(P.sun) * ASYR, parAsYr: nrm(P.parent) * ASYR, bgAsYr: nrm(b) * ASYR, omAsYr: nrm(Om) * ASYR,
    parOverSun: nrm(P.sun) > 0 ? nrm(P.parent) / nrm(P.sun) : null, parOverBg: nrm(b) > 0 ? nrm(P.parent) / nrm(b) : null, omOverBg: nrm(b) > 0 ? nrm(Om) / nrm(b) : null,
    cosParS: nrm(P.parent) > 0 ? dot(S.sHat, unit(P.parent)) : null, cosSunS: nrm(P.sun) > 0 ? dot(S.sHat, unit(P.sun)) : null, cosBgS: nrm(b) > 0 ? dot(S.sHat, unit(b)) : null,
    perpLocAsYr: perpLoc * ASYR, perpBgAsYr: perpBg * ASYR,
    cols: Object.fromEntries(F.DECL.lockCols.map((c) => [c, { precAsYr: cols[c].precRate * ASYR, path1AsYr: cols[c].path1 * ASYR, raiseAsYr: cols[c].raise === null ? null : cols[c].raise * ASYR,
      parOverN: cols[c].parOverN, lonOverN: cols[c].lonOverN, epsDeg: cols[c].epsDeg }])),
    torque: torque && { perpAsYr: torque.perp * ASYR, rTide: torque.rTide, rTideK: torque.rTideK, baNeed: torque.baNeed } };
}

/** 合成の大きさ abs(u b₁ + L) を最小にする u(≥ 0 —— 射影が負なら 0)。第352便j の uForMin と同じ式(第352便j の lib は仮の値の lib を import するので呼ばない —— 同じ入力で同じ数になることを QA behavior.satring352s が見る) */
export function uForMin(b1, L) { const bb = dot(b1, b1); return bb > 0 ? Math.max(0, -dot(b1, L) / bb) : null; }

/* ───────── 表 2: 打ち消し(金星と同じ形 —— 局所の (S) と背景)───────── */
/**
 * 組 key(衛星 —— 局所 = 太陽由来 + 母天体由来/惑星 'Venus|Sun' —— 局所 = 太陽由来)× t × bg × axis。
 * uEq = 局所と背景の大きさが同じ倍率・uMin = 合成が最小の倍率(負なら 0)・それぞれの残り abs(合成) ÷ abs(背景)・÷ (uV)(t)。
 */
export function cancelRow(T1, GEO, key, { tSrc = 0, bg, axis, part = 'S' }, cache = null) {
  let loc, s;
  if (key.endsWith('|Sun')) { const [id] = key.split('|'), R = K.spinRot(T1, GEO, id, 'Sun', { part, tSrc }); loc = R.Om; s = unit(R.sHat); }
  else { const P = satParts(T1, GEO, key, { tSrc, part }, cache); loc = add(P.sun, P.parent); s = P.sHat; }
  const b1 = bgOf(T1, GEO, bg, axis, 1), uV = uVt(T1, GEO, tSrc, cache), uEq = nrm(loc) / nrm(b1), uMin = uForMin(b1, loc);
  // 残り: 合成 ÷ 背景(倍率 u の背景)—— uEq では局所と背景の大きさが同じ。uMin の残りは合成 ÷ 局所(背景の大きさが局所より小さいときに 1 を越えないように)
  const res = (u) => (u > 0 ? nrm(add(scl(b1, u), loc)) / (u * nrm(b1)) : null);
  const cosLB = dot(unit(loc), unit(b1)), resMin = nrm(add(scl(b1, uMin), loc)) / nrm(loc);
  return { key, tSrc, bg, axis, part, uV, uEq, uMin, eqOverUV: uEq / uV, minOverUV: uMin / uV, resEq: res(uEq), resMin, resAtUV: res(uV), cosLocBg: cosLB, cosLocS: dot(s, unit(loc)),
    scan: DECL.scanExp.map((e) => ({ e, res: res(uV * Math.pow(10, e)) })) };
}

/* ───────── 表 3: 互いにロックした連星(冥王星–カロン)───────── */
/** 第351便f の mutualRow の (S) と (MS)(源の回転の形 × 源の自転の置き方 × 相対の速さ)と、背景 (uV) ・太陽由来 (S) との比 */
export function mutualRows(T1, GEO, cache = null) {
  const out = [], uV = uVt(T1, GEO, 0, cache), bgM = nrm(PS.bgVec('Np', { u: uV }));
  for (const key of ['Pluto|Charon', 'Charon|Pluto']) {
    const [id, src] = key.split('|'), P = satParts(T1, GEO, key, { tSrc: 0, part: 'S' }, cache);
    for (const rot of DECL.mutRots) for (const spin of DECL.mutSpins) for (const speed of DECL.mutSpeeds) {
      if (spin === 'frame' && speed === 'pair') continue;
      const m = F.mutualRow(T1, GEO, id, src, { rot, speed, spin }), sM = nrm(m.S), msM = nrm(m.MS);
      out.push({ key, rot, spin, speed, SAsYr: sM * ASYR, MSAsYr: msM * ASYR, MAsYr: nrm(m.M) * ASYR, SoverMS: msM > 0 ? sM / msM : null, SoverBg: sM / bgM, SoverSun: nrm(P.sun) > 0 ? sM / nrm(P.sun) : null,
        parS: m.par.S * ASYR, perpS: m.perp.S * ASYR, resid: m.resid });
    }
  }
  return out;
}
/** 互いの (S) を源の半径 2 列で(在位の形・宣言の自転・相対の速さは源の質量だけ —— 第351便c の約束)と、背景 (uV)(t)・太陽由来 (S) との比 */
export function mutualRadiusRows(T1, GEO, cache = null) {
  const out = [];
  for (const key of ['Pluto|Charon', 'Charon|Pluto']) for (const t of DECL.tSrcs) {
    const P = satParts(T1, GEO, key, { tSrc: t, part: 'S' }, cache), bgM = nrm(PS.bgVec('Np', { u: uVt(T1, GEO, t, cache) }));
    out.push({ key, tSrc: t, parAsYr: nrm(P.parent) * ASYR, sunAsYr: nrm(P.sun) * ASYR, parOverSun: nrm(P.parent) / nrm(P.sun), parOverBg: nrm(P.parent) / bgM, cosParS: dot(P.sHat, unit(P.parent)),
      perpParAsYr: nrm(SP.perpOf(P.sHat, P.parent)) * ASYR });
  }
  return out;
}

/* ───────── 表 4: 輪 ───────── */
/**
 * 輪の粒子 N 点の平均の (S)(源の自転の分 —— 受け手の速度 0)・(M)(源の自転 0・円の公転の速さ √(G M_源 ÷ r))。spinRot と同じ作り(受け手の半径は規則の半径 —— 自分の重み A0 = 1.5 ÷ Y_k は受け手の質量に依らない)。
 * o: { Ms, Rs, spinVec(rad/s), L(輪の法線 —— 公転の向き), r, N, read, extraW, part, basis(省けば L から作る), m }
 */
export function ringRot({ Ms, Rs, spinVec, L, r, N = DECL.ringN, read = 'C2', extraW = 0, part = 'S', basis = null, m = 1e3 }) {
  if (!['S', 'M', 'MS'].includes(part)) throw new RangeError('ringRot: 成分は S・M・MS');
  if (!(fin(r) && r > 0 && fin(Ms) && Ms > 0 && fin(Rs) && Rs > 0)) throw new RangeError('ringRot: r・M・R > 0');
  const l = unit(L), [x, y] = basis || RJ.ringBasis(l), Rr = G3.YK * m, vc = Math.sqrt(G * Ms / r);
  const sv = part === 'M' ? [0, 0, 0] : spinVec, vs = part === 'S' ? 0 : 1;
  const radii = read === 'W' ? [[Rr, 1]] : GL.x.map((xi, i) => { const rho = 0.5 * Rr * (xi + 1); return [SC.equivR(Rr, rho), 0.5 * Rr * GL.w[i] * 5 * Math.pow(rho, 4) / Math.pow(Rr, 5)]; });
  let Om = [0, 0, 0];
  for (const [Ri, wt] of radii) {
    let mW = [0, 0, 0];
    for (let j = 0; j < N; j++) {
      const ph = 2 * Math.PI * (j + 0.5) / N, rh = add(scl(x, Math.cos(ph)), scl(y, Math.sin(ph))), vh = crs(l, rh);
      const f = G3.makeField3({ sources: [{ m: Ms, R: Rs, p: scl(rh, -r), v: [0, 0, 0], spin: sv }], recv: { m, R: Ri, p: [0, 0, 0], v: scl(vh, vc * vs) },
        W0: 0, extraW, kernel: { kind: 'ball', al: 1 }, rot: { form: 'M' }, self: true, mut: null });
      mW = add(mW, scl(G3.rot3('W', f, [0, 0, 0], { Rb: Ri }), 1 / N));
    }
    Om = read === 'W' ? mW : add(Om, scl(mW, wt));
  }
  return { Om, A0: m * DK.Kball(1, 0, Rr), wS: Ms * DK.Kball(1, r, Rs) };
}
/** 輪の法線 L̂ と Ω から: 合成の軸へ寄る率(経路 ① —— abs Ω⊥)・回る率(経路 ② —— abs Ω)・L̂ と合成の軸の角・源の赤道面 ref に対する起こす率(経路 ①・正 = 傾きが減る) */
export function ringRates(L, Om, { perp = null, ref = null } = {}) {
  const l = unit(L), om = nrm(Om), p = perp === null ? nrm(SP.perpOf(l, Om)) : perp;
  let raise = null;
  if (ref) { const c = dot(l, unit(ref)), sE = Math.sqrt(Math.max(0, 1 - c * c)); if (sE > 1e-9) raise = SP.raiseRate(l, unit(ref), SP.perpOf(l, Om)); }
  return { omAsYr: om * ASYR, perpAsYr: p * ASYR, angDeg: om > 0 ? Math.atan2(p, dot(l, Om)) / D2R : null, raiseAsYr: raise === null ? null : raise * ASYR, periodYr: om > 0 ? 1296000 / (om * ASYR) : null };
}
/** 土星の自転(軸 = geometry の土星の自転軸・率 = 第347便e の t1Table の omega) */
export function saturnSpin(T1, GEO) {
  const r2 = T1.find((r) => r.id === 'Saturn' && r.src === 'Sun' && r.mag === 'm2'), ax = unit(GEO['Saturn|Sun'].w);
  return { ax, w: Math.abs(r2.omega), vec: scl(ax, Math.abs(r2.omega)) };
}
/** 輪の法線(土星の赤道面から傾き iDeg —— 交点は土星の自転軸と黄道の極の外積の向き) */
export function tiltedNormal(ax, iDeg) {
  const t = crs([0, 0, 1], ax), e = nrm(t) > 1e-12 ? unit(t) : [1, 0, 0];
  return R3.rodrigues(ax, e, iDeg * D2R);
}
/**
 * 土星の環の 1 区分(key)× 源の半径 t: 土星由来 (S)・(M)(法線 = 土星の赤道 —— 傾き 0 と 1°)・太陽由来 (S)(土星の道)・背景((N+)/(G−) × L/eq × (uV)(t))の合成で、寄る率・回る率。
 */
export function saturnRing(T1, GEO, key, { tSrc = 0 } = {}, cache = null) {
  const sp = saturnSpin(T1, GEO), Ms = C.massOf('Saturn'), Rs = K.srcRadius('Saturn', tSrc), r = RB.centerKm(key) * 1e3;
  const sun = K.spinRot(T1, GEO, 'Saturn', 'Sun', { part: 'S', tSrc }), wSun = sun.wS, wSat = Ms * DK.Kball(1, r, Rs);
  const sunS = K.spinRot(T1, GEO, 'Saturn', 'Sun', { part: 'S', tSrc, extraW: wSat }).Om;
  const L0 = sp.ax, L1 = tiltedNormal(sp.ax, DECL.ringTiltDeg);
  const S0 = ringRot({ Ms, Rs, spinVec: sp.vec, L: L0, r, extraW: wSun, part: 'S' }).Om, M0 = ringRot({ Ms, Rs, spinVec: sp.vec, L: L0, r, extraW: wSun, part: 'M' }).Om;
  const S1 = ringRot({ Ms, Rs, spinVec: sp.vec, L: L1, r, extraW: wSun, part: 'S' }).Om, M1 = ringRot({ Ms, Rs, spinVec: sp.vec, L: L1, r, extraW: wSun, part: 'M' }).Om;
  const uV = uVt(T1, GEO, tSrc, cache), out = { key, tSrc, r, rOverRobs: r / C.radiusOf('Saturn'), Rs,
    satS: { asYr: nrm(S0) * ASYR, cosL: dot(unit(S0), L0), perpOverMag: nrm(SP.perpOf(L0, S0)) / nrm(S0) }, satM: { asYr: nrm(M0) * ASYR, cosL: dot(unit(M0), L0), perpOverMag: nrm(SP.perpOf(L0, M0)) / nrm(M0) },
    SoverM: nrm(S0) / nrm(M0), sunSAsYr: nrm(sunS) * ASYR, satSOverSunS: nrm(S0) / nrm(sunS),
    tilt1: { satS: ringRates(L1, S1, { ref: L0 }), satM: ringRates(L1, M1, { ref: L0 }), cosSL: dot(unit(S1), L1) }, comb: {} };
  // 環の物差し(第348便d の LIT —— 1e7 年で傾きが e 分の 1)と並べる: 起こす率 ÷ 傾き(1/年)× 物差しの年数(1 で同じ率)
  const epsR = DECL.ringTiltDeg * D2R, yard = (rAsYr) => (rAsYr === null ? null : rAsYr / 206264.80624709636 / epsR * DA.LIT.tYardYr);
  out.tilt1.satS.yard = yard(out.tilt1.satS.raiseAsYr); out.tilt1.satM.yard = yard(out.tilt1.satM.raiseAsYr);
  for (const bg of DECL.bgs) for (const axis of DECL.axes) {
    const b = bgOf(T1, GEO, bg, axis, uV), loc = add(S0, sunS), Om = add(b, loc), Om1 = add(b, add(S1, sunS)), r1 = ringRates(L1, Om1, { ref: L0 });
    out.comb[bg + axis] = { bgAsYr: nrm(b) * ASYR, satSOverBg: nrm(S0) / nrm(b), ...ringRates(L0, Om), tilt1RaiseAsYr: r1.raiseAsYr, tilt1Yard: yard(r1.raiseAsYr) };
  }
  return out;
}
/**
 * 太陽系の公転面の輪(源 = 太陽の自転 —— 半径 = 天体 at の道の a・法線 = 基準軸 L/eq/黄道の極)× t: 太陽由来 (S) の輪の平均・背景の合成で寄る率・回る率。
 * (N+) で法線 = 基準軸のとき、背景は法線に平行 —— 直交成分は輪の (S) の分だけ(直接に数える)。
 */
export function planeRing(T1, GEO, at, normal, { tSrc = 0 } = {}, cache = null) {
  const P = SP.pairInput(T1, GEO, at, 'Sun'), L = normal === 'ecl' ? [0, 0, 1] : unit(CR.refAxis(normal, T1, GEO)), Rs = K.srcRadius('Sun', tSrc);
  const S = ringRot({ Ms: P.Ms, Rs, spinVec: scl(P.sAx, P.ws), L, r: P.a, part: 'S' }).Om, uV = uVt(T1, GEO, tSrc, cache);
  const out = { at, normal, tSrc, a: P.a, SAsYr: nrm(S) * ASYR, cosSunAx: dot(unit(S), P.sAx), cosL: dot(unit(S), L), sunConeDeg: angDeg(L, P.sAx), comb: {} };
  for (const bg of DECL.bgs) for (const axis of DECL.axes) {
    const b = bgOf(T1, GEO, bg, axis, uV), Om = add(b, S), par = bg === 'Np' && normal === axis;
    out.comb[bg + axis] = { SOverBg: nrm(S) / nrm(b), ...ringRates(L, Om, par ? { perp: nrm(SP.perpOf(L, S)) } : {}) };
  }
  return out;
}

/* ───────── 零試験 ───────── */
export function pureScenes(T1 = E.t1Table(), GEO = E.geometry()) {
  const cache = {}, A = DECL.anchor;
  // ① t 0・成分 MS・S の satParts は第351便f の satTerms(= 第351便c の pairParts)と同じ数(衛星 5 組)
  let vsF = 0;
  for (const key of DECL.sats) {
    const [id, src] = key.split('|'), st = F.satTerms(T1, GEO, id, src);
    for (const part of ['S', 'MS']) { const P = satParts(T1, GEO, key, { tSrc: 0, part }, cache); vsF = Math.max(vsF, rel(P.sun, st.sun[part]), rel(P.parent, st.parent[part])); }
  }
  // ② 成分 MS を明示すると第351便f の数に戻る: イオの母天体 ÷ 太陽 4.32e3・月 1.56e-2
  const ioMS = satParts(T1, GEO, 'Io|Jupiter', { part: 'MS' }, cache), moMS = satParts(T1, GEO, 'Moon|EarthHi', { part: 'MS' }, cache);
  const r351f = { io: (nrm(ioMS.parent) / nrm(ioMS.sun)).toExponential(2), moon: (nrm(moMS.parent) / nrm(moMS.sun)).toExponential(2) };
  // ③ 第352便j の衛星の (S) の表の数(イオ —— (N+)・L・(uV)): 母天体 ÷ 太陽 333・÷ 背景 0.891・合成 ÷ 背景 0.120 を、第351便f の satTerms の (S) と第352便d の bgVec から直接に作った値と照合
  //   (第352便j の lib は仮の値の lib を import するので呼ばない —— satRow・cellOf と同じ数になることは QA behavior.satring352s が別に見る)
  const uV0 = uVt(T1, GEO, 0, cache), cIo = satCell(T1, GEO, 'Io|Jupiter', { bg: 'Np', axis: 'L', u: uV0 }, cache), tIo = F.satTerms(T1, GEO, 'Io', 'Jupiter');
  const bIo = PS.bgVec('Np', { u: uV0, axis: CR.refAxis('L', T1, GEO) }), omIo = add(add(bIo, tIo.sun.S), tIo.parent.S);
  const vsJ = { parSun: Math.abs(cIo.parOverSun / (nrm(tIo.parent.S) / nrm(tIo.sun.S)) - 1), parBg: Math.abs(cIo.parOverBg / (nrm(tIo.parent.S) / nrm(bIo)) - 1), om: Math.abs(cIo.omAsYr / (nrm(omIo) * ASYR) - 1), io: [cIo.parOverSun, cIo.parOverBg, cIo.omOverBg] };
  // ④ Ω = 背景(第352便d の bgVec)+ 太陽由来 (S) + 母天体由来 (S)(第351便f の satTerms)—— 衛星 5 組 × (N+)(G−) × L・eq
  let vsCell = 0;
  for (const key of DECL.sats) for (const bg of DECL.bgs) for (const axis of DECL.axes) {
    const [id, src] = key.split('|'), st = F.satTerms(T1, GEO, id, src), a = satCell(T1, GEO, key, { bg, axis, u: uV0 }, cache);
    vsCell = Math.max(vsCell, rel(a.Om, add(add(PS.bgVec(bg, { u: uV0, axis: CR.refAxis(axis, T1, GEO) }), st.sun.S), st.parent.S)));
  }
  // ⑤ (uV)(t 0)= 1.19282e-12 と第352便d の uVenus
  const uVd = PS.uVenus(T1, GEO, { part: 'S' }), uVchk = Math.abs(uV0 / A.uV - 1), uVvsD = Math.abs(uV0 / uVd - 1);
  // ⑥ 打ち消しの行: 金星の uEq は (uV)(比 1)・イオの uEq ÷ (uV) は母天体由来 ÷ 背景の近く・uMin で残りが ±0.1% より小さい
  const cV = cancelRow(T1, GEO, 'Venus|Sun', { bg: 'Np', axis: 'L' }, cache), cI = cancelRow(T1, GEO, 'Io|Jupiter', { bg: 'Np', axis: 'L' }, cache);
  const b1 = bgOf(T1, GEO, 'Np', 'L', 1), Pi = satParts(T1, GEO, 'Io|Jupiter', {}, cache), li = add(Pi.sun, Pi.parent), rr = (u) => nrm(add(scl(b1, u), li));
  const minOk = rr(cI.uMin) <= rr(cI.uMin * 1.001) && rr(cI.uMin) <= rr(cI.uMin * 0.999);
  // ⑦ ringRot: 地球の道の 72 位相(spinRot の位相の基底)で spinRot の (S)・(M) と同じ数
  const PE = SP.pairInput(T1, GEO, 'Earth', 'Sun'), x0 = crs(PE.sAx, PE.nHat), bx = unit(x0), by = crs(PE.nHat, bx);
  const rS = ringRot({ Ms: PE.Ms, Rs: G3.YK * PE.Ms, spinVec: scl(PE.sAx, PE.ws), L: PE.nHat, r: PE.a, N: SP.DECL.nPhase, part: 'S', basis: [bx, by], m: PE.m }).Om;
  const kS = K.spinRot(T1, GEO, 'Earth', 'Sun', { part: 'S' }).Om;
  // (M): ringRot は円の公転の速さ √(G M ÷ r)・spinRot は √β c —— a = G M ÷ (β c²) なので同じ速さ
  const rM = ringRot({ Ms: PE.Ms, Rs: G3.YK * PE.Ms, spinVec: scl(PE.sAx, PE.ws), L: PE.nHat, r: PE.a, N: SP.DECL.nPhase, part: 'M', basis: [bx, by], m: PE.m }).Om, kM = K.spinRot(T1, GEO, 'Earth', 'Sun', { part: 'M' }).Om;
  const vsRing = Math.max(rel(rS, kS), rel(rM, kM));
  // ⑧ 土星の環: 赤道面の輪では土星由来 (S)・(M) は法線に平行(直交の割合 < 1e-9)
  const sr = saturnRing(T1, GEO, 'ringB', { tSrc: 0 }, cache), par0 = Math.max(sr.satS.perpOverMag, sr.satM.perpOverMag);
  // ⑨ 源の半径: t 1 の母天体由来 (S) ÷ t 0 は、源の半径の比の 2 乗(形 M・A ≫ w_源 —— イオ)
  const Pi1 = satParts(T1, GEO, 'Io|Jupiter', { tSrc: 1 }, cache), rJ = K.srcRadius('Jupiter', 1) / K.srcRadius('Jupiter', 0), r2Io = Math.abs(nrm(Pi1.parent) / nrm(Pi.parent) / (rJ * rJ) - 1);
  // ⑩ 変異: 背景の向きを (G−) にするとイオの打ち消しが消える(合成 ÷ 背景 > 0.5)
  const cG = satCell(T1, GEO, 'Io|Jupiter', { bg: 'Gm', axis: 'L', u: uV0 }, cache), mutG = cG.omOverBg > 0.5;
  // ⑪ 拒否
  const rej = [() => satParts(T1, GEO, 'Earth|Sun', {}), () => satCell(T1, GEO, 'Io|Jupiter', { bg: 'Gp', axis: 'L', u: 1 }), () => satCell(T1, GEO, 'Io|Jupiter', { bg: 'Np', axis: 'ecl', u: 1 }),
    () => satCell(T1, GEO, 'Io|Jupiter', { bg: 'Np', axis: 'L', u: -1 }), () => ringRot({ Ms: 1, Rs: 1, spinVec: [0, 0, 1], L: [0, 0, 1], r: -1 }), () => satParts(T1, GEO, 'Io|Jupiter', { tSrc: 2 })]
    .map((fn) => { try { fn(); return false; } catch (e) { return e instanceof RangeError; } });
  return { vsF, r351f, vsJ, vsCell, uVchk, uVvsD, venusEq: cV.eqOverUV, ioEq: cI.eqOverUV, minOk, vsRing, par0, r2Io, mutG, rejects: rej };
}
export function pureGates(S) {
  const A = DECL.anchor;
  return {
    sameAsF: S.vsF < 1e-12,
    msBack351f: S.r351f.io === A.io351fMS && S.r351f.moon === A.moon351fMS,
    sameAsJ: S.vsJ.parSun < 1e-12 && S.vsJ.parBg < 1e-12 && S.vsJ.om < 1e-9 && Math.round(S.vsJ.io[0]) === A.io352jS && S.vsJ.io[1].toFixed(3) === A.ioParBg.toFixed(3) && S.vsJ.io[2].toFixed(3) === A.ioNpRes.toFixed(3),
    sameCell: S.vsCell < 1e-12,
    uV: S.uVchk < 5e-6 && S.uVvsD < 1e-12,
    cancel: Math.abs(S.venusEq - 1) < 1e-12 && S.ioEq > 0.5 && S.ioEq < 1.5 && S.minOk,
    ringRot: S.vsRing < 1e-12,
    ringParallel: S.par0 < 1e-9,
    radiusSq: S.r2Io < 1e-6,
    mutantGm: S.mutG,
    rejects: S.rejects.length === 6 && S.rejects.every(Boolean),
  };
}
