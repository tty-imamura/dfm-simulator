// 第74便 実験 4-75: ディスク/バルジ対比(🍳galaxyDB 設計)+ローター星雲(🌑nebulaRotor 設計)
// - A: 同一中心天体・同一恒星質量で「回転支持ディスク」と「分散支持バルジ」を同時配置し、
//      固定ID追跡で spin(符号付き)/|spin|/spin²・速度分散 σ_T/σ_R・平均公転 vt を群別に実測。
//      kFrame=1/0 と geoPN=0/2 の 4 構成。第71便の訂正(終状態分類の罠)に従い、群の所属は
//      build 直後に確定し最後まで固定する。
// - B: ダークローター雲(高スピン・lightSweep auto のクランプ+低スピン放射エンベロープ)の
//      減光コントラストと力学安定性を実測し、スピン0対照(散光化)と比較する。
// 出力: tests/out/exp-4-75.json。アプリ本体は不変(全て HP.sim.build 直接駆動)。
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

// ---- A) ディスク/バルジ ----
// over: {kFrame, geoPN, bulgeV, steps}
const runDB = (over) => page.evaluate((ov) => {
  const PHYS = { G: 0.8, D0: 1.5, kFrame: ov.kFrame, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0,
    Kt: 50, cLight: 60, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
    geoPN: ov.geoPN, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 3, timeScale: 3 };
  HP.sim.build({ id: 'dbx', name: 'd', description: 'd', camera: { scale: 400 },
    world: { boundary: 'none', size: 0 }, seed: 20260804, physics: PHYS,
    bodies: [
      { type: 'single', rMul: 1.2, m: 2500, x: 0, y: 0, vx: 0, vy: 0, spin: 1.2, pinned: true, radius: 15 },
      { type: 'disk', rMul: 1.2, n: 190, cx: 0, cy: 0, radius: 260, mMin: 0.16, mMax: 0.5,
        spinMin: 0, spinMax: 0, vMode: 'kepler', aroundMass: 2500, vScale: 1.05, direction: 1,
        bulkVx: 0, bulkVy: 0 },
      { type: 'disk', rMul: 1.2, n: 190, cx: 0, cy: 0, radius: 90, mMin: 0.16, mMax: 0.5,
        spinMin: 0, spinMax: 0, vMode: 'random', vScale: ov.bulgeV, direction: 1,
        bulkVx: 0, bulkVy: 0 } ] });
  const S = HP.sim;
  const disk = [], bulge = [];
  for (let i = 1; i <= 190; i++) disk.push(i);
  for (let i = 191; i < S.n; i++) bulge.push(i);
  const r0 = { disk: 0, bulge: 0 };
  const rOf = (i) => Math.hypot(S.x[i], S.y[i]);
  disk.forEach(i => r0.disk += rOf(i) / disk.length);
  bulge.forEach(i => r0.bulge += rOf(i) / bulge.length);
  for (let k = 0; k < ov.steps; k++) S.step(0.016);
  const stat = (idx) => {
    const vt = [], vr = [], sp = [];
    let rM = 0, keep = 0, Lo = 0, Ls = 0;
    for (const i of idx) {
      const r = rOf(i); rM += r / idx.length; if (r < 450) keep++;
      const tx = -S.y[i] / (r || 1), ty = S.x[i] / (r || 1);
      vt.push(S.vx[i] * tx + S.vy[i] * ty);
      vr.push((S.vx[i] * S.x[i] + S.vy[i] * S.y[i]) / (r || 1));
      sp.push(S.spin[i]);
      Lo += S.m[i] * (S.x[i] * S.vy[i] - S.y[i] * S.vx[i]);
      Ls += 0.5 * S.m[i] * S.R[i] * S.R[i] * S.spin[i];
    }
    const mean = (a) => a.reduce((x, y) => x + y, 0) / a.length;
    const dev = (a) => { const m = mean(a); return Math.sqrt(mean(a.map(v => (v - m) * (v - m)))); };
    return { vtMean: mean(vt), sigT: dev(vt), sigR: dev(vr),
      spinMean: mean(sp), spinAbs: mean(sp.map(Math.abs)), spinSq: mean(sp.map(v => v * v)),
      rMean: rM, keepFrac: keep / idx.length, Lo, Ls };
  };
  // 外縁帯回転(galaxyStd と同一式・帯156-286)
  let sum = 0, c = 0;
  for (let i = 1; i < S.n; i++) { const rr = rOf(i); if (rr >= 156 && rr <= 286) { sum += (S.x[i] * S.vy[i] - S.y[i] * S.vx[i]) / rr; c++; } }
  return { disk: stat(disk), bulge: stat(bulge), r0, outer: c ? sum / c : 0,
    resL: S.resL, clampV: S.clampVN, clampR: S.clampRN || 0, nan: S.hasNaN() };
}, over);

const A = { tune: [], final: {} };
// 第2回チューニング: 初回(bv 7/9/11・3000步)は一様速度分布の高速尾が脱出速度を超え、
// バルジが膨張・散逸した(bv9 で保持80%・平均半径76→230)。bv を下げて6000步で確認する
for (const bv of [5, 6, 7]) {
  const r = await runDB({ kFrame: 1, geoPN: 0, bulgeV: bv, steps: 6000 });
  A.tune.push({ bulgeV: bv, keepBulge: r.bulge.keepFrac, keepDisk: r.disk.keepFrac,
    rBulge: r.bulge.rMean, sigT: r.bulge.sigT, sigTd: r.disk.sigT,
    vtDisk: r.disk.vtMean, vtBulge: r.bulge.vtMean,
    spinAbsB: r.bulge.spinAbs, spinAbsD: r.disk.spinAbs, nan: r.nan });
  console.log('tune bulgeV=', bv, JSON.stringify(A.tune[A.tune.length - 1]));
}
// 採用値は保持率・分散のバランスで選ぶ(下の console を見て決めた値を BV に固定)
const BV = 6;
for (const [tag, ov] of Object.entries({
  kf1: { kFrame: 1, geoPN: 0, bulgeV: BV, steps: 6000 },
  kf0: { kFrame: 0, geoPN: 0, bulgeV: BV, steps: 6000 },
  g2kf1: { kFrame: 1, geoPN: 2, bulgeV: BV, steps: 6000 },
  g2kf0: { kFrame: 0, geoPN: 2, bulgeV: BV, steps: 6000 } })) {
  A.final[tag] = await runDB(ov);
  console.log(tag, JSON.stringify(A.final[tag]));
}

// ---- B) ローター星雲 ----
// over: {coreSpin, kRep, cLight, envEta, steps, spinZero}
const runNeb = (over) => page.evaluate((ov) => {
  const PHYS = { G: 0.8, D0: 1.5, kFrame: 1, q: 2, kRep: ov.kRep, muF: 0, gammaN: 0, kappaS: 0,
    Kt: 50, cLight: ov.cLight, bM: 1, etaRad: ov.envEta, pRad: 4, gravityX: 0, gravityY: 0,
    geoPN: 0, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 3, timeScale: 2 };
  const preset = { id: 'nbx', name: 'd', description: 'd', camera: { scale: 340 },
    world: { boundary: 'none', size: 0 }, seed: 20260804, physics: PHYS,
    bodies: [
      // 高密度コア(主クランプ): 高スピン小ローター
      { type: 'disk', rMul: 2, n: 30, cx: 0, cy: 0, radius: 34, mMin: 3, mMax: 6,
        spinMin: ov.coreSpin, spinMax: ov.coreSpin + 2, vMode: 'random', vScale: 1.2, direction: 1,
        bulkVx: 0, bulkVy: 0, lightSweep: 'auto' },
      // 副クランプ×2(階層構造)
      { type: 'disk', rMul: 2, n: 12, cx: 96, cy: 44, radius: 16, mMin: 3, mMax: 5,
        spinMin: ov.coreSpin, spinMax: ov.coreSpin + 2, vMode: 'random', vScale: 0.8, direction: 1,
        bulkVx: -0.4, bulkVy: 0.2, lightSweep: 'auto' },
      { type: 'disk', rMul: 2, n: 12, cx: -88, cy: 58, radius: 16, mMin: 3, mMax: 5,
        spinMin: ov.coreSpin, spinMax: ov.coreSpin + 2, vMode: 'random', vScale: 0.8, direction: 1,
        bulkVx: 0.4, bulkVy: -0.2, lightSweep: 'auto' },
      // 低スピン放射エンベロープ(散光成分)
      { type: 'ring', rMul: 1, n: 44, cx: 0, cy: 0, rIn: 62, rOut: 150, mMin: 0.5, mMax: 1.2,
        spinMin: 0.4, spinMax: 0.9, vMode: 'kepler', aroundMass: 250, omega: 0, vNoise: 0.05,
        direction: 1, lightSweep: 'auto' } ] };
  HP.sim.build(preset);
  const S = HP.sim;
  const core = [], env = [];
  for (let i = 0; i < 54; i++) core.push(i);
  for (let i = 54; i < S.n; i++) env.push(i);
  if (ov.spinZero) for (const i of core) S.spin[i] = 0;
  for (let k = 0; k < ov.steps; k++) S.step(0.016);
  const g = (idx) => {
    let lS = 0, To = 0, keep = 0, sp = 0;
    for (const i of idx) { lS += S.lSw[i] / idx.length; To += HP.obsTemp(S, i) / idx.length;
      sp += Math.abs(S.spin[i]) / idx.length;
      if (Math.hypot(S.x[i], S.y[i]) < 400) keep++; }
    return { lSw: lS, Tobs: To, absSpin: sp, keepFrac: keep / idx.length };
  };
  return { core: g(core), env: g(env), nan: S.hasNaN(), clampV: S.clampVN, n: S.n };
}, over);

const B = { tune: [] };
// 第2回チューニング: 初回で kRep=0.15 はコアを吹き飛ばす(保持43%)一方 kRep=0 は保持89%で
// コントラスト×12。cLight=60 ではコアが未飽和のまま放射で冷え absSpin 8→0.2(散光化)—
// 「掻き出しの飽和が放射を止め、暗さが自己維持される」相転移の縁が cLight 40〜60 の間にある
for (const ov of [
  { coreSpin: 7, kRep: 0, cLight: 36, envEta: 0.003, steps: 3000, spinZero: 0 },
  { coreSpin: 8, kRep: 0, cLight: 36, envEta: 0.003, steps: 3000, spinZero: 0 },
  { coreSpin: 8, kRep: 0, cLight: 40, envEta: 0.003, steps: 3000, spinZero: 0 }]) {
  const r = await runNeb(ov);
  B.tune.push({ ov, r });
  console.log('neb', JSON.stringify(ov), '=>', JSON.stringify(r));
}
// 対照(コアスピン0 = 散光化)は本走行の採用値で最後に確定する(下の console を見て選ぶ)
const NB = { coreSpin: 8, kRep: 0, cLight: 40, envEta: 0.003, steps: 3000 };
B.final = await runNeb({ ...NB, spinZero: 0 });
B.ctrl = await runNeb({ ...NB, spinZero: 1 });
console.log('neb final', JSON.stringify(B.final));
console.log('neb ctrl ', JSON.stringify(B.ctrl));

const out = { meta: { exp: '4-75', wave: 74, target: TARGET, date: '2026-08-04' }, A, B };
fs.writeFileSync(path.join(OUT_DIR, 'exp-4-75.json'), JSON.stringify(out, null, 2));
console.log('saved tests/out/exp-4-75.json');
await browser.close();
