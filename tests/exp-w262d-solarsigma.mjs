// 第262便d(第54報 W4・統括の読み (A)・統括が設定した検証仮説 (10)):
//   **太陽系 16 本の σ 接続**。第54報「太陽系、恒星連星、中性子星連星の現実較正を完了する」に対して、
//   太陽系が「保留」である理由は `docs/CALIBRATION_VERDICT_v1.44.md` §2.3 に **16 本とも「σ 未接続」**と
//   書かれているだけで、**どこで切れているのかが書かれていなかった**。本器はその切断点を 3 つに分けて
//   数え、**繋いだうえで** 16 本 × 量の 3σ 判定を出す。
//
// ■ 切断点は 3 つある(**どれか 1 つでも欠けたら σ は門に届かない**)
//   (C) **対応表**: `tests/exp-w249b-calaudit.mjs` の `SIGMA_BODY`(preset → CSV の body 名)に
//       太陽系の行が **1 本も無かった**。→ 本便で `SIGMA_TARGET_BODY`(target ごとの宣言表)を足した。
//   (B) **CSV の sigma 列**: `paper/data/solar-observations.csv` の sigma 列は
//       **太陽系の行では全部空欄**である(21 個ある σ は恒星連星と NS 連星の行だけ)。
//   (A) **CSV の行そのもの**: 月・水星・木星ガリレオ衛星・土星環/D68 は **body の行が無い**。
//
// ■ 本器がしないこと(**測定値を作らない**)
//   ・エンジンを走らせない。測定値は `tests/out/calaudit-w249.json`(第249便b の走行)をそのまま読む。
//   ・**観測値も σ も 1 つも手で打たない**(CSV と calaudit JSON だけが入力である)。
//   ・**σ の無い量に σ を代入しない**(±1% の目安を σ に昇格させない)。
//   ・**署名・力学・プリセットには 1 バイトも触らない**。
//
// 実行: node tests/exp-w262d-solarsigma.mjs [--json <calaudit の出力>]
// 出力: tests/out/solarsigma-w262d.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const CAL = (() => { const i = argv.indexOf('--json'); return (i >= 0 && argv[i + 1]) ? argv[i + 1]
  : path.join(ROOT, 'tests', 'out', 'calaudit-w249.json'); })();
const OUT = path.join(ROOT, 'tests', 'out', 'solarsigma-w262d.json');

// ---------------------------------------------------------------- CSV(**正本**)
function parseCsvLine(line) {
  const cols = []; let cur = '', inQ = false;
  for (const ch of line) {
    if (inQ) { if (ch === '"') inQ = false; else cur += ch; }
    else if (ch === '"') inQ = true;
    else if (ch === ',') { cols.push(cur); cur = ''; }
    else cur += ch;
  }
  cols.push(cur);
  return cols;
}
function loadCsv() {
  const txt = fs.readFileSync(path.join(ROOT, 'paper', 'data', 'solar-observations.csv'), 'utf8');
  const rows = new Map();   // "body|quantity" → row(**最初の行**を採る — calaudit と同じ規約)
  const bodies = new Set();
  for (const line of txt.split('\n')) {
    if (!line.trim() || line.startsWith('body,')) continue;
    const c = parseCsvLine(line);
    bodies.add(c[0]);
    const key = c[0] + '|' + c[1];
    if (rows.has(key)) continue;
    const sg = (c[8] !== undefined && c[8].trim() !== '') ? Number(c[8]) : null;
    rows.set(key, { body: c[0], quantity: c[1], value: Number(c[2]), unit: c[3], source: c[4],
      sigma: (Number.isFinite(sg) && sg > 0) ? sg : null,
      primaryVerified: /sigma_primary=verified/.test(c[7] || '') });
  }
  return { rows, bodies };
}

// ---------------------------------------------------------------- 宣言表(自動判定ではない)
// 太陽系 16 本(`docs/CALIBRATION_VERDICT_v1.44.md` §2.3 の並びのまま)
const SOLAR = [
  ['earthMoonReal', '🌙'], ['earthMoonRealKF1', '🌘'], ['emAuditDFM', '🧲'], ['emAuditSolar', '🔆'],
  ['mercuryReal', '☄️'], ['mercuryRealKF1', '🪨'], ['solarInner', '🌞'], ['jupiterGalilean', '🟠'],
  ['venusReal', '🌇'], ['marsMoonsReal', '🥔'], ['plutoCharonReal', '❄️'], ['uranusReal', '💠'],
  ['neptuneReal', '🌊'], ['saturnZonalD68', '📡'], ['saturnRingReal', '💍'], ['saturnRingRealKF1', '💿'],
];
// **target ラベル → CSV の body 名**。宣言であって推測ではない(CSV に無い対象は null を明示する)。
// null は「CSV にその天体の行が無い」= 切断点 (A) である。
const TARGET_BODY = {
  月: null, 地球: null,                       // CSV に Moon / Earth の行が無い
  水星: null,                                 // CSV に Mercury の行が無い
  金星: 'Venus', 火星: 'Mars',
  フォボス: 'Phobos', ダイモス: 'Deimos',
  カロン: 'Charon',
  ミランダ: 'Miranda', アリエル: 'Ariel', ウンブリエル: 'Umbriel', チタニア: 'Titania', オベロン: 'Oberon',
  トリトン: 'Triton',
  イオ: null, エウロパ: null, ガニメデ: null, カリスト: null,   // CSV に木星衛星の行が無い
  D68: null, C環内縁: null, ミマス: null, タイタン: null,        // CSV に土星系の行が無い
};
const KIND_QUANT = { period: 'orbital_period', ecc: 'eccentricity', precession: 'periastron_advance',
  spin: 'rotation_period' };
// 判定量の単位 → CSV の単位(換算しないで済む組み合わせだけを通す。換算は**宣言**である)
const UNIT_OK = { period: (u) => u === 's', ecc: (u) => u === '1', spin: (u) => u === 's',
  precession: (u) => u === 'deg/yr' };

const GATE = { nSigma: 3, numBudget: 0.3 };   // 3σ の門(第249便b と同じ宣言)

// ---------------------------------------------------------------- 本体
const csv = loadCsv();
const cal = JSON.parse(fs.readFileSync(CAL, 'utf8'));
const byId = new Map(cal.presets.map((p) => [p.id, p]));

const rows = [];
const presets = [];
for (const [id, emoji] of SOLAR) {
  const p = byId.get(id);
  if (!p) { presets.push({ id, emoji, missing: true }); continue; }
  const qrows = [];
  for (const q of (p.quantities || [])) {
    const kind = q.kind || 'other';
    const target = q.target;
    const declared = Object.prototype.hasOwnProperty.call(TARGET_BODY, target);
    const body = declared ? TARGET_BODY[target] : null;
    const quant = KIND_QUANT[kind] || null;
    const csvRow = (body && quant) ? (csv.rows.get(body + '|' + quant) || null) : null;
    const condMismatch = !!(q.gate && q.gate.status === 'condition-mismatch');
    // 切断点の分類(**どこで切れているか**を 1 つだけ返す — 上から順に見る)
    let cut = null;
    if (kind === 'other' || !quant) cut = 'kind-not-gated';           // 門に入らない欄(来歴の記録)
    else if (!declared) cut = 'target-not-declared';                  // (C) 対応表に target の宣言が無い
    else if (body === null) cut = 'csv-body-missing';                 // (A) CSV にその天体の行が無い
    else if (!csvRow) cut = 'csv-quantity-missing';                   // (A') 天体はあるが量の行が無い
    else if (csvRow.sigma === null) cut = 'csv-sigma-empty';          // (B) 行はあるが sigma 列が空
    else if (!UNIT_OK[kind] || !UNIT_OK[kind](csvRow.unit)) cut = 'unit-not-convertible';
    else cut = null;                                                  // σ が門へ届く
    // σ 以前に**観測参照 obs が無い**量(σ を繋いでも比べる相手がいない)
    const obsMissing = !(typeof q.obs === 'number' && Number.isFinite(q.obs));
    const measMissing = !(typeof q.meas === 'number' && Number.isFinite(q.meas));
    const sigma = (cut === null) ? csvRow.sigma : null;
    let verdict = null, resid = null, nSig = null, numOk = null;
    if (condMismatch) verdict = '条件不一致(対照の走行が別)';
    else if (cut !== null) verdict = (cut === 'kind-not-gated') ? '門外(来歴の欄)' : '保留(σ 未登録)';
    else if (obsMissing || measMissing) verdict = '保留(観測参照または実測が無い)';
    else {
      resid = Math.abs(q.meas - q.obs);
      nSig = resid / sigma;
      const numBound = (q.gate && Number.isFinite(q.gate.numBound)) ? q.gate.numBound : null;
      numOk = (numBound === null) ? null : (numBound <= GATE.numBudget * sigma);
      verdict = (numOk !== true) ? '保留(数値精度 ε_num > 0.3σ)'
        : (resid <= GATE.nSigma * sigma + numBound) ? '合(3σ)' : '否(3σ)';
    }
    qrows.push({ id, emoji, name: q.name, kind, target, unit: q.unit,
      obs: (typeof q.obs === 'number') ? q.obs : null, meas: q.meas, sigmaCard: q.obsErr || null,
      csvBody: body, csvQuantity: quant,
      csvRow: csvRow ? { value: csvRow.value, unit: csvRow.unit, sigma: csvRow.sigma,
        primaryVerified: csvRow.primaryVerified } : null,
      cut, condMismatch, sigma, residual: resid, nSigma: nSig, numOk,
      gateStatusBefore: q.gate ? q.gate.status : null, verdict });
  }
  rows.push(...qrows);
  // 系の 4 値(§1 の定義そのまま — σ を持つ判定量が 1 つも無ければ「保留」)
  const judged = qrows.filter((r) => r.sigma !== null && (r.verdict === '合(3σ)' || r.verdict === '否(3σ)'));
  const pass = judged.filter((r) => r.verdict === '合(3σ)').length;
  const fail = judged.filter((r) => r.verdict === '否(3σ)').length;
  const four = (judged.length === 0) ? '保留'
    : (fail > 0) ? '否' : (pass === qrows.filter((r) => r.cut === null && !r.condMismatch).length) ? '合' : '量限定合';
  presets.push({ id, emoji, nQuantities: qrows.length,
    nGatable: qrows.filter((r) => r.cut !== 'kind-not-gated').length,
    nCondMismatch: qrows.filter((r) => r.condMismatch).length,
    nSigmaConnected: qrows.filter((r) => r.sigma !== null).length,
    cuts: qrows.reduce((m, r) => { m[r.cut || 'connected'] = (m[r.cut || 'connected'] || 0) + 1; return m; }, {}),
    four });
}

const cutTally = rows.reduce((m, r) => { m[r.cut || 'connected'] = (m[r.cut || 'connected'] || 0) + 1; return m; }, {});
const fourTally = presets.reduce((m, p) => { if (p.four) m[p.four] = (m[p.four] || 0) + 1; return m; }, {});
// σ を持つ CSV 行の全数(**太陽系には 1 行も無い**ことを数で残す)
const sigmaRows = [...csv.rows.values()].filter((r) => r.sigma !== null);
const solarBodiesUsed = [...new Set(Object.values(TARGET_BODY).filter(Boolean))];
const solarSigmaRows = sigmaRows.filter((r) => solarBodiesUsed.includes(r.body));

const out = {
  when: new Date().toISOString(),
  wave: '第262便d(第54報 W4)',
  inputs: { calaudit: path.relative(ROOT, CAL), csv: 'paper/data/solar-observations.csv',
    calauditWhen: (cal.meta && cal.meta.when) || null },
  gate: GATE,
  declaration: { targetBody: TARGET_BODY, kindQuantity: KIND_QUANT,
    note: '**宣言表であって自動判定ではない**。CSV に行が無い対象は null を明示する(推測で当てない)' },
  csvSummary: { rows: csv.rows.size, bodies: csv.bodies.size,
    rowsWithSigma: sigmaRows.length,
    sigmaBodies: [...new Set(sigmaRows.map((r) => r.body))],
    solarRowsWithSigma: solarSigmaRows.length,
    finding: solarSigmaRows.length === 0
      ? '**太陽系の body には σ が 1 行も入っていない**(21 個の σ は恒星連星と NS 連星の行だけ)'
      : '太陽系の body に σ がある行が現れた(表を更新すること)' },
  cutTally, fourTally, presets, rows,
  conclusion: {
    connected: cutTally.connected || 0,
    note: (cutTally.connected || 0) === 0
      ? '**対応表を繋いでも 3σ の判定は 1 件も出ない** —— 切断点は対応表ではなく **CSV の sigma 列と行そのもの**である。'
        + 'したがって太陽系 16 本は「保留(σ 未登録)」のままである(**否定ではない**)。'
      : '接続後に判定が出た量がある(表を読むこと)',
    doNotWrite: ['太陽系の現実較正を完了した', 'σ を繋いだので合格した', '保留は否定である',
      '±1% の目安を σ として読んだ'] },
};
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));

const pad = (s, n) => String(s) + ' '.repeat(Math.max(0, n - String(s).length));
console.log('[w262d] 太陽系 16 本の σ 接続 —— 切断点の分解');
console.log('  CSV: ' + csv.rows.size + ' 行 / σ を持つ行 ' + sigmaRows.length
  + ' 行(天体: ' + [...new Set(sigmaRows.map((r) => r.body))].join(', ') + ')');
console.log('  → 太陽系の body で σ を持つ行: ' + solarSigmaRows.length + ' 行');
console.log('  切断点の内訳: ' + JSON.stringify(cutTally));
console.log('  4 値の内訳: ' + JSON.stringify(fourTally));
for (const p of presets) {
  if (p.missing) { console.log('  ' + pad(p.id, 20) + ' (calaudit JSON に無い)'); continue; }
  console.log('  ' + p.emoji + ' ' + pad(p.id, 20) + ' 量 ' + pad(p.nQuantities, 3)
    + ' 門に入りうる ' + pad(p.nGatable, 3) + ' 条件不一致 ' + pad(p.nCondMismatch, 2)
    + ' σ 接続 ' + pad(p.nSigmaConnected, 2) + ' 4 値=' + p.four
    + '  ' + JSON.stringify(p.cuts));
}
console.log('→ ' + path.relative(ROOT, OUT));
