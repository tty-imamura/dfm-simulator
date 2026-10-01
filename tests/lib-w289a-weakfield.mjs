// 第289便a(原仮定者の裁定(第79報)⑤「DFM について整理と修正を行なった。これを元に現状の実装を精査する」・統括の検証項目 R119)——
// **時計・光の弱場係数の検査**と**相対移動 r⁻³ 核の限定模型**(純関数・Node だけ・html を読まない・エンジン未接続)。
//
// ■ 何を置くか
//   (1) 3 つの「時計と光の関数形」を同じ点質量・同じ衝突径数 b で**一次係数**として並べる:
//       (i)  現行 E7R/E8R: ψ = κW(κ = G/c₀² の物理対応)・時計 N = e^{−ψ}・屈折率 n = e^{2ψ}(座標の光の速さ c₀/n)
//       (ii) 文字どおりの反比例: 時計 f(D) = D_ref/D(D = D_ref + M/r)・座標の光の速さ c₀ f(D)(空間はユークリッド距離・静的場・フェルマー)
//            —— 時計の弱場係数を GR に合わせる(G·D_ref = c₀² ⇔ M/(D_ref r) = GM/(c₀² r))と、n = D/D_ref = 1 + U
//       (iii) 第 3 案(**実装しない** —— 表に置くだけ): 反比例の時計 N = 1/(1+U) と独立の空間尺度 A = 1+U(n = A/N = (1+U)²)
//       U = GM/(c₀² r)。量は 静止時計の率の一次係数 k(rate ≈ 1 − kU)・光偏向 α(b) の係数(α = c_α GM/(b c₀²))・
//       シャピロ遅延の係数(片道 Δt = c_S (GM/c₀³) ∫dl/r —— 直線経路の一次)。
//       数値: 偏向は直線経路(Born)の積分を x = b tanθ で書き直して複合 Simpson、加えてフェルマーの光線方程式の RK4 積分
//       (有限の経路長 ±X の外は Born の尾を同じ求積で足す)。シャピロは x = b sinh s で書き直して複合 Simpson。
//       期待(解析): (i) 4・2・時計 1 / (ii) 2・1・時計 1(GR の半分)/ (iii) 4・2・時計 1。床: 解析と**相対 1e-6**(宣言 —— 強さ U_b = 1e-7 の二次の項と求積の丸めを含む)。
//   (2) **相対移動 r⁻³ 核の限定模型**(解析と RK4): 自転なしの固定中心・点質量 r⁻³ 引きずり・瞬時固定点で
//       ẋ = v/(1+a)・v̇ = −GM r/r³・a = C_d M/r³(C_d [L³/M] —— 宣言)。保存量 h = x×v(ẋ ∥ v なので dh/dt = 0)。
//       円軌道近傍の近点移動 Δϖ = 2π(√((1+a)/(1−2a)) − 1) ≈ 3πa(導出: 周回角速度² = GM/(r³(1+a))・周転円の角振動数² = GM(1−2a)/(r³(1+a)²))。
//       RK4 で近点(x·v の − → + の零点 —— 部分步の割線で詰める)を K 回拾い、1 動径周期あたりの Δϖ を解析と比べる(床: 相対 1e-6 —— 離心 e ≈ 1e-4 の e² の項を含む)。
//       r 依存: C_d を基準半径 r_ref で GR の 6πGM/(c² r) に合わせても、他の半径では比が (r_ref/r)² で動く(r⁻³ と r⁻¹)。
//       **可能性として書く**: 「r⁻³ の並進項だけでは普遍定数 1 つで全軌道の 1PN を置き換えられない可能性」(断定しない)。
//       多体版・自己除外・前ステップ参照の安定条件は第289便c の担当(重複実装しない —— ここは 1 体の固定中心だけ)。
//
// ■ 数値: 冪は Math.pow を使わず積で書く(実行環境で Math.pow が 1 ulp 違っても表が変わらない —— tests/README §1)。
//   exp・log・sqrt・sin・cos・atan2 は使う(床 1e-6 に対して 1 ulp は無関係)。
// ■ しないこと・言わないこと
//   ・html の式を変えない・エンジンに接続しない・既存の場に足さない。🛰 の記録値(GPS +38.5 μs/日・偏向・シャピロ)は再測しない。
//   ・「反比例則を実装した」「1PN と同等が証明された」「観測一致を再現した」と書かない。
export const WEAKFIELD_LIB_VERSION = 'w289a-weakfield-1';
/** 解析と数値の照合の床(宣言 —— 弱場の二次の項・求積と RK4 の丸めを含む)。 */
export const FLOOR = 1e-6;
/** 一次係数を取る強さ U_b = GM/(b c₀²)(二次の項の相対の大きさ ~ U_b)。 */
export const STRENGTH = 1e-7;
/** 単位: G = c₀ = b = 1(係数は無次元)。 */
export const UNITS = Object.freeze({ G: 1, c0: 1, b: 1 });
/** シャピロの経路(直線・端点 x = −L1, +L2 —— b を単位に)。 */
export const SHAPIRO_PATH = Object.freeze({ L1: 1e4, L2: 8.43e4 });
/** 光線方程式の経路長(±X —— 外は Born の尾を足す)と刻み。 */
export const RAY_PATH = Object.freeze({ X: 200, ds: 0.02 });
export const N_SIMPSON = 4000;

/**
 * 法則(宣言)。U = GM/(c₀² r)。rate(U) = 静止時計の率・lnN(U) = ln n(U)・dlnN(U) = d ln n/dU・nm1(U) = n − 1・
 * expected = 解析の一次係数 {clock, deflection, shapiro, gamma}。
 */
export const LAWS = Object.freeze([
  Object.freeze({ key: 'e7r', label: '(i) 現行 E7R/E8R(N = e^{−ψ}・n = e^{2ψ}・ψ = κW)', implemented: true,
    expected: Object.freeze({ clock: 1, deflection: 4, shapiro: 2, gamma: 1 }) }),
  Object.freeze({ key: 'inverse', label: '(ii) 文字どおりの反比例(時計 D_ref/D・座標の光の速さ c₀ D_ref/D・G D_ref = c₀²)', implemented: false,
    expected: Object.freeze({ clock: 1, deflection: 2, shapiro: 1, gamma: 0 }) }),
  Object.freeze({ key: 'inverseA', label: '(iii) 第 3 案: 反比例の時計 + 独立の空間尺度 A = D/D_ref(n = A/N)', implemented: false,
    expected: Object.freeze({ clock: 1, deflection: 4, shapiro: 2, gamma: 1 }) }),
]);
const LAW_FN = {
  e7r: { rate: (U) => Math.exp(-U), oneMinusRate: (U) => -Math.expm1(-U), lnN: (U) => 2 * U, dlnN: () => 2, nm1: (U) => Math.expm1(2 * U) },
  inverse: { rate: (U) => 1 / (1 + U), oneMinusRate: (U) => U / (1 + U), lnN: (U) => Math.log1p(U), dlnN: (U) => 1 / (1 + U), nm1: (U) => U },
  inverseA: { rate: (U) => 1 / (1 + U), oneMinusRate: (U) => U / (1 + U), lnN: (U) => 2 * Math.log1p(U), dlnN: (U) => 2 / (1 + U), nm1: (U) => U * (2 + U) },
};
export function lawFn(key) { return LAW_FN[key]; }

/** 複合 Simpson(N は偶数)。 */
export function simpson(f, a, b, N = N_SIMPSON) {
  const h = (b - a) / N;
  let s = f(a) + f(b);
  for (let k = 1; k < N; k++) s += (k % 2 ? 4 : 2) * f(a + k * h);
  return s * h / 3;
}

/** 静止時計の率の一次係数 k = (1 − rate(U))/U(U = STRENGTH)。 */
export function clockCoeff(key, U = STRENGTH) { return LAW_FN[key].oneMinusRate(U) / U; }

/**
 * 直線経路(Born)の偏向: α = ∫ ∂_⊥ ln n dx。x = b tanθ で α = (μ/b)∫_{−π/2}^{π/2} (d ln n/dU)(μ cosθ/b) cosθ dθ(μ = GM/c₀²)。
 * 返り値は係数 α/(μ/b)。θ の範囲 [θ0, θ1] を指定すると尾の分だけ返す(光線方程式の尾に使う)。
 */
export function bornDeflectionCoeff(key, Ub = STRENGTH, th0 = -Math.PI / 2, th1 = Math.PI / 2) {
  const d = LAW_FN[key].dlnN;
  return simpson((th) => d(Ub * Math.cos(th)) * Math.cos(th), th0, th1);
}

/**
 * フェルマーの光線方程式 dr/ds = ĉ・dĉ/ds = ∇ ln n − (∇ ln n·ĉ)ĉ を RK4 で x = −X から +X まで(b = 1・質点は原点・強さ Ub)。
 * 外の尾(|x| > X)は Born の求積で足す。返り値 {coeff, coreCoeff, tailCoeff, steps}(coeff = α/U_b)。
 */
export function rayDeflectionCoeff(key, Ub = STRENGTH, P = RAY_PATH) {
  const d = LAW_FN[key].dlnN;
  // ∇ ln n = (d ln n/dU)·∇U・U = Ub·b/r(b = 1)→ ∇U = −Ub r⃗/r³
  const rhs = (s) => {
    const [x, y, cx, cy] = s, r2 = x * x + y * y, r = Math.sqrt(r2), U = Ub / r, g = -d(U) * Ub / (r2 * r);
    const gx = g * x, gy = g * y, dot = gx * cx + gy * cy;
    return [cx, cy, gx - dot * cx, gy - dot * cy];
  };
  let s = [-P.X, 1, 1, 0];
  const n = Math.round(2 * P.X / P.ds), h = P.ds;
  for (let k = 0; k < n; k++) {
    const k1 = rhs(s), s2 = s.map((v, i) => v + 0.5 * h * k1[i]), k2 = rhs(s2), s3 = s.map((v, i) => v + 0.5 * h * k2[i]), k3 = rhs(s3),
      s4 = s.map((v, i) => v + h * k3[i]), k4 = rhs(s4);
    s = s.map((v, i) => v + h * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]) / 6);
  }
  const alpha = -Math.atan2(s[3], s[2]);                 // 質点(原点 —— 光線の下)へ曲がる向きを正
  const thX = Math.atan(P.X);                            // 尾: |x| > X(b = 1)の Born —— 両側
  const tail = bornDeflectionCoeff(key, Ub, thX, Math.PI / 2) * 2;
  return { coeff: alpha / Ub + tail, coreCoeff: alpha / Ub, tailCoeff: tail, steps: n };
}

/**
 * シャピロ遅延(片道・直線経路の一次): Δt = ∫ (n − 1)/c₀ dx。x = b sinh s で dx/r = ds・(n−1)dx = nm1(U)·b cosh s ds(U = μ/(b cosh s))。
 * 返り値は係数 Δt/((μ/c₀)·Λ)(Λ = ∫dx/r = asinh(L2/b) + asinh(L1/b))と Λ。
 */
export function shapiroCoeff(key, Ub = STRENGTH, P = SHAPIRO_PATH) {
  const f = LAW_FN[key].nm1;
  const s0 = -Math.asinh(P.L1), s1 = Math.asinh(P.L2), Lam = s1 - s0;
  const I = simpson((s) => { const ch = Math.cosh(s); return f(Ub / ch) * ch; }, s0, s1, 20000);
  return { coeff: I / (Ub * Lam), Lambda: Lam };
}

/** 係数の表(3 案 × 4 量)と解析との相対差。 */
export function coeffTable() {
  const rel = (a, b) => Math.abs(a - b) / Math.abs(b);
  return LAWS.map((L) => {
    const clock = clockCoeff(L.key), born = bornDeflectionCoeff(L.key), ray = rayDeflectionCoeff(L.key), sh = shapiroCoeff(L.key);
    const e = L.expected;
    const gammaFromDeflection = born / 2 - 1;            // α = 2(1+γ)GM/(bc²) の読み
    const r = { key: L.key, label: L.label, implemented: L.implemented, expected: e,
      clock, deflectionBorn: born, deflectionRay: ray.coeff, rayCore: ray.coreCoeff, rayTail: ray.tailCoeff, raySteps: ray.steps,
      shapiro: sh.coeff, shapiroLambda: sh.Lambda, gammaFromDeflection,
      relClock: rel(clock, e.clock), relBorn: rel(born, e.deflection), relRay: rel(ray.coeff, e.deflection), relShapiro: rel(sh.coeff, e.shapiro) };
    r.withinFloor = r.relClock <= FLOOR && r.relBorn <= FLOOR && r.relRay <= FLOOR && r.relShapiro <= FLOOR && Math.abs(gammaFromDeflection - e.gamma) <= 2 * FLOOR * e.deflection;
    return r;
  });
}

/* ── (2) 相対移動 r⁻³ 核の限定模型 ─────────────────────────────────────────── */

/** 解析の近点移動(1 動径周期あたり・rad): 2π(√((1+a)/(1−2a)) − 1)。 */
export function kernelPrecessionAnalytic(a) { return 2 * Math.PI * (Math.sqrt((1 + a) / (1 - 2 * a)) - 1); }
/** GR の主次数(1 周あたり・円軌道): 6πGM/(c² r)。 */
export function grPrecession(GMc2, r) { return 6 * Math.PI * GMc2 / r; }

/**
 * RK4: ẋ = v/(1+a(r))・v̇ = −GM x/r³・a = k/r³(k = C_d M)。初期: x = (r0, 0)・v = (ecc·v_c, v_φ)・v_φ = √(GM(1+a0)/r0)(円軌道の条件)。
 * 近点(x·v の − → + の零点)を K+1 回拾い、Δϖ = (φ_K − φ_0)/K − 2π を返す。
 * @param {{GM:number,k:number,r0:number,ecc?:number,perOrbit?:number,K?:number}} o
 */
export function kernelOrbitPrecession(o) {
  const GM = o.GM, k = o.k, r0 = o.r0, ecc = (o.ecc === undefined) ? 1e-3 : o.ecc, perOrbit = o.perOrbit || 20000, K = o.K || 10;
  const a0 = k / (r0 * r0 * r0), vphi = Math.sqrt(GM * (1 + a0) / r0);
  const T = 2 * Math.PI * Math.sqrt(r0 * r0 * r0 * (1 + a0) / GM), h = T / perOrbit;
  const f = (s) => { const [x, y, vx, vy] = s, r2 = x * x + y * y, r = Math.sqrt(r2), a = k / (r2 * r), g = GM / (r2 * r), w = 1 / (1 + a);
    return [vx * w, vy * w, -g * x, -g * y]; };
  const step = (s, dt) => { const k1 = f(s), s2 = s.map((v, i) => v + 0.5 * dt * k1[i]), k2 = f(s2), s3 = s.map((v, i) => v + 0.5 * dt * k2[i]), k3 = f(s3),
    s4 = s.map((v, i) => v + dt * k3[i]), k4 = f(s4); return s.map((v, i) => v + dt * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]) / 6); };
  const sv = (s) => s[0] * s[2] + s[1] * s[3];
  let s = [r0, 0, ecc * Math.sqrt(GM / r0), vphi], turns = 0, rawPrev = 0;   // 角は atan2 + 2π·周回数(加算の累積で丸めを溜めない)
  const peri = [];
  const h0 = sv(s);
  const angleOf = (z) => { const raw = Math.atan2(z[1], z[0]); return raw + 2 * Math.PI * (turns + ((raw < rawPrev - Math.PI) ? 1 : 0)); };
  let hMax = 0;
  for (let n = 0; n < perOrbit * (K + 2) && peri.length < K + 1; n++) {
    const s1 = step(s, h);
    const a = sv(s), b = sv(s1);
    if (a < 0 && b >= 0) {                     // 近点の刻み —— 部分步 τ を Illinois 法(はさみうち)で詰める
      let lo = 0, hi = h, flo = a, fhi = b, side = 0, t = h;
      for (let it = 0; it < 80; it++) {
        t = (fhi - flo !== 0) ? (lo * fhi - hi * flo) / (fhi - flo) : 0.5 * (lo + hi);
        if (!(t > lo && t < hi)) t = 0.5 * (lo + hi);
        const fz = sv(step(s, t));
        if (fz === 0 || hi - lo < 1e-15 * h) break;
        if (fz < 0) { lo = t; flo = fz; if (side === -1) fhi *= 0.5; side = -1; }
        else { hi = t; fhi = fz; if (side === 1) flo *= 0.5; side = 1; }
      }
      const t1 = t;
      peri.push(angleOf(step(s, t1)));
    }
    const raw1 = Math.atan2(s1[1], s1[0]); if (raw1 < rawPrev - Math.PI) turns++; rawPrev = raw1;
    s = s1;
    const hz = s[0] * s[3] - s[1] * s[2]; hMax = Math.max(hMax, Math.abs(hz - (r0 * vphi)) / (r0 * vphi));
  }
  const dw = (peri.length >= 2) ? (peri[peri.length - 1] - peri[0]) / (peri.length - 1) - 2 * Math.PI : null;
  return { a: a0, dw, analytic: kernelPrecessionAnalytic(a0), approx3pia: 3 * Math.PI * a0, nPeri: peri.length, perOrbit, K,
    rel: (dw === null) ? null : Math.abs(dw - kernelPrecessionAnalytic(a0)) / Math.abs(kernelPrecessionAnalytic(a0)), hDrift: hMax, xv0: h0 };
}

/** a の掃引(r0 = 1・GM = 1 —— a = k)。 */
export const KERNEL_A = Object.freeze([1e-4, 1e-3, 1e-2]);
/** r 依存の宣言: GM/c² = 1e-4・基準半径 r_ref = 1 で 3πk = 6πGM/c² に合わせる(k = 2 GM r_ref²/c²)。 */
export const KERNEL_R = Object.freeze({ GMc2: 1e-4, rRef: 1, radii: Object.freeze([0.5, 1, 2, 4, 8]) });

export function kernelTables() {
  const sweep = KERNEL_A.map((a) => kernelOrbitPrecession({ GM: 1, k: a, r0: 1 }));
  const kFit = 2 * KERNEL_R.GMc2 * KERNEL_R.rRef * KERNEL_R.rRef;
  const radial = KERNEL_R.radii.map((r0) => {
    const run = kernelOrbitPrecession({ GM: 1, k: kFit, r0 });
    const gr = grPrecession(KERNEL_R.GMc2, r0);
    return { r0, a: run.a, dw: run.dw, analytic: run.analytic, rel: run.rel, gr, ratio: run.dw / gr, ratioAnalytic: run.analytic / gr,
      powerLawRef: (KERNEL_R.rRef / r0) * (KERNEL_R.rRef / r0) };
  });
  return { sweep, kFit, radial };
}

/** 単体試験(閉じた式の自己整合)。 */
export function selfTest() {
  const checks = {};
  // 3πa の極限: a → 0 で Δϖ/(3πa) → 1(a = 1e-6 で相対 ~ a)
  checks.smallA = Math.abs(kernelPrecessionAnalytic(1e-6) / (3 * Math.PI * 1e-6) - 1) < 1e-5;
  // a = 0 で歳差 0(ニュートン)
  const z = kernelOrbitPrecession({ GM: 1, k: 0, r0: 1, K: 3 });
  checks.newtonZero = Math.abs(z.dw) < 1e-9;
  // Simpson が cosθ の積分(= 2)を出す
  checks.simpson = Math.abs(simpson(Math.cos, -Math.PI / 2, Math.PI / 2) - 2) < 1e-12;
  // e7r の ln n は U に線形(Born の係数は強さに依らない)
  checks.e7rLinear = Math.abs(bornDeflectionCoeff('e7r', 1e-3) - 4) < 1e-12;
  return { ok: Object.values(checks).every(Boolean), checks };
}
