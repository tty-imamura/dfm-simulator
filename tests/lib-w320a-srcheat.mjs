// 第320便a(原仮定者の回答(2026-10-30 —— AN475)「減速させる側の引きずりを背景宇宙が補う分も熱に数える」・原仮定者の裁定(第122報)AN471「案3(J)を確かめる。
//   案2bは次点。様々な可能性を探索する」・統括の検証項目 R262): **読み (b) と源のモーメントの半径 R_src の器の純関数**(器 tests/exp-w320a-srcheat.mjs が読む ——
//   html を読まない・状態を持たない)。宣言(走行の前に置く —— 結果を見て変えない)・文献の値・SI の換算・要る大きさ・(b) の純関数の場面(エンジンの純関数
//   axisHoldSourceSum〔(b) の印〕・inertialDrag3MaintCell・inertialDragIsqM1・inertialDragIsqM1Src・inertialDragIsqSrcRadiusOf を口 E から受け取って呼ぶ)。
//
// ■ 言わないこと: 内部熱・金星の逆転・公転面を引きずりで説明したとは書かない(要る大きさとの比を並べるだけ)。要る τ_hold は「要る大きさの記録」(合わせた値・較正の値と
//   呼ばない)。金星の高い表面温度を内部熱の流束の値に置き換えない。木星の内部熱の主列(5.444 W/m²)と代替の列(7.485 W/m²)は混ぜない。源の慣性係数 f(J の源の側)と
//   受け手の慣性係数(熱の比較の受け手 I)は別の宣言。一つの案で公転面・金星・木星がそろうとは書かない。銀河の大きさ ω_G = Ω_ref ĝ は尺度だけ(中心 1 体の値を
//   銀河の引きずりと呼ばない)。文献の値は「本便は一次資料に当たっていない」と書く。
import { GAL, galaxyAxis, unitsOf, powerOf, angDeg, composeRef, BODY16 } from './lib-w319a-axisheat.mjs';
export { GAL, galaxyAxis, unitsOf, powerOf, angDeg, composeRef, BODY16 };
export const LIB_VERSION = 'w320a-srcheat-lib-1';
export const AU = 1.495978707e11, YEAR = 365.25 * 86400, GYR = 1e9 * YEAR;
/** 文献の値(本便は一次資料に当たっていない —— 第318便d・第319便b の正本の meta.literature と同じ出典の名) */
export const LIT = Object.freeze({
  jupiterFlux: Object.freeze({ value: 5.444, unit: 'W/m^2', name: '木星の内部の熱流(Hanel et al. 1981 —— 文献の値・主列)' }),
  jupiterFluxAlt: Object.freeze({ value: 7.485, unit: 'W/m^2', name: '木星の内部の熱流(Li et al. 2018 —— 文献の値・代替の列)' }),
  moi: Object.freeze({ value: 'Sun 0.07・Mercury 0.346・Venus 0.33・Earth 0.3307・Moon 0.3929・Mars 0.3644・Jupiter 0.254・Saturn 0.21', unit: '-', name: '源の慣性係数 f = I/(m R_obs²)(太陽は標準の太陽模型の型・惑星と月は重力場と歳差の解析の型 —— 第319便b の表と同じ文献の値)' }),
  sunAge: Object.freeze({ value: 4.567e9, unit: 'yr', name: '太陽系の年齢(隕石の最古の包有物の年代の型 —— 文献の値)' }),
});
/** 源の慣性係数 f(🗺️ の添字 —— 第319便b の tests/lib-w319b-srcradius.mjs の MOI と同じ値。名の無い天体は宣言しない —— エンジンでは R_d のまま) */
export const MOI16 = Object.freeze({ 0: 0.07, 1: 0.346, 2: 0.33, 3: 0.3307, 4: 0.3929, 5: 0.3644, 6: 0.254, 11: 0.21 });
/** 宣言(走行の前) */
export const DECL = Object.freeze({
  steps: 6,          // 履歴の步の後に数える步(第319便a の写しと同じ —— 累計は 1 + steps 步)
  halfSteps: 13,     // h/2 の写し(同じ時間)
  srcCap: 6.5e6,     // capObs の源の側の上限 [m](受け手の R_d には掛けない)
  // 源のモーメントの種類(エンジンの鍵 invSq.sourceMoment.kind —— "now" は宣言しない写し)。J は 2 つの宣言: 太陽だけに f(第319便a の F の「案3」と同じ型 —— 第319便b の比の照合)と
  //   名のある 8 天体に f(MOI16 —— 第319便b の案3 の写しは名の無い天体も 0.4 —— 本便は宣言しない天体を R_d のまま)
  kinds: Object.freeze(['now', 'Jsun', 'J', 'J16', 'obs', 'capObs']),
  // J16(🗺️ だけ —— 2 体の本は J と同じ): 名のある 8 天体の f に加えて名の無い天体(衛星 7 つ)に一様な球の 0.4(第319便b の案3 の写しの型 —— 宣言の値で文献の値ではない)
  fUniform: 0.4,
  galaxyCands: Object.freeze(['none', 'declPlus', 'declMinus']),
  // 受け手の慣性係数の 2 列: engine(エンジンの維持の型の I = ½ m R² —— 明示潮汐を宣言しない本)・src(受け手の f = 源の f —— 木星 0.254。熱・率・要る τ_hold は f に比例 ——
  //   1 回の量の全成分が I に比例するので ½ の列に f/½ を掛けた数)
  recvF: Object.freeze(['engine', 'src']), engineRecvF: 0.5,
  planeTiltDeg: 3, venusPeriodGyr: 1,
  roles: Object.freeze([
    Object.freeze({ i: 1, role: '恒星近傍の特殊軌道', req: 'plane' }), Object.freeze({ i: 2, role: '自転の逆回転・内部熱', req: 'venus' }),
    Object.freeze({ i: 3, role: '三体・衛星の潮汐ロック', req: 'plane' }), Object.freeze({ i: 5, role: '標準の固体惑星', req: 'plane' }),
    Object.freeze({ i: 6, role: '気体惑星・内部熱', req: 'jupiter' }), Object.freeze({ i: 11, role: '気体惑星・環', req: 'none' })]),
  // 第319便b の案との対応(比較の照合 —— 第319便b の器の写しの外の式とエンジンの値)
  plan319b: Object.freeze({ now: 'now', Jsun: 'p3', J: 'p3', J16: 'p3', obs: 'p2a', capObs: 'p1' }),
  hold: '維持の型 mode:"maintain"・reaction:"background"・heatTiming:{tauHold: h₀}(本の画面の刻み —— 1 步の量 × h/τ_hold)・compose:"source"・balance:"background"(読み (b) —— 版 w320a-axishold-balance-2)',
  galaxy: '第319便a の写しと同じ型: ω_G = ±Ω_ref ĝ(Ω_ref = V0/R0 —— 尺度だけ)・rdPow 1・refRadius = 太陽の R_d・massPow −1・refMass = 太陽のエンジンの質量(K1 の全天体で応答の係数 1)',
});
export const KIND_JA = Object.freeze({ now: '今(R_src = R_d = Y_k m)', Jsun: 'J(太陽だけ f = 0.07)', J: 'J(8 天体に f)', J16: 'J(8 天体に f + 衛星 7 つに 0.4)', obs: 'obs(R_src = R_obs —— 案2a の比較の列)', capObs: 'capObs(min(R_obs, 6.5e6 m) —— 案1 の比較の列)' });
export const GALAXY_JA = Object.freeze({ none: '無し', declPlus: '+ĝ Ω_ref(宣言の尺度)', declMinus: '−ĝ Ω_ref(宣言の尺度)' });
export const RECVF_JA = Object.freeze({ engine: '受け手 I = ½ m R²(エンジン)', src: '受け手 f = 源の f(木星 0.254)' });
/** 2 体の本の惑星の f(🌋 金星・🏀 木星 —— MOI16 と同じ値。添字 1 が惑星) */
export const MOI2 = Object.freeze({ venus: Object.freeze({ 0: 0.07, 1: 0.33 }), jupiter: Object.freeze({ 0: 0.07, 1: 0.254 }) });
/** エンジンの鍵の宣言(kind → invSq.sourceMoment —— "now" は null)。key: 'solar16' | 'venus' | 'jupiter'(J の f の添字は本の天体) */
export function sourceMomentOf(kind, key = 'solar16') {
  if (kind === 'now') return null;
  if (kind === 'Jsun') return { kind: 'J', f: { 0: MOI16[0] } };
  if (kind === 'J') return { kind: 'J', f: Object.assign({}, key === 'solar16' ? MOI16 : MOI2[key]) };
  if (kind === 'J16') { if (key !== 'solar16') return { kind: 'J', f: Object.assign({}, MOI2[key]) }; const f = {}; for (let j = 0; j < 16; j++) f[j] = (MOI16[j] !== undefined) ? MOI16[j] : DECL.fUniform; return { kind: 'J', f }; }
  if (kind === 'obs' || kind === 'capObs') return { kind };
  throw new Error('未知の種類: ' + kind);
}
/** 要る大きさ(第318便d・第319便b の宣言の型 —— 同じ式で作り直す): 公転面の傾斜 3° / 太陽系の年齢・金星の軸を π / 1 Gyr・木星の内部熱の主列と代替の列 */
export function requiredOf(RjupM) {
  const Tage = LIT.sunAge.value * YEAR;
  return { Tage, plane: DECL.planeTiltDeg * Math.PI / 180 / Tage, venus: Math.PI / (DECL.venusPeriodGyr * GYR), jupiterP: powerOf(LIT.jupiterFlux.value, RjupM), jupiterPAlt: powerOf(LIT.jupiterFluxAlt.value, RjupM) };
}
const nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
/** 回転引きずりの速度 u_rot = (Ω_j â_j) × rot_ij(エンジンの inertialDragIsqBuild の回転の項と同じ演算) */
export function uRotOf(rv, Om, a) { const ax0 = a[0] * Om, ay0 = a[1] * Om, az0 = a[2] * Om; return [ay0 * rv[2] - az0 * rv[1], az0 * rv[0] - ax0 * rv[2], ax0 * rv[1] - ay0 * rv[0]]; }
/** 公転面の角速度の大きさ w = abs(u_rot)/(r sinθ)(第319便b の wRot と同じ型 —— θ = 源の軸と源から受け手への向きの角) */
export function wRotOf(u, d, aj) { const r = nrm(d), sn = nrm(crs(aj, d.map((q) => q / r))); return { u: nrm(u), w: nrm(u) / (r * sn), r }; }

/* ───────── 純関数の場面(読み (b)・源のモーメントの M1・R_src)───────── */
/**
 * E = {sourceSum, cell, m1, m1src, rsrc}。I = 1・Ω_I = ẑ(大きさ 1)。
 * ① 反対で同じ大きさの 2 源(±0.1 x̂): (b) の源ごとの熱 = 1 源の (b) の熱の 2 倍・合成の熱 0
 * ② 逆平行(−0.1 ẑ —— 減速): (b) の熱 = 供給(第319便a の契約の熱 0)/ 平行(+0.1 ẑ): (b) = 第319便a の契約
 * ③ 口座(1 源 0.1 x̂ + 1 源 −0.05 ẑ): 場 ΔE = −Σ max(E_speed, 0)・受け皿 ΔE = −(軸のコスト + 供給)・熱 = 軸のコスト + 正の分 + 供給 —— 残差 0
 * ④ (b) の印の有無で熱以外の和は同じビット・SM[26] = 第319便a の契約の熱の和(印なしの SM[2] とビット同一)
 * ⑤ 受け手の慣性係数の比例: I を 0.508 倍すると (b) の熱も 0.508 倍(相対 1e-15)
 * ⑥ M1Src: 外部(r > R)は M1 とビット同一・r = R で値と微分が連続・内部は動径の求積(Gauss–Legendre を r で分けた多項式 —— 厳密)と相対 1e-14
 * ⑦ R_src: J は (2/5) R_src² = f R_obs²(相対 1e-15)・obs = R_obs・capObs = min(R_obs, cap)・f の無い J・R_obs ≤ 0 は null
 */
export function pureScenesB(E) {
  const out = {};
  const sum = (V, ns, bk) => { const SM = new Float64Array(27), SL = new Float64Array(ns * 6); E.sourceSum(1, 1, 0, 0, 1, false, Float64Array.from(V), ns, SM, SL, 0, bk); return { SM: Array.from(SM), SL: Array.from(SL) }; };
  const cell = (w, I = 1) => { const C = new Float64Array(9); E.cell(I, 1, 0, 0, 1, w[2], w[0], w[1], 0, C, 0); return Array.from(C); };
  const hB = (c) => c[0] + Math.abs(c[1]);
  const opp = sum([0.1, 0, 0, 0, -0.1, 0, 0, 0], 2, true), one = cell([0.1, 0, 0]), comp = cell([0, 0, 0]);
  out.opposed = { sourceHeatB: opp.SM[2], compositeHeatB: hB(comp), oneSourceB: hB(one), twice: Math.abs(opp.SM[2] - 2 * hB(one)) <= 1e-16 };
  const anti = sum([0, 0, -0.1, 0], 1, true), anti0 = sum([0, 0, -0.1, 0], 1, false), par = sum([0, 0, 0.1, 0], 1, true), par0 = sum([0, 0, 0.1, 0], 1, false);
  out.antiParallel = { heatB: anti.SM[2], heat319: anti0.SM[2], supply: anti.SM[16], speed: anti.SM[1], old26: anti.SM[26] };
  out.parallel = { heatB: par.SM[2], heat319: par0.SM[2], speed: par.SM[1] };
  const mix = sum([0.1, 0, 0, 0, 0, 0, -0.05, 0], 2, true), mix0 = sum([0.1, 0, 0, 0, 0, 0, -0.05, 0], 2, false);
  const fE = -mix.SM[15], bE = -(mix.SM[0] + mix.SM[16]);
  out.ledger = { field: fE, sink: bE, heat: mix.SM[2], residual: fE + bE + mix.SM[2], heatFromParts: mix.SM[0] + mix.SM[15] + mix.SM[16], old26: mix.SM[26], heat319: mix0.SM[2],
    field319: -mix0.SM[1], residual319: -mix0.SM[1] - (mix0.SM[0] + mix0.SM[16]) + mix0.SM[2] };
  let same = true; for (let k = 0; k < 17; k++) if (k !== 2 && !Object.is(mix.SM[k], mix0.SM[k])) same = false;
  out.flag = { otherSame: same, old26Same: Object.is(mix.SM[26], mix0.SM[2]), slHeatB: [mix.SL[2], mix.SL[8]], slHeat319: [mix0.SL[2], mix0.SL[8]] };
  const f1 = cell([0.03, -0.02, -0.07], 1), f2 = cell([0.03, -0.02, -0.07], 0.508);
  out.inertia = { ratio: hB(f2) / hB(f1), expect: 0.508 };
  // ⑥ M1Src
  const B1 = new Float64Array(4), B2 = new Float64Array(4), R = 0.7;
  let extSame = true; for (const r of [0.7000001, 0.9, 2.1, 7.5, 1e3]) { E.m1(r, R, B1); E.m1src(r, R, B2); if (!Object.is(B1[2], B2[2]) || !Object.is(B1[3], B2[3])) extSame = false; }
  E.m1src(R, R, B2); const atV = B2[2], atD = B2[3]; E.m1(R * (1 + 1e-12), R, B1);
  const gl = glNodes(8), quad = (r) => { let s = 0; const seg = (a, b, fn) => { for (let k = 0; k < gl.x.length; k++) { const x = a + (b - a) * gl.x[k]; s += (b - a) * gl.w[k] * fn(x); } };
    seg(0, r, (p) => p * p * p * p / (r * r)); seg(r, R, (p) => p * r); return s / (R * R * R); };
  let inMax = 0; const inRows = [];
  for (const t of [0.1, 0.35, 0.6, 0.95]) { const r = t * R; E.m1src(r, R, B2); const q = quad(r), d = Math.abs(B2[2] - q) / Math.abs(q); inMax = Math.max(inMax, d); inRows.push({ rOverR: t, M1: B2[2], quad: q, rel: d }); }
  out.m1src = { exteriorSame: extSame, atR: atV, outsideAtR: B1[2], contValue: Math.abs(atV - B1[2]) / B1[2], derivAtR: atD, outsideDeriv: B1[3], contDeriv: Math.abs(atD - B1[3]) / Math.abs(B1[3]), interior: inRows, interiorRelMax: inMax };
  // ⑦ R_src
  const Ro = 0.695, rJ = E.rsrc('J', Ro, 0.07, 0.03), rO = E.rsrc('obs', Ro, null, 0.03), rC = E.rsrc('capObs', Ro, null, 0.03), rC2 = E.rsrc('capObs', 0.02, null, 0.03);
  out.rsrc = { J: rJ, Jcheck: Math.abs(0.4 * rJ * rJ - 0.07 * Ro * Ro) / (0.07 * Ro * Ro), obs: rO, capObs: rC, capObsSmall: rC2, Jnull: E.rsrc('J', Ro, null, 0.03), zeroR: E.rsrc('obs', 0, null, 0.03), unknown: E.rsrc('k2near', Ro, null, 0.03) };
  return out;
}
/** 純関数の場面の門(QA と器が同じ規則で読む) */
export function pureGatesB(P) {
  return {
    opposed: P.opposed.compositeHeatB === 0 && P.opposed.sourceHeatB > 0 && P.opposed.twice,
    antiParallel: P.antiParallel.heat319 === 0 && P.antiParallel.heatB === P.antiParallel.supply && P.antiParallel.heatB > 0 && P.antiParallel.old26 === 0 && P.antiParallel.speed < 0,
    parallel: Object.is(P.parallel.heatB, P.parallel.heat319) && P.parallel.speed > 0,
    ledger: Math.abs(P.ledger.residual) <= 1e-16 && Math.abs(P.ledger.heat - P.ledger.heatFromParts) <= 1e-16 && Math.abs(P.ledger.residual319) <= 1e-16 && P.ledger.heat > P.ledger.heat319,
    flag: P.flag.otherSame && P.flag.old26Same,
    inertia: Math.abs(P.inertia.ratio - P.inertia.expect) <= 1e-15,
    m1src: P.m1src.exteriorSame && P.m1src.contValue <= 1e-11 && P.m1src.contDeriv <= 1e-11 && P.m1src.interiorRelMax <= 1e-14,
    rsrc: P.rsrc.Jcheck <= 1e-15 && P.rsrc.obs === 0.695 && P.rsrc.capObs === 0.03 && P.rsrc.capObsSmall === 0.02 && P.rsrc.Jnull === null && P.rsrc.zeroR === null && P.rsrc.unknown === null,
  };
}
/** Gauss–Legendre の節点と重み([0, 1] —— Newton 法) */
export function glNodes(n) {
  const x = [], w = [];
  for (let i = 1; i <= n; i++) {
    let z = Math.cos(Math.PI * (i - 0.25) / (n + 0.5)), dp = 0;
    for (let it = 0; it < 100; it++) { let p1 = 1, p2 = 0; for (let j = 1; j <= n; j++) { const p3 = p2; p2 = p1; p1 = ((2 * j - 1) * z * p2 - (j - 1) * p3) / j; } dp = n * (z * p1 - p2) / (z * z - 1); const z1 = z; z = z1 - p1 / dp; if (Math.abs(z - z1) < 1e-16) break; }
    x.push((1 - z) / 2); w.push(1 / ((1 - z * z) * dp * dp));
  }
  return { x, w };
}
