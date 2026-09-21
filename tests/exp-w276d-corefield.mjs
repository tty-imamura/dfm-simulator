// 第276便d(原仮定者の裁定(第66報)(4)): **Core 力学の検算器**。
//
// **判定の列は測る前に決めてある**(第273便 R28・第274便d・第275便d と同じ流儀)。固定するのは 3 系統:
//   (I) **純関数の検算**(node・html を読まない)
//       ① 閉形式の伝播子と**独立な行列指数**(scaling-and-squaring + Taylor)の最大差。
//       ② 1 粒子の **H 相対誤差**(20,000 步)と**正準角運動量** p_φ の相対誤差。刻みを 3 段。
//       ③ **中心スピン 0 の対照**で力が変わる(ω_c=0 では力が 1 つも残らない)。
//       ④ **背景 W₀ を増やす**と ω_m が下がり、K⊥・K∥ が下がる(門に落ちる点まで)。
//       ⑤ **中心質量を変える**と W_c が動き ω_m が動く。
//       ⑥ **供給枯渇**: 有限容量を小さくすると供給が止まり、以後は減衰だけが残る。
//   (II) **エンジンとの一致**(Chromium): 1 粒子を同じ宣言で走らせて、node の閉形式と突き合わせる。
//   (III) **内蔵 3 本の完成門**(第275便d の門 + **スピン依存**)
//       (a) RMS 半径の**平均残差** ≤0.05(宣言した定常の大きさ σ√2 に対して)
//       (a′) ドリフト z ≤3(または |ドリフト| ≤0.02)  (a″) 初期配置の残差 ≤ 3×1/(2√N)
//       (b) 逆行の割合 ≤0.05(回転を宣言した 📀 にだけ当てる)  (b′) σ_z/σ_R ≤0.5
//       (c) 棒の横断幅・軸半長の残差 ≤0.05   (d) 摂動 ×1.05/×1.10 からの回復(3 seed)
//       (e) **帳簿が厳密に 0**(受け取った量と反作用の和)・NaN 0・clamp 0
//       (f) **スピン依存**: 中心スピン 0→1 で 600 步の指紋が**変わる**(R43 の否定の解消)
//       (g) **重力に不感ではない**: G 0→8 で指紋が**変わる**(中心の engine 質量は 0 にして二重加算を避ける)
//       (h) **二重加算の門**: 中心が engine 質量を持ったままの G≠0 は `gravityDouble` で止まる
//   **この器は合否を宣言しない**(数と、事前に決めた条件を満たしたかの真偽値だけを JSON へ置く)。
//   **較正ではない**: 観測された星団・銀河・渦状腕の量を 1 つも入力していない。
//
// 使い方:
//   PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright node tests/exp-w276d-corefield.mjs
// 環境変数: W276D_OUT(既定 tests/out/corefield-w276d.json)/ W276D_TARGET(既定 beta/index.html)/
//           W276D_SMOKE=1(短い配線確認 —— 正本にしない)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { rmsRadius, retrograde, axisWidth, rotationCurve, curveShape, meanSd, relDrift }
  from './lib-w275d-shapecrit.mjs';
import { unitAxis, coreFieldBasis, coreFieldDerived, coreFieldAccel, coreFieldEnergy,
  coreFieldCanonicalL, coreFieldClosed, coreFieldExpm, applyMat, toBasis, fromBasis,
  bathStep, coreFieldRelaxTimes, gaussFactory } from './lib-w276d-corefield.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.W276D_TARGET || 'beta/index.html';
const OUT = process.env.W276D_OUT || path.join(ROOT, 'tests', 'out', 'corefield-w276d.json');
const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const SMOKE = process.env.W276D_SMOKE === '1';

// **事前に決めた合格条件**(宣言値。導出ではない)
const CRIT = {
  flowAbs: 1e-10,     // 閉形式 ↔ 行列指数 の最大差
  hRel: 1e-9,         // 1 粒子 20,000 步の H 相対誤差(純関数)
  canonRel: 1e-9,     // 同じ走行の正準角運動量 p_φ の相対誤差
  engineRel: 1e-5,    // エンジン ↔ 純関数 の相対差(エンジンの x/v は 32 bit 格納)
  rmsRel: 0.05,       // RMS 半径の**平均残差**
  driftZ: 3.0,        // ドリフト ÷ その推定量自身のゆらぎ(第275便d と同じ 3σ)
  driftAbs: 0.02,
  initK: 3.0,
  retroFrac: 0.05,    // 逆行の割合(**回転を宣言した 📀 にだけ当てる**)
  widthRel: 0.05,     // 棒の横断幅・軸半長の残差
  recovRel: 0.05,
  axisRatio: 0.5,
};
const RUN = { dt: 0.25, T: SMOKE ? 50 : 200, nSample: SMOKE ? 5 : 20,
  pureSteps: SMOKE ? 2000 : 20000, smoke: SMOKE };
const IDS = ['shapeToyClusterCore', 'shapeToyDiskCore', 'shapeToyArmCore'];

// ======================= (I) 純関数の検算(html を読まない)=======================
// 検算に使う宣言(内蔵 3 本の値と、枝の対照)
const DECLS = {
  cluster: { coreRc: 125, coreMass: 10, alpha: 1.1, beta: 0.1, axis: [0, 0, 1],
    W0: 0.00064, temp: 19.44, omegaP: 0 },
  disk: { coreRc: 160, coreMass: 10, alpha: 1.05, beta: 7.8, axis: [0, 0, 1],
    W0: 0.0044921875, temp: 3.624, omegaP: 0.14 },
  arm: { coreRc: 250, coreMass: 10, alpha: 2, beta: 0.0108, axis: [1, 0, 0],
    W0: 0.00016, temp: 7.776, omegaP: 0 },
};

// ① 閉形式 ↔ 行列指数
const flowRows = [];
for (const [name, d] of Object.entries(DECLS)) {
  const P = coreFieldDerived(d, 0, 1);
  for (const h of [0.016, 0.25, 2.5, 25]) {
    const A = coreFieldClosed(P, h), E = coreFieldExpm(P, h);
    let mx = 0;
    for (let i = 0; i < 36; i++) mx = Math.max(mx, Math.abs(A[i] - E[i]));
    flowRows.push({ decl: name, h, omegaM: P.omegaM, kPerp: P.kPerp, kPar: P.kPar, kEff: P.kEff,
      lamPlus: P.lamPlus, lamMinus: P.lamMinus, maxAbsDiff: mx, ok: mx <= CRIT.flowAbs });
  }
}

// ② 1 粒子の H・p_φ(閉形式で長時間)
function pureRun(d, dt, steps, seed) {
  const s = unitAxis(d.axis), B = coreFieldBasis(s);
  const P = coreFieldDerived(d, 0, 1);
  const M = coreFieldClosed(P, dt);
  const g = gaussFactory(seed);
  const m = 0.6;
  const sPerp = Math.sqrt(P.varPerp / m), sPar = Math.sqrt(P.varPar / m), sV = Math.sqrt(P.varVel / m);
  let r = [0, 0, 0], v = [0, 0, 0];
  {
    const y = [sPerp * g(), sPerp * g(), sPar * g(), sV * g(), sV * g(), sV * g()];
    const w = fromBasis(y, B); r = w.r; v = w.v;
    const ub = [d.omegaP * (s[1] * r[2] - s[2] * r[1]), d.omegaP * (s[2] * r[0] - s[0] * r[2]),
      d.omegaP * (s[0] * r[1] - s[1] * r[0])];
    for (let i = 0; i < 3; i++) v[i] += ub[i];
  }
  const h0 = coreFieldEnergy(r, v, P, s), c0 = coreFieldCanonicalL(r, v, P, s);
  let hMax = 0, cMax = 0, rMax = 0;
  for (let k = 0; k < steps; k++) {
    const y = applyMat(M, toBasis(r, v, B));
    const w = fromBasis(y, B); r = w.r; v = w.v;
    hMax = Math.max(hMax, Math.abs(coreFieldEnergy(r, v, P, s) / h0 - 1));
    cMax = Math.max(cMax, Math.abs((coreFieldCanonicalL(r, v, P, s) - c0) / (Math.abs(c0) + 1e-12)));
    rMax = Math.max(rMax, Math.hypot(r[0], r[1], r[2]));
  }
  // 閉形式の加速度と、有限差分で作った加速度の一致(**則を 2 度書いたことの確認**)
  const hh = 1e-6;
  const y0 = toBasis(r, v, B), yP = applyMat(coreFieldClosed(P, hh), y0), yM = applyMat(coreFieldClosed(P, -hh), y0);
  const accFD = [(yP[3] - yM[3]) / (2 * hh), (yP[4] - yM[4]) / (2 * hh), (yP[5] - yM[5]) / (2 * hh)];
  const wFD = fromBasis([0, 0, 0, accFD[0], accFD[1], accFD[2]], B);
  const accAn = coreFieldAccel(r, v, P, s);
  const accDiff = Math.max(...[0, 1, 2].map((i) => Math.abs(wFD.v[i] - accAn[i])))
    / (Math.max(...accAn.map(Math.abs)) + 1e-12);
  return { dt, steps, seed, h0, canon0: c0, hRelMax: hMax, canonRelMax: cMax, rMax,
    rMaxOverRc: rMax / d.coreRc, accRelDiff: accDiff,
    ok: hMax <= CRIT.hRel && cMax <= CRIT.canonRel };
}
const pureRows = [];
for (const [name, d] of Object.entries(DECLS)) {
  for (const dt of [0.016, 0.25, 2.5]) {
    pureRows.push(Object.assign({ decl: name }, pureRun(d, dt, RUN.pureSteps, 20260921)));
  }
}

// ③ 中心スピン 0 の対照(**力が 1 つも残らない**)
const spinRows = [];
for (const [name, d] of Object.entries(DECLS)) {
  const s = unitAxis(d.axis);
  const r = [30, 12, 7], v = [0.4, -0.3, 0.1];
  const row = { decl: name, cases: [] };
  for (const oc of [0, 0.5, 1, 2]) {
    const P = coreFieldDerived(d, 0, oc);
    const a = coreFieldAccel(r, v, P, s);
    row.cases.push({ omegaC: oc, omegaM: P.omegaM, kPerp: P.kPerp, kPar: P.kPar, kEff: P.kEff,
      gate: P.gate, accel: a, accelNorm: Math.hypot(a[0], a[1], a[2]) });
  }
  row.zeroSpinForceIsZero = row.cases[0].accelNorm === 0;
  row.spinChangesForce = row.cases.some((c) => c.accelNorm !== row.cases[0].accelNorm);
  spinRows.push(row);
}

// ④ 背景 W₀ / ⑤ 中心質量
const bgRows = [], massRows = [];
for (const f of [0.25, 0.5, 1, 2, 4, 64, 4096]) {
  const d = Object.assign({}, DECLS.cluster, { W0: DECLS.cluster.W0 * f });
  const P = coreFieldDerived(d, 0, 1);
  bgRows.push({ W0factor: f, W0: d.W0, Wc: P.Wc, omegaM: P.omegaM, kPerp: P.kPerp, kPar: P.kPar,
    kEff: P.kEff, gate: P.gate,
    sigmaPerp: P.gate ? null : Math.sqrt(P.varPerp / 0.6) });
}
for (const f of [0.1, 0.5, 1, 10, 100]) {
  const d = Object.assign({}, DECLS.cluster, { coreMass: DECLS.cluster.coreMass * f });
  const P = coreFieldDerived(d, 0, 1);
  massRows.push({ massFactor: f, coreMass: d.coreMass, Wc: P.Wc, omegaM: P.omegaM,
    kPerp: P.kPerp, kEff: P.kEff, gate: P.gate,
    sigmaPerp: P.gate ? null : Math.sqrt(P.varPerp / 0.6) });
}

// ⑥ 供給枯渇(有限のコア熱容量)
function supplyRun(cap, steps) {
  const d = DECLS.cluster, s = unitAxis(d.axis), B = coreFieldBasis(s);
  const P = coreFieldDerived(d, 0, 1), m = 0.6, dt = 0.25, rate = 0.2;
  const M = coreFieldClosed(P, dt), g = gaussFactory(20260922);
  // **冷たい**初期条件から出発して、熱浴に温めさせる(供給が要る向き)
  let r = [10, -6, 3], v = [0, 0, 0];
  let bathE = 0, stopAt = null;
  const series = [];
  for (let k = 0; k < steps; k++) {
    const y = applyMat(M, toBasis(r, v, B));
    const w = fromBasis(y, B); r = w.r; v = w.v;
    const supply = !(bathE >= cap);
    if (!supply && stopAt === null) stopAt = k;
    const b = bathStep(r, v, P, s, d.omegaP, rate, dt, m, g, supply);
    v = b.v; bathE += b.dE;
    if (k % Math.max(1, Math.floor(steps / 10)) === 0)
      series.push({ k, bathE: +bathE.toFixed(6), h: +(m * coreFieldEnergy(r, v, P, s)).toFixed(6), supply });
  }
  return { capacity: cap, steps, bathE, stopAt, exhausted: stopAt !== null,
    hEnd: m * coreFieldEnergy(r, v, P, s), series };
}
const supplyRows = [supplyRun(1e9, SMOKE ? 400 : 4000), supplyRun(5, SMOKE ? 400 : 4000),
  supplyRun(0, SMOKE ? 400 : 4000)];

// ======================= (II)(III) エンジン =======================
let browser = null, page = null;
const pageErrors = [];
const retries = [];
async function launchBrowser() {
  try { return await req('playwright').chromium.launch(); }
  catch { return await req('playwright-core').chromium.launch({ executablePath: EXE }); }
}
async function ensurePage() {
  if (page && !page.isClosed()) return page;
  try { if (browser) await browser.close(); } catch { /* 落ちている */ }
  browser = await launchBrowser();
  page = await browser.newPage();
  page.on('pageerror', (e) => pageErrors.push(String(e.message || e)));
  await page.goto('file://' + path.join(ROOT, TARGET), { waitUntil: 'load' });
  await page.waitForFunction(() => window.HP && HP.sim && HP.currentPreset());
  await injectHelpers();
  return page;
}
async function retry(label, fn, n) {
  const max = n || 3;
  for (let i = 0; i < max; i++) {
    try { await ensurePage(); return await fn(); }
    catch (e) {
      const msg = String((e && e.message) || e);
      if (i === max - 1) throw e;
      retries.push({ label, attempt: i + 1, error: msg.slice(0, 140) });
      try { if (page && !page.isClosed()) await page.close(); } catch { /* 済み */ }
      try { if (browser) await browser.close(); } catch { /* 済み */ }
      browser = null; page = null;
    }
  }
  return null;
}
async function injectHelpers() {
  await page.evaluate(() => {
    window.W = {};
    // **診断コピー**(内蔵プリセットの JSON は 1 バイトも変えない)
    W.copy = (id, patch, seed, bodyPatch, phys) => {
      const p = JSON.parse(JSON.stringify(HP.allPresets().find((z) => z.id === id)));
      if (patch) p.physics.shapeToy.coreField = Object.assign({}, p.physics.shapeToy.coreField, patch);
      if (phys) Object.assign(p.physics, phys);
      if (bodyPatch) Object.assign(p.bodies[0], bodyPatch);
      if (seed !== undefined && seed !== null) p.seed = seed;
      const v = HP.validatePreset(JSON.parse(JSON.stringify(p)));
      if (!v.ok) throw new Error('validate: ' + (v.errors || []).join('|'));
      return v.preset;
    };
    W.raw = (id) => JSON.parse(JSON.stringify(HP.allPresets().find((z) => z.id === id)));
    W.start = (p) => { const S = HP.sim; S.build(JSON.parse(JSON.stringify(p))); W.S = S;
      return { n: S.n, decl: JSON.parse(JSON.stringify(S.params.shapeToy)) }; };
    W.go = (steps, dt) => { const S = W.S; for (let k = 0; k < steps; k++) S.step(dt); return S.t; };
    W.fp = (S, from) => { let a = 0x811c9dc5;
      const buf = new ArrayBuffer(8), f = new Float64Array(buf), u = new Uint8Array(buf);
      const push = (v) => { f[0] = v; for (let b = 0; b < 8; b++) { a ^= u[b]; a = Math.imul(a, 0x01000193) >>> 0; } };
      for (const k of ['x', 'y', 'vx', 'vy']) for (let i = (from || 0); i < S.n; i++) push(S[k][i]);
      return a.toString(16); };
    // 中心(pinned)を引いた 3D 状態と、決めた列の材料
    W.snap = () => {
      const S = W.S;
      let cx = 0, cy = 0;
      for (let i = 0; i < S.n; i++) if (S.pinned[i]) { cx = S.x[i]; cy = S.y[i]; break; }
      const X = [], Y = [], VX = [], VY = [], Z = [], VZ = [];
      for (let i = 0; i < S.n; i++) {
        if (S.pinned[i]) continue;
        X.push(S.x[i] - cx); Y.push(S.y[i] - cy); VX.push(S.vx[i]); VY.push(S.vy[i]);
        Z.push(S.cfZ[i]); VZ.push(S.cfVz[i]);
      }
      return { t: S.t, X, Y, VX, VY, Z, VZ, n: S.coreFieldN, nAll: S.n,
        stop: S.coreFieldStop, supplyStop: S.coreFieldSupplyStop,
        nan: S.hasNaN(), clampV: S.clampVN, clampS: S.clampSN,
        omegaM: S.coreFieldOmegaM, kPerp: S.coreFieldKPerp, kPar: S.coreFieldKPar,
        kEff: S.coreFieldKEff, kappa0: S.coreFieldKappa0, Wc: S.coreFieldWc,
        H: S.coreFieldH, U: S.coreFieldU, K: S.coreFieldK, work: S.coreFieldWork,
        bathE: S.coreFieldBathE, heat: S.coreFieldHeat, extE: S.coreFieldExtE,
        rMaxOverRc: S.coreFieldRMax, driftDx: S.coreFieldDriftDx,
        ledger: Math.abs(S.coreFieldPx + S.coreFieldReacPx) + Math.abs(S.coreFieldPy + S.coreFieldReacPy)
          + Math.abs(S.coreFieldPz + S.coreFieldReacPz) + Math.abs(S.coreFieldLz + S.coreFieldReacLz)
          + Math.abs(S.coreFieldLx + S.coreFieldReacLx) + Math.abs(S.coreFieldLy + S.coreFieldReacLy)
          + Math.abs(S.coreFieldE + S.coreFieldReacE) };
    };
    // **摂動**: 中心からの相対 3D 状態を一様に k 倍する(規定運動ではないので物理座標で効く)
    W.kick = (k) => {
      const S = W.S;
      let cx = 0, cy = 0;
      for (let i = 0; i < S.n; i++) if (S.pinned[i]) { cx = S.x[i]; cy = S.y[i]; break; }
      for (let i = 0; i < S.n; i++) {
        if (S.pinned[i]) continue;
        S.cfX[i] = cx + (S.cfX[i] - cx) * k; S.cfY[i] = cy + (S.cfY[i] - cy) * k; S.cfZ[i] *= k;
        S.cfVx[i] *= k; S.cfVy[i] *= k; S.cfVz[i] *= k;
        S.x[i] = S.cfX[i]; S.y[i] = S.cfY[i]; S.vx[i] = S.cfVx[i]; S.vy[i] = S.cfVy[i];
        S.cfVxS[i] = S.vx[i]; S.cfVyS[i] = S.vy[i];
      }
      return true;
    };
  });
}
await ensurePage();
async function drive(steps, dt) {
  let done = 0;
  while (done < steps) {
    const k = Math.min(800, steps - done);
    await page.evaluate((a) => W.go(a.k, a.dt), { k, dt });
    done += k;
  }
}

// ---- (II) エンジン ↔ 純関数(1 粒子・交換なし)
const engineMatch = [];
for (const id of IDS) {
  const row = await retry('match:' + id, () => page.evaluate((a) => {
    const p = W.copy(a.id, { exchange: { mode: 'none', rate: 0, capacity: 0 } }, null);
    // **1 粒子だけ**にする(中心 + 対象 1 個)
    p.bodies = [p.bodies[0], { type: 'single', m: 0.6, x: 31.5, y: -12.25, vx: 0.7, vy: -0.45, spin: 0 }];
    const S = HP.sim; S.build(JSON.parse(JSON.stringify(p)));
    const start = { x: S.cfX[1], y: S.cfY[1], z: S.cfZ[1], vx: S.cfVx[1], vy: S.cfVy[1], vz: S.cfVz[1] };
    for (let k = 0; k < 2000; k++) S.step(0.25);
    return { decl: JSON.parse(JSON.stringify(S.params.shapeToy.coreField)),
      G: S.params.G, omegaC: S.spin[0], cx: S.x[0], cy: S.y[0], start,
      end: { x: S.cfX[1], y: S.cfY[1], z: S.cfZ[1], vx: S.cfVx[1], vy: S.cfVy[1], vz: S.cfVz[1] },
      H: S.coreFieldH, stop: S.coreFieldStop };
  }, { id }));
  const s = unitAxis(row.decl.axis), B = coreFieldBasis(s);
  const P = coreFieldDerived(row.decl, row.G, row.omegaC);
  const M = coreFieldClosed(P, 0.25);
  let r = [row.start.x - row.cx, row.start.y - row.cy, row.start.z];
  let v = [row.start.vx, row.start.vy, row.start.vz];
  for (let k = 0; k < 2000; k++) {
    const w = fromBasis(applyMat(M, toBasis(r, v, B)), B); r = w.r; v = w.v;
  }
  const er = [row.end.x - row.cx, row.end.y - row.cy, row.end.z];
  const ev = [row.end.vx, row.end.vy, row.end.vz];
  const scale = Math.max(Math.hypot(...r), 1e-9);
  const vscale = Math.max(Math.hypot(...v), 1e-9);
  const dR = Math.max(...[0, 1, 2].map((i) => Math.abs(er[i] - r[i]))) / scale;
  const dV = Math.max(...[0, 1, 2].map((i) => Math.abs(ev[i] - v[i]))) / vscale;
  engineMatch.push({ id, steps: 2000, dt: 0.25, omegaC: row.omegaC, omegaM: P.omegaM,
    posRelDiff: dR, velRelDiff: dV, engineH: row.H,
    pureH: 0.6 * coreFieldEnergy(r, v, P, s), stop: row.stop,
    ok: dR <= CRIT.engineRel && dV <= CRIT.engineRel });
}

// ---- (III) 内蔵 3 本の完成門
function driftStat(ts, vs, relax) {
  const n = ts.length;
  if (n < 3) return { rel: null, z: null, sigma: null, nEff: null, pointSd: null };
  const rel = relDrift(ts, vs);
  let tm = 0, vm = 0;
  for (let i = 0; i < n; i++) { tm += ts[i]; vm += vs[i]; }
  tm /= n; vm /= n;
  let sxy = 0, sxx = 0;
  for (let i = 0; i < n; i++) { sxy += (ts[i] - tm) * (vs[i] - vm); sxx += (ts[i] - tm) ** 2; }
  const slope = sxy / sxx;
  let s2 = 0;
  for (let i = 0; i < n; i++) s2 += ((vs[i] - (vm + slope * (ts[i] - tm))) / vm) ** 2;
  const pointSd = Math.sqrt(s2 / n), span = ts[n - 1] - ts[0];
  const nEff = Math.max(2, span / Math.max(1e-9, relax));
  const sigma = pointSd * Math.sqrt(12 / nEff);
  return { rel, z: sigma > 0 ? rel / sigma : null, sigma, nEff, pointSd };
}
function metricsOf(q, shape) {
  const isArm = (shape === 'arm');
  const rms = rmsRadius(q.X, q.Y);
  const retro = retrograde(q.X, q.Y, q.VX, q.VY);
  const aw = axisWidth(q.X, q.Y);
  const sdR = meanSd(q.X.concat(q.Y)).sd, sdZ = meanSd(q.Z).sd;
  const curve = isArm ? [] : rotationCurve(q.X, q.Y, q.VX, q.VY, 5);
  const sp = q.VX.map((v, i) => Math.hypot(v, q.VY[i], q.VZ[i]));
  const axialRms = Math.sqrt(q.X.reduce((p, v) => p + v * v, 0) / Math.max(1, q.X.length));
  return { t: q.t, rms, retroFrac: retro.frac, retroNet: retro.net,
    width: aw.width, half: aw.half, ratio: aw.ratio, axialRms, sdR, sdZ,
    axisRatio: sdR > 0 ? sdZ / sdR : null, vMean: meanSd(sp).mean, vMax: Math.max(...sp),
    curve, curveShape: curve.length ? curveShape(curve) : null };
}
async function runCase(id, note, opt) {
  const o = Object.assign({ dt: RUN.dt, T: RUN.T, nSample: RUN.nSample, seed: null,
    patch: null, phys: null, body: null }, opt || {});
  const head = await page.evaluate((a) => W.start(W.copy(a.id, a.patch, a.seed, a.body, a.phys)),
    { id, patch: o.patch, seed: o.seed, body: o.body, phys: o.phys });
  const shape = head.decl.shape, cfd = head.decl.coreField;
  const P = coreFieldDerived(cfd, o.phys && o.phys.G !== undefined ? o.phys.G : 0, 1);
  // **緩和時間は宣言から作る**(`coreFieldRelaxTimes`)。1/γ ではなく、**モードごとの運動エネルギー
  // 分率で割った実効時定数の最大値**である —— 1/γ を窓に使うと短すぎて、遅いモードの過渡が
  // 残ったまま「偏り」として出る(第276便d の実測で判明した)。
  const RX = coreFieldRelaxTimes(P, cfd.exchange.rate);
  const relax = Math.min(1e5, RX.tau);
  // 宣言した定常の大きさ(面内 RMS 半径の理論値)。軸が面外なら面内 2 成分とも ⊥ である
  const m = 0.6;
  const sPerp = Math.sqrt(P.varPerp / m), sPar = Math.sqrt(P.varPar / m);
  const s = unitAxis(cfd.axis);
  const inPlaneVar = (c) => {   // 面内の単位ベクトル c=(cx,cy,0) の分散
    const par = c[0] * s[0] + c[1] * s[1];
    return par * par * sPar * sPar + (1 - par * par) * sPerp * sPerp;
  };
  const rmsTheory = Math.sqrt(inPlaneVar([1, 0, 0]) + inPlaneVar([0, 1, 0]));
  const sigDeclared = head.decl.sigma;

  // (A) **表示窓**(t=0 から T=200 = サンプルの validT)—— 判定には使わない
  const disp = [await page.evaluate(() => W.snap())];
  const perD = Math.max(1, Math.round(o.T / o.nSample / o.dt));
  for (let k = 0; k < o.nSample; k++) { await drive(perD, o.dt); disp.push(await page.evaluate(() => W.snap())); }
  const dRows = disp.map((q) => metricsOf(q, shape));
  const m0 = dRows[0], mD = dRows[dRows.length - 1];
  const relOf = (a, b) => (a !== null && b) ? a / b - 1 : null;
  const dispResid = dRows.map((r) => relOf(r.rms, rmsTheory));
  const settleDip = dispResid.reduce((p, q) => (Math.abs(q) > Math.abs(p) ? q : p), 0);

  // (B) **定常窓**: 緩和時間の 3 倍を馴染ませてから 24 緩和を測る(第275便d と同じ流儀)
  const sDt = Math.min(2.5, Math.max(o.dt, relax / 40));
  await drive(Math.round(3 * relax / sDt), sDt);
  const stat = [await page.evaluate(() => W.snap())];
  const statT = Math.max(4 * o.T, 24 * relax);
  const perS = Math.max(1, Math.round(statT / o.nSample / sDt));
  for (let k = 0; k < o.nSample; k++) { await drive(perS, sDt); stat.push(await page.evaluate(() => W.snap())); }
  const sRows = stat.map((q) => metricsOf(q, shape));
  const last = stat[stat.length - 1], mN = sRows[sRows.length - 1];
  const resid = sRows.map((r) => relOf(r.rms, rmsTheory));
  const rmsRelMean = resid.reduce((p, q) => p + q, 0) / resid.length;
  const drift = driftStat(sRows.map((r) => r.t), sRows.map((r) => r.rms), relax);
  const wResid = sRows.map((r) => relOf(r.width, sigDeclared));
  const widthRelMean = wResid.reduce((p, q) => p + q, 0) / wResid.length;
  const retroMean = sRows.reduce((p, q) => p + q.retroFrac, 0) / sRows.length;
  const aResid = sRows.map((r) => relOf(r.axialRms, sPar));
  const axialRelMean = aResid.reduce((p, q) => p + q, 0) / aResid.length;
  const halfTheory = 1.959964 * sPar;   // ガウスの |x| の 95 パーセンタイル(**数であって門ではない**)
  const nPart = last.n, noise = nPart > 0 ? 1 / (2 * Math.sqrt(nPart)) : null;

  const ok = {
    init: noise !== null && Math.abs(relOf(m0.rms, rmsTheory)) <= CRIT.initK * noise,
    rms: Math.abs(rmsRelMean) <= CRIT.rmsRel,
    drift: drift.rel !== null && (Math.abs(drift.rel) <= CRIT.driftAbs
      || (drift.z !== null && Math.abs(drift.z) <= CRIT.driftZ)),
    finite: last.nan === false && last.clampV === 0 && last.clampS === 0 && last.stop === null,
    ledger: last.ledger === 0,
    local: last.rMaxOverRc !== null && last.rMaxOverRc <= 1.5,
  };
  if (shape === 'disk') {
    ok.retro = retroMean <= CRIT.retroFrac;
    ok.flat = mN.axisRatio !== null && mN.axisRatio <= CRIT.axisRatio;
  }
  if (shape === 'arm') {
    ok.width = Math.abs(widthRelMean) <= CRIT.widthRel;
    // **軸半長の基準を変えた**(第275便d は「初期配置の 95 パーセンタイル」だった): coreField の
    // 定常は**ガウス**なので、一様な箱で撒いた初期配置は 2 次モーメントしか一致していない。
    // 95 パーセンタイルは N=180 で 7% のゆらぎを持つ(門がゆらぎに負ける)ので、**軸方向の RMS を
    // 宣言した σ∥ と比べる**列に置き換えた。95 パーセンタイルは数として並べるだけにする。
    ok.axial = Math.abs(axialRelMean) <= CRIT.widthRel;
  }
  return { id, note, shape, decl: head.decl, seed: o.seed, nAll: last.nAll, nToy: last.n,
    relax, relaxModes: RX.modes, statDt: sDt, statT,
    omegaM: last.omegaM, kPerp: last.kPerp, kPar: last.kPar, kEff: last.kEff,
    kappa0: last.kappa0, Wc: last.Wc,
    sigmaPerpTheory: sPerp, sigmaParTheory: sPar, rmsTheory, sigmaDeclared: sigDeclared,
    rms0: m0.rms, rmsInitRel: relOf(m0.rms, rmsTheory),
    settleDip, rmsRelDisplayEnd: relOf(mD.rms, rmsTheory),
    retroFracDisplayEnd: mD.retroFrac, axisRatioDisplayEnd: mD.axisRatio,
    displaySeries: dRows.map((r) => ({ t: +r.t.toFixed(2), rms: +r.rms.toFixed(4),
      rel: +relOf(r.rms, rmsTheory).toFixed(5),
      retro: r.retroFrac === null ? null : +r.retroFrac.toFixed(4) })),
    rmsEnd: mN.rms, rmsRelEnd: relOf(mN.rms, rmsTheory), rmsRelMean,
    rmsRelMax: Math.max(...resid.map(Math.abs)), samplingNoise: noise,
    rmsDrift: drift.rel, rmsDriftZ: drift.z, rmsDriftSigma: drift.sigma, rmsDriftNEff: drift.nEff,
    retroFracEnd: mN.retroFrac, retroFracMean: retroMean, retroNetEnd: mN.retroNet,
    width0: m0.width, widthEnd: mN.width, widthRelMean,
    half0: m0.half, halfEnd: mN.half, halfRel: relOf(mN.half, m0.half),
    halfTheory, halfRelTheory: relOf(mN.half, halfTheory),
    axial0: m0.axialRms, axialEnd: mN.axialRms, axialRelMean, axialTheory: sPar,
    axisRatio0: m0.axisRatio, axisRatioEnd: mN.axisRatio,
    axisRatioTheory: sPar / sPerp,
    vMeanEnd: mN.vMean, vMaxEnd: mN.vMax,
    curveEnd: mN.curve, curveShapeEnd: mN.curveShape,
    statSeries: sRows.map((r) => ({ t: +r.t.toFixed(2), rms: +r.rms.toFixed(4),
      retro: r.retroFrac === null ? null : +r.retroFrac.toFixed(4),
      width: +r.width.toFixed(4), axial: +r.axialRms.toFixed(4),
      axisRatio: r.axisRatio === null ? null : +r.axisRatio.toFixed(4) })),
    H: last.H, work: last.work, bathE: last.bathE, heat: last.heat, extE: last.extE,
    rMaxOverRc: last.rMaxOverRc, driftDx: last.driftDx,
    nan: last.nan, clampV: last.clampV, clampS: last.clampS, stop: last.stop, ledger: last.ledger,
    supplyStop: last.supplyStop,
    ok, pass: Object.values(ok).every(Boolean) };
}
const builtins = [];
for (const id of IDS) builtins.push(await retry('builtin:' + id, () => runCase(id, '内蔵の宣言そのもの', {})));

// ---- (d) 摂動からの回復
async function recover(id, k, seed) {
  const head = await page.evaluate((a) => W.start(W.copy(a.id, null, a.seed)), { id, seed });
  const cfd = head.decl.coreField;
  const P = coreFieldDerived(cfd, 0, 1);
  const relax = Math.min(1e5, coreFieldRelaxTimes(P, cfd.exchange.rate).tau);
  const dt = Math.min(2.5, Math.max(RUN.dt, relax / 40));
  const burnT = Math.max(RUN.T, 3 * relax), measT = Math.max(2 * RUN.T, 8 * relax);
  await drive(Math.round(burnT / dt), dt);
  const before = await page.evaluate(() => W.snap());
  await page.evaluate((a) => W.kick(a.k), { k });
  await page.evaluate((a) => W.go(1, a.dt), { dt });
  const after = await page.evaluate(() => W.snap());
  const rows = [];
  const p = Math.max(1, Math.round(measT / 10 / dt));
  for (let i = 0; i < 10; i++) { await drive(p, dt); rows.push(await page.evaluate(() => W.snap())); }
  const m = 0.6, sPerp = Math.sqrt(P.varPerp / m), sPar = Math.sqrt(P.varPar / m);
  const s = unitAxis(cfd.axis);
  const inPlaneVar = (c) => { const par = c[0] * s[0] + c[1] * s[1];
    return par * par * sPar * sPar + (1 - par * par) * sPerp * sPerp; };
  const theory = Math.sqrt(inPlaneVar([1, 0, 0]) + inPlaneVar([0, 1, 0]));
  const r0 = rmsRadius(before.X, before.Y), r1 = rmsRadius(after.X, after.Y);
  const tail = rows.slice(-5).map((q) => rmsRadius(q.X, q.Y));
  const end = tail.reduce((p2, q) => p2 + q, 0) / tail.length;
  const lastRow = rows[rows.length - 1];
  return { id, k, seed, relax, dt, burnT, measT, rmsTheory: theory,
    rmsBefore: r0, beforeRel: r0 / theory - 1, rmsAfterKick: r1, kickRel: r1 / r0 - 1,
    rmsEnd: end, endRel: end / theory - 1, endRelVsBefore: end / r0 - 1, tailN: tail.length,
    nan: lastRow.nan, stop: lastRow.stop,
    pass: Math.abs(end / theory - 1) <= CRIT.recovRel && lastRow.nan === false && lastRow.stop === null };
}
const recovery = [];
for (const id of IDS) {
  for (const k of (SMOKE ? [1.10] : [1.05, 1.10])) {
    for (const seed of (SMOKE ? [20260921] : [20260921, 20260922, 20260923])) {
      recovery.push(await retry(`recover:${id}:${k}:${seed}`, () => recover(id, k, seed)));
    }
  }
}

// ---- (f)(g)(h) 指紋の対照(**R43 の否定の解消**)
const fingerprints = [];
for (const id of IDS) {
  const row = await retry('fp:' + id, () => page.evaluate((a) => {
    const run = (p) => {
      const S = HP.sim; S.build(JSON.parse(JSON.stringify(p)));
      for (let k = 0; k < 600; k++) S.step(0.016);
      return { fp: W.fp(S, 1), stop: S.coreFieldStop, nan: S.hasNaN(),
        omegaM: S.coreFieldOmegaM, N: S.coreFieldN };
    };
    const base = run(W.copy(a.id, null, null));
    const spin0 = run(W.copy(a.id, null, null, { spin: 0 }));
    const spin2 = run(W.copy(a.id, null, null, { spin: 2 }));
    // **重力に不感ではない**: 二重加算を避ける道は「中心の engine 質量を 0 にする」ではない
    // (**質量床**があるので 0 にならず、門 `gravityDouble` が立つ —— 実測で判明した)。
    // **中心重力の持ち主を宣言で変える**(`centreGravity:"engine"` は κ₀=0 で、中心重力は E4 が持つ)。
    const g0 = run(W.copy(a.id, { centreGravity: 'engine' }, null, null, { G: 0 }));
    const g8 = run(W.copy(a.id, { centreGravity: 'engine' }, null, null, { G: 8 }));
    // **二重加算の門**: 中心が engine 質量を持ったままの G≠0
    const gDouble = run(W.copy(a.id, null, null, null, { G: 8 }));
    const w0 = run(W.copy(a.id, { W0: W.raw(a.id).physics.shapeToy.coreField.W0 * 4 }, null));
    const mc = run(W.copy(a.id, { coreMass: 100 }, null));
    // **規定運動(旧法則)へ戻した双子**: 同じ宣言で law だけ prescribed へ
    const p = W.raw(a.id);
    delete p.physics.shapeToy.law; delete p.physics.shapeToy.coreField;
    const vv = HP.validatePreset(JSON.parse(JSON.stringify(p)));
    const presc = (() => { const S = HP.sim; S.build(vv.preset);
      for (let k = 0; k < 600; k++) S.step(0.016);
      return { fp: W.fp(S, 1), stop: S.shapeToyStop, nan: S.hasNaN(), N: S.shapeToyN }; })();
    const p2 = JSON.parse(JSON.stringify(p)); p2.bodies[0].spin = 0;
    const v2 = HP.validatePreset(JSON.parse(JSON.stringify(p2)));
    const prescSpin0 = (() => { const S = HP.sim; S.build(v2.preset);
      for (let k = 0; k < 600; k++) S.step(0.016);
      return { fp: W.fp(S, 1), stop: S.shapeToyStop, N: S.shapeToyN }; })();
    return { base, spin0, spin2, g0, g8, gDouble, w0, mc, presc, prescSpin0 };
  }, { id }));
  fingerprints.push({ id, runs: row,
    spinChanges: row.base.fp !== row.spin0.fp && row.base.fp !== row.spin2.fp,
    gravityChanges: row.g0.fp !== row.g8.fp && row.g0.stop === null && row.g8.stop === null,
    gravityDoubleGated: row.gDouble.stop === 'gravityDouble',
    bgChanges: row.base.fp !== row.w0.fp,
    massChanges: row.base.fp !== row.mc.fp,
    lawChanges: row.base.fp !== row.presc.fp,
    prescribedSpinBlind: row.presc.fp === row.prescSpin0.fp });
}

// ---- 宣言の門(受理しない宣言)
const gates = await retry('gates', () => page.evaluate(() => {
  const mk = (patch, top) => {
    const p = JSON.parse(JSON.stringify(HP.allPresets().find((z) => z.id === 'shapeToyClusterCore')));
    if (patch) Object.assign(p.physics.shapeToy.coreField, patch);
    if (top) Object.assign(p.physics.shapeToy, top);
    const v = HP.validatePreset(JSON.parse(JSON.stringify(p)));
    return { ok: v.ok, has: !!(v.ok && v.preset.physics.shapeToy && v.preset.physics.shapeToy.law),
      warn: (v.warnings || []).length, err: (v.errors || []).slice(0, 1) };
  };
  const rt = (patch) => {   // 走らせて門を見る(受理はされるが力学が立たない宣言)
    const p = JSON.parse(JSON.stringify(HP.allPresets().find((z) => z.id === 'shapeToyClusterCore')));
    Object.assign(p.physics.shapeToy.coreField, patch);
    const v = HP.validatePreset(JSON.parse(JSON.stringify(p)));
    if (!v.ok) return { validate: false };
    const S = HP.sim; S.build(v.preset);
    for (let k = 0; k < 10; k++) S.step(0.25);
    return { validate: true, stop: S.coreFieldStop, N: S.coreFieldN };
  };
  return {
    centerFixed: mk(null, { center: 'fixed' }),
    couplingFeedback: mk(null, { coupling: 'feedback' }),
    growth: mk(null, { tauGrow: 25 }),
    noAxis: mk({ axis: [0, 0, 0] }),
    badExchange: mk({ exchange: { mode: 'rotating-bath', rate: 0.02, capacity: 0 } }),
    badMode: mk({ exchange: { mode: 'bath', rate: 0.02, capacity: 1 } }),
    badGravity: mk({ centreGravity: 'e4' }),
    coreFieldWithoutLaw: (() => {
      const p = JSON.parse(JSON.stringify(HP.allPresets().find((z) => z.id === 'shapeToyCluster')));
      p.physics.shapeToy.coreField = { coreRc: 1, coreMass: 1, alpha: 2, beta: 1, axis: [0, 0, 1], W0: 1, temp: 1 };
      const v = HP.validatePreset(JSON.parse(JSON.stringify(p)));
      return { ok: v.ok, err: (v.errors || []).slice(0, 1) };
    })(),
    kPerpZero: rt({ alpha: 1 }),
    kParZero: rt({ beta: 0 }),
    omegaPOutside: rt({ omegaP: 9 }),
    roundTrip: (() => {   // 検証後の宣言をもう一度検証しても同じ形に落ちる(冪等)
      const p = JSON.parse(JSON.stringify(HP.allPresets().find((z) => z.id === 'shapeToyDiskCore')));
      const a = HP.validatePreset(JSON.parse(JSON.stringify(p)));
      const b = HP.validatePreset(JSON.parse(JSON.stringify(a.preset)));
      return { ok: a.ok && b.ok,
        same: JSON.stringify(a.preset.physics.shapeToy) === JSON.stringify(b.preset.physics.shapeToy) };
    })(),
    // **未宣言の 128 本は 1 行も通らない**(真偽値 1 つで素通りする)
    undeclared: (() => {
      const p = JSON.parse(JSON.stringify(HP.allPresets().find((z) => z.id === 'saturn')));
      const S = HP.sim; S.build(HP.validatePreset(JSON.parse(JSON.stringify(p))).preset);
      const before = W.fp(S, 0);
      for (let k = 0; k < 200; k++) S.step(0.016);
      const mid = W.fp(S, 0);
      const direct = HP.dfmCoreFieldStep(S, 0.016);
      return { hasCoreField: S.hasCoreField === true, N: S.coreFieldN, stop: S.coreFieldStop,
        directNull: direct === null, fpUnchanged: W.fp(S, 0) === mid, moved: before !== mid };
    })(),
  };
}));

// ================= 出力 =================
const summary = {
  flowExactAllPass: flowRows.every((r) => r.ok),
  flowMaxAbsDiff: Math.max(...flowRows.map((r) => r.maxAbsDiff)),
  pureAllPass: pureRows.every((r) => r.ok),
  pureHRelMax: Math.max(...pureRows.map((r) => r.hRelMax)),
  pureCanonRelMax: Math.max(...pureRows.map((r) => r.canonRelMax)),
  zeroSpinForceIsZero: spinRows.every((r) => r.zeroSpinForceIsZero),
  engineMatchAllPass: engineMatch.every((r) => r.ok),
  engineMatchMax: Math.max(...engineMatch.map((r) => Math.max(r.posRelDiff, r.velRelDiff))),
  builtins: builtins.map((r) => ({ id: r.id, shape: r.shape, pass: r.pass, ok: r.ok,
    rmsRelMean: r.rmsRelMean, rmsDriftZ: r.rmsDriftZ, samplingNoise: r.samplingNoise,
    settleDip: r.settleDip, retroFracMean: r.retroFracMean, axisRatioEnd: r.axisRatioEnd,
    omegaM: r.omegaM, ledger: r.ledger })),
  recoveryAllPass: recovery.every((r) => r.pass),
  spinDependent: fingerprints.every((r) => r.spinChanges),
  gravitySensitive: fingerprints.every((r) => r.gravityChanges),
  gravityDoubleGated: fingerprints.every((r) => r.gravityDoubleGated),
  prescribedSpinBlind: fingerprints.every((r) => r.prescribedSpinBlind),
  supplyExhausts: supplyRows[1].exhausted && !supplyRows[0].exhausted,
};
const out = {
  meta: provenanceMeta({
    wave: '第276便d(第66報 (4)・Core 力学)', root: ROOT, target: TARGET,
    inputs: [TARGET],
    code: ['tests/exp-w276d-corefield.mjs', 'tests/lib-w276d-corefield.mjs',
      'tests/lib-w275d-shapecrit.mjs', 'tests/lib-w272e-provenance.mjs'],
  }),
  section: 'Core 力学(中心スピンに依存する法則)の検算(第66報 (4) 前半)',
  hypothesisNote: '**追加ポテンシャル Φ=½κ₀r²+½ω_m²{αr⊥²+βr∥²} は新しい構成仮説である**。'
    + '現行 DFM から一意に導出された法則ではない(統括の検証項目 R44 の字義)。ここで測るのは'
    + '**宣言した仮説の帰結**だけであり、観測との一致は 1 件も測っていない。',
  notCalibration: '**較正ではない**。観測された星団・銀河・渦状腕の密度・軸比・回転曲線・中心質量を'
    + '1 つも入力していない。「銀河が安定した」「腕が創発した」とは書かない。',
  externalSupport: '中心は `center:"pinned"` のままの**外部支持版**である。反作用(P/L/E)は帳簿へ'
    + '負号で記帳するだけで中心へ返していない —— **閉じた系ではない**。',
  criteria: CRIT, run: RUN, declarations: DECLS,
  flowExact: flowRows, pure: pureRows, spinControl: spinRows,
  backgroundSweep: bgRows, coreMassSweep: massRows, supply: supplyRows,
  engineMatch, builtins, recovery, fingerprints, gates,
  summary, retries, pageErrors,
};
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
await browser.close();
console.log('wrote', OUT);
console.log(JSON.stringify(summary, null, 1));
if (pageErrors.length) { console.error('pageErrors', pageErrors.slice(0, 3)); process.exit(1); }
