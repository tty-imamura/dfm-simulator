// 第335便e(原仮定者の補足(2026-11-12)「太陽や惑星の自転は銀河の軸引きずりから供給される —— 供給が無いと減衰するのは想定内。同様に、月の近点移動の周期は太陽無しでは徐々に減衰するが、
//   太陽有りだと安定する」・統括の検証項目 R332): **月の近点と太陽の有無の 4 列(太陽 無/有 × 引きずり 無/有)の長い窓の純関数** —— 点の質量 + 地球の J₂ の多体の積分器(RK4・刻み固定)・
//   多体の並進引きずり(自己を運ぶ式の和 —— 源ごとの重み付き平均)・動径/接線の分解・軌道の要素と近点の通過の角・調和の回帰・差の傾き
//   (器 tests/exp-w335e-moonapsis.mjs と QA lint.moonApsis335e・behavior.moonApsis335e が読む —— html を読まない・状態を持たない・第331便c・第333便c の lib は呼ぶだけ・エンジンの式を写さない)。
//
// ■ 区別(各表・各式に付ける —— 作業仮説と今のコードの実装を混ぜない)
//   実装 = 今の beta の html の在位の本 🌦️ earthMoonSunInertial3d・🌔 earthMoonOnly3d(**どちらも引きずり OFF** —— 本の質量・初期の状態・地球の J₂・自転の値を器が読む)/
//   診断 = この lib の積分器(点の質量 + 地球の J₂ —— 本のエンジン〔G_loc の項・軟化・半陰の積分器〕は写さない)/
//   宣言(未接続)= 多体の並進引きずり(今の在位の本は OFF —— 本の relativeDrag の旧い則〔W₀ の移送〕とも別の型)。
// ■ 引きずりの型(走行の前に宣言 —— 結果を見て変えない。変えたら版を上げて理由を書く)
//   並進引きずり(座標変換 —— 原仮定者の整理(2026-11-11)・自己を運ぶ式は原仮定者の決断(2026-11-12)の v を分けた形):
//     ẋ_i = v_i + λ d_i・d_i = Σ_{j≠i} w_ij P(C_{j→i} − v_i)/(W_ii + Σ_{j≠i} w_ij)・C_{j→i} = v_j + s_j × (p_i − p_j)(源の座標の角速度は**観測自転 s** —— J 案の s_d は入れない)。
//     重み w_ij = m_j/r_ij(α = 1)・自己の重み W_ii = 第333便c の selfOf(α = 1・ballHarmonic・自己の半径 R_d = Y_k m_i —— = 1/(C₁Y_k)・質量に依らない)・背景慣性決定力 W₀ = 0。
//     このとき β_ij = w_ij/(W_ii + Σw) ≈ 10 G m_j/(c₀² r_ij)(K1 の並進の係数と同じ —— 第333便c の注記)。λ は強さ(1 = 宣言どおり・10³・10⁶ = **拡大した対照**)。
//     P は成分の宣言: both = そのまま/rad = 源と受け手を結ぶ線の向きの成分(**距離の変化による並進引きずり** —— 二体の相対では −ṙ r̂)/tan = 残り(線に垂直な成分)。
//     源: 地球 → 月・月 → 地球・太陽 → 地球と月(太陽のある列)。太陽は本の宣言どおり固定(pinned —— 受け手にならない・速度 0)。
//   v_i は状態の速度(慣性の移動)・接触の速度 w_i = ẋ_i = v_i + λ d_i で軌道の要素を読む。初期の状態は位置と**接触の速度**を本の値に置く(v_i = w_i − λ d_i —— 一次の 1 回の置き換え)。
// ■ 積分器(診断): 点の質量の重力 + 地球の J₂(図形の軸は本の宣言の固定の軸・反作用は地球へ —— 太陽は固定なので太陽の反作用は捨てる)・RK4 の刻み固定(恒星月の 1/N)。
//   比べる量は同じ刻みの D0 の走行との差(差の傾き —— 刻みの誤差は差で大半が消える。残りは h/2 の走行との差で帯にする)。
// ■ 言わないこと: 月の近点の安定を引きずりと太陽の供給で出したとは書かない・今のエンジンで既に出ているとは書かない(4 列の表・減衰の時間・駆動との釣り合いの有無)。
//   拡大した対照の値を宣言どおりの値として書かない(外挿は 2 点の線形性を確かめた範囲だけ)。文献の値は本便は一次資料に当たっていない(未照合)。
import { vec, selfOf } from './lib-w333c-mercury3d.mjs';
import { C1 } from './lib-w331c-k1scale.mjs';

export const LIB_VERSION = 'w335e-moonapsis-lib-1';
const isFin = Number.isFinite;
const { add, sub, scl, dot, crs, nrm, unit } = vec;
const TAU = 2 * Math.PI;
const wrapPi = (x) => Math.atan2(Math.sin(x), Math.cos(x));

/* ───────── 宣言(走行の前に置く —— 結果を見て変えない)───────── */
export const DECL = Object.freeze({
  /** 本(在位 —— 値を読むだけ): 太陽あり = 🌦️・太陽なし = 🌔(🌦️ から写しの規則で作った地球–月の重心の系 —— 器が規則と照合する) */
  books: Object.freeze({ withSun: 'earthMoonSunInertial3d', noSun: 'earthMoonOnly3d' }),
  /** 写しの規則(太陽を外す列): 地球→月の相対の位置と速度は 🌦️ の差のまま・質量比で分けて地球–月の重心を原点・重心の速度 0(🌔 の emOnlyBodies と同じ規則) */
  copyRule: 'emOnly',
  /** 4 列(S = 太陽・D = 引きずり) */
  columns: Object.freeze(['S0D0', 'S1D0', 'S0D1', 'S1D1']),
  drag: Object.freeze({
    alpha: 1, selfType: 'ballHarmonic', selfRadius: 'Y_k m', W0: 0, spin: '観測自転 s(本の bodies[].spin)',
    /** 自転軸: 地球 = 本の J₂ の図形の軸(傾き 23.4392911°・方位 90°)・太陽と月 = +z(本に自転軸の宣言が無い —— エンジンの三次元の既定) */
    axes: Object.freeze({ sun: '+z', earth: 'j2', moon: '+z' }),
    /** 拡大の対照の比べる列(地球の自転軸を +z にする —— 軸の宣言の感度・10⁶ 倍だけ) */
    axisCompare: Object.freeze({ earth: '+z', strengths: Object.freeze([1e6]) }),
  }),
  /** 強さ(1 = 宣言どおり・10³・10⁶ = 拡大した対照 —— d に λ を掛ける。β は 1 倍の式のまま) */
  strengths: Object.freeze([1, 1e3, 1e6]),
  /** 成分の分解の対照(動径だけ・接線だけ —— 1 倍と 10⁶ 倍) */
  parts: Object.freeze(['rad', 'tan']), partStrengths: Object.freeze([1, 1e6]),
  /** 窓(年 —— ユリウス年)と刻み(恒星月の 1/N —— 本の timeRef の stepsPerOrbit 360 と同じ N)・h/2 の部分集合 */
  windowsYr: Object.freeze([20, 100]), stepsPerOrbit: 360,
  halfSubset: Object.freeze([Object.freeze({ S: 0, lam: 0 }), Object.freeze({ S: 1, lam: 0 }), Object.freeze({ S: 0, lam: 1 }), Object.freeze({ S: 1, lam: 1 }), Object.freeze({ S: 0, lam: 1e6 }), Object.freeze({ S: 1, lam: 1e6 })]),
  /** 標本(刻みの数ごと —— 360/恒星月 で 12 刻み ≈ 0.91 日)・調和の回帰の次数(φ = 2(λ☉ − ϖ̄) の 1〜3 倍 —— 本の M4 の型) */
  sampleEvery: 12, harmonics: 3,
  /** 判定の物差し(走行の前): 減衰が読める = 差の e の傾き < 0 かつ |傾き| > max(帯 × bandFactor, floorRel × e/窓) / 線形 = 10⁶ と 10³ の傾きの比 ÷ 10³ が 1 ± linTol /
   *  太陽が保つ = 太陽なしで減衰が読め、かつ太陽ありの |差の自由の成分の傾き| < keepRatio × 太陽なしの |傾き| */
  judge: Object.freeze({ bandFactor: 10, floorRel: 1e-12, linTol: 0.1, keepRatio: 0.1,
    /** 版 2(走行の前の試走で変えた —— 理由: 刻みの帯 h/2 は決定論の周期の項の漏れ〔窓 T の一次の当てはめで傾き ∝ 1/T²〕を捉えない。版 1 は帯だけで「読める」とし、20 年と 100 年の傾きが 25〜32 倍違う列を
     *  永年の減衰と数えた): **永年 = 帯で読める ∧ 20 年と 100 年の傾きが同じ符号で比 windowStable の内**。読めない列の時間の尺度は下限 e/max(閾, |100 年の傾き|) */
    version: 2, windowStable: Object.freeze([0.5, 2]) }),
});

/* ───────── 単位と係数 ───────── */
/** Y_k = 10G/(C₁c₀²)(本の単位)と自己の重み W_ii = selfOf(α = 1・ballHarmonic・R = Y_k m).w(= 1/(C₁Y_k) —— 質量に依らない) */
export function dragConsts({ G, c, m = 1 }) {
  if (!(G > 0) || !(c > 0) || !(m > 0)) throw new RangeError('dragConsts: G・c・m > 0');
  const Yk = 10 * G / (C1 * c * c), self = selfOf({ alpha: 1, m, R: Yk * m });
  return { Yk, W: self.w, selfType: self.type, closed: 1 / (C1 * Yk) };
}
export const axisOfTilt = (tiltDeg, azDeg = 0) => { const t = tiltDeg * Math.PI / 180, a = azDeg * Math.PI / 180; return [Math.sin(t) * Math.cos(a), Math.sin(t) * Math.sin(a), Math.cos(t)]; };

/* ───────── 多体の系(点の質量 + J₂ + 並進引きずり)───────── */
/**
 * sys = { G, c, bodies: [{ m, x:[3], v:[3](接触の速度 w として置く), spin, axis:[3], pinned, j2: { J2, req, axis:[3] } | null }], drag: null | { lam, part, src: [[i, j]…](i が受け手・j が源) } }
 * 戻り値: 積分器が使う平らな配列の形(固定の天体は源だけ)。
 */
export function makeSystem(sys) {
  const { G, c, bodies } = sys;
  if (!(G > 0) || !(c > 0) || !Array.isArray(bodies) || bodies.length < 2) throw new RangeError('makeSystem: G・c > 0・天体 ≥ 2');
  for (const b of bodies) if (!(b.m > 0) || !(b.x && b.x.length === 3 && b.x.every(isFin)) || !(b.v && b.v.length === 3 && b.v.every(isFin))) throw new RangeError('makeSystem: 天体は m > 0・x・v(3 成分)');
  const n = bodies.length, dg = sys.drag || null;
  if (dg && !(isFin(dg.lam) && dg.lam >= 0 && ['both', 'rad', 'tan'].includes(dg.part) && Array.isArray(dg.src))) throw new RangeError('makeSystem: drag は { lam ≥ 0・part both|rad|tan・src }');
  const K = dragConsts({ G, c }), m = bodies.map((b) => b.m), pin = bodies.map((b) => !!b.pinned);
  const S = bodies.map((b) => (b.spin && b.axis ? scl(unit(b.axis), b.spin) : [0, 0, 0]));
  const j2 = bodies.map((b) => (b.j2 && b.j2.J2 ? { J2: b.j2.J2, req: b.j2.req, k: unit(b.j2.axis) } : null));
  const src = dg ? dg.src.filter(([i, j]) => !pin[i] && i !== j) : [];
  return { G, c, n, m, pin, S, j2, K, drag: dg ? { lam: dg.lam, part: dg.part, src } : null, _den: new Float64Array(n), _acc: new Float64Array(3 * n) };
}
/** 引きずりの速度 d(状態 —— 位置 X・状態の速度 V の平らな配列)。out[3i..] に λ d_i */
function dragInto(M, X, V, out) {
  out.fill(0);
  const D = M.drag; if (!D || D.lam === 0) return out;
  const den = M._den.fill(M.K.W), acc = M._acc.fill(0);
  for (const [i, j] of D.src) {
    const rx = X[3 * i] - X[3 * j], ry = X[3 * i + 1] - X[3 * j + 1], rz = X[3 * i + 2] - X[3 * j + 2], r = Math.sqrt(rx * rx + ry * ry + rz * rz), w = M.m[j] / r, s = M.S[j];
    let dx = V[3 * j] + s[1] * rz - s[2] * ry - V[3 * i], dy = V[3 * j + 1] + s[2] * rx - s[0] * rz - V[3 * i + 1], dz = V[3 * j + 2] + s[0] * ry - s[1] * rx - V[3 * i + 2];
    if (D.part !== 'both') { const ur = (dx * rx + dy * ry + dz * rz) / (r * r); const qx = ur * rx, qy = ur * ry, qz = ur * rz;
      if (D.part === 'rad') { dx = qx; dy = qy; dz = qz; } else { dx -= qx; dy -= qy; dz -= qz; } }
    acc[3 * i] += w * dx; acc[3 * i + 1] += w * dy; acc[3 * i + 2] += w * dz; den[i] += w;
  }
  for (let i = 0; i < M.n; i++) for (let k = 0; k < 3; k++) out[3 * i + k] = D.lam * acc[3 * i + k] / den[i];
  return out;
}
/** 加速度(点の質量 + J₂ —— J₂ の天体 e の図形が天体 k に及ぼす加速度と、その反作用を e へ) */
function accelInto(M, X, out) {
  out.fill(0);
  const { G, n, m, pin, j2 } = M;
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
    const dx = X[3 * j] - X[3 * i], dy = X[3 * j + 1] - X[3 * i + 1], dz = X[3 * j + 2] - X[3 * i + 2], r2 = dx * dx + dy * dy + dz * dz, r = Math.sqrt(r2), q = G / (r2 * r);
    out[3 * i] += q * m[j] * dx; out[3 * i + 1] += q * m[j] * dy; out[3 * i + 2] += q * m[j] * dz;
    out[3 * j] -= q * m[i] * dx; out[3 * j + 1] -= q * m[i] * dy; out[3 * j + 2] -= q * m[i] * dz;
    for (const [e, k, sg] of [[i, j, 1], [j, i, -1]]) {
      const J = j2[e]; if (!J) continue;
      const x = sg * dx, y = sg * dy, z = sg * dz, zk = x * J.k[0] + y * J.k[1] + z * J.k[2], R2 = J.req * J.req;
      const f = -(G * m[e] / (r2 * r)) * 1.5 * J.J2 * R2 / r2, c1 = 1 - 5 * zk * zk / r2;
      const ax = f * (c1 * x + 2 * zk * J.k[0]), ay = f * (c1 * y + 2 * zk * J.k[1]), az = f * (c1 * z + 2 * zk * J.k[2]);
      out[3 * k] += ax; out[3 * k + 1] += ay; out[3 * k + 2] += az;
      out[3 * e] -= m[k] / m[e] * ax; out[3 * e + 1] -= m[k] / m[e] * ay; out[3 * e + 2] -= m[k] / m[e] * az;
    }
  }
  for (let i = 0; i < n; i++) if (pin[i]) { out[3 * i] = 0; out[3 * i + 1] = 0; out[3 * i + 2] = 0; }
  return out;
}
/** 初期の状態(位置・接触の速度 w を本の値に —— v = w − λ d(x, w) の一次の置き換え) */
export function initialState(M, bodies) {
  const X = new Float64Array(3 * M.n), V = new Float64Array(3 * M.n);
  bodies.forEach((b, i) => { for (let k = 0; k < 3; k++) { X[3 * i + k] = b.x[k]; V[3 * i + k] = M.pin[i] ? 0 : b.v[k]; } });
  const d = dragInto(M, X, V, new Float64Array(3 * M.n));
  for (let i = 0; i < M.n; i++) if (!M.pin[i]) for (let k = 0; k < 3; k++) V[3 * i + k] -= d[3 * i + k];
  return { X, V };
}
/**
 * RK4(刻み h 固定・steps 刻み)。every 刻みごとに obs(t, X, W〔接触の速度〕) を呼ぶ。stepHook(k, X, W) は毎刻み(近点の通過の検出用 —— 省略可)。
 */
export function integrate(M, st, { h, steps, every, obs, stepHook = null }) {
  if (!(h > 0) || !(steps >= 1) || !(every >= 1)) throw new RangeError('integrate: h > 0・steps ≥ 1・every ≥ 1');
  const N = 3 * M.n, X = Float64Array.from(st.X), V = Float64Array.from(st.V);
  const kx = [0, 1, 2, 3].map(() => new Float64Array(N)), kv = [0, 1, 2, 3].map(() => new Float64Array(N)), Xt = new Float64Array(N), Vt = new Float64Array(N), Wd = new Float64Array(N), Wc = new Float64Array(N);
  const f = (Xa, Va, ox, ov) => { dragInto(M, Xa, Va, Wd); for (let q = 0; q < N; q++) ox[q] = M.pin[(q / 3) | 0] ? 0 : Va[q] + Wd[q]; accelInto(M, Xa, ov); };
  const contact = () => { dragInto(M, X, V, Wd); for (let q = 0; q < N; q++) Wc[q] = M.pin[(q / 3) | 0] ? 0 : V[q] + Wd[q]; return Wc; };
  obs(0, X, contact());
  if (stepHook) stepHook(0, X, Wc);
  for (let s = 1; s <= steps; s++) {
    f(X, V, kx[0], kv[0]);
    for (let q = 0; q < N; q++) { Xt[q] = X[q] + 0.5 * h * kx[0][q]; Vt[q] = V[q] + 0.5 * h * kv[0][q]; } f(Xt, Vt, kx[1], kv[1]);
    for (let q = 0; q < N; q++) { Xt[q] = X[q] + 0.5 * h * kx[1][q]; Vt[q] = V[q] + 0.5 * h * kv[1][q]; } f(Xt, Vt, kx[2], kv[2]);
    for (let q = 0; q < N; q++) { Xt[q] = X[q] + h * kx[2][q]; Vt[q] = V[q] + h * kv[2][q]; } f(Xt, Vt, kx[3], kv[3]);
    for (let q = 0; q < N; q++) { X[q] += h * (kx[0][q] + 2 * kx[1][q] + 2 * kx[2][q] + kx[3][q]) / 6; V[q] += h * (kv[0][q] + 2 * kv[1][q] + 2 * kv[2][q] + kv[3][q]) / 6; }
    if (stepHook || s % every === 0) { contact(); if (stepHook) stepHook(s, X, Wc); if (s % every === 0) obs(s * h, X, Wc); }
  }
  return { X, V };
}

/* ───────── 軌道の要素(相対 —— 受け手 iM の源 iE に対する接触の状態)───────── */
/** 相対の位置 x・速度 w・μ → 要素(a・e・i・交点 Ω・近点引数 ω・面内の近点経度 ϖ = Ω + ω・e のベクトル・h のベクトル・面内の位置の経度 Ω + u・黄経 λ) —— 基準面は黄道(xy) */
export function elementsOf(x, w, mu) {
  const r = nrm(x), h = crs(x, w), hn = nrm(h), a = 1 / (2 / r - dot(w, w) / mu), ev = sub(scl(crs(w, h), 1 / mu), scl(x, 1 / r)), e = nrm(ev);
  const Wn = scl(h, 1 / hn), i = Math.acos(Math.max(-1, Math.min(1, Wn[2]))), Nv = [-h[1], h[0], 0], Nn = Math.hypot(Nv[0], Nv[1]);
  const N = Nn > 0 ? [Nv[0] / Nn, Nv[1] / Nn, 0] : [1, 0, 0], node = Math.atan2(N[1], N[0]), Mv = crs(Wn, N);
  const omega = Math.atan2(dot(ev, Mv), dot(ev, N)), u = Math.atan2(dot(x, Mv), dot(x, N));
  return { r, a, e, i, node, omega, varpi: node + omega, plon: node + u, lon: Math.atan2(x[1], x[0]), ev, h, hn };
}

/* ───────── 回帰と差 ───────── */
/** 最小二乗(正規方程式・列の尺度で割る)。cols = 列の配列(各 N)・y(N)→ 係数 */
export function lsq(cols, y) {
  const p = cols.length, N = y.length, sc = cols.map((c) => Math.sqrt(c.reduce((s, q) => s + q * q, 0) / N) || 1);
  const A = Array.from({ length: p }, () => new Float64Array(p)), b = new Float64Array(p);
  for (let a = 0; a < p; a++) { for (let c = a; c < p; c++) { let s = 0; for (let k = 0; k < N; k++) s += cols[a][k] * cols[c][k]; A[a][c] = A[c][a] = s / (sc[a] * sc[c]); } let s = 0; for (let k = 0; k < N; k++) s += cols[a][k] * y[k]; b[a] = s / sc[a]; }
  for (let c = 0; c < p; c++) { let piv = c; for (let r = c + 1; r < p; r++) if (Math.abs(A[r][c]) > Math.abs(A[piv][c])) piv = r; [A[c], A[piv]] = [A[piv], A[c]]; [b[c], b[piv]] = [b[piv], b[c]];
    for (let r = c + 1; r < p; r++) { const f = A[r][c] / A[c][c]; for (let k = c; k < p; k++) A[r][k] -= f * A[c][k]; b[r] -= f * b[c]; } }
  const x = new Float64Array(p); for (let c = p - 1; c >= 0; c--) { let s = b[c]; for (let k = c + 1; k < p; k++) s -= A[c][k] * x[k]; x[c] = s / A[c][c]; }
  return Array.from(x, (q, k) => q / sc[k]);
}
/** 角の列の巻き戻し */
export function unwrap(a) { const o = Float64Array.from(a); for (let k = 1; k < o.length; k++) { let d = o[k] - o[k - 1]; while (d > Math.PI) d -= TAU; while (d < -Math.PI) d += TAU; o[k] = o[k - 1] + d; } return o; }
/** 一次の傾き(と切片)—— t は中心化して解く */
export function linFit(t, y) { const N = t.length, tm = t.reduce((s, q) => s + q, 0) / N, ym = y.reduce((s, q) => s + q, 0) / N; let sxy = 0, sxx = 0; for (let k = 0; k < N; k++) { sxy += (t[k] - tm) * (y[k] - ym); sxx += (t[k] - tm) * (t[k] - tm); } const g = sxy / sxx; return { slope: g, at0: ym - g * tm, tm }; }
/** 二次(t は中心化 —— 戻り値 { slope〔中心の傾き〕, curv〔d²y/dt² の半分 × 2 = 傾きの変化の率〕 }) */
export function quadFit(t, y) { const tm = t.reduce((s, q) => s + q, 0) / t.length, tc = Array.from(t, (q) => q - tm), c = lsq([tc.map(() => 1), tc, tc.map((q) => q * q)], Array.from(y)); return { slope: c[1], rateChange: 2 * c[2], tm }; }
/**
 * 調和の回帰(本の M4 の型): y(t) = c + g t + Σ_{k=1..K} (a_k cos kφ + b_k sin kφ)・φ = 2(λ☉ − ϖ̄(t))・ϖ̄ = c + g t(一次の当てはめから 2 回反復)。sunLon = null なら一次だけ。
 */
export function harmonicRate(t, y, sunLon, K = DECL.harmonics) {
  let L = linFit(t, y);
  if (!sunLon || K === 0) return { rate: L.slope, amp: [], resid: rms(t.map((q, k) => y[k] - L.at0 - L.slope * q)) };
  let c = null, tm = L.tm;
  for (let it = 0; it < 2; it++) {
    const g = c ? c[1] : L.slope, c0 = c ? c[0] - c[1] * tm : L.at0, phi = t.map((q, k) => 2 * (sunLon[k] - (c0 + g * q)));
    const cols = [t.map(() => 1), t.map((q) => q - tm)];
    for (let k = 1; k <= K; k++) { cols.push(phi.map((p) => Math.cos(k * p))); cols.push(phi.map((p) => Math.sin(k * p))); }
    c = lsq(cols, Array.from(y));
    c = [c[0] + 0, ...c.slice(1)]; c._phi = phi; c._cols = cols;
  }
  const fit = t.map((q, k) => c._cols.reduce((s, col, j) => s + c[j] * col[k], 0)), amp = [];
  for (let k = 1; k <= K; k++) amp.push(Math.hypot(c[2 * k], c[2 * k + 1]));
  return { rate: c[1], amp, resid: rms(t.map((q, k) => y[k] - fit[k])) };
}
const rms = (a) => Math.sqrt(a.reduce((s, q) => s + q * q, 0) / a.length);

/* ───────── 1 本の走行(4 列の 1 列 —— 標本と近点の通過)───────── */
/**
 * run = { G, c, bodies, iE, iM, iS(太陽の添字か -1), drag(makeSystem の drag か null), h, steps, every }
 * 戻り値: 標本の列(t・e・a・i・交点・ϖ〔面内の近点経度・巻き戻し〕・λ_M〔黄経・巻き戻し〕・λ☉〔地心の太陽の黄経〕・|h|・E〔動く天体の全エネルギー —— 接触の速度〕・L_z・e のベクトルの面内の 2 成分)と近点の通過の角
 */
export function runColumn(run) {
  const { G, c, bodies, iE, iM, iS, h, steps, every } = run, M = makeSystem({ G, c, bodies, drag: run.drag }), st = initialState(M, bodies), mu = G * (bodies[iE].m + bodies[iM].m);
  const T = [], col = { e: [], a: [], inc: [], node: [], varpi: [], lonM: [], sunLon: [], hn: [], E: [], Lz: [], ex: [], ey: [] };
  const energy = (X, W) => { let E = 0; for (let i = 0; i < M.n; i++) { if (M.pin[i]) continue; E += 0.5 * M.m[i] * (W[3 * i] ** 2 + W[3 * i + 1] ** 2 + W[3 * i + 2] ** 2); }
    for (let i = 0; i < M.n; i++) for (let j = i + 1; j < M.n; j++) { const r = Math.hypot(X[3 * j] - X[3 * i], X[3 * j + 1] - X[3 * i + 1], X[3 * j + 2] - X[3 * i + 2]); E -= G * M.m[i] * M.m[j] / r; } return E; };
  const Lzof = (X, W) => { let L = 0; for (let i = 0; i < M.n; i++) { if (M.pin[i]) continue; L += M.m[i] * (X[3 * i] * W[3 * i + 1] - X[3 * i + 1] * W[3 * i]); } return L; };
  const rel = (X, W) => [[X[3 * iM] - X[3 * iE], X[3 * iM + 1] - X[3 * iE + 1], X[3 * iM + 2] - X[3 * iE + 2]], [W[3 * iM] - W[3 * iE], W[3 * iM + 1] - W[3 * iE + 1], W[3 * iM + 2] - W[3 * iE + 2]]];
  let unboundT = null;
  const obs = (t, X, W) => { const [x, w] = rel(X, W), q = elementsOf(x, w, mu); T.push(t); if (unboundT === null && !(q.a > 0 && q.e < 1 && isFin(q.e))) unboundT = t;
    col.e.push(q.e); col.a.push(q.a); col.inc.push(q.i); col.node.push(q.node); col.varpi.push(q.varpi); col.lonM.push(q.lon); col.hn.push(q.hn);
    col.sunLon.push(iS >= 0 ? Math.atan2(X[3 * iS + 1] - X[3 * iE + 1], X[3 * iS] - X[3 * iE]) : 0); col.E.push(energy(X, W)); col.Lz.push(Lzof(X, W));
    col.ex.push(q.e * Math.cos(q.varpi)); col.ey.push(q.e * Math.sin(q.varpi)); };
  // 近点の通過(距離の極小の 3 点放物線 —— 面内の位置の経度 Ω + u を同じ重みで内挿)
  const pass = { t: [], plon: [], sunLon: [] }, buf = [];
  const stepHook = (s, X, W) => { const [x, w] = rel(X, W), r = nrm(x), hh = crs(x, w), Nv = [-hh[1], hh[0], 0], Nn = Math.hypot(Nv[0], Nv[1]), N = [Nv[0] / Nn, Nv[1] / Nn, 0], Mv = crs(scl(hh, 1 / nrm(hh)), N);
    const pl = Math.atan2(N[1], N[0]) + Math.atan2(dot(x, Mv), dot(x, N)), sl = iS >= 0 ? Math.atan2(X[3 * iS + 1] - X[3 * iE + 1], X[3 * iS] - X[3 * iE]) : 0;
    buf.push({ t: s * h, r, pl, sl }); if (buf.length > 3) buf.shift();
    if (buf.length === 3 && buf[1].r < buf[0].r && buf[1].r <= buf[2].r) {
      const [p0, p1, p2] = buf, den = p0.r - 2 * p1.r + p2.r, d = den > 0 ? 0.5 * (p0.r - p2.r) / den : 0;   // 頂点の位置(刻み単位 —— −1..1)
      const u0 = p1.pl + wrapPi(p0.pl - p1.pl), u2 = p1.pl + wrapPi(p2.pl - p1.pl), s0 = p1.sl + wrapPi(p0.sl - p1.sl), s2 = p1.sl + wrapPi(p2.sl - p1.sl);
      const lag = (a0, a1, a2) => a1 + 0.5 * d * (a2 - a0) + 0.5 * d * d * (a2 - 2 * a1 + a0);
      pass.t.push(p1.t + d * h); pass.plon.push(lag(u0, p1.pl, u2)); pass.sunLon.push(lag(s0, p1.sl, s2));
    } };
  integrate(M, st, { h, steps, every, obs, stepHook: run.passages === false ? null : stepHook });
  col.varpi = Array.from(unwrap(col.varpi)); col.lonM = Array.from(unwrap(col.lonM)); col.node = Array.from(unwrap(col.node)); col.sunLon = Array.from(unwrap(col.sunLon));
  pass.plon = Array.from(unwrap(pass.plon)); pass.sunLon = Array.from(unwrap(pass.sunLon));
  return { t: T, col, pass, mu, consts: M.K, bound: unboundT === null, unboundT };
}
/** 窓 [0, T] の標本の添字の上限 */
export const windowEnd = (t, Tw) => { let k = t.length; while (k > 0 && t[k - 1] > Tw * (1 + 1e-12)) k--; return k; };
/** 列の要約(窓ごと —— refPass を渡すと近点の通過の角はその走行の分を使う〔通過を数えない走行の e の強制の成分の位相〕): 近点の率(通過の角の調和の回帰・接触の要素の一次)・周期・交点の率・恒星月・e の平均と振れ・e の強制の成分(調和の振幅)と自由の成分(一次の部分) */
export function summarize(R, Tw, withSun, refPass = null) {
  const k = windowEnd(R.t, Tw), t = R.t.slice(0, k), C = R.col, PS = refPass || R.pass, kp = windowEnd(PS.t, Tw);
  const pt = PS.t.slice(0, kp), py = PS.plon.slice(0, kp), ps = PS.sunLon.slice(0, kp);
  const hp = harmonicRate(pt, py, withSun ? ps : null), osc = linFit(t, C.varpi.slice(0, k)), nd = linFit(t, C.node.slice(0, k)), lm = linFit(t, C.lonM.slice(0, k));
  const es = C.e.slice(0, k), pl = linFit(pt, py);
  // e の強制の成分: e(t) を φ = 2(λ☉ − ϖ̄) の調和で回帰(ϖ̄ は通過の角の一次)。自由の成分 = 一次の部分(平均と傾き)
  let eForced = null, eFree = null;
  if (withSun) { const phiCols = [t.map(() => 1), t.map((q) => q - t[0])], phi = t.map((q, j) => 2 * (C.sunLon[j] - (pl.at0 + pl.slope * q)));
    for (let h = 1; h <= DECL.harmonics; h++) { phiCols.push(phi.map((p) => Math.cos(h * p))); phiCols.push(phi.map((p) => Math.sin(h * p))); }
    const cf = lsq(phiCols, es); eForced = [1, 2, 3].map((h) => Math.hypot(cf[2 * h], cf[2 * h + 1])); eFree = { mean: cf[0] + cf[1] * (t[t.length - 1] - t[0]) / 2, slope: cf[1] }; }
  else { const L = linFit(t, es); eFree = { mean: L.at0 + L.slope * L.tm, slope: L.slope }; eForced = [0, 0, 0]; }
  return { k, nPass: kp, apsRate: hp.rate, apsAmp: hp.amp, apsResid: hp.resid, apsRateOsc: osc.slope, nodeRate: nd.slope, meanMotion: lm.slope,
    eMean: es.reduce((s, q) => s + q, 0) / es.length, eMin: Math.min(...es), eMax: Math.max(...es), eForced, eFree };
}
/** 差の列(同じ刻み・同じ時刻の標本 —— on − off)の傾き: e・a・ϖ(接触の要素 —— 一次と二次)・交点・傾き・|h|・E・L_z・e のベクトル */
export function diffSlopes(on, off, Tw) {
  const k = windowEnd(off.t, Tw), t = off.t.slice(0, k), d = (key) => on.col[key].slice(0, k).map((q, j) => q - off.col[key][j]);
  const de = d('e'), dv = d('varpi'), q = quadFit(t, dv);
  const E0 = Math.abs(off.col.E[0]), L0 = Math.abs(off.col.Lz[0]), h0 = off.col.hn[0], a0 = off.col.a[0];
  return { de: linFit(t, de).slope, deEnd: de[k - 1], da: linFit(t, d('a')).slope / a0, dvarpi: q.slope, dvarpiRateChange: q.rateChange, dvarpiEnd: dv[k - 1], dnode: linFit(t, d('node')).slope,
    dinc: linFit(t, d('inc')).slope, dh: linFit(t, d('hn')).slope / h0, dE: linFit(t, d('E')).slope / E0, dLz: linFit(t, d('Lz')).slope / L0,
    dex: linFit(t, d('ex')).slope, dey: linFit(t, d('ey')).slope };
}
/** 年ごとの標本(窓の内の各年の末の差 Δe・Δϖ と、年の平均の e) */
export function yearly(on, off, YEAR, nYears) {
  const out = [];
  for (let y = 1; y <= nYears; y++) { const k = windowEnd(off.t, y * YEAR) - 1, k0 = windowEnd(off.t, (y - 1) * YEAR); let es = 0, n = 0; for (let j = k0; j <= k; j++) { es += off.col.e[j]; n++; }
    out.push({ y, eMeanOff: es / n, de: on.col.e[k] - off.col.e[k], dvarpi: on.col.varpi[k] - off.col.varpi[k] }); }
  return out;
}

/* ───────── 閉じた式(二体の相対 —— 照らす相手)───────── */
/** 二体の並進引きずり(並進の分だけ・自転なし)の 1 公転あたりの近点の回り(一次): 両方 π b/p・動径の成分 −π b/p・接線の成分 +2π b/p(b = 10 G M/c₀² —— K1 の +5/3 × 1PN と同じ。
 *  第334便c の水星の並進の分の分解〔動径 −71.63・接線 +143.27・合計 +71.63″/世紀〕の比と同じ形 —— この lib の積分器で照らす)。e の永年の変化は 0(保存の型 —— 第334便d の帳簿の型) */
export const closedApsPerOrbit = (part, b, p) => (part === 'both' ? 1 : part === 'rad' ? -1 : 2) * Math.PI * b / p;

/* ───────── 純関数の場面と門 ───────── */
/** 二体(G = 1・M = 1・a = 1・e)を 1 本走らせて接触の要素の近点の回り(1 公転あたり)を off との差で読む */
function twoBodyScene({ e, part, lam, c, nOrb = 12, spo = 1000, rot = null, j2 = null, inc = 0 }) {
  const m1 = 1 - 1e-3, m2 = 1e-3, R = rot || ((v) => v), p = 1 - e * e, rp = 1 - e, vp = Math.sqrt((1 + e) / (1 - e));
  const ci = Math.cos(inc), si = Math.sin(inc), xr = R([rp, 0, 0]), wr = R([0, vp * ci, vp * si]);
  const bodies = [{ m: m1, x: scl(xr, -m2), v: scl(wr, -m2), spin: 0, axis: R([0, 0, 1]), j2 }, { m: m2, x: scl(xr, m1), v: scl(wr, m1), spin: 0, axis: R([0, 0, 1]) }];
  const base = { G: 1, c, bodies, iE: 0, iM: 1, iS: -1, h: TAU / spo, steps: nOrb * spo, every: 10, passages: false };
  const off = runColumn(Object.assign({}, base, { drag: null })), on = runColumn(Object.assign({}, base, { drag: lam ? { lam, part, src: [[0, 1], [1, 0]] } : null }));
  const ds = diffSlopes(on, off, Infinity), ksum = summarize(off, Infinity, false);
  return { apsPerOrbit: ds.dvarpi * TAU, de: ds.de * TAU, dE: ds.dE, b: 10 / (c * c), p, off, on, nodeRateOff: ksum.nodeRate };
}
export function pureScenes() {
  const c = 1e3, e = 0.3, out = {};
  // ① 閉じた式との照らし(二体・並進の分 —— 両方・動径・接線)
  out.closed = ['both', 'rad', 'tan'].map((part) => { const s = twoBodyScene({ e, part, lam: 1, c }), want = closedApsPerOrbit(part, s.b, s.p); return { part, got: s.apsPerOrbit, want, rel: s.apsPerOrbit / want - 1, de: s.de, dE: s.dE }; });
  // ② λ = 0 は off と同じ(差は厳密に 0)
  { const s = twoBodyScene({ e, part: 'both', lam: 0, c, nOrb: 3 }); out.zero = s.on.col.e.every((q, j) => q === s.off.col.e[j]) && s.on.col.varpi.every((q, j) => q === s.off.col.varpi[j]); }
  // ③ 共変性(全体を回す —— 近点の回りと e の差が同じ)
  { const ang = 0.7, k = unit([1, 2, 3]), cs = Math.cos(ang), sn = Math.sin(ang), R = (v) => add(add(scl(v, cs), scl(crs(k, v), sn)), scl(k, dot(k, v) * (1 - cs)));
    const a = twoBodyScene({ e, part: 'both', lam: 1, c, nOrb: 6 }), b = twoBodyScene({ e, part: 'both', lam: 1, c, nOrb: 6, rot: R });
    // 回した系の面内の近点経度は基準面の取り方で変わるので、e と |h| と E の差で照らす
    const de = Math.max(...a.on.col.e.map((q, j) => Math.abs(q - b.on.col.e[j]))), dh = Math.max(...a.on.col.hn.map((q, j) => Math.abs(q / b.on.col.hn[j] - 1)));
    out.cov = { de, dh }; }
  // ④ J₂ の交点の歳差(二体・傾き 30°・解析の一次 −(3/2) n J₂ (R/p)² cos i)
  { const J2 = 1e-3, req = 0.1, inc = 30 * Math.PI / 180, s = twoBodyScene({ e: 0.1, part: 'both', lam: 0, c, nOrb: 40, spo: 600, j2: { J2, req, axis: [0, 0, 1] }, inc }), p = 1 - 0.01;
    const want = -1.5 * J2 * (req / p) ** 2 * Math.cos(inc);   // n = 1(μ ≈ 1)の 1 単位時間あたり
    out.j2 = { got: s.nodeRateOff, want, rel: s.nodeRateOff / want - 1 }; }
  // ⑤ 調和の回帰の合成(既知の率と振幅を取り戻す)
  { const t = Array.from({ length: 400 }, (q, k) => k * 0.1), sl = t.map((q) => 0.9 * q + 0.3), g = 0.07, y = t.map((q, k) => 1.2 + g * q + 0.02 * Math.cos(2 * (sl[k] - (1.2 + g * q))) + 0.005 * Math.sin(4 * (sl[k] - (1.2 + g * q))));
    const r = harmonicRate(t, y, sl, 3); out.harm = { rate: r.rate, want: g, amp1: r.amp[0], amp2: r.amp[1] }; }
  // ⑥ 入力の拒否
  out.reject = ['m', 'drag', 'h'].map((k) => { try {
    if (k === 'm') makeSystem({ G: 1, c: 1, bodies: [{ m: 0, x: [0, 0, 0], v: [0, 0, 0] }, { m: 1, x: [1, 0, 0], v: [0, 1, 0] }] });
    if (k === 'drag') makeSystem({ G: 1, c: 1, bodies: [{ m: 1, x: [0, 0, 0], v: [0, 0, 0] }, { m: 1, x: [1, 0, 0], v: [0, 1, 0] }], drag: { lam: 1, part: 'x', src: [] } });
    if (k === 'h') { const M = makeSystem({ G: 1, c: 1, bodies: [{ m: 1, x: [0, 0, 0], v: [0, 0, 0] }, { m: 1, x: [1, 0, 0], v: [0, 1, 0] }] }); integrate(M, initialState(M, [{ x: [0, 0, 0], v: [0, 0, 0] }, { x: [1, 0, 0], v: [0, 1, 0] }]), { h: 0, steps: 1, every: 1, obs: () => {} }); }
    return false; } catch (e) { return e instanceof RangeError; } });
  // ⑦ 自己の重み(α = 1・ballHarmonic・R = Y_k m)は 1/(C₁Y_k)・質量に依らない
  { const a = dragConsts({ G: 6.674, c: 29979.2458, m: 1 }), b = dragConsts({ G: 6.674, c: 29979.2458, m: 1988.5 }); out.self = { rel: Math.abs(a.W / a.closed - 1), mass: Math.abs(a.W / b.W - 1) }; }
  return out;
}
export function pureGates(S) {
  return {
    closedBoth: Math.abs(S.closed[0].rel) <= 0.02, closedRad: Math.abs(S.closed[1].rel) <= 0.02, closedTan: Math.abs(S.closed[2].rel) <= 0.02,
    conservative: S.closed.every((q) => Math.abs(q.de) <= 1e-3 * Math.abs(q.want)),
    zero: S.zero === true, covariant: S.cov.de <= 1e-9 && S.cov.dh <= 1e-9,
    j2Node: Math.abs(S.j2.rel) <= 0.02, harmonic: Math.abs(S.harm.rate / S.harm.want - 1) <= 1e-6 && Math.abs(S.harm.amp1 - 0.02) <= 1e-6,
    reject: S.reject.every(Boolean), selfWeight: S.self.rel <= 1e-6 && S.self.mass <= 1e-12,
  };
}
