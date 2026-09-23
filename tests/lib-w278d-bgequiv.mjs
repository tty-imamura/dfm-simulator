// 第278便d(統括の読み R56)— **明示天体 ↔ 局所背景展開の一致試験**の純関数(エンジン未接続)。
//
// ■ 何を確かめるか(接続前に要る第 1 の確認)
//   同じ外部源(❄️🌘 は太陽・📻 は銀河の点質量)を
//     (EXP) **明示天体**として重み付き平均の源に入れた走行 と
//     (BG)  **局所背景展開**(W₀・A₀・∇W・∇A・∂ₜW・∂ₜA をある点で評価した値)として置いた走行
//   を**同じ純関数** `meshFieldNoD0`(tests/lib-w275b-meshfield.mjs)で作り、
//   相対軌道の ON/OFF 差(周期・位相・位置 —— 1 公転・RK4)が一致するかを測る。
//   一致しないなら**背景展開の側にどの項が欠けているか**を、項を 1 つずつ足す「はしご」で切り分ける:
//     L0ff 凍結(自由落下系 —— 第277便d の誤差予算と同じ置き方)
//     L0   凍結(慣性系)                          … 差 = 凍結する参照系
//     L1   重心の現在位置で毎回評価(時間の追従)   … 差 = 時間凍結
//     L2   + 値の位置の一次補正(W,A を各天体の位置へ 1 次で移す)
//     L3   各天体の位置で厳密に評価(二次以上の場の項)
//     +T   ニュートンの潮汐(一様重力 → 線形潮汐 T → 厳密な太陽重力)
//     R1/R2 反作用(太陽がニュートンで動く/さらに DFM の座標変換項を太陽も受ける)
//   **分解恒等式**: 源を明示天体として足した `meshFieldNoD0(局所+外部, norm "self")` と、
//   外部源の寄与を**その点で厳密に**評価した背景 `meshFieldNoD0(局所, norm "background", bg)` は
//   和の順序を除いて同じ量である(W と A は源について線形)。これは (N3) の規格化そのものの検算である。
//
// ■ しないこと
//   ・エンジンへ接続しない(`beta/index.html` の力学は 1 bit も触らない)。
//   ・閾値 1e−3σ_Buie を採用しない(各規格化で「その閾値ならどうか」を並べるだけ)。
//   ・D₀ を希釈項として戻さない(この lib は D₀ を 1 度も読まない)。
//   ・残差が小さくなる背景・係数を探索して「平衡」「較正」と呼ばない(W_eff は**逆算した診断値**)。
import { meshFieldNoD0, normalizeBackground, toComovingFrame } from './lib-w275b-meshfield.mjs';

export const BGEQUIV_VERSION = 'w278d-bgequiv-1';

/* ────────────────────────────────────────────────────────────────────────────
   (1) 外部源の寄与を「背景」の形で取り出す・分解恒等式
   ──────────────────────────────────────────────────────────────────────────── */

/**
 * 1 つ(または複数)の外部源の寄与を**背景の 6 成分**の形で返す(norm "self" の生の和)。
 * W₀=Σw・A₀=Σw u・∇W・∇A・∂ₜW・∂ₜA は源について線形なので、**そのまま (N3) の bg に入る**。
 */
export function sourceContribution(src, px, py, opts) {
  const o = opts || {};
  const list = Array.isArray(src) ? src : [src];
  const f = meshFieldNoD0(list, px, py, { p: o.p === undefined ? 2 : o.p,
    eps: o.eps === undefined ? 0 : o.eps, norm: 'self' });
  if (!f) return null;
  return { W0: f.W, A0: [f.A[0], f.A[1]], gradW: [f.gradW[0], f.gradW[1]],
    gradA: [f.gradA[0], f.gradA[1], f.gradA[2], f.gradA[3]], dWdt: f.dWdt,
    dAdt: [f.dAdt[0], f.dAdt[1]] };
}

/** 背景の全成分を f 倍する(外部源の質量を f 倍したのと同じ —— W₀ と A₀ は同じ源から来る)。 */
export function scaleBackground(bg, f) {
  const B = normalizeBackground(bg);
  if (!B || !Number.isFinite(f) || f < 0) return null;
  return { W0: B.W0 * f, A0: B.A0.map((z) => z * f), gradW: B.gradW.map((z) => z * f),
    gradA: B.gradA.map((z) => z * f), dWdt: B.dWdt * f, dAdt: B.dAdt.map((z) => z * f) };
}

/** **重みだけ**の背景(A₀・勾配・時間微分を 0 —— 分母の希釈だけを残す)。 */
export function weightOnlyBackground(bg) {
  const B = normalizeBackground(bg);
  if (!B) return null;
  return { W0: B.W0, A0: [0, 0], gradW: [0, 0], gradA: [0, 0, 0, 0], dWdt: 0, dAdt: [0, 0] };
}

/**
 * 値の**位置の一次補正**: 基準点で評価した背景を (dx,dy) だけ離れた点へ 1 次で移す。
 * W←W₀+∇W·d・A←A₀+∇A·d(∇A の並びは [∂ₓAx,∂_yAx,∂ₓAy,∂_yAy])。勾配と時間微分は基準点の値のまま。
 */
export function shiftBackground(bg, dx, dy) {
  const B = normalizeBackground(bg);
  if (!B) return null;
  const W0 = B.W0 + B.gradW[0] * dx + B.gradW[1] * dy;
  if (!(W0 >= 0)) return null;
  return { W0, A0: [B.A0[0] + B.gradA[0] * dx + B.gradA[1] * dy, B.A0[1] + B.gradA[2] * dx + B.gradA[3] * dy],
    gradW: B.gradW.slice(), gradA: B.gradA.slice(), dWdt: B.dWdt, dAdt: B.dAdt.slice() };
}

/**
 * **分解恒等式**(場の 1 点): 局所源 + 外部源を明示天体として足した場と、外部源を
 * その点で厳密に評価した背景として足した場の差(u・∇u・∂ₜu・χ の相対差)。
 */
export function decompositionIdentity(local, ext, px, py, opts) {
  const o = opts || {};
  const base = { p: o.p === undefined ? 2 : o.p, eps: o.eps === undefined ? 0 : o.eps };
  const a = meshFieldNoD0(local.concat(ext), px, py, Object.assign({}, base, { norm: 'self' }));
  const bg = sourceContribution(ext, px, py, base);
  if (!a || !bg) return null;
  const b = meshFieldNoD0(local, px, py, Object.assign({}, base, { norm: 'background', bg }));
  if (!b) return null;
  const rel = (x, y) => {
    let d = 0, s = 0;
    for (let i = 0; i < x.length; i++) { d = Math.max(d, Math.abs(x[i] - y[i])); s = Math.max(s, Math.abs(x[i])); }
    return s > 0 ? d / s : d;
  };
  return { uRel: rel(a.u, b.u), gradURel: rel(a.gradU, b.gradU), dUdtRel: rel(a.dUdt, b.dUdt),
    chiExplicit: a.chi, chiBackground: b.chi, Wexplicit: a.W, WbgPlusLocal: b.W0 + b.W,
    WRel: Math.abs(a.W - (b.W0 + b.W)) / a.W };
}

/* ────────────────────────────────────────────────────────────────────────────
   (2) 規格化候補(診断・採用しない)
   ──────────────────────────────────────────────────────────────────────────── */

/**
 * **局所遮蔽の仮説式**(源からの距離で重みを落とす): 点源の重み核を
 *   w(r) = M r^{−p} · exp(−r/λ)          … 単位は [M/L^p] のまま(λ は宣言する長さ)
 * に置き換えたときの、(D1) 幾何の点源背景の成分の変化。
 *   w 由来の成分(W₀・A₀・∂ₜA のうち w·a の部分)… × f      (f = exp(−r/λ))
 *   ∇w 由来の成分(∇W・∇A・∂ₜW)             … × f·(1 + r/(pλ))
 * **前提**: 背景は (D1)(∇W ⊥ 背景の相対速度 → ∂ₜW=0)の点源である(`dWdt` が 0 でなければ null)。
 * **D₀ を希釈項として戻す形はここに無い**(候補から外した —— R56)。
 */
export function shieldBackgroundPointSource(bg, r, lambda, p) {
  const B = normalizeBackground(bg);
  const pp = (p === undefined) ? 2 : Number(p);
  if (!B || !(r > 0) || !(lambda > 0) || !(pp > 0)) return null;
  if (B.dWdt !== 0) return null;
  const f = Math.exp(-r / lambda), g = f * (1 + r / (pp * lambda));
  return { W0: B.W0 * f, A0: B.A0.map((z) => z * f), gradW: B.gradW.map((z) => z * g),
    gradA: B.gradA.map((z) => z * g), dWdt: 0, dAdt: B.dAdt.map((z) => z * f),
    factorW: f, factorGrad: g };
}

/* ────────────────────────────────────────────────────────────────────────────
   (3) 潮汐テンソル T(`physics.backgroundTidal` の純関数側)
   ──────────────────────────────────────────────────────────────────────────── */

/** html の `validateBackgroundTidal` と同じ受理契約(**アプリと純関数で契約を揃える**)。 */
export const TIDAL_UNIT = '1/s^2';
export const TIDAL_DIMS = [2, 3];
export const TIDAL_REQUIRED = ['T', 'unit', 'frame', 'epoch', 'source'];
export const TIDAL_TEXT_MAX = { frame: 80, epoch: 60, source: 200, note: 200 };

export function normalizeTidal(a) {
  if (a === null || a === undefined) return { ok: true, value: null };
  if (typeof a !== 'object' || Array.isArray(a)) return { ok: false, why: 'not-object' };
  for (const k of Object.keys(a)) if (TIDAL_REQUIRED.indexOf(k) < 0 && k !== 'note') return { ok: false, why: 'unknown-key' };
  if (TIDAL_REQUIRED.some((k) => a[k] === undefined || a[k] === null)) return { ok: false, why: 'missing' };
  if (a.unit !== TIDAL_UNIT) return { ok: false, why: 'unit' };
  const T = a.T;
  if (!Array.isArray(T) || TIDAL_DIMS.indexOf(T.length) < 0) return { ok: false, why: 'dim' };
  const n = T.length, out = [];
  for (let i = 0; i < n; i++) {
    if (!Array.isArray(T[i]) || T[i].length !== n) return { ok: false, why: 'square' };
    const o = [];
    for (let j = 0; j < n; j++) {
      const v = T[i][j];
      if (!(typeof v === 'number' && Number.isFinite(v))) return { ok: false, why: 'finite' };
      o.push(v);
    }
    out.push(o);
  }
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (out[i][j] !== out[j][i]) return { ok: false, why: 'symmetric' };
  const res = { T: out, unit: TIDAL_UNIT };
  for (const k of ['frame', 'epoch', 'source', 'note']) {
    if (a[k] === undefined || a[k] === null) continue;
    if (typeof a[k] !== 'string' || a[k] === '' || a[k].length > TIDAL_TEXT_MAX[k]) return { ok: false, why: 'text' };
    res[k] = a[k];
  }
  return { ok: true, value: res };
}

/**
 * 点質量(軟化 ε つき)の**潮汐テンソル**(重力加速度 g(x) の空間微分 ∂g/∂x)を面内 2×2 で返す。
 *   g = −GM d/(d²+ε²)^{3/2} → T = GM/q^{3/2}·(3 d dᵀ/q − I)(q = d²+ε²・d は源から評価点へのベクトル)
 * 面内ブロックなので tr T = GM/q^{3/2}·(3d²/q − 2)(ε→0 で GM/d³ = −T_zz)。
 */
export function pointMassTidal(GM, d, eps) {
  const e2 = (eps || 0) * (eps || 0), q = d[0] * d[0] + d[1] * d[1] + e2;
  const c = GM / (q * Math.sqrt(q));
  const xx = c * (3 * d[0] * d[0] / q - 1), yy = c * (3 * d[1] * d[1] / q - 1), xy = c * (3 * d[0] * d[1] / q);
  return [[xx, xy], [xy, yy]];
}

/** 3 次元の点質量の潮汐テンソル(z=0 の面内配置)—— 真空ではトレース 0 の検算用。 */
export function pointMassTidal3(GM, d, eps) {
  const t2 = pointMassTidal(GM, d, eps);
  const e2 = (eps || 0) * (eps || 0), q = d[0] * d[0] + d[1] * d[1] + e2;
  const zz = -GM / (q * Math.sqrt(q));
  return [[t2[0][0], t2[0][1], 0], [t2[1][0], t2[1][1], 0], [0, 0, zz]];
}

/** 対称行列の固有値(2×2 は閉形式・3×3 は三角関数法)。 */
function symEig(T) {
  const n = T.length;
  if (n === 2) {
    const a = T[0][0], b = T[0][1], d = T[1][1];
    const m = 0.5 * (a + d), r = Math.hypot(0.5 * (a - d), b);
    return [m - r, m + r];
  }
  const a00 = T[0][0], a11 = T[1][1], a22 = T[2][2], a01 = T[0][1], a02 = T[0][2], a12 = T[1][2];
  const p1 = a01 * a01 + a02 * a02 + a12 * a12;
  if (p1 === 0) return [a00, a11, a22].sort((x, y) => x - y);
  const q = (a00 + a11 + a22) / 3;
  const p2 = (a00 - q) ** 2 + (a11 - q) ** 2 + (a22 - q) ** 2 + 2 * p1;
  const pp = Math.sqrt(p2 / 6);
  const b00 = (a00 - q) / pp, b11 = (a11 - q) / pp, b22 = (a22 - q) / pp;
  const b01 = a01 / pp, b02 = a02 / pp, b12 = a12 / pp;
  const det = b00 * (b11 * b22 - b12 * b12) - b01 * (b01 * b22 - b12 * b02) + b02 * (b01 * b12 - b11 * b02);
  const r = det / 2;
  const phi = r <= -1 ? Math.PI / 3 : (r >= 1 ? 0 : Math.acos(r) / 3);
  const e1 = q + 2 * pp * Math.cos(phi), e3 = q + 2 * pp * Math.cos(phi + 2 * Math.PI / 3);
  return [e3, 3 * q - e1 - e3, e1].sort((x, y) => x - y);
}

/** **`tidalCheck(T)`**: 対称性・トレース・固有値(受理した T の診断 —— 値は変えない)。 */
export function tidalCheck(T) {
  if (!Array.isArray(T) || TIDAL_DIMS.indexOf(T.length) < 0) return null;
  const n = T.length;
  let asym = 0, scale = 0, finite = true;
  for (let i = 0; i < n; i++) {
    if (!Array.isArray(T[i]) || T[i].length !== n) return null;
    for (let j = 0; j < n; j++) {
      if (!Number.isFinite(T[i][j])) finite = false;
      scale = Math.max(scale, Math.abs(T[i][j]));
      asym = Math.max(asym, Math.abs(T[i][j] - T[j][i]));
    }
  }
  if (!finite) return { dim: n, finite: false };
  let tr = 0;
  for (let i = 0; i < n; i++) tr += T[i][i];
  const ev = symEig(T);
  return { dim: n, finite: true, symmetric: asym === 0, asymMax: asym, scale, trace: tr,
    traceRel: scale > 0 ? tr / scale : 0, eigenvalues: ev };
}

/* ────────────────────────────────────────────────────────────────────────────
   (4) 移流項 —— fieldTime(偏微分)と advected(物質微分)を結ぶ (u·∇) の項
   ──────────────────────────────────────────────────────────────────────────── */

/**
 * 共動系(速度 V)へ移した背景 bg′ の**移流項** (V·∇)W′ と (V·∇)A′。
 * ∂ₜ′|_{x′} = ∂ₜ|_x + (V·∇) なので、**fieldTime + 移流 = advected** になるはずの項である。
 */
export function advectionOfBackground(bgPrime, V) {
  const B = normalizeBackground(bgPrime);
  if (!B || !Array.isArray(V) || V.length !== 2) return null;
  const Vx = Number(V[0]), Vy = Number(V[1]);
  return { dW: Vx * B.gradW[0] + Vy * B.gradW[1],
    dA: [Vx * B.gradA[0] + Vy * B.gradA[1], Vx * B.gradA[2] + Vy * B.gradA[3]] };
}

/** `fieldTime` で移した背景に**移流項を足す**(fieldTime を禁止にせず、移流を明示して物質微分へ戻す)。 */
export function fieldTimePlusAdvection(bg, V) {
  const b = toComovingFrame(bg, V, { convention: 'fieldTime' });
  if (!b) return null;
  const adv = advectionOfBackground(b, V);
  if (!adv) return null;
  return { W0: b.W0, A0: b.A0, gradW: b.gradW, gradA: b.gradA, dWdt: b.dWdt + adv.dW,
    dAdt: [b.dAdt[0] + adv.dA[0], b.dAdt[1] + adv.dA[1]], convention: 'fieldTime+advection', V: b.V };
}

/** 代数の恒等式: fieldTime+移流 と advected の差(全成分の最大相対差)。 */
export function advectionIdentity(bg, V) {
  const a = fieldTimePlusAdvection(bg, V), b = toComovingFrame(bg, V, { convention: 'advected' });
  if (!a || !b) return null;
  const xs = [a.W0, ...a.A0, ...a.gradW, ...a.gradA, a.dWdt, ...a.dAdt];
  const ys = [b.W0, ...b.A0, ...b.gradW, ...b.gradA, b.dWdt, ...b.dAdt];
  let d = 0, s = 0;
  for (let i = 0; i < xs.length; i++) { d = Math.max(d, Math.abs(xs[i] - ys[i])); s = Math.max(s, Math.abs(ys[i])); }
  return { maxAbs: d, maxRel: s > 0 ? d / s : d };
}

/**
 * **直接評価の u(x,t)**(`meshFieldNoD0` を使わない独立な実装 —— 差分の真値に使う)。
 * 局所源は等加速度で動く(x_i + v_i t + ½a_i t²)。背景は宣言点 x* のまわりの**時空で線形な場**
 *   W(x,t)=W₀+∇W·(x−x*)+∂ₜW t ・ A(x,t)=A₀+∇A·(x−x*)+∂ₜA t(∂ₜ は**元の系で x 固定**の偏微分)。
 */
export function fieldValueDirect(sources, bg, xStar, x, y, t, opts) {
  const o = opts || {};
  const p = o.p === undefined ? 2 : o.p, eps = o.eps === undefined ? 0 : o.eps;
  const B = bg ? normalizeBackground(bg) : null;
  const dx0 = x - xStar[0], dy0 = y - xStar[1];
  let W = 0, Ax = 0, Ay = 0;
  if (B) {
    W = B.W0 + B.gradW[0] * dx0 + B.gradW[1] * dy0 + B.dWdt * t;
    Ax = B.A0[0] + B.gradA[0] * dx0 + B.gradA[1] * dy0 + B.dAdt[0] * t;
    Ay = B.A0[1] + B.gradA[2] * dx0 + B.gradA[3] * dy0 + B.dAdt[1] * t;
  }
  for (const s of sources) {
    const ax = s.ax || 0, ay = s.ay || 0;
    const sx = s.x + s.vx * t + 0.5 * ax * t * t, sy = s.y + s.vy * t + 0.5 * ay * t * t;
    const vx = s.vx + ax * t, vy = s.vy + ay * t;
    const dx = x - sx, dy = y - sy, q = dx * dx + dy * dy + eps * eps;
    const w = s.m * Math.pow(q, -p / 2);
    W += w; Ax += w * vx; Ay += w * vy;
  }
  return [Ax / W, Ay / W];
}

/**
 * **移流項の数値検証**(差分が真値): 元の系で x 固定の ∂ₜu・共動系で x′ 固定の ∂ₜ′u′・空間勾配 ∇u を
 * `fieldValueDirect` の中心差分(Richardson 1 段)で作り、
 *   (a) ∂ₜ′u′ − ∂ₜu = (V·∇)u(**fieldTime + 移流 = advected** の差分側の形)
 *   (b) `meshFieldNoD0` + 背景 3 規約(fieldTime / advected / fieldTime+移流)の ∂ₜu′ の予言と ∂ₜ′u′ の残差
 *   (c) 座標変換の加速度 a=(v·∇)u+∂ₜu の不変性(advected・fieldTime+移流)
 * を返す。局所源は共動系では v_i−V で動く(背景と局所源を同じ系へ移す)。
 */
export function advectionFDCheck(sources, bg, xStar, V, opts) {
  const o = opts || {};
  const p = o.p === undefined ? 2 : o.p, eps = o.eps === undefined ? 0 : o.eps;
  const h = o.h, dl = o.dl;
  const vp = o.vParticle || [0, 0];
  const U = (x, y, t) => fieldValueDirect(sources, bg, xStar, x, y, t, { p, eps });
  const cd = (fn, s) => {
    const d1 = fn(s).map((z, i) => z), d2 = fn(s / 2);
    return d1.map((z, i) => (4 * d2[i] - z) / 3);          // Richardson(誤差 O(s⁴))
  };
  const X = xStar[0], Y = xStar[1];
  const dtFixed = cd((s) => { const a = U(X, Y, s), b = U(X, Y, -s); return [(a[0] - b[0]) / (2 * s), (a[1] - b[1]) / (2 * s)]; }, h);
  const dtMoving = cd((s) => {
    const a = U(X + V[0] * s, Y + V[1] * s, s), b = U(X - V[0] * s, Y - V[1] * s, -s);
    return [(a[0] - b[0]) / (2 * s), (a[1] - b[1]) / (2 * s)];
  }, h);
  const gx = cd((s) => { const a = U(X + s, Y, 0), b = U(X - s, Y, 0); return [(a[0] - b[0]) / (2 * s), (a[1] - b[1]) / (2 * s)]; }, dl);
  const gy = cd((s) => { const a = U(X, Y + s, 0), b = U(X, Y - s, 0); return [(a[0] - b[0]) / (2 * s), (a[1] - b[1]) / (2 * s)]; }, dl);
  const gradU = [gx[0], gy[0], gx[1], gy[1]];               // [∂ₓux,∂_yux,∂ₓuy,∂_yuy]
  const VgradU = [V[0] * gradU[0] + V[1] * gradU[1], V[0] * gradU[2] + V[1] * gradU[3]];
  // 物差し: 残差は**差分そのものの大きさ**で割る。**宣言した参照率** |u|·|V|/L_ref は
  // 「(V·∇)u が立っているか」(規約を見分けられる配置か)の判定にだけ使う(u が一定の配置で 0/0 にしない)
  const u0 = U(X, Y, 0);
  const Lref = o.Lref === undefined ? 1 : Number(o.Lref);
  const rateRef = Math.max(Math.hypot(u0[0], u0[1]), Math.hypot(V[0], V[1])) * Math.hypot(V[0], V[1]) / Lref;
  const scale = Math.max(Math.abs(dtFixed[0]), Math.abs(dtFixed[1]), Math.abs(dtMoving[0]),
    Math.abs(dtMoving[1]), Math.abs(VgradU[0]), Math.abs(VgradU[1]), 1e-300);
  const resid = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]) / scale;
  // (a) 差分だけで: ∂ₜ′u′ = ∂ₜu + (V·∇)u
  const identityFD = resid(dtMoving, [dtFixed[0] + VgradU[0], dtFixed[1] + VgradU[1]]);
  // (b) 予言(meshFieldNoD0)
  const base = { p, eps, norm: 'background' };
  const f0 = meshFieldNoD0(sources, X, Y, Object.assign({}, base, { bg }));
  const boosted = sources.map((s) => Object.assign({}, s, { vx: s.vx - V[0], vy: s.vy - V[1] }));
  const conv = {};
  for (const [name, b] of [['fieldTime', toComovingFrame(bg, V, { convention: 'fieldTime' })],
    ['advected', toComovingFrame(bg, V, { convention: 'advected' })],
    ['fieldTime+advection', fieldTimePlusAdvection(bg, V)]]) {
    const f1 = meshFieldNoD0(boosted, X, Y, Object.assign({}, base, { bg: b }));
    if (!f1) { conv[name] = null; continue; }
    const acc0 = [vp[0] * f0.gradU[0] + vp[1] * f0.gradU[1] + f0.dUdt[0], vp[0] * f0.gradU[2] + vp[1] * f0.gradU[3] + f0.dUdt[1]];
    const v1 = [vp[0] - V[0], vp[1] - V[1]];
    const acc1 = [v1[0] * f1.gradU[0] + v1[1] * f1.gradU[1] + f1.dUdt[0], v1[0] * f1.gradU[2] + v1[1] * f1.gradU[3] + f1.dUdt[1]];
    const aScale = Math.max(Math.abs(acc0[0]), Math.abs(acc0[1]), 1e-300);
    conv[name] = { dUdtPrime: f1.dUdt, residVsMovingFD: resid(f1.dUdt, dtMoving),
      residVsFixedFD: resid(f1.dUdt, dtFixed),
      accelRel: Math.hypot(acc1[0] - acc0[0], acc1[1] - acc0[1]) / aScale };
  }
  return { V, h, dl, Lref, rateRef, nSources: sources.length,
    dtFixedFD: dtFixed, dtMovingFD: dtMoving, gradUFD: gradU, VgradU,
    VgradUNorm: Math.hypot(VgradU[0], VgradU[1]), scale,
    identityFD,
    meshField: { dUdt0: f0 ? f0.dUdt : null, residVsFixedFD: f0 ? resid(f0.dUdt, dtFixed) : null,
      gradURel: f0 ? Math.max(...f0.gradU.map((z, i) => Math.abs(z - gradU[i]))) /
        Math.max(1e-300, ...gradU.map(Math.abs)) : null },
    conventions: conv,
    VgradUOverRateRef: Math.hypot(VgradU[0], VgradU[1]) / rateRef,
    // **規約を見分けられる配置か**: (V·∇)u が参照率の 1e−10 を超えて立っているか(超えない配置の残差は丸め同士の比)
    distinguishable: Math.hypot(VgradU[0], VgradU[1]) > 1e-10 * rateRef };
}

/* ────────────────────────────────────────────────────────────────────────────
   (5) 一致試験の積分器(2 体 + 外部源 1 つ・Jacobi 座標・RK4 固定刻み)
   ──────────────────────────────────────────────────────────────────────────── */

/**
 * 状態 s = [Rx,Ry,VRx,VRy, rx,ry,vrx,vry, vSx,vSy]
 *   R = 対の重心 − 外部源(太陽/銀河)・r = 天体0 − 天体1・vS = 外部源の速度(慣性系 K0 = 外部源の初期静止系)。
 * 位置は**重心を原点**に取り、差だけが効くようにする(太陽の距離 ~10¹² m と対の距離 ~10⁷ m を
 * 同じ変数で足さない —— 丸めで 1 mm 級の誤差が出るのを避ける)。速度は K0 の値。
 *
 * model:
 *   field    … 'none'(OFF)/ 'exact'(外部源を明示天体として源に入れる)/ 'bgExact'(外部源の寄与を
 *              各天体の位置で厳密に評価した背景 —— 分解恒等式の走行版)/ 'L2' / 'L1' / 'L0' / 'L0ff'
 *   gravity  … 'full'(外部源の重力を各天体へ厳密に)/ 'tidal'(重心の一様重力 + 線形潮汐 T)/
 *              'uniform'(重心の一様重力のみ —— 相対軌道には効かない)/ 'none'(自由落下系)
 *   reaction … 'fixed'(外部源は静止)/ 'newton'(対の重力で動く)/ 'newton+dfm'(さらに座標変換項を受ける)
 *   fScale   … 外部源の**場の重み**だけを f 倍(重力は変えない —— 規格化候補・W_eff 用)
 *   weightOnly … L0 系で重み W₀ だけを残す(分母の希釈だけ)
 * 源の加速度(∂ₜA に入る)は**ニュートンの加速度だけ**(第277便d の器と同じ宣言)。
 */
export function runEquiv(cfg) {
  const G = cfg.G, m0 = cfg.m[0], m1 = cfg.m[1], M = cfg.M;
  const eps = cfg.eps || 0, e2 = eps * eps, p = cfg.p === undefined ? 2 : cfg.p, k = cfg.k === undefined ? 1 : cfg.k;
  const model = Object.assign({ field: 'none', gravity: 'full', reaction: 'fixed', fScale: 1, weightOnly: false,
    shield: null }, cfg.model || {});
  const mt = m0 + m1, mu0 = m0 / mt, mu1 = m1 / mt, Mf = M * model.fScale;
  const T0 = cfg.T0, steps = cfg.steps, dt = T0 / steps;
  const fopt = { p, eps };
  const selfOpt = { p, eps, norm: 'self' };

  const gAt = (x, y, xS) => {
    const dx = x - xS[0], dy = y - xS[1], q = dx * dx + dy * dy + e2, iq = 1 / Math.sqrt(q), iq3 = iq * iq * iq;
    return [-G * M * dx * iq3, -G * M * dy * iq3];
  };
  const acoord = (f, v) => [v[0] * f.gradU[0] + v[1] * f.gradU[1] + f.dUdt[0],
    v[0] * f.gradU[2] + v[1] * f.gradU[3] + f.dUdt[1]];

  // 凍結背景(L0 / L0ff)は t=0 の状態から 1 度だけ作る
  let bgFrozen = null;
  const unpack = (s) => {
    const vCx = s[8] + s[2], vCy = s[9] + s[3];
    return {
      x0: [mu1 * s[4], mu1 * s[5]], x1: [-mu0 * s[4], -mu0 * s[5]], xS: [-s[0], -s[1]],
      v0: [vCx + mu1 * s[6], vCy + mu1 * s[7]], v1: [vCx - mu0 * s[6], vCy - mu0 * s[7]], vS: [s[8], s[9]],
      vC: [vCx, vCy] };
  };
  const applyShield = (bg, R) => {
    if (!model.shield) return bg;
    return shieldBackgroundPointSource(bg, Math.hypot(R[0], R[1]), model.shield.lambda, p);
  };

  const deriv = (s) => {
    const st = unpack(s);
    const rx = s[4], ry = s[5];
    const q2 = rx * rx + ry * ry + e2, inv = 1 / Math.sqrt(q2), inv3 = inv * inv * inv;
    const gp0 = [-G * m1 * rx * inv3, -G * m1 * ry * inv3], gp1 = [G * m0 * rx * inv3, G * m0 * ry * inv3];
    let gS0 = [0, 0], gS1 = [0, 0];
    if (model.gravity === 'full') { gS0 = gAt(st.x0[0], st.x0[1], st.xS); gS1 = gAt(st.x1[0], st.x1[1], st.xS); }
    else if (model.gravity === 'uniform' || model.gravity === 'tidal') {
      const gc = gAt(0, 0, st.xS);
      gS0 = gc.slice(); gS1 = gc.slice();
      if (model.gravity === 'tidal') {
        const T = pointMassTidal(G * M, [s[0], s[1]], eps);
        gS0 = [gc[0] + T[0][0] * st.x0[0] + T[0][1] * st.x0[1], gc[1] + T[1][0] * st.x0[0] + T[1][1] * st.x0[1]];
        gS1 = [gc[0] + T[0][0] * st.x1[0] + T[0][1] * st.x1[1], gc[1] + T[1][0] * st.x1[0] + T[1][1] * st.x1[1]];
      }
    }
    const a0N = [gp0[0] + gS0[0], gp0[1] + gS0[1]], a1N = [gp1[0] + gS1[0], gp1[1] + gS1[1]];
    // 外部源の加速度(ニュートン)
    let aSN = [0, 0];
    if (model.reaction !== 'fixed') {
      for (const [x, m] of [[st.x0, m0], [st.x1, m1]]) {
        const dx = x[0] - st.xS[0], dy = x[1] - st.xS[1], q = dx * dx + dy * dy + e2, iq = 1 / Math.sqrt(q);
        aSN[0] += G * m * dx * iq * iq * iq; aSN[1] += G * m * dy * iq * iq * iq;
      }
    }
    const src0 = { m: m0, x: st.x0[0], y: st.x0[1], vx: st.v0[0], vy: st.v0[1], ax: a0N[0], ay: a0N[1] };
    const src1 = { m: m1, x: st.x1[0], y: st.x1[1], vx: st.v1[0], vy: st.v1[1], ax: a1N[0], ay: a1N[1] };
    const srcS = { m: Mf, x: st.xS[0], y: st.xS[1], vx: st.vS[0], vy: st.vS[1], ax: aSN[0], ay: aSN[1] };
    let a0 = a0N.slice(), a1 = a1N.slice();
    if (model.field !== 'none' && k !== 0) {
      let bgC = null;
      if (model.field === 'L1' || model.field === 'L2') {
        bgC = applyShield(sourceContribution(srcS, 0, 0, fopt), [s[0], s[1]]);
        if (!bgC) return null;
      }
      for (let i = 0; i < 2; i++) {
        const xi = i === 0 ? st.x0 : st.x1, vi = i === 0 ? st.v0 : st.v1, sj = i === 0 ? src1 : src0;
        const off = meshFieldNoD0([sj], xi[0], xi[1], selfOpt);
        let on = null;
        if (model.field === 'exact') on = meshFieldNoD0([sj, srcS], xi[0], xi[1], selfOpt);
        else {
          let bg = null;
          if (model.field === 'bgExact') bg = applyShield(sourceContribution(srcS, xi[0], xi[1], fopt), [s[0], s[1]]);
          else if (model.field === 'L1') bg = bgC;
          else if (model.field === 'L2') bg = shiftBackground(bgC, xi[0], xi[1]);
          else if (model.field === 'L0' || model.field === 'L0ff') bg = bgFrozen;
          if (!bg) return null;
          on = meshFieldNoD0([sj], xi[0], xi[1], { p, eps, norm: 'background', bg });
        }
        if (!on || !off) return null;
        const aOn = acoord(on, vi), aOff = acoord(off, vi);
        const add = [k * (aOn[0] - aOff[0]), k * (aOn[1] - aOff[1])];
        if (i === 0) { a0[0] += add[0]; a0[1] += add[1]; } else { a1[0] += add[0]; a1[1] += add[1]; }
      }
    }
    let aS = aSN.slice();
    if (model.reaction === 'newton+dfm' && k !== 0) {
      const fS = meshFieldNoD0([src0, src1], st.xS[0], st.xS[1], selfOpt);
      if (!fS) return null;
      const aC = acoord(fS, st.vS);
      aS = [aS[0] + k * aC[0], aS[1] + k * aC[1]];
    }
    const aCOM = [mu0 * a0[0] + mu1 * a1[0], mu0 * a0[1] + mu1 * a1[1]];
    return [s[2], s[3], aCOM[0] - aS[0], aCOM[1] - aS[1], s[6], s[7], a0[0] - a1[0], a0[1] - a1[1], aS[0], aS[1]];
  };
  const step = (s, h) => {
    const k1 = deriv(s); if (!k1) return null;
    const s2 = s.map((z, i) => z + 0.5 * h * k1[i]);
    const k2 = deriv(s2); if (!k2) return null;
    const s3 = s.map((z, i) => z + 0.5 * h * k2[i]);
    const k3 = deriv(s3); if (!k3) return null;
    const s4 = s.map((z, i) => z + h * k3[i]);
    const k4 = deriv(s4); if (!k4) return null;
    return s.map((z, i) => z + (h / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
  };

  let s = [cfg.R0[0], cfg.R0[1], cfg.VR0[0], cfg.VR0[1], cfg.r0[0], cfg.r0[1], cfg.vr0[0], cfg.vr0[1],
    cfg.vS0 ? cfg.vS0[0] : 0, cfg.vS0 ? cfg.vS0[1] : 0];
  // 凍結背景(t=0・重心で評価)
  if (model.field === 'L0' || model.field === 'L0ff') {
    const st = unpack(s);
    const srcS = { m: Mf, x: st.xS[0], y: st.xS[1], vx: st.vS[0], vy: st.vS[1], ax: 0, ay: 0 };
    let bg = applyShield(sourceContribution(srcS, 0, 0, fopt), [s[0], s[1]]);
    if (!bg) return null;
    if (model.field === 'L0ff') {
      // 自由落下系: 重心の一様加速度 a_c を全体から引く → 外部源は −a_c で加速して見える(∂ₜA += W₀·(−a_c))
      const ac = gAt(0, 0, st.xS);
      bg = Object.assign({}, bg, { dAdt: [bg.dAdt[0] - bg.W0 * ac[0], bg.dAdt[1] - bg.W0 * ac[1]] });
    }
    if (model.weightOnly) bg = weightOnlyBackground(bg);
    bgFrozen = bg;
  }
  const mu = G * mt;
  const L0z = s[4] * s[7] - s[5] * s[6];
  const sgn = L0z >= 0 ? 1 : -1;
  const target = sgn * 2 * Math.PI;
  const ang = (z) => Math.atan2(z[5], z[4]);
  const wrap = (d) => { while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; return d; };
  let unw = 0, prevAng = ang(s), sT = null, period = null;
  const maxSteps = Math.ceil(steps * (cfg.maxFactor || 1.6));
  let n = 0, failed = false;
  for (n = 0; n < maxSteps; n++) {
    const s1 = step(s, dt);
    if (!s1 || !s1.every(Number.isFinite)) { failed = true; break; }
    const a1 = ang(s1), unw1 = unw + wrap(a1 - prevAng);
    if (period === null && (unw - target) * sgn < 0 && (unw1 - target) * sgn >= 0) {
      // 交差の精密化: 1 步の RK4 を部分刻み h で打ち直し、角度 = 目標 を割線法で解く
      const fOf = (h) => { const z = step(s, h); return z ? unw + wrap(ang(z) - prevAng) - target : NaN; };
      let h0 = 0, f0 = unw - target, h1 = dt, f1 = unw1 - target;
      for (let it = 0; it < 40; it++) {
        const h2 = h1 - f1 * (h1 - h0) / (f1 - f0);
        if (!Number.isFinite(h2)) break;
        const f2 = fOf(h2);
        h0 = h1; f0 = f1; h1 = h2; f1 = f2;
        if (Math.abs(h1 - h0) <= 1e-13 * dt || f2 === 0) break;
      }
      period = n * dt + h1;
    }
    s = s1; unw = unw1; prevAng = a1;
    if (n + 1 === steps) sT = s.slice();
    if (n + 1 >= steps && period !== null) break;
  }
  if (!sT) return { failed: true, model, steps, dt };
  const el = (z) => {
    const rx = z[4], ry = z[5], vx = z[6], vy = z[7];
    const r = Math.hypot(rx, ry), v2 = vx * vx + vy * vy, rv = rx * vx + ry * vy;
    const a = 1 / (2 / r - v2 / mu);
    const ex = ((v2 - mu / r) * rx - rv * vx) / mu, ey = ((v2 - mu / r) * ry - rv * vy) / mu;
    return { a, e: Math.hypot(ex, ey) };
  };
  const E = el(sT);
  return { model, steps, dt, T0, failed, period, phaseT: ang(sT), rT: [sT[4], sT[5]], vrT: [sT[6], sT[7]],
    RT: [sT[0], sT[1]], vST: [sT[8], sT[9]], aT: E.a, eT: E.e, bound: (E.a > 0 && E.e < 1), sgn };
}

/** ON/OFF(または 2 走行)の差: 周期差・位相差(時間へ換算)・位置差(ベクトルと大きさ)。 */
export function runDiff(A, B, T0) {
  if (!A || !B || A.failed || B.failed) return null;
  const n = 2 * Math.PI / T0;
  const wrap = (d) => { while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; return d; };
  const dPhase = wrap(A.phaseT - B.phaseT);
  const dr = [A.rT[0] - B.rT[0], A.rT[1] - B.rT[1]];
  return { dP: (A.period !== null && B.period !== null) ? A.period - B.period : null,
    dPhase, dPhaseTimeS: dPhase / n, dPos: Math.hypot(dr[0], dr[1]), dPosVec: dr,
    bothBound: A.bound && B.bound };
}

/** 2 つの ON/OFF 差の食い違い(EXP と BG の一致の物差し)。 */
export function diffMismatch(X, Y) {
  if (!X || !Y) return null;
  return { dP: (X.dP !== null && Y.dP !== null) ? X.dP - Y.dP : null,
    dPhaseTimeS: X.dPhaseTimeS - Y.dPhaseTimeS,
    dPos: Math.hypot(X.dPosVec[0] - Y.dPosVec[0], X.dPosVec[1] - Y.dPosVec[1]) };
}

/** 刻み収束(3 段 N・2N・4N): 差 d1=Q(N)−Q(2N)・d2=Q(2N)−Q(4N)・比 d1/d2(RK4 なら ≈16)・Richardson 値。 */
export function convergence(q) {
  if (!Array.isArray(q) || q.length !== 3 || q.some((z) => z === null || !Number.isFinite(z))) return null;
  const d1 = q[0] - q[1], d2 = q[1] - q[2];
  return { values: q, d1, d2, ratio: d2 !== 0 ? d1 / d2 : null, richardson: q[2] + d2 / 15,
    width: Math.abs(d2) };
}

export default { BGEQUIV_VERSION, sourceContribution, scaleBackground, weightOnlyBackground, shiftBackground,
  decompositionIdentity, shieldBackgroundPointSource, TIDAL_UNIT, TIDAL_DIMS, TIDAL_REQUIRED, TIDAL_TEXT_MAX,
  normalizeTidal, pointMassTidal, pointMassTidal3, tidalCheck, advectionOfBackground, fieldTimePlusAdvection,
  advectionIdentity, fieldValueDirect, advectionFDCheck, runEquiv, runDiff, diffMismatch, convergence };
