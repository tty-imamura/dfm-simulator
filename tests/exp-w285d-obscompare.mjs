// 第285便d(原仮定者の裁定(第75報)⑦「観測値と実行結果の一致度を分かり易く比較可能なグラフ系の表示を用意する」・
// 統括の検証項目 R100)— **観測対実行のグラフの生成器**(第279便a の samplestatus と同じ規約の生成器)。
//
// ■ 何をするか(1 回の走行で 2 つを書く —— **エンジンを 1 步も走らせない**)
//   ① 判定器の正本 tests/out/calaudit-w249.json の量ごとの行(1 行 1 量)を tests/lib-w285d-obscompare.mjs の
//      `buildRows` で転記し、beta/index.html の生成領域 `// >>> w275a-generated: obs-compare` を**書き換える**
//      (手で打った数は無い。領域に時刻・sha を入れない —— 正本の**値**が変わったときだけ html が動く)。
//      枝 b の診断正本 tests/out/pn1-w285b.json が**あり** `obsCompareRows` を持つときだけ λ_PN=0 の対照の行を足す(無ければ描かない)。
//   ② 書き換えた html を Chromium で開き、ページが読む行が表と 1 行も違わないこと・パネルを開いた既定の表示の行数が
//      正本の量数と一致すること・退役の本(内蔵の familyRole:"retired")の行数を確かめる(食い違えば正本を書かずに終了コード 1)。
//   ③ 正本 tests/out/obscompare-w285d.json(来歴 w272e-1・領域 hash・入力の安定 hash)を書く。
//
// ■ この器がしないこと: 判定しない(合否は gate.status の転記)・観測との差を門にしない・古い verdict を転記しない・
//   鎖の外で他の生成領域(sample-status・assessed-table)を書かない。
//
// ■ 鎖の中の位置(tests/lib-w281a-regentable.mjs の段 'obscompare'): calaudit を書く段(calaudit・dt3・kf0)の後・
//   html を書くので単独(exclusive)・samplestatus の前(samplestatus は html 全体の後段 —— AN53)。
//
// 実行: PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright node tests/exp-w285d-obscompare.mjs
//       (--check を付けると何も書かずに照合だけする —— html の領域が正本から作った表と違えば 1)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp, stableInputs } from './lib-w281a-scope.mjs';
import * as L from './lib-w285d-obscompare.mjs';

// 領域 hash の宣言(第281便a): 較正母集団 37 本(退役の別は familyRole)と、行・差・絞り込み・描画の純関数と読み口 HP.obsCompare
//   (器が読む HP.currentPreset・HP.sim も —— lint.regenScope ② の下限。ocOpen は他のパネルの開閉関数を呼ばない)。

const REGEN_SCOPE = {"presets":["alphaCenAB","alphaCenABDFM","earthMoonReal","earthMoonRealKF1","emAuditDFM","emAuditSolar","gw150914","gw150914DFM","gw150914Merge4s","jupiterGalilean","marsMoonsReal","mercuryReal","mercuryRealKF1","neptuneReal","plutoCharonReal","psrB1534","psrB1534CF","psrB1534DFM","psrDoubleAB","psrDoubleABCF","psrDoubleABDFM","psrDoubleABPN","psrDoubleABSpinCal","psrJ1757CF","psrJ1757DFM","psrJ1757PN","psrJ1946CF","psrJ1946DFM","psrJ1946PN","saturnRingReal","saturnRingRealKF1","saturnZonalD68","siriusAB","siriusABDFM","solarInner","uranusReal","venusReal"],"roots":["HP.currentPreset","HP.obsCompare","HP.sim","OBS_COMPARE_CANON","OBS_COMPARE_REASONS","OBS_COMPARE_ROWS","OBS_COMPARE_SOURCES","obsCompareDiff","obsCompareHalf","obsCompareRetired","obsCompareRows","obsCompareSeriesOf","ocRender","retiredOf"],"core":false,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = 'beta/index.html';
const HTML = path.join(ROOT, TARGET);
const OUT = 'tests/out/obscompare-w285d.json';
const CODE = ['tests/exp-w285d-obscompare.mjs', 'tests/lib-w285d-obscompare.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
const CHECK = process.argv.includes('--check');
const t0 = Date.now();

const rd = (rel) => JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
const cal = rd(L.CAL_FILE);
const extraPresent = fs.existsSync(path.join(ROOT, L.EXTRA_FILE));
const extra = extraPresent ? rd(L.EXTRA_FILE) : null;
const built = L.buildRows(cal, extra);
if (built.errors.length) { console.error('正本の検査で止めた(何も書いていない):\n  ' + built.errors.join('\n  ')); process.exit(1); }
const region = L.renderRegion(built);
const sha = L.rowsSha256(built);

// ---- ① html の生成領域
const html0 = fs.readFileSync(HTML, 'utf8');
const html1 = L.spliceRegion(html0, region);
if (html1 === null) { console.error('html に生成領域 ' + L.REGION + ' が無い'); process.exit(1); }
const htmlChanged = html1 !== html0;
if (CHECK) {
  if (htmlChanged) { console.error('--check: html の生成領域 ' + L.REGION + ' が正本から作った表と違う(器を走らせ直すこと)'); process.exit(1); }
} else if (htmlChanged) fs.writeFileSync(HTML, html1);

// ---- ② ページで確かめる
const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let browser;
try { browser = await req('playwright').chromium.launch(); }
catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }
const page = await browser.newPage();
const errs = [];
page.on('pageerror', (e) => errs.push(String(e.message || e)));
await page.goto('file://' + HTML, { waitUntil: 'load' });
await page.waitForFunction(() => window.HP && HP.sim && HP.currentPreset());
const got = await page.evaluate(() => {
  const O = HP.obsCompare;
  if (!O) return null;
  O.show(true);
  const shown = document.querySelectorAll('#ocPanel .ocRow').length;
  const all = O.rows({ series: 'all', kind: 'all', retired: true, q: '' });
  const retiredIds = [...new Set(all.filter((x) => x.retired).map((x) => x.row.i))].sort();
  const noRetired = O.rows({ series: 'all', kind: 'all', retired: false, q: '' }).length;
  O.show(false);
  return { canon: O.canon, rows: O.all, reasons: O.reasons, sources: O.sources, shown, retiredIds,
    retiredRows: all.length - noRetired };
});
await browser.close();

const bad = [];
if (errs.length) bad.push('ページのエラー: ' + errs.slice(0, 3).join(' / '));
if (!got) bad.push('HP.obsCompare が無い');
else {
  if (JSON.stringify(got.rows) !== JSON.stringify(built.rows)) bad.push('ページの行が正本から作った表と違う');
  if (JSON.stringify(got.reasons) !== JSON.stringify(built.reasons)) bad.push('理由の辞書が違う');
  if (JSON.stringify(got.sources) !== JSON.stringify(built.sources)) bad.push('出典の辞書が違う');
  if (got.canon.rowsSha256 !== sha) bad.push('rowsSha256 が違う');
  if (got.shown !== built.counts.rows) bad.push(`既定の表示の行数 ${got.shown} ≠ 正本の量数 ${built.counts.rows}`);
}
if (bad.length) { console.error('ページの照合で止めた:\n  ' + bad.join('\n  ')); process.exit(1); }
if (CHECK) {
  console.log(`[w285d-obscompare] --check: 領域は正本と一致(${built.counts.rows} 行・${built.counts.presets} 本・退役 ${got.retiredIds.length} 本 ${got.retiredRows} 行)`);
  process.exit(0);
}

// ---- ③ 正本
const inputs = [L.CAL_FILE].concat(extraPresent ? [L.EXTRA_FILE] : []).concat([TARGET]);
const meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第285便d', target: TARGET, code: CODE, inputs }), {
  version: L.OBSCMP_VERSION, generator: 'tests/exp-w285d-obscompare.mjs', region: L.REGION,
  ruling: '原仮定者の裁定(第75報)⑦: 観測値と実行結果の一致度を分かり易く比較可能なグラフ系の表示を用意する',
  reading: '統括の検証項目 R100: 正本 calaudit-w249.json の量ごとの行を 1 行 1 量で描く(中心線=観測・±3σ 帯は σ のある量だけ・マーカー=実行値)。欠測は 0 に置換しない・帯内でも合格と書かない(合否は 3σ 門の正式判定のまま)・状態表とグラフの数字を二重管理しない',
  notClaim: ['観測一致を達成した', '較正を完了した', '判定が増えた', '帯の中なら合格'] });
Object.assign(meta, scopeStamp(HTML, REGEN_SCOPE), stableInputs(ROOT, meta.inputs));
const out = {
  meta,
  canon: { file: L.CAL_FILE, wave: (cal.meta || {}).wave || null, rows: built.counts.rows, presets: built.counts.presets, rowsSha256: sha, sigDigits: L.SIG_DIGITS },
  counts: built.counts,
  extra: built.extra,
  retired: { ids: got.retiredIds, rows: got.retiredRows, from: '内蔵の宣言 familyRole:"retired"(ページの retiredOf —— 正本に写さない)' },
  page: { shownDefault: got.shown, pageErrors: errs.length },
  htmlChanged,
  rule: '**転記だけ**(判定しない)。値は gate.assessedValue(判定段の値)・観測は quantities[].obs・σ は gate.sigma・合否語は gate.status。'
    + '欠測は null(0 に置換しない)。古い verdict は転記しない。帯は σ の目盛りであって門ではない。',
  doNotWrite: ['合った', '判定が増えた', '較正した', '帯の中なら合格'],
  elapsedS: (Date.now() - t0) / 1000,
};
fs.writeFileSync(path.join(ROOT, OUT), JSON.stringify(out, null, 1) + '\n');
console.log(`[w285d-obscompare] ${built.counts.rows} 行(${built.counts.presets} 本・両方あり ${built.counts.both}・σ あり ${built.counts.sigma})を`
  + (htmlChanged ? '転記した' : '照合した(html は不変)') + ` / 退役 ${got.retiredIds.length} 本 ${got.retiredRows} 行 / λ_PN=0 の対照 ${built.extra.rows} 行`
  + ` → ${OUT}(${out.elapsedS.toFixed(1)} s)`);
