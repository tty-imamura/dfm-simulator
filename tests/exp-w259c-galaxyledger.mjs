// 第259便c(第51報): 銀河・帳簿・表示統一の実測器。
//
// 原仮定者(第51報・原文は docs/PHYSICS.md 〔第259便c〕に引用):
//   「早期に…銀河サンプルを完成させる」
//   「空間メッシュへの影響は、確実に距離で減衰するが、『距離の二乗に反比例する』が正しいかは、
//    検証が必要。『背景決定力 D₀=0』の場合は、背景宇宙による空間メッシュへの影響が無い」
//
// 測る量(すべて**実測して決める** —— 予想は書かない):
//   ① bg:"static" を 🎠🌌🎡 の既定にした後の**場の対照**(第258便b ① の 6 倍感度の再確認 1 行)
//   ② **E_escaped**: 宣言した半径 R の通過流束と、残存系との重力相互作用。
//      🎠🎻 の 6000 步で K+U+E_mesh+Q+E_escaped の残差(第258便b の 1e−3 門と並べる)
//   ③ **meshEnergyCapacity**(E₀ の正名): 🎠 で宣言 0/1e3/1e5 の残差表
//   ④ **2D 連鎖**(環 × 方位)の **m=2 応答**: 環ごと・剛性 3 段の |c₂|/|c₀| と位相遅れ
//   ⑤ **銀河の減衰指数**: 単一源と全円盤で u(r) を測り指数を fit(D₀ 3 段 + D₀=0)
//   ⑥ **fieldApi フラグ**: 共通場 API が無いとき現行経路とビット同一
//
// **粒子の力へは 1 バイトも接続していない**(表示と記録の層)。**観測回転曲線は 1 つも入力していない。**
// **「銀河サンプルが完成した」「平坦回転曲線が自律維持」「格子が巻く=渦状腕の自律生成」とは書かない。**
//
// 実行: node tests/exp-w259c-galaxyledger.mjs [--bg] [--escape] [--cap] [--chain2d] [--decay] [--api]
// 出力: tests/out/w259c-galaxyledger.json(未コミット —— 数値は PHYSICS に全載)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + (path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET));
const OUT = process.env.W259C_OUT || path.join(ROOT, 'tests', 'out', 'w259c-galaxyledger.json');
const argv = process.argv.slice(2).filter((a) => a.startsWith('--')).map((a) => a.slice(2));
const want = (k) => !argv.length || argv.includes(k);

const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let browser;
try { browser = await req('playwright').chromium.launch(); }
catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }

const pg = await browser.newPage();
const pageErrors = [];
pg.on('pageerror', (e) => pageErrors.push(String(e.message || e)));
await pg.goto(INDEX, { waitUntil: 'load' });
await pg.waitForFunction(() => window.HP && HP.sim);

const out = { target: TARGET, node: process.version, at: new Date().toISOString(), wave: '259c' };

await pg.evaluate(() => {
  const W = (window.__w259c = {});
  W.byId = (id) => HP.allPresets().find((p) => p.id === id);
  W.build = (id, steps, patch) => {
    const pd = JSON.parse(JSON.stringify(W.byId(id)));
    if (patch) patch(pd);
    const v = HP.validatePreset(pd);
    if (!v.ok) throw new Error('invalid ' + id + ' ' + JSON.stringify(v.errors || v.err));
    const S = HP.sim; S.build(v.preset);
    for (let k = 0; k < (steps || 0); k++) S.step(0.016);
    S._galSup = null;
    return S;
  };
  W.snap = (S) => { const a = [];
    for (const k of ['x', 'y', 'vx', 'vy', 'spin', 'm', 'R']) for (let i = 0; i < S.n; i++) a.push(S[k][i]);
    return a; };
  W.bitSame = (a, b) => a.length === b.length && a.every((z, i) => Object.is(z, b[i]));
});

// ---------- ① bg:"static" を既定にした後の場の対照(第258便b ① の再確認 1 行)
if (want('bg')) {
  out.bg = await pg.evaluate(() => {
    const S = window.__w259c.build('galaxyMeshSpiral', 0);
    const P = [50, 30];
    const rd = (o) => HP.dfmGalaxyMeshField(S, P[0], P[1], Object.assign({ need: 'u' }, o));
    const decl = rd({});                             // 宣言どおり(= bg:"static")
    const frq1 = rd({ bg: 'frame', q: undefined });
    // q を変える対照は params 側を触るしかないので、診断コピーで q を差し替える
    const withQ = (q, bg) => { const S2 = window.__w259c.build('galaxyMeshSpiral', 0, (pd) => { pd.physics.q = q; });
      const f = HP.dfmGalaxyMeshField(S2, P[0], P[1], { need: 'u', bg });
      return { u: [f.u[0], f.u[1]], mag: Math.hypot(f.u[0], f.u[1]), chi: f.chi, bg: f.bg }; };
    const f1 = withQ(1, 'frame'), f6 = withQ(6, 'frame');
    const s1 = withQ(1, 'static'), s6 = withQ(6, 'static');
    const d1 = (() => { const S2 = window.__w259c.build('galaxyMeshSpiral', 0);
      const f = HP.dfmGalaxyMeshField(S2, P[0], P[1], { need: 'u' });
      return { u: [f.u[0], f.u[1]], mag: Math.hypot(f.u[0], f.u[1]), chi: f.chi, bg: f.bg }; })();
    // r ビン(方位 32 点平均)。宣言どおりの読み(static)と frame 対照
    const rbin = (S2, r, bg) => { let s = 0, n = 0, chi = 0;
      for (let k = 0; k < 32; k++) { const th = 2 * Math.PI * k / 32;
        const f = HP.dfmGalaxyMeshField(S2, r * Math.cos(th), r * Math.sin(th),
          bg === undefined ? { need: 'u' } : { need: 'u', bg });
        if (!f) continue; s += Math.hypot(f.u[0], f.u[1]); chi += f.chi; n++; }
      return n ? { mag: s / n, chi: chi / n, n } : null; };
    const S3 = window.__w259c.build('galaxyMeshSpiral', 0);
    const rows = [20, 80, 140, 240].map((r) => ({ r,
      declared: rbin(S3, r), frame: rbin(S3, r, 'frame'), stat: rbin(S3, r, 'static') }));
    return { declaredBg: decl.bg, declaredIsStatic: decl.bg === 'static',
      point: P, chi: d1.chi,
      frameQ1: f1, frameQ6: f6, staticQ1: s1, staticQ6: s6,
      ratioQ: f1.mag / f6.mag,
      staticQBit: Object.is(s1.u[0], s6.u[0]) && Object.is(s1.u[1], s6.u[1]),
      declEqStatic: Object.is(d1.u[0], s1.u[0]) && Object.is(d1.u[1], s1.u[1]),
      rows,
      declOverride: HP.dfmGalaxyMeshField(S3, P[0], P[1], { need: 'u', bg: 'frame' }).bg };
  });
}

// ---------- ② E_escaped(境界通過流束)と 6000 步の帳簿
if (want('escape')) {
  out.escape = await pg.evaluate(() => {
    const run = (id, steps, R, stride, E0) => {
      const S = window.__w259c.build(id, 0, (pd) => {
        if (E0 !== undefined && E0 !== null)
          pd.physics.spaceMesh = { mode: 'vertex', meshEnergyCapacity: E0 }; });
      const a = HP.dfmToyLedger(S, {});
      const rec = HP.dfmEscapeLedger(S, { R });
      if (!rec) return { id, err: 'rec-null' };
      const n0 = S.n;
      let up = HP.dfmEscapeUpdate(rec, S);
      for (let k = 0; k < steps; k++) { S.step(0.016);
        if ((k + 1) % stride === 0 || k === steps - 1) up = HP.dfmEscapeUpdate(rec, S); }
      const b = HP.dfmToyLedger(S, { ref: a, escape: rec });
      const bNo = HP.dfmToyLedger(S, { ref: a });
      return { id, emoji: window.__w259c.byId(id).emoji, n0, n1: S.n, R, stride, steps, E0: E0 === undefined ? null : E0,
        rMax: (() => { let mx = 0; const c = [0, 0];
          let M = 0, cx = 0, cy = 0;
          for (let i = 0; i < S.n; i++) { if (!(S.m[i] > 0)) continue; M += S.m[i]; cx += S.m[i] * S.x[i]; cy += S.m[i] * S.y[i]; }
          if (M > 0) { c[0] = cx / M; c[1] = cy / M; }
          for (let i = 0; i < S.n; i++) { const d = Math.hypot(S.x[i] - c[0], S.y[i] - c[1]); if (d > mx) mx = d; }
          return mx; })(),
        meshCapState: b.meshCapState, meshSupplied: b.meshSupplied, Emesh0: b.Emesh0,
        K: b.K, U: b.U, Q: b.Q, Emesh: b.Emesh, Eesc: b.Eescaped, EescBodies: b.EescapedBodies,
        Etot: b.Etot, Wext: b.Wext, residual: b.residual, residualDrag: b.residualDrag,
        EtotCore: b.EtotCore,
        rel: Math.abs(b.residual) / (Math.abs(b.EtotCore) || 1),
        relDrag: b.residualDrag === null ? null : Math.abs(b.residualDrag) / (Math.abs(b.EtotCore) || 1),
        undef: b.undefinedTerms, undefNoEsc: bNo.undefinedTerms,
        escape: b.escape, dragWorkN: b.dragWorkN, Wdrag: b.Wdrag, WdragKE: b.WdragKE,
        nOut: rec.nOut, nOut0: rec.nOut0, crossOut: rec.crossOut, crossIn: rec.crossIn,
        Eflux: rec.Eflux, Kflux: rec.Kflux, Uflux: rec.Uflux, Uint: rec.Uint, Kout: rec.Kout };
    };
    const o = { rows: [] };
    o.rows.push(run('galaxyMeshSpiral', 6000, 260, 25, 1e6));
    o.rows.push(run('galaxyMeshSpiral', 6000, 260, 25));
    o.rows.push(run('gw150914DFM', 6000, 700, 25, 1e6));
    o.rows.push(run('gw150914DFM', 6000, 700, 25));
    o.rows.push(run('tuc47', 6000, 150, 25));
    o.rows.push(run('tuc47', 6000, 300, 25));
    o.rows.push(run('gas', 6000, 300, 25));
    // 記録器は S を 1 バイトも書かない(同じ走行を記録器あり/なしで比べる)
    const bit = (() => {
      const S1 = window.__w259c.build('galaxyMeshSpiral', 0);
      for (let k = 0; k < 300; k++) S1.step(0.016);
      const s1 = window.__w259c.snap(S1);
      const S2 = window.__w259c.build('galaxyMeshSpiral', 0);
      const rec = HP.dfmEscapeLedger(S2, { R: 400 });
      for (let k = 0; k < 300; k++) { S2.step(0.016); HP.dfmEscapeUpdate(rec, S2); }
      return window.__w259c.bitSame(s1, window.__w259c.snap(S2));
    })();
    o.recorderBitSame = bit;
    o.gates = { nullS: HP.dfmEscapeLedger(null, { R: 1 }) === null,
      badR: HP.dfmEscapeLedger(HP.sim, { R: 0 }) === null,
      negR: HP.dfmEscapeLedger(HP.sim, { R: -5 }) === null,
      badCenter: HP.dfmEscapeLedger(HP.sim, { R: 10, center: [NaN, 0] }) === null };
    return o;
  });
}

// ---------- ③ meshEnergyCapacity(E₀ の正名)の残差表
if (want('cap')) {
  out.cap = await pg.evaluate(() => {
    const run = (E0, steps) => {
      const S = window.__w259c.build('galaxyMeshSpiral', 0, (pd) => {
        if (E0 !== null) pd.physics.spaceMesh = { mode: 'vertex', meshEnergyCapacity: E0 }; });
      const a = HP.dfmToyLedger(S, {});
      for (let k = 0; k < steps; k++) S.step(0.016);
      const b = HP.dfmToyLedger(S, { ref: a });
      return { E0, Emesh: b.Emesh, Emesh0: b.Emesh0, supplied: b.meshSupplied,
        capState: b.meshCapState, Etot: b.Etot, EtotCore: b.EtotCore,
        residual: b.residual, residualDrag: b.residualDrag,
        rel: Math.abs(b.residual) / (Math.abs(b.EtotCore) || 1),
        identical: (b.residual !== null && b.residualDrag !== null)
          ? Math.abs(b.residual - b.residualDrag) : null,
        undef: b.undefinedTerms, state: window.__w259c.snap(HP.sim) };
    };
    const rows = [null, 0, 1e3, 1e5].map((E0) => run(E0, 600));
    const base = rows[0].state;
    for (const r of rows) { r.bitSame = window.__w259c.bitSame(base, r.state); delete r.state; }
    // 供給を記録していない宇宙(dragWork を外す)では E_mesh は未定義(0 で埋めない)
    const noDrag = (() => {
      const S = window.__w259c.build('galaxyMeshSpiral', 0, (pd) => {
        delete pd.physics.ledger;
        pd.physics.spaceMesh = { mode: 'vertex', meshEnergyCapacity: 1e3 }; });
      const b = HP.dfmToyLedger(S, {});
      return { Emesh: b.Emesh, undef: b.undefinedTerms.indexOf('Emesh') >= 0, capState: b.meshCapState };
    })();
    const canon = (E0) => { const pd = JSON.parse(JSON.stringify(window.__w259c.byId('galaxyMeshSpiral')));
      if (E0 !== null) pd.physics.spaceMesh = { mode: 'vertex', meshEnergyCapacity: E0 };
      const v = HP.validatePreset(pd);
      return v.ok ? JSON.stringify(v.preset.physics.spaceMesh || null) : 'INVALID'; };
    return { rows, noDrag,
      canonAbsent: canon(null), canon1e3: canon(1e3), canon0: canon(0),
      gates: { negative: (() => { const pd = JSON.parse(JSON.stringify(window.__w259c.byId('galaxyMeshSpiral')));
          pd.physics.spaceMesh = { mode: 'vertex', meshEnergyCapacity: -1 };
          return HP.validatePreset(pd).ok === false; })(),
        nan: (() => { const pd = JSON.parse(JSON.stringify(window.__w259c.byId('galaxyMeshSpiral')));
          pd.physics.spaceMesh = { mode: 'vertex', meshEnergyCapacity: 'x' };
          return HP.validatePreset(pd).ok === false; })() } };
  });
}

// ---------- ④ 2D 連鎖(環 × 方位)の m=2 応答
if (want('chain2d')) {
  out.chain2d = await pg.evaluate(() => {
    const base = { rings: 4, sectors: 12, rIn: 40, rOut: 200, mu: 1, tau: 8, zeta: 1,
      gammaBg: 0.05, D0: 1.5, p: 2, eps: 3,
      drive: { mass: 1250, r: 60, omega: 0.05, phase: 0 } };
    const runOne = (patch, turns, dt) => {
      const spec = Object.assign({}, base, patch || {});
      const ch = HP.dfmChainMesh2DBuild(spec);
      if (!ch) return { err: 'build-null' };
      const T = 2 * Math.PI / spec.drive.omega;      // 駆動の 1 回転
      const steps = Math.round(turns * T / dt);
      let worst = 0, sumRel = 0;
      for (let k = 0; k < steps; k++) { const r = HP.dfmChainMesh2DStep(ch, dt);
        if (!r) return { err: 'step-null' };
        const rel = Math.abs(r.residual) / (Math.abs(r.Em) + Math.abs(r.Q) + Math.abs(r.Wext) || 1);
        if (rel > worst) worst = rel; sumRel += rel; }
      const md = HP.dfmChainMesh2DModes(ch, 2);
      const e = HP.dfmChainMesh2DEnergy(ch);
      return { steps, dt, T, kScale: spec.kScale === undefined ? 1 : spec.kScale,
        bond: spec.bond || 'linear', Em: e.Em, Q: ch.Q, Wext: ch.Wext, L: e.L, P: e.P,
        worstRel: worst, meanRel: sumRel / steps,
        rows: md.rows.map((r) => ({ ring: r.ring, r: r.r, c0: r.c0, c2: r.cm,
          ratio: r.ratio, lagDeg: r.lagDeg, rms: r.rms, c2t: r.cmTang })) };
    };
    const o = { base, stiff: [], bonds: [] };
    for (const ks of [0.25, 1, 4]) o.stiff.push(runOne({ kScale: ks }, 6, 0.5));
    for (const bd of ['linear', 'central']) o.bonds.push(runOne({ bond: bd }, 6, 0.5));
    // 収束次数(dt 3 段・短い窓)と、駆動なしの恒等(ΔE_m+ΔQ=0)
    o.order = [1.0, 0.5, 0.25].map((dt) => {
      const ch = HP.dfmChainMesh2DBuild(base);
      const steps = Math.round(40 / dt);
      let last = null;
      for (let k = 0; k < steps; k++) last = HP.dfmChainMesh2DStep(ch, dt);
      const e = HP.dfmChainMesh2DEnergy(ch);
      return { dt, steps, Em: e.Em, Q: ch.Q, Wext: ch.Wext,
        residual: e.Em + ch.Q - ch.Wext, rel: Math.abs(e.Em + ch.Q - ch.Wext) / (Math.abs(ch.Wext) || 1) };
    });
    o.noDrive = (() => {
      const ch = HP.dfmChainMesh2DBuild(Object.assign({}, base, { drive: null }));
      for (let i = 0; i < ch.n; i++) { ch.U[2 * i] = 0.3 * Math.cos(ch.nodes[i].theta * 2);
        ch.U[2 * i + 1] = 0.3 * Math.sin(ch.nodes[i].theta * 2); }
      const e0 = HP.dfmChainMesh2DEnergy(ch);
      for (let k = 0; k < 400; k++) HP.dfmChainMesh2DStep(ch, 0.25);
      const e1 = HP.dfmChainMesh2DEnergy(ch);
      return { Em0: e0.Em, Em1: e1.Em, Q: ch.Q, Wext: ch.Wext,
        residual: (e1.Em - e0.Em) + ch.Q - ch.Wext,
        rel: Math.abs((e1.Em - e0.Em) + ch.Q - ch.Wext) / (Math.abs(e0.Em) || 1), Qnonneg: ch.Q >= 0 };
    })();
    // 決定性(同じ宣言の 2 回の走行がビット同一)
    o.deterministic = (() => {
      const go = () => { const ch = HP.dfmChainMesh2DBuild(base);
        for (let k = 0; k < 200; k++) HP.dfmChainMesh2DStep(ch, 0.5);
        return Array.from(ch.xi).concat(Array.from(ch.U)); };
      const a = go(), b = go();
      return a.every((z, i) => Object.is(z, b[i]));
    })();
    o.gates = { badRings: HP.dfmChainMesh2DBuild({ rings: 0 }) === null,
      tooManyRings: HP.dfmChainMesh2DBuild({ rings: 99 }) === null,
      badSectors: HP.dfmChainMesh2DBuild({ sectors: 3 }) === null,
      badBond: HP.dfmChainMesh2DBuild({ bond: 'spring' }) === null,
      negDt: (() => { const ch = HP.dfmChainMesh2DBuild(base);
        return HP.dfmChainMesh2DStep(ch, -0.1) === null; })(),
      nyquist: (() => { const ch = HP.dfmChainMesh2DBuild({ sectors: 4 });
        return HP.dfmChainMesh2DModes(ch, 2) === null; })(),
      badD0: HP.dfmChainMesh2DBuild({ D0: -1 }) === null };
    return o;
  });
}

// ---------- ⑤ 銀河の減衰指数(第51報「距離の二乗に反比例するが正しいか」)
if (want('decay')) {
  out.decay = await pg.evaluate(() => {
    const fit = (rs, us) => {   // ln|u| = a + b ln r の最小二乗(b が減衰指数の符号付き)
      let n = 0, sx = 0, sy = 0, sxx = 0, sxy = 0;
      for (let i = 0; i < rs.length; i++) { const u = us[i];
        if (!(u > 0) || !Number.isFinite(u)) continue;
        const X = Math.log(rs[i]), Y = Math.log(u);
        n++; sx += X; sy += Y; sxx += X * X; sxy += X * Y; }
      if (n < 2) return null;
      const d = n * sxx - sx * sx;
      if (!(Math.abs(d) > 0)) return null;
      const b = (n * sxy - sx * sy) / d, a = (sy - b * sx) / n;
      let ss = 0, st = 0; const ym = sy / n;
      for (let i = 0; i < rs.length; i++) { const u = us[i];
        if (!(u > 0) || !Number.isFinite(u)) continue;
        const X = Math.log(rs[i]), Y = Math.log(u);
        ss += (Y - (a + b * X)) * (Y - (a + b * X)); st += (Y - ym) * (Y - ym); }
      return { slope: b, intercept: a, r2: st > 0 ? 1 - ss / st : null, n };
    };
    const S = window.__w259c.build('galaxyMeshSpiral', 0);
    const pw = HP.frameWeightPow ? HP.frameWeightPow(S.params) : null;
    const eps = S.params.softening;
    const Rref = 251.26;                              // 🎠 の粒子の最外縁(第258便b ⑤)
    const radii = [];
    for (let i = 0; i <= 12; i++) radii.push(Rref * 0.5 * Math.pow(16, i / 12));   // R/2 … 8R
    // (a) **単一源**(バルジのみ・速度を持たせる —— 静止した源では u_n=0 で指数が読めない)
    const single = (D0) => {
      const src = [{ m: 2500, x: 0, y: 0, vx: 0, vy: 5 }];
      const us = radii.map((r) => { const f = HP.dfmGalaxyMeshField(src, r, 0,
        { D0, p: 2, eps, need: 'u', bg: 'static' });
        return f ? Math.hypot(f.u[0], f.u[1]) : NaN; });
      const chis = radii.map((r) => { const f = HP.dfmGalaxyMeshField(src, r, 0,
        { D0, p: 2, eps, need: 'u', bg: 'static' }); return f ? f.chi : NaN; });
      return { D0, u: us, chi: chis, fitAll: fit(radii, us),
        fitFar: fit(radii.slice(6), us.slice(6)),
        flat: us.every((z) => Math.abs(z - us[0]) <= 1e-12 * Math.abs(us[0])) };
    };
    // (b) **全円盤**(🎠 の粒子そのもの・宣言どおりの disk/affine/static)
    const disk = (D0) => {
      const us = radii.map((r) => { let s = 0, n = 0;
        for (let k = 0; k < 16; k++) { const th = 2 * Math.PI * k / 16;
          const f = HP.dfmGalaxyMeshField(S, r * Math.cos(th), r * Math.sin(th), { D0, need: 'u' });
          if (!f) continue; s += Math.hypot(f.u[0], f.u[1]); n++; }
        return n ? s / n : NaN; });
      const chis = radii.map((r) => { const f = HP.dfmGalaxyMeshField(S, r, 0, { D0, need: 'u' });
        return f ? f.chi : NaN; });
      return { D0, u: us, chi: chis, fitAll: fit(radii, us), fitFar: fit(radii.slice(6), us.slice(6)) };
    };
    // p の掃引(**m/r と m/r² は単位が違う** —— 無次元化の宣言を出力に残す)
    const pSweep = [1, 2, 3].map((p) => {
      const src = [{ m: 2500, x: 0, y: 0, vx: 0, vy: 5 }];
      const us = radii.map((r) => { const f = HP.dfmGalaxyMeshField(src, r, 0,
        { D0: 1.5, p, eps, need: 'u', bg: 'static' });
        return f ? Math.hypot(f.u[0], f.u[1]) : NaN; });
      return { p, fitFar: fit(radii.slice(6), us.slice(6)), uFar: us[us.length - 1] };
    });
    return { radii, Rref, eps, pw,
      nondim: { Mstar: 2500, Lstar: Rref, Tstar: Rref / 5,
        note: 'M*・L*・T* を宣言して無次元化する(m/r と m/r² は単位が違うので p 掃引は生の値で比べない)' },
      single: [0, 1.5, 15].map(single), disk: [0, 1.5, 15].map(disk), pSweep };
  });
}

// ---------- ⑥ fieldApi フラグ(共通場 API が無いときは現行経路とビット同一)
if (want('api')) {
  out.api = await pg.evaluate(() => {
    const S = window.__w259c.build('galaxyMeshSpiral', 0);
    const grid = () => { const g = HP.spaceGridDebug ? HP.spaceGridDebug(S) : null; return g; };
    const has = typeof HP.dfmField === 'function';
    const before = HP.meshFieldApi(S), liveBefore = HP.meshFieldApiLive(S);
    S.overlays.spaceMesh.fieldApi = true;
    const after = HP.meshFieldApi(S), liveAfter = HP.meshFieldApiLive(S);
    S.overlays.spaceMesh.fieldApi = false;
    return { hasField: has, before, liveBefore, after, liveAfter, gridProbe: !!grid };
  });
}

await browser.close();
fs.mkdirSync(path.dirname(OUT), { recursive: true });
out.pageErrors = pageErrors;
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log('wrote', OUT, 'pageErrors', pageErrors.length);
