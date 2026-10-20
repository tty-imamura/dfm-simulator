// 第310便d(原仮定者の裁定(第109報)AN380「太陽の R_d は cap6500km で固定し、太陽の m_d の適正値を探索する。dragCore(R_d, m_d)と、
// 外殻(観測半径, 観測質量 − m_d)の引きずりを、それぞれ計算する」・決断事項 AN384〔外殻の形〕・AN385〔受け手の側〕・AN386〔m_d の値域〕・統括の検証項目 R225):
// **外殻の参照の純関数**(html を読まない・状態を持たない —— エンジンの外殻の源〔第310便a〕と独立に組む)と、太陽–水星の m_d の表の**近点への寄与の見積り**(摂動の平均)。
//
// ■ 何をするか(器 tests/exp-w310d-mdsweep.mjs が使う)
//   ・外殻の核(単位の質量あたり): 一様の厚い殻(内径 R_i = R_d・外径 R_o = R_obs)は**球の差** ρ_s[V_o K2(r,R_o) − V_i K2(r,R_i)]/(M − m_d)
//     = [R_o³ K2(r,R_o) − R_i³ K2(r,R_i)]/(R_o³ − R_i³)(回転の M2・その動径の微分も同じ球の差)。球の K2・M2 は第309便a の参照の lib
//     tests/lib-w309a-invsq.mjs(エンジンと独立の閉じた式と級数)を使い、**球の差の組み立てはこの lib が自前に書く**。
//     比較の薄い殻(質量が R_obs の球面)は殻の角度の閉じた式 K2 = ln|(r+R)/(r−R)|/(2rR)・M2 = −1/(2r) + (r² + R²) ln((r+R)/(r−R))/(4r²R)
//     (遠方は級数 (1/r²) Σ z^k/(2k+1)・(2/r) Σ_{k≥1} k z^k/((2k−1)(2k+1))・z = (R/r)²)を自前に書く。
//   ・独立の確かめ: 殻の体積の直接の 3 次元の求積(外部と空洞の点 —— 動径 Gauss–Legendre × 球面の積の規則)・殻の物質の中の点は殻の角度の閉じた式を
//     動径で求積(s = r の対数を変数変換で除く)・導関数は数値の微分(Richardson)。
//   ・受け手の側(AN385 の読み): 外殻を持つ受け手は dragCore の体積と外殻の体積でそれぞれ比の平均を取り、**質量で重み**(u = (m_d u_core + (M − m_d) u_shell)/M)。
//     各点の分母 W = 自分の dragCore の場 + 自分の外殻の場 + 他の源(W_bg′ = 0 —— 第107報)。外殻の体積の動径は [R_i, R_o] の Gauss–Legendre を
//     s = 3y² − 2y³ で両端に寄せる(殻の自己の場の端の対数を弱める)。**薄い殻は受け手にできない**(殻の上で自己の場が対数で発散 —— 定義しない)。
//   ・近点への寄与の見積り(一次の摂動の平均 —— 式は estimatePrecession の注記): 並進 β(r) = Σ_n b_n/r^n・回転の枠の角速度 ω_f(r) = c/r⁴。
//
// ■ しないこと: html を読まない・エンジンの式を写さない。**フィットしない**(探索の材料 —— 第109報 AN380)。在位の宣言を作らない。
import * as I from './lib-w309a-invsq.mjs';
export const { dot, cross, norm, add, sub, scale, unit, glNodes, sphereRule, numDr } = I;
export const LIB_VERSION = 'w310d-shell-lib-1';
export const CAP_M = I.CAP_M;   // 6.5e6 m(AN363 の dragCore の既定の半径の上限)

const pos = (x) => Number.isFinite(x) && x > 0;
const vec = (v) => Array.isArray(v) && v.length === 3 && v.every(Number.isFinite);

/* ───────── 一様の厚い殻(球の差 —— 単位の質量あたり)───────── */
function thickF(Ri, Ro) {
  if (!pos(Ri) || !pos(Ro) || !(Ro > Ri)) throw new Error('厚い殻: 0 < R_i < R_o');
  const d = Ro * Ro * Ro - Ri * Ri * Ri;
  return { fo: Ro * Ro * Ro / d, fi: Ri * Ri * Ri / d };
}
/** ⟨1/|x − ρ|²⟩ の殻の体積平均(r ≥ 0 —— 空洞・物質の中・外部のどこでも) */
export function thickK2(r, Ri, Ro) { const { fo, fi } = thickF(Ri, Ro); return fo * I.K2(r, Ro) - fi * I.K2(r, Ri); }
/** d/dr(r ≠ R_i, R_o) */
export function thickK2Dr(r, Ri, Ro) { const { fo, fi } = thickF(Ri, Ro); return fo * I.K2Dr(r, Ro) - fi * I.K2Dr(r, Ri); }
/** 回転の近遠差のモーメント ⟨(ρ·n̂)/|x − ρ|²⟩(外部 r > R_o だけ) */
export function thickM2(r, Ri, Ro) { const { fo, fi } = thickF(Ri, Ro); return fo * I.M2(r, Ro) - fi * I.M2(r, Ri); }
export function thickM2Dr(r, Ri, Ro) { const { fo, fi } = thickF(Ri, Ro); return fo * I.M2Dr(r, Ro) - fi * I.M2Dr(r, Ri); }

/* ───────── 薄い殻(比較 —— 質量が半径 R の球面)───────── */
const Lam = (y) => Math.log1p(y) - Math.log1p(-y);   // ln((1+y)/(1−y))(0 ≤ y < 1)
/** K2 の薄い殻: 内部 (1/R²) g(x)・外部 (1/r²) g(y)(g(t) = Λ(t)/(2t) = Σ t^{2k}/(2k+1))。r = R は発散(Infinity) */
export function thinK2(r, R) {
  if (!(r >= 0) || !pos(R)) throw new Error('thinK2: 定義域');
  if (r === R) return Infinity;
  const inner = r < R, t = inner ? r / R : R / r, sc = inner ? 1 / (R * R) : 1 / (r * r);
  if (t === 0) return sc;
  if (t < 0.3) { let s = 0, p = 1; for (let k = 0; k < 80; k++) { const a = p / (2 * k + 1); s += a; if (a < 1e-18 * s) break; p *= t * t; } return sc * s; }
  return sc * Lam(t) / (2 * t);
}
/** d/dr の薄い殻(r ≠ R): 内部 g′(x)/R³・外部 −[2g(y) + y g′(y)]/r³(g′(t) = 1/(t(1−t²)) − Λ/(2t²)) */
export function thinK2Dr(r, R) {
  if (!(r >= 0) || !pos(R) || r === R) throw new Error('thinK2Dr: 定義域');
  if (r < R) {
    const x = r / R;
    if (x === 0) return 0;
    if (x < 0.3) { let s = 0, p = x; for (let k = 1; k < 80; k++) { const a = 2 * k * p / (2 * k + 1); s += a; if (Math.abs(a) < 1e-18 * Math.abs(s)) break; p *= x * x; } return s / (R * R * R); }
    return (1 / (x * (1 - x * x)) - Lam(x) / (2 * x * x)) / (R * R * R);
  }
  const y = R / r;
  if (y < 0.3) { let s = 0, p = 1; for (let k = 0; k < 80; k++) { const a = (2 + 2 * k) * p / (2 * k + 1); s += a; if (a < 1e-18 * s) break; p *= y * y; } return -s / (r * r * r); }
  const g = Lam(y) / (2 * y), gp = 1 / (y * (1 - y * y)) - Lam(y) / (2 * y * y);
  return -(2 * g + y * gp) / (r * r * r);
}
/** M2 の薄い殻(外部 r > R): (1/r) m(y)・m(y) = −1/2 + (1 + y²)Λ(y)/(4y) = 2 Σ_{k≥1} k y^{2k}/((2k−1)(2k+1)) */
export function thinM2(r, R) {
  if (!pos(R) || !(r > R)) throw new Error('thinM2: 外部 r > R だけ');
  const y = R / r;
  if (y < 0.3) { let s = 0, p = y * y; for (let k = 1; k < 80; k++) { const a = 2 * k * p / ((2 * k - 1) * (2 * k + 1)); s += a; if (a < 1e-18 * s) break; p *= y * y; } return s / r; }
  return (-0.5 + (1 + y * y) * Lam(y) / (4 * y)) / r;
}
/** dM2/dr の薄い殻: −[m(y) + y m′(y)]/r² = −(2/r²) Σ_{k≥1} k y^{2k}/(2k−1) */
export function thinM2Dr(r, R) {
  if (!pos(R) || !(r > R)) throw new Error('thinM2Dr: 外部 r > R だけ');
  const y = R / r;
  if (y < 0.3) { let s = 0, p = y * y; for (let k = 1; k < 80; k++) { const a = 2 * k * p / (2 * k - 1); s += a; if (a < 1e-18 * s) break; p *= y * y; } return -s / (r * r); }
  const L = Lam(y), m = -0.5 + (1 + y * y) * L / (4 * y), mp = L / 2 + (1 + y * y) / (2 * y * (1 - y * y)) - (1 + y * y) * L / (4 * y * y);
  return -(m + y * mp) / (r * r);
}

/* ───────── 部分(源と受け手の体積)の核の振り分け ───────── */
/** part = {kind:'ball', m, R} | {kind:'thick', m, Ri, Ro} | {kind:'thin', m, R} */
export function partOuter(p) { return p.kind === 'thick' ? p.Ro : p.R; }
/** ⟨ρ²⟩(質量の 2 次モーメント —— 慣性モーメントは (2/3) m ⟨ρ²⟩): 球 3R²/5・厚い殻 (3/5)(R_o⁵ − R_i⁵)/(R_o³ − R_i³)・薄い殻 R² */
export function rho2Of(p) {
  if (p.kind === 'ball') return 0.6 * p.R * p.R;
  if (p.kind === 'thin') return p.R * p.R;
  return 0.6 * (p.Ro ** 5 - p.Ri ** 5) / (p.Ro ** 3 - p.Ri ** 3);
}
export function partK2(p, r) { return p.kind === 'ball' ? I.K2(r, p.R) : p.kind === 'thick' ? thickK2(r, p.Ri, p.Ro) : thinK2(r, p.R); }
export function partK2Dr(p, r) {
  if (r === 0) return 0;
  return p.kind === 'ball' ? I.K2Dr(r, p.R) : p.kind === 'thick' ? thickK2Dr(r, p.Ri, p.Ro) : thinK2Dr(r, p.R);
}
export function partM2(p, r) { return p.kind === 'ball' ? I.M2(r, p.R) : p.kind === 'thick' ? thickM2(r, p.Ri, p.Ro) : thinM2(r, p.R); }
export function partM2Dr(p, r) { return p.kind === 'ball' ? I.M2Dr(r, p.R) : p.kind === 'thick' ? thickM2Dr(r, p.Ri, p.Ro) : thinM2Dr(r, p.R); }

/**
 * 太陽の分け方(AN380): dragCore = 一様の球(R_d, m_d)・外殻 = shape:'thick'(内径 R_d・外径 R_obs・質量 M − m_d —— AN384 の読み)| 'thin'(R_obs の球面 —— 比較)|
 * 'none'(外殻を入れない —— 比較: AN380 の読みではない)。m_d = M は外殻の質量 0 で部分を作らない(今の既定と同じ)。
 */
export function sunParts(M, Robs, md, shape = 'thick', Rd = Math.min(Robs, CAP_M)) {
  if (!pos(M) || !pos(Robs) || !(md > 0) || !(md <= M)) throw new Error('sunParts: m_d ∈ (0, M](AN386)');
  const parts = [{ kind: 'ball', m: md, R: Rd, role: 'core' }], ms = M - md;
  if (ms > 0 && shape !== 'none') {
    if (!(Robs > Rd)) throw new Error('sunParts: R_obs ≤ R_d では外殻を作らない');
    parts.push(shape === 'thin' ? { kind: 'thin', m: ms, R: Robs, role: 'shell' } : { kind: 'thick', m: ms, Ri: Rd, Ro: Robs, role: 'shell' });
  }
  return parts;
}

/* ───────── 独立の求積(確かめ)───────── */
/** 厚い殻の体積の直接の 3 次元の求積(外部 r > R_o か空洞 r < R_i の点)。d は殻の中心から点へ。{K, M(外部だけ意味を持つ)} */
export function thickQuad(d, Ri, Ro, nR = 48, nS = 48) {
  if (!vec(d)) throw new Error('thickQuad: d');
  const r = norm(d);
  if (!(r > Ro || r < Ri)) throw new Error('thickQuad: 外部か空洞の点だけ');
  const g = glNodes(nR), S = sphereRule(nS), dh = r > 0 ? unit(d) : [0, 0, 1], den = Ro ** 3 - Ri ** 3;
  let K = 0, M = 0;
  for (let a = 0; a < nR; a++) {
    const s = Ri + (Ro - Ri) * 0.5 * (g.x[a] + 1), wr = 0.5 * (Ro - Ri) * g.w[a] * 3 * s * s / den;
    for (const b of S) { const rho = scale(b.s, s), q = sub(d, rho), i2 = 1 / dot(q, q), w = wr * b.w; K += w * i2; M += w * dot(rho, dh) * i2; }
  }
  return { K, M };
}
/** 薄い殻の球面の直接の求積(r ≠ R)。{K, M} */
export function thinQuad(d, R, nS = 64) {
  const r = norm(d), dh = r > 0 ? unit(d) : [0, 0, 1];
  let K = 0, M = 0;
  for (const b of sphereRule(nS)) { const rho = scale(b.s, R), q = sub(d, rho), i2 = 1 / dot(q, q); K += b.w * i2; M += b.w * dot(rho, dh) * i2; }
  return { K, M };
}
/** 厚い殻の K2 を殻の角度の閉じた式 ln|(r+s)/(r−s)|/(2rs) の動径の求積で(任意の r > 0 —— 物質の中は s = r の両側を s = r ∓ h u² で) */
export function thickK2Radial(r, Ri, Ro, n = 64) {
  if (!(r > 0)) throw new Error('thickK2Radial: r > 0');
  const g = glNodes(n), den = Ro ** 3 - Ri ** 3, shell = (s) => Math.log(Math.abs((r + s) / (r - s))) / (2 * r * s);
  const segs = (r > Ri && r < Ro) ? [[Ri, r, -1], [r, Ro, 1]] : [[Ri, Ro, 0]];
  let sum = 0;
  for (const [lo, hi, sg] of segs) {
    const h = hi - lo;
    for (let k = 0; k < n; k++) {
      const u = 0.5 * (g.x[k] + 1);
      let s, ds;
      if (sg < 0) { s = r - h * u * u; ds = 2 * h * u; } else if (sg > 0) { s = r + h * u * u; ds = 2 * h * u; }
      else if (r < Ri) { s = lo + h * u * u; ds = 2 * h * u; }   // 空洞の点: 近い端 R_i へ寄せる
      else { s = hi - h * u * u; ds = 2 * h * u; }                // 外部の点: 近い端 R_o へ寄せる
      sum += 0.5 * g.w[k] * 3 * s * s * shell(s) * ds;
    }
  }
  return sum / den;
}

/* ───────── 受け手の体積の規則 ───────── */
const THICK_RULES = new Map();
/** 厚い殻の体積(単位の重みの和 1): 動径 s = R_i + (R_o − R_i)(3y² − 2y³)(y は [0,1] の Gauss–Legendre n 点)・μ は Gauss–Legendre n 点・方位 2n 等分 */
export function thickRule(n, Ri, Ro) {
  const key = n + '|' + Ri + '|' + Ro;
  if (THICK_RULES.has(key)) return THICK_RULES.get(key);
  const g = glNodes(n), den = Ro ** 3 - Ri ** 3, out = [];
  for (let a = 0; a < n; a++) {
    const y = 0.5 * (g.x[a] + 1), s = Ri + (Ro - Ri) * (3 * y * y - 2 * y * y * y), ds = (Ro - Ri) * 6 * y * (1 - y), wr = 0.5 * g.w[a] * 3 * s * s * ds / den;
    for (let b = 0; b < n; b++) {
      const mu = g.x[b], st = Math.sqrt(Math.max(0, 1 - mu * mu)), wm = 0.5 * g.w[b];
      for (let c = 0; c < 2 * n; c++) { const ph = 2 * Math.PI * (c + 0.5) / (2 * n); out.push({ rho: s, s: [st * Math.cos(ph), st * Math.sin(ph), mu], w: wr * wm / (2 * n) }); }
    }
  }
  THICK_RULES.set(key, out);
  return out;
}
/** 受け手の体積の点(AN385: 部分ごとの規則 × 質量の重み m_p/M)。球は第309便a の lib の receiverRule(t = 1 − u²) */
export function receiverPoints(body, n) {
  const M = body.parts.reduce((s, p) => s + p.m, 0), out = [];
  for (const p of body.parts) {
    if (!(p.m > 0)) continue;
    if (p.kind === 'thin') return null;   // 薄い殻は受け手にできない(殻の上で自己の場が発散)
    const wp = p.m / M;
    if (p.kind === 'ball') for (const q of I.receiverRule(n)) out.push({ x: add(body.x, scale(q.s, p.R * q.t)), w: wp * q.w, part: p.role || 'ball' });
    else for (const q of thickRule(n, p.Ri, p.Ro)) out.push({ x: add(body.x, scale(q.s, q.rho)), w: wp * q.w, part: p.role || 'thick' });
  }
  return out;
}

/* ───────── 参照の新則(部分を持つ天体)───────── */
/** 点 x の W と ∇W(全天体の全部分 —— 自己を含むトータル・W_bg′ は o.Wbg2〔比較の引数 —— 既定 0〕) */
export function fieldAt(bodies, x, o = {}) {
  let W = o.Wbg2 || 0, G = [0, 0, 0];
  for (const b of bodies) {
    const d = sub(x, b.x), r = norm(d);
    for (const p of b.parts) {
      if (!(p.m > 0)) continue;
      W += p.m * partK2(p, r);
      if (r > 0) G = add(G, scale(d, p.m * partK2Dr(p, r) / r));
    }
  }
  return { W, G };
}
/**
 * 受け手 i の比の平均。bodies = [{x, m, Om, a, parts}]・o = {order(既定 8), gain(軸 A —— 既定 1), axial(既定 true), Wbg2(既定 0)}。
 * 戻り値: beta[j](源の天体ごと)・betaPart[j][部分の添字]・rot[j](⟨(Σ m_p M2_p/W) n̂⟩)・omega(軸の角速度)・negFrac・byVolume(受け手の部分ごとの β —— 質量の重みの前)
 */
export function refReceiver(bodies, i, o = {}) {
  const n = o.order || 8, gain = o.gain === undefined ? 1 : o.gain, J = bodies.length, me = bodies[i];
  const pts = receiverPoints(me, n);
  if (!pts) return { undefinedReceiver: 'thin-shell', beta: null };
  const beta = new Array(J).fill(0), betaPart = bodies.map((b) => b.parts.map(() => 0)), rot = Array.from({ length: J }, () => [0, 0, 0]);
  const byVolume = {};
  let omega = [0, 0, 0], neg = 0, tot = 0, Wm = 0;
  for (const q of pts) {
    const F = fieldAt(bodies, q.x, o);
    Wm += q.w * F.W;
    for (let j = 0; j < J; j++) {
      if (j === i) continue;
      const b = bodies[j], d = sub(q.x, b.x), r = norm(d), nh = scale(d, 1 / r);
      let N = 0, Mm = 0, dM = 0;
      b.parts.forEach((p, k) => {
        if (!(p.m > 0)) return;
        const kk = p.m * partK2(p, r) / F.W; N += kk; betaPart[j][k] += q.w * kk;
        if (r > partOuter(p)) { Mm += p.m * partM2(p, r); dM += p.m * partM2Dr(p, r); }
      });
      beta[j] += q.w * N;
      byVolume[q.part] = (byVolume[q.part] || 0) + q.w * N;
      rot[j] = add(rot[j], scale(nh, q.w * Mm / F.W));
      if (b.Om && o.axial !== false) {
        const amp = -(dM / F.W - Mm * dot(F.G, nh) / (F.W * F.W)), sn = norm(cross(b.a, nh)), mu = dot(nh, b.a);
        omega = add(omega, scale(sub(scale(nh, 2 * mu), b.a), q.w * gain * amp * sn * b.Om));
        tot += q.w; if (amp < 0) neg += q.w;
      }
    }
  }
  return { beta, betaPart, rot, omega, negFrac: tot > 0 ? neg / tot : null, Wmean: Wm, byVolume, nPoints: pts.length };
}

/* ───────── 近点への寄与の見積り(一次の摂動の平均)───────── */
/**
 * 運動: ẋ = (1 − β(r)) v + ω_f(r) n̂_orb × x・v̇ = −μ x/r³(v は慣性速度 —— 今の solve の約束〔源は全速度・受け手は慣性速度〕で太陽の速度を 0 とした二体の相対)。
 * 保存量: L = x × v は ω_f = 0 で保存・E = v²/2 − μ∫dr/((1 − β) r²)・h(r) = h₀ − ∫ r ω_f dr。u = 1/r の軌道の式 u″ + u = A + P(u)(A = μ/h₀²)の
 * 一次の永年の項から近点の 1 周期の前進 Δϖ = (π/(A e))·[P]_cos([P]_cos = (1/π)∫ P(A(1 + e cos φ)) cos φ dφ):
 *   ・並進 β = b_n/r^n:  P = A b_n u^n → Δϖ_n = π b_n J_n(e)/p^n(J_2 = 2・J_4 = 4 + 3e²・p = h₀²/μ)—— n = 2 は 2π b/p²(前進)。
 *   ・回転 ω_f = c/r⁴:   P = −(6cE/h₀³)u − (9cμ/h₀³)u² + (4c/h₀)u³ → Δϖ_rot = −3π c/(p² h₀)(e に依らない —— 順行の枠の回転は**後退**)。
 * b は β r² の遠方の値・c = (2/3) b ⟨ρ²⟩_d Ω_∥(源の M2 の先頭 2⟨ρ²⟩/(3r³)・Ω_∥ = Ω_sun (â_sun·n̂_orb))・b_4 = b ⟨ρ²⟩_d/3(K2 の次の項 ⟨ρ²⟩/(3r⁴))。
 */
export const J2 = () => 2;
export const J4 = (e) => 4 + 3 * e * e;
export function dPiTrans(bn, nPow, p, e) {
  if (nPow === 2) return Math.PI * bn * J2(e) / (p * p);
  if (nPow === 4) return Math.PI * bn * J4(e) / (p ** 4);
  throw new Error('dPiTrans: n は 2 か 4');
}
export function dPiRot(c, p, h0) { return -3 * Math.PI * c / (p * p * h0); }

/** 自己試験: 平面の二体に β = b2/r² + b4/r⁴・ω_f = c/r⁴ を足した運動を RK4 で積み、近点(距離の極小の 3 点放物線)の方位の直線から 1 周期の前進を測る */
export function rk4Precession(o) {
  const { mu, a, e, b2 = 0, b4 = 0, c = 0, nOrb = 6, steps = 6000 } = o;
  const rp = a * (1 - e), vp = Math.sqrt(mu * (1 + e) / rp);
  const beta = (r) => b2 / (r * r) + b4 / (r ** 4), wf = (r) => c / (r ** 4);
  const f = (s) => {
    const r = Math.hypot(s[0], s[1]), g = -mu / (r * r * r), fb = 1 - beta(r), w = wf(r);
    return [fb * s[2] - w * s[1], fb * s[3] + w * s[0], g * s[0], g * s[1]];
  };
  let y = [rp, 0, 0, vp];
  const P = 2 * Math.PI * Math.sqrt(a ** 3 / mu), h = P / steps, peri = [];
  let r1 = rp, r2 = rp, a1 = 0, a2 = 0;
  for (let k = 1; k <= Math.round(nOrb * steps) + 2; k++) {
    const k1 = f(y), k2 = f(y.map((x, j) => x + 0.5 * h * k1[j])), k3 = f(y.map((x, j) => x + 0.5 * h * k2[j])), k4 = f(y.map((x, j) => x + h * k3[j]));
    y = y.map((x, j) => x + h / 6 * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j]));
    const r = Math.hypot(y[0], y[1]);
    let ang = Math.atan2(y[1], y[0]);
    while (ang - a1 > Math.PI) ang -= 2 * Math.PI; while (ang - a1 < -Math.PI) ang += 2 * Math.PI;
    if (k >= 3 && r1 < r2 && r1 < r) {
      const den = r2 - 2 * r1 + r, fr = den !== 0 ? 0.5 * (r2 - r) / den : 0;
      peri.push({ t: (k - 1 + fr) * h, ang: a1 + 0.5 * fr * (ang - a2) + 0.5 * fr * fr * (ang - 2 * a1 + a2) });
    }
    r2 = r1; r1 = r; a2 = a1; a1 = ang;
  }
  // 近点の方位(巻き戻し —— 1 周期ごとに 2π を足した累積の角の差)
  if (peri.length < 3) return null;
  const n = peri.length, xs = peri.map((z) => z.t), ys = []; let acc = 0, prev = peri[0].ang;
  ys.push(0);
  for (let i = 1; i < n; i++) { let d = peri[i].ang - prev; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; acc += d; ys.push(acc); prev = peri[i].ang; }
  const mx = xs.reduce((s, x) => s + x, 0) / n, my = ys.reduce((s, x) => s + x, 0) / n;
  let sxy = 0, sxx = 0; for (let i = 0; i < n; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; }
  const slope = sxy / sxx, Pr = (xs[n - 1] - xs[0]) / (n - 1);
  return { perOrbit: slope * Pr, nPeri: n, radialPeriod: Pr };
}
/** 自己試験の表(誇張した係数 —— 一次の式との相対の差) */
export function precessionSelfTest(o = {}) {
  const mu = 1, a = 1, steps = o.steps || 8000, rows = [];
  for (const e of [0.05, 0.2056, 0.4]) {
    const p = a * (1 - e * e), h0 = Math.sqrt(mu * p);
    const cases = [
      { key: 'b2', b2: 2e-6, pred: dPiTrans(2e-6, 2, p, e) },
      { key: 'b4', b4: 2e-6, pred: dPiTrans(2e-6, 4, p, e) },
      { key: 'c', c: 2e-7, pred: dPiRot(2e-7, p, h0) },
    ];
    for (const c of cases) {
      const base = rk4Precession({ mu, a, e, nOrb: o.nOrb || 6, steps });
      const m = rk4Precession({ mu, a, e, b2: c.b2 || 0, b4: c.b4 || 0, c: c.c || 0, nOrb: o.nOrb || 6, steps });
      const meas = m.perOrbit - base.perOrbit;
      rows.push({ e, key: c.key, pred: c.pred, meas, relDiff: Math.abs(meas - c.pred) / Math.abs(c.pred) });
    }
  }
  return { rows, maxRel: Math.max(...rows.map((r) => r.relDiff)) };
}
