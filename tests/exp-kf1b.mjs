// 第120便 exp-kf1b.mjs — kFrame=1 実単位サンプルの精密残差調査(原仮定者指示
// 「earthMoonRealKF1 は kF1 のまま実測に近付ける補正を調査する。重大な発見を予想している」
// 「saturnRingReal と mercuryReal の kF1 版を用意する」)
// - RL(Runge–Lenz)角の全步追跡+最小二乗勾配で Δϖ/公転を計測(第112便の手法)。
// - 分解: kF1 vs kF0 / スピン0 vs 実スピン vs ×10 / D0 用量 / λPN 0/1 — 引きずり起源の
//   歳差・周期残差の構造を確定し、「実測に近付ける補正」の候補を定量する。
// 実行: node tests/exp-kf1b.mjs(playwright 必須・数分)→ tests/out/kf1b-results.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + (TARGET.startsWith('/') ? TARGET : path.join(ROOT, TARGET));
const OUT_DIR = path.join(ROOT, 'tests', 'out');
fs.mkdirSync(OUT_DIR, { recursive: true });

async function launch() {
  const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  try { const { chromium } = await import('playwright'); return await chromium.launch(); } catch {}
  const { chromium } = await import('playwright-core');
  return chromium.launch({ executablePath: exe });
}

const browser = await launch();
const page = await browser.newPage();
page.on('pageerror', (e) => console.error('PAGE ERROR:', e.message));
await page.goto(INDEX);
await page.waitForFunction(() => window.HP && HP.sim);

const out = { target: TARGET, wave: 120, tests: {} };

// 二体(pinned 可)の RL 歳差・周期・e ドリフトを高精度計測
const runRL = (cfg) => page.evaluate(async (c) => {
  const P = c.phys, M = c.M, m2 = c.m2;
  const mu = c.pin ? M : M + m2;          // pinned 主星は相対二体の μ=GM のみ
  const GM = P.G * mu;
  const e = c.e || 0, a = c.a, rp = a * (1 - e);
  const vp = Math.sqrt(GM * (1 + e) / rp);
  const fm = c.pin ? 0 : m2 / (M + m2);
  const S = HP.sim;
  S.build({ id: 'kf1b', name: 'kf1b-' + c.id, emoji: '🧪', seed: 1,
    camera: { scale: 300 }, world: { boundary: 'none', size: 0 }, physics: P,
    bodies: [
      { type: 'single', m: M, radius: c.rM || undefined, x: -rp * fm, y: 0, vx: 0, vy: -vp * fm,
        spin: c.spinM || 0, pinned: !!c.pin, pnSource: true },
      { type: 'single', m: m2, radius: c.r2 || undefined, x: rp * (1 - fm), y: 0, vx: 0,
        vy: vp * (1 - fm), spin: c.spin2 || 0, pinned: false },
    ] });
  const TK = 2 * Math.PI * Math.sqrt(a * a * a / GM);
  const dt = 0.016, steps = Math.ceil((c.orbits || 5) * TK / dt);
  const SAMPLE = Math.max(1, Math.floor(steps / 4000));   // ≤4000 標本で LSQ
  let pomPrev = null, pomUnw = 0;
  let sT = 0, sP = 0, sTT = 0, sTP = 0, nS = 0;
  let e0 = null, eLast = 0, rmin = Infinity, rmax = 0;
  let ang = 0, px = 0, py = 0, tTwoPi = 0, collapsed = null;
  for (let k = 0; k < steps; k++) {
    S.step(dt);
    const dx = S.x[1] - S.x[0], dy = S.y[1] - S.y[0];
    const vx = S.vx[1] - S.vx[0], vy = S.vy[1] - S.vy[0];
    const rr = Math.hypot(dx, dy);
    if (rr < rmin) rmin = rr; if (rr > rmax) rmax = rr;
    if (k === 0) { px = dx; py = dy; }
    else { ang += Math.atan2(px * dy - py * dx, px * dx + py * dy); px = dx; py = dy;
      if (!tTwoPi && Math.abs(ang) >= 2 * Math.PI) tTwoPi = (k + 1) * dt; }
    if (rr > 3 * a || rr < a / 4 || S.hasNaN()) { collapsed = (k + 1) * dt / TK; break; }
    if (k % SAMPLE === 0) {
      const h = dx * vy - dy * vx;
      const ex = (vy * h) / GM - dx / rr, ey = (-vx * h) / GM - dy / rr;
      const ecc = Math.hypot(ex, ey), pom = Math.atan2(ey, ex);
      if (e0 === null) e0 = ecc;
      eLast = ecc;
      if (pomPrev !== null) {
        let d = pom - pomPrev;
        while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
        pomUnw += d;
      }
      pomPrev = pom;
      const t = (k + 1) * dt;
      sT += t; sP += pomUnw; sTT += t * t; sTP += t * pomUnw; nS++;
    }
  }
  const slope = (nS > 2) ? (nS * sTP - sT * sP) / (nS * sTT - sT * sT) : NaN;   // rad / t.u.
  return { dPomPerOrbit: slope * TK, TK, T: tTwoPi || null,
    Tres: tTwoPi ? tTwoPi / TK - 1 : null, e0, eDrift: eLast - e0,
    amp: (rmax - rmin) / ((rmax + rmin) / 2), collapsed, nan: S.hasNaN() };
}, cfg);

const fmtR = (r) => `Δϖ/公転=${isFinite(r.dPomPerOrbit) ? r.dPomPerOrbit.toExponential(3) : '—'}` +
  ` T/TK−1=${r.Tres != null ? (r.Tres * 100).toFixed(3) + '%' : '—'} eドリフト=${r.eDrift.toExponential(2)}` +
  (r.collapsed ? ` 崩壊@${r.collapsed.toFixed(2)}` : '') + ` NaN=${r.nan}`;

// ---- A) 🌘 地球月(実単位・自由二体)の kF1 残差分解 ----
{
  const base = { G: 6.674, D0: 0.1, kFrame: 1, q: 3, kRep: 0, muF: 0, gammaN: 0, kappaS: 0,
    Kt: 134851663.17051244, cLight: 30000, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
    massFloor: 1e-6, geoPN: 2, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 0.5,
    timeScale: 1, stateCarry: 'double' };
  const mk = (id, over, extra) => Object.assign({ id, M: 0.59724, m2: 0.007346, a: 384.748,
    e: 0.0549, rM: 6.38, r2: 1.74, spinM: 0.0072921, spin2: 0.00026617, orbits: 5,
    phys: Object.assign({}, base, over) }, extra);
  const A = {};
  console.log('== A) 🌘 地球月 kF1 残差分解(5公転・RL 全步LSQ)==');
  A.kF0 = await runRL(mk('kF0', { kFrame: 0 }));
  console.log(`[A0 kF0(🌙)          ] ${fmtR(A.kF0)}`);
  A.kF1 = await runRL(mk('kF1', {}));
  console.log(`[A1 kF1(🌘)          ] ${fmtR(A.kF1)}`);
  A.kF1spin0 = await runRL(mk('kF1s0', {}, { spinM: 0, spin2: 0 }));
  console.log(`[A2 kF1 スピン0        ] ${fmtR(A.kF1spin0)}`);
  A.kF1spinX10 = await runRL(mk('kF1s10', {}, { spinM: 0.072921, spin2: 0.0026617 }));
  console.log(`[A3 kF1 スピン×10      ] ${fmtR(A.kF1spinX10)}`);
  A.kF1spinX100 = await runRL(mk('kF1s100', {}, { spinM: 0.72921, spin2: 0.026617 }));
  console.log(`[A4 kF1 スピン×100     ] ${fmtR(A.kF1spinX100)}`);
  A.kF1d0x10 = await runRL(mk('kF1d1', { D0: 1 }));
  console.log(`[A5 kF1 D0=1           ] ${fmtR(A.kF1d0x10)}`);
  A.kF1lam0 = await runRL(mk('kF1l0', { lambdaPN: 0 }));
  console.log(`[A6 kF1 λPN=0          ] ${fmtR(A.kF1lam0)}`);
  out.tests.earthMoonKF1 = A;
  const drag = A.kF1.dPomPerOrbit - A.kF0.dPomPerOrbit;
  console.log(`[A:引きずり歳差       ] kF1−kF0 = ${drag.toExponential(3)} rad/公転(スピン0: ${(A.kF1spin0.dPomPerOrbit - A.kF0.dPomPerOrbit).toExponential(3)})`);
}

// ---- B) ☄️ 水星(実単位・pinned 太陽)の kF1 残差分解 ----
{
  const base = { G: 6.674, D0: 0.1, kFrame: 1, q: 3, kRep: 0, muF: 0, gammaN: 0, kappaS: 0,
    Kt: 134851663.17051244, cLight: 30000, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
    massFloor: 1e-6, geoPN: 2, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 2,
    timeScale: 1, stateCarry: 'double' };
  const mk = (id, over, extra) => Object.assign({ id, M: 1988.5, m2: 0.00033011, a: 579.09,
    e: 0.20563, rM: 6.95, r2: 0.0244, spinM: 0.029031, spin2: 0.0124, pin: true, orbits: 8,
    phys: Object.assign({}, base, over) }, extra);
  const B = {};
  console.log('== B) ☄️ 水星 kF1 残差分解(8公転)==');
  B.kF0 = await runRL(mk('kF0', { kFrame: 0 }));
  console.log(`[B0 kF0(☄️)           ] ${fmtR(B.kF0)}(1PN 解析値 5.02e-7 rad/公転)`);
  B.kF1 = await runRL(mk('kF1', {}));
  console.log(`[B1 kF1(実スピン)      ] ${fmtR(B.kF1)}`);
  B.kF1spin0 = await runRL(mk('kF1s0', {}, { spinM: 0, spin2: 0 }));
  console.log(`[B2 kF1 スピン0        ] ${fmtR(B.kF1spin0)}`);
  B.kF1lam0 = await runRL(mk('kF1l0', { lambdaPN: 0 }));
  console.log(`[B3 kF1 λPN=0(引きずりのみ)] ${fmtR(B.kF1lam0)}`);
  out.tests.mercuryKF1 = B;
  console.log(`[B:引きずり歳差       ] kF1−kF0 = ${(B.kF1.dPomPerOrbit - B.kF0.dPomPerOrbit).toExponential(3)} rad/公転`);
}

// ---- C) 💍 土星環の kF1(引きずり誇張対照)— 帯保持と Ω 残差 ----
{
  const phys = { G: 6.674, D0: 0.1, kFrame: 1, q: 3, kRep: 0, muF: 0, gammaN: 0, kappaS: 0,
    Kt: 134851663.17051244, cLight: 30000, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
    massFloor: 1e-6, geoPN: 2, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 0.05,
    timeScale: 1, stateCarry: 'double' };
  const r = await page.evaluate(async ({ phys, kF }) => {
    const P = Object.assign({}, phys, { kFrame: kF });
    const M = 5.6834, GM = P.G * M;
    const bands = [[7.466, 9.2], [9.2, 11.758], [12.217, 13.678]];
    const bodies = [{ type: 'single', m: M, radius: 6.03, x: 0, y: 0, vx: 0, vy: 0,
      spin: 0.16527, pinned: true, pnSource: true }];
    for (const [rIn, rOut] of bands)
      bodies.push({ type: 'ring', n: 40, cx: 0, cy: 0, rIn, rOut, mMin: 0.001, mMax: 0.001,
        rMul: 0.31623, spinMin: 0, spinMax: 0, vMode: 'kepler', aroundMass: M, omega: 0,
        vNoise: 0, direction: 1, pinned: false });
    const S = HP.sim;
    S.build({ id: 'kf1bC', name: 'kf1b-ring', emoji: '🧪', seed: 1,
      camera: { scale: 20 }, world: { boundary: 'none', size: 0 }, physics: P, bodies });
    const r0 = new Float64Array(S.n), a0 = new Float64Array(S.n);
    for (let i = 1; i < S.n; i++) { r0[i] = Math.hypot(S.x[i], S.y[i]); a0[i] = Math.atan2(S.y[i], S.x[i]); }
    const TC = 2 * Math.PI * Math.sqrt(Math.pow(7.466, 3) / GM);   // C環内縁周期
    const dt = 0.016, steps = Math.ceil(3 * TC / dt);
    const angAcc = new Float64Array(S.n); const aPrev = a0.slice();
    for (let k = 0; k < steps; k++) { S.step(dt);
      for (let i = 1; i < S.n; i++) { const a1 = Math.atan2(S.y[i], S.x[i]);
        let d = a1 - aPrev[i]; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
        angAcc[i] += d; aPrev[i] = a1; } }
    let inBand = 0, omRes = [], rShift = [];
    for (let i = 1; i < S.n; i++) {
      const rr = Math.hypot(S.x[i], S.y[i]);
      if (rr > 6.5 && rr < 15) inBand++;
      const omK = Math.sqrt(GM / Math.pow(r0[i], 3));
      omRes.push(angAcc[i] / (steps * dt) / omK - 1);
      rShift.push(rr / r0[i] - 1);
    }
    omRes.sort((x, y) => x - y); rShift.sort((x, y) => x - y);
    const med = (arr) => arr[Math.floor(arr.length / 2)];
    return { n: S.n - 1, inBand, omResMed: med(omRes), rShiftMed: med(rShift), nan: S.hasNaN() };
  }, { phys, kF: 1 });
  console.log(`== C) 💍 kF1 環(3×C環周期)== 保持=${r.inBand}/${r.n} Ω残差中央=${(r.omResMed * 100).toFixed(2)}% r移動中央=${(r.rShiftMed * 100).toFixed(2)}% NaN=${r.nan}`);
  out.tests.saturnKF1 = r;
}

// ---- D) 🌘 近点回転較正の検証(第120便採用値 D₀=0.006・f=0.9968)----
// 目標: 恒星月 27.3217日・近点回転 0.05311 rad/公転(8.85年)。用量: Δϖ∝χ=w/(D₀+w)
// (D₀ 0.1→1 で 1/10.7・0.02〜0.003 の掃引は単調 — セッション実測)。窓依存 ±15% を明記
{
  const base = { G: 6.674, D0: 0.006, kFrame: 1, q: 3, kRep: 0, muF: 0, gammaN: 0, kappaS: 0,
    Kt: 134851663.17051244, cLight: 30000, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
    massFloor: 1e-6, geoPN: 2, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 0.1,
    timeScale: 1, stateCarry: 'double' };
  const r = await page.evaluate(async ({ phys, f }) => {
    const P = phys, M = 0.59724, m2 = 0.007346, mu = M + m2, GM = P.G * mu;
    const e = 0.0549, a = 384.748, rp = a * (1 - e);
    const vp = Math.sqrt(GM * (1 + e) / rp) * f, fm = m2 / mu, S = HP.sim;
    S.build({ id: 'kf1bD', name: 'kf1b-cal', emoji: '🧪', seed: 1,
      camera: { scale: 450 }, world: { boundary: 'none', size: 0 }, physics: P,
      bodies: [
        { type: 'single', m: M, radius: 6.38, x: -rp * fm, y: 0, vx: 0, vy: -vp * fm,
          spin: 0.0072921, pinned: false, pnSource: true },
        { type: 'single', m: m2, radius: 1.74, x: rp * (1 - fm), y: 0, vx: 0,
          vy: vp * (1 - fm), spin: 0.00026617, pinned: false }] });
    const TK = 2 * Math.PI * Math.sqrt(a * a * a / GM), dt = 0.016, steps = Math.ceil(8 * TK / dt);
    const SAMPLE = Math.max(1, Math.floor(steps / 6000));
    let pomPrev = null, pomUnw = 0, sT = 0, sP = 0, sTT = 0, sTP = 0, nS = 0, t2pi = [];
    let ang = 0, px = 0, py = 0;
    for (let k = 0; k < steps; k++) { S.step(dt);
      const dx = S.x[1] - S.x[0], dy = S.y[1] - S.y[0], vx = S.vx[1] - S.vx[0], vy = S.vy[1] - S.vy[0];
      const rr = Math.hypot(dx, dy);
      if (k === 0) { px = dx; py = dy; }
      else { ang += Math.atan2(px * dy - py * dx, px * dx + py * dy); px = dx; py = dy;
        if (Math.abs(ang) >= 2 * Math.PI * (t2pi.length + 1)) t2pi.push((k + 1) * dt); }
      if (k % SAMPLE === 0) { const h = dx * vy - dy * vx;
        const ex = (vy * h) / GM - dx / rr, ey = (-vx * h) / GM - dy / rr, pom = Math.atan2(ey, ex);
        if (pomPrev !== null) { let d = pom - pomPrev;
          while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; pomUnw += d; }
        pomPrev = pom; const t = (k + 1) * dt;
        sT += t; sP += pomUnw; sTT += t * t; sTP += t * pomUnw; nS++; } }
    let Tavg = null; if (t2pi.length >= 2) { let acc = 0;
      for (let i = 1; i < t2pi.length; i++) acc += t2pi[i] - t2pi[i - 1]; Tavg = acc / (t2pi.length - 1); }
    const slope = (nS * sTP - sT * sP) / (nS * sTT - sT * sT);
    return { dPomPerOrbit: slope * (Tavg || TK), Tday: Tavg ? Tavg * 100 / 86400 : null };
  }, { phys: base, f: 0.9968 });
  console.log(`== D) 🌘 較正検証(D₀=0.006・f=0.9968・8公転)== Δϖ比=${(r.dPomPerOrbit / 0.05311).toFixed(3)}(目標1.0・窓±15%) T=${r.Tday?.toFixed(4)}日(観測 27.3217)`);
  out.tests.calibration = r;
}

fs.writeFileSync(path.join(OUT_DIR, 'kf1b-results.json'), JSON.stringify(out, null, 2));
console.log('saved: tests/out/kf1b-results.json');
await browser.close();
