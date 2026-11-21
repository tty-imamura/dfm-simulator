// 第347便d(原仮定者の回答(2026-11-21 —— 第145報)「AN909: 推奨で進める」= 引きずりには当事者時間の因子を掛けない型 D0 を主・掛ける型 D1〜D3 は比べる列・統括の検証項目 R403):
//   **引きずりの 3 体と長い走り —— 第344便d の宣言 D0〜D3 を 3 体(太陽–地球–月の型・水星の型 + 木星の型)へ広げ、近点と交点の率・重心の漂い・運動量と角運動量の残りを数え、
//   2 体を周期の 1e5 倍まで走らせてエネルギーの帳簿の残りが時間に比例して積むか有界かを数え、重力の換算 (α) と D0 の組を現行の近似 (0) と D0 の組と並べる純関数 —— 診断だけ**
//   (器 tests/exp-w347d-draglong.mjs と QA behavior.draglong347d・docs.draglong347d が読む —— html を読まない・ファイルを読まない・状態を持たない)。
//   アプリの引きずり・重力・時計・積分・内蔵の本・受理器は変えない。水星の本と今の収支(−28.65 + 71.63 = 42.98″/世紀)に項を足さない。
//   引きずりの宣言・時計の因子・2 体の移送・試験粒子の近点は第344便d の lib を呼ぶだけ(本文は変えない)・2 体の系は第343便b の systemOf・K1 の一次は第331便c の k1Share・
//   RK4 の 1 步と水星の 1PN は第341便e の lib を呼ぶだけ。重力の換算 (α) の式は本 lib に閉じて書く(本便の換算の多体の枝の lib は呼ばない —— 数が同じになることは統合で照合する)。
//
// ■ 記号(無次元・基準光速 c₀ = 1・重力定数 1): 絶対時間 t・位置 p・速度 v(状態 —— 絶対時間で見た速度。引きずりは v を変えない)・静止の時計の ψ_i = ψ₀ + Σ_j m_j / r_ij・
//   当事者時間の進み q_i = e^(−ψ_i) g(x_i)(g は今の点の時計の形 F = √(1 − x²))・x_i = w_i e^(2ψ_i)(速い道では w_i ÷ N_i² —— 同じ量)・w_i = 大きさ(v_i − v_cm − u_i)(v_cm = 系の重心の速度 —— 第344便d の 2 体の枠を多体へ)。
//   並進引きずり K1 の一次の移送: 重み a_ij = 10 m_j / r_ij・(I + L) u = s(u_i (1 + Σ_j a_ij) − Σ_j a_ij u_j = s_i・s_i = Σ_j a_ij (v_j − v_i))—— 今のアプリの既定 compose:"solve" と同じ形。
//   dp_i/dt = v_i + U_i(U は宣言ごとの移送の速度)・dv_i/dt = 重力(本 lib の 3 体と長い走りはニュートン —— 引きずりの宣言だけを比べる)。
// ■ 宣言(第344便d と同じ —— どれも比べるための宣言・アプリへは入れない)
//   D0 掛けない(主 —— 原仮定者の回答(2026-11-21 —— 第145報)AN909)・D1 移送の増し分に受け手の q(U_i = q_i u_i)・D2 枠の速度を源の q で読む(s_i = Σ_j a_ij q_j (v_j − v_i))・
//   D3 移送の重みに受け手の q(a_ij → q_i a_ij —— 行列ごと)。対照 DC は第344便d の零試験で通らないので本 lib では走らせない。
// ■ 2 体の帳簿(T2): D0 の 2 体では u₁ − u₂ = β/(1 + β)(v₂ − v₁)(β = K/r・K = 10 (m₁ + m₂))・dp₂/dt − dp₁/dt = (v₂ − v₁)/(1 + β) なので、
//   dE/dt = −m₁m₂ K (dr/dt)/r³(r の変化は位置の変化 dp/dt で読む)—— r だけの関数 × dr/dt。よって E_mod = E − m₁m₂ K/(2r²) が保たれる(式の展開 —— 純関数の場面で数で確かめる)。D1〜D3 は同じ E_mod を帳簿に使い、その残りを数える。
// ■ 言わないこと: 宣言は比べるための宣言(引きずりの換算が決まったとは書かない)・「引きずりは熱を出さないと確かめられた」とは書かない(この宣言・この長さ・この刻みでは、の表)・
//   数は誇張した系の比 —— 水星や月の観測の値へ合わせたものではない・今の収支に足さない・光速を候補の採否に使わない。
import { qOf, pairDrift, apsidalDrag } from './lib-w344d-dragconv.mjs';
import { systemOf } from './lib-w343b-partytime.mjs';
import { k1Share } from './lib-w331c-k1scale.mjs';
import { rk4Step, mercury1PN } from './lib-w341e-lightmass.mjs';

export const LIB_VERSION = 'w347d-draglong-lib-1';
const sqrt = Math.sqrt;   // 正しく丸める関数(実行系に依らない)—— 速い道で使う。exp・log は Math から呼ぶ(第338便c の尺度の走り直しが届く)
const fin = (x) => typeof x === 'number' && Number.isFinite(x);

export const DECL = Object.freeze({
  drags: Object.freeze(['D0', 'D1', 'D2', 'D3']),
  main: 'D0',
  kK1: 10,
  /** T1: 3 体の系(重力定数 1・c₀ = 1・誇張した場)。inner = 率を読む内側の軌道(b のまわりの a)・outer = 外の周期で走る長さを数える */
  systems: Object.freeze({
    sem: Object.freeze({ name: '太陽–地球–月の型', m: Object.freeze([1e-3, 1e-5, 1e-7]), outer: Object.freeze({ a: 1, e: 0.0167 }), inner: Object.freeze({ a: 0.03, e: 0.1, incDeg: 5 }),
      orbitsOuter: 10, steps: Object.freeze([160, 320]), sampleDiv: 16, note: '質量の比 1 : 1e-2 : 1e-4(地球と月を誇張)・月の軌道は地球のヒル半径の約 0.2 倍・外の周期 ÷ 月の周期 ≈ 19' }),
    mj: Object.freeze({ name: '水星の型 + 木星の型', m: Object.freeze([1e-4, 1e-10, 1e-7]), inner: Object.freeze({ a: 1, e: 0.20563593, incDeg: 7 }), outer: Object.freeze({ a: 3, e: 0.048 }),
      orbitsOuter: 4, limitOuter: 16, steps: Object.freeze([400, 800]), sampleDiv: 16, note: '太陽の ψ = 1e-4(水星の軌道)・木星の型は質量の比 1e-3・長半径 3(誇張して近い)・水星の型の質量 1e-10(ほぼ試験粒子)' }),
  }),
  /** T2: 2 体(第343便b の systemOf('two') —— 質量 0.01・0.005・a = 1・e = 0.3)・1 周の刻み 2 つ(1e5 周は 128 と 160)・走る長さ(周期の倍)・帳簿を 8 步ごとに読む・10 倍ごとの窓 */
  long: Object.freeze({ steps: Object.freeze([128, 256]), orbitsShort: 1e3, orbitsAll: 1e4, orbitsMax: 1e5, stepsMax: Object.freeze([128, 160]), maxDrags: Object.freeze(['D0', 'D1']), sampleEvery: 8,
    decades: Object.freeze([1, 10, 100, 1e3, 1e4, 1e5]) }),
  /** T3: 試験粒子(中心は固定)・a = 1・水星の e・1 周 3000 と 6000 刻み・近点 4 回の差(第344便d の T3 と同じ数え方)・二次の読みの μ */
  orbit: Object.freeze({ mu: 1e-5, e: 0.20563593, steps: Object.freeze([3000, 6000]), nOrb: 4 }),
  muSlope: Object.freeze([1e-4, 2e-4, 4e-4]),
  /** T3 の重力の換算: 現行の近似 (0)(絶対時間・局所の重力の指数 2)・(α)(速度の増し分を当事者時間で数える・指数 1 —— 主の候補) */
  gravs: Object.freeze([Object.freeze({ key: 'cur', kind: '0', nG: 2, name: '現行の近似 (0)(絶対時間・指数 2)' }), Object.freeze({ key: 'alpha1', kind: 'alpha', nG: 1, name: '(α) 速度の増し分を当事者時間で(指数 1)' })]),
  c: 299792458,
  mercuryGMoverA: Object.freeze({ GM: 1.32712440018e20, a: 5.7909e10, note: '太陽の GM と水星の長半径は標準の値 —— 文献の値・未照合(この環境で一次資料に当たっていない)' }),
});

/* ───────── 多体の移送(宣言ごと —— 平らな配列・割り当てなし)───────── */
/**
 * 系の右辺を作る: f(s, o)。s = [p(3N), v(3N)]・o に [dp/dt(3N), dv/dt(3N)] を書く。drag は D0〜D3 か 'none'(移送なし)。
 * grav = true でニュートンの重力。戻り値の関数は最後の評価の q・ψ・U を f.q・f.psi・f.U に残す(読むだけ)
 */
export function makeSys(drag, m, { psi0 = 0, kK1 = DECL.kK1, grav = true } = {}) {
  if (!(drag === 'none' || DECL.drags.includes(drag))) throw new Error('makeSys: 宣言が無い ' + drag);
  const N = m.length;
  if (!(N >= 2 && m.every((x) => fin(x) && x >= 0))) throw new Error('makeSys: 質量は 2 つ以上・非負');
  const M = m.reduce((a, b) => a + b, 0), N3 = 3 * N;
  const iR = new Float64Array(N * N), Wq = new Float64Array(N * N), A = new Float64Array(N * N), W = new Float64Array(N * N), B = new Float64Array(N3), u = new Float64Array(N3), U = new Float64Array(N3);
  const q = new Float64Array(N), psi = new Float64Array(N);
  // (I + L) x = rhs を解く(対角が優る —— ピボットなし)。Wm = 重み a_ij(i 行)・rhs と結果は 3 列
  const solve = (Wm, rhs, out) => {
    for (let i = 0; i < N; i++) { let d = 1; for (let j = 0; j < N; j++) if (j !== i) { d += Wm[i * N + j]; A[i * N + j] = -Wm[i * N + j]; } A[i * N + i] = d; }
    for (let k = 0; k < N; k++) { const pv = A[k * N + k];
      for (let i = k + 1; i < N; i++) { const f = A[i * N + k] / pv; if (f === 0) continue;
        for (let j = k; j < N; j++) A[i * N + j] -= f * A[k * N + j];
        for (let c = 0; c < 3; c++) rhs[3 * i + c] -= f * rhs[3 * k + c]; } }
    for (let i = N - 1; i >= 0; i--) for (let c = 0; c < 3; c++) { let x = rhs[3 * i + c]; for (let j = i + 1; j < N; j++) x -= A[i * N + j] * out[3 * j + c]; out[3 * i + c] = x / A[i * N + i]; }
  };
  const f = (s, o) => {
    for (let k = 0; k < N3; k++) o[N3 + k] = 0;
    for (let i = 0; i < N; i++) psi[i] = psi0;
    for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
      const dx = s[3 * j] - s[3 * i], dy = s[3 * j + 1] - s[3 * i + 1], dz = s[3 * j + 2] - s[3 * i + 2], r2 = dx * dx + dy * dy + dz * dz, r = sqrt(r2);
      iR[i * N + j] = iR[j * N + i] = r;
      psi[i] += m[j] / r; psi[j] += m[i] / r;
      if (grav) { const k3 = 1 / (r2 * r); o[N3 + 3 * i] += m[j] * k3 * dx; o[N3 + 3 * i + 1] += m[j] * k3 * dy; o[N3 + 3 * i + 2] += m[j] * k3 * dz;
        o[N3 + 3 * j] -= m[i] * k3 * dx; o[N3 + 3 * j + 1] -= m[i] * k3 * dy; o[N3 + 3 * j + 2] -= m[i] * k3 * dz; }
    }
    if (drag === 'none') { for (let k = 0; k < N3; k++) { o[k] = s[N3 + k]; U[k] = 0; } return; }
    if (N === 2) { pair2(s, o); return; }
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) W[i * N + j] = i === j || m[j] === 0 ? 0 : kK1 * m[j] / iR[i * N + j];
    const rhsOf = (Wm, qs) => { for (let i = 0; i < N; i++) for (let c = 0; c < 3; c++) { let x = 0; for (let j = 0; j < N; j++) if (j !== i) x += Wm[i * N + j] * (qs ? qs[j] : 1) * (s[N3 + 3 * j + c] - s[N3 + 3 * i + c]); B[3 * i + c] = x; } };
    rhsOf(W, null); solve(W, B, u);
    if (drag === 'D0') { for (let k = 0; k < N3; k++) U[k] = u[k]; }
    else {
      const vc = [0, 0, 0];
      if (M > 0) for (let c = 0; c < 3; c++) { let x = 0; for (let i = 0; i < N; i++) x += m[i] * s[N3 + 3 * i + c]; vc[c] = x / M; }
      for (let i = 0; i < N; i++) { const wx = s[N3 + 3 * i] - vc[0] - u[3 * i], wy = s[N3 + 3 * i + 1] - vc[1] - u[3 * i + 1], wz = s[N3 + 3 * i + 2] - vc[2] - u[3 * i + 2];
        const w = sqrt(wx * wx + wy * wy + wz * wz), N0 = Math.exp(-psi[i]), x = w / (N0 * N0); q[i] = N0 * sqrt(Math.max(0, 1 - x * x)); }
      if (drag === 'D1') { for (let i = 0; i < N; i++) for (let c = 0; c < 3; c++) U[3 * i + c] = q[i] * u[3 * i + c]; }
      else if (drag === 'D2') { rhsOf(W, q); solve(W, B, U); }
      else { for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) Wq[i * N + j] = q[i] * W[i * N + j]; rhsOf(Wq, null); solve(Wq, B, U); }
    }
    for (let k = 0; k < N3; k++) o[k] = s[N3 + k] + U[k];
  };
  // N = 2 の速い道(第344便d の solve2 の閉じた形 —— (1 + a12) u1 − a12 u2 = s1・−a21 u1 + (1 + a21) u2 = s2)
  const sv = (b12, b21, x1, x2, y1, y2, z1, z2, out) => { const D = 1 + b12 + b21;
    out[0] = ((1 + b21) * x1 + b12 * x2) / D; out[1] = ((1 + b21) * y1 + b12 * y2) / D; out[2] = ((1 + b21) * z1 + b12 * z2) / D;
    out[3] = (b21 * x1 + (1 + b12) * x2) / D; out[4] = (b21 * y1 + (1 + b12) * y2) / D; out[5] = (b21 * z1 + (1 + b12) * z2) / D; };
  const pair2 = (s, o) => {
    const r = iR[1], a12 = m[1] === 0 || m[0] === 0 ? 0 : kK1 * m[1] / r, a21 = m[1] === 0 || m[0] === 0 ? 0 : kK1 * m[0] / r;
    const dx = s[9] - s[6], dy = s[10] - s[7], dz = s[11] - s[8];
    sv(a12, a21, a12 * dx, -a21 * dx, a12 * dy, -a21 * dy, a12 * dz, -a21 * dz, u);
    if (drag === 'D0') { for (let k = 0; k < 6; k++) U[k] = u[k]; }
    else {
      let vx = 0, vy = 0, vz = 0;
      if (M > 0 && a12 !== 0) { vx = (m[0] * s[6] + m[1] * s[9]) / M; vy = (m[0] * s[7] + m[1] * s[10]) / M; vz = (m[0] * s[8] + m[1] * s[11]) / M; }
      for (let i = 0; i < 2; i++) { const wx = s[6 + 3 * i] - vx - u[3 * i], wy = s[7 + 3 * i] - vy - u[3 * i + 1], wz = s[8 + 3 * i] - vz - u[3 * i + 2];
        const N0 = Math.exp(-psi[i]), x = sqrt(wx * wx + wy * wy + wz * wz) / (N0 * N0); q[i] = N0 * sqrt(Math.max(0, 1 - x * x)); }
      if (drag === 'D1') { for (let k = 0; k < 3; k++) { U[k] = q[0] * u[k]; U[3 + k] = q[1] * u[3 + k]; } }
      else if (drag === 'D2') sv(a12, a21, a12 * (q[1] * s[9] - q[1] * s[6]), a21 * (q[0] * s[6] - q[0] * s[9]), a12 * (q[1] * s[10] - q[1] * s[7]), a21 * (q[0] * s[7] - q[0] * s[10]), a12 * (q[1] * s[11] - q[1] * s[8]), a21 * (q[0] * s[8] - q[0] * s[11]), U);
      else { const b12 = q[0] * a12, b21 = q[1] * a21; sv(b12, b21, b12 * dx, -b21 * dx, b12 * dy, -b21 * dy, b12 * dz, -b21 * dz, U); }
    }
    for (let k = 0; k < 6; k++) o[k] = s[6 + k] + U[k];
  };
  f.q = q; f.psi = psi; f.U = U; f.N = N;
  return f;
}
/** 2 体だけの速い右辺(T2 の長い走り用 —— makeSys の N = 2 の道と同じ式を、配列と関数の呼び出しを省いて書いたもの。純関数の場面で makeSys と照合する) */
export function makePair2(drag, m, kK1 = DECL.kK1) {
  if (!DECL.drags.includes(drag)) throw new Error('makePair2: 宣言が無い ' + drag);
  const m1 = m[0], m2 = m[1], M = m1 + m2, k = drag === 'D0' ? 0 : drag === 'D1' ? 1 : drag === 'D2' ? 2 : 3;
  return (s, o) => {
    const dx = s[3] - s[0], dy = s[4] - s[1], dz = s[5] - s[2], r2 = dx * dx + dy * dy + dz * dz, r = sqrt(r2), k3 = 1 / (r2 * r);
    const a12 = kK1 * m2 / r, a21 = kK1 * m1 / r, D = 1 + a12 + a21;
    const ex = s[9] - s[6], ey = s[10] - s[7], ez = s[11] - s[8];
    // D0 の u(solve2 の閉じた形 —— s1 = a12 e・s2 = −a21 e)
    let c1 = ((1 + a21) * a12 + a12 * -a21) / D, c2 = (a21 * a12 + (1 + a12) * -a21) / D;
    let u1x = c1 * ex, u1y = c1 * ey, u1z = c1 * ez, u2x = c2 * ex, u2y = c2 * ey, u2z = c2 * ez;
    if (k !== 0) {
      const vx = (m1 * s[6] + m2 * s[9]) / M, vy = (m1 * s[7] + m2 * s[10]) / M, vz = (m1 * s[8] + m2 * s[11]) / M;
      const N1 = Math.exp(-(m2 / r)), N2 = Math.exp(-(m1 / r));
      const w1x = s[6] - vx - u1x, w1y = s[7] - vy - u1y, w1z = s[8] - vz - u1z, w2x = s[9] - vx - u2x, w2y = s[10] - vy - u2y, w2z = s[11] - vz - u2z;
      const x1 = sqrt(w1x * w1x + w1y * w1y + w1z * w1z) / (N1 * N1), x2 = sqrt(w2x * w2x + w2y * w2y + w2z * w2z) / (N2 * N2);
      const q1 = N1 * sqrt(Math.max(0, 1 - x1 * x1)), q2 = N2 * sqrt(Math.max(0, 1 - x2 * x2));
      if (k === 1) { u1x *= q1; u1y *= q1; u1z *= q1; u2x *= q2; u2y *= q2; u2z *= q2; }
      else if (k === 2) { c1 = ((1 + a21) * a12 * q2 + a12 * -a21 * q1) / D; c2 = (a21 * a12 * q2 + (1 + a12) * -a21 * q1) / D;
        u1x = c1 * ex; u1y = c1 * ey; u1z = c1 * ez; u2x = c2 * ex; u2y = c2 * ey; u2z = c2 * ez; }
      else { const b12 = q1 * a12, b21 = q2 * a21, Dq = 1 + b12 + b21; c1 = ((1 + b21) * b12 + b12 * -b21) / Dq; c2 = (b21 * b12 + (1 + b12) * -b21) / Dq;
        u1x = c1 * ex; u1y = c1 * ey; u1z = c1 * ez; u2x = c2 * ex; u2y = c2 * ey; u2z = c2 * ez; }
    }
    o[0] = s[6] + u1x; o[1] = s[7] + u1y; o[2] = s[8] + u1z; o[3] = s[9] + u2x; o[4] = s[10] + u2y; o[5] = s[11] + u2z;
    o[6] = m2 * k3 * dx; o[7] = m2 * k3 * dy; o[8] = m2 * k3 * dz; o[9] = -m1 * k3 * dx; o[10] = -m1 * k3 * dy; o[11] = -m1 * k3 * dz;
  };
}
/** RK4(平らな配列・割り当てなし)の積分器: 戻り値 step(s, h) は s をその場で進める */
export function makeRK4(f, n) {
  const k1 = new Float64Array(n), k2 = new Float64Array(n), k3 = new Float64Array(n), k4 = new Float64Array(n), t = new Float64Array(n);
  return (s, h) => {
    f(s, k1); for (let j = 0; j < n; j++) t[j] = s[j] + 0.5 * h * k1[j];
    f(t, k2); for (let j = 0; j < n; j++) t[j] = s[j] + 0.5 * h * k2[j];
    f(t, k3); for (let j = 0; j < n; j++) t[j] = s[j] + h * k3[j];
    f(t, k4); for (let j = 0; j < n; j++) s[j] += h / 6 * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j]);
  };
}
const flat = (P, V) => Float64Array.from(P.flat().concat(V.flat()));

/* ───────── 量(ニュートンの E・角運動量・重心)───────── */
export function energyN(m, s) {
  const N = m.length, N3 = 3 * N; let K = 0, Up = 0;
  for (let i = 0; i < N; i++) { K += 0.5 * m[i] * (s[N3 + 3 * i] ** 2 + s[N3 + 3 * i + 1] ** 2 + s[N3 + 3 * i + 2] ** 2);
    for (let j = i + 1; j < N; j++) Up -= m[i] * m[j] / sqrt((s[3 * j] - s[3 * i]) ** 2 + (s[3 * j + 1] - s[3 * i + 1]) ** 2 + (s[3 * j + 2] - s[3 * i + 2]) ** 2); }
  return K + Up;
}
export function angmomN(m, s) {
  const N = m.length, N3 = 3 * N, L = [0, 0, 0];
  for (let i = 0; i < N; i++) { const x = s[3 * i], y = s[3 * i + 1], z = s[3 * i + 2], vx = s[N3 + 3 * i], vy = s[N3 + 3 * i + 1], vz = s[N3 + 3 * i + 2];
    L[0] += m[i] * (y * vz - z * vy); L[1] += m[i] * (z * vx - x * vz); L[2] += m[i] * (x * vy - y * vx); }
  return L;
}
const mass3 = (m, s, off) => { const o = [0, 0, 0]; for (let i = 0; i < m.length; i++) for (let c = 0; c < 3; c++) o[c] += m[i] * s[off + 3 * i + c]; return o; };
/** 2 体の帳簿 E_mod = E − m₁m₂ K/(2r²)(K = kK1 (m₁ + m₂))—— D0 で保たれる量(E はニュートンの K + U を状態の v で) */
export function emod2(m, s, kK1 = DECL.kK1) {
  const r2 = (s[3] - s[0]) ** 2 + (s[4] - s[1]) ** 2 + (s[5] - s[2]) ** 2, K = kK1 * (m[0] + m[1]);
  return energyN(m, s) - m[0] * m[1] * K / (2 * r2);
}

/* ───────── 3 体の系の初期の状態 ───────── */
/** 楕円の近点の状態(中心のまわり・傾き inc —— x 軸が交点の線) */
function kepPeri(mu, a, e, incDeg) {
  const rp = a * (1 - e), vp = sqrt(mu * (1 + e) / rp), i = incDeg * Math.PI / 180;
  return { p: [rp, 0, 0], v: [0, vp * Math.cos(i), vp * Math.sin(i)] };
}
export function systemOf3(key) {
  const S = DECL.systems[key];
  if (!S) throw new Error('systemOf3: 系が無い ' + key);
  const m = S.m.slice(), P = [[0, 0, 0], [0, 0, 0], [0, 0, 0]], V = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let inner;
  if (key === 'sem') {
    const o = kepPeri(m[0] + m[1] + m[2], S.outer.a, S.outer.e, 0), mi = kepPeri(m[1] + m[2], S.inner.a, S.inner.e, S.inner.incDeg), fE = m[2] / (m[1] + m[2]), fM = m[1] / (m[1] + m[2]);
    for (let c = 0; c < 3; c++) { P[1][c] = o.p[c] - fE * mi.p[c]; V[1][c] = o.v[c] - fE * mi.v[c]; P[2][c] = o.p[c] + fM * mi.p[c]; V[2][c] = o.v[c] + fM * mi.v[c]; }
    inner = { b: 2, c: 1, mu: m[1] + m[2], a: S.inner.a, e: S.inner.e };
  } else {
    const mi = kepPeri(m[0] + m[1], S.inner.a, S.inner.e, S.inner.incDeg), o = kepPeri(m[0] + m[2], S.outer.a, S.outer.e, 0);
    for (let c = 0; c < 3; c++) { P[1][c] = mi.p[c]; V[1][c] = mi.v[c]; P[2][c] = -o.p[c]; V[2][c] = -o.v[c]; }   // 木星の型は反対の側の近日点から
    inner = { b: 1, c: 0, mu: m[0] + m[1], a: S.inner.a, e: S.inner.e };
  }
  const M = m[0] + m[1] + m[2], C = [0, 1, 2].map((c) => (m[0] * P[0][c] + m[1] * P[1][c] + m[2] * P[2][c]) / M), Vc = [0, 1, 2].map((c) => (m[0] * V[0][c] + m[1] * V[1][c] + m[2] * V[2][c]) / M);
  const outerA = key === 'sem' ? S.outer.a : S.outer.a, outerMu = key === 'sem' ? M : m[0] + m[2];
  return { key, m, P: P.map((p) => p.map((x, c) => x - C[c])), V: V.map((v) => v.map((x, c) => x - Vc[c])), inner,
    Tin: 2 * Math.PI * sqrt(inner.a ** 3 / inner.mu), Tout: 2 * Math.PI * sqrt(outerA ** 3 / outerMu), aRef: outerA };
}
/** 内側の軌道の LRL のベクトル(離心率のベクトル)と角運動量の単位ベクトル(幾何の速度 dp/dt —— 移送を含む)。呼び手は近点の通過の時の角運動量の向きから交点の経度を作る */
function elemsOf(s, d, N3, inner) {
  const { b, c, mu } = inner;
  const r = [s[3 * b] - s[3 * c], s[3 * b + 1] - s[3 * c + 1], s[3 * b + 2] - s[3 * c + 2]], w = [d[3 * b] - d[3 * c], d[3 * b + 1] - d[3 * c + 1], d[3 * b + 2] - d[3 * c + 2]];
  const h = [r[1] * w[2] - r[2] * w[1], r[2] * w[0] - r[0] * w[2], r[0] * w[1] - r[1] * w[0]], rn = sqrt(r[0] ** 2 + r[1] ** 2 + r[2] ** 2);
  const wh = [w[1] * h[2] - w[2] * h[1], w[2] * h[0] - w[0] * h[2], w[0] * h[1] - w[1] * h[0]], e = [0, 1, 2].map((k) => wh[k] / mu - r[k] / rn);
  const hn = sqrt(h[0] ** 2 + h[1] ** 2 + h[2] ** 2);
  return { ev: e, hv: [h[0] / hn, h[1] / hn, h[2] / hn] };
}
const unwrapSeq = (a) => { const o = [a[0]]; for (let i = 1; i < a.length; i++) { let x = a[i]; while (x - o[i - 1] > Math.PI) x -= 2 * Math.PI; while (x - o[i - 1] < -Math.PI) x += 2 * Math.PI; o.push(x); } return o; };
const slopeOf = (t, y) => { const n = t.length, mt = t.reduce((a, b) => a + b, 0) / n, my = y.reduce((a, b) => a + b, 0) / n; let sxy = 0, sxx = 0; for (let i = 0; i < n; i++) { sxy += (t[i] - mt) * (y[i] - my); sxx += (t[i] - mt) ** 2; } return sxy / sxx; };

/* ───────── T1 3 体 ───────── */
/** 3 体を走らせ、内側の軌道の近点と交点の率(rad / 近点から近点までの 1 周)・重心の漂い・E と角運動量の残りを読む。mOverride で質量を差し替え(2 体の極限) */
export function runTriple(key, drag, { steps, orbitsOuter, mOverride = null } = {}) {
  const S0 = systemOf3(key), D = DECL.systems[key], m = mOverride || S0.m;
  const st = steps || D.steps[0], no = orbitsOuter || D.orbitsOuter, N3 = 9;
  const f = makeSys(drag, m), step = makeRK4(f, 18), s = flat(S0.P, S0.V), d = new Float64Array(18);
  const h = S0.Tin / st, nst = Math.round(no * S0.Tout / h), every = Math.max(1, Math.floor(st / D.sampleDiv));
  const E0 = energyN(m, s), L0 = angmomN(m, s), Ln0 = Math.hypot(...L0), MR0 = mass3(m, s, 0), P0 = mass3(m, s, N3), Mt = m.reduce((a, b) => a + b, 0);
  const vScale = m.reduce((a, x, i) => a + x * Math.hypot(S0.V[i][0], S0.V[i][1], S0.V[i][2]), 0);
  // 近点の通過(内側の相対の位置と幾何の速度の内積が − → +)を二分法で詰め、その時の近点の経度(ϖ = Ω + ω)と交点の経度 Ω を読む(第344便d の近点の数え方を 3 体へ)
  const { b: ib, c: ic } = S0.inner, sPrev = new Float64Array(18), sT = new Float64Array(18), dT = new Float64Array(18);
  const rvOf = (x, dx) => { let a = 0; for (let c = 0; c < 3; c++) a += (x[3 * ib + c] - x[3 * ic + c]) * (dx[3 * ib + c] - dx[3 * ic + c]); return a; };
  const tt = [], vp = [], nd = []; let dEmax = 0, dLmax = 0;
  f(s, d); let g0 = rvOf(s, d);
  for (let k = 0; k <= nst; k++) {
    if (k % every === 0) { dEmax = Math.max(dEmax, Math.abs(energyN(m, s) - E0) / Math.abs(E0)); const L = angmomN(m, s); dLmax = Math.max(dLmax, Math.hypot(L[0] - L0[0], L[1] - L0[1], L[2] - L0[2]) / Ln0); }
    if (k === nst) break;
    sPrev.set(s); step(s, h); f(s, d); const g1 = rvOf(s, d);
    if (g0 < 0 && g1 >= 0) {
      let lo = 0, hi = h;
      for (let j = 0; j < 50; j++) { const mid = 0.5 * (lo + hi); sT.set(sPrev); step(sT, mid); f(sT, dT); if (rvOf(sT, dT) < 0) lo = mid; else hi = mid; }
      const tm = 0.5 * (lo + hi); sT.set(sPrev); step(sT, tm); f(sT, dT);
      // 近点の経度 ϖ = Ω + ω(ω は軌道の面の中で交点の線から測る —— xy 面へ射影した角は傾き i で cos i 倍に縮むので使わない)
      const el = elemsOf(sT, dT, N3, S0.inner), hv = el.hv, r = [0, 1, 2].map((c) => sT[3 * ib + c] - sT[3 * ic + c]);
      const nn = Math.hypot(hv[0], hv[1]), n = [-hv[1] / nn, hv[0] / nn, 0], mv = [hv[1] * n[2] - hv[2] * n[1], hv[2] * n[0] - hv[0] * n[2], hv[0] * n[1] - hv[1] * n[0]];
      const Om = Math.atan2(n[1], n[0]), om = Math.atan2(r[0] * mv[0] + r[1] * mv[1] + r[2] * mv[2], r[0] * n[0] + r[1] * n[1] + r[2] * n[2]);
      tt.push(k * h + tm); vp.push(Om + om); nd.push(Om);
    }
    g0 = g1;
  }
  const T = nst * h, MR = mass3(m, s, 0), L = angmomN(m, s);
  const xp = Math.hypot(MR[0] - MR0[0] - P0[0] * T, MR[1] - MR0[1] - P0[1] * T, MR[2] - MR0[2] - P0[2] * T) / (vScale * S0.aRef);
  // 率は近点の通過ごと(近点から近点まで —— 第344便d と同じ「1 周」の取り方): 通過の番号に対する傾き
  const ix = vp.map((_, i) => i), wv = slopeOf(ix, unwrapSeq(vp)), wn = slopeOf(ix, unwrapSeq(nd)), tAnom = slopeOf(ix, tt);
  return { periRate: wv, nodeRate: wn, xp, dEmax, dEend: (energyN(m, s) - E0) / Math.abs(E0), dLmax, dLend: Math.hypot(L[0] - L0[0], L[1] - L0[1], L[2] - L0[2]) / Ln0,
    nInner: T / S0.Tin, nPeri: vp.length, anomOverKepler: tAnom / S0.Tin, nSteps: nst, Mt };
}
export function t1Rows() {
  const out = {};
  for (const key of Object.keys(DECL.systems)) {
    const D = DECL.systems[key], S0 = systemOf3(key), rows = [];
    for (const drag of ['none'].concat(DECL.drags)) {
      const a = runTriple(key, drag, { steps: D.steps[0] }), b = runTriple(key, drag, { steps: D.steps[1] });
      rows.push({ drag, periRate: b.periRate, nodeRate: b.nodeRate, periHalf: Math.abs(b.periRate - a.periRate), nodeHalf: Math.abs(b.nodeRate - a.nodeRate),
        xp: b.xp, dEmax: b.dEmax, dEend: b.dEend, dLmax: b.dLmax, dLend: b.dLend, nInner: b.nInner, coarse: { periRate: a.periRate, nodeRate: a.nodeRate, xp: a.xp, dLend: a.dLend } });
    }
    const at = (d) => rows.find((r) => r.drag === d);
    const diff = DECL.drags.slice(1).map((d) => ({ drag: d, dPeri: at(d).periRate - at('D0').periRate, dNode: at(d).nodeRate - at('D0').nodeRate,
      dPeriCoarse: at(d).coarse.periRate - at('D0').coarse.periRate, dNodeCoarse: at(d).coarse.nodeRate - at('D0').coarse.nodeRate }));
    const dragPart = { peri: at('D0').periRate - at('none').periRate, node: at('D0').nodeRate - at('none').nodeRate };
    out[key] = { name: D.name, note: D.note, Tin: S0.Tin, Tout: S0.Tout, rows, diff, dragPart };
  }
  // 2 体の極限: 水星の型で木星の型の質量を 0 に —— 引きずりの近点の分 ÷ 1PN(6πμ/(a(1 − e²)))を第344便d の試験粒子の近点(μ = 1e-4)と照合
  const S = DECL.systems.mj, mu = S.m[0], pn = 6 * Math.PI * mu / (S.inner.a * (1 - S.inner.e ** 2)), m0 = [S.m[0], S.m[1], 0];
  const lim = {};
  for (const drag of ['none', 'D0', 'D1']) lim[drag] = runTriple('mj', drag, { steps: S.steps[0], orbitsOuter: S.limitOuter, mOverride: m0 }).periRate;
  const ref = {}; for (const drag of ['D0', 'D1']) ref[drag] = apsidalDrag({ drag, grav: 'none', mu, e: S.inner.e }).overPN;
  out.limit = { mu, k1: k1Share(), d0OverPN: (lim.D0 - lim.none) / pn, d1OverPN: (lim.D1 - lim.none) / pn, ref344dD0: ref.D0, ref344dD1: ref.D1,
    d1MinusD0: (lim.D1 - lim.D0) / pn, ref344dD1MinusD0: ref.D1 - ref.D0, noneOverPN: lim.none / pn };
  return out;
}

/* ───────── T2 長い走り(2 体 —— 帳簿の残り)───────── */
/** 2 体を orbits 周まで走らせ、帳簿 E_mod の残りと E の残り(÷ |E₀|)を 10 倍ごとの窓で読む(窓ごとの最大・平均と、窓の中の傾き) */
export function runLong(drag, { steps, orbits }) {
  const S0 = systemOf('two'), m = S0.m, f = makePair2(drag, m), step = makeRK4(f, 12), s = flat(S0.p, S0.v);
  const Torb = 2 * Math.PI * sqrt(S0.a ** 3 / S0.M), h = Torb / steps, nst = Math.round(orbits * steps), ev = DECL.long.sampleEvery;
  const E0 = energyN(m, s), M0 = emod2(m, s), aE = Math.abs(E0);
  const dec = DECL.long.decades.filter((x) => x <= orbits), win = dec.map((hi, i) => ({ lo: i === 0 ? 0 : dec[i - 1], hi, n: 0, maxR: 0, sumR: 0, maxE: 0, st: 0, sx: 0, sy: 0, sxx: 0, sxy: 0 }));
  let wi = 0;
  for (let k = 1; k <= nst; k++) {
    step(s, h);
    if (k % ev === 0) {
      const tOrb = k / steps; while (wi < win.length - 1 && tOrb > win[wi].hi) wi++;
      const R = (emod2(m, s) - M0) / aE, dE = Math.abs(energyN(m, s) - E0) / aE, w = win[wi];
      w.n++; w.sumR += R; if (Math.abs(R) > w.maxR) w.maxR = Math.abs(R); if (dE > w.maxE) w.maxE = dE;
      w.sx += tOrb; w.sy += R; w.sxx += tOrb * tOrb; w.sxy += tOrb * R;
    }
  }
  const windows = win.map((w) => ({ lo: w.lo, hi: w.hi, n: w.n, maxR: w.maxR, meanR: w.sumR / w.n, maxE: w.maxE,
    slopeR: w.n > 2 ? (w.n * w.sxy - w.sx * w.sy) / (w.n * w.sxx - w.sx * w.sx) : 0 }));
  return { drag, steps, orbits, windows, endR: (emod2(m, s) - M0) / aE };
}
/** T2 の短い形(1e3 周 —— 第338便c の尺度の走り直しに入れる)と、長い形(1e4 周の全部の宣言・1e5 周の D0 と D1 —— 1 回だけ走らせる) */
export function t2Short() { const L = DECL.long, rows = []; for (const drag of DECL.drags) for (const st of L.steps) rows.push(runLong(drag, { steps: st, orbits: L.orbitsShort })); return { rows }; }
export function t2Long({ max = true } = {}) {
  const L = DECL.long, rows = [], longest = [];
  for (const drag of DECL.drags) for (const st of L.steps) rows.push(runLong(drag, { steps: st, orbits: L.orbitsAll }));
  if (max) for (const drag of L.maxDrags) for (const st of L.stepsMax) longest.push(runLong(drag, { steps: st, orbits: L.orbitsMax }));
  return { rows, longest };
}
/** T2 の読み: 最後の窓の傾き(1 周あたり)・宣言 − D0 の傾きの差・最初の 2 窓と最後の窓の残りの最大(有界かの読み) */
export function t2Summary(rows) {
  const at = (d, st, o) => rows.find((r) => r.drag === d && r.steps === st && r.orbits === o);
  return rows.map((r) => { const w = r.windows, last = w[w.length - 1], d0 = at('D0', r.steps, r.orbits), first = Math.max(w[0].maxR, w[1] ? w[1].maxR : 0);
    return { drag: r.drag, steps: r.steps, orbits: r.orbits, slopeLast: last.slopeR, dSlope: last.slopeR - d0.windows[d0.windows.length - 1].slopeR, maxRfirst: first, maxRlast: last.maxR, maxElast: last.maxE }; });
}

/* ───────── T3 換算 (α) と D0 の組(試験粒子・中心は固定)───────── */
/** 試験粒子の右辺(第344便d の testDeriv を、重力の換算と局所の重力の指数を引数にして本 lib に閉じて書いたもの —— n_G = 2 の (0)・(α) は第344便d の (i)・(iii) と同じ式) */
function testDeriv3(drag, kind, nG, mu) {
  return (s) => {
    const [x, y, vx, vy] = s, r = Math.hypot(x, y), psi = mu / r, beta = DECL.kK1 * mu / r;
    const f0 = -beta / (1 + beta), w = Math.hypot(vx, vy) * (1 - f0), xx = w * Math.exp(2 * psi), q = qOf('F', psi, xx);
    const aG = -mu / (r * r * r) * Math.exp(-2 * nG * psi) * (kind === 'alpha' ? q : 1);
    let ku = f0;
    if (drag === 'D1') ku = q * f0;
    else if (drag === 'D3') ku = -q * beta / (1 + q * beta);
    else if (drag === 'none') ku = 0;
    const c = 1 + ku;
    return [c * vx, c * vy, aG * x, aG * y];
  };
}
export function apsidal3({ drag, kind, nG, mu = DECL.orbit.mu, e = DECL.orbit.e, steps = DECL.orbit.steps[1], nOrb = DECL.orbit.nOrb }) {
  if (!(drag === 'none' || DECL.drags.includes(drag)) || !['0', 'alpha'].includes(kind) || ![1, 2].includes(nG)) throw new Error('apsidal3: 宣言が無い ' + drag + '/' + kind + '/' + nG);
  const f = testDeriv3(drag, kind, nG, mu);
  const P = 2 * Math.PI / Math.sqrt(mu), h = P / steps, rp = 1 - e;
  let s = [rp, 0, 0, Math.sqrt(mu * (1 + e) / rp)];
  const rv = (q) => q[0] * q[2] + q[1] * q[3];
  const unwrap = (q, ref) => { const ph = Math.atan2(q[1], q[0]); return ph + 2 * Math.PI * Math.round((ref - ph) / (2 * Math.PI)); };
  const peri = []; let phiPrev = 0, g0 = rv(s), k = 0;
  while (peri.length < nOrb + 1 && k < steps * (nOrb + 3)) {
    const s1 = rk4Step(f, s, h), g1 = rv(s1);
    if (g0 < 0 && g1 >= 0) {
      let lo = 0, hi = h;
      for (let j = 0; j < 60; j++) { const mid = 0.5 * (lo + hi), sm = rk4Step(f, s, mid); if (rv(sm) < 0) lo = mid; else hi = mid; }
      peri.push(unwrap(rk4Step(f, s, 0.5 * (lo + hi)), phiPrev));
    }
    phiPrev = unwrap(s1, phiPrev); s = s1; g0 = g1; k++;
  }
  const d = []; for (let i = 1; i < peri.length; i++) d.push(peri[i] - peri[i - 1] - 2 * Math.PI);
  return { overPN: d.reduce((a, b) => a + b, 0) / d.length / (6 * Math.PI * mu / (1 - e * e)), nPeri: peri.length };
}
/** 見込み(一次): 重力 −(2 n_G + ℓ + s)/6(現行 ℓ + s = 0・(α) = 2)+ K1 の +5/3 */
export const expect3 = (kind, nG, drag) => -(2 * nG + (kind === 'alpha' ? 2 : 0)) / 6 + (drag === 'none' ? 0 : k1Share());
export function t3Rows() {
  const pn = mercury1PN(), [s1, s2] = DECL.orbit.steps, rows = [];
  for (const g of DECL.gravs) for (const drag of ['none', 'D0', 'D1']) {
    const fine = apsidal3({ drag, kind: g.kind, nG: g.nG, steps: s2 }).overPN, coarse = apsidal3({ drag, kind: g.kind, nG: g.nG, steps: s1 }).overPN, ex = expect3(g.kind, g.nG, drag);
    rows.push({ grav: g.key, drag, overPN: fine, halfDiff: Math.abs(fine - coarse), expect: ex, dExpect: fine - ex, arcsecCy: fine * pn.arcsecCy });
  }
  // 二次の読み: (α)(指数 1)−(0)(指数 2)を、引きずり D0 あり・なしで(差 ÷ μ)。交差 = 両者の差(換算と D0 の組で出る項)。D1 − D0 を (α) と (0) で
  const slope = DECL.muSlope.map((mu) => {
    const v = (drag, gi) => apsidal3({ drag, kind: DECL.gravs[gi].kind, nG: DECL.gravs[gi].nG, mu }).overPN;
    const c0 = v('D0', 0), a0 = v('D0', 1), cn = v('none', 0), an = v('none', 1), c1 = v('D1', 0), a1 = v('D1', 1);
    return { mu, alphaMinusCurD0: (a0 - c0) / mu, alphaMinusCurNone: (an - cn) / mu, cross: ((a0 - c0) - (an - cn)) / mu, d1MinusD0Cur: (c1 - c0) / mu, d1MinusD0Alpha: (a1 - a0) / mu };
  });
  const muMerc = DECL.mercuryGMoverA.GM / (DECL.c * DECL.c * DECL.mercuryGMoverA.a), s0 = slope[0];
  const mercury = { muMerc, alphaMinusCurD0: s0.alphaMinusCurD0 * muMerc * pn.arcsecCy, cross: s0.cross * muMerc * pn.arcsecCy, d1MinusD0Alpha: s0.d1MinusD0Alpha * muMerc * pn.arcsecCy };
  // 第344便d の試験粒子の近点との照合(n_G = 2 の (0)・(α) は第344便d の (i)・(iii) と同じ式 —— 同じ数になること)
  const ref = [['D0', '0', 'i'], ['D1', 'alpha', 'iii']].map(([drag, kind, grav]) => Math.abs(apsidal3({ drag, kind, nG: 2 }).overPN - apsidalDrag({ drag, grav, type: 'F' }).overPN));
  return { pn: { arcsecCy: pn.arcsecCy }, rows, slope, mercury, ref344dMax: Math.max(...ref) };
}

/* ───────── 純関数の場面 ───────── */
export function pureScenes() {
  const rel = (a, b) => Math.abs(a - b) / Math.max(1e-300, Math.abs(b));
  // ① 多体の移送(N = 2)が第344便d の pairDrift と同じ(宣言 4 つ)・N = 3 で 3 つ目の質量 0 のとき 1・2 番が 2 体と同じ
  const m2 = [0.01, 0.005], P = [[-0.002, 0.001, 0], [0.7, 0.1, 0.02]], V = [[0.01, -0.02, 0.001], [-0.03, 0.08, 0.004]];
  let pairMax = 0, zeroMax = 0;
  for (const drag of DECL.drags) {
    const ref = pairDrift(drag, m2, P, V), f2 = makeSys(drag, m2), o2 = new Float64Array(12); f2(flat(P, V), o2);
    const f3 = makeSys(drag, [m2[0], m2[1], 0]), o3 = new Float64Array(18); f3(flat(P.concat([[3, -2, 1]]), V.concat([[0.05, 0.01, 0]])), o3);
    for (let i = 0; i < 2; i++) for (let c = 0; c < 3; c++) { const r = ref.drift[i][c] - V[i][c];
      pairMax = Math.max(pairMax, Math.abs(o2[3 * i + c] - ref.drift[i][c]) / Math.abs(r)); zeroMax = Math.max(zeroMax, Math.abs(o3[3 * i + c] - ref.drift[i][c]) / Math.abs(r)); }
  }
  // ①′ 2 体の速い右辺(T2)が makeSys の N = 2 の道と同じ(宣言 4 つ・相対)
  let fastMax = 0;
  for (const drag of DECL.drags) { const a = new Float64Array(12), b = new Float64Array(12), st = flat(P, V); makeSys(drag, m2)(st, a); makePair2(drag, m2)(st, b);
    for (let k = 0; k < 12; k++) fastMax = Math.max(fastMax, Math.abs(a[k] - b[k]) / Math.max(Math.abs(a[k]), 1e-300)); }
  // ② D0 の 3 体で Σ m U = 0(重みの対称 a_ij m_i = a_ji m_j —— 相対)・D1 では 0 でない
  const m3 = [0.01, 0.003, 0.002], P3 = [[0, 0, 0], [1, 0, 0], [-0.6, 1.1, 0.1]], V3 = [[0, 0, 0], [0, 0.1, 0.004], [-0.08, -0.044, 0]];
  const momOf = (drag) => { const f = makeSys(drag, m3), o = new Float64Array(18); f(flat(P3, V3), o); let s = [0, 0, 0], a = 0;
    for (let i = 0; i < 3; i++) for (let c = 0; c < 3; c++) { s[c] += m3[i] * f.U[3 * i + c]; a += m3[i] * Math.abs(f.U[3 * i + c]); } return Math.hypot(...s) / a; };
  const momD0 = momOf('D0'), momD1 = momOf('D1');
  // ②′ D0 の 3 体で Σ m u × v = 0(M(I + L)⁻¹L が対称 —— 角運動量 Σ m p × v の時間微分 Σ m U × v が消える)・D1 では 0 でない
  const angOf = (drag) => { const f = makeSys(drag, m3), o = new Float64Array(18), s3 = flat(P3, V3); f(s3, o); const c = [0, 0, 0]; let a = 0;
    for (let i = 0; i < 3; i++) { const U = [f.U[3 * i], f.U[3 * i + 1], f.U[3 * i + 2]], v = [s3[9 + 3 * i], s3[10 + 3 * i], s3[11 + 3 * i]];
      const x = [U[1] * v[2] - U[2] * v[1], U[2] * v[0] - U[0] * v[2], U[0] * v[1] - U[1] * v[0]]; for (let k = 0; k < 3; k++) c[k] += m3[i] * x[k]; a += m3[i] * Math.hypot(...U) * Math.hypot(...v); }
    return Math.hypot(...c) / a; };
  const angD0 = angOf('D0'), angD1 = angOf('D1');
  // ③ 2 体の帳簿: dE_mod/dt を右辺から作り、D0 で 0(相対 —— 項ごとの大きさに対して)・D1 で 0 でない
  const S2 = systemOf('two'), s2 = flat(S2.p, S2.v); s2[9] += 0.02; s2[10] += 0.03;   // 動径の速さを持つ状態に
  const emodRate = (drag) => { const f = makeSys(drag, S2.m), o = new Float64Array(12); f(s2, o); const m = S2.m, K = DECL.kK1 * (m[0] + m[1]);
    const d = [s2[3] - s2[0], s2[4] - s2[1], s2[5] - s2[2]], r = Math.hypot(...d), w = [o[3] - o[0], o[4] - o[1], o[5] - o[2]], rdot = (d[0] * w[0] + d[1] * w[1] + d[2] * w[2]) / r;
    const dK = m[0] * (s2[6] * o[6] + s2[7] * o[7] + s2[8] * o[8]) + m[1] * (s2[9] * o[9] + s2[10] * o[10] + s2[11] * o[11]), dU = m[0] * m[1] / (r * r) * rdot, dPhi = m[0] * m[1] * K / (r * r * r) * rdot;
    return { rate: dK + dU + dPhi, scale: Math.abs(dK) + Math.abs(dU) + Math.abs(dPhi) }; };
  const e0 = emodRate('D0'), e1 = emodRate('D1');
  // ④ 本 lib の試験粒子の近点(n_G = 2)が第344便d の近点と同じ数(1 周 3000 刻み —— 短い形)
  const ap = Math.max(...[['D0', '0', 'i'], ['D3', 'alpha', 'iii'], ['none', '0', 'i']].map(([drag, kind, grav]) => Math.abs(apsidal3({ drag, kind, nG: 2, steps: 3000 }).overPN - apsidalDrag({ drag, grav, type: 'F', steps: 3000 }).overPN)));
  // ⑤ 拒否: 宣言が無い・質量が負・換算の型が無い・系が無い
  let rej = 0; try { makeSys('DC', m2); } catch (e) { rej++; } try { makeSys('D0', [1, -1]); } catch (e) { rej++; } try { apsidal3({ drag: 'D0', kind: 'beta', nG: 1 }); } catch (e) { rej++; } try { systemOf3('pluto'); } catch (e) { rej++; }
  return { pairMax, zeroMax, fastMax, momD0, momD1, angD0, angD1, emodD0: Math.abs(e0.rate) / e0.scale, emodD1: Math.abs(e1.rate) / e1.scale, apsidal344d: ap, reject: { n: rej, of: 4 }, q0: Math.abs(qOf('F', 0, 0) - 1) < 1e-15 && rel(1, 1) === 0 };   // 丸めの 1 bit を許す(尺度の走り直しで exp がずれる)
}
export function pureGates(S) {
  return { pair: S.pairMax < 1e-12 && S.zeroMax < 1e-12 && S.fastMax < 1e-12, momD0: S.momD0 < 1e-14 && S.momD1 > 1e-6, angD0: S.angD0 < 1e-14 && S.angD1 > 1e-6, emod: S.emodD0 < 1e-14 && S.emodD1 > 1e-6, apsidal: S.apsidal344d < 1e-9, reject: S.reject.n === S.reject.of, q0: S.q0 === true };
}
