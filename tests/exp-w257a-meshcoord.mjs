// 第257便a W1「連星の物理 —— 箱宇宙の座標変換慣性(opt-in inertia:"coordinate")と (f,η) 交差」(第49報)。
//
// 原仮定者(第49報・抜粋): 「表示がおかしいので、物理計算についても確認する」「箱宇宙における空間メッシュに
//   よる引きずりは、座標変換そのものである。メッシュの移動回転拡縮は、粒子に直接反映される」「空間メッシュに
//   対する相対的な移動が慣性である。つまり、空間メッシュの回転と一致して公転している粒子は、遠心力が消える」
//   「コンパクト天体連星サンプルについては、局所的な空間メッシュが、背景宇宙による空間メッシュに対して顕在化
//   する事により遠心力が弱まる。これを踏まえて、近点移動も一致する様に、質量補正を調整する」。
//
// **座標を回すだけでは遠心支持は消えない**(ẍ に −Ω²(x−C) が残る)ので、本器が測るのは
// 「**相対運動の作用 L=½m|v−ηχu_mesh|²−mΦ を公理にしたとき**、遠心の符号がどちらへ動くか」である。
// 予想は 1 つも書かない —— 走らせて出た数だけを書く(Failure First)。
//
// ■ 節(--pure --box --chi --feta --hold --pnfix・複数指定可・無指定は全部)
//   pure : 純関数 2 本の恒等と門(affineComovingStep の群・relativeOrbitReference の参照値)。
//   box  : 箱宇宙。(a) E6′ が解析共動写像へ何次で寄るか(並進/回転/拡縮 × dt 3 段)。
//          (b) **符号表** —— 共回転試験粒子の a_r+Ω²r と メッシュ座標の q̈ を
//          E6′ / coordinate(η=1, 0.5, 0)/ kFrame=0 で並べる(G=0 と G>0・dt 反転)。
//   chi  : 🪟 の診断コピー+試験粒子。D0pull 5 段で χ を振り、**円軌道を保つ ω を root-find**して
//          f_meas=GM/(R³ω_c²) を出し、(1−χ)・(1−χ)²・参照モデル f=(1−χ)²+sχ(1−χ) と比べる。
//          頂点へ当てた場合(inertiaVertices)の軌道 P・Δϖ・帳簿・クランプも。
//   feta : **本便の核心** —— ⚡ の診断コピーで f×η の 2 次元を走らせ、近点間 P と Δϖ を同時に出す。
//   hold : feta で交差があれば、その (f,η) で 🧮🩺🧶 を 1 点ずつ(hold-out)。
//   pnfix: pairPN の演算順修正(1PN の w を両側とも前步で読む)と `"pair"` の ③′ 統一の**前後**。
//
// 実行: node tests/exp-w257a-meshcoord.mjs [--pure] [--box] [--chi] [--feta] [--hold] [--pnfix] [--fast]
// 出力: tests/out/meshcoord-w257.json(数値は docs/PHYSICS.md〔第257便a〕へ全載)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + path.join(ROOT, TARGET);
const OUT = path.join(ROOT, 'tests', 'out', 'meshcoord-w257.json');
const argv = process.argv.slice(2);
const FAST = argv.includes('--fast');
const only = argv.filter((a) => a.startsWith('--') && a !== '--fast').map((a) => a.slice(2));
const want = (k) => !only.length || only.includes(k);
const fx = (z, d = 6) => (z === null || z === undefined || !Number.isFinite(z)) ? '—' : Number(z).toFixed(d);
const ex = (z, d = 4) => (z === null || z === undefined || !Number.isFinite(z)) ? '—' : Number(z).toExponential(d);

const DT0 = 0.016, NWIN = 20, YR = 365.25 * 86400;
const ORBITS = FAST ? 6.5 : 21.5;

// ---------------------------------------------------------------- 観測(CSV が正本 — 第255便d/第256便a と同規約)
function loadObs() {
  const txt = fs.readFileSync(path.join(ROOT, 'paper', 'data', 'solar-observations.csv'), 'utf8');
  const m = new Map();
  for (const line of txt.split('\n')) {
    if (!line.trim() || line.startsWith('body,')) continue;
    const cols = []; let cur = '', inQ = false;
    for (const ch of line) {
      if (inQ) { if (ch === '"') inQ = false; else cur += ch; }
      else if (ch === '"') inQ = true;
      else if (ch === ',') { cols.push(cur); cur = ''; }
      else cur += ch;
    }
    cols.push(cur);
    const key = cols[0] + '|' + cols[1];
    if (m.has(key)) continue;
    m.set(key, { v: Number(cols[2]), unit: cols[3], sigma: cols[8] });
  }
  return m;
}
const CSV = loadObs();
const SYS = {
  psrDoubleABDFM: { emoji: '⚡', body: 'PSR J0737-3039 B', label: '⚡ J0737−3039A/B', Tunit: 10, omegaDotFallback: 16.899323 },
  psrJ1757DFM: { emoji: '🧮', body: 'PSR J1757-1854', label: '🧮 J1757−1854', Tunit: 10 },
  psrJ1946DFM: { emoji: '🩺', body: 'PSR J1946+2052', label: '🩺 J1946+2052', Tunit: 10 },
  psrB1534DFM: { emoji: '🧶', body: 'PSR B1534+12', label: '🧶 B1534+12', Tunit: 10 },
};
for (const k of Object.keys(SYS)) {
  const s = SYS[k];
  const P = CSV.get(s.body + '|orbital_period'), w = CSV.get(s.body + '|periastron_advance');
  s.PobsS = (P && P.unit === 's') ? P.v : (P ? P.v * 86400 : null);
  s.PobsSigmaS = (P && P.sigma && P.sigma.trim() !== '')
    ? (P.unit === 's' ? Number(P.sigma) : Number(P.sigma) * 86400) : null;
  s.omegaDot = w ? w.v : s.omegaDotFallback;
  s.omegaDotSigma = (w && w.sigma && w.sigma.trim() !== '') ? Number(w.sigma) : null;
  s.obsDegPerOrbit = (s.omegaDot !== undefined && s.PobsS) ? s.omegaDot * s.PobsS / YR : null;
  s.obsDegPerOrbitSigma = (s.omegaDotSigma !== null && s.omegaDotSigma !== undefined && s.PobsS)
    ? s.omegaDotSigma * s.PobsS / YR : null;
  s.Pu = s.PobsS / s.Tunit;
}

// ================================================================ ブラウザ
const { chromium } = await import('playwright');
let browser;
try { browser = await chromium.launch(); }
catch { browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }); }
const pg = await browser.newPage();
const pageErrors = [];
pg.on('pageerror', (e) => pageErrors.push(String(e)));
await pg.goto(INDEX, { waitUntil: 'load' });
await pg.waitForFunction(() => window.HP && HP.sim);

// ---------------------------------------------------------------- ページ側の測定ライブラリ
await pg.evaluate(() => {
  const W = (window.__w257 = {});
  // 宣言だけを差し替えて build する(本体 JSON は 1 bit も触らない)
  W.build = (id, o) => {
    const opt = o || {};
    const pd = JSON.parse(JSON.stringify(HP.allPresets().find((q) => q.id === id)));
    if (opt.physics) for (const k of Object.keys(opt.physics)) {
      if (opt.physics[k] === '__delete') delete pd.physics[k]; else pd.physics[k] = opt.physics[k];
    }
    if (opt.spaceMesh === null) delete pd.physics.spaceMesh;
    else if (opt.spaceMesh) pd.physics.spaceMesh = Object.assign({ mode: 'vertex' }, pd.physics.spaceMesh || {}, opt.spaceMesh);
    if (opt.universeBox) pd.universeBox = Object.assign({}, pd.universeBox || {}, opt.universeBox);
    let f1 = null;
    if (opt.fMass !== undefined && pd.massCalibration && Array.isArray(pd.massCalibration.baseMass)) {
      f1 = pd.massCalibration.baseMass.slice();
      for (let i = 0; i < f1.length && i < pd.bodies.length; i++) pd.bodies[i].m = f1[i] * opt.fMass;
    }
    if (opt.bodies) pd.bodies = opt.bodies;
    if (opt.extraBody) pd.bodies = pd.bodies.concat([opt.extraBody]);
    delete pd.massCalibration;   // 台帳の三者一致検査を実験へ持ち込まない(第249便a 以来の規約)
    const v = HP.validatePreset(pd);
    if (!v.ok) return { err: (v.errors || []).join('|') };
    HP.sim.build(v.preset);
    return { ok: true, sig: JSON.stringify(v.preset.physics), n: HP.sim.n,
      m: [HP.sim.m[0], HP.sim.m[1]], fMass: (opt.fMass === undefined) ? null : opt.fMass };
  };
  // 近点検出器 A/B・柵・直線 fit(第252便b/第254便d/第255便d/第256便a と**同一手続き**)
  W.fit = (raw, rMin, rMax, pRef, dt, nWin) => {
    const mid = 0.5 * (rMin + rMax);
    const peri = raw.filter((p) => p.r < mid);
    const rej = { apo: raw.length - peri.length, dup: 0, jump: 0 };
    const keep = [];
    for (const p of peri) {
      if (keep.length && (p.k - keep[keep.length - 1].k) * dt < 0.5 * pRef) { rej.dup++; continue; }
      keep.push(p);
    }
    const base = { cand: peri.length, found: keep.length, rej };
    if (keep.length < nWin) return Object.assign(base, { nPeri: keep.length, unmeasured: true, slopeDeg: null, perMean: null });
    const use = keep.slice(0, nWin), ang = [];
    for (let i = 0; i < use.length; i++) {
      let a = use[i].ang;
      if (i) { let z = a - ang[i - 1]; while (z > Math.PI) z -= 2 * Math.PI; while (z < -Math.PI) z += 2 * Math.PI;
        if (Math.abs(z) > Math.PI / 2) { rej.jump++; break; } a = ang[i - 1] + z; }
      ang.push(a);
    }
    if (ang.length < nWin) return Object.assign(base, { nPeri: ang.length, unmeasured: true, slopeDeg: null, perMean: null });
    const n = ang.length, mx = (n - 1) / 2, my = ang.reduce((a, b) => a + b, 0) / n;
    let sxy = 0, sxx = 0;
    for (let i = 0; i < n; i++) { sxy += (i - mx) * (ang[i] - my); sxx += (i - mx) * (i - mx); }
    return Object.assign(base, { nPeri: n, unmeasured: false, slopeDeg: (sxy / sxx) * 180 / Math.PI,
      perMean: (use[nWin - 1].k - use[0].k) * dt / (nWin - 1) });
  };
  W.win = (dt, tEnd, pRef, nWin) => {
    const S = HP.sim;
    const steps = Math.round(tEnd / dt);
    const A = [], Bd = [], sid = [];
    let r2 = 0, r1 = 0, t2 = 0, t1 = 0, rd1 = 0, rMin = Infinity, rMax = -Infinity;
    let acc = 0, accPrev = 0, thPrev = null, nTurn = 0;
    const T0 = S.totals(), L0 = T0.L + S.resL + S.radL;
    const ep0x = T0.px + S.resPx, ep0y = T0.py + S.resPy;
    const pScale = S.m[0] * Math.hypot(S.vx[0], S.vy[0]) + S.m[1] * Math.hypot(S.vx[1], S.vy[1]);
    const clamp0 = (S.clampVN || 0) + (S.clampSN || 0) + (S.clampRN || 0) + (S.clampTN || 0) + (S.clampAN || 0);
    for (let k = 0; k < steps; k++) {
      S.step(dt);
      const dx = S.x[1] - S.x[0], dy = S.y[1] - S.y[0];
      const rr = Math.hypot(dx, dy), th = Math.atan2(dy, dx);
      const dvx = S.vx[1] - S.vx[0], dvy = S.vy[1] - S.vy[0];
      const rd = (dx * dvx + dy * dvy) / rr;
      if (rr < rMin) rMin = rr; if (rr > rMax) rMax = rr;
      if (thPrev !== null) {
        let d = th - thPrev; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
        accPrev = acc; acc += d;
        while (Math.abs(acc) >= (nTurn + 1) * 2 * Math.PI) {
          const tgt = Math.sign(acc) * (nTurn + 1) * 2 * Math.PI;
          const fr = (acc !== accPrev) ? (tgt - accPrev) / (acc - accPrev) : 0;
          sid.push((k - 1 + fr) * dt); nTurn++;
        }
      }
      thPrev = th;
      if (k >= 1 && rd1 < 0 && rd >= 0) {
        const fr = (rd !== rd1) ? (-rd1 / (rd - rd1)) : 0;
        let a1 = t1, a2 = th; while (a2 - a1 > Math.PI) a2 -= 2 * Math.PI; while (a2 - a1 < -Math.PI) a2 += 2 * Math.PI;
        A.push({ ang: a1 + fr * (a2 - a1), k: k - 1 + fr, r: rr });
      }
      if (k >= 2 && r1 < r2 && r1 < rr) {
        const dd = (r2 - 2 * r1 + rr), fr = (dd !== 0) ? 0.5 * (r2 - rr) / dd : 0;
        let a1 = t2, a2 = t1, a3 = th;
        while (a2 - a1 > Math.PI) a2 -= 2 * Math.PI; while (a2 - a1 < -Math.PI) a2 += 2 * Math.PI;
        while (a3 - a2 > Math.PI) a3 -= 2 * Math.PI; while (a3 - a2 < -Math.PI) a3 += 2 * Math.PI;
        Bd.push({ ang: a2 + 0.5 * fr * (a3 - a1) + 0.5 * fr * fr * (a3 - 2 * a2 + a1), k: k - 1 + fr, r: r1 });
      }
      r2 = r1; r1 = rr; t2 = t1; t1 = th; rd1 = rd;
      if (S.hasNaN()) break;
    }
    const sidMean = sid.length > 1 ? (sid[sid.length - 1] - sid[0]) / (sid.length - 1) : null;
    const pUse = (sidMean > 0) ? sidMean : pRef;
    const T1 = S.totals(), L1 = T1.L + S.resL + S.radL;
    return { rMin, rMax, eProxy: (rMax - rMin) / (rMax + rMin),
      A: W.fit(A, rMin, rMax, pUse, dt, nWin), B: W.fit(Bd, rMin, rMax, pUse, dt, nWin),
      sidMean, steps, nan: S.hasNaN(),
      clampD: ((S.clampVN || 0) + (S.clampSN || 0) + (S.clampRN || 0) + (S.clampTN || 0) + (S.clampAN || 0)) - clamp0,
      lRel: Math.abs(L1 - L0) / Math.max(Math.abs(L0), 1e-9),
      pRel: Math.hypot(T1.px + S.resPx - ep0x, T1.py + S.resPy - ep0y) / Math.max(pScale, 1e-9),
      mc: { E: S.meshCoordE, L: S.meshCoordL, Px: S.meshCoordPx, Py: S.meshCoordPy,
        chi: S.meshCoordChi, N: S.meshCoordN, stop: S.meshCoordStop, src: S.meshCoordSrc,
        dvI: S.meshCoordDvI, dvE6: S.meshCoordDvE6, clamp: S.meshCoordClamp },
      weave: { E: S.spaceMeshWeaveE, L: S.spaceMeshWeaveL, chi: S.spaceMeshWeaveChi,
        clamp: S.spaceMeshWeaveClamp, stop: S.spaceMeshWeaveStop, mode: S.spaceMeshWeaveMode,
        trDv: S.spaceMeshWeaveTrDv, pnDv: S.spaceMeshWeavePNDv },
      state: [S.x[0], S.y[0], S.vx[0], S.vy[0], S.x[1], S.y[1], S.vx[1], S.vy[1]] };
  };
  W.run = (id, opt, dt, orbits, Pu, nWin) => {
    const meta = W.build(id, opt);
    if (meta.err) return { err: meta.err };
    const o = W.win(dt, orbits * Pu, Pu, nWin || 20);
    o.meta = meta;
    return o;
  };
  W.short = (id, opt, dt, steps) => {
    const meta = W.build(id, opt);
    if (meta.err) return { err: meta.err };
    const S = HP.sim, T0 = S.totals();
    for (let k = 0; k < steps; k++) S.step(dt);
    const T = S.totals();
    return { sig: meta.sig, n: S.n, nan: S.hasNaN(),
      st: [S.x[0], S.y[0], S.vx[0], S.vy[0], S.x[1], S.y[1], S.vx[1], S.vy[1]],
      r: Math.hypot(S.x[1] - S.x[0], S.y[1] - S.y[0]),
      clamp: S.clampVN + S.clampSN + S.clampRN + S.clampTN + S.clampAN,
      has: S.hasCoordInertia, stop: S.meshCoordStop, src: S.meshCoordSrc,
      mcE: S.meshCoordE, mcEm: S.meshCoordEmesh, mcPx: S.meshCoordPx, mcPy: S.meshCoordPy,
      mcL: S.meshCoordL, mcChi: S.meshCoordChi, mcN: S.meshCoordN, mcClamp: S.meshCoordClamp,
      wStop: S.spaceMeshWeaveStop, wE: S.spaceMeshWeaveE,
      closePx: (T.px - T0.px) + S.resPx, closePy: (T.py - T0.py) + S.resPy,
      closeL: (T.L - T0.L) + S.resL, Labs: Math.abs(T.L) || 1,
      dP: Math.hypot(T.px - T0.px, T.py - T0.py), dL: T.L - T0.L };
  };
});

let prev = {};
if (fs.existsSync(OUT)) { try { prev = JSON.parse(fs.readFileSync(OUT, 'utf8')) || {}; } catch { prev = {}; } }
const out = { ...prev, wave: '第257便a', target: TARGET, node: process.version, at: new Date().toISOString(),
  window: { nPeri: NWIN, dt0: DT0, orbits: ORBITS }, obs: SYS, fast: FAST };

// ================================================================ pure: 純関数 2 本
if (want('pure')) {
  out.pure = await pg.evaluate(() => {
    const R = {};
    // ① 群(100 分割と一括)— 並進/回転/拡縮の個別と同時
    const cases = [
      { k: '並進のみ', o: { C: [1, 2], V: [0.37, -0.21], H: 0, Omega: 0 } },
      { k: '回転のみ', o: { C: [1, 2], V: [0, 0], H: 0, Omega: 0.4 } },
      { k: '拡縮のみ', o: { C: [1, 2], V: [0, 0], H: 0.05, Omega: 0 } },
      { k: '同時', o: { C: [1, 2], V: [0.37, -0.21], H: 0.05, Omega: 0.4 } },
    ];
    R.group = cases.map((c) => {
      const T = 1.5, x0 = [4, -3];
      const one = HP.affineComovingStep(Object.assign({ dt: T }, c.o), x0);
      let st = { x: x0.slice(), C: c.o.C.slice() };
      for (let i = 0; i < 100; i++) {
        const z = HP.affineComovingStep({ C: st.C, V: c.o.V, H: c.o.H, Omega: c.o.Omega, dt: T / 100 }, st.x);
        st = { x: z.x, C: z.C };
      }
      const d = Math.hypot(one.x[0] - st.x[0], one.x[1] - st.x[1]);
      return { k: c.k, abs: d, rel: d / Math.hypot(one.x[0], one.x[1]) };
    });
    // ② 固定点の再アンカー(**箱の形**: 中心を動かさず一様 V を足す場)—— 速度場が一致すること
    const o = { C: [1, 2], V: [0.37, -0.21], H: 0.05, Omega: 0.4, dt: 0.9 };
    const wv = HP.affineComovingStep(o, [4, -3]);
    let fe = 0;
    for (const q of [[4, -3], [-8, 5], [0, 0], [120, 77]]) {
      const zf = HP.affineComovingStep({ C: wv.fixedPoint, V: [0, 0], H: o.H, Omega: o.Omega, dt: 0 }, q);
      const ux = o.V[0] + o.H * (q[0] - o.C[0]) - o.Omega * (q[1] - o.C[1]);
      const uy = o.V[1] + o.Omega * (q[0] - o.C[0]) + o.H * (q[1] - o.C[1]);
      fe = Math.max(fe, Math.hypot(zf.u[0] - ux, zf.u[1] - uy));
    }
    // 中心が動く形(V 付き)と動かない形(x* 再アンカー)は**別の流れ**である(その差も測って書く)
    const wf = HP.affineComovingStep({ C: wv.fixedPoint, V: [0, 0], H: o.H, Omega: o.Omega, dt: o.dt }, [4, -3]);
    R.fixed = { fieldErr: fe, flowGap: Math.hypot(wv.x[0] - wf.x[0], wv.x[1] - wf.x[1]), fp: wv.fixedPoint };
    // ③ 逆向き(dt<0)で戻る
    const back = HP.affineComovingStep({ C: wv.C, V: o.V, H: o.H, Omega: o.Omega, dt: -o.dt }, wv.x);
    R.reverse = Math.hypot(back.x[0] - 4, back.x[1] + 3);
    // ④ 門
    R.gates = [HP.affineComovingStep(null, [0, 0]), HP.affineComovingStep({ dt: NaN }, [0, 0]),
      HP.affineComovingStep({ dt: 1 }, [1]), HP.affineComovingStep({ dt: 1 }, null)].every((z) => z === null);
    // ⑤ 参照モデル: χ=0 でニュートン・剛体 s=0 の Δϖ と f
    R.ref0 = HP.relativeOrbitReference({ chi: 0, s: 0, omega: 1, r: 1, GM: 1 });
    R.refTab = [];
    for (const s of [0, 0.5, 1, 1.5]) for (const chi of [0.1, 0.5, 0.9, 0.99]) {
      const z = HP.relativeOrbitReference({ chi, s, omega: 1 });
      R.refTab.push({ s, chi, f: z.f, kappa2: z.kappa2, dvarpiDeg: z.dvarpiDeg, stable: z.stable });
    }
    R.refGates = [HP.relativeOrbitReference(null), HP.relativeOrbitReference({ chi: -0.1, omega: 1 }),
      HP.relativeOrbitReference({ chi: 1.1, omega: 1 }), HP.relativeOrbitReference({ chi: 0.5, omega: NaN }),
      HP.relativeOrbitReference({ chi: 0.5, omega: 1, r: -1 })].every((z) => z === null);
    return R;
  });
  // 剛体 s=0 でこの機構だけから ⚡ の観測 Δϖ を出す χ(解析上の反例)
  const obsDeg = SYS.psrDoubleABDFM.obsDegPerOrbit;
  out.pure.chiForObs = await pg.evaluate((target) => {
    let lo = 0, hi = 0.5;
    for (let i = 0; i < 200; i++) {
      const mid = 0.5 * (lo + hi);
      const z = HP.relativeOrbitReference({ chi: mid, s: 0, omega: 1 });
      if (z.dvarpiDeg < target) lo = mid; else hi = mid;
    }
    const chi = 0.5 * (lo + hi), z = HP.relativeOrbitReference({ chi, s: 0, omega: 1 });
    return { chi, f: z.f, dvarpiDeg: z.dvarpiDeg, target };
  }, obsDeg);
  const P = out.pure;
  for (const g of P.group) console.error(`PURE ① 群 [${g.k}]: 100 分割と一括の差 ${ex(g.abs)}(相対 ${ex(g.rel)})`);
  console.error(`PURE ② 固定点の再アンカー: 速度場の一致 ${ex(P.fixed.fieldErr)}`
    + `(x*=${P.fixed.fp.map((z) => fx(z, 6)).join(',')})・中心が動く形との流れの差 ${ex(P.fixed.flowGap)}`
    + ` / ③ 逆向きで戻る ${ex(P.reverse)} / ④ 門 ${P.gates}`);
  console.error(`PURE ⑤ χ=0: f=${fx(P.ref0.f, 12)}・Δϖ=${ex(P.ref0.dvarpiDeg)}(ニュートンへ戻る)・門 ${P.refGates}`);
  console.error(`PURE ⑥ 剛体 s=0 でこの機構だけから ⚡ の観測 Δϖ=${fx(P.chiForObs.target, 8)}°/周 を出すには`
    + ` χ=${ex(P.chiForObs.chi)}・**f=${fx(P.chiForObs.f, 8)}**(= 完全追従 χ→1 とは両立しない)`);
}

// ================================================================ box: 箱宇宙
if (want('box')) {
  const R = {};
  // (a) E6′ が解析共動写像へ何次で寄るか(単一の共動試験粒子・G=0・D₀=0)
  R.conv = await pg.evaluate(() => {
    const W = window.__w257, rows = [];
    const CASES = [
      { k: '並進 V=(0.3,−0.2)', ub: { mode: 'exp', H0: 0, omega: 0, vx: 0.3, vy: -0.2, D: 80, dPower: 1 } },
      { k: '回転 Ω=0.2', ub: { mode: 'exp', H0: 0, omega: 0.2, vx: 0, vy: 0, D: 80, dPower: 1 } },
      { k: '拡縮 H=0.05', ub: { mode: 'exp', H0: 0.05, omega: 0, vx: 0, vy: 0, D: 80, dPower: 1 } },
      { k: '同時', ub: { mode: 'exp', H0: 0.05, omega: 0.2, vx: 0.3, vy: -0.2, D: 80, dPower: 1 } },
    ];
    const T = 5, r0 = 100;
    for (const c of CASES) for (const dt of [0.02, 0.01, 0.005]) {
      const ub = c.ub, H = ub.H0, Om = ub.omega, V = [ub.vx, ub.vy], C = [0, 0];
      const x0 = [C[0] + r0, C[1]];
      const v0 = [V[0] + H * r0 - Om * 0, V[1] + Om * r0 + H * 0];
      const meta = W.build('boxcomoving', { universeBox: ub,
        physics: { G: 0, D0: 0, kFrame: 1, geoPN: 0, softening: 4, stateCarry: 'double' },
        bodies: [{ type: 'single', m: 1e-9, x: x0[0], y: x0[1], vx: v0[0], vy: v0[1], spin: 0, pinned: false }] });
      if (meta.err) { rows.push({ k: c.k, dt, err: meta.err }); continue; }
      const S = HP.sim, steps = Math.round(T / dt);
      for (let k = 0; k < steps; k++) S.step(dt);
      // 解析: (H I+Ω J) が可逆なら固定点まわりの V=0 写像、そうでなければ一様並進
      let xa;
      if (H === 0 && Om === 0) xa = [x0[0] + V[0] * T, x0[1] + V[1] * T];
      else {
        const z0 = HP.affineComovingStep({ C, V, H, Omega: Om, dt: 0 }, x0);
        xa = HP.affineComovingStep({ C: z0.fixedPoint, V: [0, 0], H, Omega: Om, dt: T }, x0).x;
      }
      const err = Math.hypot(S.x[0] - xa[0], S.y[0] - xa[1]);
      rows.push({ k: c.k, dt, err, rel: err / Math.hypot(xa[0], xa[1]), xs: [S.x[0], S.y[0]], xa, nan: S.hasNaN() });
    }
    return rows;
  });
  for (const r of R.conv) console.error(`BOX (a) [${r.k}] dt=${r.dt}: |x_sim−x_解析|=${ex(r.err)}(相対 ${ex(r.rel)})`);
  // 収束次数(dt 半減ごとの比)
  R.convOrder = [];
  for (const k of [...new Set(R.conv.map((z) => z.k))]) {
    const g = R.conv.filter((z) => z.k === k);
    if (g.length === 3 && g[0].err > 0 && g[1].err > 0) {
      R.convOrder.push({ k, r1: g[0].err / g[1].err, r2: g[1].err / g[2].err,
        p: Math.log2(g[0].err / g[1].err) });
    }
  }
  for (const o of R.convOrder) console.error(`BOX (a′) [${o.k}] dt 半減の誤差比 ${fx(o.r1, 3)} / ${fx(o.r2, 3)} → 次数 p≈${fx(o.p, 3)}`);

  // (b) 符号表: 共回転試験粒子の a_r+Ω²r と メッシュ座標の q̈
  R.sign = await pg.evaluate(() => {
    const W = window.__w257, rows = [];
    const OM = 0.15, RS = [70, 130, 190];
    const COLS = [
      { k: 'E6′(現行・coordinate なし)', sm: null, ph: {} },
      { k: 'coordinate η=1', sm: { inertia: 'coordinate' }, ph: {} },
      { k: 'coordinate η=0.75', sm: { inertia: 'coordinate', inertiaGain: 0.75 }, ph: {} },
      { k: 'coordinate η=0.5', sm: { inertia: 'coordinate', inertiaGain: 0.5 }, ph: {} },
      { k: 'coordinate η=0.25', sm: { inertia: 'coordinate', inertiaGain: 0.25 }, ph: {} },
      { k: 'coordinate η=0(除去のみ)', sm: { inertia: 'coordinate', inertiaGain: 0 }, ph: {} },
      { k: 'kFrame=0(支えなし)', sm: null, ph: { kFrame: 0 } },
    ];
    for (const G of [0, 1]) for (const c of COLS) for (const dt of [0.02, 0.01, 0.005]) {
      const bodies = RS.map((r) => ({ type: 'single', m: 1e-9, x: r, y: 0, vx: 0, vy: OM * r, spin: 0, pinned: false }));
      if (G > 0) bodies.unshift({ type: 'single', m: 200, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: true });
      const meta = W.build('boxcomoving', {
        universeBox: { mode: 'exp', H0: 0, omega: OM, vx: 0, vy: 0, D: 80, dPower: 1 },
        physics: Object.assign({ G, D0: 0, kFrame: 1, geoPN: 0, softening: 4, stateCarry: 'double' }, c.ph),
        spaceMesh: c.sm, bodies });
      if (meta.err) { rows.push({ G, k: c.k, dt, err: meta.err }); continue; }
      const S = HP.sim, i0 = (G > 0) ? 1 : 0;
      const rec = [];
      for (let k = 0; k < 4; k++) {   // 1 步目は記憶づくり。3 步分の q を取って q̈ を出す
        const v0 = [S.vx[i0], S.vy[i0]];
        S.step(dt);
        const th = OM * S.t, cs = Math.cos(-th), sn = Math.sin(-th);
        rec.push({ ax: (S.vx[i0] - v0[0]) / dt, ay: (S.vy[i0] - v0[1]) / dt,
          x: S.x[i0], y: S.y[i0],
          qx: cs * S.x[i0] - sn * S.y[i0], qy: sn * S.x[i0] + cs * S.y[i0] });
      }
      const L = rec[rec.length - 1], r = Math.hypot(L.x, L.y);
      const ar = (L.ax * L.x + L.ay * L.y) / r;                    // 半径方向(外向き正)
      const q1 = rec[1], q2 = rec[2], q3 = rec[3];
      const qdd = Math.hypot((q3.qx - 2 * q2.qx + q1.qx) / (dt * dt), (q3.qy - 2 * q2.qy + q1.qy) / (dt * dt));
      rows.push({ G, k: c.k, dt, r, ar, resid: ar + OM * OM * r, ratio: (ar + OM * OM * r) / (OM * OM * r),
        qdd, chi: S.meshCoordChi, src: S.meshCoordSrc, stop: S.meshCoordStop, nan: S.hasNaN(),
        clamp: S.clampVN + S.clampSN + S.clampRN + S.clampTN + S.clampAN });
    }
    // dt 反転の契約(1 步だけ後退させる)
    const meta = W.build('boxcomoving', {
      universeBox: { mode: 'exp', H0: 0, omega: OM, vx: 0, vy: 0, D: 80, dPower: 1 },
      physics: { G: 0, D0: 0, kFrame: 1, geoPN: 0, softening: 4, stateCarry: 'double' },
      spaceMesh: { inertia: 'coordinate' },
      bodies: [{ type: 'single', m: 1e-9, x: 130, y: 0, vx: 0, vy: OM * 130, spin: 0, pinned: false }] });
    let back = { err: meta.err };
    if (!meta.err) {
      const S = HP.sim;
      for (let k = 0; k < 3; k++) S.step(0.01);
      const s0 = [S.x[0], S.y[0], S.vx[0], S.vy[0]];
      S.step(-0.01);
      back = { nan: S.hasNaN(), stop: S.meshCoordStop,
        finite: [S.x[0], S.y[0], S.vx[0], S.vy[0]].every(Number.isFinite),
        moved: Math.hypot(S.x[0] - s0[0], S.y[0] - s0[1]) };
    }
    return { rows, back };
  });
  for (const r of R.sign.rows.filter((z) => z.dt === 0.005)) {
    console.error(`BOX (b) G=${r.G} [${r.k}] r=${fx(r.r, 3)}: a_r=${ex(r.ar)}・**a_r+Ω²r=${ex(r.resid)}**`
      + `(Ω²r 比 ${ex(r.ratio)})・|q̈|=${ex(r.qdd)}・χ=${ex(r.chi)}・src=${r.src}・stop=${r.stop}`);
  }
  console.error(`BOX (b′) dt 反転(dt=−0.01 を 1 步): NaN=${R.sign.back.nan}・有限=${R.sign.back.finite}`
    + `・stop=${R.sign.back.stop}・戻り距離 ${ex(R.sign.back.moved)}`);
  out.box = R;
}

// ================================================================ chi: 🪟 の χ 掃引
if (want('chi')) {
  const R = {};
  // (1) D0pull 5 段 × 3 欄。試験粒子リングの外側に 1 個置き、**円軌道を保つ ω を root-find** して
  //     f_meas=GM/(R³ω_c²) を出す。連星の四重極ぶんは **kFrame=0 のニュートン基準**で規格化する。
  R.sweep = await pg.evaluate(() => {
    const W = window.__w257, rows = [];
    const D0S = [0, 1e-4, 1e-2, 1, 1e3];
    const RT = 600;                       // 試験粒子の半径(🪟 の遠点分離 240 の 2.5 倍)
    const COLS = [
      { k: 'kFrame=0(ニュートン基準)', sm: null, ph: { kFrame: 0 } },
      { k: 'E6′(現行)', sm: null, ph: {} },
      { k: 'coordinate η=1', sm: { inertia: 'coordinate' }, ph: {} },
      { k: 'coordinate η=0.5', sm: { inertia: 'coordinate', inertiaGain: 0.5 }, ph: {} },
    ];
    const probe = (d0, sm, ph, om) => {
      const meta = W.build('spaceMeshBinaryToy', { physics: Object.assign({ D0pull: d0 }, ph), spaceMesh: sm,
        extraBody: { type: 'single', m: 1e-8, x: RT, y: 0, vx: 0, vy: om * RT, spin: 0, pinned: false } });
      if (meta.err) return null;
      const S = HP.sim, i = S.n - 1, dt = 0.004;
      let ar = 0, r = RT;
      for (let k = 0; k < 4; k++) {
        const v0 = [S.vx[i], S.vy[i]];
        S.step(dt);
        r = Math.hypot(S.x[i], S.y[i]);
        ar = ((S.vx[i] - v0[0]) / dt * S.x[i] + (S.vy[i] - v0[1]) / dt * S.y[i]) / r;
      }
      const A = HP.dfmSpaceMeshCapture(S, [0, 1]);
      const M = A ? HP.dfmSpaceMeshState(A, S) : null;
      return { ar, r, chi: S.meshCoordChi, nan: S.hasNaN(), stop: S.meshCoordStop,
        GM: S.params.G * (S.m[0] + S.m[1]), OmMesh: M ? M.gradU[2] : null,
        aI: S.meshCoordDvI / dt, aE6: S.meshCoordDvE6 / dt, gN: S.params.G * (S.m[0] + S.m[1]) / (r * r) };
    };
    const rootOmega = (d0, sm, ph) => {
      const p0 = probe(d0, sm, ph, 0);
      if (!p0) return null;
      const omN = Math.sqrt(p0.GM / (RT * RT * RT));
      let lo = 0.02 * omN, hi = 8 * omN, om = omN, last = p0;
      for (let it = 0; it < 44; it++) {
        om = 0.5 * (lo + hi);
        const z = probe(d0, sm, ph, om);
        if (!z) break;
        last = z;
        if (z.ar + om * om * z.r < 0) lo = om; else hi = om;   // 内向きが勝つ → ω を上げる
      }
      return { om, omN, GM: p0.GM, last, bound: (om > 7.9 * omN || om < 0.03 * omN) };
    };
    for (const d0 of D0S) {
      const base = rootOmega(d0, null, { kFrame: 0 });
      for (const c of COLS) {
        const z = rootOmega(d0, c.sm, c.ph);
        if (!z || !base) { rows.push({ d0, k: c.k, err: 'build' }); continue; }
        const fMeas = z.GM / (RT * RT * RT * z.om * z.om);
        const fBase = base.GM / (RT * RT * RT * base.om * base.om);
        // χ(r) とその勾配(場の解析値。エンジンの分母と同じ核)
        const S = HP.sim;
        const chiAt = (rr) => {
          const bd = []; for (let q = 0; q < 2; q++) bd.push({ m: S.m[q], x: S.x[q], y: S.y[q] });
          const fl = HP.dfmMeshScalarField(bd, rr, 0, { G: S.params.G, eps: S.params.softening, power: HP.frameWeightPow(S.params) });
          return fl.Wpull / (fl.Wpull + d0);
        };
        const c1 = chiAt(RT), c2 = chiAt(RT * 1.05);
        const s = -(Math.log(c2) - Math.log(c1)) / Math.log(1.05);
        const eta = (c.sm && c.sm.inertiaGain !== undefined) ? c.sm.inertiaGain : (c.sm ? 1 : 0);
        // メッシュは**剛体回転**(T2 の B は空間一定)なので、相対慣性の実効比は x=ηχ·Ω_mesh/ω
        const xEff = (z.last.OmMesh !== null && z.om > 0) ? eta * c1 * Math.abs(z.last.OmMesh) / z.om : null;
        const ref = (xEff !== null && xEff >= 0 && xEff <= 1)
          ? HP.relativeOrbitReference({ chi: xEff, s, omega: 1 }) : null;
        rows.push({ d0, k: c.k, eta, omega: z.om, omegaN: z.omN, OmMesh: z.last.OmMesh, bound: z.bound,
          aI: z.last.aI, aE6: z.last.aE6, gN: z.last.gN, aIovergN: z.last.gN > 0 ? z.last.aI / z.last.gN : null,
          fMeas, fBase, fNorm: fMeas / fBase, chiField: c1, s, xEff,
          cand1: (xEff === null) ? null : 1 - xEff,
          cand2: (xEff === null) ? null : (1 - xEff) * (1 - xEff),
          candRef: ref ? ref.f : null,
          chiRun: z.last.chi, nan: z.last.nan, stop: z.last.stop });
      }
    }
    return rows;
  });
  for (const r of R.sweep) console.error(`CHI D0pull=${r.d0} [${r.k}]: ω_c=${ex(r.omega)}`
    + `${r.bound ? '(**探索上限に貼り付き = 円軌道の根が範囲内に無い**)' : ''}・Ω_mesh=${ex(r.OmMesh)}`
    + ` **f_norm=${fx(r.fNorm, 6)}**(生 ${fx(r.fMeas, 6)} / 基準 ${fx(r.fBase, 6)})`
    + ` / χ=${ex(r.chiField)}・s=${fx(r.s, 4)}・x=ηχΩ_m/ω=${fx(r.xEff, 6)}`
    + ` → (1−x)=${fx(r.cand1, 6)}・(1−x)²=${fx(r.cand2, 6)}・参照 f=${fx(r.candRef, 6)}`
    + ` / |a_I|/|g_N|=${ex(r.aIovergN)}`);

  // (1′) **T2 頂点メッシュの非局所性**: 同じ宣言で試験粒子の半径だけを振り、|a_I|/|g_N| の r 依存を見る
  R.radial = await pg.evaluate(() => {
    const W = window.__w257, rows = [];
    for (const RT of [300, 600, 1200, 2400, 4800]) {
      const omN0 = Math.sqrt(0.60066 * 1000 / (RT * RT * RT));
      const meta = W.build('spaceMeshBinaryToy', { spaceMesh: { inertia: 'coordinate' },
        extraBody: { type: 'single', m: 1e-8, x: RT, y: 0, vx: 0, vy: omN0 * RT, spin: 0, pinned: false } });
      if (meta.err) { rows.push({ RT, err: meta.err }); continue; }
      const S = HP.sim, dt = 0.004;
      for (let k = 0; k < 4; k++) S.step(dt);
      const r = Math.hypot(S.x[S.n - 1], S.y[S.n - 1]);
      const gN = S.params.G * (S.m[0] + S.m[1]) / (r * r);
      rows.push({ RT, r, chi: S.meshCoordChi, aI: S.meshCoordDvI / dt, aE6: S.meshCoordDvE6 / dt,
        gN, ratio: S.meshCoordDvI / dt / gN, nan: S.hasNaN() });
    }
    return rows;
  });
  for (const r of R.radial) console.error(`CHI(非局所性) R=${r.RT}: χ=${ex(r.chi)}・|a_I|=${ex(r.aI)}`
    + `・|g_N|=${ex(r.gN)}・**|a_I|/|g_N|=${ex(r.ratio)}**・|Δv_E6 除去|/dt=${ex(r.aE6)}`);

  // (2) 反作用の P/L 恒等(**非頂点**の試験粒子リングへ当てる —— "pair" と "reservoir" を比べる)
  R.react = await pg.evaluate(() => {
    const W = window.__w257, rows = [];
    const ring = [];
    for (let k = 0; k < 8; k++) {
      const th = 2 * Math.PI * k / 8, r = 900;
      ring.push({ type: 'single', m: 0.5, x: r * Math.cos(th), y: r * Math.sin(th),
        vx: -0.026 * Math.sin(th), vy: 0.026 * Math.cos(th), spin: 0, pinned: false });
    }
    for (const c of [{ k: 'OFF(リングのみ)', sm: null },
      { k: 'coordinate 非頂点・反作用 pair(既定)', sm: { inertia: 'coordinate' } },
      { k: 'coordinate 非頂点・反作用 reservoir', sm: { inertia: 'coordinate', inertiaReaction: 'reservoir' } }]) {
      const pd = { spaceMesh: c.sm };
      const meta = W.build('spaceMeshBinaryToy', pd);
      if (meta.err) { rows.push({ k: c.k, err: meta.err }); continue; }
      // リングを足して build し直す
      const m2 = W.build('spaceMeshBinaryToy', { spaceMesh: c.sm, extraBody: ring[0] });
      const S0 = HP.sim;
      // 8 個まとめて足すため build をやり直す(extraBody は 1 個なので bodies 差し替えで)
      const P = HP.allPresets().find((q) => q.id === 'spaceMeshBinaryToy');
      const q = JSON.parse(JSON.stringify(P));
      if (c.sm) q.physics.spaceMesh = Object.assign({ mode: 'vertex' }, q.physics.spaceMesh || {}, c.sm);
      q.bodies = q.bodies.concat(ring);
      const v = HP.validatePreset(q);
      if (!v.ok) { rows.push({ k: c.k, err: (v.errors || []).join('|') }); continue; }
      const S = HP.sim; S.build(v.preset);
      const T0 = S.totals();
      for (let k = 0; k < 3000; k++) S.step(0.004);
      const T = S.totals();
      const pScale = Math.abs(T.px) + Math.abs(T.py) + S.n * 0.5 * 0.03;
      rows.push({ k: c.k, n: S.n,
        dPraw: Math.hypot(T.px - T0.px, T.py - T0.py), dLraw: T.L - T0.L, Labs: Math.abs(T0.L) || 1,
        dPres: Math.hypot(T.px - T0.px + S.resPx, T.py - T0.py + S.resPy),
        dLres: (T.L - T0.L) + S.resL, pScale,
        mcE: S.meshCoordE, mcEm: S.meshCoordEmesh, mcP: Math.hypot(S.meshCoordPx, S.meshCoordPy),
        mcL: S.meshCoordL, mcN: S.meshCoordN, mcChi: S.meshCoordChi, mcClamp: S.meshCoordClamp,
        stop: S.meshCoordStop, src: S.meshCoordSrc, nan: S.hasNaN(),
        clamp: S.clampVN + S.clampSN + S.clampRN + S.clampTN + S.clampAN });
    }
    return rows;
  });
  for (const r of R.react) console.error(`CHI(反作用) [${r.k}] n=${r.n}: **粒子系だけの ΔP=${ex(r.dPraw)}**`
    + `(|p|尺度 ${ex(r.pScale)})・ΔL=${ex(r.dLraw)}(|L|≈${ex(r.Labs)})`
    + ` / +リザーバ ΔP=${ex(r.dPres)}・ΔL=${ex(r.dLres)}`
    + ` / mc{E=${ex(r.mcE)},E_mesh=${ex(r.mcEm)},|P|=${ex(r.mcP)},L=${ex(r.mcL)},N=${r.mcN},χ=${ex(r.mcChi)}}`
    + `・NaN=${r.nan}・クランプ ${r.clamp}/${r.mcClamp}`);

  // (3) 頂点へ当てた場合(inertiaVertices)の軌道(🪟・dt=0.004・t=5200・4 近点窓 — 第255便a と同窓)
  R.vertex = [];
  const PWk = 518.8544;
  for (const c of [{ k: 'OFF', sm: null }, { k: 'coordinate 非頂点のみ(既定)', sm: { inertia: 'coordinate' } },
    { k: 'coordinate 頂点へ η=1', sm: { inertia: 'coordinate', inertiaVertices: true } },
    { k: 'coordinate 頂点へ η=0.5', sm: { inertia: 'coordinate', inertiaVertices: true, inertiaGain: 0.5 } },
    { k: 'coordinate 頂点へ η=0.25', sm: { inertia: 'coordinate', inertiaVertices: true, inertiaGain: 0.25 } }]) {
    const z = await pg.evaluate(([sm, PWk]) => {
      const W = window.__w257;
      const meta = W.build('spaceMeshBinaryToy', { spaceMesh: sm });
      if (meta.err) return { err: meta.err };
      const o = W.win(0.004, 5200, PWk, 4);
      o.meta = meta; return o;
    }, [c.sm, PWk]);
    R.vertex.push({ k: c.k, P: z.A && z.A.perMean, adv: z.A && z.A.slopeDeg, e: z.eProxy,
      nPeri: z.A && z.A.nPeri, clamp: z.clampD, nan: z.nan, lRel: z.lRel, pRel: z.pRel, mc: z.mc });
    console.error(`CHI(頂点) [${c.k}] 近点間 P=${fx(z.A && z.A.perMean, 4)}・Δϖ=${fx(z.A && z.A.slopeDeg, 8)}°/周`
      + `・e=${fx(z.eProxy, 6)}・近点 ${z.A && z.A.nPeri}・クランプ ${z.clampD}・ΔP/|p| ${ex(z.pRel)}・ΔL/|L| ${ex(z.lRel)}`
      + `・mc{E=${ex(z.mc.E)},L=${ex(z.mc.L)},χ=${ex(z.mc.chi)},N=${z.mc.N}}`);
  }
  out.chi = R;
}

// ================================================================ feta: ⚡ の (f, η) 交差
if (want('feta')) {
  const s = SYS.psrDoubleABDFM;
  const FS = FAST ? [1.0, 1.5, 2.0] : [0.9, 1.0, 1.2, 1.4, 1.6, 1.8, 2.0, 2.1];
  const ETAS = FAST ? [0, 0.5, 1] : [0, 0.25, 0.5, 0.75, 1];
  const DTS = FAST ? [DT0] : [DT0, DT0 / 2];
  out.feta = (prev.feta || []).filter(() => false);
  for (const dt of DTS) for (const f of FS) for (const eta of ETAS) {
    const t0 = Date.now();
    const opt = { fMass: f, spaceMesh: { inertia: 'coordinate', inertiaGain: eta, inertiaVertices: true } };
    const r = await pg.evaluate(([id, opt, dt, orbits, Pu]) => window.__w257.run(id, opt, dt, orbits, Pu),
      ['psrDoubleABDFM', opt, dt, ORBITS, s.Pu]);
    const row = { f, eta, dt,
      advA: r.A && r.A.slopeDeg, advB: r.B && r.B.slopeDeg,
      unmeasured: !!(r.A && r.A.unmeasured), nPeri: r.A && r.A.nPeri,
      perSecA: (r.A && r.A.perMean !== null) ? r.A.perMean * s.Tunit : null,
      perResidPct: (r.A && r.A.perMean !== null) ? (r.A.perMean * s.Tunit / s.PobsS - 1) * 100 : null,
      ratioObsA: (r.A && r.A.slopeDeg !== null) ? r.A.slopeDeg / s.obsDegPerOrbit : null,
      eProxy: r.eProxy, nan: r.nan, clampD: r.clampD, lRel: r.lRel, pRel: r.pRel,
      mc: r.mc, wallSec: (Date.now() - t0) / 1000 };
    out.feta.push(row);
    console.error(`FETA f=${f} η=${eta} dt=${dt}: P=${fx(row.perSecA, 3)} s(${fx(row.perResidPct, 4)}%)`
      + ` Δϖ=${fx(row.advA, 8)}(比 ${fx(row.ratioObsA, 5)}) e=${fx(row.eProxy, 6)} 近点 ${row.nPeri}`
      + ` NaN=${row.nan} クランプ ${row.clampD} [${fx(row.wallSec, 1)}s]`);
    fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
  }
}

// ================================================================ hold: hold-out(🧮🩺🧶)
if (want('hold')) {
  // 交差点(または「最接近点」)は環境変数で渡す: W257_FETA='[{"f":1,"eta":0,"dt":0.016,"why":"..."}]'
  const pts = process.env.W257_FETA ? JSON.parse(process.env.W257_FETA) : (out.holdPoints || []);
  out.holdPoints = pts;
  out.hold = [];
  for (const q of pts) for (const id of ['psrJ1757DFM', 'psrJ1946DFM', 'psrB1534DFM']) {
    const s = SYS[id], t0 = Date.now();
    const opt = { fMass: q.f, spaceMesh: { inertia: 'coordinate', inertiaGain: q.eta, inertiaVertices: true } };
    const r = await pg.evaluate(([id, opt, dt, orbits, Pu]) => window.__w257.run(id, opt, dt, orbits, Pu),
      [id, opt, q.dt || DT0, ORBITS, s.Pu]);
    const row = { id, emoji: s.emoji, f: q.f, eta: q.eta, dt: q.dt || DT0, why: q.why || null,
      advA: r.A && r.A.slopeDeg, unmeasured: !!(r.A && r.A.unmeasured), nPeri: r.A && r.A.nPeri,
      perSecA: (r.A && r.A.perMean !== null) ? r.A.perMean * s.Tunit : null,
      perResidPct: (r.A && r.A.perMean !== null) ? (r.A.perMean * s.Tunit / s.PobsS - 1) * 100 : null,
      ratioObsA: (r.A && r.A.slopeDeg !== null) ? r.A.slopeDeg / s.obsDegPerOrbit : null,
      sigmaP: (s.PobsSigmaS && r.A && r.A.perMean !== null) ? (r.A.perMean * s.Tunit - s.PobsS) / s.PobsSigmaS : null,
      sigmaAdv: (s.obsDegPerOrbitSigma && r.A && r.A.slopeDeg !== null)
        ? (r.A.slopeDeg - s.obsDegPerOrbit) / s.obsDegPerOrbitSigma : null,
      eProxy: r.eProxy, nan: r.nan, clampD: r.clampD, wallSec: (Date.now() - t0) / 1000 };
    out.hold.push(row);
    console.error(`HOLD ${s.emoji} f=${q.f} η=${q.eta}: P=${fx(row.perSecA, 3)} s(${fx(row.perResidPct, 4)}%・`
      + `${ex(row.sigmaP)}σ) Δϖ 比 ${fx(row.ratioObsA, 5)}(${ex(row.sigmaAdv)}σ) e=${fx(row.eProxy, 6)}`
      + ` 近点 ${row.nPeri} [${fx(row.wallSec, 1)}s]`);
    fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
  }
}

// ================================================================ pnfix: 演算順修正と ③′ 統一の前後
if (want('pnfix')) {
  const R = { note: '第256便a の公表値(修正前)は docs/PHYSICS.md〔第256便a〕③④ から転記。本節は修正後の再測である。' };
  const s = SYS.psrDoubleABDFM;
  // ① ⚡ f=1・pairPN(第256便a ③ の欄)
  const dt4 = DT0 / 4;
  for (const c of [{ k: 'f=1・pairPN', f: 1, sm: { weave: 'pairPN' } },
    { k: '本体(f≈2)・weave off', f: null, sm: null }]) {
    const t0 = Date.now();
    const opt = { spaceMesh: c.sm };
    if (c.f !== null) opt.fMass = c.f;
    const r = await pg.evaluate(([id, opt, dt, orbits, Pu]) => window.__w257.run(id, opt, dt, orbits, Pu),
      ['psrDoubleABDFM', opt, dt4, ORBITS, s.Pu]);
    const row = { k: c.k, dt: dt4, advA: r.A && r.A.slopeDeg,
      perSecA: (r.A && r.A.perMean !== null) ? r.A.perMean * s.Tunit : null,
      perResidPct: (r.A && r.A.perMean !== null) ? (r.A.perMean * s.Tunit / s.PobsS - 1) * 100 : null,
      ratioObsA: (r.A && r.A.slopeDeg !== null) ? r.A.slopeDeg / s.obsDegPerOrbit : null,
      eProxy: r.eProxy, nPeri: r.A && r.A.nPeri, nan: r.nan, clampD: r.clampD,
      weave: r.weave, wallSec: (Date.now() - t0) / 1000 };
    (R.zap = R.zap || []).push(row);
    console.error(`PNFIX ⚡ [${c.k}] dt=h/4: P=${fx(row.perSecA, 3)} s(${fx(row.perResidPct, 4)}%)`
      + ` Δϖ=${fx(row.advA, 8)}(比 ${fx(row.ratioObsA, 5)}) e=${fx(row.eProxy, 6)}`
      + ` weave{clamp=${row.weave.clamp},trDv=${ex(row.weave.trDv)},pnDv=${ex(row.weave.pnDv)}} [${fx(row.wallSec, 1)}s]`);
  }
  // ② 🪟 の D0pull 5 段(第255便a ③ の表 —— `"pair"` の ③′ 統一の前後)
  R.win = [];
  const PWk = 518.8544;
  for (const d0 of [0, 1e-4, 1e-2, 1, 1e3]) for (const wv of [null, 'pair']) {
    const z = await pg.evaluate(([d0, wv, PWk]) => {
      const W = window.__w257;
      const meta = W.build('spaceMeshBinaryToy', { physics: { D0pull: d0 }, spaceMesh: wv ? { weave: wv } : null });
      if (meta.err) return { err: meta.err };
      const o = W.win(0.004, 5200, PWk, 4);
      o.meta = meta; return o;
    }, [d0, wv, PWk]);
    const row = { d0, weave: wv || 'off', P: z.A && z.A.perMean, adv: z.A && z.A.slopeDeg,
      nPeri: z.A && z.A.nPeri, clamp: z.clampD, wClamp: z.weave && z.weave.clamp,
      wChi: z.weave && z.weave.chi, wRel: z.weave && z.weave.stop, nan: z.nan };
    R.win.push(row);
    console.error(`PNFIX 🪟 D0pull=${d0} weave=${row.weave}: P=${fx(row.P, 6)}・Δϖ=${fx(row.adv, 8)}°/周`
      + `・近点 ${row.nPeri}・クランプ ${row.clamp}/${row.wClamp}・χ=${ex(row.wChi)}`);
  }
  out.pnfix = R;
}

out.pageErrors = pageErrors;
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.error(`\n出力: ${path.relative(ROOT, OUT)} / pageErrors ${pageErrors.length}`);
await browser.close();
