// 第80便 実験 4-81: E6′-R(pairReduced = 換算質量対称インパルス)と 🕳️bhCoreFree の実測
// 外部レビュー採択の新方式。②で E6′ 要求 d_i=k_F·Δu を速度へ書かず、③で自由対ごとに
//   μ_ij=m_im_j/(m_i+m_j)、J_ij=μ_ij(φ_ij d_i−φ_ji d_j)、Δv_i=+J/m_i・Δv_j=−J/m_j
// として配る(残余トルクは Δs=−n_ij/(I_i+I_j) で等量移譲)。狙いは「支配天体の pinned を
// 外せるようにする」こと — legacy では自由中心で反作用上限が大量発動して系が崩れる
// (exp-4-79 実測: clampR=30300・外縁増強 1.2646→0.59)。
// 測るもの:
//   A) bhCoreFree 6000步(seed 20260805): NaN/clamp・外殻スピン・コアΩ・外縁増強比(中心相対)・
//      恒星保持率・帳簿込み総 L 相対ずれ・BH の重心相対最大変位/最大速度
//   B) 対照: 同構成 pinned(=⚫bhCore 相当)/ 同構成 legacy+自由(短縮 1200步 — 崩壊の再確認)
//   C) 閉鎖系(D0=0・境界なし・全自由・正質量のみ): P/L の相対ずれと clampRN
//   D) 巨大質量比回帰(中心 2500 + 軽粒子 0.05・D0=0・24000步): 有界性・上限0・
//      テスト粒子極限の legacy 一致・中心反跳が質量比程度
// 出力: tests/out/exp-4-81.json。アプリ本体は不変(HP.sim.build 直接駆動)。
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

// ===== A/B: 🕳️bhCoreFree(と対照)=====
// mod: {kFrame?, pinned?, legacy?, steps?}
const runBH = (mod) => page.evaluate((o) => {
  const p = JSON.parse(JSON.stringify(HP.allPresets().find(q => q.id === 'bhCoreFree')));
  if (o.kFrame !== undefined) p.physics.kFrame = o.kFrame;
  if (o.pinned) p.bodies[0].pinned = true;
  if (o.legacy) delete p.physics.frameReaction;
  HP.sim.build(p);
  const S = HP.sim;
  const steps = o.steps || 6000;
  const GAS1 = 121;   // 0=中心 / 1..120=降着円盤 / 121..320=恒星ディスク
  const L0 = S.totals().L + S.resL + S.radL;
  const cs0 = HP.coreState(0);
  // 中心天体の「重心相対」変位・速度(重心は全粒子から毎步再計算 — 背景 D₀ との交換で
  // 系全体はわずかに並進しうるので、原点ではなく重心を基準にする)
  const com = () => { let M = 0, cx = 0, cy = 0, cvx = 0, cvy = 0;
    for (let i = 0; i < S.n; i++) { const mi = S.m[i]; M += mi;
      cx += mi * S.x[i]; cy += mi * S.y[i]; cvx += mi * S.vx[i]; cvy += mi * S.vy[i]; }
    return { x: cx / M, y: cy / M, vx: cvx / M, vy: cvy / M }; };
  let bhDMax = 0, bhVMax = 0;
  for (let k = 0; k < steps; k++) {
    S.step(0.016);
    const c = com();
    const d = Math.hypot(S.x[0] - c.x, S.y[0] - c.y);
    const v = Math.hypot(S.vx[0] - c.vx, S.vy[0] - c.vy);
    if (d > bhDMax) bhDMax = d;
    if (v > bhVMax) bhVMax = v;
  }
  // 外縁増強・保持率はすべて**中心天体基準の相対座標**で測る(自由中心の並進を混ぜない)
  const x0 = S.x[0], y0 = S.y[0], vx0 = S.vx[0], vy0 = S.vy[0];
  let sum = 0, c2 = 0, keep = 0;
  for (let i = GAS1; i < S.n; i++) {
    const dx = S.x[i] - x0, dy = S.y[i] - y0, rr = Math.hypot(dx, dy);
    if (rr >= 156 && rr <= 286) { sum += (dx * (S.vy[i] - vy0) - dy * (S.vx[i] - vx0)) / rr; c2++; }
    if (rr < 450) keep++;
  }
  let esc = 0;
  for (let i = 1; i < GAS1; i++) if (Math.hypot(S.x[i] - x0, S.y[i] - y0) > 200) esc++;
  const L1 = S.totals().L + S.resL + S.radL;
  let lScale = 0;
  for (let i = 0; i < S.n; i++) lScale += Math.abs(S.m[i] * (S.x[i] * S.vy[i] - S.y[i] * S.vx[i]))
    + 0.5 * S.m[i] * S.R[i] * S.R[i] * Math.abs(S.spin[i]);
  const cs1 = HP.coreState(0);
  return { outer: c2 ? sum / c2 : 0, nOuter: c2, shell0: 0.15, shell1: S.spin[0],
    coreOm0: cs0 ? cs0.omega : 0, coreOm1: cs1 ? cs1.omega : 0,
    lSwCenter: S.lSw[0], gasEsc: esc, starKeep: keep / (S.n - GAS1),
    relL: Math.abs(L1 - L0) / Math.max(lScale, 1e-9), n: S.n,
    balanceFrame: S.balanceFrame, bhDMax, bhVMax,
    nan: S.hasNaN(), clampV: S.clampVN, clampS: S.clampSN, clampR: S.clampRN || 0 };
}, mod);

const out = { meta: { exp: '4-81', wave: 80, target: TARGET, date: '2026-08-05' }, cases: {} };
const pair = async (tag, mod) => {
  const a = await runBH({ ...mod, kFrame: 1 });
  const z = await runBH({ ...mod, kFrame: 0 });
  out.cases[tag] = { kf1: a, kf0: z, boost: a.outer / z.outer };
  console.log(tag, 'boost=', (a.outer / z.outer).toFixed(4),
    'shell→', a.shell1.toFixed(3), 'coreΩ', a.coreOm0.toFixed(1), '→', a.coreOm1.toFixed(1),
    'lSw=', a.lSwCenter.toFixed(3), 'keep=', a.starKeep.toFixed(3),
    'bhD=', a.bhDMax.toFixed(3), 'bhV=', a.bhVMax.toFixed(4),
    'relL=', a.relL.toExponential(1), 'clampV/R/S=', a.clampV, a.clampR, a.clampS,
    'bf=', a.balanceFrame, 'nan=', a.nan);
};
await pair('free_pairReduced', {});                       // 本命: 自由中心 + E6′-R
await pair('pinned_control', { pinned: true });           // 対照: 同構成 pinned(⚫相当)
await pair('free_legacy', { legacy: true, steps: 1200 }); // 対照: 自由中心 + legacy(崩壊の再確認)

// ===== C: 閉鎖系(D0=0・境界なし・全自由・正質量のみ)の P/L 機械検証 =====
out.cases.closed = await page.evaluate(() => {
  const bodies = [];
  const N = 10;
  for (let i = 0; i < N; i++) {
    const a = i * 0.62831853, r = 30 + 9 * i;
    bodies.push({ type: 'single', m: 1 + 0.7 * i, x: r * Math.cos(a), y: r * Math.sin(a),
      vx: -0.5 * Math.sin(a), vy: 0.5 * Math.cos(a), spin: 0.3 * (i % 3) - 0.3,
      pinned: false, rMul: 1 });
  }
  const mk = (fr) => ({ name: 'closed', description: 'd', camera: { scale: 200 },
    world: { boundary: 'none', size: 0 }, seed: 20260805,
    physics: { G: 0.6, D0: 0, kFrame: 1, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, Kt: 300,
      cLight: 60, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0, geoPN: 0, lambdaPN: 1,
      pnAlpha: 1.5, radiusScale: 1, softening: 2, timeScale: 1,
      ...(fr ? { frameReaction: fr } : {}) },
    bodies: JSON.parse(JSON.stringify(bodies)) });
  const run = (fr) => {
    const v = HP.validatePreset(mk(fr));
    HP.sim.build(v.preset);
    const S = HP.sim;
    const t0 = S.totals();
    const P0x = t0.px + S.resPx, P0y = t0.py + S.resPy, L0 = t0.L + S.resL + S.radL;
    for (let k = 0; k < 3000; k++) S.step(0.016);
    const t1 = S.totals();
    let pScale = 0, lScale = 0;
    for (let i = 0; i < S.n; i++) {
      pScale += Math.abs(S.m[i] * S.vx[i]) + Math.abs(S.m[i] * S.vy[i]);
      lScale += Math.abs(S.m[i] * (S.x[i] * S.vy[i] - S.y[i] * S.vx[i]))
        + 0.5 * S.m[i] * S.R[i] * S.R[i] * Math.abs(S.spin[i]);
    }
    const dP = Math.hypot(t1.px + S.resPx - P0x, t1.py + S.resPy - P0y);
    return { relP: dP / Math.max(pScale, 1e-9),
      relL: Math.abs(t1.L + S.resL + S.radL - L0) / Math.max(lScale, 1e-9),
      resP: Math.hypot(S.resPx, S.resPy), resL: S.resL,
      clampR: S.clampRN || 0, clampV: S.clampVN, nan: S.hasNaN(),
      // 帳簿を使わない生の粒子系 P も見る(自由対だけなら帳簿なしで閉じるはず)
      rawP: Math.hypot(t1.px - t0.px, t1.py - t0.py) / Math.max(pScale, 1e-9) };
  };
  return { pairReduced: run('pairReduced'), legacy: run(null) };
});
console.log('closed pairReduced', JSON.stringify(out.cases.closed.pairReduced));
console.log('closed legacy     ', JSON.stringify(out.cases.closed.legacy));

// ===== D: 巨大質量比回帰(中心 m=2500 + 軽粒子 m=0.05)=====
// D-1 有界性(提案 §8.3 のとおり D0=0・24000步): pairReduced は上限0で束縛を保つか。
//     legacy は同条件で反作用上限が毎步発動する(=病的域そのもの。D0=0 の2体では
//     φ_01 = w_1/(0+w_1) = 1 となり、軽粒子が重い中心の局所フレームを**丸ごと**決める)。
// D-2 テスト粒子極限(D0=1.5 = ⚫と同じ背景): legacy が正常に働く「固定中心」を基準に、
//     ①同じ固定中心で pairReduced に切り替えたときの軽粒子応答の差(解析的には厳密に0 —
//     pinned 相手 φ·d + 背景 φ_bg·d = d で legacy と同式になる)②中心を自由にしたときの差。
out.cases.massRatio = await page.evaluate(() => {
  const mk = (fr, kF, D0, pin) => ({ name: 'mr', description: 'd', camera: { scale: 200 },
    world: { boundary: 'none', size: 0 }, seed: 20260805,
    physics: { G: 0.8, D0, kFrame: kF, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, Kt: 50,
      cLight: 60, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0, geoPN: 0, lambdaPN: 1,
      pnAlpha: 1.5, radiusScale: 1, softening: 3, timeScale: 1,
      ...(fr ? { frameReaction: fr } : {}) },
    bodies: [
      { type: 'single', m: 2500, x: 0, y: 0, vx: 0, vy: 0, spin: 3, pinned: !!pin, radius: 15, rMul: 1 },
      { type: 'single', m: 0.05, x: 120, y: 0, vx: 0, vy: Math.sqrt(0.8 * 2500 / 120),
        spin: 0, pinned: false, radius: 1, rMul: 1 }] });
  const run = (fr, kF, steps, D0, pin) => {
    const v = HP.validatePreset(mk(fr, kF, D0 === undefined ? 0 : D0, pin));
    HP.sim.build(v.preset);
    const S = HP.sim;
    let vMax = 0, dvC = 0;
    for (let k = 0; k < steps; k++) {
      S.step(0.016);
      const v1 = Math.hypot(S.vx[1], S.vy[1]); if (v1 > vMax) vMax = v1;
      const v0 = Math.hypot(S.vx[0], S.vy[0]); if (v0 > dvC) dvC = v0;
    }
    return { vLightMax: vMax, vCenterMax: dvC, vL: [S.vx[1], S.vy[1]], vC: [S.vx[0], S.vy[0]],
      r: Math.hypot(S.x[1] - S.x[0], S.y[1] - S.y[0]),
      clampR: S.clampRN || 0, clampV: S.clampVN, nan: S.hasNaN() };
  };
  const long = run('pairReduced', 1, 24000, 0, false);
  const legacyLong = run(null, 1, 24000, 0, false);
  // E6′ 応答 = (kFrame=1 の速度) − (kFrame=0 の同構成の速度)。200步・D0=1.5
  const ST = 200, DB = 1.5;
  const resp = (fr, pin) => {
    const a = run(fr, 1, ST, DB, pin), z = run(fr, 0, ST, DB, pin);
    return { v: [a.vL[0] - z.vL[0], a.vL[1] - z.vL[1]], run: a };
  };
  const rLegPin = resp(null, true), rPairPin = resp('pairReduced', true), rPairFree = resp('pairReduced', false);
  const nrm = (v) => Math.hypot(v[0], v[1]);
  const dif = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]) / Math.max(nrm(b), 1e-30);
  return { long, legacyLong,
    respLegacyPinned: nrm(rLegPin.v), respPairPinned: nrm(rPairPin.v), respPairFree: nrm(rPairFree.v),
    relDiffPinned: dif(rPairPin.v, rLegPin.v),   // 解析的に 0(pinned 相手 + 背景 = legacy と同式)
    relDiffFree: dif(rPairFree.v, rLegPin.v),    // 中心を自由にしたことによる差
    // 中心反跳: D0=0・24000步の max|v_center| / max|v_light|(2体の運動量保存 = 質量比が期待値)
    recoilRatio: long.vCenterMax / Math.max(long.vLightMax, 1e-30), massRatio: 0.05 / 2500 };
});
console.log('massRatio long(pairReduced)', JSON.stringify(out.cases.massRatio.long));
console.log('massRatio long(legacy)     ', JSON.stringify(out.cases.massRatio.legacyLong));
console.log('massRatio 応答差 pinned=', out.cases.massRatio.relDiffPinned.toExponential(2),
  'free=', out.cases.massRatio.relDiffFree.toExponential(2),
  '/ 反跳比=', out.cases.massRatio.recoilRatio.toExponential(2),
  '(質量比', out.cases.massRatio.massRatio.toExponential(2), ')');

fs.writeFileSync(path.join(OUT_DIR, 'exp-4-81.json'), JSON.stringify(out, null, 2));
console.log('saved tests/out/exp-4-81.json');
await browser.close();
