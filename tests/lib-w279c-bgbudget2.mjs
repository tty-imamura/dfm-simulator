// 第279便c(統括の読み R63 ④・AM4/AM13)— **新契約(ẋ=v+u・v̇=a_space−Jᵀv)での背景の誤差予算**の積分器(純関数)。
//
// ■ 何を積分するか
//   2 体(対)+ 外部源 1 つ(❄️🌘 は太陽・📻 は銀河の点質量)。場の合成と RHS は **html の純関数そのもの**
//   (`dfmComplexMomentsOf`・`dfmBlendComplexMoments`・`dfmMeshVelocityRHS` —— lib-w279c-bgcompose の makePure が
//   html のソースから取り出したもの)を使う。外部源の置き方は 2 通り:
//     (EXP) **明示天体** … 外部源を源に入れる(`field:"explicit"`・external=[外部源])。重力は厳密。
//     (BG)  **背景合成 + 凍結参照系 + backgroundTidal** … 外部源の寄与を t=0・対の重心で評価した 6 成分を
//           凍結参照系の原点 O のまわりで**値を一次で移す**場として置く(`bgSpace:"shift"`・`bgTime:"frozen"` が
//           エンジンの `dfmMeshVelocityStep` と同じ形。値を時間で線形に外挿する `bgTime:"linear"` は比較用 —— 採らない形)。
//           重力は凍結参照系ごとに: comoving(自由落下系 —— 一様重力なし)/ none(慣性系 —— 重心の一様重力)、
//           それぞれに線形潮汐 T(`physics.backgroundTidal` の値 —— t=0 の点質量の T を凍結)を足すかどうか。
//   `mutual` は相対作用の引きずりの端点(0: 外部の場だけ / 1: 相手の明示天体 + 外部の場の合成)。
//
// ■ 状態と精度
//   参照点 C(t)(EXP と慣性系 BG は外部源の重力で自由落下・comoving BG は静止)からの変位 ξ_k と、
//   慣性速度 v_k の C 系成分 w_k=v_k−Ċ を積分する(太陽の距離 ~10¹² m と対の距離 ~10⁷ m を同じ変数で足さない)。
//   ξ̇_k = w_k + u_k ・ ẇ_k = (a_k − C̈) − J_kᵀ v_k。RK4 固定刻み。
//
// ■ 初期条件
//   座標速度 ẋ_k(0) はサンプルの宣言そのもの。慣性速度は v_k = ẋ_k − u_k(0) で置く(`initV:"matchXdot"`)。
//   mutual:1 では u が相手の v を含むので 2×2 の線形方程式 [[1,χ₀],[χ₁,1]]v = ẋ − A_ext/W を解く
//   (行列式 1−χ₀χ₁ が 0 なら解けない —— そのときは `initSolvable:false` を返し、宣言値 v=ẋ で置く。
//   0 に近いと条件数 1/det が大きい —— 閾値は置かず行列式をそのまま返す)。
//
// ■ しないこと
//   ・エンジンに接続しない(エンジンの走行は器がページで別に回す)・閾値を置かない・係数を探索しない。
import { pointMassTidal } from './lib-w278d-bgequiv.mjs';
import { sourceContribution } from './lib-w278d-bgequiv.mjs';

export const BGBUDGET2_VERSION = 'w279c-bgbudget2-1';

/** 外部源の寄与を t=0・対の重心で評価した背景の 6 成分(凍結参照系の値)と、線形潮汐 T。 */
export function frozenBackground(cfg, frame) {
  const { G, M, eps, R0, VR0 } = cfg;
  const q = R0[0] * R0[0] + R0[1] * R0[1] + eps * eps, iq3 = 1 / (q * Math.sqrt(q));
  const gc = [-G * M * R0[0] * iq3, -G * M * R0[1] * iq3];      // 対の重心での外部源の重力
  // 外部源の運動を**その系で**書く: comoving(対の重心と一緒に自由落下する系)では外部源は −V で動き、
  // −g_c で加速して見える / none(外部源の静止系 = 慣性系)では静止
  const sun = frame === 'comoving'
    ? { m: M, x: -R0[0], y: -R0[1], vx: -VR0[0], vy: -VR0[1], ax: -gc[0], ay: -gc[1] }
    : { m: M, x: -R0[0], y: -R0[1], vx: 0, vy: 0, ax: 0, ay: 0 };
  const bg = sourceContribution(sun, 0, 0, { p: 2, eps });
  const T = pointMassTidal(G * M, R0, eps);
  return { bg: { W: bg.W0, A: bg.A0, gradW: bg.gradW, gradA: bg.gradA, dWdt: bg.dWdt, dAdt: bg.dAdt }, T, gc, sun };
}

/**
 * 1 走行。cfg: {G,m:[m0,m1],M,eps,T0,steps,R0,VR0,r0,vr0}。
 * model: {mode:'off'|'exp'|'bg', mutual:0|1, frame:'comoving'|'none', tidal:bool, bgSpace:'shift'|'frozen',
 *         bgTime:'linear'|'frozen', meshOn:bool}
 *   off … 同じ重力模型で meshVelocity を切った走行(ON/OFF の OFF)。
 */
export function runMV(pure, cfg, model) {
  const G = cfg.G, m0 = cfg.m[0], m1 = cfg.m[1], M = cfg.M, eps = cfg.eps || 0, e2 = eps * eps;
  const mt = m0 + m1, mu0 = m0 / mt, mu1 = m1 / mt;
  const md = Object.assign({ mode: 'exp', mutual: 0, frame: 'comoving', tidal: false, bgSpace: 'shift', bgTime: 'frozen',
    meshOn: true }, model || {});
  const T0 = cfg.T0, steps = cfg.steps, dt = T0 / steps;
  const explicitSun = (md.mode === 'exp');
  // 参照点 C の運動: 外部源の重力で自由落下(EXP・慣性系 BG)/ 静止(comoving BG)
  const cFalls = explicitSun || md.frame === 'none';
  const FB = explicitSun ? null : frozenBackground(cfg, md.frame);
  const sunPos = [-cfg.R0[0], -cfg.R0[1]];                     // 外部源の位置(C(0)=0 の座標)
  const gS = (x, y) => { const dx = x - sunPos[0], dy = y - sunPos[1], q = dx * dx + dy * dy + e2, iq = 1 / Math.sqrt(q), iq3 = iq * iq * iq;
    return [-G * M * dx * iq3, -G * M * dy * iq3]; };
  // 状態 s = [Cx,Cy,VCx,VCy, ξ0x,ξ0y,w0x,w0y, ξ1x,ξ1y,w1x,w1y]
  // 初期: C(0)=0(対の重心)、Ċ(0)= 慣性系なら VR0 / comoving なら 0
  const VC0 = cFalls ? cfg.VR0.slice() : [0, 0];
  const xd0 = [mu1 * cfg.vr0[0], mu1 * cfg.vr0[1]], xd1 = [-mu0 * cfg.vr0[0], -mu0 * cfg.vr0[1]];   // ẋ − Ċ
  const pairAcc = (xi0, xi1) => {
    const rx = xi0[0] - xi1[0], ry = xi0[1] - xi1[1], q = rx * rx + ry * ry + e2, iq = 1 / Math.sqrt(q), iq3 = iq * iq * iq;
    return [[-G * m1 * rx * iq3, -G * m1 * ry * iq3], [G * m0 * rx * iq3, G * m0 * ry * iq3]];
  };
  // 各天体の「空間に対する加速」から C̈ を引いたもの(= 相対軌道へ効く部分)と、源として使う a(作業系の値)
  const accel = (s, t) => {
    const C = [s[0], s[1]], xi0 = [s[4], s[5]], xi1 = [s[8], s[9]];
    const pa = pairAcc(xi0, xi1);
    let gC = [0, 0];
    const extra = [[0, 0], [0, 0]];
    if (explicitSun) {
      gC = gS(C[0], C[1]);
      for (let k = 0; k < 2; k++) { const xi = k ? xi1 : xi0, g = gS(C[0] + xi[0], C[1] + xi[1]);
        extra[k] = [g[0] - gC[0], g[1] - gC[1]]; }
    } else {
      if (md.frame === 'none') gC = gS(C[0], C[1]);            // 慣性系: 重心の一様重力(相対軌道には効かない)
      if (md.tidal) {
        const O = barycenter(s);
        for (let k = 0; k < 2; k++) { const xi = k ? xi1 : xi0, d = [C[0] + xi[0] - O[0], C[1] + xi[1] - O[1]];
          extra[k] = [FB.T[0][0] * d[0] + FB.T[0][1] * d[1], FB.T[1][0] * d[0] + FB.T[1][1] * d[1]]; }
      }
    }
    const rel = [[pa[0][0] + extra[0][0], pa[0][1] + extra[0][1]], [pa[1][0] + extra[1][0], pa[1][1] + extra[1][1]]];
    const abs = [[rel[0][0] + gC[0], rel[0][1] + gC[1]], [rel[1][0] + gC[0], rel[1][1] + gC[1]]];
    return { rel, abs, gC };
  };
  const barycenter = (s) => [s[0] + mu0 * s[4] + mu1 * s[8], s[1] + mu0 * s[5] + mu1 * s[9]];
  let O0 = null;
  // 場: 天体 k の (合成済み) 場を返す(null = meshVelocity を切った走行)
  const fieldOf = (s, t, k, vAbs, aAbs) => {
    if (!md.meshOn) return null;
    const C = [s[0], s[1]], xi = k ? [s[8], s[9]] : [s[4], s[5]];
    const X = [C[0] + xi[0], C[1] + xi[1]];
    let ext = null, loc = null;
    if (explicitSun) {
      ext = pure.dfmComplexMomentsOf([{ m: M, x: sunPos[0], y: sunPos[1], vx: 0, vy: 0, ax: 0, ay: 0 }], X[0], X[1], e2);
    } else {
      const O = (md.frame === 'none') ? O0 : barycenter(s);
      const d = md.bgSpace === 'shift' ? [X[0] - O[0], X[1] - O[1]] : [0, 0];
      const tt = md.bgTime === 'linear' ? t : 0;
      const B = FB.bg;
      ext = { W: B.W + B.gradW[0] * d[0] + B.gradW[1] * d[1] + B.dWdt * tt,
        A: [B.A[0] + B.gradA[0] * d[0] + B.gradA[1] * d[1] + B.dAdt[0] * tt, B.A[1] + B.gradA[2] * d[0] + B.gradA[3] * d[1] + B.dAdt[1] * tt],
        gradW: B.gradW.slice(), gradA: B.gradA.slice(), dWdt: B.dWdt, dAdt: B.dAdt.slice() };
    }
    if (md.mutual === 1) {
      const j = 1 - k, xj = j ? [s[8], s[9]] : [s[4], s[5]];
      loc = pure.dfmComplexMomentsOf([{ m: j ? m1 : m0, x: C[0] + xj[0], y: C[1] + xj[1], vx: vAbs[j][0], vy: vAbs[j][1],
        ax: aAbs[j][0], ay: aAbs[j][1] }], X[0], X[1], e2);
      if (!loc) return { ok: false, err: 'local' };
      loc.selfExcluded = true;
    }
    return pure.dfmBlendComplexMoments(loc, ext);
  };
  let fails = 0;
  const deriv = (s, t) => {
    const Vc = [s[2], s[3]];
    const vAbs = [[Vc[0] + s[6], Vc[1] + s[7]], [Vc[0] + s[10], Vc[1] + s[11]]];
    const A = accel(s, t);
    const d = new Array(12).fill(0);
    d[0] = s[2]; d[1] = s[3]; d[2] = A.gC[0]; d[3] = A.gC[1];
    for (let k = 0; k < 2; k++) {
      const f = fieldOf(s, t, k, vAbs, A.abs);
      let u = [0, 0], can = [0, 0];
      if (f) {
        if (!f.ok) { fails++; return null; }
        const r = pure.dfmMeshVelocityRHS(f, vAbs[k], A.abs[k]);
        if (!r.ok) { fails++; return null; }
        u = r.transport; can = r.canonical;
      }
      const o = 4 + 4 * k;
      d[o] = s[o + 2] + u[0]; d[o + 1] = s[o + 3] + u[1];
      d[o + 2] = A.rel[k][0] + can[0]; d[o + 3] = A.rel[k][1] + can[1];
    }
    return d;
  };
  // 初期の慣性速度
  let s = [0, 0, VC0[0], VC0[1], mu1 * cfg.r0[0], mu1 * cfg.r0[1], xd0[0], xd0[1], -mu0 * cfg.r0[0], -mu0 * cfg.r0[1], xd1[0], xd1[1]];
  O0 = barycenter(s);
  let initSolvable = true, initDet = null, u0 = [[0, 0], [0, 0]];
  if (md.meshOn) {
    const vAbsDecl = [[VC0[0] + xd0[0], VC0[1] + xd0[1]], [VC0[0] + xd1[0], VC0[1] + xd1[1]]];
    const A = accel(s, 0);
    if (md.mutual === 0) {
      for (let k = 0; k < 2; k++) { const f = fieldOf(s, 0, k, vAbsDecl, A.abs); if (f && f.ok && f.defined) u0[k] = f.u.slice(); }
    } else {
      // u_k = (w_kj v_j + A_ext,k)/W_k → v_k + χ_k v_j = ẋ_k − A_ext,k/W_k
      const chi = [], bExt = [];
      for (let k = 0; k < 2; k++) {
        const f = fieldOf(s, 0, k, [[0, 0], [0, 0]], A.abs);      // 源の速度 0 で評価すると A は外部分だけ
        chi.push(f.chi); bExt.push([f.A[0] / f.W, f.A[1] / f.W]);
      }
      initDet = 1 - chi[0] * chi[1];
      // 行列式が 0 なら解けない(閾値は置かない —— 行列式をそのまま返す)
      if (!(initDet !== 0 && Number.isFinite(initDet))) initSolvable = false;
      else {
        const rhs = [0, 1].map((k) => [vAbsDecl[k][0] - bExt[k][0], vAbsDecl[k][1] - bExt[k][1]]);
        const v0 = [0, 1].map((c) => (rhs[0][c] - chi[0] * rhs[1][c]) / initDet);
        const v1 = [0, 1].map((c) => (rhs[1][c] - chi[1] * rhs[0][c]) / initDet);
        u0 = [[vAbsDecl[0][0] - v0[0], vAbsDecl[0][1] - v0[1]], [vAbsDecl[1][0] - v1[0], vAbsDecl[1][1] - v1[1]]];
      }
    }
    s[6] -= u0[0][0]; s[7] -= u0[0][1]; s[10] -= u0[1][0]; s[11] -= u0[1][1];
  }
  const rk = (z, t, h) => {
    const k1 = deriv(z, t); if (!k1) return null;
    const k2 = deriv(z.map((q, i) => q + 0.5 * h * k1[i]), t + 0.5 * h); if (!k2) return null;
    const k3 = deriv(z.map((q, i) => q + 0.5 * h * k2[i]), t + 0.5 * h); if (!k3) return null;
    const k4 = deriv(z.map((q, i) => q + h * k3[i]), t + h); if (!k4) return null;
    return z.map((q, i) => q + h / 6 * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
  };
  // 相対軌道 r = ξ0 − ξ1 の角度で 1 周(同方向)の時刻を割線法で精密化
  const ang = (z) => Math.atan2(z[5] - z[9], z[4] - z[8]);
  const wrap = (d) => { while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; return d; };
  const L0z = (s[4] - s[8]) * (xd0[1] - xd1[1]) - (s[5] - s[9]) * (xd0[0] - xd1[0]);
  const sgn = L0z >= 0 ? 1 : -1, target = sgn * 2 * Math.PI;
  let unw = 0, prev = ang(s), period = null, sT = null, t = 0, failed = false;
  const maxSteps = Math.ceil(steps * 1.6);
  const uMax = [0, 0];
  for (let n = 0; n < maxSteps; n++) {
    const s1 = rk(s, t, dt);
    if (!s1 || !s1.every(Number.isFinite)) { failed = true; break; }
    const a1 = ang(s1), unw1 = unw + wrap(a1 - prev);
    if (period === null && (unw - target) * sgn < 0 && (unw1 - target) * sgn >= 0) {
      const fOf = (h) => { const z = rk(s, t, h); return z ? unw + wrap(ang(z) - prev) - target : NaN; };
      let h0 = 0, f0 = unw - target, h1 = dt, f1 = unw1 - target;
      for (let it = 0; it < 40; it++) {
        const h2 = h1 - f1 * (h1 - h0) / (f1 - f0);
        if (!Number.isFinite(h2)) break;
        const f2 = fOf(h2); h0 = h1; f0 = f1; h1 = h2; f1 = f2;
        if (Math.abs(h1 - h0) <= 1e-13 * dt || f2 === 0) break;
      }
      period = t + h1;
    }
    s = s1; unw = unw1; prev = a1; t += dt;
    if (n + 1 === steps) sT = s.slice();
    if (n + 1 >= steps && period !== null) break;
  }
  if (!sT) return { failed: true, model: md, steps, dt, initSolvable, initDet, fails };
  // 1 公転後の相対軌道(座標速度で要素を出す)
  const d = deriv(sT, T0);
  const rx = sT[4] - sT[8], ry = sT[5] - sT[9];
  const vx = d ? d[4] - d[8] : NaN, vy = d ? d[5] - d[9] : NaN;
  const mu = G * mt, r = Math.hypot(rx, ry), v2 = vx * vx + vy * vy, rv = rx * vx + ry * vy;
  const a = 1 / (2 / r - v2 / mu);
  const ex = ((v2 - mu / r) * rx - rv * vx) / mu, ey = ((v2 - mu / r) * ry - rv * vy) / mu;
  const e = Math.hypot(ex, ey);
  return { model: md, steps, dt, T0, failed, period, phaseT: ang(sT), rT: [rx, ry], aT: a, eT: e,
    bound: (a > 0 && e < 1), initSolvable, initDet, u0, unwrappedT: unw, fails };
}

/** ON/OFF の差(lib-w278d の runDiff と同じ形 —— 周期差・位相差〔時間〕・位置差)。 */
export function diffRuns(A, B, T0) {
  if (!A || !B || A.failed || B.failed) return null;
  const n = 2 * Math.PI / T0;
  const wrap = (d) => { while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; return d; };
  const dPhase = wrap(A.phaseT - B.phaseT);
  const dr = [A.rT[0] - B.rT[0], A.rT[1] - B.rT[1]];
  return { dP: (A.period !== null && B.period !== null) ? A.period - B.period : null,
    dPhase, dPhaseTimeS: dPhase / n, dPos: Math.hypot(dr[0], dr[1]), dPosVec: dr, bothBound: A.bound && B.bound };
}

export default { BGBUDGET2_VERSION, frozenBackground, runMV, diffRuns };
