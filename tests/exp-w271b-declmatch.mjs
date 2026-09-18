// 第271便b(第61報・統括の検証項目 R1): **`record_id` は鍵、宣言内容は一致条件**。
//
// ■ 何が開いていたか(統括が ef2cd45 の実コードで確認した読み)
//   第270便b の `pickDeclaredRow` は `record_id` が 1 件に当たった時点で行を返していた ——
//   **内容照合(body/quantity/source/unit/value/σ)を飛ばして**返す。したがって、次に
//   観測レコードが訂正されて**同じ ID の行の中身が動いた**ときに、宣言と行の食い違いを
//   1 件も検出できない。ID は**候補行を一意に定める鍵**であって、宣言内容は**一致条件**である。
//
// ■ 本器が測ること(**実データ + 擬似データ**・エンジンは 1 步も走らせない)
//   ① 現行の宣言 4 件が、正本の CSV に対して**内容照合つきで**一致する(PASS)。
//   ② 4 件それぞれについて **6 種の内容改変**(単位 day / 別論文 / value 99 / σ 99 / 別天体 / 別量)
//      を擬似行に入れると、**理由つきで拒否**される(`record-id-content-mismatch(<欄名>)`)。
//      **別出典へ落ちない**(拒否の返り値の `row` は必ず null で、`matchedBy` は `record_id`)。
//   ③ `solution_id`(第271便b・AF4)も一致条件に入る。
//   ④ ID 欠落(当たらない ID)・ID 重複(同じ ID の行が 2 件)・`record_id: null` を拒否する。
//   ⑤ `validateJudgementSources`: `value`/`sigma` は**有限の number だけ**
//      (`null`・文字列・`NaN`・`0`・負は不正)。不正なら**宣言を 1 件も配らない**。
//
// ■ 本器がしないこと
//   ・正本の CSV を**1 バイトも書かない**(擬似行はメモリ上で作る)。
//   ・印を上げ下げしない・判定(4 値)に触らない・σ を作らない。
//
// 実行: node tests/exp-w271b-declmatch.mjs
// 出力: tests/out/declmatch-w271b.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadObsCsv } from './lib-w270b-obscsv.mjs';
import { loadJudgementSources, validateJudgementSources, pickDeclaredRow,
  declaredContentMismatch } from './lib-w268a-judgement.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'tests', 'out', 'declmatch-w271b.json');
const bad = [];

// ---------------------------------------------------------------- 入力(正本・読むだけ)
const decl = loadJudgementSources(path.join(ROOT, 'paper', 'data', 'judgement-sources.json'));
if (!decl.ok) bad.push('宣言ファイルが ok:false: ' + (decl.errors || []).join(' / ').slice(0, 160));
const SOLAR = loadObsCsv(path.join(ROOT, 'paper', 'data', 'solar-observations.csv')).rows;

// ---------------------------------------------------------------- ① 現行 4 件は一致する
const live = (decl.declarations || []).map((d) => {
  const p = pickDeclaredRow(d, SOLAR);
  const o = { body: d.body, quantity: d.quantity, record_id: d.record_id || null,
    solution_id: (typeof d.solution_id === 'string') ? d.solution_id : null,
    matchedBy: p.matchedBy || null, reason: p.reason, ln: p.row ? p.row.ln : null,
    mismatch: p.mismatch || [], ok: !!(p.row && p.matchedBy === 'record_id' && !p.reason) };
  if (!o.ok) bad.push(`①現行の宣言 ${d.body}|${d.quantity} が一致しない(${p.reason})`);
  return o;
});

// ---------------------------------------------------------------- ②③ 6 種の内容改変
// 改変は**擬似行**(CSV の行の複製に 1 欄だけ手を入れたもの)に対して行う。正本は書かない。
const MUTATIONS = [
  { name: 'unit-day', field: 'unit', expect: 'unit',
    apply: (r) => Object.assign({}, r, { unit: 'day' }),
    why: '同じ数値の**別単位**(s と day)を当てない' },
  { name: 'other-paper', field: 'source', expect: 'source',
    apply: (r) => Object.assign({}, r, { source: 'Another Author et al. 1999, Some Journal 1, 1' }),
    why: '同じ数値・同じ σ の**別論文**を当てない' },
  { name: 'value-99', field: 'value', expect: 'value',
    apply: (r) => Object.assign({}, r, { value: 99, rawValue: '99' }),
    why: '値が訂正されたら止まる(ID だけで通さない)' },
  { name: 'sigma-99', field: 'sigma', expect: 'sigma',
    apply: (r) => Object.assign({}, r, { sigma: 99, rawSigma: '99' }),
    why: 'σ が訂正されたら止まる' },
  { name: 'other-body', field: 'body', expect: 'body',
    apply: (r) => Object.assign({}, r, { body: 'Some Other Body' }),
    why: '別天体の行を当てない' },
  { name: 'other-quantity', field: 'quantity', expect: 'quantity',
    apply: (r) => Object.assign({}, r, { quantity: 'some_other_quantity' }),
    why: '別量の行を当てない' },
  { name: 'other-solution-id', field: 'solution_id', expect: 'solution_id',
    apply: (r) => Object.assign({}, r, { solutionId: 'Someone1999-XYZ' }),
    why: '第271便b(AF4): 解タグが変わったら止まる' },
];
const mutations = [];
for (const d of (decl.declarations || [])) {
  const base = SOLAR.find((r) => r.recordId === d.record_id);
  if (!base) { bad.push(`②宣言 ${d.body}|${d.quantity} の基準行が見つからない`); continue; }
  for (const m of MUTATIONS) {
    const rows = SOLAR.map((r) => (r.recordId === d.record_id ? m.apply(r) : r));
    const p = pickDeclaredRow(d, rows);
    const rejected = (p.row === null) && p.matchedBy === 'record_id'
      && /^record-id-content-mismatch\(/.test(String(p.reason))
      && (p.mismatch || []).indexOf(m.expect) >= 0;
    mutations.push({ decl: d.body + '|' + d.quantity, mutation: m.name, field: m.field,
      why: m.why, reason: p.reason, mismatch: p.mismatch || [], row: p.row ? p.row.ln : null,
      rejected });
    if (!rejected)
      bad.push(`②${d.body}|${d.quantity} の改変 ${m.name} が拒否されない(${p.reason})`);
  }
}

// ---------------------------------------------------------------- ④ ID 欠落 / 重複 / null
const d0 = (decl.declarations || [])[0] || {};
const idCases = [];
{
  // 欠落: 当たらない ID
  const p = pickDeclaredRow(Object.assign({}, d0, { record_id: 'SOL-00000000' }), SOLAR);
  const ok = p.row === null && p.reason === 'record-id-not-found';
  idCases.push({ case: 'id-not-found', reason: p.reason, row: p.row ? p.row.ln : null, ok });
  if (!ok) bad.push('④当たらない ID が拒否されない(' + p.reason + ')');
}
{
  // 重複: 同じ ID の行を 2 件にする(**別出典へ落ちない**)
  const base = SOLAR.find((r) => r.recordId === d0.record_id);
  const rows = SOLAR.concat([Object.assign({}, base, { ln: 99999 })]);
  const p = pickDeclaredRow(d0, rows);
  const ok = p.row === null && p.reason === 'record-id-ambiguous(2)';
  idCases.push({ case: 'id-ambiguous', reason: p.reason, row: p.row ? p.row.ln : null, ok });
  if (!ok) bad.push('④重複 ID が拒否されない(' + p.reason + ')');
}
{
  // `record_id: null`: **スキーマで止める**(欄を置いて空にするのは宣言ではない)
  const v = validateJudgementSources({ schemaVersion: 1,
    declarations: [Object.assign({}, d0, { record_id: null })] });
  const ok = v.ok === false && v.byKey.size === 0;
  idCases.push({ case: 'id-null', ok, errors: v.errors.slice(0, 2),
    note: '`record_id: null` は schema で不正(器は宣言を 1 件も配らない)' });
  if (!ok) bad.push('④`record_id: null` の宣言が schema で止まらない');
}

// ---------------------------------------------------------------- ⑤ value/σ は有限の number だけ
const SCHEMA_CASES = [
  { name: 'value-null', patch: { value: null }, shouldFail: true },
  { name: 'value-string', patch: { value: '551856.43872' }, shouldFail: true },
  { name: 'value-NaN', patch: { value: NaN }, shouldFail: true },
  { name: 'sigma-string', patch: { sigma: '0.02592' }, shouldFail: true },
  { name: 'sigma-zero', patch: { sigma: 0 }, shouldFail: true },
  { name: 'sigma-negative', patch: { sigma: -1 }, shouldFail: true },
  { name: 'sigma-null', patch: { sigma: null }, shouldFail: false },
  { name: 'unchanged', patch: {}, shouldFail: false },
];
const schema = SCHEMA_CASES.map((c) => {
  const v = validateJudgementSources({ schemaVersion: 1,
    declarations: [Object.assign({}, d0, c.patch)] });
  const failed = (v.ok === false);
  const ok = (failed === c.shouldFail) && (!failed || v.byKey.size === 0);
  if (!ok) bad.push(`⑤schema ${c.name} の判定が期待と違う(ok:${v.ok})`);
  return { case: c.name, shouldFail: c.shouldFail, ok: v.ok, distributed: v.byKey.size, pass: ok,
    errors: v.errors.slice(0, 1) };
});

// ---------------------------------------------------------------- 出力
const out = { when: new Date().toISOString(), wave: '第271便b(2026-09-18・第61報・R1)',
  base: 'main ef2cd45',
  rule: ['**`record_id` は候補行を一意に定める鍵**であって、宣言内容(body/quantity/source/unit/'
    + 'value/σ/solution_id)は**一致条件**である',
    'ID で 1 行に定まっても内容が食い違えば `{row:null, matchedBy:"record_id", '
    + 'reason:"record-id-content-mismatch(<欄名,…>)"}`(**別出典へ落ちない**)',
    '`value` は双方が有限の数でなければ不一致(`Number(null) === 0` の穴を塞ぐ)',
    '`sigma` は「両方 null」か「両方同じ数」だけが一致(片方だけ null は不一致)',
    '宣言の `value`/`sigma` は**有限の number だけ**(null・文字列・NaN・0・負は schema で不正)'],
  live, mutations, idCases, schema,
  tally: { declarations: live.length, liveOk: live.filter((x) => x.ok).length,
    mutationsChecked: mutations.length, mutationsRejected: mutations.filter((m) => m.rejected).length,
    idCasesOk: idCases.filter((c) => c.ok).length, schemaPass: schema.filter((s) => s.pass).length },
  violations: bad,
  doNotWrite: ['内容照合を入れたので判定が増えた', '観測レコードの同定が完成した',
    '混在が全部なくなった'] };
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));

console.log('[w271b] 宣言の内容照合(R1)');
for (const l of live)
  console.log('  ① ' + (l.body + '|' + l.quantity).padEnd(30) + ' ' + (l.record_id || '—')
    + ' solution_id "' + l.solution_id + '" → 行 ' + (l.ln === null ? '—' : l.ln)
    + ' / ' + (l.ok ? '一致' : '**不一致 ' + l.reason + '**'));
console.log('  ②③ 内容改変 ' + mutations.length + ' 件中 拒否 '
  + mutations.filter((m) => m.rejected).length + ' 件');
for (const m of MUTATIONS) {
  const mine = mutations.filter((x) => x.mutation === m.name);
  console.log('     ' + m.name.padEnd(18) + ' 拒否 ' + mine.filter((x) => x.rejected).length
    + '/' + mine.length + '  ' + (mine[0] ? mine[0].reason : '—'));
}
console.log('  ④ ID: ' + idCases.map((c) => c.case + '=' + (c.ok ? 'OK' : '**NG**')).join(' / '));
console.log('  ⑤ schema: ' + schema.map((s) => s.case + '=' + (s.pass ? 'OK' : '**NG**')).join(' / '));
if (bad.length) console.log('  **違反 ' + bad.length + ' 件**: ' + bad.slice(0, 6).join(' , '));
console.log('→ ' + path.relative(ROOT, OUT));
