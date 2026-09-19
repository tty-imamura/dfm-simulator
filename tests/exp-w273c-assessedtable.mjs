// 第273便c(第63報・統括の検証項目 AG24): **正式判定値の side table を機械生成する器**。
//
// ■ 何をするか(**エンジンを 1 步も走らせない** —— 判定器の正本を読んで beta の表を埋めるだけ)
//   ① `tests/out/calaudit-w249.json` から、**σ が接続している量**(`gate.sigma > 0`)の
//      判定段の値(`gate.assessedValue`)・判定段(`gate.assessedStage`)・σ 倍(`gate.nSigma`)・
//      門の状態(`gate.status`)・単位を読む。**この器は数を 1 つも作らない**(転記だけ)。
//   ② `beta/index.html` をブラウザで開き、対象 preset の `presetSigHash` を読む
//      (= **正本が測ったときの入力の署名**。表示のときに食い違えば数を出さないための鍵)。
//   ③ beta/index.html のマーカー
//        // >>> w273c-assessed-table … // <<< w273c-assessed-table
//      の間を**書き換える**(手で打った数字は 1 つも無い)。`ASSESSED_CANON` の
//      `wave` / `generatedAt` / `targetSha256` も正本の meta から埋める。
//   ④ 機械可読の控え `tests/out/assessed-w273c.json` を書く(QA が読む正本は calaudit 側である ——
//      この控えは「何を転記したか」の来歴である)。
//
// ■ この器が言わないこと
//   「合った」「判定が増えた」「較正した」。**正本の転記**であって、判定はしていない。
//
// ■ 刻印の限界(**刻印は「現行 html の hash」にも「現行正本の刻印」にも構造的にできない**)
//   この器は「正本が測った html の SHA-256」を表へ刻む。ところが**刻めばその html の hash が動く**。
//   動いた html で判定器を回し直せば**正本の刻印もまた動く** —— **不動点が無い**ので、
//   「刻印 = 正本の刻印」を要求する検査はどう回しても落ち続ける。**要求してはならない。**
//   刻印が言えるのは「**どの走行の正本から転記したか**」までである。
//   **鮮度の線は 2 段の鎖**で見る:
//     ① **表 ↔ 正本**(1 行ずつ。この器の `--check` と QA `ui.assessedValuePanel` ①)
//     ② **正本 ↔ 現行 html**(正本の `meta.targetSha256` = 現行 html の SHA-256。
//        既存の QA `lint.calauditMergeKeyHash` ① が見ている)
//   ①②が同時に立っていれば表は現行 html の正本の転記である。**エンジン(`S._core` 等)だけが
//   変わった場合も②が落ちるので捕まる**(捕まらないのは**ページの実行時**だけ ——
//   ページは自分自身の SHA-256 を確かめられないため)。
//   したがって html を書き換えたら判定器を回し直す必要があるのは**②を立て直すため**であって、
//   刻印を揃えるためではない(揃わない)。
//
// ■ 順番(実務)
//   1. beta/index.html を**確定**させる → 2. 判定器を回す(通常走行 + `--merge`)→
//   3. この器を `--check` で回して**値の表**が正本と一致することを見る
//      (一致しなければ `--check` 無しで回して書き換え、**2 に戻る**)。
//   3 で書き換えが起きなければ②も立っているので、そこで止まる。
//
// 実行: PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright node tests/exp-w273c-assessedtable.mjs
//       --check … 書き換えず、いまの表が正本と一致するかだけを見る(終了コードで返す)
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CAL = path.join(ROOT, 'tests', 'out', 'calaudit-w249.json');
const HTML = path.join(ROOT, 'beta', 'index.html');
const OUT = path.join(ROOT, 'tests', 'out', 'assessed-w273c.json');
const CHECK = process.argv.includes('--check');
const BEGIN = '// >>> w273c-assessed-table';
const END = '// <<< w273c-assessed-table';

const cal = JSON.parse(fs.readFileSync(CAL, 'utf8'));
// **有効数字は固定**(12 桁)。丸めた数を新しい数として扱わないため、桁数を規約として書いておく。
const SIG_DIGITS = 12;
const num = (x) => (Number.isFinite(x) ? Number(x.toPrecision(SIG_DIGITS)) : null);

const table = {};
for (const p of (cal.presets || [])) {
  const rows = [];
  for (const q of (p.quantities || [])) {
    const g = q.gate || {};
    if (!(Number.isFinite(g.sigma) && g.sigma > 0)) continue;   // σ が無い量は転記しない
    const v = Number.isFinite(g.assessedValue) ? g.assessedValue : q.meas;
    if (!Number.isFinite(v)) continue;
    rows.push({ t: q.target || null, k: q.kind || null, n: String(q.name || ''),
      st: g.assessedStage || 'h', v: num(v), u: q.unit || null,
      ns: Number.isFinite(g.nSigma) ? num(g.nSigma) : null, g: g.status || null });
  }
  if (rows.length) table[p.id] = rows;
}
const ids = Object.keys(table);

// ---------------------------------------------------------------- presetSigHash をページから読む
const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let browser;
try { browser = await req('playwright').chromium.launch(); }
catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }
const page = await browser.newPage();
const pageErrors = [];
page.on('pageerror', (e) => pageErrors.push(String(e.message || e)));
await page.goto('file://' + HTML, { waitUntil: 'load' });
await page.waitForFunction(() => window.HP && HP.sim && HP.currentPreset());
const sigs = await page.evaluate((wanted) => {
  const out = {};
  for (const p of HP.allPresets()) if (wanted.indexOf(p.id) >= 0) out[p.id] = HP.presetSigHash(p);
  return out;
}, ids);
await page.close();
await browser.close();

const missingSig = ids.filter((id) => !sigs[id]);
if (missingSig.length) {
  console.error('[w273c-assessed] 署名が読めない preset: ' + missingSig.join(','));
  process.exit(2);
}

// ---------------------------------------------------------------- 表の JS を組む
const j = (x) => JSON.stringify(x);
const lines = [];
lines.push('const ASSESSED_SIG={' + ids.map((id) => j(id) + ':' + j(sigs[id])).join(',') + '};');
lines.push('const ASSESSED_VALUES={');
ids.forEach((id, i) => {
  lines.push('  ' + j(id) + ':[' + table[id].map((r) =>
    '{t:' + j(r.t) + ',k:' + j(r.k) + ',n:' + j(r.n) + ',st:' + j(r.st)
    + ',v:' + j(r.v) + ',u:' + j(r.u) + ',ns:' + j(r.ns) + ',g:' + j(r.g) + '}').join(',')
    + ']' + (i === ids.length - 1 ? '' : ','));
});
lines.push('};');
const block = lines.join('\n');

const html = fs.readFileSync(HTML, 'utf8');
const i0 = html.indexOf(BEGIN), i1 = html.indexOf(END);
if (i0 < 0 || i1 < 0 || i1 < i0) { console.error('[w273c-assessed] マーカーが無い'); process.exit(2); }
const head = html.slice(0, i0 + BEGIN.length);
const tail = html.slice(i1);
const meta = cal.meta || {};
const withTable = head + '\n' + block + '\n' + tail;
// **値の表**が動いたか(= 転記が正本と食い違っているか)。これが `--check` の裁定対象である。
const valuesChanged = (withTable !== html);
// `ASSESSED_CANON` の 3 欄(正本の来歴)も同じ器で埋める(手で打たない)。
// **構造的に一致させられない欄がある** —— 下の「刻印の限界」を読むこと。
let next = withTable.replace(
  /const ASSESSED_CANON=\{file:"tests\/out\/calaudit-w249\.json", wave:[^,]+, generatedAt:[^,]+,\n  targetSha256:[^,]+,/,
  'const ASSESSED_CANON={file:"tests/out/calaudit-w249.json", wave:' + j(meta.wave || null)
    + ', generatedAt:' + j(meta.when || null) + ',\n  targetSha256:' + j(meta.targetSha256 || null) + ',');
const stampChanged = (next !== withTable);
const changed = (next !== html);
if (!CHECK && changed) fs.writeFileSync(HTML, next);

const outJson = {
  when: new Date().toISOString(), wave: '第273便c(第63報・AG24)',
  harness: 'tests/exp-w273c-assessedtable.mjs',
  input: { calaudit: 'tests/out/calaudit-w249.json',
    calauditSha256: crypto.createHash('sha256').update(fs.readFileSync(CAL)).digest('hex'),
    canonicalTarget: meta.target || null, canonicalTargetSha256: meta.targetSha256 || null,
    canonicalWave: meta.wave || null, canonicalWhen: meta.when || null },
  stamp: { inHtml: (html.match(/\n  targetSha256:"([0-9a-f]{64})",/) || [])[1] || null,
    inCanonicalNow: meta.targetSha256 || null, stampChanged, valuesChanged,
    rule: '**刻印は構造的に「現行 html の hash」にも「現行正本の刻印」にもできない** —— '
      + '刻印を html へ書けばその html の hash が動き、動いた html で判定器を回し直せば'
      + '正本の刻印もまた動く(不動点が無い)。したがって刻印が言えるのは'
      + '「**どの走行の正本から転記したか**」までである。'
      + '鮮度の線は **① 表 ↔ 正本(1 行ずつ)** と **② 正本 ↔ 現行 html**'
      + '(`lint.calauditMergeKeyHash` が見ている `meta.targetSha256` = 現行 html の SHA-256)'
      + 'の **2 段の鎖**で、この鎖は**エンジンだけが変わった場合も捕まえる**'
      + '(html が動けば ② が落ちる)。**ページの実行時**は自分の hash を確かめられないので、'
      + '渡された `targetSha256` の線だけが効く。' },
  sigDigits: SIG_DIGITS, presets: ids.length,
  rows: ids.reduce((a, id) => a + table[id].length, 0),
  sig: sigs, values: table,
  rule: '**σ が接続している量だけ**を転記する(`gate.sigma > 0`)。値は `gate.assessedValue`'
    + '(判定段の値)で、**h 段の静的な obsCard 文面とは別の欄**である。'
    + '**判定はしない** —— 正本の転記である。',
  doNotWrite: ['合った', '判定が増えた', '較正した'],
  pageErrors,
};
fs.writeFileSync(OUT, JSON.stringify(outJson, null, 1));
console.log('[w273c-assessed] ' + ids.length + ' preset / ' + outJson.rows + ' 行を'
  + (CHECK ? '照合' : '転記') + '(正本 ' + String(meta.targetSha256 || '—').slice(0, 12) + '…)'
  + (valuesChanged ? ' / **値の表が正本と食い違う**' + (CHECK ? '(走らせ直すこと)' : ' → 書き換えた')
    : ' / 値の表は正本と一致')
  + (stampChanged ? ' / 刻印は正本の刻印と違う(**構造的にそうなる** —— 刻めば html の hash が'
    + '動き、動いた html で回し直せば正本の刻印も動く。鮮度は「表 ↔ 正本」と「正本 ↔ 現行 html」'
    + 'の 2 段で見る)' : ' / 刻印も一致'));
// **裁定は値の表だけ**で行う。刻印の不一致で落とすと、どう回しても落ち続ける(不動点が無い)。
process.exit((CHECK && valuesChanged) ? 1 : 0);
