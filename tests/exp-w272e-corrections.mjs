// 第272便e(第62報・AG18): **変更履歴の台帳**(`paper/data/corrections.json`)の検査器。
//
// ■ 第273便e(第63報・AH18)で広げた範囲(**値は 1 つも作っていない**)
//   第272便e の台帳は**転写者側の訂正だけ**を載せ、次の 2 つを `notInThisLedger` に書いて外していた:
//     ・**確認記録による印の一括更新**(第266便a の 21 行・第267便a の 23 行 = 44 行)
//     ・**値も印も動かさない注記 3 件**(行 115 の丸め差・`solution_mix=`・外部照合印 `value_checked_by=`)
//   AH18 の裁定でこの 2 つを台帳へ入れた。入れ方は:
//     ・一括更新は `records` の revision に `kind:"confirmation"` と **`bulk`(操作 id)**を付ける。
//       印が動いた行は `field:"mark"`、**印は動かず確認者欄だけが入った行**は `field:"verified_by"`
//       (欄が無かったので `previous:null` + `previousAbsent:true`)。
//     ・注記は **`annotations`** に置く(`revisions` ではない —— **変更ではないから**)。
//       各注記は「note の鍵」と「その鍵を持つ record_id の並び」を宣言し、本器が実在を照合する。
//   件数 pin は**便ごとのスナップショット**である(この器が数えた値へ QA 側を合わせる運用)。
//
// ■ 何を見るか(**値は作らない** —— 現行値の正本は CSV である)
//   ① 台帳の `record_id` が観測 CSV に**存在する**。
//   ② 各 revision の `current` が**現行の CSV の値と一致する**
//      (`value`/`sigma`/`unit`/`source`/`url`/`quantity` は欄そのもの・`mark` は `sigma_primary` の
//       厳密読み・`note` は note に含まれていること・`added` は追加された行の value)。
//   ③ `markKey` が note に**機械可読な印として残っている**(`<markKey>=`)。
//   ④ **取りこぼしが無い**: CSV の中で訂正の印を持つ行は、1 行残らず台帳に載っている
//      (逆方向は ① が見る)。
//   ⑤ `previous` と `current` が**違う**(`added`・`previousRedacted:true`・`previousAbsent:true`
//      を除く。`previousAbsent` は「その欄が変更前に**無かった**」であって「空だった」ではない)。
//   ⑥ `revision` が record ごとに 1 から連番。
//   ⑦(第273便e・AH18)`annotations` の各注記の `records` が CSV に実在し、宣言した鍵 `<key>=` が
//      **その全行の note にある**。注記は値も印も動かさないので `previous`/`current` を持たない。
//
// ■ この器がしないこと
//   ・CSV を書かない・印を上げ下げしない・判定(4 値)に触らない・一次資料の値を触らない。
//   ・`previous` が正しいかを**再検証しない**(旧値は git 履歴が正本であり、台帳の
//     `previousSourceHash` がその commit の CSV を指す)。**「再検証済み」とは書かない。**
//
// 実行: node tests/exp-w272e-corrections.mjs
// 出力: tests/out/corrections-w272e.json(`.gitignore` に例外行あり)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadObsCsv } from './lib-w270b-obscsv.mjs';
import { readSigmaMark, readVerifiedBy } from './lib-w264d-sigmamark.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LEDGER_REL = 'paper/data/corrections.json';
const OUT = path.join(ROOT, 'tests', 'out', 'corrections-w272e.json');

/** 訂正の印(**この鍵を持つ行は台帳に載っていなければならない**)。 */
export const MARK_KEYS = ['corrected', 'url_corrected', 'source_corrected', 'quantity_corrected',
  'unit_corrected', 'value_corrected', 'sigma_corrected', 'previous_mark',
  'external_name_neutralised', 'proxy_for_scope', 'list_separator_corrected',
  // 第273便e(AH16 (a)): `derived_from` の参照を record_id へ書き換えた行の印。
  'derived_from_resolved'];
/** 第273便e(AH18): revision の `kind` の語彙(欄が無い revision は `correction`)。 */
export const KINDS = ['correction', 'confirmation'];
const hasKey = (note, key) =>
  new RegExp('(?:^|[^A-Za-z0-9_])' + key + '=').test(String(note || ''));

const CSV_FILES = ['solar-observations.csv', 'cluster-galaxy-observations.csv',
  'transient-observations.csv', 'supernova-observations.csv', 'jovian-satellites.csv'];

const bad = [];
let ledger = null;
try { ledger = JSON.parse(fs.readFileSync(path.join(ROOT, LEDGER_REL), 'utf8')); }
catch (e) { bad.push('台帳が読めない: ' + String(e).slice(0, 120)); }

// ---- CSV を読む(ヘッダ名引き 1 本)
const rowsByFile = {}, rowById = new Map();
for (const f of CSV_FILES) {
  const L = loadObsCsv(path.join(ROOT, 'paper', 'data', f));
  rowsByFile[f] = L.rows;
  for (const r of L.rows) if (r.recordId) rowById.set(r.recordId, Object.assign(r, { _file: f }));
}

// ---- 現行値の引き方(**欄は 1 つも作らない**)
function currentOf(row, field) {
  switch (field) {
    case 'value': case 'added': return row.rawValue;
    case 'sigma': return row.rawSigma;
    case 'unit': return row.unit;
    case 'source': return row.source;
    case 'url': return row.url;
    case 'quantity': return row.quantity;
    case 'mark': return readSigmaMark(row.note).mark;
    case 'note': return row.note;
    // 第273便e(AH18): X7 の確認者欄(**印ではない** —— `verified` へ上げる力は 1 bit も無い)
    case 'verified_by': return readVerifiedBy(row.note).who;
    default: return undefined;
  }
}
const FIELDS = ['value', 'sigma', 'unit', 'source', 'url', 'quantity', 'mark', 'note',
  'verified_by', 'added'];

const checked = [];
let revisionCount = 0;
const records = (ledger && ledger.records) ? ledger.records : {};
for (const [id, rec] of Object.entries(records)) {
  const row = rowById.get(id) || null;
  if (!row) { bad.push('①台帳の record_id が CSV に無い: ' + id); continue; }
  if (rec.file && row._file !== rec.file)
    bad.push('①' + id + ' の file が食い違う(台帳 ' + rec.file + ' ≠ CSV ' + row._file + ')');
  if (rec.body !== undefined && rec.body !== row.body)
    bad.push('①' + id + ' の body が食い違う(' + rec.body + ' ≠ ' + row.body + ')');
  if (rec.quantity !== undefined && rec.quantity !== row.quantity)
    bad.push('①' + id + ' の quantity が食い違う(' + rec.quantity + ' ≠ ' + row.quantity + ')');
  const revs = Array.isArray(rec.revisions) ? rec.revisions : [];
  if (!revs.length) bad.push('①' + id + ' に revision が無い');
  revs.forEach((rv, i) => {
    revisionCount++;
    if (rv.revision !== i + 1) bad.push('⑥' + id + ' の revision が連番でない(' + rv.revision + ')');
    if (!FIELDS.includes(rv.field)) { bad.push('②' + id + ' の field が語彙外: ' + rv.field); return; }
    const cur = currentOf(row, rv.field);
    const ok = (rv.field === 'note') ? String(cur).indexOf(String(rv.current)) >= 0
      : String(cur) === String(rv.current);
    if (!ok) bad.push('②' + id + ' rev' + rv.revision + ' の ' + rv.field
      + ' が現行値と一致しない(台帳「' + String(rv.current).slice(0, 60)
      + '」≠ CSV「' + String(cur).slice(0, 60) + '」)');
    if (rv.markKey) {
      if (!MARK_KEYS.includes(rv.markKey))
        bad.push('③' + id + ' rev' + rv.revision + ' の markKey が語彙外: ' + rv.markKey);
      if (!hasKey(row.note, rv.markKey))
        bad.push('③' + id + ' rev' + rv.revision + ' の印 ' + rv.markKey + '= が note に無い');
    }
    if (rv.field !== 'added' && !rv.previousRedacted && !rv.previousAbsent
      && String(rv.previous) === String(rv.current))
      bad.push('⑤' + id + ' rev' + rv.revision + ' の previous と current が同じ');
    if (rv.field === 'added' && rv.previous !== null)
      bad.push('⑤' + id + ' rev' + rv.revision + ' は追加行なので previous は null である');
    if (rv.previousAbsent && rv.previous !== null)
      bad.push('⑤' + id + ' rev' + rv.revision + ' は previousAbsent なので previous は null である');
    if (rv.kind !== undefined && !KINDS.includes(rv.kind))
      bad.push('⑥' + id + ' rev' + rv.revision + ' の kind が語彙外: ' + rv.kind);
    if (!rv.date || !/^\d{4}-\d{2}-\d{2}$/.test(rv.date))
      bad.push('⑥' + id + ' rev' + rv.revision + ' の date が YYYY-MM-DD でない');
    if (!rv.reason) bad.push('⑥' + id + ' rev' + rv.revision + ' に reason が無い');
    checked.push({ record_id: id, ln: row.ln, revision: rv.revision, field: rv.field,
      wave: rv.wave || null, date: rv.date || null, markKey: rv.markKey || null,
      kind: rv.kind || 'correction', bulk: rv.bulk || null,
      currentMatches: ok });
  });
}

// ---- ⑦ 注記(第273便e・AH18) —— **値も印も動かさない**ので previous/current は持たない
const annotations = [];
for (const an of (ledger && Array.isArray(ledger.annotations) ? ledger.annotations : [])) {
  const ids = Array.isArray(an.records) ? an.records : [];
  if (!an.id) bad.push('⑦注記に id が無い');
  if (!an.key) bad.push('⑦注記 ' + an.id + ' に key が無い');
  if (!ids.length) bad.push('⑦注記 ' + an.id + ' に records が無い');
  let present = 0;
  for (const id of ids) {
    const row = rowById.get(id);
    if (!row) { bad.push('⑦注記 ' + an.id + ' の record_id が CSV に無い: ' + id); continue; }
    if (hasKey(row.note, an.key)) present++;
    else bad.push('⑦注記 ' + an.id + ' の鍵 ' + an.key + '= が ' + id + ' の note に無い');
  }
  if (an.changesNothing === undefined)
    bad.push('⑦注記 ' + an.id + ' に changesNothing(何を動かしていないか)が無い');
  annotations.push({ id: an.id || null, key: an.key || null, wave: an.wave || null,
    records: ids.length, keyPresent: present });
}

// ---- ④ 取りこぼし(CSV に印があるのに台帳に無い行)
const marked = [], missing = [];
for (const f of CSV_FILES) {
  for (const r of rowsByFile[f]) {
    const keys = MARK_KEYS.filter((k) => hasKey(r.note, k));
    if (!keys.length) continue;
    marked.push({ file: f, ln: r.ln, record_id: r.recordId || null, keys });
    if (!r.recordId || !records[r.recordId]) {
      missing.push((r.recordId || (f + ':' + r.ln)) + ' [' + keys.join(',') + ']');
      bad.push('④訂正の印を持つ行が台帳に無い: ' + f + ' 行 ' + r.ln
        + '(' + (r.recordId || 'record_id なし') + ' / ' + keys.join(',') + ')');
    }
  }
}

const out = {
  meta: provenanceMeta({ root: ROOT, wave: '第272便e(第62報・AG18)+ 第273便e(第63報・AH18)',
    target: 'paper/data/solar-observations.csv',
    code: ['tests/exp-w272e-corrections.mjs', 'tests/lib-w270b-obscsv.mjs',
      'tests/lib-w264d-sigmamark.mjs', 'tests/lib-w272e-provenance.mjs'],
    inputs: [LEDGER_REL, 'paper/data/solar-observations.csv',
      'paper/data/cluster-galaxy-observations.csv', 'paper/data/transient-observations.csv',
      'paper/data/supernova-observations.csv', 'paper/data/jovian-satellites.csv'] }),
  what: '変更履歴の台帳(paper/data/corrections.json)と観測 CSV の突き合わせ',
  markKeys: MARK_KEYS,
  tally: { records: Object.keys(records).length, revisions: revisionCount,
    markedRowsInCsv: marked.length, missingFromLedger: missing.length,
    annotations: annotations.length,
    annotationRows: annotations.reduce((a, x) => a + x.records, 0) },
  byField: checked.reduce((a, c) => { a[c.field] = (a[c.field] || 0) + 1; return a; }, {}),
  byWave: checked.reduce((a, c) => { a[c.wave || '—'] = (a[c.wave || '—'] || 0) + 1; return a; }, {}),
  byKind: checked.reduce((a, c) => { a[c.kind] = (a[c.kind] || 0) + 1; return a; }, {}),
  byBulk: checked.reduce((a, c) => { if (c.bulk) a[c.bulk] = (a[c.bulk] || 0) + 1; return a; }, {}),
  annotations,
  checked,
  markedRows: marked,
  missingFromLedger: missing,
  violations: bad,
  doNotWrite: ['訂正で観測と合った', '訂正で判定が増えた', '較正した', '旧値を再検証済み',
    '観測レコードが確定した'],
};
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));

console.log('[w272e-corrections] 台帳 ' + out.tally.records + ' record / '
  + out.tally.revisions + ' revision / CSV の印つき行 ' + out.tally.markedRowsInCsv
  + '(台帳に無い行 ' + out.tally.missingFromLedger + ')');
console.log('  注記 ' + out.tally.annotations + ' 件(対象 ' + out.tally.annotationRows + ' 行)');
console.log('  欄別: ' + JSON.stringify(out.byField));
console.log('  便別: ' + JSON.stringify(out.byWave));
console.log('  種別: ' + JSON.stringify(out.byKind) + ' / 一括: ' + JSON.stringify(out.byBulk));
if (bad.length) console.log('  **違反 ' + bad.length + ' 件**: ' + bad.slice(0, 8).join(' , '));
else console.log('  違反 0 件');
console.log('→ ' + path.relative(ROOT, OUT));
