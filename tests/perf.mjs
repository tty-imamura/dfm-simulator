// 動的性能回帰ゲート(第29便 — 第25次レビュー P0-3)。実行: node tests/perf.mjs
// - 同一Chromiumプロセス内で root(index.html)→ beta(beta/index.html)を順に読み込み、
//   代表サンプルごとに「1フレーム相当の物理ステップ × FRAMES」の所要時間を REPS 回計測して
//   中央値で比較する(ウォームアップ後)。stepsPerFrame = round(SUBSTEPS × timeScale) を
//   使うため、timeScale 由来の計算量増(第25次レビュー原因1)もこのゲートで検出できる。
// - 変更を意図しないサンプルは beta/root ≤ THRESH(既定1.10)。意図的に増やす場合は
//   ALLOW に {id: 上限} を追記して理由をコメントで残す(明示的な許可リスト)。
// - 結果は tests/out/perf-results.json に保存。1件でも超過なら exit code 1。
// - 描画側(FPS/renderMs)のゲートはヘッドレスCIでは実機代表性が低いため対象外
//   (第25次裁定: CPUゲートのみ採用。描画は実機確認手順に委ねる)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'tests', 'out');
const SAMPLES = ['galaxy', 'darkrotor', 'merger', 'convection', 'counterring', 'saturnLayered'];
const THRESH = +(process.env.PERF_THRESH || 1.10);
const ALLOW = {};           // 例: { convection: 1.60 } — 意図的な負荷増を許可する場合のみ
const REPS = 5, FRAMES = 60, WARMUP_FRAMES = 20;

async function getBrowser() {
  const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  try { const { chromium } = await import('playwright'); return await chromium.launch(); } catch {}
  try { const { chromium } = await import('playwright-core'); return await chromium.launch({ executablePath: exe }); } catch {}
  const dir = process.env.PLAYWRIGHT_CORE_DIR;
  if (dir) {
    const { createRequire } = await import('node:module');
    const { chromium } = createRequire(path.join(dir, 'noop.js'))('playwright-core');
    return chromium.launch({ executablePath: exe });
  }
  throw new Error('playwright が見つかりません。`npm install` を実行するか PLAYWRIGHT_CORE_DIR を指定してください');
}

async function measureTarget(browser, target) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('file://' + path.join(ROOT, target));
  await page.waitForFunction(() => window.HP && HP.sim);
  const out = {};
  for (const id of SAMPLES) {
    out[id] = await page.evaluate(([pid, reps, frames, warm]) => {
      HP.loadPreset(pid, false);
      const S = HP.sim;
      // メインループと同じ steps/frame(SUBSTEPS=2・速度×1。上限24も同じ)
      const spf = Math.max(1, Math.min(24, Math.round(2 * (S.params.timeScale || 1))));
      for (let k = 0; k < spf * warm; k++) S.step(0.016);
      const times = [];
      for (let r = 0; r < reps; r++) {
        const t0 = performance.now();
        for (let f = 0; f < frames; f++) for (let s = 0; s < spf; s++) S.step(0.016);
        times.push(performance.now() - t0);
      }
      times.sort((a, b) => a - b);
      return { medianMs: times[Math.floor(times.length / 2)], stepsPerFrame: spf, n: S.n, nan: S.hasNaN() };
    }, [id, REPS, FRAMES, WARMUP_FRAMES]);
    console.log(`  ${target} ${id}: ${out[id].medianMs.toFixed(1)}ms/${FRAMES}frames (steps/frame=${out[id].stepsPerFrame}, n=${out[id].n})`);
  }
  await page.close();
  return out;
}

const browser = await getBrowser();
console.log('perf gate: root を計測中…');
const root = await measureTarget(browser, 'index.html');
console.log('perf gate: beta を計測中…');
const beta = await measureTarget(browser, path.join('beta', 'index.html'));
await browser.close();

let fail = 0;
const rows = [];
for (const id of SAMPLES) {
  const ratio = beta[id].medianMs / root[id].medianMs;
  const limit = ALLOW[id] || THRESH;
  const nanOk = !root[id].nan && !beta[id].nan;
  const pass = ratio <= limit && nanOk;
  if (!pass) fail++;
  rows.push({ id, rootMs: +root[id].medianMs.toFixed(1), betaMs: +beta[id].medianMs.toFixed(1),
    ratio: +ratio.toFixed(3), limit, stepsPerFrameRoot: root[id].stepsPerFrame,
    stepsPerFrameBeta: beta[id].stepsPerFrame, nRoot: root[id].n, nBeta: beta[id].n, pass });
  console.log(`${pass ? 'PASS' : 'FAIL'} perf.${id}  beta/root=${ratio.toFixed(3)} (≤${limit})  root=${root[id].medianMs.toFixed(1)}ms beta=${beta[id].medianMs.toFixed(1)}ms`);
}
fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(path.join(OUT_DIR, 'perf-results.json'), JSON.stringify({
  when: new Date().toISOString(), threshold: THRESH, reps: REPS, frames: FRAMES, results: rows,
}, null, 2));
console.log(`perf gate: ${rows.length - fail}/${rows.length} PASS → tests/out/perf-results.json`);
process.exit(fail ? 1 : 0);
