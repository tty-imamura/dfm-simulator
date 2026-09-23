// 第278便b(統括の検証項目 R54)— 相対すべりの引きずり則(`pairSlip`)の**陰的中点法**を純関数で書いたもの。
//
// ■ 何をするか
//   `beta/index.html` の `relativeDragMidpointSolve`/`dfmRelativeDragMidpointStep` と**同じ式**を
//   ブラウザ無しで回す(器と QA がエンジンと突き合わせる)。陽的経路の純関数は
//   `tests/lib-w277b-charondfm.mjs` の `pairSlipStep` をそのまま使う(式は変えていない)。
//
// ■ 式(位置固定の散逸ステップ・すべりを中点値 s̄=(s_old+s_new)/2 で評価する)
//   J⃗ = A s̄_i + B s̄_j、 Δ(I_iω_i)=(r×A s̄_i)_z、 Δ(I_jω_j)=(r×B s̄_j)_z、 Δv_rel = −J⃗/μ
//   r̂・t̂=ẑ×r̂ に分けると 動径は 1 分母・接線は 2×2 連立:
//     a=A/2μ・b=B/2μ・c=A r²/2I_i・d=B r²/2I_j
//     i_r=A v_r/(1+a+b)、 j_r=B v_r/(1+a+b)
//     det=1+a+b+c+d+ad+bc+cd、 i_t=(A s_t,i(1+b+d)−aB s_t,j)/det、 j_t=(B s_t,j(1+a+c)−bA s_t,i)/det
//   ⇒ ΔE = −A|s̄_i|² − B|s̄_j|² ≤ 0(厳密)。P と J_z は作用反作用と軌道→自転の戻しで閉じる。
//
// ■ 限定(エンジンと同じ): 単一対・正の質量/半径/慣性・有限・分離した対。それ以外は**状態を変えずに**
//   RangeError を投げる。
export const MIDPOINT_LIB_VERSION = 'w278b-midpoint-1';

/** 中点法の 1 対の解(状態を持たない)。html の `relativeDragMidpointSolve` と同じ式・同じ演算順。 */
export function midpointSolve(A, B, mu, Ii, Ij, rx, ry, vx, vy, wi, wj) {
  const r2 = rx * rx + ry * ry, r = Math.sqrt(r2);
  const ex = rx / r, ey = ry / r, tx = -ey, ty = ex;
  const vr = vx * ex + vy * ey, vt = vx * tx + vy * ty;
  const sit = vt - wi * r, sjt = vt - wj * r;
  const a = A / (2 * mu), b = B / (2 * mu), c = A * r2 / (2 * Ii), d = B * r2 / (2 * Ij);
  const den = 1 + a + b, det = 1 + a + b + c + d + a * d + b * c + c * d;
  const ir = A * vr / den, jr = B * vr / den;
  const it = (A * sit * (1 + b + d) - a * B * sjt) / det;
  const jt = (B * sjt * (1 + a + c) - b * A * sit) / det;
  const jx = (ir + jr) * ex + (it + jt) * tx, jy = (ir + jr) * ey + (it + jt) * ty;
  const ti = r * it, tj = r * jt;
  const e = -(jx * vx + jy * vy) + (jx * jx + jy * jy) / (2 * mu) + ti * wi + ti * ti / (2 * Ii) + tj * wj + tj * tj / (2 * Ij);
  const sbI = (A > 0) ? Math.hypot(ir, it) / A : 0, sbJ = (B > 0) ? Math.hypot(jr, jt) / B : 0;
  return { jx, jy, ti, tj, dE: e, dEform: -(A * sbI * sbI + B * sbJ * sbJ), sbarI: sbI, sbarJ: sbJ,
    slipI: Math.hypot(vr, sit), slipJ: Math.hypot(vr, sjt), det };
}

/** 適格性(拒否理由か null)。エンジンの `relativeDragMidpointGuard` と同じ条件。 */
export function midpointGuard(st, pairs) {
  if (pairs.length !== 1) return 'single pair only (' + pairs.length + ')';
  const i = pairs[0][0], j = pairs[0][1];
  const mi = st.m[i], mj = st.m[j], Ri = st.R[i], Rj = st.R[j];
  if (!(mi > 0) || !(mj > 0) || !Number.isFinite(mi) || !Number.isFinite(mj)) return 'positive finite masses only';
  if (!(Ri > 0) || !(Rj > 0) || !Number.isFinite(Ri) || !Number.isFinite(Rj)) return 'positive radii (positive inertia) only';
  const rx = st.x[j] - st.x[i], ry = st.y[j] - st.y[i];
  if (!(rx * rx + ry * ry > 0) || !Number.isFinite(rx) || !Number.isFinite(ry)) return 'separated pair only';
  if (!Number.isFinite(st.vx[i] + st.vy[i] + st.vx[j] + st.vy[j] + st.spin[i] + st.spin[j])) return 'finite velocities/spins only';
  return null;
}

/** 中点法の 1 步(状態は破壊的に書き換える)。拒否は RangeError(状態不変)。 */
export function pairSlipMidpointStep(st, o) {
  const s = o || {};
  const G = s.G === undefined ? 6.674 : s.G, eps = s.eps || 0, eps2 = eps * eps;
  const kap = s.kappa === undefined ? 1 : s.kappa, W0 = s.W0 || 0, dt = s.dt;
  const n = st.m.length;
  const pairs = s.pairs || (() => { const o2 = []; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) o2.push([i, j]); return o2; })();
  const why = midpointGuard(st, pairs);
  if (why) throw new RangeError(why);
  const i = pairs[0][0], j = pairs[0][1];
  const mi = st.m[i], mj = st.m[j];
  const rx = st.x[j] - st.x[i], ry = st.y[j] - st.y[i], d2 = rx * rx + ry * ry + eps2;
  const vx = st.vx[j] - st.vx[i], vy = st.vy[j] - st.vy[i];
  const wi = st.spin[i], wj = st.spin[j];
  const chiIJ = mj / (mj + W0 * d2), chiJI = mi / (mi + W0 * d2);
  const mu = mi * mj / (mi + mj);
  const nu = Math.sqrt(G * (mi + mj) / (d2 * Math.sqrt(d2)));
  const A = kap * chiIJ * mu * nu * dt, B = kap * chiJI * mu * nu * dt;
  const Ii = 0.5 * mi * st.R[i] * st.R[i], Ij = 0.5 * mj * st.R[j] * st.R[j];
  const q = midpointSolve(A, B, mu, Ii, Ij, rx, ry, vx, vy, wi, wj);
  st.vx[i] += q.jx / mi; st.vy[i] += q.jy / mi;
  st.vx[j] -= q.jx / mj; st.vy[j] -= q.jy / mj;
  st.spin[i] = wi + q.ti / Ii; st.spin[j] = wj + q.tj / Ij;
  return { n: 1, dE: q.dE, heat: -q.dE, dEform: q.dEform, kickMax: Math.hypot(q.jx, q.jy),
    torqueMax: Math.max(Math.abs(q.ti), Math.abs(q.tj)), slipMax: Math.max(q.slipI, q.slipJ), resL: 0, A, B };
}

/**
 * 無次元の最小対照(統括が指定した条件): G=1・m 0.5/0.5・間隔 1・接線相対速度 1・ω=0・R・κ=1・W₀=ε=0。
 * 重心系・相対位置は +x・相対速度は +y。
 */
export function minimalPair(o) {
  const s = o || {};
  const R = s.R === undefined ? 0.01 : s.R, vt = s.vt === undefined ? 1 : s.vt;
  return { m: [0.5, 0.5], x: [-0.5, 0.5], y: [0, 0], vx: [0, 0], vy: [-vt / 2, vt / 2],
    spin: [s.w1 || 0, s.w2 || 0], R: [R, R] };
}

export default { MIDPOINT_LIB_VERSION, midpointSolve, midpointGuard, pairSlipMidpointStep, minimalPair };
