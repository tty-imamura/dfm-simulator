// 第352便j(原仮定者の回答(2026-11-24 —— 第148報)・原仮定者の整理(2026-11-24 —— 第148報)・統括の検証項目 R447):
//   **本便の「いまの候補の全体」の主の表 —— 天体 16 組(第351便c の PAIRS16)+ 太陽(受け手)× 背景の向き {(N+)・(G−)} × 基準軸 {L(角運動量の重み)・eq(等しい重み)} ×
//   歳差の向き {(g2−)・(g2+)} × 背景の大きさ {(uV)・(uMin)・倍率 1・(仮)} × 成分 {(S) 主・(MS) 比べる列} の 1 つの口 cellOf と、仮の比べる数との並べ・8 惑星の傾きと円錐・衛星の (S) の主 —— 診断だけ**
//   (器 tests/exp-w352j-maintable.mjs と QA behavior.maintable352j・docs.maintable352j が読む —— html を読まない・ファイルを読まない・状態を持たない)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない。既存の lib と第 1 ラウンドの lib は呼ぶだけ(本文は変えない):
//   第352便d(rowOf・r3Ds・poleRates・bgVec・uVenus —— 方位の率・傾きの率・背景のベクトル)・第352便c(refAxis・coneDeg —— 基準軸)・第352便e(sunLocal —— 太陽を受け手に)・
//   第352便b(prov・toRH・ratioOf —— 仮の値 —— 「仮・未照合」の印つきの表だけに使う)・第351便e(localOf・bgTerm)・第351便c(PAIRS16・pairParts)・第351便f(satInput・satTerms・lockCols)・第351便d(r3Coeffs)。
//
// ■ 語(本便の共通の語 —— 第352便の共通ブリーフ):
//   ŝ = 受け手の自転軸の単位ベクトル。Ω = 背景 + 局所(太陽由来 + 母天体由来の成分 part × k)。(g2+) dŝ/dt = +k₂ (Ω × ŝ)・(g2−) dŝ/dt = −k₂ (Ω × ŝ)。
//   背景の向き 'Np' (N+) = 基準軸の向き・'Gm' (G−) = 銀河の回転と逆向き(第351便e の bgTerm の主)。基準軸 'L'(角運動量の重み —— 枝 c の推奨)・'eq'(等しい重み —— 次点)。
//   背景の大きさの列: 'uV' = 金星で太陽由来の part と背景の大きさが同じ(÷ k)/'uMin' = 金星で合成の大きさが最小(金星の条件の次点の読み —— 負なら 0)/
//   'u1' = 銀河の公転の角速度 × 1/'uP' = (仮) 地球の合成の大きさが仮の値の地球の歳差の率に単位の応答(比 1・k₂ 1)で届く倍率(「仮・未照合」)。
//   起こす率 = 公転の北極を基準に傾きが減る率(第351便の共通の定義 = −(極 n̂ に対する傾きの率))。f 0.5・(N1) の経路 ①+② の dŝ/dt で数える。
// ■ 言わないこと: どの組が観測に合った・主が決まった、とは書かない(この組・このノブでは、の表)。仮の値との並べは「仮・未照合」の印つきで合否にしない。
import * as D from './lib-w352d-precsense.mjs';
import * as CR from './lib-w352c-refaxis.mjs';
import * as SR from './lib-w352e-sunrecv.mjs';
import * as B from './lib-w352b-provisional.mjs';
import * as BB from './lib-w351e-bgbalance.mjs';
import * as SP from './lib-w351c-srcparts.mjs';
import * as F from './lib-w351f-satlock.mjs';
import * as R3 from './lib-w351d-r3step.mjs';
import * as E from './lib-w347e-spintorque.mjs';

export const LIB_VERSION = 'w352j-maintable-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const D2R = Math.PI / 180;
const { dot, crs, nrm, scl, add, sub, unit } = R3.vec;
const isVec = (a) => Array.isArray(a) && a.length === 3 && a.every(fin);
export const ASYR = D.ASYR;
const angDeg = CR.angDeg;

/* ───────── 宣言 ───────── */
export const DECL = Object.freeze({
  /** 行: 第351便c の PAIRS16 + 太陽(受け手) */
  rows: Object.freeze([...SP.PAIRS16.map((p) => p.join('|')), 'Sun|-']),
  bgs: Object.freeze(['Np', 'Gm']), bgLabels: Object.freeze({ Np: '(N+)', Gm: '(G−)' }),
  axes: Object.freeze(['L', 'eq']), axisLabels: Object.freeze({ L: 'L(角運動量の重み)', eq: 'eq(等しい重み)' }),
  senses: Object.freeze(['g2m', 'g2p']), senseLabels: Object.freeze({ g2m: '(g2−)', g2p: '(g2+)' }),
  uCols: Object.freeze(['uV', 'uMin', 'u1', 'uP']),
  uLabels: Object.freeze({ uV: '(uV) 金星で大きさが同じ', uMin: '(uMin) 金星で合成が最小', u1: '倍率 1', uP: '(仮) 地球の歳差の率に届く' }),
  parts: Object.freeze(['S', 'MS']), partLabels: Object.freeze({ S: '(S) 主', MS: '(MS) 比べる列' }),
  /** 推奨の組(伺っている 4 項の推奨)と、1 つずつ次点に替えた組 */
  rec: Object.freeze({ bg: 'Np', axis: 'L', sense: 'g2m', u: 'uV', part: 'S' }),
  swaps: Object.freeze([['sense', 'g2p'], ['bg', 'Gm'], ['u', 'uMin'], ['axis', 'eq']]),
  swapLabels: Object.freeze({ sense: '歳差の向き (g2−) → (g2+)', bg: '背景の向き (N+) → (G−)', u: '金星の条件 (uV) → (uMin)', axis: '基準軸 L → eq' }),
  /** 極: 合成の軸・自分の公転の北極・基準軸・黄道の極 */
  poles: D.DECL.poles,
  /** 起こす率の比率(f 0.5・(N1)) */
  fRaise: 0.5, norm: 'N1',
  /** 起こす率を書く傾きの床(同期の宣言の組 —— 第351便e の sinTable と同じ) */
  sinTable: BB.DECL.sinTable,
  planets: Object.freeze(['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune']),
  /** 衛星の行(第351便f の組 + 太陽の側の行) */
  sats: Object.freeze(['Moon|EarthHi', 'Moon|EarthLo', 'Io|Jupiter', 'Pluto|Charon', 'Charon|Pluto']),
  /** 仮の値の鍵(この lib が読む物だけ) */
  provKeys: Object.freeze(['earth.precSense', 'earth.psiA.rate', 'earth.omegaA.rate', 'earth.epsA.rate', 'mars.prec.rate', 'mars.obliquity', 'mars.eps.rate', 'venus.prec.rate']),
  /** 統括の数え直し 1 の表(等しい重みの基準軸・(S)・(uV)・(g2+))—— cos(ŝ, 背景)・合成と ŝ °・合成と基準軸 ° */
  anchor: Object.freeze({
    Gm: Object.freeze({ Mercury: [0.414, 172.275, 167.658], Venus: [-0.481, 59.560, 121.321], Earth: [0.456, 82.684, 83.781], Mars: [0.057, 92.252, 67.657],
      Jupiter: [0.509, 59.503, 62.267], Saturn: [0.364, 68.648, 62.157], Uranus: [-0.251, 104.542, 62.138], Neptune: [0.126, 82.765, 62.136] }),
    Np: Object.freeze({ Mercury: [0.996, 177.551, 172.884], Venus: [-1.000, 88.961, 89.712], Earth: [0.913, 25.379, 3.404], Mars: [0.908, 24.327, 0.403],
      Jupiter: [0.998, 3.166, 0.011], Saturn: [0.880, 28.310, 0.002], Uranus: [-0.136, 97.842, 0.000], Neptune: [0.894, 26.668, 0.000] }),
    earthGmRef: -2.87e-16, earthGmOrb: 9.56e-16, earthNpRefLo: 4.60e-15, earthNpRefHi: 4.65e-15, venusNpRatio: 0.0100, uV: 1.19282e-12,
    refL: Object.freeze([0.0262569, 0.0083172, 0.9996206]),
  }),
  judge: '丸めの桁の床: 打ち消しで 0 になる量は尺度の 1e-12 倍以下を 0 と書く',
});

/* ───────── 材料(基準軸・背景の大きさの列)───────── */
/** 基準軸(枝 c の口から —— 'L'・'eq') */
export function axisOf(name, T1, GEO) {
  if (!DECL.axes.includes(name) && name !== 'ecl') throw new RangeError('axisOf: 基準軸は L・eq(比べる列 ecl)');
  return CR.refAxis(name, T1, GEO);
}
/** 局所の項(行のキー 'id|src' —— 太陽は 'Sun|-')→ { sHat, nHat|null, sun:{M,S,MS}, parent|null }(rad/s・k を掛けた後) */
export function localRow(T1, GEO, key, { k = 1 } = {}, cache = null) {
  const ck = 'loc|' + key + '|' + k;
  if (cache && cache[ck]) return cache[ck];
  let v;
  if (key === 'Sun|-') { const S = SR.sunLocal(T1, GEO, { k }); v = { sHat: unit(S.sHat), nHat: null, sun: S.sum, parent: null, src: 'Sun' }; }
  else {
    const [id, src] = key.split('|'), L = BB.localOf(T1, GEO, id, src, { k }, cache);
    v = { sHat: unit(L.sHat), nHat: unit(L.nHat), sun: L.sun, parent: L.parent, src };
  }
  if (cache) cache[ck] = v;
  return v;
}
/** 局所の和(太陽由来 + 母天体由来 の part) */
export const localSum = (L, part) => (L.parent ? add(L.sun[part], L.parent[part]) : L.sun[part].slice());
/** 背景の単位ベクトル × ω_G(rad/s —— 倍率 1) */
export function bgUnitVec(bg, axisVec) { return D.bgVec(bg, { u: 1, axis: axisVec }); }
/** 合成の大きさ abs(u b₁ + L) が target になる u(≥ 0 の根 —— 無ければ null) */
export function uForMag(b1, L, target) {
  const bb = dot(b1, b1), bl = dot(b1, L), c = dot(L, L) - target * target, disc = bl * bl - bb * c;
  if (!(bb > 0) || disc < 0) return null;
  const u = (-bl + Math.sqrt(disc)) / bb;
  return u >= 0 ? u : null;
}
/** 合成の大きさ abs(u b₁ + L) を最小にする u(≥ 0 —— 射影が負なら 0) */
export function uForMin(b1, L) { const bb = dot(b1, b1); return bb > 0 ? Math.max(0, -dot(b1, L) / bb) : null; }
/** 仮の値の地球の歳差の率(右ねじの大きさ・rad/s) */
export function earthPrecRadS() { return Math.abs(B.toRH('earth.psiA.rate')) / ASYR; }
/**
 * 背景の大きさの列の倍率 u(背景の向き bg・基準軸 axis・成分 part・k)。uV = 金星で part と大きさが同じ(÷ k)/uMin = 金星で合成が最小/u1 = 1/uP = 地球の合成が仮の値の歳差の率に届く(印つき)。
 */
export function uOf(T1, GEO, uCol, { bg, axis, part, k = 1 }, cache = null) {
  if (!DECL.uCols.includes(uCol)) throw new RangeError('uOf: 大きさの列は ' + DECL.uCols.join('・'));
  if (uCol === 'u1') return 1;
  const ck = ['u', uCol, bg, axis, part, k].join('|');
  if (cache && cache[ck] !== undefined) return cache[ck];
  const b1 = bgUnitVec(bg, axisOf(axis, T1, GEO));
  let u;
  if (uCol === 'uV') u = D.uVenus(T1, GEO, { part, k }, cache);
  else if (uCol === 'uMin') u = uForMin(b1, localSum(localRow(T1, GEO, 'Venus|Sun', { k }, cache), part));
  else u = uForMag(b1, localSum(localRow(T1, GEO, 'Earth|Sun', { k }, cache), part), earthPrecRadS());
  if (cache) cache[ck] = u;
  return u;
}

/* ───────── 約束の口: 1 つのセル ───────── */
/**
 * 1 つのセル(行 key・背景の向き bg・基準軸 axis・歳差の向き sense・倍率 u〔数〕・成分 part・k)。
 * 返す: Om(rad/s)・合成の大きさ omAsYr(″/年)・合成と基準軸の角 refDeg・円錐の半頂角 coneDeg(合成と ŝ)・背景と ŝ の cos(cosBg)・順回転(背景 spinBg・合成 spin)・
 *   経路 ② だけ(k₂ 1)の方位の率 az{om,orb,ref,ecl}(rad/s)・傾きの率 inc{…}・起こす率 raise(f 0.5・(N1)・rad/s —— 傾きが床より小さい・公転の北極が無いなら null)。
 * mut(変異 —— 零試験で落ちることを見る): 'noLocal'(局所を落とす)・'axisSwap'(L と eq を入れ替える)
 */
export function cellOf(T1, GEO, key, { bg, axis, sense, u, part = 'S', k = 1, mut = null }, cache = null) {
  if (!DECL.bgs.includes(bg)) throw new RangeError('cellOf: 背景の向きは Np・Gm');
  if (!DECL.axes.includes(axis)) throw new RangeError('cellOf: 基準軸は L・eq');
  if (!D.DECL.senses.includes(sense)) throw new RangeError('cellOf: 歳差の向きは g2m・g2p');
  if (!(fin(u) && u >= 0)) throw new RangeError('cellOf: 倍率 u ≥ 0');
  if (!DECL.parts.includes(part) && part !== 'M') throw new RangeError('cellOf: 成分は S・MS');
  const ax = axisOf(mut === 'axisSwap' ? (axis === 'L' ? 'eq' : 'L') : axis, T1, GEO);
  const L = localRow(T1, GEO, key, { k }, cache), s = L.sHat, n = L.nHat;
  const b = D.bgVec(bg, { u, axis: ax }), loc = mut === 'noLocal' ? [0, 0, 0] : localSum(L, part), Om = add(b, loc), om = nrm(Om);
  const poles = { om: om > 0 ? unit(Om) : null, orb: n, ref: ax, ecl: [0, 0, 1] };
  const ds2 = D.precDs(s, Om, { sense }), c = R3.r3Coeffs(DECL.fRaise, DECL.norm), dsR = D.r3Ds(s, Om, { sense, kTilt: c.kTilt, kPrec: c.kPrec });
  const az = {}, inc = {};
  for (const p of DECL.poles) { const r = poles[p] === null ? null : D.poleRates(poles[p], s, ds2); az[p] = r === null ? null : r.az; inc[p] = r === null ? null : r.inc; }
  let raise = null;
  if (n !== null) { const cc = Math.max(-1, Math.min(1, dot(s, n))); if (Math.sqrt(1 - cc * cc) >= DECL.sinTable) raise = -D.poleRates(n, s, dsR).inc; }
  const sg = (x) => (x > 0 ? 1 : x < 0 ? -1 : 0);
  return { key, bg, axis, sense, u, part, k, sHat: s, nHat: n, Om, bgVec: b, local: loc, omAsYr: om * ASYR, bgAsYr: nrm(b) * ASYR, locAsYr: nrm(loc) * ASYR,
    // (N+) では背景は基準軸に平行 —— 合成と基準軸の角は局所の直交の分から直接に数える(大きい数の差で作らない)
    refDeg: om > 0 ? (bg === 'Np' ? Math.atan2(nrm(crs(loc, ax)), dot(Om, ax)) / D2R : angDeg(Om, ax)) : null, coneDeg: om > 0 ? angDeg(Om, s) : null, orbDeg: om > 0 && n ? angDeg(Om, n) : null,
    cosBg: nrm(b) > 0 ? dot(s, unit(b)) : null, spinBg: nrm(b) > 0 ? sg(dot(s, b)) : 0, spin: sg(dot(s, Om)), az, inc, raise };
}
/** 名前の列(uCol)で 1 つのセル */
export function cellNamed(T1, GEO, key, { bg, axis, sense, uCol, part = 'S', k = 1 }, cache = null) {
  const u = uOf(T1, GEO, uCol, { bg, axis, part, k }, cache);
  return { ...cellOf(T1, GEO, key, { bg, axis, sense, u, part, k }, cache), uCol };
}

/* ───────── 差の表(推奨 → 次点を 1 つずつ)───────── */
/** 2 つのセルの差: 角の差・大きさの比・方位の率の符号が替わる極・起こす率の符号・順回転の替わり */
export function diffOf(a, b) {
  const sg = (x) => (x === null ? null : x > 0 ? 1 : x < 0 ? -1 : 0);
  const flips = DECL.poles.filter((p) => a.az[p] !== null && b.az[p] !== null && sg(a.az[p]) !== sg(b.az[p]));
  const dRef = a.refDeg === null || b.refDeg === null ? null : b.refDeg - a.refDeg, dCone = a.coneDeg === null || b.coneDeg === null ? null : b.coneDeg - a.coneDeg;
  const raiseFlip = a.raise !== null && b.raise !== null && sg(a.raise) !== sg(b.raise);
  const magRatio = a.omAsYr > 0 ? b.omAsYr / a.omAsYr : null;
  const marked = flips.length > 0 || raiseFlip || a.spin !== b.spin || a.spinBg !== b.spinBg || (dCone !== null && Math.abs(dCone) >= 1) || (dRef !== null && Math.abs(dRef) >= 1)
    || (magRatio !== null && (magRatio >= 2 || magRatio <= 0.5));
  return { flips, dRef, dCone, magRatio, raiseFlip, spinFlip: a.spin !== b.spin, spinBgFlip: a.spinBg !== b.spinBg, marked };
}

/* ───────── 仮の比べる数との並べ(全部「仮・未照合」の印 —— 合否にしない)───────── */
/** 仮の値の比べる数(右ねじ・″/年)と、比べる極(地球 = 黄道の極・火星 = 自分の公転の北極・金星 = 大きさだけ) */
export function provRefs() {
  return {
    Earth: { rate: B.toRH('earth.psiA.rate'), sense: B.prov('earth.precSense').value, pole: 'ecl', tiltRates: { omegaA: B.prov('earth.omegaA.rate').value, epsA: B.prov('earth.epsA.rate').value } },
    Mars: { rate: B.toRH('mars.prec.rate'), sense: Math.sign(B.prov('mars.prec.rate').value), pole: 'orb', obliquity: B.prov('mars.obliquity').value, tiltRates: { eps: B.prov('mars.eps.rate').value } },
    Venus: { rate: B.prov('venus.prec.rate').value, sense: null, pole: null },
  };
}
/** セル(地球・火星・金星)と仮の比べる数の並べ: 回る向きの符号が同じか・円錐の中心(合成と自分の公転の法線の角)・要る倍(仮の率 ÷ 合成の率・÷ 極の方位の率) */
export function provCompare(cell, id, refs = provRefs()) {
  const R = refs[id];
  if (!R) throw new RangeError('provCompare: 地球・火星・金星');
  const azP = R.pole ? cell.az[R.pole] : null, azAs = azP === null ? null : azP * ASYR;
  return B.tagProv({ id, sameSense: R.sense === null || azAs === null || azAs === 0 ? null : Math.sign(azAs) === R.sense, azPoleAsYr: azAs,
    centerDeg: cell.orbDeg, needOm: cell.omAsYr > 0 ? Math.abs(R.rate) / cell.omAsYr : null, needPole: azAs ? Math.abs(R.rate) / Math.abs(azAs) : null },
  id === 'Earth' ? ['earth.psiA.rate', 'earth.precSense'] : id === 'Mars' ? ['mars.prec.rate'] : ['venus.prec.rate']);
}
/** 要る倍の天体どうしの散らばり(最大 ÷ 最小 —— 1 に近いほど、背景の大きさ 1 つで足りる型) */
export function spreadOf(needs) { const v = needs.filter((x) => fin(x) && x > 0); return v.length < 2 ? null : Math.max(...v) / Math.min(...v); }
/** 傾きの率 ÷ 歳差の率 と f(第352便b の ratioOf —— 印つき) */
export function tiltRatios(T1, GEO, refs = provRefs()) {
  const e = refs.Earth, m = refs.Mars, thE = angDeg(unit(GEO['Earth|Sun'].w), unit(GEO['Earth|Sun'].n));
  return B.tagProv({ earthTiltDeg: thE,
    earthOmegaA: B.ratioOf(e.tiltRates.omegaA, thE, e.rate), earthEpsA: B.ratioOf(e.tiltRates.epsA, thE, e.rate), mars: B.ratioOf(m.tiltRates.eps, m.obliquity, m.rate) },
  ['earth.omegaA.rate', 'earth.epsA.rate', 'earth.psiA.rate', 'mars.eps.rate', 'mars.obliquity', 'mars.prec.rate']);
}

/* ───────── 8 惑星の傾きと「基準軸のまわりの円錐」(表 5)───────── */
export function tiltRow(T1, GEO, id, { axis, uCol = 'uV', part = 'S' }, cache = null) {
  const L = localRow(T1, GEO, id + '|Sun', {}, cache), c = cellNamed(T1, GEO, id + '|Sun', { bg: 'Np', axis, sense: 'g2m', uCol, part }, cache);
  return { id, axis, uCol, part, obsTiltDeg: angDeg(L.sHat, L.nHat), refConeDeg: CR.coneDeg(axisOf(axis, T1, GEO), L.sHat), omConeDeg: c.coneDeg, omRefDeg: c.refDeg };
}

/* ───────── 衛星の行(母天体由来の (S) を足した合成 —— 第351便f の 3 列を (S) の主で)───────── */
export function satRow(T1, GEO, key, { bg = 'Np', axis = 'L', uCol = 'uV', part = 'S', k = 1 } = {}, cache = null) {
  const [id, src] = key.split('|');
  const L = localRow(T1, GEO, key, { k }, cache), u = uOf(T1, GEO, uCol, { bg, axis, part, k }, cache), b = D.bgVec(bg, { u, axis: axisOf(axis, T1, GEO) });
  const sunP = L.sun[part], parP = L.parent ? L.parent[part] : [0, 0, 0], Om = add(add(b, sunP), parP);
  const S = F.satInput(T1, GEO, id, src), cols = F.lockCols(S, Om);
  return { key, bg, axis, uCol, part, u, parOverSun: nrm(sunP) > 0 ? nrm(parP) / nrm(sunP) : null, parOverBg: nrm(b) > 0 ? nrm(parP) / nrm(b) : null,
    sunAsYr: nrm(sunP) * ASYR, parAsYr: nrm(parP) * ASYR, bgAsYr: nrm(b) * ASYR, omAsYr: nrm(Om) * ASYR, cosParS: nrm(parP) > 0 ? dot(L.sHat, unit(parP)) : null,
    cols: Object.fromEntries(F.DECL.lockCols.map((c) => [c, { precAsYr: cols[c].precRate * ASYR, raiseAsYr: cols[c].raise === null ? null : cols[c].raise * ASYR,
      parOverN: cols[c].parOverN, lonOverN: cols[c].lonOverN, epsDeg: cols[c].epsDeg }])) };
}

/* ───────── 零試験・変異 ───────── */
export function pureScenes(T1 = E.t1Table(), GEO = E.geometry()) {
  const cache = {}, A = DECL.anchor;
  // ① 惑星の行は第352便d の rowOf と同じ数(Ω・経路 ② の方位の率と傾きの率 —— 背景 2 × 向き 2 × 成分 2 × 基準軸 2)
  let vsD = 0;
  for (const id of DECL.planets) for (const bg of DECL.bgs) for (const sense of D.DECL.senses) for (const part of DECL.parts) for (const axis of DECL.axes) {
    const u = D.uVenus(T1, GEO, { part }, cache), ax = axisOf(axis, T1, GEO);
    const a = cellOf(T1, GEO, id + '|Sun', { bg, axis, sense, u, part }, cache), r = D.rowOf(T1, GEO, id, { bg, sense, u, part, axis: ax }, cache);
    vsD = Math.max(vsD, nrm(sub(a.Om, r.Om)) / nrm(r.Om));
    for (const p of DECL.poles) if (r.rates[p]) vsD = Math.max(vsD, Math.abs(a.az[p] - r.rates[p].az) / nrm(r.Om), Math.abs(a.inc[p] - r.rates[p].inc) / nrm(r.Om));
  }
  // ② 統括の数え直し 1 の表(等しい重み・(S)・(uV))—— cos(ŝ, 背景)・合成と ŝ °・合成と基準軸 °(16 個の角)
  const uV = D.uVenus(T1, GEO, { part: 'S' }, cache), anc = [];
  for (const bg of DECL.bgs) for (const id of DECL.planets) {
    const c = cellOf(T1, GEO, id + '|Sun', { bg, axis: 'eq', sense: 'g2p', u: uV, part: 'S' }, cache), w = A[bg][id];
    anc.push({ bg, id, cos: c.cosBg, cone: c.coneDeg, ref: c.refDeg, ok: Math.abs(c.cosBg - w[0]) < 6e-4 && Math.abs(c.coneDeg - w[1]) < 6e-4 && Math.abs(c.refDeg - w[2]) < 6e-4 });
  }
  // ③ 地球の方位の率((g2+)・等しい重み)と金星の (N+) の打ち消し
  const eG = cellOf(T1, GEO, 'Earth|Sun', { bg: 'Gm', axis: 'eq', sense: 'g2p', u: uV, part: 'S' }, cache), eN = cellOf(T1, GEO, 'Earth|Sun', { bg: 'Np', axis: 'eq', sense: 'g2p', u: uV, part: 'S' }, cache);
  const vN = cellOf(T1, GEO, 'Venus|Sun', { bg: 'Np', axis: 'eq', sense: 'g2p', u: uV, part: 'S' }, cache);
  const earth = { gmRef: eG.az.ref * ASYR, gmOrb: eG.az.orb * ASYR, npRef: eN.az.ref * ASYR, venusRatio: vN.omAsYr / vN.bgAsYr };
  // ④ (g2−) は全部の方位の率の符号が逆・傾きの率(経路 ② だけ)も逆
  let g2Flip = 0;
  for (const key of ['Earth|Sun', 'Moon|EarthHi', 'Sun|-']) {
    const p = cellOf(T1, GEO, key, { bg: 'Np', axis: 'L', sense: 'g2p', u: uV, part: 'S' }, cache), m = cellOf(T1, GEO, key, { bg: 'Np', axis: 'L', sense: 'g2m', u: uV, part: 'S' }, cache);
    for (const q of DECL.poles) if (p.az[q] !== null) g2Flip = Math.max(g2Flip, Math.abs(p.az[q] + m.az[q]) / nrm(p.Om));
  }
  // ⑤ 大きさの列: uP で地球の合成が仮の率に届く・uMin で金星の合成が最小(±0.1% で大きくなる)・uV は第352便d の uVenus
  const uChk = [];
  for (const bg of DECL.bgs) for (const axis of DECL.axes) for (const part of DECL.parts) {
    const uP = uOf(T1, GEO, 'uP', { bg, axis, part }, cache), cP = cellOf(T1, GEO, 'Earth|Sun', { bg, axis, sense: 'g2m', u: uP, part }, cache);
    const uM = uOf(T1, GEO, 'uMin', { bg, axis, part }, cache), m0 = cellOf(T1, GEO, 'Venus|Sun', { bg, axis, sense: 'g2m', u: uM, part }, cache).omAsYr;
    // uMin 0(射影が正 —— 打ち消さない)のときは、0 から少し増やすと大きくなることを見る
    const du = uM > 0 ? uM * 1e-3 : D.uVenus(T1, GEO, { part }, cache) * 1e-3;
    const mHi = cellOf(T1, GEO, 'Venus|Sun', { bg, axis, sense: 'g2m', u: uM + du, part }, cache).omAsYr, mLo = uM > 0 ? cellOf(T1, GEO, 'Venus|Sun', { bg, axis, sense: 'g2m', u: uM - du, part }, cache).omAsYr : Infinity;
    uChk.push({ bg, axis, part, uP, reach: Math.abs(cP.omAsYr / Math.abs(B.toRH('earth.psiA.rate')) - 1), uM, minOk: uM >= 0 && m0 <= mHi && m0 <= mLo });
  }
  // ⑥ 太陽の行は第352便e の sunTotal と同じ Ω
  const sunC = cellOf(T1, GEO, 'Sun|-', { bg: 'Np', axis: 'L', sense: 'g2m', u: uV, part: 'S' }, cache), loc = SR.sunLocal(T1, GEO, {});
  const sunT = SR.sunTotal(T1, GEO, { part: 'S', bg: sunC.bgVec, loc }), sunErr = nrm(sub(sunC.Om, sunT.Om)) / nrm(sunT.Om);
  // ⑦ 衛星の行: 母天体由来の (S) は第351便f の satTerms と同じ・背景の大きさは受け手に依らない
  const st = F.satTerms(T1, GEO, 'Moon', 'EarthHi', {}), Lm = localRow(T1, GEO, 'Moon|EarthHi', {}, cache);
  const satErr = Math.max(nrm(sub(st.parent.S, Lm.parent.S)) / nrm(st.parent.S), nrm(sub(st.sun.S, Lm.sun.S)) / nrm(st.sun.S));
  const bgIndep = Math.abs(nrm(BB.bgTerm('Moon', { u: 3 }).vec) / nrm(BB.bgTerm('Earth', { u: 3 }).vec) - 1);
  // ⑧ 基準軸 L は枝 c の値(7 桁)
  const refLErr = nrm(sub(axisOf('L', T1, GEO), A.refL));
  // ⑨ 差の表の自己試験: 同じセルの差は印なし・(g2+) に替えると合成の軸のまわりの符号が替わる
  const r0 = cellNamed(T1, GEO, 'Earth|Sun', { ...DECL.rec, uCol: DECL.rec.u }, cache), r1 = cellNamed(T1, GEO, 'Earth|Sun', { ...DECL.rec, sense: 'g2p', uCol: DECL.rec.u }, cache);
  const dSelf = diffOf(r0, r0), dSense = diffOf(r0, r1);
  // ⑩ 変異: 局所を落とすと金星の (N+) の打ち消しが消える・基準軸を入れ替えると地球の (N+) の基準軸の角が動く
  const vNo = cellOf(T1, GEO, 'Venus|Sun', { bg: 'Np', axis: 'eq', sense: 'g2p', u: uV, part: 'S', mut: 'noLocal' }, cache);
  const eSw = cellOf(T1, GEO, 'Earth|Sun', { bg: 'Np', axis: 'eq', sense: 'g2p', u: uV, part: 'S', mut: 'axisSwap' }, cache);
  const muts = { noLocal: Math.abs(vNo.omAsYr / vNo.bgAsYr - 1) < 1e-12, axisSwap: Math.abs(eSw.refDeg - eN.refDeg) > 0.1 };
  // ⑪ 仮の値の印: 並べの行は印つき・判定の側へ渡すと例外
  const pc = provCompare(r0, 'Earth'), tagged = pc.provisional === true && pc.provMark === B.MARK;
  let blocked = false; try { B.assertNoVerdict(pc); } catch (e) { blocked = true; }
  // ⑫ 入力の拒否
  const rej = [() => cellOf(T1, GEO, 'Earth|Sun', { bg: 'Gp', axis: 'L', sense: 'g2m', u: 1 }), () => cellOf(T1, GEO, 'Earth|Sun', { bg: 'Np', axis: 'ecl', sense: 'g2m', u: 1 }),
    () => cellOf(T1, GEO, 'Earth|Sun', { bg: 'Np', axis: 'L', sense: 'g2', u: 1 }), () => cellOf(T1, GEO, 'Earth|Sun', { bg: 'Np', axis: 'L', sense: 'g2m', u: -1 }),
    () => uOf(T1, GEO, 'uX', { bg: 'Np', axis: 'L', part: 'S' }), () => provCompare(r0, 'Mercury')]
    .map((fn) => { try { fn(); return false; } catch (e) { return e instanceof RangeError; } });
  return { vsD, anc, earth, g2Flip, uChk, sunErr, satErr, bgIndep, refLErr, dSelf, dSense, muts, tagged, blocked, rejects: rej };
}
export function pureGates(S) {
  const A = DECL.anchor, e = S.earth, p3 = (x, w) => Number(x.toPrecision(3)) === Number(w.toPrecision(3));
  return {
    sameAsD: S.vsD < 1e-9,   // 床 1e-9: 尺度の走り直し(ulp の揺すり)で、極にほぼ平行な行(水星の公転の北極)の方位の率が 1 ÷ sin で揺れる
    anchorTable: S.anc.length === 16 && S.anc.every((r) => r.ok),
    anchorEarth: p3(e.gmRef, A.earthGmRef) && p3(e.gmOrb, A.earthGmOrb) && e.npRef >= A.earthNpRefLo && e.npRef <= A.earthNpRefHi && Math.abs(e.venusRatio - A.venusNpRatio) < 5e-4,
    g2mFlip: S.g2Flip < 1e-12,
    uCols: S.uChk.length === 8 && S.uChk.every((r) => r.uP > 0 && r.reach < 1e-9 && r.minOk),
    sunRow: S.sunErr < 1e-12,
    satRow: S.satErr < 1e-12 && S.bgIndep < 1e-12,
    refL: S.refLErr < 1e-7,
    diffSelf: S.dSelf.marked === false && S.dSelf.flips.length === 0 && S.dSense.flips.includes('om'),
    mutants: S.muts.noLocal && S.muts.axisSwap,
    provMark: S.tagged && S.blocked,
    rejects: S.rejects.length === 6 && S.rejects.every(Boolean),
  };
}
