// 第256便c W3「表示の整理 —— 排他表示・表示所有 tracer の停止・線長のズーム不変・色・値域 1 形化・
// サンプルを選ぶ UI」(第48報)の実測ハーネス。
//
// 原仮定者(第48報): 「空間メッシュは、複数の表示方式が混在しているが、重たい処理を整理する。
//   表示色も軌跡と混ざらない様に見易くする」「『サンプルを選ぶ』UI: 『グループ(一覧の見出し)』の
//   名前は『グループ』にし、グループ一覧の先頭に移動する」。
//
// ■ 節(すべて実測。予想は 1 つも書かない)
//   LEN  : 線の長さ L の**ズーム不変**。camScale を振って L・線の世界座標・再構築回数を見る。
//          倍率(連星 = 分離 r の倍数 / 銀河 = 最外縁までの距離の倍数)は第255便c の
//          L=1.2×camScale と突き合わせて決める。**逃走粒子への感度**(r_out の時間変化)も測る。
//   COST : 1 フレームの描画時間を **4 モード**(lines/guide/transport/tracer)+ OFF で測る。
//          排他表示にしたので tracer のフレームに空間線の再構築は乗らない。
//   TRACE: **表示所有 tracer の停止**。非表示で 600 步走らせて tr.steps が増えないこと・
//          明示登録した tracer は増えること・再表示で現在時刻に張り直すことを測る。
//   COLOR: 空間線の琥珀が、線の軌跡(氷青)・格子・**光線の波長色**からどれだけ離れているかを RGB 距離で測る。
//   MIG  : **値域 1 形化**の移行表。旧セーブの 3 形(true / true+spaceMeshMode / {mode})を
//          読み込んで正準形を突き合わせ、**捨てた宣言が 0 か**を数える。
//   BIT  : 全内蔵プリセット × 600 步(dt=0.016)の状態ハッシュと検証後 JSON を基点と突き合わせる
//          (表示便なので状態は全本一致・署名は意図した 3 本〔🫂🪟🎠〕だけが動く)。
//
// 実行: node tests/exp-w256c-display.mjs [--len] [--cost] [--trace] [--color] [--mig] [--bit]
//       W256C_BASE=<基点 html のパス> で BIT の基点を指定する(既定 tests/out/base-w256c.html)
// 出力: tests/out/display-w256c.json(.gitignore 既定どおり未コミット — 数値は PHYSICS に全載)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + path.join(ROOT, TARGET);
const OUT = path.join(ROOT, 'tests', 'out', 'display-w256c.json');
const BASE = process.env.W256C_BASE || path.join(ROOT, 'tests', 'out', 'base-w256c.html');
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

const out = { target: TARGET, node: process.version, at: new Date().toISOString(), wave: '256c' };
const browser = await getBrowser();
const pageErrors = [];
const pg = await browser.newPage();
pg.on('pageerror', (e) => pageErrors.push(String(e.message || e)));
await pg.goto(INDEX, { waitUntil: 'load' });
await pg.waitForFunction(() => window.HP && HP.sim && HP.currentPreset());

// ================================================================ LEN(線長のズーム不変)
if (want('len')) {
  console.error('[w256c] LEN: 線の長さ L のズーム不変・倍率・逃走粒子への感度');
  out.len = await pg.evaluate(() => {
    const o = { zoom: {}, ratio: {}, pulse: {}, drift: {} };
    const C = HP.spaceLineConst();
    o.const = { lenBin: C.lenBin, lenGal: C.lenGal, galNMin: C.galNMin, galMFrac: C.galMFrac, rgb: C.rgb };
    for (const id of ['boxBinaryToy', 'spaceMeshBinaryToy', 'galaxyMeshSpiral']) {
      HP.loadPreset(id, false);
      const S = HP.sim;
      const rows = [];
      for (const cs of [50, 130, 400, 1200]) {
        HP.setCamScale(cs);
        HP.spaceLineInvalidate(S); HP.spaceLineEnsure(S);
        const st = HP.spaceLineNow(S);
        const c = S._slCache, l0 = c.lines[0];
        rows.push({ camScale: cs, L: st.L, baseLen: st.baseLen, kind: st.kind, lines: st.lines,
          end: [l0.pts[2 * l0.n - 2], l0.pts[2 * l0.n - 1]] });
      }
      o.zoom[id] = rows;
      // ズームで再構築しないこと(鍵から camScale を外した)
      HP.spaceLineInvalidate(S); HP.spaceLineEnsure(S);
      const b0 = HP.spaceLineNow(S).builds;
      for (const cs of [50, 130, 400, 1200, 130]) { HP.setCamScale(cs); HP.spaceLineEnsure(S); }
      o.zoom[id + '.builds'] = { before: b0, after: HP.spaceLineNow(S).builds };
      HP.setCamScale(400);
    }
    // 第255便c の L(=1.2×camScale)との比
    o.ratio.prev = { boxBinaryToy: 156, spaceMeshBinaryToy: 180, galaxyMeshSpiral: 480 };
    // 連星の分離 r は公転で呼吸する(L も一緒に伸び縮みする)
    HP.loadPreset('spaceMeshBinaryToy', false);
    { const S = HP.sim; let mn = Infinity, mx = 0;
      for (let k = 0; k < 400000; k++) { S.step(0.004);      // 近点間 P≈1339.7(第254便a)= 1 公転より長く回す
        const d = Math.hypot(S.x[1] - S.x[0], S.y[1] - S.y[0]);
        if (d < mn) mn = d; if (d > mx) mx = d; }
      o.pulse.spaceMeshBinaryToy = { t: S.t, rMin: mn, rMax: mx, LMin: C.lenBin * mn, LMax: C.lenBin * mx, ratio: mx / mn }; }
    // 銀河の r_out は**最外縁の 1 粒子**で決まる(逃走粒子に敏感)
    HP.loadPreset('galaxyMeshSpiral', false);
    { const S = HP.sim;
      const radii = () => { let i0 = -1, mm = -Infinity;
        for (let i = 0; i < S.n; i++) if (S.m[i] > mm) { mm = S.m[i]; i0 = i; }
        const a = [];
        for (let i = 0; i < S.n; i++) a.push(Math.hypot(S.x[i] - S.x[i0], S.y[i] - S.y[i0]));
        a.sort((p2, q2) => p2 - q2);
        const q = (f) => a[Math.floor(f * (a.length - 1))];
        return { max: a[a.length - 1], second: a[a.length - 2], p95: q(0.95), p90: q(0.90), med: q(0.5) }; };
      const rows = [];
      for (const n of [0, 600, 3000, 12000, 40000]) {
        while (S.n > 0 && S.t < n * 0.016 - 1e-9) S.step(0.016);
        const r = radii();
        rows.push({ steps: n, rOut: r.max, rSecond: r.second, p95: r.p95, p90: r.p90, med: r.med,
          LOut: C.lenGal * r.max, growOut: r.max / 259.58718836857025, growP95: r.p95 / 199.92808621716662 });
      }
      o.drift.galaxyMeshSpiral = rows; }
    return o;
  });
  for (const id of ['boxBinaryToy', 'spaceMeshBinaryToy', 'galaxyMeshSpiral']) {
    const rows = out.len.zoom[id];
    console.error(`  ${id}: ` + rows.map((r) => `cam ${r.camScale}→L ${r.L.toFixed(1)}`).join(' / ')
      + ` | 基準長 ${rows[0].baseLen.toFixed(2)} / 第255便c の L=${out.len.ratio.prev[id]}`
      + ` / builds ${JSON.stringify(out.len.zoom[id + '.builds'])}`);
  }
  console.error(`  連星の呼吸: ${JSON.stringify(out.len.pulse)}`);
  console.error(`  銀河 r_out の推移: ${JSON.stringify(out.len.drift)}`);
}

// ================================================================ COST(4 モードの 1 フレーム描画)
if (want('cost')) {
  console.error('[w256c] COST: 1 フレームの描画時間(OFF / lines / guide / transport / tracer)');
  out.cost = await pg.evaluate(() => {
    const o = {};
    const bench = (fn, n) => { fn(); const t0 = performance.now(); for (let i = 0; i < n; i++) fn(); return (performance.now() - t0) / n; };
    // 4 コアの共有機で他エージェントの QA と同居しているので、1 巡の平均は隣の負荷で 10 倍ぶれる。
    // **巡ごとの最小値**を採る(下限は他プロセスの影響が最も薄い推定値)—— 絶対値は機械に依る
    const med = (a) => Math.min.apply(null, a);
    for (const id of ['spaceMeshBinaryToy', 'galaxyMeshSpiral']) {
      HP.loadPreset(id, false); HP.setQuality('exact');
      const S = HP.sim, f = {}, acc = {};
      const set = (m) => { S.overlays.spaceMesh = m ? { mode: m } : false; HP.spaceLineInvalidate(S); HP.tick(0); };
      const MODES = [null, 'lines', 'guide', 'transport', 'tracer'];
      // 3 巡(順・逆・順)で測って**中央値**を採る —— 1 巡だと JIT の暖まり順が結果の順序を決める
      for (let round = 0; round < 5; round++) {
        const seq = (round % 2 === 1) ? MODES.slice().reverse() : MODES;
        for (const m of seq) { set(m);
          const k = m || 'off'; (acc[k] = acc[k] || []).push(bench(() => HP.tick(0), 300)); }
      }
      for (const k of Object.keys(acc)) f[k] = med(acc[k]);
      f.raw = acc;
      set('lines');
      f.linesRebuild = bench(() => { HP.spaceLineInvalidate(S); HP.tick(0); }, 20);
      f.buildMs = HP.spaceLineNow(S).ms; f.every = HP.spaceLineNow(S).every;
      f.nLines = HP.spaceLineNow(S).lines; f.seg = HP.spaceLineNow(S).seg; f.kind = HP.spaceLineNow(S).kind;
      f.L = HP.spaceLineNow(S).L; f.baseLen = HP.spaceLineNow(S).baseLen;
      set('tracer');
      const ti = HP.tracerInfo(S); f.tracerNodes = ti ? ti.n : 0;
      // 排他: tracer のフレームでは空間線のキャッシュを作らない
      HP.spaceLineInvalidate(S); HP.tick(0);
      f.tracerBuildsSpaceLines = !!HP.spaceLineNow(S);
      set('lines');
      o[id] = f;
    }
    return o;
  });
  for (const id of Object.keys(out.cost)) console.error(`  ${id}: ${JSON.stringify(out.cost[id])}`);
}

// ================================================================ TRACE(表示所有 tracer の停止)
if (want('trace')) {
  console.error('[w256c] TRACE: 表示所有 tracer は非表示なら運ばない / 明示登録は運ぶ / 再表示で張り直す');
  out.trace = await pg.evaluate(() => {
    const o = {};
    // ① 表示所有(galaxyTracerEnsure が作る)—— 非表示 600 步で steps が増えない
    HP.loadPreset('galaxyMeshSpiral', false);
    let S = HP.sim;
    S.overlays.spaceMesh = { mode: 'tracer' };
    HP.tick(0);                                     // 描画で tracer が生まれる
    let ti = HP.tracerInfo(S);
    o.created = { displayOnly: ti.displayOnly, steps: ti.steps, n: ti.n, t: ti.t };
    for (let i = 0; i < 100; i++) S.step(0.016);    // 表示のまま 100 步 = 運ぶ
    o.shownSteps = HP.tracerInfo(S).steps;
    S.overlays.spaceMesh = { mode: 'lines' };       // 非表示(排他の別モード)
    const before = HP.tracerInfo(S).steps, tBefore = HP.tracerInfo(S).t;
    for (let i = 0; i < 600; i++) S.step(0.016);
    o.hidden = { before, after: HP.tracerInfo(S).steps, stale: HP.tracerInfo(S).stale,
      tBefore, tTracer: HP.tracerInfo(S).t, tSim: S.t };
    // ② 再表示は**現在時刻で張り直す**(止まっていた間を積分したように見せない)
    S.overlays.spaceMesh = { mode: 'tracer' }; HP.tick(0);
    ti = HP.tracerInfo(S);
    o.reshown = { steps: ti.steps, t: ti.t, tSim: S.t, stale: ti.stale };
    // ③ overlay を OFF にしても同じ(表示していない = 運ばない)
    S.overlays.spaceMesh = false;
    const b2 = HP.tracerInfo(S).steps;
    for (let i = 0; i < 200; i++) S.step(0.016);
    o.off = { before: b2, after: HP.tracerInfo(S).steps };
    // ④ **明示登録した測定用 tracer は止めない**(displayOnly が立っていない)
    HP.loadPreset('galaxyMeshSpiral', false);
    S = HP.sim;
    S.overlays.spaceMesh = false;
    const tr = HP.dfmGalaxyTracerCreate(S, { lines: 4, perLine: 8, rMin: 20, rMax: 200 });
    const e0 = HP.tracerInfo(S);
    for (let i = 0; i < 600; i++) S.step(0.016);
    const e1 = HP.tracerInfo(S);
    o.explicit = { displayOnly: e0.displayOnly, before: e0.steps, after: e1.steps, stopped: e1.stopped };
    return o;
  });
  console.error('  ' + JSON.stringify(out.trace));
}

// ================================================================ COLOR(色の距離)
if (want('color')) {
  console.error('[w256c] COLOR: 空間線の琥珀が、軌跡・格子・光線(波長色)とどれだけ離れているか');
  out.color = await pg.evaluate(() => {
    const amber = HP.spaceLineConst().rgb.split(',').map(Number);
    const d = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
    const hex2rgb = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
    let best = null;
    for (let nm = 300; nm <= 900; nm += 1) {     // 光線は波長色。**いちばん近い波長**を探す
      const c = hex2rgb(wavelengthColor(nm)), dd = d(amber, c);
      if (!best || dd < best.d) best = { nm, c, d: dd };
    }
    const lam = (typeof rayLambda0 !== 'undefined') ? rayLambda0 : 580;
    return { amber, trail: d(amber, [150, 200, 255]), guide: d(amber, [150, 220, 255]),
      nearestRay: best, defLambda: lam, defRay: wavelengthColor(lam),
      defRayDist: d(amber, hex2rgb(wavelengthColor(lam))) };
  });
  const c = out.color;
  console.error(`  琥珀 rgba(${c.amber.join(',')}) — 軌跡(氷青)まで ${c.trail.toFixed(1)}・格子まで ${c.guide.toFixed(1)}`);
  console.error(`  光線: 既定 λ₀=${c.defLambda}nm(${c.defRay})まで ${c.defRayDist.toFixed(1)}・` +
    `最も近い波長 ${c.nearestRay.nm}nm(${c.nearestRay.c.join(',')})まで ${c.nearestRay.d.toFixed(1)}`);
}

// ================================================================ MIG(値域 1 形化の移行表)
if (want('mig')) {
  console.error('[w256c] MIG: 旧セーブ 3 形 → 正準形 {mode} の移行表(捨てた宣言を数える)');
  out.mig = await pg.evaluate(() => {
    const body = [{ type: 'single', m: 1, radius: 1, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: false }];
    const mk = (ov) => ({ name: 'x', description: 'd', emoji: '🕸', bodies: body,
      camera: { scale: 100 }, world: { boundary: 'none', size: 0 }, overlays: ov });
    const norm = (ov) => { const v = HP.validatePreset(mk(ov));
      return v.ok ? JSON.stringify(v.preset.overlays.spaceMesh === undefined ? null : v.preset.overlays.spaceMesh) : 'INVALID'; };
    const cases = [
      ['(未宣言)', {}],
      ['spaceMesh:true(第253便a)', { spaceMesh: true }],
      ['spaceMesh:false', { spaceMesh: false }],
      ['true+spaceMeshMode:"guide"(第254便a)', { spaceMesh: true, spaceMeshMode: 'guide' }],
      ['true+spaceMeshMode:"transport"(第254便a)', { spaceMesh: true, spaceMeshMode: 'transport' }],
      ['true+spaceMeshMode:"lines"(第255便c)', { spaceMesh: true, spaceMeshMode: 'lines' }],
      ['spaceMeshMode 単独(第255便c)', { spaceMeshMode: 'guide' }],
      ['{mode:"tracer"}(第254便b)', { spaceMesh: { mode: 'tracer' } }],
      ['{mode:"lines"}(第256便c 正準)', { spaceMesh: { mode: 'lines' } }],
      ['false+spaceMeshMode(明示 OFF)', { spaceMesh: false, spaceMeshMode: 'guide' }],
      ['{mode:"rays"}(不正)', { spaceMesh: { mode: 'rays' } }],
      ['spaceMeshMode:""(不正)', { spaceMesh: true, spaceMeshMode: '' }],
    ];
    const o = { table: cases.map(([label, ov]) => ({ label, from: JSON.stringify(ov), to: norm(ov) })) };
    // 正規化後に spaceMeshMode 鍵が残っていないこと(1 形)
    const v = HP.validatePreset(mk({ spaceMesh: true, spaceMeshMode: 'guide' }));
    o.noLegacyKey = v.preset.overlays.spaceMeshMode === undefined;
    o.keys = Object.keys(v.preset.overlays).join(',');
    // 宣言を落とした(ON のはずが OFF になった)件数
    o.dropped = o.table.filter((r) => /spaceMesh:true|mode:"lines"|mode:"tracer"|spaceMeshMode:"|spaceMeshMode 単独/.test(r.label)
      && !/不正|明示 OFF/.test(r.label) && r.to === 'null').length;
    return o;
  });
  for (const r of out.mig.table) console.error(`  ${r.label}: ${r.from} → ${r.to}`);
  console.error(`  旧鍵の残り: ${out.mig.noLegacyKey ? 'なし(1 形)' : 'あり'} / 捨てた宣言 ${out.mig.dropped} 件`);
}

// ================================================================ BIT(全内蔵プリセット × 600 步 + 検証後 JSON)
if (want('bit') && fs.existsSync(BASE)) {
  console.error('[w256c] BIT: 全内蔵プリセット × 600 步(dt=0.016)+ 検証後 JSON を基点と突き合わせる');
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
      cur: (cur.sig[id].match(/"spaceMesh"[^,}]*(\}|)/) || [''])[0] })) };
  console.error(`  状態: 現行 ${ids.length} 本 / 基点 ${baseIds.length} 本 — 差=${diffs.length ? diffs.join(',') : 'なし'}`);
  console.error(`  署名: 差=${sigDiffs.length ? sigDiffs.join(',') : 'なし'}`);
  for (const d of out.bit.sigDiffDetail) console.error(`    ${d.id}: ${d.base} → ${d.cur}`);
} else if (want('bit')) {
  console.error(`[w256c] BIT: 基点 html が無いので省略(${BASE})`);
}

out.pageErrors = pageErrors;
await browser.close();
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.error(`[w256c] 出力: ${OUT}${pageErrors.length ? ' / pageErrors=' + pageErrors.length : ''}`);
