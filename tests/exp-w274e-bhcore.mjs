// 第274便e: **DFM 版ブラックホールの設計の値表**(実測器)。
//
// 何をするか: `beta/index.html` の 🎐 gw150914(実単位 — 連星ブラックホールの基準状態)の
//   **宣言値だけ**を読み出し(m・分離・c₀=cLight・κ=kappaT・D₀・ε=softening・半径)、
//   `tests/lib-w274e-bhcore.mjs` の純関数で
//     ① 局所光速 c_eff(r)/c₀ = e^{−2κW(r)} の形(r_s での値は e^{−1} で **0 ではない**)
//     ② **光の捕捉境界の定義候補** ṙ=u_r+c_eff の根を 3 つの u_r で
//        (A) u_r≡0(静止コア)/(B) 自由落下を宣言した内向き流/(C) 🎐 の宣言速度の並進
//     ③ 「逃げにくさ」(到達時間の倍率)と「減光」(lS_eff)が**捕捉境界とは別条件**であること
//     ④ **合体の帳簿**の閉じ(M/P/J/E)と、残余エネルギーが負になる宣言の**拒否**
//   を数にする。**エンジンは 1 度も走らせない**(html はテキストとして読むだけ)。
//
// 使い方: node tests/exp-w274e-bhcore.mjs   → tests/out/bhcore-w274e.json
// 書かないこと: 「ブラックホールを実装した」「事象の地平面を再現した」。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as BH from './lib-w274e-bhcore.mjs';
import { withProvenance } from './lib-w272e-provenance.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = 'beta/index.html';
const html = fs.readFileSync(path.join(ROOT, TARGET), 'utf8');

/* ── 🎐 の宣言値を読む(見つからなければ**黙って既定値を使わず**落とす)────────── */
function sliceOf(startMark, endMark) {
  const a = html.indexOf(startMark);
  if (a < 0) throw new Error('宣言ブロックが見つからない: ' + startMark);
  const b = html.indexOf(endMark, a);
  if (b < 0) throw new Error('宣言ブロックの終端が見つからない: ' + endMark);
  return html.slice(a, b);
}
const blk = sliceOf('{ id:"gw150914",', '{ id:"gw150914DFM"');
function num(re, what) {
  const m = blk.match(re);
  if (!m) throw new Error('🎐 の宣言が読めない: ' + what);
  return Number(m[1]);
}
const decl = {
  preset: 'gw150914', emoji: '🎐',
  G: num(/physics:\{G:([\d.eE+-]+)/, 'G'),
  D0: num(/physics:\{[^}]*?\bD0:([\d.eE+-]+)/, 'D0'),
  c0: num(/physics:\{[^}]*?\bcLight:([\d.eE+-]+)/, 'cLight'),
  kappa: num(/physics:\{[^}]*?\bkappaT:([\d.eE+-]+)/, 'kappaT'),
  eps: num(/physics:\{[^}]*?\bsoftening:([\d.eE+-]+)/, 'softening'),
  kFrame: num(/physics:\{[^}]*?\bkFrame:([\d.eE+-]+)/, 'kFrame'),
  geoPN: num(/physics:\{[^}]*?\bgeoPN:([\d.eE+-]+)/, 'geoPN'),
};
const bodyRe = /\{type:"single", m:([\d.eE+-]+), radius:([\d.eE+-]+), x:(-?[\d.eE+-]+), y:(-?[\d.eE+-]+), vx:(-?[\d.eE+-]+), vy:(-?[\d.eE+-]+), spin:(-?[\d.eE+-]+)/g;
const bodies = [];
let mm;
while ((mm = bodyRe.exec(blk))) bodies.push({ m: +mm[1], radius: +mm[2], x: +mm[3], y: +mm[4],
  vx: +mm[5], vy: +mm[6], spin: +mm[7] });
if (bodies.length !== 2) throw new Error('🎐 の bodies が 2 体で読めない: ' + bodies.length);
decl.separation = Math.abs(bodies[1].x - bodies[0].x);

/* ── ① c_eff の形 ─────────────────────────────────────────────────────────── */
const A = { G: decl.G, M: bodies[0].m, rc: decl.eps, kappa: decl.kappa, c0: decl.c0, D0: decl.D0 };
const B = { G: decl.G, M: bodies[1].m, rc: decl.eps, kappa: decl.kappa, c0: decl.c0, D0: decl.D0 };
const rsA = BH.rSchwarzschild(A), rsB = BH.rSchwarzschild(B);
// 宣言半径(Schwarzschild 換算 proxy)と r_s=2κM が一致することの照合 —— 一致するなら κ=G/c₀²
const rsCheck = {
  A: { declaredRadius: bodies[0].radius, rs: rsA, rel: Math.abs(rsA / bodies[0].radius - 1) },
  B: { declaredRadius: bodies[1].radius, rs: rsB, rel: Math.abs(rsB / bodies[1].radius - 1) },
  kappaVsGoverC2: Math.abs(decl.kappa / (decl.G / (decl.c0 * decl.c0)) - 1),
};
const cEffTable = [0.25, 0.5, 1, 2, 2.345749, 4, 10, 20].map((k) => {
  const r = k * rsA;
  return { rOverRs: k, r, cEffOverC0: BH.cEff1(r, A) / A.c0, nEff: BH.nEff(BH.decisionForce1(r, A), A.kappa) };
});
// 点質量の厳密形との差(D₀ と ε と相方 B を落とした形 e^{−r_s/r})
const cEffPointCheck = cEffTable.map((row) => ({ rOverRs: row.rOverRs,
  model: row.cEffOverC0, point: Math.exp(-rsA / row.r),
  rel: Math.abs(row.cEffOverC0 / Math.exp(-rsA / row.r) - 1) }));

/* ── ② 捕捉境界の定義候補 ─────────────────────────────────────────────────── */
const span = { lo: 1e-3, hi: 1e4, n: 40000 };
// (A) 静止コア: u_r ≡ 0 —— 屈折だけでは根が無いことを測る
const capA = BH.captureBoundary(A, () => 0, span);
// (B) 自由落下を宣言した内向き流 u_r = −√(2GM/s)
const capB = BH.captureBoundary(A, BH.freeFallInflow(A), span);
const ffRatio = BH.freeFallBoundaryRatio();
// (B′) 孤立点質量の対照(D₀=0・r_c=0・相方 B なし)—— 閉形式 s/r_s=2/W(2) の機械照合
const Aiso = { G: decl.G, M: bodies[0].m, rc: 0, kappa: decl.kappa, c0: decl.c0, D0: 0 };
const capBiso = BH.captureBoundary(Aiso, BH.freeFallInflow(Aiso), span);
const isoRel = capBiso.roots.length
  ? Math.abs(capBiso.roots[0] / BH.rSchwarzschild(Aiso) / ffRatio.sOverRs - 1) : null;
// (C) 🎐 の宣言速度で並進するコア: 最も内向きの方向で u_r = −|v_A|(E3 の重み込み)
const vA = Math.hypot(bodies[0].vx, bodies[0].vy);
const uTrans = (r) => {
  // E3: u = [w_A v_A + w_B v_B]/(D₀+w_A+w_B)。A から距離 r・B と反対側の向きで評価する
  const wA = bodies[0].m / Math.sqrt(r * r + decl.eps * decl.eps);
  const dB = decl.separation + r;
  const wB = bodies[1].m / Math.sqrt(dB * dB + decl.eps * decl.eps);
  const W = decl.D0 + wA + wB;
  const uy = (wA * bodies[0].vy + wB * bodies[1].vy) / W;   // 速度は y 方向
  return -Math.abs(uy);   // 最も内向きになる方位(r̂ が −u と揃う向き)
};
const capC = BH.captureBoundary(A, uTrans, span);

/* ── ③ 「逃げにくさ」と「減光」は別条件 ────────────────────────────────────── */
const delay = [0.1, 0.25, 0.5, 1, 2].map((k) => {
  const d = BH.escapeDelayFactor(k * rsA, 100 * rsA, A, 60000);
  return { fromOverRs: k, toOverRs: 100, factor: d.factor, travelTime: d.travelTime, freeTime: d.freeTime };
});
const darkening = BH.sweepDarkening({ spin: bodies[0].spin, R: bodies[0].radius, cSurf: BH.cEff1(bodies[0].radius, A) });

/* ── ④ 合体の帳簿 ─────────────────────────────────────────────────────────── */
const coreA = BH.makeCore({ M_rest: bodies[0].m, f_M: 1, R_core: bodies[0].radius,
  X: [bodies[0].x, bodies[0].y], V: [bodies[0].vx, bodies[0].vy],
  J_spin: 0, J_mesh: 0, E_core: 0, E_mesh: 0, Q: 0 });
const coreB = BH.makeCore({ M_rest: bodies[1].m, f_M: 1, R_core: bodies[1].radius,
  X: [bodies[1].x, bodies[1].y], V: [bodies[1].vx, bodies[1].vy],
  J_spin: 0, J_mesh: 0, E_core: 0, E_mesh: 0, Q: 0 });
const pPair = { G: decl.G, rc: decl.eps };
const mrgMesh = BH.mergeLedger(coreA, coreB, pPair, { spinFraction: 0, coreBinding: 1 });
const mrgSpin = BH.mergeLedger(coreA, coreB, pPair, { spinFraction: 1, coreBinding: 1 });
// 結合エネルギーを合体核へ持ち込まない宣言(coreBinding=0)—— 残余が負になり**拒否される**
const mrgReject = BH.mergeLedger(coreA, coreB, pPair, { spinFraction: 0, coreBinding: 0 });
const closMesh = mrgMesh.ok ? BH.ledgerClosure(mrgMesh.before, mrgMesh.after) : null;
const closSpin = mrgSpin.ok ? BH.ledgerClosure(mrgSpin.before, mrgSpin.after) : null;

/* ── 捕獲判定(半径条件・エネルギー条件)──────────────────────────────────── */
const rel = { x: bodies[1].x - bodies[0].x, y: 0,
  vx: bodies[1].vx - bodies[0].vx, vy: bodies[1].vy - bodies[0].vy };
const pRel = { G: decl.G, M: bodies[0].m + bodies[1].m, rc: decl.eps };
const byR = BH.captureByRadius(rel, capB.roots.length ? capB.roots[0] : rsA);
const byE = BH.captureByEnergy(rel, pRel, bodies[0].radius + bodies[1].radius);

/* ── 出力 ─────────────────────────────────────────────────────────────────── */
const out = {
  meta: withProvenance({
    wave: '第274便e',
    what: 'DFM 版ブラックホール設計の値表(🎐 の宣言値・純関数・エンジン未接続)',
    libVersion: BH.BH_CORE_VERSION,
    doNotWrite: ['ブラックホールを実装した', '事象の地平面を再現した', '捕捉境界を較正した'],
    caveat: '捕捉境界は E8R の伝播則の中で ṙ=u_r+c_eff=0 になる面であって、'
      + 'GR の事象の地平面との同等性は示していない(導出も比較もしていない)。'
      + '(B)(C) の u_r は**設計候補の入力**で、🎐 が走らせている場ではない(🎐 は kFrame=0)。',
  }, {
    root: ROOT, wave: '第274便e', target: TARGET,
    code: ['tests/exp-w274e-bhcore.mjs', 'tests/lib-w274e-bhcore.mjs', 'tests/lib-w272e-provenance.mjs'],
    inputs: [TARGET],
  }),
  declared: decl,
  bodies,
  rsCheck,
  cEff: { table: cEffTable, pointMassCheck: cEffPointCheck,
    atRs: BH.cEff1(rsA, A) / A.c0, eInv: Math.exp(-1) },
  captureBoundary: {
    A_static: { roots: capA.roots, minRate: capA.minRate, argMinRate: capA.argMinRate,
      note: 'u_r≡0 —— 屈折だけでは根が無い(c_eff>0 が有限の r で 0 にならない)' },
    B_freefall: { roots: capB.roots, rootOverRs: capB.roots.map((r) => r / rsA),
      sOverRs: capB.roots.map((r) => Math.sqrt(r * r + A.rc * A.rc) / rsA),
      closedForm: ffRatio,
      isolatedControl: { roots: capBiso.roots, rootOverRs: capBiso.roots.map((r) => r / BH.rSchwarzschild(Aiso)),
        relToClosedForm: isoRel,
        note: 'D₀=0・r_c=0・相方なしの対照。閉形式 s/r_s=2/W(2) と一致する' },
      relToClosedForm: capB.roots.length
        ? Math.abs(Math.sqrt(capB.roots[0] ** 2 + A.rc ** 2) / rsA / ffRatio.sOverRs - 1) : null },
    pairSeparation: { separation: decl.separation,
      rCapA: capB.roots.length ? capB.roots[0] : null,
      rCapB: BH.captureBoundary(B, BH.freeFallInflow(B), span).roots[0] || null },
    C_translation: { vA, roots: capC.roots, rootOverRs: capC.roots.map((r) => r / rsA),
      cEffAtRoot: capC.roots.map((r) => BH.cEff1(r, A)),
      note: '🎐 の宣言速度で並進するコア —— 最も内向きの方位での根' },
  },
  escape: { delay, darkening,
    note: '逃げにくさ(到達時間の倍率)・減光(lS_eff)・捕捉境界は**別条件**である' },
  merge: {
    meshShare: mrgMesh.ok ? { ok: true, residual: mrgMesh.residual, closure: mrgMesh.closure,
      relative: closMesh, J_spin: mrgMesh.merged.J_spin, J_mesh: mrgMesh.merged.J_mesh,
      Q: mrgMesh.merged.Q, f_M: mrgMesh.merged.f_M, R_core: mrgMesh.merged.R_core } : mrgMesh,
    spinShare: mrgSpin.ok ? { ok: true, residual: mrgSpin.residual, closure: mrgSpin.closure,
      relative: closSpin, J_spin: mrgSpin.merged.J_spin, J_mesh: mrgSpin.merged.J_mesh } : mrgSpin,
    rejected: { ok: mrgReject.ok, reason: mrgReject.reason, residual: mrgReject.residual },
    reducedKinetic: mrgMesh.ok
      ? 0.5 * (bodies[0].m * bodies[1].m / (bodies[0].m + bodies[1].m))
        * ((bodies[0].vx - bodies[1].vx) ** 2 + (bodies[0].vy - bodies[1].vy) ** 2) : null,
  },
  capture: { byRadius: byR, byEnergy: byE },
};
const dir = path.join(ROOT, 'tests', 'out');
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'bhcore-w274e.json'), JSON.stringify(out, null, 1));

const f = (x, d) => (x === null || x === undefined ? '—' : Number(x).toFixed(d === undefined ? 6 : d));
console.log('# 第274便e — DFM BH コア設計の値表(🎐 の宣言値)');
console.log(`宣言: G=${decl.G} c₀=${decl.c0} κ=${decl.kappa} D₀=${decl.D0} ε=${decl.eps} `
  + `kFrame=${decl.kFrame} geoPN=${decl.geoPN} 分離=${f(decl.separation, 4)}`);
console.log(`r_s: A=${f(rsA, 6)}(宣言半径 ${bodies[0].radius}・相対差 ${rsCheck.A.rel.toExponential(2)}) `
  + `B=${f(rsB, 6)}(${bodies[1].radius}・${rsCheck.B.rel.toExponential(2)}) / κ vs G/c₀² 相対差 `
  + `${rsCheck.kappaVsGoverC2.toExponential(2)}`);
console.log(`c_eff(r_s)/c₀ = ${f(out.cEff.atRs, 9)}(e^{−1}=${f(Math.exp(-1), 9)}) —— **0 ではない**`);
console.log(`捕捉境界 (A) 静止: 根 ${capA.roots.length} 個・最小 ṙ=${capA.minRate.toExponential(3)}`);
console.log(`          (B) 自由落下流: 根 ${capB.roots.length} 個 r/r_s=`
  + `${capB.roots.map((r) => f(r / rsA, 6)).join(',')} / 閉形式 s/r_s=2/W(2)=`
  + `${f(ffRatio.sOverRs, 9)}・相対差 ${out.captureBoundary.B_freefall.relToClosedForm === null
    ? '—' : out.captureBoundary.B_freefall.relToClosedForm.toExponential(2)}`
  + ` / 孤立点質量の対照 r/r_s=${capBiso.roots.map((r) => f(r / BH.rSchwarzschild(Aiso), 9)).join(',')}`
  + `(相対差 ${isoRel === null ? '—' : isoRel.toExponential(2)})`);
console.log(`          A/B の捕捉境界の和 ${f((out.captureBoundary.pairSeparation.rCapA || 0)
  + (out.captureBoundary.pairSeparation.rCapB || 0), 4)} vs 分離 ${f(decl.separation, 4)}`);
console.log(`          (C) 並進(|v_A|=${f(vA, 6)}): 根 ${capC.roots.length} 個 r=`
  + `${capC.roots.map((r) => f(r, 6)).join(',')}(r/r_s=${capC.roots.map((r) => f(r / rsA, 4)).join(',')})`);
console.log(`逃げにくさ: (0.1/0.25/0.5/1/2)r_s→100r_s の到達時間倍率 ${delay.map((d) => f(d.factor, 6)).join(' / ')}`
  + ` / 減光 lS_eff=${darkening.lSeff}`);
console.log(`合体帳簿(メッシュ配分): 残余 E=${f(mrgMesh.residual, 9)}(=½μ|Δv|²=`
  + `${f(out.merge.reducedKinetic, 9)}) / 閉じ dM=${mrgMesh.closure.dM} dP=`
  + `${mrgMesh.closure.dP.toExponential(3)} dL=${mrgMesh.closure.dL.toExponential(3)} dE=`
  + `${mrgMesh.closure.dE.toExponential(3)}`);
console.log(`合体帳簿(スピン配分): J_spin=${f(mrgSpin.merged.J_spin, 6)} J_mesh=`
  + `${f(mrgSpin.merged.J_mesh, 6)} / 閉じ dL=${mrgSpin.closure.dL.toExponential(3)}`);
console.log(`拒否の確認(coreBinding=0): ok=${mrgReject.ok} 残余=${f(mrgReject.residual, 6)}`);
console.log(`捕獲判定: 半径条件=${byR.captured}(d=${f(byR.d, 4)} vs R_cap=${f(byR.Rcap, 4)}) / `
  + `エネルギー条件=${byE.captured}(束縛=${byE.bound}・近点=${f(byE.rPeri, 4)} vs `
  + `R_core 和=${f(byE.Rcore, 4)})`);
console.log('→ tests/out/bhcore-w274e.json');
