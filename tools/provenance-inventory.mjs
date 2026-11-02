#!/usr/bin/env node
// 第323便d(決断事項 AN428 ①・統括の検証項目 R278): **来歴の語が量の名と世代の印に残る箇所の一覧**を機械で作る道具(読むだけ —— 何も書き換えない)。
//
//   node tools/provenance-inventory.mjs [--html beta/index.html] [--json <出力>] [--md]
//
// ① html を Node の主コンテキストで読み(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— 物理は走らせない)、
//    内蔵の全本の obsCard の行名(ja/en)・フィットの記録の文・退役の理由から、来歴の語(html 自身の判定 PROV_TEXT_CLEAN.PROV_TEST)を含む文字列を数える。
// ② 行名(ja)ごとに、読む側のファイル(器・lib・道具・データ・凍結の写し・QA・html)の完全一致と部分一致の鍵を数える(tests/lib-w323d-provinv.mjs)。
// ③ 行の id の表(tests/lib-w323d-rowids.mjs の LEGACY_ROW_IDS)が一覧の行名を全部覆うか・表に一覧の外の名が無いかを照合する。
// 終了コード: 表が一覧を覆わなければ 1(QA lint.provenanceIds323 と同じ照合)。
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const opt = (k) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : null; };
const HTML = opt('--html') || 'beta/index.html';
const JSON_OUT = opt('--json');
const MD = argv.includes('--md');

const { loadHtmlMain } = await import(pathToFileURL(path.join(ROOT, 'tests', 'lib-w280b-emgrid.mjs')).href);
const INV = await import(pathToFileURL(path.join(ROOT, 'tests', 'lib-w323d-provinv.mjs')).href);
const RID = await import(pathToFileURL(path.join(ROOT, 'tests', 'lib-w323d-rowids.mjs')).href);
const cwd0 = process.cwd();
process.chdir(ROOT);
const { HP } = loadHtmlMain(HTML);
process.chdir(cwd0);
const PT = vm.runInThisContext('PROV_TEXT_CLEAN');
const RETIRED = vm.runInThisContext('RETIRED_PRESETS');
const test = (s) => typeof s === 'string' && PT.PROV_TEST.test(s);
const clean = (s) => HP.provTextClean(s);

const items = INV.inventoryData({ presets: HP.allPresets(), retired: RETIRED, test, clean });
const qja = items.filter((z) => z.kind === 'obsCardQ');
const names = [...new Set(qja.map((z) => z.text))];
const defs = new Map(); for (const z of qja) defs.set(z.text, (defs.get(z.text) || 0) + 1);
// en の行名も html の中で定義として 1 回ずつ出る(読み手ではない)
// 互換の表そのもの(本便の lib と道具)は読み手に数えない
const SELF = new Set(['tests/lib-w323d-rowids.mjs', 'tests/lib-w323d-provinv.mjs', 'tools/provenance-inventory.mjs']);
const files = INV.readerFiles(ROOT, { withCanon: true, exclude: SELF });
const readers = INV.scanReaders({ root: ROOT, names, files, test, clean, defsInHtml: defs });
const summary = INV.summarizeInventory(items, readers);

// ③ 表の被覆
const cover = qja.map((z) => ({ preset: z.preset, name: z.text, rowId: RID.legacyRowIdOf(z.preset, z.text) }));
const uncovered = cover.filter((z) => !z.rowId);
const invKeys = new Set(qja.map((z) => z.preset + '\u0000' + z.text));
const enKeys = new Set(items.filter((z) => z.kind === 'obsCardQEn').map((z) => z.preset + '\u0000' + z.text));
const extra = [];
for (const e of RID.LEGACY_ROW_IDS) {
  // 表の別名のうち、今の html の行名でも過去の改名の前の名でもない(= 一覧に無い)名。過去の名は改名の表 tests/data-w289b-condrows.json にあれば可
  const cond = (() => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, 'tests', 'data-w289b-condrows.json'), 'utf8')); } catch (er) { return null; } })();
  const before = new Set(((cond && cond.rows) || []).filter((r) => r.id === e.preset).map((r) => r.qBefore));
  for (const n of e.ja) if (!invKeys.has(e.preset + '\u0000' + n) && !before.has(n)) extra.push({ preset: e.preset, rowId: e.rowId, name: n });
  for (const n of e.en) if (!enKeys.has(e.preset + '\u0000' + n)) extra.push({ preset: e.preset, rowId: e.rowId, name: n, lang: 'en' });
}
const enUncovered = items.filter((z) => z.kind === 'obsCardQEn').filter((z) => !RID.LEGACY_ROW_IDS.some((e) => e.preset === z.preset && e.en.includes(z.text)));

const perName = names.map((n) => {
  const r = readers.get(n);
  const kinds = {};
  for (const z of r.exact) kinds[z.kind] = (kinds[z.kind] || 0) + z.n;
  const frag = {};
  for (const z of r.fragment) (frag[z.kind] = frag[z.kind] || new Set()).add(z.literal);
  const htmlWhere = {};
  for (const z of r.exact) if (z.where) for (const [k, v] of Object.entries(z.where)) htmlWhere[k] = (htmlWhere[k] || 0) + v;
  return { name: n, presets: qja.filter((z) => z.text === n).map((z) => z.preset), exact: kinds, htmlWhere,
    exactFiles: r.exact.map((z) => z.file), fragments: Object.fromEntries(Object.entries(frag).map(([k, v]) => [k, [...v]])),
    fragmentFiles: [...new Set(r.fragment.map((z) => z.file))] };
});

const res = { version: INV.PROV_INV_VERSION, html: HTML, rowIdVersion: RID.ROW_ID_VERSION, summary, names: names.length,
  cover: { n: cover.length, uncovered, extra, enUncovered: enUncovered.map((z) => ({ preset: z.preset, name: z.text })) },
  perName, items };
if (JSON_OUT) fs.writeFileSync(path.resolve(JSON_OUT), JSON.stringify(res, null, 1));

const line = (k) => { const s = summary[k]; return `| ${k} | ${s.n} | ${s.presets} | ${s.calibration} | ${s.retired} |`; };
console.log(`# 来歴の語の一覧(${INV.PROV_INV_VERSION} —— ${HTML})`);
console.log('| 種類 | 文字列 | 本 | うち較正の分類 | うち退役 |'); console.log('|---|---|---|---|---|');
for (const k of INV.INV_KINDS) console.log(line(k));
console.log(`行名(ja)の異なり ${names.length}・表の被覆 ${cover.length - uncovered.length}/${cover.length}・表の外の別名 ${extra.length}・en の被覆の外 ${enUncovered.length}`);
const agg = {};
for (const z of perName) { for (const [k, v] of Object.entries(z.exact)) agg['exact:' + k] = (agg['exact:' + k] || 0) + v; for (const k of Object.keys(z.fragments)) agg['frag:' + k] = (agg['frag:' + k] || 0) + z.fragments[k].length; }
console.log('読む側(出現の和): ' + Object.entries(agg).map(([k, v]) => k + ' ' + v).join('・'));
console.log('読む側のファイル: ' + Object.entries(summary.readerFiles || {}).map(([k, v]) => `${k} ${v.length}`).join('・'));
if (MD) for (const z of perName) console.log(`| ${z.presets.join('・')} | ${z.name} | ${Object.entries(z.exact).map(([k, v]) => k + ' ' + v).join('・') || '—'} | ${Object.entries(z.htmlWhere).map(([k, v]) => k + ' ' + v).join('・') || '—'} | ${Object.entries(z.fragments).map(([k, v]) => k + ' ' + v.length).join('・') || '—'} | ${z.fragmentFiles.join(' ') || '—'} |`);
const hw = {}; for (const z of perName) for (const [k, v] of Object.entries(z.htmlWhere)) hw[k] = (hw[k] || 0) + v;
console.log('html の読み手(最上位の宣言ごとの出現の和): ' + (Object.entries(hw).map(([k, v]) => k + ' ' + v).join('・') || '—'));
const cw = {}; for (const z of perName) for (const f of z.exactFiles) if (f.startsWith('tests/out/')) cw[f] = (cw[f] || 0) + 1;
console.log('正本(行名を写す —— 名の数): ' + (Object.entries(cw).map(([k, v]) => k.replace('tests/out/', '') + ' ' + v).join('・') || '—'));
if (uncovered.length) console.log('表が覆わない: ' + uncovered.map((z) => z.preset + ' ' + z.name).join(' / '));
process.exit(uncovered.length || extra.length ? 1 : 0);
