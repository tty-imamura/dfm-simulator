#!/usr/bin/env node
// 第352便g(統括の検証項目 R444): **性能の検査の期限つきの許可(tests/perf.mjs の `const ALLOW = {…};`)が空か**を読むだけの小さな道具。
//   tests/release-promote.mjs の `--check --perf-allow` が呼ぶ(昇格の後に許可が残っていると、許可を縛った検査が全 QA で落ちる —— 昇格の道具は許可を外さない)。
//   **この道具は何も書かない**(許可を外さない・閾値 THRESH と判定式に触らない)。空でなければ、残っている本の名と上限と、外す手順を 1 行で返す。
// 使い方:
//   node tools/perf-allow-check.mjs [--root <dir>]   → 1 行の判定(空なら終了コード 0・残っていれば 1・宣言が読めなければ 2)
//   node tools/perf-allow-check.mjs --self-test      → 純関数の自己試験(作りものの本文)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const PERF_ALLOW_CHECK_VERSION = 'w352g-perf-allow-check-1';
export const PERF_ALLOW_REMEDY = 'tests/perf.mjs の宣言を `const ALLOW = {};` に手で直す(注は当時の記録として残し、外した便の注を 1 行足す —— 昇格の適用と同じコミットで)';

/** tests/perf.mjs の本文 → { found, empty, entries:[[名, 上限]…], text }(純関数 —— 行頭の `const ALLOW = {` から対になる `}` まで・注は除く) */
export function parseAllow(src) {
  const s = String(src || '');
  const m = /^const ALLOW = \{/m.exec(s);
  if (!m) return { found: false, empty: false, entries: [], text: '' };
  let i = m.index + m[0].length, depth = 1, body = '';
  for (; i < s.length && depth > 0; i++) {
    const c = s[i];
    if (c === '/' && s[i + 1] === '/') { const e = s.indexOf('\n', i); i = e < 0 ? s.length : e - 1; continue; }
    if (c === '/' && s[i + 1] === '*') { const e = s.indexOf('*/', i + 2); i = e < 0 ? s.length : e + 1; continue; }
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) break; }
    body += c;
  }
  if (depth !== 0) return { found: false, empty: false, entries: [], text: '' };
  const entries = [...body.matchAll(/(['"]?)([A-Za-z_$][\w$.\-]*)\1\s*:\s*([^,}\n]+)/g)].map((z) => [z[2], z[3].trim()]);
  const empty = body.trim() === '';
  return { found: true, empty, entries, text: s.slice(m.index, i + 1).replace(/\s+/g, ' ').slice(0, 160) };
}

/** 判定の 1 行(release-promote の項と同じ形 {id, pass, msg}) */
export function allowVerdict(src) {
  const r = parseAllow(src);
  if (!r.found) return { id: 'promote.perf-allow-empty', pass: false, msg: 'tests/perf.mjs に行頭の `const ALLOW = {…};` の宣言が読めない(道具の読み手を合わせる)', entries: [] };
  if (r.empty) return { id: 'promote.perf-allow-empty', pass: true, msg: '性能の検査の期限つきの許可 ALLOW は空(`const ALLOW = {};`)', entries: [] };
  const names = r.entries.length ? r.entries.map(([k, v]) => k + ' ' + v).join('・') : '(名が読めない: ' + r.text + ')';
  return { id: 'promote.perf-allow-empty', pass: false, msg: '期限つきの許可が残っている: ' + names + ' —— 外す手順: ' + PERF_ALLOW_REMEDY + '(この道具は外さない)', entries: r.entries };
}

export function selfTest352g() {
  const rows = [];
  const t = (name, src, wantPass, wantN) => { const v = allowVerdict(src); const ok = v.pass === wantPass && v.entries.length === wantN; rows.push({ name, ok, pass: v.pass, n: v.entries.length }); };
  const pre = '// 注 const ALLOW = { x: 9 }; は注\nconst THRESH = 1.1;\n';
  t('空の宣言 → 通る', pre + 'const ALLOW = {};\nconst x = 1;\n', true, 0);
  t('空の宣言(中に空白と改行)→ 通る', pre + 'const ALLOW = {\n};\n', true, 0);
  t('空の宣言(中に注だけ)→ 通る', pre + 'const ALLOW = { // 第NNN便で外した\n};\n', true, 0);
  t('1 本 → 落ちる(名 1)', pre + 'const ALLOW = { galaxy: 1.25 };\n', false, 1);
  t('3 本 → 落ちる(名 3)', pre + 'const ALLOW = { galaxy: 1.25, nebulaRotor: 1.25, starSeed: 1.25 };\n', false, 3);
  t('複数行・引用符の名・注つき → 落ちる(名 2)', pre + "const ALLOW = {\n  'echo': 1.45, // 理由\n  \"merger\": 1.3,\n};\n", false, 2);
  t('宣言が無い → 落ちる(読めない)', pre + 'let ALLOW = {};\n', false, 0);
  t('行頭でない(注の中だけ)→ 落ちる(読めない)', '// const ALLOW = {};\n', false, 0);
  return { ok: rows.every((z) => z.ok), rows };
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const a = process.argv.slice(2);
  if (a.includes('--self-test')) {
    const st = selfTest352g();
    for (const z of st.rows) console.log((z.ok ? 'ok ' : 'NG ') + z.name + ' → ' + (z.pass ? '通る' : '落ちる') + '・名 ' + z.n);
    console.log('perf-allow-check --self-test: ' + st.rows.filter((z) => z.ok).length + '/' + st.rows.length + ' → ' + (st.ok ? 'OK' : 'NG'));
    process.exit(st.ok ? 0 : 1);
  }
  const ri = a.indexOf('--root'), root = ri >= 0 && a[ri + 1] ? path.resolve(a[ri + 1]) : path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  let src;
  try { src = fs.readFileSync(path.join(root, 'tests', 'perf.mjs'), 'utf8'); } catch (e) { console.log('perf-allow-check: tests/perf.mjs が読めない(' + root + ')'); process.exit(2); }
  const v = allowVerdict(src);
  console.log((v.pass ? 'PASS' : 'FAIL') + '  ' + v.id + '  ' + v.msg);
  process.exit(v.pass ? 0 : (parseAllow(src).found ? 1 : 2));
}
