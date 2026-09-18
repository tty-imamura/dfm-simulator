// 第263便c(第55報 W3): **観測レコード(2026-09-14 intake)の会計器**。
//
// 第55報は「引き続き Release を目指す。太陽系、恒星連星、中性子星連星の現実較正を完了する。
// 観測レコードを添えた」である。本器は**転写した結果を数える**だけで、**測定値も観測値も 1 つも作らない**:
//   ・入力は `paper/data/solar-observations.csv`(正本)と、既に出ている結果 JSON
//     (`calaudit-w249.json` / `solarsigma-w262d.json` / `emap-w262c.json`)だけである。
//   ・**エンジンを 1 步も走らせない**(プリセット・署名・力学には 1 バイトも触らない)。
//   ・**σ を作らない・昇格させない**。`sigma_primary=unverified` の σ は unverified のまま数える。
//
// 何を数えるか(**階層別 = 太陽系 / 恒星連星 / NS 連星 / BH 以降**):
//   ① CSV の会計: 行数・鍵数・σ を持つ行・verified/unverified・intake で足した行・候補行・解タグ行。
//   ② 門の会計: `calaudit-w249.json` の `gate.status` を階層別に数える(3σ の合/否/保留の内訳)。
//   ③ **解の選択の感度**: 同一系の複数のタイミング解それぞれに対して、シミュレータの実測が
//      何 σ 離れるかを並べる。**「判定に使う解」を宣言するための材料**であって、判定ではない。
//   ④ **e 写像の再判定**(第262便c の e_r/e_t を、intake の σ で読み直す)。σ の**出所**が変わっても
//      **数が変わらない**ことを数で確かめる(4 値は昇格させない)。
//   ⑤ **判定に足りないもの**(天体 × 量)。太陽系の P/e/ω̇ の観測値と σ は intake に**含まれていない**。
//
// 実行: node tests/exp-w263c-obsintake.mjs
// 出力: tests/out/obsintake-w263c.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
// 第264便d(第56報 W4・統括の裁定 X6): ⑤′ が測って残した印の読み違いを本便で直した。
// 3 器が **同じ 1 本**(tests/lib-w264d-sigmamark.mjs)を読む。
import { readSigmaMark, isSigmaPrimaryVerified,
  legacyIsSigmaPrimaryVerified } from './lib-w264d-sigmamark.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'tests', 'out', 'obsintake-w263c.json');
const rd = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));

// ---------------------------------------------------------------- CSV(正本)
// 第270便b(第60報 W2・AE2): **列位置でなくヘッダ名で読む**(`record_id` の列追加で壊れない)。
import { loadObsCsv as loadObsCsvByHeader } from './lib-w270b-obscsv.mjs';
const CSV_ROWS = [];
{
  const loaded = loadObsCsvByHeader(path.join(ROOT, 'paper', 'data', 'solar-observations.csv'));
  if (loaded.missing.length)
    throw new Error('[w263c] solar-observations.csv に必須列が無い: ' + loaded.missing.join(','));
  for (const r of loaded.rows) {
    const note = r.note || '';
    CSV_ROWS.push({ body: r.body, quantity: r.quantity, value: Number(r.rawValue), raw: r.rawValue,
      unit: r.unit, source: r.source, note, sigma: r.sigma,
      recordId: r.recordId || null, ln: r.ln,
      verified: isSigmaPrimaryVerified(note),
      verifiedLegacy: legacyIsSigmaPrimaryVerified(note),
      intakeRow: /intake_row=2026-09-14/.test(note),
      intakeRow15: /intake_row=2026-09-15/.test(note),
      sigmaAtIntake: /sigma transcribed at the 2026-09-14 intake/.test(note),
      // 第270便c(AD9): 語境界つき —— `adopted_solution=` の部分文字列に当てない(統括の統合で b のヘッダ読みに重ねた)
      solution: (/(?<![A-Za-z0-9_-])solution=([A-Za-z0-9-]+)/.exec(note) || [, null])[1] });
  }
}

// **階層の宣言**(body 名の規約であって推測ではない)
const tierOf = (body) => (/^PSR /.test(body) ? 'NS'
  : (/^(Alpha Centauri|Sirius)/.test(body) ? '恒星'
    : (/^GW/.test(body) ? 'BH 以降' : '太陽系')));
// preset → 階層(`docs/CALIBRATION_VERDICT_v1.44.md` §2 の並びのまま・宣言表)
const PRESET_TIER = {};
for (const id of ['earthMoonReal', 'earthMoonRealKF1', 'emAuditDFM', 'emAuditSolar', 'mercuryReal',
  'mercuryRealKF1', 'solarInner', 'jupiterGalilean', 'venusReal', 'marsMoonsReal', 'plutoCharonReal',
  'uranusReal', 'neptuneReal', 'saturnZonalD68', 'saturnRingReal', 'saturnRingRealKF1']) PRESET_TIER[id] = '太陽系';
for (const id of ['alphaCenAB', 'alphaCenABDFM', 'siriusAB', 'siriusABDFM']) PRESET_TIER[id] = '恒星';
for (const id of ['psrDoubleAB', 'psrDoubleABDFM', 'psrDoubleABSpinCal', 'psrDoubleABPN', 'psrDoubleABCF',
  'psrJ1757DFM', 'psrJ1757PN', 'psrJ1757CF', 'psrJ1946DFM', 'psrJ1946PN', 'psrJ1946CF',
  'psrB1534', 'psrB1534DFM', 'psrB1534CF']) PRESET_TIER[id] = 'NS';
for (const id of ['gw150914', 'gw150914DFM', 'gw150914Merge4s']) PRESET_TIER[id] = 'BH 以降';
const TIERS = ['太陽系', '恒星', 'NS', 'BH 以降'];

// ---------------------------------------------------------------- ① CSV の会計
const csvAudit = {};
for (const t of TIERS) csvAudit[t] = { rows: 0, keys: new Set(), withSigma: 0, verified: 0, unverified: 0,
  intakeRows: 0, sigmaAddedAtIntake: 0, candidateRows: 0, solutionRows: 0, solutions: new Set() };
for (const r of CSV_ROWS) {
  const a = csvAudit[tierOf(r.body)];
  a.rows++; a.keys.add(r.body + '|' + r.quantity);
  if (r.sigma !== null) { a.withSigma++; if (r.verified) a.verified++; else a.unverified++; }
  if (r.intakeRow) a.intakeRows++;
  if (r.sigmaAtIntake) a.sigmaAddedAtIntake++;
  if (/_candidate$/.test(r.quantity)) a.candidateRows++;
  if (r.solution) { a.solutionRows++; a.solutions.add(r.solution); }
}
for (const t of TIERS) { csvAudit[t].keys = csvAudit[t].keys.size; csvAudit[t].solutions = [...csvAudit[t].solutions]; }

// ---------------------------------------------------------------- ② 門の会計(階層別)
const cal = rd('tests/out/calaudit-w249.json');
const gateByTier = {};
for (const t of TIERS) gateByTier[t] = { presets: 0, quantities: 0, status: {}, sigmaFrom: { csv: 0, obsCard: 0, none: 0 },
  sigmaVerified: 0, sigmaUnverified: 0, noSigmaSource: 0 };
const presetsNoSigma = [];
for (const p of (cal.presets || [])) {
  const t = PRESET_TIER[p.id];
  if (!t) continue;
  const g = gateByTier[t];
  g.presets++;
  let anySigma = false;
  for (const q of (p.quantities || [])) {
    g.quantities++;
    const gs = (q.gate || {}).status || 'なし';
    g.status[gs] = (g.status[gs] || 0) + 1;
    const from = (q.gate || {}).sigmaFrom || 'none';
    g.sigmaFrom[from] = (g.sigmaFrom[from] || 0) + 1;
    if (q.sigmaSource) { anySigma = true; if (q.sigmaPrimaryVerified) g.sigmaVerified++; else g.sigmaUnverified++; }
    else if (['period', 'ecc', 'precession'].includes(q.kind)) g.noSigmaSource++;
  }
  if (!anySigma && t !== '太陽系' && t !== 'BH 以降')
    presetsNoSigma.push({ id: p.id, emoji: p.emoji, tier: t,
      why: '**対応表に宛先があっても、この系の走行が σ 転写より前である**(σ を繋ぐには走行が要る)' });
}

// ---------------------------------------------------------------- ③ 解の選択の感度
// CSV の**解タグ行**(note に `solution=`)を系ごとに集め、シミュレータの実測との距離を σ で書く。
// **どの解を採るべきかはここでは決めない**(宣言は CALIBRATION_VERDICT §5.8)。
const SYSTEM_PRESET = {                       // 系 → (判定に使っている preset・宣言)
  'PSR J0737-3039 B': [['psrDoubleAB', '📻'], ['psrDoubleABDFM', '⚡']],
  'PSR B1534+12': [['psrB1534', '📿'], ['psrB1534DFM', '🧶']],
  'PSR J1757-1854': [['psrJ1757DFM', '🧮']],
  'PSR J1946+2052': [['psrJ1946DFM', '🩺']],
};
const QJUDGE = { orbital_period: { kind: 'period', unit: 's' }, eccentricity: { kind: 'ecc', unit: '1' },
  periastron_advance: { kind: 'precession', unit: 'deg/yr' } };
const byId = new Map((cal.presets || []).map((p) => [p.id, p]));
const degRow = new Map(((cal.degYearGate || {}).rows || []).map((r) => [r.id, r]));
const measOf = (id, kind) => {
  const p = byId.get(id); if (!p) return null;
  if (kind === 'precession') { const d = degRow.get(id); return d ? d.measDegPerYr : null; }
  const q = (p.quantities || []).find((z) => z.kind === kind && Number.isFinite(z.meas));
  return q ? q.meas : null;
};
const solutions = [];
for (const [body, presets] of Object.entries(SYSTEM_PRESET)) {
  for (const [q, spec] of Object.entries(QJUDGE)) {
    const rows = CSV_ROWS.filter((r) => r.body === body && r.quantity === q && r.unit === spec.unit);
    if (!rows.length) continue;
    for (const [id, emoji] of presets) {
      const meas = measOf(id, spec.kind);
      solutions.push({ body, quantity: q, unit: spec.unit, preset: id, emoji, meas,
        rows: rows.map((r, i) => ({
          rank: i, adopted: i === 0, solution: r.solution || '(採用レコード・解タグなし)',
          value: r.value, sigma: r.sigma, verified: r.verified, intakeRow: r.intakeRow,
          residual: (meas !== null) ? meas - r.value : null,
          nSigma: (meas !== null && r.sigma) ? Math.abs(meas - r.value) / r.sigma : null })) });
    }
  }
}
// 解どうしの隔たり(**模型を通さない量** — 同じ量を別の解がどれだけ違って言っているか)
const solutionSpread = [];
for (const [body] of Object.entries(SYSTEM_PRESET)) {
  for (const [q, spec] of Object.entries(QJUDGE)) {
    const rows = CSV_ROWS.filter((r) => r.body === body && r.quantity === q && r.unit === spec.unit && r.sigma);
    if (rows.length < 2) continue;
    for (let i = 1; i < rows.length; i++) {
      const d = Math.abs(rows[i].value - rows[0].value);
      solutionSpread.push({ body, quantity: q, a: rows[0].solution || '採用レコード', b: rows[i].solution || '採用レコード(別版)',
        diff: d, sigmaA: rows[0].sigma, sigmaB: rows[i].sigma,
        nSigmaA: rows[0].sigma ? d / rows[0].sigma : null, nSigmaB: rows[i].sigma ? d / rows[i].sigma : null });
    }
  }
}

// ---------------------------------------------------------------- ④ e 写像の再判定
const emap = rd('tests/out/emap-w262c.json');
const eRejudge = (emap.cases || []).map((c) => {
  const obs = c.obs.ecc;
  const cands = CSV_ROWS.filter((r) => r.quantity === 'eccentricity' && r.unit === '1'
    && (r.body === obs.body || r.body === obs.body.replace(/ [AB]$/, ' AB')));
  const withIntake = cands.filter((r) => r.intakeRow);
  return { id: c.id, emoji: c.emoji,
    obsRow: { body: obs.body, value: obs.value, sigma: obs.sigma },
    intakeRows: withIntake.map((r) => ({ body: r.body, value: r.value, sigma: r.sigma,
      solution: r.solution, sameValue: r.value === obs.value, sameSigma: r.sigma === obs.sigma })),
    stages: (c.stages || []).map((s) => {
      const row = { div: s.div, eR: s.eR, eT: s.eT, nSigmaR_current: s.eRnSigma, nSigmaT_current: s.eTnSigma };
      for (const r of withIntake) {
        const tag = r.solution || 'intake';
        row['nSigmaR_' + tag] = r.sigma ? Math.abs(s.eR - r.value) / r.sigma : null;
        row['nSigmaT_' + tag] = r.sigma ? Math.abs(s.eT - r.value) / r.sigma : null;
      }
      return row;
    }),
    note: '**4 値は昇格させない**(第262便c の宣言のまま)。ここで確かめているのは、'
      + 'σ の**出所**が増えたときに **σ の数が動くかどうか**である。' };
});

// ---------------------------------------------------------------- ⑤′ `sigma_primary` の印の読み方
// **実測した欠陥**(直していない — 直し方は統括の裁定事項)。門(calaudit の `sourceVerified`)も
// σ 接続器も、印を `/sigma_primary=verified/` の**部分一致**で読む。ところが第251便c が足した
// 説明文そのものが「sigma_primary=verified means the number is …」という語を含むので、
// **説明文を持つ行は、その行自身の印が unverified でも verified と読まれる**。
// ここでは「何行が該当し、そのうち何行が実際に門へ繋がっているか」を数える(推測ではない)。
const markMismatch = (() => {
  const rows = [];
  for (const r of CSV_ROWS) {
    if (r.sigma === null) continue;
    // **第264便d(X6)で直した**。ここは「旧読み(部分一致)と厳密読みの差」を数え続ける欄になった
    // —— 直したことを数で残すためで、直っていることの確認にもなる(rows が 0 なら旧読みと同じ)。
    const strict = readSigmaMark(r.note);
    if (r.verifiedLegacy && !strict.verified) rows.push({ body: r.body, quantity: r.quantity,
      firstMark: strict.mark, legacyReadAs: 'verified', strictReadAs: strict.mark || '(印なし)',
      legendOccurrences: strict.legend.length, tier: tierOf(r.body) });
  }
  // そのうち、門の σ として実際に使われている宛先はどれか
  const connected = new Set();
  for (const p of (cal.presets || [])) for (const q of (p.quantities || [])) {
    const src = q.sigmaSource || null;
    if (src && (q.gate || {}).sigmaFrom === 'csv') connected.add(src.body + '|' + src.quantity);
  }
  return { n: rows.length, rows: rows.map((z) => Object.assign(z,
    { connectedToGate: connected.has(z.body + '|' + z.quantity) })),
    nConnected: rows.filter((z) => connected.has(z.body + '|' + z.quantity)).length,
    note: '**第264便d(統括の裁定 X6)で直した**。印は `tests/lib-w264d-sigmamark.mjs` の厳密読み'
      + '(語境界 + 第251便c の凡例文〔`sigma_primary=… means …`〕を除外 + 先頭一致)で読む。'
      + 'ここに残るのは「旧読み(部分一致)なら verified と読まれた行」で、**厳密読みでは verified ではない**。',
    doNotWrite: ['この行は verified である', '印を verified へ上げた', '照合が済んだ'] };
})();

// ---------------------------------------------------------------- ⑤ 判定に足りないもの
const ss = rd('tests/out/solarsigma-w262d.json');
const missingA = {
  n: (ss.missingForJudgement || []).length,
  byCut: (ss.missingForJudgement || []).reduce((m, e) => { m[e.cut] = (m[e.cut] || 0) + 1; return m; }, {}),
  rows: ss.missingForJudgement || [],
  finding: '**A(太陽系の P/e/ω̇ の観測値と σ)は 2026-09-14 の観測レコードに含まれていない。** '
    + '入った太陽系の σ は半径・GM・候補行のもので、門が読む量の σ は '
    + (ss.csvSummary ? ss.csvSummary.solarSigmaGated : '—') + ' 件である。'
    + 'したがって太陽系 16 本の 4 値は**保留のまま**である(**否定ではない**)。' };

// ---------------------------------------------------------------- 出力
const out = {
  when: new Date().toISOString(),
  wave: '第263便c(第55報 W3)',
  inputs: { csv: 'paper/data/solar-observations.csv', calaudit: 'tests/out/calaudit-w249.json',
    solarsigma: 'tests/out/solarsigma-w262d.json', emap: 'tests/out/emap-w262c.json',
    calauditRegate: cal.sigmaRegate || null },
  intake: { date: '2026-09-14',
    provenance: '原仮定者が提供した観測レコード(2026-09-14 intake)。一次資料は各行の source/url にある。',
    rule: ['既存の行の値は 1 つも置換しない(候補行・解タグ行で併置する)',
      'σ は sigma_primary=unverified; intake 2026-09-14(原仮定者が一次資料を確認したら verified へ)',
      'プリセット・builder・本体 JSON は変えない(署名不変)',
      '非対称・非 1σ の区間は sigma 列へ入れない(note に sigma_asymmetric= で残す)'],
    csvRows: CSV_ROWS.length,
    addedRows: CSV_ROWS.filter((r) => r.intakeRow).length,
    sigmaAddedToExistingRows: CSV_ROWS.filter((r) => r.sigmaAtIntake).length,
    candidateRows: CSV_ROWS.filter((r) => /_candidate$/.test(r.quantity)).length,
    solutionRows: CSV_ROWS.filter((r) => r.solution).length,
    rowsWithSigma: CSV_ROWS.filter((r) => r.sigma !== null).length,
    sigmaVerified: CSV_ROWS.filter((r) => r.sigma !== null && r.verified).length,
    sigmaUnverified: CSV_ROWS.filter((r) => r.sigma !== null && !r.verified).length },
  csvAudit, gateByTier, presetsNoSigma, solutions, solutionSpread, eRejudge, markMismatch, missingA,
  doNotWrite: ['太陽系・恒星連星・NS 連星の現実較正を完了した',
    '観測レコードで判定が出た(σ は unverified のままである)',
    '解タグ行を採用レコードに置き換えた', 'σ を繋いだので合格した', '保留は否定である'],
};
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));

const pad = (s, n) => String(s) + ' '.repeat(Math.max(0, n - String(s).length));
console.log('[w263c] 観測レコード(2026-09-14 intake)の会計');
console.log('  CSV: ' + out.intake.csvRows + ' 行(intake で足した行 ' + out.intake.addedRows
  + ' / 既存行へ σ を足した ' + out.intake.sigmaAddedToExistingRows + ' / 候補行 ' + out.intake.candidateRows
  + ' / 解タグ行 ' + out.intake.solutionRows + ')');
console.log('  σ を持つ行 ' + out.intake.rowsWithSigma + '(verified ' + out.intake.sigmaVerified
  + ' / unverified ' + out.intake.sigmaUnverified + ')');
for (const t of TIERS) {
  const a = csvAudit[t], g = gateByTier[t];
  console.log('  ' + pad(t, 7) + ' CSV 行 ' + pad(a.rows, 4) + ' σ ' + pad(a.withSigma, 4)
    + '(V ' + pad(a.verified, 3) + '/U ' + pad(a.unverified, 3) + ')'
    + ' intake ' + pad(a.intakeRows, 4) + ' 候補 ' + pad(a.candidateRows, 3) + ' 解タグ ' + pad(a.solutionRows, 4)
    + ' | 門 ' + JSON.stringify(g.status));
}
console.log('  σ の宛先が無い較正系(走行が要る): '
  + (presetsNoSigma.length ? presetsNoSigma.map((p) => p.emoji + p.id).join(' , ') : 'なし'));
console.log('  解の選択の感度(判定量 × 解):');
for (const s of solutions) {
  if (s.meas === null) continue;
  console.log('    ' + s.emoji + ' ' + pad(s.body + '|' + s.quantity, 40)
    + ' 実測 ' + s.meas.toPrecision(10) + ' → '
    + s.rows.map((r) => (r.solution.slice(0, 18)) + ' ' + (r.nSigma === null ? 'σなし' : r.nSigma.toExponential(3) + 'σ')).join(' / '));
}
console.log('  解どうしの隔たり: ' + solutionSpread.map((z) => z.quantity.slice(0, 12) + ' ' + z.a.slice(0, 12)
  + '↔' + z.b.slice(0, 14) + ' ' + (z.nSigmaA === null ? '—' : z.nSigmaA.toExponential(2) + 'σ')).join(' / '));
console.log('  旧読み(部分一致)なら verified・厳密読みでは verified でない行: ' + markMismatch.n
  + ' 行(うち門へ繋がっている ' + markMismatch.nConnected + ' 行): '
  + markMismatch.rows.map((z) => z.body + '|' + z.quantity).join(' , '));
console.log('  判定に足りないもの(天体×量): ' + missingA.n + ' 組 ' + JSON.stringify(missingA.byCut));
console.log('→ ' + path.relative(ROOT, OUT));
