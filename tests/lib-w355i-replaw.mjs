// 第355便i(統括の検証項目 R512): **論文 5 の思考実験「圧力 = 粒の間の斥力」のまま、斥力の則の族をノブで振る純関数の lib**
//   (アプリではない小さな積分器 —— 第355便g の lib tests/lib-w355g-heat3d.mjs の積分器を、斥力の則の族へ広げた写し。g の lib は import して使い、本文は変えない)。
//   診断だけ —— アプリ・エンジン・内蔵の本・受理器・既存の lib の本文は変えない。physics の鍵を足さない。三次元の受理の門は変えない。
//   アナロジーとしての玩具の量(現実の熱力学の記述ではない)。式の形を先に 1 つに決めない —— 族を宣言してノブで振る(候補の表)。乱数は使わない(定めた種の線形合同)。
//
// 記号: D = 次元/N = 粒の数/L = 箱の一辺/ρ = N ÷ L^D/a = ρ^(−1/D)(粒の間隔)/a★ = 中の密度の粒の間隔(切る距離と近くの半径の物差し —— 密度で動かさない)/
//   t = R̄ ÷ (R̄ + d)/μ = m_i m_j ÷ (m_i + m_j)/H = 対の熱の因子(積 √(T_i T_j)・和 (T_i + T_j) ÷ 2 —— g の lib の heatH)。
//   対の力は F_i = f × (r_i − r_j)(中心力 —— 対の和が 0 なので運動量を保つ)。
//
// ■ 斥力の則の族(ノブ 4 つ —— 宣言した族の内だけを振る)
//   ① 形 shape × 距離の冪 s: 'G' = 今の形(g² の則 —— g の lib の pairCoef の L0 をそのまま呼ぶ)/
//      'P1' = |F| = 2 kRep μ H d t^(s+1)(接するところで 0 —— s = 3 で 'G' と同じ式)/'P2' = |F| = 2 kRep μ H R̄ t^s(接するところで有限)。遠くで |F| ∝ d^(−s)。
//   ② 届く距離を切る cut: 'none'/'smooth'(× (1 − (d ÷ r_c)²)² —— なめらかに 0 へ)/'step'(d < r_c で 1・外で 0)。r_c = c × a★。
//   ③ 近くの粒の数で割る p: 力に (2 ÷ (n_i + n_j))^p を掛ける。n_a = 1 + Σ_b w(d_ab ÷ r_n)・w = (1 − x²)²(x < 1)。r_n = c_n × a★。
//      weight 'g2' は g の lib の L2(n_a = 1 + Σ g_ab²・p = 1)と同じ作り(零試験の照合用)。
//   ④ 熱への依り方 form: 積・和(g の lib の heatH)。温度をそろえた箱では対の H = T で 2 つは同じ数(零試験)。
export const LIB_VERSION = 'w355i-replaw-lib-1';
import * as H from './lib-w355g-heat3d.mjs';

export const DECL = Object.freeze({
  shapes: Object.freeze(['G', 'P1', 'P2']),
  sGrid: Object.freeze([1, 2, 3, 4, 6]),
  cuts: Object.freeze(['none', 'smooth', 'step']),
  cGrid: Object.freeze([0.5, 1, 2, 4, 8]),
  pGrid: Object.freeze([0, 0.5, 1]),
  rnGrid: Object.freeze([1, 2, 3]),
  forms: Object.freeze(['prod', 'sum']),
  rho3: Object.freeze([0.02, 0.08, 0.32]),     // 三次元の密度の格子(g の 0.02〜0.08 より広く —— 16 倍の幅)
  rho2: Object.freeze([0.05, 0.2, 0.8]),       // 二次元の密度の格子
  tScan: Object.freeze([0.5, 2]),              // 温度の冪(中の密度で T = 0.5・1・2 —— 1 は密度の格子の中の点を使う)
  nScan3: Object.freeze([27, 125]),            // 粒の数の冪(箱の一辺は中の密度の値で固定 —— 64 は密度の格子の中の点を使う)
  nScan2: Object.freeze([36, 100]),
  nBig: Object.freeze([216]),                  // 窓に入る組で粒の数を上げる(512 は 1 回の走行の予算の外 —— 未)
  window: Object.freeze([0.9, 1.1]),           // 「理想気体の則の冪(1)の近く」と読む窓(表の印だけ —— 結論にしない)
  extTol: 0.1,                                  // 箱で振る冪と粒の数で振る冪の差がこの内なら「示量」と読む
  pFloor: 1e-9,                                 // 斥力の分の圧力がこれより小さい点を含む組は「届かない」(冪を出さない)
  base: Object.freeze({ N: 64, q: 2, R: 0.5, m: 1, kRep: 20, wallK: 400 }),   // g の lib の DECL と同じ値(器のノブ —— 玩具の単位・未照合)
});

/** 中の密度の粒の間隔 a★(切る距離と近くの半径の物差し) */
export const aStar = (D) => Math.pow((D === 2 ? DECL.rho2 : DECL.rho3)[1], -1 / D);

/** 規格の組(spec)を整える: { shape, s, cut, c, p, cn, weight, form } */
export function specOf(o = {}) {
  return Object.freeze({ shape: o.shape || 'G', s: o.s == null ? 3 : o.s, cut: o.cut || 'none', c: o.c == null ? null : o.c, p: o.p || 0, cn: o.cn == null ? null : o.cn, weight: o.weight || 'w4', form: o.form || 'prod' });
}
export function specId(sp) {
  const sh = sp.shape === 'G' ? 'G' : sp.shape + 's' + sp.s;
  const ct = sp.cut === 'none' ? 'c-' : (sp.cut === 'smooth' ? 'cs' : 'ct') + sp.c;
  const nb = sp.p === 0 ? 'p0' : 'p' + sp.p + (sp.weight === 'g2' ? 'g' : 'n' + sp.cn);
  return [sh, ct, nb, sp.form === 'prod' ? '' : sp.form].filter(Boolean).join('/');
}
/** 二次元へ落とすと今の式に戻るか(式の上で —— 形が今の形・切らない・割らない) */
export const reducesTo2D = (sp) => (sp.shape === 'G' || (sp.shape === 'P1' && sp.s === 3)) && sp.cut === 'none' && sp.p === 0;

/** 冪(整数の冪は掛け算で —— 走行の時間のため。整数でない冪は Math.pow) */
export function ipow(t, n) { if (Number.isInteger(n) && n >= 0 && n <= 16) { let r = 1; for (let k = 0; k < n; k++) r *= t; return r; } return Math.pow(t, n); }
/** 切る因子 */
export function cutFac(cut, d, rc) {
  if (cut === 'none') return 1;
  if (d >= rc) return 0;
  if (cut === 'step') return 1;
  if (cut === 'smooth') { const x = d / rc, u = 1 - x * x; return u * u; }
  throw new Error('cutFac: cut ' + cut);
}
/** 近くの数の重み w(x) = (1 − x²)²(x < 1) */
export const nbrW = (d, rn) => { if (d >= rn) return 0; const x = d / rn, u = 1 - x * x; return u * u; };

/**
 * 対の係数 [f_i, f_j](F_i = f_i (r_i − r_j)・F_j = −f_j (r_i − r_j))
 * o: { sp, D, d, Ri, Rj, mi, mj, Ti, Tj, q, kRep, ni, nj, rc }
 */
export function pairF(o) {
  const { sp, D, d, Ri, Rj, mi, mj, Ti, Tj, q, kRep, ni, nj, rc } = o;
  // 今の形・切らない・割らない: g の lib の L0 をそのまま(零試験 —— 数の並びも同じ)
  if (sp.shape === 'G' && sp.cut === 'none' && sp.p === 0) return H.pairCoef({ law: 'L0', D, d, Ri, Rj, mi, mj, Ti, Tj, form: sp.form, q, kRep, ni: 0, nj: 0 });
  // g の L2 と同じ作り(weight 'g2'・p 1・切らない・今の形)
  if (sp.shape === 'G' && sp.cut === 'none' && sp.p === 1 && sp.weight === 'g2') return H.pairCoef({ law: 'L2', D, d, Ri, Rj, mi, mj, Ti, Tj, form: sp.form, q, kRep, ni, nj });
  const mu = mi * mj / (mi + mj), [hi, hj] = H.heatH(sp.form, Ti, Tj);
  let shp;
  if (sp.shape === 'G') { const gi = H.gOf(Ri, d, q), gj = H.gOf(Rj, d, q); shp = gi * gi + gj * gj; }
  else { const Rb = 0.5 * (Ri + Rj), t = Rb / (Rb + d);
    if (sp.shape === 'P1') shp = 2 * ipow(t, sp.s + 1);
    else if (sp.shape === 'P2') shp = 2 * (Rb / d) * ipow(t, sp.s);
    else throw new Error('pairF: shape ' + sp.shape); }
  let fac = cutFac(sp.cut, d, rc);
  if (sp.p > 0) { const z = 2 / (ni + nj); fac *= sp.p === 1 ? z : Math.pow(z, sp.p); }
  const base = kRep * mu * shp * fac;
  return [base * hi, base * hj];
}

/* ───────── 小さな積分器(g の lib の simulate と同じ手順 —— 斥力の則だけを族へ) ───────── */
/**
 * cfg: { sp, D, N, L, Tint, Ttr, rep, steps, warm, seed, dt, kRep } + g の DECL の値
 * 圧力 = 壁に渡る力の時間平均の和 ÷ (2D × L^(D−1))。戻り値に近くの数の平均(測る区間)・切る距離の内に居る対の割合(終わりの形)。
 */
export function simulate(cfg) {
  const c = Object.assign({}, H.DECL, cfg), sp = c.sp || specOf(), D = c.D, N = c.N, L = c.L, R = c.R, m = c.m, dt = c.dt, rnd = H.lcg(c.seed);
  const as = aStar(D), rc = sp.cut === 'none' ? Infinity : sp.c * as, rn = sp.cn == null ? null : sp.cn * as;
  const x = new Float64Array(N * D), v = new Float64Array(N * D), a = new Float64Array(N * D), nn = new Float64Array(N);
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
  const Ti = c.Tint, needN = c.rep && sp.p > 0;
  let wallNow = 0, nMeanNow = 1;
  const force = () => {
    a.fill(0); wallNow = 0;
    if (c.rep) {
      if (needN) {
        nn.fill(1);
        for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
          let d2 = 0; for (let ax = 0; ax < D; ax++) { const e = x[i * D + ax] - x[j * D + ax]; d2 += e * e; }
          const dd = Math.sqrt(d2);
          let w; if (sp.weight === 'g2') { const g = H.gOf(R, dd, c.q); w = g * g; } else w = nbrW(dd, rn);
          nn[i] += w; nn[j] += w;
        }
        let s = 0; for (let i = 0; i < N; i++) s += nn[i]; nMeanNow = s / N;
      }
      for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
        let d2 = 0; for (let ax = 0; ax < D; ax++) { const e = x[i * D + ax] - x[j * D + ax]; d2 += e * e; }
        const d = Math.sqrt(d2);
        if (d >= rc) continue;
        const [fi, fj] = pairF({ sp, D, d, Ri: R, Rj: R, mi: m, mj: m, Ti, Tj: Ti, q: c.q, kRep: c.kRep, ni: nn[i], nj: nn[j], rc });
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
  let wallSum = 0, ttrSum = 0, nSum = 0, nMeas = 0;
  for (let st = 0; st < c.steps; st++) {
    for (let i = 0; i < N * D; i++) { v[i] += 0.5 * dt * a[i]; x[i] += dt * v[i]; }
    force();
    for (let i = 0; i < N * D; i++) v[i] += 0.5 * dt * a[i];
    if (c.Ttr > 0) { if ((st + 1) % c.rescaleEvery === 0) rescale(v, N, D, m, c.Ttr); }
    else for (let i = 0; i < N * D; i++) v[i] *= (1 - c.damp);
    if (st >= c.warm) { wallSum += wallNow; ttrSum += H.kinT(v, N, D, m); nSum += nMeanNow; nMeas++; }
  }
  // 終わりの形: 切る距離の内に居る対の割合
  let inR = 0, nP = 0;
  for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) { let d2 = 0; for (let ax = 0; ax < D; ax++) { const e = x[i * D + ax] - x[j * D + ax]; d2 += e * e; } nP++; if (Math.sqrt(d2) < rc) inR++; }
  const area = 2 * D * Math.pow(L, D - 1), V = Math.pow(L, D);
  const P = wallSum / nMeas / area, TtrMeas = ttrSum / nMeas;
  return { D, N, L, rho: N / V, P, Pkin: N * TtrMeas / V, TtrMeas, nMean: nSum / nMeas, inCut: inR / nP, nMeas };
}
function rescale(v, N, D, m, T) { const t = H.kinT(v, N, D, m); if (t > 0) { const f = Math.sqrt(T / t); for (let i = 0; i < N * D; i++) v[i] *= f; } }

/** 1 点(g の lib の point と同じ手順・種 = g の DECL.seed + N)。tr: 並進の温度を T に保つ(真)・止める(偽 —— 斥力だけの圧力) */
export function point(sp, D, rho, T, o = {}) {
  const N = o.N || DECL.base.N, L = o.L || H.boxL(N, rho, D), tr = !!o.tr, rep = o.rep !== false;
  const r = simulate({ sp, D, N, L, rep, Tint: T, Ttr: tr ? T : 0, kRep: o.kRep || H.DECL.kRep, seed: H.DECL.seed + N, steps: tr ? H.DECL.steps : H.DECL.stepsStatic, warm: tr ? H.DECL.warm : H.DECL.warmStatic, dt: tr ? H.DECL.dt : H.DECL.dtStatic });
  return { rho: r.rho, T, N, L, P: r.P, Pkin: r.Pkin, Prep: tr ? r.P - r.Pkin : r.P, nMean: r.nMean, inCut: r.inCut };
}

const inWin = (x) => x != null && x >= DECL.window[0] && x <= DECL.window[1];
/**
 * 組の冪: 密度への冪(箱で振る —— T = 1・ρ の格子)・粒の数で振る(箱の一辺を中の密度の値で固定)・温度への冪(中の密度で T を振る)。
 * 斥力だけの圧力(並進なし —— tr 偽)を主に数える。o.nBig を渡すと粒の数を上げた箱で振る冪も。
 */
export function comboPowers(sp, D, o = {}) {
  const rg = D === 2 ? DECL.rho2 : DECL.rho3, rMid = rg[1], ns = D === 2 ? DECL.nScan2 : DECL.nScan3, N0 = DECL.base.N, tr = !!o.tr;
  const pr = rg.map((rho) => point(sp, D, rho, 1, { tr }));
  const pt = DECL.tScan.map((T) => point(sp, D, rMid, T, { tr }));
  const L0 = H.boxL(N0, rMid, D), pn = ns.map((N) => point(sp, D, N / Math.pow(L0, D), 1, { tr, N, L: L0 }));
  const tAll = [pt[0], pr[1], pt[1]], nAll = [pn[0], pr[1], pn[1]];
  const reach = pr.every((p) => p.Prep > DECL.pFloor) && tAll.every((p) => p.Prep > DECL.pFloor) && nAll.every((p) => p.Prep > DECL.pFloor);
  const sl = (ps, k) => reach ? H.slope(ps.map((p) => p[k]), ps.map((p) => p.Prep)) : null;
  const aBox = sl(pr, 'rho'), aN = sl(nAll, 'rho'), aT = sl(tAll, 'T');
  const big = (o.nBig || []).map((N) => { const pb = rg.map((rho) => point(sp, D, rho, 1, { tr, N })); const ok = pb.every((p) => p.Prep > DECL.pFloor);
    return { N, pts: pb.map(pick), aBox: ok ? H.slope(pb.map((p) => p.rho), pb.map((p) => p.Prep)) : null }; });
  return { id: specId(sp), sp, D, tr, reach, rhoPts: pr.map(pick), tPts: tAll.map(pick), nPts: nAll.map(pick), aBox, aN, aT,
    extensive: reach ? Math.abs(aBox - aN) <= DECL.extTol : null, inWin: reach ? inWin(aBox) && inWin(aN) && inWin(aT) : false,
    nMeanMid: pr[1].nMean, inCutMid: pr[1].inCut, reduces2D: reducesTo2D(sp), big };
}
const pick = (p) => ({ rho: p.rho, T: p.T, N: p.N, P: p.P, Prep: p.Prep, nMean: p.nMean, inCut: p.inCut });

/** 窓までの近さ(箱・粒の数・温度の冪の 1 からの離れの最大)—— いちばん近い組を選ぶ量 */
export const dist1 = (r) => r.reach ? Math.max(Math.abs(r.aBox - 1), Math.abs(r.aN - 1), Math.abs(r.aT - 1)) : Infinity;

/** 内力の和(運動量の保存の照合 —— 定めた配置で対の力を足す。戻り: |Σ F| ÷ Σ |F|) */
export function forceSum(sp, D, N = 20, seed = 355009) {
  const rnd = H.lcg(seed), L = 4 * aStar(D), x = Array.from({ length: N }, () => Array.from({ length: D }, () => rnd() * L)), T = Array.from({ length: N }, () => 0.5 + rnd());
  const as = aStar(D), rc = sp.cut === 'none' ? Infinity : sp.c * as, rn = sp.cn == null ? 1 : sp.cn * as, nn = new Array(N).fill(1);
  const dist = (i, j) => Math.sqrt(x[i].reduce((s, t, k) => s + (t - x[j][k]) ** 2, 0));
  if (sp.p > 0) for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) { const dd = dist(i, j); const w = sp.weight === 'g2' ? H.gOf(0.5, dd, 2) ** 2 : nbrW(dd, rn); nn[i] += w; nn[j] += w; }
  const F = Array.from({ length: N }, () => new Array(D).fill(0)); let sAbs = 0;
  for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
    const d = dist(i, j); if (d >= rc) continue;
    const [fi, fj] = pairF({ sp, D, d, Ri: 0.5, Rj: 0.5, mi: 1, mj: 1, Ti: T[i], Tj: T[j], q: 2, kRep: 20, ni: nn[i], nj: nn[j], rc });
    for (let k = 0; k < D; k++) { const e = x[i][k] - x[j][k]; F[i][k] += fi * e; F[j][k] -= fj * e; sAbs += Math.abs(fi * e) + Math.abs(fj * e); }
  }
  const tot = new Array(D).fill(0); for (const f of F) for (let k = 0; k < D; k++) tot[k] += f[k];
  return sAbs > 0 ? Math.hypot(...tot) / sAbs : 0;
}

/** B: 並進の運動の寄与を主にする列(比べる列)—— g の lib の kScan を呼ぶ。全体の冪が窓に入る斥力の強さの倍の範囲(格子の上の線形の内挿) */
export function bScan(colId, mults) {
  const rows = H.kScan(colId, mults);
  const hi = DECL.window[1];
  let upper = null;
  for (let k = 1; k < rows.length; k++) { const a0 = rows[k - 1].aRho, a1 = rows[k].aRho; if (a0 <= hi && a1 > hi) { upper = rows[k - 1].mult + (hi - a0) * (rows[k].mult - rows[k - 1].mult) / (a1 - a0); break; } }
  const allIn = rows.every((r) => inWin(r.aRho));
  return { col: colId, rows: rows.map((r) => ({ mult: r.mult, aRho: r.aRho, repOverKin: r.repOverKinMid, pOverRhoT: r.pOverRhoTMid, inWin: inWin(r.aRho) })), upperMult: upper, allIn };
}

/* ───────── 零試験 ───────── */
export function pureScenes() {
  const s = {};
  // y1: 今の形・切らない・割らない = g の lib の L0(= アプリの E5′〔tint〕)
  s.y1 = [[1.3, 2], [0.4, 3], [5, 2], [2.2, 3]].map(([d, D]) => ({ d, D, mine: pairF({ sp: specOf(), D, d, Ri: 0.5, Rj: 0.5, mi: 1, mj: 1, Ti: 0.8, Tj: 1.7, q: 2, kRep: 20, ni: 1, nj: 1, rc: Infinity })[0],
    g: H.pairCoef({ law: 'L0', D, d, Ri: 0.5, Rj: 0.5, mi: 1, mj: 1, Ti: 0.8, Tj: 1.7, form: 'prod', q: 2, kRep: 20 })[0], app: H.appE5tint(d, 0.5, 0.5, 1, 1, 0.8, 1.7, 2, 20) }));
  // y2: 'P1' の s = 3 は今の形と同じ式(等しい半径)
  s.y2 = [0.3, 1, 2.9, 7].map((d) => ({ d, g: pairF({ sp: specOf(), D: 3, d, Ri: 0.5, Rj: 0.5, mi: 1, mj: 1, Ti: 1, Tj: 1, q: 2, kRep: 20, ni: 1, nj: 1, rc: Infinity })[0],
    p1: pairF({ sp: specOf({ shape: 'P1', s: 3 }), D: 3, d, Ri: 0.5, Rj: 0.5, mi: 1, mj: 1, Ti: 1, Tj: 1, q: 2, kRep: 20, ni: 1, nj: 1, rc: Infinity })[0] }));
  // y3: 遠くの冪 —— d を 2 倍にしたときの |F| の比の log2 が −s に近づく(d 1e4)
  s.y3 = ['P1', 'P2'].flatMap((sh) => DECL.sGrid.map((sv) => { const sp = specOf({ shape: sh, s: sv }), F = (d) => d * pairF({ sp, D: 3, d, Ri: 0.5, Rj: 0.5, mi: 1, mj: 1, Ti: 1, Tj: 1, q: 2, kRep: 1, ni: 1, nj: 1, rc: Infinity })[0];
    return { shape: sh, s: sv, slope: Math.log2(F(2e4) / F(1e4)) }; }));
  // y4: 切る因子 —— なめらかは r_c で 0・内で連続/段は r_c の外で 0
  s.y4 = { sIn: cutFac('smooth', 0.999, 1), sOut: cutFac('smooth', 1, 1), s0: cutFac('smooth', 0, 1), tIn: cutFac('step', 0.999, 1), tOut: cutFac('step', 1.001, 1) };
  // y5: 運動量の保存(内力の和 —— 全部の族の代表で 0)
  s.y5 = [specOf(), specOf({ shape: 'P2', s: 1, cut: 'step', c: 1 }), specOf({ shape: 'P1', s: 2, cut: 'smooth', c: 2, p: 1, cn: 2 }), specOf({ shape: 'G', p: 0.5, cn: 1, form: 'sum' }), specOf({ shape: 'P2', s: 6, cut: 'smooth', c: 0.5, p: 1, cn: 1 })]
    .map((sp) => ({ id: specId(sp), rel: forceSum(sp, 3) }));
  // y6: 積と和は温度をそろえた箱で同じ数(短い走行 —— 同じ入力)
  const shortRun = (sp) => simulate({ sp, D: 3, N: 27, L: 6, rep: true, Tint: 2, Ttr: 0, steps: 300, warm: 100, seed: 355011, dt: 0.05 }).P;
  s.y6 = { prod: shortRun(specOf({ shape: 'P1', s: 2, p: 1, cn: 2 })), sum: shortRun(specOf({ shape: 'P1', s: 2, p: 1, cn: 2, form: 'sum' })) };
  // y7: 既定の組の積分器 = g の lib の simulate(短い走行・同じ入力 —— 三次元・二次元・並進あり)
  s.y7 = [{ D: 3, Ttr: 0 }, { D: 2, Ttr: 0 }, { D: 3, Ttr: 1 }].map(({ D, Ttr }) => { const cfg = { D, N: 27, L: D === 3 ? 6 : 10, rep: true, Tint: 1, Ttr, steps: 300, warm: 100, seed: 355013, dt: Ttr ? 0.02 : 0.05 };
    return { D, Ttr, mine: simulate(Object.assign({ sp: specOf() }, cfg)).P, g: H.simulate(Object.assign({ law: 'L0', form: 'prod' }, cfg)).P }; });
  // y8: weight 'g2'・p 1 = g の lib の L2(短い走行)
  { const cfg = { D: 3, N: 27, L: 6, rep: true, Tint: 1, Ttr: 1, steps: 200, warm: 50, seed: 355015 };
    s.y8 = { mine: simulate(Object.assign({ sp: specOf({ p: 1, weight: 'g2' }) }, cfg)).P, g: H.simulate(Object.assign({ law: 'L2', form: 'prod' }, cfg)).P }; }
  // y9: 二次元へ落とす(式の上)—— 既定と P1 s 3 だけが今の式に戻る
  s.y9 = [specOf(), specOf({ shape: 'P1', s: 3 }), specOf({ shape: 'P1', s: 1 }), specOf({ cut: 'smooth', c: 8 }), specOf({ p: 1, cn: 2 })].map((sp) => ({ id: specId(sp), r: reducesTo2D(sp) }));
  // y10: 定めた手順(同じ入力で同じ数)
  const r1 = simulate({ sp: specOf({ shape: 'P2', s: 1, cut: 'smooth', c: 2, p: 1, cn: 2 }), D: 3, N: 27, L: 6, rep: true, Tint: 1, Ttr: 1, steps: 200, warm: 50, seed: 355017 });
  const r2 = simulate({ sp: specOf({ shape: 'P2', s: 1, cut: 'smooth', c: 2, p: 1, cn: 2 }), D: 3, N: 27, L: 6, rep: true, Tint: 1, Ttr: 1, steps: 200, warm: 50, seed: 355017 });
  s.y10 = { p1: r1.P, p2: r2.P, n1: r1.nMean };
  return s;
}
const near = (a, b, t) => a === b || Math.abs(a - b) <= t * Math.max(Math.abs(a), Math.abs(b), 1e-300);
export function pureGates(s) {
  return {
    y1_gL0: s.y1.every((r) => near(r.mine, r.g, 1e-15) && near(r.mine, r.app, 1e-15) && r.mine > 0),
    y2_p1s3: s.y2.every((r) => near(r.g, r.p1, 1e-12)),
    y3_tail: s.y3.every((r) => Math.abs(r.slope + r.s) <= 1e-3 * Math.max(1, r.s)),
    y4_cut: s.y4.sOut === 0 && s.y4.sIn > 0 && s.y4.sIn < 1e-5 && s.y4.s0 === 1 && s.y4.tIn === 1 && s.y4.tOut === 0,
    y5_momentum: s.y5.every((r) => r.rel <= 1e-14),
    y6_prodSum: near(s.y6.prod, s.y6.sum, 1e-12) && s.y6.prod > 0,
    y7_gSim: s.y7.every((r) => near(r.mine, r.g, 1e-12) && r.mine > 0),
    y8_gL2: near(s.y8.mine, s.y8.g, 1e-12) && s.y8.mine > 0,
    y9_reduce2D: s.y9.map((r) => r.r).join(',') === 'true,true,false,false,false',
    y10_determ: near(s.y10.p1, s.y10.p2, 1e-12) && s.y10.p1 > 0 && s.y10.n1 > 1,
  };
}
