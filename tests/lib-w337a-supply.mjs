// 第337便a(原仮定者の指示(2026-11-14 —— 第138報)「安定した天体の運行は、偶然では無く、釣り合った結果と捉える。釣り合う為には、正と負、供給と減衰の両方が必要である。
//   減衰とは、供給が止まるとピタリと止まるものでは無い意味を含む」「銀河の回転に対して、太陽系は逆向きに軸を60度傾けて回っている。供給の向きは合っていて、傾きはノブになる」
//   「原始太陽系は、銀河の渦の中の、小さな渦が起源となる …… 成長して角運動量を保存して回転速度が増す。軸引きずりとのズレで内部熱が高まり、恒星が点火する」・統括の検証項目 R337):
//   **外部からの供給と減衰の純関数** —— 場の読みと向き(慣性系の渦度・共回転系のずれの渦度・周転円の回り・剛体の場の角速度 s_field に対する相対の渦度)・傾きのノブ θ・
//   起源の角運動量の帳簿(一様な雲)・駆動 + 減衰の帳簿(I ṡ = N_in − Γ_d (s − ω_eff) —— 閉じた式と数値の積分・供給 OFF の漸減・収支)・天体ごとの熱の上限・供給の則の探索(対数の最小二乗)。
//   (段 supply-337a —— 器 tests/exp-w337a-supply.mjs・正本 tests/out/supply-337a.json)。**探索の候補の表だけ** —— エンジン・内蔵の本・受理器・既存の lib の本文は変えない。
//   この lib は何も import しない(html を読まない・ネットへ取りに行かない・乱数を使わない)。
//
// ■ 符号の約束: 銀河の角運動量の向き L̂(第335便b の `galacticAxes` の Lhat —— 銀河の北極の反対)を正とする符号つきの角速度 ω(読みはどれも ±L̂ の向き)。
//   渦度 ζ = (1/R) d(R v)/dR = −2B(慣性系)・共回転の枠(角速度 Ω)では ζ − 2Ω = −2A。読みの角速度は渦度の半分(流体の要素の回る率)—— 周転円は振動数 ν_ep = √(−4ΩB) で逆向き。
//   DFM の読み: 源の引きずりの速度の場を剛体の回転 s_field L̂(ノブ)と置き、差動回転する物質の場に対する相対の渦度 −2B − 2 s_field(その半分を角速度に)。逆回転になる条件は s_field > −B。
// ■ 言わないこと: 読みは候補の表(どの読みなら向きが合うか)—— 銀河が自転を供給する機構の同定ではない。帳簿は「このノブの組なら閉じる」の表。供給の則は対数の最小二乗の候補(法則ではない)。
export const LIB_VERSION = 'w337a-supply-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const v3 = (a) => Array.isArray(a) && a.length === 3 && a.every(fin);
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const unit = (a) => { const n = nrm(a); return n > 0 ? [a[0] / n, a[1] / n, a[2] / n] : [0, 0, 0]; };
const relD = (a, b) => (a === b ? 0 : Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b), 1e-300));
const DEG = Math.PI / 180;
export const KPC = 3.0856775814913673e19, PC = KPC / 1e3;
/** km s⁻¹ kpc⁻¹ → rad/s */
export const KMS_KPC = 1e3 / KPC;

/** 一覧 */
export const CURVES = Object.freeze(['flat', 'kepler', 'rigid', 'oort']);
export const READINGS = Object.freeze(['orbit', 'vortInertial', 'shearCorot', 'epicycle', 'dfmRigid']);
export const READING_JA = Object.freeze({ orbit: '銀河の公転の角速度 Ω(第335便b の場の読み —— 対照)', vortInertial: '慣性系の渦度の半分 −B', shearCorot: '共回転系のずれの渦度の半分 −A',
  epicycle: '周転円の回り −ν_ep', dfmRigid: '剛体の場 s_field に対する相対の渦度の半分 −B − s_field' });
export const CURVE_JA = Object.freeze({ flat: '平坦(v 一定)', kepler: 'ケプラー(v ∝ R^−1/2)', rigid: '剛体(v ∝ R)', oort: 'オールトの量(文献の値)' });

/** 宣言(走行の前に置く —— 走らせたノブの格子と判定の物差し) */
export const DECL = Object.freeze({
  G: 6.674e-11, AU: 1.495978707e11, yearS: 365.25 * 86400,
  /** オールトの量(第329便b の器の宣言と同じ値 —— Bovy 2017 MNRAS 468 L63・Gaia DR1 —— 文献の値・未照合)[km s⁻¹ kpc⁻¹] */
  oort: Object.freeze({ A: 15.3, B: -11.9, src: 'Bovy 2017 MNRAS 468 L63(Gaia DR1 のオールトの量 A 15.3・B −11.9 km s⁻¹ kpc⁻¹ —— 第329便b の器の宣言と同じ値)—— 文献の値・未照合' }),
  /** 主の回転曲線(T3〜T5 の ω_eff)と主の読み(逆回転の読みのうち共回転系のずれ)—— 他の読みも同じ表に並べる */
  mainCurve: 'oort', mainReading: 'shearCorot',
  /** DFM の読みのノブ s_field の格子(÷ 回転曲線の Ω)と J 等価の s_d の行(第335便b の正本の値を器が足す) */
  sFieldOverOmega: Object.freeze([0, 0.25, 0.5, 1, 2, 4]),
  /** 傾きのノブ θ(逆向きからの傾き)の格子と既定 */
  thetaDeg: Object.freeze([0, 15, 30, 45, 60, 75, 90]), thetaMain: 60,
  /** 起源の雲(一様な球 —— I = (2/5) M R_c²)の半径の格子 */
  cloudRcAU: Object.freeze([1e3, 1e4, 1e5]), cloudRcPc: Object.freeze([0.1, 1]), cloudShape: 0.4,
  /** 駆動 + 減衰の数値の積分(古典の RK4 —— τ = I/Γ_d の単位で 供給 OFF の時刻 3 τ・終わり 8 τ・步 4000) */
  ode: Object.freeze({ tOffOverTau: 3, tEndOverTau: 8, steps: 4000, s0OverStar: 0.2, wOverStar: -0.05 }),
  /** 供給の則の探索の物差し: 対数の残差 |Δlog10 s| ≤ 0.3(2 倍の内)を「満たせた」とする */
  fitTol: 0.3,
  /** ずれの熱の Γ_d ∝ R^d の格子(T5 —— 熱の上限の則が主の組を満たさないときの代わりの格子) */
  shearD: Object.freeze([-2, 0, 2]),
  /** 差分の読み(原仮定者の補足(2026-11-14 —— 第138報の補足)): 主 diff(近い面と遠い面の差分だけ)・α の格子・横の面の分の割合 λ の格子・角の置き方(原始太陽系 180°・今の太陽系 120°) */
  complementMain: 'static', rHalfAU: Object.freeze([0.2, 0.387, 0.5, 0.723, 1, 1.524, 5.2, 30.1]),
  axialMain: 'diff', axialAlphas: Object.freeze([1, 2, 3]), axialAlphaMain: 2, axialLambda: Object.freeze([0, 0.5, 1]), protoDeg: 180, nowDeg: 120,
  /** 恒等式の門の相対の許容・閉じた式と数値の積分の差の許容 */
  idTol: 1e-12, odeTol: 1e-9,
});
/** 宣言の文(正本の先頭 —— 何を測ったか) */
export const DECL_TEXT = Object.freeze({
  axial: '差分の読み(主 —— 原仮定者の補足): 源 j の項 F_j = w_j (C_j − v_i)/W(W は受け手の位置で固定)の diff = û × ∂_û F_j(近い面と遠い面の差分だけ)/ full = ½∇×F_j(回転率の全部 —— W 固定の EQ-31 の型)/ mix = (1 − λ) diff + λ full。EQ-31(`integratedField` の ω = ½∇×U —— W の勾配を含む)は比べる列。角は 原始太陽系 180°・今の太陽系 120°(傾き 60°)',
  t1: '読みは ±L̂ の向きの符号つきの角速度: orbit = Ω(第335便b の対照)・vortInertial = −B(ζ = −2B の半分)・shearCorot = −A(共回転の枠の ζ − 2Ω = −2A の半分)・epicycle = −ν_ep(ν_ep = √(−4ΩB))・dfmRigid = −B − s_field(ノブ)。受け手の軸 x̂ への射影 ω (L̂·x̂)',
  tilt: '傾き θ(逆向きからの角): 射影 cos θ・同じ大きさの 2 つの角速度(なす角 180° − θ)の合成の大きさ 2 sin(θ/2)(θ = 60° でちょうど 1)',
  t2: '一様な球の雲 L_c = (2/5) M R_c² |ω₀| と今の太陽系の角運動量 L_now(本の時刻の状態 —— 太陽の自転 + 惑星の公転 + 惑星の自転)を比べ、合う R_c = √(L_now/((2/5) M |ω₀|))',
  t3: 'I ṡ = N_in − Γ_d (s − ω_eff)・s* = ω_eff + N_in/Γ_d・τ = I/Γ_d・供給 OFF の後 s − ω_eff ∝ e^{−t/τ}・収支 W_in + W_field − Q − ΔE = 0(W_in = ∫N_in s・W_field = −∫Γ_d (s − ω_eff) ω_eff・Q = ∫Γ_d (s − ω_eff)²)',
  t3body: '定常で熱 Q = Γ_d (s − ω_eff)² が観測の熱を超えない Γ_d の上限 H/(s − ω_eff)²・漸減の時定数の下限 I/Γ_d = 2E_spin/H(ω_eff ≪ s)・釣り合いに要る N_in = Γ_d (s − ω_eff)・供給の仕事率 N_in s・年齢の内に定常へ近づく Γ_d の下限 I/t_age',
  t4: 'log10|s*| = c₀ + Σ_k a_k log10 x_k(x = M・R・主星までの距離・主星の質量)の最小二乗 —— ノブを 1 つずつ足す・|Δlog10| ≤ 0.3 を満たせた・1 つ抜きの照らし(外した天体の予測)・主の組の外の天体は同じノブのまま持ち出す',
  t5: '収縮(I s = 一定・一様な球 I ∝ M R²)で s ∝ R^−2・ずれの熱 Γ_d (s − ω_eff)²・Γ_d ∝ R^d(d の格子 −2・0・2 —— T4 の熱の上限の則の半径の次数は参考に並べる)',
});
/** 文献の値(SI —— 本便は一次資料に当たっていない〔この環境から外のサイトに届かない〕—— 文献の値・未照合 —— 確かさの程度つき) */
export const LIT337A = Object.freeze({
  note: '文献の値・未照合(この環境から一次資料のサイトに届かない —— 出典の名と値は記憶とリポジトリの中の値の写し)',
  /** 太陽系の年齢(Connelly et al. 2012 Science 338, 651 —— CAI の Pb–Pb 年代 4.567 Gyr の桁)—— 確かさ 高(桁) */
  ageYr: 4.567e9, ageSrc: 'Connelly et al. 2012 Science 338, 651(4.567 Gyr の桁)—— 文献の値・未照合・確かさ 高(桁)',
  /** 火星の内部の熱流(平均 約 20 mW m⁻² の桁 —— Plesa et al. 2018 GRL 45, 12198 の模型の範囲 14〜25 mW m⁻²)—— 確かさ 中(模型の推定・観測の全球の値ではない) */
  marsHeatFlux: 0.020, marsHeatSrc: 'Plesa et al. 2018 GRL 45, 12198(模型の範囲 14〜25 mW m⁻² —— 平均 20 mW m⁻² を全球へ)—— 文献の値・未照合・確かさ 中(模型の推定)',
  /** 地球の一日の長さの伸び(Stephenson, Morrison & Hohenkerk 2016 Proc. R. Soc. A 472, 20160404 —— 観測の平均 +1.78 ms/世紀・潮汐の予測 +2.3 ms/世紀)—— 確かさ 中 */
  earthLodMsPerCy: 1.78, earthLodTidalMsPerCy: 2.3, earthLodSrc: 'Stephenson, Morrison & Hohenkerk 2016 Proc. R. Soc. A 472, 20160404(観測の平均 +1.78 ms/世紀・潮汐の予測 +2.3 ms/世紀)—— 文献の値・未照合・確かさ 中',
  /** 金星の自転の周期のゆらぎ(Margot et al. 2021 Nature Astronomy 5, 676 —— 測定の間の差 約 20 分の桁)—— 確かさ 低(桁) */
  venusLodMin: 20, venusLodSrc: 'Margot et al. 2021 Nature Astronomy 5, 676(自転の周期の測定の間の差 約 20 分の桁 —— 年の尺度)—— 文献の値・未照合・確かさ 低(桁)',
  /** 分子雲のコアの回転の目安(Goodman et al. 1993 ApJ 406, 528 —— 速度の傾き 0.3〜4 km s⁻¹ pc⁻¹・半径 0.06〜0.6 pc の桁)—— 確かさ 低(並べるだけ) */
  coreGradKmsPc: Object.freeze([0.3, 4]), coreRPc: Object.freeze([0.06, 0.6]), coreSrc: 'Goodman et al. 1993 ApJ 406, 528(速度の傾き 0.3〜4 km s⁻¹ pc⁻¹・半径 0.06〜0.6 pc の桁)—— 文献の値・未照合・確かさ 低(並べるだけ)',
});

/* ───────── T1 場の読みと向き ───────── */
/** 局所の差動回転の量: curve(flat・kepler・rigid は Ω から・oort は A_O・B_O から)→ A・B・Ω・ζ_in = −2B・ζ_co = −2A・ν_ep = √(−4ΩB)・v′ = −(A + B) */
export function localRates({ curve, Omega = null, A_O = null, B_O = null }) {
  if (!CURVES.includes(curve)) throw new RangeError('localRates: curve は ' + CURVES.join('・'));
  let A, B;
  if (curve === 'oort') { if (!(fin(A_O) && fin(B_O))) throw new RangeError('localRates: oort は A_O・B_O が要る'); A = A_O; B = B_O; }
  else {
    if (!(fin(Omega) && Omega > 0)) throw new RangeError('localRates: Ω > 0 が要る');
    [A, B] = curve === 'flat' ? [Omega / 2, -Omega / 2] : curve === 'kepler' ? [0.75 * Omega, -0.25 * Omega] : [0, -Omega];
  }
  const Om = A - B, e2 = -4 * Om * B;
  return { curve, A, B, Omega: Om, zetaIn: -2 * B, zetaCo: -2 * A, nuEp: e2 > 0 ? Math.sqrt(e2) : null, dvdR: -(A + B) };
}
/** 読みの符号つきの角速度(L̂ の向きを正): 戻り値 omega・zeta(渦度 —— 周転円と公転は null)・retro(逆回転か) */
export function readingOmega(reading, rates, sField = 0) {
  if (!READINGS.includes(reading)) throw new RangeError('readingOmega: 読みは ' + READINGS.join('・'));
  if (!rates || !fin(rates.A) || !fin(rates.B) || !fin(sField)) throw new RangeError('readingOmega: rates と s_field は有限');
  let omega, zeta = null;
  if (reading === 'orbit') omega = rates.Omega;
  else if (reading === 'vortInertial') { zeta = rates.zetaIn; omega = zeta / 2; }
  else if (reading === 'shearCorot') { zeta = rates.zetaCo; omega = zeta / 2; }
  else if (reading === 'epicycle') { if (rates.nuEp === null) throw new RangeError('readingOmega: ν_ep が無い(−4ΩB ≤ 0)'); omega = -rates.nuEp; }
  else { zeta = rates.zetaIn - 2 * sField; omega = zeta / 2; }
  return { reading, omega, zeta, retro: omega < 0 };
}
/** DFM の読みが逆回転になる s_field の下限(s_field > −B) */
export const dfmRetroThreshold = (rates) => -rates.B;
/** 射影: 符号つきの ω(L̂ の向き)の受け手の軸 x̂ への成分と L̂·x̂・逆向きからの角 */
export function projectOn({ omega, Lhat, axis }) {
  if (!fin(omega) || !v3(Lhat) || !v3(axis) || !(nrm(axis) > 0) || Math.abs(nrm(Lhat) - 1) > 1e-9) throw new RangeError('projectOn: ω は有限・L̂ は単位・軸 ≠ 0');
  const c = dot(Lhat, unit(axis));
  return { LdotX: c, comp: omega * c, sign: Math.sign(omega * c), angleFromAntiDeg: Math.acos(Math.max(-1, Math.min(1, -c))) / DEG };
}
/** 傾きのノブ θ(逆向きからの角 [deg]): 射影 cos θ・同じ大きさの 2 つの角速度(なす角 180° − θ)の合成 2 sin(θ/2)・減速/境目/増速 */
export function tiltRow(thetaDeg) {
  if (!fin(thetaDeg) || thetaDeg < 0 || thetaDeg > 180) throw new RangeError('tiltRow: θ は 0〜180°');
  const t = thetaDeg * DEG, sum = 2 * Math.sin(t / 2), c = Math.cos(t);
  return { thetaDeg, cos: c, betweenDeg: 180 - thetaDeg, sumOverOne: sum, kind: Math.abs(sum - 1) <= 1e-12 ? 'boundary' : sum < 1 ? 'lower' : 'higher' };
}

/* ───────── T1′ 軸引きずりの差分の読み(原仮定者の補足(2026-11-14 —— 第138報の補足))───────── */
/**
 * 「軸引きずりは、並進引きずりで引きずられる側の、近い面と遠い面の差分なので、赤道面では源の回転と逆回転になる」の読み。
 *   源 j の項 F_j(p) = w_j(p) (C_j(p) − v_i)/W(C_j(p) = v_j + s_j × (p − p_j)・w = (m/r_ref²)(r_ref/r)^α —— 第330便b の `weightOf` と同じ形・W は受け手の位置の値で固定)。
 *   読み(ノブ「差分の読み」): diff = û × ∂_û F_j(近い面と遠い面の差分だけ —— û は受け手から源への向き・線のまわりの回りは現れない)/
 *   full = ½∇×F_j(回転率の全部 —— W を固定した EQ-31 の型)/ mix = (1 − λ) diff + λ full(横の面の分を入れる割合 λ)。
 *   静止の受け手・赤道面: diff の係数 1 − α(α = 2 で −1 —— 源の回転と逆)・full の係数 1 − α/2(α = 2 で 0)。受け手が角速度 n で回る(v_i = n r φ̂)とき diff の係数は (1 − α) s + α n。
 *   極の側(源の自転の軸の上): diff は 0・full は +1(同じ向き —— 線のまわりの捩れ)。
 */
export const AXIAL_READINGS = Object.freeze(['diff', 'full', 'mix']);
const weight337 = (m, r, alpha, rRef) => (m / (rRef * rRef)) * Math.pow(rRef / r, alpha);
export { weight337 };
function axialTerm(src, p, vRecv, alpha, rRef, W) {
  const d = [p[0] - src.p[0], p[1] - src.p[1], p[2] - src.p[2]], r = nrm(d), w = weight337(src.m, r, alpha, rRef);
  const C = [src.v[0] + src.s[1] * d[2] - src.s[2] * d[1] - vRecv[0], src.v[1] + src.s[2] * d[0] - src.s[0] * d[2] - vRecv[1], src.v[2] + src.s[0] * d[1] - src.s[1] * d[0] - vRecv[2]];
  return [C[0] * w / W, C[1] * w / W, C[2] * w / W];
}
/** 1 つの源の差分の読み: at・vRecv・src {p, v, s, m}・W(受け手の位置の重みの和 —— 固定)・α・r_ref・h(刻み ÷ 距離)→ diff・full(rad/s のベクトル)・share = w/W・u */
export function axialAt({ at, vRecv, src, W, alpha, rRef, h = 1e-4 }) {
  if (!v3(at) || !v3(vRecv) || !src || !v3(src.p) || !v3(src.v) || !v3(src.s) || !fin(src.m) || !(src.m >= 0) || !fin(W) || !(W > 0) || !fin(alpha) || !(alpha > 0) || !fin(rRef) || !(rRef > 0)) throw new RangeError('axialAt: 有限の 3 成分・W > 0・α > 0・r_ref > 0');
  const dv = [src.p[0] - at[0], src.p[1] - at[1], src.p[2] - at[2]], r = nrm(dv);
  if (!(r > 0)) throw new RangeError('axialAt: 受け手と源が一致');
  const u = unit(dv), st = h * r, F = (p) => axialTerm(src, p, vRecv, alpha, rRef, W);
  const fa = F([at[0] + st * u[0], at[1] + st * u[1], at[2] + st * u[2]]), fm = F([at[0] - st * u[0], at[1] - st * u[1], at[2] - st * u[2]]);
  const dU = [(fa[0] - fm[0]) / (2 * st), (fa[1] - fm[1]) / (2 * st), (fa[2] - fm[2]) / (2 * st)];
  const diff = [u[1] * dU[2] - u[2] * dU[1], u[2] * dU[0] - u[0] * dU[2], u[0] * dU[1] - u[1] * dU[0]];
  const Jm = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  for (let b = 0; b < 3; b++) { const a = at.slice(), m = at.slice(); a[b] += st; m[b] -= st; const A = F(a), M = F(m); for (let k = 0; k < 3; k++) Jm[k][b] = (A[k] - M[k]) / (2 * st); }
  const full = [(Jm[2][1] - Jm[1][2]) / 2, (Jm[0][2] - Jm[2][0]) / 2, (Jm[1][0] - Jm[0][1]) / 2];
  return { diff, full, share: weight337(src.m, r, alpha, rRef) / W, u, r };
}
/** 差分の読みの混ぜ(横の面の分の割合 λ) */
export function axialMix(a, lambda) {
  if (!a || !v3(a.diff) || !v3(a.full) || !fin(lambda) || lambda < 0 || lambda > 1) throw new RangeError('axialMix: λ は 0〜1');
  return [0, 1, 2].map((k) => (1 - lambda) * a.diff[k] + lambda * a.full[k]);
}
/** 赤道面の係数(静止の受け手・W 固定 —— 閉じた式): diff 1 − α・full 1 − α/2・回る受け手の diff (1 − α) s + α n・極の側 diff 0・full 1 */
export const axialCoef = (alpha) => ({ alpha, diff: 1 - alpha, full: 1 - alpha / 2, poleDiff: 0, poleFull: 1 });

/* ───────── T1″ 補う重み(差分の相手)のノブ(原仮定者の補足(2026-11-14 —— 第138報の補足 2))───────── */
/**
 * 「並進引きずりの差分は、遠い面の方が遠方宇宙に対しての静止引きずりが強い為、速度は遠い面の方が確実に遅い」の読み。
 *   U(p) = [Σ_j w_j(p) c_j(p) + K v_i] / [Σ_j w_j(p) + W₀ + K](c_j = s_j × (p − p_j) + 源の並進 —— 器は源の静止系で置く)。
 *   補う重み: static(慣性系の背景宇宙の静止 —— 背景慣性決定力 W₀・主の候補・K = 0 —— 原仮定者の補足(2026-11-14 —— 第138報の補足 3)の語)/ self(受け手自身 K が自分の速度 v_i で動く —— 途中版の列・W₀ = 0)/ both(K と W₀)。
 *   1 つの自転する源・赤道面・静止の補い: U = s r f・f = w/(W₀ + w) → dU/dr = s f [1 − α(1 − f)](f < 1 − 1/α で逆)。
 */
export const COMPLEMENTS = Object.freeze(['static', 'self', 'both']);
export const fShare = (w, W0) => w / (w + W0);
export const staticRate = ({ s, f, alpha }) => s * f * (1 - alpha * (1 - f));
export const fBoundary = (alpha) => 1 - 1 / alpha;
/** 受け手自身の補い(途中版の列 —— 受け手は角速度 n で回る・f = w/(w + K)): dU/dr = f [s − α(1 − f)(s − n)](f → 0 で f[(1 − α)s + αn]) */
export const selfRate = ({ s, n, f, alpha }) => f * (s - alpha * (1 - f) * (s - n));
/** 静止の補いで f = ½ になる距離 r_½ から W₀(重みの形 weight337)*/
export const W0FromHalf = ({ m, rHalf, alpha, rRef }) => weight337(m, rHalf, alpha, rRef);
/** 数値の差分(源の組 srcs {p, v, s, m}・補う重み W₀・K と受け手の速度 vRecv・向き u・受け手の半径 R): 勾配の差分 û × ∂_û U と有限の半径の差分 û × [U(p + R û) − U(p − R û)]/(2R)・取り分 f */
export function complementDiff({ at, vRecv, srcs, W0 = 0, K = 0, alpha, rRef, u, R, h = 1e-4 }) {
  if (!v3(at) || !v3(vRecv) || !Array.isArray(srcs) || !srcs.length || !v3(u) || ![W0, K, alpha, rRef, R].every(fin) || W0 < 0 || K < 0 || !(W0 + K > 0) || !(alpha > 0) || !(R > 0)) throw new RangeError('complementDiff: 有限・W₀ + K > 0・α > 0・R > 0');
  const uu = unit(u), U = (p) => { let P = [0, 0, 0], W = W0 + K; for (const q of srcs) { const d = [p[0] - q.p[0], p[1] - q.p[1], p[2] - q.p[2]], w = weight337(q.m, nrm(d), alpha, rRef);
    P = [P[0] + w * (q.v[0] + q.s[1] * d[2] - q.s[2] * d[1]), P[1] + w * (q.v[1] + q.s[2] * d[0] - q.s[0] * d[2]), P[2] + w * (q.v[2] + q.s[0] * d[1] - q.s[1] * d[0])]; W += w; }
    return [(P[0] + K * vRecv[0]) / W, (P[1] + K * vRecv[1]) / W, (P[2] + K * vRecv[2]) / W]; };
  const at2 = (k) => [at[0] + k * uu[0], at[1] + k * uu[1], at[2] + k * uu[2]], rr = nrm(srcs.reduce((a, q) => [a[0] + q.p[0] - at[0], a[1] + q.p[1] - at[1], a[2] + q.p[2] - at[2]], [0, 0, 0])) / srcs.length || R;
  const uo = [-uu[0], -uu[1], -uu[2]], st = h * Math.max(rr, R);   // uo: 源から外向き(遠い面の向き)
  const g = (k) => { const A = U([at[0] + k * uo[0], at[1] + k * uo[1], at[2] + k * uo[2]]), B = U([at[0] - k * uo[0], at[1] - k * uo[1], at[2] - k * uo[2]]), dd = [(A[0] - B[0]) / (2 * k), (A[1] - B[1]) / (2 * k), (A[2] - B[2]) / (2 * k)];
    return [uo[1] * dd[2] - uo[2] * dd[1], uo[2] * dd[0] - uo[0] * dd[2], uo[0] * dd[1] - uo[1] * dd[0]]; };   // [U(遠) − U(近)]/(面の間の距離) の回り
  const wS = srcs.reduce((t, q) => t + weight337(q.m, nrm([at[0] - q.p[0], at[1] - q.p[1], at[2] - q.p[2]]), alpha, rRef), 0);
  const gr = g(st), fr = g(R);
  return { grad: gr, finite: fr, f: wS / (wS + W0 + K), fSelfShare: K / (wS + W0 + K) };
}

/* ───────── T2 起源の角運動量の帳簿 ───────── */
/** 一様な球の雲(質量 M・半径 R_c・角速度 ω₀)と今の角運動量 L_now: L_c・比・合う R_c・密度 */
export function cloudRow({ M, Rc, omega0, Lnow, shape = DECL.cloudShape }) {
  if (![M, Rc, omega0, Lnow, shape].every(fin) || !(M > 0) || !(Rc > 0) || !(Lnow > 0) || !(shape > 0)) throw new RangeError('cloudRow: M・R_c・L_now・形の係数 > 0・ω₀ は有限');
  const w = Math.abs(omega0), Lc = shape * M * Rc * Rc * w, RcMatch = w > 0 ? Math.sqrt(Lnow / (shape * M * w)) : null, vol = (r) => (4 / 3) * Math.PI * r * r * r;
  return { Rc, omega0: w, Lc, ratio: Lc / Lnow, RcMatch, rho: M / vol(Rc), rhoMatch: RcMatch ? M / vol(RcMatch) : null };
}
/** 収縮(I s = 一定): 半径 R_c の一様な球(形の係数 shape)から今の半径 R・慣性係数 f へ —— 半径の比・自転の増え方 s/ω₀ = (shape R_c²)/(f R²) */
export function collapseRow({ Rc, R, f, shape = DECL.cloudShape }) {
  if (![Rc, R, f, shape].every(fin) || !(Rc > 0 && R > 0 && f > 0 && shape > 0)) throw new RangeError('collapseRow: R_c・R・f・形 > 0');
  return { radiusRatio: Rc / R, spinUp: (shape * Rc * Rc) / (f * R * R) };
}

/* ───────── T3 駆動 + 減衰の帳簿 ───────── */
const ODEKEYS = ['I', 'Gd', 'Nin', 'wEff', 's0', 'tOff'];
function checkOde(p) { for (const k of ODEKEYS) if (!fin(p[k])) throw new RangeError('ode: ' + k + ' が有限でない'); if (!(p.I > 0 && p.Gd > 0 && p.tOff >= 0)) throw new RangeError('ode: I・Γ_d > 0・t_off ≥ 0'); }
/** 閉じた式: t ≤ t_off は s* + (s₀ − s*) e^{−t/τ}・t > t_off は ω_eff + (s(t_off) − ω_eff) e^{−(t − t_off)/τ} */
export function closedS(t, p) {
  checkOde(p);
  const tau = p.I / p.Gd, sStar = p.wEff + p.Nin / p.Gd;
  if (t <= p.tOff) return sStar + (p.s0 - sStar) * Math.exp(-t / tau);
  const s1 = sStar + (p.s0 - sStar) * Math.exp(-p.tOff / tau);
  return p.wEff + (s1 - p.wEff) * Math.exp(-(t - p.tOff) / tau);
}
/** 古典の RK4(状態 s・W_in・W_field・Q —— t_off が步の格子に乗るように步を割る): 閉じた式との差の最大(÷ max|s|)・収支の残り・漸減の比 */
export function odeRun(p, { tEnd, steps }) {
  checkOde(p);
  if (!(fin(tEnd) && tEnd > p.tOff && Number.isInteger(steps) && steps >= 10)) throw new RangeError('odeRun: t_end > t_off・步 ≥ 10');
  const tau = p.I / p.Gd, nOn = Math.max(1, Math.round(steps * p.tOff / tEnd)), nOff = Math.max(1, steps - nOn);
  const f = (on, y) => { const N = on ? p.Nin : 0, g = y[0] - p.wEff; return [(N - p.Gd * g) / p.I, N * y[0], -p.Gd * g * p.wEff, p.Gd * g * g]; };
  let y = [p.s0, 0, 0, 0], t = 0, errMax = 0, sMax = Math.abs(p.s0), at = { tOff: null, tOffTau: null };
  const seg = (on, n, h) => {
    for (let i = 0; i < n; i++) {
      const k1 = f(on, y), k2 = f(on, y.map((v, j) => v + 0.5 * h * k1[j])), k3 = f(on, y.map((v, j) => v + 0.5 * h * k2[j])), k4 = f(on, y.map((v, j) => v + h * k3[j]));
      y = y.map((v, j) => v + (h / 6) * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j])); t += h;
      sMax = Math.max(sMax, Math.abs(y[0])); errMax = Math.max(errMax, Math.abs(y[0] - closedS(on ? Math.min(t, p.tOff) : t, p)));
      if (!on && at.tOffTau === null && t >= p.tOff + tau - 1e-12 * tau) at.tOffTau = { t, s: y[0] };
    }
  };
  seg(true, nOn, p.tOff / nOn); t = p.tOff; at.tOff = { t, s: y[0] };
  seg(false, nOff, (tEnd - p.tOff) / nOff);
  const dE = 0.5 * p.I * (y[0] * y[0] - p.s0 * p.s0), Win = y[1], Wf = y[2], Q = y[3];
  const resid = Win + Wf - Q - dE, scale = Math.max(Math.abs(Win), Math.abs(Wf), Math.abs(Q), Math.abs(dE), 1e-300);
  const decay1 = at.tOffTau ? (at.tOffTau.s - p.wEff) / (at.tOff.s - p.wEff) : null, dtTau = at.tOffTau ? (at.tOffTau.t - p.tOff) / tau : null;
  return { tau, sStar: p.wEff + p.Nin / p.Gd, nOn, nOff, errRel: errMax / sMax, sOff: at.tOff.s, sOffClosed: closedS(p.tOff, p), sEnd: y[0], sEndClosed: closedS(tEnd, p),
    decay1, decay1Expect: dtTau === null ? null : Math.exp(-dtTau), Win, Wfield: Wf, Q, dE, ledgerRel: Math.abs(resid) / scale };
}
/**
 * 天体の帳簿(受け手の軸の向きの符号つき): I・s(> 0 —— ŝ の向き)・ω_eff(ŝ への射影)・H(観測の熱 W —— null 可)・t_age [s]・ṡ_obs(観測の自転の変化 [rad/s²] —— null 可)。
 * Γ_d の上限 H/(s − ω_eff)²・τ の下限・要る N_in と仕事率・場の仕事率・年齢の内に定常へ近づく Γ_d の下限 I/t_age と窓の比・釣り合いの外れのトルク I|ṡ_obs| ÷ 要る N_in・受動の型(N_in = 0)の s*。
 */
export function bodyBudget({ I, s, wEff, H = null, ageS, sdotObs = null }) {
  if (![I, s, wEff, ageS].every(fin) || !(I > 0 && s > 0 && ageS > 0)) throw new RangeError('bodyBudget: I・s・t_age > 0・ω_eff は有限');
  const gap = s - wEff, E = 0.5 * I * s * s, out = { I, s, wEff, wEffOverS: wEff / s, gapOverS: gap / s, Espin: E, H, GdMinAge: I / ageS };
  out.passive = { sStarOverS: wEff / s, feasible: false, gapOverS: (wEff - s) / s };   // 受動の型(N_in = 0): s* = ω_eff(第335便b の受動の列と同じ読み)
  if (fin(H) && H > 0 && gap > 0) {
    const Gd = H / (gap * gap), Nin = Gd * gap, Pin = Nin * s, Pf = -Gd * gap * wEff, Q = Gd * gap * gap;
    Object.assign(out, { GdMax: Gd, tauMinS: I / Gd, tauMinYr: I / Gd / DECL.yearS, NinReq: Nin, Pin, Pfield: Pf, Q, steadyRel: Math.abs(Pin + Pf - Q) / Math.max(Math.abs(Pin), Math.abs(Q), 1e-300),
      window: Gd / (I / ageS), tauMinOverAge: (I / Gd) / ageS, imbalance: fin(sdotObs) ? { torque: I * Math.abs(sdotObs), overNin: I * Math.abs(sdotObs) / Nin, tauObsYr: s / Math.abs(sdotObs) / DECL.yearS } : null });
  } else Object.assign(out, { GdMax: null, tauMinS: null, tauMinYr: null, NinReq: null, Pin: null, Pfield: null, Q: null, steadyRel: null, window: null, tauMinOverAge: null,
    imbalance: fin(sdotObs) ? { torque: I * Math.abs(sdotObs), overNin: null, tauObsYr: s / Math.abs(sdotObs) / DECL.yearS } : null });
  return out;
}

/* ───────── T4 供給の則の探索(対数の最小二乗)───────── */
/** 正規方程式(ガウスの消去・部分の枢軸)—— X:[n][k]・y:[n] → 係数 k・残差 n。k > n は拒否 */
export function lsq(X, y) {
  if (!Array.isArray(X) || !Array.isArray(y) || X.length !== y.length || X.length === 0) throw new RangeError('lsq: X と y の行の数が同じ');
  const n = X.length, k = X[0].length;
  if (!(k >= 1 && k <= n) || !X.every((r) => r.length === k && r.every(fin)) || !y.every(fin)) throw new RangeError('lsq: 1 ≤ 列 ≤ 行・有限');
  const A = Array.from({ length: k }, (_, i) => Array.from({ length: k + 1 }, (_, j) => (j < k ? X.reduce((t, r) => t + r[i] * r[j], 0) : X.reduce((t, r, m) => t + r[i] * y[m], 0))));
  const dmax = Math.max(...A.map((r, i) => Math.abs(r[i])));
  for (let c = 0; c < k; c++) {
    let p = c; for (let r = c + 1; r < k; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
    if (!(Math.abs(A[p][c]) > 1e-12 * dmax)) throw new RangeError('lsq: 特異(列が独立でない —— 枢軸 ÷ 対角の最大 ≤ 1e-12)');
    [A[c], A[p]] = [A[p], A[c]];
    for (let r = 0; r < k; r++) if (r !== c) { const q = A[r][c] / A[c][c]; for (let j = c; j <= k; j++) A[r][j] -= q * A[c][j]; }
  }
  const coef = A.map((r, i) => r[k] / r[i]), res = y.map((v, m) => v - X[m].reduce((t, x, j) => t + x * coef[j], 0));
  return { coef, res, rms: Math.sqrt(res.reduce((t, r) => t + r * r, 0) / n), maxAbs: Math.max(...res.map(Math.abs)), dof: n - k };
}
/** 1 つのノブの組の探索: rows:[{ key, y, x:{名: 値} }]・knobs:[名…]・fitKeys(主の組)・tol → 係数・主の組の残差と満たせた数・組の外の天体の予測の残差 */
export function fitKnobs({ rows, knobs, fitKeys, tol = DECL.fitTol }) {
  if (!Array.isArray(rows) || !Array.isArray(knobs) || !Array.isArray(fitKeys)) throw new RangeError('fitKnobs: rows・knobs・fitKeys は配列');
  const xr = (r) => [1, ...knobs.map((k) => { const v = r.x[k]; if (!fin(v)) throw new RangeError('fitKnobs: ' + r.key + ' の ' + k + ' が無い'); return v; })];
  const F = rows.filter((r) => fitKeys.includes(r.key)), L = lsq(F.map(xr), F.map((r) => r.y));
  const pred = (r) => xr(r).reduce((t, x, j) => t + x * L.coef[j], 0);
  const all = rows.map((r) => { const d = r.y - pred(r); return { key: r.key, inFit: fitKeys.includes(r.key), y: r.y, pred: pred(r), res: d, ok: Math.abs(d) <= tol }; });
  const fitRows = all.filter((r) => r.inFit);
  return { knobs: knobs.slice(), coef: L.coef, rms: L.rms, maxAbs: L.maxAbs, dof: L.dof, nFit: fitRows.length, nOk: fitRows.filter((r) => r.ok).length, rows: all };
}

/** 1 つ抜きの照らし(主の組の各天体を外して残りで最小二乗 —— 外した天体の予測の残差): ノブが多いほど主の組の残差は小さくなるので、持ち出しの物差しを別に持つ */
export function fitLoo({ rows, knobs, fitKeys, tol = DECL.fitTol }) {
  if (!Array.isArray(fitKeys) || fitKeys.length < knobs.length + 2) throw new RangeError('fitLoo: 主の組は ノブ + 2 以上');
  const out = fitKeys.map((k) => {
    try { const F = fitKnobs({ rows, knobs, fitKeys: fitKeys.filter((q) => q !== k), tol }), r = F.rows.find((q) => q.key === k); return { key: k, res: r.res, ok: r.ok, singular: false }; }
    catch (e) { if (e instanceof RangeError && /特異/.test(e.message)) return { key: k, res: null, ok: false, singular: true }; throw e; }   // 外すと列が独立でなくなる(例: 主星の質量は太陽を外すと定数)
  });
  const R = out.filter((r) => r.res !== null);
  return { rows: out, nOk: out.filter((r) => r.ok).length, n: out.length, nSingular: out.length - R.length, rms: R.length ? Math.sqrt(R.reduce((t, r) => t + r.res * r.res, 0) / R.length) : null, maxAbs: R.length ? Math.max(...R.map((r) => Math.abs(r.res))) : null };
}

/* ───────── T5 ずれの熱 ───────── */
/** 収縮の 1 行: 半径 R(I s = 一定 —— s = s_now (R_now/R)²)・ずれの熱 Γ_d (s − ω_eff)² の比(Γ_d ∝ R^d —— 今の半径の値を 1) */
export function shearHeatRow({ R, Rnow, sNow, wEff, d }) {
  if (![R, Rnow, sNow, wEff, d].every(fin) || !(R > 0 && Rnow > 0)) throw new RangeError('shearHeatRow: R・R_now > 0・他は有限');
  const s = sNow * (Rnow / R) * (Rnow / R), g = s - wEff, g0 = sNow - wEff;
  return { R, ROverNow: R / Rnow, s, gap: g, heatRel: Math.pow(R / Rnow, d) * (g * g) / (g0 * g0) };
}

/* ───────── 純関数の場面と門 ───────── */
export function pureScenes() {
  const S = {}, Om = 1;
  { const f = localRates({ curve: 'flat', Omega: Om }), k = localRates({ curve: 'kepler', Omega: Om }), r = localRates({ curve: 'rigid', Omega: Om }), o = localRates({ curve: 'oort', A_O: 15, B_O: -12 });
    S.rates = { flat: f, kepler: k, rigid: r, oort: o, sumAB: Math.max(...[f, k, r].map((q) => relD(q.A - q.B, Om)), relD(o.Omega, 27)) }; }
  { const f = localRates({ curve: 'flat', Omega: 2 });
    S.dfm = { atThreshold: readingOmega('dfmRigid', f, dfmRetroThreshold(f)).omega, atOmega: relD(readingOmega('dfmRigid', f, f.Omega).omega, readingOmega('shearCorot', f).omega),
      atZero: relD(readingOmega('dfmRigid', f, 0).omega, readingOmega('vortInertial', f).omega), retroAbove: readingOmega('dfmRigid', f, 1.01 * dfmRetroThreshold(f)).retro, progBelow: !readingOmega('dfmRigid', f, 0.99 * dfmRetroThreshold(f)).retro }; }
  S.tilt = { t60: tiltRow(60), t0: tiltRow(0), t90: tiltRow(90) };
  { const L = [0, 0, 1], x = [Math.sin(120 * DEG), 0, Math.cos(120 * DEG)], p = projectOn({ omega: -1, Lhat: L, axis: x }), q = projectOn({ omega: 1, Lhat: L, axis: x });
    S.project = { retro: p.comp, prog: q.comp, angle: p.angleFromAntiDeg }; }
  { const p = { I: 2, Gd: 0.5, Nin: 3, wEff: -0.3, s0: 1, tOff: 12 }, R = odeRun(p, { tEnd: 32, steps: 4000 });
    S.ode = { errRel: R.errRel, ledgerRel: R.ledgerRel, decay1: R.decay1, decay1Expect: R.decay1Expect, sStar: R.sStar, tau: R.tau, sEnd: R.sEnd, sEndClosed: R.sEndClosed };
    const P0 = Object.assign({}, p, { Nin: 0, s0: 5 }), R0 = odeRun(P0, { tEnd: 80, steps: 4000 });
    S.passive = { sStar: R0.sStar, sEnd: R0.sEnd, wEff: p.wEff }; }
  { const B = bodyBudget({ I: 10, s: 2, wEff: 0.1, H: 7.22, ageS: 100, sdotObs: 1e-3 }); S.budget = { steadyRel: B.steadyRel, GdMax: B.GdMax, tauMinS: B.tauMinS, window: B.window, passive: B.passive }; }
  { const C = cloudRow({ M: 3, Rc: 5, omega0: -2, Lnow: 7 }), C2 = cloudRow({ M: 3, Rc: C.RcMatch, omega0: -2, Lnow: 7 }); S.cloud = { ratioAtMatch: C2.ratio, Lc: C.Lc, collapse: collapseRow({ Rc: 10, R: 1, f: 0.4 }) }; }
  { const rows = [[1, 2], [2, 1], [3, 5], [4, 3], [5, 4]].map(([m, r], i) => ({ key: 'b' + i, y: 0.7 + 1.5 * Math.log10(m) - 2 * Math.log10(r), x: { lm: Math.log10(m), lr: Math.log10(r) } }));
    const F = fitKnobs({ rows, knobs: ['lm', 'lr'], fitKeys: rows.map((r) => r.key) }), O = fitLoo({ rows, knobs: ['lm', 'lr'], fitKeys: rows.map((r) => r.key) }); S.fit = { coef: F.coef, maxAbs: F.maxAbs, nOk: F.nOk, looMax: O.maxAbs, looOk: O.nOk }; }
  { const h = shearHeatRow({ R: 2, Rnow: 1, sNow: 4, wEff: 0, d: 0 }); S.shear = { s: h.s, heatRel: h.heatRel }; }
  { const src = { p: [0, 0, 0], v: [0, 0, 0], s: [0, 0, 1], m: 1 }, eq = (al) => { const W = weight337(1, 1, al, 1); return axialAt({ at: [1, 0, 0], vRecv: [0, 0, 0], src, W, alpha: al, rRef: 1 }); };
    const a2 = eq(2), a1 = eq(1), a3 = eq(3), Wp = weight337(1, 1, 2, 1), po = axialAt({ at: [0, 0, 1], vRecv: [0, 0, 0], src, W: Wp, alpha: 2, rRef: 1 });
    const mv = axialAt({ at: [1, 0, 0], vRecv: [0, 0.3, 0], src, W: Wp, alpha: 2, rRef: 1 });
    S.axial = { d2: a2.diff[2], f2: a2.full[2], d1: a1.diff[2], f1: a1.full[2], d3: a3.diff[2], f3: a3.full[2], poleD: po.diff[2], poleF: po.full[2], moving: mv.diff[2], movingExpect: (1 - 2) * 1 + 2 * 0.3,
      mixHalf: axialMix(a2, 0.5)[2], perp: Math.hypot(a2.diff[0], a2.diff[1]) }; }
  { const src = { p: [0, 0, 0], v: [0, 0, 0], s: [0, 0, 1], m: 1 }, W0 = weight337(1, 1, 2, 1) * (0.7 / 0.3);   // r = 1 で f = 0.3
    const C = complementDiff({ at: [1, 0, 0], vRecv: [0, 0, 0], srcs: [src], W0, alpha: 2, rRef: 1, u: [-1, 0, 0], R: 1e-3 }), Wh = W0FromHalf({ m: 1, rHalf: 1, alpha: 2, rRef: 1 });
    const C2 = complementDiff({ at: [1, 0, 0], vRecv: [0, 0, 0], srcs: [src], W0: Wh, alpha: 2, rRef: 1, u: [-1, 0, 0], R: 1e-3 });
    const Ks = complementDiff({ at: [1, 0, 0], vRecv: [0, 0.4, 0], srcs: [src], K: W0, alpha: 2, rRef: 1, u: [-1, 0, 0], R: 1e-3 });
    S.complement = { f: C.f, grad: C.grad[2], expect: staticRate({ s: 1, f: 0.3, alpha: 2 }), finite: C.finite[2], half: C2.grad[2], fHalf: C2.f, selfGrad: Ks.grad[2], selfExpect: selfRate({ s: 1, n: 0.4, f: 0.3, alpha: 2 }) }; }
  const rej = [() => localRates({ curve: 'disk', Omega: 1 }), () => localRates({ curve: 'oort' }), () => readingOmega('spin', localRates({ curve: 'flat', Omega: 1 })), () => tiltRow(200),
    () => cloudRow({ M: -1, Rc: 1, omega0: 1, Lnow: 1 }), () => odeRun({ I: 1, Gd: 0, Nin: 0, wEff: 0, s0: 1, tOff: 1 }, { tEnd: 2, steps: 100 }), () => bodyBudget({ I: 1, s: -1, wEff: 0, ageS: 1 }),
    () => lsq([[1, 1], [1, 1]], [1, 2]), () => projectOn({ omega: 1, Lhat: [0, 0, 2], axis: [1, 0, 0] }), () => axialAt({ at: [0, 0, 0], vRecv: [0, 0, 0], src: { p: [0, 0, 0], v: [0, 0, 0], s: [0, 0, 1], m: 1 }, W: 1, alpha: 2, rRef: 1 }),
    () => axialMix({ diff: [0, 0, 0], full: [0, 0, 0] }, 2)];
  let n = 0; for (const f of rej) { try { f(); } catch (e) { if (e instanceof RangeError) n++; } }
  S.reject = { n, of: rej.length };
  return S;
}
export function pureGates(S) {
  const t = DECL.idTol;
  return {
    rates: S.rates.sumAB <= t && Math.abs(S.rates.flat.zetaIn - 1) <= t && Math.abs(S.rates.flat.zetaCo + 1) <= t && Math.abs(S.rates.flat.nuEp - Math.SQRT2) <= t && Math.abs(S.rates.kepler.nuEp - 1) <= t
      && Math.abs(S.rates.rigid.zetaCo) <= t && Math.abs(S.rates.rigid.nuEp - 2) <= t && Math.abs(S.rates.oort.nuEp - Math.sqrt(4 * 27 * 12)) <= 1e-12 * 36,
    dfm: Math.abs(S.dfm.atThreshold) <= t && S.dfm.atOmega <= t && S.dfm.atZero <= t && S.dfm.retroAbove && S.dfm.progBelow,
    tilt: Math.abs(S.tilt.t60.sumOverOne - 1) <= t && Math.abs(S.tilt.t60.cos - 0.5) <= t && S.tilt.t60.kind === 'boundary' && S.tilt.t0.sumOverOne === 0 && Math.abs(S.tilt.t90.sumOverOne - Math.SQRT2) <= t,
    project: Math.abs(S.project.retro - 0.5) <= t && Math.abs(S.project.prog + 0.5) <= t && Math.abs(S.project.angle - 60) <= 1e-9,
    ode: S.ode.errRel <= DECL.odeTol && S.ode.ledgerRel <= 1e-10 && Math.abs(S.ode.decay1 - S.ode.decay1Expect) <= 1e-9 && Math.abs(S.ode.sStar - 5.7) <= t && relD(S.ode.sEnd, S.ode.sEndClosed) <= 1e-9,
    passive: Math.abs(S.passive.sStar - S.passive.wEff) <= t && Math.abs(S.passive.sEnd - S.passive.wEff) <= 1e-6,
    budget: S.budget.steadyRel <= t && relD(S.budget.GdMax, 2) <= t && relD(S.budget.tauMinS, 5) <= t && relD(S.budget.window, 20) <= t && S.budget.passive.feasible === false,
    cloud: Math.abs(S.cloud.ratioAtMatch - 1) <= t && relD(S.cloud.Lc, 60) <= t && relD(S.cloud.collapse.spinUp, 100) <= t && S.cloud.collapse.radiusRatio === 10,
    fit: Math.abs(S.fit.coef[0] - 0.7) <= 1e-10 && Math.abs(S.fit.coef[1] - 1.5) <= 1e-10 && Math.abs(S.fit.coef[2] + 2) <= 1e-10 && S.fit.maxAbs <= 1e-10 && S.fit.nOk === 5 && S.fit.looMax <= 1e-9 && S.fit.looOk === 5,
    shear: S.shear.s === 1 && S.shear.heatRel === 1 / 16,
    complement: Math.abs(S.complement.f - 0.3) <= 1e-12 && Math.abs(S.complement.grad - S.complement.expect) <= 1e-7 && Math.abs(S.complement.finite - S.complement.expect) <= 1e-5 && Math.abs(S.complement.half) <= 1e-7
      && Math.abs(S.complement.fHalf - 0.5) <= 1e-12 && Math.abs(S.complement.selfGrad - S.complement.selfExpect) <= 1e-6,
    axial: [[S.axial.d2, -1], [S.axial.f2, 0], [S.axial.d1, 0], [S.axial.f1, 0.5], [S.axial.d3, -2], [S.axial.f3, -0.5], [S.axial.poleD, 0], [S.axial.poleF, 1], [S.axial.moving, S.axial.movingExpect], [S.axial.mixHalf, -0.5], [S.axial.perp, 0]]
      .every(([a, b]) => Math.abs(a - b) <= 1e-7),
    reject: S.reject.n === S.reject.of,
  };
}
