// 第351便k(原仮定者の整理(2026-11-23 —— 第146報)・原仮定者の回答(2026-11-24 —— 第147報)・統括の検証項目 R437):
//   **係数の当てはめの診断 —— 換算の係数 k・構造の係数 c_R(入り方 (i) 腕だけ・(ii) 自分の重みの球の半径も)・経路の比率 f(置き方 (N1)(N2))・背景の倍率 u・源の成分の採り方((M)(S)(MS))の
//   どのノブが、どの観測量(歳差の率・傾きの変化の率・合成の向きと自転軸のなす角 δ・自転の率の変化・熱の率の式の形)で分けられるか —— 対数の感度の行列と階数・分けられる組と分けられない組・
//   当てはめの段 (全)(組)(個) の「要る値」の並び・構造の組の順位の相関 —— の純関数。診断だけ(当てはめた値を結果として出すものではない)**
//   (器 tests/exp-w351k-knobrank.mjs と QA behavior.knobrank351k・docs.knobrank351k が読む —— html を読まない・ファイルを読まない・状態を持たない)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない(AN712 —— エンジンへ足す操作ではない)。
//   既存の lib は呼ぶだけ(本文は変えない): 第351便c(partRot・pairInput・PARENT_ROWS・bgOm・raiseRate・perpOf・galWeight)・第351便d(r3Coeffs・r3Rate)・第351便b(equivR2・c2BallPair)・
//   第350便f(solveOne・solveJoint・cGrid・precObs・groupOf・ruleRatio・DECL.groups・DECL.fitRole)・第350便e(commonChecks・COMMON_WANT)・第348便h(makeField3・rot3・YK)・
//   第348便c(massOf・radiusOf・precess)・第347便h(gaussLegendre)・第347便e(t1Table・geometry)・第312便a(Kball)・第337便c(YR)。
//
// ■ 原文: 原仮定者の整理(2026-11-23 —— 第146報)「天体の構造別に軸引きずりの利き方に差異が予想され、観測半径に対する引きずられ半径の係数がノブの候補。構造別の参考値を用意しつつ、
//   天体の構造を分析する為に、個別にフィットする」・原仮定者の回答(2026-11-24 —— 第147報)「AN1000: C2で進める。係数はノブにする」「…比率は天体の構造などに起因するので、ノブにする」。
// ■ 場と読み(共通): 在位の geoPN=3 の場(第348便h の makeField3 の既定)・主の読み (C2)(球の半径の平均 —— 第351便c の partRot と同じ求積)・局所の分母は自分 + 太陽 + 母天体(第351便c の den 'out')。
//   Ω = Ω_bg(u) + k × Σ 局所の項(c_R)。Ω_bg = 第351便c の bgOm(銀河の公転の角速度 × u・向き −1)。経路は第351便d の r3Rate(① 寄る k₁・② 歳差 k₂)。
// ■ 構造の係数の入り方(第350便f・第351便b と同じ語): (ii) 受け手の自分の重みの球の半径と平均の球の半径を c_R R_obs に(Rd = a = c_R R_obs)/(i) 自分の重みの球は規則の半径 Y_k m のまま・
//   平均の球の半径 a だけを q Y_k m に(第351便b の c2BallPair の (i) と同じ置き方)。q = 1 は規則の半径(第351便c の partRot と同じビット —— 門で照合)。
// ■ 観測量(本便の語): 歳差の率 = k₂ abs(Ω)(第348便c の precess と同じ —— δ ≠ 0)/傾きの変化の率 = 起こす率(公転の北極を基準 —— 第351便c の raiseRate に経路 ① の dŝ/dt = k₁ Ω⊥)/
//   δ = ŝ と Ω のなす角/自転の率の変化 = 平行成分 Ω∥ = ŝ·Ω(引きずり回転)/熱の率の式の形 = I abs(ω) abs(Ω⊥)²(第350便f の式の形 —— 帳簿の数は読まない)。
// ■ 言わないこと: 係数・比率・倍率の値を選ばない(当てはめの段は「要る値」を並べるだけ)。ノブを同時に当てはめない(片方を固定して振る)。比べる数は公開の lib に在る歳差の率(文献の値・未照合 —— 合わせない)。
import * as SP from './lib-w351c-srcparts.mjs';
import * as R3 from './lib-w351d-r3step.mjs';
import * as CB from './lib-w351b-c2main.mjs';
import * as SF from './lib-w350f-structfit.mjs';
import * as BG from './lib-w350e-bgaxial.mjs';
import * as G3 from './lib-w348h-axisgeo3.mjs';
import * as C from './lib-w348c-axisbalance.mjs';
import * as H from './lib-w347h-axisdiff.mjs';
import * as E from './lib-w347e-spintorque.mjs';
import * as D from './lib-w312a-decay.mjs';
import * as TL from './lib-w337c-tidelock.mjs';

export const LIB_VERSION = 'w351k-knobrank-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const YR = TL.YR, AS = 180 * 3600 / Math.PI, D2R = Math.PI / 180;

/* ───────── 宣言 ───────── */
export const DECL = Object.freeze({
  knobs: Object.freeze(['k', 'cRii', 'cRi', 'f', 'u']),
  knobNames: Object.freeze({ k: '換算の係数 k', cRii: '構造の係数 c_R の入り方 (ii)', cRi: '構造の係数 c_R の入り方 (i)', f: '経路の比率 f', u: '背景の倍率 u' }),
  obs: Object.freeze(['prec', 'raise', 'delta', 'spin', 'heat']),
  obsNames: Object.freeze({ prec: '歳差の率', raise: '傾きの変化の率(起こす率)', delta: 'δ(合成の向きと自転軸)', spin: '自転の率の変化(平行成分)', heat: '熱の率の式の形' }),
  parts: Object.freeze(['M', 'S', 'MS']), fitParts: Object.freeze(['MS', 'S']),
  /** 感度の表の天体(地球・火星・金星 —— 太陽由来) */
  bodies3: Object.freeze([['Earth', 'Sun'], ['Mars', 'Sun'], ['Venus', 'Sun']].map((x) => Object.freeze(x))),
  /** 感度の基準の点(どれも既定の値ではない —— 微分を取る点): k 1・q 1(規則の半径)・f 0.5(N1)・u 0 と 1 */
  base: Object.freeze({ k: 1, q: 1, f: 0.5, norm: 'N1', us: Object.freeze([0, 1]) }),
  norms: Object.freeze(['N1', 'N2']),
  /** 対数の差分の刻み(中心の差分 —— (i) は q = 1 で折れるので上と下の片側を別に) */
  lnStep: 1e-3,
  /** 観測量 1 つの行の感度の床(これより小さい行は、その量では何も決まらない) */
  sensFloor: 1e-9,
  /** 階数の物差し(特異値 ÷ 最大) */
  rankTol: Object.freeze([1e-3, 1e-6]),
  /** T2 の格子 */
  kTest: Object.freeze([0.5, 1, 2]), qTest: Object.freeze([0.4, 1, 10, 100]), fTest: Object.freeze([0.25, 0.5, 0.75]),
  uk: Object.freeze([[1, 0.5], [1, 1], [1, 2], [0.5, 1], [2, 1], [2, 2]].map((x) => Object.freeze(x))),
  qMoon: Object.freeze([0.4, 1, 10, 100, 1e4, 1e6]),
  /** T3 当てはめの段: 比べる数の在る天体(水星は役割が「桁」—— (全)(組)に入れない)・月は外す列が主(比べる数が軌道の交点の率) */
  fitBodies: Object.freeze([['Mercury', 'Sun'], ['Venus', 'Sun'], ['Earth', 'Sun'], ['Mars', 'Sun']].map((x) => Object.freeze(x))),
  moonRow: Object.freeze(['Moon', 'EarthHi']), moonCols: Object.freeze(['out', 'in']), moonMain: 'out',
  fitKnobs: Object.freeze(['k', 'cRii']), fitUs: Object.freeze([0, 1]),
  kGrid: Object.freeze({ lo: -3, hi: 20, step: 0.25 }), nB: 40, nG: 48,
  fitRole: SF.DECL.fitRole,
  /** T4 構造の組の順位の相関(天体の性質: 平均の密度・観測半径・自転の率) */
  props: Object.freeze(['density', 'radius', 'spin']),
  common: Object.freeze({ p2x: -0.03061311, p6: -0.01530656, w: -0.01530612, tol: 5e-9 }),
  /** 統括の数え直しの数(第351便b・c の共通の点検の数 —— 地球 (MS) の大きさ (W)・(C2) と、背景だけの起こす率) */
  anchor: Object.freeze({ msWAsYr: 5.0576e-2, msC2AsYr: 0.066930, bgRaiseAsYr: 1.1720e-3, tolW: 5e-6, tolC2: 5e-7, tolBg: 5e-8 }),
  judge: '丸めの桁の床: 打ち消しで 0 になる量は尺度の 1e-12 倍以下を 0 と書く',
});
export const LIT = Object.freeze({ note: '文献の値・未照合(この環境から一次資料に当たっていない)', precArcsecPerYr: SF.LIT.precArcsecPerYr, precRole: SF.LIT.precRole, precSrc: SF.LIT.precSrc });

/* ───────── 小さな道具 ───────── */
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const scl = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const unit = (a) => { const m = nrm(a); return m > 0 ? scl(a, 1 / m) : [0, 0, 0]; };
const isVec = (a) => Array.isArray(a) && a.length === 3 && a.every(fin);
const rel = (a, b) => nrm(sub(a, b)) / Math.max(nrm(b), 1e-300);
const angDeg = (a, b) => Math.atan2(nrm(crs(a, b)), dot(a, b)) / D2R;
const perpPair = (a) => { const t = Math.abs(a[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0], e2 = unit(crs(a, t)), e3 = crs(a, e2); return [e2, e3]; };
const GL = H.gaussLegendre(SP.DECL.ballN);
export const kGridVals = () => { const g = DECL.kGrid, out = []; for (let i = 0; g.lo + i * g.step <= g.hi + 1e-12; i++) out.push(Math.pow(10, g.lo + i * g.step)); return out; };

/* ───────── 足りない口: 受け手の半径を振った (C2) の成分(第351便c の partRot と同じ作り —— Rd・a を外から)───────── */
/**
 * 由来 1 つの成分の (C2)(球の半径の平均 —— 重み 5ρ⁴ ÷ a⁵・受け手の半径 = 第351便b の equivR2(Rd, ρ))。Rd = 自分の重みの球の半径・a = 平均の球の半径(既定 a = Rd)。
 * Rd = a = 規則の半径 Y_k m は第351便c の partRot(read 'C2')と同じ入力・同じ順の計算(門 partSame で照合)。
 */
export function partRotQ(T1, GEO, id, src, { part, Rd, a = Rd, extraW = 0 } = {}) {
  const sc = part === 'M' ? [1, 0] : part === 'S' ? [0, 1] : part === 'MS' ? [1, 1] : null;
  if (!sc) throw new RangeError('partRotQ: 成分は M・S・MS');
  if (!(fin(Rd) && Rd > 0 && fin(a) && a > 0 && fin(extraW) && extraW >= 0)) throw new RangeError('partRotQ: Rd > 0・a > 0・extraW ≥ 0');
  const P = SP.pairInput(T1, GEO, id, src), Rs = G3.YK * P.Ms;
  const x0 = crs(P.sAx, P.nHat), x = nrm(x0) > 1e-12 ? unit(x0) : perpPair(P.nHat)[0], y = crs(P.nHat, x);
  const radii = GL.x.map((xi, i) => { const rho = 0.5 * a * (xi + 1); return [CB.equivR2(Rd, rho), 0.5 * a * GL.w[i] * 5 * Math.pow(rho, 4) / Math.pow(a, 5)]; });
  const spin = scl(P.sAx, P.ws * sc[1]), nP = SP.DECL.nPhase;
  let Om = [0, 0, 0];
  for (const [Ri, wt] of radii) {
    let mW = [0, 0, 0];
    for (let j = 0; j < nP; j++) {
      const ph = 2 * Math.PI * (j + 0.5) / nP, rh = add(scl(x, Math.cos(ph)), scl(y, Math.sin(ph))), vh = crs(P.nHat, rh);
      const f = G3.makeField3({ sources: [{ m: P.Ms, R: Rs, p: scl(rh, -P.a), v: [0, 0, 0], spin }], recv: { m: P.m, R: Ri, p: [0, 0, 0], v: scl(vh, P.vOrb * sc[0]) },
        W0: 0, extraW, kernel: { kind: 'ball', al: 1 }, rot: { form: 'M' }, self: true, mut: null });
      mW = add(mW, scl(G3.rot3('W', f, [0, 0, 0], { Rb: Ri }), 1 / nP));
    }
    Om = add(Om, scl(mW, wt));
  }
  return Om;
}
const wAt = (T1, GEO, key) => { const [i, s] = key.split('|'), P = SP.pairInput(T1, GEO, i, s); return P.Ms * D.Kball(1, P.a, G3.YK * P.Ms); };
const ruleR = (id) => G3.YK * C.massOf(id);

/* ───────── 作り直しの道具(同じ走りの中だけの写し)───────── */
/**
 * 組の局所の項の和(太陽由来 + 母天体由来・k 1)を、成分 part・入り方 mode('rule'・'ii'・'i')・値 v で。mode 'ii' の v は c_R(引きずられ半径 ÷ 観測半径)・'i' の v は q(平均の球の半径 ÷ 規則の半径)。
 * den 'out'(局所の分母に銀河の重みを入れない)が主・'in' は第351便b の c2BallPair との照合の列。
 */
export function makeCtx(T1 = E.t1Table(), GEO = E.geometry()) {
  const memo = new Map();
  const local = (id, src, part, mode = 'rule', v = 1, den = 'out') => {
    const key = [id, src, part, mode, mode === 'rule' ? '' : v, den].join('|');
    let r = memo.get(key); if (r) return r;
    const pkey = id + '|' + src, sunKey = src === 'Sun' ? pkey : SP.PARENT_ROWS[pkey];
    if (!sunKey) throw new RangeError('makeCtx.local: 組 ' + pkey);
    const wSun = wAt(T1, GEO, sunKey), wPar = src === 'Sun' ? 0 : wAt(T1, GEO, pkey), gIn = den === 'in' ? SP.galWeight() : 0, Rr = ruleR(id);
    const rad = mode === 'rule' ? { Rd: Rr, a: Rr } : mode === 'ii' ? { Rd: v * C.radiusOf(id), a: v * C.radiusOf(id) } : mode === 'i' ? { Rd: Rr, a: v * Rr } : null;
    if (!rad || !(fin(v) && v > 0)) throw new RangeError('makeCtx.local: 入り方は rule・ii・i(値 > 0)');
    const [sid, ssrc] = sunKey.split('|');
    r = partRotQ(T1, GEO, sid, ssrc, { part, ...rad, extraW: wPar + gIn });
    if (src !== 'Sun') r = add(r, partRotQ(T1, GEO, id, src, { part, ...rad, extraW: wSun + gIn }));
    memo.set(key, r); return r;
  };
  const inp = (id, src) => { const P = SP.pairInput(T1, GEO, id, src), r2 = T1.find((r) => r.id === id && r.src === src && r.mag === 'm2'); return { sHat: P.sHat, nHat: P.nHat, I: r2.I, omega: Math.abs(r2.omega) }; };
  return { T1, GEO, local, inp, size: () => memo.size };
}

/* ───────── 観測量 ───────── */
/** Ω の合成: Ω_bg(u) + k × 局所の項 */
export const totalOm = (bg, loc, k) => add(bg, scl(loc, k));
export const bgOf = (id, u) => SP.bgOm(id, { mult: u, sign: -1 });
/**
 * 観測量 5 つ(歳差の率 ″/年・起こす率 ″/年・δ 度・自転の率の変化 ″/年・熱の率の式の形 W)。kTilt・kPrec は第351便d の r3Coeffs の値。
 */
export function obsOf({ sHat, nHat, I, omega }, Om, { kTilt, kPrec }) {
  if (!(isVec(sHat) && isVec(nHat) && isVec(Om) && fin(kTilt) && fin(kPrec))) throw new RangeError('obsOf: ŝ・n・Ω・k₁・k₂');
  const R = R3.r3Rate(sHat, Om, { kTilt, kPrec }), m = nrm(Om), pm = nrm(R.perp);
  const ra = SP.raiseRate(sHat, nHat, R.tilt);
  return { prec: kPrec * m * YR * AS, raise: ra === null ? null : ra * YR * AS, delta: m > 0 ? angDeg(unit(sHat), Om) : null, spin: R.par * YR * AS, heat: I * omega * pm * pm, perpAsYr: pm * YR * AS };
}

/* ───────── 特異値(小さな行列 —— MᵀM の Jacobi の固有値)───────── */
export function singularValues(M) {
  const n = M[0].length, A = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => M.reduce((s, r) => s + r[i] * r[j], 0)));
  for (let sweep = 0; sweep < 60; sweep++) {
    let off = 0; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) off += A[i][j] * A[i][j];
    if (off < 1e-30) break;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) {
      if (Math.abs(A[p][q]) < 1e-300) continue;
      const th = 0.5 * Math.atan2(2 * A[p][q], A[q][q] - A[p][p]), c = Math.cos(th), s = Math.sin(th);
      for (let k = 0; k < n; k++) { const akp = A[k][p], akq = A[k][q]; A[k][p] = c * akp - s * akq; A[k][q] = s * akp + c * akq; }
      for (let k = 0; k < n; k++) { const apk = A[p][k], aqk = A[q][k]; A[p][k] = c * apk - s * aqk; A[q][k] = s * apk + c * aqk; }
    }
  }
  return A.map((r, i) => Math.sqrt(Math.max(0, r[i]))).sort((x, y) => y - x);
}
export const rankOf = (sv, tol) => sv.filter((s) => s > tol * sv[0]).length;

/* ───────── T1 感度の表 ───────── */
/**
 * 1 天体・1 成分・1 基準(u)での対数の感度 ∂ ln abs(量) ÷ ∂ ln ノブ(中心の差分)。(i) は q = 1 で折れるので上側(q > 1)を行列に・下側を別の欄に。u 0 の基準では u の列を持たない(ln 0)。
 */
export function sensOf(X, id, src, part, u, { norm = DECL.base.norm, h = DECL.lnStep } = {}) {
  const P = X.inp(id, src), f0 = DECL.base.f, cR0 = SF.ruleRatio(id), bgU = (uu) => bgOf(id, uu);
  const co = (f) => R3.r3Coeffs(f, norm), O = (Om, f = f0) => obsOf(P, Om, co(f));
  const L0 = X.local(id, src, part), base = O(totalOm(bgU(u), L0, 1));
  const lnq = (o) => DECL.obs.map((k) => (o[k] === null ? null : Math.log(Math.abs(o[k]))));
  const dl = (oP, oM, step) => { const a = lnq(oP), b = lnq(oM); return a.map((x, i) => (x === null || b[i] === null ? null : (x - b[i]) / step)); };
  const eh = Math.exp(h), cols = {};
  cols.k = dl(O(totalOm(bgU(u), L0, eh)), O(totalOm(bgU(u), L0, 1 / eh)), 2 * h);
  cols.cRii = dl(O(totalOm(bgU(u), X.local(id, src, part, 'ii', cR0 * eh), 1)), O(totalOm(bgU(u), X.local(id, src, part, 'ii', cR0 / eh), 1)), 2 * h);
  const iUp = O(totalOm(bgU(u), X.local(id, src, part, 'i', eh), 1)), iDn = O(totalOm(bgU(u), X.local(id, src, part, 'i', 1 / eh), 1));
  cols.cRi = dl(iUp, base, h); const cRiDown = dl(base, iDn, h);
  cols.f = dl(O(totalOm(bgU(u), L0, 1), f0 * eh), O(totalOm(bgU(u), L0, 1), f0 / eh), 2 * h);
  const knobs = u > 0 ? DECL.knobs : DECL.knobs.filter((k) => k !== 'u');
  if (u > 0) cols.u = dl(O(totalOm(bgU(u * eh), L0, 1)), O(totalOm(bgU(u / eh), L0, 1)), 2 * h);
  const rowsOk = DECL.obs.map((_, i) => knobs.every((k) => cols[k][i] !== null));
  const M = DECL.obs.map((_, i) => knobs.map((k) => cols[k][i])).filter((_, i) => rowsOk[i]);
  // 観測量 1 つだけ: その行の感度が床(1e-9)より小さければ、どのノブも決まらない(ノブの数)・そうでなければノブの数 − 1
  const sv = singularValues(M), single = DECL.obs.map((_, i) => (rowsOk[i] ? knobs.length - (Math.max(...knobs.map((k) => Math.abs(cols[k][i]))) < DECL.sensFloor ? 0 : 1) : null));
  return { id, src, part, u, norm, knobs, base, cols, cRiDown, sv, svRel: sv.map((s) => s / sv[0]), rank: DECL.rankTol.map((t) => rankOf(sv, t)), undetermined: DECL.rankTol.map((t) => knobs.length - rankOf(sv, t)), singleUndetermined: single, nObs: M.length };
}
export function sensRows(X) {
  const out = [];
  for (const [id, src] of DECL.bodies3) for (const part of DECL.parts) for (const u of DECL.base.us) out.push(sensOf(X, id, src, part, u));
  return out;
}

/* ───────── T2 分けられる組・分けられない組 ───────── */
/** (あ) 傾きの変化の率 ÷ 歳差の率: k・c_R(ii)・f・u を振った広がりと、閉じた形 (k₁ ÷ k₂)(Ω⊥·n)÷(sin ε abs(Ω)) との差 */
export function ratioRows(X) {
  const out = [];
  for (const [id, src] of DECL.bodies3) for (const part of DECL.fitParts) for (const u of DECL.base.us) {
    const P = X.inp(id, src), cR0 = SF.ruleRatio(id), bg = bgOf(id, u), L0 = X.local(id, src, part);
    const R = (Om, f = DECL.base.f, norm = 'N1') => { const c = R3.r3Coeffs(f, norm), o = obsOf(P, Om, c); return { r: o.raise / o.prec, c, o, Om }; };
    const b = R(totalOm(bg, L0, 1));
    const geo = (Om) => { const s = unit(P.sHat), n = unit(P.nHat), perp = sub(Om, scl(s, dot(Om, s))), ce = dot(s, n), se = Math.sqrt(1 - ce * ce); return dot(perp, n) / (se * nrm(Om)); };
    const closed = Math.abs(b.r / ((b.c.kTilt / b.c.kPrec) * geo(b.Om)) - 1);
    const spread = (vals) => Math.max(...vals.map((v) => Math.abs(v / b.r - 1)));
    const kS = spread(DECL.kTest.map((k) => R(totalOm(bg, L0, k)).r)), qS = spread(DECL.qTest.map((q) => R(totalOm(bg, X.local(id, src, part, 'ii', q * cR0), 1)).r));
    const fN = (norm) => Math.max(...DECL.fTest.map((f) => Math.abs((R(totalOm(bg, L0, 1), f, norm).r / b.r) / ((f / (1 - f)) / (DECL.base.f / (1 - DECL.base.f))) - 1)));
    const uS = u > 0 ? spread([0.5, 2].map((uu) => R(totalOm(bgOf(id, uu), L0, 1)).r)) : null;
    out.push({ id, src, part, u, ratio: b.r, geo: geo(b.Om), closed, kSpread: kS, qSpread: qS, fN1: fN('N1'), fN2: fN('N2'), uSpread: uS });
  }
  return out;
}
/** (い) k と c_R(ii): 第351便b の c2BallPair との照合(den 'in'・(MS))と、由来どうしの比(月: 母天体由来 ÷ 太陽由来)の振れ */
export function kcrRows(X) {
  const out = [];
  for (const [id, src] of DECL.bodies3) {
    const cR0 = SF.ruleRatio(id), L1 = X.local(id, src, 'MS', 'rule', 1, 'in');
    for (const q of CB.DECL.qGrid) {
      const Lq = X.local(id, src, 'MS', 'ii', q * cR0, 'in'), cb = CB.c2BallPair(X.T1, X.GEO, id, src, { Rd: q * ruleR(id) }).S;
      out.push({ id, src, q, cR: q * cR0, iiOverK: nrm(Lq) / (q * nrm(L1)), vsC2Ball: rel(Lq, cb), dirDeg: angDeg(Lq, L1) });
    }
  }
  return out;
}
export function moonRows(X) {
  const [id, src] = DECL.moonRow, pkey = id + '|' + src, sunKey = SP.PARENT_ROWS[pkey], [sid, ssrc] = sunKey.split('|'), wSun = wAt(X.T1, X.GEO, sunKey), wPar = wAt(X.T1, X.GEO, pkey), cR0 = SF.ruleRatio(id);
  return DECL.qMoon.map((q) => {
    const R = q * cR0 * C.radiusOf(id), S = partRotQ(X.T1, X.GEO, sid, ssrc, { part: 'MS', Rd: R, extraW: wPar }), Pp = partRotQ(X.T1, X.GEO, id, src, { part: 'MS', Rd: R, extraW: wSun });
    return { q, cR: q * cR0, parOverSun: nrm(Pp) / nrm(S), sunYr: nrm(S) * YR, parYr: nrm(Pp) * YR, dirDeg: angDeg(add(S, Pp), S) };
  });
}
/** (う) u と k: 合成の向きは k ÷ u だけで決まり、大きさは同じ比で倍になる */
export function ukRows(X) {
  const out = [];
  for (const [id, src] of DECL.bodies3) for (const part of DECL.fitParts) {
    const P = X.inp(id, src), L0 = X.local(id, src, part), c = R3.r3Coeffs(0, 'N1');
    for (const [u, k] of DECL.uk) { const o = obsOf(P, totalOm(bgOf(id, u), L0, k), c); out.push({ id, src, part, u, k, kOverU: k / u, delta: o.delta, prec: o.prec }); }
  }
  return out;
}
/** 2 つのノブの組ごとの縮退: 観測量の集まりごとに 2 列の小さい特異値 ÷ 大きい特異値(列は感度の表の基準 u 1・(MS)・(N1)) */
export const OBS_SETS = Object.freeze([['prec'], ['prec', 'delta'], ['prec', 'raise'], ['prec', 'raise', 'delta'], ['prec', 'raise', 'delta', 'spin', 'heat']].map((x) => Object.freeze(x)));
export function pairRows(SR) {
  const out = [], ks = DECL.knobs;
  for (const s of SR.filter((r) => r.u === 1 && r.part === 'MS')) for (let a = 0; a < ks.length; a++) for (let b = a + 1; b < ks.length; b++) {
    const row = { id: s.id, pair: [ks[a], ks[b]], ratio: [] };
    for (const set of OBS_SETS) {
      const M = set.map((o) => DECL.obs.indexOf(o)).map((i) => [s.cols[ks[a]][i], s.cols[ks[b]][i]]);
      if (M.some((r) => r.some((x) => x === null))) { row.ratio.push(null); continue; }
      const sv = singularValues(M); row.ratio.push(sv[0] > 0 ? sv[1] / sv[0] : 0);
    }
    out.push(row);
  }
  return out;
}

/* ───────── T3 当てはめの段(〔第350便f〕の (全)(組)(個) を主の読みで —— 要る値を並べるだけ)───────── */
const NAME = Object.freeze({ Mercury: 'mercury', Venus: 'venus', Earth: 'earth', Mars: 'mars', Moon: 'moon' });
export const obsPrec = (id) => { const p = SF.precObs(id); return p ? { asYr: p.asYr, role: p.role } : null; };
export function fitStages(X) {
  const out = [], moon = DECL.moonRow;
  const precAt = ([id, src], knob, part, u, c) => {
    const P = X.inp(id, src), bg = bgOf(id, u), L = knob === 'k' ? X.local(id, src, part) : X.local(id, src, part, 'ii', c);
    return obsOf(P, totalOm(bg, L, knob === 'k' ? c : 1), { kTilt: 0, kPrec: 1 }).prec;
  };
  for (const knob of DECL.fitKnobs) for (const part of DECL.fitParts) for (const u of DECL.fitUs) for (const mc of DECL.moonCols) {
    const cs = knob === 'k' ? kGridVals() : SF.cGrid(), sc = { knob, part, u, moon: mc };
    const lit = DECL.fitBodies.filter(([id]) => obsPrec(id).role === DECL.fitRole).concat(mc === 'in' ? [moon] : []);
    const fOf = (row) => (c) => precAt(row, knob, part, u, c), ob = (row) => obsPrec(row[0]).asYr;
    const all = SF.solveJoint(lit.map(fOf), lit.map(ob), cs, { nG: DECL.nG });
    out.push({ ...sc, level: 'all', set: 'all', ids: lit.map(([id]) => id), n: lit.length, dof: lit.length - 1, status: all.status, c: all.c, edge: all.edge || null, resid: all.resid });
    for (const g of ['rock', 'moon']) {
      const gi = lit.filter(([id]) => SF.groupOf(id) === g);
      if (!gi.length) { out.push({ ...sc, level: 'group', set: g, ids: [], n: 0, dof: null, status: 'nodata', c: null, edge: null, resid: null }); continue; }
      const r = SF.solveJoint(gi.map(fOf), gi.map(ob), cs, { nG: DECL.nG });
      out.push({ ...sc, level: 'group', set: g, ids: gi.map(([id]) => id), n: gi.length, dof: gi.length - 1, status: r.status, c: r.c, edge: r.edge || null, resid: r.resid });
    }
    for (const row of DECL.fitBodies.concat(mc === 'in' ? [moon] : [])) {
      const p = obsPrec(row[0]), r = SF.solveOne(fOf(row), p.asYr, cs, { nB: DECL.nB });
      out.push({ ...sc, level: 'body', set: row[0], ids: [row[0]], n: 1, dof: 0, role: p.role, status: r.status, c: r.c, above: r.above, below: r.below, flatAt: r.flatAt, big: r.big, small: r.small, slope: r.slope,
        model1: fOf(row)(knob === 'k' ? 1 : SF.ruleRatio(row[0])), obsAsYr: p.asYr });
    }
  }
  return out;
}

/* ───────── T4 構造の組の読み(順位の相関 —— 4 天体では決まらない)───────── */
const ranks = (v) => { const idx = v.map((x, i) => [x, i]).sort((a, b) => a[0] - b[0]), r = new Array(v.length); idx.forEach(([, i], k) => { r[i] = k + 1; }); return r; };
export function spearman(a, b) { const n = a.length; if (n < 2) return null; const ra = ranks(a), rb = ranks(b); let d2 = 0; for (let i = 0; i < n; i++) d2 += (ra[i] - rb[i]) ** 2; return 1 - 6 * d2 / (n * (n * n - 1)); }
const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
export function propOf(X, id, src) { const m = C.massOf(id), R = C.radiusOf(id), r2 = X.T1.find((r) => r.id === id && r.src === src && r.mag === 'm2'); return { density: m / (4 / 3 * Math.PI * R * R * R), radius: R, spin: Math.abs(r2.omega) }; }
export function corrRows(X, FS) {
  const out = [];
  for (const knob of DECL.fitKnobs) for (const part of DECL.fitParts) for (const u of DECL.fitUs) for (const withMer of [false, true]) {
    const bs = FS.filter((r) => r.level === 'body' && r.knob === knob && r.part === part && r.u === u && r.moon === 'in' && r.status === 'one' && r.set !== 'Moon' && (withMer || r.role === DECL.fitRole));
    const ids = bs.map((r) => r.set), cs = bs.map((r) => r.c), props = Object.fromEntries(DECL.props.map((p) => [p, ids.map((id) => propOf(X, id, 'Sun')[p])]));
    const n = ids.length;
    out.push({ knob, part, u, withMercury: withMer, ids, n, rho: Object.fromEntries(DECL.props.map((p) => [p, n >= 2 ? spearman(cs, props[p]) : null])), nPerm: fact(n), pAll: n >= 2 ? 2 / fact(n) : null });
  }
  return out;
}

/* ───────── 零試験・共通の点検の数 ───────── */
export function pureScenes(X = makeCtx()) {
  // ① 共通の点検の数(自転しない源の通過 —— 第350便e の commonChecks)
  const cc = BG.commonChecks();
  // ② 書き直した口の照合: partRotQ(規則の半径)と第351便c の partRot(read 'C2')が同じ(地球・3 成分・extraW 0 と 月の母天体の重み)
  const same = Math.max(...['M', 'S', 'MS'].map((p) => rel(partRotQ(X.T1, X.GEO, 'Earth', 'Sun', { part: p, Rd: ruleR('Earth') }), SP.partRot(X.T1, X.GEO, 'Earth', 'Sun', { part: p }).Om))
    .concat([rel(X.local('Moon', 'EarthHi', 'MS'), add(SP.pairParts(X.T1, X.GEO, 'Moon', 'EarthHi').sun.MS, SP.pairParts(X.T1, X.GEO, 'Moon', 'EarthHi').parent.MS))]));
  // ③ den 'in'・(ii) と第351便b の c2BallPair(自分の重みの球の半径 = q × 規則の半径)の照合(地球・q 0.4・10)
  const cb = Math.max(...[0.4, 10].map((q) => rel(X.local('Earth', 'Sun', 'MS', 'ii', q * SF.ruleRatio('Earth'), 'in'), CB.c2BallPair(X.T1, X.GEO, 'Earth', 'Sun', { Rd: q * ruleR('Earth') }).S)));
  // ④ 統括の数え直しの数: 地球 (MS) の大きさ (W)・(C2)(den in)・背景だけの起こす率
  const PE = X.inp('Earth', 'Sun');
  const anc = { msW: nrm(SP.partRot(X.T1, X.GEO, 'Earth', 'Sun', { part: 'MS', read: 'W' }).Om) * YR * AS, msC2: nrm(X.local('Earth', 'Sun', 'MS', 'rule', 1, 'in')) * YR * AS,
    bgRaise: obsOf(PE, bgOf('Earth', 1), { kTilt: 1, kPrec: 0 }).raise };
  // ⑤ 観測量の式: 歳差の率は第348便c の precess と同じ(k₂ 1)・起こす率は第351便c の raiseRate(k₁ Ω⊥)と同じ
  const Om = totalOm(bgOf('Earth', 1), X.local('Earth', 'Sun', 'MS'), 1), r2 = X.T1.find((r) => r.id === 'Earth' && r.src === 'Sun' && r.mag === 'm2');
  const o1 = obsOf(PE, Om, { kTilt: 1, kPrec: 1 }), pr = C.precess(unit(Om), nrm(Om), unit(PE.sHat), r2.I, r2.omega);
  const fx = { prec: Math.abs(o1.prec / pr.precAsYr - 1), raise: Math.abs(o1.raise / (SP.raiseRate(PE.sHat, PE.nHat, SP.perpOf(PE.sHat, Om)) * YR * AS) - 1), deltaVsPrecess: Math.abs(o1.delta - pr.deltaDeg) };
  // ⑥ (あ) の閉じた形と (う) の比の不変: 背景 0 で k を 2 倍しても比と δ は同じ・(u, k) を同じ倍にしても δ は同じ
  const L0 = X.local('Earth', 'Sun', 'MS'), cN = R3.r3Coeffs(0.5, 'N1'), a1 = obsOf(PE, L0, cN), a2 = obsOf(PE, scl(L0, 2), cN);
  const u1 = obsOf(PE, totalOm(bgOf('Earth', 1), L0, 1), cN), u2 = obsOf(PE, totalOm(bgOf('Earth', 2), L0, 2), cN);
  const inv = { ratioK: Math.abs((a2.raise / a2.prec) / (a1.raise / a1.prec) - 1), deltaK: Math.abs(a2.delta - a1.delta), deltaUK: Math.abs(u2.delta - u1.delta), precUK: Math.abs(u2.prec / u1.prec - 2) };
  // ⑦ 特異値の自己試験: 階数 2 の 3×3(第 3 列 = 第 1 列 + 第 2 列 —— MᵀM の固有値から取るので最小の特異値の床は最大の 1e-8 の桁: 物差し 1e-6 で階数 2)・対角
  const sv1 = singularValues([[1, 0, 1], [0, 1, 1], [2, 1, 3]]), sv2 = singularValues([[3, 0], [0, 4]]);
  const svT = { rank2: rankOf(sv1, DECL.rankTol[1]), min: sv1[2] / sv1[0], diag: Math.abs(sv2[0] - 4) + Math.abs(sv2[1] - 3) };
  // ⑧ 当てはめの道具(第350便f の solveOne・solveJoint)を本枝の刻みで: 冪 2 の解・端・平ら
  const cs = [1e-3, 1e-2, 1e-1, 1, 10, 100];
  const sol = { pow: SF.solveOne((c) => c * c, 4, cs, { nB: DECL.nB }), edge: SF.solveJoint([(c) => c], [1e9], cs, { nG: DECL.nG }), flat: SF.solveOne(() => 1, 2, cs, { nB: DECL.nB }) };
  // ⑨ 順位の相関の自己試験
  const sp = { same: spearman([1, 2, 3, 4], [10, 20, 30, 40]), rev: spearman([1, 2, 3], [3, 2, 1]), perm4: 2 / fact(4) };
  // ⑩ 入力の拒否
  const rej = [() => partRotQ(X.T1, X.GEO, 'Earth', 'Sun', { part: 'X', Rd: 1 }), () => partRotQ(X.T1, X.GEO, 'Earth', 'Sun', { part: 'MS', Rd: 0 }), () => X.local('Earth', 'Sun', 'MS', 'z', 1),
    () => X.local('Earth', 'Sun', 'MS', 'ii', -1), () => obsOf(PE, [1, 2], cN), () => obsOf(PE, [1, 2, 3], { kTilt: NaN, kPrec: 1 })].map((fn) => { try { fn(); return false; } catch (e) { return e instanceof RangeError; } });
  return { common: { p2x: cc.diaXz, p6: cc.sixZ, w: cc.rotWz }, same, cb, anc, fx, inv, svT, sol: { powC: sol.pow.c, powS: sol.pow.status, edge: sol.edge.status, flat: sol.flat.status }, sp, rejects: rej };
}
export function pureGates(S) {
  const Cm = DECL.common, A = DECL.anchor, ok = (x, w) => Math.abs(x - w) <= Cm.tol;
  return {
    common: ok(S.common.p2x, Cm.p2x) && ok(S.common.p6, Cm.p6) && ok(S.common.w, Cm.w),
    partSame: S.same < 1e-12,
    c2ballSame: S.cb < 1e-9,
    anchor: Math.abs(S.anc.msW - A.msWAsYr) <= A.tolW && Math.abs(S.anc.msC2 - A.msC2AsYr) <= A.tolC2 && Math.abs(S.anc.bgRaise - A.bgRaiseAsYr) <= A.tolBg,
    obsForms: S.fx.prec < 1e-12 && S.fx.raise < 1e-12 && S.fx.deltaVsPrecess < 1e-9,
    invariance: S.inv.ratioK < 1e-12 && S.inv.deltaK < 1e-9 && S.inv.deltaUK < 1e-9 && S.inv.precUK < 1e-12,
    svd: S.svT.rank2 === 2 && S.svT.min < 1e-7 && S.svT.diag < 1e-12,
    solver: S.sol.powS === 'one' && Math.abs(S.sol.powC - 2) < 1e-6 && S.sol.edge === 'edge' && S.sol.flat === 'flat',
    spearman: Math.abs(S.sp.same - 1) < 1e-15 && Math.abs(S.sp.rev + 1) < 1e-15 && Math.abs(S.sp.perm4 - 1 / 12) < 1e-15,
    rejects: S.rejects.length === 6 && S.rejects.every(Boolean),
  };
}
