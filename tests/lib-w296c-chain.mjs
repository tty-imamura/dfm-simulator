// 第296便c(原仮定者の裁定(第86報)「geoPN=4 のサンプルは、多粒子での、磁石に付いたパチンコ玉のように連鎖する引きずりを実装する」・
// 統括の検証項目 R159)—— **連鎖引きずりの純関数**(Node だけ)。
//
// ■ 何を置くか
//   連鎖そのものは既存の全体 solve (I+L)u = s(第293便e —— s_i = Σ_j a_ij (v_j − v_i)・直接つながらない粒へも中間の粒を通じて伝わる)が持つ。
//   本便がエンジンに足したのは 2 つ:
//   (1) 解法 `inertialDragPCG`(宣言 physics.relativeDrag.solver:"network-pcg-v1")—— 辺 c_ij = m_i a_ij が対称なので M(I+L) は対称正定値。
//       z_i = √m_i u_i の対角相似で対称化した系の対角前処理の共役勾配法。収束の判定は元の式 (I+L)u = s を再評価した残差。
//   (2) 自転する源 `inertialSpinMoment`(宣言 spinSource:"surfaceFlip")—— 源 j の速度 V_j + Ω_j×ρ を宣言半径 R の一様球で体積平均した
//       接線成分 C m_j Ω_j M1(r)(ẑ×ê)・M1 = ⟨K_ε(|d−ρ|)(ρ·ê)⟩(第280便b の表裏核と同じ形 —— 核だけが慣性決定力の K_ε)。
//   この lib は **エンジンの 2 関数を html のソース文字列から取り出して**評価する(写しを持たない —— `makeChainPure`)。比べる相手は
//   この lib の**独立な実装**: 直接法(部分ピボットのガウス消去)・辺の表からの行列・一様球の独立な 2 次元求積 `sphere2DK`
//   (第280便b の `sphere2D` と同じ組み方 —— s と μ を両方数値で積む。核を引数にした一般化で、p=2 の核では `sphere2D` の G と同じ数になる)。
//
// ■ しないこと・言わないこと
//   ・隣の u を再加算する緩和反復は作らない(同じ引きずりを二度数えない)・固定回数の反復を収束と呼ばない・距離で辺を切らない(本便は全対)。
//   ・円盤の形成・回転曲線・「銀河ができた」とは言わない(連鎖が外へ伝わる原理だけ)。冪は積で書く(tests/README §1)。
import { extractTopFunctions } from './lib-w279c-bgcompose.mjs';

export const CHAIN_LIB_VERSION = 'w296c-chain-lib-1';
export const PURE_NAMES = ['dfmGaussLegendre01', 'inertialSpinMoment', 'inertialDragPCG'];

/** html の 3 関数を 1 つのスコープで組み立てる(html と同じ本文)。 */
export function makeChainPure(html) {
  const src = extractTopFunctions(html, PURE_NAMES);
  for (const k of PURE_NAMES) if (!src[k]) throw new Error('html に ' + k + ' が無い');
  // eslint-disable-next-line no-new-func
  const f = new Function(PURE_NAMES.map((k) => src[k]).join('\n') + '\nreturn {' + PURE_NAMES.join(',') + '};');
  const o = f();
  o.sources = src;
  return o;
}

/** 核 K_ε(r) = r/(r²+ε²)²(エンジンの点源と同じ順序)。 */
export function kernelK(r, eps) { const s = r * r + eps * eps; return r / (s * s); }
/** 第280便b の p=2 の核 1/(r²+ε²)。 */
export function kernelP2(r, eps) { return 1 / (r * r + eps * eps); }

/**
 * 辺の表 [[i, j, c_ij], …](c は対称な辺の重み)から a_ij = c_ij/m_i の行列を作る。同じ対が 2 度ある・自己辺・範囲外は拒否。
 * 戻り値 { ok, err?, A(Float64Array n²), DG }
 */
export function graphFromEdges(n, m, edges) {
  const A = new Float64Array(n * n), DG = new Float64Array(n), seen = new Set();
  for (const e of edges) {
    const [i, j, c] = e;
    if (!(Number.isInteger(i) && Number.isInteger(j)) || i < 0 || j < 0 || i >= n || j >= n || i === j) return { ok: false, err: 'bad edge ' + JSON.stringify(e) };
    if (!(c >= 0) || !Number.isFinite(c)) return { ok: false, err: 'bad weight ' + JSON.stringify(e) };
    const key = Math.min(i, j) * n + Math.max(i, j);
    if (seen.has(key)) return { ok: false, err: 'duplicate edge [' + Math.min(i, j) + ',' + Math.max(i, j) + ']' };
    seen.add(key);
    A[i * n + j] = c / m[i]; A[j * n + i] = c / m[j];
  }
  for (let i = 0; i < n; i++) { let d = 0; for (let j = 0; j < n; j++) if (j !== i) d += A[i * n + j]; DG[i] = d; }
  return { ok: true, A, DG };
}

/** s_i = Σ_j a_ij (v_j − v_i)(受け取らない行は 0)。 */
export function sourceOf(n, A, VX, VY, FX) {
  const SX = new Float64Array(n), SY = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    if (FX[i]) continue;
    let sx = 0, sy = 0;
    for (let j = 0; j < n; j++) { if (j === i) continue; const a = A[i * n + j]; if (a !== 0) { sx += a * (VX[j] - VX[i]); sy += a * (VY[j] - VY[i]); } }
    SX[i] = sx; SY[i] = sy;
  }
  return { SX, SY };
}

/** 独立な直接法(部分ピボットのガウス消去 —— 受け取らない行は u=0 に固定)。 */
export function directSolve(n, A, DG, FX, SX, SY) {
  const M = new Float64Array(n * n), bx = new Float64Array(n), by = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) M[i * n + j] = FX[i] ? 0 : -A[i * n + j];
    M[i * n + i] = FX[i] ? 1 : 1 + DG[i];
    bx[i] = FX[i] ? 0 : SX[i]; by[i] = FX[i] ? 0 : SY[i];
  }
  const P = [...Array(n).keys()];
  for (let k = 0; k < n; k++) {
    let p = k, best = Math.abs(M[P[k] * n + k]);
    for (let i = k + 1; i < n; i++) { const v = Math.abs(M[P[i] * n + k]); if (v > best) { best = v; p = i; } }
    [P[k], P[p]] = [P[p], P[k]];
    const pk = M[P[k] * n + k];
    for (let i = k + 1; i < n; i++) {
      const r = P[i], f = M[r * n + k] / pk;
      if (f === 0) continue;
      for (let j = k; j < n; j++) M[r * n + j] -= f * M[P[k] * n + j];
      bx[r] -= f * bx[P[k]]; by[r] -= f * by[P[k]];
    }
  }
  const UX = new Float64Array(n), UY = new Float64Array(n);
  for (let k = n - 1; k >= 0; k--) {
    const r = P[k];
    let sx = bx[r], sy = by[r];
    for (let j = k + 1; j < n; j++) { sx -= M[r * n + j] * UX[j]; sy -= M[r * n + j] * UY[j]; }
    UX[k] = sx / M[r * n + k]; UY[k] = sy / M[r * n + k];
  }
  return { UX, UY };
}

/** 元の式の残差 2 通り: ∞(max_i max(|r_x|,|r_y|)/max_i|s_i| —— エンジンの帳簿と同じ)と 2(‖r‖₂/‖s‖₂)。 */
export function residualOf(n, A, DG, FX, SX, SY, UX, UY) {
  let rMax = 0, sMax = 0, r2 = 0, s2 = 0;
  for (let i = 0; i < n; i++) {
    if (FX[i]) continue;
    const d = 1 + DG[i];
    let rx = d * UX[i] - SX[i], ry = d * UY[i] - SY[i];
    for (let j = 0; j < n; j++) { if (j === i) continue; const a = A[i * n + j]; if (a !== 0) { rx -= a * UX[j]; ry -= a * UY[j]; } }
    rMax = Math.max(rMax, Math.abs(rx), Math.abs(ry)); r2 += rx * rx + ry * ry;
    sMax = Math.max(sMax, Math.hypot(SX[i], SY[i])); s2 += SX[i] * SX[i] + SY[i] * SY[i];
  }
  return { inf: sMax > 0 ? rMax / sMax : rMax, two: s2 > 0 ? Math.sqrt(r2 / s2) : Math.sqrt(r2) };
}

/** 作業配列(エンジンの S._rdPW と同じ形)。 */
export function work(n) { const W = []; for (let k = 0; k < 8; k++) W.push(new Float64Array(n)); return W; }

/** エンジンの PCG(取り出した関数)を呼ぶ。 */
export function pcgSolve(P, n, m, A, DG, FX, SX, SY, tol, maxIter) {
  const UX = new Float64Array(n), UY = new Float64Array(n);
  const r = P.inertialDragPCG(A, DG, m, FX, SX, SY, UX, UY, n, tol, maxIter, work(n));
  return Object.assign({ UX, UY }, r);
}

export const maxDiff = (a, b) => { let d = 0; for (let i = 0; i < a.length; i++) d = Math.max(d, Math.abs(a[i] - b[i])); return d; };
export const maxAbs = (a) => { let d = 0; for (let i = 0; i < a.length; i++) d = Math.max(d, Math.abs(a[i])); return d; };

/**
 * 一様球の独立な 2 次元求積(第280便b の `sphere2D` と同じ組み方 —— s と μ を両方数値で積む・M=1・Ω=1・半径 R)。
 * 核 kfn(d, eps) を引数にした一般化: G = (1/V)∫∫ 2π s² · (s μ) · kfn(√(r²+s²−2rsμ), ε) dμ ds(体積平均・単位質量あたり)。
 * kfn = kernelP2・R=1 で第280便b の `sphere2D(P, pr〔compact〕, r, ε)` の G と同じ数(密度は ∫ρdV=1 の一様)。
 */
function glNodes(n) {
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
  return { x, w };
}
function gradedPanels(lo, hi, focus, scale) {
  const pts = [lo, hi];
  for (let d = scale; d < hi - lo; d *= 2) { const p = focus === hi ? hi - d : lo + d; if (p > lo && p < hi) pts.push(p); }
  pts.sort((a, b) => a - b);
  return pts;
}
export function sphere2DK(kfn, r, eps, R, nPts) {
  // 無次元(半径 1)で積んで戻す: ρ = 3/(4π)(∫ρdV=1)
  const rr = r / R, ee = eps / R;
  const g = glNodes(nPts || 48);
  const focus = rr < 1 ? rr : 1;
  const scaleS = Math.max(rr < 1 ? ee : Math.hypot(rr - 1, ee), 1e-12);
  const sP = [0, 1];
  if (rr < 1 && rr > 0) sP.push(rr);
  for (let d = scaleS; d < 1; d *= 2) { if (focus - d > 0) sP.push(focus - d); if (focus + d < 1) sP.push(focus + d); }
  sP.sort((a, b) => a - b);
  const rho = 3 / (4 * Math.PI);
  let G = 0;
  for (let i = 0; i < sP.length - 1; i++) {
    const a = sP[i], b = sP[i + 1];
    if (!(b > a)) continue;
    for (let k = 0; k < g.x.length; k++) {
      const s = 0.5 * (a + b) + 0.5 * (b - a) * g.x[k], ws = 0.5 * (b - a) * g.w[k];
      const muScale = Math.max(((rr - s) * (rr - s) + ee * ee) / (2 * rr * s), 1e-14);
      const mP = gradedPanels(-1, 1, 1, muScale);
      let ia = 0;
      for (let j = 0; j < mP.length - 1; j++) {
        const c = mP[j], d = mP[j + 1];
        for (let q = 0; q < g.x.length; q++) {
          const mu = 0.5 * (c + d) + 0.5 * (d - c) * g.x[q], wm = 0.5 * (d - c) * g.w[q];
          const dd = Math.sqrt(Math.max(rr * rr + s * s - 2 * rr * s * mu, 0));
          ia += wm * mu * kfn(dd, ee);
        }
      }
      G += ws * 2 * Math.PI * rho * s * s * s * ia;
    }
  }
  // 次元を戻す: ⟨K(d)(ρ·ê)⟩ —— 長さ R の尺度で K は核の次元、ρ·ê は R 倍
  const kScale = kfn === kernelK ? 1 / (R * R * R) : 1 / (R * R);
  return G * kScale * R;
}

/** 一様乱数(LCG —— 種で決まる)。 */
export function lcg(seed) { let z = seed >>> 0; return () => { z = (Math.imul(z, 1664525) + 1013904223) >>> 0; return z / 4294967296; }; }

/**
 * 環の網: layers 層 × per 点(半径 1,2,…)。辺は隣接層の同じ角の点(重み wAdj)と同層の隣の点(重み wSame)。質量 1。
 * 最内層は規定運動(pinned —— 接線速度 vIn・受け取らない)・ほかは v=0。cut = [L, L+1](1 始まり)の層間の辺を切る。
 */
export function ringNetwork(o) {
  const L = o.layers || 4, K = o.per || 16, n = L * K, wAdj = o.wAdj ?? 100, wSame = o.wSame ?? 10, vIn = o.vIn ?? 1;
  const x = new Float64Array(n), y = new Float64Array(n), VX = new Float64Array(n), VY = new Float64Array(n), FX = new Uint8Array(n), m = new Float64Array(n).fill(1);
  const idx = (l, k) => l * K + k;
  for (let l = 0; l < L; l++) for (let k = 0; k < K; k++) {
    const th = 2 * Math.PI * k / K, r = l + 1, i = idx(l, k);
    x[i] = r * Math.cos(th); y[i] = r * Math.sin(th);
    if (l === 0) { FX[i] = 1; VX[i] = -vIn * Math.sin(th); VY[i] = vIn * Math.cos(th); }
  }
  const edges = [];
  for (let l = 0; l < L; l++) for (let k = 0; k < K; k++) {
    edges.push([idx(l, k), idx(l, (k + 1) % K), wSame]);
    if (l + 1 < L && !(o.cut && o.cut[0] === l + 1 && o.cut[1] === l + 2)) edges.push([idx(l, k), idx(l + 1, k), wAdj]);
  }
  return { n, L, K, x, y, VX, VY, FX, m, edges };
}
/** 層ごとの平均接線成分(u と W = v + u)。 */
export function layerTangential(net, UX, UY) {
  const out = [];
  for (let l = 0; l < net.L; l++) {
    let su = 0, sw = 0;
    for (let k = 0; k < net.K; k++) {
      const i = l * net.K + k, r = Math.hypot(net.x[i], net.y[i]), tx = -net.y[i] / r, ty = net.x[i] / r;
      su += UX[i] * tx + UY[i] * ty; sw += (net.VX[i] + UX[i]) * tx + (net.VY[i] + UY[i]) * ty;
    }
    out.push({ layer: l + 1, uT: su / net.K, wT: sw / net.K });
  }
  return out;
}
