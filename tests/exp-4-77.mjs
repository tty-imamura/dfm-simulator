// 第76便 実験 4-77: DFM版ブラックホール仮説の検証 — 「中心コアの高速スピンは銀河を回せるか」
// 原仮定者推測: 「中心コアが核融合反応を起こし、エネルギーが中心コアを高速スピンさせて減光を
// 増し、それが外殻のスピンに繋がり、銀河をスピンさせている」。
// 現行エンジンには**コア→外殻のトルク結合が無い**(coreSR は固定比率)ので、この推測の
// 「外殻に繋がり」の段が欠けたときに何が起きるかを機械確認する:
//   (a) 🎡標準: 単層 spin1.2(較正 1.2646)
//   (b) 暗い重殻ダークローター中心: 殻 spin0.15(遅い)+コア coreSR20(高速・2層減光で暗い)
//   (c) 殻 spin1.2+高速コア: (a) にコアを足しただけ(コアの追加寄与の分離)
// 予測(A8 の核): コア差動の外部到達は f(Rc,d)=(Rc/(Rc+d))^q で狭く、ディスク距離(r≥150)
// では殻項の寄与が支配的 → (b) の外縁増強は殻スピン比(0.15/1.2)程度まで落ち、(c) は (a) と
// ほぼ同じはず。つまり**「銀河を回す」には外殻スピンが必要で、コアが回すには『コア→外殻
// トルク結合』(コアv2 — docs/dev/CORE_V2_DESIGN.md)が欠けている**ことの定量化。
// 出力: tests/out/exp-4-77.json。アプリ本体は不変(HP.sim.build 直接駆動)。
// ※第81便注記: 本スクリプトは**コアv1(coreMR/coreSR/coreRR)在籍時**の記録用ハーネスである。
//   第81便でコアv1 は廃止された(移行式は PHYSICS.md「主星2層コア」節を参照)。
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

// over: {spin, core:{coreMR,coreSR,coreRR}|null, lsw, kFrame}
const run = (over) => page.evaluate((ov) => {
  const center = Object.assign(
    { type: 'single', rMul: 1.2, m: 2500, x: 0, y: 0, vx: 0, vy: 0, spin: ov.spin,
      pinned: true, radius: 15 },
    ov.core || {}, ov.lsw ? { lightSweep: 'auto' } : {});
  HP.sim.build({ id: 'bhx', name: 'd', description: 'd', camera: { scale: 400 },
    world: { boundary: 'none', size: 0 }, seed: 20260727,
    physics: { G: 0.8, D0: 1.5, kFrame: ov.kFrame, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0,
      Kt: 50, cLight: 60, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0, geoPN: 0,
      lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 3, timeScale: 3 },
    bodies: [ center,
      { type: 'disk', rMul: 1.2, n: 380, cx: 0, cy: 0, radius: 260, mMin: 0.16, mMax: 0.5,
        spinMin: 0, spinMax: 0, vMode: 'kepler', aroundMass: 2500, vScale: 1.05, direction: 1,
        bulkVx: 0, bulkVy: 0 } ] });
  const S = HP.sim;
  for (let k = 0; k < 6000; k++) S.step(0.016);
  let sum = 0, c = 0, keep = 0;
  for (let i = 1; i < S.n; i++) {
    const rr = Math.hypot(S.x[i], S.y[i]);
    if (rr >= 156 && rr <= 286) { sum += (S.x[i] * S.vy[i] - S.y[i] * S.vx[i]) / rr; c++; }
    if (rr < 450) keep++;
  }
  return { outer: c ? sum / c : 0, keep: keep / (S.n - 1), lSwC: S.lSw[0], nan: S.hasNaN() };
}, over);

const CORE = { coreMR: 0.3, coreSR: 20, coreRR: 0.25 };
const CASES = {
  a_std: { spin: 1.2, core: null, lsw: 0 },                        // 🎡標準(単層・可視)
  b_darkRotor: { spin: 0.15, core: CORE, lsw: 1 },                 // 暗い重殻(殻遅い+コア高速)
  c_shellPlusCore: { spin: 1.2, core: CORE, lsw: 1 },              // 殻1.2+コア(コアの追加寄与)
};
const out = { meta: { exp: '4-77', wave: 76, target: TARGET, date: '2026-08-05' }, cases: {} };
for (const [tag, cfg] of Object.entries(CASES)) {
  const kf1 = await run({ ...cfg, kFrame: 1 });
  const kf0 = await run({ ...cfg, kFrame: 0 });
  out.cases[tag] = { kf1, kf0, boost: kf1.outer / kf0.outer };
  console.log(tag, 'boost=', (kf1.outer / kf0.outer).toFixed(4),
    'lSwCenter=', kf1.lSwC.toFixed(3), 'keep=', kf1.keep.toFixed(3), 'nan=', kf1.nan || kf0.nan);
}
fs.writeFileSync(path.join(OUT_DIR, 'exp-4-77.json'), JSON.stringify(out, null, 2));
console.log('saved tests/out/exp-4-77.json');
await browser.close();
