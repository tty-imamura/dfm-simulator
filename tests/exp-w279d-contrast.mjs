// 第279便d(原仮定者の裁定(第69報)「UI」— トンマナ・コントラスト)の比較器。**読み取りだけ**
// (html を静的に解く — ブラウザも力学も使わない)。正本ではない(provenance 版付き JSON を出さない)。
//
// 使い方: node tests/exp-w279d-contrast.mjs [after=beta/index.html] [--before=<基点 html>] [--md] [--all]
//   after の文字の組(tests/lib-w279d-contrast.mjs の contrastTable)を WCAG 2.x の下限
//   (普通の文字 4.5:1・大きい文字 3:1)と比べ、--before を渡すと同じセレクタの before の比を並べる。
//   --md で Markdown の表(既定は変化した行と下限割れの行だけ・--all で全行)、無ければ JSON 1 個。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { contrastTable, nonTextTable, summarize } from './lib-w279d-contrast.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const AFTER = args.find((a) => !a.startsWith('--')) || 'beta/index.html';
const BEFORE = (args.find((a) => a.startsWith('--before=')) || '').slice(9) || null;
const MD = args.includes('--md');
const ALL = args.includes('--all');

const load = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const A = contrastTable(load(AFTER));
const B = BEFORE ? contrastTable(load(BEFORE)) : null;
const key = (r) => r.sel + '|' + (r.media || '');
const bMap = new Map(B ? B.rows.map((r) => [key(r), r]) : []);
const aMap = new Map(A.rows.map((r) => [key(r), r]));
const out = {
  after: { target: AFTER, ...summarize(A.rows), nonText: nonTextTable(load(AFTER)) },
  before: B ? { target: BEFORE, ...summarize(B.rows), nonText: nonTextTable(load(BEFORE)) } : null,
  rows: A.rows.map((r) => ({ ...r, before: bMap.get(key(r)) || null })),
  removed: B ? B.rows.filter((r) => !aMap.has(key(r))) : [],
};
if (!MD) { console.log(JSON.stringify(out, null, 1)); process.exit(0); }

const f = (r) => (r ? `${r.ratio}${r.exempt ? '(例外)' : r.pass ? '' : ' ✗'}` : '—');
const lines = [];
const s = (x) => `組 ${x.n}・下限割れ ${x.fails}(非活性の例外 ${x.exempt} を除く)・最小比 ${x.minRatio.toFixed(2)}・アクセント文字 ${x.accText.n} 組(最小 ${x.accText.n ? x.accText.min.toFixed(2) : '—'})`;
if (out.before) lines.push(`before ${BEFORE}: ${s(out.before)}`);
lines.push(`after  ${AFTER}: ${s(out.after)}`, '');
lines.push('| セレクタ | 前景(after 宣言) | 背景(文脈) | 字 | 必要 | before | after |', '|---|---|---|---|---|---|---|');
for (const r of out.rows) {
  const b = r.before;
  const changed = !b || b.fg !== r.fg || b.bg !== r.bg || b.ratio !== r.ratio;
  if (!ALL && !changed && r.pass) continue;
  lines.push(`| \`${r.sel}\`${r.media ? ' (@media)' : ''} | ${r.fgDecl.replace(/\|/g, '/')} ${r.fg} | ${r.bg} (${r.bgFrom}) | ${r.px ?? '—'}${r.bold ? 'b' : ''} | ${r.need} | ${f(b)} | ${f(r)} |`);
}
for (const r of out.removed) lines.push(`| \`${r.sel}\` (after で色宣言なし) | — | — | — | ${r.need} | ${f(r)} | — |`);
lines.push('', '非文字(枠線・参考 — WCAG 1.4.11 の 3:1): ' + out.after.nonText.map((x) => `${x.fg} on ${x.bg} ${x.ratio}`).join(' / '));
console.log(lines.join('\n'));
