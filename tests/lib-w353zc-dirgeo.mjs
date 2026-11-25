// 第353便zc(原仮定者の回答(2026-11-25 —— 第151報)「向きと幾何: …」「向きと大きさは別々に合わせて良い」・統括の検証項目 R493):
//   **向きの一致の幾何 —— 金星の公転の法線は「基準軸から太陽の自転軸へ 1/3 の所」(n★)の近くに在る: いまの配置が 1 周の中でどの辺りか(太陽の自転軸の円錐の位相・公転面の交点を回したときの百分位)・
//   どの惑星でも起こり得る並びか(弧の上の位置と横のずれ・n★ の近くに法線が来る見込み)・受け手の半径の置き方と衛星の道の面を替えたときの金星の順位を数える純関数。診断だけ**
//   (器 tests/exp-w353zc-dirgeo.mjs と QA behavior.dirgeo353zc・docs.dirgeo353zc が読む —— html を読まない・ファイルを読まない・状態を持たない。後のラウンドの枝もこの口を import してよい)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない。既存の lib は呼ぶだけ(本文は変えない):
//   第353便t(closedPhi・dirMatch・rankAll・localT・avgRot・cRCross —— 向きの一致と 14 の受け手)・第353便v(cRStarOf —— 受け手ごとの c_R★)・第352便h(sDirClosed)・第352便k(vec・srcRadius・spinRot・omegaG)・
//   第352便c(refAxis —— 基準軸は必ずここから)・第351便c(pairInput)・第351便j(ringBasis)・第348便h(YK)・第348便c(massOf・radiusOf)・第312便a(Kball)・第337便c(G_SI)・第334便a(LIT334A —— 衛星の質量・半径・道の半径 —— 文献の値・未照合)・第347便e(t1Table・geometry)。
//   **第353便t の lib(→ 第353便l → 第353便g)と第353便v の lib(→ 第353便j)は仮の値の lib(第352便b)を import する —— この lib を呼ぶ段の正本は最上位に provisional: true と使った鍵の一覧(本 lib の数には使わない)。**
//
// ■ 語: b̂ = 基準軸(背景 (N+) の向き —— 主の列は L)。ŝ☉ = 太陽の自転軸。n̂ = 惑星の公転の法線。φ = 局所の (S) の逆向きと b̂ の角 = ∠(3(ŝ☉·n̂)n̂ − ŝ☉, b̂)(第352便h の閉じた形)。own = 2 sin(φ/2)。
//   n★ = b̂ から ŝ☉ の向きへ 1/3 の所(弦の形 unit((2/3)b̂ + (1/3)ŝ☉) —— 第353便t の表と同じ定義)。n★exact = 弧の上で φ が 0 になる点(二分)。
//   弧の上の位置 t = (n̂ を b̂・ŝ☉ の大円へ落とした点の b̂ からの角)÷(b̂ と ŝ☉ の角)—— 0 = 基準軸・1 = 太陽の自転軸。横のずれ = n̂ と大円の面の角(符号は (b̂ × ŝ☉) の向きを正)。
//   1/3 の由来: 公転の 1 周で平均した (S) の項 ⟨3(ŝ☉·r̂)r̂ − ŝ☉⟩ = (1/2)ŝ☉ − (3/2)(ŝ☉·n̂)n̂ —— 法線の成分の重み 3/2・自転軸の成分の重み 1/2・比 1/3。小さい角で φ ≈ (3/2) ÷ (3/2 − 1/2) × ∠(n̂, n★) = 1.5 × ∠(n̂, n★)。
//   太陽の位相 sunPhaseDeg = ŝ☉ を b̂ のまわりに回す角(円錐の半頂角を保つ —— いま = 0)。交点 nodeDeg = n̂ を b̂ のまわりに回す角(b̂ との角を保つ —— いま = 0)。incDeg = n̂ と b̂ の角を置き替える。
//   周期と向きの格子(公転面の交点が回る周期・向き)はリポジトリに数が無い —— **ノブ(値は未照合)の格子で、DFM の式ではない比べる列**。太陽の円錐の周期は注目の列 u 0.98 の u ω_G から(第353便b の 2.24 億年)。
// ■ 言わないこと: 金星が選ばれた理由を言い当てる表ではない・配置を言い当てる表ではない(配置の表と百分位)。置き方を決めない。この場・この置き方・このノブでは、の表。
import * as T from './lib-w353t-dirmatch.mjs';
import * as V from './lib-w353v-recvscale.mjs';
import * as H from './lib-w352h-venusbal.mjs';
import * as K from './lib-w352k-spinform.mjs';
import * as RA from './lib-w352c-refaxis.mjs';
import * as SP from './lib-w351c-srcparts.mjs';
import * as RJ from './lib-w351j-ringstep.mjs';
import * as G3 from './lib-w348h-axisgeo3.mjs';
import * as C from './lib-w348c-axisbalance.mjs';
import * as D from './lib-w312a-decay.mjs';
import * as TL from './lib-w337c-tidelock.mjs';
import * as E from './lib-w347e-spintorque.mjs';
import { LIT334A } from './lib-w334a-heightlaw.mjs';

export const LIB_VERSION = 'w353zc-dirgeo-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const D2R = Math.PI / 180, YR = 365.25 * 86400;
const { dot, crs, nrm, scl, add, sub, unit } = K.vec;
const angDeg = (a, b) => Math.atan2(nrm(crs(a, b)), dot(a, b)) / D2R;

/* ───────── 宣言 ───────── */
export const DECL = Object.freeze({
  planets: T.DECL.planets,
  recvs: T.DECL.recvs,
  moons: T.DECL.moons,
  host: T.DECL.host,
  axes: Object.freeze(['L', 'eq', 'ecl']),
  /** 1/3 の由来(公転の 1 周の平均の重み): 法線の成分 3/2・自転軸の成分 1/2 */
  weights: Object.freeze({ normal: 1.5, spin: 0.5 }),
  /** 位相と交点の刻み(°)—— 0〜360° を nScan 点 */
  nScan: 3600,
  /** 太陽の円錐の周期: 注目の列 u = 0.98(第353便b の u ω_G —— 向きは (g2−) で順回転の太陽の自転と逆回り) */
  uFocus: 0.98, sunSense: -1,
  /** 公転面の交点が回る周期(年)と向き —— ノブ(値は未照合)の格子。DFM の式ではない比べる列 */
  nodePeriodsYr: Object.freeze([1e5, 1e6, 1e7, 1e8, 1e9]), nodeSenses: Object.freeze([-1, 1]),
  /** 「n★ の近くに法線が来る見込み」の帽子の半径(°)—— ノブの格子(法線が基準軸のまわりの帽子に一様に散らばる見本) */
  capDeg: Object.freeze([3, 5, 7.5]),
  /** 表 4: 受け手の半径の置き方 */
  cRUni: Object.freeze([1e-3, 0.0128, 0.02, 0.03, 0.04, 0.1, 1]),
  rGrid: Object.freeze([0.01, 0.03, 0.1, 0.195, 0.3, 1, 3, 10]),
  c0Grid: Object.freeze([1, 1e2, 1e4, 1e5, 5.99e5, 1e6, 1.81e6, 1e7]),
  moonW: Object.freeze([0, 0.25, 0.5, 0.75, 1]),
  /** 零試験の点検の数(第353便t の表 2a・統括の数え直し 3・第353便b) */
  anchor: Object.freeze({ venusToNstar: '0.508', saturnToNstar: '1.66', venusPhi: 0.7606, sunCone: '5.968', sunPeriodYr: '2.24e+8' }),
  /** 仮の値の台帳の鍵(第353便t・第353便v の lib の閉包に入る —— 本 lib の数には使わない) */
  provKeys: Object.freeze(['earth.precSense', 'earth.psiA.rate', 'mars.prec.rate', 'venus.prec.rate', 'venus.spin.period']),
  judge: '丸めの桁の床: φ は atan2 の形で直接に数える(残りは差で作らない —— 2 sin(φ/2))・零試験は相対 1e-9・表の照合は有効数字 3〜5 桁',
});

/* ───────── 幾何の口 ───────── */
const rotAbout = (v, ax, deg) => { const a = deg * D2R, c = Math.cos(a), s = Math.sin(a); return add(add(scl(v, c), scl(crs(ax, v), s)), scl(ax, dot(ax, v) * (1 - c))); };
/** 基準軸 b̂・太陽の自転軸 ŝ☉・8 惑星の公転の法線 */
export function frame(T1 = E.t1Table(), GEO = E.geometry(), { axis = 'L' } = {}) {
  if (!DECL.axes.includes(axis)) throw new RangeError('frame: 基準軸は ' + DECL.axes.join('・'));
  const b = unit(RA.refAxis(axis, T1, GEO)), s = unit(SP.pairInput(T1, GEO, 'Venus', 'Sun').sAx), normals = {};
  for (const id of DECL.planets) normals[id] = unit(SP.pairInput(T1, GEO, id, 'Sun').nHat);
  return { axis, b, s, normals };
}
/** n★(弦の形 —— 既定 frac 1/3。第353便t の表 2a と同じ定義) */
export function nStar(axisVec, sunSpin, { frac = 1 / 3 } = {}) {
  if (!(Array.isArray(axisVec) && Array.isArray(sunSpin) && fin(frac) && frac >= 0 && frac <= 1)) throw new RangeError('nStar: 入力');
  return unit(add(scl(unit(axisVec), 1 - frac), scl(unit(sunSpin), frac)));
}
/** 閉じた形の φ(°)と own(第353便t の closedPhi を呼ぶ) */
export function phiOf(s, n, b) { const ph = T.closedPhi(s, n, b).phiDeg; return { phiDeg: ph, own: 2 * Math.sin(ph * D2R / 2) }; }
/** 弧の上で φ が 0 になる点(大円 b̂ → ŝ☉ の角の割合 —— 二分)。φ の閉じた形のベクトルの、弧の面の中の b̂ に垂直な成分の符号で分ける */
export function nStarExact(b0, s0) {
  const b = unit(b0), s = unit(s0), th = angDeg(b, s) * D2R, e = unit(sub(s, scl(b, dot(s, b)))), at = (f) => add(scl(b, Math.cos(f * th)), scl(e, Math.sin(f * th)));
  const g = (f) => { const n = at(f); return dot(sub(scl(n, 3 * dot(s, n)), s), e); };
  let lo = 0, hi = 1; for (let i = 0; i < 80; i++) { const m = 0.5 * (lo + hi); if (g(m) < 0) lo = m; else hi = m; }
  const f = 0.5 * (lo + hi); return { frac: f, n: at(f), phiDeg: phiOf(s, at(f), b).phiDeg };
}
/** 公転の 1 周で平均した (S) の項 ⟨3(ŝ☉·r̂)r̂ − ŝ☉⟩(数で平均 —— N 点)と閉じた形の重み (1/2)ŝ☉ − (3/2)(ŝ☉·n̂)n̂ */
export function orbitAvg(s0, n0, N = 24) {
  const s = unit(s0), n = unit(n0), [x, y] = RJ.ringBasis(n); let m = [0, 0, 0];
  for (let j = 0; j < N; j++) { const ph = 2 * Math.PI * (j + 0.5) / N, r = add(scl(x, Math.cos(ph)), scl(y, Math.sin(ph))); m = add(m, scl(sub(scl(r, 3 * dot(s, r)), s), 1 / N)); }
  const closed = sub(scl(s, DECL.weights.spin), scl(n, DECL.weights.normal * dot(s, n)));
  return { num: m, closed, rel: nrm(sub(m, closed)) / nrm(closed), toSDir: angDeg(scl(m, -1), H.sDirClosed(s, n)) };
}
/** 惑星 key の公転の法線が弧 b̂ → ŝ☉ のどこに在るか */
export function arcPos(key, { axis = 'L', T1 = E.t1Table(), GEO = E.geometry(), F = null } = {}) {
  if (!DECL.planets.includes(key)) throw new RangeError('arcPos: 8 惑星だけ(' + DECL.planets.join('・') + ')');
  const f = F || frame(T1, GEO, { axis }), { b, s } = f, n = f.normals[key], th = angDeg(b, s);
  const w = unit(crs(b, s)), side = Math.asin(Math.max(-1, Math.min(1, dot(n, w)))) / D2R, np = sub(n, scl(w, dot(n, w)));
  const e = unit(sub(s, scl(b, dot(s, b)))), along = Math.atan2(dot(np, e), dot(np, b)) / D2R, ns = nStar(b, s), ph = phiOf(s, n, b);
  return { key, axis, t: along / th, alongDeg: along, sideDeg: side, arcDeg: th, nToB: angDeg(n, b), toNstarDeg: angDeg(n, ns), phiDeg: ph.phiDeg, own: ph.own, ratio: ph.phiDeg / angDeg(n, ns) };
}
/** 太陽の自転軸を円錐の上で sunPhaseDeg 回し・法線を b̂ のまわりに nodeDeg 回し(incDeg を置けば b̂ との角を置き替え)たときの φ */
export function phiAt(key, { sunPhaseDeg = 0, nodeDeg = 0, incDeg = null, axis = 'L', T1 = E.t1Table(), GEO = E.geometry(), F = null } = {}) {
  if (!DECL.planets.includes(key)) throw new RangeError('phiAt: 8 惑星だけ');
  if (!(fin(sunPhaseDeg) && fin(nodeDeg) && (incDeg === null || (fin(incDeg) && incDeg >= 0 && incDeg < 90)))) throw new RangeError('phiAt: 角');
  const f = F || frame(T1, GEO, { axis }), { b } = f, s = rotAbout(f.s, b, sunPhaseDeg);
  let n = f.normals[key];
  if (incDeg !== null) { const e = unit(sub(n, scl(b, dot(n, b)))); n = add(scl(b, Math.cos(incDeg * D2R)), scl(e, Math.sin(incDeg * D2R))); }
  n = rotAbout(n, b, nodeDeg);
  const ph = phiOf(s, n, b);
  return { key, phiDeg: ph.phiDeg, own: ph.own, toNstarDeg: angDeg(n, nStar(b, s)), sunToB: angDeg(s, b), nToB: angDeg(n, b) };
}

/* ───────── 時間の物差し(太陽の円錐の周期 —— 注目の列)───────── */
export function sunPeriodYr() { return 2 * Math.PI / (DECL.uFocus * K.DECL.omegaG) / YR; }
/** 相対の位相の周期(年): 太陽の円錐(向き sunSense)と交点(周期 P・向き σ —— ノブ)の差の回り */
export function relPeriodYr(Pnode, sense) {
  if (!(fin(Pnode) && Pnode > 0 && (sense === 1 || sense === -1))) throw new RangeError('relPeriodYr: 周期 > 0・向き ±1');
  const w = DECL.sunSense / sunPeriodYr() - sense / Pnode; return Math.abs(w) < 1e-30 ? Infinity : 1 / Math.abs(w);
}

/* ───────── 走査 ───────── */
const pct = (arr, x0) => arr.filter((x) => x < x0).length / arr.length;
/** 太陽の位相を 0〜360° 回したときの 8 惑星の φ(交点はいまのまま)—— 金星の幅・いまの百分位・1 番の割合 */
export function sunScan(T1 = E.t1Table(), GEO = E.geometry(), { axis = 'L', n = DECL.nScan, moonsOwn = null } = {}) {
  const F = frame(T1, GEO, { axis }), ph = Array.from({ length: n }, (_, j) => 360 * j / n);
  const grid = ph.map((p) => Object.fromEntries(DECL.planets.map((id) => [id, phiAt(id, { sunPhaseDeg: p, F }).phiDeg])));
  const firstOf = (g) => DECL.planets.reduce((m, id) => (m === null || g[id] < g[m] ? id : m), null);
  const firsts = grid.map(firstOf), moonMin = moonsOwn === null ? null : Math.min(...Object.values(moonsOwn));
  const rows = DECL.planets.map((id) => { const a = grid.map((g) => g[id]), a0 = a[0];
    return { id, phi0: a0, min: Math.min(...a), max: Math.max(...a), argMin: ph[a.indexOf(Math.min(...a))], pct: pct(a, a0), firstFrac: firsts.filter((k) => k === id).length / n,
      firstFrac14: moonMin === null ? null : grid.filter((g) => firstOf(g) === id && 2 * Math.sin(g[id] * D2R / 2) < moonMin).length / n }; });
  return { axis, n, rows, firstSet: [...new Set(firsts)].sort(), moonMin };
}
/** 金星(既定)の交点を 0〜360° 回したとき(b̂ との角を保つ): φ の幅・いまの百分位・φ ≤ 2 × いまの割合・いまを含む窓 */
export function nodeScan(T1 = E.t1Table(), GEO = E.geometry(), { axis = 'L', id = 'Venus', n = DECL.nScan, factor = 2 } = {}) {
  const F = frame(T1, GEO, { axis }), ps = Array.from({ length: n }, (_, j) => 360 * j / n - 180), a = ps.map((p) => phiAt(id, { nodeDeg: p, F }).phiDeg);
  const j0 = ps.indexOf(0), a0 = a[j0], lim = factor * a0;
  let lo = j0, hi = j0; while (lo > 0 && a[lo - 1] <= lim) lo--; while (hi < n - 1 && a[hi + 1] <= lim) hi++;
  const firsts = ps.map((p, j) => (DECL.planets.every((k) => k === id || phiAt(k, { F }).phiDeg > a[j]) ? 1 : 0));
  return { axis, id, n, phi0: a0, min: Math.min(...a), max: Math.max(...a), argMin: ps[a.indexOf(Math.min(...a))], pct: pct(a, a0), fracLe: a.filter((x) => x <= lim).length / n,
    winLo: ps[lo], winHi: ps[hi], winDeg: ps[hi] - ps[lo] + 360 / n, firstFrac: firsts.reduce((s, x) => s + x, 0) / n };
}
/** 相対の位相の同値: 太陽の位相 +p と交点 −p は同じ φ(b̂ のまわりの回転は相対の位相だけで決まる) */
export function relSame(T1 = E.t1Table(), GEO = E.geometry(), { axis = 'L', id = 'Venus', ps = [17, 95, 233] } = {}) {
  const F = frame(T1, GEO, { axis }); return Math.max(...ps.map((p) => Math.abs(phiAt(id, { sunPhaseDeg: p, F }).phiDeg / phiAt(id, { nodeDeg: -p, F }).phiDeg - 1)));
}
/** 時間の窓: 交点の周期と向きの格子(ノブ)ごとに、相対の周期と、φ ≤ 2 × いまで在る時間の長さ・いまから窓を出るまでの時間 */
export function timeRows(NS) {
  const out = [], Ps = sunPeriodYr();
  out.push({ case: 'sunOnly', Pnode: null, sense: null, relYr: Ps, inWinYr: Ps * NS.winDeg / 360, toExitYr: Ps * Math.abs(DECL.sunSense > 0 ? NS.winHi : NS.winLo) / 360 });
  for (const P of DECL.nodePeriodsYr) for (const sg of DECL.nodeSenses) {
    const R = relPeriodYr(P, sg), w = DECL.sunSense / Ps - sg / P, rel = w > 0 ? NS.winHi : -NS.winLo;   // 相対の位相(太陽 − 交点)の進む向き —— 交点の座標では −(太陽 − 交点)
    out.push({ case: 'node', Pnode: P, sense: sg, relYr: R, inWinYr: R * NS.winDeg / 360, toExitYr: R * Math.abs(w > 0 ? NS.winLo : NS.winHi) / 360, dirSign: Math.sign(w), _r: rel });
  }
  return out.map(({ _r, ...r }) => r);
}
/** 見込み: 惑星ごとに、いまの b̂ との角を保って交点を回したとき、n★ からの角が金星のいまの値以下になる交点の割合・帽子の見本で 8 惑星のどれかが入る見込み */
export function chanceRows(T1 = E.t1Table(), GEO = E.geometry(), { axis = 'L', n = DECL.nScan } = {}) {
  const F = frame(T1, GEO, { axis }), dV = arcPos('Venus', { F }).toNstarDeg, ns = nStar(F.b, F.s), rNs = angDeg(ns, F.b);
  const rows = DECL.planets.map((id) => { const a = Array.from({ length: n }, (_, j) => phiAt(id, { nodeDeg: 360 * j / n, F }).toNstarDeg), i = angDeg(F.normals[id], F.b);
    return { id, incDeg: i, minToNstar: Math.min(...a), frac: a.filter((x) => x <= dV).length / n, fracFormula: Math.abs(i - rNs) > dV ? 0 : null }; });
  const caps = DECL.capDeg.map((c) => { const p = (1 - Math.cos(dV * D2R)) / (1 - Math.cos(c * D2R)); return { capDeg: c, p1: p, pAny8: 1 - Math.pow(1 - p, 8) }; });
  return { axis, dVenus: dV, nStarToB: rNs, rows, caps, incMax: Math.max(...rows.map((r) => r.incDeg)) };
}

/* ───────── 表 4: 受け手の半径の置き方と衛星の道の面 ───────── */
const moonData = (key, T1, GEO) => {
  if (key === 'Moon') { const Q = SP.pairInput(T1, GEO, 'Moon', 'EarthHi'); return { m: Q.m, a: Q.a, R: C.radiusOf('Moon') }; }
  const M = LIT334A.moons.find((x) => x.key === key.toLowerCase()); return { m: M.m, a: M.a, R: M.R };
};
/** 受け手 key の質量と観測半径(8 惑星は第348便c・衛星は第334便a〔月は第351便c の組〕) */
export function massRadius(key, T1 = E.t1Table(), GEO = E.geometry()) {
  if (DECL.planets.includes(key)) return { m: C.massOf(key), R: C.radiusOf(key) };
  if (DECL.moons.includes(key)) { const d = moonData(key, T1, GEO); return { m: d.m, R: d.R }; }
  throw new RangeError('massRadius: 受け手 ' + key);
}
/** 受け手ごとの c_R★: 8 惑星・月・イオは第353便v の cRStarOf(二分)・ほかの衛星は閉じた形 (3/2)(m ÷ M_母)(道の半径 ÷ 観測半径)(第353便v の式 —— 母天体だけの重み) */
export function cRStarAll(T1 = E.t1Table(), GEO = E.geometry(), cache = null) {
  const o = {};
  for (const k of DECL.recvs) {
    if (DECL.planets.includes(k) || k === 'Moon' || k === 'Io') { const s = V.cRStarOf(k, T1, GEO, cache); o[k] = { cR: s.cR, closed: s.closed, how: 'bisect' }; }
    else { const d = moonData(k, T1, GEO), Mh = C.massOf(DECL.host[k]), c = 1.5 * (d.m / Mh) * (d.a / d.R); o[k] = { cR: c, closed: c, how: 'closed' }; }
  }
  return o;
}
/** 受け手ごとの c_R で 14 の受け手の順位(基準軸 b・(P-場)・cRs[key] が null なら規則の半径) */
export function rankPer(T1, GEO, cRs, { axis = 'L', moonAx = 'repo' } = {}, cache = null) {
  const b = unit(RA.refAxis(axis, T1, GEO));
  const rows = DECL.recvs.map((k) => { const c = cRs[k] === undefined ? null : cRs[k], l = T.localT(T1, GEO, k, c === null ? { moonAx } : { place: 'field', cR: c, moonAx }, cache).loc, ph = angDeg(scl(l, -1), b); return { key: k, cR: c, phiDeg: ph, own: 2 * Math.sin(ph * D2R / 2) }; });
  return rows.sort((p, q) => p.own - q.own).map((r, i) => ({ ...r, rank: i + 1 }));
}
const cut = (top, lo, hi, n = 30) => { if (top(lo) !== 'Venus' || top(hi) === 'Venus') return null; let a = Math.log10(lo), b = Math.log10(hi);
  for (let i = 0; i < n; i++) { const m = 0.5 * (a + b); if (top(Math.pow(10, m)) === 'Venus') a = m; else b = m; } return { at: Math.pow(10, b), next: top(Math.pow(10, b)) }; };
/** 表 4a: 置き方 3 つ(全部同じ c_R・r × c_R★・C0 × 質量 ÷ 観測半径)の格子で金星の順位と 1 番・金星が 1 番を保つ端 */
export function placeRows(T1 = E.t1Table(), GEO = E.geometry(), cache = {}) {
  const st = cRStarAll(T1, GEO, cache), mr = Object.fromEntries(DECL.recvs.map((k) => [k, massRadius(k, T1, GEO)]));
  const row = (way, knob, cRs) => { const r = rankPer(T1, GEO, cRs, {}, cache), v = r.find((x) => x.key === 'Venus'); return { way, knob, venusRank: v.rank, venusOwn: v.own, cRVenus: cRs.Venus, first: r[0].key, firstOwn: r[0].own, second: r[1].key, secondOwn: r[1].own }; };
  const uni = (c) => Object.fromEntries(DECL.recvs.map((k) => [k, c])), per = (rr) => Object.fromEntries(DECL.recvs.map((k) => [k, rr * st[k].cR])), mass = (k0) => Object.fromEntries(DECL.recvs.map((k) => [k, G3.YK * k0 * mr[k].m / mr[k].R]));
  const rows = [row('rule', null, uni(null)), ...DECL.cRUni.map((c) => row('uni', c, uni(c))), ...DECL.rGrid.map((rr) => row('star', rr, per(rr))), ...DECL.c0Grid.map((k0) => row('mass', k0, mass(k0)))];
  const top = (f) => (x) => rankPer(T1, GEO, f(x), {}, cache)[0].key;
  const edges = { uni: cut(top(uni), 1e-3, 1), star: cut(top(per), 0.01, 10), mass: cut(top(mass), 1, 1e8) };
  return { rows, edges, cRStar: Object.fromEntries(DECL.recvs.map((k) => [k, st[k].cR])) };
}
/* 衛星の道の面を母天体の赤道面(w 0)と公転面(w 1)の間で振る(第353便t の localT の 'eq'・'orb' の間 —— 円の道・自転軸は道の法線) */
const sc = (part) => (part === 'M' ? [1, 0] : part === 'S' ? [0, 1] : [1, 1]);
function circPts(l, r, Ms, part, N = 24) {
  const [x, y] = RJ.ringBasis(unit(l)), vc = Math.sqrt(TL.G_SI * Ms / r), s = sc(part);
  return Array.from({ length: N }, (_, j) => { const ph = 2 * Math.PI * (j + 0.5) / N, rh = add(scl(x, Math.cos(ph)), scl(y, Math.sin(ph))); return { p: scl(rh, -r), v: scl(crs(unit(l), rh), vc * s[0]) }; });
}
function helioPts(Q, part, n = K.DECL.nPhase) {
  const x0 = crs(Q.sAx, Q.nHat), x = nrm(x0) > 1e-12 ? unit(x0) : unit(crs(Q.nHat, Math.abs(Q.nHat[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0])), y = crs(Q.nHat, x), s = sc(part);
  return Array.from({ length: n }, (_, j) => { const ph = 2 * Math.PI * (j + 0.5) / n, rh = add(scl(x, Math.cos(ph)), scl(y, Math.sin(ph))); return { p: scl(rh, -Q.a), v: scl(crs(Q.nHat, rh), Q.vOrb * s[0]) }; });
}
/** 円の道の衛星の局所(道の法線 = 母天体の自転軸から公転の法線へ w の所〔角の割合〕・規則の半径・球・(S))。w 0 = 第353便t の 'eq'・w 1 = 'orb' の自転軸と道 */
export function moonLocalW(T1, GEO, key, w, cache = null) {
  if (!DECL.moons.includes(key)) throw new RangeError('moonLocalW: 衛星 ' + DECL.moons.join('・'));
  if (!(fin(w) && w >= 0 && w <= 1)) throw new RangeError('moonLocalW: w は 0〜1');
  const ck = ['mw', key, w].join('|'); if (cache && cache[ck]) return cache[ck];
  const host = DECL.host[key], md = moonData(key, T1, GEO), Q = SP.pairInput(T1, GEO, host, 'Sun'), r2 = T1.find((r) => r.id === host && r.src === 'Sun' && r.mag === 'm2');
  const ax = unit(GEO[host + '|Sun'].w), no = unit(Q.nHat), th = angDeg(ax, no) * D2R, e = unit(sub(no, scl(ax, dot(no, ax))));
  const l = w === 1 ? no : th < 1e-12 ? ax : add(scl(ax, Math.cos(w * th)), scl(e, Math.sin(w * th)));
  const Mh = C.massOf(host), Rh = K.srcRadius(host, 0), Rr = G3.YK * md.m, wSun = K.spinRot(T1, GEO, host, 'Sun', { part: 'M', read: 'W', tSrc: 0, nPhase: 1 }).wS, wPar = Mh * D.Kball(1, md.a, Rh);
  const par = T.avgRot({ Ms: Mh, Rs: Rh, spin: scl(ax, Math.abs(r2.omega)), ob: null, m: md.m, Rr, extraW: wSun, pts: circPts(l, md.a, Mh, 'S') });
  const sun = T.avgRot({ Ms: Q.Ms, Rs: K.srcRadius('Sun', 0), spin: scl(Q.sAx, Q.ws), ob: null, m: md.m, Rr, extraW: wPar, pts: helioPts(Q, 'S') });
  const out = { loc: add(sun, par), l, w }; if (cache) cache[ck] = out; return out;
}
/** 表 4b: 衛星の道の面 w ごとの 14 の受け手の順位(惑星は第353便t の既定 —— 規則の半径) */
export function moonPlaneRows(T1 = E.t1Table(), GEO = E.geometry(), { axis = 'L' } = {}, cache = {}) {
  const b = unit(RA.refAxis(axis, T1, GEO));
  return DECL.moonW.map((w) => {
    const rows = DECL.recvs.map((k) => { const l = DECL.planets.includes(k) ? T.localT(T1, GEO, k, {}, cache).loc : moonLocalW(T1, GEO, k, w, cache).loc, ph = angDeg(scl(l, -1), b); return { key: k, phiDeg: ph, own: 2 * Math.sin(ph * D2R / 2) }; })
      .sort((p, q) => p.own - q.own);
    const v = rows.findIndex((r) => r.key === 'Venus'), mo = rows.filter((r) => DECL.moons.includes(r.key));
    return { w, venusRank: v + 1, venusOwn: rows[v].own, first: rows[0].key, firstOwn: rows[0].own, bestMoon: mo[0].key, bestMoonOwn: mo[0].own, margin: (v === 0 ? rows[1].own : rows[0].own) / rows[v].own };
  });
}

/* ───────── 表(器が呼ぶ)───────── */
/** 表 1: 8 惑星の法線の並び(基準軸ごと) */
export function table1(T1 = E.t1Table(), GEO = E.geometry(), { axis = 'L' } = {}) { const F = frame(T1, GEO, { axis }); return DECL.planets.map((id) => arcPos(id, { F })); }
/** 表 1b: 1/3 の由来の照合(重み・弧の上の厳密な点・平均の数と閉じた形)—— 基準軸 3 */
export function table1b(T1 = E.t1Table(), GEO = E.geometry()) {
  return DECL.axes.map((axis) => { const F = frame(T1, GEO, { axis }), x = nStarExact(F.b, F.s), oa = orbitAvg(F.s, F.normals.Venus);
    return { axis, arcDeg: angDeg(F.b, F.s), fracExact: x.frac, phiAtExact: x.phiDeg, chordToExact: angDeg(nStar(F.b, F.s), x.n), wRatio: DECL.weights.spin / DECL.weights.normal, slope: DECL.weights.normal / (DECL.weights.normal - DECL.weights.spin), avgRel: oa.rel, avgToSDir: oa.toSDir }; });
}

/* ───────── 零試験・変異 ───────── */
export function pureScenes(T1 = E.t1Table(), GEO = E.geometry()) {
  const cache = {}, rel = (a, b) => Math.abs(a / b - 1), F = frame(T1, GEO);
  // ① 第353便t の表 2a と同じ(n★ からの角・閉じた形の φ —— 相対 1e-9)・金星 0.508・土星 1.66・金星の φ 0.7606
  const t2a = T.table2a(T1, GEO, {}), rows = DECL.planets.map((id) => { const a = arcPos(id, { F }), q = t2a.find((r) => r.id === id); return { id, dN: rel(a.toNstarDeg, q.toNstar), dP: rel(a.phiDeg, q.phiClosed), toN: a.toNstarDeg }; });
  const v = arcPos('Venus', { F }), sa = arcPos('Saturn', { F });
  // ② 閉じた形と第353便t の dirMatch(数えた φ)の差(8 惑星 —— °)
  const dNum = Math.max(...DECL.planets.map((id) => Math.abs(phiOf(F.s, F.normals[id], F.b).phiDeg - T.dirMatch(id, { T1, GEO }, cache).phiDeg)));
  // ③ 1/3 の由来: 平均の数 = 閉じた形の重み(相対 1e-9)・その向き = 第352便h の sDirClosed・弧の上の厳密な点の割合が 1/3 の近く
  const oa = orbitAvg(F.s, F.normals.Venus), ex = nStarExact(F.b, F.s);
  // ④ phiAt(0, 0) = いまの φ・相対の位相の同値・incDeg をいまの角に置くと同じ
  const p0 = rel(phiAt('Venus', { F }).phiDeg, v.phiDeg), rs = relSame(T1, GEO), pi = rel(phiAt('Venus', { F, incDeg: v.nToB }).phiDeg, v.phiDeg);
  // ⑤ 太陽の円錐の半頂角(5.968°)は位相で変わらない・円錐の周期(u 0.98 —— 2.24 億年)
  const cone = [0, 90, 200].map((p) => phiAt('Venus', { F, sunPhaseDeg: p }).sunToB), Ps = sunPeriodYr();
  // ⑥ 一律の c_R での rankPer = 第353便t の rankAll(14 の受け手の順位と own)・衛星の道 w 0・1 = 第353便t の 'eq'・'orb'(ベクトル 相対 1e-9)
  const ra = T.rankAll(T1, GEO, { cR: 0.0128 }, cache), rp = rankPer(T1, GEO, Object.fromEntries(DECL.recvs.map((k) => [k, 0.0128])), {}, cache);
  const dRank = ra.every((r, i) => r.key === rp[i].key && rel(r.own, rp[i].own) < 1e-9);
  const relv = (a, b) => nrm(sub(a, b)) / nrm(b), dW = Math.max(...['Europa', 'Titan', 'Moon', 'Io'].map((k) => Math.max(relv(moonLocalW(T1, GEO, k, 0, cache).loc, T.localT(T1, GEO, k, { moonAx: 'eq' }, cache).loc), relv(moonLocalW(T1, GEO, k, 1, cache).loc, T.localT(T1, GEO, k, { moonAx: 'orb' }, cache).loc))));
  // ⑦ c_R★: イオの二分 = 閉じた形(相対 1e-3 —— 第353便v の表 8 の型)・ほかの衛星は閉じた形
  const st = cRStarAll(T1, GEO, cache), dStarIo = rel(st.Io.cR, st.Io.closed);
  // ⑧ 変異: 重みを 3/2・1/2 から 1・1 にすると 1/3 の所で φ が 0 にならない・n★ を 1/2 の所に置くと金星の n★ からの角が動く
  const altW = sub(scl(F.normals.Venus, dot(F.s, F.normals.Venus)), F.s), mW = Math.abs(angDeg(scl(altW, -1), F.b) - v.phiDeg) > 0.1, mHalf = Math.abs(angDeg(F.normals.Venus, nStar(F.b, F.s, { frac: 0.5 })) - v.toNstarDeg) > 0.1;
  const rej = [() => arcPos('Io'), () => phiAt('Pluto'), () => frame(T1, GEO, { axis: 'La' }), () => nStar([0, 0, 1], [1, 0, 0], { frac: 2 }), () => relPeriodYr(0, 1), () => relPeriodYr(1e6, 0), () => moonLocalW(T1, GEO, 'Venus', 0), () => moonLocalW(T1, GEO, 'Io', 1.5), () => phiAt('Venus', { incDeg: 95 })]
    .map((fn) => { try { fn(); return false; } catch (er) { return er instanceof RangeError; } });
  return { rows, venusToN: v.toNstarDeg, saturnToN: sa.toNstarDeg, venusPhi: v.phiDeg, venusT: v.t, dNum, avgRel: oa.rel, avgToSDir: oa.toSDir, fracExact: ex.frac, p0, rs, pi, cone, Ps, dRank, dW, dStarIo, mW, mHalf, rejects: rej };
}
const p3 = (x, w) => Number(Number(x).toPrecision(3)).toExponential(2) === Number(w).toExponential(2);
export function pureGates(S) {
  const A = DECL.anchor;
  return {
    anchorT: S.rows.every((r) => r.dN < 1e-9 && r.dP < 1e-9) && S.venusToN.toFixed(3) === A.venusToNstar && S.saturnToN.toFixed(2) === A.saturnToNstar && Math.abs(S.venusPhi - A.venusPhi) < 5e-5,
    closedNum: S.dNum < 1e-5,
    third: S.avgRel < 1e-9 && S.avgToSDir < 1e-6 && Math.abs(S.fracExact - 1 / 3) < 0.01,
    phiAt: S.p0 < 1e-12 && S.rs < 1e-9 && S.pi < 1e-9,
    cone: S.cone.every((c) => c.toFixed(3) === A.sunCone) && p3(S.Ps, A.sunPeriodYr),
    rankPer: S.dRank && S.dW < 1e-9,
    cRStar: S.dStarIo < 1e-3,
    mutants: S.mW && S.mHalf && S.rejects.length === 9 && S.rejects.every(Boolean),
  };
}
