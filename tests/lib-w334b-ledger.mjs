// 第334便b(原仮定者の整理(2026-11-11)「並進引きずり = 引きずる側の移動と回転を使った座標変換 —— 自分自身への並進引きずりが慣性」「軸引きずり = 並進引きずりを受ける側の部位による差分で
//   起きる回転(とひずみ)—— 潮汐力の引きずり版」「回転引きずり = 引きずる側の回転による空間の捩れ —— 引きずり自転 s_d は J 案が有望」・原仮定者の回答(2026-11-11 —— AN624・AN625・AN626・
//   AN628・AN629・AN630)・統括の検証項目 R323):
//   **仕事とトルクの帳簿(回転引きずりの押し〔NF〕と滑り〔NS〕の軌道のトルクと仕事・源の自転の反作用・共役の角速度の 2 列 S〔観測自転 s〕と D〔J 等価の s_d〕)・軸引きずりの応答の宣言
//   (N = Γ(ω_field − s_i)・Q = Γ|ω_field − s_i|²・τ = I_i/Γ・経路ごとの口と相殺した否定対照)・2 体 3 体の短い窓(刻み h と h/2)・潮汐力との対応(重力の勾配と引きずりの場の勾配)・
//   自分自身への並進引きずりの割合(W_ii/W_t)の純関数**
//   (器 tests/exp-w334b-ledger.mjs と QA lint.ledger334b・behavior.ledger334b・docs.ledger334b が読む —— html を読まない・状態を持たない・第333便a・第333便b・第332便a・第331便a・第330便a・
//   第326便d の lib は呼ぶだけ・エンジンの式を写さない)。**全部「診断」**(エンジン・在位の本・受理器へ足す操作ではない —— 今の軸の口に新しい定義を足さない)。
//
// ■ 記号: 位置 p・距離 r = ‖p_i − p_j‖・質量 m・観測自転 s(ベクトル s ŝ)・引きずり自転 s_d(J 等価 —— 第333便a の dragSpin: s_d = λ_J (f_obs/f_d)(R_obs/R_d)² s)・公転の角速度 n(ベクトル n ĥ)・
//   慣性決定力 W(W_ij・自己 W_ii・背景 W₀ —— 主列は W₀ = 0)・引きずり係数 Y_k(R_d = Y_k m)・慣性能率 I = f m R²(f は慣性係数 —— 扁平率と混ぜない)・応答 Γ ≥ 0(N·m·s)・応答の時間 τ = I/Γ。
//
// ■ 帳簿の宣言(走行の前 —— DECL と DECL_LEDGER に置く。結果を見て変えない)
//   ① 回転引きずりの押し NF(第333便a の列 —— a = γ s_U U₁(ρ, z) φ̂・γ = β|s_γ|・β = C₁R_d K1(r; R_d)・応答率 fixed: s_γ = s・s_U = s_d〔基準〕/linked: s_γ = s_U = s_d〔否定対照〕)と
//     滑り NS(a = γ g(p)(s_U U₁ − v·φ̂) φ̂ —— g は切り口の列で帯の形 1 − t²〔帯の外 0〕・他の列で 1。第332便a の NS と同じ向き)の円軌道の 1 周の平均:
//     受け手の軌道へのトルク N_orb = ⟨m (p − p_src) × a⟩・仕事 P_orb = ⟨m a·(v − v_src)⟩(円軌道で P_orb = n·N_orb —— 恒等式)・源の自転への反作用 dJ_src/dt = −N_orb(宣言)・
//     源の自転のエネルギーの変化 dE_src/dt = −Ω_c·N_orb を**共役の角速度 Ω_c の 2 列**で: (S) Ω_c = s ŝ(観測自転 —— 実体の自転の I_obs = f_obs m R_obs²)/(D) Ω_c = s_d ŝ(J 等価 ——
//     I_d = f_d m R_d²・J_d = J_obs)。熱 Q = (供給の仕事 Ω_c·N_orb) − P_orb(潮汐摩擦の型 Q = N(s − n) と同じ形)・熱の槽は源(宣言 —— 受け手の内部の熱ではない)・Q < 0 は負の散逸で不採用の印。
//     源を固定する近似の列は補助の帳簿(外部の供給: 角運動量の流出 N_orb・エネルギーの流出 Ω_c·N_orb・自転が尽きる時間 J/|N_orb|)を出す。
//   ② 軸引きずりの応答(受動の宣言): 経路 k(源 j × 第333便b の 3 部 —— 源の自転の直接・モーメントの勾配・並進の通過)の局所の回転 ω_k(Σ_k ω_k = ω_field = ½∇×U)ごとに口を 1 つ:
//     Γ_k = Γ |ω_k|/Σ_l|ω_l|・ν_k = ω_k Σ_l|ω_l|/|ω_k|(|ω_k| = 0 の経路は口を持たない)—— 合トルク Σ_k Γ_k(ν_k − s_i) = Γ(ω_field − s_i)。口ごとに第326便d の port
//     (N_k = Γ_k(ν_k − s_i)・Q_k = Γ_k|ν_k − s_i|²・供給 P_in,k = N_k·ν_k・受け手の仕事 N_k·s_i —— 恒等式 P_in − N·s_i − Q = 0)を第331便a の registerPorts・evaluatePorts で(channel axial)。
//     **相殺した列(否定対照)**: 1 つの口 ν = ω_field・Γ —— 熱の差 Q_経路 − Q_相殺 = Γ[(Σ|ω_k|)² − |Σω_k|²] ≥ 0(経路が平行なときだけ 0)。ω_field は回転率で、トルクでも熱でもない(Γ を介す)。
//     Γ は同定しない(単位の τ の格子 —— τ = I/Γ = 1 公転・10³ 公転・10⁶ 公転)。今の軸の口(invSq の axial)の値は並べる(足さない)。
//   ③ 2 体・3 体の窓: 重力だけの軌道(RK4 —— 引きずりの力は軌道に戻さない一次の帳簿)の上で、自転 s_i を軸引きずりの応答と NF の反作用で進め(RK4)、帳簿の積分(供給・受け手の仕事・
//     熱〔経路ごと・相殺〕・NF の軌道の仕事とトルク・源の供給〔S と D〕)を同じ RK4 の補助の状態で積む。閉じ: ΔE_spin − (∫N_ax·s dt − ∫s·N_NF dt) と ΔL_spin − (∫N_ax dt − ∫ΣN_NF dt) の相対を
//     刻み h と h/2 で(自転の変化 δs は s₀ からの差で持つ —— 大きな数の差の桁落ちを避ける)。
//   ④ 潮汐力との対応: 重力の勾配 T_ab = ∂_b g_a = G m (3 n_a n_b − δ_ab)/r³(対称・跡 0 —— 1/s²)と引きずりの場の勾配 J_ab = ∂_b U_a(第333便b の integratedField —— 反対称 = ω_field・
//     対称 = ひずみ —— 1/s)。単位が違う —— 宣言した応答率で揃えた列: √‖T‖(1/s)と n‖J‖(1/s²)。
//   ⑤ 自分自身への並進引きずり: u_i = (W_ii v_i + W₀ v_bg + Σ_j W_ij C_j→i)/(W_ii + W₀ + Σ_j W_ij)(C_j→i = v_j + s_j × (p_i − p_j))・d_i = u_i − v_i = Σ_j W_ij(C_j→i − v_i)/W_t。
//     自己の割合 f_self = W_ii/W_t(主列 W₀ = 0)・|d_i| ≤ (1 − f_self) max_j |C_j→i − v_i|(恒等の不等式)。今の invSq の分母(EQ-12 —— K1 の自己の場 ⟨1/W_ii⟩ = C₁Y_k・β_ij ≈ C₁R_d,j/r)と並べる。
//     **読みの対応**(自己の項を慣性と読む —— 導出ではない)。
//
// ■ 言わないこと: 帳簿は宣言した応答則と宣言した共役の角速度の恒等式と表の値(押しの加速度の則が同じ式を満たす保証ではない)・s_d を実体の自転と書かない・ω_field をトルクや熱と書かない・
//   新しい軸の差分と今の軸の口を重ねて足した値を合計と呼ばない・Γ と τ を観測に合わせない・熱の比は文献の値との比(機構の同定ではない)・自己の割合の表は読みの対応・文献の値は一次資料に当たっていない。
import * as A333 from './lib-w333a-rotdiff.mjs';
import * as B333 from './lib-w333b-axialfield.mjs';
import * as P331 from './lib-w331a-coordtwist.mjs';
import * as H326 from './lib-w326d-axialheat.mjs';
import * as S330 from './lib-w330a-spinclass.mjs';
import { couplingOf, glNodes, rdOf, C1 } from './lib-w332a-eqband.mjs';

export const LIB_VERSION = 'w334b-ledger-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const v3 = (a) => Array.isArray(a) && a.length === 3 && a.every(fin);
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], scl = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (a) => { const n = nrm(a); return n > 0 ? scl(a, 1 / n) : [0, 0, 0]; };
const relD = (a, b) => (a === b ? 0 : Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b), 1e-300));
const rotX = (a, th) => [a[0], a[1] * Math.cos(th) - a[2] * Math.sin(th), a[1] * Math.sin(th) + a[2] * Math.cos(th)];
const DEG = Math.PI / 180, DAY = 86400;

/** 共役の角速度の列・作用の型・軸の口の分け方・自己の規則・窓の系 */
export const CONJ = Object.freeze(['S', 'D']);
export const DIRS = Object.freeze(['NF', 'NS']);
export const SPLITS = Object.freeze(['path', 'merged']);
export const SELF_RULES = B333.SELF_RULES;
export const PART_KEYS = Object.freeze(['spinDirect', 'spinGrad', 'trans']);
/** 宣言(走行の前に置く —— 結果を見て変えない) */
export const DECL = Object.freeze({
  G: 6.674e-11, c: 299792458, AU: 1.495978707e11, yearS: 365.25 * DAY,
  /** 第333便a の列(押しの U の形 —— 主は ball〔源の全体の三次元の差分・α = 2〕・凍結の対照に slice〔切り口〕)と応答率(fixed が基準・linked は否定対照) */
  pushCols: Object.freeze(['slice', 'pair', 'ball', 'sum2', 'lorentz']), pushMain: 'ball', rates: A333.RATES,
  /** J 等価の s_d(第333便a の dragSpin —— λ_J = 1・f_d = 2/5) */
  lambdaJ: 1, fD: A333.DECL.fD,
  /** 軸の応答: 単位の τ の格子(公転の周期の倍数)・重みの次数・r_ref(単位を揃える宣言の長さ)・W₀ = 0(主列) */
  tauOrbits: Object.freeze([1, 1e3, 1e6]), alpha: 2, rRef: 1.495978707e11, W0: 0,
  /** 窓: 内側の公転の周期の数・1 公転の刻みの数(h —— h/2 は 2 倍)・閉じの許容(h/2 の相対)と丸めの床・刻みを半分にしたときの比の下限(床の上のとき) */
  window: Object.freeze({ orbits: 3, stepsPerOrbit: 400, closeTol: 1e-8, floor: 1e-13, convRatio: 4 }),
  /** 恒等式の門の相対の許容・orbitPush との照らしの許容・求積(Gauss–Legendre の点の数) */
  idTol: 1e-12, pushTol: 1e-6, gl: 48,
});
/** 帳簿の宣言の文(正本の先頭に置く —— 走行の前) */
export const DECL_LEDGER = Object.freeze({
  push: 'N_orb = ⟨m (p − p_src) × a⟩・P_orb = ⟨m a·(v − v_src)⟩(円軌道の 1 周の平均)・dJ_src/dt = −N_orb・dE_src/dt = −Ω_c·N_orb・Q = Ω_c·N_orb − P_orb(S: Ω_c = s ŝ/D: Ω_c = s_d ŝ)・熱の槽は源・Q < 0 は不採用の印',
  pushNS: 'NS: a = γ g(p)(s_U U₁ − v·φ̂) φ̂(g は切り口の列で 1 − t²〔帯の外 0〕・他の列で 1)—— 帳簿の式は NF と同じ',
  axial: 'N = Γ(ω_field − s_i)・Q = Γ|ω_field − s_i|²・τ = I_i/Γ・経路 k の口 Γ_k = Γ|ω_k|/Σ|ω_l|・ν_k = ω_k Σ|ω_l|/|ω_k|・P_in − N·s_i − Q = 0(口ごと)・相殺の否定対照は 1 つの口 ν = ω_field',
  window: '重力だけの軌道(RK4)の上で自転を応答と反作用で進め、帳簿の積分を同じ RK4 で積む —— 閉じは ΔE_spin と ΔL_spin の相対の残差を h と h/2 で',
  tide: 'T_ab = G m (3 n_a n_b − δ_ab)/r³(1/s²)と J_ab = ∂_b U_a(1/s —— 反対称 = ω_field・対称 = ひずみ)・揃えた列 √‖T‖ と n‖J‖',
  self: 'u_i = (W_ii v_i + W₀ v_bg + Σ W_ij C_j→i)/(W_ii + W₀ + Σ W_ij)・d_i = u_i − v_i・f_self = W_ii/W_t・|d_i| ≤ (1 − f_self) max|C_j→i − v_i|(W₀ = 0)',
});
/**
 * 文献の値(SI —— 本便は一次資料に当たっていない〔この箱から外のサイトに届かない〕—— 文献の値・未照合)。慣性係数 f は第333便a の MOI(太陽・水星・金星・地球・月・火星・木星・土星)と
 * 第326便d の MOI(イオ)を呼ぶ —— 名の無い天体は一様な球 0.4 の宣言(文献の値ではない)。自転の周期は恒星時(負は逆行)・P は日。
 */
export const LIT = Object.freeze({
  note: '文献の値・未照合(質量・半径・自転と公転の周期・軌道の半径・自転軸の傾き —— IAU の名目の値と NASA の惑星の要覧の値を書き写した。冥王星とカロンは New Horizons の後の要覧の値。慣性係数は第333便a と第326便d の lib の値)',
  bodies: Object.freeze({
    sun: Object.freeze({ m: 1.98847e30, R: 6.957e8, Pspin: 25.38, f: A333.fObsOf(0), obliqDeg: 7.25 }),
    mercury: Object.freeze({ m: 3.3011e23, R: 2.4397e6, Pspin: 58.646, f: A333.fObsOf(1), obliqDeg: 0.034, a: 5.7909e10 }),
    venus: Object.freeze({ m: 4.8675e24, R: 6.0518e6, Pspin: -243.018, f: A333.fObsOf(2), obliqDeg: 177.36, a: 1.08209e11 }),
    earth: Object.freeze({ m: 5.9722e24, R: 6.371e6, Pspin: 0.99726968, f: A333.fObsOf(3), obliqDeg: 23.44, a: 1.495978707e11 }),
    moon: Object.freeze({ m: 7.342e22, R: 1.7374e6, Pspin: 27.321661, f: A333.fObsOf(4), obliqDeg: 6.68, a: 3.844e8 }),
    jupiter: Object.freeze({ m: 1.89813e27, R: 6.9911e7, Pspin: 0.41354, f: A333.fObsOf(6), obliqDeg: 3.13, a: 7.7857e11 }),
    io: Object.freeze({ m: 8.9319e22, R: 1.8216e6, Pspin: 1.769138, f: H326.MOI.io, obliqDeg: 0, a: 4.217e8 }),
    saturn: Object.freeze({ m: 5.6834e26, R: 5.8232e7, Pspin: 0.44401, f: A333.fObsOf(11), obliqDeg: 26.73, a: 1.43353e12 }),
    pluto: Object.freeze({ m: 1.303e22, R: 1.1883e6, Pspin: 6.38723, f: A333.MOI_UNIFORM, obliqDeg: 0 }),
    charon: Object.freeze({ m: 1.586e21, R: 6.06e5, Pspin: 6.38723, f: A333.MOI_UNIFORM, obliqDeg: 0, a: 1.9596e7 }),
  }),
  /** 軌道の傾き(源の赤道面に対する —— 第332便a の LIT の値: 木星 6.09°・イオ 0.05°・月は地球の赤道面に対して 18.3°〜28.6° —— 宣言 23.44°) */
  incl: Object.freeze({ jupiter: 6.09, io: 0.05, moon: 23.44 }),
  /** 土星の環の粒子(軌道の半径 —— C・B・A 環の代表の値)と局所の厚みの桁 10 m(第332便a の LIT —— 傾いた列は z_max = 10 m)・主な環の質量 1.54e19 kg(Iess ほか 2019 —— 文献の値・未照合) */
  ring: Object.freeze({ a: Object.freeze([7.5e7, 1.05e8, 1.3e8]), zMax: 10, mass: 1.54e19 }),
  /** 観測の熱流 [W](第330便a の lib の値を呼ぶ —— 地球・木星・イオ・土星) */
  heatFlowW: S330.DECL.lit.heatFlowW,
  /** 連星(質量 [M☉]・半径 [R☉ か m]・軌道の半径 —— 円軌道の宣言)と銀河の星(太陽 —— 内側の質量を点の源 M(<R₀) = v₀²R₀/G に置く宣言) */
  msun: 1.98847e30, rsun: 6.957e8, pc: 3.0856775814913673e16,
  binaries: Object.freeze([
    Object.freeze({ key: 'alphaCen', mA: 1.1, mB: 0.907, RA: 1.2234 * 6.957e8, RB: 0.8632 * 6.957e8, a: 23.4 * 1.495978707e11, PspinA: 22, PspinB: 41 }),
    Object.freeze({ key: 'sirius', mA: 2.063, mB: 1.018, RA: 1.711 * 6.957e8, RB: 0.0084 * 6.957e8, a: 19.8 * 1.495978707e11, PspinA: 5.5, PspinB: 0.0254 }),
    Object.freeze({ key: 'psr1913', mA: 1.438, mB: 1.390, RA: 1.2e4, RB: 1.2e4, a: 1.95e9, PspinA: 0.059 / DAY, PspinB: 1 }),
  ]),
  galaxy: Object.freeze({ v0: 2.30e5, R0kpc: 8.2, nearKey: 'alphaCen', nearPc: 1.34 }),
});
export const BODY_KEYS = Object.freeze(Object.keys(LIT.bodies));

/* ───────── 天体の量 ───────── */
/** 天体の SI の量: m・R・s(符号つき —— 負は逆行)・f・I = f m R²・R_d = Y_k m・I_d = f_d m R_d²・s_d(J 等価)・比 I/I_d = s_d/s */
export function bodyOf(key, lit = LIT.bodies) {
  const b = lit[key];
  if (!b) throw new RangeError('bodyOf: 知らない天体 ' + String(key));
  const s = 2 * Math.PI / (b.Pspin * DAY), I = b.f * b.m * b.R * b.R, Rd = rdOf(b.m), Id = DECL.fD * b.m * Rd * Rd;
  const D = A333.dragSpin({ m: b.m, Robs: b.R, s, fObs: b.f, fD: DECL.fD, lambdaJ: DECL.lambdaJ, Rd });
  return { key, m: b.m, R: b.R, s, f: b.f, I, Rd, Id, sd: D.sd, sdOverS: D.ratio, jRel: D.jRel, obliq: b.obliqDeg * DEG, a: b.a === undefined ? null : b.a };
}

/* ───────── ② 軸引きずりの応答(経路ごとの口と相殺の否定対照)───────── */
/** 経路の口の宣言: parts = [{ key, omega:[3] }] → registerPorts の入力(Γ_k = Γ|ω_k|/Σ|ω_l|・ν_k = ω_k Σ|ω_l|/|ω_k| —— 0 の経路は口を持たない) */
export function pathPorts(parts, Gamma, recv = 'recv') {
  if (!Array.isArray(parts) || parts.some((q) => !q || typeof q.key !== 'string' || !v3(q.omega)) || !fin(Gamma) || Gamma < 0) throw new RangeError('pathPorts: 経路は { key, omega:[3] }・Γ ≥ 0');
  const S = parts.reduce((a, q) => a + nrm(q.omega), 0), out = [];
  for (const q of parts) {
    const w = nrm(q.omega);
    if (!(w > 0)) continue;
    out.push({ interactionId: q.key, channel: 'axial', recv, src: q.key.split('|')[0], nu: scl(q.omega, S / w), Gamma: Gamma * w / S });
  }
  return { entries: out, sumAbs: S };
}
/** 軸の応答の帳簿(受け手の自転 s:[3]・経路 parts・Γ): 経路ごと(第331便a の registerPorts・evaluatePorts —— 第326便d の port)と相殺の否定対照(1 つの口 ν = ω_field) */
export function axialLedger({ parts, s, Gamma }) {
  if (!v3(s)) throw new RangeError('axialLedger: s は有限の 3 成分');
  const P = pathPorts(parts, Gamma), omega = parts.reduce((a, q) => add(a, q.omega), [0, 0, 0]);
  const path = P.entries.length ? P331.evaluatePorts(P331.registerPorts(P.entries), s) : { torque: [0, 0, 0], heat: 0, supply: 0, recvWork: 0, residual: 0, residualRel: 0, per: [] };
  const merged = H326.port(s, omega, Gamma), excessFormula = Gamma * (P.sumAbs * P.sumAbs - dot(omega, omega));
  const torqueRef = scl(sub(omega, s), Gamma);
  return { omega, torque: path.torque, torqueMergedRel: nrm(sub(path.torque, torqueRef)) / Math.max(nrm(torqueRef), 1e-300), heat: path.heat, supply: path.supply, recvWork: path.recvWork,
    identityRel: path.residualRel, nPorts: P.entries.length, merged: { torque: merged.torque, heat: merged.heat, supply: merged.supply, recvWork: merged.recvWork, residual: merged.residual },
    excess: path.heat - merged.heat, excessFormula, excessRel: relD(path.heat - merged.heat, excessFormula), per: path.per.map((q) => ({ key: q.interactionId, heat: q.heat, supply: q.supply, recvWork: q.recvWork })) };
}
/** 第333便b の場から経路 parts(源 j × 3 部)を作る: integratedField の parts の J の部の反対称の部(localSpin)—— keyOf(j) は源の名 */
export function partsOfField(F, keyOf) {
  if (!F || !Array.isArray(F.parts)) throw new RangeError('partsOfField: integratedField の parts が要る');
  const out = [];
  F.parts.forEach((q, j) => { if (q.rest) return; for (const k of PART_KEYS) out.push({ key: keyOf(j) + '|' + k, omega: B333.localSpin(q[k]).omega }); });
  return out;
}
/** 受け手の位置の ω_field と経路(sources は [{ key, p, v, s, m }] —— 受け手の自分は入れない) */
export function fieldAt({ at, sources, selfRule, m, R, alpha = DECL.alpha, rRef = DECL.rRef, W0 = DECL.W0 }) {
  const sw = B333.selfWeightOf({ rule: selfRule, m, Robs: R, alpha, rRef, G: DECL.G, c: DECL.c });
  const F = B333.integratedField({ at, sources: sources.map((q) => ({ p: q.p, v: q.v, s: q.s, m: q.m })), alpha, rRef, selfW: sw.w, W0, parts: true });
  return { F, parts: partsOfField(F, (j) => sources[j].key), selfW: sw.w };
}

/* ───────── ① 回転引きずりの押しの帳簿(円軌道の 1 周の平均)───────── */
/** 押しの加速度(源の枠 —— 源の自転軸 ẑ・p は源の中心から・v は源に対する速度): NF a = γ s_U U₁ φ̂/NS a = γ g (s_U U₁ − v·φ̂) φ̂ */
export function pushAccel({ dir, col, Uunit, Rd, gamma, sU, p, v }) {
  const rho = Math.hypot(p[0], p[1]);
  if (!(rho > 0)) return [0, 0, 0];
  const ph = [-p[1] / rho, p[0] / rho, 0], U = sU * Uunit(rho, p[2]);
  if (dir === 'NF') return scl(ph, gamma * U);
  const t = Math.abs(p[2]) / Rd, g = col === 'slice' ? (t <= 1 ? 1 - t * t : 0) : 1;
  return scl(ph, gamma * g * (U - dot(v, ph)));
}
/**
 * 円軌道(半径 a・源の赤道面に対する傾き i・昇交点 x̂)の 1 周の平均のトルクと仕事(受け手の質量 m —— Gauss–Legendre の区間: 帯の縁 t ∈ 第333便a の orbitPush と同じ区切り)。
 * 戻り値: N:[3]・P・L(m√(GMa))・h:[3](軌道の法線)・dhdi:[3]・n(公転の角速度)
 */
export function orbitAverage({ dir, col, Rd, gamma, sU, Uunit, a, i, GM, m, gl = DECL.gl }) {
  if (!DIRS.includes(dir) || !(a > 0) || !(GM > 0) || !(m > 0) || !fin(i) || i < 0 || i > Math.PI || !(Rd > 0)) throw new RangeError('orbitAverage: 型・a・GM・m > 0・0 ≤ i ≤ π');
  const n = Math.sqrt(GM / (a * a * a)), v = n * a, si = Math.sin(i), ci = Math.cos(i), yo = [0, ci, si], h = [0, -si, ci], dhdi = [0, -ci, -si];
  const tB = [1 / 16, 0.25, 0.5, 1, 2, 4, 8, 16, 64, 256, 1024, 4096, 16384, 65536], asi = a * Math.abs(si), half = Math.PI / 2;
  const uq = [0]; for (const t of tB) { const u = asi <= 0 || t * Rd >= asi ? half : Math.asin(t * Rd / asi); if (u > uq[uq.length - 1]) uq.push(u); if (u >= half) break; }
  if (uq[uq.length - 1] < half) uq.push(half);
  const brk = new Set(); for (const u of uq) { brk.add(u); brk.add(Math.PI - u); brk.add(Math.PI + u); brk.add(2 * Math.PI - u); }
  const us = [...brk].filter((u) => u >= 0 && u <= 2 * Math.PI).sort((x, y) => x - y);
  const G = glNodes(gl);
  let N = [0, 0, 0], P = 0;
  for (let k = 0; k + 1 < us.length; k++) {
    const lo = us[k], hi = us[k + 1]; if (!(hi > lo)) continue;
    const hw = (hi - lo) / 2, mid = (hi + lo) / 2;
    for (let q = 0; q < gl; q++) {
      const u = mid + hw * G.x[q], cu = Math.cos(u), su = Math.sin(u), p = add([a * cu, 0, 0], scl(yo, a * su)), vv = add([-v * su, 0, 0], scl(yo, v * cu));
      const acc = pushAccel({ dir, col, Uunit, Rd, gamma, sU, p, v: vv }), w = G.w[q] * hw / (2 * Math.PI);
      N = add(N, scl(crs(p, acc), m * w)); P += m * dot(acc, vv) * w;
    }
  }
  return { N, P, L: m * Math.sqrt(GM * a), h, dhdi, n, v };
}
/** 押しの帳簿の 1 行(源 src = bodyOf・受け手の質量 m・a・i・列・応答率・型) */
export function pushLedger({ src, m, a, i, col, rate, dir, heatObs = null, massScale = 1 }) {
  if (!A333.COLUMNS.includes(col) || !DECL.rates.includes(rate)) throw new RangeError('pushLedger: 列は ' + A333.COLUMNS.join('・') + '・応答率は ' + DECL.rates.join('・'));
  const GM = DECL.G * (src.m + m), sAbs = Math.abs(src.s), sdAbs = Math.abs(src.sd), sGamma = rate === 'fixed' ? sAbs : sdAbs, sU = sdAbs * Math.sign(src.s);
  const beta = couplingOf('k1N', a, src.Rd), gamma = beta * sGamma, Uunit = A333.unitFn(col, src.Rd);
  const O = orbitAverage({ dir, col, Rd: src.Rd, gamma, sU, Uunit, a, i, GM, m });
  const nVec = scl(O.h, O.n), sHat = [0, 0, 1];
  const Pn = dot(nVec, O.N), conj = { S: scl(sHat, src.s), D: scl(sHat, src.sd) };
  const row = { dir, col, rate, a, iDeg: i / DEG, beta, gamma, N: O.N, Nh: dot(O.N, O.h), Ni: dot(O.N, O.dhdi), P: O.P, PnRel: relD(O.P, Pn), L: O.L, n: O.n };
  for (const c of CONJ) {
    const sup = dot(conj[c], O.N), Q = sup - O.P;
    row[c] = { supply: sup, Q, Qneg: Q < 0, Qtot: Q * massScale, obsRatio: fin(heatObs) && heatObs > 0 ? Q * massScale / heatObs : null };
  }
  row.QDoverQS = row.S.Q !== 0 ? row.D.Q / row.S.Q : null;
  row.QDoverQSformula = (src.sd - O.n * dot(O.h, sHat)) / (src.s - O.n * dot(O.h, sHat));
  // 潮汐摩擦の型との対応(i = 0 —— N ∥ ĥ ∥ ŝ): Q_S = N_h (s − n)
  row.tidalForm = i === 0 ? relD(row.S.Q, row.Nh * (src.s - O.n)) : null;
  // 第333便a の orbitPush との照らし(NF —— 傾き di/dt と d ln a/dt から N の 2 成分と P を作り直す)
  if (dir === 'NF') {
    const op = A333.orbitPush({ Uunit, Rd: src.Rd, a, i, n: O.n, v: O.v, sGamma, sU });
    row.vsOrbitPush = { P: relD(O.P, m * O.v * O.v * op.dLnAdt / 2), Nh: relD(row.Nh, O.L * op.dLnAdt / 2), Ni: i > 0 ? Math.abs(row.Ni - O.L * op.dIdt) / Math.max(Math.abs(row.Ni), Math.abs(O.L * op.dIdt), Math.abs(row.Nh), 1e-300) : null };
  }
  // 補助の帳簿(源を固定する近似 —— 外部の供給): 角運動量の流出・エネルギーの流出(S と D)・自転が尽きる時間 J/|N|
  const J = src.I * Math.abs(src.s), Nm = nrm(O.N) * massScale;
  row.aux = { Lout: Nm, EoutS: row.S.supply * massScale, EoutD: row.D.supply * massScale, tSpinYr: Nm > 0 ? J / Nm / DECL.yearS : null };
  return row;
}

/* ───────── ④ 潮汐力との対応 ───────── */
/** 重力の勾配 T_ab = ∂_b g_a = G m (3 n_a n_b − δ_ab)/r³(d = 受け手 − 源) */
export function tidalTensor(m, d, G = DECL.G) {
  if (!fin(m) || !(m > 0) || !v3(d) || !(nrm(d) > 0)) throw new RangeError('tidalTensor: m > 0・d ≠ 0');
  const r = nrm(d), n = scl(d, 1 / r), k = G * m / (r * r * r);
  return [0, 1, 2].map((a) => [0, 1, 2].map((b) => k * (3 * n[a] * n[b] - (a === b ? 1 : 0))));
}
const frob = (A) => Math.sqrt(A.flat().reduce((s, x) => s + x * x, 0));
/** 1 つの源の配置の潮汐と引きずりの勾配の比べ(源 src・受け手 recv —— { p, v, s, m, R }) */
export function tideDragRow({ src, recv, selfRule, n }) {
  const d = sub(recv.p, src.p), T = tidalTensor(src.m, d), fa = fieldAt({ at: recv.p, sources: [Object.assign({ key: 'src' }, src)], selfRule, m: recv.m, R: recv.R });
  const J = fa.F.J, sym = fa.F.strain, w = fa.F.omega, tr = T[0][0] + T[1][1] + T[2][2];
  return { r: nrm(d), Tnorm: frob(T), Ttrace: tr, Tsym: frob(T.map((r0, a) => r0.map((x, b) => x - T[b][a]))), sqrtT: Math.sqrt(frob(T)), omega: nrm(w), strain: frob(sym), div: fa.F.div, nJ: n * frob(J), Jnorm: frob(J), shareSrc: fa.F.shares.src,
    omegaMinusSrcSpin: nrm(sub(w, src.s)) };
}

/* ───────── ⑤ 自分自身への並進引きずり(慣性の読み)───────── */
/**
 * 受け手 recv = { key, p, v, s, m, R }・源 sources(同じ型)。規則: kappaM(R_d = Y_k m の点 m/R²)・robs(観測半径の点)—— 第331便a の coordTwist(重み m/r²・W₀ = 0)を呼ぶ。
 * engineK1: 今の invSq の K1 の分母の一次(EQ-12・EQ-14 —— ⟨1/W_ii⟩ = C₁Y_k・β_ij = C₁R_d,j K1(r; R_d,j))の Σβ と f_self = 1 − Σβ
 */
export function selfShareRow({ recv, sources }) {
  const out = { key: recv.key };
  for (const rule of ['kappaM', 'robs']) {
    const sd = P331.selfDecl({ shape: 'point', rule: rule === 'robs' ? 'radius' : 'kappaM', m: recv.m, Robs: recv.R });
    const T = P331.coordTwist({ id: recv.key, x: recv.p, v: recv.v, omega: recv.s, selfW: sd.w }, sources.map((q) => ({ id: q.key, x: q.p, v: q.v, omega: q.s, m: q.m })));
    const cMax = Math.max(...T.ports.map((q) => nrm(q.vrel))), dn = nrm(T.d), sb = T.ports.reduce((x, q) => x + q.beta, 0);   // Σβ = 1 − f_self(丸めで 1 − α が 0 になる行は Σβ で持つ)
    out[rule] = { fSelf: T.alpha, oneMinus: sb, d: dn, dTrans: nrm(T.dTrans), dRot: nrm(T.dRot), cMax, bound: sb * cMax, boundOk: dn <= sb * cMax * (1 + 1e-12), Rself: sd.R };
  }
  const sb = sources.reduce((s, q) => s + couplingOf('k1N', nrm(sub(recv.p, q.p)), rdOf(q.m)), 0);
  out.engineK1 = { sumBeta: sb, fSelf: 1 - sb };
  return out;
}

/* ───────── ③ 2 体・3 体の窓 ───────── */
/**
 * 窓の系 sys = { keys:[…], bodies:[{ key, m, R, I, Id, p:[3], v:[3], s:[3], Rd }] }(SI —— 器が円軌道で作る)。opt = { selfRule, tauSec(null = 軸の応答なし), push(true/false), steps, T }。
 * 状態: 位置・速度(重力だけ)・自転の差 δs(s = s₀ + δs)・補助の積分(受け手の仕事・供給〔経路〕・熱〔経路・相殺〕・NF の軌道の仕事とトルク・源の供給〔S〕)。RK4。
 */
export function windowRun(sys, opt) {
  const B = sys.bodies, nb = B.length, keys = B.map((b) => b.key), G = DECL.G, steps = opt.steps, h = opt.T / steps, col = DECL.pushMain;
  const Gam = B.map((b) => (opt.tauSec ? b.I / opt.tauSec : 0)), S0 = B.map((b) => b.s.slice()), sz = 9 * nb + 14;
  const pack = () => { const y = new Float64Array(sz); B.forEach((b, k) => { y.set(b.p, 6 * k); y.set(b.v, 6 * k + 3); }); return y; };
  const P3 = (y, o) => [y[o], y[o + 1], y[o + 2]];
  function rhs(y) {
    const dy = new Float64Array(sz), pos = B.map((_, k) => P3(y, 6 * k)), vel = B.map((_, k) => P3(y, 6 * k + 3)), sp = B.map((_, k) => add(S0[k], P3(y, 6 * nb + 3 * k)));
    const tq = B.map(() => [0, 0, 0]);
    let rw = 0, sup = 0, qPath = 0, qMerged = 0, pOrb = 0, srcS = 0, srcD = 0; const nOrb = [0, 0, 0], nAx = [0, 0, 0];
    for (let k = 0; k < nb; k++) {
      dy.set(vel[k], 6 * k);
      let acc = [0, 0, 0];
      for (let j = 0; j < nb; j++) if (j !== k) { const d = sub(pos[j], pos[k]), r = nrm(d); acc = add(acc, scl(d, G * B[j].m / (r * r * r))); }
      dy.set(acc, 6 * k + 3);
    }
    if (opt.tauSec) for (let k = 0; k < nb; k++) {
      const srcs = []; for (let j = 0; j < nb; j++) if (j !== k) srcs.push({ key: keys[j], p: pos[j], v: vel[j], s: sp[j], m: B[j].m });
      const fa = fieldAt({ at: pos[k], sources: srcs, selfRule: opt.selfRule, m: B[k].m, R: B[k].R }), L = axialLedger({ parts: fa.parts, s: sp[k], Gamma: Gam[k] });
      tq[k] = add(tq[k], L.torque); nAx[0] += L.torque[0]; nAx[1] += L.torque[1]; nAx[2] += L.torque[2]; rw += L.recvWork; sup += L.supply; qPath += L.heat; qMerged += L.merged.heat;
    }
    if (opt.push) for (let k = 0; k < nb; k++) {   // 源 k の押しを受け手 i の軌道へ(源の自転軸 ŝ_k の枠で)
      const sk = sp[k], sa = nrm(sk); if (!(sa > 0)) continue;
      const z = scl(sk, 1 / sa), xr = unit(Math.abs(z[0]) < 0.9 ? crs([1, 0, 0], z) : crs([0, 1, 0], z)), yr = crs(z, xr), Rd = B[k].Rd, Uunit = A333.unitFn(col, Rd), sdA = sa * B[k].I / B[k].Id;
      for (let i = 0; i < nb; i++) if (i !== k) {
        const dg = sub(pos[i], pos[k]), dv = sub(vel[i], vel[k]), pl = [dot(dg, xr), dot(dg, yr), dot(dg, z)], vl = [dot(dv, xr), dot(dv, yr), dot(dv, z)];
        const gamma = couplingOf('k1N', nrm(dg), Rd) * sa, al = pushAccel({ dir: 'NF', col, Uunit, Rd, gamma, sU: sdA, p: pl, v: vl });
        const ag = add(add(scl(xr, al[0]), scl(yr, al[1])), scl(z, al[2])), Nn = scl(crs(dg, ag), B[i].m);
        tq[k] = sub(tq[k], Nn); pOrb += B[i].m * dot(ag, dv); srcS += dot(sk, Nn); srcD += (B[k].I / B[k].Id) * dot(sk, Nn); nOrb[0] += Nn[0]; nOrb[1] += Nn[1]; nOrb[2] += Nn[2];
      }
    }
    for (let k = 0; k < nb; k++) dy.set(scl(tq[k], 1 / B[k].I), 6 * nb + 3 * k);
    const o = 9 * nb; dy[o] = rw; dy[o + 1] = sup; dy[o + 2] = qPath; dy[o + 3] = qMerged; dy[o + 4] = pOrb; dy[o + 5] = srcS; dy[o + 6] = srcD; dy[o + 7] = 0;
    dy[o + 8] = nOrb[0]; dy[o + 9] = nOrb[1]; dy[o + 10] = nOrb[2]; dy[o + 11] = nAx[0]; dy[o + 12] = nAx[1]; dy[o + 13] = nAx[2];
    return { dy };
  }
  let y = pack();
  for (let st = 0; st < steps; st++) {
    const k1 = rhs(y).dy, y2 = y.map((x, q) => x + 0.5 * h * k1[q]), k2 = rhs(y2).dy, y3 = y.map((x, q) => x + 0.5 * h * k2[q]), k3 = rhs(y3).dy, y4 = y.map((x, q) => x + h * k3[q]), k4 = rhs(y4).dy;
    y = y.map((x, q) => x + (h / 6) * (k1[q] + 2 * k2[q] + 2 * k3[q] + k4[q]));
  }
  const o = 9 * nb, ds = B.map((_, k) => P3(y, 6 * nb + 3 * k));
  const dE = B.reduce((s, b, k) => s + b.I * (dot(S0[k], ds[k]) + 0.5 * dot(ds[k], ds[k])), 0), dED = B.reduce((s, b, k) => s + (b.I / b.Id) * b.I * (dot(S0[k], ds[k]) + 0.5 * dot(ds[k], ds[k])), 0);
  const dL = B.reduce((a, b, k) => add(a, scl(ds[k], b.I)), [0, 0, 0]), nOrbInt = [y[o + 8], y[o + 9], y[o + 10]];
  const acc = { recvWork: y[o], supply: y[o + 1], heatPath: y[o + 2], heatMerged: y[o + 3], pOrb: y[o + 4], srcSupplyS: y[o + 5], srcSupplyD: y[o + 6], nOrb: nOrbInt, nAx: [y[o + 11], y[o + 12], y[o + 13]] };
  const eTerms = acc.recvWork - acc.srcSupplyS, eScale = Math.max(Math.abs(dE), Math.abs(acc.recvWork), Math.abs(acc.srcSupplyS), 1e-300);
  // 角運動量: ΔL_spin = ∫ΣN_ax dt − ∫ΣN_NF dt(NF の反作用は源の自転へ・軌道へは +N_NF —— 軸の応答の反作用は供給の口座へ)
  const lRes = sub(add(dL, nOrbInt), acc.nAx), lScale = Math.max(nrm(dL), nrm(nOrbInt), nrm(acc.nAx), 1e-300);
  return { steps, h, dE, dED, dEoverE0: dE / Math.max(B.reduce((s, b, k) => s + 0.5 * b.I * dot(S0[k], S0[k]), 0), 1e-300), acc, closeE: Math.abs(dE - eTerms) / eScale, closeEabs: dE - eTerms,
    closeL: nrm(lRes) / lScale, ledgerAxial: acc.supply - acc.recvWork - acc.heatPath, heatExcess: acc.heatPath - acc.heatMerged, QnfS: acc.srcSupplyS - acc.pOrb, QnfD: acc.srcSupplyD - acc.pOrb,
    dsRel: B.map((b, k) => nrm(ds[k]) / Math.max(nrm(S0[k]), 1e-300)) };
}

/* ───────── 純関数の場面と門 ───────── */
export function pureScenes() {
  const S = {};
  // 1 口ごとの恒等式 P_in − N·s − Q = 0・合トルク = Γ(ω_field − s)・熱の差の閉じた式・0 の経路は口を持たない・平行な経路は差 0
  { const parts = [{ key: 'a|spinDirect', omega: [3e-5, -1e-6, 2e-5] }, { key: 'a|trans', omega: [-1e-5, 4e-6, 0] }, { key: 'b|spinGrad', omega: [0, 0, 0] }, { key: 'b|spinDirect', omega: [2e-6, 7e-6, -5e-6] }];
    const L = axialLedger({ parts, s: [1e-5, 2e-5, 3e-5], Gamma: 1e30 }), Lp = axialLedger({ parts: [{ key: 'x|spinDirect', omega: [1, 2, 3] }, { key: 'y|spinGrad', omega: [2, 4, 6] }], s: [0, 1, 0], Gamma: 2 });
    S.identity = { id: L.identityRel, torque: L.torqueMergedRel, excess: L.excessRel, nPorts: L.nPorts, parallel: Math.abs(Lp.excess) / Lp.heat, mergedRes: Math.abs(L.merged.residual) / Math.max(L.merged.supply, L.merged.heat, 1e-300), excessPos: L.excess > 0 }; }
  // 2 相殺の否定対照: 逆向きの 2 経路(s = 0)—— 相殺の熱 0・経路の熱 = Γ(2|ω|)²・合トルク 0
  { const L = axialLedger({ parts: [{ key: 'a|spinDirect', omega: [0, 0, 2] }, { key: 'b|trans', omega: [0, 0, -2] }], s: [0, 0, 0], Gamma: 3 });
    S.cancel = { merged: L.merged.heat, path: L.heat, expect: 3 * 16, torque: nrm(L.torque) }; }
  // 3 同期の 0(冥王星–カロンの型 —— 1 つの源・自己の重みなし・剛体の共回り: ω_field = s_src = s_recv)と自己の重みありで 0 でない
  { const pc = pcSystem(), F0 = fieldAt({ at: pc.bodies[0].p, sources: [Object.assign({ key: 'charon' }, pc.bodies[1])], selfRule: 'none', m: pc.bodies[0].m, R: pc.bodies[0].R });
    const Fk = fieldAt({ at: pc.bodies[0].p, sources: [Object.assign({ key: 'charon' }, pc.bodies[1])], selfRule: 'kappaM', m: pc.bodies[0].m, R: pc.bodies[0].R });
    const L0 = axialLedger({ parts: F0.parts, s: pc.bodies[0].s, Gamma: 1 });
    S.sync = { none: nrm(sub(F0.F.omega, pc.bodies[0].s)) / nrm(pc.bodies[0].s), heat0: L0.heat, kappaM: nrm(sub(Fk.F.omega, pc.bodies[0].s)) / nrm(pc.bodies[0].s) }; }
  // 4 押しの帳簿: 円軌道で P = n·N(恒等式)・orbitPush との照らし(NF・傾き 0.1)・i = 0 で Q_S = N(s − n)・Q_D/Q_S = (s_d − n)/(s − n)
  { const src = bodyOf('jupiter'), r1 = pushLedger({ src, m: 1, a: 4.217e8, i: 0.1, col: 'ball', rate: 'fixed', dir: 'NF' }), r0 = pushLedger({ src, m: 1, a: 4.217e8, i: 0, col: 'ball', rate: 'fixed', dir: 'NF' });
    const rs = pushLedger({ src, m: 1, a: 4.217e8, i: 0.1, col: 'slice', rate: 'fixed', dir: 'NF' }), rn = pushLedger({ src, m: 1, a: 4.217e8, i: 0, col: 'ball', rate: 'fixed', dir: 'NS' });
    S.push = { Pn: Math.max(r1.PnRel, r0.PnRel, rs.PnRel, rn.PnRel), vsP: Math.max(r1.vsOrbitPush.P, rs.vsOrbitPush.P), vsNh: Math.max(r1.vsOrbitPush.Nh, rs.vsOrbitPush.Nh), vsNi: Math.max(r1.vsOrbitPush.Ni, rs.vsOrbitPush.Ni),
      tidal: r0.tidalForm, ratio: relD(r0.QDoverQS, r0.QDoverQSformula), nsSign: rn.P < 0 && r0.P > 0 }; }
  // 5 潮汐の勾配: 対称・跡 0・中心差分との照らし・距離の次数 −3
  { const m = 7.342e22, d = [3.0e8, 1.2e8, -0.7e8], T = tidalTensor(m, d), g = (p) => { const r = nrm(p); return scl(p, -DECL.G * m / (r * r * r)); }, hh = 1e3;
    let fd = 0; for (let b = 0; b < 3; b++) { const e = [0, 0, 0]; e[b] = hh; const gp = g(add(d, e)), gm = g(sub(d, e)); for (let a = 0; a < 3; a++) fd = Math.max(fd, Math.abs((gp[a] - gm[a]) / (2 * hh) - T[a][b]) / frob(T)); }
    S.tide = { sym: Math.max(...[0, 1, 2].flatMap((a) => [0, 1, 2].map((b) => Math.abs(T[a][b] - T[b][a])))) / frob(T), trace: Math.abs(T[0][0] + T[1][1] + T[2][2]) / frob(T), fd,
      slope: Math.log2(frob(tidalTensor(m, d)) / frob(tidalTensor(m, scl(d, 2)))) }; }
  // 6 自己の割合: f_self = W_ii/W_t(coordTwist の α)・|d| ≤ (1 − f_self) max|C − v|・自己が 1 に近いとき d が小さい
  { const em = emSystem(), rows = selfShareRow({ recv: Object.assign({}, em.bodies[1]), sources: [Object.assign({}, em.bodies[0])] }), wE = em.bodies[0].m / nrm(sub(em.bodies[1].p, em.bodies[0].p)) ** 2;
    const fExp = (em.bodies[1].m / rows.kappaM.Rself ** 2) / (em.bodies[1].m / rows.kappaM.Rself ** 2 + wE);
    S.self = { f: relD(rows.kappaM.fSelf, fExp), bound: rows.kappaM.boundOk && rows.robs.boundOk, small: rows.kappaM.fSelf > rows.robs.fSelf && rows.kappaM.d < rows.robs.d }; }
  // 7 窓の閉じ(地球–月 —— 刻み h と h/2・τ = 1 公転・自己 none)
  { const em = emSystem(), T = 2 * Math.PI / Math.sqrt(DECL.G * (em.bodies[0].m + em.bodies[1].m) / LIT.bodies.moon.a ** 3);
    const r1 = windowRun(em, { selfRule: 'none', tauSec: T, push: true, steps: 60, T }), r2 = windowRun(em, { selfRule: 'none', tauSec: T, push: true, steps: 120, T });
    S.window = { c1: r1.closeE, c2: r2.closeE, l1: r1.closeL, l2: r2.closeL, ledger: Math.abs(r2.ledgerAxial) / Math.max(Math.abs(r2.acc.supply), 1e-300), excess: r2.heatExcess >= -1e-12 * Math.abs(r2.acc.heatMerged) }; }
  // 8 入力の拒否
  const rej = [() => pathPorts([{ key: 'a', omega: [1, 2] }], 1), () => pathPorts([], -1), () => axialLedger({ parts: [], s: [0, 0], Gamma: 1 }), () => bodyOf('vulcan'),
    () => orbitAverage({ dir: 'NX', col: 'ball', Rd: 1, gamma: 1, sU: 1, Uunit: () => 1, a: 1, i: 0, GM: 1, m: 1 }), () => orbitAverage({ dir: 'NF', col: 'ball', Rd: 1, gamma: 1, sU: 1, Uunit: () => 1, a: 1, i: 4, GM: 1, m: 1 }),
    () => pushLedger({ src: bodyOf('sun'), m: 1, a: 1e11, i: 0, col: 'cube', rate: 'fixed', dir: 'NF' }), () => pushLedger({ src: bodyOf('sun'), m: 1, a: 1e11, i: 0, col: 'ball', rate: 'free', dir: 'NF' }),
    () => tidalTensor(0, [1, 0, 0]), () => tidalTensor(1, [0, 0, 0]), () => partsOfField({}, (j) => j)];
  S.reject = { n: rej.map((f) => { try { f(); return false; } catch (e) { return e instanceof RangeError; } }).filter(Boolean).length, of: rej.length };
  return S;
}
export function pureGates(S) {
  const t = DECL.idTol;
  return {
    identity: S.identity.id <= t && S.identity.torque <= 1e-12 && S.identity.excess <= 1e-9 && S.identity.nPorts === 3 && S.identity.parallel <= 1e-12 && S.identity.mergedRes <= t && S.identity.excessPos,
    cancel: S.cancel.merged === 0 && relD(S.cancel.path, S.cancel.expect) <= t && S.cancel.torque <= 1e-12,
    sync: S.sync.none <= 1e-12 && S.sync.heat0 <= 1e-30 && S.sync.kappaM > 1e-6,
    push: S.push.Pn <= 1e-12 && S.push.vsP <= DECL.pushTol && S.push.vsNh <= DECL.pushTol && S.push.vsNi <= DECL.pushTol && S.push.tidal <= 1e-12 && S.push.ratio <= 1e-12 && S.push.nsSign,
    tide: S.tide.sym <= 1e-15 && S.tide.trace <= 1e-15 && S.tide.fd <= 1e-6 && Math.abs(S.tide.slope - 3) <= 1e-12,
    self: S.self.f <= 1e-12 && S.self.bound && S.self.small,
    window: S.window.c2 <= DECL.window.closeTol && (S.window.c2 <= DECL.window.floor || S.window.c1 / S.window.c2 >= DECL.window.convRatio) && S.window.l2 <= DECL.window.closeTol && S.window.ledger <= 1e-9 && S.window.excess,
    reject: S.reject.n === S.reject.of,
  };
}

/* ───────── 窓の系(円軌道の宣言 —— 重心の静止系・軌道は z = 0 の面・自転軸は x 軸のまわりに傾き obliq)───────── */
function spinVec(b) { return scl(rotX([0, 0, 1], b.obliq), b.s); }
function twoBody(kA, kB, a) {
  const A = bodyOf(kA), Bq = bodyOf(kB), M = A.m + Bq.m, n = Math.sqrt(DECL.G * M / (a * a * a));
  const pA = [-a * Bq.m / M, 0, 0], pB = [a * A.m / M, 0, 0], vA = [0, -n * a * Bq.m / M, 0], vB = [0, n * a * A.m / M, 0];
  return { keys: [kA, kB], n, bodies: [Object.assign(A, { p: pA, v: vA, s: spinVec(A) }), Object.assign(Bq, { p: pB, v: vB, s: spinVec(Bq) })] };
}
/** 冥王星–カロン(相互同期・円軌道・軸は軌道の法線 —— 自転は公転の角速度 n に置く宣言) */
export function pcSystem() {
  const s = twoBody('pluto', 'charon', LIT.bodies.charon.a);
  for (const b of s.bodies) { b.s = [0, 0, s.n]; b.sd = s.n * b.I / b.Id; }
  return s;
}
export function emSystem() { return twoBody('earth', 'moon', LIT.bodies.moon.a); }
export function jiSystem() { return twoBody('jupiter', 'io', LIT.bodies.io.a); }
/** 太陽–水星–金星(各惑星は太陽のまわりの円軌道 —— 惑星どうしの初期の相互の摂動は入れない・全体の重心を引く) */
export function smvSystem() {
  const S0 = bodyOf('sun'), Me = bodyOf('mercury'), Ve = bodyOf('venus'), bs = [Object.assign(S0, { p: [0, 0, 0], v: [0, 0, 0] })];
  for (const [b, ph] of [[Me, 0], [Ve, 2.0]]) { const n = Math.sqrt(DECL.G * (S0.m + b.m) / b.a ** 3); bs.push(Object.assign(b, { p: [b.a * Math.cos(ph), b.a * Math.sin(ph), 0], v: [-n * b.a * Math.sin(ph), n * b.a * Math.cos(ph), 0] })); }
  const M = bs.reduce((s, b) => s + b.m, 0), pc = bs.reduce((a, b) => add(a, scl(b.p, b.m / M)), [0, 0, 0]), vc = bs.reduce((a, b) => add(a, scl(b.v, b.m / M)), [0, 0, 0]);
  for (const b of bs) { b.p = sub(b.p, pc); b.v = sub(b.v, vc); b.s = spinVec(b); }
  return { keys: ['sun', 'mercury', 'venus'], n: Math.sqrt(DECL.G * (S0.m + Me.m) / Me.a ** 3), bodies: bs };
}
export const WINDOW_SYSTEMS = Object.freeze({ smv: smvSystem, em: emSystem, pc: pcSystem, ji: jiSystem });
export { C1 };
