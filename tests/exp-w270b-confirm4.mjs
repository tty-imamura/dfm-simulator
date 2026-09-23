// 第270便b(第60報・W2): **確認記録(2026-09-18・第 4 回)の突き合わせ器**。
//
// 第60報の観測レコードの回答は 3 つである(原仮定者が提供した確認記録の原文):
//   ・「**Cameron 2018 Table 2: 目視確認**」
//   ・「**Stairs 2002: 目視確認**」
//   ・「**421(タイタン環): 追認**」
// 本器はこの回答を**機械可読な宣言表**にし、正本の CSV との突き合わせを 3 分類で数え直す。
//
// ■ 本器がしないこと(**測定値も観測値も 1 つも作らない**)
//   ・エンジンを 1 步も走らせない(`beta/index.html` にも `S._core` にも 1 バイトも触らない)。
//   ・**値・単位・出典ラベル・σ 欄を 1 文字も書き換えない**(動かしたのは印と note だけ)。
//   ・門(`tests/exp-w249b-calaudit.mjs`)の行選択を差し替えない・4 値を動かさない。
//   ・**印を上げるのは原仮定者の照合だけ**であり、器は「上がっているか」を数えるだけである。
//
// ■ 3 分類(JSON の `classes`)
//   ① `x7-filled`     … 印は**前から `verified`** で、第 4 回の目視確認で **X7 の 3 欄が埋まった**行
//                        (136/137/139・171/172/173)。**印そのものは 1 bit も動いていない** ——
//                        動いたのは「確認者がいない」という**警告の側**である。
//   ② `verified-new`  … 第 4 回の確認で `unverified` → `verified` になった併置行(260/262/263)。
//                        同じ Cameron 2018 Table 2 を転写した行で、旧印は `previous_mark=` に残す。
//   ③ `acknowledged`  … 量名の改名(421: mean_motion → pattern_speed_m1)の**追認**。
//                        **印は `unverified` のまま**である —— 追認は確認ではない。
//
// ■ **印を付ける前に原記載から value と σ を再現する**
//   ①②の 9 行は、宣言した**原記載**(`orig`)から value と sigma を**毎回この器が作り直し**、
//   CSV の数字と相対差 `tol` 以内で一致することを確かめる。再現できない行は「不一致」に落ちる
//   (再現できない行に印が付いていたら**違反**である)。
//
// ■ AE7(外部名の掃除)
//   171〜173 の note に残っていた第256便d 由来の外部名の文字列を**中立表現**へ書き換えた
//   (値・印・来歴は不変)。CSV 全体に外部名が何件残っているかを**数えて JSON に置く**
//   (歴史文書 —— CHANGELOG の過去便・PHYSICS の過去節 —— は触らない)。
//
// ■ **書かないこと**
//   「判定が増えた」「太陽系の σ が揃った」「観測と合った」「タイタン環を確認した」
//   「X7 の規約が完成した」。**4 値は 1 本も動いていない**。
//
// 実行: node tests/exp-w270b-confirm4.mjs
// 出力: tests/out/confirm4-w270b.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readSigmaMark, readVerifiedBy, readValueChecked } from './lib-w264d-sigmamark.mjs';
// 第270便b(AE2): CSV は**列位置でなくヘッダ名**で読む(`record_id` の列追加で壊れない)。
import { loadObsCsv } from './lib-w270b-obscsv.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'tests', 'out', 'confirm4-w270b.json');
const SOLAR_F = 'paper/data/solar-observations.csv';
const CLUSTER_F = 'paper/data/cluster-galaxy-observations.csv';
const TRANSIENT_F = 'paper/data/transient-observations.csv';
const ROUND_TAG = 'confirmation_round=4';
const WHO = '原仮定者 2026-09-18';
const CAM_AT = 'Cameron 2018 MNRAS Letters 475 L57 Table 2';
const STA_AT = 'Stairs et al. 2002 ApJ 581 501 timing table';

const CSV = {};
for (const f of [SOLAR_F, CLUSTER_F, TRANSIENT_F]) {
  const L = loadObsCsv(path.join(ROOT, f));
  if (L.missing.length) throw new Error('[w270b] ' + f + ' に必須列が無い: ' + L.missing.join(','));
  CSV[f] = L.rows.map((r) => Object.assign({ file: f }, r));
}
const row = (file, ln) => CSV[file].find((r) => r.ln === ln) || null;
const has = (note, s) => String(note || '').indexOf(s) >= 0;
const bad = [];
const rel = (a, b) => (b === 0 ? (a === 0 ? 0 : Infinity) : Math.abs(a / b - 1));

// ---------------------------------------------------------------- 換算定数(**その行の note にある定数**)
const DAY = 86400;   // 1 d = 86400 s(単位の規約であって観測ではない)

// ================================================================ ① x7-filled(印は動かない)
// `at` は原仮定者が見た表、`orig` はその原記載、`value`/`sigma` は**この器が原記載から毎回やり直す
// 換算**である(CSV の数字を写していない)。`before` は基点 f6c19b4 の印(宣言)。
const X7_FILLED = [
  { ln: 136, body: 'PSR J1757-1854', quantity: 'orbital_period', before: 'verified', at: CAM_AT,
    orig: 'Pb = 0.18353783587(5) d', value: 0.18353783587 * DAY, sigma: 5e-11 * DAY, tol: 1e-12,
    how: '0.18353783587 d x 86400 s/d(σ は最終桁 5e-11 d を秒へ = 4.32e-6 s)' },
  { ln: 137, body: 'PSR J1757-1854', quantity: 'eccentricity', before: 'verified', at: CAM_AT,
    orig: 'e = 0.6058142(10)', value: 0.6058142, sigma: 1.0e-6, tol: 1e-12,
    how: '無次元(σ は最終 2 桁 (10) = 1.0e-6 —— 第268便b の転写訂正後の値と一致する)' },
  { ln: 139, body: 'PSR J1757-1854', quantity: 'periastron_advance', before: 'verified', at: CAM_AT,
    orig: 'omega_dot = 10.3651(2) deg/yr', value: 10.3651, sigma: 2e-4, tol: 1e-12,
    how: '換算なし(σ は最終桁 (2) = 2e-4 deg/yr)' },
  { ln: 171, body: 'PSR B1534+12', quantity: 'orbital_period', before: 'verified', at: STA_AT,
    orig: 'Pb = 0.420737299122(10) d', value: 0.420737299122 * DAY, sigma: 1e-11 * DAY, tol: 1e-12,
    how: '0.420737299122 d x 86400 s/d(σ は最終 2 桁 (10) = 1e-11 d を秒へ = 8.64e-7 s)', ae7: true },
  { ln: 172, body: 'PSR B1534+12', quantity: 'eccentricity', before: 'verified', at: STA_AT,
    orig: 'e = 0.2736775(3)', value: 0.2736775, sigma: 3e-7, tol: 1e-12,
    how: '無次元(σ は最終桁 (3) = 3e-7)', ae7: true },
  { ln: 173, body: 'PSR B1534+12', quantity: 'periastron_advance', before: 'verified', at: STA_AT,
    orig: 'omega_dot = 1.755789(9) deg/yr', value: 1.755789, sigma: 9e-6, tol: 1e-12,
    how: '換算なし(σ は最終桁 (9) = 9e-6 deg/yr)', ae7: true },
];

// ================================================================ ② verified-new(併置行 260/262/263)
const VERIFIED_NEW = [
  { ln: 260, body: 'PSR J1757-1854', quantity: 'orbital_period', before: 'unverified', at: CAM_AT,
    orig: 'Pb = 0.18353783587(5) d', value: 0.18353783587 * DAY, sigma: 5e-11 * DAY, tol: 1e-12,
    how: '0.18353783587 d x 86400 s/d(この行の転写は 15857.66901916800 —— 末尾 0 の書き方が違うだけ)' },
  { ln: 262, body: 'PSR J1757-1854', quantity: 'eccentricity', before: 'unverified', at: CAM_AT,
    orig: 'e = 0.6058142(10)', value: 0.6058142, sigma: 1.0e-6, tol: 1e-12, how: '無次元' },
  { ln: 263, body: 'PSR J1757-1854', quantity: 'periastron_advance', before: 'unverified', at: CAM_AT,
    orig: 'omega_dot = 10.3651(2) deg/yr', value: 10.3651, sigma: 2e-4, tol: 1e-12, how: '換算なし' },
];

// ================================================================ ③ acknowledged(421 の改名の追認)
const ACK = [
  { ln: 421, body: 'Titan ringlet', quantity: 'pattern_speed_m1',
    what: '量名の改名 mean_motion → pattern_speed_m1(第268便b)',
    frozenValue: '22.5753', frozenUnit: 'deg/day', frozenSigma: '0.0008', mark: 'unverified' },
];

// ---------------------------------------------------------------- 基点(main f6c19b4)の実測値
// **本便の前**に同じ読み方で数えた値である(前後の比較に使う。宣言であって推測ではない)。
const BEFORE = { solar: { rows: 521, verified: 54, verifiedBy: 48, x7Warn: 6 },
  cluster: { rows: 154, verified: 6, verifiedBy: 6, x7Warn: 0 },
  transient: { rows: 27, verified: 0, verifiedBy: 0, x7Warn: 0 } };

// ================================================================ 突き合わせ
let reproduced = 0, notReproduced = 0;
function checkMarked(d, klass) {
  const r = row(SOLAR_F, d.ln);
  const o = { file: SOLAR_F, ln: d.ln, body: d.body, quantity: d.quantity, klass,
    at: d.at, orig: d.orig, how: d.how, tol: d.tol,
    markBefore: d.before, markAfter: null, recordId: null,
    recomputedValue: d.value, recomputedSigma: d.sigma,
    csvValue: null, csvSigma: null, valueRelErr: null, sigmaRelErr: null, reproduced: false,
    verifiedBy: null, verifiedAt: null, verifiedValue: null, round4: false };
  if (!r) { bad.push(`${klass}: 行 ${d.ln} が無い`); notReproduced++; return o; }
  if (r.body !== d.body || r.quantity !== d.quantity)
    bad.push(`${klass}: 行 ${d.ln} が ${d.body}|${d.quantity} でない(${r.body}|${r.quantity})`);
  const mk = readSigmaMark(r.note), vb = readVerifiedBy(r.note);
  o.markAfter = mk.mark; o.recordId = r.recordId || null;
  o.csvValue = r.value; o.csvSigma = r.sigma;
  o.verifiedBy = vb.present ? vb.who : null; o.verifiedAt = vb.at; o.verifiedValue = vb.value;
  o.round4 = has(r.note, ROUND_TAG);
  // **印を付ける前に原記載から value と σ を再現する**
  o.valueRelErr = (r.value === null) ? null : rel(d.value, r.value);
  o.sigmaRelErr = (r.sigma === null) ? null : rel(d.sigma, r.sigma);
  o.reproduced = (o.valueRelErr !== null && o.valueRelErr <= d.tol)
    && (o.sigmaRelErr !== null && o.sigmaRelErr <= d.tol);
  if (o.reproduced) reproduced++; else {
    notReproduced++;
    bad.push(`${klass}: 行 ${d.ln} は原記載から再現できない(値 ${o.valueRelErr} / σ ${o.sigmaRelErr})`);
  }
  // **再現できた行だけ** verified になっていてよい
  if (o.reproduced) {
    if (!mk.verified) bad.push(`${klass}: 行 ${d.ln} が verified になっていない(${mk.mark})`);
    if (!vb.present || vb.who !== WHO)
      bad.push(`${klass}: 行 ${d.ln} の verified_by が「${WHO}」でない(${o.verifiedBy})`);
    if (vb.at !== d.at) bad.push(`${klass}: 行 ${d.ln} の verified_at が宣言と違う(${vb.at})`);
    if (vb.value !== d.orig)
      bad.push(`${klass}: 行 ${d.ln} の verified_value が原記載と違う(${vb.value})`);
    if (!o.round4) bad.push(`${klass}: 行 ${d.ln} に ${ROUND_TAG} が無い`);
    if (r.sigma === null) bad.push(`${klass}: 行 ${d.ln} は σ が空なのに verified である`);
    if (!r.recordId) bad.push(`${klass}: 行 ${d.ln} に record_id が無い`);
  } else if (mk.verified) {
    bad.push(`${klass}: 行 ${d.ln} は再現できないのに verified になっている`);
  }
  return o;
}

// ---- ① x7-filled(**印そのものは動いていない** —— 消えたのは X7 警告である)
const x7Filled = X7_FILLED.map((d) => {
  const o = checkMarked(d, 'x7-filled');
  const r = row(SOLAR_F, d.ln);
  o.warningBefore = true; o.warningAfter = false;
  if (!r) return o;
  if (d.before !== 'verified') bad.push(`①行 ${d.ln} の基点の印の宣言が verified でない`);
  if (o.markAfter !== 'verified') bad.push(`①行 ${d.ln} の印が動いている(${o.markAfter})`);
  o.warningAfter = readVerifiedBy(r.note).warn;
  if (o.warningAfter) bad.push(`①行 ${d.ln} の X7 警告が消えていない`);
  // 第 3 回の「写す元が無い」の記録は**残したまま閉じる**(履歴は消さない)
  if (!has(r.note, 'same_mark_not_available=2026-09-17'))
    bad.push(`①行 ${d.ln} の第 3 回の記録(same_mark_not_available)が消えている`);
  if (!has(r.note, 'same_mark_not_available_closed=2026-09-18'))
    bad.push(`①行 ${d.ln} に第 4 回で閉じた記録が無い`);
  if (has(r.note, 'same_mark_as='))
    bad.push(`①行 ${d.ln} に same_mark_as= が付いている(第 4 回は同印写しではなく目視確認である)`);
  // AE7: 171〜173 は外部名を中立表現へ
  o.ae7 = !!d.ae7;
  if (d.ae7) {
    if (!has(r.note, '外部レビュー O5.2')) bad.push(`①行 ${d.ln} の中立表現が入っていない`);
    if (!has(r.note, 'external_name_neutralised=2026-09-18'))
      bad.push(`①行 ${d.ln} に AE7 の記録が無い`);
  }
  return o;
});

// ---- ② verified-new(併置行 —— 旧印は note に残す)
const verifiedNew = VERIFIED_NEW.map((d) => {
  const o = checkMarked(d, 'verified-new');
  const r = row(SOLAR_F, d.ln);
  if (!r) return o;
  if (d.before !== 'unverified') bad.push(`②行 ${d.ln} の基点の印の宣言が unverified でない`);
  if (o.markAfter !== 'verified') bad.push(`②行 ${d.ln} の印が verified になっていない`);
  if (!has(r.note, 'previous_mark=unverified'))
    bad.push(`②行 ${d.ln} に旧印(previous_mark=unverified)が残っていない`);
  // 第 2 回の未回答の記録は**残っている**(履歴は消さない)
  if (!has(r.note, 'confirmation_2=not-found-by-author'))
    bad.push(`②行 ${d.ln} の第 2 回の記録が消えている`);
  // 併置行の規約(第263便c/第268便a): **採用行を置き換えない**
  if (!has(r.note, 'Solution-tagged row'))
    bad.push(`②行 ${d.ln} の併置行の宣言が消えている`);
  return o;
});

// ---- ③ acknowledged(**印は unverified のまま**)
const acknowledged = ACK.map((d) => {
  const r = row(SOLAR_F, d.ln);
  const o = { file: SOLAR_F, ln: d.ln, body: d.body, quantity: d.quantity, klass: 'acknowledged',
    what: d.what, value: null, unit: null, sigma: null, mark: null, verifiedBy: null,
    acknowledged: false, pendingKept: false, closed: false, recordId: null };
  if (!r) { bad.push(`③行 ${d.ln} が無い`); return o; }
  const mk = readSigmaMark(r.note), vb = readVerifiedBy(r.note);
  o.value = r.rawValue; o.unit = r.unit; o.sigma = r.rawSigma; o.mark = mk.mark;
  o.recordId = r.recordId || null;
  o.verifiedBy = vb.present ? vb.who : null;
  o.acknowledged = has(r.note, 'acknowledged_by=' + WHO);
  o.pendingKept = has(r.note, 'acknowledgement_pending=2026-09-17');
  o.closed = has(r.note, 'acknowledgement_closed=2026-09-18');
  if (r.rawValue !== d.frozenValue) bad.push(`③行 ${d.ln} の value が動いている(${r.rawValue})`);
  if (r.unit !== d.frozenUnit) bad.push(`③行 ${d.ln} の unit が動いている(${r.unit})`);
  if (r.rawSigma !== d.frozenSigma) bad.push(`③行 ${d.ln} の σ が動いている(${r.rawSigma})`);
  if (mk.mark !== d.mark) bad.push(`③行 ${d.ln} の印が動いている(${mk.mark} / 宣言 ${d.mark})`);
  if (vb.present) bad.push(`③行 ${d.ln} に X7 の verified_by が付いている(追認は確認ではない)`);
  if (!o.acknowledged) bad.push(`③行 ${d.ln} に追認印(acknowledged_by=${WHO})が無い`);
  if (!o.pendingKept) bad.push(`③行 ${d.ln} の第 3 回の未追認の記録が消えている(履歴は残す)`);
  if (!o.closed) bad.push(`③行 ${d.ln} に閉じた記録(acknowledgement_closed)が無い`);
  if (has(r.note, ROUND_TAG)) bad.push(`③行 ${d.ln} に ${ROUND_TAG} が付いている(追認は確認ではない)`);
  return o;
});

// ---------------------------------------------------------------- CSV 全体の印(厳密読み)
function census(f) {
  const rows = CSV[f];
  let verified = 0, verifiedBy = 0, x7Warn = 0, round4 = 0, round4Verified = 0, withRecordId = 0;
  for (const r of rows) {
    const v = readSigmaMark(r.note).verified, b = readVerifiedBy(r.note).present;
    if (v) verified++;
    if (b) verifiedBy++;
    if (v && !b) x7Warn++;
    if (/(?:^|[^A-Za-z0-9_])confirmation_round=4\b/.test(r.note)) { round4++; if (v) round4Verified++; }
    if (r.recordId) withRecordId++;
  }
  return { rows: rows.length, verified, verifiedBy, x7Warn, round4, round4Verified, withRecordId };
}
const after = { solar: census(SOLAR_F), cluster: census(CLUSTER_F), transient: census(TRANSIENT_F) };
const DECLARED_ROUND4 = X7_FILLED.length + VERIFIED_NEW.length;
if (after.solar.round4 !== DECLARED_ROUND4)
  bad.push(`太陽系で ${ROUND_TAG} を持つ行が ${after.solar.round4}(宣言は ${DECLARED_ROUND4})`);
if (after.solar.round4Verified !== after.solar.round4)
  bad.push(`第 4 回の行のうち verified が ${after.solar.round4Verified}(全行のはず)`);
// 第278便a(第 5 回)で verified になった行(`confirmation_round=5`・新規行を含む)はこの便の増分ではないので分けて数える。
const round5NewVerified = CSV[SOLAR_F].filter((r) =>
  /(?:^|[^A-Za-z0-9_])confirmation_round=5\b/.test(r.note)
  && readSigmaMark(r.note).verified).length;
after.solar.round5Verified = round5NewVerified;   // 第278便a: QA `docs.confirm4-sync` ⑥ が同じ数を引く
if (after.solar.verified - BEFORE.solar.verified - round5NewVerified !== VERIFIED_NEW.length)
  bad.push(`太陽系の verified の増分が ${after.solar.verified - BEFORE.solar.verified}`
    + `(宣言は ${VERIFIED_NEW.length} + 第 5 回の ${round5NewVerified} —— X7 欄を埋めただけの 6 行は印を動かさない)`);
if (after.solar.x7Warn !== 0) bad.push(`X7 警告が ${after.solar.x7Warn} 行残っている(0 のはず)`);
for (const k of ['cluster', 'transient']) {
  if (after[k].verified !== BEFORE[k].verified)
    bad.push(`${k} の verified が動いた(${BEFORE[k].verified} → ${after[k].verified})`);
  if (after[k].round4 !== 0) bad.push(`${k} に第 4 回の印が付いている`);
}
// **外部確認印だけで verified になっている行は 1 つも無い**(Z11)
const externalOnlyVerified = [];
for (const f of [SOLAR_F, CLUSTER_F, TRANSIENT_F]) for (const r of CSV[f]) {
  if (readValueChecked(r.note).present && readSigmaMark(r.note).verified
    && !readVerifiedBy(r.note).present) externalOnlyVerified.push(f + ':' + r.ln);
}
if (externalOnlyVerified.length)
  bad.push('外部確認印だけで verified になっている行: ' + externalOnlyVerified.join(','));

// ---------------------------------------------------------------- AE7(外部名の残数 —— 数えるだけ)
// **歴史文書(CHANGELOG の過去便・docs/PHYSICS.md の過去節)は触らない** —— 件数だけ報告する。
// 統括の統合(第270便): 検出用の語は**公開ファイルに平文で置かない**(語彙規約)。
//   base64 で持ち、実行時に復号して数える(検出の仕組みは同じ)。
const EXTERNAL_NAMES = Buffer.from('Q2hhdEdQVCxHcm9rLEdlbWluaSxDb2RleA==', 'base64').toString('utf8').split(',');
function countNames(rel2) {
  let txt = '';
  try { txt = fs.readFileSync(path.join(ROOT, rel2), 'utf8'); } catch { return null; }
  const o = {};
  let total = 0;
  for (const n of EXTERNAL_NAMES) {
    const c = (txt.match(new RegExp(n, 'g')) || []).length;
    if (c) { o[n] = c; total += c; }
  }
  return { file: rel2, total, byName: o };
}
const ae7 = {
  cleaned: X7_FILLED.filter((d) => d.ae7).map((d) => d.ln),
  replacement: '外部レビュー O5.2',
  csv: [SOLAR_F, CLUSTER_F, TRANSIENT_F, 'paper/data/supernova-observations.csv',
    'paper/data/jovian-satellites.csv'].map(countNames).filter(Boolean),
  historyOnly: ['CHANGELOG.md', 'docs/PHYSICS.md', 'docs/DERIVATIONS.md', 'docs/BOX_UNIVERSE.md',
    'docs/THEORY_SYNTHESIS.md', 'docs/AI_SPEC.md', 'docs/RELEASE_NOTES_v1.44.md', 'tests/qa.mjs',
    'beta/index.html'].map(countNames).filter(Boolean),
  note: '**歴史文書は触らない**(過去便の記録である)。CSV の残数は本器が数えた実測値で、'
    + '本便で書き換えたのは 171〜173 の note の 1 語だけである。',
};
const csvNamesLeft = ae7.csv.reduce((a, c) => a + c.total, 0);

// ---------------------------------------------------------------- 門(**動いていないことを外の器から読む**)
function readJson(rel2) {
  try { return JSON.parse(fs.readFileSync(path.join(ROOT, rel2), 'utf8')); } catch { return null; }
}
const cal = readJson('tests/out/calaudit-w249.json');
const sol = readJson('tests/out/solarsigma-w262d.json');
const gate = {
  calaudit: cal ? { byStatus: ((cal.summary || {}).gate || {}).byStatus || null,
    withSigma: ((cal.summary || {}).gate || {}).withSigma || null,
    sourceVerified: ((cal.summary || {}).gate || {}).sourceVerified || null,
    sigmaRegate: cal.sigmaRegate ? { checked: cal.sigmaRegate.checked,
      changed: (cal.sigmaRegate.changed || []).length,
      verifiedFlips: (cal.sigmaRegate.verifiedFlips || []).length } : null } : null,
  solarsigma: sol ? { cutTally: sol.cutTally || null, fourTally: sol.fourTally || null } : null,
  why: '**印が `verified` であることは門に繋がっていることではない。** 本便は門の行選択を 1 件も'
    + '差し替えていない(併置行 260/262/263 は「採用行を置き換えない」規約の行である)。'
    + 'タイタン環は C 環内縁の観測門へ転送しない(AB3 は閉じたまま)。',
};

const classes = { 'x7-filled': x7Filled.length, 'verified-new': verifiedNew.length,
  acknowledged: acknowledged.length };

const out = { when: new Date().toISOString(), wave: '第270便b(第60報・W2)', base: 'main f6c19b4',
  provenance: '原仮定者が提供した観測レコードの確認記録(2026-09-18・第 4 回)。'
    + '一次資料は各行の source/url にある。**器は印を上げない** —— 上げるのは原仮定者の照合である。',
  rule: ['値・単位・出典ラベル・σ 欄は 1 文字も書き換えない(**印と note だけ**)',
    '**印を付ける前に原記載から value と σ を再現する**(再現できない行には印を付けない)',
    'X7 の 3 欄を埋めただけの行は**印を動かさない**(動くのは警告の側である)',
    '併置行の印を上げるときは**旧印を `previous_mark=` に残す**',
    '追認は確認ではない(印は `unverified` のまま・`confirmation_round=` も付けない)',
    '門の行選択・4 値・プリセット・本体 HTML は 1 バイトも触らない'],
  classes,
  reproduction: { checked: X7_FILLED.length + VERIFIED_NEW.length, reproduced, notReproduced },
  x7Filled, verifiedNew, acknowledged,
  census: { before: BEFORE, after, externalOnlyVerified },
  ae7: Object.assign({ csvNamesLeft }, ae7),
  gate,
  violations: bad,
  doNotWrite: ['判定(4 値)が増えた', '太陽系の σ が揃った', '観測と合った',
    'タイタン環を確認した', 'X7 の規約が完成した', '現実較正を完了した'] };
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));

const pad = (s, n) => String(s) + ' '.repeat(Math.max(0, n - String(s).length));
console.log('[w270b] 確認記録(2026-09-18・第 4 回)の突き合わせ');
console.log('  分類: ' + Object.entries(classes).map(([k, v]) => k + ' ' + v).join(' / '));
console.log('  原記載からの再現: ' + reproduced + '/' + (reproduced + notReproduced));
for (const r of [...x7Filled, ...verifiedNew])
  console.log('     ' + pad(r.ln, 5) + pad(r.body + '|' + r.quantity, 34) + pad(r.klass, 14)
    + ' 印 ' + pad(r.markBefore + '→' + r.markAfter, 24)
    + ' 値Δ ' + pad(r.valueRelErr === null ? '—' : r.valueRelErr.toExponential(1), 9)
    + ' σΔ ' + pad(r.sigmaRelErr === null ? '—' : r.sigmaRelErr.toExponential(1), 9)
    + ' ' + (r.recordId || '—'));
console.log('  CSV 全体の印(厳密読み) 前 → 後');
console.log('     太陽系   verified ' + BEFORE.solar.verified + ' → ' + after.solar.verified
  + ' / verified_by ' + BEFORE.solar.verifiedBy + ' → ' + after.solar.verifiedBy
  + ' / **X7 警告 ' + BEFORE.solar.x7Warn + ' → ' + after.solar.x7Warn + '**'
  + ' / confirmation_round=4 ' + after.solar.round4);
console.log('     星団/銀河 verified ' + BEFORE.cluster.verified + ' → ' + after.cluster.verified
  + ' / 過渡天体 ' + BEFORE.transient.verified + ' → ' + after.transient.verified);
console.log('  record_id: 太陽系 ' + after.solar.withRecordId + '/' + after.solar.rows
  + ' 星団 ' + after.cluster.withRecordId + '/' + after.cluster.rows
  + ' 過渡 ' + after.transient.withRecordId + '/' + after.transient.rows);
console.log('  AE7: 中立表現へ直した行 ' + ae7.cleaned.join('/') + ' / CSV に残る外部名 '
  + csvNamesLeft + ' 件(歴史文書は触らない)');
console.log('  門: **動かしていない** —— ' + (gate.calaudit && gate.calaudit.byStatus
  ? JSON.stringify(gate.calaudit.byStatus) : '(calaudit JSON なし)')
  + ' / 4 値 ' + (gate.solarsigma ? JSON.stringify(gate.solarsigma.fourTally) : '—'));
if (bad.length) console.log('  **違反 ' + bad.length + ' 件**: ' + bad.slice(0, 8).join(' , '));
console.log('→ ' + path.relative(ROOT, OUT));
