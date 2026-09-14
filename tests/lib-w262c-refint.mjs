// 第262便c(第54報 W3)「門(4) の独立推定 — エンジンの外の参照積分器」の**純関数**ライブラリ。
//
// ■ 何のためにあるか(統括の読み (D)・統括が設定した検証仮説 (6))
//   `HP.dfmForecastGate` の門(4) は「段ずらし Richardson を**独立推定**(別積分法/別抽出法)と
//   照合する」ことを求める。〔第261便c〕はその独立推定を**1 つも持っていなかった**ので、
//   NS 4 系は門(4) で落ちていた。本 lib は **同じ力・別の積分法**(古典 RK4・Float64)を
//   エンジンの外に置く —— **別の理論の式を解いた値を門(4) に入れない**(検証仮説 (6))。
//
// ■ 何を実装しているか
//   (1) `forceDfmE12kF0` —— **エンジンの kFrame=0・geoPN=2 経路と同じ式**(beta/index.html の
//       `S._core` 対ループを 2 体に落としたもの。E4 ソフトニング重力 + E12 測地線 1PN + 対反作用)。
//   (2) `forceRelative1PN` —— **標準二体相対 1PN**(Blanchet Living Rev. §9.3 の調和座標 EIH)。
//       **対照専用**である。門(4) には入れない(検証仮説 (6))。
//   (3) `forceNewtonSoft` —— ソフトニング付きニュートン(数値床の対照)。
//   (4) `rk4` / `runReference` —— 古典 RK4(Float64・固定刻み)と、近点抽出器を流す走行。
//
// ■ 書かないこと
//   本 lib の値は **DFM の予測ではない**。(1) は「エンジンと同じ式を別の積分法で解いた値」で、
//   (2) は「別の式を解いた値」である。**(2) で (1) を置換しない**(置換するなら明示キー+署名便)。
//   kFrame=1 の DFM 全経路は **ODE ではない**(Δv=k_F·(u_n−u_{n−1}) は前步の u との差分であって
//   右辺ではない)ので、本 lib には kFrame=1 の力が**無い** —— 作れなかったことを表に書く。

// ---- 力の共通契約 -------------------------------------------------------------------
// state z = [x0,y0,x1,y1, vx0,vy0,vx1,vy1](2 体・重心系)。返り値は [ax0,ay0,ax1,ay1]。
// sys = { G, eps, m:[m0,m1], invC2, cA, cB, pnSource:[0|1,0|1] }

// (1) エンジンの kFrame=0・geoPN=2 経路(E4+E12+対反作用)
//     a₁ₚₙ = (λ/c²)[((α−½)|w|² − (1+2α)U_src)∇U − (1+2α)(∇U·w)w] , kFrame=0 では w=v
//     反作用: geoPN=2 は ∇U_j 因子の対反作用を源 j へ返す(a_j −= a₁ₚₙ,i·m_i/m_j)
export function forceDfmE12kF0(sy, z) {
  const m0 = sy.m[0], m1 = sy.m[1], G = sy.G, eps2 = sy.eps * sy.eps;
  const dx = z[0] - z[2], dy = z[1] - z[3];
  const d2 = dx * dx + dy * dy;
  const invW = 1 / Math.sqrt(d2 + eps2);
  const invd3 = invW * invW * invW;
  const fg = G * invd3;
  let a0x = -fg * m1 * dx, a0y = -fg * m1 * dy;
  let a1x = fg * m0 * dx, a1y = fg * m0 * dy;
  const invC2 = sy.invC2, cA = sy.cA, cB = sy.cB;
  if (invC2 > 0) {
    // i=0(源は 1)
    if (sy.pnSource[1]) {
      const U1 = G * m1 * invW, gux = -fg * m1 * dx, guy = -fg * m1 * dy;
      const wx = z[4], wy = z[5];
      const v2 = wx * wx + wy * wy, dU = gux * wx + guy * wy;
      const pnx = invC2 * ((cB * v2 - cA * U1) * gux - cA * dU * wx);
      const pny = invC2 * ((cB * v2 - cA * U1) * guy - cA * dU * wy);
      a0x += pnx; a0y += pny;
      a1x -= pnx * m0 / m1; a1y -= pny * m0 / m1;       // 対反作用(geo2 かつ源が pinned でない)
    }
    // j=1(源は 0)
    if (sy.pnSource[0]) {
      const U0 = G * m0 * invW, gux = fg * m0 * dx, guy = fg * m0 * dy;
      const wx = z[6], wy = z[7];
      const v2 = wx * wx + wy * wy, dU = gux * wx + guy * wy;
      const pnx = invC2 * ((cB * v2 - cA * U0) * gux - cA * dU * wx);
      const pny = invC2 * ((cB * v2 - cA * U0) * guy - cA * dU * wy);
      a1x += pnx; a1y += pny;
      a0x -= pnx * m1 / m0; a0y -= pny * m1 / m0;
    }
  }
  return [a0x, a0y, a1x, a1y];
}

// (3) ソフトニング付きニュートン(数値床の対照 —— ε による近点の**逆行**がここに出る)
export function forceNewtonSoft(sy, z) {
  const m0 = sy.m[0], m1 = sy.m[1], G = sy.G, eps2 = sy.eps * sy.eps;
  const dx = z[0] - z[2], dy = z[1] - z[3];
  const invW = 1 / Math.sqrt(dx * dx + dy * dy + eps2);
  const fg = G * invW * invW * invW;
  return [-fg * m1 * dx, -fg * m1 * dy, fg * m0 * dx, fg * m0 * dy];
}

// (2) 標準二体相対 1PN(Blanchet §9.3・調和座標)—— **対照専用**。
//     a = −Gm/r² n + Gm/(c²r²)[((4+2ν)Gm/r − (1+3ν)v² + (3/2)ν ṙ²) n + (4−2ν) ṙ v]
//     n=r/r(r = x_A − x_B)・v = v_A − v_B・ṙ = (r·v)/r・m=m_A+m_B・ν=m_A m_B/m²
//     ニュートン項だけ **同じソフトニング ε** を掛ける(比較の土俵を揃えるため・宣言)。
//     相対加速度を質量比で 2 体へ配る(重心は動かない)。
export function forceRelative1PN(sy, z) {
  const m0 = sy.m[0], m1 = sy.m[1], G = sy.G, eps2 = sy.eps * sy.eps;
  const M = m0 + m1, nu = m0 * m1 / (M * M), GM = G * M;
  const rx = z[0] - z[2], ry = z[1] - z[3];
  const vx = z[4] - z[6], vy = z[5] - z[7];
  const r2 = rx * rx + ry * ry, r = Math.sqrt(r2);
  const invSoft = 1 / Math.sqrt(r2 + eps2);
  const newt = -GM * invSoft * invSoft * invSoft;         // ニュートン項(ソフトニング付き)
  let ax = newt * rx, ay = newt * ry;
  if (sy.invC2 > 0) {
    const nx = rx / r, ny = ry / r;
    const v2 = vx * vx + vy * vy, rdot = (rx * vx + ry * vy) / r;
    const A = (4 + 2 * nu) * GM / r - (1 + 3 * nu) * v2 + 1.5 * nu * rdot * rdot;
    const B = (4 - 2 * nu) * rdot;
    const pre = sy.invC2 * GM / r2;                        // invC2 = λ/c²
    ax += pre * (A * nx + B * vx);
    ay += pre * (A * ny + B * vy);
  }
  // 相対加速度 → 各体(重心固定): a_A = (m_B/M) a_rel, a_B = −(m_A/M) a_rel
  return [ax * m1 / M, ay * m1 / M, -ax * m0 / M, -ay * m0 / M];
}

// ---- 古典 RK4(Float64・固定刻み)------------------------------------------------------
export function rk4Step(force, sy, z, dt) {
  const d = (s) => {
    const a = force(sy, s);
    return [s[4], s[5], s[6], s[7], a[0], a[1], a[2], a[3]];
  };
  const k1 = d(z);
  const z2 = z.map((v, i) => v + 0.5 * dt * k1[i]); const k2 = d(z2);
  const z3 = z.map((v, i) => v + 0.5 * dt * k2[i]); const k3 = d(z3);
  const z4 = z.map((v, i) => v + dt * k3[i]); const k4 = d(z4);
  const o = new Array(8);
  for (let i = 0; i < 8; i++) o[i] = z[i] + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]);
  return o;
}

// 走行 + 近点抽出(検出器は `tests/lib-precision-diagnostics.mjs` の**同じ実装**を渡す)。
//   detFactory() は createPeriastronDetector({phaseGate:…}) を返す関数。
//   window 個の近点が採れたら止める。maxSteps / budgetMs で必ず止まる。
export function runReference(opts) {
  const { force, sy, z0, dt, window: win, detFactory, maxSteps, budgetMs } = opts;
  let z = z0.slice();
  const det = detFactory();
  const t0 = Date.now();
  let k = 0, stopped = 'window', accepted = 0;
  const lim = Number.isFinite(maxSteps) ? maxSteps : 4e8;
  for (; k < lim; k++) {
    z = rk4Step(force, sy, z, dt);
    const dx = z[0] - z[2], dy = z[1] - z[3];
    const rr = Math.hypot(dx, dy), th = Math.atan2(dy, dx);
    const dvx = z[4] - z[6], dvy = z[5] - z[7];
    const rd = (rr > 0) ? (dx * dvx + dy * dvy) / rr : 0;
    const a = det.push(k, rr, rd, th);
    if (a.accepted) accepted++;
    if (accepted >= win) break;
    if (!Number.isFinite(z[0]) || !Number.isFinite(z[4])) { stopped = 'nan'; break; }
    if ((k & 65535) === 0 && Number.isFinite(budgetMs) && (Date.now() - t0) > budgetMs) { stopped = 'time-budget'; break; }
  }
  if (k >= lim) stopped = 'max-steps';
  const res = det.result(win);
  const n = Math.min(res.nPeri, win);
  const full = (res.nPeri >= win) && !res.unwrapFailed;
  const peri = res.peri.slice(0, n), ang = res.ang.slice(0, n);
  const perMean = full ? (peri[win - 1].k - peri[0].k) * dt / (win - 1) : null;
  // 近点方位の回帰(x=時刻・y=unwrap 済み方位)。**エンジン側の器と同じ作り方**である。
  let slopePerTime = null, se = null;
  if (ang.length >= 3) {
    const tim = ang.map((_, i) => peri[i].k * dt);
    const mt = tim.reduce((a2, b) => a2 + b, 0) / tim.length;
    const ma = ang.reduce((a2, b) => a2 + b, 0) / ang.length;
    let sxy = 0, sxx = 0;
    for (let i = 0; i < ang.length; i++) { sxy += (tim[i] - mt) * (ang[i] - ma); sxx += (tim[i] - mt) ** 2; }
    if (sxx > 0) {
      slopePerTime = sxy / sxx;
      se = Math.sqrt(ang.reduce((s, y, i) => s + (y - (ma + slopePerTime * (tim[i] - mt))) ** 2, 0)
        / Math.max(1, ang.length - 2) / sxx);
    }
  }
  return { steps: k, stopped, dt, measured: full && res.measured, nPeri: res.nPeri,
    candidates: res.candidates, rejectedCount: res.rejectedCount, unwrapFailed: res.unwrapFailed,
    measurementMethod: res.measurementMethod,
    perMeanSim: perMean, slopeRadPerSimTime: slopePerTime, seRadPerSimTime: se,
    periStartSim: peri.length ? peri[0].k * dt : null,
    periEndSim: full ? peri[win - 1].k * dt : null,
    wallSec: (Date.now() - t0) / 1000 };
}

// 段ずらし Richardson(器のあいだで式を 1 つにするためここに置く)
export function pObs(q1, q2, q4) {
  const a = q1 - q2, b = q2 - q4;
  if (![a, b].every(Number.isFinite) || b === 0) return null;
  const r = a / b;
  return (r > 0) ? Math.log2(r) : null;
}
export function richardson(qC, qF, order, ratio = 2) {
  if (![qC, qF].every(Number.isFinite) || !Number.isFinite(order) || !(order > 0)) return null;
  return qF + (qF - qC) / (Math.pow(ratio, order) - 1);
}
export function shiftedRichardson(values) {
  const tri = [];
  for (let i = 0; i + 2 < values.length; i++) {
    const p = pObs(values[i], values[i + 1], values[i + 2]);
    tri.push({ p, yInf: richardson(values[i + 1], values[i + 2], p) });
  }
  const ext = tri.map((z) => z.yInf).filter(Number.isFinite);
  return { triples: tri, extrapolations: ext,
    yInf: ext.length ? ext[ext.length - 1] : null,
    spread: (ext.length >= 2) ? Math.abs(ext[ext.length - 1] - ext[ext.length - 2]) : null };
}
