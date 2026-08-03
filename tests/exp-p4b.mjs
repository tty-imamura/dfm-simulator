// 第69便 P4b 検証実験: geoPN=2(v−u 統一測地線則)のエンジン実装の V ゲート実測
// - P4a(tests/exp-p4a.mjs — 独立 RK4 での式レベル検証)のエンジン版。実装アンカー5点
//   (DERIVATIONS §18.5)のうち QA で機械固定する ①bit等価 ③共動 ⑤保存則 の較正実測と、
//   QA には固定しない ④🎡リトマス(渦度コリオリ由来ドラッグの初実測 — 原仮定者の裁定材料)を出す。
//   ②☿回帰は ①の bit 等価 + 既存 behavior.mercury-builtin がそのまま担う。
// - 出力: tests/out/p4b-results.json(合否は QA 側 — 本スクリプトは実測の記録)
// - 既知の周辺観察(P4b 起因ではない): D0=0 かつ極端な質量比(例 1:10⁴)では、③反作用の
//   φ 対分配が軽い側へ全量向かい(φ≈1)、離散フィードバック利得 m_src/m_pl ≫1 で発振して
//   速度クランプに当たる。これは legacy(geoPN=0)でも同一に起きる E6′③ の既存特性
//   (geoPN=0/2 とも clampVN=1998 を実測)。共動・保存則の実験は等質量連星で構成する。
// 実行: node tests/exp-p4b.mjs / QA_TARGET=beta/index.html node tests/exp-p4b.mjs(既定 beta)
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

const results = await page.evaluate(() => {
  const A = HP.RAY_ALPHA_MIN;
  const PN_R = 12.247, PN_KGR = 1600, pnThr = (A / 4) * PN_KGR * Math.max(PN_R, 0.5);
  const PHYS = { G: 1, D0: 0, kFrame: 1, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0,
    Kt: 10000, cLight: 40, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
    geoPN: 2, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 0.5, timeScale: 1 };
  const build = (over, bodies) => {
    HP.sim.build({ id: 'p4b', name: 'p', description: 'd', camera: { scale: 300 },
      world: { boundary: 'none', size: 0 }, physics: { ...PHYS, ...over }, bodies });
    return HP.sim;
  };

  // ---- P4b-1: bit 等価(アンカー①) — geoPN=2 ∧ kFrame=0 ≡ geoPN=1(pinned 源・☿型) ----
  // 統一則は kF=0 で w=v・輸送3項=0 が「式として」厳密に成り立つ(P4a-4 のエンジン版)。
  // pinned 源では対反作用も第1段階と同じ開放系に落ちるため、全状態が bit 一致するはず。
  const mercBodies = (V) => [
    { type: 'single', m: pnThr * 1.2, radius: PN_R, x: 0, y: 0, vx: V, vy: 0, spin: 0.5, pinned: true },
    { type: 'single', m: 0.01, x: 47.664, y: 0, vx: V, vy: 1.94787, spin: 0.1, pinned: false }];
  const stateRun = (geoPN, steps) => {
    const S = build({ geoPN, kFrame: 0, D0: 0.05 }, mercBodies(0));
    for (let k = 0; k < steps; k++) S.step(0.016);
    return { x: [...S.x], y: [...S.y], vx: [...S.vx], vy: [...S.vy], sp: [...S.spin] };
  };
  const s2 = stateRun(2, 1500), s1 = stateRun(1, 1500);
  let bitDiff = 0;
  for (let i = 0; i < s2.x.length; i++)
    for (const kk of ['x', 'y', 'vx', 'vy', 'sp']) if (s2[kk][i] !== s1[kk][i]) bitDiff++;
  const p4b1 = { steps: 1500, n: s2.x.length, bitDiff };

  // ---- P4b-2: 共動連星(アンカー③ — P4a-2 のエンジン版) ----
  // 等質量の自由連星(両方 1PN 源・スピンあり)+遠方トレーサ、D0=0(背景リザーバなし =
  // 絶対フレームの錨を外す)。全系を V=3 でブーストしても、統一則では u も一様に V だけ
  // シフトするため相対力学は不変のはず(離散写像もガリレイ共変 — 破れは Float32 丸めと
  // カオス増幅のみ)。位相に鈍い観測量 = 連星間距離の窓平均で比較する。
  const binBodies = (V) => [
    { type: 'single', m: pnThr * 1.2, radius: PN_R, x: -40, y: 0, vx: V, vy: -0.9, spin: 0.5, pinned: false },
    { type: 'single', m: pnThr * 1.2, radius: PN_R, x: 40, y: 0, vx: V, vy: 0.9, spin: 0.5, pinned: false },
    { type: 'single', m: 0.01, x: 0, y: 180, vx: V + 1.1, vy: 0, spin: 0, pinned: false }];
  const comovingRun = (geoPN, V, steps) => {
    const S = build({ geoPN }, binBodies(V));
    let sepSum = 0, c = 0;
    for (let k = 0; k < steps; k++) { S.step(0.016);
      if (k >= steps - 800 && k % 10 === 0) { sepSum += Math.hypot(S.x[1] - S.x[0], S.y[1] - S.y[0]); c++; } }
    return { sepMean: sepSum / c, sepEnd: Math.hypot(S.x[1] - S.x[0], S.y[1] - S.y[0]),
      clampV: S.clampVN, nan: S.hasNaN() };
  };
  const rest2 = comovingRun(2, 0, 2000), boost2 = comovingRun(2, 3, 2000);
  const p4b2 = { rest: rest2, boost: boost2,
    relDev: Math.abs(boost2.sepMean - rest2.sepMean) / rest2.sepMean };

  // ---- P4b-3: 保存則(アンカー⑤ — 反作用返しで P・L が対で閉じる) ----
  // 同じ自由連星+惑星2(全粒子自由・D0=0 → リザーバ帳簿もゼロのまま)。
  // ΣP=Σm·v+res、ΣL=Σm(x×v)+ΣI·s+resL の 3000 步ドリフトを geoPN=1(開放 1PN)と比較。
  const consRun = (geoPN) => {
    const S = build({ geoPN }, [
      { type: 'single', m: pnThr * 1.2, radius: PN_R, x: -40, y: 0, vx: 0, vy: -1.1, spin: 0.8, pinned: false },
      { type: 'single', m: pnThr * 1.2, radius: PN_R, x: 40, y: 0, vx: 0, vy: 1.1, spin: 0.8, pinned: false },
      { type: 'single', m: 0.01, x: 150, y: 0, vx: 0, vy: 1.6, spin: 0, pinned: false },
      { type: 'single', m: 0.01, x: 0, y: -170, vx: 1.5, vy: 0, spin: 0, pinned: false }]);
    const tot = () => { let px = 0, py = 0, L = 0;
      for (let i = 0; i < S.n; i++) { px += S.m[i] * S.vx[i]; py += S.m[i] * S.vy[i];
        L += S.m[i] * (S.x[i] * S.vy[i] - S.y[i] * S.vx[i]) + 0.5 * S.m[i] * S.R[i] * S.R[i] * S.spin[i]; }
      return { px: px + S.resPx, py: py + S.resPy, L: L + S.resL }; };
    const t0 = tot();
    for (let k = 0; k < 3000; k++) S.step(0.016);
    const t1 = tot();
    let pS = 0; for (let i = 0; i < S.n; i++) pS += S.m[i] * Math.hypot(S.vx[i], S.vy[i]);
    return { dP: Math.hypot(t1.px - t0.px, t1.py - t0.py), dL: Math.abs(t1.L - t0.L),
      pScale: pS, L0: Math.abs(t0.L), res: { px: S.resPx, py: S.resPy, L: S.resL }, nan: S.hasNaN() };
  };
  const cons2 = consRun(2), cons1 = consRun(1);
  const p4b3 = { geo2: cons2, geo1: cons1,
    relP2: cons2.dP / cons2.pScale, relL2: cons2.dL / cons2.L0,
    relP1: cons1.dP / cons1.pScale, relL1: cons1.dL / cons1.L0 };

  // ---- P4b-4: 🎡galaxyStd リトマス(アンカー④ — 初実測・QA 固定はしない) ----
  // legacy(geoPN=0)の外縁増強 kF1/kF0=1.2646 が、統一則(geoPN=2)では
  // 「渦度コリオリ+フレーム輸送(式由来)」からどれだけ出るかの初実測。
  // 分母(kF0)は geoPN=2 ∧ kF=0 ≡ geoPN=1 の測地線力学。
  const outer = (sm) => { let sum = 0, c = 0;
    for (let i = 1; i < sm.n; i++) { const rr = Math.hypot(sm.x[i], sm.y[i]);
      if (rr >= 156 && rr <= 286) { sum += (sm.x[i] * sm.vy[i] - sm.y[i] * sm.vx[i]) / rr; c++; } }
    return c ? sum / c : 0; };
  const galaxyRun = (geoPN, kF) => {
    HP.loadPreset('galaxyStd', false);
    const S = HP.sim;
    S.params.geoPN = geoPN; S.params.kFrame = kF;
    for (let k = 0; k < 6000; k++) S.step(0.016);
    return { vOut: outer(S), nan: S.hasNaN(), clampV: S.clampVN };
  };
  const g2kF1 = galaxyRun(2, 1), g2kF0 = galaxyRun(2, 0);
  const g0kF1 = galaxyRun(0, 1), g0kF0 = galaxyRun(0, 0);
  const p4b4 = { geo2: { kF1: g2kF1, kF0: g2kF0, ratio: g2kF1.vOut / g2kF0.vOut },
    legacy: { kF1: g0kF1, kF0: g0kF0, ratio: g0kF1.vOut / g0kF0.vOut } };

  return { p4b1, p4b2, p4b3, p4b4 };
});

const out = { meta: { exp: 'p4b', target: TARGET, date: new Date().toISOString().slice(0, 10) }, ...results };
fs.writeFileSync(path.join(OUT_DIR, 'p4b-results.json'), JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));
await browser.close();
