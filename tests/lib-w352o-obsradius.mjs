// 第352便o(原仮定者の回答(2026-11-24 —— 第148報)AN1015・原仮定者の補足(2026-11-14 —— 第138報の補足 1)・原仮定者の回答(2026-11-18 —— 第141報 AN790)・統括の検証項目 R452):
//   **(S)(源の自転の分)の源の半径を「規則の半径」と「観測の半径」の 2 列で、形のノブ(球のモーメント〔在位〕・落ち方 q 1.2・q 0〔比べる列〕)と組にして、
//   本便の主な表(主の表・金星の打ち消し・倍率 1 の背景と要る k・太陽を受け手に・衛星)を同じ重さで数え直す口 —— 診断だけ**
//   (器 tests/exp-w352o-obsradius.mjs と QA behavior.obsradius352o・docs.obsradius352o が読む —— html を読まない・ファイルを読まない・状態を持たない。後のラウンドの枝もこの口を import してよい)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない(AN712 —— エンジンへ足す操作ではない)。
//   既存の lib と第 1・第 2 ラウンドの lib は呼ぶだけ(本文は変えない): 第352便k(spinRot・srcRadius・formOf —— (S) の形と源の半径)・第352便j(cellOf —— 主の表の 1 つのセル)・
//   第352便d(poleRates・precDs・bgVec・uVenus —— cellOf の中で)・第352便c(refAxis)・第352便e(sunInput・rotOf・sunLocal —— 太陽を受け手に)・
//   第351便e(localOf・bgTerm)・第351便c(PAIRS16・PARENT_ROWS・partRot)・第348便h(makeField3・rot3)・第350便b(equivR)・第347便h(gaussLegendre)・第312便a(Kball)・第347便e(t1Table・geometry)。
//
// ■ 列(COLS): 源の半径の置き方 tSrc {0 = 規則の半径 Y_k M_源(在位)・1 = 観測の半径} × 形 {M1 球のモーメント・K1(在位 —— 既定)・q1.2・q0(落ちない形 —— 比べる列)}。
//   q0 は源の半径に依らない(〔第352便k〕の零試験)—— 2 列は同じ数になる(表には両方を出す)。
// ■ 口 localS(T1, GEO, key, { tSrc, form, k }) —— 局所の (S)(太陽由来 + 母天体由来)。太陽由来は〔第352便k〕の spinRot(源 = 太陽)・母天体由来は spinRot(源 = 母天体 —— 母天体の半径も同じ置き方)。
//   分母の他の由来の重み(extraW)は〔第351便e〕の localOf の wSun・wPar(源の外の重みは源の半径に依らない)。**既定(tSrc 0・M1)で〔第351便e〕の localOf の sun.S・parent.S と同じ。**
//   key 'Sun|-' は太陽を受け手に(惑星由来の (S) の和 —— 口 sunLocalS)。
// ■ 口 cellO(T1, GEO, key, { bg, axis, sense, u, tSrc, form, k }) —— 〔第352便j〕の cellOf を**そのまま呼ぶ**(局所の行だけを、cellOf が読む約束の置き場〔cellOf の cache の 'loc|key|k'〕に
//   この列の (S) で入れて渡す —— 式は 1 つ)。**既定(tSrc 0・M1)で cellOf と同じ数。**
// ■ 口 sunRotS(P, { form, tSrc, read, extraW, k }) —— 〔第352便e〕の rotOf と同じ式に、源(惑星)の半径の置き方と形のノブを足した口(既定で rotOf と同じ)。
// ■ 言わないこと: (S) の強さ・係数・源の半径の置き方を決めない。観測の数に届くとは書かない。規則の半径(在位)の列を必ず残す。この場・この形・この半径では、の表。
import * as K from './lib-w352k-spinform.mjs';
import * as MJ from './lib-w352j-maintable.mjs';
import * as PS from './lib-w352d-precsense.mjs';
import * as CR from './lib-w352c-refaxis.mjs';
import * as SR from './lib-w352e-sunrecv.mjs';
import * as BB from './lib-w351e-bgbalance.mjs';
import * as SP from './lib-w351c-srcparts.mjs';
import * as G3 from './lib-w348h-axisgeo3.mjs';
import * as SC from './lib-w350b-sphereconv.mjs';
import * as H from './lib-w347h-axisdiff.mjs';
import * as DK from './lib-w312a-decay.mjs';
import * as E from './lib-w347e-spintorque.mjs';

export const LIB_VERSION = 'w352o-obsradius-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const { dot, crs, nrm, scl, add, sub, unit } = K.vec;
export const ASYR = PS.ASYR;

/* ───────── 宣言 ───────── */
export const COLS = Object.freeze([
  Object.freeze({ id: 'R-M1', tSrc: 0, form: 'M1', label: '規則の半径・球のモーメント(在位)' }),
  Object.freeze({ id: 'O-M1', tSrc: 1, form: 'M1', label: '観測の半径・球のモーメント' }),
  Object.freeze({ id: 'R-q1.2', tSrc: 0, form: 'q1.2', label: '規則の半径・q 1.2' }),
  Object.freeze({ id: 'O-q1.2', tSrc: 1, form: 'q1.2', label: '観測の半径・q 1.2' }),
  Object.freeze({ id: 'R-q0', tSrc: 0, form: 'q0', label: '規則の半径・q 0(比べる列)' }),
  Object.freeze({ id: 'O-q0', tSrc: 1, form: 'q0', label: '観測の半径・q 0(比べる列)' }),
]);
export const colOf = (id) => { const c = COLS.find((x) => x.id === id); if (!c) throw new RangeError('colOf: 列の名 ' + id); return c; };
export const DECL = Object.freeze({
  cols: Object.freeze(COLS.map((c) => c.id)), mainCol: 'R-M1', obsCol: 'O-M1',
  tSrcs: Object.freeze([0, 1]), forms: Object.freeze(['M1', 'q1.2', 'q0']),
  planets: Object.freeze(['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune']),
  /** 主の表の行(8 惑星 + 太陽) */
  rows: Object.freeze(['Mercury|Sun', 'Venus|Sun', 'Earth|Sun', 'Mars|Sun', 'Jupiter|Sun', 'Saturn|Sun', 'Uranus|Sun', 'Neptune|Sun', 'Sun|-']),
  sats: Object.freeze(['Moon|EarthHi', 'Moon|EarthLo', 'Io|Jupiter', 'Pluto|Charon', 'Charon|Pluto']),
  bgs: MJ.DECL.bgs, axes: MJ.DECL.axes, senses: MJ.DECL.senses, poles: MJ.DECL.poles,
  /** 表 3 の受け手(倍率 1 の背景と要る k) */
  t3Bodies: Object.freeze(['Earth|Sun', 'Mars|Sun', 'Sun|-']),
  /** 第 2 ラウンドの数(〔第352便k〕の表 —— 金星の条件の倍率 ÷ k: 規則の半径・観測の半径・q 0) */
  anchor: Object.freeze({ uVrule: 1.19282e-12, uVobs2: '1.9e-3', uVq0: '229' }),
  judge: '丸めの桁の床: 逐語の表は有効数字 3 桁・角の差は 1e-9 度より小さいものを 0 と書く',
});

/* ───────── 局所の (S)(列ごと)───────── */
const ck = (key, c) => ['oS', key, c.tSrc, typeof c.form === 'string' ? c.form : JSON.stringify(c.form), c.k].join('|');
/** 太陽を受け手にした (S) の成分 1 つ(〔第352便e〕の rotOf と同じ式 + 源〔惑星〕の半径の置き方 tSrc と形 form)。part は M・S・MS(既定 S) */
export function sunRotS(P, { part = 'S', form = 'M1', tSrc = 0, read = 'C2', extraW = 0, k = 1, nPhase = SR.DECL.nPhase } = {}) {
  const F = typeof form === 'string' ? K.formOf(form) : form;
  if (!(F && (F.form === 'M' || (F.form === 'q' && fin(F.q) && F.q >= 0)) && (F.al === 1 || F.al === 2))) throw new RangeError('sunRotS: 形は M か q(q ≥ 0)・核 1・2');
  if (!['C2', 'W'].includes(read)) throw new RangeError('sunRotS: 読みは C2・W');
  if (!(fin(k) && k >= 0 && fin(extraW) && extraW >= 0)) throw new RangeError('sunRotS: k ≥ 0・extraW ≥ 0');
  const sc = { M: [1, 0], S: [0, 1], MS: [1, 1] }[part];
  if (!sc) throw new RangeError('sunRotS: 成分は M・S・MS');
  const Rr = G3.YK * P.m, Rs = K.srcRadius(P.src, tSrc), GL = H.gaussLegendre(SR.DECL.ballN);
  const x0 = crs(P.sAx, P.nHat), x = nrm(x0) > 1e-12 ? unit(x0) : unit(crs(P.nHat, Math.abs(P.nHat[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0])), y = crs(P.nHat, x);
  const radii = read === 'W' ? [[Rr, 1]] : GL.x.map((xi, i) => { const rho = 0.5 * Rr * (xi + 1); return [SC.equivR(Rr, rho), 0.5 * Rr * GL.w[i] * 5 * Math.pow(rho, 4) / Math.pow(Rr, 5)]; });
  const spin = scl(P.sAx, P.ws * sc[1]), rot = F.form === 'M' ? { form: 'M' } : { form: 'q', q: F.q };
  let Om = [0, 0, 0];
  for (const [Ri, wt] of radii) {
    let mW = [0, 0, 0];
    for (let j = 0; j < nPhase; j++) {
      const ph = 2 * Math.PI * (j + 0.5) / nPhase, rh = add(scl(x, Math.cos(ph)), scl(y, Math.sin(ph))), vh = crs(P.nHat, rh);
      const f = G3.makeField3({ sources: [{ m: P.Ms, R: Rs, p: scl(rh, -P.a), v: [0, 0, 0], spin }], recv: { m: P.m, R: Ri, p: [0, 0, 0], v: scl(vh, P.vOrb * sc[0]) },
        W0: 0, extraW, kernel: { kind: 'ball', al: F.al }, rot, self: true, mut: null });
      mW = add(mW, scl(G3.rot3('W', f, [0, 0, 0], { Rb: Ri }), 1 / nPhase));
    }
    Om = read === 'W' ? mW : add(Om, scl(mW, wt));
  }
  return { Om: k === 1 ? Om : scl(Om, k), Rs, A0: P.m * DK.Kball(F.al, 0, Rr), wS: P.Ms * DK.Kball(F.al, P.a, Rs) };
}
/** 太陽を受け手に: 8 惑星由来の (S) の和(列の源の半径 = 惑星の半径の置き方・形) */
export function sunLocalS(T1 = E.t1Table(), GEO = E.geometry(), { tSrc = 0, form = 'M1', k = 1, part = 'S' } = {}) {
  const byPlanet = {}; let sum = [0, 0, 0], sHat = null;
  for (const id of DECL.planets) { const P = SR.sunInput(T1, GEO, id), r = sunRotS(P, { part, form, tSrc, k }); byPlanet[id] = r.Om; sum = add(sum, r.Om); sHat = P.sHat; }
  return { byPlanet, sum, sHat };
}
/**
 * 局所の (S)(列 { tSrc, form, k })→ { sHat, nHat|null, sun:{ S }, parent:{ S }|null, src }(〔第352便j〕の localRow と同じ形 —— cellOf の約束の置き場に入れられる)。
 */
export function localS(T1, GEO, key, { tSrc = 0, form = 'M1', k = 1 } = {}, cache = null) {
  const c = { tSrc, form, k }, kk = ck(key, c);
  if (cache && cache[kk]) return cache[kk];
  let v;
  if (key === 'Sun|-') { const S = sunLocalS(T1, GEO, c); v = { sHat: unit(S.sHat), nHat: null, sun: { S: S.sum }, parent: null, src: 'Sun', byPlanet: S.byPlanet }; }
  else {
    const [id, src] = key.split('|'), L = BB.localOf(T1, GEO, id, src, {}, cache), sunKey = src === 'Sun' ? key : SP.PARENT_ROWS[key];
    if (!sunKey) throw new RangeError('localS: 組 ' + key);
    const [sid, ssrc] = sunKey.split('|');
    const sunS = K.spinRot(T1, GEO, sid, ssrc, { part: 'S', form, tSrc, extraW: L.wPar, k }).Om;
    const parS = src === 'Sun' ? null : K.spinRot(T1, GEO, id, src, { part: 'S', form, tSrc, extraW: L.wSun, k }).Om;
    v = { sHat: unit(L.sHat), nHat: unit(L.nHat), sun: { S: sunS }, parent: parS ? { S: parS } : null, src };
  }
  if (cache) cache[kk] = v;
  return v;
}
const localSumS = (L) => (L.parent ? add(L.sun.S, L.parent.S) : L.sun.S.slice());
/** 金星で太陽由来の (S) と背景の大きさが同じになる倍率 ÷ k(列ごと —— 〔第352便d〕の uVenus と同じ分母) */
export function uVenusO(T1, GEO, { tSrc = 0, form = 'M1', k = 1 } = {}, cache = null) {
  return nrm(localS(T1, GEO, 'Venus|Sun', { tSrc, form, k }, cache).sun.S) / nrm(BB.bgTerm('Venus', { u: 1 }).vec);
}

/* ───────── 約束の口: 1 つのセル(〔第352便j〕の cellOf をそのまま呼ぶ)───────── */
/**
 * 列 { tSrc, form } の (S) で、〔第352便j〕の cellOf と同じ量(合成・円錐・基準軸の角・方位の率・傾きの率・起こす率)。cellOf の約束の置き場('loc|key|k')に、この列の局所の行を入れて渡す。
 * cache は列ごとに別の物を渡す(省けば毎回作る)。mut は cellOf へ(零試験)。
 */
export function cellO(T1, GEO, key, { bg, axis, sense, u, tSrc = 0, form = 'M1', k = 1, mut = null }, cache = null) {
  const L = localS(T1, GEO, key, { tSrc, form, k }, cache), jc = {};
  jc['loc|' + key + '|' + k] = { sHat: L.sHat, nHat: L.nHat, sun: L.sun, parent: L.parent, src: L.src };
  return { ...MJ.cellOf(T1, GEO, key, { bg, axis, sense, u, part: 'S', k, mut }, jc), tSrc, form };
}

/* ───────── 金星の 2 つの読み(大きさが同じ・合成が最小 —— 打ち消しの残りを直接に)───────── */
/**
 * 背景の単位の向き b̂ と金星の (S) の S から: uMag(大きさが同じ —— abs(S) ÷ ω_G)・uMin(合成が最小 —— max(0, −b̂·S) ÷ ω_G)と、
 * そのときの残り abs(u ω_G b̂ + S) ÷ (u ω_G)(大きい数の差で作らず、sin と 1 − cos から直接に)。
 */
export function venusTwo(bHat, S, omegaG) {
  const b = unit(bHat), m = nrm(S), c = dot(b, S) / m, s = nrm(crs(b, S)) / m;
  const onePlusC = c <= 0 ? (s * s) / (1 - c) : 1 + c;      // 1 + cos(打ち消しの深い側は sin² ÷ (1 − cos))
  const uMag = m / omegaG, residMag = Math.sqrt(2 * onePlusC);
  const uMin = c < 0 ? -c * m / omegaG : 0, residMin = c < 0 ? s / (-c) : null;   // 最小の点: 残り = abs(S⊥) ÷ abs(S∥)
  return { cos: c, uMag, residMag, uMin, residMin, minOverMag: c < 0 ? -c : 0 };
}

/* ───────── 零試験 ───────── */
export function pureScenes(T1 = E.t1Table(), GEO = E.geometry()) {
  const rel = (a, b) => nrm(sub(a, b)) / Math.max(nrm(b), 1e-300);
  const c0 = {}, cO = {}, cQ = {};
  // ① 既定(規則の半径・M1)の局所の (S) は〔第351便e〕の localOf の sun.S・parent.S と同じ(16 組)・太陽の行は〔第352便e〕の sunLocal の sum.S と同じ
  let vsLocal = 0;
  for (const [id, src] of SP.PAIRS16) {
    const a = localS(T1, GEO, id + '|' + src, {}, c0), b = BB.localOf(T1, GEO, id, src, {}, c0);
    vsLocal = Math.max(vsLocal, rel(a.sun.S, b.sun.S), b.parent ? rel(a.parent.S, b.parent.S) : 0);
  }
  const sunA = localS(T1, GEO, 'Sun|-', {}, c0), sunB = SR.sunLocal(T1, GEO, {}), vsSun = rel(sunA.sun.S, sunB.sum.S);
  // ② sunRotS の既定は〔第352便e〕の rotOf と同じ(8 惑星 × 成分 3 × 読み 2)
  let vsRotOf = 0;
  for (const id of DECL.planets) for (const part of ['M', 'S', 'MS']) for (const read of ['C2', 'W']) { const P = SR.sunInput(T1, GEO, id); vsRotOf = Math.max(vsRotOf, rel(sunRotS(P, { part, read }).Om, SR.rotOf(P, { part, read }).Om)); }
  // ③ cellO の既定は〔第352便j〕の cellOf と同じ(8 惑星 + 太陽 + 月 + イオ × 背景 2 × 基準軸 2 × 向き 2 —— Ω・方位の率・傾きの率・角)
  const uV0 = PS.uVenus(T1, GEO, { part: 'S' }, c0), jcache = {};
  let vsCell = 0;
  for (const key of [...DECL.rows, 'Moon|EarthHi', 'Io|Jupiter']) for (const bg of DECL.bgs) for (const axis of DECL.axes) for (const sense of DECL.senses) {
    const a = cellO(T1, GEO, key, { bg, axis, sense, u: uV0 }, c0), b = MJ.cellOf(T1, GEO, key, { bg, axis, sense, u: uV0, part: 'S' }, jcache), sc = nrm(b.Om);
    vsCell = Math.max(vsCell, rel(a.Om, b.Om), Math.abs(a.coneDeg - b.coneDeg) / 180, Math.abs(a.refDeg - b.refDeg) / 180);
    for (const p of DECL.poles) if (b.az[p] !== null) vsCell = Math.max(vsCell, Math.abs(a.az[p] - b.az[p]) / sc, Math.abs(a.inc[p] - b.inc[p]) / sc);
  }
  // ④ 〔第352便k〕の表の数: 金星の条件の倍率 ÷ k(規則 1.19282e-12・観測の半径 1.9e-3・q 0 229)と、(S) が spinRot と同じ
  const uV = { rule: uVenusO(T1, GEO, {}, c0), obs: uVenusO(T1, GEO, { tSrc: 1 }, cO), q0: uVenusO(T1, GEO, { form: 'q0' }, cQ), q0obs: uVenusO(T1, GEO, { form: 'q0', tSrc: 1 }, cQ) };
  const vsK = rel(localS(T1, GEO, 'Earth|Sun', { tSrc: 1, form: 'q1.2' }, cO).sun.S, K.spinRot(T1, GEO, 'Earth', 'Sun', { part: 'S', form: 'q1.2', tSrc: 1 }).Om);
  // ⑤ 観測の半径: 形 M1 で (S) は源の半径の 2 乗に比例(地球・太陽由来)・衛星の母天体由来は母天体の半径の 2 乗(イオ)・太陽を受け手にしたとき惑星の半径の 2 乗(地球由来)
  const r2 = (a, b, Ra, Rb) => Math.abs(nrm(a) / nrm(b) / ((Ra / Rb) ** 2) - 1);
  const eR = localS(T1, GEO, 'Earth|Sun', {}, c0), eO = localS(T1, GEO, 'Earth|Sun', { tSrc: 1 }, cO), iR = localS(T1, GEO, 'Io|Jupiter', {}, c0), iO = localS(T1, GEO, 'Io|Jupiter', { tSrc: 1 }, cO);
  const PE = SR.sunInput(T1, GEO, 'Earth');
  const sq = Math.max(r2(eO.sun.S, eR.sun.S, K.srcRadius('Sun', 1), K.srcRadius('Sun', 0)), r2(iO.parent.S, iR.parent.S, K.srcRadius('Jupiter', 1), K.srcRadius('Jupiter', 0)),
    r2(sunRotS(PE, { tSrc: 1 }).Om, sunRotS(PE, {}).Om, K.srcRadius('Earth', 1), K.srcRadius('Earth', 0)));
  // ⑥ q0 は源の半径に依らない(太陽由来・母天体由来・太陽を受け手に)
  const q0inv = Math.max(rel(localS(T1, GEO, 'Io|Jupiter', { form: 'q0', tSrc: 1 }, cQ).parent.S, localS(T1, GEO, 'Io|Jupiter', { form: 'q0' }, cQ).parent.S),
    rel(sunRotS(PE, { form: 'q0', tSrc: 1 }).Om, sunRotS(PE, { form: 'q0' }).Om));
  // ⑦ 金星の 2 つの読み(venusTwo)と cellO の大きさ: 大きさが同じの残り = cellO の合成 ÷ 背景・合成が最小の点で ±0.1% の倍率は大きくなる
  const bN = unit(MJ.axisOf('L', T1, GEO)), vS = localS(T1, GEO, 'Venus|Sun', { tSrc: 1 }, cO).sun.S, om = nrm(BB.bgTerm('Venus', { u: 1 }).vec), vt = venusTwo(bN, vS, om);
  const cMag = cellO(T1, GEO, 'Venus|Sun', { bg: 'Np', axis: 'L', sense: 'g2m', u: vt.uMag, tSrc: 1 }, cO), magErr = Math.abs(cMag.omAsYr / cMag.bgAsYr - vt.residMag);
  const mAt = (u) => nrm(add(scl(bN, u * om), vS)), minOk = mAt(vt.uMin) <= mAt(vt.uMin * 1.001) && mAt(vt.uMin) <= mAt(vt.uMin * 0.999);
  // ⑧ 換算の係数 k: 局所に k 倍(k 2 は同じビットの 2 倍)・背景には掛からない
  const k2 = rel(localS(T1, GEO, 'Earth|Sun', { tSrc: 1, k: 2 }, cO).sun.S, scl(eO.sun.S, 2));
  // ⑨ 変異: cellO の局所を落とすと金星の (N+) の打ち消しが消える(観測の半径でも)・列の置き場を入れないと(既定の cellOf)観測の半径の金星は打ち消さない
  const vNo = cellO(T1, GEO, 'Venus|Sun', { bg: 'Np', axis: 'L', sense: 'g2m', u: vt.uMag, tSrc: 1, mut: 'noLocal' }, cO);
  const vPlain = MJ.cellOf(T1, GEO, 'Venus|Sun', { bg: 'Np', axis: 'L', sense: 'g2m', u: vt.uMag, part: 'S' }, {});
  const muts = { noLocal: Math.abs(vNo.omAsYr / vNo.bgAsYr - 1) < 1e-12, plain: Math.abs(vPlain.omAsYr / vPlain.bgAsYr - 1) < 1e-6 && cMag.omAsYr / cMag.bgAsYr < 0.1 };
  // ⑩ 拒否
  const rejects = [() => colOf('X'), () => localS(T1, GEO, 'Earth|Moon', {}), () => sunRotS(SR.sunInput(T1, GEO, 'Earth'), { part: 'X' }), () => sunRotS(SR.sunInput(T1, GEO, 'Earth'), { tSrc: 2 }),
    () => cellO(T1, GEO, 'Earth|Sun', { bg: 'Gp', axis: 'L', sense: 'g2m', u: 1 }), () => sunRotS(SR.sunInput(T1, GEO, 'Earth'), { form: 'q9' })]
    .map((fn) => { try { fn(); return false; } catch (e) { return e instanceof RangeError; } });
  return { vsLocal, vsSun, vsRotOf, vsCell, uV, vsK, sq, q0inv, magErr, minOk, k2, muts, rejects };
}
export function pureGates(S) {
  const A = DECL.anchor;
  return {
    localVsJ: S.vsLocal < 1e-12 && S.vsSun < 1e-12,
    sunVsRotOf: S.vsRotOf < 1e-12,
    cellVsJ: S.vsCell < 1e-9,   // 床 1e-9: 〔第352便j〕の sameAsD と同じ(極にほぼ平行な行の方位の率の 1 ÷ sin)
    anchorK: Math.abs(S.uV.rule / A.uVrule - 1) < 5e-6 && Number(S.uV.obs.toPrecision(2)) === Number(A.uVobs2)
      && S.uV.q0.toPrecision(3) === A.uVq0 && Math.abs(S.uV.q0obs / S.uV.q0 - 1) < 1e-12 && S.vsK < 1e-12,
    radiusSq: S.sq < 1e-9,
    q0Indep: S.q0inv < 1e-12,
    venusTwo: S.magErr < 1e-9 && S.minOk,
    kLocal: S.k2 < 1e-12,
    mutants: S.muts.noLocal && S.muts.plain,
    rejects: S.rejects.length === 6 && S.rejects.every(Boolean),
  };
}
