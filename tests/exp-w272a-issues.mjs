// 第272便a(第62報・原仮定者の仮説(第62報)「現実較正サンプルで起きている問題を一覧で整理する」):
// **問題一覧を正本 JSON から機械生成する器**。
//
// ■ 何をするか(**エンジンを 1 步も走らせない** —— 正本 JSON を読んで表を組むだけ)
//   ① `tests/out/calaudit-w249.json` の 37 サンプルについて、
//      {4 値・門の内訳・数値未解決/mapping/条件不一致の理由・σ 未接続の内訳・停止理由} を並べる。
//   ② **問題分類**(σ・測定値不足 / 数値 / 観測量対応 / 条件違い / 中心値集計 / 入力と予測の循環 / 表示)
//      ごとに、**どのサンプルのどの量が該当するか**を数える。
//   ③ **カロン固有の問題**を、この便で測った数だけで書く。
//   ④ 理論対照 3 本(🧪 emAuditNewton・🔒 qLockRadialAudit・🔐 qLockRadialAuditQ3)は
//      **母集団の外**であることを明記する(観測較正のサンプルではない)。
//
// ■ この器が言わないこと
//   「問題を解決した」「較正した」「判定が増えた」。**数えただけ**である。
//   合否・4 値・門の数は 1 つも作らない(すべて正本 JSON から写す)。
//
// 実行: node tests/exp-w272a-issues.mjs
// 出力: docs/CALIBRATION_ISSUES_v1.45.md(QA `docs.issuesSync` が件数を JSON と突き合わせる)
//       tests/out/issues-w272a.json(機械可読の同じ内容)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CAL = path.join(ROOT, 'tests', 'out', 'calaudit-w249.json');
const SOLAR = path.join(ROOT, 'tests', 'out', 'solarsigma-w262d.json');
const OUT_MD = path.join(ROOT, 'docs', 'CALIBRATION_ISSUES_v1.45.md');
const OUT_JSON = path.join(ROOT, 'tests', 'out', 'issues-w272a.json');

const cal = JSON.parse(fs.readFileSync(CAL, 'utf8'));
const solar = fs.existsSync(SOLAR) ? JSON.parse(fs.readFileSync(SOLAR, 'utf8')) : null;
const THEORY_CONTROL = ['qLockRadialAudit', 'qLockRadialAuditQ3', 'emAuditNewton'];

// ---------------------------------------------------------------- ① サンプル表
const ledgerById = new Map((cal.verdictLedger.rows || []).map((r) => [r.id, r]));
const solarById = new Map(((solar && solar.presets) || []).map((r) => [r.id, r]));
const rows = [];
for (const p of (cal.presets || [])) {
  const led = ledgerById.get(p.id) || {};
  const qs = p.quantities || [];
  const g = { ok: 0, ng: 0, num: 0, map: 0, cond: 0, na: 0 };
  const reasons = { num: {}, map: {}, cond: {}, na: {} };
  const bump = (o, k) => { o[k] = (o[k] || 0) + 1; };
  for (const q of qs) {
    const st = (q.gate || {}).status || null;
    if (st === '合(3σ)') g.ok++;
    else if (st === '否(3σ)') g.ng++;
    else if (st === '数値未解決') { g.num++; bump(reasons.num, convHold(q)); }
    else if (st === 'mapping-unresolved') { g.map++; bump(reasons.map, shortMap(q)); }
    else if (st === 'condition-mismatch') { g.cond++; bump(reasons.cond, 'kFrame 条件の対照走行が無い'); }
    else { g.na++; bump(reasons.na, ((q.gate || {}).reason || '—').slice(0, 44)); }
  }
  const sr = (p.run && p.run.stopRule) || {};
  const sp = solarById.get(p.id) || null;
  rows.push({
    id: p.id, emoji: p.emoji, name: p.name, version: p.version,
    theoryControl: THEORY_CONTROL.includes(p.id),
    nQ: qs.length, verdict4: led.verdict4 || null, missing: led.missing || [],
    gate: g, reasons,
    stop: { stoppedBy: sr.stoppedBy || null, stepsRun: sr.stepsRun || null,
      maxSteps: sr.maxSteps || null, maxStepsSource: sr.maxStepsSource || null,
      needPeriastra: sr.needPeriastra || null, minPeriastra: sr.minPeriastra === undefined ? null : sr.minPeriastra,
      complete: sr.complete === undefined ? null : sr.complete,
      unmeasuredReason: sr.unmeasuredReason || null },
    solarCuts: sp ? sp.cuts : null,
    sigmaConnected: qs.filter((q) => (q.gate || {}).sigma > 0).length,
  });
}
function convHold(q) {
  const c = (q.gate || {}).convergence || {};
  if (c.hold) return String(c.hold).replace(/\*/g, '').slice(0, 52);
  return '数値誤差幅が 0.3σ の予算を超える';
}
function shortMap(q) {
  const n = (q.gate || {}).mappingNote || '';
  return String(n).replace(/\*/g, '').slice(0, 52);
}

// ---------------------------------------------------------------- ② 問題分類
// **分類は宣言**である(自動判定ではない)。どの量がどの分類に入るかは、門の状態と欄の有無で決める。
const CLASSES = [
  { key: 'sigma-missing', title: 'σ・測定値が足りない',
    what: '観測 σ が CSV に無い(空欄)・判定量に σ の宛先が無い・実測が窓不足で取れない。'
      + '**門へ入っていない**ので合否が言えない。',
    match: (q) => { const st = (q.gate || {}).status;
      return st === '未判定' && !((q.gate || {}).sigma > 0); } },
  { key: 'numeric', title: '数値(収束が確認できない)',
    what: '3 段(条件つきで 4 段)・次数ガード |p−2|≤0.5・窓充足・抽出健全・ε̂ と最終段差 ≤0.3σ の'
      + 'どれかを満たさない。**「合わない」ではなく「まだ言えない」**である。',
    match: (q) => (q.gate || {}).status === '数値未解決' },
  { key: 'mapping', title: '観測量対応が未確定',
    what: 'シミュレータが測る量と、観測解が定義している量が**同じ測定量だと確定していない**'
      + '(e_T ⇄ eProxy・円に近い系の近点間周期 ⇄ two-body Keplerian の P など)。',
    match: (q) => (q.gate || {}).status === 'mapping-unresolved' },
  { key: 'condition', title: '条件違い(対照走行が無い)',
    what: '行が要求する条件(kFrame=0 対照など)と、配られている測定値の条件が違う。'
      + '**合っていないのではなく、条件が違う**。',
    match: (q) => (q.gate || {}).status === 'condition-mismatch' },
  { key: 'center-bookkeeping', title: '中心値の集計(obsCard と CSV 行の混在)',
    what: '中心値が obsCard 由来・σ が CSV 行由来という組み合わせのまま残っている量'
      + '(AD5 で 6 つ同時に切り替えたのは宣言のある行だけ)。**単位違いとは分けて数える**。',
    match: (q) => !!(q.adopted && q.adopted.centerMatchesCsv === false) },
  { key: 'unit', title: '単位(判定量と CSV 行の単位が違う)',
    what: '判定量が deg/orbit・CSV 行が deg/yr など。**中心値の不一致ではない** —— '
      + '比べてはいけない 2 つの数である(第272便a・R12 で列を分けた)。',
    match: (q) => !!(q.adopted && q.adopted.unitSame === false) },
  { key: 'circular', title: '入力と予測の循環(従属量)',
    what: '較正に使った量の帰結を、独立な予言として数えられない量(NS 連星 DFM 版の近点移動など)。',
    match: (q) => q.verdict === '従' },
  { key: 'display', title: '表示(合否の対象でない宣言行)',
    what: '規約・帳簿・単位族・受け皿など、obsCard に並んでいるが**合否の対象ではない**行。',
    match: (q) => q.kind === 'other' || q.method === 'declaration' },
];
const classCensus = [];
for (const c of CLASSES) {
  const hits = [];
  for (const p of (cal.presets || [])) for (const q of (p.quantities || [])) {
    if (THEORY_CONTROL.includes(p.id)) continue;   // 母集団の外
    if (c.match(q)) hits.push({ id: p.id, emoji: p.emoji, kind: q.kind, name: q.name });
  }
  const byPreset = new Map();
  for (const h of hits) byPreset.set(h.id, (byPreset.get(h.id) || 0) + 1);
  classCensus.push({ key: c.key, title: c.title, what: c.what, n: hits.length,
    presets: byPreset.size, rows: hits.slice(0, 60) });
}

// ---------------------------------------------------------------- ③ カロン固有の問題
const charon = (cal.presets || []).find((p) => p.id === 'plutoCharonReal') || null;
const charonQ = charon ? (charon.quantities || []) : [];
const cPeriRow = charonQ.find((q) => /近点間/.test(q.name)) || null;
const cRevRow = charonQ.find((q) => /E6′-R/.test(q.name)) || null;
const cCtrlRow = charonQ.find((q) => /kFrame=0/.test(q.name)) || null;
const cEcc = charonQ.find((q) => q.kind === 'ecc') || null;
const cPrec = charonQ.find((q) => q.kind === 'precession') || null;
const charonIssues = [
  { key: 'control', title: '対照条件の走行が無い',
    measured: cCtrlRow ? ((cCtrlRow.gate || {}).status || null) : null,
    text: '「kFrame=0 対照」の行に、kFrame=1 の走行の数が配られている(プリセットの physics は 1 つ)。'
      + '**合っていないのではなく、条件が違う**(`condition-mismatch`)。' },
  { key: 'period-def', title: '周期の定義が行ごとに違う',
    measured: cPeriRow ? cPeriRow.periodDef : null,
    text: '第271便a まで、3 行(kF0 対照・同方向 1 周・近点間)が**同じ 1 つの数**を配られていた。'
      + '第272便a(R10)で「近点間」の行は近点検出器 A の値を全段で配るようにした。' },
  { key: 'circular-orbit', title: '円に近い軌道の近点',
    measured: cEcc ? cEcc.meas : null,
    text: '転写された離心率は e=0.0、実測 eProxy は上の値である。近点方位が縮退しているので、'
      + '**近点間平均間隔と観測側の two-body Keplerian の P が同じ測定量である保証が無い**'
      + '(第272便a・R10 で `mapping-unresolved` を宣言した)。' },
  { key: 'convergence', title: '数値が漸近域に居ない',
    measured: cRevRow ? ((cRevRow.gate || {}).convergence || {}).order : null,
    text: '3 段の観測次数は上の値で、スキームの宣言次数 2 から離れている(|p−2|>0.5)。'
      + '第272便a(AG1)で条件つき h/8 を足して測った(結果は §2 の表)。' },
  { key: 'input-pair', title: '入力の一組性',
    measured: null,
    text: '観測側の P は高精度 fit(σ=0.02592 s)だが、シミュレータの初期状態は**丸めた転写**である。'
      + '**同じ一組から作られていない**(P だけを高精度の解に差し替えても、初期状態は別の来歴を持つ)。' },
  { key: 'softening', title: 'softening と半径比',
    measured: (charon && charon.correlates) ? charon.correlates.aOverR : null,
    text: 'a/R(上の値は `correlates.aOverR`)と softening ε/a の扱いは、'
      + '**周期の 0.1% 台の差に効く大きさかどうかを測っていない**(未測定)。' },
  { key: 'f-approx', title: 'f≈1+kFrame の近似が当てはまらない',
    measured: (charon && charon.correlates) ? charon.correlates.chi : null,
    text: 'χ(上の値)は χ≈1 の極限から遠い。**f≈1+k は χ≈1 の極限の形**なので、'
      + 'この系では当てはまらない(**統括の検証項目 R14 の diagnostic で測る対象**である)。' },
  { key: 'tidal-lock', title: '潮汐ロックの動的維持',
    measured: null,
    text: '冥王星–カロンは互いに潮汐ロックしているが、**プリセットはロックを動的に維持する機構を'
      + '持たない**(転写した spin がそのまま回るだけである)。'
      + '原仮定者の仮説(第62報)「潮汐ロック → kFrame≈0」は**内蔵の既定には入れない**'
      + '(統括の検証項目 R14 —— 診断コピー・variant で測る対象である)。' },
  { key: 'geopn', title: 'geoPN=3 の受理条件',
    measured: null,
    text: '「空間メッシュ(geoPN=3)」で測ると何がどう動くかは、**この便では測っていない**。'
      + '受理条件(何をもって採るか)が宣言されていない量を、判定へ繋いではならない。' },
];

// ---------------------------------------------------------------- 出力
const fv = cal.fourValues || {};
const cur = fv.current || {};
const nonTheory = rows.filter((r) => !r.theoryControl);
const md = [];
md.push('# 現実較正サンプルの問題一覧(v1.45 開発線・第272便a)');
md.push('');
md.push('本書は **`tests/exp-w272a-issues.mjs` が正本 JSON から機械生成**する。'
  + '手で打った数字は 1 つも無い(**数えただけ**であって、直した記録ではない)。');
md.push('');
md.push('- 入力: `tests/out/calaudit-w249.json`(SHA-256 `'
  + crypto.createHash('sha256').update(fs.readFileSync(CAL)).digest('hex').slice(0, 12) + '…`)'
  + (solar ? ' / `tests/out/solarsigma-w262d.json`' : ''));
md.push('- 対象 HTML: `' + (cal.meta || {}).target + '`(SHA-256 `'
  + String((cal.meta || {}).targetSha256 || '—').slice(0, 12) + '…`)');
md.push('- 生成時刻の走行: 4 値 **' + ['合', '量限定合', '否', '保留']
  .map((k) => (cur.counts || {})[k]).join('/') + '**・門 **'
  + ['合(3σ)', '否(3σ)', '数値未解決', 'mapping-unresolved', 'condition-mismatch', '未判定']
    .map((k) => (cur.gate || {})[k]).join('/') + '**');
md.push('');
md.push('**書かないこと**: 「問題を解決した」「較正した」「較正を完了した」「判定が増えた」'
  + '「カロンが合」「カロンが否」。');
md.push('');
md.push('## 0. 母集団');
md.push('');
const inPop = rows.filter((r) => r.theoryControl);
md.push('- サンプル **' + rows.length + ' 本**。**理論対照 ' + THEORY_CONTROL.length + ' 本**('
  + THEORY_CONTROL.map((id) => '`' + id + '`').join('・')
  + ')は**母集団の外**である —— 観測較正のサンプルではなく、'
  + '**同じ器で理論値を再現できるかを見る対照**であり、'
  + (inPop.length === 0
    ? '正本 JSON の走行対象に**最初から入っていない**(この表の ' + rows.length + ' 本に 1 本も含まれない)。'
    : 'このうち ' + inPop.length + ' 本が表に載っている(§2 の分類は残り **'
      + nonTheory.length + ' 本**で数えている)。'));
md.push('');
md.push('## 1. サンプル別の表(' + rows.length + ' 本)');
md.push('');
md.push('| # | 系 | 版 | 量 | 4 値 | 合/否/数値/写像/条件/未判定 | σ 接続 | 止まり方 | 足りないもの |');
md.push('|---:|---|---|---:|---|---|---:|---|---|');
rows.forEach((r, i) => {
  md.push('| ' + (i + 1) + ' | ' + r.emoji + ' `' + r.id + '`' + (r.theoryControl ? '(**対照**)' : '')
    + ' | ' + (r.version === 'dfm' ? 'DFM' : '観測') + ' | ' + r.nQ
    + ' | ' + (r.verdict4 || '—')
    + ' | ' + [r.gate.ok, r.gate.ng, r.gate.num, r.gate.map, r.gate.cond, r.gate.na].join('/')
    + ' | ' + r.sigmaConnected
    + ' | ' + (r.stop.stoppedBy || '—').replace(/\|/g, '/')
    + ' | ' + (r.missing.length ? r.missing.join('・') : '—') + ' |');
});
md.push('');
md.push('## 2. 問題分類(理論対照を除く ' + nonTheory.length + ' 本で数えた)');
md.push('');
md.push('| 分類 | 量の数 | 系の数 | 中身 |');
md.push('|---|---:|---:|---|');
for (const c of classCensus)
  md.push('| **' + c.title + '** | ' + c.n + ' | ' + c.presets + ' | ' + c.what + ' |');
md.push('');
md.push('**分類は互いに排他ではない**(1 つの量が「単位」と「中心値の集計」の両方に入ることがある)。'
  + '**この表は合否の宣言ではない** —— どこで止まっているかの内訳である。');
md.push('');
md.push('### 2.1 保留の理由の内訳(門の状態ごと)');
md.push('');
const reasonAgg = { num: {}, map: {}, cond: {}, na: {} };
for (const r of rows) for (const k of Object.keys(reasonAgg))
  for (const [why, n] of Object.entries(r.reasons[k]))
    reasonAgg[k][why] = (reasonAgg[k][why] || 0) + n;
for (const [k, label] of [['num', '数値未解決'], ['map', 'mapping-unresolved'],
  ['cond', 'condition-mismatch'], ['na', '未判定']]) {
  const ent = Object.entries(reasonAgg[k]).sort((a, b) => b[1] - a[1]);
  if (!ent.length) continue;
  md.push('**' + label + '**(' + ent.reduce((a, z) => a + z[1], 0) + ' 量)');
  md.push('');
  for (const [why, n] of ent) md.push('- ' + n + ' 量 …… ' + why);
  md.push('');
}
md.push('## 3. カロン(❄️ plutoCharonReal)固有の問題');
md.push('');
md.push('| # | 問題 | この便で測った数 | 中身 |');
md.push('|---:|---|---|---|');
charonIssues.forEach((z, i) => {
  const v = (z.measured === null || z.measured === undefined) ? '**未測定**'
    : (typeof z.measured === 'number' ? z.measured.toPrecision(8) : String(z.measured));
  md.push('| ' + (i + 1) + ' | **' + z.title + '** | ' + v + ' | ' + z.text + ' |');
});
md.push('');
md.push('**「カロンが合」「カロンが否」とは書かない** —— 門の状態は上の表のとおりである。');
md.push('');
md.push('---');
md.push('');
md.push('生成器: `tests/exp-w272a-issues.mjs`(第272便a)。'
  + 'QA `docs.issuesSync` が、この文書の件数が正本 JSON と一致することを機械固定する。');
md.push('');

fs.writeFileSync(OUT_MD, md.join('\n'));
const outJson = {
  when: new Date().toISOString(), wave: '第272便a(第62報)',
  input: { calaudit: 'tests/out/calaudit-w249.json',
    calauditSha256: crypto.createHash('sha256').update(fs.readFileSync(CAL)).digest('hex'),
    targetSha256: (cal.meta || {}).targetSha256 || null },
  nPresets: rows.length, nTheoryControl: rows.filter((r) => r.theoryControl).length,
  theoryControl: THEORY_CONTROL,
  fourValues: cur.counts || null, gate: cur.gate || null,
  rows, classCensus, reasonAgg, charonIssues,
  solarCutTally: solar ? solar.cutTally : null,
  doNotWrite: ['問題を解決した', '較正した', '判定が増えた', 'カロンが合', 'カロンが否'],
};
fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
fs.writeFileSync(OUT_JSON, JSON.stringify(outJson, null, 1));
console.log('[w272a-issues] ' + rows.length + ' サンプル(理論対照 ' + outJson.nTheoryControl
  + ' 本は母集団外)/ 問題分類 ' + classCensus.length + ' 区分 / カロン固有 ' + charonIssues.length + ' 件');
for (const c of classCensus) console.log('  ' + c.title + ': ' + c.n + ' 量 / ' + c.presets + ' 系');
console.log('→ ' + path.relative(ROOT, OUT_MD) + ' / ' + path.relative(ROOT, OUT_JSON));
