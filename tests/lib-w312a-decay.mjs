// 第312便a(原仮定者の裁定(第114報)「R_d² が惑星の質量 × 軌道の半直弦に比例する結果は、距離に応じた引きずりの減衰が強すぎる可能性 —— 今の引きずりが r⁻³ なら
// r⁻² などを調査する。軸引きずりだけ違う場合や、受け側の質量が影響する場合も可能性に含める」・決断事項 AN398・統括の検証項目 R230):
// **減衰の比較の参照の純関数**(html を読まない・状態を持たない —— エンジンの inertialDragIsq* と独立に組む)。
//
// ■ 何をするか(器 tests/exp-w312a-decay.mjs が使う)
//   ・源の体積平均の重みの族 K_α(r; R) = ⟨1/|x − ρ|^α⟩ と回転の近遠差のモーメント M_α(r; R) = ⟨(ρ·n̂)/|x − ρ|^α⟩(α = 1, 2)と動径の微分 ——
//     一様球(ball)・薄い殻(thin —— 半径 a の球面)・一様の厚い殻(thick —— 球の差)。α = 2 は第309便a・第310便d の参照の lib(tests/lib-w309a-invsq.mjs・
//     tests/lib-w310d-shell.mjs)をそのまま呼び、α = 1 はこの lib が自前に書く:
//       K1 球: 外部 1/r(殻の定理 —— 外部の点で 1/|x − ρ| の球面平均は 1/max(r, s))・内部 (3R² − r²)/(2R³)・動径の微分 −1/r²・−r/R³(r = R で連続)。
//       M1 球(外部 r > R): ⟨ρ²⟩/(3r²) = R²/(5r²)(1/|x − ρ| の Legendre 展開で (ρ·n̂) = ρP₁ と直交するのは l = 1 の項だけ —— 外部では厳密・級数は要らない)・
//         動径の微分 −2R²/(5r³)。M₁ = R²/(5r²) は Legendre の直交からの導出(器の段 K が 3 次元の求積で照合する)。
//       K1 薄い殻(半径 a): 外部 1/r・内部 1/a(殻の上 r = a で有限 —— K2 の対数の発散が無い)・動径の微分 −1/r²・0(殻の上は両側の平均 −1/(2a²) —— 構成の選択)。
//       M1 薄い殻: a²/(3r²)・微分 −2a²/(3r³)。
//     **α ≥ 3 は扱わない**: 受け手の自己の場 ⟨1/|x − ρ|^α⟩ が受け手の球の内部の点で発散する(∫ s² ds/|r − s|^α は α ≥ 3 で s = r の近くが積分できない ——
//     自己を分母に入れる新則の型が組めない)。今の新則の回転 M2 ∝ r⁻³・軸 ∝ r⁻⁴ は α = 2 の族の導出の次数で、α を 3 にした族ではない。
//   ・独立の確かめ: 源の球(と殻)の直接の 3 次元の求積(動径 Gauss–Legendre × 球面の積の規則 —— tests/lib-w307a-sphereaxial.mjs)・内部の K1 は殻の角度の閉じた式
//     1/max(r, s) の動径の求積(s = r の折れ目で区間を分ける)・導関数は数値の微分(Richardson)。
//   ・受け手の体積平均(**比の平均** —— エンジンと同じ規則・α を引数に): 受け手 i の体積の点 x で W(x) = W_bg′ + 自己の場 + 他の源の場(全部 α の族)、
//     β_ij = ⟨Σ_p m_p K_p/W⟩・回転の係数 ⟨(Σ_p m_p M_p/W) n̂⟩(部分ごとにも)・軸 ω_i = A Σ_j Σ_p ⟨amp_p sinθ_p Ω_p (2 n̂(n̂·â_p) − â_p)⟩
//     (amp_p = −n̂·∇(m_p M_p/W) —— 部分ごとの自転と軸〔dragCore の自転〕を持てる)。自己の場は**節点の半径から閉じた式で**(座標の差の長さを使わない —— エンジンの前計算と
//     独立に同じ量)。受け手の部分: dragCore の球(動径 t = 1 − u²)・一様の厚い殻(s = R_i + (R_o − R_i)(3y² − 2y³))・薄い殻は α = 1 だけ殻の上の点(球面の規則 —— 半径 R)・
//     α = 2 の薄い殻は殻の分 0(殻の上で自己の場が対数で発散 —— 第310便a のエンジンの規則)。質量で重み(m_p/M)。
//   ・成分ごとの変更(一度に 1 つ): gamma(自己の場の質量の次数 —— 1 = 今の W_self = m K・0 = W_self = m_ref K)・rotLen:'src'(回転の係数だけ M_α·r/R_d,src ——
//     次数を 1 つ下げ、次元をそろえる基準の長さは源の R_d)。軸だけの変更は近点に一次で効かない(軸の ω は u に足さない —— 姿勢へ)ので関数を作らない。
//   ・近点の一次の式(摂動の平均 —— 運動 ẋ = (1 − β(r)) v + ω_f(r) n̂_orb × x・v̇ = −μx/r³。第310便d の式を次数で一般に):
//       並進 β = b/r^n: Δϖ = π b J_n(e)/p^n(J_n(e) = (1/(πe))∫(1 + e cos φ)^n cos φ dφ —— J_1 = 1・J_2 = 2・J_3 = 3 + 3e²/4・J_4 = 4 + 3e²)。
//       回転 ω_f = c/r^k(k ≥ 3): u = 1/r の式 u″ + u = A + P(u)・P = (ck/h₀)u^(k−1) − (2Ec(k−1)/h₀³)u^(k−3) − (2μc(k−1)²/((k−2)h₀³))u^(k−2)
//       → Δϖ = π Σ a_n A^(n−1) J_n(e)(k = 4 で −3πc/(p²h₀)〔第310便d と同じ〕・k = 3 で −2πc/(p h₀))。自己試験は RK4(rk4Precession)。
//   ・スクリーニング(screenColumn): 各列で、惑星の受け手の t = 0 の写しの配置で β と回転の係数を参照の受け手で作り(試しの R_d)、一次の式の Δϖ を t_D に合わせる
//     R_d を固定点で(β・回転は R_d^α に比例 —— 2 回の反復)。**スクリーニングであって法則の採用ではない**・**フィットではない**(探索の材料)。
//
// ■ しないこと: html を読まない・エンジンの式を写さない(器がエンジンの inertialDragIsq* の K1 の経路と比べる)・係数 C_α は求積で測る(手で写した数を使わない)。
import * as I from './lib-w309a-invsq.mjs';
import * as D from './lib-w310d-shell.mjs';
export const { dot, cross, norm, add, sub, scale, unit, glNodes, sphereRule, ballRadial, numDr } = I;
export const LIB_VERSION = 'w312a-decay-lib-1';
export const CAP_M = I.CAP_M;
export const ALPHAS = Object.freeze([1, 2]);
const pos = (x) => Number.isFinite(x) && x > 0;
const vec = (v) => Array.isArray(v) && v.length === 3 && v.every(Number.isFinite);
const chkA = (al) => { if (al !== 1 && al !== 2) throw new Error('α は 1 か 2(α ≥ 3 は自己の場が発散 —— 扱わない)'); };

/* ───────── 一様球 ───────── */
export function Kball(al, r, R) {
  chkA(al); if (!(r >= 0) || !pos(R)) throw new Error('Kball: 定義域');
  if (al === 2) return I.K2(r, R);
  return r >= R ? 1 / r : (3 * R * R - r * r) / (2 * R * R * R);
}
export function KballDr(al, r, R) {
  chkA(al); if (!(r >= 0) || !pos(R)) throw new Error('KballDr: 定義域');
  if (al === 2) return r === 0 ? 0 : I.K2Dr(r, R);
  return r >= R ? -1 / (r * r) : -r / (R * R * R);
}
export function Mball(al, r, R) { chkA(al); if (!pos(R) || !(r > R)) throw new Error('Mball: 外部 r > R だけ'); return al === 2 ? I.M2(r, R) : R * R / (5 * r * r); }
export function MballDr(al, r, R) { chkA(al); if (!pos(R) || !(r > R)) throw new Error('MballDr: 外部 r > R だけ'); return al === 2 ? I.M2Dr(r, R) : -2 * R * R / (5 * r * r * r); }

/* ───────── 薄い殻(半径 a)───────── */
export function Kthin(al, r, a) {
  chkA(al); if (!(r >= 0) || !pos(a)) throw new Error('Kthin: 定義域');
  if (al === 2) return D.thinK2(r, a);
  return r >= a ? 1 / r : 1 / a;
}
/** 動径の微分(α = 1 の殻の上 r = a は両側の平均 −1/(2a²) —— 構成の選択。α = 2 は殻の上で発散 —— 呼ばない) */
export function KthinDr(al, r, a) {
  chkA(al); if (!(r >= 0) || !pos(a)) throw new Error('KthinDr: 定義域');
  if (al === 2) return r === 0 ? 0 : D.thinK2Dr(r, a);
  return r > a ? -1 / (r * r) : (r < a ? 0 : -1 / (2 * a * a));
}
export function Mthin(al, r, a) { chkA(al); if (!pos(a) || !(r > a)) throw new Error('Mthin: 外部だけ'); return al === 2 ? D.thinM2(r, a) : a * a / (3 * r * r); }
export function MthinDr(al, r, a) { chkA(al); if (!pos(a) || !(r > a)) throw new Error('MthinDr: 外部だけ'); return al === 2 ? D.thinM2Dr(r, a) : -2 * a * a / (3 * r * r * r); }

/* ───────── 一様の厚い殻(球の差 —— 単位の質量あたり)───────── */
function thickF(Ri, Ro) { if (!pos(Ri) || !pos(Ro) || !(Ro > Ri)) throw new Error('厚い殻: 0 < R_i < R_o'); const d = Ro ** 3 - Ri ** 3; return { fo: Ro ** 3 / d, fi: Ri ** 3 / d }; }
export function Kthick(al, r, Ri, Ro) { const { fo, fi } = thickF(Ri, Ro); return fo * Kball(al, r, Ro) - fi * Kball(al, r, Ri); }
export function KthickDr(al, r, Ri, Ro) { const { fo, fi } = thickF(Ri, Ro); return fo * KballDr(al, r, Ro) - fi * KballDr(al, r, Ri); }
export function Mthick(al, r, Ri, Ro) { const { fo, fi } = thickF(Ri, Ro); return fo * Mball(al, r, Ro) - fi * Mball(al, r, Ri); }
export function MthickDr(al, r, Ri, Ro) { const { fo, fi } = thickF(Ri, Ro); return fo * MballDr(al, r, Ro) - fi * MballDr(al, r, Ri); }

/* ───────── 部分(源の体積)───────── */
/** part = {kind:'ball', m, R} | {kind:'thick', m, Ri, Ro} | {kind:'thin', m, R}(Om・a を持てば部分ごとの自転と軸 —— dragCore の自転) */
export const partOuter = (p) => (p.kind === 'thick' ? p.Ro : p.R);
export function rho2Of(p) { return p.kind === 'ball' ? 0.6 * p.R * p.R : p.kind === 'thin' ? p.R * p.R : 0.6 * (p.Ro ** 5 - p.Ri ** 5) / (p.Ro ** 3 - p.Ri ** 3); }
export function partK(al, p, r) { return p.kind === 'ball' ? Kball(al, r, p.R) : p.kind === 'thick' ? Kthick(al, r, p.Ri, p.Ro) : Kthin(al, r, p.R); }
export function partKDr(al, p, r) { return p.kind === 'ball' ? KballDr(al, r, p.R) : p.kind === 'thick' ? KthickDr(al, r, p.Ri, p.Ro) : KthinDr(al, r, p.R); }
export function partM(al, p, r) { return p.kind === 'ball' ? Mball(al, r, p.R) : p.kind === 'thick' ? Mthick(al, r, p.Ri, p.Ro) : Mthin(al, r, p.R); }
export function partMDr(al, p, r) { return p.kind === 'ball' ? MballDr(al, r, p.R) : p.kind === 'thick' ? MthickDr(al, r, p.Ri, p.Ro) : MthinDr(al, r, p.R); }

/* ───────── 独立の求積(確かめ)───────── */
/** 源の球(半径 R)・厚い殻(Ri, Ro)・薄い殻(半径 R —— 球面だけ)の直接の 3 次元の求積(外部の点)。{K, M} */
export function sourceQuad(al, d, part, nR = 48, nS = 48) {
  chkA(al); if (!vec(d)) throw new Error('sourceQuad: d');
  const r = norm(d), dh = unit(d);
  if (!(r > partOuter(part))) throw new Error('sourceQuad: 外部の点だけ');
  const pw = (q) => (al === 2 ? 1 / dot(q, q) : 1 / Math.sqrt(dot(q, q)));
  let K = 0, M = 0;
  if (part.kind === 'thin') {
    for (const b of sphereRule(nS)) { const rho = scale(b.s, part.R), q = sub(d, rho), w = b.w * pw(q); K += w; M += w * dot(rho, dh); }
    return { K, M };
  }
  const Ri = part.kind === 'thick' ? part.Ri : 0, Ro = partOuter(part), g = glNodes(nR), den = Ro ** 3 - Ri ** 3;
  for (let a = 0; a < nR; a++) {
    const s = Ri + (Ro - Ri) * 0.5 * (g.x[a] + 1), wr = 0.5 * (Ro - Ri) * g.w[a] * 3 * s * s / den;
    for (const b of sphereRule(nS)) { const rho = scale(b.s, s), q = sub(d, rho), w = wr * b.w * pw(q); K += w; M += w * dot(rho, dh); }
  }
  return { K, M };
}
/** 内部の K1(0 < r < R): 殻の角度の閉じた式 1/max(r, s) を動径で求積(s = r の折れ目で区間を分ける) */
export function selfK1Quad(r, R, n = 32) {
  if (!(r > 0) || !(r < R)) throw new Error('selfK1Quad: 0 < r < R');
  const g = glNodes(n);
  let sum = 0;
  for (const [lo, hi] of [[0, r], [r, R]]) for (let k = 0; k < n; k++) { const s = lo + (hi - lo) * 0.5 * (g.x[k] + 1); sum += 0.5 * (hi - lo) * g.w[k] * 3 * s * s / Math.max(r, s); }
  return sum / (R * R * R);
}

/* ───────── 受け手の体積の規則 ───────── */
const SURF = new Map();
/** 球面の点(μ は Gauss–Legendre n 点・方位 2n 等分 —— 和 1) */
export function surfaceRule(n) {
  if (SURF.has(n)) return SURF.get(n);
  const g = glNodes(n), out = [];
  for (let b = 0; b < n; b++) { const mu = g.x[b], st = Math.sqrt(Math.max(0, 1 - mu * mu)); for (let c = 0; c < 2 * n; c++) { const ph = 2 * Math.PI * (c + 0.5) / (2 * n); out.push({ s: [st * Math.cos(ph), st * Math.sin(ph), mu], w: 0.5 * g.w[b] / (2 * n) }); } }
  SURF.set(n, out);
  return out;
}
/** 受け手の体積の点(部分ごと —— 質量の重み m_p/M・節点の半径 rho と向き s を持つ)。α = 2 の薄い殻は殻の分を作らない(殻の上で発散 —— 第310便a の規則) */
export function receiverPoints(al, body, n) {
  const M = body.parts.reduce((s, p) => s + p.m, 0), out = [];
  for (let k = 0; k < body.parts.length; k++) {
    const p = body.parts[k];
    if (!(p.m > 0)) continue;
    const wp = p.m / M;
    if (p.kind === 'ball') for (const q of I.receiverRule(n)) out.push({ rho: p.R * q.t, s: q.s, w: wp * q.w, part: k });
    else if (p.kind === 'thick') for (const q of D.thickRule(n, p.Ri, p.Ro)) out.push({ rho: q.rho, s: q.s, w: wp * q.w, part: k });
    else if (al === 1) for (const q of surfaceRule(n)) out.push({ rho: p.R, s: q.s, w: wp * q.w, part: k });
  }
  return out;
}
/** 自分の部分の場(節点の半径 rho から閉じた式で —— 座標の差を使わない)。{W, g(動径の微分の和)} */
export function selfField(al, body, rho, mfac = 1) {
  let W = 0, g = 0;
  for (const p of body.parts) { if (!(p.m > 0)) continue; W += mfac * p.m * partK(al, p, rho); g += mfac * p.m * partKDr(al, p, rho); }
  return { W, g };
}

/* ───────── 参照の受け手(α・成分の変更を引数に)───────── */
/**
 * bodies = [{x, m, Om, a, parts:[{kind, m, R|Ri,Ro, Om?, a?}]}]・o = {alpha, order, gain(既定 1), axial(既定 true), Wbg2(既定 0), gamma(既定 1), mRef, rotLen:'src'|undefined}
 * 戻り値: beta[j]・rot[j](⟨(Σ_p m_p M_p/W) n̂⟩)・rotPart[j][p]・uRot[j](Σ_p Ω_p â_p × rotPart)・omega・omegaPart[j][p]・negFrac
 */
export function refReceiver(bodies, i, o = {}) {
  const al = o.alpha || 2, n = o.order || 8, gain = o.gain === undefined ? 1 : o.gain, J = bodies.length, me = bodies[i];
  const gam = o.gamma === undefined ? 1 : o.gamma, mfac = gam === 1 ? 1 : Math.pow(o.mRef / me.m, 1 - gam);
  const pts = receiverPoints(al, me, n), beta = new Array(J).fill(0), rot = Array.from({ length: J }, () => [0, 0, 0]);
  const rotPart = bodies.map((b) => b.parts.map(() => [0, 0, 0])), omegaPart = bodies.map((b) => b.parts.map(() => [0, 0, 0]));
  let omega = [0, 0, 0], neg = 0, tot = 0;
  for (const q of pts) {
    const x = add(me.x, scale(q.s, q.rho)), sf = selfField(al, me, q.rho, mfac);
    let W = (o.Wbg2 || 0) + sf.W, G = scale(q.s, sf.g);
    const geo = [];
    for (let j = 0; j < J; j++) {
      if (j === i) { geo.push(null); continue; }
      const b = bodies[j], d = sub(x, b.x), r = norm(d), nh = scale(d, 1 / r);
      geo.push({ r, nh });
      for (const p of b.parts) { if (!(p.m > 0)) continue; W += p.m * partK(al, p, r); G = add(G, scale(nh, p.m * partKDr(al, p, r))); }
    }
    for (let j = 0; j < J; j++) {
      if (j === i) continue;
      const b = bodies[j], { r, nh } = geo[j];
      let N = 0, ampSum = 0, anyAx = false;
      b.parts.forEach((p, k) => {
        if (!(p.m > 0)) return;
        N += p.m * partK(al, p, r) / W;
        if (!(r > partOuter(p))) return;
        let Mm = p.m * partM(al, p, r), dM = p.m * partMDr(al, p, r);
        if (o.rotLen === 'src') { const L = b.parts[0].kind === 'ball' ? b.parts[0].R : partOuter(b.parts[0]); dM = (dM * r + Mm) / L; Mm = Mm * r / L; }
        rotPart[j][k] = add(rotPart[j][k], scale(nh, q.w * Mm / W));
        const Om = p.Om === undefined ? b.Om : p.Om, ax = p.a === undefined ? b.a : p.a;
        if (o.rotLen === 'src') { Mm = p.m * partM(al, p, r); dM = p.m * partMDr(al, p, r); }   // 軸は今の族のまま(回転の係数だけを変える列)
        if (o.axial !== false && Om) {
          const amp = -(dM / W - Mm * dot(G, nh) / (W * W)), sn = norm(cross(ax, nh)), mu = dot(nh, ax);
          const w = scale(sub(scale(nh, 2 * mu), ax), q.w * gain * amp * sn * Om);
          omegaPart[j][k] = add(omegaPart[j][k], w); omega = add(omega, w); ampSum += amp; anyAx = true;
        }
      });
      beta[j] += q.w * N;
      if (anyAx) { tot += q.w; if (ampSum < 0) neg += q.w; }
    }
  }
  const uRot = bodies.map((b, j) => {
    if (j === i) return [0, 0, 0];
    let u = [0, 0, 0];
    b.parts.forEach((p, k) => { const Om = p.Om === undefined ? b.Om : p.Om, ax = p.a === undefined ? b.a : p.a; if (Om) u = add(u, cross(scale(ax, Om), rotPart[j][k])); });
    return u;
  });
  for (let j = 0; j < J; j++) for (const v of rotPart[j]) rot[j] = add(rot[j], v);
  return { beta, rot, rotPart, uRot, omega, omegaPart, negFrac: tot > 0 ? neg / tot : null, nPoints: pts.length };
}
/** 係数 C_α(n) = ⟨1/K_α(t; 1)⟩(単位の球の受け手の体積平均 —— 次数 n の規則)。n = 'exact' は動径の Gauss–Legendre 96 点 × t = 1 − u² の変数変換 */
export function coefC(al, n = 8) {
  chkA(al);
  if (n === 'exact') { const g = glNodes(96); let s = 0; for (let k = 0; k < 96; k++) { const u = 0.5 * (g.x[k] + 1), t = 1 - u * u; s += 0.5 * g.w[k] * 3 * t * t * 2 * u / Kball(al, t, 1); } return s; }
  let s = 0; for (const q of I.receiverRule(n)) s += q.w / Kball(al, q.t, 1); return s;
}
/** C₁ の閉じた式(この lib の導出 —— ⟨2/(3 − t²)⟩ = 6[−1 + (√3/2) ln(2 + √3)]) */
export const C1_CLOSED = 6 * (-1 + Math.sqrt(3) / 2 * Math.log(2 + Math.sqrt(3)));

/* ───────── 近点の一次の式 ───────── */
/** J_n(e) = (1/(πe))∫₀^{2π}(1 + e cos φ)^n cos φ dφ(台形 —— 三角多項式に厳密)。n = 0 は 0 */
export function Jn(n, e) {
  if (n === 0) return 0;
  if (!(e > 0)) return n;   // e → 0 の極限
  const N = 256; let s = 0;
  for (let k = 0; k < N; k++) { const ph = 2 * Math.PI * k / N; s += Math.pow(1 + e * Math.cos(ph), n) * Math.cos(ph); }
  return s * (2 * Math.PI / N) / (Math.PI * e);
}
export function dPiTrans(b, nPow, p, e) { return Math.PI * b * Jn(nPow, e) / Math.pow(p, nPow); }
/** 回転の枠 ω_f = c/r^k(k ≥ 3)の 1 周期の近点の前進 */
export function dPiRot(c, k, p, e, mu) {
  if (!(k >= 3)) throw new Error('dPiRot: k ≥ 3');
  const h0 = Math.sqrt(mu * p), E = -mu * (1 - e * e) / (2 * p), A = 1 / p;
  const terms = [[k - 1, c * k / h0], [k - 3, -2 * E * c * (k - 1) / (h0 ** 3)], [k - 2, -2 * mu * c * (k - 1) ** 2 / ((k - 2) * h0 ** 3)]];
  let s = 0; for (const [nn, a] of terms) s += a * Math.pow(A, nn - 1) * Jn(nn, e);
  return Math.PI * s;
}
/** 自己試験: 平面の二体に β = b/r^n・ω_f = c/r^k を足した運動を RK4 で積み、近点の方位の直線から 1 周期の前進を測る(第310便d の型を次数で一般に) */
export function rk4Precession(o) {
  const { mu, a, e, b = 0, n = 2, c = 0, k = 4, nOrb = 6, steps = 6000 } = o;
  const rp = a * (1 - e), vp = Math.sqrt(mu * (1 + e) / rp);
  const f = (s) => { const r = Math.hypot(s[0], s[1]), g = -mu / (r * r * r), fb = 1 - b / Math.pow(r, n), w = c / Math.pow(r, k); return [fb * s[2] - w * s[1], fb * s[3] + w * s[0], g * s[0], g * s[1]]; };
  let y = [rp, 0, 0, vp];
  const P = 2 * Math.PI * Math.sqrt(a ** 3 / mu), h = P / steps, peri = [];
  let r1 = rp, r2 = rp, a1 = 0, a2 = 0;
  for (let it = 1; it <= Math.round(nOrb * steps) + 2; it++) {
    const k1 = f(y), k2 = f(y.map((x, j) => x + 0.5 * h * k1[j])), k3 = f(y.map((x, j) => x + 0.5 * h * k2[j])), k4 = f(y.map((x, j) => x + h * k3[j]));
    y = y.map((x, j) => x + h / 6 * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j]));
    const r = Math.hypot(y[0], y[1]);
    let ang = Math.atan2(y[1], y[0]);
    while (ang - a1 > Math.PI) ang -= 2 * Math.PI; while (ang - a1 < -Math.PI) ang += 2 * Math.PI;
    if (it >= 3 && r1 < r2 && r1 < r) { const den = r2 - 2 * r1 + r, fr = den !== 0 ? 0.5 * (r2 - r) / den : 0; peri.push({ t: (it - 1 + fr) * h, ang: a1 + 0.5 * fr * (ang - a2) + 0.5 * fr * fr * (ang - 2 * a1 + a2) }); }
    r2 = r1; r1 = r; a2 = a1; a1 = ang;
  }
  if (peri.length < 3) return null;
  const N = peri.length, xs = peri.map((z) => z.t), ys = [0]; let acc = 0, prev = peri[0].ang;
  for (let i = 1; i < N; i++) { let d = peri[i].ang - prev; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; acc += d; ys.push(acc); prev = peri[i].ang; }
  const mx = xs.reduce((s, x) => s + x, 0) / N, my = ys.reduce((s, x) => s + x, 0) / N;
  let sxy = 0, sxx = 0; for (let i = 0; i < N; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; }
  return { perOrbit: sxy / sxx * (xs[N - 1] - xs[0]) / (N - 1), nPeri: N };
}
/** 自己試験の表(誇張した係数 —— 一次の式との相対の差)。並進 n = 1, 2・回転 k = 3, 4 */
export function precessionSelfTest(o = {}) {
  const mu = 1, a = 1, steps = o.steps || 8000, nOrb = o.nOrb || 6, rows = [];
  for (const e of o.ecc || [0.05, 0.2056, 0.4]) {
    const p = a * (1 - e * e), base = rk4Precession({ mu, a, e, nOrb, steps });
    for (const cs of [{ key: 'n=1', b: 2e-6, n: 1 }, { key: 'n=2', b: 2e-6, n: 2 }, { key: 'k=3', c: 2e-7, k: 3 }, { key: 'k=4', c: 2e-7, k: 4 }]) {
      const pred = cs.b ? dPiTrans(cs.b, cs.n, p, e) : dPiRot(cs.c, cs.k, p, e, mu);
      const m = rk4Precession({ mu, a, e, b: cs.b || 0, n: cs.n || 2, c: cs.c || 0, k: cs.k || 4, nOrb, steps });
      const meas = m.perOrbit - base.perOrbit;
      rows.push({ e, key: cs.key, pred, meas, relDiff: Math.abs(meas - pred) / Math.abs(pred) });
    }
  }
  return { rows, maxRel: Math.max(...rows.map((r) => r.relDiff)) };
}

/* ───────── スクリーニング(列 —— 一度に 1 つだけ変える)───────── */
export const M_EARTH_REF = 5.9722e24;   // 列 D の基準の質量 m_ref(地球の質量 —— 絶対の R_d は √m_ref に比例・3 惑星の並びは m_ref に依らない)
export const COLUMNS = Object.freeze([
  Object.freeze({ key: 'K2', ja: '基準: 今の K2(一貫)', alpha: 2, gamma: 1, rotK: 4, change: 'なし(第311便d の新則)' }),
  Object.freeze({ key: 'K1', ja: '(A) 並進の重み K1(一貫 —— 自己・回転・軸も K1 の族)', alpha: 1, gamma: 1, rotK: 3, change: '源の重み・受け手の自己の場・回転の M・軸の amp を 1/r の族へ' }),
  Object.freeze({ key: 'rotB', ja: '(B) 回転の係数だけ r⁻³ → r⁻²', alpha: 2, gamma: 1, rotK: 3, rotLen: 'src', change: '回転の M2 × r/R_d,源(次元をそろえる基準の長さ = 源の R_d)—— 並進・軸は K2' }),
  Object.freeze({ key: 'axC', ja: '(C) 軸だけ', alpha: 2, gamma: 1, rotK: 4, axialOnly: true, change: '軸の ω の次数だけ(軸の ω は u に足さない —— 姿勢へ。近点への一次の効き 0)' }),
  Object.freeze({ key: 'massD', ja: '(D) 自己の場の質量の次数 γ = 0', alpha: 2, gamma: 0, rotK: 4, mRef: M_EARTH_REF, change: '受け手の自己の場 m K → m_ref K(今は γ = 1 —— β ∝ 1/m の因子は自己の場から既に入っている)' }),
]);
export const RATIOS = Object.freeze([
  Object.freeze({ key: 'RdR', ja: 'R_d/R', f: (z) => z.Rd / z.R }),
  Object.freeze({ key: 'Rdm', ja: 'R_d/m [m/kg]', f: (z) => z.Rd / z.m }),
  Object.freeze({ key: 'Rd2mp', ja: 'R_d²/(m p) [m/kg]', f: (z) => z.Rd * z.Rd / (z.m * z.p) }),
  Object.freeze({ key: 'Rd2p', ja: 'R_d²/p [m]', f: (z) => z.Rd * z.Rd / z.p }),
  Object.freeze({ key: 'Rd', ja: 'R_d [m]', f: (z) => z.Rd }),
]);
/** 規則(そろった量 → 外挿)。m = 受け手の質量・p = 軌道の半直弦・R = 観測半径 */
export const RULE_OF = Object.freeze({
  RdR: (k, b) => k * b.R, Rdm: (k, b) => k * b.m, Rd2mp: (k, b) => Math.sqrt(k * b.m * b.p), Rd2p: (k, b) => Math.sqrt(k * b.p), Rd: (k) => k,
});
export const ARCSEC = Math.PI / (180 * 3600);
export const CENTURY_S = 36525 * 86400;
/**
 * 1 惑星の列の R_d。pl = {key, m, R, p, e, P(s), mu, x(惑星 —— SI), star:{x, m, Rd, Om, a}, nOrb(単位), tD(″/世紀)}・col = COLUMNS の 1 つ・Rd0 = 試しの R_d。
 * β・回転は参照の受け手(t = 0 の配置・次数 order)で作り、一次の式の Δϖ(並進 + 回転)を t_D の 1 周期の分に合わせる(β・回転 ∝ R_d^α —— 固定点 2 回)。
 */
export function screenPlanet(pl, col, Rd0, o = {}) {
  const order = o.order || 8, target = pl.tD * ARCSEC * pl.P / CENTURY_S;
  const one = (Rd) => {
    const bodies = [{ x: pl.star.x, m: pl.star.m, Om: pl.star.Om, a: pl.star.a, parts: [{ kind: 'ball', m: pl.star.m, R: pl.star.Rd }] },
      { x: pl.x, m: pl.m, Om: 0, a: [0, 0, 1], parts: [{ kind: 'ball', m: pl.m, R: Rd }] }];
    const R = refReceiver(bodies, 1, { alpha: col.alpha, order, gamma: col.gamma, mRef: col.mRef, rotLen: col.rotLen, axial: false });
    const d = sub(pl.x, pl.star.x), r0 = norm(d), rh = scale(d, 1 / r0), ph = unit(cross(pl.nOrb, rh)), uphi = dot(R.uRot[0], ph);
    const beta = R.beta[0], b = beta * Math.pow(r0, col.alpha), c = (uphi / r0) * Math.pow(r0, col.rotK);
    const dT = dPiTrans(b, col.alpha, pl.p, pl.e), dR = dPiRot(c, col.rotK, pl.p, pl.e, pl.mu);
    return { Rd, beta, b, uphi, c, dT, dR, dPi: dT + dR };
  };
  let z = one(Rd0);
  const z1 = one(Rd0 * Math.pow(target / z.dPi, 1 / col.alpha)), Rd2 = z1.Rd * Math.pow(target / z1.dPi, 1 / col.alpha), z2 = one(Rd2);
  return { key: pl.key, col: col.key, Rd: Rd2, m: pl.m, R: pl.R, p: pl.p, e: pl.e, beta: z2.beta, b: z2.b, rotOverTrans: z2.dR / z2.dT, targetPerOrbit: target,
    fixRes: Math.abs(z2.dPi / target - 1), iter1: Math.abs(Rd2 / z1.Rd - 1), dTrans: z2.dT, dRot: z2.dR, withinCap: Rd2 <= Math.min(pl.R, CAP_M), withinR: Rd2 <= pl.R };
}
/** 列の表: 3 惑星の R_d と並び(最大/最小)・そろった量・外挿(rule の幾何平均で) */
export function alignOf(rows) {
  const out = {};
  for (const q of RATIOS) { const v = rows.map((z) => q.f(z)); out[q.key] = { values: v, spread: Math.max(...v) / Math.min(...v), gmean: Math.exp(v.reduce((s, x) => s + Math.log(x), 0) / v.length) }; }
  const cand = ['RdR', 'Rdm', 'Rd2mp', 'Rd2p', 'Rd'];
  let best = cand[0]; for (const k of cand) if (out[k].spread < out[best].spread) best = k;
  return { ratios: out, best, bestSpread: out[best].spread };
}
export function extrapolate(align, targets) {
  const k = align.ratios[align.best].gmean, f = RULE_OF[align.best];
  return targets.map((b) => { const Rd = f(k, b); return { key: b.key, ja: b.ja, around: b.around, Rd, R: b.R, m: b.m, p: b.p, RdOverR: Rd / b.R, withinR: Rd <= b.R, withinCap: Rd <= Math.min(b.R, CAP_M) }; });
}
