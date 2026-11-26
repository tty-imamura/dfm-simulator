// 第356便d(統括の検証項目 R516): **論文 5 の「斥力に見えたのは引きずり」を数で見られる形にする診断の純関数の lib**
//   (アプリではない小さな積分器 —— 第355便g の lib tests/lib-w355g-heat3d.mjs の箱・柔らかい壁・圧力の測り方と、第355便i の lib tests/lib-w355i-replaw.mjs の冪の測り方〔密度の格子・粒の数・温度〕を
//   そのまま使い、斥力の項を 0 にして、引きずりの口を足した写し。g と i の lib は import して使い、本文は変えない)。
//   診断だけ —— アプリ・エンジン・内蔵の本・受理器・既存の lib の本文は変えない。physics の鍵を足さない。三次元の受理の門は変えない。
//   アナロジーとしての玩具の量(現実の熱力学の記述ではない)。列を 1 つに絞らない(候補の表)。乱数は使わない(定めた種の線形合同)。
//
// ■ 引きずりは座標変換として入れる(主の口 —— reading 'coord'):
//   位置の進み = 慣性の速さ + 引きずりの速さ(x ← x + h (v + u))。引きずりは慣性の速さ(運動量)・内部の温度・スピンを直接は変えない。
//   比べる口(ノブ —— reading 'force'): 引きずりの速さを慣性の速さへ足す読み(v ← v + h u ÷ τ_F —— 力として効く形)。失った並進の運動エネルギーは内部の温度へ積む(熱の口 —— 主にしない)。
// ■ (D) 並進引きずり(定義のまま): u_i^D = c_D Σ_j w_ij (v_j − v_i) ÷ (w_ii + Σ_j w_ij)(自分を含む —— 自分の相対の速さは 0 なので分母にだけ入る)・
//   w_ij = m_j ÷ (d_ij² + ε²)^(n/2)(次数 n はノブ・既定 2)。自分の重み w_ii は第337便e の lib の B(体積の内の積分 `selfWeightB` —— 同じ体積の球・密度は箱の数の密度)。
//   n = 2 の和は第337便e の lib の `cellDrag` と同じ式(零試験)。
// ■ (S) スピンに由来する引きずり —— 候補 2 つ(式を決め打ちしない):
//   (S1) 引きずる側の回転を使った座標変換の分: u_i^S1 = c_S1 Σ_j w_ij (s_j × (p_i − p_j)) ÷ (w_ii + Σ_j w_ij)((D) と同じ重み・同じ分母)。
//   (S2) いまのスピン斥力(E5′)の式の向きと大きさを、引きずりの速さとして: u_i^S2 = c_S2 τ_s Σ_j k_rep μ_ij (ω_i² + ω_j²)(p_i − p_j) ÷ m_i・
//        ω_a = abs(s_a) g_a・g_a = (R_a ÷ (R_a + d))^q(E5′ と同じ)・τ_s = 1 ÷ s₀(T = 1)(スピンが 1 ラジアン回る時間 —— 時間の物差しの宣言)。運動量と熱の台帳には入れない。
// ■ スピン: s_a(角速度のベクトル)。大きさ s₀(T) = √(3 T ÷ I)・I = ½ m R²(内部の温度 T のときのスピンのエネルギー ½ I s₀² = 3T/2 —— 宣言)。
//   箱は向きを定めた種で散らす(rand)・対は z にそろえる。「スピンを逆にした走行」は s → −s。
// 記号: D = 次元(3)/N = 粒の数/L = 箱の一辺/ρ = N ÷ L³/h = 刻み/d★ = 対の座標の相対の速さが 0 になる距離(w = w_ii —— 2 粒・c_D 1 のとき)。
export const LIB_VERSION = 'w356d-drageos-lib-1';
import * as H from './lib-w355g-heat3d.mjs';
import * as I from './lib-w355i-replaw.mjs';
import { cellDrag, selfWeightB } from './lib-w337e-fluid.mjs';

const I_MOM = 0.5 * H.DECL.m * H.DECL.R * H.DECL.R;
/** スピンの大きさ s₀(T) = √(3T ÷ I) */
export const s0Of = (T) => Math.sqrt(3 * T / I_MOM);

export const DECL = Object.freeze({
  conds: Object.freeze(['T', 'TD', 'TS', 'TDS']),     // (T) 並進だけ〔基準〕/(T+D)/(T+S)/(T+D+S)
  sKinds: Object.freeze(['S1', 'S2']),
  readings: Object.freeze(['coord', 'force']),
  cD: 1, cS1: 1, cS2: 1, nW: 2, eps: 0, tauF: 1, cHeat: 1.5,
  tauS: 1 / s0Of(1),
  I: I_MOM,
  rho3: I.DECL.rho3, tScan: I.DECL.tScan, nScan3: I.DECL.nScan3, nBig: 216,   // 第355便i と同じ測り方(密度 0.02・0.08・0.32/T 0.5・1・2/粒 27・64・125 —— 箱の一辺は ρ 0.08 の値)
  window: I.DECL.window,
  h: H.DECL.dt, steps: H.DECL.steps, warm: H.DECL.warm,                        // 刻み 0.02・3000 步・測りは 800 步から(第355便g の並進ありの列と同じ)
  gate: Object.freeze({ N: 64, rho: 0.08, steps: 3000 }),                       // 熱を生まないことの検査(温度の尺度の掛け直しをしない走行)
  pair: Object.freeze({ v0: 1, d0: 12, bGrid: Object.freeze([0, 0.5, 1, 2]), rhoSelf: 0.08, T: 1 }),
  stepTol: 0.05,                                                                // 刻み h と h/2 の相対の差がこれを越える量に「刻みに依る」の印
  spinSeed: 356041,
});

/* ───────── 引きずりの速さ ───────── */
/**
 * 引きずりの速さ u(長さ N × 3 の配列へ書く)。x・v・s は長さ N × 3。prm: { cD, cS1, cS2, nW, eps, selfW, m, R, q, kRep, tauS }
 * 戻り: u(同じ配列)。D と S1 は同じ重みと分母・S2 は E5′ の形の対の和。
 */
export function dragVel(x, v, s, N, prm, u) {
  const { cD = 0, cS1 = 0, cS2 = 0, nW = 2, eps = 0, selfW, m = 1, R = H.DECL.R, q = H.DECL.q, kRep = H.DECL.kRep, tauS = DECL.tauS } = prm;
  u.fill(0);
  if (!(cD || cS1 || cS2)) return u;
  const e2 = eps * eps, half = nW / 2;
  for (let i = 0; i < N; i++) {
    const xi = x[3 * i], yi = x[3 * i + 1], zi = x[3 * i + 2];
    let W = selfW, nx = 0, ny = 0, nz = 0, sx = 0, sy = 0, sz = 0, rx = 0, ry = 0, rz = 0;
    const si2 = s ? s[3 * i] * s[3 * i] + s[3 * i + 1] * s[3 * i + 1] + s[3 * i + 2] * s[3 * i + 2] : 0;
    for (let j = 0; j < N; j++) {
      if (j === i) continue;
      const dx = xi - x[3 * j], dy = yi - x[3 * j + 1], dz = zi - x[3 * j + 2], d2 = dx * dx + dy * dy + dz * dz;
      if (cD || cS1) {
        const qq = d2 + e2, w = m / (half === 1 ? qq : Math.pow(qq, half));
        W += w;
        if (cD) { nx += w * (v[3 * j] - v[3 * i]); ny += w * (v[3 * j + 1] - v[3 * i + 1]); nz += w * (v[3 * j + 2] - v[3 * i + 2]); }
        if (cS1) { const a = s[3 * j], b = s[3 * j + 1], c = s[3 * j + 2]; sx += w * (b * dz - c * dy); sy += w * (c * dx - a * dz); sz += w * (a * dy - b * dx); }
      }
      if (cS2) {
        const d = Math.sqrt(d2), gi = H.gOf(R, d, q), sj2 = s[3 * j] * s[3 * j] + s[3 * j + 1] * s[3 * j + 1] + s[3 * j + 2] * s[3 * j + 2];
        const f = kRep * (m * m / (m + m)) * (si2 * gi * gi + sj2 * gi * gi) / m;   // 等しい半径(g_i = g_j)
        rx += f * dx; ry += f * dy; rz += f * dz;
      }
    }
    u[3 * i] = (cD * nx + cS1 * sx) / W + cS2 * tauS * rx;
    u[3 * i + 1] = (cD * ny + cS1 * sy) / W + cS2 * tauS * ry;
    u[3 * i + 2] = (cD * nz + cS1 * sz) / W + cS2 * tauS * rz;
  }
  return u;
}

/** 条件の名 → 係数(sKind は S の候補・spin は ±1) */
export function condPrm(cond, sKind = 'S1', o = {}) {
  const cD = o.cD == null ? DECL.cD : o.cD, cS1 = o.cS1 == null ? DECL.cS1 : o.cS1, cS2 = o.cS2 == null ? DECL.cS2 : o.cS2;
  const hasD = cond === 'TD' || cond === 'TDS', hasS = cond === 'TS' || cond === 'TDS';
  return { cD: hasD ? cD : 0, cS1: hasS && sKind === 'S1' ? cS1 : 0, cS2: hasS && sKind === 'S2' ? cS2 : 0 };
}
export const condId = (cond, sKind, spin) => cond === 'T' || cond === 'TD' ? cond : cond + '-' + sKind + (spin < 0 ? 'r' : '');

/* ───────── 箱の積分器(第355便g の simulate と同じ手順 —— 斥力 0・引きずりの口を足す) ───────── */
/**
 * cfg: { N, L, Tint, Ttr, cond, sKind, spin(±1), reading, nve(真で尺度の掛け直しをしない), noWalls(真で壁なし —— 零試験だけ), wallClip(真で壁の中の奥へ向く引きずりを 0 —— 比べる口), steps, warm, dt, seed, spinMode('rand'|'z') } + 係数の上書き(cD・cS1・cS2・nW・eps)
 * 圧力 = 壁に渡る力の時間平均の和 ÷ (2D × L^(D−1))(g と同じ)。初めの位置と速さは g の simulate と同じ種・同じ順(引きずり 0 で g の rep 偽の走行と同じ数 —— 零試験)。
 */
export function simulate(cfg) {
  const c = Object.assign({}, H.DECL, { reading: 'coord', spin: 1, sKind: 'S1', cond: 'T', spinMode: 'rand', nve: false }, cfg);
  const D = 3, N = c.N, L = c.L, R = c.R, m = c.m, dt = c.dt, rnd = H.lcg(c.seed);
  const x = new Float64Array(N * D), v = new Float64Array(N * D), a = new Float64Array(N * D), u = new Float64Array(N * D), s = new Float64Array(N * D), Tin = new Float64Array(N);
  const side = Math.max(2, Math.ceil(Math.pow(N - 1e-9, 1 / D))), hh = L / (side - 1);
  for (let i = 0; i < N; i++) { let k = i; for (let ax = 0; ax < D; ax++) { const ix = k % side; k = Math.floor(k / side); x[i * D + ax] = ix * hh + (rnd() - 0.5) * 0.1 * hh; } }
  if (c.Ttr > 0) {
    for (let i = 0; i < N * D; i++) { const u1 = rnd(), u2 = rnd(); v[i] = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2); }
    for (let ax = 0; ax < D; ax++) { let sm = 0; for (let i = 0; i < N; i++) sm += v[i * D + ax]; sm /= N; for (let i = 0; i < N; i++) v[i * D + ax] -= sm; }
    rescale(v, N, D, m, c.Ttr);
  }
  spinsInit(s, N, s0Of(c.Tint) * (c.spin < 0 ? -1 : 1), c.spinMode, DECL.spinSeed + N);
  Tin.fill(c.Tint);
  const P0 = condPrm(c.cond, c.sKind, c), selfW = selfWeightB(m, N / Math.pow(L, D), c.eps == null ? DECL.eps : c.eps, 2);
  const prm = { cD: P0.cD, cS1: P0.cS1, cS2: P0.cS2, nW: c.nW == null ? DECL.nW : c.nW, eps: c.eps == null ? DECL.eps : c.eps, selfW, m, R, q: c.q, kRep: c.kRep, tauS: DECL.tauS };
  const active = !!(prm.cD || prm.cS1 || prm.cS2), force = c.reading === 'force';
  let wallNow = 0;
  const walls = () => {
    a.fill(0); wallNow = 0;
    if (c.noWalls) return;
    for (let i = 0; i < N; i++) for (let ax = 0; ax < D; ax++) {
      const p = x[i * D + ax];
      if (p < 0) { const f = c.wallK * (-p); a[i * D + ax] += f / m; wallNow += f; }
      else if (p > L) { const f = c.wallK * (p - L); a[i * D + ax] -= f / m; wallNow += f; }
    }
  };
  const wallPE = () => { let e = 0; for (let i = 0; i < N * D; i++) { const p = x[i]; if (p < 0) e += 0.5 * c.wallK * p * p; else if (p > L) e += 0.5 * c.wallK * (p - L) * (p - L); } return e; };
  const KE = () => { let e = 0; for (let i = 0; i < N * D; i++) e += 0.5 * m * v[i] * v[i]; return e; };
  const spinE = () => { let e = 0; for (let i = 0; i < N * D; i++) e += 0.5 * c.I0 * s[i] * s[i]; return e; };
  c.I0 = DECL.I;
  const sum = (A) => { let t = 0; for (let i = 0; i < A.length; i++) t += A[i]; return t; };
  walls();
  const ke0 = KE(), pe0 = wallPE(), tint0 = sum(Tin), es0 = spinE();
  let wallSum = 0, ttrSum = 0, nMeas = 0, heatIn = 0, gainNoSrc = 0;
  for (let st = 0; st < c.steps; st++) {
    for (let i = 0; i < N * D; i++) v[i] += 0.5 * dt * a[i];
    if (active) dragVel(x, v, s, N, prm, u);
    if (active && force) {
      const k0 = KE();
      for (let i = 0; i < N * D; i++) v[i] += dt * u[i] / DECL.tauF;
      const dE = k0 - KE();
      if (dE > 0) { heatIn += dE; const dT = dE / (N * DECL.cHeat); for (let i = 0; i < N; i++) Tin[i] += dT; }   // 熱の口(失った並進の運動エネルギーを内部の温度へ —— 比べる口だけ)
      else gainNoSrc -= dE;                                                                                          // 増えた並進の運動エネルギー(出どころの台帳なし —— 記録だけ)
      for (let i = 0; i < N * D; i++) x[i] += dt * v[i];
    } else if (active) {
      if (c.wallClip) for (let i = 0; i < N * D; i++) { const p = x[i]; if ((p < 0 && u[i] < 0) || (p > L && u[i] > 0)) u[i] = 0; }   // 壁の中では壁の奥へ向く引きずりの速さを 0 に(比べる口 —— 壁は引きずりで運ばれない)
      for (let i = 0; i < N * D; i++) x[i] += dt * (v[i] + u[i]);
    }
    else { for (let i = 0; i < N * D; i++) x[i] += dt * v[i]; }
    walls();
    for (let i = 0; i < N * D; i++) v[i] += 0.5 * dt * a[i];
    if (c.Ttr > 0 && !c.nve) { if ((st + 1) % c.rescaleEvery === 0) rescale(v, N, D, m, c.Ttr); }
    if (st >= c.warm) { wallSum += wallNow; ttrSum += H.kinT(v, N, D, m); nMeas++; }
  }
  const area = 2 * D * Math.pow(L, D - 1), V = Math.pow(L, D);
  const P = wallSum / nMeas / area, TtrMeas = ttrSum / nMeas;
  return { N, L, rho: N / V, P, Pkin: N * TtrMeas / V, TtrMeas, nMeas, selfW,
    ke0, ke1: KE(), pe0, pe1: wallPE(), tint0, tint1: sum(Tin), es0, es1: spinE(), heatIn, gainNoSrc };
}
function rescale(v, N, D, m, T) { const t = H.kinT(v, N, D, m); if (t > 0) { const f = Math.sqrt(T / t); for (let i = 0; i < N * D; i++) v[i] *= f; } }
/** スピンの初め: rand = 定めた種で向きを散らす(大きさ s₀)/z = z にそろえる */
export function spinsInit(s, N, mag, mode, seed) {
  if (mode === 'z') { for (let i = 0; i < N; i++) { s[3 * i] = 0; s[3 * i + 1] = 0; s[3 * i + 2] = mag; } return s; }
  const r = H.lcg(seed);
  for (let i = 0; i < N; i++) { const z = 2 * r() - 1, ph = 2 * Math.PI * r(), rr = Math.sqrt(Math.max(0, 1 - z * z)); s[3 * i] = mag * rr * Math.cos(ph); s[3 * i + 1] = mag * rr * Math.sin(ph); s[3 * i + 2] = mag * z; }
  return s;
}

/** 1 点(第355便i の point と同じ種 = g の DECL.seed + N・並進の温度を T に保つ) */
export function point(spec, rho, T, o = {}) {
  const N = o.N || 64, L = o.L || H.boxL(N, rho, 3), hf = o.hf || 1;
  const r = simulate(Object.assign({}, spec, { N, L, Tint: T, Ttr: T, seed: H.DECL.seed + N, steps: DECL.steps * hf, warm: DECL.warm * hf, dt: DECL.h / hf }));
  return { rho: r.rho, T, N, L, P: r.P, Pkin: r.Pkin, Ttr: r.TtrMeas };
}
/**
 * 3 つの冪(第355便i の comboPowers と同じ測り方 —— 全体の圧力で): 密度〔箱を振る〕・密度〔粒の数を振る〕・温度。o.hf = 刻みの割り(2 で h/2)。o.nBig で粒 216 の箱の密度の冪も。
 */
export function powers(spec, o = {}) {
  const rg = DECL.rho3, rMid = rg[1], hf = o.hf || 1;
  const pr = rg.map((rho) => point(spec, rho, 1, { hf }));
  const pt = DECL.tScan.map((T) => point(spec, rMid, T, { hf }));
  const L0 = H.boxL(64, rMid, 3), pn = DECL.nScan3.map((N) => point(spec, N / Math.pow(L0, 3), 1, { N, L: L0, hf }));
  const tAll = [pt[0], pr[1], pt[1]], nAll = [pn[0], pr[1], pn[1]];
  const aBox = H.slope(pr.map((p) => p.rho), pr.map((p) => p.P)), aN = H.slope(nAll.map((p) => p.rho), nAll.map((p) => p.P)), aT = H.slope(tAll.map((p) => p.T), tAll.map((p) => p.P));
  const inW = (z) => z >= DECL.window[0] && z <= DECL.window[1];
  const big = o.nBig ? (() => { const pb = rg.map((rho) => point(spec, rho, 1, { N: o.nBig, hf })); return { N: o.nBig, pts: pb.map(pk), aBox: H.slope(pb.map((p) => p.rho), pb.map((p) => p.P)) }; })() : null;
  return { rhoPts: pr.map(pk), tPts: tAll.map(pk), nPts: nAll.map(pk), aBox, aN, aT, inWin: inW(aBox) && inW(aN) && inW(aT), pMid: pr[1].P, pOverRhoTMid: pr[1].P / (pr[1].rho * 1), big };
}
const pk = (p) => ({ rho: p.rho, T: p.T, N: p.N, P: p.P, Ttr: p.Ttr });

/** 熱を生まないことの検査の 1 走行(並進の温度の尺度の掛け直しをしない —— 走行の前後の増減) */
export function gateRun(spec, o = {}) {
  const g = DECL.gate, hf = o.hf || 1, L = H.boxL(g.N, g.rho, 3);
  const r = simulate(Object.assign({}, spec, { N: g.N, L, Tint: 1, Ttr: 1, nve: true, seed: H.DECL.seed + g.N, steps: g.steps * hf, warm: 0, dt: DECL.h / hf }));
  return { ke0: r.ke0, ke1: r.ke1, pe0: r.pe0, dKE: r.ke1 - r.ke0, dPE: r.pe1 - r.pe0, dE: (r.ke1 + r.pe1) - (r.ke0 + r.pe0), tint0: r.tint0, tint1: r.tint1, dTint: r.tint1 - r.tint0, es0: r.es0, es1: r.es1, dEs: r.es1 - r.es0, heatIn: r.heatIn, gainNoSrc: r.gainNoSrc };
}

/* ───────── 近づく 2 粒 ───────── */
/**
 * 対の走行(壁なし・自由な空間): p1 = (−d0/2, +b/2, 0)・p2 = (+d0/2, −b/2, 0)・v1 = (+v0/2, 0, 0)・v2 = −v1・スピン s₀(T) ẑ × spin(2 粒同じ向き)。
 * 自分の重みは宣言の密度 rhoSelf の B。最接近の距離・入る時と出る時の座標の相対の速さ・出る向きの曲がり(外 = 衝突径数の側へ —— 正)。
 */
export function pairRun(o = {}) {
  const P = DECL.pair, b = o.b == null ? 0 : o.b, hf = o.hf || 1, dt = DECL.h / hf, cond = o.cond || 'T', sKind = o.sKind || 'S1', spin = o.spin || 1, reading = o.reading || 'coord';
  const steps = Math.ceil(2.4 * P.d0 / (P.v0 * dt));
  const x = new Float64Array([-P.d0 / 2, b / 2, 0, P.d0 / 2, -b / 2, 0]), v = new Float64Array([P.v0 / 2, 0, 0, -P.v0 / 2, 0, 0]), s = new Float64Array(6), u = new Float64Array(6);
  spinsInit(s, 2, s0Of(P.T) * spin, 'z', 0);
  const pc = condPrm(cond, sKind, o), selfW = selfWeightB(1, P.rhoSelf, DECL.eps, 2);
  const prm = Object.assign({ selfW, m: 1, nW: DECL.nW, eps: DECL.eps }, pc), active = !!(pc.cD || pc.cS1 || pc.cS2);
  const rel = () => [x[0] - x[3], x[1] - x[4], x[2] - x[5]];
  let minD = Infinity, r0 = rel(), vIn = null, vOutV = null;
  for (let st = 0; st < steps; st++) {
    const ra = rel();
    if (active) dragVel(x, v, s, 2, prm, u);
    if (active && reading === 'force') { for (let i = 0; i < 6; i++) v[i] += dt * u[i] / DECL.tauF; for (let i = 0; i < 6; i++) x[i] += dt * v[i]; }
    else if (active) for (let i = 0; i < 6; i++) x[i] += dt * (v[i] + u[i]);
    else for (let i = 0; i < 6; i++) x[i] += dt * v[i];
    const rb = rel(), d = Math.hypot(rb[0], rb[1], rb[2]);
    if (d < minD) minD = d;
    const vr = [(rb[0] - ra[0]) / dt, (rb[1] - ra[1]) / dt, (rb[2] - ra[2]) / dt];
    if (st === 0) vIn = vr;
    vOutV = vr;
  }
  void r0;
  const rf = rel(), dEnd = Math.hypot(rf[0], rf[1], rf[2]), escaped = dEnd > 0.5 * P.d0;
  // 入る向き = −x̂ の向きの相対の位置が +x̂ へ進む(r = p1 − p2 は (−d0, b) から)。外 = +ŷ(衝突径数の側)
  const sp = (w) => Math.hypot(w[0], w[1], w[2]);
  const theta = escaped ? Math.atan2(vOutV[1], vOutV[0]) - Math.atan2(vIn[1], vIn[0]) : null;
  const dStar = Math.sqrt(1 / selfW);
  return { b, cond, sKind, spin, reading, hf, minD, vIn: sp(vIn), vOut: escaped ? sp(vOutV) : null, escaped, dEnd, theta, outPlane: escaped ? vOutV[2] / sp(vOutV) : null, dStar };
}

/* ───────── 零試験 ───────── */
export function pureScenes() {
  const z = {}, rnd = H.lcg(356001), N = 9;
  const xs = Float64Array.from({ length: 3 * N }, () => 4 * rnd()), vs = Float64Array.from({ length: 3 * N }, () => rnd() - 0.5), ss = Float64Array.from({ length: 3 * N }, () => 2 * rnd() - 1);
  const prm = (o) => Object.assign({ cD: 0, cS1: 0, cS2: 0, nW: 2, eps: 0, selfW: 0.7, m: 1 }, o), U = () => new Float64Array(3 * N);
  // z1: 係数 0 で (T) と同じ —— 自分の積分器 = 第355便g の simulate(斥力なし・並進あり)
  { const cfg = { N: 27, L: 6, Tint: 1, Ttr: 1, steps: 300, warm: 100, seed: 356003, dt: 0.02 };
    z.z1 = { mine: simulate(Object.assign({ cond: 'TDS', cD: 0, cS1: 0, cS2: 0 }, cfg)).P, mineT: simulate(Object.assign({ cond: 'T' }, cfg)).P, g: H.simulate(Object.assign({ D: 3, rep: false }, cfg)).P }; }
  // z2: 全部の粒が同じ速さで動くとき (D) は 0
  { const v1 = new Float64Array(3 * N); for (let i = 0; i < N; i++) { v1[3 * i] = 0.3; v1[3 * i + 1] = -0.7; v1[3 * i + 2] = 0.2; } z.z2 = Math.max(...dragVel(xs, v1, ss, N, prm({ cD: 1 }), U()).map(Math.abs)); }
  // z3: 1 粒だけなら 0(D・S1・S2)
  z.z3 = Math.max(...dragVel(xs.slice(0, 3), vs.slice(0, 3), ss.slice(0, 3), 1, prm({ cD: 1, cS1: 1, cS2: 1 }), new Float64Array(3)).map(Math.abs));
  // z4: 質量の同じ 2 粒の対称(D と、同じスピンの S1 と S2 で u_1 = −u_2)
  { const x2 = new Float64Array([0.1, 0.2, -0.3, 1.4, -0.5, 0.6]), v2 = new Float64Array([0.5, -0.2, 0.1, -0.3, 0.4, 0.2]), s2 = new Float64Array([0.3, -1.2, 2, 0.3, -1.2, 2]);
    z.z4 = ['cD', 'cS1', 'cS2'].map((k) => { const uu = dragVel(x2, v2, s2, 2, prm({ [k]: 1 }), new Float64Array(6)); return Math.max(Math.abs(uu[0] + uu[3]), Math.abs(uu[1] + uu[4]), Math.abs(uu[2] + uu[5])) / Math.max(1e-300, Math.hypot(uu[0], uu[1], uu[2])); }); }
  // z5: スピン 0 で (S1)・(S2) は 0
  z.z5 = Math.max(...dragVel(xs, vs, new Float64Array(3 * N), N, prm({ cS1: 1, cS2: 1 }), U()).map(Math.abs));
  // z6: (D) の n 2 の和 = 第337便e の lib の cellDrag(要素の束 1 つ・受け手ごと —— 自分の重みは selfW)
  z.z6 = (() => { const uu = dragVel(xs, vs, ss, N, prm({ cD: 1 }), U()); let worst = 0;
    for (let i = 0; i < N; i++) { const cell = []; for (let j = 0; j < N; j++) if (j !== i) cell.push({ p: [xs[3 * j], xs[3 * j + 1], xs[3 * j + 2]], v: [vs[3 * j], vs[3 * j + 1], vs[3 * j + 2]], m: 1 });
      const cd = cellDrag([xs[3 * i], xs[3 * i + 1], xs[3 * i + 2]], [vs[3 * i], vs[3 * i + 1], vs[3 * i + 2]], [cell], 0, 2, 0.7).d;
      for (let k = 0; k < 3; k++) worst = Math.max(worst, Math.abs(cd[k] - uu[3 * i + k]) / Math.max(1e-300, Math.hypot(...cd))); }
    return worst; })();
  // z7: 2 粒の座標の相対の速さ = 慣性の相対の速さ × (w_ii − w) ÷ (w_ii + w)(c_D 1 —— 閉じた形)
  { const selfW = 0.9, x2 = new Float64Array([0, 0, 0, 1.3, 0, 0]), v2 = new Float64Array([0.5, 0, 0, -0.5, 0, 0]), uu = dragVel(x2, v2, null, 2, prm({ cD: 1, selfW }), new Float64Array(6));
    const w = 1 / (1.3 * 1.3); z.z7 = { got: (v2[0] + uu[0]) - (v2[3] + uu[3]), want: 1 * (selfW - w) / (selfW + w) }; }
  // z8: 座標変換の口は慣性の速さ・内部の温度・スピンを変えない(壁なしの短い走行 —— 走行の前後で同じ)
  { const cf = { N: 8, L: 6, Tint: 1, Ttr: 1, nve: true, noWalls: true, steps: 50, warm: 0, seed: 356005, dt: 0.02, cond: 'TDS' }, r = simulate(Object.assign({ sKind: 'S1' }, cf)), r2 = simulate(Object.assign({ sKind: 'S2' }, cf));
    z.z8 = { dKE: [r.ke1 - r.ke0, r2.ke1 - r2.ke0], dT: [r.tint1 - r.tint0, r2.tint1 - r2.tint0], dEs: [r.es1 - r.es0, r2.es1 - r2.es0], ke: r.ke0 }; }
  // z9: ガリレイの変換 —— 全部の速さに同じ速さを足しても (D) は変わらない
  { const vb = vs.map((t, k) => t + [1.7, -0.4, 2.2][k % 3]), a = dragVel(xs, vs, ss, N, prm({ cD: 1 }), U()), bb = dragVel(xs, vb, ss, N, prm({ cD: 1 }), U());
    z.z9 = Math.max(...a.map((t, k) => Math.abs(t - bb[k]))); }
  // z10: スピンを逆に —— (S1) は向きが逆・(S2) は同じ
  { const sr = ss.map((t) => -t), a1 = dragVel(xs, vs, ss, N, prm({ cS1: 1 }), U()), b1 = dragVel(xs, vs, sr, N, prm({ cS1: 1 }), U()), a2 = dragVel(xs, vs, ss, N, prm({ cS2: 1 }), U()), b2 = dragVel(xs, vs, sr, N, prm({ cS2: 1 }), U());
    z.z10 = { s1: Math.max(...a1.map((t, k) => Math.abs(t + b1[k]))), s2: Math.max(...a2.map((t, k) => Math.abs(t - b2[k]))), mag: Math.max(...a1.map(Math.abs)) }; }
  // z11: 比べる口(力として効く形)の熱の口の閉じ —— 失った並進の運動エネルギー = 内部の温度の和の増え × C − 出どころなしの増え(壁なしの短い走行)
  { const r = simulate({ N: 8, L: 6, Tint: 1, Ttr: 1, nve: true, noWalls: true, steps: 50, warm: 0, seed: 356005, dt: 0.02, cond: 'TD', reading: 'force' });
    z.z11 = { lost: r.ke0 - r.ke1, heat: (r.tint1 - r.tint0) * DECL.cHeat, heatIn: r.heatIn, gain: r.gainNoSrc }; }
  // z12: 定めた手順(同じ入力で同じ数)
  { const cfg = { N: 27, L: 6, Tint: 1, Ttr: 1, steps: 200, warm: 50, seed: 356007, dt: 0.02, cond: 'TDS', sKind: 'S1' }; z.z12 = { p1: simulate(cfg).P, p2: simulate(cfg).P }; }
  return z;
}
const near = (a, b, t) => a === b || Math.abs(a - b) <= t * Math.max(Math.abs(a), Math.abs(b), 1e-300);
export function pureGates(z) {
  return {
    z1_zeroIsT: near(z.z1.mine, z.z1.g, 1e-12) && near(z.z1.mineT, z.z1.g, 1e-12) && z.z1.g > 0,
    z2_uniformD0: z.z2 <= 1e-15,
    z3_single0: z.z3 === 0,
    z4_pairSym: z.z4.every((t) => t <= 1e-12),
    z5_spin0: z.z5 === 0,
    z6_cellDrag: z.z6 <= 1e-12,
    z7_pairClosed: Math.abs(z.z7.got - z.z7.want) <= 1e-12,
    z8_noHeat: z.z8.dKE.every((t) => t === 0) && z.z8.dT.every((t) => t === 0) && z.z8.dEs.every((t) => t === 0) && z.z8.ke > 0,
    z9_galilean: z.z9 <= 1e-12,
    z10_spinFlip: z.z10.s1 <= 1e-15 * Math.max(1, z.z10.mag) && z.z10.s2 === 0 && z.z10.mag > 0,
    z11_forceHeat: near(z.z11.lost, z.z11.heat - z.z11.gain, 1e-9) && near(z.z11.heat, z.z11.heatIn, 1e-9) && z.z11.heat > 0,
    z12_determ: z.z12.p1 === z.z12.p2 && z.z12.p1 > 0,
  };
}
