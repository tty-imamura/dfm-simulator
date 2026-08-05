// 第78便 実験 4-79: DFM版ブラックホールの「自走」検証 — τ_cs でコア→外殻→銀河は回るか
// 第76便 exp-4-77 で、原仮定者仮説「中心コアが高速スピン→減光→**それが外殻のスピンに繋がり**→
// 銀河をスピンさせる」の欠落部品は「コア→外殻トルク結合」だけ、と定量確定した:
//   (a)🎡標準 単層spin1.2 → 外縁増強 1.2646 /(b)暗い重殻(殻0.15+高速コア)→ 1.0651 /
//   (c)殻1.2+高速コア → 1.3909(殻が回っていればコアは増幅として効く)
// 第77便でコアv2の τ_cs を実装したので、本実験は **(b) に τ_cs を入れて (c) へ自走するか** を測る。
// ChatGPT §9.4 の A〜F プロトコルに沿って対照も並べる:
//   A: 中心質量のみ(スピン0)・kFrame=1 / B: 中心スピンあり・kFrame=0 / C: 同・kFrame=1
//   D: (b)+τ_cs 掃引(本命)/ F: 中心スピン0で、同じ J を円盤へ配分した対照
// 保存則: 帳簿込み総 L(totals()+resL+radL)の相対ドリフトを毎ケース記録する(T7 拡張)。
// 出力: tests/out/exp-4-79.json。アプリ本体は不変(HP.sim.build 直接駆動)。
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

// over: {shellSpin, core:{...}|null, kFrame, steps, diskSpin}
const run = (over) => page.evaluate((ov) => {
  // 中心は **pinned**(既存 🎡🍳 と同じ流儀)。自由中心は E6′③反作用の上限が大量発動して
  // 系が乱れる(初版実測: clampR=30300・🎡標準相当の増強が 1.2646→0.59 に崩れる)。
  // pinned でも τ_cs は効く(第78便の緩和 — 位置固定と自転は独立)
  const center = { type: 'single', rMul: 1.2, m: 2500, x: 0, y: 0, vx: 0, vy: 0,
    spin: ov.shellSpin, pinned: true, radius: 15, lightSweep: 'auto' };
  if (ov.core) center.core = ov.core;
  const v = HP.validatePreset({ name: 'bh', description: 'd', camera: { scale: 400 },
    world: { boundary: 'none', size: 0 }, seed: 20260727,
    physics: { G: 0.8, D0: 1.5, kFrame: ov.kFrame, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0,
      Kt: 50, cLight: 60, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0, geoPN: 0,
      lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 3, timeScale: 3 },
    bodies: [center,
      { type: 'disk', rMul: 1.2, n: 380, cx: 0, cy: 0, radius: 260, mMin: 0.16, mMax: 0.5,
        spinMin: (ov.diskSpin || 0), spinMax: (ov.diskSpin || 0), vMode: 'kepler',
        aroundMass: 2500, vScale: 1.05, direction: 1, bulkVx: 0, bulkVy: 0 }] });
  HP.sim.build(v.preset);
  const S = HP.sim;
  const L0 = S.totals().L + S.resL + S.radL;
  const cs0 = HP.coreState(0);
  const series = [];
  // 外縁帯 vφ は**中心天体基準の相対座標**で測る(初版は絶対座標で測り、自由中心の
  // ドリフトが混入して 🎡標準相当が 0.669 になる異常が出た — pinned だった exp-4-77 との
  // 比較可能性を保つための修正)
  const outer = () => { let sum = 0, c = 0;
    const x0 = S.x[0], y0 = S.y[0], vx0 = S.vx[0], vy0 = S.vy[0];
    for (let i = 1; i < S.n; i++) {
      const dx = S.x[i] - x0, dy = S.y[i] - y0, rr = Math.hypot(dx, dy);
      if (rr >= 156 && rr <= 286) { sum += (dx * (S.vy[i] - vy0) - dy * (S.vx[i] - vx0)) / rr; c++; } }
    return c ? sum / c : 0; };
  for (let k = 0; k < ov.steps; k++) {
    S.step(0.016);
    if ((k + 1) % 1500 === 0) { const c = HP.coreState(0);
      series.push({ k: k + 1, shell: S.spin[0], coreOm: c ? c.omega : 0, outer: outer() }); }
  }
  const L1 = S.totals().L + S.resL + S.radL;
  let lScale = 0, keep = 0;
  for (let i = 0; i < S.n; i++) { lScale += Math.abs(S.m[i] * (S.x[i] * S.vy[i] - S.y[i] * S.vx[i]))
    + 0.5 * S.m[i] * S.R[i] * S.R[i] * Math.abs(S.spin[i]);
    if (i > 0 && Math.hypot(S.x[i] - S.x[0], S.y[i] - S.y[0]) < 450) keep++; }
  const cs1 = HP.coreState(0);
  return { outer: outer(), shell0: ov.shellSpin, shell1: S.spin[0],
    coreOm0: cs0 ? cs0.omega : 0, coreOm1: cs1 ? cs1.omega : 0,
    coreJ0: cs0 ? cs0.J : 0, coreJ1: cs1 ? cs1.J : 0,
    lSwCenter: S.lSw[0], keep: keep / (S.n - 1), resL: S.resL,
    relL: Math.abs(L1 - L0) / Math.max(lScale, 1e-9), series,
    nan: S.hasNaN(), clampV: S.clampVN, clampR: S.clampRN || 0 };
}, over);

// 高速コア: massFrac 0.3(Mc=750)・Rc=7.5・Ω=20 → J_c=421875(殻を約1.5まで回せる貯金)
const CORE = (Kcs) => ({ mode: 'differential', massFrac: 0.3, radius: 7.5, omega: 20, Kcs });
const STEPS = 6000;
const out = { meta: { exp: '4-79', wave: 78, target: TARGET, date: '2026-08-05' }, cases: {} };
const boost = async (tag, cfg) => {
  const kf1 = await run({ ...cfg, kFrame: 1, steps: STEPS });
  const kf0 = await run({ ...cfg, kFrame: 0, steps: STEPS });
  out.cases[tag] = { kf1, kf0, boost: kf1.outer / kf0.outer };
  console.log(tag, 'boost=', (kf1.outer / kf0.outer).toFixed(4),
    'shell', kf1.shell0, '→', kf1.shell1.toFixed(3),
    'coreΩ', kf1.coreOm0.toFixed(1), '→', kf1.coreOm1.toFixed(1),
    'lSw=', kf1.lSwCenter.toFixed(2), 'keep=', kf1.keep.toFixed(3),
    'relL=', kf1.relL.toExponential(1), 'nan=', kf1.nan);
};
// A: 中心質量のみ(スピン0・コアなし)
await boost('A_massOnly', { shellSpin: 0, core: null });
// B/C は kFrame 対照として boost() 内に内包 — ここでは 🎡標準相当(単層 spin1.2)
await boost('C_std', { shellSpin: 1.2, core: null });
// D: 暗い重殻(殻0.15+高速コア)の τ_cs 掃引 — 本命(自走するか)
for (const K of [0, 0.02, 0.1, 0.5]) {
  await boost('D_Kcs' + String(K).replace('.', 'p'), { shellSpin: 0.15, core: CORE(K) });
}
// F: 中心スピン0で、同じ J を円盤へ配分した対照(中心が回さなくても増強が出るか)
await boost('F_diskSpin', { shellSpin: 0, core: null, diskSpin: 1.5 });
fs.writeFileSync(path.join(OUT_DIR, 'exp-4-79.json'), JSON.stringify(out, null, 2));
console.log('saved tests/out/exp-4-79.json');
await browser.close();
