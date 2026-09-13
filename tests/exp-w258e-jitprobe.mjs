// 第258便e: S._core の JIT 崖のマイクロベンチ(ステップ処理速度 ms/步)。
//
// 背景: 第258便 統合ツリーで beta フルゲートを回すと、シミュレーション本体を長く走らせる
// テストだけが一様に 15〜20 倍遅くなった(claim.galaxygeo2-outerboost 152→3013 s ・
// claim.bhcore-selfdrive 80→1339 s ・behavior.templates229 12→213 s 等)。軽いテストと
// QA_FAST(短い走行)は前便並みである。第239便 §4.5 で確立した「新しい経路は S._core の外に
// 真偽値 1 つで素通り・S._core を大きくしない」規約の **JIT 崖**(V8 が巨大な単一関数の
// 最適化を諦め、インタプリタ実行のまま走る)が疑われる。
//
// **崖は「1 度目の最適化」では出ない。** 素の 1 プリセット走行(loadPreset 1 回)では
// 1.5 倍程度にしかならず、**A/B(2 個目の sim を作って両方を進める)や build の 2 度目**の
// ように S の形が変わって **_core が一度 deopt した後**にはじめて 15〜20 倍になる
// (再最適化が通らずインタプリタへ落ちたまま固定される)。本器は QA の重いテストと同じ
// **A/B ワークロード**(loadPreset → abStart('kFrame',0) → 両 sim を進める)で測る。
//
// 使い方:
//   node tests/exp-w258e-jitprobe.mjs beta/_w258e_base.html beta/index.html [...]
//     (引数 1 が比の基準。ms/步 は **1 sim・1 步あたり**へ正規化して表にする)
// 環境変数:
//   W258E_PRESETS(既定 galaxyGeo2,bhCore,galaxyMeshSpiral,gw150914DFM)/ W258E_MODE(ab|plain)
//   W258E_WARM(既定 100 步)/ W258E_MIN_STEPS(既定 400)/ W258E_MAX_STEPS(既定 2000)
//   W258E_MIN_MS(既定 3000)/ W258E_BUDGET_MS(既定 90000 — 1 セルの打ち切り)
//   W258E_OUT(既定 tests/out/w258e-jitprobe.json)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGETS = process.argv.slice(2);
if (!TARGETS.length) { console.error('usage: node tests/exp-w258e-jitprobe.mjs <html> [<html>...]'); process.exit(2); }
const PRESETS = (process.env.W258E_PRESETS || 'galaxyGeo2,bhCore,galaxyMeshSpiral,gw150914DFM').split(',').filter(Boolean);
const MODE = process.env.W258E_MODE || 'ab';
const WARM = Number(process.env.W258E_WARM || 100);
const MIN_STEPS = Number(process.env.W258E_MIN_STEPS || 400);
const MAX_STEPS = Number(process.env.W258E_MAX_STEPS || 2000);
const MIN_MS = Number(process.env.W258E_MIN_MS || 3000);
const BUDGET_MS = Number(process.env.W258E_BUDGET_MS || 90000);
const OUT = process.env.W258E_OUT || path.join(ROOT, 'tests', 'out', 'w258e-jitprobe.json');

const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let browser;
try { browser = await req('playwright').chromium.launch(); }
catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }

async function cell(target, pid) {
  const page = await browser.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e.message || e)));
  await page.goto('file://' + path.join(ROOT, target), { waitUntil: 'load' });
  await page.waitForFunction(() => window.HP && HP.sim && HP.currentPreset());
  const r = await page.evaluate((a) => {
    const [pid, mode, warm, minSteps, maxSteps, minMs, budget] = a;
    if (!HP.allPresets().some((p) => p.id === pid)) return { missing: true };
    HP.loadPreset(pid, false);
    const sA = HP.sim;
    let sB = null;
    if (mode === 'ab') { HP.abStart('kFrame', 0); sB = HP.ab().simB; }
    const sims = sB ? [sA, sB] : [sA];
    const one = () => { for (const s of sims) s.step(0.016); };
    for (let i = 0; i < warm; i++) one();
    const CH = 100;
    let steps = 0, ms = 0; const chunks = [];
    const t00 = performance.now();
    while (steps < maxSteps && (steps < minSteps || ms < minMs) && (performance.now() - t00) < budget) {
      const t0 = performance.now();
      for (let i = 0; i < CH; i++) one();
      const d = performance.now() - t0;
      ms += d; steps += CH; chunks.push(+d.toFixed(1));
    }
    return { n: sA.n, sims: sims.length, steps, ms, chunks,
      msPerStep: ms / (steps * sims.length), nan: sA.hasNaN() };
  }, [pid, MODE, WARM, MIN_STEPS, MAX_STEPS, MIN_MS, BUDGET_MS]);
  await page.close();
  if (errs.length) r.pageErrors = errs.slice(0, 2);
  return r;
}

const rows = {};
for (const t of TARGETS) {
  rows[t] = {};
  for (const pid of PRESETS) {
    const r = await cell(t, pid);
    rows[t][pid] = r;
    console.log(`${t}  ${pid}  ` + (r.missing ? 'MISSING'
      : `n=${r.n} sims=${r.sims} steps=${r.steps} ${r.msPerStep.toFixed(4)} ms/步 `
        + `(${(r.ms / 1000).toFixed(1)} s) chunks=${JSON.stringify(r.chunks)}`));
  }
}
await browser.close();

const base = TARGETS[0];
const W = 24;
const lines = [];
lines.push('mode=' + MODE + ' (ms/步 は 1 sim・1 步あたり / 括弧内は ' + base.replace(/^beta\//, '') + ' 比)');
lines.push('preset         ' + TARGETS.map((t) => t.replace(/^beta\//, '').replace(/\.html$/, '').padEnd(W)).join(''));
for (const pid of PRESETS) {
  const cells = TARGETS.map((t) => {
    const r = rows[t][pid];
    if (!r || r.missing) return 'MISSING'.padEnd(W);
    const b = rows[base][pid];
    const ratio = (b && !b.missing) ? (r.msPerStep / b.msPerStep) : NaN;
    return (r.msPerStep.toFixed(3) + ' (×' + ratio.toFixed(2) + ')').padEnd(W);
  });
  lines.push(pid.padEnd(15) + cells.join(''));
}
const table = lines.join('\n');
console.log('\n' + table);
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify({ targets: TARGETS, presets: PRESETS, mode: MODE,
  warm: WARM, minSteps: MIN_STEPS, maxSteps: MAX_STEPS, minMs: MIN_MS, budgetMs: BUDGET_MS,
  rows, table }, null, 1));
console.log('\n-> ' + OUT);
