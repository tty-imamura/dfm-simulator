// 第270便b(第60報 W2・統括の読み (G) AE2): **`record_id` 欄の生成と検査**。
//
// ■ すること
//   ① 3 つの観測 CSV(solar / cluster-galaxy / transient)の**ヘッダ末尾**に `record_id` を足し、
//      全行に ID を振る(`--write`。既に欄があれば振り直して**同じ値になること**を確かめる)。
//   ② **欠損 0・重複 0**を数える。同じ `body|quantity|unit|source` の行(併置行の重複転写)は
//      出現順の枝番 `-2` で分ける(規約は `tests/lib-w270b-obscsv.mjs` の冒頭)。
//   ③ **note 以外の欄が 1 文字も動いていない**ことを、書く前後の解析結果で突き合わせる
//      (行の diff は末尾の `,<id>` だけである)。
//   ④ `paper/data/judgement-sources.json` の宣言 2 件の `record_id` が **CSV に 1 件で当たる**こと。
//   ⑤ **AE15**: `value_checked_at=` / `verified_at=` の値に `;` を含む行が無いこと
//      (`;` は欄の区切りなので、値に入れると読取器が途中で切る)。
//
// ■ しないこと
//   ・value / unit / source / url / retrieved / sigma / note を 1 文字も書き換えない。
//   ・印(`sigma_primary`)を上げ下げしない・判定(4 値)に触らない。
//   ・`solution_id` を作らない(**空欄可** —— 決断事項)。
//
// 実行: node tests/exp-w270b-recordid.mjs [--write]
// 出力: tests/out/recordid-w270b.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseCsvLine, headerIndex, assignRecordIds, loadObsCsv, REQUIRED_COLUMNS }
  from './lib-w270b-obscsv.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WRITE = process.argv.slice(2).indexOf('--write') >= 0;
const OUT = path.join(ROOT, 'tests', 'out', 'recordid-w270b.json');
const FILES = ['solar-observations.csv', 'cluster-galaxy-observations.csv', 'transient-observations.csv'];
const bad = [];

// ---------------------------------------------------------------- ① 生成(と書き込み)
function processFile(rel) {
  const fp = path.join(ROOT, 'paper', 'data', rel);
  const txt = fs.readFileSync(fp, 'utf8');
  const lines = txt.split('\n');
  const H0 = headerIndex(lines[0] || '');
  if (H0.missing.length) bad.push(`${rel}: 必須列が欠けている(${H0.missing.join(',')})`);
  const hadColumn = ('record_id' in H0);
  // 行(ヘッダを除く・空行は飛ばす)
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const c = parseCsvLine(lines[i]);
    rows.push({ i, ln: i + 1, cells: c,
      body: c[H0.body], quantity: c[H0.quantity], unit: c[H0.unit], source: c[H0.source],
      existing: hadColumn ? String(c[H0.record_id] || '').trim() : '' });
  }
  const { ids, collisions } = assignRecordIds(rel, rows);
  // ② 欠損 0・重複 0
  const dup = new Map();
  ids.forEach((id, k) => dup.set(id, (dup.get(id) || []).concat(rows[k].ln)));
  const duplicated = [...dup.entries()].filter(([, v]) => v.length > 1).map(([id, lns]) => ({ id, lns }));
  if (duplicated.length) bad.push(`${rel}: 重複した record_id ${duplicated.length} 件`);
  if (ids.some((id) => !id)) bad.push(`${rel}: 空の record_id がある`);
  // 既に欄があるなら、振り直した値と一致すること(**ID は行番号に依存しない**)
  const changed = [];
  rows.forEach((r, k) => { if (hadColumn && r.existing && r.existing !== ids[k])
    changed.push({ ln: r.ln, from: r.existing, to: ids[k] }); });
  if (changed.length) bad.push(`${rel}: 既存の record_id と振り直しが食い違う ${changed.length} 件`);

  let wrote = false;
  if (WRITE) {
    const out = lines.slice();
    if (!hadColumn) out[0] = lines[0].replace(/\s*$/, '') + ',record_id';
    rows.forEach((r, k) => {
      const line = lines[r.i];
      if (hadColumn) {
        // 末尾の欄を置き換える(**それ以外のバイト列は触らない**)
        const sp = spans(line);
        out[r.i] = line.slice(0, sp[H0.record_id].start) + ids[k];
      } else {
        out[r.i] = line.replace(/\s*$/, '') + ',' + ids[k];
      }
    });
    const nextTxt = out.join('\n');
    // ③ 書く前後で **note 以外の欄が 1 文字も動いていない**
    const a = parseAll(txt), b = parseAll(nextTxt);
    if (a.length !== b.length) bad.push(`${rel}: 行数が変わった`);
    for (let k = 0; k < Math.min(a.length, b.length); k++) {
      for (const n of REQUIRED_COLUMNS.concat(['sigma']))
        if (String(a[k][n] === undefined ? '' : a[k][n]) !== String(b[k][n] === undefined ? '' : b[k][n]))
          bad.push(`${rel}: 行 ${k + 2} の ${n} が動いた`);
    }
    fs.writeFileSync(fp, nextTxt);
    wrote = true;
  }
  return { file: rel, rows: rows.length, hadColumn, wrote,
    idsAssigned: ids.length, duplicated, branched: collisions.filter((c) => c.lns.length > 1),
    sample: rows.slice(0, 3).map((r, k) => ({ ln: r.ln, body: r.body, quantity: r.quantity, id: ids[k] })),
    ids: rows.map((r, k) => ({ ln: r.ln, body: r.body, quantity: r.quantity, unit: r.unit, id: ids[k] })) };
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

// ---------------------------------------------------------------- ④ 宣言の record_id
const loaded = {};
for (const f of FILES) loaded[f] = loadObsCsv(path.join(ROOT, 'paper', 'data', f));
const declPath = path.join(ROOT, 'paper', 'data', 'judgement-sources.json');
let decls = [];
try { decls = (JSON.parse(fs.readFileSync(declPath, 'utf8')).declarations || []); }
catch (e) { bad.push('judgement-sources.json が読めない: ' + String(e).slice(0, 80)); }
const declared = decls.map((d) => {
  const key = d.csvQuantity || d.quantity;
  const hits = (loaded['solar-observations.csv'].rows || [])
    .filter((r) => r.recordId && r.recordId === d.record_id);
  const byString = (loaded['solar-observations.csv'].rows || []).filter((r) =>
    r.body === d.body && r.quantity === key && r.source === d.source && r.unit === d.unit);
  return { body: d.body, quantity: d.quantity, csvQuantity: key,
    declaredRecordId: d.record_id || null,
    hitsByRecordId: hits.length, hitLines: hits.map((r) => r.ln),
    hitsByString: byString.length, stringLines: byString.map((r) => r.ln),
    stringRecordIds: byString.map((r) => r.recordId),
    solutionId: ('solution_id' in d) ? d.solution_id : null,
    agrees: hits.length === 1 && byString.length === 1 && hits[0].ln === byString[0].ln };
});
for (const d of declared) {
  if (!d.declaredRecordId) bad.push(`宣言 ${d.body}|${d.quantity} に record_id が無い`);
  else if (d.hitsByRecordId !== 1)
    bad.push(`宣言 ${d.body}|${d.quantity} の record_id が CSV に ${d.hitsByRecordId} 件当たる`);
  else if (!d.agrees)
    bad.push(`宣言 ${d.body}|${d.quantity} の record_id と文字列出典が別の行を指している`);
}

// ---------------------------------------------------------------- ⑤ AE15(`;` を値に入れない)
const SEMI_KEYS = ['value_checked_at', 'verified_at', 'verified_value', 'value_checked_value',
  'value_checked_by', 'verified_by'];
const KNOWN_NEXT = /^\s*[A-Za-z_][A-Za-z0-9_]*=/;
const semi = { checked: 0, offenders: [] };
for (const f of FILES) for (const r of loaded[f].rows) {
  for (const k of SEMI_KEYS) {
    const re = new RegExp('(?:^|[^A-Za-z0-9_])' + k + '=([^;]*);?([\\s\\S]{0,40})');
    const m = re.exec(r.note);
    if (!m) continue;
    semi.checked++;
    // 値の直後が `;` で終わっているとき、その次が **鍵=** でなければ値の中に `;` があったことになる
    const tail = m[2] || '';
    if (tail !== '' && !KNOWN_NEXT.test(tail) && tail.trim() !== '')
      semi.offenders.push({ file: f, ln: r.ln, key: k, tail: tail.slice(0, 40) });
  }
}
for (const o of semi.offenders)
  bad.push(`AE15: ${o.file}:${o.ln} の ${o.key}= の値が \`;\` で切れている(${o.tail})`);

// ---------------------------------------------------------------- 出力
const out = { when: new Date().toISOString(), wave: '第270便b(第60報・W2・AE2)',
  base: 'main f6c19b4', wrote: WRITE,
  rule: ['`record_id` は**ヘッダ末尾**の 1 欄で、行の diff は `,<id>` だけである',
    'ID = `<PFX>-<sha256(file\\nbody\\nquantity\\nunit\\nsource) の先頭 8 桁>`(PFX = SOL / CLG / TRN)',
    '同じ 5 つ組の 2 件目以降は**出現順の枝番** `-2`(併置行の重複転写を分ける)',
    '**値・単位・出典・σ・note を 1 文字も変えない**(`record_id` は同定の鍵であって印でも σ でもない)',
    '`solution_id` は本便では作らない(**空欄可** —— 決断事項)',
    'CSV を読む器は**列位置でなくヘッダ名**で読む(`tests/lib-w270b-obscsv.mjs`)'],
  files: files.map((f) => ({ file: f.file, rows: f.rows, hadColumn: f.hadColumn, wrote: f.wrote,
    idsAssigned: f.idsAssigned, duplicated: f.duplicated.length,
    branched: f.branched, sample: f.sample })),
  totals: { rows: files.reduce((a, f) => a + f.rows, 0),
    ids: files.reduce((a, f) => a + f.idsAssigned, 0),
    duplicated: files.reduce((a, f) => a + f.duplicated.length, 0) },
  declared, ae15: { checked: semi.checked, offenders: semi.offenders },
  violations: bad,
  doNotWrite: ['record_id を足したので判定が増えた', '観測レコードの同定が完成した',
    '太陽系の σ が揃った'] };
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));

console.log('[w270b] record_id 欄(' + (WRITE ? '**書き込み**' : '検査のみ') + ')');
for (const f of files)
  console.log('  ' + f.file.padEnd(34) + ' 行 ' + String(f.rows).padStart(4)
    + ' / ID ' + String(f.idsAssigned).padStart(4) + ' / 重複 ' + f.duplicated.length
    + ' / 枝番 ' + f.branched.length + ' / 例 ' + (f.sample[0] ? f.sample[0].id : '—'));
for (const d of declared)
  console.log('  宣言 ' + (d.body + '|' + d.quantity).padEnd(22) + ' record_id ' + (d.declaredRecordId || '—')
    + ' → CSV ' + d.hitsByRecordId + ' 件(文字列出典 ' + d.hitsByString + ' 件・一致 ' + d.agrees + ')');
console.log('  AE15: `;` を値に含む行 ' + semi.offenders.length + ' 件(検査 ' + semi.checked + ' 件)');
if (bad.length) console.log('  **違反 ' + bad.length + ' 件**: ' + bad.slice(0, 6).join(' , '));
console.log('→ ' + path.relative(ROOT, OUT));
