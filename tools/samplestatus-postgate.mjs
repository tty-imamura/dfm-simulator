#!/usr/bin/env node
// 第321便d(決断事項 AN493・統括の検証項目 R269): **ゲートの後に samplestatus の段を 1 回だけ**走らせ、来歴と時間の欄だけが変わったことを機械で確かめる道具。
//   PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright node tools/samplestatus-postgate.mjs [--root <dir>] [--dry-run] [--keep] [--any-qa] [--json] [--out <file>]
//   ① 前提: 保存 QA tests/out/qa-results-full-beta.json の刻印 targetSha256 が今の beta/index.html と同じ(= ゲートの QA の保存物 —— 違えば走らせずに rc 3。--any-qa で外す)
//   ② 走行: 再生成表(tests/lib-w281a-regentable.mjs)の段 samplestatus の cmd をそのまま(器 + --check —— 段の宣言と同じコマンド)・REGEN_HTML_STAGE を外して(鎖の外 —— html を直に読む)
//   ③ 照合(tests/lib-w321d-postgate.mjs の純関数): 木の全ファイルの sha の前後(変わってよいのは段の書きから html を除いた 2 つ —— html は 1 byte も変わらない)・
//      正本の差を欄で分類(来歴と時間の欄の外が 0)・一覧 md の差を行で分類(保存 QA の 2 行と所要時間の表の保存 QA の 2 列の外が 0)・
//      正本の meta.evidenceQa が保存 QA の commit・date と同じ・timingNote.qaProvenance.sameHtml が真(1 便遅れが解けた)
//   終了コード: 0 = 許す欄の外の差 0(--dry-run 以外は書いたまま —— 統括が commit する)/ 1 = 許す欄の外の差(段の書きを走行の前へ戻す —— --keep で残す)/
//              2 = 器が rc ≠ 0(戻す)/ 3 = 前提を満たさない(走らせない)。--dry-run は判定の後に必ず走行の前へ戻す(試走)。書くもの: 段の書き(正本・md)と --out だけ
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const argv = process.argv.slice(2);
const getArg = (k, d) => { const i = argv.indexOf(k); return (i >= 0 && argv[i + 1]) ? argv[i + 1] : d; };
const has = (k) => argv.includes(k);
const ROOT = path.resolve(getArg('--root', path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')));
const PG = await import(pathToFileURL(path.join(ROOT, 'tests', 'lib-w321d-postgate.mjs')).href);
const RT = await import(pathToFileURL(path.join(ROOT, 'tests', 'lib-w281a-regentable.mjs')).href);
const t0 = Date.now();
const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');
const abs = (rel) => path.join(ROOT, rel);
const readJson = (rel) => { try { return JSON.parse(fs.readFileSync(abs(rel), 'utf8')); } catch (e) { return null; } };
const readText = (rel) => { try { return fs.readFileSync(abs(rel), 'utf8'); } catch (e) { return null; } };
// 木の全ファイルの sha(.git・node_modules・記号のリンクは数えない)
function snapshot() {
  const out = {};
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.name === '.git' || e.name === 'node_modules' || e.isSymbolicLink()) continue;
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p); else if (e.isFile()) out[path.relative(ROOT, p).split(path.sep).join('/')] = sha(fs.readFileSync(p));
    }
  };
  walk(ROOT);
  return out;
}
const report = { version: PG.POSTGATE_VERSION, root: ROOT, stage: null, precondition: null, ran: null, files: null, html: null, json: null, md: null, evidence: null, pass: false, why: [], restored: false, ms: 0 };
const finish = (code) => {
  report.ms = Date.now() - t0;
  const o = getArg('--out', null);
  if (o) fs.writeFileSync(path.resolve(o), JSON.stringify(report, null, 1));
  if (has('--json')) console.log(JSON.stringify(report));
  else {
    console.log(`samplestatus-postgate(${report.version}): ${report.pass ? 'PASS' : 'FAIL'}(rc ${code}・${(report.ms / 1000).toFixed(1)} s)${report.restored ? ' —— 段の書きを走行の前へ戻した' : ''}`);
    if (report.precondition) console.log(`  前提: 保存 QA ${report.precondition.qaCommit ? String(report.precondition.qaCommit).slice(0, 7) : '—'}・${report.precondition.qaDate || '—'}・版名 ${report.precondition.qaBuild || '—'} / 刻印 = 今の html ${report.precondition.sameHtml}`);
    if (report.files) console.log(`  ファイル: ${report.files.n} 本のうち変わった ${report.files.changed.length}(${report.files.changed.join(', ') || '—'})・段の書きの外 ${report.files.disallowed.length} / html 不変 ${report.html && report.html.same}`);
    if (report.json) console.log(`  正本: 差 ${report.json.n}(来歴 ${report.json.provenance}・時間 ${report.json.time}・外 ${report.json.other.length})`);
    if (report.md) console.log(`  一覧 md: 違う行 ${report.md.n}(来歴 ${report.md.provenance}・時間 ${report.md.time}・外 ${report.md.other.length})`);
    if (report.evidence) console.log(`  来歴: evidenceQa ${report.evidence.before.commit ? String(report.evidence.before.commit).slice(0, 7) : '—'} → ${report.evidence.after.commit ? String(report.evidence.after.commit).slice(0, 7) : '—'}(保存 QA と同じ ${report.evidence.evidenceSame})・sameHtml ${report.evidence.sameHtmlBefore} → ${report.evidence.sameHtml}`);
    for (const w of report.why) console.log('  ‼ ' + w);
  }
  process.exit(code);
};
// ---- 段の宣言
const stage = RT.REGEN_STEPS.find((z) => z.key === PG.STAGE_KEY);
if (!stage) { report.why.push('再生成表に段 ' + PG.STAGE_KEY + ' が無い'); finish(3); }
const W = PG.stageWritesOf(stage);
report.stage = { key: stage.key, cmd: stage.cmd, writes: W.writes, allowed: W.allowed, mustStay: W.mustStay, alwaysRun: !!stage.alwaysRun };
if (!(W.allowed.includes(PG.OUT_JSON) && W.allowed.includes(PG.OUT_MD) && W.mustStay.includes(PG.HTML))) { report.why.push('段の書きが道具の前提(正本・md・html)と違う: ' + W.writes.join(', ')); finish(3); }
// ---- ① 前提
const html0 = fs.readFileSync(abs(PG.HTML)), htmlSha0 = sha(html0), Q = readJson(PG.QA_SAVED);
report.precondition = { qaFile: PG.QA_SAVED, qaCommit: Q && Q.commit || null, qaDate: Q && Q.date || null, qaBuild: Q && Q.swCache || null, qaFull: !!(Q && Q.fast === false), sameHtml: !!(Q && Q.targetSha256 === htmlSha0), htmlSha256: htmlSha0 };
if (!Q) { report.why.push('保存 QA ' + PG.QA_SAVED + ' が読めない'); finish(3); }
if (!has('--any-qa') && !(report.precondition.sameHtml && report.precondition.qaFull)) { report.why.push('保存 QA がこの html のフルの QA でない(刻印 ' + String(Q.targetSha256).slice(0, 12) + ' ≠ 今の html ' + htmlSha0.slice(0, 12) + ' か fast)—— ゲートの後に走らせる(--any-qa で外す)'); finish(3); }
// ---- ② 走行(段の書きの前の中身を控える —— 戻すため)
const keepBytes = Object.fromEntries(W.writes.map((f) => [f, fs.existsSync(abs(f)) ? fs.readFileSync(abs(f)) : null]));
const restore = () => { for (const [f, b] of Object.entries(keepBytes)) { if (b === null) { try { fs.unlinkSync(abs(f)); } catch (e) { /* 無い */ } } else fs.writeFileSync(abs(f), b); } report.restored = true; };
const snap0 = snapshot(), json0 = readJson(PG.OUT_JSON), md0 = readText(PG.OUT_MD);
const env = Object.assign({}, process.env); delete env.REGEN_HTML_STAGE;
const r = spawnSync('bash', ['-c', stage.cmd], { cwd: ROOT, env, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
report.ran = { rc: r.status, signal: r.signal || null, stdoutTail: String(r.stdout || '').trim().split('\n').slice(-2).join(' / ').slice(0, 400), stderrTail: String(r.stderr || '').trim().split('\n').slice(-3).join(' / ').slice(0, 400) };
if (r.status !== 0) { report.why.push('段のコマンドが rc ' + r.status + ': ' + report.ran.stderrTail); restore(); finish(2); }
// ---- ③ 照合
const snap1 = snapshot(), json1 = readJson(PG.OUT_JSON), md1 = readText(PG.OUT_MD);
const cmp = PG.compareSnapshots(snap0, snap1, W.allowed);
report.files = Object.assign({ n: Object.keys(snap1).length }, cmp);
report.html = { same: snap0[PG.HTML] === snap1[PG.HTML] && sha(fs.readFileSync(abs(PG.HTML))) === htmlSha0, sha256: htmlSha0 };
const J = PG.classifyJson(json0 || {}, json1 || {});
report.json = { n: J.n, provenance: J.provenance, time: J.time, other: J.other.slice(0, 20).map((z) => ({ ptr: z.ptr, kind: z.kind, a: JSON.stringify(z.a === undefined ? null : z.a).slice(0, 120), b: JSON.stringify(z.b === undefined ? null : z.b).slice(0, 120) })) };
report.json.otherN = J.other.length;
const M = PG.classifyMd(md0 || '', md1 || '');
report.md = { n: M.n, provenance: M.provenance, time: M.time, other: M.other.slice(0, 20) };
const ev1 = ((json1 || {}).meta || {}).evidenceQa || {}, ev0 = ((json0 || {}).meta || {}).evidenceQa || {};
const qp1 = ((json1 || {}).timingNote || {}).qaProvenance || {}, qp0 = ((json0 || {}).timingNote || {}).qaProvenance || {};
report.evidence = { before: { commit: ev0.commit || null, date: ev0.date || null }, after: { commit: ev1.commit || null, date: ev1.date || null },
  evidenceSame: ev1.commit === (Q.commit || null) && ev1.date === (Q.date || null), sameHtmlBefore: qp0.sameHtml === true, sameHtml: qp1.sameHtml === true };
const V = PG.verdictOf({ snap: cmp, json: J, md: M, ev: has('--any-qa') ? null : report.evidence });
if (!report.html.same) V.why.unshift('html が変わった(生成領域 sample-status か全体)');
report.pass = V.pass && report.html.same;
report.why.push(...V.why);
if (has('--dry-run') || (!report.pass && !has('--keep'))) restore();
finish(report.pass ? 0 : 1);
