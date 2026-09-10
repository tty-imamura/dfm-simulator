// 第253便c(第45報・3 審査 v11): **メッシュ上の波動法則候補**(`HP.dfmMeshWaveRHS`)の実測ハーネスと、
// MM 連続波チャネルの**明示名 3 量**(検出器の縞移動 / 掃引寄与 / 光路の波数計数)の記録。
//
// 波動法則の候補(ChatGPT §6.1・**幾何から一意には出ない 1 候補**):
//   ω = u_mesh·k + c|k| の Hamilton 方程式  ẋ = u_mesh + c·k̂ ・ k̇ = −(∇u_mesh)ᵀk − |k|∇c
// 測るもの:
//   (W-a) **一様膨張** B=H·I: 解析解 k(t)=k₀e^{−Ht}(=|k|∝1/a・波長 ∝ a)・
//         x(t)=a·x₀+c·k̂₀(a−1)/H(a=e^{Ht})と RK4 積分の突き合わせ・刻み半減の誤差減少(≈4 次)
//   (W-b) **剛体回転** B=Ω·J: 解析解 k(t)=R(Ωt)k₀(**|k| 不変**)・x(t)=origin+R(Ωt)(x′₀+c·k̂₀t)
//   (W-c) **一様並進**(B=0)・**∇c≠0** の 1 点値(右辺の形の確認)と門
//   (D)   `HP.dfmMMCoherent` の明示名: detectorFringeShift / sweepFringeShift / sweepFringeShiftChange
//         を SI 1887 装置(L=11 m・λ₀=500 nm・Δν=1 MHz・δ(Δτ)=10⁻¹⁶ s)で出し、**比**を記録する
//   (S)   `HP.dfmMMLambdaSweep` の pathCountNull / detectorNull(3 規約)
//
// **合否判定はしない計測スクリプトである**(合否は QA behavior.meshWaveRHS / behavior.mmDetectorFringe)。
// 実行: QA_TARGET=beta/index.html node tests/exp-w253c-mmwave.mjs
// 出力: tests/out/exp-w253c-mmwave.json
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

const has = await page.evaluate(() => !!(window.HP && typeof HP.dfmMeshWaveRHS === 'function'
  && typeof HP.dfmMMCoherent === 'function' && typeof HP.dfmMMLambdaSweep === 'function'));
if (!has) { console.log('SKIP: 対象に HP.dfmMeshWaveRHS がありません'); await browser.close(); process.exit(0); }

const out = await page.evaluate(() => {
  const F = (mesh, ray, c, gc) => HP.dfmMeshWaveRHS(mesh, ray, c, gc);
  // 4 段 4 次の古典 RK4(ハーネス内で閉じる — エンジンは 1 度も呼ばない)
  const rk4 = (mesh, y0, c, T, n) => {
    let y = y0.slice(); const h = T / n;
    const f = (v) => { const r = F(mesh, { x: v[0], y: v[1], kx: v[2], ky: v[3] }, c);
      return [r.dx, r.dy, r.dkx, r.dky]; };
    for (let i = 0; i < n; i++) {
      const a = f(y);
      const b = f(y.map((v, j) => v + h / 2 * a[j]));
      const c3 = f(y.map((v, j) => v + h / 2 * b[j]));
      const d = f(y.map((v, j) => v + h * c3[j]));
      y = y.map((v, j) => v + h / 6 * (a[j] + 2 * b[j] + 2 * c3[j] + d[j]));
    }
    return y;
  };
  const maxErr = (a, b) => Math.max(...a.map((v, j) => Math.abs(v - b[j])));
  const K0 = [0.6, 0.8];                        // |k₀|=1(ビット厳密)
  const y0 = [1, 0.5, K0[0], K0[1]];

  // ---- (W-a) 一様膨張 B=H·I(u=H·(x−x₀))
  const H = 0.3, C = 1, TA = 2, aScale = Math.exp(H * TA);
  const meshExp = { origin: [0, 0], velocity: [0, 0], gradU: [H, 0, 0, H] };
  const exactExp = [aScale * y0[0] + C * K0[0] * (aScale - 1) / H,
    aScale * y0[1] + C * K0[1] * (aScale - 1) / H, K0[0] / aScale, K0[1] / aScale];
  const expRows = [20, 40, 80, 160, 320].map((n) => {
    const y = rk4(meshExp, y0, C, TA, n);
    const kmag = Math.hypot(y[2], y[3]);
    return { n, h: TA / n, err: maxErr(y, exactExp), kmag,
      kmagTimesA: kmag * aScale,               // 解析解なら 1(|k| ∝ 1/a)
      kmagRelErr: Math.abs(kmag * aScale - 1) };
  });
  for (let i = 1; i < expRows.length; i++) {
    expRows[i].ratio = expRows[i - 1].err / expRows[i].err;
    expRows[i].order = Math.log2(expRows[i - 1].err / expRows[i].err);
  }

  // ---- (W-b) 剛体回転 B=Ω·J(u=Ω(−(y−y₀), x−x₀))
  const OM = 0.7, TB = 3;
  const meshRot = { origin: [0, 0], velocity: [0, 0], gradU: [0, -OM, OM, 0] };
  const cs = Math.cos(OM * TB), sn = Math.sin(OM * TB);
  const xp = [y0[0] + C * K0[0] * TB, y0[1] + C * K0[1] * TB];   // 回転系では直線
  const exactRot = [cs * xp[0] - sn * xp[1], sn * xp[0] + cs * xp[1],
    cs * K0[0] - sn * K0[1], sn * K0[0] + cs * K0[1]];
  const rotRows = [50, 100, 200, 400, 800].map((n) => {
    const y = rk4(meshRot, y0, C, TB, n);
    const kmag = Math.hypot(y[2], y[3]);
    return { n, h: TB / n, err: maxErr(y, exactRot), kmag, kmagMinus1: kmag - 1 };
  });
  for (let i = 1; i < rotRows.length; i++) {
    rotRows[i].ratio = rotRows[i - 1].err / rotRows[i].err;
    rotRows[i].order = Math.log2(rotRows[i - 1].err / rotRows[i].err);
  }
  // 1 步の右辺そのもの: 剛体回転では **k·k̇ = −Ω k_x k_y + Ω k_x k_y = 0**(式のうえで厳密)。
  // 倍精度では積の丸めが残るので、対称点 k=(1,1) では**ビット厳密 0**・一般点では丸めの床になる
  const r0 = F(meshRot, { x: 1, y: 0.5, kx: 0.6, ky: 0.8 }, 1);
  const dk2 = 2 * (0.6 * r0.dkx + 0.8 * r0.dky);
  const rSym = F(meshRot, { x: 1, y: 0.5, kx: 1, ky: 1 }, 1);
  const dk2Sym = 2 * (1 * rSym.dkx + 1 * rSym.dky);

  // ---- (W-c) 一様並進(B=0)と ∇c≠0 の 1 点値・門
  const meshTr = { origin: [0, 0], velocity: [0.25, -0.5], gradU: [0, 0, 0, 0] };
  const tr = F(meshTr, { x: 3, y: -2, kx: 0.6, ky: 0.8 }, 2);
  const gcv = F(meshTr, { x: 3, y: -2, kx: 0.6, ky: 0.8 }, 2, [0.1, -0.2]);
  const shear = F({ origin: [1, 1], velocity: [0, 0], gradU: [0, 1, 0, 0] },
    { x: 3, y: 4, kx: 0.6, ky: 0.8 }, 1);
  const scaleFree = (() => {                     // |k| のスケールに依らない(k を 7 倍しても ẋ 同じ)
    const a = F(meshRot, { x: 1, y: 0.5, kx: 0.6, ky: 0.8 }, 1);
    const b = F(meshRot, { x: 1, y: 0.5, kx: 4.2, ky: 5.6 }, 1);
    return [a.dx === b.dx, a.dy === b.dy, b.dkx / a.dkx, b.dky / a.dky];
  })();
  const gate = [F({}, { x: 0, y: 0, kx: 0, ky: 0 }, 1), F({}, { x: 0, y: 0, kx: 1, ky: 0 }, 0),
    F({}, { x: 0, y: 0, kx: 1, ky: 0 }, -1), F({}, { x: NaN, y: 0, kx: 1, ky: 0 }, 1),
    F({ gradU: [1, 2, 3] }, { x: 0, y: 0, kx: 1, ky: 0 }, 1),
    F({}, { x: 0, y: 0, kx: Infinity, ky: 0 }, 1),
    F({}, { x: 0, y: 0, kx: 1, ky: 0 }, 1, [NaN, 0])].map((v) => v === null);
  const detCfg = () => JSON.stringify(F({ origin: [0.5, -1], velocity: [0.2, 0.3], gradU: [0.1, -0.2, 0.3, 0.4] },
    { x: 2, y: 3, kx: -0.5, ky: 1.25 }, 1.5, [0.01, 0.02]));
  const det = detCfg() === detCfg();

  // ---- (D) MM 連続波の明示名 3 量(SI 1887 装置)
  const CC = 299792458, LAM = 5e-7, NU0 = CC / LAM;
  const SI = { c: CC, lambda0: LAM, L1: 11, L2: 11.001 };
  const si = HP.dfmMMCoherent(Object.assign({}, SI, { nullPhase: true, nudot: 1e9, t: 1e-3, dTau: 1e-16 }));
  const siNoSweep = HP.dfmMMCoherent(Object.assign({}, SI, { nullPhase: true, dTau: 1e-16 }));
  const dvals = { nu0: NU0, dtau: si.dtau, dNu: si.dNu, dTau: si.dTau,
    detectorFringeShift: si.detectorFringeShift, sweepFringeShift: si.sweepFringeShift,
    sweepFringeShiftChange: si.sweepFringeShiftChange,
    dphiRot: si.dphiRot, dphiRotOverTwoPi: si.dphiRot / (2 * Math.PI),
    ratioDetectorOverSweepChange: si.detectorFringeShift / si.sweepFringeShiftChange,
    aliasFringesRot: si.fringesRot, aliasDN: si.dN, aliasDNRot: si.dNRot,
    noSweep: { detectorFringeShift: siNoSweep.detectorFringeShift,
      sweepFringeShift: siNoSweep.sweepFringeShift,
      sweepFringeShiftChange: siNoSweep.sweepFringeShiftChange },
    note: si.note };
  // 地表(χ=0.977554)で 90° 回したときの δ(Δτ) を第252便c と同じ器で
  const V = 29979.2458, CHI = 0.9775537;
  const P = (th) => HP.dfmMMPhase({ c: CC, lambda: LAM, L1: 11, L2: 11, theta0: th, omega: 0,
    vx: V, vy: 0, ux: CHI * V, uy: 0 });
  const p0 = P(0), p90 = P(Math.PI / 2), dTauRot = p90.dtExact - p0.dtExact;
  const rot = HP.dfmMMCoherent({ c: CC, lambda0: LAM, L1: 11, L2: 11, nullPhase: true,
    dTau: dTauRot, nudot: 1e9, t: 1e-3 });
  const spin = HP.dfmMMCoherent({ c: CC, lambda0: LAM, L1: 11, L2: 11, nullPhase: true,
    dTau: dTauRot * (465.1 / V) * (465.1 / V), nudot: 1e9, t: 1e-3 });

  // ---- (S) 3 規約の pathCountNull / detectorNull
  const sw = HP.dfmMMLambdaSweep({ L: 3, lambda0: 1, beta: 0.5, c: 1, dNu: 1 });
  const rules = {};
  for (const k of Object.keys(sw.byRule)) {
    const r = sw.byRule[k];
    rules[k] = { dN: r.dN, pathCountNull: r.pathCountNull, fixedNull: r.fixedNull,
      detectorNull: r.detectorNull, dT: r.dT, dNsweep: r.dNsweep,
      dPhiFixedLambda: r.dPhiFixedLambda, rhoConsistent: r.boundary.rhoConsistent };
  }
  return { wave: { expansion: { H, c: C, T: TA, a: aScale, k0: K0, exact: exactExp, rows: expRows },
      rotation: { omega: OM, c: C, T: TB, exact: exactRot, rows: rotRows, dk2AtOnePoint: dk2, dk2AtSymmetricPoint: dk2Sym },
      translate: tr, gradC: gcv, shear, scaleFree, gate, det },
    detector: dvals,
    rotate90: { dTauRot, chi: CHI, V,
      detectorFringeShift: rot.detectorFringeShift, dphiRot: rot.dphiRot,
      sweepFringeShiftChange: rot.sweepFringeShiftChange,
      spin: { dTau: spin.dTau, detectorFringeShift: spin.detectorFringeShift,
        dphiRot: spin.dphiRot, sweepFringeShiftChange: spin.sweepFringeShiftChange } },
    sweepRules: rules };
});

fs.writeFileSync(path.join(OUT_DIR, 'exp-w253c-mmwave.json'), JSON.stringify(out, null, 2));
const E = (x) => (x === null || x === undefined) ? String(x) : Number(x).toExponential(6);
console.log('=== 第253便c: メッシュ上の波動法則候補 ω=u·k+c|k| の Hamilton 方程式(RK4 検証)===');
console.log(`(W-a) 一様膨張 B=H·I(H=${out.wave.expansion.H}・c=1・T=${out.wave.expansion.T}・a=e^{HT}=${out.wave.expansion.a.toFixed(9)}・|k₀|=1)`);
console.log('      n      h        最大誤差(x,y,kx,ky)   誤差比   観測次数   |k|·a(解析解なら 1)');
for (const r of out.wave.expansion.rows) {
  console.log(`   ${String(r.n).padStart(5)} ${r.h.toFixed(5)}  ${E(r.err)}  ` +
    `${r.ratio ? r.ratio.toFixed(3).padStart(8) : '       —'}  ${r.order ? r.order.toFixed(3).padStart(6) : '     —'}   ${r.kmagTimesA.toFixed(15)}`);
}
console.log(`(W-b) 剛体回転 B=Ω·J(Ω=${out.wave.rotation.omega}・c=1・T=${out.wave.rotation.T})`);
console.log('      n      h        最大誤差(x,y,kx,ky)   誤差比   観測次数   |k|−1(不変なら 0)');
for (const r of out.wave.rotation.rows) {
  console.log(`   ${String(r.n).padStart(5)} ${r.h.toFixed(5)}  ${E(r.err)}  ` +
    `${r.ratio ? r.ratio.toFixed(3).padStart(8) : '       —'}  ${r.order ? r.order.toFixed(3).padStart(6) : '     —'}   ${E(r.kmagMinus1)}`);
}
console.log(`      d|k|²/dt: 一般点 k=(0.6,0.8) で ${out.wave.rotation.dk2AtOnePoint}(積の丸めの床)・対称点 k=(1,1) で ${out.wave.rotation.dk2AtSymmetricPoint}(**ビット厳密 0**)—— 式のうえでは k·k̇=−Ωk_xk_y+Ωk_xk_y=0`);
console.log(`(W-c) 一様並進 u=(0.25,−0.5)・c=2・k̂=(0.6,0.8): ẋ=(${out.wave.translate.dx},${out.wave.translate.dy})・k̇=(${out.wave.translate.dkx},${out.wave.translate.dky})・ω=${out.wave.translate.omega}`);
console.log(`      ∇c=(0.1,−0.2) を足すと k̇=(${out.wave.gradC.dkx},${out.wave.gradC.dky})(=−|k|∇c)`);
console.log(`      せん断 B=[[0,1],[0,0]]: k̇=(${out.wave.shear.dkx},${out.wave.shear.dky})(転置 (∇u)ᵀ の確認 — B01 は dky に効く)`);
console.log(`      |k| スケール非依存: ẋ 一致=${out.wave.scaleFree[0]}/${out.wave.scaleFree[1]}・k̇ は 7 倍=${out.wave.scaleFree[2]}/${out.wave.scaleFree[3]}`);
console.log(`      門(|k|=0・c=0・c<0・NaN・短い gradU・∞・NaN ∇c)=${JSON.stringify(out.wave.gate)}・決定性=${out.wave.det}`);
console.log('=== (D) MM 連続波の明示名 3 量(SI 1887 装置 L=11 m・λ₀=500 nm・ΔL=1 mm・Δν=1 MHz・δ(Δτ)=1e−16 s)===');
const D = out.detector;
console.log(`  ν₀=${E(D.nu0)} Hz・Δτ=${E(D.dtau)} s`);
console.log(`  ① detectorFringeShift(検出器の縞移動 δN_detector=−ν₀δ(Δτ)) = **${D.detectorFringeShift}** 縞(δΔφ=${E(D.dphiRot)} rad)`);
console.log(`  ② sweepFringeShift(掃引寄与 −Δν·Δτ) = ${E(D.sweepFringeShift)} 縞 / その δ(Δτ) による変化 = ${E(D.sweepFringeShiftChange)} 縞`);
console.log(`  ①/② の比 = ${E(D.ratioDetectorOverSweepChange)}(約 6×10⁸ 倍)`);
console.log(`  Δν=0(掃引なし)にすると ② は ${D.noSweep.sweepFringeShift}/${D.noSweep.sweepFringeShiftChange} になるが ① は ${D.noSweep.detectorFringeShift} のまま**動く**`);
console.log(`  装置を 90° 回す(χ=${out.rotate90.chi}): δ(Δτ)=${E(out.rotate90.dTauRot)} s → ① ${E(out.rotate90.detectorFringeShift)} 縞(δΔφ=${E(out.rotate90.dphiRot)} rad)・② ${E(out.rotate90.sweepFringeShiftChange)} 縞`);
console.log(`  地球の自転 465.1 m/s 相当: δ(Δτ)=${E(out.rotate90.spin.dTau)} s → ① ${E(out.rotate90.spin.detectorFringeShift)} 縞(δΔφ=${E(out.rotate90.spin.dphiRot)} rad)`);
console.log('=== (S) 3 規約の pathCountNull / detectorNull(L=3・λ₀=1・c=1・β=0.5・Δν=1)===');
for (const [k, v] of Object.entries(out.sweepRules)) {
  console.log(`  ${k.padEnd(9)} ΔN_path=${v.dN} pathCountNull=${v.pathCountNull} **detectorNull=${v.detectorNull}** ΔT=${v.dT} ΔN_sweep=${v.dNsweep} 境界整合=${v.rhoConsistent}`);
}
console.log('出力: tests/out/exp-w253c-mmwave.json');
await browser.close();
