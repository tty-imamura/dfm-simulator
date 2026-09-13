// 第259便a W1「複素決定力場+共通場 API+geoPN=3(トイ分離)」(第51報)。
//
// 原仮定者(第51報・抜粋):「空間メッシュとは複素決定力場である、と仮定する。その場合、慣性は複素決定力場の
//   作用である」「重力は、質量に比例して距離に反比例する決定力による、決定力場の勾配ベクトルによる加速で
//   ある」「慣性力は、質点の移動で発生し、質量に比例して距離の二乗に反比例するベクトルによる、空間メッシュの
//   変化量ベクトルによる座標変換である」「『距離の二乗に反比例する』が正しいかは、検証が必要。『背景決定力
//   D₀=0』の場合は、背景宇宙による空間メッシュへの影響が無い」「例えば、『測地線モード geoPN=3』などとして、
//   トイモデル用に明確に処理を分ける事を検討する」。
//
// 本器が測るのは数だけである(予想は 1 つも書かない・Failure First)。
//
// ■ 節(--rdot --field --complex --d0 --entry --toy --kick --bit・複数指定可・無指定は全部)
//   rdot   : §1 Ṙ 補正の中央差分(補正前/補正後)・固定 R 対 動的 R の |a_I|/|g_N|・負質量拒否
//   field  : §2 共通場 API —— g=G∇D と E4 の一致・lawVersion 切替・timeDerivativeComplete
//   complex: §3 複素決定力場 —— Φ/A/∇A/∂ₜA・p=1/2/3 の無次元化欄・Cauchy–Riemann の残差
//   d0     : §4 D₀=0 の**相対(重み)と絶対(u)**・A の r 減衰
//   entry  : §5 geoPN=3 の入場条件 (i)〜(iv)
//   toy    : §6 トイ積分器を接続したときの箱の遠心の符号表と帳簿
//   kick   : §7 実キックの**同段階置換**(inertiaRemoval:"inStep")対 步末除去("post")
//   bit    : §8 全内蔵プリセット × 600 步の状態・署名を基点 html と突き合わせる
//
// 実行: node tests/exp-w259a-field.mjs [--節...] [--fast]
//       W259A_BASE=<基点 html>(既定 tests/out/base-w259a.html)
// 出力: tests/out/field-w259a.json(数値は docs/PHYSICS.md〔第259便a〕へ全載)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + path.join(ROOT, TARGET);
const BASE = process.env.W259A_BASE || path.join(ROOT, 'tests', 'out', 'base-w259a.html');
const OUT = path.join(ROOT, 'tests', 'out', 'field-w259a.json');
const argv = process.argv.slice(2);
const FAST = argv.includes('--fast');
const only = argv.filter((a) => a.startsWith('--') && a !== '--fast').map((a) => a.slice(2));
const want = (k) => !only.length || only.includes(k);
const ex = (z, d = 4) => (z === null || z === undefined || !Number.isFinite(z)) ? '—' : Number(z).toExponential(d);
const fx = (z, d = 6) => (z === null || z === undefined || !Number.isFinite(z)) ? '—' : Number(z).toFixed(d);

const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let browser;
try { browser = await req('playwright').chromium.launch(); }
catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }
const pageErrors = [];
async function openPage(url) {
  const p = await browser.newPage();
  p.on('pageerror', (e) => pageErrors.push(String(e)));
  await p.goto(url, { waitUntil: 'load' });
  await p.waitForFunction(() => window.HP && HP.sim);
  return p;
}
const page = await openPage(INDEX);
const R = { target: TARGET, fast: FAST, sections: only.length ? only : 'all' };

// ============================================================ §1 Ṙ 補正・負質量拒否
if (want('rdot')) {
  R.rdot = await page.evaluate(() => {
    const O = {};
    // 源は 2 体(🪟 と同じ等質量連星の姿)。**R は「分離の 3 倍」= 時間変化する量**である
    // 源は 2 体。**時刻 t へは x+v·t+½a·t²・v+a·t で進める**(QA ⑧ の advL と同じ手続き)
    const B0 = [{ m: 500, x: -120, y: 0, vx: 0.30, vy: -0.56, ax: 0.004, ay: 0.001 },
      { m: 500, x: 140, y: 40, vx: 0.62, vy: -0.14, ax: -0.006, ay: 0.002 }];
    const mk = (t) => {
      const b = B0.map((q) => ({ m: q.m, x: q.x + q.vx * t + 0.5 * q.ax * t * t,
        y: q.y + q.vy * t + 0.5 * q.ay * t * t, vx: q.vx + q.ax * t, vy: q.vy + q.ay * t,
        ax: q.ax, ay: q.ay }));
      const rx = b[1].x - b[0].x, ry = b[1].y - b[0].y, rr = Math.hypot(rx, ry);
      const wx = b[1].vx - b[0].vx, wy = b[1].vy - b[0].vy;
      const Rv = 3 * rr, Rd = 3 * ((rx * wx + ry * wy) / rr);
      return { bodies: b, R: Rv, Rdot: Rd };
    };
    const P = { D0: 1e-3, eps: 0.05, p: 3 };
    const at = (t, useRdot) => {
      const s = mk(t);
      const o = Object.assign({}, P, { R: s.R, Rdot: useRdot ? s.Rdot : 0 });
      return HP.dfmLocalMeshField(s.bodies, 60, 25, o);
    };
    const h = 1e-5;
    const f0 = at(0, false), fp = at(h, false), fm = at(-h, false);
    const num = [(fp.u[0] - fm.u[0]) / (2 * h), (fp.u[1] - fm.u[1]) / (2 * h)];
    const relOf = (fz) => {
      const d = Math.max(Math.abs(num[0] - fz.dUdt[0]), Math.abs(num[1] - fz.dUdt[1]));
      const s = Math.max(Math.abs(num[0]), Math.abs(num[1]), 1e-300);
      return { abs: d, rel: d / s };
    };
    const f1 = at(0, true);
    O.dyn = { num, before: { dUdt: f0.dUdt, RdotUsed: f0.RdotUsed, err: relOf(f0) },
      after: { dUdt: f1.dUdt, RdotUsed: f1.RdotUsed, err: relOf(f1) },
      R: mk(0).R, Rdot: mk(0).Rdot };
    // **固定 R**(inertiaSupportR 宣言)では R が動かないので Ṙ 項は 0 —— 補正なしで一致すること
    const fixR = 700;
    const atF = (t) => HP.dfmLocalMeshField(mk(t).bodies, 60, 25, Object.assign({}, P, { R: fixR }));
    const g0 = atF(0), gp = atF(h), gm = atF(-h);
    const gnum = [(gp.u[0] - gm.u[0]) / (2 * h), (gp.u[1] - gm.u[1]) / (2 * h)];
    const gd = Math.max(Math.abs(gnum[0] - g0.dUdt[0]), Math.abs(gnum[1] - g0.dUdt[1]));
    O.fixed = { R: fixR, num: gnum, dUdt: g0.dUdt, abs: gd,
      rel: gd / Math.max(Math.abs(gnum[0]), Math.abs(gnum[1]), 1e-300) };
    // 負質量・0 質量の源は拒否(null)
    O.negMass = [HP.dfmLocalMeshField([{ m: -1, x: 0, y: 0 }], 10, 0, { R: 100, D0: 1 }),
      HP.dfmLocalMeshField([{ m: 0, x: 0, y: 0 }], 10, 0, { R: 100, D0: 1 }),
      HP.dfmLocalMeshField([{ m: 500, x: 0, y: 0 }, { m: -2, x: 30, y: 0 }], 10, 0, { R: 100, D0: 1 })]
      .every((z) => z === null);
    O.posOk = !!HP.dfmLocalMeshField([{ m: 1, x: 0, y: 0 }], 10, 0, { R: 100, D0: 1 });
    return O;
  });
}

// ============================================================ §1b |a_I|/|g_N| 固定 R 対 動的 R
if (want('rdot')) {
  R.radial = await page.evaluate((fast) => {
    const KEY = HP.SPACE_MESH_KEY, O = {};
    const rows = [];
    const run = (sm, rProbe) => {
      const q = JSON.parse(JSON.stringify(HP.allPresets().find((z) => z.id === 'spaceMeshBinaryToy')));
      q.physics[KEY] = Object.assign({ mode: 'vertex' }, q.physics[KEY] || {}, sm);
      q.bodies = q.bodies.concat([{ type: 'single', m: 1e-8, x: rProbe, y: 0, vx: 0,
        vy: Math.sqrt(1 * 1000 / rProbe), spin: 0, pinned: false }]);
      const v = HP.validatePreset(q);
      if (!v.ok) return { err: (v.errors || []).join('|') };
      const S = HP.sim; S.build(v.preset);
      const dt = 0.004, k = fast ? 60 : 240;
      for (let i = 0; i < k; i++) S.step(dt);
      const i = S.n - 1;
      const v0 = [S.vx[i], S.vy[i]];
      S.step(dt);
      const dv = Math.hypot(S.vx[i] - v0[0], S.vy[i] - v0[1]);
      const gN = 1 * 1000 / (rProbe * rProbe);
      return { ratio: S.meshCoordDvI / dt / gN, stop: S.meshCoordStop, N: S.meshCoordN,
        out: S.meshCoordOut, dvAll: dv / dt / gN, chi: S.meshCoordChi };
    };
    for (const rp of [300, 800, 1600, 4800]) {
      const dyn = run({ inertia: 'coordinate', inertiaSupport: 'support' }, rp);
      const fixH = run({ inertia: 'coordinate', inertiaSupport: 'support', inertiaSupportR: 360 }, rp);
      const fixR = run({ inertia: 'coordinate', inertiaSupport: 'support', inertiaSupportR: 720 }, rp);
      const fix2 = run({ inertia: 'coordinate', inertiaSupport: 'support', inertiaSupportR: 1440 }, rp);
      const none = run({ inertia: 'coordinate' }, rp);
      rows.push({ r: rp, none: none.ratio, dynamic: dyn.ratio,
        fixHalf: fixH.ratio, fixR: fixR.ratio, fix2R: fix2.ratio });
    }
    O.rows = rows;
    return O;
  }, FAST);
}

// ============================================================ §2 共通場 API
if (want('field')) {
  R.field = await page.evaluate(() => {
    const O = {};
    const BD = [{ id: 0, m: 500, x: -120, y: 0, vx: 0.03, vy: -0.56, ax: 0.004, ay: 0.001 },
      { id: 1, m: 300, x: 140, y: 40, vx: -0.02, vy: 0.61, ax: -0.006, ay: 0.002 },
      { id: 2, m: 20, x: 40, y: -260, vx: 0.4, vy: 0.1, ax: 0, ay: 0 }];
    const G = 1.7, eps = 0.05;
    // (a) g=G∇D が **E4 の pair 和**と一致するか(1e−8 の門)
    let worst = 0, scale = 0;
    for (const q of [[60, 25], [-300, 110], [400, -380], [0, 0]]) {
      const f = HP.dfmField(BD, q[0], q[1], { G, eps, p: 2, D0: 1, lawVersion: 'scalar' });
      let gx = 0, gy = 0;
      for (const b of BD) {
        const dx = q[0] - b.x, dy = q[1] - b.y, s = dx * dx + dy * dy + eps * eps;
        const iv = 1 / Math.sqrt(s), iv3 = iv * iv * iv;
        gx -= G * b.m * dx * iv3; gy -= G * b.m * dy * iv3;
      }
      worst = Math.max(worst, Math.hypot(f.gravity[0] - gx, f.gravity[1] - gy));
      scale = Math.max(scale, Math.hypot(gx, gy));
    }
    O.gravity = { abs: worst, rel: worst / Math.max(scale, 1e-300), scale };
    // (b) ∇D の中央差分(入場条件 (iii) と同じ数)
    let gd = 0, gds = 0;
    for (const q of [[60, 25], [-300, 110], [400, -380]]) {
      const h = 1e-4 * Math.max(1, Math.hypot(q[0], q[1]));
      const f0 = HP.dfmField(BD, q[0], q[1], { G, eps, p: 2, D0: 1 });
      const xp = HP.dfmField(BD, q[0] + h, q[1], { G, eps, p: 2, D0: 1 });
      const xm = HP.dfmField(BD, q[0] - h, q[1], { G, eps, p: 2, D0: 1 });
      const yp = HP.dfmField(BD, q[0], q[1] + h, { G, eps, p: 2, D0: 1 });
      const ym = HP.dfmField(BD, q[0], q[1] - h, { G, eps, p: 2, D0: 1 });
      const n = [(xp.D - xm.D) / (2 * h), (yp.D - ym.D) / (2 * h)];
      gd = Math.max(gd, Math.abs(n[0] - f0.gradD[0]), Math.abs(n[1] - f0.gradD[1]));
      gds = Math.max(gds, Math.abs(n[0]), Math.abs(n[1]));
    }
    O.gradD = { abs: gd, rel: gd / Math.max(gds, 1e-300) };
    // (c) lawVersion 切替と契約欄
    const sc = HP.dfmField(BD, 60, 25, { G, eps, p: 2, D0: 1, lawVersion: 'scalar' });
    const lo = HP.dfmField(BD, 60, 25, { G, eps, p: 2, D0: 1, lawVersion: 'local', R: 700 });
    const lr = HP.dfmField(BD, 60, 25, { G, eps, p: 2, D0: 1, lawVersion: 'local', R: 700, Rdot: 1.3 });
    const cx = HP.dfmField(BD, 60, 25, { G, eps, p: 2, D0: 1, lawVersion: 'complex' });
    O.laws = {
      scalar: { u: sc.u, chi: sc.chi, sup: sc.supportPolicy, tdc: sc.timeDerivativeComplete, ec: sc.energyContract },
      local: { u: lo.u, chi: lo.chi, sup: lo.supportPolicy, tdc: lo.timeDerivativeComplete },
      localRdot: { u: lr.u, tdc: lr.timeDerivativeComplete },
      complex: { u: cx.u, chi: cx.chi, sup: cx.supportPolicy, tdc: cx.timeDerivativeComplete },
      sameD: Math.abs(sc.D - lo.D) + Math.abs(sc.D - cx.D),
      sourceIds: sc.sourceIds, exclude: HP.dfmField(BD, 60, 25, { G, eps, p: 2, D0: 1, excludeBodyId: 1 }).sourceIds };
    // (d) "scalar" が第254便の dfmMeshScalarField+dfmMeshBlend と同じ場か
    const fl = HP.dfmMeshScalarField(BD, 60, 25, { G, eps, power: 2 });
    let Wd = 0;
    for (const b of BD) {
      const dx = 60 - b.x, dy = 25 - b.y, s = dx * dx + dy * dy + eps * eps;
      const k = -2 * b.m * Math.pow(s, -1) / s;
      Wd -= (k * dx) * b.vx + (k * dy) * b.vy;
    }
    O.scalarVsBlend = { W: Math.abs(fl.Wpull - sc.W), chi: Math.abs(fl.Wpull / (1 + fl.Wpull) - sc.chi) };
    // (e) 門(未知の lawVersion・background:"frame" で bg を渡さない・負の D₀)
    O.gates = [HP.dfmField(BD, 0, 0, { lawVersion: 'zzz' }),
      HP.dfmField(BD, 0, 0, { background: 'frame' }),
      HP.dfmField(BD, 0, 0, { D0: -1 }),
      HP.dfmField(null, 0, 0, {}),
      HP.dfmField(BD, 0, 0, { energyContract: 'free' })].every((z) => z === null);
    O.bgFrame = (() => {
      const z = HP.dfmField(BD, 900, 0, { background: 'frame', bg: { u: [1.25, -0.5] }, D0: 1e9, p: 2, eps });
      return z ? Math.hypot(z.u[0] - 1.25, z.u[1] + 0.5) : null;
    })();
    return O;
  });
}

// ============================================================ §3 複素決定力場
if (want('complex')) {
  R.complex = await page.evaluate(() => {
    const O = {};
    const BD = [{ id: 0, m: 500, x: -120, y: 0, vx: 0.03, vy: -0.56, ax: 0.004, ay: 0.001 },
      { id: 1, m: 500, x: 120, y: 0, vx: -0.03, vy: 0.56, ax: -0.004, ay: -0.001 }];
    const eps = 0.05;
    // p=1/2/3 の無次元化欄(M*=1000・L*=240〔分離〕・T*=518.8544〔ケプラー周期〕)
    const U = { M: 1000, L: 240, T: 518.8544 };
    const rows = [];
    for (const p of [1, 2, 3]) {
      const z = HP.dfmComplexDeterminacy(BD, 600, 0, { p, eps, units: U });
      const w = HP.dfmLocalMeshField(BD, 600, 0, { p, eps, D0: 0, support: false });
      rows.push({ p, Phi: z.Phi, gradPhi: z.gradPhi, A: z.A, Ahat: z.dimless.A, Phihat: z.dimless.Phi,
        uMean: w ? w.u : null, cr1: z.cauchyRiemann.r1, cr2: z.cauchyRiemann.r2,
        crRel1: z.cauchyRiemann.rel1, crRel2: z.cauchyRiemann.rel2 });
    }
    O.pSweep = rows; O.units = U;
    // Cauchy–Riemann を 🪟 の 4 点で(満たさないことを数で)
    const pts = [[300, 0], [0, 300], [-600, 200], [800, -400]];
    O.cr = pts.map((q) => {
      const z = HP.dfmComplexDeterminacy(BD, q[0], q[1], { p: 2, eps });
      return { at: q, r1: z.cauchyRiemann.r1, r2: z.cauchyRiemann.r2,
        rel1: z.cauchyRiemann.rel1, rel2: z.cauchyRiemann.rel2, scale: z.cauchyRiemann.scale };
    });
    // ∇Φ・∇A・∂ₜA の中央差分
    const h = 1e-4;
    const f0 = HP.dfmComplexDeterminacy(BD, 300, 120, { p: 2, eps });
    const dx1 = HP.dfmComplexDeterminacy(BD, 300 + h, 120, { p: 2, eps });
    const dx0 = HP.dfmComplexDeterminacy(BD, 300 - h, 120, { p: 2, eps });
    const dy1 = HP.dfmComplexDeterminacy(BD, 300, 120 + h, { p: 2, eps });
    const dy0 = HP.dfmComplexDeterminacy(BD, 300, 120 - h, { p: 2, eps });
    O.grad = { Phi: Math.max(Math.abs((dx1.Phi - dx0.Phi) / (2 * h) - f0.gradPhi[0]),
      Math.abs((dy1.Phi - dy0.Phi) / (2 * h) - f0.gradPhi[1])),
      PhiScale: Math.max(Math.abs(f0.gradPhi[0]), Math.abs(f0.gradPhi[1])),
      A: Math.max(Math.abs((dx1.A[0] - dx0.A[0]) / (2 * h) - f0.gradA[0]),
        Math.abs((dy1.A[0] - dy0.A[0]) / (2 * h) - f0.gradA[1]),
        Math.abs((dx1.A[1] - dx0.A[1]) / (2 * h) - f0.gradA[2]),
        Math.abs((dy1.A[1] - dy0.A[1]) / (2 * h) - f0.gradA[3])),
      AScale: Math.max.apply(null, f0.gradA.map(Math.abs)) };
    const ht = 1e-5;
    const adv = (t) => BD.map((b) => ({ m: b.m, x: b.x + b.vx * t + 0.5 * b.ax * t * t,
      y: b.y + b.vy * t + 0.5 * b.ay * t * t, vx: b.vx + b.ax * t, vy: b.vy + b.ay * t, ax: b.ax, ay: b.ay }));
    const tp = HP.dfmComplexDeterminacy(adv(ht), 300, 120, { p: 2, eps });
    const tm = HP.dfmComplexDeterminacy(adv(-ht), 300, 120, { p: 2, eps });
    O.dAdt = { num: [(tp.A[0] - tm.A[0]) / (2 * ht), (tp.A[1] - tm.A[1]) / (2 * ht)], ana: f0.dAdt };
    O.dAdtErr = Math.max(Math.abs(O.dAdt.num[0] - f0.dAdt[0]), Math.abs(O.dAdt.num[1] - f0.dAdt[1]));
    O.dAdtScale = Math.max(Math.abs(O.dAdt.num[0]), Math.abs(O.dAdt.num[1]));
    // **A の線形性**(入場条件 (iv)): 源の質量を 2 倍にすると A も 2 倍
    const BD2 = BD.map((b) => Object.assign({}, b, { m: 2 * b.m }));
    const a1 = HP.dfmComplexDeterminacy(BD, 600, 0, { p: 2, eps });
    const a2 = HP.dfmComplexDeterminacy(BD2, 600, 0, { p: 2, eps });
    O.linear = { rel: Math.max(Math.abs(a2.A[0] - 2 * a1.A[0]), Math.abs(a2.A[1] - 2 * a1.A[1]))
      / Math.max(Math.abs(2 * a1.A[0]), Math.abs(2 * a1.A[1]), 1e-300) };
    // 源の分割(同じ位置の質量 4 = 1+3)でも A は不変(加算形)
    const s1 = HP.dfmComplexDeterminacy([{ m: 4, x: 0, y: 0, vx: 1, vy: 2 }], 5, 0, { p: 2 });
    const s2 = HP.dfmComplexDeterminacy([{ m: 1, x: 0, y: 0, vx: 1, vy: 2 }, { m: 3, x: 0, y: 0, vx: 1, vy: 2 }], 5, 0, { p: 2 });
    O.split = Math.abs(s1.A[0] - s2.A[0]) + Math.abs(s1.A[1] - s2.A[1]);
    O.gates = [HP.dfmComplexDeterminacy(null, 0, 0, {}),
      HP.dfmComplexDeterminacy([{ m: -1, x: 0, y: 0 }], 5, 0, {}),
      HP.dfmComplexDeterminacy([{ m: 1, x: 0, y: 0 }], 0, 0, { eps: 0 }),
      HP.dfmComplexDeterminacy([{ m: 1, x: 0, y: 0 }], 5, 0, { units: { M: 0, L: 1, T: 1 } })].every((z) => z === null);
    return O;
  });
}

// ============================================================ §4 D₀=0 の相対 vs 絶対
if (want('d0')) {
  R.d0 = await page.evaluate(() => {
    const O = {}, eps = 0.05;
    const SRC = [{ m: 500, x: 0, y: 0, vx: 0.37, vy: -0.21, ax: 0.004, ay: 0.001 }];
    const rows = [];
    for (const r of [300, 800, 1600, 4800]) {
      const row = { r };
      for (const D0 of [0, 80, 800]) {
        const w = HP.dfmLocalMeshField(SRC, r, 0, { p: 2, eps, D0, support: false });
        row['u_D0_' + D0] = w ? Math.hypot(w.u[0], w.u[1]) : null;
        row['chi_D0_' + D0] = w ? w.chi : null;
      }
      const c = HP.dfmComplexDeterminacy(SRC, r, 0, { p: 2, eps });
      row.A = Math.hypot(c.A[0], c.A[1]);
      row.W = HP.dfmLocalMeshField(SRC, r, 0, { p: 2, eps, D0: 0, support: false }).W;
      rows.push(row);
    }
    O.rows = rows;
    O.uSrc = Math.hypot(SRC[0].vx, SRC[0].vy);
    // 2 源(等質量・別速度)では D₀=0 でも u は動く(「減衰しない」は単一源の話であることの対照)
    const TWO = [{ m: 500, x: -120, y: 0, vx: 0.5, vy: 0 }, { m: 500, x: 120, y: 0, vx: -0.5, vy: 0 }];
    O.two = [300, 800, 1600, 4800].map((r) => {
      const w = HP.dfmLocalMeshField(TWO, r, 0, { p: 2, eps, D0: 0, support: false });
      const c = HP.dfmComplexDeterminacy(TWO, r, 0, { p: 2, eps });
      return { r, u: w ? Math.hypot(w.u[0], w.u[1]) : null, chi: w ? w.chi : null, A: Math.hypot(c.A[0], c.A[1]) };
    });
    return O;
  });
}

// ============================================================ §5 入場条件 (i)〜(iv)
if (want('entry') || want('toy')) {
  R.entry = await page.evaluate(() => {
    const KEY = HP.SPACE_MESH_KEY, O = {};
    // (i) 剛体箱の共回転極: 残差/(Ω²r) = (1−η·χ)²
    const OM = 0.15, RP = 70;
    const spin = (toyGain, D0, dt) => {
      const q = JSON.parse(JSON.stringify(HP.allPresets().find((z) => z.id === 'boxcomoving')));
      q.bodies = [{ type: 'single', m: 1e-9, x: RP, y: 0, vx: 0, vy: OM * RP, spin: 0, pinned: false }];
      q.universeBox = Object.assign({}, q.universeBox || {},
        { mode: 'exp', H0: 0, omega: OM, vx: 0, vy: 0, D: 80, dPower: 1 });
      Object.assign(q.physics, { G: 0, D0, kFrame: 0, geoPN: 3, softening: 4, stateCarry: 'double' });
      q.physics[KEY] = { mode: 'vertex', lawVersion: 'scalar', toyGain };
      delete q.massCalibration;
      const v = HP.validatePreset(q);
      if (!v.ok) return { err: (v.errors || []).join('|') };
      const S = HP.sim; S.build(v.preset);
      // **第258便a ④ と同じ手続き**(4 步 —— 長く回すと支えが足りない欄で粒子が落ちて共回転でなくなる)
      let ar = 0, r = RP;
      for (let k = 0; k < 4; k++) {
        const v0 = [S.vx[0], S.vy[0]];
        S.step(dt);
        r = Math.hypot(S.x[0], S.y[0]);
        ar = ((S.vx[0] - v0[0]) / dt * S.x[0] + (S.vy[0] - v0[1]) / dt * S.y[0]) / r;
      }
      return { resid: ar + OM * OM * r, ref: OM * OM * r, r, chi: S.geoToyChi,
        stop: S.geoToyStop, N: S.geoToyN, geoPN: S.params.geoPN, nan: S.hasNaN(),
        E: S.geoToyE, Em: S.geoToyEmesh, P: [S.geoToyPx, S.geoToyPy], L: S.geoToyL,
        g2: S._g2 === null || S._g2 === undefined, kKind: S._kKind };
    };
    const box = [];
    for (const D0 of [0, 80, 800]) {
      for (const eta of [0, 0.25, 0.5, 0.75, 1]) {
        const z = spin(eta, D0, 0.005);
        if (z.err) { box.push({ D0, eta, err: z.err }); continue; }
        const chi = 80 / (D0 + 80);
        box.push({ D0, eta, chi, ratio: z.resid / z.ref, law: (1 - eta * chi) * (1 - eta * chi),
          diff: Math.abs(z.resid / z.ref - (1 - eta * chi) * (1 - eta * chi)),
          stop: z.stop, N: z.N, geoPN: z.geoPN, nan: z.nan, g2: z.g2, kKind: z.kKind,
          eBook: Math.abs(z.E + z.Em) });
      }
    }
    O.box = box;
    O.i = { maxDiff: Math.max.apply(null, box.filter((b) => !b.err).map((b) => b.diff)) };
    // (ii) D₀=0・支持内に源なし は null
    O.ii = (HP.dfmField([{ m: 1, x: 0, y: 0 }], 900, 0, { lawVersion: 'local', R: 100, D0: 0 }) === null)
      && (HP.dfmLocalMeshField([{ m: 1, x: 0, y: 0 }], 900, 0, { R: 100, D0: 0 }) === null);
    // (iii)(iv) は §2 §3 の数をそのまま入場条件として読む(再掲用にここでも 1 度測る)
    const BD = [{ m: 500, x: -120, y: 0, vx: 0.3, vy: -0.2 }, { m: 300, x: 140, y: 40, vx: -0.2, vy: 0.6 }];
    let gd = 0, gds = 0;
    for (const q of [[60, 25], [-300, 110], [400, -380]]) {
      const h = 1e-4 * Math.max(1, Math.hypot(q[0], q[1]));
      const f0 = HP.dfmField(BD, q[0], q[1], { eps: 0.05, p: 2, D0: 1 });
      const xp = HP.dfmField(BD, q[0] + h, q[1], { eps: 0.05, p: 2, D0: 1 });
      const xm = HP.dfmField(BD, q[0] - h, q[1], { eps: 0.05, p: 2, D0: 1 });
      const yp = HP.dfmField(BD, q[0], q[1] + h, { eps: 0.05, p: 2, D0: 1 });
      const ym = HP.dfmField(BD, q[0], q[1] - h, { eps: 0.05, p: 2, D0: 1 });
      const n = [(xp.D - xm.D) / (2 * h), (yp.D - ym.D) / (2 * h)];
      gd = Math.max(gd, Math.abs(n[0] - f0.gradD[0]), Math.abs(n[1] - f0.gradD[1]));
      gds = Math.max(gds, Math.abs(n[0]), Math.abs(n[1]));
    }
    O.iii = { abs: gd, rel: gd / Math.max(gds, 1e-300) };
    const a1 = HP.dfmComplexDeterminacy(BD, 600, 0, { p: 2, eps: 0.05 });
    const a2 = HP.dfmComplexDeterminacy(BD.map((b) => Object.assign({}, b, { m: 2 * b.m })), 600, 0, { p: 2, eps: 0.05 });
    O.iv = { rel: Math.max(Math.abs(a2.A[0] - 2 * a1.A[0]), Math.abs(a2.A[1] - 2 * a1.A[1]))
      / Math.max(Math.abs(2 * a1.A[0]), Math.abs(2 * a1.A[1]), 1e-300) };
    // 検証器の門(較正拒否・lawVersion 未宣言の 2 丸め・kFrame>0 拒否・inertia 併用拒否)
    const mk = (phys, sm, cls) => {
      const q = JSON.parse(JSON.stringify(HP.allPresets().find((z) => z.id === 'spaceMeshBinaryToy')));
      Object.assign(q.physics, phys);
      if (sm) q.physics[KEY] = Object.assign({ mode: 'vertex' }, q.physics[KEY] || {}, sm);
      if (cls) q.sampleClass = cls;
      delete q.massCalibration;
      return HP.validatePreset(q);
    };
    const noLaw = mk({ geoPN: 3, kFrame: 0 }, null, null);
    const cal = mk({ geoPN: 3, kFrame: 0 }, { lawVersion: 'scalar' }, 'calibration');
    const kf = mk({ geoPN: 3, kFrame: 1 }, { lawVersion: 'scalar' }, null);
    const both = mk({ geoPN: 3, kFrame: 0 }, { lawVersion: 'scalar', inertia: 'coordinate' }, null);
    const wv = mk({ geoPN: 3, kFrame: 0 }, { lawVersion: 'scalar', weave: 'pair' }, null);
    const good = mk({ geoPN: 3, kFrame: 0 }, { lawVersion: 'local' }, null);
    O.validator = {
      noLawRounded: noLaw.ok && noLaw.preset.physics.geoPN === 2,
      noLawWarn: (noLaw.warnings || []).some((w) => w.indexOf('geoPN=3') >= 0),
      calibrationRejected: cal.ok === false, kFrameRejected: kf.ok === false,
      inertiaRejected: both.ok === false, weaveRejected: wv.ok === false,
      accepted: good.ok && good.preset.physics.geoPN === 3,
      sig: good.ok ? JSON.stringify(good.preset.physics[KEY]) : null };
    // chiCut の受理と "none" への正規化
    const cc = mk({}, { inertia: 'coordinate', inertiaSupport: 'chiCut' }, null);
    O.chiCut = { accepted: cc.ok, sigClean: cc.ok ? !JSON.stringify(cc.preset.physics[KEY]).includes('chiCut') : null,
      warn: cc.ok ? (cc.warnings || []).some((w) => w.indexOf('chiCut') >= 0) : null };
    // complex は積分器へ接続しない
    const cxq = mk({ geoPN: 3, kFrame: 0 }, { lawVersion: 'complex' }, null);
    if (cxq.ok) {
      const S = HP.sim; S.build(cxq.preset);
      for (let k = 0; k < 5; k++) S.step(0.004);
      O.complexToy = { stop: S.geoToyStop, N: S.geoToyN };
    }
    return O;
  });
}

// ============================================================ §6 トイの帳簿(🪟 で)
if (want('toy')) {
  R.toy = await page.evaluate((fast) => {
    const KEY = HP.SPACE_MESH_KEY, O = {};
    const ring = [];
    for (let k = 0; k < 8; k++) {
      const th = 2 * Math.PI * k / 8, rr = 900;
      ring.push({ type: 'single', m: 0.5, x: rr * Math.cos(th), y: rr * Math.sin(th),
        vx: -0.026 * Math.sin(th), vy: 0.026 * Math.cos(th), spin: 0, pinned: false });
    }
    const run = (law, gain) => {
      const q = JSON.parse(JSON.stringify(HP.allPresets().find((z) => z.id === 'spaceMeshBinaryToy')));
      q.physics.kFrame = 0; q.physics.geoPN = 3;
      q.physics[KEY] = { mode: 'vertex', gravity: true, lawVersion: law, toyGain: gain };
      q.bodies = q.bodies.concat(ring);
      const v = HP.validatePreset(q);
      if (!v.ok) return { err: (v.errors || []).join('|') };
      const S = HP.sim; S.build(v.preset);
      const T0 = S.totals();
      const n = fast ? 400 : 3000;
      for (let k = 0; k < n; k++) S.step(0.004);
      const T = S.totals();
      return { stop: S.geoToyStop, N: S.geoToyN, chi: S.geoToyChi, dv: S.geoToyDv,
        E: S.geoToyE, Em: S.geoToyEmesh, eBook: Math.abs(S.geoToyE + S.geoToyEmesh),
        dPres: Math.hypot(T.px - T0.px + S.resPx, T.py - T0.py + S.resPy),
        dLres: (T.L - T0.L) + S.resL, Labs: Math.abs(T0.L) || 1,
        dLraw: T.L - T0.L, nan: S.hasNaN(), steps: n,
        clamp: S.clampVN + S.clampSN + S.clampRN + S.clampTN + S.clampAN,
        st: [S.x[2], S.y[2], S.vx[2], S.vy[2]], sep: Math.hypot(S.x[1] - S.x[0], S.y[1] - S.y[0]),
        kKind: S._kKind, g2: S._g2 === null || S._g2 === undefined };
    };
    O.scalar1 = run('scalar', 1);
    O.scalar0 = run('scalar', 0);
    O.local1 = run('local', 1);
    O.complex1 = run('complex', 1);
    // 対照: geoPN=0・kFrame=0(トイなし)
    const q = JSON.parse(JSON.stringify(HP.allPresets().find((z) => z.id === 'spaceMeshBinaryToy')));
    q.physics.kFrame = 0; q.bodies = q.bodies.concat(ring);
    const v = HP.validatePreset(q); const S = HP.sim; S.build(v.preset);
    const n = fast ? 400 : 3000;
    for (let k = 0; k < n; k++) S.step(0.004);
    O.off = { st: [S.x[2], S.y[2], S.vx[2], S.vy[2]], sep: Math.hypot(S.x[1] - S.x[0], S.y[1] - S.y[0]) };
    O.gain0Same = O.scalar0.st ? Math.max.apply(null, O.scalar0.st.map((z, i) => Math.abs(z - O.off.st[i]))) : null;
    return O;
  }, FAST);
}

// ============================================================ §7 実キックの同段階置換
if (want('kick')) {
  R.kick = await page.evaluate((fast) => {
    const KEY = HP.SPACE_MESH_KEY, O = {};
    const ring = [];
    for (let k = 0; k < 8; k++) {
      const th = 2 * Math.PI * k / 8, rr = 900;
      ring.push({ type: 'single', m: 0.5, x: rr * Math.cos(th), y: rr * Math.sin(th),
        vx: -0.026 * Math.sin(th), vy: 0.026 * Math.cos(th), spin: 0, pinned: false });
    }
    const third = { type: 'single', m: 60, x: 1800, y: 0, vx: 0, vy: 0.745, spin: 0, pinned: false };
    const run = (sm, dt, steps, extra) => {
      const q = JSON.parse(JSON.stringify(HP.allPresets().find((z) => z.id === 'spaceMeshBinaryToy')));
      if (sm) q.physics[KEY] = Object.assign({ mode: 'vertex' }, q.physics[KEY] || {}, sm);
      else q.physics.kFrame = 0;
      q.bodies = q.bodies.concat(ring); if (extra) q.bodies = q.bodies.concat([extra]);
      const v = HP.validatePreset(q);
      if (!v.ok) return { err: (v.errors || []).join('|') };
      const S = HP.sim; S.build(v.preset);
      const T0 = S.totals();
      for (let k = 0; k < steps; k++) S.step(dt);
      const T = S.totals();
      const st = []; for (let i = 0; i < S.n; i++) st.push(S.x[i], S.y[i], S.vx[i], S.vy[i]);
      return { st, dL: T.L - T0.L, removal: S.meshCoordRemoval, give: S.meshCoordGive,
        nan: S.hasNaN(), clamp: S.clampRN, stop: S.meshCoordStop, N: S.meshCoordN,
        scale: Math.hypot(S.x[2], S.y[2]), Labs: Math.abs(T0.L) || 1,
        dPres: Math.hypot(T.px - T0.px + S.resPx, T.py - T0.py + S.resPy),
        dLres: (T.L - T0.L) + S.resL, mcE: S.meshCoordE, mcEm: S.meshCoordEmesh };
    };
    const cmp = (a, b) => {
      if (!a.st || !b.st) return null;
      let d = 0; for (let i = 0; i < a.st.length; i++) d = Math.max(d, Math.abs(a.st[i] - b.st[i]));
      return d;
    };
    // η=0(除去だけ)対 kFrame=0(支えなし)—— 恒等。post と inStep を並べる
    for (const [tag, dt, steps] of [['dt0008', 0.008, fast ? 300 : 1500], ['dt0004', 0.004, fast ? 600 : 3000]]) {
      const base = run(null, dt, steps);
      const post = run({ inertia: 'coordinate', inertiaGain: 0, inertiaVertices: true }, dt, steps);
      const inS = run({ inertia: 'coordinate', inertiaGain: 0, inertiaVertices: true, inertiaRemoval: 'inStep' }, dt, steps);
      O[tag] = { post: cmp(post, base), inStep: cmp(inS, base), scale: base.scale,
        postRel: cmp(post, base) / base.scale, inStepRel: cmp(inS, base) / base.scale,
        removalPost: post.removal, removalIn: inS.removal, giveIn: inS.give,
        nan: post.nan || inS.nan, clamp: post.clamp + inS.clamp,
        book: { post: { dPres: post.dPres, dLres: Math.abs(post.dLres) / post.Labs, e: Math.abs(post.mcE + post.mcEm) },
          inStep: { dPres: inS.dPres, dLres: Math.abs(inS.dLres) / inS.Labs, e: Math.abs(inS.mcE + inS.mcEm) } } };
    }
    // 第三体あり(第258便a ⑤ の 5.6% 欄と同じ姿)
    {
      const dt = 0.004, steps = fast ? 400 : 3000;
      const base = run(null, dt, steps, third);
      const post = run({ inertia: 'coordinate', inertiaGain: 0, inertiaVertices: true }, dt, steps, third);
      const inS = run({ inertia: 'coordinate', inertiaGain: 0, inertiaVertices: true, inertiaRemoval: 'inStep' }, dt, steps, third);
      O.third = { post: cmp(post, base), inStep: cmp(inS, base), scale: base.scale,
        postRel: cmp(post, base) / base.scale, inStepRel: cmp(inS, base) / base.scale,
        dLbase: base.dL, dLpost: post.dL, dLin: inS.dL };
    }
    // 箱(共回転試験粒子)の恒等は post/inStep とも厳密 0 か
    {
      const OM = 0.15, RP = 70;
      const spin = (sm, ph, dt) => {
        const q = JSON.parse(JSON.stringify(HP.allPresets().find((z) => z.id === 'boxcomoving')));
        q.bodies = [{ type: 'single', m: 1e-9, x: RP, y: 0, vx: 0, vy: OM * RP, spin: 0, pinned: false }];
        q.universeBox = Object.assign({}, q.universeBox || {},
          { mode: 'exp', H0: 0, omega: OM, vx: 0, vy: 0, D: 80, dPower: 1 });
        Object.assign(q.physics, { G: 0, D0: 0, kFrame: 1, geoPN: 0, softening: 4, stateCarry: 'double' }, ph || {});
        if (sm) q.physics[HP.SPACE_MESH_KEY] = Object.assign({ mode: 'vertex' }, sm);
        delete q.massCalibration;
        const v = HP.validatePreset(q);
        if (!v.ok) return { err: (v.errors || []).join('|') };
        const S = HP.sim; S.build(v.preset);
        for (let k = 0; k < 400; k++) S.step(dt);
        const i = 0, r = Math.hypot(S.x[i], S.y[i]);
        const v0 = [S.vx[i], S.vy[i]];
        S.step(dt);
        const ax = (S.vx[i] - v0[0]) / dt, ay = (S.vy[i] - v0[1]) / dt;
        return { ratio: ((ax * S.x[i] + ay * S.y[i]) / r + OM * OM * r) / (OM * OM * r), stop: S.meshCoordStop };
      };
      const kf0 = spin(null, { kFrame: 0 }, 0.005);
      const p0 = spin({ inertia: 'coordinate', inertiaGain: 0, inertiaVertices: true }, null, 0.005);
      const i0 = spin({ inertia: 'coordinate', inertiaGain: 0, inertiaVertices: true, inertiaRemoval: 'inStep' }, null, 0.005);
      O.box = { kf0: kf0.ratio, post: p0.ratio, inStep: i0.ratio,
        dPost: Math.abs(p0.ratio - kf0.ratio), dIn: Math.abs(i0.ratio - kf0.ratio) };
    }
    return O;
  }, FAST);
}

// ============================================================ §8 未宣言 1 bit 不変
if (want('bit')) {
  if (!fs.existsSync(BASE)) {
    R.bit = { skipped: '基点 html が無い(W259A_BASE を置くか git show で作る): ' + BASE };
  } else {
    const basePage = await openPage('file://' + BASE);
    const snapOf = async (pg) => pg.evaluate(async (nStep) => {
      const out = {};
      for (const q of HP.allPresets()) {
        const v = HP.validatePreset(JSON.parse(JSON.stringify(q)));
        if (!v.ok) { out[q.id] = { err: (v.errors || []).join('|') }; continue; }
        const S = HP.sim; S.build(v.preset);
        for (let k = 0; k < nStep; k++) S.step(0.016);
        let h = 0;
        const mix = (z) => { const f = Math.fround(z); h = (h * 31 + (Number.isFinite(f) ? Math.round(f * 1e6) : 987654321)) | 0; };
        for (let i = 0; i < S.n; i++) { mix(S.x[i]); mix(S.y[i]); mix(S.vx[i]); mix(S.vy[i]); mix(S.spin[i]); mix(S.R[i]); mix(S.m[i]); }
        mix(S.t); mix(S.n);
        out[q.id] = { h, n: S.n, nan: S.hasNaN(), sig: JSON.stringify(v.preset.physics) };
      }
      return out;
    }, FAST ? 120 : 600);
    const a = await snapOf(basePage), b = await snapOf(page);
    await basePage.close();
    const ids = Object.keys(a);
    const stateDiff = [], sigDiff = [];
    for (const id of ids) {
      const x = a[id], y = b[id];
      if (!y) { stateDiff.push(id); continue; }
      if (x.h !== y.h || x.n !== y.n || x.nan !== y.nan) stateDiff.push(id);
      if (x.sig !== y.sig) sigDiff.push(id);
    }
    R.bit = { presets: ids.length, stateDiff, sigDiff, steps: FAST ? 120 : 600 };
  }
}

R.pageErrors = pageErrors.slice(0, 5);
await page.close();
await browser.close();
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(R, null, 1));

// ------------------------------------------------------------------ 表
const L = [];
if (R.rdot) {
  L.push('§1 Ṙ 補正(動的 R = 3×分離・p=3・D₀=1e−3)');
  L.push('  ' + ['欄', '∂ₜu 中央差分との絶対差', '相対'].join(' | '));
  L.push('  補正前(Ṙ 項なし) | ' + ex(R.rdot.dyn.before.err.abs) + ' | ' + ex(R.rdot.dyn.before.err.rel));
  L.push('  補正後(Ṙ 項あり) | ' + ex(R.rdot.dyn.after.err.abs) + ' | ' + ex(R.rdot.dyn.after.err.rel));
  L.push('  固定 R=' + R.rdot.fixed.R + '(Ṙ=0) | ' + ex(R.rdot.fixed.abs) + ' | ' + ex(R.rdot.fixed.rel));
  L.push('  R=' + fx(R.rdot.dyn.R, 3) + ' Ṙ=' + fx(R.rdot.dyn.Rdot, 6) + ' / 負質量拒否=' + R.rdot.negMass + ' 正質量受理=' + R.rdot.posOk);
}
if (R.radial) {
  L.push('§1b |a_I|/|g_N|(🪟+試験粒子・support)');
  L.push('  r | none | 動的 R(3×分離) | 固定 360 | 固定 720 | 固定 1440');
  for (const z of R.radial.rows) L.push('  ' + [z.r, ex(z.none, 3), ex(z.dynamic, 3), ex(z.fixHalf, 3), ex(z.fixR, 3), ex(z.fix2R, 3)].join(' | '));
}
if (R.field) {
  L.push('§2 共通場 API: g=G∇D 対 E4 pair 和 abs=' + ex(R.field.gravity.abs) + ' rel=' + ex(R.field.gravity.rel)
    + ' / ∇D 中央差分 rel=' + ex(R.field.gradD.rel) + ' / 門=' + R.field.gates
    + ' / bg:"frame" 復帰=' + ex(R.field.bgFrame));
  L.push('  timeDerivativeComplete: scalar=' + R.field.laws.scalar.tdc + ' local(Ṙ 無)=' + R.field.laws.local.tdc
    + ' local(Ṙ 有)=' + R.field.laws.localRdot.tdc + ' complex=' + R.field.laws.complex.tdc);
  L.push('  同じ D か(3 法則)=' + ex(R.field.laws.sameD) + ' / exclude 後の源 ' + JSON.stringify(R.field.laws.exclude));
}
if (R.complex) {
  L.push('§3 複素決定力場(🪟 等質量連星・r=600・M*=1000 L*=240 T*=518.8544)');
  L.push('  p | Φ | Φ̂ | |A| | |Â| | |u_平均(D₀=0)| | CR 残差 rel1 | rel2');
  for (const z of R.complex.pSweep) {
    L.push('  ' + [z.p, ex(z.Phi, 4), ex(z.Phihat, 4), ex(Math.hypot(z.A[0], z.A[1]), 4),
      ex(Math.hypot(z.Ahat[0], z.Ahat[1]), 4), z.uMean ? ex(Math.hypot(z.uMean[0], z.uMean[1]), 4) : '—',
      ex(z.crRel1, 3), ex(z.crRel2, 3)].join(' | '));
  }
  L.push('  ∇Φ 中央差分差=' + ex(R.complex.grad.Phi) + ' / ∇A=' + ex(R.complex.grad.A)
    + ' / ∂ₜA=' + ex(R.complex.dAdtErr) + '(規模 ' + ex(R.complex.dAdtScale) + ')');
  L.push('  A の線形性(源 2 倍)rel=' + ex(R.complex.linear.rel) + ' / 分割不変=' + ex(R.complex.split)
    + ' / 門=' + R.complex.gates);
  L.push('  CR(4 点・p=2): ' + R.complex.cr.map((z) => '(' + z.at + ') rel1=' + ex(z.rel1, 2) + ' rel2=' + ex(z.rel2, 2)).join(' / '));
}
if (R.d0) {
  L.push('§4 D₀=0 の相対 vs 絶対(単一源 m=500・|u_src|=' + fx(R.d0.uSrc, 6) + '・p=2)');
  L.push('  r | χ(D₀=0) | |u|(D₀=0) | |u|(D₀=80) | |u|(D₀=800) | |A| | W');
  for (const z of R.d0.rows) {
    L.push('  ' + [z.r, fx(z.chi_D0_0, 6), ex(z.u_D0_0, 6), ex(z.u_D0_80, 4), ex(z.u_D0_800, 4), ex(z.A, 4), ex(z.W, 4)].join(' | '));
  }
  L.push('  2 源(逆向き v)D₀=0: ' + R.d0.two.map((z) => 'r=' + z.r + ' |u|=' + ex(z.u, 3) + ' |A|=' + ex(z.A, 3)).join(' / '));
}
if (R.entry) {
  L.push('§5 入場条件');
  L.push('  (i) 剛体箱の共回転極 残差/(Ω²r) 対 (1−ηχ)² の最大差 = ' + ex(R.entry.i.maxDiff));
  L.push('  D₀ | χ | η | 実測 | (1−ηχ)² | 差 | stop | N | S._g2 未確保 | kKind');
  for (const b of R.entry.box) {
    if (b.err) { L.push('  ' + [b.D0, '—', b.eta, 'ERR:' + b.err].join(' | ')); continue; }
    L.push('  ' + [b.D0, fx(b.chi, 4), b.eta, fx(b.ratio, 6), fx(b.law, 6), ex(b.diff, 2),
      String(b.stop), b.N, b.g2, b.kKind].join(' | '));
  }
  L.push('  (ii) D₀=0 源なし null = ' + R.entry.ii);
  L.push('  (iii) ∇Φ(=∇D)中央差分 rel = ' + ex(R.entry.iii.rel));
  L.push('  (iv) A の線形性 rel = ' + ex(R.entry.iv.rel));
  L.push('  検証器: ' + JSON.stringify(R.entry.validator));
  L.push('  chiCut: ' + JSON.stringify(R.entry.chiCut));
  if (R.entry.complexToy) L.push('  complex を積分器へ: ' + JSON.stringify(R.entry.complexToy));
}
if (R.toy) {
  L.push('§6 トイの帳簿(🪟+非頂点リング 8 個・' + (R.toy.scalar1.steps || '?') + ' 步・dt=0.004)');
  for (const k of ['scalar1', 'scalar0', 'local1', 'complex1']) {
    const z = R.toy[k];
    if (!z || z.err) { L.push('  ' + k + ': ERR ' + (z && z.err)); continue; }
    L.push('  ' + k + ': stop=' + z.stop + ' N=' + z.N + ' χ=' + ex(z.chi, 3) + ' |Δv|max=' + ex(z.dv, 3)
      + ' E+E_mesh=' + ex(z.eBook) + ' ΔP+res=' + ex(z.dPres) + ' ΔL+res/|L|=' + ex(Math.abs(z.dLres) / z.Labs)
      + ' 分離=' + fx(z.sep, 6) + ' NaN=' + z.nan + ' クランプ=' + z.clamp + ' kKind=' + z.kKind + ' g2 未確保=' + z.g2);
  }
  L.push('  toyGain=0 と トイなし の最大状態差 = ' + ex(R.toy.gain0Same));
}
if (R.kick) {
  L.push('§7 実キックの除去段階(η=0 = 除去だけ 対 kFrame=0 = 支えなし・🪟+リング)');
  L.push('  欄 | post(第258便a) | inStep(第259便a) | |x| | post 相対 | inStep 相対');
  for (const k of ['dt0008', 'dt0004']) {
    const z = R.kick[k];
    L.push('  ' + [k, ex(z.post), ex(z.inStep), fx(z.scale, 1), ex(z.postRel), ex(z.inStepRel)].join(' | '));
  }
  const t = R.kick.third;
  L.push('  ' + ['第三体あり', ex(t.post), ex(t.inStep), fx(t.scale, 1), ex(t.postRel), ex(t.inStepRel)].join(' | '));
  for (const k of ['dt0008', 'dt0004']) {
    const b = R.kick[k].book;
    L.push('  帳簿(' + k + '): post ΔP+res=' + ex(b.post.dPres) + ' ΔL+res/|L|=' + ex(b.post.dLres) + ' E+E_mesh=' + ex(b.post.e)
      + ' / inStep ΔP+res=' + ex(b.inStep.dPres) + ' ΔL+res/|L|=' + ex(b.inStep.dLres) + ' E+E_mesh=' + ex(b.inStep.e)
      + ' / removal=' + R.kick[k].removalPost + '→' + R.kick[k].removalIn + ' 戻し=' + R.kick[k].giveIn);
  }
  L.push('  ΔL: 支えなし ' + ex(t.dLbase) + ' / post ' + ex(t.dLpost) + ' / inStep ' + ex(t.dLin));
  L.push('  箱(共回転): kFrame=0 ' + fx(R.kick.box.kf0, 8) + ' / post 差 ' + ex(R.kick.box.dPost)
    + ' / inStep 差 ' + ex(R.kick.box.dIn));
}
if (R.bit) {
  L.push('§8 未宣言 1 bit 不変: ' + (R.bit.skipped ? R.bit.skipped
    : `${R.bit.presets} 本 × ${R.bit.steps} 步 — 状態差 ${R.bit.stateDiff.length} 本 ${JSON.stringify(R.bit.stateDiff)} / 署名差 ${R.bit.sigDiff.length} 本 ${JSON.stringify(R.bit.sigDiff)}`));
}
L.push('pageErrors: ' + JSON.stringify(R.pageErrors));
const table = L.join('\n');
console.log(table);
fs.writeFileSync(OUT, JSON.stringify(Object.assign({}, R, { table }), null, 1));
console.log('\n-> ' + OUT);
