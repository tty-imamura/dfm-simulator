// 第246便b: λ=1 のスピン–スピン力が「信号」か「丸めの床」かを分ける最小の実験。
//   ① λ=1e-12 と λ=1e-6 の 4.3 公転がビット同一なら、λ≲1e9 の差は床である
//   ② 1 步のキック Δv を理論値 η·a_N·dt と Float32 の 1 ulp に並べる
// 実行: node _scratch-exp-w246b-floor.mjs
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = path.dirname(fileURLToPath(import.meta.url));
const INDEX = 'file://' + path.join(ROOT, 'beta/index.html');
let browser;
try { const { chromium } = await import('playwright'); browser = await chromium.launch(); }
catch { const { chromium } = await import('playwright-core');
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }); }
const pg = await browser.newPage();
await pg.goto(INDEX, { waitUntil: 'load' });
await pg.waitForFunction(() => window.HP && HP.sim);
const r = await pg.evaluate(() => {
  const base = JSON.parse(JSON.stringify(HP.allPresets().find((q) => q.id === 'psrDoubleABDFM')));
  const run = (lam, steps) => {
    const pd = JSON.parse(JSON.stringify(base));
    if (lam !== null) pd.physics = Object.assign({}, pd.physics, { spinSpin: lam });
    const v = HP.validatePreset(pd); const S = HP.sim; S.build(v.preset);
    for (let k = 0; k < steps; k++) S.step(0.016);
    const o = []; for (let i = 0; i < S.n; i++) o.push(S.x[i], S.y[i], S.vx[i], S.vy[i]);
    return o;
  };
  const bit = (a, b) => a.every((z, i) => Object.is(z, b[i]));
  const dmax = (a, b) => Math.max(...a.map((z, i) => Math.abs(z - b[i])));
  const N = Math.round(3792 / 0.016);                    // 4.3 公転
  const a = run(1e-12, N), b = run(1e-6, N), c = run(1, N), z = run(0, N);
  const one = (() => {
    const pd = JSON.parse(JSON.stringify(base));
    pd.physics = Object.assign({}, pd.physics, { spinSpin: 1 });
    const v = HP.validatePreset(pd); const S = HP.sim; S.build(v.preset);
    const vx0 = S.vx[0], vy0 = S.vy[0], dt = 0.016;
    S._spinSpin(dt);
    const dx = S.x[0] - S.x[1], dy = S.y[0] - S.y[1], rr = Math.hypot(dx, dy);
    const rho2 = rr * rr + S.params.softening ** 2, aN = S.params.G * S.m[1] / rho2;
    const eta = HP.dfmSpinSpinEta(0, 1);
    const f0 = Math.fround(vy0), f1 = Math.fround(f0 * (1 + 2 ** -23));
    return { dvx: S.vx[0] - vx0, dvTheory: -eta * aN * dt, eta, vy0, ulp: Math.abs(f1 - f0) };
  })();
  return { bit_1em12_vs_1em6: bit(a, b), d_1em12_1em6: dmax(a, b),
    d_0_1em12: dmax(z, a), d_0_1: dmax(z, c), d_1em12_1: dmax(a, c), one };
});
console.log(JSON.stringify(r, null, 1));
await browser.close();
