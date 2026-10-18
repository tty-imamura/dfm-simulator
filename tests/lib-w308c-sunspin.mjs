// 第308便c(原仮定者の裁定(第102報)②「太陽の観測値の自転と、要求される慣性自転との乖離が大きい可能性が有る。つまり、銀河全体の慣性自転に由来する
// 引きずり軸回転の比率が大きい」・①「引きずりの計算は相互に行われているので、反作用を返すと二重計上にならないかを確認する」・原仮定者の裁定(第101報)
// (C) のエネルギーの出所は太陽の慣性自転・軸引きずりは「軸方向に対する角度差の 2 倍で傾いた軸」・決断事項 AN355・AN348・統括の検証項目 R216)——
// **要求される太陽の慣性自転・銀河を源とする引きずり軸回転・相互の引きずりの二重計上・収縮の参照の純関数**(Node だけ・html を読まない・エンジンの式ではない)。
//
// ■ 回転引きずりの尺度(源 j の宣言半径の一様球の体積平均 —— 今のエンジンの M1 の定義・ε = 0・受け手の中心の点の分母)
//     u(d) = f(r) (Ω_j × d)・f = m_j M1(r) / (r · den(r))・den = W_bg + q/r² + m_j/r³(対ごとの分母 —— q = c²/(2kG)・λ ∝ m)
//     g(r) = f r = |u|/(|Ω_j| sinθ)(受け手の位置の回転引きずりの速さ / (|Ω| sinθ))
//   M1 は外部の級数(r > R_d —— M1 = (3R_d²/r⁴) Σ_j z^j/(2j+5)・dM1/dr = −(3R_d²/r⁵) Σ_j (4+2j) z^j/(2j+5)・z = (R_d/r)² —— 項は相対 1e-18 まで)。
//   差分の数値微分を使わない(遠方の桁落ちを避ける)。器は第307便a の直接の求積(sourceM1)と照合する。
// ■ 鏡映の核(第101報 —— 決断事項 AN346 の "bevel" の参照の式。エンジンの枝の実装には依存しない)
//     ω_D = A · amp · sinθ · [2 r̂(r̂·Ω_j) − Ω_j]・sinθ = |Ω̂_j × r̂|(sinθ は「仰角が上がると回転引きずりが弱まる」を具体化した仮定)
//     amp の規格化 2 通り: 差分の型 amp = |dg/dr|(受け手の近い側と遠い側の速さの差 / 直径)・速さの型 amp = g/r = f(比較)。A = 1。
//   比較の curl の核: ½∇×(f Ω × d) = (f/2)[(2 − q)Ω + q r̂(r̂·Ω)]・q = −d ln f/d ln r。
// ■ エネルギーの条件 R1(等しく反対のトルク —— 受け手へ τ・源へ −τ): P_pair = τ·(Ω_i − Ω_s) ≤ 0(源の自転が受け手を「追い越す」向き —— 散逸的)。
//   潮汐のブレーキ brake = τ_tide·â_i を打ち消す平行のトルク τ = −brake â_i で: (τ·â_s) Ω_s ≥ τ·Ω_i → Ω_s の向きつきの限界は ω_i/(â_i·â_s)(ブレーキの大きさに依らない)。
// ■ 散逸の結合 R2(候補 —— 導出ではない): s = Ω_i − 𝔅Ω_s・τ_i = −Γ s・τ_s = 𝔅ᵀΓ s(仕事 −Γ|s|² ≤ 0・𝔅 ≠ 1 なら τ_i + τ_s ≠ 0 —— 角運動量の受け皿が要る)。
//   受け手の軸へ射影: s∥ = ω_i − βΩ_s(β = â_i·𝔅â_s —— 鏡映の核の A = 1 の値)。−Γ s∥ = −brake から sign(s∥) = sign(brake)。限界(Γ → ∞)は Ω_s = ω_i/β。
// ■ 収縮: L 一定で I が減れば Ω と回転のエネルギー L²/(2I) が増える(L は作らない)。遠方の回転引きずりの先頭 ∝ m R_d² Ω —— 同じ半径なら L/α。
// ■ 言わないこと: 「銀河の自転で太陽の自転を説明した」「太陽の自転を分解した」「金星の逆行を説明した」「帳簿が完全に閉じた」(器は要る量と見積もりの表まで)。
export const LIB_VERSION = 'w308c-sunspin-lib-1';
import { sphereRule as sphereRuleA, ballRadial } from './lib-w307a-sphereaxial.mjs';

export const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const scale = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
export const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const norm = (a) => Math.sqrt(dot(a, a));
export const unit = (a) => scale(a, 1 / norm(a));
export const D2R = Math.PI / 180;
const finite3 = (a) => Array.isArray(a) && a.length === 3 && a.every(Number.isFinite);
const pos = (x) => Number.isFinite(x) && x > 0;

/* ───────────── 一様球の M1 の外部級数(ε = 0・r > R_d) ───────────── */
/** M1(r) と dM1/dr(同じ級数から)。terms は使った項の数(相対 1e-18 まで —— r/R_d → 1 で増える・上限 20000)。 */
export function ballM1Series(r, R) {
  if (!pos(r) || !pos(R) || !(r > R)) throw new Error('外部の級数の定義域(r > R_d > 0・ε = 0)');
  const z = (R / r) * (R / r);
  let zk = 1, s = 0, t = 0, k = 0;
  for (; k < 20000; k++) {
    const a = zk / (2 * k + 5);
    s += a; t += (4 + 2 * k) * a;
    if ((4 + 2 * k) * a < 1e-18 * t) { k++; break; }
    zk *= z;
  }
  const c = 3 * z / (r * r);
  return { M: c * s, dM: -c * t / r, terms: k };
}
/** 対ごとの分母(受け手の中心 —— ε = 0)と r の微分。extra は行の分母の対照(他の源の I + D —— 受け手の位置で一定とみなす)。 */
export function pairDen(r, src) {
  const W = src.W || 0, q = src.q, m = src.m, extra = src.extra || 0;
  if (!pos(r) || !(q >= 0) || !(m > 0) || !(W >= 0) || !(extra >= 0)) throw new Error('分母の定義域');
  const r2 = r * r, r3 = r2 * r;
  return { den: W + q / r2 + m / r3 + extra, dden: -2 * q / r3 - 3 * m / (r3 * r), I: q / r2, D: m / r3 };
}
/** 回転引きずりの尺度: f(速さの型 = g/r)・g = f r・dg/dr・差分の型 |dg/dr|・q = −d ln f/d ln r。src = {m, R, q, W, extra?} */
export function dragScale(r, src) {
  const { M, dM, terms } = ballM1Series(r, src.R), dn = pairDen(r, src);
  const g = src.m * M / dn.den, dg = src.m * (dM * dn.den - M * dn.dden) / (dn.den * dn.den);
  const f = g / r, qEff = 1 - r * dg / g;
  return { f, g, dg, speed: f, diff: Math.abs(dg), qEff, den: dn.den, I: dn.I, D: dn.D, M, terms };
}
/** 規格化の振幅(norm: 'diff' = |dg/dr| —— 既定の候補・'speed' = g/r)。 */
export function ampOf(sc, normKind) { if (normKind === 'diff') return sc.diff; if (normKind === 'speed') return sc.speed; throw new Error('規格化の型'); }

/* ───────────── 核 ───────────── */
/** 鏡映 2 r̂(r̂·Ω) − Ω(長さを保つ —— 源の軸からの角 θ に対して 2θ 傾く) */
export function reflect(rh, Om) { return sub(scale(rh, 2 * dot(rh, Om)), Om); }
/** 鏡映の核の点の値: A·amp·sinθ·reflect(r̂, Ω)(d は源から受け手・Ω は源の自転ベクトル〔符号つき〕) */
export function bevelAt(d, Om, amp, A = 1) {
  if (!finite3(d) || !finite3(Om) || !(norm(d) > 0) || !Number.isFinite(amp) || amp < 0 || !Number.isFinite(A)) throw new Error('鏡映の核の定義域');
  const w = norm(Om);
  if (w === 0 || amp === 0 || A === 0) return [0, 0, 0];
  const rh = unit(d), sinT = norm(cross(Om, rh)) / w;
  return scale(reflect(rh, Om), A * amp * sinT);
}
/** curl の核(遠方の型): (f/2)[(2 − q)Ω + q r̂(r̂·Ω)]·A */
export function curlAt(d, Om, f, q, A = 1) {
  const rh = unit(d);
  return scale(add(scale(Om, 2 - q), scale(rh, q * dot(rh, Om))), A * f / 2);
}
/** 核の選択: o = {model:'bevel'|'curl', norm:'diff'|'speed', A, rowFactor(行の尺度 —— 中心の分母の比 den_pair/den_row)} */
export function axialAt(d, Om, src, o) {
  const sc = dragScale(norm(d), src), A = (o.A === undefined ? 1 : o.A) * (o.rowFactor === undefined ? 1 : o.rowFactor);
  if (o.model === 'curl') return curlAt(d, Om, sc.f, sc.qEff, A);
  return bevelAt(d, Om, ampOf(sc, o.norm), A);
}
/** 鏡映の核の 3×3 の写像(源の軸の向き â_s を固定 —— sinθ は向きで決まる): ω_D = 𝔅 Ω_s(Ω_s ∥ â_s) */
export function bevelMatrix(d, axisS, amp, A = 1) {
  const rh = unit(d), a = unit(axisS), sinT = norm(cross(a, rh)), k = A * amp * sinT;
  return [0, 1, 2].map((i) => [0, 1, 2].map((j) => k * (2 * rh[i] * rh[j] - (i === j ? 1 : 0))));
}
export const matVec = (M, v) => M.map((row) => row[0] * v[0] + row[1] * v[1] + row[2] * v[2]);
export const matTVec = (M, v) => [0, 1, 2].map((j) => M[0][j] * v[0] + M[1][j] * v[1] + M[2][j] * v[2]);
/** 角速度の場の体積平均(受け手の一様球 —— 重み 3t² dt dΩ/4π。剛体の射影の係数 5/(2R²) は掛けない)。第307便a の求積の点。 */
export function volumeMean(center, R, field, order = 12) {
  if (!finite3(center) || !(R >= 0)) throw new Error('受け手の定義域');
  if (R === 0) return field(center);
  let out = [0, 0, 0];
  for (const a of ballRadial(order)) for (const b of sphereRuleA(order)) out = add(out, scale(field(add(center, scale(b.s, R * a.t))), a.w * b.w));
  return out;
}

/* ───────────── 天球の向き ───────────── */
/** 赤経・赤緯 [度] の単位ベクトル(赤道座標) */
export function radec(aDeg, dDeg) { const a = aDeg * D2R, d = dDeg * D2R; return [Math.cos(d) * Math.cos(a), Math.cos(d) * Math.sin(a), Math.sin(d)]; }
/** 赤道 → 黄道(傾斜 εDeg —— x は春分点で共通) */
export function eqToEcl(v, epsDeg) { const e = epsDeg * D2R, c = Math.cos(e), s = Math.sin(e); return [v[0], c * v[1] + s * v[2], -s * v[1] + c * v[2]]; }
/** 傾き(z 軸から)と方位(x 軸から)[度] —— 本の spinAxis の tiltDeg・azimuthDeg と同じ定義 */
export function tiltAz(v) { const u = unit(v); let az = Math.atan2(u[1], u[0]) / D2R; if (az < 0) az += 360; return { tiltDeg: Math.acos(Math.max(-1, Math.min(1, u[2]))) / D2R, azimuthDeg: az }; }
export function angleDeg(a, b) { return Math.acos(Math.max(-1, Math.min(1, dot(unit(a), unit(b))))) / D2R; }

/* ───────────── R1・R2 ───────────── */
/** 等しく反対のトルク τ(受け手へ)と −τ(源へ)の仕事率: recv = τ·Ω_i・src = −τ·Ω_s・pair = 和 = τ·(Ω_i − Ω_s)(正なら別のエネルギーが要る) */
export function pairPower(tau, OmI, OmS) { const recv = dot(tau, OmI), src = -dot(tau, OmS); return { recv, src, pair: recv + src }; }
/** R1: 平行のトルク τ = −brake â_i で P_pair ≤ 0 となる Ω_s(â_s の向きの符号つき)の限界。sense 'ge'(Ω_s ≥ bound)/'le'(≤)/'any'/'none'。 */
export function r1Bound(brake, omegaI, ai, as) {
  if (![brake, omegaI].every(Number.isFinite)) throw new Error('R1 の定義域');
  const c = -brake * dot(ai, as), rhs = -brake * omegaI;
  if (brake === 0) return { sense: 'any', bound: null, coef: c };
  if (c === 0) return { sense: rhs <= 0 ? 'any' : 'none', bound: null, coef: c };
  return { sense: c > 0 ? 'ge' : 'le', bound: rhs / c, coef: c };
}
/** R2: 散逸の結合の平行の滑り s∥ = ω_i − βΩ_s・sign(s∥) = sign(brake) の限界(Γ → ∞)。β = 0 なら 'none'(結合なし)。 */
export function r2Bound(brake, omegaI, beta) {
  if (![brake, omegaI, beta].every(Number.isFinite)) throw new Error('R2 の定義域');
  if (beta === 0) return { sense: 'none', bound: null };
  if (brake === 0) return { sense: 'eq', bound: omegaI / beta };
  // brake < 0: βΩ ≥ ω_i ・ brake > 0: βΩ ≤ ω_i
  const ge = (brake < 0) === (beta > 0);
  return { sense: ge ? 'ge' : 'le', bound: omegaI / beta };
}
/** 限界 b を満たすか(x が sense の側) */
export function satisfies(x, b) {
  if (b.sense === 'any') return true;
  if (b.sense === 'none') return false;
  if (b.sense === 'ge') return x >= b.bound;
  if (b.sense === 'le') return x <= b.bound;
  return x === b.bound;
}
/** 複数の限界の共通部分(ge の最大・le の最小)—— feasible が偽なら共通の解なし */
export function intersect(list) {
  let lo = -Infinity, hi = Infinity, loBy = null, hiBy = null, none = [];
  for (const { key, b } of list) {
    if (b.sense === 'ge' && b.bound > lo) { lo = b.bound; loBy = key; }
    else if (b.sense === 'le' && b.bound < hi) { hi = b.bound; hiBy = key; }
    else if (b.sense === 'none') none.push(key);
  }
  return { lo, hi, loBy, hiBy, none, feasible: none.length === 0 && lo <= hi };
}
/** 表面の速さ: v = R|Ω|・光速との比・破断の速さ √(GM/R) との比 */
export function surface(R, Om, GM, c) { const v = R * Math.abs(Om), vb = Math.sqrt(GM / R); return { v, vOverC: v / c, vOverBreak: v / vb, vBreak: vb, omegaBreak: vb / R }; }

/* ───────────── 散逸の結合(𝔅)と相互の駆動の方式 ───────────── */
/** s = Ω_i − 𝔅Ω_s・τ_i = −Γ s・τ_s = 𝔅ᵀΓ s(Γ はスカラー)—— 仕事 −Γ|s|² と角運動量の残り τ_i + τ_s */
export function dissipativePair(OmI, OmS, B, Gamma) {
  const s = sub(OmI, matVec(B, OmS)), tauI = scale(s, -Gamma), tauS = matTVec(B, scale(s, Gamma));
  return { s, tauI, tauS, power: dot(tauI, OmI) + dot(tauS, OmS), dissipation: -Gamma * dot(s, s), dL: add(tauI, tauS) };
}
/**
 * 相互の駆動の方式(第102報 ① の参照)。(C) の候補の応答則: 受け手 i へ T(i←j) = (I_i/τ_C)(â_i·D(i←j)) â_i(平行な分 —— 仕事をする分)。
 * p = {Ii, Ij, ai, aj, Oi(ベクトル), Oj, Dij(i の位置の j による ω_D), Dji, Bij(i ← j の 3×3), tauC}
 * (a) 相互・反作用なし (b) 相互 + 反作用 (c1) 片向き i ← j + 反作用 (c2) 対ごとに 1 回の散逸の結合(平行の滑り s∥ = â_i·(Ω_i − 𝔅_ij Ω_j)・Γ = I_i/τ_C)
 */
export function mutualSchemes(p) {
  const tc = p.tauC || 1;
  const Tij = scale(p.ai, p.Ii / tc * dot(p.ai, p.Dij)), Tji = scale(p.aj, p.Ij / tc * dot(p.aj, p.Dji));
  const tot = (ti, tj) => ({ ti, tj, tiPar: dot(ti, p.ai), tjPar: dot(tj, p.aj), dL: add(ti, tj), dLnorm: norm(add(ti, tj)), power: dot(ti, p.Oi) + dot(tj, p.Oj) });
  const a = tot(Tij, Tji), b = tot(sub(Tij, Tji), sub(Tji, Tij)), c1 = tot(Tij, scale(Tij, -1)), c1r = tot(scale(Tji, -1), Tji);
  const G = p.Ii / tc, sPar = dot(p.ai, sub(p.Oi, matVec(p.Bij, p.Oj))), ti2 = scale(p.ai, -G * sPar), tj2 = matTVec(p.Bij, scale(p.ai, G * sPar));
  const c2 = tot(ti2, tj2); c2.dissipation = -G * sPar * sPar; c2.sPar = sPar;
  // (b) = (c1 i←j) + (c1 j←i) —— 恒等式の残り(浮動小数)
  const bSum = Math.max(norm(sub(b.ti, add(c1.ti, c1r.ti))), norm(sub(b.tj, add(c1.tj, c1r.tj)))) / Math.max(norm(Tij) + norm(Tji), 1e-300);
  // ρ: j の軸へ射影した「j が i から受ける駆動」/「i が j から受ける駆動の反作用」
  const rhoT = dot(Tji, p.aj) / dot(scale(Tij, -1), p.aj);
  // 対称な積 κ: I_i·(â_i·D(i←j))/(â_i·Ω̂_j の核の単位) —— 呼び手が別に比べる
  return { Tij, Tji, TijPar: dot(Tij, p.ai), TjiPar: dot(Tji, p.aj), rhoT, rhoOmega: dot(p.Dji, p.aj) / -dot(p.Dij, p.ai), a, b, c1, c1r, c2, bIsSumOfOneWay: bSum };
}

/* ───────────── 有限のキック・収縮 ───────────── */
/** 有限の角運動量のキック δJ(受け手 +δJ・源 −δJ —— 球対称・固定の I)の厳密な回転のエネルギーの増分。requiredOther = 和(正なら別のエネルギーが要る) */
export function reactionKick(Ji, Ii, Js, Is, dJ) {
  if (![Ji, Js, dJ].every(finite3) || !pos(Ii) || !pos(Is)) throw new Error('キックの定義域');
  const dKi = (dot(Ji, dJ) + dot(dJ, dJ) / 2) / Ii, dKs = (-dot(Js, dJ) + dot(dJ, dJ) / 2) / Is;
  return { Ji: add(Ji, dJ), Js: sub(Js, dJ), dKi, dKs, requiredOther: dKi + dKs };
}
/** I を変える(外からの角運動量 ext を足せる)—— L・Ω・回転のエネルギーの変化 */
export function changeInertia(L, I0, I1, ext = 0) {
  if (![L, ext].every(Number.isFinite) || !pos(I0) || !pos(I1)) throw new Error('慣性の定義域');
  const L1 = L + ext;
  return { L: L1, omega: L1 / I1, E0: L * L / (2 * I0), E1: L1 * L1 / (2 * I1), dE: L1 * L1 / (2 * I1) - L * L / (2 * I0) };
}
/** 遠方の回転引きずりの強さ(受け手の位置の速さの係数 g·Ω = m M1 Ω / den の分子): S = m M1(r; R_d) Ω */
export function dragStrength(r, m, Rd, Om) { return m * ballM1Series(r, Rd).M * Om; }

/* ───────────── 純関数の確かめ(合成の配置 —— 器が正本に記録し、QA が同じ関数で引き直す) ───────────── */
export function checksOf(sourceM1) {
  const g = {}, v = {};
  const rel = (a, b) => Math.abs(a - b) / Math.max(Math.abs(b), 1e-300);
  const relv = (a, b) => norm(sub(a, b)) / Math.max(norm(b), 1e-300);
  // ① 外部の級数と第307便a の直接の求積(ε = 0)・遠方の先頭 (3/5)R²/r⁴・導関数の 5 点差分
  v.seriesVsQuad = [1.5, 2, 4, 8, 100].map((x) => rel(ballM1Series(x, 1).M, sourceM1(x, 1, 'ball', { nS: 48, nR: 48 })));
  v.seriesFar = rel(ballM1Series(1e5, 1).M, 0.6 / 1e20);
  v.seriesDeriv = [1.5, 5, 50].map((x) => { const h = x * 1e-4, F = (y) => ballM1Series(y, 1).M; return rel((F(x - 2 * h) - 8 * F(x - h) + 8 * F(x + h) - F(x + 2 * h)) / (12 * h), ballM1Series(x, 1).dM); });
  g.series = v.seriesVsQuad.every((x) => x < 1e-9) && v.seriesFar < 1e-9 && v.seriesDeriv.every((x) => x < 1e-8);
  // ② 鏡映: 長さを保つ・赤道で逆・45° で源の軸への射影 0(ベクトルは横向きに 1/√2 の強さ)・軸上 0・自転の反転で反転・回転の共変
  const ez = [0, 0, 1], at = (el) => [Math.cos(el * D2R), 0, Math.sin(el * D2R)];
  v.bevelEq = bevelAt(at(0), ez, 1); v.bevel45 = bevelAt(at(45), ez, 1); v.bevelPole = bevelAt(ez, ez, 1);
  v.bevelElev = [0, 15, 30, 45, 60, 75].map((el) => { const w = bevelAt(at(el), ez, 1); return { el, amp: norm(w), proj: w[2], axisAngle: angleDeg(w, ez) }; });
  const Rm = (x) => [x[1], x[2], x[0]], d0 = [2, 1, 4], o0 = [0.3, -0.8, 1.1];
  v.bevelCovariant = relv(bevelAt(Rm(d0), Rm(o0), 0.7), Rm(bevelAt(d0, o0, 0.7)));
  v.bevelOdd = norm(add(bevelAt(d0, o0, 0.7), bevelAt(d0, scale(o0, -1), 0.7)));
  v.bevelSouth = relv(bevelAt(scale(d0, -1), o0, 0.7), bevelAt(d0, o0, 0.7));   // r̂ → −r̂ で同じ(南北の対称)
  g.bevel = relv(v.bevelEq, [0, 0, -1]) < 1e-15 && Math.abs(v.bevel45[2]) < 1e-15 && Math.abs(norm(v.bevel45) - Math.SQRT1_2) < 1e-15 && norm(v.bevelPole) === 0
    && v.bevelElev.every((x) => Math.abs(x.amp - Math.cos(x.el * D2R)) < 1e-14 && Math.abs(x.axisAngle - (180 - 2 * x.el)) < 1e-6)
    && v.bevelCovariant < 1e-14 && v.bevelOdd < 1e-15 && v.bevelSouth < 1e-15
    && Math.abs(norm(reflect(unit(d0), o0)) - norm(o0)) < 1e-15;
  // ③ 行列の写像 = 点の値(源の軸の向きを固定)
  const Bm = bevelMatrix(d0, o0, 0.7), wv = matVec(Bm, o0);
  v.matrixVsPoint = relv(wv, bevelAt(d0, o0, 0.7));
  g.matrix = v.matrixVsPoint < 1e-14;
  // ④ curl の核: 赤道で (f/2)(2 − q)・q = 3 で源の軸への射影が 0 の仰角 35.264°・q = 4 で向きが鏡映と同じ
  const m0 = 1 / Math.sqrt(3), c35 = curlAt([Math.sqrt(1 - m0 * m0), 0, m0], ez, 1, 3);
  v.curlNull = c35[2]; v.curlQ4 = relv(unit(curlAt(d0, o0, 1, 4)), unit(reflect(unit(d0), o0)));
  g.curl = Math.abs(v.curlNull) < 1e-15 && v.curlQ4 < 1e-14 && Math.abs(curlAt([1, 0, 0], ez, 2, 3)[2] + 1) < 1e-15;
  // ⑤ 尺度: 慣性決定力が分母を支配する遠方で q ≈ 3・差分の型 / 速さの型 ≈ 2(q − 1)
  const sc = dragScale(1e4, { m: 1, R: 1, q: 1e6, W: 0 });
  v.qI = sc.qEff; v.diffOverSpeed = sc.diff / sc.speed;
  const sb = dragScale(1e4, { m: 1e-30, R: 1, q: 1e-30, W: 1 });
  v.qW = sb.qEff;
  g.scale = Math.abs(v.qI - 3) < 1e-6 && Math.abs(v.diffOverSpeed - 2) < 1e-6 && Math.abs(v.qW - 5) < 1e-6;
  // ⑥ 体積平均: 一定の場は不変・二次の場 c² + R²/5・小さい受け手で中心の値に近付く
  v.volConst = relv(volumeMean([1, 2, 3], 0.4, () => [2, -1, 3], 10), [2, -1, 3]);
  const vq = volumeMean([1, 2, 3], 0.4, (p) => p.map((x) => x * x), 12);
  v.volQuad = Math.max(...[1, 2, 3].map((c, i) => rel(vq[i], c * c + 0.16 / 5)));
  g.volume = v.volConst < 1e-14 && v.volQuad < 1e-13;
  // ⑦ R1: 限界でちょうど P_pair = 0・内側で ≤ 0・外側で > 0(向きつき)
  const ai = unit([0.1, 0.05, 1]), as = unit([0, 0.12, 1]), wI = 3;
  const chk = (brake) => { const b = r1Bound(brake, wI, ai, as), tau = scale(ai, -brake), P = (W) => pairPower(tau, scale(ai, wI), scale(as, W)).pair, d = b.sense === 'ge' ? 1 : -1;
    return { b, at: P(b.bound) / Math.abs(dot(tau, scale(ai, wI))), inside: P(b.bound + d * 0.5), outside: P(b.bound - d * 0.5) }; };
  v.r1 = [chk(-2), chk(2)];
  g.r1 = v.r1.every((x) => Math.abs(x.at) < 1e-14 && x.inside <= 0 && x.outside > 0) && v.r1[0].b.sense === 'ge' && v.r1[1].b.sense === 'le';
  // ⑧ R2: 散逸の結合は仕事 ≤ 0・限界で s∥ = 0・ブレーキを打ち消す向き(Γ 有限で限界の外側)
  const Bt = bevelMatrix([1, 0.02, 0.01], [0, 0, 1], 0.3), dp = dissipativePair([0.1, 0.2, 1.3], [0, 0, 2], Bt, 0.7);
  v.dissPower = dp.power - dp.dissipation; v.dissSign = dp.dissipation;
  const beta = dot([0, 0, 1], matVec(Bt, [0, 0, 1])), r2 = r2Bound(-0.4, 1.3, beta), Gm = 5, Om2 = r2.bound + (r2.sense === 'ge' ? 1 : -1) * 0.4 / (Gm * Math.abs(beta));
  v.r2Balance = (-Gm * (1.3 - beta * Om2)) / 0.4 - 1;   // −Γ s∥ = −brake(= +0.4)
  g.r2 = Math.abs(v.dissPower) < 1e-15 && v.dissSign <= 0 && Math.abs(v.r2Balance) < 1e-12 && r2.sense === (beta < 0 ? 'le' : 'ge');
  // ⑨ 相互の駆動: (b) = (c1 i←j) + (c1 j←i)・対称な二体で等しい自転なら (b) は 0・(c2) の仕事 ≤ 0
  const Om = 0.9, ax = [0, 0, 1], dd = [1, 0, 0], Bij = bevelMatrix(dd, ax, 0.2), Bji = bevelMatrix(scale(dd, -1), ax, 0.2);
  const ms = mutualSchemes({ Ii: 2, Ij: 2, ai: ax, aj: ax, Oi: scale(ax, Om), Oj: scale(ax, Om), Dij: matVec(Bij, scale(ax, Om)), Dji: matVec(Bji, scale(ax, Om)), Bij, tauC: 1 });
  v.symB = norm(ms.b.ti) + norm(ms.b.tj); v.symSum = ms.bIsSumOfOneWay; v.symC2 = ms.c2.dissipation;
  const ms2 = mutualSchemes({ Ii: 2, Ij: 2, ai: ax, aj: ax, Oi: scale(ax, Om), Oj: scale(ax, 2 * Om), Dij: matVec(Bij, scale(ax, 2 * Om)), Dji: matVec(Bji, scale(ax, Om)), Bij, tauC: 1 });
  v.gearBPower = ms2.b.power; v.gearBExpect = 2 * 0.2 * Om * Om;   // κ(Ω_i − Ω_j)² —— κ = I·amp = 0.4
  g.mutual = v.symB === 0 && v.symSum < 1e-15 && v.symC2 <= 0 && Math.abs(v.gearBPower / v.gearBExpect - 1) < 1e-14 && ms2.b.dLnorm === 0 && ms2.c2.dissipation <= 0;
  // ⑩ キックの厳密な増分・収縮(L 一定で Ω と E が増える)・同じ半径なら遠方の強さは L に比例
  const kk = reactionKick([2, 1, 4], 2, [-1, 3, 2], 7, [0.1, -0.2, 0.3]), E = (a, I) => dot(a, a) / (2 * I);
  v.kick = Math.abs(kk.requiredOther - (E(kk.Ji, 2) + E(kk.Js, 7) - E([2, 1, 4], 2) - E([-1, 3, 2], 7)));
  const c1 = changeInertia(8, 4, 2), c2 = changeInertia(8, 4, 3, -2);
  v.contract = [c1.L, c1.omega, c1.E0, c1.E1, c2.L, c2.omega, c2.E1];
  v.strengthL = dragStrength(1e4, 1, 0.5, 4) / dragStrength(1e4, 1, 1, 1);
  g.ledger = v.kick < 1e-14 && JSON.stringify(v.contract) === JSON.stringify([8, 4, 8, 16, 6, 2, 6]) && Math.abs(v.strengthL - (1 - 15 / 28 * 1e-8)) < 1e-15;
  // ⑪ 向き: 黄道の傾斜 0 で恒等・赤経/赤緯の単位ベクトル
  v.radec = relv(radec(90, 0), [0, 1, 0]) + relv(eqToEcl([0.3, 0.4, 0.5], 0), [0.3, 0.4, 0.5]);
  g.frames = v.radec < 1e-15 && Math.abs(tiltAz([1, 0, 1]).tiltDeg - 45) < 1e-12;
  return { gates: g, values: v };
}
