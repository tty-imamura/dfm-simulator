// 第357便e(原仮定者の指示 2026-11-21「もしも宇宙に天体が２つだけだったら」・統括の検証項目 R526 —— 第 1 段): **論文 3 の入口の下見の lib**
//   (器 tests/exp-w357e-twobody.mjs が使う —— 純関数と宣言だけ・html を読まない・状態を持たない・エンジンの式を写さない)。
//
// ■ 何を見るか(第 1 段の表の材料 —— 「今の連星の検証の本 ♊⚖️ で入口として足りるか」)
//   ① 数え上げ: 天体の数・試験粒子・固定の天体・源の印・宣言の背景(D0・kFrame・背景の宣言の鍵)と、宣言の D0・q が走行に効かないこと(差し替えた写しのビット)。
//   ② 共通の並進: 2 つの天体に同じ速度 V を足した写しと元の本の、相対の位置・相対の速さの差(内部から並進が読めるか)。
//   ③ 互いの決定: 步ごとの引きずりの速度 u_i(エンジンの S._rdUX/Y/Z —— 読むだけ)と、相手との相対の速さの比 β_i = |u_i|/|V_j − V_i|・
//      局所重力のポテンシャル ψ_i(S._glPsi —— 読むだけ)。比 β_0/β_1・ψ_0/ψ_1 と質量の比 m_1/m_0、引きずりの運動量の和 Σ m_i u_i。
//   ④ 質量比の列(下見): ♊ の宣言の質量だけを変えた写し(M = 1・a = 100・e = 0.5・遠点整列・重心系は同じ)で、OFF を差し引いた近点の移動の比
//      (この本 − OFF)/(geo1 − OFF) を刻み h・h/4・8 公転で並べる。q = 1・1/3 は正本 tests/out/binbooks-w322b.json の刻み h・h/4 の値と同じ数になることで写しの作りを確かめる。
//
// ■ 言わないこと: 2 体の系で慣性と重力の解釈が定まったとは言わない。ジャイロトルクの採否に触れない。現実の連星の主張ではない(本の単位の玩具)。
//   刻み h の比を収束の値と呼ばない(正本の h/4 の値が本の文の数)。(1 + (4/3)η) は既知の寄与の表示で、補正の係数ではない。
export const LIB_VERSION = 'w357e-twobody-lib-1';
const clone = (x) => JSON.parse(JSON.stringify(x));

export const BOOKS = Object.freeze([
  Object.freeze({ id: 'binaryCheckEqualInertial3d', emoji: '♊', ja: '連星の検証サンプル(等質量)' }),
  Object.freeze({ id: 'binaryCheckRatio3Inertial3d', emoji: '⚖️', ja: '連星の検証サンプル(質量比 1:3)' })]);
/** 比べる本(群「運動と時空」の 2 体の原理の本 —— geoPN=0・kFrame=1・D0pull の背景つき) */
export const COMPARE = Object.freeze([Object.freeze({ id: 'boxBinaryToy', emoji: '🫂', ja: '箱宇宙と連星' })]);

export const DECL = Object.freeze({
  inertSteps: 360,                         // ① 宣言の D0・q を差し替えた写しのビットの照合の步数(1 公転)
  inertPatch: Object.freeze({ D0: 0, q: 2 }),
  transV: Object.freeze([0.01, 0.1]),      // ② 足す共通の速度(x 向き —— 相対の速さ 0.0577 の約 0.17 倍と 1.7 倍)
  transSteps: 360,
  betaSteps: 360,                          // ③ 1 公転の步ごとの β の平均
  ratios: Object.freeze([1, 1 / 3, 1 / 10, 1 / 100]),   // ④ 軽い方 / 重い方
  N: 8, K: 3,                              // ④ 8 公転・離心ベクトルの回帰の K(正本と同じ)
  divs: Object.freeze([1, 4]),             // ④ 刻み h と h/4(正本の本の文の数は h/4)
  M: 1, a: 100, e: 0.5,
});

/** 質量の比 q(軽い方 / 重い方)の 2 体の初期状態(M・a・e は ♊⚖️ と同じ —— 遠点整列・重心系・0 番が軽い方で −x 側) */
export function twoBodyState(q, G = 1, o = DECL) {
  const m0 = o.M * q / (1 + q), m1 = o.M - m0, rA = o.a * (1 + o.e), vA = Math.sqrt(G * o.M * (1 - o.e) / (o.a * (1 + o.e)));
  return { m: [m0, m1], x: [-m1 / o.M * rA, m0 / o.M * rA], vy: [-m1 / o.M * vA, m0 / o.M * vA], eta: m0 * m1 / (o.M * o.M) };
}
/** 本(と写しの列)の single の 2 体の質量・位置・速度だけを q の状態に置き換える(他の宣言は 1 字も変えない) */
export function withRatio(book, q) {
  const c = clone(book), s = twoBodyState(q, c.physics.G);
  const bs = c.bodies.filter((b) => b.type === 'single');
  if (bs.length !== 2) throw new Error('2 体の本でない: ' + book.id);
  bs.forEach((b, i) => { b.m = s.m[i]; b.x = s.x[i]; b.y = 0; b.vx = 0; b.vy = s.vy[i]; if ('z' in b) { b.z = 0; b.vz = 0; } });
  c.id = book.id + '__w357e-q' + q.toPrecision(4);
  return c;
}
/** 共通の速度 V を足した写し(x 向き) */
export function withBulk(book, V) {
  const c = clone(book);
  for (const b of c.bodies) { if (b.type === 'single') b.vx = (b.vx || 0) + V; else b.bulkVx = (b.bulkVx || 0) + V; }
  c.id = book.id + '__w357e-bulk' + V;
  return c;
}
export const relDiff = (a, b) => (a === b) ? 0 : Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b));
export function fx(x, d = 5) { return (x === null || !Number.isFinite(x)) ? x : Number(x.toPrecision(d)); }

/** ④ の表の行(器の走行の結果 rate を受けて比を作る) */
export function ratioRow(q, eta, rs) {
  const self = rs.self, off = rs.off, g1 = rs.g1;
  const dS = self - off, dG = g1 - off, f = 1 + 4 * eta / 3;
  return { q, eta: fx(eta, 6), f: fx(f, 6), shiftSelfMinusOff: fx(dS), shiftG1MinusOff: fx(dG), ratio: fx(dS / dG, 6), ratioOverF: fx(dS / dG / f, 6), ratioFull: dS / dG };
}

export const NOT_CLAIM = Object.freeze(['2 体の系で慣性と重力の解釈が定まったとは言わない(入口の表の下見)', 'ジャイロトルクの採否に触れない',
  '現実の連星の主張ではない(本の単位の玩具)', '刻み h の比を収束の値と呼ばない(本の文の数は正本の h/4)', '(1 + (4/3)η) は表示だけ —— 補正の係数ではない']);
