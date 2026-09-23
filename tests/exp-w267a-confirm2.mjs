// 第267便a(第57報 追加 3・4・W1): **確認記録(2026-09-17・第 2 回)の突き合わせ器**。
//
// 第57報の追加 3・4 の原文は「**観測レコードの訂正3件を追認する**」
// 「**回答の無い項目は、原記載を見付けられなかった**」である。原仮定者が提供したのは
// **確認記録(2026-09-17・第 2 回。確認日 2026-09-16)** —— 第266便a が出した確認依頼の 2 回目の回答 ——
// 1 本で、本器はその回答と正本の CSV の突き合わせを **3 分類**(一致 / 不一致 / 未回答)で数え直す。
//
// ■ 本器がしないこと(**測定値も観測値も 1 つも作らない**)
//   ・エンジンを 1 步も走らせない(`beta/index.html` にも `S._core` にも 1 バイトも触らない)。
//   ・σ を作らない・値を 1 バイトも書き換えない(**印と note だけ**)。
//     **印を上げるのは原仮定者の照合だけ**であり、器は「上がっているか」を数えるだけである。
//   ・門(`tests/exp-w249b-calaudit.mjs`)の行選択を差し替えない。
//   ・星団・銀河・LFBOT を門へ繋がない(**印が `verified` であることは門に繋がっていることではない**)。
//
// ■ 何を数えるか
//   ① **3 分類**(宣言表 `CONFIRM2` / `PENDING` / `NOT_FOUND`)。
//      「一致」= 確認記録が示した**表・列・原記載**から、その行の value と sigma が
//      **換算で再現できた**行(再現は本器が毎回やり直す —— 再現できない行は「不一致」に落ちる)。
//      「未回答」= 原仮定者が原記載を見付けられなかった行(印は 1 bit も動かさない)。
//   ② **CSV 全体の印**(厳密読み)の前後。
//   ③ **訂正 3 件の追認印**(行 383 火星 P・365 水星 P・145/146 J1946 出典ラベル)。
//   ④ **同じ表・同じ値だが明示の回答が無い行**(114/115・125)—— 印は付けず、注記だけ足した。
//
// ■ **書かないこと**
//   「太陽系の σ が揃った」「判定が増えた」「門に入れた」「現実較正を完了した」「Release した」。
//   **4 値は 1 本も動いていない**(`tests/exp-w262d-solarsigma.mjs` と
//   `tests/exp-w249b-calaudit.mjs --regate` の実測を JSON の `gate` 欄に持つ)。
//
// 実行: node tests/exp-w267a-confirm2.mjs
// 出力: tests/out/confirm2-w267a.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readSigmaMark, readVerifiedBy, readValueChecked } from './lib-w264d-sigmamark.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'tests', 'out', 'confirm2-w267a.json');
const SOLAR_F = 'paper/data/solar-observations.csv';
const CLUSTER_F = 'paper/data/cluster-galaxy-observations.csv';
const TRANSIENT_F = 'paper/data/transient-observations.csv';
// 確認者の日付は**確認記録が書いている確認日**である(提供は 2026-09-17・第 2 回)。
const VERIFIED_BY = '原仮定者 2026-09-16';
const ROUND_TAG = 'confirmation_round=2';
const ACK_TAG = 'acknowledged_by=原仮定者 2026-09-17';
const NOT_FOUND_TAG = 'confirmation_2=not-found-by-author';

// 第270便b(第60報 W2・AE2): **列位置でなくヘッダ名で読む**(`record_id` の列追加で壊れない)。
import { parseCsvLine, headerIndex } from './lib-w270b-obscsv.mjs';
function loadCsv(rel) {
  const rows = [];
  const lines = fs.readFileSync(path.join(ROOT, rel), 'utf8').split('\n');
  const H = headerIndex(lines[0] || '');
  if (H.missing.length) throw new Error('[w267a] ' + rel + ' に必須列が無い: ' + H.missing.join(','));
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
      unit: cell(c, 'unit'), source: cell(c, 'source'), note: cell(c, 'note') || '',
      recordId: String(cell(c, 'record_id')).trim() || null,
      sigma: Number.isFinite(sg) ? sg : null });
  }
  return rows;
}
const CSV = { [SOLAR_F]: loadCsv(SOLAR_F), [CLUSTER_F]: loadCsv(CLUSTER_F),
  [TRANSIENT_F]: loadCsv(TRANSIENT_F) };
const row = (file, ln) => CSV[file].find((r) => r.ln === ln) || null;
const has = (note, s) => String(note || '').indexOf(s) >= 0;

// ---------------------------------------------------------------- 換算定数(**その行の note に書いてある定数**)
const DAY = 86400;                       // 1 d = 86400 s
const JYR = 3.15576e7;                   // ユリウス年 365.25 d(単位の規約であって観測ではない)
const MSUN_CODATA14 = 1.3271244e20 / 6.67408e-11;   // IAU 2015 B3 の GM☉ と CODATA 2014 の G(行 201/203)
const MSUN_CODATA18 = 1.988409870698051e30;         // 同 GM☉ と CODATA 2018 の G(行 202/204)
const MSUN_CLUSTER = 1.98847e30;         // 星団 CSV が宣言している 1 M☉(行 110/118)
const PC = 3.08568e16;                   // 同 1 pc(行 116)

// ---------------------------------------------------------------- ① 一致(回答があり、換算で再現できた行)
// **宣言表**。`at` は確認記録が示した表・列、`orig` はその原記載、`value`/`sigma` は
// **この器がその原記載から毎回やり直す換算**である(CSV の数字を写していない)。
// `tol` は転写の丸め(有効数字)を許す相対差で、**行ごとの宣言**である。
const CONFIRM2 = [
  // --- 優先 A: Stovall 2018 Table 1 の確認を 145/146 に当てる(原仮定者の明示)
  { file: SOLAR_F, ln: 145, body: 'PSR J1946+2052', quantity: 'orbital_period',
    at: 'Stovall et al. 2018 ApJL 854 L22 Table 1 Orbital period Pb (days)',
    orig: 'Pb = 0.07848804(1) d', value: 0.07848804 * DAY, sigma: 1e-8 * DAY, tol: 1e-12,
    how: '0.07848804 d x 86400 s/d(σ は最終桁 1e-8 d を秒へ)' },
  { file: SOLAR_F, ln: 146, body: 'PSR J1946+2052', quantity: 'eccentricity',
    at: 'Stovall et al. 2018 ApJL 854 L22 Table 1 Orbital eccentricity e',
    orig: 'e = 0.063848(9)', value: 0.063848, sigma: 9e-6, tol: 1e-12,
    how: '無次元(σ は最終桁 (9) = 9e-6)' },
  // --- 優先 B(1): 第266便a で verified にした 181/182 と同じ表・同じ値(原仮定者の明示)
  { file: SOLAR_F, ln: 107, body: 'Alpha Centauri B', quantity: 'eccentricity',
    at: 'Akeson et al. 2021 AJ 162 14 Table 8 Eccentricity Present work column',
    orig: 'e = 0.51947 +/- 0.00015', value: 0.51947, sigma: 1.5e-4, tol: 1e-12,
    how: '無次元(行 182 と同じ表・同じ値)' },
  { file: SOLAR_F, ln: 108, body: 'Alpha Centauri B', quantity: 'orbital_period',
    at: 'Akeson et al. 2021 AJ 162 14 Table 8 Period (yr) Present work column',
    orig: 'P = 79.762 +/- 0.019 yr', value: 79.762 * JYR, sigma: 0.019 * JYR, tol: 5e-9,
    how: '79.762 yr x 3.15576e7 s/yr(行 181 は 2517097291.2 s・この行は 6 桁へ丸めた転写)' },
  // --- 優先 B(2): Hu et al. 2022 A&A 667 A149 Table 2(原仮定者の確認)
  { file: SOLAR_F, ln: 123, body: 'PSR J0737-3039 B', quantity: 'eccentricity',
    at: 'Hu et al. 2022 A&A 667 A149 Table 2 Eccentricity eT (DDS binary model)',
    orig: 'eT = 0.087 777 036(48)', value: 0.087777036, sigma: 4.8e-8, tol: 1e-12,
    how: '無次元。**eT は時間離心率**であって距離極値の eProxy ではない(第257便d の写像未解決は残る)' },
  { file: SOLAR_F, ln: 124, body: 'PSR J0737-3039 B', quantity: 'orbital_period',
    at: 'Hu et al. 2022 A&A 667 A149 Table 2 Orbital period Pb (days) (DDS binary model)',
    orig: 'Pb = 0.102 251 559 297 2(29) d', value: 0.1022515592972 * DAY, sigma: 2.9e-12 * DAY,
    tol: 1e-12, how: '0.1022515592972 d x 86400 s/d(σ は最終桁 2.9e-12 d を秒へ)' },
  { file: SOLAR_F, ln: 222, body: 'PSR J0737-3039 B', quantity: 'orbital_period',
    at: 'Hu et al. 2022 A&A 667 A149 Table 2 Orbital period Pb (days) (DDS binary model)',
    orig: 'Pb = 0.102 251 559 297 2(29) d', value: 0.1022515592972 * DAY, sigma: 2.9e-12 * DAY,
    tol: 1e-12, how: '同上(2026-09-14 intake の併置行 —— ビルダーへは渡らない)' },
  { file: SOLAR_F, ln: 224, body: 'PSR J0737-3039 B', quantity: 'eccentricity',
    at: 'Hu et al. 2022 A&A 667 A149 Table 2 Eccentricity eT (DDS binary model)',
    orig: 'eT = 0.087 777 036(48)', value: 0.087777036, sigma: 4.8e-8, tol: 1e-12,
    how: '同上(併置行)' },
  // --- 優先 C: B1913+16 / α Cen AB の角要素 / シリウス AB の角要素
  { file: SOLAR_F, ln: 153, body: 'PSR B1913+16', quantity: 'eccentricity',
    at: 'Weisberg & Huang 2016 ApJ 829 55 Table 2 Orbital Parameters e',
    orig: 'e = 0.6171340(4)', value: 0.6171340, sigma: 4e-7, tol: 1e-12,
    how: '無次元(σ は最終桁 (4) = 4e-7)' },
  { file: SOLAR_F, ln: 184, body: 'Alpha Centauri AB', quantity: 'inclination',
    at: 'Akeson et al. 2021 AJ 162 14 Table 8 Inclination (deg) Present work column',
    orig: 'i = 79.2430 +/- 0.0089 deg', value: 79.2430, sigma: 0.0089, tol: 1e-12, how: '換算なし' },
  { file: SOLAR_F, ln: 185, body: 'Alpha Centauri AB', quantity: 'longitude_of_periastron',
    at: 'Akeson et al. 2021 AJ 162 14 Table 8 Arg. of periastron (deg) Present work column',
    orig: 'omega = 231.519 +/- 0.027 deg', value: 231.519, sigma: 0.027, tol: 1e-12, how: '換算なし' },
  { file: SOLAR_F, ln: 197, body: 'Sirius AB', quantity: 'inclination',
    at: 'Bond et al. 2017 ApJ 840 70 Table 4 Inclination i (deg)',
    orig: 'i = 136.336 +/- 0.040 deg', value: 136.336, sigma: 0.040, tol: 1e-12, how: '換算なし' },
  { file: SOLAR_F, ln: 198, body: 'Sirius AB', quantity: 'longitude_of_periastron',
    at: 'Bond et al. 2017 ApJ 840 70 Table 4 Longitude of periastron omega (deg)',
    orig: 'omega = 149.161 +/- 0.075 deg', value: 149.161, sigma: 0.075, tol: 1e-12, how: '換算なし' },
  // --- 優先 C(質量): Bond 2017 Table 6 の This Paper 列(**半径と α Cen の質量は回答に無い**)
  { file: SOLAR_F, ln: 201, body: 'Sirius A', quantity: 'mass_candidate',
    at: 'Bond et al. 2017 ApJ 840 70 Table 6 Mass of Sirius A MA (This Paper column)',
    orig: 'MA = 2.063 +/- 0.023 M_sun', value: 2.063 * MSUN_CODATA14, sigma: 0.023 * MSUN_CODATA14,
    tol: 1e-12, how: 'M☉ = GM☉/G = 1.3271244e20 / 6.67408e-11(その行の note の定数)' },
  { file: SOLAR_F, ln: 202, body: 'Sirius A', quantity: 'mass_candidate',
    at: 'Bond et al. 2017 ApJ 840 70 Table 6 Mass of Sirius A MA (This Paper column)',
    orig: 'MA = 2.063 +/- 0.023 M_sun', value: 2.063 * MSUN_CODATA18, sigma: 0.023 * MSUN_CODATA18,
    tol: 1e-12, how: 'M☉ = 1.988409870698051e30 kg(CODATA 2018 の G —— その行の note の定数)' },
  { file: SOLAR_F, ln: 203, body: 'Sirius B', quantity: 'mass_candidate',
    at: 'Bond et al. 2017 ApJ 840 70 Table 6 Mass of Sirius B MB (This Paper column)',
    orig: 'MB = 1.018 +/- 0.011 M_sun', value: 1.018 * MSUN_CODATA14, sigma: 0.011 * MSUN_CODATA14,
    tol: 1e-12, how: '同上(CODATA 2014)' },
  { file: SOLAR_F, ln: 204, body: 'Sirius B', quantity: 'mass_candidate',
    at: 'Bond et al. 2017 ApJ 840 70 Table 6 Mass of Sirius B MB (This Paper column)',
    orig: 'MB = 1.018 +/- 0.011 M_sun', value: 1.018 * MSUN_CODATA18, sigma: 0.011 * MSUN_CODATA18,
    tol: 1e-12, how: '同上(CODATA 2018)' },
  // --- 優先 D: 47 Tuc(**星団 CSV・門には繋がっていない**)
  { file: CLUSTER_F, ln: 110, body: '47 Tuc', quantity: 'total_mass_candidate',
    at: 'Baumgardt Galactic Globular Cluster Database v4 parameter table NGC 104 row Mass [Msun] column',
    orig: 'M = 8.53 +/- 0.05 e5 M_sun', value: 8.53e5 * MSUN_CLUSTER, sigma: 0.05e5 * MSUN_CLUSTER,
    tol: 1e-5, how: '8.53e5 M☉ x 1.98847e30 kg/M☉(その行の note の定数・CSV は 6 桁へ丸めた転写)' },
  { file: CLUSTER_F, ln: 115, body: '47 Tuc', quantity: 'rotation_amplitude_candidate',
    at: 'Baumgardt GGCD v4 parameter table NGC 104 row ARot [km/sec] column',
    orig: 'ARot = 5.00 +/- 0.32 km/s', value: 5.00e3, sigma: 0.32e3, tol: 1e-12,
    how: '1 km/s = 1000 m/s' },
  { file: CLUSTER_F, ln: 116, body: '47 Tuc', quantity: 'distance_candidate',
    at: 'Baumgardt GGCD v4 parameter table NGC 104 row R_sun [kpc] column',
    orig: 'R_sun = 4.52 +/- 0.03 kpc', value: 4.52e3 * PC, sigma: 0.03e3 * PC, tol: 1e-5,
    how: '4.52 kpc = 4520 pc x 3.08568e16 m/pc(CSV は 6 桁へ丸めた転写)' },
  { file: CLUSTER_F, ln: 117, body: '47 Tuc', quantity: 'mass_to_light_V_candidate',
    at: 'Baumgardt GGCD v4 parameter table NGC 104 row M/LV [Msun/Lsun] column',
    orig: 'M/L_V = 1.87 +/- 0.09', value: 1.87, sigma: 0.09, tol: 1e-12, how: '換算なし' },
  { file: CLUSTER_F, ln: 118, body: '47 Tuc', quantity: 'total_mass_candidate',
    at: 'Baumgardt & Hilker 2018 MNRAS 478 1520 Table 2 NGC 104 row Mass [Msun] column',
    orig: 'M = 7.79 +/- 0.05 e5 M_sun', value: 7.79e5 * MSUN_CLUSTER, sigma: 0.05e5 * MSUN_CLUSTER,
    tol: 1e-5, how: '7.79e5 M☉ x 1.98847e30 kg/M☉(別の解 —— v4 カタログ行とは混ぜない)' },
  { file: CLUSTER_F, ln: 123, body: '47 Tuc', quantity: 'mass_to_light_V_candidate',
    at: 'Baumgardt & Hilker 2018 MNRAS 478 1520 Table 2 NGC 104 row M/LV column',
    orig: 'M/L_V = 1.77 +/- 0.16', value: 1.77, sigma: 0.16, tol: 1e-12, how: '換算なし' },
];

// ---------------------------------------------------------------- ④ 明示の回答が無い「同じ表」の行
// **印は 1 bit も動かさない。** 注記(`same_table_as_verified_row=`)だけを足した(**決断事項**)。
const PENDING = [
  { file: SOLAR_F, ln: 114, body: 'Sirius B', quantity: 'eccentricity', sameAs: '195',
    why: 'Bond 2017 Table 4 の e —— 194/195 と同じ表・同じ値だが、確認記録に明示が無い' },
  { file: SOLAR_F, ln: 115, body: 'Sirius B', quantity: 'orbital_period', sameAs: '194',
    why: 'Bond 2017 Table 4 の P —— 同上' },
  { file: SOLAR_F, ln: 125, body: 'PSR J0737-3039 B', quantity: 'periastron_advance', sameAs: '211',
    why: 'Kramer 2021 Table IV の ω̇ —— 211 と同じ表・同じ値だが、確認記録に明示が無い' },
];

// ---------------------------------------------------------------- ② 未回答(原仮定者が原記載を見付けられなかった)
// 第57報 追加 4 の原文「**回答の無い項目は、原記載を見付けられなかった**」。
// **印は 1 bit も動かさない**(`confirmation_2=not-found-by-author` を足すだけ)。
const NOT_FOUND = [
  [SOLAR_F, 285, 'PSR J1946+2052', 'orbital_period', 'Meng 2025 Table 1 DDFWHE'],
  [SOLAR_F, 289, 'PSR J1946+2052', 'eccentricity', 'Meng 2025 Table 1 DDFWHE'],
  [SOLAR_F, 290, 'PSR J1946+2052', 'periastron_advance', 'Meng 2025 Table 1 DDFWHE'],
  [SOLAR_F, 300, 'PSR J1946+2052', 'orbital_period', 'Meng 2025 Table 1 DDGR'],
  [SOLAR_F, 302, 'PSR J1946+2052', 'eccentricity', 'Meng 2025 Table 1 DDGR'],
  [SOLAR_F, 148, 'PSR J1946+2052', 'periastron_advance', 'Meng 2025(ω̇ の原記載)'],
  [SOLAR_F, 180, 'PSR J1946+2052', 'periastron_advance', 'Meng 2025(併置行)'],
  [SOLAR_F, 136, 'PSR J1757-1854', 'orbital_period', 'Cameron 2018 Table 2'],
  [SOLAR_F, 137, 'PSR J1757-1854', 'eccentricity', 'Cameron 2018 Table 2'],
  [SOLAR_F, 139, 'PSR J1757-1854', 'periastron_advance', 'Cameron 2018 Table 2'],
  [SOLAR_F, 260, 'PSR J1757-1854', 'orbital_period', 'Cameron 2018 Table 2(併置行)'],
  [SOLAR_F, 262, 'PSR J1757-1854', 'eccentricity', 'Cameron 2018 Table 2(併置行)'],
  [SOLAR_F, 263, 'PSR J1757-1854', 'periastron_advance', 'Cameron 2018 Table 2(併置行)'],
  [SOLAR_F, 171, 'PSR B1534+12', 'orbital_period', 'Stairs 2002 Table 1'],
  [SOLAR_F, 172, 'PSR B1534+12', 'eccentricity', 'Stairs 2002 Table 1'],
  [SOLAR_F, 173, 'PSR B1534+12', 'periastron_advance', 'Stairs 2002 Table 1'],
  [SOLAR_F, 225, 'PSR J0737-3039 B', 'periastron_advance', 'Hu 2022 Table 2 の ω̇'],
  [SOLAR_F, 188, 'Alpha Centauri A', 'mass_candidate', 'Akeson 2021 の質量'],
  [SOLAR_F, 189, 'Alpha Centauri A', 'mass_candidate', 'Akeson 2021 の質量(別換算)'],
  [SOLAR_F, 190, 'Alpha Centauri B', 'mass_candidate', 'Akeson 2021 の質量'],
  [SOLAR_F, 191, 'Alpha Centauri B', 'mass_candidate', 'Akeson 2021 の質量(別換算)'],
  [SOLAR_F, 192, 'Alpha Centauri A', 'radius_candidate', 'α Cen A の半径'],
  [SOLAR_F, 193, 'Alpha Centauri B', 'radius_candidate', 'α Cen B の半径'],
  [SOLAR_F, 205, 'Sirius A', 'radius_candidate', 'シリウス A の半径'],
  [SOLAR_F, 206, 'Sirius B', 'radius_candidate', 'シリウス B の半径'],
  [SOLAR_F, 420, 'Titan ringlet', 'semi_major_axis', 'タイタン・リングレット a の 1σ'],
  // 第268便b: quantity を `pattern_speed_m1` へ改名(強制 m=1 のパターン速度・値と印は不変)
  [SOLAR_F, 421, 'Titan ringlet', 'pattern_speed_m1', 'タイタン・リングレット n(強制 m=1 のパターン速度)'],
  [CLUSTER_F, 138, 'NGC 3198', 'v_rot(r=0.32 kpc)_candidate', 'SPARC v(r) の原記載'],
  [CLUSTER_F, 139, 'NGC 3198', 'v_rot(r=0.64 kpc)_candidate', 'SPARC v(r) の原記載'],
  [CLUSTER_F, 140, 'NGC 3198', 'v_rot(r=8.04 kpc)_candidate', 'SPARC v(r) の原記載'],
  [CLUSTER_F, 141, 'NGC 3198', 'v_rot(r=12.05 kpc)_candidate', 'SPARC v(r) の原記載'],
  [CLUSTER_F, 142, 'NGC 3198', 'v_rot(r=18.13 kpc)_candidate', 'SPARC v(r) の原記載'],
  [CLUSTER_F, 143, 'NGC 3198', 'v_rot(r=24.03 kpc)_candidate', 'SPARC v(r) の原記載'],
  [CLUSTER_F, 144, 'NGC 3198', 'v_rot(r=32.14 kpc)_candidate', 'SPARC v(r) の原記載'],
  [CLUSTER_F, 145, 'NGC 3198', 'v_rot(r=38.19 kpc)_candidate', 'SPARC v(r) の原記載'],
  [CLUSTER_F, 146, 'NGC 3198', 'v_rot(r=42.17 kpc)_candidate', 'SPARC v(r) の原記載'],
  [CLUSTER_F, 147, 'NGC 3198', 'v_rot(r=44.08 kpc)_candidate', 'SPARC v(r) の原記載'],
  [CLUSTER_F, 150, 'NGC 3198', 'distance_candidate', 'SPARC の距離'],
  [TRANSIENT_F, 12, 'AT2018cow', 'blackbody_temperature(t=4.1 d)', 'Prentice 2018 の T'],
  [TRANSIENT_F, 19, 'AT2018cow', 'qpo_frequency', 'QPO 224.4 +/- 1.0 Hz'],
  [TRANSIENT_F, 26, 'AT2022tsd', 'redshift', 'z = 0.2564 +/- 0.0003'],
];
// 行を持たない質問(確認依頼の AB3 / AB4)——**行が無いので印も注記も無い**。記録だけ残す。
const NOT_FOUND_QUESTIONS = [
  ['AB3', '恒星連星 2 系の質量・半径の一次資料(Table 6 は質量だけが回答にあった)'],
  ['AB4', 'NGC 3198 の v(r) と距離の一次資料(SPARC 公式表の原記載)'],
];

// ---------------------------------------------------------------- ③ 訂正 3 件の追認(第57報 追加 3)
// 原文「**観測レコードの訂正3件を追認する**」。**値は 1 バイトも動かさない**(追認の印だけ)。
const ACK = [
  [SOLAR_F, 383, 'Mars', 'orbital_period', '換算の訂正(59354294.4 → 59355048.80447 s)'],
  [SOLAR_F, 365, 'Mercury', 'orbital_period', '丸めの訂正(7600543.72 → 7600543.75658 s)'],
  [SOLAR_F, 145, 'PSR J1946+2052', 'orbital_period', '出典ラベルの訂正(Meng 2025 → Stovall 2018 Table 1)'],
  [SOLAR_F, 146, 'PSR J1946+2052', 'eccentricity', '出典ラベルの訂正(同上)'],
];

// ---------------------------------------------------------------- 基点(main 4d1571a)の実測値
// **本便の前**に同じ読み方で数えた値である(前後の比較に使う。宣言であって推測ではない)。
const BEFORE = { solar: { rows: 521, verified: 37, verifiedBy: 21, verifiedWithoutBy: 16 },
  cluster: { rows: 154, verified: 0, verifiedBy: 0, verifiedWithoutBy: 0 },
  transient: { rows: 27, verified: 0, verifiedBy: 0, verifiedWithoutBy: 0 } };

// ================================================================ 突き合わせ
const bad = [];
const rel = (a, b) => (b === 0 ? (a === 0 ? 0 : Infinity) : Math.abs(a / b - 1));
const confirmRows = [];
let agree = 0, disagree = 0;
for (const d of CONFIRM2) {
  const r = row(d.file, d.ln);
  const out = { file: d.file, ln: d.ln, body: d.body, quantity: d.quantity, at: d.at, orig: d.orig,
    how: d.how, tol: d.tol, recomputedValue: d.value, recomputedSigma: d.sigma,
    csvValue: r ? r.value : null, csvSigma: r ? r.sigma : null,
    valueRelErr: null, sigmaRelErr: null, reproduced: false,
    mark: null, verifiedBy: null, verifiedAt: null, verifiedValue: null, round2: false };
  if (!r) { bad.push(`行 ${d.ln}(${d.file})が無い`); out.klass = '不一致'; disagree++;
    confirmRows.push(out); continue; }
  if (r.body !== d.body || r.quantity !== d.quantity) {
    bad.push(`行 ${d.ln} が ${d.body}|${d.quantity} でない(${r.body}|${r.quantity})`);
  }
  out.valueRelErr = rel(d.value, r.value);
  out.sigmaRelErr = (r.sigma === null) ? null : rel(d.sigma, r.sigma);
  out.reproduced = (out.valueRelErr <= d.tol) && (out.sigmaRelErr !== null && out.sigmaRelErr <= d.tol);
  const mk = readSigmaMark(r.note), vb = readVerifiedBy(r.note);
  out.mark = mk.mark; out.verifiedBy = vb.present ? vb.who : null;
  out.verifiedAt = vb.at; out.verifiedValue = vb.value; out.round2 = has(r.note, ROUND_TAG);
  out.klass = out.reproduced ? '一致' : '不一致';
  if (out.reproduced) agree++; else { disagree++;
    bad.push(`行 ${d.ln} は原記載から再現できない(値 ${out.valueRelErr} / σ ${out.sigmaRelErr})`); }
  // **再現できた行だけ** verified になっていてよい(再現できない行に印が付いていたら違反)
  if (out.reproduced) {
    if (!mk.verified) bad.push(`行 ${d.ln} が verified になっていない`);
    if (!vb.present || vb.who.indexOf('原仮定者') < 0)
      bad.push(`行 ${d.ln} の verified_by が原仮定者でない(${out.verifiedBy})`);
    if (!vb.at || !vb.value) bad.push(`行 ${d.ln} の verified_at / verified_value が欠けている`);
    if (!out.round2) bad.push(`行 ${d.ln} に ${ROUND_TAG} が無い`);
    if (r.sigma === null) bad.push(`行 ${d.ln} は σ が空なのに verified である`);
  } else if (mk.verified && out.round2) {
    bad.push(`行 ${d.ln} は再現できないのに本便で verified にしている`);
  }
  confirmRows.push(out);
}

const pending = PENDING.map((p) => {
  const r = row(p.file, p.ln);
  const mk = r ? readSigmaMark(r.note) : { mark: null };
  const o = { file: p.file, ln: p.ln, body: p.body, quantity: p.quantity, sameAs: p.sameAs, why: p.why,
    mark: mk.mark, noteTag: r ? has(r.note, 'same_table_as_verified_row=') : false,
    round2: r ? has(r.note, ROUND_TAG) : false };
  if (!r) bad.push(`行 ${p.ln} が無い`);
  else {
    if (!o.noteTag) bad.push(`行 ${p.ln} に same_table_as_verified_row= が無い`);
    if (o.round2) bad.push(`行 ${p.ln} に本便の確認印が付いている(明示の回答が無い行である)`);
    // 第269便b(第59報「**X7 警告の残り: 同じ印を付けてよい**」): この 3 行は**第 3 回の確認記録で
    // 解けた**。原仮定者が「同じ表・同じ値の verified 行と同じ印を付けてよい」と裁定したので、
    // `verified_by=` は**写す元の行の確認者と日付**を持つ形で入りうる。**印そのものは第267便a の
    // 時点から 1 bit も動いていない**(この 3 行は本便の前から `verified` である)。
    // ここで固定し直すのは「`verified_by=` が入る場合は `same_mark_as=` と `confirmation_round=3` を
    // 伴う」ことで、第 2 回の確認印(`confirmation_round=2`)が付いていないことは上の行が見る。
    // 第 3 回の突き合わせそのものは `tests/exp-w269b-confirm3.mjs` が数える。
    o.round3 = has(r.note, 'confirmation_round=3');
    o.sameMarkAs = /(?:^|[^A-Za-z0-9_])same_mark_as=(\d+)/.exec(r.note);
    o.sameMarkAs = o.sameMarkAs ? o.sameMarkAs[1] : null;
    if (readVerifiedBy(r.note).present && !(o.round3 && o.sameMarkAs === p.sameAs))
      bad.push(`行 ${p.ln} に verified_by が付いている(第 3 回の同印写しの記録が無い)`);
  }
  return o;
});

const notFound = NOT_FOUND.map(([file, ln, body, quantity, what]) => {
  const r = row(file, ln);
  const mk = r ? readSigmaMark(r.note) : { mark: null };
  const o = { file, ln, body, quantity, what, mark: mk.mark,
    tag: r ? has(r.note, NOT_FOUND_TAG) : false, round2: r ? has(r.note, ROUND_TAG) : false };
  if (!r) bad.push(`行 ${ln}(${file})が無い`);
  else {
    if (r.body !== body || r.quantity !== quantity)
      bad.push(`行 ${ln} が ${body}|${quantity} でない(${r.body}|${r.quantity})`);
    if (!o.tag) bad.push(`行 ${ln} に ${NOT_FOUND_TAG} が無い`);
    if (o.round2) bad.push(`行 ${ln} に本便の確認印が付いている(未回答の行である)`);
  }
  return o;
});

const ack = ACK.map(([file, ln, body, quantity, what]) => {
  const r = row(file, ln);
  const o = { file, ln, body, quantity, what, acknowledged: r ? has(r.note, ACK_TAG) : false,
    value: r ? r.rawValue : null, source: r ? String(r.source).slice(0, 60) : null };
  if (!r) bad.push(`行 ${ln} が無い`);
  else if (!o.acknowledged) bad.push(`行 ${ln} に ${ACK_TAG} が無い`);
  return o;
});

// ---------------------------------------------------------------- CSV 全体の印(厳密読み)
function census(rel2) {
  const rows = CSV[rel2];
  let verified = 0, verifiedBy = 0, verifiedWithoutBy = 0, round2 = 0, round2Verified = 0;
  for (const r of rows) {
    const v = readSigmaMark(r.note).verified, b = readVerifiedBy(r.note).present;
    if (v) verified++;
    if (b) verifiedBy++;
    if (v && !b) verifiedWithoutBy++;
    if (has(r.note, ROUND_TAG)) { round2++; if (v) round2Verified++; }
  }
  return { rows: rows.length, verified, verifiedBy, verifiedWithoutBy, round2, round2Verified };
}
const after = { solar: census(SOLAR_F), cluster: census(CLUSTER_F), transient: census(TRANSIENT_F) };
// 本便で印が付いた行の総数(宣言と実体が合っているか)
const round2Total = after.solar.round2 + after.cluster.round2 + after.transient.round2;
if (round2Total !== CONFIRM2.length)
  bad.push(`${ROUND_TAG} を持つ行が ${round2Total}(宣言は ${CONFIRM2.length})`);
// 第269便b: **後の便で上がった行はこの増分に数えない**。第 3 回の確認記録
// (`confirmation_round=3` —— 第269便b)で `unverified` → `verified` になった行は、第267便a の
// 宣言表とは別の回の結果である。便を跨いで固定値が黙って増えるのを防ぐため、**回で分ける**
// (第 3 回の突き合わせは `tests/exp-w269b-confirm3.mjs` が数える)。
let round3Verified = 0;
for (const r of CSV[SOLAR_F]) {
  if (!/(?:^|[^A-Za-z0-9_])confirmation_round=3\b/.test(r.note)) continue;
  if (!readSigmaMark(r.note).verified) continue;
  // 第 2 回で既に verified だった行(同印写しの 114/115/125)は増分に入っていないので除く
  if (/(?:^|[^A-Za-z0-9_])same_mark_as=/.test(r.note)) continue;
  round3Verified++;
}
// 第270便b: **第 4 回の確認記録**(`confirmation_round=4` —— Cameron 2018 Table 2 の併置行
// 260/262/263)で `unverified` → `verified` になった行も、同じ理由でこの増分に数えない。
// 印が動いた行だけを数えるので、X7 の 3 欄を埋めただけの 6 行(`previous_mark=` を持たない)は入らない。
let round4Verified = 0;
for (const r of CSV[SOLAR_F]) {
  if (!/(?:^|[^A-Za-z0-9_])confirmation_round=4\b/.test(r.note)) continue;
  if (!/(?:^|[^A-Za-z0-9_])previous_mark=unverified\b/.test(r.note)) continue;
  if (!readSigmaMark(r.note).verified) continue;
  round4Verified++;
}
// 第278便a: **第 5 回の確認記録**(`confirmation_round=5` —— 確認依頼 第 5 回の回答・新規行を含む)で
// verified になった行も、同じ理由でこの増分に数えない(第 5 回の突き合わせは `docs.intakeD` が数える)。
let round5Verified = 0;
for (const r of CSV[SOLAR_F]) {
  if (!/(?:^|[^A-Za-z0-9_])confirmation_round=5\b/.test(r.note)) continue;
  if (!readSigmaMark(r.note).verified) continue;
  round5Verified++;
}
if (after.solar.verified - round3Verified - round4Verified - round5Verified - BEFORE.solar.verified
  !== CONFIRM2.filter((d) => d.file === SOLAR_F).length - 5)
  bad.push('太陽系 CSV の verified の増分が宣言と合わない(既に verified だった 5 行と'
    + `第 3 回で上がった ${round3Verified} 行・第 4 回で上がった ${round4Verified} 行・第 5 回で上がった ${round5Verified} 行を除く)`);
// **外部確認印だけで verified になっている行は 1 つも無い**(Z11 —— 第266便a と同じ検査)
const externalOnlyVerified = [];
for (const f of [SOLAR_F, CLUSTER_F, TRANSIENT_F]) for (const r of CSV[f]) {
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
const gate = { calaudit: cal ? { byStatus: (cal.summary && cal.summary.gate || {}).byStatus || null,
    withSigma: (cal.summary && cal.summary.gate || {}).withSigma || null,
    sourceVerified: (cal.summary && cal.summary.gate || {}).sourceVerified || null,
    sigmaRegate: cal.sigmaRegate ? { checked: cal.sigmaRegate.checked, changed: (cal.sigmaRegate.changed || []).length,
      verifiedFlips: (cal.sigmaRegate.verifiedFlips || []).length } : null,
    sigmaMarkAudit: cal.sigmaMarkAudit ? { rows: cal.sigmaMarkAudit.rows,
      legacyVerified: cal.sigmaMarkAudit.legacyVerified, strictVerified: cal.sigmaMarkAudit.strictVerified,
      flips: (cal.sigmaMarkAudit.flips || []).length,
      verifiedByMissing: (cal.sigmaMarkAudit.verifiedByMissing || []).length } : null } : null,
  solarsigma: sol ? { cuts: sol.cuts || sol.cutTally || null, four: sol.fourValues || sol.four || null,
    missing: (sol.missing || []).length || null } : null,
  connected: false,
  why: '**印が `verified` であることは門に繋がっていることではない。** 星団・銀河(47 Tuc / NGC 3198)は '
    + '門の対応表(`tests/exp-w249b-calaudit.mjs` の SIGMA_BODY / SIGMA_TARGET_BODY)に 1 行も無い。'
    + '太陽系の判定行の σ も、本便で 1 件も増えていない(切断点は `unit-not-converted` のままである)。' };

const out = { when: new Date().toISOString(), wave: '第267便a(第57報 追加 3・4・W1)',
  provenance: '原仮定者が提供した確認記録(2026-09-17・第 2 回)。確認日は記録の記載どおり 2026-09-16。'
    + '一次資料は各行の source/url にある。**器は印を上げない** —— 上げるのは原仮定者の照合である。',
  rule: ['値は 1 バイトも書き換えない(**note と印だけ**)',
    '`sigma_primary=unverified` → `verified` は**置換**である(追記ではない —— 最初の印が読まれる)',
    '`verified_by=<確認者> <日付>; verified_at=<表/列>; verified_value=<原記載>` を書く(X7)',
    '**回答に無い行の印は 1 bit も動かさない**(`confirmation_2=not-found-by-author` を足すだけ)',
    '同じ表・同じ値でも**明示の回答が無い行**には印を付けない(注記だけ)',
    '訂正 3 件の追認は `acknowledged_by=` の印だけで、値には触れない',
    'プリセット・builder・門の行選択・本体 HTML は 1 バイトも触らない'],
  classes: { 一致: agree, 不一致: disagree, 未回答: notFound.length,
    '同じ表だが明示なし(印を付けない)': pending.length,
    未回答の質問: NOT_FOUND_QUESTIONS.length },
  confirm: { n: CONFIRM2.length, rows: confirmRows },
  pending, notFound, notFoundQuestions: NOT_FOUND_QUESTIONS, ack,
  census: { before: BEFORE, after, round2Total, externalOnlyVerified },
  gate,
  violations: bad,
  doNotWrite: ['太陽系の σ が揃った', '判定(4 値)が増えた', '門に入れた',
    '星団・銀河を較正した', '現実較正を完了した', 'Release した'] };
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));

const pad = (s, n) => String(s) + ' '.repeat(Math.max(0, n - String(s).length));
console.log('[w267a] 確認記録(2026-09-17・第 2 回)の突き合わせ');
console.log('  ① 3 分類: 一致 ' + agree + ' / 不一致 ' + disagree + ' / 未回答 ' + notFound.length
  + '(+ 行を持たない質問 ' + NOT_FOUND_QUESTIONS.length + ')'
  + ' / 同じ表だが明示なし ' + pending.length + '(**印を付けない**)');
for (const r of confirmRows)
  console.log('     ' + pad(r.file.replace('paper/data/', '').replace('-observations.csv', ''), 8)
    + pad(r.ln, 5) + pad(r.body + '|' + r.quantity, 42)
    + pad(r.klass, 5) + ' 値Δ ' + pad(r.valueRelErr === null ? '—' : r.valueRelErr.toExponential(1), 9)
    + ' σΔ ' + pad(r.sigmaRelErr === null ? '—' : r.sigmaRelErr.toExponential(1), 9)
    + ' 印=' + r.mark);
console.log('  ② CSV 全体の印(厳密読み) 前 → 後');
for (const k of ['solar', 'cluster', 'transient'])
  console.log('     ' + pad(k, 10) + BEFORE[k].verified + ' → ' + after[k].verified
    + ' verified(verified_by ' + BEFORE[k].verifiedBy + ' → ' + after[k].verifiedBy
    + ' / 印だけの行 ' + BEFORE[k].verifiedWithoutBy + ' → ' + after[k].verifiedWithoutBy
    + ' / 本便の印 ' + after[k].round2 + ')');
console.log('  ③ 訂正 3 件の追認: ' + ack.filter((a) => a.acknowledged).length + '/' + ack.length + ' 行');
console.log('  ④ 門: **動かしていない** —— ' + (gate.calaudit && gate.calaudit.byStatus
  ? JSON.stringify(gate.calaudit.byStatus) : '(calaudit JSON なし)'));
if (bad.length) console.log('  **違反 ' + bad.length + ' 件**: ' + bad.slice(0, 6).join(' , '));
console.log('→ ' + path.relative(ROOT, OUT));
