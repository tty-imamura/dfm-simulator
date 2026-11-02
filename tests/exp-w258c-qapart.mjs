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
//
// 第323便a(統括の検証項目 R275 —— 原仮定者の指示(2026-11-01)「今後は、すぐに確認可能な規約を先に判定する」): **要求した鍵が走らなくても ALL PASS・rc 0** の穴の直し。
//   ① 要求した鍵の照合: 走行の終わりに、要求した鍵 ID の集合と結果の ID の集合を照らす(`classifyRequested` —— tests/lib-w322d-qapart.mjs)。
//      結果に無い鍵は、走行中に出た `SKIP …`・`RETIRED …` の行が名指せば **SKIP**(PASS に数えない)・名指さなければ **未実行**
//      (`FAIL <id>  未実行 —— Requested QA did not execute in qapart` を印字し FAIL として数える)。終わりの行は「PASS n・FAIL n・SKIP n・未実行 n」。
//      終了コード: FAIL・未実行・同じ範囲の他の鍵の FAIL・範囲の例外のどれかで 1。SKIP だけなら 0(root で beta 線のブロックが SKIP するのは正常)——
//      `--strict-skip` で SKIP も 1。`--batch` の要約も同じ 4 つの数(子の `# qapart-summary {…}` の行を読む —— 行が無い束は要求した鍵を全部未実行に数える)。
//   ② 走らなかった鍵の直し(lib の qaSpanner): 範囲が add の行を含まない鍵は add の行を含む列 0 の最上位の文を切り出す・範囲が読む上流の最上位の
//      const・関数宣言を前文へ写す(写せない名前は走らせる前に名指す)。範囲ごとに try/catch で包む(例外の範囲の鍵は未実行 —— 後の範囲は走り続ける)。
//      W5c のワーカープール(w5cGetUnit)は前文に「呼べば例外」の代わりを置く(その範囲は例外 → 鍵は未実行 —— フル QA が見る)。
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
const STRICT_SKIP = ARGV.includes('--strict-skip');   // 第323便a: SKIP も終了コード 1
const POS = ARGV.filter((a, i) => !(a === '--batch' || a === '--emit' || a === '--strict-skip' || ARGV[i - 1] === '--batch' || ARGV[i - 1] === '--emit'));
const IDS = POS.length ? POS : DEFAULT_IDS;

const qaSrc = fs.readFileSync(path.join(ROOT, 'tests/qa.mjs'), 'utf8');
// 第279便b: W5b で関数宣言へ持ち上げたブロックは最上位の文の切り出しで範囲を取り、見出し行を `if (<ガード>) {` に戻して走らせる(本文は 1 文字も変えない)。
// 第296便(統合)・第319便(統括の統合): 世代定数(1 行の型と第284〜287便の複数行の範囲)を切り出しの前文に写す。
// 第322便d: 切り出しの本文は tests/lib-w322d-qapart.mjs(qaSpanner —— 移しただけ)
const QO = await import(pathToFileURL(path.join(ROOT, 'tests', 'lib-w279b-qaorder.mjs')).href);
const QP = await import(pathToFileURL(path.join(ROOT, 'tests', 'lib-w322d-qapart.mjs')).href);
const QP_URL = pathToFileURL(path.join(ROOT, 'tests', 'lib-w322d-qapart.mjs')).href;   // 第323便a: 走行の本文が分類の関数を絶対 URL で読む(一時ディレクトリで走る)
const SP = QP.qaSpanner(qaSrc, QO);
// 第323便a: 前文に上流の宣言の閉包(SP.upstreamOf)・本文は範囲ごとに try/catch で包む(SP.guardedBodyOf —— 各行は SP.bodyOf と同じ)・終わりに要求した鍵の照合
const sourceOf = (ids) => {
  const merged = SP.mergeSpans(ids.map(SP.spanOf));
  const up = SP.upstreamOf(merged);
  return { merged, up, src: preludeOf(SP.constsOf(merged), SP.consts284Of(merged), SP.guardedBodyOf(merged), { ids, upstream: SP.upstreamTextOf(up), strictSkip: STRICT_SKIP }) };
};
// 第322便d: 範囲が add の行を含まない鍵(列 0 の `if (…) {`・`for (…) {` の中 —— 検索は直前の列 0 の `{` の範囲を取るので、その鍵は走らない)を走らせる前に印字する(判定と本文は不変)
{
  const outside = IDS.filter((id) => { const i = SP.lines.findIndex((l) => l.includes("add('" + id + "'")); if (i < 0) return false; const sp = SP.spanOf(id); return !(sp[0] <= i && i < sp[1]); });
  if (outside.length) console.log(`# 注意(第322便d): 範囲が add の行を含まない鍵 ${outside.length} 本 —— この部分 QA では走らない(列 0 の if/for の中・フル QA が見る): ${outside.join(' / ')}`);
  // 第323便a: 列 0 の最上位の文で切り出した鍵・前文に写す上流の宣言・写せない上流の名前(その範囲は例外で止まりうる —— 鍵は未実行として数える)
  const unitKeys = IDS.filter((id) => { try { return SP.spanKindOf(id) === 'unit'; } catch { return false; } });
  if (unitKeys.length) console.log(`# 第323便a: 列 0 の最上位の文で切り出した鍵 ${unitKeys.length} 本: ${unitKeys.join(' / ')}`);
  const bad = [];
  for (const id of IDS) { let u; try { u = SP.upstreamOf([SP.spanOf(id)]); } catch { continue; } if (u.unsafe.length) bad.push(id + '(' + u.unsafe.map((z) => z.name + ': ' + z.why).join('・') + ')'); }
  if (bad.length) console.log(`# 注意(第323便a): 前文に写せない上流の名前を読む鍵 ${bad.length} 本 —— その範囲は例外で止まりうる(鍵は未実行 —— フル QA が見る): ${bad.join(' / ')}`);
}

function preludeOf(consts, consts284, body, o) {
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
// 第323便a(R275): 走行中の SKIP/RETIRED の行を拾う(印字は変えない)・範囲の例外と拾われない reject を数える・W5c のワーカープールの代わり(呼べば例外)
const __qapartLib = await import(${JSON.stringify(QP_URL)});
const __qapartSkips = [], __qapartErrors = [];
globalThis.__qapartState = { results, skips: __qapartSkips, errors: __qapartErrors };
{ const log0 = console.log; console.log = (...a) => { const s = a.map(String).join(' '); if (/^\\s*(SKIP|RETIRED)\\s/.test(s)) __qapartSkips.push(s); return log0.apply(console, a); }; }
const __qapartErr = (e, span) => { __qapartErrors.push({ span, message: String((e && e.message) || e).slice(0, 300) }); console.log('# qapart(第323便a): 範囲 ' + span + ' が例外で止まった —— ' + String((e && e.stack) || e).split('\\n').slice(0, 3).join(' | ')); };
process.on('unhandledRejection', (e) => __qapartErr(e, 'unhandledRejection'));
const w5cGetUnit = async (key) => { throw new Error('qapart では W5c のワーカープール w5cGetUnit(' + JSON.stringify(key) + ') を使えない(フル QA が見る)'); };
${consts}
${consts284}
// 第323便a: 範囲が読む上流の最上位の宣言(tests/qa.mjs の文をそのまま —— 閉包)
${o.upstream}
${body}
await browser.close();
// 第323便a(R275): 要求した鍵の照合 —— 結果に無い鍵は SKIP(SKIP/RETIRED の行が名指す)か未実行(FAIL として数える)。空の結果で ALL PASS にしない
const QAPART_REQUESTED = ${JSON.stringify(o.ids)};
const __qc = __qapartLib.classifyRequested(QAPART_REQUESTED, results, __qapartSkips, { errors: __qapartErrors, strictSkip: ${o.strictSkip ? 'true' : 'false'} });
for (const r of __qc.rows) if (r.state === 'NOTRUN') console.log('FAIL ' + r.id + '  未実行 —— Requested QA did not execute in qapart(結果の行も SKIP の行も無い)');
console.log('# qapart-summary ' + JSON.stringify({ version: __qc.version, counts: __qc.counts, extra: __qc.extra, errors: __qc.errors, rc: __qc.rc, skip: __qc.rows.filter((r) => r.state === 'SKIP').map((r) => r.id), notRun: __qc.rows.filter((r) => r.state === 'NOTRUN').map((r) => r.id), fail: __qc.rows.filter((r) => r.state === 'FAIL').map((r) => r.id) }));
console.log(\`\\n\${__qc.label} (\${results.filter((r) => r.pass).length}/\${results.length}) —— \${__qapartLib.summaryText(__qc)}\`);
process.exit(__qc.rc);
`;
}
if (!BATCH) {
  const { merged, src } = sourceOf(IDS);
  const tmp = path.join(EMIT || fs.mkdtempSync(path.join(os.tmpdir(), 'w258c-qapart-')), 'run.mjs');
  if (EMIT) fs.mkdirSync(EMIT, { recursive: true });
  fs.writeFileSync(tmp, src);
  console.log(`# 切り出し: ${IDS.join(' / ')}  (${merged.map(([a, b]) => `${a}-${b}`).join(',')} 行)`);
  if (EMIT) { console.log('# --emit: ' + tmp + '(走らせない)'); process.exit(0); }
  // 第323便a: 走行の本文が範囲の包みの外で落ちた(前文・構文)ときも、要求した鍵の分類を出して終了コード 1(落ちた時点までの結果は globalThis.__qapartState)
  try { await import(pathToFileURL(tmp).href); }
  catch (e) {
    const st = globalThis.__qapartState || { results: [], skips: [], errors: [] };
    const c = QP.classifyRequested(IDS, st.results, st.skips, { errors: st.errors.concat([{ span: 'run.mjs', message: String((e && e.message) || e) }]), strictSkip: STRICT_SKIP });
    for (const r of c.rows) if (r.state === 'NOTRUN') console.log('FAIL ' + r.id + '  未実行 —— Requested QA did not execute in qapart(走行の本文が落ちた)');
    console.log('# qapart(第323便a): 走行の本文が落ちた —— ' + String((e && e.stack) || e).split('\n').slice(0, 4).join(' | '));
    console.log(`\nFAILED (${st.results.filter((r) => r.pass).length}/${st.results.length}) —— ${QP.summaryText(c)}`);
    process.exit(1);
  }
} else {
  // 第322便d: 束ごとに子の Node(と、その中の Chromium)を作り直す
  const keyed = IDS.map((id) => ({ id, span: SP.spanOf(id) }));
  const batches = QP.batchKeys(keyed, BATCH);
  const dir = EMIT || fs.mkdtempSync(path.join(os.tmpdir(), 'w258c-qapart-'));
  if (EMIT) fs.mkdirSync(EMIT, { recursive: true });
  console.log(`# --batch ${BATCH}: 鍵 ${IDS.length} 本を ${batches.length} 束に(束ごとに子の Node と Chromium を作り直す)`);
  // 第323便a: 束の要約は子の `# qapart-summary {…}` の行(要求した鍵の PASS・FAIL・SKIP・未実行)を足す。行が無い束(子が落ちた)は要求した鍵を全部未実行に数える
  const sum = { pass: 0, fail: 0, bad: [], counts: { pass: 0, fail: 0, skip: 0, notRun: 0 }, extra: { pass: 0, fail: 0 }, errors: 0 };
  for (let k = 0; k < batches.length; k++) {
    const { merged, src } = sourceOf(batches[k]);
    const tmp = path.join(dir, `run-${k + 1}.mjs`);
    fs.writeFileSync(tmp, src);
    console.log(`# 束 ${k + 1}/${batches.length}: ${batches[k].join(' / ')}  (${merged.map(([a, b]) => `${a}-${b}`).join(',')} 行)`);
    if (EMIT) continue;
    const t0 = Date.now();
    const r = await new Promise((resolve) => {
      const ch = spawn(process.execPath, [tmp], { cwd: ROOT, env: process.env, stdio: ['ignore', 'pipe', 'pipe'] });
      let np = 0, nf = 0, buf = '', summary = null;
      const line = (l) => { if (/^PASS /.test(l)) np++; else if (/^FAIL /.test(l)) nf++; else if (l.startsWith('# qapart-summary ')) { try { summary = JSON.parse(l.slice('# qapart-summary '.length)); } catch { summary = null; } } };
      ch.stdout.on('data', (d) => { process.stdout.write(d); buf += d.toString(); const ls = buf.split('\n'); buf = ls.pop(); ls.forEach(line); });
      ch.stderr.on('data', (d) => process.stderr.write(d));
      ch.on('close', (rc, sig) => { if (buf) line(buf); resolve({ rc, sig, np, nf, summary }); });
    });
    sum.pass += r.np; sum.fail += r.nf;
    const cs = r.summary ? r.summary.counts : { pass: 0, fail: 0, skip: 0, notRun: batches[k].length };
    for (const kk of Object.keys(sum.counts)) sum.counts[kk] += cs[kk] || 0;
    if (r.summary) { sum.extra.pass += r.summary.extra.pass; sum.extra.fail += r.summary.extra.fail; sum.errors += r.summary.errors; }
    if (r.rc !== 0 || r.nf || !r.summary) sum.bad.push(`束 ${k + 1}(rc ${r.rc === null ? r.sig : r.rc}・FAIL ${r.nf}${r.summary ? '' : '・要約の行なし'})`);
    console.log(`# 束 ${k + 1}/${batches.length} の終わり: PASS ${cs.pass}・FAIL ${cs.fail}・SKIP ${cs.skip}・未実行 ${cs.notRun}(add の行 PASS ${r.np}・FAIL ${r.nf})・rc ${r.rc === null ? r.sig : r.rc}(${((Date.now() - t0) / 1000).toFixed(1)} s)`);
  }
  if (EMIT) { console.log('# --emit: ' + dir + '(走らせない)'); process.exit(0); }
  const c = sum.counts;
  const strictBad = STRICT_SKIP && c.skip > 0;
  const label = sum.bad.length ? 'FAILED' : strictBad ? 'FAILED(--strict-skip: SKIP あり)' : (c.skip > 0 && c.pass === 0 ? 'SKIP ONLY(走った鍵 0 —— PASS に数えない)' : c.skip > 0 ? 'PASS(SKIP は PASS に数えない)' : 'ALL PASS');
  console.log(`\n# --batch ${BATCH}: ${label} —— 束 ${batches.length}・要求した鍵 ${IDS.length}: PASS ${c.pass}・FAIL ${c.fail}・SKIP ${c.skip}・未実行 ${c.notRun}`
    + `(同じ範囲の他の鍵 PASS ${sum.extra.pass}・FAIL ${sum.extra.fail}${sum.errors ? '・範囲の例外 ' + sum.errors : ''})${sum.bad.length ? '・' + sum.bad.join(' / ') : ''}`);
  process.exit(sum.bad.length || strictBad ? 1 : 0);
}
