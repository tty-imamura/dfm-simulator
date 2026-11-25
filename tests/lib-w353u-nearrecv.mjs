// 第353便u(原仮定者の回答(2026-11-25 —— 第151報)・統括の検証項目 R485):
//   **注目の列 u = 0.98 で金星を打ち消す換算の係数 k を置いたとき、局所の項が背景に並ぶ受け手(水星・地球・火星・月・イオ)の状態 ——
//   円錐・回る向き・傾きを保つ条件・公転の極に対する傾きの揺れ・観測の当たり所(仮の値は印つき)との並べ・並びを決める量の純関数 —— 診断だけ**
//   (器 tests/exp-w353u-nearrecv.mjs と QA behavior.nearrecv353u・docs.nearrecv353u が読む —— html を読まない・ファイルを読まない・状態を持たない。後のラウンドの枝もこの口を import してよい)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない。
//   既存の lib は呼ぶだけ(本文は変えない): 第353便j(sideRow・kFor・combos・provOf —— 組と副作用の行)・第353便b(mainState の出力 —— sideRow の中から)・
//   第353便e(fMaxAt —— 傾きを保つ f の上限)・第353便n(watchRow —— 公転の極に対する傾きの揺れの形)・第353便f(dragRate・tideRate・sumRow —— 軸引きずりと重力の側の列〔比べる列 —— DFM の式ではない〕)・
//   第353便m(earthGrav —— 地球の重力の列の月の道の置き方)・第353便c(sOf・cRStar —— 受け手の半径の入れ方・自分の重みと源の重み)・第352便w(coneRange)・第352便d(bgVec・precDs・poleRates)・
//   第352便k(spinRot)・第352便q(structOf —— リポジトリに在る自転と公転の率)・第347便e(t1Table・geometry)。
//   **第353便j・f・m・n は仮の値の lib(第352便b)を閉包に持つ —— この lib を呼ぶ段の正本は最上位に provisional: true と使った鍵の一覧を持つ。**
//
// ■ 語: u = 背景の大きさ ÷ ω_G(背景の向きは (N+) —— 基準軸 L)。局所 = k × (S)(源の自転の分・源は規則の半径)。組 = (入れ方 place・c_R)と、その組で金星が等大になる k(第353便j の kFor)。
//   組 'k1' = k 1・規則の半径(背景だけの列 —— 比べる列)。受け手 = 水星・地球・火星(太陽が源)・月(太陽 + 地球)・イオ(太陽 + 木星)。
// ■ 口:
//   nearState(key, combo, { u }) —— 受け手 1 つ × 組 1 つ: 合成と L の角・円錐・自転と合成の順逆・(g2−) の回る向き・率(合成の大きさ × 応答 1)・一周の年数・傾きを保つ f の上限・
//     公転の極に対する傾き ε₀ と揺れの幅(〔第353便n〕の形 = coneRange)・合成と公転の極の角。
//   obsRow(key, combo) —— 観測の当たり所との並べ(地球・火星: 軸引きずり ÷ 重力の側の列・残り〔仮の値 − 重力の列〕を埋める c・仮の値の回る向きと同じか/水星・月・イオ: リポジトリに在る自転 ÷ 公転・傾き)。
//   orderRow(key, combo) —— 並びを決める量: 距離の比の 3 乗・自分の重み ÷ 源の重み・(S) の大きさの倍とその閉じた形の候補 (A0_規則 + wS) ÷ (A0 + wS)。
// ■ 言わないこと: k・c_R を決めない。水星の歳差が説明できたとも、食い違いが無いとも書かない(状態の表 —— この場・この入れ方・この係数では)。
import * as J from './lib-w353j-venus098.mjs';
import * as FE from './lib-w353e-focus098.mjs';
import * as N from './lib-w353n-watch098.mjs';
import * as F from './lib-w353f-ratesum.mjs';
import * as M from './lib-w353m-residsign.mjs';
import * as CC from './lib-w353c-recvradius.mjs';
import * as W from './lib-w352w-keepcone.mjs';
import * as D from './lib-w352d-precsense.mjs';
import * as K from './lib-w352k-spinform.mjs';
import * as Q from './lib-w352q-response.mjs';
import * as E from './lib-w347e-spintorque.mjs';

export const LIB_VERSION = 'w353u-nearrecv-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const { dot, nrm, scl, add, unit } = K.vec;
const YR = 365.25 * 86400;
export const ASYR = D.ASYR;
const sg = (x) => (x > 0 ? 1 : x < 0 ? -1 : 0);

/* ───────── 宣言(走らせたノブの格子と物差しの記録 —— 式の形の宣言ではない)───────── */
export const DECL = Object.freeze({
  uFocus: 0.98, omegaG: J.DECL.omegaG,
  /** 受け手 5 つ(第353便j の表 4 で、どの組でも局所 ÷ 背景が 0.1 を越えた受け手) */
  recvs: Object.freeze(['Mercury', 'Earth', 'Mars', 'Moon', 'Io']),
  sats: Object.freeze({ Moon: Object.freeze(['Sun', 'EarthHi']), Io: Object.freeze(['Sun', 'Jupiter']) }),
  /** 組: 'k1'(k 1・規則の半径 —— 背景だけの列)+ 第353便j の combos の 8 つ */
  comboIds: Object.freeze(['k1', 'rule', 'field-0.0001', 'field-0.001', 'field-0.003', 'field-e2', 'field-e5', 'field-0.1', 'resp']),
  /** 観測の当たり所の家の極(第353便f の homePole と同じ: 地球 黄道の極・火星と水星 自分の公転の北極) */
  homePole: Object.freeze({ Earth: 'ecl', Mars: 'orb', Mercury: 'orb' }),
  /** 並びの表(表 3)の受け手: 8 惑星(太陽が源) */
  orderRecvs: Object.freeze(['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune']),
  sideTol: J.DECL.sideTol, crit: J.DECL.crit,
  judge: '丸めの桁の床: 逐語の表は有効数字 3 桁・角は小数 3 桁',
});
let AXL = null;
const axisL = (T1, GEO) => { if (!AXL) AXL = unit(CC.bgUnit('Np', 'L', T1, GEO)); return AXL; };
let COMBOS = null;
/** 組の一覧(第353便j の combos の前に 'k1' を置く) */
export function comboList(T1 = E.t1Table(), GEO = E.geometry()) {
  if (!COMBOS) COMBOS = Object.freeze([Object.freeze({ id: 'k1', place: 'rule', cR: null, k1: true }), ...J.combos(T1, GEO).map((c) => Object.freeze({ ...c }))]);
  return COMBOS;
}
const comboOf = (combo, T1, GEO) => {
  if (typeof combo === 'string') { const c = comboList(T1, GEO).find((x) => x.id === combo); if (!c) throw new RangeError('組は ' + DECL.comboIds.join('・')); return c; }
  if (!(combo && ['rule', 'field', 'resp'].includes(combo.place))) throw new RangeError('組は { place, cR } か組の名');
  return combo;
};
/** 組の k(k1 は 1・ほかは金星で等大の k —— 第353便j の kFor) */
export function kOf(combo, { u = DECL.uFocus, T1 = E.t1Table(), GEO = E.geometry() } = {}) {
  const c = comboOf(combo, T1, GEO);
  return c.k1 ? 1 : J.kFor(c.cR, { u, place: c.place, T1, GEO }).k;
}
/** 衛星の状態(第353便j の sideRow の衛星の作りと同じ: 源の和 × k・ŝ と n̂ は母天体のまわりの spinRot から) */
function satState(T1, GEO, id, { place, cR, k, u }) {
  const srcs = DECL.sats[id], pl = place === 'field' ? 'field' : 'rule', c = place === 'field' ? cR : 1;
  let loc = [0, 0, 0];
  for (const s of srcs) loc = add(loc, CC.sOf(T1, GEO, id, s, { place: pl, cR: c }).Om);
  const R = K.spinRot(T1, GEO, id, srcs[1], { part: 'S' }), bg = D.bgVec('Np', { u, axis: axisL(T1, GEO) });
  const local = scl(loc, k);
  return { sHat: unit(R.sHat), nHat: unit(R.nHat), local, bg, Om: add(bg, local) };
}

/* ───────── 約束の口 ───────── */
/**
 * 受け手 key × 組 combo の状態。返す {
 *   key, combo, place, cR, k, u, locOverBg, omOverBg, omToAxisDeg, coneDeg, spinOm, relOm, relAx, relOrb, fMax, noLimit(第353便j の sideRow),
 *   W(rad/s), rateAsYr(合成の大きさ × 応答 1 —— ″/年), periodYr, eps0Deg(公転の極に対する傾き), wob { minDeg, maxDeg, swingDeg }(〔第353便n〕の形 —— coneRange),
 *   omToOrbDeg(合成と公転の極の角) }
 */
export function nearState(key, combo, { u = DECL.uFocus, T1 = E.t1Table(), GEO = E.geometry(), cache = null } = {}) {
  if (!DECL.recvs.includes(key) && !DECL.orderRecvs.includes(key)) throw new RangeError('nearState: 受け手は ' + DECL.recvs.join('・') + ' か 8 惑星');
  if (!(fin(u) && u > 0)) throw new RangeError('nearState: u > 0');
  const c = comboOf(combo, T1, GEO), k = kOf(c, { u, T1, GEO });
  const side = J.sideRow(key, { u, k, cR: c.place === 'rule' ? null : c.cR, place: c.place, T1, GEO, cache });
  const st = key in DECL.sats ? satState(T1, GEO, key, { place: c.place, cR: c.cR, k, u }) : { sHat: side._ms.sHat, nHat: side._ms.nHat, local: side._ms.local, bg: side._ms.bg, Om: side._ms.Om };
  const Wm = nrm(st.Om), cr = W.coneRange(st.Om, st.sHat, st.nHat);
  return { key, combo: c.id || null, place: c.place, cR: c.place === 'rule' ? null : c.cR, k, u,
    locOverBg: side.locOverBg, omOverBg: side.omOverBg, omToAxisDeg: side.omToAxisDeg, coneDeg: side.coneDeg,
    spinOm: side.spinOm, relOm: side.relOm, relAx: side.relAx, relOrb: side.relOrb, fMax: side.fMax, noLimit: side.noLimit,
    W: Wm, rateAsYr: Wm * ASYR, periodYr: 2 * Math.PI / Wm / YR, eps0Deg: CC.angDeg(st.sHat, st.nHat),
    wob: { minDeg: cr.oblMinDeg, maxDeg: cr.oblMaxDeg, swingDeg: cr.swingDeg }, omToOrbDeg: cr.alphaDeg,
    _st: st, _side: side };
}
/** 公開の形(内部の _st・_side を落とす) */
export const pub = (r) => { const { _st, _side, ...rest } = r; return rest; };
/** 軸引きずりの方位の率(″/年)を極 pole で —— (g2−)・f 0・応答 1(第353便f の dragRate と同じ作り: 組の Ω で) */
export function dragAz(r, pole, { T1 = E.t1Table(), GEO = E.geometry() } = {}) {
  const st = r._st, pv = pole === 'ecl' ? [0, 0, 1] : pole === 'orb' ? st.nHat : pole === 'L' ? axisL(T1, GEO) : null;
  if (pv === null) throw new RangeError('dragAz: 極は ecl・orb・L');
  const ds = D.precDs(st.sHat, st.Om, { sense: 'g2m' }), q = D.poleRates(pv, st.sHat, ds);
  return q === null ? null : q.az * ASYR;
}
/**
 * 観測の当たり所との並べ(受け手 × 組)。
 *   地球・火星: 家の極の軸引きずり(″/年)・重力の側の列(比べる列 —— DFM の式ではない)・その比・残り(仮の値 − 重力の列 —— 仮・未照合)・残りを埋める c(符号つき)・
 *     地球は月の道を 18.6 年で平均した重力の列(〔第353便m〕の avg)の残りと c も・仮の値の回る向きと同じか(〔第352便j〕の provCompare —— 印つき)。
 *   水星・月・イオ: リポジトリに在る自転の率 ÷ 公転の率(〔第352便q〕の structOf)・傾き ε₀(リポジトリの ŝ と n̂)・合成と公転の極の角。
 */
export function obsRow(key, combo, { u = DECL.uFocus, T1 = E.t1Table(), GEO = E.geometry(), cache = null, fc = {} } = {}) {
  const r = nearState(key, combo, { u, T1, GEO, cache }), base = pub(r);
  if (key === 'Earth' || key === 'Mars') {
    const pole = DECL.homePole[key], d = dragAz(r, pole, { T1, GEO }), fo = { T1, GEO, cache: fc };
    const tide = F.tideRate(key, { pole }, fo).az, srow = F.sumRow(key, { u }, fo), resid = srow.resid, pv = J.provOf(r._side);
    const out = { ...base, kind: 'prec', pole, drag: d, tide, dragOverTide: d / tide, resid, cNeed: resid / d, provSame: pv ? pv.sameSense : null,
      provisional: true, provMark: srow.provMark, provKeys: [...new Set([...(srow.provKeys || []), ...(pv ? pv.provKeys : [])])].sort() };
    if (key === 'Earth') { const g = M.earthGrav({ moon: 'avg' }, fo); out.residAvg = g.resid; out.cNeedAvg = g.resid / d; out.provKeys = [...new Set([...out.provKeys, ...g.provKeys])].sort(); }
    return out;
  }
  const s = Q.structOf(T1, GEO, key);
  return { ...base, kind: 'spin', spinOverOrbit: s.omega / s.n, spinPeriodDay: 2 * Math.PI / s.omega / 86400, orbitPeriodDay: 2 * Math.PI / s.n / 86400 };
}
/**
 * 並びを決める量(8 惑星・源 = 太陽): 金星の距離 ÷ 距離 の 3 乗(第352便v の x の近似)・自分の重み ÷ 源の重み(A0 ÷ wS)・
 * (S) の大きさの倍 g = abs(S_組) ÷ abs(S_規則)・閉じた形の候補 g* = (A0_規則 + wS) ÷ (A0 + wS)(A0 ≫ wS の側の形 —— 候補)・局所 ÷ 背景。
 */
export function orderRow(key, combo, { u = DECL.uFocus, T1 = E.t1Table(), GEO = E.geometry(), cache = null } = {}) {
  if (!DECL.orderRecvs.includes(key)) throw new RangeError('orderRow: 受け手は 8 惑星');
  const c = comboOf(combo, T1, GEO), pl = c.place === 'field' ? 'field' : 'rule', cRv = c.place === 'field' ? c.cR : 1;
  const r0 = CC.sOf(T1, GEO, key, 'Sun', { place: 'rule' }), r1 = CC.sOf(T1, GEO, key, 'Sun', { place: pl, cR: cRv });
  const v0 = CC.sOf(T1, GEO, 'Venus', 'Sun', { place: 'rule' }), aK = K.spinRot(T1, GEO, key, 'Sun', { part: 'S' }).a, aV = K.spinRot(T1, GEO, 'Venus', 'Sun', { part: 'S' }).a;
  const g = nrm(r1.Om) / nrm(r0.Om), gStar = (r0.A0 + r0.wS) / (r1.A0 + r1.wS), st = nearState(key, c, { u, T1, GEO, cache });
  return { key, combo: c.id || null, dRatio3: Math.pow(aV / aK, 3), sRuleOverVenus: nrm(r0.Om) / nrm(v0.Om), selfOverSrc: r1.A0 / r1.wS, g, gStar, gOverStar: g / gStar,
    locOverBg: st.locOverBg, over: st.locOverBg > DECL.sideTol };
}

/* ───────── 零試験 ───────── */
/** 第353便j の表 4(局所 ÷ 背景 —— 組 8)と表 5(円錐 ° —— k 1 + 組 8)の数(文字で持つ)・統括の数え直し 3 の点検の数 */
export const ANCHOR = Object.freeze({
  kRule: '8.22e+11', omegaG: 9.09e-16, axisL: Object.freeze([0.026257, 0.008317, 0.999621]),
  t4: Object.freeze({
    Mercury: Object.freeze(['6.53e+0', '3.73e+1', '2.69e+1', '1.56e+1', '4.20e+0', '1.54e+0', '1.07e+0', '6.53e+0']),
    Earth: Object.freeze(['3.77e-1', '3.24e-1', '3.28e-1', '3.38e-1', '3.81e-1', '4.62e-1', '5.84e-1', '3.77e-1']),
    Mars: Object.freeze(['1.07e-1', '4.52e-1', '4.36e-1', '4.05e-1', '3.11e-1', '2.24e-1', '1.74e-1', '1.07e-1']),
    Moon: Object.freeze(['3.77e-1', '6.82e+0', '4.58e+0', '2.43e+0', '6.17e-1', '2.91e-1', '2.90e-1', '3.77e-1']),
    Io: Object.freeze(['8.94e-1', '1.45e+1', '1.31e+1', '1.07e+1', '5.60e+0', '2.80e+0', '1.61e+0', '8.94e-1']),
  }),
  t5cone: Object.freeze({
    Mercury: Object.freeze(['6.379', '177.384', '178.131', '177.373', '175.608', '164.565', '116.187', '68.720', '177.384']),
    Earth: Object.freeze(['23.009', '23.630', '23.474', '23.502', '23.567', '23.949', '25.414', '32.288', '23.630']),
    Mars: Object.freeze(['25.292', '24.973', '23.114', '23.088', '23.032', '22.779', '22.141', '20.476', '24.973']),
    Moon: Object.freeze(['1.842', '4.721', '175.350', '172.571', '163.130', '34.445', '17.712', '18.564', '4.721']),
    Io: Object.freeze(['3.400', '29.482', '179.779', '179.753', '179.691', '179.348', '178.326', '175.165', '29.482']),
  }),
});
export function pureScenes(T1 = E.t1Table(), GEO = E.geometry()) {
  const cache = {}, rel = (a, b) => Math.abs(a / b - 1), C = comboList(T1, GEO);
  const rows = {};
  for (const key of DECL.recvs) rows[key] = C.map((c) => nearState(key, c, { T1, GEO, cache }));
  const t4 = {}, t5 = {};
  for (const key of DECL.recvs) { t4[key] = rows[key].slice(1).map((r) => Number(r.locOverBg).toExponential(2)); t5[key] = rows[key].map((r) => r.coneDeg.toFixed(3)); }
  // 衛星の状態の作り直し = 第353便j の sideRow(局所 ÷ 背景・円錐)
  const satVs = Math.max(...['Moon', 'Io'].flatMap((key) => rows[key].map((r) => Math.max(rel(nrm(r._st.local) / nrm(r._st.bg), r.locOverBg), rel(CC.angDeg(r._st.sHat, r._st.Om), r.coneDeg)))));
  // 率 = 第353便b の precRate(惑星 —— sideRow の中の mainState)
  const rateVs = Math.max(...['Mercury', 'Earth', 'Mars'].flatMap((key) => rows[key].map((r) => rel(r.W, r._side._ms.precRate.radS))));
  // 傾きを保つ f の上限 = 第353便e の fMaxAt(k 1 と規則の半径の k —— 惑星 3)
  const fmVs = Math.max(...['Mercury', 'Earth', 'Mars'].flatMap((key) => [0, 1].map((i) => rel(rows[key][i].fMax, FE.fMaxAt(key + '|Sun', { k: rows[key][i].k, T1, GEO }).fMax))));
  // 揺れの幅(k 1)= 第353便n の watchRow の coneEps(惑星 3)
  const wobVs = Math.max(...['Mercury', 'Earth', 'Mars'].map((key) => { const w = N.watchRow(key + '|Sun', { years: 100, T1, GEO }).coneEps, r = rows[key][0].wob; return Math.max(rel(r.minDeg, w.minDeg), rel(r.maxDeg, w.maxDeg), rel(r.swingDeg, w.swingDeg)); }));
  // 軸引きずりの方位の率(k 1・規則の半径の k)= 第353便f の dragRate(地球・火星 —— 家の極)
  const fo = { T1, GEO, cache: {} };
  const dragVs = Math.max(...['Earth', 'Mars'].flatMap((key) => [0, 1].map((i) => rel(dragAz(rows[key][i], DECL.homePole[key], { T1, GEO }), F.dragRate(key, { u: 0.98, k: rows[key][i].k }, fo).az))));
  // 並びの閉じた形の候補: A0 ≫ wS の側(木星・土星 c_R ≤ 1e-2)で g ÷ g* が 1 の近く
  const closed = ['Jupiter', 'Saturn'].flatMap((key) => C.filter((c) => c.place === 'field' && c.cR <= 1e-2).map((c) => orderRow(key, c, { T1, GEO, cache }).gOverStar));
  const kr = kOf('rule', { T1, GEO }), ax = axisL(T1, GEO);
  const rej = [() => nearState('Ceres', 'k1'), () => nearState('Earth', 'x'), () => nearState('Earth', 'k1', { u: 0 }), () => orderRow('Moon', 'k1'), () => dragAz(rows.Earth[0], 'eq')]
    .map((g) => { try { g(); return false; } catch (e) { return e instanceof RangeError; } });
  return { t4, t5, satVs, rateVs, fmVs, wobVs, dragVs, closed, kr, ax, omegaG: DECL.omegaG, rejects: rej };
}
export function pureGates(S) {
  const same = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);
  return {
    t4j: DECL.recvs.every((key) => same(S.t4[key], ANCHOR.t4[key])),
    t5j: DECL.recvs.every((key) => same(S.t5[key], ANCHOR.t5cone[key])),
    satSame: S.satVs <= 1e-9,
    rateB: S.rateVs <= 1e-12,
    fMaxE: S.fmVs <= 1e-9,
    wobN: S.wobVs <= 1e-9,
    dragF: S.dragVs <= 1e-9,
    closedLarge: S.closed.length === 6 && S.closed.every((x) => Math.abs(x - 1) <= 1e-2),
    kRule: Number(S.kr).toExponential(2) === ANCHOR.kRule,
    axisL: S.ax.every((x, i) => Math.abs(x - ANCHOR.axisL[i]) <= 1e-6) && S.omegaG === ANCHOR.omegaG,
    rejects: S.rejects.every(Boolean),
  };
}
