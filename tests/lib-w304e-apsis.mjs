// 第304便e(DECISIONS v62 AN322・統括の検証項目 R198)— **低離心率の近点の抽出器**(ライブラリ —— 新しい器が使う。歴史の器は書き換えない)。
//
// ■ なぜ
//   検出器 B(距離の極小の 3 点放物線の頂点の方位 —— exp-w299c-planets3d の runPl3/windowOf)は、離心率が小さい軌道(🌋 e≈0.0068・💙 e≈0.0086)で
//   頂点の方位が δr/(a e) で揺れ、8 公転の窓では数値の誤差 |h/2 − h/4| が観測の σ と同じ桁になる(第303便b の移送 —— 🌋 で 1.8e-3″/世紀・σ 0.0016)。
//
// ■ 何をするか(第303便c の M4 —— 調和の回帰 —— の型)
//   每步の相対の位置 r・速度 v から**接触の離心ベクトル** e = ((v² − μ/r) r − (r·v) v)/μ(μ = G(M+m))を取り、初期の軌道面の固定の基底
//   (P̂ = r₀/|r₀|・Q̂ = Ŵ × P̂ —— runPl3 の周回の数え方と同じ面)で成分 (e_P, e_Q) を作る。成分ごとに
//     e_P(t) = A + B τ + Σ_{k=1..K} [a_k cos kθ + b_k sin kθ] (+ 足した位相の調和)・e_Q(t) = C + D τ + …(τ = t − 窓の中央・θ = 位置の黄経〔初期の面〕)
//   の最小二乗を解き、近点率 dϖ/dt = (A D − C B)/(A² + C²)(ゆっくり回る離心ベクトルの角速度 —— 窓の中の回転は 1e-5 rad 以下で線形化の誤差は無視できる)。
//   **角度でなく成分で回帰する**: 刻みの半步のずれ(位置と速度の時刻の差)や摂動の短周期の振れは離心ベクトルに軌道の位相の調和として乗り、低離心率では
//   その振れが |e| を越えうる(角度は巻き付く)—— 成分の調和は線形の項として吸収できる。太陽の相対の項(地球–月の出差 2(λ☉ − ϖ̄) など)は
//   `extraPhases`(位相の列と調和の数)で足す。
//
// ■ 使い方
//   const smp = attachSampler(S, { ci: 0, oi: 1, mu, every: 1 });   // S.step を包む(S は HP.coord3d.makeSim() —— 走らせる前に)
//   … S.step(dt) を回す(runPl3 でよい —— makeSim を捕まえる captureSim を使う)…
//   const r = apsisRate(smp.samples(), { t0, t1, K: 3 });   // r.rate [rad/本の時間]・r.e・r.rms・r.n
//   自己試験 apsisSelfTest()(合成の系列と −k/r⁴ の摂動の二体の RK4 —— 解析の近点率 2πμk/h⁴ と照合)。
//
// ■ 言わないこと
//   ・「この抽出器で近点率が決まった」(数値の誤差は刻みの列 h・h/2・h/4 で測る —— 抽出器は検出器の揺れを減らすだけ)。
//   ・「接触の要素 = 平均の要素」(定数のずれは近点率に効かない —— 率だけを使う)。
export const APSIS_VERSION = 'w304e-apsis-1';

const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (a) => { const n = Math.hypot(a[0], a[1], a[2]); return [a[0] / n, a[1] / n, a[2] / n]; };

/** 接触の離心ベクトル(三次元の配列)。 */
export function eccVector(r, v, mu) {
  const rn = Math.hypot(r[0], r[1], r[2]), v2 = dot(v, v), rv = dot(r, v), a = v2 - mu / rn;
  return [(a * r[0] - rv * v[0]) / mu, (a * r[1] - rv * v[1]) / mu, (a * r[2] - rv * v[2]) / mu];
}

/** 小さな最小二乗(正規方程式・部分ピボットのガウス消去 —— 第303便c の lsq と同じ式。列は 20 本程度まで)。複数の右辺 Y(列の配列)を一度に解く。 */
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
 * 走行の S.step を包んで每步(every 步ごと)に相対の状態を記録する。o = { ci, oi, mu, every }。基底は**包んだ時点**の状態(初期の軌道面)から作る ——
 * S.build の後・最初の S.step の前に呼ぶこと。samples() は { t, eP, eQ, th, e } の列(th は巻き戻した位置の黄経)。
 */
export function attachSampler(S, o) {
  const ci = o.ci === undefined ? 0 : o.ci, oi = o.oi === undefined ? 1 : o.oi, mu = o.mu, every = Math.max(1, o.every | 0 || 1);
  const rel = () => [S.x[oi] - S.x[ci], S.y[oi] - S.y[ci], (S.z ? S.z[oi] - S.z[ci] : 0)];
  const relV = () => [S.vx[oi] - S.vx[ci], S.vy[oi] - S.vy[ci], (S.vz ? S.vz[oi] - S.vz[ci] : 0)];
  const r0 = rel(), v0 = relV(), W = unit(cross(r0, v0)), P = unit(r0), Q = cross(W, P);
  const T = [], EP = [], EQ = [], TH = [];
  let t = 0, k = 0, thPrev = Math.atan2(dot(r0, Q), dot(r0, P)), thAcc = thPrev;
  const orig = S.step;
  S.step = function (dt) {
    const out = orig.apply(this, arguments);
    t += dt; k++;
    const r = rel(), th = Math.atan2(dot(r, Q), dot(r, P));
    let d = th - thPrev; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
    thAcc += d; thPrev = th;
    if (k % every === 0) { const e = eccVector(r, relV(), mu); T.push(t); EP.push(dot(e, P)); EQ.push(dot(e, Q)); TH.push(thAcc); }
    return out;
  };
  return { basis: { P, Q, W }, samples: () => ({ t: T, eP: EP, eQ: EQ, th: TH }), detach: () => { S.step = orig; } };
}

/** HP.coord3d.makeSim を一時的に包んで、fn の中で作られた sim を捕まえる(onSim(S) は S.build の後の最初の step の前に呼ばれる —— build を包む)。 */
export function captureSim(HP, onSim, fn) {
  const C3 = HP.coord3d, orig = C3.makeSim;
  C3.makeSim = function () {
    const S = orig.apply(this, arguments), b = S.build;
    S.build = function () { const r = b.apply(this, arguments); onSim(S); return r; };
    return S;
  };
  try { return fn(); } finally { C3.makeSim = orig; }
}

/**
 * 近点率の回帰。s = samples()・o = { t0, t1(窓 —— t0 < t ≤ t1), K(位置の黄経の調和の数・既定 3), extraPhases: [{ phase: number[](s と同じ長さ), K }] }。
 * 戻り値 { rate(dϖ/dt —— 本の時間あたり rad), e(窓の中央の離心率), varpi(窓の中央の近点の黄経), rms: [e_P, e_Q], n, K, cols }。
 */
export function apsisRate(s, o = {}) {
  const K = o.K === undefined ? 3 : o.K, t0 = o.t0 === undefined ? -Infinity : o.t0, t1 = o.t1 === undefined ? Infinity : o.t1;
  const idx = []; for (let i = 0; i < s.t.length; i++) if (s.t[i] > t0 && s.t[i] <= t1) idx.push(i);
  const extra = o.extraPhases || [];
  const cols = 2 + 2 * K + extra.reduce((a, z) => a + 2 * (z.K || 1), 0);
  if (idx.length < cols + 4) return null;
  const tm = (s.t[idx[0]] + s.t[idx[idx.length - 1]]) / 2;
  const X = idx.map((i) => {
    const row = [1, s.t[i] - tm], th = s.th[i];
    for (let k = 1; k <= K; k++) row.push(Math.cos(k * th), Math.sin(k * th));
    for (const z of extra) for (let k = 1; k <= (z.K || 1); k++) row.push(Math.cos(k * z.phase[i]), Math.sin(k * z.phase[i]));
    return row;
  });
  const R = lsqMulti(X, [idx.map((i) => s.eP[i]), idx.map((i) => s.eQ[i])]);
  if (!R) return null;
  const [A, B] = R[0].c, [C, D] = R[1].c, e2 = A * A + C * C;
  return { rate: (A * D - C * B) / e2, e: Math.sqrt(e2), varpi: Math.atan2(C, A), rms: [R[0].rms, R[1].rms], n: idx.length, K, cols, tm };
}

/** 本の時間あたり rad → ″/世紀(Tsec: 本の時間単位の秒)。 */
export function toArcsecPerCentury(rate, Tsec) { return rate * (36525 * 86400 / Tsec) * 180 / Math.PI * 3600; }

// ---------------------------------------------------------------------------------------------
// 自己試験(物理の本は走らせない —— 合成の系列と、−k/r⁴ の動径の摂動を足した二体の RK4)
// ---------------------------------------------------------------------------------------------
/** 二体(μ・中心固定)に動径の摂動 −k/r⁴ を足した軌道を RK4 で積み、每步の (r, v) を返す。初期は近点(r_p = a(1−e))。 */
function rk4Orbit(o) {
  const { mu, a, e, k, nPer, steps } = o;
  const rp = a * (1 - e), vp = Math.sqrt(mu * (1 + e) / rp);
  let y = [rp, 0, 0, 0, vp, 0];
  const P = 2 * Math.PI * Math.sqrt(a ** 3 / mu), h = P / steps;
  const f = (s) => { const r = Math.hypot(s[0], s[1], s[2]), g = -mu / r ** 3 - k / r ** 5; return [s[3], s[4], s[5], g * s[0], g * s[1], g * s[2]]; };
  const out = { t: [], r: [], v: [], h, P };
  const N = Math.round(nPer * steps);
  for (let i = 1; i <= N; i++) {
    const k1 = f(y), y2 = y.map((x, j) => x + 0.5 * h * k1[j]), k2 = f(y2), y3 = y.map((x, j) => x + 0.5 * h * k2[j]), k3 = f(y3),
      y4 = y.map((x, j) => x + h * k3[j]), k4 = f(y4);
    y = y.map((x, j) => x + h / 6 * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j]));
    out.t.push(i * h); out.r.push([y[0], y[1], y[2]]); out.v.push([y[3], y[4], y[5]]);
  }
  return out;
}
/** 疑似の sim(S.step が RK4 の 1 步を進める)—— attachSampler を通して同じ道で試す。 */
function fakeSim(orbit) {
  let i = -1;
  const S = { x: [0, 0], y: [0, 0], z: [0, 0], vx: [0, 0], vy: [0, 0], vz: [0, 0] };
  const put = (j) => { const r = j < 0 ? orbit.r0 : orbit.r[j], v = j < 0 ? orbit.v0 : orbit.v[j]; S.x[1] = r[0]; S.y[1] = r[1]; S.z[1] = r[2]; S.vx[1] = v[0]; S.vy[1] = v[1]; S.vz[1] = v[2]; };
  put(-1);
  S.step = function () { i++; put(i); };
  return S;
}
export function apsisSelfTest() {
  const bad = [], cases = [];
  // ① 合成の系列: e = 0.007 の離心ベクトルが ω で回り、位置の黄経の 1・2 倍の調和の振れ(振幅 0.02 —— |e| を越える)と定数のずれが乗る → 率を 1e-9 で戻す
  {
    const n = 4000, w = 3e-6, e0 = 0.007, s = { t: [], eP: [], eQ: [], th: [] };
    for (let i = 0; i < n; i++) {
      const t = i * 0.01, th = 2 * Math.PI * t / 5, vp = 0.3 + w * t;
      s.t.push(t); s.th.push(th);
      s.eP.push(e0 * Math.cos(vp) + 0.02 * Math.cos(th) - 0.011 * Math.sin(2 * th) + 1e-4);
      s.eQ.push(e0 * Math.sin(vp) + 0.02 * Math.sin(th) + 0.007 * Math.cos(2 * th) - 2e-4);
    }
    const r = apsisRate(s, { K: 3 }), r0 = apsisRate(s, { K: 0 });
    // 定数のずれ (1e-4, −2e-4) は離心ベクトルの原点を動かすので、真の率は回転の幾何で決まる —— ずれを含めた (A,C) の回転率を解析で
    const A = e0 * Math.cos(0.3 + w * 20) + 1e-4, C = e0 * Math.sin(0.3 + w * 20) - 2e-4, B = -e0 * w * Math.sin(0.3 + w * 20), D = e0 * w * Math.cos(0.3 + w * 20);
    const want = (A * D - C * B) / (A * A + C * C);
    const rel = r ? Math.abs(r.rate - want) / Math.abs(want) : Infinity;
    if (!(rel < 1e-6)) bad.push(`① 合成の系列の率 ${r && r.rate} ≠ ${want}(相対 ${rel})`);
    cases.push(`① 合成(e 0.007・調和の振れ 0.02 > |e|): K=3 の率の相対誤差 ${rel.toExponential(1)}・K=0 は ${r0 ? (Math.abs(r0.rate - want) / Math.abs(want)).toExponential(1) : '—'}`);
  }
  // ② −k/r⁴ の摂動の二体(μ=1・a=1・e=0.007・8 公転・RK4 2000 步/公転)—— 解析の近点率 2πμk/h⁴(一次)と照合。疑似の sim を attachSampler で
  {
    const mu = 1, a = 1, e = 0.007, k = 2e-6, steps = 2000, nPer = 8;
    const o = rk4Orbit({ mu, a, e, k, nPer, steps });
    const rp = a * (1 - e); o.r0 = [rp, 0, 0]; o.v0 = [0, Math.sqrt(mu * (1 + e) / rp), 0];
    const S = fakeSim(o), smp = attachSampler(S, { mu });
    for (let i = 0; i < o.t.length; i++) S.step(o.h);
    const hh = Math.sqrt(mu * a * (1 - e * e)), perOrbit = 2 * Math.PI * mu * k / hh ** 4, want = perOrbit / o.P;
    const r = apsisRate(smp.samples(), { K: 3 }), r0 = apsisRate(smp.samples(), { K: 0 });
    const rel = r ? Math.abs(r.rate - want) / want : Infinity;
    // 一次の式の誤差は k/(μ a) ≈ 2e-6 の相対の桁・e² の補正を含めて 1e-3 以内を門にする
    if (!(rel < 1e-3)) bad.push(`② −k/r⁴ の二体の率 ${r && r.rate} ≠ 解析 ${want}(相対 ${rel})`);
    cases.push(`② −k/r⁴ の二体(e 0.007・8 公転): K=3 の率 / 解析 2πμk/h⁴ = ${r ? (r.rate / want).toFixed(6) : '—'}・K=0 は ${r0 ? (r0.rate / want).toFixed(6) : '—'}・離心率 ${r ? r.e.toFixed(6) : '—'}`);
  }
  // ③ 版
  if (APSIS_VERSION !== 'w304e-apsis-1') bad.push('③ 版');
  return { version: APSIS_VERSION, ok: bad.length === 0, bad, cases };
}
