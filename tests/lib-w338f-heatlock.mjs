// 第338便f(原仮定者の回答(2026-11-15 —— 第138報の回答 4)「イオは潮汐ロックしているので、内部熱の検証用」
//   「金星の「地球との共鳴」は、向きが合う共鳴なので軸引きずりでは無い。月の潮汐ロックと同じ力なので、候補は潮汐力、次点は地球磁場」・原仮定者の指示(2026-11-15 —— 第139報)・統括の検証項目 R354):
//   **熱と共鳴の探索の純関数** —— T1 イオの内部熱を熱の帳簿で読む(離心軌道の潮汐の発熱・第337便c の秤動の分・第326便の口と第337便a の熱の上限で読む軸引きずりの熱・第337便d の加減速の差の型の熱)/
//   T2 金星と地球の共鳴を潮汐力で読む(永久の変形の復元の強さ・共鳴の調和の成分・正味の外部のトルクの残り・定常の解と捕まる範囲の 2 段・月の対照)/T3 地球磁場(次点 —— 磁気圏の尾の届き方と誘導のトルクの上限の桁)/
//   T4 3 つを 1 表に(器 tests/exp-w338f-heatlock.mjs と QA behavior.heatlock338f・docs.heatlock338f が読む —— html を読まない・状態を持たない)。
//   **全部「診断」**(エンジン・内蔵の本・受理器・`S._core` へ足す操作ではない)。第337便c・第326便d・第337便d・第337便a・第335便b の lib は呼ぶだけ(本文は変えない)。
//
// ■ 置き方(探索の入り口 —— 式の形は走行の前に決め打ちしない。どれもノブ。何を測ったかの記録)
//   (i) 離心軌道の潮汐の発熱(標準の式の形 —— 同期した受け手・小さい e): Ė = (21/2)(k₂/Q) G M_p² R⁵ n e²/a⁶(k₂/Q はノブ)。
//   (ii) 第337便c の型 I ṡ = −K (a/r)³ sin 2(θ − f) − Γ (a/r)⁶ (s − ḟ) の周期の解(射撃 `periodicSpin`)で、秤動が残す散逸 ⟨Γ (a/r)⁶ (s − ḟ)²⟩。
//       K = (3/2)((B − A)/C) G M_p/a³ ÷ n²(永久の変形の復元)・Γ = (3/2)(k₂/Q) G M_p² R⁵/(a⁶ n) ÷ (I n)(Γ の写し方はノブ —— 潮汐の振動数を n と置いた)。(i) と同じ源(主星の潮汐)の 2 つ目の読み —— 足さない。
//   (iii) 軸引きずりの熱(第326便d の口 `port` —— 源ごと・逆向きは打ち消さない): 源 j(主星・太陽・銀河)の口の応答 Γ_j = Γ₀ I β_j(β_j = G M_j/(d c₀²) —— 第337便c の物差し・
//       銀河は観測の回転の桁)・目標 ν_j = c ω_j(向きの読み c: 揃える +1/差分の読み 1 − α = −1・銀河は受け手の軸と 120°)・熱 Q_j = Γ_j |ν_j − Ω|²。Γ₀ は第337便c の比のしきいの帯。
//       第337便a の熱の上限 `bodyBudget`(1 つの口に寄せた読み)を並べる(源ごとの熱 ≥ 1 つの口の熱)。
//   (iv) 並進引きずりの加減速の差(第337便d の列 L1・L2・S0・S0a・S0d・S1・S2 —— `secularRates` の 1 周の熱 ÷ 周期 × 第337便d の合わせた上限のノブ)。
//   T2: 金星の永久の変形 (B − A)/C(ノブ)に地球が掛けるトルク −(3/2)(B − A)(G M_⊕/d³) sin 2(θ − φ_⊕) を、会合の周期で平均した共鳴の調和の成分
//       A_k = |⟨exp(2i(s_k t − φ_⊕))/d³⟩|(s_k = n_♀ + k n_syn/2・円・同じ面)で K_k = (3/2)((B − A)/C) C G M_⊕ A_k。
//       定常の解: |N_net| ≤ K(第337便c の型)・N_net = 太陽の潮汐 (3/2)(k₂/Q) G M_☉² R⁵/a⁶ + ε × 太陽の軸引きずり(ε = 釣り合いの残り —— 金星で釣り合う〔恒久〕を入力のノブに)。
//       捕まる範囲: 無次元の型 γ'' = −sin 2γ − Γ' γ' + N'(第337便c の `spinCirc` を呼ぶ —— 時間の単位 √(I/K))を初期の位相 8 で回す。
//   T3: 尾は反太陽の向き(公転の速さと太陽風の速さの比の光行差の角はノブ)—— 金星の軌道との最短の距離。誘導のトルクの上限 χ (2π/μ₀) R³ B²(χ ≤ 1・式の形は決め打ちしない —— 桁の列)。
// ■ 言わないこと: イオの熱の出どころを決めたとは書かない・共鳴の原因が潮汐とは書かない(候補の桁の表)・金星の釣り合いの根は解かない(枝 b の題 —— 残り ε を入力のノブに置くだけ)・
//   金星の大気の熱潮汐は扱わない(原仮定者の回答 3)・文献の値は一次資料に当たっていない(未照合)・(i) と (ii) は同じ源の 2 つの読み(足さない)。
import * as TL from './lib-w337c-tidelock.mjs';
import * as AH from './lib-w326d-axialheat.mjs';
import * as AL from './lib-w337d-accelloss.mjs';
import * as SU from './lib-w337a-supply.mjs';
import * as CL from './lib-w335b-carryledger.mjs';

export const LIB_VERSION = 'w338f-heatlock-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const G = TL.G_SI, C0 = TL.C_SI, YR = TL.YR, DAY = 86400, AU = 1.495978707e11, MU0 = 1.25663706212e-6, R_E = 6.371e6;
const src = (id, k) => TL.BODY_SRC[id][k][0];

/* ───────── 宣言(走らせるノブの格子と判定の物差し —— 式の形の宣言ではなく、何を測ったかの記録)───────── */
export const DECL = Object.freeze({
  /** T1: k₂/Q の格子(第337便c の固体の既定 3e-3 を含む)・Γ の写し方・周期の解の求積の点・第337便c の向きの読み(α 2 —— 差分の読み c = 1 − α)・銀河と受け手の軸の角 */
  t1: Object.freeze({ k2q: Object.freeze([1e-4, 1e-3, 3e-3, 1.5e-2, 1e-1]), gammaMap: 'Γ = (3/2)(k₂/Q) G M_p² R⁵/(a⁶ n)', nQuad: 4096, alpha: 2, galTiltDeg: 120,
    readings: Object.freeze(['aligned', 'diff']), ageYr: 4.5e9, accelCols: Object.freeze(['L1', 'L2', 'S0', 'S0a', 'S0d', 'S1', 'S2']) }),
  /** T2: 永久の変形 (B − A)/C の格子・太陽の潮汐の k₂/Q の格子・釣り合いの残り ε の格子・調和の格子 k・求積の点 */
  t2: Object.freeze({ bac: Object.freeze([1e-7, 1e-6, 1e-5, 1e-4, 1e-3]), k2q: Object.freeze([1e-5, 1e-4, 1e-3, 1e-2]), eps: Object.freeze([0, 1e-12, 1e-9, 1e-6, 1e-3, 1]),
    kList: Object.freeze([-6, -8, -9, -10, -11, -12, -14]), nQuad: 20000,
    /** 捕まる範囲(無次元 —— K' = 1): N' × Γ' × 初期の位相 8・初期の滑り −3(分離線 √2 の外)・最後の窓 */
    capture: Object.freeze({ nOverK: Object.freeze([0.05, 0.2, 0.5, 0.9, 1.1, 1.5]), gammas: Object.freeze([0.001, 0.01, 0.1, 1]), nPhase: 8, slip0: -3, h: 0.01, tPad: 300, tMax: 3000, win: 100 }) }),
  /** T3: 光行差の角を作る太陽風の速さ [m/s]・尾の長さ [地球の半径]・尾の半径 [地球の半径]・誘導の効率 χ */
  t3: Object.freeze({ vsw: Object.freeze([3e5, 4e5, 8e5]), abDeg: Object.freeze([0, 10, 45, 90, 120, 150, 180]), tailRe: Object.freeze([200, 1000, 6500, 1e5]), tailRadiusRe: 30, chi: 1, nTail: 2001 }),
});

/** 文献の値(本環境では一次資料に当たっていない —— 文献の値・未照合・確かさの程度を書く)。第337便c の BODY_SRC にある値はそれを呼ぶ */
export const LIT = Object.freeze({
  note: '文献の値・未照合(この環境から一次資料のサイトに届かない —— 出典の名と値は記憶とリポジトリの中の値の写し)',
  ioHeatW: CL.LIT.heatFlowW.io, ioHeatSrc: '第330便a の lib の観測の熱流 1.0e14 W(イオの熱の放射の桁)—— 文献の値・未照合・確かさ 中(桁)',
  moonHeatW: CL.LIT.heatFlowW.moon, moonHeatSrc: '第335便b の lib の月の熱流(Apollo 15・17 の 2 点の平均 0.018 W/m² の全球への外挿 —— 放射性の熱が主の見込み)—— 文献の値・未照合・確かさ 低',
  enceladusHeatW: 1.58e10, enceladusHeatSrc: 'Howett et al. 2011 JGR 116, E03003(南極の領域の熱の放射 15.8 GW の桁)—— 文献の値・未照合・確かさ 中',
  ioK2q: 0.015, ioK2qSrc: 'Lainey et al. 2009 Nature 459, 957(k₂/Q = 0.015 ± 0.003 の桁)—— 文献の値・未照合・確かさ 中',
  moonK2q: 6.3e-4, moonK2qSrc: '月の k₂ ≈ 0.024・Q ≈ 38(月レーザー測距と重力の場の解析の桁 —— Williams et al. 2014 JGR Planets 119, 1546)—— 文献の値・未照合・確かさ 低',
  ioBac: 5.86e-3, ioBacSrc: 'イオの C₂₂ ≈ 5.54e-4(Anderson et al. 2001 JGR 106, 32963)から (B − A)/C = 4 C₂₂/0.378(静水圧の仮定)—— 文献の値・未照合・確かさ 中',
  moonBac: 2.278e-4, moonBacSrc: '月の (B − A)/C ≈ 2.278e-4(月レーザー測距の秤動の解析の桁)—— 文献の値・未照合・確かさ 中',
  venusBacNote: '金星の (B − A)/C はこの環境で値を照らせない(重力の場の解析の桁 1e-6〜1e-5 と記憶 —— 確かさ 低)—— ノブの格子 1e-7〜1e-3 で振る',
  venusK2qNote: '金星の k₂/Q は Q が分からない(k₂ ≈ 0.3 の桁 —— 確かさ 低)—— ノブの格子 1e-5〜1e-2 で振る',
  enceladus: Object.freeze({ M: 1.08e20, R: 2.521e5, a: 2.3802e8, P: 1.370218 * 86400, e: 0.0047, C: 0.335, src: 'エンケラドゥスの質量・半径・半長軸・周期・離心率・慣性係数(NASA の衛星の表と Iess et al. 2014 Science 344, 78 の桁)—— 文献の値・未照合・確かさ 中(慣性係数は 低)' }),
  saturn: Object.freeze({ M: 5.6834e26, spinH: 10.656, aAU: 9.5826, src: '土星の質量・自転・軌道の半長軸(第334便a の lib の写し)—— 文献の値・未照合' }),
  eccJov: Object.freeze({ Io: 0.0041, Europa: 0.009, Ganymede: 0.0013, src: 'paper/data/jovian-satellites.csv の eccentricity の行' }),
  moonE: AL.LIT.systems.moon.e, moonESrc: '第337便d の lib の月の e(SOL-47b082ec)',
  dipoleT: 3.0e-5, dipoleSrc: '地球の双極子の赤道の表面の磁束密度 約 3.0e-5 T の桁 —— 文献の値・未照合・確かさ 中',
  imfVenusT: 1e-8, imfSrc: '金星の軌道の惑星間の磁場 約 1e-8 T の桁 —— 文献の値・未照合・確かさ 低(太陽の場 —— 地球の場ではない・桁を並べるだけ)',
  tailLobeT: 2e-8, tailLobeSrc: '地球の磁気圏の尾の葉の磁束密度 約 2e-8 T の桁(地球の近くの値 —— 遠い尾では弱まる)—— 文献の値・未照合・確かさ 低',
  tailLenSrc: '地球の磁気圏の尾の長さ 数百〜1000 地球の半径 以上の桁 —— 文献の値・未照合・確かさ 低(格子 200〜1e5 で振る)',
  tailRadiusSrc: '尾の半径 約 30 地球の半径 の桁 —— 文献の値・未照合・確かさ 低',
  venusResSrc: '金星の自転の周期と地球との会合の周期の関係(内合のたびにほぼ同じ面が地球を向く —— 会合の周期 ÷ 金星の太陽日 ≈ 5)—— 文献の値・未照合(周期の値は paper/data/solar-observations.csv の写し〔第337便c の BODY_SRC〕)',
});

/* ───────── T1 天体の行 ───────── */
/** 受け手の行(主星・質量・半径・半長軸・周期・離心率・慣性係数・観測の熱流)。第337便c の BODY_SRC の値を呼ぶ(エンケラドゥスと土星は本 lib の LIT) */
export function satRows() {
  const jov = (id) => ({ key: id, host: 'Jupiter', M: src(id, 'M'), R: src(id, 'R'), a: src(id, 'a'), P: src(id, 'porb'), e: LIT.eccJov[id], C: src(id, 'C') });
  const S = LIT.saturn, E = LIT.enceladus;
  return [
    Object.assign(jov('Io'), { heatW: LIT.ioHeatW, k2qLit: LIT.ioK2q, bacLit: LIT.ioBac }),
    Object.assign(jov('Europa'), { heatW: null, k2qLit: null, bacLit: null }),
    Object.assign(jov('Ganymede'), { heatW: null, k2qLit: null, bacLit: null }),
    { key: 'Moon', host: 'Earth', M: src('Moon', 'M'), R: src('Moon', 'R'), a: src('Moon', 'a'), P: src('Moon', 'porb'), e: LIT.moonE, C: src('Moon', 'C'), heatW: LIT.moonHeatW, k2qLit: LIT.moonK2q, bacLit: LIT.moonBac },
    { key: 'Enceladus', host: 'Saturn', M: E.M, R: E.R, a: E.a, P: E.P, e: E.e, C: E.C, heatW: LIT.enceladusHeatW, k2qLit: null, bacLit: null },
  ].map((r) => {
    const h = hostOf(r.host);
    return Object.assign(r, { Mp: h.M, hostSpin: h.spin, hostAhel: h.aHel, n: 2 * Math.PI / r.P, I: r.C * r.M * r.R * r.R });
  });
}
/** 主星(質量・自転の角速度・太陽からの距離) */
export function hostOf(id) {
  if (id === 'Saturn') return { M: LIT.saturn.M, spin: 2 * Math.PI / (LIT.saturn.spinH * 3600), aHel: LIT.saturn.aAU * AU };
  return { M: src(id, 'M'), spin: 2 * Math.PI / src(id, 'spin'), aHel: src(id, 'aHel') };
}

/** (i) 離心軌道の潮汐の発熱(同期・小さい e)Ė = (21/2)(k₂/Q) G M_p² R⁵ n e²/a⁶ */
export function eccTide(row, k2q) {
  if (!fin(k2q) || k2q < 0) throw new RangeError('eccTide: k₂/Q は 0 以上');
  return 10.5 * k2q * G * row.Mp * row.Mp * Math.pow(row.R, 5) * row.n * row.e * row.e / Math.pow(row.a, 6);
}
/** (ii) 第337便c の型の周期の解が残す秤動の散逸(I n³ の単位 → W)。K = 1.5 bac G M_p/(a³ n²)・Γ = Γ_SI/(I n) */
export function librHeat(row, k2q, bac, nQuad = DECL.t1.nQuad) {
  if (!fin(k2q) || k2q < 0 || !fin(bac) || bac < 0) throw new RangeError('librHeat: k₂/Q・(B − A)/C は 0 以上');
  const n = row.n, K = 1.5 * bac * G * row.Mp / (Math.pow(row.a, 3) * n * n);
  const gSI = 1.5 * k2q * G * row.Mp * row.Mp * Math.pow(row.R, 5) / (Math.pow(row.a, 6) * n), Gm = gSI / (row.I * n);
  const e = row.e, sol = TL.periodicSpin(e, K, Gm, { d0: 0, s0: 1 });
  if (!sol.ok) return { K, G: Gm, ok: false, res: sol.res, heatW: null, perUnit: null };
  const p = 1 - e * e, hh = Math.sqrt(p);
  const pw = (f, s) => { const r = p / (1 + e * Math.cos(f)), fd = hh / (r * r); return Gm * (s - fd) * (s - fd) / Math.pow(r, 6); };
  let E = 0, prevP = pw(0, sol.s0), prevT = 0;
  const R = TL.spinEcc({ e, K, G: Gm, th0: sol.d0, s0: sol.s0, nOrb: 1, stepsPerOrbit: nQuad, onStep: (f, th, s, t) => { const q = pw(f, s); E += 0.5 * (q + prevP) * (t - prevT); prevP = q; prevT = t; } });
  const perUnit = E / R.t;   // 1 周の平均の散逸(I n³ の単位)
  return { K, G: Gm, ok: true, res: sol.res, d0: sol.d0, s0: sol.s0, closure: Math.abs(R.s - sol.s0), perUnit, heatW: perUnit * row.I * n * n * n, smallE: 2 * Gm * e * e };
}
/** (iii) 軸引きずりの熱(源ごとの口 —— 第326便d の port)。reading: aligned(c = +1)/diff(c = 1 − α)。Γ₀ [1/s] */
export function axialHeat(row, gamma0, reading) {
  if (!fin(gamma0) || gamma0 < 0 || !DECL.t1.readings.includes(reading)) throw new RangeError('axialHeat: Γ₀ ≥ 0・読みは ' + DECL.t1.readings.join('・'));
  const c = reading === 'aligned' ? 1 : 1 - DECL.t1.alpha, Om = [0, 0, row.n], th = DECL.t1.galTiltDeg * Math.PI / 180;
  const srcs = [
    { src: 'host', beta: G * row.Mp / (row.a * C0 * C0), w: row.hostSpin, ax: [0, 0, 1] },
    { src: 'Sun', beta: G * src('Sun', 'M') / (row.hostAhel * C0 * C0), w: 2 * Math.PI / src('Sun', 'spin'), ax: [0, 0, 1] },
    { src: 'galaxy', beta: TL.GALAXY.beta, w: TL.GALAXY.omega, ax: [Math.sin(th), 0, Math.cos(th)] },
  ];
  const ports = srcs.map((q) => { const P = AH.port(Om, AH.scale(q.ax, c * q.w), gamma0 * row.I * q.beta); return { src: q.src, beta: q.beta, Gamma: gamma0 * row.I * q.beta, heat: P.heat, torqueAlong: P.torque[2], slip2: AH.dot(P.slip, P.slip) }; });
  const heat = ports.reduce((s, q) => s + q.heat, 0), unitHeat = ports.reduce((s, q) => s + row.I * q.beta * q.slip2, 0);
  return { reading, c, gamma0, ports, heat, netTorque: ports.reduce((s, q) => s + q.torqueAlong, 0), unitHeat };
}
/** (iii′) 第337便a の熱の上限(1 つの口に寄せた読み): 目標 ω_eff = Σ Γ_j ν_j·ẑ/Σ Γ_j・H は観測の熱流 */
export function budgetOf(row, reading, H) {
  const A = axialHeat(row, 1, reading), Gs = A.ports.reduce((s, q) => s + q.Gamma, 0), th = DECL.t1.galTiltDeg * Math.PI / 180;
  const nuz = { host: A.c * row.hostSpin, Sun: A.c * 2 * Math.PI / src('Sun', 'spin'), galaxy: A.c * TL.GALAXY.omega * Math.cos(th) };
  const wEff = A.ports.reduce((s, q) => s + q.Gamma * nuz[q.src], 0) / Gs;
  const bb = SU.bodyBudget({ I: row.I, s: row.n, wEff, H, ageS: DECL.t1.ageYr * YR });
  const g0One = fin(bb.GdMax) ? bb.GdMax / (row.I * A.ports.reduce((s, q) => s + q.beta, 0)) : null;   // 1 つの口の Γ₀ の上限
  const g0Src = fin(H) && H > 0 ? H / A.unitHeat : null;   // 源ごとの口(打ち消さない)の Γ₀ の上限
  return { reading, wEff, gapOverN: (row.n - wEff) / row.n, GdMax: bb.GdMax, tauMinYr: bb.tauMinYr, g0One, g0Src, srcOverOne: g0One && g0Src ? g0One / g0Src : null };
}
/** (iv) 並進引きずりの加減速の差(第337便d の列 —— 受け手だけ・源の自転を入れない主の読み)の 1 ノブあたりの熱 [W] */
export function accelHeatPerKnob(row, col) {
  const S = AL.sysOf({ G: AL.DECL.G, m1: row.M, m2: row.Mp, a: row.a, e: row.e, c: AL.DECL.c, mode: 'recv' });
  const Q = AL.secularRates(S, col, 1);
  return { col, perKnob: Q.Qorb / S.P, ledgerRel: Q.ledgerRel };
}

/* ───────── T2 金星と地球の共鳴 ───────── */
/** 周期と共鳴の番号: k_obs = 2(s_obs − n_♀)/n_syn・s_res = n_♀ + k n_syn/2・滑り・内合ごとの面のずれ */
export function venusEarthPeriods() {
  const nV = 2 * Math.PI / src('Venus', 'porb'), nE = 2 * Math.PI / src('Earth', 'porb'), nSyn = nV - nE, sObs = 2 * Math.PI / src('Venus', 'spin');
  const kObs = 2 * (sObs - nV) / nSyn, k = Math.round(kObs), sRes = nV + k * nSyn / 2, Tsyn = 2 * Math.PI / nSyn;
  const solarDay = 2 * Math.PI / (nV - sObs);
  return { nV, nE, nSyn, sObs, kObs, k, sRes, TsynDay: Tsyn / DAY, solarDayDay: solarDay / DAY, synOverSolar: Tsyn / solarDay, periodResDay: 2 * Math.PI / Math.abs(sRes) / DAY, periodObsDay: 2 * Math.PI / Math.abs(sObs) / DAY,
    slip: sObs - sRes, slipRel: (sObs - sRes) / Math.abs(sRes), driftDegPerConj: (sObs - sRes) * Tsyn * 180 / Math.PI };
}
/** 共鳴の調和の成分 A_k = |⟨exp(2i(s_k t − φ_⊕))/d³⟩|(円・同じ面・会合の周期の一様な点)[m⁻³]・位相 χ */
export function harmonicA({ aV, aE, nV, nE, k, nQuad }) {
  const nSyn = nV - nE, T = 2 * Math.PI / nSyn, sk = nV + k * nSyn / 2;
  let re = 0, im = 0;
  for (let j = 0; j < nQuad; j++) {
    const t = T * j / nQuad, dx = aE * Math.cos(nE * t) - aV * Math.cos(nV * t), dy = aE * Math.sin(nE * t) - aV * Math.sin(nV * t), d2 = dx * dx + dy * dy, d3 = d2 * Math.sqrt(d2);
    const ph = 2 * (sk * t - Math.atan2(dy, dx)); re += Math.cos(ph) / d3; im += Math.sin(ph) / d3;
  }
  re /= nQuad; im /= nQuad;
  return { k, A: Math.hypot(re, im), chi: Math.atan2(im, re), dMin: aE - aV, peak: 1 / Math.pow(aE - aV, 3) };
}
/** 同期(月の対照)の調和の成分: 円の軌道で A = 1/a³(閉じた形)を同じ求積で(相手を中心の周りに回す) */
export function syncA({ a, n, nQuad }) {
  let re = 0, im = 0; const T = 2 * Math.PI / n;
  for (let j = 0; j < nQuad; j++) { const t = T * j / nQuad, dx = -a * Math.cos(n * t), dy = -a * Math.sin(n * t), d = Math.hypot(dx, dy), ph = 2 * (n * t - Math.atan2(dy, dx) + Math.PI); re += Math.cos(ph) / (d * d * d); im += Math.sin(ph) / (d * d * d); }
  return { A: Math.hypot(re / nQuad, im / nQuad), closed: 1 / (a * a * a) };
}
/** 金星の物差し: 慣性・太陽の潮汐の型の大きさ G M_☉² R⁵/a⁶・太陽の軸引きずりの 1 Γ₀ あたりのトルク(第337便c の物差し —— 揃える/差分の読み)・地球の潮汐(誘起の変形)との比 */
export function venusScales() {
  const M = src('Venus', 'M'), R = src('Venus', 'R'), C = src('Venus', 'C'), a = src('Venus', 'aHel'), I = C * M * R * R, P = venusEarthPeriods();
  const tideUnit = G * Math.pow(src('Sun', 'M'), 2) * Math.pow(R, 5) / Math.pow(a, 6), betaSun = G * src('Sun', 'M') / (a * C0 * C0), wSun = 2 * Math.PI / src('Sun', 'spin');
  const dMin = src('Earth', 'aHel') - a, earthTideUnit = G * Math.pow(src('Earth', 'M'), 2) * Math.pow(R, 5) / Math.pow(dMin, 6);
  // 永久の変形の復元の瞬間の最大(地球 ÷ 太陽): (M_⊕/d_min³) ÷ (M_☉/a³)
  const permPeak = (src('Earth', 'M') / Math.pow(dMin, 3)) / (src('Sun', 'M') / Math.pow(a, 3));
  return { M, R, C, I, a, dMin, tideUnit, betaSun, axSunAligned: I * betaSun * Math.abs(wSun - P.sObs), axSunDiff: I * betaSun * Math.abs((1 - DECL.t1.alpha) * wSun - P.sObs),
    axGalUnit: I * TL.GALAXY.beta * Math.abs(P.sObs), earthOverSunRaised: earthTideUnit / tideUnit, earthOverSunPermPeak: permPeak };
}
/** 太陽の永久の変形のトルクの強制の秤動の振幅(共鳴でない —— 平均 0): (3/8)((B − A)/C)(G M_☉/a³)/(s − n_♀)² [rad] */
export function sunForcedLib(bac) { const P = venusEarthPeriods(), a = src('Venus', 'aHel'); return 0.375 * bac * (G * src('Sun', 'M') / Math.pow(a, 3)) / Math.pow(P.sRes - P.nV, 2); }
/** 捕まる判定(無次元 —— 第337便c の spinCirc を呼ぶ: δ̇ = s − 1・ṡ = −sin 2δ − Γ (s − 1) + N): 最後の窓で δ の振れ < π かつ窓の端の差 < π/2 */
export function captureRow({ N, G: Gm, d0, D = DECL.t2.capture }) {
  const T = Math.min(D.tMax, (Math.abs(D.slip0) + 3) / N + D.tPad), tw = T - D.win;
  let dW0 = null, dMin = Infinity, dMax = -Infinity;
  const R = TL.spinCirc({ K: 1, G: Gm, N, d0, s0: 1 + D.slip0, T, h: D.h, onSample: (t, d) => { if (t > tw + 1e-9) { if (dW0 === null) dW0 = d; dMin = Math.min(dMin, d); dMax = Math.max(dMax, d); } } });
  const trapped = dMax - dMin < Math.PI && Math.abs(R.d - dW0) < Math.PI / 2;
  return { N, G: Gm, d0, T, trapped, slipEnd: R.s - 1 };
}

/* ───────── T3 地球磁場 ───────── */
/** 尾(地球から反太陽の向きを光行差の角 ab だけ公転の向きの逆へ傾けた線分)と金星の軌道(半径 a_♀ の円)の最短の距離 [m] */
export function tailMinDist({ aE, aV, abDeg, L, nTail = DECL.t3.nTail }) {
  const ab = abDeg * Math.PI / 180, ux = Math.cos(ab), uy = -Math.sin(ab);   // 地球は (aE, 0)・公転の向きは +y・反太陽は +x
  let best = Infinity, at = 0;
  for (let j = 0; j < nTail; j++) { const l = L * j / (nTail - 1), px = aE + l * ux, py = l * uy, dd = Math.abs(Math.hypot(px, py) - aV); if (dd < best) { best = dd; at = l; } }
  return { abDeg, L, minDist: best, atL: at };
}
/** 誘導のトルクの上限(式の形は決め打ちしない —— 桁): χ (2π/μ₀) R³ B² */
export const inducedTorqueMax = ({ R, B, chi = DECL.t3.chi }) => chi * (2 * Math.PI / MU0) * R * R * R * B * B;
export const dipoleAt = (d) => LIT.dipoleT * Math.pow(R_E / d, 3);

/* ───────── 純関数の場面 ───────── */
export function pureScenes() {
  const rows = satRows(), io = rows[0];
  const e0 = Object.assign({}, io, { e: 0 }), e2 = Object.assign({}, io, { e: 2 * io.e });
  const tide = { zero: eccTide(e0, 0.01), quad: eccTide(e2, 0.01) / eccTide(io, 0.01) };
  const lib0 = librHeat(e0, 0.015, 0.006, 1024);
  const pa = AH.port([0, 0, 1], [0, 0, 2], 1), pb = AH.port([0, 0, 1], [0, 0, 0], 1);   // 逆向きの 2 つの口(トルク +1 と −1)
  const ports = { net: pa.torque[2] + pb.torque[2], heat: pa.heat + pb.heat };
  const P = venusEarthPeriods();
  const sy = syncA({ a: 3.844e8, n: 2.66e-6, nQuad: 512 });
  const tl = tailMinDist({ aE: 1.496e11, aV: 1.08208e11, abDeg: 0, L: 1e10, nTail: 11 });
  const rej = [() => eccTide(io, -1), () => librHeat(io, 0.01, -1), () => axialHeat(io, -1, 'aligned'), () => axialHeat(io, 1, 'x')].map((f) => { try { f(); return false; } catch (e) { return e instanceof RangeError; } });
  return { tide, lib0: { ok: lib0.ok, perUnit: lib0.perUnit }, ports, kObs: P.kObs, k: P.k, sync: { A: sy.A, closed: sy.closed }, tail: { minDist: tl.minDist, want: 1.496e11 - 1.08208e11 }, rejects: rej };
}
export function pureGates(S) {
  return {
    tideForm: S.tide.zero === 0 && Math.abs(S.tide.quad - 4) < 1e-12,
    libZeroE: S.lib0.ok && Math.abs(S.lib0.perUnit) < 1e-20,
    portsNoCancel: S.ports.net === 0 && S.ports.heat === 2,
    resonanceIndex: S.k === -10 && Math.abs(S.kObs - S.k) < 0.01,
    syncClosed: Math.abs(S.sync.A - S.sync.closed) / S.sync.closed < 1e-12,
    tailAntiSun: Math.abs(S.tail.minDist - S.tail.want) / S.tail.want < 1e-12,
    rejects: S.rejects.every(Boolean),
  };
}
