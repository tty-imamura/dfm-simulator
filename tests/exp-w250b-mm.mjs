// 第250便b(第42報 W2): DFM 版マイケルソン–モーリーの**波長チャネル**の実測ハーネス。
//
// 原仮定者(第42報)の指示:「別々の方向に発射した光子が、反射して戻って来た時の波長を比較する。
// 干渉計なので、波長の比較で正しい。観測位置が移動していても、ドップラー効果を考慮して一致する事を
// 確認する」。純関数 HP.dfmMMWavelength(規約: ω=u·k+c|k|・移動境界で ω−V·k 保存・
// 検出器の読み ν_D=(ω−V_D·k)/2π)を、階段 W1〜W5 で測る。
//
// 2 系統で回す:
//   ① SI 1887 干渉計(L=11 m・λ₀=500 nm・v=29.9792458 km/s=β 10⁻⁴・c=299792458 m/s)
//   ② 🪞 mmPhaseToy のエンジンが決める χ=|u|/|v| を HP.dfmFrameAt から読み、u=χ·v として同じ SI 装置へ
//      (固体殻 h=0.01R と気体殻 gasCoh=0.3 の 2 条件)
//
// 階段:
//   W1 静止・等長          → λ₁=λ₂=λ₀ 厳密・Δν=0・Δφ=0
//   W2 静止・ΔL=125 nm     → **Δλ=0・Δν=0 だが Δφ=π**(波長比較の null と距離の正対照が分かれる)
//   W3 装置 v・u=0         → 共移動検出器で ν_D 一致・共通出力方向の λ 一致・**Δφ=0.22 縞が残る**・
//                             90° 回転で符号反転。戻り方向の空間波長は方向が違うので O(β) で違う
//   W4 随伴 u=V            → 全部 0(χ<1 なら位相は (1−χ)²)
//   W5 検出器だけ動く       → 補正前 Δν≠0・ドップラー補正後 W1 に戻る
//
// **合否判定はしない計測スクリプトである**(合否は QA behavior.mmWavelength が持つ)。
// 実行: QA_TARGET=beta/index.html node tests/exp-w250b-mm.mjs
// 出力: tests/out/exp-w250b-mm.json
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

const has = await page.evaluate(() => !!(window.HP && typeof HP.dfmMMWavelength === 'function'
  && typeof HP.dfmMMPhase === 'function'));
if (!has) { console.log('SKIP: 対象に HP.dfmMMWavelength がありません'); await browser.close(); process.exit(0); }

const out = await page.evaluate(() => {
  const C = 299792458, LAM = 5e-7, L = 11, V = 29979.2458;   // 1887 年の装置・地球の公転速度(β=1e-4)
  const W = (o) => HP.dfmMMWavelength(o);
  const base = { c: C, lambda0: LAM, L1: L, L2: L };
  const pick = (r) => ({
    lam1Fwd: r.arm1.lambdaFwd, lam1Out: r.arm1.lambdaOut, lam1Com: r.arm1.lambdaCommon,
    lam2Fwd: r.arm2.lambdaFwd, lam2Out: r.arm2.lambdaOut, lam2Com: r.arm2.lambdaCommon,
    nu1: r.arm1.nuD, nu2: r.arm2.nuD, D1: r.arm1.D, D2: r.arm2.D,
    r1: r.arm1.nuD / r.nu0, r2: r.arm2.nuD / r.nu0,
    nuCorr1: r.arm1.nuCorr, nuCorr2: r.arm2.nuCorr,
    rho: [r.arm1.rhoFwd, r.arm1.rhoBack, r.arm2.rhoFwd, r.arm2.rhoBack],
    nuLongRel: [r.arm1.nuDlong / r.arm1.nuD - 1, r.arm2.nuDlong / r.arm2.nuD - 1],
    nBack1: r.arm1.nBack, nBack2: r.arm2.nBack,
    dLamOut: r.dLambdaOut, dLamCom: r.dLambdaCommon, dNu: r.dNu, dNuCorr: r.dNuCorr,
    dphi: r.phase.dphi, dphiExact: r.phase.dphiExact, fringes: r.phase.fringes,
    dt: r.phase.dt, beta: r.beta, betaD: r.betaD,
  });

  // ---- 系統① SI 1887 干渉計 ------------------------------------------------------------
  const W1 = W(Object.assign({}, base));
  const dL = 1.25e-7;                                   // ΔL=λ/4 → 往復 λ/2 → Δφ=π
  const W2 = W(Object.assign({}, base, { L1: L + dL }));
  const W3 = W(Object.assign({}, base, { vx: V }));
  const W3o = W(Object.assign({}, base, { vx: V, nOut: [1, 0] }));       // 同一 +x 出力へ再合成
  const W3r = W(Object.assign({}, base, { vx: V, theta0: Math.PI / 2, nOut: [1, 0] }));
  const W4 = W(Object.assign({}, base, { vx: V, ux: V, nOut: [1, 0] })); // 随伴 u=V(χ=1)
  const VD = { x: V + 1000, y: 5000 };                                   // 検出器だけ (1000,5000) を追加
  const W5 = W(Object.assign({}, base, { vx: V, vD: VD, nOut: [1, 0] }));
  const W5s = W(Object.assign({}, base, { vD: { x: 1000, y: 5000 }, nOut: [1, 0] })); // 静止装置+動く検出器

  // ---- 根探索の許容 2 段(iters 200 → 500)------------------------------------------------
  const two = [W(Object.assign({}, base, { vx: V, nOut: [1, 0], iters: 200 })),
    W(Object.assign({}, base, { vx: V, nOut: [1, 0], iters: 500 }))];
  const keys = ['lam1Out', 'lam2Out', 'lam1Com', 'lam2Com', 'nu1', 'nu2', 'dphi', 'dt'];
  const a = pick(two[0]), b = pick(two[1]);
  const iterStab = keys.map((k) => ({ k, same: Object.is(a[k], b[k]),
    rel: (a[k] === b[k]) ? 0 : Math.abs(a[k] / b[k] - 1) }));

  // ---- 入力の門 -------------------------------------------------------------------------
  const gate = { rot: W(Object.assign({}, base, { omega: 1 })) === null,
    fast: W(Object.assign({}, base, { vx: 2 * C })) === null,
    fastD: W(Object.assign({}, base, { vD: { x: 2 * C, y: 0 } })) === null,
    nan: W(Object.assign({}, base, { L1: NaN })) === null };

  // ---- 決定性(同じ cfg で 2 回・全数値ビット同一)----------------------------------------
  const cfgD = { c: C, lambda0: LAM, L1: L + 3e-4, L2: L, vx: 1234.5, uy: 67.8,
    theta0: 0.3, vD: { x: 2000, y: -300 }, nOut: [0.6, 0.8] };
  const kk = (r) => [r.arm1.lambdaOut, r.arm2.lambdaOut, r.arm1.lambdaCommon, r.arm2.lambdaCommon,
    r.arm1.nuD, r.arm2.nuD, r.arm1.D, r.arm2.D, r.dLambdaOut, r.dNu, r.phase.dphi];
  const d1 = kk(W(cfgD)), d2 = kk(W(cfgD));
  const det = d1.every((z, i) => Object.is(z, d2[i]));

  // ---- 系統② エンジンの χ(🪞 mmPhaseToy を build して HP.dfmFrameAt で読む)---------------
  let eng = null;
  if (HP.allPresets().some((q) => q.id === 'mmPhaseToy')) {
    const chiAt = (patch, gas) => {
      const pd = JSON.parse(JSON.stringify(HP.allPresets().find((q) => q.id === 'mmPhaseToy')));
      if (patch) pd.physics = Object.assign({}, pd.physics, patch);
      if (gas) pd.bodies[0].shell = 'gas';
      const v = HP.validatePreset(pd); const S = HP.sim; S.build(v.preset);
      const f = HP.dfmFrameAt(S.x[1], S.y[1], S);
      const uu = Math.hypot(f.ux, f.uy), vv = Math.hypot(S.vx[1], S.vy[1]);
      return (vv > 0) ? uu / vv : 0;
    };
    const chiSolid = chiAt(null, false), chiGas = chiAt({ gasCoh: 0.3 }, true), chiOff = chiAt({ kFrame: 0 }, false);
    const run = (chi) => pick(W(Object.assign({}, base, { vx: V, ux: chi * V, nOut: [1, 0] })));
    eng = { chiSolid, chiGas, chiOff,
      solid: run(chiSolid), gas: run(chiGas), off: run(chiOff),
      // 検出器だけが動く場合も χ の中で確認する
      solidW5: pick(W(Object.assign({}, base, { vx: V, ux: chiSolid * V, vD: VD, nOut: [1, 0] }))) };
  }

  return { si: { W1: pick(W1), W2: pick(W2), dL, W3: pick(W3), W3o: pick(W3o), W3r: pick(W3r),
    W4: pick(W4), W5: pick(W5), W5s: pick(W5s), nu0: W1.nu0 },
    iterStab, gate, det, eng };
});

fs.writeFileSync(path.join(OUT_DIR, 'exp-w250b-mm.json'), JSON.stringify(out, null, 1));
const S = out.si, nm = (x) => (x * 1e9).toFixed(9) + ' nm';
console.log('== 第250便b W2: MM の波長チャネル(SI 1887 装置・λ₀=500nm・L=11m・β=1e-4)==');
console.log(`W1 静止・等長 : λ₁=${nm(S.W1.lam1Out)} λ₂=${nm(S.W1.lam2Out)} Δλ=${S.W1.dLamOut} ` +
  `Δν=${S.W1.dNu} Δφ=${S.W1.dphi}`);
console.log(`W2 静止・ΔL=${S.dL} m: Δλ=${S.W2.dLamOut} Δν=${S.W2.dNu} ` +
  `Δφ=${S.W2.dphiExact} (π と相対 ${Math.abs(S.W2.dphiExact / Math.PI - 1).toExponential(1)})`);
console.log(`W3 装置 v・u=0 : 戻り λ₁=${nm(S.W3.lam1Out)} λ₂=${nm(S.W3.lam2Out)} ` +
  `(Δλ_out=${(S.W3.dLamOut * 1e9).toExponential(6)} nm) / 共通出力 +x で ` +
  `${nm(S.W3o.lam1Com)}・${nm(S.W3o.lam2Com)}(Δλ=${S.W3o.dLamCom}) / ` +
  `ν_D/ν₀ = ${S.W3o.r1} , ${S.W3o.r2} / Δφ=${S.W3o.dphiExact} rad = ${S.W3o.fringes} 縞`);
console.log(`W3 90° 回転  : Δφ=${S.W3r.dphiExact} (符号反転 rel ` +
  `${Math.abs(S.W3r.dphiExact / -S.W3o.dphiExact - 1).toExponential(1)}) Δλ_com=${S.W3r.dLamCom}`);
console.log(`W4 随伴 u=V  : Δλ=${S.W4.dLamOut} Δν=${S.W4.dNu} Δφ(解析形)=${S.W4.dphiExact}`);
console.log(`W5 検出器のみ動く: ν_D/ν₀ = ${S.W5.r1} , ${S.W5.r2}(Δν=${S.W5.dNu.toExponential(6)} Hz)` +
  ` → 補正後 ${S.W5.nuCorr1 / S.nu0} , ${S.W5.nuCorr2 / S.nu0}(ΔνCorr=${S.W5.dNuCorr})`);
console.log(`W5′ 静止装置+動く検出器: ν_D/ν₀ = ${S.W5s.r1} , ${S.W5s.r2} → 補正後 ΔνCorr=${S.W5s.dNuCorr}`);
console.log(`iters 200/500 のビット同一 = ${out.iterStab.every((r) => r.same)} / 決定性=${out.det} / ` +
  `門(回転・超光速・NaN)=${JSON.stringify(out.gate)}`);
if (out.eng) {
  const E = out.eng;
  console.log(`エンジン χ: 固体殻 ${E.chiSolid.toFixed(6)} / 気体殻 ${E.chiGas.toFixed(6)} / kFrame=0 ${E.chiOff}`);
  console.log(`  χ の中: Δλ_com=${E.solid.dLamCom} Δν=${E.solid.dNu} Δφ=${E.solid.dphiExact} ` +
    `(kFrame=0 の ${(E.off.dphiExact / E.solid.dphiExact).toFixed(1)} 分の 1・(1−χ)² 則) / ` +
    `気体殻 Δφ=${E.gas.dphiExact}`);
  console.log(`  χ の中で検出器だけ動かす: ν_D/ν₀ = ${E.solidW5.r1} , ${E.solidW5.r2} → ` +
    `補正後 ΔνCorr=${E.solidW5.dNuCorr}`);
}
console.log('出力: tests/out/exp-w250b-mm.json');
await browser.close();
