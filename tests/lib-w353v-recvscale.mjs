// 第353便v(原仮定者の回答(2026-11-25 —— 第151報)AN1045「…引きずられる側は「観測半径と、構造の係数のノブ」」・統括の検証項目 R486):
//   **受け手ごとの構造の係数 —— 受け手の半径の係数 c_R を、受け手ごとに「自分の重み = 主の源の重みになる値 c_R★」の倍 r で置く(c_R = r × c_R★・r は全部の受け手に
//   同じ 1 つの数)。金星の打ち消しと、イオ・月・水星・地球・火星の副作用を同じ r で並べる純関数 —— 診断だけ**
//   (器 tests/exp-w353v-recvscale.mjs と QA behavior.recvscale353v・docs.recvscale353v が読む —— html を読まない・ファイルを読まない・状態を持たない。
//   後のラウンドの枝もこの口を import してよい)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない。既存の lib は呼ぶだけ(本文は変えない):
//   第353便p(stdCancel・localStd・bg1・moonWeights —— 打ち消しの点の一覧の置き方)・第353便j(kFor・sideRow —— 0.98 の列の副作用)・
//   第353便c(cRStar・cancelOf・moiOf・rateMult —— 受け手の半径の入れ方 (P-場))・第352便v(allPairs・uForMin)・第352便k(spinRot・vec)・
//   第348便c(massOf・radiusOf)・第312便a(Kball)・第347便e(t1Table・geometry)。
//   **第353便j は第353便b と第352便j を import するので、仮の値の lib(第352便b)が閉包に入る —— この lib を呼ぶ段の正本は最上位に provisional: true と使った鍵の一覧を持つ。**
//
// ■ 語: c_R★(受け手 X)= 場の式 (P-場) の自分の重み A0 = m K1(0, c_R R_観測) が、主の源の重み wS = M K1(a, R_源 規則) と同じになる c_R(第353便c の cRStar —— 二分)。
//   K1(0, R) = 3/(2R)・K1(a, R_源) = 1/a(a ≥ R_源)なので、閉じた形は c_R★ = (3/2)(m/M)(a/R_観測)(零試験で二分と照合)。
//   主の源: 8 惑星は太陽・月は地球(EarthHi)・イオは木星・冥王星はカロン・カロンは冥王星。太陽(受け手)は受け手の半径の口を持たない列(規則の半径のまま —— 第353便j の sunRule と同じ扱い)。
//   r: 全部の受け手に同じ倍。r = null は規則の半径の列(比べる列 —— 第352便までの主の形)。
//   場の式の数え方: r 有限は (P-場)(第353便c・第353便p の 'field'/'both' と同じ作り —— 受け手ごとに自分の c_R)。σ = 第353便d の (O2b)(リポジトリの扁平率)。
// ■ 量: x = abs(組の局所) ÷ abs(金星 ← 太陽の局所)(金星も同じ r —— c_R = r × c_R★_金星)。残り = 合成 ÷ 背景(等大の倍率・金星の条件の倍率)。
//   打ち消しで小さくなる量は、大きい数の差で作らず、ベクトルの和の大きさで数える。
// ■ 言わないこと: 構造の係数を決めない。r を既定に置かない(恒久の条件「ノブの既定を観測から決めない」—— r は候補の表の走査)。
//   イオと金星が同時に読める組が在るとも書かない(r の走査の表)。
import * as P from './lib-w353p-cancelstd.mjs';
import * as J from './lib-w353j-venus098.mjs';
import * as Cc from './lib-w353c-recvradius.mjs';
import * as V from './lib-w352v-cancelmap.mjs';
import * as K from './lib-w352k-spinform.mjs';
import * as C from './lib-w348c-axisbalance.mjs';
import * as D from './lib-w312a-decay.mjs';
import * as E from './lib-w347e-spintorque.mjs';

export const LIB_VERSION = 'w353v-recvscale-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const D2R = Math.PI / 180;
const { dot, crs, nrm, scl, add, unit } = K.vec;

/* ───────── 宣言(走らせたノブの格子と物差しの記録 —— 式の形の宣言ではない)───────── */
export const DECL = Object.freeze({
  /** 受け手 → 主の源(c_R★ を数える組)。太陽は口なし(null) */
  starSrc: Object.freeze({ Mercury: 'Sun', Venus: 'Sun', Earth: 'Sun', Mars: 'Sun', Jupiter: 'Sun', Saturn: 'Sun', Uranus: 'Sun', Neptune: 'Sun',
    Moon: 'EarthHi', Io: 'Jupiter', Pluto: 'Charon', Charon: 'Pluto', Sun: null }),
  /** r の走査(表 1・表 2)。0.195 は金星の c_R 0.0128(第353便c の 2% の端)に当たる倍。null = 規則の半径の列 */
  rGrid: Object.freeze([0.01, 0.03, 0.1, 0.195, 0.3, 1, 3, 10]),
  bands: Object.freeze([[0.9, 1.1], [0.5, 2]]),
  venusBand: 0.02, ioBand: Object.freeze([0.9, 1.1]),
  uFocus: 0.98,
  /** 表 2 の受け手(第353便j の sideRow の名) */
  sideRecvs: Object.freeze(['Mercury', 'Venus', 'Earth', 'Mars', 'Moon', 'Io']),
  /** 点検の数(第353便c 表 5・第353便p 表 3 の c_R★ —— 3 桁)・第353便j 表 3 の 2% の端の k(3 桁) */
  anchor: Object.freeze({ cRStar: Object.freeze({ Mercury: '0.00591', Venus: '0.0657', Earth: '0.106', Mars: '0.0326', Jupiter: '15.6', Saturn: '10.6', Uranus: '7.36', Neptune: '14.0',
    Moon: '4.08', Io: '0.0163' }), kEdge2: '7.21e+5', kRule: '8.22e+11', venusRule: '0.013274' }),
  judge: '丸めの桁の床: 零試験は相対 1e-9(尺度の走り直しで揺れる)・表の照合は有効数字 5 桁・逐語の表は 3 桁',
});
const checkR = (r) => { if (!(r === null || (fin(r) && r > 0))) throw new RangeError('r は null(規則の半径)か > 0'); };
const recvOfKey = (key) => key.split('|')[0];

/* ───────── 約束の口 ───────── */
/** 受け手 key(名 'Venus' か組 'Venus|Sun')の c_R★: { recv, src, cR(二分 —— 第353便c の cRStar), closed(閉じた形 (3/2)(m/M)(a/R_観測)), wS, m, M, a, Ro } —— 太陽は null */
export function cRStarOf(key, T1 = E.t1Table(), GEO = E.geometry(), cache = null) {
  const id = recvOfKey(key);
  if (!(id in DECL.starSrc)) throw new RangeError('cRStarOf: 受け手 ' + id);
  const src = DECL.starSrc[id];
  if (src === null) return null;
  const ck = 'cs|' + id; if (cache && cache[ck]) return cache[ck];
  const cs = Cc.cRStar(id, src, T1, GEO), m = C.massOf(id), Ro = C.radiusOf(id), sb = src === 'EarthHi' ? 'Earth' : src, M = C.massOf(sb);
  const aEff = M / cs.wS;   // wS = M K1(a, R_源) = M / a(a ≥ R_源 —— 規則の半径)
  const v = { recv: id, src, cR: cs.cR, closed: 1.5 * (m / M) * (aEff / Ro), wS: cs.wS, m, M, a: aEff, Ro };
  if (cache) cache[ck] = v; return v;
}
/** 受け手の c_R = r × c_R★(r null・太陽は null = 規則の半径) */
export function cROf(key, r, T1 = E.t1Table(), GEO = E.geometry(), cache = null) {
  checkR(r);
  if (r === null) return null;
  const s = cRStarOf(key, T1, GEO, cache);
  return s === null ? null : r * s.cR;
}
/**
 * 約束の口: 組 key(第352便v の 17 組)を倍 r で。o: { u(背景の倍率 —— null は金星の条件 = 金星の等大の倍率), ob(null 球 / 'lit' (O2b) の σ), bg, axis }。
 * 戻り値 { key, r, cR, cRV, x, uEq, uV, resEq, resAtUV, resAtU, phiDeg, mode, xPar, venusResEq, knob }
 *   uEq = 組の等大の倍率・uV = 金星の等大の倍率(金星の c_R = r × c_R★_金星)・resAtUV = 金星の条件での組の残り・resAtU = 倍率 u での残り(u を渡したとき)。
 *   r 有限のとき、組の数は第353便p の stdCancel(place 'field'/'both'・cR = 組の受け手の c_R)と同じ作り(金星は別に stdCancel を受け手の c_R で)。
 */
export function stateAtR(T1, GEO, key, r, { u = null, ob = null, bg = 'Np', axis = 'L' } = {}, cache = null) {
  checkR(r);
  if (!(ob === null || ob === 'lit')) throw new RangeError('stateAtR: ob は null・lit');
  if (!(u === null || (fin(u) && u > 0))) throw new RangeError('stateAtR: u は null か > 0');
  const cR = cROf(key, r, T1, GEO, cache), cRV = cROf('Venus', r, T1, GEO, cache);
  const plc = (c) => (c === null ? (ob === null ? 'rule' : 'ob') : (ob === null ? 'field' : 'both'));
  const a = P.stdCancel(T1, GEO, key, { place: plc(cR), cR, ob: 'lit', bg, axis }, cache), v = P.stdCancel(T1, GEO, 'Venus|Sun', { place: plc(cRV), cR: cRV, ob: 'lit', bg, axis }, cache);
  const Lc = P.localStd(T1, GEO, key, { ob: ob === null ? null : 'lit', cR }, cache), b1 = P.bg1(T1, GEO, bg, axis), nb = nrm(b1);
  const res = (uu) => nrm(add(scl(b1, uu), Lc.loc)) / (uu * nb);
  return { key, r, cR, cRV, x: a.uEq / v.uEq, uEq: a.uEq, uV: v.uEq, resEq: a.resEq, resAtUV: res(v.uEq), resAtU: u === null ? null : res(u), phiDeg: a.phiDeg, mode: a.mode,
    xPar: Lc.parts.parent ? nrm(Lc.parts.parent) / nb / v.uEq : null, venusResEq: v.resEq, knob: Lc.knob };
}
/** 0.98 の列(第353便j): 金星を等大にする k(r)= kFor(c_R_金星)と、受け手 recv の sideRow(受け手の c_R = r × c_R★)。r null は規則の半径 */
export function sideAtR(recv, r, { u = DECL.uFocus, T1 = E.t1Table(), GEO = E.geometry(), cache = {} } = {}) {
  checkR(r);
  const cRV = cROf('Venus', r, T1, GEO, cache), kv = cRV === null ? J.kFor(null, { u, place: 'rule', T1, GEO }) : J.kFor(cRV, { u, place: 'field', T1, GEO });
  const cR = recv === 'Sun' ? null : cROf(recv, r, T1, GEO, cache);
  const row = J.sideRow(recv, cR === null ? { u, k: kv.k, place: 'rule', T1, GEO, cache } : { u, k: kv.k, cR, place: 'field', T1, GEO, cache });
  const r0 = J.sideRow(recv, { u, k: 1, place: 'rule', T1, GEO, cache });
  const { _ms, ...rest } = row;
  return { ...rest, r, k: kv.k, venusResid: kv.residEqual, relOm0: r0.relOm, sameSense: row.relOm === r0.relOm };
}

/* ───────── 零試験 ───────── */
export function pureScenes(T1 = E.t1Table(), GEO = E.geometry()) {
  const cache = {}, rl = (a, b) => Math.abs(a / b - 1);
  // ① c_R★: 第353便c の cRStar(二分)と閉じた形・第353便c 表 5 の数(3 桁)・第353便p の moonWeights のイオ(円の道 —— 同じ桁)
  const stars = Object.keys(DECL.anchor.cRStar).map((id) => { const s = cRStarOf(id, T1, GEO, cache); return { id, cR: s.cR, closed: s.closed, c: Cc.cRStar(id, DECL.starSrc[id], T1, GEO).cR }; });
  const mwIo = P.moonWeights(T1, GEO, 'io').cRStar;
  // ② r null は第353便p の stdCancel(place 'rule' / 'ob')と同じ(17 組)
  const vsRule = Math.max(...V.allPairs().map((k) => { const a = stateAtR(T1, GEO, k, null, {}, cache), b = P.stdCancel(T1, GEO, k, { place: 'rule' }, cache); return Math.max(rl(a.x, b.x), rl(a.resEq, b.resEq), rl(a.resAtUV, b.resAtUV)); }));
  const vsOb = Math.max(...['Io|Jupiter', 'Venus|Sun', 'Earth|Sun'].map((k) => { const a = stateAtR(T1, GEO, k, null, { ob: 'lit' }, cache), b = P.stdCancel(T1, GEO, k, { place: 'ob' }, cache); return Math.max(rl(a.x, b.x), rl(a.resAtUV, b.resAtUV)); }));
  // ③ 金星の受け手: r で c_R = r × c_R★ —— 第353便p の stdCancel(field・同じ c_R)と第353便c の cancelOf の残り(2 sin φ/2)と同じ
  const rV = 0.0128 / stars.find((s) => s.id === 'Venus').cR, sV = stateAtR(T1, GEO, 'Venus|Sun', rV, {}, cache), pV = P.stdCancel(T1, GEO, 'Venus|Sun', { place: 'field', cR: 0.0128 }, cache), cV = Cc.cancelOf(T1, GEO, 'Venus', 'Sun', { place: 'field', cR: 0.0128 });
  const vsVenus = Math.max(rl(sV.resEq, pV.resEq), rl(sV.resEq, cV.residEqual), Math.abs(sV.x - 1));
  // ④ 組の受け手の c_R が同じなら第353便p の stdCancel と同じ x(全部同じ c_R の列を、r を受け手ごとに選んで作る —— イオ・地球)
  const vsSame = Math.max(...['Io|Jupiter', 'Earth|Sun', 'Moon|EarthHi'].map((k) => { const id = recvOfKey(k), rk = 0.0128 / cRStarOf(id, T1, GEO, cache).cR, a = stateAtR(T1, GEO, k, rk, {}, cache), b = P.stdCancel(T1, GEO, k, { place: 'field', cR: 0.0128 }, cache);
    return rl(a.uEq, b.uEq) + rl(a.resEq, b.resEq); }));
  // ⑤ 0.98 の列: r null の k は第353便j の kFor(規則)= 8.22e11・金星の c_R 0.0128 の k は第353便j 表 3 の 2% の端 7.21e5・受け手の sideRow は j と同じ
  const sR = sideAtR('Earth', null, { T1, GEO, cache }), sE = sideAtR('Venus', rV, { T1, GEO, cache }), jE = J.sideRow('Earth', { k: sR.k, place: 'rule', T1, GEO, cache });
  const io = sideAtR('Io', 1, { T1, GEO, cache }), jIo = J.sideRow('Io', { k: io.k, cR: cROf('Io', 1, T1, GEO, cache), place: 'field', T1, GEO, cache });
  // ⑥ 小さい r は規則の半径の列に近づく(金星の φ —— r 1e-5 で c_R ≈ 7e-7 —— 第353便c の谷の左)・大きい r で自分の重みが源の重みより小さい側(金星 φ が 0.7606° から離れる)
  const small = stateAtR(T1, GEO, 'Venus|Sun', 1e-5, {}, cache).phiDeg, rule = stateAtR(T1, GEO, 'Venus|Sun', null, {}, cache).phiDeg, big = stateAtR(T1, GEO, 'Venus|Sun', 10, {}, cache).phiDeg;
  // ⑦ 拒否
  const rejects = [() => cROf('Venus', 0), () => cROf('Venus', -1), () => cRStarOf('Ceres'), () => stateAtR(T1, GEO, 'Venus|Sun', 1, { ob: 'obs' }), () => stateAtR(T1, GEO, 'Venus|Sun', 1, { u: 0 }), () => sideAtR('Earth', 'x', { T1, GEO })]
    .map((fn) => { try { fn(); return false; } catch (e) { return e instanceof RangeError; } });
  return { stars, mwIo, vsRule, vsOb, vsVenus, vsSame, k: { rule: sR.k, edge: sE.k, venusResid: sE.venusResid }, vsJ: Math.max(rl(sR.locOverBg, jE.locOverBg), rl(sR.coneDeg, jE.coneDeg), rl(io.locOverBg, jIo.locOverBg)),
    sunNull: cRStarOf('Sun', T1, GEO, cache) === null && cROf('Sun', 1, T1, GEO, cache) === null, phi: { small, rule, big }, rejects };
}
export function pureGates(S) {
  const A = DECL.anchor, p = (x, n) => Number(x).toPrecision(n);
  return {
    cRStar: S.stars.length === 10 && S.stars.every((s) => Math.abs(s.cR / s.c - 1) < 1e-9 && Math.abs(s.closed / s.cR - 1) < 1e-6 && p(s.cR, 3) === A.cRStar[s.id]) && Math.abs(Math.log10(S.stars.find((s) => s.id === 'Io').cR / S.mwIo)) < 0.5,
    rule353p: S.vsRule < 1e-9 && S.vsOb < 1e-9,
    venus353c: S.vsVenus < 1e-9,
    same353p: S.vsSame < 1e-9,
    k353j: Number(S.k.rule).toExponential(2) === A.kRule && Number(S.k.edge).toExponential(2) === A.kEdge2 && Math.abs(S.k.venusResid - 0.02) < 2e-4 && S.vsJ < 1e-9,
    sunNull: S.sunNull === true,
    limits: Math.abs(S.phi.small - S.phi.rule) < 0.05 && p(Math.abs(S.phi.rule), 4) === '0.7606' && S.phi.big > 10,
    rejects: S.rejects.length === 6 && S.rejects.every(Boolean),
  };
}
