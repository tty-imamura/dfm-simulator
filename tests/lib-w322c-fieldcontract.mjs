// 第322便c(統括の検証項目 R272 —— 決断事項 AN501・AN511・AN512 の材料・策定の段 S2 の geoPN=4 の場の契約): **外部場の輸送の力学の契約の導出と散逸のグループの集計の純関数**
// (html を読まない・状態を持たない —— 器 tests/exp-w322c-fieldcontract.mjs と QA が使う。エンジン・在位の本・`S._core` は変えない)。
//
// ■ 何をするか
//   (1) 規定された外部の流れの場 u(x, t)(場の API の形 —— u[3]・gradU[9](行優先 ∂u_a/∂x_b)・dUdt[3] | null —— 第321便c の sample と同じ欄)の解析の 6 場面:
//       零場・定常(3D の差動回転 u_φ = U0 tanh(R/R_t) sech²(z/z_h) —— 鉛直に依る)・一様流・剛体回転 Ω × x・せん断 (0, γ x, 0)・非定常の一様流 U(t) = Û A cos(νt)(dUdt の欄の試験)。
//   (2) 試験粒子(単位の質量)を同じ初期の状態 (x0, v0) と同じ中心の引力 Φ = −GM/√(r² + ε²) で、次の 5 つの型で進める:
//       K   今の v−u 輸送(第321便a の純関数 transportDelta3 をそのまま —— 2D/3D の `S._core` の geoPN=2 の枝の写し)を外部場で: semi の相(重力のキック → 輸送 Δu =
//           (u − u_prev) − ((v−u)·∇)u dt + (∇×u) × (v − k_F u) dt・Δv = k_F Δu → ドリフト x += v dt)・初回は蹴らず履歴だけ。状態の v は ẋ(ドリフトは v だけ)
//       Kc  K の連続の極限(ẋ = v・v̇ = −∇Φ + k_F[∂_t u + (u·∇)u + (∇×u) × (v − k_F u)] —— ∂_t u を明示に使う)
//       P   正準の型(H = ½|p|² + p·u + Φ・ẋ = p + u・ṗ = −∇Φ − (∇u)ᵀp)で、初期の p0 = v0 − u(x0)(状態の v を ẋ と読む)
//       Pl  同じ正準の型で、初期の p0 = v0(状態の v を p と読む —— 「S.v を無条件に p と見なす」型)
//       A   位置に u を足すだけ(ẋ = v + u・v̇ = −∇Φ —— 輸送の力を持たない)
//       連続の型は RK4(細かい刻み —— 参照)・K は本体と同じ一次の陽解法(h・h/2・h/4 で刻みの感度診断)。
//   (3) 台帳(単位の質量あたり): ニュートンのエネルギー E_N = ½|ẋ|² + Φ・場の仕事 W_f = ∫ ẋ·a_f dt(a_f = ẍ + ∇Φ —— K は 1 步ごとの ½|v + Δv_f|² − ½|v|²)・
//       正準のエネルギー H = ½|p|² + p·u + Φ = ½|ẋ|² − ½|u|² + Φ(p = ẋ − u)と ∫ p·∂_t u dt・運動学の角運動量 L = x × ẋ と場のトルクの供給 ∫ x × a_f dt・
//       正準の角運動量 L_can = x × p・場の力積の供給 ∫ a_f dt。**規定の場は反作用を受けない** —— 場が粒子へ渡したエネルギー・角運動量・運動量は場を保つ外の仕手が供給する
//       (W_f・∫ x × a_f・∫ a_f がその供給の欄)。
//   (4) 散逸のグループ(AN511): 源の宣言(第321便c の sourceState)の項をグループの宣言で 1 つの項へ併合(groupStateOf —— 成分ごとの区間の和を正準化)して場を 1 回作る
//       (同じグループの ω を先に合成してから熱を 1 回 —— AN506)。銀河全体を 1 グループにすると R_cut に依らず fullState() と同じ宣言になる(ビット)。
//
// ■ 言わないこと: 外部場の輸送をエンジンに入れたと書かない(器の純関数だけ)・k_F を較正の係数と呼ばない・規定の流れの場を源の自己無撞着の解と呼ばない・
//   正準の型の H を「保存した」と書くのは定常の宣言の場だけ(非定常は dH/dt = p·∂_t u の台帳)・dUdt = null を 0 と読まない(拒否)・回転曲線の予言と呼ばない・
//   単位は無次元の器の単位(GM = 1・軌道の半径 ~1 —— 実在の系の値ではない)。
import { transportDelta3, rigidJ } from './lib-w321a-geo2v3.mjs';
import { ALL_COMPS } from './lib-w320c-nbcompose.mjs';
export const LIB_VERSION = 'w322c-fieldcontract-lib-1';
/** 接続の鍵の案の版(受理済みの鍵ではない —— 器の宣言) */
export const CONTRACT_DRAFT_VERSION = 'w322c-galaxyField-draft-1';

/* ───────── 小道具 ───────── */
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const scl = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
const nrm = (a) => Math.hypot(a[0], a[1], a[2]);
/** G·w(行優先 —— (∇u) w = (w の向きの微分)ではなく G_ab w_b) */
const mG = (G, w) => [G[0] * w[0] + G[1] * w[1] + G[2] * w[2], G[3] * w[0] + G[4] * w[1] + G[5] * w[2], G[6] * w[0] + G[7] * w[1] + G[8] * w[2]];
/** Gᵀ·w((∇u)ᵀ p —— 成分 a は Σ_b ∂_a u_b p_b) */
const mGT = (G, w) => [G[0] * w[0] + G[3] * w[1] + G[6] * w[2], G[1] * w[0] + G[4] * w[1] + G[7] * w[2], G[2] * w[0] + G[5] * w[1] + G[8] * w[2]];
const curlG = (G) => [G[7] - G[5], G[2] - G[6], G[3] - G[1]];
export { dot, cross, add, sub, scl, nrm };

/* ───────── 宣言(走行の前に置く —— 結果を見て変えない)───────── */
export const DECL = Object.freeze({
  /** 中心の引力(無次元 —— GM = 1・軟化 ε) */
  GM: 1, eps: 0.05,
  /** 試験粒子の初期の状態(やや離心・傾いた軌道 —— 周期 ≈ 2π) */
  x0: Object.freeze([1, 0, 0.15]), v0: Object.freeze([0.05, 0.95, 0.08]),
  /** 走行の時間(≈ 4 公転)・本体の型の刻み h(と h/2・h/4)・連続の型の参照の刻み */
  tEnd: 25.12, h: 0.01, hRef: 0.001,
  /** k_F ≠ 1 の列の値と長い走行の倍率 */
  kFHalf: 0.5, longMul: 4,
  /** 場の大きさ(軌道の速さ ~1 の 1 割程度 —— 輸送のクランプ |Δu| ≤ 0.8 に掛からない) */
  steady: Object.freeze({ U0: 0.15, Rt: 0.6, zh: 0.4 }), uniform: Object.freeze([0.12, -0.05, 0.03]), rigid: Object.freeze([0, 0, 0.12]), shear: 0.12,
  unsteady: Object.freeze({ A: 0.12, nu: 0.37, dir: Object.freeze([0.6, 0.8, 0]) }),
  /** k_F ≠ 1 の余りの力の閉じた路(子午面 φ = 0 の長方形 —— R ∈ [R1, R2]・z ∈ [z1, z2])と Gauss–Legendre の点の数 */
  circuit: Object.freeze({ R1: 0.7, R2: 1.3, z1: 0, z2: 0.4, n: 24 }),
});

/* ───────── 外部の流れの場(場の API の形)───────── */
const Z9 = Object.freeze([0, 0, 0, 0, 0, 0, 0, 0, 0]);
/** 場の宣言の一覧(key・ja・stationary・axisym〔z 軸まわりの軸対称〕・at(x, t) → { u, G, dUdt | null }) */
export function fieldsOf(D = DECL) {
  const { U0, Rt, zh } = D.steady, Om = D.rigid.slice(), U = D.uniform.slice(), gam = D.shear, US = D.unsteady;
  const sech2 = (q) => { const c = Math.cosh(q); return 1 / (c * c); };
  const steadyAt = (x) => {
    const R = Math.hypot(x[0], x[1]), z = x[2], th = Math.tanh(R / Rt), s2z = sech2(z / zh), f = U0 * th * s2z;
    const fR = U0 * sech2(R / Rt) / Rt * s2z, fz = -2 * U0 * th * s2z * Math.tanh(z / zh) / zh, g = f / R, gR = (fR - g) / R, gz = fz / R;
    return { u: [-x[1] * g, x[0] * g, 0], G: [-x[1] * gR * x[0] / R, -g - x[1] * gR * x[1] / R, -x[1] * gz, g + x[0] * gR * x[0] / R, x[0] * gR * x[1] / R, x[0] * gz, 0, 0, 0], dUdt: [0, 0, 0] };
  };
  return [
    { key: 'zero', ja: '零場(u = 0)', stationary: true, axisym: true, at: () => ({ u: [0, 0, 0], G: Z9.slice(), dUdt: [0, 0, 0] }) },
    { key: 'steady', ja: '定常(3D の差動回転 u_φ = U0 tanh(R/R_t) sech²(z/z_h))', stationary: true, axisym: true, at: steadyAt },
    { key: 'uniform', ja: '一様流(u = U —— 一定)', stationary: true, axisym: false, at: () => ({ u: U.slice(), G: Z9.slice(), dUdt: [0, 0, 0] }) },
    { key: 'rigid', ja: '剛体回転(u = Ω × x・Ω ∥ ẑ)', stationary: true, axisym: true, at: (x) => ({ u: cross(Om, x), G: rigidJ(Om), dUdt: [0, 0, 0] }) },
    { key: 'shear', ja: 'せん断(u = (0, γ x, 0))', stationary: true, axisym: false, at: (x) => ({ u: [0, gam * x[0], 0], G: [0, 0, 0, gam, 0, 0, 0, 0, 0], dUdt: [0, 0, 0] }) },
    { key: 'unsteady', ja: '非定常の一様流(u = Û A cos(νt) —— dUdt の欄)', stationary: false, axisym: false,
      at: (x, t) => ({ u: scl(US.dir, US.A * Math.cos(US.nu * t)), G: Z9.slice(), dUdt: scl(US.dir, -US.A * US.nu * Math.sin(US.nu * t)) }) },
  ];
}
/** 同じ非定常の場で dUdt を null で返す宣言(未導出の時間微分 —— 0 で埋めない: 連続の型と台帳は拒否する) */
export function nullDudtOf(f) { return Object.assign({}, f, { key: f.key + 'Null', ja: f.ja + '・dUdt = null', at: (x, t) => Object.assign(f.at(x, t), { dUdt: null }) }); }
/** 解析の勾配と中心差分の照合(相対) */
export function gradCheck(f, x, t = 0, h = 1e-5) {
  const G = f.at(x, t).G; let mx = 0, sc = 0;
  for (let b = 0; b < 3; b++) { const xp = x.slice(), xm = x.slice(); xp[b] += h; xm[b] -= h; const up = f.at(xp, t).u, um = f.at(xm, t).u;
    for (let a = 0; a < 3; a++) { const fd = (up[a] - um[a]) / (2 * h); mx = Math.max(mx, Math.abs(fd - G[3 * a + b])); sc = Math.max(sc, Math.abs(G[3 * a + b])); } }
  return sc > 0 ? mx / sc : mx;
}
/** dUdt の解析と中心差分の照合 */
export function dudtCheck(f, x, t, h = 1e-5) { const a = f.at(x, t).dUdt; if (!a) return null; const up = f.at(x, t + h).u, um = f.at(x, t - h).u, fd = scl(sub(up, um), 1 / (2 * h)); return nrm(sub(fd, a)) / Math.max(nrm(a), 1e-300); }

/* ───────── 中心の引力 ───────── */
export const phiOf = (x, D = DECL) => -D.GM / Math.sqrt(dot(x, x) + D.eps * D.eps);
export const gradPhiOf = (x, D = DECL) => { const r2 = dot(x, x) + D.eps * D.eps; return scl(x, D.GM / (r2 * Math.sqrt(r2))); };

/* ───────── K: 今の v−u 輸送(第321便a の transportDelta3 —— semi の相)───────── */
/**
 * 外部場 f で n 步(刻み h・k_F)。台帳は 1 步ごとに足す(場のキックの運動エネルギー ½|v+Δv|² − ½|v|²・トルク x × Δv・力積 Δv)。
 * 非定常の場で dUdt = null なら拒否(K の步そのものは u の差を使うが、台帳 dH/dt = p·∂_t u が閉じない —— 0 で埋めない)。
 */
export function runK(f, o = {}) {
  const D = o.D || DECL, h = o.h || D.h, kF = o.kF === undefined ? 1 : o.kF, n = Math.round((o.tEnd || D.tEnd) / h);
  let x = D.x0.slice(), v = D.v0.slice(), t = 0, uPrev = [0, 0, 0], hasPrev = false, clampN = 0;
  const Lg = { Wf: 0, Wg: 0, tauF: [0, 0, 0], impF: [0, 0, 0], pdudt: 0 };
  const e0 = { x: x.slice(), v: v.slice(), u: f.at(x, 0).u };
  for (let k = 0; k < n; k++) {
    const a = scl(gradPhiOf(x, D), -1), vg = add(v, scl(a, h));
    Lg.Wg += 0.5 * (dot(vg, vg) - dot(v, v)); v = vg;
    const F = f.at(x, t);
    if (!f.stationary && F.dUdt == null) throw new RangeError('非定常の場の dUdt が null —— 台帳 dH/dt = p·∂_t u が閉じない(0 で埋めない)');
    const Tr = transportDelta3(F.u, F.G, uPrev, v, kF, h, hasPrev);
    if (hasPrev) {
      const dv = scl(Tr.du, kF), v1 = add(v, dv);
      Lg.Wf += 0.5 * (dot(v1, v1) - dot(v, v)); Lg.tauF = add(Lg.tauF, cross(x, dv)); Lg.impF = add(Lg.impF, dv); if (Tr.clamped) clampN++;
      Lg.pdudt += dot(sub(v, scl(F.u, kF)), F.dUdt) * h; v = v1;
    }
    uPrev = F.u.slice(); hasPrev = true;
    x = add(x, scl(v, h)); t += h;
  }
  return { type: 'K', h, kF, n, x, v, t, clampN, ledger: Lg, start: e0, end: { u: f.at(x, t).u } };
}
/** 零場の K と同じ演算列の素の重力のキック → ドリフト(ビットの照合の相手) */
export function runPlain(o = {}) {
  const D = o.D || DECL, h = o.h || D.h, n = Math.round((o.tEnd || D.tEnd) / h); let x = D.x0.slice(), v = D.v0.slice();
  for (let k = 0; k < n; k++) { v = add(v, scl(scl(gradPhiOf(x, D), -1), h)); x = add(x, scl(v, h)); }
  return { x, v };
}

/* ───────── 連続の型(RK4 —— 参照)───────── */
/**
 * 状態 y = [x(3), w(3), Wf, tau(3), imp(3), pdudt] —— w は型ごとに v(Kc・A)か p(P・Pl)。
 * 戻り値の derivs は { xdot, wdot, af(場の加速度 a_f = ẍ + ∇Φ), pdudt(p·∂_t u)}。
 */
function rhsOf(type, f, kF, D) {
  return (y, t) => {
    const x = [y[0], y[1], y[2]], w = [y[3], y[4], y[5]], F = f.at(x, t), gP = gradPhiOf(x, D);
    const needDt = type === 'Kc' || type === 'P' || type === 'Pl' || type === 'A';
    if (!f.stationary && F.dUdt == null && needDt) throw new RangeError('非定常の場の dUdt が null —— ∂_t u を 0 と読まない(拒否)');
    const dU = F.dUdt || [0, 0, 0];
    let xdot, wdot, af, p;
    if (type === 'Kc') {   // ẋ = v・v̇ = −∇Φ + k_F[∂_t u + (u·∇)u + ω × (v − k_F u)]
      const om = curlG(F.G), adv = mG(F.G, F.u); xdot = w; af = scl(add(add(dU, adv), cross(om, sub(w, scl(F.u, kF)))), kF); wdot = add(scl(gP, -1), af); p = sub(w, scl(F.u, kF));
    } else if (type === 'P' || type === 'Pl') {   // ẋ = p + u・ṗ = −∇Φ − (∇u)ᵀp・a_f = ẍ + ∇Φ = −(∇u)ᵀp + ∂_t u + (ẋ·∇)u
      xdot = add(w, F.u); wdot = sub(scl(gP, -1), mGT(F.G, w)); af = add(add(scl(mGT(F.G, w), -1), dU), mG(F.G, xdot)); p = w;
    } else {   // A: ẋ = v + u・v̇ = −∇Φ・a_f = ∂_t u + (ẋ·∇)u
      xdot = add(w, F.u); wdot = scl(gP, -1); af = add(dU, mG(F.G, xdot)); p = w;
    }
    const tq = cross(x, af);
    return [xdot[0], xdot[1], xdot[2], wdot[0], wdot[1], wdot[2], dot(xdot, af), tq[0], tq[1], tq[2], af[0], af[1], af[2], dot(p, dU)];
  };
}
/** 連続の型を RK4 で(type: 'Kc' | 'P' | 'Pl' | 'A')。samples: 走行の途中の時刻の標本(軌道の差の最大を取る) */
export function runC(type, f, o = {}) {
  const D = o.D || DECL, h = o.hRef || D.hRef, kF = o.kF === undefined ? 1 : o.kF, tEnd = o.tEnd || D.tEnd, n = Math.round(tEnd / h), F0 = f.at(D.x0, 0);
  const w0 = type === 'P' ? sub(D.v0, F0.u) : D.v0.slice();
  let y = [...D.x0, ...w0, 0, 0, 0, 0, 0, 0, 0, 0], t = 0;
  const g = rhsOf(type, f, kF, D), every = o.sampleEvery ? Math.round(o.sampleEvery / h) : 0, samples = [];
  for (let k = 0; k < n; k++) {
    const k1 = g(y, t), y2 = y.map((q, i) => q + 0.5 * h * k1[i]), k2 = g(y2, t + 0.5 * h), y3 = y.map((q, i) => q + 0.5 * h * k2[i]), k3 = g(y3, t + 0.5 * h), y4 = y.map((q, i) => q + h * k3[i]), k4 = g(y4, t + h);
    y = y.map((q, i) => q + h / 6 * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i])); t += h;
    if (every && (k + 1) % every === 0) samples.push({ t, x: [y[0], y[1], y[2]] });
  }
  const x = [y[0], y[1], y[2]], w = [y[3], y[4], y[5]], Fe = f.at(x, t);
  const xdot = type === 'Kc' ? w : add(w, Fe.u);
  return { type, h, kF, n, t, x, xdot, w, ledger: { Wf: y[6], tauF: [y[7], y[8], y[9]], impF: [y[10], y[11], y[12]], pdudt: y[13] }, samples, start: { x: D.x0.slice(), xdot: type === 'Kc' ? D.v0.slice() : add(w0, F0.u), u: F0.u }, end: { u: Fe.u } };
}

/* ───────── 台帳の量 ───────── */
/** 運動学の量(ẋ)から E_N・H(p = ẋ − k_F u)・L・L_can */
export function ledgerQty(x, xdot, u, kF = 1, D = DECL) {
  const p = sub(xdot, scl(u, kF)), Phi = phiOf(x, D);
  return { EN: 0.5 * dot(xdot, xdot) + Phi, H: 0.5 * dot(p, p) + kF * dot(p, u) + Phi, Hk: 0.5 * dot(xdot, xdot) - 0.5 * kF * dot(u, u) + Phi, L: cross(x, xdot), Lcan: cross(x, p), P: xdot.slice(), Pcan: p };
}
/** 1 つの走行の台帳の表(始めと終わりの差・場の供給・閉じ) */
export function ledgerOf(run, kF = 1, D = DECL) {
  const xd0 = run.type === 'K' ? run.start.v : run.start.xdot, xd1 = run.type === 'K' ? run.v : run.xdot;
  const q0 = ledgerQty(run.start.x, xd0, run.start.u, kF, D), q1 = ledgerQty(run.x, xd1, run.end.u, kF, D), Lg = run.ledger;
  const dEN = q1.EN - q0.EN, dH = q1.H - q0.H, dL = sub(q1.L, q0.L), dLcan = sub(q1.Lcan, q0.Lcan), dP = sub(q1.P, q0.P), xu0 = cross(run.start.x, run.start.u), xu1 = cross(run.x, run.end.u);
  return { dEN, Wf: Lg.Wf, closeE: dEN - Lg.Wf, dH, pdudt: Lg.pdudt, closeH: dH - Lg.pdudt, dHk: q1.Hk - q0.Hk,
    dLz: dL[2], tauZ: Lg.tauF[2], dLcanZ: dLcan[2], dL, tau: Lg.tauF, dPx: dP[0], impX: Lg.impF[0], imp: Lg.impF, du2half: 0.5 * (dot(run.end.u, run.end.u) - dot(run.start.u, run.start.u)), dxuZ: xu1[2] - xu0[2] };
}

/* ───────── k_F ≠ 1 の余りの力 F_res = k_F(1 − k_F)(u·∇)u の閉じた路の積分(定常の場 —— 0 でなければエネルギーの形の保存量が無い)───────── */
/** Gauss–Legendre(n 点 —— [0, 1] の節点と重み) */
function gl(n) {
  const x = [], w = [];
  for (let i = 1; i <= n; i++) { let z = Math.cos(Math.PI * (i - 0.25) / (n + 0.5)), dp = 0;
    for (let it = 0; it < 100; it++) { let p1 = 1, p2 = 0; for (let j = 1; j <= n; j++) { const p3 = p2; p2 = p1; p1 = ((2 * j - 1) * z * p2 - (j - 1) * p3) / j; } dp = n * (z * p1 - p2) / (z * z - 1); const z1 = z; z = z1 - p1 / dp; if (Math.abs(z - z1) < 1e-15) break; }
    x.push(0.5 * (1 - z)); w.push(1 / ((1 - z * z) * dp * dp)); }
  return { x, w };
}
/** 子午面(y = 0)の長方形の路の ∮ F_res·dl(反時計回り —— R が増える向きから)と、同じ面の回転の面積分 ∬ (∇ × (u·∇)u)_y dR dz の k_F(1 − k_F) 倍(ストークスの照合) */
export function residualCircuitOf(f, kF, o = {}) {
  const Lp = o.circuit || DECL.circuit, Q = gl(Lp.n), c = kF * (1 - kF), fr = (x) => { const F = f.at(x, 0); return scl(mG(F.G, F.u), c); };
  const seg = (a, b) => { let s = 0; const d = sub(b, a); for (let k = 0; k < Q.x.length; k++) s += Q.w[k] * dot(fr(add(a, scl(d, Q.x[k]))), d); return s; };
  const P1 = [Lp.R1, 0, Lp.z1], P2 = [Lp.R2, 0, Lp.z1], P3 = [Lp.R2, 0, Lp.z2], P4 = [Lp.R1, 0, Lp.z2];
  const line = seg(P1, P2) + seg(P2, P3) + seg(P3, P4) + seg(P4, P1);
  // 面積分(回転の y 成分 —— 中心差分の幅 hd)。路 P1→P2→P3→P4 は (x, z) の面で x → z の向き = −ŷ の向きの周回 ⇒ ∮ = −∬ (∇×F)_y dx dz
  const hd = 1e-5, curlY = (x) => { const xp = add(x, [0, 0, hd]), xm = add(x, [0, 0, -hd]), ap = add(x, [hd, 0, 0]), am = add(x, [-hd, 0, 0]);
    return (fr(xp)[0] - fr(xm)[0]) / (2 * hd) - (fr(ap)[2] - fr(am)[2]) / (2 * hd); };
  let area = 0; for (let i = 0; i < Q.x.length; i++) for (let j = 0; j < Q.x.length; j++) { const R = Lp.R1 + (Lp.R2 - Lp.R1) * Q.x[i], z = Lp.z1 + (Lp.z2 - Lp.z1) * Q.x[j]; area += Q.w[i] * Q.w[j] * curlY([R, 0, z]); }
  area *= -(Lp.R2 - Lp.R1) * (Lp.z2 - Lp.z1);
  return { line, area, coef: c, scale: c * nrm(f.at([1, 0, 0.2], 0).u) ** 2 };
}

/* ───────── 解析解: 剛体回転 × 中心の引力 —— x(t) = R(Ωt) y(t)(y はニュートンの軌道・y(0) = x0・ẏ(0) = p0 = v0 − Ω × x0)───────── */
export function rotZ(a, v) { const c = Math.cos(a), s = Math.sin(a); return [c * v[0] - s * v[1], s * v[0] + c * v[1], v[2]]; }
export function rigidAnalytic(o = {}) {
  const D = o.D || DECL, Om = D.rigid, h = o.hRef || D.hRef, tEnd = o.tEnd || D.tEnd, n = Math.round(tEnd / h);
  if (!(Om[0] === 0 && Om[1] === 0)) throw new RangeError('解析解の写しは Ω ∥ ẑ だけ');
  const p0 = sub(D.v0, cross(Om, D.x0));
  let y = [...D.x0, ...p0], t = 0;
  const g = (s) => { const a = scl(gradPhiOf([s[0], s[1], s[2]], D), -1); return [s[3], s[4], s[5], a[0], a[1], a[2]]; };
  for (let k = 0; k < n; k++) { const k1 = g(y), k2 = g(y.map((q, i) => q + 0.5 * h * k1[i])), k3 = g(y.map((q, i) => q + 0.5 * h * k2[i])), k4 = g(y.map((q, i) => q + h * k3[i])); y = y.map((q, i) => q + h / 6 * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i])); t += h; }
  return { t, x: rotZ(Om[2] * t, [y[0], y[1], y[2]]) };
}

/* ───────── 散逸のグループ(AN511 —— 源の宣言の項をグループで併合)───────── */
/**
 * sourceState(第321便c の形)の項をグループの宣言 groups = [{ key, terms: [項の key …] }] で併合した sourceState の列を返す。
 * 併合は成分ごとの区間の和(隣り合う [lo, hi) をつなぐ)を ALL_COMPS の順で正準化 —— 全成分を [0, ∞) で持てば fullState() と同じ宣言(同じ順・同じ区間)になる。
 * 代理(galaxy:proxy)は併合しない(他の成分と同じグループに置かない)。宣言に無い項・二度の所属は拒否。
 */
export function groupStatesOf(st, groups, modelId) {
  const used = new Set(), out = [];
  for (const g of groups) {
    const owns = []; let gc;
    for (const k of g.terms) {
      const t = st.terms.find((q) => q.key === k);
      if (!t) throw new RangeError('グループ ' + g.key + ' の項が宣言に無い: ' + k);
      if (used.has(k)) throw new RangeError('項が二つのグループに属する: ' + k);
      used.add(k);
      if (t.proxy || t.owns.some((q) => q.comp === 'galaxy:proxy')) throw new RangeError('代理の項は併合しない: ' + k);
      for (const q of t.owns) owns.push({ comp: q.comp, lo: q.lo === undefined ? 0 : q.lo, hi: q.hi === undefined ? Infinity : q.hi });
      const c = t.coef === undefined ? 1 : t.coef;
      if (gc === undefined) gc = c; else if (gc !== c) throw new RangeError('同じグループの項の係数が違う(先に合成できない): ' + g.key);
    }
    const merged = [];
    for (const c of ALL_COMPS) {
      const iv = owns.filter((q) => q.comp === c).sort((a, b) => a.lo - b.lo);
      let cur = null;
      for (const q of iv) { if (cur && q.lo === cur.hi) cur.hi = q.hi; else { if (cur) merged.push(cur); cur = { comp: c, lo: q.lo, hi: q.hi }; } }
      if (cur) merged.push(cur);
    }
    out.push({ key: g.key, state: { model: modelId, stationary: st.stationary !== false, terms: [{ key: g.key, coef: gc === undefined ? 1 : gc, owns: merged }] } });
  }
  const left = st.terms.map((t) => t.key).filter((k) => !used.has(k));
  if (left.length) throw new RangeError('グループに属さない項: ' + left.join(','));
  return out;
}
/**
 * グループの熱(読み (b) —— 第321便c の antagOf と同じ純関数 cell)。groupOmegas = [{ key, omega[3] }](グループごとに先に合成した ω)。
 * 戻り値 { perGroup[], source(グループごとの熱の和), composite(全グループの ω の和の熱), diff = source − composite(符号つき —— 非負へ切らない)}
 */
export function groupHeatOf(antagOf, cell, I, s0, a, groupOmegas) {
  const q = antagOf(cell, I, s0, a, groupOmegas.map((g) => g.omega));
  return { perGroup: groupOmegas.map((g, k) => ({ key: g.key, heat: q.perSource[k].hb })), source: q.source, composite: q.composite, diff: q.diff, n: groupOmegas.length };
}

/* ───────── 接続の鍵の案(受理済みの鍵ではない —— 器の宣言)───────── */
export const CONTRACT_DRAFT = Object.freeze({
  key: 'physics.relativeDrag.galaxyField',
  draftVersion: CONTRACT_DRAFT_VERSION,
  shape: '{ version, model, terms, coef: { lambdaC, kappaV }, use: "transport" }',
  fields: Object.freeze([
    Object.freeze({ k: 'version', v: '場の API の契約の版(w321c-galfield-2)—— 版違いは受理で拒否' }),
    Object.freeze({ k: 'model', v: '宣言の模型の名(mw319b-tanh)' }),
    Object.freeze({ k: 'terms', v: '"full" か { rCutKpc }(中心と残余 —— 散逸は同じ 1 グループ)' }),
    Object.freeze({ k: 'coef', v: '{ lambdaC, kappaV } —— u の振幅の宣言の対応(輸送の k_F ではない・較正の係数にしない)' }),
    Object.freeze({ k: 'use', v: '"transport" —— 状態の v は ẋ のまま・輸送 Δv = Δu(k_F = 1 の固定)・ドリフトに u を足さない・初回は履歴だけ(p0 = v0 − u(x0))' }) ]),
  rejects: Object.freeze(['version の違い', 'stationary が偽で dUdt が null(0 で埋めない)', 'k_F ≠ 1(非ハミルトンの残り k_F(1 − k_F)(u·∇)u)', 'ドリフトに u を足す宣言(二度数える)',
    '有効域の外(步で止める)', '外部場を PCG の対称な粒子間の辺に足す宣言(AN501)', 'geoPN=2 の自己の場・慣性決定力・連鎖・軸保持・J と同時に ON(二重の引きずり)', '代理の項に normalization']),
  ledger: Object.freeze(['fieldWorkE = Σ m(½‖v + Δv_f‖² − ½‖v‖²)', 'fieldTorqueL = Σ m x × Δv_f', 'fieldImpulseP = Σ m Δv_f', 'jacobiH = Σ m(½‖v‖² − ½‖u‖²) + Φ(定常の宣言だけ —— 保存の目安)',
    'pDudtW = Σ m (v − u)·∂_t u dt(非定常 —— dH/dt の台帳)', 'canonicalLz = Σ m (x × (v − u))_z(軸対称の場)']),
});
