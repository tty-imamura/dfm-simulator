// 第271便b(第61報・AF4): **`solution_id` 欄**(観測 CSV のヘッダ末尾・`record_id` の後ろ)。
//
// ■ なぜ要るか
//   第270便c(AD9)で「同じ系の P・e・ω̇ が**別々の公表解**から来ていた」混在(X4)を閉じたが、
//   どの行がどの公表解の列から来たかは **note の自由文** `solution=<id>` にしかなかった。
//   欄にすると、読取器が**語境界の自由文照合をせずに**行の出所を引ける。
//
// ■ 規約(**値・単位・出典・σ・印・来歴を 1 文字も変えない**)
//   ・置き場所は**ヘッダ末尾**(`… ,sigma,record_id,solution_id`)。行の diff は末尾の `,<id>` だけ。
//   ・付けるのは、その行の note が**語境界で** `solution=<id>` を持ち、かつ `id` が
//     `paper/data/solutions.json` の台帳にある行だけである。それ以外は**空欄**。
//   ・`adopted_solution=<id>` は「**この系の採用解は <id> である**」という指し先であって、
//     **その行の値がその解から来たという意味ではない** —— 太陽系 CSV 行 145/146 は
//     `adopted_solution=Meng2025-DDFWHE` を持つが、値は Stovall 2018 の転写である。
//     したがって `adopted_solution=` だけの行には `solution_id` を**付けない**(本器が数えて報告する)。
//   ・空欄は「解が無い」ではなく「**台帳に登録していない**」である。
//
// ■ 本器がしないこと
//   ・エンジンを 1 步も走らせない・印を上げ下げしない・判定(4 値)に触らない。
//   ・`solution=` の綴りから台帳の欄(論文・表・元期)を**推測して埋めない**。
//
// 実行: node tests/exp-w271b-solutionid.mjs [--write]
// 出力: tests/out/solutionid-w271b.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseCsvLine, headerIndex, loadObsCsv, REQUIRED_COLUMNS, solutionTag }
  from './lib-w270b-obscsv.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WRITE = process.argv.slice(2).indexOf('--write') >= 0;
const OUT = path.join(ROOT, 'tests', 'out', 'solutionid-w271b.json');
const FILES = ['solar-observations.csv', 'cluster-galaxy-observations.csv', 'transient-observations.csv'];
const LEDGER = path.join(ROOT, 'paper', 'data', 'solutions.json');
const bad = [];

// ---------------------------------------------------------------- 台帳
let ledger = null;
try { ledger = JSON.parse(fs.readFileSync(LEDGER, 'utf8')); }
catch (e) { bad.push('solutions.json が読めない: ' + String(e).slice(0, 80)); }
const REQ = ['id', 'body', 'paper', 'table', 'model', 'epoch', 'timeScale', 'printedRecord',
  'exampleRecordId'];
const known = new Map();
for (const s of ((ledger || {}).solutions || [])) {
  for (const k of REQ) if (typeof s[k] !== 'string' || s[k].trim() === '')
    bad.push(`台帳 ${s.id} の欄 ${k} が非空の文字列でない`);
  if (known.has(s.id)) bad.push(`台帳に同じ id が 2 件ある: ${s.id}`);
  else known.set(s.id, s);
}
if (ledger && ledger.schemaVersion !== 1) bad.push('solutions.json の schemaVersion が 1 でない');

// ---------------------------------------------------------------- 1 ファイル分
function processFile(rel) {
  const fp = path.join(ROOT, 'paper', 'data', rel);
  const txt = fs.readFileSync(fp, 'utf8');
  const lines = txt.split('\n');
  const H0 = headerIndex(lines[0] || '');
  if (H0.missing.length) bad.push(`${rel}: 必須列が欠けている(${H0.missing.join(',')})`);
  if (!('record_id' in H0)) bad.push(`${rel}: record_id 欄が無い(先に exp-w270b-recordid を回す)`);
  const hadColumn = ('solution_id' in H0);
  if (hadColumn && H0.solution_id !== H0.record_id + 1)
    bad.push(`${rel}: solution_id が record_id の直後に無い`);

  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const c = parseCsvLine(lines[i]);
    const note = c[H0.note] === undefined ? '' : c[H0.note];
    rows.push({ i, ln: i + 1, cells: c, note,
      body: c[H0.body], quantity: c[H0.quantity],
      recordId: String(c[H0.record_id] || '').trim(),
      existing: hadColumn ? String(c[H0.solution_id] || '').trim() : '',
      tag: solutionTag(note), adopted: solutionTag(note, 'adopted_solution') });
  }
  // 付ける値(**台帳にある解タグの行だけ**)
  const byId = {}, adoptedOnly = [], unregistered = {};
  const want = rows.map((r) => {
    if (r.tag && known.has(r.tag)) { (byId[r.tag] = byId[r.tag] || []).push(r.ln); return r.tag; }
    if (r.tag) { (unregistered[r.tag] = unregistered[r.tag] || []).push(r.ln); return ''; }
    if (r.adopted) adoptedOnly.push({ ln: r.ln, body: r.body, quantity: r.quantity,
      adopted: r.adopted, recordId: r.recordId });
    return '';
  });
  // 既にある値との食い違い(**既存の欄は正本** —— 本器は振り直しの差を報告するだけ)
  const drifted = [];
  rows.forEach((r, k) => { if (hadColumn && r.existing !== want[k])
    drifted.push({ ln: r.ln, from: r.existing, to: want[k] }); });

  let wrote = false;
  if (WRITE) {
    if (bad.length) { // **違反があるときは書かない**
      return { file: rel, rows: rows.length, hadColumn, wrote: false, assigned: 0,
        byId, adoptedOnly, unregistered, drifted, skippedBecauseViolations: true };
    }
    const out = lines.slice();
    if (!hadColumn) {
      out[0] = lines[0].replace(/\s*$/, '') + ',solution_id';
      rows.forEach((r, k) => { out[r.i] = lines[r.i].replace(/\s*$/, '') + ',' + want[k]; });
    } else {
      rows.forEach((r, k) => {
        const sp = spans(lines[r.i]);
        const s = sp[H0.solution_id];
        out[r.i] = lines[r.i].slice(0, s.start) + want[k] + lines[r.i].slice(s.end);
      });
    }
    const nextTxt = out.join('\n');
    // **solution_id 以外の欄が 1 文字も動いていない**
    const a = parseAll(txt), b = parseAll(nextTxt);
    if (a.length !== b.length) bad.push(`${rel}: 行数が変わった`);
    const cols = REQUIRED_COLUMNS.concat(['sigma', 'record_id']);
    for (let k = 0; k < Math.min(a.length, b.length); k++)
      for (const n of cols)
        if (String(a[k][n] === undefined ? '' : a[k][n]) !== String(b[k][n] === undefined ? '' : b[k][n]))
          bad.push(`${rel}: 行 ${k + 2} の ${n} が動いた`);
    if (!bad.length) { fs.writeFileSync(fp, nextTxt); wrote = true; }
  }
  return { file: rel, rows: rows.length, hadColumn, wrote,
    assigned: want.filter((v) => v !== '').length,
    byId: Object.fromEntries(Object.entries(byId).map(([k, v]) => [k, { n: v.length, lns: v }])),
    adoptedOnly, unregistered: Object.fromEntries(Object.entries(unregistered)
      .map(([k, v]) => [k, { n: v.length, lns: v }])),
    drifted };
}
function spans(line) {
  const out = []; let cur = '', q = false, start = 0;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (q) { if (ch === '"') { if (line[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += ch; }
    else if (ch === '"') q = true;
    else if (ch === ',') { out.push({ v: cur, start, end: i }); cur = ''; start = i + 1; }
    else cur += ch;
  }
  out.push({ v: cur, start, end: line.length });
  return out;
}
function parseAll(txt) {
  const lines = txt.split('\n');
  const H = headerIndex(lines[0] || '');
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const c = parseCsvLine(lines[i]);
    const r = {};
    for (const n of Object.keys(H)) r[n] = c[H[n]];
    rows.push(r);
  }
  return rows;
}

const files = FILES.map(processFile);

// ---------------------------------------------------------------- 台帳の `printedRecord` を CSV で照合
const loaded = {};
for (const f of FILES) loaded[f] = loadObsCsv(path.join(ROOT, 'paper', 'data', f));
const allRows = FILES.flatMap((f) => loaded[f].rows);
const ledgerCheck = [...known.values()].map((s) => {
  const hits = allRows.filter((r) => r.recordId === s.exampleRecordId);
  const o = { id: s.id, exampleRecordId: s.exampleRecordId, hits: hits.length,
    printedRecordFoundInNote: false, solutionIdOfExample: null };
  if (hits.length !== 1) { bad.push(`台帳 ${s.id} の exampleRecordId が CSV に ${hits.length} 件当たる`); return o; }
  o.printedRecordFoundInNote = String(hits[0].note).indexOf(s.printedRecord) >= 0;
  o.solutionIdOfExample = hits[0].solutionId || null;
  if (!o.printedRecordFoundInNote)
    bad.push(`台帳 ${s.id} の printedRecord が行 ${hits[0].ln} の note に無い`);
  return o;
});

// ---------------------------------------------------------------- 宣言 JSON の solution_id
const declPath = path.join(ROOT, 'paper', 'data', 'judgement-sources.json');
let decls = [];
try { decls = (JSON.parse(fs.readFileSync(declPath, 'utf8')).declarations || []); }
catch (e) { bad.push('judgement-sources.json が読めない: ' + String(e).slice(0, 80)); }
const declared = decls.map((d) => {
  const hits = allRows.filter((r) => r.recordId && r.recordId === d.record_id);
  const rowSid = hits.length === 1 ? (hits[0].solutionId || '') : null;
  const declSid = typeof d.solution_id === 'string' ? d.solution_id : null;
  const o = { body: d.body, quantity: d.quantity, record_id: d.record_id || null,
    declaredSolutionId: declSid, rowSolutionId: rowSid, agrees: rowSid !== null && rowSid === declSid };
  if (declSid === null) bad.push(`宣言 ${d.body}|${d.quantity} に solution_id 欄が無い`);
  else if (declSid !== '' && !known.has(declSid))
    bad.push(`宣言 ${d.body}|${d.quantity} の solution_id が台帳に無い(${declSid})`);
  else if (!o.agrees)
    bad.push(`宣言 ${d.body}|${d.quantity} の solution_id が CSV 行と違う(宣言 "${declSid}" / 行 "${rowSid}")`);
  return o;
});

// ---------------------------------------------------------------- 出力
const totals = { rows: files.reduce((a, f) => a + f.rows, 0),
  assigned: files.reduce((a, f) => a + f.assigned, 0),
  adoptedOnly: files.reduce((a, f) => a + (f.adoptedOnly || []).length, 0),
  unregisteredTags: files.reduce((a, f) => a + Object.keys(f.unregistered || {}).length, 0) };
const out = { when: new Date().toISOString(), wave: '第271便b(2026-09-18・第61報・AF4)',
  base: 'main ef2cd45', wrote: WRITE,
  rule: ['`solution_id` は**ヘッダ末尾**(`record_id` の後ろ)の 1 欄で、行の diff は `,<id>` だけである',
    '付けるのは note が**語境界で** `solution=<id>` を持ち、`id` が `paper/data/solutions.json` にある行だけ',
    '`adopted_solution=<id>` は**指し先**であって行の出所ではない(その行には付けない)',
    '空欄は「解が無い」ではなく「**台帳に登録していない**」である',
    '**値・単位・出典・σ・印・来歴を 1 文字も変えない**'],
  ledger: { file: 'paper/data/solutions.json', n: known.size, ids: [...known.keys()],
    notRegistered: ((ledger || {}).notRegistered || []).map((x) => x.tag), check: ledgerCheck },
  files, totals, declared,
  violations: bad,
  doNotWrite: ['solution_id を足したので判定が増えた', '解の混在が全部解けた',
    '採用解が決まったので残差が縮んだ'] };
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));

console.log('[w271b] solution_id 欄(' + (WRITE ? '**書き込み**' : '検査のみ') + ')');
for (const f of files) {
  console.log('  ' + f.file.padEnd(34) + ' 行 ' + String(f.rows).padStart(4)
    + ' / 付与 ' + String(f.assigned).padStart(3)
    + ' / adopted_solution だけの行 ' + (f.adoptedOnly || []).length
    + ' / 台帳外の解タグ ' + Object.keys(f.unregistered || {}).length);
  for (const [k, v] of Object.entries(f.byId || {}))
    console.log('      ' + k.padEnd(20) + ' ' + String(v.n).padStart(3) + ' 行  ' + v.lns.join(','));
  for (const [k, v] of Object.entries(f.unregistered || {}))
    console.log('      (台帳外) ' + k.padEnd(20) + ' ' + String(v.n).padStart(3) + ' 行');
  for (const a of (f.adoptedOnly || []))
    console.log('      (指し先だけ) 行 ' + a.ln + ' ' + a.body + '|' + a.quantity
      + ' adopted_solution=' + a.adopted + ' → solution_id は空欄');
}
for (const d of declared)
  console.log('  宣言 ' + (d.body + '|' + d.quantity).padEnd(30) + ' solution_id "'
    + d.declaredSolutionId + '" / 行 "' + d.rowSolutionId + '" 一致 ' + d.agrees);
console.log('  台帳 ' + known.size + ' 件: ' + ledgerCheck.map((c) => c.id + '('
  + (c.printedRecordFoundInNote ? '原記載 照合' : '**原記載 不一致**') + ')').join(' / '));
if (bad.length) console.log('  **違反 ' + bad.length + ' 件**: ' + bad.slice(0, 6).join(' , '));
console.log('→ ' + path.relative(ROOT, OUT));
