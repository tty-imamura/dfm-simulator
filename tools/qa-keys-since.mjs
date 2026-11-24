#!/usr/bin/env node
// 第352便g(統括の検証項目 R444): **基点の rev から後に tests/qa.mjs に増えた鍵の名**を出す小さな道具(読むだけ —— 何も書かない)。
//   tools/post-merge-qa.sh の `--since <rev>`(③′ の一覧を「基点からの差で増えた鍵」だけにする口)が呼ぶ。
//   鍵の名は ③′ と同じ字句の読み方(`add('<名>'` —— 英数字・点・下線・ハイフン)で、基点の本文(`git show <rev>:tests/qa.mjs`)と今の本文から拾い、
//   今の本文に在って基点の本文に無い名を、今の本文に現れる順で並べる(重複は 1 つ)。基点に在って今に無い名(消えた鍵)は数だけを出す。
// 使い方:
//   node tools/qa-keys-since.mjs <rev>             → 標準出力に増えた鍵の名を空白区切りで 1 行(0 件なら空行)・標準エラーに 1 行の要約
//   node tools/qa-keys-since.mjs <rev> --json      → {version, rev, added:[…], removed:[…], nOld, nNow}
//   node tools/qa-keys-since.mjs --self-test       → 純関数の自己試験(作りものの本文 —— git を使わない)
// 終了コード: 0 = 引けた / 2 = 使い方の誤りか rev が引けない
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const QA_KEYS_SINCE_VERSION = 'w352g-qa-keys-since-1';
const KEY_RE = /add\('([\w.\-]+)'/g;   // tools/post-merge-qa.sh の ③′ の名の引き方と同じ字句

/** 本文から鍵の名を、現れる順で重複なく拾う(純関数) */
export function keysOf(src) {
  const seen = new Set(), out = [];
  for (const m of String(src || '').matchAll(KEY_RE)) if (!seen.has(m[1])) { seen.add(m[1]); out.push(m[1]); }
  return out;
}

/** 基点の本文と今の本文 → { added(今の順), removed(基点の順) }(純関数) */
export function addedKeys(oldSrc, newSrc) {
  const o = keysOf(oldSrc), n = keysOf(newSrc), os = new Set(o), ns = new Set(n);
  return { added: n.filter((k) => !os.has(k)), removed: o.filter((k) => !ns.has(k)), nOld: o.length, nNow: n.length };
}

/** 自己試験(作りものの本文だけ —— git もファイルも読まない) */
export function selfTest352g() {
  const A = (k) => "  add('" + k + "', true, 'x');\n";
  const base = A('lint.a') + A('docs.b') + A('behavior.c');
  const rows = [];
  const t = (name, oldS, newS, wantAdded, wantRemoved) => {
    const r = addedKeys(oldS, newS);
    const ok = JSON.stringify(r.added) === JSON.stringify(wantAdded) && r.removed.length === wantRemoved;
    rows.push({ name, ok, added: r.added, removed: r.removed.length });
  };
  t('同じ本文 → 0 件', base, base, [], 0);
  t('末尾に 2 本足す → 2 本(足した順)', base, base + A('lint.z352') + A('docs.y352'), ['lint.z352', 'docs.y352'], 0);
  t('途中に 1 本挟む → 1 本', base, A('lint.a') + A('lint.mid') + A('docs.b') + A('behavior.c'), ['lint.mid'], 0);
  t('同じ鍵を 2 回 add → 1 本', base, base + A('lint.dup') + A('lint.dup'), ['lint.dup'], 0);
  t('基点に在る鍵を別の所でもう 1 回 add → 0 件', base, base + A('docs.b'), [], 0);
  t('1 本消す → 増えた 0・消えた 1', base, A('lint.a') + A('docs.b'), [], 1);
  t('名を変える → 増えた 1・消えた 1', base, A('lint.a') + A('docs.b') + A('behavior.c2'), ['behavior.c2'], 1);
  t('ハイフンと下線の名', base, base + A('preset.inertial3_295') + A('theory.refs-all'), ['preset.inertial3_295', 'theory.refs-all'], 0);
  t('add( の後が引用符でない(変数)→ 数えない', base, base + '  add(name, true);\n' + '  add("dq.x", true);\n', [], 0);
  t('空の基点 → 今の全部', '', base, ['lint.a', 'docs.b', 'behavior.c'], 0);
  t('空の今 → 消えた 3', base, '', [], 3);
  return { ok: rows.every((z) => z.ok), rows };
}

function gitShow(root, rev, file) {
  return execFileSync('git', ['-C', root, 'show', rev + ':' + file], { encoding: 'utf8', maxBuffer: 1 << 30, stdio: ['ignore', 'pipe', 'pipe'] });
}

/** rev と木の根 → 増えた鍵(git を読む・何も書かない) */
export function keysSince(root, rev) {
  const now = fs.readFileSync(path.join(root, 'tests', 'qa.mjs'), 'utf8');
  const old = gitShow(root, rev, 'tests/qa.mjs');
  return { version: QA_KEYS_SINCE_VERSION, rev, ...addedKeys(old, now) };
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const args = process.argv.slice(2);
  if (args.includes('--self-test')) {
    const st = selfTest352g();
    for (const z of st.rows) console.log((z.ok ? 'ok ' : 'NG ') + z.name + ' → 増えた [' + z.added.join(' ') + ']・消えた ' + z.removed);
    console.log('qa-keys-since --self-test: ' + st.rows.filter((z) => z.ok).length + '/' + st.rows.length + ' → ' + (st.ok ? 'OK' : 'NG'));
    process.exit(st.ok ? 0 : 1);
  }
  const rev = args.find((a) => !a.startsWith('--'));
  if (!rev) { console.error('qa-keys-since: 使い方 node tools/qa-keys-since.mjs <rev> [--json] | --self-test'); process.exit(2); }
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  let r;
  try { r = keysSince(root, rev); } catch (e) { console.error('qa-keys-since: rev ' + rev + ' の tests/qa.mjs が引けない(浅い複製なら git fetch --unshallow origin main)—— ' + String(e && e.message || e).split('\n')[0]); process.exit(2); }
  if (args.includes('--json')) console.log(JSON.stringify(r, null, 1));
  else console.log(r.added.join(' '));
  console.error('qa-keys-since: ' + rev + ' から増えた鍵 ' + r.added.length + '・消えた鍵 ' + r.removed.length + '(基点 ' + r.nOld + ' 名 → 今 ' + r.nNow + ' 名)');
}
