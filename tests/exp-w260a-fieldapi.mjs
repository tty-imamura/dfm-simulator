// 第260便a W1「空間メッシュ統一 — 表示とトイが同じ `HP.dfmField` を読む(入場条件 (v))」(第52報)。
//
// 原仮定者(第52報):「実機確認: 済み」「進め方は、空間メッシュの実装を優先する。早期にコンパクト
//   天体連星サンプルと銀河サンプルを完成させる。中性子星連星までの現実較正を終える」。
//
// 本器が測るのは数だけである(予想は 1 つも書かない・Failure First)。
// **「表示と力が同じ場になった」とは書かない** —— 銀河の既存表示(disk/affine の u_n)と
// 全源 scalar の診断場は**別の場**であり、本器はその**差を数で置く**ためにある。
//
// ■ 節(--snap --grid --bound --instep --p --bit・複数指定可・無指定は全部)
//   snap  : §1 状態アダプタ `HP.dfmFieldSnapshot(S)` の契約(拒否理由・options・時間微分は不完全)
//   grid  : §2 恒等 —— fieldApi:false の格子交点が基点とビット同一 / true で 🪟🎠 とも 81/81 /
//           同一点の |u_api − u_current| の表(**一致は主張しない**)
//   bound : §3 API 境界 3 件(数値 ID の除外・空 complex は null・timeDerivativeComplete の正直化)
//   instep: §4 残余トルク契約 —— η=0 対 kFrame=0 の ΔP・ΔL 帳簿残差(post / inStep 旧 / inStep 新)
//   p     : §5 ⚡ の p 掃引 3 行(lawVersion scalar/local × p=1/2/3 の P と ω̇)。**較正ではない**
//   bit   : §6 全内蔵プリセット × 600 步 + 🪟+リング 3000 步のトイを基点 html と突き合わせる
//
// 実行: node tests/exp-w260a-fieldapi.mjs [--節...] [--fast]
//       W260A_BASE=<基点 html>(既定 beta/_w260_base.html = git show bbc554d:beta/index.html)
// 出力: tests/out/fieldapi-w260a.json(数値は docs/PHYSICS.md〔第260便a〕へ全載)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + path.join(ROOT, TARGET);
const BASE = process.env.W260A_BASE || path.join(ROOT, 'beta', '_w260_base.html');
const OUT = path.join(ROOT, 'tests', 'out', 'fieldapi-w260a.json');
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

// ============================================================ §1 状態アダプタの契約
if (want('snap')) {
  R.snap = await page.evaluate(() => {
    const O = {};
    const mk = (id) => { HP.loadPreset(id, false); return HP.sim; };
    const rd = (S) => { const z = HP.dfmFieldSnapshot(S);
      return z ? { stop: z.stop, n: z.n, tdc: z.timeDerivativeComplete, role: z.fieldRole,
        opt: z.options ? JSON.parse(JSON.stringify(z.options)) : null,
        hasAcc: z.bodies ? z.bodies.some((b) => b.ax !== undefined || b.ay !== undefined) : null,
        first: z.bodies ? z.bodies[0] : null } : null; };
    O.window = rd(mk('spaceMeshBinaryToy'));
    O.galaxy = rd(mk('galaxyMeshSpiral'));
    // 拒否 4 件(理由を返す —— 黙って落とさない)
    const S = mk('spaceMeshBinaryToy');
    const KEY = HP.SPACE_MESH_KEY;
    const P = (id) => JSON.parse(JSON.stringify(HP.allPresets().find((z) => z.id === id)));
    const build = (q) => { const v = HP.validatePreset(q); if (!v.ok) return { err: (v.errors || []).join('|') };
      const T = HP.sim; T.build(v.preset); return rd(T); };
    const qc = P('spaceMeshBinaryToy');
    qc.physics.kFrame = 0; qc.physics.geoPN = 3;
    qc.physics[KEY] = { mode: 'vertex', lawVersion: 'complex' };
    O.rejectComplex = build(qc);
    O.rejectLayers = (() => { const q = P('layeredCoreDFM'); return q ? build(q) : { err: 'no preset' }; })();
    O.rejectBox = build(P('boxcomoving'));
    // local を宣言した宇宙(R と Ṙ が options に入る)
    const ql = P('spaceMeshBinaryToy');
    ql.physics.kFrame = 0; ql.physics.geoPN = 3;
    ql.physics[KEY] = { mode: 'vertex', lawVersion: 'local' };
    O.local = build(ql);
    // アダプタ経由の場と、純関数 dfmField を直に呼んだ場の差(**同じ点**)
    HP.loadPreset('spaceMeshBinaryToy', false);
    const T = HP.sim, sn = HP.dfmFieldSnapshot(T);
    let du = 0, dc = 0;
    if (sn && sn.bodies) {
      const pr = HP.spaceGridFieldProbe(T, [[10, 10], [300, -120], [-800, 400]]);
      for (let k = 0; k < pr.rows.length; k++) {
        const q = [[10, 10], [300, -120], [-800, 400]][k];
        const f = HP.dfmField(sn.bodies, q[0], q[1], sn.options);
        const a = pr.rows[k].api;
        if (!f || !a) { du = Infinity; continue; }
        du = Math.max(du, Math.abs(f.u[0] - a[0]), Math.abs(f.u[1] - a[1]));
        dc = Math.max(dc, Math.abs((f.chi === null ? 1 : f.chi) - a[2]));
      }
    }
    O.adapterVsPure = { du, dc, note: 'アダプタ経由と純関数直呼びの差(同一点)' };
    return O;
  });
}

// ============================================================ §2 恒等 QA と差の表
if (want('grid')) {
  const gridOf = (pg) => pg.evaluate(() => {
    const out = {};
    for (const id of ['spaceMeshBinaryToy', 'galaxyMeshSpiral']) {
      HP.loadPreset(id, false);
      const T = HP.sim;
      const grab = () => { HP.spaceGridInvalidate(T); HP.spaceGridEnsure(T);
        const c = T._smgCache, g = c && c.grid;
        return g ? { X: Array.from(g.X), Y: Array.from(g.Y), ok: Array.from(g.ok), nOk: g.nOk,
          nodes: g.nodes, K: g.K, R: g.R, cx: g.cx, cy: g.cy, h: g.h,
          apiNote: (c.apiNote === undefined ? null : c.apiNote), fieldApi: (c.fieldApi === true),
          sampleBad: g.sampleBad, samples: g.samples, folds: g.folds } : null; };
      const off = grab();
      T.overlays.spaceMesh = Object.assign({}, T.overlays.spaceMesh, { fieldApi: true });
      const on = grab();
      // 同じ 81 交点(**未変形の格子位置**)で現行の場と API の場を両方読む
      let probe = null;
      if (off && typeof HP.spaceGridFieldProbe === 'function') {
        const pts = [];
        for (let j = 0; j < off.K; j++) for (let i = 0; i < off.K; i++) pts.push([off.cx - off.R + i * off.h, off.cy - off.R + j * off.h]);
        const pr = HP.spaceGridFieldProbe(T, pts);
        const rows = pr.rows.map((z, k) => ({ x: pts[k][0], y: pts[k][1], cur: z.cur, api: z.api }));
        let nCur = 0, nApi = 0, dMax = 0, dSum = 0, nBoth = 0, rMax = 0, curMax = 0, apiMax = 0, dChi = 0;
        for (const z of rows) {
          if (z.cur) nCur++;
          if (z.api) nApi++;
          if (z.cur && z.api) {
            const d = Math.hypot(z.cur[0] - z.api[0], z.cur[1] - z.api[1]);
            const c0 = Math.hypot(z.cur[0], z.cur[1]), a0 = Math.hypot(z.api[0], z.api[1]);
            dMax = Math.max(dMax, d); dSum += d; nBoth++;
            curMax = Math.max(curMax, c0); apiMax = Math.max(apiMax, a0);
            rMax = Math.max(rMax, d / Math.max(c0, 1e-300));
            dChi = Math.max(dChi, Math.abs(z.cur[2] - z.api[2]));
            }
        }
        probe = { kind: pr.kind, apiNote: pr.apiNote, apiLaw: pr.apiLaw, n: rows.length,
          nCur, nApi, nBoth, dMax, dMean: nBoth ? dSum / nBoth : null, relMax: rMax,
          curMax, apiMax, dChiMax: dChi,
          sample: rows.filter((z, k) => k % 10 === 0).slice(0, 9) };
      }
      T.overlays.spaceMesh = Object.assign({}, T.overlays.spaceMesh, { fieldApi: false });
      const off2 = grab();
      out[id] = { off, on, off2, probe };
    }
    return out;
  });
  const cur = await gridOf(page);
  let base = null;
  if (fs.existsSync(BASE)) { const bp = await openPage('file://' + BASE); base = await gridOf(bp); await bp.close(); }
  const bit = (a, b) => !!a && !!b && a.X.length === b.X.length
    && a.X.every((z, i) => Object.is(z, b.X[i])) && a.Y.every((z, i) => Object.is(z, b.Y[i]));
  R.grid = {};
  for (const id of Object.keys(cur)) {
    const c = cur[id], b = base ? base[id] : null;
    R.grid[id] = {
      offVsBase: b ? bit(c.off, b.off) : null,
      offRestored: bit(c.off, c.off2),
      nOkOff: c.off ? c.off.nOk : null, nodesOff: c.off ? c.off.nodes : null,
      nOkOn: c.on ? c.on.nOk : null, nodesOn: c.on ? c.on.nodes : null,
      apiNoteOn: c.on ? c.on.apiNote : null, fieldApiOn: c.on ? c.on.fieldApi : null,
      apiNoteOff: c.off ? c.off.apiNote : null,
      sampleBadOn: c.on ? c.on.sampleBad : null, samplesOn: c.on ? c.on.samples : null,
      foldsOff: c.off ? c.off.folds : null, foldsOn: c.on ? c.on.folds : null,
      onDiffersFromOff: (c.off && c.on) ? !bit(c.off, c.on) : null,
      probe: c.probe,
      baseMissing: !base,
    };
  }
}

// ============================================================ §3 API 境界 3 件
if (want('bound')) {
  R.bound = await page.evaluate(() => {
    const O = {};
    // ① excludeBodyId は**数値 ID だけ**を除外する(添字は ID 未宣言時の代替)
    const BD = [{ id: 1, m: 7, x: 100, y: 0, vx: 0, vy: 0, ax: 0, ay: 0 },
      { id: 9, m: 3, x: 0, y: 0, vx: 0, vy: 0, ax: 0, ay: 0 }];
    const f1 = HP.dfmField(BD, 2, 0, { excludeBodyId: 1, eps: 1, D0: 1 });
    const f9 = HP.dfmField(BD, 2, 0, { excludeBodyId: 9, eps: 1, D0: 1 });
    const noId = [{ m: 7, x: 100, y: 0, vx: 0, vy: 0 }, { m: 3, x: 0, y: 0, vx: 0, vy: 0 }];
    const fi = HP.dfmField(noId, 2, 0, { excludeBodyId: 0, eps: 1, D0: 1 });
    O.exclude = { byId1: f1 ? { D: f1.D, ids: f1.sourceIds } : null,
      byId9: f9 ? { D: f9.D, ids: f9.sourceIds } : null,
      byIndex0: fi ? { D: fi.D, ids: fi.sourceIds } : null,
      expect: 3 / Math.sqrt(5) };
    // ② complex の D₀=0・源なしは null(A=[0,0] を「静止した場」として返さない)
    O.complexEmpty = { empty: HP.dfmField([], 1, 1, { lawVersion: 'complex' }),
      emptyD0: HP.dfmField([], 1, 1, { lawVersion: 'complex', D0: 5 }),
      excludedAll: HP.dfmField([{ id: 3, m: 1, x: 0, y: 0, vx: 1, vy: 0 }], 1, 1,
        { lawVersion: 'complex', excludeBodyId: 3 }),
      oneSource: (() => { const z = HP.dfmField([{ id: 3, m: 1, x: 0, y: 0, vx: 1, vy: 0, ax: 0, ay: 0 }],
        1, 1, { lawVersion: 'complex' }); return z ? { A: z.u, q: z.uQuantity, tdc: z.timeDerivativeComplete } : null; })(),
      scalarEmpty: HP.dfmField([], 1, 1, { lawVersion: 'scalar' }) };
    // ③ timeDerivativeComplete の正直化(源の ax/ay と背景微分が揃ったときだけ true)
    const WA = [{ id: 0, m: 5, x: -10, y: 0, vx: 0, vy: 0.2, ax: 0.01, ay: 0 },
      { id: 1, m: 5, x: 10, y: 0, vx: 0, vy: -0.2, ax: -0.01, ay: 0 }];
    const WN = WA.map((b) => ({ id: b.id, m: b.m, x: b.x, y: b.y, vx: b.vx, vy: b.vy }));   // ax/ay 未宣言
    const g = (bd, o) => { const z = HP.dfmField(bd, 3, 4, Object.assign({ eps: 0.5, D0: 1 }, o));
      return z ? { tdc: z.timeDerivativeComplete, acc: z.accComplete, bg: z.bgDtComplete, q: z.uQuantity } : null; };
    O.tdc = {
      scalarAcc: g(WA, {}), scalarNoAcc: g(WN, {}),
      localR: g(WA, { lawVersion: 'local', R: 60 }), localRdot: g(WA, { lawVersion: 'local', R: 60, Rdot: 0.3 }),
      localRdotNoAcc: g(WN, { lawVersion: 'local', R: 60, Rdot: 0.3 }),
      frameNoDt: g(WA, { background: 'frame', bg: { u: [1, 0] } }),
      frameDt: g(WA, { background: 'frame', bg: { u: [1, 0], dUdt: [0, 0] } }),
      complexAcc: g(WA, { lawVersion: 'complex' }), complexNoAcc: g(WN, { lawVersion: 'complex' }),
      complexFrame: g(WA, { lawVersion: 'complex', background: 'frame', bg: { u: [1, 0], dUdt: [0, 0] } }) };
    // アダプタは ax/ay を捏造しないので、その bodies を渡した dfmField も false になる
    HP.loadPreset('spaceMeshBinaryToy', false);
    const sn = HP.dfmFieldSnapshot(HP.sim);
    const fz = sn && sn.bodies ? HP.dfmField(sn.bodies, 40, 40, sn.options) : null;
    O.snapTdc = { snap: sn ? sn.timeDerivativeComplete : null,
      field: fz ? fz.timeDerivativeComplete : null, acc: fz ? fz.accComplete : null };
    return O;
  });
}

// ============================================================ §4 残余トルク契約(post / inStep 旧 / inStep 新)
if (want('instep')) {
  const runOf = (pg, nStep, dt) => pg.evaluate(([nStep, dt]) => {
    const KEY = HP.SPACE_MESH_KEY;
    const P = (id) => JSON.parse(JSON.stringify(HP.allPresets().find((z) => z.id === id)));
    const ring = [];
    for (let k = 0; k < 8; k++) { const th = 2 * Math.PI * k / 8, rr = 900;
      ring.push({ type: 'single', m: 0.5, x: rr * Math.cos(th), y: rr * Math.sin(th),
        vx: -0.026 * Math.sin(th), vy: 0.026 * Math.cos(th), spin: 0, pinned: false }); }
    const run = (sm) => {
      const q = P('spaceMeshBinaryToy');
      if (sm) q.physics[KEY] = Object.assign({ mode: 'vertex' }, q.physics[KEY] || {}, sm);
      else q.physics.kFrame = 0;
      q.bodies = q.bodies.concat(ring);
      const v = HP.validatePreset(q);
      if (!v.ok) return { err: (v.errors || []).join('|') };
      const S = HP.sim; S.build(v.preset);
      const T0 = S.totals();
      for (let k = 0; k < nStep; k++) S.step(dt);
      const T = S.totals();
      const st = []; for (let i = 0; i < S.n; i++) st.push(S.x[i], S.y[i], S.vx[i], S.vy[i], S.spin[i]);
      return { st, L0: T0.L, L: T.L, resL: S.resL,
        dP: Math.hypot(T.px - T0.px + S.resPx, T.py - T0.py + S.resPy),
        dL: (T.L - T0.L + S.resL), dLrel: Math.abs(T.L - T0.L + S.resL) / Math.max(Math.abs(T0.L), 1e-300),
        e: (S.meshCoordE !== undefined) ? Math.abs(S.meshCoordE + S.meshCoordEmesh) : null,
        removal: S.meshCoordRemoval, give: S.meshCoordGive, n: S.meshCoordN, stop: S.meshCoordStop,
        nan: S.hasNaN(), scale: Math.hypot(S.x[2], S.y[2]) };
    };
    const base = run(null);
    const post = run({ inertia: 'coordinate', inertiaGain: 0, inertiaVertices: true });
    const inS = run({ inertia: 'coordinate', inertiaGain: 0, inertiaVertices: true, inertiaRemoval: 'inStep' });
    // 状態差は **(x,y,vx,vy)** と **spin** を分ける(第259便a の表は並進 4 量だけだった)
    const cmp = (a, b) => { if (!a.st || !b.st) return null; let d = 0, ds = 0;
      for (let i = 0; i < a.st.length; i++) {
        const z = Math.abs(a.st[i] - b.st[i]);
        if (i % 5 === 4) ds = Math.max(ds, z); else d = Math.max(d, z);
      }
      return { xv: d, spin: ds }; };
    return { base, post, inS, postVsBase: cmp(post, base), inSVsBase: cmp(inS, base) };
  }, [nStep, dt]);
  const steps = FAST ? 750 : 3000, dt = 0.004;
  const cur = await runOf(page, steps, dt);
  let old = null;
  if (fs.existsSync(BASE)) { const bp = await openPage('file://' + BASE); old = await runOf(bp, steps, dt); await bp.close(); }
  R.instep = { steps, dt, cur, old, baseMissing: !old };
}

// ============================================================ §5 ⚡ の p 掃引 3 行
if (want('p')) {
  await page.evaluate(() => {
    // 診断コピー(**本体 JSON は 1 bit も書き換えない**)。geoPN=3 は calibration を拒否し
    // kFrame>0 も拒否するので、**この掃引は ⚡ の較正軌道ではない**(kFrame=0・f≈2 質量 =
    // ワンタップ対照 B と同じ帯)。**観測へ合わせる fit は一切しない。**
    window.__w260p = (law, weight, nPeri, dt, maxSteps, budgetMs) => {
      const KEY = HP.SPACE_MESH_KEY;
      const q = JSON.parse(JSON.stringify(HP.allPresets().find((z) => z.id === 'psrDoubleABDFM')));
      delete q.sampleClass; delete q.massCalibration;
      q.physics.kFrame = 0; q.physics.geoPN = 3;
      if (weight === null) delete q.physics.frameWeight; else q.physics.frameWeight = weight;
      q.physics[KEY] = { mode: 'vertex', lawVersion: law, toyGain: 1 };
      const v = HP.validatePreset(q);
      if (!v.ok) return { err: (v.errors || []).join('|') };
      const S = HP.sim; S.build(v.preset);
      const peri = []; let rd1 = 0, th1 = 0;
      const t0 = performance.now();
      let k = 0, stopped = 'window';
      // **「近点が見つからない」は 2 通りある**(離れて戻らない / 円化して ṙ が符号を変えない)ので
      // 分離の履歴を必ず記録する。r が初期の 100 倍を超えたらそこで止める(**離脱**)
      const r0 = Math.hypot(S.x[1] - S.x[0], S.y[1] - S.y[0]);
      let rMin = Infinity, rMax = 0, rEnd = r0;
      for (; k < maxSteps; k++) {
        S.step(dt);
        const dx = S.x[1] - S.x[0], dy = S.y[1] - S.y[0];
        const rr = Math.hypot(dx, dy), th = Math.atan2(dy, dx);
        const dvx = S.vx[1] - S.vx[0], dvy = S.vy[1] - S.vy[0];
        const rdv = (rr > 0) ? (dx * dvx + dy * dvy) / rr : 0;
        rEnd = rr;
        if (rr < rMin) rMin = rr;
        if (rr > rMax) rMax = rr;
        if (rr > 100 * r0) { stopped = 'unbound'; break; }
        if (k >= 1 && rd1 < 0 && rdv >= 0) {
          const fr = (rdv !== rd1) ? (-rd1 / (rdv - rd1)) : 0;
          let a1 = th1, a2 = th;
          while (a2 - a1 > Math.PI) a2 -= 2 * Math.PI;
          while (a2 - a1 < -Math.PI) a2 += 2 * Math.PI;
          peri.push({ ang: a1 + fr * (a2 - a1), k: k - 1 + fr });
          if (peri.length >= nPeri) break;
        }
        rd1 = rdv; th1 = th;
        if (S.hasNaN()) { stopped = 'nan'; break; }
        if ((k & 65535) === 0 && (performance.now() - t0) > budgetMs) { stopped = 'time-budget'; break; }
      }
      if (k >= maxSteps) stopped = 'max-steps';
      const n = peri.length, ok = (n >= nPeri);
      const P = ok ? (peri[nPeri - 1].k - peri[0].k) * dt / (nPeri - 1) : null;
      const ang = []; let jump = 0;
      for (let i = 0; i < n; i++) { let a = peri[i].ang;
        if (i) { let z = a - ang[i - 1];
          while (z > Math.PI) z -= 2 * Math.PI; while (z < -Math.PI) z += 2 * Math.PI;
          if (Math.abs(z) > Math.PI / 2) { jump++; break; }
          a = ang[i - 1] + z; }
        ang.push(a); }
      // 近点方位の**実時刻に対する**直線 fit(rad/単位時間)
      let slope = null;
      if (ang.length >= 2) {
        const tK = peri.slice(0, ang.length).map((z) => z.k * dt);
        const m = ang.length, mt = tK.reduce((a, b) => a + b, 0) / m, ma = ang.reduce((a, b) => a + b, 0) / m;
        let sxy = 0, sxx = 0;
        for (let i = 0; i < m; i++) { sxy += (tK[i] - mt) * (ang[i] - ma); sxx += (tK[i] - mt) * (tK[i] - mt); }
        slope = sxy / sxx;
      }
      return { law, weight, dt, steps: k, stopped, nPeri: n, ok, jump,
        r0, rMin, rMax, rEnd, rRatio: r0 > 0 ? rMax / r0 : null,
        eProxy: (rMax + rMin > 0) ? (rMax - rMin) / (rMax + rMin) : null,
        pw: HP.sim.params.frameWeight === undefined ? 2
          : (HP.sim.params.frameWeight === 'pull' ? 2 : HP.sim.params.frameWeight === 'pull3' ? 3
            : HP.sim.params.frameWeight === 'pull4' ? 4 : 1),
        D0used: (HP.sim.params.frameWeight === 'share') ? HP.sim.params.D0 : HP.sim.params.D0pull,
        Psim: P, slopeRadPerUnit: slope, toyStop: S.geoToyStop, toyN: S.geoToyN, toyChi: S.geoToyChi,
        geoPN: S.params.geoPN, nan: S.hasNaN(),
        clamp: (S.clampVN || 0) + (S.clampRN || 0) + (S.clampSN || 0) };
    };
  });
  const rows = [];
  // **p=1 は `frameWeight:"share"`** である(`frameWeightPow` は **未宣言を 2 と読む**ので、
  // 宣言を消しても p=2 のままだった —— 第260便a の実測で分かった)。p の宣言で D₀ の読み先も
  // 変わる(share は `D0`・pull 系は `D0pull`)ので、行ごとに D₀ を並記する。
  const WEIGHTS = [[1, 'share'], [2, 'pull'], [3, 'pull3']];
  for (const law of ['scalar', 'local']) {
    for (const [pv, w] of WEIGHTS) {
      const z = await page.evaluate(([law, w, nPeri, dt, maxSteps, budget]) =>
        window.__w260p(law, w, nPeri, dt, maxSteps, budget),
      [law, w, FAST ? 6 : 20, 0.008, FAST ? 4e6 : 24e6, FAST ? 60000 : 240000]);
      rows.push(Object.assign({ pDecl: pv }, z));
      console.log(`  p=${pv} ${law}: pw=${z.pw} D0=${z.D0used} P=${z.Psim} stop=${z.stopped}`
        + ` nPeri=${z.nPeri} rMax/r0=${z.rRatio} toy=${z.toyStop}`);
    }
  }
  // 単位: scaleExp.T=1 → 1 単位 = 10 s / 1 年 = 31557600 s
  const decl = await page.evaluate(() => { const q = HP.allPresets().find((z) => z.id === 'psrDoubleABDFM');
    return { scaleExp: q.scaleExp, physics: q.physics }; });
  const toSec = Math.pow(10, Number(decl.scaleExp.T));
  R.p = { rows: rows.map((z) => Object.assign({}, z, {
    Psec: (z.Psim === null || z.Psim === undefined) ? null : z.Psim * toSec,
    degPerYear: (z.slopeRadPerUnit === null || z.slopeRadPerUnit === undefined) ? null
      : z.slopeRadPerUnit * 180 / Math.PI / toSec * 31557600 })),
  toSec, nPeri: FAST ? 6 : 20, dt: 0.008,
  note: 'geoPN=3 は calibration を拒否し kFrame>0 も拒否するので、この 6 行は **⚡ の較正軌道ではない**'
    + '(kFrame=0・較正質量 f≈2 = ワンタップ対照 B と同じ帯)。**fit は一切していない。**' };
}

// ============================================================ §6 既定経路 1 bit 不変
if (want('bit')) {
  if (!fs.existsSync(BASE)) {
    R.bit = { skipped: '基点 html が無い: ' + BASE };
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
    const toyOf = async (pg) => pg.evaluate((nStep) => {
      const KEY = HP.SPACE_MESH_KEY;
      const q = JSON.parse(JSON.stringify(HP.allPresets().find((z) => z.id === 'spaceMeshBinaryToy')));
      q.physics.kFrame = 0; q.physics.geoPN = 3;
      q.physics[KEY] = { mode: 'vertex', gravity: true, lawVersion: 'scalar', toyGain: 1 };
      for (let k = 0; k < 8; k++) { const th = 2 * Math.PI * k / 8, rr = 900;
        q.bodies.push({ type: 'single', m: 0.5, x: rr * Math.cos(th), y: rr * Math.sin(th),
          vx: -0.026 * Math.sin(th), vy: 0.026 * Math.cos(th), spin: 0, pinned: false }); }
      const v = HP.validatePreset(q);
      if (!v.ok) return { err: (v.errors || []).join('|') };
      const S = HP.sim; S.build(v.preset);
      for (let k = 0; k < nStep; k++) S.step(0.004);
      const st = []; for (let i = 0; i < S.n; i++) st.push(S.x[i], S.y[i], S.vx[i], S.vy[i]);
      return { st, stop: S.geoToyStop, N: S.geoToyN, e: Math.abs(S.geoToyE + S.geoToyEmesh), nan: S.hasNaN() };
    }, FAST ? 600 : 3000);
    const a = await snapOf(basePage), b = await snapOf(page);
    const ta = await toyOf(basePage), tb = await toyOf(page);
    await basePage.close();
    const ids = Object.keys(a);
    const stateDiff = [], sigDiff = [];
    for (const id of ids) {
      const x = a[id], y = b[id];
      if (!y) { stateDiff.push(id); continue; }
      if (x.h !== y.h || x.n !== y.n || x.nan !== y.nan) stateDiff.push(id);
      if (x.sig !== y.sig) sigDiff.push(id);
    }
    const toyDiff = (ta.st && tb.st && ta.st.length === tb.st.length)
      ? ta.st.reduce((d, z, i) => Math.max(d, Object.is(z, tb.st[i]) ? 0 : Math.abs(z - tb.st[i])), 0) : null;
    const toyBit = !!(ta.st && tb.st && ta.st.length === tb.st.length && ta.st.every((z, i) => Object.is(z, tb.st[i])));
    R.bit = { presets: ids.length, stateDiff, sigDiff, steps: FAST ? 120 : 600,
      toy: { base: { stop: ta.stop, N: ta.N, e: ta.e }, cur: { stop: tb.stop, N: tb.N, e: tb.e },
        bitSame: toyBit, maxDiff: toyDiff, steps: FAST ? 600 : 3000 } };
  }
}

R.pageErrors = pageErrors.slice(0, 5);
await page.close();
await browser.close();
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(R, null, 1));

// ------------------------------------------------------------------ 表
const L = [];
if (R.snap) {
  L.push('§1 状態アダプタ HP.dfmFieldSnapshot(S)');
  for (const k of ['window', 'galaxy', 'local']) {
    const z = R.snap[k];
    L.push(`  ${k}: stop=${z && z.stop} n=${z && z.n} tdc=${z && z.tdc} role=${z && z.role}`);
    if (z && z.opt) L.push('    options=' + JSON.stringify(z.opt));
  }
  for (const k of ['rejectComplex', 'rejectLayers', 'rejectBox']) {
    const z = R.snap[k];
    L.push(`  ${k}: ${z ? ('stop=' + z.stop + (z.err ? ' err=' + z.err : '')) : 'null'}`);
  }
  L.push(`  アダプタ経由 対 純関数直呼び: |Δu|=${ex(R.snap.adapterVsPure.du)} |Δχ|=${ex(R.snap.adapterVsPure.dc)}`);
}
if (R.grid) {
  L.push('§2 恒等 QA と **disk/affine 対 全源 scalar** の差(81 交点)');
  for (const id of Object.keys(R.grid)) {
    const z = R.grid[id];
    L.push(`  ${id}: fieldApi:false の交点が基点とビット同一=${z.offVsBase} / 戻すと元に戻る=${z.offRestored}`);
    L.push(`    交点 off ${z.nOkOff}/${z.nodesOff} → on ${z.nOkOn}/${z.nodesOn}(折返し ${z.foldsOff}→${z.foldsOn}・注記 "${z.apiNoteOn}")`);
    const p = z.probe;
    if (p) L.push(`    同一 81 点: 現行が読めた ${p.nCur} / API が読めた ${p.nApi} / 両方 ${p.nBoth} — `
      + `|u_cur−u_api| 最大 ${ex(p.dMax)}・平均 ${ex(p.dMean)}・相対最大 ${ex(p.relMax)}`
      + `(|u_cur| 最大 ${ex(p.curMax)}・|u_api| 最大 ${ex(p.apiMax)}・|Δχ| 最大 ${ex(p.dChiMax)})`);
  }
}
if (R.bound) {
  L.push('§3 API 境界 3 件');
  const e = R.bound.exclude;
  L.push(`  ① excludeBodyId:1 → 残る源 ${JSON.stringify(e.byId1 && e.byId1.ids)} D=${e.byId1 && e.byId1.D.toFixed(10)}`
    + `(期待 ${e.expect.toFixed(10)})/ excludeBodyId:9 → ${JSON.stringify(e.byId9 && e.byId9.ids)}`
    + ` / ID 未宣言は添字で当たる(excludeBodyId:0 → ${JSON.stringify(e.byIndex0 && e.byIndex0.ids)})`);
  const c = R.bound.complexEmpty;
  L.push(`  ② complex 源なし=${c.empty}・D₀>0 でも=${c.emptyD0}・全部 exclude=${c.excludedAll}`
    + ` / 1 源は ${JSON.stringify(c.oneSource)} / scalar 源なし=${c.scalarEmpty}`);
  const t = R.bound.tdc;
  for (const k of Object.keys(t)) L.push(`  ③ ${k}: ${JSON.stringify(t[k])}`);
  L.push(`  ③ アダプタ: snapshot.tdc=${R.bound.snapTdc.snap} / dfmField(snap.bodies).tdc=${R.bound.snapTdc.field}`);
}
if (R.instep) {
  const c = R.instep.cur, o = R.instep.old;
  L.push(`§4 残余トルク契約(η=0 対 kFrame=0・🪟+リング 8・dt=${R.instep.dt}・${R.instep.steps} 步)`);
  L.push('  ' + ['走行', '状態差 (x,y,vx,vy)', '状態差 spin', 'ΔP+res', 'ΔL+res', '(ΔL+res)/|L₀|', '戻し'].join(' | '));
  const row = (nm, z, d) => L.push(`  ${nm} | ${ex(d && d.xv)} | ${ex(d && d.spin)} | ${ex(z.dP)} | ${ex(z.dL)} | ${ex(z.dLrel)} | ${z.give}`);
  row('post(既定)', c.post, c.postVsBase);
  if (o) row('inStep(旧・基点)', o.inS, o.inSVsBase);
  row('inStep(新・本便)', c.inS, c.inSVsBase);
  L.push(`  参考: kFrame=0(支えなし)の ΔL+res/|L₀| = ${ex(c.base.dLrel)}`);
}
if (R.p) {
  L.push('§5 ⚡ の p 掃引(**較正ではない** — geoPN=3 は kFrame=0 を要求するので対照 B の帯)');
  L.push('  ' + ['p(宣言)', 'law', 'D₀', 'P [s]', 'ω̇ [°/yr]', '近点', 'r_max/r₀', 'stop'].join(' | '));
  for (const z of R.p.rows) {
    L.push(`  ${z.pDecl}(pw=${z.pw}) | ${z.law} | ${ex(z.D0used, 3)} | ${z.Psec === null ? '—' : fx(z.Psec, 3)} | `
      + `${z.degPerYear === null || z.degPerYear === undefined ? '—' : fx(z.degPerYear, 4)} | ${z.nPeri} | `
      + `${ex(z.rRatio, 3)} | ${z.stopped}`);
  }
}
if (R.bit) {
  L.push('§6 既定経路 1 bit 不変: ' + (R.bit.skipped ? R.bit.skipped
    : `${R.bit.presets} 本 × ${R.bit.steps} 步 — 状態差 ${R.bit.stateDiff.length} 本 ${JSON.stringify(R.bit.stateDiff)}`
      + ` / 署名差 ${R.bit.sigDiff.length} 本 ${JSON.stringify(R.bit.sigDiff)}`
      + ` / トイ(🪟+リング ${R.bit.toy.steps} 步)ビット同一=${R.bit.toy.bitSame}(最大差 ${ex(R.bit.toy.maxDiff)}`
      + `・E+E_mesh 基点 ${ex(R.bit.toy.base.e)} → 本便 ${ex(R.bit.toy.cur.e)})`));
}
if (R.pageErrors.length) L.push('pageErrors: ' + JSON.stringify(R.pageErrors));
console.log(L.join('\n'));
console.log('\n出力: ' + OUT);
