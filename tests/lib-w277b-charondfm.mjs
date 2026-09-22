// 第277便b(原仮定者の裁定(第67報)(1))— **同一観測解の入力**と、その 2D 射影・重心配分の純関数。
//
// ■ ここにあるのは「一次資料の表・列の転記」と「決定論的な換算」だけである
//   ・数値を**この器で作らない**(丸めない・当てない・探索しない)。
//   ・**残差がゼロになる ε・a・f を探索して採用しない**(第276便b と同じ禁止)。
//   ・出典は取得依頼 C の回答(2 系統の外部調査)のうち **両系統で一致した行だけ**を採る。
//     状態ベクトルは 72 行すべてが 2 系統で完全一致した(この器が持つのは冥王星・カロンの 2 元期ぶん)。
//
// ■ 単位(**精密単位** L=5・T=1・M=24 —— 規約 L−T=4・M+2T−3L=11 を満たす)
//   1 単位 = 10⁵ m(=100 km)/ 10 s / 10²⁴ kg。したがって
//   速度 1 単位 = 10⁴ m/s(= ❄️ の L=6・T=2 と同じ)・**c₀=3×10⁴ と κ=G/c₀² は ❄️ と同値**、
//   **D₀ の 1 単位 = 10¹⁹ kg/m も ❄️ と同値**(M−L がどちらも 19)である。
//   **dt の意味だけが 10 倍細かくなる**(同じ物理時間を刻むには dt を 10 倍にする)。
//
// ■ 質量は GM/G で作る(**G は内蔵の 6.674 のまま** —— AL23: G を CODATA へ動かす便ではない)
export const CHARON_DFM_VERSION = 'w277b-charondfm-1';

/** Brozović & Jacobson (2024) AJ 167 256 Table 8(GM・km³/s²)。Kerberos/Styx は unconstrained。 */
export const GM_2024 = {
  source: 'Brozovic M. & Jacobson R.A. 2024 AJ 167 256 Table 8',
  unit: 'km^3/s^2',
  Pluto: { value: 869.3, sigma: 0.4 },
  Charon: { value: 106.1, sigma: 0.3 },
  Nix: { value: 0.00150, sigma: null },
  Hydra: { value: 0.00201, sigma: null },
  Kerberos: { value: null, sigma: null, note: 'unconstrained' },
  Styx: { value: null, sigma: null, note: 'unconstrained' },
};

/** 同 Table 10(1800–2200 の osculating 平均。trailing の散らばりは formal 1σ ではない)。 */
export const ELEM_2024 = {
  source: 'Brozovic M. & Jacobson R.A. 2024 AJ 167 256 Table 10',
  Charon: { aKm: 19595.764, ecc: 0.000161, periodSec: 551855.8944 },
  note: '400 年平均。周期 551855.8944 s は「暦の平均」であって Buie 2012 の二体 P とは別の量である',
};

/** Buie et al. (2012) の二体ケプラー周期(**判定行**)。元期 JDT 2452600.5・J2000・a=19573±2 km・e 固定 0。 */
export const BUIE_2012 = {
  source: 'Buie M.W. et al. 2012 AJ 144 15 Table 5',
  periodSec: 551856.43872, sigmaSec: 0.02592,
  aKm: 19573, aSigmaKm: 2, ecc: 0, eccUpper: 7.5e-5,
  note: 'two-body Keplerian period(sidereal/synodic の語は原表に無い)。1992–2010 HST',
};

/** Horizons の osculating 兄弟量(**中心=冥王星系重心**・a は重心基準 —— 判定行と混ぜない)。 */
export const HORIZONS_PR = {
  source: 'JPL Horizons PLU060/DE440 elements (center = Pluto Barycenter @9)',
  epochA: { jdTdb: 2452600.5, periodSec: 551850.6774, aKm: 17464.17 },
  epochB: { jdTdb: 2457217.5, periodSec: 551853.0700, aKm: 17464.22 },
};

/**
 * JPL Horizons PLU060/DE440 の状態ベクトル(中心 = Pluto Barycenter @9・ICRF/J2000 equatorial・
 * km, km/s・TDB)。**2 系統の外部調査で完全一致した行だけ**を持つ。σ は公表されていない。
 */
export const HORIZONS_STATE = {
  source: 'JPL Horizons PLU060/DE440 vectors (center = Pluto Barycenter @9, ICRF, km & km/s, TDB)',
  covariance: 'not_published',
  epochA: {
    jdTdb: 2452600.5,
    Pluto: { r: [1.370860133507983e+03, 1.097857913042653e+03, -1.208110104842008e+03],
      v: [-8.639354888307112e-03, -1.102398237662285e-02, -1.981641679170623e-02] },
    Charon: { r: [-1.123218444101707e+04, -8.995444528122283e+03, 9.897987186425396e+03],
      v: [7.078521538859640e-02, 9.032347757027705e-02, 1.623640495333425e-01] },
    Nix: { r: [9.764144357901037e+03, 1.998832854943163e+03, -4.761461969021996e+04],
      v: [-1.007596311396386e-01, -9.769235923382032e-02, -2.513941680072823e-02] },
    Hydra: { r: [3.375751580992690e+03, 1.303119640134069e+04, 6.351970466357662e+04],
      v: [8.993666467370454e-02, 8.123237137057272e-02, -2.061381818398100e-02] },
    Kerberos: { r: [4.099795086397774e+04, 3.530905838766645e+04, -1.964493859809918e+04],
      v: [-2.453280916020465e-02, -3.983643368400818e-02, -1.221434641559037e-01] },
    Styx: { r: [-2.043723821810914e+04, -2.330964220210757e+04, -2.863665901281087e+04],
      v: [-8.482275728160305e-02, -6.225278235186205e-02, 1.135815051268355e-01] },
  },
  epochB: {
    jdTdb: 2457217.5,
    Pluto: { r: [1.417614152852306e+03, 1.427753300794762e+03, 7.046958885931829e+02],
      v: [7.598442180306007e-03, 3.684084839437238e-03, -2.274761224403825e-02] },
    Charon: { r: [-1.161484623080074e+04, -1.169807873898082e+04, -5.774834744221849e+03],
      v: [-6.225832273081175e-02, -3.018640083779986e-02, 1.863799959209917e-01] },
  },
};

/** 2015 解の GM(**対照であって判定行と混ぜない** —— Brozović et al. 2015 Icarus 246 317)。 */
export const GM_2015 = {
  source: 'Brozovic M. et al. 2015 Icarus 246 317',
  Pluto: { value: 869.6, sigma: 1.8 }, Charon: { value: 105.9, sigma: 1.0 },
  Nix: { value: 0.0030, sigma: null }, Hydra: { value: 0.0032, sigma: null },
  Kerberos: { value: 0.0011, sigma: 0.0006 }, Styx: { value: null, upper: 0.0010 },
};

/** 内蔵の重力定数(model 6.674 = SI 6.674e-11。**この便では動かさない**)。 */
export const G_MODEL = 6.674;
export const G_SI = 6.674e-11;

/** 精密単位(L=5・T=1・M=24)。km・km/s・kg からの割り算だけで換算できる。 */
export const PRECISE_UNITS = { L: 5, T: 1, M: 24, kmPerUnit: 100, kmsPerUnit: 10, kgPerUnit: 1e24 };

const sub = (a, b) => a.map((z, i) => z - b[i]);
const dot = (a, b) => a.reduce((s, z, i) => s + z * b[i], 0);
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a) => Math.sqrt(dot(a, a));

/**
 * **軌道面への射影**(z を捨てない —— R47)。r と r×v から面内基底を作り、
 * 位置と速度を**同じ回転**で射影する。返り値の `outR`/`outV` は面外成分(この対では恒等的に 0)。
 * html 側の `HP.orbitPlaneProject` と**同じ式**である(値はどちらで作っても 1 bit 同じ)。
 */
export function projectToOrbitPlane(r3, v3) {
  const h = cross(r3, v3);
  const nr = norm(r3), nh = norm(h);
  if (!(nr > 0) || !(nh > 0)) return null;
  const e1 = r3.map((z) => z / nr);
  const e3 = h.map((z) => z / nh);
  const e2 = cross(e3, e1);
  return { r: [dot(r3, e1), dot(r3, e2)], v: [dot(v3, e1), dot(v3, e2)],
    outR: dot(r3, e3), outV: dot(v3, e3), basis: { e1, e2, e3 } };
}

/** GM[km³/s²] → 質量[kg](内蔵 G で割るだけ)。 */
export function massFromGM(gmKm3s2) { return gmKm3s2 * 1e9 / G_SI; }

/**
 * 同一観測解の 2 体を**精密単位の重心系**へ置く。戻り値は preset の bodies にそのまま入る数。
 * 自転は**相互同期の宣言**(ω=2π/P)で、既定の P は PLU060 の 400 年平均である。
 */
export function charonPairState(o) {
  const s = o || {};
  const epoch = s.epoch || 'epochA';
  const E = HORIZONS_STATE[epoch];
  const mP = massFromGM(GM_2024.Pluto.value), mC = massFromGM(GM_2024.Charon.value);
  const r3 = sub(E.Charon.r, E.Pluto.r), v3 = sub(E.Charon.v, E.Pluto.v);
  const pr = projectToOrbitPlane(r3, v3);
  const U = PRECISE_UNITS;
  const rU = pr.r.map((z) => z / U.kmPerUnit), vU = pr.v.map((z) => z / U.kmsPerUnit);
  const mPU = mP / U.kgPerUnit, mCU = mC / U.kgPerUnit, MU = mPU + mCU;
  const omega = 2 * Math.PI / ((s.spinPeriodSec || ELEM_2024.Charon.periodSec) / Math.pow(10, U.T));
  return {
    epoch, jdTdb: E.jdTdb,
    mPluto: mPU, mCharon: mCU, massRatio: mCU / mPU,
    sepKm: norm(r3), relSpeedKms: norm(v3), outOfPlaneKm: pr.outR, outOfPlaneKms: pr.outV,
    pluto: { x: -(mCU / MU) * rU[0], y: -(mCU / MU) * rU[1],
      vx: -(mCU / MU) * vU[0], vy: -(mCU / MU) * vU[1], spin: omega },
    charon: { x: (mPU / MU) * rU[0], y: (mPU / MU) * rU[1],
      vx: (mPU / MU) * vU[0], vy: (mPU / MU) * vU[1], spin: omega },
    omega, rel: { r: rU, v: vU },
  };
}

/** 接触要素(2 体・model 単位)。判定量ではなく**入力の監査**に使う。 */
export function osculating(rU, vU, G, Msum) {
  const mu = G * Msum, r = Math.hypot(rU[0], rU[1]);
  const v2 = vU[0] * vU[0] + vU[1] * vU[1], rv = rU[0] * vU[0] + rU[1] * vU[1];
  const inv = 2 / r - v2 / mu, a = (inv !== 0) ? 1 / inv : NaN;
  const ex = (v2 * rU[0] - rv * vU[0]) / mu - rU[0] / r;
  const ey = (v2 * rU[1] - rv * vU[1]) / mu - rU[1] / r;
  return { r, a, e: Math.hypot(ex, ey), mu, P: (a > 0) ? 2 * Math.PI * Math.sqrt(a * a * a / mu) : NaN };
}

/**
 * **相対すべりの引きずり則**(`pairSlip`)の 1 步。`beta/index.html` の `dfmRelativeDragStep` と
 * **同じ式**を純関数で書いたもの(器と QA がエンジンと突き合わせる)。状態は破壊的に書き換える。
 * 入力 st = {m:[], x:[], y:[], vx:[], vy:[], spin:[], R:[]}。
 */
export function pairSlipStep(st, o) {
  const s = o || {};
  const G = s.G === undefined ? G_MODEL : s.G, eps = s.eps || 0, eps2 = eps * eps;
  const kap = s.kappa === undefined ? 1 : s.kappa, W0 = s.W0 || 0, dt = s.dt;
  const n = st.m.length;
  const pairs = s.pairs || (() => { const o2 = []; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) o2.push([i, j]); return o2; })();
  let dE = 0, kickMax = 0, torMax = 0, slipMax = 0, nOn = 0, resL = 0;
  for (const pr of pairs) {
    const i = pr[0], j = pr[1];
    const mi = st.m[i], mj = st.m[j];
    if (!(mi > 0) || !(mj > 0)) continue;
    const rx = st.x[j] - st.x[i], ry = st.y[j] - st.y[i];
    const d2 = rx * rx + ry * ry + eps2;
    if (!(d2 > 0)) continue;
    const vx = st.vx[j] - st.vx[i], vy = st.vy[j] - st.vy[i];
    const wi = st.spin[i], wj = st.spin[j];
    const six = vx + wi * ry, siy = vy - wi * rx;
    const sjx = vx + wj * ry, sjy = vy - wj * rx;
    const chiIJ = mj / (mj + W0 * d2), chiJI = mi / (mi + W0 * d2);
    const mu = mi * mj / (mi + mj);
    const nu = Math.sqrt(G * (mi + mj) / (d2 * Math.sqrt(d2)));
    const A = kap * chiIJ * mu * nu * dt, B = kap * chiJI * mu * nu * dt;
    const jx = A * six + B * sjx, jy = A * siy + B * sjy;
    if (!Number.isFinite(jx) || !Number.isFinite(jy)) continue;
    const ti = rx * (A * siy) - ry * (A * six), tj = rx * (B * sjy) - ry * (B * sjx);
    const Ii = 0.5 * mi * st.R[i] * st.R[i], Ij = 0.5 * mj * st.R[j] * st.R[j];
    let e = -(jx * vx + jy * vy) + (jx * jx + jy * jy) / (2 * mu);
    if (Ii > 0) e += ti * wi + ti * ti / (2 * Ii); else resL += ti;
    if (Ij > 0) e += tj * wj + tj * tj / (2 * Ij); else resL += tj;
    st.vx[i] += jx / mi; st.vy[i] += jy / mi;
    st.vx[j] -= jx / mj; st.vy[j] -= jy / mj;
    if (Ii > 0) st.spin[i] = wi + ti / Ii;
    if (Ij > 0) st.spin[j] = wj + tj / Ij;
    dE += e; nOn++;
    const km = Math.hypot(jx, jy); if (km > kickMax) kickMax = km;
    const tm = Math.max(Math.abs(ti), Math.abs(tj)); if (tm > torMax) torMax = tm;
    const sm = Math.max(Math.hypot(six, siy), Math.hypot(sjx, sjy)); if (sm > slipMax) slipMax = sm;
  }
  return { n: nOn, dE, heat: -dE, kickMax, torqueMax: torMax, slipMax, resL };
}

/** 総運動量・総 J_z(軌道+自転 I=½mR²)・総 E(並進+回転)。帳簿の閉じ方の照合に使う。 */
export function totalsOf(st) {
  let px = 0, py = 0, L = 0, E = 0;
  for (let i = 0; i < st.m.length; i++) {
    px += st.m[i] * st.vx[i]; py += st.m[i] * st.vy[i];
    const I = 0.5 * st.m[i] * st.R[i] * st.R[i];
    L += st.m[i] * (st.x[i] * st.vy[i] - st.y[i] * st.vx[i]) + I * st.spin[i];
    E += 0.5 * st.m[i] * (st.vx[i] * st.vx[i] + st.vy[i] * st.vy[i]) + 0.5 * I * st.spin[i] * st.spin[i];
  }
  return { px, py, L, E };
}

/** 相互同期した円軌道(**零条件**)の 2 体を作る。s_i=s_j=0 が厳密に成り立つ配置である。 */
export function syncCircularPair(o) {
  const s = o || {};
  const m1 = s.m1, m2 = s.m2, a = s.a, G = s.G === undefined ? G_MODEL : s.G;
  const M = m1 + m2, Om = Math.sqrt(G * M / (a * a * a));
  const x1 = -(m2 / M) * a, x2 = (m1 / M) * a;
  return { m: [m1, m2], x: [x1, x2], y: [0, 0],
    vx: [0, 0], vy: [Om * x1, Om * x2], spin: [Om, Om],
    R: [s.R1 === undefined ? 0 : s.R1, s.R2 === undefined ? 0 : s.R2], Omega: Om };
}

export default { CHARON_DFM_VERSION, GM_2024, ELEM_2024, BUIE_2012, HORIZONS_PR, HORIZONS_STATE,
  GM_2015, G_MODEL, G_SI, PRECISE_UNITS, projectToOrbitPlane, massFromGM, charonPairState,
  osculating, pairSlipStep, totalsOf, syncCircularPair };
