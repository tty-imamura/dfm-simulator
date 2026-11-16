// 第340便g(原仮定者の指示(2026-11-17 —— 第140報)・原仮定者の回答(2026-11-14 —— AN725 = A「流体の要素の自己の重みは体積の内の積分・速度の場は比べる列」)・統括の検証項目 R362):
//   **銀河を流体と見る探索の続き —— 標本の並び(乱数・準一様・ガラス)と刻みの収束の純関数**
//   器 tests/exp-w340g-fluidconv.mjs と QA behavior.fluidconv340g・docs.fluidconv340g が読む —— html を読まない・状態を持たない・ファイルを読まない。
//   **診断だけ** —— エンジン・内蔵の本・受理器・第337便e の lib(`resolutionRow`・`selfWeightsOf`・`applyField`・`evalForces`・`integrateFluid`・`continuumTable`)と
//   第335便f の lib(`sampleModel`・`forces`・`centre`・`rotateOf`・`scalesOf`)と第333便d の `rngOf` を呼ぶだけ(本文を変えない・写さない)。
//   **本便で標本の並びの生成と刻みの収束の読みを持つのはこの lib だけ**。自己の重みの式(体積の内の積分 B)・引きずりの型(row・symCentral)は第337便e の lib のまま。
//
// ■ 単位: G = M = a = 1(切った Plummer 球 —— 質量の割合の上限 0.99・第335便f と同じ)。N は解像の要素の数(実在の星の数ではない)・m = 1/N。
// ■ 並び(ARRANGEMENTS —— 走行の前に並べる。結果を見て選ばない):
//   random = 第337便e のまま(第335便f の `sampleModel` —— 種 = 種 × 10007 + N)/
//   quasi = 準一様(単位の球の中で: 半径の割合 s = u^(1/3)・u は van der Corput 列〔2 進 —— 種ごとに Cranley–Patterson の平行移動〕・向きは Fibonacci の格子〔z = 1 − 2(i + ½)/N・方位 = i × 黄金角〕・
//     種ごとに球全体を決まった乱数の回転で回す)/
//   glass = ガラス(単位の球の中の一様な乱数の点を、近い点どうしの反発〔(1 − r/h)² —— h = 2 × 平均の間隔〕と縁の押し戻しで緩める —— 歩の数 GLASS.steps・歩の幅 GLASS.eta × 平均の間隔)。
//   quasi と glass は単位の球の中の点を、質量の割合を保つ動径の写し(s³ × 0.99 → Plummer の r(u))で切った Plummer 球へ写す(並びの近さの関係は保たれる)。
//   速度: 静的な表は場(第337便e の `applyField` —— diff・rigid)・動的な表は同じ種の random の標本の速度を半径の順位で写す(分布関数の近似)+ 回転の支え(第335便f の `rotateOf`)。
// ■ 量: 並びの質 = 最も近い点までの距離の変動係数 CV_nn(乱数 ≈ 0.5・格子 0)/自己の分け前・全体の重みの連続の場との差・引きずりの大きさ RMS|d|/RMS|V|・
//   線形の場の連続の引きずりとの差(第337便e の `resolutionRow`)/外縁の速さの比 = 外側 20 %(半径の順)の Σ m (V_φ + d_φ) ÷ Σ m V_φ(引きずりで運ばれた速さ ÷ 場の速さ)/
//   角運動量の率 = Σ m (p × d)_z ÷ Σ m |p × V|(単位の γ あたり —— 向きの符号を読む)・運動量の率 |Σ m d| ÷ Σ m |V|。
// ■ 刻みの収束(convOf): Q_h・Q_{h/2}・Q_{h/4} → e₁ = |Q_h − Q_{h/2}|・e₂ = |Q_{h/2} − Q_{h/4}|・見かけの次数 p = log₂(e₁/e₂)・外挿 Q* = Q_{h/4} + (Q_{h/4} − Q_{h/2})/(2^p − 1)(p > 0.5 のときだけ)。
//   物差し: e₂ ≤ e₁/2(p ≥ 1)を「刻みで決まる向き」。
// ■ 言わないこと: 表は宣言した並び・刻み・N・ノブの組の測った数(銀河の回転曲線・流体の計算の解ではない)。0 と書いた量は「この計算の精度では 0 と区別できない」。
import { rngOf } from './lib-w333d-noncirc.mjs';
import * as E5 from './lib-w335f-elliptical.mjs';
import * as F7 from './lib-w337e-fluid.mjs';

export const LIB_VERSION = 'w340g-fluidconv-lib-1';
export const ARRANGEMENTS = Object.freeze(['random', 'quasi', 'glass']);
export const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
/** 宣言(走行の前に置く —— 結果を見て変えない。変えたら版を上げて理由を書く) */
export const GLASS = Object.freeze({ steps: 60, eta: 0.08, hFactor: 2, wallFrac: 0.5 });
export const DECL = Object.freeze({
  uMax: E5.DECL.uMax.plummer,
  /** 外縁 = 半径の順の外側の割合 */
  outerFrac: 0.2,
  /** 種の写し(random は第337便e と同じ) */
  seedRule: 'random: 種 × 10007 + N(第337便e の seedOf)・quasi: 回転と平行移動の乱数の種 = 種 × 7919 + N・glass: 初めの点の乱数の種 = 種 × 7919 + N + 1',
  glass: GLASS,
});
const fin = (x) => typeof x === 'number' && Number.isFinite(x);

/* ───────── 並び ───────── */
/** van der Corput 列(2 進 —— i ≥ 1) */
export function vdc2(i) { let x = 0, f = 0.5, n = i; while (n > 0) { if (n & 1) x += f; n >>>= 1; f *= 0.5; } return x; }
/** 決まった乱数の回転(一様な四元数 —— Shoemake の方法) */
export function randomRotation(rng) {
  const u1 = rng(), u2 = 2 * Math.PI * rng(), u3 = 2 * Math.PI * rng(), a = Math.sqrt(1 - u1), b = Math.sqrt(u1);
  const w = a * Math.sin(u2), x = a * Math.cos(u2), y = b * Math.sin(u3), z = b * Math.cos(u3);
  return [[1 - 2 * (y * y + z * z), 2 * (x * y - z * w), 2 * (x * z + y * w)], [2 * (x * y + z * w), 1 - 2 * (x * x + z * z), 2 * (y * z - x * w)], [2 * (x * z - y * w), 2 * (y * z + x * w), 1 - 2 * (x * x + y * y)]];
}
/** 準一様の点(単位の球の中) */
export function quasiBall(N, seed) {
  if (!(Number.isInteger(N) && N >= 4)) throw new RangeError('quasiBall: N ≥ 4 の整数');
  const rng = rngOf(seed), shift = rng(), Rm = randomRotation(rng), P = [];
  for (let i = 0; i < N; i++) {
    let u = vdc2(i + 1) + shift; u -= Math.floor(u); if (!(u > 0)) u = 0.5 / N;
    const s = Math.cbrt(u), z = 1 - 2 * (i + 0.5) / N, rz = Math.sqrt(Math.max(0, 1 - z * z)), ph = i * GOLDEN_ANGLE, d = [rz * Math.cos(ph), rz * Math.sin(ph), z];
    P.push([0, 1, 2].map((k) => s * (Rm[k][0] * d[0] + Rm[k][1] * d[1] + Rm[k][2] * d[2])));
  }
  return P;
}
/** 一様な乱数の点(単位の球の中 —— 棄却) */
export function randomBall(N, seed) {
  const rng = rngOf(seed), P = [];
  while (P.length < N) { const p = [2 * rng() - 1, 2 * rng() - 1, 2 * rng() - 1]; if (p[0] * p[0] + p[1] * p[1] + p[2] * p[2] <= 1) P.push(p); }
  return P;
}
/** ガラス: 一様な乱数の点を反発で緩める(単位の球の中)。戻り値 { P, cvStart, cvEnd } */
export function glassBall(N, seed, { steps = GLASS.steps, eta = GLASS.eta, hFactor = GLASS.hFactor, wallFrac = GLASS.wallFrac } = {}) {
  if (!(Number.isInteger(N) && N >= 4 && Number.isInteger(steps) && steps >= 0)) throw new RangeError('glassBall: N ≥ 4・steps ≥ 0 の整数');
  const P = randomBall(N, seed), a = Math.cbrt(4 * Math.PI / (3 * N)), h = hFactor * a, h2 = h * h, wall = 1 - wallFrac * a;
  const cvStart = nnCV(P), fx = new Float64Array(N), fy = new Float64Array(N), fz = new Float64Array(N);
  for (let s = 0; s < steps; s++) {
    fx.fill(0); fy.fill(0); fz.fill(0);
    for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
      const dx = P[i][0] - P[j][0], dy = P[i][1] - P[j][1], dz = P[i][2] - P[j][2], r2 = dx * dx + dy * dy + dz * dz;
      if (!(r2 < h2) || !(r2 > 0)) continue;
      const r = Math.sqrt(r2), q = 1 - r / h, f = q * q / r;
      fx[i] += f * dx; fy[i] += f * dy; fz[i] += f * dz; fx[j] -= f * dx; fy[j] -= f * dy; fz[j] -= f * dz;
    }
    for (let i = 0; i < N; i++) {
      const p = P[i]; p[0] += eta * a * fx[i]; p[1] += eta * a * fy[i]; p[2] += eta * a * fz[i];
      const r = Math.hypot(p[0], p[1], p[2]); if (r > wall) { const c = wall / r; p[0] *= c; p[1] *= c; p[2] *= c; }
    }
  }
  return { P, cvStart, cvEnd: nnCV(P) };
}
/** 最も近い点までの距離の変動係数(標準偏差 ÷ 平均) */
export function nnCV(P) {
  const N = P.length, d = new Float64Array(N);
  for (let i = 0; i < N; i++) { let m = Infinity; for (let j = 0; j < N; j++) { if (j === i) continue; const q = (P[i][0] - P[j][0]) ** 2 + (P[i][1] - P[j][1]) ** 2 + (P[i][2] - P[j][2]) ** 2; if (q < m) m = q; } d[i] = Math.sqrt(m); }
  let s = 0, s2 = 0; for (let i = 0; i < N; i++) { s += d[i]; s2 += d[i] * d[i]; }
  const mu = s / N; return Math.sqrt(Math.max(0, s2 / N - mu * mu)) / mu;
}
/** 動径の写し: 単位の球の半径 s → Plummer の r(質量の割合 u = s³ × uMax)と逆 */
export function sToR(s, uMax = DECL.uMax) { const u = Math.min(uMax, s * s * s * uMax); return 1 / Math.sqrt(Math.cbrt(1 / (u * u)) - 1); }
export function rToS(r, uMax = DECL.uMax) { const u = r * r * r / Math.pow(1 + r * r, 1.5); return Math.cbrt(Math.min(1, u / uMax)); }
/** 単位の球の中の点 → 切った Plummer 球(質量の割合 s³ × uMax を保つ動径の写し)の状態(速度 0・m = 1/N・重心を引く) */
export function ballToPlummer(P, uMax = DECL.uMax) {
  const N = P.length, S = E5.cloneState({ N, x: new Float64Array(N), y: new Float64Array(N), z: new Float64Array(N), vx: new Float64Array(N), vy: new Float64Array(N), vz: new Float64Array(N), m: new Float64Array(N) });
  for (let i = 0; i < N; i++) {
    const s = Math.hypot(P[i][0], P[i][1], P[i][2]); S.m[i] = 1 / N;
    if (!(s > 0)) continue;
    const c = sToR(s, uMax) / s;
    S.x[i] = P[i][0] * c; S.y[i] = P[i][1] * c; S.z[i] = P[i][2] * c;
  }
  return E5.centre(S);
}
/** 並びの標本(arr ∈ ARRANGEMENTS)。戻り値 { S(速度 0 —— random は分布関数の速度を持つ), cv(単位の球の中の CV_nn —— random は写し戻した点で), glass(glass だけ { cvStart, cvEnd }) } */
export function arrangementOf(arr, N, seed) {
  if (!ARRANGEMENTS.includes(arr)) throw new RangeError('arrangementOf: 並びは ' + ARRANGEMENTS.join('・'));
  if (!(Number.isInteger(N) && N >= 8 && Number.isInteger(seed) && seed >= 1)) throw new RangeError('arrangementOf: N ≥ 8・種 ≥ 1 の整数');
  if (arr === 'random') {
    const S = E5.sampleModel({ model: 'plummer', N, seed: seed * 10007 + N }).S;
    return { S, cv: nnCV(plummerToBall(S)), glass: null };
  }
  if (arr === 'quasi') { const P = quasiBall(N, seed * 7919 + N); return { S: ballToPlummer(P), cv: nnCV(P), glass: null }; }
  const G = glassBall(N, seed * 7919 + N + 1);
  return { S: ballToPlummer(G.P), cv: G.cvEnd, glass: { cvStart: G.cvStart, cvEnd: G.cvEnd } };
}
/** 逆の写し(Plummer の r → 単位の球の s = (u/uMax)^(1/3)・u = r³/(1 + r²)^(3/2))—— 並びの質を同じ物差しで比べるため */
export function plummerToBall(S, uMax = DECL.uMax) {
  const P = [];
  for (let i = 0; i < S.N; i++) { const r = Math.hypot(S.x[i], S.y[i], S.z[i]); if (!(r > 0)) { P.push([0, 0, 0]); continue; } const s = rToS(r, uMax) / r; P.push([S.x[i] * s, S.y[i] * s, S.z[i] * s]); }
  return P;
}
/** 速度の写し: 同じ N・種の random の標本の速度を、半径の順位で写す(+ 回転の支え k —— 第335便f の rotateOf の種 = 種 + 500) */
export function withRankVelocities(S0, N, seed, k = E5.DECL.rotFlip) {
  const R = E5.sampleModel({ model: 'plummer', N, seed: seed * 10007 + N }).S, S = E5.cloneState(S0);
  const ord = (T) => Array.from({ length: T.N }, (_, i) => i).sort((p, q) => Math.hypot(T.x[p], T.y[p], T.z[p]) - Math.hypot(T.x[q], T.y[q], T.z[q]) || p - q);
  const a = ord(S), b = ord(R);
  for (let q = 0; q < N; q++) { S.vx[a[q]] = R.vx[b[q]]; S.vy[a[q]] = R.vy[b[q]]; S.vz[a[q]] = R.vz[b[q]]; }
  return E5.rotateOf(E5.centre(S), k, seed + 500);
}

/* ───────── 静的な量(1 本) ───────── */
/** 外縁の速さの比・角運動量の率・運動量の率(V = 場の速度・d = 引きずり) */
export function carryOf(V, d) {
  const N = V.N, idx = Array.from({ length: N }, (_, i) => i), rr = idx.map((i) => Math.hypot(V.x[i], V.y[i], V.z[i]));
  idx.sort((p, q) => rr[p] - rr[q] || p - q);
  const n0 = Math.floor(N * (1 - DECL.outerFrac));
  let num = 0, den = 0;
  for (let k = n0; k < N; k++) { const i = idx[k], R = Math.hypot(V.x[i], V.y[i]); if (!(R > 0)) continue; const ex = -V.y[i] / R, ey = V.x[i] / R, vp = V.vx[i] * ex + V.vy[i] * ey, dp = d.dx[i] * ex + d.dy[i] * ey; num += V.m[i] * (vp + dp); den += V.m[i] * vp; }
  let tz = 0, Ls = 0, px = 0, py = 0, pz = 0, ps = 0;
  for (let i = 0; i < N; i++) {
    const m = V.m[i]; tz += m * (V.x[i] * d.dy[i] - V.y[i] * d.dx[i]);
    Ls += m * Math.hypot(V.y[i] * V.vz[i] - V.z[i] * V.vy[i], V.z[i] * V.vx[i] - V.x[i] * V.vz[i], V.x[i] * V.vy[i] - V.y[i] * V.vx[i]);
    px += m * d.dx[i]; py += m * d.dy[i]; pz += m * d.dz[i]; ps += m * Math.hypot(V.vx[i], V.vy[i], V.vz[i]);
  }
  return { outerRatio: den !== 0 ? num / den : null, torqueRate: tz / Ls, momRate: Math.hypot(px, py, pz) / ps };
}
/** 1 本(並び・N・種・場): 自己の重み none と B(解析の密度)の row の引きずりと、B の symCentral の帳簿の率 */
export function staticRow({ arr, N, seed, field, eps, table }) {
  const A = arrangementOf(arr, N, seed), V = F7.applyField(A.S, field), out = { arr, N, seed, field, cv: A.cv };
  for (const rule of ['none', 'B']) {
    const R = F7.resolutionRow({ S: A.S, field, rule, eps, table }), sw = F7.selfWeightsOf(V, rule, { eps }), F = E5.forces(V, eps, true, 2, rule === 'none' ? null : sw);
    out[rule] = Object.assign({ shareMean: R.shareMean, wTotBias: R.wTotBias, wTotRms: R.wTotRms, dOverV: R.dOverV, contErr: R.contErr }, carryOf(V, F));
  }
  const swB = F7.selfWeightsOf(V, 'B', { eps }), FS = F7.evalForces(V, { drag: 'symCentral', eps, selfW: swB }), C = carryOf(V, FS);
  out.symB = { torqueRate: C.torqueRate, momRate: C.momRate, outerRatio: C.outerRatio };
  return out;
}

/* ───────── 刻みの収束 ───────── */
/** Q_h・Q_{h/2}・Q_{h/4} → 誤差・見かけの次数・外挿 */
export function convOf(q1, q2, q4) {
  if (![q1, q2, q4].every(fin)) return { e1: null, e2: null, p: null, extrap: null, decides: false };
  const e1 = Math.abs(q1 - q2), e2 = Math.abs(q2 - q4);
  const p = e1 > 0 && e2 > 0 ? Math.log2(e1 / e2) : null;
  const extrap = p !== null && p > 0.5 ? q4 + (q4 - q2) / (Math.pow(2, p) - 1) : null;
  return { e1, e2, p, extrap, decides: e2 === 0 ? e1 === 0 || e1 > 0 : e2 <= e1 / 2 };
}
/** 動的な 1 本の最後の量(外縁の速さ V_φ の平均の比〔外側 20 %・初めの値に対して〕・L_z の比・r50 の相対の変化・2K/|W|・E の相対の変化) */
export function finalOf(R, S0) {
  const vphiOuter = (T) => { const N = T.N, idx = Array.from({ length: N }, (_, i) => i), rr = idx.map((i) => Math.hypot(T.x[i], T.y[i], T.z[i])); idx.sort((p, q) => rr[p] - rr[q] || p - q);
    let s = 0, m = 0; for (let k = Math.floor(N * (1 - DECL.outerFrac)); k < N; k++) { const i = idx[k], Rr = Math.hypot(T.x[i], T.y[i]); if (!(Rr > 0)) continue; s += T.m[i] * (T.x[i] * T.vy[i] - T.y[i] * T.vx[i]) / Rr; m += T.m[i]; } return s / m; };
  const Lz = (T) => { let s = 0; for (let i = 0; i < T.N; i++) s += T.m[i] * (T.x[i] * T.vy[i] - T.y[i] * T.vx[i]); return s; };
  const q0 = R.series[0].q, q1 = R.series[R.series.length - 1].q;
  return { vphiOuterRatio: vphiOuter(R.state) / vphiOuter(S0), LzRatio: Lz(R.state) / Lz(S0), r50: (q1.r50 - q0.r50) / q0.r50, vir: q1.vir, dE: q1.dE };
}

/* ───────── 純関数の場面(門) ───────── */
export function pureScenes() {
  const S = {};
  // ① van der Corput の初めの値・回転は直交(R Rᵀ = 1・det = 1)
  {
    const v = [1, 2, 3, 4, 5, 6, 7].map(vdc2), Rm = randomRotation(rngOf(7));
    let orth = 0; for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) { let s = 0; for (let k = 0; k < 3; k++) s += Rm[a][k] * Rm[b][k]; orth = Math.max(orth, Math.abs(s - (a === b ? 1 : 0))); }
    const det = Rm[0][0] * (Rm[1][1] * Rm[2][2] - Rm[1][2] * Rm[2][1]) - Rm[0][1] * (Rm[1][0] * Rm[2][2] - Rm[1][2] * Rm[2][0]) + Rm[0][2] * (Rm[1][0] * Rm[2][1] - Rm[1][1] * Rm[2][0]);
    S.vdc = { v, orth: orth <= 1e-14 ? 0 : orth, det1: Math.abs(det - 1) <= 1e-14 };
  }
  // ② 動径の写しの往復(s → r → s —— 重心を引く前の写しそのもの)と単調
  {
    let maxD = 0, mono = true, prev = -1;
    for (let k = 1; k <= 200; k++) { const s = k / 200 * (1 - 1e-9), r = sToR(s), b = rToS(r); maxD = Math.max(maxD, Math.abs(b - s)); if (!(r > prev)) mono = false; prev = r; }
    const B = plummerToBall(ballToPlummer(quasiBall(128, 11)));
    S.map = { maxD: maxD <= 1e-12 ? 0 : maxD, mono, inBall: B.every((p) => Math.hypot(...p) <= 1 + 1e-12) };
  }
  // ③ 並びの質の順序: CV_nn は glass < quasi < random(N 128・種 1)・ガラスの緩めで CV が下がる
  {
    const cv = Object.fromEntries(ARRANGEMENTS.map((a) => [a, arrangementOf(a, 128, 1).cv])), G = glassBall(128, 3);
    S.quality = { cv, order: cv.glass < cv.random && cv.quasi < cv.random, glassDrop: G.cvEnd < G.cvStart };
  }
  // ④ 刻みの収束の読み: 1 次と 2 次の誤差の列で次数と外挿が戻る(Q_h = 1 + c h^p)
  {
    const t = (p) => { const q = (h) => 1 + 0.3 * Math.pow(h, p); return convOf(q(0.1), q(0.05), q(0.025)); }, a = t(1), b = t(2);
    S.conv = { p1: a.p, p2: b.p, x1: a.extrap, x2: b.extrap, none: convOf(1, 1, 1).decides, bad: convOf(1, NaN, 1).p };
  }
  // ⑤ 一定の速度の場で引きずり 0(並び 3 × 読み none・B)・symCentral の角運動量の率 0(diff の場)
  {
    let zero = 0, tq = 0;
    for (const a of ARRANGEMENTS) {
      const A = arrangementOf(a, 64, 2).S, C = F7.applyField(A, 'const');
      for (const rule of ['none', 'B']) { const sw = F7.selfWeightsOf(C, rule, { eps: 0.05 }), F = E5.forces(C, 0.05, true, 2, rule === 'none' ? null : sw); for (let i = 0; i < 64; i++) zero = Math.max(zero, Math.abs(F.dx[i]), Math.abs(F.dy[i]), Math.abs(F.dz[i])); }
      const V = F7.applyField(A, 'diff'), FS = F7.evalForces(V, { drag: 'symCentral', eps: 0.05, selfW: F7.selfWeightsOf(V, 'B', { eps: 0.05 }) }); tq = Math.max(tq, Math.abs(carryOf(V, FS).torqueRate));
    }
    S.ident = { zero: zero <= 1e-15 ? 0 : zero, torqueSym: tq <= 1e-13 ? 0 : tq };
  }
  // ⑥ 速度の写し: random の並びに写すと元の速度の組と同じ(回転の支え 0)
  {
    const A = arrangementOf('random', 64, 3).S, W = withRankVelocities(A, 64, 3, 0);
    let d = 0; for (let i = 0; i < 64; i++) d = Math.max(d, Math.abs(W.vx[i] - A.vx[i]), Math.abs(W.vy[i] - A.vy[i]), Math.abs(W.vz[i] - A.vz[i]));
    S.rankVel = { maxD: d <= 1e-15 ? 0 : d };
  }
  // ⑦ 入力の拒否
  {
    const tries = [() => arrangementOf('lattice', 64, 1), () => arrangementOf('quasi', 4, 1), () => arrangementOf('glass', 64, 0), () => quasiBall(2, 1), () => glassBall(64, 1, { steps: -1 })];
    let n = 0; for (const f of tries) { try { f(); } catch (e) { if (e instanceof RangeError) n++; } }
    S.reject = { n, of: tries.length };
  }
  return S;
}
export function pureGates(S) {
  return {
    vdc: S.vdc.v.join(',') === '0.5,0.25,0.75,0.125,0.625,0.375,0.875' && S.vdc.orth === 0 && S.vdc.det1 === true,
    map: S.map.maxD === 0 && S.map.mono === true && S.map.inBall === true,
    quality: S.quality.order === true && S.quality.glassDrop === true,
    conv: Math.abs(S.conv.p1 - 1) <= 1e-9 && Math.abs(S.conv.p2 - 2) <= 1e-9 && Math.abs(S.conv.x1 - 1) <= 1e-12 && Math.abs(S.conv.x2 - 1) <= 1e-12 && S.conv.none === true && S.conv.bad === null,
    ident: S.ident.zero === 0 && S.ident.torqueSym === 0,
    rankVel: S.rankVel.maxD === 0,
    reject: S.reject.n === S.reject.of,
  };
}
