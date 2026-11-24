// 第350便g(原仮定者の整理(2026-11-23 —— 第146報)・統括の検証項目 R424):
//   **円盤引きずりの側を、geoPN=3 の在位の形の場(枝 h の makeField3 の既定の引数)で数える診断の純関数 —— 通過の輪の傾きを 3 つの読みで・🛟 saturnRotVertExplore3d の傾きの比と並べる・
//   受け手の速度で向きが入れ替わる行の切り分け・輪の傾き/復元の成分/厚みを分ける・厚みの帳簿へ候補の回転を入れる口**
//   (器 tests/exp-w350g-diskcheck.mjs と QA behavior.diskcheck350g・docs.diskcheck350g が読む —— html を読まない・ファイルを読まない・状態を持たない)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない(AN712 —— エンジンへ足す操作ではない)。
//   既存の lib は呼ぶだけ(本文と版は変えない): 第348便h(makeField3・rot3)・第348便i(geo3OmegaField・flyRing3・vOrbit・DECL —— 比べる列と照合)・第348便d(pullSummary・satRow・saturnUnits・DECL)・
//   第347便h(rotOf・gaussLegendre)・第340便d(gyroRow)・第338便d(linearLedger・pNeed・nOf・srcOf・centerKm・DECL)。
//
// ■ 場(共通): makeField3 の既定の引数 = 在位の形(K1 の核・源の回転は球のモーメント・背景 0・自分の重みを分母に・受け手の速度を引く)。受け手の自分の重みの球は評価の点を中心に置く。
// ■ 回転の読み(球体換算の読みの名 —— 共通ブリーフ): (C1) 2 点の差分(= (P2)・腕 R_b の有限の差)/(C2) 球全体の剛体回転への平均 —— 一次の値として rot3('W')(中心の ½∇×u)を使い、
//   6 点の平均(直交 3 直径の差分の和の ½ —— 第347便h の rotOf の P6)を並べる/(C3) 係数 k ×(C1)(k = 2/5)。
// ■ 言わないこと: 環の厚み・円盤引きずりの型・軸引きずりの型の答えとは書かない。🛟 を軸引きずりの型の検証とは書かない(この場・この候補・このノブでは、の表)。
//   観測の数はリポジトリに既に在る数だけを固定の比べる列に置く(文献の値・未照合 —— 合わせない)。
import * as G3 from './lib-w348h-axisgeo3.mjs';
import * as I3 from './lib-w348i-diskgeo3.mjs';
import * as D from './lib-w348d-diskaxis.mjs';
import * as H from './lib-w347h-axisdiff.mjs';
import * as GP from './lib-w340d-gyropath.mjs';
import * as RB from './lib-w338d-ringbook.mjs';

export const LIB_VERSION = 'w350g-diskcheck-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const D2R = Math.PI / 180;
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const scl = (a, k) => [a[0] * k, a[1] * k, a[2] * k], add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (a) => { const m = nrm(a); return m > 0 ? scl(a, 1 / m) : [0, 0, 0]; };
const sgn = (x) => (x > 0 ? 1 : x < 0 ? -1 : 0);
const angDeg = (a, b) => Math.atan2(nrm(crs(a, b)), dot(a, b)) / D2R;

/* ───────── 宣言(走らせたノブの格子と判定の物差しの記録 —— 式の形の宣言ではない)───────── */
export const DECL = Object.freeze({
  reads: Object.freeze(['C1', 'C2', 'C2six', 'C3']), c3k: 0.4,
  /** 共通の点検の数(統括の数え直し —— 源 m 1・R 1・(0,0,0)・速度 (0,1,0)/受け手 m 1・R 1・(4,0,0)/腕 0.01) */
  common: Object.freeze({ h: 0.01, x: -0.03061311, six: -0.01530656, w: -0.01530612, tol: 5e-9 }),
  /** T1 通過(〔第348便i〕の flyRing3 と同じ道・輪 —— 源 (v t, b, 0)・速度 (v, 0, 0)・自転 0)。在位の形 = 受け手の球 m 1・R 1(輪の中心)。比べる列 = flyRing3 の (Rk1) の W_ii 定数 */
  T1: Object.freeze({ recv: Object.freeze({ m: 1, R: 1 }), Rr: D.DECL.D.Rr, inc: D.DECL.D.inc, ref: Object.freeze([Object.freeze([0, 0.01]), Object.freeze([0, 0.1]), Object.freeze([0.1, 0.1])]) }),
  /** T2 🛟(第339便a の正本 —— 読むだけ)と並べる半径(土星の環の区分の中心)・受け手の速度は公転・(C1)(C2) */
  T2: Object.freeze({ centers: D.DECL.C.centers, zOverR: Object.freeze([1e-4, 1e-2]) }),
  /** T3 向きが入れ替わる行(〔第348便i〕の (Rk1) の (A) の行 —— 受け手の速度の倍 λ = 0・1・−1)。在位の形の行 = 受け手の球 m 1・R 1 を足す */
  T3: Object.freeze({ lams: Object.freeze([0, 1, -1]), den: I3.DECL.k1.den, Rself: I3.DECL.k1.Rself, inPos: Object.freeze({ m: 1, R: 1 }), cands: Object.freeze(['P2', 'W']) }),
  /** T4 粒子の輪(源 m 1・R 1・自転 s ẑ・輪の半径 r₀・傾き i₀・厚み h₀ —— 受け手は粒子ごとに在位の形 m 1・R 1)。步は dx/dt = v + u(x, v)・dv/dt = −x/abs(x)³(RK4) */
  T4: Object.freeze({ s: 0.4, r0: 3, i0: 10, h0: 0.03, N: 24, Nalt: 36, ph0: 0, ph0alt: 0.7, orbits: 3, perOrbit: 200,
    cfgs: Object.freeze(['both', 'spin', 'trans', 'off', 'halfStep', 'altN', 'altPhase']) }),
  /** T5 厚みの帳簿への口(土星の環の区分の中心 5 —— 点・corV と輪の corS・drag90 の向きが変わる高さ・帳簿 H = 2σ_z/ν_z の ν_z² = n²(1 + K))。
   *  在位の形 = 自分の重みの中心の値を規則の半径 R_i = Y_k m_i から(3/(2 Y_k) —— 土星の単位)・受け手の球の半径 R_b。比べる列 = W_ii 0.1(〔第348便i〕の (Rk1) の列)と自分の重み無し */
  T5: Object.freeze({ centers: D.DECL.C.centers, cols: Object.freeze(['rule', 'w01', 'noSelf']), reads: Object.freeze(['C1', 'C2']), ringActions: D.DECL.C.ringActions, ringZ: D.DECL.C.ringZ }),
  floor: 1e-12,
});
/** 固定の比べる列(リポジトリの中の数 —— 〔第348便d〕の LIT をそのまま読む・合わせない) */
export const LIT = D.LIT;

/* ───────── 在位の形の場から回転の場 ───────── */
/** 源 1 つ(静止・質量 1・半径 1・自転 s ẑ)・受け手の自分の重みの球(中心 = 評価の点・半径 Rself・中心の値 Wii —— Wii 0 は自分の重み無し)・受け手の速度 vRec・背景 W0 → x ↦ Ω(読み C1・C2・C2six・C3) */
export function omegaField(read, { s = 1, Wii = 1.5, Rself = 1, W0 = 0, vRec = [0, 0, 0], Rb = D.DECL.Rb, mut = null } = {}) {
  if (!DECL.reads.includes(read)) throw new RangeError('omegaField: 読みは ' + DECL.reads.join('・'));
  if (!(fin(Wii) && Wii >= 0 && fin(Rself) && Rself > 0 && fin(Rb) && Rb > 0 && fin(s))) throw new RangeError('omegaField: W_ii ≥ 0・R_self > 0・R_b > 0・s');
  const M = new Map();
  return (x) => {
    const k = x[0] + ',' + x[1] + ',' + x[2]; let v = M.get(k); if (v) return v;
    const self = Wii > 0, F = G3.makeField3({ sources: [{ m: 1, R: 1, p: [0, 0, 0], v: [0, 0, 0], spin: [0, 0, s] }], recv: { m: self ? Wii * 2 * Rself / 3 : 1, R: Rself, p: x, v: vRec }, W0, self, mut });
    const e = unit(x);
    if (read === 'C2') v = G3.rot3('W', F, x, { Rb });
    else if (read === 'C2six') v = H.rotOf('P6', F, x, { e, Rb }).Om;
    else { v = G3.rot3('P2', F, x, { e, Rb, lim: false }); if (read === 'C3') v = scl(v, DECL.c3k); }
    M.set(k, v); return v;
  };
}

/* ───────── T1 通過の輪の傾きと 3 つの読み ───────── */
/** 〔第348便i〕の flyRing3 と同じ道・同じ時間の点・同じ分け方。場は makeField3(recv の球は輪の中心 —— recv null は自分の重み無し・W0 は背景) */
export function flyRingMF({ recv = DECL.T1.recv, W0 = 0, Rr, inc }) {
  const Dd = D.DECL.D, gl = H.gaussLegendre(Dd.nT), L = [Math.sin(inc * D2R), 0, Math.cos(inc * D2R)], e1 = [0, 1, 0], e2 = crs(L, e1);
  const pts = Array.from({ length: Dd.nK }, (_, k) => { const ph = 2 * Math.PI * k / Dd.nK; return { ph, xi: add(scl(e1, Rr * Math.cos(ph)), scl(e2, Rr * Math.sin(ph))) }; });
  const del = new Array(Dd.nK).fill(0), intOm = { C1: [0, 0, 0], C2: [0, 0, 0], C2six: [0, 0, 0] }; let scale = 0;
  for (let i = 0; i < gl.x.length; i++) {
    const th = 0.5 * Math.PI * gl.x[i], t = (Dd.b / Dd.v) * Math.tan(th), wq = 0.5 * Math.PI * gl.w[i] * (Dd.b / Dd.v) / (Math.cos(th) * Math.cos(th));
    const rs = [Dd.v * t, Dd.b, 0], F = G3.makeField3({ sources: [{ m: 1, R: 1, p: rs, v: [Dd.v, 0, 0], spin: [0, 0, 0] }],
      recv: recv ? { m: recv.m, R: recv.R, p: [0, 0, 0], v: [0, 0, 0] } : { p: [0, 0, 0], v: [0, 0, 0] }, W0, self: !!recv }), u0 = F.u([0, 0, 0]);
    scale += wq * nrm(u0);
    for (let k = 0; k < Dd.nK; k++) del[k] += wq * dot(sub(F.u(pts[k].xi), u0), L);
    const e = unit(scl(rs, -1));
    intOm.C1 = add(intOm.C1, scl(H.rotOf('P2', F, [0, 0, 0], { e, Rb: Rr }).Om, wq));
    intOm.C2 = add(intOm.C2, scl(G3.rot3('W', F, [0, 0, 0], { Rb: Rr }), wq));
    intOm.C2six = add(intOm.C2six, scl(H.rotOf('P6', F, [0, 0, 0], { e, Rb: Rr }).Om, wq));
  }
  const N = Dd.nK, a1 = 2 * del.reduce((s, x, k) => s + x * Math.cos(pts[k].ph), 0) / N, b1 = 2 * del.reduce((s, x, k) => s + x * Math.sin(pts[k].ph), 0) / N;
  const tiltVec = add(scl(e1, a1 / Rr), scl(e2, b1 / Rr)), fa = DECL.floor * scale / Rr, svv = (v) => (nrm(v) <= fa ? [0, 0, 0] : v), tiltS = svv(tiltVec), tilt = nrm(tiltS);
  const pred = (W) => nrm(svv(crs(L, svv(W))));
  const p = { C1: pred(intOm.C1), C2: pred(intOm.C2), C2six: pred(intOm.C2six) }; p.C3 = DECL.c3k * p.C1;
  const ratio = (x) => (tilt > 0 ? x / tilt : null);
  return { Rr, inc, W0, recv: recv ? { m: recv.m, R: recv.R } : null, tilt, pred: p, vsRing: { C1: ratio(p.C1), C2: ratio(p.C2), C2six: ratio(p.C2six), C3: ratio(p.C3) }, scale };
}
export function table1() {
  const T = DECL.T1, rows = [];
  for (const Rr of T.Rr) for (const inc of T.inc) {
    const a = flyRingMF({ Rr, inc });
    rows.push(Object.assign({ col: 'inPos', Wbg: 0, Wself: null }, a));
    for (const [Wb, Ws] of T.ref) { const r = I3.flyRing3({ Wbg: Wb, Wself: Ws, Rr, inc, rot: 'k1' });
      rows.push({ col: 'k1const', Wbg: Wb, Wself: Ws, Rr, inc, tilt: r.tilt, pred: { C1: r.tilt * (r.cand.P2.vsRing ?? 0), C2: r.tilt * (r.cand.W.vsRing ?? 0) },
        vsRing: { C1: r.cand.P2.vsRing, C2: r.cand.W.vsRing, C2six: null, C3: r.cand.P2.vsRing === null ? null : DECL.c3k * r.cand.P2.vsRing } }); }
  }
  return rows;
}

/* ───────── T2 🛟 と並べる ───────── */
/** 🛟 の正本(第339便a)の要点を取り出す(器が読んで渡す —— lib はファイルを読まない) */
export function rotvertSummary(J) {
  if (!(J && J.run && Array.isArray(J.run.rows) && J.decl && J.candidate && J.book)) throw new RangeError('rotvertSummary: 第339便a の正本の形');
  const rows = J.run.rows.map((r) => ({ steps: r.steps, t: r.t, guide: r.guide, ratioOn: r.ratioOn, ratioOff: r.ratioOff, onGap: r.ratioOn.map((x) => Math.abs(x / r.guide - 1)), offGap: r.ratioOff.map((x) => Math.abs(x - 1)), judgeOk: r.judge ? r.judge.ok : null }));
  return { version: J.version, ok: J.ok, gates: J.gates, key: J.key.name, inDefault: J.key.inDefault, book: J.book.id, form: J.book.decl.form, lambdaBook: J.book.decl.lambda, lambdaNeed: J.candidate.lambdaNeed,
    unitsT: J.decl.units.T, lambdaScale: J.decl.visibility.lambdaScale, rdScale: J.decl.visibility.rdScale, satSpin: J.candidate.satSpin, ReqSat: J.candidate.ReqSat, ReqApp: J.run.ReqApp, rateTol: J.decl.runJudge.rateTol, rows };
}
/** 🛟 の傾きの比の減りの率(正本の 3000 步の目安の比 g と時刻 t から −ln g ÷ t —— 1/s。強さを見えるように大きくした倍 λ の倍で割った値を「目安の強さの率」)と、
 *  候補の回転の大きさ(1/s —— 土星の単位の値 ÷ √(R³/GM))・z の偶奇。在位の形(規則の半径の自分の重み)で */
export function table2(S) {
  const U = D.saturnUnits(), T = DECL.T2, Wrule = ruleWii(U), rows = [];
  const last = S.rows[S.rows.length - 1], rateBook = -Math.log(last.guide) / (last.t * S.unitsT), rateNeed = rateBook / S.lambdaScale;
  for (const key of T.centers) {
    const r = RB.centerKm(key) * 1e3 / U.R, n = Math.pow(r, -1.5), vr = I3.vOrbit(r);
    const out = { key, r, n, rateNeed, rateBook };
    for (const read of ['C1', 'C2']) {
      const f = omegaField(read, { s: U.sDim, Wii: Wrule, Rself: D.DECL.Rb, vRec: vr });
      const o0 = f([r, 0, 0]), zs = T.zOverR.map((z) => { const o = f([r * Math.sqrt(1 - z * z), 0, r * z]), oN = f([r * Math.sqrt(1 - z * z), 0, -r * z]); return { z, par: o[2], perp: Math.hypot(o[0], o[1]), parOdd: 0.5 * (o[2] - oN[2]), perpOdd: 0.5 * (o[0] - oN[0]) }; });
      const magS = nrm(o0) / U.tU;
      out[read] = { mag0: nrm(o0), magPerS: magS, par0: o0[2], vsRateNeed: rateNeed > 0 ? magS / rateNeed : null, vsRateBook: rateBook > 0 ? magS / rateBook : null, vsN: nrm(o0) / n, z: zs };
    }
    rows.push(out);
  }
  return { units: U, Wrule, rows };
}
/** 規則の半径 R_i = Y_k m_i の自分の重みの中心の値 3/(2 Y_k)(土星の単位 —— 質量は土星・長さは土星の半径) */
export function ruleWii(U = D.saturnUnits()) { const S = RB.srcOf('saturn'), yk = G3.YK * S.m / U.R; return 1.5 / yk; }

/* ───────── T3 向きが入れ替わる行の切り分け ───────── */
/** 受け手の速度の倍 λ の寄せる力(高さ ±z の格子)。寄せる力は場について線形 —— λ の一次式 p(λ) = p(0) + λ (p(1) − p(0)) を λ = −1 の直の値で照らす */
export function swapRows() {
  const T = DECL.T3, A = D.DECL.A, rows = [];
  const cfgs = T.den.map(([Wb, Ws]) => ({ col: 'k1', Wbg: Wb, Wself: Ws, Rself: T.Rself })).concat([{ col: 'inPos', Wbg: 0, Wself: 1.5 * T.inPos.m / T.inPos.R, Rself: T.inPos.R }]);
  for (const c of cfgs) for (const cand of T.cands) for (const d of A.d) {
    const read = cand === 'P2' ? 'C1' : 'C2', vo = I3.vOrbit(d), f = (lam) => omegaField(read, { s: 1, Wii: c.Wself, Rself: c.Rself, W0: c.Wbg, vRec: scl(vo, lam) });
    const fs = T.lams.map(f);
    for (const action of A.actions) {
      const P = fs.map((fl) => D.pullSummary(fl, { action, d, zs: A.z }));
      const p0 = P[0].pulls.concat(P[0].pullsNeg), p1 = P[1].pulls.concat(P[1].pullsNeg), pm = P[2].pulls.concat(P[2].pullsNeg);
      let lin = 0, sc = 0; for (let k = 0; k < p0.length; k++) { lin = Math.max(lin, Math.abs(pm[k] - (2 * p0[k] - p1[k]))); sc = Math.max(sc, Math.abs(p0[k]), Math.abs(p1[k])); }
      // 受け手の速度の項の寄与が丸めの床(同じ高さの尺度 × 1e-6)以下の高さは境界を書かない(W₀ + W_ii = 0 の行 —— 速度の項は一様のずれで回転を作らない)
      const lamStar = p0.map((x, k) => (Math.abs(x - p1[k]) > 1e-6 * Math.max(Math.abs(x), Math.abs(p1[k])) ? x / (x - p1[k]) : null));
      const inUnit = lamStar.filter((x) => x !== null && x > 0 && x <= 1), inRetro = lamStar.filter((x) => x !== null && x < 0 && x >= -1);
      const sOverN = Math.pow(d, 1.5), crit = lamStar.map((x) => (x !== null && x !== 0 ? sOverN / x : null));
      rows.push({ col: c.col, Wbg: c.Wbg, Wself: c.Wself, cand, d, action, dirOff: P[0].dir, dirOn: P[1].dir, dirRetro: P[2].dir, swap: P[0].dir !== P[1].dir, swapRetro: P[0].dir !== P[2].dir,
        nHeights: p0.length, nFlipUnit: inUnit.length, nFlipRetro: inRetro.length, lamStarMin: inUnit.length ? Math.min(...inUnit) : null, lamStarMax: inUnit.length ? Math.max(...inUnit) : null,
        sOverN, critMinPos: (() => { const v = crit.filter((x) => x !== null && x > 0); return v.length ? Math.min(...v) : null; })(), critMaxPos: (() => { const v = crit.filter((x) => x !== null && x > 0); return v.length ? Math.max(...v) : null; })(),
        linRel: sc > 0 ? lin / sc : 0 });
    }
  }
  return rows;
}
/** 入れ替わる行の条件の集計(半径 ÷ 源の半径・(W₀ + W_ii)・候補・作用) */
export function swapSummary(rows) {
  const by = (kf) => { const m = new Map(); for (const r of rows) { const k = kf(r); const v = m.get(k) || { n: 0, swap: 0, retro: 0 }; v.n++; if (r.swap) v.swap++; if (r.swapRetro) v.retro++; m.set(k, v); } return [...m.entries()].map(([k, v]) => Object.assign({ key: k }, v)); };
  const k1 = rows.filter((r) => r.col === 'k1');
  return { k1Swap: k1.filter((r) => r.swap).length, k1N: k1.length, byDen: by((r) => r.col + '|' + r.Wbg + '|' + r.Wself), byD: by((r) => r.col + '|' + r.d), byCand: by((r) => r.col + '|' + r.cand), byAction: by((r) => r.col + '|' + r.action),
    linMax: Math.max(...rows.map((r) => r.linRel)) };
}

/* ───────── T4 粒子の輪(輪の傾き・復元の成分・厚み)───────── */
function ringInit(N, ph0, T) {
  const ci = Math.cos(T.i0 * D2R), si = Math.sin(T.i0 * D2R), vc = Math.pow(T.r0, -0.5), P = [];
  for (let k = 0; k < N; k++) {
    const ph = 2 * Math.PI * k / N + ph0, dz = T.h0 * Math.sin(3 * ph + ph0), dvz = T.h0 * Math.pow(T.r0, -1.5) * Math.cos(3 * ph + ph0);
    const xl = [T.r0 * Math.cos(ph), T.r0 * Math.sin(ph), dz], vl = [-vc * Math.sin(ph), vc * Math.cos(ph), dvz];
    const rx = (a) => [a[0], a[1] * ci - a[2] * si, a[1] * si + a[2] * ci];   // x 軸のまわりに i₀ 傾ける
    P.push({ x: rx(xl), v: rx(vl) });
  }
  return P;
}
/** 粒子 1 つの引きずりの速度(在位の形 —— 受け手の球 m 1・R 1 は粒子の位置・受け手の速度は粒子の速度) */
export function ringDrag(cfg, x, v, s, mut = null) {
  if (cfg === 'off') return [0, 0, 0];
  const spin = cfg === 'trans' ? 0 : s, mm = cfg === 'spin' ? 'absVel' : mut;
  return G3.makeField3({ sources: [{ m: 1, R: 1, p: [0, 0, 0], v: [0, 0, 0], spin: [0, 0, spin] }], recv: { m: 1, R: 1, p: x, v }, mut: mm }).u(x);
}
function ringMeasure(P, U) {
  const N = P.length, cm = scl(P.reduce((s, p) => add(s, p.x), [0, 0, 0]), 1 / N), L = P.reduce((s, p) => add(s, crs(p.x, p.v)), [0, 0, 0]), Lh = unit(L);
  let s2 = 0, rest = 0; for (let k = 0; k < N; k++) { const zr = dot(sub(P[k].x, cm), Lh); s2 += zr * zr; rest += -sgn(zr) * dot(U[k], Lh); }
  return { tilt: angDeg(Lh, [0, 0, 1]), rms: Math.sqrt(s2 / N), restore: rest / N };
}
export function ringRun(cfg, { mut = null } = {}) {
  const T = DECL.T4, N = cfg === 'altN' ? T.Nalt : T.N, ph0 = cfg === 'altPhase' ? T.ph0alt : T.ph0, per = cfg === 'halfStep' ? 2 * T.perOrbit : T.perOrbit, base = cfg === 'both' || cfg === 'halfStep' || cfg === 'altN' || cfg === 'altPhase' ? 'both' : cfg;
  const nOrb = Math.pow(T.r0, -1.5), dt = 2 * Math.PI / nOrb / per, P = ringInit(N, ph0, T);
  const acc = (x) => { const r = nrm(x); return scl(x, -1 / (r * r * r)); };
  const drag = (x, v) => ringDrag(base, x, v, T.s, mut);
  // 厚みは 1 公転の步ごとの RMS の平均も書く(公転の周波数が引きずりで変わると、同じ位相の点で読む RMS は位相の差を含む)
  const series = []; let acc2 = 0, nAcc = 0;
  const snap = (step) => { const U = P.map((p) => drag(p.x, p.v)); const m = ringMeasure(P, U); series.push(Object.assign({ orbit: step / per, rmsOrbitMean: nAcc > 0 ? acc2 / nAcc : m.rms }, m)); acc2 = 0; nAcc = 0; };
  snap(0);
  for (let step = 1; step <= T.orbits * per; step++) {
    for (const p of P) {
      const f = (x, v) => [add(v, drag(x, v)), acc(x)];
      const [k1x, k1v] = f(p.x, p.v), [k2x, k2v] = f(add(p.x, scl(k1x, dt / 2)), add(p.v, scl(k1v, dt / 2))), [k3x, k3v] = f(add(p.x, scl(k2x, dt / 2)), add(p.v, scl(k2v, dt / 2))), [k4x, k4v] = f(add(p.x, scl(k3x, dt)), add(p.v, scl(k3v, dt)));
      p.x = add(p.x, scl(add(add(k1x, scl(k2x, 2)), add(scl(k3x, 2), k4x)), dt / 6)); p.v = add(p.v, scl(add(add(k1v, scl(k2v, 2)), add(scl(k3v, 2), k4v)), dt / 6));
    }
    acc2 += ringMeasure(P, P.map(() => [0, 0, 0])).rms; nAcc++;
    if (step % per === 0) snap(step);
  }
  const a = series[0], b = series[series.length - 1];
  return { cfg, N, ph0, per, series, dTilt: b.tilt - a.tilt, rmsRatio: b.rms / a.rms, rmsMeanRatio: b.rmsOrbitMean / series[1].rmsOrbitMean, restoreMean: series.reduce((s, x) => s + x.restore, 0) / series.length };
}
export function table4() { return DECL.T4.cfgs.map((c) => ringRun(c)); }

/* ───────── T5 厚みの帳簿へ候補の回転を入れる口 ───────── */
/** 候補の回転の場を〔第348便d〕の器(satRow —— 点・corV の向きが変わる高さと K・pullSummary —— 輪の corS・drag90)へ入れ、
 *  K を第338便d の線形の帳簿に ν_z² = n² (1 + K) として入れた高さ(P は厚み 10 m に要る率・Γ は物差しの 1/(1e7 年)—— 合わせない: 入れる前の高さは 10 m) */
export function table5() {
  const U = D.saturnUnits(), T = DECL.T5, Wrule = ruleWii(U), S = RB.srcOf('saturn'), rows = [];
  const wOf = (col) => (col === 'rule' ? Wrule : col === 'w01' ? 0.1 : 0);
  for (const col of T.cols) for (const read of T.reads) for (const key of T.centers) {
    const r = RB.centerKm(key) * 1e3 / U.R, f = omegaField(read, { s: U.sDim, Wii: wOf(col), Rself: D.DECL.Rb, vRec: I3.vOrbit(r) });
    const sr = D.satRow(f, key, U), rPhys = r * U.R, nPhys = RB.nOf(S, rPhys), Gam = 1 / (RB.DECL.t1.tYardYr * RB.YR), P = RB.pNeed(S, rPhys, Gam);
    const nu2 = 1 + sr.K, led = nu2 > 0 ? RB.linearLedger({ P, Gam, nu: nPhys * Math.sqrt(nu2) }) : null;
    const ring = T.ringActions.map((action) => { const Pp = D.pullSummary(f, { action, d: r, zs: T.ringZ, zRef: -1 }), b = Pp.zStarPos; return { action, dir: Pp.dir, zStarPos: b, HstarM: b ? [2 * b[0] * rPhys, 2 * b[1] * rPhys] : null }; });
    rows.push({ col, Wii: wOf(col), read, key, dir: sr.dir, K: sr.K, zStar: sr.zStar, HstarM: sr.Hstar, HstarOver10m: sr.HstarOver10m, ledgerHm: led ? led.H : null, ledgerOver10m: led ? led.H / LIT.thick10m : null, ring });
  }
  return { units: U, Wrule, rows };
}

/* ───────── 零試験(T6)───────── */
export function pureScenes() {
  const S = {}, C = DECL.common;
  // ① 共通の点検の数(源の通過 —— 在位の形)
  { const recv = { m: 1, R: 1, p: [4, 0, 0], v: [0, 0, 0] }, mk = (o = {}) => G3.makeField3(Object.assign({ sources: [{ m: 1, R: 1, p: [0, 0, 0], v: o.v || [0, 1, 0], spin: [0, 0, 0] }], recv: Object.assign({}, recv, o.recv || {}) }, o.f || {}));
    const dia = (F, e, rc = [4, 0, 0]) => scl(crs(e, sub(F.u(add(rc, scl(e, C.h))), F.u(sub(rc, scl(e, C.h))))), 1 / (2 * C.h));
    const six = (F, rc = [4, 0, 0]) => scl(add(add(dia(F, [1, 0, 0], rc), dia(F, [0, 1, 0], rc)), dia(F, [0, 0, 1], rc)), 0.5);
    const F = mk(); S.cx = dia(F, [1, 0, 0])[2]; S.c6 = six(F)[2]; S.cw = G3.rot3('W', F, [4, 0, 0], { Rb: C.h })[2];
    S.cFlip = dia(mk({ v: [0, -1, 0] }), [1, 0, 0])[2] + S.cx;
    S.cLine = nrm(dia(mk({ v: [1, 0, 0] }), [1, 0, 0])) + nrm(six(mk({ v: [1, 0, 0] }))) + nrm(six(mk({ v: [0, 0, 0] })));
    S.cNoSelf = nrm(six(mk({ f: { self: false } })));
    { const Fa = G3.makeField3({ sources: [{ m: 1, R: 1, p: [0, 0, 0], v: [3, -1, 1], spin: [0, 0, 0] }], recv: { m: 1, R: 1, p: [4, 0, 0], v: [3, -2, 1] } }); S.cGal = Math.abs(dia(Fa, [1, 0, 0])[2] - S.cx) + Math.abs(six(Fa)[2] - S.c6); }
    // 剛体回転と純粋なずれ(線形の場を直に)
    const lin = (fn) => ({ u: fn });
    const rig = lin((x) => crs([1, 2, 3], x)), sh = lin((x) => [x[1], x[0], 0]);
    S.rigSix = nrm(sub(six(rig, [0.3, -0.2, 0.5]), [1, 2, 3])); S.rigX = nrm(sub(dia(rig, [1, 0, 0], [0.3, -0.2, 0.5]), [0, 2, 3]));
    S.shX = dia(sh, [1, 0, 0], [0.2, 0.1, 0])[2]; S.shSix = nrm(six(sh, [0.2, 0.1, 0]));
    // 輪の傾き(δ = L̂·(J ξ))は、対称のずれ u = (z, 0, x) で輪 L̂ = ẑ が傾くが、球の剛体回転(6 点の平均)は 0 —— (C1)(x の直径)の言う傾きは輪の傾きと同じ
    const sx = lin((x) => [x[2], 0, x[0]]), Lr = [0, 0, 1];
    let a1 = 0, b1 = 0; const nK = 32; for (let k = 0; k < nK; k++) { const ph = 2 * Math.PI * k / nK, xi = [Math.cos(ph), Math.sin(ph), 0], dd = dot(Lr, sx.u(xi)); a1 += 2 * dd * Math.cos(ph) / nK; b1 += 2 * dd * Math.sin(ph) / nK; }
    S.shRingTilt = Math.hypot(a1, b1); S.shRingC1 = nrm(crs(Lr, dia(sx, [1, 0, 0], [0, 0, 0]))); S.shRingC2 = nrm(six(sx, [0, 0, 0])); }
  // ② makeField3 の回転の場 = 〔第348便i〕の geo3OmegaField の (Rk1)(自分の重みの K1 の球・受け手の速度を引く)
  //   (C1) は同じ式の同じ差分(丸めの内)・(C2) は解析の勾配(枝 h)と 5 点の差分の勾配(〔第348便i〕)の差の内
  { const m = { C1: 0, C2: 0 }; for (const [Wb, Ws] of [[0, 0.1], [0.1, 0.1], [0, 10]]) for (const [read, cand] of [['C1', 'P2'], ['C2', 'W']]) for (const x of [[3, 0, 0.03], [10, 0, -1], [3.2, 0.4, 0.3]]) {
      const vr = I3.vOrbit(nrm(x)), a = omegaField(read, { s: 1, Wii: Ws, Rself: I3.DECL.k1.Rself, W0: Wb, vRec: vr })(x), b = I3.geo3OmegaField(cand, { rot: 'k1', Wbg: Wb, Wself: Ws, vRec: vr })(x);
      m[read] = Math.max(m[read], nrm(sub(a, b)) / Math.max(nrm(b), 1e-300)); }
    S.vs348iC1 = m.C1; S.vs348iC2 = m.C2; }
  // ③ 通過の輪: 在位の形の (C1) ÷ 輪の傾き ≈ 1・(C2) ≈ ½・(C2six) = (C2) の一次(差は (R_r/b)² の桁)・自分の重みも背景も無いと 0
  { const a = flyRingMF({ Rr: 0.1, inc: 30 }), z = flyRingMF({ recv: null, Rr: 0.1, inc: 30 });
    S.flyC1 = a.vsRing.C1; S.flyC2 = a.vsRing.C2; S.flySix = a.vsRing.C2six; S.flyZero = z.tilt + z.pred.C1 + z.pred.C2; }
  // ④ 寄せる力は受け手の速度の倍について線形(λ = −1 の直の値 = 2 p(0) − p(1))
  { const d = 3, vo = I3.vOrbit(d), f = (lam) => omegaField('C2', { s: 1, Wii: 0.1, Rself: 0.1, vRec: scl(vo, lam) });
    const g = (lam) => D.ringPull(f(lam), { action: 'corS', d, zOverR: 0.01 }).pull, p0 = g(0), p1 = g(1), pm = g(-1); S.linear = Math.abs(pm - (2 * p0 - p1)) / Math.max(Math.abs(p0), Math.abs(p1)); }
  // ⑤ 粒子の輪: 引きずり無しは L の向きが保たれる(重力だけ —— 3 公転・RK4)/源の回転の符号を反転すると回転だけの列の引きずりの速度が粒子ごとに符号だけ反転
  { const T = DECL.T4, P = ringInit(T.N, 0, T); const L0 = unit(P.reduce((s, p) => add(s, crs(p.x, p.v)), [0, 0, 0]));
    S.offTiltDeg = Math.abs(ringRun('off').dTilt);
    const U1 = P.map((p) => ringDrag('spin', p.x, p.v, T.s)), U2 = P.map((p) => ringDrag('spin', p.x, p.v, -T.s));
    let fl = 0, mag = 0; for (let k = 0; k < P.length; k++) { fl = Math.max(fl, nrm(add(U1[k], U2[k]))); mag = Math.max(mag, nrm(U1[k])); }
    S.mutRot = { mag, flip: fl / Math.max(mag, 1e-300) }; S.L0z = L0[2]; }
  // ⑥ 入力の拒否
  S.rejects = [() => omegaField('X'), () => omegaField('C1', { Wii: -1 }), () => omegaField('C1', { Rb: 0 }), () => rotvertSummary({}), () => G3.makeField3({ sources: [], recv: null })]
    .map((fn) => { try { fn(); return false; } catch (err) { return err instanceof RangeError; } });
  return S;
}
export function pureGates(S) {
  const C = DECL.common, near = (a, b) => Math.abs(a - b) <= C.tol;
  return {
    common: near(S.cx, C.x) && near(S.c6, C.six) && near(S.cw, C.w) && Math.abs(S.cFlip) < 1e-12 && S.cLine < 1e-12 && S.cNoSelf < 1e-12 && S.cGal < 1e-12,
    rigidShear: S.rigSix < 1e-12 && S.rigX < 1e-12 && Math.abs(S.shX - 1) < 1e-12 && S.shSix < 1e-12,
    ringVsSphere: Math.abs(S.shRingTilt - 1) < 1e-12 && Math.abs(S.shRingC1 - 1) < 1e-12 && S.shRingC2 < 1e-12,
    vs348i: S.vs348iC1 < 1e-12 && S.vs348iC2 < 1e-4,
    fly: Math.abs(S.flyC1 - 1) < 2e-2 && Math.abs(S.flyC2 - 0.5) < 2e-2 && Math.abs(S.flySix - S.flyC2) < 2e-2 && S.flyZero === 0,
    linear: S.linear < 1e-8,
    ring: S.offTiltDeg < 1e-9 && S.mutRot.mag > 1e-6 && S.mutRot.flip < 1e-12,
    rejects: S.rejects.length === 5 && S.rejects.every(Boolean),
  };
}
