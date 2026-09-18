// 第264便d(第56報 W4・統括の裁定 X5): **観測レコード(2026-09-15 intake)の照合と不足表の会計器**。
//
// 第56報は「追加の観測レコードを提供した」「決断事項: 概ね提案に同意」である。
// 原仮定者が提供した観測レコードは **2 系統**あり、本器はその 2 系統の突き合わせの結果と、
// 転写した結果を `paper/data/solar-observations.csv`(正本)の側から数える。
//
// ■ 本器がしないこと(**測定値も観測値も 1 つも作らない**)
//   ・エンジンを 1 步も走らせない(プリセット・署名・力学・`beta/index.html` には 1 バイトも触らない)。
//   ・σ を作らない・昇格させない。転写した σ は `sigma_primary=unverified` のまま数える。
//   ・「足りないもの」を推測で埋めない —— 記録に無いものは「未取得」と書く。
//
// ■ 何を数えるか
//   ① **2 系統の照合**(body × quantity)。**一致 / 片方のみ / 食い違い**の 3 分類と、
//      出典(URL/DOI)の一致。**どちらが正しいかは決めない**(判定ではない)。
//      照合の結果は転写した行の note に `collate=` / `record_stream=` / `agree=2` として入っており、
//      本器は**正本の CSV からそれを読み直す**(再現に外部ファイルを要らなくするため)。
//      `--rec <path>` を 2 回渡すと、**記録そのもの**からも鍵を数え直して CSV と突き合わせる(任意)。
//   ② **不足表 68 組の 6 分類**。基点は第263便c が出した 68 組
//      (`docs/CALIBRATION_VERDICT_v1.44.md` §5.8.7・§2.3′ の数)で、**この 68 行は宣言表として
//      本器に凍結してある** —— 後の便で不足表が縮んでも「68 組に対して何が埋まったか」を
//      数え続けられるようにするためである。
//      分類は 6 つ: **埋まった(σ なし)/ σ つきで埋まった / 定義違い / 定義不能 / 代替 / 未取得**。
//   ③ **転写の内訳**(σ つき何行・σ なし何行・候補行・派生行・タグ別)。
//
// ■ **書かないこと**
//   「太陽系の σ が揃った」「spread/digits を σ として判定した」「太陽系の現実較正が進んだ」
//   「不足が埋まったので判定が増えた」(**接続は動いても判定は動かない** —— 入った σ は
//   `sigma_primary=unverified` であって門を通らない)。
//
// 実行: node tests/exp-w264d-intakeA.mjs [--rec <記録1> --rec <記録2>]
// 出力: tests/out/intakeA-w264d.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readSigmaMark, readSigmaKind, readVerifiedBy } from './lib-w264d-sigmamark.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'tests', 'out', 'intakeA-w264d.json');
const argv = process.argv.slice(2);
const RECS = argv.reduce((a, v, i) => (argv[i - 1] === '--rec' ? a.concat([v]) : a), []);
const INTAKE = '2026-09-15';

// 第270便b(第60報 W2・AE2): **列位置でなくヘッダ名で読む**(`record_id` の列追加で壊れない)。
import { parseCsvLine, headerIndex } from './lib-w270b-obscsv.mjs';
function loadCsv(file, cutAtProse) {
  const rows = [];
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  const H = headerIndex(lines[0] || '');
  const cell = (c, n) => ((n in H) && c[H[n]] !== undefined) ? c[H[n]] : '';
  // 記録の側は CSV の後ろに散文が続くことがある。**最初の空行/見出し/箇条書きで切る**
  // (散文を行として読まない —— 読むと鍵の数が水増しされる)。正本の CSV には掛けない。
  let cut = lines.length;
  if (cutAtProse) for (let i = 1; i < lines.length; i++) {
    const t = lines[i].trimStart();
    if (t === '' || t.startsWith('#') || t.startsWith('- ')) { cut = i; break; }
  }
  for (const line of lines.slice(0, cut)) {
    if (!line.trim() || line.startsWith('body,')) continue;
    const c = parseCsvLine(line);
    if (c.length < 9) continue;
    const sgRaw = String(cell(c, 'sigma')).trim();
    const sg = sgRaw !== '' ? Number(sgRaw) : null;
    const v = cell(c, 'value');
    rows.push({ body: cell(c, 'body'), quantity: cell(c, 'quantity'), valueRaw: v,
      unit: cell(c, 'unit'), source: cell(c, 'source'), url: cell(c, 'url'),
      retrieved: cell(c, 'retrieved'), note: cell(c, 'note') || '',
      recordId: String(cell(c, 'record_id')).trim() || null,
      sigma: (Number.isFinite(sg) && sg > 0) ? sg : null,
      hasValue: String(v).trim() !== '' });
  }
  return rows;
}
const CSV = loadCsv(path.join(ROOT, 'paper', 'data', 'solar-observations.csv'));
const tag = (note, key) => {
  const m = new RegExp('(?:^|[^A-Za-z0-9_])' + key + '=([^;]*)').exec(note || '');
  return m ? m[1].trim() : null;
};
const has = (note, key) => new RegExp('(?:^|[^A-Za-z0-9_])' + key + '=').test(note || '');
const INTAKE_ROWS = CSV.filter((r) => new RegExp('intake_row=' + INTAKE).test(r.note));

// ---------------------------------------------------------------- ① 2 系統の照合
// 転写した行の note が `collate=<分類>` と `record_stream=<1|2|1+2>` を持っている。
// **鍵(body|量)ごとに 1 つの分類**なので、鍵で畳んで数える。
// 3 分類への畳み込みは**宣言**である(下の表以外の分類名は現れない)。
const THREE = { agree: '一致', 'agree-rounding': '一致', 'agree-multi': '一致',
  'agree-both-empty': '一致', partial: '食い違い', conflict: '食い違い',
  'conflict-one-empty': '食い違い', 'only-1': '片方のみ', 'only-2': '片方のみ' };
// 分類の意味(**宣言**):
//   agree              … 値も桁も同じ
//   agree-rounding     … **同じ一次資料**の換算で桁だけが違う(相対差 ≤1e-5・別の一次資料どうしは含めない)
//   agree-multi        … 同じ複数の値を両系統が同じだけ挙げている
//   agree-both-empty   … 両系統とも「値は公表されていない」と書いている(定義不能・未公表)
//   partial            … 片方が余分な版を持つ(共通の値もある)
//   conflict           … 共通の値が無い(別の一次資料を採っている)
//   conflict-one-empty … 片方は値を出し、片方は「無い」と書いている
//   only-1 / only-2    … 片方の系統にしかその鍵が無い
const collateKeys = new Map();
for (const r of INTAKE_ROWS) {
  const cls = tag(r.note, 'collate');
  if (!cls) continue;                       // 派生行は照合の対象ではない
  const base = tag(r.note, 'candidate_for') || (r.body + '|' + r.quantity);
  const e = collateKeys.get(base) || { key: base, body: r.body, cls, rows: 0,
    streams: new Set(), values: [], sigmaRows: 0 };
  e.rows++;
  if (r.sigma !== null) e.sigmaRows++;
  const st = tag(r.note, 'record_stream');
  if (st) for (const s of st.split('+')) e.streams.add(s.trim());
  e.values.push(r.valueRaw);
  collateKeys.set(base, e);
}
const collate = [...collateKeys.values()].map((e) => ({ key: e.key, body: e.body, cls: e.cls,
  three: THREE[e.cls] || '?', rows: e.rows, sigmaRows: e.sigmaRows,
  streams: [...e.streams].sort(), values: e.values }));
const collateTally = {}, threeTally = {};
for (const c of collate) {
  collateTally[c.cls] = (collateTally[c.cls] || 0) + 1;
  threeTally[c.three] = (threeTally[c.three] || 0) + 1;
}

// **記録そのものからの数え直し**(任意 — `--rec` を 2 回渡したときだけ)
let recheck = { on: false,
  note: '`--rec <記録1> --rec <記録2>` を渡すと、記録の側からも鍵を数えて CSV と突き合わせる。'
    + '既定は**正本の CSV だけ**を読む(再現に外部ファイルを要らなくするため)。' };
if (RECS.length === 2) {
  const QALIAS = { radius_km: 'radius', semi_major_axis_km: 'semi_major_axis' };
  const keys = new Map();
  RECS.forEach((p, i) => {
    for (const r of loadCsv(p, true)) {
      const k = r.body + '|' + (QALIAS[r.quantity] || r.quantity);
      const e = keys.get(k) || { s1: 0, s2: 0 };
      e[i === 0 ? 's1' : 's2']++;
      keys.set(k, e);
    }
  });
  const inCsv = new Set(collate.map((c) => c.key));
  recheck = { on: true, recordKeys: keys.size, csvKeys: inCsv.size,
    missingInCsv: [...keys.keys()].filter((k) => !inCsv.has(k)),
    extraInCsv: [...inCsv].filter((k) => !keys.has(k)),
    both: [...keys.values()].filter((e) => e.s1 && e.s2).length,
    only1: [...keys.values()].filter((e) => e.s1 && !e.s2).length,
    only2: [...keys.values()].filter((e) => !e.s1 && e.s2).length };
}

// ---------------------------------------------------------------- ② 不足表 68 組
// **第263便c が出した 68 組の凍結写し**(key, cut, kind, target, presets, nQuantities, obsPresent)。
// `tests/out/obsintake-w263c.json` の `missingA.rows` をそのまま写した宣言表である。
const MISSING68 = [
  ['月|orbital_period', 'csv-body-missing', 'period', '月', '🌙🌘🧲🔆', 6, 6],
  ['月|periastron_advance', 'csv-body-missing', 'precession', '月', '🌙🌘🧲🔆', 5, 3],
  ['月|eccentricity', 'csv-body-missing', 'ecc', '月', '🌙🌘🧲🔆', 4, 2],
  ['水星|orbital_period', 'csv-body-missing', 'period', '水星', '☄️🪨🌞', 3, 2],
  ['水星|periastron_advance', 'csv-body-missing', 'precession', '水星', '☄️🪨🌞', 3, 2],
  ['水星|eccentricity', 'csv-body-missing', 'ecc', '水星', '☄️🪨🌞', 3, 0],
  ['イオ|orbital_period', 'csv-body-missing', 'period', 'イオ', '🟠', 3, 2],
  ['エウロパ|orbital_period', 'csv-body-missing', 'period', 'エウロパ', '🟠', 2, 2],
  ['ガニメデ|orbital_period', 'csv-body-missing', 'period', 'ガニメデ', '🟠', 2, 2],
  ['カリスト|orbital_period', 'csv-body-missing', 'period', 'カリスト', '🟠', 2, 2],
  ['D68|orbital_period', 'csv-body-missing', 'period', 'D68', '📡', 2, 2],
  ['C環内縁|orbital_period', 'csv-body-missing', 'period', 'C環内縁', '💍💿', 2, 1],
  ['タイタン|orbital_period', 'csv-body-missing', 'period', 'タイタン', '💍💿', 2, 1],
  ['C環内縁|eccentricity', 'csv-body-missing', 'ecc', 'C環内縁', '💍💿', 2, 0],
  ['C環内縁|periastron_advance', 'csv-body-missing', 'precession', 'C環内縁', '💍💿', 2, 1],
  ['ミマス|orbital_period', 'csv-body-missing', 'period', 'ミマス', '💍💿', 2, 0],
  ['ミマス|eccentricity', 'csv-body-missing', 'ecc', 'ミマス', '💍💿', 2, 0],
  ['ミマス|periastron_advance', 'csv-body-missing', 'precession', 'ミマス', '💍💿', 2, 0],
  ['タイタン|eccentricity', 'csv-body-missing', 'ecc', 'タイタン', '💍💿', 2, 0],
  ['タイタン|periastron_advance', 'csv-body-missing', 'precession', 'タイタン', '💍💿', 2, 0],
  ['地球|orbital_period', 'csv-body-missing', 'period', '地球', '🌞', 1, 1],
  ['地球|eccentricity', 'csv-body-missing', 'ecc', '地球', '🌞', 1, 0],
  ['地球|periastron_advance', 'csv-body-missing', 'precession', '地球', '🌞', 1, 0],
  ['イオ|eccentricity', 'csv-body-missing', 'ecc', 'イオ', '🟠', 1, 0],
  ['イオ|periastron_advance', 'csv-body-missing', 'precession', 'イオ', '🟠', 1, 0],
  ['エウロパ|eccentricity', 'csv-body-missing', 'ecc', 'エウロパ', '🟠', 1, 0],
  ['エウロパ|periastron_advance', 'csv-body-missing', 'precession', 'エウロパ', '🟠', 1, 0],
  ['ガニメデ|eccentricity', 'csv-body-missing', 'ecc', 'ガニメデ', '🟠', 1, 0],
  ['ガニメデ|periastron_advance', 'csv-body-missing', 'precession', 'ガニメデ', '🟠', 1, 0],
  ['カリスト|eccentricity', 'csv-body-missing', 'ecc', 'カリスト', '🟠', 1, 0],
  ['カリスト|periastron_advance', 'csv-body-missing', 'precession', 'カリスト', '🟠', 1, 0],
  ['D68|periastron_advance', 'csv-body-missing', 'precession', 'D68', '📡', 1, 1],
  ['D68|eccentricity', 'csv-body-missing', 'ecc', 'D68', '📡', 1, 0],
  ['Venus|periastron_advance', 'csv-quantity-missing', 'precession', '金星', '🌞🌇', 2, 0],
  ['Mars|orbital_period', 'csv-quantity-missing', 'period', '火星', '🌞', 1, 1],
  ['Mars|eccentricity', 'csv-quantity-missing', 'ecc', '火星', '🌞', 1, 0],
  ['Mars|periastron_advance', 'csv-quantity-missing', 'precession', '火星', '🌞', 1, 0],
  ['Phobos|periastron_advance', 'csv-quantity-missing', 'precession', 'フォボス', '🥔', 1, 0],
  ['Deimos|periastron_advance', 'csv-quantity-missing', 'precession', 'ダイモス', '🥔', 1, 0],
  ['Charon|periastron_advance', 'csv-quantity-missing', 'precession', 'カロン', '❄️', 1, 0],
  ['Miranda|periastron_advance', 'csv-quantity-missing', 'precession', 'ミランダ', '💠', 1, 0],
  ['Ariel|periastron_advance', 'csv-quantity-missing', 'precession', 'アリエル', '💠', 1, 0],
  ['Umbriel|periastron_advance', 'csv-quantity-missing', 'precession', 'ウンブリエル', '💠', 1, 0],
  ['Titania|periastron_advance', 'csv-quantity-missing', 'precession', 'チタニア', '💠', 1, 0],
  ['Oberon|periastron_advance', 'csv-quantity-missing', 'precession', 'オベロン', '💠', 1, 0],
  ['Triton|periastron_advance', 'csv-quantity-missing', 'precession', 'トリトン', '🌊', 1, 0],
  ['Venus|orbital_period', 'csv-sigma-empty', 'period', '金星', '🌞🌇', 4, 3],
  ['Charon|orbital_period', 'csv-sigma-empty', 'period', 'カロン', '❄️', 3, 3],
  ['Triton|orbital_period', 'csv-sigma-empty', 'period', 'トリトン', '🌊', 3, 2],
  ['Venus|eccentricity', 'csv-sigma-empty', 'ecc', '金星', '🌞🌇', 2, 0],
  ['Phobos|orbital_period', 'csv-sigma-empty', 'period', 'フォボス', '🥔', 2, 1],
  ['Deimos|orbital_period', 'csv-sigma-empty', 'period', 'ダイモス', '🥔', 2, 1],
  ['Miranda|orbital_period', 'csv-sigma-empty', 'period', 'ミランダ', '💠', 2, 1],
  ['Phobos|eccentricity', 'csv-sigma-empty', 'ecc', 'フォボス', '🥔', 1, 0],
  ['Deimos|eccentricity', 'csv-sigma-empty', 'ecc', 'ダイモス', '🥔', 1, 0],
  ['Charon|eccentricity', 'csv-sigma-empty', 'ecc', 'カロン', '❄️', 1, 0],
  ['Ariel|orbital_period', 'csv-sigma-empty', 'period', 'アリエル', '💠', 1, 1],
  ['Umbriel|orbital_period', 'csv-sigma-empty', 'period', 'ウンブリエル', '💠', 1, 1],
  ['Titania|orbital_period', 'csv-sigma-empty', 'period', 'チタニア', '💠', 1, 1],
  ['Oberon|orbital_period', 'csv-sigma-empty', 'period', 'オベロン', '💠', 1, 1],
  ['Miranda|rotation_period', 'csv-sigma-empty', 'spin', 'ミランダ', '💠', 1, 1],
  ['Miranda|eccentricity', 'csv-sigma-empty', 'ecc', 'ミランダ', '💠', 1, 0],
  ['Ariel|eccentricity', 'csv-sigma-empty', 'ecc', 'アリエル', '💠', 1, 0],
  ['Umbriel|eccentricity', 'csv-sigma-empty', 'ecc', 'ウンブリエル', '💠', 1, 0],
  ['Titania|eccentricity', 'csv-sigma-empty', 'ecc', 'チタニア', '💠', 1, 0],
  ['Oberon|eccentricity', 'csv-sigma-empty', 'ecc', 'オベロン', '💠', 1, 0],
  ['Triton|rotation_period', 'csv-sigma-empty', 'spin', 'トリトン', '🌊', 1, 0],
  ['Triton|eccentricity', 'csv-sigma-empty', 'ecc', 'トリトン', '🌊', 1, 0],
];
// 第263便c の不足表は日本語の target 名で立っている行がある(CSV に天体の行が無かったため)。
// **宣言表**(推測ではない): 日本語 target → CSV の body 名。
const JA_BODY = { 月: 'Moon', 地球: 'Earth', 水星: 'Mercury', イオ: 'Io', エウロパ: 'Europa',
  ガニメデ: 'Ganymede', カリスト: 'Callisto', ミマス: 'Mimas', タイタン: 'Titan',
  D68: 'Saturn ring feature D68', C環内縁: 'Saturn ring C inner edge' };
// 「定義違い」として扱う量名(**宣言** — 判定量と同じ測定量ではない)
const DEF_DIFF = { precession: ['apsidal_period', 'periastron_advance_with_precession',
  'periastron_advance_derived', 'node_period', 'general_precession'],
  period: ['anomalistic_period', 'mean_motion', 'apsidal_period'],
  ecc: ['radial_amplitude_ae'], spin: [] };

const SIX = ['σ つきで埋まった', '埋まった(σ なし)', '定義違い', '定義不能', '代替', '未取得'];
const missing68 = MISSING68.map(([key, cut, kind, target, presets, nq, obsPresent]) => {
  const [rawBody, quantity] = key.split('|');
  const body = JA_BODY[rawBody] || rawBody;
  const mine = INTAKE_ROWS.filter((r) => r.body === body);
  const direct = mine.filter((r) => r.quantity === quantity || r.quantity === quantity + '_candidate');
  const withVal = direct.filter((r) => r.hasValue);
  const withSigma = withVal.filter((r) => r.sigma !== null);
  const notApplicable = direct.filter((r) => has(r.note, 'not_applicable'));
  const proxy = mine.filter((r) => has(r.note, 'proxy_for') || has(r.note, 'upper_limit'));
  const defDiff = mine.filter((r) => (DEF_DIFF[kind] || []).includes(r.quantity) && r.hasValue);
  let klass;
  if (withSigma.length) klass = 'σ つきで埋まった';
  else if (withVal.length) klass = '埋まった(σ なし)';
  else if (notApplicable.length) klass = '定義不能';
  else if (defDiff.length) klass = '定義違い';
  else if (proxy.length) klass = '代替';
  else klass = '未取得';
  return { key, body, quantity, cutAtW263c: cut, kind, target, presets, nQuantities: nq,
    obsPresent, klass, nRows: direct.length, nWithValue: withVal.length,
    nWithSigma: withSigma.length, nDefDiff: defDiff.length, nProxy: proxy.length,
    nNotApplicable: notApplicable.length,
    sigmaKinds: [...new Set(direct.map((r) => readSigmaKind(r.note).kind).filter(Boolean))],
    infoScale: (() => { for (const r of direct) { const k = readSigmaKind(r.note);
      if (k.scale !== null) return { scale: k.scale, kind: k.scaleKind }; } return null; })(),
    defDiffQuantities: [...new Set(defDiff.map((r) => r.quantity))] };
});
const sixTally = {};
for (const s of SIX) sixTally[s] = 0;
for (const m of missing68) sixTally[m.klass]++;
const sixByCut = {};
for (const m of missing68) {
  sixByCut[m.cutAtW263c] = sixByCut[m.cutAtW263c] || {};
  sixByCut[m.cutAtW263c][m.klass] = (sixByCut[m.cutAtW263c][m.klass] || 0) + 1;
}

// ---------------------------------------------------------------- ③ 転写の内訳
const TAGS = ['sigma_kind', 'digits', 'spread', 'not_applicable', 'upper_limit', 'proxy_for',
  'conflict', 'derived_from', 'candidate_for', 'agree', 'rounding_variant', 'sigma_propagated',
  'orig_quantity', 'record_stream'];
const tagTally = {};
for (const t of TAGS) tagTally[t] = INTAKE_ROWS.filter((r) => has(r.note, t)).length;
const derivedRows = INTAKE_ROWS.filter((r) => has(r.note, 'derived_from'));
const sigmaRows = INTAKE_ROWS.filter((r) => r.sigma !== null);
const bodies = [...new Set(INTAKE_ROWS.map((r) => r.body))].sort();
const newBodies = bodies.filter((b) => CSV.filter((r) => r.body === b)
  .every((r) => new RegExp('intake_row=' + INTAKE).test(r.note)));
const transcription = {
  rows: INTAKE_ROWS.length,
  withSigma: sigmaRows.length,
  withoutSigma: INTAKE_ROWS.length - sigmaRows.length,
  candidateRows: INTAKE_ROWS.filter((r) => /_candidate$/.test(r.quantity)).length,
  derivedRows: derivedRows.length,
  emptyValueRows: INTAKE_ROWS.filter((r) => !r.hasValue).length,
  bodies: bodies.length, newBodies,
  sigmaRowList: sigmaRows.map((r) => ({ body: r.body, quantity: r.quantity, value: r.valueRaw,
    unit: r.unit, sigma: r.sigma, source: r.source, url: r.url,
    mark: readSigmaMark(r.note).mark, verifiedBy: readVerifiedBy(r.note).who || null })),
  derivedList: derivedRows.map((r) => ({ body: r.body, quantity: r.quantity, value: r.valueRaw,
    unit: r.unit, sigma: r.sigma, from: tag(r.note, 'derived_from'),
    formula: tag(r.note, 'derived_formula') })),
  tagTally,
  // **σ の印は 1 つも verified になっていない**ことを数で残す
  marks: INTAKE_ROWS.reduce((m, r) => { const k = readSigmaMark(r.note).mark || '(印なし)';
    m[k] = (m[k] || 0) + 1; return m; }, {}),
  verifiedByFilled: INTAKE_ROWS.filter((r) => readVerifiedBy(r.note).present).length,
};

// ---------------------------------------------------------------- 出力
const out = {
  when: new Date().toISOString(),
  wave: '第264便d(第56報 W4)',
  intake: { date: INTAKE, streams: 2,
    provenance: '原仮定者が提供した観測レコード(2026-09-15 intake)。一次資料は各行の source/url にある。',
    rule: ['既存の行の値は 1 バイトも置き換えない(既存の鍵は `<量>_candidate` の候補行で併置する)',
      'sigma 列に入れるのは**一次資料に印字された 1σ** だけ(単位換算は可・伝播した σ は note へ)',
      '`sigma_primary=unverified; intake 2026-09-15`(原仮定者が一次資料を確認したら verified へ)',
      '定義の違う量は量名を変える(`apsidal_period` / `anomalistic_period` / '
      + '`periastron_advance_with_precession` / `mean_motion`)',
      '判定量への換算は `derived_from=` と換算式つきの**派生行**でだけ行い、量名も別にする'
      + '(`periastron_advance_derived` —— **門に入る量名にはしない**)',
      'プリセット・builder・本体 JSON は変えない(署名不変)'] },
  collate: { keys: collate.length, tally: collateTally, three: threeTally, rows: collate },
  recheck,
  missing68: { base: 68, sixClasses: SIX, tally: sixTally, byCut: sixByCut, rows: missing68 },
  transcription,
  doNotWrite: ['太陽系の σ が揃った', 'spread/digits を σ として判定した',
    '太陽系の現実較正が進んだ(接続は動いても判定は動かない)',
    '不足が埋まったので判定が増えた', '観測レコードで判定が出た(σ は unverified のままである)'],
};
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));

const pad = (s, n) => String(s) + ' '.repeat(Math.max(0, n - String(s).length));
console.log('[w264d] 観測レコード(2026-09-15 intake・2 系統)の照合と不足表');
console.log('  ① 照合: 鍵 ' + collate.length + ' 組 → ' + JSON.stringify(threeTally));
console.log('     内訳: ' + JSON.stringify(collateTally));
if (recheck.on) console.log('     記録の側の鍵 ' + recheck.recordKeys + '(CSV 側 ' + recheck.csvKeys
  + ' / CSV に無い ' + recheck.missingInCsv.length + ' / 記録に無い ' + recheck.extraInCsv.length + ')');
console.log('  ② 不足表 68 組の 6 分類: ' + SIX.map((s) => s + ' ' + sixTally[s]).join(' / '));
for (const cut of Object.keys(sixByCut))
  console.log('     ' + pad(cut, 22) + ' ' + JSON.stringify(sixByCut[cut]));
console.log('  ③ 転写: ' + transcription.rows + ' 行(σ つき ' + transcription.withSigma
  + ' / σ なし ' + transcription.withoutSigma + ' / 候補行 ' + transcription.candidateRows
  + ' / 派生行 ' + transcription.derivedRows + ' / 値が空の行 ' + transcription.emptyValueRows + ')');
console.log('     印: ' + JSON.stringify(transcription.marks)
  + ' / verified_by が埋まっている行 ' + transcription.verifiedByFilled);
console.log('     一次資料の 1σ を持つ行:');
for (const r of transcription.sigmaRowList)
  console.log('       ' + pad(r.body + '|' + r.quantity, 46) + ' ' + pad(r.value, 26) + ' ± ' + r.sigma + ' ' + r.unit);
console.log('→ ' + path.relative(ROOT, OUT));
