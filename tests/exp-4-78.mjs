// 第77便 実験 4-78: 🌱星の種ローター — 圧縮スピンアップ+パワーボール(コアv2 の実演)
// 裁定(2026-08-05): スピン加速の主要因=自己重力圧縮(contract — J保存で Ω=J/I 上昇)。
// パワーボール原理=さらに加速する副機構(殻の振動加速度が、コアが差動〔軸自由〕のとき加速・
// rigid〔軸固定〕のとき減速)。核融合は密度増の副産物(本実験に熱源なし)。
// 構成: 親天体(pinned)+鏡像の楕円軌道に2つの種 — A=differential(加速・暗化)/
//        B=rigid(同じ揺すりで減速)。1画面で対比が見える。
// 出力: tests/out/exp-4-78.json
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

// over: {pump, contract, omega0, rigidSpin, steps}
const run = (ov) => page.evaluate((o) => {
  const v = HP.validatePreset({ name: 't', description: 'd', camera: { scale: 320 },
    world: { boundary: 'none', size: 0 }, seed: 20260805,
    physics: { G: 0.8, D0: 1.5, kFrame: 1, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, Kt: 50,
      cLight: 40, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0, geoPN: 0, lambdaPN: 1,
      pnAlpha: 1.5, radiusScale: 1, softening: 3, timeScale: 2 },
    bodies: [
      { type: 'single', rMul: 1, m: 400, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: true, radius: 10 },
      { type: 'single', rMul: 1, m: 40, x: 120, y: 0, vx: 0, vy: 1.2, spin: 0.3, pinned: false,
        radius: 6, lightSweep: 'auto',
        core: { mode: 'differential', massFrac: 0.3, radius: 3, omega: o.omega0,
          pump: o.pump, contract: o.contract } },
      { type: 'single', rMul: 1, m: 40, x: -120, y: 0, vx: 0, vy: -1.2, spin: o.rigidSpin, pinned: false,
        radius: 6, lightSweep: 'auto',
        core: { mode: 'rigid', massFrac: 0.3, radius: 3, pump: o.pump } } ] });
  HP.sim.build(v.preset);
  const S = HP.sim;
  const L0 = S.totals().L + S.resL + S.radL;
  const a0 = HP.coreState(1), b0 = { spin: S.spin[2] };
  const series = [];
  for (let k = 0; k < o.steps; k++) {
    S.step(0.016);
    if ((k + 1) % 1500 === 0) series.push({ k: k + 1, om: HP.coreState(1).omega,
      Rc: HP.coreState(1).Rc, lSwA: S.lSw[1], spinB: S.spin[2] });
  }
  const a1 = HP.coreState(1);
  const L1 = S.totals().L + S.resL + S.radL;
  let lScale = 0;
  for (let i = 0; i < S.n; i++) lScale += Math.abs(S.m[i] * (S.x[i] * S.vy[i] - S.y[i] * S.vx[i]))
    + 0.5 * S.m[i] * S.R[i] * S.R[i] * Math.abs(S.spin[i]);
  return { om0: a0.omega, om1: a1.omega, Rc0: a0.Rc, Rc1: a1.Rc, J0: a0.J, J1: a1.J,
    lSwA: S.lSw[1], lSwB: S.lSw[2], spinB0: b0.spin, spinB1: S.spin[2],
    rA: Math.hypot(S.x[1], S.y[1]), rB: Math.hypot(S.x[2], S.y[2]),
    work: S.coreWork, relL: Math.abs(L1 - L0) / Math.max(lScale, 1e-9),
    series, nan: S.hasNaN(), clampV: S.clampVN };
}, ov);

const out = { meta: { exp: '4-78', wave: 77, target: TARGET, date: '2026-08-05' }, tune: [] };
for (const ov of [
  { pump: 1.5, contract: 0.01, omega0: 1.5, rigidSpin: 3, steps: 6000 },
  { pump: 2.5, contract: 0.01, omega0: 1.5, rigidSpin: 3, steps: 6000 },
  { pump: 2.5, contract: 0.02, omega0: 1.5, rigidSpin: 3, steps: 6000 }]) {
  const r = await run(ov);
  out.tune.push({ ov, r: { ...r, series: undefined } });
  console.log(JSON.stringify(ov), '=>', JSON.stringify({ ...r, series: undefined }));
}
// 採用値の本走行(series つき)
out.final = await run({ pump: 2.5, contract: 0.02, omega0: 1.5, rigidSpin: 3, steps: 6000 });
console.log('final', JSON.stringify(out.final));
// 対照: pump=0/contract=0(何も育たない)
out.ctrl = await run({ pump: 0, contract: 0, omega0: 1.5, rigidSpin: 3, steps: 6000 });
console.log('ctrl ', JSON.stringify({ ...out.ctrl, series: undefined }));
fs.writeFileSync(path.join(OUT_DIR, 'exp-4-78.json'), JSON.stringify(out, null, 2));
console.log('saved tests/out/exp-4-78.json');
await browser.close();
