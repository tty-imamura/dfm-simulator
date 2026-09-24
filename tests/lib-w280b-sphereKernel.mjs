// 第280便b(原仮定者の裁定〔第70報〕・統括の読み R69)— **表裏核**(球体の表側と裏側を積分した複素モーメント)の検算(純関数)。
//
// ■ 何をするか
//   `beta/index.html` の純関数 `dfmSphereProfile`・`dfmSphereKernelRadial`・`dfmSphereKernelMomentsOf`・`dfmSphereKernelQEff`
//   (と 第279便c の合成 `dfmBlendComplexMoments`・RHS `dfmMeshVelocityRHS`)を **html のソース文字列から取り出して**
//   node で評価し(写しを持たない)、次の検算を並べる:
//     (a) 遠方で W→M/r²・A_φ→L/r³(L=IΩ —— 剛体)の相対誤差
//     (b) 求積の収束(区間あたりの点数 8/16/32/64)と、**独立な 2 次元求積**(s と μ=cosθ の両方を数値で積む)との差
//     (c) 表面近く r/R=1.05〜1.5 の u_φ と角速度 u_φ/r(密度 β=0/1/3 と 4 クラス)
//     (d) q_eff = −d ln(u_φ/r)/d ln r の距離依存(W_bg=0 と W_bg>0)
//     (e) 地球(実単位)で参照距離 a=月 の現行核 (R/(R+a))^q と表裏核の振幅の比(**c² 抑制は表裏核に無い**)
//     (f) 中心 r→0 で A_spin→0・表面付近の急峻さ
//     (g) 微分(∇W・∇A・∂ₜW・∂ₜA)の中心差分との一致と、合成 `dfmBlendComplexMoments` への受け渡し
//
// ■ しないこと
//   ・html を書き換えない・判定しない(数を並べるだけ —— 合否は QA が出す)。
//   ・q を fit しない・旧 q に振幅を合わせない・弱場振幅(c² 抑制)を導出したとは書かない(導出できていない)。
import { extractTopFunctions } from './lib-w279c-bgcompose.mjs';

export const SPHEREKERNEL_LIB_VERSION = 'w280b-sphereKernel-1';
export const PURE_NAMES = ['isNum', 'dfmGaussLegendre01', 'dfmLaneEmden', 'dfmSphereProfile', 'dfmSphereRho', 'dfmSphereOmega',
  'dfmSphereKernelRadial', 'dfmSphereKernelMomentsOf', 'dfmAddMoments', 'dfmSphereKernelQEff',
  'dfmComplexMomentsOf', 'dfmBlendComplexMoments', 'dfmMeshVelocityRHS'];

/** 取り出した関数を 1 つのスコープで組み立てる(html と同じ本文)。 */
export function makePure(html) {
  const src = extractTopFunctions(html, PURE_NAMES);
  for (const k of PURE_NAMES) if (!src[k]) throw new Error('html に ' + k + ' が無い');
  // eslint-disable-next-line no-new-func
  const f = new Function(PURE_NAMES.map((k) => src[k]).join('\n') + '\nreturn {' + PURE_NAMES.join(',') + '};');
  const o = f();
  o.sources = src;
  return o;
}

/** 検算に使う密度の宣言(クラス 4 種 + gas の β=0/1/3)。solid の値は形の例示(出典は決断事項)。 */
export const CLASS_DECLS = [
  { key: 'solid', decl: { densityClass: 'solid', densityProfile: { coreFrac: 0.546, coreRatio: 2.44 } } },
  { key: 'gas-b0', decl: { densityClass: 'gas', densityProfile: { beta: 0 } } },
  { key: 'gas-b1', decl: { densityClass: 'gas', densityProfile: { beta: 1 } } },
  { key: 'gas-b3', decl: { densityClass: 'gas', densityProfile: { beta: 3 } } },
  { key: 'star-n3', decl: { densityClass: 'star', densityProfile: { polyN: 3 } } },
  { key: 'compact', decl: { densityClass: 'compact' } },
  { key: 'solid-shellular', decl: { densityClass: 'solid', densityProfile: { coreFrac: 0.546, coreRatio: 2.44 },
    rotationProfile: { law: 'shellular', centerRatio: 2 } } },
];

/* ─────────────── 独立な 2 次元求積(s と μ の両方を数値で —— 方位の閉じた式を使わない) ─────────────── */
function glNodes(n) {
  // 独立に組む(html の dfmGaussLegendre01 を使わない)—— 固有値でなく Newton 法だが別実装
  const x = [], w = [];
  for (let i = 1; i <= n; i++) {
    let z = Math.cos(Math.PI * (i - 0.25) / (n + 0.5)), dp = 0;
    for (let it = 0; it < 200; it++) {
      let p0 = 1, p1 = z;
      for (let k = 2; k <= n; k++) { const p2 = ((2 * k - 1) * z * p1 - (k - 1) * p0) / k; p0 = p1; p1 = p2; }
      dp = n * (z * p1 - p0) / (z * z - 1);
      const dz = p1 / dp; z -= dz;
      if (Math.abs(dz) < 1e-16) break;
    }
    x.push(z); w.push(2 / ((1 - z * z) * dp * dp));
  }
  return { x, w };   // [-1,1]
}
function gradedPanels(lo, hi, focus, scale) {
  // [lo,hi] を focus(区間端)へ向けて等比に分ける(最小幅 ≈ scale)
  const pts = [lo, hi];
  for (let d = scale; d < hi - lo; d *= 2) { const p = focus === hi ? hi - d : lo + d; if (p > lo && p < hi) pts.push(p); }
  pts.sort((a, b) => a - b);
  return pts;
}
/**
 * 独立な 2 次元求積: W = ∫∫ 2π ρ s² /(r²+s²+ε²−2rsμ) dμ ds・A_φ = ∫∫ 2π ρ Ω s³ μ /(…) dμ ds(M=R=Ω_表面=1)。
 * 密度の形は html の dfmSphereRho/Omega(宣言された物理入力そのもの)を読むが、方位の積分は数値で行う。
 */
export function sphere2D(P, pr, r, eps, nPts) {
  const g = glNodes(nPts || 48);
  const focus = r < 1 ? r : 1;
  const scaleS = Math.max(r < 1 ? eps : Math.hypot(r - 1, eps), 1e-12);
  const sP = [0, 1].concat(pr.breaks);
  if (r < 1 && r > 0) sP.push(r);
  for (let d = scaleS; d < 1; d *= 2) { if (focus - d > 0) sP.push(focus - d); if (focus + d < 1) sP.push(focus + d); }
  sP.sort((a, b) => a - b);
  let W = 0, G = 0;
  for (let i = 0; i < sP.length - 1; i++) {
    const a = sP[i], b = sP[i + 1];
    if (!(b > a)) continue;
    for (let k = 0; k < g.x.length; k++) {
      const s = 0.5 * (a + b) + 0.5 * (b - a) * g.x[k], ws = 0.5 * (b - a) * g.w[k];
      const rho = P.dfmSphereRho(pr, s), om = P.dfmSphereOmega(pr, s);
      if (rho === 0) continue;
      // μ の区間: μ=1 側(近い側)へ等比に
      const muScale = Math.max(((r - s) * (r - s) + eps * eps) / (2 * r * s), 1e-14);
      const mP = gradedPanels(-1, 1, 1, muScale);
      let iw = 0, ia = 0;
      for (let j = 0; j < mP.length - 1; j++) {
        const c = mP[j], d = mP[j + 1];
        for (let q = 0; q < g.x.length; q++) {
          const mu = 0.5 * (c + d) + 0.5 * (d - c) * g.x[q], wm = 0.5 * (d - c) * g.w[q];
          const den = r * r + s * s + eps * eps - 2 * r * s * mu;
          iw += wm / den; ia += wm * mu / den;
        }
      }
      W += ws * 2 * Math.PI * rho * s * s * iw;
      G += ws * 2 * Math.PI * rho * om * s * s * s * ia;
    }
  }
  return { W, G };
}

/** 一様球の W の閉じた式(ε=0・r>1)—— (3/(2r))[r + (1−r²)/2·ln((r+1)/(r−1))] */
export function uniformWExact(r) { return (3 / (2 * r)) * (r + (1 - r * r) / 2 * Math.log((r + 1) / (r - 1))); }

const rel = (a, b) => (b !== 0 ? (a - b) / b : a);

/* ─────────────── (a) 遠方 ─────────────── */
export function farField(P) {
  const rows = [];
  for (const c of CLASS_DECLS) {
    const pr = P.dfmSphereProfile(c.decl, 32);
    for (const r of [10, 100, 1000, 10000]) {
      const z = P.dfmSphereKernelRadial(pr, r, 0);
      rows.push({ key: c.key, r, kI: pr.kI, kL: pr.kL, WRel: rel(z.W * r * r, 1), ARel: rel(z.G * r * r * r, pr.kL) });
    }
  }
  return rows;
}

/* ─────────────── (b) 求積の収束 ─────────────── */
export function convergence(P) {
  const rows = [];
  for (const c of CLASS_DECLS) {
    for (const [r, eps] of [[1.05, 0], [1.5, 0], [10, 0], [1.001, 0], [0.5, 0.05]]) {
      const v = {};
      for (const nd of [8, 16, 32, 64]) {
        const pr = P.dfmSphereProfile(c.decl, nd);
        const z = P.dfmSphereKernelRadial(pr, r, eps);
        v[nd] = { W: z.W, G: z.G, dW: z.dW, dG: z.dG, nNodes: z.nNodes };
      }
      const pr64 = P.dfmSphereProfile(c.decl, 64);
      const d2a = sphere2D(P, pr64, r, eps, 48), d2b = sphere2D(P, pr64, r, eps, 64);
      const ref = v[64];
      const rd = (a, b) => Math.abs(a - b) / Math.max(Math.abs(b), 1e-300);
      rows.push({ key: c.key, r, eps,
        W8: rd(v[8].W, ref.W), W16: rd(v[16].W, ref.W), W32: rd(v[32].W, ref.W),
        G8: rd(v[8].G, ref.G), G16: rd(v[16].G, ref.G), G32: rd(v[32].G, ref.G),
        dW16: rd(v[16].dW, ref.dW), dG16: rd(v[16].dG, ref.dG),
        twoD48: { W: rd(d2a.W, ref.W), G: rd(d2a.G, ref.G) }, twoD64: { W: rd(d2b.W, ref.W), G: rd(d2b.G, ref.G) },
        nodes16: v[16].nNodes, nodes64: v[64].nNodes,
        uniformExact: (c.key === 'gas-b0' || c.key === 'compact') && eps === 0 && r > 1 ? rd(ref.W, uniformWExact(r)) : null });
    }
  }
  return rows;
}

/* ─────────────── (c) 表面近く ─────────────── */
export function nearSurface(P) {
  const rows = [];
  for (const c of CLASS_DECLS) {
    const pr = P.dfmSphereProfile(c.decl, 32);
    for (const r of [1.05, 1.1, 1.2, 1.5]) {
      const q = P.dfmSphereKernelQEff(pr, r, 0, 0);
      rows.push({ key: c.key, r, uphi: q.uphi, omegaU: q.omegaU, qEff: q.qEff, kI: pr.kI, rhoCenterOverMean: pr.rhoCenterOverMean });
    }
  }
  return rows;
}

/* ─────────────── (d) q_eff の距離依存 ─────────────── */
export const QEFF_R = [1.05, 1.2, 1.5, 2, 3, 5, 10, 30, 100, 1000, 10000];
export function qEffTable(P) {
  const rows = [];
  for (const key of ['solid', 'gas-b0', 'gas-b3', 'star-n3']) {
    const c = CLASS_DECLS.find((z) => z.key === key);
    const pr = P.dfmSphereProfile(c.decl, 32);
    for (const Wbg of [0, 1e-4, 1]) {
      rows.push({ key, Wbg, q: QEFF_R.map((r) => P.dfmSphereKernelQEff(pr, r, 0, Wbg).qEff) });
    }
  }
  return rows;
}

/* ─────────────── (e) 地球(実単位)で現行核と比べる ─────────────── */
// 🌘 の実値(1 単位 = 10⁶ m / 10² s / 10²⁵ kg): R=6.38・M=0.59724・Ω=0.0072921・a=363.6253(月の初期距離 = qLock の参照)・
// G=6.674・c₀=3×10⁴・q_exact=8.2358。太陽の背景 W_bg = M_☉/AU²(M_☉=198850・AU=149597.87 —— 🔆 の 10²⁷ kg・10⁸ m を換算)
export const EARTH = { R: 6.38, M: 0.59724, Om: 0.0072921, a: 363.6253, G: 6.674, c: 3e4, q: 8.2358, Msun: 198850, AU: 149597.87 };
export function earthCompare(P) {
  const E = EARTH, out = [];
  const cur = Math.pow(E.R / (E.R + E.a), E.q);                           // 現行核の振幅 ω(a)/Ω
  const lt = 0.8 * E.G * E.M * E.R * E.R / (E.c * E.c * E.a * E.a * E.a);  // Ω_LT(a)/Ω(一様球 I=0.4MR²)
  const WbgSun = E.Msun / (E.AU * E.AU), WE = E.M / (E.a * E.a);
  for (const key of ['solid', 'gas-b0', 'star-n3']) {
    const c = CLASS_DECLS.find((z) => z.key === key);
    const pr = P.dfmSphereProfile(c.decl, 32);
    for (const [bgName, Wbg] of [['none', 0], ['sun', WbgSun]]) {
      const WbgHat = Wbg / (E.M / (E.R * E.R));                          // 無次元(M/R² 単位)
      const q = P.dfmSphereKernelQEff(pr, E.a / E.R, 0, WbgHat);
      const fb = q.omegaU;                                                // Ω_u(a)/Ω(無次元の角速度 = u_φ/(rΩ))
      out.push({ key, background: bgName, WbgOverWearth: Wbg / WE, frontBackAmp: fb, currentAmp: cur, ltAmp: lt,
        ratioFrontBackToCurrent: fb / cur, ratioFrontBackToLT: fb / lt, qEffAtA: q.qEff,
        qEquivalent: Math.log(fb) / Math.log(E.R / (E.R + E.a)),
        uphiMS: q.uphi * E.Om * E.R * 1e4 });   // u_φ [m/s](速度 1 単位 = 10⁴ m/s)
    }
  }
  return { cur, lt, WbgSun, WE, rows: out };
}

/* ─────────────── (f) 中心と表面付近 ─────────────── */
export function centerTable(P) {
  const rows = [];
  for (const key of ['gas-b0', 'solid']) {
    const c = CLASS_DECLS.find((z) => z.key === key);
    const pr = P.dfmSphereProfile(c.decl, 32);
    for (const eps of [0.05, 0.2]) {
      const pts = [0, 1e-3, 0.01, 0.1, 0.5, 0.9, 1, 1.05, 1.5, 2].map((r) => {
        const z = P.dfmSphereKernelRadial(pr, r, eps);
        return { r, W: z.W, G: z.G, uphi: z.G / z.W, omegaU: r > 0 ? z.G / z.W / r : z.dG / z.W };
      });
      rows.push({ key, eps, pts });
    }
  }
  const pr = P.dfmSphereProfile(CLASS_DECLS[0].decl, 16);
  const reject = [[0.5, 0], [1, 0], [0, 0]].map(([r, e]) => ({ r, eps: e, ok: P.dfmSphereKernelRadial(pr, r, e).ok }));
  return { rows, reject };
}

/* ─────────────── (g) 微分と合成への受け渡し ─────────────── */
export function derivativeChecks(P) {
  const rows = [];
  const pr = P.dfmSphereProfile(CLASS_DECLS[0].decl, 32);
  const B = (x, y) => ({ m: 1.7, R: 0.8, spin: 0.37, x, y, vx: 0.21, vy: -0.13, ax: 0.011, ay: 0.007, prof: pr, epsC: 0 });
  for (const [px, py] of [[2.1, 0.7], [-1.3, 1.9], [0.2, -3.5], [9, 4]]) {
    const m0 = P.dfmSphereKernelMomentsOf([B(0.1, -0.2)], px, py);
    const h = 1e-5;
    const mx = (d) => P.dfmSphereKernelMomentsOf([B(0.1, -0.2)], px + d, py), my = (d) => P.dfmSphereKernelMomentsOf([B(0.1, -0.2)], px, py + d);
    const fdW = [(mx(h).W - mx(-h).W) / (2 * h), (my(h).W - my(-h).W) / (2 * h)];
    const fdA = [(mx(h).A[0] - mx(-h).A[0]) / (2 * h), (my(h).A[0] - my(-h).A[0]) / (2 * h),
      (mx(h).A[1] - mx(-h).A[1]) / (2 * h), (my(h).A[1] - my(-h).A[1]) / (2 * h)];
    // 時間微分: 源を V・a で動かしたときの点の値の変化(中心差分)。
    const at = (t) => { const b = B(0.1 + 0.21 * t + 0.5 * 0.011 * t * t, -0.2 - 0.13 * t + 0.5 * 0.007 * t * t);
      b.vx = 0.21 + 0.011 * t; b.vy = -0.13 + 0.007 * t; return P.dfmSphereKernelMomentsOf([b], px, py); };
    const fdWt = (at(h).W - at(-h).W) / (2 * h), fdAt = [(at(h).A[0] - at(-h).A[0]) / (2 * h), (at(h).A[1] - at(-h).A[1]) / (2 * h)];
    const sc = (v) => Math.max(...v.map(Math.abs));
    const e = (a, b) => Math.max(...a.map((z, i) => Math.abs(z - b[i]))) / Math.max(sc(b), 1e-300);
    const loc = Object.assign({}, m0, { selfExcluded: true });
    const bl = P.dfmBlendComplexMoments(loc, null);
    const uSpin = [bl.u[0] - 0.21, bl.u[1] + 0.13];
    rows.push({ px, py, gradW: e(m0.gradW, fdW), gradA: e(m0.gradA, fdA), dWdt: Math.abs(m0.dWdt - fdWt) / Math.abs(fdWt),
      dAdt: e(m0.dAdt, fdAt), blendOk: bl.ok === true && bl.defined === true, chi: bl.chi,
      uSpinTangential: Math.abs(uSpin[0] * (px - 0.1) + uSpin[1] * (py + 0.2)) / (Math.hypot(...uSpin) * Math.hypot(px - 0.1, py + 0.2)) });
  }
  // 一様回転の極限: 剛体の自転 0 なら u は並進 V そのもの(点源と同じ)
  const z0 = P.dfmSphereKernelMomentsOf([Object.assign(B(0, 0), { spin: 0 })], 3, 1);
  const b0 = P.dfmBlendComplexMoments(Object.assign({}, z0, { selfExcluded: true }), null);
  return { rows, spinZeroU: b0.u, spinZeroGradU: b0.gradU };
}
