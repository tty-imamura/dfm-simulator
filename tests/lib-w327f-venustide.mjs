// 第327便f(原仮定者の指示(2026-11-05)「金星の逆行自転は、大気熱潮汐の影響と、地球との共鳴を採用する」「R_dはK1で固定し、観測の自転もトルクの釣り合いで進める」・
//   統括の検証項目 R300): **金星の自転のトルクの釣り合いに足す 3 つの口(固体の重力潮汐・大気の熱潮汐・地球との共鳴)の宣言と、口を合わせた系の帳簿・釣り合いの点と安定の純関数**
//   (器 tests/exp-w327f-venustide.mjs と QA lint.venusTide327f が読む —— html を読まない・状態を持たない・エンジンの式を写さない。銀河と K1 の口は第327便a の lib の evaluate を
//   そのまま呼ぶ〔族 E が主・族 S は記録〕)。
//
// ■ 口の型(宣言 —— 走行の前に置く。今の DFM の式から導いた法則ではない。式の型は文献の型、値は文献の値の桁 —— 本便は一次資料に当たっていない)
//   受け手の自転 Ω = s â(â は遠方宇宙に対して固定・s は符号つき)・起潮天体に対する公転の角速度のベクトル n(第326便d の接触の二体の型)・滑り Ω − n・w = |Ω − n|・
//   潮汐の周波数 σ = 2w(半日の潮 —— 太陽日の周波数の 2 倍)。X' = G M_r² R⁵/a⁶(古典の潮汐の尺度 [N·m])。
//   (1) 固体の重力潮汐(受動 —— 順行の同期 Ω → n へ。Γ_eff ≥ 0 の口 N = Γ_eff (n − Ω)):
//       constQ(一定の Q の型): N = N_Q (n − Ω)/w・N_Q = (3/2)(k2/Q) X'(トルクの大きさは周波数に依らない)
//       constLag(一定の時間の遅れの型): N = (N_Q/w_anc)(n − Ω)(トルクは周波数に比例 —— 受け手の観測の滑り w_anc で constQ と同じトルクに揃える宣言: k2 Δt = k2/(Q σ_anc))
//   (2) 大気の熱潮汐(駆動 —— 同期から離す向き。N = N_0 F(σ)(Ω − n)/w・F ≥ 0。振幅は表面気圧に比例する宣言 N_0 = c_lat (M_☉/M)(R⁶/a³) ε p_s
//       〔ε = 半日の地表の気圧の潮の相対の振幅 × 位相の正弦・c_lat = 8π/5 は緯度の形 cos²φ の型。大気の質量 M_atm = 4πR²p_s/g で書けば N_0 = (2/5)(G M_☉ M_atm R²/a³) ε —— 同じ宣言〕):
//       constPhase(一定の位相の型): F = 1
//       relax(熱の緩和の型): F = 2σω_0/(σ² + ω_0²)(ω_0 は熱の緩和の周波数 —— σ = ω_0 で F = 1・σ ≪ ω_0 で σ に比例・σ ≫ ω_0 で 1/σ)
//       駆動の口の仕事は**供給**(日射の吸収が出どころ): P_日射 = N·(Ω − n) ≥ 0。口の熱は 0(力学の仕事は自転と軌道へ —— 受け手の仕事 N·Ω = 軌道の仕事 N·n + P_日射)。
//   (3) 地球との共鳴(金星の永久の四重極 B − A に地球の潮汐のトルク —— 会合周期で平均): 瞬間 N_z = −(3/2)(G M_⊕/r³)(B − A) sin 2(φ − λ)・
//       平均 ⟨N_z⟩ = −(3/2) G M_⊕ (B − A) |Z| sin(2φ_0 + arg Z)・Z = ⟨e^{2i(Ω_z t − λ(t))}/r³⟩(円・同じ面の軌道の宣言)。厳密な共鳴(Ω_z = n_外 + 2πj/S)でだけ平均が残る。
//       口のトルクは â の向き N_r â(−N_max ≤ N_r ≤ N_max)・熱 0・仕事 N_r s は地球–金星の軌道の口座から(保存の力 —— 熱にしない)。固定の幅 sqrt(2 N_max/C)(振り子の分離線)。
// ■ 帳簿(第326便d・第327便a の口座に足す): 銀河の中心の供給 P_G + 軌道の仕事(太陽–受け手・地球–金星)+ 日射の供給 P_日射 = Σ Q(銀河・K1・固体の潮汐の口)+ 自転の仕事。
//   L: 天体のスピンのトルクの和 + 外の口座(銀河の中心・軌道・遠方の枠)= 0。
// ■ 言わないこと: 金星の逆回転・内部熱の説明ではない。解いた振幅と共鳴の割合は「この口の型・この宣言の下で、釣り合いの点が観測の自転と同じになる条件」の記録(採らない)。
//   文献の値は桁として並べるだけ(合わせない)。負の振幅(駆動の口が受動の向き)は不採用で 0 に丸めない。
import * as E from './lib-w326d-axialheat.mjs';
import * as LS from './lib-w327a-axialsum.mjs';
export const LIB_VERSION = 'w327f-venustide-lib-1';
const { dot, add, sub, scale, norm, relD } = E;
const vec3 = (a) => Array.isArray(a) && a.length === 3 && a.every(Number.isFinite);
const DAY = 86400;
const YEAR = 365.25 * DAY;
export const G_SI = 6.6743e-11;   // SI の重力定数(文献の値 —— 古典の潮汐の尺度と共鳴の口の G)
export const AU = 1.495978707e11;

/** 宣言(走行の前に置く —— 結果を見て変えない) */
export const DECL = Object.freeze({
  families: Object.freeze(['E', 'S']), familyMain: 'E',   // 族 E(トルクの釣り合い)が主・族 S(角速度の和)は記録
  sources: Object.freeze(['now', 'J']), sourceMain: 'J',
  pGrid: LS.DECL.pGrid, pMain: LS.DECL.pMain, pAlso: 0,   // 銀河の応答のべき(第327便a と同じ格子 —— 銀河と K1 の口は K1 のまま)
  solidForms: Object.freeze([
    Object.freeze({ key: 'constQ', ja: '一定の Q の型(トルクの大きさ (3/2)(k2/Q)X′ —— 周波数に依らない)' }),
    Object.freeze({ key: 'constLag', ja: '一定の時間の遅れの型(トルクは周波数に比例 —— 受け手の観測の滑りで一定の Q の型と同じトルク)' }),
  ]),
  thermalForms: Object.freeze([
    Object.freeze({ key: 'constPhase', ja: '一定の位相の型(F = 1 —— 振幅は周波数に依らない)' }),
    Object.freeze({ key: 'relax', ja: '熱の緩和の型(F = 2σω_0/(σ² + ω_0²) —— σ = ω_0 で最大)' }),
  ]),
  relaxOmega0: Object.freeze([0.1, 0.3, 1, 3, 10]),   // ω_0/σ_obs,金星(熱の緩和の周波数と観測の潮汐の周波数の比 —— 格子)
  cLat: 8 * Math.PI / 5,   // 緯度の形 cos²φ の気圧の半日潮の係数(cos³φ·cos²φ の積分 16/15 × (3/2)π)
  // 文献の値の桁(本便は一次資料に当たっていない —— 比べる列。合わせない)
  lit: Object.freeze({
    k2: Object.freeze({ venus: LS.DECL.k2.venus, earth: LS.DECL.k2.earth, mars: 0.17, moon: 0.024 }),
    Q: Object.freeze({ venus: Object.freeze([10, 30, 100]), venusMain: 30, earth: LS.DECL.k2.earth / LS.DECL.k2Q.earth, mars: 90, moon: 38 }),
    surfacePressurePa: Object.freeze({ venus: 9.2e6, earth: 1.013e5, mars: 610, moon: 0 }),
    venusEpsRange: Object.freeze([1e-5, 1e-4]),   // 金星の地表の半日の気圧の潮の相対の振幅 × 位相の正弦の桁(δp ≈ 1e2〜1e3 Pa)
    C22: Object.freeze({ venus: 5.5e-7, earth: 1.574e-6, mars: 5.46e-5 }),   // 永久の四重極 (B − A)/(M R²) = 4 C22
    moonBAoverC: 2.28e-4,
    venusBAMult: Object.freeze([0.1, 1, 10, 100, 1000]),   // 金星の (B − A)/C の倍率の格子(文献の桁の 1 倍が主)
  }),
  // 観測の周期(文献の値 —— 恒星に対する周期・日)と軌道長半径(AU)
  obs: Object.freeze({ venusOrbitDays: 224.701, venusSpinDays: -243.025, venusObliquityDeg: 177.36, earthOrbitDays: 365.256, earthSpinDays: 0.99727, marsOrbitDays: 686.980, marsSpinDays: 1.02596,
    moonOrbitDays: 27.3217, aVenusAU: 0.723332, aEarthAU: 1.000001, aMarsAU: 1.523679 }),
  // 応答の時間の尺度 τ_0(Γ_i⁰ = I_i/τ_0 —— 銀河と K1 の口と、SI の潮汐の口を同じ式に並べるのに要る唯一のノブ。宣言の格子 + 年齢 + 無限〔古典の極限 —— 銀河と K1 の口のトルク 0〕)
  tau0: Object.freeze({ grid: Object.freeze([1e15, 1e16, 1e17, 1e18, 1e19, 1e20, 1e21]), ageGyr: 4.57, branch: Object.freeze(['inf', 'age']) }),
  shares: Object.freeze([0, 0.25, 0.5, 0.75, 1]),   // 地球との共鳴の割合 χ(駆動の口に要るトルクのうち共鳴が持つ割合 —— 固定できるかは N_max と幅で別に読む)
  branchRatios: Object.freeze([0, 0.25, 0.5, 0.75, 0.9, 1, 1.1, 1.5, 2, 4]),   // 熱潮汐の振幅 N_0/N_0,釣り合い(解の枝と安定の表)
  scan: Object.freeze({ decadesBelow: 4, decadesAbove: 3, step: 0.02, bisectIter: 80 }),   // 釣り合いの点を探す s の格子(同期の点と 0 の周りの符号つきの対数の格子)
  resQuad: 4096,   // 会合周期の平均の点の数(周期の被積分 —— 中点則)
  frozen: Object.freeze({ omega0Rules: Object.freeze(['ratio', 'absolute']), amplitude: 'psScaled', tauSet: Object.freeze(['inf', 'age']) }),   // 規則を固定する型(火星・地球–月へ)
  matchTol: 0.01,   // 「釣り合いの点が観測の自転の 1% の内で安定」を近いと数える
  syncTol: 0.01,   // 解の枝の名で「同期」と呼ぶ幅(観測の滑り abs(s − n·â) の 1% の内)
  order: Object.freeze(['venus', 'mars', 'triEM']),
  scaleLambda: 2,
});
export const TAU_AGE = DECL.tau0.ageGyr * 1e9 * YEAR;

/* ───────── 観測の周期(宣言の値から)───────── */
/** 自転比 k・1 公転に太陽を向く回数・太陽日・会合周期と比・厳密な 5:−4 の自転の周期 */
export function observedPeriods(o = DECL.obs) {
  const nV = 2 * Math.PI / (o.venusOrbitDays * DAY), nE = 2 * Math.PI / (o.earthOrbitDays * DAY), sV = 2 * Math.PI / (o.venusSpinDays * DAY);
  const k = o.venusOrbitDays / o.venusSpinDays, Nsun = 1 - k, solarDays = o.venusOrbitDays / Nsun, synodicDays = 1 / (1 / o.venusOrbitDays - 1 / o.earthOrbitDays);
  const omRes = 5 * nE - 4 * nV, resDays = 2 * Math.PI / omRes / DAY;
  // 内合の間の金星の自転と地球に対する自転(恒星に対する回数・地球の方向に対する回数)
  const turnsSpin = synodicDays / o.venusSpinDays, turnsEarth = synodicDays / o.earthOrbitDays;
  return { k, Nsun, solarDays, synodicDays, ratio: synodicDays / solarDays, omRes, resDays, offset: sV - omRes, offsetRel: (sV - omRes) / Math.abs(omRes), nV, nE, sV,
    turnsSpin, turnsEarth, turnsRelEarth: turnsSpin - turnsEarth };
}

/* ───────── 口(純関数)───────── */
/** 古典の潮汐の尺度 X' = G M_r² R⁵/a⁶ [N·m] */
export const tidalScale = ({ Mr, R, a }) => G_SI * Mr * Mr * Math.pow(R, 5) / Math.pow(a, 6);
/** 固体の重力潮汐(受動)。入力 Omega・n(ベクトル)・NQ = (3/2)(k2/Q)X'・wAnc(constLag の揃えの滑り)。出力: トルク・熱・軌道の仕事・受け手の仕事・Γ_eff */
export function solidPort(form, { Omega, n, NQ, wAnc }) {
  if (!vec3(Omega) || !vec3(n) || !(NQ >= 0) || !Number.isFinite(NQ)) throw new RangeError('solidPort: Ω・n は 3 成分・N_Q は 0 以上の有限の数');
  const slip = sub(n, Omega), w = norm(slip);
  let G;
  if (form === 'constQ') G = w > 0 ? NQ / w : 0;
  else if (form === 'constLag') { if (!(wAnc > 0)) throw new RangeError('solidPort: constLag は揃えの滑り wAnc > 0'); G = NQ / wAnc; }
  else throw new RangeError('solidPort: 型 ' + form);
  const torque = scale(slip, G), heat = G * w * w, orbitWork = dot(torque, n), recvWork = dot(torque, Omega);
  return { kind: 'solid', form, torque, Gamma: G, w, heat, orbitWork, solar: 0, recvWork, residual: orbitWork - recvWork - heat, roundScale: G * (norm(n) + norm(Omega)) };
}
/** 熱潮汐の周波数の形 F(σ)(σ = 2w ≥ 0) */
export function thermalShape(form, sigma, omega0) {
  if (!(sigma >= 0)) throw new RangeError('thermalShape: σ ≥ 0');
  if (form === 'constPhase') return 1;
  if (form === 'relax') { if (!(omega0 > 0)) throw new RangeError('thermalShape: ω_0 > 0'); return 2 * sigma * omega0 / (sigma * sigma + omega0 * omega0); }
  throw new RangeError('thermalShape: 型 ' + form);
}
/** 大気の熱潮汐(駆動)。N = N_0 F(σ)(Ω − n)/w・日射の供給 P = N·(Ω − n) ≥ 0・熱 0 */
export function thermalPort(form, { Omega, n, N0, omega0 }) {
  if (!vec3(Omega) || !vec3(n) || !(N0 >= 0) || !Number.isFinite(N0)) throw new RangeError('thermalPort: Ω・n は 3 成分・N_0 は 0 以上の有限の数(負の振幅は駆動の口ではない)');
  const slip = sub(Omega, n), w = norm(slip), F = thermalShape(form, 2 * w, omega0), G = w > 0 ? N0 * F / w : 0, torque = scale(slip, G);
  const orbitWork = dot(torque, n), recvWork = dot(torque, Omega), solar = dot(torque, slip);
  return { kind: 'thermal', form, torque, F, w, sigma: 2 * w, heat: 0, orbitWork, solar, recvWork, residual: orbitWork + solar - recvWork, roundScale: G * (norm(n) + norm(Omega)) };
}
/** 共鳴の口(軸の向きのトルク N_r —— 保存の力: 熱 0・仕事は軌道の口座から) */
export function resPort({ Omega, a, Nr }) {
  if (!vec3(Omega) || !vec3(a) || !Number.isFinite(Nr)) throw new RangeError('resPort: 入力');
  const torque = scale(a, Nr), recvWork = dot(torque, Omega);
  return { kind: 'res', torque, heat: 0, orbitWork: recvWork, solar: 0, recvWork, residual: 0, roundScale: Math.abs(Nr) };
}
/** 振幅と気圧の換算(N_0 = c_lat (M_☉/M)(R⁶/a³) ε p_s) */
export function thermalN0({ eps, ps, Msun, M, R, a, cLat = DECL.cLat }) { return cLat * (Msun / M) * Math.pow(R, 6) / Math.pow(a, 3) * eps * ps; }
export function thermalEps({ N0, ps, Msun, M, R, a, cLat = DECL.cLat }) { const u = cLat * (Msun / M) * Math.pow(R, 6) / Math.pow(a, 3) * ps; return u > 0 ? N0 / u : null; }

/* ───────── 共鳴の係数(会合周期で平均)———————— */
/** 2 つの円軌道(同じ面・内合で t = 0)。受け手 r の自転 Om(軌道の法線の向き —— 符号つき)。Z = ⟨e^{2i(Om t − λ)}/r³⟩(中点則 M 点)。
 *  厳密な共鳴は Om = n_外 + 2πj/S(λ の 1 会合周期の進みは外の惑星の n_外 S —— 外の軌道から見た内の軌道は巻かない) */
export function resonanceZ({ aR, nR, aP, nP, Om, M = DECL.resQuad }) {
  if (![aR, nR, aP, nP, Om].every(Number.isFinite) || !(aR > 0 && aP > 0) || nR === nP) throw new RangeError('resonanceZ: 入力');
  const S = 2 * Math.PI / Math.abs(nR - nP);
  let re = 0, im = 0, rmin = Infinity, rmax = 0;
  for (let k = 0; k < M; k++) {
    const t = (k + 0.5) * S / M, xr = aR * Math.cos(nR * t), yr = aR * Math.sin(nR * t), xp = aP * Math.cos(nP * t), yp = aP * Math.sin(nP * t);
    const dx = xp - xr, dy = yp - yr, r = Math.hypot(dx, dy), lam = Math.atan2(dy, dx), ph = 2 * (Om * t - lam), w = 1 / (r * r * r);
    re += w * Math.cos(ph); im += w * Math.sin(ph); rmin = Math.min(rmin, r); rmax = Math.max(rmax, r);
  }
  re /= M; im /= M;
  return { S, re, im, abs: Math.hypot(re, im), arg: Math.atan2(im, re), rmin, rmax };
}
/** 最も近い厳密な共鳴の自転(Om_res = n_外 + 2πj/S —— j は整数)*/
export function nearestCommensurate({ nR, nP, Om }) {
  const S = 2 * Math.PI / Math.abs(nR - nP), nOut = Math.abs(nR) < Math.abs(nP) ? nR : nP, j = Math.round((Om - nOut) * S / (2 * Math.PI));
  return { S, nOut, j, omRes: nOut + 2 * Math.PI * j / S, offset: Om - (nOut + 2 * Math.PI * j / S) };
}
/** 衛星の 1:1(受け手が起潮天体の周りの円軌道 —— 方向は n t で回る)の係数: |Z| = 1/a³ */
export function satelliteZ({ a }) { if (!(a > 0)) throw new RangeError('satelliteZ: a > 0'); return { abs: 1 / (a * a * a), arg: 0 }; }
export const resonanceMax = ({ GM, BA, absZ }) => 1.5 * GM * BA * absZ;
export const librationHalfWidth = ({ Nmax, C }) => Math.sqrt(2 * Nmax / C);

/* ───────── 系(銀河・K1 の口は第327便a の evaluate —— 足す口は extra)———————— */
// bodies: 第327便a の系の形(gal と k1 の口だけ)・prm: 第327便a の prm(gamma0 = I/τ_0)か null(τ_0 = ∞ —— 銀河と K1 の口のトルク 0)・
// extra: {key: [{kind:'solid', form, n, NQ, wAnc} | {kind:'thermal', form, n, N0, omega0} | {kind:'res', Nr}]}
export function evaluateAll(bodies, prm, extra = {}) {
  const base = prm ? LS.evaluate(bodies, prm) : null;
  let PG = 0, PK1 = 0, QLS = 0, Porb = 0, Psolar = 0, Pres = 0, Qsolid = 0, Kdot = 0, maxClose = 0, sumAbs = 0;
  const Lext = { galaxyCenter: base ? base.ledger.L.galaxyCenter : [0, 0, 0], farFrameK1: base ? base.ledger.L.farFrameK1 : [0, 0, 0], orbits: [0, 0, 0], farFrameHold: [0, 0, 0] };
  if (base) { PG = base.ledger.galaxySupply; PK1 = base.ledger.k1Draw; QLS = base.ledger.heat; maxClose = base.ledger.portCloseMaxRel; }
  let Lspin = [0, 0, 0], Lscale = 0;
  const rows = bodies.map((b, i) => {
    const Om = scale(b.a, b.s), R = base ? base.rows[i] : null, react = base ? base.react[i] : 0;
    let Nsum = R ? R.torqueSum.slice() : [0, 0, 0], sc = R ? R.alongScale : Math.abs(react);   // 丸めの尺度(第327便a の Γ|ν| + Γ|s| と同じ型 —— 足す口は roundScale)
    if (R) { for (const p of R.ports) Lscale = Math.max(Lscale, norm(p.torque)); }
    const ports = (extra[b.key] || []).map((q) => {
      let r;
      if (q.kind === 'solid') r = solidPort(q.form, { Omega: Om, n: q.n, NQ: q.NQ, wAnc: q.wAnc });
      else if (q.kind === 'thermal') r = thermalPort(q.form, { Omega: Om, n: q.n, N0: q.N0, omega0: q.omega0 });
      else if (q.kind === 'res') r = resPort({ Omega: Om, a: b.a, Nr: q.Nr });
      else throw new RangeError('evaluateAll: 口の種類 ' + q.kind);
      r.src = q.src || null; r.torqueAlong = dot(r.torque, b.a);
      Nsum = add(Nsum, r.torque); sc += r.roundScale; Lscale = Math.max(Lscale, norm(r.torque));
      if (q.kind === 'res') Pres += r.orbitWork; else Porb += r.orbitWork;
      Psolar += r.solar; Qsolid += r.heat;
      Lext.orbits = sub(Lext.orbits, r.torque);
      maxClose = Math.max(maxClose, Math.abs(r.residual) / Math.max(Math.abs(r.orbitWork), Math.abs(r.recvWork), Math.abs(r.heat), Math.abs(r.solar), 1e-300));
      return r;
    });
    const along = dot(Nsum, b.a) + react, par = dot(Nsum, b.a), hold = scale(sub(Nsum, scale(b.a, par)), -1), reactVec = scale(b.a, react);
    Lext.farFrameHold = sub(Lext.farFrameHold, hold);
    Lspin = add(Lspin, add(add(Nsum, reactVec), hold));
    Kdot += along * b.s; sumAbs += sc;
    return { key: b.key, s: b.s, a: b.a, along, alongScale: sc, alongRel: Math.abs(along) / Math.max(sc, 1e-300), torqueSum: Nsum, reaction: react, hold, holdWork: dot(hold, Om), lsPorts: R ? R.ports : [], ports };
  });
  const Q = QLS + Qsolid, res = PG + Porb + Psolar + Pres - Q - Kdot;
  const Ltot = add(Lspin, add(add(Lext.galaxyCenter, Lext.farFrameK1), add(Lext.orbits, Lext.farFrameHold)));
  const ledger = { galaxySupply: PG, k1Draw: PK1, orbitWork: Porb, resOrbitWork: Pres, solarSupply: Psolar, heatPassiveLS: QLS, heatSolid: Qsolid, heat: Q, radiation: Q, spinPower: Kdot,
    residual: res, residualRel: Math.abs(res) / Math.max(Math.abs(PG), Math.abs(Porb), Math.abs(Psolar), Math.abs(Pres), Math.abs(Q), Math.abs(Kdot), 1e-300),
    k1TransferRel: base ? relD(base.ledger.k1Transfer.draw, base.ledger.k1Transfer.sourceReactionWork) : 0, portCloseMaxRel: maxClose,
    LTotalRel: norm(Ltot) / Math.max(Lscale, 1e-300), holdWorkMaxRel: Math.max(0, ...rows.map((r) => Math.abs(r.holdWork) / Math.max(r.alongScale * Math.max(Math.abs(r.s), 1e-300), 1e-300))) };
  return { rows, ledger, base };
}
/** 受け手 key の自転を s に置き換えた系の軸の向きの残差(釣り合いの点の探索) */
export function alongAt(bodies, prm, extra, key, s) {
  const bb = bodies.map((b) => (b.key === key ? Object.assign({}, b, { s }) : b)), ev = evaluateAll(bb, prm, extra), r = ev.rows.find((q) => q.key === key);
  return { along: r.along, scale: r.alongScale };
}

/* ───────── 釣り合いの点と安定(符号つきの対数の格子 —— 中心は同期の点と 0)———————— */
export function scanGrid(centers, ref, G = DECL.scan) {
  const set = new Set();
  const lo = Math.log10(Math.abs(ref)) - G.decadesBelow, hi = Math.log10(Math.abs(ref)) + G.decadesAbove;
  for (const c of centers) {
    set.add(c);
    for (let e = lo; e <= hi + 1e-9; e += G.step) { const d = Math.pow(10, e); set.add(c + d); set.add(c - d); }
  }
  return [...set].filter(Number.isFinite).sort((a, b) => a - b);
}
/** fn(s) → {along, scale}。符号が変わる隣り合う点を二分法で(線形)。零点の向き(+ → − は安定 —— 自転が増すとトルクが負)。
 *  全部の点で abs(along) が scale の 1e-12 の内なら中立(縮退) */
export function equilibria(fn, xs, iter = DECL.scan.bisectIter) {
  const vals = xs.map((x) => fn(x)), out = [];
  const neutral = vals.every((v) => Math.abs(v.along) <= 1e-12 * Math.max(v.scale, 1e-300));
  if (neutral) return { neutral: true, roots: [], vals: vals.map((v) => v.along) };
  for (let k = 0; k < xs.length; k++) {   // 格子の点でちょうど 0(同期の点など)—— 向きは隣の点の符号
    if (vals[k].along !== 0 || k === 0 || k === xs.length - 1) continue;
    const fp = vals[k - 1].along, fq = vals[k + 1].along;
    if (Math.sign(fp) !== Math.sign(fq) && fp !== 0 && fq !== 0) out.push({ s: xs[k], stable: fp > 0 && fq < 0, kind: 'zero', lo: xs[k - 1], hi: xs[k + 1] });
  }
  for (let k = 0; k + 1 < xs.length; k++) {
    const fa = vals[k].along, fb = vals[k + 1].along;
    if (!(Number.isFinite(fa) && Number.isFinite(fb)) || fa === 0 || fb === 0 || Math.sign(fa) === Math.sign(fb)) continue;
    let a = xs[k], b = xs[k + 1], ga = fa;
    for (let it = 0; it < iter; it++) { const m = 0.5 * (a + b), gm = fn(m).along; if (gm === 0) { a = b = m; break; } if (Math.sign(gm) === Math.sign(ga)) { a = m; ga = gm; } else b = m; }
    const x = 0.5 * (a + b), v0 = Math.max(Math.abs(fa), Math.abs(fb)), v1 = Math.abs(fn(x).along);
    out.push({ s: x, stable: fa > 0 && fb < 0, kind: v1 <= 1e-6 * v0 ? 'zero' : 'jump', lo: xs[k], hi: xs[k + 1] });
  }
  return { neutral: false, roots: out, vals: vals.map((v) => v.along) };
}
/** 解の枝の名(受け手の同期の点 nAlong・自転 s) */
export function branchOf(s, nAlong, tol) {
  const x = s - nAlong;
  if (Math.abs(x) <= tol) return 'sync';
  if (x < 0) return s < 0 ? 'retro' : 'slowPro';
  return 'fastPro';
}

/* ───────── 振り子(固定の幅の確かめ —— 純関数の場面)———————— */
/** C γ̈ = −N_max sin 2γ(γ は長い軸と起潮天体の方向の角の共鳴の角)を RK4 で: γ̇(0) = v0・γ(0) = 0。|γ| の最大と巻いたか */
export function pendulum({ Nmax, C, v0, span, steps }) {
  const f = (g) => -Nmax * Math.sin(2 * g) / C;
  let g = 0, v = v0, gmax = 0;
  const h = span / steps;
  for (let k = 0; k < steps; k++) {
    const k1g = v, k1v = f(g), k2g = v + 0.5 * h * k1v, k2v = f(g + 0.5 * h * k1g), k3g = v + 0.5 * h * k2v, k3v = f(g + 0.5 * h * k2g), k4g = v + h * k3v, k4v = f(g + h * k3g);
    g += h / 6 * (k1g + 2 * k2g + 2 * k3g + k4g); v += h / 6 * (k1v + 2 * k2v + 2 * k3v + k4v); gmax = Math.max(gmax, Math.abs(g));
  }
  return { gmax, circulated: gmax > Math.PI / 2 };
}

/* ───────── 純関数の場面(QA lint.venusTide327f と器の P 段)———————— */
export function pureScenes() {
  const S = {};
  const a = [0, 0, 1], n = [0, Math.sin(0.04) * 3e-7, Math.cos(0.04) * 3e-7];
  // ① 固体の潮汐(受動): 一定の Q はどの滑りでもトルクの大きさ N_Q・一定の時間の遅れは揃えの滑りで同じトルク・どちらも同期へ(軸の向きのトルクの符号が滑りと逆)・熱 ≥ 0・閉じ
  { const NQ = 2.5e16, rows = [-6e-7, -1e-7, 2e-8, 4e-7].map((s) => { const Om = scale(a, s), q = solidPort('constQ', { Omega: Om, n, NQ }), wA = norm(sub(n, Om)), l = solidPort('constLag', { Omega: Om, n, NQ, wAnc: wA });
      const l2 = solidPort('constLag', { Omega: Om, n, NQ, wAnc: 2 * wA });
      return { s, x: s - dot(n, a), magQ: norm(q.torque), alongQ: dot(q.torque, a), sameAtAnchor: norm(sub(q.torque, l.torque)) / NQ, halfAt2: norm(l2.torque) / norm(l.torque), heatQ: q.heat, heatL: l.heat,
        closeRel: Math.max(Math.abs(q.residual), Math.abs(l.residual)) / Math.max(q.heat, Math.abs(q.recvWork), Math.abs(q.orbitWork)) }; });
    S.solid = { NQ, rows }; }
  // ② 熱潮汐(駆動): 軸の向きのトルクの符号が滑りと同じ(同期から離す)・日射の供給 ≥ 0・熱 0・閉じ・緩和の型は σ = ω_0 で F = 1・σ → 0 で 0・σ ≫ ω_0 で 2ω_0/σ
  { const N0 = 3e16, w0 = 1e-6, rows = [-6e-7, -1e-7, 2e-8, 4e-7].map((s) => { const Om = scale(a, s), c = thermalPort('constPhase', { Omega: Om, n, N0 }), r = thermalPort('relax', { Omega: Om, n, N0, omega0: w0 });
      return { s, x: s - dot(n, a), alongC: dot(c.torque, a), solarC: c.solar, solarR: r.solar, heat: c.heat + r.heat, closeRel: Math.max(Math.abs(c.residual), Math.abs(r.residual)) / Math.max(Math.abs(c.recvWork), Math.abs(c.orbitWork), c.solar) }; });
    S.thermal = { rows, Fpeak: thermalShape('relax', w0, w0), Fzero: thermalShape('relax', 0, w0), Fhigh: thermalShape('relax', 1000 * w0, w0) * 1000 / 2, Fconst: thermalShape('constPhase', 123, null) };
    // 振幅と気圧の往復・大気の質量の書き方と同じ
    const prm = { Msun: 2e30, M: 5e24, R: 6e6, a: 1.1e11, ps: 9e6 }, N1 = thermalN0(Object.assign({ eps: 3e-5 }, prm)), e1 = thermalEps(Object.assign({ N0: N1 }, prm));
    const g = G_SI * prm.M / (prm.R * prm.R), Matm = 4 * Math.PI * prm.R * prm.R * prm.ps / g, N2 = 0.4 * G_SI * prm.Msun * Matm * prm.R * prm.R / Math.pow(prm.a, 3) * 3e-5;
    S.thermal.ampRoundTrip = relD(e1, 3e-5); S.thermal.ampMassForm = relD(N1, N2); }
  // ③ 釣り合いの点(一定の時間の遅れ + 熱の緩和 —— 同じ軸・n ∥ â): 解析の σ* = sqrt(2N_0ω_0/K − ω_0²)(K = N_Q/w_anc —— 滑り x で N = −K x + N_0 F(2|x|) sgn x)と格子の探索
  { const na = [0, 0, 3e-7], K = 1e23, w0 = 2e-7, N0 = 6e16, wAnc = 1;
    const fn = (s) => { const Om = scale(a, s), p = solidPort('constLag', { Omega: Om, n: na, NQ: K * wAnc, wAnc }), q = thermalPort('relax', { Omega: Om, n: na, N0, omega0: w0 }); return { along: dot(add(p.torque, q.torque), a), scale: norm(p.torque) + norm(q.torque) }; };
    // 滑り x の釣り合い: K x = 2N_0 F... —— σ = 2|x| で F = 2σω_0/(σ²+ω_0²) → K|x| = N_0·4|x|ω_0/(4x² + ω_0²) → 4x² = 4N_0ω_0/K − ω_0²
    const xs = Math.sqrt((4 * N0 * w0 / K - w0 * w0) / 4), eq = equilibria(fn, scanGrid([3e-7, 0], 3e-7)), roots = eq.roots.filter((r) => r.kind === 'zero');
    const near = (x) => roots.find((r) => Math.abs(r.s - x) <= 1e-9 * 3e-7);
    S.branch = { xStar: xs, nRoots: roots.length, retro: near(3e-7 - xs), fast: near(3e-7 + xs), sync: near(3e-7), syncUnstableExpected: 4 * N0 / w0 > K }; }
  // ④ 縮退(一定の Q + 一定の位相 —— 振幅が等しい): 全部の s でトルク 0 → 中立
  { const NQ = 2e16, fn = (s) => { const Om = scale(a, s), p = solidPort('constQ', { Omega: Om, n, NQ }), q = thermalPort('constPhase', { Omega: Om, n, N0: NQ }); return { along: dot(add(p.torque, q.torque), a), scale: norm(p.torque) + norm(q.torque) }; };
    const eq = equilibria(fn, scanGrid([dot(n, a), 0], 3e-7));
    const fn2 = (s) => { const Om = scale(a, s), p = solidPort('constQ', { Omega: Om, n, NQ }), q = thermalPort('constPhase', { Omega: Om, n, N0: 0.5 * NQ }); return { along: dot(add(p.torque, q.torque), a), scale: norm(p.torque) + norm(q.torque) }; };
    const eq2 = equilibria(fn2, scanGrid([dot(n, a), 0], 3e-7));
    S.degenerate = { neutral: eq.neutral, weakRoots: eq2.roots.filter((r) => r.kind === 'zero').map((r) => ({ s: r.s, stable: r.stable })), syncAlong: dot(n, a) }; }
  // ⑤ 共鳴の係数: 宣言の観測の周期の 5:−4 の厳密な共鳴で被積分が周期的(M と 2M が丸めの内)・衛星の 1:1 は 1/a³・観測の周期の比 ≈ 5
  { const o = DECL.obs, P = observedPeriods(o), aV = o.aVenusAU * AU, aE = o.aEarthAU * AU;
    const z1 = resonanceZ({ aR: aV, nR: P.nV, aP: aE, nP: P.nE, Om: P.omRes, M: 2048 }), z2 = resonanceZ({ aR: aV, nR: P.nV, aP: aE, nP: P.nE, Om: P.omRes, M: 4096 });
    const zOff = resonanceZ({ aR: aV, nR: P.nV, aP: aE, nP: P.nE, Om: P.omRes + 2 * Math.PI * 40 / z1.S, M: 4096 }), nc = nearestCommensurate({ nR: P.nV, nP: P.nE, Om: P.sV });
    S.res = { ratio: P.ratio, k: P.k, Nsun: P.Nsun, solarDays: P.solarDays, synodicDays: P.synodicDays, resDays: P.resDays, quadRel: relD(z1.abs, z2.abs), absZ: z2.abs, invRmin3: 1 / Math.pow(z2.rmin, 3),
      rminAU: z2.rmin / AU, offRel: zOff.abs / z2.abs, ncJ: nc.j, ncRel: relD(nc.omRes, P.omRes), sat: satelliteZ({ a: 2 }).abs, turnsRelEarth: P.turnsRelEarth }; }
  // ⑥ 系の帳簿(2 天体 —— 銀河・K1・固体の潮汐・熱潮汐・共鳴の口): 解いた振幅で軸の向きの釣り合い・帳簿・L・日射の供給 ≥ 0・τ_0 の倍率で銀河と K1 の口だけが動く
  { const bodies = [{ key: 'sun', s: 2e-6, a: [0, 0, 1], f: 1, Rd: 1, ports: [{ kind: 'gal' }] },
      { key: 'P', s: -3e-7, a: [Math.sin(0.03), 0, Math.cos(0.03)], f: 1, Rd: 1e-6, ports: [{ kind: 'gal' }, { kind: 'k1', src: 'sun', t: [0, 1e-3, -2e-3] }] }];
    const I = { sun: 1e46, P: 5e37 }, prmOf = (tau) => ({ family: 'E', g: [0.3, 0, -0.95], gamma0: { sun: I.sun / tau, P: I.P / tau }, beta: {}, alloc: LS.DECL.allocations.equal });
    const A = LS.solve(bodies, prmOf(1)).A, nP = [1e-8, 0, 3.2e-7];
    const mk = (N0, Nr) => ({ P: [{ kind: 'solid', form: 'constQ', src: 'sun', n: nP, NQ: 2e16 }, { kind: 'thermal', form: 'relax', src: 'sun', n: nP, N0, omega0: 5e-7 }, { kind: 'res', src: 'E', Nr }] });
    const tau = 1e17, prm = Object.assign(prmOf(tau), { A }), e0 = evaluateAll(bodies, prm, mk(0, 0));
    const u = dot(thermalPort('relax', { Omega: scale(bodies[1].a, bodies[1].s), n: nP, N0: 1, omega0: 5e-7 }).torque, bodies[1].a);   // 単位の振幅の軸の向きのトルク(差を取らない —— 丸め)
    const chi = 0.25, D = -e0.rows[1].along, N0 = (1 - chi) * D / u, ev = evaluateAll(bodies, prm, mk(N0, chi * D)), r = ev.rows[1];
    const evInf = evaluateAll(bodies, null, mk(N0, chi * D)), e2 = evaluateAll(bodies, Object.assign(prmOf(tau * 2), { A }), mk(N0, chi * D));
    S.system = { N0, chi, alongRel: r.alongRel, sunAlongRel: ev.rows[0].alongRel, ledgerRel: ev.ledger.residualRel, LRel: ev.ledger.LTotalRel, close: ev.ledger.portCloseMaxRel, k1: ev.ledger.k1TransferRel,
      solar: ev.ledger.solarSupply, heat: ev.ledger.heat, resWork: ev.ledger.resOrbitWork, infLedgerRel: evInf.ledger.residualRel, infLRel: evInf.ledger.LTotalRel, infGal: evInf.ledger.galaxySupply,
      tauHalfGal: e2.ledger.galaxySupply / ev.ledger.galaxySupply, tauSolidSame: relD(e2.rows[1].ports[0].torqueAlong, r.ports[0].torqueAlong), positiveN0: N0 > 0 }; }
  // ⑦ 振り子の分離線: 幅の 0.95 倍で巻かない・1.05 倍で巻く
  { const Nmax = 1e15, C = 6e37, wdt = librationHalfWidth({ Nmax, C }), span = 6 * Math.PI / (wdt * 0.5);
    S.pendulum = { width: wdt, inside: pendulum({ Nmax, C, v0: 0.95 * wdt, span, steps: 20000 }).circulated, outside: pendulum({ Nmax, C, v0: 1.05 * wdt, span, steps: 20000 }).circulated }; }
  // ⑧ 入力の拒否(負の振幅・負の N_Q・constLag の揃えの滑り 0・負の σ)
  S.reject = [() => thermalPort('constPhase', { Omega: [0, 0, 1], n: [0, 0, 0], N0: -1 }), () => solidPort('constQ', { Omega: [0, 0, 1], n: [0, 0, 0], NQ: -1 }), () => solidPort('constLag', { Omega: [0, 0, 1], n: [0, 0, 0], NQ: 1, wAnc: 0 }),
    () => thermalShape('relax', -1, 1), () => solidPort('other', { Omega: [0, 0, 1], n: [0, 0, 0], NQ: 1 })].every((f) => { try { f(); return false; } catch (e) { return true; } });
  return S;
}
export function pureGates(S) {
  const close = (x, y, t = 1e-12) => Math.abs(x - y) <= t * Math.max(1, Math.abs(x), Math.abs(y));
  return {
    solidPassive: S.solid.rows.every((r) => close(r.magQ, S.solid.NQ, 1e-12) && Math.sign(r.alongQ) === -Math.sign(r.x) && r.sameAtAnchor <= 1e-12 && close(r.halfAt2, 0.5) && r.heatQ > 0 && r.heatL > 0 && r.closeRel <= 1e-12),
    thermalDriving: S.thermal.rows.every((r) => Math.sign(r.alongC) === Math.sign(r.x) && r.solarC > 0 && r.solarR > 0 && r.heat === 0 && r.closeRel <= 1e-12)
      && close(S.thermal.Fpeak, 1) && S.thermal.Fzero === 0 && Math.abs(S.thermal.Fhigh - 1) <= 1e-5 && S.thermal.Fconst === 1 && S.thermal.ampRoundTrip <= 1e-12 && S.thermal.ampMassForm <= 1e-12,
    branchesAnalytic: S.branch.nRoots === 3 && !!S.branch.retro && !!S.branch.fast && !!S.branch.sync && S.branch.retro.stable && S.branch.fast.stable && S.branch.syncUnstableExpected && S.branch.sync.stable === false,
    degenerateNeutral: S.degenerate.neutral === true && S.degenerate.weakRoots.length === 1 && S.degenerate.weakRoots[0].stable === true && Math.abs(S.degenerate.weakRoots[0].s - S.degenerate.syncAlong) <= 1e-3 * S.degenerate.syncAlong,
    resonanceCoefficient: S.res.quadRel <= 1e-12 && Math.abs(S.res.ratio - 5) < 0.01 && Math.abs(S.res.k + 0.9246) < 1e-4 && S.res.absZ > 0 && S.res.absZ < S.res.invRmin3 && S.res.offRel < 1e-3 && S.res.ncJ === -4
      && S.res.ncRel <= 1e-12 && S.res.sat === 0.125 && Math.abs(S.res.turnsRelEarth + 4) < 0.01,
    systemLedger: S.system.positiveN0 && S.system.alongRel <= 1e-12 && S.system.sunAlongRel <= 1e-12 && S.system.ledgerRel <= 1e-12 && S.system.LRel <= 1e-12 && S.system.close <= 1e-12 && S.system.k1 <= 1e-12
      && S.system.solar > 0 && S.system.heat > 0 && S.system.infLedgerRel <= 1e-12 && S.system.infLRel <= 1e-12 && S.system.infGal === 0 && close(S.system.tauHalfGal, 0.5) && S.system.tauSolidSame === 0,
    pendulumSeparatrix: S.pendulum.inside === false && S.pendulum.outside === true,
    rejectInputs: S.reject === true,
  };
}
