// 第353便r(原仮定者の回答(2026-11-25 —— 第151報)・統括の検証項目 R482):
//   **歳差の率の残り(仮の値 − 重力の側の潮汐のトルクの列)を、主の列の軸引きずり((g2−)・(N+)・基準軸 L・(S) 規則の半径)で読むときに「要る応答の係数 c」を、
//   入力の幅(リポジトリの数の最後の桁 ±1・仮の値の 1σ)つきの区間で数え、地球と火星の区間が重なるか・1 つの共通の値(c × u)で 2 つの残りを同時に幅の内に入れられる範囲を数える純関数 —— 診断だけ**
//   (器 tests/exp-w353r-residfit.mjs と QA behavior.residfit353r・docs.residfit353r が読む —— html を読まない・ファイルを読まない・状態を持たない。後のラウンドの枝もこの口を import してよい)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない。既存の lib は呼ぶだけ(本文は変えない):
//   第353便m(earthGrav・digitSwing・widthParts・lastDigitRel —— 月の道の置き方・離心率の倍・入力の振れ)・第353便f(tideRate・dragRate・provRate・sumRow・cUpper —— 符号つきの和)・
//   第353便e(fMaxAt・focusState —— 傾きを保つ f の上限・太陽の歳差の周)・第353便c(rateMult —— (P-応) の率の倍)・第352便q(candOf —— 構造の量の式の候補)・
//   第352便y(gravPert・pertSteps・lastDigit —— 入力の振れ)・第352便u(gravSrcs)・第352便c(refAxis)・第352便b(prov・tagProv —— 仮の値)・第299便c(PLANETS —— 火星・金星の離心率)・第347便e(t1Table・geometry)。
//
// ■ 語: **残り** = 仮の値(符号つき・家の極 —— 第353便f の provRate)− 重力の列(比べる列 —— DFM の式ではない)。**要る c** = 残り ÷ (c 1 の軸引きずりの方位の率)(符号つき)。
//   **入力の幅**(上下の振れの大きい方の和): 'digit' = J2・慣性モーメントの係数(第352便y の pertSteps の最後の桁)+ 質量と距離(最後の桁 —— 第353便m の lastDigitRel の作り)+ 仮の値の 1σ/
//   'all' = 'digit' + 宣言の角の幅(自転軸の傾き・月の道 0.01° —— 第352便y の pertSteps)/'none' = 幅なし(中心だけ)。入力の振れは月の道 'fixed'・円の置き方のまわりの第352便y の振れを使い、
//   質量と距離の振れは各行の置き方のまわりで数える。
//   **月の道の置き方**(地球だけ —— 第353便m): 'fixed'・'ecl'・'avg'(交点の 1 巡 18.6 年の平均)。**離心率の倍**('none'・'repo' —— 1 公転の平均の 1/r³ = (1 − e²)^(−3/2) ÷ a³):
//   地球は第353便m の earthGrav(月 0.0549・太陽 0.0167)・火星・金星は太陽の項に e(第299便c の PLANETS の el.e —— リポジトリの数・文献の値・未照合)。
//   **共通の値** X = c × u(背景の倍率 u と応答の係数 c の積 —— 局所の (S) は背景の 1e-10 倍以下なので、率はほぼ X だけで決まる)。
// ■ 言わないこと: 残りが軸引きずりで読み切れたとは書かない・応答の係数の値を 1 つに置かない(区間の表)。重力の側の列を DFM の結果と書かない。仮の値を合否に使わない(印つき)。
import * as M from './lib-w353m-residsign.mjs';
import * as F from './lib-w353f-ratesum.mjs';
import * as EF from './lib-w353e-focus098.mjs';
import * as CR from './lib-w353c-recvradius.mjs';
import * as Q from './lib-w352q-response.mjs';
import * as Y from './lib-w352y-bgwindow.mjs';
import * as U from './lib-w352u-tidaldrag.mjs';
import * as RC from './lib-w352c-refaxis.mjs';
import * as B from './lib-w352b-provisional.mjs';
import * as P299 from './lib-w299c-planets3d.mjs';
import * as E from './lib-w347e-spintorque.mjs';

export const LIB_VERSION = 'w353r-residfit-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const { dot, nrm, scl, unit } = U.vec;
const D2R = Math.PI / 180;

/* ───────── 宣言(走らせたノブの格子と判定の物差しの記録 —— 式の形の宣言ではない)───────── */
export const DECL = Object.freeze({
  bodies: Object.freeze(['Earth', 'Mars', 'Venus']),
  moonModes: Object.freeze(['fixed', 'ecl', 'avg']),
  eModes: Object.freeze(['none', 'repo']),
  pertModes: Object.freeze(['digit', 'all', 'none']),
  pertLabels: Object.freeze({ digit: '最後の桁 ±1 + 仮の値の 1σ', all: '最後の桁 + 宣言の角の幅 0.01° + 仮の値の 1σ', none: '幅なし(中心だけ)' }),
  /** 火星・金星の離心率(第299便c の PLANETS の el.e —— リポジトリの数・文献の値・未照合) */
  ecc: Object.freeze({ Mars: 0.0933941, Venus: 0.00677672 }), eccFrom: 'tests/lib-w299c-planets3d.mjs の PLANETS の el.e(文献の値・未照合)',
  /** 主の列の u(注目の列 0.98)・窓の下端と上端((N+)) */
  uMain: 0.98, uWin: Object.freeze([0.0487, 0.835]),
  /** 予告の天体(比べる数なし) */
  previewBodies: Object.freeze(['Mercury', 'Jupiter', 'Saturn']),
  /** 傾きを保つ f の上限を数える受け手(第353便e の fMaxAt の key) */
  fKeys: Object.freeze(['Sun|-', 'Earth|Sun', 'Mars|Sun', 'Jupiter|Sun']),
  /** u 0.98 の傾きを保つ f の上限(統括の数え直し 3 —— 零試験の相手) */
  fAnchor: Object.freeze({ 'Sun|-': '8.34e-4', 'Earth|Sun': '8.53e-4', 'Mars|Sun': '8.57e-4', 'Jupiter|Sun': '8.33e-4' }),
  /** 構造の量の式の候補(第352便q の candOf の欄): (イ) 1 ÷ ω・(ウ) n² ÷ ω・(ウ′) n² J2 ÷ (ω C/MR²) */
  cands: Object.freeze(['i', 'u', 'uJ']), candLabels: Object.freeze({ i: '(イ) 1 ÷ ω', u: '(ウ) n² ÷ ω', uJ: '(ウ′) n² J2 ÷ (ω × 慣性モーメントの係数)' }),
  /** 第353便m・f の数(文字で持つ —— 零試験の相手) */
  anchorM: Object.freeze({ cNeed: Object.freeze({ fixed: '-967', ecl: '-44.6', avg: '29.0', avgE: '0.511' }), resid: Object.freeze({ fixed: '5.50', ecl: '0.253', avg: '-0.165', avgE: '-0.00291' }),
    cMars: '24.4', cVenus: '1.58e+3', pert: Object.freeze({ Earth: '0.0347', Mars: '0.00303', Venus: '1.45' }) }),
  /** 統括の数え直し 3 の点検の数 */
  anchor3: Object.freeze({ L: Object.freeze([0.026257, 0.008317, 0.999621]), Ltol: 5e-7, omegaG: 9.09e-16, phiVenusDeg: 0.7606 }),
  floor: 1e-12, judge: '区間の端は上下の振れの大きい方の和で置く(片側ずつの和 —— 振れどうしの相関は入れない)',
});

const ctx = (o = {}) => F.ctxOf(o);
const eccFac = (e) => Math.pow(1 - e * e, -1.5);
const checkId = (id) => { if (!DECL.bodies.includes(id)) throw new RangeError('受け手は ' + DECL.bodies.join('・')); };
const r12 = (x) => Number(Number(x).toPrecision(12));

/* ───────── 重力の列(置き方つき)───────── */
/**
 * 受け手 id の重力の列(家の極・″/年)と残り(仮 − 重力 —— 印つき)。地球は第353便m の earthGrav(moon・ecc)・火星と金星は第353便f の tideRate × 離心率の倍。
 * 返す { id, moon, ecc, grav, terms[{ src, az, dM, da }], prov, resid }。
 */
export function gravRow(id, { moon = 'fixed', ecc = 'none' } = {}, o = {}) {
  checkId(id);
  if (!DECL.eModes.includes(ecc)) throw new RangeError('gravRow: 離心率の置き方は none・repo');
  const Cx = ctx(o), R = M.lastDigitRel();
  if (id === 'Earth') {
    if (!DECL.moonModes.includes(moon)) throw new RangeError('gravRow: 月の道は ' + DECL.moonModes.join('・'));
    const g = M.earthGrav({ moon, ecc }, o);
    return B.tagProv({ id, moon, ecc, grav: g.az, terms: [{ src: 'Sun', az: g.sun, dM: R.dMsun, da: R.daSun }, { src: 'Moon', az: g.moon_, dM: R.dMmoon, da: R.daMoon }], prov: g.prov, resid: g.resid }, g.provKeys);
  }
  const t = F.tideRate(id, {}, o), fac = ecc === 'repo' ? eccFac(DECL.ecc[id]) : 1, grav = t.az * fac, P = F.provRate(id, { venusSense: 'tide' }, o);
  const s = U.gravSrcs(Cx.T1, Cx.GEO, id, F.DECL.srcSet[id])[0], a = r12(s.a);
  return B.tagProv({ id, moon: null, ecc, grav, terms: [{ src: 'Sun', az: grav, dM: R.dMsun, da: Y.lastDigit(a) / a }], prov: P.value, resid: P.value - grav }, P.provKeys);
}
/** 質量と距離の最後の桁の振れ(項ごとに abs(az) × dM + abs(az) × 距離の上下の大きい方 —— 重力の列は GM ÷ a³ に比例) */
export function digitOf(terms) {
  return terms.reduce((s, t) => s + Math.abs(t.az) * t.dM + Math.abs(t.az) * Math.max(Math.pow(1 - t.da, -3) - 1, 1 - Math.pow(1 + t.da, -3)), 0);
}
/** 第352便y の振れを、最後の桁(J2・慣性モーメントの係数)と宣言の角(傾き・月の道)に分ける */
export function yParts(id, o = {}) {
  const Cx = ctx(o), ck = 'ry|' + id;
  if (Cx.cache[ck]) return Cx.cache[ck];
  const base = Y.gravPert(Cx.T1, Cx.GEO, id).az, neg = (st) => Object.fromEntries(Object.entries(st).map(([k, v]) => [k, -v])), out = { digitY: 0, angle: 0 };
  for (const [name, st] of Y.pertSteps(Cx.T1, Cx.GEO, id)) {
    const d = Math.max(Math.abs(Y.gravPert(Cx.T1, Cx.GEO, id, st).az - base), Math.abs(Y.gravPert(Cx.T1, Cx.GEO, id, neg(st)).az - base));
    if (name === 'J2' || name === 'moi') out.digitY += d; else out.angle += d;
  }
  Cx.cache[ck] = out; return out;
}
/** 仮の値の 1σ(σ・sigmaGiven —— 無ければ 0) */
export function sigOf(id) { const e = B.prov(F.DECL.provKeys[id]); return fin(e.sigma) ? e.sigma : fin(e.sigmaGiven) ? e.sigmaGiven : 0; }

/* ───────── 約束の口 ───────── */
/**
 * 要る c と、入力の幅での区間。u(背景の倍率)・moon(地球の月の道)・ecc(離心率の倍)・pert(幅の置き方 'digit'・'all'・'none')。
 * 返す { id, u, moon, ecc, pert, grav, prov, resid, drag1(c 1 の方位の率), cNeed(符号つき), parts{ digitY, digitMD, angle, sig }, width, cLo, cHi, xLo, xHi(= c × u の区間), x(= cNeed × u),
 *        inWidth(区間が 0 を含む —— 上限としてだけ), cUpper(abs の上限 —— 第353便f の cUpper), fill(c > 0 で埋める向き) }(印つき)。
 */
export function needC(id, { u = DECL.uMain, moon = 'fixed', ecc = 'none', pert = 'digit' } = {}, o = {}) {
  checkId(id);
  if (!DECL.pertModes.includes(pert)) throw new RangeError('needC: 幅の置き方は ' + DECL.pertModes.join('・'));
  if (!(fin(u) && u > 0)) throw new RangeError('needC: u > 0');
  const g = gravRow(id, { moon: id === 'Earth' ? moon : 'fixed', ecc }, o), d = F.dragRate(id, { u }, o).az, yp = yParts(id, o);
  const parts = { digitY: yp.digitY, digitMD: digitOf(g.terms), angle: yp.angle, sig: sigOf(id) };
  const width = pert === 'none' ? 0 : parts.digitY + parts.digitMD + parts.sig + (pert === 'all' ? parts.angle : 0);
  const cA = (g.resid - width) / d, cB = (g.resid + width) / d, cLo = Math.min(cA, cB), cHi = Math.max(cA, cB), cNeed = g.resid / d;
  return B.tagProv({ id, u, moon: id === 'Earth' ? moon : null, ecc, pert, grav: g.grav, prov: g.prov, resid: g.resid, drag1: d, cNeed, parts, width, cLo, cHi, xLo: cLo * u, xHi: cHi * u, x: cNeed * u,
    inWidth: Math.abs(g.resid) <= width, cUpper: F.cUpper(d, Math.abs(g.resid), width), fill: Math.sign(g.resid) === Math.sign(d) }, g.provKeys);
}
/** 2 つの区間の重なり([lo, hi] か null) */
export function overlap(a, b) { const lo = Math.max(a[0], b[0]), hi = Math.min(a[1], b[1]); return lo <= hi ? [lo, hi] : null; }
/**
 * 地球の行 e と火星の行 m(needC の戻り)で、共通の値 X = c × u の範囲(2 つの区間の重なり)と、要る c の比(地球 ÷ 火星 —— 中心と区間)。
 * 返す { both(X の範囲 か null), ratio, ratioLo, ratioHi, gapRel(重ならないときの隙間 ÷ 火星の中心) }。
 */
export function pairOf(e, m) {
  const both = overlap([e.xLo, e.xHi], [m.xLo, m.xHi]), q = [e.xLo / m.xHi, e.xLo / m.xLo, e.xHi / m.xHi, e.xHi / m.xLo].filter(fin);
  const gap = both ? 0 : Math.max(e.xLo - m.xHi, m.xLo - e.xHi);
  return { both, ratio: e.x / m.x, ratioLo: m.xLo > 0 ? Math.min(...q) : null, ratioHi: m.xLo > 0 ? Math.max(...q) : null, gapRel: gap / Math.abs(m.x) };
}
/**
 * 共通の値 X を置いたときの帰結: (i) c 1 → u = X(背景の倍率)—— 窓の内か・傾きを保つ f の上限(第353便e の fMaxAt)・太陽の歳差の一周と年齢の内の周の数(focusState)/
 * (ii) u 0.98 → c = X ÷ 0.98(要る応答の係数)。
 */
export function atCommon(X, o = {}) {
  if (!(fin(X) && X > 0)) throw new RangeError('atCommon: X > 0');
  const Cx = ctx(o), fk = Object.fromEntries(DECL.fKeys.map((k) => [k, EF.fMaxAt(k, { u: X, T1: Cx.T1, GEO: Cx.GEO, cache: Cx.cache }).fMax]));
  const sun = EF.focusState(Cx.T1, Cx.GEO, 'Sun|-', { dir: 'Np', u: X }, Cx.cache);
  return { X, uAtC1: X, inWin: X >= DECL.uWin[0] && X <= DECL.uWin[1], overWinTop: X / DECL.uWin[1], fMax: fk, sunPeriodYr: sun.periodYr, sunTurnsAge: sun.turnsAge, cAtU098: X / DECL.uMain };
}
/**
 * 構造の量の式の候補で、地球と火星の要る c の比(地球 ÷ 火星)の区間に、候補の比 cand(地球) ÷ cand(火星) が入るか。(P-応) の率の倍(観測半径の物差し)も同じ表に。
 * 返す [{ cand, label, ratio, inside, scaleE(= 地球の中心の c ÷ cand(地球)) }]。
 */
export function candFit(e, m, o = {}) {
  const Cx = ctx(o), pr = pairOf(e, m), K = (id) => Q.candOf(Cx.T1, Cx.GEO, id, { bg: 'Np', axis: 'L', tSrc: 0, u: 1 });
  const kE = K('Earth'), kM = K('Mars'), rows = DECL.cands.map((c) => ({ cand: c, label: DECL.candLabels[c], vE: kE[c], vM: kM[c] }));
  rows.push({ cand: 'Presp', label: '(P-応) の率の倍(観測半径の物差し)', vE: CR.rateMult('Earth', { ref: 'obs' }), vM: CR.rateMult('Mars', { ref: 'obs' }) });
  return rows.map((r) => { const ratio = r.vE / r.vM; return { ...r, ratio, inside: pr.ratioLo !== null && ratio >= pr.ratioLo && ratio <= pr.ratioHi, scaleE: e.cNeed / r.vE }; });
}
/**
 * 共通の値 X(c × u)を置いたときの軸引きずりの方位の率(家の極・u 0.98・c = X ÷ 0.98)と重力の列の比(予告 —— 比べる数なし)。金星は上限との比。
 */
export function previewAt(id, X, o = {}) {
  const u = DECL.uMain, d = F.dragRate(id, { u, c: X / u }, o), t = F.tideRate(id, {}, o);
  return { id, X, drag: d.az, grav: t.az, ratio: fin(t.az) && t.az !== 0 ? d.az / t.az : null };
}

/* ───────── 零試験 ───────── */
export function pureScenes(T1 = E.t1Table(), GEO = E.geometry()) {
  const o = { T1, GEO, cache: {} }, p3 = (x) => Number(x).toPrecision(3);
  // ① 要る c(幅なし)= 第353便m の earthFill の cNeed(4 つの置き方)・第353便f の sumRow の cNeed(火星・金星)
  const em = { fixed: [{ moon: 'fixed' }], ecl: [{ moon: 'ecl' }], avg: [{ moon: 'avg' }], avgE: [{ moon: 'avg', ecc: 'repo' }] };
  const cErr = Object.entries(em).map(([, [a]]) => Math.abs(needC('Earth', { ...a, pert: 'none' }, o).cNeed / M.earthFill(a, {}, o).cNeed - 1));
  const residE = Object.fromEntries(Object.entries(em).map(([k, [a]]) => [k, needC('Earth', a, o).resid])), cE = Object.fromEntries(Object.entries(em).map(([k, [a]]) => [k, needC('Earth', a, o).cNeed]));
  const fM = F.sumRow('Mars', { u: 0.98 }, o), fV = F.sumRow('Venus', { u: 0.98 }, o), nM = needC('Mars', {}, o), nV = needC('Venus', {}, o);
  const fErr = [Math.abs(nM.cNeed / fM.cNeed - 1), Math.abs(nV.cNeed / fV.cNeed - 1), Math.abs(nM.resid / fM.resid - 1), Math.abs(nV.drag1 / fV.drag1 - 1)];
  // ② 幅: digitY + angle = 第353便m の widthParts の pert(第353便f の幅)・地球の digitMD = 第353便m の digitSwing(各置き方)・σ = widthParts の sig
  const wErr = DECL.bodies.map((id) => { const yp = yParts(id, o), w = M.widthParts(id, o); return Math.max(Math.abs((yp.digitY + yp.angle) / w.pert - 1), Math.abs(sigOf(id) - w.sig)); });
  const dErr = ['fixed', 'ecl', 'avg'].flatMap((m) => ['none', 'repo'].map((e) => Math.abs(needC('Earth', { moon: m, ecc: e }, o).parts.digitMD / M.digitSwing({ moon: m, ecc: e }, o) - 1)));
  // ③ 離心率: 火星・金星の e = 第299便c の PLANETS の el.e・重力の列の比 = (1 − e²)^(−3/2)
  const pl = (k) => P299.PLANETS.find((p) => p.key === k).el.e;
  const eErr = [Math.abs(DECL.ecc.Mars - pl('mars')), Math.abs(DECL.ecc.Venus - pl('venus'))];
  const facErr = ['Mars', 'Venus'].map((id) => Math.abs(gravRow(id, { ecc: 'repo' }, o).grav / gravRow(id, {}, o).grav / eccFac(DECL.ecc[id]) - 1));
  // ④ 区間の算術: cLo ≤ cNeed ≤ cHi・幅 0 で端が中心・X = c × u・u に反比例(局所の (S) は背景の 1e-10 倍以下)
  const ar = DECL.bodies.map((id) => { const r = needC(id, {}, o), z = needC(id, { pert: 'none' }, o), r2 = needC(id, { u: 0.49 }, o);
    return r.cLo <= r.cNeed && r.cNeed <= r.cHi && z.cLo === z.cHi && Math.abs(r.x - r.cNeed * r.u) <= 1e-12 * Math.abs(r.x) && Math.abs(r2.x / r.x - 1) < 1e-6; });
  // ⑤ 上限 = 第353便f の cUpper・区間が 0 を含む ⇔ inWidth
  const upErr = DECL.bodies.map((id) => { const r = needC(id, {}, o); return Math.abs(r.cUpper - F.cUpper(r.drag1, Math.abs(r.resid), r.width)) / r.cUpper + ((r.cLo <= 0 && r.cHi >= 0) === r.inWidth ? 0 : 1); });
  // ⑥ 重なり
  const ov = [overlap([0, 2], [1, 3]), overlap([0, 1], [2, 3]), overlap([0, 2], [2, 3])];
  // ⑦ 統括の数え直し 3
  const L = RC.refAxis('L', T1, GEO), Lerr = Math.max(...L.map((x, i) => Math.abs(x - DECL.anchor3.L[i]))), omegaG = nrm(F.bgOf({ u: 1 }, o));
  const phiV = Math.acos(Math.max(-1, Math.min(1, dot(scl(unit(F.localOf('Venus', {}, o)), -1), L)))) / D2R;
  // ⑧ 傾きを保つ f の上限(u 0.98)= 統括の数え直し 3 の数(第353便e の fMaxAt)
  const fA = Object.fromEntries(Object.entries(atCommon(0.98, o).fMax).map(([k, v]) => [k, Number(v).toExponential(2)]));
  // ⑨ 拒否
  const rej = [() => needC('Pluto', {}, o), () => needC('Earth', { pert: 'x' }, o), () => needC('Earth', { u: 0 }, o), () => gravRow('Earth', { moon: 'node' }, o), () => gravRow('Mars', { ecc: 'x' }, o), () => atCommon(-1, o)]
    .map((fn) => { try { fn(); return false; } catch (e) { return e instanceof RangeError; } });
  return { cErr, residE: Object.fromEntries(Object.entries(residE).map(([k, v]) => [k, p3(v)])), cE: Object.fromEntries(Object.entries(cE).map(([k, v]) => [k, p3(v)])), cM: p3(nM.cNeed), cV: p3(nV.cNeed),
    fErr, wErr, dErr, pert: Object.fromEntries(DECL.bodies.map((id) => [id, p3(M.widthParts(id, o).pert)])), eErr, facErr, ar, upErr, ov, Lerr, omegaG, phiV, fA, rejects: rej };
}
export function pureGates(S) {
  const A = DECL.anchorM;
  return {
    cIsM: S.cErr.every((e) => e < 1e-9) && Object.entries(A.cNeed).every(([k, v]) => S.cE[k] === v) && Object.entries(A.resid).every(([k, v]) => S.residE[k] === v),
    cIsF: S.fErr.every((e) => e < 1e-9) && S.cM === A.cMars && S.cV === A.cVenus,
    widthIsM: S.wErr.every((e) => e < 1e-9) && S.dErr.every((e) => e < 1e-9) && Object.entries(A.pert).every(([k, v]) => S.pert[k] === v),
    eccRepo: S.eErr.every((e) => e < 1e-12) && S.facErr.every((e) => e < 1e-9),
    interval: S.ar.every(Boolean) && S.upErr.every((e) => e < 1e-9),
    overlap: JSON.stringify(S.ov) === JSON.stringify([[1, 2], null, [2, 2]]),
    anchor3: S.Lerr < DECL.anchor3.Ltol && Math.abs(S.omegaG / DECL.anchor3.omegaG - 1) < 1e-9 && Number(S.phiV).toFixed(4) === DECL.anchor3.phiVenusDeg.toFixed(4),
    fMaxIsE: Object.entries(DECL.fAnchor).every(([k, v]) => S.fA[k] === v),
    rejects: S.rejects.length === 6 && S.rejects.every(Boolean),
  };
}
