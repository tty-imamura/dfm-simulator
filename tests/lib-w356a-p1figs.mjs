// 第356便a(統括の検証項目 R513 —— 構成案 docs/PAPER_PLAN.md「## 2. 論文1」⑧ の V1-5「図データ(太陽縁の偏向・シャピロ遅延・時計の 2 成分)の再生成」):
//   **論文1 の新しい図 3 枚(時計の遅れの 2 成分・太陽縁の光の軌跡・シャピロ遅延の往復)の図のデータと、図の門の純関数**
//   (器 tests/exp-w356a-p1figs.mjs が呼ぶ —— html を読まない・ファイルを読まない・状態を持たない)。
//
// ■ 何を呼ぶか(在る純関数の lib —— 書き直さない)
//   第289便a の lib tests/lib-w289a-weakfield.mjs(弱場の係数の検査 —— 法則 (i) 現行 E7R/E8R: 時計 N = e^{−ψ}・屈折率 n = e^{2ψ}・ψ = X_k W):
//     lawFn('e7r').rate(U)        静止時計の率 N(図 1 の重力の分)
//     bornDeflectionCoeff('e7r', U_b, θ0, θ1)   直線経路(Born)の偏向の係数 —— θ の範囲を切ると、光が x までに受けた分(図 2)
//     shapiroCoeff('e7r', U_b, { L1, L2 })      片道のシャピロ遅延の係数と Λ = ∫dx/r(図 3 —— 端点は b を単位に)
//   運動の分の式(A = e^{+ψ})は論文1 の原稿の式 A7′(dτ/dt = √(N² − A²|v − u|²/c₀²)・N = e^{−ψ}・A = e^{+ψ}・u = 0)から —— 第289便a の lib に A の口は無い(この lib に置く)。
// ■ 入力: 論文1 の原稿(paper/dfm-paper.tex)の付録の入力の表(Table「Observational inputs of the benchmark rows」)の字をそのまま写す(INPUTS)。
//   原稿に字が無い定数は 2 つ: 光の速さ c(SI の定義の値 299792458 m/s —— リポジトリの tests/data-w286b-clight.json の rule の字)と
//   重力定数 G(リポジトリの tests/lib-w276b-charonfactors.mjs の CODATA_G の字 6.67430e-11 —— 原稿は「CODATA に整合」と書くだけで値の字は無い)。
// ■ 言わないこと: 図のデータは模型の式の値(原稿の照合の表の列「DFM」と同じ式)。観測に届いた・論文の主張が確かめられた、とは書かない。
//   原稿の印字の数との照合は「原稿の字と、表の入力から作り直した値の差」だけ(差が在れば差のまま書く —— 原稿は変えない)。
// ■ 数値: 冪は積で書く(Math.pow を使わない)。exp・log・sqrt・asinh・atan は使う。
import * as W from './lib-w289a-weakfield.mjs';

export const LIB_VERSION = 'w356a-p1figs-lib-1';

/** 論文1 の原稿の入力の表(paper/dfm-paper.tex の付録「Benchmark inputs and verification configurations」の表)の字 —— SI */
export const INPUTS = Object.freeze({
  M_E: 5.972e24,        // $M_\oplus$ & $5.972\times10^{24}$ kg & GPS
  R_E: 6.371e6,         // $R_\oplus$ (ground clock) & $6.371\times10^{6}$ m & GPS
  r_GPS: 2.6562e7,      // $r_{\rm GPS}$ (orbit radius) & $2.6562\times10^{7}$ m & GPS
  v_sat_print: 3.87e3,  // $v_{\rm sat} = \sqrt{GM_\oplus/r_{\rm GPS}}$ & $3.87$ km/s(式から作る —— 字は照合だけに使う)
  v_ground: 0.465e3,    // $v_{\rm ground} = \Omega_\oplus R_\oplus$ & $0.465$ km/s & GPS
  M_S: 1.989e30,        // $M_\odot$ & $1.989\times10^{30}$ kg & deflection, Shapiro
  R_S: 6.96e8,          // $R_\odot$ ($=b$) & $6.96\times10^{8}$ m & deflection, Shapiro
  r1: 1.496e11,         // $r_1$ (Earth) & $1\ {\rm AU} = 1.496\times10^{11}$ m & Shapiro
  r2: 1.261e12,         // $r_2$ (Saturn) & $8.43\ {\rm AU} = 1.261\times10^{12}$ m & Shapiro
});
/** 原稿に字が無い定数(出どころはリポジトリの字) */
export const CONSTS = Object.freeze({
  c: 299792458, cSrc: 'SI の定義の値(tests/data-w286b-clight.json の rule の字「c_SI=299792458 m/s」)',
  G: 6.67430e-11, GSrc: 'tests/lib-w276b-charonfactors.mjs の CODATA_G の字(原稿は「CODATA に整合」と書くだけ —— 値の字は原稿に無い)',
  day: 86400, arcsec: 180 / Math.PI * 3600,
});
/** 原稿の印字の数(照合の表 Table「Benchmark calibration」と SI の表の字 —— 図の門の比べる数。印字の最後の桁の半分を、照合の幅の候補とする) */
export const PRINTED = Object.freeze({
  gpsNet: Object.freeze({ v: 38.5, half: 0.05, unit: 'μs/日', where: '照合の表の GPS の行「$+38.5\\ \\mu$s/day」' }),
  gpsGrav: Object.freeze({ v: 45.7, half: 0.05, unit: 'μs/日', where: '照合の表の GPS の行「gravity $+45.7$」' }),
  gpsMotion: Object.freeze({ v: -7.2, half: 0.05, unit: 'μs/日', where: '照合の表の GPS の行「motion $-7.2$」' }),
  limb: Object.freeze({ v: 1.7512, half: 0.00005, unit: '″', where: '照合の表の太陽縁の行「$4GM_\\odot/(c^2R_\\odot) = 1.7512\'\'$」' }),
  shapiro: Object.freeze({ v: 281, half: 0.5, unit: 'μs', where: '照合の表のシャピロ遅延の行「$(4GM_\\odot/c^3)\\ln(4r_1r_2/b^2) \\approx 281\\ \\mu$s」(往復)' }),
  Kt: Object.freeze({ v: 7.43e-28, half: 0.005e-28, unit: 'm/kg', where: 'SI の表「$\\Kt = G/c^2$ & $\\approx 7.43\\times10^{-28}$」' }),
  vSat: Object.freeze({ v: 3.87e3, half: 0.005e3, unit: 'm/s', where: '入力の表「$v_{\\rm sat}$ & $3.87$ km/s」' }),
});

/** 宣言(走行の前に置く —— 結果を見て変えない) */
export const DECL = Object.freeze({
  /** 既存の床(第289便a の FLOOR —— 解析と数値の照合 相対 1e-6)。図の門の「式との照合」はこの床にそろえる(緩めない) */
  FLOOR: W.FLOOR,
  /** 図 1: 円の軌道の半径 r ÷ R⊕ の格子(1〜10・対数で等間隔 37 点 + GPS の軌道の点)*/
  fig1: Object.freeze({ xMin: 1, xMax: 10, n: 37 }),
  /** 図 2: 光の道の x ÷ R☉ の格子(−215〜+215 ≈ ±1 AU・x = R☉ sinh s で s を等間隔 61 点)*/
  fig2: Object.freeze({ X: 215, n: 61, ray: Object.freeze({ X: 200, ds: 0.02 }) }),
  /** 図 3: 衝突径数 b ÷ R☉ の格子(1〜20・対数で等間隔 27 点)*/
  fig3: Object.freeze({ bMin: 1, bMax: 20, n: 27 }),
  /** 正本の差の葉の絶対の桁(相対 1e-9 の照合に合わせる —— 第355便の教訓 2) */
  REL_DIGITS: 9,
});

const C = CONSTS, I = INPUTS;
const sq = (x) => x * x;
/** 差・相対の差の葉の丸め(絶対の桁 —— 形の判定は丸める前の数で) */
export function dz(x, scale = 1) {
  if (!Number.isFinite(x)) return x;
  const d = Math.max(0, Math.min(20, DECL.REL_DIGITS - Math.floor(Math.log10(Math.abs(scale)))));
  return Number(x.toFixed(d));
}
export const relOf = (a, b) => (b === 0 ? Math.abs(a - b) : Math.abs(a - b) / Math.abs(b));   // b = 0 のときは差そのもの(地上の点の重力の分 0)
export function logGrid(a, b, n) { const out = []; const la = Math.log(a), lb = Math.log(b); for (let i = 0; i < n; i++) out.push(i === 0 ? a : i === n - 1 ? b : Math.exp(la + (lb - la) * i / (n - 1))); return out; }   // 端は字のまま(走り直しの尺度で端の点が動かない)

/* ───── 図 1: 時計の遅れの 2 成分(重力と運動)───── */
/** ψ = GM/(c² r)(点質量・時計の自分の場を除く —— 原稿の A7′) */
export const psiOf = (GM, r) => GM / (sq(C.c) * r);
/** 静止時計の率 N = e^{−ψ}(第289便a の法則 (i) の口を呼ぶ) */
export const N_of = (psi) => W.lawFn('e7r').rate(psi);
/** A = e^{+ψ}(原稿の A7′ —— 第289便a の lib に口が無いのでここに置く) */
export const A_of = (psi) => Math.exp(psi);
/** 時計の率 dτ/dt = √(N² − A² v²/c²)(原稿の A7′・u = 0) */
export function rateOf(psi, v) { const N = N_of(psi), A = A_of(psi); return Math.sqrt(N * N - A * A * v * v / sq(C.c)); }
/**
 * 衛星(半径 r・速さ v)と地上の時計(R⊕・速さ vg)の 1 日あたりの差 [μs/日]。
 * 重力の分 g = N_衛/N_地 − 1・運動の分 m = (率_衛/N_衛)/(率_地/N_地) − 1・合計 = 率_衛/率_地 − 1 = (1 + g)(1 + m) − 1・交差の項 = g·m。
 * **打ち消しを避けて直接に数える**(比 − 1 は 4e-11 の桁 —— 比を作ってから 1 を引くと倍精度で相対 3e-6 を失う):
 *   g = −oneMinusRate(ψ_衛 − ψ_地)(第289便a の法則 (i) の口 —— N = e^{−ψ} は掛け算で閉じるので N_衛/N_地 = e^{−(ψ_衛 − ψ_地)})・
 *   ψ_衛 − ψ_地 = −(GM/c²)(1/R − 1/r)(差を式のまま)・m = expm1(½[log1p(−a_衛) − log1p(−a_地)])・a = (A/N)² v²/c² = e^{4ψ} v²/c²。
 */
export function clockSplit(r, { v = null, vg = I.v_ground, GM = C.G * I.M_E, R = I.R_E } = {}) {
  const vs = v === null ? Math.sqrt(GM / r) : v;
  const ps = psiOf(GM, r), pg = psiOf(GM, R), dpsi = -(GM / sq(C.c)) * (1 / R - 1 / r);
  const as = Math.exp(4 * ps) * vs * vs / sq(C.c), ag = Math.exp(4 * pg) * vg * vg / sq(C.c);
  const lnG = -dpsi, lnM = 0.5 * (Math.log1p(-as) - Math.log1p(-ag));
  const gr = -W.lawFn('e7r').oneMinusRate(dpsi), mr = Math.expm1(lnM), nr = Math.expm1(lnG + lnM);
  const k = C.day * 1e6;
  return { r, v: vs, grav: gr * k, motion: mr * k, net: nr * k, cross: gr * mr * k, ratio: { Ns: N_of(ps), Ng: N_of(pg), Rs: rateOf(ps, vs), Rg: rateOf(pg, vg), net1: 1 + nr, grav1: 1 + gr } };
}
/** 一次の閉じた形(重力 GM/c²(1/R − 1/r)・運動 −(v² − vg²)/(2c²))[μs/日] */
export function clockFirst(r, { v = null, vg = I.v_ground, GM = C.G * I.M_E, R = I.R_E } = {}) {
  const vs = v === null ? Math.sqrt(GM / r) : v, k = C.day * 1e6;
  const grav = GM / sq(C.c) * (1 / R - 1 / r) * k, motion = -(vs * vs - vg * vg) / (2 * sq(C.c)) * k;
  return { grav, motion, net: grav + motion };
}
/** 合計が 0 になる円の軌道の半径(二分法 —— 図の特徴の点)と一次の閉じた形 r₀ = 1.5 ÷ (1/R + vg²/(2GM)) */
export function zeroRadius({ vg = I.v_ground, GM = C.G * I.M_E, R = I.R_E } = {}) {
  let lo = R * 1.0001, hi = R * 10;
  for (let i = 0; i < 200; i++) { const m = 0.5 * (lo + hi); if (clockSplit(m, { vg, GM, R }).net < 0) lo = m; else hi = m; }
  return { r0: 0.5 * (lo + hi), r0First: 1.5 / (1 / R + vg * vg / (2 * GM)) };
}
export function fig1Data() {
  const D = DECL.fig1, xs = logGrid(D.xMin, D.xMax, D.n);
  const row = (x, vg) => { const r = x * I.R_E, s = clockSplit(r, { vg }), f = clockFirst(r, { vg });
    return { x, rKm: r / 1e3, vKmS: s.v / 1e3, grav: s.grav, motion: s.motion, net: s.net, cross: s.cross, relGravFirst: dz(relOf(s.grav, f.grav)), relMotionFirst: dz(relOf(s.motion, f.motion)) }; };
  const series = [
    { id: 'withGround', label: '地上の時計が自転で動く(v_ground = 0.465 km/秒 —— 入力の表)', vg: I.v_ground, rows: xs.map((x) => row(x, I.v_ground)) },
    { id: 'groundAtRest', label: '地上の時計を止めて読む(v_ground = 0 —— 照合の表の GPS の行の運動の分 −7.2 の読み)', vg: 0, rows: xs.map((x) => row(x, 0)) },
  ];
  const strip = (o) => { const { ratio, ...rest } = o; return rest; };
  const gps = { withGround: strip(clockSplit(I.r_GPS)), groundAtRest: strip(clockSplit(I.r_GPS, { vg: 0 })), firstWithGround: clockFirst(I.r_GPS), firstGroundAtRest: clockFirst(I.r_GPS, { vg: 0 }) };
  const z = { withGround: zeroRadius(), groundAtRest: zeroRadius({ vg: 0 }) };
  return { axes: { x: 'r ÷ R⊕(円の軌道の半径)', y: '衛星 − 地上の時計の進み [μs/日]' }, units: { x: '1', y: 'μs/日' },
    formula: 'dτ/dt = √(N² − A² v²/c²)・N = e^{−ψ}・A = e^{+ψ}・ψ = GM⊕/(c² r)・v = √(GM⊕/r)(原稿の A7′・u = 0)—— N は第289便a の lawFn(\'e7r\').rate',
    series, gps, zero: z };
}

/* ───── 図 2: 太陽縁の光の軌跡(衝突径数 b = R☉)───── */
/** 光が x(b を単位に)までに受けた偏向 [rad](第289便a の bornDeflectionCoeff の θ の範囲を切る —— x = b tanθ)*/
export function alphaUpTo(xOverB, Ub) { return W.bornDeflectionCoeff('e7r', Ub, -Math.PI / 2, Math.atan(xOverB)) * Ub; }
/** 閉じた形 α(x) = (2μ/b)(1 + x/√(x² + b²))(μ = GM/c²・n = e^{2ψ} の一次)*/
export const alphaClosed = (xOverB, Ub) => 2 * Ub * (1 + xOverB / Math.sqrt(1 + xOverB * xOverB));
/** 直線からのずれ y(x) = ∫_{−X}^{x} α dx'(閉じた形: (2μ/b)·b[(x + √(x²+b²)) − (−X + √(X²+b²))]・b を単位に)*/
export const yClosed = (xOverB, XOverB, Ub) => 2 * Ub * ((xOverB + Math.sqrt(1 + xOverB * xOverB)) - (-XOverB + Math.sqrt(1 + XOverB * XOverB)));
export function fig2Data() {
  const D = DECL.fig2, GM = C.G * I.M_S, b = I.R_S, Ub = GM / (sq(C.c) * b), sMax = Math.asinh(D.X);
  const xs = []; for (let i = 0; i < D.n; i++) xs.push(Math.sinh(-sMax + 2 * sMax * i / (D.n - 1)));
  const rows = xs.map((x) => { const a = alphaUpTo(x, Ub), ac = alphaClosed(x, Ub), y = yClosed(x, D.X, Ub);
    return { x, alphaArcsec: a * C.arcsec, relAlphaClosed: dz(relOf(a, ac)), yKm: y * b / 1e3 }; });
  // y の台形の照合(lib の α を台形で積む —— 閉じた形 yClosed との差)
  let yT = 0; const yTrap = [0]; for (let i = 1; i < xs.length; i++) { yT += 0.5 * (alphaUpTo(xs[i], Ub) + alphaUpTo(xs[i - 1], Ub)) * (xs[i] - xs[i - 1]); yTrap.push(yT); }
  const totalBorn = W.bornDeflectionCoeff('e7r', Ub) * Ub, totalClosed = 4 * Ub;
  const ray = W.rayDeflectionCoeff('e7r', Ub, D.ray);
  return { axes: { x: 'x ÷ R☉(光の道に沿う座標・太陽の中心の最寄りが 0)', y: '光が x までに受けた偏向 [″]・直線からのずれ [km]' }, units: { x: '1', y: '″ / km' },
    formula: 'α(x) = ∫ ∂⊥ ln n dx・n = e^{2ψ}・ψ = GM☉/(c² r)・b = R☉(直線の経路 —— Born)—— 第289便a の bornDeflectionCoeff(\'e7r\') の θ の範囲を切る',
    Ub, rows, yTrapEndKm: yTrap[yTrap.length - 1] * b / 1e3, yClosedEndKm: rows[rows.length - 1].yKm,
    totalArcsec: totalBorn * C.arcsec, totalClosedArcsec: totalClosed * C.arcsec, relTotal: dz(relOf(totalBorn, totalClosed)),
    halfAtZero: alphaUpTo(0, Ub) / totalBorn, rayCoeff: ray.coeff, rayRelTo4: dz(relOf(ray.coeff, 4)), raySteps: ray.steps };
}

/* ───── 図 3: シャピロ遅延の往復(上合・r₁ = 1 AU・r₂ = 8.43 AU)───── */
/** 片道 [s](第289便a の shapiroCoeff —— 端点 x₁ = −√(r₁² − b²)・x₂ = +√(r₂² − b²) を b を単位に)と、閉じた形(一次)(2μ/c)Λ */
export function shapiroOneWay(b, { r1 = I.r1, r2 = I.r2, GM = C.G * I.M_S } = {}) {
  const Ub = GM / (sq(C.c) * b), L1 = Math.sqrt(r1 * r1 - b * b) / b, L2 = Math.sqrt(r2 * r2 - b * b) / b;
  const s = W.shapiroCoeff('e7r', Ub, { L1, L2 }), mu = GM / sq(C.c);
  return { lib: s.coeff * mu / C.c * s.Lambda, closed: 2 * mu / C.c * (Math.asinh(L1) + Math.asinh(L2)), Lambda: s.Lambda, coeff: s.coeff };
}
/** 原稿の式(往復)(4GM/c³) ln(4 r₁ r₂ / b²) */
export const shapiroPrinted = (b, { r1 = I.r1, r2 = I.r2, GM = C.G * I.M_S } = {}) => 4 * GM / (C.c * C.c * C.c) * Math.log(4 * r1 * r2 / (b * b));
export function fig3Data() {
  const D = DECL.fig3, bs = logGrid(D.bMin, D.bMax, D.n);
  const rows = bs.map((x) => { const b = x * I.R_S, o = shapiroOneWay(b), rt = 2 * o.lib, ap = shapiroPrinted(b);
    return { bOverR: x, oneWayUs: o.lib * 1e6, roundTripUs: rt * 1e6, closedRoundTripUs: 2 * o.closed * 1e6, printedFormUs: ap * 1e6,
      relLibClosed: dz(relOf(o.lib, o.closed)), relPrintedExact: dz(relOf(ap, 2 * o.closed)), coeff: o.coeff }; });
  return { axes: { x: 'b ÷ R☉(衝突径数)', y: '往復のシャピロ遅延 [μs]' }, units: { x: '1', y: 'μs' },
    formula: '片道 Δt = ∫ (n − 1)/c dx(直線の経路・n = e^{2ψ})—— 第289便a の shapiroCoeff(\'e7r\')・往復 = 2 × 片道・比べる式は原稿の (4GM☉/c³) ln(4 r₁ r₂ / b²)',
    rows };
}

/* ───── 図の門(正本の門 —— 図ごとに何を見て通すか)───── */
/** 門の一覧(tol の出どころ: 'floor289a' = 第289便a の床 1e-6〔既存の許容 —— 緩めない〕/'cand' = 候補〔原稿の印字の最後の桁の半分 —— 新しい許容〕/'exact' = 作りで等しい) */
export function figGates(F1, F2, F3) {
  const FL = DECL.FLOOR, P = PRINTED, g = [];
  const add = (id, fig, what, value, tol, tolSrc, pass) => g.push({ id, fig, what, value, tol, tolSrc, pass: !!pass });
  // 図 1
  const gw = F1.gps.withGround, ga = F1.gps.groundAtRest;
  const r1max = Math.max(...F1.series.flatMap((s) => s.rows.map((r) => r.relGravFirst)));
  const m1max = Math.max(...F1.series.flatMap((s) => s.rows.map((r) => r.relMotionFirst)));
  add('p1fig.clock.first', 1, '重力の分・運動の分が一次の閉じた形と相対 1e-6 の内(格子の全点・2 系列)', Math.max(r1max, m1max), FL, 'floor289a', r1max <= FL && m1max <= FL);
  add('p1fig.clock.zero', 1, '合計が 0 になる半径(二分法)が一次の閉じた形 r₀ = 1.5 ÷ (1/R + vg²/(2GM)) と相対 1e-6 の内', relOf(F1.zero.withGround.r0, F1.zero.withGround.r0First), FL, 'floor289a', relOf(F1.zero.withGround.r0, F1.zero.withGround.r0First) <= FL);
  add('p1fig.clock.sign', 1, '重力の分は正(地上の点 x = 1 では 0)・運動の分は負(格子の全点・2 系列)', null, null, 'exact',
    F1.series.every((s) => s.rows.every((r) => (r.x === 1 ? r.grav === 0 : r.grav > 0) && r.motion < 0)));
  add('p1fig.clock.gpsGrav', 1, 'GPS の軌道の点の重力の分が原稿の印字 +45.7 の最後の桁の半分の内', gw.grav, P.gpsGrav.half, 'cand', Math.abs(gw.grav - P.gpsGrav.v) <= P.gpsGrav.half);
  add('p1fig.clock.gpsMotionAtRest', 1, 'GPS の軌道の点の運動の分(地上を止めて読む)が原稿の印字 −7.2 の最後の桁の半分の内', ga.motion, P.gpsMotion.half, 'cand', Math.abs(ga.motion - P.gpsMotion.v) <= P.gpsMotion.half);
  add('p1fig.clock.gpsNetAtRest', 1, 'GPS の軌道の点の合計(地上を止めて読む)が原稿の印字 +38.5 の最後の桁の半分の内', ga.net, P.gpsNet.half, 'cand', Math.abs(ga.net - P.gpsNet.v) <= P.gpsNet.half);
  // 図 2
  const a2max = Math.max(...F2.rows.map((r) => r.relAlphaClosed));
  add('p1fig.limb.total', 2, '偏向の全体(Born の lib)が 4GM☉/(c²R☉) と相対 1e-6 の内', F2.relTotal, FL, 'floor289a', F2.relTotal <= FL);
  add('p1fig.limb.partial', 2, 'x までの偏向(lib の θ を切った値)が閉じた形 (2μ/b)(1 + x/√(x²+b²)) と相対 1e-6 の内(格子の全点)', a2max, FL, 'floor289a', a2max <= FL);
  add('p1fig.limb.half', 2, '最寄りの点 x = 0 で偏向は全体のちょうど半分(相対 1e-6 の内)', Math.abs(F2.halfAtZero - 0.5) / 0.5, FL, 'floor289a', Math.abs(F2.halfAtZero - 0.5) / 0.5 <= FL);
  add('p1fig.limb.path', 2, '直線からのずれの終点: lib の α の台形の積みが閉じた形と相対 1e-3 の内(格子 61 点の台形 —— 図 4 の門 fig4.analytic の幅 1e-3 にそろえる)', relOf(F2.yTrapEndKm, F2.yClosedEndKm), 1e-3, 'fig4', relOf(F2.yTrapEndKm, F2.yClosedEndKm) <= 1e-3);
  // 図 3
  const s3max = Math.max(...F3.rows.map((r) => r.relLibClosed)), rt = F3.rows.every((r) => r.roundTripUs === 2 * r.oneWayUs);
  add('p1fig.shapiro.closed', 3, '片道(lib の求積)が閉じた形 (2μ/c)(asinh(x₂/b) + asinh(abs(x₁)/b)) と相対 1e-6 の内(格子の全点)', s3max, FL, 'floor289a', s3max <= FL);
  add('p1fig.shapiro.roundTrip', 3, '往復 = 片道の 2 倍(作りで等しい —— 全点で厳密に)', null, 0, 'exact', rt);
  add('p1fig.shapiro.printed', 3, 'b = R☉ の往復(原稿の式)が原稿の印字 ≈281 μs の最後の桁の半分の内', F3.rows[0].printedFormUs, P.shapiro.half, 'cand', Math.abs(F3.rows[0].printedFormUs - P.shapiro.v) <= P.shapiro.half);
  add('p1fig.shapiro.mono', 3, '往復は b とともに単調に減る(格子の全点)', null, null, 'exact', F3.rows.every((r, i) => i === 0 || r.roundTripUs < F3.rows[i - 1].roundTripUs));
  return g;
}
/** 原稿の印字の数と、入力の表から作り直した値の照合(門ではない —— 差は差のまま書く) */
export function printedCheck(F1, F2, F3) {
  const P = PRINTED, row = (q, model, extra = {}) => ({ q, printed: P[q].v, unit: P[q].unit, where: P[q].where, model, relDiff: dz((model - P[q].v) / Math.abs(P[q].v)), within: Math.abs(model - P[q].v) <= P[q].half, ...extra });
  return [
    row('gpsNet', F1.gps.groundAtRest.net, { alt: F1.gps.withGround.net, altNote: '地上の時計を自転で動かす(v_ground = 0.465 km/秒 —— 入力の表に在る字)と' }),
    row('gpsGrav', F1.gps.withGround.grav),
    row('gpsMotion', F1.gps.groundAtRest.motion, { alt: F1.gps.withGround.motion, altNote: '地上の時計を自転で動かすと' }),
    row('limb', F2.totalArcsec),
    row('shapiro', F3.rows[0].printedFormUs, { alt: F3.rows[0].roundTripUs, altNote: '端点の有限の幾何(直線の経路の求積)で' }),
    row('Kt', C.G / sq(C.c)),
    row('vSat', F1.gps.withGround.v),
  ];
}

/* ───── 零試験(同じ入力で、呼んだ lib の数と照合 —— 相対 1e-9 の床・厳密な等号で書かない)───── */
export function pureScenes() {
  const U = 2.1e-6;
  return {
    N: { mine: N_of(U), lib: W.lawFn('e7r').rate(U), exp: Math.exp(-U) },
    born: { mine: alphaUpTo(1e9, U) / U, lib: W.bornDeflectionCoeff('e7r', U) },
    shapiro: (() => { const P = { L1: 215, L2: 1812 }, a = W.shapiroCoeff('e7r', U, P); return { lib: a.coeff, Lambda: a.Lambda, LambdaClosed: Math.asinh(215) + Math.asinh(1812) }; })(),
    clockCoeff: W.clockCoeff('e7r'),
    split: (() => { const s = clockSplit(I.r_GPS); return { rateRatio: s.ratio.Rs / s.ratio.Rg, net1: s.ratio.net1, nRatio: s.ratio.Ns / s.ratio.Ng, grav1: s.ratio.grav1, cross: s.cross, netMinus: s.net - s.grav - s.motion }; })(),
    restZero: clockSplit(I.R_E),
    floor: W.FLOOR,
  };
}
export function pureGates(S) {
  const r9 = (a, b) => Math.abs(a - b) <= 1e-9 * Math.max(Math.abs(a), Math.abs(b));
  return {
    nLib: r9(S.N.mine, S.N.lib) && r9(S.N.mine, S.N.exp),
    bornLib: r9(S.born.mine, S.born.lib) && Math.abs(S.born.lib - 4) <= 1e-9,
    shapiroLambda: r9(S.shapiro.Lambda, S.shapiro.LambdaClosed) && Math.abs(S.shapiro.lib - 2) <= 1e-5,
    clockCoeff: Math.abs(S.clockCoeff - 1) <= W.FLOOR,
    splitRatio: Math.abs(S.split.rateRatio - S.split.net1) <= 4e-16 && Math.abs(S.split.nRatio - S.split.grav1) <= 4e-16 && Math.abs(S.split.netMinus - S.split.cross) <= 1e-12,
    restZero: S.restZero.grav === 0 && Math.abs(S.restZero.net - S.restZero.motion) <= 1e-12,
    floor: S.floor === 1e-6,
  };
}
