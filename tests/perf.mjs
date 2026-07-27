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
// 第36便 Wave A(P2-2・ChatGPT差分検証レビュー): echo/freebox(第35便で追加)をベンチ対象へ。
// root(旧版)にはまだ存在しないため feature-detect し、片側にしかプリセットが無い場合は
// 「beta 単独の実測 ms を informational として記録する(pass判定なし・SAMPLES の 6/6 ゲート数
// には含めない)」。root へ第35便が昇格し両側に揃った時点で自動的に比較ゲートへ昇格する。
const EXTRA_SAMPLES = ['echo', 'freebox'];
const THRESH = +(process.env.PERF_THRESH || 1.10);
// 例: { convection: 1.60 } — 意図的な負荷増を許可する場合のみ
// 第33便 v5(腕のある銀河 — 恒星380体・意図的な構成変更。探索実測 beta/root=1.086 だが
// 同一内容でも ±0.09 のノイズ実績(第30便 convection 1.091)があるため余裕を持たせる
const ALLOW = { darkrotor: 1.30 };
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

async function measureOne(page, id, reps, frames, warm) {
  return page.evaluate(([pid, reps, frames, warm]) => {
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
  }, [id, reps, frames, warm]);
}

async function measureTarget(browser, target) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('file://' + path.join(ROOT, target));
  await page.waitForFunction(() => window.HP && HP.sim);
  const ids = await page.evaluate(() => HP.allPresets().map((p) => String(p.id)));
  const out = {};
  for (const id of SAMPLES) {
    out[id] = await measureOne(page, id, REPS, FRAMES, WARMUP_FRAMES);
    console.log(`  ${target} ${id}: ${out[id].medianMs.toFixed(1)}ms/${FRAMES}frames (steps/frame=${out[id].stepsPerFrame}, n=${out[id].n})`);
  }
  // 第36便 P2-2: echo/freebox は片側にプリセットが無いことがある(root=旧版は未実装)。
  // 存在するときだけ計測し、無ければ null のまま(呼び出し側で informational 扱いにする)
  const extra = {};
  for (const id of EXTRA_SAMPLES) {
    if (ids.includes(id)) {
      extra[id] = await measureOne(page, id, REPS, FRAMES, WARMUP_FRAMES);
      console.log(`  ${target} ${id}(extra): ${extra[id].medianMs.toFixed(1)}ms/${FRAMES}frames (steps/frame=${extra[id].stepsPerFrame}, n=${extra[id].n})`);
    } else {
      extra[id] = null;
      console.log(`  ${target} ${id}(extra): プリセットなし`);
    }
  }
  await page.close();
  return { out, extra };
}

const browser = await getBrowser();
console.log('perf gate: root を計測中…');
const rootR = await measureTarget(browser, 'index.html');
console.log('perf gate: beta を計測中…');
const betaR = await measureTarget(browser, path.join('beta', 'index.html'));
await browser.close();
const root = rootR.out, beta = betaR.out;

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
// 第36便 P2-2: echo/freebox — 両側に揃えばゲート(rows へ合流・6/6 の分母に加算)、
// 片側(現状は beta のみ)しか無ければ informational(pass判定なし・分母に含めない)
const informational = [];
for (const id of EXTRA_SAMPLES) {
  const rEx = rootR.extra[id], bEx = betaR.extra[id];
  if (rEx && bEx) {
    const ratio = bEx.medianMs / rEx.medianMs;
    const limit = ALLOW[id] || THRESH;
    const nanOk = !rEx.nan && !bEx.nan;
    const pass = ratio <= limit && nanOk;
    if (!pass) fail++;
    rows.push({ id, rootMs: +rEx.medianMs.toFixed(1), betaMs: +bEx.medianMs.toFixed(1),
      ratio: +ratio.toFixed(3), limit, stepsPerFrameRoot: rEx.stepsPerFrame,
      stepsPerFrameBeta: bEx.stepsPerFrame, nRoot: rEx.n, nBeta: bEx.n, pass });
    console.log(`${pass ? 'PASS' : 'FAIL'} perf.${id}  beta/root=${ratio.toFixed(3)} (≤${limit})  root=${rEx.medianMs.toFixed(1)}ms beta=${bEx.medianMs.toFixed(1)}ms`);
  } else if (rEx || bEx) {
    const side = bEx ? 'beta' : 'root';
    const one = bEx || rEx;
    informational.push({ id, side, ms: +one.medianMs.toFixed(1), stepsPerFrame: one.stepsPerFrame, n: one.n,
      note: `${side === 'beta' ? 'root' : 'beta'}未実装のため${side}単独実測(pass判定なし・6/6ゲート数に含めない)` });
    console.log(`INFO perf.${id}  ${side}=${one.medianMs.toFixed(1)}ms(${side === 'beta' ? 'root' : 'beta'}未実装 — 昇格後に比較ゲート化)`);
  } else {
    console.log(`SKIP perf.${id}(root/betaとも未実装)`);
  }
}
fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(path.join(OUT_DIR, 'perf-results.json'), JSON.stringify({
  when: new Date().toISOString(), threshold: THRESH, reps: REPS, frames: FRAMES,
  // results: 比較ゲート対象(pass/fail 判定あり。fail 件数がそのまま exit code に反映される)
  // informational: 片側にしかプリセットが無いための参考計測(pass判定なし。ゲート対象外)
  results: rows, informational,
}, null, 2));
console.log(`perf gate: ${rows.length - fail}/${rows.length} PASS → tests/out/perf-results.json`
  + (informational.length ? ` (+${informational.length} informational)` : ''));
process.exit(fail ? 1 : 0);
