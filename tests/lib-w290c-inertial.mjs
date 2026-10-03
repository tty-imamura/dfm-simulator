// 第290便c(原仮定者の裁定(第80報)⑥「引きずりの計算が新しくなる・この計算の実装精度は大変重要」・統括の検証項目 R127)——
// **慣性引きずり(法則版 physics.relativeDrag.law:"inertial")の診断の純関数**(Node だけ・html を読まない)。
//
// ■ 何を置くか
//   (1) 2 体の相対座標の**限定模型**(瞬時固定点の連続極限): ẋ = v/(1+a(r))・v̇ = −GM x/(r²+ε_g²)^{3/2}・a(r) = C_d M K_ε(r)・
//       K_ε(r) = r/(r²+ε²)²(M = m₁+m₂ —— 相対モードの結合は C_d(m₁+m₂)K)。第289便a の限定模型(固定中心・ε=0)と同じ形で、
//       エンジンと同じ初期値・同じ重力の軟化 ε_g・同じ核の軟化 ε を入れた RK4 で 1 動径周期あたりの近点移動 Δϖ を測る。
//       解析(円軌道近傍・ε=0): Δϖ = 2π(√((1+a)/(1−2a)) − 1) ≈ 3πa(第289便a の式)。
//   (2) 近点の拾い方(器がエンジンの步列に使う): x·v の − → + の零点を步の間で線形に詰める(角は atan2 + 2π·周回数)。
//
// ■ しないこと・言わないこと
//   ・C_d を観測・1PN・月 8.85 年に合わせない(1PN との違いは r 依存 —— 第289便a の表)。
//   ・「1PN と同等」「回転引きずりが創発」「連鎖で円盤」「慣性決定力場を接続した(既定で)」と書かない。
//   ・冪は `**`/Math.pow を使わず積で書く(tests/README §1)。
export const INERTIAL_LIB_VERSION = 'w290c-inertial-lib-1';

/** 核 K_ε(r) = r/(r²+ε²)²。 */
export function kernelK(r, eps) { const s = r * r + eps * eps; return r / (s * s); }
/** 解析の近点移動(1 動径周期あたり・rad)。 */
export function analyticPrecession(a) { return 2 * Math.PI * (Math.sqrt((1 + a) / (1 - 2 * a)) - 1); }

/**
 * 限定模型の RK4(相対座標)。近点(x·v の − → + の零点)を K+1 回拾い Δϖ = (φ_K − φ_0)/K − 2π を返す。
 * @param {{GM:number, CdM:number, eps:number, soft:number, x0:number[], v0:number[], perOrbit?:number, K?:number}} o
 */
export function limitedModel(o) {
  const GM = o.GM, CdM = o.CdM, eps = o.eps, soft2 = o.soft * o.soft, perOrbit = o.perOrbit || 20000, K = o.K || 5;
  const r0 = Math.hypot(o.x0[0], o.x0[1]);
  const T = 2 * Math.PI * Math.sqrt(r0 * r0 * r0 / GM), h = T / perOrbit;
  const f = (s) => { const [x, y, vx, vy] = s, r2 = x * x + y * y, r = Math.sqrt(r2), a = CdM * kernelK(r, eps), w = 1 / (1 + a);
    const d = r2 + soft2, g = GM / (d * Math.sqrt(d));
    return [vx * w, vy * w, -g * x, -g * y]; };
  const step = (s, dt) => { const k1 = f(s), s2 = s.map((v, i) => v + 0.5 * dt * k1[i]), k2 = f(s2), s3 = s.map((v, i) => v + 0.5 * dt * k2[i]), k3 = f(s3),
    s4 = s.map((v, i) => v + dt * k3[i]), k4 = f(s4); return s.map((v, i) => v + dt * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]) / 6); };
  const sv = (s) => s[0] * s[2] + s[1] * s[3];
  let s = [o.x0[0], o.x0[1], o.v0[0], o.v0[1]], turns = 0, rawPrev = Math.atan2(s[1], s[0]);
  const peri = [];
  const angleOf = (z) => { const raw = Math.atan2(z[1], z[0]); return raw + 2 * Math.PI * (turns + ((raw < rawPrev - Math.PI) ? 1 : 0)); };
  for (let n = 0; n < perOrbit * (K + 3) && peri.length < K + 1; n++) {
    const s1 = step(s, h);
    const a = sv(s), b = sv(s1);
    if (a < 0 && b >= 0) {
      let lo = 0, hi = h, flo = a, fhi = b, side = 0, t = h;
      for (let it = 0; it < 80; it++) {
        t = (fhi - flo !== 0) ? (lo * fhi - hi * flo) / (fhi - flo) : 0.5 * (lo + hi);
        if (!(t > lo && t < hi)) t = 0.5 * (lo + hi);
        const fz = sv(step(s, t));
        if (fz === 0 || hi - lo < 1e-15 * h) break;
        if (fz < 0) { lo = t; flo = fz; if (side === -1) fhi *= 0.5; side = -1; }
        else { hi = t; fhi = fz; if (side === 1) flo *= 0.5; side = 1; }
      }
      peri.push(angleOf(step(s, t)));
    }
    const raw1 = Math.atan2(s1[1], s1[0]); if (raw1 < rawPrev - Math.PI) turns++; rawPrev = raw1;
    s = s1;
  }
  const dw = (peri.length >= 2) ? (peri[peri.length - 1] - peri[0]) / (peri.length - 1) - 2 * Math.PI : null;
  const a0 = CdM * kernelK(r0, eps);
  return { a0, dw, nPeri: peri.length, perOrbit, K, analytic: analyticPrecession(a0), approx3pia: 3 * Math.PI * a0 };
}

/**
 * 步列の近点を拾う追跡器(器がエンジンの步ごとに push する)。相対位置 (dx,dy) と相対速度 (dvx,dvy)(慣性速度 v —— 2 体では ẋ ∥ v)。
 */
export function periTracker() {
  let prevF = null, prevAng = null, turns = 0, rawPrev = null;
  const peri = [], times = [];
  return {
    push(t, dx, dy, dvx, dvy) {
      const f = dx * dvx + dy * dvy, raw = Math.atan2(dy, dx);
      if (rawPrev !== null && raw < rawPrev - Math.PI) turns++;
      if (rawPrev !== null && raw > rawPrev + Math.PI) turns--;
      rawPrev = raw;
      const ang = raw + 2 * Math.PI * turns;
      if (prevF !== null && prevF < 0 && f >= 0) { const w = (-prevF) / (f - prevF); peri.push(prevAng + (ang - prevAng) * w); times.push(t); }
      prevF = f; prevAng = ang;
    },
    peri, times,
    dw(K) { if (peri.length < K + 1) return null; return (peri[K] - peri[0]) / K - 2 * Math.PI; },
    period(K) { if (times.length < K + 1) return null; return (times[K] - times[0]) / K; }
  };
}

/** 単体試験(閉じた式の自己整合)。 */
export function selfTest() {
  const checks = {};
  checks.smallA = Math.abs(analyticPrecession(1e-6) / (3 * Math.PI * 1e-6) - 1) < 1e-5;
  // C_d = 0・軟化 0 で歳差 0(ニュートン)
  const z = limitedModel({ GM: 1, CdM: 0, eps: 0, soft: 0, x0: [1, 0], v0: [0.01, 1], K: 3, perOrbit: 20000 });
  checks.newtonZero = Math.abs(z.dw) < 1e-9;
  // ε=0・軟化 0 の小さな a で解析と相対 1e-3 以内(離心 0.01 の e² 項と a² 項を含む)
  const s = limitedModel({ GM: 1, CdM: 1e-3, eps: 0, soft: 0, x0: [1, 0], v0: [0.01, Math.sqrt(1 + 1e-3)], K: 3, perOrbit: 20000 });
  checks.analytic = Math.abs(s.dw - s.analytic) / s.analytic < 1e-3;
  checks.kernelFar = Math.abs(kernelK(1000, 0.5) * 1e9 - 1) < 1e-6;
  return { ok: Object.values(checks).every(Boolean), checks };
}
