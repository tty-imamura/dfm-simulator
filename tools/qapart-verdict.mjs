#!/usr/bin/env node
// 第351便i(統括の検証項目 R435): **部分 QA(tests/exp-w258c-qapart.mjs)の終わり方の読み分けの包み**(器の本文は 1 字も変えない —— 器の出力を読むだけ)。
//   器は、要求した鍵が全部 PASS でも「範囲の例外」(切り出した範囲が、前文に写せない上流の名前〔W5c のワーカープール w5cGetUnit など〕を読んで止まった)や
//   「同じ範囲の他の鍵の FAIL」があると終了コード 1・終わりの行が FAILED になる(tests/lib-w322d-qapart.mjs の classifyRequested —— 第323便a)。
//   本道具は器の出力の `# qapart-summary {…}` の行(1 本の走行)と `# 束 k/K の終わり: …` の行(--batch)を読み、
//   「要求した鍵: PASS n・FAIL n・SKIP n・未実行 n・範囲の例外 m・同じ範囲の他の鍵 FAIL x」を 1 行で出す。
//   **要求した鍵に FAIL も未実行も無く、要約の行が全部そろっていれば終了コード 0**(SKIP だけは器と同じく 0 —— `--strict-skip` で 1)。
//   範囲の例外と同じ範囲の他の鍵の FAIL は数を出すだけで、終了コードに入れない(その鍵はフル QA が見る —— 部分 QA の通過数はフルの被覆ではない)。
// 使い方:
//   node tools/qapart-verdict.mjs <器の出力のファイル>        … 保存した出力を読む(`-` は標準入力)
//   node tools/qapart-verdict.mjs --run [--strict-skip] <器の引数…>  … 器を子で走らせ、出力をそのまま流してから読み分ける(--batch N も渡せる)
//   node tools/qapart-verdict.mjs --self-test                  … 作りものの出力で読み分けを試す(QA lint.changelogHeadRe351i と同じ関数)
//   終了コード: 0(要求した鍵に FAIL も未実行も無い)/ 1(ある・要約の行が欠ける・要求した鍵 0)/ 2(読めない)
// 言わないこと: 「この包みで部分 QA が通るようになった」(器の判定と数え方は変えていない —— 読み分けの 1 行を足すだけ)。
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const QAPART_VERDICT_VERSION = 'w351i-qapart-verdict-1';
const SUM_TAG = '# qapart-summary ';
const BATCH_HEAD_RE = /^# --batch (\d+): 鍵 (\d+) 本を (\d+) 束に/;
const BATCH_END_RE = /^# 束 (\d+)\/(\d+) の終わり: PASS (\d+)・FAIL (\d+)・SKIP (\d+)・未実行 (\d+)\(add の行 PASS (\d+)・FAIL (\d+)\)・rc (\S+?)\(/;

/**
 * 器の出力を読み分ける(純関数)。
 * @param {string} text 器の標準出力
 * @param {{strictSkip?:boolean, toolRc?:number|null}} [opt] toolRc = 器の終了コード(分かるときだけ —— 表示だけ)
 */
export function verdictOf(text, opt) {
  const o = opt || {};
  const lines = String(text || '').split('\n');
  const sums = [], ends = [], bad = [];
  let batch = null;
  for (const l of lines) {
    if (l.startsWith(SUM_TAG)) { try { sums.push(JSON.parse(l.slice(SUM_TAG.length))); } catch { bad.push('要約の行が JSON として読めない'); } continue; }
    const h = BATCH_HEAD_RE.exec(l); if (h) { batch = { n: +h[1], keys: +h[2], batches: +h[3] }; continue; }
    const e = BATCH_END_RE.exec(l); if (e) ends.push({ k: +e[1], of: +e[2], pass: +e[3], fail: +e[4], skip: +e[5], notRun: +e[6], rc: e[9] });
  }
  const counts = { pass: 0, fail: 0, skip: 0, notRun: 0 }, extra = { pass: 0, fail: 0 };
  let errors = 0;
  for (const s of sums) {
    if (s && s.extra) { extra.pass += s.extra.pass || 0; extra.fail += s.extra.fail || 0; }
    errors += (s && s.errors) || 0;
  }
  if (batch) {
    // --batch: 要求した鍵の数は親の「束の終わり」の行(子の要約が無い束は親が要求した鍵を全部未実行に数えている)
    for (const e of ends) for (const k of Object.keys(counts)) counts[k] += e[k];
    const seen = new Set(ends.map((e) => e.k));
    const missing = []; for (let k = 1; k <= batch.batches; k++) if (!seen.has(k)) missing.push(k);
    if (missing.length) bad.push('束の終わりの行が無い束 ' + missing.join('・') + '(走行が途中で止まった)');
    if (ends.length && counts.pass + counts.fail + counts.skip + counts.notRun !== batch.keys) bad.push('束の終わりの数の和 ' + (counts.pass + counts.fail + counts.skip + counts.notRun) + ' ≠ 要求した鍵 ' + batch.keys);
  } else {
    if (!sums.length) bad.push('要約の行(# qapart-summary)が無い(走行の本文が落ちた・途中で止まった)');
    for (const s of sums) if (s && s.counts) for (const k of Object.keys(counts)) counts[k] += s.counts[k] || 0;
  }
  const requested = counts.pass + counts.fail + counts.skip + counts.notRun;
  if (!bad.length && requested === 0) bad.push('要求した鍵 0(何も確かめていない)');
  const strictBad = !!o.strictSkip && counts.skip > 0;
  const rc = bad.length || counts.fail || counts.notRun || strictBad ? 1 : 0;
  const toolRc = o.toolRc == null ? (batch ? null : (sums.length === 1 && typeof sums[0].rc === 'number' ? sums[0].rc : null)) : o.toolRc;
  const label = bad.length ? 'NG(読めない所あり)' : counts.fail || counts.notRun ? 'NG(要求した鍵に FAIL か未実行)' : strictBad ? 'NG(--strict-skip: SKIP あり)'
    : counts.skip > 0 && counts.pass === 0 ? 'SKIP だけ(走った鍵 0)' : 'OK(要求した鍵に FAIL も未実行も無い)';
  return { version: QAPART_VERDICT_VERSION, mode: batch ? 'batch' : 'single', batches: batch ? batch.batches : null, summaries: sums.length, counts, requested, extra, errors, bad, rc, toolRc, label };
}

/** 読み分けの 1 行 */
export function verdictLine(v) {
  return `qapart-verdict(${v.version}): ${v.label} —— 要求した鍵 ${v.requested}: PASS ${v.counts.pass}・FAIL ${v.counts.fail}・SKIP ${v.counts.skip}・未実行 ${v.counts.notRun}`
    + `・範囲の例外 ${v.errors}・同じ範囲の他の鍵 FAIL ${v.extra.fail}`
    + (v.mode === 'batch' ? `(--batch・束 ${v.batches})` : '')
    + (v.toolRc == null ? '' : `(器の rc ${v.toolRc} → 読み分けの rc ${v.rc})`)
    + (v.bad.length ? ' / ' + v.bad.join(' / ') : '');
}

// ---- 作りものの出力(器の印字の型 —— tests/exp-w258c-qapart.mjs の前文の終わりの行と --batch の束の終わりの行と同じ形)----
const sumLine = (counts, extra, errors, rc, lists) => SUM_TAG + JSON.stringify({ version: 'w323a-qapart-summary-1', counts: Object.assign({ notRunAbsentInFull: null }, counts), extra, errors, rc,
  skip: lists.skip || [], notRun: lists.notRun || [], fail: lists.fail || [] });
export const SELF_CASES_351I = [
  { name: '全部 PASS・範囲の例外なし', strict: false, want: 0, wantToolRc: 0,
    text: ['PASS a.x  …  [0.1s]', 'PASS b.y  …  [0.2s]', sumLine({ pass: 2, fail: 0, skip: 0, notRun: 0 }, { pass: 0, fail: 0 }, 0, 0, {}), '', 'ALL PASS (2/2) —— 要求した鍵 2: PASS 2・FAIL 0・SKIP 0・未実行 0'].join('\n') },
  { name: '要求した鍵は全部 PASS・範囲の例外 1(器の rc 1)', strict: false, want: 0, wantToolRc: 1,
    text: ['PASS a.x  …  [0.1s]', '# qapart(第323便a): 範囲 120-180 が例外で止まった —— Error: qapart では W5c のワーカープール w5cGetUnit("k") を使えない', sumLine({ pass: 1, fail: 0, skip: 0, notRun: 0 }, { pass: 0, fail: 0 }, 1, 1, {}), '', 'FAILED (1/1) —— 要求した鍵 1: PASS 1・FAIL 0・SKIP 0・未実行 0・範囲の例外 1'].join('\n') },
  { name: '要求した鍵に FAIL 1', strict: false, want: 1, wantToolRc: 1,
    text: ['PASS a.x  …', 'FAIL b.y  違反 1 件', sumLine({ pass: 1, fail: 1, skip: 0, notRun: 0 }, { pass: 0, fail: 0 }, 0, 1, { fail: ['b.y'] }), '', 'FAILED (1/2) —— 要求した鍵 2: PASS 1・FAIL 1・SKIP 0・未実行 0'].join('\n') },
  { name: '要求した鍵に未実行 1(範囲の例外で止まった)', strict: false, want: 1, wantToolRc: 1,
    text: ['# qapart(第323便a): 範囲 10-20 が例外で止まった —— ReferenceError', 'FAIL c.z  未実行 —— Requested QA did not execute in qapart(結果の行も SKIP の行も無い)', sumLine({ pass: 0, fail: 0, skip: 0, notRun: 1 }, { pass: 0, fail: 0 }, 1, 1, { notRun: ['c.z'] }), '', 'FAILED (0/0) —— 要求した鍵 1: PASS 0・FAIL 0・SKIP 0・未実行 1・範囲の例外 1'].join('\n') },
  { name: '要求した鍵は PASS・同じ範囲の他の鍵の FAIL 1(器の rc 1)', strict: false, want: 0, wantToolRc: 1,
    text: ['PASS a.x  …', 'FAIL q.other  …', sumLine({ pass: 1, fail: 0, skip: 0, notRun: 0 }, { pass: 0, fail: 1 }, 0, 1, {}), '', 'FAILED (1/2) —— 要求した鍵 1: PASS 1・FAIL 0・SKIP 0・未実行 0(同じ範囲の他の鍵 PASS 0・FAIL 1)'].join('\n') },
  { name: '要約の行が無い(走行の本文が落ちた)', strict: false, want: 1, wantToolRc: null,
    text: ['PASS a.x  …', 'FAIL b.y  未実行 —— Requested QA did not execute in qapart(走行の本文が落ちた)', '# qapart(第323便a): 走行の本文が落ちた —— SyntaxError', '', 'FAILED (1/1) —— 要求した鍵 2: PASS 1・FAIL 0・SKIP 0・未実行 1'].join('\n') },
  { name: 'SKIP だけ(器と同じく rc 0)', strict: false, want: 0, wantToolRc: 0,
    text: ['SKIP docs.k(beta 対象でない)', sumLine({ pass: 0, fail: 0, skip: 1, notRun: 0 }, { pass: 0, fail: 0 }, 0, 0, { skip: ['docs.k'] })].join('\n') },
  { name: 'SKIP だけ・--strict-skip', strict: true, want: 1, wantToolRc: 0,
    text: ['SKIP docs.k(beta 対象でない)', sumLine({ pass: 0, fail: 0, skip: 1, notRun: 0 }, { pass: 0, fail: 0 }, 0, 0, { skip: ['docs.k'] })].join('\n') },
  { name: '--batch 2 束・2 束目に範囲の例外(要求した鍵は全部 PASS)', strict: false, want: 0, wantToolRc: null,
    text: ['# --batch 2: 鍵 3 本を 2 束に(束ごとに子の Node と Chromium を作り直す)', '# 束 1/2: a.x / b.y  (1-9 行)', sumLine({ pass: 2, fail: 0, skip: 0, notRun: 0 }, { pass: 0, fail: 0 }, 0, 0, {}),
      '# 束 1/2 の終わり: PASS 2・FAIL 0・SKIP 0・未実行 0(add の行 PASS 2・FAIL 0)・rc 0(3.0 s)', '# 束 2/2: c.z  (20-30 行)', sumLine({ pass: 1, fail: 0, skip: 0, notRun: 0 }, { pass: 0, fail: 0 }, 1, 1, {}),
      '# 束 2/2 の終わり: PASS 1・FAIL 0・SKIP 0・未実行 0(add の行 PASS 1・FAIL 0)・rc 1(2.0 s)', '', '# --batch 2: FAILED —— 束 2・要求した鍵 3: PASS 3・FAIL 0・SKIP 0・未実行 0(同じ範囲の他の鍵 PASS 0・FAIL 0・範囲の例外 1)・束 2(rc 1・FAIL 0)'].join('\n') },
  { name: '--batch 2 束・2 束目の終わりの行が無い(途中で止まった)', strict: false, want: 1, wantToolRc: null,
    text: ['# --batch 2: 鍵 3 本を 2 束に(束ごとに子の Node と Chromium を作り直す)', sumLine({ pass: 2, fail: 0, skip: 0, notRun: 0 }, { pass: 0, fail: 0 }, 0, 0, {}),
      '# 束 1/2 の終わり: PASS 2・FAIL 0・SKIP 0・未実行 0(add の行 PASS 2・FAIL 0)・rc 0(3.0 s)'].join('\n') },
  { name: '空の出力(要求した鍵 0)', strict: false, want: 1, wantToolRc: null, text: '' },
];
/** 自己試験(QA lint.changelogHeadRe351i ⑤ と同じ関数) */
export function selfTest351i() {
  const rows = SELF_CASES_351I.map((c) => { const v = verdictOf(c.text, { strictSkip: c.strict }); return { name: c.name, rc: v.rc, want: c.want, toolRc: v.toolRc, wantToolRc: c.wantToolRc, ok: v.rc === c.want && v.toolRc === c.wantToolRc, line: verdictLine(v) }; });
  return { version: QAPART_VERDICT_VERSION, rows, ok: rows.every((r) => r.ok) };
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) {
  const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const argv = process.argv.slice(2);
  const strictSkip = argv.includes('--strict-skip');
  if (argv.includes('--self-test')) {
    const r = selfTest351i();
    for (const z of r.rows) console.log(`  ${z.ok ? 'ok' : 'NG'}  ${z.name}: rc ${z.rc}(期待 ${z.want})—— ${z.line}`);
    console.log(`qapart-verdict --self-test(${r.version}): ${r.ok ? 'OK' : 'NG'}(${r.rows.length} 通り)`);
    process.exit(r.ok ? 0 : 1);
  }
  if (argv[0] === '--run') {
    const args = argv.slice(1).filter((a) => a !== '--strict-skip');
    if (strictSkip) args.push('--strict-skip');   // 器にも渡す(器の判定と同じ向き)
    const ch = spawn(process.execPath, [path.join(ROOT, 'tests', 'exp-w258c-qapart.mjs'), ...args], { cwd: ROOT, env: process.env, stdio: ['ignore', 'pipe', 'inherit'] });
    let buf = '';
    ch.stdout.on('data', (d) => { process.stdout.write(d); buf += d.toString(); });
    ch.on('close', (rc, sig) => {
      const v = verdictOf(buf, { strictSkip, toolRc: rc === null ? -1 : rc });
      console.log('\n' + verdictLine(v) + (sig ? `(器はシグナル ${sig} で終わった)` : ''));
      process.exit(v.rc);
    });
  } else {
    const f = argv.find((a) => !a.startsWith('--'));
    if (!f) { console.log('使い方: node tools/qapart-verdict.mjs <器の出力のファイル | -> [--strict-skip] / --run [--strict-skip] <器の引数…> / --self-test'); process.exit(2); }
    let text;
    try { text = f === '-' ? fs.readFileSync(0, 'utf8') : fs.readFileSync(path.resolve(f), 'utf8'); } catch (e) { console.error('読めない: ' + f); process.exit(2); }
    const v = verdictOf(text, { strictSkip });
    console.log(verdictLine(v));
    process.exit(v.rc);
  }
}
