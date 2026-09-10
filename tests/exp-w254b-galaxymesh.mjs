// 第254便b W2「銀河の空間メッシュ ―― 局所場・χ(r)・物質線の巻き込み(表示のみ)」(第46報)。
//
// 原仮定者(第46報・全文は docs/PHYSICS.md 〔第254便b〕に引用):
//   「銀河では、空間メッシュが銀河の回転に合わせて渦を巻く。銀河の中心に近づくほど、
//    『背景決定力 D₀』の影響が相対的に弱まる/空間メッシュの、表示と内部状態は、それぞれ
//    適切なものを選択する。判断出来ない場合は、各案を実装して検証を行う」。
//
// **力は接続しない**(第253便a ⑦「銀河はメッシュ接続の後」)。本ハーネスが測るのは
//   ① 局所場と χ(r)  ―― W(r)・χ(r)(D₀ 3 段)・u_mesh,φ(r)・v_φ(r)・差
//   ② 物質線の巻き込み ―― **「指定場の運動学」と「エンジンの粒子速度から作った場」を別欄**で
//      並べる(ChatGPT の機構試験の再現を含む)。**「渦を描けた」は長寿命構造の説明ではない。**
//   ③ セルの形の対照 ―― 連続場 / 固定格子ビニング(cellSize) / 局所三角形(T3)を同じ点で比べる
//   ④ 5 量の記録器 ―― v_φ・u_mesh,φ・差・v_obs(光学層が無いので null)・Ω_pattern−Ω_mesh
//   ⑤ 新サンプル 🎠 の健全性 ―― NaN 0・2 回ビット同一・χ(r) 3 点・巻き数
//
// **エンジンの物理はハーネスからは 1 bit も書き換えない**(読み取り専用の純関数だけを叩く)。
// **観測回転曲線は u_mesh の入力に使っていない**(u_n はエンジンの粒子速度の局所平均だけから作る)。
//
// 実行: node tests/exp-w254b-galaxymesh.mjs [--chi] [--wind] [--cell] [--rec] [--sample] [--fast]
// 出力: tests/out/galaxymesh-w254.json(.gitignore 既定どおり未コミット ―― 数値は PHYSICS に全載)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + path.join(ROOT, TARGET);
const OUT = path.join(ROOT, 'tests', 'out', 'galaxymesh-w254.json');
const argv = process.argv.slice(2);
const FAST = argv.includes('--fast');
const only = argv.filter((a) => a.startsWith('--') && a !== '--fast').map((a) => a.slice(2));
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

const out = { target: TARGET, node: process.version, at: new Date().toISOString(), wave: '254b', fast: FAST };

// ------------------------------------------------------------------ ページ側の共通ライブラリ
await pg.evaluate(() => {
  const W = (window.__w254 = {});
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
    for (let i = 0; i < S.n; i++) { push(S.x[i]); push(S.y[i]); push(S.vx[i]); push(S.vy[i]); push(S.spin[i]); }
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
  // ---- ChatGPT の機構試験の**指定場**(u=Ω_mesh(r)·(−y,x)・W(r)=20/(1+r²)・D₀=1・Ω_n=1/√(r²+0.2²))
  //      χ=W/(W+D₀)=20/(21+r²)・Ω_mesh=χΩ_n。**これは Ω_n を入力した運動学的実現**であって、
  //      平坦回転曲線・自律的な 2 本腕・バー安定性の予測ではない。
  W.chatField = (x, y) => {
    const r2 = x * x + y * y, r = Math.sqrt(r2);
    const chi = 20 / (21 + r2), On = 1 / Math.sqrt(r2 + 0.04), f = chi * On;
    const dlf = -2 * r / (21 + r2) - r / (r2 + 0.04);       // f'/f
    const fp = f * dlf, s = (r > 0) ? fp / r : 0;           // f'(r)/r
    return { u: [-f * y, f * x],
      gradU: [-y * s * x, -f - y * s * y, f + x * s * x, x * s * y],
      dUdt: [0, 0], chi };
  };
});

// ============================================================ ① 局所場と χ(r)
if (want('chi')) {
  out.chi = await pg.evaluate(() => {
    const W = window.__w254, res = {};
    const setups = [
      { id: 'galaxyStd', label: '🎡 galaxyStd', rMax: 260 },
      { id: 'axisBarArms', label: '🎏 axisBarArms', rMax: 260 },
    ];
    for (const st of setups) {
      const S = W.build(st.id);
      const D0nom = S.params.D0;
      const rows = [];
      const D0s = [D0nom * 0.1, D0nom, D0nom * 10];
      const rec0 = HP.dfmGalaxyMeshRecord(S, { bins: 13, rMax: st.rMax, azimuths: 24, field: { D0: D0nom } });
      for (let b = 0; b < rec0.bins.length; b++) {
        const B = rec0.bins[b], row = { r: B.r, count: B.count, W: B.W, v_phi: B.v_phi,
          u_mesh_phi: B.u_mesh_phi, diff: B.diff, chi: [] };
        for (const d of D0s) {
          const rr = HP.dfmGalaxyMeshRecord(S, { bins: 13, rMax: st.rMax, azimuths: 24, field: { D0: d } });
          row.chi.push(rr.bins[b].chi);
        }
        rows.push(row);
      }
      // 中心での χ(粒子の直上ではなく中心 r=0 の 1 点)
      const c0 = HP.dfmGalaxyMeshField(S, 0, 0, { D0: D0nom });
      res[st.id] = { label: st.label, D0nom, D0s, softening: S.params.softening,
        p: c0.p, center: { W: c0.W, chi: c0.chi, u: c0.u, mode: c0.mode }, rows };
    }
    return res;
  });
  console.log('§CHI done');
}

// ============================================================ ② 物質線の巻き込み
if (want('wind')) {
  out.wind = await pg.evaluate(() => {
    const W = window.__w254, res = {};
    // ---- (a) 指定場(ChatGPT の機構試験)—— 器が同じであることの検算
    {
      const S = HP.sim;
      const tr = HP.dfmGalaxyTracerCreate(S, { lines: 4, perLine: 3, rMin: 1, rMax: 8, field: W.chatField });
      // 節点は r=1, 4.5, 8。r=3 は別に 1 本置く
      const tr3 = HP.dfmGalaxyTracerCreate(S, { lines: 1, perLine: 2, rMin: 3, rMax: 8, field: W.chatField });
      const dts = [0.01, 0.005, 0.0025];
      const rows = [];
      for (const dt of dts) {
        const t1 = HP.dfmGalaxyTracerCreate(S, { lines: 1, perLine: 3, rMin: 1, rMax: 8, field: W.chatField });
        // r = 1, 4.5, 8 の 3 点 + r=3 を別 tracer で
        const t2 = HP.dfmGalaxyTracerCreate(S, { lines: 1, perLine: 2, rMin: 3, rMax: 8, field: W.chatField });
        const nstep = Math.round(2 / dt);
        for (let k = 0; k < nstep; k++) { HP.dfmGalaxyTracerStep(t1, dt, S); HP.dfmGalaxyTracerStep(t2, dt, S); }
        const o1 = HP.dfmGalaxyTracerObserve(t1, { nodes: true });
        const o2 = HP.dfmGalaxyTracerObserve(t2, { nodes: true });
        rows.push({ dt,
          r1: { dTheta: o1.nodes[0].dTheta, detF: o1.nodes[0].detF, chi: o1.nodes[0].chi },
          r3: { dTheta: o2.nodes[0].dTheta, detF: o2.nodes[0].detF, chi: o2.nodes[0].chi },
          r8: { dTheta: o1.nodes[2].dTheta, detF: o1.nodes[2].detF, chi: o1.nodes[2].chi } });
      }
      const th = (r) => { const chi = 20 / (21 + r * r), On = 1 / Math.sqrt(r * r + 0.04); return 2 * chi * On; };
      res.prescribed = { rows, analytic: { r1: th(1), r3: th(3), r8: th(8),
        chi1: 20 / 22, chi3: 20 / 30, chi8: 20 / 85 },
        note: 'Ω_n を入力した運動学的実現。平坦回転曲線・自律的な 2 本腕・バー安定性の予測ではない' };
      HP.sim.hasGalaxyTracer = false; HP.sim._galTracer = null;
    }
    // ---- (b) エンジンの粒子速度から作った場(観測回転曲線は入力にしていない)
    for (const id of ['galaxyStd', 'axisBarArms']) {
      const S = W.build(id);
      const tr = HP.dfmGalaxyTracerCreate(S, { lines: 8, perLine: 13, rMin: 20, rMax: 240,
        field: { bgGrad: 'zero' } });
      const marks = [750, 1500, 3000], samples = [];
      const nodesAt = [];
      for (let k = 1; k <= 3000; k++) {
        S.step(0.016);
        if (marks.indexOf(k) >= 0) {
          const o = HP.dfmGalaxyTracerObserve(tr, { nodes: true });
          const pick = (b) => { const nd = o.nodes.filter((z) => z.k === b);
            const m = (f) => nd.reduce((a, z) => a + f(z), 0) / nd.length;
            return { r0: nd[0].r0, r: m((z) => z.r), dTheta: m((z) => z.dTheta),
              detF: m((z) => z.detF), chi: m((z) => z.chi) }; };
          samples.push({ step: k, t: S.t, windMean: o.windMean, windMax: o.windMax,
            stopped: o.stopped, inner: pick(0), mid: pick(6), outer: pick(12) });
        }
      }
      res[id] = { samples, nan: S.hasNaN ? S.hasNaN() : null };
    }
    return res;
  });
  console.log('§WIND done');
}

// ============================================================ ③ セルの形の対照
if (want('cell')) {
  out.cell = await pg.evaluate(() => {
    const W = window.__w254;
    const S = W.build('galaxyStd');
    for (let k = 0; k < 600; k++) S.step(0.016);
    const pts = [[30, 0], [80, 0], [160, 0], [60, 60], [-120, 40]];
    const rows = [];
    for (const [x, y] of pts) {
      const cont = HP.dfmGalaxyMeshField(S, x, y, {});
      const contZ = HP.dfmGalaxyMeshField(S, x, y, { bgGrad: 'zero' });
      const cells = [5, 20, 50].map((c) => HP.dfmGalaxyMeshField(S, x, y, { cellSize: c }));
      // 局所三角形(T3): 最近傍 3 粒子を頂点にしたアフィンセル
      const d = [];
      for (let i = 0; i < S.n; i++) d.push([(S.x[i] - x) ** 2 + (S.y[i] - y) ** 2, i]);
      d.sort((a, b) => a[0] - b[0]);
      const ids = [d[0][1], d[1][1], d[2][1]].sort((a, b) => a - b);
      const an = HP.dfmSpaceMeshCapture(S, ids);
      const ms = an ? HP.dfmSpaceMeshState(an, S) : null;
      const at = ms ? HP.dfmSpaceMeshAt(ms, x, y, S) : null;
      rows.push({ x, y, W: cont.W, chi: cont.chi, u: cont.u, gradU: cont.gradU, dUdt: cont.dUdt,
        un: cont.un, ubg: cont.ubg, gradUbg: cont.gradUbg,
        bgGradZeroDiff: [contZ.gradU[0] - cont.gradU[0], contZ.gradU[1] - cont.gradU[1],
          contZ.gradU[2] - cont.gradU[2], contZ.gradU[3] - cont.gradU[3]],
        cells: cells.map((c, i) => ({ cellSize: [5, 20, 50][i], chi: c.chi, u: c.u,
          duRel: Math.hypot(c.u[0] - cont.u[0], c.u[1] - cont.u[1]) / Math.max(1e-30, Math.hypot(cont.u[0], cont.u[1])) })),
        tri: at ? { ids, chi: ms.chi, mode: ms.mode, detF: ms.detF, u: [at.ux, at.uy],
          uMesh: [at.uMeshX, at.uMeshY], divU: ms.divU,
          duRel: Math.hypot(at.ux - cont.u[0], at.uy - cont.u[1]) / Math.max(1e-30, Math.hypot(cont.u[0], cont.u[1])) } : null });
    }
    // 巻き数がセルの形で変わるか(同じ 600 步窓・同じ初期線)
    const winds = [];
    for (const cs of [0, 20, 50]) {
      const S2 = W.build('galaxyStd');
      const tr = HP.dfmGalaxyTracerCreate(S2, { lines: 4, perLine: 9, rMin: 20, rMax: 240,
        field: { cellSize: cs, bgGrad: 'zero' } });
      for (let k = 0; k < 600; k++) S2.step(0.016);
      const o = HP.dfmGalaxyTracerObserve(tr, { nodes: true });
      winds.push({ cellSize: cs, windMean: o.windMean, stopped: o.stopped,
        innerDTheta: o.nodes[0].dTheta, outerDTheta: o.nodes[8].dTheta,
        innerDetF: o.nodes[0].detF, outerDetF: o.nodes[8].detF });
    }
    return { rows, winds };
  });
  console.log('§CELL done');
}

// ============================================================ ④ 5 量の記録器
if (want('rec')) {
  out.rec = await pg.evaluate(() => {
    const W = window.__w254;
    const S = W.build('axisBarArms');     // 棒/腕の模様がある系(Ω_pattern が意味を持つ)
    const recs = [];
    let prev = null;
    for (const k of [0, 750, 1500, 3000]) {
      while (Math.round(S.t / 0.016) < k) S.step(0.016);
      const r = HP.dfmGalaxyMeshRecord(S, { bins: 10, rMax: 260, azimuths: 24, prev,
        field: { bgGrad: 'zero' } });
      recs.push({ step: k, t: S.t, bins: r.bins });
      prev = r;
    }
    return { note: 'v_obs は光学層が無いため全ビン null(宣言)', recs };
  });
  console.log('§REC done');
}

// ============================================================ ⑤ 新サンプル 🎠
if (want('sample')) {
  out.sample = await pg.evaluate(() => {
    const W = window.__w254;
    const id = 'galaxyMeshSpiral';
    const pd = W.byId(id);
    if (!pd) return { missing: true };
    const run = () => {
      const S = W.build(id);
      const tr = HP.dfmGalaxyTracerCreate(S, { lines: 8, perLine: 13, rMin: 20, rMax: 240,
        field: { bgGrad: 'zero' } });
      for (let k = 0; k < 3000; k++) S.step(0.016);
      return { hash: W.hash(S), tr: W.trHash(tr), S, tr2: tr };
    };
    const a = run(), b = run();
    // **HP.sim は単一オブジェクト**なので、A 側の測定は B 側を build する**前に**すべて採る
    const S = a.S, tr = a.tr2;
    const o = HP.dfmGalaxyTracerObserve(tr, { nodes: true });
    const chiAt = [20, 80, 240].map((r) => { const f = HP.dfmGalaxyMeshField(S, r, 0, {}); return { r, chi: f.chi, W: f.W }; });
    const rec = HP.dfmGalaxyMeshRecord(S, { bins: 8, rMax: 260, azimuths: 24, field: { bgGrad: 'zero' } });
    const nanA = S.hasNaN(), tA = S.t, nA = S.n;
    const clampA = { vel: S.clampN || 0, spin: S.clampSN || 0, react: S.clampRN || 0 };
    // A/B(D₀ 大 = abQuick)側の χ —— ここから先の HP.sim は B 側である
    const SB = W.build(id, { D0: pd.abQuick ? pd.abQuick.v : 500 });
    const chiB = [20, 80, 240].map((r) => { const f = HP.dfmGalaxyMeshField(SB, r, 0, {}); return { r, chi: f.chi }; });
    return { overlays: JSON.parse(JSON.stringify(HP.validatePreset(JSON.parse(JSON.stringify(pd))).preset.overlays)),
      emoji: pd.emoji, sampleClass: pd.sampleClass, cLight: pd.physics.cLight,
      nan: nanA, clamps: clampA, bitSame: a.hash === b.hash, trBitSame: a.tr === b.tr,
      hash: a.hash, trHash: a.tr, n: nA, t: tA,
      windMean: o.windMean, windMax: o.windMax, stopped: o.stopped,
      inner: o.nodes.filter((z) => z.k === 0)[0], outer: o.nodes.filter((z) => z.k === 12)[0],
      chiA: chiAt, chiB, abQuick: pd.abQuick || null,
      rec: rec.bins.map((b2) => ({ r: b2.r, v_phi: b2.v_phi, u_mesh_phi: b2.u_mesh_phi,
        diff: b2.diff, chi: b2.chi, v_obs: b2.v_obs, A2: b2.A2 })) };
  });
  console.log('§SAMPLE done');
}

out.pageErrors = pageErrors;
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log('written', OUT, 'pageErrors', pageErrors.length);
await browser.close();
