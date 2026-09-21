// 第276便b — **❄️ kF0 の残差を要因へ分解するための純関数と出典表**(器は `tests/exp-w276b-charonfactors.mjs`)。
//
// ここに置くのは ① 出典の数(内蔵へは代入しない)② 閉じた式 ③ 代理配置の作り方 —— だけである。
// **判定・合否・採用はここでは決めない。** 数はすべてこのファイルか器が作り、文書へは転記する。
export const CHARON_FACTORS_VERSION = 'w276b-charonfactors-1';

/** CODATA の重力定数(内蔵の G=6.674 と比べるためだけに置く。**内蔵は変えない**)。 */
export const CODATA_G = { value: 6.67430e-11, unit: 'm³/(kg·s²)',
  source: 'CODATA 2018 recommended value G = 6.67430(15)×10⁻¹¹ m³ kg⁻¹ s⁻²',
  note: '内蔵 ❄️ の physics.G は 4 桁の 6.674(= 6.674×10⁻¹¹ SI)。**本便は内蔵を変えない**' };

/**
 * JPL PLU060 の GM(統括の読み R41 が出典として挙げたもの)。**出典として表に載せるだけ**で、
 * 内蔵の質量へ代入しない(代入して 26 ms の精度を主張するには、同じ観測解の状態ベクトルと
 * 共分散が要る —— 本便には無い)。上限しか無い行は `limit:true`。
 */
export const PLU060 = {
  source: 'JPL PLU060(冥王星系の衛星暦)の GM [km³/s²]。統括の読み R41 が挙げた値を出典として並置する',
  rows: [
    { body: 'Pluto', gm: 869.3, sigma: 0.4, limit: false },
    { body: 'Charon', gm: 106.1, sigma: 0.3, limit: false },
    { body: 'Nix', gm: 0.0015, sigma: 0.0005, limit: false },
    { body: 'Hydra', gm: 0.0020, sigma: 0.0003, limit: false },
    { body: 'Kerberos', gm: 0.0002, sigma: null, limit: true },
    { body: 'Styx', gm: 0.0003, sigma: null, limit: true },
  ] };

/**
 * 小衛星 4 体の診断入力。**軌道長半径は円軌道・同一平面の理想化**で、位相は φ_i=i×1.1 rad。
 * 自転は 0(**実在の自転状態の主張ではない** —— 第66報 (2) の「潮汐ロックされていない」に対して、
 * 本便は自転を入力にしない)。半径は表示と接触判定のための概数。
 */
export const SMALL_MOONS = [
  { name: 'Styx', aKm: 42656, gm: 0.0003, gmSigma: null, limit: true, radiusKm: 5 },
  { name: 'Nix', aKm: 48694, gm: 0.0015, gmSigma: 0.0005, limit: false, radiusKm: 25 },
  { name: 'Kerberos', aKm: 57783, gm: 0.0002, gmSigma: null, limit: true, radiusKm: 6 },
  { name: 'Hydra', aKm: 64738, gm: 0.0020, gmSigma: 0.0003, limit: false, radiusKm: 26 },
];

/** 太陽と冥王星の軌道(代理配置の小パラメータを作るためだけに使う)。 */
export const SOLAR = {
  gmSun: 1.32712440018e20, gmSunUnit: 'm³/s²',
  gmSunSource: 'IAU 2015 nominal solar mass parameter GM☉ = 1.3271244×10²⁰ m³ s⁻²',
  plutoSemiMajorAu: 39.482117, auMeters: 1.495978707e11,
  eccentricity: 0.2488,
  note: '実距離は 29.7〜49.3 au を動くので、潮汐小パラメータ X は軌道長半径での値の 0.5〜2.3 倍を動く' };

/** ニュートン二体の周期(シミュレータ単位。ε=0 の閉じた式 — 走行ではない)。 */
export function periodKepler(G, M, a) { return 2 * Math.PI * Math.sqrt(a * a * a / (G * M)); }

/** SI の G からサンプル単位の G を作る(規約 G_sim = G_SI × 10^(M+2T−3L))。 */
export function gSimFromSI(gSI, scale) { return gSI * Math.pow(10, scale.M + 2 * scale.T - 3 * scale.L); }

/** 周期を dP 秒動かすのに要る a の変化(P ∝ a^{3/2})。**採用済み補正ではない**。 */
export function aFromPeriodShift(dPsec, Psec, aMeters) { return (2 / 3) * (dPsec / Psec) * aMeters; }

/** 周期を dP 秒動かすのに要る質量倍率 f(P ∝ M^{−1/2})。**採用済み補正ではない**。 */
export function massFactorFromPeriodShift(dPsec, Psec) { return 1 - 2 * dPsec / Psec; }

/**
 * 独立近似での周期の誤差伝播 (σ_P/P)² ≃ (9/4)(σ_a/a)² + (1/4)(σ_GM/GM)²。
 * **独立近似である**(a と GM は同じ観測解の推定量なので相関がある)。
 */
export function sigmaPeriodIndependent(a, gm, Psec) {
  const relA = a.sigma / a.value, relGM = gm.sigma / gm.value;
  const relP = Math.sqrt(2.25 * relA * relA + 0.25 * relGM * relGM);
  return { formula: '(σ_P/P)² ≃ (9/4)(σ_a/a)² + (1/4)(σ_GM/GM)²',
    relA, relGM, relP, sigmaPeriodSec: relP * Psec,
    termA: 1.5 * relA * Psec, termGM: 0.5 * relGM * Psec,
    inputs: { a, gm, Psec } };
}

/** GM [km³/s²] から、その単位系での質量(シミュレータ単位)を作る。 */
export function moonMassSim(gmKm3s2, gSim, scale) {
  const gmSI = gmKm3s2 * 1e9;                                   // m³/s²
  const gmUnit = gmSI * Math.pow(10, 2 * scale.T - 3 * scale.L); // サンプル単位の GM
  return gmUnit / gSim;
}

/** 小衛星 1 体の初期状態(円軌道・同一平面・位相 i×1.1 rad・自転 0)。 */
export function moonStateSim(moon, i, gSim, mPairSim, scale) {
  const Lm = Math.pow(10, scale.L);
  const a = moon.aKm * 1000 / Lm;
  const m = moonMassSim(moon.gm, gSim, scale);
  const v = Math.sqrt(gSim * mPairSim / a);
  const phi = i * 1.1;
  return { name: moon.name, limit: moon.limit, gm: moon.gm, gmSigma: moon.gmSigma,
    aKm: moon.aKm, aSim: a, mSim: m, vSim: v, phaseRad: phi,
    periodSec: 2 * Math.PI * a / v * Math.pow(10, scale.T),
    body: { type: 'single', m, radius: moon.radiusKm * 1000 / Lm,
      x: a * Math.cos(phi), y: a * Math.sin(phi),
      vx: -v * Math.sin(phi), vy: v * Math.cos(phi), spin: 0, pinned: false } };
}

/**
 * **太陽を分解した 3 体の代理配置**。真の配置(冥王星–太陽 5.9×10¹² m)は受理値域に入らないので、
 * **同じ潮汐小パラメータ X=(n′/n)²=(GM_s/GM_pair)(a/r_s)³** を持つ配置を、a/r_s を固定して
 * M_s だけ振って作る(X 以外の無次元量を動かさないため)。梯子で測ったべき則を真の X へ延ばす。
 */
export function sunLadder({ G, mPair, a, scale, limits, epsFloorM, rs = 4000, XS = [1e-4, 1e-5, 1e-6] }) {
  const Lm = Math.pow(10, scale.L);
  const rSunM = SOLAR.plutoSemiMajorAu * SOLAR.auMeters;
  const aM = a * Lm;
  const gmPairSI = G * mPair * Math.pow(10, 3 * scale.L - 2 * scale.T);
  const trueX = (SOLAR.gmSun / gmPairSI) * Math.pow(aM / rSunM, 3);
  const obstruction = {
    rSunMeters: rSunM, rSunInUnits: rSunM / Lm, coordLimit: limits.bodyCoord[1],
    fitsCoordLimit: (rSunM / Lm) <= limits.bodyCoord[1],
    epsFloorMeters: epsFloorM,
    requiredDynamicRange: rSunM / epsFloorM,
    acceptedDynamicRange: limits.bodyCoord[1] / limits.softening[0],
    shortfallFactor: (rSunM / epsFloorM) / (limits.bodyCoord[1] / limits.softening[0]),
    why: '|x| の受理上限 5000 単位と ε の受理下限 0.01 単位は**どちらも単位に比例する**ので、'
      + '受理できる動的レンジは単位系を変えても 5×10⁵ のまま。冥王星–太陽を ε=10 km で置くには'
      + ' 5.9×10⁸ が要る —— **どの単位系でも真の配置は入らない**(実装上の制約であって物理ではない)' };
  const ratio3 = Math.pow(a / rs, 3);
  const points = XS.map((X) => {
    const Ms = mPair * X / ratio3;
    const vRel = Math.sqrt(G * (Ms + mPair) / rs);
    const xPair = rs * Ms / (Ms + mPair), xSun = -rs * mPair / (Ms + mPair);
    const vPair = vRel * Ms / (Ms + mPair), vSun = -vRel * mPair / (Ms + mPair);
    return { X, rs, Ms, vRel, xPair, xSun,
      shiftPair: { dx: xPair, dy: 0, dvx: 0, dvy: vPair },
      body: { type: 'single', m: Ms, radius: 1, x: xSun, y: 0, vx: 0, vy: vSun, spin: 0, pinned: false },
      withinLimits: Math.abs(xSun) <= limits.bodyCoord[1] && Math.abs(xPair) <= limits.bodyCoord[1]
        && Math.abs(vSun) <= limits.bodyVel[1] && Ms <= limits.massCap };
  });
  return { trueX, obstruction, points,
    declaration: { rs, aOverRs: a / rs, XS,
      pairPeriodSecAtX: points.map((p) => ({ X: p.X, secondsPerSolarOrbit:
        2 * Math.PI * p.rs / p.vRel * Math.pow(10, scale.T) })),
      how: '太陽体と二体を共通重心に置き、相対速度 √(G(M_s+M_pair)/r_s) を質量比で配分する'
        + '(全運動量はゼロ)。**a/r_s は 3 点とも同じ**で、動かしたのは M_s だけである',
      notClaim: ['これは太陽そのものではない', '真の配置の測定値ではない(外挿の材料である)'] } };
}

/** y = A·x^p の対数最小二乗(点が 2 つでも通る)。 */
export function fitPowerLaw(xs, ys) {
  const n = xs.length;
  if (n < 2) return { error: '点が足りない' };
  const X = xs.map(Math.log), Y = ys.map(Math.log);
  const mx = X.reduce((s, v) => s + v, 0) / n, my = Y.reduce((s, v) => s + v, 0) / n;
  let sxy = 0, sxx = 0;
  for (let i = 0; i < n; i++) { sxy += (X[i] - mx) * (Y[i] - my); sxx += (X[i] - mx) * (X[i] - mx); }
  const p = sxy / sxx, lnA = my - p * mx;
  let ss = 0, st = 0;
  for (let i = 0; i < n; i++) { const f = lnA + p * X[i]; ss += (Y[i] - f) ** 2; st += (Y[i] - my) ** 2; }
  return { a: Math.exp(lnA), p, r2: st > 0 ? 1 - ss / st : null, n,
    note: '対数最小二乗。**べきは実測から出した値**で、理論式から置いたものではない' };
}
