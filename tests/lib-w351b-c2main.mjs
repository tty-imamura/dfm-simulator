// 第351便b(原仮定者の回答(2026-11-24 —— 第147報)AN1000・統括の検証項目 R428):
//   **球体換算の主の列を (C2)(球全体の剛体回転への平均 —— 天体の表は球の半径の平均)に替えた表・換算の係数 k の掛け先(局所の項だけ —— 宣言した背景の角速度には掛けない)・
//   k と構造の係数 c_R の縮退の診断・(C2) の定義の門(零試験)・球の中の自分の重みの置き方 3 列 —— の純関数。診断だけ**
//   (器 tests/exp-w351b-c2main.mjs と QA behavior.c2main351b・docs.c2main351b が読む —— html を読まない・ファイルを読まない・状態を持たない)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない(AN712 —— エンジンへ足す操作ではない)。
//   既存の lib は呼ぶだけ(本文は変えない): 第350便b(bodyRowsC・equivR・c1・c2Quad・c2Ball・wHalf・rigidField・shearField・commonField・pureScenes・pureGates・ballCheckRows)・
//   第348便h(makeField3・pairRot3・YK・DECL.combos)・第348便c(massOf・radiusOf)・第350便e(uVec・composeBal)・第347便e(t1Table・geometry・DECL.pairs)・第337便c(GALAXY・YR)。
//
// ■ 読みの名(本便で共通): (C2) = 球全体の剛体回転への平均 —— 一般の場は第350便b の c2Quad・天体の表は球の半径の平均(第350便b の bodyRowsC の C2ball と同じ作り)—— 主の列。
//   (W) = 中心の渦度の半分(第350便b の lib と表が「(C2)」と書いている列 —— 本便では (W) と書き分ける)。(C1) = 2 点の差分(= (P2))・(C3) = k ×(C1)(これまでの係数 2/5)—— 比べる列。
// ■ 換算の係数 k(AN1000「係数はノブにする」の読み): Ω = Ω_bg + Σ(局所の項 × k)。局所の項 = サンプルの中の源(太陽・母天体)由来の (C2)。宣言した背景の角速度 Ω_bg には掛けない。
//   既定 1・格子 0.5・1・2 と 2/5(これまでの (C3) の値との対応の列)。**k の値は観測から決めない**。構造の係数 c_R・経路の比率とは別のノブ —— 同時には当てはめない(片方を固定して振った列だけ)。
// ■ 背景軸引きずり (B2): 第350便e の uVec(ω_G × 倍率, 'rd0', m, 向き)(受け手の係数なし)。向き −1(銀河の回転と逆向き)が主・倍率は宣言の格子(0・1)。
// ■ 言わないこと: (C2) が正しい読みだとは書かない(お答えで主の列になった —— (C1) は比べる列として残る)。k の値を選ばない。観測の値は固定の比べる列(合わせない)。
import * as B from './lib-w350b-sphereconv.mjs';
import * as G3 from './lib-w348h-axisgeo3.mjs';
import * as C from './lib-w348c-axisbalance.mjs';
import * as U from './lib-w350e-bgaxial.mjs';
import * as E from './lib-w347e-spintorque.mjs';
import * as TL from './lib-w337c-tidelock.mjs';
import * as H from './lib-w347h-axisdiff.mjs';

export const LIB_VERSION = 'w351b-c2main-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const D2R = Math.PI / 180, YR = TL.YR, AS = 180 * 3600 / Math.PI;

/* ───────── 宣言 ───────── */
export const DECL = Object.freeze({
  main: 'C2', readings: Object.freeze(['C2', 'W', 'C1', 'C3']),
  /** 換算の係数 k の格子(既定 1 —— 2/5 はこれまでの (C3) の値との対応の列・0 は掛け先の検査だけ) */
  kGrid: Object.freeze([0.4, 0.5, 1, 2]), kDefault: 1, kCheck: Object.freeze([0, 1, 2]),
  /** 背景軸引きずり (B2) の倍率(銀河の公転の角速度の倍 —— 宣言の格子)と向き(−1 が主) */
  bgMult: Object.freeze([0, 1]), bgSign: -1, bgForm: 'rd0',
  /** T2・T3 の天体 3 組 */
  bodies3: Object.freeze([['Earth', 'Sun'], ['Mars', 'Sun'], ['Venus', 'Sun']].map((x) => Object.freeze(x))),
  /** T3 の格子: q = 引きずられ半径 ÷ 規則の半径(c_R = q × 規則の半径 ÷ 観測半径)・k は同じ q の値を k に */
  qGrid: Object.freeze([0.4, 1, 2.5, 10, 100, 1e4, 1e6, 1e8]),
  /** 等高線が重なると書く物差し(歳差の率の比が 1 から 1% の内) */
  overlapTol: 0.01,
  /** 自分の重みの置き方 3 列(主 = 球の平均) */
  selfPlaces: Object.freeze(['center', 'arm', 'ball']), selfMain: 'ball',
  /** 共通の点検の数(統括の数え直し —— 第350便までと同じ) */
  common: Object.freeze({ p2x: -0.03061311, p6: -0.01530656, w: -0.01530612, tol: 5e-9 }),
  /** 第350便b の天体の表の地球(太陽由来 (MS)・(W1) の歳差の率 [″/年] —— 統括の数え直しの数) */
  earthAnchor: Object.freeze({ C1: 0.151728, W: 0.050576, C2: 0.066930, C3: 0.060691, tol: 5e-7 }),
  /** 背景だけの起こす率(地球・銀河の公転の角速度 ×1・向き −1・経路 ① 係数 1 —— 統括の数え直しの数 [″/年]) */
  earthBgRaise: Object.freeze({ v: 1.1720e-3, tol: 5e-8 }),
  /** (C2) の門の場: ずれ・剛体回転 Ω₀・求積と一次の展開の差の次数の下限 */
  rigid: Object.freeze([1, 2, 3]), ordMin: 2,
  degenerate: U.DECL.degenerate,
  judge: '丸めの桁の床: 打ち消しで 0 になる量は尺度の 1e-12 倍以下を 0 と書く',
});
export const LIT = Object.freeze({ note: '文献の値・未照合(この環境から一次資料に当たっていない)', precArcsecPerYr: C.LIT.precArcsecPerYr, precRole: C.LIT.precRole, precSrc: C.LIT.precSrc });

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
const snapA = (d) => (d <= 1e-9 ? 0 : d >= 180 - 1e-9 ? 180 : d);
const GLB = H.gaussLegendre(B.DECL.ballN);
const NAME = Object.freeze({ Mercury: 'mercury', Venus: 'venus', Earth: 'earth', Mars: 'mars', Moon: 'moon' });
const obsOf = (id) => { const k = NAME[id]; return k && LIT.precArcsecPerYr[k] !== undefined ? LIT.precArcsecPerYr[k] : null; };
const COMBO = Object.freeze({ rule: G3.DECL.combos.find((c) => c.id === G3.DECL.mainCombo), cR: G3.DECL.combos.find((c) => c.id === 'K1cM'),
  ball: Object.freeze({ id: 'K1ballC2', al: 1, self: 'cR', rot: 'M', note: '(C2) の球の口(第350便b と同じ —— 受け手の半径だけを R′ に)' }) });

/* ───────── T2 換算の係数 k の掛け先 ───────── */
/**
 * Ω = Ω_bg + Σ(局所の項 × k)。局所の項だけに k を掛け、宣言した背景の角速度には掛けない。合成の向きは第350便e の composeBal(ほぼ 0 なら「決まらない」)。
 * mut: 'kOnBg'(背景にも k を掛ける変異)・'noK'(k を掛けない変異)
 */
export function applyK({ local, bg = [0, 0, 0], k = DECL.kDefault } = {}, { mut = null } = {}) {
  if (!(Array.isArray(local) && local.length >= 1 && local.every(isVec))) throw new RangeError('applyK: 局所の項(ベクトルの列)');
  if (!isVec(bg)) throw new RangeError('applyK: 背景の角速度(ベクトル)');
  if (!(fin(k) && k >= 0)) throw new RangeError('applyK: 換算の係数 k ≥ 0');
  const kk = mut === 'noK' ? 1 : k, loc = local.map((v) => scl(v, kk)), bgV = mut === 'kOnBg' ? scl(bg, k) : bg.slice();
  let localSum = [0, 0, 0]; for (const v of loc) localSum = add(localSum, v);
  const terms = [bgV, ...loc], bal = U.composeBal(terms);
  return { local: loc, bg: bgV, localSum, total: bal.vec, mag: bal.mag, e: bal.e, undetermined: bal.undetermined };
}
/** 背景軸引きずり (B2) のベクトル(rad/s): 第350便e の uVec(ω_G × 倍率・受け手の係数なし・向き) */
export const bgB2 = (id, mult, sign = DECL.bgSign) => U.uVec(TL.GALAXY.omega * mult, DECL.bgForm, C.massOf(id), sign);
/** 起こす率(公転の北極 n を基準に傾き ε = acos(ŝ·n)・−dε/dt = (dŝ/dt · n) ÷ sin ε —— 経路 ① 係数 1 で dŝ/dt = Ω⊥)と、回転軸へ寄る率(θ = ŝ と Ω のなす角・−dθ/dt = abs(Ω) sin θ)[rad/s] */
export function raiseOf(sHat, nHat, Om) {
  if (!(isVec(sHat) && isVec(nHat) && isVec(Om))) throw new RangeError('raiseOf: ŝ・n・Ω');
  const s = unit(sHat), n = unit(nHat), perp = sub(Om, scl(s, dot(Om, s))), ce = dot(s, n), se = Math.sqrt(Math.max(0, 1 - ce * ce));
  const m = nrm(Om), th = m > 0 ? angDeg(s, Om) : null;
  return { raise: se > 0 ? dot(perp, n) / se : null, toAxis: m > 0 ? m * Math.sin(th * D2R) : 0, cos: m > 0 ? dot(s, Om) / m : null, thetaDeg: th };
}

/* ───────── (C2) の天体の口(受け手の自分の重みの球の半径 Rd・平均の球の半径 a)───────── */
/** 中心の値が「半径 Rd の球の自分の重みの半径 ρ の値」になる受け手の半径(ρ ≤ Rd は第350便b の equivR・外は 1.5 ρ —— 外部の重み m/ρ = 3m/(2R′)) */
export const equivR2 = (Rd, rho) => (rho <= Rd ? B.equivR(Rd, rho) : 1.5 * rho);
/**
 * 由来ごとの (C2)(球の半径の平均 —— 重み 5ρ⁴ ÷ a⁵)の {G, S, P}。Rd = 自分の重みの球の半径・a = 平均の球の半径(既定 a = Rd)。
 * a = Rd = 規則の半径 Y_k m は第350便b の bodyRowsC の C2ball と同じ作り(門で照合)。
 */
export function c2BallPair(T1, GEO, id, src, { Rd, a = Rd } = {}) {
  if (!(fin(Rd) && Rd > 0 && fin(a) && a > 0)) throw new RangeError('c2BallPair: Rd > 0・a > 0');
  const Ro = C.radiusOf(id); let G = [0, 0, 0], S = [0, 0, 0], P = null;
  for (let i = 0; i < GLB.x.length; i++) {
    const rho = 0.5 * a * (GLB.x[i] + 1), w = 0.5 * a * GLB.w[i] * 5 * Math.pow(rho, 4) / Math.pow(a, 5), R = G3.pairRot3(T1, GEO, id, src, COMBO.ball, { cRv: equivR2(Rd, rho) / Ro });
    G = add(G, scl(R.G.W, w)); S = add(S, scl(R.S.W, w)); if (R.P) P = add(P || [0, 0, 0], scl(R.P.W, w));
  }
  return { G, S, P };
}
/** 自分の重みを半径 ρ の点の値に置いた (W)(腕の点 = ρ = Rd) */
export function wAtPair(T1, GEO, id, src, Rd, rho) { const R = G3.pairRot3(T1, GEO, id, src, COMBO.ball, { cRv: equivR2(Rd, rho) / C.radiusOf(id) }); return { G: R.G.W, S: R.S.W, P: R.P ? R.P.W : null }; }
const ruleR = (id) => G3.YK * C.massOf(id);

/* ───────── T1 主の列の切り替え(表 1 —— 天体 15 組・(MS) のまま)───────── */
export function switchRows(BR) {
  return BR.map((r) => {
    const v = { C1: r.C1, C2: r.C2ball, W: r.C2, C3: r.C3 };
    const e2 = (k) => (v[k].W1P || v[k].W1);
    const dir = (k) => C.composeAll(v[k].vec.G, v[k].vec.S, v[k].vec.P), d2 = dir('C2'), d1 = dir('C1'), dW = dir('W');
    const eAx = (d) => (d.W1P || d.W1).e;
    return { id: r.id, src: r.src, betaS: r.betaS, obsAsYr: r.obsAsYr,
      SmagYr: { C2: v.C2.SmagYr, W: v.W.SmagYr, C1: v.C1.SmagYr, C3: v.C3.SmagYr }, PmagYr: r.C2ball.PmagYr === null ? null : { C2: v.C2.PmagYr, C1: v.C1.PmagYr },
      prec: { C2: e2('C2').precAsYr, W: e2('W').precAsYr, C1: e2('C1').precAsYr, C3: e2('C3').precAsYr }, delta: { C2: e2('C2').deltaDeg, C1: e2('C1').deltaDeg },
      c2OverC1: e2('C2').precAsYr / e2('C1').precAsYr, c2OverW: e2('C2').precAsYr / e2('W').precAsYr, c2OverC3: e2('C2').precAsYr / e2('C3').precAsYr,
      dirC2C1: snapA(angDeg(eAx(d2), eAx(d1))), dirC2W: snapA(angDeg(eAx(d2), eAx(dW))),
      obsRatioC2: r.obsAsYr && e2('C2').precAsYr > 0 ? e2('C2').precAsYr / r.obsAsYr : null, obsRatioC1: r.obsAsYr && e2('C1').precAsYr > 0 ? e2('C1').precAsYr / r.obsAsYr : null,
      withParent: !!r.C2ball.W1P };
  });
}

/* ───────── T2 掛け先の表(表 2 —— 3 組 × 背景の倍率 × k)───────── */
export function kRows(BR, T1 = E.t1Table(), GEO = E.geometry()) {
  const out = [];
  for (const [id, src] of DECL.bodies3) {
    const r = BR.find((x) => x.id === id && x.src === src), key = id + '|' + src, g = GEO[key], wAx = unit(g.w), r2 = T1.find((x) => x.id === id && x.src === src && x.mag === 'm2');
    const local = [r.C2ball.vec.S].concat(r.C2ball.vec.P ? [r.C2ball.vec.P] : []);
    for (const mult of DECL.bgMult) {
      const bg = bgB2(id, mult);
      for (const k of [0].concat(DECL.kGrid)) {
        const A = applyK({ local, bg, k }), ro = raiseOf(wAx, g.n, A.total);
        const p = A.undetermined ? null : C.precess(A.e, A.mag, wAx, r2.I, r2.omega);
        out.push({ id, src, mult, k, localYr: nrm(A.localSum) * YR, bgYr: nrm(A.bg) * YR, undetermined: A.undetermined,
          precAsYr: p ? p.precAsYr : null, deltaDeg: p ? snapA(p.deltaDeg) : null, cos: A.undetermined ? null : ro.cos,
          raiseAsYr: A.undetermined || ro.raise === null ? null : ro.raise * YR * AS, toAxisAsYr: A.undetermined ? null : ro.toAxis * YR * AS });
      }
    }
  }
  return out;
}

/* ───────── T3 k と c_R の区別(表 3 —— 縮退の診断)───────── */
/**
 * 3 組 × q。k の列: 規則の半径のまま局所の (C2) を q 倍(背景には掛けない)/(ii) c_R の列: 自分の重みの球の半径と平均の球の半径を q × 規則の半径に(c_R = q R_d ÷ R_obs)/
 * (i) 腕だけの列: 自分の重みは規則の半径の球のまま・平均の球の半径だけを q × 規則の半径に。どの列も片方だけを振る(k と c_R を同時に当てはめない)。
 * 合成: 背景なし(局所だけ)・(B2) 倍率 1(宣言の背景 —— k も c_R も掛からない)・(B1) 銀河を場の源として数えた項(c_R では動く・k は掛けない)。
 */
export function degenRows(T1 = E.t1Table(), GEO = E.geometry()) {
  const out = [];
  for (const [id, src] of DECL.bodies3) {
    const Rd = ruleR(id), Ro = C.radiusOf(id), key = id + '|' + src, wAx = unit(GEO[key].w), r2 = T1.find((x) => x.id === id && x.src === src && x.mag === 'm2');
    const base = c2BallPair(T1, GEO, id, src, { Rd }), baseW = G3.pairRot3(T1, GEO, id, src, COMBO.rule), bg = bgB2(id, 1);
    const prec = (terms) => { const b = U.composeBal(terms); return b.undetermined ? { asYr: null, e: null } : { asYr: C.precess(b.e, b.mag, wAx, r2.I, r2.omega).precAsYr, e: b.e }; };
    for (const q of DECL.qGrid) {
      const cR = q * Rd / Ro;
      const cols = {
        k: { C2: { G: base.G, S: scl(base.S, q) }, W: scl(baseW.S.W, q) },
        ii: (() => { const c2 = c2BallPair(T1, GEO, id, src, { Rd: q * Rd }), w = G3.pairRot3(T1, GEO, id, src, COMBO.cR, { cRv: cR }); return { C2: { G: c2.G, S: c2.S }, W: w.S.W }; })(),
        i: (() => { const c2 = c2BallPair(T1, GEO, id, src, { Rd, a: q * Rd }); return { C2: { G: c2.G, S: c2.S }, W: baseW.S.W }; })(),
      };
      const row = { id, src, q, cR };
      for (const [nm, c] of Object.entries(cols)) {
        const none = prec([c.C2.S]), b2 = prec([bg, c.C2.S]), b1 = prec([c.C2.G, c.C2.S]);
        row[nm] = { SmagYr: nrm(c.C2.S) * YR, GmagYr: nrm(c.C2.G) * YR, c2OverW: nrm(c.C2.S) / nrm(c.W), precNone: none.asYr, precB2: b2.asYr, precB1: b1.asYr, eB2: b2.e, eB1: b1.e };
      }
      const r = (a, b) => (fin(a) && fin(b) && b > 0 ? a / b : null);
      row.iiOverK = r(row.ii.precNone, row.k.precNone); row.iOverK = r(row.i.precNone, row.k.precNone);
      row.dirB2iiK = row.ii.eB2 && row.k.eB2 ? snapA(angDeg(row.ii.eB2, row.k.eB2)) : null; row.dirB1iiK = row.ii.eB1 && row.k.eB1 ? snapA(angDeg(row.ii.eB1, row.k.eB1)) : null;
      row.dirB2iK = row.i.eB2 && row.k.eB2 ? snapA(angDeg(row.i.eB2, row.k.eB2)) : null;
      row.galOverSunK = row.k.GmagYr / row.k.SmagYr; row.galOverSunII = row.ii.GmagYr / row.ii.SmagYr;
      for (const nm of Object.keys(cols)) { delete row[nm].eB2; delete row[nm].eB1; }
      out.push(row);
    }
  }
  return out;
}
/** T3 の要約: 組ごとに (ii) ÷ k が 1 から overlapTol の内の q の範囲・(i) ÷ k の範囲 */
export function overlapOf(DR) {
  return DECL.bodies3.map(([id, src]) => {
    const rs = DR.filter((r) => r.id === id && r.src === src), inn = rs.filter((r) => Math.abs(r.iiOverK - 1) <= DECL.overlapTol);
    const iin = rs.filter((r) => Math.abs(r.iOverK - 1) <= DECL.overlapTol);
    return { id, src, iiQmax: inn.length ? Math.max(...inn.map((r) => r.q)) : null, iiQmin: inn.length ? Math.min(...inn.map((r) => r.q)) : null, iiN: inn.length, iQ: iin.map((r) => r.q),
      iiOverKmax: Math.max(...rs.map((r) => r.iiOverK)), iiOverKmin: Math.min(...rs.map((r) => r.iiOverK)), iOverKmax: Math.max(...rs.map((r) => r.iOverK)), iOverKmin: Math.min(...rs.map((r) => r.iOverK)) };
  });
}

/* ───────── T5 球の中の自分の重みの置き方 3 列(表 5 —— 主 = 球の平均)───────── */
export function selfRows(BR, T1 = E.t1Table(), GEO = E.geometry()) {
  return BR.map((r) => {
    const Rd = ruleR(r.id), arm = wAtPair(T1, GEO, r.id, r.src, Rd, Rd), cen = r.C2.vec, ball = r.C2ball.vec;
    return { id: r.id, src: r.src, centerYr: nrm(cen.S) * YR, armYr: nrm(arm.S) * YR, ballYr: nrm(ball.S) * YR, armOverCenter: nrm(arm.S) / nrm(cen.S), ballOverCenter: nrm(ball.S) / nrm(cen.S),
      armDir: snapA(angDeg(arm.S, cen.S)), ballDir: snapA(angDeg(ball.S, cen.S)) };
  });
}

/* ───────── T4 (C2) の定義の門(零試験)───────── */
export function pureScenes() {
  // ① 第350便b の門を呼ぶ(主を (C2) に替えた後も残る)
  const S350 = B.pureScenes(), G350 = B.pureGates(S350);
  // ② 純粋なずれで (C2) = 0 かつ (C1) ≠ 0・剛体回転で (C2) = Ω₀(点 (4,0,0)・半径 0.01 と 0.4)
  const p = [4, 0, 0], ex = [1, 0, 0], sh = B.shearField(), rg = B.rigidField(DECL.rigid.slice());
  const shear = { c2: [0.01, 0.4].map((a) => nrm(B.c2Quad(sh, p, a))), c1: nrm(B.c1(sh, p, 0.01, ex)) };
  const rigid = [0.01, 0.4].map((a) => rel(B.c2Quad(rg, p, a), DECL.rigid.slice()));
  // ③ 共通の点検の数(自転しない源の通過)
  const f = B.commonField(), common = { p2x: B.c1(f, p, 0.01, ex)[2], p6: B.p6(f, p, 0.01, ex)[2], w: B.wHalf(f, p, 0.01)[2], c2: B.c2Quad(f, p, 0.01)[2] };
  // ④ 球の求積と一次の展開の差の次数(第350便b の ballCheckRows —— 腕 ≪ 距離)
  const BC = B.ballCheckRows(), ords = BC.slice(1).map((r) => r.ord);
  // ⑤ 換算の係数 k の掛け先(局所 2 項・背景 1 項の試しのベクトル)
  const L0 = [[1, 2, 3], [-0.5, 0.25, 1]], bg0 = [0.3, -0.2, 0.7];
  const a1 = applyK({ local: L0, bg: bg0, k: 1 }), a2 = applyK({ local: L0, bg: bg0, k: 2 }), a0 = applyK({ local: L0, bg: bg0, k: 0 }), a00 = applyK({ local: L0, bg: [0, 0, 0], k: 0 });
  const kTest = { double: rel(a2.localSum, scl(a1.localSum, 2)), bgSame: rel(a2.bg, a1.bg), zeroTotal: rel(a0.total, bg0), zeroUnd: a00.undetermined === true && a00.e === null, oneUnd: a1.undetermined === false };
  // ⑥ 一様な剛体の場 u = Ω₀ × r を局所の入力に入れたとき (C2) が Ω₀ を返す —— 同じ背景を宣言の項でも足すと二度数え(合計 = 2 Ω₀)
  const Om0 = DECL.rigid.slice(), loc = B.c2Quad(rg, p, 0.4), dbl = applyK({ local: [loc], bg: Om0, k: 1 });
  const twice = { locVsOm: rel(loc, Om0), totalVs2: rel(dbl.total, scl(Om0, 2)), excess: nrm(sub(dbl.total, Om0)) / nrm(Om0) };
  // ⑦ 変異: 背景にも k を掛ける/k を掛けない → ⑤ の検査で落ちる
  const m1 = applyK({ local: L0, bg: bg0, k: 2 }, { mut: 'kOnBg' }), m2 = applyK({ local: L0, bg: bg0, k: 2 }, { mut: 'noK' });
  const mut = { kOnBgBg: rel(m1.bg, bg0), noKDouble: rel(m2.localSum, scl(a1.localSum, 2)) };
  // ⑧ 書き直した口の照合: equivR2 は内側で第350便b の equivR・境で連続(1.5 Rd)
  const eq = { inner: Math.max(...[0.1, 0.5, 0.9].map((x) => Math.abs(equivR2(1, x) - B.equivR(1, x)))), edge: Math.abs(equivR2(1, 1) - 1.5) + Math.abs(B.equivR(1, 1) - 1.5), outer: Math.abs(equivR2(1, 2) - 3) };
  // ⑨ 入力の拒否
  const rej = [() => applyK({ local: [], bg: bg0 }), () => applyK({ local: [[1, 2]], bg: bg0 }), () => applyK({ local: L0, bg: [1, 2] }), () => applyK({ local: L0, bg: bg0, k: -1 }),
    () => applyK({ local: L0, bg: bg0, k: NaN }), () => c2BallPair(null, null, 'Earth', 'Sun', { Rd: 0 }), () => raiseOf([1, 0], [0, 0, 1], [1, 0, 0])].map((fn) => { try { fn(); return false; } catch (e) { return e instanceof RangeError; } });
  return { g350: G350, g350n: Object.keys(G350).length, shear, rigid, common, ords, kTest, twice, mut, eq, rejects: rej };
}
export function pureGates(S) {
  const Cm = DECL.common, ok = (x, w) => Math.abs(x - w) <= Cm.tol;
  return {
    gate350b: S.g350n === 8 && Object.values(S.g350).every((v) => v === true),
    shear: S.shear.c2.every((x) => x <= 1e-12) && S.shear.c1 > 0.5,
    rigid: S.rigid.every((x) => x < 1e-12),
    common: ok(S.common.p2x, Cm.p2x) && ok(S.common.p6, Cm.p6) && ok(S.common.w, Cm.w) && Math.abs(S.common.c2 - Cm.w) < 1e-6,
    ballOrder: S.ords.length >= 2 && S.ords.every((o) => o >= DECL.ordMin),
    kTarget: S.kTest.double < 1e-15 && S.kTest.bgSame === 0 && S.kTest.zeroTotal < 1e-15 && S.kTest.zeroUnd && S.kTest.oneUnd,
    twice: S.twice.locVsOm < 1e-12 && S.twice.totalVs2 < 1e-12 && Math.abs(S.twice.excess - 1) < 1e-12,
    mutants: S.mut.kOnBgBg > 0.5 && S.mut.noKDouble > 0.4,
    rewrite: S.eq.inner === 0 && S.eq.edge < 1e-15 && S.eq.outer === 0,
    rejects: S.rejects.length === 7 && S.rejects.every(Boolean),
  };
}
