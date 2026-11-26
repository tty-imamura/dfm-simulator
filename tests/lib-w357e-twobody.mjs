// 第357便e(原仮定者の指示 2026-11-21「論文3: 主にgeoPN=3を使用。「もしも宇宙に天体が２つだけだったら」の思考実験で始まる。…」・統括の検証項目 R526):
//   **天体が 2 つだけの宇宙の本 👥 twoBodyOnly3d の lib**(器 tests/exp-w357e-twobody.mjs が使う —— 純関数と門の宣言だけ・html を読まない・状態を持たない・エンジンの式を写さない)。
//
// ■ 何を見るか(門の宣言 DECL —— 走行の前に置く・結果を見て変えない。新しく置く幅は「候補」)
//   ① 数え上げ(count): 天体の数・試験粒子・固定の天体・背景の宣言の鍵・D0 = 0・警告 0。宣言の D0・q を差し替えた写しと 1 公転のビットが同じ(kFrame 0 で背景の鍵が走行に効かない)。
//   ② 共通の並進(trans): 2 つの天体に同じ速度 V を足した写しと本の、1 公転の後の相対の位置と相対の速さの差 ≤ transTol(候補 1e-10)。
//   ③ 互いの決定(beta): 步ごとの引きずりの速度 u_i(エンジンの S._rdUX/Y/Z —— 読むだけ)と相手との相対の速さの比 β_i = |u_i|/|V_j − V_i|・局所重力のポテンシャル ψ_i(S._glPsi —— 読むだけ)の
//      1 公転の平均の比 β_0/β_1・ψ_0/ψ_1 が質量の比 m_1/m_0 と相対 betaTol(候補 1e-4)の内・引きずりの運動量の和 Σ m_i u_i ÷ (m_0 |u_0|) ≤ momTol(候補 1e-4)。
//   ④ 質量比の列(ratio —— 入口の表): ♊ の宣言の質量だけを変えた写し(M = 1・a = 100・e = 0.5・遠点整列・重心系は同じ)で、OFF を差し引いた近点の移動の比
//      (この本 − OFF)/(geo1 − OFF) を刻み h・h/4・8 公転で q = 1・1/3・1/10・1/100 に並べる。q = 1・1/3 は正本 tests/out/binbooks-w322b.json の h・h/4 の比とビットで同じ(写しの作りの照合)。
//      本の行(q = 1/10・h/4)の比 ÷ (1 + (4/3)η) が 1 から ratioTol(5e-3 —— binbooks の tRatio と同じ幅)の内・geo1 − OFF ÷ q_1PN が 1 から pn1Tol(2e-3 —— tPn1 と同じ)の内。
//      本そのもの(👥)の走行の近点の率が、q = 1/10 の写しの列 self とビットで同じ(本 = ♊ の質量を 1:10 にした写し —— D0 の差は走行に効かない)。
//   ⑤ 走り直し(rerun): 本を 2 回組んで 1 公転 —— 位置・速度・自転のビットと t が同じ。
//
// ■ 言わないこと: 2 体の系で慣性と重力の解釈が定まったとは言わない。ジャイロトルクの採否に触れない。現実の連星の主張ではない(本の単位の玩具)。
//   刻み h の比を収束の値と呼ばない(本の文の比は h/4)。(1 + (4/3)η) は既知の寄与の表示で、補正の係数ではない。並進は門で見た 2 つの量(相対の位置・相対の速さ)だけを言う。
export const LIB_VERSION = 'w357e-twobody-lib-2';
const clone = (x) => JSON.parse(JSON.stringify(x));

export const BOOK_ID = 'twoBodyOnly3d';
export const BOOKS = Object.freeze([
  Object.freeze({ id: 'twoBodyOnly3d', emoji: '👥', ja: '天体が 2 つだけの宇宙(質量比 1:10)' }),
  Object.freeze({ id: 'binaryCheckEqualInertial3d', emoji: '♊', ja: '連星の検証サンプル(等質量)' }),
  Object.freeze({ id: 'binaryCheckRatio3Inertial3d', emoji: '⚖️', ja: '連星の検証サンプル(質量比 1:3)' })]);
/** 比べる本(群「運動と時空」の 2 体の原理の本 —— geoPN=0・kFrame=1・D0pull の背景つき —— 数え上げだけ) */
export const COMPARE = Object.freeze([Object.freeze({ id: 'boxBinaryToy', emoji: '🫂', ja: '箱宇宙と連星' })]);

export const DECL = Object.freeze({
  inertSteps: 360,                         // ① 宣言の D0・q を差し替えた写しのビットの照合の步数(1 公転)
  inertPatch: Object.freeze({ D0: 0.006, q: 2 }),
  transV: Object.freeze([0.01, 0.1]),      // ② 足す共通の速度(x 向き —— 相対の速さ 0.0577 の約 0.17 倍と 1.7 倍)
  transSteps: 360,
  transTol: 1e-10,                         // ② 候補(新しい幅 —— 実測は 1e-14 の桁)
  betaSteps: 360,                          // ③ 1 公転の步ごとの β の平均
  betaTol: 1e-4, momTol: 1e-4,             // ③ 候補(新しい幅 —— 実測は 1e-6 の桁)
  ratios: Object.freeze([1, 1 / 3, 1 / 10, 1 / 100]),   // ④ 軽い方 / 重い方
  bookRatio: 1 / 10,
  N: 8, K: 3,                              // ④ 8 公転・離心ベクトルの回帰の K(正本 binbooks と同じ)
  divs: Object.freeze([1, 4]),             // ④ 刻み h と h/4(本の文の比は h/4)
  ratioTol: 5e-3, pn1Tol: 2e-3,            // ④ binbooks の tRatio・tPn1 と同じ幅
  rerunSteps: 360,
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
  const dS = rs.self - rs.off, dG = rs.g1 - rs.off, f = 1 + 4 * eta / 3;
  const q1 = 6 * Math.PI * DECL.M / (900 * DECL.a * (1 - DECL.e * DECL.e));   // q_1PN(G = 1・c₀ = 30)
  return { q, eta: fx(eta, 6), f: fx(f, 6), shiftSelfMinusOff: fx(dS), shiftG1MinusOff: fx(dG), ratio: fx(dS / dG, 6), ratioOverF: fx(dS / dG / f, 6), g1OverQ1: fx(dG / q1, 6), ratioFull: dS / dG };
}

/** 門(正本 J か器の measure M から) */
export function gatesFrom(J) {
  const D = DECL, G = {};
  const c = (J.count || []).find((r) => r.id === BOOK_ID), t = (J.trans || []).find((r) => r.id === BOOK_ID), b = (J.beta || []).find((r) => r.id === BOOK_ID);
  G.count = !!(c && c.n === 2 && c.tp === 0 && c.declTest === 0 && c.declPinned === 0 && c.bgKeys.length === 0 && c.D0 === 0 && c.geoPN === 3 && c.kFrame === 0 && c.warnings === 0 && c.inert && c.inert.same === true);
  G.trans = !!(t && t.rows.length === D.transV.length && t.rows.every((r) => r.dRelPos <= D.transTol && r.dRelVel <= D.transTol));
  G.beta = !!(b && Math.abs(b.betaRatio01 / b.massRatio10 - 1) <= D.betaTol && Math.abs(b.psiRatio01 / b.massRatio10 - 1) <= D.betaTol && b.momSumRelMax <= D.momTol && b.steps === D.betaSteps);
  const R = J.ratio || { rows: [] }, br = R.rows.find((r) => r.q === D.bookRatio && r.div === 4);
  G.ratio = !!(R.rows.length === D.ratios.length * D.divs.length && R.rows.every((r) => Object.values(r.raw).every((z) => z.status === 'run' && z.complete && !z.nan))
    && br && Math.abs(br.ratioOverF - 1) <= D.ratioTol && R.rows.filter((r) => r.div === 4).every((r) => Math.abs(r.g1OverQ1 - 1) <= D.pn1Tol));
  G.canon = !!(Array.isArray(J.canon) && J.canon.length === 2 && J.canon.every((z) => z.relDiffH === 0 && z.relDiffH4 === 0));
  G.bookSame = !!(J.bookRun && J.bookRun.length === D.divs.length && J.bookRun.every((z) => z.sameAsCopy === true));
  G.rerun = !!(J.rerun && J.rerun.same === true);
  G.selfTest = !!(J.selfTest && J.selfTest.ok === true);
  return G;
}

/** 自己試験(門の検出力 —— 正本の形の小さな写しを壊して門が落ちること) */
export function selfTest(J0) {
  const bad = [];
  let cases = 0;
  const base = J0 || null;
  if (!base) return { ok: true, cases: 0, bad: [], note: '正本の形が無い(器の measure の後に呼ぶ)' };
  const okBase = gatesFrom(Object.assign(clone(base), { selfTest: { ok: true } }));
  if (!Object.values(okBase).every(Boolean)) return { ok: false, cases: 0, bad: ['元の門が真でない: ' + Object.entries(okBase).filter(([, v]) => !v).map(([k]) => k).join(',')] };
  const MUT = [
    ['count', (J) => { J.count.find((r) => r.id === BOOK_ID).tp = 1; }],
    ['count', (J) => { J.count.find((r) => r.id === BOOK_ID).D0 = 0.006; }],
    ['count', (J) => { J.count.find((r) => r.id === BOOK_ID).bgKeys = ['D0pull']; }],
    ['count', (J) => { J.count.find((r) => r.id === BOOK_ID).inert.same = false; }],
    ['trans', (J) => { J.trans.find((r) => r.id === BOOK_ID).rows[0].dRelPos = 2e-10; }],
    ['trans', (J) => { J.trans.find((r) => r.id === BOOK_ID).rows[1].dRelVel = 2e-10; }],
    ['beta', (J) => { const b = J.beta.find((r) => r.id === BOOK_ID); b.betaRatio01 = b.massRatio10 * (1 + 2e-4); }],
    ['beta', (J) => { const b = J.beta.find((r) => r.id === BOOK_ID); b.psiRatio01 = b.massRatio10 * (1 - 2e-4); }],
    ['beta', (J) => { J.beta.find((r) => r.id === BOOK_ID).momSumRelMax = 2e-4; }],
    ['ratio', (J) => { J.ratio.rows.find((r) => r.q === DECL.bookRatio && r.div === 4).ratioOverF = 1.006; }],
    ['ratio', (J) => { J.ratio.rows.find((r) => r.q === 1 && r.div === 4).g1OverQ1 = 1.003; }],
    ['ratio', (J) => { J.ratio.rows[0].raw.self.complete = false; }],
    ['canon', (J) => { J.canon[1].relDiffH4 = 1e-12; }],
    ['bookSame', (J) => { J.bookRun[0].sameAsCopy = false; }],
    ['rerun', (J) => { J.rerun.same = false; }],
  ];
  for (const [g, f] of MUT) {
    const J = Object.assign(clone(base), { selfTest: { ok: true } }); f(J); cases++;
    if (gatesFrom(J)[g] !== false) bad.push('変異が門 ' + g + ' で落ちない(' + cases + ')');
  }
  // 純関数: 1:1 と 1:3 の状態は ♊・⚖️ の宣言の数(位置 ±75・−112.5/37.5)
  const s1 = twoBodyState(1), s3 = twoBodyState(1 / 3); cases++;
  if (!(s1.x[0] === -75 && s1.x[1] === 75 && s3.x[0] === -112.5 && s3.x[1] === 37.5 && s3.m[0] === 0.25 && s3.m[1] === 0.75)) bad.push('twoBodyState の 1:1・1:3 が ♊・⚖️ の宣言と違う');
  return { ok: bad.length === 0, cases, bad };
}

export const NOT_CLAIM = Object.freeze(['2 体の系で慣性と重力の解釈が定まったとは言わない(思考実験の入口の本)', 'ジャイロトルクの採否に触れない',
  '現実の連星の主張ではない(本の単位の玩具)', '刻み h の比を収束の値と呼ばない(本の文の比は h/4)', '(1 + (4/3)η) は表示だけ —— 補正の係数ではない',
  '共通の並進は、門で見た 2 つの量(相対の位置・相対の速さ)に出ないことだけを言う']);
