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
// ■ 第271便b(第61報・統括の検証項目 R7 / AF15)で塞いだ穴 —— **書込器の 3 つ**
//   (R7-a) `--write` が `line.slice(0, sp[record_id].start) + id` と書いていたので、
//          **record_id より後ろの列を捨てていた**。第271便b で `solution_id` を足したので、
//          このままだと欄が 1 回の `--write` で消える。→ **セルだけを置換**する
//          (`line.slice(0, start) + id + line.slice(end)`)。
//   (R7-b) `bad`(違反)が 1 件でもあるのに**書いていた**。→ 違反があるときは**書かない**。
//   (R7-c) 書く前後の突き合わせが `REQUIRED_COLUMNS + sigma` だけだった。→ **record_id 以外の
//          全列**(ヘッダに現れる名前すべて)を突き合わせる。
//   (AF15) **既存の ID は正本**である。振り直しと食い違っても**振り直さない**
//          (`driftedKeys` として報告するだけで違反にしない —— ID を振り直すと、その ID で
//          同定している宣言・過去のハンドオフ・外部の引用が全部ずれる)。新規行(セルが空の行)
//          だけ採番し、**採番先が既存 ID と衝突しないこと**を検査する。
//   (自己テスト)擬似 CSV(メモリ上の文字列)で入出力を突き合わせる —— 後続列の保持・
//          非 ID 列の不変・空セルだけの採番・違反時に書かないこと。
//
// 実行: node tests/exp-w270b-recordid.mjs [--write] [--selftest-only]
// 出力: tests/out/recordid-w270b.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseCsvLine, headerIndex, assignRecordIds, loadObsCsv }
  from './lib-w270b-obscsv.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WRITE = process.argv.slice(2).indexOf('--write') >= 0;
const SELFTEST_ONLY = process.argv.slice(2).indexOf('--selftest-only') >= 0;
const OUT = path.join(ROOT, 'tests', 'out', 'recordid-w270b.json');
const FILES = ['solar-observations.csv', 'cluster-galaxy-observations.csv', 'transient-observations.csv'];
const bad = [];
// 第271便b(AF15): **振り直しと食い違う既存 ID** は違反ではなく報告項目である。
const driftedKeys = [];

// ---------------------------------------------------------------- 純関数(擬似 CSV でも同じものを使う)
/**
 * 第271便b(R7): **`record_id` の欄だけ**を差し替えた CSV 本文を作る(**後続列を保持**する)。
 * @param {string} txt 元の CSV 本文
 * @param {(i:number)=>string} idAt 行インデックス(0 始まり・データ行の順)→ 書き込む ID
 */
export function rewriteRecordIdColumn(txt, idAt) {
  const lines = txt.split('\n');
  const H = headerIndex(lines[0] || '');
  const hadColumn = ('record_id' in H);
  const out = lines.slice();
  if (!hadColumn) out[0] = lines[0].replace(/\s*$/, '') + ',record_id';
  let k = 0;
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const id = idAt(k++);
    if (hadColumn) {
      const sp = spans(lines[i]);
      const s = sp[H.record_id];
      // **セルだけ置換**(第270便b は `slice(0, s.start) + id` で後続列を捨てていた)
      out[i] = (s === undefined) ? (lines[i].replace(/\s*$/, '') + ',' + id)
        : (lines[i].slice(0, s.start) + id + lines[i].slice(s.end));
    } else {
      out[i] = lines[i].replace(/\s*$/, '') + ',' + id;
    }
  }
  return out.join('\n');
}

/** ヘッダに現れる**全列**を名前で突き合わせる(`skip` の列だけ除く)。食い違った欄名を返す。 */
export function diffAllColumns(beforeTxt, afterTxt, skip = ['record_id']) {
  const a = parseAll(beforeTxt), b = parseAll(afterTxt);
  const diffs = [];
  if (a.length !== b.length) return ['(行数 ' + a.length + ' → ' + b.length + ')'];
  const names = [...new Set([...Object.keys(headerIndex(beforeTxt.split('\n')[0] || '')),
    ...Object.keys(headerIndex(afterTxt.split('\n')[0] || ''))])].filter((n) => skip.indexOf(n) < 0);
  for (let k = 0; k < a.length; k++) for (const n of names) {
    const x = (a[k][n] === undefined) ? '' : String(a[k][n]);
    const y = (b[k][n] === undefined) ? '' : String(b[k][n]);
    if (x !== y) diffs.push('行 ' + (k + 2) + ' の ' + n);
  }
  return diffs;
}

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
  const { ids: fresh, collisions } = assignRecordIds(rel, rows);
  // 第271便b(AF15): **既存の ID は正本**である。振り直しと食い違っても振り直さない
  //   (ID を振り直すと、その ID で同定している宣言・過去のハンドオフ・外部の引用が全部ずれる)。
  //   新規行(セルが空の行)だけ採番する。
  const ids = rows.map((r, k) => (r.existing !== '' ? r.existing : fresh[k]));
  const newlyAssigned = rows.map((r, k) => (r.existing === '' ? { ln: r.ln, id: fresh[k] } : null))
    .filter(Boolean);
  const drifted = [];
  rows.forEach((r, k) => { if (r.existing !== '' && r.existing !== fresh[k])
    drifted.push({ ln: r.ln, body: r.body, quantity: r.quantity, kept: r.existing, wouldBe: fresh[k] }); });
  for (const d of drifted) driftedKeys.push(Object.assign({ file: rel }, d));

  // ② 欠損 0・重複 0(**採る値**で数える)
  const dup = new Map();
  ids.forEach((id, k) => dup.set(id, (dup.get(id) || []).concat(rows[k].ln)));
  const duplicated = [...dup.entries()].filter(([, v]) => v.length > 1).map(([id, lns]) => ({ id, lns }));
  if (duplicated.length) bad.push(`${rel}: 重複した record_id ${duplicated.length} 件`);
  if (ids.some((id) => !id)) bad.push(`${rel}: 空の record_id がある`);
  // 新規採番が既存 ID と衝突していないこと(**採番は既存を上書きしない**)
  const existingSet = new Set(rows.filter((r) => r.existing !== '').map((r) => r.existing));
  for (const n of newlyAssigned) if (existingSet.has(n.id))
    bad.push(`${rel}: 行 ${n.ln} の新規採番 ${n.id} が既存 ID と衝突する`);

  let wrote = false, allColumnDiffs = [];
  if (WRITE) {
    const nextTxt = rewriteRecordIdColumn(txt, (k) => ids[k]);
    // ③ 書く前後で **`record_id` 以外の全列が 1 文字も動いていない**(後続列を含む)
    allColumnDiffs = diffAllColumns(txt, nextTxt, ['record_id']);
    for (const d of allColumnDiffs.slice(0, 5)) bad.push(`${rel}: ${d} が動いた`);
    // R7-b: **違反が 1 件でもあるときは書かない**
    if (bad.length === 0) { fs.writeFileSync(fp, nextTxt); wrote = true; }
  }
  return { file: rel, rows: rows.length, hadColumn, wrote,
    skippedBecauseViolations: WRITE && !wrote,
    idsAssigned: ids.length, newlyAssigned: newlyAssigned.length, drifted,
    allColumnDiffs: allColumnDiffs.length,
    duplicated, branched: collisions.filter((c) => c.lns.length > 1),
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

// ---------------------------------------------------------------- 第271便b(R7): 擬似 CSV の自己テスト
// **正本の CSV を 1 バイトも触らない**(すべてメモリ上の文字列で行う)。
function selfTest() {
  const cases = [];
  const hdr = 'body,quantity,value,unit,source,url,retrieved,note,sigma,record_id,solution_id';
  const L1 = 'A,p,1,s,S1,u,2026-01-01,"n, with comma",0.5,SOL-aaaaaaaa,Sol1999-X';
  const L2 = 'B,q,2,d,S2,u,2026-01-01,n2,,SOL-bbbbbbbb,';
  const txt = [hdr, L1, L2, ''].join('\n');
  // (a) 後続列(`solution_id`)が保持される
  {
    const next = rewriteRecordIdColumn(txt, (k) => ['SOL-cccccccc', 'SOL-bbbbbbbb'][k]);
    const rows = parseAll(next);
    const ok = rows.length === 2 && rows[0].solution_id === 'Sol1999-X' && rows[1].solution_id === ''
      && rows[0].record_id === 'SOL-cccccccc' && rows[0].note === 'n, with comma';
    cases.push({ case: 'trailing-column-kept', ok,
      got: rows[0] ? { record_id: rows[0].record_id, solution_id: rows[0].solution_id } : null });
    if (!ok) bad.push('自己テスト: 後続列が保持されない');
  }
  // (b) `record_id` 以外の全列が不変
  {
    const next = rewriteRecordIdColumn(txt, () => 'SOL-dddddddd');
    const diffs = diffAllColumns(txt, next, ['record_id']);
    cases.push({ case: 'other-columns-frozen', ok: diffs.length === 0, diffs });
    if (diffs.length) bad.push('自己テスト: record_id 以外の列が動いた(' + diffs.join(',') + ')');
  }
  // (c) 欄が無い CSV には**末尾に足す**(既存のバイト列は動かない)
  {
    const noId = [hdr.replace(',record_id,solution_id', ''),
      L1.replace(',SOL-aaaaaaaa,Sol1999-X', ''), ''].join('\n');
    const next = rewriteRecordIdColumn(noId, () => 'SOL-eeeeeeee');
    const rows = parseAll(next);
    const ok = next.split('\n')[0].endsWith(',record_id') && rows[0].record_id === 'SOL-eeeeeeee'
      && diffAllColumns(noId, next, ['record_id']).length === 0;
    cases.push({ case: 'append-column', ok });
    if (!ok) bad.push('自己テスト: 欄の新規追加が規約どおりでない');
  }
  // (d) **空セルだけ採番し、既存 ID は動かさない**(AF15)
  {
    const withHole = [hdr, L1, L2.replace(',SOL-bbbbbbbb,', ',,'), ''].join('\n');
    const H = headerIndex(withHole.split('\n')[0]);
    const rows = parseAll(withHole);
    const existing = rows.map((r) => String(r.record_id || '').trim());
    const freshIds = ['SOL-99999999', 'SOL-88888888'];
    const take = rows.map((r, k) => (existing[k] !== '' ? existing[k] : freshIds[k]));
    const next = rewriteRecordIdColumn(withHole, (k) => take[k]);
    const after = parseAll(next);
    const ok = after[0].record_id === 'SOL-aaaaaaaa' && after[1].record_id === 'SOL-88888888'
      && H.record_id === 9;
    cases.push({ case: 'fill-empty-only', ok,
      got: after.map((r) => r.record_id) });
    if (!ok) bad.push('自己テスト: 空セルだけの採番が規約どおりでない');
  }
  return cases;
}
const selfTestCases = selfTest();

const files = SELFTEST_ONLY ? [] : FILES.map(processFile);

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
const out = { when: new Date().toISOString(),
  wave: '第270便b(第60報・W2・AE2)/ 第271便b(第61報・R7・AF15 で書込器を直した)',
  base: 'main ef2cd45', wrote: WRITE,
  selfTest: { cases: selfTestCases, passed: selfTestCases.filter((c) => c.ok).length,
    n: selfTestCases.length },
  driftedKeys,
  rule: ['`record_id` は**ヘッダ末尾側**の 1 欄で、行の diff は `,<id>` だけである',
    '第271便b(R7): `--write` は **`record_id` のセルだけ**を置換する(後続の `solution_id` を捨てない)',
    '第271便b(R7): **違反が 1 件でもあれば書かない**・`record_id` 以外の**全列**の不変を検査する',
    '第271便b(AF15): **既存の ID は正本**(振り直しと食い違っても振り直さず `driftedKeys` に報告する)。'
      + '採番するのは**セルが空の行**だけで、既存 ID との衝突を検査する',
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

console.log('[w270b/w271b] record_id 欄(' + (WRITE ? '**書き込み**' : '検査のみ') + ')');
console.log('  自己テスト(擬似 CSV): ' + selfTestCases.filter((c) => c.ok).length + '/'
  + selfTestCases.length + ' —— ' + selfTestCases.map((c) => c.case + '=' + (c.ok ? 'OK' : '**NG**')).join(' / '));
console.log('  既存 ID と振り直しの食い違い(driftedKeys・**振り直さない**): ' + driftedKeys.length + ' 件');
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
