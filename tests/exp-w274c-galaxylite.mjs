// 第274便c(第64報): **🪁 既定 / 🎋 軽量コピー / 帯平均 variant** の 3 者を**同じ器・同じ抽出器**で
// 比べる実測器である(第265便b の表と同じ量: 保持率・V_rms・v_φ(r)・σ_R、加えて ms/步)。
//
// ■ 測る量の宣言(第265便b と同じ定義 —— 窓を揃えないと比べられない)
//   円盤 … **指数円盤の粒子だけ**(🪁 は index 91〜350 の 260 粒・🎋 は index 91〜170 の 80 粒。
//           中心核 1 粒と Plummer バルジ 90 粒は外す)。中心 … pinned 核(原点)。
//   R_ref … **その走行の** t=0 の円盤粒子の最大半径。帯は R_ref×{0.1,0.25,0.5,0.75,1.0}・幅 ±12.5%。
//   保持率 … r ≤ R_ref の円盤粒子の割合。V_rms … 同じ円盤粒子の速度の二乗平均平方根。
//   **母集団が違うので 🪁 と 🎋 の数は一致しない**(窓は同じでも粒子が違う)。
//
// ■ 帯平均 variant(第274便c)
//   `physics.spaceMesh.diskSupport:"band-pressure"` を**診断コピーで**宣言して走らせる
//   (**内蔵プリセットの physics は 1 文字も変えない**)。kRepEff=0 の「帯の運動だけ」と、
//   kRepEff>0 の「有効圧つき」を別の行にする。
//
// ■ 言わないこと
//   「銀河が安定した」「軽い方が正しい」「N 倍速い」—— 本器は数を出すだけである。
//   観測回転曲線は 1 つも入力していない(較正ではない)。
//
// 使い方:
//   PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright \
//   node tests/exp-w274c-galaxylite.mjs
// 出力: tests/out/galaxylite-w274c.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { provenanceMeta } from './lib-w272e-provenance.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const OUT = process.env.W274C_OUT || path.join(ROOT, 'tests', 'out', 'galaxylite-w274c.json');
const T_END = Number(process.env.W274C_T || 48);
const DT = Number(process.env.W274C_DT || 0.016);
const PERF_WARM = Number(process.env.W274C_WARM || 40);
const PERF_ROUNDS = Number(process.env.W274C_ROUNDS || 7);
const PERF_REPS = Number(process.env.W274C_REPS || 30);

const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let browser;
try { browser = await req('playwright').chromium.launch(); }
catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }
const page = await browser.newPage();
const pageErrors = [];
page.on('pageerror', (e) => pageErrors.push(String(e.message || e)));
await page.goto('file://' + path.join(ROOT, TARGET), { waitUntil: 'load' });
await page.waitForFunction(() => window.HP && HP.sim && HP.currentPreset());

const med = (a) => { const b = a.slice().sort((x, y) => x - y); const k = b.length >> 1;
  return b.length % 2 ? b[k] : (b[k - 1] + b[k]) / 2; };

// ---- ページ内の共通測定器(第265便b の diskStats と同じ定義)
await page.evaluate(() => {
  window.W274 = {};
  W274.diskStats = (S, o) => {
    const bands = [0.1, 0.25, 0.5, 0.75, 1.0];
    const acc = bands.map(() => ({ n: 0, sv: 0, sr: 0, sr2: 0 }));
    let nIn = 0, nTot = 0, sv2 = 0;
    for (let i = o.from; i < o.to; i++) {
      const dx = S.x[i], dy = S.y[i], r = Math.hypot(dx, dy);
      const vx = S.vx[i], vy = S.vy[i];
      nTot++; if (r <= o.Rref) nIn++;
      sv2 += vx * vx + vy * vy;
      if (!(r > 0)) continue;
      const vr = (vx * dx + vy * dy) / r, vt = (-vx * dy + vy * dx) / r;
      for (let b = 0; b < bands.length; b++) { const rb = bands[b] * o.Rref;
        if (Math.abs(r - rb) <= 0.125 * rb) { const a = acc[b]; a.n++; a.sv += vt; a.sr += vr; a.sr2 += vr * vr; } }
    }
    return { retention: nTot ? nIn / nTot : null, vrms: Math.sqrt(sv2 / Math.max(1, nTot)), nDisc: nTot,
      bands: acc.map((a, b) => ({ rOverRref: bands[b], n: a.n, vphi: a.n ? a.sv / a.n : null,
        sigmaR: a.n > 1 ? Math.sqrt(Math.max(0, a.sr2 / a.n - (a.sr / a.n) * (a.sr / a.n))) : null })) };
  };
  // **内蔵プリセットの physics は 1 文字も変えない**(診断コピーの上で宣言を足す)
  W274.pre = (id, sm) => {
    const q = JSON.parse(JSON.stringify(HP.allPresets().find((z) => z.id === id)));
    if (sm) q.physics[HP.SPACE_MESH_KEY] = Object.assign({}, q.physics[HP.SPACE_MESH_KEY] || {}, sm);
    const v = HP.validatePreset(q);
    if (!v.ok) return { err: (v.errors || []).join('|') };
    return { pre: v.preset, warn: (v.warnings || []).length,
      sig: JSON.stringify(v.preset.physics[HP.SPACE_MESH_KEY] || null) };
  };
  W274.run = (id, sm, T, dt) => {
    const b = W274.pre(id, sm);
    if (b.err) return { err: b.err };
    const S = HP.sim; S.build(b.pre);
    // 円盤の添字: 核 1 + バルジ 90 の後ろが指数円盤である
    const from = 91, to = S.n;
    let Rref = 0;
    for (let i = from; i < to; i++) Rref = Math.max(Rref, Math.hypot(S.x[i], S.y[i]));
    const o = { from, to, Rref };
    const at0 = W274.diskStats(S, o);
    const n = Math.round(T / dt);
    const stops = {}; let stopN = 0;
    for (let k = 0; k < n; k++) { S.step(dt);
      if (S.geoToyStop) { stopN++; stops[S.geoToyStop] = (stops[S.geoToyStop] || 0) + 1; } }
    const at1 = W274.diskStats(S, o);
    return { n: S.n, nDisc: to - from, Rref, T, dt, steps: n, at0, at1, stopN, stops,
      geoPN: S.params.geoPN, chi: S.geoToyChi, nan: S.hasNaN(), warn: b.warn, sig: b.sig,
      ledgerE: Math.abs(S.geoToyE + S.geoToyEmesh),
      ledgerP: Math.hypot(S.geoToyPx + S.geoToyMeshPx, S.geoToyPy + S.geoToyMeshPy),
      bathE: S.geoToyBathE === undefined ? null : S.geoToyBathE,
      bathP: S.geoToyBathPx === undefined ? null : [S.geoToyBathPx, S.geoToyBathPy],
      bands: S.geoToyBands ? { B: S.geoToyBands.B, cut: S.geoToyBands.cut,
        backwardDifference: S.geoToyBands.backwardDifference,
        chiMax: Math.max.apply(null, S.geoToyBands.chi),
        omega: S.geoToyBands.omega.map((z) => +z.toFixed(8)) } : null };
  };
  // 速度は**同じページで交互に**測る(build はタイマの外)
  W274.perfPrep = (rows) => { W274._rows = rows.map((r) => W274.pre(r.id, r.sm)); };
  W274.perf = (k, j) => { const b = W274._rows[j]; if (b.err) return -1;
    const S = HP.sim; S.build(b.pre);
    const t0 = performance.now(); for (let i = 0; i < k; i++) S.step(0.016);
    return performance.now() - t0; };
});

const BAND = { diskSupport: 'band-pressure', bandCount: 16, pairCut: 20 };
const BANDP = { diskSupport: 'band-pressure', bandCount: 16, pairCut: 20, kRepEff: 0.5, bandLength: 10 };
const BANDW = { diskSupport: 'band-pressure', bandCount: 16, pairCut: 20, kRepEff: 0.01, bandLength: 10 };
const ROWS = [
  { key: '🪁 既定(円盤 260)', id: 'galaxyMeshSpiralGeoToy', sm: null },
  { key: '🎋 Lite(円盤 80)', id: 'galaxyMeshSpiralGeoToyLite', sm: null },
  { key: '🪁 + band-pressure(kRepEff=0)', id: 'galaxyMeshSpiralGeoToy', sm: BAND },
  { key: '🪁 + band-pressure(kRepEff=0.5・ℓ*=10)', id: 'galaxyMeshSpiralGeoToy', sm: BANDP },
  { key: '🪁 + band-pressure(kRepEff=0.01・ℓ*=10)', id: 'galaxyMeshSpiralGeoToy', sm: BANDW },
  { key: '🎋 + band-pressure(kRepEff=0)', id: 'galaxyMeshSpiralGeoToyLite', sm: BAND },
];

// ---- ① 3000 步(T=48)の走行
const runs = {};
for (const r of ROWS) {
  runs[r.key] = await page.evaluate(([id, sm, T, dt]) => W274.run(id, sm, T, dt), [r.id, r.sm, T_END, DT]);
}
// ---- ② ms/步(暖機 → 巡ごとに行を交互に)
await page.evaluate((rows) => W274.perfPrep(rows), ROWS.map((r) => ({ id: r.id, sm: r.sm })));
for (let j = 0; j < ROWS.length; j++) await page.evaluate(([k, j2]) => W274.perf(k, j2), [PERF_WARM, j]);
const perfRounds = [];
for (let q = 0; q < PERF_ROUNDS; q++) {
  const row = [];
  for (let j = 0; j < ROWS.length; j++) {
    row.push((await page.evaluate(([k, j2]) => W274.perf(k, j2), [PERF_REPS, j])) / PERF_REPS);
  }
  perfRounds.push(row);
}
await browser.close();

const perf = {};
ROWS.forEach((r, j) => { const v = perfRounds.map((q) => q[j]);
  perf[r.key] = { msPerStepMedian: med(v), min: Math.min(...v), max: Math.max(...v) }; });

const table = ROWS.map((r) => { const z = runs[r.key];
  return { row: r.key, id: r.id, declared: r.sm, n: z.n, nDisc: z.nDisc,
    Rref: z.Rref, retention0: z.at0.retention, retention: z.at1.retention,
    vrms0: z.at0.vrms, vrms: z.at1.vrms,
    vphi: z.at1.bands.map((b) => b.vphi), sigmaR: z.at1.bands.map((b) => b.sigmaR),
    nan: z.nan, ledgerE: z.ledgerE, ledgerP: z.ledgerP, bathE: z.bathE, bathP: z.bathP,
    stopN: z.stopN, stops: z.stops, bands: z.bands, warn: z.warn, spaceMeshSig: z.sig,
    msPerStep: perf[r.key].msPerStepMedian, msMin: perf[r.key].min, msMax: perf[r.key].max };
});

const out = {
  meta: Object.assign({ wave: '第274便c', target: TARGET, T: T_END, dt: DT,
    perf: { warm: PERF_WARM, rounds: PERF_ROUNDS, reps: PERF_REPS, interleaved: true },
    doNotWrite: '**銀河は較正していない**(観測回転曲線は 1 つも入力していない)。'
      + '**「軽い方が正しい」「N 倍速い」「銀河が安定した」とは書かない。** ms/步 は '
      + 'V8 の最適化状態と機械の混みぐあいに依存する(min/max を併記する)。',
    windowNote: '円盤 = index 91 以降(核 1 + バルジ 90 を外す)。R_ref は**その走行の** t=0 の最大半径。'
      + '**母集団が違うので 🪁 と 🎋 の数は一致しない。**' },
    provenanceMeta({ root: ROOT, wave: '第274便c', target: TARGET,
      code: ['tests/exp-w274c-galaxylite.mjs', 'tests/lib-w272e-provenance.mjs'], inputs: [TARGET] })),
  table, perfRounds, pageErrors: pageErrors.slice(0, 3),
};
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log(JSON.stringify(table.map((t) => ({ row: t.row, n: t.n, nDisc: t.nDisc,
  retention: t.retention, vrms: +Number(t.vrms).toFixed(6), nan: t.nan, ledgerE: t.ledgerE,
  bathE: t.bathE, stopN: t.stopN, stops: t.stops,
  ms: +Number(t.msPerStep).toFixed(3) })), null, 1));
console.log('→ ' + path.relative(ROOT, OUT));
