#!/usr/bin/env node
// 第303便e(統括の検証項目 R194 —— 第302便の鎖とゲートの教訓 ③)— **ゲートの前の転記照合**(鎖の直後・フルゲートの前に 5〜10 分)。
//
// ■ 何をするか
//   正本(tests/out/*.json)と、それを写した PHYSICS・fitRecord・obsCard の一致を見る QA ブロックを **tests/qa.mjs から機械で列挙**し、
//   部分 QA(tests/exp-w258c-qapart.mjs —— qa.mjs の本文をそのまま切り出して 1 本の Chromium で走らせる)で回す。
//   列挙の規則(qa.mjs の最上位の文 —— tests/lib-w279b-qaorder.mjs の splitTopLevel —— ごとに、注釈の行を除いた本文で判定):
//     名前の型 … id が docs.*Contract*・docs.*-sync・preset.fit*・docs.fit*
//     転記の型 … id が docs.*・preset.* で、本文が正本 JSON(`tests/out/<名>.json` か `'out', '<名>.json'`)を読み、**かつ**転記先(PHYSICS.md・
//               fitRecord・obsCard)を読む(behavior.* の門は鎖の器そのものが rc で止まる・ui.* は表示 —— 転記の照合ではない)
//   --base-rev を渡すと、転記の型は「読む正本のどれかが基点から**意味で**変わった」ブロックだけに絞る(意味 = 再生成表の `semanticSha` ——
//   時刻・所要・来歴の刻印を除いた値。鎖が値を動かした正本だけが転記のずれを起こす)。名前の型は常に入れる。
//   来歴の 2 本(lint.provenanceMeta・lint.regenScope —— 鎖の後は通るはず)も既定で足す(--no-provenance で外す)。
//   第302便のゲート 1 の FAIL 12 件(PHYSICS の表・fitRecord の転記 9・文書の数・来歴の宣言)は、鎖 1 の直後の状態(097574f)でこの道具が拾う型。
//
// ■ 使い方(統括の手順の 1 行): 鎖の直後・ゲートの前に
//     node tools/pregate-transcript.mjs --base-rev <便の基点 sha>     # FAIL・未実行が 1 つでもあれば rc 1 —— ゲートを回さずに処置の枝へ
//   --list(列挙だけ)/ --all(転記の型を変化で絞らない)/ --ids a,b(足す)/ --chunk 30(qapart 1 回のブロック数)/ --json <file> /
//   --root <dir>(別の木 —— git archive で取り出した過去の状態)/ --git-dir <dir>(基点の正本を git show で読む git)/ --no-provenance
//   QA_TARGET は beta/index.html(転記の正本は beta 線)。一時ファイルは $TMPDIR。
//
// ■ 言わないこと
//   ・「転記照合が通ったのでゲートが通る」(フル QA の代わりではない —— 物理・UI・perf は見ない)。
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync, execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const PREGATE_VERSION = 'w303e-pregate-1';
const TOOL_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const NAME_RULES = Object.freeze([/^docs\..*Contract/, /^docs\..*-sync$/, /^preset\.fit/, /^docs\.fit/]);
export const DEST_RE = /PHYSICS\.md|\bfitRecord\b|\bobsCard\b/;
export const CANON_RE = /tests\/out\/([\w.-]+\.json)|'out',\s*'([\w.-]+\.json)'|"out",\s*"([\w.-]+\.json)"/g;
export const PROVENANCE_IDS = Object.freeze(['lint.provenanceMeta', 'lint.regenScope']);
/** 転記の型は文書と本の宣言のブロック(docs.*・preset.*)に限る —— behavior.* の門は鎖の器が rc で止まる・ui.* は表示。 */
export const TR_PREFIX = /^(docs|preset)\./;
const NOT_CANON = /^(qa-results|qa-fingerprints|qa-replay|regen-plan)/;

/**
 * qa.mjs の本文から転記照合のブロックを列挙する(純関数 —— QA lint.harnessSmoke303 が同じ関数で照合する)。
 * @returns {Array<{id, rule:'name'|'transcript'|'both', canon:string[], dest:string[], l0:number}>}
 */
export function enumerateTranscript(qaSrc, QO) {
  const out = [];
  const seen = new Set();
  for (const u of QO.splitTopLevel(qaSrc)) {
    const { ids } = QO.unitIds(u.text);
    if (!ids.length) continue;
    const code = u.text.split('\n').filter((l) => !/^\s*\/\//.test(l)).join('\n');
    const canon = [...new Set([...code.matchAll(CANON_RE)].map((m) => 'tests/out/' + (m[1] || m[2] || m[3])))].filter((f) => !NOT_CANON.test(path.basename(f)));
    const dest = ['PHYSICS.md', 'fitRecord', 'obsCard'].filter((d) => new RegExp(d === 'PHYSICS.md' ? 'PHYSICS\\.md' : '\\b' + d + '\\b').test(code));
    for (const id of ids) {
      if (seen.has(id)) continue;
      const byName = NAME_RULES.some((r) => r.test(id));
      const byTr = TR_PREFIX.test(id) && canon.length > 0 && dest.length > 0;
      if (!byName && !byTr) continue;
      seen.add(id);
      out.push({ id, rule: byName && byTr ? 'both' : (byName ? 'name' : 'transcript'), canon, dest, l0: u.l0 });
    }
  }
  return out;
}

/** 正本の「意味」の差(基点 rev の版と今のファイル)。changed: Set<file>。 */
export function semanticChanges(o) {
  const { root, gitArgs, baseRev, files, RT, tmpDir } = o;
  const changed = new Set(), same = new Set(), why = {};
  for (const f of files) {
    const abs = path.join(root, f);
    const now = RT.semanticSha(abs, f);
    let base = 'missing';
    try {
      const buf = execFileSync('git', gitArgs.concat(['show', baseRev + ':' + f]), { maxBuffer: 1 << 30, stdio: ['ignore', 'pipe', 'ignore'] });
      const t = path.join(tmpDir, 'base-' + path.basename(f));
      fs.writeFileSync(t, buf);
      base = RT.semanticSha(t, f);
      fs.rmSync(t, { force: true });
    } catch { base = 'missing'; }
    if (now === base) same.add(f); else { changed.add(f); why[f] = base === 'missing' ? '基点に無い' : (now === 'missing' ? '今は無い' : '値が変わった'); }
  }
  return { changed, same, why };
}

function runQapart(root, ids, env) {
  const r = spawnSync(process.execPath, [path.join(root, 'tests', 'exp-w258c-qapart.mjs'), ...ids], { cwd: root, env, encoding: 'utf8', maxBuffer: 1 << 28 });
  const text = (r.stdout || '') + '\n' + (r.stderr || '');
  const res = new Map();
  for (const m of text.matchAll(/^(PASS|FAIL) (\S+)(.*)$/gm)) res.set(m[2], { pass: m[1] === 'PASS', detail: (m[3] || '').trim().slice(0, 600) });
  const err = (r.stderr || '').split('\n').find((l) => /Error|Exception/.test(l)) || null;
  return { rc: r.status, res, err, text };
}

async function main(argv) {
  const getArg = (k, d) => { const i = argv.indexOf(k); return (i >= 0 && argv[i + 1] !== undefined) ? argv[i + 1] : d; };
  const root = path.resolve(getArg('--root', TOOL_ROOT));
  const T0 = Date.now();
  const QO = await import(pathToFileURL(path.join(root, 'tests', 'lib-w279b-qaorder.mjs')).href);
  const RT = await import(pathToFileURL(path.join(root, 'tests', 'lib-w281a-regentable.mjs')).href);
  const qaSrc = fs.readFileSync(path.join(root, 'tests', 'qa.mjs'), 'utf8');
  const all = enumerateTranscript(qaSrc, QO);
  const baseRev = getArg('--base-rev', null);
  const gitDir = getArg('--git-dir', null);
  const gitArgs = gitDir ? ['--git-dir', gitDir] : ['-C', root];
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pregate-'));
  let sel = all.slice(), sem = null;
  if (baseRev && !argv.includes('--all')) {
    const files = [...new Set(all.filter((b) => b.rule !== 'name').flatMap((b) => b.canon))];
    sem = semanticChanges({ root, gitArgs, baseRev, files, RT, tmpDir });
    sel = all.filter((b) => b.rule !== 'transcript' || b.canon.some((f) => sem.changed.has(f)));
  }
  const extra = (getArg('--ids', '') || '').split(',').filter(Boolean);
  const ids = [...new Set(sel.map((b) => b.id).concat(argv.includes('--no-provenance') ? [] : PROVENANCE_IDS).concat(extra))];
  const nName = sel.filter((b) => b.rule !== 'transcript').length, nTr = sel.filter((b) => b.rule === 'transcript').length;
  console.log(`pregate-transcript: 列挙 ${all.length} 本(名前の型 ${all.filter((b) => b.rule !== 'transcript').length}・転記の型だけ ${all.filter((b) => b.rule === 'transcript').length})`
    + (sem ? ` → 基点 ${baseRev} から意味で変わった正本 ${sem.changed.size}/${sem.changed.size + sem.same.size} 本を読む転記の型 ${nTr} 本に絞る` : '(絞らない)')
    + ` —— 回す ${ids.length} 本(名前の型 ${nName}・転記の型 ${nTr}・来歴 ${argv.includes('--no-provenance') ? 0 : PROVENANCE_IDS.length}・足した ${extra.length})`);
  if (argv.includes('--list')) {
    for (const b of sel) console.log(`  ${b.rule.padEnd(10)} ${b.id.padEnd(30)} ${b.canon.map((f) => path.basename(f) + (sem && sem.changed.has(f) ? '*' : '')).join(' ')}  → ${b.dest.join(',')}`);
    const js = getArg('--json', null);
    if (js) fs.writeFileSync(path.resolve(js), JSON.stringify({ version: PREGATE_VERSION, root, baseRev, all, selected: ids, changed: sem ? [...sem.changed] : null }, null, 1));
    fs.rmSync(tmpDir, { recursive: true, force: true });
    process.exit(0);
  }
  const env = Object.assign({}, process.env, { QA_TARGET: 'beta/index.html', TMPDIR: tmpDir });
  if (!env.PLAYWRIGHT_CORE_DIR && fs.existsSync('/opt/node22/lib/node_modules/playwright')) env.PLAYWRIGHT_CORE_DIR = '/opt/node22/lib/node_modules/playwright';
  const chunk = Math.max(1, Number(getArg('--chunk', 30)));
  const results = new Map();
  const errs = [];
  for (let i = 0; i < ids.length; i += chunk) {
    const part = ids.slice(i, i + chunk);
    const r = runQapart(root, part, env);
    for (const [k, v] of r.res) results.set(k, v);
    // 切り出しの例外で結果の無い id は 1 本ずつ回し直す(それまでの PASS/FAIL は有効 —— 部分 QA の限界)
    for (const id of part.filter((x) => !r.res.has(x))) {
      const r1 = runQapart(root, [id], env);
      for (const [k, v] of r1.res) results.set(k, v);
      if (!r1.res.has(id)) errs.push(id + ': ' + (r1.err || 'rc ' + r1.rc));
    }
  }
  const rows = ids.map((id) => ({ id, rule: (sel.find((b) => b.id === id) || { rule: PROVENANCE_IDS.includes(id) ? 'provenance' : 'extra' }).rule,
    pass: results.has(id) ? results.get(id).pass : null, detail: results.has(id) ? results.get(id).detail : null }));
  const fail = rows.filter((r) => r.pass === false), none = rows.filter((r) => r.pass === null);
  for (const r of fail) console.log(`  FAIL ${r.id}  ${String(r.detail || '').replace(/\s+/g, ' ').slice(0, 220)}`);
  for (const r of none) console.log(`  未実行 ${r.id}(切り出しの例外 —— 部分 QA の限界。フル QA で見る)`);
  const ok = !fail.length && !none.length;
  const summary = `pregate-transcript: ${rows.length} 本 —— PASS ${rows.filter((r) => r.pass === true).length}・FAIL ${fail.length}・未実行 ${none.length}`
    + `(所要 ${((Date.now() - T0) / 60000).toFixed(1)} min)→ ${ok ? 'OK —— ゲートへ' : 'NG —— ゲートを回さずに処置へ'}`;
  console.log(summary);
  const js = getArg('--json', null);
  if (js) fs.writeFileSync(path.resolve(js), JSON.stringify({ version: PREGATE_VERSION, root, baseRev, changed: sem ? [...sem.changed] : null, rows, errs, summary, ok }, null, 1));
  fs.rmSync(tmpDir, { recursive: true, force: true });
  process.exit(ok ? 0 : 1);
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) await main(process.argv.slice(2));
