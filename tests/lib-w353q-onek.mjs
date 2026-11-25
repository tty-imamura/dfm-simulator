// 第353便q(原仮定者の回答(2026-11-25 —— 第151報)・統括の検証項目 R481):
//   **1 つの換算の係数で全部の題を並べる —— 注目の列 u = 0.98 で金星を打ち消す換算の係数 k(局所の項だけに掛ける)を、置き方の組ごとに 1 つ置き、
//   同じ k を土星の環・公転面の集まり・衛星・歳差の率の残り・地球の傾き・イオの内部熱と潮汐ロック・水星の合成の向きに掛けたときの「値 ÷ 物差し」を並べる純関数 —— 診断だけ**
//   (器 tests/exp-w353q-onek.mjs と QA behavior.onek353q・docs.onek353q が読む —— html を読まない・ファイルを読まない・状態を持たない。後のラウンドの枝もこの口を import してよい)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない。
//   既存の lib は呼ぶだけ(本文は変えない): 第353便j(kFor・sideRow・ioRow・topicRow —— 金星の k と副作用)・第353便k(axStd・diskStd・planeStd —— 回答の基準の輪)・
//   第353便h(axialRow —— 軸引きずりの (S) の輪)・第353便c(sOf・bandEdge・rateMult・bgUnit・angDeg —— 受け手の半径の入れ方)・第353便d(obSpec・litOf —— σ)・
//   第353便f(dragRate・sumRow・axesOf・poleVec・project・bgOf —— 歳差の率)・第353便m(earthGrav・cRow —— 月の道の平均の列の残り)・第353便e(DECL.crit)・
//   第352便w(fKeep)・第352便za(localOf・combine・heatOf・topicCell・LIT)・第352便d(r3Ds)・第351便d(r3Coeffs)・第351便c(perpOf)・第351便f(satInput・tideOf)・第347便e(t1Table・geometry)。
//   **第353便j・f・m は仮の値の lib(第352便b)を import する —— この lib を呼ぶ段の正本は最上位に provisional: true と使った鍵の一覧を持つ。**
//
// ■ 語: u = 背景の大きさ ÷ ω_G(背景の向きは (N+) —— 基準軸 L)。局所 = k × σ × (S)(源の自転の分・源は規則の半径)。**k は局所の項だけに掛かる(背景には掛けない)。**
//   組(SETS): 'rule' 規則の半径/'f1e-4'・'f1e-3'・'fe2'((P-場) c_R 1e-4・1e-3・金星 2% の端 0.0128)/'resp' (P-応)(向きと k は規則の半径と同じ・応答の側の率だけ倍)/
//   'ruleSig' 規則の半径 + 源の扁平の倍 σ((O2b) σ = (1 − f)^(−2/3) —— 源ごとに掛ける)。
//   kVenus(組) = 金星で k × abs(σ_太陽 × (S)) = u ω_G になる k(第353便j の kFor ÷ σ_太陽)。
//   題(TOPICS): 値 = (k を掛けた局所の量)÷ 物差し。物差しは文献の値・未照合・比べる列(合わせない)。「物差しの桁」= 0.1〜10 の内。
// ■ 口:
//   kVenus(set) —— 組の k と金星の残り。topicAt(topic, set) —— 題 1 つの { v(主の値), vComp(背景を含む合成の値 —— 在れば), kReq(値 1 になる k), ratio(kReq ÷ kVenus), … }。
//   table1()・table2()・table3() —— 器の表。
// ■ 言わないこと: 係数が決まった・環が説明できた・計算が合った、と書かない(同じ k を掛けたときの桁の表)。重力の側の潮汐のトルクの列は「比べる列(DFM の式ではない)」。
import * as J from './lib-w353j-venus098.mjs';
import * as KR from './lib-w353k-ringstd.mjs';
import * as H from './lib-w353h-ringdisk.mjs';
import * as CC from './lib-w353c-recvradius.mjs';
import * as OB from './lib-w353d-srcoblate.mjs';
import * as F from './lib-w353f-ratesum.mjs';
import * as M from './lib-w353m-residsign.mjs';
import * as FE from './lib-w353e-focus098.mjs';
import * as W from './lib-w352w-keepcone.mjs';
import * as Z from './lib-w352za-sconseq.mjs';
import * as D from './lib-w352d-precsense.mjs';
import * as R3 from './lib-w351d-r3step.mjs';
import * as SP from './lib-w351c-srcparts.mjs';
import * as FS from './lib-w351f-satlock.mjs';
import * as K from './lib-w352k-spinform.mjs';
import * as E from './lib-w347e-spintorque.mjs';

export const LIB_VERSION = 'w353q-onek-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const { dot, crs, nrm, scl, add, unit } = K.vec;
const D2R = Math.PI / 180, YR = 365.25 * 86400;
export const ASYR = D.ASYR;

/* ───────── 宣言(走らせたノブの格子と物差しの記録 —— 式の形の宣言ではない)───────── */
export const SETS = Object.freeze([
  Object.freeze({ id: 'rule', place: 'rule', cR: null, sig: false, label: '規則の半径' }),
  Object.freeze({ id: 'f1e-4', place: 'field', cR: 1e-4, sig: false, label: '(P-場) c_R 1e-4' }),
  Object.freeze({ id: 'f1e-3', place: 'field', cR: 1e-3, sig: false, label: '(P-場) c_R 1e-3' }),
  Object.freeze({ id: 'fe2', place: 'field', cR: 'e2', sig: false, label: '(P-場) c_R 0.0128(金星 2% の端)' }),
  Object.freeze({ id: 'resp', place: 'resp', cR: 1, sig: false, label: '(P-応)(k は規則の半径と同じ)' }),
  Object.freeze({ id: 'ruleSig', place: 'rule', cR: null, sig: true, label: '規則の半径 + 源の扁平の倍 σ((O2b))' }),
]);
export const TOPICS = Object.freeze([
  Object.freeze({ id: 'ringAx', label: '土星の環(軸引きずりの (S) の作り (F1))', ruler: '環の物差しの率(1e7 年で e 分の 1 —— 文献の値・未照合)', pow: 1, src: '〔第353便h〕〔第353便k〕' }),
  Object.freeze({ id: 'ringDisk', label: '土星の環(円盤引きずりの側の作り (F2))', ruler: '環の物差しの率(同上)', pow: 1, src: '〔第353便k〕' }),
  Object.freeze({ id: 'plane', label: '公転面の集まり(地球の道の輪)', ruler: '30° → 7° の 23°', pow: 1, src: '〔第353便k〕〔第352便za〕' }),
  Object.freeze({ id: 'io', label: 'イオの局所 ÷ 背景(打ち消しの条件 = 1)', ruler: '背景の大きさ(局所 ÷ 背景 = 1 で等大)', pow: 1, src: '〔第353便j〕〔第353便p〕' }),
  Object.freeze({ id: 'moon', label: '月の局所 ÷ 背景', ruler: '背景の大きさ', pow: 1, src: '〔第353便j〕' }),
  Object.freeze({ id: 'mercury', label: '水星の局所 ÷ 背景(合成の向き)', ruler: '背景の大きさ', pow: 1, src: '〔第353便j〕' }),
  Object.freeze({ id: 'precEarth', label: '地球の歳差の率の残り(月の道の 18.6 年の平均の列)', ruler: '残り(仮の値 − 重力の側の列 —— 仮・未照合)', pow: null, src: '〔第353便m〕' }),
  Object.freeze({ id: 'precMars', label: '火星の歳差の率の残り', ruler: '残り(仮の値 − 重力の側の列 —— 仮・未照合)', pow: null, src: '〔第353便f〕〔第353便m〕' }),
  Object.freeze({ id: 'tilt', label: '地球の傾き(年齢の間に動き得る角 ÷ いまの傾き)', ruler: 'いまの傾き', pow: 1, src: '〔第352便za〕〔第353便e〕' }),
  Object.freeze({ id: 'ioHeat', label: 'イオの内部熱((P1))', ruler: '熱の物差し(文献の値・未照合)', pow: 2, src: '〔第352便za〕' }),
  Object.freeze({ id: 'ioLock', label: '潮汐ロック(イオ —— 軸引きずりの直交成分のトルク ÷ 潮汐のトルク)', ruler: '潮汐のトルク(比べる列(DFM の式ではない))', pow: 1, src: '〔第352便za〕' }),
]);
export const DECL = Object.freeze({
  uFocus: 0.98, omegaG: CC.DECL.omegaG, ageYr: 4.5e9, band: Object.freeze({ lo: 0.1, hi: 10 }),
  sets: Object.freeze(SETS.map((s) => s.id)), topics: Object.freeze(TOPICS.map((t) => t.id)),
  rings: KR.DECL.centers, ringMain: 'ringB',
  /** 環の粒子(受け手の半径を当てる列): 大きさ 1 m(第353便k の表 1 の代表 —— ノブ(値は未照合))・c_R は組の c_R(規則の半径の組では 1) */
  particleA: 1,
  /** 衛星の源 */
  sats: Object.freeze({ Moon: Object.freeze(['Sun', 'EarthHi']), Io: Object.freeze(['Sun', 'Jupiter']) }),
  /** 副作用の受け手(表 3 —— 第353便j の表 2 と同じ物差し: 局所 ÷ 背景 > 0.1) */
  sideRecvs: Object.freeze(['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Moon', 'Io']), sideTol: 0.1,
  crit: FE.DECL.crit,
  /** 要る k の走査(歳差の率 —— 線形でない題):log10 k の範囲と点の数 */
  kScan: Object.freeze({ lo: 0, hi: 16, n: 161 }),
  judge: '丸めの桁の床: 逐語の表は有効数字 3 桁・零試験は相対 1e-9 の床(第353便j の衛星の局所は 1e-7)',
});
const OBSRC = Object.freeze({ EarthHi: 'Earth' });
/** 源の扁平の倍 σ((O2b) —— 第353便d の obSpec・扁平率は litOf のリポジトリの数。数が無い源は 1) */
export function sigmaOf(src) {
  const f = OB.litOf(OBSRC[src] || src).f;
  return fin(f) ? OB.obSpec({ model: 'O2b', f }).sigma : 1;
}
export const setOf = (id) => { const s = SETS.find((x) => x.id === id); if (!s) throw new RangeError('setOf: 組は ' + DECL.sets.join('・')); return s; };
const CACHE = { edge: null, kv: {}, ax: null };
const ctx = (o = {}) => F.ctxOf(o);
/** 組の c_R の数('e2' は第353便c の bandEdge —— 金星の残り 2% の端) */
export function cROf(set, o = {}) {
  const s = typeof set === 'string' ? setOf(set) : set;
  if (s.cR !== 'e2') return s.cR;
  if (CACHE.edge === null) { const C = ctx(o); CACHE.edge = CC.bandEdge(C.T1, C.GEO, 'Venus', 'Sun', { place: 'field', band: 0.02, lo: -3, hi: -1 }).cR; }
  return CACHE.edge;
}
const axisL = (o = {}) => { if (!CACHE.ax) { const C = ctx(o); CACHE.ax = unit(CC.bgUnit('Np', 'L', C.T1, C.GEO)); } return CACHE.ax; };
const bgV = (u, o) => D.bgVec('Np', { u, axis: axisL(o) });
const sOpt = (s, o) => (s.place === 'field' ? { place: 'field', cR: cROf(s, o) } : { place: 'rule', cR: 1 });

/* ───────── 約束の口 ───────── */
/** 組の k(金星で等大 —— 第353便j の kFor ÷ σ_太陽): { set, place, cR, k, kJ, sigSun, residEqual, phiDeg } */
export function kVenus(set, { u = DECL.uFocus } = {}, o = {}) {
  const s = typeof set === 'string' ? setOf(set) : set, ck = s.id + '|' + u;
  if (CACHE.kv[ck]) return CACHE.kv[ck];
  const C = ctx(o), cR = cROf(s, o), kv = J.kFor(s.place === 'field' ? cR : (s.place === 'resp' ? 1 : null), { u, place: s.place, T1: C.T1, GEO: C.GEO });
  const sig = s.sig ? sigmaOf('Sun') : 1;
  const r = Object.freeze({ set: s.id, place: s.place, cR: s.place === 'field' ? cR : null, sig: s.sig, u, k: kv.k / sig, kJ: kv.k, sigSun: sig, residEqual: kv.residEqual, phiDeg: kv.phiDeg });
  CACHE.kv[ck] = r; return r;
}
/** 受け手 id の局所の単位(k 1 —— σ を組に応じて源ごとに掛けた (S) の和 —— rad/s)と ŝ・n̂ */
export function localUnit(id, set, o = {}) {
  const s = typeof set === 'string' ? setOf(set) : set, C = ctx(o), ck = 'q|lu|' + id + '|' + s.id;
  if (C.cache[ck]) return C.cache[ck];
  const srcs = DECL.sats[id] || ['Sun'], op = sOpt(s, o);
  let loc = [0, 0, 0];
  for (const src of srcs) loc = add(loc, scl(CC.sOf(C.T1, C.GEO, id, src, op).Om, s.sig ? sigmaOf(src) : 1));
  const R = K.spinRot(C.T1, C.GEO, id, srcs[srcs.length - 1], { part: 'S' });
  const v = { loc, sHat: unit(R.sHat), nHat: unit(R.nHat) }; C.cache[ck] = v; return v;
}
/** 受け手 id の副作用(局所 ÷ 背景・合成 ÷ 背景・合成と L の角): k を指定(省けば組の kVenus) */
export function sideOf(id, set, { u = DECL.uFocus, k = null } = {}, o = {}) {
  const s = typeof set === 'string' ? setOf(set) : set, kk = k === null ? kVenus(s, { u }, o).k : k, Lu = localUnit(id, s, o), ax = axisL(o), b = bgV(u, o), wb = nrm(b);
  const loc = scl(Lu.loc, kk), Om = add(b, loc);
  return { id, set: s.id, k: kk, locOverBg: nrm(loc) / wb, omOverBg: nrm(Om) / wb, omToAxisDeg: Math.atan2(nrm(crs(loc, ax)), dot(Om, ax)) / D2R, coneDeg: CC.angDeg(Lu.sHat, Om), spinOm: Math.sign(dot(Lu.sHat, Om)) };
}
/** 輪(土星の環 1 区分)の値 ÷ 物差し(k 1・σ つき): frame 'F1'(軸引きずりの (S) の作り)・'F2'(円盤引きずりの側の作り)× 受け手 'rule' | 'obs'(粒子 1 m × c_R) */
export function ringUnit(key, set, { frame = 'F1', recv = null } = {}, o = {}) {
  const s = typeof set === 'string' ? setOf(set) : set, C = ctx(o), rk = recv || (s.place === 'field' ? 'obs' : 'rule');
  const cR = s.place === 'field' ? cROf(s, o) : 1, rv = rk === 'rule' ? { kind: 'rule' } : { kind: 'obs', a: DECL.particleA, cR }, ob = s.sig ? 'O2b' : 'O0';
  const ck = ['q|ring', key, frame, rk, cR, ob].join('|');
  if (C.cache[ck] !== undefined) return C.cache[ck];
  const y = frame === 'F1' ? KR.axStd(C.T1, C.GEO, key, { src: 'rule', ob, recv: rv }).yard : KR.diskStd(key, { src: 'rule', ob, recv: rv }).yard;
  C.cache[ck] = y; return y;
}
/** 公転面の集まり(地球の道の輪 —— 第353便k の planeStd・受け手は組で: 規則の半径 | 地球 × c_R)の k 1 の値 */
export function planeUnit(set, { id = 'Earth' } = {}, o = {}) {
  const s = typeof set === 'string' ? setOf(set) : set, C = ctx(o);
  const v = KR.planeStd(C.T1, C.GEO, id, { src: 'rule', ob: s.sig ? 'O2b' : 'O0', recv: s.place === 'field' ? { cR: cROf(s, o) } : 'rule' }).v;
  return v;
}
/** 軸引きずりの方位の率(″/年 —— 経路 ② (g2−)・c 1・f 0・極 pole)を、組の局所(k × 単位)と背景 u で */
export function dragAz(id, set, { u = DECL.uFocus, k = 1, pole = null } = {}, o = {}) {
  const s = typeof set === 'string' ? setOf(set) : set, Lu = localUnit(id, s, o), ax = F.axesOf(id, o), Om = add(F.bgOf({ u }, o), scl(Lu.loc, k));
  const cf = R3.r3Coeffs(0, 'N1'), ds = D.r3Ds(ax.sHat, Om, { sense: 'g2m', kTilt: cf.kTilt, kPrec: cf.kPrec });
  const pr = F.project(F.poleVec(id, pole || F.DECL.homePole[id], { om: Om }, o), ax.sHat, ds);
  const mult = s.place === 'resp' ? CC.rateMult(id, { cR: 1, ref: 'rule' }) : 1;
  return pr.az * mult;
}
/** 歳差の率の残り(仮の値 − 重力の側の列 —— 仮・未照合の印つき): 地球は月の道の 18.6 年の平均('avg')・火星は第353便f の sumRow */
let RESID = null;
export function residOf(o = {}) {
  if (RESID) return RESID;
  const e = M.earthGrav({ moon: 'avg' }, o), m = F.sumRow('Mars', { u: DECL.uFocus }, o);
  RESID = Object.freeze({ Earth: e.resid, Mars: m.resid, provKeys: Object.freeze([...new Set([...(e.provKeys || []), ...(m.provKeys || [])])]) });
  return RESID;
}
/** 地球の傾き・イオの内部熱・潮汐ロックの局所の量(第352便za の topicCell と同じ式 —— 局所を組で作り直す)。bgU = 背景の倍率(0 なら局所だけ) */
function zaTopic(topic, set, k, bgU, o) {
  const s = typeof set === 'string' ? setOf(set) : set, C = ctx(o), b = bgV(bgU, o);
  if (topic === 'tilt') {
    const Lz = Z.localOf(C.T1, C.GEO, 'Earth|Sun', 'Srule', {}, C.cache), Lu = localUnit('Earth', s, o), Cm = Z.combine({ ...Lz, loc: scl(Lu.loc, k) }, b);
    const eps = Math.acos(Math.max(-1, Math.min(1, dot(Lz.sHat, Lz.nHat))));
    const fm = W.fKeep({ thDeg: CC.angDeg(Lz.sHat, Cm.Om), W: Cm.om, crit: DECL.crit });
    return { v: Cm.perp * DECL.ageYr * YR / eps, fMax: fm.fMax, noLimit: fm.noLimit };
  }
  const Lz = Z.localOf(C.T1, C.GEO, 'Io|Jupiter', 'Srule', {}, C.cache), Lu = localUnit('Io', s, o), Cm = Z.combine({ ...Lz, loc: scl(Lu.loc, k) }, b);
  if (topic === 'ioHeat') { const raw = Z.heatOf(Lz, Cm.perp).P1; return { v: raw / Z.LIT.heat.Io, raw }; }
  const Si = FS.satInput(C.T1, C.GEO, 'Io', 'Jupiter'), Tq = FS.tideOf('Io');
  return { v: Tq.I * Si.wSpin * Cm.perp / Tq.Ntide };
}
/** 線形でない題の要る k(値の大きさ 1 —— log k の走査 + 二分): 無ければ null */
function kReqScan(fv) {
  const { lo, hi, n } = DECL.kScan; let pk = lo, pv = Math.log(Math.abs(fv(Math.pow(10, lo))));
  for (let i = 1; i < n; i++) {
    const lk = lo + (hi - lo) * i / (n - 1), lv = Math.log(Math.abs(fv(Math.pow(10, lk))));
    if (fin(pv) && fin(lv) && Math.sign(pv) !== Math.sign(lv)) {
      let a = pk, b2 = lk, fa = pv;
      for (let j = 0; j < 60; j++) { const m = 0.5 * (a + b2), fm = Math.log(Math.abs(fv(Math.pow(10, m)))); if (Math.sign(fm) === Math.sign(fa)) { a = m; fa = fm; } else b2 = m; }
      return Math.pow(10, 0.5 * (a + b2));
    }
    pk = lk; pv = lv;
  }
  return null;
}
/**
 * 題 topic × 組 set: { topic, set, k, v(主の値 = k を掛けた局所の量 ÷ 物差し —— 歳差の率は合成の率 ÷ 残り〔= 1 ÷ 要る c〕), vComp(背景を含む値 —— 在れば),
 *   unit(k 1 の値), kReq(値 1 になる k), ratio(kReq ÷ kVenus), inBand, …(題ごとの添え)}
 */
export function topicAt(topic, set, { u = DECL.uFocus, key = DECL.ringMain, recv = null } = {}, o = {}) {
  const s = typeof set === 'string' ? setOf(set) : set, T = TOPICS.find((t) => t.id === topic);
  if (!T) throw new RangeError('topicAt: 題は ' + DECL.topics.join('・'));
  const kv = kVenus(s, { u }, o), k = kv.k, C = ctx(o), wb = nrm(bgV(u, o));
  let unit1 = null, v = null, vComp = null, extra = {}, kReq = null;
  if (topic === 'ringAx' || topic === 'ringDisk') {
    unit1 = ringUnit(key, s, { frame: topic === 'ringAx' ? 'F1' : 'F2', recv }, o); v = k * unit1;
    if (topic === 'ringAx' && recv === null && s.place !== 'field') vComp = Z.topicCell(C.T1, C.GEO, 'ring', 'Srule', 'NpL', u, { k: k * (s.sig ? sigmaOf('Saturn') : 1) }, C.cache).v;
    extra = { key, recv: recv || (s.place === 'field' ? 'obs' : 'rule') };
  } else if (topic === 'plane') { unit1 = planeUnit(s, {}, o); v = k * unit1; vComp = v; extra = { note: '背景 (N+) L は輪の法線に平行 —— 合成 = 局所' }; }
  else if (topic === 'io' || topic === 'moon' || topic === 'mercury') {
    const id = { io: 'Io', moon: 'Moon', mercury: 'Mercury' }[topic], sd = sideOf(id, s, { u, k }, o);
    unit1 = nrm(localUnit(id, s, o).loc) / wb; v = sd.locOverBg; vComp = sd.omOverBg; extra = { omToAxisDeg: sd.omToAxisDeg, coneDeg: sd.coneDeg, spinOm: sd.spinOm };
  } else if (topic === 'precEarth' || topic === 'precMars') {
    const id = topic === 'precEarth' ? 'Earth' : 'Mars', R = residOf(o)[id], f = (kk) => dragAz(id, s, { u, k: kk }, o) / R;
    unit1 = f(1); v = f(k); vComp = v; kReq = kReqScan(f);
    const d0 = f(0);
    extra = { resid: R, cNeed: 1 / v, cNeed1: 1 / unit1, cNeedBg: 1 / d0, fill: v > 0, provisional: true, provKeys: residOf(o).provKeys };
  } else if (topic === 'tilt' || topic === 'ioHeat' || topic === 'ioLock') {
    const a = zaTopic(topic, s, k, 0, o), b = zaTopic(topic, s, k, u, o); unit1 = zaTopic(topic, s, 1, 0, o).v; v = a.v; vComp = b.v;
    if (topic === 'tilt') extra = { fMax: b.fMax, noLimit: b.noLimit, fMax1: zaTopic('tilt', s, 1, u, o).fMax };
  }
  if (kReq === null && T.pow !== null && fin(unit1) && unit1 > 0) kReq = Math.pow(1 / unit1, 1 / T.pow);
  const av = Math.abs(v);
  return { topic, set: s.id, k, unit: unit1, v, vComp, kReq, ratio: fin(kReq) ? kReq / k : null, inBand: fin(av) && av >= DECL.band.lo && av <= DECL.band.hi, ...extra };
}

/* ───────── 表 ───────── */
/** 表 1: 題 × 組(主の値・合成の値・物差しの桁の数) */
export function table1({ u = DECL.uFocus } = {}, o = {}) {
  const ks = SETS.map((s) => kVenus(s, { u }, o));
  const rows = TOPICS.map((t) => ({ topic: t.id, cells: SETS.map((s) => topicAt(t.id, s, { u }, o)) }));
  const count = SETS.map((s, i) => rows.filter((r) => r.cells[i].inBand).length);
  return { ks, rows, count };
}
/** 表 2: 環の要る k ÷ 金星の k(区分 5 × 作り 2 × 受け手の半径を当てる/当てない)と、題ごとの比 */
export function table2({ u = DECL.uFocus } = {}, o = {}) {
  const ring = [];
  for (const key of DECL.rings) for (const frame of ['F1', 'F2']) for (const recv of ['rule', 'obs']) {
    ring.push({ key, frame, recv, cells: SETS.map((s) => { const r = topicAt(frame === 'F1' ? 'ringAx' : 'ringDisk', s, { u, key, recv }, o); return { set: s.id, v: r.v, kReq: r.kReq, ratio: r.ratio }; }) });
  }
  const best = (cells) => cells.reduce((b, c) => (fin(c.ratio) && (b === null || Math.abs(Math.log10(c.ratio)) < Math.abs(Math.log10(b.ratio))) ? c : b), null);
  return { ring: ring.map((r) => ({ ...r, best: best(r.cells) })) };
}
/** 表 3: 同じ k で物差しを 10 倍以上越える題・1/10 に届かない題・副作用の受け手(局所 ÷ 背景 > 0.1) */
export function table3({ u = DECL.uFocus } = {}, o = {}) {
  const t1 = table1({ u }, o);
  return SETS.map((s, i) => {
    const over = [], under = [], within = [];
    for (const r of t1.rows) { const c = r.cells[i], av = Math.abs(c.v); (av > DECL.band.hi ? over : av < DECL.band.lo ? under : within).push(r.topic); }
    const side = DECL.sideRecvs.filter((id) => id !== 'Venus' && sideOf(id, s, { u }, o).locOverBg > DECL.sideTol);
    return { set: s.id, over, under, within, side };
  });
}

/* ───────── 零試験 ───────── */
/** 比べる数(第353便j の k の表・第353便h と第353便k の環の数・第353便m の要る c —— 文字で持つ) */
export const ANCHOR = Object.freeze({
  k: Object.freeze({ rule: '8.22e+11', 'f1e-4': '5.85e+7', fe2: '7.21e+5' }),
  ringAxRule: Object.freeze(['1.04e-13', '8.09e-13']), ringDiskStd: Object.freeze(['6.59e-6', '2.59e-5']),
  cNeed: Object.freeze({ Earth: '29.0', Mars: '24.4' }),
  axisL: Object.freeze([0.026257, 0.008317, 0.999621]), omegaG: 9.09e-16,
});
export function pureScenes(T1 = E.t1Table(), GEO = E.geometry()) {
  const o = { T1, GEO, cache: {} }, rel = (a, b) => Math.abs(a / b - 1);
  // ① 組の k = 第353便j の kFor(規則・(P-場) 1e-4・1e-3・端・(P-応))
  const kQ = Object.fromEntries(SETS.map((s) => [s.id, kVenus(s, {}, o).k]));
  const kJ = { rule: J.kFor(null, { place: 'rule', T1, GEO }).k, 'f1e-4': J.kFor(1e-4, { T1, GEO }).k, 'f1e-3': J.kFor(1e-3, { T1, GEO }).k, fe2: J.kFor(cROf('fe2', o), { T1, GEO }).k, resp: J.kFor(1, { place: 'resp', T1, GEO }).k };
  const vsKJ = Math.max(...Object.keys(kJ).map((id) => rel(kQ[id], kJ[id])));
  // ② 副作用(局所 ÷ 背景・合成と L の角・円錐)= 第353便j の sideRow(規則の半径と (P-場) 1e-3 の k で)
  const vsSide = Math.max(...['rule', 'f1e-3'].flatMap((id) => { const s = setOf(id), kk = kQ[id]; return ['Mercury', 'Earth', 'Mars', 'Jupiter', 'Moon', 'Io'].map((rid) => {
    const a = sideOf(rid, s, { k: kk }, o), b = J.sideRow(rid, { k: kk, cR: s.place === 'field' ? s.cR : null, place: s.place, T1, GEO, cache: o.cache });
    return Math.max(rel(a.locOverBg, b.locOverBg), rel(a.omOverBg, b.omOverBg), Math.abs(a.omToAxisDeg - b.omToAxisDeg) / 180, rel(a.coneDeg, b.coneDeg)); }); }));
  // ③ 環: 軸引きずり (S)・規則の半径の受け手 = 第353便h の axialRow(tSrc 0)・回答の基準の円盤引きずりの側 = 第353便k の t1Row の stdO0F2
  const ringH = DECL.rings.map((key) => rel(ringUnit(key, 'rule', { frame: 'F1', recv: 'rule' }, o), H.axialRow(T1, GEO, key, { tSrc: 0 }).yard));
  const ringK = DECL.rings.map((key) => rel(ringUnit(key, 'resp', { frame: 'F2', recv: 'obs' }, o), KR.t1Row(T1, GEO, key).yard.stdO0F2));
  const ringAx = DECL.rings.map((key) => ringUnit(key, 'rule', { frame: 'F1', recv: 'rule' }, o)), ringDisk = DECL.rings.map((key) => ringUnit(key, 'rule', { frame: 'F2', recv: 'obs' }, o));
  // ④ 公転面(規則の半径)= 第352便za の題 plane(倍率 0)
  const planeZ = rel(planeUnit('rule', {}, o), Z.topicCell(T1, GEO, 'plane', 'Srule', 'NpL', 0, {}, {}).v);
  // ⑤ 歳差の率: 規則の半径・k 1 の軸引きずり = 第353便f の dragRate・要る c = 第353便m(地球 avg 29.0・火星 24.4)
  const dE = rel(dragAz('Earth', 'rule', { k: 1, pole: 'ecl' }, o), F.dragRate('Earth', { u: 0.98, pole: 'ecl' }, o).az);
  const dEk = rel(dragAz('Earth', 'rule', { k: 3e11, pole: 'ecl' }, o), F.dragRate('Earth', { u: 0.98, pole: 'ecl', k: 3e11 }, o).az);
  const cE = 1 / topicAt('precEarth', 'rule', {}, o).unit, cEm = M.earthFill({ moon: 'avg' }, { u: 0.98 }, o).cNeed, cM = 1 / topicAt('precMars', 'rule', {}, o).unit, cMm = M.cRow('Mars', { u: 0.98 }, o).cNeed;
  // ⑥ 地球の傾き・イオの内部熱・潮汐ロック(規則の半径・k)= 第352便za の topicCell(背景 0.98・局所 k)
  const kz = 5e10, zz = ['tilt', 'ioHeat', 'lock'].map((t) => rel(zaTopic(t === 'lock' ? 'ioLock' : t, 'rule', kz, 0.98, o).v, Z.topicCell(T1, GEO, t, 'Srule', 'NpL', 0.98, { k: kz }, {}).v));
  // ⑦ イオ(規則の半径・σ つき)= 第353便j の ioRow の ioTot・ioTotSigma(ioRow と同じ作り —— k は σ_太陽 で割らない・σ は木星の分だけ。本 lib の 'ruleSig' は太陽の分にも σ_太陽 を掛ける —— 差は 2e-8 の桁)
  const io = J.ioRow(null, { place: 'rule', T1, GEO }), ioQ = sideOf('Io', 'rule', { k: io.k }, o).omOverBg, sQ = (() => { const b = bgV(0.98, o), sS = CC.sOf(T1, GEO, 'Io', 'Sun', { place: 'rule', cR: 1 }).Om, sJ = CC.sOf(T1, GEO, 'Io', 'Jupiter', { place: 'rule', cR: 1 }).Om; return nrm(add(b, scl(add(scl(sJ, sigmaOf('Jupiter')), sS), io.k))) / nrm(b); })();
  const ioErr = [rel(ioQ, io.ioTot), rel(sQ, io.ioTotSigma)];
  // ⑧ 金星: 組の k で局所 ÷ 背景 = 1(σ つきも)
  const venus1 = Math.max(...SETS.map((s) => Math.abs(sideOf('Venus', s, {}, o).locOverBg - 1)));
  const ax = axisL(o);
  const rej = [() => setOf('x'), () => topicAt('nope', 'rule', {}, o), () => kVenus('zz', {}, o)].map((g) => { try { g(); return false; } catch (e) { return e instanceof RangeError; } });
  return { kQ, kJ, vsKJ, vsSide, ringH, ringK, ringAx, ringDisk, planeZ, dE, dEk, cE, cEm, cM, cMm, zz, ioErr, venus1, ax, omegaG: DECL.omegaG, edge: cROf('fe2', o), rejects: rej };
}
export function pureGates(S) {
  const e3 = (x) => Number(x).toExponential(2), mm = (a) => [Math.min(...a), Math.max(...a)];
  return {
    kSame: S.vsKJ <= 1e-9 && e3(S.kQ.rule) === ANCHOR.k.rule && e3(S.kQ['f1e-4']) === ANCHOR.k['f1e-4'] && e3(S.kQ.fe2) === ANCHOR.k.fe2,
    sideSame: S.vsSide <= 1e-7,   // 衛星の局所は第353便c の sOf の和(第353便j と同じ作り)—— 床 1e-7(第353便j の satZ と同じ)
    ringH: S.ringH.every((x) => x <= 1e-9) && mm(S.ringAx).map(e3).join() === ANCHOR.ringAxRule.join(),
    ringK: S.ringK.every((x) => x <= 1e-9) && mm(S.ringDisk).map(e3).join() === ANCHOR.ringDiskStd.join(),
    planeZ: S.planeZ <= 1e-9,
    dragF: S.dE <= 1e-9 && S.dEk <= 1e-9,
    cNeedM: Math.abs(S.cE / S.cEm - 1) <= 1e-9 && Math.abs(S.cM / S.cMm - 1) <= 1e-9 && Number(S.cE).toFixed(1) === ANCHOR.cNeed.Earth && Number(S.cM).toFixed(1) === ANCHOR.cNeed.Mars,
    zaSame: S.zz.every((x) => x <= 1e-9),
    ioJ: S.ioErr.every((x) => x <= 1e-7),
    venus1: S.venus1 <= 1e-9,
    axisL: S.ax.every((x, i) => Math.abs(x - ANCHOR.axisL[i]) <= 1e-6) && S.omegaG === ANCHOR.omegaG && Number(S.edge).toFixed(4) === '0.0128',
    rejects: S.rejects.every(Boolean),
  };
}
