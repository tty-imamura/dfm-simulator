// 第309便a(原仮定者の裁定(第103報)「正確な引きずり(修正版)」・第104報 AN363・決断事項 AN359・AN363・統括の検証項目 R218):
// **新しい引きずり則(逆二乗の体積平均・トータルの分母・比の平均)の参照の純関数**(html を読まない・状態を持たない)。
//
// ■ 何をするか(器 tests/exp-w309a-invsq.mjs が使う)
//   ・源の一様球(半径 R)の逆二乗の体積平均 K2(r) = ⟨1/|d − ρ|²⟩ と回転の近遠差のモーメント M2(r) = ⟨(ρ·d̂)/|d − ρ|²⟩ と、それらの動径の微分。
//     閉じた式(内部・外部)と外部の級数を**この lib が自前に書き**、**源の球の直接の 3 次元の求積**(tests/lib-w307a-sphereaxial.mjs の sphereRule・ballRadial)と
//     比べる。自己の場(受け手の内部の点)は 3 次元の求積が特異なので、殻の角度の閉じた式 (1/(2rs)) ln|(r+s)/(r−s)| を動径で求積する(s = r の対数を変数変換で除く)。
//   ・受け手の体積の求積の規則(宣言の次数 n —— 動径 t = 1 − u²〔u は Gauss–Legendre n 点〕・μ は Gauss–Legendre n 点・方位 2n 等分)をエンジンと独立に組む。
//   ・参照の新則: 受け手 i の体積の各点 x で W(x) = W_bg′ + m_i K2(|x − x_i|; R_i) + Σ_{k≠i} m_k K2(|x − x_k|; R_k)(自己を含むトータル)、
//     β_ij = ⟨m_j K2_j/W⟩・回転の係数ベクトル ⟨(m_j M2_j/W) n̂_j⟩・軸 ω_i = A Σ_j ⟨amp_ij sinθ_j (2 n̂(n̂·Ω_j) − Ω_j)⟩(amp = −n̂·∇(m_j M2_j/W) ——
//     既定は lib の閉じた式の導関数〔求積の数値の微分で確かめたもの〕による連鎖・ampMode:'numeric' は g を動かした点で作り直す**数値の方向微分**(エンジンの解析の勾配と独立)。
//     比の平均 ⟨N/W⟩ と平均の比 ⟨N⟩/⟨W⟩ の両方を返す。
//   ・並進の連立 u_i = Σ_j β_ij (V_j − v_i) + Σ_j Ω_j × ⟨…⟩(V_j = v_j + u_j —— 今の solve の約束: 源は全速度・受け手は慣性速度)を直接法で解く。
//   ・dragCore の既定(AN363): R_d = min(R·10^L, 6.5×10⁶ m)/10^L(SI へ換算してからクランプし本の単位へ戻す —— クランプしない天体は R のまま)。
//
// ■ しないこと: html を読まない・エンジンの式を写さない(器がエンジンの inertialDragIsq* と比べる)。旧則(m/r³・λ ∝ m の相殺)はここに無い。
import { dot, cross, norm, add, sub, scale, unit, glNodes, sphereRule, ballRadial } from './lib-w307a-sphereaxial.mjs';
export { dot, cross, norm, add, sub, scale, unit, glNodes, sphereRule, ballRadial };
export const LIB_VERSION = 'w309a-invsq-lib-1';
export const CAP_M = 6.5e6;

const vec = (v) => Array.isArray(v) && v.length === 3 && v.every(Number.isFinite);
const pos = (x) => Number.isFinite(x) && x > 0;

/* ───────── dragCore の既定(AN363)───────── */
/** 本の長さの単位の半径 R と scaleExp.L から引きずりの半径(本の単位)。クランプしなければ R そのもの */
export function defaultCoreRadius(R, L, cap = CAP_M) {
  if (!pos(R) || !Number.isFinite(L)) throw new Error('defaultCoreRadius: 定義域');
  const Lm = Math.pow(10, L), RSI = R * Lm;
  return RSI > cap ? { Rd: cap / Lm, clamped: true, RSI, ratio2: (cap / RSI) ** 2 } : { Rd: R, clamped: false, RSI, ratio2: 1 };
}

/* ───────── 閉じた式(x = r/R・L = ln|(1+x)/(1−x)|)───────── */
const Lof = (x) => Math.log(Math.abs((1 + x) / (1 - x)));
/** K2(r; R): 内部 3/R²[1 − Σ x^{2k}/((2k−1)(2k+1))](級数)・それ以外は 1.5/R²[1 + (1−x²)L/(2x)]・外部の遠方は (1/r²) Σ 3 z^k/((2k+1)(2k+3)) */
export function K2(r, R) {
  if (!(r >= 0) || !pos(R)) throw new Error('K2: 定義域');
  const x = r / R;
  if (x === 0) return 3 / (R * R);
  if (x === 1) return 1.5 / (R * R);
  if (x < 0.3) { let s = 0, p = x * x; for (let k = 1; k < 60; k++) { const t = p / ((2 * k - 1) * (2 * k + 1)); s += t; if (t < 1e-18 * s) break; p *= x * x; } return 3 / (R * R) * (1 - s); }
  if (x >= 3) { const z = 1 / (x * x); let s = 0, p = 1; for (let k = 0; k < 80; k++) { const t = 3 * p / ((2 * k + 1) * (2 * k + 3)); s += t; if (t < 1e-18 * s) break; p *= z; } return s / (r * r); }
  return 1.5 / (R * R) * (1 + (1 - x * x) * Lof(x) / (2 * x));
}
/** dK2/dr(r ≠ R)。内部の小さい x と外部の遠方は級数 */
export function K2Dr(r, R) {
  if (!(r >= 0) || !pos(R) || r === R) throw new Error('K2Dr: 定義域');
  const x = r / R;
  if (x === 0) return 0;
  if (x < 0.3) { let s = 0, p = x; for (let k = 1; k < 60; k++) { const t = 2 * k * p / ((2 * k - 1) * (2 * k + 1)); s += t; if (Math.abs(t) < 1e-18 * Math.abs(s)) break; p *= x * x; } return -3 * s / (R * R * R); }
  if (x >= 3) { const z = 1 / (x * x); let s = 0, p = 1; for (let k = 0; k < 80; k++) { const t = 3 * (2 + 2 * k) * p / ((2 * k + 1) * (2 * k + 3)); s += t; if (t < 1e-18 * s) break; p *= z; } return -s / (r * r * r); }
  return (1.5 / x - 0.75 * (1 + x * x) * Lof(x) / (x * x)) / (R * R * R);
}
/** M2(r; R)(外部 r > R だけ): 閉じた式 (1/R)[−3/(8x) + 9x/8 + 3L(1+3x²)(1−x²)/(16x²)]・x ≥ 3 は (1/r) Σ_{k≥1} 6k z^k/((2k−1)(2k+1)(2k+3)) */
export function M2(r, R) {
  if (!pos(R) || !(r > R)) throw new Error('M2: 外部 r > R だけ');
  const x = r / R;
  if (x >= 3) { const z = 1 / (x * x); let s = 0, p = z; for (let k = 1; k < 80; k++) { const t = 6 * k * p / ((2 * k - 1) * (2 * k + 1) * (2 * k + 3)); s += t; if (t < 1e-18 * s) break; p *= z; } return s / r; }
  return (-3 / (8 * x) + 9 * x / 8 + 3 * Lof(x) * (1 + 3 * x * x) * (1 - x * x) / (16 * x * x)) / R;
}
/** dM2/dr(外部): (1/R²)[3/(4x²) + 9/4 − (3/8)L(1 + 3x⁴)/x³]・遠方は −(1/r²) Σ (2k+1)·6k z^k/((2k−1)(2k+1)(2k+3)) */
export function M2Dr(r, R) {
  if (!pos(R) || !(r > R)) throw new Error('M2Dr: 外部 r > R だけ');
  const x = r / R;
  if (x >= 3) { const z = 1 / (x * x); let s = 0, p = z; for (let k = 1; k < 80; k++) { const t = 6 * k * p / ((2 * k - 1) * (2 * k + 3)); s += t; if (t < 1e-18 * s) break; p *= z; } return -s / (r * r); }
  return (3 / (4 * x * x) + 9 / 4 - 0.375 * Lof(x) * (1 + 3 * x * x * x * x) / (x * x * x)) / (R * R);
}

/* ───────── 独立な求積 ───────── */
/** 源の球の直接の 3 次元の求積(外部の点 —— 動径 nR・球面 nS)。d は源の中心から点への向き(単位でなくてよい)。{K, M} */
export function sourceQuad(d, R, nR = 48, nS = 48) {
  if (!vec(d) || !pos(R) || !(norm(d) > R)) throw new Error('sourceQuad: 外部の点だけ');
  const dh = unit(d);
  let K = 0, M = 0;
  for (const a of ballRadial(nR)) for (const b of sphereRule(nS)) {
    const rho = scale(b.s, R * a.t), q = sub(d, rho), w = a.w * b.w, i2 = 1 / dot(q, q);
    K += w * i2; M += w * dot(rho, dh) * i2;
  }
  return { K, M };
}
/** 自己の場(内部の点 r < R)の K2: 殻の角度の閉じた式を動径で(s = r の両側を s = r ∓ h u² で変数変換 —— 対数の特異を除く) */
export function selfK2Quad(r, R, n = 64) {
  if (!(r > 0) || !(r < R)) throw new Error('selfK2Quad: 0 < r < R');
  const g = glNodes(n), shell = (s) => Math.log(Math.abs((r + s) / (r - s))) / (2 * r * s);
  let sum = 0;
  for (const [lo, hi, sgn] of [[0, r, -1], [r, R, 1]]) {
    const h = hi - lo;
    for (let k = 0; k < n; k++) {
      const u = 0.5 * (g.x[k] + 1), s = (sgn < 0) ? r - h * u * u : r + h * u * u, ds = 2 * h * u;
      sum += 0.5 * g.w[k] * 3 * s * s * shell(s) * ds;
    }
  }
  return sum / (R * R * R);
}
/** 数値の微分(中心差分 h と h/2 の Richardson) */
export function numDr(f, r, h) { const d = (q) => (f(r + q) - f(r - q)) / (2 * q); return (4 * d(h / 2) - d(h)) / 3; }

/* ───────── 受け手の体積の求積の規則(宣言の次数 n —— エンジンと独立に組む)───────── */
const RULES = new Map();
export function receiverRule(n) {
  if (RULES.has(n)) return RULES.get(n);
  const g = glNodes(n), out = [];
  for (let a = 0; a < n; a++) {
    const u = 0.5 * (g.x[a] + 1), t = 1 - u * u, wr = 0.5 * g.w[a] * 3 * t * t * 2 * u;
    for (let b = 0; b < n; b++) {
      const mu = g.x[b], st = Math.sqrt(Math.max(0, 1 - mu * mu)), wm = 0.5 * g.w[b];
      for (let c = 0; c < 2 * n; c++) {
        const ph = 2 * Math.PI * (c + 0.5) / (2 * n);
        out.push({ t, s: [st * Math.cos(ph), st * Math.sin(ph), mu], w: wr * wm / (2 * n) });
      }
    }
  }
  RULES.set(n, out);
  return out;
}
/** 一様球の自己の二重体積平均 ⟨K2(|ρ|; R)⟩(理論 9/(4R²))—— 規則 n で */
export function selfDoubleMean(R, n) { let s = 0; for (const q of receiverRule(n)) s += q.w * K2(q.t * R, R); return s; }

/* ───────── 参照の新則 ───────── */
/**
 * bodies = [{x:[3], m, Rd, md?(引きずりの質量 —— 省略は m), Om(符号つきの自転), a(単位の軸)}]・o = {Wbg2(新単位 —— 既定 0), order, gain(A), pairs?:Set('i,j')}
 * 受け手ごとに {beta[j], betaRatioOfMeans[j], rot[j](ベクトル ⟨(m M2/W) n̂⟩), omega(軸の角速度 —— 数値の微分), negFrac(amp<0 の重みの割合), Wcenter}
 */
export function pointTerms(bodies, i, x, o = {}) {
  const Wbg2 = o.Wbg2 || 0, me = bodies[i];
  if (!vec(x)) throw new Error('pointTerms: 定義域');
  const md = (b) => (b.md === undefined ? b.m : b.md);
  const Wof = (p) => { let w = Wbg2; for (const b of bodies) w += md(b) * K2(norm(sub(p, b.x)), b.Rd); return w; };
  const W = Wof(x), terms = [];
  // ∇W(lib の閉じた式の導関数 —— 自己の場を含む)
  let G = [0, 0, 0];
  for (const b of bodies) { const d = sub(x, b.x), r = norm(d); if (r > 0) G = add(G, scale(d, md(b) * K2Dr(r, b.Rd) / r)); }
  for (let j = 0; j < bodies.length; j++) {
    if (j === i) continue;
    if (o.pairs && !o.pairs.has(i + ',' + j)) continue;
    const b = bodies[j], d = sub(x, b.x), r = norm(d), n = scale(d, 1 / r);
    const K = K2(r, b.Rd), M = M2(r, b.Rd);
    const g = (t) => { const p = add(b.x, scale(n, t)); return md(b) * M2(t, b.Rd) / Wof(p); };
    const hR = 1e-3 * Math.min(me.Rd * (1 - norm(sub(x, me.x)) / me.Rd), r - b.Rd);
    const ampNum = -numDr(g, r, hR), ampAna = -(md(b) * M2Dr(r, b.Rd) / W - md(b) * M * dot(G, n) / (W * W));
    terms.push({ j, r, n, K, M, N: md(b) * K, beta: md(b) * K / W, rotC: md(b) * M / W, amp: o.ampMode === 'numeric' ? ampNum : ampAna, ampNum, ampAna });
  }
  return { W, terms };
}
export function refReceiver(bodies, i, o = {}) {
  const n = o.order || 8, gain = o.gain === undefined ? 1 : o.gain, me = bodies[i], J = bodies.length;
  const beta = new Array(J).fill(0), rot = Array.from({ length: J }, () => [0, 0, 0]), Nm = new Array(J).fill(0);
  let Wm = 0, omega = [0, 0, 0], neg = 0, tot = 0;
  for (const q of receiverRule(n)) {
    const x = add(me.x, scale(q.s, me.Rd * q.t)), P = pointTerms(bodies, i, x, o);
    Wm += q.w * P.W;
    for (const t of P.terms) {
      beta[t.j] += q.w * t.beta; Nm[t.j] += q.w * t.N; rot[t.j] = add(rot[t.j], scale(t.n, q.w * t.rotC));
      const b = bodies[t.j];
      if (b.Om && o.axial) {
        const sn = norm(cross(b.a, t.n)), mu = dot(t.n, b.a);
        omega = add(omega, scale(sub(scale(t.n, 2 * mu), b.a), q.w * gain * t.amp * sn * b.Om));
        tot += q.w; if (t.amp < 0) neg += q.w;
      }
    }
  }
  return { beta, betaRatioOfMeans: Nm.map((v) => v / Wm), rot, omega, negFrac: tot > 0 ? neg / tot : null, Wmean: Wm };
}
/** 並進の連立を直接法で(v は力学速度・u を返す)。R = refReceiver の結果の配列 */
export function solveMotion(bodies, R, v) {
  const J = bodies.length, A = [], s = [];
  for (let i = 0; i < J; i++) {
    let si = [0, 0, 0];
    for (let j = 0; j < J; j++) {
      if (j === i) continue;
      si = add(si, scale(sub(v[j], v[i]), R[i].beta[j]));
      const b = bodies[j];
      if (b.Om && R[i].rotOn !== false) si = add(si, cross(scale(b.a, b.Om), R[i].rot[j]));
    }
    s.push(si); A.push(R[i].beta.map((x, j) => (j === i ? 0 : x)));
  }
  // (I − B) u = s
  const M = A.map((row, i) => row.map((x, j) => (i === j ? 1 : -x))), U = s.map((x) => x.slice());
  for (let k = 0; k < J; k++) for (let i = k + 1; i < J; i++) { const f = M[i][k] / M[k][k]; for (let j = k; j < J; j++) M[i][j] -= f * M[k][j]; U[i] = sub(U[i], scale(U[k], f)); }
  for (let i = J - 1; i >= 0; i--) { let x = U[i]; for (let j = i + 1; j < J; j++) x = sub(x, scale(U[j], M[i][j])); U[i] = scale(x, 1 / M[i][i]); }
  return U;
}
