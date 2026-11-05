// 第328便c(統括の検証項目 R303・原仮定者の回答(2026-11-05 —— AN564)「共鳴の口はエンジンに足さない —— 診断に残す」の支え):
//   **共鳴の口の仕事の契約**(平均の位相・保存のポテンシャル・角運動量の反作用 —— html を読まない・状態を持たない純関数。**エンジンに入れない**・第327便f の lib の `resPort` は変えない)。
//
// ■ 何を足すか: 第327便f の `resPort` は、指定した軸の向きのトルク N_r と同じ額の自転の仕事 N_r Ω を軌道の口座から渡す口(熱 0)で、共鳴の位相とポテンシャルを計算しない。
//   本 lib は会合周期で平均した共鳴の項を**位相 γ の保存のポテンシャル**として書き、仕事の出入りを自転・軌道・ポテンシャルに分けて帳簿を閉じる:
//     γ = θ − Σ_j c_j λ_j(θ は受け手の長い軸の角・λ_j は軌道の角・係数の和 Σ c_j = 1 —— 共通の回転で γ が変わらない)
//     U = −(N_max/2) cos 2γ(平均のポテンシャル)・受け手の自転のトルク N = −∂U/∂θ = −N_max sin 2γ・軌道 j のトルク −c_j N(和 N − Σ c_j N = 0)
//     パターンの角速度 ω_res = Σ c_j ω_j・γ̇ = Ω − ω_res・dU/dt = −N (Ω − ω_res)
//     自転の仕事 P_spin = N Ω・軌道の口座から出る仕事 P_orb→res = −Σ_j (−c_j N) ω_j = N ω_res = P_spin + dU/dt・熱 0
//   金星と地球の 5:−4: γ = θ − 5λ_⊕ + 4λ_♀(c_⊕ = 5・c_♀ = −4)—— 地球の軌道のトルク −5N・金星の軌道のトルク +4N・自転 N(和 0)。
//   **捕獲して Ω = ω_res のときだけ dU/dt = 0** で、`resPort` の等置(軌道の仕事 = 自転の仕事)と同じになる。共鳴の外では差が dU/dt。
//   abs(N) ≤ N_max(位相がある限り)—— 要るトルクが N_max を超える条件には位相が無い(`phaseFor` は null)。
// ■ 言わないこと: 共鳴が金星の自転を決めたとは言わない。契約は「宣言した平均のポテンシャルの下で仕事と角運動量の口座が閉じる」ことの検査で、共鳴の捕獲や観測の自転の判定ではない。
import { resPort } from './lib-w327f-venustide.mjs';
export const LIB_VERSION = 'w328c-respower-lib-1';

/** 宣言(走行の前に置く —— 結果を見て変えない) */
export const DECL = Object.freeze({
  coefSumTol: 1e-12,   // 係数の和 = 1 の許し(丸め)
  // 共鳴の外の反例(統括の参考の試作と同じ数 —— 整数で閉じる): Ω = 4・ω_res = 5·1 − 4·0.5 = 3・γ = π/4 → N = −2
  counter: Object.freeze({ gamma: Math.PI / 4, spinOmega: 4, Nmax: 2, orbitalModes: Object.freeze([Object.freeze({ key: 'earth', coefficient: 5, omega: 1 }), Object.freeze({ key: 'venus', coefficient: -4, omega: 0.5 })]) }),
  frameShift: 7,   // 共通の回転(自転と全部の軌道の角速度に足す)
  derivStep: 1e-5,   // 数値微分の刻み(時間)
  derivTol: 1e-8,   // 数値微分と解析の dU/dt の相対の許し
  phases: Object.freeze([0, Math.PI / 8, Math.PI / 4, 3 * Math.PI / 8, Math.PI / 2, -Math.PI / 4]),   // 位相の格子(帳簿の閉じと反作用の和を全部で)
  averageQuad: 4096,   // 位相が回る(固定の外)ときの 1 周の平均の点の数(中点則)
  venusModes: Object.freeze([Object.freeze({ key: 'earth', coefficient: 5 }), Object.freeze({ key: 'venus', coefficient: -4 })]),   // γ = θ − 5λ_⊕ + 4λ_♀
  venusPhases: Object.freeze([Math.PI / 4, -Math.PI / 4, Math.PI / 8, 0]),   // 金星の例の位相(π/4・−π/4 は有利な位相 —— abs(N) = N_max)
});

const fin = (x) => typeof x === 'number' && Number.isFinite(x);

/** 共鳴の口の仕事の契約。入力 { gamma, spinOmega, Nmax, orbitalModes:[{ key?, coefficient, omega }] }(軸の向きのスカラー —— 符号つき)。
 *  出力: torque・potential・patternOmega・slip(γ̇)・spinPower・potentialRate・orbitDraw・heat 0・orbits(軌道ごとのトルクと仕事)・energyResidual・angularResidual・prescribed(resPort の等置の値) */
export function resonancePower({ gamma, spinOmega, Nmax, orbitalModes } = {}) {
  if (![gamma, spinOmega, Nmax].every(fin) || !(Nmax >= 0)) throw new RangeError('resonancePower: γ・Ω・N_max は有限の数(N_max ≥ 0)');
  if (!Array.isArray(orbitalModes) || orbitalModes.length === 0 || orbitalModes.some((q) => !q || !fin(q.coefficient) || !fin(q.omega))) throw new RangeError('resonancePower: 軌道の項は 1 つ以上・係数と角速度は有限の数');
  const sumC = orbitalModes.reduce((s, q) => s + q.coefficient, 0);
  if (!(Math.abs(sumC - 1) <= DECL.coefSumTol)) throw new RangeError('resonancePower: 軌道の項の係数の和は 1(共通の回転で位相が変わらない)');
  const patternOmega = orbitalModes.reduce((s, q) => s + q.coefficient * q.omega, 0), slip = spinOmega - patternOmega;
  const torque = -Nmax * Math.sin(2 * gamma), potential = -0.5 * Nmax * Math.cos(2 * gamma);
  const spinPower = torque * spinOmega, potentialRate = -torque * slip;
  const orbits = orbitalModes.map((q) => ({ key: q.key === undefined ? null : q.key, coefficient: q.coefficient, omega: q.omega, torque: -q.coefficient * torque, power: -q.coefficient * torque * q.omega }));
  const orbitDraw = -orbits.reduce((s, q) => s + q.power, 0);
  const energyResidual = orbitDraw - spinPower - potentialRate, angularResidual = torque + orbits.reduce((s, q) => s + q.torque, 0);
  const eScale = Math.max(Math.abs(orbitDraw), Math.abs(spinPower), Math.abs(potentialRate), ...orbits.map((q) => Math.abs(q.power))), aScale = Math.max(Math.abs(torque), ...orbits.map((q) => Math.abs(q.torque)));
  // 第327便f の resPort(指定のトルク N と同じ額の自転の仕事を軌道の口座から —— 軸 â = z)の値と、契約との差(= dU/dt)
  const old = resPort({ Omega: [0, 0, spinOmega], a: [0, 0, 1], Nr: torque });
  return { torque, potential, patternOmega, slip, spinPower, potentialRate, orbitDraw, heat: 0, orbits, energyResidual, angularResidual,
    energyResidualRel: eScale > 0 ? Math.abs(energyResidual) / eScale : 0, angularResidualRel: aScale > 0 ? Math.abs(angularResidual) / aScale : 0,
    prescribed: { orbitWork: old.orbitWork, heat: old.heat, gap: orbitDraw - old.orbitWork, gapRel: Math.abs(spinPower) > 0 ? Math.abs(orbitDraw - old.orbitWork) / Math.abs(spinPower) : 0 } };
}
/** 要るトルク N に位相があるか(abs(N) ≤ N_max なら γ = −½ asin(N/N_max) —— 2 つの解の安定な側〔cos 2γ > 0〕・無ければ null) */
export function phaseFor({ torque, Nmax }) {
  if (!fin(torque) || !fin(Nmax) || !(Nmax >= 0)) throw new RangeError('phaseFor: 有限の数(N_max ≥ 0)');
  if (Nmax === 0) return torque === 0 ? 0 : null;
  return Math.abs(torque) <= Nmax ? -0.5 * Math.asin(torque / Nmax) : null;
}
/** 位相が一様に回る(固定の外 —— 1 周を中点則 M 点)ときの平均のトルク・dU/dt・自転の仕事・軌道の口座の仕事 */
export function circulationAverage({ spinOmega, Nmax, orbitalModes, M = DECL.averageQuad }) {
  let N = 0, dU = 0, Ps = 0, Po = 0;
  for (let k = 0; k < M; k++) { const r = resonancePower({ gamma: (k + 0.5) * Math.PI / M, spinOmega, Nmax, orbitalModes }); N += r.torque; dU += r.potentialRate; Ps += r.spinPower; Po += r.orbitDraw; }
  return { torque: N / M, potentialRate: dU / M, spinPower: Ps / M, orbitDraw: Po / M };
}

/* ───────── 純関数の場面(QA lint.resPower328c)———————— */
export function pureScenes() {
  const S = {}, C = DECL.counter, args = { gamma: C.gamma, spinOmega: C.spinOmega, Nmax: C.Nmax, orbitalModes: C.orbitalModes };
  // ① 共鳴の外の反例: Ω = 4・ω_res = 3・N = −2 → 自転の仕事 −8・軌道の口座から −6・ポテンシャルへ +2・地球の軌道 +10(= −5N)・金星の軌道 −8(= +4N)。resPort は −8(差 +2 = dU/dt)
  const a = resonancePower(args);
  S.counter = { torque: a.torque, patternOmega: a.patternOmega, spinPower: a.spinPower, orbitDraw: a.orbitDraw, potentialRate: a.potentialRate, heat: a.heat,
    orbitTorques: a.orbits.map((q) => q.torque), orbitPowers: a.orbits.map((q) => q.power), energyResidual: a.energyResidual, angularResidual: a.angularResidual,
    prescribedOrbitWork: a.prescribed.orbitWork, gap: a.prescribed.gap };
  // ② 捕獲(Ω = ω_res): dU/dt = 0・軌道の口座の仕事 = 自転の仕事 = resPort の値
  const l = resonancePower(Object.assign({}, args, { spinOmega: a.patternOmega }));
  S.capture = { potentialRate: l.potentialRate, orbitDraw: l.orbitDraw, spinPower: l.spinPower, prescribedOrbitWork: l.prescribed.orbitWork, gap: l.prescribed.gap };
  // ③ 共通の回転(自転と全部の軌道に δ): トルク・ポテンシャル・dU/dt・軌道のトルクは同じ・自転の仕事と軌道の口座の仕事は同じ額 N δ だけ動く・閉じは 0
  const d = DECL.frameShift, rt = resonancePower(Object.assign({}, args, { spinOmega: C.spinOmega + d, orbitalModes: C.orbitalModes.map((q) => Object.assign({}, q, { omega: q.omega + d })) }));
  S.rotation = { shift: d, torqueSame: rt.torque === a.torque, potentialSame: rt.potential === a.potential, rateSame: rt.potentialRate === a.potentialRate, orbitTorquesSame: JSON.stringify(rt.orbits.map((q) => q.torque)) === JSON.stringify(a.orbits.map((q) => q.torque)),
    spinShift: rt.spinPower - a.spinPower, drawShift: rt.orbitDraw - a.orbitDraw, expectShift: a.torque * d, energyResidual: rt.energyResidual, angularResidual: rt.angularResidual };
  // ④ 数値微分: U(γ(t))・γ(t) = γ_0 + (Ω − ω_res) t の中心差分 = dU/dt・∂U/∂γ の中心差分 = −N
  const h = DECL.derivStep, U = (g) => resonancePower(Object.assign({}, args, { gamma: g })).potential;
  const dUdt = (U(C.gamma + h * a.slip) - U(C.gamma - h * a.slip)) / (2 * h), dUdg = (U(C.gamma + h) - U(C.gamma - h)) / (2 * h);
  S.derivative = { numeric: dUdt, analytic: a.potentialRate, rel: Math.abs(dUdt - a.potentialRate) / Math.abs(a.potentialRate), torqueNumeric: -dUdg, torqueRel: Math.abs(-dUdg - a.torque) / Math.abs(a.torque) };
  // ⑤ 反作用の和 0・帳簿の閉じ(位相の格子 × 自転 3 つ × 3 項の軌道 —— 係数の和 1)
  const modes3 = [{ coefficient: 2, omega: 1.3 }, { coefficient: -3, omega: -0.4 }, { coefficient: 2, omega: 0.25 }];
  let eMax = 0, aMax = 0, n = 0;
  for (const g of DECL.phases) for (const om of [-5.5, 0.2, 9]) for (const md of [C.orbitalModes, modes3]) { const r = resonancePower({ gamma: g, spinOmega: om, Nmax: 3.7, orbitalModes: md }); eMax = Math.max(eMax, r.energyResidualRel); aMax = Math.max(aMax, r.angularResidualRel); n++; }
  S.closure = { cases: n, energyRelMax: eMax, angularRelMax: aMax };
  // ⑥ 位相が回る(固定の外)と 1 周の平均のトルク・dU/dt は 0(自転と軌道の口座の平均の仕事も 0)・要るトルクが N_max を超えると位相が無い
  const av = circulationAverage({ spinOmega: C.spinOmega, Nmax: C.Nmax, orbitalModes: C.orbitalModes });
  S.average = { torque: av.torque, potentialRate: av.potentialRate, spinPower: av.spinPower, orbitDraw: av.orbitDraw, phaseInside: phaseFor({ torque: -1, Nmax: 2 }), phaseOutside: phaseFor({ torque: 2.5, Nmax: 2 }),
    phaseBack: resonancePower(Object.assign({}, args, { gamma: phaseFor({ torque: -1, Nmax: 2 }) })).torque };
  // ⑦ 入力の拒否(係数の和 ≠ 1・角速度が無限・位相が NaN・N_max < 0・軌道の項が空・配列でない)
  const bad = [{ orbitalModes: [{ coefficient: 2, omega: 1 }] }, { orbitalModes: [{ coefficient: 1, omega: Infinity }] }, { gamma: NaN }, { Nmax: -1 }, { orbitalModes: [] }, { orbitalModes: null }, { spinOmega: '4' }];
  S.reject = bad.map((b) => { try { resonancePower(Object.assign({}, args, b)); return false; } catch (e) { return e instanceof RangeError; } });
  return S;
}
export function pureGates(S) {
  const c = S.counter, r = S.rotation;
  return {
    offResonanceCounter: c.torque === -2 && c.patternOmega === 3 && c.spinPower === -8 && c.orbitDraw === -6 && c.potentialRate === 2 && c.heat === 0 && JSON.stringify(c.orbitTorques) === JSON.stringify([10, -8])
      && c.energyResidual === 0 && c.angularResidual === 0 && c.prescribedOrbitWork === -8 && c.gap === 2,
    captureMatchesPrescribed: S.capture.potentialRate === 0 && S.capture.orbitDraw === S.capture.spinPower && S.capture.prescribedOrbitWork === S.capture.spinPower && S.capture.gap === 0,
    commonRotation: r.torqueSame && r.potentialSame && r.rateSame && r.orbitTorquesSame && r.spinShift === r.expectShift && r.drawShift === r.expectShift && r.energyResidual === 0 && r.angularResidual === 0,
    numericDerivative: S.derivative.rel <= DECL.derivTol && S.derivative.torqueRel <= DECL.derivTol,
    reactionsSumZero: S.closure.cases === 36 && S.closure.energyRelMax <= 1e-12 && S.closure.angularRelMax <= 1e-12,
    circulationAverageZero: Math.abs(S.average.torque) <= 1e-12 && Math.abs(S.average.potentialRate) <= 1e-12 && Math.abs(S.average.spinPower) <= 1e-12 && Math.abs(S.average.orbitDraw) <= 1e-12
      && S.average.phaseOutside === null && S.average.phaseInside !== null && Math.abs(S.average.phaseBack + 1) <= 1e-12,
    rejectInputs: S.reject.length === 7 && S.reject.every((v) => v === true),
  };
}

/* ───────── 金星の例(第327便f の正本の宣言の値 —— 記録)———————— */
/** 第327便f の正本 J(tests/out/venustide-w327f.json)の宣言の観測の周期と N_max(文献の桁の (B − A)/C)で、位相ごとの契約の値と resPort との差 */
export function venusExample(J, phases = DECL.venusPhases) {
  const P = J.observed.declared, R = J.resonance, Nmax = R.NmaxMain, modes = DECL.venusModes.map((q) => Object.assign({}, q, { omega: q.key === 'earth' ? P.nE : P.nV }));
  const rows = phases.map((g) => Object.assign({ gamma: g }, resonancePower({ gamma: g, spinOmega: P.sV, Nmax, orbitalModes: modes })));
  const av = circulationAverage({ spinOmega: P.sV, Nmax, orbitalModes: modes });
  const width = R.grid.find((q) => q.mult === 1).halfWidth, DAY = 86400;
  // 位相を追う段の注意: 本の状態(接触の二体)の厳密な共鳴と宣言の周期の厳密な共鳴の差(固定の幅との比)
  const nEb = 2 * Math.PI / (J.observed.book.earthOrbitDays * DAY), nVb = 2 * Math.PI / (J.observed.book.orbitDays * DAY), omResBook = 5 * nEb - 4 * nVb;
  return { Nmax, spinOmega: P.sV, patternOmega: rows[0].patternOmega, omRes: P.omRes, slip: rows[0].slip, halfWidth: width, slipOverWidth: Math.abs(rows[0].slip) / width,
    circulationYears: Math.PI / Math.abs(rows[0].slip) / (365.25 * DAY), rows, average: av,
    book: { omRes: omResBook, resDays: 2 * Math.PI / omResBook / DAY, declResDays: P.resDays, diff: omResBook - P.omRes, diffOverWidth: Math.abs(omResBook - P.omRes) / width, canonBookOmRes: R.book.omRes } };
}
