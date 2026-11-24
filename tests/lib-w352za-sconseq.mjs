// 第352便za(原仮定者の回答(2026-11-24 —— 第148報)「AN1015: Bで進める。銀河由来の軸引きずりも、(S)だけを数えると弱いと推測する」・統括の検証項目 R463):
//   **主の成分を (S)(源の自転の分)に替えたときの帰結の一覧 —— これまでの軸引きずりの題(内部熱と供給の帳簿・慣性回転・潮汐ロック・環・公転面・歳差・傾き・金星)の数を、
//   成分 (MS)(第351便の列)/(S) 規則の半径/(S) 観測の半径 × 背景の向き × 背景の大きさで数え直す口 —— 診断だけ**
//   (器 tests/exp-w352za-sconseq.mjs と QA behavior.sconseq352za・docs.sconseq352za が読む —— html を読まない・ファイルを読まない・状態を持たない)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない(AN712 —— エンジンへ足す操作ではない)。
//   既存の lib と第 1〜第 4 ラウンドの lib は呼ぶだけ(本文は変えない): 第352便k(spinRot・srcRadius —— (S) の源の半径)・第352便s(satParts・ringRot・saturnSpin・tiltedNormal —— 衛星と輪)・
//   第352便d(bgVec —— 背景のベクトル)・第352便c(refAxis —— 基準軸)・第352便e(sunInput・rotOf・sunLocal —— 太陽を受け手に)・第351便g(lockRows・LIT —— 潮汐ロックの熱の表)・
//   第350便d(supplyRate —— 供給の則 (P1)(P0))・第351便f(satInput・tideOf・torqueRatio —— 潮汐のトルク)・第351便c(pairParts・perpOf・raiseRate・bgOm)・
//   第348便h(makeField3・rot3)・第350便b(equivR)・第347便h(gaussLegendre)・第312便a(Kball)・第338便d(centerKm・DECL.t1.tYardYr)・第348便c(massOf)・第330便a(文献の値 —— 地球の一般歳差)・第347便e(t1Table・geometry)。
//   **仮の値の lib(第352便b)には届かない**(第352便j・o は import しない —— 太陽を受け手にした (S) の観測の半径の列は、〔第352便o〕の sunRotS と同じ式を本 lib に書き、規則の半径で〔第352便e〕の rotOf と照合する)。
//
// ■ 列(COLS —— 局所の項の成分): 'MS' = (MS)(第351便の主の列 —— 規則の半径)/'Srule' = (S)・規則の半径(在位)/'Sobs' = (S)・観測の半径。形はどれも球のモーメント(在位)・読み (C2)。
// ■ 背景(BGS): 'NpL' (N+)・基準軸 L(角運動量の重み)/'NpEq' (N+)・基準軸 eq(等しい重み)/'Gm' (G−)(銀河の回転と逆向き)。大きさは 'uV'(金星で太陽由来の
//   その列の成分と背景の大きさが同じ倍率 —— 列ごとに違う: (MS) 25.4・(S) 規則 1.19e-12・(S) 観測 1.9e-3)と 'u1'(銀河の公転の角速度 × 1)。全体: Ω = 背景 + k × 局所。
// ■ 供給の則(仮定の列 —— 〔第350便d〕の supplyRate): (P1) P = I ω abs(Ω⊥)² /(P0) 0(対照)。Ω⊥ は局所の分と背景の分を別に作って足す(打ち消しを大きい数の差で作らない)。
// ■ 題の物差し(TOPICS —— 各欄 = 単位の係数での大きさ ÷ 物差し): 歳差の率(地球の合成の率 ÷ 文献の一般歳差)・傾き(地球の abs(Ω⊥) × 年齢 ÷ いまの傾き)・
//   太陽の傾き(惑星由来 + 背景の abs(Ω⊥) × 年齢 ÷ 基準軸からの角)・金星の打ち消し(局所 ÷ 背景)・金星の逆回転(自転の率の変わり得る割合 × 年齢 ÷ 2)・
//   イオの内部熱((P1) ÷ 熱の物差し)・潮汐ロック(イオ —— 軸引きずりの直交成分のトルク ÷ 潮汐のトルク)・土星の環(1° 傾いた環の起こす率 ÷ 物差しの率)・
//   公転面の集まり(地球の道の輪の abs(Ω⊥) × 年齢 ÷ 23°)。**どの物差しも比べる列(合わせない)**。文献の値は「文献の値・未照合」。
// ■ 言わないこと: 内部熱の出どころ・(S) で説明できる/できない・軸引きずりの内か外かを決めない。この場・この成分・この背景・この係数では、の桁の表。
import * as K from './lib-w352k-spinform.mjs';
import * as SS from './lib-w352s-satring.mjs';
import * as PS from './lib-w352d-precsense.mjs';
import * as CR from './lib-w352c-refaxis.mjs';
import * as SR from './lib-w352e-sunrecv.mjs';
import * as G from './lib-w351g-r3energy.mjs';
import * as AH from './lib-w350d-axisheat.mjs';
import * as F from './lib-w351f-satlock.mjs';
import * as SP from './lib-w351c-srcparts.mjs';
import * as G3 from './lib-w348h-axisgeo3.mjs';
import * as SC from './lib-w350b-sphereconv.mjs';
import * as H from './lib-w347h-axisdiff.mjs';
import * as DK from './lib-w312a-decay.mjs';
import * as RB from './lib-w338d-ringbook.mjs';
import * as C from './lib-w348c-axisbalance.mjs';
import * as W330 from './lib-w330a-spinclass.mjs';
import * as E from './lib-w347e-spintorque.mjs';

export const LIB_VERSION = 'w352za-sconseq-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const { dot, crs, nrm, scl, add, sub, unit } = K.vec;
const D2R = Math.PI / 180, YR = 365.25 * 86400;
export const ASYR = PS.ASYR;

/* ───────── 宣言 ───────── */
export const COLS = Object.freeze([
  Object.freeze({ id: 'MS', part: 'MS', tSrc: 0, label: '(MS)(第351便の列・規則の半径)' }),
  Object.freeze({ id: 'Srule', part: 'S', tSrc: 0, label: '(S)・規則の半径' }),
  Object.freeze({ id: 'Sobs', part: 'S', tSrc: 1, label: '(S)・観測の半径' }),
]);
export const BGS = Object.freeze([
  Object.freeze({ id: 'NpL', name: 'Np', axis: 'L', label: '(N+)・基準軸 L' }),
  Object.freeze({ id: 'NpEq', name: 'Np', axis: 'eq', label: '(N+)・基準軸 eq' }),
  Object.freeze({ id: 'Gm', name: 'Gm', axis: 'L', label: '(G−)' }),
]);
export const TOPICS = Object.freeze([
  Object.freeze({ id: 'prec', label: '惑星の歳差の率(地球)', ruler: '文献の一般歳差(リポジトリの比べる数・文献の値・未照合)', src: '〔第352便j〕〔第352便u〕' }),
  Object.freeze({ id: 'tilt', label: '惑星の傾き(地球)', ruler: 'いまの傾き(年齢の間に動き得る角 ÷ いまの角)', src: '〔第352便w〕' }),
  Object.freeze({ id: 'sunTilt', label: '太陽の傾き', ruler: '基準軸からの角(L 5.968°・eq 5.230°)', src: '〔第352便e〕〔第352便l〕〔第352便x〕' }),
  Object.freeze({ id: 'vCancel', label: '金星の打ち消し', ruler: '局所 ÷ 背景 = 1(大きさが同じ)', src: '〔第352便h〕〔第352便v〕' }),
  Object.freeze({ id: 'vRev', label: '金星の逆回転', ruler: '自転の率の変わり 2 倍(順の同じ速さから逆へ)', src: '〔第352便h〕' }),
  Object.freeze({ id: 'ioHeat', label: 'イオの内部熱', ruler: '熱の物差し(文献の値・未照合)', src: '〔第351便g〕' }),
  Object.freeze({ id: 'lock', label: '潮汐ロック(イオ)', ruler: '潮汐のトルク(物差し N_tide —— 比 1 で同じ)', src: '〔第351便f〕〔第352便s〕' }),
  Object.freeze({ id: 'ring', label: '土星の環(B 環・1° 傾き)', ruler: '物差しの率(1e7 年で e 分の 1)', src: '〔第351便j〕〔第352便s〕' }),
  Object.freeze({ id: 'plane', label: '公転面の集まり(地球の道の輪)', ruler: '30° → 7° の 23°', src: '〔第352便p〕〔第352便w〕' }),
]);
export const DECL = Object.freeze({
  cols: Object.freeze(COLS.map((c) => c.id)), bgs: Object.freeze(BGS.map((b) => b.id)), mags: Object.freeze(['uV', 'u1']), topics: Object.freeze(TOPICS.map((t) => t.id)),
  /** 表 1(内部熱と供給)の受け手・表 2(慣性回転)の受け手 */
  heatBodies: Object.freeze(['Io|Jupiter', 'Venus|Sun', 'Jupiter|Sun', 'Earth|Sun']), spinBodies: Object.freeze(['Venus|Sun', 'Mercury|Sun', 'Earth|Sun']),
  ageYr: 4.5e9, omegaG: K.DECL.omegaG, planeSpreadDeg: 23, ringKey: 'ringB', ringTiltDeg: 1, tYardYr: RB.DECL.t1.tYardYr,
  sunConeDeg: Object.freeze({ L: 5.968, eq: 5.23 }), band: Object.freeze({ lo: 1e-3, hi: 1e3 }),
  /** 第351便・本便の数(比べる列 —— 零試験の照合) */
  anchor: Object.freeze({ uVrule: 1.19282e-12, uVms: 25.4221, ioHeat351g: '2.79 W', kObs: '5.31e2', kRule: '8.38e11' }),
  judge: '丸めの桁の床: 逐語の表は有効数字 3 桁・打ち消しで 0 になる量は尺度の 1e-12 倍以下を 0 と書く',
});
/** 文献の値(固定の比べる列 —— 合わせない) */
export const LIT = Object.freeze({ note: '文献の値・未照合(この環境から一次資料に当たっていない)', heat: G.LIT.heat, precEarth: W330.DECL.lit.precessionArcsecPerYear.earth });

export const colOf = (id) => { const c = COLS.find((x) => x.id === id); if (!c) throw new RangeError('colOf: 列の名 ' + id); return c; };
export const bgOfId = (id) => { const b = BGS.find((x) => x.id === id); if (!b) throw new RangeError('bgOfId: 背景の名 ' + id); return b; };
const ageS = () => DECL.ageYr * YR;

/* ───────── 背景 ───────── */
/** 背景のベクトル(rad/s): 背景 bgId・倍率 u(〔第352便d〕の bgVec・基準軸は〔第352便c〕の refAxis) */
export function bgVecOf(T1, GEO, bgId, u, cache = null) {
  const b = bgOfId(bgId), ck = 'ax|' + b.axis;
  let ax = cache && cache[ck]; if (!ax) { ax = CR.refAxis(b.axis, T1, GEO); if (cache) cache[ck] = ax; }
  return PS.bgVec(b.name, { u, axis: ax });
}
const bg1 = () => nrm(PS.bgVec('Gm', { u: 1 }));

/* ───────── 太陽を受け手に(〔第352便o〕の sunRotS と同じ式 —— 源〔惑星〕の半径の置き方 tSrc)───────── */
export function sunRotT(P, { part = 'S', tSrc = 0, k = 1, nPhase = SR.DECL.nPhase } = {}) {
  const sc = { M: [1, 0], S: [0, 1], MS: [1, 1] }[part];
  if (!sc) throw new RangeError('sunRotT: 成分は M・S・MS');
  const Rr = G3.YK * P.m, Rs = K.srcRadius(P.src, tSrc), GL = H.gaussLegendre(SR.DECL.ballN);
  const x0 = crs(P.sAx, P.nHat), x = nrm(x0) > 1e-12 ? unit(x0) : unit(crs(P.nHat, Math.abs(P.nHat[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0])), y = crs(P.nHat, x);
  const radii = GL.x.map((xi, i) => { const rho = 0.5 * Rr * (xi + 1); return [SC.equivR(Rr, rho), 0.5 * Rr * GL.w[i] * 5 * Math.pow(rho, 4) / Math.pow(Rr, 5)]; });
  const spin = scl(P.sAx, P.ws * sc[1]);
  let Om = [0, 0, 0];
  for (const [Ri, wt] of radii) {
    let mW = [0, 0, 0];
    for (let j = 0; j < nPhase; j++) {
      const ph = 2 * Math.PI * (j + 0.5) / nPhase, rh = add(scl(x, Math.cos(ph)), scl(y, Math.sin(ph))), vh = crs(P.nHat, rh);
      const f = G3.makeField3({ sources: [{ m: P.Ms, R: Rs, p: scl(rh, -P.a), v: [0, 0, 0], spin }], recv: { m: P.m, R: Ri, p: [0, 0, 0], v: scl(vh, P.vOrb * sc[0]) },
        W0: 0, extraW: 0, kernel: { kind: 'ball', al: 1 }, rot: { form: 'M' }, self: true, mut: null });
      mW = add(mW, scl(G3.rot3('W', f, [0, 0, 0], { Rb: Ri }), 1 / nPhase));
    }
    Om = add(Om, scl(mW, wt));
  }
  return { Om: k === 1 ? Om : scl(Om, k), Rs };
}

/* ───────── 約束の口: 局所の項(列ごと)───────── */
/**
 * 受け手 key の局所の項(列 colId・k): 惑星 'X|Sun' は〔第352便k〕の spinRot(源 = 太陽)/衛星 'Io|Jupiter' ほかは〔第352便s〕の satParts(太陽由来 + 母天体由来)/
 * 'Sun|-' は 8 惑星由来の和(sunRotT)。返す { key, col, loc:[3], sHat, nHat|null, I|null, w|null }。
 */
export function localOf(T1, GEO, key, colId, { k = 1 } = {}, cache = null) {
  const c = colOf(colId), ck = ['za', key, colId].join('|');
  let v = cache && cache[ck];
  if (!v) {
    if (key === 'Sun|-') {
      let sum = [0, 0, 0], sHat = null;
      for (const id of SR.PLANETS) { const P = SR.sunInput(T1, GEO, id); sum = add(sum, sunRotT(P, { part: c.part, tSrc: c.tSrc }).Om); sHat = P.sHat; }
      v = { key, col: colId, loc: sum, sHat: unit(sHat), nHat: null, I: null, w: null };
    } else {
      const [id, src] = key.split('|'), r2 = T1.find((r) => r.id === id && r.src === src && r.mag === 'm2');
      if (src === 'Sun') { const R = K.spinRot(T1, GEO, id, 'Sun', { part: c.part, tSrc: c.tSrc }); v = { key, col: colId, loc: R.Om, sHat: unit(R.sHat), nHat: unit(R.nHat), I: r2 ? r2.I : null, w: r2 ? Math.abs(r2.omega) : null }; }
      else { const P = SS.satParts(T1, GEO, key, { tSrc: c.tSrc, part: c.part }); v = { key, col: colId, loc: add(P.sun, P.parent), sHat: P.sHat, nHat: P.nHat, I: r2 ? r2.I : null, w: r2 ? Math.abs(r2.omega) : null }; }
    }
    if (cache) cache[ck] = v;
  }
  return k === 1 ? v : { ...v, loc: scl(v.loc, k) };
}
/** 金星で太陽由来のその列の成分と背景の大きさが同じになる倍率 ÷ k(〔第352便d〕の uVenus・〔第352便s〕の uVt と同じ分母) */
export function uVofCol(T1, GEO, colId, cache = null) {
  const ck = 'uV|' + colId; if (cache && cache[ck] !== undefined) return cache[ck];
  const v = nrm(localOf(T1, GEO, 'Venus|Sun', colId, {}, cache).loc) / bg1();
  if (cache) cache[ck] = v; return v;
}
/** 背景の大きさの数(mag 'uV' はその列の金星の条件・'u1' は 1) */
export const uOf = (T1, GEO, colId, mag, cache = null) => (mag === 'u1' ? 1 : mag === 'uV' ? uVofCol(T1, GEO, colId, cache) : (() => { throw new RangeError('uOf: 大きさは uV・u1'); })());

/* ───────── 合成と供給 ───────── */
/** 受け手 L(localOf の戻り)と背景 b: 合成 Ω・abs(Ω⊥)(局所の分と背景の分を別に作って足す)・Ω∥ */
export function combine(L, b) {
  const Om = add(L.loc, b), perpV = add(SP.perpOf(L.sHat, L.loc), SP.perpOf(L.sHat, b));
  return { Om, om: nrm(Om), perp: nrm(perpV), par: dot(L.sHat, L.loc) + dot(L.sHat, b) };
}
/** 供給 (P1)(W)= 〔第350便d〕の supplyRate(I・ω・abs(Ω⊥))と (P0) 0 */
export function heatOf(L, perp) { return { P1: AH.supplyRate({ rule: 'P1', I: L.I, wT: L.w, omPerp: perp }), P0: AH.supplyRate({ rule: 'P0', I: L.I, wT: L.w, omPerp: perp }) }; }

/* ───────── 表 1: 内部熱と供給 ───────── */
export function heatRows(T1 = E.t1Table(), GEO = E.geometry(), cache = {}) {
  const out = [];
  for (const key of DECL.heatBodies) for (const colId of DECL.cols) {
    const L = localOf(T1, GEO, key, colId, {}, cache), lit = LIT.heat[key.split('|')[0]] ?? null;
    const row = (bgId, mag) => {
      const u = bgId === null ? 0 : uOf(T1, GEO, colId, mag, cache), b = bgId === null ? [0, 0, 0] : bgVecOf(T1, GEO, bgId, u, cache), C = combine(L, b), Q = heatOf(L, C.perp);
      return { key, col: colId, bg: bgId, mag: bgId === null ? null : mag, u, omAsYr: C.om * ASYR, perpAsYr: C.perp * ASYR, heatW: Q.P1, p0W: Q.P0, heatRuler: lit, overLit: lit ? Q.P1 / lit : null };
    };
    out.push(row(null, null));
    for (const bgId of DECL.bgs) for (const mag of DECL.mags) out.push(row(bgId, mag));
  }
  return out;
}

/* ───────── 表 2: 慣性回転(自転の率の変化)───────── */
export function spinRows(T1 = E.t1Table(), GEO = E.geometry(), cache = {}) {
  const out = [];
  for (const key of DECL.spinBodies) for (const colId of DECL.cols) {
    const L = localOf(T1, GEO, key, colId, {}, cache);
    const row = (bgId, mag) => {
      const u = bgId === null ? 0 : uOf(T1, GEO, colId, mag, cache), b = bgId === null ? [0, 0, 0] : bgVecOf(T1, GEO, bgId, u, cache), C = combine(L, b), Q = heatOf(L, C.perp);
      const rate = Q.P1 / (L.I * L.w * L.w), age = rate * ageS();
      return { key, col: colId, bg: bgId, mag: bgId === null ? null : mag, u, parOverW: C.par / L.w, fracAge: age, revOverAge: age > 0 ? 2 / age : null };
    };
    out.push(row(null, null));
    for (const bgId of DECL.bgs) for (const mag of DECL.mags) out.push(row(bgId, mag));
  }
  return out;
}

/* ───────── 表 3・表 4: 題ごとの欄 ───────── */
const ringBase = (T1, GEO, colId, cache) => {
  const ck = 'ring|' + colId; if (cache && cache[ck]) return cache[ck];
  const c = colOf(colId), sp = SS.saturnSpin(T1, GEO), Ms = C.massOf('Saturn'), Rs = K.srcRadius('Saturn', c.tSrc), r = RB.centerKm(DECL.ringKey) * 1e3;
  const sunW = K.spinRot(T1, GEO, 'Saturn', 'Sun', { part: 'M', read: 'W', tSrc: c.tSrc, nPhase: 1 }).wS, wSat = Ms * DK.Kball(1, r, Rs);
  const L0 = sp.ax, L1 = SS.tiltedNormal(sp.ax, DECL.ringTiltDeg);
  const own = SS.ringRot({ Ms, Rs, spinVec: sp.vec, L: L1, r, extraW: sunW, part: c.part }).Om, sunP = K.spinRot(T1, GEO, 'Saturn', 'Sun', { part: c.part, tSrc: c.tSrc, extraW: wSat }).Om;
  const v = { L0, L1, loc: add(own, sunP) }; if (cache) cache[ck] = v; return v;
};
const planeBase = (T1, GEO, colId, axis, cache) => {
  const ck = 'plane|' + colId + '|' + axis; if (cache && cache[ck]) return cache[ck];
  const c = colOf(colId), P = SP.pairInput(T1, GEO, 'Earth', 'Sun'), Lh = unit(CR.refAxis(axis, T1, GEO)), Rs = K.srcRadius('Sun', c.tSrc);
  const v = { L: Lh, loc: SS.ringRot({ Ms: P.Ms, Rs, spinVec: scl(P.sAx, P.ws), L: Lh, r: P.a, part: c.part }).Om }; if (cache) cache[ck] = v; return v;
};
/** 題 topic・列 colId・背景 bgId・倍率 u・局所の係数 k の 1 欄: { v(大きさ ÷ 物差し), raw, ruler } */
export function topicCell(T1, GEO, topic, colId, bgId, u, { k = 1 } = {}, cache = {}) {
  const b = bgVecOf(T1, GEO, bgId, u, cache), B = bgOfId(bgId);
  if (topic === 'prec') { const L = localOf(T1, GEO, 'Earth|Sun', colId, { k }, cache), C = combine(L, b), raw = C.om * ASYR; return { raw, ruler: LIT.precEarth, v: raw / LIT.precEarth }; }
  if (topic === 'tilt') { const L = localOf(T1, GEO, 'Earth|Sun', colId, { k }, cache), C = combine(L, b), eps = Math.acos(Math.max(-1, Math.min(1, dot(L.sHat, L.nHat)))), raw = C.perp * ageS(); return { raw, ruler: eps, v: raw / eps }; }
  if (topic === 'sunTilt') { const L = localOf(T1, GEO, 'Sun|-', colId, { k }, cache), C = combine(L, b), eps = DECL.sunConeDeg[B.axis] * D2R, raw = C.perp * ageS(); return { raw, ruler: eps, v: raw / eps }; }
  if (topic === 'vCancel') { const L = localOf(T1, GEO, 'Venus|Sun', colId, { k }, cache), raw = nrm(L.loc) / nrm(b); return { raw, ruler: 1, v: raw }; }
  if (topic === 'vRev') { const L = localOf(T1, GEO, 'Venus|Sun', colId, { k }, cache), C = combine(L, b), Q = heatOf(L, C.perp), raw = Q.P1 / (L.I * L.w * L.w) * ageS(); return { raw, ruler: 2, v: raw / 2 }; }
  if (topic === 'ioHeat') { const L = localOf(T1, GEO, 'Io|Jupiter', colId, { k }, cache), C = combine(L, b), raw = heatOf(L, C.perp).P1, lit = LIT.heat.Io; return { raw, ruler: lit, v: raw / lit }; }
  if (topic === 'lock') {
    const L = localOf(T1, GEO, 'Io|Jupiter', colId, { k }, cache), S = F.satInput(T1, GEO, 'Io', 'Jupiter'), Tq = F.tideOf('Io'), C = combine(L, b);
    const Nax = Tq.I * S.wSpin * C.perp; return { raw: Nax, ruler: Tq.Ntide, v: Nax / Tq.Ntide };
  }
  if (topic === 'ring') {
    const R = ringBase(T1, GEO, colId, cache), perpV = add(SP.perpOf(R.L1, scl(R.loc, k)), SP.perpOf(R.L1, b));
    const raise = Math.abs(SP.raiseRate(R.L1, R.L0, perpV)), raw = raise / (DECL.ringTiltDeg * D2R), ruler = 1 / (DECL.tYardYr * YR); return { raw, ruler, v: raw / ruler };
  }
  if (topic === 'plane') { const R = planeBase(T1, GEO, colId, B.axis, cache), perpV = add(SP.perpOf(R.L, scl(R.loc, k)), SP.perpOf(R.L, b)), raw = nrm(perpV) * ageS(), ruler = DECL.planeSpreadDeg * D2R; return { raw, ruler, v: raw / ruler }; }
  throw new RangeError('topicCell: 題は ' + DECL.topics.join('・'));
}
export const inBand = (v) => fin(v) && v >= DECL.band.lo && v <= DECL.band.hi;
/** 表 3: 題 × 列 × 背景 × 大きさ(k 1) */
export function summaryRows(T1 = E.t1Table(), GEO = E.geometry(), cache = {}) {
  const out = [];
  for (const topic of DECL.topics) for (const colId of DECL.cols) for (const bgId of DECL.bgs) for (const mag of DECL.mags) {
    const u = uOf(T1, GEO, colId, mag, cache), c = topicCell(T1, GEO, topic, colId, bgId, u, {}, cache);
    out.push({ topic, col: colId, bg: bgId, mag, u, ...c, band: inBand(c.v) });
  }
  return out;
}
/** 表 4: 背景 倍率 1・k = 1 ÷ (その列の金星の条件の倍率)(局所の項だけに掛ける) */
export function kRows(T1 = E.t1Table(), GEO = E.geometry(), cache = {}) {
  const out = [];
  for (const colId of DECL.cols) {
    const kV = 1 / uVofCol(T1, GEO, colId, cache);
    for (const topic of DECL.topics) for (const bgId of DECL.bgs) {
      const c = topicCell(T1, GEO, topic, colId, bgId, 1, { k: kV }, cache), c1 = topicCell(T1, GEO, topic, colId, bgId, 1, {}, cache);
      out.push({ topic, col: colId, bg: bgId, k: kV, ...c, k1v: c1.v, over: c.v > 1, band: inBand(c.v) });
    }
  }
  return out;
}

/* ───────── 零試験・変異 ───────── */
const rel = (a, b) => (b === 0 ? Math.abs(a) : Math.abs(a / b - 1));
const relV = (a, b) => nrm(sub(a, b)) / Math.max(nrm(b), 1e-300);
export function pureScenes(T1 = E.t1Table(), GEO = E.geometry()) {
  const cache = {}, S = {};
  // (MS) を明示すると第351便の数に戻る: 地球の太陽由来・イオの太陽由来 + 母天体由来・〔第351便g〕の潮汐ロックの熱の表(局所・局所 + 背景)
  const ppE = SP.pairParts(T1, GEO, 'Earth', 'Sun', { read: 'C2', den: 'out' }), ppI = SP.pairParts(T1, GEO, 'Io', 'Jupiter', { read: 'C2', den: 'out' });
  S.earthMS = relV(localOf(T1, GEO, 'Earth|Sun', 'MS', {}, cache).loc, ppE.sun.MS);
  S.earthS = relV(localOf(T1, GEO, 'Earth|Sun', 'Srule', {}, cache).loc, ppE.sun.S);
  S.ioMS = relV(localOf(T1, GEO, 'Io|Jupiter', 'MS', {}, cache).loc, add(ppI.sun.MS, ppI.parent.MS));
  const LR = G.lockRows(T1, GEO), Lio = localOf(T1, GEO, 'Io|Jupiter', 'MS', {}, cache);
  const rLoc = LR.find((r) => r.id === 'Io' && r.origin === 'local' && r.part === 'MS'), rBg = LR.find((r) => r.id === 'Io' && r.origin === 'localBg');
  S.ioHeatLoc = rel(heatOf(Lio, combine(Lio, [0, 0, 0]).perp).P1, rLoc.supplyW);
  S.ioHeatBg = rel(heatOf(Lio, combine(Lio, SP.bgOm('Io')).perp).P1, rBg.supplyW); S.ioHeatBgW = rBg.supplyW;
  const rLocS = LR.find((r) => r.id === 'Io' && r.origin === 'local' && r.part === 'S'), LioS = localOf(T1, GEO, 'Io|Jupiter', 'Srule', {}, cache);
  S.ioHeatS = rel(heatOf(LioS, combine(LioS, [0, 0, 0]).perp).P1, rLocS.supplyW);
  // 太陽を受け手に: sunRotT(t 0)=〔第352便e〕の rotOf・和 =〔第352便e〕の sunLocal
  const PE = SR.sunInput(T1, GEO, 'Earth');
  S.sunRotS = relV(sunRotT(PE, { part: 'S', tSrc: 0 }).Om, SR.rotOf(PE, { part: 'S' }).Om);
  S.sunSumMS = relV(localOf(T1, GEO, 'Sun|-', 'MS', {}, cache).loc, SR.sunLocal(T1, GEO).sum.MS);
  // 金星の条件の倍率(第352便の数)
  S.uVrule = uVofCol(T1, GEO, 'Srule', cache); S.uVms = uVofCol(T1, GEO, 'MS', cache); S.uVobs = uVofCol(T1, GEO, 'Sobs', cache);
  // 直交成分を分けて作る = 合成から作る(打ち消しの無い組)・(P0) 0・(P1) は k² に比例
  const LE = localOf(T1, GEO, 'Earth|Sun', 'MS', {}, cache), bG = bgVecOf(T1, GEO, 'Gm', 1, cache);
  S.perpLin = rel(combine(LE, bG).perp, nrm(SP.perpOf(LE.sHat, add(LE.loc, bG))));
  S.p0 = heatOf(Lio, 1).P0;
  S.k2 = rel(heatOf(Lio, combine(localOf(T1, GEO, 'Io|Jupiter', 'MS', { k: 2 }, cache), [0, 0, 0]).perp).P1, 4 * rLoc.supplyW);
  // 拒否
  const thr = (f) => { try { f(); return false; } catch (e) { return e instanceof RangeError; } };
  S.reject = [thr(() => colOf('X')), thr(() => bgOfId('X')), thr(() => uOf(T1, GEO, 'MS', 'u2')), thr(() => topicCell(T1, GEO, 'none', 'MS', 'Gm', 1))];
  return S;
}
export function pureGates(S) {
  const t = 1e-9;
  return {
    earthMS: S.earthMS < t, earthS: S.earthS < t, ioMS: S.ioMS < t,
    ioHeatLoc: S.ioHeatLoc < t, ioHeatBg: S.ioHeatBg < t && S.ioHeatBgW > 2.7 && S.ioHeatBgW < 2.9, ioHeatS: S.ioHeatS < t,
    sunRotS: S.sunRotS < t, sunSumMS: S.sunSumMS < t,
    uV: Math.abs(S.uVrule / DECL.anchor.uVrule - 1) < 5e-6 && Math.abs(S.uVms / DECL.anchor.uVms - 1) < 5e-6 && Math.abs(1 / S.uVobs / 531 - 1) < 5e-3,
    perpLin: S.perpLin < t, p0: S.p0 === 0, k2: S.k2 < t, reject: S.reject.every((x) => x === true),
  };
}
