#!/usr/bin/env node
// 第338便c(統括の検証項目 R351 —— 運用の正本の教訓「既存の QA の行を一括置換で書き換えない」): **既存の QA の鍵のブロックの書き換えを拾う道具**(走らせない・ファイルを書かない —— --json だけ)。
//   基点の rev の tests/qa.mjs と今の作業ツリーの tests/qa.mjs を、鍵(`add('<鍵>'` —— コメントの行は数えない)ごとに、その鍵を含む最上位の文(tests/lib-w279b-qaorder.mjs の splitTopLevel)
//   の本文で比べる。本文が 1 字でも違う既存の鍵(基点に在った鍵)を「書き換えた鍵」として、消えた行(−)と足した行(+)の数・同じ最上位の文に入っている鍵の数とともに出す。
//   新設の鍵・消えた鍵は別に数える。統括が統合のたびに回す(今まで `git diff | grep '^-'` を手で読んでいた分)。
// 使い方: node tools/qa-touched338c.mjs --touched <基点の rev> [--json <file>]   /   --self-test(QA lint.qaTouched338c と同じ関数)
//   終了コード: 0(書き換えた既存の鍵が無い)/ 1(ある —— 一覧を読む。意図した直しなら報告に理由を 1 行ずつ)/ 2(読めない)
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2), getArg = (k) => { const i = argv.indexOf(k); return i >= 0 && argv[i + 1] ? argv[i + 1] : null; };
const QO = await import(pathToFileURL(path.join(ROOT, 'tests', 'lib-w279b-qaorder.mjs')).href);
const T338 = await import(pathToFileURL(path.join(ROOT, 'tests', 'lib-w338c-tools.mjs')).href);
if (argv.includes('--self-test')) {
  const r = T338.qaTouchedSelfTest338c(QO.splitTopLevel);
  for (const [k, v] of Object.entries(r.gates)) console.log(`  ${v ? 'ok' : 'NG'}  ${k}`);
  console.log(`qa-touched338c --self-test(${r.version}): ${r.ok ? 'OK' : 'NG'}`);
  process.exit(r.ok ? 0 : 1);
}
const rev = getArg('--touched');
if (!rev) { console.log('使い方: --touched <基点の rev> [--json <file>] / --self-test'); process.exit(2); }
let base = null; try { base = execFileSync('git', ['-C', ROOT, 'show', rev + ':tests/qa.mjs'], { encoding: 'utf8', maxBuffer: 512 << 20 }); } catch { console.error('基点の rev の tests/qa.mjs が読めない: ' + rev); process.exit(2); }
const head = fs.readFileSync(path.join(ROOT, 'tests', 'qa.mjs'), 'utf8');
const r = T338.touchedKeys338c(base, head, QO.splitTopLevel);
const minus = r.touched.reduce((s, z) => s + z.minus, 0);
console.log(`qa-touched338c --touched ${rev}(${T338.LIB_VERSION}): 書き換えた既存の鍵 ${r.touched.length}(消えた行 ${minus} —— 同じ文の鍵は同じ差を数える)・新設 ${r.added.length}・消えた鍵 ${r.removed.length}・同じ ${r.same}`);
for (const z of r.touched) console.log(`  書き換え ${z.key.padEnd(36)} − ${String(z.minus).padStart(3)} / + ${String(z.plus).padStart(3)}  行 ${z.line}${z.shared > 1 ? '(同じ最上位の文に ' + z.shared + ' 鍵)' : ''}${z.approx ? '(大きい文 —— 粗い数)' : ''}`);
if (r.removed.length) console.log('  消えた鍵: ' + r.removed.join(' '));
if (r.added.length) console.log('  新設: ' + r.added.join(' '));
const js = getArg('--json'); if (js) fs.writeFileSync(path.resolve(js), JSON.stringify(Object.assign({ version: T338.LIB_VERSION, rev }, r), null, 1) + '\n');
process.exit(r.touched.length ? 1 : 0);
