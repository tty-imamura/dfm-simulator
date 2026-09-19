// 第274便b(第64報)—— **因果の向きの試験器**(node・**playwright を使わない**)。
//
// ■ 何を測るか(原仮定者の裁定〔第64報〕の因果の向き)
//   **採る**: 「連星が kFrame≈0 で安定なら相対メッシュ運動が消え、**独立の同期トルク**で
//             自転が公転へ引き込まれる。その極限が相互潮汐ロック」
//   **採らない**: 「ロックしているから k≈0 と置く」
//   したがって本器は **3 つの規則**を守る(結果 JSON の `meta.testRules` に刻む・QA `docs.syncCausal` が固定):
//     ① **k は外から固定する**(k ∈ {0, 0.25, 0.5, 1})—— 同期率から k を作らない。
//     ② **非同期から出発する**(初期 ω/Ω ∈ {2, 0.5, −1, 5, 0.1})。
//     ③ **Γ・K を kFrame で乗じない**(同期トルクは独立パラメータである)。
//
// ■ 力学(すべて純関数・エンジンには 1 バイトも接続しない)
//   ・重力 …… a_i = Σ_j G m_j (q_j−q_i)/(d²+ε²)^{3/2}(速度 Verlet・KDK)。
//   ・引きずり …… **E6′ の純関数版(legacy Δv = k·Δu)**。u は
//     `lib-w272c-binlock.meshFlowAt`(既存関数)で作る —— w_j = m_j(d²+ε²)^{−p/2}・
//     u = Σ w_j v_j/(D₀+Σ w_j)・**自己除外**(相手だけが源)。**k はここだけに掛かる。**
//   ・同期トルク …… `lib-w274b-synctorque.mjs` の 2 候補(散逸型 / 配向型)。
//     反作用は相対軌道へ接線キックで返す(Δv_t = −Στ_i·h/(μr))—— **L_orb+ΣIω は機械ゼロで閉じる**。
//   ・同期比は `lib-w272c-binlock.signedSynchrony`(**符号つき**・AH22)で読む。
//
// ■ **この器がエンジンの再現ではないこと**(限界を先に書く)
//   ・E6′ の**回転チャネル(ω×Δr)を含めていない**(既存関数 `meshFlowAt` は並進チャネルだけである)。
//   ・反作用則は E6′-R(pairReduced)ではない —— `reservoir`(返さずに帳簿へ)と
//     `cmRemoved`(共通並進成分だけ除いて線運動量を閉じる)の **2 案を実装して比べる**。
//   ・1PN(E12)・スピン斥力・接触則は入れていない。
//   したがって数値は**エンジンの値の写しではない**。§0 で ❄️ の公転周期だけを宣言値と並べる
//   (照合であって一致の主張ではない)。
//
// ■ 書かないこと
//   「潮汐ロックへ収束することを証明した」「引きずりが完全に消えている空間メッシュ状態を確認した」
//   「kF0 版が成立した」「新発見」。Γ・K は**宣言された自由パラメータ**である。
//
// 実行: node tests/exp-w274b-sync.mjs [--orbits 60] [--quick]
// 出力: tests/out/sync-w274b.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { meshFlowAt, signedSynchrony, SIGN_CONVENTION_JA } from './lib-w272c-binlock.mjs';
import { pairLockCandidates } from './lib-w272b-pairlock.mjs';
import { SYNCTORQUE_VERSION, CAUSAL_CONTRACT, dissipativeTorque, orientationTorque,
  runSecular, syncTorqueLedger, syncReferenceCases, binaryChi, massFactorLinear }
  from './lib-w274b-synctorque.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'tests', 'out', 'sync-w274b.json');
const HARNESS_VERSION = 'w274b-sync-1';
const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(k); return (i >= 0 && argv[i + 1]) ? argv[i + 1] : d; };
const QUICK = argv.includes('--quick');
const ORBITS = Number(arg('--orbits', QUICK ? 8 : 60));
const SPO = Number(arg('--spo', QUICK ? 500 : 2000));      // 1 公転あたりの步数(基準)

// ---------------------------------------------------------------- 系の宣言値(内蔵プリセットの転写)
// **プリセットの physics は 1 bit も変えていない**(読み取っただけの診断コピーである)。
const SYSTEMS = {
  charon: {
    id: 'charon', label: '❄️ 冥王星とカロン(宣言値・e=0 転写)',
    G: 6.674, D0: 0.006, eps: 0.05, p: 1, frameWeight: 'share',
    m: [0.001303, 0.0001586], R: [1.188, 0.606],
    x: [-2.126385878489327, 17.469614121510673], y: [0, 0],
    vx: [0, 0], vy: [-0.002421019578680394, 0.01989021759785973],
    secondsPerUnit: 100,
    declared: { periodKF0Days: 6.3874, periodKF1Days: 6.40293, chi: [0.001347093246, 0.010960689483] },
  },
  nsBinary: {
    id: 'nsBinary', label: '⚡ 二重パルサー(宣言値・遠点状態・較正質量)',
    G: 6.674, D0: 3.24204e-7, eps: 0.05, p: 2, frameWeight: 'pull',
    m: [5321.812101719132, 4966.596715423392], R: [0.01175, 0.01175],
    x: [-461.48618600827865, 494.49208586803894], y: [0, 0],
    vx: [0, 0], vy: [-2.763093948239957, 2.9607128692905675],
    secondsPerUnit: 10,
    declared: { chi: [0.9999403473682839, 0.9999443287852461], eccTranscribed: 0.087777036 },
  },
};

const K_GRID = [0, 0.25, 0.5, 1];                       // **外から固定する k**
const SPIN_GRID = [                                      // **非同期から出発する**初期 ω/Ω
  { id: 'pro2', mult: 2.0, label: '順行 2.0Ω' },
  { id: 'pro05', mult: 0.5, label: '順行 0.5Ω' },
  { id: 'retro', mult: -1.0, label: '逆行 −1.0Ω' },
  { id: 'fast', mult: 5.0, label: '高速 5.0Ω' },
  { id: 'slow', mult: 0.1, label: '低速 0.1Ω' },
];
const GAMMA_GRID = [2, 10, 40];                          // τ_sync = I/Γ を「公転周期の何倍」に置くか

// ---------------------------------------------------------------- 小道具
function orbitElements(S, st, GM) {
  const rx = st.x[1] - st.x[0], ry = st.y[1] - st.y[0];
  const vx = st.vx[1] - st.vx[0], vy = st.vy[1] - st.vy[0];
  const r = Math.hypot(rx, ry), v2 = vx * vx + vy * vy, rv = rx * vx + ry * vy;
  const a = 1 / (2 / r - v2 / GM);
  const ex = ((v2 - GM / r) * rx - rv * vx) / GM, ey = ((v2 - GM / r) * ry - rv * vy) / GM;
  return { r, a, e: Math.hypot(ex, ey), Omega: (rx * vy - ry * vx) / (r * r),
    H: rv / (r * r), phi: Math.atan2(ry, rx), nx: rx / r, ny: ry / r, Eorb: v2 / 2 - GM / r };
}

function totals(S, st, I) {
  let P = [0, 0], L = 0, KE = 0, Espin = 0;
  for (let i = 0; i < 2; i++) {
    P[0] += S.m[i] * st.vx[i]; P[1] += S.m[i] * st.vy[i];
    L += S.m[i] * (st.x[i] * st.vy[i] - st.y[i] * st.vx[i]) + I[i] * st.om[i];
    KE += 0.5 * S.m[i] * (st.vx[i] * st.vx[i] + st.vy[i] * st.vy[i]);
    Espin += 0.5 * I[i] * st.om[i] * st.om[i];
  }
  const rx = st.x[1] - st.x[0], ry = st.y[1] - st.y[0];
  const U = -S.G * S.m[0] * S.m[1] / Math.sqrt(rx * rx + ry * ry + S.eps * S.eps);
  return { Px: P[0], Py: P[1], L, E: KE + U + Espin, KE, U, Espin };
}

/**
 * 2 体+自転の node 積分。
 *  cfg = { k, spinMult, gammaOrbits, torque:'dissipative'|'orientation', K0?,
 *          massFactor, dragReaction:'reservoir'|'cmRemoved', orbits, spo, freezeSpin? }
 */
function integrate(S, cfg) {
  const f = (cfg.massFactor === undefined) ? 1 : cfg.massFactor;
  const Sm = { ...S, m: S.m.map((z) => z * f) };
  const M = Sm.m[0] + Sm.m[1], mu = Sm.m[0] * Sm.m[1] / M, GM = Sm.G * M;
  const st = { x: S.x.slice(), y: S.y.slice(), vx: S.vx.slice(), vy: S.vy.slice(),
    om: [0, 0], th: [0, 0] };
  const el0 = orbitElements(Sm, st, GM);
  const nMean = Math.sqrt(GM / Math.abs(el0.a * el0.a * el0.a));
  const Porb = 2 * Math.PI / nMean;
  // 慣性は殻規約 I = ½ m R²(エンジンの殻慣性と同じ規約 —— **観測値ではなく宣言**である)
  const I = [0.5 * Sm.m[0] * S.R[0] * S.R[0], 0.5 * Sm.m[1] * S.R[1] * S.R[1]];
  // **Γ は kFrame で乗じない。** τ_sync = I/Γ を公転周期の gammaOrbits 倍に置く宣言である。
  const Gam = cfg.freezeSpin ? [0, 0] : I.map((z) => z / (cfg.gammaOrbits * Porb));
  const Kor = (cfg.torque === 'orientation' && !cfg.freezeSpin)
    ? I.map((z) => (cfg.K0 === undefined ? 1 : cfg.K0) * z * nMean * nMean) : [0, 0];
  st.om = [el0.Omega * cfg.spinMult, el0.Omega * cfg.spinMult];
  st.th = [el0.phi, el0.phi];

  const steps = Math.round(cfg.orbits * cfg.spo), h = Porb / cfg.spo;
  const t0 = totals(Sm, st, I);
  const uPrev = [];
  for (let i = 0; i < 2; i++) {
    const bd = [{ m: Sm.m[0], x: st.x[0], y: st.y[0], vx: st.vx[0], vy: st.vy[0] },
      { m: Sm.m[1], x: st.x[1], y: st.y[1], vx: st.vx[1], vy: st.vy[1] }];
    const u = meshFlowAt(bd, st.x[i], st.y[i], { eps: S.eps, p: S.p, D0: S.D0, eta: 1, skip: i });
    uPrev.push(u ? [u.ux, u.uy] : [0, 0]);
  }
  const acc = () => {
    const rx = st.x[1] - st.x[0], ry = st.y[1] - st.y[0];
    const d3 = Math.pow(rx * rx + ry * ry + S.eps * S.eps, 1.5);
    return [[Sm.G * Sm.m[1] * rx / d3, Sm.G * Sm.m[1] * ry / d3],
      [-Sm.G * Sm.m[0] * rx / d3, -Sm.G * Sm.m[0] * ry / d3]];
  };

  let Q = 0, Wdrag = 0, Ldrag = 0, Pdrag = [0, 0], nan = 0;
  let aMin = el0.a, aMax = el0.a, eMin = el0.e, eMax = el0.e, merged = false, unbound = false;
  let rMin = el0.r, rMax = el0.r;
  let worstL = 0, lastPhi = el0.phi, wind = 0, windPrev = 0, revTimes = [];
  const series = [], every = Math.max(1, Math.floor(steps / 400));
  let a = acc();
  for (let s = 0; s < steps; s++) {
    for (let i = 0; i < 2; i++) { st.vx[i] += 0.5 * h * a[i][0]; st.vy[i] += 0.5 * h * a[i][1]; }
    for (let i = 0; i < 2; i++) { st.x[i] += h * st.vx[i]; st.y[i] += h * st.vy[i]; }
    a = acc();
    for (let i = 0; i < 2; i++) { st.vx[i] += 0.5 * h * a[i][0]; st.vy[i] += 0.5 * h * a[i][1]; }

    // ---- E6′ の純関数版(**k はここだけに掛かる**)
    if (cfg.k > 0) {
      const bd = [{ m: Sm.m[0], x: st.x[0], y: st.y[0], vx: st.vx[0], vy: st.vy[0] },
        { m: Sm.m[1], x: st.x[1], y: st.y[1], vx: st.vx[1], vy: st.vy[1] }];
      const dv = [[0, 0], [0, 0]];
      for (let i = 0; i < 2; i++) {
        const u = meshFlowAt(bd, st.x[i], st.y[i], { eps: S.eps, p: S.p, D0: S.D0, eta: 1, skip: i });
        if (!u) { nan++; break; }
        dv[i] = [cfg.k * (u.ux - uPrev[i][0]), cfg.k * (u.uy - uPrev[i][1])];
        uPrev[i] = [u.ux, u.uy];
      }
      if (cfg.dragReaction === 'cmRemoved') {
        const cx = (Sm.m[0] * dv[0][0] + Sm.m[1] * dv[1][0]) / M;
        const cy = (Sm.m[0] * dv[0][1] + Sm.m[1] * dv[1][1]) / M;
        for (let i = 0; i < 2; i++) { dv[i][0] -= cx; dv[i][1] -= cy; }
      }
      for (let i = 0; i < 2; i++) {
        Wdrag += Sm.m[i] * (st.vx[i] * dv[i][0] + st.vy[i] * dv[i][1]
          + 0.5 * (dv[i][0] * dv[i][0] + dv[i][1] * dv[i][1]));
        Ldrag += Sm.m[i] * (st.x[i] * dv[i][1] - st.y[i] * dv[i][0]);
        Pdrag[0] += Sm.m[i] * dv[i][0]; Pdrag[1] += Sm.m[i] * dv[i][1];
        st.vx[i] += dv[i][0]; st.vy[i] += dv[i][1];
      }
    }

    // ---- 独立同期トルク(**k を読まない**)
    const el = orbitElements(Sm, st, GM);
    if (!cfg.freezeSpin) {
      let sumTau = 0;
      for (let i = 0; i < 2; i++) {
        const t = (Kor[i] !== 0)
          ? orientationTorque({ K: Kor[i], Gamma: Gam[i], delta: st.th[i] - el.phi, omega: st.om[i], Omega: el.Omega })
          : dissipativeTorque({ Gamma: Gam[i], omega: st.om[i], Omega: el.Omega });
        if (!t) { nan++; break; }
        st.om[i] += h * t.tau / I[i];
        sumTau += t.tau;
        Q += h * t.dissipation;
      }
      for (let i = 0; i < 2; i++) st.th[i] += h * st.om[i];
      // 反作用: L̇_orb = −Στ を相対軌道の接線キックで返す(**外から角運動量を足さない**)
      const dvt = -sumTau * h / (mu * el.r);
      const tx = -el.ny, ty = el.nx;
      st.vx[0] -= (Sm.m[1] / M) * dvt * tx; st.vy[0] -= (Sm.m[1] / M) * dvt * ty;
      st.vx[1] += (Sm.m[0] / M) * dvt * tx; st.vy[1] += (Sm.m[0] / M) * dvt * ty;
    }

    // ---- 帳簿・観測
    if (!(st.x.every(Number.isFinite) && st.vx.every(Number.isFinite) && st.om.every(Number.isFinite))) { nan++; break; }
    const el2 = orbitElements(Sm, st, GM);
    if (el2.a < aMin) aMin = el2.a; if (el2.a > aMax) aMax = el2.a;
    if (el2.e < eMin) eMin = el2.e; if (el2.e > eMax) eMax = el2.e;
    if (el2.r < rMin) rMin = el2.r; if (el2.r > rMax) rMax = el2.r;
    if (el2.r <= S.R[0] + S.R[1]) merged = true;
    if (el2.Eorb >= 0) unbound = true;
    const tt = totals(Sm, st, I);
    const scale = Math.abs(t0.L) + Math.abs(Ldrag) + 1e-300;
    worstL = Math.max(worstL, Math.abs(tt.L - Ldrag - t0.L) / scale);
    // 同方向 1 周の検出(位相の巻き)—— **步の内側を線形補間する**(刻みで周期を粗く刻まない)
    let dphi = el2.phi - lastPhi;
    while (dphi > Math.PI) dphi -= 2 * Math.PI;
    while (dphi < -Math.PI) dphi += 2 * Math.PI;
    windPrev = wind; wind += dphi; lastPhi = el2.phi;
    while (revTimes.length < 8) {
      const target = 2 * Math.PI * (revTimes.length + 1) * Math.sign(wind || 1);
      const crossed = (wind >= target && windPrev < target) || (wind <= target && windPrev > target);
      if (!crossed || wind === windPrev) break;
      const frac = (target - windPrev) / (wind - windPrev);
      revTimes.push((s + frac) * h);
    }
    // **面直の平均運動 n=√(GM/a³) を基準にした比**(離心軌道では瞬時 Ω が大きく振れるため両方を出す)
    const nOsc = Math.sqrt(GM / Math.abs(el2.a * el2.a * el2.a)) * Math.sign(el2.Omega || 1);
    const rat = [st.om[0] / el2.Omega, st.om[1] / el2.Omega];
    const ratN = [st.om[0] / nOsc, st.om[1] / nOsc];
    if ((s + 1) % every === 0 || s === steps - 1)
      series.push({ t: (s + 1) * h, orbits: (s + 1) * h / Porb, a: el2.a, e: el2.e, r: el2.r,
        Omega: el2.Omega, nOsc, om: st.om.slice(), ratio: rat, ratioMean: ratN, Q, Ldrag });
    if (merged || unbound) break;
  }
  const t1 = totals(Sm, st, I);
  const elEnd = orbitElements(Sm, st, GM);

  // ---- 判定は **R28 の 4 列**に分けて別々に記録する(完走だけを「成立」と書かない)
  //   ① 走行成立 …… 窓を完走し NaN 0・合体も離脱もしていない
  //   ② 定常成立 …… 窓末尾 10% で ω/n が平らになっている(spread ≤ 1e−3)
  //   ③ 同期    …… その平らな値が **符号つきで +1 の 1% 以内**
  //   ④ 観測成立 …… **本便では評価しない**(観測との突き合わせを 1 件もしていない)
  //   **「定常」は窓内の振れ幅ではなく「窓の平均が動かなくなったこと」で読む** ——
  //   離心軌道では ω は 1 公転のあいだに秤動するので、振れ幅だけでは定常かどうか判定できない。
  const TOL = 0.01, PLATEAU = 1e-3;
  const cut = Math.max(1, Math.ceil(series.length * 0.1));
  const tail = series.slice(Math.max(0, series.length - cut));
  const prev = series.slice(Math.max(0, series.length - 2 * cut), Math.max(0, series.length - cut));
  const avg = (arr, i) => arr.length ? arr.map((z) => z.ratioMean[i]).reduce((p, q) => p + q, 0) / arr.length : null;
  const plateau = [0, 1].map((i) => {
    if (!tail.length) return { mean: null, spread: null, drift: null };
    const v = tail.map((z) => z.ratioMean[i]);
    const mean = avg(tail, i), pm = avg(prev, i);
    return { mean, spread: Math.max(...v) - Math.min(...v),
      drift: (pm === null) ? null : Math.abs(mean - pm), min: Math.min(...v), max: Math.max(...v) };
  });
  const runCompleted = (nan === 0 && !merged && !unbound && series.length > 0
    && Math.abs(series[series.length - 1].orbits - cfg.orbits) < 0.02 * cfg.orbits);
  const spinPlateau = plateau.every((z) => z.drift !== null && z.drift <= PLATEAU);
  const synchronous = plateau.every((z) => z.mean !== null && Math.abs(z.mean - 1) <= TOL);
  // 軌道の安定: 同方向 1 周の周期が窓のはじめと終わりで 1% 以内
  const revPeriods = revTimes.slice(1).map((z, i) => z - revTimes[i]);
  const orbitStable = (revPeriods.length >= 2)
    ? Math.abs(revPeriods[revPeriods.length - 1] / revPeriods[0] - 1) <= 0.01 : null;
  // 最初に同期の条件が立ち、以後崩れない時刻(公転単位)
  let firstOrbits = null;
  for (let i = 0; i < series.length; i++) {
    const ok = series.slice(i).every((z) => Math.abs(z.ratioMean[0] - 1) <= TOL && Math.abs(z.ratioMean[1] - 1) <= TOL);
    if (ok) { firstOrbits = series[i].orbits; break; }
  }
  // 時定数: ln|ω₁−n| の傾き(窓の前半・十分なサンプルがあるときだけ)
  let tauFitOrbits = null;
  {
    const pts = series.filter((z) => z.orbits <= cfg.orbits * 0.5 && Math.abs(z.om[0] - z.nOsc) > 0)
      .map((z) => [z.orbits, Math.log(Math.abs(z.om[0] - z.nOsc))]);
    if (pts.length >= 8) {
      const n = pts.length;
      const sx = pts.reduce((p, z) => p + z[0], 0), sy = pts.reduce((p, z) => p + z[1], 0);
      const sxx = pts.reduce((p, z) => p + z[0] * z[0], 0), sxy = pts.reduce((p, z) => p + z[0] * z[1], 0);
      const slope = (n * sxy - sx * sy) / (n * sxx - sx * sx);
      if (slope < 0) tauFitOrbits = -1 / slope;
    }
  }
  const comV = [(Sm.m[0] * st.vx[0] + Sm.m[1] * st.vx[1]) / M, (Sm.m[0] * st.vy[0] + Sm.m[1] * st.vy[1]) / M];
  return {
    orbits: cfg.orbits, spo: cfg.spo, steps, dt: h, Porb, nMean, GM, mu, I, Gamma: Gam, K: Kor,
    massFactor: f, k: cfg.k, spinMult: cfg.spinMult, gammaOrbits: cfg.gammaOrbits,
    torque: cfg.torque, dragReaction: cfg.dragReaction || 'reservoir',
    a0: el0.a, e0: el0.e, aEnd: elEnd.a, eEnd: elEnd.e,
    aMin, aMax, eMin, eMax, rMin, rMax,
    aDriftRel: (elEnd.a - el0.a) / el0.a, eDrift: elEnd.e - el0.e,
    ratio0: [cfg.spinMult, cfg.spinMult],
    ratioEnd: [st.om[0] / elEnd.Omega, st.om[1] / elEnd.Omega],
    ratioMeanPlateau: plateau.map((z) => z.mean), plateauSpread: plateau.map((z) => z.spread),
    plateauDrift: plateau.map((z) => z.drift),
    ratioMeanBand: plateau.map((z) => [z.min === undefined ? null : z.min, z.max === undefined ? null : z.max]),
    runCompleted, spinPlateau, synchronous, orbitStable,
    convergedFromOrbits: firstOrbits, tauFitOrbits,
    revTimes, revPeriods, merged, unbound, nan, comVel: comV,
    ledger: { angularRelDrift: worstL, Q, Wdrag, Ldrag, Pdrag,
      energyResidual: t1.E + Q - Wdrag - t0.E,
      energyRelResidual: Math.abs(t1.E + Q - Wdrag - t0.E) / (Math.abs(t0.E) || 1) },
    series: cfg.keepSeries ? series : series.filter((z, i) => i % Math.ceil(series.length / 21) === 0),
  };
}

// ================================================================= 走行
const R = { meta: {} };
console.error(`[w274b] orbits=${ORBITS} spo=${SPO} quick=${QUICK}`);

// ---------------- §1 純関数の帳簿(永年模型・k を 1 度も読まない)
console.error('§1 純関数の帳簿');
R.pureLedger = { note: '**永年模型(準円)の RK4**。L_tot=L_orb+ΣIω は各 RK 段で相殺するので丸め以外に漂わない。'
  + 'dE/dt=−Q̇ は式の上で厳密である。**この節は k を 1 度も読まない**(同期トルクは独立パラメータ)。',
  rows: [] };
for (const c of syncReferenceCases()) {
  const run = runSecular(c.P);
  const led = syncTorqueLedger(run);
  R.pureLedger.rows.push({ id: c.id, variant: run.variant,
    ratio0: run.first.ratio, ratioEnd: run.last.ratio,
    aStart: run.first.a, aEnd: run.last.a,
    angularRelDrift: run.ledger.angularRelDrift, qMonotone: run.ledger.qMonotone,
    qFinal: run.ledger.qFinal, energyRelResidual: run.ledger.energyRelResidual,
    ok: led.ok, checks: led.checks });
  console.error(`  ${c.id}: ω/Ω ${run.first.ratio.map((z) => z.toFixed(3)).join('/')}`
    + ` → ${run.last.ratio.map((z) => z.toFixed(6)).join('/')}`
    + ` | ΔL/L=${run.ledger.angularRelDrift.toExponential(2)}`
    + ` | ΔE+Q=${run.ledger.energyRelResidual.toExponential(2)} | ok=${led.ok}`);
}

// ---------------- §2 引きずりチャネルの照合(自転を凍結した 2 点)
console.error('§2 引きずりチャネルの照合(自転凍結)');
R.dragChannel = { note: '**自転を凍結**(Γ=K=0)して k=0 と k=1 だけを比べた 2 点。'
  + '❄️ は宣言値(kF0 6.3874 日 / kF1 6.40293 日)と並べるが、**本器はエンジンの再現ではない**'
  + '(E6′ の回転チャネル ω×Δr を含まない・反作用則が E6′-R ではない・1PN 無し)。', rows: [] };
for (const sid of ['charon', 'nsBinary']) {
  const S = SYSTEMS[sid];
  for (const k of [0, 1]) {
    for (const dr of ['reservoir', 'cmRemoved']) {
      const r = integrate(S, { k, spinMult: 1, gammaOrbits: 10, torque: 'dissipative',
        dragReaction: dr, orbits: Math.min(4, ORBITS), spo: SPO * (sid === 'nsBinary' ? 2 : 1), freezeSpin: true });
      const row = { system: sid, k, dragReaction: dr, revTimes: r.revTimes, revPeriods: r.revPeriods,
        firstRevUnits: r.revTimes[0] === undefined ? null : r.revTimes[0],
        firstRevDays: r.revTimes[0] === undefined ? null : r.revTimes[0] * S.secondsPerUnit / 86400,
        firstRevSeconds: r.revTimes[0] === undefined ? null : r.revTimes[0] * S.secondsPerUnit,
        e0: r.e0, eEnd: r.eEnd, a0: r.a0, aEnd: r.aEnd, rMin: r.rMin, rMax: r.rMax,
        aDriftRel: r.aDriftRel, Ldrag: r.ledger.Ldrag, Pdrag: r.ledger.Pdrag, comVel: r.comVel,
        angularRelDrift: r.ledger.angularRelDrift, nan: r.nan };
      R.dragChannel.rows.push(row);
      console.error(`  ${sid} k=${k} ${dr}: 1 周 ${row.firstRevUnits === null ? '—' : row.firstRevUnits.toFixed(4)}`
        + (row.firstRevDays === null ? '' : ` (${row.firstRevDays.toFixed(5)} 日)`)
        + ` Δa/a=${r.aDriftRel.toExponential(2)} L_drag=${r.ledger.Ldrag.toExponential(2)}`);
    }
  }
}
// χ の再現(宣言値との突き合わせ — 純関数 `binaryChi`)
R.chiCheck = ['charon', 'nsBinary'].map((sid) => {
  const S = SYSTEMS[sid];
  const a0 = Math.hypot(S.x[1] - S.x[0], S.y[1] - S.y[0]);
  const c = binaryChi(S.m[0], S.m[1], a0, S.D0, S.eps, S.p);
  return { system: sid, separation: a0, chiA: c.chiA, chiB: c.chiB,
    declared: S.declared.chi,
    relA: Math.abs(c.chiA - S.declared.chi[0]) / S.declared.chi[0],
    relB: Math.abs(c.chiB - S.declared.chi[1]) / S.declared.chi[1] };
});
for (const z of R.chiCheck) console.error(`  χ ${z.system}: ${z.chiA.toExponential(6)}/${z.chiB.toExponential(6)}`
  + ` vs 宣言 ${z.declared[0]}/${z.declared[1]} (相対 ${z.relA.toExponential(1)}/${z.relB.toExponential(1)})`);

// ---------------- §3 因果の試験(k × 初期自転 × Γ)
console.error('§3 因果の試験 k × 初期自転 × Γ');
R.causalGrid = { note: '**k を外から固定し、非同期から出発する**。Γ は kFrame で乗じていない。'
  + '判定は **R28 の 4 列に分けて**記録する: ① 走行成立(完走・NaN 0・合体も離脱もない)/'
  + '② 定常成立(窓末尾 10% で ω/n の振れ幅 ≤ 1e−3)/ ③ 同期(その平らな値が符号つきで +1 の 1% 以内)/'
  + '④ 観測成立 —— **本便では評価しない**(観測との突き合わせを 1 件もしていない)。'
  + '**「定常」は窓平均の移動(直前の 10% 窓との差)で読む** —— 離心軌道では ω が 1 公転のあいだに'
  + '秤動するので、窓内の振れ幅だけでは定常かどうかを判定できない(振れ幅は ratioMeanBand に別記)。'
  + '**離心軌道では瞬時 Ω が大きく振れる**ので、比は平均運動 n=√(GM/a³) を基準に読む。'
  + 'a・e は**素の GM で作った接触要素**であり、k>0 では引きずり項が実効重力を変えるので'
  + '「軌道要素のドリフト」として厳密ではない —— 軌道の安定は**同方向 1 周の周期の比**で読む。', rows: [] };
for (const sid of ['charon', 'nsBinary']) {
  const S = SYSTEMS[sid];
  const spo = SPO * (sid === 'nsBinary' ? 2 : 1);
  for (const k of K_GRID) for (const sp of SPIN_GRID) for (const g of GAMMA_GRID) {
    const r = integrate(S, { k, spinMult: sp.mult, gammaOrbits: g, torque: 'dissipative',
      dragReaction: 'reservoir', orbits: ORBITS, spo });
    R.causalGrid.rows.push({ system: sid, k, spin: sp.id, spinMult: sp.mult, gammaOrbits: g,
      ratioEnd: r.ratioEnd, ratioMeanPlateau: r.ratioMeanPlateau, plateauSpread: r.plateauSpread,
      plateauDrift: r.plateauDrift, ratioMeanBand: r.ratioMeanBand,
      runCompleted: r.runCompleted, spinPlateau: r.spinPlateau, synchronous: r.synchronous,
      orbitStable: r.orbitStable, convergedFromOrbits: r.convergedFromOrbits,
      tauFitOrbits: r.tauFitOrbits, aDriftRel: r.aDriftRel, e0: r.e0, eEnd: r.eEnd, eDrift: r.eDrift,
      aMin: r.aMin, aMax: r.aMax, rMin: r.rMin, rMax: r.rMax,
      revPeriodFirst: r.revPeriods[0] === undefined ? null : r.revPeriods[0],
      revPeriodLast: r.revPeriods.length ? r.revPeriods[r.revPeriods.length - 1] : null,
      merged: r.merged, unbound: r.unbound, nan: r.nan,
      Q: r.ledger.Q, Ldrag: r.ledger.Ldrag, angularRelDrift: r.ledger.angularRelDrift,
      energyRelResidual: r.ledger.energyRelResidual });
  }
  console.error(`  ${sid}: ${R.causalGrid.rows.filter((z) => z.system === sid).length} 行`);
}

// ---------------- §4 配向型(K>0)の対照
console.error('§4 配向型(K>0)');
R.orientationGrid = { note: 'U_lock=−K cos2δ・τ=−2K sin2δ−Γδ̇。K も **kFrame で乗じない**。', rows: [] };
for (const k of K_GRID) for (const sp of [SPIN_GRID[0], SPIN_GRID[2]]) {
  const S = SYSTEMS.charon;
  const r = integrate(S, { k, spinMult: sp.mult, gammaOrbits: 10, torque: 'orientation', K0: 0.05,
    dragReaction: 'reservoir', orbits: ORBITS, spo: SPO });
  R.orientationGrid.rows.push({ system: 'charon', k, spin: sp.id, spinMult: sp.mult,
    ratioEnd: r.ratioEnd, ratioMeanPlateau: r.ratioMeanPlateau, plateauSpread: r.plateauSpread,
    runCompleted: r.runCompleted, spinPlateau: r.spinPlateau, synchronous: r.synchronous,
    orbitStable: r.orbitStable, convergedFromOrbits: r.convergedFromOrbits,
    aDriftRel: r.aDriftRel, eEnd: r.eEnd, K: r.K, Q: r.ledger.Q, nan: r.nan,
    angularRelDrift: r.ledger.angularRelDrift });
}

// ---------------- §5 f(質量補正)と k を別軸で振る
console.error('§5 f と k は別軸');
{
  const S = SYSTEMS.charon;
  const a0 = Math.hypot(S.x[1] - S.x[0], S.y[1] - S.y[0]);
  R.massAxis = { note: '**同じ f で k だけ変更**と**k を固定して f を変更**を別の試験として並べる。'
    + 'f は質量則(宣言)であって同期トルクとは無関係である。', rows: [] };
  for (const k of K_GRID) {
    const fl = massFactorLinear(S.m[0], S.m[1], a0, S.D0, S.eps, k, S.p);
    for (const fmode of ['f1', 'flin']) {
      const f = (fmode === 'f1') ? 1 : fl.f;
      const r = integrate(S, { k, spinMult: 2.0, gammaOrbits: 10, torque: 'dissipative',
        massFactor: f, dragReaction: 'reservoir', orbits: ORBITS, spo: SPO });
      R.massAxis.rows.push({ system: 'charon', k, fmode, f, chi: [fl.chiA, fl.chiB],
        ratioEnd: r.ratioEnd, ratioMeanPlateau: r.ratioMeanPlateau, plateauSpread: r.plateauSpread,
        runCompleted: r.runCompleted, spinPlateau: r.spinPlateau, synchronous: r.synchronous,
        orbitStable: r.orbitStable, convergedFromOrbits: r.convergedFromOrbits,
        aDriftRel: r.aDriftRel, eEnd: r.eEnd, Porb: r.Porb,
        revPeriodFirst: r.revPeriods[0] === undefined ? null : r.revPeriods[0], nan: r.nan });
    }
  }
  for (const z of R.massAxis.rows) console.error(`  k=${z.k} ${z.fmode} f=${z.f.toFixed(9)}`
    + ` 同期=${z.synchronous} 定常=${z.spinPlateau} ω/n=${z.ratioMeanPlateau.map((q) => q.toFixed(5)).join('/')}`);
}

// ---------------- §6 反作用則の 2 案の比較
console.error('§6 反作用則 2 案');
R.reactionCompare = { note: '`reservoir`(返さずに帳簿)と `cmRemoved`(共通並進成分を除いて線運動量を閉じる)。'
  + '**どちらもエンジンの E6′-R(pairReduced)ではない**。', rows: [] };
for (const k of [0.25, 1]) for (const dr of ['reservoir', 'cmRemoved']) {
  const S = SYSTEMS.charon;
  const r = integrate(S, { k, spinMult: 2.0, gammaOrbits: 10, torque: 'dissipative',
    dragReaction: dr, orbits: ORBITS, spo: SPO });
  R.reactionCompare.rows.push({ system: 'charon', k, dragReaction: dr,
    ratioEnd: r.ratioEnd, ratioMeanPlateau: r.ratioMeanPlateau,
    runCompleted: r.runCompleted, spinPlateau: r.spinPlateau, synchronous: r.synchronous,
    orbitStable: r.orbitStable, aDriftRel: r.aDriftRel, eEnd: r.eEnd,
    revPeriodFirst: r.revPeriods[0] === undefined ? null : r.revPeriods[0],
    Pdrag: r.ledger.Pdrag, Ldrag: r.ledger.Ldrag, comVel: r.comVel, nan: r.nan });
}

// ---------------- §7 刻みの 2 段(同一行の dt 収束)
console.error('§7 刻みの 2 段');
R.stepConvergence = { note: '同じ行を spo と 2·spo で走らせた 2 段。**3 段ではない**(診断)。', rows: [] };
for (const k of [0, 1]) for (const mult of [1, 2]) {
  const S = SYSTEMS.charon;
  const r = integrate(S, { k, spinMult: 2.0, gammaOrbits: 10, torque: 'dissipative',
    dragReaction: 'reservoir', orbits: Math.min(20, ORBITS), spo: SPO * mult });
  R.stepConvergence.rows.push({ system: 'charon', k, spo: SPO * mult, dt: r.dt,
    ratioEnd: r.ratioEnd, aDriftRel: r.aDriftRel, eEnd: r.eEnd,
    energyRelResidual: r.ledger.energyRelResidual, angularRelDrift: r.ledger.angularRelDrift });
}

// ---------------- §8 診断式との対応(**因果の証拠には使わない**)
console.error('§8 診断式との対応');
{
  const S = SYSTEMS.charon;
  const rows = [];
  for (const sp of SPIN_GRID) {
    const om = Math.abs(S.vy[1] - S.vy[0]) / Math.hypot(S.x[1] - S.x[0], S.y[1] - S.y[0]);
    const s = { G: S.G, mA: S.m[0], mB: S.m[1],
      xA: S.x[0], yA: S.y[0], vxA: S.vx[0], vyA: S.vy[0],
      xB: S.x[1], yB: S.y[1], vxB: S.vx[1], vyB: S.vy[1],
      omegaA: om * sp.mult, omegaB: om * sp.mult, k0: 1, kFrame: 1, alpha: 1,
      chiA: 0.001347093246, chiB: 0.010960689483 };
    const v = pairLockCandidates(s);
    const sy = signedSynchrony(om * sp.mult, v.kin.Omega);
    rows.push({ spin: sp.id, spinMult: sp.mult, signedRatio: sy.ratio,
      candI: v.candI.k, candII: v.candII.k, candIII: v.candIII.k });
  }
  R.diagnosticMap = { note: '**候補 (i)(iii) は「同期率 → k」の診断式であり、本便の因果の検証には使わない**'
    + '(同期率 → k → 同期率 の循環を作らないため)。C5(第272便b の対照列)は **t=0 の定数評価**であって、'
    + '動的な維持の実証ではない。ここでは **同じ初期自転の組に対する診断値**を並べるだけである。',
    convention: SIGN_CONVENTION_JA, rows };
  for (const z of rows) console.error(`  ${z.spin}: 符号つき ω/Ω=${z.signedRatio.toFixed(3)}`
    + ` candI=${z.candI.toExponential(3)} candIII=${z.candIII.toExponential(3)}`);
}

// ================================================================= meta と保存
R.meta = Object.assign({
  wave: '第274便b',
  section: '連星同期 —— 独立同期トルクの純関数と因果の向きの node 診断',
  harness: HARNESS_VERSION,
  libVersion: SYNCTORQUE_VERSION,
  adjudication: CAUSAL_CONTRACT.adopt,
  rejected: CAUSAL_CONTRACT.reject,
  testRules: CAUSAL_CONTRACT.testRules,
  kFixedExternally: true,
  startsNonSynchronous: true,
  gammaMultipliedByKFrame: false,
  kGrid: K_GRID,
  spinGrid: SPIN_GRID.map((z) => z.mult),
  gammaGrid: GAMMA_GRID,
  orbits: ORBITS,
  quick: QUICK,
  engineConnected: false,
  coreTouched: false,
  presetsTouched: false,
  limits: [
    'E6′ の回転チャネル(ω×Δr)を含まない(既存関数 meshFlowAt は並進チャネルだけ)',
    '反作用則は E6′-R(pairReduced)ではない —— reservoir / cmRemoved の 2 案',
    '1PN(E12)・スピン斥力・接触則を入れていない',
    'Γ・K は宣言された自由パラメータで、観測から同定した値ではない',
    '慣性 I=½mR² は殻規約の**宣言**であって実慣性モーメント係数ではない',
  ],
  notClaim: CAUSAL_CONTRACT.notClaim,
  diagnosticOnly: CAUSAL_CONTRACT.diagnosticOnly,
}, provenanceMeta({ root: ROOT, wave: '第274便b',
  target: 'tests/lib-w274b-synctorque.mjs',
  code: ['tests/exp-w274b-sync.mjs', 'tests/lib-w274b-synctorque.mjs',
    'tests/lib-w272c-binlock.mjs', 'tests/lib-w272b-pairlock.mjs', 'tests/lib-w272e-provenance.mjs'],
  inputs: ['tests/lib-w274b-synctorque.mjs', 'tests/lib-w272c-binlock.mjs', 'tests/lib-w272b-pairlock.mjs'] }));

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(R, null, 1));
console.error('[w274b-sync] wrote ' + OUT + ' (' + fs.statSync(OUT).size + ' bytes)');
