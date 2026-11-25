// 第355便g(統括の検証項目 R510): **論文 5 の三次元の熱の項 —— 形の候補の表のための純関数の lib**
//   (アプリではない小さな積分器・候補の斥力の則・熱への依り方・三次元の摩擦と拡散の候補・圧力の密度と温度への冪)。
//   診断だけ —— アプリ・エンジン・内蔵の本・受理器・既存の lib の本文は変えない。physics の鍵を足さない。三次元の受理の門は変えない。
//   アナロジーとしての玩具の量(現実の熱力学の記述ではない)。列を 1 つに絞らない(候補の表)。乱数は使わない(定めた種の線形合同)。
//
// 記号: D = 次元(2・3)/N = 粒の数/L = 箱の一辺/ρ = N ÷ L^D/T = 温度の読み(内部の温度 T_int と並進の温度 T_tr —— m = 1・k = 1 の玩具の単位)/
//   g_a = (R_a ÷ (R_a + d))^q(アプリの E5′ の距離の則と同じ形)/μ = m_i m_j ÷ (m_i + m_j)。
//   斥力の対の力は F_i = f × (r_i − r_j)(中心力・ベクトルは長さつき —— アプリの E5′ と同じ書き方)。
export const LIB_VERSION = 'w355g-heat3d-lib-1';

export const DECL = Object.freeze({
  dims: Object.freeze([2, 3]),
  laws: Object.freeze(['L0', 'L1', 'L2']),            // L0 二次元の形をそのまま・L1 立体角で薄める(× (R̄ ÷ (R̄ + d))^(D − 2))・L2 近くの粒の数で割る(× 2 ÷ (n_i + n_j))
  heatForms: Object.freeze(['prod', 'sum', 'other']),  // 積 √(T_i T_j)・和 (T_i + T_j) ÷ 2・相手だけ(i が受ける力は T_j)
  carriers: Object.freeze(['A', 'I', 'U']),            // (ア) スカラーの内部温度だけ/(イ) スピンのベクトルの大きさ/(ウ) 両方(ノブで切り替え)
  q: 2, R: 0.5, m: 1, kRep: 20, wallK: 400, dt: 0.02, steps: 3000, warm: 800, stepsStatic: 3000, warmStatic: 1800, dtStatic: 0.05, rescaleEvery: 10, damp: 0.02,
  N: 64, rho2: Object.freeze([0.1, 0.2, 0.4]), rho3: Object.freeze([0.02, 0.04, 0.08]), tGrid: Object.freeze([0.5, 1, 2]),
  nBig: 216, seed: 355007,
  window: Object.freeze([0.9, 1.1]),                   // 「理想気体の則の冪(1)の近く」と読む窓(表の印だけ —— 結論にしない)
  zeroWindow2D: Object.freeze({ rho: Object.freeze([1.6, 2.4]), T: Object.freeze([0.95, 1.05]) }),
});

/* ───────── 定めた種の線形合同(乱数は使わない) ───────── */
export function lcg(seed) {
  let s = (seed >>> 0) || 1;
  return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return (s + 0.5) / 4294967296; };
}

/* ───────── 熱への依り方(対の H) ───────── */
/** [i が受ける力に掛ける温度, j が受ける力に掛ける温度] */
export function heatH(form, Ti, Tj) {
  if (form === 'prod') { const h = (Ti > 0 && Tj > 0) ? Math.sqrt(Ti * Tj) : 0; return [h, h]; }
  if (form === 'sum') { const h = 0.5 * (Ti + Tj); return [h, h]; }
  if (form === 'other') return [Tj, Ti];
  throw new Error('heatH: form ' + form);
}

/** 距離の則 g_a = (R_a ÷ (R_a + d))^q */
export const gOf = (Ra, d, q) => { const t = Ra / (Ra + d); return q === 2 ? t * t : Math.pow(t, q); };

/**
 * 対の斥力の係数 f(F_i = f_i (r_i − r_j)・F_j = −f_j (r_i − r_j))
 * law L0: kRep μ H (g_i² + g_j²)(アプリの E5′・tint の形 —— 二次元で今の式)
 * law L1: L0 × (R̄ ÷ (R̄ + d))^(D − 2)(立体角で薄める —— D = 2 で L0 に戻る)
 * law L2: L0 × 2 ÷ (n_i + n_j)(n_a = 1 + Σ_b g_ab² —— 自分を含めた近くの粒の数で割る。ノブ。薄い所で L0 に戻る・D = 2 でも密な所は今の式と違う)
 */
export function pairCoef(o) {
  const { law, D, d, Ri, Rj, mi, mj, Ti, Tj, form, q, kRep, ni, nj } = o;
  const mu = mi * mj / (mi + mj), gi = gOf(Ri, d, q), gj = gOf(Rj, d, q), base = kRep * mu * (gi * gi + gj * gj);
  const [hi, hj] = heatH(form, Ti, Tj);
  let fac = 1;
  if (law === 'L1') { const Rb = 0.5 * (Ri + Rj); fac = D === 3 ? Rb / (Rb + d) : 1; }
  else if (law === 'L2') fac = (ni + nj) > 0 ? 2 / (ni + nj) : 0;
  else if (law !== 'L0') throw new Error('pairCoef: law ' + law);
  return [base * hi * fac, base * hj * fac];
}

/** アプリの E5′(thermal:"tint")の二次元の式を別に書いたもの(零試験の照合用 —— アプリの html の E5′ の行と同じ形) */
export function appE5tint(d, Ri, Rj, mi, mj, Ti, Tj, q, kRep) {
  const ti2 = Ri / (Ri + d), tj2 = Rj / (Rj + d);
  const gi = (q === 2) ? ti2 * ti2 : Math.pow(ti2, q), gj = (q === 2) ? tj2 * tj2 : Math.pow(tj2, q);
  return (Ti > 0 && Tj > 0) ? kRep * (mi * mj / (mi + mj)) * Math.sqrt(Ti * Tj) * (gi * gi + gj * gj) : 0;
}

/* ───────── 小さな積分器(箱・柔らかい壁・候補の斥力の則) ───────── */
/**
 * cfg: { D, N, L, law, form, Tint, Ttr, rep(真で斥力あり), steps, warm, seed, q, R, kRep, wallK, dt }
 * 圧力 = 壁に渡る力の時間平均の和 ÷ (2D × 面の大きさ L^(D−1))(二次元では面は長さ)。
 * Ttr > 0: 並進の温度を Ttr に保つ(rescaleEvery 步ごとの速さの尺度の掛け直し —— 定めた手順)。Ttr = 0: 並進を減衰させて止める(静的な押し合い)。
 */
export function simulate(cfg) {
  const c = Object.assign({}, DECL, cfg), D = c.D, N = c.N, L = c.L, R = c.R, m = c.m, dt = c.dt, rnd = lcg(c.seed);
  const x = new Float64Array(N * D), v = new Float64Array(N * D), a = new Float64Array(N * D), nn = new Float64Array(N);
  // 格子に置く(壁から壁まで —— 端の粒は壁の上)+ 小さな定めたずらし
  const side = Math.max(2, Math.ceil(Math.pow(N - 1e-9, 1 / D))), h = L / (side - 1);
  for (let i = 0; i < N; i++) {
    let k = i;
    for (let ax = 0; ax < D; ax++) { const ix = k % side; k = Math.floor(k / side); x[i * D + ax] = ix * h + (rnd() - 0.5) * 0.1 * h; }
  }
  if (c.Ttr > 0) {
    for (let i = 0; i < N * D; i++) { const u1 = rnd(), u2 = rnd(); v[i] = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2); }
    for (let ax = 0; ax < D; ax++) { let s = 0; for (let i = 0; i < N; i++) s += v[i * D + ax]; s /= N; for (let i = 0; i < N; i++) v[i * D + ax] -= s; }
    rescale(v, N, D, m, c.Ttr);
  }
  const Ti = c.Tint;
  let wallNow = 0;
  const force = () => {
    a.fill(0); wallNow = 0;
    if (c.rep) {
      if (c.law === 'L2') {
        nn.fill(1);   // 自分を 1 つと数える(n_a = 1 + Σ_b g_ab² —— 薄い所で L0 に戻る)
        for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
          let d2 = 0; for (let ax = 0; ax < D; ax++) { const e = x[i * D + ax] - x[j * D + ax]; d2 += e * e; }
          const g = gOf(R, Math.sqrt(d2), c.q), g2 = g * g; nn[i] += g2; nn[j] += g2;
        }
      }
      for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
        let d2 = 0; for (let ax = 0; ax < D; ax++) { const e = x[i * D + ax] - x[j * D + ax]; d2 += e * e; }
        const d = Math.sqrt(d2);
        const [fi, fj] = pairCoef({ law: c.law, D, d, Ri: R, Rj: R, mi: m, mj: m, Ti, Tj: Ti, form: c.form, q: c.q, kRep: c.kRep, ni: nn[i], nj: nn[j] });
        for (let ax = 0; ax < D; ax++) { const e = x[i * D + ax] - x[j * D + ax]; a[i * D + ax] += fi * e / m; a[j * D + ax] -= fj * e / m; }
      }
    }
    for (let i = 0; i < N; i++) for (let ax = 0; ax < D; ax++) {
      const p = x[i * D + ax];
      if (p < 0) { const f = c.wallK * (-p); a[i * D + ax] += f / m; wallNow += f; }
      else if (p > L) { const f = c.wallK * (p - L); a[i * D + ax] -= f / m; wallNow += f; }
    }
  };
  force();
  let wallSum = 0, ttrSum = 0, nMeas = 0;
  for (let st = 0; st < c.steps; st++) {
    for (let i = 0; i < N * D; i++) { v[i] += 0.5 * dt * a[i]; x[i] += dt * v[i]; }
    force();
    for (let i = 0; i < N * D; i++) v[i] += 0.5 * dt * a[i];
    if (c.Ttr > 0) { if ((st + 1) % c.rescaleEvery === 0) rescale(v, N, D, m, c.Ttr); }
    else for (let i = 0; i < N * D; i++) v[i] *= (1 - c.damp);
    if (st >= c.warm) { wallSum += wallNow; ttrSum += kinT(v, N, D, m); nMeas++; }
  }
  const area = 2 * D * Math.pow(L, D - 1), V = Math.pow(L, D);
  const P = wallSum / nMeas / area, TtrMeas = ttrSum / nMeas;
  return { D, N, L, rho: N / V, P, Pkin: N * TtrMeas / V, TtrMeas, nMeas };
}
export function kinT(v, N, D, m) { let s = 0; for (let i = 0; i < N * D; i++) s += v[i] * v[i]; return m * s / (N * D); }
function rescale(v, N, D, m, T) { const t = kinT(v, N, D, m); if (t > 0) { const f = Math.sqrt(T / t); for (let i = 0; i < N * D; i++) v[i] *= f; } }

/** 箱の一辺(N と ρ から) */
export const boxL = (N, rho, D) => Math.pow(N / rho, 1 / D);

/** log–log の最小二乗の傾き */
export function slope(xs, ys) {
  const lx = xs.map(Math.log), ly = ys.map(Math.log), n = lx.length, mx = lx.reduce((s, t) => s + t, 0) / n, my = ly.reduce((s, t) => s + t, 0) / n;
  let sxy = 0, sxx = 0; for (let k = 0; k < n; k++) { sxy += (lx[k] - mx) * (ly[k] - my); sxx += (lx[k] - mx) * (lx[k] - mx); }
  return sxy / sxx;
}

/* ───────── 候補の列(状態方程式の診断) ───────── */
// rep: 斥力あり/Ttr: 並進の温度を T に保つ('T')か止める(0)/law・form
export const COLS = Object.freeze([
  Object.freeze({ id: 'K2-L0', D: 2, rep: true, law: 'L0', form: 'prod', tr: false, note: '二次元・今の形(E5′・tint)・並進なし —— 零試験の列' }),
  Object.freeze({ id: 'K2-L0t', D: 2, rep: true, law: 'L0', form: 'prod', tr: true, note: '二次元・今の形 + 並進の温度 = 内部の温度' }),
  Object.freeze({ id: 'G2', D: 2, rep: false, law: null, form: null, tr: true, note: '二次元・並進だけ(斥力なし)' }),
  Object.freeze({ id: 'G3', D: 3, rep: false, law: null, form: null, tr: true, note: '三次元・並進だけ(斥力なし)' }),
  Object.freeze({ id: 'A3-L0', D: 3, rep: true, law: 'L0', form: 'prod', tr: false, note: '三次元・二次元の形をそのまま・並進なし' }),
  Object.freeze({ id: 'B3-L1', D: 3, rep: true, law: 'L1', form: 'prod', tr: false, note: '三次元・立体角で薄める・並進なし' }),
  Object.freeze({ id: 'C3-L2', D: 3, rep: true, law: 'L2', form: 'prod', tr: false, note: '三次元・近くの粒の数で割る・並進なし' }),
  Object.freeze({ id: 'A3-L0t', D: 3, rep: true, law: 'L0', form: 'prod', tr: true, note: '三次元・二次元の形 + 並進' }),
  Object.freeze({ id: 'B3-L1t', D: 3, rep: true, law: 'L1', form: 'prod', tr: true, note: '三次元・立体角で薄める + 並進' }),
  Object.freeze({ id: 'C3-L2t', D: 3, rep: true, law: 'L2', form: 'prod', tr: true, note: '三次元・近くの粒の数で割る + 並進' }),
]);
export const colOf = (id) => COLS.find((c) => c.id === id);

/** 1 つの列の 1 点(ρ・T) */
export function point(colId, rho, T, o = {}) {
  const c = colOf(colId), N = o.N || DECL.N, L = boxL(N, rho, c.D);
  const r = simulate({ D: c.D, N, L, rep: c.rep, law: c.law, form: c.form || 'prod', Tint: T, Ttr: c.tr ? T : 0, seed: DECL.seed + N, steps: o.steps || (c.tr ? DECL.steps : DECL.stepsStatic), warm: o.warm || (c.tr ? DECL.warm : DECL.warmStatic), dt: c.tr ? DECL.dt : DECL.dtStatic });
  return { col: colId, rho: r.rho, T, N, L, P: r.P, Pkin: r.Pkin, Prep: r.P - r.Pkin, Ttr: r.TtrMeas };
}

/** 列の冪の表(密度の冪は T = 1 で ρ を振る・温度の冪は ρ = 中の値で T を振る) */
export function colPowers(colId, o = {}) {
  const c = colOf(colId), rg = c.D === 2 ? DECL.rho2 : DECL.rho3, tg = DECL.tGrid, rMid = rg[1];
  const pr = rg.map((rho) => point(colId, rho, 1, o)), pt = tg.map((T) => point(colId, rMid, T, o));
  const aR = slope(pr.map((p) => p.rho), pr.map((p) => p.P)), aT = slope(pt.map((p) => p.T), pt.map((p) => p.P));
  const repR = c.rep && c.tr ? slope(pr.map((p) => p.rho), pr.map((p) => Math.max(p.Prep, 1e-300))) : null;
  const repT = c.rep && c.tr ? slope(pt.map((p) => p.T), pt.map((p) => Math.max(p.Prep, 1e-300))) : null;
  const ratio = c.rep && c.tr ? pr.map((p) => p.Prep / p.Pkin) : null;   // 斥力の分 ÷ 並進の分(T = 1)
  const ideal = pr.map((p) => p.P / (p.rho * 1));                         // P ÷ (ρ T)
  const inWin = (x) => x >= DECL.window[0] && x <= DECL.window[1];
  return { col: colId, D: c.D, N: o.N || DECL.N, rhoPts: pr, tPts: pt, aRho: aR, aT, aRhoRep: repR, aTRep: repT, repOverKin: ratio, pOverRhoT: ideal, nearIdeal: inWin(aR) && inWin(aT) };
}

/** 粒の数を振る(ρ を N で変える —— 箱の一辺は中の値で固定): 示量の性のちがい */
export function nScan(colId, Ns) {
  const c = colOf(colId), rMid = (c.D === 2 ? DECL.rho2 : DECL.rho3)[1], L = boxL(DECL.N, rMid, c.D);
  const pts = Ns.map((N) => { const r = simulate({ D: c.D, N, L, rep: c.rep, law: c.law, form: c.form || 'prod', Tint: 1, Ttr: c.tr ? 1 : 0, seed: DECL.seed + N, steps: c.tr ? DECL.steps : DECL.stepsStatic, warm: c.tr ? DECL.warm : DECL.warmStatic, dt: c.tr ? DECL.dt : DECL.dtStatic });
    return { N, rho: r.rho, P: r.P, Pkin: r.Pkin }; });
  return { col: colId, L, pts, aRhoN: slope(pts.map((p) => p.rho), pts.map((p) => p.P)) };
}

/** 斥力の強さ(kRep の倍)を振る —— 並進あり の列で、全体の密度の冪が斥力の分と並進の分の重みでどう動くか */
export function kScan(colId, mults) {
  const c = colOf(colId), rg = c.D === 2 ? DECL.rho2 : DECL.rho3;
  return mults.map((mk) => {
    const pts = rg.map((rho) => { const r = simulate({ D: c.D, N: DECL.N, L: boxL(DECL.N, rho, c.D), rep: c.rep, law: c.law, form: c.form, Tint: 1, Ttr: 1, kRep: DECL.kRep * mk, seed: DECL.seed + DECL.N });
      return { rho: r.rho, P: r.P, Pkin: r.Pkin }; });
    return { col: colId, mult: mk, kRep: DECL.kRep * mk, aRho: slope(pts.map((p) => p.rho), pts.map((p) => p.P)), repOverKinMid: (pts[1].P - pts[1].Pkin) / pts[1].Pkin, pOverRhoTMid: pts[1].P / pts[1].rho };
  });
}

/* ───────── 三次元の摩擦の候補(E9 の接線の摩擦をベクトルへ) ───────── */
const cross = (p, q) => [p[1] * q[2] - p[2] * q[1], p[2] * q[0] - p[0] * q[2], p[0] * q[1] - p[1] * q[0]];
const dot = (p, q) => p[0] * q[0] + p[1] * q[1] + p[2] * q[2];
const add = (p, q, s = 1) => [p[0] + s * q[0], p[1] + s * q[1], p[2] + s * q[2]];
const scl = (p, s) => [p[0] * s, p[1] * s, p[2] * s];

/**
 * (F-vec) スピンのベクトルを受け手にする三次元の接線の摩擦(二次元の E9 と同じ作り —— 腕 R̃_a = R_a d ÷ (R_i + R_j)・j_t = muF v_t ÷ (3K)・I = ½ m R²)
 * 入力: ri・rj・vi・vj・wi・wj(3 成分)・Ri・Rj・mi・mj・muF。戻り: 新しい vi・vj・wi・wj と散逸 dE
 */
export function friction3vec(o) {
  const { ri, rj, vi, vj, wi, wj, Ri, Rj, mi, mj, muF } = o;
  const dvec = add(ri, rj, -1), d = Math.sqrt(dot(dvec, dvec)), n = scl(dvec, 1 / d), sumR = Ri + Rj;
  const Li = Ri * d / sumR, Lj = Rj * d / sumR, invMi = 1 / mi, invMj = 1 / mj, K = invMi + invMj, Ii = 0.5 * mi * Ri * Ri, Ij = 0.5 * mj * Rj * Rj;
  let vrel = add(add(vi, vj, -1), add(scl(cross(wi, n), Li), scl(cross(wj, n), Lj)), -1);   // 接点の相対速度(i の接点は −R̃_i n̂・j の接点は +R̃_j n̂)
  const vt = add(vrel, scl(n, dot(vrel, n)), -1), jt = scl(vt, muF / (3 * K));
  const vi1 = add(vi, jt, -invMi), vj1 = add(vj, jt, invMj);
  const nxj = cross(n, jt), wi1 = add(wi, nxj, Li / Ii), wj1 = add(wj, nxj, Lj / Ij);
  const ke = (vA, vB, wA, wB) => 0.5 * mi * dot(vA, vA) + 0.5 * mj * dot(vB, vB) + 0.5 * Ii * dot(wA, wA) + 0.5 * Ij * dot(wB, wB);
  return { vi: vi1, vj: vj1, wi: wi1, wj: wj1, dE: ke(vi, vj, wi, wj) - ke(vi1, vj1, wi1, wj1), vt, vtAfter: (() => { const vr = add(add(vi1, vj1, -1), add(scl(cross(wi1, n), Li), scl(cross(wj1, n), Lj)), -1); return add(vr, scl(n, dot(vr, n)), -1); })() };
}
/** (F-scal) スピンを持たず、すべりの散逸を内部温度へ積む(並進 → 熱 —— 接線の 2 つの向きをまとめた v_t)。j_t = muF v_t ÷ K(Δv_t = −muF v_t) */
export function friction3scal(o) {
  const { ri, rj, vi, vj, mi, mj, muF } = o;
  const dvec = add(ri, rj, -1), d = Math.sqrt(dot(dvec, dvec)), n = scl(dvec, 1 / d), invMi = 1 / mi, invMj = 1 / mj, K = invMi + invMj;
  const vrel = add(vi, vj, -1), vt = add(vrel, scl(n, dot(vrel, n)), -1), jt = scl(vt, muF / K);
  const vi1 = add(vi, jt, -invMi), vj1 = add(vj, jt, invMj);
  const ke = (vA, vB) => 0.5 * mi * dot(vA, vA) + 0.5 * mj * dot(vB, vB);
  return { vi: vi1, vj: vj1, dE: ke(vi, vj) - ke(vi1, vj1) };
}
/** アプリの E9 の接線の摩擦(二次元)を別に書いたもの(零試験の照合用 —— アプリの html の E9 の行と同じ形) */
export function appE9fric2(o) {
  const { ri, rj, vi, vj, si, sj, Ri, Rj, mi, mj, muF } = o;
  const dx = ri[0] - rj[0], dy = ri[1] - rj[1], d = Math.sqrt(dx * dx + dy * dy), nxv = dx / d, nyv = dy / d, sumR = Ri + Rj;
  const invMi = 1 / mi, invMj = 1 / mj, K = invMi + invMj, txv = -nyv, tyv = nxv, Li = Ri * d / sumR, Lj = Rj * d / sumR;
  const vs = (vi[0] - vj[0]) * txv + (vi[1] - vj[1]) * tyv - si * Li - sj * Lj, jt = muF * vs / (3 * K), Ii = 0.5 * mi * Ri * Ri, Ij = 0.5 * mj * Rj * Rj;
  return { vi: [vi[0] - jt * invMi * txv, vi[1] - jt * invMi * tyv], vj: [vj[0] + jt * invMj * txv, vj[1] + jt * invMj * tyv], si: si + Li * jt / Ii, sj: sj + Lj * jt / Ij };
}
/** 全体の角運動量(並進の r × m v + I ω)と運動量 */
export function angMom(rs, vs, ws, ms, Rs) {
  let Lx = [0, 0, 0], P = [0, 0, 0];
  for (let k = 0; k < rs.length; k++) { Lx = add(Lx, scl(cross(rs[k], vs[k]), ms[k])); Lx = add(Lx, scl(ws[k] || [0, 0, 0], 0.5 * ms[k] * Rs[k] * Rs[k])); P = add(P, scl(vs[k], ms[k])); }
  return { L: Lx, P };
}

/* ───────── 三次元の拡散の候補(E10′) ───────── */
/** (D-vec) スピンのベクトルの I 重みの拡散(対ごとに I_i Δω_i = −I_j Δω_j —— Σ I ω を保つ) */
export function diffuse3vec(wi, wj, Ii, Ij, kappaS, gg) {
  const IJ = Ii + Ij, c = scl(add(wj, wi, -1), kappaS * gg / IJ);
  return { wi: add(wi, c, Ij), wj: add(wj, c, -Ii) };
}
/** (D-scal) 内部温度の熱流(アプリの E10′改と同じ形 —— Q̇ = C κs (T_j − T_i) g² μ) */
export function diffuseT(Ti, Tj, mi, mj, cHeat, kappaS, gg, dt) {
  const qf = cHeat * kappaS * (Tj - Ti) * gg * (mi * mj / (mi + mj)) * dt;
  return { Ti: Ti + qf / (cHeat * mi), Tj: Tj - qf / (cHeat * mj), Q: qf };
}

/* ───────── 結合の角(相変化)の候補 ───────── */
/** (θ) 結合のベクトルの内積の角(どの次元でも同じ式 —— 二次元では今の角の大きさ) */
export function bondAngle(c, p, q) { const u = p.map((t, k) => t - c[k]), w = q.map((t, k) => t - c[k]); const cs = u.reduce((s, t, k) => s + t * w[k], 0) / Math.sqrt(u.reduce((s, t) => s + t * t, 0) * w.reduce((s, t) => s + t * t, 0)); return Math.acos(Math.max(-1, Math.min(1, cs))); }
/** 理想の角: 二次元 2π ÷ bondN/三次元の候補 (θ3a) 正多面体の頂点の角(bondN 4 → 109.47°)・(θ3b) 二次元の式をそのまま */
export function idealAngle(bondN, D, form) {
  if (D === 2 || form === 'flat') return 2 * Math.PI / bondN;
  if (form === 'tet') return Math.acos(-1 / (bondN - 1));   // bondN 本が等しく開く角(bondN 4 → 正四面体 109.47°・bondN 3 → 120°・bondN 2 → 180°)
  throw new Error('idealAngle: form ' + form);
}
/** 放射の冷却(E11 —— Λ = η T^p は局所の量で次元に依らない)。スピンのベクトルでは向きを保って大きさを縮める */
export function coolT(T, etaRad, pRad, dt) { return T - etaRad * Math.pow(T, pRad) * dt; }

/* ───────── 零試験 ───────── */
export function pureScenes() {
  const s = {};
  // z1: L0(二次元)= アプリの E5′(tint)の式
  s.z1 = [[1.3, 0.5, 0.7, 1, 2, 0.8, 1.7], [0.2, 0.4, 0.4, 3, 1, 2, 0.5], [5, 0.5, 0.5, 1, 1, 1, 1]].map(([d, Ri, Rj, mi, mj, Ti, Tj]) => ({
    lib: pairCoef({ law: 'L0', D: 2, d, Ri, Rj, mi, mj, Ti, Tj, form: 'prod', q: 2, kRep: 1.5, ni: 0, nj: 0 })[0], app: appE5tint(d, Ri, Rj, mi, mj, Ti, Tj, 2, 1.5) }));
  // z2: L1 は二次元で L0 に戻る・三次元で (R̄ ÷ (R̄ + d)) 倍
  s.z2 = [0.3, 1, 4].map((d) => ({ d, l0: pairCoef({ law: 'L0', D: 2, d, Ri: 0.5, Rj: 0.5, mi: 1, mj: 1, Ti: 1, Tj: 1, form: 'prod', q: 2, kRep: 1 })[0],
    l1: pairCoef({ law: 'L1', D: 2, d, Ri: 0.5, Rj: 0.5, mi: 1, mj: 1, Ti: 1, Tj: 1, form: 'prod', q: 2, kRep: 1 })[0],
    l13: pairCoef({ law: 'L1', D: 3, d, Ri: 0.5, Rj: 0.5, mi: 1, mj: 1, Ti: 1, Tj: 1, form: 'prod', q: 2, kRep: 1 })[0] }));
  // z3: 熱への依り方 —— 積・和は対称(運動量を保つ)・相手だけは T_i ≠ T_j で対称でない
  s.z3 = DECL.heatForms.map((f) => ({ form: f, eq: heatH(f, 1, 1), neq: heatH(f, 0.5, 2), zero: heatH(f, 0, 2) }));
  // z4: 摩擦 (F-vec) を面内の衝突・z 向きのスピンに置くと、アプリの E9(二次元)と同じ値
  const c2 = { ri: [0.9, 0.1], rj: [0, 0], vi: [-0.3, 0.7], vj: [0.2, -0.1], si: 0.4, sj: -1.1, Ri: 0.5, Rj: 0.45, mi: 1, mj: 1.7, muF: 0.6 };
  const a2 = appE9fric2(c2), f3 = friction3vec({ ri: [...c2.ri, 0], rj: [...c2.rj, 0], vi: [...c2.vi, 0], vj: [...c2.vj, 0], wi: [0, 0, c2.si], wj: [0, 0, c2.sj], Ri: c2.Ri, Rj: c2.Rj, mi: c2.mi, mj: c2.mj, muF: c2.muF });
  s.z4 = { app: a2, vec: { vi: f3.vi, vj: f3.vj, wi: f3.wi, wj: f3.wj } };
  // z5: 面の外の衝突で (F-vec) は運動量と角運動量(並進 + I ω)を保ち、散逸 ≥ 0・接線の相対速度は (1 − muF) 倍
  const c3 = { ri: [0.6, 0.4, 0.5], rj: [0, 0, 0], vi: [0.1, -0.5, 0.3], vj: [-0.2, 0.3, 0.9], wi: [0.7, -0.2, 1.1], wj: [-0.4, 0.8, 0.1], Ri: 0.5, Rj: 0.55, mi: 1.2, mj: 0.8, muF: 0.8 };
  const g3 = friction3vec(c3), b0 = angMom([c3.ri, c3.rj], [c3.vi, c3.vj], [c3.wi, c3.wj], [c3.mi, c3.mj], [c3.Ri, c3.Rj]), b1 = angMom([c3.ri, c3.rj], [g3.vi, g3.vj], [g3.wi, g3.wj], [c3.mi, c3.mj], [c3.Ri, c3.Rj]);
  const s3 = friction3scal(c3), e0 = angMom([c3.ri, c3.rj], [c3.vi, c3.vj], [null, null], [c3.mi, c3.mj], [c3.Ri, c3.Rj]), e1 = angMom([c3.ri, c3.rj], [s3.vi, s3.vj], [null, null], [c3.mi, c3.mj], [c3.Ri, c3.Rj]);
  const d3 = Math.hypot(...c3.ri), sR3 = c3.Ri + c3.Rj, K3 = 1 / c3.mi + 1 / c3.mj, kap3 = (K3 + 2 * (d3 / sR3) ** 2 / c3.mi + 2 * (d3 / sR3) ** 2 / c3.mj) / (3 * K3);
  s.z5 = { L0: b0.L, L1: b1.L, P0: b0.P, P1: b1.P, dE: g3.dE, vt: g3.vt, vtAfter: g3.vtAfter, muF: c3.muF, keep: 1 - c3.muF * kap3, scal: { L0: e0.L, L1: e1.L, P0: e0.P, P1: e1.P, dE: s3.dE } };
  // z6: 拡散 (D-vec) は Σ I ω を保つ・(D-scal) は Σ C m T を保つ
  const dv = diffuse3vec([1, 0.2, -0.3], [-0.5, 0.9, 0.4], 0.3, 0.7, 0.05, 0.6), dT = diffuseT(1.5, 0.4, 1, 2, 3, 0.05, 0.6, 0.01);
  s.z6 = { before: add(scl([1, 0.2, -0.3], 0.3), scl([-0.5, 0.9, 0.4], 0.7)), after: add(scl(dv.wi, 0.3), scl(dv.wj, 0.7)), heatBefore: 3 * (1 * 1.5 + 2 * 0.4), heatAfter: 3 * (1 * dT.Ti + 2 * dT.Tj) };
  // z7: 結合の角の内積の式は二次元の角と同じ・理想の角(二次元 2π/3・三次元 bondN 4 で 109.47°)
  s.z7 = { a2: bondAngle([0, 0], [1, 0], [Math.cos(2.1), Math.sin(2.1)]), a3: bondAngle([0, 0, 0], [1, 0, 0], [Math.cos(2.1), Math.sin(2.1), 0]), i2: idealAngle(3, 2), i3t: idealAngle(4, 3, 'tet'), i3t3: idealAngle(3, 3, 'tet') };
  // z8: 並進だけの箱は P ÷ (ρ T) が 1 の近く(二次元・三次元)—— 壁の圧力の測り方の照合
  s.z8 = [2, 3].map((D) => { const rho = D === 2 ? DECL.rho2[1] : DECL.rho3[1], r = simulate({ D, N: DECL.N, L: boxL(DECL.N, rho, D), rep: false, Tint: 1, Ttr: 1, seed: DECL.seed + 1 }); return { D, ratio: r.P / (r.rho * r.TtrMeas) }; });
  // z9: 二次元の今の形(並進なし)の圧力の冪 —— 密度への冪が 2 の近く・温度への冪が 1 の近く(ρ²T の形)
  const k2 = colPowers('K2-L0');
  s.z9 = { aRho: k2.aRho, aT: k2.aT };
  // z10: 定めた手順(同じ入力で同じ数)
  const r1 = simulate({ D: 3, N: 27, L: 6, rep: true, law: 'L2', form: 'prod', Tint: 1, Ttr: 1, steps: 200, warm: 50 }), r2 = simulate({ D: 3, N: 27, L: 6, rep: true, law: 'L2', form: 'prod', Tint: 1, Ttr: 1, steps: 200, warm: 50 });
  s.z10 = { p1: r1.P, p2: r2.P };
  return s;
}
const near = (a, b, t) => a === b || Math.abs(a - b) <= t * Math.max(Math.abs(a), Math.abs(b), 1e-300);
const nearV = (p, q, t) => p.every((x, k) => Math.abs(x - q[k]) <= t);
export function pureGates(s) {
  const W = DECL.zeroWindow2D;
  return {
    z1_l0EqApp: s.z1.every((r) => near(r.lib, r.app, 1e-15) && r.lib > 0),
    z2_l1To2D: s.z2.every((r) => near(r.l0, r.l1, 1e-15) && near(r.l13, r.l0 * 0.5 / (0.5 + r.d), 1e-14)),
    z3_heatSym: s.z3.find((r) => r.form === 'prod').neq[0] === s.z3.find((r) => r.form === 'prod').neq[1] && s.z3.find((r) => r.form === 'sum').neq[0] === s.z3.find((r) => r.form === 'sum').neq[1]
      && s.z3.find((r) => r.form === 'other').neq[0] !== s.z3.find((r) => r.form === 'other').neq[1] && s.z3.find((r) => r.form === 'prod').zero[0] === 0 && s.z3.find((r) => r.form === 'sum').zero[0] === 1,
    z4_fricTo2D: nearV(s.z4.vec.vi.slice(0, 2), s.z4.app.vi, 1e-14) && nearV(s.z4.vec.vj.slice(0, 2), s.z4.app.vj, 1e-14) && Math.abs(s.z4.vec.wi[2] - s.z4.app.si) <= 1e-14 && Math.abs(s.z4.vec.wj[2] - s.z4.app.sj) <= 1e-14
      && s.z4.vec.vi[2] === 0 && s.z4.vec.wi[0] === 0 && s.z4.vec.wi[1] === 0,
    z5_fricCons: nearV(s.z5.L0, s.z5.L1, 1e-14) && nearV(s.z5.P0, s.z5.P1, 1e-14) && s.z5.dE > 0 && nearV(s.z5.vtAfter, scl(s.z5.vt, s.z5.keep), 1e-14)
      && nearV(s.z5.scal.P0, s.z5.scal.P1, 1e-14) && s.z5.scal.dE > 0 && !nearV(s.z5.scal.L0, s.z5.scal.L1, 1e-6),
    z6_diffCons: nearV(s.z6.before, s.z6.after, 1e-15) && Math.abs(s.z6.heatBefore - s.z6.heatAfter) <= 1e-14,
    z7_angle: Math.abs(s.z7.a2 - 2.1) <= 1e-12 && Math.abs(s.z7.a3 - 2.1) <= 1e-12 && Math.abs(s.z7.i2 - 2 * Math.PI / 3) <= 1e-15 && Math.abs(s.z7.i3t * 180 / Math.PI - 109.4712206) <= 1e-6 && Math.abs(s.z7.i3t3 - 2 * Math.PI / 3) <= 1e-12,
    z8_idealWall: s.z8.every((r) => Math.abs(r.ratio - 1) <= 0.05),
    z9_rho2T: s.z9.aRho >= W.rho[0] && s.z9.aRho <= W.rho[1] && s.z9.aT >= W.T[0] && s.z9.aT <= W.T[1],
    z10_determ: near(s.z10.p1, s.z10.p2, 1e-6) && s.z10.p1 > 0,
  };
}
