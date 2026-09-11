// 第256便a W1「連星 —— geoPN=2 への織り込み(weave:"pairPN")と『質量補正が不要になり近点移動も解決する』仮説の実測」(第48報)。
//
// 原仮定者(第48報): 「中性子星連星までの現実較正を、近点移動込みで完了させる。この時点で、一旦Releaseする」
// 統括からの補足(原仮定者の私信): 「空間メッシュで質量補正が不用になり、近点移動も解決すると考えている」。
//   —— これは**仮説**である。本器は**それを実測して裁定する**。立っても立たなくてもそのまま数で書く(Failure First)。
//
// ■ 節(すべて実測。予想は 1 つも書かない。⚡🧶❄️ の本体 JSON は 1 bit も触らない —— 診断コピー上の宣言差し替えだけ)
//   PW  : pairPN の契約。未宣言 1 bit 不変・pair は geoPN=2 で停止のまま・pairPN の決定性・χ→0 で OFF へ・帳簿(E/P/L)。
//   A0  : ⚡🧶 で (i)OFF / (ii)pairPN λ_PN=0(= A0 だけ)/ (iii)pairPN λ_PN=1 / (iv)pairPNFull を
//         同一窓(20 近点・dt 3 段・検出器 A/B)で並べる。**A0 と PN 応答を分けて**出す(Δϖ=A0+λ_PN·A_PN)。
//   D0  : D0pull 5 段(0/1e−4/1e−2/1/1e3)の近点間 P・Δϖ・クランプ・NaN(⚡ の診断コピー)。
//   HYP : **本便の核心**。4 系(⚡🧮🩺🧶)× 4 欄
//           ① 本体(f≈2・weave off) ② f=1(massCalibration を外す)・weave off
//           ③ f=1・pairPN          ④ f=1・pairPN+reservoir
//         の近点間 P と Δϖ を観測値と比べる(20 近点窓・dt 3 段・検出器 A/B・観測 σ つき)。
//   SNOW: ❄️(geoPN=0)へ weave:"pair" を当てる 1 走行。kF0/kF1/weave の 3 欄+共通ブースト V=0/1×v_rel。
//   ROT : dfmMeshRotorExchange の dt<0→null(前進専用)と dfmMeshRotorDesign の往復・dfmMeshWeaveBlend の恒等。
//   TB  : 連星+小質量第三体での連続性(χ の分母は他天体を含む = 純粋二体則ではない)。
//
// 実行: node tests/exp-w256a-weavepn.mjs [--pw] [--a0] [--d0] [--hyp] [--snow] [--rot] [--tb] [--fast]
// 出力: tests/out/weavepn-w256.json(数値は docs/PHYSICS.md〔第256便a〕へ全載)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + path.join(ROOT, TARGET);
const OUT = path.join(ROOT, 'tests', 'out', 'weavepn-w256.json');
const argv = process.argv.slice(2);
const FAST = argv.includes('--fast');
const SYS_ONLY = (() => { const i = argv.indexOf('--sys'); return (i >= 0 && argv[i + 1]) ? argv[i + 1].split(',') : null; })();
const NDT = (() => { const i = argv.indexOf('--dts'); return (i >= 0 && argv[i + 1]) ? Number(argv[i + 1]) : 3; })();
const only = argv.filter((a) => a.startsWith('--') && a !== '--fast').map((a) => a.slice(2));
const want = (k) => !only.length || only.includes(k);
const fx = (z, d = 6) => (z === null || z === undefined || !Number.isFinite(z)) ? '—' : Number(z).toFixed(d);
const ex = (z, d = 4) => (z === null || z === undefined || !Number.isFinite(z)) ? '—' : Number(z).toExponential(d);

const DT0 = 0.016, NWIN = 20, YR = 365.25 * 86400;
const ORBITS = FAST ? 6.5 : 21.5;
const DTLIST = [DT0, DT0 / 2, DT0 / 4].slice(0, Math.max(1, Math.min(3, NDT)));

// ---------------------------------------------------------------- 観測(CSV が正本 — 第255便d と同規約)
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
    m.set(key, { v: Number(cols[2]), unit: cols[3], source: cols[4], sigma: cols[8] });
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
  const P = CSV.get(s.body + '|orbital_period'), e = CSV.get(s.body + '|eccentricity');
  const w = CSV.get(s.body + '|periastron_advance');
  s.PobsS = (P && P.unit === 's') ? P.v : (P ? P.v * 86400 : null);
  s.PobsSigmaS = (P && P.sigma && P.sigma.trim() !== '')
    ? (P.unit === 's' ? Number(P.sigma) : Number(P.sigma) * 86400) : null;
  s.eObs = e ? e.v : null;
  s.eObsSigma = (e && e.sigma && e.sigma.trim() !== '') ? Number(e.sigma) : null;
  s.omegaDot = w ? w.v : s.omegaDotFallback;
  s.omegaDotSigma = (w && w.sigma && w.sigma.trim() !== '') ? Number(w.sigma) : null;
  s.obsDegPerOrbit = (s.omegaDot !== undefined && s.PobsS) ? s.omegaDot * s.PobsS / YR : null;
  s.obsDegPerOrbitSigma = (s.omegaDotSigma !== null && s.PobsS) ? s.omegaDotSigma * s.PobsS / YR : null;
  s.Pu = s.PobsS / s.Tunit;
}

// ================================================================ ブラウザ
let browser;
try { const { chromium } = await import('playwright'); browser = await chromium.launch(); }
catch {
  const { chromium } = await import('playwright');
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
}
const pg = await browser.newPage();
const pageErrors = [];
pg.on('pageerror', (e) => pageErrors.push(String(e)));
await pg.goto(INDEX, { waitUntil: 'load' });
await pg.waitForFunction(() => window.HP && HP.sim);

// ---------------------------------------------------------------- ページ側の測定ライブラリ
// 近点検出器 A/B・柵・直線 fit は第252便b/第254便d/第255便d と**同一手続き**(窓は引数)。
await pg.evaluate(() => {
  const W = (window.__w256 = {});
  // 宣言だけを差し替えて build する。massCal:"drop" は台帳を外すだけ・"f1" は m を baseMass へ戻す
  W.build = (id, o) => {
    const opt = o || {};
    const pd = JSON.parse(JSON.stringify(HP.allPresets().find((q) => q.id === id)));
    if (opt.physics) for (const k of Object.keys(opt.physics)) {
      if (opt.physics[k] === '__delete') delete pd.physics[k]; else pd.physics[k] = opt.physics[k];
    }
    if (opt.spaceMesh === null) delete pd.physics.spaceMesh;
    else if (opt.spaceMesh) pd.physics.spaceMesh = Object.assign({ mode: 'vertex' }, pd.physics.spaceMesh || {}, opt.spaceMesh);
    let f1 = null;
    if (opt.f1 && pd.massCalibration && Array.isArray(pd.massCalibration.baseMass)) {
      f1 = pd.massCalibration.baseMass.slice();
      for (let i = 0; i < f1.length && i < pd.bodies.length; i++) pd.bodies[i].m = f1[i];
    }
    if (opt.boost) for (const b of pd.bodies) { b.vx = (b.vx || 0) + opt.boost[0]; b.vy = (b.vy || 0) + opt.boost[1]; }
    if (opt.extraBody) pd.bodies.push(opt.extraBody);
    delete pd.massCalibration;   // 台帳の三者一致検査を実験へ持ち込まない(第249便a と同じ)
    const v = HP.validatePreset(pd);
    if (!v.ok) return { err: (v.errors || []).join('|') };
    HP.sim.build(v.preset);
    return { ok: true, sig: JSON.stringify(v.preset.physics), f1,
      m: [HP.sim.m[0], HP.sim.m[1]], n: HP.sim.n,
      weave: (v.preset.physics.spaceMesh && v.preset.physics.spaceMesh.weave) || null };
  };
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
    const slope = sxy / sxx;
    return Object.assign(base, { nPeri: n, unmeasured: false, slopeDeg: slope * 180 / Math.PI,
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
    const gg = S.params.G, e2 = S.params.softening * S.params.softening;
    const emech = () => { const dx = S.x[1] - S.x[0], dy = S.y[1] - S.y[0];
      return 0.5 * S.m[0] * (S.vx[0] ** 2 + S.vy[0] ** 2) + 0.5 * S.m[1] * (S.vx[1] ** 2 + S.vy[1] ** 2)
        - gg * S.m[0] * S.m[1] / Math.sqrt(dx * dx + dy * dy + e2); };
    const E0 = emech();
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
      dE: emech() - E0,
      weave: { E: S.spaceMeshWeaveE, L: S.spaceMeshWeaveL, Px: S.spaceMeshWeavePx, Py: S.spaceMeshWeavePy,
        chi: S.spaceMeshWeaveChi, rel: S.spaceMeshWeaveRel, clamp: S.spaceMeshWeaveClamp,
        stop: S.spaceMeshWeaveStop, mode: S.spaceMeshWeaveMode, trDv: S.spaceMeshWeaveTrDv, pnDv: S.spaceMeshWeavePNDv },
      rotor: { J: S.meshJ, Q: S.meshQ, L: S.meshRotorL, stop: S.meshRotorStop },
      state: [S.x[0], S.y[0], S.vx[0], S.vy[0], S.x[1], S.y[1], S.vx[1], S.vy[1]] };
  };
  W.run = (id, opt, dt, orbits, Pu) => {
    const meta = W.build(id, opt);
    if (meta.err) return { err: meta.err };
    const o = W.win(dt, orbits * Pu, Pu, opt && opt.nWin || 20);
    o.meta = meta;
    return o;
  };
  // 短い走行(契約の確認用)
  W.short = (id, opt, dt, steps) => {
    const meta = W.build(id, opt);
    if (meta.err) return { err: meta.err };
    const S = HP.sim;
    const T0 = S.totals();
    for (let k = 0; k < steps; k++) S.step(dt);
    const T = S.totals();
    return { sig: meta.sig, has: S.hasPairWeave, weaveMode: S.spaceMeshWeaveMode,
      st: [S.x[0], S.y[0], S.vx[0], S.vy[0], S.x[1], S.y[1], S.vx[1], S.vy[1]],
      r: Math.hypot(S.x[1] - S.x[0], S.y[1] - S.y[0]), nan: S.hasNaN(),
      clamp: S.clampVN + S.clampSN + S.clampRN + S.clampTN + S.clampAN,
      wE: S.spaceMeshWeaveE, wL: S.spaceMeshWeaveL, wPx: S.spaceMeshWeavePx, wPy: S.spaceMeshWeavePy,
      wChi: S.spaceMeshWeaveChi, wRel: S.spaceMeshWeaveRel, wClamp: S.spaceMeshWeaveClamp,
      wStop: S.spaceMeshWeaveStop, trDv: S.spaceMeshWeaveTrDv, pnDv: S.spaceMeshWeavePNDv,
      closePx: (T.px - T0.px) + S.resPx, closePy: (T.py - T0.py) + S.resPy,
      closeL: (T.L - T0.L) + S.resL, Labs: Math.abs(T.L) || 1 };
  };
});

let prev = {};
if (fs.existsSync(OUT)) { try { prev = JSON.parse(fs.readFileSync(OUT, 'utf8')) || {}; } catch { prev = {}; } }
const out = { ...prev, wave: '第256便a', target: TARGET, node: process.version, at: new Date().toISOString(),
  window: { nPeri: NWIN, dt0: DT0, orbits: ORBITS }, obs: SYS, fast: FAST };

// ================================================================ PW: pairPN の契約
if (want('pw')) {
  out.pw = await pg.evaluate(() => {
    const W = window.__w256, R = {}, ID = 'psrDoubleABDFM', N = 2000, DT = 0.016;
    const base = W.short(ID, { spaceMesh: null }, DT, N);
    const declOff = W.short(ID, { spaceMesh: { weave: 'off' } }, DT, N);
    R.offBit = { sigSame: base.sig === declOff.sig, stateSame: base.st.every((z, i) => Object.is(z, declOff.st[i])),
      flag: base.has === false };
    const pair = W.short(ID, { spaceMesh: { weave: 'pair' } }, DT, N);
    R.pairStop = { stop: pair.wStop, bitSame: pair.st.every((z, i) => Object.is(z, base.st[i])), has: pair.has };
    const pn = W.short(ID, { spaceMesh: { weave: 'pairPN' } }, DT, N);
    const pnF = W.short(ID, { spaceMesh: { weave: 'pairPNFull' } }, DT, N);
    R.pn = pn; R.pnFull = pnF; R.off = base;
    R.diff = { pn: Math.max(...pn.st.map((z, i) => Math.abs(z - base.st[i]))),
      pnFull: Math.max(...pnF.st.map((z, i) => Math.abs(z - base.st[i]))) };
    // kFrame=0
    const k0 = W.short(ID, { physics: { kFrame: 0 }, spaceMesh: null }, DT, N);
    const k1 = W.short(ID, { physics: { kFrame: 0 }, spaceMesh: { weave: 'pairPN' } }, DT, N);
    R.kf0 = { same: k1.st.every((z, i) => Object.is(z, k0.st[i])), stop: k1.wStop };
    // geoPN=0 の帯では pairPN が停止(pair の鏡)
    const g0 = W.short('spaceMeshBinaryToy', { spaceMesh: { weave: 'pairPN' } }, 0.004, 1000);
    const g0off = W.short('spaceMeshBinaryToy', { spaceMesh: { weave: 'off' } }, 0.004, 1000);
    R.geo0 = { stop: g0.wStop, same: g0.st.every((z, i) => Object.is(z, g0off.st[i])) };
    // χ→0
    const z0 = W.short(ID, { physics: { D0pull: 1e12 }, spaceMesh: null }, DT, N);
    const z1 = W.short(ID, { physics: { D0pull: 1e12 }, spaceMesh: { weave: 'pairPN' } }, DT, N);
    R.chiZero = { chi: z1.wChi, wE: z1.wE, wP: Math.hypot(z1.wPx, z1.wPy),
      maxDiff: Math.max(...z1.st.map((v, i) => Math.abs(v - z0.st[i]))), scale: Math.hypot(z0.st[0], z0.st[1]) };
    // 決定性・門
    const dA = W.short(ID, { spaceMesh: { weave: 'pairPN' } }, DT, 400);
    const dB = W.short(ID, { spaceMesh: { weave: 'pairPN' } }, DT, 400);
    R.det = dA.st.every((z, i) => Object.is(z, dB.st[i]));
    const P = HP.allPresets().find((z) => z.id === ID);
    const mkq = (sm) => { const q = JSON.parse(JSON.stringify(P)); q.physics.spaceMesh = Object.assign({ mode: 'vertex' }, sm); delete q.massCalibration; return q; };
    R.gates = [HP.validatePreset(mkq({ weave: 'pairXX' })).ok, HP.validatePreset(mkq({ weave: 'pn' })).ok].every((z) => z === false);
    R.accepted = [HP.validatePreset(mkq({ weave: 'pairPN' })).ok, HP.validatePreset(mkq({ weave: 'pairPNFull' })).ok].every((z) => z === true);
    // 未宣言 1 bit 不変(全内蔵の代表 — 署名に spaceMesh が 1 文字も出ない)
    R.noKeyInSig = !JSON.stringify(HP.validatePreset(JSON.parse(JSON.stringify(P))).preset.physics).includes('spaceMesh');
    return R;
  });
  const P = out.pw;
  console.error(`PW ① 未宣言 1 bit 不変: 署名 ${P.offBit.sigSame}・状態 ${P.offBit.stateSame}・flag ${P.offBit.flag}`
    + ` / 本体署名に spaceMesh 無し ${P.noKeyInSig}`);
  console.error(`PW ② pair は geoPN=2 で停止のまま: stop="${P.pairStop.stop}"・OFF とビット同一 ${P.pairStop.bitSame}`
    + ` / geoPN=0 で pairPN が停止: stop="${P.geo0.stop}"・ビット同一 ${P.geo0.same}`);
  console.error(`PW ③ pairPN: r=${fx(P.pn.r, 5)}(OFF ${fx(P.off.r, 5)})・NaN=${P.pn.nan}・クランプ ${P.pn.clamp}/${P.pn.wClamp}`
    + `・χ=${fx(P.pn.wChi, 8)}・|v−u_pair|=${ex(P.pn.wRel)}・仕事=${ex(P.pn.wE)}`
    + `・輸送 |Δv|=${ex(P.pn.trDv)}・1PN |Δv|=${ex(P.pn.pnDv)}`);
  console.error(`PW ③' pairPNFull(否定対照): r=${fx(P.pnFull.r, 5)}・クランプ ${P.pnFull.clamp}/${P.pnFull.wClamp}`
    + `・仕事=${ex(P.pnFull.wE)}・輸送 |Δv|=${ex(P.pnFull.trDv)}`);
  console.error(`PW ④ 帳簿: ΔP+リザーバ=(${ex(P.pn.closePx)},${ex(P.pn.closePy)})・ΔL+リザーバ=${ex(P.pn.closeL)}`
    + `(|L|≈${ex(P.pn.Labs)})`);
  console.error(`PW ⑤ kFrame=0 ビット同一 ${P.kf0.same}(stop="${P.kf0.stop}") / χ→0: χ=${ex(P.chiZero.chi)}`
    + `・仕事 ${ex(P.chiZero.wE)}・状態差 ${ex(P.chiZero.maxDiff)} / 決定性 ${P.det} / 門 ${P.gates}・受理 ${P.accepted}`);
}

// ================================================================ A0: A0 と PN 応答の分離(⚡🧶)
if (want('a0')) {
  const DTS = FAST ? [DT0, DT0 / 2] : DTLIST;
  const COLS = [
    { key: 'off', label: 'OFF(本体の力則)', opt: { spaceMesh: null } },
    { key: 'pn0', label: 'pairPN・λ_PN=0(A0 だけ)', opt: { physics: { lambdaPN: 0 }, spaceMesh: { weave: 'pairPN' } } },
    { key: 'off0', label: 'OFF・λ_PN=0(A0 の対照)', opt: { physics: { lambdaPN: 0 }, spaceMesh: null } },
    { key: 'pn1', label: 'pairPN・λ_PN=1', opt: { spaceMesh: { weave: 'pairPN' } } },
    { key: 'pnF', label: 'pairPNFull(否定対照)', opt: { spaceMesh: { weave: 'pairPNFull' } } },
  ];
  out.a0 = (prev.a0 || []).filter((z) => !(SYS_ONLY || ['psrDoubleABDFM', 'psrB1534DFM']).includes(z.id));
  for (const id of (SYS_ONLY || ['psrDoubleABDFM', 'psrB1534DFM'])) {
    const s = SYS[id];
    for (const c of COLS) for (const dt of DTS) {
      const t0 = Date.now();
      const r = await pg.evaluate(([id, opt, dt, orbits, Pu]) => window.__w256.run(id, opt, dt, orbits, Pu),
        [id, c.opt, dt, ORBITS, s.Pu]);
      const row = { id, emoji: s.emoji, col: c.key, label: c.label, dt,
        advA: r.A && r.A.slopeDeg, advB: r.B && r.B.slopeDeg,
        perSecA: r.A && r.A.perMean !== null ? r.A.perMean * s.Tunit : null,
        perResidPct: r.A && r.A.perMean !== null ? (r.A.perMean * s.Tunit / s.PobsS - 1) * 100 : null,
        ratioObsA: r.A && r.A.slopeDeg !== null ? r.A.slopeDeg / s.obsDegPerOrbit : null,
        eProxy: r.eProxy, candA: r.A && r.A.cand, dupA: r.A && r.A.rej.dup,
        nan: r.nan, clampD: r.clampD, lRel: r.lRel, pRel: r.pRel, dE: r.dE,
        weave: r.weave, wallSec: (Date.now() - t0) / 1000 };
      out.a0.push(row);
      console.error(`A0 ${s.emoji} [${c.key}] dt=${dt}: Δϖ(A)=${fx(row.advA, 8)} Δϖ(B)=${fx(row.advB, 8)} `
        + `比=${fx(row.ratioObsA, 5)} P=${fx(row.perSecA, 3)}s(${fx(row.perResidPct, 4)}%) e=${fx(r.eProxy, 7)} `
        + `NaN=${r.nan} クランプ=${r.clampD}/${r.weave.clamp} stop=${r.weave.stop} [${row.wallSec.toFixed(1)}s]`);
    }
  }
}

// ================================================================ D0: D0pull 5 段(⚡ の診断コピー)
if (want('d0')) {
  out.d0 = [];
  const orb = FAST ? 3.5 : 8.5, nWin = FAST ? 3 : 8;
  for (const D0pull of [0, 1e-4, 1e-2, 1, 1e3]) {
    const s = SYS.psrDoubleABDFM;
    const offR = await pg.evaluate(([d, orbits, Pu, nWin]) => window.__w256.run('psrDoubleABDFM',
      { physics: { D0pull: d }, spaceMesh: null, nWin }, 0.016, orbits, Pu), [D0pull, orb, s.Pu, nWin]);
    const onR = await pg.evaluate(([d, orbits, Pu, nWin]) => window.__w256.run('psrDoubleABDFM',
      { physics: { D0pull: d }, spaceMesh: { weave: 'pairPN' }, nWin }, 0.016, orbits, Pu), [D0pull, orb, s.Pu, nWin]);
    const row = { D0pull, chi: onR.weave.chi,
      offP: offR.A.perMean, offAdv: offR.A.slopeDeg, offClamp: offR.clampD,
      onP: onR.A.perMean, onAdv: onR.A.slopeDeg, onClamp: onR.clampD, weaveClamp: onR.weave.clamp,
      dP: (onR.A.perMean !== null && offR.A.perMean !== null) ? onR.A.perMean - offR.A.perMean : null,
      dAdv: (onR.A.slopeDeg !== null && offR.A.slopeDeg !== null) ? onR.A.slopeDeg - offR.A.slopeDeg : null,
      rel: onR.weave.rel, weaveE: onR.weave.E, nan: onR.nan, nWin,
      offN: offR.A.nPeri, onN: onR.A.nPeri };
    out.d0.push(row);
    console.error(`D0 D0pull=${D0pull}: χ=${ex(row.chi)} OFF P=${fx(row.offP, 4)} Δϖ=${fx(row.offAdv, 8)} / `
      + `pairPN P=${fx(row.onP, 4)} Δϖ=${fx(row.onAdv, 8)} — ΔP=${fx(row.dP, 4)} Δ(Δϖ)=${ex(row.dAdv)} `
      + `クランプ ${row.offClamp}/${row.onClamp}(weave ${row.weaveClamp}) |v−u_pair|=${ex(row.rel)}`);
  }
}

// ================================================================ HYP: 仮説の実測(本便の核心)
if (want('hyp')) {
  const DTS = FAST ? [DT0, DT0 / 2] : DTLIST;
  const COLS = [
    { key: 'body', label: '本体(f≈2・weave off)', opt: { spaceMesh: null } },
    { key: 'f1', label: 'f=1・weave off', opt: { f1: true, spaceMesh: null } },
    { key: 'f1pn', label: 'f=1・pairPN', opt: { f1: true, spaceMesh: { weave: 'pairPN' } } },
    { key: 'f1pnres', label: 'f=1・pairPN+reservoir', opt: { f1: true, spaceMesh: { weave: 'pairPN', reservoir: { Imesh: 5e5, gamma: 1e3 } } } },
    { key: 'f1kf0', label: 'f=1・kFrame=0(ニュートン対照)', opt: { f1: true, physics: { kFrame: 0 }, spaceMesh: null } },
  ];
  out.hyp = (prev.hyp || []).filter((z) => !(SYS_ONLY || Object.keys(SYS)).includes(z.id));
  for (const id of (SYS_ONLY || Object.keys(SYS))) {
    const s = SYS[id];
    for (const c of COLS) for (const dt of DTS) {
      const t0 = Date.now();
      const r = await pg.evaluate(([id, opt, dt, orbits, Pu]) => window.__w256.run(id, opt, dt, orbits, Pu),
        [id, c.opt, dt, ORBITS, s.Pu]);
      if (r.err) { console.error(`HYP ${s.emoji} [${c.key}] err ${r.err}`); continue; }
      const advA = r.A.slopeDeg, perA = r.A.perMean === null ? null : r.A.perMean * s.Tunit;
      const row = { id, emoji: s.emoji, col: c.key, label: c.label, dt, f1: r.meta.f1, m: r.meta.m,
        advA, advB: r.B.slopeDeg, perSecA: perA,
        perResidPct: perA === null ? null : (perA / s.PobsS - 1) * 100,
        perResidSigma: (perA === null || !s.PobsSigmaS) ? null : (perA - s.PobsS) / s.PobsSigmaS,
        advResidPct: advA === null ? null : (advA / s.obsDegPerOrbit - 1) * 100,
        advResidSigma: (advA === null || !s.obsDegPerOrbitSigma) ? null : (advA - s.obsDegPerOrbit) / s.obsDegPerOrbitSigma,
        ratioObsA: advA === null ? null : advA / s.obsDegPerOrbit,
        eProxy: r.eProxy, eResidPct: s.eObs ? (r.eProxy / s.eObs - 1) * 100 : null,
        nan: r.nan, clampD: r.clampD, lRel: r.lRel, pRel: r.pRel,
        weave: r.weave, rotor: r.rotor, candA: r.A.cand, dupA: r.A.rej.dup,
        wallSec: (Date.now() - t0) / 1000 };
      out.hyp.push(row);
      console.error(`HYP ${s.emoji} [${c.key}] dt=${dt}: P=${fx(perA, 3)}s(${fx(row.perResidPct, 4)}% / `
        + `${row.perResidSigma === null ? '—' : row.perResidSigma.toExponential(3)}σ) Δϖ=${fx(advA, 8)}`
        + `(比 ${fx(row.ratioObsA, 5)} / ${row.advResidSigma === null ? 'σなし' : row.advResidSigma.toExponential(3) + 'σ'}) `
        + `e=${fx(r.eProxy, 7)} NaN=${r.nan} クランプ=${r.clampD}/${r.weave.clamp} [${row.wallSec.toFixed(1)}s]`);
    }
  }
}

// ================================================================ SNOW: ❄️ への weave(geoPN=0 なので "pair" が通る)
if (want('snow')) {
  out.snow = await pg.evaluate((fast) => {
    const R = { rows: [] };
    const S = HP.sim;
    const base = HP.allPresets().find((z) => z.id === 'plutoCharonReal');
    const vrel = Math.hypot((base.bodies[1].vx || 0) - (base.bodies[0].vx || 0),
      (base.bodies[1].vy || 0) - (base.bodies[0].vy || 0));
    // 同方向 1 周(相対角の 2π 交差)。第255便d ⑦ と同じ検出器
    const runP = (opt) => {
      const pd = JSON.parse(JSON.stringify(base));
      if (opt.physics) Object.assign(pd.physics, opt.physics);
      if (opt.spaceMesh) pd.physics.spaceMesh = Object.assign({ mode: 'vertex' }, opt.spaceMesh);
      if (opt.boost) for (const b of pd.bodies) { b.vx = (b.vx || 0) + opt.boost[0]; b.vy = (b.vy || 0) + opt.boost[1]; }
      delete pd.massCalibration;
      const v = HP.validatePreset(pd);
      if (!v.ok) return { err: (v.errors || []).join('|') };
      S.build(v.preset);
      const dt = 0.016;
      const mt = S.m[0] + S.m[1];
      const com = () => [(S.m[0] * S.x[0] + S.m[1] * S.x[1]) / mt, (S.m[0] * S.y[0] + S.m[1] * S.y[1]) / mt];
      const c0 = com();
      let acc = 0, accPrev = 0, thPrev = null, P1 = null, rMin = Infinity, rMax = -Infinity, comMax = 0;
      const maxSteps = Math.round((fast ? 2000 : 12000) / dt);
      for (let k = 0; k < maxSteps; k++) {
        S.step(dt);
        const dx = S.x[1] - S.x[0], dy = S.y[1] - S.y[0];
        const rr = Math.hypot(dx, dy), th = Math.atan2(dy, dx);
        if (rr < rMin) rMin = rr; if (rr > rMax) rMax = rr;
        const cc = com(); const cd = Math.hypot(cc[0] - c0[0], cc[1] - c0[1]); if (cd > comMax) comMax = cd;
        if (thPrev !== null) {
          let d = th - thPrev; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
          accPrev = acc; acc += d;
          if (P1 === null && Math.abs(acc) >= 2 * Math.PI) {
            const tgt = Math.sign(acc) * 2 * Math.PI;
            const fr = (acc !== accPrev) ? (tgt - accPrev) / (acc - accPrev) : 0;
            P1 = (k - 1 + fr) * dt; break;
          }
        }
        thPrev = th;
        if (S.hasNaN()) break;
      }
      return { P: P1, rMin, rMax, swing: (rMax - rMin) / ((rMax + rMin) / 2), comMax,
        chi: S.spaceMeshWeaveChi, wE: S.spaceMeshWeaveE, wStop: S.spaceMeshWeaveStop,
        wClamp: S.spaceMeshWeaveClamp, rel: S.spaceMeshWeaveRel, nan: S.hasNaN() };
    };
    for (const V of [0, 1]) {
      const boost = [0, V * vrel];
      const kf0 = runP({ physics: { kFrame: 0 }, boost });
      const kf1 = runP({ boost });
      const wv = runP({ spaceMesh: { weave: 'pair' }, boost });      // ❄️ は geoPN=2 なので "pair" は停止する
      const wpn = runP({ spaceMesh: { weave: 'pairPN' }, boost });   // geoPN=2 の帯を通るのは "pairPN"
      const exc = (a, b) => (a.P !== null && b.P !== null) ? (a.P / b.P - 1) * 100 : null;
      R.rows.push({ V, vrel, kf0, kf1, weave: wv, weavePN: wpn,
        excessKf1: exc(kf1, kf0), excessWeave: exc(wv, kf0), excessWeavePN: exc(wpn, kf0),
        weaveVsKf1: (wv.P !== null && kf1.P !== null) ? (wv.P / kf1.P - 1) * 100 : null,
        weavePNVsKf1: (wpn.P !== null && kf1.P !== null) ? (wpn.P / kf1.P - 1) * 100 : null });
    }
    return R;
  }, FAST);
  for (const r of out.snow.rows) {
    console.error(`SNOW V=${r.V}×v_rel: kF0 P=${fx(r.kf0.P, 6)} / kF1 P=${fx(r.kf1.P, 6)}(超過 ${fx(r.excessKf1, 5)}%) / `
      + `weave:"pair" P=${fx(r.weave.P, 6)}(超過 ${fx(r.excessWeave, 5)}%・stop=${r.weave.wStop}) / `
      + `weave:"pairPN" P=${fx(r.weavePN.P, 6)}(超過 ${fx(r.excessWeavePN, 5)}%・kF1 比 ${fx(r.weavePNVsKf1, 5)}%) `
      + `χ=${ex(r.weavePN.chi)} stop=${r.weavePN.wStop} クランプ ${r.weavePN.wClamp} `
      + `重心 ${ex(r.kf0.comMax)}/${ex(r.kf1.comMax)}/${ex(r.weavePN.comMax)} 振れ ${ex(r.kf1.swing)}/${ex(r.weavePN.swing)}`);
  }
}

// ================================================================ ROT: 回転子の契約と純関数
if (want('rot')) {
  out.rot = await pg.evaluate(() => {
    const R = {};
    R.neg = [HP.dfmMeshRotorExchange({ L: 10, J: 0, Iorb: 4, Imesh: 2, gamma: 0.3, dt: -0.5 }),
      HP.dfmMeshRotorExchange({ L: 10, J: 0, Iorb: 4, Imesh: 2, gamma: 0.3, dt: -1e-9 })].map((z) => z === null);
    R.zero = HP.dfmMeshRotorExchange({ L: 10, J: 0, Iorb: 4, Imesh: 2, gamma: 0.3, dt: 0 });
    R.pos = HP.dfmMeshRotorExchange({ L: 10, J: 0, Iorb: 4, Imesh: 2, gamma: 0.3, dt: 0.5 });
    const d = HP.dfmMeshRotorDesign({ beta: 0.25, tauSync: 40, mu: 100, rRef: 20, omegaRatio: 0.5, omegaOrb: 0.02 });
    const inv = HP.dfmMeshRotorDesign({ Imesh: d.Imesh, gamma: d.gamma, Iref: d.Iref });
    R.design = d; R.inv = inv;
    R.round = { beta: Math.abs(inv.beta - 0.25), tau: Math.abs(inv.tauSync - 40),
      Imesh: Math.abs(inv.Imesh - d.Imesh), gamma: Math.abs(inv.gamma - d.gamma) };
    R.designGates = [HP.dfmMeshRotorDesign(null), HP.dfmMeshRotorDesign({ beta: 0, tauSync: 1, Iref: 1 }),
      HP.dfmMeshRotorDesign({ beta: 1, tauSync: 0, Iref: 1 }), HP.dfmMeshRotorDesign({ beta: 1, tauSync: 1 }),
      HP.dfmMeshRotorDesign({ beta: 1, tauSync: 1, mu: -1, rRef: 1 })].map((z) => z === null);
    // blend の恒等: u_n=u_bg なら ∇χ 項も χ̇ 項も厳密に消える
    const gen = { chi: 0.63, gradChi: [0.11, -0.27], un: [1.3, -2.1], gradUn: [0.5, -0.2, 0.7, 0.9],
      ubg: [0.4, 0.8], gradUbg: [-0.1, 0.3, 0.2, -0.6], dtUn: [0.05, -0.07], dtUbg: [0.02, 0.03], chiDot: 0.31 };
    const b = HP.dfmMeshWeaveBlend(gen);
    const same = Object.assign({}, gen, { ubg: gen.un.slice(), gradUbg: gen.gradUn.slice(), dtUbg: gen.dtUn.slice() });
    const bs = HP.dfmMeshWeaveBlend(same);
    R.blend = { gen: b, ident: bs,
      identGradExact: bs.gradU.every((z, i) => Object.is(z, gen.gradUn[i])),
      identJumpZero: bs.jump[0] === 0 && bs.jump[1] === 0,
      identGradErr: Math.max(...bs.gradU.map((z, i) => Math.abs(z - gen.gradUn[i]))),
      identUExact: bs.u.every((z, i) => Object.is(z, gen.un[i])),
      identDtExact: bs.dtU.every((z, i) => Object.is(z, gen.dtUn[i])),
      // χ=1 で u_n・∇u_n へ戻る(∇χ 項は un−ubg に掛かるので消えない = 宣言どおり)
      chi1: HP.dfmMeshWeaveBlend(Object.assign({}, gen, { chi: 1, gradChi: [0, 0], chiDot: 0 })),
      // 線形性: χ の 1 次式
      lin: (() => { const a = HP.dfmMeshWeaveBlend(Object.assign({}, gen, { chi: 0 }));
        const c = HP.dfmMeshWeaveBlend(Object.assign({}, gen, { chi: 1 }));
        const h = HP.dfmMeshWeaveBlend(Object.assign({}, gen, { chi: 0.5 }));
        return Math.max(...h.u.map((z, i) => Math.abs(z - 0.5 * (a.u[i] + c.u[i])))); })() };
    R.blendGates = [HP.dfmMeshWeaveBlend(null), HP.dfmMeshWeaveBlend({ chi: NaN, un: [1, 1], gradUn: [0, 0, 0, 0] }),
      HP.dfmMeshWeaveBlend({ chi: 0.5, un: [1], gradUn: [0, 0, 0, 0] }),
      HP.dfmMeshWeaveBlend({ chi: 0.5, un: [1, 1], gradUn: [0, 0, 0] })].map((z) => z === null);
    return R;
  });
  const R = out.rot;
  console.error(`ROT ① dt<0 → null ${JSON.stringify(R.neg)} / dt=0 は dL=${R.zero.dL}・dQ=${R.zero.dQ} / dt>0 は dL=${ex(R.pos.dL)}`);
  console.error(`ROT ② Design: β=0.25・τ=40・I_ref=μr²=${R.design.Iref} → Imesh=${R.design.Imesh}・γ=${R.design.gamma}`
    + `・I_red=${R.design.Ired}・J₀=${R.design.J0}(Ω_m=${R.design.OmegaMesh}) / 往復残差 `
    + `β ${ex(R.round.beta)}・τ ${ex(R.round.tau)} / 門 ${JSON.stringify(R.designGates)}`);
  console.error(`ROT ③ Blend 恒等(u_n=u_bg): ∇χ 項が厳密に 0 ${R.blend.identJumpZero}・u ${R.blend.identUExact}`
    + `・∇u 残差 ${ex(R.blend.identGradErr)}(χg+(1−χ)g の丸めのみ・ビット一致 ${R.blend.identGradExact})・∂ₜu ${R.blend.identDtExact}`
    + ` / χ の 1 次(線形性残差 ${ex(R.blend.lin)}) / 門 ${JSON.stringify(R.blendGates)}`);
}

// ================================================================ TB: 連星+小質量第三体の連続性
if (want('tb')) {
  out.tb = [];
  const s = SYS.psrDoubleABDFM;
  const orb = FAST ? 2.5 : 6.5, nWin = FAST ? 2 : 5;
  for (const frac of [0, 1e-6, 1e-3, 1e-1]) {
    for (const wv of [null, 'pairPN']) {
      const r = await pg.evaluate(([frac, wv, orbits, Pu, nWin]) => {
        const S = HP.sim;
        const mA = 5321.812101719132;
        const opt = { spaceMesh: wv ? { weave: wv } : null, nWin };
        if (frac > 0) opt.extraBody = { type: 'single', m: mA * frac, radius: 0.01175,
          x: 0, y: 6000, vx: 0.9, vy: 0, spin: 0, pinned: false };
        return window.__w256.run('psrDoubleABDFM', opt, 0.016, orbits, Pu);
      }, [frac, wv, orb, s.Pu, nWin]);
      const row = { frac, weave: wv || 'off', n: r.meta ? r.meta.n : null,
        advA: r.A && r.A.slopeDeg, perA: r.A && r.A.perMean !== null ? r.A.perMean * s.Tunit : null,
        chi: r.weave.chi, stop: r.weave.stop, nan: r.nan, clampD: r.clampD, nWin };
      out.tb.push(row);
      console.error(`TB m₃/m_A=${frac} weave=${row.weave}: n=${row.n} Δϖ=${fx(row.advA, 8)} P=${fx(row.perA, 3)}s `
        + `χ=${fx(row.chi, 9)} stop=${row.stop} NaN=${row.nan}`);
    }
  }
  // 第三体を入れたときの差(同じ frac の off と pairPN の対)
  const g = {};
  for (const r of out.tb) { g[r.frac] = g[r.frac] || {}; g[r.frac][r.weave] = r; }
  out.tbDiff = Object.keys(g).map((f) => ({ frac: Number(f),
    dAdv: (g[f].off.advA !== null && g[f].pairPN.advA !== null) ? g[f].pairPN.advA - g[f].off.advA : null,
    dChi: g[f].pairPN.chi - g[f].off.chi,
    dP: (g[f].off.perA !== null && g[f].pairPN.perA !== null) ? g[f].pairPN.perA - g[f].off.perA : null }));
  for (const z of out.tbDiff) console.error(`TB' frac=${z.frac}: Δ(Δϖ)=${ex(z.dAdv)} ΔP=${ex(z.dP)} χ=${ex(z.dChi)}`);
}

out.pageErrors = pageErrors;
await browser.close();
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.error('[w256a] → ' + path.relative(ROOT, OUT));
if (pageErrors.length) console.error('[w256a] pageErrors: ' + pageErrors.slice(0, 3).join(' | '));
