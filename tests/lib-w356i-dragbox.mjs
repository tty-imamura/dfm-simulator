// 第356便i(統括の検証項目 R521): **論文 5 の「斥力に見えたのは引きずり」の診断の第 2 ラウンド —— 壁の作りに依らない測り方で数え直す純関数の lib**
//   第356便d の lib tests/lib-w356d-drageos.mjs(引きずりの口 dragVel・条件・初めの位置と速さとスピンの作り)を import して使い、本文は変えない。
//   足りない口(周期の箱の最近の像の約束・面を横切る運動量の流れ・壁を引きずる側の源として重みに入れる口・種の振り)だけをここに置き、
//   同じ入力で第356便d の数と照合する零試験を置く。診断だけ —— アプリ・エンジン・内蔵の本・受理器・既存の lib の本文は変えない。physics の鍵を足さない。
//   アナロジーとしての玩具の量(現実の熱力学の記述ではない)。列を 1 つに絞らない(候補の表)。乱数は使わない(定めた種の線形合同)。
//
// ■ 周期の箱(壁なし —— box 'pbc'): 斥力 0・壁 0・力 0。引きずりは座標変換(位置の進み = 慣性の速さ + 引きずりの速さ —— x ← x + h (v + u))。
//   力が無いので慣性の速さは走行の間ずっと変わらない(温度の掛け直しは使わない)。引きずりの重みの和は最近の像の約束(d_ij は箱の一辺で巻いた一番近い像)。
//   位置は巻かずに持つ(最近の像は差を巻いて作る —— 面を横切る数を位置の進みから直に数えるため)。
// ■ 圧力の測り方を 2 つ並べる:
//   (ア) 面を横切る運動量の流れ P_flux = Σ_横切り m abs(v_n) ÷ (測る時間 × 面の数 × 面の面積)(箱の中に決めた面 —— 向きごとに nPlane 枚・3 つの向きの平均。
//        横切りは実際の位置の進み〔v + u〕で数え、運ぶ量は慣性の運動量の法線の成分の大きさ)。符号つきの読み (ア′) = Σ_横切り m v_n × 横切りの向き(±1)も並べる(比べる欄)。
//   (イ) 並進の運動の圧力 P_kin = N m ⟨v²⟩ ÷ 3 ÷ 体積(慣性の速さだけで決まる —— 引きずりで変わらない量)。(T) では (ア) = (イ)(統計の幅の内 —— 零試験)。
// ■ 壁を引きずる側の源として重みに入れる箱(box 'wallsrc' —— 定義の延長・候補): 6 枚の壁を、質量 M_w の静止した源(壁の面の上の、粒から一番近い点)として
//   (D)・(S1) の重みと分母に入れる: w_iw = M_w ÷ (d_iw² + ε_w²)(d_iw = 粒と壁の面の距離・ε_w = 粒の半径)・壁の速さ 0・壁のスピン 0。壁の近くの粒は、壁に引きずられて位置の進みが止まる。
//   壁の力・温度の掛け直し・圧力(壁に渡る力積)は第356便d の simulate と同じ手順(M_w 0 で第356便d と同じ数 —— 零試験)。
// 記号: N = 粒の数/L = 箱の一辺/ρ = N ÷ L³/h = 刻み/M_w = 壁の質量(ノブ)/ε_w = 壁の重みの軟化の長さ/nPlane = 向きごとの面の数/種 k = 初めの位置と速さとスピンの種の番号(0 = 第356便d と同じ種)。
export const LIB_VERSION = 'w356i-dragbox-lib-1';
import * as D from './lib-w356d-drageos.mjs';
import * as H from './lib-w355g-heat3d.mjs';
import { selfWeightB } from './lib-w337e-fluid.mjs';

export const DECL = Object.freeze({
  boxes: Object.freeze(['wall', 'pbc', 'wallsrc']),   // 壁〔第356便d の正本から読む〕/周期/壁を源に
  nPlane: 8,                                          // 向きごとの面の数(面は L ÷ nPlane の間隔の格子 —— 半目ずらし)
  seedK: Object.freeze([0, 1, 2]),                    // 種 3 本(0 = 第356便d と同じ種 —— 粒の数 N の種は g の DECL.seed + N + 7919 k、スピンの種は d の spinSeed + N + 7919 k)
  seedStride: 7919,
  rho3: D.DECL.rho3, tScan: D.DECL.tScan, nScan3: D.DECL.nScan3,   // 第355便i・第356便d と同じ格子(密度 0.02・0.08・0.32/T 0.5・1・2/粒 27・64・125)
  big: Object.freeze({ N: 216, nScan: Object.freeze([125, 343]) }), // 粒 216 の箱: 粒の数を振る冪は 125・216・343(箱の一辺は粒 216・ρ 0.08 の値)
  window: D.DECL.window,
  h: D.DECL.h, steps: D.DECL.steps, warm: D.DECL.warm,
  wall: Object.freeze({ Mw: 10, MwGrid: Object.freeze([10, 100]), epsW: H.DECL.R }),
  cDGrid: Object.freeze([0.25, 0.5, 1]),
  stepTol: D.DECL.stepTol,
  zeroTol: 0.02,                                      // (T) の (ア) ÷ (イ) − 1 の許す幅(面の格子を横切る数の離散 —— 種ごと)
});
const I_MOM = D.DECL.I;

/* ───────── 引きずりの速さ(最近の像の約束) ───────── */
/**
 * 第356便d の dragVel と同じ式で、差 p_i − p_j を箱の一辺 L で巻いた一番近い像にする(L が有限のとき)。
 * 加えて、壁を源にする口(wall: { Mw, epsW, L })—— (D)・(S1) の重みと分母に、6 枚の壁(速さ 0・スピン 0)の重み M_w ÷ (d² + ε_w²) を足す。
 */
export function dragVelP(x, v, s, N, prm, u, Lp = Infinity, wall = null) {
  const { cD = 0, cS1 = 0, cS2 = 0, nW = 2, eps = 0, selfW, m = 1, R = H.DECL.R, q = H.DECL.q, kRep = H.DECL.kRep, tauS = D.DECL.tauS } = prm;
  u.fill(0);
  if (!(cD || cS1 || cS2)) return u;
  const e2 = eps * eps, half = nW / 2, per = Number.isFinite(Lp) && Lp > 0, iL = per ? 1 / Lp : 0;
  const wOn = !!(wall && wall.Mw > 0 && (cD || cS1)), Mw = wOn ? wall.Mw : 0, ew2 = wOn ? wall.epsW * wall.epsW : 0, LW = wOn ? wall.L : 0;
  for (let i = 0; i < N; i++) {
    const xi = x[3 * i], yi = x[3 * i + 1], zi = x[3 * i + 2];
    let W = selfW, nx = 0, ny = 0, nz = 0, sx = 0, sy = 0, sz = 0, rx = 0, ry = 0, rz = 0;
    if (wOn) for (let ax = 0; ax < 3; ax++) {
      const p = x[3 * i + ax], d0 = p, d1 = LW - p, w0 = Mw / (d0 * d0 + ew2), w1 = Mw / (d1 * d1 + ew2);
      W += w0 + w1;
      if (cD) { const dv = -(w0 + w1) * v[3 * i + ax]; if (ax === 0) nx += dv; else if (ax === 1) ny += dv; else nz += dv; }   // 壁の速さ 0 —— 相対の速さ (0 − v_i)
    }
    const si2 = s ? s[3 * i] * s[3 * i] + s[3 * i + 1] * s[3 * i + 1] + s[3 * i + 2] * s[3 * i + 2] : 0;
    for (let j = 0; j < N; j++) {
      if (j === i) continue;
      let dx = xi - x[3 * j], dy = yi - x[3 * j + 1], dz = zi - x[3 * j + 2];
      if (per) { dx -= Lp * Math.round(dx * iL); dy -= Lp * Math.round(dy * iL); dz -= Lp * Math.round(dz * iL); }
      const d2 = dx * dx + dy * dy + dz * dz;
      if (cD || cS1) {
        const qq = d2 + e2, w = m / (half === 1 ? qq : Math.pow(qq, half));
        W += w;
        if (cD) { nx += w * (v[3 * j] - v[3 * i]); ny += w * (v[3 * j + 1] - v[3 * i + 1]); nz += w * (v[3 * j + 2] - v[3 * i + 2]); }
        if (cS1) { const a = s[3 * j], b = s[3 * j + 1], c = s[3 * j + 2]; sx += w * (b * dz - c * dy); sy += w * (c * dx - a * dz); sz += w * (a * dy - b * dx); }
      }
      if (cS2) {
        const d = Math.sqrt(d2), gi = H.gOf(R, d, q), sj2 = s[3 * j] * s[3 * j] + s[3 * j + 1] * s[3 * j + 1] + s[3 * j + 2] * s[3 * j + 2];
        const f = kRep * (m * m / (m + m)) * (si2 * gi * gi + sj2 * gi * gi) / m;
        rx += f * dx; ry += f * dy; rz += f * dz;
      }
    }
    u[3 * i] = (cD * nx + cS1 * sx) / W + cS2 * tauS * rx;
    u[3 * i + 1] = (cD * ny + cS1 * sy) / W + cS2 * tauS * ry;
    u[3 * i + 2] = (cD * nz + cS1 * sz) / W + cS2 * tauS * rz;
  }
  return u;
}

/* ───────── 初めの状態(第356便d の simulate と同じ種・同じ順) ───────── */
export const seedOf = (N, k = 0) => H.DECL.seed + N + DECL.seedStride * k;
export const spinSeedOf = (N, k = 0) => D.DECL.spinSeed + N + DECL.seedStride * k;
/** 初めの位置・速さ・スピン(第356便d の simulate の初めの部分と同じ手順 —— k 0 で同じ数) */
export function initState(N, L, T, k = 0, spin = 1, spinMode = 'rand') {
  const Dm = 3, m = H.DECL.m, rnd = H.lcg(seedOf(N, k));
  const x = new Float64Array(N * Dm), v = new Float64Array(N * Dm), s = new Float64Array(N * Dm);
  const side = Math.max(2, Math.ceil(Math.pow(N - 1e-9, 1 / Dm))), hh = L / (side - 1);
  for (let i = 0; i < N; i++) { let kk = i; for (let ax = 0; ax < Dm; ax++) { const ix = kk % side; kk = Math.floor(kk / side); x[i * Dm + ax] = ix * hh + (rnd() - 0.5) * 0.1 * hh; } }
  if (T > 0) {
    for (let i = 0; i < N * Dm; i++) { const u1 = rnd(), u2 = rnd(); v[i] = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2); }
    for (let ax = 0; ax < Dm; ax++) { let sm = 0; for (let i = 0; i < N; i++) sm += v[i * Dm + ax]; sm /= N; for (let i = 0; i < N; i++) v[i * Dm + ax] -= sm; }
    const t = H.kinT(v, N, Dm, m); if (t > 0) { const f = Math.sqrt(T / t); for (let i = 0; i < N * Dm; i++) v[i] *= f; }
  }
  D.spinsInit(s, N, D.s0Of(T) * (spin < 0 ? -1 : 1), spinMode, spinSeedOf(N, k));
  return { x, v, s };
}

/* ───────── 周期の箱 ───────── */
/**
 * cfg: { N, L, T, cond, sKind, spin, k(種), steps, warm, dt, nPlane } + 係数の上書き(cD・cS1・cS2・nW・eps)
 * 戻り: { P(ア)・Psigned(ア′)・Pkin(イ)・ratio = P ÷ Pkin・cross(横切りの数)・vCoord(測る間の座標の速さの大きさの平均 ÷ 慣性の速さの大きさの平均)・門の量 }
 */
export function simulatePBC(cfg) {
  const c = Object.assign({ cond: 'T', sKind: 'S1', spin: 1, k: 0, steps: DECL.steps, warm: DECL.warm, dt: DECL.h, nPlane: DECL.nPlane, spinMode: 'rand' }, cfg);
  const N = c.N, L = c.L, m = H.DECL.m, dt = c.dt, Dm = 3;
  const { x, v, s } = initState(N, L, c.T, c.k, c.spin, c.spinMode);
  const u = new Float64Array(N * Dm), Tin = new Float64Array(N).fill(c.T);
  const P0 = D.condPrm(c.cond, c.sKind, c), rho = N / (L * L * L);
  const prm = { cD: P0.cD, cS1: P0.cS1, cS2: P0.cS2, nW: c.nW == null ? D.DECL.nW : c.nW, eps: c.eps == null ? D.DECL.eps : c.eps, selfW: selfWeightB(m, rho, c.eps == null ? D.DECL.eps : c.eps, 2), m, R: H.DECL.R, q: H.DECL.q, kRep: H.DECL.kRep, tauS: D.DECL.tauS };
  const active = !!(prm.cD || prm.cS1 || prm.cS2), Ls = L / c.nPlane;
  const KE = () => { let e = 0; for (let i = 0; i < N * Dm; i++) e += 0.5 * m * v[i] * v[i]; return e; };
  const spinE = () => { let e = 0; for (let i = 0; i < N * Dm; i++) e += 0.5 * I_MOM * s[i] * s[i]; return e; };
  const sum = (A) => { let t = 0; for (let i = 0; i < A.length; i++) t += A[i]; return t; };
  const ke0 = KE(), tint0 = sum(Tin), es0 = spinE();
  const cell = (p) => Math.floor(p / Ls - 0.5);   // 面の格子(半目ずらし)の番号
  let flux = 0, fluxS = 0, nCross = 0, nMeas = 0, sCoord = 0, sInert = 0;
  const xs = new Float64Array(N * Dm);
  for (let st = 0; st < c.steps; st++) {
    if (active) dragVelP(x, v, s, N, prm, u, L);
    const meas = st >= c.warm;
    if (meas) xs.set(x);
    if (active) for (let i = 0; i < N * Dm; i++) x[i] += dt * (v[i] + u[i]);
    else for (let i = 0; i < N * Dm; i++) x[i] += dt * v[i];
    if (meas) {
      nMeas++;
      for (let i = 0; i < N * Dm; i++) {
        const n = cell(x[i]) - cell(xs[i]);
        if (n !== 0) { const a = Math.abs(n); nCross += a; flux += a * m * Math.abs(v[i]); fluxS += n * m * v[i]; }
      }
      for (let i = 0; i < N; i++) {
        const ui = active ? [u[3 * i], u[3 * i + 1], u[3 * i + 2]] : [0, 0, 0];
        sCoord += Math.hypot(v[3 * i] + ui[0], v[3 * i + 1] + ui[1], v[3 * i + 2] + ui[2]); sInert += Math.hypot(v[3 * i], v[3 * i + 1], v[3 * i + 2]);
      }
    }
  }
  const tMeas = nMeas * dt, A = c.nPlane * L * L * Dm, V = L * L * L;
  const P = flux / (tMeas * A), Psigned = fluxS / (tMeas * A), Pkin = N * H.kinT(v, N, Dm, m) / V;
  // 芯に居る粒の割合(終わりに、最近の像で d★ × 1.05 の内に相手が居る粒 —— d★ = 1 ÷ √w_ii・2 粒の座標の相対の速さが 0 になる距離)
  const dCore = 1.05 / Math.sqrt(prm.selfW); let nCore = 0;
  for (let i = 0; i < N; i++) { for (let j = 0; j < N; j++) { if (j === i) continue; let dd = 0; for (let ax = 0; ax < Dm; ax++) { let t = x[3 * i + ax] - x[3 * j + ax]; t -= L * Math.round(t / L); dd += t * t; } if (dd < dCore * dCore) { nCore++; break; } } }
  return { N, L, rho, T: c.T, k: c.k, P, Psigned, Pkin, ratio: P / Pkin, cross: nCross, vCoord: sCoord / sInert, nMeas, coreFrac: nCore / N,
    ke0, ke1: KE(), tint0, tint1: sum(Tin), es0, es1: spinE(), x: c.keepX ? Array.from(x) : undefined };
}

/* ───────── 壁を引きずる側の源として重みに入れる箱(第356便d の simulate と同じ手順 + 壁の重み) ───────── */
/**
 * cfg: 第356便d の simulate の cfg と同じ(壁・温度の掛け直し・圧力 = 壁に渡る力積)+ { Mw, epsW, k(種) }。座標変換の口だけ。M_w 0 で第356便d の simulate と同じ数(零試験)。
 */
export function simulateWallSrc(cfg) {
  const c = Object.assign({}, H.DECL, { cond: 'T', sKind: 'S1', spin: 1, k: 0, Mw: DECL.wall.Mw, epsW: DECL.wall.epsW, spinMode: 'rand', nve: false }, cfg);
  const Dm = 3, N = c.N, L = c.L, m = c.m, dt = c.dt;
  const { x, v, s } = initState(N, L, c.Ttr, c.k, c.spin, c.spinMode);
  const a = new Float64Array(N * Dm), u = new Float64Array(N * Dm), Tin = new Float64Array(N).fill(c.Tint);
  const P0 = D.condPrm(c.cond, c.sKind, c), selfW = selfWeightB(m, N / Math.pow(L, Dm), c.eps == null ? D.DECL.eps : c.eps, 2);
  const prm = { cD: P0.cD, cS1: P0.cS1, cS2: P0.cS2, nW: c.nW == null ? D.DECL.nW : c.nW, eps: c.eps == null ? D.DECL.eps : c.eps, selfW, m, R: c.R, q: c.q, kRep: c.kRep, tauS: D.DECL.tauS };
  const active = !!(prm.cD || prm.cS1 || prm.cS2), wall = c.Mw > 0 ? { Mw: c.Mw, epsW: c.epsW, L } : null;
  let wallNow = 0;
  const walls = () => {
    a.fill(0); wallNow = 0;
    for (let i = 0; i < N; i++) for (let ax = 0; ax < Dm; ax++) {
      const p = x[i * Dm + ax];
      if (p < 0) { const f = c.wallK * (-p); a[i * Dm + ax] += f / m; wallNow += f; }
      else if (p > L) { const f = c.wallK * (p - L); a[i * Dm + ax] -= f / m; wallNow += f; }
    }
  };
  const wallPE = () => { let e = 0; for (let i = 0; i < N * Dm; i++) { const p = x[i]; if (p < 0) e += 0.5 * c.wallK * p * p; else if (p > L) e += 0.5 * c.wallK * (p - L) * (p - L); } return e; };
  const KE = () => { let e = 0; for (let i = 0; i < N * Dm; i++) e += 0.5 * m * v[i] * v[i]; return e; };
  const spinE = () => { let e = 0; for (let i = 0; i < N * Dm; i++) e += 0.5 * I_MOM * s[i] * s[i]; return e; };
  const sum = (A) => { let t = 0; for (let i = 0; i < A.length; i++) t += A[i]; return t; };
  walls();
  const ke0 = KE(), pe0 = wallPE(), tint0 = sum(Tin), es0 = spinE();
  let wallSum = 0, ttrSum = 0, nMeas = 0;
  for (let st = 0; st < c.steps; st++) {
    for (let i = 0; i < N * Dm; i++) v[i] += 0.5 * dt * a[i];
    if (active) { dragVelP(x, v, s, N, prm, u, Infinity, wall); for (let i = 0; i < N * Dm; i++) x[i] += dt * (v[i] + u[i]); }
    else for (let i = 0; i < N * Dm; i++) x[i] += dt * v[i];
    walls();
    for (let i = 0; i < N * Dm; i++) v[i] += 0.5 * dt * a[i];
    if (c.Ttr > 0 && !c.nve) { if ((st + 1) % c.rescaleEvery === 0) { const t = H.kinT(v, N, Dm, m); if (t > 0) { const f = Math.sqrt(c.Ttr / t); for (let i = 0; i < N * Dm; i++) v[i] *= f; } } }
    if (st >= c.warm) { wallSum += wallNow; ttrSum += H.kinT(v, N, Dm, m); nMeas++; }
  }
  const area = 2 * Dm * Math.pow(L, Dm - 1), V = Math.pow(L, Dm);
  const P = wallSum / nMeas / area, TtrMeas = ttrSum / nMeas;
  return { N, L, rho: N / V, P, Pkin: N * TtrMeas / V, TtrMeas, nMeas, ke0, ke1: KE(), pe0, pe1: wallPE(), tint0, tint1: sum(Tin), es0, es1: spinE() };
}

/* ───────── 点と 3 つの冪 ───────── */
/** 1 点(box 'pbc' | 'wallsrc'・並進の温度 T・種 k・刻みの割り hf) */
export function point(box, spec, rho, T, o = {}) {
  const N = o.N || 64, L = o.L || H.boxL(N, rho, 3), hf = o.hf || 1, k = o.k || 0;
  const base = { N, L, k, steps: DECL.steps * hf, warm: DECL.warm * hf, dt: DECL.h / hf };
  if (box === 'pbc') { const r = simulatePBC(Object.assign({}, spec, base, { T })); return { rho: r.rho, T, N, L, P: r.P, Psigned: r.Psigned, Pkin: r.Pkin, ratio: r.ratio, vCoord: r.vCoord, cross: r.cross, coreFrac: r.coreFrac }; }
  const r = simulateWallSrc(Object.assign({}, spec, base, { Tint: T, Ttr: T }));
  return { rho: r.rho, T, N, L, P: r.P, Pkin: r.Pkin, ratio: r.P / r.Pkin, Ttr: r.TtrMeas };
}
/**
 * 3 つの冪(第355便i・第356便d と同じ測り方): 密度〔箱を振る〕・密度〔粒の数を振る —— 箱の一辺は中の密度の値〕・温度。o: { hf, k, N0(64 か 216), nScan }。
 */
export function powers(box, spec, o = {}) {
  const rg = DECL.rho3, rMid = rg[1], hf = o.hf || 1, k = o.k || 0, N0 = o.N0 || 64, nScan = o.nScan || DECL.nScan3;
  const pr = rg.map((rho) => point(box, spec, rho, 1, { N: N0, hf, k }));
  const pt = DECL.tScan.map((T) => point(box, spec, rMid, T, { N: N0, hf, k }));
  const L0 = H.boxL(N0, rMid, 3), pn = nScan.map((N) => point(box, spec, N / Math.pow(L0, 3), 1, { N, L: L0, hf, k }));
  const tAll = [pt[0], pr[1], pt[1]], nAll = [pn[0], pr[1], pn[1]];
  const aBox = H.slope(pr.map((p) => p.rho), pr.map((p) => p.P)), aN = H.slope(nAll.map((p) => p.rho), nAll.map((p) => p.P)), aT = H.slope(tAll.map((p) => p.T), tAll.map((p) => p.P));
  const pk = (p) => { const q = { rho: p.rho, T: p.T, N: p.N, P: p.P, Pkin: p.Pkin, ratio: p.ratio }; if (p.Psigned !== undefined) { q.Psigned = p.Psigned; q.vCoord = p.vCoord; q.coreFrac = p.coreFrac; } return q; };
  return { rhoPts: pr.map(pk), tPts: tAll.map(pk), nPts: nAll.map(pk), aBox, aN, aT, pMid: pr[1].P, ratioMid: pr[1].ratio };
}
/** 種の散り: 値の列 → { mean, half(最大 − 最小 の半分), vals } */
export function spread(vals) {
  const mean = vals.reduce((t, x) => t + x, 0) / vals.length;
  return { mean, half: (Math.max(...vals) - Math.min(...vals)) / 2, vals };
}
/** 幅の内か: abs(a − b) ≤ 幅 a + 幅 b */
export const withinWidth = (A, B) => Math.abs(A.mean - B.mean) <= A.half + B.half;

/* ───────── 零試験 ───────── */
export function pureScenes() {
  const z = {}, rnd = H.lcg(356101), N = 9;
  const xs = Float64Array.from({ length: 3 * N }, () => 4 * rnd()), vs = Float64Array.from({ length: 3 * N }, () => rnd() - 0.5), ss = Float64Array.from({ length: 3 * N }, () => 2 * rnd() - 1);
  const prm = (o) => Object.assign({ cD: 0, cS1: 0, cS2: 0, nW: 2, eps: 0, selfW: 0.7, m: 1 }, o), U = () => new Float64Array(3 * N);
  // y1: 周期の約束が効かない一辺(1e9)と、壁なしでは第356便d の dragVel と同じ数(D・S1・S2)
  z.y1 = ['cD', 'cS1', 'cS2'].map((kk) => { const a = D.dragVel(xs, vs, ss, N, prm({ [kk]: 1 }), U()), b = dragVelP(xs, vs, ss, N, prm({ [kk]: 1 }), U(), 1e9); return Math.max(...a.map((t, i) => Math.abs(t - b[i]))) / Math.max(...a.map(Math.abs)); });
  // y2: 周期の箱で、1 粒を一辺 L だけずらしても引きずりの速さは同じ(像の不変)
  { const Lp = 5, x2 = xs.slice(); x2[3 * 4 + 1] += Lp; x2[3 * 7] -= 2 * Lp;
    z.y2 = ['cD', 'cS1', 'cS2'].map((kk) => { const a = dragVelP(xs, vs, ss, N, prm({ [kk]: 1 }), U(), Lp), b = dragVelP(x2, vs, ss, N, prm({ [kk]: 1 }), U(), Lp); return Math.max(...a.map((t, i) => Math.abs(t - b[i]))) / Math.max(...a.map(Math.abs)); }); }
  // y3: 周期の箱で、全部の粒を同じだけ動かしても同じ(並進の不変)
  { const Lp = 5, x3 = xs.map((t, i) => t + [1.3, -2.9, 0.77][i % 3]);
    z.y3 = ['cD', 'cS1', 'cS2'].map((kk) => { const a = dragVelP(xs, vs, ss, N, prm({ [kk]: 1 }), U(), Lp), b = dragVelP(x3, vs, ss, N, prm({ [kk]: 1 }), U(), Lp); return Math.max(...a.map((t, i) => Math.abs(t - b[i]))) / Math.max(...a.map(Math.abs)); }); }
  // y4: 初めの状態は第356便d の simulate と同じ(種 0 —— 運動エネルギー・スピンのエネルギー)
  { const N4 = 27, L4 = 6, d = D.simulate({ N: N4, L: L4, Tint: 1, Ttr: 1, steps: 1, warm: 0, seed: H.DECL.seed + N4, cond: 'T' }), st = initState(N4, L4, 1, 0);
    let ke = 0, es = 0; for (let i = 0; i < 3 * N4; i++) { ke += 0.5 * st.v[i] * st.v[i]; es += 0.5 * I_MOM * st.s[i] * st.s[i]; }
    z.y4 = { ke, keD: d.ke0, es, esD: d.es0 }; }
  // y5: 壁を源にする口の M_w 0 は第356便d の simulate と同じ数(壁・温度の掛け直し・圧力)
  { const cfg = { N: 27, L: 6, Tint: 1, Ttr: 1, steps: 300, warm: 100, dt: 0.02, cond: 'TD' };
    z.y5 = { mine: simulateWallSrc(Object.assign({ Mw: 0 }, cfg)).P, d: D.simulate(Object.assign({ seed: H.DECL.seed + 27 }, cfg)).P }; }
  // y6: 壁を源にする 1 粒の閉じた形: u = −v (w_0 + w_1) ÷ (w_ii + w_0 + w_1)(向きごと)
  { const Lw = 4, p = [0.7, 2, 3.6], v1 = new Float64Array([0.4, -0.3, 0.2]), uu = dragVelP(new Float64Array(p), v1, null, 1, prm({ cD: 1, selfW: 0.7 }), new Float64Array(3), Infinity, { Mw: 10, epsW: 0.5, L: Lw });
    let W = 0.7; const wa = p.map((q) => 10 / (q * q + 0.25) + 10 / ((Lw - q) * (Lw - q) + 0.25)); for (const w of wa) W += w;
    z.y6 = Math.max(...[0, 1, 2].map((ax) => Math.abs(uu[ax] - (-v1[ax] * wa[ax] / W)))); }
  // y7: 周期の箱の (T) は横切りを步ごとに足した数 = 終わりと初めの面の番号の差(慣性の速さが変わらないので、行きっぱなし)
  { const r = simulatePBC({ N: 27, L: 6, T: 1, steps: 400, warm: 0, keepX: true }), st = initState(27, 6, 1, 0), Ls = 6 / DECL.nPlane;
    let n = 0; for (let i = 0; i < 81; i++) n += Math.abs(Math.floor(r.x[i] / Ls - 0.5) - Math.floor(st.x[i] / Ls - 0.5));
    z.y7 = { step: r.cross, ends: n }; }
  // y8: 周期の箱の (T) では (ア) = (イ)(面の格子を横切る数の離散の内 —— 3 つの種)と、符号つき (ア′) = (ア)
  z.y8 = DECL.seedK.map((k) => { const r = simulatePBC({ N: 64, L: H.boxL(64, 0.08, 3), T: 1, k }); return { ratio: r.ratio, signed: r.Psigned / r.P }; });
  // y9: 周期の箱で、座標変換の口は慣性の運動エネルギー・内部の温度・スピンのエネルギーを変えない(条件 5 —— 丁度 0)・初めは (T) と同じ
  { const L9 = H.boxL(27, 0.08, 3), base = simulatePBC({ N: 27, L: L9, T: 1, steps: 200, warm: 0 });
    z.y9 = [['TD', 'S1', 1], ['TS', 'S1', 1], ['TS', 'S1', -1], ['TS', 'S2', 1], ['TDS', 'S1', 1]].map(([cond, sKind, spin]) => { const r = simulatePBC({ N: 27, L: L9, T: 1, steps: 200, warm: 0, cond, sKind, spin });
      return { dKE: r.ke1 - r.ke0, dT: r.tint1 - r.tint0, dEs: r.es1 - r.es0, keSame: near(r.ke0, base.ke0, 1e-12) && near(r.es0, base.es0, 1e-12) }; }); }   // 尺度の走り直しでは Math の関数の戻り値がずれるので相対 1e-12 で(同じ走りの中では丁度同じ —— 器の門)
  // y10: 係数 0 の周期の箱は (T) と同じ数
  { const L10 = H.boxL(27, 0.08, 3); z.y10 = { a: simulatePBC({ N: 27, L: L10, T: 1, steps: 300, warm: 100, cond: 'TDS', cD: 0, cS1: 0, cS2: 0 }).P, b: simulatePBC({ N: 27, L: L10, T: 1, steps: 300, warm: 100 }).P }; }
  // y11: ガリレイの変換(周期の箱)—— 全部の速さに同じ速さを足しても (D) は変わらない
  { const vb = vs.map((t, i) => t + [1.7, -0.4, 2.2][i % 3]), a = dragVelP(xs, vs, ss, N, prm({ cD: 1 }), U(), 5), b = dragVelP(xs, vb, ss, N, prm({ cD: 1 }), U(), 5); z.y11 = Math.max(...a.map((t, i) => Math.abs(t - b[i]))); }
  // y12: 定めた手順(同じ入力で同じ数)
  { const cfg = { N: 27, L: 6, T: 1, steps: 200, warm: 50, cond: 'TDS', sKind: 'S1', k: 1 }; z.y12 = { p1: simulatePBC(cfg).P, p2: simulatePBC(cfg).P }; }
  return z;
}
const near = (a, b, t) => a === b || Math.abs(a - b) <= t * Math.max(Math.abs(a), Math.abs(b), 1e-300);
export function pureGates(z) {
  return {
    y1_sameAsD: z.y1.every((t) => t === 0),
    y2_imageInv: z.y2.every((t) => t <= 1e-12),
    y3_shiftInv: z.y3.every((t) => t <= 1e-12),
    y4_initSameAsD: z.y4.ke === z.y4.keD && z.y4.es === z.y4.esD && z.y4.ke > 0,
    y5_wallSrc0IsD: near(z.y5.mine, z.y5.d, 1e-12) && z.y5.d > 0,
    y6_wallClosed: z.y6 <= 1e-15,
    y7_crossCount: z.y7.step === z.y7.ends && z.y7.step > 0,
    y8_fluxIsKin: z.y8.every((r) => Math.abs(r.ratio - 1) <= DECL.zeroTol && Math.abs(r.signed - 1) <= 1e-12),
    y9_noHeatPBC: z.y9.every((r) => r.dKE === 0 && r.dT === 0 && r.dEs === 0 && r.keSame),
    y10_zeroIsT: z.y10.a === z.y10.b && z.y10.a > 0,
    y11_galilean: z.y11 <= 1e-12,
    y12_determ: z.y12.p1 === z.y12.p2 && z.y12.p1 > 0,
  };
}
