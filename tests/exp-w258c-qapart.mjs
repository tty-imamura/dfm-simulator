// 第258便c: QA の**部分実行**器。4 worktree が同時に QA_FAST を通すと 4 コア機で Chromium が
// 落ちるので、**自分のブロックと関係する既存ブロックだけ**を tests/qa.mjs から切り出し、
// **1 本の Chromium** で走らせる(通し実行・フル QA・perf は統括だけが回す)。
//
// 切り出しは「`add('<id>'` を含む行から、列 0 の `{` まで遡り、対応する列 0 の `}` まで」で行う
// —— tests/qa.mjs の**本文をそのまま**実行するので、コピーを持たず本体と食い違わない。
//
// 使い方:
//   node tests/exp-w258c-qapart.mjs                 … 既定の一式(下の DEFAULT_IDS)
//   node tests/exp-w258c-qapart.mjs ui.spaceMeshRow params.scaleBase
//   QA_TARGET=index.html node tests/exp-w258c-qapart.mjs
// 終了コード: 1 件でも FAIL なら 1。
// 限界(正直に): 切り出したブロックが**上流のローカル変数**(ワーカープール w5cGetUnit 等)を
// 参照している場合、その行で ReferenceError になる(第279便b: fpRun は本体をそのまま走らせる代用を置いた)。**それまでに出た PASS/FAIL は有効**で、
// 統括のフル QA が本来の裁定者である。よく使う共有フラグ(FAST / OUT_DIR / hasMerger /
// pageErrors / page)はこの器が先に用意する。
//
// 第322便d(統括の検証項目 R273): 切り出しの純関数を `tests/lib-w322d-qapart.mjs` へ移した(本文は 1 字も変えていない —— `tools/qa-keys.mjs` が同じ関数で範囲を取る)。
//   `--batch N`(既定なし = 従来どおり 1 本): 鍵を切り出しの範囲の順に並べて N 鍵ずつの束に分け(範囲が重なる鍵は同じ束)、**束ごとに子の Node と
//   Chromium を作り直して**順に走らせる(前の束の heap とブラウザを持ち越さない)。束ごとの PASS/FAIL を数えて最後に 1 行・1 束でも FAIL か
//   子が rc ≠ 0 で終われば終了コード 1。`--emit <dir>` は走らせずに走行の本文(run.mjs / run-<k>.mjs)を書くだけ(切り出しの照合用)。
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DEFAULT_IDS = ['behavior.spaceMeshGrid', 'ui.spaceMeshGain', 'ui.samplePicker',
  'params.scaleBase', 'ui.spaceMeshRow', 'ui.raysDesc'];
// 第322便d: 選択肢(--batch N・--emit <dir>)を鍵の並びから外す(鍵は `--` で始まらない)
const ARGV = process.argv.slice(2);
const optOf = (k) => { const i = ARGV.indexOf(k); return i >= 0 ? ARGV[i + 1] : null; };
const BATCH = optOf('--batch') ? Math.max(1, Math.floor(Number(optOf('--batch')))) : null;
const EMIT = optOf('--emit') ? path.resolve(optOf('--emit')) : null;
const POS = ARGV.filter((a, i) => !(a === '--batch' || a === '--emit' || ARGV[i - 1] === '--batch' || ARGV[i - 1] === '--emit'));
const IDS = POS.length ? POS : DEFAULT_IDS;

const qaSrc = fs.readFileSync(path.join(ROOT, 'tests/qa.mjs'), 'utf8');
// 第279便b: W5b で関数宣言へ持ち上げたブロックは最上位の文の切り出しで範囲を取り、見出し行を `if (<ガード>) {` に戻して走らせる(本文は 1 文字も変えない)。
// 第296便(統合)・第319便(統括の統合): 世代定数(1 行の型と第284〜287便の複数行の範囲)を切り出しの前文に写す。
// 第322便d: 切り出しの本文は tests/lib-w322d-qapart.mjs(qaSpanner —— 移しただけ)
const QO = await import(pathToFileURL(path.join(ROOT, 'tests', 'lib-w279b-qaorder.mjs')).href);
const QP = await import(pathToFileURL(path.join(ROOT, 'tests', 'lib-w322d-qapart.mjs')).href);
const SP = QP.qaSpanner(qaSrc, QO);
const sourceOf = (ids) => {
  const merged = SP.mergeSpans(ids.map(SP.spanOf));
  return { merged, src: preludeOf(SP.constsOf(merged), SP.consts284Of(merged), SP.bodyOf(merged)) };
};

function preludeOf(consts, consts284, body) {
  return `import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';
const ROOT = ${JSON.stringify(ROOT)};
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + path.join(ROOT, TARGET);
const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || ${JSON.stringify(path.resolve(ROOT, '..', '..', '..'))};
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let browser;
try { browser = await req('playwright').chromium.launch(); }
catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }
// 切り出したブロックの一部は共有ページ(page/pageErrors)を使うので、1 枚だけ用意しておく
const page = await browser.newPage();
const pageErrors = [];
page.on('pageerror', (e) => pageErrors.push(String(e.message || e)));
await page.goto(INDEX, { waitUntil: 'load' });
await page.waitForFunction(() => window.HP && HP.sim && HP.currentPreset());
const FAST = process.env.QA_FAST === '1';
const OUT_DIR = path.join(ROOT, 'tests', 'out');
// tests/qa.mjs が上流で作っている共有フラグ(切り出したブロックが参照する)
const hasMerger = await page.evaluate(() => HP.allPresets().some((p) => p.id === 'merger'));
// 第286便b: cLight の真値化の世代(tests/qa.mjs の冒頭と同じ式 —— 既存の試験の c=3×10⁴ の固定値を世代で分ける)
const C_TRUE_286B = fs.readFileSync(path.join(ROOT, TARGET), 'utf8').indexOf('"units":{"wave":"第286便b"') >= 0;
const C4_286B = C_TRUE_286B ? 29979.2458 : 30000;
const KAPPA4_286B = C_TRUE_286B ? 7.425826474101849e-9 : 7.415555555555556e-9;
const C5_286B = C_TRUE_286B ? 2997.92458 : 3000;
const C7_286B = C_TRUE_286B ? 29.9792458 : 30;
// 第279便b: fpRun(指紋キャッシュ)は部分実行では使わない — 本体をそのまま走らせる
const fpRun = async (testId, body) => { await body(); return false; };
const results = [];
let lastAddAt = Date.now();
const add = (id, pass, detail) => {
  const now = Date.now(); const ms = now - lastAddAt; lastAddAt = now;
  results.push({ id, pass: !!pass, detail: String(detail ?? ''), ms });
  console.log(\`\${pass ? 'PASS' : 'FAIL'} \${id}\${detail ? '  ' + detail : ''}  [\${(ms / 1000).toFixed(1)}s]\`);
};
${consts}
${consts284}
${body}
await browser.close();
const pass = results.every((r) => r.pass);
console.log(\`\\n\${pass ? 'ALL PASS' : 'FAILED'} (\${results.filter((r) => r.pass).length}/\${results.length})\`);
process.exit(pass ? 0 : 1);
`;
}
if (!BATCH) {
  const { merged, src } = sourceOf(IDS);
  const tmp = path.join(EMIT || fs.mkdtempSync(path.join(os.tmpdir(), 'w258c-qapart-')), 'run.mjs');
  if (EMIT) fs.mkdirSync(EMIT, { recursive: true });
  fs.writeFileSync(tmp, src);
  console.log(`# 切り出し: ${IDS.join(' / ')}  (${merged.map(([a, b]) => `${a}-${b}`).join(',')} 行)`);
  if (EMIT) { console.log('# --emit: ' + tmp + '(走らせない)'); process.exit(0); }
  await import(pathToFileURL(tmp).href);
} else {
  // 第322便d: 束ごとに子の Node(と、その中の Chromium)を作り直す
  const keyed = IDS.map((id) => ({ id, span: SP.spanOf(id) }));
  const batches = QP.batchKeys(keyed, BATCH);
  const dir = EMIT || fs.mkdtempSync(path.join(os.tmpdir(), 'w258c-qapart-'));
  if (EMIT) fs.mkdirSync(EMIT, { recursive: true });
  console.log(`# --batch ${BATCH}: 鍵 ${IDS.length} 本を ${batches.length} 束に(束ごとに子の Node と Chromium を作り直す)`);
  const sum = { pass: 0, fail: 0, bad: [] };
  for (let k = 0; k < batches.length; k++) {
    const { merged, src } = sourceOf(batches[k]);
    const tmp = path.join(dir, `run-${k + 1}.mjs`);
    fs.writeFileSync(tmp, src);
    console.log(`# 束 ${k + 1}/${batches.length}: ${batches[k].join(' / ')}  (${merged.map(([a, b]) => `${a}-${b}`).join(',')} 行)`);
    if (EMIT) continue;
    const t0 = Date.now();
    const r = await new Promise((resolve) => {
      const ch = spawn(process.execPath, [tmp], { cwd: ROOT, env: process.env, stdio: ['ignore', 'pipe', 'pipe'] });
      let np = 0, nf = 0, buf = '';
      const line = (l) => { if (/^PASS /.test(l)) np++; else if (/^FAIL /.test(l)) nf++; };
      ch.stdout.on('data', (d) => { process.stdout.write(d); buf += d.toString(); const ls = buf.split('\n'); buf = ls.pop(); ls.forEach(line); });
      ch.stderr.on('data', (d) => process.stderr.write(d));
      ch.on('close', (rc, sig) => { if (buf) line(buf); resolve({ rc, sig, np, nf }); });
    });
    sum.pass += r.np; sum.fail += r.nf;
    if (r.rc !== 0 || r.nf) sum.bad.push(`束 ${k + 1}(rc ${r.rc === null ? r.sig : r.rc}・FAIL ${r.nf})`);
    console.log(`# 束 ${k + 1}/${batches.length} の終わり: PASS ${r.np}・FAIL ${r.nf}・rc ${r.rc === null ? r.sig : r.rc}(${((Date.now() - t0) / 1000).toFixed(1)} s)`);
  }
  if (EMIT) { console.log('# --emit: ' + dir + '(走らせない)'); process.exit(0); }
  console.log(`\n# --batch ${BATCH}: ${sum.bad.length ? 'FAILED' : 'ALL PASS'} —— 束 ${batches.length}・PASS ${sum.pass}・FAIL ${sum.fail}${sum.bad.length ? '・' + sum.bad.join(' / ') : ''}`);
  process.exit(sum.bad.length ? 1 : 0);
}
