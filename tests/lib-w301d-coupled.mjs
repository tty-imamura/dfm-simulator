// 第301便d(原仮定者の裁定(第91報)④・統括の検証項目 R182)—— **結合積分の独立な器**(純関数・本体の積分器は変えない —— 比較の基準)。
//
// ■ 何をするか
//   🔗 chainDiskToy の型(二次元 —— 三次元の本は z を足した同じ式・中心 pinned・重力は軟化つきニュートン〔E4 の核〕・慣性決定力の引きずり〔合成則 solve・自転源の表裏核〕)の
//   運動方程式を**一つの常微分方程式**として書き、同じ段の位置で引きずりを引き直して解く:
//       ṙ_i = v_i + u_i(r, v)        v̇_i = a_i(r) = G Σ_j m_j (r_j − r_i)/(|r_ij|² + ε_g²)^{3/2}
//       (1 + deg_i) u_i − Σ_j a_ij u_j = s_i,  a_ij = C m_j K_ε(r_ij),  K_ε(r) = r/(r² + ε²)²,  deg_i = Σ_j a_ij
//       s_i = Σ_j a_ij (v_j − v_i) + C m_j Ω_j M1(r_ij)/r_ij (â_j × (r_i − r_j))(自転源の表裏核 —— 宣言した源だけ・二次元は â = ẑ)
//   pinned の粒子は u = 0・v = 0・位置固定(源にはなる)。u は**各段で**解き直す(直接法 —— ガウス消去・対角優位でピボットなし)。
//   帳簿: E = K + U(K = Σ ½ m v²・U = −Σ G m_i m_j/√(r² + ε_g²))、引きずりの仕事 Ẇ = Σ ∇_i U · u_i = −Σ m_i a_i·u_i
//   を同じ常微分方程式の成分として積む —— 厳密解では E(t) − E(0) − W(t) = 0(重力の仕事 = ΔK・v の移動に沿う ΔU = −ΔK)。
//
// ■ 方式
//   'split'(本体の分割の写し —— 器の検証用): v += h a(r) → r += h v → r += h u(r, v)(u は移動の後の位置と新しい v で解く)。
//            帳簿は本体と同じ: 移送の ΔU を W に・キックの ΔK とドリフトの ΔU を別に積む(その和が分割の残差)。
//   'rk2'  : 中点法(2 段)。'rk4': 古典 4 段 —— 各段で u を解き直す。
//
// ■ 言わないこと: 本体の積分器の置換ではない(本便では本体を変えない)。この器の数は「同じ式を別の時間積分で解いた」比較の値。
export const COUPLED_LIB_VERSION = 'w301d-coupled-1';

/** 本の宣言(validatePreset 済み・build 済みの sim から)を純データへ。spinMoment は html の inertialSpinMoment(r,R,ε,gl)、gl はその節点。
 *  三次元の本(S.coord3d)は z・v_z と源の軸 â(S.sax/say/saz)を読む。二次元の本は z = 0・â = ẑ(加える項は厳密に 0 —— 二次元の演算列と同じ値)。 */
export function systemFromSim(S, spinMoment, gl) {
  const n = S.n, rd = S.relDrag || {}, d3 = S.coord3d === true;
  const sd = rd.spinDrag || null, spinOn = (sd ? sd.rot === 'surfaceFlip' : rd.spinSource === 'surfaceFlip');
  if (sd && sd.axial === 'on') throw new Error('lib-w301d-coupled: 軸引きずり(spinDrag.axial)の本は扱わない');
  const Z = (A) => (d3 && A) ? Float64Array.from(A.subarray(0, n)) : new Float64Array(n);
  const sys = {
    n, d3, G: S.params.G, eg2: (S.params.softening || 0) ** 2, C: rd.gain || 0, eps: (rd.eps !== undefined) ? rd.eps : (S.params.softening || 0),
    m: Float64Array.from(S.m.subarray(0, n)), pin: Uint8Array.from(S.pinned.subarray(0, n)),
    spin: Float64Array.from(S.spin.subarray(0, n)), R: Float64Array.from((S.radOv || new Float64Array(n)).subarray(0, n)),
    ax: Z(S.sax), ay: Z(S.say), az: d3 && S.saz ? Float64Array.from(S.saz.subarray(0, n)) : new Float64Array(n).fill(1),
    spinOn, spinMoment, gl,
  };
  const st = { x: Float64Array.from(S.x.subarray(0, n)), y: Float64Array.from(S.y.subarray(0, n)), z: Z(S.z),
    vx: Float64Array.from(S.vx.subarray(0, n)), vy: Float64Array.from(S.vy.subarray(0, n)), vz: Z(S.vz), W: 0, t: S.t };
  return { sys, st };
}

export function accel(sys, x, y, z, ax, ay, az) {
  const n = sys.n, G = sys.G, e2 = sys.eg2, m = sys.m, pin = sys.pin;
  for (let i = 0; i < n; i++) {
    let sx = 0, sy = 0, sz = 0;
    if (!pin[i]) for (let j = 0; j < n; j++) { if (j === i) continue; const dx = x[j] - x[i], dy = y[j] - y[i], dz = z[j] - z[i], r2 = dx * dx + dy * dy + dz * dz + e2, f = G * m[j] / (r2 * Math.sqrt(r2)); sx += f * dx; sy += f * dy; sz += f * dz; }
    ax[i] = sx; ay[i] = sy; az[i] = sz;
  }
}
export function potential(sys, x, y, z) {
  const n = sys.n, G = sys.G, e2 = sys.eg2, m = sys.m; let U = 0;
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { const dx = x[j] - x[i], dy = y[j] - y[i], dz = z[j] - z[i]; U -= G * m[i] * m[j] / Math.sqrt(dx * dx + dy * dy + dz * dz + e2); }
  return U;
}
export function kinetic(sys, vx, vy, vz) { let K = 0; for (let i = 0; i < sys.n; i++) K += 0.5 * sys.m[i] * (vx[i] * vx[i] + vy[i] * vy[i] + vz[i] * vz[i]); return K; }

/** u(r, v) —— (I+L)u = s を直接法で解く(3 成分を同じ行列で)。ws は作業配列(makeWork)。戻り値 {degMax}。 */
export function makeWork(n) { return { A: new Float64Array(n * n), M: new Float64Array(n * n), sx: new Float64Array(n), sy: new Float64Array(n), sz: new Float64Array(n), dg: new Float64Array(n),
  ax: new Float64Array(n), ay: new Float64Array(n), az: new Float64Array(n) }; }
export function uSolve(sys, x, y, z, vx, vy, vz, ux, uy, uz, ws) {
  const n = sys.n, C = sys.C, e2 = sys.eps * sys.eps, m = sys.m, pin = sys.pin, A = ws.A, M = ws.M, sx = ws.sx, sy = ws.sy, sz = ws.sz, dg = ws.dg;
  let degMax = 0;
  for (let i = 0; i < n; i++) {
    let s1 = 0, s2 = 0, s3 = 0, d = 0; const row = i * n;
    for (let j = 0; j < n; j++) {
      A[row + j] = 0; if (j === i || !(m[j] > 0)) continue;
      const dx = x[j] - x[i], dy = y[j] - y[i], dz = z[j] - z[i], r2 = dx * dx + dy * dy + dz * dz, r = Math.sqrt(r2), q = r2 + e2, a = C * m[j] * (r / (q * q));
      A[row + j] = a; s1 += a * (vx[j] - vx[i]); s2 += a * (vy[j] - vy[i]); s3 += a * (vz[j] - vz[i]); d += a;
    }
    sx[i] = s1; sy[i] = s2; sz[i] = s3; dg[i] = d; if (!pin[i] && d > degMax) degMax = d;
  }
  if (sys.spinOn) for (let j = 0; j < n; j++) {
    const Om = sys.spin[j], R = sys.R[j]; if (Om === 0 || !(R > 0) || !(m[j] > 0)) continue;
    const ax = sys.ax[j], ay = sys.ay[j], az = sys.az[j];
    for (let i = 0; i < n; i++) { if (i === j || !(m[i] > 0)) continue; const dx = x[i] - x[j], dy = y[i] - y[j], dz = z[i] - z[j], r = Math.sqrt(dx * dx + dy * dy + dz * dz);
      const M1 = sys.spinMoment(r, R, sys.eps, sys.gl); if (M1 === null) continue; const f = C * m[j] * Om * M1 / r;
      sx[i] += f * (ay * dz - az * dy); sy[i] += f * (az * dx - ax * dz); sz[i] += f * (ax * dy - ay * dx); }
  }
  // 行列 M = I + diag(deg) − A(受け取らない行は単位行・右辺 0)
  for (let i = 0; i < n; i++) { const row = i * n; const fx = pin[i] || !(m[i] > 0);
    for (let j = 0; j < n; j++) M[row + j] = fx ? 0 : -A[row + j]; M[row + i] = fx ? 1 : 1 + dg[i]; ux[i] = fx ? 0 : sx[i]; uy[i] = fx ? 0 : sy[i]; uz[i] = fx ? 0 : sz[i]; }
  for (let k = 0; k < n; k++) { const pk = M[k * n + k];
    for (let i = k + 1; i < n; i++) { const f = M[i * n + k] / pk; if (f === 0) continue; for (let j = k + 1; j < n; j++) M[i * n + j] -= f * M[k * n + j]; ux[i] -= f * ux[k]; uy[i] -= f * uy[k]; uz[i] -= f * uz[k]; } }
  for (let i = n - 1; i >= 0; i--) { let s1 = ux[i], s2 = uy[i], s3 = uz[i]; for (let j = i + 1; j < n; j++) { s1 -= M[i * n + j] * ux[j]; s2 -= M[i * n + j] * uy[j]; s3 -= M[i * n + j] * uz[j]; }
    const d = M[i * n + i]; ux[i] = s1 / d; uy[i] = s2 / d; uz[i] = s3 / d; }
  return { degMax };
}

/** 右辺 f(r, v) = (v + u, a, Ẇ)。 */
function rhs(sys, x, y, z, vx, vy, vz, out, ws) {
  const n = sys.n; uSolve(sys, x, y, z, vx, vy, vz, out.ux, out.uy, out.uz, ws); accel(sys, x, y, z, out.ax, out.ay, out.az);
  let dW = 0;
  for (let i = 0; i < n; i++) { if (sys.pin[i]) { out.dx[i] = 0; out.dy[i] = 0; out.dz[i] = 0; out.ux[i] = 0; out.uy[i] = 0; out.uz[i] = 0; continue; }
    out.dx[i] = vx[i] + out.ux[i]; out.dy[i] = vy[i] + out.uy[i]; out.dz[i] = vz[i] + out.uz[i];
    dW -= sys.m[i] * (out.ax[i] * out.ux[i] + out.ay[i] * out.uy[i] + out.az[i] * out.uz[i]); }
  out.dW = dW; return out;
}
const F = (n) => new Float64Array(n);
const mkK = (n) => ({ dx: F(n), dy: F(n), dz: F(n), ax: F(n), ay: F(n), az: F(n), ux: F(n), uy: F(n), uz: F(n), dW: 0 });

export function makeIntegrator(sys, scheme) {
  const n = sys.n, ws = makeWork(n), k = [mkK(n), mkK(n), mkK(n), mkK(n)];
  const tx = F(n), ty = F(n), tz = F(n), tvx = F(n), tvy = F(n), tvz = F(n);
  const led = { kickK: 0, driftU: 0, transportU: 0 };   // split の帳簿(本体と同じ分け方)
  const stage = (st, kk, c, h) => { for (let i = 0; i < n; i++) { tx[i] = st.x[i] + c * h * kk.dx[i]; ty[i] = st.y[i] + c * h * kk.dy[i]; tz[i] = st.z[i] + c * h * kk.dz[i];
    tvx[i] = st.vx[i] + c * h * kk.ax[i]; tvy[i] = st.vy[i] + c * h * kk.ay[i]; tvz[i] = st.vz[i] + c * h * kk.az[i]; } };
  const pinFix = (st) => { for (let i = 0; i < n; i++) if (sys.pin[i]) { st.vx[i] = 0; st.vy[i] = 0; st.vz[i] = 0; } };
  const step = (st, h) => {
    if (scheme === 'split') {
      const K0 = kinetic(sys, st.vx, st.vy, st.vz), U0 = potential(sys, st.x, st.y, st.z);
      accel(sys, st.x, st.y, st.z, ws.ax, ws.ay, ws.az);
      for (let i = 0; i < n; i++) { if (sys.pin[i]) continue; st.vx[i] += h * ws.ax[i]; st.vy[i] += h * ws.ay[i]; st.vz[i] += h * ws.az[i]; st.x[i] += h * st.vx[i]; st.y[i] += h * st.vy[i]; st.z[i] += h * st.vz[i]; }
      const K1 = kinetic(sys, st.vx, st.vy, st.vz), U1 = potential(sys, st.x, st.y, st.z);
      const u = k[0]; uSolve(sys, st.x, st.y, st.z, st.vx, st.vy, st.vz, u.ux, u.uy, u.uz, ws);
      for (let i = 0; i < n; i++) { if (sys.pin[i]) continue; st.x[i] += h * u.ux[i]; st.y[i] += h * u.uy[i]; st.z[i] += h * u.uz[i]; }
      const U2 = potential(sys, st.x, st.y, st.z);
      led.kickK += K1 - K0; led.driftU += U1 - U0; led.transportU += U2 - U1; st.W += U2 - U1; st.t += h; return;
    }
    if (scheme === 'semic') {
      // 半陰的の結合(直し方の案の器 —— 本体と同じ 1 次・同じ費用〔1 步に解 1 回〕): v += h a(r) → u = u(r, v_new)(**ドリフトの前の位置**で解く)→ r += h (v_new + u)。
      //   本体の分割との違いは u を解く位置だけ(本体はドリフトの後の位置 r + h v で解く —— |v|h が軟化の長さを越えると力と仕事の評価点がずれる)。帳簿 W は −Σ m a(r)·u h(左端)
      accel(sys, st.x, st.y, st.z, ws.ax, ws.ay, ws.az);
      for (let i = 0; i < n; i++) { if (sys.pin[i]) continue; st.vx[i] += h * ws.ax[i]; st.vy[i] += h * ws.ay[i]; st.vz[i] += h * ws.az[i]; }
      const u = k[0]; uSolve(sys, st.x, st.y, st.z, st.vx, st.vy, st.vz, u.ux, u.uy, u.uz, ws);
      let dW = 0;
      for (let i = 0; i < n; i++) { if (sys.pin[i]) continue; dW -= sys.m[i] * (ws.ax[i] * u.ux[i] + ws.ay[i] * u.uy[i] + ws.az[i] * u.uz[i]);
        st.x[i] += h * (st.vx[i] + u.ux[i]); st.y[i] += h * (st.vy[i] + u.uy[i]); st.z[i] += h * (st.vz[i] + u.uz[i]); }
      st.W += h * dW; st.t += h; return;
    }
    if (scheme === 'rk2') {
      rhs(sys, st.x, st.y, st.z, st.vx, st.vy, st.vz, k[0], ws); stage(st, k[0], 0.5, h); rhs(sys, tx, ty, tz, tvx, tvy, tvz, k[1], ws);
      for (let i = 0; i < n; i++) { st.x[i] += h * k[1].dx[i]; st.y[i] += h * k[1].dy[i]; st.z[i] += h * k[1].dz[i]; st.vx[i] += h * k[1].ax[i]; st.vy[i] += h * k[1].ay[i]; st.vz[i] += h * k[1].az[i]; }
      st.W += h * k[1].dW; pinFix(st); st.t += h; return;
    }
    // rk4
    rhs(sys, st.x, st.y, st.z, st.vx, st.vy, st.vz, k[0], ws); stage(st, k[0], 0.5, h); rhs(sys, tx, ty, tz, tvx, tvy, tvz, k[1], ws);
    stage(st, k[1], 0.5, h); rhs(sys, tx, ty, tz, tvx, tvy, tvz, k[2], ws); stage(st, k[2], 1, h); rhs(sys, tx, ty, tz, tvx, tvy, tvz, k[3], ws);
    const w = h / 6, c = (A, B, C2, D, i) => A[i] + 2 * B[i] + 2 * C2[i] + D[i];
    for (let i = 0; i < n; i++) {
      st.x[i] += w * c(k[0].dx, k[1].dx, k[2].dx, k[3].dx, i); st.y[i] += w * c(k[0].dy, k[1].dy, k[2].dy, k[3].dy, i); st.z[i] += w * c(k[0].dz, k[1].dz, k[2].dz, k[3].dz, i);
      st.vx[i] += w * c(k[0].ax, k[1].ax, k[2].ax, k[3].ax, i); st.vy[i] += w * c(k[0].ay, k[1].ay, k[2].ay, k[3].ay, i); st.vz[i] += w * c(k[0].az, k[1].az, k[2].az, k[3].az, i);
    }
    st.W += w * (k[0].dW + 2 * k[1].dW + 2 * k[2].dW + k[3].dW); pinFix(st); st.t += h;
  };
  /** 直近の u(診断用 —— 現在の状態で解き直す) */
  const uNow = (st) => { const o = mkK(n); rhs(sys, st.x, st.y, st.z, st.vx, st.vy, st.vz, o, ws); return o; };
  return { step, led, uNow };
}
