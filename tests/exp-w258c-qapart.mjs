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
// 参照している場合、その行で ReferenceError になる。**それまでに出た PASS/FAIL は有効**で、
// 統括のフル QA が本来の裁定者である。よく使う共有フラグ(FAST / OUT_DIR / hasMerger /
// pageErrors / page)はこの器が先に用意する。
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DEFAULT_IDS = ['behavior.spaceMeshGrid', 'ui.spaceMeshGain', 'ui.samplePicker',
  'params.scaleBase', 'ui.spaceMeshRow', 'ui.raysDesc'];
const IDS = process.argv.slice(2).length ? process.argv.slice(2) : DEFAULT_IDS;

const lines = fs.readFileSync(path.join(ROOT, 'tests/qa.mjs'), 'utf8').split('\n');
function spanOf(id) {
  const i = lines.findIndex((l) => l.includes("add('" + id + "'"));
  if (i < 0) throw new Error('QA ブロックが見つからない: ' + id);
  let a = i;
  while (a >= 0 && lines[a].trimEnd() !== '{') a--;
  if (a < 0) throw new Error('列 0 の { が見つからない: ' + id);
  let c = a - 1;
  while (c >= 0 && lines[c].startsWith('//')) c--;
  let b = a + 1;
  while (b < lines.length && lines[b].trimEnd() !== '}') b++;
  if (b >= lines.length) throw new Error('対応する } が見つからない: ' + id);
  return [c + 1, b + 1];
}
const spans = IDS.map(spanOf).sort((p, q) => p[0] - q[0]);
const merged = [];
for (const [s0, e0] of spans) {
  if (merged.length && s0 <= merged[merged.length - 1][1]) {
    merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], e0);
  } else merged.push([s0, e0]);
}
const body = merged.map(([s0, e0]) => lines.slice(s0, e0).join('\n')).join('\n');

const src = `import fs from 'node:fs';
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
const results = [];
let lastAddAt = Date.now();
const add = (id, pass, detail) => {
  const now = Date.now(); const ms = now - lastAddAt; lastAddAt = now;
  results.push({ id, pass: !!pass, detail: String(detail ?? ''), ms });
  console.log(\`\${pass ? 'PASS' : 'FAIL'} \${id}\${detail ? '  ' + detail : ''}  [\${(ms / 1000).toFixed(1)}s]\`);
};
${body}
await browser.close();
const pass = results.every((r) => r.pass);
console.log(\`\\n\${pass ? 'ALL PASS' : 'FAILED'} (\${results.filter((r) => r.pass).length}/\${results.length})\`);
process.exit(pass ? 0 : 1);
`;
const tmp = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'w258c-qapart-')), 'run.mjs');
fs.writeFileSync(tmp, src);
console.log(`# 切り出し: ${IDS.join(' / ')}  (${merged.map(([a, b]) => `${a}-${b}`).join(',')} 行)`);
await import(pathToFileURL(tmp).href);
