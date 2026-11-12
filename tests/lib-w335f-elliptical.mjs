// 第335便f(原仮定者の補足(2026-11-12)「まずは、楕円銀河の再現を目指す」・原仮定者の回答(2026-11-12 —— AN665)「楕円銀河を先に」・統括の検証項目 R333):
//   **分散で支える三次元の系(楕円銀河の型の模型)の純関数** —— 等方の分布関数からの標本(Plummer 球〔主〕・Hernquist 球〔対照〕)・扁平の対照・回転の支えの対照・
//   直接の和の重力(Plummer の軟化)・星どうしの並進引きずり d・蛙跳びの積分器(重力だけ/速度の場/押し)・量の測り(ラグランジュ半径・密度の傾き・軸比・速度分散と異方性・
//   ビリアル比・脱落・E と L と重心)。器 tests/exp-w335f-elliptical.mjs と QA lint.elliptical335f・behavior.elliptical335f が読む —— html を読まない・状態を持たない。
//   **診断だけ** —— エンジン・内蔵の本・受理器・第329〜334便の lib の本文は変えない(乱数は第333便d の `rngOf`・受け手の場は第334便e の `gridField`・引きずり半径は第332便a の `rdOf`・
//   単位の定数は第329便b の lib を呼ぶ —— 写さない)。
//
// ■ 単位: G = M = a = 1(a は模型の尺度の半径 —— Plummer の a・Hernquist の a)。星は等しい質量 m = 1/N の点(自転を持たない —— 回答 AN650 の宣言: 星は自転 0 の点として扱う)。
// ■ 重力: a_i = Σ_{j≠i} m_j (p_j − p_i)/(r² + ε²)^{3/2}・Φ_i = −Σ_{j≠i} m_j/(r² + ε²)^{1/2}(Plummer の軟化 ε —— 尺度の半径の比)。
// ■ 並進引きずり(星どうし —— 本枝の多体の和): **d_i = Σ_{j≠i} w_ij (v_j − v_i)/(w_ii + Σ_{j≠i} w_ij)**・w_ij = m_j (r² + ε²)^{−α/2}(重力と同じ軟化 —— α = 2 が主・α = 1 は対照)。
//   出どころ: 原仮定者の決断(2026-11-12)の自己を運ぶ式 U_i = v_i + d_i・d_i = Σ_{j≠i} w_ij (C_{j→i} − v_i)/(w_ii + Σ_{j≠i} w_ij)・C_{j→i} = v_j + s_j × (p_i − p_j) の、
//   **星の自転 s_j = 0 の特別の場合**(C_{j→i} = v_j —— 座標変換の回転の項が無い)。自己を運ぶ式そのもの(自転のある源・座標変換の回転)の lib は枝 b の持ち物 —— 本 lib は星どうしの和だけ。
//   自己の重み w_ii: 「自己なし」= 0・「R_d」= m_i/R_d^α(R_d = Y_k m_i —— 銀河の尺度への写しの星 1 個の質量で・軟化しない)。主列は背景慣性決定力 W₀ = 0(分母に入れない)。
//   受け手を星にした第334便e の `gridField`(exclude で自分を外す・α 2 と 1・s_d 0)と d_i + v_i が同じ(場面 ②)。
// ■ 作用の型(器の宣言): grav = 重力だけ/vel = 速度の場として位置の更新に足す dp/dt = v + d/push = 押し dv/dt = a + γ d。
//   蛙跳び(KDK): v ← v + (h/2)(a + γd)・p ← p + h(v + [vel のとき d])・a, Φ, d を新しい p と半步の v で・v ← v + (h/2)(a + γd)。
//   **d は直前の力の評価のときの p と v で持つ**(vel の位置の更新は 1 步遅れの速度で評価した d —— 一次の近似・push は半步の速度 —— 器は h と h/2 で照らす)。
//   引きずりの仕事の帳簿: push は ΔK の押しの分 Σ m γ d·(v_前 + v_後)/2 × h/2(半步ごと —— 線形の分け方なので厳密)・vel は位置の更新の d の分の位置のエネルギーの変化 −Σ m ā·d h
//   (ā は步の前後の加速度の平均 —— 台形)。E = Σ ½ m v² + ½ Σ m Φ(v は状態の速度)。
// ■ 言わないこと: 模型は宣言した分布関数の標本と積分器の表(楕円銀河の同定ではない)・軟化は離散化の依存を下げる宣言の長さ(物理の大きさではない)・
//   引きずりの差は重力だけの対照との差と誤差の幅の比の表・回転曲線・腕・棒・暗黒物質は扱わない。
import { rngOf } from './lib-w333d-noncirc.mjs';
import { gridField } from './lib-w334e-gridfloor.mjs';
import { rdOf } from './lib-w332a-eqband.mjs';
import * as GR from './lib-w329b-galrot.mjs';

export const LIB_VERSION = 'w335f-elliptical-lib-1';
export const MODELS = Object.freeze(['plummer', 'hernquist']);
export const ACTIONS = Object.freeze(['grav', 'vel', 'push']);
export const SELF_RULES = Object.freeze(['none', 'Rd']);
/** 量の鍵(測りの戻り値の並び)と幅の型(rel = ÷ |Q(0)| の相対・abs = そのままの差) */
export const QKEYS = Object.freeze(['r10', 'r50', 'r90', 'conc', 'slope', 'ba', 'ca', 'sigR', 'sigT', 'beta', 'vir', 'esc', 'dE', 'dL', 'dCM', 'vrot']);
export const QKIND = Object.freeze({ r10: 'rel', r50: 'rel', r90: 'rel', conc: 'rel', slope: 'rel', ba: 'rel', ca: 'rel', sigR: 'rel', sigT: 'rel', beta: 'abs', vir: 'rel', esc: 'abs', dE: 'abs', dL: 'abs', dCM: 'abs', vrot: 'abs' });
/** 宣言(走行の前に置く —— 結果を見て変えない) */
export const DECL = Object.freeze({
  idTol: 1e-12,
  /** 標本の質量の割合の上限(外側を切る —— Plummer 0.99 で r ≈ 14.1 a・Hernquist 0.99 で r ≈ 199 a) */
  uMax: Object.freeze({ plummer: 0.99, hernquist: 0.99 }),
  /** 回転の支えの対照の反しの割合 k = (v_rot/σ の目標 0.3)·√(π/2)(⟨v_φ⟩ = k · 2 · ½ · √(2/π) σ —— 正規分布の近似・σ は一次元) */
  rotTarget: 0.3, rotFlip: 0.3 * Math.sqrt(Math.PI / 2),
  /** 切らない模型の解析の値(G = M = a = 1): 半質量の半径 r_h・|W|・v_rms = √|W|・横断の時間 t_cr = r_h/v_rms */
  rh: Object.freeze({ plummer: 1 / Math.sqrt(Math.cbrt(4) - 1), hernquist: 1 + Math.SQRT2 }),
  absW: Object.freeze({ plummer: 3 * Math.PI / 32, hernquist: 1 / 6 }),
  /** Hernquist の速さの棄却の包み: 格子の点の数と安全の倍率(包みの外れは数えて門に) */
  hqGrid: 512, hqSafety: 1.5,
  /** 量の測りの範囲: 速度分散・異方性・軸比・回転は r ≤ r90 の星(重心の枠)・密度の傾きは殻 [r10, r50] と [r50, r90] の平均密度の log の比 */
  innerFrac: 0.9,
  /** 銀河の尺度への写し(表だけ) */
  galaxy: Object.freeze({ Msun: 1e11, aKpc: 5 }),
});
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const relD = (a, b) => (a === b ? 0 : Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b), 1e-300));

/** 模型の解析の時間の尺度(切らない模型): r_h・v_rms・t_cr */
export function scalesOf(model) {
  if (!MODELS.includes(model)) throw new RangeError('scalesOf: 模型は ' + MODELS.join('・'));
  const rh = DECL.rh[model], vrms = Math.sqrt(DECL.absW[model]);
  return { rh, vrms, tcr: rh / vrms };
}

/** Hernquist の等方の分布関数の形(規格化しない): q = √ε(ε は束縛のエネルギー ∈ (0, 1))—— Hernquist 1990 の式 (17) の括弧と (1 − q²)^(−5/2) */
export function hernquistF(eps) {
  if (!(eps > 0 && eps < 1)) return 0;
  const q = Math.sqrt(eps), s = Math.sqrt(1 - eps), q2 = eps;
  const v = (3 * Math.asin(q) + q * s * (1 - 2 * q2) * (8 * q2 * q2 - 8 * q2 - 3)) / (s * s * s * s * s);
  return v > 0 ? v : 0;
}

const emptyState = (N) => ({ N, x: new Float64Array(N), y: new Float64Array(N), z: new Float64Array(N), vx: new Float64Array(N), vy: new Float64Array(N), vz: new Float64Array(N), m: new Float64Array(N) });
export function cloneState(S) { const T = emptyState(S.N); for (const k of ['x', 'y', 'z', 'vx', 'vy', 'vz', 'm']) T[k].set(S[k]); return T; }
function isoDir(rng) { const cz = 2 * rng() - 1, ph = 2 * Math.PI * rng(), sz = Math.sqrt(Math.max(0, 1 - cz * cz)); return [sz * Math.cos(ph), sz * Math.sin(ph), cz]; }
/** 重心(位置と速度)を引く */
export function centre(S) {
  let M = 0, cx = 0, cy = 0, cz = 0, ux = 0, uy = 0, uz = 0;
  for (let i = 0; i < S.N; i++) { const m = S.m[i]; M += m; cx += m * S.x[i]; cy += m * S.y[i]; cz += m * S.z[i]; ux += m * S.vx[i]; uy += m * S.vy[i]; uz += m * S.vz[i]; }
  cx /= M; cy /= M; cz /= M; ux /= M; uy /= M; uz /= M;
  for (let i = 0; i < S.N; i++) { S.x[i] -= cx; S.y[i] -= cy; S.z[i] -= cz; S.vx[i] -= ux; S.vy[i] -= uy; S.vz[i] -= uz; }
  return S;
}

/**
 * 等方の分布関数からの標本(G = M = a = 1・m = 1/N・重心を引く)。model: plummer(Aarseth, Hénon & Wielen 1974 の棄却)・hernquist(Hernquist 1990 の f(ε) の棄却 —— 包みは格子で)。
 * 戻り値 { S, envelopeMiss }(envelopeMiss = 包みを超えた標本の数 —— 0 を門に)
 */
export function sampleModel({ model, N, seed, uMax = null }) {
  if (!MODELS.includes(model)) throw new RangeError('sampleModel: 模型は ' + MODELS.join('・'));
  if (!(Number.isInteger(N) && N >= 2)) throw new RangeError('sampleModel: N ≥ 2 の整数');
  const um = uMax === null ? DECL.uMax[model] : uMax;
  if (!(fin(um) && um > 0 && um < 1)) throw new RangeError('sampleModel: 0 < uMax < 1');
  const rng = rngOf(seed), S = emptyState(N);
  let miss = 0;
  for (let i = 0; i < N; i++) {
    let u = 0; while (!(u > 0)) u = um * rng();
    let r, v;
    if (model === 'plummer') {
      r = 1 / Math.sqrt(Math.cbrt(1 / (u * u)) - 1);
      let q = 0;
      for (;;) { q = rng(); const y = 0.1 * rng(), w = 1 - q * q; if (y < q * q * w * w * w * Math.sqrt(w)) break; }
      v = q * Math.SQRT2 / Math.sqrt(Math.sqrt(1 + r * r));
    } else {
      const su = Math.sqrt(u); r = su / (1 - su);
      const psi = 1 / (1 + r), vesc = Math.sqrt(2 * psi), G = DECL.hqGrid;
      let pmax = 0; for (let k = 1; k < G; k++) { const vv = vesc * k / G, p = vv * vv * hernquistF(psi - 0.5 * vv * vv); if (p > pmax) pmax = p; }
      pmax *= DECL.hqSafety;
      for (;;) { const vv = vesc * rng(), p = vv * vv * hernquistF(psi - 0.5 * vv * vv), y = pmax * rng(); if (p > pmax) miss++; if (y < p) { v = vv; break; } }
    }
    const d1 = isoDir(rng), d2 = isoDir(rng);
    S.x[i] = r * d1[0]; S.y[i] = r * d1[1]; S.z[i] = r * d1[2]; S.vx[i] = v * d2[0]; S.vy[i] = v * d2[1]; S.vz[i] = v * d2[2]; S.m[i] = 1 / N;
  }
  return { S: centre(S), envelopeMiss: miss };
}

/** 扁平の対照: z を q 倍(質量の分布の軸比 c/a = q —— 第334便a の扁平の則とは別の量)・速度を一様に倍してビリアル比を球の標本と同じに(平衡の分布関数ではない —— 対照) */
export function oblateOf(S0, q, eps) {
  if (!(fin(q) && q > 0 && q <= 1)) throw new RangeError('oblateOf: 0 < q ≤ 1');
  const vir0 = energies(S0, eps).vir, S = cloneState(S0);
  for (let i = 0; i < S.N; i++) S.z[i] *= q;
  const E1 = energies(S, eps), f = Math.sqrt(vir0 / E1.vir);
  for (let i = 0; i < S.N; i++) { S.vx[i] *= f; S.vy[i] *= f; S.vz[i] *= f; }
  return centre(S);
}
/** 回転の支えの対照: z 軸のまわりで v_φ < 0 の星の割合 k の v_φ の符号を反す(|v| と E を保つ —— 球の分布関数の型を保つ反し)。乱数は種を宣言 */
export function rotateOf(S0, k, seed) {
  if (!(fin(k) && k >= 0 && k <= 1)) throw new RangeError('rotateOf: 0 ≤ k ≤ 1');
  const S = cloneState(S0), rng = rngOf(seed);
  for (let i = 0; i < S.N; i++) {
    const R = Math.hypot(S.x[i], S.y[i]); if (!(R > 0)) continue;
    const ex = -S.y[i] / R, ey = S.x[i] / R, vphi = S.vx[i] * ex + S.vy[i] * ey, u = rng();
    if (vphi < 0 && u < k) { S.vx[i] -= 2 * vphi * ex; S.vy[i] -= 2 * vphi * ey; }
  }
  return centre(S);
}

/**
 * 力の評価(直接の和・1 回の走査): 重力の加速度 a・位置のエネルギー Φ と、drag が真なら並進引きずり d(重み α・自己の重み selfW[i] —— 型付きの配列か null〔0〕)。
 * 戻り値は F = { ax, ay, az, pot, dx, dy, dz }(d は drag が偽なら 0)
 */
export function forces(S, eps, drag = false, alpha = 2, selfW = null, F = null) {
  const N = S.N, e2 = eps * eps;
  if (!(fin(eps) && eps >= 0)) throw new RangeError('forces: ε ≥ 0');
  if (drag && !(alpha === 1 || alpha === 2)) throw new RangeError('forces: α は 1 か 2');
  if (!F) F = { ax: new Float64Array(N), ay: new Float64Array(N), az: new Float64Array(N), pot: new Float64Array(N), dx: new Float64Array(N), dy: new Float64Array(N), dz: new Float64Array(N), W: new Float64Array(N) };
  const { x, y, z, vx, vy, vz, m } = S, { ax, ay, az, pot, dx: Dx, dy: Dy, dz: Dz, W } = F;
  ax.fill(0); ay.fill(0); az.fill(0); pot.fill(0); Dx.fill(0); Dy.fill(0); Dz.fill(0); W.fill(0);
  if (!drag) {
    for (let i = 0; i < N; i++) {
      const xi = x[i], yi = y[i], zi = z[i], mi = m[i]; let axi = 0, ayi = 0, azi = 0, pi = 0;
      for (let j = i + 1; j < N; j++) {
        const ddx = x[j] - xi, ddy = y[j] - yi, ddz = z[j] - zi, q = ddx * ddx + ddy * ddy + ddz * ddz + e2;
        if (!(q > 0)) throw new RangeError('forces: 2 つの星が一致(ε = 0)');
        const inv = 1 / q, ir = Math.sqrt(inv), ir3 = inv * ir, mj = m[j], cj = mj * ir3, ci = mi * ir3;
        axi += cj * ddx; ayi += cj * ddy; azi += cj * ddz; ax[j] -= ci * ddx; ay[j] -= ci * ddy; az[j] -= ci * ddz; pi -= mj * ir; pot[j] -= mi * ir;
      }
      ax[i] += axi; ay[i] += ayi; az[i] += azi; pot[i] += pi;
    }
    return F;
  }
  const a1 = alpha === 1;
  for (let i = 0; i < N; i++) {
    const xi = x[i], yi = y[i], zi = z[i], mi = m[i], vxi = vx[i], vyi = vy[i], vzi = vz[i];
    let axi = 0, ayi = 0, azi = 0, pi = 0, wi = 0, uxi = 0, uyi = 0, uzi = 0;
    for (let j = i + 1; j < N; j++) {
      const ddx = x[j] - xi, ddy = y[j] - yi, ddz = z[j] - zi, q = ddx * ddx + ddy * ddy + ddz * ddz + e2;
      if (!(q > 0)) throw new RangeError('forces: 2 つの星が一致(ε = 0)');
      const inv = 1 / q, ir = Math.sqrt(inv), ir3 = inv * ir, mj = m[j], cj = mj * ir3, ci = mi * ir3, k = a1 ? ir : inv, wj = mj * k, wi2 = mi * k;
      axi += cj * ddx; ayi += cj * ddy; azi += cj * ddz; ax[j] -= ci * ddx; ay[j] -= ci * ddy; az[j] -= ci * ddz; pi -= mj * ir; pot[j] -= mi * ir;
      wi += wj; uxi += wj * vx[j]; uyi += wj * vy[j]; uzi += wj * vz[j]; W[j] += wi2; Dx[j] += wi2 * vxi; Dy[j] += wi2 * vyi; Dz[j] += wi2 * vzi;
    }
    ax[i] += axi; ay[i] += ayi; az[i] += azi; pot[i] += pi; W[i] += wi; Dx[i] += uxi; Dy[i] += uyi; Dz[i] += uzi;
  }
  for (let i = 0; i < N; i++) {   // d_i = (Σ w_ij v_j − v_i Σ w_ij)/(w_ii + Σ w_ij)
    const Wt = W[i], den = (selfW ? selfW[i] : 0) + Wt;
    if (!(den > 0)) throw new RangeError('forces: 引きずりの分母が 0');
    Dx[i] = (Dx[i] - vx[i] * Wt) / den; Dy[i] = (Dy[i] - vy[i] * Wt) / den; Dz[i] = (Dz[i] - vz[i] * Wt) / den;
  }
  return F;
}

/** エネルギー(重心の枠でない —— 状態の速度そのまま)と重心の枠の K・W・ビリアル比(力の評価を 1 回) */
export function energies(S, eps, F = null) {
  const G = F || forces(S, eps, false);
  let M = 0, ux = 0, uy = 0, uz = 0, K = 0, W = 0;
  for (let i = 0; i < S.N; i++) { const m = S.m[i]; M += m; ux += m * S.vx[i]; uy += m * S.vy[i]; uz += m * S.vz[i]; K += 0.5 * m * (S.vx[i] * S.vx[i] + S.vy[i] * S.vy[i] + S.vz[i] * S.vz[i]); W += 0.5 * m * G.pot[i]; }
  ux /= M; uy /= M; uz /= M;
  const Kc = K - 0.5 * M * (ux * ux + uy * uy + uz * uz);
  return { K, W, E: K + W, Kc, vir: 2 * Kc / Math.abs(W) };
}

/** 3 × 3 の対称の行列の固有値(Jacobi の回転 —— 大きい順) */
export function eig3(A) {
  const a = [[A[0][0], A[0][1], A[0][2]], [A[1][0], A[1][1], A[1][2]], [A[2][0], A[2][1], A[2][2]]];
  for (let sweep = 0; sweep < 60; sweep++) {
    const off = Math.abs(a[0][1]) + Math.abs(a[0][2]) + Math.abs(a[1][2]);
    if (off <= 1e-300 || off <= 1e-15 * (Math.abs(a[0][0]) + Math.abs(a[1][1]) + Math.abs(a[2][2]))) break;
    for (const [p, q] of [[0, 1], [0, 2], [1, 2]]) {
      if (a[p][q] === 0) continue;
      const th = (a[q][q] - a[p][p]) / (2 * a[p][q]), t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1)), c = 1 / Math.sqrt(t * t + 1), s = t * c;
      for (let k = 0; k < 3; k++) { const akp = a[k][p], akq = a[k][q]; a[k][p] = c * akp - s * akq; a[k][q] = s * akp + c * akq; }
      for (let k = 0; k < 3; k++) { const apk = a[p][k], aqk = a[q][k]; a[p][k] = c * apk - s * aqk; a[q][k] = s * apk + c * aqk; }
    }
  }
  return [a[0][0], a[1][1], a[2][2]].sort((u, v) => v - u);
}

/**
 * 量の測り(力の評価 F の Φ を使う —— 同じ位置で評価したもの)。基準 ref = { E0, L0:[3], cm0:[3], Lscale, rh } を渡すと E・L・重心の残差も。
 * 戻り値は QKEYS の鍵の値(dE = (E − E0)/|E0|・dL = |L − L0|/Lscale・dCM = |R_cm − R_cm0|/r_h)と E・L・cm
 */
export function measure(S, F, ref = null) {
  const N = S.N;
  let M = 0, cx = 0, cy = 0, cz = 0, ux = 0, uy = 0, uz = 0, K = 0, Wp = 0, Lx = 0, Ly = 0, Lz = 0;
  for (let i = 0; i < N; i++) {
    const m = S.m[i]; M += m; cx += m * S.x[i]; cy += m * S.y[i]; cz += m * S.z[i]; ux += m * S.vx[i]; uy += m * S.vy[i]; uz += m * S.vz[i];
    K += 0.5 * m * (S.vx[i] * S.vx[i] + S.vy[i] * S.vy[i] + S.vz[i] * S.vz[i]); Wp += 0.5 * m * F.pot[i];
    Lx += m * (S.y[i] * S.vz[i] - S.z[i] * S.vy[i]); Ly += m * (S.z[i] * S.vx[i] - S.x[i] * S.vz[i]); Lz += m * (S.x[i] * S.vy[i] - S.y[i] * S.vx[i]);
  }
  cx /= M; cy /= M; cz /= M; ux /= M; uy /= M; uz /= M;
  const rr = new Float64Array(N), idx = new Array(N);
  let Kc = 0, nEsc = 0;
  for (let i = 0; i < N; i++) {
    const X = S.x[i] - cx, Y = S.y[i] - cy, Z = S.z[i] - cz, VX = S.vx[i] - ux, VY = S.vy[i] - uy, VZ = S.vz[i] - uz, v2 = VX * VX + VY * VY + VZ * VZ;
    rr[i] = Math.sqrt(X * X + Y * Y + Z * Z); idx[i] = i; Kc += 0.5 * S.m[i] * v2;
    if (0.5 * v2 + F.pot[i] > 0) nEsc++;
  }
  idx.sort((p, q) => rr[p] - rr[q] || p - q);
  const lag = (f) => { let c = 0; for (let k = 0; k < N; k++) { c += S.m[idx[k]]; if (c >= f * M * (1 - 1e-12)) return rr[idx[k]]; } return rr[idx[N - 1]]; };
  const r10 = lag(0.1), r50 = lag(0.5), r90 = lag(0.9);
  const rho1 = 0.4 * M / (4 / 3 * Math.PI * (r50 ** 3 - r10 ** 3)), rho2 = 0.4 * M / (4 / 3 * Math.PI * (r90 ** 3 - r50 ** 3));
  const slope = Math.log(rho2 / rho1) / Math.log(Math.sqrt(r50 * r90) / Math.sqrt(r10 * r50));
  // r ≤ r90 の星: 慣性テンソル・速度分散(動径と接線)・z のまわりの回転
  const T = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let n = 0, sr = 0, st = 0, s3 = 0, vphi = 0;
  for (let i = 0; i < N; i++) {
    if (rr[i] > r90) continue;
    const X = S.x[i] - cx, Y = S.y[i] - cy, Z = S.z[i] - cz, VX = S.vx[i] - ux, VY = S.vy[i] - uy, VZ = S.vz[i] - uz, r = rr[i];
    T[0][0] += X * X; T[0][1] += X * Y; T[0][2] += X * Z; T[1][1] += Y * Y; T[1][2] += Y * Z; T[2][2] += Z * Z;
    const v2 = VX * VX + VY * VY + VZ * VZ, vr = r > 0 ? (X * VX + Y * VY + Z * VZ) / r : 0;
    sr += vr * vr; st += v2 - vr * vr; s3 += v2;
    const R = Math.hypot(X, Y); if (R > 0) vphi += (X * VY - Y * VX) / R;
    n++;
  }
  T[1][0] = T[0][1]; T[2][0] = T[0][2]; T[2][1] = T[1][2];
  const ev = eig3(T), sigR = Math.sqrt(sr / n), sigT = Math.sqrt(st / n), sig1 = Math.sqrt(s3 / (3 * n));
  const E = K + Wp, out = {
    r10, r50, r90, conc: r10 / r50, slope, ba: Math.sqrt(ev[1] / ev[0]), ca: Math.sqrt(ev[2] / ev[0]), sigR, sigT, beta: 1 - (sigT * sigT) / (2 * sigR * sigR),
    vir: 2 * Kc / Math.abs(Wp), esc: nEsc / N, vrot: (vphi / n) / sig1, E, L: [Lx, Ly, Lz], cm: [cx, cy, cz], dE: 0, dL: 0, dCM: 0,
  };
  if (ref) {
    out.dE = (E - ref.E0) / Math.abs(ref.E0);
    out.dL = Math.hypot(Lx - ref.L0[0], Ly - ref.L0[1], Lz - ref.L0[2]) / ref.Lscale;
    out.dCM = Math.hypot(cx - ref.cm0[0], cy - ref.cm0[1], cz - ref.cm0[2]) / ref.rh;
  }
  return out;
}

/** 星 1 個の引きずり半径(模型の単位)と自己の重み w_ii = m/R_d^α の列(銀河の尺度への写し —— 星 1 個の質量 M_gal/N) */
export function selfWeights(S, alpha, galaxy = DECL.galaxy) {
  const aM = galaxy.aKpc * GR.KPC_M, out = new Float64Array(S.N);
  let RdModel = null;
  for (let i = 0; i < S.N; i++) {
    const mKg = S.m[i] * galaxy.Msun * GR.MSUN_KG, Rd = rdOf(mKg, 'kappa0') / aM;
    RdModel = Rd; out[i] = S.m[i] / (alpha === 1 ? Rd : Rd * Rd);
  }
  return { w: out, RdModel };
}

/**
 * 積分(蛙跳び KDK)。spec = { action: grav|vel|push, alpha, self: none|Rd, gamma(模型の時間の逆数 —— push だけ), eps, h, steps, every(測りの間隔の步) }。
 * 戻り値 { series:[{t, q:{…}}](every 步ごと —— t = 0 を含む), ledger:{ E0, E1, Wdrag, resid }, maxSuppress(R_d のとき Σw/(w_ii + Σw) の最大 —— 時刻 0) }
 */
export function integrate(S0, spec, scales) {
  const { action, alpha = 2, self = 'none', gamma = 0, eps, h, steps, every } = spec;
  if (!ACTIONS.includes(action) || !SELF_RULES.includes(self)) throw new RangeError('integrate: 作用の型か自己の重みの規則が無い');
  if (!(fin(h) && h > 0 && Number.isInteger(steps) && steps > 0 && Number.isInteger(every) && every > 0 && steps % every === 0)) throw new RangeError('integrate: h > 0・steps は every の倍数');
  if (action === 'push' && !(fin(gamma) && gamma >= 0)) throw new RangeError('integrate: push は γ ≥ 0');
  const S = cloneState(S0), N = S.N, drag = action !== 'grav';
  const SW = drag && self === 'Rd' ? selfWeights(S, alpha) : null, sw = SW ? SW.w : null;
  let F = forces(S, eps, drag, alpha, sw);
  const g = action === 'push' ? gamma : 0;
  const q0 = measure(S, F), ref = { E0: q0.E, L0: q0.L, cm0: q0.cm, Lscale: scales.rh * scales.vrms, rh: scales.rh };
  let maxSuppress = null;
  if (sw) { maxSuppress = 0; for (let i = 0; i < N; i++) maxSuppress = Math.max(maxSuppress, F.W[i] / (sw[i] + F.W[i])); }
  const series = [{ t: 0, q: measure(S, F, ref) }];
  let Wdrag = 0;
  const ax0 = new Float64Array(N), ay0 = new Float64Array(N), az0 = new Float64Array(N), dx0 = new Float64Array(N), dy0 = new Float64Array(N), dz0 = new Float64Array(N);
  let G = null;
  const kick = (Fk) => {   // v ← v + (h/2)(a + γd)・push の仕事は (h/2) Σ m γ d·(v_前 + v_後)/2
    let w = 0;
    for (let i = 0; i < N; i++) {
      const bx = S.vx[i], by = S.vy[i], bz = S.vz[i];
      S.vx[i] = bx + 0.5 * h * (Fk.ax[i] + g * Fk.dx[i]); S.vy[i] = by + 0.5 * h * (Fk.ay[i] + g * Fk.dy[i]); S.vz[i] = bz + 0.5 * h * (Fk.az[i] + g * Fk.dz[i]);
      if (g) w += S.m[i] * g * (Fk.dx[i] * (bx + S.vx[i]) + Fk.dy[i] * (by + S.vy[i]) + Fk.dz[i] * (bz + S.vz[i])) * 0.25 * h;
    }
    return w;
  };
  for (let s = 1; s <= steps; s++) {
    Wdrag += kick(F);
    ax0.set(F.ax); ay0.set(F.ay); az0.set(F.az); dx0.set(F.dx); dy0.set(F.dy); dz0.set(F.dz);
    const vel = action === 'vel';
    for (let i = 0; i < N; i++) { S.x[i] += h * (S.vx[i] + (vel ? dx0[i] : 0)); S.y[i] += h * (S.vy[i] + (vel ? dy0[i] : 0)); S.z[i] += h * (S.vz[i] + (vel ? dz0[i] : 0)); }
    G = forces(S, eps, drag, alpha, sw, G === F ? null : G);
    if (vel) { let w = 0; for (let i = 0; i < N; i++) w -= S.m[i] * 0.5 * ((ax0[i] + G.ax[i]) * dx0[i] + (ay0[i] + G.ay[i]) * dy0[i] + (az0[i] + G.az[i]) * dz0[i]) * h; Wdrag += w; }
    const tmp = F; F = G; G = tmp;
    Wdrag += kick(F);
    if (s % every === 0) series.push({ t: s * h, q: measure(S, F, ref) });
  }
  const E1 = series[series.length - 1].q.E;
  return { series, ledger: { E0: q0.E, E1, Wdrag, resid: (E1 - q0.E - Wdrag) / Math.abs(q0.E) }, maxSuppress, RdModel: SW ? SW.RdModel : null };
}

/** 幅(最大 − 最小)。rel のとき ÷ |平均| はしない —— 呼ぶ側が Q(0) で割った差を渡す */
export function spread(vals) { const q = vals.filter(fin); if (q.length !== vals.length || !q.length) return null; return Math.max(...q) - Math.min(...q); }
/** 量 Q の時刻 t の値と時刻 0 の値の変化(rel は ÷ |Q(0)|) */
export function changeOf(key, q0, q1) { const d = q1[key] - q0[key]; return QKIND[key] === 'rel' ? d / Math.abs(q0[key]) : d; }

/* ───────── 純関数の場面(門) ───────── */
export function pureScenes() {
  const S = {};
  // ① 標本: 同じ種で同じ列・質量の割合(r < 1 の Plummer —— 解析 2^(−3/2)/uMax)・ビリアル比 —— N 4096・ε 0.01
  {
    const A = sampleModel({ model: 'plummer', N: 4096, seed: 11 }), B = sampleModel({ model: 'plummer', N: 4096, seed: 11 });
    const same = ['x', 'y', 'z', 'vx', 'vy', 'vz'].every((k) => A.S[k].every((v, i) => v === B.S[k][i]));
    let n1 = 0; for (let i = 0; i < 4096; i++) if (Math.hypot(A.S.x[i], A.S.y[i], A.S.z[i]) < 1) n1++;
    S.plummer = { same, frac1: n1 / 4096, expect: Math.pow(2, -1.5) / DECL.uMax.plummer, sigma: Math.sqrt(0.36 * 0.64 / 4096), vir: energies(A.S, 0.01).vir };
  }
  // ② 引きずりの和が第334便e の gridField(受け手を星に・自分を外す・s_d 0)の U から v を引いたものと同じ(α 2・1 × ε 0.05・0.1)
  {
    const A = sampleModel({ model: 'plummer', N: 64, seed: 5 }).S;
    const GS = { n: 64, x: A.x, y: A.y, z: A.z, vx: A.vx, vy: A.vy, vz: A.vz, m: A.m, sn: new Float64Array(64), ss: new Float64Array(64) };
    let maxRel = 0, nC = 0;
    for (const eps of [0.05, 0.1]) {
      const G = gridField({ rec: Array.from({ length: 64 }, (_, i) => [A.x[i], A.y[i], A.z[i]]), S: GS, epsList: [eps], exclude: Array.from({ length: 64 }, (_, i) => i), W0: 0 });
      for (const [alpha, c] of [[2, 0], [1, 1]]) {
        const F = forces(A, eps, true, alpha, null);
        for (let i = 0; i < 64; i++) { const U = G.out[i][0][c]; maxRel = Math.max(maxRel, relD(F.dx[i] + A.vx[i], U[0]), relD(F.dy[i] + A.vy[i], U[1]), relD(F.dz[i] + A.vz[i], U[2])); }
        nC++;
      }
    }
    S.gridSame = { maxRel, n: nC };
  }
  // ③ 引きずりの恒等: 全部の星を同じ速度 V にして d_i = 0(自己なし)/一様な速度を足しても d は同じ(ガリレイ)/自己の重みが大きいと |d| ≤ (1 − f_self) max|v_j − v_i|
  {
    const A = sampleModel({ model: 'plummer', N: 48, seed: 7 }).S, U = cloneState(A);
    for (let i = 0; i < 48; i++) { U.vx[i] = 0.3; U.vy[i] = -0.2; U.vz[i] = 0.1; }
    const F0 = forces(U, 0.05, true, 2, null); let zero = 0; for (let i = 0; i < 48; i++) zero = Math.max(zero, Math.abs(F0.dx[i]), Math.abs(F0.dy[i]), Math.abs(F0.dz[i]));
    const B = cloneState(A); for (let i = 0; i < 48; i++) { B.vx[i] += 0.7; B.vy[i] -= 0.4; B.vz[i] += 0.25; }
    const FA = forces(A, 0.05, true, 2, null), FB = forces(B, 0.05, true, 2, null); let gal = 0; for (let i = 0; i < 48; i++) gal = Math.max(gal, Math.abs(FA.dx[i] - FB.dx[i]), Math.abs(FA.dy[i] - FB.dy[i]), Math.abs(FA.dz[i] - FB.dz[i]));
    const sw = new Float64Array(48).fill(1e6), FS = forces(A, 0.05, true, 2, sw); let ineq = true;
    for (let i = 0; i < 48; i++) { let mx = 0; for (let j = 0; j < 48; j++) if (j !== i) mx = Math.max(mx, Math.hypot(A.vx[j] - A.vx[i], A.vy[j] - A.vy[i], A.vz[j] - A.vz[i])); const fs = sw[i] / (sw[i] + FS.W[i]); if (Math.hypot(FS.dx[i], FS.dy[i], FS.dz[i]) > (1 - fs) * mx * (1 + 1e-12)) ineq = false; }
    S.dragId = { zero, gal, ineq };
  }
  // ④ 重力: 運動量の和が 0(Σ m a)・時間の反転(重力だけの蛙跳び —— N 16・40 步で前に進めて速度を反して戻す)
  {
    const A = sampleModel({ model: 'plummer', N: 16, seed: 3 }).S, F = forces(A, 0.05);
    let px = 0, py = 0, pz = 0, sc = 0; for (let i = 0; i < 16; i++) { px += A.m[i] * F.ax[i]; py += A.m[i] * F.ay[i]; pz += A.m[i] * F.az[i]; sc += A.m[i] * Math.hypot(F.ax[i], F.ay[i], F.az[i]); }
    const sc0 = scalesOf('plummer'), R1 = integrate(A, { action: 'grav', eps: 0.05, h: 0.01, steps: 40, every: 40 }, sc0);
    // 前に進めた状態を作り直す(integrate は状態を返さない —— 同じ手順を直に)
    const fwd = (S0, n) => { const T = cloneState(S0); let FF = forces(T, 0.05); for (let s = 0; s < n; s++) { for (let i = 0; i < 16; i++) { T.vx[i] += 0.005 * FF.ax[i]; T.vy[i] += 0.005 * FF.ay[i]; T.vz[i] += 0.005 * FF.az[i]; } for (let i = 0; i < 16; i++) { T.x[i] += 0.01 * T.vx[i]; T.y[i] += 0.01 * T.vy[i]; T.z[i] += 0.01 * T.vz[i]; } FF = forces(T, 0.05); for (let i = 0; i < 16; i++) { T.vx[i] += 0.005 * FF.ax[i]; T.vy[i] += 0.005 * FF.ay[i]; T.vz[i] += 0.005 * FF.az[i]; } } return T; };
    const T1 = fwd(A, 40); for (let i = 0; i < 16; i++) { T1.vx[i] = -T1.vx[i]; T1.vy[i] = -T1.vy[i]; T1.vz[i] = -T1.vz[i]; }
    const T2 = fwd(T1, 40); let back = 0; for (let i = 0; i < 16; i++) back = Math.max(back, Math.abs(T2.x[i] - A.x[i]), Math.abs(T2.y[i] - A.y[i]), Math.abs(T2.z[i] - A.z[i]), Math.abs(T2.vx[i] + A.vx[i]));
    S.gravity = { momRel: Math.hypot(px, py, pz) / sc, back, dE: R1.ledger.resid, sameFwd: Math.abs(R1.series[1].q.E - energies(fwd(A, 40), 0.05).E) };
  }
  // ⑤ 測りの関数(既知の配置): 軸の上の点の組で b/a = 1/2・c/a = 1/4・動径だけの速度で β = 1・ラグランジュ半径
  {
    // 軸の上の 54 点(k = 1〜9 × 符号 × 3 軸 —— 半軸 1・1/2・1/4)と、r90 の外に遠い 6 点(対角の向きの対 —— 測りの範囲から外れる)
    const pts = [], N = 60; for (let k = 1; k <= 9; k++) for (const s of [1, -1]) pts.push([s * k, 0, 0, k], [0, s * 0.5 * k, 0, k], [0, 0, s * 0.25 * k, k]);
    for (const s of [1, -1]) pts.push([s * 600, s * 600, s * 600, 1], [s * 600, -s * 600, s * 600, 1], [-s * 600, s * 600, s * 600, 1]);
    const A = emptyState(N); pts.forEach((p, i) => { A.x[i] = p[0]; A.y[i] = p[1]; A.z[i] = p[2]; const r = Math.hypot(p[0], p[1], p[2]), f = 0.01 * p[3]; A.vx[i] = p[0] / r * f; A.vy[i] = p[1] / r * f; A.vz[i] = p[2] / r * f; A.m[i] = 1 / N; });
    // 対称なので重心 0・速度の平均 0(対の符号 —— 速さは k だけに依る)
    const q = measure(A, forces(A, 0.1));
    S.measure = { ba: q.ba, ca: q.ca, beta: q.beta, vrot: q.vrot, eig: eig3([[2, 1, 0], [1, 2, 0], [0, 0, 5]]) };
  }
  // ⑥ Hernquist: 包みの外れ 0・質量の割合(r < 1 —— 解析 1/4 ÷ uMax)・ビリアル比・f の小さい q の正
  {
    const A = sampleModel({ model: 'hernquist', N: 4096, seed: 13 });
    let n1 = 0; for (let i = 0; i < 4096; i++) if (Math.hypot(A.S.x[i], A.S.y[i], A.S.z[i]) < 1) n1++;
    S.hernquist = { miss: A.envelopeMiss, frac1: n1 / 4096, expect: 0.25 / DECL.uMax.hernquist, sigma: Math.sqrt(0.28 * 0.72 / 4096), vir: energies(A.S, 0.01).vir, fSmall: hernquistF(1e-3) > 0 && hernquistF(0.5) > hernquistF(0.1) };
  }
  // ⑦ 回転の対照: |v| を星ごとに保つ・v_rot/σ(N 4096 —— 反しの割合 DECL.rotFlip の期待 ≈ 0.3)
  {
    const A = sampleModel({ model: 'plummer', N: 4096, seed: 17 }).S, B = rotateOf(A, DECL.rotFlip, 99);
    // 重心の速度を引く前の |v| を比べる: rotateOf は centre を呼ぶので、反しだけの写しで比べる
    let keep = 0; const C = cloneState(A), rng = rngOf(99);
    for (let i = 0; i < C.N; i++) { const R = Math.hypot(C.x[i], C.y[i]); if (!(R > 0)) continue; const ex = -C.y[i] / R, ey = C.x[i] / R, vp = C.vx[i] * ex + C.vy[i] * ey, u = rng(); if (vp < 0 && u < DECL.rotFlip) { C.vx[i] -= 2 * vp * ex; C.vy[i] -= 2 * vp * ey; }
      keep = Math.max(keep, Math.abs(Math.hypot(C.vx[i], C.vy[i], C.vz[i]) - Math.hypot(A.vx[i], A.vy[i], A.vz[i])) / Math.hypot(A.vx[i], A.vy[i], A.vz[i])); }
    S.rotate = { keep, vrot: measure(B, forces(B, 0.05)).vrot, vrot0: measure(A, forces(A, 0.05)).vrot };
  }
  // ⑧ 扁平の対照: c/a ≈ 0.7(N 2048 —— r ≤ r90 の星の慣性テンソル)・ビリアル比が球の標本と同じ
  {
    const A = sampleModel({ model: 'plummer', N: 2048, seed: 19 }).S, B = oblateOf(A, 0.7, 0.05);
    S.oblate = { ca: measure(B, forces(B, 0.05)).ca, ca0: measure(A, forces(A, 0.05)).ca, virRel: relD(energies(A, 0.05).vir, energies(B, 0.05).vir) };
  }
  // ⑨ 自己の重み R_d: 星 1 個の R_d(模型の単位)・抑えの割合 Σw/(w_ii + Σw) の最大(N 512・α 2・1)
  {
    const A = sampleModel({ model: 'plummer', N: 512, seed: 23 }).S, out = {};
    for (const alpha of [2, 1]) { const SW = selfWeights(A, alpha), F = forces(A, 0.05, true, alpha, SW.w); let mx = 0; for (let i = 0; i < 512; i++) mx = Math.max(mx, F.W[i] / (SW.w[i] + F.W[i])); out['a' + alpha] = { RdModel: SW.RdModel, maxSuppress: mx }; }
    S.selfRd = out;
  }
  // ⑩ 入力の拒否
  {
    const tries = [() => sampleModel({ model: 'king', N: 10, seed: 1 }), () => sampleModel({ model: 'plummer', N: 1, seed: 1 }), () => sampleModel({ model: 'plummer', N: 8, seed: -1 }),
      () => forces(sampleModel({ model: 'plummer', N: 8, seed: 1 }).S, -0.1), () => forces(sampleModel({ model: 'plummer', N: 8, seed: 1 }).S, 0.1, true, 3),
      () => integrate(sampleModel({ model: 'plummer', N: 8, seed: 1 }).S, { action: 'fly', eps: 0.1, h: 0.1, steps: 2, every: 1 }, scalesOf('plummer')),
      () => integrate(sampleModel({ model: 'plummer', N: 8, seed: 1 }).S, { action: 'grav', eps: 0.1, h: 0.1, steps: 3, every: 2 }, scalesOf('plummer')),
      () => oblateOf(sampleModel({ model: 'plummer', N: 8, seed: 1 }).S, 0, 0.1), () => rotateOf(sampleModel({ model: 'plummer', N: 8, seed: 1 }).S, 2, 1), () => scalesOf('king')];
    let n = 0; for (const f of tries) { try { f(); } catch (e) { if (e instanceof RangeError) n++; } }
    S.reject = { n, of: tries.length };
  }
  return S;
}
export function pureGates(S) {
  const t = DECL.idTol;
  return {
    plummer: S.plummer.same && Math.abs(S.plummer.frac1 - S.plummer.expect) <= 4 * S.plummer.sigma && Math.abs(S.plummer.vir - 1) <= 0.1,
    gridSame: S.gridSame.n === 4 && S.gridSame.maxRel <= 1e-10,
    dragId: S.dragId.zero <= 1e-15 && S.dragId.gal <= 1e-12 && S.dragId.ineq,
    gravity: S.gravity.momRel <= 1e-13 && S.gravity.back <= 1e-8 && Math.abs(S.gravity.dE) <= 1e-3 && S.gravity.sameFwd <= 1e-13,
    measure: Math.abs(S.measure.ba - 0.5) <= t && Math.abs(S.measure.ca - 0.25) <= t && Math.abs(S.measure.beta - 1) <= t && Math.abs(S.measure.vrot) <= t
      && Math.abs(S.measure.eig[0] - 5) <= t && Math.abs(S.measure.eig[1] - 3) <= t && Math.abs(S.measure.eig[2] - 1) <= t,
    hernquist: S.hernquist.miss === 0 && Math.abs(S.hernquist.frac1 - S.hernquist.expect) <= 4 * S.hernquist.sigma && Math.abs(S.hernquist.vir - 1) <= 0.1 && S.hernquist.fSmall,
    rotate: S.rotate.keep <= 1e-14 && Math.abs(S.rotate.vrot - DECL.rotTarget) <= 0.06 && Math.abs(S.rotate.vrot0) <= 0.06,
    oblate: Math.abs(S.oblate.ca - 0.7) <= 0.06 && S.oblate.ca0 > 0.85 && S.oblate.virRel <= 1e-12,
    selfRd: S.selfRd.a2.maxSuppress < 1e-11 && S.selfRd.a1.maxSuppress < 1e-3 && S.selfRd.a2.RdModel > 0 && S.selfRd.a2.RdModel < 1e-6,
    reject: S.reject.n === S.reject.of,
  };
}
