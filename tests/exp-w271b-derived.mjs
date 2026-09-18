// 第271便b(第61報・AF14): **J1946+2052 の a の導出行**を毎回やり直して突き合わせる。
//
// ■ 何をしたか
//   採用解(Meng 2025 A&A 704 A153 Table 1 DDFWHE 列)の **Pb と総質量**から相対軌道の
//   a を導いた行を、太陽系 CSV の**末尾に 1 行足した**(`record_id` SOL-cd3cea83)。
//   **行 147(第248便の Pb から導いた a)は 1 文字も動かしていない** —— 第一致行も 147 のままである。
//
// ■ 規約(**不確かさを作らない**)
//   ・a は `a^3 = G M Pb^2 / (4 pi^2)`。入力は**引用した 2 行の record_id** から読む
//     (`derived_from=<Pb の record_id>|<質量行の record_id>` —— **`|` 区切りの並び**である。
//      第272便e/AG19 で `;` から改めた。`;` は鍵の区切り専用で、旧綴りは 1 件目で切れていた)。
//   ・定数は `(GM)_sun = 1.3271244e20 m^3 s^-2`(IAU 2015 Resolution B3・nominal)。質量行の kg 値は
//     **同じ (GM)_sun と CODATA の G** で換算されているので、`M[kg]*G` と `M[M_sun]*(GM)_sun` は
//     同じ積になる。**committed solar mass 1.9885e30 kg とは混ぜない**(本器が 2 経路を突き合わせる)。
//   ・公表表に Pb と M の**共分散が印字されていない**ので、a の 1σ は作れない。
//     sigma 欄は**空**である(空は「不確かさが 0」ではない)。
//
// ■ 本器がしないこと
//   ・CSV を書かない・印を上げ下げしない・判定(4 値)に触らない・プリセットを触らない。
//
// 実行: node tests/exp-w271b-derived.mjs
// 出力: tests/out/derived-w271b.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadObsCsv, listKey, recordIdItems, legacySemicolonList } from './lib-w270b-obscsv.mjs';
import { readSigmaMark } from './lib-w264d-sigmamark.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'tests', 'out', 'derived-w271b.json');
const bad = [];

// **単位の約束**(観測ではない)。器ごとに変えない。
const GM_SUN = 1.3271244e20;      // m^3 s^-2 (IAU 2015 Resolution B3, nominal)
const G_CODATA = 6.67430e-11;     // m^3 kg^-1 s^-2 (CODATA)
const M_SUN_COMMITTED = 1.9885e30; // kg —— **この導出では使わない**(混ぜないことの確認用)

const SOLAR = loadObsCsv(path.join(ROOT, 'paper', 'data', 'solar-observations.csv')).rows;
const byId = (id) => SOLAR.find((r) => r.recordId === id) || null;
const tag = (note, key) => {
  const m = new RegExp('(?:^|[^A-Za-z0-9_])' + key + '=([^;]*)').exec(note || '');
  return m ? m[1].trim() : null;
};
const origMsun = (note) => {
  const m = /orig\s+([0-9.]+)\(\d+\)\s+M_sun/.exec(note || '');
  return m ? Number(m[1]) : null;
};

const DERIVED_ID = 'SOL-cd3cea83';     // 本便で足した導出行
const PREVIOUS_ID = 'SOL-38fb216a';    // 行 147(第248便の Pb から導いた a) —— **不変**

const drow = byId(DERIVED_ID), prow = byId(PREVIOUS_ID);
if (!drow) bad.push('導出行 ' + DERIVED_ID + ' が CSV に無い');
if (!prow) bad.push('従前の導出行 ' + PREVIOUS_ID + ' が CSV に無い');

// ---------------------------------------------------------------- `derived_from` を**並び**として読む
// 第272便e(AG19): 区切りを **`|`** に改めた(`;` は鍵の区切り専用)。これで**既定の鍵読みで
// 並びが最後まで読める** —— 第271便b が記録した「規約の穴」はこの行で閉じた。
// 読取は `tests/lib-w270b-obscsv.mjs` の `listKey()` 1 本にした(器ごとの自前正規表現をやめる)。
const rawFrom = drow ? listKey(drow.note, 'derived_from').join('|') : null;
const fromIds = drow ? recordIdItems(drow.note, 'derived_from') : [];
// 既定の鍵読みが**並びを最後まで返す**ことを実測で残す(旧綴りでは 1 件目で切れていた)。
const naiveFrom = drow ? tag(drow.note, 'derived_from') : null;
const legacyForm = drow ? legacySemicolonList(drow.note, 'derived_from') : null;
if (legacyForm) bad.push('derived_from が旧綴り(`;` 区切り)のまま: ' + JSON.stringify(legacyForm));
if (fromIds.length !== 2) bad.push('derived_from が 2 件の record_id になっていない(' + rawFrom + ')');
const pbRow = fromIds[0] ? byId(fromIds[0]) : null;
const mRow = fromIds[1] ? byId(fromIds[1]) : null;
if (!pbRow) bad.push('derived_from の 1 件目(Pb)が CSV に無い: ' + fromIds[0]);
if (!mRow) bad.push('derived_from の 2 件目(質量行)が CSV に無い: ' + fromIds[1]);

// ---------------------------------------------------------------- 導出をやり直す
const Pb = pbRow ? pbRow.value : null;
const Msun = mRow ? origMsun(mRow.note) : null;     // 原記載(M_sun)
const Mkg = mRow ? mRow.value : null;               // 同じ行の kg 換算値
const cbrt = (x) => Math.cbrt(x);
const aFromMsun = (Number.isFinite(Pb) && Number.isFinite(Msun))
  ? cbrt(Msun * GM_SUN * Pb * Pb / (4 * Math.PI * Math.PI)) : null;
const aFromKg = (Number.isFinite(Pb) && Number.isFinite(Mkg))
  ? cbrt(G_CODATA * Mkg * Pb * Pb / (4 * Math.PI * Math.PI)) : null;
// **混ぜたらどうなるか**(committed solar mass を使うと別の数になる —— 混ぜない理由の実測)
const aMixed = (Number.isFinite(Pb) && Number.isFinite(Msun))
  ? cbrt(G_CODATA * (Msun * M_SUN_COMMITTED) * Pb * Pb / (4 * Math.PI * Math.PI)) : null;

const csvA = drow ? drow.value : null;
const rel = (x, y) => (y === 0 ? (x === 0 ? 0 : Infinity) : Math.abs(x / y - 1));
const TOL = 1e-15;
const reproduced = (aFromMsun !== null && csvA !== null) && rel(aFromMsun, csvA) <= TOL;
if (!reproduced) bad.push('導出行の値が原記載から再現できない(相対差 '
  + (aFromMsun === null || csvA === null ? '—' : rel(aFromMsun, csvA)) + ')');
const twoRoutesAgree = (aFromMsun !== null && aFromKg !== null) && rel(aFromMsun, aFromKg) <= TOL;
if (!twoRoutesAgree) bad.push('M_sun 経路と kg 経路が一致しない(定数の混在)');

// ---------------------------------------------------------------- 足した行の規約
if (drow) {
  if (drow.rawSigma !== '') bad.push('導出行に σ が入っている(共分散が無いので作らない)');
  if (drow.solutionId !== '') bad.push('導出行に solution_id が入っている(印字された列ではない)');
  if (!readSigmaMark(drow.note).verified === false) { /* no-op */ }
  if (readSigmaMark(drow.note).verified) bad.push('導出行が verified になっている(導出値である)');
  if (String(drow.note).indexOf('1.9885e30') < 0)
    bad.push('導出行の note に「committed solar mass を使わない」規約が書かれていない');
}
// **第一致行は行 147 のまま**(このファイルの順で最初に当たる行 = 読取器が採る行)
const firstMatch = SOLAR.find((r) => r.body === 'PSR J1946+2052' && r.quantity === 'semi_major_axis');
const firstIsPrevious = !!(firstMatch && firstMatch.recordId === PREVIOUS_ID);
if (!firstIsPrevious) bad.push('PSR J1946+2052|semi_major_axis の第一致行が 147(' + PREVIOUS_ID + ')でない');
// 行 147 は 1 文字も動いていない(基点 ef2cd45 の値 —— **宣言**)
const PREVIOUS_FROZEN = { value: '7.314902889635589e8', unit: 'm', sigma: '' };
if (prow) {
  if (prow.rawValue !== PREVIOUS_FROZEN.value) bad.push('行 147 の value が動いた(' + prow.rawValue + ')');
  if (prow.unit !== PREVIOUS_FROZEN.unit) bad.push('行 147 の unit が動いた');
  if (prow.rawSigma !== PREVIOUS_FROZEN.sigma) bad.push('行 147 の sigma が動いた');
}
// 従前の a も同じ式で再現できる(**式が同じで入力だけが違う**ことの確認)
const pbPrevRow = SOLAR.find((r) => r.body === 'PSR J1946+2052' && r.quantity === 'orbital_period');
const aPrev = (pbPrevRow && Number.isFinite(Msun))
  ? cbrt(Msun * GM_SUN * pbPrevRow.value * pbPrevRow.value / (4 * Math.PI * Math.PI)) : null;
const prevReproduced = (aPrev !== null && prow) && rel(aPrev, prow.value) <= TOL;
if (!prevReproduced) bad.push('行 147 が同じ式で再現できない');

const out = { when: new Date().toISOString(), wave: '第271便b(2026-09-18・第61報・AF14)',
  base: 'main ef2cd45',
  rule: ['a は `a^3 = G M Pb^2 / (4 pi^2)`。入力は `derived_from=<Pb の record_id>|<質量行>` の**並び**から読む'
    + '(第272便e/AG19 で区切りを `|` に —— `;` は鍵の区切り専用)',
    '定数は `(GM)_sun = 1.3271244e20 m^3 s^-2`(IAU 2015 Resolution B3・nominal)。'
      + '質量行の kg 値は同じ (GM)_sun と CODATA の G で換算されているので 2 経路は同じ積になる',
    '**committed solar mass 1.9885e30 kg とは混ぜない**(混ぜた場合の値も本器が出す)',
    '**共分散が印字されていないので a の 1σ は作らない**(sigma 欄は空 —— 空は 0 ではない)',
    '**行 147 は 1 文字も動かさない**。第一致行も 147 のままで、プリセット入力は変わらない'],
  derivedFrom: { raw: rawFrom, ids: fromIds, naiveSingleValueRead: naiveFrom,
    legacySemicolonForm: legacyForm,
    note: '第272便e(AG19)で `derived_from` の区切りを **`|`** にした(`;` は鍵の区切り専用)。'
      + '既定の鍵読み(`<鍵>=([^;]*)`)で**並びが最後まで返る**(実測: "' + naiveFrom + '")。'
      + '**値・単位・出典・σ・印は 1 文字も動いていない**(動いたのは区切り 1 文字)。' },
  inputs: { pb: { record_id: fromIds[0] || null, ln: pbRow ? pbRow.ln : null,
      value: Pb, unit: pbRow ? pbRow.unit : null, sigma: pbRow ? pbRow.sigma : null,
      source: pbRow ? pbRow.source : null },
    mass: { record_id: fromIds[1] || null, ln: mRow ? mRow.ln : null,
      origMsun: Msun, valueKg: Mkg, sigmaKg: mRow ? mRow.sigma : null,
      source: mRow ? mRow.source : null } },
  constants: { GM_SUN, G_CODATA, M_SUN_COMMITTED,
    note: 'M_SUN_COMMITTED は**この導出で使っていない**(混在の検出用に置いてある)' },
  derivation: { aFromMsun, aFromKg, aMixedWithCommittedSolarMass: aMixed,
    relTwoRoutes: (aFromMsun !== null && aFromKg !== null) ? rel(aFromMsun, aFromKg) : null,
    relMixed: (aFromMsun !== null && aMixed !== null) ? rel(aMixed, aFromMsun) : null,
    csvValue: csvA, relToCsv: (aFromMsun !== null && csvA !== null) ? rel(aFromMsun, csvA) : null,
    reproduced, twoRoutesAgree, tol: TOL },
  previous: { record_id: PREVIOUS_ID, ln: prow ? prow.ln : null,
    value: prow ? prow.value : null, recomputed: aPrev, reproduced: prevReproduced,
    pbUsed: pbPrevRow ? pbPrevRow.value : null, firstIsPrevious },
  addedRow: drow ? { record_id: drow.recordId, ln: drow.ln, body: drow.body, quantity: drow.quantity,
    value: drow.rawValue, unit: drow.unit, sigma: drow.rawSigma, solutionId: drow.solutionId,
    mark: readSigmaMark(drow.note).mark } : null,
  violations: bad,
  doNotWrite: ['a の不確かさが求まった', '採用解で軌道が決まった', 'J1946 の較正が完成した',
    '判定が増えた'] };
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));

console.log('[w271b] J1946+2052 の a の導出行(AF14)');
console.log('  入力 Pb = ' + Pb + ' s (' + (fromIds[0] || '—') + ' 行 ' + (pbRow ? pbRow.ln : '—') + ')');
console.log('       M  = ' + Msun + ' M_sun (' + (fromIds[1] || '—') + ' 行 ' + (mRow ? mRow.ln : '—')
  + ' / 同じ行の kg 値 ' + Mkg + ')');
console.log('  a(M_sun × GM_sun) = ' + aFromMsun);
console.log('  a(kg × G)         = ' + aFromKg + '  相対差 '
  + (out.derivation.relTwoRoutes === null ? '—' : out.derivation.relTwoRoutes));
console.log('  a(**混ぜた場合** M_sun × 1.9885e30 × G) = ' + aMixed + '  相対差 '
  + (out.derivation.relMixed === null ? '—' : out.derivation.relMixed.toExponential(3))
  + ' ← **この経路は使わない**');
console.log('  CSV の値 = ' + csvA + '  再現 ' + reproduced + '(相対差 '
  + (out.derivation.relToCsv === null ? '—' : out.derivation.relToCsv) + ')');
console.log('  従前の行 147 = ' + (prow ? prow.value : '—') + '(同じ式・Pb ' + (pbPrevRow ? pbPrevRow.value : '—')
  + ' で再現 ' + prevReproduced + ')/ 第一致行は 147 のまま ' + firstIsPrevious);
console.log('  足した行: ' + (drow ? (drow.recordId + ' 行 ' + drow.ln + ' σ 欄「'
  + drow.rawSigma + '」solution_id「' + drow.solutionId + '」印 ' + readSigmaMark(drow.note).mark) : '—'));
if (bad.length) console.log('  **違反 ' + bad.length + ' 件**: ' + bad.slice(0, 6).join(' , '));
console.log('→ ' + path.relative(ROOT, OUT));
