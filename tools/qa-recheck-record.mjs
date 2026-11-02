#!/usr/bin/env node
// 第323便d(統括の検証項目 R278・原仮定者の指示(2026-11-01)「サンプルの変更だけでは、全行程を再実行しない様にする」): **部分の再検査の補足の記録**を作る道具。
//   保存のフル QA の FAIL を直した後に、フルを繰り返さず部分 QA(tests/exp-w258c-qapart.mjs)で FAIL の ID を再検査した —— その来歴を
//   機械で読める形(tests/lib-w323d-recheck.mjs の型)で残す。**保存のフルの結果は書き換えない**。
//
//   node tools/qa-recheck-record.mjs --log <部分 QA の印字> [--ids a,b] [--target beta/index.html]
//        [--full tests/out/qa-results-full-beta.json[@<rev>]] [--fix <path>[@<rev>]]… [--code tests/qa.mjs[@<rev>]]…
//        [--html beta/index.html[@<rev>]] [--when <ISO>] [--note <文>] [--out <出力>] [--dry-run]
//   node tools/qa-recheck-record.mjs --check [<記録>]     … 形の検査だけ(QA lint.qaRecheck323 と同じ関数)
//
//   ・`--fix`(直したファイル —— 文書・検査のコード): 直した後の sha256 は `@<rev>` の版(git show)か作業木のファイル。直す前の sha256 は
//     保存のフルの commit の版(git show <full.commit>:<path> —— 引けなければ null)。
//   ・`--code`(既定 tests/qa.mjs): 検査のコードの sha256 を、フルの時点(full.commit の版)と再検査の時点(@<rev> か作業木)で並べる。
//   ・`--html`(既定 = 保存のフルの target): 再検査した html の sha256(@<rev> か作業木)—— フルの targetSha256 と同じなら「同じ html」。
//   ・`--out`(既定 tests/out/qa-recheck-beta.json〔root は qa-recheck.json〕): 1 本の追記型。既存の記録が同じフル(sha256)を指せば records に足す。
//   終了コード: 0 = 書いた(結論が閉じていなくても書く —— 結論は記録の中)/ 1 = 形の検査が通らない / 2 = 引数・入力の誤り。
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RC = await import(pathToFileURL(path.join(ROOT, 'tests', 'lib-w323d-recheck.mjs')).href);
const argv = process.argv.slice(2);
const one = (k) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : null; };
const many = (k) => argv.flatMap((a, i) => (a === k && argv[i + 1] ? [argv[i + 1]] : []));
const die = (m, c = 2) => { console.error('[qa-recheck] ' + m); process.exit(c); };

if (argv.includes('--check')) {
  const f = argv[argv.indexOf('--check') + 1] && !argv[argv.indexOf('--check') + 1].startsWith('--') ? argv[argv.indexOf('--check') + 1] : RC.RECHECK_FILE['beta/index.html'];
  let doc; try { doc = JSON.parse(fs.readFileSync(path.resolve(ROOT, f), 'utf8')); } catch (e) { die('記録が読めない: ' + f); }
  const bad = RC.validateRecheck(doc);
  console.log(`qa-recheck --check ${f}: ${bad.length ? 'NG' : 'OK'}(records ${(doc.records || []).length}・閉じた ${doc.latest ? doc.latest.closed : '—'})`);
  for (const b of bad) console.log('  ‼ ' + b);
  process.exit(bad.length ? 1 : 0);
}

// path[@rev] の中身(rev があれば git show、無ければ作業木)
const bytesOf = (spec) => {
  const at = spec.lastIndexOf('@');
  const p = at > 0 ? spec.slice(0, at) : spec, rev = at > 0 ? spec.slice(at + 1) : null;
  if (rev) return { path: p, rev, buf: execFileSync('git', ['-C', ROOT, 'show', rev + ':' + p], { maxBuffer: 1 << 30 }) };
  return { path: p, rev: null, buf: fs.readFileSync(path.join(ROOT, p)) };
};
const gitBytes = (rev, p) => { if (!rev) return null; try { return execFileSync('git', ['-C', ROOT, 'show', rev + ':' + p], { maxBuffer: 1 << 30, stdio: ['ignore', 'pipe', 'ignore'] }); } catch (e) { return null; } };

const target = one('--target') || 'beta/index.html';
const fullSpec = one('--full') || RC.FULL_FILE[target];
if (!fullSpec) die('--target が beta/index.html か index.html でない: ' + target);
const F = bytesOf(fullSpec);
let fullJson; try { fullJson = JSON.parse(F.buf.toString('utf8')); } catch (e) { die('保存のフルが JSON でない: ' + fullSpec); }
const full = RC.fullRefOf(fullJson, F.path, RC.sha256(F.buf));
if (F.rev) full.fileRev = F.rev;

const logFile = one('--log');
if (!logFile) die('--log(部分 QA の印字)が要る');
const logBuf = fs.readFileSync(path.resolve(logFile));
const reqIds = one('--ids') ? one('--ids').split(',').map((z) => z.trim()).filter(Boolean) : null;
const parsed = RC.parseQapartLog(logBuf.toString('utf8'), reqIds);

const fixes = many('--fix').map((spec) => {
  const X = bytesOf(spec); const before = gitBytes(full.commit, X.path);
  return { path: X.path, commit: X.rev, sha256Before: before ? RC.sha256(before) : null, sha256After: RC.sha256(X.buf) };
});
const codeSpecs = many('--code').length ? many('--code') : ['tests/qa.mjs'];
const code = codeSpecs.map((spec) => { const X = bytesOf(spec); const atFull = gitBytes(full.commit, X.path);
  return { path: X.path, sha256AtFull: atFull ? RC.sha256(atFull) : null, sha256AtRecheck: RC.sha256(X.buf) }; });
const H = bytesOf(one('--html') || full.target || target);
const entry = RC.buildRecheckEntry({ full, fixes, code, html: { path: H.path, rev: H.rev, sha256: RC.sha256(H.buf) }, parsed,
  log: { file: path.relative(ROOT, path.resolve(logFile)).startsWith('..') ? path.basename(logFile) : path.relative(ROOT, path.resolve(logFile)), sha256: RC.sha256(logBuf) },
  when: one('--when') || new Date().toISOString(), note: one('--note') || null });
if (H.rev) entry.html.rev = H.rev;

const outRel = one('--out') || RC.RECHECK_FILE[target];
const outAbs = path.resolve(ROOT, outRel);
let prev = null; try { prev = JSON.parse(fs.readFileSync(outAbs, 'utf8')); } catch (e) { prev = null; }
const doc = RC.appendRecheck(prev, full, entry, target);
const bad = RC.validateRecheck(doc);
const C = entry.conclusion;
console.log(`qa-recheck(${RC.RECHECK_VERSION}): フル ${full.passed}/${full.total}(FAIL ${full.failedIds.join(', ') || '—'}・${full.file} ${full.sha256.slice(0, 12)})`
  + ` + 部分の再検査 ${parsed.summary.pass}/${parsed.summary.requested}(FAIL ${parsed.summary.fail}・SKIP ${parsed.summary.skip}・未実行 ${parsed.summary.notRun})`
  + ` —— 同じ html ${C.sameHtml}・検査のコード同じ ${C.qaCodeSame}・閉じた ${C.closed}`);
for (const f of fixes) console.log(`  直したファイル ${f.path}${f.commit ? '@' + f.commit : ''}: ${f.sha256Before ? f.sha256Before.slice(0, 12) : '—'} → ${f.sha256After.slice(0, 12)}`);
for (const b of bad) console.log('  ‼ ' + b);
if (bad.length) process.exit(1);
if (!argv.includes('--dry-run')) { fs.mkdirSync(path.dirname(outAbs), { recursive: true }); fs.writeFileSync(outAbs, JSON.stringify(doc, null, 1) + '\n'); console.log('  書いた: ' + path.relative(ROOT, outAbs) + '(records ' + doc.records.length + ')'); }
process.exit(0);
