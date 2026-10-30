// 第319便a(原仮定者の指示(第121報)・決断事項 AN447・AN468・AN469・統括の検証項目 R258): **軸を保つトルクの熱の経路の器の純関数**
// (器 tests/exp-w319a-axisheat.mjs が読む —— html を読まない・状態を持たない)。宣言(走行の前に置く —— 結果を見て変えない)・文献の値・SI の換算・
// 写しの外で源の大きさに倍率を掛ける計算(エンジンの純関数 axisHoldSourceSum・inertialDrag3MaintCell を口 E から受け取って呼ぶ)・合成の判定の参照の式。
//
// ■ 言わないこと: 内部熱・金星の逆転を引きずりで説明したとは書かない。要る τ_hold は「要る大きさの記録」(合わせた値・較正の値と呼ばない)。
//   金星の高い表面温度を内部熱の流束の値に置き換えない(金星は比較の値を置かない)。木星の内部熱の主列(5.444 W/m²)と代替の列(7.485 W/m²)は混ぜない。
//   銀河の大きさ ω_G = Ω_ref ĝ は尺度だけ(第318便d の写しと同じ型 —— 中心 1 体の値を銀河の引きずりと呼ばない)。
export const LIB_VERSION = 'w319a-axisheat-lib-1';
export const C0 = 299792458;
/** 文献の値(本便は一次資料に当たっていない —— 第318便d の正本の meta.literature と同じ出典の名) */
export const LIT = Object.freeze({
  jupiterFlux: Object.freeze({ value: 5.444, unit: 'W/m^2', name: '木星の内部の熱流(Hanel et al. 1981 —— 文献の値・主列)' }),
  jupiterFluxAlt: Object.freeze({ value: 7.485, unit: 'W/m^2', name: '木星の内部の熱流(Li et al. 2018 —— 文献の値・代替の列)' }),
  sunMoI: Object.freeze({ value: 0.07, unit: '-', name: '太陽の慣性モーメントの係数 I/(MR²)(標準の太陽模型の型 —— 文献の値)' }),
});
/** 宣言(走行の前): 写しの步数・刻みの感度の倍率・源の大きさの倍率の候補・銀河の大きさの型・受け手の役割(原仮定者の指示(第121報)の検証の参考) */
export const DECL = Object.freeze({
  steps: 6,                // 履歴の步の後に数える步(銀河の項は履歴に依らないので履歴の步にも 1 回の量がある —— 累計は 1 + steps 步)
  halfSteps: 13,           // h/2 の写し(同じ時間 —— 履歴の步を含めて 2(1 + steps) 步)
  srcCap: 6.5e6,           // 源の側の候補の上限 [m](受け手の R_d には掛けない —— GALAXY_AXIAL_REF_RADIUS_M とは別の数)
  sunFactors: Object.freeze(['k1', 'cap', 'spinJ', 'spinR', 'k2near']),
  // 太陽の項の倍率の候補のうち案2b(源 K2 + 受け手 K1 の混成の近くの形込み)は第319便b の器の値(統合の前の報告の数 —— 統括が統合の後に照合)。ほかは写しの R_d と R から作る
  k2nearFactor: 3.156e9,
  // 銀河の項の候補(向き ±ĝ と大きさ —— 走行の前に置く。どれかを採ったとは書かない): decl は第318便d の写しと同じ尺度 Ω_ref(+ĝ・−ĝ の両方)。vort・one は第319便b の器の値
  //   (統合の前の報告の数 —— 統括が統合の後に照合): vort = 分布した銀河の太陽系近傍の半渦度(+ĝ —— 移送場の診断量で、今の軸引きずり ω_G と同じではない)・
  //   one = 中心 1 体の上限(−ĝ —— 中心 1 体の値を銀河の引きずりと呼ばない)。equal は太陽の項と同じ大きさ(拮抗の型の比較 —— 値を決めたのではない)
  galaxyCands: Object.freeze(['none', 'declPlus', 'declMinus', 'vortPlus', 'oneMinus', 'equalPlus', 'equalMinus']),
  galaxyVort: 1.487e-21, galaxyOne: 1.047e-31,
  galaxy: '第318便d の写しと同じ型: ω_G = Ω_ref ĝ(Ω_ref = V0/R0 —— 尺度だけ)・rdPow 1・refRadius = 太陽の R_d・massPow −1・refMass = 太陽のエンジンの質量(K1 の全天体で応答の係数 1)',
  hold: '維持の型 mode:"maintain"・reaction:"background"・heatTiming:{tauHold: h₀}(本の画面の刻み —— 1 步の量 × h/τ_hold)・compose:"source"・balance:"background"',
  roles: Object.freeze({ 水星: '恒星近傍の特殊軌道', 金星: '自転の逆回転・内部熱', 地球: '三体・衛星の潮汐ロック', 火星: '標準の固体惑星', 木星: '気体惑星・内部熱', 土星: '気体惑星・環' }),
});
/* ───────── 銀河の角運動量の向き ĝ と尺度 Ω_ref(tests/lib-w317c-satcut.mjs の galaxyAxis と同じ値・同じ式・同じ演算の順 —— 器の領域を狭くするため写した)───────── */
export const GAL = Object.freeze({ ngpRaDeg: 192.85948, ngpDecDeg: 27.12825, gcRaDeg: 266.40499, gcDecDeg: -28.93617, V0kms: 230, R0kpc: 8.2, pcMeters: 3.0856775814913673e16 });
export const OBLIQUITY_ARCSEC = 84381.406;
const D2R = Math.PI / 180;
const crossV = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unitV = (a) => { const n = Math.hypot(a[0], a[1], a[2]); return [a[0] / n, a[1] / n, a[2] / n]; };
/** ICRS の向き (α, δ) → J2000 の黄道の単位ベクトル */
export function eclipticOf(ra, dec) {
  const e = OBLIQUITY_ARCSEC / 3600 * D2R, a = ra * D2R, d = dec * D2R;
  const x = Math.cos(d) * Math.cos(a), y = Math.cos(d) * Math.sin(a), z = Math.sin(d);
  return [x, Math.cos(e) * y + Math.sin(e) * z, -Math.sin(e) * y + Math.cos(e) * z];
}
/** 銀河の角運動量の向き ĝ(南銀極)と尺度 Ω_ref = V0/R0 [rad/s] */
export function galaxyAxis() {
  const ngp = eclipticOf(GAL.ngpRaDeg, GAL.ngpDecDeg), gc = eclipticOf(GAL.gcRaDeg, GAL.gcDecDeg);
  const l90 = crossV(ngp, gc), g = unitV(crossV(gc.map((q) => -q), l90));
  return { g, OmRefSI: GAL.V0kms * 1e3 / (GAL.R0kpc * 1e3 * GAL.pcMeters) };
}
export const BODY16 = Object.freeze(['太陽', '水星', '金星', '地球', '月', '火星', '木星', 'イオ', 'エウロパ', 'ガニメデ', 'カリスト', '土星', 'タイタン', '天王星', '海王星', 'トリトン']);
/** 本の単位の SI の倍率(scaleExp) */
export function unitsOf(se) {
  const uL = Math.pow(10, se.L), uT = Math.pow(10, se.T), uM = Math.pow(10, se.M);
  return { len: uL, time: uT, mass: uM, E: uM * uL * uL / (uT * uT), I: uM * uL * uL, W: 1 / uT };
}
/** 熱流 [W/m²] × 4πR² */
export const powerOf = (flux, Rm) => flux * 4 * Math.PI * Rm * Rm;
const nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const angDeg = (a, b) => { const c = [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; return Math.atan2(nrm(c), dot(a, b)) * 180 / Math.PI; };
/**
 * 合成の判定の参照の式(エンジンの axisHoldComposeJudge と同じ量を別に書いた式 —— QA が照合する): a に b を足して速さが減るか
 * (abs(a + b)² − abs(a)² = 2a·b + abs(b)² の符号)・角の式の境界 cos θ* = −abs(b)/(2 abs(a))(大きさが等しいときだけ 120°)
 */
export function composeRef(a, b) {
  const ma = nrm(a), mb = nrm(b), d = dot(a, b), chg = 2 * d + mb * mb, th = ma > 0 ? -mb / (2 * ma) : null;
  return { change: chg, less: chg < 0, cos: (ma > 0 && mb > 0) ? d / (ma * mb) : null, cosThreshold: th, thresholdDeg: (th !== null && th >= -1) ? Math.acos(th) * 180 / Math.PI : null };
}
/** 源の大きさの倍率の候補(太陽の項 —— 写しの外で掛ける。遠方では源の回転モーメントの半径の二乗で比べる型 —— 第318便d の表の倍率と同じ型) */
export function sunFactorsOf(RdSunM, RSunM) {
  const spinR = Math.pow(RSunM / RdSunM, 2);
  return { k1: 1, cap: Math.pow(Math.min(RSunM, DECL.srcCap) / RdSunM, 2), spinJ: spinR * 2.5 * LIT.sunMoI.value, spinR, k2near: DECL.k2nearFactor };
}
export const FACTOR_JA = Object.freeze({ k1: '今の K1(R_d = Y_k m)', cap: '案1 観測半径の上限 6.5e6 m', spinJ: '案3 源の角運動量 J(I = 0.07 M R²)', spinR: '案2a 観測半径 R_☉', k2near: '案2b K2 の近くの形込み(第319便b の値)' });
export const GALAXY_JA = Object.freeze({ none: '無し', declPlus: '+ĝ Ω_ref(宣言の尺度)', declMinus: '−ĝ Ω_ref(宣言の尺度)', vortPlus: '+ĝ 分布の半渦度(第319便b の値)',
  oneMinus: '−ĝ 中心 1 体の上限(第319便b の値)', equalPlus: '+ĝ 太陽の項と同じ大きさ', equalMinus: '−ĝ 太陽の項と同じ大きさ' });
/** 銀河の項の倍率(写しの宣言の +ĝ Ω_ref に対する符号つきの倍率)。galSI: 写しの銀河の項の大きさ [rad/s]・sunSI: 倍率を掛けた太陽の項の大きさ [rad/s] */
export function galaxyMulOf(key, galSI, sunSI) {
  if (!(galSI > 0) || key === 'none') return 0;
  switch (key) {
    case 'declPlus': return 1;
    case 'declMinus': return -1;
    case 'vortPlus': return DECL.galaxyVort / galSI;
    case 'oneMinus': return -DECL.galaxyOne / galSI;
    case 'equalPlus': return sunSI / galSI;
    case 'equalMinus': return -sunSI / galSI;
    default: return NaN;
  }
}
/**
 * 写しの外で源の大きさに倍率を掛けた 1 回の量(エンジンの純関数 E.sourceSum = axisHoldSourceSum・E.cell = inertialDrag3MaintCell を呼ぶ)。
 * rec = {I, s0, ax: [3], flat, sources: [{key, omega: [3], sigma}]}・mul = {key: 倍率}(無い源は 1・0 は外す)。
 * 戻り値: 源ごとの和(熱・供給・軸のコスト)と合成の 1 回(源の和の ω に 1 回)の熱・差
 */
export function rescaled(E, rec, mul) {
  const V = new Float64Array((rec.sources.length) * 4), SM = new Float64Array(26), W = [0, 0, 0];
  let s = 0, Wsig = 0;
  for (const q of rec.sources) {
    const k = (mul[q.key] === undefined) ? 1 : mul[q.key];
    V[s * 4] = q.omega[0] * k; V[s * 4 + 1] = q.omega[1] * k; V[s * 4 + 2] = q.omega[2] * k; V[s * 4 + 3] = q.sigma * k;
    W[0] += V[s * 4]; W[1] += V[s * 4 + 1]; W[2] += V[s * 4 + 2]; Wsig += V[s * 4 + 3]; s++;
  }
  const a = rec.ax;
  E.sourceSum(rec.I, rec.s0, a[0], a[1], a[2], rec.flat, V, s, SM, null, 0);
  const C = new Float64Array(9);
  let wp, q;
  if (rec.flat) { wp = Wsig; q = [0, 0, 0]; } else { wp = W[0] * a[0] + W[1] * a[1] + W[2] * a[2]; q = [W[0] - wp * a[0], W[1] - wp * a[1], W[2] - wp * a[2]]; }
  E.cell(rec.I, rec.s0, a[0], a[1], a[2], wp, q[0], q[1], q[2], C, 0);
  return { heat: SM[2], axisCost: SM[0], speed: SM[1], speedPos: SM[15], supply: SM[16], decel: SM[11], cells: SM[10],
    composite: { heat: C[2], axisCost: C[0], speed: C[1] }, difference: SM[2] - C[2] };
}
/**
 * 純関数の場面(エンジンの axisHoldSourceSum・axisHoldComposeJudge・inertialDrag3MaintCell —— 口 E)。I = 1・Ω_I = ẑ(大きさ 1)。
 * ① 等しい大きさの 2 つの角速度の合成(119°・120°・121°)と大きさの比 0.1 の境界(cos θ* = −0.05)
 * ② 反対で同じ大きさの 2 源(軸に垂直 ±0.1 x̂): 合成の熱 0・源ごとの熱 > 0・合成のトルク 0
 * ③ 平行の駆動(+0.1 ẑ): 軸のコスト 0・E_speed > 0(熱)/ 逆平行(−0.1 ẑ): 供給
 * ④ 口座の閉じ(源ごと): 場 + 受け皿 + 熱 = 0(E)
 * ⑤ 源の分割の感度(同じ源を 2 つの半分に分けると 2 次の項が半分 —— 天体を分けた本の解釈の記録)
 */
export function pureScenes(E) {
  const out = {};
  const J = (a, b) => E.judge(a[0], a[1], a[2], b[0], b[1], b[2]);
  const rot = (deg, m) => { const r = deg * Math.PI / 180; return [m * Math.cos(r), m * Math.sin(r), 0]; };
  out.equal = [119, 120, 121].map((deg) => { const j = J([1, 0, 0], rot(deg, 1)), r = composeRef([1, 0, 0], rot(deg, 1));
    return { deg, magSum: j.magSum, change: j.change, less: j.less, lessByAngle: j.lessByAngle, thresholdDeg: j.thresholdDeg, refSame: j.less === r.less && Math.abs(j.change - r.change) <= 1e-15 }; });
  const thr01 = Math.acos(-0.05) * 180 / Math.PI;
  out.ratio01 = { thresholdDeg: J([1, 0, 0], rot(90, 0.1)).thresholdDeg, expectDeg: thr01,
    below: J([1, 0, 0], rot(thr01 - 0.5, 0.1)).less, above: J([1, 0, 0], rot(thr01 + 0.5, 0.1)).less, at120: J([1, 0, 0], rot(120, 0.1)).less };
  const sum = (V, ns) => { const SM = new Float64Array(26), SL = new Float64Array(ns * 6); E.sourceSum(1, 1, 0, 0, 1, false, Float64Array.from(V), ns, SM, SL, 0); return { SM: Array.from(SM.subarray(0, 17)), SL: Array.from(SL) }; };
  const cell = (w) => { const C = new Float64Array(9), wp = w[2]; E.cell(1, 1, 0, 0, 1, wp, w[0], w[1], 0, C, 0); return Array.from(C); };
  const opp = sum([0.1, 0, 0, 0, -0.1, 0, 0, 0], 2), one = cell([0.1, 0, 0]), comp = cell([0, 0, 0]);
  out.opposed = { sourceHeat: opp.SM[2], compositeHeat: comp[2], oneSource: one[2], torqueSum: [opp.SM[12], opp.SM[13], opp.SM[14]], twice: Object.is(opp.SM[2], 2 * one[2]) || Math.abs(opp.SM[2] - 2 * one[2]) <= 1e-16 };
  const par = sum([0, 0, 0.1, 0], 1), anti = sum([0, 0, -0.1, 0], 1);
  out.parallel = { axisCost: par.SM[0], speed: par.SM[1], heat: par.SM[2], supply: par.SM[16] };
  out.antiParallel = { axisCost: anti.SM[0], speed: anti.SM[1], heat: anti.SM[2], supply: anti.SM[16], decel: anti.SM[11] };
  // ④ 口座(1 源 0.1 x̂ + 1 源 −0.05 ẑ): 場 ΔE = −Σ E_speed・受け皿 ΔE = −(Σ 軸のコスト + 供給)・熱 = Σ 軸のコスト + Σ max(E_speed, 0)
  const mix = sum([0.1, 0, 0, 0, 0, 0, -0.05, 0], 2), fE = -mix.SM[1], bE = -(mix.SM[0] + mix.SM[16]);
  out.ledger = { field: fE, sink: bE, heat: mix.SM[2], residual: fE + bE + mix.SM[2], heatFromParts: mix.SM[0] + mix.SM[15] };
  // ⑤ 分割の感度: 0.1 x̂ を 0.05 x̂ × 2 に分ける
  const whole = sum([0.1, 0, 0, 0], 1), split = sum([0.05, 0, 0, 0, 0.05, 0, 0, 0], 2);
  out.split = { whole: whole.SM[2], split: split.SM[2], ratio: split.SM[2] / whole.SM[2] };
  return out;
}
/** 純関数の場面の門(QA と器が同じ規則で読む) */
export function pureGates(P) {
  return {
    equal120: P.equal[0].less === false && P.equal[2].less === true && Math.abs(P.equal[1].change) <= 1e-15 && Math.abs(P.equal[1].thresholdDeg - 120) <= 1e-12 && P.equal.every((r) => r.refSame),
    ratio01: Math.abs(P.ratio01.thresholdDeg - P.ratio01.expectDeg) <= 1e-12 && P.ratio01.below === false && P.ratio01.above === true && P.ratio01.at120 === true,
    opposed: P.opposed.compositeHeat === 0 && P.opposed.sourceHeat > 0 && P.opposed.twice && P.opposed.torqueSum.every((z) => z === 0),
    parallel: P.parallel.axisCost === 0 && P.parallel.speed > 0 && P.parallel.heat === P.parallel.speed && P.antiParallel.axisCost === 0 && P.antiParallel.heat === 0 && P.antiParallel.supply > 0,
    ledger: Math.abs(P.ledger.residual) <= 1e-16 && Math.abs(P.ledger.heat - P.ledger.heatFromParts) <= 1e-16,
  };
}
