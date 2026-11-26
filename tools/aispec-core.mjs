#!/usr/bin/env node
// 第355便h(統括の検証項目 R511・AI_SPEC §403): 仕様のページの頭だけの短いページ docs/AI_SPEC_CORE.md を、docs/AI_SPEC.md から機械で写す道具。
//   頭 = AI_SPEC.md の先頭から、日本語版の見出しの行「# 6. 日本語版」(/^#{1,2} 6\.[ \d]/ に当たる最初の行)の前まで
//   = §1 出力の使い分け〜§5 プリセットの仕様(逐語)。写しの頭に 2 行(このページは写しである・正本は AI_SPEC.md)と空行 1 つを置き、
//   その後ろは頭の字のまま(1 字も変えない)。対話の入口のページ(docs/AI_CHAT.md)とプロンプトが、この短いページを指す。
//
// 使い方:
//   node tools/aispec-core.mjs            写しが頭と同じかを確かめる(同じ 0・違う 1)
//   node tools/aispec-core.mjs --write    写しを作り直す(AI_SPEC.md の §1〜§5 を変えた後に回す)
// 守りの検査: QA docs.aichat355h ⑥(写しの 3 行目以降 = 頭)・⑧(6 万字より短い)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const CORE_TOOL_VERSION = 'w355h-aispec-core-1';
export const SPEC_REL = 'docs/AI_SPEC.md';
export const CORE_REL = 'docs/AI_SPEC_CORE.md';
export const HEADER_LINES = [
  '> **このページは写しです** —— `docs/AI_SPEC.md` の頭(先頭から「# 6. 日本語版」の前まで —— §1 出力の使い分け〜§5 プリセットの仕様)を、道具 `tools/aispec-core.mjs` で機械で写したものです。手で直さないでください。',
  '> **正本は [`AI_SPEC.md`](AI_SPEC.md) です**(§6 以降は日本語版と開発の記録)。This page is a machine copy of the head of `AI_SPEC.md` (up to, not including, "# 6."); the full page is the source of truth.',
];
export const CUT_RE = /^#{1,2} 6\.[ \d]/m;

// 頭(先頭から「# 6.」の行の前まで)。見つからなければ null
export function specHead(spec) {
  const m = CUT_RE.exec(String(spec));
  return m ? String(spec).slice(0, m.index) : null;
}
export function buildCore(spec) {
  const h = specHead(spec);
  return h === null ? null : HEADER_LINES.join('\n') + '\n\n' + h;
}
// 写しの検査: { ok, why[] }
export function checkCore(spec, core) {
  const why = [];
  const want = buildCore(spec);
  if (want === null) why.push('AI_SPEC.md に「# 6.」の見出しが無い');
  else if (core !== want) why.push('AI_SPEC_CORE.md が AI_SPEC.md の頭の写しと違う(node tools/aispec-core.mjs --write)');
  if (typeof core === 'string' && [...core].length >= 60000) why.push('AI_SPEC_CORE.md が 6 万字以上');
  return { ok: why.length === 0, why };
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const spec = fs.readFileSync(path.join(ROOT, SPEC_REL), 'utf8');
  const want = buildCore(spec);
  if (want === null) { console.error('AI_SPEC.md に「# 6.」の見出しが見つからない'); process.exit(1); }
  if (process.argv.includes('--write')) {
    fs.writeFileSync(path.join(ROOT, CORE_REL), want);
    console.log(`${CORE_REL} を書いた(${[...want].length} 字・頭 ${[...specHead(spec)].length} 字)`);
    process.exit(0);
  }
  let core = null; try { core = fs.readFileSync(path.join(ROOT, CORE_REL), 'utf8'); } catch (e) { /* 無い */ }
  const r = checkCore(spec, core);
  console.log(r.ok ? `${CORE_REL} は頭の写しと同じ(${[...core].length} 字)` : r.why.join(' / '));
  process.exit(r.ok ? 0 : 1);
}
