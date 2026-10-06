// 第293便e(原仮定者の裁定(第83報)「引きずりは相対的な速度差で発生する座標変換なので、同じ方向の複数の引きずりが単純に足されることは無い」・
// 統括の検証項目 R145)—— **引きずりの合成則の純関数**(Node だけ・html を読まない)。
//
// ■ 何を置くか
//   現行(第290便c の `dfmInertialDragStep` —— 宣言 compose 未宣言 = "sum")は u_i = Σ_j a_ij (V_j − V_i)・a_ij = C_d m_j 𝒦_j(r_ij) で
//   **各源の寄与を足す**。法則版の候補 "solve" は共通の移動速度 W を自己無撞着に解く:
//     W_i = v_i + Σ_j a_ij (W_j − W_i)  ⇔  (I + L) W = v(L の対角 Σ_j a_ij・非対角 −a_ij)・u_i = W_i − v_i
//   u について書くと (I + L) u = s、s_i = Σ_j a_ij (v_j − v_i)(= 加算の u と同じ式・同じ和の順序)。共通の並進は s の差で厳密に消える。
//   受け取らない行(pinned〔規定運動〕・質量が正でない粒子)は u_i = 0 に固定する(源にはなる —— 規定源だけなら
//   W_i = (v_i + Σ_j a_ij W_j)/(1 + Σ_j a_ij))。
//   解法(エンジンの `inertialDragComposeSolve` と同じ式・同じ順序): n ≤ 64 は直接法(ガウス消去・ピボットなし —— a_ij ≥ 0 で I+L は
//   行について厳密に対角優位)・それより多いと Gauss–Seidel を iters 回(初期値 0・添字の順)。残差 max|(I+L)u − s| / max|s|。
//
// ■ 検査(selfTest の 8 項 —— 器 tests/exp-w293e-compose.mjs と QA behavior.composeGate が読む)
//   (1) 2 源の代数例: 受け手 v=0・規定源の速度 1・a=1 → sum は 1 源 u=1・2 源 u=2 / solve は 1/2・2/3。
//   (2) 共通並進不変: 全員に同じ速度を足しても u は不変(丸めまで)。
//   (3) 共動: 全員が同じ速度なら u = 0(厳密)。
//   (4) 弱結合極限: a → 0 で sum と solve が一致し、差は O(a²)(結合を 1/10 にすると差は 1/100)。
//   (5) 順序不変: 粒子の並べ替えで u が並べ替わるだけ(丸めまで)。
//   (6) 分割/併合不変: 源 1 つ(質量 m)を同じ位置・同じ速度の 2 源(m/2 ずつ)に分けても他の粒子の u は同じ(sum も solve も)。
//   (7) 強結合の有界性: solve は |u_i| ≤ max_j |v_j − v_i|(W は v の凸包の中)。sum はこれを破る(比を記録)。
//   (8) 帳簿: 共動で ΔU・Σmu・Σm x×u がすべて 0/ 相反な結合(m_i a_ij = m_j a_ji)で Σ m u = 0(sum も solve も —— 丸めまで)/
//       規定源があると Σ m u ≠ 0(運動量は外から入る —— 規定源の外部仕事 ΔU を記録)。
//   別に(項の外): **履歴則の不動点**。v を固定して V^{n} = v + u^{n−1}(座標差分の移動ベクトルが前の步の移送を含む形)で加算を回すと、
//   スペクトル半径 ρ(L) < 1 なら solve(v) に収束する(2 源・a=0.2 で 2a/(1+2a))。a=1 では発散する(上界 2·max deg ≥ 1)。
//   2 体の相対モード(結合 A = a_01 + a_10)では、加算+履歴と solve+velocity の不動点は ẋ_rel = v_rel/(1+A)、solve+history は
//   ẋ_rel = v_rel (1+A)/(1+2A)(実効の結合 A/(1+A))。
//
// ■ しないこと・言わないこと
//   ・「正しい合成則」と断定しない(法則版の候補 —— 本番核の差し替えではない・既定は "sum")。回転引きずり(Ω)は扱わない。
//   ・「相対速度を使うこと自体から非加算性が導かれる」とは言わない(相対速度の線形な和は加算のまま —— 非加算性は自己無撞着の宣言から来る)。
//   ・冪は `**`/Math.pow を使わず積で書く(tests/README §1)。
export const COMPOSE_LIB_VERSION = 'w293e-compose-lib-1';
export const DIRECT_MAX = 64;
export const ITERS_DEFAULT = 8;

/** 核 K_ε(r) = r/(r²+ε²)²(エンジンと同じ順序)。 */
export function kernelK(r, eps) { const s = r * r + eps * eps; return r / (s * s); }

/**
 * 結合の行(エンジンの `inertialDragComposeBuild` と同じ式・同じ順序)。
 * o = { n, x, y, m, pinned?, pairSet?(Set of i*NP+j), NP?, C, eps, VX, VY, hist, kernel?(j, r) → ⟨K⟩_j(r) | null }
 * 戻り値 { A(Float64Array n²), SX, SY(= 加算の u), DG, degMax, coincident }
 */
export function buildRows(o) {
  const n = o.n, X = o.x, Y = o.y, m = o.m, pin = o.pinned || new Array(n).fill(false), set = o.pairSet || null, NP = o.NP || n;
  const C = o.C, e2 = o.eps * o.eps, WX = o.VX, WY = o.VY, hist = o.hist !== false;
  const A = new Float64Array(n * n), SX = new Float64Array(n), SY = new Float64Array(n), DG = new Float64Array(n);
  let degMax = 0;
  for (let i = 0; i < n; i++) {
    let ux = 0, uy = 0, deg = 0;
    const mi = m[i], okI = (mi > 0 && Number.isFinite(mi)), row = i * n;
    for (let j = 0; j < n; j++) {
      A[row + j] = 0;
      if (j === i) continue;
      if (set && !set.has(i * NP + j)) continue;
      const mj = m[j];
      if (!(mj > 0) || !Number.isFinite(mj)) continue;
      const dx = X[j] - X[i], dy = Y[j] - Y[i], r2 = dx * dx + dy * dy;
      if (!(r2 > 0)) return { A, SX, SY, DG, degMax, coincident: true };
      const r = Math.sqrt(r2), s = r2 + e2;
      const kv = o.kernel ? o.kernel(j, r) : null;
      const a = C * mj * ((kv === null) ? (r / (s * s)) : kv);
      A[row + j] = a;
      if (hist) { ux += a * (WX[j] - WX[i]); uy += a * (WY[j] - WY[i]); }
      deg += a;
    }
    SX[i] = okI ? ux : 0; SY[i] = okI ? uy : 0; DG[i] = okI ? deg : 0;
    if (okI && !pin[i]) { const ad = Math.abs(deg); if (ad > degMax) degMax = ad; }
  }
  return { A, SX, SY, DG, degMax, coincident: false };
}

/** 抽象の結合行列から加算の u(s)と次数を作る(a_ij を直接与える検査用 —— 同じ和の順序)。 */
export function sumFromMatrix(n, A, VX, VY, fixed) {
  const SX = new Float64Array(n), SY = new Float64Array(n), DG = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    let ux = 0, uy = 0, deg = 0; const row = i * n;
    for (let j = 0; j < n; j++) { if (j === i) continue; const a = A[row + j]; ux += a * (VX[j] - VX[i]); uy += a * (VY[j] - VY[i]); deg += a; }
    SX[i] = ux; SY[i] = uy; DG[i] = deg;
  }
  const out = { SX: SX.slice(), SY: SY.slice(), DG };
  if (fixed) for (let i = 0; i < n; i++) if (fixed[i]) { out.SX[i] = 0; out.SY[i] = 0; }
  return out;
}

/**
 * (I+L)u = s(エンジンの `inertialDragComposeSolve` と同じ式・同じ順序)。fixed[i] の行は u_i = 0。
 * o = { n, A, SX, SY, DG, fixed, iters?, directMax? } → { UX, UY, method, res, sMax, uMax }
 */
export function solve(o) {
  const n = o.n, A = o.A, DG = o.DG, FX = o.fixed, dmax = (o.directMax === undefined) ? DIRECT_MAX : o.directMax;
  const SX = new Float64Array(n), SY = new Float64Array(n), UX = new Float64Array(n), UY = new Float64Array(n);
  let sMax = 0;
  for (let i = 0; i < n; i++) {
    SX[i] = FX[i] ? 0 : o.SX[i]; SY[i] = FX[i] ? 0 : o.SY[i];
    const sm = Math.hypot(SX[i], SY[i]); if (sm > sMax) sMax = sm;
  }
  let method;
  if (n <= dmax) {
    method = 'direct';
    const M = new Float64Array(n * n);
    for (let i = 0; i < n; i++) {
      const row = i * n;
      for (let j = 0; j < n; j++) M[row + j] = FX[i] ? 0 : -A[row + j];
      M[row + i] = FX[i] ? 1 : 1 + DG[i];
      UX[i] = SX[i]; UY[i] = SY[i];
    }
    for (let k = 0; k < n; k++) {
      const pk = M[k * n + k];
      for (let i = k + 1; i < n; i++) {
        const f = M[i * n + k] / pk;
        if (f === 0) continue;
        for (let j = k + 1; j < n; j++) M[i * n + j] -= f * M[k * n + j];
        UX[i] -= f * UX[k]; UY[i] -= f * UY[k];
      }
    }
    for (let i = n - 1; i >= 0; i--) {
      let sx = UX[i], sy = UY[i];
      for (let j = i + 1; j < n; j++) { sx -= M[i * n + j] * UX[j]; sy -= M[i * n + j] * UY[j]; }
      const d = M[i * n + i];
      UX[i] = sx / d; UY[i] = sy / d;
    }
  } else {
    method = 'gs';
    const it = (o.iters === undefined) ? ITERS_DEFAULT : o.iters;
    for (let k = 0; k < it; k++) {
      for (let i = 0; i < n; i++) {
        if (FX[i]) continue;
        const row = i * n;
        let sx = SX[i], sy = SY[i];
        for (let j = 0; j < n; j++) { if (j === i) continue; const a = A[row + j]; if (a !== 0) { sx += a * UX[j]; sy += a * UY[j]; } }
        const d = 1 + DG[i];
        UX[i] = sx / d; UY[i] = sy / d;
      }
    }
  }
  let rMax = 0, uMax = 0;
  for (let i = 0; i < n; i++) {
    if (FX[i]) continue;
    const row = i * n, d = 1 + DG[i];
    let rx = d * UX[i] - SX[i], ry = d * UY[i] - SY[i];
    for (let j = 0; j < n; j++) { if (j === i) continue; const a = A[row + j]; if (a !== 0) { rx -= a * UX[j]; ry -= a * UY[j]; } }
    const rr = Math.max(Math.abs(rx), Math.abs(ry)); if (rr > rMax) rMax = rr;
    const um = Math.hypot(UX[i], UY[i]); if (um > uMax) uMax = um;
  }
  return { UX, UY, method, res: (sMax > 0) ? rMax / sMax : rMax, sMax, uMax };
}

/** 合成(mode 'sum' | 'solve')—— 抽象の結合行列から。 */
export function composeMatrix(mode, n, A, VX, VY, fixed, opt) {
  const FX = fixed || new Array(n).fill(0);
  const s = sumFromMatrix(n, A, VX, VY, FX);
  if (mode === 'sum') return { UX: s.SX, UY: s.SY, DG: s.DG };
  const q = solve(Object.assign({ n, A, SX: s.SX, SY: s.SY, DG: s.DG, fixed: FX }, opt || {}));
  return Object.assign(q, { DG: s.DG });
}

/**
 * 移送の帳簿(エンジンの `dfmInertialDragStep` の後半と同じ式・同じ順序)。
 * o = { n, x, y, m, mEff, vx, vy, UX, UY, pinned, dt, G, soft } → { dU, Px, Py, Jz, dL, uMax, nMoved, dUPinned }
 * dUPinned は規定源を含む対の ΔU(規定源の外部仕事 —— エンジンは分けない。純関数の記録だけ)。
 */
export function ledger(o) {
  const n = o.n, X = o.x, Y = o.y, m = o.m, me = o.mEff || o.m, pin = o.pinned || new Array(n).fill(false), dt = o.dt, G = o.G, eg2 = o.soft * o.soft;
  const NX = new Float64Array(n), NY = new Float64Array(n);
  let Px = 0, Py = 0, Jz = 0, dL = 0, uMax = 0, nMoved = 0, dU = 0, dUPinned = 0;
  for (let i = 0; i < n; i++) {
    let ux = o.UX[i], uy = o.UY[i];
    if (pin[i]) { ux = 0; uy = 0; }
    NX[i] = (ux !== 0) ? X[i] + ux * dt : X[i]; NY[i] = (uy !== 0) ? Y[i] + uy * dt : Y[i];
    if (ux !== 0 || uy !== 0) {
      nMoved++;
      const mi = m[i];
      Px += mi * ux; Py += mi * uy; Jz += mi * (X[i] * uy - Y[i] * ux); dL += mi * (ux * o.vy[i] - uy * o.vx[i]) * dt;
      const um = Math.hypot(ux, uy); if (um > uMax) uMax = um;
    }
  }
  if (nMoved) {
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      if (NX[i] === X[i] && NY[i] === Y[i] && NX[j] === X[j] && NY[j] === Y[j]) continue;
      const ax = X[j] - X[i], ay = Y[j] - Y[i], bx = NX[j] - NX[i], by = NY[j] - NY[i];
      const e = -G * me[i] * me[j] * (1 / Math.sqrt(bx * bx + by * by + eg2) - 1 / Math.sqrt(ax * ax + ay * ay + eg2));
      dU += e; if (pin[i] || pin[j]) dUPinned += e;
    }
  }
  return { dU, Px, Py, Jz, dL, uMax, nMoved, dUPinned };
}

/** 履歴則の不動点: v を固定し V^{k} = v + u^{k−1} で加算を回す(steps 回)。収束の記録と solve(v) との差。 */
export function historyIterate(n, A, VX, VY, fixed, steps) {
  const FX = fixed || new Array(n).fill(0);
  let UX = new Float64Array(n), UY = new Float64Array(n);
  const trace = [];
  for (let k = 0; k < steps; k++) {
    const WX = new Float64Array(n), WY = new Float64Array(n);
    for (let i = 0; i < n; i++) { WX[i] = VX[i] + UX[i]; WY[i] = VY[i] + UY[i]; }
    const s = sumFromMatrix(n, A, WX, WY, FX);
    UX = s.SX; UY = s.SY;
    if (k < 4 || k === steps - 1) trace.push({ k: k + 1, u0: [UX[0], UY[0]] });
  }
  const sv = composeMatrix('solve', n, A, VX, VY, FX);
  let d = 0, sc = 0;
  for (let i = 0; i < n; i++) { d = Math.max(d, Math.abs(UX[i] - sv.UX[i]), Math.abs(UY[i] - sv.UY[i])); sc = Math.max(sc, Math.abs(sv.UX[i]), Math.abs(sv.UY[i])); }
  return { UX: Array.from(UX), UY: Array.from(UY), solve: [Array.from(sv.UX), Array.from(sv.UY)], diffRel: sc > 0 ? d / sc : d, trace };
}

/* ── 検査用の小さな系(決定論の擬似乱数)── */
export function lcg(seed) { let z = seed >>> 0; return () => { z = (Math.imul(z, 1664525) + 1013904223) >>> 0; return z / 4294967296; }; }
/** n 体の抽象結合(a_ij = C m_j K(r_ij) —— 相反でない)。 */
export function randomSystem(n, seed, scale) {
  const R = lcg(seed), x = [], y = [], m = [], VX = [], VY = [];
  for (let i = 0; i < n; i++) { x.push(20 * R() - 10); y.push(20 * R() - 10); m.push(0.5 + 2 * R()); VX.push(2 * R() - 1); VY.push(2 * R() - 1); }
  const A = new Float64Array(n * n);
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { if (i === j) continue; const r = Math.hypot(x[j] - x[i], y[j] - y[i]); A[i * n + j] = scale * m[j] * kernelK(r, 0.5); }
  return { n, x, y, m, VX, VY, A };
}
const maxAbs = (a) => { let z = 0; for (const v of a) z = Math.max(z, Math.abs(v)); return z; };
const maxDiff = (a, b) => { let z = 0; for (let i = 0; i < a.length; i++) z = Math.max(z, Math.abs(a[i] - b[i])); return z; };

/** 単体試験(8 項と履歴則の不動点)。 */
export function selfTest() {
  const items = {};
  // (1) 2 源の代数例(粒子 0 = 受け手 v=0・粒子 1,2 = 規定源 速度 (1,0)・a_0j = 1)
  {
    const mk = (k) => { const n = 1 + k, A = new Float64Array(n * n); for (let j = 1; j < n; j++) A[j] = 1; const VX = [0].concat(new Array(k).fill(1)), VY = new Array(n).fill(0), fx = [0].concat(new Array(k).fill(1)); return { n, A, VX, VY, fx }; };
    const one = mk(1), two = mk(2);
    const s1 = composeMatrix('sum', one.n, one.A, one.VX, one.VY, one.fx).UX[0], s2 = composeMatrix('sum', two.n, two.A, two.VX, two.VY, two.fx).UX[0];
    const v1 = composeMatrix('solve', one.n, one.A, one.VX, one.VY, one.fx).UX[0], v2 = composeMatrix('solve', two.n, two.A, two.VX, two.VY, two.fx).UX[0];
    const closed = (k) => (0 + k * 1) / (1 + k) - 0;   // W_0 = (v_0 + Σ a V_j)/(1 + Σ a)・u_0 = W_0 − v_0
    items.algebra = { sum1: s1, sum2: s2, solve1: v1, solve2: v2, closed1: closed(1), closed2: closed(2),
      ok: s1 === 1 && s2 === 2 && Math.abs(v1 - 0.5) <= 1e-15 && Math.abs(v2 - 2 / 3) <= 1e-15 && Math.abs(v2 - closed(2)) <= 1e-15 };
  }
  const sys = randomSystem(7, 293, 0.6), fx7 = new Array(7).fill(0);
  // (2) 共通並進不変
  {
    const c = [0.731, -1.29], rows = [];
    for (const mode of ['sum', 'solve']) {
      const a = composeMatrix(mode, sys.n, sys.A, sys.VX, sys.VY, fx7), b = composeMatrix(mode, sys.n, sys.A, sys.VX.map((v) => v + c[0]), sys.VY.map((v) => v + c[1]), fx7);
      const sc = Math.max(maxAbs(a.UX), maxAbs(a.UY));
      rows.push({ mode, rel: Math.max(maxDiff(a.UX, b.UX), maxDiff(a.UY, b.UY)) / sc });
    }
    items.translation = { shift: c, rows, ok: rows.every((z) => z.rel <= 1e-12) };
  }
  // (3) 共動(u = 0 厳密)
  {
    const V = new Array(7).fill(0.3), W = new Array(7).fill(-0.7);
    const a = composeMatrix('sum', 7, sys.A, V, W, fx7), b = composeMatrix('solve', 7, sys.A, V, W, fx7);
    items.comoving = { sumMax: Math.max(maxAbs(a.UX), maxAbs(a.UY)), solveMax: Math.max(maxAbs(b.UX), maxAbs(b.UY)) };
    items.comoving.ok = items.comoving.sumMax === 0 && items.comoving.solveMax === 0;
  }
  // (4) 弱結合極限(差は O(a²))
  {
    const rows = [];
    for (const sc of [1e-2, 1e-3, 1e-4]) {
      const A = sys.A.map((v) => v * sc), a = composeMatrix('sum', 7, A, sys.VX, sys.VY, fx7), b = composeMatrix('solve', 7, A, sys.VX, sys.VY, fx7);
      const d = Math.max(maxDiff(a.UX, b.UX), maxDiff(a.UY, b.UY)), u = Math.max(maxAbs(a.UX), maxAbs(a.UY));
      let dg = 0; for (const v of a.DG) dg = Math.max(dg, v);
      rows.push({ scale: sc, degMax: dg, diff: d, rel: d / u });
    }
    const slopes = [Math.log10(rows[0].diff / rows[1].diff), Math.log10(rows[1].diff / rows[2].diff)];
    items.weak = { rows, slopes, ok: slopes.every((z) => z > 1.95 && z < 2.05) && rows[2].rel < 1e-3 };
  }
  // (5) 順序不変(粒子の並べ替え)
  {
    const perm = [3, 6, 0, 5, 1, 4, 2], n = 7, A2 = new Float64Array(n * n);
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) A2[i * n + j] = sys.A[perm[i] * n + perm[j]];
    const rows = [];
    for (const mode of ['sum', 'solve']) {
      const a = composeMatrix(mode, n, sys.A, sys.VX, sys.VY, fx7), b = composeMatrix(mode, n, A2, perm.map((k) => sys.VX[k]), perm.map((k) => sys.VY[k]), fx7);
      let d = 0; for (let i = 0; i < n; i++) d = Math.max(d, Math.abs(b.UX[i] - a.UX[perm[i]]), Math.abs(b.UY[i] - a.UY[perm[i]]));
      rows.push({ mode, rel: d / Math.max(maxAbs(a.UX), maxAbs(a.UY)) });
    }
    items.order = { perm, rows, ok: rows.every((z) => z.rel <= 1e-13) };
  }
  // (6) 分割/併合不変: 粒子 2(質量 m)を同じ位置・同じ速度の 2 つ(m/2)に分ける。a_{i,半} = a_{i,2}/2・a_{半,i} = a_{2,i}・半どうしの結合は任意(0.37)
  {
    const n = 7, n2 = 8, A2 = new Float64Array(n2 * n2), map = [0, 1, 2, 3, 4, 5, 6, 2];
    for (let i = 0; i < n2; i++) for (let j = 0; j < n2; j++) {
      if (i === j) continue;
      const ii = map[i], jj = map[j];
      if (ii === 2 && jj === 2) { A2[i * n2 + j] = 0.37; continue; }
      A2[i * n2 + j] = (jj === 2) ? sys.A[ii * n + jj] * 0.5 : sys.A[ii * n + jj];
    }
    const VX2 = map.map((k) => sys.VX[k]), VY2 = map.map((k) => sys.VY[k]), rows = [];
    for (const mode of ['sum', 'solve']) {
      const a = composeMatrix(mode, n, sys.A, sys.VX, sys.VY, fx7), b = composeMatrix(mode, n2, A2, VX2, VY2, new Array(n2).fill(0));
      let d = 0; for (let i = 0; i < n2; i++) d = Math.max(d, Math.abs(b.UX[i] - a.UX[map[i]]), Math.abs(b.UY[i] - a.UY[map[i]]));
      rows.push({ mode, rel: d / Math.max(maxAbs(a.UX), maxAbs(a.UY)) });
    }
    items.split = { halves: 'm/2 + m/2(同じ位置・同じ速度・半どうしの結合 0.37)', rows, ok: rows.every((z) => z.rel <= 1e-13) };
  }
  // (7) 強結合の有界性
  {
    const rows = [];
    for (const sc of [1, 30, 1000]) {
      const A = sys.A.map((v) => v * sc), a = composeMatrix('sum', 7, A, sys.VX, sys.VY, fx7), b = composeMatrix('solve', 7, A, sys.VX, sys.VY, fx7);
      let worstSolve = 0, worstSum = 0, dg = 0;
      for (let i = 0; i < 7; i++) {
        let bd = 0; for (let j = 0; j < 7; j++) bd = Math.max(bd, Math.hypot(sys.VX[j] - sys.VX[i], sys.VY[j] - sys.VY[i]));
        worstSolve = Math.max(worstSolve, Math.hypot(b.UX[i], b.UY[i]) / bd); worstSum = Math.max(worstSum, Math.hypot(a.UX[i], a.UY[i]) / bd); dg = Math.max(dg, a.DG[i]);
      }
      rows.push({ scale: sc, degMax: dg, bound2deg: 2 * dg, solveOverBound: worstSolve, sumOverBound: worstSum });
    }
    items.bounded = { rows, ok: rows.every((z) => z.solveOverBound <= 1 + 1e-12) && rows[rows.length - 1].sumOverBound > 1 };
  }
  // (8) 帳簿
  {
    const n = 7, base = { n, x: sys.x, y: sys.y, m: sys.m, vx: sys.VX, vy: sys.VY, dt: 0.01, G: 1, soft: 0.05 };
    const V = new Array(7).fill(0.3), W = new Array(7).fill(-0.7);
    const c0 = composeMatrix('solve', n, sys.A, V, W, fx7), l0 = ledger(Object.assign({}, base, { UX: c0.UX, UY: c0.UY }));
    const comoving = { dU: l0.dU, Px: l0.Px, Py: l0.Py, Jz: l0.Jz, ok: l0.dU === 0 && l0.Px === 0 && l0.Py === 0 && l0.Jz === 0 };
    // 相反な結合 m_i a_ij = m_j a_ji(a_ij = C m_j K(r_ij) は K が対称なら相反)
    const recip = [];
    for (const mode of ['sum', 'solve']) {
      const c = composeMatrix(mode, n, sys.A, sys.VX, sys.VY, fx7), l = ledger(Object.assign({}, base, { UX: c.UX, UY: c.UY }));
      let ab = 0; for (let i = 0; i < n; i++) ab += sys.m[i] * Math.hypot(c.UX[i], c.UY[i]);
      recip.push({ mode, sumMu: [l.Px, l.Py], rel: Math.hypot(l.Px, l.Py) / ab, Jz: l.Jz, dU: l.dU });
    }
    // 規定源(粒子 0 を pinned)—— 運動量は外から入る
    const fxP = [1, 0, 0, 0, 0, 0, 0], pinned = fxP.map(Boolean), presc = [];
    for (const mode of ['sum', 'solve']) {
      const c = composeMatrix(mode, n, sys.A, sys.VX, sys.VY, fxP), l = ledger(Object.assign({}, base, { UX: c.UX, UY: c.UY, pinned }));
      let ab = 0; for (let i = 0; i < n; i++) ab += sys.m[i] * Math.hypot(c.UX[i], c.UY[i]);
      presc.push({ mode, sumMu: [l.Px, l.Py], rel: Math.hypot(l.Px, l.Py) / ab, Jz: l.Jz, dU: l.dU, dUPinned: l.dUPinned });
    }
    items.ledger = { comoving, reciprocal: recip, prescribed: presc,
      ok: comoving.ok && recip.every((z) => z.rel <= 1e-13) && presc.every((z) => z.rel > 1e-6 && z.dUPinned !== 0) };
  }
  // 項の外: 履歴則の不動点(2 源の代数例 —— 規定源 2 つ・受け手 v=0)
  const hist = {};
  {
    const mk = (a) => { const A = new Float64Array(9); A[1] = a; A[2] = a; return A; };
    for (const a of [0.2, 1]) {
      const r = historyIterate(3, mk(a), [0, 1, 1], [0, 0, 0], [0, 1, 1], 200);
      hist['a' + a] = { a, degMax: 2 * a, bound: 4 * a, u200: r.UX[0], solve: r.solve[0][0], closed: 2 * a / (1 + 2 * a), diffRel: r.diffRel, converged: Number.isFinite(r.diffRel) && r.diffRel <= 1e-12,
        trace: r.trace.map((z) => z.u0[0]) };
    }
    // 2 体の相対モード(自由な 2 体・a_01 = 0.03・a_10 = 0.004)
    const A = new Float64Array([0, 0.03, 0.004, 0]), At = 0.034, VX = [0, 1], VY = [0, 0];
    const sh = historyIterate(2, A, VX, VY, [0, 0], 400);                      // 加算+履歴の不動点
    const sv = composeMatrix('solve', 2, A, VX, VY, [0, 0]);                   // solve+velocity
    // solve+history の不動点: u = solve(v + u) を反復
    let UX = [0, 0];
    for (let k = 0; k < 400; k++) { const q = composeMatrix('solve', 2, A, [VX[0] + UX[0], VX[1] + UX[1]], [0, 0], [0, 0]); UX = [q.UX[0], q.UX[1]]; }
    const rel = (u) => (VX[1] + u[1]) - (VX[0] + u[0]);
    hist.pair = { A: At, sumHistory: rel(sh.UX), solveVelocity: rel(sv.UX), solveHistory: rel(UX), closedSum: 1 / (1 + At), closedSolveHistory: (1 + At) / (1 + 2 * At) };
    hist.pair.ok = Math.abs(hist.pair.sumHistory - hist.pair.closedSum) <= 1e-13 && Math.abs(hist.pair.solveVelocity - hist.pair.closedSum) <= 1e-13
      && Math.abs(hist.pair.solveHistory - hist.pair.closedSolveHistory) <= 1e-13;
  }
  hist.ok = hist['a0.2'].converged && !hist.a1.converged && hist.pair.ok;
  const keys = ['algebra', 'translation', 'comoving', 'weak', 'order', 'split', 'bounded', 'ledger'];
  return { version: COMPOSE_LIB_VERSION, items, nItems: keys.length, nOk: keys.filter((k) => items[k].ok).length, history: hist,
    ok: keys.every((k) => items[k].ok) && hist.ok };
}
