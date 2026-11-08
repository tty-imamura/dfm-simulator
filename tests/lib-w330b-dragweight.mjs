// 第330便b(原仮定者の整理(2026-11-08)「引きずり = Σ(相対速度 × 重み)/Σ重み(自分を含む)・重み = 質量/距離²・慣性移動 = 自分自身の引きずり」
//   「ジャイロ効果も DFM の範囲(慣性回転 = 自分自身の回転引きずり)」「渦巻銀河の 2 本の腕は密度波・棒は現状は解決案は無い」・統括の検証項目 R308):
//   **第132報の重みの式・連鎖の固定点・ジャイロ・密度波のラベルの純関数**(器 tests/exp-w330b-dragweight.mjs と QA lint.dragWeight330b・behavior.dragWeight330b が読む ——
//   html を読まない・状態を持たない・第309便a と第312便a の参照の lib〔tests/lib-w309a-invsq.mjs・tests/lib-w312a-decay.mjs〕は呼ぶだけ・エンジンの式を写さない)。
//
// ■ 何をするか(作業仮説の検査の道具 —— 新しい力・新しい則をエンジンへ足す操作ではない)
//   重みの式: d_i = Σ_{j≠i} w_ij (v_j − v_i)/W_i・W_i = w_ii + Σ_{j≠i} w_ij・U_i = v_i + d_i = α_i v_i + Σ_j β_ij v_j(α = w_ii/W・β = w_ij/W・α + Σβ = 1)。
//     **d_i は速度で、力・加速度ではない**(慣性の速度 v_i を毎回 0 へ戻さない —— 相対速度は自分基準)。点の重み w_ij = m_j/r_ij^p(p = 2 が第132報・p = 1 は今の K1 の遠方の重み)。
//     **自己の重み w_ii は m/0² にできない** —— 有限の dragCore の半径 R で宣言する(型: point = m/R^p・ballMean = 一様球の自己の二重体積平均〔p = 2 で 9m/(4R²)・p = 1 で 6m/(5R)〕・
//     ballHarmonic = 受け手の体積の比の平均で自己が分母を占めるときの実効の値 m/(R^p⟨1/K̂_p⟩)〔K̂_p は単位の球の自己の場・⟨⟩ は受け手の求積の規則〕)。
//     全源が同じ速度なら d = 0・一様の並進を足しても d は同じ(ガリレイ変換で不変)。**静止した中心**(絶対速度 0)は分子の相対の項 −w_ic v_i と分母の w_ic を残す
//     (「中心の並進引きずりを無視」= 中心の絶対速度の寄与を 0 —— 項を消さない)。
//   連鎖: 源の速度を源の全速度 U_j にすると U = αv + BU + c の固定点(c = 固定の源〔境界・中心〕の寄与と回転の項)。直接法 (I − B)⁻¹ と反復(I + B + B² + …)の両方で解き、
//     **一度だけ計上**する(解いた後にもう一度 d を足さない —— 否定対照で数える)。今のエンジンの並進の連立式 u_i − Σβ_ij u_j = Σβ_ij(v_j − v_i)(u = U − v)と同じ解かを残差で。
//     **連鎖の存在と平坦な回転は別**(3 点の固定境界・自己 1 の例で 10/23・7/23 —— 同じ速度にならない)。
//   円盤の連鎖の低 N の試し(diskChain): 軸対称の円盤を半径 R_k の環(方位 K 点 —— 点の質量 m_k/K)で表し、受け手(各環の φ = 0 の点)の接線の速度の固定点を解く
//     (源の接線の速度の受け手の接線への射影 cos φ —— 半径の向きの成分は対称で消える)。中心は有限の一様球(質量 M_c・半径 R_c・自転 Ω_c)で絶対速度 0 —— 回転の寄与は
//     **源の中の速度 Ω_c × ρ の重みつきの平均**(Ω_c M_c M_p(r; R_c) —— M_p は第309便a・第312便a の一様球の回転のモーメント)で、受け手の距離 r に Ω_c を掛けた速度を源の速度にしない。
//     境界(宣言)は背景に対して静止した外の環(速度 0 に固定)か無し。速度の形 U(R)・局所のべき d ln U/d ln R・分母 W の内訳(自己・中心・円盤・境界)を返す。**結果は宣言した型の表の値**。
//   ジャイロ(gyroResponse): dL/dt = N(実トルクはそのまま)・Ω_prec = L × N⊥/|L|²(Ω_prec × L = N⊥ —— 軸の回転は直交の向きに現れる)。**90° 回した別のトルクを足さない**。
//     L = 0 なら歳差は null。保存のジャイロ・歳差は熱に数えない。偏平な天体の軌道の平均のトルク(oblateTorqueAvg)と円錐の回転率(coneRate)・窓の角(windowAngle)。
//   密度波(densityWaveLabel・resonanceRadii): 2 本腕は宣言したパターン速度 Ω_p(一定)の密度波・共鳴の条件 m(Ω − Ω_p) = ±`κ_epi`(m = 2 —— 内側と外側の Lindblad 共鳴)・共回転 Ω = Ω_p。
//     **Ω_p = Ω − `κ_epi`/2 を全半径の規則にしない**(平坦な回転で 1/R に依る)・物質の Ω・パターンの Ω_p・DFM の Ω_field を分ける。棒は notClaim(第132報 —— 未解決)。
//
// ■ 言わないこと: 円盤の速度の形・連鎖・今の invSq の式との関係・歳差の窓は、宣言した型の表の値と対応表として書く(説明・提示・同定・判定の語を付けない)・
//   `κ_epi`(周転円の振動数)と κ_D を同じ量と書かない・棒の解を書かない・引きずり d を力と書かない。
import * as I from './lib-w309a-invsq.mjs';
import * as D from './lib-w312a-decay.mjs';

export const LIB_VERSION = 'w330b-dragweight-lib-1';
export const SELF_TYPES = Object.freeze(['point', 'ballMean', 'ballHarmonic']);
/** 宣言(走行の前に置く —— 結果を見て変えない) */
export const DECL = Object.freeze({
  /** 点の重みの距離の次数(2 = 第132報の m/r²・1 = 今の K1 の遠方の m/r) */
  pLaws: Object.freeze([2, 1]),
  /** 一様球の自己の二重体積平均の係数(p = 2: 9/4・p = 1: 6/5) */
  ballMeanC: Object.freeze({ 2: 9 / 4, 1: 6 / 5 }),
  /** ballHarmonic の受け手の求積の規則の次数(エンジンの invSq.order の既定と同じ値 8 —— 規則は第309便a の参照の lib) */
  harmonicOrder: 8,
  /** 連鎖の反復の止め(最大の変化 ≤ iterTol × max(1, |U|))と上限 */
  iterTol: 1e-15, iterMax: 200000,
  /** 平坦の判定の宣言(外側の局所のべきの絶対値 ≤ flatSlope) */
  flatSlope: 0.1,
  /** 密度波の腕の数(2 本腕) */
  armM: 2,
});

const isFin = (x) => typeof x === 'number' && Number.isFinite(x);
const isVec = (v) => Array.isArray(v) && v.length > 0 && v.every(isFin);
const vadd = (a, b) => a.map((x, k) => x + b[k]);
const vsub = (a, b) => a.map((x, k) => x - b[k]);
const vscl = (a, s) => a.map((x) => x * s);
const vzero = (d) => new Array(d).fill(0);
const vmaxAbs = (a) => a.reduce((m, x) => Math.max(m, Math.abs(x)), 0);
const chkP = (p) => { if (!DECL.pLaws.includes(p)) throw new RangeError('距離の次数 p は ' + DECL.pLaws.join('・') + ' だけ'); };

/* ───────── 重み ───────── */
/** 点の重み w = m/r^p(m ≥ 0・r > 0 —— r = 0 は拒否〔自己の重みは selfWeight で有限の宣言〕) */
export function pointWeight(m, r, p = 2) {
  chkP(p);
  if (!isFin(m) || m < 0 || !isFin(r) || !(r > 0)) throw new RangeError('pointWeight: m ≥ 0 の有限・r > 0 の有限(r = 0 の自己は selfWeight で)');
  const w = m / Math.pow(r, p);
  if (!isFin(w) || (m > 0 && !(w > 0))) throw new RangeError('pointWeight: 値域の外');
  return w;
}
/** 単位の球の自己の場の調和平均 H_p = ⟨1/K̂_p(t)⟩(受け手の求積の規則 —— 次数 order) */
export function harmonicSelf(p = 2, order = DECL.harmonicOrder) {
  chkP(p);
  let s = 0, wsum = 0;
  for (const q of I.receiverRule(order)) { s += q.w / D.Kball(p, q.t, 1); wsum += q.w; }
  return s / wsum;
}
/** 自己の重み(有限の dragCore の半径 R > 0 の宣言 —— 型 SELF_TYPES)。戻り値 { w, type, p, coef }(w = coef m/R^p) */
export function selfWeight({ type, m, R, p = 2, order = DECL.harmonicOrder }) {
  chkP(p);
  if (!SELF_TYPES.includes(type)) throw new RangeError('selfWeight: 型は ' + SELF_TYPES.join('・'));
  if (!isFin(m) || !(m > 0) || !isFin(R) || !(R > 0)) throw new RangeError('selfWeight: m > 0・R > 0 の有限(自己の重みは m/0^p にできない —— 有限の半径で宣言)');
  const coef = type === 'point' ? 1 : type === 'ballMean' ? DECL.ballMeanC[p] : 1 / harmonicSelf(p, order);
  const w = coef * m / Math.pow(R, p);
  if (!isFin(w) || !(w > 0)) throw new RangeError('selfWeight: 値域の外');
  return { w, type, p, coef };
}
/** K1 の規則の引きずりの半径 R_d = Y_k m(Y_k = 10G/(C₁c²) —— SI の G・c) */
export function kappaMRadius(mKg, G = 6.674e-11, c = 299792458) {
  if (!isFin(mKg) || !(mKg > 0)) throw new RangeError('kappaMRadius: m > 0');
  return 10 * G / (D.C1_CLOSED * c * c) * mKg;
}

/**
 * 第132報の重みの式(1 受け手)。v = 受け手の慣性の速度(成分の配列)・selfW = 自己の重み(> 0)・sources = [{ weight ≥ 0, velocity }]。
 * 戻り値: W・alpha(自己の分)・beta[j]・d(相対の重み付き平均 —— 速度)・U = v + d・selfPart = αv・absMean = Σβ_j v_j・residual = |U − (αv + Σβ v)|
 */
export function weightedMotion(v, selfW, sources) {
  if (!isVec(v) || !isFin(selfW) || !(selfW > 0) || !Array.isArray(sources)
    || sources.some((s) => !s || !isVec(s.velocity) || s.velocity.length !== v.length || !isFin(s.weight) || s.weight < 0)) throw new RangeError('weightedMotion: 有限の速度・非負の重み・正の自己の重み');
  const W = selfW + sources.reduce((a, s) => a + s.weight, 0);
  if (!isFin(W)) throw new RangeError('weightedMotion: 重みの和が値域の外');
  const beta = sources.map((s) => s.weight / W), alpha = selfW / W;
  const d = sources.reduce((a, s, j) => vadd(a, vscl(vsub(s.velocity, v), beta[j])), vzero(v.length));
  const absMean = sources.reduce((a, s, j) => vadd(a, vscl(s.velocity, beta[j])), vzero(v.length));
  const U = vadd(v, d), selfPart = vscl(v, alpha);
  return { W, alpha, beta, d, U, selfPart, absMean, residual: vmaxAbs(vsub(U, vadd(selfPart, absMean))) };
}

/* ───────── 連鎖の固定点 ───────── */
function gaussSolve(M, R) {
  const n = M.length, A = M.map((r) => r.slice()), X = R.map((r) => r.slice());
  for (let k = 0; k < n; k++) {
    let piv = k; for (let i = k + 1; i < n; i++) if (Math.abs(A[i][k]) > Math.abs(A[piv][k])) piv = i;
    if (!(Math.abs(A[piv][k]) > 0)) throw new RangeError('連鎖の行列が特異');
    if (piv !== k) { [A[k], A[piv]] = [A[piv], A[k]]; [X[k], X[piv]] = [X[piv], X[k]]; }
    for (let i = k + 1; i < n; i++) { const f = A[i][k] / A[k][k]; if (f === 0) continue; for (let j = k; j < n; j++) A[i][j] -= f * A[k][j]; X[i] = vsub(X[i], vscl(X[k], f)); }
  }
  for (let i = n - 1; i >= 0; i--) { let x = X[i]; for (let j = i + 1; j < n; j++) x = vsub(x, vscl(X[j], A[i][j])); X[i] = vscl(x, 1 / A[i][i]); }
  return X;
}
/**
 * U = αv + BU + c を解く(B の行和 < 1 —— 自己の分 α > 0 の行)。alpha[i]・v[i](成分の配列)・B[i][j](自由な節点どうし —— 対角 0)・c[i](固定の源と回転の項)。
 * 直接法((I − B)⁻¹)と反復(U₀ = αv + c・U_{k+1} = U₀ + B U_k —— I + B + B² + … の部分和)。今のエンジンの型 u − Bu = Bv − (1 − α)v + c(u = U − v)の残差と、
 * 解いた後にもう一度足した値(否定対照 —— U′ = αU + BU + c)との差も返す。
 */
export function solveChain({ alpha, v, B, c }) {
  const n = alpha.length;
  if (!(n > 0) || v.length !== n || B.length !== n || c.length !== n) throw new RangeError('solveChain: 長さ');
  const dim = v[0].length;
  for (let i = 0; i < n; i++) {
    if (!isFin(alpha[i]) || !(alpha[i] > 0) || !isVec(v[i]) || v[i].length !== dim || !isVec(c[i]) || c[i].length !== dim || !Array.isArray(B[i]) || B[i].length !== n) throw new RangeError('solveChain: 行 ' + i);
    let rs = 0; for (let j = 0; j < n; j++) { if (!isFin(B[i][j]) || (i === j && B[i][j] !== 0)) throw new RangeError('solveChain: B の値'); rs += Math.abs(B[i][j]); }
    if (!(alpha[i] + rs <= 1 + 1e-12)) throw new RangeError('solveChain: |B| の行和 + α ≤ 1 でない(行 ' + i + ')');
  }
  const U0 = v.map((x, i) => vadd(vscl(x, alpha[i]), c[i]));
  const M = B.map((r, i) => r.map((x, j) => (i === j ? 1 : -x)));
  const direct = gaussSolve(M, U0);
  let U = U0.map((x) => x.slice()), iters = 0, last = Infinity, prev = null, rho = null;
  for (; iters < DECL.iterMax; iters++) {
    const N = U0.map((x, i) => { let s = x.slice(); for (let j = 0; j < n; j++) if (B[i][j] !== 0) s = vadd(s, vscl(U[j], B[i][j])); return s; });
    const ch = Math.max(...N.map((x, i) => vmaxAbs(vsub(x, U[i]))));
    const sc = Math.max(1, ...N.map(vmaxAbs));
    if (prev !== null && prev > 0) rho = ch / prev;
    prev = ch; U = N;
    if (ch <= DECL.iterTol * sc) { iters++; last = ch; break; }
    last = ch;
  }
  const maxDiff = Math.max(...direct.map((x, i) => vmaxAbs(vsub(x, U[i]))));
  const scale0 = Math.max(1e-300, ...direct.map(vmaxAbs));
  // 今のエンジンの型(u = U − v): u_i − Σ_j B_ij u_j = Σ_j B_ij v_j − (1 − α_i) v_i + c_i
  let engRes = 0;
  for (let i = 0; i < n; i++) {
    const ui = vsub(direct[i], v[i]);
    let lhs = ui.slice(), rhs = vadd(vscl(v[i], -(1 - alpha[i])), c[i]);
    for (let j = 0; j < n; j++) if (B[i][j] !== 0) { lhs = vsub(lhs, vscl(vsub(direct[j], v[j]), B[i][j])); rhs = vadd(rhs, vscl(v[j], B[i][j])); }
    engRes = Math.max(engRes, vmaxAbs(vsub(lhs, rhs)));
  }
  // 否定対照: 解いた後にもう一度足す(U′ = αU + BU + c —— U を慣性の速度として扱う二重計上)
  let dbl = 0;
  for (let i = 0; i < n; i++) { let s = vadd(vscl(direct[i], alpha[i]), c[i]); for (let j = 0; j < n; j++) if (B[i][j] !== 0) s = vadd(s, vscl(direct[j], B[i][j])); dbl = Math.max(dbl, vmaxAbs(vsub(s, direct[i]))); }
  return { direct, iter: U, iters, converged: last <= DECL.iterTol * Math.max(1, ...U.map(vmaxAbs)), rhoEst: rho, maxDiffRel: maxDiff / scale0, engineFormResidualRel: engRes / scale0, doubleCountRel: dbl / scale0 };
}
/**
 * 重みの行列から連鎖を作って解く。selfW[i] > 0・w[i][j] ≥ 0(i の受け手が j を源に持つ重み —— 対角は使わない)・v[i]・fixed = { 添字: 速度 }(境界・中心 —— 解かない節点)・
 * extra[i](分子に足す項 —— 回転の寄与の重み付きの和〔W で割る前〕・省略は 0)。戻り値は solveChain の結果 + 自由な節点の添字・α・行ごとの W
 */
export function chainFromWeights({ selfW, w, v, fixed = {}, extra = null }) {
  const n = selfW.length, dim = v[0].length, fx = new Set(Object.keys(fixed).map(Number));
  const free = [...Array(n).keys()].filter((i) => !fx.has(i)), pos = new Map(free.map((i, k) => [i, k]));
  const alpha = [], B = [], c = [], vv = [], Wrow = [];
  for (const i of free) {
    let W = selfW[i]; for (let j = 0; j < n; j++) if (j !== i) W += w[i][j];
    Wrow.push(W); alpha.push(selfW[i] / W); vv.push(v[i]);
    const row = new Array(free.length).fill(0); let ci = extra ? vscl(extra[i], 1 / W) : vzero(dim);
    for (let j = 0; j < n; j++) { if (j === i || !(w[i][j] > 0)) continue; if (fx.has(j)) ci = vadd(ci, vscl(fixed[j], w[i][j] / W)); else row[pos.get(j)] = w[i][j] / W; }
    B.push(row); c.push(ci);
  }
  return Object.assign(solveChain({ alpha, v: vv, B, c }), { free, alpha, W: Wrow });
}

/* ───────── 円盤の連鎖の低 N の試し ───────── */
/**
 * decl = { rings:[{ R [m], m [kg] }](R の昇順)・K(方位の点の数)・p(2|1)・self:{ type, Rs:[m —— 環ごとの点の自己の半径] }・center:{ M [kg], Rc [m], Omega [rad/s] }・
 *   v:[m/s —— 環ごとの慣性の接線の速度]・boundary: null | { R [m], m [kg], K }(背景に対して静止 —— 速度 0 に固定)}
 * 戻り値: rows(環ごとの R・U・α・β_center・Σβ_disk・Σ_l B_kl・回転の項・W の内訳)・solve(直接法と反復の差・エンジンの型の残差・二重計上の否定対照)・
 *   noChain(B = 0 の値 —— 連鎖を入れない列)・naiveCenter(受け手の距離 r に Ω_c を掛けた速度を中心の速度にした否定対照の比)
 */
export function diskChain(decl) {
  const { rings, K, p, self, center, v, boundary = null } = decl;
  chkP(p);
  if (!(Array.isArray(rings) && rings.length >= 2 && rings.every((r, k) => isFin(r.R) && r.R > 0 && isFin(r.m) && r.m > 0 && (k === 0 || r.R > rings[k - 1].R)))) throw new RangeError('diskChain: 環は R の昇順・正の質量');
  if (!(Number.isInteger(K) && K >= 4)) throw new RangeError('diskChain: K は 4 以上の整数');
  if (!(self && SELF_TYPES.includes(self.type) && Array.isArray(self.Rs) && self.Rs.length === rings.length && self.Rs.every((x) => isFin(x) && x > 0))) throw new RangeError('diskChain: self の宣言');
  if (!(center && isFin(center.M) && center.M > 0 && isFin(center.Rc) && center.Rc > 0 && isFin(center.Omega))) throw new RangeError('diskChain: 中心の宣言');
  if (!(Array.isArray(v) && v.length === rings.length && v.every(isFin))) throw new RangeError('diskChain: v は環ごとの有限の数');
  if (boundary !== null && !(isFin(boundary.R) && boundary.R > rings[rings.length - 1].R && isFin(boundary.m) && boundary.m > 0 && Number.isInteger(boundary.K) && boundary.K >= 4)) throw new RangeError('diskChain: 境界の宣言');
  const nR = rings.length, phi = (q, KK) => 2 * Math.PI * q / KK;
  // 重なりの判定(点の自己の球が近い点・中心の球と重ならない)
  for (let k = 0; k < nR; k++) {
    const Rs = self.Rs[k];
    if (!(2 * rings[k].R * Math.sin(Math.PI / K) > 2 * Rs) || (k < nR - 1 && !(rings[k + 1].R - rings[k].R > Rs + self.Rs[k + 1]))) throw new RangeError('diskChain: 環 ' + k + ' の自己の球が近い点と重なる(接する距離も重なりに数える —— エンジンの invSqOverlap と同じ向き)');
    if (!(rings[k].R - center.Rc > Rs)) throw new RangeError('diskChain: 環 ' + k + ' の自己の球が中心の球と重なる');
  }
  const rows = [], alpha = [], B = [], c = [], vv = [];
  for (let k = 0; k < nR; k++) {
    const Rk = rings[k].R, mk = rings[k].m / K, sw = selfWeight({ type: self.type, m: mk, R: self.Rs[k], p }).w;
    let Wd = 0, Wb = 0; const row = new Array(nR).fill(0);
    for (let l = 0; l < nR; l++) {
      const ml = rings[l].m / K, Rl = rings[l].R;
      for (let q = 0; q < K; q++) {
        if (l === k && q === 0) continue;
        const f = phi(q, K), dx = Rl * Math.cos(f) - Rk, dy = Rl * Math.sin(f), r = Math.hypot(dx, dy), wq = pointWeight(ml, r, p);
        Wd += wq; row[l] += wq * Math.cos(f);
      }
    }
    if (boundary) for (let q = 0; q < boundary.K; q++) { const f = phi(q, boundary.K) + Math.PI / boundary.K, r = Math.hypot(boundary.R * Math.cos(f) - Rk, boundary.R * Math.sin(f)); Wb += pointWeight(boundary.m / boundary.K, r, p); }
    const wc = center.M * D.Kball(p, Rk, center.Rc), rotNum = center.Omega * center.M * D.Mball(p, Rk, center.Rc);
    const W = sw + Wd + Wb + wc;
    alpha.push(sw / W); vv.push([v[k]]); B.push(row.map((x) => x / W)); c.push([rotNum / W]);
    rows.push({ R: Rk, W, shares: { self: sw / W, center: wc / W, disk: Wd / W, boundary: Wb / W }, rowSumB: row.reduce((a, x) => a + x, 0) / W, rot: rotNum / W,
      naiveCenterRatio: (center.Omega * Rk * wc / W) / (rotNum / W) });
  }
  // 自由な環どうしの B の対角は自分の環の他の点(同じ節点の速度)—— 解く行列では対角を外に出す: U_k (1 − B_kk) = αv + Σ_{l≠k} B_kl U_l + c
  const Bf = B.map((r, k) => r.map((x, l) => (l === k ? 0 : x / (1 - B[k][k]))));
  const af = alpha.map((a, k) => a / (1 - B[k][k])), cf = c.map((x, k) => [x[0] / (1 - B[k][k])]);
  const S = solveChain({ alpha: af, v: vv, B: Bf, c: cf });
  const U = S.direct.map((x) => x[0]);
  const noChain = rows.map((r, k) => alpha[k] * v[k] + c[k][0]);
  rows.forEach((r, k) => { r.U = U[k]; r.noChain = noChain[k]; r.Bself = B[k][k]; });
  return { rows, U, noChain, solve: { iters: S.iters, converged: S.converged, rhoEst: S.rhoEst, maxDiffRel: S.maxDiffRel, engineFormResidualRel: S.engineFormResidualRel, doubleCountRel: S.doubleCountRel } };
}
/** 局所のべき d ln U/d ln R(中心差分 —— 端は片側)と外側のべき(R ≥ Rmin の最小二乗)。U ≤ 0 の行は null */
export function slopes(R, U, Rmin) {
  const ok = U.every((x) => x > 0), lnR = R.map(Math.log), lnU = U.map((x) => (x > 0 ? Math.log(x) : null));
  const local = R.map((_, k) => { const a = Math.max(0, k - 1), b = Math.min(R.length - 1, k + 1); return lnU[a] === null || lnU[b] === null ? null : (lnU[b] - lnU[a]) / (lnR[b] - lnR[a]); });
  const idx = R.map((x, k) => k).filter((k) => R[k] >= Rmin && lnU[k] !== null);
  let outer = null;
  if (idx.length >= 2) { const mx = idx.reduce((s, k) => s + lnR[k], 0) / idx.length, my = idx.reduce((s, k) => s + lnU[k], 0) / idx.length; let sxy = 0, sxx = 0; for (const k of idx) { sxy += (lnR[k] - mx) * (lnU[k] - my); sxx += (lnR[k] - mx) ** 2; } outer = sxy / sxx; }
  return { allPositive: ok, local, outer, flat: outer === null ? null : Math.abs(outer) <= DECL.flatSlope };
}

/* ───────── ジャイロ ───────── */
const v3 = (a) => Array.isArray(a) && a.length === 3 && a.every(isFin);
/** dL/dt = N(実トルクはそのまま)・Ω_prec = L × N/|L|²(= L × N⊥/|L|²)・N⊥・N∥。L = 0 なら precession は null。90° 回した別のトルクは足さない */
export function gyroResponse(L, N) {
  if (!v3(L) || !v3(N)) throw new RangeError('gyroResponse: 有限の 3 成分');
  const L2 = I.dot(L, L);
  if (!isFin(L2)) throw new RangeError('gyroResponse: 角運動量の値域の外');
  if (!(L2 > 0)) return { dL: N.slice(), precession: null, perpendicularTorque: null, parallelTorque: null, why: 'L = 0(軸が無い —— 歳差は決まらない)' };
  const par = I.scale(L, I.dot(L, N) / L2), perp = I.sub(N, par);
  return { dL: N.slice(), precession: I.scale(I.cross(L, N), 1 / L2), perpendicularTorque: perp, parallelTorque: par, why: null };
}
/** 偏平な天体(C − A)が軌道(法線 n̂・長半径 a・離心率 e・GM)の平均で受けるトルク N = 3GM(C − A)/(2a³(1 − e²)^{3/2}) (ŝ·n̂)(ŝ × n̂) */
export function oblateTorqueAvg({ GM, a, e = 0, CminusA, s, n }) {
  if (![GM, a, e, CminusA].every(isFin) || !(GM > 0 && a > 0 && e >= 0 && e < 1) || !v3(s) || !v3(n)) throw new RangeError('oblateTorqueAvg: 定義域');
  const su = I.unit(s), nu = I.unit(n), k = 3 * GM * CminusA / (2 * a * a * a * Math.pow(1 - e * e, 1.5));
  return I.scale(I.cross(su, nu), k * I.dot(su, nu));
}
/** 円錐の回転率(軸 ŝ が n̂ の回りを回る角速度 Ω_n —— dŝ/dt = Ω_prec × ŝ を n̂ × ŝ へ射影)。n̂ ∥ ŝ なら null */
export function coneRate(L, N, n) {
  const g = gyroResponse(L, N);
  if (g.precession === null) return null;
  const s = I.unit(L), nu = I.unit(n), t = I.cross(nu, s), t2 = I.dot(t, t);
  if (!(t2 > 1e-30)) return null;
  return I.dot(I.cross(g.precession, s), t) / t2;
}
/** 窓の角 |Ω| T [rad] */
export function windowAngle(rate, T) { if (!isFin(rate) || !isFin(T) || T < 0) throw new RangeError('windowAngle: 定義域'); return Math.abs(rate) * T; }

/* ───────── 密度波のラベルと共鳴の半径 ───────── */
/** 2 本腕の密度波のラベル(一定の Ω_p [km s⁻¹ kpc⁻¹] と出典が要る —— 関数や「Ω − κ_epi/2」の規則は拒否)。棒は notClaim */
export function densityWaveLabel(decl) {
  if (!(decl && typeof decl === 'object')) throw new RangeError('densityWaveLabel: 宣言は object');
  for (const k of Object.keys(decl)) if (!['m', 'OmegaP', 'source'].includes(k)) throw new RangeError('densityWaveLabel: 知らない鍵 ' + k);
  if (decl.m !== DECL.armM) throw new RangeError('densityWaveLabel: m = 2(2 本腕)だけ');
  if (!(isFin(decl.OmegaP) && decl.OmegaP > 0)) throw new RangeError('densityWaveLabel: Ω_p は一定の正の数(全半径の規則 Ω − κ_epi/2 や関数は受けない)');
  if (!(typeof decl.source === 'string' && decl.source)) throw new RangeError('densityWaveLabel: 出典が要る');
  return { mode: 'densityWave', m: decl.m, OmegaP: decl.OmegaP, unit: 'km s⁻¹ kpc⁻¹', source: decl.source,
    separate: { matter: '物質の Ω(R)(回転の速さの表から —— 半径に依る)', pattern: 'パターンの Ω_p(一定の宣言)', field: 'DFM の Ω_field(場の契約の宣言 —— 物質ともパターンとも別)' },
    resonance: 'm(Ω − Ω_p) = ±κ_epi(ILR: Ω − κ_epi/2 = Ω_p・OLR: Ω + κ_epi/2 = Ω_p)・共回転 Ω = Ω_p',
    bar: { status: 'notClaim', note: '棒渦巻の棒は未解決(原仮定者の整理(2026-11-08))—— 完成条件から外す' } };
}
/** f(R) = Ω_p の交点(連続する有効な行の線形の補間 —— 複数ありうる) */
function crossings(R, f, target) {
  const out = [];
  for (let k = 0; k + 1 < R.length; k++) {
    const a = f[k], b = f[k + 1];
    if (a === null || b === null) continue;
    const da = a - target, db = b - target;
    if (da === 0) { if (!out.length || out[out.length - 1] !== R[k]) out.push(R[k]); continue; }
    if (da * db < 0) out.push(R[k] + (target - a) * (R[k + 1] - R[k]) / (b - a));
  }
  if (f[R.length - 1] !== null && f[R.length - 1] - target === 0) out.push(R[R.length - 1]);
  return out;
}
/**
 * 共鳴の半径。rows = 第329便b の labelsTable の行(labels: { Omega, kappaEpi, OmMinusHalfK, OmPlusHalfK, sigma }・R [kpc] —— km s⁻¹ kpc⁻¹)・Ω_p [km s⁻¹ kpc⁻¹]。
 * 戻り値: ILR・CR・OLR の交点の半径の列(f と f ± σ の 3 本)と表の範囲。交点が無ければ空の列(表の範囲の外 —— 0 で埋めない)
 */
export function resonanceRadii(rows, OmegaP) {
  if (!(isFin(OmegaP) && OmegaP > 0) || !Array.isArray(rows)) throw new RangeError('resonanceRadii: 定義域');
  const ok = rows.filter((q) => q.labels && q.labels.kappaEpi !== null), R = ok.map((q) => q.R);
  const col = (g) => ok.map((q) => g(q.labels));
  const sg = (k) => (L) => (L.sigma && L.sigma[k] !== null ? L.sigma[k] : null);
  const three = (val, sig) => {
    const f = col(val), s = col(sig);
    return { at: crossings(R, f, OmegaP), plusSigma: crossings(R, f.map((x, k) => (s[k] === null ? null : x + s[k])), OmegaP), minusSigma: crossings(R, f.map((x, k) => (s[k] === null ? null : x - s[k])), OmegaP) };
  };
  return { OmegaP, rangeKpc: [R[0], R[R.length - 1]], n: R.length,
    ILR: three((L) => L.OmMinusHalfK, sg('OmMinusHalfK')), CR: three((L) => L.Omega, sg('Omega')), OLR: three((L) => L.OmPlusHalfK, sg('OmPlusHalfK')) };
}

/* ───────── 純関数の場面と門 ───────── */
export function pureScenes() {
  const S = {};
  // ① ガリレイ変換で不変・α + Σβ = 1・U = αv + Σβv
  { const v = [2, -1, 3], b = [7, -4, 1], src = [{ weight: 2, velocity: [0, 0, 0] }, { weight: 3, velocity: [4, 2, -1] }];
    const a = weightedMotion(v, 5, src), c = weightedMotion(vadd(v, b), 5, src.map((s) => ({ ...s, velocity: vadd(s.velocity, b) })));
    S.galilean = { dDiff: vmaxAbs(vsub(c.d, a.d)), Ushift: vmaxAbs(vsub(c.U, vadd(a.U, b))), sum1: a.alpha + a.beta.reduce((s, x) => s + x, 0), residual: a.residual }; }
  // ② 共動(全源が同じ速度)なら d = 0・自己だけなら U = v(慣性を保つ)
  { const v = [2, -1, 3]; S.comove = { d: vmaxAbs(weightedMotion(v, 1, [{ weight: 3, velocity: v }, { weight: 0.5, velocity: v }]).d), selfOnly: vmaxAbs(vsub(weightedMotion(v, 1, []).U, v)) }; }
  // ③ 静止した中心(v = (2, 0, 0)・自己 1・中心 1 —— 絶対速度 0): 相対 (−1, 0, 0)・自己を含む絶対の重み付き平均 U = (1, 0, 0)・分母 2・中心の絶対速度の分子の寄与 Σβv = 0(項は消さない)
  { const q = weightedMotion([2, 0, 0], 1, [{ weight: 1, velocity: [0, 0, 0] }]); S.staticCenter = { d: q.d, U: q.U, W: q.W, absMean: q.absMean }; }
  // ④ 3 点の固定境界(自己 1 —— 1: 境界 1・2 へ 1 / 2: 境界 0.25・1 へ 1 —— 境界の速度 1・慣性の速度 0)の連鎖の固定点 10/23・7/23(直接法と反復)
  { const r = chainFromWeights({ selfW: [1, 1, 1], w: [[0, 1, 1], [1, 0, 0.25], [0, 0, 0]], v: [[0], [0], [1]], fixed: { 2: [1] } });
    S.threePoint = { u1: r.direct[0][0], u2: r.direct[1][0], iter1: r.iter[0][0], iter2: r.iter[1][0], maxDiffRel: r.maxDiffRel, engineRes: r.engineFormResidualRel, dbl: r.doubleCountRel, iters: r.iters }; }
  // ⑤ 拒否(r = 0 の点の重み・負の重み・自己 0・知らない型・p = 3・行和 ≥ 1)
  { const rej = [() => pointWeight(1, 0), () => pointWeight(-1, 1), () => pointWeight(1, 1, 3), () => weightedMotion([1, 0, 0], 0, []), () => weightedMotion([1, 0, 0], 1, [{ weight: -1, velocity: [0, 0, 0] }]),
      () => selfWeight({ type: 'mOverZero', m: 1, R: 1 }), () => selfWeight({ type: 'point', m: 1, R: 0 }), () => solveChain({ alpha: [0.5], v: [[0]], B: [[0.6]], c: [[0]] }),
      () => solveChain({ alpha: [0.2, 0.2], v: [[0], [0]], B: [[0, 0.9], [0.1, 0]], c: [[0], [0]] })];
    S.reject = rej.map((f) => { try { f(); return false; } catch (e) { return e instanceof RangeError; } }); }
  // ⑥ 自己の重みの型(p = 2: point 1・ballMean 9/4・ballHarmonic 1/H₂ —— H₂ は単位の球の自己の場の調和平均)と p = 1(6/5)
  { S.selfTypes = { p2: SELF_TYPES.map((t) => selfWeight({ type: t, m: 1, R: 1, p: 2 }).coef), p1: SELF_TYPES.map((t) => selfWeight({ type: t, m: 1, R: 1, p: 1 }).coef), H2: harmonicSelf(2), H1: harmonicSelf(1) }; }
  // ⑦ ジャイロ: L = (0, 0, 2)・N = (1, 0, 0) → Ω_prec = (0, 0.5, 0)・Ω_prec × L = N⊥・dL = N(実トルクのまま)・L = 0 は null・平行なトルクは歳差 0
  { const g = gyroResponse([0, 0, 2], [1, 0, 0]), z = gyroResponse([0, 0, 0], [1, 0, 0]), par = gyroResponse([0, 0, 2], [0, 0, 3]);
    S.gyro = { prec: g.precession, check: vmaxAbs(vsub(I.cross(g.precession, [0, 0, 2]), g.perpendicularTorque)), dL: g.dL, zeroL: z.precession, parPrec: vmaxAbs(par.precession), parDL: par.dL,
      rot90: vmaxAbs(vsub(g.dL, [0, 1, 0])) }; }
  // ⑧ 偏平な天体の軌道の平均のトルクの向き(赤道を軌道面へ寄せる)と円錐の回転率の符号(逆行)
  { const eps = 0.4, s = [Math.sin(eps), 0, Math.cos(eps)], n = [0, 0, 1], N = oblateTorqueAvg({ GM: 1, a: 1, CminusA: 0.01, s, n }), L = I.scale(s, 2), cr = coneRate(L, N, n);
    S.oblate = { N, coneRate: cr, expected: -1.5 * 0.01 * Math.cos(eps) / 2, alongN: I.dot(N, s) }; }
  // ⑨ 平坦な回転の表(v = v0)の共鳴の半径の解析の値: R_CR = v0/Ω_p・R_ILR = (1 − 1/√2)v0/Ω_p・R_OLR = (1 + 1/√2)v0/Ω_p
  { const v0 = 150, Rs = Array.from({ length: 200 }, (_, k) => 0.5 + 0.25 * k), rows = Rs.map((R) => { const Om = v0 / R, k = Math.SQRT2 * Om; return { R, labels: { Omega: Om, kappaEpi: k, OmMinusHalfK: Om - k / 2, OmPlusHalfK: Om + k / 2, sigma: null } }; });
    const rr = resonanceRadii(rows, 10); S.flatRes = { CR: rr.CR.at, ILR: rr.ILR.at, OLR: rr.OLR.at, want: [v0 / 10, (1 - 1 / Math.SQRT2) * v0 / 10, (1 + 1 / Math.SQRT2) * v0 / 10] }; }
  // ⑩ 密度波のラベル(一定の Ω_p と出典が要る —— 全半径の規則は拒否)・棒は notClaim
  { const ok = densityWaveLabel({ m: 2, OmegaP: 10, source: 't' }), rej = [{ m: 2, OmegaP: 'Omega-kappaEpi/2', source: 't' }, { m: 2, OmegaP: (R) => R, source: 't' }, { m: 3, OmegaP: 10, source: 't' }, { m: 2, OmegaP: 10 }, { m: 2, OmegaP: 10, source: 't', bar: 1 }];
    S.dwLabel = { mode: ok.mode, bar: ok.bar.status, sep: Object.keys(ok.separate), reject: rej.map((d) => { try { densityWaveLabel(d); return false; } catch (e) { return e instanceof RangeError; } }) }; }
  // ⑪ 小さな円盤の連鎖(中心だけが回る —— 慣性の速度 0): 連鎖の値は B = 0 の値より大きい(外へ運ぶ)・直接法と反復の差・エンジンの型の残差・二重計上は外れる・
  //    中心の速度を受け手の距離 × Ω_c にした否定対照は回転のモーメントの値より大きい
  { const rings = [1, 2, 3, 4, 5, 6].map((R) => ({ R, m: 1 })), d = diskChain({ rings, K: 12, p: 2, self: { type: 'ballMean', Rs: rings.map(() => 0.2) }, center: { M: 3, Rc: 0.5, Omega: 1 }, v: rings.map(() => 0) });
    S.miniDisk = { U: d.U, noChain: d.noChain, solve: d.solve, naive: d.rows.map((r) => r.naiveCenterRatio), sl: slopes(rings.map((r) => r.R), d.U, 3) }; }
  return S;
}
export function pureGates(S) {
  const close = (a, b, t = 1e-12) => Math.abs(a - b) <= t * Math.max(Math.abs(a), Math.abs(b), 1e-300);
  return {
    galileanInvariant: S.galilean.dDiff <= 1e-12 && S.galilean.Ushift <= 1e-12 && close(S.galilean.sum1, 1) && S.galilean.residual <= 1e-12,
    comoveAndSelfOnly: S.comove.d === 0 && S.comove.selfOnly === 0,
    staticCenterKeepsTerm: close(S.staticCenter.d[0], -1) && S.staticCenter.d[1] === 0 && close(S.staticCenter.U[0], 1) && S.staticCenter.W === 2 && S.staticCenter.absMean[0] === 0,
    threePointChain: close(S.threePoint.u1, 10 / 23) && close(S.threePoint.u2, 7 / 23) && S.threePoint.maxDiffRel <= 1e-13 && S.threePoint.engineRes <= 1e-13 && S.threePoint.dbl > 1e-3 && Math.abs(S.threePoint.u1 - S.threePoint.u2) > 0.1,
    rejectInputs: S.reject.every((x) => x === true),
    selfTypes: S.selfTypes.p2[0] === 1 && close(S.selfTypes.p2[1], 2.25) && close(S.selfTypes.p2[2], 1 / S.selfTypes.H2) && close(S.selfTypes.p1[1], 1.2) && S.selfTypes.H2 > 1 / 3 && S.selfTypes.H2 < 2 / 3 && S.selfTypes.H1 > 2 / 3 && S.selfTypes.H1 < 1,
    gyro: close(S.gyro.prec[1], 0.5) && S.gyro.prec[0] === 0 && S.gyro.prec[2] === 0 && S.gyro.check <= 1e-15 && S.gyro.dL.join() === '1,0,0' && S.gyro.zeroL === null && S.gyro.parPrec === 0 && S.gyro.parDL.join() === '0,0,3' && S.gyro.rot90 > 0.5,
    oblateRetrograde: S.oblate.coneRate < 0 && close(S.oblate.coneRate, S.oblate.expected, 1e-12) && Math.abs(S.oblate.alongN) <= 1e-15 && S.oblate.N[1] < 0,
    flatResonance: S.flatRes.CR.length === 1 && S.flatRes.ILR.length === 1 && S.flatRes.OLR.length === 1 && close(S.flatRes.CR[0], S.flatRes.want[0], 1e-3) && close(S.flatRes.ILR[0], S.flatRes.want[1], 1e-3) && close(S.flatRes.OLR[0], S.flatRes.want[2], 1e-3),
    densityWaveLabel: S.dwLabel.mode === 'densityWave' && S.dwLabel.bar === 'notClaim' && S.dwLabel.sep.join() === 'matter,pattern,field' && S.dwLabel.reject.every((x) => x === true),
    miniDiskChain: S.miniDisk.U.every((u, k) => u > S.miniDisk.noChain[k]) && S.miniDisk.solve.maxDiffRel <= 1e-12 && S.miniDisk.solve.engineFormResidualRel <= 1e-12 && S.miniDisk.solve.doubleCountRel > 1e-6
      && S.miniDisk.naive.every((x) => x > 1),
  };
}
