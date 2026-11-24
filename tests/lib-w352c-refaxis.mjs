// 第352便c(原仮定者の整理(2026-11-24 —— 第148報)・統括の検証項目 R440):
//   **太陽系の基準軸の候補と、太陽の自転軸の円錐 —— 8 惑星の公転の法線の等しい重みの平均 (eq)・角運動量の重みの平均 (L = 質量 × √(a(1 − e²))・比べる列 La = 質量 × √a)・
//   黄道の極 (ecl)・1 つ外した軸・球面上の中央値・群の部分集合と、各候補のまわりの散らばり・自転軸との角(= 読み (イ) の円錐の半頂角)・基準軸に垂直な面に写した方位 —— の純関数。
//   診断だけ(基準軸を 1 つに選ぶものではない)**
//   (器 tests/exp-w352c-refaxis.mjs と QA behavior.refaxis352c・docs.refaxis352c が読む —— html を読まない・ファイルを読まない・状態を持たない)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない(AN712 —— エンジンへ足す操作ではない)。
//   既存の lib は呼ぶだけ(本文は変えない): 第347便e(t1Table・geometry)・第348便c(massOf)・第351便e(bgTerm)・第350便e(dirUnits)・第342便e(eclUnit)・
//   第337便j(LIT —— 冥王星)・第337便c(G_SI・C_SI)・第317便c(GAL —— 銀河中心の向き)・第341便g(LIT.helio —— 道の要素 a・e)。
//
// ■ 原文: 原仮定者の整理(2026-11-24 —— 第148報)「太陽系の、多くの天体の公転面に垂直かつ、多くの天体の歳差運動の中心軸方向が、太陽系の基準軸方向である」
//   「太陽系の基準軸方向に対する、太陽の自転軸の傾きも歳差運動である。そこを手掛かりに、銀河由来の背景軸引きずりを算出する」。
// ■ 枠: 黄道 J2000(第347便e の geometry() の枠)。公転の法線 n は geometry() の 'X|Sun' の n(8 惑星)。太陽の自転軸は geometry() の 'Earth|Sun' の s。
// ■ 重み: eq = 1(等しい)/L = 質量 × √(a(1 − e²))(角運動量 m√(G M a(1 − e²)) の √(G M) を除いた形 —— a・e は第341便g の LIT.helio〔AU —— 冥王星を含む〕)/
//   La = 質量 × √a(a は統括の数え直しの脚本と同じ作り: 第347便e の t1Table の β から a = G M☉ ÷ (β c²)・離心率なし —— 比べる列)。
// ■ 言わないこと: 基準軸が決まった・太陽の傾きの原因が分かった・公転面の由来が導けた、と書かない。形成の文は予想の文として引くだけ。観測の向きは固定の比べる列(合わせない)。
import * as E from './lib-w347e-spintorque.mjs';
import * as C from './lib-w348c-axisbalance.mjs';
import * as BB from './lib-w351e-bgbalance.mjs';
import * as BG from './lib-w350e-bgaxial.mjs';
import * as P from './lib-w342e-powerball.mjs';
import * as J337 from './lib-w337j-spinorbit.mjs';
import * as TL from './lib-w337c-tidelock.mjs';
import { GAL as GAL317 } from './lib-w317c-satcut.mjs';
import { LIT as LIT341G } from './lib-w341g-plutocontrol.mjs';

export const LIB_VERSION = 'w352c-refaxis-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const D2R = Math.PI / 180;

/* ───────── 宣言 ───────── */
export const DECL = Object.freeze({
  planets: Object.freeze(['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune']),
  names: Object.freeze(['eq', 'L', 'ecl']),
  /** 表に並べるほかの候補(T2): La・中央値・部分集合・冥王星を足す */
  extra: Object.freeze(['La', 'med', 'noMer', 'giant4', 'rock4', 'eqPluto', 'LPluto']),
  candNames: Object.freeze({ eq: '等しい重み (eq)', L: '角運動量の重み (L = 質量 × √(a(1 − e²)))', ecl: '黄道の極 (ecl)', La: '質量 × √a の重み (La)', med: '球面上の中央値 (med)',
    noMer: '水星を外す (eq −水星)', giant4: '巨大惑星 4 つ (eq)', rock4: '地球型 4 つ (eq)', eqPluto: '冥王星を足す (eq +冥王星)', LPluto: '冥王星を足す (L +冥王星)' }),
  giant4: Object.freeze(['Jupiter', 'Saturn', 'Uranus', 'Neptune']), rock4: Object.freeze(['Mercury', 'Venus', 'Earth', 'Mars']),
  /** 球面上の中央値(角の和が最小の向き)の反復(球面の Weiszfeld —— 接平面の対数写像) */
  medIter: 2000, medTol: 1e-15,
  /** 表 2 の比べる行(月・イオ・冥王星・カロン —— 向きは第347便e の geometry() の宣言) */
  compareRows: Object.freeze(['Moon', 'Io', 'Pluto', 'Charon']),
  /** 方位の 0 の向き: 春分点の向き x̂ を基準軸に垂直な面に写したもの(ecl では x̂ そのもの) */
  az0: '春分点の向き x̂(黄道 J2000)を基準軸に垂直な面に写した向き・右ねじ(基準軸のまわり)で正',
  /** 統括の数え直し 1(2026-11-24)の数 —— 小数 3 桁で一致を門に */
  anchor: Object.freeze({ eq: Object.freeze([0.0339521, -0.0096634, 0.9993767]), La: Object.freeze([0.0262660, 0.0083219, 0.9996203]), sunEq: 5.230, sunLa: 5.968, sunEcl: 7.252, looMax: 0.750, looMin: 0.12,
    bgEq: 62.136, bgLa: 61.695, bgEcl: 60.189, bgSun: 67.231, tol: 5e-4 }),
  judge: '角は 1e-9° 以下を 0 と書く・単位ベクトルの成分は 7 桁で照合(統括の脚本の桁)',
});

/* ───────── 小さな道具 ───────── */
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const scl = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const unit = (a) => { const m = nrm(a); if (!(m > 0)) throw new RangeError('unit: 長さ 0'); return scl(a, 1 / m); };
const isVec = (a) => Array.isArray(a) && a.length === 3 && a.every(fin);
export const vec = Object.freeze({ dot, crs, nrm, scl, add, sub, unit });
/** 2 つの向きの角(°)—— atan2 で(小さい角も桁を落とさない) */
export function angDeg(a, b) {
  if (!(isVec(a) && isVec(b))) throw new RangeError('angDeg: ベクトル');
  if (!(nrm(a) > 0 && nrm(b) > 0)) return null;
  return Math.atan2(nrm(crs(a, b)), dot(a, b)) / D2R;
}
/** 円錐の半頂角(°)= 自転軸 ŝ と軸のなす角(逆行の天体は ŝ の向きのまま —— 金星は 177° の側) */
export function coneDeg(axis, sHat) { return angDeg(axis, sHat); }

/* ───────── 群の材料 ───────── */
const elOf = (id) => { const h = LIT341G.helio[id.toLowerCase()]; if (!h) throw new RangeError('elOf: 道の要素が無い ' + id); return { a: h[0], e: h[1] }; };
/** 統括の脚本と同じ a(t1Table の β から —— m 単位) */
function aFromT1(T1, id) {
  const r = T1.find((x) => x.id === id && x.src === 'Sun' && x.mag === 'm2');
  if (!r) throw new RangeError('aFromT1: t1Table に ' + id + '|Sun の m2 の行が無い');
  const beta = r.Om1 / r.OmegaT; return TL.G_SI * C.massOf('Sun') / (beta * TL.C_SI * TL.C_SI);
}
/** 群の 1 行: 法線・質量・道の要素(冥王星の質量は第337便j の LIT・a・e は第341便g の LIT.helio —— La の a は AU から) */
export function members(T1 = E.t1Table(), GEO = E.geometry(), { pluto = false } = {}) {
  const rows = DECL.planets.map((id) => { const el = elOf(id), m = C.massOf(id);
    return { id, n: unit(GEO[id + '|Sun'].n), m, aAU: el.a, e: el.e, aT1: aFromT1(T1, id), wEq: 1, wL: m * Math.sqrt(el.a * (1 - el.e * el.e)), wLa: m * Math.sqrt(aFromT1(T1, id)) }; });
  if (pluto) { const m = J337.LIT.pluto.m, el = elOf('Pluto');
    rows.push({ id: 'Pluto', n: unit(GEO['Pluto|Sun'].n), m, aAU: el.a, e: el.e, aT1: null, wEq: 1, wL: m * Math.sqrt(el.a * (1 - el.e * el.e)), wLa: m * Math.sqrt(el.a * 1.495978707e11) }); }
  return rows;
}
/** 重みつきの平均の向き(重み w・法線 n の行から)—— 変異は行を差し替えて呼ぶ */
export function meanAxis(rows, wKey = 'wEq') {
  if (!Array.isArray(rows) || rows.length === 0) throw new RangeError('meanAxis: 行が要る');
  let s = [0, 0, 0];
  for (const r of rows) { const w = r[wKey]; if (!(fin(w) && w >= 0) || !isVec(r.n)) throw new RangeError('meanAxis: 重み ≥ 0 と法線'); s = add(s, scl(unit(r.n), w)); }
  return unit(s);
}
/** 球面上の中央値(角の和が最小の向き)—— 球面の Weiszfeld(接平面の対数写像で平均 → 指数写像) */
export function sphMedian(ns, { x0 = null, iter = DECL.medIter, tol = DECL.medTol } = {}) {
  if (!Array.isArray(ns) || ns.length === 0 || !ns.every(isVec)) throw new RangeError('sphMedian: 向きの並び');
  let x = x0 ? unit(x0) : unit(ns.reduce((s, n) => add(s, unit(n)), [0, 0, 0])), it = 0;
  for (; it < iter; it++) {
    let num = [0, 0, 0], den = 0;
    for (const n0 of ns) { const n = unit(n0), c = Math.max(-1, Math.min(1, dot(x, n))), th = Math.acos(c); if (th < 1e-14) continue;
      const t = sub(n, scl(x, c)), tl = nrm(t); if (!(tl > 0)) continue; const v = scl(t, th / tl); num = add(num, scl(v, 1 / th)); den += 1 / th; }
    if (!(den > 0)) break;
    const step = scl(num, 1 / den), sl = nrm(step); if (sl < tol) break;
    x = unit(add(scl(x, Math.cos(sl)), scl(step, Math.sin(sl) / sl)));
  }
  return { axis: x, iter: it, sumDeg: ns.reduce((s, n) => s + angDeg(x, n), 0) };
}
/** 角の二乗平均(°)—— 軸のまわりの法線の散らばり */
export function rmsDeg(axis, ns) { return Math.sqrt(ns.reduce((s, n) => s + angDeg(axis, n) ** 2, 0) / ns.length); }

/* ───────── 約束の口 ───────── */
/** 基準軸の候補 3 つ(eq・L・ecl —— 黄道 J2000・単位ベクトル)+ 比べる列 La・members・weights */
export function refAxes(T1 = E.t1Table(), GEO = E.geometry()) {
  const M = members(T1, GEO);
  return { eq: meanAxis(M, 'wEq'), L: meanAxis(M, 'wL'), La: meanAxis(M, 'wLa'), ecl: [0, 0, 1], members: M.map((r) => r.id),
    weights: { eq: M.map(() => 1), L: M.map((r) => r.wL), La: M.map((r) => r.wLa) } };
}
/** 名前で 1 つ('eq'・'L'・'ecl' —— 'La'・'med' も受ける) */
export function refAxis(name, T1 = E.t1Table(), GEO = E.geometry()) {
  if (name === 'med') return sphMedian(members(T1, GEO).map((r) => r.n)).axis;
  if (!['eq', 'L', 'ecl', 'La'].includes(name)) throw new RangeError('refAxis: 名は eq・L・ecl(La・med も可)');
  return refAxes(T1, GEO)[name];
}
/** 1 つ外した軸と、元の軸から動いた角(°)—— name は 'eq'・'L'・'La'(ecl は群に依らないので外しても動かない) */
export function looAxes(T1 = E.t1Table(), GEO = E.geometry(), name = 'eq') {
  const key = { eq: 'wEq', L: 'wL', La: 'wLa' }[name];
  if (!key) throw new RangeError('looAxes: 名は eq・L・La');
  const M = members(T1, GEO), base = meanAxis(M, key);
  return M.map((r, i) => { const ax = meanAxis(M.filter((_, j) => j !== i), key); return { out: r.id, axis: ax, movedDeg: angDeg(ax, base) }; });
}
/** 候補の全部(T2 の表の列)—— { name: axis } */
export function candidates(T1 = E.t1Table(), GEO = E.geometry()) {
  const M = members(T1, GEO), MP = members(T1, GEO, { pluto: true }), R = refAxes(T1, GEO), pick = (ids) => M.filter((r) => ids.includes(r.id));
  return { eq: R.eq, L: R.L, ecl: R.ecl, La: R.La, med: sphMedian(M.map((r) => r.n)).axis, noMer: meanAxis(M.filter((r) => r.id !== 'Mercury'), 'wEq'),
    giant4: meanAxis(pick(DECL.giant4), 'wEq'), rock4: meanAxis(pick(DECL.rock4), 'wEq'), eqPluto: meanAxis(MP, 'wEq'), LPluto: meanAxis(MP, 'wL') };
}

/* ───────── 自転軸と公転の法線(表 2 の行)───────── */
/** 太陽・8 惑星・比べる行の自転軸 ŝ(符号つき)と自分の公転の法線(太陽は null・衛星は母天体のまわり —— 第347便e の geometry() の宣言) */
export function spinRows(GEO = E.geometry()) {
  const rows = [{ id: 'Sun', s: unit(GEO['Earth|Sun'].s), n: null, role: '太陽' }];
  for (const id of DECL.planets) rows.push({ id, s: unit(GEO[id + '|Sun'].w), n: unit(GEO[id + '|Sun'].n), role: '惑星' });
  rows.push({ id: 'Moon', s: unit(GEO['Moon|EarthHi'].w), n: unit(GEO['Moon|EarthHi'].n), role: '比べる行(宣言 —— 交点の位相 Hi)' });
  rows.push({ id: 'Io', s: unit(GEO['Io|Jupiter'].w), n: unit(GEO['Io|Jupiter'].n), role: '比べる行(宣言 —— 同期)' });
  rows.push({ id: 'Pluto', s: unit(GEO['Pluto|Sun'].w), n: unit(GEO['Pluto|Sun'].n), role: '比べる行' });
  rows.push({ id: 'Charon', s: unit(GEO['Pluto|Charon'].w), n: unit(GEO['Pluto|Charon'].n), role: '比べる行(宣言 —— 互いに同期・冥王星のまわり)' });
  return rows;
}

/* ───────── 方位(表 3)───────── */
/** 基準軸 p に垂直な面の基底(e1 = 春分点の向き x̂ を写したもの・e2 = p × e1) */
export function planeBasis(p) {
  const pu = unit(p), x = [1, 0, 0], t = sub(x, scl(pu, dot(x, pu)));
  const e1 = nrm(t) > 1e-9 ? unit(t) : unit(sub([0, 1, 0], scl(pu, dot([0, 1, 0], pu))));
  return { p: pu, e1, e2: crs(pu, e1) };
}
/** 向き v の方位(°・(−180, 180]・p のまわり右ねじで正)と p からの角(°)—— p に平行なら方位 null */
export function azimuthDeg(p, v) {
  const B = planeBasis(p), vu = unit(v), t = sub(vu, scl(B.p, dot(vu, B.p)));
  return { az: nrm(t) < 1e-12 ? null : Math.atan2(dot(t, B.e2), dot(t, B.e1)) / D2R, offDeg: angDeg(B.p, vu) };
}
/** 方位の差(°・(−180, 180]) */
export const dAz = (a, b) => (a === null || b === null ? null : ((a - b + 540) % 360) - 180);

/* ───────── 背景の向き(表 3・表 4)───────── */
/** 銀河の向き: (G−) 銀河の回転と逆(第351便e の bgTerm の主の向き)・(G+)・銀河の面の法線(北極 NGP)・銀河中心の向き(第317便c の GAL) */
export function galDirs(GEO = E.geometry()) {
  const Gm = unit(BB.bgTerm('Earth', { u: 1 }).vec), Gp = unit(BB.bgTerm('Earth', { u: 1, sign: 1 }).vec);
  const du = BG.dirUnits(GEO), ngp = P.eclUnit(GAL317.ngpRaDeg, GAL317.ngpDecDeg), gc = P.eclUnit(GAL317.gcRaDeg, GAL317.gcDecDeg);
  return { Gm, Gp, galRot: unit(du.gal), ngp: unit(ngp), gc: unit(gc) };
}
/** 背景の向きの候補 4 つ(基準軸 axis に対して): (G−)・(G+)・(N+) = axis・(N−) = −axis */
export function bgDirs(axis, GEO = E.geometry()) { const g = galDirs(GEO), a = unit(axis); return { Gm: g.Gm, Gp: g.Gp, Np: a, Nm: scl(a, -1) }; }

/* ───────── 零試験 ───────── */
export function pureScenes(T1 = E.t1Table(), GEO = E.geometry()) {
  const R = refAxes(T1, GEO), sun = unit(GEO['Earth|Sun'].s), M = members(T1, GEO), g = galDirs(GEO);
  // ① 統括の数え直しの数(公開の lib を呼ぶ脚本と同じ作り —— a は t1Table の β から)
  const anc = { eq: R.eq, La: R.La, sunEq: angDeg(R.eq, sun), sunLa: angDeg(R.La, sun), sunEcl: angDeg(R.ecl, sun), loo: looAxes(T1, GEO, 'eq').map((r) => r.movedDeg),
    bgEq: angDeg(R.eq, g.Gm), bgLa: angDeg(R.La, g.Gm), bgEcl: angDeg(R.ecl, g.Gm), bgSun: angDeg(sun, g.Gm) };
  // ② 重みを全部同じにした L が eq と一致(L の作りに等しい重みを入れる)
  const eqW = M.map((r) => ({ ...r, wL: 7.5 })), sameW = nrm(sub(meanAxis(eqW, 'wL'), R.eq));
  // ③ 法線を全部 1 本にそろえた変異で軸がその 1 本になる(eq・L・La・中央値)
  const one = unit([0.3, -0.2, 0.9]), oneRows = M.map((r) => ({ ...r, n: one }));
  const oneAx = Math.max(nrm(sub(meanAxis(oneRows, 'wEq'), one)), nrm(sub(meanAxis(oneRows, 'wL'), one)), nrm(sub(meanAxis(oneRows, 'wLa'), one)), nrm(sub(sphMedian(oneRows.map((r) => r.n)).axis, one)));
  // ④ 中央値の自己試験: 対称な 4 本(z のまわりに 90° ごと・z から 10°)の中央値は z/1 本の重みを増すと平均はそちらへ寄る
  const sym = [0, 90, 180, 270].map((a) => [Math.sin(10 * D2R) * Math.cos(a * D2R), Math.sin(10 * D2R) * Math.sin(a * D2R), Math.cos(10 * D2R)]);
  const medSym = angDeg(sphMedian(sym, { x0: [0.1, 0.05, 1] }).axis, [0, 0, 1]);
  // ⑤ 方位の自己試験: ecl のまわりで x̂ は 0°・ŷ は +90°・ẑ は null
  const azT = [azimuthDeg([0, 0, 1], [1, 0, 0.3]).az, azimuthDeg([0, 0, 1], [0, 1, 0]).az, azimuthDeg([0, 0, 1], [0, 0, 1]).az];
  // ⑥ 1 つ外した軸の最大(水星)
  const looMaxId = looAxes(T1, GEO, 'eq').reduce((b, r) => (r.movedDeg > b.movedDeg ? r : b)).out;
  // ⑦ 角の道具: atan2 の角と acos の角が一致(普通の角)・小さな角も 0 にならない
  const angT = { a: Math.abs(angDeg([1, 0, 0], [1, 1, 0]) - 45), small: angDeg([1, 0, 0], [1, 1e-10, 0]) };
  // ⑧ 入力の拒否
  const rej = [() => refAxis('zz', T1, GEO), () => looAxes(T1, GEO, 'ecl'), () => meanAxis([]), () => meanAxis([{ n: [1, 0, 0], wEq: -1 }]), () => sphMedian([[1, 0]]), () => angDeg([1, 0], [1, 0, 0])]
    .map((fn) => { try { fn(); return false; } catch (e) { return e instanceof RangeError; } });
  return { anc, sameW, oneAx, medSym, azT, looMaxId, angT, gmIsNgp: angDeg(g.Gm, g.ngp), rejects: rej };
}
export function pureGates(S) {
  const A = DECL.anchor, ok3 = (x, w) => Math.abs(x - w) <= A.tol, vok = (v, w) => v.every((x, i) => Math.abs(x - w[i]) <= 5e-7);
  return {
    anchorAxes: vok(S.anc.eq, A.eq) && vok(S.anc.La, A.La),
    anchorSun: ok3(S.anc.sunEq, A.sunEq) && ok3(S.anc.sunLa, A.sunLa) && ok3(S.anc.sunEcl, A.sunEcl),
    anchorLoo: ok3(Math.max(...S.anc.loo), A.looMax) && Math.abs(Math.min(...S.anc.loo) - A.looMin) <= 5e-3 && S.looMaxId === 'Mercury',
    anchorBg: ok3(S.anc.bgEq, A.bgEq) && ok3(S.anc.bgLa, A.bgLa) && ok3(S.anc.bgEcl, A.bgEcl) && ok3(S.anc.bgSun, A.bgSun) && S.gmIsNgp < 1e-9,
    sameWeights: S.sameW < 1e-15,
    oneNormal: S.oneAx < 1e-12,
    median: S.medSym < 1e-9,
    azimuth: Math.abs(S.azT[0]) < 1e-12 && Math.abs(S.azT[1] - 90) < 1e-12 && S.azT[2] === null,
    angleTool: S.angT.a < 1e-12 && Math.abs(S.angT.small - 1e-10 / D2R) < 1e-15,
    rejects: S.rejects.length === 6 && S.rejects.every(Boolean),
  };
}
