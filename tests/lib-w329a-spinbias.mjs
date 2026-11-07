// 第329便a(原仮定者の方針(2026-11-07)「範囲を広げ過ぎず、その中での整合性を成立させる」「必要に応じてノブを用意し、物理的意味の深掘りはしない」「R_d は K1 で固定し、s_d などに
//   フィットの余地を見出す」「太陽–金星・木星–イオ(気体と固体)で共通する法則を探す・地球–月(固体同士)を対照に」・原仮定者の回答(2026-11-07 —— AN570・AN571・AN574・AN575)・
//   統括の検証項目 R304): **金星・イオ・月・水星の比べる表と表裏の偏りのノブ(保存の口)の純関数**(器 tests/exp-w329a-spinbias.mjs と QA lint.spinBias329a が読む —— html を読まない・
//   ファイルを読まない・状態を持たない・エンジンの式を写さない。受動の口〔銀河・K1・固体の潮汐〕は器が第327便a・第327便f の lib をそのまま呼ぶ)。
//
// ■ 比べる表(宣言 —— 走行の前に置く): 4 組(太陽–水星・太陽–金星・木星–イオ・地球–月)の源と受け手・組の種類(気体と固体/固体同士)・観測の周期(文献の値 —— 本便は一次資料に当たっていない)・
//   像の k(水星 3/2・金星 −1・同期 1)と観測の k = T_orb/T_rot を**別の列**に(本の自転を像に置き換えない)・N = |1 − k|(1 公転に源を向く回数)・会合の周期。
// ■ 表裏の偏りの口(宣言したノブ —— 機構は主張しない): 位相 γ = θ − Σ_j c_j λ_j(θ は受け手の「表」の向き・λ_j は軌道の角・Σ c_j = 1 —— 共通の回転で γ が変わらない)。
//     U_bias = −N₁ cos γ − (N₂/2) cos 2γ・N_bias = −∂U/∂γ = −N₁ sin γ − N₂ sin 2γ・∂N/∂γ = −N₁ cos γ − 2N₂ cos 2γ。
//   N₁ が表裏(γ と γ + π)を区別する・N₂ だけでは区別しない。**保存の口なので熱 0** —— 仕事は dU/dt = −N(Ω − ω_res) と軌道の口座への反作用 −c_j N(和 0)へ。
//   m 回対称の項の角 m γ = m θ − Σ (m c_j) λ_j は m c_j が整数のときだけ配置の一価の関数(水星の 3:2 の c = (3/2, −1/2) は m = 1 で一価にならない —— 近日点ごとに源を向く面が入れ替わる)。
//   局所の安定: 平衡のトルク(N_bias(γ*) = 要るトルク)に加えて復元の勾配 ∂N/∂γ < 0 と正の減衰(受動の口の Γ の和 > 0)。
// ■ 熱: 受動の口は由来ごとに Q_α = Γ_α (ν_α − Ω)² ≥ 0(逆向きの由来を先に合成して二乗しない)・偏りの口の熱は 0。
// ■ 言わないこと: 偏りの振幅は「宣言したノブで表現できた(要る振幅)」の記録 —— 機構の同定・金星の逆転・表の面の同定・共通の法則の発見ではない。捕獲や起源を確定したとは書かない。
//   負の Γ を要する解は不採用(0 に丸めない)。
import { resonancePower } from './lib-w328c-respower.mjs';
export const LIB_VERSION = 'w329a-spinbias-lib-1';
const DAY = 86400;
export const G_SI = 6.6743e-11;   // SI の重力定数(第327便f の lib と同じ値)
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const SAT_KEY = Object.keys({ io: 1 })[0], MER = Object.keys({ mercury: 1 })[0];   // 鍵の文字列を引用符で書かない(領域の下限 deriveScope が同じ綴りの本の id と取り違えない書き方)

/** 宣言(走行の前に置く —— 結果を見て変えない) */
export const DECL = Object.freeze({
  // 4 組(源 → 受け手)。kind: 気体と固体(gasSolid)/固体同士(solidSolid)。role: 主に比べる組(main)・対照(control)・並べる組(side)。
  //   image: 像の k(説明用の近似の比 —— 観測の k とは別の列)。pattern: 位相の宣言(係数 c_j の軌道の鍵 —— Σ c_j = 1)と「表」の宣言。
  pairs: Object.freeze([
    Object.freeze({ key: MER, src: 'sun', recv: MER, kind: 'gasSolid', role: 'side', image: 1.5, imageJa: '3:2(2 公転に 3 自転)',
      pattern: Object.freeze({ modes: Object.freeze([Object.freeze({ key: MER, coefficient: 1.5 }), Object.freeze({ key: 'perihelion', coefficient: -0.5 })]), front: '近日点で太陽を向く面(宣言 —— 近日点ごとに入れ替わる)' }) }),
    Object.freeze({ key: 'venus', src: 'sun', recv: 'venus', kind: 'gasSolid', role: 'main', image: -1, imageJa: '1 公転に逆向き 1 自転',
      pattern: Object.freeze({ modes: Object.freeze([Object.freeze({ key: 'earth', coefficient: 5 }), Object.freeze({ key: 'venus', coefficient: -4 })]), front: '地球に最接近する時(内合)に地球を向く面' }) }),
    Object.freeze({ key: SAT_KEY, src: 'jupiter', recv: SAT_KEY, kind: 'gasSolid', role: 'main', image: 1, imageJa: '潮汐ロック(同期)',
      pattern: Object.freeze({ modes: Object.freeze([Object.freeze({ key: SAT_KEY, coefficient: 1 })]), front: '木星を向く面' }) }),
    Object.freeze({ key: 'moon', src: 'earth', recv: 'moon', kind: 'solidSolid', role: 'control', image: 1, imageJa: '潮汐ロック(同期)',
      pattern: Object.freeze({ modes: Object.freeze([Object.freeze({ key: 'moon', coefficient: 1 })]), front: '地球を向く面' }) }),
  ]),
  mainPairs: Object.freeze(['venus', SAT_KEY]), controlPair: 'moon', sidePair: MER,
  // 観測の周期(文献の値 —— 日。本便は一次資料に当たっていない。金星・地球・月は第327便f の lib の DECL.obs と同じ値・水星と月の公転は paper/data/solar-observations.csv の
  //   NSSDC の行と同じ値・イオの公転は paper/data/jovian-satellites.csv の sidereal_orbital_period の行と同じ値。月とイオの自転は同期の文献の記述 —— 公転と同じ値の宣言)
  obs: Object.freeze({
    mercury: Object.freeze({ orbitDays: 87.969, spinDays: 58.6462, e: 0.2056, synodicWith: 'earth' }),
    venus: Object.freeze({ orbitDays: 224.701, spinDays: -243.025, e: 0.0068, synodicWith: 'earth' }),
    [SAT_KEY]: Object.freeze({ orbitDays: 1.769138, spinDays: 1.769138, e: 0.0041, synodicWith: 'sun' }),
    moon: Object.freeze({ orbitDays: 27.3217, spinDays: 27.3217, e: 0.0549, synodicWith: 'sun' }),
    earthOrbitDays: 365.256, jupiterOrbitDays: 4332.59,
  }),
  // 受け手の文献の値の桁(比べる列 —— 合わせない。k2/Q は固体の潮汐の口の (3/2)(k2/Q)X′・C22 は永久の四重極 (B − A)/(M R²) = 4 C22。月は (B − A)/C で持つ —— 第327便f の lib と同じ値)
  lit: Object.freeze({
    moi: Object.freeze({ mercury: 0.346 }),   // 他は第326便d・第327便e の lib の MOI(太陽 0.07・金星 0.33・地球 0.3307・木星 0.254・イオ 0.378・月 0.3929)
    k2Q: Object.freeze({ mercury: 0.45 / 100, venus: 0.295 / 30, [SAT_KEY]: 0.015, moon: 0.024 / 38 }),
    C22: Object.freeze({ mercury: 8.1e-6, venus: 5.5e-7, [SAT_KEY]: 5.537e-4 }), moonBAoverC: 2.28e-4,
  }),
  // 受動の口の型(第328便b の AN562 = A と同じ主: 固体は一定の時間の遅れ〔観測の滑りで一定の Q と同じトルクに揃える〕。同期の組の主の起潮天体は揃えの滑りに |n| を使う宣言)
  solidMain: 'constLag', anchorSyncSlip: 'orbitRate',
  galaxyResponse: Object.freeze({ form: 'ballMean', p: 0, ja: '球の平均・p = 0(第328便b・原仮定者の回答(2026-11-07 —— AN571)の主列 —— 慣性で配る型・K1 の比は列として消さない)' }),
  family: 'E',
  tau0: Object.freeze(['inf', 'age']),   // 応答の時間の尺度 τ_0(Γ⁰ = I/τ_0 —— 無限〔銀河と K1 の口のトルク 0〕と年齢。第327便f の frozen.tauSet と同じ 2 つ)
  axisProjection: Object.freeze({ main: 'coplanar', also: 'book', ja: '軌道の角速度の軸への射影 —— 主は同じ面(射影 1)・比べる列は本の J2000 の状態の n̂·â' }),
  orbitKind: Object.freeze({ main: 'mean', also: 'osculating', ja: '平均の軌道(文献の周期)が主・接触の軌道(本の J2000 の状態の二体)は比べる列' }),
  epoch: 'J2000(本の状態・軸)—— 文献の周期は平均の値(元期に依らない宣言)',
  // 偏りの口: 要る振幅の余裕(宣言の振幅 = margin × 要る振幅 —— 平衡の位相・復元の勾配・帳簿はこの振幅で)と N₁ を足す列の N₂(文献の四重極の桁に固定 —— ノブは N₁ だけ)
  margin: 2, n2InN1Column: 'literatureQuadrupole',
  // s_d の作用箇所(源の側/受け手の側を 1 つずつ —— 観測の自転の倍率。範囲の外は受理器が拒否のまま記録)
  sdFactors: Object.freeze([0, 0.5, 1, 2, -1]), sdSources: Object.freeze(['sun', 'jupiter', 'earth']), sdReceivers: Object.freeze([MER, 'venus', SAT_KEY, 'moon']),
  spinRangeBook: 20,   // 受理器の spin の値域(本の時間の単位で abs ≤ 20 —— 外は丸めずに拒否)
  // 気体と固体の 2 組の式の形の比べ(走行の前の宣言): 無次元化の 3 つの尺度・「共通の形の候補」の門(金星とイオの無次元の振幅の比が 2 倍の内・τ_0 の 2 つの枝の両方で)・
  //   単純な関数の候補の比(1 つのべき —— 要るべきが半整数の 0.05 の内で 2 つの枝で同じなら「単純」)
  forms: Object.freeze([
    Object.freeze({ key: 'tidal', ja: '潮汐の尺度 X′ = G m_src² R⁵/d⁶' }),
    Object.freeze({ key: 'quad', ja: '四重極の尺度 (3/2) G m_src (B − A)/d³' }),
    Object.freeze({ key: 'spin', ja: '自転の尺度 C n²' }),
  ]),
  commonTolLog10: Math.log10(2),
  simpleRatios: Object.freeze(['mSrc', 'mRecv', 'dist', 'radius', 'cycles', 'orbitRate']),
  simpleTol: 0.05, simpleMaxPow: 3,
  // 小さな位相の模型(AN575 = B の限定 —— 診断だけ): 1 自由度 C γ̈ = N_bias(γ) + Σ_α Γ_α(ν_α − Ω)(Ω = ω_res + γ̇ —— 受動の口の線形の形・減衰 D = Σ Γ_α > 0 は受動の口の由来)
  phaseModel: Object.freeze({ pair: 'venus', starts: Object.freeze(['observed', 'image']), stepsPerPeriod: 128, periods: 20, column: 'n1', tau: 'age', gammaTol: 1e-4 }),
  rk: 'RK4(h と h/2 —— 状態に仕事と熱の積分を足して同じ步で積む)',
});

/* ───────── 比べる表(観測の周期)———————— */
/** 組の観測の量: k = T_orb/T_rot・N = |1 − k|・源に対する自転の周期(太陽日・木星日)・会合の周期(宣言の相手)・像の k との差 */
export function periodsOf(key, o = DECL.obs) {
  const q = o[key], pr = DECL.pairs.find((p) => p.key === key);
  if (!q || !pr) throw new RangeError('periodsOf: 組 ' + key);
  const n = 2 * Math.PI / (q.orbitDays * DAY), s = 2 * Math.PI / (q.spinDays * DAY), k = q.orbitDays / q.spinDays, N = Math.abs(1 - k);
  const otherDays = q.synodicWith === 'earth' ? o.earthOrbitDays : (key === SAT_KEY ? o.jupiterOrbitDays : o.earthOrbitDays);
  const synodicDays = 1 / Math.abs(1 / q.orbitDays - 1 / otherDays), solarDays = N > 0 ? q.orbitDays / N : Infinity;
  return { key, k, kImage: pr.image, kDiff: k - pr.image, N, NImage: Math.abs(1 - pr.image), n, s, orbitDays: q.orbitDays, spinDays: q.spinDays, solarDays, synodicDays, synodicWith: q.synodicWith,
    synodicOverSolar: Number.isFinite(solarDays) ? synodicDays / solarDays : null, e: q.e };
}
/** 位相のパターンの角速度 ω_res = Σ c_j ω_j(軌道の角速度の宣言 —— 近日点の向きは 0 の宣言) */
export function patternRate(modes, rates) {
  checkModes(modes);
  return modes.reduce((s, q) => s + q.coefficient * (rates[q.key] === undefined ? 0 : rates[q.key]), 0);
}
export function checkModes(modes) {
  if (!Array.isArray(modes) || modes.length === 0 || modes.some((q) => !q || !fin(q.coefficient))) throw new RangeError('modes: 係数は有限の数');
  const sc = modes.reduce((s, q) => s + q.coefficient, 0);
  if (Math.abs(sc - 1) > 1e-12) throw new RangeError('modes: 係数の和は 1(共通の回転で位相が変わらない)');
  return true;
}
/** m 回対称の項が配置の一価の関数か(m c_j が全部整数) */
export function harmonicAdmissible(modes, m) {
  checkModes(modes);
  return modes.every((q) => Math.abs(m * q.coefficient - Math.round(m * q.coefficient)) <= 1e-12);
}
/** 像の k を源の軌道 1 項の位相(γ = θ − k λ)で書けるか(Σ c_j = 1 —— k = 1 の同期だけ。3/2 は近日点の角・−1 は他の角〔離心率の高い次数〕が要る) */
export function imageOneTerm(k) { try { checkModes([{ key: 'orbit', coefficient: k }]); return true; } catch (e) { return false; } }
/** 離心率の関数(古典の 3:2 の項の係数 H(e) = 7e/2 − 123e³/16 —— 文献の型) */
export const hansen32 = (e) => 3.5 * e - 123 / 16 * e * e * e;

/* ───────── 偏りの口(保存)———————— */
export function biasTorque(gamma, N1, N2) { return -N1 * Math.sin(gamma) - N2 * Math.sin(2 * gamma); }
export function biasPotential(gamma, N1, N2) { return -N1 * Math.cos(gamma) - 0.5 * N2 * Math.cos(2 * gamma); }
export function biasGradient(gamma, N1, N2) { return -N1 * Math.cos(gamma) - 2 * N2 * Math.cos(2 * gamma); }
const ampOk = (N1, N2) => fin(N1) && fin(N2) && N1 >= 0 && N2 >= 0;
/** 偏りの口の仕事の契約(第328便c の resonancePower を N₂ の項に・N₁ の項を足す —— 熱 0・反作用 −c_j N・dU/dt = −N(Ω − ω_res)) */
export function biasPower({ gamma, spinOmega, N1, N2, orbitalModes }) {
  if (![gamma, spinOmega].every(fin) || !ampOk(N1, N2)) throw new RangeError('biasPower: γ・Ω は有限・N₁・N₂ は 0 以上の有限の数');
  if (!Array.isArray(orbitalModes) || orbitalModes.length === 0 || orbitalModes.some((q) => !q || !fin(q.coefficient) || !fin(q.omega))) throw new RangeError('biasPower: 軌道の項');
  checkModes(orbitalModes);
  const patternOmega = orbitalModes.reduce((s, q) => s + q.coefficient * q.omega, 0), slip = spinOmega - patternOmega;
  const torque = biasTorque(gamma, N1, N2), potential = biasPotential(gamma, N1, N2), spinPower = torque * spinOmega, potentialRate = -torque * slip;
  const orbits = orbitalModes.map((q) => ({ key: q.key === undefined ? null : q.key, coefficient: q.coefficient, omega: q.omega, torque: -q.coefficient * torque, power: -q.coefficient * torque * q.omega }));
  const orbitDraw = -orbits.reduce((s, q) => s + q.power, 0), energyResidual = orbitDraw - spinPower - potentialRate, angularResidual = torque + orbits.reduce((s, q) => s + q.torque, 0);
  const eScale = Math.max(Math.abs(orbitDraw), Math.abs(spinPower), Math.abs(potentialRate), ...orbits.map((q) => Math.abs(q.power))), aScale = Math.max(Math.abs(torque), ...orbits.map((q) => Math.abs(q.torque)));
  return { torque, potential, gradient: biasGradient(gamma, N1, N2), patternOmega, slip, spinPower, potentialRate, orbitDraw, heat: 0, orbits, energyResidual, angularResidual,
    energyResidualRel: eScale > 0 ? Math.abs(energyResidual) / eScale : 0, angularResidualRel: aScale > 0 ? Math.abs(angularResidual) / aScale : 0 };
}
/** 平衡の位相: N_bias(γ*) = T で ∂N/∂γ < 0(安定)の根のうち、表(γ = 0)に最も近い根と裏(γ = π)に最も近い根。根が無ければ null */
export function equilibriumPhase(Treq, N1, N2, M = 4096) {
  if (!fin(Treq) || !ampOk(N1, N2)) throw new RangeError('equilibriumPhase: 入力');
  if (N1 === 0 && N2 === 0) return { front: null, back: null, roots: [] };
  const f = (g) => biasTorque(g, N1, N2) - Treq, roots = [], g0 = -Math.PI + 0.37 * 2 * Math.PI / M;   // 格子の起点をずらす(γ = ±π の根を端に置かない)
  let ga = g0, fa = f(ga);
  for (let k = 1; k <= M; k++) {
    const gb = g0 + 2 * Math.PI * k / M, fb = f(gb);
    if (fa === 0) roots.push(ga);
    else if (Math.sign(fa) !== Math.sign(fb) && fb !== 0) {
      let a = ga, b = gb, va = fa;
      for (let it = 0; it < 100; it++) { const m = 0.5 * (a + b), vm = f(m); if (vm === 0) { a = b = m; break; } if (Math.sign(vm) === Math.sign(va)) { a = m; va = vm; } else b = m; }
      roots.push(0.5 * (a + b));
    }
    ga = gb; fa = fb;
  }
  const norm = (g) => Math.atan2(Math.sin(g), Math.cos(g));
  const stable = roots.map(norm).filter((g) => biasGradient(g, N1, N2) < 0).map((g) => ({ gamma: g, gradient: biasGradient(g, N1, N2), potential: biasPotential(g, N1, N2) }));
  const wrapPi = (g) => Math.abs(Math.atan2(Math.sin(g - Math.PI), Math.cos(g - Math.PI)));
  const front = stable.length ? stable.reduce((a, b) => (Math.abs(b.gamma) < Math.abs(a.gamma) ? b : a)) : null;
  const back = stable.filter((q) => front && q !== front).reduce((a, b) => (a === null || wrapPi(b.gamma) < wrapPi(a.gamma) ? b : a), null);
  return { front, back, roots: stable };
}
/** 分離線の半幅(γ̇ の向き): 傾けたポテンシャル V = U − T γ の安定の点 γ* から両隣の山の低い方まで sqrt(2ΔV/C)(数値 —— 格子 M 点 + 二分の精密化なし) */
export function separatrixHalfWidth({ Treq, N1, N2, C, gammaStar, M = 8192 }) {
  if (![Treq, C, gammaStar].every(fin) || !(C > 0) || !ampOk(N1, N2)) throw new RangeError('separatrixHalfWidth: 入力');
  const V = (g) => biasPotential(g, N1, N2) - Treq * g, v0 = V(gammaStar);
  let up = -Infinity, dn = -Infinity;
  for (let k = 1; k <= M; k++) { const d = 2 * Math.PI * k / M; up = Math.max(up, V(gammaStar + d)); dn = Math.max(dn, V(gammaStar - d)); }
  // 山: 片側で最初に V が下がり始める点までの最大(格子で —— 2π の内に必ず 1 つ以上の山)
  const peak = (sgn) => { let best = -Infinity, prev = v0; for (let k = 1; k <= M; k++) { const g = gammaStar + sgn * 2 * Math.PI * k / M, v = V(g); if (v < prev && prev > v0) { best = prev; break; } prev = v; best = Math.max(best, v); } return best; };
  const dV = Math.min(peak(1), peak(-1)) - v0;
  return dV > 0 ? Math.sqrt(2 * dV / C) : 0;
}
/** 傾けない対称のポテンシャルの分離線の半幅(解析): N₂ だけ sqrt(2N₂/C)・N₁ だけ 2 sqrt(N₁/C) */
export const widthN2 = (N2, C) => Math.sqrt(2 * N2 / C);
export const widthN1 = (N1, C) => 2 * Math.sqrt(N1 / C);
/** 要る振幅(要るトルク T・観測の差 Δ = |Ω_obs − ω_res|・慣性 C): N₂ だけの列と N₁ を足す列(N₂ は固定の値 N2fix)。
 *  トルクの条件(位相がある最小の振幅)と幅の条件(Δ が分離線の内 —— 傾けない近似)を別に返す。N₁ の項が一価でない組は n1 を null に */
export function requiredAmplitudes({ Treq, Delta, C, N2fix, n1Admissible = true }) {
  if (![Treq, Delta, C, N2fix].every(fin) || !(C > 0) || !(Delta >= 0) || !(N2fix >= 0)) throw new RangeError('requiredAmplitudes: 入力');
  const n2 = { torque: Math.abs(Treq), width: C * Delta * Delta / 2 };
  n2.required = Math.max(n2.torque, n2.width); n2.governs = n2.torque >= n2.width ? 'torque' : 'width';
  if (!n1Admissible) return { n2, n1: null };
  // N₁ を足す列: 位相がある最小の N₁(N₂ = N2fix)—— max_γ s·N_bias(γ) ≥ |T| を二分法で
  const s = Treq >= 0 ? 1 : -1, maxN = (N1) => { let m = -Infinity; for (let k = 0; k < 2048; k++) { const g = -Math.PI + 2 * Math.PI * k / 2048; m = Math.max(m, s * biasTorque(g, N1, N2fix)); } return m; };
  let torqueN1 = 0;
  if (maxN(0) < Math.abs(Treq)) { let lo = 0, hi = Math.max(Math.abs(Treq), 1e-300); while (maxN(hi) < Math.abs(Treq)) hi *= 2; for (let it = 0; it < 80; it++) { const m = 0.5 * (lo + hi); if (maxN(m) >= Math.abs(Treq)) hi = m; else lo = m; } torqueN1 = hi; }
  // 幅の条件: 傾けない対称の和のポテンシャルの分離線(γ = 0 の井戸から γ = π の山の高さ —— N₁ ≥ 0・N₂ ≥ 0 では U(π) − U(0) = 2N₁ と裏の井戸の高さで決まる)
  const widthAt = (N1) => separatrixHalfWidth({ Treq: 0, N1, N2: N2fix, C, gammaStar: 0 });
  let widthN1v = 0;
  if (widthAt(0) < Delta) { let lo = 0, hi = Math.max(C * Delta * Delta / 4, 1e-300); while (widthAt(hi) < Delta) hi *= 2; for (let it = 0; it < 80; it++) { const m = 0.5 * (lo + hi); if (widthAt(m) >= Delta) hi = m; else lo = m; } widthN1v = hi; }
  const n1 = { torque: torqueN1, width: widthN1v, N2: N2fix };
  n1.required = Math.max(n1.torque, n1.width); n1.governs = n1.required === 0 ? 'none' : (n1.torque >= n1.width ? 'torque' : 'width');
  return { n2, n1 };
}

/* ───────── 受動の口(軸の向きのスカラー —— 由来ごとの熱)———————— */
/** 由来ごとの受動の口 [{ key, Gamma ≥ 0, nu }] を Ω で: トルク・熱(由来ごと ≥ 0)・供給・合計。合成してから二乗した熱(失う分の比べる列)も返す */
export function passivePorts(ports, Omega) {
  if (!fin(Omega) || !Array.isArray(ports) || ports.some((q) => !q || !fin(q.nu) || !fin(q.Gamma) || q.Gamma < 0)) throw new RangeError('passivePorts: Γ ≥ 0・ν・Ω は有限');
  const rows = ports.map((q) => { const N = q.Gamma * (q.nu - Omega); return { key: q.key, Gamma: q.Gamma, nu: q.nu, torque: N, heat: q.Gamma * (q.nu - Omega) * (q.nu - Omega), supply: N * q.nu, recvWork: N * Omega }; });
  const torque = rows.reduce((s, r) => s + r.torque, 0), heat = rows.reduce((s, r) => s + r.heat, 0), Gsum = rows.reduce((s, r) => s + r.Gamma, 0);
  const nuMean = Gsum > 0 ? rows.reduce((s, r) => s + r.Gamma * r.nu, 0) / Gsum : 0, heatMerged = Gsum > 0 ? torque * torque / Gsum : 0;   // 合成の後に二乗(比べる列 —— 由来ごとの熱より小さい)
  return { rows, torque, heat, heatMerged, damping: Gsum, nuMean, supply: rows.reduce((s, r) => s + r.supply, 0) };
}
/** 受け手の核の自転 s_d を表面と別に置くときの核と表面の結合の口(受動 —— Γ_cs ≥ 0 のときだけ採る): 核の受ける口の和 Ncore(s_d で評価)が定常で表面へ渡る。
 *  N_cs = Ncore(表面が受けるトルク)= Γ_cs (s_d − s) → Γ_cs = Ncore/(s_d − s)・熱 Γ_cs (s_d − s)² = Ncore (s_d − s) */
export function coreCoupling({ Ncore, sd, s }) {
  if (![Ncore, sd, s].every(fin)) throw new RangeError('coreCoupling: 有限の数');
  const d = sd - s;
  if (d === 0) return { Gamma: null, admissible: Ncore === 0, heat: 0, torqueOnSurface: Ncore, why: d === 0 && Ncore !== 0 ? '核と表面が同じ自転で核のトルクが 0 でない(結合の口で渡せない)' : null };
  const G = Ncore / d;
  return { Gamma: G, admissible: G >= 0, heat: Ncore * d, torqueOnSurface: Ncore, why: G >= 0 ? null : '要る結合の Γ が負(受動の口では渡せない —— 不採用・0 に丸めない)' };
}

/* ───────── 気体と固体の 2 組の式の形 ———————— */
/** 無次元の振幅(尺度で割る)と 2 組の比(log10)・共通の形の候補の判定(2 つの枝の両方で 2 倍の内) */
export function formCompare(rowsByBranch, tol = DECL.commonTolLog10) {
  // rowsByBranch: { branch: { a: number, b: number } }(a・b は 2 組の無次元の振幅 —— 正)
  const per = Object.fromEntries(Object.entries(rowsByBranch).map(([br, r]) => { const ok = r.a > 0 && r.b > 0; return [br, { a: r.a, b: r.b, log10Ratio: ok ? Math.log10(r.a / r.b) : null }]; }));
  const all = Object.values(per), candidate = all.length > 0 && all.every((q) => q.log10Ratio !== null && Math.abs(q.log10Ratio) <= tol);
  return { per, candidate };
}
/** 単純な関数の候補: 比 q_a/q_b の 1 つのべきで振幅の比を表すのに要るべき(枝ごと)と、半整数の 0.05 の内で枝の間で同じか */
export function simplePower(rowsByBranch, qa, qb, tol = DECL.simpleTol, maxPow = DECL.simpleMaxPow) {
  const lq = qa > 0 && qb > 0 ? Math.log10(qa / qb) : null;   // 比が 0 か無限(同期の N = 0 など)なら比べない
  const per = Object.fromEntries(Object.entries(rowsByBranch).map(([br, r]) => [br, r.a > 0 && r.b > 0 && lq !== null && Number.isFinite(lq) && lq !== 0 ? Math.log10(r.a / r.b) / lq : null]));
  const v = Object.values(per), half = (x) => Math.round(2 * x) / 2;
  const simple = v.length > 0 && v.every((x) => x !== null && Math.abs(x) <= maxPow && Math.abs(x - half(x)) <= tol) && v.every((x) => Math.abs(x - v[0]) <= tol);
  return { log10q: lq, power: per, simple };
}

/* ───────── 小さな位相の模型(AN575 —— 診断だけ)———————— */
/** C γ̈ = N_bias(γ) + Σ_α Γ_α(ν_α − Ω)・Ω = ω_res + γ̇。状態 y = [γ, Ω, ∫P_α(供給), ∫Q_α(熱), ∫P_orb→bias, ∫Σ_α N_α(ν_α − ω_res)](RK4 —— 同じ步)。
 *  帳簿(慣性の枠): Δ(½CΩ²) + ΔU = ∫Σ(P_α − Q_α) + ∫P_orb→bias・(パターンの枠): Δ(½C(Ω − ω_res)²) + ΔU = ∫Σ N_α(ν_α − ω_res) − ∫ΣQ_α。
 *  判定: 位相が γ* から ±π を超えて離れたら循環(N₁ の項の 1 周)・最後まで内なら秤動 */
export function integratePhase({ C, N1, N2, omegaRes, ports, gamma0, Omega0, h, steps, gammaStar }) {
  if (![C, N1, N2, omegaRes, gamma0, Omega0, h, gammaStar].every(fin) || !(C > 0) || !(h > 0) || !(steps > 0) || !ampOk(N1, N2) || !Array.isArray(ports) || ports.some((q) => !(q.Gamma >= 0) || !fin(q.nu))) throw new RangeError('integratePhase: 入力');
  const nA = ports.length;
  const rhs = (y) => {
    const g = y[0], Om = y[1], Nb = biasTorque(g, N1, N2);
    let Np = 0, P = 0, Q = 0, W = 0;
    for (const q of ports) { const N = q.Gamma * (q.nu - Om); Np += N; P += N * q.nu; Q += q.Gamma * (q.nu - Om) * (q.nu - Om); W += N * (q.nu - omegaRes); }
    return [Om - omegaRes, (Nb + Np) / C, P, Q, Nb * omegaRes, W];
  };
  let y = [gamma0, Omega0, 0, 0, 0, 0], gmaxDev = 0, wrapped = false, crossings = 0, prevSlip = Omega0 - omegaRes;
  for (let k = 0; k < steps; k++) {
    const k1 = rhs(y), y2 = y.map((v, i) => v + 0.5 * h * k1[i]), k2 = rhs(y2), y3 = y.map((v, i) => v + 0.5 * h * k2[i]), k3 = rhs(y3), y4 = y.map((v, i) => v + h * k3[i]), k4 = rhs(y4);
    y = y.map((v, i) => v + h / 6 * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
    const dev = Math.abs(y[0] - gammaStar); gmaxDev = Math.max(gmaxDev, dev); if (dev > Math.PI) wrapped = true;
    const sl = y[1] - omegaRes; if (Math.sign(sl) !== Math.sign(prevSlip) && sl !== 0) crossings++; prevSlip = sl;
  }
  const U0 = biasPotential(gamma0, N1, N2), U1 = biasPotential(y[0], N1, N2);
  const dKin = 0.5 * C * (y[1] * y[1] - Omega0 * Omega0), dKrel = 0.5 * C * ((y[1] - omegaRes) ** 2 - (Omega0 - omegaRes) ** 2), dU = U1 - U0;
  const inertial = dKin + dU - (y[2] - y[3] + y[4]), pattern = dKrel + dU - (y[5] - y[3]);
  const scaleIn = Math.max(Math.abs(dKin), Math.abs(dU), Math.abs(y[2]), Math.abs(y[3]), Math.abs(y[4]), 1e-300), scalePat = Math.max(Math.abs(dKrel), Math.abs(dU), Math.abs(y[5]), Math.abs(y[3]), 1e-300);
  return { gamma: y[0], Omega: y[1], slip: y[1] - omegaRes, supply: y[2], heat: y[3], orbitDraw: y[4], patternWork: y[5], dKin, dKrel, dU, inertialResidual: inertial, inertialRel: Math.abs(inertial) / scaleIn,
    patternResidual: pattern, patternRel: Math.abs(pattern) / scalePat, maxDeviation: gmaxDev, state: wrapped ? 'circulation' : 'libration', slipSignChanges: crossings, steps, h, nPorts: nA };
}

/* ───────── 純関数の場面(QA lint.spinBias329a と器の P 段)———————— */
export function pureScenes() {
  const S = {};
  // ① 偏りの口: N = −∂U/∂γ(中心差分)・∂N/∂γ(中心差分)・N₁ が表裏を区別(U(0) ≠ U(π))・N₂ だけは区別しない(U(0) = U(π))
  { const N1 = 1.3, N2 = 0.7, h = 1e-6, gs = [-2.5, -1, -0.2, 0.4, 1.1, 2.9];
    let dN = 0, dG = 0;
    for (const g of gs) { const num = -(biasPotential(g + h, N1, N2) - biasPotential(g - h, N1, N2)) / (2 * h), gnum = (biasTorque(g + h, N1, N2) - biasTorque(g - h, N1, N2)) / (2 * h);
      dN = Math.max(dN, Math.abs(num - biasTorque(g, N1, N2))); dG = Math.max(dG, Math.abs(gnum - biasGradient(g, N1, N2))); }
    S.port = { dTorque: dN, dGradient: dG, frontBackN1: biasPotential(Math.PI, N1, N2) - biasPotential(0, N1, N2), frontBackN2: biasPotential(Math.PI, 0, N2) - biasPotential(0, 0, N2), heat: 0 }; }
  // ② 契約: N₁ = 0 で第328便c の resonancePower と同じビット(トルク・dU/dt・軌道の口座の仕事・軌道のトルク)・N₁ ≠ 0 の帳簿の閉じ(位相 × 自転 × 軌道の項)・共通の回転の不変
  { const md = [{ key: 'earth', coefficient: 5, omega: 1 }, { key: 'venus', coefficient: -4, omega: 0.5 }], a = biasPower({ gamma: Math.PI / 4, spinOmega: 4, N1: 0, N2: 2, orbitalModes: md }),
      b = resonancePower({ gamma: Math.PI / 4, spinOmega: 4, Nmax: 2, orbitalModes: md });
    const same = a.torque === b.torque && a.potentialRate === b.potentialRate && a.orbitDraw === b.orbitDraw && JSON.stringify(a.orbits.map((q) => q.torque)) === JSON.stringify(b.orbits.map((q) => q.torque)) && a.potential === b.potential;
    let eMax = 0, aMax = 0, n = 0;
    const m3 = [{ coefficient: 2, omega: 1.3 }, { coefficient: -3, omega: -0.4 }, { coefficient: 2, omega: 0.25 }];
    for (const g of [-2, -0.7, 0, 0.3, 1.9, 3]) for (const om of [-5.5, 0.2, 9]) for (const mm of [md, m3]) { const r = biasPower({ gamma: g, spinOmega: om, N1: 1.7, N2: 0.4, orbitalModes: mm }); eMax = Math.max(eMax, r.energyResidualRel); aMax = Math.max(aMax, r.angularResidualRel); n++; }
    const d = 7, r1 = biasPower({ gamma: 0.6, spinOmega: 4, N1: 1.1, N2: 0.5, orbitalModes: md }), r2 = biasPower({ gamma: 0.6, spinOmega: 4 + d, N1: 1.1, N2: 0.5, orbitalModes: md.map((q) => Object.assign({}, q, { omega: q.omega + d })) });
    S.contract = { sameAs328c: same, cases: n, energyRelMax: eMax, angularRelMax: aMax, heat: r1.heat, rotTorqueSame: r1.torque === r2.torque && r1.potentialRate === r2.potentialRate, rotShift: r2.spinPower - r1.spinPower - r1.torque * d }; }
  // ③ 平衡の位相: N₂ だけ γ* = −½ asin(T/N₂)・N₁ だけ γ* = −asin(T/N₁)・安定の勾配 < 0・振幅を超える T は根なし・N₁ + N₂ の裏の井戸は N₁ < 2N₂ のときだけ
  { const e2 = equilibriumPhase(0.6, 0, 1), e1 = equilibriumPhase(-0.3, 1, 0), en = equilibriumPhase(1.5, 0, 1), eb = equilibriumPhase(0, 0.5, 1), ec = equilibriumPhase(0, 2.5, 1);
    S.phase = { n2: e2.front ? e2.front.gamma : null, n2Expect: -0.5 * Math.asin(0.6), n2Grad: e2.front ? e2.front.gradient : null, n2Back: e2.back ? e2.back.gamma : null,
      n1: e1.front ? e1.front.gamma : null, n1Expect: -Math.asin(-0.3), none: en.front === null, backWell: eb.back ? eb.back.gamma : null, noBackWell: ec.back === null }; }
  // ④ 分離線の半幅: 傾けない N₂ だけ sqrt(2N₂/C)・N₁ だけ 2 sqrt(N₁/C) と数値が合う・要る振幅(トルクの条件 = |T|・幅の条件 = CΔ²/2)
  { const C = 3, w2 = separatrixHalfWidth({ Treq: 0, N1: 0, N2: 1.2, C, gammaStar: 0 }), w1 = separatrixHalfWidth({ Treq: 0, N1: 0.8, N2: 0, C, gammaStar: 0 });
    const ra = requiredAmplitudes({ Treq: -0.4, Delta: 0.9, C, N2fix: 0.1 }), wAt = separatrixHalfWidth({ Treq: 0, N1: ra.n1.width, N2: 0.1, C, gammaStar: 0 });
    const rb = requiredAmplitudes({ Treq: 0.05, Delta: 0, C, N2fix: 1 });
    S.width = { w2, w2Expect: widthN2(1.2, C), w1, w1Expect: widthN1(0.8, C), n2Torque: ra.n2.torque, n2Width: ra.n2.width, n2WidthExpect: C * 0.81 / 2, n1WidthHits: wAt, n1Torque: ra.n1.torque,
      n1TorqueCheck: equilibriumPhase(-0.4, ra.n1.torque * (1 + 1e-9), 0.1).front !== null, n1None: rb.n1.required, governs: ra.n2.governs }; }
  // ⑤ 水星: 3:2 の係数 (3/2, −1/2) は 1 回対称では一価でない・2 回対称では一価・H(0) = 0・同期の係数 1 は両方で一価
  { const m32 = DECL.pairs.find((p) => p.key === MER).pattern.modes, sync = [{ key: 'x', coefficient: 1 }];
    S.mercury = { m1: harmonicAdmissible(m32, 1), m2: harmonicAdmissible(m32, 2), sync1: harmonicAdmissible(sync, 1), h0: hansen32(0), hRef: hansen32(0.2), venus1: harmonicAdmissible(DECL.pairs.find((p) => p.key === 'venus').pattern.modes, 1) }; }
  // ⑥ 受動の口の熱は由来ごと(Ω = 0・目標 +1 と −1・Γ = 1 → トルク 0・熱 2 —— 合成してから二乗すると 0)・核と表面の結合の口の採否
  { const P = passivePorts([{ key: 'a', Gamma: 1, nu: 1 }, { key: 'b', Gamma: 1, nu: -1 }], 0), c1 = coreCoupling({ Ncore: 3, sd: 2, s: 1 }), c2 = coreCoupling({ Ncore: 3, sd: 0, s: 1 }), c3 = coreCoupling({ Ncore: 0, sd: 1, s: 1 });
    S.heat = { torque: P.torque, heat: P.heat, heatMerged: P.heatMerged, coupleOk: c1.admissible, coupleGamma: c1.Gamma, coupleHeat: c1.heat, coupleNeg: c2.admissible, coupleNegGamma: c2.Gamma, coupleSame: c3.admissible }; }
  // ⑦ 小さな位相の模型(玩具): 秤動(位相が井戸の内)と循環(外)・h と h/2 の帳簿の閉じ(パターンの枠)が小さく h/2 で 16 倍ほど良くなる・熱 ≥ 0
  { const C = 1, N1 = 1, N2 = 0.3, ports = [{ key: 'tide', Gamma: 0.02, nu: 0.4 }, { key: 'gal', Gamma: 0.01, nu: -0.9 }], om = 0.1;
    const Treq = ports.reduce((s, q) => s + q.Gamma * (q.nu - om), 0), eq = equilibriumPhase(-Treq, N1, N2), gs = eq.front.gamma, wdt = separatrixHalfWidth({ Treq, N1, N2, C, gammaStar: gs });
    const per = 2 * Math.PI / Math.sqrt(-eq.front.gradient / C), run = (v0, div) => integratePhase({ C, N1, N2, omegaRes: om, ports, gamma0: gs, Omega0: om + v0, h: per / (64 * div), steps: 20 * 64 * div, gammaStar: gs });
    const a1 = run(0.5 * wdt, 1), a2 = run(0.5 * wdt, 2), c1 = run(1.5 * wdt, 1), c2 = run(1.5 * wdt, 2);
    S.model = { width: wdt, lib1: a1.state, lib2: a2.state, cir1: c1.state, cir2: c2.state, relH: a1.patternRel, relH2: a2.patternRel, ratio: a2.patternRel > 0 ? a1.patternRel / a2.patternRel : null,
      gammaDiff: Math.abs(a1.gamma - a2.gamma), heatPos: a1.heat >= 0 && c1.heat >= 0, inRelH2: a2.inertialRel }; }
  // ⑧ 入力の拒否(負の振幅・係数の和 ≠ 1・NaN の位相・Γ < 0・慣性 0)
  S.reject = [() => biasPower({ gamma: 0, spinOmega: 1, N1: -1, N2: 0, orbitalModes: [{ coefficient: 1, omega: 1 }] }), () => biasPower({ gamma: 0, spinOmega: 1, N1: 1, N2: 0, orbitalModes: [{ coefficient: 2, omega: 1 }] }),
    () => equilibriumPhase(NaN, 1, 1), () => passivePorts([{ key: 'x', Gamma: -1, nu: 0 }], 0), () => requiredAmplitudes({ Treq: 1, Delta: 1, C: 0, N2fix: 0 }), () => checkModes([{ coefficient: 0.5 }])]
    .map((f) => { try { f(); return false; } catch (e) { return e instanceof RangeError; } });
  return S;
}
export function pureGates(S) {
  const close = (x, y, t = 1e-12) => Math.abs(x - y) <= t * Math.max(1, Math.abs(x), Math.abs(y));
  return {
    biasPortConservative: S.port.dTorque <= 1e-8 && S.port.dGradient <= 1e-8 && close(S.port.frontBackN1, 2 * 1.3) && Math.abs(S.port.frontBackN2) <= 1e-15 && S.port.heat === 0,
    contractCloses: S.contract.sameAs328c === true && S.contract.cases === 36 && S.contract.energyRelMax <= 1e-12 && S.contract.angularRelMax <= 1e-12 && S.contract.heat === 0 && S.contract.rotTorqueSame && Math.abs(S.contract.rotShift) <= 1e-12,
    phaseStable: close(S.phase.n2, S.phase.n2Expect, 1e-10) && S.phase.n2Grad < 0 && S.phase.n2Back !== null && close(S.phase.n1, S.phase.n1Expect, 1e-10) && S.phase.none === true && S.phase.backWell !== null && S.phase.noBackWell === true,
    widthRequired: close(S.width.w2, S.width.w2Expect, 1e-6) && close(S.width.w1, S.width.w1Expect, 1e-6) && S.width.n2Torque === 0.4 && close(S.width.n2Width, S.width.n2WidthExpect) && Math.abs(S.width.n1WidthHits - 0.9) <= 1e-6
      && S.width.n1TorqueCheck === true && S.width.n1None === 0 && S.width.governs === 'width',
    mercuryHarmonic: S.mercury.m1 === false && S.mercury.m2 === true && S.mercury.sync1 === true && S.mercury.h0 === 0 && S.mercury.hRef > 0 && S.mercury.venus1 === true,
    heatPerOrigin: S.heat.torque === 0 && S.heat.heat === 2 && S.heat.heatMerged === 0 && S.heat.coupleOk === true && S.heat.coupleGamma === 3 && S.heat.coupleHeat === 3 && S.heat.coupleNeg === false && S.heat.coupleNegGamma < 0 && S.heat.coupleSame === true,
    phaseModelConverges: S.model.lib1 === 'libration' && S.model.lib2 === 'libration' && S.model.cir1 === 'circulation' && S.model.cir2 === 'circulation' && S.model.relH2 <= 1e-6 && S.model.ratio !== null && S.model.ratio > 8
      && S.model.gammaDiff <= 1e-4 && S.model.heatPos === true && S.model.inRelH2 <= 1e-6,
    rejectInputs: S.reject.length === 6 && S.reject.every((v) => v === true),
  };
}
