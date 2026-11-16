// 第340便b(原仮定者の指示(2026-11-17 —— 第140報)「回転成分は並進引きずりに含まれるので、二重計上を避けると、軸方向では軸引きずりがゼロになる」
//   「赤道面での引きずりは、並進引きずりは順回転だが、軸引きずりでは逆回転となる。その為、源の回転速度や、距離によって、引きずりの見え方が変化する」
//   「宇宙に天体が１つなら、移動も回転も検知出来ず、完全な座標変換になる」「赤道面では、軸引きずりは軸を起き上がらせる力になる為、ジャイロトルクで歳差運動を引き起こす」・
//   原仮定者の指示(2026-10-18 —— 第101報・第103報)の 2 倍角の則・原仮定者の指示(2026-10-30 —— 第121報)の合成の規則・統括の検証項目 R357):
//   **軸引きずりの回転成分の二重計上の切り分け(軸方向で 0 になる候補の列)・赤道面の見え方(並進は順・軸は逆)・合成の規則の主の列・金星の 3 成分** の純関数。
//   (段 axialsplit-340b —— 器 tests/exp-w340b-axialsplit.mjs・正本 tests/out/axialsplit-340b.json)。**探索の候補の表だけ** —— エンジン・内蔵の本・受理器・既存の lib の本文は変えない
//   (第338便b・第337便l・第330便a・第335便b の lib を呼ぶだけ)。html を読まない・ネットへ取りに行かない・乱数を使わない。薄い角は Math.atan2(|外積|, 内積) で求める。
//
// ■ 記号: 源の自転 s(向き ŝ)・受け手の中心 p(距離 r・単位ベクトル r̂・仰角 el —— sin el = ŝ·r̂)・s∥ = (s·r̂) r̂・s⊥ = s − s∥・源の取り分 f(p) = w/(w + W_self + W₀)(w = m/r^α・α 2)。
// ■ T1 の 4 列(向き = 源の自転軸からの角・強さ —— 数で):
//   列 (i) q 0(2 倍角の則 s∥ − s⊥)・列 (ii) q 1(−s⊥ + √2 cos(el) s∥)—— 第338便b の twistAxis を呼ぶ。
//   列 (iii) 運ばれる速度の場の勾配を 2 つに分ける型(統括の参考の試作): u = f(p) Ω × p の勾配 J = f [Ω]× + (Ω × p) ⊗ ∇f。第 1 項 = 座標の回転(並進引きずりの回転成分 —— 取り分 f だけ順)・
//     第 2 項 = 部位差分。第 2 項の反対称の部分(回転ベクトル ½ ∇f × (Ω × p) = ½ r f′ s⊥ = −(α/2) f(1 − f) s⊥)と対称の部分(歪み)を、数値の差分のヤコビアンと閉じた形の両方で。
//   列 (iv) 有限の受け手の部位差分を直接に数える: 半径 R の球の表面の点(対の点を含む)で並進引きずりの速度 U = Σ 重み × 運ぶ速度 ÷ Σ 重み(自分を含む・背景は静止の重み W₀)を出し、
//     平均の並進と取り分の剛体の回転(f(p) Ω + g_self(p) s_r)を引いた残りに最小二乗で角速度を当てる。R/r → 0 で列 (iii) の第 2 項へ寄るか。
// ■ T2 赤道面の見え方: 並進引きずりの回転成分(順 f s)+ 軸引きずり(逆 —— 部位差分)= 見え方(和)。差分の 2 つの置き方: 列 B′ = α f(1 − f)(運ばれる角速度の動径の勾配 r dΩ/dr —— 第338便b)/
//   列 (iii) = (α/2) f(1 − f)(場の渦の半分 ½∇×u の部位差分の分)。和は f s(1 − α(1 − f))(B′ —— α 2 で f s(2f − 1) = −列 A)と f s(1 − (α/2)(1 − f))(iii —— α 2 で f² s)。
// ■ 言わないこと: どの列を採るかを決めない(候補の表 —— q 1 は主の列・q 0 は比べる列の読みで並べる)。和と差分のどちらを自転の式に入れるかを決めない。光速を判定に使わない。文献の値は未照合。
import { twistAxis, overallAxis, ruleRow, colCoef, colAmp, orbitMeanAxis, muOf, LITJ, DECL as K338, LIB_VERSION as K338_VERSION } from './lib-w338b-bevelknob.mjs';
import { splitSpin, venusBalance, planetRows, moonRows, shareSun, DECL as L337, LIT as LIT337, LIB_VERSION as L337_VERSION } from './lib-w337l-bevel.mjs';
import { galacticAxes } from './lib-w335b-carryledger.mjs';
import { DECL as D330 } from './lib-w330a-spinclass.mjs';

export const LIB_VERSION = 'w340b-axialsplit-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const scl = (a, k) => [a[0] * k, a[1] * k, a[2] * k], add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const D2R = Math.PI / 180, DAY = 86400, YR = 365.25 * DAY, MSUN = 1.98847e30, AU = 1.495978707e11;
/** 2 つの向きのなす角 [°] —— Math.atan2(|外積|, 内積)(薄い角でも桁を失わない —— 共通ブリーフの教訓 2) */
export const angDeg = (a, b) => (nrm(a) > 0 && nrm(b) > 0 ? Math.atan2(nrm(crs(a, b)), dot(a, b)) / D2R : null);
/** 丸めの残り: |x| が尺度 × 1e-12 より小さければ 0 */
export const FLOOR = 1e-12;
export const z12 = (x, scale = 1) => (Math.abs(x) < FLOOR * Math.abs(scale) ? 0 : x);

/** 宣言(走行の前に置く —— 走らせたノブの格子と判定の物差しの記録) */
export const DECL = Object.freeze({
  alpha: 2,
  /** 仰角の格子 [°](原文の 3 点 0°・45°・90° を含む) */
  elevDeg: Object.freeze([0, 15, 30, 45, 60, 75, 90]),
  /** 源の取り分 f の点(受け手の中心での値 —— 正規化: s 1・f ½ の距離 1・α 2 で r = √((1 − f)/f)) */
  fGrid: Object.freeze([0.1, 0.5, 0.9]),
  /** 列 (iii) の数値の差分のヤコビアンの刻み(÷ r) */
  hJac: 1e-5,
  /** 列 (iv): 球の表面の点の数(半分を Fibonacci の点・残りを対の点)と受け手の半径 R/r */
  nPts: 400, rOverR: Object.freeze([1e-2, 1e-3, 1e-4]),
  /** 列 (iv) の W₀ の 2 列(W_rest = W_self + W₀ を 1 に固定して、W₀ の割合 φ 0〔W₀ = 0〕と ½〔背景が静止の重み〕)と受け手の並進(0 と公転の向きの n r —— n/s 0.3) */
  w0Frac: Object.freeze([0, 0.5]), nOverS: 0.3,
  /** T1 の比べる列(第338便b の補正のノブ q と全体に掛ける型 p —— 軸の方向で強さ 0 になる列を並べる) */
  qCols: Object.freeze([0, 0.25, 0.5, 0.75, 1]), pCols: Object.freeze([1, 2]),
  /** T2: 距離の走査(ρ = r / r_½)と主な衛星 */
  rhoGrid: Object.freeze([0.1, 0.3, 0.5, 1, 2, 3, 10]),
  /** T3: 合成の比と配置の角 [°](銀河と太陽系 120°・原始太陽系 180°) */
  ruleRatios: Object.freeze([1, 0.5, 0.1]), ruleConfigs: Object.freeze([120, 180]),
  /** T4: 金星の列(列 A・列 B・列 B′・列 (iii) の半分の型)と q */
  venusCols: Object.freeze(['A', 'B', 'Bp', 'Bh']), venusQ: Object.freeze([0, 1]),
  /** T4 (c) 和の 3 成分の最小を探す比 t = 太陽の項 ÷ 背景の項 の走査(対数の格子の点の数・範囲 10^±8) */
  tScanN: 1601, tScanDec: 8,
});
export const VCOL_JA = Object.freeze({ A: '列 A f(α_e − 1)', B: '列 B f', Bp: '列 B′ α f(1 − f)', Bh: '列 (iii) (α/2) f(1 − f)' });
/** 金星の列の係数(A(f) = c0 + c1 f + c2 f²)—— 列 (iii) の半分の型は第338便b の列 B′ の ½ */
export const vColCoef = (c, alpha = DECL.alpha) => (c === 'Bh' ? [0, alpha / 2, -alpha / 2] : colCoef(c, alpha));

/* ───────── 共通 ───────── */
const at = (elDeg) => (elDeg === 90 ? [0, 0, 1] : elDeg === 0 ? [1, 0, 0] : [Math.cos(elDeg * D2R), 0, Math.sin(elDeg * D2R)]);
/** 正規化の取り分: f(r) = 1/(1 + (r/r_½)^α)(r_½ = 1)・中心の f から距離 */
export const fOfR = (r, alpha = DECL.alpha) => 1 / (1 + Math.pow(r, alpha));
export const rOfF = (f, alpha = DECL.alpha) => Math.pow((1 - f) / f, 1 / alpha);
/** 向きの種類(第338便b と同じ読み —— 角の数で候補を落とさない) */
export const kindOf = (ang) => (ang === null ? '強さ 0' : Math.abs(ang - 90) <= 1e-9 ? '90° 傾き' : ang > 90 ? '逆の側' : '順の側');

/* ───────── T1 列 (iii) ───────── */
/** 運ばれる速度 u(p) = f(p) Ω × p(Ω = s ẑ・W_rest = 1・r_½ = 1)。single = true で f ≡ 1(天体が 1 つ —— 受け手と背景の重み 0) */
export const carried = (p, { s = 1, alpha = DECL.alpha, single = false } = {}) => scl(crs([0, 0, s], p), single ? 1 : fOfR(nrm(p), alpha));
/** 数値の差分のヤコビアン J_ij = ∂u_i/∂p_j(中心差分) */
export function jacobianNum(p, opts = {}) {
  const h = DECL.hJac * nrm(p), J = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  for (let j = 0; j < 3; j++) { const e = [0, 0, 0]; e[j] = h; const up = carried(add(p, e), opts), um = carried(sub(p, e), opts);
    for (let i = 0; i < 3; i++) J[i][j] = (up[i] - um[i]) / (2 * h); }
  return J;
}
/** 行列の反対称の部分の回転ベクトル(ω_k = ½ ε_kij A_ij の形 —— ω × x = A x)と対称の部分のフロベニウスの大きさ */
export function splitMatrix(M) {
  const w = [(M[2][1] - M[1][2]) / 2, (M[0][2] - M[2][0]) / 2, (M[1][0] - M[0][1]) / 2];
  let s2 = 0; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) { const v = (M[i][j] + M[j][i]) / 2; s2 += v * v; }
  return { rot: w, strain: Math.sqrt(s2) };
}
/** 列 (iii) の 1 点: 第 1 項 f[Ω]×(座標の回転 —— 回転ベクトル f s ẑ)を引いた第 2 項の回転(数値)と閉じた形 −(α/2) f(1 − f) s⊥・歪みの大きさ (α/√2) f(1 − f) s cos el */
export function col3At(elDeg, f, { s = 1, alpha = DECL.alpha, single = false } = {}) {
  const r = single ? 1 : rOfF(f, alpha), p = scl(at(elDeg), r), J = jacobianNum(p, { s, alpha, single }), fc = single ? 1 : fOfR(r, alpha);
  const W = [[0, -s, 0], [s, 0, 0], [0, 0, 0]], J2 = J.map((row, i) => row.map((v, j) => v - fc * W[i][j])), sp = splitMatrix(J2);
  const ce = elDeg === 90 ? 0 : Math.cos(elDeg * D2R), se = elDeg === 90 ? 1 : Math.sin(elDeg * D2R), perp = [-s * ce * se, 0, s * ce * ce], ff = single ? 0 : fc * (1 - fc);   // s⊥ を宣言の仰角から(90° でちょうど 0)
  const rotClosed = scl(perp, -(alpha / 2) * ff), strainClosed = (alpha / Math.SQRT2) * ff * nrm(perp);
  // 丸めの床の尺度: 差分の刻みで割る増幅 s/h × 1e-2(数値 —— 床 1e-9 s)・s(閉じた形)
  const scN = s / DECL.hJac * 1e-2;
  const rotN = sp.rot.map((v) => z12(v, scN)), rotNm = nrm(rotN), rcm = nrm(rotClosed);
  return {
    elDeg, f: single ? 1 : f, coordRot: z12(fc * s), rotNum: rotN, rotClosed: rotClosed.map((v) => z12(v, s)), magNum: z12(rotNm, scN), magClosed: z12(rcm, s),
    angNum: z12(rotNm, scN) === 0 ? null : angDeg(rotN, [0, 0, 1]), angClosed: z12(rcm, s) === 0 ? null : angDeg(rotClosed, [0, 0, 1]),
    strainNum: z12(sp.strain, scN), strainClosed: z12(strainClosed, s), dNumClosed: z12(nrm(sub(rotN, rotClosed)), scN),
  };
}

/* ───────── T1 列 (iv) ───────── */
/** 球の表面の点(N/2 個の Fibonacci の点と対の点 —— 決まった点・乱数なし) */
export function spherePts(N = DECL.nPts) {
  const h = N / 2, out = [], ga = Math.PI * (3 - Math.sqrt(5));
  for (let k = 0; k < h; k++) { const z = 1 - 2 * (k + 0.5) / h, rr = Math.sqrt(1 - z * z), ph = ga * k, v = [rr * Math.cos(ph), rr * Math.sin(ph), z]; out.push(v, scl(v, -1)); }
  return out;
}
/** 3 × 3 の連立(クラメル) */
function solve3(M, b) {
  const det = (A) => A[0][0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1]) - A[0][1] * (A[1][0] * A[2][2] - A[1][2] * A[2][0]) + A[0][2] * (A[1][0] * A[2][1] - A[1][1] * A[2][0]);
  const d = det(M), out = [];
  for (let c = 0; c < 3; c++) { const A = M.map((row, i) => row.map((v, j) => (j === c ? b[i] : v))); out.push(det(A) / d); }
  return out;
}
/**
 * 列 (iv) の 1 つの配置: 受け手の中心 p0(仰角 el・取り分 f)・半径 R = k r・W₀ の割合 φ(W_self = 1 − φ・W₀ = φ)・受け手の並進 v(背景に対して)・受け手の自転 s_r。
 * 各点 q の並進引きずりの速度 U(q) = [w(q) Ω × q + W_self (v + s_r × ξ) + W₀ · 0] ÷ (w(q) + W_self + W₀)(ξ = q − p0・源は背景に対して静止)。
 * single = true で W_self = W₀ = 0(天体が 1 つ)。残り δ = U − Ū − [f(p0) Ω + g_self(p0) s_r] × ξ に線形の写し A(δ ≈ A ξ)を最小二乗で当て、A の反対称の部分を角速度 ω とする。
 * 閉じた形(R → 0): ω → ½ ∇f × (Ω × p0) − ½ (g_self/(1 − f)) ∇f × v(∇f = f′ r̂・f′ = −α f(1 − f)/r)。
 */
export function col4At(elDeg, f, k, { phi = 0, v = [0, 0, 0], sr = [0, 0, 0], s = 1, alpha = DECL.alpha, single = false, N = DECL.nPts } = {}) {
  const r = rOfF(f, alpha), p0 = scl(at(elDeg), r), R = k * r, Om = [0, 0, s], Ws = single ? 0 : 1 - phi, W0 = single ? 0 : phi;
  const pts = spherePts(N).map((u) => scl(u, R)), U = pts.map((xi) => { const q = add(p0, xi), w = Math.pow(nrm(q), -alpha), S = w + Ws + W0;
    return scl(add(scl(crs(Om, q), w), scl(add(v, crs(sr, xi)), Ws)), 1 / S); });
  const w0 = Math.pow(r, -alpha), S0 = w0 + Ws + W0, fc = w0 / S0, gs = Ws / S0;
  const mean = scl(U.reduce((a, b) => add(a, b), [0, 0, 0]), 1 / U.length), rig = add(scl(Om, fc), scl(sr, gs));
  // 線形の写し δ ≈ A ξ を最小二乗で当てる(A = [Σ δ ξᵀ][Σ ξ ξᵀ]⁻¹ —— 点の組の 2 次の偏りに依らない)→ A の反対称の部分の回転ベクトル
  const M = [[0, 0, 0], [0, 0, 0], [0, 0, 0]], Dx = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  pts.forEach((xi, i) => { const d = sub(sub(U[i], mean), crs(rig, xi));
    for (let a = 0; a < 3; a++) for (let c = 0; c < 3; c++) { M[a][c] += xi[a] * xi[c]; Dx[a][c] += d[a] * xi[c]; } });
  // A の行 a: A[a] M = Dx[a] → M は対称なので A[a] = M⁻¹ Dx[a]
  const A = [0, 1, 2].map((a) => solve3(M, Dx[a])), om = splitMatrix(A).rot;
  // 閉じた形
  const rh = scl(p0, 1 / r), fp = -alpha * fc * (1 - fc) / r, gradF = scl(rh, fp);
  const closed = single ? [0, 0, 0] : add(scl(crs(gradF, crs(Om, p0)), 0.5), scl(crs(gradF, v), -0.5 * (1 - fc > 0 ? gs / (1 - fc) : 0)));
  // 丸めの床の尺度: 速度の大きさ (s r + |v|) ÷ R の増幅 × 1e-1(床 = 1e-13 (s r + |v|)/R —— 1e-16 の丸めの約 1000 倍)
  const sc = (s * r + nrm(v)) / R * 1e-1, cm = nrm(closed), omz = om.map((x) => z12(x, sc)), err = nrm(sub(omz, closed));
  return { elDeg, f, k, phi, single, om: omz, mag: z12(nrm(omz), sc), closed: closed.map((x) => z12(x, s)), magClosed: z12(cm, s), angFit: nrm(omz) === 0 ? null : angDeg(omz, Om),
    errRel: cm > 0 ? z12(err / cm) : z12(err, sc) };
}

/* ───────── T1 表 ───────── */
/** 仰角ごとの 4 列(と比べる列 q・p)の向きと強さ(÷ s。列 (iii)(iv) は ÷ f(1 − f) s —— 強さの係数を外した形) */
export function t1Rows() {
  const s = [0, 0, 1], fM = 0.5;
  return DECL.elevDeg.map((el) => {
    const rh = at(el), row = { elDeg: el, q: {}, p: {} };
    // 向きと強さは宣言の仰角から閉じた形で(q < 1 の cos^q は軸の近くで丸めの残りを大きく増幅する —— cos el を仰角から直に・90° でちょうど 0)。第338便b の twistAxis・overallAxis との差は純関数の場面 ⑦ が照らす
    const ce = el === 90 ? 0 : Math.cos(el * D2R), se = el === 90 ? 1 : Math.sin(el * D2R), sPerp = [ce * (el === 90 ? 0 : -se), 0, ce * ce], sPar = [se * ce, 0, se * se];
    for (const q of DECL.qCols) { const h = add(scl(sPerp, -1), scl(sPar, muOf(q) * (q === 0 ? 1 : Math.pow(ce, q)))), m = z12(nrm(h)); row.q[q] = { ang: m === 0 ? null : angDeg(h, s), mag: m, kind: kindOf(m === 0 ? null : angDeg(h, s)) }; }
    for (const p of DECL.pCols) { const g = scl(sub(sPar, sPerp), p === 0 ? 1 : Math.pow(ce, p)), m = z12(nrm(g)); row.p[p] = { ang: m === 0 ? null : angDeg(g, s), mag: m, kind: kindOf(m === 0 ? null : angDeg(g, s)) }; }
    const c3 = col3At(el, fM), ff = fM * (1 - fM);
    row.c3 = { ang: c3.angClosed, angNum: c3.angNum, mag: z12(c3.magClosed / ff), magNum: z12(c3.magNum / ff), strain: z12(c3.strainClosed / ff), strainNum: z12(c3.strainNum / ff), dNumClosed: c3.dNumClosed, kind: kindOf(c3.angClosed), coordRot: c3.coordRot };
    const c4 = col4At(el, fM, DECL.rOverR[DECL.rOverR.length - 1]);
    row.c4 = { ang: c4.angFit, mag: z12(c4.mag / ff), errRel: c4.errRel, kind: kindOf(c4.angFit) };
    // 旧い型との違い(q 1 と列 (iii)): 向きの角の差・強さの比(どちらも赤道の値で割った仰角の落ち方の比)
    const q1 = row.q[1], q1eq = 1, c3eq = DECL.alpha / 2;
    row.vsQ1 = { dAng: q1.ang === null || row.c3.ang === null ? null : row.c3.ang - q1.ang, magRatio: q1.mag === 0 ? null : (row.c3.mag / c3eq) / (q1.mag / q1eq) };
    row.vsQ0 = { dAng: row.c3.ang === null ? null : row.c3.ang - row.q[0].ang };
    return row;
  });
}
/** 軸の方向で強さ 0 になる列(どの列が 0 になるか —— q 1 だけではない)と 45° の向き・赤道の向き */
export function t1AxisZero(rows) {
  const r0 = rows.find((r) => r.elDeg === 0), r45 = rows.find((r) => r.elDeg === 45), r90 = rows.find((r) => r.elDeg === 90), out = [];
  for (const q of DECL.qCols) out.push({ col: 'q' + q, axisMag: r90.q[q].mag, eqAng: r0.q[q].ang, midAng: r45.q[q].ang, midMag: r45.q[q].mag });
  for (const p of DECL.pCols) out.push({ col: 'p' + p, axisMag: r90.p[p].mag, eqAng: r0.p[p].ang, midAng: r45.p[p].ang, midMag: r45.p[p].mag });
  out.push({ col: 'c3', axisMag: r90.c3.mag, eqAng: r0.c3.ang, midAng: r45.c3.ang, midMag: r45.c3.mag });
  out.push({ col: 'c4', axisMag: r90.c4.mag, eqAng: r0.c4.ang, midAng: r45.c4.ang, midMag: r45.c4.mag });
  return out.map((o) => ({ ...o, axisZero: o.axisMag === 0, mid90: o.midAng !== null && Math.abs(o.midAng - 90) <= 1e-9 }));
}
/** 列 (iv) の寄り方: f 3 点 × 仰角(0°・45°・75°)× R/r 3 点 × W₀ の 2 列 × 受け手の並進(0 と公転の向き) */
export function t1Converge() {
  const out = [];
  for (const f of DECL.fGrid) for (const el of [0, 45, 75]) for (const phi of DECL.w0Frac) for (const mv of [false, true]) {
    const r = rOfF(f), p0 = scl(at(el), r), v = mv ? crs([0, 0, DECL.nOverS], p0) : [0, 0, 0];
    const row = { f, elDeg: el, phi, moving: mv, err: {} };
    for (const k of DECL.rOverR) { const c = col4At(el, f, k, { phi, v }); row.err[k] = c.errRel; if (k === DECL.rOverR[DECL.rOverR.length - 1]) { row.mag = c.mag; row.magClosed = c.magClosed; row.ang = c.angFit; } }
    out.push(row);
  }
  return out;
}
/** 天体が 1 つの零試験: f ≡ 1(受け手と背景の重み 0)—— どの量が 0 になるか */
export function t1Null() {
  const rows = DECL.elevDeg.map((el) => {
    const c3 = col3At(el, 1, { single: true }), c4 = col4At(el, 0.5, 1e-2, { single: true }), c4b = col4At(el, 0.5, 1e-4, { single: true });
    return { elDeg: el, c3: c3.magNum, c3strain: c3.strainNum, c4: c4.mag, c4small: c4b.mag, coordRot: c3.coordRot };
  });
  // 列 (i)(ii) は取り分を掛ける前の向きの型 —— 強さの係数 f(1 − f) の側が 0。第338便b の 3 列の f 1 の値(列 A は座標の回転 −f を含む)
  const f = 1, coef = { ff: f * (1 - f), A: colAmp('A', f), B: colAmp('B', f), Bp: colAmp('Bp', f), Bh: (DECL.alpha / 2) * f * (1 - f) };
  return { rows, coef };
}

/* ───────── T2 赤道面の見え方 ───────── */
/** 正規化の 1 点: 順の分 f・逆の分 B′ α f(1 − f) と (iii) (α/2) f(1 − f)・和(÷ s) */
export function viewAt(f, alpha = DECL.alpha) {
  const pro = f, rB = alpha * f * (1 - f), rH = (alpha / 2) * f * (1 - f), sB = pro - rB, sH = pro - rH;
  return { f, pro, retroBp: rB, retroH: rH, sumBp: z12(sB, pro + rB), sumH: z12(sH, pro + rH), colA: colAmp('A', f, alpha), signBp: Math.sign(z12(sB, pro + rB)), signH: Math.sign(z12(sH, pro + rH)) };
}
/** 距離の走査(ρ = r/r_½)—— 和の符号の境目 f ½(B′)・境目なし(iii) */
export function t2Scan() { return DECL.rhoGrid.map((rho) => ({ rho, ...viewAt(fOfR(rho)) })); }
/** 源の取り分 ½ の距離 r_½ = (m / W_rest)^{1/α}(重み m/r^α —— 第337便a の weight337 の形) */
const rHalf = (m, Wrest, alpha = DECL.alpha) => Math.pow(m / Wrest, 1 / alpha);
/** 太陽 → 8 惑星・惑星 → 主な衛星: 順の分・逆の分・和・和の符号・境目の距離・今の並進の式の形(比べる列)の公転の比 n/s と符号 */
export function t2Bodies() {
  const sun = L337.spins.sun, sp = D330.lit.spinDays, alpha = DECL.alpha, rhS = rHalf(MSUN, L337.W0) / AU;
  const planets = planetRows().map((P) => { const v = viewAt(P.f), s = sun.s;
    return { key: P.key, src: 'sun', srcSpin: s, aAU: P.aAU, rHalfAU: rhS, aOverRHalf: P.aAU / rhS, f: P.f, pro: v.pro * s, retroBp: v.retroBp * s, retroH: v.retroH * s, sumBp: v.sumBp * s, sumH: v.sumH * s,
      signBp: v.signBp, signH: v.signH, nOverS: P.nOverS, selfSign: Math.sign(P.selfDiff) }; });
  const mr = moonRows().moons, hostM = LIT337.hostMass, hostA = LIT337.hostA;
  const moons = mr.map((M) => {
    const sHost = 2 * Math.PI / (Math.abs(sp[M.host]) * DAY), aM = LITJ.t2Receivers.find((x) => x.key === M.key).a;
    const wS = (MSUN / (AU * AU)) * Math.pow(AU / (hostA[M.host] * AU), alpha), Wrest = wS + L337.W0, rh = rHalf(hostM[M.host], Wrest);
    const v = viewAt(M.f), n = 2 * Math.PI / (orbitDays(M.key) * DAY);
    return { key: M.key, src: M.host, srcSpin: sHost, aKm: aM / 1e3, rHalfKm: rh / 1e3, aOverRHalf: aM / rh, f: M.f, pro: v.pro * sHost, retroBp: v.retroBp * sHost, retroH: v.retroH * sHost,
      sumBp: v.sumBp * sHost, sumH: v.sumH * sHost, signBp: v.signBp, signH: v.signH, nOverS: n / sHost, selfSign: Math.sign((1 - alpha) * sHost + alpha * n), retro: M.retro };
  });
  return { planets, moons, rHalfSunAU: rhS };
}
const orbitDays = (k) => D330.lit.orbitDays[k];

/* ───────── T3 合成の規則の主の列 ───────── */
/** 比 1・0.5・0.1 と実際の 2 つの項の比(太陽の項 ÷ 背景の項 —— 第337便l の planetRows)× 配置 120°・180°・実際の角: 主の列(普通のベクトル和 —— 境目を比で動かす型)と「どんな比でも 120°」の列の差 */
export function t3Rule() {
  const Lh = galacticAxes().Lhat, sun = L337.spins.sun.sHat, actualDeg = angDeg(sun, Lh), rows = [];
  for (const th of [...DECL.ruleConfigs, actualDeg]) for (const B of DECL.ruleRatios) { const r = ruleRow(B, th); rows.push({ cfg: th === actualDeg ? 'actual' : String(th), thDeg: th, ratio: B, main: r.ruleIII, rule120: r.ruleII, lift: r.liftII, boundary: r.boundaryIII, noDecelMain: r.noDecelIII, noDecel120: r.noDecelII }); }
  const bodies = planetRows().map((p) => {
    const a = Math.abs(p.sunRefSigned), b = Math.abs(p.bg), A = Math.max(a, b), Bm = Math.min(a, b), ratio = Bm / A, per = {};
    for (const th of [...DECL.ruleConfigs, actualDeg]) { const r = ruleRow(ratio, th); per[th === actualDeg ? 'actual' : String(th)] = { main: r.ruleIII * A, rule120: r.ruleII * A, lift: r.liftII * A, liftRel: r.liftII, boundary: r.boundaryIII }; }
    return { key: p.key, sunTerm: p.sunRefSigned, bgTerm: p.bg, ratio, per };
  });
  return { actualDeg, rows, bodies };
}

/* ───────── T4 金星の 3 成分 ───────── */
/** 金星の 3 成分: q(0・1)× 列(A・B・B′・(iii))の根ごとに、和のベクトル = A(f) s☉ P_q ŝ☉ + (1 − f) ω_bg L̂ の金星の自転の軸に平行な分(大きさを変える)と垂直な分(向きを変える)・
 *  垂直な分を「自転の大きさを変えずに軸を回す率」と読んだ歳差の周期(文献の値と桁で比べる) */
export function t4Venus() {
  const sun = L337.spins.sun, ven = planetRows().find((p) => p.key === 'venus'), Lh = galacticAxes().Lhat, sV = L337.spins.venus.sHat, nE = [0, 0, 1], sVmag = L337.spins.venus.s;
  const precLit = D330.lit.precessionArcsecPerYear.venus, precLitYr = 360 * 3600 / precLit, out = [];
  for (const q of DECL.venusQ) {
    const P = orbitMeanAxis({ iDeg: ven.iSunDeg, fn: (s, r) => twistAxis(s, r, q) }).alongSpin;
    for (const c of DECL.venusCols) {
      const coef = vColCoef(c), v = venusBalance({ P, amp: coef });
      // f = 1 の自明な根(太陽の項も背景の項も 0 —— 天体が 1 つと同じ。列 B′・(iii) は G(f) = (1 − f)(…) で丸めにより 1 − 1e-16 に出る)は外す
      const roots = v.rows.filter((r) => 1 - r.f > 1e-9).map((r) => {
        const A = coef[0] + coef[1] * r.f + coef[2] * r.f * r.f, sunV = scl(sun.sHat, A * sun.s * P), bgV = scl(Lh, (1 - r.f) * L337.wbg), sum = add(sunV, bgV), sc = nrm(sunV) + nrm(bgV);
        const sc0 = (Math.abs(coef[0]) + Math.abs(coef[1]) * r.f + Math.abs(coef[2]) * r.f * r.f) * sun.s * Math.abs(P) + nrm(bgV);
        const along = dot(sum, sV), perpV = sub(sum, scl(sV, along)), perp = nrm(perpV);
        const precRate = perp, precYr = precRate > 0 ? 2 * Math.PI / precRate / YR : null;
        return { f: r.f, kind: r.kind, W0: r.W0, north: z12(dot(sum, nE), sc0), alongRel: z12(along / sc), perpRel: z12(perp / sc), along, perp, sumMag: nrm(sum), precYr, precOverLit: precYr === null ? null : precYr / precLitYr,
          alongOverSpin: along / sVmag, perpOverSpin: perp / sVmag };
      });
      out.push({ q, col: c, P, nRoots: roots.length, roots });
    }
  }
  return { rows: out, precLitArcsecPerYr: precLit, precLitYr };
}
/** T4 (c): 今のノブ(f・W₀・q・背景の軸の向き)の範囲で 3 成分とも 0 になる組があるか —— 和 = a ŝ☉ + b L̂(a は f と q、b は f で動く —— 向きは ŝ☉ と L̂ の 2 つに固定)。
 *  比 t = a/b を走査して |t ŝ☉ + L̂| ÷ (|t| + 1) の最小(0 なら 3 成分とも 0 になれる)と、背景の軸の向きを ±ŝ☉ に重ねるのに要る角 */
export function t4Steady() {
  const sun = L337.spins.sun.sHat, Lh = galacticAxes().Lhat, N = DECL.tScanN, D = DECL.tScanDec;
  let best = { val: Infinity, t: null };
  for (const sg of [-1, 1]) for (let k = 0; k < N; k++) { const t = sg * Math.pow(10, -D + 2 * D * k / (N - 1)), v = nrm(add(scl(sun, t), Lh)) / (Math.abs(t) + 1); if (v < best.val) best = { val: v, t }; }
  // 閉じた形: 最小は t = −1 の近く(|ŝ☉ − L̂|/2 = sin(θ/2) —— θ = ŝ☉ と L̂ の角)・θ > 90° なら t = +1 で cos(θ/2)
  const th = angDeg(sun, Lh), closed = Math.min(Math.sin(th * D2R / 2), Math.cos(th * D2R / 2));
  const tiltNeed = Math.min(th, 180 - th);
  return { thDeg: th, minRel: best.val, tAtMin: best.t, minClosed: closed, tiltNeedDeg: tiltNeed, possible: best.val < 1e-9 };
}

/* ───────── 純関数の場面 ───────── */
export function pureScenes() {
  const S = {};
  // ① 列 (iii) の閉じた形と数値の差分のヤコビアン(仰角 3 点 × f 3 点 —— 差 ÷ f(1 − f) s)
  { let d = 0; for (const el of [10, 45, 80]) for (const f of DECL.fGrid) { const c = col3At(el, f); d = Math.max(d, nrm(sub(c.rotNum, c.rotClosed)) / (f * (1 - f))); } S.c3 = { d }; }
  // ② 列 (iii) は軸の上で 0・赤道で −(α/2) f(1 − f) s(逆の側)・45° で 135°
  { const a = col3At(90, 0.5), e = col3At(0, 0.5), m = col3At(45, 0.5); S.c3pts = { axis: a.magClosed, eqZ: e.rotClosed[2], eqAng: e.angClosed, midAng: m.angClosed }; }
  // ③ 有限の受け手(R/r 1e-3)が列 (iii) に寄る・天体が 1 つで 0
  { const c = col4At(30, 0.3, 1e-3), n = col4At(30, 0.5, 1e-2, { single: true }); S.c4 = { err: c.errRel, single: n.mag }; }
  // ④ 赤道面の見え方: α 2 で和(B′)= f(2f − 1) = −列 A・和(iii)= f²
  { let d = 0, dh = 0; for (const f of [0.05, 0.3, 0.5, 0.7, 0.95]) { const v = viewAt(f); d = Math.max(d, Math.abs(v.sumBp + v.colA), Math.abs(v.sumBp - f * (2 * f - 1))); dh = Math.max(dh, Math.abs(v.sumH - f * f)); } S.view = { d: z12(d), dh: z12(dh) }; }
  // ⑤ 角の求め方(atan2): 1e-9 rad の薄い角
  { const e = 1e-9, a = angDeg([1, 0, 0], [Math.cos(e), Math.sin(e), 0]) * D2R; S.thin = { rel: Math.abs(a - e) / e }; }
  // ⑦ T1 の閉じた形の q と p の列が第338便b の twistAxis・overallAxis と同じ(仰角 0°〜75°)
  { let d = 0; const rows = t1Rows(); for (const r of rows.filter((x) => x.elDeg < 90)) { const rh = at(r.elDeg);
      for (const q of DECL.qCols) { const h = twistAxis([0, 0, 1], rh, q); d = Math.max(d, Math.abs(nrm(h) - r.q[q].mag), Math.abs(angDeg(h, [0, 0, 1]) - r.q[q].ang) / 180); }
      for (const p of DECL.pCols) { const g = overallAxis([0, 0, 1], rh, p); d = Math.max(d, Math.abs(nrm(g) - r.p[p].mag), Math.abs(angDeg(g, [0, 0, 1]) - r.p[p].ang) / 180); } }
    S.same338 = { d: z12(d, 1e3) }; }
  // ⑥ 入力の拒否(第338便b の関数が拒む)
  { const tries = [() => twistAxis([0, 0, 1], [1, 0, 0], -1), () => ruleRow(2, 30), () => colCoef('x')]; S.rejects = tries.map((t) => { try { t(); return false; } catch (e) { return e instanceof RangeError; } }); }
  return S;
}
export function pureGates(S) {
  return {
    c3: S.c3.d <= 1e-6,
    c3pts: S.c3pts.axis === 0 && Math.abs(S.c3pts.eqZ + 0.25) <= 1e-12 && Math.abs(S.c3pts.eqAng - 180) <= 1e-9 && Math.abs(S.c3pts.midAng - 135) <= 1e-9,
    c4: S.c4.err <= 1e-5 && S.c4.single === 0,
    view: S.view.d === 0 && S.view.dh === 0,
    thin: S.thin.rel <= 1e-6,
    same338: S.same338.d === 0,
    rejects: S.rejects.every(Boolean),
  };
}
export { K338_VERSION, L337_VERSION, muOf, K338, shareSun };
