// 第285便b(原仮定者の裁定(第75報)⑦「geoPN=1 の λ_PN=1 は GR の 1PN と同等の軌道になる想定。合わない場合は算出方法を調べつつ
//   λ_PN=0 なども確認する」・統括の検証項目 R97/R98)—— **1PN の参照実装(oracle)**。副作用なし・ファイルを書かない・html を読まない。
//
// ■ 何を持つか(すべて html と独立に書いた式 —— html の写しではない)
//   ① Blanchet & Iyer(gr-qc/0209089 §III)の**調和座標の相対二体 1PN 加速度**(孤立・非自転・軟化なし・GR)`biRelAccel`。
//   ② PPN(β=1・γ)の **N 体 1PN 運動方程式**(GR の γ=1 で Einstein–Infeld–Hoffmann 式)を**全体の形のまま**評価する `eihAccel`
//      (html は「試験粒子形 + 差分 Δ」に分けて持つ —— ここは分けない。源の集合・固定・Plummer 軟化は html の契約と同じ宣言で受ける)。
//   ③ 同じ PPN の **N 体 1PN ラグランジアン** `ppnLagrangian` と正準運動量 `ppnMomenta`(解析式)・エネルギー `ppnEnergy`、
//      Euler–Lagrange 方程式を数値微分で解いた加速度 `elAccel`(②の式が③のラグランジアンから出ることを c⁻⁴ の残差で照合する)。
//   ④ 相対二体 1PN の常微分方程式を RK4 で積分し、近点の時刻と角を厳密に拾う `relOrbitAdvance`(抽出器を持たない照合先)。
//   ⑤ 旧 kF0 則(試験粒子形 + ∇U 因子の対反作用)の相対二体への還元係数と近点移動比(lib-w282b-geo1 の `relCoefficients`・
//      `advanceRatio` を読む —— 解析は Gauss の摂動方程式の 1 周積分)。
//
// ■ しないこと: 値を測らない(測るのは器 tests/exp-w285b-pn1.mjs)。「観測一致を達成した」「較正を完了した」「kF0 版が成立した」
//   「λ_PN=1 で既に 1PN と合った」「不足は DFM の新現象」とは書かない。**DFM から導出した式ではない**(kF0 対照の物差し)。
import { relCoefficients, advanceRatio, gaussAdvanceBasis, gr1pnAdvanceRad, e12TestAccel } from './lib-w282b-geo1.mjs';

export const GR1PN_W285B_VERSION = 'w285b-gr1pn-1';
export { relCoefficients, advanceRatio, gaussAdvanceBasis, gr1pnAdvanceRad, e12TestAccel };

// ---------------------------------------------------------------- ① Blanchet & Iyer の相対二体 1PN(GR・調和座標)
/**
 * a = −(GM/r²)n + (GM/(c²r²))[((4+2ν)GM/r − (1+3ν)v² + (3/2)ν ṙ²)n + (4−2ν)ṙ v]
 * (n=(x₁−x₂)/r・v=v₁−v₂・ṙ=n·v・ν=m₁m₂/M²)。λ で 1PN 全体を掛ける。
 */
export function biRelAccel({ GM, nu, c, x, y, vx, vy, lambda = 1 }) {
  const r = Math.hypot(x, y), nx = x / r, ny = y / r, v2 = vx * vx + vy * vy, rd = nx * vx + ny * vy;
  const k = GM / (r * r), p = lambda * k / (c * c);
  const An = (4 + 2 * nu) * GM / r - (1 + 3 * nu) * v2 + 1.5 * nu * rd * rd, Cv = (4 - 2 * nu) * rd;
  return { ax: -k * nx + p * (An * nx + Cv * vx), ay: -k * ny + p * (An * ny + Cv * vy),
    pnx: p * (An * nx + Cv * vx), pny: p * (An * ny + Cv * vy) };
}

// ---------------------------------------------------------------- ② PPN の N 体 1PN 運動方程式(全体の形)
/**
 * bodies: [{m,x,y,vx,vy,source?(既定 true),pinned?(既定 false)}]・o: {G,c,lambda=1,gamma=1,eps=0}
 *   a_a = Σ_{b∈S,b≠a} g_ab{1 + (λ/c²)[γv_a² + (1+γ)v_b² − 2(1+γ)v_a·v_b − (3/2)(n_ab·v_b)² − 2(1+γ)Φ_a − Φ_b + ½(x_b−x_a)·g_b]}
 *       + (λ/c²)Σ_b (Gm_b/r²)[n_ab·(2(1+γ)v_a − (1+2γ)v_b)](v_a−v_b) + (λ/c²)((3+4γ)/2)Σ_b Gm_b g_b/r_ab
 *   (β=1。g_ab=−Gm_b n_ab/r²・Φ_a=Σ_{c∈S,c≠a}Gm_c/r_ac・g_b=Σ_{c∈S,c≠b} g_bc —— 固定の源の g_b は 0。軟化は 1/r→1/√(r²+ε²)・n/r²→(x_a−x_b)/(r²+ε²)^{3/2}・
 *   (n·v)²→(d·v)²/(r²+ε²))。**ニュートン項も源だけの和**(源でない天体どうしの重力は含まない —— 照合用の 1PN 部分は pnx/pny)。
 */
export function eihAccel(bodies, o) {
  const G = o.G, c = o.c, lam = o.lambda === undefined ? 1 : o.lambda, gam = o.gamma === undefined ? 1 : o.gamma;
  const eps2 = (o.eps || 0) * (o.eps || 0), n = bodies.length, k2 = lam / (c * c);
  const src = bodies.map((b) => b.source !== false), pin = bodies.map((b) => !!b.pinned);
  const Wof = (a, b) => 1 / Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + eps2);
  const phi = new Array(n).fill(0), gN = bodies.map(() => [0, 0]);
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    if (i === j || !src[j]) continue;
    const W = Wof(bodies[i], bodies[j]), Gm = G * bodies[j].m;
    phi[i] += Gm * W;
    gN[i][0] -= Gm * W * W * W * (bodies[i].x - bodies[j].x); gN[i][1] -= Gm * W * W * W * (bodies[i].y - bodies[j].y);
  }
  const gb = gN.map((g, i) => (pin[i] ? [0, 0] : g));
  const out = [];
  for (let a = 0; a < n; a++) {
    const A = bodies[a];
    if (pin[a]) { out.push({ ax: 0, ay: 0, pnx: 0, pny: 0 }); continue; }
    let nx = 0, ny = 0, px = 0, py = 0;
    for (let b = 0; b < n; b++) {
      if (b === a || !src[b]) continue;
      const B = bodies[b], dx = A.x - B.x, dy = A.y - B.y, W = Wof(A, B), Gm = G * B.m, W3 = W * W * W;
      const gx = -Gm * W3 * dx, gy = -Gm * W3 * dy;
      nx += gx; ny += gy;
      const va2 = A.vx * A.vx + A.vy * A.vy, vb2 = B.vx * B.vx + B.vy * B.vy, vab = A.vx * B.vx + A.vy * B.vy;
      const dvb = dx * B.vx + dy * B.vy;
      const br = gam * va2 + (1 + gam) * vb2 - 2 * (1 + gam) * vab - 1.5 * dvb * dvb * W * W
        - 2 * (1 + gam) * phi[a] - phi[b] + 0.5 * (-(dx) * gb[b][0] - dy * gb[b][1]);
      const dn = dx * (2 * (1 + gam) * A.vx - (1 + 2 * gam) * B.vx) + dy * (2 * (1 + gam) * A.vy - (1 + 2 * gam) * B.vy);
      px += gx * br + Gm * W3 * dn * (A.vx - B.vx) + 0.5 * (3 + 4 * gam) * Gm * W * gb[b][0];
      py += gy * br + Gm * W3 * dn * (A.vy - B.vy) + 0.5 * (3 + 4 * gam) * Gm * W * gb[b][1];
    }
    out.push({ ax: nx + k2 * px, ay: ny + k2 * py, pnx: k2 * px, pny: k2 * py });
  }
  return out;
}

/**
 * 試験粒子形の 1PN(html の `_core` が core=1 で当てる分 —— 受け手の絶対速度・源ごとの U・反作用なし)の和。
 * lib-w282b-geo1 の `e12TestAccel`(html と同じ係数 cA=1+2α・cB=α−½)を源ごとに足す。α=γ+½。
 */
export function testFormSum(bodies, o) {
  const alpha = (o.gamma === undefined ? 1 : o.gamma) + 0.5;
  return bodies.map((A, a) => {
    let ax = 0, ay = 0;
    if (A.pinned) return { ax: 0, ay: 0 };
    bodies.forEach((B, b) => {
      if (b === a || B.source === false) return;
      const r = e12TestAccel({ G: o.G, c: o.c, lambda: o.lambda, alpha, eps: o.eps || 0, mj: B.m, dx: A.x - B.x, dy: A.y - B.y, wx: A.vx, wy: A.vy });
      ax += r.ax; ay += r.ay;
    });
    return { ax, ay };
  });
}

// ---------------------------------------------------------------- ③ PPN の N 体 1PN ラグランジアン(軟化なし)
/**
 * L = Σ_a m_a[½v_a² + v_a⁴/(8c²)] + ½Σ_{a≠b}(Gm_am_b/r_ab)[1 + ((2γ+1)/c²)v_a² − ((4γ+3)/(2c²))v_a·v_b − (1/(2c²))(n_ab·v_a)(n_ab·v_b)]
 *     − ((2β−1)/(2c²))Σ_a Σ_{b≠a} Σ_{c≠a} G²m_am_bm_c/(r_ab r_ac)
 * (β=1・γ=1 で EIH のラグランジアン)。全天体を源として扱う(照合用)。λ は 1/c² の項全体に掛ける。
 */
export function ppnLagrangian(bodies, o) {
  const G = o.G, k2 = (o.lambda === undefined ? 1 : o.lambda) / (o.c * o.c), gam = o.gamma === undefined ? 1 : o.gamma, beta = o.beta === undefined ? 1 : o.beta;
  const n = bodies.length; let L = 0;
  for (let a = 0; a < n; a++) { const A = bodies[a], v2 = A.vx * A.vx + A.vy * A.vy; L += A.m * (0.5 * v2 + k2 * v2 * v2 / 8); }
  for (let a = 0; a < n; a++) for (let b = 0; b < n; b++) {
    if (a === b) continue;
    const A = bodies[a], B = bodies[b], dx = A.x - B.x, dy = A.y - B.y, r = Math.hypot(dx, dy), nx = dx / r, ny = dy / r;
    const va2 = A.vx * A.vx + A.vy * A.vy, vab = A.vx * B.vx + A.vy * B.vy;
    L += 0.5 * (G * A.m * B.m / r) * (1 + k2 * ((2 * gam + 1) * va2 - 0.5 * (4 * gam + 3) * vab - 0.5 * (nx * A.vx + ny * A.vy) * (nx * B.vx + ny * B.vy)));
    for (let cc = 0; cc < n; cc++) {
      if (cc === a) continue;
      const C = bodies[cc], rac = Math.hypot(A.x - C.x, A.y - C.y);
      L -= 0.5 * (2 * beta - 1) * k2 * G * G * A.m * B.m * C.m / (r * rac);
    }
  }
  return L;
}
/** 正準運動量 p_a=∂L/∂v_a(解析式)。 */
export function ppnMomenta(bodies, o) {
  const G = o.G, k2 = (o.lambda === undefined ? 1 : o.lambda) / (o.c * o.c), gam = o.gamma === undefined ? 1 : o.gamma;
  return bodies.map((A, a) => {
    const v2 = A.vx * A.vx + A.vy * A.vy, f = A.m * (1 + k2 * v2 / 2);
    let px = f * A.vx, py = f * A.vy;
    bodies.forEach((B, b) => {
      if (a === b) return;
      const dx = A.x - B.x, dy = A.y - B.y, r = Math.hypot(dx, dy), nx = dx / r, ny = dy / r, K = G * A.m * B.m / r;
      const nvb = nx * B.vx + ny * B.vy;
      px += k2 * K * ((2 * gam + 1) * A.vx - 0.5 * (4 * gam + 3) * B.vx - 0.5 * nx * nvb);
      py += k2 * K * ((2 * gam + 1) * A.vy - 0.5 * (4 * gam + 3) * B.vy - 0.5 * ny * nvb);
    });
    return [px, py];
  });
}
/** 1PN のエネルギー E=Σ v_a·p_a − L と全運動量 P=Σp_a・角運動量 J=Σ x_a×p_a(保存量 —— Σm·v ではない)。 */
export function ppnConserved(bodies, o) {
  const p = ppnMomenta(bodies, o), L = ppnLagrangian(bodies, o);
  let E = -L, Px = 0, Py = 0, Jz = 0, Pnx = 0, Pny = 0, EN = 0;
  bodies.forEach((A, a) => { E += A.vx * p[a][0] + A.vy * p[a][1]; Px += p[a][0]; Py += p[a][1]; Jz += A.x * p[a][1] - A.y * p[a][0];
    Pnx += A.m * A.vx; Pny += A.m * A.vy; EN += 0.5 * A.m * (A.vx * A.vx + A.vy * A.vy); });
  for (let a = 0; a < bodies.length; a++) for (let b = a + 1; b < bodies.length; b++)
    EN -= o.G * bodies[a].m * bodies[b].m / Math.hypot(bodies[a].x - bodies[b].x, bodies[a].y - bodies[b].y);
  return { E, Px, Py, Jz, newton: { E: EN, Px: Pnx, Py: Pny } };
}
/**
 * Euler–Lagrange 方程式 d(∂L/∂v)/dt = ∂L/∂x を数値微分で解いた加速度(軟化なし・全天体が源・固定なし)。
 * dp_a/dt = Σ_b (∂p_a/∂x_b)v_b + Σ_b (∂p_a/∂v_b)a_b を 2N 元の連立で解く(中心差分 —— 刻みは相対 h)。
 */
export function elAccel(bodies, o, h = 1e-6) {
  const n = bodies.length, N = 2 * n;
  const clone = () => bodies.map((b) => Object.assign({}, b));
  const flatP = (bs) => ppnMomenta(bs, o).flat();
  const keys = ['x', 'y'], vkeys = ['vx', 'vy'];
  const M = Array.from({ length: N }, () => new Array(N).fill(0)), rhs = new Array(N).fill(0);
  // ∂L/∂x_a
  for (let a = 0; a < n; a++) for (let k = 0; k < 2; k++) {
    const s = h * Math.max(1, Math.abs(bodies[a][keys[k]]));
    const bp = clone(), bm = clone(); bp[a][keys[k]] += s; bm[a][keys[k]] -= s;
    rhs[2 * a + k] = (ppnLagrangian(bp, o) - ppnLagrangian(bm, o)) / (2 * s);
  }
  // Σ_b (∂p/∂x_b) v_b と ∂p/∂v_b
  for (let b = 0; b < n; b++) for (let k = 0; k < 2; k++) {
    const sx = h * Math.max(1, Math.abs(bodies[b][keys[k]]));
    const bp = clone(), bm = clone(); bp[b][keys[k]] += sx; bm[b][keys[k]] -= sx;
    const Pp = flatP(bp), Pm = flatP(bm), dp = Pp.map((v, i) => (v - Pm[i]) / (2 * sx));
    for (let i = 0; i < N; i++) rhs[i] -= dp[i] * bodies[b][vkeys[k]];
    const sv = h * Math.max(1, Math.abs(bodies[b][vkeys[k]]));
    const cp = clone(), cm = clone(); cp[b][vkeys[k]] += sv; cm[b][vkeys[k]] -= sv;
    const P1 = flatP(cp), P0 = flatP(cm);
    for (let i = 0; i < N; i++) M[i][2 * b + k] = (P1[i] - P0[i]) / (2 * sv);
  }
  // ガウスの消去(部分ピボット)
  const A = M.map((row, i) => row.concat([rhs[i]]));
  for (let col = 0; col < N; col++) {
    let piv = col; for (let r = col + 1; r < N; r++) if (Math.abs(A[r][col]) > Math.abs(A[piv][col])) piv = r;
    [A[col], A[piv]] = [A[piv], A[col]];
    for (let r = 0; r < N; r++) { if (r === col) continue; const f = A[r][col] / A[col][col]; for (let cc = col; cc <= N; cc++) A[r][cc] -= f * A[col][cc]; }
  }
  const acc = A.map((row, i) => row[N] / row[i]);
  return bodies.map((b, a) => ({ ax: acc[2 * a], ay: acc[2 * a + 1] }));
}

// ---------------------------------------------------------------- ④ 相対二体 1PN の積分(RK4)と近点
/**
 * 相対二体の 1PN 常微分方程式(law: 'eih' = Blanchet & Iyer・'geo2' = 旧 kF0 則の還元・'test' = 試験粒子)を RK4 で積分し、
 * ṙ の −→+ 交差を 3 次補間で拾って近点角の 1 周あたりの前進(deg)を返す。遠点整列(x=a(1+e)・y 方向の速度)から出発する。
 * 返り値の advDeg は「λ の 1PN」を入れた軌道の近点角の直線 fit(近点番号に対する傾き)。
 */
export function relOrbitAdvance({ GM, nu, c, a, e, orbits = 8, stepsPerOrbit = 20000, law = 'eih', lambda = 1 }) {
  const q = relCoefficients(law, nu);
  const acc = (s) => {
    const r = Math.hypot(s[0], s[1]), nx = s[0] / r, ny = s[1] / r, v2 = s[2] * s[2] + s[3] * s[3], rd = nx * s[2] + ny * s[3];
    const k = GM / (r * r), p = lambda * k / (c * c);
    const An = q.A * GM / r + q.B * v2 + q.D * rd * rd;
    return [s[2], s[3], -k * nx + p * (An * nx + q.C * rd * s[2]), -k * ny + p * (An * ny + q.C * rd * s[3])];
  };
  const P = 2 * Math.PI * Math.sqrt(a * a * a / GM), h = P / stepsPerOrbit;
  let s = [a * (1 + e), 0, 0, Math.sqrt(GM * (1 - e) / (a * (1 + e)))];
  const peri = []; let prevRd = null, prev = s, t = 0;
  const rdOf = (z) => (z[0] * z[2] + z[1] * z[3]) / Math.hypot(z[0], z[1]);
  for (let k = 0; peri.length < orbits + 1 && k < stepsPerOrbit * (orbits + 3); k++) {
    const k1 = acc(s), s2 = s.map((v, i) => v + 0.5 * h * k1[i]), k2 = acc(s2), s3 = s.map((v, i) => v + 0.5 * h * k2[i]),
      k3 = acc(s3), s4 = s.map((v, i) => v + h * k3[i]), k4 = acc(s4);
    const nxt = s.map((v, i) => v + h / 6 * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
    const rd0 = rdOf(s), rd1 = rdOf(nxt);
    if (prevRd !== null && rd0 < 0 && rd1 >= 0) {
      const fr = -rd0 / (rd1 - rd0);   // 線形補間の比で角も補間(刻みが細かいので十分)
      let a0 = Math.atan2(s[1], s[0]), a1 = Math.atan2(nxt[1], nxt[0]);
      while (a1 - a0 > Math.PI) a1 -= 2 * Math.PI; while (a1 - a0 < -Math.PI) a1 += 2 * Math.PI;
      peri.push({ t: t + fr * h, ang: a0 + fr * (a1 - a0) });
    }
    prevRd = rd1; prev = s; s = nxt; t += h;
  }
  const ang = []; for (let i = 0; i < peri.length; i++) { let v = peri[i].ang; if (i) { while (v - ang[i - 1] > Math.PI) v -= 2 * Math.PI; while (v - ang[i - 1] < -Math.PI) v += 2 * Math.PI; } ang.push(v); }
  const m = ang.length, mx = (m - 1) / 2, my = ang.reduce((x, y) => x + y, 0) / m;
  let sxy = 0, sxx = 0; for (let i = 0; i < m; i++) { sxy += (i - mx) * (ang[i] - my); sxx += (i - mx) * (i - mx); }
  return { advDeg: (sxy / sxx) * 180 / Math.PI, nPeri: m, stepsPerOrbit, law, nu, lambda };
}

// ---------------------------------------------------------------- ⑤ 解析の比
/** Δϖ/Δϖ_GR の解析(旧 kF0 則 = 'geo2' の 1−10ν/3・EIH = 1・PPN γ では (1+2γ)/3 —— β=1)。 */
export function analyticRatio(law, nu, gamma = 1) {
  if (law === 'eihPPN') return (1 + 2 * gamma) / 3;
  return advanceRatio(law, nu);
}

/** html の `GEO_MODE_VERSION`(第285便b —— core 表 [0,1,2]・kF0 の 1PN を EIH 型へ)と `PN1_EIH_VERSION` */
export const HTML_GEO_MODE_VERSION_W285B = 'w285b-geomode-2';
// 第291便b(R133): html の PN1_EIH_VERSION は w291b-eih-2(式は不変・kF0 の源集合を全質量源へ)—— 正本 pn1-w285b.json は鎖の再生成で追いつく
export const HTML_PN1_EIH_VERSION = 'w291b-eih-2';
/** 第285便b の core 表(geoPN 0/1/2 → `S._core` へ渡す番号)。kF0〔λ_PN=1∧kFrame=0〕は 1 + EIH の差分・DFM〔kFrame>0〕は 2 */
export const CORE_TABLE_W285B = [0, 1, 2];

/**
 * QA `behavior.geo1Momentum`・`docs.geo1Contract` の**新しい記録**(第285便b の器の実測 —— 門ではない。値が動いたら気づくため)。
 * 自由二体(lib-w282b-geo1 の `freeTwoBody()` —— m=2/1・距離 10・静止・両体 pnSource・c=10・ε=0.001)の 1 歩の Σm·vx と各体の vx。
 * kF0 の役割(geoPN=1・互換の geoPN=2∧kFrame=0・lawVersion の無い 3 を 2 へ丸めたもの)は EIH 型なので **Σm·vx ≠ 0**:
 * 静止した二体の EIH の 1PN 加速度の Σm·a は −2.0×10⁻⁵(参照実装 `eihAccel` の Σm·a·dt と相対 10⁻¹⁵ で一致 —— 保存するのは 1PN の
 * 運動量 Σ∂L/∂v であって Σm·v ではない)。g0・g3toy・g3vmu・newton は第283便a の記録のまま。
 */
export const PN1_MOMENTUM_RECORD_W285B = {
  dts: [0.001, 0.0005],
  px: { g0: [0, 0], g1: [-1.9999999499999648e-8, -9.999999749999824e-9], g2: [-1.9999999499999648e-8, -9.999999749999824e-9],
    g3raw: [-1.9999999499999648e-8, -9.999999749999824e-9], g3toy: [-9.956709874387677e-7, -4.978354893540471e-7], g3vmu: [0, 0], newton: [0, 0] },
  vx: { g1: [[0.000009859999852899997, -0.000019739999705299993], [0.000004929999926449999, -0.000009869999852649998]] },
  kf0Laws: ['g1', 'g2', 'g3raw'],
  previousW283A: { g1: [0, 0] },
  note: '第285便b: kF0 の役割は EIH 型(反作用は式に内在)—— Σm·vx は 0 でない(1PN の運動量が保存量)。g2・g3raw は kFrame=0 の互換入力なので g1 とビット同一',
};

/**
 * PHYSICS〔第285便b〕に**そのまま載っているべき数**(QA `docs.pn1` —— 正本の値から同じ書式で作る)。
 * @param {object} J 正本 pn1-w285b.json
 */
export function physicsNumbers(J) {
  const out = [];
  const A = J.A.summary;
  out.push(A.reproBase.q1e4.toFixed(4), A.reproBase.q1.toFixed(4), A.now.q1e4.toFixed(5), A.now.q1.toFixed(5));
  out.push(J.A.rows.find((z) => z.q === 1).grDeg.toFixed(6));
  out.push(fmtSci(J.B.maxRel, 2), fmtFix(J.C.slope[1], 2));
  const E = (id) => J.E.rows.find((z) => z.id === id);
  for (const id of ['psrDoubleABDFM', 'psrJ1757DFM', 'psrB1534']) { const r = E(id); if (r && r.ratioNow !== null) out.push(r.ratioBase.toFixed(4), r.ratioNow.toFixed(4)); }
  const F = J.F.summary;
  out.push(fmtSci(F.base005, 3), fmtSci(F.base001, 3), fmtSci(F.base001h2, 3), fmtSci(J.F.grid[0].incB, 5), fmtSci(J.F.grid[0].softAnalytic, 3));
  out.push(fmtFix(F.deficitFormal * 100, 1) + '%', fmtFix(F.deficitSmall * 100, 1) + '%', fmtFix(J.F.analytic.cRoundingRel * 100, 3) + '%');
  out.push(`${J.G.bitSame128}/${J.G.n}`);
  return out;
}
/** 固定小数の本文の形(負号は U+2212) */
export function fmtFix(x, n) { return (x < 0 ? '−' : '') + Math.abs(x).toFixed(n); }
/** 指数表記を本文の形へ(例 −6.200e−6 → "−6.200×10⁻⁶") */
export function fmtSci(x, d = 3) {
  if (x === 0) return '0';
  const [m, e] = Math.abs(Number(x)).toExponential(d).split('e');
  const sup = String(Number(e)).split('').map((ch) => (ch === '-' ? '⁻' : '⁰¹²³⁴⁵⁶⁷⁸⁹'[+ch])).join('');
  return (x < 0 ? '−' : '') + m + '×10' + sup;
}

/** 書かない語(PHYSICS〔第285便b〕と正本の本文 —— doNotWrite 欄そのものは除く) */
export const FORBIDDEN_W285B = ['λ_PN=1 で既に 1PN と合った', '不足は DFM の新現象', '観測一致を達成', '較正を完了', 'f=1 で合った',
  'kF0 版が成立', '精度を上げれば成立', '新発見', '判定が増えた', 'RC を切った'];

/** 相対差(0 同士は 0) */
export function relErr(a, b) {
  if (a === b) return 0;
  const s = Math.max(Math.abs(a), Math.abs(b));
  return s > 0 ? Math.abs(a - b) / s : 0;
}
