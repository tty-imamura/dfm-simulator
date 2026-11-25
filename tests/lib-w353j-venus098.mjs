// 第353便j(原仮定者の回答(2026-11-25 —— 第151報)・統括の検証項目 R474):
//   **金星の条件と注目の列 u = 0.98 を同時に置く道 —— 換算の係数 k × 受け手の半径の係数 c_R の組で「u 0.98 で金星が 2%(5%)以下まで打ち消す」組を数え、
//   その組を全部の受け手に同じに掛けたときの副作用を受け手ごとに並べる純関数 —— 診断だけ**
//   (器 tests/exp-w353j-venus098.mjs と QA behavior.venus098_353j・docs.venus098_353j が読む —— html を読まない・ファイルを読まない・状態を持たない。後のラウンドの枝もこの口を import してよい)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない。
//   既存の lib は呼ぶだけ(本文は変えない): 第353便c(cancelOf・sOf・bandEdge・rateMult —— 受け手の半径の入れ方)・第353便b(mainState —— 主の列の状態)・
//   第353便e(fMaxAt・table3Recv・kVenusAt —— 0.98 の列)・第353便d(obSpec・litOf —— 源の扁平率の σ)・第352便w(fKeep)・第352便za(topicCell・combine)・
//   第352便d(bgVec・precDs・poleRates)・第352bk(spinRot)・第352便j(provCompare —— 仮の値との並べ)・第347便e(t1Table・geometry)。
//   **第353便b と第352便j は仮の値の lib(第352便b)を import する —— この lib を呼ぶ段の正本は最上位に provisional: true と使った鍵の一覧を持つ。**
//
// ■ 語: u = 背景の大きさ ÷ ω_G(背景の向きは (N+) —— 基準軸 L のまま)。局所 = k × (S)(源の自転の分・源は規則の半径)。組 = (入れ方 place・c_R)。
//   place: 'rule' 規則の半径(第352便までの主の形)・'field' (P-場)(場の式の自分の重みと平均の球を c_R × 観測半径)・'resp' (P-応)(応答の側だけ —— 向きと k は規則の半径と同じ・率だけ倍)。
//   金星の条件 = 金星で k × abs(S) = u ω_G(大きさが同じ)。そのときの金星の残り = 2 sin(φ/2)(φ = −S と L のなす角 —— 第353便c の residEqual)。
// ■ 口:
//   kFor(cR, { u = 0.98, place = 'field' }) —— 金星で等大になる k と、金星の φ・残り・等大の倍率 ÷ k。
//   sideRow(key, { u, k, cR, place }) —— 受け手 1 つ: 局所 ÷ 背景・合成 ÷ 背景・合成と L の角・円錐・自転と合成の順逆・傾きを保つ f の上限・(g2−) の回る向き(合成の軸・L・公転の北極)。
//   pairRow(cR, { u, place }) —— 組 1 つ: kFor + 受け手全部の sideRow。topicRow・ioRow —— 題の欄・イオの打ち消し。
// ■ 言わないこと: 係数 k・c_R を決めない。金星の打ち消しが保たれるとも、組が選べたとも書かない(この場・この入れ方・この係数では、の表)。
import * as CC from './lib-w353c-recvradius.mjs';
import * as B from './lib-w353b-maincol.mjs';
import * as FE from './lib-w353e-focus098.mjs';
import * as OB from './lib-w353d-srcoblate.mjs';
import * as W from './lib-w352w-keepcone.mjs';
import * as Z from './lib-w352za-sconseq.mjs';
import * as D from './lib-w352d-precsense.mjs';
import * as K from './lib-w352k-spinform.mjs';
import * as J from './lib-w352j-maintable.mjs';
import * as E from './lib-w347e-spintorque.mjs';

export const LIB_VERSION = 'w353j-venus098-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const { dot, crs, nrm, scl, add, unit } = K.vec;
const D2R = Math.PI / 180, YR = 365.25 * 86400;
export const ASYR = D.ASYR;

/* ───────── 宣言(走らせたノブの格子と物差しの記録 —— 式の形の宣言ではない)───────── */
export const DECL = Object.freeze({
  uFocus: 0.98, omegaG: CC.DECL.omegaG, ageYr: 4.5e9,
  places: Object.freeze(['rule', 'field', 'resp']),
  placeNames: Object.freeze({ rule: '規則の半径(比べる列)', field: '(P-場) 自分の重みと平均の球', resp: '(P-応) 応答の側だけ(k は規則の半径と同じ)' }),
  /** 表 1 の (P-場) の c_R('e2'・'e5' は金星の残り 2%・5% の端 —— 第353便c の bandEdge で数える) */
  cRField: Object.freeze([1e-4, 1e-3, 3e-3, 'e2', 'e5', 0.1]),
  bands: Object.freeze([0.02, 0.05]),
  /** 受け手: 8 惑星 + 太陽 + 衛星 3(源の和) */
  planets: Object.freeze(['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune']),
  sats: Object.freeze({ Moon: Object.freeze(['Sun', 'EarthHi']), Io: Object.freeze(['Sun', 'Jupiter']), Pluto: Object.freeze(['Sun', 'Charon']) }),
  recvs: Object.freeze(['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Sun', 'Moon', 'Io', 'Pluto']),
  /** 副作用の物差し: 局所 ÷ 背景が 0.1 を越える受け手(表 2)・金星とイオの同時の帯(表 3) */
  sideTol: 0.1, ioBands: Object.freeze([0.1, 0.2]),
  crit: FE.DECL.crit,
  /** 題(第352便za の TOPICS から 3 つ —— 土星の環・地球の傾き・公転面の集まり) */
  topics: Object.freeze(['ring', 'tilt', 'plane']),
  judge: '丸めの桁の床: 逐語の表は有効数字 3 桁・打ち消しで 0 になる量は尺度の 1e-12 倍以下を 0 と書く',
});
const sg = (x) => (x > 0 ? 1 : x < 0 ? -1 : 0);
const checkPlace = (place, cR) => {
  if (!DECL.places.includes(place)) throw new RangeError('入れ方は rule・field・resp');
  if (place === 'field' && !(fin(cR) && cR > 0)) throw new RangeError('(P-場) は c_R > 0');
};
/** 場に入る c_R(rule・resp は規則の半径 = null) */
const fieldCR = (place, cR) => (place === 'field' ? cR : null);
let AXL = null;
const axisL = (T1, GEO) => { if (!AXL) AXL = unit(CC.bgUnit('Np', 'L', T1, GEO)); return AXL; };

/* ───────── 約束の口 ───────── */
/** 金星で等大になる k(u・入れ方・c_R): { k, uEqualOverK, phiDeg, residEqual, residMin, rateMult } */
export function kFor(cR, { u = DECL.uFocus, place = 'field', T1 = E.t1Table(), GEO = E.geometry() } = {}) {
  checkPlace(place, cR);
  if (!(fin(u) && u > 0)) throw new RangeError('kFor: u > 0');
  const r = CC.cancelOf(T1, GEO, 'Venus', 'Sun', { place: place === 'field' ? 'field' : 'rule', cR: place === 'field' ? cR : 1 });
  return { place, cR: place === 'rule' ? null : cR, u, k: u / r.uEqualOverK, uEqualOverK: r.uEqualOverK, phiDeg: r.phiDeg, residEqual: r.residEqual, residMin: r.residMin,
    rateMult: place === 'resp' ? CC.rateMult('Venus', { cR, ref: 'rule' }) : null };
}
/** 衛星の局所(源の和 × k)と ŝ・n̂(公転の北極 = 母天体のまわり) */
function satLocal(T1, GEO, id, { place, cR, k }) {
  const srcs = DECL.sats[id];
  let loc = [0, 0, 0];
  for (const s of srcs) loc = add(loc, CC.sOf(T1, GEO, id, s, { place: place === 'field' ? 'field' : 'rule', cR: place === 'field' ? cR : 1 }).Om);
  const R = K.spinRot(T1, GEO, id, srcs[1], { part: 'S' });
  return { local: scl(loc, k), sHat: unit(R.sHat), nHat: unit(R.nHat) };
}
/**
 * 受け手 key(8 惑星・'Sun'・'Moon'・'Io'・'Pluto')の副作用の行(背景 (N+) L × u・局所 k × (S)・入れ方 place・c_R)。
 * 返す: { key, place, cR, k, u, locOverBg, omOverBg, omToAxisDeg, coneDeg, spinOm, relOm, relAx, relOrb, fMax, noLimit, sunRule }
 *   太陽の行は受け手の半径の口が無い(第353便b の mainState —— 規則の半径だけ)ので、どの組でも規則の半径で数える(sunRule: true)。
 */
export function sideRow(key, { u = DECL.uFocus, k = 1, cR = null, place = 'rule', T1 = E.t1Table(), GEO = E.geometry(), cache = null } = {}) {
  checkPlace(place, cR);
  if (!(fin(k) && k >= 0)) throw new RangeError('sideRow: k ≥ 0');
  if (!DECL.recvs.includes(key)) throw new RangeError('sideRow: 受け手は ' + DECL.recvs.join('・'));
  let st;
  if (key in DECL.sats) {
    const L = satLocal(T1, GEO, key, { place, cR, k }), ax = axisL(T1, GEO), bg = D.bgVec('Np', { u, axis: ax }), Om = add(bg, L.local), Wm = nrm(Om), s = L.sHat;
    const ds = D.precDs(s, Om, { sense: 'g2m' }), azOf = (p) => D.poleRates(p, s, ds).az;
    const spinOm = sg(dot(s, Om)), spinAx = sg(dot(s, ax)), spinOrb = sg(dot(s, L.nHat));
    st = { local: L.local, bg, Om, W: Wm, coneDeg: CC.angDeg(s, Om), omToAxisDeg: Math.atan2(nrm(crs(L.local, ax)), dot(Om, ax)) / D2R,
      spinOm, relOm: sg(azOf(unit(Om))) * spinOm, relAx: sg(azOf(ax)) * spinAx, relOrb: sg(azOf(L.nHat)) * spinOrb, sunRule: false };
  } else {
    const m = B.mainState(T1, GEO, key, { u, k, cR: key === 'Sun' ? null : fieldCR(place, cR) }, cache);
    st = { local: m.local, bg: m.bg, Om: m.Om, W: m.W, coneDeg: m.coneDeg, omToAxisDeg: m.omToAxisDeg, spinOm: m.spinOm,
      relOm: m.senseAboutOm ? m.senseAboutOm.rel : null, relAx: m.senseAboutAxis ? m.senseAboutAxis.rel : null, relOrb: m.senseAboutOrb ? m.senseAboutOrb.rel : null, sunRule: key === 'Sun', ms: m };
  }
  const fm = W.fKeep({ thDeg: st.coneDeg, W: st.W, crit: DECL.crit }), wb = nrm(st.bg);
  return { key, place, cR: place === 'rule' ? null : cR, k, u, locOverBg: nrm(st.local) / wb, omOverBg: st.W / wb, omToAxisDeg: st.omToAxisDeg, coneDeg: st.coneDeg,
    spinOm: st.spinOm, relOm: st.relOm, relAx: st.relAx, relOrb: st.relOrb, fMax: fm.fMax, noLimit: fm.noLimit, sunRule: st.sunRule,
    _ms: st.ms || null };
}
/** 仮の値(第352便b —— 第352便j の provCompare)との並べ(地球・火星・金星 —— 印つき): 行の主の列の状態から */
export function provOf(row) {
  if (!row._ms || !['Earth', 'Mars', 'Venus'].includes(row.key)) return null;
  const st = row._ms, cell = { az: { ecl: st.az.ecl, orb: st.az.orb, om: st.az.om, ref: st.az.ax }, orbDeg: st.orbDeg, omAsYr: st.precRate.asYr };
  return J.provCompare(cell, row.key);
}
/** 題の欄(第352便za の物差し —— 単位の係数): 地球の傾き(受け手の半径の口あり —— 地球の局所を組で作り直す)・土星の環と公転面の集まり(輪の受け手 —— 受け手の半径の口なし・k だけ) */
export function topicRow({ u = DECL.uFocus, k = 1, cR = null, place = 'rule', T1 = E.t1Table(), GEO = E.geometry(), cache = {} } = {}) {
  checkPlace(place, cR);
  const b = Z.bgVecOf(T1, GEO, 'NpL', u, cache), Lz = Z.localOf(T1, GEO, 'Earth|Sun', 'Srule', {}, cache);
  const loc = place === 'field' ? scl(CC.sOf(T1, GEO, 'Earth', 'Sun', { place: 'field', cR }).Om, k) : scl(Lz.loc, k);
  const C = Z.combine({ ...Lz, loc }, b), eps = Math.acos(Math.max(-1, Math.min(1, dot(Lz.sHat, Lz.nHat))));
  const tilt = C.perp * DECL.ageYr * YR / eps;
  const ring = Z.topicCell(T1, GEO, 'ring', 'Srule', 'NpL', u, { k }, cache).v, plane = Z.topicCell(T1, GEO, 'plane', 'Srule', 'NpL', u, { k }, cache).v;
  return { place, cR: place === 'rule' ? null : cR, k, u, ring, tilt, plane, recvRadius: { ring: false, tilt: true, plane: false } };
}
/** イオ(源 = 木星 + 太陽)を金星と同じ組で: x = abs(S_イオ←木星) ÷ abs(S_金星←太陽)・イオ自身の等大の残り・金星の k での合成 ÷ 背景・σ(第353便d (O2b) 木星)を母天体由来に掛けた列 */
export function ioRow(cR, { u = DECL.uFocus, place = 'field', T1 = E.t1Table(), GEO = E.geometry() } = {}) {
  const kv = kFor(cR, { u, place, T1, GEO }), pl = place === 'field' ? 'field' : 'rule', c = place === 'field' ? cR : 1;
  const io = CC.cancelOf(T1, GEO, 'Io', 'Jupiter', { place: pl, cR: c }), ven = CC.cancelOf(T1, GEO, 'Venus', 'Sun', { place: pl, cR: c });
  const sJ = CC.sOf(T1, GEO, 'Io', 'Jupiter', { place: pl, cR: c }).Om, sS = CC.sOf(T1, GEO, 'Io', 'Sun', { place: pl, cR: c }).Om;
  const sigma = OB.obSpec({ model: 'O2b', f: OB.litOf('Jupiter').f }).sigma, b = D.bgVec('Np', { u, axis: axisL(T1, GEO) }), wb = nrm(b);
  const tot = (sigJ) => nrm(add(b, scl(add(scl(sJ, sigJ), sS), kv.k))) / wb;
  return { place, cR: place === 'rule' ? null : cR, k: kv.k, venusResid: kv.residEqual, x: io.S / ven.S, ioPhiDeg: io.phiDeg, ioResidEqual: io.residEqual,
    ioTot: tot(1), sigma, xSigma: io.S * sigma / ven.S, ioTotSigma: tot(sigma) };
}
/** 表 1 の組の一覧(c_R の端は bandEdge で数える): [{ id, place, cR }] */
export function combos(T1 = E.t1Table(), GEO = E.geometry()) {
  const edge = (band) => CC.bandEdge(T1, GEO, 'Venus', 'Sun', { place: 'field', band, lo: -3, hi: -1 }).cR;
  const out = [{ id: 'rule', place: 'rule', cR: null }];
  for (const c of DECL.cRField) {
    const cR = c === 'e2' ? edge(0.02) : c === 'e5' ? edge(0.05) : c;
    out.push({ id: typeof c === 'string' ? 'field-' + c : 'field-' + c, place: 'field', cR, edge: typeof c === 'string' ? c : null });
  }
  out.push({ id: 'resp', place: 'resp', cR: 1 });
  return out;
}
/** 組 1 つ: kFor + 受け手全部の sideRow(k 1・規則の半径の行との差つき) */
export function pairRow(combo, { u = DECL.uFocus, T1 = E.t1Table(), GEO = E.geometry(), cache = {} } = {}) {
  const kv = kFor(combo.cR, { u, place: combo.place, T1, GEO });
  const rows = DECL.recvs.map((key) => {
    const r = sideRow(key, { u, k: kv.k, cR: combo.cR, place: combo.place, T1, GEO, cache }), r0 = sideRow(key, { u, k: 1, place: 'rule', T1, GEO, cache });
    const pv = provOf(r), { _ms, ...rest } = r;
    return { ...rest, dConeDeg: r.coneDeg - r0.coneDeg, dAxisDeg: r.omToAxisDeg - r0.omToAxisDeg, fMax0: r0.fMax, relOm0: r0.relOm, relAx0: r0.relAx, relOrb0: r0.relOrb,
      over: r.locOverBg > DECL.sideTol, prov: pv };
  });
  return { combo, kv, rows };
}

/* ───────── 零試験 ───────── */
/** 共通の点検の数(枝 e の k 8.22e11・統括の数え直し 3 の表 —— 文字で持つ) */
export const ANCHOR = Object.freeze({
  kRule: '8.22e+11', omegaG: 9.09e-16, axisL: Object.freeze([0.026257, 0.008317, 0.999621]),
  venus: Object.freeze([
    Object.freeze({ cR: null, uEq: '1.19282e-12', phi: '0.7606', res: '0.013274' }),
    Object.freeze({ cR: 1e-3, uEq: '1.61699e-7', phi: '0.7509', res: '0.013106' }),
    Object.freeze({ cR: 1e-2, uEq: '1.16430e-6', phi: '0.9910', res: '0.017295' }),
    Object.freeze({ cR: 0.1, uEq: '1.87673e-6', phi: '7.580', res: '0.13219' }),
    Object.freeze({ cR: 0.3, uEq: '1.11483e-6', phi: '21.65', res: '0.37565' }),
    Object.freeze({ cR: 1, uEq: '6.45938e-7', phi: '52.06', res: '0.87772' }),
  ]),
  edges: Object.freeze({ e2: '0.0128', e5: '0.0373' }),
});
export function pureScenes(T1 = E.t1Table(), GEO = E.geometry()) {
  const cache = {}, rel = (a, b) => Math.abs(a / b - 1);
  const kr = kFor(null, { place: 'rule', T1, GEO }), kE = FE.kVenusAt(0.98, T1, GEO, {});
  const venus = ANCHOR.venus.map((a) => { const r = kFor(a.cR === null ? null : a.cR, { place: a.cR === null ? 'rule' : 'field', T1, GEO }); return { uEq: r.uEqualOverK, phi: r.phiDeg, res: r.residEqual, k: r.k }; });
  // 枝 e の table3Recv(k = 金星で等大・規則の半径・(N+) 0.98)と同じ: 8 惑星の局所 ÷ 背景・円錐・f の上限
  const t3 = FE.table3Recv(T1, GEO, {}).filter((r) => r.k !== 1 && r.key !== 'Sun|-');
  const vsE = Math.max(...t3.map((r) => { const id = r.key.split('|')[0], s = sideRow(id, { k: r.k, place: 'rule', T1, GEO, cache }); return Math.max(rel(s.locOverBg, r.locOverBg), rel(s.coneDeg, r.thDeg), rel(s.fMax, r.fMax)); }));
  // 枝 e の fMaxAt(k 1・規則の半径)と同じ
  const vsF = Math.max(...DECL.planets.map((id) => rel(sideRow(id, { k: 1, T1, GEO, cache }).fMax, FE.fMaxAt(id + '|Sun', { T1, GEO }).fMax)));
  // (P-応) の向き・k は規則の半径と同じ・(P-場) は枝 c の sOf の口と同じ(mainState 経由)
  const kp = kFor(1, { place: 'resp', T1, GEO }), vsResp = rel(kp.k, kr.k);
  const sF = sideRow('Earth', { k: 3, cR: 0.01, place: 'field', T1, GEO, cache }), sC = CC.sOf(T1, GEO, 'Earth', 'Sun', { place: 'field', cR: 0.01 }).Om;
  const vsC = rel(sF.locOverBg, 3 * nrm(sC) / (0.98 * DECL.omegaG));
  // 衛星の局所(規則の半径・源の和)= 第352便za の localOf(イオ ← 木星 + 太陽・月 ← 地球 + 太陽)
  const satZ = [['Io', 'Io|Jupiter'], ['Moon', 'Moon|EarthHi']].map(([id, zk]) => { const a = satLocal(T1, GEO, id, { place: 'rule', cR: 1, k: 1 }).local, b = Z.localOf(T1, GEO, zk, 'Srule', {}, {}).loc; return nrm(add(a, scl(b, -1))) / nrm(b); });
  // 題の欄(規則の半径)= 第352便za の topicCell(地球の傾き)
  const tk = 7e10, tr = topicRow({ k: tk, place: 'rule', T1, GEO }), tz = Z.topicCell(T1, GEO, 'tilt', 'Srule', 'NpL', 0.98, { k: tk }, {}).v;
  // 金星の等大の点で、合成 ÷ 背景(直接)= 2 sin(φ/2)(閉じた形)
  const vEq = sideRow('Venus', { k: kr.k, place: 'rule', T1, GEO, cache });
  const ax = axisL(T1, GEO);
  const rej = [() => kFor(0, { place: 'field' }), () => kFor(1, { place: 'x' }), () => sideRow('Ceres'), () => sideRow('Earth', { k: -1 }), () => kFor(1e-2, { u: 0 })]
    .map((g) => { try { g(); return false; } catch (e) { return e instanceof RangeError; } });
  return { kr: kr.k, kE, venus, vsE, vsF, vsResp, vsC, satZ, tilt: [tr.tilt, tz], vEq: [vEq.omOverBg, kr.residEqual], ax, omegaG: DECL.omegaG, rejects: rej };
}
export function pureGates(S) {
  const p = (x, n) => Number(x).toPrecision(n);
  return {
    kRule: Number(S.kr).toExponential(2) === ANCHOR.kRule && Math.abs(S.kr / S.kE - 1) <= 1e-9,
    venus6: S.venus.length === 6 && S.venus.every((r, i) => { const a = ANCHOR.venus[i]; return p(r.uEq, 6) === Number(a.uEq).toPrecision(6) && p(r.phi, 4) === a.phi && p(r.res, 5) === a.res && Math.abs(r.k * r.uEq / 0.98 - 1) <= 1e-12; }),
    sameAsE: S.vsE <= 1e-9,
    fMaxE: S.vsF <= 1e-9,
    respK: S.vsResp <= 1e-12,
    fieldC: S.vsC <= 1e-9,
    satZ: S.satZ.every((x) => x <= 1e-7),   // 床 1e-7: 第352便s の satParts は太陽由来の分を別の作りで数える(イオで太陽由来は合成の 3e-3 —— その分の差 2e-8)
    tiltZ: Math.abs(S.tilt[0] / S.tilt[1] - 1) <= 1e-9,
    venusEq: Math.abs(S.vEq[0] / S.vEq[1] - 1) <= 1e-6,
    axisL: S.ax.every((x, i) => Math.abs(x - ANCHOR.axisL[i]) <= 1e-6) && S.omegaG === ANCHOR.omegaG,
    rejects: S.rejects.every(Boolean),
  };
}
