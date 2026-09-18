// 第269便b(第59報・W2): **確認記録(2026-09-17・第 3 回)の突き合わせ器**。
//
// 第59報の観測レコードの回答は 4 つである(原文):
//   ・「**J1946+2052 の判定解 5 行: A&A 版の表単体で確認**」
//   ・「**追認 2 件: 確認**」
//   ・「**タイタン環 2 行: 有料版の PDF でしか閲覧できないことを確認。目視では未確認だが、
//      把握している数値を信用して進める**」
//   ・「**X7 警告の残り: 同じ印を付けてよい**」
// 本器はこの回答を**機械可読な宣言表**にし、正本の CSV との突き合わせを 7 分類で数え直す。
//
// ■ 本器がしないこと(**測定値も観測値も 1 つも作らない**)
//   ・エンジンを 1 步も走らせない(`beta/index.html` にも `S._core` にも 1 バイトも触らない)。
//   ・**値・単位・出典ラベルを 1 バイトも書き換えない**(動かしたのは印と note と DOI の url 欄だけ)。
//   ・門(`tests/exp-w249b-calaudit.mjs`)の行選択を差し替えない・4 値を動かさない。
//   ・**印を上げるのは原仮定者の照合だけ**であり、器は「上がっているか」を数えるだけである。
//
// ■ 7 分類(JSON の `classes`)
//   ① `verified-new`           … 第 3 回の回答で `unverified` → `verified` になった行(J1946 の判定解 5 行)。
//   ② `same-mark-copied`       … **原仮定者確認済みの同一表の行がある**ので同じ印を写した行
//                                 (印そのものは動いていない —— 足したのは X7 の 3 欄と `same_mark_as=`)。
//   ③ `acknowledged`           … 訂正の追認 2 件(137 の σ・136/137/139 の DOI)。
//   ④ `trust-and-proceed`      … タイタン環 2 行(**値と σ は残す・印は `unverified` のまま**)。
//   ⑤ `unchanged-no-source-mark` … 写す元(原仮定者確認済みの同一表の行)が無いので**印不変**の行。
//   ⑥ `doi-corrected`          … AD7(Cameron 2018 の旧 DOI が url 欄に残っていた行)。
//   ⑦ `external-checked`       … SPARC 10 点(**verified にしない** —— 外部照合は印を上げない)。
//
// ■ **印を付ける前に原記載から value と σ を再現する**
//   ①②の行は、宣言した**原記載**(`orig`)から value と sigma を**毎回この器が作り直し**、
//   CSV の数字と相対差 `tol` 以内で一致することを確かめる。再現できない行は「不一致」に落ちる
//   (再現できない行に印が付いていたら**違反**である)。
//
// ■ **書かないこと**
//   「タイタン環の σ を原仮定者が確認した」「判定が増えた」「太陽系の σ が揃った」
//   「J1946 を判定解に昇格した」「現実較正を完了した」。**4 値は 1 本も動いていない**。
//
// 実行: node tests/exp-w269b-confirm3.mjs
// 出力: tests/out/confirm3-w269b.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readSigmaMark, readVerifiedBy, readValueChecked } from './lib-w264d-sigmamark.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'tests', 'out', 'confirm3-w269b.json');
const SOLAR_F = 'paper/data/solar-observations.csv';
const CLUSTER_F = 'paper/data/cluster-galaxy-observations.csv';
const ROUND_TAG = 'confirmation_round=3';
const ACK_TAG = 'acknowledged_by=原仮定者 2026-09-17';

// 第270便b(第60報 W2・AE2): **列位置でなくヘッダ名で読む**(`record_id` の列追加で壊れない)。
import { parseCsvLine, headerIndex } from './lib-w270b-obscsv.mjs';
function loadCsv(rel) {
  const rows = [];
  const lines = fs.readFileSync(path.join(ROOT, rel), 'utf8').split('\n');
  const H = headerIndex(lines[0] || '');
  if (H.missing.length) throw new Error('[w269b] ' + rel + ' に必須列が無い: ' + H.missing.join(','));
  const cell = (c, n) => ((n in H) && c[H[n]] !== undefined) ? c[H[n]] : '';
  let ln = 0;
  for (const L of lines) {
    ln++;
    if (!L.trim() || L.startsWith('body,')) continue;
    const c = parseCsvLine(L);
    if (c.length < 9) continue;
    const sgRaw = String(cell(c, 'sigma')).trim();
    const sg = sgRaw !== '' ? Number(sgRaw) : null;
    rows.push({ file: rel, ln, body: cell(c, 'body'), quantity: cell(c, 'quantity'),
      value: Number(cell(c, 'value')), rawValue: cell(c, 'value'),
      unit: cell(c, 'unit'), source: cell(c, 'source'), url: cell(c, 'url'),
      note: cell(c, 'note') || '', recordId: String(cell(c, 'record_id')).trim() || null,
      rawSigma: sgRaw, sigma: Number.isFinite(sg) ? sg : null });
  }
  return rows;
}
const CSV = { [SOLAR_F]: loadCsv(SOLAR_F), [CLUSTER_F]: loadCsv(CLUSTER_F) };
const row = (file, ln) => CSV[file].find((r) => r.ln === ln) || null;
const has = (note, s) => String(note || '').indexOf(s) >= 0;
const bad = [];
const rel = (a, b) => (b === 0 ? (a === 0 ? 0 : Infinity) : Math.abs(a / b - 1));

// ---------------------------------------------------------------- 換算定数(**その行の note にある定数**)
const DAY = 86400;       // 1 d = 86400 s
const JYR = 3.15576e7;   // ユリウス年 365.25 d(単位の規約であって観測ではない)

// ================================================================ ① verified-new(J1946 の判定解 5 行)
// `at` は原仮定者が見た表・列、`orig` はその原記載、`value`/`sigma` は**この器が原記載から
// 毎回やり直す換算**である(CSV の数字を写していない)。`before` は基点 4945764 の印(宣言)。
const VERIFIED_NEW = [
  { ln: 285, body: 'PSR J1946+2052', quantity: 'orbital_period', before: 'unverified',
    at: 'Meng 2025 A&A 704 A153 Table 1 DDFWHE column (A&A table view)',
    orig: 'Pb = 0.07848805554(2) d', value: 0.07848805554 * DAY, sigma: 2e-11 * DAY, tol: 1e-12,
    how: '0.07848805554 d x 86400 s/d(σ は最終桁 2e-11 d を秒へ)' },
  { ln: 289, body: 'PSR J1946+2052', quantity: 'eccentricity', before: 'unverified',
    at: 'Meng 2025 A&A 704 A153 Table 1 DDFWHE column (A&A table view)',
    orig: 'e = 0.0638363(8)', value: 0.0638363, sigma: 8e-7, tol: 1e-12,
    how: '無次元(σ は最終桁 (8) = 8e-7)' },
  { ln: 290, body: 'PSR J1946+2052', quantity: 'periastron_advance', before: 'unverified',
    at: 'Meng 2025 A&A 704 A153 Table 1 DDFWHE column (A&A table view)',
    orig: 'omega_dot = 25.79205(40) deg/yr', value: 25.79205, sigma: 40e-5, tol: 1e-12,
    how: '換算なし(σ は最終 2 桁 (40) = 4.0e-4 deg/yr)' },
  { ln: 300, body: 'PSR J1946+2052', quantity: 'orbital_period', before: 'unverified',
    at: 'Meng 2025 A&A 704 A153 Table 1 DDGR column (A&A table view)',
    orig: 'Pb = 0.078488055530(8) d', value: 0.078488055530 * DAY, sigma: 8e-12 * DAY, tol: 1e-12,
    how: '0.078488055530 d x 86400 s/d(σ は最終桁 8e-12 d を秒へ)' },
  { ln: 302, body: 'PSR J1946+2052', quantity: 'eccentricity', before: 'unverified',
    at: 'Meng 2025 A&A 704 A153 Table 1 DDGR column (A&A table view)',
    orig: 'e = 0.0638365(4)', value: 0.0638365, sigma: 4e-7, tol: 1e-12,
    how: '無次元(σ は最終桁 (4) = 4e-7)' },
];

// ================================================================ ② same-mark-copied
// 第59報「**X7 警告の残り: 同じ印を付けてよい**」。**印そのものは 1 bit も動いていない**
// (この 5 行はいずれも本便の前から `verified` である)。足したのは X7 の 3 欄と `same_mark_as=` で、
// 確認者の日付は**写す元の行の日付**である。
const SAME_MARK = [
  { ln: 114, body: 'Sirius B', quantity: 'eccentricity', before: 'verified', sameAs: 195,
    who: '原仮定者 2026-09-16',
    orig: 'e = 0.59142 +/- 0.00037', value: 0.59142, sigma: 3.7e-4, tol: 1e-12,
    how: '無次元(行 195 と同じ Bond 2017 Table 4 の同じ値・同じ σ)' },
  { ln: 115, body: 'Sirius B', quantity: 'orbital_period', before: 'verified', sameAs: 194,
    who: '原仮定者 2026-09-16',
    orig: 'P = 50.1284 +/- 0.0043 yr', value: 50.1284 * JYR, sigma: 0.0043 * JYR, tol: 3e-9,
    how: '50.1284 yr x 3.15576e7 s/yr = 1581931995.84 s。**この行は 7 桁へ丸めた転写 1.581932e9 s** '
      + 'なので原記載との相対差 2.6e-9(= 4.16 s)を許す。行 194 は丸めない転写で、両者は同一値ではない' },
  { ln: 125, body: 'PSR J0737-3039 B', quantity: 'periastron_advance', before: 'verified', sameAs: 211,
    who: '原仮定者 2026-09-16',
    orig: 'omega_dot = 16.899 323(13) deg/yr', value: 16.899323, sigma: 1.3e-5, tol: 1e-12,
    how: '換算なし(行 211 と同じ Kramer 2021 Table IV の同じ値・同じ σ)' },
  { ln: 148, body: 'PSR J1946+2052', quantity: 'periastron_advance', before: 'verified', sameAs: 290,
    who: '原仮定者 2026-09-17',
    orig: 'omega_dot = 25.79205(40) deg/yr', value: 25.79205, sigma: 4.0e-4, tol: 1e-12,
    how: '換算なし(行 290 は①で verified になった同じ Meng 2025 Table 1 DDFWHE の同じ値・同じ σ)' },
  { ln: 180, body: 'PSR J1946+2052', quantity: 'periastron_advance', before: 'verified', sameAs: 290,
    who: '原仮定者 2026-09-17',
    orig: 'omega_dot = 25.79205(40) deg/yr', value: 25.79205, sigma: 4.0e-4, tol: 1e-12,
    how: '換算なし(併置行 —— 行 290 と同じ表・同じ列・同じ値・同じ σ)' },
];

// ================================================================ ③ acknowledged(追認 2 件)
// 第59報「**追認 2 件: 確認**」。**値は 1 バイトも動かさない**(追認の印だけ)。
const ACK = [
  { ln: 137, body: 'PSR J1757-1854', quantity: 'eccentricity',
    what: 'σ の転写訂正 1.0e-7 → 1.0e-6(第268便b)', frozenValue: '0.6058142', frozenSigma: '1.0e-6' },
  { ln: 136, body: 'PSR J1757-1854', quantity: 'orbital_period',
    what: 'DOI の訂正 slx185 → sly003(第268便b)', frozenValue: '15857.669019168', frozenSigma: '4.32e-6' },
  { ln: 139, body: 'PSR J1757-1854', quantity: 'periastron_advance',
    what: 'DOI の訂正 slx185 → sly003(第268便b)', frozenValue: '10.3651', frozenSigma: '2e-4' },
];
// **追認に含まれない訂正**(未追認のまま・決断事項へ)。
const ACK_PENDING = [
  { ln: 421, body: 'Titan ringlet', quantity: 'pattern_speed_m1',
    what: '量名の改名 mean_motion → pattern_speed_m1(第268便b)—— 第 3 回の追認 2 件に含まれない' },
];

// ================================================================ ④ trust-and-proceed(タイタン環)
// 第59報「**有料版の PDF でしか閲覧できないことを確認。目視では未確認だが、把握している数値を
// 信用して進める**」。**値と σ はそのまま残す**(空欄にする隔離は採らない)。
// **印は `unverified` のまま**である —— 目視していないので確認ではない。
const TRUST = [
  { ln: 420, body: 'Titan ringlet', quantity: 'semi_major_axis', before: 'unverified',
    frozenValue: '77878.7', frozenUnit: 'km', frozenSigma: '0.15' },
  { ln: 421, body: 'Titan ringlet', quantity: 'pattern_speed_m1', before: 'unverified',
    frozenValue: '22.5753', frozenUnit: 'deg/day', frozenSigma: '0.0008' },
];

// ================================================================ ⑤ unchanged-no-source-mark
// 「同じ印を付けてよい」は**原仮定者が確認済みの同一表の行がある**ときにだけ使える。
// 下の 6 行はその元が無い(併置行 260/262/263 自身が未確認・Stairs 2002 は併置行が無い)ので**印不変**。
const NO_SOURCE = [
  { ln: 136, body: 'PSR J1757-1854', quantity: 'orbital_period', before: 'verified',
    why: 'Cameron 2018 Table 2 —— 併置行 260 が confirmation_2=not-found-by-author(未確認)' },
  { ln: 137, body: 'PSR J1757-1854', quantity: 'eccentricity', before: 'verified',
    why: 'Cameron 2018 Table 2 —— 併置行 262 が未確認' },
  { ln: 139, body: 'PSR J1757-1854', quantity: 'periastron_advance', before: 'verified',
    why: 'Cameron 2018 Table 2 —— 併置行 263 が未確認' },
  { ln: 171, body: 'PSR B1534+12', quantity: 'orbital_period', before: 'verified',
    why: 'Stairs 2002 Table 1 —— この表を転写した併置行がこのファイルに無い' },
  { ln: 172, body: 'PSR B1534+12', quantity: 'eccentricity', before: 'verified',
    why: 'Stairs 2002 Table 1 —— 同上' },
  { ln: 173, body: 'PSR B1534+12', quantity: 'periastron_advance', before: 'verified',
    why: 'Stairs 2002 Table 1 —— 同上' },
];
// 写す元として使えなかった併置行(印を確かめてから判断した記録)。
const NO_SOURCE_PARTNERS = [260, 262, 263];

// ================================================================ ⑥ doi-corrected(AD7)
const OLD_DOI = 'https://doi.org/10.1093/mnrasl/slx185';
const NEW_DOI = 'https://doi.org/10.1093/mnrasl/sly003';
const DOI_FIX = [
  { ln: 133, body: 'PSR J1757-1854', quantity: 'mass', before: 'unverified' },
  { ln: 134, body: 'PSR J1757-1854 companion', quantity: 'mass', before: 'unverified' },
  { ln: 135, body: 'PSR J1757-1854', quantity: 'rotation_period', before: null },
  { ln: 138, body: 'PSR J1757-1854', quantity: 'semi_major_axis', before: null },
  { ln: 140, body: 'PSR J1757-1854', quantity: 'orbital_period_derivative', before: null },
];
// **対象外**(行番号ではなく body・quantity・旧 URL で照合した結果)。
const DOI_EXCLUDED = [
  { ln: 141, body: 'PSR J1757-1854', quantity: 'radius',
    why: 'Dietrich et al. 2020 Science 370 1450 の半径 proxy —— 出典も DOI も Cameron 2018 ではない' },
];

// ================================================================ ⑦ external-checked(SPARC 10 点)
const SPARC = [
  [138, 'v_rot(r=0.32 kpc)_candidate'], [139, 'v_rot(r=0.64 kpc)_candidate'],
  [140, 'v_rot(r=8.04 kpc)_candidate'], [141, 'v_rot(r=12.05 kpc)_candidate'],
  [142, 'v_rot(r=18.13 kpc)_candidate'], [143, 'v_rot(r=24.03 kpc)_candidate'],
  [144, 'v_rot(r=32.14 kpc)_candidate'], [145, 'v_rot(r=38.19 kpc)_candidate'],
  [146, 'v_rot(r=42.17 kpc)_candidate'], [147, 'v_rot(r=44.08 kpc)_candidate'],
];

// ---------------------------------------------------------------- 基点(main 4945764)の実測値
// **本便の前**に同じ読み方で数えた値である(前後の比較に使う。宣言であって推測ではない)。
const BEFORE = { solar: { rows: 521, verified: 49, verifiedBy: 38, x7Warn: 11 },
  cluster: { rows: 154, verified: 6, verifiedBy: 6, x7Warn: 0 } };

// ================================================================ 突き合わせ
function checkRow(d, file) {
  const r = row(file, d.ln);
  const o = { file, ln: d.ln, body: d.body, quantity: d.quantity,
    markBefore: d.before === undefined ? null : d.before, markAfter: null,
    verifiedBy: null, verifiedAt: null, verifiedValue: null };
  if (!r) { bad.push(`行 ${d.ln}(${file})が無い`); return { o, r: null }; }
  if (r.body !== d.body || r.quantity !== d.quantity)
    bad.push(`行 ${d.ln} が ${d.body}|${d.quantity} でない(${r.body}|${r.quantity})`);
  const mk = readSigmaMark(r.note), vb = readVerifiedBy(r.note);
  o.markAfter = mk.mark;
  o.verifiedBy = vb.present ? vb.who : null;
  o.verifiedAt = vb.at; o.verifiedValue = vb.value;
  return { o, r, mk, vb };
}

// ---- ① verified-new
let reproduced = 0, notReproduced = 0;
const verifiedNew = VERIFIED_NEW.map((d) => {
  const { o, r, mk, vb } = checkRow(d, SOLAR_F);
  o.klass = 'verified-new'; o.at = d.at; o.orig = d.orig; o.how = d.how; o.tol = d.tol;
  o.recomputedValue = d.value; o.recomputedSigma = d.sigma;
  o.csvValue = r ? r.value : null; o.csvSigma = r ? r.sigma : null;
  o.valueRelErr = null; o.sigmaRelErr = null; o.reproduced = false;
  if (!r) { notReproduced++; return o; }
  o.valueRelErr = rel(d.value, r.value);
  o.sigmaRelErr = (r.sigma === null) ? null : rel(d.sigma, r.sigma);
  o.reproduced = (o.valueRelErr <= d.tol) && (o.sigmaRelErr !== null && o.sigmaRelErr <= d.tol);
  if (o.reproduced) reproduced++; else {
    notReproduced++;
    bad.push(`①行 ${d.ln} は原記載から再現できない(値 ${o.valueRelErr} / σ ${o.sigmaRelErr})`);
  }
  // **再現できた行だけ** verified になっていてよい
  if (o.reproduced) {
    if (!mk.verified) bad.push(`①行 ${d.ln} が verified になっていない`);
    if (!vb.present || vb.who !== '原仮定者 2026-09-17')
      bad.push(`①行 ${d.ln} の verified_by が「原仮定者 2026-09-17」でない(${o.verifiedBy})`);
    if (vb.at !== d.at) bad.push(`①行 ${d.ln} の verified_at が宣言と違う(${vb.at})`);
    if (!vb.value) bad.push(`①行 ${d.ln} の verified_value が欠けている`);
    if (!has(r.note, ROUND_TAG)) bad.push(`①行 ${d.ln} に ${ROUND_TAG} が無い`);
    if (r.sigma === null) bad.push(`①行 ${d.ln} は σ が空なのに verified である`);
    if (d.before !== 'unverified') bad.push(`①行 ${d.ln} の基点の印の宣言が unverified でない`);
  } else if (mk.verified) {
    bad.push(`①行 ${d.ln} は再現できないのに verified になっている`);
  }
  // 第268便b の外部照合印は**残っている**(印を上げたのは外部照合ではない)
  const vc = readValueChecked(r.note);
  o.externalCheck = vc.present ? vc.who : null;
  if (!vc.present || vc.who !== 'external review 2026-09-17')
    bad.push(`①行 ${d.ln} の第268便b の外部照合印が消えている`);
  if (!has(r.note, 'confirmation_2=not-found-by-author'))
    bad.push(`①行 ${d.ln} の第 2 回の記録(confirmation_2=not-found-by-author)が消えている`);
  return o;
});

// ---- ② same-mark-copied
const sameMark = SAME_MARK.map((d) => {
  const { o, r, mk, vb } = checkRow(d, SOLAR_F);
  o.klass = 'same-mark-copied'; o.sameAs = d.sameAs; o.orig = d.orig; o.how = d.how; o.tol = d.tol;
  o.who = d.who;
  o.recomputedValue = d.value; o.recomputedSigma = d.sigma;
  o.csvValue = r ? r.value : null; o.csvSigma = r ? r.sigma : null;
  o.valueRelErr = null; o.sigmaRelErr = null; o.reproduced = false;
  const src = row(SOLAR_F, d.sameAs);
  o.sourceVerifiedAt = src ? readVerifiedBy(src.note).at : null;
  o.sourceVerifiedBy = src ? readVerifiedBy(src.note).who : null;
  o.sourceMark = src ? readSigmaMark(src.note).mark : null;
  if (!r || !src) { notReproduced++; bad.push(`②行 ${d.ln} か写す元 ${d.sameAs} が無い`); return o; }
  o.valueRelErr = rel(d.value, r.value);
  o.sigmaRelErr = (r.sigma === null) ? null : rel(d.sigma, r.sigma);
  o.reproduced = (o.valueRelErr <= d.tol) && (o.sigmaRelErr !== null && o.sigmaRelErr <= d.tol);
  if (o.reproduced) reproduced++; else {
    notReproduced++;
    bad.push(`②行 ${d.ln} は原記載から再現できない(値 ${o.valueRelErr} / σ ${o.sigmaRelErr})`);
  }
  // **写す元は原仮定者が確認済みでなければならない**(器で確かめてから写す)
  if (o.sourceMark !== 'verified') bad.push(`②写す元 ${d.sameAs} が verified でない(${o.sourceMark})`);
  if (!o.sourceVerifiedBy || o.sourceVerifiedBy.indexOf('原仮定者') < 0)
    bad.push(`②写す元 ${d.sameAs} が原仮定者の確認を持っていない`);
  // **印は動いていない**(基点も現在も verified)
  if (d.before !== 'verified') bad.push(`②行 ${d.ln} の基点の印の宣言が verified でない`);
  if (!mk.verified) bad.push(`②行 ${d.ln} の印が動いている(${mk.mark})`);
  if (!vb.present || vb.who !== d.who)
    bad.push(`②行 ${d.ln} の verified_by が写す元の日付と違う(${o.verifiedBy} / 宣言 ${d.who})`);
  if (vb.at !== o.sourceVerifiedAt)
    bad.push(`②行 ${d.ln} の verified_at が写す元と一致しない(${vb.at} / ${o.sourceVerifiedAt})`);
  if (!has(r.note, `same_mark_as=${d.sameAs}`)) bad.push(`②行 ${d.ln} に same_mark_as=${d.sameAs} が無い`);
  if (!has(r.note, '(author 2026-09-17: same mark allowed'))
    bad.push(`②行 ${d.ln} に原仮定者の許可の記録が無い`);
  if (!has(r.note, ROUND_TAG)) bad.push(`②行 ${d.ln} に ${ROUND_TAG} が無い`);
  if (r.sigma === null) bad.push(`②行 ${d.ln} は σ が空なのに verified である`);
  return o;
});

// ---- ③ acknowledged
const acknowledged = ACK.map((d) => {
  const { o, r } = checkRow(d, SOLAR_F);
  o.klass = 'acknowledged'; o.what = d.what;
  if (!r) return o;
  o.acknowledged = has(r.note, ACK_TAG);
  o.value = r.rawValue; o.sigma = r.rawSigma;
  if (!o.acknowledged) bad.push(`③行 ${d.ln} に ${ACK_TAG} が無い`);
  if (r.rawValue !== d.frozenValue) bad.push(`③行 ${d.ln} の value が動いている(${r.rawValue})`);
  if (r.rawSigma !== d.frozenSigma) bad.push(`③行 ${d.ln} の σ が動いている(${r.rawSigma})`);
  return o;
});
const ackPending = ACK_PENDING.map((d) => {
  const { o, r } = checkRow(d, SOLAR_F);
  o.klass = 'acknowledgement-pending'; o.what = d.what;
  if (!r) return o;
  o.acknowledged = has(r.note, ACK_TAG);
  // **第270便b(第 4 回)で追認された**(`acknowledged_by=原仮定者 2026-09-18`)。第 3 回の
  //   未追認の記録は残っており、この器が数えるのは**第 3 回の追認 2 件に含まれないこと**である。
  o.closedInRound4 = has(r.note, 'acknowledged_by=原仮定者 2026-09-18');
  if (o.acknowledged) bad.push(`③行 ${d.ln} に追認印が付いている(第 3 回の追認 2 件に含まれない)`);
  if (!has(r.note, 'acknowledgement_pending=2026-09-17'))
    bad.push(`③行 ${d.ln} に未追認の記録が無い`);
  return o;
});

// ---- ④ trust-and-proceed
const trust = TRUST.map((d) => {
  const { o, r, mk, vb } = checkRow(d, SOLAR_F);
  o.klass = 'trust-and-proceed';
  if (!r) return o;
  o.value = r.rawValue; o.unit = r.unit; o.sigma = r.rawSigma;
  if (r.rawValue !== d.frozenValue) bad.push(`④行 ${d.ln} の value が動いている(${r.rawValue})`);
  if (r.unit !== d.frozenUnit) bad.push(`④行 ${d.ln} の unit が動いている(${r.unit})`);
  if (r.rawSigma !== d.frozenSigma)
    bad.push(`④行 ${d.ln} の σ が動いている(${r.rawSigma})—— 隔離(空欄化)は採らない裁定である`);
  if (mk.mark !== 'unverified') bad.push(`④行 ${d.ln} の印が unverified でない(${mk.mark})`);
  if (vb.present) bad.push(`④行 ${d.ln} に X7 の verified_by が付いている(目視していない)`);
  if (!has(r.note, 'confirmation_3=paywalled-not-viewed-by-author 2026-09-17'))
    bad.push(`④行 ${d.ln} に閲覧不可の記録が無い`);
  if (!has(r.note, 'author_decision=trust-transcribed-values-and-proceed 2026-09-17'))
    bad.push(`④行 ${d.ln} に裁定(信用して進める)の記録が無い`);
  if (!has(r.note, 'secondary_location=Nicholson 2014 Icarus 241 373 Table 7'))
    bad.push(`④行 ${d.ln} に二次取得先の記録が無い`);
  if (has(r.note, ROUND_TAG))
    bad.push(`④行 ${d.ln} に ${ROUND_TAG} が付いている(確認ではない —— 裁定である)`);
  o.forwardedToGate = has(r.note, 'NOT forwarded') ? false : null;
  return o;
});

// ---- ⑤ unchanged-no-source-mark
const noSource = NO_SOURCE.map((d) => {
  const { o, r, mk, vb } = checkRow(d, SOLAR_F);
  o.klass = 'unchanged-no-source-mark'; o.why = d.why;
  if (!r) return o;
  // **第270便b(第60報・第 4 回)で解けた行**: 原仮定者が Cameron 2018 Table 2 と Stairs 2002 を
  //   目視で確認したので、この 6 行は**写す元を要さず** X7 の 3 欄が埋まった(`confirmation_round=4`)。
  //   第 3 回の時点の記録(`same_mark_not_available=2026-09-17`)は**残したまま**で、
  //   **印そのものはこの 6 行では 1 bit も動いていない**(第 3 回の時点から `verified` である)。
  o.resolvedInRound4 = /(?:^|[^A-Za-z0-9_])confirmation_round=4\b/.test(r.note);
  if (mk.mark !== d.before) bad.push(`⑤行 ${d.ln} の印が動いている(${mk.mark} / 基点 ${d.before})`);
  if (vb.present && !o.resolvedInRound4)
    bad.push(`⑤行 ${d.ln} に X7 の verified_by が付いている(写す元が無い行である)`);
  if (!has(r.note, 'same_mark_not_available=2026-09-17'))
    bad.push(`⑤行 ${d.ln} に「写す元が無い」の記録が無い`);
  if (has(r.note, 'same_mark_as=')) bad.push(`⑤行 ${d.ln} に same_mark_as= が付いている`);
  return o;
});
// 併置行(写す元の候補)の印を器で確かめた記録
const partners = NO_SOURCE_PARTNERS.map((ln) => {
  const r = row(SOLAR_F, ln);
  const mk = r ? readSigmaMark(r.note) : { mark: null };
  const o = { file: SOLAR_F, ln, body: r ? r.body : null, quantity: r ? r.quantity : null,
    mark: mk.mark, verifiedBy: r ? (readVerifiedBy(r.note).present ? readVerifiedBy(r.note).who : null) : null,
    usableAsSource: false, verifiedInRound4: false };
  if (!r) { bad.push(`⑤併置行 ${ln} が無い`); return o; }
  // **第 3 回の時点**では、この 3 行自身が未確認(`confirmation_2=not-found-by-author`)なので
  //   写す元として使えなかった。第270便b(第 4 回)で原仮定者が同じ表を目視確認し、この 3 行は
  //   `unverified` → `verified` になった —— **第 3 回の判断が誤っていたのではなく、後から確認が来た**。
  o.verifiedInRound4 = /(?:^|[^A-Za-z0-9_])confirmation_round=4\b/.test(r.note);
  o.usableAsSource = mk.verified && readVerifiedBy(r.note).present && !o.verifiedInRound4;
  if (o.usableAsSource)
    bad.push(`⑤併置行 ${ln} は写す元として使える(印を写していないのは誤り)`);
  return o;
});

// ---- ⑥ doi-corrected
const doiFixed = DOI_FIX.map((d) => {
  const { o, r, mk, vb } = checkRow(d, SOLAR_F);
  o.klass = 'doi-corrected'; o.url = r ? r.url : null; o.previousUrl = OLD_DOI;
  if (!r) return o;
  if (r.url !== NEW_DOI) bad.push(`⑥行 ${d.ln} の url が sly003 でない(${r.url})`);
  if (!has(r.note, 'url_corrected=2026-09-17')) bad.push(`⑥行 ${d.ln} に url_corrected= が無い`);
  if (!has(r.note, 'previous_url=' + OLD_DOI)) bad.push(`⑥行 ${d.ln} に previous_url= が無い`);
  if (mk.mark !== d.before) bad.push(`⑥行 ${d.ln} の印が動いている(${mk.mark} / 基点 ${d.before})`);
  if (vb.present) bad.push(`⑥行 ${d.ln} に X7 の verified_by が付いている(DOI の訂正は確認ではない)`);
  if (!/Cameron et al\. \(2018\)/.test(r.source))
    bad.push(`⑥行 ${d.ln} の出典が Cameron 2018 でない(照合は body・quantity・旧 URL である)`);
  return o;
});
const doiExcluded = DOI_EXCLUDED.map((d) => {
  const { o, r } = checkRow(d, SOLAR_F);
  o.klass = 'doi-excluded'; o.why = d.why; o.url = r ? r.url : null;
  if (!r) return o;
  if (has(r.url, 'mnrasl')) bad.push(`⑥対象外の行 ${d.ln} が MNRAS Letters の DOI を持っている`);
  if (has(r.note, 'url_corrected=2026-09-17')) bad.push(`⑥対象外の行 ${d.ln} を訂正している`);
  return o;
});
// CSV 全体: **旧 DOI は url 欄に 0 件・note の previous_url にだけ残る**
let oldDoiInUrl = 0, oldDoiInNote = 0;
for (const r of CSV[SOLAR_F]) {
  if (has(r.url, 'slx185')) { oldDoiInUrl++; bad.push(`⑥行 ${r.ln} の url 欄に旧 DOI が残っている`); }
  if (has(r.note, 'slx185')) oldDoiInNote++;
}

// ---- ⑦ external-checked(SPARC 10 点 —— **verified にしない**)
const sparc = SPARC.map(([ln, quantity]) => {
  const r = row(CLUSTER_F, ln);
  const mk = r ? readSigmaMark(r.note) : { mark: null };
  const vb = r ? readVerifiedBy(r.note) : { present: false };
  const vc = r ? readValueChecked(r.note) : { present: false, at: null, value: null };
  const o = { file: CLUSTER_F, ln, body: r ? r.body : null, quantity,
    markBefore: 'unverified', markAfter: mk.mark, klass: 'external-checked',
    externalCheck: vc.present ? vc.who : null, externalAt: vc.at, externalValue: vc.value,
    verifiedBy: vb.present ? vb.who : null };
  if (!r) { bad.push(`⑦星団/銀河 行 ${ln} が無い`); return o; }
  if (r.body !== 'NGC 3198' || r.quantity !== quantity)
    bad.push(`⑦行 ${ln} が NGC 3198|${quantity} でない(${r.body}|${r.quantity})`);
  if (!vc.present || vc.who !== 'external review 2026-09-17')
    bad.push(`⑦行 ${ln} に 2026-09-17 の外部照合印が無い`);
  if (mk.mark !== 'unverified') bad.push(`⑦行 ${ln} の印が unverified でない(${mk.mark})—— 外部照合は印を上げない`);
  if (vb.present) bad.push(`⑦行 ${ln} に X7 の verified_by が付いている(外部照合は確認者ではない)`);
  return o;
});

// ---------------------------------------------------------------- CSV 全体の印(厳密読み)
function census(rel2) {
  const rows = CSV[rel2];
  let verified = 0, verifiedBy = 0, x7Warn = 0, round3 = 0, round3Verified = 0, sameMarkAs = 0;
  for (const r of rows) {
    const v = readSigmaMark(r.note).verified, b = readVerifiedBy(r.note).present;
    if (v) verified++;
    if (b) verifiedBy++;
    if (v && !b) x7Warn++;
    if (/(?:^|[^A-Za-z0-9_])confirmation_round=3\b/.test(r.note)) { round3++; if (v) round3Verified++; }
    if (/(?:^|[^A-Za-z0-9_])same_mark_as=/.test(r.note)) sameMarkAs++;
  }
  return { rows: rows.length, verified, verifiedBy, x7Warn, round3, round3Verified, sameMarkAs };
}
const after = { solar: census(SOLAR_F), cluster: census(CLUSTER_F) };
if (after.solar.round3 !== VERIFIED_NEW.length + SAME_MARK.length)
  bad.push(`太陽系で ${ROUND_TAG} を持つ行が ${after.solar.round3}`
    + `(宣言は ${VERIFIED_NEW.length + SAME_MARK.length})`);
if (after.solar.sameMarkAs !== SAME_MARK.length)
  bad.push(`same_mark_as= を持つ行が ${after.solar.sameMarkAs}(宣言は ${SAME_MARK.length})`);
// 第270便b(第 4 回)で `unverified` → `verified` になった併置行 260/262/263 の 3 行は、
// **この便(第 3 回)の増分ではない**ので分けて数える(**便を跨いで固定値を黙って増やさない**)。
const round4NewVerified = CSV[SOLAR_F].filter((r) =>
  /(?:^|[^A-Za-z0-9_])confirmation_round=4\b/.test(r.note)
  && /(?:^|[^A-Za-z0-9_])previous_mark=unverified\b/.test(r.note)
  && readSigmaMark(r.note).verified).length;
if (after.solar.verified - BEFORE.solar.verified - round4NewVerified !== VERIFIED_NEW.length)
  bad.push(`太陽系の verified の増分が ${after.solar.verified - BEFORE.solar.verified}`
    + `(宣言は ${VERIFIED_NEW.length} + 第 4 回の ${round4NewVerified} —— 同印写しは印を動かさない)`);
if (after.cluster.verified !== BEFORE.cluster.verified)
  bad.push(`星団/銀河の verified が動いた(${BEFORE.cluster.verified} → ${after.cluster.verified})`);
// **外部確認印だけで verified になっている行は 1 つも無い**(Z11)
const externalOnlyVerified = [];
for (const f of [SOLAR_F, CLUSTER_F]) for (const r of CSV[f]) {
  if (readValueChecked(r.note).present && readSigmaMark(r.note).verified
    && !readVerifiedBy(r.note).present) externalOnlyVerified.push(f + ':' + r.ln);
}
if (externalOnlyVerified.length)
  bad.push('外部確認印だけで verified になっている行: ' + externalOnlyVerified.join(','));

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
      verifiedFlips: (cal.sigmaRegate.verifiedFlips || []).length } : null,
    sigmaMarkAudit: cal.sigmaMarkAudit ? { rows: cal.sigmaMarkAudit.rows,
      legacyVerified: cal.sigmaMarkAudit.legacyVerified,
      strictVerified: cal.sigmaMarkAudit.strictVerified,
      legendRows: cal.sigmaMarkAudit.legendRows,
      verifiedByMissing: (cal.sigmaMarkAudit.verifiedByMissing || []).length } : null } : null,
  solarsigma: sol ? { cutTally: sol.cutTally || null, fourTally: sol.fourTally || null } : null,
  connected: false,
  why: '**印が `verified` であることは門に繋がっていることではない。** J1946+2052 の判定行は'
    + 'ファイル順の最初(Stovall 2018 の行 145/146)のままで、本便は行選択を 1 件も差し替えていない。'
    + 'タイタン環の 2 行は C 環内縁の観測門へ転送しない(AB3 は閉じたまま)。'
    + '星団・銀河(47 Tuc / NGC 3198)は門の宛先表に 1 行も無い。',
};

const classes = {
  'verified-new': verifiedNew.length,
  'same-mark-copied': sameMark.length,
  acknowledged: acknowledged.length,
  'acknowledgement-pending': ackPending.length,
  'trust-and-proceed': trust.length,
  'unchanged-no-source-mark': noSource.length,
  'doi-corrected': doiFixed.length,
  'doi-excluded': doiExcluded.length,
  'external-checked': sparc.length,
};

const out = { when: new Date().toISOString(), wave: '第269便b(第59報・W2)',
  base: 'main 4945764',
  provenance: '原仮定者が提供した観測レコードの確認記録(2026-09-17・第 3 回)。'
    + '一次資料は各行の source/url にある。**器は印を上げない** —— 上げるのは原仮定者の照合である。',
  rule: ['値・単位・出典ラベルは 1 バイトも書き換えない(**印と note と DOI の url 欄だけ**)',
    '**印を付ける前に原記載から value と σ を再現する**(再現できない行には印を付けない)',
    '同じ印を写してよいのは**原仮定者確認済みの同一表の行がある**場合だけ(無い行は不変と理由)',
    'タイタン環は**値と σ を残し、印は unverified のまま**(隔離しない・確認したとも書かない)',
    '外部照合印(`value_checked_by=`)は印を 1 bit も上げない',
    'DOI の訂正は**行番号ではなく body・quantity・旧 URL**で照合する',
    '門の行選択・4 値・プリセット・本体 HTML は 1 バイトも触らない'],
  classes,
  reproduction: { checked: VERIFIED_NEW.length + SAME_MARK.length, reproduced, notReproduced },
  verifiedNew, sameMark, acknowledged, ackPending, trust, noSource, partners,
  doiFixed, doiExcluded, oldDoi: { inUrlColumn: oldDoiInUrl, inNote: oldDoiInNote },
  sparc,
  census: { before: BEFORE, after, externalOnlyVerified },
  gate,
  violations: bad,
  doNotWrite: ['タイタン環の σ を原仮定者が確認した', '判定(4 値)が増えた',
    '太陽系の σ が揃った', 'J1946 を判定解に昇格した', '門に入れた', '現実較正を完了した'] };
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));

const pad = (s, n) => String(s) + ' '.repeat(Math.max(0, n - String(s).length));
console.log('[w269b] 確認記録(2026-09-17・第 3 回)の突き合わせ');
console.log('  分類: ' + Object.entries(classes).map(([k, v]) => k + ' ' + v).join(' / '));
console.log('  原記載からの再現: ' + reproduced + '/' + (reproduced + notReproduced));
for (const r of [...verifiedNew, ...sameMark])
  console.log('     ' + pad(r.ln, 5) + pad(r.body + '|' + r.quantity, 36) + pad(r.klass, 18)
    + ' 印 ' + pad(r.markBefore + '→' + r.markAfter, 24)
    + ' 値Δ ' + pad(r.valueRelErr === null ? '—' : r.valueRelErr.toExponential(1), 9)
    + ' σΔ ' + pad(r.sigmaRelErr === null ? '—' : r.sigmaRelErr.toExponential(1), 9));
console.log('  CSV 全体の印(厳密読み) 前 → 後');
console.log('     太陽系   verified ' + BEFORE.solar.verified + ' → ' + after.solar.verified
  + ' / X7 警告 ' + BEFORE.solar.x7Warn + ' → ' + after.solar.x7Warn
  + ' / confirmation_round=3 ' + after.solar.round3 + ' / same_mark_as ' + after.solar.sameMarkAs);
console.log('     星団/銀河 verified ' + BEFORE.cluster.verified + ' → ' + after.cluster.verified
  + '(SPARC 10 点は**外部照合だけ** —— verified にしない)');
console.log('  旧 DOI: url 欄 ' + oldDoiInUrl + ' 件 / note の previous_url ' + oldDoiInNote + ' 件');
console.log('  門: **動かしていない** —— ' + (gate.calaudit && gate.calaudit.byStatus
  ? JSON.stringify(gate.calaudit.byStatus) : '(calaudit JSON なし)')
  + ' / 4 値 ' + (gate.solarsigma ? JSON.stringify(gate.solarsigma.fourTally) : '—'));
if (bad.length) console.log('  **違反 ' + bad.length + ' 件**: ' + bad.slice(0, 8).join(' , '));
console.log('→ ' + path.relative(ROOT, OUT));
