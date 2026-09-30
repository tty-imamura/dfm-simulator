#!/usr/bin/env node
// 第288便f(原仮定者の裁定(第78報)AN90・統括の検証項目 R118)— 再生成の鎖の**集約段**(表の段 'htmlagg')。
//
// 鎖の html を書く段(obscompare → samplestatus)は、鎖のランナーが `REGEN_HTML_STAGE=$REGEN_LOG/html` を入れたとき、
// beta の html を直に書かず領域 1 つぶんの断片(tests/lib-w288f-htmlstage.mjs の契約)を置く。この器が鎖の末尾で**1 回だけ**
// 断片を順に当てて html を置き換える(一時ファイル → rename)。断片が合わない(別の鎖の断片・途中で html が変わった)ときは
// **何も書かずに** rc 1 で止まる —— 中断した鎖の半分だけ新しい html を完成扱いしない。断片が無ければ何もしない(rc 0)。
//
// 使い方:
//   node tools/regen-html-aggregate.mjs [--html <対象 html(既定 $REGEN_HTML か beta の html)>] [--stage <断片の置き場(既定 $REGEN_HTML_STAGE)>] [--check]
//     --check … 書かずに、断片を当てた結果が合うか・何が変わるかだけを出す
// 標準出力に 1 行の JSON(版・当てた領域・書いたか・前後の sha256)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const HS = await import(pathToFileURL(path.join(ROOT, 'tests', 'lib-w288f-htmlstage.mjs')).href);
const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(k); return (i >= 0 && argv[i + 1]) ? argv[i + 1] : d; };
const DEFAULT_HTML = 'beta/index.html';
const html = path.resolve(arg('--html', process.env.REGEN_HTML || DEFAULT_HTML));
const stage = arg('--stage', process.env[HS.HTML_STAGE_ENV] || null);
if (!stage) { console.error('regen-html-aggregate: 断片の置き場が無い(--stage か ' + HS.HTML_STAGE_ENV + ')'); process.exit(2); }
const dir = path.resolve(stage);
if (!fs.existsSync(html)) { console.error('regen-html-aggregate: 対象 html が無い: ' + html); process.exit(2); }
if (!fs.existsSync(dir)) { console.log(JSON.stringify({ version: HS.HTML_STAGE_VERSION, ok: true, written: false, applied: [], note: '断片の置き場が無い(書く段が走っていない)' })); process.exit(0); }
if (argv.includes('--check')) {
  const text = fs.readFileSync(html, 'utf8');
  const c = HS.composeStaged(text, dir);
  console.log(JSON.stringify({ version: HS.HTML_STAGE_VERSION, check: true, ok: c.bad.length === 0, wouldWrite: c.text !== text, applied: c.applied, bad: c.bad }));
  process.exit(c.bad.length ? 1 : 0);
}
const r = HS.aggregateStaged(html, dir);
console.log(JSON.stringify(r));
process.exit(r.ok ? 0 : 1);
