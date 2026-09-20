// 第275便d(第65報 (4)(5)(6)の次段): **動的中心の診断**(純関数・node だけ・**エンジン未接続**)。
//
// 形状トイ `physics.shapeToy` の中心天体版は `center:"pinned"` の**位置固定の参照点**である。
// 「では中心を自由にしたら何が起きるか」を**エンジンに触らずに**測るための、独立した最小模型が
// ここである。**この模型は beta/index.html に 1 行も入っていない**(宣言鍵 `center:"dynamic"` は
// 設計だけで、実装していない)。
//
// **模型(宣言)**:
//   ・中心天体 1 個(質量 M・位置 X・速度 V)と粒子 N 個(質量 m・位置 x_i・速度 v_i)。
//   ・中心⇄粒子の対ポテンシャル **U_pair = −G M m /√(s²+r_c²)**(s=|x_i−X|・r_c は**構造長の宣言**)。
//     中心で調和・遠方で 1/s になる形で、**新しい力ではない**(E1′/E4 の軟化形と同じ)。
//   ・保持項 **U_h = ½ m κ_h s²**(`harmonicFrame:"centre"`)または ½ m κ_h |x_i|²(`"origin"`)。
//     前者は**内部項**なので全運動量が保存し、後者は**外力**なので保存しない —— 負の対照である。
//   ・**粒子同士は引き合わない**(この模型は「中心が動くか」だけを見るためのもの。宣言)。
//
// **測るもの**(合否は宣言しない —— 数を返すだけ):
//   ・重心のドリフト |R_com(t)−R_com(0)| と全運動量 |P|(内部項だけなら丸めの範囲で 0)。
//   ・ビリアル比 **2K/|W|**(軟化ポテンシャルなので厳密な 2K=|W| ではない —— 宣言)。
//   ・RMS 半径(中心天体からの距離)の時間列と、中心天体自身の最大変位。
//   ・全エネルギーの相対ドリフト(**積分器の質**であって物理の結論ではない)。

/** 決定論的な擬似乱数(mulberry32 —— エンジンと同じ系列の作り方)。 */
export function mulberry32(a) {
  let t = a >>> 0;
  return function () {
    t = (t + 0x6D2B79F5) >>> 0;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

/** 標準正規(Box–Muller の極座標版・余りを控えない素朴版)。 */
export function gauss(rng) {
  let u = 0, v = 0, s = 0;
  do { u = 2 * rng() - 1; v = 2 * rng() - 1; s = u * u + v * v; } while (!(s > 0 && s < 1));
  return u * Math.sqrt(-2 * Math.log(s) / s);
}

/** 中心天体のポテンシャル(1 粒子あたり・質量で割っていない)。 */
export function phiCore(s, G, M, rc, kh) {
  return -G * M / Math.sqrt(s * s + rc * rc) + 0.5 * kh * s * s;
}

/** 中心向きの加速度の大きさ(粒子 1 個あたり。s>0)。 */
export function accCore(s, G, M, rc, kh) {
  return G * M * s / Math.pow(s * s + rc * rc, 1.5) + kh * s;
}

/** 実ポテンシャルの円速度 v_c(s)=√(s·a_r(s))。**宣言速度ではなく、置いた場からの導出値**である。 */
export function vCirc(s, G, M, rc, kh) {
  const a = accCore(s, G, M, rc, kh);
  return (a > 0) ? Math.sqrt(s * a) : 0;
}

/**
 * 系を作る。粒子は面内 2D 正規分布(各軸 σ)から撒き、速度は**その位置での実ポテンシャルの
 * 円速度**に取る(反時計回り)。中心天体は原点・静止から始める。
 * `balance:true` なら全運動量が厳密に 0 になるよう中心天体の速度を決める(重心系)。
 */
export function makeSystem(o) {
  const { n, sigma, G, M, m, rc, kh, seed, balance } = o;
  const rng = mulberry32(seed >>> 0);
  const x = new Float64Array(n), y = new Float64Array(n);
  const vx = new Float64Array(n), vy = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    let px = 0, py = 0, s = 0;
    do { px = sigma * gauss(rng); py = sigma * gauss(rng); s = Math.hypot(px, py); }
    while (!(s > 1e-9));
    x[i] = px; y[i] = py;
    const v = vCirc(s, G, M, rc, kh);
    vx[i] = -v * py / s; vy[i] = v * px / s;
  }
  let Px = 0, Py = 0;
  for (let i = 0; i < n; i++) { Px += m * vx[i]; Py += m * vy[i]; }
  const S = { n, m, M, G, rc, kh, X: 0, Y: 0, VX: 0, VY: 0, x, y, vx, vy, t: 0,
    harmonicFrame: o.harmonicFrame || 'centre', frozen: !!o.frozen };
  // **位置固定の対照は本当に動かさない**(速度も 0 にする —— 速度だけ残すと等速で流れてしまう)
  if (balance && !S.frozen) { S.VX = -Px / M; S.VY = -Py / M; }
  return S;
}

/** 加速度を書き込む(`ax`,`ay` は粒子・戻り値は中心天体の加速度)。 */
export function accelerations(S, ax, ay) {
  const { n, m, M, G, rc, kh } = S;
  let AX = 0, AY = 0;
  const origin = (S.harmonicFrame === 'origin');
  for (let i = 0; i < n; i++) {
    const dx = S.x[i] - S.X, dy = S.y[i] - S.Y;
    const s2 = dx * dx + dy * dy, inv = 1 / Math.pow(s2 + rc * rc, 1.5);
    const f = G * M * inv;                    // 中心 → 粒子(大きさ/距離)
    let axi = -f * dx, ayi = -f * dy;
    if (origin) { axi -= kh * S.x[i]; ayi -= kh * S.y[i]; }   // **外力**(運動量は保存しない)
    else { axi -= kh * dx; ayi -= kh * dy; }                  // **内部項**(反作用を中心へ返す)
    ax[i] = axi; ay[i] = ayi;
    // 反作用(中心天体が受ける)。外力の保持項は中心へ返さない —— それが「外力」の意味である
    AX += (m / M) * (f * dx + (origin ? 0 : kh * dx));
    AY += (m / M) * (f * dy + (origin ? 0 : kh * dy));
  }
  if (S.frozen) { AX = 0; AY = 0; }            // **位置固定の対照**(pinned と同じ扱い)
  return [AX, AY];
}

/** 速度 Verlet の 1 步(加速度バッファは呼び出し側が持つ)。 */
export function stepVerlet(S, dt, buf) {
  const { ax, ay } = buf;
  if (!buf.init) { const A = accelerations(S, ax, ay); buf.AX = A[0]; buf.AY = A[1]; buf.init = true; }
  const n = S.n, h = 0.5 * dt;
  for (let i = 0; i < n; i++) {
    S.vx[i] += h * ax[i]; S.vy[i] += h * ay[i];
    S.x[i] += dt * S.vx[i]; S.y[i] += dt * S.vy[i];
  }
  if (!S.frozen) { S.VX += h * buf.AX; S.VY += h * buf.AY; S.X += dt * S.VX; S.Y += dt * S.VY; }
  const A = accelerations(S, ax, ay);
  buf.AX = A[0]; buf.AY = A[1];
  for (let i = 0; i < n; i++) { S.vx[i] += h * ax[i]; S.vy[i] += h * ay[i]; }
  if (!S.frozen) { S.VX += h * buf.AX; S.VY += h * buf.AY; }
  S.t += dt;
  return S;
}

/** 診断(合否は言わない —— 数だけ)。 */
export function diagnose(S) {
  const { n, m, M, G, rc, kh } = S;
  const origin = (S.harmonicFrame === 'origin');
  let K = 0.5 * M * (S.VX * S.VX + S.VY * S.VY), W = 0, Wh = 0, s2 = 0;
  let px = M * S.VX, py = M * S.VY, cx = M * S.X, cy = M * S.Y, mtot = M;
  let smax = 0;
  for (let i = 0; i < n; i++) {
    K += 0.5 * m * (S.vx[i] * S.vx[i] + S.vy[i] * S.vy[i]);
    const dx = S.x[i] - S.X, dy = S.y[i] - S.Y, s = Math.hypot(dx, dy);
    W += -G * M * m / Math.sqrt(s * s + rc * rc);
    Wh += 0.5 * m * kh * (origin ? (S.x[i] * S.x[i] + S.y[i] * S.y[i]) : (s * s));
    s2 += s * s; if (s > smax) smax = s;
    px += m * S.vx[i]; py += m * S.vy[i];
    cx += m * S.x[i]; cy += m * S.y[i]; mtot += m;
  }
  const U = W + Wh;
  return { t: S.t, K, Wpair: W, Wharm: Wh, U, E: K + U,
    virial: Math.abs(W) > 0 ? 2 * K / Math.abs(W) : null,
    rms: Math.sqrt(s2 / n), smax,
    P: Math.hypot(px, py), com: [cx / mtot, cy / mtot],
    centre: [S.X, S.Y], centreSpeed: Math.hypot(S.VX, S.VY) };
}
