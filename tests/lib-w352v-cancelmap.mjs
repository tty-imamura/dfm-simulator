// 第352便v(原仮定者の回答(2026-11-24 —— 第148報)AN1019・AN1015・統括の検証項目 R459):
//   **打ち消しの点の一覧 —— 受け手と源の全部の組(8 惑星 ← 太陽・PAIRS16 の衛星 ← 母天体・冥王星 ⇄ カロン・太陽 ← 惑星の和)ごとに、
//   「局所の (S) と背景が同じ大きさになる背景の倍率」÷(金星の条件の値 (uV))= x と、そのときの残り(合成 ÷ 背景)・打ち消すか足し合うか
//   (背景の向き (N+)/(G−) × 基準軸 L/eq × 源の半径 規則/観測)・x の閉じた形・背景 1 つ((uV))で読む合成・打ち消しの近くの判定の量と潮汐のトルクの比 —— 診断だけ**
//   (器 tests/exp-w352v-cancelmap.mjs と QA behavior.cancelmap352v・docs.cancelmap352v が読む —— html を読まない・ファイルを読まない・状態を持たない)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない。既存の lib と第 1〜第 3 ラウンドの lib は呼ぶだけ(本文は変えない):
//   第352便k(spinRot・srcRadius)・第352便d(bgVec)・第352便c(refAxis)・第352便e(sunInput・rotOf)・第352便i(judgeConst)・第351便f(satInput・tideOf・torqueRatio)・
//   第351便c(pairInput・perpOf・PARENT_ROWS・PAIRS16)・第351便d(vec)・第347便e(t1Table・geometry)。
//   **第352便s の satParts・cancelRow・uVt と第352便j の uForMin は、ここに同じ式で書き直す**(第352便s・j の lib は仮の値の lib に import の閉包で届く ——
//   本 lib は仮の値を使わないので、閉包に入れない。同じ入力で同じ数になることは QA behavior.cancelmap352v が第352便s の lib を呼んで照合する)。
//
// ■ 語: x = uEq ÷ (uV)(t)。uEq = abs(局所の (S)) ÷ abs(倍率 1 の背景)—— 背景の向きと基準軸に依らない(大きさだけ)。(uV)(t) = 源の半径の置き方 t で金星の太陽由来 (S) と
//   背景の大きさが同じ倍率。残り = abs(合成) ÷ abs(背景)(倍率 uEq)。打ち消す = cos(局所, 背景) < 0・足し合う = cos > 0。
//   源の半径の置き方 t は全部の源に同じ t(t 0 = 規則の半径 Y_k M_源 —— 在位/t 1 = 観測の半径)。受け手の半径は規則の半径(自分の重み A0 = 1.5 ÷ Y_k は受け手の質量に依らない)。
// ■ 打ち消しで小さくなる量は、大きい数の差で作らない: 直交成分は局所と背景の直交成分を分けて足す(第352便s と同じ)。
// ■ 言わないこと: 金星とイオが釣り合いの状態にある・同じ背景で説明がつく、とは書かない(x の一覧と式と残りの数だけ)。x が 1 に近い組が偶然かどうかは決めない。
import * as K from './lib-w352k-spinform.mjs';
import * as PS from './lib-w352d-precsense.mjs';
import * as CR from './lib-w352c-refaxis.mjs';
import * as SE from './lib-w352e-sunrecv.mjs';
import * as ST from './lib-w352i-stableprec.mjs';
import * as F from './lib-w351f-satlock.mjs';
import * as SP from './lib-w351c-srcparts.mjs';
import * as R3 from './lib-w351d-r3step.mjs';
import * as E from './lib-w347e-spintorque.mjs';

export const LIB_VERSION = 'w352v-cancelmap-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const D2R = Math.PI / 180;
const { dot, crs, nrm, scl, add, unit } = R3.vec;
const rel = (a, b) => nrm(R3.vec.sub(a, b)) / Math.max(nrm(b), 1e-300);
const angDeg = (a, b) => Math.atan2(nrm(crs(a, b)), dot(a, b)) / D2R;
export const ASYR = PS.ASYR;
const srcId = (s) => (s === 'EarthHi' || s === 'EarthLo' ? 'Earth' : s);

/* ───────── 宣言 ───────── */
const PLANETS = SE.PLANETS;
export const DECL = Object.freeze({
  /** 受け手と源の組: 太陽を源にする組(8 惑星と、PAIRS16 の小さい天体の太陽の行)・衛星の組(局所 = 太陽由来 + 母天体由来)・太陽 ← 惑星の和 */
  sunPairs: Object.freeze([...PLANETS.map((p) => p + '|Sun'), 'Moon|Sun', 'Io|Sun', 'Pluto|Sun']),
  satPairs: Object.freeze(['Moon|EarthHi', 'Moon|EarthLo', 'Io|Jupiter', 'Pluto|Charon', 'Charon|Pluto']),
  sunRecv: 'Sun|Planets',
  tSrcs: Object.freeze([0, 1]), tNames: Object.freeze({ 0: '規則の半径(在位)', 1: '観測の半径' }),
  bgs: Object.freeze(['Np', 'Gm']), bgLabels: Object.freeze({ Np: '(N+)', Gm: '(G−)' }),
  axes: Object.freeze(['L', 'eq']),
  /** x が 1 の近くと読む帯(ブリーフの 0.1〜10) */
  nearBand: Object.freeze([0.1, 10]),
  /** 潮汐のトルクを数える天体(第351便f と同じ) */
  tideBodies: F.DECL.tideBodies, tideKey: F.DECL.tideKey,
  /** 判定の量の列(第352便i の fShow と歳差の向き) */
  fShow: ST.DECL.fShow, senses: ST.DECL.senses,
  /** 比べる数(点検 —— 第352便s の正本・第352便h の報告の数): (uV)(t 0)・イオの x(規則 0.894・観測 1.03e4)・金星の (N+) の残り L 0.013・eq 0.010・イオ (N+) L の残り(uV)0.120 */
  anchor: Object.freeze({ uV: 1.19282e-12, uVobs: '1.88e-3', ioRule: '0.894', ioObs: '1.03e+4', venusResL: '0.013', venusResEq: '0.010', ioResUV: '0.120', moonRule: '0.377', moonObs: '0.499' }),
  /** 土星の環の物差しの比(第352便s 表 9 の数 —— 引くだけ・この枝では数え直さない): 規則の半径の桁・観測の半径の範囲 */
  ring352s: Object.freeze({ rule: '1e-13', obsLo: 14, obsHi: 109 }),
  judge: '丸めの桁の床: 打ち消しで 0 になる量は尺度の 1e-12 倍以下を 0 と書く・逐語の表は有効数字 3 桁',
});

/* ───────── 材料(第352便s と同じ式 —— 書き直し)───────── */
/** 背景の大きさ (uV)(t)(金星の太陽由来 (S) と大きさが同じ倍率 ÷ k)—— 第352便s の uVt と同じ式 */
export function uVt(T1, GEO, tSrc = 0, cache = null) {
  const ck = 'uV|' + tSrc; if (cache && cache[ck] !== undefined) return cache[ck];
  const v = nrm(K.spinRot(T1, GEO, 'Venus', 'Sun', { part: 'S', tSrc }).Om) / nrm(PS.bgVec('Gm', { u: 1 }));
  if (cache) cache[ck] = v; return v;
}
/** 背景のベクトル(向き bg・基準軸 axis・倍率 u) */
export function bgOf(T1, GEO, bg, axis, u) { return PS.bgVec(bg, { u, axis: CR.refAxis(axis, T1, GEO) }); }
/** 合成が最小になる倍率(第352便j の uForMin と同じ式) */
export function uForMin(b1, L) { const bb = dot(b1, b1); return bb > 0 ? Math.max(0, -dot(b1, L) / bb) : null; }
/** 衛星の組の太陽由来と母天体由来((S)・源の半径 t)—— 第352便s の satParts と同じ式 */
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
/** 太陽を受け手に: 惑星 8 つの (S) の和(源の半径 t —— 第352便e の rotOf に源の半径 Rs を渡す。t 0 で第352便e の sunLocal と同じ数) */
export function sunParts(T1, GEO, { tSrc = 0 } = {}, cache = null) {
  const ck = 'sun|' + tSrc; if (cache && cache[ck]) return cache[ck];
  let sum = [0, 0, 0], sHat = null; const by = {};
  for (const p of PLANETS) { const P = SE.sunInput(T1, GEO, p), Om = SE.rotOf({ ...P, Rs: K.srcRadius(p, tSrc) }, { part: 'S' }).Om; by[p] = Om; sum = add(sum, Om); sHat = unit(P.sHat); }
  const v = { sum, by, sHat }; if (cache) cache[ck] = v; return v;
}
/** 組 key の局所の (S)(源の半径 t)と受け手の自転軸 ŝ・公転の法線 n̂。parts: 由来ごとの (S) */
export function localOf(T1, GEO, key, tSrc = 0, cache = null) {
  if (key === DECL.sunRecv) { const S = sunParts(T1, GEO, { tSrc }, cache); return { loc: S.sum, sHat: S.sHat, nHat: null, parts: { planets: S.sum } }; }
  if (key.endsWith('|Sun')) { const [id] = key.split('|'), R = K.spinRot(T1, GEO, id, 'Sun', { part: 'S', tSrc }); return { loc: R.Om, sHat: unit(R.sHat), nHat: unit(R.nHat), parts: { sun: R.Om } }; }
  const P = satParts(T1, GEO, key, { tSrc }, cache); return { loc: add(P.sun, P.parent), sHat: P.sHat, nHat: P.nHat, parts: { sun: P.sun, parent: P.parent } };
}
export const allPairs = () => [...DECL.sunPairs, ...DECL.satPairs, DECL.sunRecv];

/* ───────── T1: 打ち消しの点の 1 行 ───────── */
/**
 * 組 key × 源の半径 t × 背景の向き bg × 基準軸 axis: x = uEq ÷ (uV)(t)・xMin = uMin ÷ (uV)・残り(uEq・uMin・(uV))・cos(局所, 背景)・打ち消すか足し合うか。
 * 衛星は母天体由来だけの x(xPar)も返す(閉じた形と並べる用)。
 */
export function cancelPoint(T1, GEO, key, { tSrc = 0, bg, axis }, cache = null) {
  if (!DECL.bgs.includes(bg)) throw new RangeError('cancelPoint: 背景の向きは Np・Gm');
  if (!DECL.axes.includes(axis)) throw new RangeError('cancelPoint: 基準軸は L・eq');
  if (!DECL.tSrcs.includes(tSrc)) throw new RangeError('cancelPoint: 源の半径の置き方は 0・1');
  const Lc = localOf(T1, GEO, key, tSrc, cache), loc = Lc.loc, b1 = bgOf(T1, GEO, bg, axis, 1), uV = uVt(T1, GEO, tSrc, cache);
  const uEq = nrm(loc) / nrm(b1), uMin = uForMin(b1, loc), cosLB = dot(unit(loc), unit(b1));
  const res = (u) => (u > 0 ? nrm(add(scl(b1, u), loc)) / (u * nrm(b1)) : null);
  const resMin = nrm(add(scl(b1, uMin), loc)) / nrm(loc);
  return { key, tSrc, bg, axis, uV, uEq, x: uEq / uV, xMin: uMin / uV, xPar: Lc.parts.parent ? nrm(Lc.parts.parent) / nrm(b1) / uV : null,
    resEq: res(uEq), resMin, resAtUV: res(uV), cosLocBg: cosLB, mode: cosLB < 0 ? 'cancel' : 'add', cosLocS: dot(Lc.sHat, unit(loc)) };
}

/* ───────── T2: x の閉じた形(一次 —— 源の赤道面・静止の源・A ≫ m K・r ≫ R)───────── */
/**
 * 一次の大きさ abs Ω_S ≈ (1/2) · m_源 R_源² ω_源 ÷ (5 r³ A)(形 M・核 1 —— 第352便k の closedS の一次: f + r f′/2 = −f/2)。A は全部の受け手で同じ(1.5 ÷ Y_k)なので、
 * x の一次 = (m R² ω ÷ r³)_組 ÷ (m R² ω ÷ r³)_金星。規則の半径 R = Y_k m では (m ÷ r)³ ω の比 = (v_c ÷ v_c,金星)⁶ (ω ÷ ω_太陽)(v_c = √(G m_源 ÷ r))/
 * 観測の半径では (m R²)(ω)÷ r³ の比(球のモーメントの形なら、源の自転の角運動量 ÷ 距離³ の比)。返す: 要素の比と x の一次。
 */
export function srcGeom(T1, GEO, id, src) { const P = SP.pairInput(T1, GEO, id, src); return { m: P.Ms, ws: Math.abs(P.ws), r: P.a, src: srcId(src) }; }
export function leadX(T1, GEO, key, tSrc = 0) {
  const V = srcGeom(T1, GEO, 'Venus', 'Sun'), q = (g) => g.m * Math.pow(K.srcRadius(g.src, tSrc), 2) * g.ws / Math.pow(g.r, 3), qV = q(V);
  const one = (id, src) => { const g = srcGeom(T1, GEO, id, src), mOverR = (g.m / g.r) / (V.m / V.r), wr = g.ws / V.ws;
    return { id, src, x: q(g) / qV, mOverR, vRatio: Math.sqrt(mOverR), wRatio: wr, rRatio: g.r / V.r, Rratio: K.srcRadius(g.src, tSrc) / K.srcRadius(V.src, tSrc), mRatio: g.m / V.m }; };
  if (key === DECL.sunRecv) {
    const by = PLANETS.map((p) => { const P = SE.sunInput(T1, GEO, p), g = { m: P.Ms, ws: Math.abs(P.ws), r: P.a, src: p }; return { id: 'Sun', src: p, x: q(g) / qV }; });
    return { key, tSrc, parts: by, x: by.reduce((t, r) => Math.max(t, r.x), 0), sumX: by.reduce((t, r) => t + r.x, 0) };
  }
  const [id, src] = key.split('|');
  if (src === 'Sun') { const o = one(id, 'Sun'); return { key, tSrc, parts: [o], x: o.x }; }
  const [sid] = SP.PARENT_ROWS[key].split('|'), par = one(id, src), sun = one(sid, 'Sun');
  return { key, tSrc, parts: [par, sun], x: par.x, xSun: sun.x };
}

/* ───────── T3: 背景 1 つ((uV)(t))で読む 1 組 + 受け手の観測の状態(リポジトリの数)───────── */
/** 受け手の観測の状態(リポジトリの geometry と t1Table の数だけ): 公転の法線と自転軸の角・逆行(角 > 90°)・自転の率 ÷ 公転の率・同期(比が 1 の 1% の内) */
export function stateOf(T1, GEO, key) {
  if (key === DECL.sunRecv) { const S = SE.sunInput(T1, GEO, 'Earth'), Lax = CR.refAxis('L', T1, GEO); return { epsDeg: angDeg(unit(S.sHat), Lax), epsRef: '基準軸 L', retro: false, spinOverN: null, sync: false }; }
  const [id, src] = key.split('|'), P = SP.pairInput(T1, GEO, id, src), r2 = T1.find((r) => r.id === id && r.src === src && r.mag === 'm2');
  let wSpin = r2 ? r2.omega : null;
  if (wSpin === null && F.DECL.tideBodies.includes(id)) wSpin = F.satInput(T1, GEO, id, src).wSpin;
  const n = P.vOrb / P.a, eps = angDeg(unit(P.sHat), unit(P.nHat)), ratio = wSpin === null ? null : Math.abs(wSpin) / n;
  return { epsDeg: eps, epsRef: '自分の公転の法線', retro: eps > 90, spinOverN: ratio, sync: ratio !== null && Math.abs(ratio - 1) < 0.01 };
}
export function oneBg(T1, GEO, key, { tSrc = 0, bg, axis }, cache = null) {
  const Lc = localOf(T1, GEO, key, tSrc, cache), uV = uVt(T1, GEO, tSrc, cache), b = bgOf(T1, GEO, bg, axis, uV), Om = add(b, Lc.loc);
  const perp = nrm(add(SP.perpOf(Lc.sHat, b), SP.perpOf(Lc.sHat, Lc.loc)));
  // 合成と背景の角は、背景に直交する局所の成分から直接に(合成 ≈ 背景の行で外積の打ち消しを作らない)
  const bh = unit(b), lPar = dot(Lc.loc, bh), lPerp = nrm(SP.perpOf(bh, Lc.loc));
  return { key, tSrc, bg, axis, omOverBg: nrm(Om) / nrm(b), locOverBg: nrm(Lc.loc) / nrm(b), angOmSDeg: angDeg(Om, Lc.sHat), angOmBgDeg: Math.atan2(lPerp, nrm(b) + lPar) / D2R, perpOverBg: perp / nrm(b), omAsYr: nrm(Om) * ASYR };
}

/* ───────── T4: 打ち消しの近くの判定の量と潮汐のトルクの比 ───────── */
/** 潮汐の天体 id × t × bg × axis × 倍率の列(u0 局所だけ・uV・uEq・uMin)の Ω で: 潮汐のトルクの比(第351便f の torqueRatio)と判定の量(第352便i の judgeConst —— θ = ŝ と Ω の角) */
export function nearRow(T1, GEO, id, { tSrc = 0, bg, axis }, cache = null) {
  const key = DECL.tideKey[id]; if (!key) throw new RangeError('nearRow: 潮汐の天体 ' + id);
  const [, src] = key.split('|'), S = F.satInput(T1, GEO, id, src), T = F.tideOf(id), Lc = localOf(T1, GEO, key, tSrc, cache), b1 = bgOf(T1, GEO, bg, axis, 1);
  const uV = uVt(T1, GEO, tSrc, cache), uEq = nrm(Lc.loc) / nrm(b1), uMin = uForMin(b1, Lc.loc);
  const cols = { u0: 0, uV, uEq, uMin }, out = { id, key, tSrc, bg, axis, uOverUV: {}, cells: {} };
  for (const [c, u] of Object.entries(cols)) {
    out.uOverUV[c] = u / uV;
    const b = scl(b1, u), Om = add(b, Lc.loc), tr = F.torqueRatio(T, S, Om), th = angDeg(S.sHat, Om), W = nrm(Om), J = {};
    for (const f of DECL.fShow) for (const sense of DECL.senses) { const j = ST.judgeConst({ thDeg: th, W, f, sense }); J[f + '|' + sense] = { phasePerTurnDeg: j.phasePerTurnDeg, returnPerTurn: j.returnPerTurn, tE: j.tE }; }
    out.cells[c] = { omAsYr: W * ASYR, thDeg: th, perpAsYr: tr.perp * ASYR, rTide: tr.rTide, rTideK: tr.rTideK, judge: J };
  }
  const r = (c) => out.cells[c].rTide;
  out.gainMin = r('uMin') && r('uV') ? r('uMin') / r('uV') : null; out.gainEq = r('uEq') && r('uV') ? r('uEq') / r('uV') : null;
  return out;
}

/* ───────── T5: 源の半径の置き方の材料 ───────── */
/** 惑星 8 つ: 観測 ÷ 規則の (S) の率と、向きの差(度)—— 第352便o の「向きは同じ・率だけ」の数え直し */
export function radiusPlanetRows(T1, GEO) {
  return PLANETS.map((p) => { const a = K.spinRot(T1, GEO, p, 'Sun', { part: 'S', tSrc: 0 }).Om, b = K.spinRot(T1, GEO, p, 'Sun', { part: 'S', tSrc: 1 }).Om; return { id: p, rateRatio: nrm(b) / nrm(a), dirDeg: angDeg(a, b) }; });
}
/** 土星の源の半径の比の 2 乗(輪を起こす率は源の半径の 2 乗 —— 第352便s 表 9 の規則/観測の比と並べる) */
export function saturnR2() { const r = K.srcRadius('Saturn', 1) / K.srcRadius('Saturn', 0); return { Rratio: r, R2: r * r }; }

/* ───────── 零試験 ───────── */
export function pureScenes(T1 = E.t1Table(), GEO = E.geometry()) {
  const cache = {}, A = DECL.anchor;
  // ① (uV)(t 0)= 1.19282e-12 と第352便d の uVenus・(uV)(t 1)= 1.88e-3
  const uV0 = uVt(T1, GEO, 0, cache), uV1 = uVt(T1, GEO, 1, cache), uVd = PS.uVenus(T1, GEO, { part: 'S' });
  // ② 金星の x = 1(t 0・1)・残り (N+) L・eq
  const v0L = cancelPoint(T1, GEO, 'Venus|Sun', { tSrc: 0, bg: 'Np', axis: 'L' }, cache), v0e = cancelPoint(T1, GEO, 'Venus|Sun', { tSrc: 0, bg: 'Np', axis: 'eq' }, cache), v1 = cancelPoint(T1, GEO, 'Venus|Sun', { tSrc: 1, bg: 'Np', axis: 'L' }, cache);
  // ③ イオの x: 規則 0.894・観測 1.03e4(第352便s 表 5・6)・月 0.377・0.499・イオ (N+) L の残り(uV)0.120
  const i0 = cancelPoint(T1, GEO, 'Io|Jupiter', { tSrc: 0, bg: 'Np', axis: 'L' }, cache), i1 = cancelPoint(T1, GEO, 'Io|Jupiter', { tSrc: 1, bg: 'Np', axis: 'L' }, cache);
  const m0 = cancelPoint(T1, GEO, 'Moon|EarthHi', { tSrc: 0, bg: 'Np', axis: 'L' }, cache), m1 = cancelPoint(T1, GEO, 'Moon|EarthHi', { tSrc: 1, bg: 'Np', axis: 'L' }, cache);
  const ioUV = oneBg(T1, GEO, 'Io|Jupiter', { tSrc: 0, bg: 'Np', axis: 'L' }, cache).omOverBg;
  // ④ 太陽 ← 惑星の和(t 0)は第352便e の sunLocal の (S) の和と同じ
  const sl = SE.sunLocal(T1, GEO), vsSun = rel(sunParts(T1, GEO, { tSrc: 0 }, cache).sum, sl.sum.S);
  // ⑤ x は背景の向きと基準軸に依らない(大きさだけ)・uMin は第352便j の式(合成の最小 —— 両隣より小さい)
  const i0e = cancelPoint(T1, GEO, 'Io|Jupiter', { tSrc: 0, bg: 'Gm', axis: 'eq' }, cache), xIndep = Math.abs(i0e.x / i0.x - 1);
  const b1 = bgOf(T1, GEO, 'Np', 'L', 1), Li = localOf(T1, GEO, 'Io|Jupiter', 0, cache).loc, rr = (u) => nrm(add(scl(b1, u), Li)), um = uForMin(b1, Li);
  const minOk = rr(um) <= rr(um * 1.001) && rr(um) <= rr(um * 0.999);
  // ⑥ 閉じた形の一次と数の x: 惑星(太陽が源)で 2 倍の内・イオの母天体の分(規則 —— (v_c 比)⁶ (ω 比))
  const lI = leadX(T1, GEO, 'Io|Jupiter', 0), lead6 = Math.pow(lI.parts[0].vRatio, 6) * lI.parts[0].wRatio, vs6 = Math.abs(lead6 / lI.parts[0].x - 1);
  const leadOk = PLANETS.every((p) => { const n = cancelPoint(T1, GEO, p + '|Sun', { tSrc: 0, bg: 'Np', axis: 'L' }, cache).x, l = leadX(T1, GEO, p + '|Sun', 0).x; return n / l > 0.5 && n / l < 2; });
  // ⑦ 源の半径の比の 2 乗: 惑星(太陽が源)の観測 ÷ 規則の率 = (R☉,観測 ÷ R☉,規則)² の近く(A ≫ w_源)
  const rS = K.srcRadius('Sun', 1) / K.srcRadius('Sun', 0), pr = radiusPlanetRows(T1, GEO), r2ok = pr.every((r) => Math.abs(r.rateRatio / (rS * rS) - 1) < 1e-3);
  // ⑧ 変異: (G−) では金星は打ち消さない(cos > 0 か残り > 0.5)
  const vG = cancelPoint(T1, GEO, 'Venus|Sun', { tSrc: 0, bg: 'Gm', axis: 'L' }, cache), mutG = vG.resEq > 0.5;
  // ⑨ 拒否
  const rej = [() => cancelPoint(T1, GEO, 'Io|Jupiter', { tSrc: 0, bg: 'Gp', axis: 'L' }), () => cancelPoint(T1, GEO, 'Io|Jupiter', { tSrc: 0, bg: 'Np', axis: 'ecl' }),
    () => cancelPoint(T1, GEO, 'Io|Jupiter', { tSrc: 2, bg: 'Np', axis: 'L' }), () => satParts(T1, GEO, 'Earth|Sun', {}), () => nearRow(T1, GEO, 'Earth', { bg: 'Np', axis: 'L' })]
    .map((fn) => { try { fn(); return false; } catch (e) { return e instanceof RangeError; } });
  return { uV0, uV1, uVd, venus: [v0L.x, v1.x, v0L.resEq, v0e.resEq], io: [i0.x, i1.x], moon: [m0.x, m1.x], ioUV, vsSun, xIndep, minOk, vs6, leadOk, r2ok, rS, mutG, rejects: rej, anchorUV: A.uV };
}
export function pureGates(S) {
  const A = DECL.anchor, p3 = (x) => x.toPrecision(3), e3 = (x) => x.toExponential(2);
  return {
    uV: Math.abs(S.uV0 / A.uV - 1) < 5e-6 && Math.abs(S.uV0 / S.uVd - 1) < 1e-12 && e3(S.uV1) === A.uVobs,
    venusOne: Math.abs(S.venus[0] - 1) < 1e-12 && Math.abs(S.venus[1] - 1) < 1e-12 && S.venus[2].toFixed(3) === A.venusResL && S.venus[3].toFixed(3) === A.venusResEq,
    io352s: p3(S.io[0]) === A.ioRule && e3(S.io[1]) === A.ioObs && S.ioUV.toFixed(3) === A.ioResUV,
    moon352s: p3(S.moon[0]) === A.moonRule && p3(S.moon[1]) === A.moonObs,
    sunSum352e: S.vsSun < 1e-12,
    xIndep: S.xIndep < 1e-12 && S.minOk,
    lead: S.vs6 < 1e-12 && S.leadOk,
    radiusSq: S.r2ok,
    mutantGm: S.mutG,
    rejects: S.rejects.length === 5 && S.rejects.every(Boolean),
  };
}
