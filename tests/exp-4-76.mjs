// 第75便 実験 4-76: ①🐚重殻ローター星雲(重い外殻=束縛+高速スピンコア=狭い光学影響範囲)
//                    ②⏳双極星雲(中心の重殻ダークローター+赤道ダークアーク+極方向ローブ)
// - ①は原仮定者指示「粒子の外殻は重く、粒子のコアが高速スピンして光学的な影響範囲は狭い想定」の
//   創発実験。同一幾何・同一質量の「単層(スピンで暗くする)」対照と比較する:
//   保持率(束縛)・lS̄(暗さ)・エンベロープ攪乱(|spin| 汲み上げ・L_z 変化=影響範囲)。
// - ②は E5′ 圧力+幾何(赤道の pinned ダークアークが遮る)で極方向ローブが立つかを
//   agnjet と同じ polarFraction(系外到達ガスの ±y30°以内割合)で実測。kRep=0 対照つき。
// - 初版の失敗記録: 粒 rMul2(R≈11)を半径34へ30個は幾何的に入らず接触ばねで爆散(保持7〜17%)。
//   トーラスも同過密+軌道支持なしで分散(保持23%)。本版で粒径 rMul0.7・アーク pinned 化。
// 出力: tests/out/exp-4-76.json。アプリ本体は不変(HP.sim.build 直接駆動)。
// ※第81便注記: 本スクリプトは**コアv1(coreMR/coreSR/coreRR)在籍時**の記録用ハーネスである。
//   第81便でコアv1 は廃止されたため、ここで組み立てる旧キー body は現行 beta の build では
//   コアが付かない。再実行するときは core:{mode,massFrac,radius,omega} へ読み替えること。
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

// ---- ①🐚 重殻ローター星雲 ----
const runShell = (over) => page.evaluate((ov) => {
  const core2 = ov.single ? {} : { coreMR: ov.coreMR, coreSR: ov.coreSR, coreRR: ov.coreRR };
  const sp = ov.single ? ov.singleSpin : ov.shellSpin;
  const grain = (n, cx, cy, radius, vScale, bulkVx, bulkVy) => Object.assign({
    type: 'disk', rMul: 0.7, n, cx, cy, radius, mMin: ov.m * 0.8, mMax: ov.m * 1.2,
    spinMin: sp * 0.8, spinMax: sp * 1.2, vMode: 'random', vScale, direction: 1,
    bulkVx, bulkVy, lightSweep: 'auto' }, core2);
  HP.sim.build({ id: 'shx', name: 'd', description: 'd', camera: { scale: 340 },
    world: { boundary: 'none', size: 0 }, seed: 20260804,
    physics: { G: 0.8, D0: 1.5, kFrame: 1, q: 2, kRep: (ov.kRep || 0), muF: 0, gammaN: 0, kappaS: 0, Kt: 50,
      cLight: 40, bM: 1, etaRad: (ov.etaRad || 0), pRad: 4, gravityX: 0, gravityY: 0, geoPN: 0, lambdaPN: 1,
      pnAlpha: 1.5, radiusScale: 1, softening: 3, timeScale: 2 },
    bodies: [
      grain(30, 0, 0, 34, ov.vScale, 0, 0),
      grain(12, 96, 44, 16, ov.vScale * 0.7, -0.4, 0.2),
      grain(12, -88, 58, 16, ov.vScale * 0.7, 0.4, -0.2),
      { type: 'ring', rMul: 1, n: 44, cx: 0, cy: 0, rIn: 62, rOut: 150, mMin: 0.5, mMax: 1.2,
        spinMin: 0.4, spinMax: 0.9, vMode: 'kepler', aroundMass: ov.m * 54 * 0.7, omega: 0,
        vNoise: 0.05, direction: 1, lightSweep: 'auto' } ] });
  const S = HP.sim;
  const env0 = { sp: 0, lz: 0 };
  for (let i = 54; i < S.n; i++) { env0.sp += Math.abs(S.spin[i]) / (S.n - 54);
    env0.lz += S.m[i] * (S.x[i] * S.vy[i] - S.y[i] * S.vx[i]) / (S.n - 54); }
  for (let k = 0; k < ov.steps; k++) S.step(0.016);
  const g = (lo, hi) => {
    let lS = 0, keep = 0, sp = 0, To = 0;
    for (let i = lo; i < hi; i++) { lS += S.lSw[i] / (hi - lo); sp += Math.abs(S.spin[i]) / (hi - lo);
      To += HP.obsTemp(S, i) / (hi - lo);
      if (Math.hypot(S.x[i], S.y[i]) < 400) keep++; }
    return { lSw: lS, absSpin: sp, Tobs: To, keepFrac: keep / (hi - lo) };
  };
  let envLz = 0; for (let i = 54; i < S.n; i++) envLz += S.m[i] * (S.x[i] * S.vy[i] - S.y[i] * S.vx[i]) / (S.n - 54);
  return { core: g(0, 54), env: g(54, S.n), env0, envLz, nan: S.hasNaN(), clampV: S.clampVN };
}, over);

const A = { tune: [], singleMatch: [] };
for (const ov of [
  { m: 30, shellSpin: 0.5, coreMR: 0.35, coreSR: 20, coreRR: 0.3, vScale: 3, single: 0, steps: 3000 },
  { m: 30, shellSpin: 0.5, coreMR: 0.35, coreSR: 20, coreRR: 0.3, vScale: 3, single: 0, steps: 3000, etaRad: 0.003 },
  { m: 30, shellSpin: 0.6, coreMR: 0.4, coreSR: 20, coreRR: 0.3, vScale: 3, single: 0, steps: 3000 }]) {
  const r = await runShell(ov);
  A.tune.push({ ov, r });
  console.log('shell', JSON.stringify(ov), '=>', JSON.stringify(r));
}
// 単層対照: 同一幾何・同一質量で spin だけを振り、lS̄ が2層採用値と揃う点を探す(kRep=0)
for (const s1 of [3, 6]) {
  const r = await runShell({ m: 30, shellSpin: 0.5, vScale: 3, single: 1, singleSpin: s1, steps: 3000 });
  A.singleMatch.push({ singleSpin: s1, r });
  console.log('single', s1, '=>', JSON.stringify(r));
}
// 耐圧試験(原仮定者設計の核心): 熱圧 kRep=0.3 の下で「同じ暗さ」を保てるのはどちらか。
// 2層(殻0.6・コア高速)はスピン斥力が殻スピンにしか効かず束縛が残る/単層(spin6)は自壊する
A.stress = {};
A.stress.twoLayer = await runShell({ m: 30, shellSpin: 0.6, coreMR: 0.4, coreSR: 20, coreRR: 0.3,
  vScale: 3, single: 0, steps: 3000, kRep: 0.3 });
console.log('stress 2layer =>', JSON.stringify(A.stress.twoLayer));
A.stress.single = await runShell({ m: 30, shellSpin: 0.5, vScale: 3, single: 1, singleSpin: 6,
  steps: 3000, kRep: 0.3 });
console.log('stress single =>', JSON.stringify(A.stress.single));

// ---- ②⏳ 双極星雲 ----
// 赤道アーク: r=60・±x を挟む ±30°(各7個・10°刻み)の pinned 重殻ダークローター
const runBipolar = (over) => page.evaluate((ov) => {
  const arcs = [];
  for (const side of [0, 180]) {
    for (let a = -50; a <= 50; a += 10) {
      const th = (side + a) * Math.PI / 180;
      arcs.push({ type: 'single', rMul: 1, m: ov.arcM, x: Math.round(60 * Math.cos(th) * 10) / 10,
        y: Math.round(60 * Math.sin(th) * 10) / 10, vx: 0, vy: 0, spin: 0.5, pinned: true,
        radius: 8, coreMR: 0.3, coreSR: 15, coreRR: 0.25, lightSweep: 'auto' });
    }
  }
  HP.sim.build({ id: 'bpx', name: 'd', description: 'd', camera: { scale: 380 },
    world: { boundary: 'none', size: 0 }, seed: 20260804,
    physics: { G: 0.8, D0: 1.5, kFrame: 1, q: 2, kRep: ov.kRep, muF: 0, gammaN: 0, kappaS: 0, Kt: 50,
      cLight: 40, bM: 1, etaRad: 0.002, pRad: 4, gravityX: 0, gravityY: 0, geoPN: 0, lambdaPN: 1,
      pnAlpha: 1.5, radiusScale: 1, softening: 3, timeScale: 2 },
    bodies: [
      // 中心の重殻ダークローター(自由 — 殻はゆっくり・コアは高速 → 暗い・引きずりの届く範囲は狭い)
      { type: 'single', rMul: 1, m: ov.centerM, x: 0, y: 0, vx: 0, vy: 0, spin: 0.6, pinned: false,
        radius: 20, coreMR: 0.3, coreSR: 15, coreRR: 0.25, lightSweep: 'auto' },
      ...arcs,
      // 高温ガス(高スピン=熱・E5′ 圧力で押し合い、アークの無い極方向へ抜けて光るローブに)
      { type: 'disk', rMul: 1, n: 60, cx: 0, cy: 0, radius: 30, mMin: 0.4, mMax: 0.8,
        spinMin: ov.gasSpin * 0.8, spinMax: ov.gasSpin * 1.2, vMode: 'random', vScale: 0.8,
        direction: 1, bulkVx: 0, bulkVy: 0 } ] });
  const S = HP.sim;
  const gas0 = 23;   // 0=中心・1..22=アーク(±50°・各11)・23..82=ガス
  for (let k = 0; k < ov.steps; k++) S.step(0.016);
  let esc = 0, polar = 0, kept = 0;
  for (let i = gas0; i < S.n; i++) {
    const r = Math.hypot(S.x[i], S.y[i]);
    if (r > 200) { esc++;
      const ang = Math.atan2(Math.abs(S.x[i]), Math.abs(S.y[i]));   // ±y からの角度
      if (ang < Math.PI / 6) polar++;
    } else kept++;
  }
  let lSt = 0; for (let i = 1; i < gas0; i++) lSt += S.lSw[i] / (gas0 - 1);
  let lobeT = 0, lobeN = 0;
  for (let i = gas0; i < S.n; i++) {
    const r = Math.hypot(S.x[i], S.y[i]);
    if (r > 200) { lobeT += HP.obsTemp(S, i); lobeN++; }
  }
  return { esc, polar, polarFrac: esc ? polar / esc : 0, gasKept: kept,
    lobeTobs: lobeN ? lobeT / lobeN : 0,
    lSwCenter: S.lSw[0], lSwArc: lSt, nan: S.hasNaN(), clampV: S.clampVN };
}, over);

const B = { tune: [] };
for (const ov of [
  { kRep: 1.0, gasSpin: 5, arcM: 40, centerM: 600, steps: 6000 },
  { kRep: 1.2, gasSpin: 5, arcM: 40, centerM: 600, steps: 6000 },
  { kRep: 1.0, gasSpin: 6, arcM: 30, centerM: 500, steps: 6000 }]) {
  const r = await runBipolar(ov);
  B.tune.push({ ov, r });
  console.log('bipolar', JSON.stringify(ov), '=>', JSON.stringify(r));
}
const NB = { gasSpin: 5, arcM: 40, centerM: 600, steps: 6000 };
B.final = await runBipolar({ ...NB, kRep: 1.2 });
B.ctrl = await runBipolar({ ...NB, kRep: 0 });
console.log('bipolar final', JSON.stringify(B.final));
console.log('bipolar ctrl ', JSON.stringify(B.ctrl));

const out = { meta: { exp: '4-76', wave: 75, target: TARGET, date: '2026-08-04' }, A, B };
fs.writeFileSync(path.join(OUT_DIR, 'exp-4-76.json'), JSON.stringify(out, null, 2));
console.log('saved tests/out/exp-4-76.json');
await browser.close();
