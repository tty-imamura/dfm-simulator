#!/usr/bin/env node
// 第310便c(統括の検証項目 R224・運用の正本 追記 28 ⑩): **QA の heap —— headless の写しをブロックの後で手放す**。
//
// ■ 何が起きていたか(実測 —— 第310便c の枝)
//   tests/qa.mjs は最上位の待ち(top-level await)のある ES module で、本文は 1 つの大きな非同期の関数として走る。
//   最上位の `{ … }` ブロックの中の局所の値(`const H = loadHtmlHeadless(…)`・`const HP = H.HP` ほか)は、ブロックを抜けても
//   **その関数の保存された状態に残り**(待ちのたびに保存される局所の欄 —— 同じ欄を後のブロックが使い回さない)、対象の html を
//   Node の vm で読んだ写し(写しの中の本・状態・走行の配列のすべて)が QA の最後まで手放されない。
//   最小の写し(3 ブロック)で確かめた: `{ const H = loadHtmlHeadless(…); … }` を 3 つ並べると gc の後も vm が 3 つとも生きている・
//   同じ本文を `await (async () => { … })();` で包むと関数を抜けた時点で手放される。
//   tests/qa.mjs の headless のブロック 24 本を部分実行(tests/exp-w258c-qapart.mjs)で走らせると、作った vm 24 個が終わりまで
//   全部生きていた(gc の後の heapUsed 559 MB)。第309便の CI で beta のフル QA が heap の上限 4 GB で落ちた型の主な寄与と読む。
//
// ■ 処置(**本文は 1 字も変えない** —— 試験の挙動・順・件数・判定は同じ)
//   headless の写しを作る最上位のブロック(`loadHtmlHeadless(` か `vm.createContext(` を含む `{` 〜 `}` —— 列 0)の中身を
//     {
//       await (async () => {   // 第310便c(heap): …
//       …(本文はそのまま)…
//       })();   // 第310便c(heap)
//     }
//   で包む。包みの行は 2 字下げ(列 0 の `{`・`}` で文を切り出す tests/exp-w258c-qapart.mjs・tests/lib-w279b-qaorder.mjs の
//   splitTopLevel はそのまま働く)。ブロックの中の `var`・ラベル・return は使っていない(包む前に確かめる —— あれば包まない)。
//
// ■ 使い方
//   node tools/qa-heap-wrap.mjs            … 確かめるだけ(包みの無い headless のブロックの数と行 —— 1 本でもあれば rc 1)
//   node tools/qa-heap-wrap.mjs --apply    … 包みの無いブロックを包む(tests/qa.mjs を書き換える)
//   QA `lint.qaHeapRelease310` が同じ関数(`heapWrapAudit`)で包みの無いブロックを数える(新しい headless のブロックを足したら
//   `--apply` を 1 回 —— 統合の後も同じ)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const HEAP_WRAP_VERSION = 'w310c-heapwrap-1';
export const WRAP_OPEN = '  await (async () => {   // 第310便c(heap): 本文を関数で包む —— 抜けたら headless の写しを手放す(本文は不変)';
export const WRAP_CLOSE = '  })();   // 第310便c(heap)';
const HEADLESS_RE = /loadHtmlHeadless\(|vm\.createContext\(/;

/** 最上位の `{` 〜 `}`(列 0)のブロックの範囲(0 始まりの行番号 [l0, l1])。 */
export function topBlocks(lines) {
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trimEnd() !== '{') continue;
    let j = i + 1;
    for (; j < lines.length; j++) if (lines[j].trimEnd() === '}') break;
    if (j < lines.length) { out.push([i, j]); i = j; }
  }
  return out;
}

/** headless の写しを作るブロック(注釈の行は除いて見る)と、包みの有無・包めない理由。 */
export function heapWrapAudit(src) {
  const lines = src.split('\n');
  const rows = [];
  for (const [l0, l1] of topBlocks(lines)) {
    const body = lines.slice(l0 + 1, l1);
    const code = body.filter((l) => !/^\s*\/\//.test(l));
    if (!code.some((l) => HEADLESS_RE.test(l))) continue;
    const wrapped = body.length >= 2 && body[0] === WRAP_OPEN && body[body.length - 1] === WRAP_CLOSE;
    const ids = [...body.join('\n').matchAll(/add\('([^']+)'/g)].map((m) => m[1]);
    // 包めない形: 本文の最上位の var(関数の外へ漏れていた宣言)・ラベル文
    const flat = code.map((l) => l.replace(/'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`/g, "''").replace(/\/\/.*$/, ''));
    const why = [];
    if (flat.some((l) => /^ {2}var\s/.test(l))) why.push('最上位の var');
    if (flat.some((l) => /^ {2}[A-Za-z_$][\w$]*:\s*(for|while|do|\{)\s*/.test(l) && !/^ {2}default:/.test(l))) why.push('ラベル文');
    rows.push({ l0: l0 + 1, l1: l1 + 1, id: ids[0] || null, n: ids.length, wrapped, why });
  }
  const unwrapped = rows.filter((r) => !r.wrapped);
  return { version: HEAP_WRAP_VERSION, blocks: rows.length, wrapped: rows.length - unwrapped.length, unwrapped, rows,
    ok: unwrapped.length === 0 };
}

/** 包みの無いブロックを包んだ本文(包めない形のブロックは残す —— skipped)。 */
export function heapWrapApply(src) {
  const a = heapWrapAudit(src);
  const lines = src.split('\n');
  const todo = a.unwrapped.filter((r) => !r.why.length).sort((x, y) => y.l0 - x.l0);
  for (const r of todo) {
    lines.splice(r.l1 - 1, 0, WRAP_CLOSE);   // 列 0 の `}` の直前
    lines.splice(r.l0, 0, WRAP_OPEN);        // 列 0 の `{` の直後
  }
  return { src: lines.join('\n'), applied: todo.map((r) => r.l0), skipped: a.unwrapped.filter((r) => r.why.length) };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const QA = path.join(ROOT, 'tests', 'qa.mjs');
  const src = fs.readFileSync(QA, 'utf8');
  if (process.argv.includes('--apply')) {
    const r = heapWrapApply(src);
    if (r.applied.length) fs.writeFileSync(QA, r.src);
    const after = heapWrapAudit(r.src);
    console.log(JSON.stringify({ applied: r.applied.length, skipped: r.skipped.map((z) => z.l0 + ':' + z.why.join('+')), blocks: after.blocks, wrapped: after.wrapped, ok: after.ok }));
    process.exit(after.ok ? 0 : 1);
  }
  const a = heapWrapAudit(src);
  console.log(JSON.stringify({ version: a.version, blocks: a.blocks, wrapped: a.wrapped,
    unwrapped: a.unwrapped.map((r) => r.l0 + ':' + (r.id || '?') + (r.why.length ? '(' + r.why.join('+') + ')' : '')), ok: a.ok }));
  process.exit(a.ok ? 0 : 1);
}
