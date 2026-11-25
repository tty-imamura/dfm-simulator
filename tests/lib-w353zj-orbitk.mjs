// 第353便zj(原仮定者の回答(2026-11-25 —— 第151報)「銀河由来の背景軸引きずりの大きさ: これに注目」「AN1045: 「規則の半径」…計算が合う方式を採用する」・
//   原仮定者の回答(2026-11-14 —— 第138報の回答)AN721(環に効く計算を先に求め、同じ計算・同じノブで水星を読む)・統括の検証項目 R499):
//   **注目の列 u = 0.98 で金星を打ち消す換算の係数 k を置いた列で、水星・金星・地球・火星の「公転の道」(道の面の法線・近点の向き)が、自転軸と同じ合成の回転
//   (背景 + k × 局所)に応えるとしたときの率(″/世紀)を、暦表の追加の歳差の参考の幅(第334便c の LIT —— 第335便c の訂正の後・文献の値・未照合・幅は 1σ ではない)と比べる純関数 —— 診断だけ**
//   (器 tests/exp-w353zj-orbitk.mjs と QA behavior.orbitk353zj・docs.orbitk353zj が読む —— html を読まない・ファイルを読まない・状態を持たない。後のラウンドの枝もこの口を import してよい)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない。**道が局所の回転に応えるかどうかは、いまの式には無い**(自転軸の式を道の面に当てた読み —— 〔第352便l〕〔第352便p〕の「輪の法線」と同じ作り)。
//   既存の lib は呼ぶだけ(本文は変えない): 第353便u(comboList・kOf・nearState —— 組ごとの合成 Ω と局所 ÷ 背景)・第353便x(ringNeed —— 公転面が寄る下限)・第353便e(fRingAt・DECL)・
//   第351便d(r3Rate・r3Coeffs —— 寄る分と歳差の分の係数)・第352便d(precDs・poleRates —— 零試験)・第337便b(systemOfLit・anglesRates・q1PNPerOrbit・periodOf —— 道の要素と交点・傾き・近点の率)・
//   第335便c(LIT —— 第334便c の LIT の訂正の後)・第333便c(toArcsecCy)・第347便e(t1Table・geometry)。
//   **第353便u・x は仮の値の lib(第352便b)を閉包に持つ —— この lib を呼ぶ段の正本は最上位に provisional: true と使った鍵の一覧を持つ**(本 lib の数は仮の値を使わない —— 閉包に入るだけ)。
//
// ■ 語: Ω = 背景(向き (N+) —— 基準軸 L・大きさ u ω_G)+ k × (S)(第353便u の nearState の _st.Om —— 源 = 太陽・規則の半径)。組 = 第353便u の comboList(k1 = k 1・規則の半径〔k を置かない列〕+ 金星の条件の 8 組)。
//   n̂ = 道の面の法線・P̂ = 近点の向き(第337便b の systemOfLit —— JPL の近似要素・J2000 の黄道)。c_輪 = 道が合成の回転に応える係数(〔第353便x〕の c_輪 ÷ c・既定 1 = 自転軸と同じ)。
//   f_輪 = 道の寄る割合(第351便d の (N1) —— k₁ = f/h・k₂ = (1 − f)/h)。主は f_輪 0(剛体の回転の読み)。
// ■ 式(読み —— いまの式には無い): dn̂/dt = c_輪 [σ k₂ (Ω × n̂) + k₁ Ω_a⊥](σ = −1 が (g2−)〔主〕・+1 が (g2+)・Ω_a = 寄る先 —— 'all' は Ω・'bg' は背景だけ〔第352便w の f_輪 の下限の作り〕)・
//   近点の面内の回り apsW = σ c_輪 k₂ (Ω·n̂)(寄る分は n̂ に垂直な軸のまわりの回転で、面内の回りを持たない)。黄道の交点 Ω_node・傾き i・近点経度 ϖ の率は第337便b の anglesRates
//   (dϖ = apsW − cos i dΩ_node + dΩ_node)。率は Ω に一次 —— 全部 = 共通の分(背景だけ)+ 差(k × 局所)。σ を替えると率の符号だけが替わる(大きさは同じ)。
// ■ 比べる尺度: 第335便c の ratioNote の作り —— 比 = abs(率) ÷ (abs(値) + 幅)。地球の追加の交点の値は LIT に無い(null)・地球の黄道の交点は傾き 1.5e-5° で定まらない —— 交点の比は「数なし」。
// ■ 言わないこと: 水星の近点が説明できた・暦表と合った・食い違った、と書かない(参考の幅との比の表 —— 幅は 1σ ではない・文献の値・未照合)。在位の組(1PN の値に当たる組)を動かさない。k・c_輪 を決めない。
import * as U from './lib-w353u-nearrecv.mjs';
import * as X from './lib-w353x-twoaxis.mjs';
import * as FE from './lib-w353e-focus098.mjs';
import * as R3 from './lib-w351d-r3step.mjs';
import * as D from './lib-w352d-precsense.mjs';
import * as MB from './lib-w337b-mercuryband.mjs';
import { LIT as LIT335C } from './lib-w335c-mercurycombo.mjs';
import { toArcsecCy } from './lib-w333c-mercury3d.mjs';
import * as E from './lib-w347e-spintorque.mjs';

export const LIB_VERSION = 'w353zj-orbitk-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const { add, scl, dot, crs, nrm, unit } = MB.vec;
const D2R = Math.PI / 180;
export const ASYR = D.ASYR;
/** ″/世紀(rad/s → ″/世紀) */
export const cy = (r) => (r === null || r === undefined ? null : toArcsecCy(r));
const angDeg = (a, b) => Math.acos(Math.max(-1, Math.min(1, dot(unit(a), unit(b))))) / D2R;

/* ───────── 宣言(走らせたノブの格子と物差しの記録 —— 式の形の宣言ではない)───────── */
export const DECL = Object.freeze({
  uFocus: 0.98, omegaG: FE.DECL.omegaG, ageYr: FE.DECL.ageYr, spread: FE.DECL.spread,
  /** 受け手 4 つ(内側の惑星)と第337便b の系の名 */
  recvs: Object.freeze(['Mercury', 'Venus', 'Earth', 'Mars']),
  sysKey: Object.freeze({ Mercury: 'merc', Venus: 'venus', Earth: 'earth', Mars: 'mars' }),
  litKey: Object.freeze({ Mercury: 'merc', Venus: 'venus', Earth: 'earth', Mars: 'mars' }),
  /** 組: 第353便u の comboList の id(k1 = k を置かない列 —— 背景だけ) */
  comboIds: U.DECL.comboIds,
  senses: Object.freeze(['g2m', 'g2p']), mainSense: 'g2m',
  alignTo: Object.freeze(['all', 'bg']),
  /** 応える係数 c_輪 の格子(表 1 は 1) */
  cRingGrid: Object.freeze([0, 0.01, 0.1, 1]),
  /** 地球の黄道の交点は定まらない(第337便b の要素の傾き −1.531e-5°)—— 交点の率と比は数なし */
  nodeUndefined: Object.freeze(['Earth']),
  judge: '比 = abs(率) ÷ (abs(値) + 幅)(第335便c の ratioNote)・逐語の表は有効数字 3 桁',
});
const sysOf = (id) => { if (!DECL.recvs.includes(id)) throw new RangeError('受け手は ' + DECL.recvs.join('・')); return MB.systemOfLit(DECL.sysKey[id]); };
const ctx = (o = {}) => ({ T1: o.T1 || E.t1Table(), GEO: o.GEO || E.geometry(), cache: o.cache || {} });

/* ───────── 文献の値(第334便c の LIT —— 第335便c の訂正の後)───────── */
/**
 * litOf(id) → { id, dvarpi: [値, 幅], dnode: [値, 幅] | null, scaleVarpi = abs(値) + 幅, scaleNode | null, src, widthMeaning, note }(″/世紀・文献の値・未照合・幅は 1σ ではない)
 */
export function litOf(id) {
  if (!DECL.recvs.includes(id)) throw new RangeError('litOf: 受け手は ' + DECL.recvs.join('・'));
  const k = DECL.litKey[id], v = LIT335C.dvarpi[k], n = LIT335C.dnode[k];
  return { id, dvarpi: [v[0], v[1]], dnode: n ? [n[0], n[1]] : null, scaleVarpi: Math.abs(v[0]) + v[1], scaleNode: n ? Math.abs(n[0]) + n[1] : null,
    src: LIT335C.src, widthMeaning: LIT335C.widthMeaning, ratioNote: LIT335C.ratioNote, note: '文献の値・未照合・幅は 1σ ではない' };
}

/* ───────── 1 つの回転ベクトルの率 ───────── */
/**
 * planeRates(id, Om, { cRing, fRing, sense, OmAlign }) —— 回転ベクトル Om(rad/s)に道が応えるときの率(″/世紀): {
 *   Lmag(|dn̂/dt|)・Lvec・di・dnode(黄道 —— 地球は null)・sinIdnode(交点の方位の分 = sin i dΩ_node)・dvarpi・apsW(面内の近点の回り)・domega }
 */
export function planeRates(id, Om, { cRing = 1, fRing = 0, sense = DECL.mainSense, OmAlign = null } = {}) {
  if (!(Array.isArray(Om) && Om.length === 3 && Om.every(fin))) throw new RangeError('planeRates: Ω は [3]');
  if (!(fin(cRing) && cRing >= 0)) throw new RangeError('planeRates: c_輪 ≥ 0');
  if (!(fin(fRing) && fRing >= 0 && fRing <= 1)) throw new RangeError('planeRates: 0 ≤ f_輪 ≤ 1');
  if (!DECL.senses.includes(sense)) throw new RangeError('planeRates: 歳差の向きは g2m・g2p');
  const sys = sysOf(id), orb = sys.orb, n = orb.W, sg = sense === 'g2p' ? 1 : -1, co = R3.r3Coeffs(fRing, 'N1');
  const Oa = OmAlign || Om, perp = add(Oa, scl(n, -dot(Oa, n)));
  const Ldot = scl(add(scl(crs(Om, n), sg * co.kPrec), scl(perp, co.kTilt)), cRing);
  const apsW = sg * cRing * co.kPrec * dot(Om, n);
  const A = MB.anglesRates(orb, { Ldot, apsW }, [0, 0, 1]), g = { sinI: nrm(crs([0, 0, 1], n)) };
  const nodeOk = !DECL.nodeUndefined.includes(id) && !A.degenerate;
  return { Lmag: cy(nrm(Ldot)), Lvec: Ldot.map(cy), di: cy(A.di), dnode: nodeOk ? cy(A.dnode) : null, sinIdnode: cy(A.dnode * g.sinI), dvarpi: cy(A.dvarpi), apsW: cy(apsW), domega: cy(A.domega), _Ldot: Ldot };
}

/* ───────── 約束の口 ───────── */
/**
 * orbRate(id, combo, { u, cRing = 1, fRing = 0, sense = 'g2m', alignTo = 'all' }) —— 受け手 id × 組 combo の道の率(″/世紀)。返す {
 *   id, combo, k, u, cRing, fRing, sense, locOverBg(第353便u)・omCy(合成の大きさ × c_輪 —— ″/世紀)・bgCy(背景 × c_輪)・locCy(局所 × c_輪)・omToNormalDeg(合成と道の法線の角)・
 *   full(全部)・common(背景だけ —— 全部の惑星に同じ回転)・diff(差 = k × 局所)の 3 つの planeRates・normalVsRepoDeg(第337便b の法線と第353便u の法線の角)}
 */
export function orbRate(id, combo, { u = DECL.uFocus, cRing = 1, fRing = 0, sense = DECL.mainSense, alignTo = 'all', T1, GEO, cache } = {}) {
  if (!DECL.recvs.includes(id)) throw new RangeError('orbRate: 受け手は ' + DECL.recvs.join('・'));
  if (!(fin(u) && u > 0)) throw new RangeError('orbRate: u > 0');
  if (!DECL.alignTo.includes(alignTo)) throw new RangeError('orbRate: 寄る先は all・bg');
  const C = ctx({ T1, GEO, cache }), r = U.nearState(id, combo, { u, T1: C.T1, GEO: C.GEO, cache: C.cache }), st = r._st;
  const Om = st.Om, bg = st.bg, loc = st.local, sys = sysOf(id);
  const o = { cRing, fRing, sense }, Oa = alignTo === 'bg' ? bg : Om;
  const full = planeRates(id, Om, { ...o, OmAlign: Oa }), common = planeRates(id, bg, { ...o, OmAlign: alignTo === 'bg' ? bg : bg }), diff = planeRates(id, loc, { ...o, OmAlign: alignTo === 'bg' ? [0, 0, 0] : loc });
  return { id, combo: r.combo, k: r.k, u, cRing, fRing, sense, alignTo, locOverBg: r.locOverBg,
    omCy: cy(nrm(Om)) * cRing, bgCy: cy(nrm(bg)) * cRing, locCy: cy(nrm(loc)) * cRing, omToNormalDeg: angDeg(Om, sys.orb.W), normalVsRepoDeg: angDeg(st.nHat, sys.orb.W),
    full, common, diff };
}
/**
 * ratioRow(id, combo, { u, cRing = 1, sense }) —— 表 2 の 1 行(c_輪 1 の率 ÷ 比べる尺度): {
 *   id, combo, k, lit, full{ varpi, node }・diff{ varpi, node }(比 —— 交点が無ければ null)・maxFull・maxDiff(近点と交点の大きい方)・
 *   cMaxFull = 1 ÷ maxFull・cMaxDiff = 1 ÷ maxDiff(比が 1 になる c_輪 —— 上限・0 の率なら null)・overFull・overDiff(比 > 1)}
 */
export function ratioRow(id, combo, { u = DECL.uFocus, sense = DECL.mainSense, T1, GEO, cache } = {}) {
  const R = orbRate(id, combo, { u, cRing: 1, fRing: 0, sense, T1, GEO, cache }), L = litOf(id);
  const rr = (p) => ({ varpi: Math.abs(p.dvarpi) / L.scaleVarpi, node: p.dnode === null || L.scaleNode === null ? null : Math.abs(p.dnode) / L.scaleNode });
  const mx = (q) => Math.max(q.varpi, q.node === null ? 0 : q.node);
  const f = rr(R.full), d = rr(R.diff), mf = mx(f), md = mx(d);
  return { id, combo: R.combo, k: R.k, lit: L, full: f, diff: d, maxFull: mf, maxDiff: md,
    cMaxFull: mf > 0 ? 1 / mf : null, cMaxDiff: md > 0 ? 1 / md : null, overFull: mf > 1, overDiff: md > 1, rates: R };
}
/**
 * gatherRow(id, combo, { u, sense }) —— 公転面が寄る下限(第353便x の ringNeed・第352便w の fRingMin —— 散らばり 30° → 7°・年齢の間・寄る先は背景)の 2 つの端での道の率と比:
 *   (A) c_輪 1・f_輪 = 下限(1.15e-2)/(B) c_輪 = 寄れる下限(0.0117)・f_輪 1(寄る分だけ)。返す { kMin, fRingAt1, A{ rates, ratio }, B{ rates, ratio }, alignCy(寄る分の |dn̂/dt| の下限 = x sin θ_L ÷ 年齢 —— ″/世紀), thetaLDeg }
 */
export function gatherRow(id, combo, { u = DECL.uFocus, sense = DECL.mainSense, T1, GEO, cache } = {}) {
  const need = X.ringNeed(1, { u }), L = litOf(id), C = ctx({ T1, GEO, cache });
  const rr = (p) => ({ varpi: Math.abs(p.dvarpi) / L.scaleVarpi, node: p.dnode === null || L.scaleNode === null ? null : Math.abs(p.dnode) / L.scaleNode });
  const A = orbRate(id, combo, { u, cRing: 1, fRing: need.fRing, sense, alignTo: 'bg', ...C });
  const B = orbRate(id, combo, { u, cRing: need.kMin, fRing: 1, sense, alignTo: 'bg', ...C });
  const st = U.nearState(id, combo, { u, T1: C.T1, GEO: C.GEO, cache: C.cache })._st, sys = sysOf(id), th = angDeg(st.bg, sys.orb.W);
  const x = Math.log(Math.tan(DECL.spread[0] * D2R / 2) / Math.tan(DECL.spread[1] * D2R / 2));
  return { id, combo: A.combo, kMin: need.kMin, fRingAt1: need.fRing, thetaLDeg: th, alignCy: cy(x * Math.sin(th * D2R) / (DECL.ageYr * 365.25 * 86400)),
    A: { rates: A.full, ratio: rr(A.full) }, B: { rates: B.full, ratio: rr(B.full) } };
}
/** 在位の組(1PN の値に当たる組)の水星の面内の近点の率(″/世紀 —— 正本の記録の数を文字で持つ・動かさない)と、第337便i の環で絞った回転引きずりの水星の比 */
export const INPOS = Object.freeze({
  w333c: Object.freeze({ value: '42.9805', what: '第333便c の G_loc(受け手 n = 2)+ K1 の面内の近点の和(sumApsIn)' }),
  w335c: Object.freeze({ value: '42.9805', what: '第335便c の分解の 1PN の率(q1cy —— 基準の列 G_loc + 統合した並進の並進の分の和と同じ桁)' }),
  w337b: Object.freeze({ value: '42.9795', what: '第337便b の分解の 1PN の率(q1cy —— JPL の近似要素の水星)' }),
  rot337i: Object.freeze(['4.22e-19', '8.98e-11', '1.22e-10']),
});
/** 第337便b の系の水星の 1PN の面内の近点の率(″/世紀 —— 零試験: INPOS.w337b と同じ桁) */
export function q1cy(id = 'Mercury') { const s = sysOf(id); return cy(MB.q1PNPerOrbit(s.orb.mu, s.orb.a, s.orb.e) / MB.periodOf(s.orb)); }
/** 表 3 の 1 行: 在位の組の値に、近点の率 dvarpi(c_輪 = c)を足したずれ(″/世紀と割合)—— 在位の組そのものは動かさない */
export function inposShift(dvarpiCy, c = 1) {
  return Object.keys(INPOS).filter((k) => k !== 'rot337i').map((k) => { const v = Number(INPOS[k].value), s = dvarpiCy * c; return { set: k, value: v, shift: s, after: v + s, frac: s / v }; });
}

/* ───────── 零試験 ───────── */
/** 枝 b の背景の率(0.98 × ω_G = 5.80e-3″/年 = 0.580″/世紀)・枝 u の局所 ÷ 背景(規則の半径の組)・第335便c の LIT・統括の数え直し 3 の点検の数(文字で持つ) */
export const ANCHOR = Object.freeze({
  bgAsYr: '5.80e-3', bgCy: '0.580',
  locRule: Object.freeze({ Mercury: '6.53e+0', Earth: '3.77e-1', Mars: '1.07e-1' }),
  lit: Object.freeze({ Mercury: Object.freeze([-0.0020, 0.0030, 0.0014, 0.0018]), Mars: Object.freeze([-0.000020, 0.000037, -0.00005, 0.00013]) }),
  kRule: '8.22e+11', omegaG: 9.09e-16, fRingBg: '1.15e-2', kMin: '1.17e-2', q1Merc: '42.98',
});
export function pureScenes(T1 = E.t1Table(), GEO = E.geometry()) {
  const cache = {}, o = { T1, GEO, cache }, rel = (a, b) => (a === b ? 0 : Math.abs(a / b - 1)), Cl = U.comboList(T1, GEO);
  // (1) k1・c_輪 1: 合成の大きさ = 0.98 ω_G(全部の惑星で同じ)・差 0
  const k1 = DECL.recvs.map((id) => orbRate(id, 'k1', o));
  const bgVs = Math.max(...k1.map((r) => rel(r.omCy / 100, DECL.uFocus * DECL.omegaG * ASYR)));
  const k1DiffZero = Math.max(...k1.map((r) => r.locCy / r.bgCy));
  // (2) 局所 ÷ 背景 = 第353便u の nearState(規則の半径)・金星は組ごとに 1(k の定め)
  const locRule = Object.fromEntries(['Mercury', 'Earth', 'Mars'].map((id) => [id, Number(orbRate(id, 'rule', o).locOverBg).toExponential(2)]));
  const venusOne = Math.max(...Cl.slice(1).map((c) => Math.abs(orbRate('Venus', c.id, o).locOverBg - 1)));
  // (3) 率の作り = 第352便d の precDs と poleRates(黄道の極のまわりの方位の率 = 交点の率・傾きの率)—— 水星・金星・火星 × 組 9
  let prVs = 0;
  for (const id of ['Mercury', 'Venus', 'Mars']) for (const c of Cl) {
    const r = orbRate(id, c.id, o), n = sysOf(id).orb.W, Om = U.nearState(id, c.id, o)._st.Om;
    const ds = D.precDs(n, Om, { sense: 'g2m' }), q = D.poleRates([0, 0, 1], n, ds), Ld = r.full._Ldot;
    prVs = Math.max(prVs, Math.max(...ds.map((x, i) => Math.abs(x - Ld[i]))) / nrm(ds), rel(r.full.dnode, cy(q.az)), rel(r.full.di, cy(q.inc)));
  }
  // (4) 一次: 全部 = 共通 + 差(近点・交点・傾き)・c_輪 に比例・(g2+) は符号だけ替わる
  let linVs = 0;
  for (const id of DECL.recvs) for (const c of Cl.slice(1, 4)) {
    const r = orbRate(id, c.id, o), h = orbRate(id, c.id, { ...o, cRing: 0.1 }), p = orbRate(id, c.id, { ...o, sense: 'g2p' });
    for (const q of ['dvarpi', 'di', 'Lmag']) linVs = Math.max(linVs, q === 'Lmag' ? 0 : Math.abs(r.full[q] - r.common[q] - r.diff[q]) / Math.max(Math.abs(r.full[q]), Math.abs(r.common[q]), Math.abs(r.diff[q])),
      rel(h.full[q], 0.1 * r.full[q]), q === 'Lmag' ? rel(p.full[q], r.full[q]) : rel(-p.full[q], r.full[q]));
  }
  // (5) 剛体の回転の面内の近点 = σ c Ω·n̂(k1 の水星で dϖ と apsW の差は (1 − cos i) dΩ_node)
  const m = orbRate('Mercury', 'k1', o), sM = sysOf('Mercury'), iM = Math.acos(sM.orb.W[2]);
  const varpiVs = Math.abs(m.full.dvarpi - (m.full.apsW + (1 - Math.cos(iM)) * m.full.dnode)) / Math.abs(m.full.dvarpi);
  // (6) 文献の値 = 第335便c の LIT(火星の近点は訂正の後)・地球の交点は数なし
  const lit = { Mercury: litOf('Mercury'), Mars: litOf('Mars'), Earth: litOf('Earth') };
  // (7) 公転面が寄る下限 = 第353便e の fRingAt(0.98)・第353便x の ringNeed の kMin
  const g = gatherRow('Earth', 'k1', o), fRingVs = rel(g.fRingAt1, FE.fRingAt(0.98));
  const kr = U.kOf('rule', { T1, GEO }), q1 = q1cy('Mercury'), nVs = Math.max(...DECL.recvs.map((id) => orbRate(id, 'k1', o).normalVsRepoDeg));
  const rej = [() => orbRate('Jupiter', 'k1'), () => orbRate('Earth', 'x'), () => orbRate('Earth', 'k1', { u: 0 }), () => orbRate('Earth', 'k1', { cRing: -1 }),
    () => orbRate('Earth', 'k1', { fRing: 2 }), () => orbRate('Earth', 'k1', { sense: 'x' }), () => litOf('Moon'), () => planeRates('Earth', [0, 0])]
    .map((f) => { try { f(); return false; } catch (e) { return e instanceof RangeError; } });
  return { bgVs, bgAsYr: k1[0].omCy / 100, bgCy: k1[0].omCy, k1DiffZero, locRule, venusOne, prVs, linVs, varpiVs, lit, fRingVs, fRingAt1: g.fRingAt1, kMin: g.kMin,
    earthNodeNull: orbRate('Earth', 'rule', o).full.dnode === null && lit.Earth.dnode === null, kr, q1, nVs, omegaG: DECL.omegaG, rejects: rej };
}
export function pureGates(S) {
  const e2 = (x) => Number(x).toExponential(2), same4 = (L, a) => [L.dvarpi[0], L.dvarpi[1], L.dnode[0], L.dnode[1]].every((x, i) => x === a[i]);
  return {
    bgRate: S.bgVs <= 1e-9 && e2(S.bgAsYr) === ANCHOR.bgAsYr && S.bgCy.toFixed(3) === ANCHOR.bgCy,
    k1Common: S.k1DiffZero <= 1e-9,
    locU: Object.keys(ANCHOR.locRule).every((id) => S.locRule[id] === ANCHOR.locRule[id]),
    venusOne: S.venusOne <= 1e-6,
    precSame: S.prVs <= 1e-9,
    linear: S.linVs <= 1e-9,
    varpiSplit: S.varpiVs <= 1e-9,
    litC: same4(S.lit.Mercury, ANCHOR.lit.Mercury) && same4(S.lit.Mars, ANCHOR.lit.Mars),
    earthNode: S.earthNodeNull,
    fRing: S.fRingVs <= 1e-12 && e2(S.fRingAt1) === ANCHOR.fRingBg && e2(S.kMin) === ANCHOR.kMin,
    kRule: e2(S.kr) === ANCHOR.kRule && S.omegaG === ANCHOR.omegaG,
    q1Merc: S.q1.toFixed(2) === ANCHOR.q1Merc,
    normals: S.nVs <= 0.5,
    rejects: S.rejects.every(Boolean),
  };
}
