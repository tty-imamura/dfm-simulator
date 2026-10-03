// 第290便g(統括の検証項目 R131): **確認依頼 第 7 回・第 8 回の回答を候補行として CSV に転写する器**。
//
// ■ 何をするか(**エンジンを 1 步も走らせない** —— html にも `S._core` にも物理にも 1 バイトも触らない)
//   回答の要約を**宣言表 `CANDIDATES`**(下)にし、3 つの観測 CSV の**末尾に候補行として足す**。
//   ・**既存行は 1 字も書き換えない** —— 各ファイルの基点(第289便 f03bf5a)のバイト列を `BASE` に
//     バイト数と SHA-256 で持ち、`--check` が「先頭がそのバイト列のまま」であることを毎回確かめる。
//   ・**量名はすべて `<量>_candidate`**(門が読む量 `orbital_period` / `eccentricity` / `periastron_advance` と
//     別の鍵 —— 門の行選択は 1 行も動かない)。同じ量・同じ出典の既存行があれば `same_value_as=<record_id>` で指す。
//   ・**印 `verified` を付けない**(全行 `sigma_primary=unverified; verified_by=` —— 印を上げるのは原仮定者の照合だけ)。
//   ・**sigma 列は全行空欄**。理由は 2 つ:
//       (1) 90% 区間(GW の源パラメータ)は `ci90=+a/-b` に置く(σ に換算しない・対称化しない)。
//       (2) 対称の ± でも、回答の要約からは**一次資料の 1σ かどうか(水準)を確かめていない**ので
//           `sigma_candidate_unconfirmed=` に置く(第277便の取得依頼 C の規約と同じ形)。
//     非対称の区間は `interval_plus=` / `interval_minus=` のまま(**対称化しない**)。2 解は 2 行(**平均しない**)。
//   ・`kind=` を全行に置く(`observed` / `model-derived` / `upper-limit` / `lower-limit` / `analysis-window` /
//     `derived-in-record` / `ephemeris-fit` / `observed-count`)。
//   ・`record_id` は `tests/lib-w270b-obscsv.mjs` の規約で器が振る(手打ちしない)。`solution_id` は空欄
//     (台帳 `paper/data/solutions.json` の id は使わない —— 解タグは note の `solution=` だけ)。
//
// ■ 転写しないもの(**未決のまま**)
//   ・土星 C 環内縁 74490 km(French 1993 Icarus 103 163 の原表に未到達)。
//   ・月の a/P/e の ±1σ(資料に列が無い)。
//   ・回答の要約に**数値が無い**項目(冥王星の小衛星の P・Cameron 2023 Table 4・Singha 2026 Table 2・
//     Kramer 2021 Table IV・Meng 2025 Table 1)—— 書誌だけを docs に残す(数値を推測で埋めない)。
//
// ■ 書誌の点検(既存行に混入があれば訂正する約束 —— **第290便g の点検では混入 0**)
//   ・PSR J1757−1854 の発見論文は Cameron et al. 2018 MNRAS Letters 475 L57–L61(DOI 10.1093/mnrasl/sly003・
//     arXiv:1711.07697)。別論文「MNRAS 475 4994 / sty113」を指す行は 3 CSV・docs・html のどこにも無かった。
//   ・Fonseca, Stairs & Thorsett 2014 の時間解は **Table 3**(DD / DDGR)、歳差と傾きは Table 4。既存行は Table 3 のまま。
//   ・Orosz et al. 2011 ApJ 742 84 は **Cyg X-1** の論文(既存行には未登場)。
//   ・De et al. 2026 Science 391 689 は**刊行版**(13 M☉)・2024 の v1(arXiv:2410.14778v1)は 20 M☉ —— 候補 2 行のまま。
//
// ■ 実行
//   node tests/exp-w290g-intake8.mjs            … 点検だけ(`--check` と同じ。CSV を書かない)
//   node tests/exp-w290g-intake8.mjs --write    … 基点のままのファイルにだけ候補行を足す(足し済みなら何もしない = 冪等)
//   node tests/exp-w290g-intake8.mjs --json     … 点検の結果を JSON で標準出力へ(正本ファイルは書かない)
//   **tests/out に正本を書かない器**である(QA `docs.intake8` が import して同じ点検を走らせる)。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { loadObsCsv, assignRecordIds, parseCsvLine, headerIndex } from './lib-w270b-obscsv.mjs';
import { readSigmaMark, readVerifiedBy } from './lib-w264d-sigmamark.mjs';
import { GATE_QUANTITIES, wiredBodies } from './lib-sigma-destinations.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const INTAKE_DATE = '2026-10-02';
export const WAVE = '第290便g';
const SOLAR = 'paper/data/solar-observations.csv';
const TRANSIENT = 'paper/data/transient-observations.csv';
const CLUSTER = 'paper/data/cluster-galaxy-observations.csv';
export const FILES = [SOLAR, TRANSIENT, CLUSTER];

/** 基点(main f03bf5a)の各ファイル —— **このバイト列は 1 字も変えない**(候補行は末尾に足すだけ)。 */
export const BASE = Object.freeze({
  [SOLAR]: { rev: 'f03bf5a', rows: 601, bytes: 563636,
    sha256: '1408757d47f818e266abe753d221caf0ab722d0f026f41827a782e639202e45a' },
  [TRANSIENT]: { rev: 'f03bf5a', rows: 36, bytes: 29299,
    sha256: 'a8ebc863d4c5826e56af93a2492aff59448785b0aa5001939a67459937738dfd' },
  [CLUSTER]: { rev: 'f03bf5a', rows: 154, bytes: 94818,
    sha256: '6fe0e68c2f539813d5339962dead965d2d7ef7f5ba6709deef5fceb22ec18461' },
});

/** kind の語彙(この便で使う集合)。 */
export const KINDS = ['observed', 'model-derived', 'upper-limit', 'lower-limit', 'analysis-window',
  'derived-in-record', 'ephemeris-fit', 'observed-count'];

// ---------------------------------------------------------------- 書誌(一次資料の書誌だけ)
const B = {
  lower24: ['Lower M.E. et al. 2024 A&A 682 A26', 'https://doi.org/10.1051/0004-6361/202347857'],
  breton08: ['Breton R.P. et al. 2008 Science 321 104', 'https://doi.org/10.1126/science.1159295'],
  ferdman13: ['Ferdman R.D. et al. 2013 ApJ 767 85 section 6 (Results)', 'https://doi.org/10.1088/0004-637X/767/1/85'],
  stairs04: ['Stairs I.H. et al. 2004 PRL 93 141101', 'https://doi.org/10.1103/PhysRevLett.93.141101'],
  fonseca14t4: ['Fonseca E. Stairs I.H. & Thorsett S.E. 2014 ApJ 787 82 Table 4', 'https://doi.org/10.1088/0004-637X/787/1/82'],
  fonseca14t3: ['Fonseca E. Stairs I.H. & Thorsett S.E. 2014 ApJ 787 82 Table 3 (DD)', 'https://doi.org/10.1088/0004-637X/787/1/82'],
  cameron23: ['Cameron A.D. et al. 2023 MNRAS 523 5064 Table 3', 'https://ui.adsabs.harvard.edu/abs/2023MNRAS.523.5064C'],
  cameron23r: ['Cameron A.D. et al. 2023 MNRAS 523 5064', 'https://ui.adsabs.harvard.edu/abs/2023MNRAS.523.5064C'],
  cameron18: ['Cameron A.D. et al. 2018 MNRAS Letters 475 L57-L61 Table 2 (DDH)', 'https://doi.org/10.1093/mnrasl/sly003'],
  meng24: ['Meng L. et al. 2024 ApJ 966 46', 'https://ui.adsabs.harvard.edu/abs/2024ApJ...966...46M'],
  abbott16: ['Abbott B.P. et al. 2016 PRL 116 061102', 'https://doi.org/10.1103/PhysRevLett.116.061102'],
  gwtc1: ['Abbott B.P. et al. 2019 PRX 9 031040 (GWTC-1) Table III', 'https://doi.org/10.1103/PhysRevX.9.031040'],
  gwtc1b: ['Abbott B.P. et al. 2019 PRX 9 031040 (GWTC-1) Appendix B', 'https://doi.org/10.1103/PhysRevX.9.031040'],
  gwosc32: ['GWOSC GW150914 event data release (32 s strain segment)', 'https://gwosc.org/eventapi/html/event/GW150914/'],
  gwosc4096: ['GWOSC GW150914 event data release (4096 s strain segment)', 'https://gwosc.org/eventapi/html/event/GW150914/'],
  orosz11: ['Orosz J.A. et al. 2011 ApJ 742 84', 'https://ui.adsabs.harvard.edu/abs/2011ApJ...742...84O'],
  millerjones21: ['Miller-Jones J.C.A. et al. 2021 Science 371 1046', 'https://ui.adsabs.harvard.edu/abs/2021Sci...371.1046M'],
  steeghs13: ['Steeghs D. et al. 2013 ApJ 768 185', 'https://ui.adsabs.harvard.edu/abs/2013ApJ...768..185S'],
  koshimoto23: ['Koshimoto N. et al. 2023 AJ 166 107', 'https://doi.org/10.3847/1538-3881/ace689'],
  de26: ['De K. et al. 2026 Science 391 689 (published version)', 'https://doi.org/10.1126/science.adt4853'],
  de24v1: ['De K. et al. 2024 arXiv:2410.14778v1 (preprint version 1)', 'https://arxiv.org/abs/2410.14778v1'],
  villarroel20: ['Villarroel B. et al. 2020 AJ 159 8', 'https://doi.org/10.3847/1538-3881/ab570f'],
  villarroel21: ['Villarroel B. et al. 2021 Sci Rep 11 12794', 'https://ui.adsabs.harvard.edu/abs/2021NatSR..1112794V'],
  chrimes24: ['Chrimes A.A. et al. 2024 MNRAS Letters 527 L47', 'https://doi.org/10.1093/mnrasl/slad145'],
  baumgardt: ['Baumgardt Galactic Globular Cluster Database parameter table (NGC 104 row)', 'https://people.smp.uq.edu.au/HolgerBaumgardt/globular/parameter.html'],
  kamann18: ['Kamann S. et al. 2018 MNRAS 473 5591 Table 3', 'https://ui.adsabs.harvard.edu/abs/2018MNRAS.473.5591K'],
  miller19: ['Miller R. et al. 2019 ApJ 874 177 Table 1', 'https://ui.adsabs.harvard.edu/abs/2019ApJ...874..177M'],
  aguerri15: ['Aguerri J.A.L. et al. 2015 A&A 576 A102 Tables 3-4', 'https://ui.adsabs.harvard.edu/abs/2015A%26A...576A.102A'],
};

// ---------------------------------------------------------------- 宣言表(**回答の要約だけを源にする**)
// 欄: file・round(7|8)・item(回答の項目名)・body・quantity・value(印字のまま・空欄可)・unit・src(B の鍵)・
//     srcSuffix(同じ書誌で行を分けるときの添字)・kind・note(行固有の注記 —— 共通注記は器が足す)
const C = (file, round, item, body, quantity, value, unit, src, kind, note, srcSuffix = '') =>
  ({ file, round, item, body, quantity, value, unit, src, srcSuffix, kind, note });
const R8 = 8, R7 = 7;
const NO_SIGMA_LEVEL = 'the 1-sigma level of the printed +/- is not confirmed from the response so the value is held in sigma_candidate_unconfirmed and the sigma column stays EMPTY';
const ASYM = 'asymmetric interval kept as printed (NOT symmetrised) so the sigma column stays EMPTY';
const CI90 = 'sigma_kind=ci90; the 90 percent credible interval is NOT a 1-sigma and is NOT converted to one so the sigma column stays EMPTY';
export const CANDIDATES = [
  // ======== 第 8 回: 連星の傾き(spin-orbit misalignment)と測地歳差率
  C(SOLAR, R8, 'R8-doublePulsarB', 'PSR J0737-3039 B', 'spin_orbit_misalignment_candidate', '40.6', 'deg', 'lower24', 'model-derived',
    'printed=delta_B = 180 deg - theta = 40.6 +/- 0.1 deg; premise=general relativity assumed (the angle comes from the GR geometric solution); sigma_candidate_unconfirmed=0.1; ' + NO_SIGMA_LEVEL + '; same_value_as=SOL-912f7aa2 (the existing row is NOT replaced)', ' section 5.2 (System geometry)'),
  C(SOLAR, R8, 'R8-doublePulsarB', 'PSR J0737-3039 B', 'geodetic_precession_rate_candidate', '5.16', 'deg/yr', 'lower24', 'model-derived',
    'printed=Omega_SO^B = 5.16 deg/yr; premise=general relativity assumed; consistent with the current declaration of the double-pulsar sample; the interval printed beside it is held in the existing row SOL-7e3303df and is not repeated here; same_value_as=SOL-7e3303df', ' section 4.1 (Geodetic precession and model limitations)'),
  C(SOLAR, R8, 'R8-doublePulsarB', 'PSR J0737-3039 B', 'geodetic_precession_rate_candidate', '4.77', 'deg/yr', 'breton08', 'observed',
    'printed=Omega_B = 4.77 (+0.66/-0.65) deg/yr; level=68; interval_plus=0.66; interval_minus=0.65; sigma_kind=asymmetric; ' + ASYM + '; solution=Breton2008; same_value_as=SOL-615c1924'),
  C(SOLAR, R8, 'R8-doublePulsarB', 'PSR J0737-3039 B', 'spin_orbit_misalignment_theta_candidate', '130.02', 'deg', 'breton08', 'observed',
    'printed=theta_0 = 130.02 deg at MJD 53857; epoch=MJD 53857; angle_convention=theta (the angle of the paper - Lower 2024 writes delta_B = 180 deg - theta; the value is NOT converted); no interval is transcribed in this intake; solution=Breton2008'),
  C(SOLAR, R8, 'R8-doublePulsarB', 'PSR J0737-3039 B', 'geodetic_precession_rate_predicted_GR_candidate', '5.0734', 'deg/yr', 'breton08', 'model-derived',
    'GR prediction from the timing masses - NOT an observation; the response quotes the GR predictions as 5.073 to 5.074 deg/yr (two rows - this one and the Lower 2024 row); same_value_as=SOL-04a7e6f2'),
  C(SOLAR, R8, 'R8-doublePulsarB', 'PSR J0737-3039 B', 'geodetic_precession_rate_predicted_GR_candidate', '5.074005', 'deg/yr', 'lower24', 'model-derived',
    'GR expectation quoted beside the measured rate - NOT an observation; the response quotes the GR predictions as 5.073 to 5.074 deg/yr (two rows - this one and the Breton 2008 row); same_value_as=SOL-1ad7eaa7', ' section 4.1 (Geodetic precession and model limitations)'),
  C(SOLAR, R8, 'R8-doublePulsarA', 'PSR J0737-3039 A', 'spin_orbit_misalignment_candidate', '', 'deg', 'ferdman13', 'upper-limit',
    'upper_limit=0.85; level=68; average over the two-pole case (assuming that the emission comes from both magnetic poles); value EMPTY - an upper limit is NOT a measured value; sigma_kind=none; same_value_as=SOL-1a2a3c9d', ' - 68 percent average upper limit'),
  C(SOLAR, R8, 'R8-doublePulsarA', 'PSR J0737-3039 A', 'spin_orbit_misalignment_candidate', '', 'deg', 'ferdman13', 'upper-limit',
    'upper_limit=3.2; level=95; average over the two-pole case (assuming that the emission comes from both magnetic poles); value EMPTY - an upper limit is NOT a measured value; sigma_kind=none; same_value_as=SOL-5600e70a', ' - 95 percent average upper limit'),
  C(SOLAR, R8, 'R8-doublePulsarA', 'PSR J0737-3039 A', 'spin_orbit_misalignment_candidate', '', 'deg', 'ferdman13', 'upper-limit',
    'upper_limit=4.7; level=99; average over the two-pole case (assuming that the emission comes from both magnetic poles); value EMPTY - an upper limit is NOT a measured value; sigma_kind=none; same_value_as=SOL-17062fa8', ' - 99 percent average upper limit'),
  C(SOLAR, R8, 'R8-B1534', 'PSR B1534+12', 'geodetic_precession_rate_candidate', '0.44', 'deg/yr', 'stairs04', 'observed',
    'printed=0.44 (+0.48/-0.16) deg/yr; interval_plus=0.48; interval_minus=0.16; sigma_kind=asymmetric; level=not restated in this intake; ' + ASYM),
  C(SOLAR, R8, 'R8-B1534', 'PSR B1534+12', 'spin_orbit_misalignment_candidate', '25.0', 'deg', 'stairs04', 'model-derived',
    'printed=delta = 25.0 +/- 3.8 deg OR 155.0 +/- 3.8 deg (two solutions); this row is the 25.0 deg solution; the two solutions are NOT averaged (their mean is not a solution); sigma_candidate_unconfirmed=3.8; ' + NO_SIGMA_LEVEL + '; solution=Stairs2004-delta25', ' - solution delta=25.0 deg'),
  C(SOLAR, R8, 'R8-B1534', 'PSR B1534+12', 'spin_orbit_misalignment_candidate', '155.0', 'deg', 'stairs04', 'model-derived',
    'printed=delta = 25.0 +/- 3.8 deg OR 155.0 +/- 3.8 deg (two solutions); this row is the 155.0 deg solution; the two solutions are NOT averaged (their mean is not a solution); sigma_candidate_unconfirmed=3.8; ' + NO_SIGMA_LEVEL + '; solution=Stairs2004-delta155', ' - solution delta=155.0 deg'),
  C(SOLAR, R8, 'R8-B1534', 'PSR B1534+12', 'geodetic_precession_rate_candidate', '0.59', 'deg/yr', 'fonseca14t4', 'observed',
    'printed=0.59 (+0.12/-0.08) deg/yr (All); data_set=All; interval_plus=0.12; interval_minus=0.08; sigma_kind=asymmetric; ' + ASYM, ' (All)'),
  C(SOLAR, R8, 'R8-B1534', 'PSR B1534+12', 'spin_orbit_misalignment_candidate', '27.0', 'deg', 'fonseca14t4', 'derived-in-record',
    'printed=27.0 +/- 3.0 deg; derived quantity printed in the table (its inputs and formula are not transcribed in this intake); sigma_candidate_unconfirmed=3.0; ' + NO_SIGMA_LEVEL),
  C(SOLAR, R8, 'R8-B1534', 'PSR B1534+12', 'geodetic_precession_rate_predicted_GR_candidate', '0.51', 'deg/yr', 'fonseca14t4', 'model-derived',
    'GR prediction - NOT an observation; printed=0.51 deg/yr; source_attribution=as listed in the response beside the Table 4 rate (to be confirmed against the table)'),
  C(SOLAR, R8, 'R8-B1534', 'PSR B1534+12', 'spin_axis_sky_projection_eta_candidate', '139', 'deg', 'fonseca14t4', 'model-derived',
    'printed=eta = 139 (+16/-25) deg; basis=line-of-sight (sky-plane projection of the spin axis) - NOT converted to a spin-orbit angle; interval_plus=16; interval_minus=25; sigma_kind=asymmetric; ' + ASYM + '; source_attribution=as listed in the response beside the Table 4 rate (to be confirmed against the table)'),
  C(SOLAR, R8, 'R8-J1757', 'PSR J1757-1854', 'spin_orbit_misalignment_candidate', '132', 'deg', 'cameron23', 'model-derived',
    'printed=Table 3 lists four solutions delta = 132 / 46 / 128 / 52 (+/-4) deg; this row is the 132 deg solution; premise=the GR precession rate 3.0709(8) deg/yr is ASSUMED in the fit (no independently observed precession rate is published); the four solutions are NOT averaged; preferred solutions noted in the response = 46 and 52 deg (a preference is not a selection here); sigma_candidate_unconfirmed=4; ' + NO_SIGMA_LEVEL + '; solution=Cameron2023-delta132', ' - solution delta=132 deg'),
  C(SOLAR, R8, 'R8-J1757', 'PSR J1757-1854', 'spin_orbit_misalignment_candidate', '46', 'deg', 'cameron23', 'model-derived',
    'printed=Table 3 lists four solutions delta = 132 / 46 / 128 / 52 (+/-4) deg; this row is the 46 deg solution; premise=the GR precession rate 3.0709(8) deg/yr is ASSUMED in the fit (no independently observed precession rate is published); the four solutions are NOT averaged; preferred solutions noted in the response = 46 and 52 deg (a preference is not a selection here); sigma_candidate_unconfirmed=4; ' + NO_SIGMA_LEVEL + '; solution=Cameron2023-delta46', ' - solution delta=46 deg'),
  C(SOLAR, R8, 'R8-J1757', 'PSR J1757-1854', 'spin_orbit_misalignment_candidate', '128', 'deg', 'cameron23', 'model-derived',
    'printed=Table 3 lists four solutions delta = 132 / 46 / 128 / 52 (+/-4) deg; this row is the 128 deg solution; premise=the GR precession rate 3.0709(8) deg/yr is ASSUMED in the fit (no independently observed precession rate is published); the four solutions are NOT averaged; preferred solutions noted in the response = 46 and 52 deg (a preference is not a selection here); sigma_candidate_unconfirmed=4; ' + NO_SIGMA_LEVEL + '; solution=Cameron2023-delta128', ' - solution delta=128 deg'),
  C(SOLAR, R8, 'R8-J1757', 'PSR J1757-1854', 'spin_orbit_misalignment_candidate', '52', 'deg', 'cameron23', 'model-derived',
    'printed=Table 3 lists four solutions delta = 132 / 46 / 128 / 52 (+/-4) deg; this row is the 52 deg solution; premise=the GR precession rate 3.0709(8) deg/yr is ASSUMED in the fit (no independently observed precession rate is published); the four solutions are NOT averaged; preferred solutions noted in the response = 46 and 52 deg (a preference is not a selection here); sigma_candidate_unconfirmed=4; ' + NO_SIGMA_LEVEL + '; solution=Cameron2023-delta52', ' - solution delta=52 deg'),
  C(SOLAR, R8, 'R8-J1757', 'PSR J1757-1854', 'geodetic_precession_rate_predicted_GR_candidate', '3.0709', 'deg/yr', 'cameron23r', 'model-derived',
    'printed=3.0709(8) deg/yr; the GR rate ASSUMED in the geometry fit - NOT an observation; observed_rate=none published (no independently observed precession rate exists for this pulsar); sigma_candidate_unconfirmed=0.0008; ' + NO_SIGMA_LEVEL),
  C(SOLAR, R8, 'R8-J1946', 'PSR J1946+2052', 'spin_orbit_misalignment_candidate', '0.21', 'deg', 'meng24', 'model-derived',
    'printed=delta = 0.21 (+0.28/-0.10) deg; premise=general relativity assumed; interval_plus=0.28; interval_minus=0.10; sigma_kind=asymmetric; ' + ASYM),
  C(SOLAR, R8, 'R8-J1946', 'PSR J1946+2052', 'geodetic_precession_rate_predicted_GR_candidate', '7.96', 'deg/yr', 'meng24', 'model-derived',
    'printed=7.96(23) deg/yr; predicted rate - NOT an observation; sigma_candidate_unconfirmed=0.23; ' + NO_SIGMA_LEVEL),
  // ======== 第 8 回: GW150914 の「約 4 秒」(印字した一次資料は無い —— 窓と帯域内継続を分けて書く)
  C(TRANSIENT, R8, 'R8-GW150914-window', 'GW150914 signal', 'signal_duration_in_band_candidate', '0.2', 's', 'abbott16', 'observed',
    'printed=over 0.2 s the signal increases in frequency from 35 to 150 Hz; band=35 to 150 Hz; printed_4s=none (no primary source prints a duration of about 4 s - the 4 s of the sample is a window declaration and NOT an observation); also_answers=request 7 item A3 (duration 0.2 s); body GW150914 signal = the detected strain signal and its analysis windows (the source parameters are rows of solar-observations.csv under GW150914); sigma_kind=none'),
  C(TRANSIENT, R8, 'R8-GW150914-window', 'GW150914 signal', 'data_segment_length_candidate', '32', 's', 'gwosc32', 'analysis-window',
    'length of a released strain segment - an analysis window and NOT an observed quantity; sigma_kind=none'),
  C(TRANSIENT, R8, 'R8-GW150914-window', 'GW150914 signal', 'data_segment_length_candidate', '4096', 's', 'gwosc4096', 'analysis-window',
    'length of a released strain segment - an analysis window and NOT an observed quantity; sigma_kind=none'),
  C(TRANSIENT, R8, 'R8-GW150914-window', 'GW150914 signal', 'pe_segment_length_candidate', '8', 's', 'gwtc1b', 'analysis-window',
    'parameter-estimation data segment of the catalogue analysis - an analysis window and NOT an observed quantity; sigma_kind=none'),
  C(TRANSIENT, R8, 'R8-GW150914-window', 'GW150914 signal', 'reference_frequency_candidate', '20', 'Hz', 'gwtc1b', 'analysis-window',
    'f_ref of the catalogue analysis (the frequency at which spins are quoted) - an analysis setting and NOT an observed quantity; also_answers=request 7 item A2 (f_ref=20 Hz); sigma_kind=none'),
  C(TRANSIENT, R8, 'R8-GW150914-window', 'GW150914 signal', 'low_frequency_cutoff_candidate', '20', 'Hz', 'gwtc1b', 'analysis-window',
    'f_low of the catalogue analysis - an analysis setting and NOT an observed quantity; sigma_kind=none'),
  // ======== 第 7 回 A: GW150914 の源パラメータ(**90% 区間 → ci90=・σ 空欄**)
  C(SOLAR, R7, 'A1-Abbott2016', 'GW150914 A', 'component_mass_candidate', '36', 'M_sun', 'abbott16', 'model-derived',
    'frame=source; printed=36 (+5/-4) M_sun; ci90=+5/-4; ' + CI90),
  C(SOLAR, R7, 'A1-Abbott2016', 'GW150914 B', 'component_mass_candidate', '29', 'M_sun', 'abbott16', 'model-derived',
    'frame=source; printed=29 +/- 4 M_sun; ci90=+4/-4; ' + CI90),
  C(SOLAR, R7, 'A1-Abbott2016', 'GW150914', 'final_mass_candidate', '62', 'M_sun', 'abbott16', 'model-derived',
    'frame=source; printed=62 +/- 4 M_sun; ci90=+4/-4; ' + CI90),
  C(SOLAR, R7, 'A1-Abbott2016', 'GW150914', 'final_spin_candidate', '0.67', '1', 'abbott16', 'model-derived',
    'dimensionless remnant spin; printed=0.67; ci90=not transcribed in this intake; ' + CI90),
  C(SOLAR, R7, 'A1-Abbott2016', 'GW150914', 'luminosity_distance_candidate', '410', 'Mpc', 'abbott16', 'model-derived',
    'printed=410 (+160/-180) Mpc; ci90=+160/-180; ' + CI90),
  C(SOLAR, R7, 'A1-GWTC1', 'GW150914 A', 'component_mass_candidate', '35.6', 'M_sun', 'gwtc1', 'model-derived',
    'frame=source; printed=35.6 M_sun (median); ci90=not transcribed in this intake; ' + CI90),
  C(SOLAR, R7, 'A1-GWTC1', 'GW150914 B', 'component_mass_candidate', '30.6', 'M_sun', 'gwtc1', 'model-derived',
    'frame=source; printed=30.6 M_sun (median); ci90=not transcribed in this intake; ' + CI90),
  C(SOLAR, R7, 'A1-GWTC1', 'GW150914', 'chirp_mass_candidate', '28.6', 'M_sun', 'gwtc1', 'model-derived',
    'frame=source; printed=28.6 M_sun (median); ci90=not transcribed in this intake; ' + CI90),
  C(SOLAR, R7, 'A1-GWTC1', 'GW150914', 'final_mass_candidate', '63.1', 'M_sun', 'gwtc1', 'model-derived',
    'frame=source; printed=63.1 M_sun (median); ci90=not transcribed in this intake; ' + CI90),
  C(SOLAR, R7, 'A1-GWTC1', 'GW150914', 'final_spin_candidate', '0.69', '1', 'gwtc1', 'model-derived',
    'dimensionless remnant spin; printed=0.69 (median); ci90=not transcribed in this intake; ' + CI90),
  C(SOLAR, R7, 'A1-GWTC1', 'GW150914', 'luminosity_distance_candidate', '440', 'Mpc', 'gwtc1', 'model-derived',
    'printed=440 Mpc (median); ci90=not transcribed in this intake; ' + CI90),
  C(SOLAR, R7, 'A3-Abbott2016', 'GW150914', 'chirp_mass_detector_frame_candidate', '30', 'M_sun', 'abbott16', 'model-derived',
    'frame=detector; printed=approximately 30 M_sun (an approximate statement of the paper - NOT a posterior summary); sigma_kind=none'),
  // ======== 第 7 回 A3: 帯域内の周波数(σ なし)
  C(TRANSIENT, R7, 'A3-Abbott2016', 'GW150914 signal', 'gw_frequency_band_start_candidate', '35', 'Hz', 'abbott16', 'observed',
    'first frequency of the sequence 35 -> 150 -> 250 Hz quoted in the response; start of the 0.2 s in-band sweep; sigma_kind=none'),
  C(TRANSIENT, R7, 'A3-Abbott2016', 'GW150914 signal', 'gw_frequency_at_peak_amplitude_candidate', '150', 'Hz', 'abbott16', 'observed',
    'second frequency of the sequence 35 -> 150 -> 250 Hz quoted in the response; the frequency where the amplitude reaches its maximum; sigma_kind=none'),
  C(TRANSIENT, R7, 'A3-Abbott2016', 'GW150914 signal', 'gw_frequency_after_peak_candidate', '250', 'Hz', 'abbott16', 'observed',
    'third frequency of the sequence 35 -> 150 -> 250 Hz quoted in the response; its definition in the paper is to be confirmed against the text; sigma_kind=none'),
  // ======== 第 7 回 B3/B11: PSR J1757-1854(Cameron 2018 Table 2 DDH・印字の単位のまま)
  C(SOLAR, R7, 'B3-Cameron2018', 'PSR J1757-1854', 'orbital_period_candidate', '0.18353783587', 'd', 'cameron18', 'ephemeris-fit',
    'printed=Pb = 0.18353783587(5) d; unit as printed (NOT converted to s); sigma_candidate_unconfirmed=5e-11; ' + NO_SIGMA_LEVEL + '; solution=Cameron2018-DDH; same_solution_as=SOL-7f931145 (the existing row in s is NOT replaced)'),
  C(SOLAR, R7, 'B3-Cameron2018', 'PSR J1757-1854', 'eccentricity_candidate', '0.6058142', '1', 'cameron18', 'ephemeris-fit',
    'printed=e = 0.6058142(10); sigma_candidate_unconfirmed=1.0e-6; ' + NO_SIGMA_LEVEL + '; solution=Cameron2018-DDH'),
  C(SOLAR, R7, 'B3-Cameron2018', 'PSR J1757-1854', 'periastron_advance_candidate', '10.3651', 'deg/yr', 'cameron18', 'ephemeris-fit',
    'printed=omega_dot = 10.3651(2) deg/yr; sigma_candidate_unconfirmed=0.0002; ' + NO_SIGMA_LEVEL + '; solution=Cameron2018-DDH; same_value_as=SOL-0372e267'),
  // ======== 第 7 回 B11/C1: PSR B1534+12(Fonseca 2014 Table 3 DD)
  C(SOLAR, R7, 'B11-Fonseca2014', 'PSR B1534+12', 'orbital_period_candidate', '0.420737298879', 'd', 'fonseca14t3', 'ephemeris-fit',
    'printed=Pb = 0.420737298879(2) d; unit as printed (NOT converted to s); sigma_candidate_unconfirmed=2e-12; ' + NO_SIGMA_LEVEL + '; solution=Fonseca2014-DD'),
  C(SOLAR, R7, 'B11-Fonseca2014', 'PSR B1534+12', 'eccentricity_candidate', '0.27367752', '1', 'fonseca14t3', 'ephemeris-fit',
    'printed=e = 0.27367752(7); sigma_candidate_unconfirmed=7e-8; ' + NO_SIGMA_LEVEL + '; solution=Fonseca2014-DD'),
  C(SOLAR, R7, 'B11-Fonseca2014', 'PSR B1534+12', 'periastron_advance_candidate', '1.7557950', 'deg/yr', 'fonseca14t3', 'ephemeris-fit',
    'printed=omega_dot = 1.7557950(19) deg/yr; sigma_candidate_unconfirmed=1.9e-6; ' + NO_SIGMA_LEVEL + '; solution=Fonseca2014-DD; collation_target_for=AN82 (the deg/yr value of the PSR B1534+12 sample - request 7 item C1); same_value_as=SOL-ffd2695b'),
  C(SOLAR, R7, 'B11-Fonseca2014', 'PSR B1534+12', 'orbital_period_derivative_candidate', '-1.366e-13', '1', 'fonseca14t3', 'ephemeris-fit',
    'printed=Pb_dot = -1.366(3) x 10^-13; sigma_candidate_unconfirmed=3e-16; ' + NO_SIGMA_LEVEL + '; solution=Fonseca2014-DD'),
  // ======== 第 7 回 B4: 恒星質量 BH 連星(記録 —— 質量は model-derived)
  C(TRANSIENT, R7, 'B4-CygX1', 'Cyg X-1', 'orbital_inclination_candidate', '27.06', 'deg', 'orosz11', 'model-derived',
    'printed=i = 27.06 +/- 0.76 deg; Orosz et al. 2011 ApJ 742 84 is the Cyg X-1 paper; sigma_candidate_unconfirmed=0.76; ' + NO_SIGMA_LEVEL),
  C(TRANSIENT, R7, 'B4-CygX1', 'Cyg X-1', 'black_hole_mass_candidate', '14.81', 'Msun', 'orosz11', 'model-derived',
    'printed=M = 14.81 +/- 0.98 Msun; dynamical mass from a model of the binary; the 2021 mass (21.2 Msun) is a separate candidate row and the two are NOT merged; sigma_candidate_unconfirmed=0.98; ' + NO_SIGMA_LEVEL),
  C(TRANSIENT, R7, 'B4-CygX1', 'Cyg X-1', 'eccentricity_candidate', '0.018', '1', 'orosz11', 'observed',
    'printed=e = 0.018 +/- 0.003 (radial-velocity orbit); sigma_candidate_unconfirmed=0.003; ' + NO_SIGMA_LEVEL),
  C(TRANSIENT, R7, 'B4-CygX1', 'Cyg X-1', 'black_hole_mass_candidate', '21.2', 'Msun', 'millerjones21', 'model-derived',
    'printed=M = 21.2 +/- 2.2 Msun; dynamical mass from a model of the binary with the 2021 distance; the 2011 mass (14.81 Msun) is a separate candidate row and the two are NOT merged; sigma_candidate_unconfirmed=2.2; ' + NO_SIGMA_LEVEL),
  C(TRANSIENT, R7, 'B4-CygX1', 'Cyg X-1', 'distance_candidate', '2.22', 'kpc', 'millerjones21', 'observed',
    'printed=d = 2.22 (+0.18/-0.17) kpc; interval_plus=0.18; interval_minus=0.17; sigma_kind=asymmetric; ' + ASYM),
  C(TRANSIENT, R7, 'B4-GRS1915', 'GRS 1915+105', 'orbital_period_candidate', '33.85', 'd', 'steeghs13', 'observed',
    'printed=P = 33.85 +/- 0.16 d; sigma_candidate_unconfirmed=0.16; ' + NO_SIGMA_LEVEL),
  C(TRANSIENT, R7, 'B4-GRS1915', 'GRS 1915+105', 'black_hole_mass_candidate', '10.1', 'Msun', 'steeghs13', 'model-derived',
    'printed=M = 10.1 +/- 0.6 Msun; dynamical mass from a model of the binary; sigma_candidate_unconfirmed=0.6; ' + NO_SIGMA_LEVEL),
  // ======== 第 7 回 B7: MOA-9y-5919
  C(TRANSIENT, R7, 'B7-MOA', 'MOA-9y-5919', 'einstein_crossing_time_candidate', '0.057', 'd', 'koshimoto23', 'observed',
    'printed=t_E = 0.057 +/- 0.016 d; sigma_candidate_unconfirmed=0.016; ' + NO_SIGMA_LEVEL + '; same_value_as=TRN-d488b403'),
  C(TRANSIENT, R7, 'B7-MOA', 'MOA-9y-5919', 'angular_einstein_radius_candidate', '0.90', 'uas', 'koshimoto23', 'observed',
    'printed=theta_E = 0.90 +/- 0.14 micro-arcsec; theta_E is an ANGLE and not the radius of the lens; sigma_candidate_unconfirmed=0.14; ' + NO_SIGMA_LEVEL + '; same_value_as=TRN-e38d64e7'),
  C(TRANSIENT, R7, 'B7-MOA', 'MOA-9y-5919', 'lens_mass_bayesian_candidate', '0.75', 'Mearth', 'koshimoto23', 'model-derived',
    'printed=0.75 (+1.23/-0.46) Earth masses; prior=Mlo 0.33 (the lower mass bound of the prior); interval_plus=1.23; interval_minus=0.46; sigma_kind=asymmetric; ' + ASYM + '; the two priors give two candidate rows that are NOT merged', ' - prior Mlo=0.33'),
  C(TRANSIENT, R7, 'B7-MOA', 'MOA-9y-5919', 'lens_mass_bayesian_candidate', '0.37', 'Mearth', 'koshimoto23', 'model-derived',
    'printed=0.37 (+1.11/-0.27) Earth masses; prior=Mlo 0.0033 (the lower mass bound of the prior); interval_plus=1.11; interval_minus=0.27; sigma_kind=asymmetric; ' + ASYM + '; the two priors give two candidate rows that are NOT merged', ' - prior Mlo=0.0033'),
  // ======== 第 7 回 B8: M31-2014-DS1(刊行版と v1 —— 候補 2 行のまま)
  C(TRANSIENT, R7, 'B8-M31DS1', 'M31-2014-DS1', 'progenitor_log_luminosity_candidate', '', 'log10(Lsun)', 'de26', 'model-derived',
    'value EMPTY because the response quotes a range; range_low=4.97; range_high=5 (log L/Lsun of the progenitor) - NOT averaged; sigma_kind=none'),
  C(TRANSIENT, R7, 'B8-M31DS1', 'M31-2014-DS1', 'progenitor_initial_mass_candidate', '13', 'Msun', 'de26', 'model-derived',
    'printed=initial mass about 13 Msun (published version 2026); the 2024 v1 value (20 Msun) is a separate candidate row and the two are NOT merged; sigma_kind=none'),
  C(TRANSIENT, R7, 'B8-M31DS1', 'M31-2014-DS1', 'progenitor_initial_mass_candidate', '20', 'Msun', 'de24v1', 'model-derived',
    'printed=initial mass about 20 Msun (preprint version 1 of 2024); superseded in the published version by 13 Msun - kept as a separate candidate row (NOT merged); sigma_kind=none'),
  // ======== 第 7 回 B9: VASCO(確認済みの消失数は未確定)
  C(TRANSIENT, R7, 'B9-VASCO', 'VASCO', 'preliminary_candidates_candidate', '150000', 'count', 'villarroel20', 'observed-count',
    'printed=about 150000 preliminary candidates; approximate count; the number of confirmed vanishings is NOT established; sigma_kind=none'),
  C(TRANSIENT, R7, 'B9-VASCO', 'VASCO', 'visually_inspected_candidates_candidate', '23667', 'count', 'villarroel20', 'observed-count',
    'printed=23667 candidates inspected by eye; the number of confirmed vanishings is NOT established; sigma_kind=none'),
  C(TRANSIENT, R7, 'B9-VASCO', 'VASCO', 'red_point_source_candidates_single_epoch_candidate', '100', 'count', 'villarroel20', 'observed-count',
    'printed=about 100 remaining candidates; approximate count; the number of confirmed vanishings is NOT established; same_value_as=TRN-c4a2f815; sigma_kind=none'),
  C(TRANSIENT, R7, 'B9-VASCO', 'VASCO', 'transient_candidates_count_candidate', '9', 'count', 'villarroel21', 'observed-count',
    'printed=9 objects as reported in the paper; NOT a count of confirmed vanishings (the number of confirmed vanishings is NOT established); sigma_kind=none'),
  // ======== 第 7 回 B10: AT2023fhn
  C(TRANSIENT, R7, 'B10-AT2023fhn', 'AT2023fhn', 'peak_absolute_magnitude_candidate', '-21.5', 'mag', 'chrimes24', 'observed',
    'printed=peak absolute magnitude -21.5 with no uncertainty printed; band not transcribed in this intake; sigma_kind=none'),
  C(TRANSIENT, R7, 'B10-AT2023fhn', 'AT2023fhn', 'redshift_of_nearest_galaxies_candidate', '0.24', '1', 'chrimes24', 'observed',
    'printed=z ~ 0.24 (approximate); same_value_as=TRN-824359e7; sigma_kind=none'),
  C(TRANSIENT, R7, 'B10-AT2023fhn', 'AT2023fhn', 'projected_offset_from_nearest_galaxies_candidate', '', 'half_light_radii', 'chrimes24', 'lower-limit',
    'value EMPTY because the printed quantity is a lower limit; lower_limit=3.5 (offset larger than 3.5 half-light radii); a large PROJECTED offset is not proof of empty space; sigma_kind=none'),
  // ======== 第 7 回 B5: NGC 3198 のピッチ角(波長ごとに別行 —— 門に使うなら波長宣言が要る)
  C(CLUSTER, R7, 'B5-NGC3198', 'NGC 3198', 'pitch_angle(band=3.6um)_candidate', '15.97', 'deg', 'miller19', 'observed',
    'printed=15.97 +/- 1.38 deg; band=3.6 um; a gate would need a declared waveband (the pitch angle depends on the band); sigma_candidate_unconfirmed=1.38; ' + NO_SIGMA_LEVEL),
  C(CLUSTER, R7, 'B5-NGC3198', 'NGC 3198', 'pitch_angle(band=B)_candidate', '18.95', 'deg', 'miller19', 'observed',
    'printed=18.95 +/- 2.69 deg; band=B; a gate would need a declared waveband (the pitch angle depends on the band); sigma_candidate_unconfirmed=2.69; ' + NO_SIGMA_LEVEL),
  C(CLUSTER, R7, 'B5-NGC3198', 'NGC 3198', 'pitch_angle(band=u)_candidate', '20.46', 'deg', 'miller19', 'observed',
    'printed=20.46 +/- 4.10 deg; band=u; a gate would need a declared waveband (the pitch angle depends on the band); sigma_candidate_unconfirmed=4.10; ' + NO_SIGMA_LEVEL),
  C(CLUSTER, R7, 'B5-NGC3198', 'NGC 3198', 'pitch_angle(band=8um)_candidate', '20.59', 'deg', 'miller19', 'observed',
    'printed=20.59 +/- 5.95 deg; band=8 um; a gate would need a declared waveband (the pitch angle depends on the band); sigma_candidate_unconfirmed=5.95; ' + NO_SIGMA_LEVEL),
  C(CLUSTER, R7, 'B5-NGC3198', 'NGC 3198', 'pitch_angle(band=FUV)_candidate', '23.98', 'deg', 'miller19', 'observed',
    'printed=23.98 +/- 1.84 deg; band=FUV; a gate would need a declared waveband (the pitch angle depends on the band); sigma_candidate_unconfirmed=1.84; ' + NO_SIGMA_LEVEL),
  // ======== 第 7 回 B6: 棒の Ω_p(投影量のまま —— rad/s に換算しない)
  C(CLUSTER, R7, 'B6-NGC0036', 'NGC 0036', 'bar_pattern_speed_projected_candidate', '13.2', 'km/s/arcsec', 'aguerri15', 'observed',
    'printed=Omega_b = 13.2 +/- 3.7 km s^-1 arcsec^-1; the lowest of the 4 solutions quoted as 13.2 +/- 3.7 to 19.5 +/- 4.3 (the two intermediate solutions are not in this intake); projected units kept - NOT converted to rad/s (a conversion needs a distance and a declared rule); sigma_candidate_unconfirmed=3.7; ' + NO_SIGMA_LEVEL, ' - lowest of 4 solutions'),
  C(CLUSTER, R7, 'B6-NGC0036', 'NGC 0036', 'bar_pattern_speed_projected_candidate', '19.5', 'km/s/arcsec', 'aguerri15', 'observed',
    'printed=Omega_b = 19.5 +/- 4.3 km s^-1 arcsec^-1; the highest of the 4 solutions quoted as 13.2 +/- 3.7 to 19.5 +/- 4.3 (the two intermediate solutions are not in this intake); projected units kept - NOT converted to rad/s (a conversion needs a distance and a declared rule); sigma_candidate_unconfirmed=4.3; ' + NO_SIGMA_LEVEL, ' - highest of 4 solutions'),
  C(CLUSTER, R7, 'B6-NGC0036', 'NGC 0036', 'corotation_radius_candidate', '16.9', 'arcsec', 'aguerri15', 'model-derived',
    'printed=R_CR = 16.9 arcsec; angular radius kept - NOT converted to a length; which of the 4 solutions it belongs to is not stated in this intake; sigma_kind=none'),
  // ======== 第 7 回 C2: 47 Tuc(記録欄 —— 門ではない)
  C(CLUSTER, R7, 'C2-47Tuc', '47 Tuc', 'distance_candidate', '4.52', 'kpc', 'baumgardt', 'observed',
    'printed=d = 4.52 +/- 0.03 kpc; unit as printed (NOT converted to m); record field - NOT a gate; sigma_candidate_unconfirmed=0.03; ' + NO_SIGMA_LEVEL),
  C(CLUSTER, R7, 'C2-47Tuc', '47 Tuc', 'half_mass_radius_3d_candidate', '6.44', 'pc', 'baumgardt', 'model-derived',
    'printed=r_h,m = 6.44 pc; unit as printed (NOT converted to m); record field - NOT a gate; sigma_kind=none'),
  C(CLUSTER, R7, 'C2-47Tuc', '47 Tuc', 'sigma0_candidate', '11.9', 'km/s', 'baumgardt', 'model-derived',
    'printed=sigma_0 = 11.9 km/s; unit as printed (NOT converted to m/s); record field - NOT a gate; sigma_kind=none'),
  C(CLUSTER, R7, 'C2-47Tuc', '47 Tuc', 'rotation_amplitude_candidate', '5.00', 'km/s', 'baumgardt', 'observed',
    'printed=A_rot = 5.00 +/- 0.32 km/s; unit as printed (NOT converted to m/s); record field - NOT a gate; sigma_candidate_unconfirmed=0.32; ' + NO_SIGMA_LEVEL),
  C(CLUSTER, R7, 'C2-47Tuc', '47 Tuc', 'sigma_r0_candidate', '12.4', 'km/s', 'kamann18', 'model-derived',
    'printed=sigma_r,0 = 12.4 km/s (central radial velocity dispersion); record field - NOT a gate; sigma_kind=none'),
  C(CLUSTER, R7, 'C2-47Tuc', '47 Tuc', 'dynamical_distance_candidate', '4.40', 'kpc', 'kamann18', 'model-derived',
    'printed=d_dyn = 4.40 / 4.50 kpc (two values); this row is the first value; the two values are NOT averaged; record field - NOT a gate; sigma_kind=none', ' - first of 2 values'),
  C(CLUSTER, R7, 'C2-47Tuc', '47 Tuc', 'dynamical_distance_candidate', '4.50', 'kpc', 'kamann18', 'model-derived',
    'printed=d_dyn = 4.40 / 4.50 kpc (two values); this row is the second value; the two values are NOT averaged; record field - NOT a gate; sigma_kind=none', ' - second of 2 values'),
];

/** 回答の要約にあったが**転写しない**項目(未決・数値なし)。docs と QA が同じ表を読む。 */
export const NOT_TRANSCRIBED = [
  { item: 'AB3', what: '土星 C 環内縁 74490 km', why: 'French 1993 Icarus 103 163 の原表に未到達(未決のまま)' },
  { item: 'B2', what: '月の a/P/e の ±1σ', why: '資料に列が無い' },
  { item: 'B1', what: '冥王星の小衛星の P(Showalter & Hamilton 2015 Nature 522 45 Extended Data Table 1)', why: '回答の要約に数値が無い(著者別刷の転写 —— 数値を推測で埋めない)' },
  { item: 'B3', what: 'Cameron 2023 Table 4 / Singha 2026 arXiv:2606.23926 Table 2', why: '回答の要約に数値が無い(Singha 2026 はプレプリント・誌巻頁未確定)' },
  { item: 'B11', what: 'Kramer 2021 PRX 11 041050 Table IV / Meng 2025 A&A 704 A153 Table 1(DDFWHE/DDGR の 2 列)', why: '回答の要約に数値が無い(書誌だけ)' },
];

/** 書誌の点検の結果(第290便g の実測 —— 既存行への混入 0)。 */
export const BIB_CHECKS = [
  { what: 'PSR J1757−1854 の発見論文 = Cameron et al. 2018 MNRAS Letters 475 L57–L61(10.1093/mnrasl/sly003・arXiv:1711.07697)', wrongForm: /475[ ,]*4994|sty113/, files: FILES },
  { what: 'Fonseca, Stairs & Thorsett 2014 の時間解は Table 3(DD / DDGR)', wrongForm: /Fonseca[^,\n]{0,60}2014[^,\n]{0,30}Table 4[^,\n]{0,20}\bDD/, files: [SOLAR] },
  { what: 'Orosz et al. 2011 ApJ 742 84 は Cyg X-1 の論文', wrongForm: /Orosz[^\n]{0,80}(?:GRS 1915|M33 X-7|LMC X-1)/, files: FILES },
  { what: 'De et al. 2026 Science 391 689 は刊行版(DOI 10.1126/science.adt4853)', wrongForm: /De et al\.? 2024 Science/, files: FILES },
];

// ---------------------------------------------------------------- 行の組み立て
const csvField = (s) => {
  const t = String(s === undefined || s === null ? '' : s);
  return /[",\n]/.test(t) ? '"' + t.replace(/"/g, '""') + '"' : t;
};
/** 宣言 1 件 → note(共通注記を器が足す)。 */
export function noteOf(d) {
  return 'intake_row=' + INTAKE_DATE + '; intake_round=confirmation-request-' + d.round
    + ' (response to confirmation request ' + d.round + ' transcribed as a candidate row by ' + 'wave 290g)'
    + '; item=' + d.item + '; kind=' + d.kind + '; ' + d.note
    + '; gate=not-connected (a candidate key - the calibration gate reads orbital_period / eccentricity / periastron_advance only'
    + ' and no declaration in paper/data/judgement-sources.json points at this row)'
    + '; sigma_primary=unverified; verified_by=';
}
/** 宣言 1 件 → record_id を除いた 9 欄。 */
function fieldsOf(d) {
  const [label, url] = B[d.src];
  return { body: d.body, quantity: d.quantity, value: d.value, unit: d.unit,
    source: label + (d.srcSuffix || ''), url, retrieved: INTAKE_DATE, note: noteOf(d), sigma: '' };
}

/** 1 ファイル分の候補行(record_id 込みの CSV テキスト行)を、基点の行の後ろに続けた形で作る。 */
export function buildRows(file, baseRows) {
  const decl = CANDIDATES.filter((d) => d.file === file);
  const fresh = decl.map(fieldsOf);
  const all = baseRows.map((r) => ({ body: r.body, quantity: r.quantity, unit: r.unit, source: r.source }))
    .concat(fresh.map((f) => ({ body: f.body, quantity: f.quantity, unit: f.unit, source: f.source })));
  const { ids } = assignRecordIds(path.basename(file), all);
  const newIds = ids.slice(baseRows.length);
  const lines = fresh.map((f, i) => [f.body, f.quantity, f.value, f.unit, f.source, f.url, f.retrieved,
    f.note, f.sigma, newIds[i], ''].map(csvField).join(','));
  return { decl, fresh, ids: newIds, lines };
}

const sha = (buf) => crypto.createHash('sha256').update(buf).digest('hex');

/** 基点のバイト列を取り出す(先頭 BASE.bytes バイト —— bytes が null のときは BASE.rows 行)。 */
function baseSlice(file, buf) {
  const b = BASE[file];
  if (b.bytes !== null) return buf.subarray(0, b.bytes);
  const s = buf.toString('utf8').split('\n');
  return Buffer.from(s.slice(0, b.rows + 1).join('\n') + '\n', 'utf8');
}

/**
 * 点検(**CSV を書かない**)。`root` の 3 CSV について:
 *   ① 先頭のバイト列が基点のまま(SHA-256 一致 = 既存行 1 字も不変)
 *   ② 末尾が器の作る候補行と**バイトで一致**(冪等 —— もう一度 --write しても 1 バイトも変わらない)
 *   ③ 候補行の約束(量名 `_candidate`・印 unverified・sigma 空欄・kind の語彙・ci90 行・上限/下限行の value 空)
 *   ④ 門に入らない(門の量の集合・宣言の record_id・門の鍵の「最初の行」が基点と同じ・宛先表)
 * @returns {{ok:boolean, violations:string[], files:Object, tally:Object, gate:Object}}
 */
export function checkIntake8(root = ROOT) {
  const violations = [];
  const files = {}, tally = { total: 0, byFile: {}, byKind: {}, byRound: {}, ci90Rows: 0,
    upperLimitRows: 0, lowerLimitRows: 0, emptyValueRows: 0 };
  const gate = { gateQuantities: GATE_QUANTITIES.slice(), candidateKeysInGate: 0,
    declarationsPointing: 0, firstRowChanged: [], wiredBodiesHit: [], calauditReadsOtherFiles: null };
  const declPath = path.join(root, 'paper', 'data', 'judgement-sources.json');
  const declIds = new Set();
  try {
    for (const d of (JSON.parse(fs.readFileSync(declPath, 'utf8')).declarations || []))
      if (d && typeof d.record_id === 'string') declIds.add(d.record_id);
  } catch (e) { violations.push('judgement-sources.json が読めない: ' + String(e).slice(0, 80)); }
  for (const file of FILES) {
    const fp = path.join(root, file);
    const buf = fs.readFileSync(fp);
    const head = baseSlice(file, buf);
    const headOk = sha(head) === BASE[file].sha256;
    if (!headOk) violations.push(`①${file} の先頭(基点 ${BASE[file].rev} の ${BASE[file].rows} 行)が変わっている`);
    // 基点の行(ヘッダ名で読む)
    const baseText = head.toString('utf8');
    const baseLines = baseText.split('\n');
    const H = headerIndex(baseLines[0]);
    const cell = (c, n) => ((n in H) && c[H[n]] !== undefined) ? c[H[n]] : '';
    const baseRows = baseLines.slice(1).filter((l) => l.trim()).map((l) => {
      const c = parseCsvLine(l);
      return { body: cell(c, 'body'), quantity: cell(c, 'quantity'), unit: cell(c, 'unit'),
        source: cell(c, 'source'), recordId: String(cell(c, 'record_id')).trim() };
    });
    const built = buildRows(file, baseRows);
    const expectTail = built.lines.length ? built.lines.join('\n') + '\n' : '';
    const tail = buf.subarray(head.length).toString('utf8');
    const state = (tail === expectTail) ? 'written' : (tail === '' ? 'base-only' : 'mismatch');
    if (state !== 'written')
      violations.push(`②${file} の末尾が器の候補行と一致しない(${state} —— --write を走らせるか、手で触った行を戻す)`);
    files[file] = { baseRows: baseRows.length, candidates: built.lines.length, state,
      headSha256: sha(head), headOk, ids: built.ids };
    tally.byFile[file] = built.lines.length;
    // ③ 約束(実際の CSV をヘッダ名で読み直して見る —— 宣言ではなく実体)
    const L = loadObsCsv(fp);
    const fresh = L.rows.slice(baseRows.length);
    if (fresh.length !== built.lines.length && state === 'written')
      violations.push(`③${file} の候補行の数が ${fresh.length}(宣言 ${built.lines.length})`);
    fresh.forEach((r, i) => {
      const at = `${file}:${r.ln}`;
      tally.total++;
      const kind = (/(?:^|[^A-Za-z0-9_])kind=([A-Za-z-]+)/.exec(r.note) || [])[1] || null;
      tally.byKind[kind] = (tally.byKind[kind] || 0) + 1;
      const round = (/intake_round=confirmation-request-(\d+)/.exec(r.note) || [])[1] || null;
      tally.byRound[round] = (tally.byRound[round] || 0) + 1;
      if (!/_candidate$/.test(r.quantity)) violations.push(`③${at} の量名が _candidate で終わらない(${r.quantity})`);
      if (!KINDS.includes(kind)) violations.push(`③${at} の kind が語彙に無い(${kind})`);
      if (readSigmaMark(r.note).mark !== 'unverified') violations.push(`③${at} の印が unverified でない`);
      if (readVerifiedBy(r.note).present) violations.push(`③${at} に確認者欄が入っている(印は原仮定者の照合だけ)`);
      if (r.rawSigma !== '') violations.push(`③${at} の sigma 列が空でない(${r.rawSigma})`);
      if (r.solutionId !== '') violations.push(`③${at} の solution_id が空でない`);
      if (r.recordId !== built.ids[i]) violations.push(`③${at} の record_id が器の規約と違う`);
      if (/(?:^|[^A-Za-z0-9_])ci90=/.test(r.note)) {
        tally.ci90Rows++;
        if (r.rawSigma !== '') violations.push(`③${at} は ci90 の行なのに sigma が空でない`);
        if (!/sigma_kind=ci90/.test(r.note)) violations.push(`③${at} は ci90 の行なのに sigma_kind=ci90 が無い`);
      }
      if (kind === 'upper-limit' || kind === 'lower-limit') {
        if (kind === 'upper-limit') tally.upperLimitRows++; else tally.lowerLimitRows++;
        if (String(r.rawValue).trim() !== '') violations.push(`③${at} は ${kind} の行なのに value が入っている`);
        if (!/(?:^|[^A-Za-z0-9_])(?:upper|lower)_limit=/.test(r.note)) violations.push(`③${at} に限界値の欄が無い`);
      }
      if (String(r.rawValue).trim() === '') tally.emptyValueRows++;
      if (/(?:^|[^A-Za-z0-9_])interval_plus=/.test(r.note) && r.rawSigma !== '')
        violations.push(`③${at} は非対称区間なのに sigma 列がある(対称化しない)`);
      // 既存行への参照(same_value_as= / same_solution_as=)は**基点の同じ body の行**を指す
      for (const m of r.note.matchAll(/(?:^|[^A-Za-z0-9_])same_(?:value|solution)_as=((?:SOL|CLG|TRN)-[0-9a-f]{8}(?:-\d+)?)/g)) {
        const hit = baseRows.find((b) => b.recordId === m[1]);
        if (!hit) violations.push(`③${at} の参照 ${m[1]} が基点の行に無い`);
        else if (hit.body !== r.body) violations.push(`③${at} の参照 ${m[1]} が別の body(${hit.body})を指している`);
      }
      // ④ 門
      if (GATE_QUANTITIES.includes(r.quantity)) gate.candidateKeysInGate++;
      if (declIds.has(r.recordId)) gate.declarationsPointing++;
    });
    // ④ 門の鍵の「最初の行」が基点と同じ(候補行を足しても、どの鍵の採用行も動かない)
    const firstOf = (rows) => { const m = new Map(); for (const r of rows) { const k = r.body + '|' + r.quantity; if (!m.has(k)) m.set(k, r.recordId); } return m; };
    const before = firstOf(baseRows), after = firstOf(L.rows);
    for (const [k, id] of before) if (after.get(k) !== id) gate.firstRowChanged.push(file + ':' + k);
    if (file === CLUSTER || file === TRANSIENT) {
      const wired = new Set(wiredBodies());
      for (const r of fresh) if (wired.has(r.body)) gate.wiredBodiesHit.push(file + ':' + r.body);
    }
  }
  // 較正の器は太陽系 CSV しか読まない(過渡天体・星団/銀河の CSV を開く行が無い)
  try {
    const src = fs.readFileSync(path.join(root, 'tests', 'exp-w249b-calaudit.mjs'), 'utf8');
    gate.calauditReadsOtherFiles = /transient-observations|cluster-galaxy-observations/.test(src);
    if (gate.calauditReadsOtherFiles) violations.push('④較正の器が過渡天体か星団/銀河の CSV を読んでいる');
  } catch (e) { violations.push('較正の器が読めない'); }
  if (gate.candidateKeysInGate) violations.push(`④候補行の量名が門の量に ${gate.candidateKeysInGate} 行当たる`);
  if (gate.declarationsPointing) violations.push(`④宣言が候補行を ${gate.declarationsPointing} 行指している`);
  if (gate.firstRowChanged.length) violations.push('④門の鍵の最初の行が動いた: ' + gate.firstRowChanged.slice(0, 3).join(' , '));
  if (gate.wiredBodiesHit.length) violations.push('④宛先表の body が記録用 CSV に居る: ' + gate.wiredBodiesHit.join(' , '));
  // 書誌の点検(既存行への混入)
  const bib = BIB_CHECKS.map((c) => {
    const hits = [];
    for (const f of c.files) {
      const lines = fs.readFileSync(path.join(root, f), 'utf8').split('\n');
      lines.forEach((l, i) => { if (c.wrongForm.test(l)) hits.push(f + ':' + (i + 1)); });
    }
    return { what: c.what, hits };
  });
  for (const b of bib) if (b.hits.length) violations.push('書誌の混入: ' + b.what + ' → ' + b.hits.join(','));
  return { ok: violations.length === 0, violations, files, tally, gate, bib,
    declared: CANDIDATES.length, notTranscribed: NOT_TRANSCRIBED.map((x) => x.item) };
}

/** 候補行を足す(**基点のままのファイルにだけ** —— 足し済みなら何もしない)。 */
export function writeIntake8(root = ROOT) {
  const done = [];
  for (const file of FILES) {
    const fp = path.join(root, file);
    const buf = fs.readFileSync(fp);
    const head = baseSlice(file, buf);
    if (sha(head) !== BASE[file].sha256) throw new Error(file + ' の先頭が基点と違う —— 書かない');
    const baseLines = head.toString('utf8').split('\n');
    const H = headerIndex(baseLines[0]);
    const cell = (c, n) => ((n in H) && c[H[n]] !== undefined) ? c[H[n]] : '';
    const baseRows = baseLines.slice(1).filter((l) => l.trim()).map((l) => {
      const c = parseCsvLine(l);
      return { body: cell(c, 'body'), quantity: cell(c, 'quantity'), unit: cell(c, 'unit'), source: cell(c, 'source') };
    });
    const built = buildRows(file, baseRows);
    const expectTail = built.lines.length ? built.lines.join('\n') + '\n' : '';
    const tail = buf.subarray(head.length).toString('utf8');
    if (tail === expectTail) { done.push(file + ': 足し済み(変更なし)'); continue; }
    if (tail !== '') throw new Error(file + ' の末尾に器の知らない行がある —— 書かない');
    fs.writeFileSync(fp, Buffer.concat([head, Buffer.from(expectTail, 'utf8')]));
    done.push(file + ': ' + built.lines.length + ' 行を足した');
  }
  return done;
}

/** docs/CALIBRATION_ISSUES_v1.45.md の節(`tests/exp-w272a-issues.mjs` が呼ぶ —— 数は CSV の実体から数える)。 */
export function intakeSectionMd(root = ROOT) {
  const r = checkIntake8(root);
  const md = [];
  const kinds = Object.entries(r.tally.byKind).sort((a, b) => b[1] - a[1]);
  md.push('## 7. 確認依頼 第 7/8 回の intake(候補行・印なし —— 第290便g)');
  md.push('');
  md.push('確認依頼 第 7 回・第 8 回の回答を **3 つの観測 CSV の末尾に候補行として**転写した(器 `tests/exp-w290g-intake8.mjs`・'
    + 'QA `docs.intake8`)。**既存行は 1 字も書き換えていない**(各ファイルの先頭のバイト列が基点 f03bf5a と SHA-256 で一致)。'
    + '**印 `verified` は 1 行も付けていない** —— 印を上げるのは原仮定者の照合だけである。');
  md.push('');
  md.push('| ファイル | 候補行 |');
  md.push('|---|---:|');
  for (const f of FILES) md.push('| `' + f + '` | ' + (r.tally.byFile[f] || 0) + ' |');
  md.push('| **計** | **' + r.tally.total + '** |');
  md.push('');
  md.push('- kind の内訳: ' + kinds.map(([k, n]) => '`' + k + '` ' + n).join(' / ')
    + '(第 8 回 ' + (r.tally.byRound['8'] || 0) + ' 行・第 7 回 ' + (r.tally.byRound['7'] || 0) + ' 行)。');
  md.push('- **sigma 列は全行空欄**。90% 区間の ' + r.tally.ci90Rows + ' 行は `ci90=` に置いた(σ に換算しない)。'
    + '対称の ± は一次資料の 1σ かどうかを回答の要約から確かめていないので `sigma_candidate_unconfirmed=` に置いた。'
    + '非対称の区間は `interval_plus=` / `interval_minus=` のまま(対称化しない)。2 解・4 解は解ごとに別行(平均しない)。');
  md.push('- 上限の行 ' + r.tally.upperLimitRows + '・下限の行 ' + r.tally.lowerLimitRows + ' は value を空にした(限界値を「値」として読ませない)。');
  md.push('- **門に入らない**: 量名はすべて `_candidate`(門が読む量 ' + r.gate.gateQuantities.map((q) => '`' + q + '`').join('・')
    + ' に当たる行 ' + r.gate.candidateKeysInGate + ')・`paper/data/judgement-sources.json` の宣言が指す行 '
    + r.gate.declarationsPointing + '・門の鍵の「最初の行」が動いた鍵 ' + r.gate.firstRowChanged.length
    + '・較正の器が過渡天体/星団銀河の CSV を読む行 ' + (r.gate.calauditReadsOtherFiles ? 'あり' : '無し') + '。');
  md.push('');
  md.push('**書誌の訂正**(既存行への混入を点検した —— **混入 ' + r.bib.reduce((a, b) => a + b.hits.length, 0) + ' 件**):');
  md.push('');
  for (const b of r.bib) md.push('- ' + b.what + ' —— ' + (b.hits.length ? '混入 ' + b.hits.join(', ') : '既存行に誤った書誌は無い'));
  md.push('');
  md.push('**転写しなかったもの**(未決のまま・数値を推測で埋めない):');
  md.push('');
  for (const x of NOT_TRANSCRIBED) md.push('- ' + x.item + ' ' + x.what + ' —— ' + x.why);
  md.push('');
  md.push('**書かないこと**: 「観測と合った」「較正した」「確認した」「verified にした」。候補行は**記録**であって判定ではない。');
  md.push('');
  return md.join('\n');
}

// ---------------------------------------------------------------- CLI
const isMain = process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;
if (isMain) {
  const args = process.argv.slice(2);
  if (args.includes('--write')) for (const s of writeIntake8()) console.log('[w290g-intake8] ' + s);
  const r = checkIntake8();
  if (args.includes('--json')) console.log(JSON.stringify(r, null, 1));
  else {
    console.log('[w290g-intake8] 候補行 ' + r.tally.total + '(' + FILES.map((f) => path.basename(f) + ' ' + (r.tally.byFile[f] || 0)).join(' / ') + ')'
      + ' / kind ' + JSON.stringify(r.tally.byKind) + ' / 回 ' + JSON.stringify(r.tally.byRound)
      + ' / ci90 ' + r.tally.ci90Rows + ' / 違反 ' + r.violations.length);
    for (const v of r.violations) console.log('  ✗ ' + v);
  }
  process.exit(r.ok ? 0 : 1);
}
