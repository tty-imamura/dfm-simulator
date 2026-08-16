// 第122便 exp-kf1c.mjs — 🌘earthMoonRealKF1 と 🪨mercuryRealKF1 を「共に満たす」補正の検証
// (原仮定者指示「共に満たす補正を検証する。『引きずり減衰 q』の算出などを試す。
//   引きずられる側のスピンにも着目する」)
// 仮説(第121便までの分解に基づく):
//   - 🌘 の較正(D₀=0.006)は運動項起源(地球の重心運動が u に乗る)— スピン項はほぼ無関与。
//   - 🪨 の逆行歳差はスピン項起源(pinned 太陽は v=0 → u に乗るのは ω(d)=s·(R/(R+d))^q だけ)。
//   → D₀ を共通の 0.006 に戻し、q を上げてスピン項だけを幾何減衰させれば両立するはず。
//   算出: 抑制率 = (R/(R+a))^(q−3)。必要抑制率 ε/|A₃| から q* = 3 + ln(|A₃|/ε)/ln((R+a)/R)。
// 実行: node tests/exp-kf1c.mjs(playwright 必須・数分)→ tests/out/kf1c-results.json
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

const out = { target: TARGET, wave: 122, tests: {} };

// 二体(pinned 可)の RL 歳差・周期・e ドリフトを高精度計測(exp-kf1b と同一手法)
const runRL = (cfg) => page.evaluate(async (c) => {
  const P = c.phys, M = c.M, m2 = c.m2;
  const mu = c.pin ? M : M + m2;
  const GM = P.G * mu;
  const e = c.e || 0, a = c.a, rp = a * (1 - e);
  const vp = Math.sqrt(GM * (1 + e) / rp) * (c.f || 1);
  const fm = c.pin ? 0 : m2 / (M + m2);
  const S = HP.sim;
  S.build({ id: 'kf1c', name: 'kf1c-' + c.id, emoji: '🧪', seed: 1,
    camera: { scale: 300 }, world: { boundary: 'none', size: 0 }, physics: P,
    bodies: [
      { type: 'single', m: M, radius: c.rM || undefined, x: -rp * fm, y: 0, vx: 0, vy: -vp * fm,
        spin: c.spinM || 0, pinned: !!c.pin, pnSource: true },
      { type: 'single', m: m2, radius: c.r2 || undefined, x: rp * (1 - fm), y: 0, vx: 0,
        vy: vp * (1 - fm), spin: c.spin2 || 0, pinned: false },
    ] });
  const qEff = S.physics ? S.physics.q : null;   // クランプ確認(q>4 拡張の検証)
  const TK = 2 * Math.PI * Math.sqrt(a * a * a / GM);
  const dt = 0.016, steps = Math.ceil((c.orbits || 5) * TK / dt);
  const SAMPLE = Math.max(1, Math.floor(steps / 4000));
  let pomPrev = null, pomUnw = 0;
  let sT = 0, sP = 0, sTT = 0, sTP = 0, nS = 0;
  let e0 = null, eLast = 0, rmin = Infinity, rmax = 0;
  let ang = 0, px = 0, py = 0, t2pi = [], collapsed = null;
  for (let k = 0; k < steps; k++) {
    S.step(dt);
    const dx = S.x[1] - S.x[0], dy = S.y[1] - S.y[0];
    const vx = S.vx[1] - S.vx[0], vy = S.vy[1] - S.vy[0];
    const rr = Math.hypot(dx, dy);
    if (rr < rmin) rmin = rr; if (rr > rmax) rmax = rr;
    if (k === 0) { px = dx; py = dy; }
    else { ang += Math.atan2(px * dy - py * dx, px * dx + py * dy); px = dx; py = dy;
      if (Math.abs(ang) >= 2 * Math.PI * (t2pi.length + 1)) t2pi.push((k + 1) * dt); }
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
  let Tavg = null; if (t2pi.length >= 2) { let acc = 0;
    for (let i = 1; i < t2pi.length; i++) acc += t2pi[i] - t2pi[i - 1]; Tavg = acc / (t2pi.length - 1); }
  const slope = (nS > 2) ? (nS * sTP - sT * sP) / (nS * sTT - sT * sT) : NaN;
  return { dPomPerOrbit: slope * TK, TK, Tavg, e0, eDrift: eLast - e0,
    amp: (rmax - rmin) / ((rmax + rmin) / 2), collapsed, nan: S.hasNaN(), qEff };
}, cfg);

const fmtR = (r) => `Δϖ/公転=${isFinite(r.dPomPerOrbit) ? r.dPomPerOrbit.toExponential(3) : '—'}` +
  ` eドリフト=${r.eDrift.toExponential(2)}` +
  (r.collapsed ? ` 崩壊@${r.collapsed.toFixed(2)}` : '') + ` NaN=${r.nan}` +
  (r.qEff != null ? ` (q_eff=${r.qEff})` : '');

// 観測較正プロファイル(第118便正本)— D₀ だけ共通候補 0.006 に置く
const MERC = { G: 6.674, D0: 0.006, kFrame: 1, q: 3, kRep: 0, muF: 0, gammaN: 0, kappaS: 0,
  Kt: 134851663.17051244, cLight: 30000, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
  massFloor: 1e-6, geoPN: 2, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 0.05,
  timeScale: 1, stateCarry: 'double' };
const mkMerc = (id, over, extra) => Object.assign({ id, M: 1988.5, m2: 0.00033011, a: 579.09,
  e: 0.20563, rM: 6.95, r2: 0.0244, spinM: 0.029031, spin2: 0.0124, pin: true, orbits: 8,
  phys: Object.assign({}, MERC, over) }, extra);

// ---- A) 🪨 水星: 共通 D₀=0.006 での q スキャン(スピン項の幾何抑制の実証)----
{
  const A = { scan: {} };
  console.log('== A) 🪨 q スキャン(D₀=0.006 共通・8公転・pinned 太陽)==');
  A.kF0 = await runRL(mkMerc('kF0', { kFrame: 0 }));
  console.log(`[A0 kF0 基準           ] ${fmtR(A.kF0)}(1PN 解析値 +5.02e-7 rad/公転)`);
  for (const q of [3, 3.5, 4, 4.5, 5, 6]) {
    const r = await runRL(mkMerc('q' + q, { q }));
    A.scan[q] = r;
    const drag = r.dPomPerOrbit - A.kF0.dPomPerOrbit;
    console.log(`[A q=${String(q).padEnd(3)}] ${fmtR(r)} 引きずり=${drag.toExponential(3)}`);
  }
  // 算出: 幾何抑制則 (R/(R+a))^(q−3) と必要 q* の予測
  const tt = 6.95 / (6.95 + 579.09);
  const A3 = A.scan[3].dPomPerOrbit - A.kF0.dPomPerOrbit;
  const eps = 5.02e-7 / 8;   // 1PN の 1/8(第121便の採用水準)
  const qStar = 3 + Math.log(Math.abs(A3) / eps) / Math.log(1 / tt);
  A.derivation = { tt, A3, eps, qStar };
  console.log(`[A:算出] tt=R/(R+a)=${tt.toExponential(3)} |A₃|=${Math.abs(A3).toExponential(3)} → q*=3+ln(|A₃|/ε)/ln(1/tt)=${qStar.toFixed(3)}`);
  out.tests.mercuryQscan = A;
}

// ---- B) 🪨 引きずられる側(水星)のスピン用量(共通 D₀・q=3 と q=q* の両方)----
{
  const B = {};
  console.log('== B) 🪨 被引きずり側スピン用量(spin2: 0 / 実 / ×100 / ×1e4)==');
  for (const [tag, s2] of [['s0', 0], ['real', 0.0124], ['x100', 1.24], ['x1e4', 124]]) {
    B['q3_' + tag] = await runRL(mkMerc('B3' + tag, {}, { spin2: s2 }));
    console.log(`[B q=3   spin2=${String(s2).padEnd(7)}] ${fmtR(B['q3_' + tag])}`);
  }
  for (const [tag, s2] of [['s0', 0], ['real', 0.0124], ['x100', 1.24], ['x1e4', 124]]) {
    B['q5_' + tag] = await runRL(mkMerc('B5' + tag, { q: 5 }, { spin2: s2 }));
    console.log(`[B q=5   spin2=${String(s2).padEnd(7)}] ${fmtR(B['q5_' + tag])}`);
  }
  out.tests.mercurySpin2 = B;
}

// ---- C) 🌘 地球月: 共通 D₀=0.006・q 引き上げが較正(8.85年・恒星月)を壊さない事の検証 ----
{
  const EM = { G: 6.674, D0: 0.006, kFrame: 1, q: 3, kRep: 0, muF: 0, gammaN: 0, kappaS: 0,
    Kt: 134851663.17051244, cLight: 30000, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
    massFloor: 1e-6, geoPN: 2, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 0.1,
    timeScale: 1, stateCarry: 'double' };
  const mkEM = (id, over, extra) => Object.assign({ id, M: 0.59724, m2: 0.007346, a: 384.748,
    e: 0.0549, rM: 6.38, r2: 1.74, spinM: 0.0072921, spin2: 0.00026617, f: 0.9968, orbits: 8,
    phys: Object.assign({}, EM, over) }, extra);
  const C = {};
  console.log('== C) 🌘 較正保存の検証(D₀=0.006・f=0.9968・8公転・自由二体)==');
  for (const q of [3, 4.5, 5, 6]) {
    const r = await runRL(mkEM('q' + q, { q }));
    C['q' + q] = r;
    console.log(`[C q=${String(q).padEnd(3)}] ${fmtR(r)} Δϖ比=${(r.dPomPerOrbit / 0.05311).toFixed(4)}(目標1.0) T=${r.Tavg ? (r.Tavg * 100 / 86400).toFixed(4) : '—'}日(観測 27.3217)`);
  }
  // 被引きずり側(月)のスピン用量も確認(同期自転 → 0 / ×100)
  for (const [tag, s2] of [['s0', 0], ['x100', 0.026617]]) {
    const r = await runRL(mkEM('Cs' + tag, { q: 5 }, { spin2: s2 }));
    C['q5spin_' + tag] = r;
    console.log(`[C q=5 spin2=${tag}   ] ${fmtR(r)} Δϖ比=${(r.dPomPerOrbit / 0.05311).toFixed(4)}`);
  }
  out.tests.earthMoonCal = C;
}

// ---- D) 統合判定: 共通(D₀=0.006, q=5)で両系が同時成立するか ----
{
  const A = out.tests.mercuryQscan, C = out.tests.earthMoonCal;
  const dragQ5 = A.scan[5].dPomPerOrbit - A.kF0.dPomPerOrbit;
  const ok1 = Math.abs(dragQ5) < 5.02e-7 / 8;
  const ratio = C.q5.dPomPerOrbit / 0.05311;
  const ok2 = ratio > 0.85 && ratio < 1.15;   // 第120便の窓依存 ±15% と同水準
  console.log('== D) 統合判定(共通 D₀=0.006・q=5)==');
  console.log(`[D1 🪨] 引きずり=${dragQ5.toExponential(3)} rad/公転(閾値 ±${(5.02e-7 / 8).toExponential(2)})→ ${ok1 ? 'PASS' : 'FAIL'}`);
  console.log(`[D2 🌘] Δϖ比=${ratio.toFixed(4)}(0.85〜1.15)→ ${ok2 ? 'PASS' : 'FAIL'}`);
  console.log(`[D 総合] ${ok1 && ok2 ? '共通補正成立(D₀=0.006, q=5)' : '不成立 — 数値を精査'}`);
  out.tests.joint = { dragQ5, ok1, ratio, ok2, pass: ok1 && ok2 };
}

fs.writeFileSync(path.join(OUT_DIR, 'kf1c-results.json'), JSON.stringify(out, null, 2));
console.log('saved: tests/out/kf1c-results.json');
await browser.close();
