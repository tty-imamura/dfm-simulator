// 第277便d(原仮定者の裁定〔第67報〕(3))— **慣性移動の仮定の純関数**(エンジン未接続)。
//
// ■ 裁定の字義(仮説として置く)
//   「**DFM では『慣性移動は、複素決定力による、自分自身に対するゼロ距離の座標変換』と仮定する。**」
//
// ■ 何を置くか(統括の読み R51 の含意をそのまま関数にした)
//   (1) **自己場の値 m/0 を数値計算しない。** 自己項の「値」ではなく、その**有限な極限**だけを使う:
//         u_self,i = lim_{ρ→0⁺} w_ii(ρ)·v_i / w_ii(ρ) = v_i        (w_ii は約分で消える)
//       これを**正則化した自己並進写像** `selfDrift(x,v,Δt) = x + vΔt` として扱う。
//   (2) **既存の vΔt にさらに足して 2 倍にしない。** 位置更新はもともと x += vΔt なので、
//       この仮説は**新しい項ではなく、既にある位置更新の読み替え**である(`doubleCountControl` が
//       「もう 1 回足す」誤りを数で出す)。
//   (3) **自己項を他天体の重み付き平均の分母へ無限大として入れない。**
//       入れると χ_ext = W_ext/(w_ii+W_ext) → 0 で、**他天体の寄与が全部ゼロになる**
//       (`selfInDenominatorControl` が ρ→0 の列で数を出す —— **否定対照**である)。
//   (4) **「自己慣性を担う対角項」と「外部源との相対変換を担う非対角項」を分ける**
//       (`splitDiagonalOffdiagonal`)。非対角項は現行エンジンと同じ**自己除外の和**である。
//   (5) **公理だけでは質量・運動量則は導出されない。** L=½m|v−u_self|² に u_self=v を入れると
//       運動エネルギーが恒等的に 0 になる(`lagrangianDegeneracy` —— **否定対照**)。
//
// ■ しないこと
//   ・エンジン(`beta/index.html`)へ接続しない。`S._core` には 1 命令も足していない。
//   ・「慣性を導出した」「運動量則を導出した」とは書かない —— 置いたのは**仮説と、その否定対照**である。
//   ・背景複素場 W₀ と混ぜない(自己項は**背景とは独立に**記帳する)。
export const SELFINERTIA_VERSION = 'w277d-selfinertia-1';

/* ────────────────────────────────────────────────────────────────────────────
   (1) 正則化した自己並進写像
   ──────────────────────────────────────────────────────────────────────────── */

/**
 * **自己項の有限な極限**。w_ii(ρ)=m/ρ^p は ρ→0⁺ で発散するが、
 * u_self = w_ii·v/w_ii は **w_ii に依らず v** である(約分して消える)。
 * **m/0 を 1 度も数値計算しない**ので、この関数は ρ を引数に取らない。
 * @param {number[]} v 速度 [vx,vy]
 * @returns {number[]|null}
 */
export function selfVelocityLimit(v) {
  if (!Array.isArray(v) || v.length !== 2) return null;
  const a = Number(v[0]), b = Number(v[1]);
  if (!(Number.isFinite(a) && Number.isFinite(b))) return null;
  return [a, b];
}

/**
 * **自己並進写像** `selfDrift(x,v,Δt) = x + vΔt`(= 自分自身に対するゼロ距離の座標変換)。
 * **既存の位置更新と同じ写像**であって、足し増す新しい項ではない。
 * @returns {number[]|null}
 */
export function selfDrift(x, v, dt) {
  if (!Array.isArray(x) || x.length !== 2) return null;
  const u = selfVelocityLimit(v);
  if (!u) return null;
  const x0 = Number(x[0]), x1 = Number(x[1]), h = Number(dt);
  if (!(Number.isFinite(x0) && Number.isFinite(x1) && Number.isFinite(h))) return null;
  return [x0 + u[0] * h, x1 + u[1] * h];
}

/**
 * **w_ii の正則化列**。ρ を小さくしても `selfVelocityLimit` の値が動かないことを示す列。
 * **w_ii そのものは表示のためだけに出す**(力にも位置更新にも使わない)。
 */
export function selfTermRegularization(m, v, opts) {
  const o = opts || {};
  const p = (o.p === undefined) ? 2 : Number(o.p);
  const rhos = Array.isArray(o.rhos) ? o.rhos.map(Number) : [1e-1, 1e-3, 1e-6, 1e-9, 1e-12];
  const u = selfVelocityLimit(v);
  if (!u || !(Number(m) > 0) || !Number.isFinite(p)) return null;
  const rows = rhos.map((rho) => {
    const w = Number(m) / Math.pow(rho, p);
    const ux = (w * u[0]) / w, uy = (w * u[1]) / w;   // **約分**(発散は分子と分母で同じ)
    return { rho, wSelf: w, uSelf: [ux, uy],
      errAbs: Math.max(Math.abs(ux - u[0]), Math.abs(uy - u[1])) };
  });
  return { p, limit: u, rows,
    maxErr: rows.reduce((z, r) => Math.max(z, r.errAbs), 0),
    computedMOverZero: false };
}

/* ────────────────────────────────────────────────────────────────────────────
   (4) 対角(自己慣性) / 非対角(外部源との相対変換)の分離
   ──────────────────────────────────────────────────────────────────────────── */

/**
 * 源 i について **対角項(自己慣性)と非対角項(外部源)を分けて返す**。
 * 非対角は現行エンジンと同じ **自己除外の重み付き平均**:
 *   W_ext = Σ_{j≠i} w_j ・ A_ext = Σ_{j≠i} w_j u_j ・ u_ext = A_ext/W_ext
 *   w_j = m_j·(r_ij²+ε²)^(−p/2) ・ u_j = v_j + ω_j ẑ×(x_i−x_j)
 * 対角は `selfVelocityLimit`(= v_i)で、**W_ext の分母には入れない**。
 * @param {Array} sources `{m,x,y,vx,vy,omega}` の配列
 * @param {number} i 対象の添字
 * @param {object} [opts] `{p=2, eps=0}`
 */
export function splitDiagonalOffdiagonal(sources, i, opts) {
  const o = opts || {};
  const p = (o.p === undefined) ? 2 : Number(o.p);
  const eps = (o.eps === undefined) ? 0 : Number(o.eps);
  if (!Array.isArray(sources) || !Number.isInteger(i) || i < 0 || i >= sources.length) return null;
  if (!(Number.isFinite(p) && p >= 0 && Number.isFinite(eps) && eps >= 0)) return null;
  const self = sources[i];
  if (!self) return null;
  const uSelf = selfVelocityLimit([self.vx === undefined ? 0 : self.vx,
    self.vy === undefined ? 0 : self.vy]);
  if (!uSelf) return null;
  const px = Number(self.x), py = Number(self.y);
  if (!(Number.isFinite(px) && Number.isFinite(py))) return null;
  const e2 = eps * eps, pHalfNeg = -p / 2, pZero = (p === 0);
  let W = 0, Ax = 0, Ay = 0, nIn = 0;
  for (let j = 0; j < sources.length; j++) {
    if (j === i) continue;                       // **自己源は和に入れない**(エンジンと同じ規約)
    const b = sources[j];
    if (!b) return null;
    const mj = Number(b.m), bx = Number(b.x), by = Number(b.y);
    const vjx = (b.vx === undefined) ? 0 : Number(b.vx), vjy = (b.vy === undefined) ? 0 : Number(b.vy);
    const om = (b.omega === undefined) ? 0 : Number(b.omega);
    if (!(Number.isFinite(mj) && Number.isFinite(bx) && Number.isFinite(by)
      && Number.isFinite(vjx) && Number.isFinite(vjy) && Number.isFinite(om))) return null;
    if (!(mj > 0)) return null;
    const dx = px - bx, dy = py - by, s = dx * dx + dy * dy + e2;
    if (!(s > 0) || !Number.isFinite(s)) return null;
    const w = mj * (pZero ? 1 : Math.pow(s, pHalfNeg));
    W += w; nIn++;
    Ax += w * (vjx - om * dy); Ay += w * (vjy + om * dx);
  }
  const uExt = (W > 0) ? [Ax / W, Ay / W] : null;   // **W_ext=0 は null**(0 で埋めない)
  return { i, p, eps,
    diagonal: { uSelf, wSelfComputed: false,
      note: '自己項は w_ii の値ではなく有限な極限 u_self=v_i として持つ(m/0 を計算しない)' },
    offdiagonal: { W, A: [Ax, Ay], u: uExt, nIn },
    selfExcludedFromDenominator: true };
}

/* ────────────────────────────────────────────────────────────────────────────
   検証 (i)(ii): 等速直線運動の Strict 保持・2 体の重心
   ──────────────────────────────────────────────────────────────────────────── */

/**
 * **(i) 1 粒子・外力ゼロ・背景ゼロ。** `selfDrift` だけで進めた位置が、閉形式
 * x(t)=x₀+v t と **厳密に一致する**か(相対誤差 0 を期待する)。
 * 誤差は**二重和の順序**を含めて出す(Σ(vΔt) と v·(nΔt) は一般に別の浮動小数である)。
 */
export function driftStrictTest(x0, v0, dt, steps) {
  const n = Number(steps);
  let x = [Number(x0[0]), Number(x0[1])];
  const v = selfVelocityLimit(v0);
  if (!v || !Number.isFinite(n) || !(n > 0)) return null;
  for (let k = 0; k < n; k++) {
    const nx = selfDrift(x, v, dt);
    if (!nx) return null;
    x = nx;
  }
  // 閉形式(同じ丸めで比べるため、加算の反復と「一度に掛ける」形の両方を出す)
  const closedMul = [Number(x0[0]) + v[0] * (dt * n), Number(x0[1]) + v[1] * (dt * n)];
  let a = [Number(x0[0]), Number(x0[1])];
  for (let k = 0; k < n; k++) { a = [a[0] + v[0] * dt, a[1] + v[1] * dt]; }
  const rel = (q, r) => {
    const d = Math.hypot(q[0] - r[0], q[1] - r[1]), s = Math.hypot(r[0], r[1]);
    return s > 0 ? d / s : d;
  };
  return { steps: n, dt: Number(dt), x, closedMul, closedAdd: a,
    relVsAdd: rel(x, a), relVsMul: rel(x, closedMul),
    bitSameAsAdd: (x[0] === a[0] && x[1] === a[1]),
    velocityUnchanged: (v[0] === Number(v0[0]) && v[1] === Number(v0[1])) };
}

/**
 * **(2) の否定対照**: 自己並進をもう 1 回足すと位置が 2 倍ずれる。
 */
export function doubleCountControl(x0, v0, dt, steps) {
  const one = driftStrictTest(x0, v0, dt, steps);
  if (!one) return null;
  const v = selfVelocityLimit(v0);
  let x = [Number(x0[0]), Number(x0[1])];
  for (let k = 0; k < Number(steps); k++) {
    x = [x[0] + v[0] * dt, x[1] + v[1] * dt];      // 既存の位置更新
    const y = selfDrift(x, v, dt);                  // **そのうえで自己並進をもう 1 回**(誤り)
    if (!y) return null;
    x = y;
  }
  const disp = Math.hypot(one.x[0] - Number(x0[0]), one.x[1] - Number(x0[1]));
  const dispDouble = Math.hypot(x[0] - Number(x0[0]), x[1] - Number(x0[1]));
  return { single: one.x, doubled: x, displacement: disp, displacementDoubled: dispDouble,
    ratio: disp > 0 ? dispDouble / disp : null };
}

/**
 * **(ii) 2 体**。重力(E4 と同じ核 G m/(r²+ε²)^{3/2} の逆二乗)で相互作用する 2 体を
 * **位置更新に `selfDrift` を使う** kick-drift-kick で積分し、
 * **重心速度の変化**と**換算質量の 1 体問題との一致**を測る。
 * 座標変換の加速度は入れない(**自己項だけの試験**)。
 */
export function twoBodyComTest(bodies, opts) {
  const o = opts || {};
  const G = (o.G === undefined) ? 1 : Number(o.G);
  const eps = (o.eps === undefined) ? 0 : Number(o.eps);
  const dt = (o.dt === undefined) ? 1e-3 : Number(o.dt);
  const steps = (o.steps === undefined) ? 20000 : Number(o.steps);
  if (!Array.isArray(bodies) || bodies.length !== 2) return null;
  const m = bodies.map((b) => Number(b.m));
  if (!m.every((z) => Number.isFinite(z) && z > 0)) return null;
  const x = bodies.map((b) => [Number(b.x), Number(b.y)]);
  const v = bodies.map((b) => [Number(b.vx), Number(b.vy)]);
  const M = m[0] + m[1], mu = m[0] * m[1] / M, e2 = eps * eps;
  const com = () => [(m[0] * x[0][0] + m[1] * x[1][0]) / M, (m[0] * x[0][1] + m[1] * x[1][1]) / M];
  const comV = () => [(m[0] * v[0][0] + m[1] * v[1][0]) / M, (m[0] * v[0][1] + m[1] * v[1][1]) / M];
  const acc = () => {
    const dx = x[0][0] - x[1][0], dy = x[0][1] - x[1][1];
    const s = dx * dx + dy * dy + e2, inv = 1 / Math.sqrt(s), inv3 = inv * inv * inv;
    return [[-G * m[1] * dx * inv3, -G * m[1] * dy * inv3],
      [G * m[0] * dx * inv3, G * m[0] * dy * inv3]];
  };
  const energy = () => {
    const dx = x[0][0] - x[1][0], dy = x[0][1] - x[1][1];
    const r = Math.sqrt(dx * dx + dy * dy + e2);
    return 0.5 * m[0] * (v[0][0] ** 2 + v[0][1] ** 2) + 0.5 * m[1] * (v[1][0] ** 2 + v[1][1] ** 2)
      - G * m[0] * m[1] / r;
  };
  const angMom = () => m[0] * (x[0][0] * v[0][1] - x[0][1] * v[0][0])
    + m[1] * (x[1][0] * v[1][1] - x[1][1] * v[1][0]);
  const comV0 = comV(), com0 = com(), E0 = energy(), L0 = angMom();
  // **速度の尺度**(絶対値 1e−15 は単位系に依るので、相対でも出す)
  const vScale = Math.max(Math.hypot(v[0][0], v[0][1]), Math.hypot(v[1][0], v[1][1]));
  let worstComV = 0, worstE = 0, worstL = 0, worstStep = 0;
  let a = acc();
  for (let k = 0; k < steps; k++) {
    for (let b = 0; b < 2; b++) { v[b][0] += 0.5 * dt * a[b][0]; v[b][1] += 0.5 * dt * a[b][1]; }
    for (let b = 0; b < 2; b++) {
      const nx = selfDrift(x[b], v[b], dt);        // **位置更新 = 自己並進写像**
      if (!nx) return null;
      x[b] = nx;
    }
    a = acc();
    for (let b = 0; b < 2; b++) { v[b][0] += 0.5 * dt * a[b][0]; v[b][1] += 0.5 * dt * a[b][1]; }
    const cv = comV();
    const prev = worstComV;
    worstComV = Math.max(worstComV, Math.hypot(cv[0] - comV0[0], cv[1] - comV0[1]));
    worstStep = Math.max(worstStep, Math.abs(worstComV - prev));
    worstE = Math.max(worstE, Math.abs((energy() - E0) / (E0 || 1)));
    worstL = Math.max(worstL, Math.abs((angMom() - L0) / (L0 || 1)));
  }
  // 換算質量の 1 体問題(同じ積分器・同じ dt)と相対座標を突き合わせる
  let rx = [bodies[0].x - bodies[1].x, bodies[0].y - bodies[1].y];
  let rv = [bodies[0].vx - bodies[1].vx, bodies[0].vy - bodies[1].vy];
  const accR = () => {
    const s = rx[0] * rx[0] + rx[1] * rx[1] + e2, inv = 1 / Math.sqrt(s), inv3 = inv * inv * inv;
    return [-G * M * rx[0] * inv3, -G * M * rx[1] * inv3];
  };
  let ar = accR();
  for (let k = 0; k < steps; k++) {
    rv = [rv[0] + 0.5 * dt * ar[0], rv[1] + 0.5 * dt * ar[1]];
    const nx = selfDrift(rx, rv, dt);
    if (!nx) return null;
    rx = nx;
    ar = accR();
    rv = [rv[0] + 0.5 * dt * ar[0], rv[1] + 0.5 * dt * ar[1]];
  }
  const relPair = [x[0][0] - x[1][0], x[0][1] - x[1][1]];
  const dRel = Math.hypot(relPair[0] - rx[0], relPair[1] - rx[1]) / (Math.hypot(rx[0], rx[1]) || 1);
  const cvEnd = comV(), comEnd = com();
  const drift = Math.hypot(comEnd[0] - (com0[0] + comV0[0] * dt * steps),
    comEnd[1] - (com0[1] + comV0[1] * dt * steps));
  return { steps, dt, G, eps, mu, M, vScale,
    comV0, comVEnd: cvEnd, comVChange: worstComV,
    comVChangeRel: vScale > 0 ? worstComV / vScale : worstComV,
    comVChangePerStepMax: worstStep,
    roundoffBudgetRel: steps * Number.EPSILON,
    comPosDriftVsSelfDrift: drift,
    energyRel: worstE, angMomRel: worstL,
    reducedOneBodyRel: dRel };
}

/* ────────────────────────────────────────────────────────────────────────────
   (3)(5) 否定対照
   ──────────────────────────────────────────────────────────────────────────── */

/**
 * **(3) の否定対照**: 自己項 w_ii=m_i/ρ^p を**分母へ入れた**とき、外部源の分け前
 * χ_ext = W_ext/(w_ii+W_ext) と u が ρ→0 でどうなるかを列で出す。
 * **これは採らない実装**である(他天体の寄与が全部ゼロになる)。
 */
export function selfInDenominatorControl(sources, i, opts) {
  const o = opts || {};
  const base = splitDiagonalOffdiagonal(sources, i, o);
  if (!base) return null;
  const p = base.p;
  const mi = Number(sources[i].m);
  const rhos = Array.isArray(o.rhos) ? o.rhos.map(Number) : [1, 1e-1, 1e-2, 1e-3, 1e-6, 1e-9];
  const W = base.offdiagonal.W, A = base.offdiagonal.A, uSelf = base.diagonal.uSelf;
  const rows = rhos.map((rho) => {
    const wSelf = mi / Math.pow(rho, p);
    const den = wSelf + W;
    const ux = (wSelf * uSelf[0] + A[0]) / den, uy = (wSelf * uSelf[1] + A[1]) / den;
    const uExt = base.offdiagonal.u;
    return { rho, wSelf, chiExt: W / den, u: [ux, uy],
      distanceFromSelf: Math.hypot(ux - uSelf[0], uy - uSelf[1]),
      distanceFromExt: uExt ? Math.hypot(ux - uExt[0], uy - uExt[1]) : null };
  });
  return { i, p, eps: base.eps, Wext: W, uExt: base.offdiagonal.u, uSelf, rows,
    chiExtAtSmallest: rows[rows.length - 1].chiExt,
    verdict: 'reject' };
}

/**
 * **(5) の否定対照**: L = ½m|v−u_self|² に u_self=v を入れると **恒等的に 0**。
 * 自己並進の運動量・エネルギーを保った上で外部相対項を足す作用が別に要る。
 */
export function lagrangianDegeneracy(m, v, opts) {
  const o = opts || {};
  const uSelf = selfVelocityLimit(v);
  if (!uSelf || !(Number(m) > 0)) return null;
  const mm = Number(m);
  const T = 0.5 * mm * (uSelf[0] ** 2 + uSelf[1] ** 2);
  const Lself = 0.5 * mm * ((uSelf[0] - uSelf[0]) ** 2 + (uSelf[1] - uSelf[1]) ** 2);
  const uExt = Array.isArray(o.uExt) ? [Number(o.uExt[0]), Number(o.uExt[1])] : null;
  const Lrel = uExt ? 0.5 * mm * ((uSelf[0] - uExt[0]) ** 2 + (uSelf[1] - uExt[1]) ** 2) : null;
  // ∂L/∂v(正準運動量)—— 退化形では 0、外部相対形では m(v−u_ext)
  const pSelf = [0, 0];
  const pRel = uExt ? [mm * (uSelf[0] - uExt[0]), mm * (uSelf[1] - uExt[1])] : null;
  return { m: mm, v: uSelf, uSelf, kineticFree: T, LwithSelfOnly: Lself,
    momentumWithSelfOnly: pSelf, degenerate: (Lself === 0),
    uExt, LwithExternal: Lrel, momentumWithExternal: pRel,
    note: '公理だけでは質量・運動量則は出ない —— 自己並進の p=mv を保つ作用を別に宣言する必要がある' };
}

export default { SELFINERTIA_VERSION, selfVelocityLimit, selfDrift, selfTermRegularization,
  splitDiagonalOffdiagonal, driftStrictTest, doubleCountControl, twoBodyComTest,
  selfInDenominatorControl, lagrangianDegeneracy };
