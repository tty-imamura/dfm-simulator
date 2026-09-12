// 第257便c W3「重心原点の蓄積格子(mode:"mesh")・表示専用 gain・表示がおかしい原因の修正・
// D₀ スライダー下限 0」(第49報)の実測ハーネス。
//
// 原仮定者(第49報): 「空間メッシュの描画を変更する。全体の重心を原点にしたメッシュを描画する。
//   原点に近い交点から順に、引きずり量を反映して座標変換する。続く交点に対して座標変換を蓄積する
//   事で、空間の歪みを表現する。引きずり量を反映する度合は、パラメータの空間メッシュにスライダーを
//   追加して調整可能にする」「『背景決定力 D₀』のスライダーの下限を『0』にする」
//   「表示がおかしいので、物理計算についても確認する」。
//
// ■ 節(すべて実測。予想は 1 つも書かない)
//   ODE  : 解析場(恒等/剛体回転/等方拡縮/せん断)で写像 Φ と厳密解を突き合わせる。
//          RK4 の区間数・格子の分割数・gain を振って、誤差と「分割不変」を測る。
//   LOOP : 共有交点の一致(閉路残差)と、辺差分の累積が経路に依らないこと。
//   GAIN : 🫂🪟🎠 で gain を 0〜2 に掃引し、**折返しが出る境界**(最小面積比 ≤0)を探す。
//   COST : 1 フレームの描画時間(OFF / mesh / lines / guide / transport / tracer)と再構築 1 回。
//   VALID: 銀河の有効範囲(unValid)で交点が落ちること・分類(_slKindOf)の新規則の全 120 本の内訳。
//   D0   : **D₀=0** を代表プリセットへ入れて 600 步(NaN・クランプ・帳簿)と、D₀=0.005 との連続性。
//   BIT  : 全内蔵プリセット × 600 步の状態ハッシュと検証後 JSON を基点と突き合わせる。
//
// 実行: node tests/exp-w257c-mesh.mjs [--ode] [--loop] [--gain] [--cost] [--valid] [--d0] [--bit]
//       W257C_BASE=<基点 html> で BIT の基点を指定する(既定 tests/out/base-w257c.html)
// 出力: tests/out/mesh-w257c.json(数値は docs/PHYSICS.md〔第257便c〕へ全載)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + path.join(ROOT, TARGET);
const OUT = path.join(ROOT, 'tests', 'out', 'mesh-w257c.json');
const BASE = process.env.W257C_BASE || path.join(ROOT, 'tests', 'out', 'base-w257c.html');
const argv = process.argv.slice(2);
const only = argv.filter((a) => a.startsWith('--')).map((a) => a.slice(2));
const want = (k) => !only.length || only.includes(k);

async function getBrowser() {
  const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  try { const { chromium } = await import('playwright'); return await chromium.launch(); } catch {}
  try { const { chromium } = await import('playwright'); return await chromium.launch({ executablePath: exe }); } catch {}
  const { chromium } = await import('playwright-core');
  return chromium.launch({ executablePath: exe });
}

const out = { target: TARGET, node: process.version, at: new Date().toISOString(), wave: '257c' };
const browser = await getBrowser();
const pageErrors = [];
const pg = await browser.newPage();
pg.on('pageerror', (e) => pageErrors.push(String(e.message || e)));
await pg.goto(INDEX, { waitUntil: 'load' });
await pg.waitForFunction(() => window.HP && HP.sim && HP.currentPreset());

// ================================================================ ODE(解析場と厳密解)
if (want('ode')) {
  console.error('[w257c] ODE: 解析場(恒等/回転/拡縮/せん断)で Φ と厳密解を突き合わせる');
  out.ode = await pg.evaluate(() => {
    const C = HP.spaceGridConst();
    const R = 100, cx = 7, cy = -3;
    // 場は **u(C) を引いた形**が効く。u が定数なら Φ=恒等、線形なら Φ=exp(g A tau)。
    const fields = {
      identity: { f: () => [2.5, -1.25, 1], A: [0, 0, 0, 0] },
      rotation: { f: (x, y) => [-0.2 * (y - cy), 0.2 * (x - cx), 1], A: [0, -0.2, 0.2, 0] },
      scaling: { f: (x, y) => [0.15 * (x - cx), 0.15 * (y - cy), 1], A: [0.15, 0, 0, 0.15] },
      shear: { f: (x, y) => [0.3 * (y - cy), 0, 1], A: [0, 0.3, 0, 0] },
    };
    // 2x2 行列指数(級数・十分な項数)
    const expm = (A, s) => {
      let M = [1, 0, 0, 1], T = [1, 0, 0, 1];
      for (let k = 1; k <= 60; k++) {
        const B = [T[0] * A[0] + T[1] * A[2], T[0] * A[1] + T[1] * A[3],
          T[2] * A[0] + T[3] * A[2], T[2] * A[1] + T[3] * A[3]];
        T = [B[0] * s / k, B[1] * s / k, B[2] * s / k, B[3] * s / k];
        M = [M[0] + T[0], M[1] + T[1], M[2] + T[2], M[3] + T[3]];
      }
      return M;
    };
    const run = (name, gain, K, steps) => {
      const F = fields[name];
      const g = HP.dfmSpaceGridBuild({ field: F.f, cx, cy, R, K, gain, steps });
      if (!g) return null;
      const E = expm(F.A, gain * g.tau);
      let err = 0;
      for (let j = 0; j < g.K; j++) for (let i = 0; i < g.K; i++) {
        const k = j * g.K + i;
        if (!g.ok[k]) continue;
        const qx = (cx - R) + i * g.h - cx, qy = (cy - R) + j * g.h - cy;
        const ex = cx + E[0] * qx + E[1] * qy, ey = cy + E[2] * qx + E[3] * qy;
        const d = Math.hypot(g.X[k] - ex, g.Y[k] - ey);
        if (d > err) err = d;
      }
      // 外周の 1 点の回転角(分割不変の見張り)
      const kc = ((g.K - 1) / 2) * g.K + (g.K - 1);
      const th = Math.atan2(g.Y[kc] - cy, g.X[kc] - cx);
      return { K: g.K, steps: g.steps, gain, tau: g.tau, vRef: g.vRef,
        errAbs: err, errRel: err / R, minArea: g.minAreaRatio, folded: g.folded,
        loopMax: g.loopMax, loopRel: g.loopMax / R, theta: th, nOk: g.nOk };
    };
    const o = { const: C, R, cx, cy, rows: {}, stepConv: {}, split: {}, gainRows: {} };
    for (const nm of Object.keys(fields)) o.rows[nm] = run(nm, 1, C.K, C.steps);
    // RK4 の区間数を振る(収束の次数)
    for (const N of [2, 4, 8, 16, 32]) o.stepConv[N] = run('rotation', 1, C.K, N).errRel;
    // **格子 8 分割 → 16 分割で回転角が不変**(角度を辺ごとに足す実装なら変わる)
    for (const K of [5, 9, 17, 33]) o.split[K] = run('rotation', 1, K, C.steps);
    // gain を振ったときの誤差(既定の区間数で)
    for (const gg of [0.25, 0.5, 1, 2]) o.gainRows[gg] = run('rotation', gg, C.K, C.steps);
    return o;
  });
  const o = out.ode;
  for (const nm of Object.keys(o.rows)) {
    const r = o.rows[nm];
    console.error(`  ${nm}: 誤差 ${r.errAbs.toExponential(3)}(相対 ${r.errRel.toExponential(3)})・` +
      `最小面積比 ${r.minArea.toFixed(9)}・閉路残差 ${r.loopMax.toExponential(3)}`);
  }
  console.error('  RK4 区間数 → 相対誤差: ' + Object.keys(o.stepConv).map((k) => `${k}:${o.stepConv[k].toExponential(2)}`).join(' / '));
  console.error('  分割 K → 外周角(rad): ' + Object.keys(o.split).map((k) => `${k}:${o.split[k].theta.toFixed(12)}`).join(' / '));
}

// ================================================================ LOOP(共有交点・経路非依存)
if (want('loop')) {
  console.error('[w257c] LOOP: 共有交点の一致(閉路残差)と累積の経路非依存');
  out.loop = await pg.evaluate(() => {
    const o = {};
    for (const id of ['spaceMeshBinaryToy', 'galaxyMeshSpiral']) {
      HP.loadPreset(id, false);
      const S = HP.sim;
      HP.spaceGridInvalidate(S); HP.spaceGridEnsure(S);
      const st = HP.spaceGridNow(S);
      o[id] = { K: st.grid.K, loopMax: st.grid.loopMax, R: st.grid.R,
        loopRel: st.grid.loopMax / st.grid.R, nOk: st.grid.nOk, nodes: st.grid.nodes };
    }
    // 純関数側: 累積(X) と写像そのもの(phiX)の差 = 経路に依らないことの直接確認
    const g = HP.dfmSpaceGridBuild({ field: (x, y) => [-0.2 * y + 0.03 * x, 0.2 * x, 1],
      cx: 0, cy: 0, R: 100, K: 17, gain: 1 });
    let dmax = 0;
    for (let k = 0; k < g.nodes; k++) if (g.ok[k]) {
      const d = Math.hypot(g.X[k] - (g.phiX[k] - g.phiX[(g.K * g.K - 1) / 2] + g.X[(g.K * g.K - 1) / 2]),
        g.Y[k] - (g.phiY[k] - g.phiY[(g.K * g.K - 1) / 2] + g.Y[(g.K * g.K - 1) / 2]));
      if (d > dmax) dmax = d;
    }
    o.accumVsMap = { max: dmax, rel: dmax / 100, K: g.K, loopMax: g.loopMax };
    return o;
  });
  console.error('  ' + JSON.stringify(out.loop));
}

// ================================================================ GAIN(折返しの境界)
if (want('gain')) {
  console.error('[w257c] GAIN: gain 掃引と折返し境界(最小面積比 ≤0)');
  out.gain = await pg.evaluate(() => {
    const o = { rows: {}, boundary: {}, def: HP.spaceGridConst().gainDef };
    const gs = [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
    for (const id of ['boxBinaryToy', 'spaceMeshBinaryToy', 'galaxyMeshSpiral']) {
      HP.loadPreset(id, false);
      const S = HP.sim;
      const rows = [];
      for (const g of gs) {
        S.overlays.spaceMesh = { mode: 'mesh', gain: g };
        HP.spaceGridInvalidate(S); HP.spaceGridEnsure(S);
        const st = HP.spaceGridNow(S).grid;
        rows.push({ gain: g, minArea: st.minAreaRatio, folded: st.folded, folds: st.folds,
          cells: st.cells, nOk: st.nOk, tau: st.tau, vRef: st.vRef, chi: st.chi });
      }
      o.rows[id] = rows;
      // 折返しが出ない最大の gain(0.05 刻みで詰める)
      let last = 0;
      for (let g = 0; g <= 2.0001; g += 0.05) {
        const gg = Math.round(g * 100) / 100;
        S.overlays.spaceMesh = { mode: 'mesh', gain: gg };
        HP.spaceGridInvalidate(S); HP.spaceGridEnsure(S);
        const st = HP.spaceGridNow(S).grid;
        if (st.folded) break;
        last = gg;
      }
      o.boundary[id] = last;
      // 600 步まわしたあと(構造が育ったあと)の境界も見る
      HP.loadPreset(id, false);
      const S2 = HP.sim;
      for (let i = 0; i < 600; i++) S2.step(0.016);
      let last2 = 0;
      for (let g = 0; g <= 2.0001; g += 0.05) {
        const gg = Math.round(g * 100) / 100;
        S2.overlays.spaceMesh = { mode: 'mesh', gain: gg };
        HP.spaceGridInvalidate(S2); HP.spaceGridEnsure(S2);
        const st = HP.spaceGridNow(S2).grid;
        if (st.folded) break;
        last2 = gg;
      }
      o.boundary[id + '@600'] = last2;
    }
    return o;
  });
  console.error('  折返しが出ない最大 gain: ' + JSON.stringify(out.gain.boundary));
}

// ================================================================ COST(1 フレームの描画時間)
if (want('cost')) {
  console.error('[w257c] COST: 1 フレームの描画時間(OFF/mesh/lines/guide/transport/tracer)');
  out.cost = await pg.evaluate(() => {
    const bench = (fn, n) => { fn(); let best = Infinity;
      for (let r = 0; r < 5; r++) { const t0 = performance.now();
        for (let i = 0; i < n; i++) fn();
        const d = (performance.now() - t0) / n; if (d < best) best = d; }
      return best; };
    const o = {};
    for (const id of ['spaceMeshBinaryToy', 'galaxyMeshSpiral']) {
      HP.loadPreset(id, false); HP.setQuality('exact');
      const S = HP.sim, row = {};
      for (const m of [null, 'mesh', 'lines', 'guide', 'transport', 'tracer']) {
        S.overlays.spaceMesh = m ? { mode: m } : false;
        HP.spaceGridInvalidate(S); HP.spaceLineInvalidate(S); HP.tick(0);
        row[m || 'off'] = bench(() => HP.tick(0), 60);
      }
      S.overlays.spaceMesh = { mode: 'mesh' };
      HP.spaceGridInvalidate(S); HP.spaceGridEnsure(S);
      const st = HP.spaceGridNow(S);
      row.buildMs = st.ms; row.every = st.every; row.K = st.grid.K; row.samples = st.grid.samples;
      o[id] = row;
    }
    return o;
  });
  for (const k of Object.keys(out.cost)) {
    const r = out.cost[k];
    console.error(`  ${k}: off ${r.off.toFixed(3)} / mesh ${r.mesh.toFixed(3)} / lines ${r.lines.toFixed(3)} / ` +
      `guide ${r.guide.toFixed(3)} / transport ${r.transport.toFixed(3)} / tracer ${r.tracer.toFixed(3)} ms ` +
      `(再構築 ${r.buildMs.toFixed(2)}ms・間隔 ${Math.round(r.every)}ms)`);
  }
}

// ================================================================ VALID(有効範囲と分類)
if (want('valid')) {
  console.error('[w257c] VALID: unValid で交点が落ちること・新しい分類規則の全 120 本の内訳');
  out.valid = await pg.evaluate(() => {
    const o = {};
    HP.loadPreset('galaxyMeshSpiral', false);
    const S = HP.sim;
    HP.spaceGridInvalidate(S); HP.spaceGridEnsure(S);
    const st = HP.spaceGridNow(S).grid;
    const f = HP.dfmGalaxyMeshField(S, 0, 0, { need: 'u' });
    o.galaxy = { K: st.K, R: st.R, nodes: st.nodes, nOk: st.nOk, nInvalid: st.nInvalid,
      samples: st.samples, sampleBad: st.sampleBad,
      supportR: f.supportR, supportC: f.supportC, unValid: f.unValid };
    // 空間線: 有効範囲の外で止まる(第256便c は止めずに描き、読めなければ連星場へ落ちていた)
    S.overlays.spaceMesh = { mode: 'lines' };
    HP.spaceLineInvalidate(S); HP.spaceLineEnsure(S);
    const sl = HP.spaceLineNow(S);
    o.lines = { kind: sl.kind, lines: sl.lines, pts: sl.pts, seg: sl.seg, L: sl.L, baseLen: sl.baseLen };
    // 新しい分類(宣言 / 2 体 / 上位 2 体)の内訳を全内蔵で数える
    const tally = { declared: [], pair: [], top2: [] };
    for (const p of HP.allPresets()) {
      const v = HP.validatePreset(JSON.parse(JSON.stringify(p)));
      if (!v.ok) continue;
      HP.sim.build(v.preset);
      tally[HP.spaceLineKindNote(HP.sim)].push(p.id);
    }
    o.tally = { declared: tally.declared, nDeclared: tally.declared.length,
      nPair: tally.pair.length, nTop2: tally.top2.length,
      pairSample: tally.pair.slice(0, 8), top2Sample: tally.top2.slice(0, 8) };
    // 重心と最大質量源の差(🎠)
    HP.loadPreset('galaxyMeshSpiral', false);
    const G = HP.sim;
    let i0 = 0; for (let i = 0; i < G.n; i++) if (G.m[i] > G.m[i0]) i0 = i;
    const bc = HP.massCentreOf(G);
    o.centre = { barycentre: bc, maxMass: [G.x[i0], G.y[i0]],
      gap: Math.hypot(bc[0] - G.x[i0], bc[1] - G.y[i0]) };
    return o;
  });
  console.error('  ' + JSON.stringify(out.valid.tally));
  console.error('  🎠 格子: ' + JSON.stringify(out.valid.galaxy));
}

// ================================================================ D0(下限 0 の安全)
if (want('d0')) {
  console.error('[w257c] D0: D₀=0 を代表プリセットへ入れて 600 步 + D₀=0.005 との連続性');
  out.d0 = await pg.evaluate(() => {
    const ids = ['galaxy', 'boxBinaryToy', 'spaceMeshBinaryToy', 'galaxyMeshSpiral',
      'psrDoubleABDFM', 'gas', 'convection', 'rotorSolo', 'starSeed', 'boxtrans'];
    const o = { rows: {}, cont: {}, builtinZero: [] };
    const runAt = (id, D0) => {
      const p = HP.allPresets().find((z) => z.id === id);
      if (!p) return null;
      const q = JSON.parse(JSON.stringify(p));
      q.physics = Object.assign({}, q.physics, { D0 });
      const v = HP.validatePreset(q);
      if (!v.ok) return { error: v.errors.join(';') };
      const S = HP.sim; S.build(v.preset);
      for (let i = 0; i < 600; i++) S.step(0.016);
      let a = 0x811c9dc5;
      const buf = new ArrayBuffer(8), fa = new Float64Array(buf), u8 = new Uint8Array(buf);
      const push = (v2) => { fa[0] = v2; for (let b = 0; b < 8; b++) { a ^= u8[b]; a = Math.imul(a, 0x01000193) >>> 0; } };
      let maxV = 0, sumR = 0;
      for (let i = 0; i < S.n; i++) { push(S.x[i]); push(S.y[i]); push(S.vx[i]); push(S.vy[i]);
        const sp = Math.hypot(S.vx[i], S.vy[i]); if (sp > maxV) maxV = sp;
        sumR += Math.hypot(S.x[i], S.y[i]); }
      return { D0, nan: S.hasNaN(), clampV: S.clampVN, clampS: S.clampSN, clampR: S.clampRN,
        clampH: S.clampHN, hash: a.toString(16), maxV, meanR: sumR / S.n,
        resPx: S.resPx, resPy: S.resPy, resL: S.resL, t: S.t, n: S.n,
        wE: (S.spaceMeshWorkE === undefined) ? null : S.spaceMeshWorkE,
        finite: Number.isFinite(S.resPx) && Number.isFinite(S.resL) && Number.isFinite(maxV) };
    };
    for (const id of ids) {
      const z = runAt(id, 0), s = runAt(id, 0.005), t = runAt(id, 0.05);
      o.rows[id] = { zero: z, small: s, mid: t };
      if (z && s && !z.error && !s.error) {
        o.cont[id] = { dMeanR: Math.abs(z.meanR - s.meanR) / Math.max(1e-12, Math.abs(s.meanR)),
          dMeanR2: Math.abs(s.meanR - t.meanR) / Math.max(1e-12, Math.abs(t.meanR)) };
      }
    }
    // 既存の内蔵 D₀=0 プリセットの棚卸し
    for (const p of HP.allPresets()) if (p.physics && p.physics.D0 === 0)
      o.builtinZero.push({ id: p.id, emoji: p.emoji, kFrame: p.physics.kFrame, G: p.physics.G,
        D0pull: p.physics.D0pull === undefined ? null : p.physics.D0pull });
    // 1 点の χ(D₀=0 で 1 になること・源の無い点の門)
    HP.loadPreset('spaceMeshBinaryToy', false);
    const S = HP.sim;
    o.chiZero = { d0: HP.dfmBinaryChi(500, 500, 240, 0, 0.05, 2),
      d0mass0: HP.dfmBinaryChi(0, 0, 240, 0, 0.05, 2),
      d0pos: HP.dfmBinaryChi(500, 500, 240, 1e-4, 0.05, 2) };
    return o;
  });
  console.error('  内蔵 D₀=0: ' + out.d0.builtinZero.map((z) => z.emoji + z.id).join(' / '));
  for (const id of Object.keys(out.d0.rows)) {
    const r = out.d0.rows[id];
    if (!r.zero || r.zero.error) { console.error(`  ${id}: ${r.zero ? r.zero.error : 'なし'}`); continue; }
    console.error(`  ${id}: D₀=0 → NaN=${r.zero.nan}・clamp V/S/R=${r.zero.clampV}/${r.zero.clampS}/${r.zero.clampR}・` +
      `⟨r⟩=${r.zero.meanR.toExponential(6)}(D₀=0.005 で ${r.small.meanR.toExponential(6)})`);
  }
}

// ================================================================ BIT(全内蔵 × 600 步 + 検証後 JSON)
if (want('bit') && fs.existsSync(BASE)) {
  console.error('[w257c] BIT: 全内蔵プリセット × 600 步(dt=0.016)+ 検証後 JSON を基点と突き合わせる');
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
  const pg2 = await browser.newPage();
  await pg2.goto('file://' + path.resolve(BASE), { waitUntil: 'load' });
  await pg2.waitForFunction(() => window.HP && HP.sim);
  const base = await hashAll(pg2);
  await pg2.close();
  const ids = Object.keys(cur.state), baseIds = Object.keys(base.state);
  const diffs = ids.filter((id) => cur.state[id] !== base.state[id]);
  const sigDiffs = ids.filter((id) => cur.sig[id] !== base.sig[id]);
  out.bit = { base: BASE, steps: 600, nCur: ids.length, nBase: baseIds.length, diffs, sigDiffs,
    identicalCount: ids.length - diffs.length,
    sigDiffDetail: sigDiffs.map((id) => ({ id,
      base: (base.sig[id].match(/"spaceMesh"[^,}]*(\}|)/) || [''])[0],
      cur: (cur.sig[id].match(/"spaceMesh"[^,}]*(\}|)/) || [''])[0],
      baseName: (base.sig[id].match(/"name":"[^"]*"/) || [''])[0],
      curName: (cur.sig[id].match(/"name":"[^"]*"/) || [''])[0] })) };
  console.error(`  状態: 現行 ${ids.length} 本 / 基点 ${baseIds.length} 本 — 差=${diffs.length ? diffs.join(',') : 'なし'}`);
  console.error(`  署名: 差=${sigDiffs.length ? sigDiffs.join(',') : 'なし'}`);
  for (const d of out.bit.sigDiffDetail) console.error(`    ${d.id}: ${d.base} → ${d.cur}`);
} else if (want('bit')) {
  console.error(`[w257c] BIT: 基点 html が無いので省略(${BASE})`);
}

out.pageErrors = pageErrors;
await browser.close();
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.error(`[w257c] 出力: ${OUT}${pageErrors.length ? ' / pageErrors=' + pageErrors.length : ''}`);
