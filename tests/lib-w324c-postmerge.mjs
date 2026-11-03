// 第324便c(統括の検証項目 R281 —— 第323便の統括の手順で決めたこと「post-merge の ③〜④ は `# qapart-summary` を読んで未実行を別の数に・③′ は便の新設に絞る」):
//   tools/post-merge-qa.sh の ③・③′・④ の数え方と ③′ の一覧の絞り(純関数 + 小さな CLI —— 正本・html は書かない)。
//
// ■ 何をするか
//   ① `summarizeQapartLog(text, o)` —— qapart(tests/exp-w258c-qapart.mjs —— 第323便a)のログの `# qapart-summary {…}` の行(--batch なら束ごとの行の和)を読み、
//      **PASS・FAIL・SKIP・未実行の 4 つの数**と未実行の鍵の名を返す(第323便までの post-merge は `^PASS`・`^FAIL` の行を数えた —— 未実行は FAIL の行に混ざった)。
//      要約の行が無い(qapart が落ちた)ログは「要約の行なし」(要求した鍵の数が分かれば全部を未実行に数える)。
//      未実行の鍵のうち、同じ対象の保存のフル QA(beta は tests/out/qa-results-full-beta.json・root は tests/out/qa-results-full.json)にも行が無い鍵は
//      「この対象では走らない鍵の型」と注記(例: beta で root でだけ走る鍵 version.sw-sync・release.no-beta-identifiers が未実行になるのは正常 —— 数え方は変えない)。
//   ② `waveOfChangelog(text)` —— CHANGELOG.md の最初の `## v…-b<便>(` の便の番号(③′ の既定の便)。
//   ③ `waveIdsFromScript(text, wave)` —— post-merge-qa.sh の `# ==== 第<便><枝> の塊(ここから)====` 〜 `(ここまで)====` の中の
//      `DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS …"` と `[ -n "${POST_MERGE_WAVE_IDS+x}" ] || WAVE_IDS="$WAVE_IDS …"` の名を、その便の塊だけ集める
//      (過去の便の新設を積まない —— 第323便の ③′ は過去の便の新設を積んだ 412 鍵で 30 min 前後)。
// ■ CLI(post-merge-qa.sh が呼ぶ)
//   node tests/lib-w324c-postmerge.mjs --sum <log> [--target beta|root]     → 1 行(PASS n・FAIL n・SKIP n・未実行 n …)と終了コード 0
//   node tests/lib-w324c-postmerge.mjs --wave-of <CHANGELOG.md>             → 便の番号(無ければ空・終了コード 1)
//   node tests/lib-w324c-postmerge.mjs --wave-ids <post-merge-qa.sh> <便>    → 名を空白区切りで 1 行(標準エラーに塊の一覧)
// ■ 言わないこと: 「③′ を絞っても見落としは無い」(過去の便の新設はフルゲートと CI が見る —— ③′ は統合の直後に本便の新設を短く一周するだけ)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const POSTMERGE_LIB_VERSION = 'w324c-postmerge-1';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
/** 対象 → 保存のフル QA の結果のファイル(未実行の鍵の注記だけに使う)。 */
export const SAVED_FULL = Object.freeze({ beta: 'tests/out/qa-results-full-beta.json', root: 'tests/out/qa-results-full.json' });

/** 保存のフル QA の結果の id の集合(読めなければ null)。 */
export function savedFullIds(target, root) {
  const f = SAVED_FULL[target === 'root' ? 'root' : 'beta'];
  try { const j = JSON.parse(fs.readFileSync(path.join(root || ROOT, f), 'utf8')); return { file: f, ids: new Set((j.results || []).map((r) => r.id)) }; } catch { return null; }
}

/**
 * qapart のログ → 4 つの数と鍵の名。
 * @param {string} text ログ
 * @param {{target?:'beta'|'root', full?:{file:string, ids:Set<string>}|null, requested?:number}} [o]
 */
export function summarizeQapartLog(text, o) {
  const opt = o || {};
  const lines = String(text || '').split('\n');
  const sums = [];
  for (const l of lines) if (l.startsWith('# qapart-summary ')) { try { sums.push(JSON.parse(l.slice('# qapart-summary '.length))); } catch { sums.push(null); } }
  const out = { version: POSTMERGE_LIB_VERSION, found: sums.length > 0 && sums.every(Boolean), batches: sums.length, counts: { pass: 0, fail: 0, skip: 0, notRun: 0 },
    notRun: [], skip: [], fail: [], notRunAbsentInFull: [], extra: { pass: 0, fail: 0 }, errors: 0, addLines: { pass: 0, fail: 0 } };
  for (const l of lines) { if (/^PASS /.test(l)) out.addLines.pass++; else if (/^FAIL /.test(l)) out.addLines.fail++; }
  for (const s of sums) {
    if (!s) continue;
    for (const k of ['pass', 'fail', 'skip', 'notRun']) out.counts[k] += Number((s.counts || {})[k]) || 0;
    out.notRun.push(...(s.notRun || [])); out.skip.push(...(s.skip || [])); out.fail.push(...(s.fail || []));
    out.extra.pass += Number((s.extra || {}).pass) || 0; out.extra.fail += Number((s.extra || {}).fail) || 0; out.errors += Number(s.errors) || 0;
  }
  if (!out.found && Number.isInteger(opt.requested) && opt.requested > 0) { out.counts.notRun = opt.requested - out.counts.pass - out.counts.fail - out.counts.skip; if (out.counts.notRun < 0) out.counts.notRun = 0; }
  const full = opt.full === undefined ? savedFullIds(opt.target) : opt.full;
  if (full) out.notRunAbsentInFull = out.notRun.filter((id) => !full.ids.has(id));
  out.savedFull = full ? full.file : null;
  out.target = opt.target || 'beta';
  return out;
}
/** 1 行の文(post-merge の ③・③′・④ の数)。 */
export function qapartSummaryText(r) {
  const c = r.counts;
  let t = `PASS ${c.pass}・FAIL ${c.fail}・SKIP ${c.skip}・未実行 ${c.notRun}`;
  if (!r.found) t += '(要約の行なし —— qapart が落ちたか旧形式: add の行 PASS ' + r.addLines.pass + '・FAIL ' + r.addLines.fail + ')';
  if (r.notRun.length) {
    const norm = r.notRun.filter((id) => !r.notRunAbsentInFull.includes(id));
    t += `(未実行の鍵 ${r.notRun.slice(0, 6).join(',')}${r.notRun.length > 6 ? ' 他 ' + (r.notRun.length - 6) : ''}`
      + (r.notRunAbsentInFull.length ? ` —— うち保存のフル QA にもこの対象の行が無い ${r.notRunAbsentInFull.length}〔この対象では走らない鍵の型 —— 例: beta で root でだけ走る鍵は正常〕` : '')
      + (norm.length && r.notRunAbsentInFull.length ? `・残り ${norm.length} は対象で走るはずの鍵` : '') + ')';
  }
  if (r.extra.fail) t += `・同じ範囲の他の鍵の FAIL ${r.extra.fail}`;
  if (r.errors) t += `・範囲の例外 ${r.errors}`;
  return t;
}
/** CHANGELOG の最初の beta 節の便の番号(`## v1.47-b324(` → 324)。 */
export function waveOfChangelog(text) {
  const m = String(text || '').match(/^## v[\d.]+-b(\d+)[((]/m);
  return m ? Number(m[1]) : null;
}
/** post-merge-qa.sh の本文 → その便の塊の名(順を保って重複を除く)。 */
export function waveIdsFromScript(text, wave) {
  const lines = String(text || '').split('\n');
  const W = String(wave);
  const ids = [], blocks = [];
  let cur = null;
  for (const l of lines) {
    const mo = l.match(/^# ==== 第(\d+)便([a-z]*) の塊[((]ここから[))]====/);   // 脚本の見出しは ASCII の括弧(全角も受ける)
    if (mo) { cur = mo[1] === W ? mo[1] + mo[2] : null; if (cur && !blocks.includes(cur)) blocks.push(cur); continue; }
    if (/^# ==== 第\d+便[a-z]* の塊[((]ここまで[))]====/.test(l)) { cur = null; continue; }
    if (!cur) continue;
    const m = l.match(/^DEFAULT_WAVE_IDS="\$DEFAULT_WAVE_IDS ([^"]*)"\s*$/) || l.match(/^\[ -n "\$\{POST_MERGE_WAVE_IDS\+x\}" \] \|\| WAVE_IDS="\$WAVE_IDS ([^"]*)"\s*$/);
    if (m) for (const id of m[1].trim().split(/\s+/)) if (id && !ids.includes(id)) ids.push(id);
  }
  return { version: POSTMERGE_LIB_VERSION, wave: Number(wave), blocks, ids };
}
/** 本文の全部の便の名(絞らない —— 第323便までの ③′ の一覧の数の比べ)。 */
export function allWaveIdsFromScript(text) {
  const ids = [];
  for (const l of String(text || '').split('\n')) {
    const m = l.match(/^DEFAULT_WAVE_IDS="(?:\$DEFAULT_WAVE_IDS )?([^"]*)"\s*$/) || l.match(/^\[ -n "\$\{POST_MERGE_WAVE_IDS\+x\}" \] \|\| WAVE_IDS="\$WAVE_IDS ([^"]*)"\s*$/);
    if (m) for (const id of m[1].trim().split(/\s+/)) if (id) ids.push(id);
  }
  return ids;
}

/** 自己試験(缶詰 —— QA lint.postMergeCounts324c が呼ぶ)。 */
export function postMergeSelfTest() {
  const bad = [];
  const log = ['PASS a.x  ok', 'FAIL b.y  NG', 'FAIL c.z  未実行 —— Requested QA did not execute in qapart',
    '# qapart-summary ' + JSON.stringify({ version: 'w323a-qapart-summary-1', counts: { pass: 1, fail: 1, skip: 1, notRun: 2 }, extra: { pass: 0, fail: 0 }, errors: 0, rc: 1, skip: ['d.w'], notRun: ['c.z', 'version.sw-sync'], fail: ['b.y'] })].join('\n');
  const r = summarizeQapartLog(log, { target: 'beta', full: { file: 'x', ids: new Set(['a.x', 'b.y', 'c.z', 'd.w']) } });
  if (!(r.found && r.counts.pass === 1 && r.counts.fail === 1 && r.counts.skip === 1 && r.counts.notRun === 2 && r.notRunAbsentInFull.join(',') === 'version.sw-sync')) bad.push('① 要約の行: ' + JSON.stringify(r.counts) + ' ' + r.notRunAbsentInFull);
  const t = qapartSummaryText(r);
  if (!/PASS 1・FAIL 1・SKIP 1・未実行 2/.test(t) || !/この対象では走らない鍵の型/.test(t)) bad.push('① 文: ' + t);
  const r2 = summarizeQapartLog('PASS a\nFAIL b\n', { requested: 5, full: null });
  if (r2.found || r2.counts.notRun !== 5) bad.push('① 要約の行が無いログ: ' + JSON.stringify(r2.counts));
  const b2 = [log, log.replace('"pass":1', '"pass":3')].join('\n');
  const r3 = summarizeQapartLog(b2, { full: null });
  if (r3.batches !== 2 || r3.counts.pass !== 4 || r3.counts.notRun !== 4) bad.push('① 束の和: ' + JSON.stringify(r3.counts));
  if (waveOfChangelog('# x\n\n## v1.47-b324(開発中 — beta)\n- a\n## v1.46.0(2026)') !== 324 || waveOfChangelog('## v1.46.0(x)') !== null) bad.push('② CHANGELOG の便');
  const sh = ['DEFAULT_WAVE_IDS="old.a"', '# ==== 第323便a の塊(ここから)====', 'DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS w323.a lint.x"', '# ==== 第323便a の塊(ここまで)====',
    '# ==== 第324便c の塊(ここから)====', '# 注記 DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS no.comment"', 'DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS lint.q324 lint.x"', '# ==== 第324便c の塊(ここまで)====',
    '# ==== 第313便c の塊(ここから)====', '[ -n "${POST_MERGE_WAVE_IDS+x}" ] || WAVE_IDS="$WAVE_IDS old.b"', '# ==== 第313便c の塊(ここまで)====',
    '# ==== 第324便d の塊(ここから)====', '[ -n "${POST_MERGE_WAVE_IDS+x}" ] || WAVE_IDS="$WAVE_IDS d.324 lint.q324"', '# ==== 第324便d の塊(ここまで)===='].join('\n');
  const w = waveIdsFromScript(sh, 324);
  if (w.ids.join(',') !== 'lint.q324,lint.x,d.324' || w.blocks.join(',') !== '324c,324d') bad.push('③ 便の塊の名: ' + w.ids.join(',') + ' / ' + w.blocks.join(','));
  if (allWaveIdsFromScript(sh).length !== 8) bad.push('③ 全部の便の名の数: ' + allWaveIdsFromScript(sh).length);
  return { version: POSTMERGE_LIB_VERSION, ok: bad.length === 0, bad,
    cases: [`要約の行 → ${t}`, `要約の行なし(要求 5)→ 未実行 ${r2.counts.notRun}`, `束 2 → PASS ${r3.counts.pass}・未実行 ${r3.counts.notRun}`, `③′ の便 324 の塊 ${w.blocks.join('・')} → ${w.ids.join(' ')}(過去の便の塊・注記の行は拾わない)`] };
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) {
  const argv = process.argv.slice(2);
  const get = (k) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : undefined; };
  if (argv.includes('--sum')) {
    let text = ''; try { text = fs.readFileSync(get('--sum'), 'utf8'); } catch { text = ''; }
    const req = Number(get('--requested'));
    console.log(qapartSummaryText(summarizeQapartLog(text, { target: get('--target') === 'root' ? 'root' : 'beta', requested: Number.isInteger(req) ? req : undefined })));
    process.exit(0);
  }
  if (argv.includes('--wave-of')) {
    let text = ''; try { text = fs.readFileSync(get('--wave-of'), 'utf8'); } catch { text = ''; }
    const w = waveOfChangelog(text);
    if (w === null) process.exit(1);
    console.log(String(w)); process.exit(0);
  }
  if (argv.includes('--wave-ids')) {
    const i = argv.indexOf('--wave-ids');
    let text = ''; try { text = fs.readFileSync(argv[i + 1], 'utf8'); } catch { text = ''; }
    const r = waveIdsFromScript(text, argv[i + 2]);
    console.error(`[post-merge-qa] ③′ 第${r.wave}便の塊 ${r.blocks.join('・') || 'なし'} の名 ${r.ids.length}(全部の便を積むと ${allWaveIdsFromScript(text).length} —— 重複を含む)`);
    console.log(r.ids.join(' '));
    process.exit(0);
  }
  if (argv.includes('--self-test')) { const r = postMergeSelfTest(); for (const c of r.cases) console.log('  ' + c); console.log('postmerge --self-test: ' + (r.ok ? 'OK' : 'NG —— ' + r.bad.join(' / '))); process.exit(r.ok ? 0 : 1); }
  console.error('使い方: --sum <log> [--target beta|root] / --wave-of <CHANGELOG.md> / --wave-ids <post-merge-qa.sh> <便> / --self-test'); process.exit(2);
}

export default { POSTMERGE_LIB_VERSION, SAVED_FULL, savedFullIds, summarizeQapartLog, qapartSummaryText, waveOfChangelog, waveIdsFromScript, allWaveIdsFromScript, postMergeSelfTest };
