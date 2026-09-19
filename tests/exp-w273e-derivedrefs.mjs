// 第273便e(第63報・AH16 (a)): **`derived_from` の参照を record_id へ**(一意に解決できる行だけ)。
//
// ■ 直している欠陥(第272便e が**測って残した**もの — 本便で直す)
//   観測 CSV の note の並び鍵 `derived_from` は第272便e で区切りを **`|`** に決めた(`;` は鍵の
//   区切り専用)。ところが 2026-09-15 intake の派生行 14 行は、**参照 1 件そのものが
//   `<body>|<quantity>`** という綴りだった(`derived_from=Moon|apsidal_period`)。`|` で割ると
//   2 件に見えるが意味は 1 件の参照であり、**記法が衝突している**。第272便e は件数を出すだけで
//   書き換えなかった(決断事項)。第63報の裁定(AH16 (a))を受けて、本便で
//   **参照先が現行 CSV の 1 行に一意に解決できる行だけ** record_id へ書き換える。
//
// ■ 解決の規則(**推定しない**)
//   ① 旧綴りを `<body>|<quantity>` と読み、5 本の観測 CSV 全体で `body` と `quantity` が
//      **厳密一致**する行を数える。
//   ② **ちょうど 1 行**のときだけ、その行の `record_id` へ書き換える(`--write`)。
//      0 行・2 行以上の行は**書き換えない**(legacy のまま残し、件数を報告する)。
//   ③ 旧綴りは `derived_from_legacy=<body>|<quantity>` として note に残す(履歴)。
//      加えて `derived_from_resolved=<日付>` の印を置く(訂正台帳 corrections.json の markKey)。
//   ④ **値・単位・出典・url・σ 欄・印・record_id・solution_id は 1 文字も動かさない。**
//      `record_id` の鍵は `file|body|quantity|unit|source` なので、note を書いても ID は動かない。
//
// ■ 本器が毎回見る不変量(書き換えた後の照合 —— `--write` なしの既定走行)
//   ・`derived_from` の record_id 参照が**すべて CSV に実在する**。
//   ・`derived_from_legacy=` を持つ行は `derived_from=` に record_id を持ち、**旧綴りを今の CSV で
//     解き直すと同じ record_id に戻る**(参照先が後の便で動いたら FAIL する)。
//   ・`<body>|<quantity>` 形が `derived_from=` 側に残っている行の件数(**未解決**)。
//
// ■ この器がしないこと
//   ・観測値・σ・印・判定(4 値)に触らない。旧綴りから参照先を**推定しない**。
//   ・「参照が繋がったから観測と合った」とは書かない —— 繋がったのは**同定の鍵**だけである。
//
// 実行: node tests/exp-w273e-derivedrefs.mjs [--write]
// 出力: tests/out/derivedrefs-w273e.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadObsCsv, listKey, listKeyRefs, RECORD_ID_RE } from './lib-w270b-obscsv.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'tests', 'out', 'derivedrefs-w273e.json');
const WRITE = process.argv.includes('--write');
/** 書き換えた便の日付(note の印 `derived_from_resolved=` に残る)。 */
export const RESOLVED_DATE = '2026-09-19';
/** 旧綴りを残す鍵と、印の鍵。 */
export const LEGACY_KEY = 'derived_from_legacy';
export const RESOLVED_KEY = 'derived_from_resolved';

const CSV_FILES = ['solar-observations.csv', 'cluster-galaxy-observations.csv',
  'transient-observations.csv', 'supernova-observations.csv', 'jovian-satellites.csv'];

const bad = [];
const loaded = [];
const rowById = new Map();
const all = [];
for (const f of CSV_FILES) {
  const L = loadObsCsv(path.join(ROOT, 'paper', 'data', f));
  loaded.push([f, L]);
  for (const r of L.rows) {
    r._file = f;
    all.push(r);
    if (r.recordId) rowById.set(r.recordId, r);
  }
}

/** `<body>|<quantity>` を現行 CSV で解く(**厳密一致**・全ファイル横断)。 */
function resolve(body, quantity) {
  return all.filter((r) => r.body === body && r.quantity === quantity);
}

// ---------------------------------------------------------------- ① 走査
const rows = [];
for (const r of all) {
  const items = listKey(r.note, 'derived_from');
  if (!items.length && !listKeyRefs(r.note, 'derived_from').legacy) continue;
  const refs = listKeyRefs(r.note, 'derived_from');
  const rec = { file: r._file, ln: r.ln, record_id: r.recordId || null,
    body: r.body, quantity: r.quantity,
    items: refs.items, ids: refs.ids,
    legacy: refs.legacy ? refs.legacy.raw : null,
    state: null, resolvesTo: null, matchCount: null };
  // まだ `<body>|<quantity>` 形が `derived_from=` に残っている行
  if (refs.unresolved) {
    const m = resolve(refs.items[0], refs.items[1]);
    rec.state = (m.length === 1) ? 'unresolved-resolvable' : 'unresolved-ambiguous';
    rec.matchCount = m.length;
    rec.resolvesTo = (m.length === 1) ? m[0].recordId : null;
  } else if (refs.legacy) {
    const m = resolve(refs.legacy.body, refs.legacy.quantity);
    rec.matchCount = m.length;
    rec.resolvesTo = (m.length === 1) ? m[0].recordId : null;
    rec.state = 'resolved-with-legacy';
    if (refs.ids.length !== 1)
      bad.push(`②${rec.record_id} は ${LEGACY_KEY}= を持つのに derived_from の record_id が `
        + `1 件でない(${refs.ids.length} 件)`);
    else if (m.length !== 1)
      bad.push(`③${rec.record_id} の旧綴り「${refs.legacy.raw}」が現行 CSV で 1 行に解けない`
        + `(${m.length} 行)`);
    else if (m[0].recordId !== refs.ids[0])
      bad.push(`③${rec.record_id} の旧綴りを解き直すと別の行になる`
        + `(${refs.ids[0]} ≠ ${m[0].recordId}) —— **参照先が動いている**`);
    if (!new RegExp('(?:^|[^A-Za-z0-9_])' + RESOLVED_KEY + '=').test(r.note))
      bad.push(`④${rec.record_id} に印 ${RESOLVED_KEY}= が無い`);
  } else {
    rec.state = 'record-id-only';
  }
  for (const id of refs.ids) if (!rowById.has(id))
    bad.push(`①${rec.record_id} の derived_from の参照先が CSV に無い: ${id}`);
  rows.push(rec);
}

// ---------------------------------------------------------------- ② 書き換え(--write)
const written = [];
const skipped = [];
if (WRITE) {
  for (const [f, L] of loaded) {
    const fp = path.join(ROOT, 'paper', 'data', f);
    let txt = fs.readFileSync(fp, 'utf8');
    let touched = 0;
    for (const r of L.rows) {
      const refs = listKeyRefs(r.note, 'derived_from');
      if (!refs.unresolved) continue;
      const body = refs.items[0], quantity = refs.items[1];
      const m = resolve(body, quantity);
      if (m.length !== 1 || !m[0].recordId) {
        skipped.push({ record_id: r.recordId, legacy: body + '|' + quantity, matches: m.length,
          why: (m.length === 0) ? '参照先が現行 CSV に無い' : '参照先が 1 行に定まらない' });
        continue;
      }
      const target = m[0].recordId;
      const oldSpell = 'derived_from=' + body + '|' + quantity + ';';
      if (txt.indexOf(oldSpell) < 0) {
        skipped.push({ record_id: r.recordId, legacy: body + '|' + quantity, matches: m.length,
          why: '旧綴りが行の中に見つからない(書き換えない)' });
        continue;
      }
      const newSpell = 'derived_from=' + target + '; ' + LEGACY_KEY + '=' + body + '|' + quantity
        + '; ' + RESOLVED_KEY + '=' + RESOLVED_DATE + ' (第273便e/AH16: ' + body + '|' + quantity
        + ' の綴りが並び鍵の区切りと衝突していたので 現行 CSV で一意に解決する行の record_id へ'
        + '書き換えた。旧綴りは ' + LEGACY_KEY + '= に残す。値・単位・出典・url・σ 欄・印・'
        + 'record_id は 1 文字も動いていない);';
      const before = txt;
      txt = txt.replace(oldSpell, newSpell);
      if (txt === before) { skipped.push({ record_id: r.recordId, legacy: body + '|' + quantity,
        matches: m.length, why: '置換が起きなかった' }); continue; }
      written.push({ record_id: r.recordId, ln: r.ln, body: r.body, quantity: r.quantity,
        legacy: body + '|' + quantity, to: target,
        toRow: m[0].body + '|' + m[0].quantity + ' 行 ' + m[0].ln + '(' + m[0].rawValue + ' '
          + m[0].unit + ')' });
      touched++;
    }
    if (touched) fs.writeFileSync(fp, txt);
  }
}

// ---------------------------------------------------------------- ③ 集計
const tally = {
  rowsWithKey: rows.length,
  recordIdOnly: rows.filter((r) => r.state === 'record-id-only').length,
  resolvedWithLegacy: rows.filter((r) => r.state === 'resolved-with-legacy').length,
  unresolvedResolvable: rows.filter((r) => r.state === 'unresolved-resolvable').length,
  unresolvedAmbiguous: rows.filter((r) => r.state === 'unresolved-ambiguous').length,
  refIds: rows.reduce((a, r) => a + r.ids.length, 0),
};

const out = {
  meta: provenanceMeta({ root: ROOT, wave: '第273便e(第63報・AH16 (a))',
    target: 'paper/data/solar-observations.csv',
    code: ['tests/exp-w273e-derivedrefs.mjs', 'tests/lib-w270b-obscsv.mjs',
      'tests/lib-w272e-provenance.mjs'],
    inputs: CSV_FILES.map((f) => 'paper/data/' + f) }),
  what: '`derived_from` の参照を record_id へ(一意に解決できる行だけ)+ 旧綴りの併記の照合',
  rule: [
    '解決は `body` と `quantity` の**厳密一致**で行い、**ちょうど 1 行**のときだけ書き換える。',
    '0 行・2 行以上は**書き換えない**(legacy のまま残す)—— **推定で紐づけない**。',
    '旧綴りは `' + LEGACY_KEY + '=` に残し、印 `' + RESOLVED_KEY + '=' + RESOLVED_DATE + '` を置く。',
    '**値・単位・出典・url・σ 欄・印・record_id・solution_id は 1 文字も動かさない。**',
  ],
  tally,
  rows,
  written,
  skipped,
  violations: bad,
  doNotWrite: ['参照が繋がったので観測と合った', '判定が増えた', '較正した', '再検証済み'],
};
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));

console.log('[w273e-derivedrefs] 並び鍵 derived_from を持つ行 ' + tally.rowsWithKey
  + ' 行(record_id だけ ' + tally.recordIdOnly + ' / 旧綴り併記 ' + tally.resolvedWithLegacy
  + ' / **未解決** ' + (tally.unresolvedResolvable + tally.unresolvedAmbiguous) + ')');
console.log('  参照 ' + tally.refIds + ' 件がすべて CSV に実在(違反 ' + bad.length + ' 件)');
if (WRITE) {
  console.log('  --write: 書き換え ' + written.length + ' 行 / 見送り ' + skipped.length + ' 行');
  for (const w of written) console.log('    ' + w.record_id + ' ' + w.legacy + ' → ' + w.to
    + ' [' + w.toRow + ']');
  for (const s of skipped) console.log('    (見送り) ' + s.record_id + ' ' + s.legacy + ' —— ' + s.why);
}
if (bad.length) console.log('  **違反 ' + bad.length + ' 件**: ' + bad.slice(0, 6).join(' , '));
console.log('→ ' + path.relative(ROOT, OUT));
