// 第275便c(第65報 (3)「粒子同士は総当たりで重力計算、**座標変換が重なっても総当たり回数は同じはず**
// → なぜ重いか分析して改善する」): **総当たり回数・巡回数・一時配列・表示を分けて実測**し、
// **準備済み経路**(`dfmGeoScalarPrepared`)の前後を **同じページの中で** 測る器である。
//
// ■ ① 数(回数): **Math.sqrt / Math.pow / Math.hypot / Array.prototype.push を差し替えて数える**。
//   予想ではなく**エンジンが実際に呼んだ回数**である(計数の巡は当然遅くなるので時間は測らない)。
//   `_core` だけの走行(geoPN=0)を引いて**トイの分**を出す。
//   ・「総当たり回数は同じはず」の検算: frameWeight を share/pull/pull3/pull4 に振り、
//     さらに帯平均 variant も並べて **(行,源) の累算回数**が動かないことを数で示す。
//     **座標変換の宣言は対の数を 1 対も増やしていない。** 増えているのは**巡回数**(重力 2+局所場 1 の
//     読みを、第274便c で重力 1+局所場 1 に落としてある)と、**順序対ごとに払う sqrt / pow** である。
// ■ ② 時間: **同じページ・同じ初期条件**(セルごとに rebuild)で
//   `HP.setGeoPrepEnabled(true/false)` を切り替えて ms/步 を交互に測る。
//   5 worktree が同時に Chromium を回す箱では**絶対値が巡ごとに数割動く**ので、**比だけ**を読む。
// ■ ③ node: `tests/lib-w275c-prepared.mjs`(同じ 1 步の純関数の写し)で ms/步 と**指紋**を測る。
//   步をまたぐ幾何キャッシュ(指示 3)は**ここでだけ**測る —— html には入れない。
//
// **書かないこと**: 「N 倍速い」「モバイルで 60fps」。本器は数と時間を出すだけで、合否も速さの主張も出さない。
//
// 使い方:
//   PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright \
//   node tests/exp-w275c-galaxyprof2.mjs [html]            (既定 beta/index.html)
// 出力: tests/out/galaxyprof2-w275c.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { pairCounts, drive, cloneState, LIB_VERSION } from './lib-w275c-prepared.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.argv[2] || 'beta/index.html';
const OUT = process.env.W275C_OUT || path.join(ROOT, 'tests', 'out', 'galaxyprof2-w275c.json');
const WARM = Number(process.env.W275C_WARM || 30);
const ROUNDS = Number(process.env.W275C_ROUNDS || 7);
const REPS = Number(process.env.W275C_REPS || 20);
const NODE_STEPS = Number(process.env.W275C_NODE_STEPS || 60);

const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let browser;
try { browser = await req('playwright').chromium.launch(); }
catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }

const med = (a) => { const b = a.slice().sort((x, y) => x - y); const k = b.length >> 1;
  return b.length % 2 ? b[k] : (b[k - 1] + b[k]) / 2; };

function installer() {
  return () => {
    const S = HP.sim;
    const mk = (id, patch) => {
      const P = HP.allPresets().find((z) => z.id === id);
      if (!P) return null;
      const q = JSON.parse(JSON.stringify(P));
      if (patch) Object.assign(q.physics, patch);
      const v = HP.validatePreset(q);
      if (!v.ok) return { err: (v.errors || []).join('|') };
      return v.preset;
    };
    const build = (id, patch) => { const pr = mk(id, patch);
      if (!pr || pr.err) return null; S.build(pr); return pr; };
    // ---- ① 計数(Math と Array.prototype.push を差し替えて 1 步を走らせる)
    const count = (id, patch, prepOn) => {
      const pr = mk(id, patch);
      if (!pr || pr.err) return { err: pr ? pr.err : 'missing' };
      HP.setGeoPrepEnabled(prepOn !== false);
      S.build(pr);
      for (let k = 0; k < 3; k++) S.step(0.016);             // 暖機(数は步に依らないが状態を揃える)
      const M = Math, oS = M.sqrt, oP = M.pow, oH = M.hypot, oE = M.exp;
      const AP = Array.prototype, oPush = AP.push;
      let cS = 0, cP = 0, cH = 0, cE = 0, cPu = 0;
      M.sqrt = function (z) { cS++; return oS(z); };
      M.pow = function (z, w) { cP++; return oP(z, w); };
      M.hypot = function () { cH++; return oH.apply(M, arguments); };
      M.exp = function (z) { cE++; return oE(z); };
      AP.push = function () { cPu += arguments.length; return oPush.apply(this, arguments); };
      let err = null;
      try { S.step(0.016); } catch (e) { err = String(e && e.message || e); }
      M.sqrt = oS; M.pow = oP; M.hypot = oH; M.exp = oE; AP.push = oPush;
      HP.setGeoPrepEnabled(true);
      let nPin = 0; for (let i = 0; i < S.n; i++) if (S.pinned[i]) nPin++;
      return { sqrt: cS, pow: cP, hypot: cH, exp: cE, push: cPu, err,
        n: S.n, nPin: nPin, prepared: S.geoToyPrepared === true, stop: S.geoToyStop,
        geoPN: S.params.geoPN,
        frameWeight: (S.params.frameWeight === undefined) ? null : S.params.frameWeight,
        pw: HP.frameWeightPow(S.params),
        diskSupport: ((S.params.spaceMesh || {}).diskSupport === undefined)
          ? null : S.params.spaceMesh.diskSupport };
    };
    // ---- ② 時間(セルごとに rebuild して同じ初期条件から測る)
    const time = (id, cell, k) => {
      const patch = (cell === 'core') ? { geoPN: 0 } : null;
      const pr = mk(id, patch);
      if (!pr || pr.err) return null;
      HP.setGeoPrepEnabled(cell !== 'legacy');
      S.build(pr);
      if (cell === 'grid') { HP.spaceGridInvalidate(S); }
      const t0 = performance.now();
      if (cell === 'render') { for (let i = 0; i < k; i++) render(); }
      else if (cell === 'grid') { for (let i = 0; i < k; i++) { HP.spaceGridInvalidate(S); HP.spaceGridEnsure(S); } }
      else { for (let i = 0; i < k; i++) S.step(0.016); }
      const ms = performance.now() - t0;
      HP.setGeoPrepEnabled(true);
      return ms;
    };
    // ---- ③ node へ渡す状態(t=0 の 🪁 / 🎋)
    const dump = (id) => {
      const pr = mk(id, null); if (!pr || pr.err) return null;
      S.build(pr);
      const p = S.params, cf = p.spaceMesh || {};
      let nPin = 0; for (let i = 0; i < S.n; i++) if (S.pinned[i]) nPin++;
      return { n: S.n, x: Array.from(S.x.slice(0, S.n)), y: Array.from(S.y.slice(0, S.n)),
        vx: Array.from(S.vx.slice(0, S.n)), vy: Array.from(S.vy.slice(0, S.n)),
        m: Array.from(S.m.slice(0, S.n)),
        pin: Array.from({ length: S.n }, (_, i) => (S.pinned[i] ? 1 : 0)),
        eps: p.softening, pw: HP.frameWeightPow(p), G: p.G,
        D0: HP.frameWeightIsPull(p) ? ((p.D0pull !== undefined) ? p.D0pull : p.D0) : p.D0,
        eta: (cf.toyGain === undefined) ? 1 : cf.toyGain, dt: 0.016, nPin, lawVersion: cf.lawVersion };
    };
    window.W275C = { count, time, dump, build,
      info: { ids: HP.allPresets().map((z) => z.id).filter((z) => /GeoToy/.test(z)),
        prep: HP.geoPrepInfo() } };
    return window.W275C.info;
  };
}

const page = await browser.newPage();
const errs = [];
page.on('pageerror', (e) => errs.push(String(e.message || e)));
await page.goto('file://' + path.join(ROOT, TARGET), { waitUntil: 'load' });
await page.waitForFunction(() => window.HP && HP.sim && HP.currentPreset());
const info = await page.evaluate(`(${installer().toString()})()`);

// ---- ① 計数
const COUNT_CASES = [
  ['galaxyMeshSpiralGeoToy', null, true, '🪁 準備済み'],
  ['galaxyMeshSpiralGeoToy', null, false, '🪁 旧経路'],
  ['galaxyMeshSpiralGeoToy', { geoPN: 0 }, true, '🪁 _core だけ(geoPN=0)'],
  ['galaxyMeshSpiralGeoToyLite', null, true, '🎋 準備済み'],
  ['galaxyMeshSpiralGeoToyLite', null, false, '🎋 旧経路'],
  ['galaxyMeshSpiralGeoToyLite', { geoPN: 0 }, true, '🎋 _core だけ(geoPN=0)'],
  ['galaxyMeshSpiralGeoToy', { frameWeight: 'share' }, false, '🪁 frameWeight:share(旧経路)'],
  ['galaxyMeshSpiralGeoToy', { frameWeight: 'pull' }, false, '🪁 frameWeight:pull(旧経路)'],
  ['galaxyMeshSpiralGeoToy', { frameWeight: 'pull3' }, false, '🪁 frameWeight:pull3(旧経路)'],
  ['galaxyMeshSpiralGeoToy', { frameWeight: 'pull4' }, false, '🪁 frameWeight:pull4(旧経路)'],
  ['galaxyMeshSpiralGeoToy', { frameWeight: 'share' }, true, '🪁 frameWeight:share(準備済み)'],
  ['galaxyMeshSpiralGeoToy', { frameWeight: 'pull4' }, true, '🪁 frameWeight:pull4(準備済み)'],
  ['galaxyMeshSpiralGeoToy',
    { spaceMesh: { mode: 'vertex', gravity: false, inertia: false, lawVersion: 'scalar',
      diskSupport: 'band-pressure', bandCount: 16, pairCut: 20 } }, true, '🪁 帯平均 variant'],
];
const counts = [];
for (const [id, patch, prep, label] of COUNT_CASES) {
  const r = await page.evaluate(([a, b, c]) => W275C.count(a, b, c), [id, patch, prep]);
  counts.push(Object.assign({ label, id, patch, prepRequested: prep }, r));
}

// ---- ② 時間(巡ごと・セルごとに交互)
const TIME_CELLS = ['prepared', 'legacy', 'core', 'render', 'grid'];
const TIME_IDS = ['galaxyMeshSpiralGeoToy', 'galaxyMeshSpiralGeoToyLite'];
const raw = {};
for (const id of TIME_IDS) { raw[id] = {}; for (const c of TIME_CELLS) raw[id][c] = []; }
for (const id of TIME_IDS) for (const c of TIME_CELLS) {
  await page.evaluate(([a, b, k]) => W275C.time(a, b, k), [id, c, WARM]);
}
for (let r = 0; r < ROUNDS; r++) {
  for (const c of TIME_CELLS) for (const id of TIME_IDS) {
    const ms = await page.evaluate(([a, b, k]) => W275C.time(a, b, k), [id, c, REPS]);
    raw[id][c].push(ms === null ? null : ms / REPS);
  }
}
const timing = {};
for (const id of TIME_IDS) {
  const cell = {};
  for (const c of TIME_CELLS) { const v = raw[id][c].filter((z) => z !== null);
    cell[c] = v.length ? { medianMs: med(v), minMs: Math.min(...v), maxMs: Math.max(...v),
      spreadRel: med(v) > 0 ? (Math.max(...v) - Math.min(...v)) / med(v) : null } : null; }
  const g = (k) => (cell[k] ? cell[k].medianMs : null);
  timing[id] = { cell, rounds: raw[id],
    ratioPreparedOverLegacy: (g('legacy') > 0) ? g('prepared') / g('legacy') : null,
    toyPrepared: (g('prepared') !== null && g('core') !== null) ? g('prepared') - g('core') : null,
    toyLegacy: (g('legacy') !== null && g('core') !== null) ? g('legacy') - g('core') : null };
  timing[id].ratioToy = (timing[id].toyLegacy > 0)
    ? timing[id].toyPrepared / timing[id].toyLegacy : null;
}

// ---- ③ node(同じ 1 步の純関数の写し)
const dumps = {};
for (const id of TIME_IDS) dumps[id] = await page.evaluate((a) => W275C.dump(a), id);
await browser.close();

const toSt = (d) => ({ n: d.n, x: Float64Array.from(d.x), y: Float64Array.from(d.y),
  vx: Float64Array.from(d.vx), vy: Float64Array.from(d.vy), m: Float64Array.from(d.m),
  pin: Uint8Array.from(d.pin), eps: d.eps, pw: d.pw, G: d.G, D0: d.D0, eta: d.eta, dt: d.dt });
const nodeRows = {};
for (const id of TIME_IDS) {
  const d = dumps[id]; if (!d) { nodeRows[id] = null; continue; }
  const base = toSt(d);
  const runOne = (mode, reuseEvery) => {
    const St = cloneState(base);
    drive(cloneState(base), 5, mode, reuseEvery);                       // 暖機
    const t0 = process.hrtime.bigint();
    const r = drive(St, NODE_STEPS, mode, reuseEvery);
    const ms = Number(process.hrtime.bigint() - t0) / 1e6 / NODE_STEPS;
    return { msPerStep: ms, fp: r.fp, nOn: r.nOn, chiMax: r.chiMax };
  };
  const legacy = runOne('legacy', 0);
  const prepared = runOne('prepared', 0);
  const rep = [];
  for (let k = 0; k < 3; k++) rep.push({ legacy: runOne('legacy', 0).msPerStep,
    prepared: runOne('prepared', 0).msPerStep });
  // 步をまたぐ幾何キャッシュ(**html には入れない** —— ビット同一が崩れることを数で残す)
  const cached2 = runOne('cached', 2), cached4 = runOne('cached', 4);
  nodeRows[id] = { n: d.n, nPin: d.nPin, lawVersion: d.lawVersion, steps: NODE_STEPS,
    legacy, prepared, repeats: rep,
    bitSameNode: legacy.fp === prepared.fp,
    ratioPreparedOverLegacy: legacy.msPerStep > 0 ? prepared.msPerStep / legacy.msPerStep : null,
    ratioMedian: med(rep.map((z) => z.prepared / z.legacy)),
    crossStepCache: {
      reuseEvery2: { msPerStep: cached2.msPerStep, fp: cached2.fp, bitSame: cached2.fp === prepared.fp,
        ratio: prepared.msPerStep > 0 ? cached2.msPerStep / prepared.msPerStep : null },
      reuseEvery4: { msPerStep: cached4.msPerStep, fp: cached4.fp, bitSame: cached4.fp === prepared.fp,
        ratio: prepared.msPerStep > 0 ? cached4.msPerStep / prepared.msPerStep : null },
      verdict: '**採らない** —— 位置は毎步動くので、步をまたいで幾何を使い回すとビット同一が崩れる'
        + '(fp が変わる)。速くなってもこの枝の契約(既定経路 1 bit 不変)を満たさない。',
    },
    pairCounts: pairCounts(d.n, d.nPin) };
}

// ---- 会計(数の読み口)
const byLabel = Object.fromEntries(counts.map((c) => [c.label, c]));
const toySub = (a, b) => (byLabel[a] && byLabel[b] && !byLabel[a].err && !byLabel[b].err)
  ? { sqrt: byLabel[a].sqrt - byLabel[b].sqrt, pow: byLabel[a].pow - byLabel[b].pow,
      push: byLabel[a].push - byLabel[b].push, hypot: byLabel[a].hypot - byLabel[b].hypot } : null;
const ledger = {
  kite: { prepared: toySub('🪁 準備済み', '🪁 _core だけ(geoPN=0)'),
    legacy: toySub('🪁 旧経路', '🪁 _core だけ(geoPN=0)'),
    predicted: pairCounts(byLabel['🪁 旧経路'].n, byLabel['🪁 旧経路'].nPin) },
  lite: { prepared: toySub('🎋 準備済み', '🎋 _core だけ(geoPN=0)'),
    legacy: toySub('🎋 旧経路', '🎋 _core だけ(geoPN=0)'),
    predicted: pairCounts(byLabel['🎋 旧経路'].n, byLabel['🎋 旧経路'].nPin) },
};

const out = {
  meta: Object.assign({
    wave: '第275便c', target: TARGET, libVersion: LIB_VERSION,
    warm: WARM, rounds: ROUNDS, reps: REPS, nodeSteps: NODE_STEPS,
    doNotWrite: '**「N 倍速い」「モバイルで 60fps」とは書かない。** 本器は回数と時間を出すだけで、'
      + '合否も速さの主張も出さない。**V8 の最適化状態(JIT)と機械の混みぐあいに依存する**ので、'
      + '同じページでも巡ごとに数割動く(spreadRel 欄)。比は**同じ走行で交互に測った 2 セル**でだけ読む。',
    countingNote: '計数の巡は Math.sqrt/pow/hypot/exp と Array.prototype.push を差し替えて数えている'
      + '(**時間は測らない** —— 差し替えた巡は当然遅い)。トイの分は geoPN=0 の走行を引いて出す。',
  }, provenanceMeta({ root: ROOT, wave: '第275便c', target: TARGET,
    code: ['tests/exp-w275c-galaxyprof2.mjs', 'tests/lib-w275c-prepared.mjs',
      'tests/lib-w272e-provenance.mjs'],
    inputs: [TARGET] })),
  prepInfo: info.prep,
  counts, ledger, timing, node: nodeRows,
  pageErrors: errs.slice(0, 3),
};
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
const brief = {
  counts: counts.map((c) => ({ label: c.label, sqrt: c.sqrt, pow: c.pow, push: c.push,
    prepared: c.prepared, pw: c.pw, n: c.n, err: c.err })),
  ledger, timing: Object.fromEntries(Object.entries(timing).map(([k, v]) => [k,
    { cell: Object.fromEntries(Object.entries(v.cell).map(([a, b]) => [a, b ? +b.medianMs.toFixed(3) : null])),
      spread: Object.fromEntries(Object.entries(v.cell).map(([a, b]) => [a, b && b.spreadRel !== null ? +b.spreadRel.toFixed(2) : null])),
      ratioPreparedOverLegacy: v.ratioPreparedOverLegacy === null ? null : +v.ratioPreparedOverLegacy.toFixed(3),
      ratioToy: v.ratioToy === null ? null : +v.ratioToy.toFixed(3) }])),
  node: Object.fromEntries(Object.entries(nodeRows).map(([k, v]) => [k, v ? {
    legacyMs: +v.legacy.msPerStep.toFixed(4), preparedMs: +v.prepared.msPerStep.toFixed(4),
    ratio: +v.ratioPreparedOverLegacy.toFixed(3), ratioMedian: +v.ratioMedian.toFixed(3),
    bitSameNode: v.bitSameNode, cache2: v.crossStepCache.reuseEvery2.bitSame,
    cache4: v.crossStepCache.reuseEvery4.bitSame,
    pairs: v.pairCounts } : null])),
  pageErrors: errs.slice(0, 3),
};
console.log(JSON.stringify(brief, null, 1));
console.log('→ ' + path.relative(ROOT, OUT));
