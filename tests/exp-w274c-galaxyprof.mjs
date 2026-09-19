// 第274便c(第64報「galaxyMeshSpiralGeoToy が重い理由を調査し改善する」): **🪁 の 1 步の負荷分解**を
// 実ブラウザ(Chromium)で測る器である。
//
// ■ 何を測るか(統括の読み R23 を数で確かめる)
//   `dfmGeoToyStep`(351 体 = 核 1 pinned・バルジ 90・円盤 260)は 1 步のうちに
//     ① 自由粒子ごとに `dfmField(BD,…,need:"gravity")`(第 1 巡 = 源の加速度集め)
//     ② `onePass` で再び `dfmField(BD,…,lawVersion)`(need 既定 "all" = **重力をもう一度集計**+局所場)
//   を呼ぶ。**重力の O(N²) 集計が 1 步に 2 回**入っている、というのが統括の読みである。
//   本器はそれを **ms/步** で切り分ける(割合は stepTotal に対する比)。
//
// ■ セル(すべて同じページ・同じ 🪁 の状態から測る)
//   stepTotal      … `S.step(0.016)` 1 回(🪁 既定 = geoPN=3 のトイ)
//   stepCoreNoToy  … 同じ初期条件で `physics.geoPN=0`(= `S._core` だけ・トイに入らない)の `S.step`
//                    ※ `geoCoreDispatch` は geoPN≥3 のとき `p.geoPN=0` で `_core` を呼ぶので、
//                      これが 🪁 の `_core` が実際に払っている重力 O(N²) の費用である。
//   bdBuild        … BD 配列(351 個のオブジェクトリテラル)を 1 本作る費用
//   pass1Gravity   … 自由粒子ごとの `dfmField(…,need:"gravity")` を n 回(= 第 1 巡)
//   onePassAll     … 自由粒子ごとの `dfmField(…)`(need 既定 "all" = 第 2 巡・**重力を再集計する**)
//   onePassMesh    … 同じ呼びを `need:"mesh"` で(第274便c の案 (b)。"mesh" が無い世代は 0)
//   srcArraysOnly  … `dfmField` が 1 呼びごとに作る源配列 src と id 配列だけの費用(場は回さない)
//   localOnly      … `dfmLocalMeshField` を n 回(源配列は呼びごとに作る = 実際の経路と同じ)
//   localPrebuilt  … 同上だが**源配列を作り直さない**(内側ループだけの下限)
//   renderFrame    … `render()` 1 回(表示 = 蓄積格子ほか)
//   派生: toyStep = stepTotal − stepCoreNoToy
//
// ■ 測り方(JIT 依存と機械の混みぐあいを隠さない)
//   ・暖機 `W274C_WARM`(既定 40)回 → `W274C_ROUNDS`(既定 7)巡 × `W274C_REPS`(既定 30)回。
//   ・**複数の html を渡したときは、巡ごと・セルごとに html を交互に**測る(同じ 1 つの
//     Chromium の中でページを並べて持ち、A→B→A→B の順で同じセルを回す)。5 worktree が
//     同時に Chromium を回す箱では**絶対値が巡ごとに数割動く**ので、交互にしないと比が意味を持たない。
//   ・巡ごとの ms/単位の**中央値**を採り、`spreadRel` に 7 巡の幅を残す。
//   **「N 倍速い」とは書かない** —— 本器は時間を測るだけで、合否も速さの主張も出さない。
//
// ■ 実時間あたり(別欄)
//   画面は 1 フレームに `max(1,round(SUBSTEPS×timeScale))` 步(上限 24)進める。🪁 は timeScale=3・
//   SUBSTEPS=2 なので **6 步/フレーム**である。`perFrame` 欄はその換算(ms/フレーム)である。
//
// 使い方:
//   PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright \
//   node tests/exp-w274c-galaxyprof.mjs [html ...]        (既定 beta/index.html)
// 出力: tests/out/galaxyprof-w274c.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { provenanceMeta, stampFile } from './lib-w272e-provenance.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGETS = process.argv.slice(2).length ? process.argv.slice(2) : ['beta/index.html'];
const OUT = process.env.W274C_OUT || path.join(ROOT, 'tests', 'out', 'galaxyprof-w274c.json');
const WARM = Number(process.env.W274C_WARM || 40);
const ROUNDS = Number(process.env.W274C_ROUNDS || 7);
const REPS = Number(process.env.W274C_REPS || 30);
const PRESET = process.env.W274C_PRESET || 'galaxyMeshSpiralGeoToy';

const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let browser;
try { browser = await req('playwright').chromium.launch(); }
catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }

const med = (a) => { const b = a.slice().sort((x, y) => x - y); const k = b.length >> 1;
  return b.length % 2 ? b[k] : (b[k - 1] + b[k]) / 2; };

// ページ内の計測器を 1 本だけ仕込む(セルの中身は html を跨いで同じ文字列である)
function installer() {
  return (PRESET) => {
    const P = HP.allPresets().find((z) => z.id === PRESET);
    const mk = (patch) => { const q = JSON.parse(JSON.stringify(P));
      if (patch) Object.assign(q.physics, patch);
      const v = HP.validatePreset(q);
      if (!v.ok) throw new Error('validate: ' + (v.errors || []).join('|'));
      return v.preset; };
    const toyPre = mk(null), corePre = mk({ geoPN: 0 });
    const S = HP.sim;
    let curMode = null;
    const buildToToy = () => { if (curMode !== 'toy') { S.build(toyPre); curMode = 'toy'; } };
    const buildToCore = () => { if (curMode !== 'core') { S.build(corePre); curMode = 'core'; } };
    const opt = () => { const p = S.params, pw = HP.frameWeightPow(p);
      const D0p = HP.frameWeightIsPull(p) ? ((p.D0pull !== undefined) ? p.D0pull : p.D0) : p.D0;
      return { G: p.G, eps: p.softening, pw, D0p }; };
    // **基点 html と同じ形の源配列**で測る(本器が形を変えると html 間の比較にならない)
    const mkBD = () => { const BD = []; const n = S.n;
      for (let i = 0; i < n; i++) BD.push({ id: i, m: S.m[i], x: S.x[i], y: S.y[i],
        vx: S.vx[i], vy: S.vy[i], ax: 0, ay: 0 });
      return BD; };
    const hasMesh = HP.DFM_FIELD_NEED.indexOf('mesh') >= 0;
    const runners = {
      stepTotal: (k) => { for (let i = 0; i < k; i++) S.step(0.016); },
      stepCoreNoToy: (k) => { for (let i = 0; i < k; i++) S.step(0.016); },
      bdBuild: (k) => { let s = 0; for (let i = 0; i < k; i++) s += mkBD().length; return s; },
      pass1Gravity: (k) => { const o = opt(); const BD = mkBD(); const n = S.n; let s = 0;
        for (let r = 0; r < k; r++) for (let i = 0; i < n; i++) { if (S.pinned[i]) continue;
          const f = HP.dfmField(BD, S.x[i], S.y[i], { excludeBodyId: i, need: 'gravity', G: o.G,
            eps: o.eps, p: o.pw, D0: o.D0p, background: 'static', energyContract: 'toy' });
          if (f) s += f.gravity[0]; }
        return s; },
      onePassAll: (k) => { const o = opt(); const BD = mkBD(); const n = S.n; let s = 0;
        for (let r = 0; r < k; r++) for (let i = 0; i < n; i++) { if (S.pinned[i]) continue;
          const f = HP.dfmField(BD, S.x[i], S.y[i], { excludeBodyId: i, lawVersion: 'scalar', p: o.pw,
            eps: o.eps, D0: o.D0p, G: o.G, R: null, Rdot: 0, background: 'static', energyContract: 'toy' });
          if (f) s += f.u[0]; }
        return s; },
      onePassMesh: (k) => { if (!hasMesh) return 0;
        const o = opt(); const BD = mkBD(); const n = S.n; let s = 0;
        for (let r = 0; r < k; r++) for (let i = 0; i < n; i++) { if (S.pinned[i]) continue;
          const f = HP.dfmField(BD, S.x[i], S.y[i], { excludeBodyId: i, lawVersion: 'scalar', p: o.pw,
            eps: o.eps, D0: o.D0p, G: o.G, need: 'mesh', R: null, Rdot: 0,
            background: 'static', energyContract: 'toy' });
          if (f) s += f.u[0]; }
        return s; },
      srcArraysOnly: (k) => { const n = S.n; let s = 0;
        for (let r = 0; r < k; r++) for (let i = 0; i < n; i++) { if (S.pinned[i]) continue;
          const src = [], ids = [];
          for (let j = 0; j < n; j++) { if (j === i) continue; src.push(j); ids.push(j); }
          s += src.length + ids.length; }
        return s; },
      localOnly: (k) => { const o = opt(); const BD = mkBD(); const n = S.n; let s = 0;
        for (let r = 0; r < k; r++) for (let i = 0; i < n; i++) { if (S.pinned[i]) continue;
          const src = []; for (let j = 0; j < n; j++) if (j !== i) src.push(BD[j]);
          const f = HP.dfmLocalMeshField(src, S.x[i], S.y[i], { D0: o.D0p, eps: o.eps, p: o.pw,
            support: false, R: null, Rdot: 0 });
          if (f) s += f.u[0]; }
        return s; },
      localPrebuilt: (k) => { const o = opt(); const BD = mkBD(); const n = S.n; let s = 0;
        const SRC = []; for (let i = 0; i < n; i++) { const a = [];
          for (let j = 0; j < n; j++) if (j !== i) a.push(BD[j]); SRC.push(a); }
        for (let r = 0; r < k; r++) for (let i = 0; i < n; i++) { if (S.pinned[i]) continue;
          const f = HP.dfmLocalMeshField(SRC[i], S.x[i], S.y[i], { D0: o.D0p, eps: o.eps, p: o.pw,
            support: false, R: null, Rdot: 0 });
          if (f) s += f.u[0]; }
        return s; },
      renderFrame: (k) => { for (let i = 0; i < k; i++) render(); },
    };
    buildToToy();
    window.W274C = {
      names: Object.keys(runners),
      info: { n: S.n, geoPN: S.params.geoPN, timeScale: S.params.timeScale,
        hasGeoToy: S.hasGeoToy === true, hasMeshNeed: hasMesh,
        lawVersion: (S.params.spaceMesh || {}).lawVersion,
        nPinned: (() => { let c = 0; for (let i = 0; i < S.n; i++) if (S.pinned[i]) c++; return c; })() },
      run: (name, k) => { if (name === 'stepCoreNoToy') buildToCore(); else buildToToy();
        const t0 = performance.now(); runners[name](k); return performance.now() - t0; },
    };
    return window.W274C.info;
  };
}

const pages = [];
for (const target of TARGETS) {
  const page = await browser.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e.message || e)));
  await page.goto('file://' + path.join(ROOT, target), { waitUntil: 'load' });
  await page.waitForFunction(() => window.HP && HP.sim && HP.currentPreset());
  const info = await page.evaluate(`(${installer().toString()})(${JSON.stringify(PRESET)})`);
  pages.push({ target, page, errs, info, rounds: [] });
}
const NAMES = await pages[0].page.evaluate(() => W274C.names);

// 暖機(html を交互に)
const warm = {};
for (const nm of NAMES) for (const p of pages) {
  warm[p.target] = warm[p.target] || {};
  warm[p.target][nm] = await p.page.evaluate(([n, k]) => W274C.run(n, k), [nm, WARM]);
}
// 本測定: 巡ごと・セルごとに html を交互に
for (let r = 0; r < ROUNDS; r++) {
  for (const p of pages) p.rounds.push({});
  for (const nm of NAMES) for (const p of pages) {
    p.rounds[r][nm] = (await p.page.evaluate(([n, k]) => W274C.run(n, k), [nm, REPS])) / REPS;
  }
}
const rows = pages.map((p) => {
  const cell = {};
  for (const nm of NAMES) { const v = p.rounds.map((q) => q[nm]);
    cell[nm] = { medianMs: med(v), minMs: Math.min(...v), maxMs: Math.max(...v),
      spreadRel: med(v) > 0 ? (Math.max(...v) - Math.min(...v)) / med(v) : null }; }
  const g = (k) => cell[k].medianMs;
  const share = {}; for (const nm of NAMES) share[nm] = g(nm) / g('stepTotal');
  share.toyStep = (g('stepTotal') - g('stepCoreNoToy')) / g('stepTotal');
  const stepsPerFrame = Math.min(24, Math.max(1, Math.round(2 * p.info.timeScale)));
  return { target: p.target, info: p.info, warmMs: warm[p.target], rounds: p.rounds, cell,
    derived: { toyStep: g('stepTotal') - g('stepCoreNoToy'),
      gravityReSumInPass2: g('onePassAll') - (g('onePassMesh') || g('onePassAll')),
      srcArrayShare: g('localOnly') - g('localPrebuilt') },
    shareOfStepTotal: share,
    perFrame: { stepsPerFrame, SUBSTEPS: 2, timeScale: p.info.timeScale,
      stepTotalMsPerFrame: g('stepTotal') * stepsPerFrame, renderMsPerFrame: g('renderFrame'),
      totalMsPerFrame: g('stepTotal') * stepsPerFrame + g('renderFrame') },
    pageErrors: p.errs.slice(0, 3) };
});
await browser.close();

const ratio = rows.length > 1 ? Object.fromEntries(NAMES.map((nm) => [nm,
  rows[0].cell[nm].medianMs > 0 ? rows[rows.length - 1].cell[nm].medianMs / rows[0].cell[nm].medianMs : null])) : null;
const out = {
  meta: Object.assign({
    wave: '第274便c', preset: PRESET, warm: WARM, rounds: ROUNDS, reps: REPS,
    interleaved: true,
    doNotWrite: '**「N 倍速い」「モバイルで 60fps」とは書かない。** 本器は ms/步 を測るだけで、'
      + '合否も速さの主張も出さない。**V8 の最適化状態(JIT)と機械の混みぐあいに依存する**ので、'
      + '同じ html でも巡ごとに数割動く(spreadRel 欄)。比は**同じ走行の中で交互に測った 2 セル**でだけ読む。',
  }, provenanceMeta({ root: ROOT, wave: '第274便c', target: TARGETS[TARGETS.length - 1],
    code: ['tests/exp-w274c-galaxyprof.mjs', 'tests/lib-w272e-provenance.mjs'],
    // **inputs は現行 html だけ**にする(比較用の基点 html は走行後に消す一時ファイルなので、
    // 刻印は `comparedWith` に残して `lint.provenanceMeta` の照合対象には入れない)
    inputs: [TARGETS[TARGETS.length - 1]] }),
  { comparedWith: TARGETS.slice(0, -1).map((t) => stampFile(path.join(ROOT, t), t)) }),
  ratioLastOverFirst: ratio,
  targets: rows,
};
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log(JSON.stringify({ ratioLastOverFirst: ratio && Object.fromEntries(
  Object.entries(ratio).map(([k, v]) => [k, v === null ? null : +v.toFixed(3)])),
  targets: rows.map((r) => ({ target: r.target, n: r.info.n, hasMeshNeed: r.info.hasMeshNeed,
    cell: Object.fromEntries(Object.entries(r.cell).map(([k, v]) => [k, +v.medianMs.toFixed(3)])),
    spread: Object.fromEntries(Object.entries(r.cell).map(([k, v]) => [k, v.spreadRel === null ? null : +v.spreadRel.toFixed(2)])),
    share: Object.fromEntries(Object.entries(r.shareOfStepTotal).map(([k, v]) => [k, +v.toFixed(3)])),
    perFrame: r.perFrame, err: r.pageErrors })) }, null, 1));
console.log('→ ' + path.relative(ROOT, OUT));
