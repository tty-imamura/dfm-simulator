// 第248便b W2「重力磁気の検証の継続 — スピン–軌道(SO)参照積分器」。
//
// **これはエンジンの外の独立参照**である。beta/index.html には 1 bit も触れない(SO の力は
// エンジンに入れない — 第248便の 3 審査 v6 一致事項)。目的は「⚡ の超過歳差(観測の約2倍)を
// SO で埋められるか」を数量で否定/肯定するための**桁の物差し**を、独立実装で出すこと。
//
// 使う Hamiltonian(Damour–Jaranowski–Schäfer 型の保守的 SO・ChatGPT v6 §SO):
//     H = p²/(2μ) − G m₁m₂/r + C (L·A)/r³ ,  A = g₁S₁ + g₂S₂ ,  C = λ·G/c²
//     g₁ = 2 + 3m₂/(2m₁) ,  g₂ = 2 + 3m₁/(2m₂) ,  λ=1 が物理係数
//   (標準形 H_SO = (2G/c²r³) L·[(1+3m₂/(4m₁))S₁+(1+3m₁/(4m₂))S₂] の 2 倍括り出し = 同じ式)
//
// 正準方程式(3D・S は Poisson bracket {S_a,S_b}=ε_abc S_c):
//     ṙ = ∂H/∂p = p/μ + (C/r³)(A×r)
//     ṗ = −∂H/∂r = −G m₁m₂ r/r³ − C[ (p×A)/r³ − 3(L·A) r/r⁵ ]
//     Ṡᵢ = (∂H/∂Sᵢ)×Sᵢ = (C gᵢ/r³) (L×Sᵢ)
//   → E=H・総 J=L+S₁+S₂・|Sᵢ| がすべて保存量(検証項目)。
//
// 積分器: 古典 RK4(Float64)。単位は無次元化(L_u=a・T_u=P/2π・M_u=m₁+m₂ → GM=1)。
//
// 実行:
//   node tests/exp-w248b-so.mjs            … 全部(検証+J0737 の Δϖ_SO+GR 1PN 比較)を JSON で出す
//   node tests/exp-w248b-so.mjs --check    … 保存則・勾配一致の合否だけ(QA 用・非ゼロ終了で失敗)
//   node tests/exp-w248b-so.mjs --quiet    … 進捗を stderr に出さない
//
// 観測値の出典はコミット済み paper/data/solar-observations.csv(Hu et al. 2022 / Kramer et al. 2006 /
// Dietrich et al. 2020 の半径 proxy)。スピンは S=½MR²Ω の proxy(エンジンの Q=½mR²ω と同じ約束)。

const argv = process.argv.slice(2);
const CHECK = argv.includes('--check');
const QUIET = argv.includes('--quiet') || CHECK;
const log = (s) => { if (!QUIET) console.error(s); };

// ============================================================ 観測値(paper/data/solar-observations.csv)
const OBS = {
  G: 6.674e-11,                    // 単位系 1単位=10⁶m/10¹s/10²⁷kg の G=6.674 と同じ値
  c: 2.99792458e8,
  m1: 2.660982861e30,              // PSR J0737−3039 A(1.338186 M☉ × 1.9885e30)
  m2: 2.483370041e30,              // PSR J0737−3039 B(1.248866 M☉ × 1.9885e30)
  P: 8834.534723278,               // 公転周期 s(Hu et al. 2022)
  e: 0.087777036,                  // eT(Hu et al. 2022)
  R: 1.175e4,                      // 半径 **proxy**(Dietrich et al. 2020 の R_1.4 — 観測半径ではない)
  omegaA: 276.7998768,             // = 2π/22.69937898645 ms
  omegaB: 2.2654675,               // = 2π/2.77346074724 s
  omegaDotObsDegPerYr: 16.899323,  // Kramer et al. 2021 PRX 11 041050 の ω̇
  yearSec: 3.15576e7               // ユリウス年
};

// ---- 導出量(a は Kepler の第3法則から — 出典表の 8.788366e8 m と 5 桁一致することを表に出す)
const M = OBS.m1 + OBS.m2, GM = OBS.G * M, mu = OBS.m1 * OBS.m2 / M;
const a = Math.cbrt(GM * OBS.P * OBS.P / (4 * Math.PI * Math.PI));
const g1 = 2 + 1.5 * OBS.m2 / OBS.m1, g2 = 2 + 1.5 * OBS.m1 / OBS.m2;
const S1mag = 0.5 * OBS.m1 * OBS.R * OBS.R * OBS.omegaA;   // S=½MR²Ω(proxy)
const S2mag = 0.5 * OBS.m2 * OBS.R * OBS.R * OBS.omegaB;
const Amag = g1 * S1mag + g2 * S2mag;

// ============================================================ ベクトル小道具
const cross = (u, v) => [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
const dot = (u, v) => u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
const nrm = (u) => Math.sqrt(dot(u, u));

// ============================================================ 無次元系(GM=1・a=1・T_u=P/2π)
//   ĉ = c·T_u/L_u ,  Ŝ = S/(M_u·L_u²/T_u) ,  Ĉ = λ/ĉ²
function makeSystem(lambda) {
  const Tu = OBS.P / (2 * Math.PI), Lu = a, Mu = M;
  const ch = OBS.c * Tu / Lu;
  return {
    lambda, mu: mu / Mu, m1: OBS.m1 / Mu, m2: OBS.m2 / Mu,
    k: (OBS.m1 / Mu) * (OBS.m2 / Mu),      // G=1・M̂=1 なので k=Ĝm̂₁m̂₂
    g1, g2, C: lambda / (ch * ch), ch,
    S1u: S1mag / (Mu * Lu * Lu / Tu), S2u: S2mag / (Mu * Lu * Lu / Tu),
    Tu, Lu, Mu
  };
}

// state = [rx,ry,rz, px,py,pz, s1x,s1y,s1z, s2x,s2y,s2z]
function Ham(sy, z) {
  const r = [z[0], z[1], z[2]], p = [z[3], z[4], z[5]];
  const S1 = [z[6], z[7], z[8]], S2 = [z[9], z[10], z[11]];
  const rr = nrm(r), L = cross(r, p);
  const A = [sy.g1 * S1[0] + sy.g2 * S2[0], sy.g1 * S1[1] + sy.g2 * S2[1], sy.g1 * S1[2] + sy.g2 * S2[2]];
  return dot(p, p) / (2 * sy.mu) - sy.k / rr + sy.C * dot(L, A) / (rr * rr * rr);
}

// 解析の正準方程式
function deriv(sy, z) {
  const r = [z[0], z[1], z[2]], p = [z[3], z[4], z[5]];
  const S1 = [z[6], z[7], z[8]], S2 = [z[9], z[10], z[11]];
  const rr = nrm(r), r3 = rr * rr * rr, r5 = r3 * rr * rr;
  const L = cross(r, p);
  const A = [sy.g1 * S1[0] + sy.g2 * S2[0], sy.g1 * S1[1] + sy.g2 * S2[1], sy.g1 * S1[2] + sy.g2 * S2[2]];
  const LA = dot(L, A);
  const Axr = cross(A, r), pxA = cross(p, A);
  const rdot = [p[0] / sy.mu + sy.C * Axr[0] / r3, p[1] / sy.mu + sy.C * Axr[1] / r3, p[2] / sy.mu + sy.C * Axr[2] / r3];
  const pdot = [
    -sy.k * r[0] / r3 - sy.C * (pxA[0] / r3 - 3 * LA * r[0] / r5),
    -sy.k * r[1] / r3 - sy.C * (pxA[1] / r3 - 3 * LA * r[1] / r5),
    -sy.k * r[2] / r3 - sy.C * (pxA[2] / r3 - 3 * LA * r[2] / r5)];
  const c1 = sy.C * sy.g1 / r3, c2 = sy.C * sy.g2 / r3;
  const LxS1 = cross(L, S1), LxS2 = cross(L, S2);
  return [rdot[0], rdot[1], rdot[2], pdot[0], pdot[1], pdot[2],
    c1 * LxS1[0], c1 * LxS1[1], c1 * LxS1[2], c2 * LxS2[0], c2 * LxS2[1], c2 * LxS2[2]];
}

// 数値微分から組んだ正準方程式(検証用 — 解析式と一致するはず)
//   刻みは**ブロック単位の大きさ**(|r|・|p|・|S₁|・|S₂|)から取る。成分ごとの |z_i| で取ると
//   ほぼ 0 の成分で刻みが潰れ、H の丸め(≈1e-16)が拡大して見かけの不一致になる。
function derivNum(sy, z, h) {
  const g = new Array(12);
  const sc = [nrm([z[0], z[1], z[2]]), nrm([z[3], z[4], z[5]]), nrm([z[6], z[7], z[8]]), nrm([z[9], z[10], z[11]])];
  for (let i = 0; i < 12; i++) {
    // H は S₁・S₂ について**厳密に線形**なので、スピン成分の中心差分は刻みの大きさに依らず厳密。
    // 刻みを大きく取る(0.1|S|)ことで、H の丸め ÷ 微小な ΔH という桁落ちを避ける。
    const hi = (i < 6 ? h : 0.1) * sc[i < 3 ? 0 : i < 6 ? 1 : i < 9 ? 2 : 3];
    const zp = z.slice(), zm = z.slice();
    zp[i] += hi; zm[i] -= hi;
    g[i] = (Ham(sy, zp) - Ham(sy, zm)) / (2 * hi);
  }
  const dHdr = [g[0], g[1], g[2]], dHdp = [g[3], g[4], g[5]];
  const dHdS1 = [g[6], g[7], g[8]], dHdS2 = [g[9], g[10], g[11]];
  const S1 = [z[6], z[7], z[8]], S2 = [z[9], z[10], z[11]];
  const s1d = cross(dHdS1, S1), s2d = cross(dHdS2, S2);
  return [dHdp[0], dHdp[1], dHdp[2], -dHdr[0], -dHdr[1], -dHdr[2],
    s1d[0], s1d[1], s1d[2], s2d[0], s2d[1], s2d[2]];
}

function rk4(sy, z, dt) {
  const k1 = deriv(sy, z);
  const z2 = z.map((v, i) => v + 0.5 * dt * k1[i]); const k2 = deriv(sy, z2);
  const z3 = z.map((v, i) => v + 0.5 * dt * k2[i]); const k3 = deriv(sy, z3);
  const z4 = z.map((v, i) => v + dt * k3[i]); const k4 = deriv(sy, z4);
  const o = new Array(12);
  for (let i = 0; i < 12; i++) o[i] = z[i] + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]);
  return o;
}

// 近点方向 = Laplace–Runge–Lenz(離心率ベクトル)の向き。e_vec = (p×L)/(μk) − r̂
function periAngle(sy, z) {
  const r = [z[0], z[1], z[2]], p = [z[3], z[4], z[5]];
  const rr = nrm(r), L = cross(r, p), pxL = cross(p, L);
  const ex = pxL[0] / (sy.mu * sy.k) - r[0] / rr, ey = pxL[1] / (sy.mu * sy.k) - r[1] / rr;
  return { ang: Math.atan2(ey, ex), ecc: Math.hypot(ex, ey, pxL[2] / (sy.mu * sy.k) - r[2] / rr) };
}

function consts(sy, z) {
  const r = [z[0], z[1], z[2]], p = [z[3], z[4], z[5]];
  const S1 = [z[6], z[7], z[8]], S2 = [z[9], z[10], z[11]];
  const L = cross(r, p);
  const J = [L[0] + S1[0] + S2[0], L[1] + S1[1] + S2[1], L[2] + S1[2] + S2[2]];
  return { E: Ham(sy, z), J, Jm: nrm(J), S1m: nrm(S1), S2m: nrm(S2) };
}

// 初期状態: 近点整列(r は +x・p は +y)。スピンは tilt(rad)だけ x へ倒す(0=軌道面法線に整列)
function init(sy, tilt) {
  const rp = 1 - OBS.e, vp = Math.sqrt((1 + OBS.e) / (1 - OBS.e));   // GM=1・a=1
  const ct = Math.cos(tilt), st = Math.sin(tilt);
  return [rp, 0, 0, 0, sy.mu * vp, 0,
    sy.S1u * st, 0, sy.S1u * ct, sy.S2u * st, 0, sy.S2u * ct];
}

// ============================================================ 検証 1: 勾配(数値微分)の一致
function checkGradient() {
  const sy = makeSystem(1e6);           // λ を大きくして SO 項が丸めに埋もれないようにする(式の一致を見る)
  const rows = [];
  for (const tilt of [0, 0.7]) {
    let z = init(sy, tilt);
    for (let k = 0; k < 137; k++) z = rk4(sy, z, 0.01);   // 一般の位相へ運ぶ
    const an = deriv(sy, z), nu = derivNum(sy, z, 1e-6);
    // ブロックごと(ṙ・ṗ・Ṡ₁・Ṡ₂)に、そのブロックの大きさで割った相対差の最大を取る
    const blocks = [[0, 3, 'rdot'], [3, 6, 'pdot'], [6, 9, 'S1dot'], [9, 12, 'S2dot']];
    const per = {}; let worst = 0;
    for (const [i0, i1, nm] of blocks) {
      let s = 0, d = 0;
      for (let i = i0; i < i1; i++) { s = Math.max(s, Math.abs(an[i])); d = Math.max(d, Math.abs(an[i] - nu[i])); }
      per[nm] = (s > 0) ? d / s : d; worst = Math.max(worst, per[nm]);
    }
    rows.push({ tilt, relMaxDiff: worst, perBlock: per });
  }
  return rows;
}

// ============================================================ 検証 2/3/4: E・総 J・|S| の保存(dt 3 段)
function checkConservation(tilt, lambda, orbits) {
  const sy = makeSystem(lambda);
  const rows = [];
  for (const nStep of [2000, 4000, 8000]) {          // 1公転あたりの步数(dt = 2π/nStep)
    const dt = 2 * Math.PI / nStep;
    let z = init(sy, tilt);
    const c0 = consts(sy, z);
    let dE = 0, dJ = 0, dS1 = 0, dS2 = 0;
    const total = nStep * orbits;
    for (let k = 0; k < total; k++) {
      z = rk4(sy, z, dt);
      if ((k % 97) === 0 || k === total - 1) {
        const c = consts(sy, z);
        dE = Math.max(dE, Math.abs((c.E - c0.E) / c0.E));
        dJ = Math.max(dJ, Math.abs((c.Jm - c0.Jm) / c0.Jm));
        dS1 = Math.max(dS1, Math.abs((c.S1m - c0.S1m) / c0.S1m));
        dS2 = Math.max(dS2, Math.abs((c.S2m - c0.S2m) / c0.S2m));
      }
    }
    rows.push({ dt, stepsPerOrbit: nStep, orbits, relE: dE, relJ: dJ, relS1: dS1, relS2: dS2 });
  }
  // RK4 の 4 次収束(dt 半減で誤差 1/16)— 丸め床に当たっていなければ ratio≈16
  const ratio = [rows[0].relE / rows[1].relE, rows[1].relE / rows[2].relE];
  return { rows, orderRatioE: ratio };
}

// ============================================================ Δϖ_SO の実測(λ 一様掃引で線形性も見る)
//   手続き: λ 有り/無しを**同じ dt・同じ步数**で走らせ、LRL の向き ϖ(t) を一様サンプルして
//   直線 fit → 傾き差を取る(λ=0 側の傾きが数値床。差し引きで SO 分だけを残す)。
function measurePrecession(lambda, orbits, nStep) {
  const sy = makeSystem(lambda);
  const dt = 2 * Math.PI / nStep;
  let z = init(sy, 0);                    // 面外整列スピン(2D エンジンと同じ幾何 — Q·r̂=0)
  const total = nStep * orbits, sample = Math.max(1, Math.round(nStep / 64));
  const ts = [], angs = [];
  let prev = periAngle(sy, z).ang, unw = prev, base = prev;
  for (let k = 1; k <= total; k++) {
    z = rk4(sy, z, dt);
    if (k % sample === 0) {
      const A = periAngle(sy, z).ang;
      let d = A - prev; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
      unw += d; prev = A;
      ts.push(k * dt); angs.push(unw - base);
    }
  }
  // 直線 fit(短周期の振動は整数公転ぶんの一様サンプルでほぼ相殺する)
  const n = ts.length, mt = ts.reduce((s, v) => s + v, 0) / n, ma = angs.reduce((s, v) => s + v, 0) / n;
  let sxy = 0, sxx = 0;
  for (let i = 0; i < n; i++) { sxy += (ts[i] - mt) * (angs[i] - ma); sxx += (ts[i] - mt) ** 2; }
  const slope = sxy / sxx;                                   // rad / (無次元時間)
  return { lambda, orbits, stepsPerOrbit: nStep,
    radPerOrbit: slope * 2 * Math.PI,                        // 1公転=2π(無次元)
    degPerOrbit: slope * 2 * Math.PI * 180 / Math.PI,
    ecc: periAngle(sy, z).ecc };
}

// 解析の永年式(1次摂動 — ⟨1/r³⟩=1/(a³(1−e²)^{3/2}) から)
//   Δϖ_SO = −4π C A μ² k / L³ = −4πλG A / ( c²√(GM)·(a(1−e²))^{3/2} )
function analyticSO(lambda) {
  const p = a * (1 - OBS.e * OBS.e);
  const rad = -4 * Math.PI * lambda * OBS.G * Amag / (OBS.c * OBS.c * Math.sqrt(GM) * Math.pow(p, 1.5));
  return { radPerOrbit: rad, degPerOrbit: rad * 180 / Math.PI };
}
function analytic1PN() {
  const p = a * (1 - OBS.e * OBS.e);
  const rad = 6 * Math.PI * GM / (OBS.c * OBS.c * p);
  return { radPerOrbit: rad, degPerOrbit: rad * 180 / Math.PI };
}

// ============================================================ 実行
const out = { meta: { note: 'SO は参照専用 — エンジン(beta/index.html)には入れていない' } };

out.inputs = {
  G: OBS.G, c: OBS.c, m1: OBS.m1, m2: OBS.m2, M, mu, e: OBS.e, P: OBS.P,
  aFromKepler: a, aFromTable: 8.788366e8, aRelDiff: (a - 8.788366e8) / 8.788366e8,
  R: OBS.R, omegaA: OBS.omegaA, omegaB: OBS.omegaB,
  S1: S1mag, S2: S2mag, g1, g2, A: Amag,
  cHat: makeSystem(1).ch, S1hat: makeSystem(1).S1u, S2hat: makeSystem(1).S2u
};

log('  gradient check ...');
out.gradient = checkGradient();
log('  conservation (tilted spins, lambda=1e6) ...');
out.conservationTilted = checkConservation(0.7, 1e6, 3);
log('  conservation (aligned spins, lambda=1) ...');
out.conservationAligned = checkConservation(0, 1, 3);

const gradOK = out.gradient.every((r) => r.relMaxDiff < 1e-6);
const consOK = out.conservationTilted.rows.every((r) => r.relE < 1e-9 && r.relJ < 1e-10 && r.relS1 < 1e-9 && r.relS2 < 1e-9)
  && out.conservationAligned.rows.every((r) => r.relE < 1e-9 && r.relJ < 1e-10);
out.checks = { gradOK, consOK, pass: gradOK && consOK };

if (CHECK) {
  console.log(JSON.stringify({ checks: out.checks, gradient: out.gradient,
    conservationTilted: out.conservationTilted.rows, conservationAligned: out.conservationAligned.rows }, null, 1));
  process.exit(out.checks.pass ? 0 : 1);
}

log('  precession sweep (lambda linearity) ...');
out.precession = [];
for (const [lam, orb, ns] of [[0, 40, 4000], [1, 40, 4000], [1e3, 40, 4000], [1e6, 40, 4000], [1e6, 40, 8000]]) {
  out.precession.push(measurePrecession(lam, orb, ns));
  log(`    lambda=${lam} steps/orbit=${ns} done`);
}
// λ=0 を数値床として差し引く
const floor = out.precession.find((r) => r.lambda === 0);
out.precessionNet = out.precession.filter((r) => r.lambda !== 0).map((r) => ({
  lambda: r.lambda, stepsPerOrbit: r.stepsPerOrbit,
  degPerOrbitNet: r.degPerOrbit - floor.degPerOrbit,
  perUnitLambda: (r.degPerOrbit - floor.degPerOrbit) / r.lambda
}));

out.analytic = {
  so_lambda1: analyticSO(1),
  gr1PN: analytic1PN(),
  ratio_1PN_over_SO: analytic1PN().degPerOrbit / Math.abs(analyticSO(1).degPerOrbit)
};
const orbitsPerYear = OBS.yearSec / OBS.P;
out.observed = {
  omegaDotDegPerYr: OBS.omegaDotObsDegPerYr, orbitsPerYear,
  degPerOrbit: OBS.omegaDotObsDegPerYr / orbitsPerYear,
  degPerOrbit_at3577: OBS.omegaDotObsDegPerYr / 3577
};
out.compare = {
  dfmMeasured_degPerOrbit: 0.00945,             // 第247便a D2(framePrecision:"double" の収束値 — 参照だけ)
  obs_degPerOrbit: out.observed.degPerOrbit,
  gr1PN_degPerOrbit: out.analytic.gr1PN.degPerOrbit,
  so_degPerOrbit: out.analytic.so_lambda1.degPerOrbit,
  dfmOverObs: 0.00945 / out.observed.degPerOrbit,
  soNeededToCloseGap: (out.observed.degPerOrbit - 0.00945),
  soFractionOfGap: Math.abs(out.analytic.so_lambda1.degPerOrbit) / Math.abs(out.observed.degPerOrbit - 0.00945)
};

console.log(JSON.stringify(out, null, 1));
