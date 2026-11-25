// 第353便y(原仮定者の回答(2026-11-25 —— 第151報)AN1045・統括の検証項目 R489):
//   **土星の環の「受け手の重み」—— 輪の周りの粒子の重み(面密度)を場の式の分母に足す形と、公転面の集まりを内側の惑星と巨大な惑星に分けて読む列 —— 診断だけ**
//   (器 tests/exp-w353y-ringsurf.mjs と QA behavior.ringsurf353y・docs.ringsurf353y が読む —— html を読まない・ファイルを読まない・状態を持たない)。
//   〔第353便k〕の結果: 回答の基準(引きずる側 = 規則の半径 + 扁平率・引きずられる側 = 観測半径 × 構造の係数)の輪の場では、受け手(環の粒子 1 つ)の自分の重みは
//   土星の重みの 1e-10 倍以下で、率は粒子の大きさで動かない。本 lib は、受け手を「粒子 1 つ」でなく「輪の周りの粒子の集まり」と読み、
//   受け手の位置での周りの粒子の重みの和(面密度 Σ × 面積 × 既存の重みの核 K1 —— 〔第312便a〕の Kball)を場の分母(W = W₀ + extraW + 自分の重み + 源の重み)の extraW に入れる。
//   新しい式は足さない: 重みの核は既存の Kball・場は〔第353便d〕の makeFieldOb・作りは〔第353便k〕の diskStd(F2)・ringStdOm(F1)と同じ(extraW の口だけを開ける)。
//   面密度 Σ はノブ(値は未照合)の格子(1・10・100・1e3・1e4 kg/m²)で振る。比べる列として〔第338便d〕の LIT.regions の Σ(文献の値・未照合)を並べる。
//   アプリの引きずり・自転・内蔵の本・受理器・physics の鍵は変えない。既存の lib は呼ぶだけ(本文と版は変えない):
//   第353便k(diskStd・axStd・ringStdOm・recvOf・obOf・planeStd・DECL)・第353便d(makeFieldOb)・第353便h(yardOfRate・DECL)・第351便j(ringBasis・normalAt・ringRate)・
//   第352便s(saturnSpin・tiltedNormal・ringRates・ASYR)・第352便k(srcRadius・spinRot・vec)・第352便za(DECL —— 公転面の物差し)・第352便c(refAxis・angDeg)・第351便c(pairInput・perpOf)・
//   第348便h(rot3・YK)・第348便d(saturnUnits・DECL)・第348便c(massOf・radiusOf)・第338便d(centerKm・srcOf・LIT)・第312便a(Kball)・第347便e(t1Table・geometry)。
//
// ■ 物差し: 環は〔第353便h〕のまま(第348便d の LIT —— 1e7 年で傾きが e 分の 1 —— 文献の値・未照合)。公転面は〔第352便za〕の題「公転面の集まり」(30° → 7° の 23°・太陽系の年齢)。
// ■ 閉じた形(場の式から —— 新しい式ではない): 受け手の中心での場の勾配 J = dP/W − P⊗dW/W²。自分の重み・extraW は中心で勾配 0 なので、点の読み(W)の率は
//   v(W) = α/W − β/W²(α・β は自分の重みと extraW に依らない)。分母 W が増えると率が下がるのは dv/dW = (2β/W − α)/W² < 0 のとき —— 上がる形は 2β > α W のときだけ。
// ■ 言わないこと: 環の傾きの答え・面密度の値・円盤引きずりの型とは書かない。この場・この置き方・このノブでは、の表。
import * as KS from './lib-w353k-ringstd.mjs';
import * as H from './lib-w353h-ringdisk.mjs';
import * as OB from './lib-w353d-srcoblate.mjs';
import * as RJ from './lib-w351j-ringstep.mjs';
import * as S2 from './lib-w352s-satring.mjs';
import * as K from './lib-w352k-spinform.mjs';
import * as Z from './lib-w352za-sconseq.mjs';
import * as CR from './lib-w352c-refaxis.mjs';
import * as SP from './lib-w351c-srcparts.mjs';
import * as G3 from './lib-w348h-axisgeo3.mjs';
import * as DA from './lib-w348d-diskaxis.mjs';
import * as C from './lib-w348c-axisbalance.mjs';
import * as RB from './lib-w338d-ringbook.mjs';
import * as DK from './lib-w312a-decay.mjs';
import * as E from './lib-w347e-spintorque.mjs';

export const LIB_VERSION = 'w353y-ringsurf-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const D2R = Math.PI / 180;
const { dot, nrm, scl, add, unit } = K.vec;
const rel = (a, b) => Math.abs(a - b) / Math.max(Math.abs(b), 1e-300);
const YR = 365.25 * 86400;

/* ───────── 宣言(走らせた格子と物差しの記録 —— 式の形の宣言ではない)───────── */
export const DECL = Object.freeze({
  centers: KS.DECL.centers, tiltDeg: 1,
  /** 面密度 Σ(kg/m²)の格子 —— ノブ(値は未照合)。格子の外の走査(上がるか下がるかを見る)は sigmaWide */
  sigmas: Object.freeze([1, 10, 100, 1e3, 1e4]), sigmaWide: Object.freeze([1e6, 1e8, 1e10, 1e12, 1e14]),
  /** 周りの粒子の重みの和を作る区切り: 区分の幅を径の向きに N 個・周の向きは同じ長さの升(升は面積の等しい K1 の球 —— 既存の重みの核) */
  surfN: 48, surfNcheck: 96,
  reads: Object.freeze(['C2', 'C1']), frames: Object.freeze(['F2', 'F1']),
  /** F1(〔第352便s〕の輪)の作りに在る読みは C2 だけ(〔第353便k〕の axStd と同じ)—— C1 の欄は「作りに無い」 */
  readsF1: Object.freeze(['C2']),
  /** 受け手の代表(〔第353便k〕の recvMain —— 粒子 1 m・c_R 1 —— ノブ(値は未照合)) */
  recvMain: KS.DECL.recvMain,
  /** 輪全体を 1 つの剛体の輪として読む受け手の構造の係数(半径 = 輪の半径 × c_R —— ノブ(値は未照合)) */
  rigidCRs: Object.freeze([0.01, 0.1, 1]),
  /** 公転面の集まり(〔第353便k〕の planeStd の作り): 内側(水星〜火星)と巨大な惑星(木星〜海王星)・基準軸 L と eq・背景 (N+) */
  inner: Object.freeze(['Mercury', 'Venus', 'Earth', 'Mars']), giant: Object.freeze(['Jupiter', 'Saturn', 'Uranus', 'Neptune']),
  planeAxes: Object.freeze(['L', 'eq']), planeCRs: Object.freeze([1, 0.1]),
  /** 零試験の比べる数(〔第353便k〕の正本 —— 表 3 の主 (O0)(F2) の最小と最大) */
  anchor: Object.freeze({ kLo: 6.59e-6, kHi: 2.59e-5 }),
  judge: '「物差しの桁」= 率 ÷ 物差しが 0.1〜10 の内(正の向き)・逐語の表は有効数字 3 桁・零試験は相対 1e-9 の床',
});

/* ───────── 区分の幅(〔第338便d〕の LIT.regions —— 文献の値・未照合)───────── */
/** 区分 key の内縁・外縁(m)と、比べる列の面密度(LIT.regions の Σ —— 文献の値・未照合) */
export function regionOf(key) {
  const R = RB.LIT.regions.find((g) => g.key === key);
  if (!R) throw new RangeError('regionOf: 区分は ' + RB.LIT.regions.map((g) => g.key).join('・'));
  return { key, r0: R.r0 * 1e3, r1: R.r1 * 1e3, rc: RB.centerKm(key) * 1e3, dr: (R.r1 - R.r0) * 1e3, sigmaLit: R.sigma };
}

/* ───────── 周りの粒子の重みの和(SI: kg/m)───────── */
/**
 * 面密度 sigma の平らな輪(半径 r の周りに幅 dr —— 内縁 r − dr/2・外縁 r + dr/2)が、点 at(既定 = 輪の面の上・半径 r)に作る重みの和 Σ_i m_i K(d_i, R_i)。
 * 升は径の向きに N 個・周の向きに同じ長さ(2π r_j ÷ Δr を丸めた数)。升の質量 = sigma × 面積・升の球の半径 = √(面積 ÷ π)(既存の核 K1 —— 中の値は (3R² − d²)/(2R³))。
 * kernel は { kind: 'ball', al: 1 } だけ(既存の Kball の α 1)。
 */
export function surfW({ sigma, r, dr, N = DECL.surfN, kernel = { kind: 'ball', al: 1 }, at = null }) {
  if (!(fin(sigma) && sigma >= 0)) throw new RangeError('surfW: Σ ≥ 0');
  if (!(fin(r) && r > 0 && fin(dr) && dr > 0 && dr < 2 * r)) throw new RangeError('surfW: r > 0・0 < dr < 2r');
  if (!(Number.isInteger(N) && N >= 2)) throw new RangeError('surfW: N は 2 以上の整数');
  if (!(kernel && kernel.kind === 'ball' && kernel.al === 1)) throw new RangeError('surfW: 核は ball(α 1)だけ');
  const p = at === null ? [r, 0, 0] : at;
  if (sigma === 0) return { W: 0, cells: 0, perSigma: null };
  const h = dr / N; let W = 0, cells = 0;
  for (let i = 0; i < N; i++) {
    const rj = r - dr / 2 + (i + 0.5) * h, M = Math.max(4, Math.round(2 * Math.PI * rj / h)), dph = 2 * Math.PI / M, area = rj * dph * h, Rc = Math.sqrt(area / Math.PI), m = sigma * area;
    for (let j = 0; j < M; j++) {
      // 升の中心: 受け手の向き(φ 0)から半升ずらす —— 受け手が升の中心に乗るのは径の向きの真ん中の升の φ 0 だけにしない(偶数の N では升の境)
      const ph = (j + 0.5) * dph, x = [rj * Math.cos(ph) - p[0], rj * Math.sin(ph) - p[1], -p[2]];
      W += m * DK.Kball(1, nrm(x), Rc); cells++;
    }
  }
  return { W, cells, perSigma: W / sigma };
}
/** 区分 key の周りの粒子の重みの和(区分の幅 —— 受け手は区分の中心の半径)。sigma を省くと LIT.regions の Σ(文献の値・未照合) */
export function surfOf(key, sigma = null, N = DECL.surfN) {
  const g = regionOf(key), s = sigma === null ? g.sigmaLit : sigma;
  // 受け手は centerKm(F 環は芯 140 180 km —— 区分の真ん中と同じ)。輪は区分の真ん中を中心に幅 dr
  const mid = 0.5 * (g.r0 + g.r1), w = surfW({ sigma: s, r: mid, dr: g.dr, N, at: [g.rc, 0, 0] });
  return { ...w, sigma: s, key, rc: g.rc, dr: g.dr };
}

/* ───────── (F2) 円盤引きずりの側の作り + 周りの粒子の重み ───────── */
/**
 * 〔第353便k〕の diskStd と同じ作り(土星の単位)に、分母の extraW(周りの粒子の重み W_surf を土星の単位に —— × R_obs ÷ M)を足す。
 * extraWSI(kg/m)を直に渡すことも可(閉じた形の照合用)。recv は diskStd と同じ形か { kind: 'rigid', m, R }(輪全体を剛体の受け手に —— SI)。
 * 戻り: { raiseOverEpsPerS, yard, perpPerS, cos, A0u, wSu, Wsu, den: { src, one, surf }(土星の単位) }
 */
export function diskSurf(key, { sigma = 0, src = 'rule', ob = 'O0', recv = DECL.recvMain, read = 'C2', tiltDeg = DECL.tiltDeg, extraWSI = null, N = DECL.surfN } = {}) {
  if (!DECL.reads.includes(read)) throw new RangeError('diskSurf: 読みは C1・C2');
  if (!(fin(tiltDeg) && tiltDeg > 0 && tiltDeg < 90)) throw new RangeError('diskSurf: 0 < 傾き < 90');
  const U = DA.saturnUnits(), Sat = RB.srcOf('saturn'), r0 = RB.centerKm(key) * 1e3 / U.R;
  const Rs = src === 'rule' ? G3.YK * Sat.m / U.R : src === 'obs' ? 1 : null;
  if (Rs === null) throw new RangeError('diskSurf: 源の半径は rule・obs');
  const o0 = KS.obOf('Saturn', ob, src), obU = o0 ? { ...o0, Rq: o0.Rq / U.R } : null, Rb = DA.DECL.Rb;
  let recvU;
  if (recv && recv.kind === 'rigid') {
    if (!(fin(recv.m) && recv.m > 0 && fin(recv.R) && recv.R > 0)) throw new RangeError('diskSurf: 剛体の受け手 m > 0・R > 0');
    recvU = { m: recv.m / Sat.m, R: recv.R / U.R };
  } else {
    const rv = KS.recvOf(recv);
    recvU = rv.kind === 'rule' ? { m: DA.DECL.Rb * 2 / 3 * (1.5 / (G3.YK * Sat.m / U.R)), R: DA.DECL.Rb } : { m: rv.m / Sat.m, R: rv.R / U.R };
  }
  const WsSI = extraWSI !== null ? extraWSI : (sigma > 0 ? surfOf(key, sigma, N).W : 0);
  if (!(fin(WsSI) && WsSI >= 0)) throw new RangeError('diskSurf: extraW ≥ 0');
  const Wsu = WsSI * U.R / Sat.m;
  const L = RJ.normalAt(tiltDeg, -90, 'pro'), l = unit(L), [e1, e2] = RJ.ringBasis(l), Nr = RJ.DECL.sat.N;
  let Om = [0, 0, 0];
  for (let j = 0; j < Nr; j++) {
    const ph = 2 * Math.PI * (j + 0.5) / Nr, x = scl(add(scl(e1, Math.cos(ph)), scl(e2, Math.sin(ph))), r0);
    const F = OB.makeFieldOb({ sources: [{ m: 1, R: Rs, p: [0, 0, 0], v: [0, 0, 0], spin: [0, 0, U.sDim] , ob: obU }], recv: { m: recvU.m, R: recvU.R, p: x, v: [0, 0, 0] }, W0: 0, extraW: Wsu, self: true });
    const v = read === 'C2' ? G3.rot3('W', F, x, { Rb }) : G3.rot3('P2', F, x, { e: unit(x), Rb, lim: false });
    Om = add(Om, scl(v, 1 / Nr));
  }
  const q = RJ.ringRate(L, Om, { kTilt: 1, kPrec: 0 }), A0u = recvU.m * DK.Kball(1, 0, recvU.R), wSu = DK.Kball(1, r0, Rs);
  return { key, src, ob, read, sigma, raiseOverEpsPerS: q.raiseOverEps / U.tU, yard: H.yardOfRate(q.raiseOverEps / U.tU), perpPerS: q.perp / U.tU, cos: q.cos,
    A0u, wSu, Wsu, den: { src: wSu, one: A0u, surf: Wsu } };
}

/* ───────── (F1) 軸引きずりの (S) の作り + 周りの粒子の重み ───────── */
/** 〔第353便k〕の axStd と同じ作り(太陽の重みを分母に)に、周りの粒子の重み(SI)を extraW に足す(ringStdOm の extraW の口 = 太陽の重み + W_surf) */
export function axSurf(T1, GEO, key, { sigma = 0, src = 'rule', ob = 'O0', recv = DECL.recvMain, tiltDeg = DECL.tiltDeg, extraWSI = null, N = DECL.surfN } = {}) {
  if (!['rule', 'obs'].includes(src)) throw new RangeError('axSurf: 源の半径は rule・obs');
  if (!(fin(tiltDeg) && tiltDeg > 0 && tiltDeg < 90)) throw new RangeError('axSurf: 0 < 傾き < 90');
  const tSrc = src === 'rule' ? 0 : 1, sp = S2.saturnSpin(T1, GEO), Ms = C.massOf('Saturn'), Rs = K.srcRadius('Saturn', tSrc), r = RB.centerKm(key) * 1e3;
  const wSun = K.spinRot(T1, GEO, 'Saturn', 'Sun', { part: 'S', tSrc }).wS;
  let rm, rR;
  if (recv && recv.kind === 'rigid') { if (!(fin(recv.m) && recv.m > 0 && fin(recv.R) && recv.R > 0)) throw new RangeError('axSurf: 剛体の受け手 m > 0・R > 0'); rm = recv.m; rR = recv.R; }
  else { const rv = KS.recvOf(recv); rm = rv.m; rR = rv.R; }
  const Ws = extraWSI !== null ? extraWSI : (sigma > 0 ? surfOf(key, sigma, N).W : 0);
  if (!(fin(Ws) && Ws >= 0)) throw new RangeError('axSurf: extraW ≥ 0');
  const L0 = sp.ax, L1 = S2.tiltedNormal(sp.ax, tiltDeg);
  const R = KS.ringStdOm({ Ms, Rs, spinVec: sp.vec, L: L1, r, extraW: wSun + Ws, recvM: rm, recvR: rR, ob: KS.obOf('Saturn', ob, src) }), q = S2.ringRates(L1, R.Om, { ref: L0 });
  const eps = tiltDeg * D2R, rpy = q.raiseAsYr === null ? null : q.raiseAsYr / 206264.80624709636;
  return { key, src, ob, sigma, raiseAsYr: q.raiseAsYr, yard: rpy === null ? null : rpy / eps * H.DECL.tYardYr, perpAsYr: q.perpAsYr, A0: R.A0, wS: R.wS, wSun, Ws,
    den: { src: R.wS, sun: wSun, one: R.A0, surf: Ws } };
}

/* ───────── 1 行(区分 × 面密度 × 受け手 × 置き方)───────── */
/**
 * ringSurfRow(key, { sigma, recv, src, ob, read, frame, T1, GEO }) → { yard(率 ÷ 物差し), yard0(Σ 0), ratio(yard ÷ yard0), den(分母の内訳 —— 源・粒子 1 つ・周りの粒子〔F1 は太陽も〕), surfOverSrc }
 * F1 の読みは C2 だけ(C1 は null を返す —— 作りに無い)。
 */
export function ringSurfRow(key, { sigma = 0, recv = DECL.recvMain, src = 'rule', ob = 'O0', read = 'C2', frame = 'F2', T1 = null, GEO = null, N = DECL.surfN } = {}) {
  if (!DECL.frames.includes(frame)) throw new RangeError('ringSurfRow: 作りは F2・F1');
  if (frame === 'F1') {
    if (read !== 'C2') return { key, sigma, frame, read, yard: null, yard0: null, ratio: null, den: null, surfOverSrc: null, note: 'F1 の作りに C1 は無い' };
    const t1 = T1 || E.t1Table(), geo = GEO || E.geometry();
    const a = axSurf(t1, geo, key, { sigma, src, ob, recv, N }), b = sigma > 0 ? axSurf(t1, geo, key, { sigma: 0, src, ob, recv }) : a;
    return { key, sigma, frame, read, yard: a.yard, yard0: b.yard, ratio: a.yard / b.yard, den: a.den, surfOverSrc: a.Ws / (a.wS + a.wSun) };
  }
  const a = diskSurf(key, { sigma, src, ob, recv, read, N }), b = sigma > 0 ? diskSurf(key, { sigma: 0, src, ob, recv, read }) : a;
  return { key, sigma, frame, read, yard: a.yard, yard0: b.yard, ratio: a.yard / b.yard, den: a.den, surfOverSrc: a.Wsu / a.wSu };
}

/* ───────── 閉じた形 v(W) = α/W − β/W²(点の読み)───────── */
/**
 * 率の関数 rateAt(extraW)(extraW は分母に足す量 —— 呼ぶ側の単位)と、基準の分母 W0 から α・β を 2 点(E 0・E W0)で解く。3 点目(E 3 W0)で形を照合する。
 * 戻り: { a = α/W0, b = β/W0², rises(分母が増えると率が上がるか —— 2b > a), check(3 点目の相対差) }
 */
export function abOf(rateAt, W0) {
  const v0 = rateAt(0), v1 = rateAt(W0), v3 = rateAt(3 * W0);
  const a = 4 * v1 - v0, b = 4 * v1 - 2 * v0, pred3 = a / 4 - b / 16;
  return { a, b, v0, rises: 2 * b > a, slope: (2 * b - a), check: rel(v3, pred3) };
}
/** 区分 key の (F2)・C2 の α・β(土星の単位の分母)と、Σ★(W_surf = 源の重み・粒子 1 つの重み になる面密度 —— W_surf は Σ に比例) */
export function sigmaStar(key, { src = 'rule', ob = 'O0', recv = DECL.recvMain, frame = 'F2', T1 = null, GEO = null } = {}) {
  const per = surfOf(key, 1).W; // Σ 1 kg/m² の W_surf(kg/m)
  if (frame === 'F2') {
    const d = diskSurf(key, { src, ob, recv }), U = DA.saturnUnits(), Sat = RB.srcOf('saturn'), toSI = Sat.m / U.R;
    const ab = abOf((E0) => diskSurf(key, { src, ob, recv, extraWSI: E0 * toSI }).raiseOverEpsPerS, d.wSu + d.A0u);
    return { key, frame, perSigma: per, srcSI: d.wSu * toSI, oneSI: d.A0u * toSI, sigmaSrc: d.wSu * toSI / per, sigmaOne: d.A0u * toSI / per, ab };
  }
  const t1 = T1 || E.t1Table(), geo = GEO || E.geometry(), x = axSurf(t1, geo, key, { src, ob, recv });
  const ab = abOf((E0) => axSurf(t1, geo, key, { src, ob, recv, extraWSI: E0 }).raiseAsYr, x.wS + x.wSun + x.A0);
  return { key, frame, perSigma: per, srcSI: x.wS + x.wSun, oneSI: x.A0, sigmaSrc: (x.wS + x.wSun) / per, sigmaOne: x.A0 / per, ab };
}

/* ───────── 輪全体を 1 つの剛体の受け手に ───────── */
/** 区分 key の輪(質量 = Σ × 面積〔区分の幅〕・半径 = 区分の中心の半径 × c_R)を受け手に —— 戻りは { m, R } */
export function rigidOf(key, sigma, cR) {
  if (!(fin(sigma) && sigma > 0 && fin(cR) && cR > 0)) throw new RangeError('rigidOf: Σ > 0・c_R > 0');
  const g = regionOf(key); return { kind: 'rigid', m: sigma * Math.PI * (g.r1 * g.r1 - g.r0 * g.r0), R: cR * g.rc };
}

/* ───────── 公転面の集まり(〔第353便k〕の planeStd の作り —— 基準軸を引数に)───────── */
/**
 * 惑星 id の道の輪(源 = 太陽の自転の分・法線 = 基準軸 axis)。受け手 recv: 'rule' | { cR }。axis 'L' で〔第353便k〕の planeStd と同じ数(零試験)。
 * 背景 (N+) は基準軸に平行 —— 輪の法線に直交する成分には入らない(値は局所の (S) の輪だけ)。
 * 戻り: { id, axis, v, A0OverWS, scatterDeg(公転面の法線と基準軸の角 —— リポジトリの数)}
 */
export function planeAx(T1, GEO, id, { axis = 'L', src = 'rule', ob = 'O0', recv = 'rule', extraW = 0, read = 'C2' } = {}) {
  if (!DECL.planeAxes.includes(axis)) throw new RangeError('planeAx: 基準軸は L・eq');
  const tSrc = src === 'rule' ? 0 : 1, P = SP.pairInput(T1, GEO, id, 'Sun'), Lh = unit(CR.refAxis(axis, T1, GEO)), Rs = K.srcRadius('Sun', tSrc);
  const rv = recv === 'rule' ? { m: 1e3, R: null } : (recv && fin(recv.cR) && recv.cR > 0 ? { m: C.massOf(id), R: recv.cR * C.radiusOf(id) } : null);
  if (rv === null) throw new RangeError('planeAx: 受け手は rule か { cR > 0 }');
  const R = KS.ringStdOm({ Ms: P.Ms, Rs, spinVec: scl(P.sAx, P.ws), L: Lh, r: P.a, recvM: rv.m, recvR: rv.R, ob: KS.obOf('Sun', ob, src), extraW, read });
  const perp = nrm(SP.perpOf(Lh, R.Om)), v = perp * Z.DECL.ageYr * YR / (Z.DECL.planeSpreadDeg * D2R);
  const n = unit(GEO[id + '|Sun'].n);
  return { id, axis, recv, v, A0: R.A0, wS: R.wS, A0OverWS: R.A0 / R.wS, scatterDeg: CR.angDeg(Lh, n), mOverMsun: C.massOf(id) / P.Ms };
}
/** 公転面の閉じた形: 点の読み(W)で v(W) = α/W − β/W²。v★ = A0 → 0 の値(α/w_S − β/w_S²)・v ÷ v★ と 1/(1 + A0/w_S) を並べる */
export function planeClosed(T1, GEO, id, { axis = 'L', cR = 1 } = {}) {
  const base = planeAx(T1, GEO, id, { axis, recv: { cR }, read: 'W' }), W0 = base.wS + base.A0;
  const ab = abOf((E0) => planeAx(T1, GEO, id, { axis, recv: { cR }, read: 'W', extraW: E0 }).v, W0);
  // v★: W = w_S のときの値 = α/w_S − β/w_S² = (a W0/w_S) − (b W0²/w_S²)
  const g = W0 / base.wS, vStar = ab.a * g - ab.b * g * g;
  return { id, axis, cR, v: base.v, vStar, vOverStar: base.v / vStar, inv1q: 1 / (1 + base.A0OverWS), q: base.A0OverWS, ab };
}

/* ───────── 零試験 ───────── */
export function pureScenes(T1 = E.t1Table(), GEO = E.geometry()) {
  const S = {};
  // ① Σ 0 の (F2) は〔第353便k〕の diskStd と同じ数(区分 5 × 読み 2 × 扁平 2)・正本の主 (O0)(F2) の最小・最大(6.59e-6〜2.59e-5)
  S.vsDiskStd = []; for (const key of DECL.centers) for (const read of DECL.reads) for (const ob of ['O0', 'O2b']) {
    const a = diskSurf(key, { sigma: 0, read, ob }), b = KS.diskStd(key, { read, ob });
    S.vsDiskStd.push(Math.max(rel(a.raiseOverEpsPerS, b.raiseOverEpsPerS), rel(a.perpPerS, b.perpPerS))); }
  const ys = DECL.centers.map((k) => diskSurf(k, { sigma: 0 }).yard); S.kLo = Math.min(...ys); S.kHi = Math.max(...ys);
  // ② Σ 0 の (F1) は〔第353便k〕の axStd と同じ数(区分 5)
  S.vsAxStd = DECL.centers.map((key) => rel(axSurf(T1, GEO, key, { sigma: 0 }).yard, KS.axStd(T1, GEO, key).yard));
  // ③ 周りの粒子の重みの和: 輪の中心(原点)では閉じた形 2π Σ dr(全部の升が同じ距離 —— 升の球の外)
  { const w = surfW({ sigma: 1, r: 1e8, dr: 2e7, at: [0, 0, 0] }); S.surfOrigin = rel(w.W, 2 * Math.PI * 2e7); }
  // ④ 区切りの細かさ: N 48 と 96 の W_surf の相対差(区分 5)・Σ に比例
  S.surfConv = DECL.centers.map((k) => rel(surfOf(k, 1, DECL.surfN).W, surfOf(k, 1, DECL.surfNcheck).W));
  S.surfLinear = rel(surfOf('ringB', 1e3).W, 1e3 * surfOf('ringB', 1).W);
  // ⑤ extraW の口: W_surf を直に渡すのと Σ から作るのが同じ数(F2・F1)
  { const w = surfOf('ringB', 1e3).W; S.extraSame = [rel(diskSurf('ringB', { sigma: 1e3 }).raiseOverEpsPerS, diskSurf('ringB', { extraWSI: w }).raiseOverEpsPerS),
    rel(axSurf(T1, GEO, 'ringB', { sigma: 1e3 }).yard, axSurf(T1, GEO, 'ringB', { extraWSI: w }).yard)]; }
  // ⑥ 閉じた形 v(W) = α/W − β/W²(F2・C2)の 3 点目の照合
  S.abCheck = DECL.centers.map((k) => sigmaStar(k).ab.check);
  // ⑦ 公転面: 基準軸 L・受け手 規則と c_R 1 は〔第353便k〕の planeStd と同じ数(地球・木星)
  S.vsPlane = [];
  for (const id of ['Earth', 'Jupiter']) for (const recv of ['rule', { cR: 1 }]) S.vsPlane.push(rel(planeAx(T1, GEO, id, { axis: 'L', recv }).v, KS.planeStd(T1, GEO, id, { recv }).v));
  // ⑧ 剛体の輪の受け手の質量 = Σ × π(r1² − r0²)(B 環 Σ 1e3)と、剛体の受け手を recv の形で渡すと粒子の口と同じ式(質量・半径を粒子の値にすると同じ数)
  { const g = regionOf('ringB'), rg = rigidOf('ringB', 1e3, 1); S.rigidMass = rel(rg.m, 1e3 * Math.PI * (g.r1 * g.r1 - g.r0 * g.r0));
    const rv = KS.recvOf(DECL.recvMain), a = diskSurf('ringB', { recv: { kind: 'rigid', m: rv.m, R: rv.R } }), b = diskSurf('ringB', {}); S.rigidSame = rel(a.raiseOverEpsPerS, b.raiseOverEpsPerS); }
  // ⑨ 入力の拒否
  S.rejects = [() => surfW({ sigma: -1, r: 1, dr: 0.1 }), () => surfW({ sigma: 1, r: 1, dr: 3 }), () => surfW({ sigma: 1, r: 1, dr: 0.1, kernel: { kind: 'ball', al: 2 } }),
    () => diskSurf('ringB', { read: 'C3' }), () => axSurf(T1, GEO, 'ringB', { src: 'mid' }), () => ringSurfRow('ringB', { frame: 'F3' }), () => rigidOf('ringB', 0, 1),
    () => planeAx(T1, GEO, 'Earth', { axis: 'ecl' }), () => regionOf('ringZ')]
    .map((fn) => { try { fn(); return false; } catch (e) { return e instanceof RangeError; } });
  return S;
}
export function pureGates(S) {
  const A = DECL.anchor;
  return {
    vsDiskStd: S.vsDiskStd.length === 20 && S.vsDiskStd.every((x) => x < 1e-9),
    anchor353k: Number(S.kLo.toPrecision(3)) === A.kLo && Number(S.kHi.toPrecision(3)) === A.kHi,
    vsAxStd: S.vsAxStd.length === 5 && S.vsAxStd.every((x) => x < 1e-9),
    surfOrigin: S.surfOrigin < 1e-9,
    surfConv: S.surfConv.every((x) => x < 2e-2) && S.surfLinear < 1e-9,
    extraSame: S.extraSame.every((x) => x < 1e-9),
    abCheck: S.abCheck.every((x) => x < 1e-6),
    vsPlane: S.vsPlane.length === 4 && S.vsPlane.every((x) => x < 1e-9),
    rigid: S.rigidMass < 1e-12 && S.rigidSame < 1e-9,
    rejects: S.rejects.length === 9 && S.rejects.every(Boolean),
  };
}
