// 第320便c(原仮定者の指示(第122報)・決断事項 AN472「中心１体の影響が大きいが、銀河の渦の中では半渦度は無視出来ない。太陽系近傍においては合成された影響になる」・
// AN473・統括の検証項目 R264): **太陽系近傍の銀河の軸の源の合成の純関数**(html を読まない —— エンジンの値〔太陽 → 天体の軸の ω〕は器 tests/exp-w320c-nbcompose.mjs が
// 読み口で取って引数で渡す。器と QA が使う)。
//
// ■ 何をするか(エンジン・在位の本・受け手の R_d = Y_k m・規則は変えない —— 第319便b の宣言の模型〔円盤 4 + バルジ・平均の流れ V(R) = V0 tanh(R/R_t)〕の写しの外の計算)
//   ① 座標の補正: 共動系(受け手の速さ V_ref 一定)の u_Co = u_GC − β V_ref から ω_Co = ω_GC − ½ ∇β × V_ref(ω = ½ ∇ × u —— 半渦度)。勾配の行列の差
//      G_GC − G_Co = V_ref ⊗ ∇β(階数 1)から ∇β を取り出して ω_GC へ戻す(gradBetaOf・sourceCurlOf)。
//   ② 源の流れの半渦度の連続の値(環の積分): 軸対称の質量流 J = ρ v φ̂ の u = (10G_0/c_0²) ∫ J/|x − x′| dV′ の z 成分の回転は、部分積分で
//      (∇ × u)_z(x) = (10G_0/c_0²) ∫ ζ(x′)/|x − x′| dV′、ζ = (1/a) ∂_a(a ρ v)(質量流の渦度 —— 打ち切りの縁 a = R_max の面の項を含む)。方位の積分は閉じた式
//      ∫ dφ′/|x − x′| = 4K(m)/√((a + R)² + z′² + ε²)(K は第一種の完全楕円積分・m = 4aR/((a + R)² + z′² + ε²) —— ε は軟化の幅・ε = 0 が軟化なし)。動径と鉛直は適応の
//      Gauss–Kronrod(G7–K15)。β も同じ核(質量の密度)・∂_R β は 4 次の中心差分。照合の別経路: u_φ の環の積分(1/R)∂_R(R u_φ) の中心差分(部分積分を使わない)。
//   ③ 点のセルの和(第319便b の格子の型 —— 円盤: 動径 Gauss–Legendre × 方位 × 鉛直の分位点)の感度: 軟化の幅 ε・近傍のセルの局所の分割(セルの中を s³ の小点へ ——
//      質量は真の密度で配りセルの質量に規格化)・格子の細かさ。
//   ④ 中心と残余の重ならない分割: 円筒半径 R_cut の内側(+ バルジ)を中心・外側を残余に。中心の J(枝 b の J と同じ定義 —— J = ∫ ρ (x × v) dV)と J 双極子の場・
//      解像した内側の場(縁 R_cut の面の項を含む —— 内側 + 残余 = 全場)・双極子近似の誤差・中心の強さの倍率 λ_c の掃引。
//   ⑤ 有限の分布の型(同じ総 J): 一様な剛体の球・中心に集中した球・殻ごとの差動回転 —— 球対称の殻の閉じた式
//      w_z(r) = (10G_0/c_0²)(4π/3)[∫_r^∞ ρΩ r′ dr′ − (1/(2r³)) ∫_0^r ρΩ r′⁴ dr′](赤道面 —— 内側は J 双極子の −、外側の殻は +)。
//   ⑥ 合成: ω_nb = λ_c ω_center + κ_v ω_½curl(κ_v は宣言する対応 —— 導いた法則ではない)・つなぐ対応の候補(bevel の主項と半渦度は同じベクトル演算ではない)・
//      120° の合成の一般形(第319便b の composeOf)で減速と拮抗を合成の後の向きで読む。
//
// ■ 言わないこと: 半渦度を今の軸引きずり ω_G と同じ量と書かない(移送場の診断量)・半渦度を受け手の軸へ直結する項をエンジンに足さない(新しい法則になる)・
//   中心 1 体の値を「銀河の引きずり」と呼ばない・M_G = V0²R0/G_0 は全体の有効中心質量(実在の中心単体ではない)・格子の差は「格子の感度」(収束の判定に使わない)・
//   文献の値は「文献の値(本便は一次資料に当たっていない)」。
import { G0, C0, KPC, MSUN, AU, YEAR, MW, FLOW, gl01, zQuant, vFlow, composeOf, angDeg, nrm, dot, cross, add3, scl3, relDiff } from './lib-w319b-srcradius.mjs';
export { G0, C0, KPC, MSUN, AU, YEAR, MW, FLOW, composeOf, angDeg, nrm, dot, cross, add3, scl3, relDiff };
export const LIB_VERSION = 'w320c-nbcompose-lib-1';

/* ───────── 宣言(走行の前に置く —— 結果を見て変えない)───────── */
/** 弱い場の係数 10G_0/c_0² [m/kg](β = coef m/d)と J 双極子の係数 K = 5G_0/c_0²(u = K (J × x)/r³) */
export const COEF = 10 * G0 / (C0 * C0);
export const KDIP = 5 * G0 / (C0 * C0);
export const DECL = Object.freeze({
  /** 軟化の幅 [kpc](0 は軟化なし) */
  epsKpc: Object.freeze([0, 0.01, 0.03, 0.1, 0.3, 1]),
  /** 近傍のセルの局所の分割(セルの中心が太陽から D_loc [kpc] の内のセルを s × s × s の小点へ) */
  splitDlocKpc: 1, splitS: Object.freeze([1, 2, 4, 8]),
  /** 中心と残余の境の円筒半径 R_cut [kpc] */
  rCutKpc: Object.freeze([0.5, 1, 2, 3, 4, 5, 6, 7]),
  /** 中心の強さの倍率 λ_c(模型の中心の J に掛ける —— 0 は中心なし) */
  lambdaC: Object.freeze([0, 0.1, 0.5, 1, 2, 10, 100]),
  /** κ_v(半渦度を軸の ω へつなぐ宣言の対応 —— 0 は中心だけ・1 は診断) */
  kappaV: Object.freeze([0, 1]),
  /** 有限の分布の型の大きさ [kpc](一様な球の半径・集中した球の尺度) */
  sphereRKpc: Object.freeze([5, 8.2, 9, 11.2159, 20, 40]),
  concScaleKpc: Object.freeze([0.5, 1, 2, 4, 8]),
  /** 環の積分の許容(相対)・中心差分の幅 [kpc] */
  quadRel: 1e-11, fdKpc: 0.02 });

/* ───────── 第一種・第二種の完全楕円積分(算術幾何平均 —— 補の母数 mc = 1 − m を直に受けて m → 1 の桁落ちを避ける)───────── */
export function ellipKE(mc) {
  let a = 1, b = Math.sqrt(mc), sum = 0.5 * (1 - mc), p2 = 0.5;
  for (let i = 0; i < 60; i++) {
    const an = 0.5 * (a + b), cn = 0.5 * (a - b);
    b = Math.sqrt(a * b); a = an; p2 *= 2; sum += p2 * cn * cn;
    if (Math.abs(cn) <= 1e-17 * a) break;
  }
  const K = Math.PI / (2 * a);
  return { K, E: K * (1 - sum) };
}
/** 環の核 P = ∫_0^{2π} dφ/√(a² + R² − 2aR cos φ + s2)(s2 = z² + ε²)= 4K(m)/√((a + R)² + s2) [1/長さ] */
export function ringP(a, R, s2) {
  const den = (a + R) * (a + R) + s2, mc = ((a - R) * (a - R) + s2) / den;
  return 4 * ellipKE(mc).K / Math.sqrt(den);
}
/** 環の核 Q = ∫_0^{2π} cos φ dφ/√(…) = (4/(k√(aR)))[(1 − m/2)K − E](m が小さいときは級数 —— 桁落ちを避ける) */
export function ringQ(a, R, s2) {
  if (!(a > 0 && R > 0)) return 0;
  const den = (a + R) * (a + R) + s2, m = 4 * a * R / den, mc = ((a - R) * (a - R) + s2) / den;
  if (m < 0.05) {
    // (1 − m/2)K − E = (π/2) Σ_n mⁿ [c_n·2n/(2n − 1) − c_{n−1}/2]、c_n = ((2n − 1)!!/(2n)!!)²
    let s = 0, cPrev = 0.25, mn = m;   // n = 1 の項は 0
    for (let n = 2; n < 60; n++) { mn *= m; const r = (2 * n - 1) / (2 * n), c = cPrev * r * r, t = mn * (c * 2 * n / (2 * n - 1) - cPrev / 2); s += t; cPrev = c; if (Math.abs(t) <= 1e-18 * Math.abs(s)) break; }
    return 4 / (Math.sqrt(m) * Math.sqrt(a * R)) * (Math.PI / 2) * s;
  }
  const ke = ellipKE(mc);
  return 4 / (Math.sqrt(m) * Math.sqrt(a * R)) * ((1 - m / 2) * ke.K - ke.E);
}

/* ───────── 適応の Gauss–Kronrod(G7–K15)───────── */
const XGK = [0.991455371120812639206854697526329, 0.949107912342758524526189684047851, 0.864864423359769072789712788640926, 0.741531185599394439863864773280788,
  0.586087235467691130294144845693013, 0.405845151377397166906606412076961, 0.207784955007898467600689403773245, 0];
const WGK = [0.022935322010529224963732008058970, 0.063092092629978553290700663189204, 0.104790010322250183839876322541518, 0.140653259715525918745189590510238,
  0.169004726639267902826583426598550, 0.190350578064785409913256402421014, 0.204432940075298892414161999234649, 0.209482141084727828012999174891714];
const WG7 = [0.129484966168869693270611432679082, 0.279705391489276667901467771423780, 0.381830050505118944950369775488975, 0.417959183673469387755102040816327];
function gk15(f, lo, hi) {
  const c = 0.5 * (lo + hi), h = 0.5 * (hi - lo), fc = f(c);
  let k = fc * WGK[7], g = fc * WG7[3], ak = Math.abs(fc) * WGK[7];
  for (let j = 0; j < 7; j++) {
    const x = h * XGK[j], f1 = f(c - x), f2 = f(c + x);
    k += WGK[j] * (f1 + f2); ak += WGK[j] * (Math.abs(f1) + Math.abs(f2));
    if (j % 2 === 1) g += WG7[(j - 1) / 2] * (f1 + f2);
  }
  return { v: k * h, err: Math.abs((k - g) * h), abs: ak * Math.abs(h) };
}
/**
 * ∫_lo^hi f(x) dx(区切り brk を端に置く)。全体の誤差が rel × ∫|f| を下回るまで誤差の大きい区間を二分(QUADPACK の QAG の型)。
 * 戻り値 { v, err, abs, n(区間の数), ok }
 */
export function integrate(f, lo, hi, o = {}) {
  const rel = o.rel || 1e-11, maxN = o.maxN || 4000, absTol = o.abs || 0;
  const pts = [lo].concat((o.brk || []).filter((x) => x > lo && x < hi).sort((p, q) => p - q), [hi]);
  const segs = [];
  for (let i = 0; i + 1 < pts.length; i++) { const r = gk15(f, pts[i], pts[i + 1]); segs.push({ lo: pts[i], hi: pts[i + 1], ...r }); }
  const tot = () => { let v = 0, e = 0, a = 0; for (const s of segs) { v += s.v; e += s.err; a += s.abs; } return { v, e, a }; };
  let t = tot();
  while (t.e > Math.max(rel * t.a, absTol) && segs.length < maxN) {
    let wi = 0; for (let i = 1; i < segs.length; i++) if (segs[i].err > segs[wi].err) wi = i;
    const s = segs[wi], m = 0.5 * (s.lo + s.hi);
    if (!(m > s.lo && m < s.hi)) break;
    const r1 = gk15(f, s.lo, m), r2 = gk15(f, m, s.hi);
    segs.splice(wi, 1, { lo: s.lo, hi: m, ...r1 }, { lo: m, hi: s.hi, ...r2 });
    t = tot();
  }
  return { v: t.v, err: t.e, abs: t.a, n: segs.length, ok: t.e <= Math.max(rel * t.a, absTol) };
}

/* ───────── 宣言の模型(第319便b の MW・FLOW —— 面密度 [M☉/kpc²]・長さ [kpc]・速さ [m/s])───────── */
export const sigOf = (D, a) => D.S0 * Math.exp(-a / D.Rd - (D.Rm > 0 ? D.Rm / a : 0));
export const dSigOf = (D, a) => sigOf(D, a) * (-1 / D.Rd + (D.Rm > 0 ? D.Rm / (a * a) : 0));
/** 鉛直の密度の形 [1/kpc](exp: e^(−|z|/z_d)/(2z_d)・sech2: sech²(z/(2z_d))/(4z_d) —— 第319便b の zQuant と同じ分布) */
export const hOf = (D, z) => { const q = Math.abs(z); if (D.vert === 'exp') return Math.exp(-q / D.zd) / (2 * D.zd); const c = Math.cosh(q / (2 * D.zd)); return 1 / (4 * D.zd * c * c); };
export const vOf = (a) => vFlow(a);
export const dvOf = (a) => { const c = Math.cosh(a / FLOW.RtKpc); return FLOW.V0 / (FLOW.RtKpc * c * c); };
/** ∂_a(a Σ v)(解析の微分 [M☉/kpc² · m/s]) */
export const gOf = (D, a) => { const s = sigOf(D, a), v = vOf(a); return s * v + a * dSigOf(D, a) * v + a * s * dvOf(a); };
/** バルジの密度 [M☉/kpc³](r′ = √(R² + (z/q)²)) */
export const rhoBulge = (rp) => { const B = MW.bulge; return B.rho0 * Math.pow(1 + rp / B.r0, -B.alpha) * Math.exp(-(rp / B.rcut) * (rp / B.rcut)); };
const ZTOP = 40;   // 鉛直の打ち切り(z_d の 40 倍 —— e^(−40))

/* ───────── 環の積分(連続の値)───────── */
/** 円盤 D の面上の点 (R, 0, 0) の z の内積分 ∫ 2h(z′) F(a, z′) dz′(F は a と s2 の核)の外積分(a ∈ [aLo, aHi]) */
function diskDouble(D, R, aLo, aHi, wOf, eps2, rel) {
  const zmax = ZTOP * D.zd, zbrk = [D.zd * 0.01, D.zd * 0.1, D.zd, 5 * D.zd];
  const inner = (zp) => {
    const s2 = zp * zp + eps2, w = Math.max(zp, 1e-6);
    const brk = [R - 10 * w, R - w, R, R + w, R + 10 * w];
    return 2 * hOf(D, zp) * integrate((a) => wOf(a) * ringP(a, R, s2), aLo, aHi, { brk, rel: rel * 0.1 }).v;
  };
  return integrate(inner, 0, zmax, { brk: zbrk, rel });
}
/**
 * 源の流れの半渦度の z 成分(銀河中心系)[1/s] —— 円盤 D の a ∈ [aLo, aHi] の部分(縁の面の項: 内側の縁 aLo > 0 で +aLo Σ v・外側の縁 aHi で −aHi Σ v)。
 * eps は軟化の幅 [kpc]。部分積分の形(質量流の渦度 ζ の環の積分)。
 */
export function ringCurlZ(D, aLo, aHi, o = {}) {
  const R = o.RKpc || FLOW.R0kpc, eps2 = (o.epsKpc || 0) * (o.epsKpc || 0), rel = o.rel || DECL.quadRel;
  const body = diskDouble(D, R, aLo, aHi, (a) => gOf(D, a), eps2, rel);
  const sheet = (a0) => integrate((zp) => 2 * hOf(D, zp) * ringP(a0, R, zp * zp + eps2), 0, ZTOP * D.zd, { brk: [D.zd * 0.01, D.zd * 0.1, D.zd, 5 * D.zd], rel }).v;
  const sLo = aLo > 0 ? aLo * sigOf(D, aLo) * vOf(aLo) * sheet(aLo) : 0, sHi = aHi * sigOf(D, aHi) * vOf(aHi) * sheet(aHi);
  const I = body.v + sLo - sHi;   // [M☉/kpc² · m/s]
  return { omegaZ: 0.5 * COEF * MSUN / (KPC * KPC) * I, body: body.v, sheetLo: sLo, sheetHi: sHi, quadErr: body.err, quadOk: body.ok, n: body.n };
}
/** 円盤 D の β(面上の点 R —— 無次元) */
export function ringBetaDisk(D, aLo, aHi, RKpc, epsKpc = 0, rel = DECL.quadRel) {
  const r = diskDouble(D, RKpc, aLo, aHi, (a) => a * sigOf(D, a), epsKpc * epsKpc, rel);
  return COEF * MSUN / KPC * r.v;
}
/** 円盤 D の u_φ(面上の点 R)[m/s] —— 照合の別経路(部分積分を使わない) */
export function ringUphiDisk(D, aLo, aHi, RKpc, epsKpc = 0, rel = DECL.quadRel) {
  const zmax = ZTOP * D.zd, eps2 = epsKpc * epsKpc;
  const inner = (zp) => { const s2 = zp * zp + eps2, w = Math.max(zp, 1e-6); return 2 * hOf(D, zp) * integrate((a) => a * sigOf(D, a) * vOf(a) * ringQ(a, RKpc, s2), aLo, aHi, { brk: [RKpc - 10 * w, RKpc - w, RKpc, RKpc + w, RKpc + 10 * w], rel: rel * 0.1 }).v; };
  return COEF * MSUN / KPC * integrate(inner, 0, zmax, { brk: [D.zd * 0.01, D.zd * 0.1, D.zd, 5 * D.zd], rel }).v;
}
/** バルジの β(面上の点 R —— 静止の宣言なので流れの項は 0) */
export function ringBetaBulge(RKpc, epsKpc = 0, rel = DECL.quadRel) {
  const B = MW.bulge, rmax = MW.bulgeRmaxKpc, eps2 = epsKpc * epsKpc;
  const inner = (rp) => integrate((mu) => { const st = Math.sqrt(Math.max(0, 1 - mu * mu)), zz = B.q * rp * mu; return ringP(rp * st, RKpc, zz * zz + eps2); }, -1, 1, { brk: [0], rel: rel * 0.1 }).v * rhoBulge(rp) * B.q * rp * rp;
  return COEF * MSUN / KPC * integrate(inner, 0, rmax, { brk: [B.r0, B.rcut, 2 * B.rcut], rel }).v;
}
/** 4 次の中心差分 f′(x) ≈ [f(x − 2δ) − 8f(x − δ) + 8f(x + δ) − f(x + 2δ)]/(12δ) */
export function d4(f, x, dlt) { return (f(x - 2 * dlt) - 8 * f(x - dlt) + 8 * f(x + dlt) - f(x + 2 * dlt)) / (12 * dlt); }
/** ∂_R β [1/m](円盤 D の部分 —— 中心差分) */
export function ringGradBetaDisk(D, aLo, aHi, o = {}) {
  const R = o.RKpc || FLOW.R0kpc, e = o.epsKpc || 0, dl = o.fdKpc || DECL.fdKpc, rel = o.rel || DECL.quadRel;
  return d4((x) => ringBetaDisk(D, aLo, aHi, x, e, rel), R, dl) / KPC;
}
export function ringGradBetaBulge(o = {}) {
  const R = o.RKpc || FLOW.R0kpc, e = o.epsKpc || 0, dl = o.fdKpc || DECL.fdKpc, rel = o.rel || DECL.quadRel;
  return d4((x) => ringBetaBulge(x, e, rel), R, dl) / KPC;
}
/** 照合の別経路: ω_GC,z = ½ (1/R) ∂_R (R u_φ)(中心差分) */
export function ringCurlZviaA(D, aLo, aHi, o = {}) {
  const R = o.RKpc || FLOW.R0kpc, e = o.epsKpc || 0, dl = o.fdKpc || DECL.fdKpc, rel = o.rel || DECL.quadRel;
  return 0.5 * d4((x) => x * ringUphiDisk(D, aLo, aHi, x, e, rel), R, dl) / (R * KPC);
}
/** 円盤 D の a ∈ [aLo, aHi] の角運動量 J_z [kg m²/s]・質量 [kg]・慣性モーメント ∫ρR² [kg m²](z について積分済み) */
export function diskJ(D, aLo, aHi, rel = 1e-12) {
  const J = integrate((a) => 2 * Math.PI * a * a * sigOf(D, a) * vOf(a), aLo, aHi, { brk: [1, 4, 8], rel }).v * MSUN * KPC;
  const M = integrate((a) => 2 * Math.PI * a * sigOf(D, a), aLo, aHi, { brk: [1, 4, 8], rel }).v * MSUN;
  const I = integrate((a) => 2 * Math.PI * a * a * a * sigOf(D, a), aLo, aHi, { brk: [1, 4, 8], rel }).v * MSUN * KPC * KPC;
  return { J, M, I };
}
export function bulgeMass(rel = 1e-12) {
  const B = MW.bulge;
  return integrate((rp) => 4 * Math.PI * B.q * rp * rp * rhoBulge(rp), 0, MW.bulgeRmaxKpc, { brk: [B.r0, B.rcut, 2 * B.rcut], rel }).v * MSUN;
}

/* ───────── 座標の補正(①)───────── */
/** G_GC − G_Co = V_ref ⊗ ∇β(階数 1)から ∇β を最小二乗で(∇β_c = Σ_a V_a (G_GC − G_Co)[a][c]/|V|²)と階数 1 の残り(相対) */
export function gradBetaOf(GGC, GCo, Vref) {
  const V2 = dot(Vref, Vref), g = [0, 0, 0];
  for (let c = 0; c < 3; c++) for (let a = 0; a < 3; a++) g[c] += Vref[a] * (GGC[a][c] - GCo[a][c]) / V2;
  let res = 0, sc = 0;
  for (let a = 0; a < 3; a++) for (let c = 0; c < 3; c++) { const d = GGC[a][c] - GCo[a][c]; res = Math.max(res, Math.abs(d - Vref[a] * g[c])); sc = Math.max(sc, Math.abs(d)); }
  return { gradBeta: g, rank1Rel: sc > 0 ? res / sc : 0 };
}
/** ω_GC = ω_Co + ½ ∇β × V_ref(V_ref は一様 —— 回る座標や場所で変わる V_ref には別の項が要る) */
export function sourceCurlOf(wCo, gradBeta, Vref) { const c = cross(gradBeta, Vref); return [wCo[0] + 0.5 * c[0], wCo[1] + 0.5 * c[1], wCo[2] + 0.5 * c[2]]; }
/** ベクトルの差の大きさ(尺度のベクトル s の大きさで割る —— 小さい成分の相対で割らない) */
export const vecRelOf = (a, b, s) => { const d = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]), q = nrm(s); return q > 0 ? d / q : d; };
/** 受け手の動きの項 −½ ∇β × V_ref(ω_Co = ω_GC + この項) */
export function observerCurlOf(gradBeta, Vref) { return scl3(cross(gradBeta, Vref), -0.5); }

/* ───────── 点のセルの和(③ —— 格子の感度)───────── */
/**
 * 円盤 D の格子 g の点のセルの和(太陽 (R0, 0, 0)・軟化 ε [kpc]・近傍のセルの局所の分割 {dlocKpc, s})。
 * 戻り値: β・∂_x β [1/m]・ω_GC,z・ω_Co,z [1/s]・質量 [kg]・分割したセルの数。s = 1・ε = 0 は第319便b の diskAccum と同じ点(演算の順は違う —— 相対 1e-12 の内で照合)。
 */
export function diskCells(D, g, o = {}) {
  const R0 = FLOW.R0kpc, R0m = R0 * KPC, V0 = FLOW.V0, Rmax = MW.RmaxKpc, Q = gl01(g.nr), dph = 2 * Math.PI / g.np, e2 = Math.pow((o.epsKpc || 0) * KPC, 2);
  const s = o.s || 1, dloc = (o.dlocKpc || 0) * KPC, edges = new Float64Array(g.nr + 1);
  for (let a = 0; a < g.nr; a++) edges[a + 1] = edges[a] + Q.w[a];
  let beta = 0, gx = 0, wgc = 0, wco = 0, m = 0, nSplit = 0;
  const add = (mk, x, y, z, vx, vy) => {
    const dx = R0m - x, dy = -y, d2 = dx * dx + dy * dy + z * z + e2, b = COEF * mk / Math.sqrt(d2), q = -b / d2;
    beta += b; gx += q * dx; wgc += 0.5 * q * (vy * dx - vx * dy); wco += 0.5 * q * ((vy - V0) * dx - vx * dy); m += mk;
  };
  for (let a = 0; a < g.nr; a++) {
    const Rk = Rmax * Q.x[a], wr = Rmax * Q.w[a], mRing = sigOf(D, Rk) * Rk * wr * dph / g.nz * MSUN, v = vOf(Rk);
    for (let b = 0; b < g.np; b++) {
      const ph = (b + 0.5) * dph, c = Math.cos(ph), sn = Math.sin(ph), x = Rk * c * KPC, y = Rk * sn * KPC, vx = -v * sn, vy = v * c;
      for (let k = 0; k < g.nz; k++) {
        const zk = zQuant((k + 0.5) / g.nz, D.zd, D.vert) * KPC;
        if (s > 1 && Math.hypot(R0m - x, y, zk) < dloc) {
          // セルの中を s × s × s の小点へ(動径はセルの区間 [Σ_{b<a} w_b, Σ_{b≤a} w_b]·R_max を等分・質量は Σ(R)R の重み・方位は等分・鉛直は分位点の区間を等分)
          nSplit++;
          const rLo = Rmax * edges[a], rHi = Rmax * edges[a + 1], wts = [], rs = [];
          let wsum = 0; for (let i = 0; i < s; i++) { const r = rLo + (i + 0.5) * (rHi - rLo) / s, w = sigOf(D, r) * r; rs.push(r); wts.push(w); wsum += w; }
          for (let i = 0; i < s; i++) {
            const r = rs[i], vr = vOf(r), mi = mRing * wts[i] / wsum / (s * s);
            for (let j = 0; j < s; j++) {
              const pj = (b + (j + 0.5) / s) * dph, cj = Math.cos(pj), sj = Math.sin(pj);
              for (let l = 0; l < s; l++) { const zl = zQuant((k + (l + 0.5) / s) / g.nz, D.zd, D.vert) * KPC; add(mi, r * cj * KPC, r * sj * KPC, zl, -vr * sj, vr * cj); }
            }
          }
        } else add(mRing, x, y, zk, vx, vy);
      }
    }
  }
  return { beta, gx, wgc, wco, mKg: m, nSplit };
}
/** バルジの点のセルの和(第319便b の bulgeAccum と同じ点 —— 静止なので β と ∂_x β だけ) */
export function bulgeCells(g, o = {}) {
  const B = MW.bulge, R0m = FLOW.R0kpc * KPC, rmax = MW.bulgeRmaxKpc, Gr = gl01(g.br), Gm = gl01(g.bm), dph = 2 * Math.PI / g.bp, e2 = Math.pow((o.epsKpc || 0) * KPC, 2);
  let beta = 0, gx = 0, m = 0;
  for (let a = 0; a < g.br; a++) {
    const s = Gr.x[a], rp = rmax * s * s, drp = 2 * rmax * s * Gr.w[a], rho = rhoBulge(rp);
    for (let c = 0; c < g.bm; c++) {
      const mu = 2 * Gm.x[c] - 1, wmu = 2 * Gm.w[c], st = Math.sqrt(Math.max(0, 1 - mu * mu)), mCell = rho * B.q * rp * rp * drp * wmu * dph * MSUN;
      for (let b = 0; b < g.bp; b++) {
        const ph = (b + 0.5) * dph, x = rp * st * Math.cos(ph) * KPC, y = rp * st * Math.sin(ph) * KPC, z = B.q * rp * mu * KPC, dx = R0m - x, d2 = dx * dx + y * y + z * z + e2, bb = COEF * mCell / Math.sqrt(d2);
        beta += bb; gx += -bb * dx / d2; m += mCell;
      }
    }
  }
  return { beta, gx, mKg: m };
}

/* ───────── 有限の分布の型(⑤ —— 球対称の殻の閉じた式)───────── */
/**
 * 球対称の密度 ρ(r) と殻ごとの角速度 Ω(r)(ẑ の向き)の赤道面の点 r の半渦度 w_z と J。rho・Om は r [m] の関数(ρ [kg/m³]・Ω [1/s])・rMax [m]。
 * w_z(r) = COEF (4π/3)[∫_r^{rMax} ρΩ r′ dr′ − (1/(2r³)) ∫_0^r ρΩ r′⁴ dr′]・J = (8π/3) ∫ ρΩ r′⁴ dr′
 * (導出: u = COEF ∫ ρ v/|x − x′| dV′ の l = 1 の項 —— u = COEF f(r)(Ω̂ × x)・f(r) = (4π/3)[r⁻³ ∫_0^r ρΩ r′⁴ + ∫_r^∞ ρΩ r′]・赤道面の ½(∇ × u)_z = COEF(f + r f′/2))
 */
export function shellCurl(rho, Om, r, rMax, rel = 1e-12) {
  const f4 = (q) => rho(q) * Om(q) * q * q * q * q, f1 = (q) => rho(q) * Om(q) * q;
  const I4in = integrate(f4, 0, Math.min(r, rMax), { rel }).v, I1out = r < rMax ? integrate(f1, r, rMax, { rel }).v : 0, I4all = integrate(f4, 0, rMax, { rel }).v;
  return { wz: COEF * (4 * Math.PI / 3) * (I1out - I4in / (2 * r * r * r)), J: (8 * Math.PI / 3) * I4all, inner: -COEF * (4 * Math.PI / 3) * I4in / (2 * r * r * r), outer: COEF * (4 * Math.PI / 3) * I1out };
}
/** 一様な剛体の球(半径 R・角運動量 J —— ẑ)の赤道面の点 r の半渦度(閉じた式: 外 −(K/2)J/r³・内 K(5/(2R³) − 3r²/R⁵)J —— r/R = √(5/6) で 0) */
export function uniformSphereCurl(J, R, r) { return r >= R ? -0.5 * KDIP * J / (r * r * r) : KDIP * J * (2.5 / (R * R * R) - 3 * r * r / Math.pow(R, 5)); }
/** J 双極子の半渦度のベクトル (K/2)(3(J·n̂)n̂ − J)/r³ と、今の bevel の軸の主項 coef J_d sinθ (2μn̂ − â)/r³(J_d = (2/5) M R_src² Ω —— 第319便b の galAxialLead の主項を J_d で書いたもの) */
export function dipoleHalfCurl(Jvec, x) { const r = nrm(x), n = scl3(x, 1 / r), jn = dot(Jvec, n); return [0, 1, 2].map((i) => 0.5 * KDIP * (3 * jn * n[i] - Jvec[i]) / (r * r * r)); }
export function bevelLead(Jd, ahat, x) { const r = nrm(x), n = scl3(x, 1 / r), mu = dot(n, ahat), sn = nrm(cross(ahat, n)), amp = COEF * Jd * sn / (r * r * r); return [0, 1, 2].map((i) => amp * (2 * mu * n[i] - ahat[i])); }

/* ───────── 重ならない成分の和(⑥)───────── */
/**
 * 成分の持ち主の宣言 { comp: 'disk:thin' | 'bulge' | …, lo, hi }(円筒半径の区間 [lo, hi) kpc —— lo = 0・hi = Infinity は全部)。代理 'galaxy:proxy' は全成分を持つ。
 * 同じ成分の区間が正の長さで重なる、または代理と他の成分を同時に持つ和は拒否(RangeError)。戻り値は ω の和と内訳。
 */
export const ALL_COMPS = Object.freeze(['disk:thin', 'disk:thick', 'disk:HI', 'disk:H2', 'bulge']);
export function combineDisjoint(terms) {
  if (!Array.isArray(terms) || !terms.length) throw new RangeError('項が無い');
  const owned = [];
  for (const t of terms) {
    if (!(Array.isArray(t.omega) && t.omega.length === 3 && t.omega.every(Number.isFinite)) || !Array.isArray(t.owns) || !t.owns.length) throw new RangeError('項の宣言(omega・owns)');
    for (const o of t.owns) {
      const list = o.comp === 'galaxy:proxy' ? ALL_COMPS.map((c) => ({ comp: c, lo: 0, hi: Infinity })) : [{ comp: o.comp, lo: o.lo === undefined ? 0 : o.lo, hi: o.hi === undefined ? Infinity : o.hi }];
      for (const q of list) {
        if (!ALL_COMPS.includes(q.comp) || !(q.hi > q.lo)) throw new RangeError('成分の宣言: ' + q.comp);
        for (const p of owned) if (p.comp === q.comp && Math.min(p.hi, q.hi) > Math.max(p.lo, q.lo)) throw new RangeError('重なる成分: ' + q.comp + ' [' + q.lo + ', ' + q.hi + ') と [' + p.lo + ', ' + p.hi + ')(' + p.by + ' と ' + t.key + ')');
        owned.push(Object.assign({ by: t.key }, q));
      }
    }
  }
  const omega = [0, 0, 0]; for (const t of terms) for (let i = 0; i < 3; i++) omega[i] += t.omega[i];
  return { omega, parts: terms.map((t) => ({ key: t.key, omega: t.omega.slice() })), owned };
}
/** 6 天体の判定(自転のベクトル Om・太陽の項 wSun・銀河の項 wGal): 一般形の減速(第319便b の composeOf)・拮抗(太陽と銀河の減速/加速が逆)・合成の後の減速 */
export function judgeOf(Om, wSun, wGal) {
  const cS = composeOf(Om, wSun), cG = nrm(wGal) > 0 ? composeOf(Om, wGal) : null, cT = composeOf(Om, add3(wSun, wGal));
  return { sunDecel: cS.decel, galDecel: cG ? cG.decel : null, sumDecel: cT.decel, antag: cG ? cS.decel !== cG.decel : null, angOmGal: cG ? cG.thetaDeg : null, galOverSun: nrm(wGal) / nrm(wSun),
    dMagSum: cT.dMag, dMagSun: cS.dMag, flipBySum: cT.decel !== cS.decel };
}
