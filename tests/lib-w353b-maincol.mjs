// 第353便b(原仮定者の回答(2026-11-25 —— 第151報)・統括の検証項目 R466):
//   **回答で主に置いた列 —— 局所の主の成分 (S)(源の自転の分)・背景の向き (N+)(太陽系の基準軸の向き)・基準軸 L(角運動量の重み)・歳差の式 (g2−) = −Ω × ŝ・
//   源の半径 = 規則の半径(tSrc 0)—— だけで、8 惑星と太陽の「合成の向き・円錐の半頂角・歳差の回る向きと率」を 1 つの口 mainState にまとめ、背景の倍率の格子の表 mainTable を作る —— 診断だけ**
//   (器 tests/exp-w353b-maincol.mjs と QA behavior.maincol353b・docs.maincol353b が読む —— html を読まない・ファイルを読まない・状態を持たない。後のラウンドの枝もこの口を import してよい)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない。既存の lib は呼ぶだけ(本文は変えない):
//   第352便k(spinRot —— (S) の源の半径・受け手の半径の置き方)・第352便d(bgVec・precDs・poleRates —— 背景のベクトル・経路 ② の向き・方位の率と傾きの率)・
//   第352便c(refAxes —— 基準軸)・第352便e(sunLocal・sunTotal —— 太陽を受け手に)・第352便w(stateW —— 零試験の照合)・
//   第352便j(cellOf・uOf・provRefs・provCompare —— 零試験の照合と、仮の値〔第352便b〕との並べ —— 「仮・未照合」の印つき・合否にしない)・第347便e(t1Table・geometry)。
//   **第352便j を通じて仮の値の lib(第352便b)に届く** —— この lib を呼ぶ段の正本は、最上位に provisional: true と使った鍵の一覧を持つ。
//
// ■ 主の列(MAIN —— 第151報の回答): part 'S'・dir 'Np'・axis 'L'・sense 'g2m'・tSrc 0・cR null(受け手の半径の入れ方は枝 c が候補を数える —— 引数で渡せる)。
//   比べる列(消さない —— 主の列と同じ重さでは扱わない): sense 'g2p'((g2+) = +Ω × ŝ)・dir 'Gm'((G−) 銀河の回転と逆向き)・axis 'eq'(等しい重み)。
// ■ 語: ŝ = 受け手の自転軸の単位ベクトル(逆行の天体〔金星・天王星〕は ŝ の向きに入れる —— 式の側で再度ひっくり返さない)。Ω = 背景 + k × 局所 (S)(rad/s)。
//   背景 = 倍率 u × 銀河の公転の角速度 ω_G(第352便d の bgVec)。円錐の半頂角 = ŝ と Ω の角。単位の応答 = 経路 ② だけ・k₂ 1・比 1(dŝ/dt = ∓ Ω × ŝ)。
//   極 p のまわりの方位の率 az(右ねじで正)と傾きの率 inc(傾きが増える向きを正)は第352便d の poleRates。極: 'om' 合成の軸・'ax' 基準軸・'orb' 自分の公転の北極・'ecl' 黄道の極。
//   順回転 = ŝ·Ω > 0(spinOm +1)。自転が基準軸に対して順行 = ŝ·(基準軸) > 0(spinAx +1)。相対の回り rel = sign(極のまわりの方位の率) × (その極に対する自転の向き)
//   (+1 = 自転と同じ回り・−1 = 逆回り —— 「順回転なら、歳差運動は逆回転になる」の「逆回転」は rel −1)。
// ■ 言わないこと: 歳差の向きの答え・観測との比べの答えとは書かない(この列・この倍率では、の表)。歳差の率と向きの本体は重力の側の列(AN1052 イ —— 比べる列・DFM の式ではない)
//   で読むのが主で、ここの率は軸引きずりの単位の応答。仮の値との並べは「仮・未照合」の印つきで合否にしない。
import * as K from './lib-w352k-spinform.mjs';
import * as D from './lib-w352d-precsense.mjs';
import * as CR from './lib-w352c-refaxis.mjs';
import * as SR from './lib-w352e-sunrecv.mjs';
import * as W from './lib-w352w-keepcone.mjs';
import * as J from './lib-w352j-maintable.mjs';
import * as B from './lib-w352b-provisional.mjs';
import * as E from './lib-w347e-spintorque.mjs';

export const LIB_VERSION = 'w353b-maincol-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const D2R = Math.PI / 180;
const { dot, crs, nrm, scl, add, sub, unit } = K.vec;
const isVec = (a) => Array.isArray(a) && a.length === 3 && a.every(fin);
const sg = (x) => (x === null || x === undefined ? null : x > 0 ? 1 : x < 0 ? -1 : 0);
export const ASYR = D.ASYR;
export const YR = 365.25 * 86400;
const angDeg = (a, b) => (nrm(a) > 0 && nrm(b) > 0 ? Math.atan2(nrm(crs(a, b)), dot(a, b)) / D2R : null);

/* ───────── 宣言 ───────── */
/** 主の列(第151報の回答) */
export const MAIN = Object.freeze({ part: 'S', dir: 'Np', axis: 'L', sense: 'g2m', tSrc: 0, cR: null, read: 'C2', form: 'M1' });
export const DECL = Object.freeze({
  planets: Object.freeze(['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune']),
  bodies: Object.freeze(['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Sun']),
  dirs: Object.freeze(['Np', 'Gm']), axes: Object.freeze(['L', 'eq']), senses: Object.freeze(['g2m', 'g2p']),
  /** 背景の倍率の格子(ω_G の倍): 窓の下端・0.2・0.5・窓の上端((N+) —— 第352便y)・注目の列 0.98(窓の上端より上 —— 窓の外)・1 */
  uGrid: Object.freeze([0.0487, 0.2, 0.5, 0.835, 0.98, 1]),
  uLabels: Object.freeze({ 0.0487: '窓の下端', 0.2: '窓の中', 0.5: '窓の中', 0.835: '窓の上端', 0.98: '注目の列(窓の上端より上)', 1: '倍率 1' }),
  window: Object.freeze({ lo: 0.0487, hi: 0.835 }), uFocus: 0.98,
  /** 比べる列(主の列から 1 つだけ替える) */
  cmps: Object.freeze([Object.freeze({ id: 'g2p', sense: 'g2p' }), Object.freeze({ id: 'Gm', dir: 'Gm' }), Object.freeze({ id: 'eq', axis: 'eq' })]),
  cmpLabels: Object.freeze({ g2p: '(g2+) = +Ω × ŝ(比べる列)', Gm: '(G−) 銀河の回転と逆向き(比べる列)', eq: 'eq 等しい重みの基準軸(比べる列)' }),
  poles: Object.freeze(['om', 'ax', 'orb', 'ecl']),
  poleLabels: Object.freeze({ om: '合成の軸', ax: '基準軸', orb: '自分の公転の北極', ecl: '黄道の極' }),
  /** 受け手の半径の置き方の点検の列(統括の数え直し 3) */
  cRs: Object.freeze([null, 1e-3, 1e-2, 0.1, 0.3, 1]),
  omegaG: K.DECL.omegaG,
  /** 統括の数え直し 3 の点検の数(表の桁) */
  anchor: Object.freeze({
    L: Object.freeze([0.026257, 0.008317, 0.999621]), angLEq: 1.1207, omegaG: 9.09e-16,
    /** cR → [等大の倍率 ÷ k, φ °, 等大の残り ÷ 背景] */
    venusCR: Object.freeze([[null, 1.19282e-12, 0.7606, 0.013274], [1e-3, 1.61699e-7, 0.7509, 0.013106], [1e-2, 1.16430e-6, 0.9910, 0.017295],
      [0.1, 1.87673e-6, 7.580, 0.13219], [0.3, 1.11483e-6, 21.65, 0.37565], [1, 6.45938e-7, 52.06, 0.87772]]),
    venusFloorCR1: 0.78868,
    /** 8 惑星の φ(−S と L の角)規則の半径 → cR 1 */
    phi: Object.freeze({ Mercury: [7.15, 88.0], Venus: [0.76, 52.1], Earth: [5.05, 60.0], Mars: [3.23, 76.0], Jupiter: [3.20, 3.72], Saturn: [2.50, 3.16], Uranus: [3.92, 5.07], Neptune: [3.75, 4.36] }),
    sunConeL: 5.968,
  }),
  provKeys: Object.freeze(['earth.precSense', 'earth.psiA.rate', 'mars.prec.rate', 'venus.prec.rate']),
  judge: '丸めの桁の床: 逐語の表は有効数字 3〜4 桁・打ち消しで 0 になる量は尺度の 1e-12 倍以下を 0 と書く',
});

/* ───────── 材料 ───────── */
function axesOf(T1, GEO, cache) {
  if (cache && cache.__ax353b) return cache.__ax353b;
  const A = CR.refAxes(T1, GEO), v = { L: unit(A.L), eq: unit(A.eq) };
  if (cache) cache.__ax353b = v;
  return v;
}
/** 局所 (S)(rad/s・k を掛けた後)と ŝ・n̂。太陽は惑星由来の (S) の和(第352便e の口 —— 規則の半径だけ) */
export function localOf(T1, GEO, id, { cR = null, tSrc = 0, k = 1 } = {}, cache = null) {
  const ck = ['loc353b', id, cR, tSrc, k].join('|');
  if (cache && cache[ck]) return cache[ck];
  let v;
  if (id === 'Sun') {
    if (cR !== null || tSrc !== 0) throw new RangeError('localOf: 太陽の行は規則の半径だけ(cR null・tSrc 0)');
    const S = SR.sunLocal(T1, GEO, { k });
    v = { local: S.sum.S.slice(), sHat: unit(S.sHat), nHat: null };
  } else {
    if (!DECL.planets.includes(id)) throw new RangeError('localOf: 受け手は 8 惑星と太陽');
    const st = K.spinRot(T1, GEO, id, 'Sun', { part: MAIN.part, form: MAIN.form, tSrc, cR, read: MAIN.read, k });
    v = { local: st.Om, sHat: unit(st.sHat), nHat: unit(st.nHat), A0: st.A0, wS: st.wS };
  }
  if (cache) cache[ck] = v;
  return v;
}

/* ───────── 約束の口 ───────── */
/**
 * mainState(T1, GEO, id, { u, cR = null, tSrc = 0, k = 1, dir = 'Np', axis = 'L', sense = 'g2m' }, cache)
 *   受け手 id(8 惑星・'Sun')の主の列の状態(dir・axis・sense を替えると比べる列)。
 * 返す: { id, u, cR, tSrc, k, dir, axis, sense, sHat, nHat, axisVec, local(S), bg, Om, W(abs Ω・rad/s), locOverBg,
 *   coneDeg(ŝ と Ω), omToAxisDeg(Ω と基準軸), orbDeg(Ω と公転の北極), ds(単位の応答の dŝ/dt),
 *   precRate { radS, asYr, periodYr }(単位の応答 —— 合成の軸のまわりの方位の率の大きさ = abs Ω),
 *   spinOm(ŝ·Ω の符号 —— 順回転 +1)・spinAx(ŝ·基準軸の符号 —— 順行 +1)・spinOrb,
 *   az { om, ax, orb, ecl }(rad/s)・inc { … }(rad/s),
 *   senseAboutOm { az, sign, rel }・senseAboutAxis { az, sign, rel }・senseAboutOrb { … }(rel −1 = 自転と逆回り),
 *   incRate(基準軸に対する傾きの率・rad/s) }
 * mut(変異 —— 零試験で落ちることを見る): 'noLocal'・'axisSwap'・'senseFlip'
 */
export function mainState(T1, GEO, id, { u, cR = MAIN.cR, tSrc = MAIN.tSrc, k = 1, dir = MAIN.dir, axis = MAIN.axis, sense = MAIN.sense, mut = null } = {}, cache = null) {
  if (!DECL.bodies.includes(id)) throw new RangeError('mainState: 受け手は 8 惑星と太陽');
  if (!(fin(u) && u >= 0)) throw new RangeError('mainState: 倍率 u ≥ 0');
  if (!DECL.dirs.includes(dir)) throw new RangeError('mainState: 背景の向きは Np(主)・Gm(比べる列)');
  if (!DECL.axes.includes(axis)) throw new RangeError('mainState: 基準軸は L(主)・eq(比べる列)');
  if (!DECL.senses.includes(sense)) throw new RangeError('mainState: 歳差の式は g2m(主)・g2p(比べる列)');
  if (!(fin(k) && k >= 0)) throw new RangeError('mainState: 換算の係数 k ≥ 0');
  const AX = axesOf(T1, GEO, cache), ax = AX[mut === 'axisSwap' ? (axis === 'L' ? 'eq' : 'L') : axis];
  const L = localOf(T1, GEO, id, { cR, tSrc, k }, cache), s = L.sHat, n = L.nHat;
  const loc = mut === 'noLocal' ? [0, 0, 0] : L.local.slice(), bg = D.bgVec(dir, { u, axis: ax }), Om = add(bg, loc), Wm = nrm(Om);
  const sen = mut === 'senseFlip' ? (sense === 'g2m' ? 'g2p' : 'g2m') : sense, sgn = sen === 'g2p' ? 1 : -1;
  const ds = D.precDs(s, Om, { sense: sen });
  const poles = { om: Wm > 0 ? unit(Om) : null, ax, orb: n, ecl: [0, 0, 1] }, az = {}, inc = {};
  for (const p of DECL.poles) { const r = poles[p] === null ? null : D.poleRates(poles[p], s, ds); az[p] = r === null ? null : r.az; inc[p] = r === null ? null : r.inc; }
  // (N+) では背景は基準軸に平行 —— 基準軸に対する傾きの率の分子は局所の分だけ(ax·(b × ŝ) = 0)。大きい数の差で作らず直接に数える(第352便j と同じ扱い)
  if (dir === 'Np' && inc.ax !== null) inc.ax = -sgn * dot(ax, crs(loc, s)) / nrm(crs(ax, s));
  const omToAxisDeg = Wm > 0 ? (dir === 'Np' ? Math.atan2(nrm(crs(loc, ax)), dot(Om, ax)) / D2R : angDeg(Om, ax)) : null;
  const spinOm = sg(dot(s, Om)), spinAx = sg(dot(s, ax)), spinOrb = n ? sg(dot(s, n)) : null;
  const about = (p, spin) => (az[p] === null ? null : { az: az[p], sign: sg(az[p]), rel: sg(az[p]) * spin });
  return { id, u, cR, tSrc, k, dir, axis, sense, sHat: s, nHat: n, axisVec: ax, local: loc, bg, Om, W: Wm, locOverBg: nrm(bg) > 0 ? nrm(loc) / nrm(bg) : null,
    coneDeg: Wm > 0 ? angDeg(s, Om) : null, omToAxisDeg, orbDeg: Wm > 0 && n ? angDeg(Om, n) : null, ds,
    precRate: { radS: Wm, asYr: Wm * ASYR, periodYr: Wm > 0 ? 2 * Math.PI / (Wm * YR) : null },
    spinOm, spinAx, spinOrb, az, inc,
    senseAboutOm: about('om', spinOm), senseAboutAxis: about('ax', spinAx), senseAboutOrb: n ? about('orb', spinOrb) : null,
    incRate: inc.ax };
}
/** 表に載せる小さな形 */
export function brief(st) {
  return { coneDeg: st.coneDeg, omToAxisDeg: st.omToAxisDeg, locOverBg: st.locOverBg, spinOm: st.spinOm, spinAx: st.spinAx, spinOrb: st.spinOrb,
    relOm: st.senseAboutOm ? st.senseAboutOm.rel : null, relAx: st.senseAboutAxis ? st.senseAboutAxis.rel : null, relOrb: st.senseAboutOrb ? st.senseAboutOrb.rel : null,
    azOmAsYr: st.az.om === null ? null : st.az.om * ASYR, azAxAsYr: st.az.ax === null ? null : st.az.ax * ASYR, azOrbAsYr: st.az.orb === null ? null : st.az.orb * ASYR,
    azEclAsYr: st.az.ecl === null ? null : st.az.ecl * ASYR, incAxAsYr: st.incRate === null ? null : st.incRate * ASYR,
    precAsYr: st.precRate.asYr, periodYr: st.precRate.periodYr };
}
/**
 * mainTable(us = DECL.uGrid, T1, GEO, cache) → 行 { id, u, uLabel, main(brief), cmp { g2p, Gm, eq }(brief) }(受け手 9 × 倍率 us)
 */
export function mainTable(us = DECL.uGrid, T1 = E.t1Table(), GEO = E.geometry(), cache = {}) {
  if (!(Array.isArray(us) && us.length > 0 && us.every((u) => fin(u) && u > 0))) throw new RangeError('mainTable: 倍率の列(> 0)');
  const rows = [];
  for (const id of DECL.bodies) for (const u of us) {
    const main = brief(mainState(T1, GEO, id, { u }, cache)), cmp = {};
    for (const c of DECL.cmps) cmp[c.id] = brief(mainState(T1, GEO, id, { u, ...c, id: undefined }, cache));
    rows.push({ id, u, uLabel: DECL.uLabels[u] || null, main, cmp });
  }
  return rows;
}

/* ───────── 表 2: 回る向きのまとめ(主の列・1 行ずつ)───────── */
/** 受け手ごと: 自転と合成の軸引きずり回転が順回転か(ŝ·Ω)→ (g2−) で回る向き(合成の軸・基準軸・公転の北極のまわり) */
export function senseRow(T1, GEO, id, { u = DECL.uFocus } = {}, cache = null) {
  const st = mainState(T1, GEO, id, { u }, cache), p = mainState(T1, GEO, id, { u, sense: 'g2p' }, cache);
  return { id, u, spinOm: st.spinOm, spinAx: st.spinAx, spinOrb: st.spinOrb, cosOm: dot(st.sHat, unit(st.Om)),
    om: st.senseAboutOm, ax: st.senseAboutAxis, orb: st.senseAboutOrb, eclAz: st.az.ecl,
    g2pRelOm: p.senseAboutOm ? p.senseAboutOm.rel : null, retro: st.spinAx === -1 };
}
/** 仮の値(第352便b —— 第352便j の provCompare)との並べ: 地球 = 黄道の極・火星 = 自分の公転の北極・金星 = 大きさだけ。「仮・未照合」の印つき */
export function provRow(T1, GEO, id, { u = DECL.uFocus, sense = MAIN.sense } = {}, cache = null) {
  const st = mainState(T1, GEO, id, { u, sense }, cache);
  const cell = { az: { ecl: st.az.ecl, orb: st.az.orb, om: st.az.om, ref: st.az.ax }, orbDeg: st.orbDeg, omAsYr: st.precRate.asYr };
  return J.provCompare(cell, id);
}

/* ───────── 表 3: u への依存 ───────── */
/** 受け手ごと: 格子 us の上での向き・円錐の幅(最大 − 最小)・率 ÷ u の幅(最大 ÷ 最小 − 1)・回る向きの替わりの数・局所 ÷ 背景の最大 */
export function uDepRow(T1, GEO, id, { us = DECL.uGrid } = {}, cache = null) {
  const sts = us.map((u) => mainState(T1, GEO, id, { u }, cache));
  const span = (xs) => Math.max(...xs) - Math.min(...xs), rr = (xs) => Math.max(...xs) / Math.min(...xs) - 1;
  const flips = (key) => sts.filter((s) => s[key] && s[key].sign !== (sts[0][key] && sts[0][key].sign)).length;
  return { id, us: us.slice(), coneSpanDeg: span(sts.map((s) => s.coneDeg)), axisSpanDeg: span(sts.map((s) => s.omToAxisDeg)),
    rateOverURel: rr(sts.map((s, i) => s.W / us[i])), rateOverUOmegaG: sts[0].W / us[0] / DECL.omegaG,
    flipsOm: flips('senseAboutOm'), flipsAx: flips('senseAboutAxis'), maxLocOverBg: Math.max(...sts.map((s) => s.locOverBg)),
    coneDeg: sts[0].coneDeg, omToAxisDeg: sts[0].omToAxisDeg };
}

/* ───────── 零試験・変異 ───────── */
export function pureScenes(T1 = E.t1Table(), GEO = E.geometry()) {
  const cache = {}, A = DECL.anchor, AX = axesOf(T1, GEO, cache);
  // ① 第352便j の cellOf と同じ数((N+)・(G−) × L・eq × (g2−)・(g2+) —— 倍率 (uV)〔第352便j の uOf〕・8 惑星): Ω・円錐・基準軸の角・方位の率と傾きの率
  let vsJ = 0, nJ = 0;
  const pmap = { om: 'om', ax: 'ref', orb: 'orb', ecl: 'ecl' };
  for (const id of DECL.planets) for (const dir of DECL.dirs) for (const axis of DECL.axes) for (const sense of DECL.senses) {
    const u = J.uOf(T1, GEO, 'uV', { bg: dir, axis, part: 'S' }, cache), a = mainState(T1, GEO, id, { u, dir, axis, sense }, cache);
    const c = J.cellOf(T1, GEO, id + '|Sun', { bg: dir, axis, sense, u, part: 'S' }, cache), sc = nrm(c.Om);
    vsJ = Math.max(vsJ, nrm(sub(a.Om, c.Om)) / sc, Math.abs(a.coneDeg - c.coneDeg) / 180, Math.abs(a.omToAxisDeg - c.refDeg) / 180);
    for (const p of DECL.poles) if (c.az[pmap[p]] !== null) vsJ = Math.max(vsJ, Math.abs(a.az[p] - c.az[pmap[p]]) / sc, Math.abs(a.inc[p] - c.inc[pmap[p]]) / sc);
    nJ++;
  }
  // ② 第352便w の stateW と同じ Ω・円錐((N+)・L・倍率 0.98・規則の半径)
  let vsW = 0;
  for (const id of DECL.planets) {
    const a = mainState(T1, GEO, id, { u: 0.98 }, cache), w = W.stateW(T1, GEO, id + '|Sun', { dir: 'Np', axis: 'L', u: 0.98, tSrc: 0 }, cache);
    vsW = Math.max(vsW, nrm(sub(a.Om, w.Om)) / w.W, Math.abs(a.coneDeg - w.thDeg) / 180);
  }
  // ③ 太陽の行は第352便e の sunTotal と同じ Ω・円錐
  const sun = mainState(T1, GEO, 'Sun', { u: 0.98 }, cache), sT = SR.sunTotal(T1, GEO, { part: 'S', bg: sun.bg, loc: SR.sunLocal(T1, GEO, {}) });
  const sunErr = Math.max(nrm(sub(sun.Om, sT.Om)) / sT.mag, Math.abs(sun.coneDeg - sT.coneDeg) / 180);
  // ④ 統括の数え直し 3: 基準軸 L・eq との角・ω_G・金星の受け手の半径の置き方の表(φ = −S と L の角)・8 惑星の φ
  const angLEq = angDeg(AX.L, AX.eq), venus = A.venusCR.map(([cR, uEq, phi, res]) => {
    const L = localOf(T1, GEO, 'Venus', { cR }, cache), p = angDeg(scl(L.local, -1), AX.L);
    return { cR, uEq: nrm(L.local) / DECL.omegaG, phi: p, res: 2 * Math.sin(p * D2R / 2), floor: Math.sin(p * D2R), want: [uEq, phi, res] };
  });
  const phis = DECL.planets.map((id) => ({ id, rule: angDeg(scl(localOf(T1, GEO, id, {}, cache).local, -1), AX.L), obs: angDeg(scl(localOf(T1, GEO, id, { cR: 1 }, cache).local, -1), AX.L), want: A.phi[id] }));
  // ⑤ (g2−) と (g2+) は方位の率が全部逆・円錐と率は同じ
  let flip = 0;
  for (const id of DECL.bodies) {
    const m = mainState(T1, GEO, id, { u: 0.5 }, cache), p = mainState(T1, GEO, id, { u: 0.5, sense: 'g2p' }, cache);
    for (const q of DECL.poles) if (m.az[q] !== null) flip = Math.max(flip, Math.abs(m.az[q] + p.az[q]) / m.W);
    flip = Math.max(flip, Math.abs(m.coneDeg - p.coneDeg), Math.abs(m.W - p.W) / m.W);
  }
  // ⑥ 単位の応答: 合成の軸のまわりの方位の率の大きさ = abs Ω(閉じた形)・周期 × 率 = 1 周・
  //    (g2−) の合成の軸のまわりの相対の回りは −(ŝ·Ω の符号)(順回転なら逆回り・逆回転〔ŝ·Ω < 0〕なら自転と同じ回り —— 閉じた形)
  let unitErr = 0, relAll = true;
  for (const id of DECL.bodies) for (const u of DECL.uGrid) {
    const st = mainState(T1, GEO, id, { u }, cache);
    unitErr = Math.max(unitErr, Math.abs(Math.abs(st.az.om) - st.W) / st.W, Math.abs(st.precRate.periodYr * st.precRate.asYr - 1296000) / 1296000);
    if (!(st.senseAboutOm && st.spinOm !== 0 && st.senseAboutOm.rel === -st.spinOm)) relAll = false;
  }
  // ⑦ k は局所だけに掛かる(k 2 の局所 = 2 × k 1 の局所・背景は同じ)
  const k1 = mainState(T1, GEO, 'Earth', { u: 0.5 }, cache), k2 = mainState(T1, GEO, 'Earth', { u: 0.5, k: 2 }, cache);
  const kErr = Math.max(nrm(sub(k2.local, scl(k1.local, 2))) / nrm(k2.local), nrm(sub(k2.bg, k1.bg)) / nrm(k1.bg));
  // ⑧ 太陽の円錐は基準軸 L のまわりの 5.968°(背景が支配する間)
  const sunCone = sun.coneDeg;
  // ⑨ 変異: 局所を落とすと (N+) で合成と基準軸の角が 0・基準軸を入れ替えると地球の角が動く・向きを入れ替えると rel が +1
  const vNo = mainState(T1, GEO, 'Venus', { u: 0.98, mut: 'noLocal' }, cache), eS = mainState(T1, GEO, 'Earth', { u: 0.98, mut: 'axisSwap' }, cache), e0 = mainState(T1, GEO, 'Earth', { u: 0.98 }, cache);
  const eF = mainState(T1, GEO, 'Earth', { u: 0.98, mut: 'senseFlip' }, cache);
  const muts = { noLocal: vNo.omToAxisDeg === 0, axisSwap: Math.abs(eS.coneDeg - e0.coneDeg) > 0.5, senseFlip: eF.senseAboutOm.rel === 1 };
  // ⑩ 仮の値の並べは印つき・判定の側へ渡すと例外
  const pr = provRow(T1, GEO, 'Earth', {}, cache), tagged = pr.provisional === true && pr.provMark === B.MARK;
  let blocked = false; try { B.assertNoVerdict(pr); } catch (e) { blocked = true; }
  // ⑪ 入力の拒否
  const rej = [() => mainState(T1, GEO, 'Moon', { u: 1 }), () => mainState(T1, GEO, 'Earth', { u: -1 }), () => mainState(T1, GEO, 'Earth', { u: 1, dir: 'Gp' }),
    () => mainState(T1, GEO, 'Earth', { u: 1, axis: 'ecl' }), () => mainState(T1, GEO, 'Earth', { u: 1, sense: 'g2' }), () => mainState(T1, GEO, 'Sun', { u: 1, cR: 1 }), () => mainTable([0])]
    .map((fn) => { try { fn(); return false; } catch (e) { return e instanceof RangeError; } });
  return { vsJ, nJ, vsW, sunErr, L: AX.L, angLEq, omegaG: DECL.omegaG, venus, phis, flip, unitErr, relAll, kErr, sunCone, muts, tagged, blocked, rejects: rej };
}
export function pureGates(S) {
  const A = DECL.anchor, p = (x, w, n) => Number(x.toPrecision(n)) === Number(w.toPrecision(n));
  return {
    sameAsJ: S.nJ === 64 && S.vsJ < 1e-9,
    sameAsW: S.vsW < 1e-12,
    sunRow: S.sunErr < 1e-12,
    anchorAxis: S.L.every((x, i) => Math.abs(x - A.L[i]) < 5e-7) && p(S.angLEq, A.angLEq, 5) && p(S.omegaG, A.omegaG, 3),
    anchorVenus: S.venus.length === 6 && S.venus.every((r) => p(r.uEq, r.want[0], 6) && p(r.phi, r.want[1], 4) && p(r.res, r.want[2], 5)) && p(S.venus[5].floor, A.venusFloorCR1, 5),
    anchorPhi: S.phis.length === 8 && S.phis.every((r) => [0, 1].every((i) => Math.abs([r.rule, r.obs][i] - r.want[i]) < 0.6 * Math.pow(10, Math.floor(Math.log10(Math.max(1, r.want[i]))) - 2))),   // 表の桁(小数 2 桁か有効数字 3 桁)の 0.6 単位の床(表は 5 桁を丸めた数)
    g2Flip: S.flip < 1e-12,
    unitResp: S.unitErr < 1e-12 && S.relAll,
    kLocal: S.kErr < 1e-12,
    sunCone: Math.abs(S.sunCone - A.sunConeL) < 5e-4,
    mutants: S.muts.noLocal && S.muts.axisSwap && S.muts.senseFlip,
    provMark: S.tagged && S.blocked,
    rejects: S.rejects.length === 7 && S.rejects.every(Boolean),
  };
}
