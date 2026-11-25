// 第353便zf(原仮定者の回答(2026-11-25 —— 第151報)「向きと幾何」・「銀河由来の背景軸引きずりの大きさ」・AN1034・AN1039・AN1045・AN1046・AN1058・統括の検証項目 R496):
//   **主の列の候補を 3 本に並べた 1 枚の純関数 —— (ア) 規則の係数そのまま・背景 0.98/(イ) 換算の係数 8.22e11 を局所の項に置く・背景 0.98(数え方は規則の係数の倍 λ —— 局所の項について同じ働きの言い換え)/
//   (ウ) 規則の係数そのまま・背景を金星の条件の大きさに —— 診断だけ**
//   (器 tests/exp-w353zf-threecols.mjs と QA behavior.threecols353zf・docs.threecols353zf が読む —— html を読まない・ファイルを読まない・状態を持たない。後のラウンドの枝もこの口を import してよい)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない。既存の lib は呼ぶだけ(本文は変えない):
//   第353便q(topicAt・kVenus・localUnit・sideOf・dragAz・residOf —— 換算の係数の作り)・第353便d(obRot —— 源の半径 tSrc・受け手の半径 cR の口)・
//   第353便k(axStd・planeStd・ringStdOm —— 輪の場)・第353便u(obsRow —— 歳差の回る向きと仮の値)・第353便za(kState・kWatch・fWindow —— 見ている時間)・
//   第353便zg(aStar・structRows —— 等大の半径)・第353便c(sOf —— 自分の重みと源の重み)・第353便p(bg1)・第352便s(saturnSpin・tiltedNormal・ringRates)・第352便k(srcRadius・spinRot)・第351便c(pairInput・perpOf)・
//   第352便c(refAxis)・第348便h(YK)・第348便c(massOf・radiusOf)・第338便d(centerKm)・第353便h(DECL.tYardYr)・第347便e(t1Table・geometry)。
//   **第353便q・u・za は仮の値の lib(第352便b)を import する —— この lib を呼ぶ段の正本は最上位に provisional: true と使った鍵の一覧を持つ。**
//
// ■ 語: λ = 規則の係数の倍(規則の半径 = 係数 × 質量 —— 源の半径にも受け手の半径にも同じ λ を掛ける)。u = 背景の大きさ ÷ ω_G(向きは (N+) —— 基準軸 L)。
//   局所の項は 源の半径の 2 乗 × 受け手の半径の 1 乗 で λ³ 倍(受け手の自分の重みが源の重みの桁に落ちるまで —— 頭打ち)。
//   換算の係数 k(第353便q)は局所の (S) の項だけに掛ける倍。lamOf(k) = k^(1/3) は「同じ倍を規則の係数で書いたときの λ」。
//   列(COLS): 'A' (ア) λ 1・u 0.98/'I' (イ) λ = 0.98 で金星が等大になる λ(便の始めの数え直し 6 —— 9.374e3)・u 0.98/'U' (ウ) λ 1・u = 金星の条件(1.19282e-12)。
// ■ 口: COLS・lamOf(k)・localAtLam(recv, src, λ)・localSumAt(recv, λ)・lamVenus({ u })・colOf(id)・colState(id)・gainLam(recv, λ)・ringGain(λ)・planeGain(λ)・topicRow(topic, col)。
// ■ 言わないこと: 列を 1 本に選んだ・計算が当たった・背景の大きさを置いた、と書かない(3 列の表 —— 判定はしない)。物差しは文献の値・未照合・歳差の率の残りは仮の値。
//   重力の側の潮汐のトルクの列は「比べる列(DFM の式ではない)」。
import * as Q from './lib-w353q-onek.mjs';
import * as OB from './lib-w353d-srcoblate.mjs';
import * as KR from './lib-w353k-ringstd.mjs';
import * as H from './lib-w353h-ringdisk.mjs';
import * as P from './lib-w353p-cancelstd.mjs';
import * as S2 from './lib-w352s-satring.mjs';
import * as CR from './lib-w352c-refaxis.mjs';
import * as K from './lib-w352k-spinform.mjs';
import * as SP from './lib-w351c-srcparts.mjs';
import * as G3 from './lib-w348h-axisgeo3.mjs';
import * as C from './lib-w348c-axisbalance.mjs';
import * as RB from './lib-w338d-ringbook.mjs';
import * as E from './lib-w347e-spintorque.mjs';
import * as U from './lib-w353u-nearrecv.mjs';
import * as ZA from './lib-w353za-ktilt.mjs';
import * as ZG from './lib-w353zg-equalradius.mjs';
import * as CC from './lib-w353c-recvradius.mjs';

export const LIB_VERSION = 'w353zf-threecols-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const { dot, crs, nrm, scl, add, unit } = K.vec;
const D2R = Math.PI / 180;
export const rel = (a, b) => Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b), 1e-300);

/* ───────── 宣言(走らせたノブの格子と物差しの記録 —— 式の形の宣言ではない)───────── */
export const COLS = Object.freeze([
  Object.freeze({ id: 'A', label: '(ア)', lam: 1, u: 0.98, text: '規則の係数そのまま・背景 0.98' }),
  Object.freeze({ id: 'I', label: '(イ)', lam: 'venus', u: 0.98, text: '換算の係数 8.22e11 を局所の項に置く(規則の半径はそのまま)・背景 0.98 —— 規則の係数を λ 倍にする言い換えは局所の項について同じ働き(表 2)' }),
  Object.freeze({ id: 'U', label: '(ウ)', lam: 1, u: 'uV', text: '規則の係数そのまま・背景を金星の条件の大きさに' }),
]);
export const DECL = Object.freeze({
  cols: Object.freeze(COLS.map((c) => c.id)), uFocus: 0.98, band: Q.DECL.band, ageYr: Q.DECL.ageYr,
  sats: Object.freeze({ Moon: Object.freeze(['Sun', 'EarthHi']), Io: Object.freeze(['Sun', 'Jupiter']) }),
  /** 向きの一致の受け手(第353便t の 14 の内 —— 8 惑星と月・イオ) */
  dirRecvs: Object.freeze(['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Moon', 'Io']),
  /** λ の二分の区間(便の始めの数え直し 6 と同じ) */
  lamLo: 1e3, lamHi: 3e4, lamIter: 60,
  topics: Q.DECL.topics, ringMain: Q.DECL.ringMain,
  judge: '丸めの桁の床: 逐語の表は有効数字 3 桁・零試験は相対 1e-9 の床・便の始めの数え直しと枝 q・j の表は 5 桁/3 桁の字',
});
const OBSRC = Object.freeze({ EarthHi: 'Earth' });
const srcBody = (src) => OBSRC[src] || src;
const CACHE = { lamV: {}, uV: null, b1: null, gain: {} };
const ctx = (o = {}) => ({ T1: o.T1 || (CACHE.T1 || (CACHE.T1 = E.t1Table())), GEO: o.GEO || (CACHE.GEO || (CACHE.GEO = E.geometry())) });

/* ───────── 約束の口 ───────── */
/** 換算の係数 k を規則の係数の倍で書いたときの λ(= k^(1/3)) */
export function lamOf(k) {
  if (!(fin(k) && k > 0)) throw new RangeError('lamOf: k > 0');
  return Math.cbrt(k);
}
/** 源の半径を λ × 規則の半径にする tSrc(第352便k の srcRadius の幾何の倍の口) */
export function tSrcOf(src, lam) {
  if (!(fin(lam) && lam >= 1)) throw new RangeError('tSrcOf: λ ≥ 1');
  if (lam === 1) return 0;
  const t = Math.log(lam) / Math.log(K.srcRadius(src, 1) / K.srcRadius(src, 0));
  if (!(t > 0 && t <= 1)) throw new RangeError('tSrcOf: λ が観測の半径を越える(' + src + ')');
  return t;
}
/** 受け手の半径を λ × 規則の半径にする c_R(数 × 観測の半径) */
export function cROf(recv, lam) {
  if (!(fin(lam) && lam >= 1)) throw new RangeError('cROf: λ ≥ 1');
  return lam === 1 ? null : lam * G3.YK * C.massOf(recv) / C.radiusOf(recv);
}
/** 受け手 recv ← 源 src の局所 (S) の回転(rad/s のベクトル)—— 源の半径と受け手の半径を同じ λ で置く(第353便d の obRot・ob null) */
export function localAtLam(recv, src, lam, o = {}) {
  const { T1, GEO } = ctx(o);
  return OB.obRot(T1, GEO, recv, src, { part: 'S', tSrc: tSrcOf(src, lam), cR: cROf(recv, lam), ob: null }).Om;
}
/** 受け手の局所の和(衛星は源 2 つ —— 第353便q の localUnit と同じ源) */
export function localSumAt(recv, lam, o = {}) {
  const srcs = DECL.sats[recv] || ['Sun'];
  return srcs.reduce((s, src) => add(s, localAtLam(recv, src, lam, o)), [0, 0, 0]);
}
/** 背景の単位(第353便p の bg1 —— (N+)・基準軸 L・u 1) */
export function bgUnit(o = {}) { if (!CACHE.b1) { const { T1, GEO } = ctx(o); CACHE.b1 = P.bg1(T1, GEO, 'Np', 'L'); } return CACHE.b1; }
/** 金星の条件の背景の倍率(λ 1 —— 局所 ÷ 背景の単位) */
export function uVenus(o = {}) { if (CACHE.uV === null) CACHE.uV = nrm(localSumAt('Venus', 1, o)) / nrm(bgUnit(o)); return CACHE.uV; }
/** u で金星が等大になる λ(二分 —— 便の始めの数え直し 6 の作り) */
export function lamVenus({ u = DECL.uFocus } = {}, o = {}) {
  if (CACHE.lamV[u]) return CACHE.lamV[u];
  const nb = nrm(bgUnit(o)); let lo = DECL.lamLo, hi = DECL.lamHi;
  if (!(nrm(localSumAt('Venus', lo, o)) / nb < u && nrm(localSumAt('Venus', hi, o)) / nb > u)) throw new RangeError('lamVenus: 区間の外');
  for (let i = 0; i < DECL.lamIter; i++) { const m = Math.sqrt(lo * hi); if (nrm(localSumAt('Venus', m, o)) / nb < u) lo = m; else hi = m; }
  return (CACHE.lamV[u] = Math.sqrt(lo * hi));
}
export const colOf = (id) => { const c = COLS.find((x) => x.id === id); if (!c) throw new RangeError('colOf: 列は ' + DECL.cols.join('・')); return c; };
/** 列の数の値: { id, lam, u, kEq(局所の倍 —— λ の作りでは金星の局所の倍), kQ(第353便q の規則の半径の組の k —— u の) } */
export function colState(col, o = {}) {
  const c = typeof col === 'string' ? colOf(col) : col;
  const u = c.u === 'uV' ? uVenus(o) : c.u, lam = c.lam === 'venus' ? lamVenus({ u }, o) : c.lam;
  return { id: c.id, label: c.label, lam, u, kQ: Q.kVenus('rule', { u }).k, gainVenus: gainLam('Venus', lam, o) };
}
/** 受け手の局所の倍(λ の作り ÷ λ 1)と λ³ との比 */
export function gainLam(recv, lam, o = {}) {
  const ck = recv + '|' + lam; if (CACHE.gain[ck]) return CACHE.gain[ck];
  const v = lam === 1 ? 1 : nrm(localSumAt(recv, lam, o)) / nrm(localSumAt(recv, 1, o));
  return (CACHE.gain[ck] = v);
}
/** 土星の環 (F1) の輪の場を λ で(第353便k の axStd と同じ作り —— 源の半径 λ × 規則・粒子 1e3 kg の規則の半径 × λ・太陽由来の重みは tSrc の spinRot)の上げる率 ″/年 */
export function ringRaise(key, lam, o = {}) {
  const { T1, GEO } = ctx(o), tSrc = tSrcOf('Saturn', lam), sp = S2.saturnSpin(T1, GEO), Ms = C.massOf('Saturn'), Rs = K.srcRadius('Saturn', tSrc), r = RB.centerKm(key) * 1e3;
  const wSun = K.spinRot(T1, GEO, 'Saturn', 'Sun', { part: 'S', tSrc }).wS, L0 = sp.ax, L1 = S2.tiltedNormal(sp.ax, KR.DECL.tiltDeg);
  const R = KR.ringStdOm({ Ms, Rs, spinVec: sp.vec, L: L1, r, extraW: wSun, recvM: 1e3, recvR: G3.YK * 1e3 * lam, ob: null });
  const q = S2.ringRates(L1, R.Om, { ref: L0 }), eps = KR.DECL.tiltDeg * D2R;
  return { raiseAsYr: q.raiseAsYr, yard: q.raiseAsYr / 206264.80624709636 / eps * H.DECL.tYardYr };
}
/** 公転面の集まり(地球の道の輪 —— 第353便k の planeStd と同じ作り)の直交成分 rad/s を λ で */
export function planePerp(lam, o = {}) {
  const { T1, GEO } = ctx(o), P0 = SP.pairInput(T1, GEO, 'Earth', 'Sun'), Lh = unit(CR.refAxis(KR.DECL.planeAxis, T1, GEO)), Rs = K.srcRadius('Sun', tSrcOf('Sun', lam));
  const R = KR.ringStdOm({ Ms: P0.Ms, Rs, spinVec: scl(P0.sAx, P0.ws), L: Lh, r: P0.a, recvM: 1e3, recvR: G3.YK * 1e3 * lam, ob: null });
  return nrm(SP.perpOf(Lh, R.Om));
}
export function ringGain(lam, o = {}) { const ck = 'ring|' + lam; if (CACHE.gain[ck]) return CACHE.gain[ck]; return (CACHE.gain[ck] = lam === 1 ? 1 : ringRaise(DECL.ringMain, lam, o).yard / ringRaise(DECL.ringMain, 1, o).yard); }
export function planeGain(lam, o = {}) { const ck = 'plane|' + lam; if (CACHE.gain[ck]) return CACHE.gain[ck]; return (CACHE.gain[ck] = lam === 1 ? 1 : planePerp(lam, o) / planePerp(1, o)); }
const TOPIC_RECV = Object.freeze({ io: 'Io', moon: 'Moon', mercury: 'Mercury', tilt: 'Earth', ioHeat: 'Io', ioLock: 'Io' });

/**
 * 題 topic × 列 col: { topic, col, lam, u, v(主の値 ÷ 物差し —— 第353便q の topicAt の v と同じ意味), vComp(背景を含む値 —— 在れば),
 *   vK((イ) だけ: 換算の係数の作り〔局所の (S) の項だけに k〕の値), vLam((イ) だけ: λ の作り), lamOverK(vLam ÷ vK), how(λ の作りの数え方), band('in'|'over'|'under') }
 * (ア) = 第353便q の topicAt(規則の半径・u 0.98)の unit(k 1)・(ウ) = 同じ topicAt を u = 金星の条件で(k = 1 + 1e-15 の桁)・(イ) = λ の作り(主)と k の作り(添え)。
 */
export function topicRow(topic, col, o = {}) {
  if (!DECL.topics.includes(topic)) throw new RangeError('topicRow: 題は ' + DECL.topics.join('・'));
  const cs = colState(col, o);
  let v = null, vComp = null, vK = null, vLam = null, how = null, extra = {};
  if (cs.id === 'A' || cs.id === 'U') {
    const r = Q.topicAt(topic, 'rule', { u: cs.u });
    if (cs.id === 'U') { v = r.v; vComp = r.vComp; }
    else {
      v = r.unit;
      if (['io', 'moon', 'mercury'].includes(topic)) vComp = Q.sideOf(TOPIC_RECV[topic], 'rule', { u: cs.u, k: 1 }).omOverBg;
      else if (topic === 'plane') vComp = v;
    }
    if (topic === 'precEarth' || topic === 'precMars') extra = { cNeed: 1 / v, provisional: true, provKeys: r.provKeys };
    if (topic === 'tilt') extra = { fMax: cs.id === 'U' ? r.fMax : r.fMax1 };
  } else {
    const r = Q.topicAt(topic, 'rule', { u: cs.u }); vK = r.v;
    if (topic === 'ringAx') { vLam = r.unit * ringGain(cs.lam, o); how = '輪の場を λ で作り直す(第353便k の axStd の作り)'; }
    else if (topic === 'ringDisk') { vLam = r.unit * Math.pow(cs.lam, 3); how = 'λ³ の写し(源の半径の 2 乗 × 受け手の規則の半径 —— 粒子の自分の重みは源の重みの 1e20 倍の桁で頭打ちなし)'; }
    else if (topic === 'plane') { vLam = r.unit * planeGain(cs.lam, o); how = '輪の場を λ で作り直す(第353便k の planeStd の作り)'; }
    else if (topic === 'precEarth' || topic === 'precMars') {
      const id = topic === 'precEarth' ? 'Earth' : 'Mars', kEff = gainLam(id, cs.lam, o), R = Q.residOf()[id];
      vLam = Q.dragAz(id, 'rule', { u: cs.u, k: kEff }) / R; how = '局所の倍を λ の作りの倍(' + id + ')に置いて方位の率を作り直す';
      extra = { cNeed: 1 / vLam, cNeedK: 1 / vK, kEff, provisional: true, provKeys: r.provKeys };
    } else {
      const g = gainLam(TOPIC_RECV[topic], cs.lam, o);
      vLam = (topic === 'ioHeat' ? g * g : g) * r.unit; how = topic === 'ioHeat' ? '局所の倍の 2 乗(内部熱は直交成分の 2 乗)' : '局所の倍(受け手 ' + TOPIC_RECV[topic] + ')';
      if (['io', 'moon', 'mercury'].includes(topic)) { const b = scl(bgUnit(o), cs.u), Lc = localSumAt(TOPIC_RECV[topic], cs.lam, o); vComp = nrm(add(b, Lc)) / nrm(b); }
      if (topic === 'tilt') extra = { fMax: r.fMax };
    }
    if (topic === 'plane') vComp = vLam;
    v = vLam;
  }
  const av = Math.abs(v), band = !fin(av) ? null : av > DECL.band.hi ? 'over' : av < DECL.band.lo ? 'under' : 'in';
  return { topic, col: cs.id, lam: cs.lam, u: cs.u, v, vComp, vK, vLam, lamOverK: fin(vK) && fin(vLam) ? vLam / vK : null, how, band, ...extra };
}

/* ───────── 表 ───────── */
/** 見ている時間・向き・寄る割合の題は第353便u・za の口(換算の係数の組)で数える —— (イ) は組 'rule'(k の作り)で、λ の作りとの差は表 2 の局所の倍の比(0.5% の内) */
const COMBO = Object.freeze({ A: 'k1', I: 'rule', U: 'k1' });
const sigN = (f, n) => Math.pow(1 - f, -n / 3);
/** イオの x(太陽由来 + 木星由来 × σ_n)÷ 金星の局所 —— 列の λ で */
export function ioX(n, lam, o = {}) {
  const f = OB.litOf('Jupiter').f, s = add(localAtLam('Io', 'Sun', lam, o), scl(localAtLam('Io', 'Jupiter', lam, o), n === 0 ? 1 : sigN(f, n)));
  return nrm(s) / nrm(localSumAt('Venus', lam, o));
}
/** 向きの一致 2 sin(φ/2)(φ = −局所 と基準軸 L の角)と金星の順位 */
export function dirRank(lam, o = {}) {
  const Lh = unit(bgUnit(o)), rows = DECL.dirRecvs.map((id) => { const v = localSumAt(id, lam, o), c = -dot(unit(v), Lh), phi = Math.acos(Math.max(-1, Math.min(1, c))); return { id, phiDeg: phi / D2R, res: 2 * Math.sin(phi / 2) }; });
  const sorted = rows.slice().sort((a, b) => a.res - b.res);
  return { rows, venusRank: sorted.findIndex((r) => r.id === 'Venus') + 1, second: sorted[1].id === 'Venus' ? sorted[0].id : sorted[1].id };
}
const RULER_TOPICS = Object.freeze(Q.TOPICS.map((t) => t.id));
/** 表 1: 題 × 3 列(値と、物差しが在る題は値 ÷ 物差し)と、列ごとの数 */
export function table1(o = {}) {
  const C3 = COLS.map((c) => colState(c, o)), rows = [];
  const push = (g, id, label, ruler, f) => rows.push({ g, id, label, ruler, cells: C3.map((cs) => { const r = f(cs); return { col: cs.id, ...r }; }) });
  const b1 = bgUnit(o), nb = nrm(b1);
  const vRes = (cs) => { const v = localSumAt('Venus', cs.lam, o); return nrm(add(scl(b1, cs.u), v)) / (cs.u * nb); };
  push(1, 'venusResid', '金星の合成 ÷ 背景(等大の残り)', null, (cs) => ({ v: vRes(cs) }));
  push(1, 'venusRank', '向きの一致 2 sin(φ/2) の金星の順位(受け手 10)', null, (cs) => { const d = dirRank(cs.lam, o); return { v: d.venusRank, res: d.rows.find((r) => r.id === 'Venus').res, second: d.second }; });
  for (const n of [0, 2, 5]) push(2, 'ioX' + n, 'イオの x(' + (n === 0 ? '扁平率なし' : n === 2 ? '体積を保つ扁平 (1 − f)^(−2/3)' : '赤道の球 (1 − f)^(−5/3)') + ')', null, (cs) => ({ v: ioX(n, cs.lam, o) }));
  const aS = {}, aJ = {}; for (const n of [0, 2, 5]) { const { T1, GEO } = ctx(o); aS[n] = ZG.aStar(T1, GEO, 'Saturn', { n }); aJ[n] = ZG.aStar(T1, GEO, 'Jupiter', { n }); }
  const rCD = ZG.structRows('Saturn').find((s) => s.key === 'satCD').r, rIo = ZG.structRows('Jupiter').find((s) => s.key === 'io').r;
  const aMul = (cs, which) => (cs.lam === 1 ? 1 : Math.cbrt((which === 'S' ? ringGain(cs.lam, o) : gainLam('Io', cs.lam, o)) / gainLam('Venus', cs.lam, o)));
  for (const n of [0, 2, 5]) push(3, 'cassini' + n, 'カッシーニの間隙 ÷ 土星の a★(' + ['倍なし', '', 'n 2', '', '', 'n 5'][n] + ')', null, (cs) => ({ v: rCD / (aS[n] * aMul(cs, 'S')), aStar: aS[n] * aMul(cs, 'S') }));
  for (const n of [0, 2, 5]) push(3, 'ioOrb' + n, 'イオの道 ÷ 木星の a★(' + ['倍なし', '', 'n 2', '', '', 'n 5'][n] + ')', null, (cs) => ({ v: rIo / (aJ[n] * aMul(cs, 'J')), aStar: aJ[n] * aMul(cs, 'J') }));
  const tr = (t) => (cs) => { const r = topicRow(t, cs.id, o); return { v: r.v, vComp: r.vComp, band: r.band, vK: r.vK, cNeed: r.cNeed === undefined ? null : r.cNeed, fMax: r.fMax === undefined ? null : r.fMax }; };
  push(4, 'ringAx', '土星の環 (F1) の率 ÷ 物差し(B 環)', '環の物差しの率', tr('ringAx'));
  push(4, 'ringDisk', '土星の環 (F2) の率 ÷ 物差し(B 環)', '環の物差しの率', tr('ringDisk'));
  push(5, 'plane', '公転面の集まり ÷ 物差し', '30° → 7° の 23°', tr('plane'));
  push(6, 'mercury', '水星の局所 ÷ 背景', '背景の大きさ', tr('mercury'));
  for (const id of ['Earth', 'Mars']) push(6, 'side' + id, (id === 'Earth' ? '地球' : '火星') + 'の局所 ÷ 背景', null, (cs) => ({ v: nrm(localSumAt(id, cs.lam, o)) / (cs.u * nb) }));
  push(6, 'moon', '月の局所 ÷ 背景', '背景の大きさ', tr('moon'));
  push(6, 'io', 'イオの局所 ÷ 背景', '背景の大きさ', tr('io'));
  for (const id of ['Earth', 'Mars']) push(6, 'sense' + id, (id === 'Earth' ? '地球' : '火星') + 'の歳差の回る向きが仮の値と同じか(1 = 同じ —— 仮・未照合)', null, (cs) => { const r = U.obsRow(id, COMBO[cs.id], { u: cs.u }); return { v: r.provSame ? 1 : 0, drag: r.drag, provisional: true }; });
  push(7, 'tilt', '地球の傾き(局所だけで年齢の間に動き得る角 ÷ いまの傾き)', 'いまの傾き', tr('tilt'));
  for (const y of [1e4, 1e6, 4.5e9]) push(7, 'watch' + y, '地球の傾きの変化 °(公転の極を固定・' + (y === 1e4 ? '1 万年' : y === 1e6 ? '100 万年' : '45 億年') + ')', null, (cs) => { const w = ZA.kWatch('Earth', COMBO[cs.id], { years: y, mode: 'fixed', u: cs.u }); return { v: w.winDeg, provisional: true }; });
  push(7, 'watchTurn', '地球の傾きの一周の揺れの幅 °', null, (cs) => { const w = ZA.kWatch('Earth', COMBO[cs.id], { years: 1e4, mode: 'fixed', u: cs.u }); return { v: w.swingDeg, periodYr: w.periodYr }; });
  push(8, 'fMax', '傾きを保つ寄る割合の上限(地球)', null, (cs) => { const w = ZA.fWindow('Earth', COMBO[cs.id], { u: cs.u }); return { v: w.fMax, noLimit: w.noLimit }; });
  push(8, 'fRing', '公転面が寄る割合の下限(地球の道の輪)', null, (cs) => { const w = ZA.fWindow('Earth', COMBO[cs.id], { u: cs.u }); return { v: w.fRingW, gap: w.gapW }; });
  for (const k of ['Sun', 'Earth']) push(9, 'period' + k, (k === 'Sun' ? '太陽' : '地球') + 'の歳差の 1 周(年)', null, (cs) => ({ v: ZA.kState(k, COMBO[cs.id], { u: cs.u }).periodYr }));
  push(9, 'turnsSun', '太陽の円錐の年齢の内の周の数', null, (cs) => ({ v: DECL.ageYr / ZA.kState('Sun', COMBO[cs.id], { u: cs.u }).periodYr }));
  push(10, 'precEarth', '地球の歳差の率の残りの埋まる割合(1 ÷ 要る応答の係数 —— 仮・未照合)', '残り(仮の値 − 重力の側の列)', tr('precEarth'));
  push(10, 'precMars', '火星の歳差の率の残りの埋まる割合(同上)', '残り(同上)', tr('precMars'));
  push(11, 'ioHeat', 'イオの内部熱 ÷ 物差し', '熱の物差し', tr('ioHeat'));
  push(11, 'ioLock', '潮汐ロック(直交成分のトルク ÷ 潮汐のトルク)', '潮汐のトルク(比べる列(DFM の式ではない))', tr('ioLock'));
  const count = C3.map((cs, i) => { const R = rows.filter((r) => r.ruler !== null), b = R.map((r) => r.cells[i].band);
    return { col: cs.id, inBand: b.filter((x) => x === 'in').length, over: b.filter((x) => x === 'over').length, under: b.filter((x) => x === 'under').length, noRuler: rows.length - R.length,
      inIds: R.filter((r) => r.cells[i].band === 'in').map((r) => r.id) }; });
  return { cols: C3, rows, count, rulerTopics: RULER_TOPICS };
}
/** 表 2: (イ) を換算の係数(局所の (S) の項だけ)で書くか、規則の係数の倍 λ(源と受け手の半径)で書くかで動く所 */
export function table2(o = {}) {
  const cs = colState('I', o), lam = cs.lam, gV = gainLam('Venus', lam, o), lam3 = Math.pow(lam, 3);
  const recv = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Moon', 'Io'].map((id) => ({ id, gainOverLam3: gainLam(id, lam, o) / lam3, lamOverK: gainLam(id, lam, o) / gV }));
  recv.push({ id: 'ringB', gainOverLam3: ringGain(lam, o) / lam3, lamOverK: ringGain(lam, o) / gV }, { id: 'plane', gainOverLam3: planeGain(lam, o) / lam3, lamOverK: planeGain(lam, o) / gV });
  const topics = DECL.topics.map((t) => { const r = topicRow(t, 'I', o); return { topic: t, vK: r.vK, vLam: r.vLam, lamOverK: r.lamOverK, how: r.how }; });
  const { T1, GEO } = ctx(o);
  const cap = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'].map((id) => { const s = CC.sOf(T1, GEO, id, 'Sun', { place: 'rule' }), r0 = s.A0 / s.wS; return { id, selfOverSrc1: r0, selfOverSrcLam: r0 / lam, lamCap: r0 }; });
  const dObs = KR.diskStd(DECL.ringMain, { src: 'rule', recv: { kind: 'obs', a: 1, cR: 1 } }).yard;
  const lam2 = lam * lam, ioRr = lam * G3.YK * C.massOf('Io') / C.radiusOf('Io');
  const differ = [
    { id: 'ringDiskObs', label: '円盤引きずりの側の輪の場 (F2)・受け手 = 粒子の観測半径 × 構造の係数(回答の基準)', vK: dObs * cs.kQ, vLam: dObs * lam2, lamOverK: lam2 / cs.kQ, how: '受け手の半径は λ で替わらない —— 源の半径の 2 乗だけ(λ²)' },
    { id: 'ioLockI', label: '潮汐ロックで慣性モーメントを規則の半径 × λ に読む(応答の側の率の倍 —— 半径の 2 乗)', vK: topicRow('ioLock', 'I', o).vK, vLam: topicRow('ioLock', 'I', o).vLam * ioRr * ioRr, lamOverK: topicRow('ioLock', 'I', o).lamOverK * ioRr * ioRr, how: '(λ × 規則の半径 ÷ 観測半径)² = ' + (ioRr * ioRr).toExponential(3) },
  ];
  return { lam, kQ: cs.kQ, lam3OverK: lam3 / cs.kQ, cbrtK: lamOf(cs.kQ), recv, topics, cap, capAny: cap.some((c) => c.selfOverSrcLam < 1), capMin: cap.reduce((m, c) => (c.selfOverSrcLam < m.selfOverSrcLam ? c : m)), differ };
}

/* ───────── 零試験 ───────── */
/** 比べる数(便の始めの数え直し 6・第353便q の表 4 の規則の半径の組・第353便j の副作用の表 —— 文字で持つ) */
export const ANCHOR = Object.freeze({
  a6: Object.freeze({ lam: '9.37434e+3', cubeAt937: '0.99731', resid: '0.013259', residK1: '0.013274', uV: '1.19282e-12', kQ: '8.2158e+11', cbrtK: '9.3659e+3',
    sunR: '1.6419e+8', venusR: '4.019e+2', earthR: '4.931e+2', jupR: '1.567e+5', side: Object.freeze({ Mercury: '6.50e+0', Earth: '3.77e-1', Mars: '1.07e-1', Jupiter: '2.68e-3' }) }),
  q: Object.freeze({ ringAx: '0.204', ringDisk: '0.154', plane: '6.21', io: '0.894', moon: '0.377', mercury: '6.53', count: 6 }),
  j: Object.freeze({ Mercury: '6.53', Earth: '0.377', Mars: '0.107' }),
});
export function pureScenes(T1 = E.t1Table(), GEO = E.geometry()) {
  const o = { T1, GEO }, nb = nrm(bgUnit(o)), lamV = lamVenus({ u: 0.98 }, o), b1 = bgUnit(o);
  const res = (v, u) => nrm(add(scl(b1, u), v)) / (u * nb);
  const vI = localSumAt('Venus', lamV, o), v937 = localSumAt('Venus', 9.37e3, o);
  const a6 = { lam: lamV, cubeAt937: (nrm(v937) / nrm(localSumAt('Venus', 1, o))) / Math.pow(9.37e3, 3), resid: res(vI, 0.98), residK1: res(localSumAt('Venus', 1, o), uVenus(o)), uV: uVenus(o),
    kQ: Q.kVenus('rule', { u: 0.98 }).k, sunR: K.srcRadius('Sun', 0) * lamV, venusR: lamV * G3.YK * C.massOf('Venus'), earthR: lamV * G3.YK * C.massOf('Earth'), jupR: lamV * G3.YK * C.massOf('Jupiter'),
    side: Object.fromEntries(['Mercury', 'Earth', 'Mars', 'Jupiter'].map((id) => [id, nrm(localSumAt(id, 9.37e3, o)) / (0.98 * nb)])) };
  const lu = Object.fromEntries(['Venus', 'Mercury', 'Io', 'Moon'].map((id) => { const m = localSumAt(id, 1, o); return [id, nrm(add(m, scl(Q.localUnit(id, 'rule').loc, -1))) / nrm(m)]; }));
  const qt = Object.fromEntries(['ringAx', 'ringDisk', 'plane', 'io', 'moon', 'mercury'].map((t) => [t, Q.topicAt(t, 'rule', { u: 0.98 }).v]));
  const qCount = Q.TOPICS.filter((t) => Q.topicAt(t.id, 'rule', { u: 0.98 }).inBand).length;
  const js = Object.fromEntries(['Mercury', 'Earth', 'Mars'].map((id) => [id, Q.sideOf(id, 'rule', { u: 0.98 }).locOverBg]));
  const ring1 = { mine: ringRaise(DECL.ringMain, 1, o).yard, kr: KR.axStd(T1, GEO, DECL.ringMain, { src: 'rule', ob: 'O0', recv: { kind: 'rule' } }).yard };
  const plane1 = { mine: planePerp(1, o) * DECL.ageYr * 365.25 * 86400 / (23 * D2R), kr: KR.planeStd(T1, GEO, 'Earth', { src: 'rule', ob: 'O0', recv: 'rule' }).v };
  const kU = Q.kVenus('rule', { u: uVenus(o) }).k;
  const rejects = [() => lamOf(-1), () => lamOf(NaN), () => colOf('X'), () => topicRow('nope', 'A', o), () => tSrcOf('Sun', 0.5), () => tSrcOf('Sun', 1e6)].map((f) => { try { f(); return false; } catch (e) { return e instanceof RangeError; } });
  return { a6, lu, qt, qCount, js, ring1, plane1, kU, cbrt: lamOf(a6.kQ), rejects };
}
export function pureGates(S) {
  const s5 = (x) => Number(x).toPrecision(5), e = (x, n) => Number(x).toExponential(n), p3 = (x) => Number(x).toPrecision(3);
  const A = ANCHOR;
  return {
    anchor6: e(S.a6.lam, 5) === A.a6.lam && s5(S.a6.cubeAt937) === A.a6.cubeAt937 && s5(S.a6.resid) === A.a6.resid && s5(S.a6.residK1) === A.a6.residK1 && e(S.a6.uV, 5) === A.a6.uV && e(S.a6.kQ, 4) === A.a6.kQ
      && e(S.a6.sunR, 4) === A.a6.sunR && e(S.a6.venusR, 3) === A.a6.venusR && e(S.a6.earthR, 3) === A.a6.earthR && e(S.a6.jupR, 3) === A.a6.jupR && Object.entries(A.a6.side).every(([k, v]) => e(S.a6.side[k], 2) === v),
    cbrtK: e(S.cbrt, 4) === A.a6.cbrtK && rel(S.cbrt, Math.pow(S.a6.kQ, 1 / 3)) < 1e-12,
    localUnit353q: Object.values(S.lu).every((x) => x < 1e-9),
    table353q: Object.entries(A.q).filter(([k]) => k !== 'count').every(([k, v]) => p3(S.qt[k]) === v) && S.qCount === A.q.count,
    side353j: Object.entries(A.j).every(([k, v]) => p3(S.js[k]) === v),
    ringStd353k: rel(S.ring1.mine, S.ring1.kr) < 1e-9,
    planeStd353k: rel(S.plane1.mine, S.plane1.kr) < 1e-9,
    colU: Math.abs(S.kU - 1) < 1e-9,
    rejects: S.rejects.every(Boolean),
  };
}
