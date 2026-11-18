// 第341便f(原仮定者の補足(2026-11-18 —— 第141報)「引きずり自体は、座標変換なので熱を発生しない。潮汐力などで軸を傾ける力が加わると、ジャイロトルクが発生し、
//   動かなかった分が熱になる。ジャイロトルクの向きは90度ズレるので、継続した力が加わり続ける」・統括の検証項目 R369):
//   **熱の帳簿(座標変換の分は熱 0・軸を傾ける力 → ジャイロ → 動かなかった分が熱)の探索の純関数**
//   (器 tests/exp-w341f-gyroheat.mjs と QA behavior.gyroheat341f・docs.gyroheat341f が読む —— html を読まない・状態を持たない)。
//   **全部「診断」**(エンジン・内蔵の本・受理器・`S._core` へ足す操作ではない)。第337便c・第338便f・第340便f・第335便b・第330便a の lib は呼ぶだけ(本文は変えない)。
//
// ■ 帳簿の 4 段(探索の入り口 —— 式の形は走行の前に決め打ちしない。どれもノブ。何を測ったかの記録)
//   (1) 座標変換として一緒に動く分(並進引きずり —— 回転成分を含む): 熱 0・仕事 0(零試験: 天体が 1 つ・源の座標と一緒に動く受け手)。
//   (2) 軸を傾けようとする外のトルク N: 潮汐(重力の傾きの差)・列 A では軸引きずりの部位差分も(列 B は潮汐だけ —— 台帳 AN803 の 2 列)。
//   (3) 回転体の応答: 動いた分 = 歳差(N ⟂ L の分は自転の大きさを変えない・それ自体の仕事率は 0)・動かなかった分 = 軸を保つために内部が受け持つ分。
//   (4) 熱 = 動かなかった分の散逸(非負)。
//   「動かなかった分」を数にする型を 3 つ並べる(1 つに決めない):
//     (α) 可動度のノブ μ(0 = 軸を遠方宇宙に固定 —— 第128報の計上の極限・1 = 自由に歳差 —— 熱 0): 熱 = (1 − μ) × 保つ仕事率 P_hold = N⊥²/(I ω)
//         (第104報の「1 ステップで回し戻すのに要る」量を、歳差の角速度 Ω_p = N⊥/(I ω) × 保つトルク N⊥ と置いた —— この置き方もノブ)。
//     (β) 内部の変形の応答の型(統括の参考の試作): 内部の傾き・変形 θ(2 成分)に I_d θ̈ + G θ̇ + Γ θ̇ + K θ = N(t)
//         (G は反対称 = ジャイロの 90° の応答・Γ ≥ 0 が散逸・K ≥ 0 が復元)。熱の率 = Γ |θ̇|² ≥ 0・収支 dE_int/dt + 熱の率 = N·θ̇。
//         天体に固定した座標では、遠方に固定した外のトルクの向きが自転で −ω の角速度で回る(周期の駆動)。定常の熱の率(複素の振幅)
//         = Γ ν² N² / ((K − I_d ν² − g ν)² + Γ² ν²)(ν = −ω・g = c_g I_d ω)。
//     (γ) 従来の型(比べる列 —— 第338便f・第340便f: 相対の角速度から直接に熱 Γ₀ I β |c ω_src ĵ − ω ẑ|²・Γ₀ について線形)。
//   潮汐の列は 3 つの型で共通(遅れの型 —— k₂/Q の遅れが「動かなかった分」を既に持つ: 同期の衛星は離心軌道の潮汐・同期でない天体は滑りの潮汐 N_t |ω − n|)。
// ■ 言わないこと: 熱の機構の答え・天体の熱の一致・軸引きずりが熱を出すか出さないかの結論とは書かない(AN803 は伺っている —— 2 列の表)・
//   試算の値を天体の熱の予測と書かない(帳簿の動作の確かめと、要るノブの範囲)・天体の特性の係数を 1 に置いた結果を「合った」と書かない・文献の値は一次資料に当たっていない(未照合)。
import * as TL from './lib-w337c-tidelock.mjs';
import * as HL from './lib-w338f-heatlock.mjs';
import * as S330 from './lib-w330a-spinclass.mjs';
import { carriedVelocity, coordVelocity } from './lib-w335b-carryledger.mjs';

export const LIB_VERSION = 'w341f-gyroheat-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const G = TL.G_SI, C0 = TL.C_SI, YR = TL.YR, D2R = Math.PI / 180, AU = 1.495978707e11;
const val = (id, k) => TL.BODY_SRC[id][k][0];
const SATK = Object.keys({ saturn: 1 })[0];   // 鍵の文字列を引用符で書かない(第327便a と同じ書き方)

/* ───────── 宣言(走らせるノブの格子と判定の物差し —— 式の形の宣言ではなく、何を測ったかの記録)───────── */
export const DECL = Object.freeze({
  /** 零試験(無次元 —— I_d = 1・K = 1・N₀ = 1): 刻み・長さ・周期の駆動の角速度・散逸・ジャイロ */
  zero: Object.freeze({ h: 0.01, T: 200, nu: 0.7, gam: 0.3, g: 1.5, nParts: 64 }),
  /** T2: 自転の角速度 ω(ω_K = 1 の単位)× 緩和の時間 τ = I_d/Γ × ジャイロの係数 c_g(g = c_g I_d ω —— 2 は回る座標のコリオリの係数・0 はジャイロなしの比べる列) */
  t2: Object.freeze({ omega: Object.freeze([0, 0.01, 0.1, 0.3, 1, 3, 10]), tau: Object.freeze([0.3, 3, 30]), cg: Object.freeze([2, 0]), relWin: 2, hMax: 0.02 }),
  /** T3: 可動度 μ・(β) の相対の格子(x = ω τ・r = ω_K/ω・参加する慣性の割合 χ)・(β) の絶対の緩和の時間 [s]・(γ) の読み・「高い内部熱」の割合・天体の特性の係数 */
  t3: Object.freeze({ mu: Object.freeze([0, 0.5, 0.9, 0.99, 1]), betaRel: Object.freeze({ x: Object.freeze([0.1, 1, 10]), r: Object.freeze([0, 1, 10]), chi: Object.freeze([1, 1e-3]), cg: 2 }),
    tauAbs: Object.freeze([1e3, 1e4, 1e5, 1e6, 1e7, 1e8]), gammaReadings: Object.freeze(['diff', 'aligned']), alpha: 2, galTiltDeg: 120, highFrac: 0.1, bodyCoef: 1,
    hot: Object.freeze(['Venus', 'Jupiter']), judge: 'Io' }),
});

/** 文献の値(本環境では一次資料に当たっていない —— 文献の値・未照合・確かさの程度)。リポジトリの中の値を先に呼ぶ */
export const LIT = Object.freeze({
  note: '文献の値・未照合(この環境から一次資料のサイトに届かない —— 出典の名と値は記憶とリポジトリの中の値の写し)',
  heat: Object.freeze({ Io: S330.DECL.lit.heatFlowW.io, Earth: S330.DECL.lit.heatFlowW.earth, Jupiter: S330.DECL.lit.heatFlowW.jupiter, Saturn: S330.DECL.lit.heatFlowW[SATK],
    Moon: HL.LIT.moonHeatW, Enceladus: HL.LIT.enceladusHeatW, Venus: 0.815 * S330.DECL.lit.heatFlowW.earth }),
  heatSrc: Object.freeze({ Io: '第330便a の lib の観測の熱流(全球の放射の桁)—— 確かさ 中', Earth: '第330便a の lib(表面の熱流)—— 確かさ 中', Jupiter: '第330便a の lib(内部の熱の放射の超過)—— 確かさ 中',
    Saturn: '第330便a の lib(内部の熱の放射の超過)—— 確かさ 中', Moon: '第338便f の lib(2 点の熱流の外挿・放射性の熱を含む総量)—— 確かさ 低', Enceladus: '第338便f の lib(南極域の放射)—— 確かさ 中',
    Venus: '金星の熱流は測られていない —— 地球の熱流を質量の比 0.815 で割り付けた桁を「上限の目安」に置いた(観測ではない・確かさ 低)' }),
  ruler: Object.freeze({ Io: 'global', Moon: 'total', Enceladus: 'regional', Earth: 'total', Venus: 'scale', Jupiter: 'total', Saturn: 'total' }),
  k2q: Object.freeze({ Io: HL.LIT.ioK2q, Moon: HL.LIT.moonK2q, Europa: S330.DECL.lit.k2Q.europa, Enceladus: 1e-2, Charon: TL.DECL.bodies.k2qSolid, Pluto: TL.DECL.bodies.k2qSolid,
    Venus: S330.DECL.lit.k2Q.venus, Earth: S330.DECL.lit.k2Q.earth, Jupiter: S330.DECL.lit.k2Q.jupiter, Saturn: S330.DECL.lit.k2Q[SATK] }),
  k2qSrc: 'イオ・月は第338便f の lib・エウロパ・金星・地球・木星・土星は第330便a の lib・エンケラドゥスは代表の桁 1e-2(確かさ 低)・冥王星とカロンは第337便c の固体の既定 3e-3(確かさ 低)',
  /** 自転軸の傾き [deg](受け手の自転の軸と源の自転の軸のなす角 —— 文献の値・未照合・確かさ 中〜低。衛星と主星は主星の赤道面の軌道の近似で 0) */
  obl: Object.freeze({ Venus: 177.36, Earth: 23.44, Jupiter: 3.13, Saturn: 26.73, PlutoSun: 119.6, MoonEarth: 23.44, MoonSun: 1.54 }),
  oblSrc: '自転軸の傾き(金星 177.36°・地球 23.44°・木星 3.13°・土星 26.73°・冥王星 119.6°・月の自転の軸と黄道の極 1.54°・月と地球の軸は地球の傾きの桁)—— 文献の値・未照合・確かさ 中(月と地球の角は交点で変わる —— 確かさ 低)',
  saturnR: 5.8232e7, saturnRSrc: '土星の赤道の半径 58,232 km —— 文献の値・未照合・確かさ 中', saturnC: S330.DECL.lit.moi[SATK],
  charonE: 5e-5, charonESrc: 'カロンの軌道の離心率 〜5e-5 の桁(ほぼ円)—— 文献の値・未照合・確かさ 低',
  plutoPorbD: 90560, plutoPorbSrc: '冥王星の公転の周期 約 90,560 日(248 年)—— 文献の値・未照合・確かさ 中', saturnPorbD: 10759.22,
  europaE: HL.LIT.eccJov.Europa, ioE: HL.LIT.eccJov.Io, moonE: HL.LIT.moonE,
});

/* ───────── (β) 内部の変形の応答の型: 積分(RK4 —— 熱と仕事を同じ段で積む)───────── */
function driveAt(drive, t) {
  if (drive.kind === 'zero') return [0, 0];
  if (drive.kind === 'const') return [drive.N0, 0];
  if (drive.kind === 'rot') return [drive.N0 * Math.cos(drive.nu * t), drive.N0 * Math.sin(drive.nu * t)];
  throw new RangeError('driveAt: 駆動は zero・const・rot');
}
/** 状態 [θx, θy, vx, vy, Q, W] の微分。G θ̇ = g (−v_y, v_x)(反対称) */
function deriv(p, y, t) {
  const N = driveAt(p.drive, t), vx = y[2], vy = y[3];
  const ax = (N[0] - p.gam * vx + p.g * vy - p.K * y[0]) / p.I, ay = (N[1] - p.gam * vy - p.g * vx - p.K * y[1]) / p.I;
  return [vx, vy, ax, ay, p.gam * (vx * vx + vy * vy), N[0] * vx + N[1] * vy];
}
/** 積分: I > 0・K ≥ 0・Γ ≥ 0・g は有限・刻み h > 0・長さ T > 0。窓 win(最後の幅)の熱の率の平均・収支の残り(尺度つき)を返す */
export function integrate({ I = 1, K = 1, gam, g = 0, drive, h, T, y0 = [0, 0, 0, 0], win = 0 }) {
  if (!(fin(I) && I > 0 && fin(K) && K >= 0 && fin(gam) && gam >= 0 && fin(g) && fin(h) && h > 0 && fin(T) && T > 0 && fin(win) && win >= 0 && win < T)) throw new RangeError('integrate: I > 0・K ≥ 0・Γ ≥ 0・g・h > 0・T > 0・0 ≤ win < T');
  const p = { I, K, gam, g, drive }, n = Math.ceil(T / h), dt = T / n, nWin = Math.round(win / dt);
  let y = [y0[0], y0[1], y0[2], y0[3], 0, 0], t = 0, Emax = 0, Qwin0 = null, peakRate = 0;
  const En = (s) => 0.5 * I * (s[2] * s[2] + s[3] * s[3]) + 0.5 * K * (s[0] * s[0] + s[1] * s[1]), E0 = En(y);
  for (let k = 0; k < n; k++) {
    if (nWin > 0 && k === n - nWin) Qwin0 = y[4];
    const k1 = deriv(p, y, t), y2 = y.map((v, i) => v + 0.5 * dt * k1[i]), k2 = deriv(p, y2, t + 0.5 * dt), y3 = y.map((v, i) => v + 0.5 * dt * k2[i]), k3 = deriv(p, y3, t + 0.5 * dt),
      y4 = y.map((v, i) => v + dt * k3[i]), k4 = deriv(p, y4, t + dt);
    y = y.map((v, i) => v + dt / 6 * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i])); t += dt;
    const e = En(y); if (e > Emax) Emax = e;
    const rate = gam * (y[2] * y[2] + y[3] * y[3]); if (rate > peakRate) peakRate = rate;
  }
  const E1 = En(y), Q = y[4], W = y[5], resid = E1 - E0 + Q - W, scale = Math.max(Math.abs(W), Q, Emax, E0);
  return { Q, W, E0, E1, resid, scale, residRel: scale > 0 ? Math.abs(resid) / scale : 0, rateWin: nWin > 0 ? (Q - Qwin0) / (nWin * dt) : null, peakRate, rateEnd: gam * (y[2] * y[2] + y[3] * y[3]), steps: n };
}
/** 定常の熱の率(回る駆動 N₀ e^{iνt} の複素の振幅)= Γ ν² N₀² / ((K − I ν² − g ν)² + Γ² ν²)。ν = 0 は 0(静かな変形) */
export function steadyRate({ I = 1, K = 1, gam, g = 0, nu, N0 = 1 }) {
  if (!(fin(I) && I > 0 && fin(K) && K >= 0 && fin(gam) && gam >= 0 && fin(g) && fin(nu) && fin(N0))) throw new RangeError('steadyRate: 入力は有限');
  if (nu === 0 || gam === 0) return 0;
  const re = K - I * nu * nu - g * nu, im = gam * nu;
  return gam * nu * nu * N0 * N0 / (re * re + im * im);
}

/* ───────── (1) 座標変換の分の零試験(部位の帳簿 —— 第335便b の自己を運ぶ式)───────── */
/** 受け手の部位(球面のフィボナッチの点)。部位 k の速度 u_k = v + s × (p_k − p) */
function partsOf(n, R) {
  const out = [], ga = Math.PI * (3 - Math.sqrt(5));
  for (let k = 0; k < n; k++) { const z = 1 - 2 * (k + 0.5) / n, rr = Math.sqrt(1 - z * z), ph = ga * k; out.push([R * rr * Math.cos(ph), R * rr * Math.sin(ph), R * z]); }
  return out;
}
/** 部位ごとの引きずりの差 d_k(第335便b の式)から、受け手の中心のまわりのトルク Σ r_k × d_k と、その尺度 Σ |r_k| |C_k| を返す */
export function partsTorque({ recv, sources, selfW = 1, n = DECL.zero.nParts, R = 1 }) {
  const P = partsOf(n, R); let tq = [0, 0, 0], scale = 0;
  for (const r of P) {
    const pk = [recv.p[0] + r[0], recv.p[1] + r[1], recv.p[2] + r[2]], uk = coordVelocity({ p: recv.p, v: recv.v, s: recv.s }, pk);
    const src = sources.map((q) => ({ w: q.w, C: coordVelocity(q, pk) }));
    const cv = carriedVelocity({ v: uk, selfW, sources: src }), d = cv.d;
    tq = [tq[0] + r[1] * d[2] - r[2] * d[1], tq[1] + r[2] * d[0] - r[0] * d[2], tq[2] + r[0] * d[1] - r[1] * d[0]];
    scale += Math.hypot(...r) * src.reduce((s, q) => s + q.w * Math.hypot(...q.C), Math.hypot(...uk));
  }
  return { torque: tq, scale, rel: scale > 0 ? Math.hypot(...tq) / scale : 0 };
}

/* ───────── (α) 可動度のノブ ───────── */
/** 保つ仕事率 P_hold = N⊥²/(I ω)(ω > 0 が要る —— 回っていない天体はジャイロが無く、傾ける力の向きへ倒れる: 型 (α) の外) */
export function holdPower(Nperp, I, omega) {
  if (!(fin(Nperp) && Nperp >= 0 && fin(I) && I > 0 && fin(omega))) throw new RangeError('holdPower: N⊥ ≥ 0・I > 0・ω は有限');
  if (omega === 0) return null;
  return Nperp * Nperp / (I * Math.abs(omega));
}
export function alphaHeat(Nperp, I, omega, mu) {
  if (!(fin(mu) && mu >= 0 && mu <= 1)) throw new RangeError('alphaHeat: 0 ≤ μ ≤ 1');
  const P = holdPower(Nperp, I, omega); return P === null ? null : (1 - mu) * P;
}
/** (β) を (α) と同じ形に書いたときの係数 F(熱 = F × P_hold): 相対の格子 F = x / (χ (x² (r² + c_g − 1)² + 1))・x = ω τ・r = ω_K/ω */
export const betaRelF = ({ x, r, chi, cg }) => { const a = r * r + cg - 1; return x / (chi * (x * x * a * a + 1)); };
/** (β) の絶対の緩和の時間(ω_K = 0・c_g = 2・χ = 1): F = x/(x² + 1)・x = ω τ */
export const betaAbsF = (omega, tau) => { const x = Math.abs(omega) * tau; return x / (x * x + 1); };

/* ───────── T3 天体の行 ───────── */
const spinW = (id) => 2 * Math.PI / val(id, 'spin');
const nOf = (P) => 2 * Math.PI / P;
/** 受け手の行: 質量・半径・慣性・自転 ω(符号つき —— 金星は負)・公転 n・潮汐の相手(ecc = 同期の離心軌道・slip = 滑り)・傾ける力の源(β・源の自転・軸のなす角)・熱の物差し */
export function bodyRows() {
  const T3 = DECL.t3, th = T3.galTiltDeg * D2R, gal = { src: 'galaxy', beta: TL.GALAXY.beta, w: TL.GALAXY.omega, theta: th };
  const sunB = (d) => G * val('Sun', 'M') / (d * C0 * C0), wSun = spinW('Sun');
  const nHel = (id) => nOf(val(id, 'porb'));
  const satHost = (id, host, hostSpin, hostAhel, hostNhel, hostObl, e, extra = {}) => {
    const M = val(id, 'M'), R = val(id, 'R'), C = val(id, 'C'), a = val(id, 'a'), n = nOf(val(id, 'porb')), Mp = host === 'Saturn' ? HL.LIT.saturn.M : val(host, 'M');
    return Object.assign({ id, host, sync: true, M, R, C, I: C * M * R * R, omega: n, n, a, e, Mp,
      tides: [{ p: host, kind: 'ecc', Mp, a, n, e }, { p: 'Sun', kind: 'slip', Mp: val('Sun', 'M'), a: hostAhel, nP: hostNhel }],
      tilt: [{ src: host, beta: G * Mp / (a * C0 * C0), w: hostSpin, theta: (extra.hostTheta || 0) * D2R }, { src: 'Sun', beta: sunB(hostAhel), w: wSun, theta: hostObl * D2R }, gal] }, extra);
  };
  const jS = spinW('Jupiter'), jA = val('Jupiter', 'aHel'), eS = spinW('Earth'), eA = val('Earth', 'aHel');
  const satS = 2 * Math.PI / (HL.LIT.saturn.spinH * 3600), satA = HL.LIT.saturn.aAU * AU, plA = val('Pluto', 'aHel'), plS = spinW('Pluto');
  const E = HL.LIT.enceladus, PL_NHEL = 2 * Math.PI / (LIT.plutoPorbD * 86400);
  const rows = [
    satHost('Io', 'Jupiter', jS, jA, nOf(val('Jupiter', 'porb')), LIT.obl.Jupiter, LIT.ioE),
    satHost('Europa', 'Jupiter', jS, jA, nOf(val('Jupiter', 'porb')), LIT.obl.Jupiter, LIT.europaE),
    satHost('Moon', 'Earth', eS, eA, nHel('Earth'), LIT.obl.MoonSun, LIT.moonE, { hostTheta: LIT.obl.MoonEarth }),
    (() => { const I = E.C * E.M * E.R * E.R, n = nOf(E.P); return { id: 'Enceladus', host: 'Saturn', sync: true, M: E.M, R: E.R, C: E.C, I, omega: n, n, a: E.a, e: E.e, Mp: HL.LIT.saturn.M,
      tides: [{ p: 'Saturn', kind: 'ecc', Mp: HL.LIT.saturn.M, a: E.a, n, e: E.e }, { p: 'Sun', kind: 'slip', Mp: val('Sun', 'M'), a: satA, nP: 2 * Math.PI / (LIT.saturnPorbD * 86400) }],
      tilt: [{ src: 'Saturn', beta: G * HL.LIT.saturn.M / (E.a * C0 * C0), w: satS, theta: 0 }, { src: 'Sun', beta: sunB(satA), w: wSun, theta: LIT.obl.Saturn * D2R }, gal] }; })(),
    satHost('Charon', 'Pluto', plS, plA, PL_NHEL, LIT.obl.PlutoSun, LIT.charonE, { mutual: true }),
    (() => { const M = val('Pluto', 'M'), R = val('Pluto', 'R'), C = val('Pluto', 'C'), a = val('Charon', 'a'), n = plS, Mp = val('Charon', 'M');
      return { id: 'Pluto', host: 'Charon', sync: true, mutual: true, M, R, C, I: C * M * R * R, omega: n, n, a, e: LIT.charonE, Mp,
        tides: [{ p: 'Charon', kind: 'ecc', Mp, a, n, e: LIT.charonE }, { p: 'Sun', kind: 'slip', Mp: val('Sun', 'M'), a: plA, nP: PL_NHEL }],
        tilt: [{ src: 'Charon', beta: G * Mp / (a * C0 * C0), w: n, theta: 0 }, { src: 'Sun', beta: sunB(plA), w: wSun, theta: LIT.obl.PlutoSun * D2R }, gal] }; })(),
  ];
  const planet = (id, M, R, C, omega, aHel, nH, obl, extraTides = []) => ({ id, host: 'Sun', sync: false, M, R, C, I: C * M * R * R, omega, n: nH, a: aHel, e: null, Mp: val('Sun', 'M'),
    tides: [{ p: 'Sun', kind: 'slip', Mp: val('Sun', 'M'), a: aHel, nP: nH }, ...extraTides], tilt: [{ src: 'Sun', beta: sunB(aHel), w: wSun, theta: obl * D2R }, gal] });
  rows.push(planet('Venus', val('Venus', 'M'), val('Venus', 'R'), val('Venus', 'C'), spinW('Venus'), val('Venus', 'aHel'), nHel('Venus'), LIT.obl.Venus));
  rows.push(planet('Earth', val('Earth', 'M'), val('Earth', 'R'), val('Earth', 'C'), eS, eA, nHel('Earth'), LIT.obl.Earth,
    [{ p: 'Moon', kind: 'slip', Mp: val('Moon', 'M'), a: val('Moon', 'a'), nP: nOf(val('Moon', 'porb')) }]));
  rows.push(planet('Jupiter', val('Jupiter', 'M'), val('Jupiter', 'R'), val('Jupiter', 'C'), jS, jA, nOf(val('Jupiter', 'porb')), LIT.obl.Jupiter,
    [{ p: 'Io', kind: 'slip', Mp: val('Io', 'M'), a: val('Io', 'a'), nP: nOf(val('Io', 'porb')) }]));
  rows.push(planet('Saturn', HL.LIT.saturn.M, LIT.saturnR, LIT.saturnC, satS, satA, 2 * Math.PI / (LIT.saturnPorbD * 86400), LIT.obl.Saturn));
  return rows;
}
/** 潮汐の熱(遅れの型 —— 3 つの型で共通): ecc = (21/2)(k₂/Q) G M_p² R⁵ n e²/a⁶・slip = (3/2)(k₂/Q) G M_p² R⁵/a⁶ × |ω − n_p| */
export function tideHeat(row, k2q = LIT.k2q[row.id]) {
  if (!(fin(k2q) && k2q >= 0)) throw new RangeError('tideHeat: k₂/Q ≥ 0');
  const parts = row.tides.map((t) => {
    const Nt = 1.5 * k2q * G * t.Mp * t.Mp * Math.pow(row.R, 5) / Math.pow(t.a, 6);
    if (t.kind === 'ecc') return { p: t.p, kind: t.kind, heat: 7 * Nt * t.n * t.e * t.e, torque: Nt };
    return { p: t.p, kind: t.kind, heat: Nt * Math.abs(row.omega - t.nP), torque: Nt };
  });
  return { k2q, parts, heat: parts.reduce((s, q) => s + q.heat, 0) };
}
/** 傾ける力(列 A —— 軸引きずりの部位差分の、受け手の自転の軸に垂直の分)の源ごとの大きさ(Γ₀ = 1・天体の特性の係数 k)N_j = k I β_j |c| ω_j sin θ_j。
 *  c = 1 − α(赤道面の差分の読み —— α 2 で −1。大きさだけを使う) */
export function tiltTorques(row, k = DECL.t3.bodyCoef) {
  const c = Math.abs(1 - DECL.t3.alpha);
  return row.tilt.map((q) => ({ src: q.src, beta: q.beta, w: q.w, thetaDeg: q.theta / D2R, N: k * row.I * q.beta * c * Math.abs(q.w) * Math.abs(Math.sin(q.theta)),
    Nalong: k * row.I * q.beta * c * Math.abs(q.w) * Math.cos(q.theta) }));
}
/** (γ) 従来の型の熱(Γ₀ = 1 —— 線形): Σ_j I β_j |c ω_j ĵ − ω ẑ|²(ĵ = (sin θ_j, 0, cos θ_j)) */
export function gammaUnit(row, reading) {
  const c = reading === 'aligned' ? 1 : 1 - DECL.t3.alpha;
  if (!DECL.t3.gammaReadings.includes(reading)) throw new RangeError('gammaUnit: 読みは ' + DECL.t3.gammaReadings.join('・'));
  const ports = row.tilt.map((q) => { const sx = c * q.w * Math.sin(q.theta), sz = c * q.w * Math.cos(q.theta) - row.omega; return { src: q.src, u: row.I * q.beta * (sx * sx + sz * sz) }; });
  return { reading, ports, u: ports.reduce((s, q) => s + q.u, 0) };
}
/** 1 行の帳簿(Γ₀ = 1 の単位): 潮汐の熱・傾ける力の源ごと・保つ仕事率(源ごとに足す —— 打ち消さない)・正味の上限と下限・(γ) の単位・銀河の取り分 */
export function ledgerRow(row) {
  const td = tideHeat(row), tq = tiltTorques(row), sumN2 = tq.reduce((s, q) => s + q.N * q.N, 0), sumN = tq.reduce((s, q) => s + q.N, 0), maxN = Math.max(...tq.map((q) => q.N));
  const hold = (N2) => N2 / (row.I * Math.abs(row.omega));
  const gD = gammaUnit(row, 'diff'), gA = gammaUnit(row, 'aligned'), galN = tq.find((q) => q.src === 'galaxy').N;
  const gGal = gD.ports.find((q) => q.src === 'galaxy').u;
  return { id: row.id, host: row.host, sync: row.sync, mutual: !!row.mutual, I: row.I, omega: row.omega, n: row.n, e: row.e, tide: td, tilt: tq,
    uHold: hold(sumN2), uHoldNetMax: hold(sumN * sumN), uHoldNetMin: hold(Math.max(0, 2 * maxN - sumN) ** 2),
    galShareNew: sumN2 > 0 ? galN * galN / sumN2 : null, galShareOld: gD.u > 0 ? gGal / gD.u : null,
    galNewOverOldTorque: galN / (row.I * TL.GALAXY.beta * Math.hypot(-TL.GALAXY.omega * Math.sin(DECL.t3.galTiltDeg * D2R), -TL.GALAXY.omega * Math.cos(DECL.t3.galTiltDeg * D2R) - row.omega)),
    uGammaDiff: gD.u, uGammaAligned: gA.u, heatObs: LIT.heat[row.id] === undefined ? null : LIT.heat[row.id], ruler: LIT.ruler[row.id] || null };
}

/* ───────── T3 窓(Γ₀ —— 分類の帯・イオの熱以下・金星と木星で高い内部熱)───────── */
/** 第337便c の分類の帯(Γ₀ —— ロックしている行は Γ₀ < X・していない行は Γ₀ > X)。熱の帳簿を変えても、分類はトルクの比なので同じ帯 */
export const classBand = () => { const s = TL.bodyTable().sepX; return { lo: s.band[0], hi: s.band[1], separable: s.separable }; };
/**
 * 型 (p = 2 の型: α・β —— 熱 = 潮汐 + F × Γ₀² × u_hold/p = 1 の型: γ —— 熱 = 潮汐 + Γ₀ × u_γ) の窓: 熱の係数 X(α は (1 − μ)Γ₀²・γ は Γ₀)が
 * [need, cap] に入るか(need = 金星と木星の「高い内部熱」に要る最大・cap = イオの熱の残り)。分類の帯 [lo, hi] と重ねる。
 * uOf(id) は Γ₀^p あたりの熱(W)。
 */
export function windowOf(L, uOf, p, band = classBand(), D = DECL.t3) {
  const io = L.find((r) => r.id === D.judge), capRaw = io.heatObs - io.tide.heat, cap = capRaw <= 0 ? 0 : capRaw / uOf(io.id);
  const need = D.hot.map((id) => { const r = L.find((x) => x.id === id), gap = D.highFrac * r.heatObs - r.tide.heat, u = uOf(id); return { id, gap, u, need: gap <= 0 ? 0 : (u > 0 ? gap / u : Infinity) }; });
  const needMax = Math.max(...need.map((q) => q.need));
  const bLo = Math.pow(band.lo, p), bHi = Math.pow(band.hi, p);
  const ioOk = capRaw > 0, hotOk = needMax <= cap;
  return { p, ioTideOverObs: io.tide.heat / io.heatObs, cap, need, needMax, bandP: [bLo, bHi], ioOk, hotOk,
    /** p = 2 の型は X = (1 − μ)Γ₀² が 0〜Γ₀² を取れる(μ を 1 へ寄せれば下げられる)ので、帯の下端は効かない —— 上端だけ: needMax ≤ min(cap, bHi) */
    overlapMu: ioOk && needMax <= Math.min(cap, bHi), overlapFixed: ioOk && Math.max(needMax, bLo) <= Math.min(cap, bHi) };
}

/* ───────── 純関数の場面(零試験 —— 共通の物差し)───────── */
export function pureScenes() {
  const Z = DECL.zero;
  const z1 = integrate({ gam: Z.gam, g: Z.g, drive: { kind: 'zero' }, h: Z.h, T: Z.T });
  const z2 = integrate({ gam: 0, g: Z.g, drive: { kind: 'rot', N0: 1, nu: Z.nu }, h: Z.h, T: Z.T, y0: [0.1, 0, 0, 0.2] });
  // (1) 天体が 1 つ(源なし —— d = 0)と、源の座標と一緒に回る受け手(並進 + 回転の座標変換)
  const one = partsTorque({ recv: { p: [0, 0, 0], v: [3, -1, 2], s: [0.2, -0.4, 1.1] }, sources: [] });
  const srcB = { p: [10, 2, -1], v: [1, 0.5, 0], s: [0, 0.3, 0.9] }, pr = [0, 0, 0];
  const co = partsTorque({ recv: { p: pr, v: coordVelocity(srcB, pr), s: srcB.s }, sources: [Object.assign({ w: 2.5 }, srcB)] });
  const z4 = integrate({ gam: Z.gam, g: Z.g, drive: { kind: 'const', N0: 1 }, h: Z.h, T: 400 });
  const z5a = integrate({ gam: Z.gam, g: Z.g, drive: { kind: 'rot', N0: 1, nu: Z.nu }, h: Z.h, T: Z.T, win: 2 * Math.PI / Z.nu * 4 });
  const z5b = integrate({ gam: Z.gam, g: Z.g, drive: { kind: 'rot', N0: 1, nu: Z.nu }, h: Z.h / 2, T: Z.T, win: 2 * Math.PI / Z.nu * 4 });
  const st = steadyRate({ gam: Z.gam, g: Z.g, nu: Z.nu });
  const rej = [() => integrate({ gam: -1, drive: { kind: 'zero' }, h: 0.1, T: 1 }), () => integrate({ I: 0, gam: 1, drive: { kind: 'zero' }, h: 0.1, T: 1 }), () => alphaHeat(1, 1, 1, 1.5),
    () => holdPower(-1, 1, 1), () => tideHeat(bodyRows()[0], -1), () => gammaUnit(bodyRows()[0], 'other')].map((f) => { try { f(); return false; } catch (e) { return e instanceof RangeError; } });
  return {
    z1: { Q: z1.Q, W: z1.W, resid: z1.resid },
    z2: { Q: z2.Q, residRel: z2.residRel },
    z3: { oneRel: one.rel, coRel: co.rel, oneZero: one.rel < 1e-12, coZero: co.rel < 1e-12 },
    z4: { Q: z4.Q, Qwant: 0.5, rateEndOverPeak: z4.rateEnd / z4.peakRate, residRel: z4.residRel },
    z5: { rateA: z5a.rateWin, rateB: z5b.rateWin, steady: st, halfRel: Math.abs(z5a.rateWin - z5b.rateWin) / z5b.rateWin, steadyRel: Math.abs(z5b.rateWin - st) / st, residA: z5a.residRel, residB: z5b.residRel },
    alpha: { mu1: alphaHeat(2, 3, 0.5, 1), mu0: alphaHeat(2, 3, 0.5, 0), noSpin: alphaHeat(2, 3, 0, 0) },
    betaAsAlpha: { F: betaRelF({ x: 1, r: 0, chi: 1, cg: 2 }), peak: Math.max(...[0.25, 0.5, 1, 2, 4].map((x) => betaRelF({ x, r: 0, chi: 1, cg: 2 }))) },
    rejects: rej,
  };
}
export function pureGates(S) {
  return {
    zeroDrive: S.z1.Q === 0 && S.z1.W === 0 && S.z1.resid === 0,
    gyroOnly: S.z2.Q === 0 && S.z2.residRel < 1e-8,
    coordZero: S.z3.oneZero === true && S.z3.coZero === true,
    constRelax: Math.abs(S.z4.Q - S.z4.Qwant) < 1e-6 && S.z4.rateEndOverPeak < 1e-6 && S.z4.residRel < 1e-8,
    periodic: S.z5.rateA > 0 && S.z5.halfRel < 1e-6 && S.z5.steadyRel < 1e-3 && S.z5.residA < 1e-8 && S.z5.residB < 1e-8,
    alphaEnds: S.alpha.mu1 === 0 && Math.abs(S.alpha.mu0 - 4 / 1.5) < 1e-15 && S.alpha.noSpin === null,
    betaAsAlpha: Math.abs(S.betaAsAlpha.F - 0.5) < 1e-15 && S.betaAsAlpha.peak === 0.5,
    rejects: S.rejects.every(Boolean) && S.rejects.length === 6,
  };
}

/* ───────── T2 「90 度ズレるので、継続した力が加わり続ける」を数で ───────── */
/** 斉次の解の最も遅い減衰の率(I s² + (Γ + i g) s + K = 0 の根の実部の最小の大きさ)—— 緩和の時間 t_r = 1/率 */
export function slowestDecay({ I = 1, K = 1, gam, g }) {
  const br = gam / I, bi = g / I, dr = br * br - bi * bi - 4 * K / I, di = 2 * br * bi, m = Math.hypot(dr, di);
  const sr = Math.sqrt(Math.max(0, (m + dr) / 2)), si = Math.sign(di) * Math.sqrt(Math.max(0, (m - dr) / 2));
  const r1 = (-br + sr) / 2, r2 = (-br - sr) / 2;   // 根の実部(虚部は使わない)
  void si; return Math.min(Math.abs(r1), Math.abs(r2));
}
/**
 * 1 行(無次元 —— I_d = 1・K = 1・N₀ = 1・遠方に固定した一定のトルク): 天体に固定した座標では駆動の角速度 ν = −ω。
 *   ω > 0: 定常の解から始め、最後の relWin 周期の熱の率を定常の式と比べる(続く熱)/ω = 0: 静止から始め、緩和の時間の 12 倍の後の熱の率(止まる熱)。
 *   coRot = 真: 回っているがトルクの向きが天体と一緒に回る(潮汐ロックの円軌道の型 —— ν = 0)。
 */
export function t2Row({ omega, tau, cg, coRot = false, D = DECL.t2 }) {
  if (!(fin(omega) && omega >= 0 && fin(tau) && tau > 0 && fin(cg))) throw new RangeError('t2Row: ω ≥ 0・τ > 0・c_g は有限');
  const gam = 1 / tau, g = cg * omega, nu = coRot ? 0 : -omega, tr = 1 / slowestDecay({ gam, g });
  const h = Math.min(D.hMax, 0.05 / Math.max(1, omega, Math.abs(g), gam));
  const base = { omega, tau, cg, coRot, nu, drivePeriod: nu === 0 ? null : 2 * Math.PI / Math.abs(nu), gyroPeriod: g === 0 ? null : 2 * Math.PI / Math.abs(g), relaxTime: tr };
  if (nu === 0) {
    const T = 12 * tr, R = integrate({ gam, g, drive: { kind: 'const', N0: 1 }, h, T, win: Math.min(tr, T / 2) });
    return Object.assign(base, { start: 'rest', T, steps: R.steps, rateEnd: R.rateWin, steady: 0, peakRate: R.peakRate, endOverPeak: R.rateWin / R.peakRate, Q: R.Q, Qwant: 0.5, residRel: R.residRel, persists: false });
  }
  const re = 1 - nu * nu - g * nu, im = gam * nu, den = re * re + im * im, Ar = re / den, Ai = -im / den;   // A = 1/(re + i im)
  const y0 = [Ar, Ai, -nu * Ai, nu * Ar], win = D.relWin * 2 * Math.PI / Math.abs(nu), R = integrate({ gam, g, drive: { kind: 'rot', N0: 1, nu }, h, T: win * 1.0000001, y0, win });
  const st = steadyRate({ gam, g, nu });
  return Object.assign(base, { start: 'steady', T: win, steps: R.steps, rateEnd: R.rateWin, steady: st, steadyRel: Math.abs(R.rateWin - st) / st, residRel: R.residRel, persists: st > 0 });
}
export function t2Table(D = DECL.t2) {
  const rows = [];
  for (const cg of D.cg) for (const tau of D.tau) { for (const omega of D.omega) rows.push(t2Row({ omega, tau, cg })); rows.push(t2Row({ omega: 1, tau, cg, coRot: true })); }
  return rows;
}

/* ───────── T3 の窓の表(列 A・列 B × 型 α・β・γ)───────── */
export function t3Tables(D = DECL.t3) {
  const L = bodyRows().map(ledgerRow), band = classBand(), byId = (id) => L.find((r) => r.id === id);
  const uHold = (id) => byId(id).uHold;
  // 列 A
  const alpha = windowOf(L, uHold, 2, band, D);
  const muAt = (G0) => { const G2 = G0 * G0; return { G0, muLo: Math.max(0, 1 - alpha.cap / G2), muHi: Math.min(1, 1 - alpha.needMax / G2) }; };
  const betaRel = [];
  for (const chi of D.betaRel.chi) for (const r of D.betaRel.r) for (const x of D.betaRel.x) {
    const F = betaRelF({ x, r, chi, cg: D.betaRel.cg }), W = windowOf(L, (id) => F * uHold(id), 2, band, D);
    betaRel.push({ chi, r, x, F, beyondMu0: F > 1, cap: W.cap, needMax: W.needMax, overlapFixed: W.overlapFixed, hiHeatIo: F * uHold('Io') * band.hi * band.hi });
  }
  const betaAbs = D.tauAbs.map((tau) => { const W = windowOf(L, (id) => betaAbsF(byId(id).omega, tau) * uHold(id), 2, band, D);
    return { tau, F: Object.fromEntries(L.map((r) => [r.id, betaAbsF(r.omega, tau)])), cap: W.cap, needMax: W.needMax, overlapFixed: W.overlapFixed, needOverBandHi2: W.needMax / (band.hi * band.hi) }; });
  const gamma = D.gammaReadings.map((rd) => { const W = windowOf(L, (id) => (rd === 'diff' ? byId(id).uGammaDiff : byId(id).uGammaAligned), 1, band, D);
    return { reading: rd, cap: W.cap, needMax: W.needMax, overlapFixed: W.overlapFixed, ioAtBandLo: (rd === 'diff' ? byId('Io').uGammaDiff : byId('Io').uGammaAligned) * band.lo / byId('Io').heatObs }; });
  // 列 B(軸引きずりも熱 0 —— 潮汐だけ): Γ₀ に依らない
  const colB = L.map((r) => ({ id: r.id, tide: r.tide.heat, obs: r.heatObs, ratio: r.heatObs ? r.tide.heat / r.heatObs : null, ruler: r.ruler }));
  const hotB = D.hot.map((id) => { const r = byId(id); return { id, ratio: r.tide.heat / r.heatObs, high: r.tide.heat >= D.highFrac * r.heatObs }; });
  // 帯の上端で(列 A・α の μ = 0 —— 第128報の極限)の各天体の熱
  const atHi = L.map((r) => ({ id: r.id, tide: r.tide.heat, axialMu0: r.uHold * band.hi * band.hi, gammaDiff: r.uGammaDiff * band.hi, obs: r.heatObs, ruler: r.ruler,
    totalOverObs: r.heatObs ? (r.tide.heat + r.uHold * band.hi * band.hi) / r.heatObs : null }));
  // T4 源ごとに足す(打ち消さない)と正味のトルクで読む列の差(主にしない —— 差の大きさだけ)
  const t4 = L.map((r) => ({ id: r.id, sep: r.uHold, netMax: r.uHoldNetMax, netMin: r.uHoldNetMin, netMaxOverSep: r.uHoldNetMax / r.uHold, netMinOverSep: r.uHoldNetMin / r.uHold,
    dominant: r.tilt.reduce((a, q) => (q.N > a.N ? q : a), r.tilt[0]).src }));
  // T5 入口: 帯の候補(潮汐 ÷ 傾ける力 —— Γ₀ = 1)と状態
  const t5 = L.map((r) => { const tq = r.tilt.reduce((s, q) => s + q.N, 0), tt = r.tide.parts.reduce((s, q) => s + q.torque, 0); return { id: r.id, sync: r.sync, Xtilt: tq > 0 ? tt / tq : null, galShareNew: r.galShareNew }; });
  // 次に足すノブの試し: 傾ける力の結びつきの係数 k_tilt(分類の Γ₀ と分ける —— 天体に共通の 1 つ)。Γ₀ = 帯の上端・μ = 0 で 3 つの窓が重なる k_tilt の範囲
  const kLo = Math.sqrt(alpha.needMax) / band.hi, kHi = Math.sqrt(alpha.cap) / band.hi;
  const kTilt = { G0: band.hi, mu: 0, kLo, kHi, open: alpha.ioOk && kLo <= kHi,
    atLo: L.map((r) => ({ id: r.id, ruler: r.ruler, heat: r.tide.heat + kLo * kLo * band.hi * band.hi * r.uHold, overObs: r.heatObs ? (r.tide.heat + kLo * kLo * band.hi * band.hi * r.uHold) / r.heatObs : null })) };
  // T5 入口: 傾ける力の物差しで分類を読み直すと 1 本で分けられるか(潮汐のトルク ÷ 傾ける力 —— 結論にしない)
  const t5sep = (() => { const lk = t5.filter((q) => q.sync).map((q) => q.Xtilt), nl = t5.filter((q) => !q.sync).map((q) => q.Xtilt), lo = Math.max(...nl), hi = Math.min(...lk);
    return { lo, hi, separable: hi > lo, loBy: t5.find((q) => q.Xtilt === lo).id, hiBy: t5.find((q) => q.Xtilt === hi).id }; })();
  return { band, ledger: L, alpha: Object.assign(alpha, { muAtLo: muAt(band.lo), muAtHi: muAt(band.hi) }), betaRel, betaAbs, gamma, colB, hotB, atHi, t4, t5, t5sep, kTilt };
}
