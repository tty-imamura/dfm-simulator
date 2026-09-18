// 第266便a(第57報 追加・W1): **観測レコード(2026-09-16 intake B)の照合と転写の会計器**。
//
// 第57報の追加は「観測レコードの回答を添付した」である。原仮定者が提供したのは
//   ・**確認記録(2026-09-16)** …… 既存の転写行に対する「一次資料の表・列と桁」の回答(行番号つき)
//   ・**観測レコード(2026-09-16 intake B)** …… 取得の回答で、**2 系統**ある
// の 2 種類である。本器はその突き合わせの結果を、**正本の CSV の側から**数え直す。
//
// ■ 本器がしないこと(**測定値も観測値も 1 つも作らない**)
//   ・エンジンを 1 步も走らせない(`beta/index.html` にも `S._core` にも 1 バイトも触らない)。
//   ・σ を作らない。**印を上げるのは原仮定者の照合だけ**である —— 本便の確認記録は
//     **原仮定者本人**の確認と判明したので、一致した行は X7 の規約どおり `sigma_primary=verified` に
//     上がっている(`verified_by=原仮定者 2026-09-16; verified_at=…; verified_value=…`)。
//     **器が上げたのではない**。外部確認印(`value_checked_by=`)は依然として印を 1 bit も上げない。
//   ・門(`tests/exp-w249b-calaudit.mjs`)の行選択を差し替えない。
//   ・星団・銀河・LFBOT を門へ繋がない(`paper/data/transient-observations.csv` は**記録**である)。
//
// ■ 何を数えるか
//   ① **確認記録の 4 分類**(宣言表 `CONFIRM`)。「一致 / 不一致 / 未確認 / 別資料を見ていた」。
//      「一致」の行は `sigma_primary=verified` へ上がり X7 の 3 欄が付いている —— その実体を数える。
//      1σ が確認できなかった行・sigma 列が伝播値の行は **unverified のまま**であることも数える。
//   ② **取得回答 2 系統の 3 分類**(`collate=` を CSV から読み直す)。「一致(値・出典)/ 片方のみ / 食い違い」。
//   ③ **訂正 3 件**(換算 2 件・出典ラベル 1 件)の前後の値。
//   ④ **転写の内訳**(3 つの CSV の行数・σ つき・値が空・候補行)。
//
// ■ **書かないこと**
//   「verified にした」「太陽系の σ が揃った」「BH 連星・星団・銀河を較正した/門に入れた」
//   「LFBOT を観測一致させた」「現実較正を完了した」。
//   **4 値は 1 本も動いていない**。verified になった σ の宛先は近点移動 4 件だけで、そこは
//   obsCard が deg/orbit・CSV が deg/yr という**単位の不一致**で止まっている(第266便a で実測した
//   `tests/exp-w262d-solarsigma.mjs` の切断点 `unit-not-converted`)。
//
// 実行: node tests/exp-w266a-intakeB.mjs
// 出力: tests/out/intakeB-w266a.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readSigmaMark, readValueChecked, readSigmaKind, readVerifiedBy } from './lib-w264d-sigmamark.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'tests', 'out', 'intakeB-w266a.json');
const INTAKE = '2026-09-16';

// 第270便b(第60報 W2・AE2): **列位置でなくヘッダ名で読む**(`record_id` の列追加で壊れない)。
import { parseCsvLine, headerIndex } from './lib-w270b-obscsv.mjs';
function loadCsv(rel) {
  const rows = [];
  const lines = fs.readFileSync(path.join(ROOT, rel), 'utf8').split('\n');
  const H = headerIndex(lines[0] || '');
  if (H.missing.length) throw new Error('[w266a] ' + rel + ' に必須列が無い: ' + H.missing.join(','));
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
      value: cell(c, 'value'), unit: cell(c, 'unit'), source: cell(c, 'source'),
      url: cell(c, 'url'), retrieved: cell(c, 'retrieved'), note: cell(c, 'note') || '',
      recordId: String(cell(c, 'record_id')).trim() || null,
      sigma: (Number.isFinite(sg) && sg !== 0) ? sg : null,
      hasValue: String(cell(c, 'value')).trim() !== '' });
  }
  return rows;
}
const SOLAR = loadCsv('paper/data/solar-observations.csv');
const CLUSTER = loadCsv('paper/data/cluster-galaxy-observations.csv');
const TRANSIENT = loadCsv('paper/data/transient-observations.csv');
const ALL = [...SOLAR, ...CLUSTER, ...TRANSIENT];

const tag = (note, key) => {
  const m = new RegExp('(?:^|[^A-Za-z0-9_])' + key + '=([^;]*)').exec(note || '');
  return m ? m[1].trim() : null;
};
const has = (note, key) => new RegExp('(?:^|[^A-Za-z0-9_])' + key + '=').test(note || '');
const isIntakeB = (r) => new RegExp('intake_row=' + INTAKE).test(r.note);

// ================================================================ ① 確認記録の 4 分類
// **宣言表**。`ln` は本便の時点での `paper/data/solar-observations.csv` の行番号で、
// 確認記録が付けてきた行番号と同じものである。`klass` は 4 分類の宣言(推測ではない):
//   agree        … 確認記録の表・列・桁が、その行の note の `orig …` と一致した
//   disagree     … 一致しなかった(**本便では 0 件**)
//   unchecked    … 確認記録が「Not Found / Unconfirmed」と答えた
//   other-source … 確認記録が**別の資料**(発見論文)を見ていた
// `act` は本便でその行に何をしたかの宣言:
//   verified   … `sigma_primary=verified` へ上げ、X7 の `verified_by=原仮定者 2026-09-16` を書いた
//   value-only … 値だけ確認できて 1σ は確認できないので**印は unverified のまま**
//   covariance … sigma 列が視差との**伝播値**なので印字 1σ ではない → unverified のまま・書式を直した
//   note-only  … `value_check_note=` だけ(印は unverified のまま)
const CONFIRM = [
  [181, 'Alpha Centauri AB', 'orbital_period', 'agree', 'verified', 'Table 8 Period (yr) Present work column', '79.762 +/- 0.019 yr'],
  [182, 'Alpha Centauri AB', 'eccentricity', 'agree', 'verified', 'Table 8 Eccentricity Present work column', '0.51947 +/- 0.00015'],
  [183, 'Alpha Centauri AB', 'semi_major_axis', 'agree', 'covariance', 'Table 8 Semimajor axis (arcsec) and Parallax (mas) Present work column', '17.4930 +/- 0.0096 arcsec and parallax 750.81 +/- 0.38 mas'],
  [194, 'Sirius AB', 'orbital_period', 'agree', 'verified', 'Table 4 Orbital period P (year)', '50.1284 +/- 0.0043 yr'],
  [195, 'Sirius AB', 'eccentricity', 'agree', 'verified', 'Table 4 Eccentricity e', '0.59142 +/- 0.00037'],
  [196, 'Sirius AB', 'semi_major_axis', 'agree', 'covariance', 'Table 4 Semimajor axis a (arcsec) and Table 5 weighted-mean parallax', '7.4957 +/- 0.0025 arcsec and parallax 0.3789 +/- 0.0014 arcsec'],
  [207, 'PSR J0737-3039 B', 'orbital_period', 'agree', 'verified', 'Table IV Orbital period (day)', '0.102 251 559 297 3(10) d'],
  [210, 'PSR J0737-3039 B', 'eccentricity', 'agree', 'verified', 'Table IV Eccentricity (Kepler equation)', '0.087 777 023(61)'],
  [211, 'PSR J0737-3039 B', 'periastron_advance', 'agree', 'verified', 'Table IV Periastron advance (deg/yr)', '16.899 323(13)'],
  [239, 'PSR B1534+12', 'periastron_advance', 'agree', 'verified', 'Table 3 Rate of periastron advance DD Model column', '1.7557950(19) deg/yr'],
  [247, 'PSR B1534+12', 'orbital_period', 'agree', 'verified', 'Table 3 Orbital period Pb DDGR Model column', '0.420737298881(2) d'],
  [249, 'PSR B1534+12', 'eccentricity', 'agree', 'verified', 'Table 3 Eccentricity e DDGR Model column', '0.27367740(4)'],
  [273, 'PSR J1757-1854', 'orbital_period', 'agree', 'verified', 'Table 2 Orbital period Pb (d)', '0.183537823671(2) d'],
  [275, 'PSR J1757-1854', 'eccentricity', 'agree', 'verified', 'Table 2 Eccentricity e', '0.605817(2)'],
  [276, 'PSR J1757-1854', 'periastron_advance', 'agree', 'verified', 'Table 2 Periastron advance (deg/yr)', '10.364986(8)'],
  [285, 'PSR J1946+2052', 'orbital_period', 'other-source', 'note-only', 'the discovery paper Table 1 (Stovall 2018) not Meng 2025 Table 1', '0.07848804(1) d'],
  [289, 'PSR J1946+2052', 'eccentricity', 'other-source', 'note-only', 'the discovery paper Table 1 (Stovall 2018) not Meng 2025 Table 1', '0.063848(9)'],
  [290, 'PSR J1946+2052', 'periastron_advance', 'other-source', 'note-only', 'the discovery paper Table 1 (Stovall 2018) not Meng 2025 Table 1', '25.6(3) deg/yr'],
  [363, 'Moon', 'general_precession', 'agree', 'verified', 'IERS EOP-PC Earth rotation constants General precession in longitude row', '5028.792(2) arcsec per century'],
  [368, 'Mercury', 'periastron_advance', 'agree', 'verified', 'Table 3 Total row', '575.3100 +/- 0.0015 arcsec per Julian century'],
  [370, 'Mercury', 'periastron_advance_gr', 'agree', 'verified', 'Table 3 Gravitoelectric (Schwarzschild-like) row', '42.9799 +/- 0.0009 arcsec per Julian century'],
  [371, 'Mercury', 'periastron_advance_j2', 'agree', 'verified', 'Table 3 Solar Oblateness row', '0.0286 +/- 0.0011 arcsec per Julian century'],
  [420, 'Titan ringlet', 'semi_major_axis', 'agree', 'value-only', 'abstract Titan (Colombo) ringlet semimajor-axis statement', 'a = 77878.7 km (the quoted abstract prints no 1-sigma)'],
  // 第268便b: 行 421 の quantity は `mean_motion` → `pattern_speed_m1` へ改名した(強制 m=1 のパターン速度
  // であって粒子の公転平均運動ではない。値・σ・出典・印は 1 バイトも動いていない)。
  [421, 'Titan ringlet', 'pattern_speed_m1', 'unchecked', 'note-only', 'Not Found', 'Unconfirmed'],
  [426, 'Saturn ring feature D68', 'radial_amplitude_ae', 'agree', 'verified', 'abstract a*e statement for the D68 ringlet', 'ae=25 +/- 1 km'],
  [428, 'Saturn ring feature D68', 'periastron_advance', 'agree', 'verified', 'abstract pericenter-precession statement for the D68 ringlet', '38.243 +/- 0.008 deg/day'],
  [444, 'Charon', 'orbital_period_candidate', 'agree', 'verified', 'Table 5 P (days) two-body orbit fit to Charon astrometry', '6.3872273(3) d'],
  [445, 'Charon', 'orbital_period_candidate', 'agree', 'verified', 'arXiv astro-ph/0512491v2 Table 3 Period (days) Charon column', '6.3872304(11) d'],
];
// 確認記録に行番号は付いていないが、**同じ理由**(a は視差との伝播値)で unverified のままにした行。
const PROPAGATED = [
  [106, 'Alpha Centauri B', 'semi_major_axis'],
  [113, 'Sirius B', 'semi_major_axis'],
];
const CONFIRM_CLASSES = ['agree', 'disagree', 'unchecked', 'other-source'];
const CONFIRM_ACTS = ['verified', 'value-only', 'covariance', 'note-only'];
const confirmRows = [];
const confirmTally = {}, actTally = {};
for (const k of CONFIRM_CLASSES) confirmTally[k] = 0;
for (const k of CONFIRM_ACTS) actTally[k] = 0;
const confirmBad = [];
for (const [ln, body, quantity, klass, act, at, value] of CONFIRM) {
  confirmTally[klass]++;
  actTally[act]++;
  const row = SOLAR.find((r) => r.ln === ln) || null;
  const mk = row ? readSigmaMark(row.note) : { mark: null, verified: false };
  const vb = row ? readVerifiedBy(row.note) : { present: false, who: '', at: null, value: null };
  const vc = row ? readValueChecked(row.note) : { present: false, who: '' };
  if (!(row && row.body === body && row.quantity === quantity))
    confirmBad.push('行 ' + ln + ' が ' + body + '|' + quantity + ' でない');
  if (act === 'verified') {
    if (!mk.verified) confirmBad.push('行 ' + ln + ' が verified になっていない');
    if (!vb.present) confirmBad.push('行 ' + ln + ' に verified_by= が無い(X7)');
    if (vb.present && vb.who.indexOf('原仮定者') < 0)
      confirmBad.push('行 ' + ln + ' の verified_by が原仮定者でない: ' + vb.who);
    if (!vb.at || !vb.value) confirmBad.push('行 ' + ln + ' の verified_at / verified_value が欠けている');
    if (row && row.sigma === null) confirmBad.push('行 ' + ln + ' に σ が無いのに verified になっている');
  } else {
    if (mk.verified) confirmBad.push('行 ' + ln + ' が verified になっている(上げない約束の行である)');
    if (act === 'note-only' && !has(row ? row.note : '', 'value_check_note'))
      confirmBad.push('行 ' + ln + ' に value_check_note= が無い');
    if (act === 'value-only' && !vc.present) confirmBad.push('行 ' + ln + ' に値の確認印が無い');
    if (act === 'covariance' && readSigmaKind(row ? row.note : '').kind !== 'covariance')
      confirmBad.push('行 ' + ln + ' の sigma_kind が covariance でない');
  }
  confirmRows.push({ ln, body, quantity, klass, act, at, value,
    markNow: mk.mark, sigma: row ? row.sigma : null,
    verifiedBy: vb.present ? vb.who : null, verifiedAt: vb.at, verifiedValue: vb.value,
    valueCheckedPresent: vc.present, valueCheckedBy: vc.who || null });
}
const propagated = PROPAGATED.map(([ln, body, quantity]) => {
  const row = SOLAR.find((r) => r.ln === ln) || null;
  const mk = row ? readSigmaMark(row.note) : { mark: null, verified: false };
  const kind = readSigmaKind(row ? row.note : '').kind;
  if (mk.verified) confirmBad.push('行 ' + ln + ' が verified になっている(伝播値の行である)');
  if (kind !== 'covariance') confirmBad.push('行 ' + ln + ' の sigma_kind が covariance でない');
  return { ln, body, quantity, markNow: mk.mark, sigmaKind: kind, sigma: row ? row.sigma : null };
});
// **外部確認印だけで verified になっている行は 1 つも無い**(Z11 —— 上がった行は verified_by つきである)
const externalOnlyVerified = SOLAR.filter((r) => {
  const vc = readValueChecked(r.note);
  return vc.present && readSigmaMark(r.note).verified && !readVerifiedBy(r.note).present;
}).map((r) => r.ln);
if (externalOnlyVerified.length)
  confirmBad.push('外部確認印だけで verified になっている行: ' + externalOnlyVerified.join(','));
// CSV 全体の印の数(本便の前後で比べる)
const markCensus = SOLAR.reduce((m, r) => { const k = readSigmaMark(r.note).mark || '(印なし)';
  m[k] = (m[k] || 0) + 1; return m; }, {});
const verifiedRows = SOLAR.filter((r) => readSigmaMark(r.note).verified)
  .map((r) => ({ ln: r.ln, body: r.body, quantity: r.quantity, sigma: r.sigma,
    verifiedBy: readVerifiedBy(r.note).who || null }));

// ================================================================ ② 取得回答 2 系統の 3 分類
// 3 分類への畳み込みは**宣言**である(第264便d の `THREE` を引き継ぎ、本便で 1 語だけ足した)。
const THREE = { agree: '一致(値・出典)', 'agree-rounding': '一致(値・出典)',
  'agree-multi': '一致(値・出典)', 'agree-both-empty': '一致(値・出典)',
  partial: '食い違い', conflict: '食い違い', 'conflict-one-empty': '食い違い',
  // 本便で足した 1 語(**宣言**): 値は一致するが**引いている一次資料が違う**
  'conflict-source': '食い違い',
  'only-1': '片方のみ', 'only-2': '片方のみ' };
const collateKeys = new Map();
for (const r of ALL) {
  if (!isIntakeB(r)) continue;
  const cls = tag(r.note, 'collate');
  if (!cls) continue;
  const key = tag(r.note, 'candidate_for') || (r.body + '|' + r.quantity);
  const e = collateKeys.get(key) || { key, file: r.file, body: r.body, cls, rows: 0,
    streams: new Set(), values: [], sigmaRows: 0 };
  e.rows++;
  if (r.sigma !== null) e.sigmaRows++;
  const st = tag(r.note, 'record_stream');
  if (st) for (const s of st.split('+')) e.streams.add(s.trim());
  e.values.push(r.value);
  // 同じ鍵に複数の分類が来たら「食い違い」を優先して残す(宣言)
  if (THREE[cls] === '食い違い') e.cls = cls;
  collateKeys.set(key, e);
}
const collate = [...collateKeys.values()].map((e) => ({ key: e.key, file: e.file, body: e.body,
  cls: e.cls, three: THREE[e.cls] || '?', rows: e.rows, sigmaRows: e.sigmaRows,
  streams: [...e.streams].sort(), values: e.values }));
const collateTally = {}, threeTally = { '一致(値・出典)': 0, 片方のみ: 0, 食い違い: 0 };
for (const c of collate) {
  collateTally[c.cls] = (collateTally[c.cls] || 0) + 1;
  threeTally[c.three] = (threeTally[c.three] || 0) + 1;
}
const collateByFile = {};
for (const c of collate) {
  collateByFile[c.file] = collateByFile[c.file] || {};
  collateByFile[c.file][c.three] = (collateByFile[c.file][c.three] || 0) + 1;
}

// ================================================================ ③ 訂正 3 件
// **宣言表**: [行, 天体, 量, 旧値, 新値, 印の鍵, 何の訂正か]
const CORRECTIONS = [
  [383, 'Mars', 'orbital_period', '59354294.4', '59355048.80447', 'corrected',
    '換算(転写者が 686.970977 d と書いたが、同じ note の式 P=360*36525/L_dot は 686.979732 d を与える。差 -754.4 s・2 系統が指摘)'],
  [365, 'Mercury', 'orbital_period', '7600543.72', '7600543.75658', 'corrected',
    '丸め(P を 87.9692565 d に丸めてから換算していた。差 -0.037 s・2 系統が指摘)'],
  [145, 'PSR J1946+2052', 'orbital_period', 'Meng et al. (2025) A&A 704 A153', 'Stovall et al. (2018) ApJL 854 L22 Table 1', 'source_corrected',
    '出典ラベル(値 Pb=0.07848804(1) d・e=0.063848(9) は発見論文 Stovall 2018 Table 1 のもので、Meng 2025 Table 1 の値ではない。第249便a の「同じ論文の 2 転写が食い違う」注記はこれで解ける)'],
];
const corrections = CORRECTIONS.map(([ln, body, quantity, before, after, key, why]) => {
  const r = SOLAR.find((z) => z.ln === ln) || null;
  const now = key === 'corrected' ? (r ? r.value : null) : (r ? r.source : null);
  return { ln, body, quantity, before, after, key, why,
    inCsvNow: now, applied: !!(r && has(r.note, key) && String(now).indexOf(after) >= 0),
    previousValueInNote: r ? tag(r.note, 'previous_value') : null,
    markNow: r ? readSigmaMark(r.note).mark : null,
    sigmaNow: r ? r.sigma : null };
});
// 146 行(同じ出典ラベル訂正の 2 行目)も数える
{
  const r = SOLAR.find((z) => z.ln === 146);
  corrections.push({ ln: 146, body: 'PSR J1946+2052', quantity: 'eccentricity',
    before: 'Meng et al. (2025) A&A 704 A153', after: 'Stovall et al. (2018) ApJL 854 L22 Table 1',
    key: 'source_corrected', why: '同上(e=0.063848(9))',
    inCsvNow: r ? r.source : null,
    applied: !!(r && has(r.note, 'source_corrected') && r.source.indexOf('Stovall') >= 0),
    previousValueInNote: null, markNow: r ? readSigmaMark(r.note).mark : null,
    sigmaNow: r ? r.sigma : null });
}
const correctionsBad = corrections.filter((c) => !c.applied).map((c) => c.ln + ' ' + c.key);

// ================================================================ ④ 転写の内訳
function census(rows, label) {
  const mine = rows.filter(isIntakeB);
  return { file: label, rowsTotal: rows.length, intakeB: mine.length,
    withSigma: mine.filter((r) => r.sigma !== null).length,
    emptyValue: mine.filter((r) => !r.hasValue).length,
    candidateRows: mine.filter((r) => /_candidate$/.test(r.quantity)).length,
    bodies: [...new Set(mine.map((r) => r.body))].sort(),
    marks: mine.reduce((m, r) => { const k = readSigmaMark(r.note).mark || '(印なし)';
      m[k] = (m[k] || 0) + 1; return m; }, {}),
    sigmaKinds: mine.reduce((m, r) => { const k = readSigmaKind(r.note).kind || '(なし)';
      m[k] = (m[k] || 0) + 1; return m; }, {}),
    verifiedByFilled: mine.filter((r) => readVerifiedBy(r.note).present).length };
}
const transcription = { solar: census(SOLAR, 'paper/data/solar-observations.csv'),
  cluster: census(CLUSTER, 'paper/data/cluster-galaxy-observations.csv'),
  transient: census(TRANSIENT, 'paper/data/transient-observations.csv') };

// 星団 CSV は本便で **sigma 列**を得た。既存 108 行は空のままであることを数える。
const clusterSigma = { header: fs.readFileSync(path.join(ROOT, 'paper/data/cluster-galaxy-observations.csv'),
  'utf8').split('\n')[0],
  rows: CLUSTER.length, legacyRows: CLUSTER.filter((r) => !isIntakeB(r)).length,
  legacyWithSigma: CLUSTER.filter((r) => !isIntakeB(r) && r.sigma !== null).length,
  intakeBWithSigma: CLUSTER.filter((r) => isIntakeB(r) && r.sigma !== null).length };
// LFBOT の記録 CSV は**門に繋がっていない**ことを数える(全行に `gate=not-connected`)。
const transientGate = { rows: TRANSIENT.length,
  notConnected: TRANSIENT.filter((r) => /(?:^|[^A-Za-z0-9_])gate=not-connected\b/.test(r.note)).length,
  bodies: [...new Set(TRANSIENT.map((r) => r.body))].sort(),
  inSolarCsv: TRANSIENT.filter((r) => SOLAR.some((s) => s.body === r.body)).length };

const bad = [...confirmBad, ...correctionsBad.map((s) => '訂正が入っていない: ' + s)];
if (clusterSigma.legacyWithSigma !== 0) bad.push('既存の星団行に σ が入っている');
if (transientGate.notConnected !== transientGate.rows) bad.push('LFBOT の記録行に gate=not-connected が無いものがある');
if (transientGate.inSolarCsv !== 0) bad.push('LFBOT の天体が判定側の CSV にも居る');

const out = { when: new Date().toISOString(), wave: '第266便a(第57報 追加・W1)',
  intake: { date: INTAKE, streams: 2,
    provenance: '原仮定者が提供した観測レコード(2026-09-16 intake B)と確認記録(2026-09-16)。'
      + '一次資料は各行の source/url にある。',
    rule: ['既存の行の値は**換算訂正 2 件と出典ラベル訂正 1 件を除いて** 1 バイトも置き換えない',
      '既存の鍵と同じ量は `<量>_candidate` の候補行で併置する',
      'sigma 列に入れるのは**一次資料に印字された対称 1σ** だけ(単位換算は可)',
      '`sigma_primary=unverified` のまま —— **外部確認印は印を 1 bit も上げない**(Z11)',
      '非対称区間・90% 区間・丸め幅は σ ではない(`sigma_kind=asymmetric|ci90|digits|none`)',
      '上限・下限は value を空にして `upper_limit=` / `lower_limit=` に置く',
      'プリセット・builder・本体 JSON は変えない(署名不変)'] },
  confirmRecord: { n: CONFIRM.length, classes: CONFIRM_CLASSES, tally: confirmTally,
    acts: CONFIRM_ACTS, actTally,
    promotedToVerified: actTally.verified,
    verifiedRowsInCsv: verifiedRows.length, markCensus, verifiedRows, propagated,
    externalOnlyVerified,
    note: '確認者は**原仮定者本人**である(統括の追加指示 2026-09-16)。したがって一致した行は '
      + 'X7 の規約どおり `sigma_primary=verified` へ上がっている。**器が上げたのではない**。'
      + '伝播値の a(視差との quadrature)と 1σ が確認できなかった行は unverified のままである。',
    rows: confirmRows },
  collate: { keys: collate.length, tally: collateTally, three: threeTally, byFile: collateByFile,
    vocabulary: THREE, rows: collate },
  corrections: { n: corrections.length, rows: corrections },
  transcription, clusterSigma, transientGate,
  gate: { touched: false,
    why: '本器は門の行選択にも σ の昇格にも触れていない。**4 値は 1 本も動いていない**。'
      + '星団・銀河・LFBOT は門に接続していない。' },
  violations: bad,
  doNotWrite: ['verified にした', '太陽系の σ が揃った', 'BH 連星・星団・銀河を較正した',
    'BH 連星・星団・銀河を門に入れた', 'LFBOT を観測一致させた', '現実較正を完了した'] };
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));

const pad = (s, n) => String(s) + ' '.repeat(Math.max(0, n - String(s).length));
console.log('[w266a] 観測レコード(2026-09-16 intake B)の照合と転写');
console.log('  ① 確認記録 ' + CONFIRM.length + ' 行 → ' + JSON.stringify(confirmTally)
  + ' / 本便の扱い ' + JSON.stringify(actTally));
console.log('     **原仮定者が確認した行 ' + actTally.verified + ' 行を verified にした**(X7 の 3 欄つき)。'
  + 'CSV 全体の印: ' + JSON.stringify(markCensus)
  + ' / 外部確認印だけで verified の行 ' + externalOnlyVerified.length + ' 件');
console.log('  ② 取得回答 2 系統: 鍵 ' + collate.length + ' 組 → ' + JSON.stringify(threeTally));
console.log('     内訳: ' + JSON.stringify(collateTally));
for (const f of Object.keys(collateByFile))
  console.log('     ' + pad(f, 46) + ' ' + JSON.stringify(collateByFile[f]));
console.log('  ③ 訂正 ' + corrections.length + ' 件:');
for (const c of corrections)
  console.log('     行 ' + pad(c.ln, 5) + pad(c.body + '|' + c.quantity, 36)
    + pad(c.before, 34) + ' → ' + c.after + (c.applied ? '' : '  **未適用**'));
console.log('  ④ 転写: 太陽系 ' + transcription.solar.intakeB + ' 行(σ つき '
  + transcription.solar.withSigma + ')/ 星団・銀河 ' + transcription.cluster.intakeB + ' 行(σ つき '
  + transcription.cluster.withSigma + ')/ 過渡天体 ' + transcription.transient.intakeB + ' 行(σ つき '
  + transcription.transient.withSigma + ')');
console.log('     星団 CSV: 既存 ' + clusterSigma.legacyRows + ' 行の sigma 列は空 '
  + (clusterSigma.legacyWithSigma === 0 ? '(確認)' : '**違反**')
  + ' / 過渡天体 CSV: gate=not-connected ' + transientGate.notConnected + '/' + transientGate.rows);
if (bad.length) console.log('  **違反 ' + bad.length + ' 件**: ' + bad.slice(0, 6).join(' , '));
console.log('→ ' + path.relative(ROOT, OUT));
