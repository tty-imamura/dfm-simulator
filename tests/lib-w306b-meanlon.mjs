// 第306便b(DECISIONS v64 AN336 ③・AN333・AN335 ③・第95報・AN332 の裁定・統括の検証項目 R205)— **平均経度の周期の抽出器**(ライブラリ —— 新しい器が使う。
// 歴史の器は書き換えない)。
//
// ■ なぜ
//   今までの惑星の「恒星周期」(exp-w299c-planets3d の runPl3/windowOf)は**初期の位置の方向を通る周回の平均間隔**で、観測の恒星周期の定義
//   (平均経度 λ の率 —— 固定の基準方向に対する平均運動)と違う。近点が回る軌道では、固定の方向を通る時刻は近点の移動 Δϖ だけずれ、そのずれは
//   通る方向の真近点離角に依る(第305便b の g = (1 − e²)^{3/2}/(1 + e cos f₀)²)。周期で n を見分けるには、観測と同じ定義の周期が要る。
//
// ■ 何をするか
//   每 every 步に相対の位置 r・速度 v から**接触の要素**(μ = G(M+m) のケプラーの要素)を作る:
//     a = 1/(2/r − v²/μ)・離心ベクトル e = ((v² − μ/r) r − (r·v) v)/μ・近点の黄経 ϖ = atan2(e·Q̂, e·P̂)・位置の黄経 θ = atan2(r·Q̂, r·P̂)・
//     真近点離角 f = θ − ϖ・離心近点離角 E = atan2(√(1−e²) sin f, e + cos f)・平均近点離角 M = E − e sin E・**平均経度 λ = ϖ + M**
//   (基底は初期の軌道面 —— P̂ = r₀/|r₀|・Q̂ = Ŵ × P̂・Ŵ = r₀ × v₀ の向き。lib-w304e-apsis の attachSampler と同じ面)。
//   λ は θ の巻き戻しの回数に λ − θ(= M − f —— 中心差で有界)を足して巻き戻す。窓の中で
//     λ(t) = c₀ + n_λ τ + Σ_{k=1..K} [a_k cos kθ + b_k sin kθ](τ = t − 窓の中央)
//   の最小二乗を解き、**平均経度の周期 P_λ = 2π/n_λ**。調和の項は接触の要素の軌道の位相の振れ(摂動の短周期・刻みの振れ)を吸う。
//   同じ回帰で平均近点離角 M(→ 近点周期 P_M = 2π/n_M)・接触の a と |e| の窓の中央の値(平均の半長径・平均の離心率)も出す。
//   定義の確かめ: n_λ − n_M = ϖ̇(近点率 —— lib-w304e-apsis の離心ベクトルの成分の回帰と同じ量)。
//
// ■ 使い方
//   const smp = attachMeanLon(S, { ci: 0, oi: 1, mu, every });   // S.step を包む(S.build の後・最初の S.step の前 —— lib-w304e-apsis の captureSim の中で)
//   … S.step(dt) を回す …
//   const r = meanLonFit(smp.samples(), { t0, t1, K: 3 });   // r.nLam・r.P(本の時間)・r.nM・r.PM・r.aMean・r.eMean・r.rms
//   自己試験 meanLonSelfTest()(解析のケプラーの軌道 —— 2π√(a³/μ) と照合 / 1PN の試験粒子の二体〔調和座標の運動方程式・RK4〕—— 1PN の平均運動
//   n = (−2E)^{3/2}/(GM)·(1 + 15E/(4c²)) と近点の進み k = 3(GM)²/(c²J²) から 2π/(n(1+k)) と照合)。
//
// ■ 言わないこと
//   ・「この抽出器で周期が決まった」(数値の誤差は刻みの列 h・h/2・h/4 で測る —— 回帰の標準誤差で数値の帯を置き換えない)。
//   ・「接触の要素の平均 = 観測の平均の要素」(平均の半長径の定義は複数ある —— 器は窓の中央の回帰の値と、近点・遠点の距離の平均を並べる)。
export const MEANLON_VERSION = 'w306b-meanlon-1';

const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (a) => { const n = Math.hypot(a[0], a[1], a[2]); return [a[0] / n, a[1] / n, a[2] / n]; };
const wrapPi = (x) => { let y = x % (2 * Math.PI); if (y > Math.PI) y -= 2 * Math.PI; if (y < -Math.PI) y += 2 * Math.PI; return y; };

/** 初期の軌道面の基底(P̂ = r₀ の向き・Ŵ = r₀ × v₀ の向き・Q̂ = Ŵ × P̂)。 */
export function basisOf(r0, v0) { const W = unit(cross(r0, v0)), P = unit(r0); return { P, Q: cross(W, P), W }; }

/** 接触の要素(B = 基底)。λ・θ は巻き戻していない(−π..π)。 */
export function lonElements(r, v, mu, B) {
  const rn = Math.hypot(r[0], r[1], r[2]), v2 = dot(v, v), rv = dot(r, v), ca = v2 - mu / rn;
  const ev = [(ca * r[0] - rv * v[0]) / mu, (ca * r[1] - rv * v[1]) / mu, (ca * r[2] - rv * v[2]) / mu];
  const eP = dot(ev, B.P), eQ = dot(ev, B.Q), e = Math.hypot(ev[0], ev[1], ev[2]);
  const a = 1 / (2 / rn - v2 / mu), varpi = Math.atan2(eQ, eP), theta = Math.atan2(dot(r, B.Q), dot(r, B.P));
  const f = theta - varpi, E = Math.atan2(Math.sqrt(Math.max(0, 1 - e * e)) * Math.sin(f), e + Math.cos(f)), M = E - e * Math.sin(E);
  return { a, e, eP, eQ, varpi, theta, M, lambda: varpi + M, r: rn };
}

/**
 * 走行の S.step を包んで every 步ごとに接触の要素を記録する。o = { ci, oi, mu, every }。基底は**包んだ時点**の状態(初期の軌道面)。
 * samples() は { t, lam, th, M, a, e, eP, eQ, r }(lam・th・M は巻き戻した値 —— eP・eQ・th は lib-w304e-apsis の apsisRate にそのまま渡せる)。
 * 時刻 t は步の数 × dt(同じ every × 刻みの比なら刻みを変えても同じ時刻に記録する —— every を刻みの比に合わせて呼ぶ)。
 */
export function attachMeanLon(S, o) {
  const ci = o.ci === undefined ? 0 : o.ci, oi = o.oi === undefined ? 1 : o.oi, mu = o.mu, every = Math.max(1, o.every | 0 || 1);
  const rel = () => [S.x[oi] - S.x[ci], S.y[oi] - S.y[ci], (S.z ? S.z[oi] - S.z[ci] : 0)];
  const relV = () => [S.vx[oi] - S.vx[ci], S.vy[oi] - S.vy[ci], (S.vz ? S.vz[oi] - S.vz[ci] : 0)];
  const B = basisOf(rel(), relV());
  const T = [], LAM = [], TH = [], MM = [], AA = [], EE = [], EP = [], EQ = [], RR = [];
  const z0 = lonElements(rel(), relV(), mu, B);
  let k = 0, dtSum = 0, thPrev = z0.theta, thAcc = z0.theta, vpPrev = z0.varpi, vpAcc = z0.varpi;
  const orig = S.step;
  S.step = function (dt) {
    const out = orig.apply(this, arguments);
    k++; dtSum = dt;
    const r = rel(), th = Math.atan2(dot(r, B.Q), dot(r, B.P));
    thAcc += wrapPi(th - thPrev); thPrev = th;
    if (k % every === 0) {
      const z = lonElements(r, relV(), mu, B);
      vpAcc += wrapPi(z.varpi - vpPrev); vpPrev = z.varpi;
      const lam = thAcc + wrapPi(z.lambda - z.theta);   // λ − θ = M − f(中心差 —— 有界)
      T.push(k * dt); LAM.push(lam); TH.push(thAcc); MM.push(lam - vpAcc); AA.push(z.a); EE.push(z.e); EP.push(z.eP); EQ.push(z.eQ); RR.push(z.r);
    }
    return out;
  };
  return { basis: B, initial: z0, samples: () => ({ t: T, lam: LAM, th: TH, M: MM, a: AA, e: EE, eP: EP, eQ: EQ, r: RR, every, dt: dtSum }), detach: () => { S.step = orig; } };
}

/** 小さな最小二乗(正規方程式・部分ピボットのガウス消去)。Ys は右辺の列の配列。戻り値 [{c, rms}]。 */
export function lsqMulti(X, Ys) {
  const p = X[0].length, q = Ys.length, A = Array.from({ length: p }, () => new Float64Array(p + q));
  for (let i = 0; i < X.length; i++) {
    const xi = X[i];
    for (let a = 0; a < p; a++) { for (let b = 0; b < p; b++) A[a][b] += xi[a] * xi[b]; for (let j = 0; j < q; j++) A[a][p + j] += xi[a] * Ys[j][i]; }
  }
  for (let k = 0; k < p; k++) {
    let piv = k; for (let i = k + 1; i < p; i++) if (Math.abs(A[i][k]) > Math.abs(A[piv][k])) piv = i;
    const tmp = A[k]; A[k] = A[piv]; A[piv] = tmp;
    if (A[k][k] === 0) return null;
    for (let i = k + 1; i < p; i++) { const f = A[i][k] / A[k][k]; for (let j = k; j < p + q; j++) A[i][j] -= f * A[k][j]; }
  }
  const C = [];
  for (let j = 0; j < q; j++) {
    const c = new Array(p).fill(0);
    for (let i = p - 1; i >= 0; i--) { let s = A[i][p + j]; for (let m = i + 1; m < p; m++) s -= A[i][m] * c[m]; c[i] = s / A[i][i]; }
    let ss = 0; for (let i = 0; i < X.length; i++) { let f = 0; for (let a = 0; a < p; a++) f += X[i][a] * c[a]; ss += (Ys[j][i] - f) ** 2; }
    C.push({ c, rms: Math.sqrt(ss / X.length) });
  }
  return C;
}

/**
 * 平均経度の回帰。s = samples()・o = { t0, t1(窓 —— t0 < t ≤ t1), K(位置の黄経の調和の数・既定 3) }。
 * 戻り値 { nLam, P(= 2π/nLam —— 本の時間), nM, PM(近点周期), varpiRate(= nLam − nM), aMean, eMean(窓の中央の回帰の値), aRate, rms: {lam, M, a, e}, n, K, tm }。
 * 時刻の原点を窓の中央に取るので c₀ は窓の中央の値・c₁ が率(角は rad・本の時間あたり)。
 */
export function meanLonFit(s, o = {}) {
  const K = o.K === undefined ? 3 : o.K, t0 = o.t0 === undefined ? -Infinity : o.t0, t1 = o.t1 === undefined ? Infinity : o.t1;
  const idx = []; for (let i = 0; i < s.t.length; i++) if (s.t[i] > t0 && s.t[i] <= t1) idx.push(i);
  const cols = 2 + 2 * K;
  if (idx.length < cols + 4) return null;
  const tm = (s.t[idx[0]] + s.t[idx[idx.length - 1]]) / 2;
  const X = idx.map((i) => { const row = [1, s.t[i] - tm], th = s.th[i]; for (let k = 1; k <= K; k++) row.push(Math.cos(k * th), Math.sin(k * th)); return row; });
  const R = lsqMulti(X, [idx.map((i) => s.lam[i]), idx.map((i) => s.M[i]), idx.map((i) => s.a[i]), idx.map((i) => s.e[i])]);
  if (!R) return null;
  const nLam = R[0].c[1], nM = R[1].c[1];
  return { nLam, P: 2 * Math.PI / nLam, nM, PM: 2 * Math.PI / nM, varpiRate: nLam - nM, lam0: R[0].c[0], aMean: R[2].c[0], aRate: R[2].c[1], eMean: R[3].c[0], eRate: R[3].c[1],
    rms: { lam: R[0].rms, M: R[1].rms, a: R[2].rms, e: R[3].rms }, n: idx.length, K, tm, t0: s.t[idx[0]], t1: s.t[idx[idx.length - 1]] };
}

// ---------------------------------------------------------------------------------------------
// 自己試験(物理の本は走らせない —— 解析のケプラーの軌道と、1PN の試験粒子の二体の RK4)
// ---------------------------------------------------------------------------------------------
/** 解析のケプラーの軌道を三次元に傾けて置いた疑似の sim(S.step で時刻を dt 進めて解析の位置・速度を置く)。 */
function keplerSim(o) {
  const { mu, a, e, varpi0, M0, inc, node } = o;
  const n = Math.sqrt(mu / (a * a * a)), sq = Math.sqrt(1 - e * e);
  const cI = Math.cos(inc), sI = Math.sin(inc), cO = Math.cos(node), sO = Math.sin(node), w = varpi0 - node, cw = Math.cos(w), sw = Math.sin(w);
  const rot = (xp, yp) => { const x1 = cw * xp - sw * yp, y1 = sw * xp + cw * yp, y2 = cI * y1; return [cO * x1 - sO * y2, sO * x1 + cO * y2, sI * y1]; };
  const kepE = (M) => { let E = e < 0.8 ? M : Math.PI; for (let k = 0; k < 60; k++) { const d = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E)); E -= d; if (Math.abs(d) < 1e-16) break; } return E; };
  const S = { x: [0, 0], y: [0, 0], z: [0, 0], vx: [0, 0], vy: [0, 0], vz: [0, 0], t: 0 };
  const put = () => { const E = kepE(M0 + n * S.t), cE = Math.cos(E), sE = Math.sin(E), den = 1 - e * cE;
    const r = rot(a * (cE - e), a * sq * sE), v = rot(-a * n * sE / den, a * n * sq * cE / den);
    S.x[1] = r[0]; S.y[1] = r[1]; S.z[1] = r[2]; S.vx[1] = v[0]; S.vy[1] = v[1]; S.vz[1] = v[2]; };
  put();
  S.step = function (dt) { S.t += dt; put(); };
  return { S, P: 2 * Math.PI / n };
}
/** 1PN の試験粒子(調和座標): a = −(GM/r²)[(1 − 4GM/(c²r) + v²/c²) n̂ − 4(n̂·v) v/c²] を RK4 で積む疑似の sim。初期は近点(r_p = a(1−e)・ケプラーの速さ)。 */
function pn1Sim(o) {
  const { mu, a, e, c2 } = o;
  const rp = a * (1 - e), vp = Math.sqrt(mu * (1 + e) / rp);
  let y = [rp, 0, 0, 0, vp, 0];
  const acc = (s) => { const r = Math.hypot(s[0], s[1], s[2]), nx = s[0] / r, ny = s[1] / r, nz = s[2] / r, v2 = s[3] * s[3] + s[4] * s[4] + s[5] * s[5], rd = nx * s[3] + ny * s[4] + nz * s[5];
    const A = -(mu / (r * r)) * (1 - 4 * mu / (c2 * r) + v2 / c2), Bv = 4 * mu * rd / (c2 * r * r);
    return [s[3], s[4], s[5], A * nx + Bv * s[3], A * ny + Bv * s[4], A * nz + Bv * s[5]]; };
  const S = { x: [0, y[0]], y: [0, y[1]], z: [0, y[2]], vx: [0, y[3]], vy: [0, y[4]], vz: [0, y[5]] };
  S.step = function (h) {
    const k1 = acc(y), y2 = y.map((x, j) => x + 0.5 * h * k1[j]), k2 = acc(y2), y3 = y.map((x, j) => x + 0.5 * h * k2[j]), k3 = acc(y3),
      y4 = y.map((x, j) => x + h * k3[j]), k4 = acc(y4);
    y = y.map((x, j) => x + h / 6 * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j]));
    S.x[1] = y[0]; S.y[1] = y[1]; S.z[1] = y[2]; S.vx[1] = y[3]; S.vy[1] = y[4]; S.vz[1] = y[5];
  };
  // 1PN の保存量(初期状態から): E = v²/2 − GM/r + [3v⁴/8 + (3/2)(GM/r)v² + (1/2)(GM/r)²]/c²・J = |r × v|(k は O(1/c²) なので J はニュートンの値で足りる)
  const u = mu / rp, v2 = vp * vp, E = v2 / 2 - u + (3 * v2 * v2 / 8 + 1.5 * u * v2 + 0.5 * u * u) / c2, J = rp * vp;
  const nDD = Math.pow(-2 * E, 1.5) / mu * (1 + 15 * E / (4 * c2)), k = 3 * mu * mu / (c2 * J * J);
  return { S, P0: 2 * Math.PI * Math.sqrt(a ** 3 / mu), nDD, k, Plam: 2 * Math.PI / (nDD * (1 + k)), PM: 2 * Math.PI / nDD, eps: mu / (c2 * a) };
}
export function meanLonSelfTest() {
  const bad = [], cases = [], rows = [];
  // ① 解析のケプラーの軌道(傾けた面・e 0.2056 と 0.0068・8 公転・4000 点)—— 周期 2π√(a³/μ) を 1e-12 で戻す
  for (const e of [0.2056, 0.0068]) {
    const { S, P } = keplerSim({ mu: 1, a: 1, e, varpi0: 1.3, M0: 0.4, inc: 0.12, node: 0.8 });
    const smp = attachMeanLon(S, { mu: 1, every: 1 }), N = 4000, dt = 8 * P / N;
    for (let i = 0; i < N; i++) S.step(dt);
    const f = meanLonFit(smp.samples(), { K: 3 }), rel = f ? Math.abs(f.P / P - 1) : Infinity, relM = f ? Math.abs(f.PM / P - 1) : Infinity;
    if (!(rel < 1e-12 && relM < 1e-11)) bad.push(`① ケプラーの e ${e}: P_λ/P − 1 = ${rel}・P_M/P − 1 = ${relM}`);
    rows.push({ kind: 'kepler', e, P, Plam: f && f.P, relErr: rel, relErrM: relM, aMean: f && f.aMean, eMean: f && f.eMean });
    cases.push(`① ケプラー(e ${e}・傾けた面): |P_λ/P − 1| ${rel.toExponential(1)}・|P_M/P − 1| ${relM.toExponential(1)}`);
  }
  // ② 1PN の試験粒子(e 0.2056 と 0.0068・8 公転・RK4 4000 步/公転)—— 2π/(n(1+k)) と 2π/n に照合。式は 1PN までなので、差は O(ε²)(ε = GM/(c²a))の
  //   式の打ち切りの分 —— ε = 1e-5 と 1e-6 で差が ε² に比例して縮む(比 50〜200)ことと、ε = 1e-6 の差が 2e-10 未満(1PN の分 ≈ 1.2e-5 の 2e-5 倍)を門にする
  for (const e of [0.2056, 0.0068]) {
    const one = (c2) => {
      const o = pn1Sim({ mu: 1, a: 1, e, c2 }), steps = 4000, N = 8 * steps, h = o.P0 / steps;
      const smp = attachMeanLon(o.S, { mu: 1, every: 4 });
      for (let i = 0; i < N; i++) o.S.step(h);
      const f = meanLonFit(smp.samples(), { K: 6 });
      return { o, f, rel: f ? Math.abs(f.P / o.Plam - 1) : Infinity, relM: f ? Math.abs(f.PM / o.PM - 1) : Infinity, shift: f ? f.P / o.P0 - 1 : null };
    };
    const A = one(1e5), Bq = one(1e6), ratio = A.rel / Bq.rel, ratioM = A.relM / Bq.relM;
    if (!(Bq.rel < 2e-10)) bad.push(`② 1PN の e ${e}(ε 1e-6): P_λ/(2π/(n(1+k))) − 1 = ${Bq.rel}`);
    if (!(ratio > 50 && ratio < 200)) bad.push(`② 1PN の e ${e}: 差が ε² に比例しない(ε 1e-5 と 1e-6 の比 ${ratio})`);
    if (e > 0.1 && !(Bq.relM < 2e-10 && ratioM > 50 && ratioM < 200)) bad.push(`② 1PN の e ${e}: 近点周期 P_M の差 ${Bq.relM}(比 ${ratioM})`);
    for (const [eps, z] of [[1e-5, A], [1e-6, Bq]]) rows.push({ kind: 'pn1', e, eps, Plam: z.f && z.f.P, PlamWant: z.o.Plam, PMwant: z.o.PM, relErr: z.rel, relErrM: z.relM, shiftFromKepler: z.shift, k: z.o.k });
    cases.push(`② 1PN(e ${e}): |P_λ/(2π/(n(1+k))) − 1| ε 1e-5 → ${A.rel.toExponential(1)}・ε 1e-6 → ${Bq.rel.toExponential(1)}(比 ${ratio.toFixed(1)} —— ε² の打ち切り)・`
      + `|P_M/(2π/n) − 1| ${Bq.relM.toExponential(1)}・ケプラーの 2π√(a₀³/μ) からのずれ(1PN の分)${Bq.shift === null ? '—' : Bq.shift.toExponential(3)}(ε 1e-6)`);
  }
  if (MEANLON_VERSION !== 'w306b-meanlon-1') bad.push('③ 版');
  return { version: MEANLON_VERSION, ok: bad.length === 0, bad, cases, rows };
}
