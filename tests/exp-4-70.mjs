// 第70便 検証実験: ①💫galaxyGeo2 較正 ②減光の力学不変性 ③隠れ質量ラダー(重い暗黒中心核)
//                  ④ディスク/バルジ温度 C1(光学: 中心部の見かけ低温化) ⑤同 C2(熱斥力による力学選別)
// - 3外部分析(Gemini/ChatGPT/Grok 2026-08-04)の採択項目の実測。QA 窓の較正と、
//   「減光で暗いが重い天体」「ディスク高温星/バルジ低温星」のモデル内機構の初実測を出す。
// - 出力: tests/out/exp-4-70.json(合否は QA 側 — 本スクリプトは実測の記録)
// 実行: node tests/exp-4-70.mjs(既定 beta)
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
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
page.on('pageerror', (e) => console.log('PAGEERROR:', e.message));
await page.goto(INDEX);
await page.waitForFunction(() => window.HP && HP.sim);

// ---- E1: 💫galaxyGeo2 の較正(プリセット経由 — QA claim.galaxygeo2-outerboost と同一経路) ----
const e1 = await page.evaluate(() => {
  const s = HP.sim;
  HP.loadPreset('galaxyGeo2', false);
  HP.abStart('kFrame', 0);
  const abG = HP.ab();
  const outer = (sm) => { let sum = 0, c = 0;
    for (let i = 1; i < sm.n; i++) { const rr = Math.hypot(sm.x[i], sm.y[i]);
      if (rr >= 156 && rr <= 286) { sum += (sm.x[i] * sm.vy[i] - sm.y[i] * sm.vx[i]) / rr; c++; } }
    return c ? sum / c : 0; };
  for (let k = 0; k < 6000; k++) { s.step(0.016); abG.simB.step(0.016); }
  const gA = outer(s), gB = outer(abG.simB);
  const spec = s.mechSpec(true);
  const bad = s.hasNaN() || abG.simB.hasNaN();
  const clampV = s.clampVN;
  HP.abStop();
  return { gA, gB, ratio: gA / gB, pi: spec ? spec.pi : null, bad, clampV };
});
console.log('E1 galaxyGeo2:', JSON.stringify(e1));

// ---- E2: 減光の力学不変性 — lightSweep は光学のみ(etaRad=0 で軌道・スピン・時計・光線が bit 一致) ----
// disk 群の新属性 lightSweep:"auto"(第70便)も同時に配線検査する
const e2 = await page.evaluate(() => {
  const build = (lsw) => {
    HP.sim.build({ id: 'e2', name: 'd', description: 'd', camera: { scale: 300 },
      world: { boundary: 'none', size: 0 }, seed: 20260804,
      physics: { G: 0.8, D0: 1.5, kFrame: 1, q: 2, kRep: 0.5, muF: 0.3, gammaN: 0.2, kappaS: 0.05,
        Kt: 50, cLight: 60, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
        geoPN: 0, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 3, timeScale: 1 },
      bodies: [
        { type: 'single', rMul: 1.2, m: 2500, x: 0, y: 0, vx: 0, vy: 0, spin: 1.2, pinned: true, radius: 15,
          ...(lsw === null ? {} : { lightSweep: lsw }) },
        { type: 'disk', rMul: 1.2, n: 120, cx: 0, cy: 0, radius: 220, mMin: 0.2, mMax: 0.5,
          spinMin: 0.5, spinMax: 1.5, vMode: 'kepler', aroundMass: 2500, vScale: 1.05, direction: 1,
          bulkVx: 0, bulkVy: 0, ...(lsw === null ? {} : { lightSweep: lsw }) }] });
    return HP.sim;
  };
  const run = (lsw) => {
    const S = build(lsw);
    const wired = { auto: 0, lswNonZero: 0 };
    for (let i = 0; i < S.n; i++) { if (S.lSwAuto[i]) wired.auto++; }
    for (let k = 0; k < 2000; k++) S.step(0.016);
    for (let i = 0; i < S.n; i++) { if (S.lSw[i] > 0) wired.lswNonZero++; }
    const ray = HP.traceRay(S, -400, 30, 1, 0, 2, 400, null);
    return { x: [...S.x], y: [...S.y], vx: [...S.vx], vy: [...S.vy], sp: [...S.spin],
      tau: [...S.tau], ray: [ray.cx, ray.cy], wired, n: S.n };
  };
  const a = run(null), b = run('auto'), c = run(1);
  const diffCount = (p, q) => { let d = 0;
    for (let i = 0; i < p.x.length; i++)
      for (const kk of ['x', 'y', 'vx', 'vy', 'sp', 'tau']) if (p[kk][i] !== q[kk][i]) d++;
    return d; };
  return { n: a.n,
    autoWired: b.wired, fixedWired: c.wired,
    dynDiffAuto: diffCount(a, b), dynDiffFixed: diffCount(a, c),
    rayDiffAuto: Math.hypot(a.ray[0] - b.ray[0], a.ray[1] - b.ray[1]),
    rayDiffFixed: Math.hypot(a.ray[0] - c.ray[0], a.ray[1] - c.ray[1]) };
});
console.log('E2 dimming-invariance:', JSON.stringify(e2));

// ---- E3: 隠れ質量ラダー — 「暗いが重い」中心核(減光 auto・pinned)で光度と力学質量が分離する ----
const e3 = await page.evaluate(() => {
  const run = (mC) => {
    HP.sim.build({ id: 'e3', name: 'd', description: 'd', camera: { scale: 300 },
      world: { boundary: 'none', size: 0 }, seed: 20260804,
      physics: { G: 0.8, D0: 1.5, kFrame: 1, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0,
        Kt: 50, cLight: 60, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
        geoPN: 0, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 3, timeScale: 1 },
      bodies: [
        { type: 'single', rMul: 1.2, m: mC, x: 0, y: 0, vx: 0, vy: 0, spin: 2, pinned: true,
          radius: 15, lightSweep: 'auto' },
        { type: 'disk', rMul: 1.2, n: 200, cx: 0, cy: 0, radius: 260, mMin: 0.16, mMax: 0.5,
          spinMin: 0, spinMax: 0, vMode: 'kepler', aroundMass: mC, vScale: 1.0, direction: 1,
          bulkVx: 0, bulkVy: 0 }] });
    const S = HP.sim;
    for (let k = 0; k < 3000; k++) S.step(0.016);
    // 光学: 中心核の実効減光と観測温度(T=I·s²・T_obs=(1−lS)·T)
    const I0 = 0.5 * S.m[0] * S.R[0] * S.R[0], T0 = I0 * S.spin[0] * S.spin[0];
    const lS = S.lSw[0], Tobs = (1 - lS) * T0;
    // 力学: 外側恒星帯 [140,260] の v²r/G から見た動力学質量(円軌道近似)
    const G = S.params.G; let mDyn = 0, c = 0;
    for (let i = 1; i < S.n; i++) { const rr = Math.hypot(S.x[i], S.y[i]);
      if (rr >= 140 && rr <= 260) { const v2 = S.vx[i] * S.vx[i] + S.vy[i] * S.vy[i];
        mDyn += v2 * rr / G; c++; } }
    mDyn = c ? mDyn / c : 0;
    // 光線: 屈折角(質量とともに増える — 光学的に暗くても時空効果は残る)
    const ray = HP.traceRay(S, -400, 40, 1, 0, 2, 400, null);
    const bend = Math.atan2(ray.cy, ray.cx);
    return { mC, lS, T0, Tobs, mDyn, mDynRatio: mDyn / mC, bend, clampV: S.clampVN, nan: S.hasNaN() };
  };
  return [run(2500), run(5000), run(10000)];
});
console.log('E3 hidden-mass ladder:', JSON.stringify(e3));

// ---- E4: ディスク/バルジ温度 C1(光学) — 真の温度が全星同一でも、中心部ほど減光して見かけが低温になるか ----
// 全恒星 spin=1(真の温度は半径によらず同一)+ lightSweep:"auto"(disk 群の新属性)・etaRad=0・kRep=0
const e4 = await page.evaluate(() => {
  HP.sim.build({ id: 'e4', name: 'd', description: 'd', camera: { scale: 400 },
    world: { boundary: 'none', size: 0 }, seed: 20260804,
    physics: { G: 0.8, D0: 1.5, kFrame: 1, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0,
      Kt: 50, cLight: 60, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
      geoPN: 0, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 3, timeScale: 1 },
    bodies: [
      { type: 'single', rMul: 1.2, m: 2500, x: 0, y: 0, vx: 0, vy: 0, spin: 1.2, pinned: true, radius: 15 },
      { type: 'disk', rMul: 1.2, n: 380, cx: 0, cy: 0, radius: 260, mMin: 0.16, mMax: 0.5,
        spinMin: 1, spinMax: 1, vMode: 'kepler', aroundMass: 2500, vScale: 1.05, direction: 1,
        bulkVx: 0, bulkVy: 0, lightSweep: 'auto' }] });
  const S = HP.sim;
  for (let k = 0; k < 3000; k++) S.step(0.016);
  // 半径5ビンの「真の温度 T=I·s²」と「観測温度 T_obs=(1−lS_eff)·T」の平均
  const bins = [[0, 60], [60, 110], [110, 160], [160, 210], [210, 300]];
  const out = bins.map(() => ({ T: 0, Tobs: 0, lS: 0, c: 0 }));
  for (let i = 1; i < S.n; i++) {
    const rr = Math.hypot(S.x[i], S.y[i]);
    const I = 0.5 * S.m[i] * S.R[i] * S.R[i], T = I * S.spin[i] * S.spin[i];
    for (let b = 0; b < bins.length; b++) if (rr >= bins[b][0] && rr < bins[b][1]) {
      out[b].T += T; out[b].Tobs += (1 - S.lSw[i]) * T; out[b].lS += S.lSw[i]; out[b].c++; break; }
  }
  return out.map((o, b) => ({ bin: bins[b], n: o.c, Tmean: o.c ? o.T / o.c : 0,
    TobsMean: o.c ? o.Tobs / o.c : 0, lSmean: o.c ? o.lS / o.c : 0 }));
});
console.log('E4 diskBulge C1 (optics):', JSON.stringify(e4));

// ---- E5: ディスク/バルジ温度 C2(力学選別) — 熱斥力(kRep)は高温星を外へ・低温星を中心へ選別するか ----
// 初期温度は半径に依存しない(高温 spin=2 と低温 spin=0.2 を全域に一様混合)。A: kRep=1 / B: kRep=0
const e5 = await page.evaluate(() => {
  const run = (kRep) => {
    HP.sim.build({ id: 'e5', name: 'd', description: 'd', camera: { scale: 400 },
      world: { boundary: 'none', size: 0 }, seed: 20260804,
      physics: { G: 0.8, D0: 1.5, kFrame: 1, q: 2, kRep, muF: 0, gammaN: 0, kappaS: 0,
        Kt: 50, cLight: 60, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
        geoPN: 0, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 3, timeScale: 1 },
      bodies: [
        { type: 'single', rMul: 1.2, m: 2500, x: 0, y: 0, vx: 0, vy: 0, spin: 1.2, pinned: true, radius: 15 },
        // 同一 seed で2群を同心に重ねる(disk 生成の rng 消費が同回数 → 初期半径分布は両群同形)
        { type: 'disk', rMul: 1.2, n: 190, cx: 0, cy: 0, radius: 260, mMin: 0.3, mMax: 0.3,
          spinMin: 2, spinMax: 2, vMode: 'kepler', aroundMass: 2500, vScale: 1.05, direction: 1,
          bulkVx: 0, bulkVy: 0 },
        { type: 'disk', rMul: 1.2, n: 190, cx: 0, cy: 0, radius: 260, mMin: 0.3, mMax: 0.3,
          spinMin: 0.2, spinMax: 0.2, vMode: 'kepler', aroundMass: 2500, vScale: 1.05, direction: 1,
          bulkVx: 0, bulkVy: 0 }] });
    const S = HP.sim;
    const meanR = (hot) => { let s = 0, c = 0;
      for (let i = 1; i < S.n; i++) { const isHot = S.spin[i] > 1;
        if (isHot === hot) { s += Math.hypot(S.x[i], S.y[i]); c++; } }
      return c ? s / c : 0; };
    const r0 = { hot: meanR(true), cold: meanR(false) };
    for (let k = 0; k < 6000; k++) S.step(0.016);
    const r1 = { hot: meanR(true), cold: meanR(false) };
    return { kRep, r0, r1, sep0: r0.hot / r0.cold, sep1: r1.hot / r1.cold,
      clampV: S.clampVN, nan: S.hasNaN() };
  };
  return { A: run(1), B: run(0) };
});
console.log('E5 diskBulge C2 (kRep sorting):', JSON.stringify(e5));

// ---- E5b: 選別の帰属分解 — E6′切り(kFrame=0)・中心スピン0 の対照 ----
const e5b = await page.evaluate(() => {
  const run = (kFrame, centerSpin) => {
    HP.sim.build({ id: 'e5b', name: 'd', description: 'd', camera: { scale: 400 },
      world: { boundary: 'none', size: 0 }, seed: 20260804,
      physics: { G: 0.8, D0: 1.5, kFrame, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0,
        Kt: 50, cLight: 60, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
        geoPN: 0, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 3, timeScale: 1 },
      bodies: [
        { type: 'single', rMul: 1.2, m: 2500, x: 0, y: 0, vx: 0, vy: 0, spin: centerSpin, pinned: true, radius: 15 },
        { type: 'disk', rMul: 1.2, n: 190, cx: 0, cy: 0, radius: 260, mMin: 0.3, mMax: 0.3,
          spinMin: 2, spinMax: 2, vMode: 'kepler', aroundMass: 2500, vScale: 1.05, direction: 1, bulkVx: 0, bulkVy: 0 },
        { type: 'disk', rMul: 1.2, n: 190, cx: 0, cy: 0, radius: 260, mMin: 0.3, mMax: 0.3,
          spinMin: 0.2, spinMax: 0.2, vMode: 'kepler', aroundMass: 2500, vScale: 1.05, direction: 1, bulkVx: 0, bulkVy: 0 }] });
    const S = HP.sim;
    const meanR = (hot) => { let s = 0, c = 0;
      for (let i = 1; i < S.n; i++) { const isHot = S.spin[i] > 1;
        if (isHot === hot) { s += Math.hypot(S.x[i], S.y[i]); c++; } }
      return c ? s / c : 0; };
    for (let k = 0; k < 6000; k++) S.step(0.016);
    return { kFrame, centerSpin, hot: meanR(true), cold: meanR(false),
      sep: meanR(true) / meanR(false), nan: S.hasNaN() };
  };
  return { noDrag: run(0, 1.2), dragNoCtrSpin: run(1, 0) };
});
console.log('E5b attribution:', JSON.stringify(e5b));

// ---- E5c: 一様スピン円盤の単独応答 — 各星の自分のスピンは軌道減衰率を変えない(混合でのみ選別) ----
const e5c = await page.evaluate(() => {
  const run = (spinAll) => {
    HP.sim.build({ id: 'e5c', name: 'd', description: 'd', camera: { scale: 400 },
      world: { boundary: 'none', size: 0 }, seed: 20260804,
      physics: { G: 0.8, D0: 1.5, kFrame: 1, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0,
        Kt: 50, cLight: 60, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
        geoPN: 0, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 3, timeScale: 1 },
      bodies: [
        { type: 'single', rMul: 1.2, m: 2500, x: 0, y: 0, vx: 0, vy: 0, spin: 1.2, pinned: true, radius: 15 },
        { type: 'disk', rMul: 1.2, n: 380, cx: 0, cy: 0, radius: 260, mMin: 0.3, mMax: 0.3,
          spinMin: spinAll, spinMax: spinAll, vMode: 'kepler', aroundMass: 2500, vScale: 1.05,
          direction: 1, bulkVx: 0, bulkVy: 0 }] });
    const S = HP.sim;
    let s0 = 0; for (let i = 1; i < S.n; i++) s0 += Math.hypot(S.x[i], S.y[i]); s0 /= (S.n - 1);
    for (let k = 0; k < 6000; k++) S.step(0.016);
    let s1 = 0, spAvg = 0; for (let i = 1; i < S.n; i++) { s1 += Math.hypot(S.x[i], S.y[i]); spAvg += S.spin[i]; }
    s1 /= (S.n - 1); spAvg /= (S.n - 1);
    return { spinAll, r0: s0, r1: s1, shrink: s1 / s0, spinEnd: spAvg, nan: S.hasNaN() };
  };
  return { allCold: run(0.2), allHot: run(2), mid: run(1) };
});
console.log('E5c uniform-spin response:', JSON.stringify(e5c));

const out = { meta: { exp: '4-70', target: TARGET, date: new Date().toISOString().slice(0, 10) },
  e1_galaxyGeo2: e1, e2_dimmingInvariance: e2, e3_hiddenMass: e3, e4_opticsC1: e4, e5_sortingC2: e5,
  e5b_attribution: e5b, e5c_uniformSpin: e5c };
fs.writeFileSync(path.join(OUT_DIR, 'exp-4-70.json'), JSON.stringify(out, null, 2));
console.log('→ tests/out/exp-4-70.json');
await browser.close();
