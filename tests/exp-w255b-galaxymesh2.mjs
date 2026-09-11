// 第255便b W2「銀河の空間メッシュ ―― u_n の 2 案・tracer の段階時刻・要求別の場・ハロー参照」(第47報)。
//
// 原仮定者(第47報・全文は docs/PHYSICS.md 〔第255便b〕に引用):
//   「処理を軽くする工夫をする」/「各粒子の移動回転により、空間メッシュの各座標における
//    移動回転差分は、瞬間的に決まっている」/「空間メッシュの追従による、慣性の退化は、
//    重力波放出類似と、ダークマターハロー類似を兼ねる」/「早期に…銀河サンプルを完成させる」。
//
// **力へは 1 バイトも接続しない**(第254便b と同じ —— 表示と記録だけ)。**観測回転曲線は入力しない**。
// 本ハーネスが測るのは:
//   ① 機構試験  ―― 中心 2500 + 環 16 体・Ω=0.2・評価点 (5,2)・D₀=0 で、正しい剛体回転 (−0.4,1.0) を
//      現行平均 / affine(中心含む)/ affine(中心除外)/ 平均(中心除外)の **4 組合せ**で並べる。
//      質量分割・粒子順序の不変も同じ器で見る。差動回転(平坦回転)と疎な外縁は**別欄**。
//   ② 5 量の再測 ―― 🎠 galaxyMeshSpiral と 🎡 galaxyStd を r ビン方位平均で 4 組合せ。
//   ③ 段階時刻  ―― RK4 の各段が同じ時刻を見ると 1 次に落ちることを、指定場 u_x=t(終点 1.5)と
//      u_x=−x·t(厳密解 x₀e^{−t²/2})で次数として測る。
//   ④ コスト    ―― mean/affine × need(u/uB/uBt)の 1 点評価コスト(warm-up 50・3 回中央値)。
//   ⑤ ハロー参照 ―― v_c²=rΦ′/(α+rα′/2) の**帳簿の読み**。α=r²/(r²+9)・GM=1 で外側がケプラー型へ戻ること。
//   ⑥ 1 bit 不変 ―― 既定 opts の場・tracer・全内蔵プリセット 600 步の状態ハッシュ(基点 html と突き合わせる)。
//
// 実行: node tests/exp-w255b-galaxymesh2.mjs [--mech] [--five] [--stage] [--cost] [--halo] [--bit]
//   QA_TARGET=beta/index.html(既定。絶対パスも可 —— 基点 html と突き合わせるときに使う)
// 出力: tests/out/galaxymesh-w255b.json(.gitignore 既定どおり未コミット ―― 数値は PHYSICS に全載)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + (path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET));
const OUT = process.env.W255B_OUT || path.join(ROOT, 'tests', 'out', 'galaxymesh-w255b.json');
const argv = process.argv.slice(2);
const only = argv.filter((a) => a.startsWith('--')).map((a) => a.slice(2));
const want = (k) => !only.length || only.includes(k);

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

const out = { target: TARGET, node: process.version, at: new Date().toISOString(), wave: '255b' };

// ------------------------------------------------------------------ ページ側の共通ライブラリ
await pg.evaluate(() => {
  const W = (window.__w255b = {});
  W.byId = (id) => HP.allPresets().find((p) => p.id === id);
  W.build = (id, physPatch) => {
    const pd = JSON.parse(JSON.stringify(W.byId(id)));
    if (physPatch) Object.assign(pd.physics, physPatch);
    const v = HP.validatePreset(pd);
    if (!v.ok) throw new Error('invalid ' + id + ' ' + JSON.stringify(v.errors));
    const S = HP.sim; S.build(v.preset); return S;
  };
  W.hash = (S) => {
    let h1 = 2166136261 >>> 0, h2 = 5381 >>> 0;
    const push = (z) => { const b = new Float64Array([z]); const u = new Uint32Array(b.buffer);
      h1 = (Math.imul(h1 ^ u[0], 16777619)) >>> 0; h1 = (Math.imul(h1 ^ u[1], 16777619)) >>> 0;
      h2 = (Math.imul(h2, 33) ^ u[0]) >>> 0; h2 = (Math.imul(h2, 33) ^ u[1]) >>> 0; };
    for (let i = 0; i < S.n; i++) { push(S.x[i]); push(S.y[i]); push(S.vx[i]); push(S.vy[i]); push(S.spin[i]); push(S.tau[i]); push(S.m[i]); }
    push(S.t); push(S.n);
    return h1.toString(16) + ':' + h2.toString(16) + ':' + S.n;
  };
  W.trHash = (tr) => {
    let h = 2166136261 >>> 0;
    const push = (z) => { const b = new Float64Array([z]); const u = new Uint32Array(b.buffer);
      h = (Math.imul(h ^ u[0], 16777619)) >>> 0; h = (Math.imul(h ^ u[1], 16777619)) >>> 0; };
    for (let i = 0; i < tr.n; i++) { push(tr.x[i]); push(tr.y[i]); push(tr.th[i]);
      for (let k = 0; k < 4; k++) push(tr.F[4 * i + k]); }
    return h.toString(16);
  };
  // 4 組合せ(u_n の源 × fit)
  W.COMBOS = [
    { key: 'all/mean', unSource: 'all', unFit: 'mean' },
    { key: 'all/affine', unSource: 'all', unFit: 'affine' },
    { key: 'disk/mean', unSource: 'disk', unFit: 'mean' },
    { key: 'disk/affine', unSource: 'disk', unFit: 'affine' },
  ];
  // 機構試験の構成: 中心 m=2500(静止・pinned)+ 半径 R の環 n 体(各 m=1・剛体回転 Ω)
  W.ring = (Om, R, n, mc) => {
    const b = [{ m: (mc === undefined ? 2500 : mc), x: 0, y: 0, vx: 0, vy: 0, pinned: true }];
    for (let k = 0; k < n; k++) {
      const th = 2 * Math.PI * k / n, x = R * Math.cos(th), y = R * Math.sin(th);
      b.push({ m: 1, x, y, vx: -Om * y, vy: Om * x, pinned: false });
    }
    return b;
  };
});

// ============================================================ ① 機構試験
if (want('mech')) {
  out.mech = await pg.evaluate(() => {
    const W = window.__w255b, res = {};
    const OM = 0.2, PX = 5, PY = 2;
    const base = W.ring(OM, 10, 16);
    const opt = (c, extra) => Object.assign({ D0: 0, eps: 0, p: 2, bg: 'static',
      unSource: c.unSource, unFit: c.unFit }, extra || {});
    const exact = [-OM * PY, OM * PX];                       // (−0.4, 1.0)
    const run = (bodies, extra) => W.COMBOS.map((c) => {
      const f = HP.dfmGalaxyMeshField(bodies, PX, PY, opt(c, extra));
      return { key: c.key, u: f ? f.u : null, un: f ? f.un : null, chi: f ? f.chi : null,
        gradU: f ? f.gradU : null, unLinear: f ? f.unLinear : null,
        unSources: f ? f.unSources : null, unExcluded: f ? f.unExcluded : null,
        fitCond: f ? f.fitCond : null, dUdt: f ? f.dUdt : null,
        tdc: f ? f.timeDerivativeComplete : null,
        err: f ? Math.hypot(f.u[0] - exact[0], f.u[1] - exact[1]) : null };
    });
    res.exact = exact;
    res.eps0 = run(base);
    res.eps1 = run(base, { eps: 1 });                        // 平滑化長 ε=1 の対照
    // 質量分割(中心 2500 を 1000+1500 に・環の 1 体を 0.4+0.6 に)と粒子順序の反転
    const split = base.slice();
    split[0] = { m: 1000, x: 0, y: 0, vx: 0, vy: 0, pinned: true };
    split.push({ m: 1500, x: 0, y: 0, vx: 0, vy: 0, pinned: true });
    const r1 = split[1];
    split[1] = Object.assign({}, r1, { m: 0.4 });
    split.push(Object.assign({}, r1, { m: 0.6 }));
    res.split = run(split);
    res.perm = run(base.slice().reverse());
    res.splitDiff = res.eps0.map((z, i) => (z.u && res.split[i].u)
      ? Math.hypot(z.u[0] - res.split[i].u[0], z.u[1] - res.split[i].u[1]) : null);
    res.permDiff = res.eps0.map((z, i) => (z.u && res.perm[i].u)
      ? Math.hypot(z.u[0] - res.perm[i].u[0], z.u[1] - res.perm[i].u[1]) : null);
    res.splitBit = res.eps0.map((z, i) => (z.u && res.split[i].u)
      && Object.is(z.u[0], res.split[i].u[0]) && Object.is(z.u[1], res.split[i].u[1]));
    res.permBit = res.eps0.map((z, i) => (z.u && res.perm[i].u)
      && Object.is(z.u[0], res.perm[i].u[0]) && Object.is(z.u[1], res.perm[i].u[1]));
    // ---- ランク不足(2 体・共線)は null で止まるか
    res.rank = {
      two: HP.dfmGalaxyMeshField([{ m: 1, x: 0, y: 0, vx: 0, vy: 0 }, { m: 1, x: 5, y: 0, vx: 0, vy: 1 }],
        1, 1, { D0: 1, eps: 1, bg: 'static', unFit: 'affine' }),
      collinear: HP.dfmGalaxyMeshField([0, 1, 2, 3].map((k) => ({ m: 1, x: 3 * k, y: 0, vx: 0, vy: k })),
        1, 1, { D0: 1, eps: 1, bg: 'static', unFit: 'affine' }),
      triangle: (() => { const f = HP.dfmGalaxyMeshField(
        [{ m: 1, x: 0, y: 0, vx: 0, vy: 0 }, { m: 1, x: 5, y: 0, vx: 0, vy: 1 }, { m: 1, x: 0, y: 5, vx: -1, vy: 0 }],
        1, 1, { D0: 1, eps: 1, bg: 'static', unFit: 'affine' }); return f ? f.fitCond : null; })(),
    };
    // ---- 差動回転(平坦回転曲線 v_φ=v0 を**構成として置いた**環の重ね合わせ。
    //      観測の転写ではなく、fit が差動回転をどう外挿するかを見るためだけの合成配置)
    {
      const v0 = 5, bodies = [{ m: 2500, x: 0, y: 0, vx: 0, vy: 0, pinned: true }];
      for (let r = 20; r <= 260; r += 20) for (let k = 0; k < 24; k++) {
        const th = 2 * Math.PI * k / 24, x = r * Math.cos(th), y = r * Math.sin(th);
        bodies.push({ m: 0.3, x, y, vx: -v0 * y / r, vy: v0 * x / r, pinned: false });
      }
      const rows = [];
      for (const r of [30, 60, 90, 130, 170, 210, 250]) {
        const row = { r, v_phi: v0, cells: {} };
        for (const c of W.COMBOS) {
          const f = HP.dfmGalaxyMeshField(bodies, r, 0, { D0: 0, eps: 3, p: 2, bg: 'static',
            unSource: c.unSource, unFit: c.unFit });
          row.cells[c.key] = f ? { uphi: f.u[1], ratio: f.u[1] / v0, ur: f.u[0] } : null;
        }
        rows.push(row);
      }
      res.differential = { v0, rows };
    }
    return res;
  });
  console.log('§MECH done');
}

// ============================================================ ② 5 量の再測(4 組合せ)
if (want('five')) {
  out.five = await pg.evaluate(() => {
    const W = window.__w255b, res = {};
    const setups = [
      { id: 'galaxyMeshSpiral', steps: 3000, bins: 8, label: '🎠 galaxyMeshSpiral' },
      { id: 'galaxyStd', steps: 0, bins: 13, label: '🎡 galaxyStd(t=0)' },
      { id: 'galaxyStd', steps: 3000, bins: 13, label: '🎡 galaxyStd(3000步)' },
    ];
    res.runs = [];
    for (const st of setups) {
      const S = W.build(st.id);
      for (let k = 0; k < st.steps; k++) S.step(0.016);
      const recs = {};
      for (const c of W.COMBOS) {
        const r = HP.dfmGalaxyMeshRecord(S, { bins: st.bins, rMax: 260, azimuths: 24,
          field: { bgGrad: 'zero', unSource: c.unSource, unFit: c.unFit } });
        recs[c.key] = r.bins.map((b) => ({ r: b.r, count: b.count, v_phi: b.v_phi,
          u_mesh_phi: b.u_mesh_phi, diff: b.diff, chi: b.chi, A2: b.A2, v_obs: b.v_obs,
          Omega_mesh: b.Omega_mesh, azNull: b.azNull }));
      }
      // Ω_pattern−Ω_mesh は 2 時刻差分(同じ走行を 100 步進めて 2 点目を採る)
      const prev = {};
      for (const c of W.COMBOS) prev[c.key] = HP.dfmGalaxyMeshRecord(S, { bins: st.bins, rMax: 260,
        azimuths: 24, field: { bgGrad: 'zero', unSource: c.unSource, unFit: c.unFit } });
      for (let k = 0; k < 100; k++) S.step(0.016);
      const pat = {};
      for (const c of W.COMBOS) {
        const r = HP.dfmGalaxyMeshRecord(S, { bins: st.bins, rMax: 260, azimuths: 24,
          prev: prev[c.key], field: { bgGrad: 'zero', unSource: c.unSource, unFit: c.unFit } });
        pat[c.key] = r.bins.map((b) => ({ r: b.r, A2: b.A2, Omega_pattern: b.Omega_pattern,
          Omega_mesh: b.Omega_mesh, Omega_pattern_minus_mesh: b.Omega_pattern_minus_mesh }));
      }
      res.runs.push({ id: st.id, label: st.label, steps: st.steps, n: S.n, t: S.t, recs, pat });
    }
    // ---- x 軸 1 点の表(ChatGPT の表と同じ読み方: (r,0) での u_φ = u_y)
    {
      const S = W.build('galaxyMeshSpiral');
      for (let k = 0; k < 3000; k++) S.step(0.016);
      const rows = [];
      for (const r of [30, 90, 170, 250]) {
        const row = { r, cells: {} };
        for (const c of W.COMBOS) {
          const f = HP.dfmGalaxyMeshField(S, r, 0, { bgGrad: 'zero',
            unSource: c.unSource, unFit: c.unFit });
          row.cells[c.key] = f ? { uphi: f.u[1], un_phi: f.un[1], chi: f.chi, ubg_phi: f.ubg[1] } : null;
        }
        rows.push(row);
      }
      res.axis = rows;
      // ---- 疎な外縁(円盤の端 r=260 の外)での affine の挙動と null 率
      const sparse = [];
      for (let r = 200; r <= 520; r += 40) {
        const row = { r, cells: {} };
        for (const c of W.COMBOS) {
          let nul = 0, mx = 0, sum = 0, ok = 0;
          for (let a = 0; a < 24; a++) {
            const th = 2 * Math.PI * a / 24;
            const f = HP.dfmGalaxyMeshField(S, r * Math.cos(th), r * Math.sin(th),
              { bgGrad: 'zero', unSource: c.unSource, unFit: c.unFit });
            if (!f) { nul++; continue; }
            const un = Math.hypot(f.un[0], f.un[1]);
            mx = Math.max(mx, un); sum += un; ok++;
          }
          row.cells[c.key] = { nullRate: nul / 24, unMax: mx, unMean: ok ? sum / ok : null };
        }
        sparse.push(row);
      }
      res.sparse = sparse;
      // 参考: 粒子の最大 |v| と最外縁半径
      let vmax = 0, rmax = 0;
      for (let i = 0; i < S.n; i++) { vmax = Math.max(vmax, Math.hypot(S.vx[i], S.vy[i]));
        rmax = Math.max(rmax, Math.hypot(S.x[i], S.y[i])); }
      res.particleMax = { vmax, rmax, n: S.n };
    }
    return res;
  });
  console.log('§FIVE done');
}

// ============================================================ ③ 段階時刻(RK4)
if (want('stage')) {
  out.stage = await pg.evaluate(() => {
    const res = {};
    // (a) u=(t,0):厳密解 x(t)=x₀+t²/2。t=0→1 で x₀=1 は **1.5**
    const runA = (dt, useStage) => {
      const fake = { t: 0 };
      let frozen = 0;                     // 段階時刻を渡さない場合(= 全段が步頭の時刻を見る)
      const fld = (x, y, S, st) => ({ u: [useStage ? st : frozen, 0], gradU: [0, 0, 0, 0], chi: 1 });
      const tr = HP.dfmGalaxyTracerCreate(fake, { lines: 1, perLine: 2, rMin: 1, rMax: 2, field: fld });
      const ns = Math.round(1 / dt);
      for (let k = 0; k < ns; k++) { frozen = fake.t; fake.t += dt; HP.dfmGalaxyTracerStep(tr, dt, fake); }
      return { x1: tr.x[0], x2: tr.x[1], steps: tr.steps, t: tr.t, stopped: tr.stopped };
    };
    res.rampA = [0.1, 0.01, 0.001].map((dt) => ({ dt,
      stage: runA(dt, true), frozen: runA(dt, false), exact1: 1.5, exact2: 2.5 }));
    // (b) u=(−x·t,0):厳密解 x(t)=x₀·exp(−t²/2)。次数を dt 半減で測る
    const runB = (dt, useStage) => {
      const fake = { t: 0 };
      let frozen = 0;
      const fld = (x, y, S, st) => { const tt = useStage ? st : frozen;
        return { u: [-x * tt, 0], gradU: [-tt, 0, 0, 0], chi: 1 }; };
      const tr = HP.dfmGalaxyTracerCreate(fake, { lines: 1, perLine: 2, rMin: 1, rMax: 2, field: fld });
      const ns = Math.round(1 / dt);
      for (let k = 0; k < ns; k++) { frozen = fake.t; fake.t += dt; HP.dfmGalaxyTracerStep(tr, dt, fake); }
      return { x1: tr.x[0], F0: tr.F[0], detF: tr.F[0] * tr.F[3] - tr.F[1] * tr.F[2] };
    };
    const ex = Math.exp(-0.5);
    const dts = [0.1, 0.05, 0.025, 0.0125, 0.00625];
    const mk = (useStage) => {
      const rows = dts.map((dt) => { const r = runB(dt, useStage);
        return { dt, x1: r.x1, err: Math.abs(r.x1 - ex), detF: r.detF, detErr: Math.abs(r.detF - ex) }; });
      for (let i = 1; i < rows.length; i++) rows[i].order = Math.log2(rows[i - 1].err / rows[i].err);
      return rows;
    };
    res.decayB = { exact: ex, stage: mk(true), frozen: mk(false) };
    HP.sim.hasGalaxyTracer = false; HP.sim._galTracer = null;
    return res;
  });
  console.log('§STAGE done');
}

// ============================================================ ④ コスト(処理を軽くする工夫)
if (want('cost')) {
  out.cost = await pg.evaluate(() => {
    const W = window.__w255b;
    const S = W.build('galaxyStd');
    // 評価点 500 個(決定的 LCG・r<260 の円盤内)
    let seed = 12345 >>> 0;
    const rnd = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
    const pts = [];
    for (let k = 0; k < 500; k++) { const r = 260 * Math.sqrt(rnd()), th = 2 * Math.PI * rnd();
      pts.push([r * Math.cos(th), r * Math.sin(th)]); }
    // warm-up 4 周(2000 回)のあと 9 回 × 500 回を測って**中央値**を採る(JIT の立ち上がりを除く)
    const bench = (opts) => {
      for (let rep = 0; rep < 4; rep++)
        for (let k = 0; k < pts.length; k++) HP.dfmGalaxyMeshField(S, pts[k][0], pts[k][1], opts);
      const ms = [];
      for (let rep = 0; rep < 9; rep++) {
        const t0 = performance.now();
        for (let k = 0; k < pts.length; k++) HP.dfmGalaxyMeshField(S, pts[k][0], pts[k][1], opts);
        ms.push(performance.now() - t0);
      }
      ms.sort((a, b) => a - b);
      return { ms: ms[4], per: ms[4] / pts.length, min: ms[0], max: ms[8] };
    };
    const sweep = () => { const rows = [];
      for (const c of W.COMBOS) for (const need of ['u', 'uB', 'uBt']) {
        const o = { unSource: c.unSource, unFit: c.unFit, need };
        const b = bench(o);
        const bz = bench(Object.assign({ bgGrad: 'zero' }, o));
        rows.push({ combo: c.key, need, ms: b.ms, perCall: b.per, msMin: b.min, msMax: b.max,
          msBgZero: bz.ms, perCallBgZero: bz.per });
      }
      return rows; };
    sweep();                       // 1 周目は捨てる(全 12 構成で JIT を温める)
    const rows = sweep();
    // 記録器(need 既定 "u")と旧既定(uBt)の比較(bgGrad は既定の "fd" = 中心差分あり)
    const rec = (need, bgz) => { const o = { bins: 8, rMax: 260, azimuths: 24,
        field: bgz ? { bgGrad: 'zero', need } : { need } };
      for (let k = 0; k < 5; k++) HP.dfmGalaxyMeshRecord(S, o);
      const ms = [];
      for (let rep = 0; rep < 9; rep++) { const t0 = performance.now();
        HP.dfmGalaxyMeshRecord(S, o); ms.push(performance.now() - t0); }
      ms.sort((a, b) => a - b); return ms[4]; };
    const recMs = { u: rec('u', false), uBt: rec('uBt', false),
      uZero: rec('u', true), uBtZero: rec('uBt', true) };
    // tracer 100 步(8×13 節点)の need 別
    const trace = (need) => {
      const S2 = W.build('galaxyStd');
      const tr = HP.dfmGalaxyTracerCreate(S2, { lines: 8, perLine: 13, rMin: 20, rMax: 240,
        field: { bgGrad: 'zero', need } });
      for (let k = 0; k < 20; k++) HP.dfmGalaxyTracerStep(tr, 0.016, S2);
      const t0 = performance.now();
      for (let k = 0; k < 100; k++) HP.dfmGalaxyTracerStep(tr, 0.016, S2);
      const ms = performance.now() - t0;
      S2.hasGalaxyTracer = false; S2._galTracer = null;
      return { ms, per: ms / 100, hash: W.trHash(tr) };
    };
    const trUB = trace('uB'), trUBt = trace('uBt');
    return { n: S.n, points: pts.length, rows, recMs, tracer: { uB: trUB, uBt: trUBt,
      bitSame: trUB.hash === trUBt.hash } };
  });
  console.log('§COST done');
}

// ============================================================ ⑤ ハロー参照
if (want('halo')) {
  out.halo = await pg.evaluate(() => {
    const res = {};
    // α=1−χ の例: W∝1/r²・D₀ 一定 → χ=W/(W+D₀)=k/(k+D₀r²) → α=1−χ=r²/(r²+a²)(a²=k/D₀=9)
    const alpha = (r) => r * r / (r * r + 9);
    const Phi = (r) => -1 / r;                       // GM=1
    const rs = [1, 3, 10, 30, 100, 300, 1000];
    const num = HP.dfmMeshHaloReference({ alpha, Phi, r: rs });
    // 解析の対照(α′=18r/(r²+9)²・Φ′=1/r²)
    const ana = rs.map((r) => { const al = alpha(r), ap = 18 * r / ((r * r + 9) * (r * r + 9));
      const den = al + r * ap / 2, v2 = (1 / r) / den;
      return { r, alpha: al, alphaPrime: ap, denom: den, vc2: v2, vc: Math.sqrt(v2) }; });
    res.rows = num.rows.map((z, i) => Object.assign({}, z, { anaVc: ana[i].vc,
      dVc: Math.abs(z.vc - ana[i].vc), newtonVc: Math.sqrt(1 / z.r) }));
    // 解析導関数を渡した場合(中心差分との差)
    const exact = HP.dfmMeshHaloReference({ alpha, alphaPrime: (r) => 18 * r / ((r * r + 9) * (r * r + 9)),
      dPhi: (r) => 1 / (r * r), r: rs });
    res.exactRows = exact.rows;
    res.fdVsExact = num.rows.map((z, i) => Math.abs(z.vc - exact.rows[i].vc));
    // 安定性が破れる例(α が急減する = α+rα′/2<0)
    const bad = HP.dfmMeshHaloReference({ alpha: (r) => 1 / (r * r * r), Phi, r: [1, 2, 5] });
    res.unstable = bad ? bad.rows : null;
    res.gates = {
      noAlpha: HP.dfmMeshHaloReference({ Phi, r: 3 }) === null,
      noPhi: HP.dfmMeshHaloReference({ alpha, r: 3 }) === null,
      negR: HP.dfmMeshHaloReference({ alpha, Phi, r: -3 }) === null,
      zeroR: HP.dfmMeshHaloReference({ alpha, Phi, r: 0 }) === null,
      nanR: HP.dfmMeshHaloReference({ alpha, Phi, r: NaN }) === null,
      negAlpha: HP.dfmMeshHaloReference({ alpha: () => -1, Phi, r: 3 }) === null,
      zeroAlpha: HP.dfmMeshHaloReference({ alpha: () => 0, Phi, r: 3 }) === null,
      nanAlpha: HP.dfmMeshHaloReference({ alpha: () => NaN, Phi, r: 3 }) === null,
      badH: HP.dfmMeshHaloReference({ alpha, Phi, r: 3, h: -1 }) === null,
      emptyR: HP.dfmMeshHaloReference({ alpha, Phi, r: [] }) === null,
      noOpts: HP.dfmMeshHaloReference() === null,
    };
    return res;
  });
  console.log('§HALO done');
}

// ============================================================ ⑥ 1 bit 不変
if (want('bit')) {
  out.bit = await pg.evaluate(() => {
    const W = window.__w255b, res = {};
    // (a) 場: 既定 opts と明示 all/mean/uBt が同じ値か・need 別の u/∇u がビット同一か
    {
      const S = W.build('galaxyStd');
      for (let k = 0; k < 200; k++) S.step(0.016);
      const bitArr = (a, b) => Array.isArray(a) && Array.isArray(b) && a.length === b.length
        && a.every((z, i) => Object.is(z, b[i]));
      const p = [37, -19];
      const f0 = HP.dfmGalaxyMeshField(S, p[0], p[1], {});
      const fE = HP.dfmGalaxyMeshField(S, p[0], p[1], { unSource: 'all', unFit: 'mean', need: 'uBt' });
      const fU = HP.dfmGalaxyMeshField(S, p[0], p[1], { need: 'u' });
      const fB = HP.dfmGalaxyMeshField(S, p[0], p[1], { need: 'uB' });
      res.field = { explicitBit: bitArr(f0.u, fE.u) && bitArr(f0.gradU, fE.gradU) && bitArr(f0.dUdt, fE.dUdt)
          && Object.is(f0.W, fE.W) && Object.is(f0.chi, fE.chi),
        needUBit: bitArr(f0.u, fU.u), needUBBit: bitArr(f0.u, fB.u) && bitArr(f0.gradU, fB.gradU),
        needUNulls: fU.gradU === null && fU.dUdt === null && fU.gradW === null,
        needUBNulls: fB.dUdt === null && fB.timeDerivativeComplete === false,
        u: f0.u, gradU: f0.gradU, dUdt: f0.dUdt, W: f0.W, chi: f0.chi };
    }
    // (b) 全内蔵プリセット 600 步の状態ハッシュ
    const ids = HP.allPresets().map((p) => p.id);
    const hashes = {};
    for (const id of ids) {
      try {
        const S = W.build(id);
        for (let k = 0; k < 600; k++) S.step(0.016);
        hashes[id] = W.hash(S);
      } catch (e) { hashes[id] = 'ERR:' + String(e).slice(0, 60); }
    }
    res.presets = { n: ids.length, hashes };
    // (c) 正準形(検証後プリセットの JSON)
    const sigs = {};
    for (const p of HP.allPresets()) {
      const v = HP.validatePreset(JSON.parse(JSON.stringify(p)));
      sigs[p.id] = JSON.stringify(v.preset);
    }
    let h = 2166136261 >>> 0;
    const s = Object.keys(sigs).sort().map((k) => k + '=' + sigs[k]).join('');
    for (let i = 0; i < s.length; i++) h = (Math.imul(h ^ s.charCodeAt(i), 16777619)) >>> 0;
    res.canonHash = h.toString(16);
    res.canonLen = s.length;
    return res;
  });
  console.log('§BIT done presets=' + out.bit.presets.n);
}

out.pageErrors = pageErrors;
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log('written', OUT, 'pageErrors', pageErrors.length);
await browser.close();
