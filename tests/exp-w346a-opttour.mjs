// 第346便a(原仮定者の回答(2026-11-21 —— 第145報の回答 2)「AN931: Bで進める」・統括の検証項目 R397):
//   **最適化が止まる本の記録**(段 opttour-346a → 正本 tests/out/opttour-346a.json —— ブラウザで測る段)。
//   代表の 7 本 × 使い方 2 つ(A/B〔kFrame 0〕・2 つの sim が同じ設定で両方進む形)を、**1 回ごとにブラウザを起こし直して**走らせ
//   (同じブラウザの中で本を続けると、出力の行がどの本のものか分からなくなる・フィードバックが混ざる)、
//   `--js-flags=--trace-opt --trace-deopt` の出力(DEBUG=pw:browser で Playwright の [pid][out] の行に出る —— ブラウザも起動の仕方も変えない)から
//   「最適化が止まった関数と理由」を数える(tests/lib-w346a-opttour.mjs)。正本にブラウザの版・V8 の版・数学関数の指紋を書く。
//   門(正本の gate —— QA behavior.opttour346a が正本から引き直す): 記録の V8 が 15.7 のとき、A/B で `S._core` が止まる本 = 0。
//   2 つの sim が両方進む形は数を記録するだけ。記録のブラウザが別の版のときは「版が違う —— 比べない」。
//   明示のブラウザ: CHROMIUM_PATH と DFM_EXPECT_CHROMIUM の両方が在ればその実行ファイル(版が違えば例外で止まる —— 〔第345便b〕の約束)。
// 使い方: node tests/exp-w346a-opttour.mjs                        (正本 tests/out/opttour-346a.json)
//         node tests/exp-w346a-opttour.mjs --all --out <scratch の json>   (内蔵の全本 —— 正本には入れない・正本の場所へは書かない)
//         W346A_TARGET で測る html を変えられる(既定 beta/index.html —— 基準の html と並べるとき)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import * as E from './lib-w345-engine.mjs';
import { decodeOpt } from './lib-w345d-perfengine.mjs';
import * as L from './lib-w346a-opttour.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w346a-opttour-1';
export const OUT_MAIN = 'tests/out/opttour-346a.json';
export const CODE = Object.freeze(['tests/exp-w346a-opttour.mjs', 'tests/lib-w346a-opttour.mjs', 'tests/lib-w345-engine.mjs', 'tests/lib-w345d-perfengine.mjs', 'tests/lib-w272e-provenance.mjs']);
export const NOT_CLAIM = '「新しい版で速くなった」「止まる件を解決した」とは言わない —— この版・この箱・この本・この使い方での、最適化が止まった関数の記録。1 步の ms は記録だけ(門にしない)';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

// 1 回の走り(ページの中 —— %GetOptimizationStatus のために文字列で渡す)
function runSource(id, mode) {
  const D = L.DECL_346A;
  return `(() => { try {
    HP.loadPreset(${JSON.stringify(id)}, false);
    let sB = null;
    if (${JSON.stringify(mode)} === 'ab') { HP.abStart('kFrame', 0); sB = HP.ab().simB; }
    else { sB = makeSim(); sB.build(JSON.parse(JSON.stringify(currentPreset))); }
    const t0 = performance.now(); let k = 0;
    for (; k < ${D.steps} && performance.now() - t0 < ${D.capMs}; k++) { HP.sim.step(${D.dt}); if (sB) sB.step(${D.dt}); }
    const wall = (performance.now() - t0) / 1000;
    const s = %GetOptimizationStatus(HP.sim._core);
    if (HP.ab()) HP.abStop();
    return { steps: k, wallSec: +wall.toFixed(3), rateStepsPerSec: +(2 * k / Math.max(wall, 1e-9)).toFixed(1), coreStatus: s };   // 時間の欄は記録だけ(鎖の volatilePaths)
  } catch (e) { return { error: String(e && e.message || e).slice(0, 120) }; } })()`;
}

export async function main() {
  const t0 = Date.now(), argv = process.argv.slice(2);
  const all = argv.includes('--all'), oi = argv.indexOf('--out');
  const OUT = oi >= 0 ? path.resolve(argv[oi + 1]) : (process.env.W346A_OUT ? path.resolve(ROOT, process.env.W346A_OUT) : path.join(ROOT, OUT_MAIN));
  if (all && path.resolve(OUT) === path.join(ROOT, OUT_MAIN)) { console.error('opttour-346a: --all は正本の場所へ書かない(--out で scratch を名指す)'); return 2; }
  const TARGET = process.env.W346A_TARGET || 'beta/index.html';
  const htmlAbs = path.resolve(ROOT, TARGET);
  console.log('第346便a opttour(版 ' + HARNESS_VERSION + ')—— ' + TARGET + (all ? '・全本' : ''));
  // ブラウザの出力(renderer の標準出力)を Playwright の debug の行で受ける —— playwright を読む前に DEBUG を立てる
  process.env.DEBUG = [process.env.DEBUG, 'pw:browser'].filter(Boolean).join(',');
  let bucket = [];
  const ow = process.stderr.write.bind(process.stderr);
  process.stderr.write = (c, ...r) => { const t = String(c); if (t.indexOf('pw:browser') >= 0) { for (const l of t.split('\n')) if (l) bucket.push(l); return true; } return ow(c, ...r); };
  const require = createRequire(path.join(ROOT, 'package.json'));
  let chromium;
  try { ({ chromium } = require('playwright')); } catch (e) { ({ chromium } = require(process.env.PLAYWRIGHT_CORE_DIR || 'playwright-core')); }
  const spec = E.explicitBrowserSpec(process.env);
  const launch = async () => {
    const opt = { args: ['--js-flags=' + L.DECL_346A.jsFlags] };
    if (spec) opt.executablePath = spec.executablePath;
    const b = await chromium.launch(opt);
    if (spec) { try { E.assertExpectedVersion(b.version(), spec.expect); } catch (e) { await b.close().catch(() => {}); throw e; } }
    return b;
  };
  let engine = null, ids = L.DECL_346A.presets.slice();
  {
    const b = await launch();
    try {
      const m = await E.measureBrowser(b);
      const D = E.loadDeclaration(ROOT);
      engine = { chromium: m.chromium, v8: m.v8, mathFingerprint: m.mathFingerprint, sameAsDeclared: E.sameNumericEngine(m.mathFingerprint, D.mathFingerprint), explicit: spec ? spec.executablePath : null };
      if (all) {
        const p = await b.newPage(); await p.goto('file://' + htmlAbs); await p.waitForFunction(() => window.HP && HP.sim);
        ids = await p.evaluate(() => HP.allPresets().map((q) => q.id)); await p.close();
      }
    } finally { await b.close().catch(() => {}); }
  }
  console.log('ブラウザ ' + engine.chromium + '(V8 ' + engine.v8 + ')・指紋 ' + engine.mathFingerprint.slice(0, 12) + (engine.sameAsDeclared ? '(宣言と同じ)' : '(宣言と違う)'));
  const runs = [];
  for (const id of ids) for (const mode of L.DECL_346A.modes) {
    bucket = [];
    const b = await launch();
    let r;
    try {
      const page = await b.newPage();
      const errs = []; page.on('pageerror', (e) => errs.push(String(e && e.message || e).slice(0, 80)));
      await page.addInitScript((pid) => { try { localStorage.setItem('hp_last_preset', pid); } catch (_) {} }, id);
      await page.goto('file://' + htmlAbs); await page.waitForFunction(() => window.HP && HP.sim, null, { timeout: 60000 });
      r = await page.evaluate(runSource(id, mode));
      if (errs.length) r.pageErrors = errs.slice(0, 3);
      await page.close();                                   // renderer を閉じて標準出力を吐かせる
      await new Promise((res) => setTimeout(res, 300));
    } catch (e) { r = { error: String(e && e.message || e).slice(0, 120) }; }
    finally { await b.close().catch(() => {}); }
    await new Promise((res) => setTimeout(res, 100));
    const t = L.parseTrace346a(bucket);
    // 打ち切りの回数と出力の行の数は走りごとに揺れるので、正本には関数の名と「出力の行が在った」だけを書く
    const row = { preset: id, mode, ...r, coreDecoded: Number.isFinite(r.coreStatus) ? decodeOpt(r.coreStatus) : null, disabled: t.disabled,
      abortedFns: [...new Set(Object.keys(t.aborted).map((k) => k.split(' ')[0]))].sort(), traceSeen: t.outLines > 0 };
    runs.push(row);
    console.log(`  ${id} ${mode}: ${row.error ? '誤り ' + row.error : row.steps + ' 步・' + (1000 / row.rateStepsPerSec).toFixed(3) + ' ms/步(1 sim 1 步)・S._core ' + row.coreDecoded} —— 止まった関数 ${Object.keys(t.disabled).join(',') || 'なし'}(出力 ${t.outLines} 行)`);
  }
  process.stderr.write = ow;
  const summary = L.summarize346a(runs), gate = L.gate346a(summary, engine);
  const out = { version: HARNESS_VERSION, libVersion: L.OPTTOUR_LIB_VERSION_346A, generator: 'tests/exp-w346a-opttour.mjs', target: TARGET, all,
    ruling: '原仮定者の回答(2026-11-21 —— 第145報の回答 2)「AN931: Bで進める」・統括の検証項目 R397',
    decl: L.DECL_346A, engine, runs, summary, gate, ok: gate.pass, notClaim: NOT_CLAIM, elapsedS: (Date.now() - t0) / 1000 };
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第346便a', target: TARGET, code: CODE, inputs: [E.DECL_FILE] }), {
    harnessVersion: HARNESS_VERSION, stage: all ? null : 'opttour-346a', engine: engine.chromium + ' / V8 ' + engine.v8, notClaim: NOT_CLAIM });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→ ' + path.relative(ROOT, OUT) + ' 門: ' + gate.note + ' / two: S._core が止まる本 ' + summary.two.coreStoppedN + '(記録だけ)・' + out.elapsedS + ' s');
  return gate.pass ? 0 : 1;
}
if (IS_MAIN) process.exit(await main());
