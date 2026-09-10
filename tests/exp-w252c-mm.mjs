// 第252便c(第44報): マイケルソン・モーリー干渉計 —— **固定波長の位相**と**掃引で動く縞の計数**を
// 分けて実測するハーネス。
//
// 原仮定者(第44報)の指示:
//   「実物の干渉計では、位相を合わせているが、二腕の長さの完全一致は保証していない / 腕の長さが違うと、
//     波長を時間変化させた時に、二腕の到着時間の違いで干渉縞が発生する / 波長を時間変化させても
//     干渉縞が発生しない状態を設定出来れば、到着時間が一致している / ここでの主張は、波長が固定された
//     干渉計は、光の到着時間が影響しない事である / なおDFMでは、地球上にある干渉計は地球の自転で
//     移動しているので、干渉計を回せば、ゼロ距離の地球の引きずりを考慮しても、わずかに二腕の光の
//     到着時間が変化する。位相は変わらない」
//
// 測るもの:
//   (i)   等長・静止: Δφ=ψ 固定・掃引しても ΔN=0
//   (ii)  腕長差 ΔL・静止: 固定波長は ψ で縞を消せるが、掃引すると ΔN=−Δν·Δτ≠0
//   (iii) 掃引しても ΔN=0 ⇔ Δτ=0
//   (iv)  固定波長で ψ を合わせた後に Δτ が δ 動く(装置を回す): Δφ=−2πν₀·δ(Δτ) だけ位相が動く
//   (S)   3 規約(stretch/galilean/comoving)の固定 λ₀ の ΔN と掃引の ΔN_sweep(ΔT 感度)
//   (B)   受動鏡境界の周波数検算(β=0.5・L=3・λ₀=1・ω=c|k| と ω−V·k 保存)
//   (E)   地表(h=0.01R・エンジンの χ)で装置を 90° 回したときの δ(Δτ) と δ(Δφ)
//
// **合否判定はしない計測スクリプトである**(合否は QA behavior.mmCoherent / behavior.mmLambdaSweep)。
// 実行: QA_TARGET=beta/index.html node tests/exp-w252c-mm.mjs
// 出力: tests/out/exp-w252c-mm.json
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

const has = await page.evaluate(() => !!(window.HP && typeof HP.dfmMMCoherent === 'function'
  && typeof HP.dfmMMLambdaSweep === 'function' && typeof HP.dfmMMPhase === 'function'));
if (!has) { console.log('SKIP: 対象に HP.dfmMMCoherent がありません'); await browser.close(); process.exit(0); }

const out = await page.evaluate(() => {
  const C = 299792458, LAM = 5e-7, L = 11, V = 29979.2458;   // 1887 年の装置・地球の公転速度(β=1e-4)
  const NU0 = C / LAM;                                        // 5.99584916e14 Hz
  const K = (o) => HP.dfmMMCoherent(o);
  const base = { c: C, lambda0: LAM, L1: L, L2: L };
  // 掃引: 1 秒で 1 GHz(ν̇=1e9 Hz/s)を 1 ms 見る = 掃引幅 Δν=1 MHz(実験室の掃引レーザ相当の桁)
  const NUDOT = 1e9, TSW = 1e-3;
  const pick = (r) => ({ dtau: r.dtau, psi: r.psi, dphiFixed: r.dphiFixed, fringesFixed: r.fringesFixed,
    dphi: r.dphi, dphi0: r.dphi0, dN: r.dN, dNDiff: r.dNDiff, dNRel: r.dNRel, dNu: r.dNu,
    sweepNull: r.sweepNull, dtauZero: r.dtauZero, dphiRot: r.dphiRot, dphiAfter: r.dphiAfter,
    dNRot: r.dNRot, fringesRot: r.fringesRot, psiNull: r.psiNull });

  // ---- (i) 等長・静止(ψ=0 と ψ=0.7 の 2 通り)
  const i0 = K(Object.assign({}, base, { nudot: NUDOT, t: TSW }));
  const iPsi = K(Object.assign({}, base, { psi: 0.7, nudot: NUDOT, t: TSW }));
  // ---- (ii) 腕長差 ΔL=1 mm(静止)。固定波長は ψ で消せる / 掃引すると縞が動く
  const DL = 1e-3;
  const iiRaw = K(Object.assign({}, base, { L2: L + DL, nudot: NUDOT, t: TSW }));
  const iiNull = K(Object.assign({}, base, { L2: L + DL, nullPhase: true, nudot: NUDOT, t: TSW }));
  const iiFix = K(Object.assign({}, base, { L2: L + DL, nullPhase: true }));   // 掃引なし(ν̇=0)
  // 掃引幅を 10 倍・100 倍にして ΔN の線形性を見る
  const iiScale = [1, 10, 100].map((k) => {
    const r = K(Object.assign({}, base, { L2: L + DL, nullPhase: true, nudot: NUDOT * k, t: TSW }));
    return { k, dNu: r.dNu, dN: r.dN, dNRel: r.dNRel };
  });
  // ---- (iii) ΔN=0 ⇔ Δτ=0(ΔL を 0 に近づける)
  const iii = [1e-3, 1e-6, 1e-9, 0].map((dl) => {
    const r = K(Object.assign({}, base, { L2: L + dl, nullPhase: true, nudot: NUDOT, t: TSW }));
    return { dL: dl, dtau: r.dtau, dN: r.dN, sweepNull: r.sweepNull, dtauZero: r.dtauZero };
  });
  // ---- (iv) 固定波長で ψ を合わせた後、Δτ が δ 動く(装置を回す)
  const DTAUS = [1e-18, 1e-16, 4.6e-16];   // 4.6e-16 s は (E) の地表回転で出る桁
  const iv = DTAUS.map((d) => {
    const r = K(Object.assign({}, base, { L2: L + DL, nullPhase: true, dTau: d, nudot: NUDOT, t: TSW }));
    return { dTau: d, dphiFixed: r.dphiFixed, dphiRot: r.dphiRot, dphiAfter: r.dphiAfter,
      fringesRot: r.fringesRot, dNRot: r.dNRot,
      closed: -2 * Math.PI * NU0 * d,
      rel: Math.abs(r.dphiRot / (-2 * Math.PI * NU0 * d) - 1) };
  });

  // ---- (S) 3 規約の固定 λ₀ ΔN と掃引 ΔT 感度(L=3・λ₀=1・c=1・β=0.5 と L=10)
  const SW3 = HP.dfmMMLambdaSweep({ L: 3, lambda0: 1, beta: 0.5, c: 1, nudot: 1, t: 1 });
  const SW10 = HP.dfmMMLambdaSweep({ L: 10, lambda0: 1, beta: 0.5, c: 1, dNu: 1 });
  const sRow = (S) => Object.fromEntries(Object.entries(S.byRule).map(([k, v]) => [k, {
    N: v.N, Nperp: v.Nperp, dN: v.dN, T: v.T, Tperp: v.Tperp, dT: v.dT,
    dPhi: v.dPhiFixedLambda, fringes: v.fringesFixedLambda,
    dNsweep: v.dNsweep, dNsweepRate: v.dNsweepRate, fixedNull: v.fixedNull, sweepNull: v.sweepNull }]));
  // ---- (B) 受動鏡境界の検算(u=0 が既定。stretch は u=V でも見る)
  const bRow = (S) => Object.fromEntries(Object.entries(S.byRule).map(([k, v]) => [k, v.boundary]));
  const SWu = HP.dfmMMLambdaSweep({ L: 3, lambda0: 1, beta: 0.5, c: 1, uFrac: 0.5 });
  // 門と決定性
  const det = (() => {
    const a = JSON.stringify(HP.dfmMMLambdaSweep({ L: 7.5, lambda0: 0.4, beta: -0.25, c: 2, nudot: 3, t: 2 }));
    const b = JSON.stringify(HP.dfmMMLambdaSweep({ L: 7.5, lambda0: 0.4, beta: -0.25, c: 2, nudot: 3, t: 2 }));
    const p = JSON.stringify(K({ c: 3, lambda0: 0.5, L1: 2, L2: 3.25, psi: 0.125, nudot: 7, t: 0.5, dTau: 0.01 }));
    const q = JSON.stringify(K({ c: 3, lambda0: 0.5, L1: 2, L2: 3.25, psi: 0.125, nudot: 7, t: 0.5, dTau: 0.01 }));
    return { sweep: a === b, coherent: p === q };
  })();
  const gate = {
    cInf: K({ c: Infinity }) === null, lamInf: K({ lambda0: Infinity }) === null,
    lamNeg: K({ lambda0: -1 }) === null, tauNeg: K({ tau1: -1, tau2: 0 }) === null,
    psiNaN: K({ psi: NaN }) === null, nudotNaN: K({ nudot: NaN }) === null,
    swBeta: HP.dfmMMLambdaSweep({ beta: 1 }) === null,
    swRule: HP.dfmMMLambdaSweep({ rules: ['ether'] }) === null,
    swEmpty: HP.dfmMMLambdaSweep({ rules: [] }) === null,
    swCInf: HP.dfmMMLambdaSweep({ c: Infinity }) === null,
    swU: HP.dfmMMLambdaSweep({ uFrac: NaN }) === null,
  };

  // ---- (E) 地表(h=0.01R)の χ の中で装置を 90° 回したときの δ(Δτ)・δ(Δφ)
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
    const rot = (chi, Vin) => {
      const V = (Vin !== undefined) ? Vin : 29979.2458;
      const P = (th) => HP.dfmMMPhase({ c: C, lambda: LAM, L1: L, L2: L, theta0: th,
        omega: 0, vx: V, vy: 0, ux: chi * V, uy: 0 });
      const a = P(0), b = P(Math.PI / 2);
      const dTau = b.dtExact - a.dtExact;                       // 90° 回転による δ(Δτ)
      const co = K({ c: C, lambda0: LAM, L1: L, L2: L, nullPhase: true, dTau,
        nudot: NUDOT, t: TSW });
      // 同じ残風で stretch 規約の掃引チャネルも見る(β_eff=(1−χ)β)
      const sw = HP.dfmMMLambdaSweep({ L, lambda0: LAM, beta: (1 - chi) * V / C, c: C, dNu: NUDOT * TSW });
      return { chi, V, beta: (1 - chi) * V / C,
        dt0: a.dtExact, dt90: b.dtExact, dTau, dphi0: a.dphiExact, dphi90: b.dphiExact,
        dPhiRot: co.dphiRot, dPhiRotDirect: b.dphiExact - a.dphiExact,
        fringesRot: co.fringesRot, dNRot: co.dNRot,
        stretchDN: sw.byRule.stretch.dN, stretchDT: sw.byRule.stretch.dT,
        stretchDPhi: sw.byRule.stretch.dPhiFixedLambda, stretchDNsweep: sw.byRule.stretch.dNsweep,
        galDN: sw.byRule.galilean.dN, comDT: sw.byRule.comoving.dT };
    };
    // V の 2 通り: ① 1887 装置の表示規約(地球の公転 29.98 km/s — 既存の 🪞 ハーネスと同じ)
    //              ② **地球の自転**(赤道の地表速度 465.1 m/s)— 原仮定者の「地球の自転で移動している」
    const VROT = 465.1;
    eng = { chiSolid, chiGas, chiOff, solid: rot(chiSolid), gas: rot(chiGas), off: rot(chiOff),
      spinSolid: rot(chiSolid, VROT), spinOff: rot(chiOff, VROT) };
  }

  return { si: { NU0, NUDOT, TSW, DL,
    i0: pick(i0), iPsi: pick(iPsi), iiRaw: pick(iiRaw), iiNull: pick(iiNull), iiFix: pick(iiFix),
    iiScale, iii, iv },
    sweep: { L3: sRow(SW3), L10: sRow(SW10), b3: bRow(SW3), bU: bRow(SWu) },
    det, gate, eng };
});

fs.writeFileSync(path.join(OUT_DIR, 'exp-w252c-mm.json'),
  JSON.stringify({ wave: '第252便c', target: TARGET, date: new Date().toISOString(), out }, null, 1));

const S = out.si, E = (x) => Number(x).toExponential(6);
console.log('=== 第252便c: 固定波長の位相 と 掃引の縞計数 ===');
console.log(`装置: L=11 m・λ₀=500 nm・ν₀=${E(S.NU0)} Hz / 掃引 ν̇=${S.NUDOT} Hz/s × t=${S.TSW} s ⇒ Δν=${E(S.i0.dNu)} Hz`);
console.log(`(i)   等長・静止 ψ=0  : Δτ=${S.i0.dtau} Δφ_fixed=${S.i0.dphiFixed} Δφ(掃引 t)=${S.i0.dphi} ΔN=${S.i0.dN}`);
console.log(`      等長・静止 ψ=0.7: Δφ_fixed=${S.iPsi.dphiFixed}(=ψ) Δφ(掃引 t)=${S.iPsi.dphi} ΔN=${S.iPsi.dN}`);
console.log(`(ii)  ΔL=${S.DL} m: Δτ=${E(S.iiRaw.dtau)} s / ψ=0 なら Δφ_fixed=${E(S.iiRaw.dphiFixed)} rad`);
console.log(`      ψ を合わせる(ψ=${E(S.iiNull.psiNull)}) → Δφ_fixed=${S.iiNull.dphiFixed}(厳密 0)`);
console.log(`      掃引なし(ν̇=0): ΔN=${S.iiFix.dN} / 掃引あり: **ΔN=${E(S.iiNull.dN)}**(閉形式一致 rel=${S.iiNull.dNRel})`);
console.log(`      掃引幅の線形性: ${S.iiScale.map((r) => `Δν=${E(r.dNu)}→ΔN=${E(r.dN)}`).join(' / ')}`);
console.log('(iii) ΔN=0 ⇔ Δτ=0:');
for (const r of S.iii) console.log(`      ΔL=${r.dL} m: Δτ=${E(r.dtau)} s ΔN=${r.dN === 0 ? '0(厳密)' : E(r.dN)} sweepNull=${r.sweepNull} Δτ=0? ${r.dtauZero}`);
console.log('(iv)  固定波長で ψ を合わせた後に Δτ が δ 動く(装置を回す):');
for (const r of S.iv) console.log(`      δ(Δτ)=${E(r.dTau)} s → **Δφ=${E(r.dphiRot)} rad**(=${E(r.fringesRot)} 縞・閉形式 rel=${r.rel}) / 掃引の縞移動 δ(ΔN)=${E(r.dNRot)}`);

console.log('--- (S) 3 規約の固定 λ₀ ΔN と掃引 ΔT 感度(L=3・λ₀=1・c=1・β=0.5・ν̇=1・t=1)---');
for (const [k, v] of Object.entries(out.sweep.L3)) {
  console.log(`  ${k.padEnd(9)} N=${v.N} N⊥=${v.Nperp} **ΔN=${v.dN}** T=${v.T} T⊥=${v.Tperp} **ΔT=${v.dT}** ` +
    `Δφ(固定λ)=${v.dPhi} **ΔN_sweep=${v.dNsweep}**(fixedNull=${v.fixedNull} sweepNull=${v.sweepNull})`);
}
console.log('  L=10(Δν=1):');
for (const [k, v] of Object.entries(out.sweep.L10)) console.log(`  ${k.padEnd(9)} ΔN=${v.dN} ΔT=${v.dT} ΔN_sweep=${v.dNsweep}`);
console.log('--- (B) 受動鏡境界の検算(β=0.5・L=3・λ₀=1・c=1・ω=u·k+c|k|・ρ=(ω−V·k)/2πν₀)---');
for (const [k, v] of Object.entries(out.sweep.b3)) {
  console.log(`  ${k.padEnd(9)} u=${v.u} λ₊=${v.lambdaOut} λ₋=${v.lambdaBack} ν₊=${v.nuOut} ν₋=${v.nuBack} ` +
    `**ρ₊=${v.rhoOut} ρ₋=${v.rhoBack}**(比 ${v.rhoRatio}) 鏡が返す λ=${v.lambdaMirror}(規約値の ${v.mirrorRatio} 倍) 整合=${v.rhoConsistent}`);
}
console.log('  stretch を u=V(=0.5)で検算:');
console.log(`  ${'stretch'.padEnd(9)} ρ₊=${out.sweep.bU.stretch.rhoOut} ρ₋=${out.sweep.bU.stretch.rhoBack} 比 ${out.sweep.bU.stretch.rhoRatio} 整合=${out.sweep.bU.stretch.rhoConsistent}`);
if (out.eng) {
  const G = out.eng;
  console.log('--- (E) 地表(h=0.01R)で装置を 90° 回す ---');
  for (const [k, r] of Object.entries({ 固体殻: G.solid, 気体殻: G.gas, 'kFrame=0': G.off,
    '自転 465.1m/s 固体殻': G.spinSolid, '自転 465.1m/s kFrame=0': G.spinOff })) {
    console.log(`  ${k}: V=${r.V} m/s χ=${r.chi} 残風 β=${E(r.beta)} / Δτ(0°)=${E(r.dt0)} → Δτ(90°)=${E(r.dt90)} ` +
      `**δ(Δτ)=${E(r.dTau)} s** / **δ(Δφ)=${E(r.dPhiRot)} rad**(直接 ${E(r.dPhiRotDirect)}) = ${E(r.fringesRot)} 縞`);
    console.log(`     stretch 規約: ΔN=${r.stretchDN} ΔT=${E(r.stretchDT)} s Δφ(固定λ)=${E(r.stretchDPhi)} rad ΔN_sweep=${E(r.stretchDNsweep)} / galilean ΔN=${E(r.galDN)} / comoving ΔT=${r.comDT}`);
  }
}
console.log(`決定性: ${JSON.stringify(out.det)} / 門: ${JSON.stringify(out.gate)}`);
console.log('出力: tests/out/exp-w252c-mm.json');
await browser.close();
