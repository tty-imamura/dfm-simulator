// 第258便a W1「連星の物理 —— 支持関数つき局所場で T2 の非局所性を止められるか」(第50報)。
//
// 原仮定者(第50報・抜粋): 「空間メッシュの実装を優先する。早期にコンパクト天体連星サンプルと銀河
//   サンプルを完成させる」「空間メッシュの実装について精査する。**現実較正に使える精度か。『背景決定力 D₀』
//   『引きずり減衰 q』『空間引きずり kFrame』との関係**」。
//
// 〔第257便a ⑤3〕の否定結果は「T2 は 1 つの大域相似写像であって局所メッシュではない」
// (|a_I|/|g_N| が r=300→4800 で 1.97→1370)。本器が測るのは **3 案(支持関数 / χ_cut / exp 門)を
// 実装して並べたときに、どれが何処で頭打ちになるか**である。予想は 1 つも書かない(Failure First)。
//
// ■ 節(--pure --bit --radial --fnorm --eta --kick --feta --hold・複数指定可・無指定は全部)
//   pure  : 純関数 HP.dfmLocalMeshField の中央差分(∇u・∂ₜu)・支持端の連続・門。
//   bit   : 全内蔵プリセット × 600 步 + 検証後 JSON を基点と突き合わせる(未宣言 1 bit 不変)。
//   radial: §1 —— 🪟+試験粒子で |a_I|/|g_N|(r) を 4 欄(none/support/chiCut/expGate)× R 3 段。
//   fnorm : §2 —— 🪟 D0pull=0 の f_norm(参照 8 倍)を門ありで再測 → s を場から与えて再比較。
//   eta   : §4 —— 箱で kFrame×η×D₀ の表(基点 html との 2 欄。q 1/3/6 で不変かも)。
//   kick  : §3 —— 実キックの保存と正確な除去。基点(步末再計算)との差を 🪟・箱・dt 3 段・第三体で。
//   feta  : §5 —— ⚡ の (f,η) 粗掃引(門あり)。**P と ω̇[deg/yr] を同走行で**。
//   hold  : feta で最接近の点を 🧮🩺🧶 で hold-out。
//
// 実行: node tests/exp-w258a-meshlocal.mjs [--節...] [--fast]
//       W258A_BASE=<基点 html>(既定 tests/out/base-w258a.html)
// 出力: tests/out/meshlocal-w258.json(数値は docs/PHYSICS.md〔第258便a〕へ全載)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + path.join(ROOT, TARGET);
const BASE = process.env.W258A_BASE || path.join(ROOT, 'tests', 'out', 'base-w258a.html');
const OUT = path.join(ROOT, 'tests', 'out', 'meshlocal-w258.json');
const argv = process.argv.slice(2);
const FAST = argv.includes('--fast');
const only = argv.filter((a) => a.startsWith('--') && a !== '--fast').map((a) => a.slice(2));
const want = (k) => !only.length || only.includes(k);
const fx = (z, d = 6) => (z === null || z === undefined || !Number.isFinite(z)) ? '—' : Number(z).toFixed(d);
const ex = (z, d = 4) => (z === null || z === undefined || !Number.isFinite(z)) ? '—' : Number(z).toExponential(d);

const DT0 = 0.016, NWIN = 20, YR = 365.25 * 86400;
const ORBITS = FAST ? 6.5 : 21.5;

// ---------------------------------------------------------------- 観測(CSV が正本)
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
  s.Pu = s.PobsS / s.Tunit;
}

// ================================================================ ブラウザ(**1 本だけ**)
const { chromium } = await import('playwright');
let browser;
try { browser = await chromium.launch(); }
catch { browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }); }
const pageErrors = [];
async function openPage(url) {
  const p = await browser.newPage();
  p.on('pageerror', (e) => pageErrors.push(String(e)));
  await p.goto(url, { waitUntil: 'load' });
  await p.waitForFunction(() => window.HP && HP.sim);
  await p.evaluate(() => {
    const W = (window.__w258 = {});
    W.build = (id, o) => {
      const opt = o || {};
      const pd = JSON.parse(JSON.stringify(HP.allPresets().find((q) => q.id === id)));
      if (opt.physics) for (const k of Object.keys(opt.physics)) {
        if (opt.physics[k] === '__delete') delete pd.physics[k]; else pd.physics[k] = opt.physics[k];
      }
      if (opt.spaceMesh === null) delete pd.physics.spaceMesh;
      else if (opt.spaceMesh) pd.physics.spaceMesh = Object.assign({ mode: 'vertex' }, pd.physics.spaceMesh || {}, opt.spaceMesh);
      if (opt.universeBox) pd.universeBox = Object.assign({}, pd.universeBox || {}, opt.universeBox);
      if (opt.fMass !== undefined && pd.massCalibration && Array.isArray(pd.massCalibration.baseMass)) {
        const f1 = pd.massCalibration.baseMass.slice();
        for (let i = 0; i < f1.length && i < pd.bodies.length; i++) pd.bodies[i].m = f1[i] * opt.fMass;
      }
      if (opt.bodies) pd.bodies = opt.bodies;
      if (opt.extraBody) pd.bodies = pd.bodies.concat([opt.extraBody]);
      delete pd.massCalibration;
      const v = HP.validatePreset(pd);
      if (!v.ok) return { err: (v.errors || []).join('|') };
      HP.sim.build(v.preset);
      return { ok: true, sig: JSON.stringify(v.preset.physics), n: HP.sim.n };
    };
    // 近点検出器 A/B(第252便b〜第257便a と**同一手続き**)+ 実時刻への直線 fit(deg/yr)
    W.fit = (raw, rMin, rMax, pRef, dt, nWin, secPerUnit) => {
      const mid = 0.5 * (rMin + rMax);
      const peri = raw.filter((p) => p.r < mid);
      const rej = { apo: raw.length - peri.length, dup: 0, jump: 0 };
      const keep = [];
      for (const p of peri) {
        if (keep.length && (p.k - keep[keep.length - 1].k) * dt < 0.5 * pRef) { rej.dup++; continue; }
        keep.push(p);
      }
      const base = { cand: peri.length, found: keep.length, rej };
      if (keep.length < nWin) return Object.assign(base, { nPeri: keep.length, unmeasured: true, slopeDeg: null, perMean: null, degPerYr: null });
      const use = keep.slice(0, nWin), ang = [];
      for (let i = 0; i < use.length; i++) {
        let a = use[i].ang;
        if (i) { let z = a - ang[i - 1]; while (z > Math.PI) z -= 2 * Math.PI; while (z < -Math.PI) z += 2 * Math.PI;
          if (Math.abs(z) > Math.PI / 2) { rej.jump++; break; } a = ang[i - 1] + z; }
        ang.push(a);
      }
      if (ang.length < nWin) return Object.assign(base, { nPeri: ang.length, unmeasured: true, slopeDeg: null, perMean: null, degPerYr: null });
      const n = ang.length, mx = (n - 1) / 2, my = ang.reduce((a, b) => a + b, 0) / n;
      let sxy = 0, sxx = 0;
      for (let i = 0; i < n; i++) { sxy += (i - mx) * (ang[i] - my); sxx += (i - mx) * (i - mx); }
      // **実時刻への fit**(第50報/3 審査 v16: ω̇ は deg/yr の門。°/周 換算はしない)
      const ts = use.map((p) => p.k * dt * (secPerUnit || 1));
      const mt = ts.reduce((a, b) => a + b, 0) / n;
      let txy = 0, txx = 0;
      for (let i = 0; i < n; i++) { txy += (ts[i] - mt) * (ang[i] - my); txx += (ts[i] - mt) * (ts[i] - mt); }
      const degPerSec = (txx > 0) ? (txy / txx) * 180 / Math.PI : null;
      return Object.assign(base, { nPeri: n, unmeasured: false, slopeDeg: (sxy / sxx) * 180 / Math.PI,
        perMean: (use[nWin - 1].k - use[0].k) * dt / (nWin - 1),
        degPerYr: (degPerSec === null) ? null : degPerSec * 365.25 * 86400 });
    };
    W.win = (dt, tEnd, pRef, nWin, secPerUnit) => {
      const S = HP.sim;
      const steps = Math.round(tEnd / dt);
      const A = [], Bd = [], sid = [];
      let r2 = 0, r1 = 0, t2 = 0, t1 = 0, rd1 = 0, rMin = Infinity, rMax = -Infinity;
      let acc = 0, accPrev = 0, thPrev = null, nTurn = 0;
      const T0 = S.totals(), L0 = T0.L + S.resL + S.radL;
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
        r2 = r1; r1 = rr; t2 = t1; t1 = th; rd1 = rd;
        if (S.hasNaN()) break;
      }
      const sidMean = sid.length > 1 ? (sid[sid.length - 1] - sid[0]) / (sid.length - 1) : null;
      const pUse = (sidMean > 0) ? sidMean : pRef;
      const T1 = S.totals(), L1 = T1.L + S.resL + S.radL;
      return { rMin, rMax, eProxy: (rMax - rMin) / (rMax + rMin),
        A: W.fit(A, rMin, rMax, pUse, dt, nWin, secPerUnit), sidMean, steps, nan: S.hasNaN(),
        clampD: ((S.clampVN || 0) + (S.clampSN || 0) + (S.clampRN || 0) + (S.clampTN || 0) + (S.clampAN || 0)) - clamp0,
        lRel: Math.abs(L1 - L0) / Math.max(Math.abs(L0), 1e-9),
        mc: { E: S.meshCoordE, chi: S.meshCoordChi, N: S.meshCoordN, out: S.meshCoordOut,
          stop: S.meshCoordStop, src: S.meshCoordSrc, dvI: S.meshCoordDvI, dvE6: S.meshCoordDvE6,
          clamp: S.meshCoordClamp } };
    };
    W.run = (id, opt, dt, orbits, Pu, nWin, secPerUnit) => {
      const meta = W.build(id, opt);
      if (meta.err) return { err: meta.err };
      const o = W.win(dt, orbits * Pu, Pu, nWin || 20, secPerUnit);
      o.meta = meta;
      return o;
    };
    // 箱の共回転試験粒子(第257便a §BOX(b) と同一手続き)
    W.spin = (sm, ph, ub, dt, RP, OM) => {
      const q = JSON.parse(JSON.stringify(HP.allPresets().find((z) => z.id === 'boxcomoving')));
      q.universeBox = Object.assign({}, q.universeBox, ub);
      Object.assign(q.physics, ph || {});
      if (sm) q.physics[HP.SPACE_MESH_KEY] = Object.assign({ mode: 'vertex' }, sm);
      else delete q.physics[HP.SPACE_MESH_KEY];
      q.bodies = [{ type: 'single', m: 1e-9, x: RP, y: 0, vx: 0, vy: OM * RP, spin: 0, pinned: false }];
      delete q.massCalibration;
      const v = HP.validatePreset(q);
      if (!v.ok) return { err: (v.errors || []).join('|') };
      const S = HP.sim; S.build(v.preset);
      let ar = 0, r = RP;
      for (let k = 0; k < 4; k++) {
        const v0 = [S.vx[0], S.vy[0]];
        S.step(dt);
        r = Math.hypot(S.x[0], S.y[0]);
        ar = ((S.vx[0] - v0[0]) / dt * S.x[0] + (S.vy[0] - v0[1]) / dt * S.y[0]) / r;
      }
      return { resid: ar + OM * OM * r, ref: OM * OM * r, ratio: (ar + OM * OM * r) / (OM * OM * r),
        chi: S.meshCoordChi, src: S.meshCoordSrc, stop: S.meshCoordStop, nan: S.hasNaN(),
        dvI: S.meshCoordDvI, dvE6: S.meshCoordDvE6 };
    };
    // 🪟 + 試験粒子 1 個(非頂点)の 1 步診断
    W.probe = (sm, ph, RT, nStep, dt) => {
      const omN0 = Math.sqrt(0.60066 * 1000 / (RT * RT * RT));
      const meta = W.build('spaceMeshBinaryToy', { physics: ph || {}, spaceMesh: sm,
        extraBody: { type: 'single', m: 1e-8, x: RT, y: 0, vx: 0, vy: omN0 * RT, spin: 0, pinned: false } });
      if (meta.err) return { err: meta.err };
      const S = HP.sim;
      for (let k = 0; k < (nStep || 4); k++) S.step(dt || 0.004);
      const r = Math.hypot(S.x[S.n - 1], S.y[S.n - 1]);
      const gN = S.params.G * (S.m[0] + S.m[1]) / (r * r);
      return { RT, r, chi: S.meshCoordChi, aI: S.meshCoordDvI / (dt || 0.004),
        aE6: S.meshCoordDvE6 / (dt || 0.004), gN, ratio: (S.meshCoordDvI / (dt || 0.004)) / gN,
        sep: Math.hypot(S.x[1] - S.x[0], S.y[1] - S.y[0]),
        N: S.meshCoordN, out: S.meshCoordOut, stop: S.meshCoordStop, nan: S.hasNaN() };
    };
  });
  return p;
}
const pg = await openPage(INDEX);

let prev = {};
if (fs.existsSync(OUT)) { try { prev = JSON.parse(fs.readFileSync(OUT, 'utf8')) || {}; } catch { prev = {}; } }
const out = { ...prev, wave: '第258便a', target: TARGET, node: process.version, at: new Date().toISOString(),
  window: { nPeri: NWIN, dt0: DT0, orbits: ORBITS }, obs: SYS, fast: FAST };

// ================================================================ pure
if (want('pure')) {
  console.error('[w258a] PURE: HP.dfmLocalMeshField の中央差分・支持端の連続・門');
  out.pure = await pg.evaluate(() => {
    const SRC = [{ m: 500, x: -120, y: 0, vx: 0.03, vy: -0.56, ax: 0.004, ay: 0.001 },
      { m: 300, x: 140, y: 40, vx: -0.02, vy: 0.61, ax: -0.006, ay: 0.002, omega: 0.02 }];
    const O = { D0: 1e-3, eps: 0.05, p: 3, R: 700 };
    const at = (px, py, sr) => HP.dfmLocalMeshField(sr || SRC, px, py, O);
    // ① ∇u の中央差分
    const P = [[60, 25], [-300, 110], [400, -380]];
    let gErr = 0, gScale = 0;
    for (const [px, py] of P) {
      const h = 1e-5 * Math.max(1, Math.hypot(px, py));
      const f0 = at(px, py);
      const dx = [at(px + h, py), at(px - h, py)], dy = [at(px, py + h), at(px, py - h)];
      const num = [(dx[0].u[0] - dx[1].u[0]) / (2 * h), (dy[0].u[0] - dy[1].u[0]) / (2 * h),
        (dx[0].u[1] - dx[1].u[1]) / (2 * h), (dy[0].u[1] - dy[1].u[1]) / (2 * h)];
      for (let k = 0; k < 4; k++) { gErr = Math.max(gErr, Math.abs(num[k] - f0.gradU[k])); gScale = Math.max(gScale, Math.abs(f0.gradU[k])); }
    }
    // ② ∂ₜu の中央差分(源を ±dt 動かす。x=x+v dt+½a dt²・v=v+a dt)
    const adv = (dt) => SRC.map((b) => ({ m: b.m, x: b.x + b.vx * dt + 0.5 * b.ax * dt * dt,
      y: b.y + b.vy * dt + 0.5 * b.ay * dt * dt, vx: b.vx + b.ax * dt, vy: b.vy + b.ay * dt,
      ax: b.ax, ay: b.ay, omega: b.omega }));
    let tErr = 0, tScale = 0;
    for (const [px, py] of P) {
      const dt = 1e-5, f0 = at(px, py);
      const p1 = at(px, py, adv(dt)), m1 = at(px, py, adv(-dt));
      const num = [(p1.u[0] - m1.u[0]) / (2 * dt), (p1.u[1] - m1.u[1]) / (2 * dt)];
      for (let k = 0; k < 2; k++) { tErr = Math.max(tErr, Math.abs(num[k] - f0.dUdt[k])); tScale = Math.max(tScale, Math.abs(f0.dUdt[k])); }
    }
    // ③ 支持端の連続(源 0 から R の内外 ±1e−6)
    const edge = (() => {
      const S1 = [{ m: 500, x: 0, y: 0, vx: 0.3, vy: -0.2, ax: 0.01, ay: 0.02 }];
      const OE = { D0: 1e-3, eps: 0.05, p: 3, R: 700 };
      const inn = HP.dfmLocalMeshField(S1, 700 - 1e-6, 0, OE);
      const outr = HP.dfmLocalMeshField(S1, 700 + 1e-6, 0, OE);
      const far = HP.dfmLocalMeshField(S1, 900, 0, OE);
      return { du: Math.hypot(inn.u[0] - outr.u[0], inn.u[1] - outr.u[1]),
        dg: Math.max(...[0, 1, 2, 3].map((k) => Math.abs(inn.gradU[k] - outr.gradU[k]))),
        dt: Math.hypot(inn.dUdt[0] - outr.dUdt[0], inn.dUdt[1] - outr.dUdt[1]),
        chiIn: inn.chi, chiOut: outr.chi, uFar: Math.hypot(far.u[0], far.u[1]), chiFar: far.chi,
        nInIn: inn.nIn, nInOut: outr.nIn };
    })();
    // ④ 門
    const gates = [HP.dfmLocalMeshField(null, 0, 0, { R: 1 }),
      HP.dfmLocalMeshField([{ m: 1, x: 0, y: 0 }], 0, 0, {}),                       // R 無し
      HP.dfmLocalMeshField([{ m: 1, x: 0, y: 0 }], NaN, 0, { R: 1 }),
      HP.dfmLocalMeshField([{ m: 1, x: 0, y: 0 }], 900, 0, { R: 100, D0: 0 })       // **D₀=0 かつ支持外**
    ].every((z) => z === null);
    // ⑤ D₀>0 なら支持外は背景へ(u_bg を宣言して一致を見る)
    const bgOK = (() => {
      const z = HP.dfmLocalMeshField([{ m: 1, x: 0, y: 0, vx: 5, vy: 5 }], 900, 0,
        { R: 100, D0: 1, bg: { u: [1.25, -0.5] } });
      return z ? { u: z.u, chi: z.chi, err: Math.hypot(z.u[0] - 1.25, z.u[1] + 0.5) } : null;
    })();
    // ⑥ p=0 の極(重み一様)と加算形(同じ位置の質量 4 = 1+3)
    const addOK = (() => {
      const a = HP.dfmLocalMeshField([{ m: 4, x: 10, y: 0, vx: 1, vy: 2 }], 50, 30, O);
      const b = HP.dfmLocalMeshField([{ m: 1, x: 10, y: 0, vx: 1, vy: 2 }, { m: 3, x: 10, y: 0, vx: 1, vy: 2 }], 50, 30, O);
      return Math.max(Math.abs(a.W - b.W), Math.hypot(a.u[0] - b.u[0], a.u[1] - b.u[1]));
    })();
    return { gErr, gScale, gRel: gErr / gScale, tErr, tScale, tRel: tErr / tScale, edge, gates, bgOK, addOK };
  });
  const p = out.pure;
  console.error(`  ∇u 中央差分 最大差 ${ex(p.gErr)}(相対 ${ex(p.gRel)})・∂ₜu ${ex(p.tErr)}(相対 ${ex(p.tRel)})`);
  console.error(`  支持端の連続(R=700 の内外 ±1e−6): |Δu|=${ex(p.edge.du)}・max|Δ∇u|=${ex(p.edge.dg)}・|Δ∂ₜu|=${ex(p.edge.dt)}`
    + `・χ 内 ${ex(p.edge.chiIn)} / 外 ${ex(p.edge.chiOut)}・支持外の |u|=${ex(p.edge.uFar)}`);
  console.error(`  門(null 4 種)=${p.gates}・支持外は背景へ(残差 ${ex(p.bgOK && p.bgOK.err)})・加算形 ${ex(p.addOK)}`);
}

// ================================================================ bit(全内蔵 × 600 步)
if (want('bit') && fs.existsSync(BASE)) {
  console.error('[w258a] BIT: 全内蔵プリセット × 600 步(dt=0.016)+ 検証後 JSON を基点と突き合わせる');
  const hashAll = (page) => page.evaluate(() => {
    const h = (S) => {
      let a = 0x811c9dc5;
      const buf = new ArrayBuffer(8), f = new Float64Array(buf), u = new Uint8Array(buf);
      const push = (v) => { f[0] = v; for (let b = 0; b < 8; b++) { a ^= u[b]; a = Math.imul(a, 0x01000193) >>> 0; } };
      for (const k of ['x', 'y', 'vx', 'vy', 'spin', 'R', 'm']) { const A = S[k]; if (!A) continue;
        for (let i = 0; i < S.n; i++) push(A[i]); }
      push(S.t); return a.toString(16);
    };
    const o = { state: {}, sig: {} };
    for (const p of HP.allPresets()) {
      const v = HP.validatePreset(JSON.parse(JSON.stringify(p)));
      const S = HP.sim; S.build(v.preset);
      for (let k = 0; k < 600; k++) S.step(0.016);
      o.state[p.id] = h(S) + '|n=' + S.n + '|nan=' + S.hasNaN();
      o.sig[p.id] = JSON.stringify(v.preset);
    }
    return o;
  });
  const cur = await hashAll(pg);
  const pg2 = await openPage('file://' + path.resolve(BASE));
  const base = await hashAll(pg2);
  await pg2.close();
  const ids = Object.keys(cur.state);
  const diffs = ids.filter((id) => cur.state[id] !== base.state[id]);
  const sigDiffs = ids.filter((id) => cur.sig[id] !== base.sig[id]);
  out.bit = { base: BASE, steps: 600, nCur: ids.length, nBase: Object.keys(base.state).length, diffs, sigDiffs,
    identicalCount: ids.length - diffs.length };
  console.error(`  状態: 現行 ${ids.length} 本 / 基点 ${out.bit.nBase} 本 — 差=${diffs.length ? diffs.join(',') : 'なし'}`);
  console.error(`  署名: 差=${sigDiffs.length ? sigDiffs.join(',') : 'なし'}`);
} else if (want('bit')) console.error(`[w258a] BIT: 基点 html が無いので省略(${BASE})`);

// ================================================================ radial(§1)
if (want('radial')) {
  console.error('[w258a] RADIAL: |a_I|/|g_N|(r) を 4 欄 × R 3 段(🪟+試験粒子)');
  out.radial = await pg.evaluate(() => {
    const W = window.__w258, rows = [];
    const RS = [300, 800, 1600, 4800];
    const sep0 = 240;                     // 🪟 の遠点分離(t=0)
    const RBASE = HP.SPACE_MESH_SUPPORT_RSEP * sep0;
    const COLS = [
      { k: 'none(現行)', sm: { inertia: 'coordinate' }, needR: false },
      { k: 'support', sm: { inertia: 'coordinate', inertiaSupport: 'support' }, needR: true },
      { k: 'chiCut', sm: { inertia: 'coordinate', inertiaSupport: 'chiCut' }, needR: true },
      { k: 'expGate', sm: { inertia: 'coordinate', inertiaSupport: 'expGate' }, needR: true },
    ];
    for (const mul of [0.5, 1, 2]) {
      for (const c of COLS) {
        if (!c.needR && mul !== 1) continue;
        for (const RT of RS) {
          const sm = Object.assign({}, c.sm);
          if (c.needR) sm.inertiaSupportR = RBASE * mul;
          const z = W.probe(sm, {}, RT, 4, 0.004);
          rows.push(Object.assign({ col: c.k, mul, R: c.needR ? RBASE * mul : null, RT }, z));
        }
      }
    }
    return { RBASE, sep0, rows };
  });
  for (const r of out.radial.rows) console.error(`  [${r.col}] R=${r.R === null ? '—' : r.R.toFixed(0)}`
    + `(×${r.mul}) r=${r.RT}: χ=${ex(r.chi)}・|a_I|=${ex(r.aI)}・|g_N|=${ex(r.gN)}`
    + `・**|a_I|/|g_N|=${ex(r.ratio)}**・N=${r.N}・支持外=${r.out}・stop=${r.stop}`);
}

// ================================================================ fnorm(§2)
if (want('fnorm')) {
  console.error('[w258a] FNORM: 🪟 D0pull=0 の f_norm を門ありで再測 → s を場から');
  out.fnorm = await pg.evaluate(() => {
    const W = window.__w258;
    const RT = 600, sep0 = 240, RBASE = HP.SPACE_MESH_SUPPORT_RSEP * sep0;
    const probe = (sm, ph, om) => {
      const meta = W.build('spaceMeshBinaryToy', { physics: Object.assign({ D0pull: 0 }, ph), spaceMesh: sm,
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
        aI: S.meshCoordDvI / dt, gN: S.params.G * (S.m[0] + S.m[1]) / (r * r),
        sep: Math.hypot(S.x[1] - S.x[0], S.y[1] - S.y[0]), eps: S.params.softening,
        pw: HP.frameWeightPow(S.params), m0: S.m[0], m1: S.m[1], xs: [S.x[0], S.y[0], S.x[1], S.y[1]],
        vs: [S.vx[0], S.vy[0], S.vx[1], S.vy[1]] };
    };
    const rootOmega = (sm, ph) => {
      const p0 = probe(sm, ph, 0);
      if (!p0) return null;
      const omN = Math.sqrt(p0.GM / (RT * RT * RT));
      let lo = 0.02 * omN, hi = 8 * omN, om = omN, last = p0;
      for (let it = 0; it < 44; it++) {
        om = 0.5 * (lo + hi);
        const z = probe(sm, ph, om);
        if (!z) break;
        last = z;
        if (z.ar + om * om * z.r < 0) lo = om; else hi = om;
      }
      return { om, omN, GM: p0.GM, last, bound: (om > 7.9 * omN || om < 0.03 * omN) };
    };
    const rows = [];
    const D0S = [0, 1e-4, 1e-2];
    const COLS = [
      { k: 'kFrame=0(基準)', sm: null, ph: { kFrame: 0 } },
      { k: 'E6′(現行)', sm: null, ph: {} },
      { k: 'coordinate none', sm: { inertia: 'coordinate' }, ph: {} },
      { k: 'coordinate support R', sm: { inertia: 'coordinate', inertiaSupport: 'support', inertiaSupportR: RBASE }, ph: {} },
      { k: 'coordinate support R/2', sm: { inertia: 'coordinate', inertiaSupport: 'support', inertiaSupportR: RBASE / 2 }, ph: {} },
      { k: 'coordinate support 2R', sm: { inertia: 'coordinate', inertiaSupport: 'support', inertiaSupportR: RBASE * 2 }, ph: {} },
      { k: 'coordinate chiCut', sm: { inertia: 'coordinate', inertiaSupport: 'chiCut', inertiaSupportR: RBASE }, ph: {} },
      { k: 'coordinate expGate', sm: { inertia: 'coordinate', inertiaSupport: 'expGate', inertiaSupportR: RBASE }, ph: {} },
    ];
    for (const D0p of D0S) {
    const base = rootOmega(null, { kFrame: 0, D0pull: D0p });
    const fBase = base.GM / (RT * RT * RT * base.om * base.om);
    for (const c of COLS) {
      const z = rootOmega(c.sm, Object.assign({ D0pull: D0p }, c.ph));
      if (!z) { rows.push({ D0p, k: c.k, err: 'build' }); continue; }
      const fMeas = z.GM / (RT * RT * RT * z.om * z.om);
      const L = z.last;
      // **(iii) s を場から**: 局所場の Ω_m(r)=(∇u の反対称部)を r で 2 点取って s=−dlnΩ/dlnr
      const supR = (c.sm && c.sm.inertiaSupportR) ? c.sm.inertiaSupportR : null;
      const SRC = [{ m: L.m0, x: L.xs[0], y: L.xs[1], vx: L.vs[0], vy: L.vs[1] },
        { m: L.m1, x: L.xs[2], y: L.xs[3], vx: L.vs[2], vy: L.vs[3] }];
      const omAt = (rr) => {
        const o = supR ? HP.dfmLocalMeshField(SRC, rr, 0, { D0: D0p, eps: L.eps, p: L.pw, R: supR }) : null;
        return o ? { om: 0.5 * (o.gradU[2] - o.gradU[1]), chi: o.chi } : null;
      };
      const a1 = omAt(RT), a2 = omAt(RT * 1.05);
      const sField = (a1 && a2 && a1.om !== 0 && a2.om / a1.om > 0)
        ? -(Math.log(Math.abs(a2.om)) - Math.log(Math.abs(a1.om))) / Math.log(1.05) : null;
      const chiF = a1 ? a1.chi : L.chi;
      const OmF = a1 ? a1.om : L.OmMesh;
      const xEff = (OmF !== null && z.om > 0) ? Math.abs(chiF * OmF / z.om) : null;
      const refS = (xEff !== null && xEff >= 0 && xEff <= 1 && sField !== null)
        ? HP.relativeOrbitReference({ chi: xEff, s: sField, omega: 1 }) : null;
      const ref0 = (xEff !== null && xEff >= 0 && xEff <= 1)
        ? HP.relativeOrbitReference({ chi: xEff, s: 0, omega: 1 }) : null;
      rows.push({ D0p, k: c.k, omega: z.om, bound: z.bound, fMeas, fBase, fNorm: fMeas / fBase,
        chiRun: L.chi, chiField: chiF, OmField: OmF, OmMesh: L.OmMesh, sField, xEff,
        refS: refS ? refS.f : null, ref0: ref0 ? ref0.f : null,
        ratioS: refS ? (fMeas / fBase) / refS.f : null, ratio0: ref0 ? (fMeas / fBase) / ref0.f : null,
        aI: L.aI, gN: L.gN, aIovergN: L.gN > 0 ? L.aI / L.gN : null, stop: L.stop, nan: L.nan });
    }
    }
    return { RT, RBASE, rows };
  });
  for (const r of out.fnorm.rows) console.error(`  D0pull=${r.D0p} [${r.k}] ω_c=${ex(r.omega)} **f_norm=${fx(r.fNorm, 6)}**`
    + `・χ(場)=${ex(r.chiField)}・Ω_m=${ex(r.OmField)}・s(場)=${fx(r.sField, 4)}・x=${fx(r.xEff, 6)}`
    + ` → 参照 f(s=0)=${fx(r.ref0, 6)}〔比 ${fx(r.ratio0, 4)}〕・参照 f(s を場から)=${fx(r.refS, 6)}〔比 ${fx(r.ratioS, 4)}〕`
    + `・|a_I|/|g_N|=${ex(r.aIovergN)}`);
}

// ================================================================ eta(§4 箱の表)
if (want('eta')) {
  console.error('[w258a] ETA: 箱で kFrame×η×D₀ の表(現行=基点 html / 提案後=本便)');
  const table = (page) => page.evaluate(() => {
    const W = window.__w258, rows = [];
    const OM = 0.15, RP = 70, DT = 0.005;
    for (const D0 of [0, 80, 800]) {
      for (const kF of [0, 0.5, 1]) {
        for (const eta of [0.5, 1]) {
          const ub = { mode: 'exp', H0: 0, omega: OM, vx: 0, vy: 0, D: 80, dPower: 1 };
          const ph = { G: 0, D0, kFrame: kF, q: 3, geoPN: 0, softening: 4, stateCarry: 'double' };
          const z = W.spin({ inertia: 'coordinate', inertiaGain: eta }, ph, ub, DT, RP, OM);
          rows.push(Object.assign({ D0, kF, eta }, z));
        }
        // 対照: coordinate なし(E6′ のみ)
        const z0 = W.spin(null, { G: 0, D0, kFrame: kF, q: 3, geoPN: 0, softening: 4, stateCarry: 'double' },
          { mode: 'exp', H0: 0, omega: OM, vx: 0, vy: 0, D: 80, dPower: 1 }, DT, RP, OM);
        rows.push(Object.assign({ D0, kF, eta: null }, z0));
      }
    }
    // q の掃引(χ に q が入らないことの実測)
    const qrows = [];
    for (const q of [1, 3, 6]) {
      const z = W.spin({ inertia: 'coordinate', inertiaGain: 1 },
        { G: 0, D0: 80, kFrame: 1, q, geoPN: 0, softening: 4, stateCarry: 'double' },
        { mode: 'exp', H0: 0, omega: OM, vx: 0, vy: 0, D: 80, dPower: 1 }, DT, RP, OM);
      qrows.push(Object.assign({ q }, z));
    }
    return { rows, qrows, OM, RP, ref: OM * OM * RP };
  });
  const cur = await table(pg);
  let base = null;
  if (fs.existsSync(BASE)) {
    const pg2 = await openPage('file://' + path.resolve(BASE));
    base = await table(pg2);
    await pg2.close();
  }
  out.eta = { cur, base };
  for (let i = 0; i < cur.rows.length; i++) {
    const r = cur.rows[i], b = base ? base.rows[i] : null;
    console.error(`  D₀=${r.D0} kFrame=${r.kF} η=${r.eta === null ? 'E6′' : r.eta}: χ=${fx(r.chi, 6)}`
      + `・**残差/(Ω²r)=${fx(r.ratio, 6)}**(現行 ${b ? fx(b.ratio, 6) : '—'})・stop=${r.stop}`);
  }
  for (const r of cur.qrows) console.error(`  q=${r.q}(D₀=80・kFrame=1・η=1): χ=${fx(r.chi, 8)}・残差/(Ω²r)=${fx(r.ratio, 8)}`);
}

// ================================================================ kick(§3 実キックの除去)
if (want('kick')) {
  console.error('[w258a] KICK: 実キック除去(本便)対 步末再計算(基点)');
  const meas = (page) => page.evaluate(() => {
    const W = window.__w258, rows = [];
    const ring = [];
    for (let k = 0; k < 8; k++) {
      const th = 2 * Math.PI * k / 8, rr = 900;
      ring.push({ type: 'single', m: 0.5, x: rr * Math.cos(th), y: rr * Math.sin(th),
        vx: -0.026 * Math.sin(th), vy: 0.026 * Math.cos(th), spin: 0, pinned: false });
    }
    const runRing = (sm, dt, steps, extra) => {
      const q = JSON.parse(JSON.stringify(HP.allPresets().find((z) => z.id === 'spaceMeshBinaryToy')));
      if (sm) q.physics[HP.SPACE_MESH_KEY] = Object.assign({ mode: 'vertex' }, q.physics[HP.SPACE_MESH_KEY] || {}, sm);
      q.bodies = q.bodies.concat(ring).concat(extra || []);
      const v = HP.validatePreset(q);
      if (!v.ok) return { err: (v.errors || []).join('|') };
      const S = HP.sim; S.build(v.preset);
      const T0 = S.totals();
      for (let k = 0; k < steps; k++) S.step(dt);
      const T = S.totals();
      return { r: Math.hypot(S.x[1] - S.x[0], S.y[1] - S.y[0]),
        st: [S.x[2], S.y[2], S.vx[2], S.vy[2]],
        dLraw: T.L - T0.L, Labs: Math.abs(T0.L) || 1,
        dPres: Math.hypot(T.px - T0.px + S.resPx, T.py - T0.py + S.resPy),
        dLres: (T.L - T0.L) + S.resL, mcE: S.meshCoordE, mcEm: S.meshCoordEmesh,
        mcN: S.meshCoordN, mcClamp: S.meshCoordClamp, dvE6: S.meshCoordDvE6, dvI: S.meshCoordDvI,
        nan: S.hasNaN(), stop: S.meshCoordStop,
        clamp: S.clampVN + S.clampSN + S.clampRN + S.clampTN + S.clampAN };
    };
    for (const dt of [0.008, 0.004, 0.002]) {
      rows.push(Object.assign({ k: '🪟+リング', dt, third: false },
        runRing({ inertia: 'coordinate' }, dt, Math.round(12 / dt))));
    }
    rows.push(Object.assign({ k: '🪟+リング+第三体', dt: 0.004, third: true },
      runRing({ inertia: 'coordinate' }, 0.004, 3000,
        [{ type: 'single', m: 60, x: 0, y: 1800, vx: 0.13, vy: 0, spin: 0, pinned: false }])));
    // **恒等**: η=0(除去のみ)は kFrame=0(支えなし)と一致するか。
    // **全粒子を対象にする**(inertiaVertices:true)= E6′ を当てて全部引く構成。
    // 対照として非頂点だけ(既定)も並べる —— 頂点には E6′ が残るので一致しないはずである
    const idn = [];
    for (const vert of [true, false]) {
      for (const st of [1, 2]) {
        const dt = st === 1 ? 0.008 : 0.004, steps = Math.round(12 / dt);
        const a = runRing({ inertia: 'coordinate', inertiaGain: 0, inertiaVertices: vert }, dt, steps);
        const q = JSON.parse(JSON.stringify(HP.allPresets().find((z) => z.id === 'spaceMeshBinaryToy')));
        q.physics.kFrame = 0; q.bodies = q.bodies.concat(ring);
        const v = HP.validatePreset(q);
        const S = HP.sim; S.build(v.preset);
        for (let k = 0; k < steps; k++) S.step(dt);
        const b = [S.x[2], S.y[2], S.vx[2], S.vy[2]];
        idn.push({ vert, dt, maxDiff: Math.max(...a.st.map((v2, i) => Math.abs(v2 - b[i]))),
          scale: Math.hypot(b[0], b[1]), rA: a.r, rB: Math.hypot(S.x[1] - S.x[0], S.y[1] - S.y[0]) });
      }
    }
    // 箱の共回転粒子(E6′ 除去チャネルだけ = η=0)
    const box = [];
    for (const dt of [0.01, 0.005, 0.0025]) {
      const ub = { mode: 'exp', H0: 0, omega: 0.15, vx: 0, vy: 0, D: 80, dPower: 1 };
      const ph = { G: 0, D0: 0, kFrame: 1, q: 3, geoPN: 0, softening: 4, stateCarry: 'double' };
      const a = W.spin({ inertia: 'coordinate', inertiaGain: 0 }, ph, ub, dt, 70, 0.15);
      const b = W.spin(null, Object.assign({}, ph, { kFrame: 0 }), ub, dt, 70, 0.15);
      box.push({ dt, etaZero: a.ratio, kf0: b.ratio, diff: Math.abs(a.ratio - b.ratio) });
    }
    return { rows, idn, box };
  });
  const cur = await meas(pg);
  let base = null;
  if (fs.existsSync(BASE)) {
    const pg2 = await openPage('file://' + path.resolve(BASE));
    base = await meas(pg2);
    await pg2.close();
  }
  out.kick = { cur, base };
  for (let i = 0; i < cur.rows.length; i++) {
    const r = cur.rows[i], b = base ? base.rows[i] : null;
    console.error(`  [${r.k}] dt=${r.dt}: r=${fx(r.r, 6)}(現行 ${b ? fx(b.r, 6) : '—'})`
      + `・ΔL(粒子系)=${ex(r.dLraw)}(現行 ${b ? ex(b.dLraw) : '—'})・mc クランプ ${r.mcClamp}(現行 ${b ? b.mcClamp : '—'})`
      + `・E_mesh 残差 ${ex(Math.abs(r.mcE + r.mcEm))}・NaN=${r.nan}`);
  }
  for (const z of cur.idn) console.error(`  恒等(η=0 対 kFrame=0・頂点へも当てる=${z.vert})dt=${z.dt}: 最大状態差 ${ex(z.maxDiff)}(|x|≈${fx(z.scale, 1)})`);
  for (const z of cur.box) console.error(`  箱(η=0 対 kFrame=0)dt=${z.dt}: ${fx(z.etaZero, 8)} 対 ${fx(z.kf0, 8)}(差 ${ex(z.diff)})`);
}

// ================================================================ feta(§5 ⚡ の (f,η))
if (want('feta')) {
  const FS = [0.9, 1.0, 1.2, 1.5, 2.0], ES = [0, 0.25, 0.5, 0.75, 1];
  const S0 = SYS.psrDoubleABDFM;
  const dt = DT0 / 2;
  console.error(`[w258a] FETA: ⚡ の (f,η) ${FS.length}×${ES.length}(門あり support・dt=${dt}・${NWIN} 近点)`);
  const rows = [];
  for (const f of FS) {
    for (const e of ES) {
      const z = await pg.evaluate(({ f, e, dt, orbits, Pu, nWin, sec }) => {
        const W = window.__w258;
        // **R は宣言せず既定に任せる**(= 毎步の分離 r_sep の SPACE_MESH_SUPPORT_RSEP 倍)
        const sm = { inertia: 'coordinate', inertiaGain: e, inertiaVertices: true, inertiaSupport: 'support' };
        return W.run('psrDoubleABDFM', { fMass: f, spaceMesh: sm }, dt, orbits, Pu, nWin, sec);
      }, { f, e, dt, orbits: ORBITS, Pu: S0.Pu, nWin: NWIN, sec: S0.Tunit });
      const A = z.A || {};
      rows.push({ f, eta: e, P: A.perMean, dP: A.perMean === null || A.perMean === undefined ? null
        : (A.perMean * S0.Tunit / S0.PobsS - 1) * 100,
        degPerYr: A.degPerYr, ratio: (A.degPerYr === null || A.degPerYr === undefined) ? null : A.degPerYr / S0.omegaDot,
        nPeri: A.nPeri, unmeasured: !!A.unmeasured, e: z.eProxy, nan: z.nan, clamp: z.clampD,
        stop: z.mc && z.mc.stop, chi: z.mc && z.mc.chi, out: z.mc && z.mc.out, N: z.mc && z.mc.N });
      const r = rows[rows.length - 1];
      console.error(`  f=${f} η=${e}: ${r.unmeasured ? `未達(${r.nPeri})` : `P/観測−1=${fx(r.dP, 2)}%`}`
        + ` / ω̇=${fx(r.degPerYr, 6)} deg/yr(観測比 ${fx(r.ratio, 4)})・e=${fx(r.e, 4)}`
        + `・χ=${ex(r.chi)}・N=${r.N}・支持外=${r.out}・stop=${r.stop}・クランプ ${r.clamp}`);
    }
  }
  out.feta = { fs: FS, etas: ES, dt, nWin: NWIN, orbits: ORBITS, obsDegPerYr: S0.omegaDot, rows };
}

// ================================================================ hold(hold-out)
if (want('hold') && out.feta) {
  const cands = out.feta.rows.filter((r) => !r.unmeasured && r.dP !== null && r.ratio !== null)
    .map((r) => ({ ...r, score: Math.abs(r.dP) / 100 + Math.abs(r.ratio - 1) }))
    .sort((a, b) => a.score - b.score).slice(0, 2);
  console.error(`[w258a] HOLD: 最接近 ${cands.map((c) => `(f=${c.f},η=${c.eta})`).join(' / ')}`);
  const rows = [];
  for (const c of cands) {
    for (const id of ['psrJ1757DFM', 'psrJ1946DFM', 'psrB1534DFM']) {
      const S1 = SYS[id];
      const z = await pg.evaluate(({ id, f, e, dt, orbits, Pu, nWin, sec }) => {
        const W = window.__w258;
        const sm = { inertia: 'coordinate', inertiaGain: e, inertiaVertices: true, inertiaSupport: 'support' };
        return W.run(id, { fMass: f, spaceMesh: sm }, dt, orbits, Pu, nWin, sec);
      }, { id, f: c.f, e: c.eta, dt: out.feta.dt, orbits: ORBITS, Pu: S1.Pu, nWin: NWIN, sec: S1.Tunit });
      const A = z.A || {};
      const P = A.perMean === null || A.perMean === undefined ? null : A.perMean * S1.Tunit;
      const resP = (P === null) ? null : (P / S1.PobsS - 1) * 100;
      const sigP = (P === null || !S1.PobsSigmaS) ? null : (P - S1.PobsS) / S1.PobsSigmaS;
      const sigW = (A.degPerYr === null || A.degPerYr === undefined || !S1.omegaDotSigma) ? null
        : (A.degPerYr - S1.omegaDot) / S1.omegaDotSigma;
      rows.push({ point: `f=${c.f},η=${c.eta}`, id, label: S1.label, P, resP, sigP,
        degPerYr: A.degPerYr, ratio: (A.degPerYr === null || A.degPerYr === undefined) ? null : A.degPerYr / S1.omegaDot,
        sigW, nPeri: A.nPeri, unmeasured: !!A.unmeasured, e: z.eProxy, nan: z.nan });
      const r = rows[rows.length - 1];
      console.error(`  [${r.point}] ${r.label}: ${r.unmeasured ? `未達(${r.nPeri})` : `P=${fx(r.P, 3)} s(${fx(r.resP, 4)}%・${ex(r.sigP)}σ)`}`
        + ` / ω̇=${fx(r.degPerYr, 6)} deg/yr(比 ${fx(r.ratio, 5)}・${ex(r.sigW)}σ)・e=${fx(r.e, 6)}`);
    }
  }
  out.hold = { cands, rows };
}

out.pageErrors = pageErrors;
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
console.error(`[w258a] pageErrors=${pageErrors.length} → ${path.relative(ROOT, OUT)}`);
await browser.close();
