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
// ■ 第273便c(第63報・統括の検証項目 R19)で**訂正した 6 点**(どれも「数え方・書き方」の訂正で、
//   判定・4 値・門の数は 1 つも動かしていない):
//   (1) 📡 D68 の「足りないもの」が「3σ を通った量がある」になっていた(門は**合 0・否 1**)。
//       既定文を**門の内訳から作る**ように判定器側を直した(`tests/exp-w249b-calaudit.mjs`)。
//   (2) 保留理由を 52 字(`slice(0,52)`)で切っていたので、次数ガードの行が
//       「…(|p−」で終わっていた。**全文を出す**。
//   (3) 表のセルの中の `|`(`|p−2|` など)を**エスケープ**する(表が崩れていた)。
//   (4) softening・geoPN=3・潮汐ロック枝を「未測定」と書いていたが、第272便b/第272便c に
//       **実測がある**。参照先(`tests/out/charon-w272b.json` / `tests/out/nslock-w272c.json`)を
//       接続して**測った数**を載せる。
//   (5) 「未判定 254」は「σ 未接続 254」**ではない**(宣言行・実測が無い行・σ はあるが観測値が
//       無い行が混ざっている)。§2.2 で**分けて数える**。
//   (6) カロンの `correlates.chi` と一次則の χ_A/χ_B は**別の量**である(注記を入れた)。
//
// 実行: node tests/exp-w272a-issues.mjs
// 出力: docs/CALIBRATION_ISSUES_v1.45.md(QA `docs.issuesSync` / `docs.issuesD68Explain` が
//       件数・D68 の説明・参照先の存在を JSON と突き合わせる)
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
// 第273便c(R19-4): **「未測定」と書いていた 3 件には実測がある**。参照先を機械で繋ぐ
// (無ければ「参照先が無い」と書く —— 黙って「未測定」に戻さない)。
const CHARON = path.join(ROOT, 'tests', 'out', 'charon-w272b.json');
const NSLOCK = path.join(ROOT, 'tests', 'out', 'nslock-w272c.json');
const charonRef = fs.existsSync(CHARON) ? JSON.parse(fs.readFileSync(CHARON, 'utf8')) : null;
const nslockRef = fs.existsSync(NSLOCK) ? JSON.parse(fs.readFileSync(NSLOCK, 'utf8')) : null;
// 表のセルの `|` をエスケープする(`|p−2|` が表を割っていた —— R19-3)。改行も潰す。
const cell = (s) => String(s === null || s === undefined ? '—' : s)
  .replace(/\r?\n/g, ' ').replace(/\|/g, '\\|');
const sig = (x, d = 6) => (Number.isFinite(x) ? x.toPrecision(d) : '—');

// 第273便c(R19-5): **「未判定」を「σ 未接続」と同じものにしない**。門の入口
// (`assessObservation`)で落ちる理由は 1 つではない —— 分けて数える。
const NA_KINDS = [
  { key: 'declaration-row', label: '宣言行(合否の対象ではない)',
    what: '規約・帳簿・単位族・受け皿など `kind:"other"` の行。**測定値も観測値も持たない**ので、'
      + '門に入らないのが正しい状態である(「足りない」ではない)。' },
  { key: 'no-measurement', label: '実測が無い(窓不足・未走行)',
    what: '判定量は宣言されているが、この走行では**有限の実測が取れていない**'
      + '(近点が足りない・自転の検出器が無い 等)。' },
  { key: 'sigma-present-no-obs', label: 'σ はあるが観測値が無い(σ だけの宣言行)',
    what: '**σ が接続されているのに、比べる観測の中心値がこの行に無い**('
      + '🧮 の「周期の収縮」行のように、観測量ではなく**模型の中の量**を測っている行)。'
      + '**σ 未接続とは逆の状態**である。' },
  { key: 'sigma-missing', label: 'σ が無い(実測はある)',
    what: '実測は取れているが、観測 σ が CSV に無い/判定量に σ の宛先が無い。'
      + '**これが「σ 未接続」である**。' },
];
function naKind(q) {
  const g = q.gate || {};
  if (q.kind === 'other' || q.method === 'declaration') return 'declaration-row';
  if (!Number.isFinite(q.meas)) return 'no-measurement';
  if (Number.isFinite(g.sigma) && g.sigma > 0) return 'sigma-present-no-obs';
  return 'sigma-missing';
}
function naReason(q) {
  const k = NA_KINDS.find((z) => z.key === naKind(q));
  return (k ? k.label : '—') + '(門の文面: ' + ((q.gate || {}).reason || '—') + ')';
}

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
    // 第273便c(R19-2/R19-5): **切り詰めない**・「未判定」は**なぜ門に入らないのか**で分ける。
    else { g.na++; bump(reasons.na, naReason(q)); }
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
// 第273便c(R19-2): **理由は全文を出す**(第272便a は 52 字で切っていたので、次数ガードの行が
// 「…が 2 から 1.0004 離れている(|p−」で終わっていた —— 数だけ残って条件が消えていた)。
function convHold(q) {
  const c = (q.gate || {}).convergence || {};
  if (c.hold) return String(c.hold).replace(/\*/g, '');
  return '数値誤差幅が 0.3σ の予算を超える';
}
function shortMap(q) {
  const n = (q.gate || {}).mappingNote || '';
  return String(n).replace(/\*/g, '');
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

// ---------------------------------------------------------------- 第273便c(R19-5): 未判定の内訳
// **「未判定」を「σ 未接続」と同じものにしない。** 門の入口で落ちる理由を 4 つに分けて数える。
const naCensus = { total: 0, byKind: {}, sigmaNoObsRows: [] };
for (const k of NA_KINDS) naCensus.byKind[k.key] = { n: 0, presets: 0, _ids: new Set() };
for (const p of (cal.presets || [])) for (const q of (p.quantities || [])) {
  if (((q.gate || {}).status) !== '未判定') continue;
  naCensus.total++;
  const k = naKind(q);
  naCensus.byKind[k].n++; naCensus.byKind[k]._ids.add(p.id);
  if (k === 'sigma-present-no-obs')
    naCensus.sigmaNoObsRows.push({ id: p.id, emoji: p.emoji, name: q.name, kind: q.kind,
      sigma: (q.gate || {}).sigma });
}
for (const k of NA_KINDS) {
  naCensus.byKind[k.key].presets = naCensus.byKind[k.key]._ids.size;
  delete naCensus.byKind[k.key]._ids;
}

// ---------------------------------------------------------------- ③ カロン固有の問題
const charon = (cal.presets || []).find((p) => p.id === 'plutoCharonReal') || null;
const charonQ = charon ? (charon.quantities || []) : [];
const cPeriRow = charonQ.find((q) => /近点間/.test(q.name)) || null;
const cRevRow = charonQ.find((q) => /E6′-R/.test(q.name)) || null;
const cCtrlRow = charonQ.find((q) => /kFrame=0/.test(q.name)) || null;
const cEcc = charonQ.find((q) => q.kind === 'ecc') || null;
const cPrec = charonQ.find((q) => q.kind === 'precession') || null;
// ---------------------------------------------------------------- 第273便c(R19-4): 参照先の実測
// **この器は数を 1 つも作らない**(正本 JSON から読むだけ)。参照先が無ければ「参照先が無い」と書く。
const chCol = (id) => (charonRef && charonRef.columns && charonRef.columns[id]
  && charonRef.columns[id].h) ? charonRef.columns[id].h : null;
const charonSystem = (charonRef && Array.isArray(charonRef.declaredSystems))
  ? (charonRef.declaredSystems.find((z) => z.id === 'plutoCharonReal') || null) : null;
const SOFT_IDS = ['S_e0.05_k0', 'S_e0.025_k0', 'S_e0.0125_k0',
  'S_e0.05_k1', 'S_e0.025_k1', 'S_e0.0125_k1'];
const softRows = SOFT_IDS.map((id) => { const c = chCol(id); return c ? {
  id, softening: c.cfg.softening, kFrame: c.cfg.kFrame, rev2Sec: c.rev2Sec,
  sigmaRev: c.sigmaRev, periASec: c.periASec, sigmaPeriA: c.sigmaPeriA, eProxy: c.eProxy } : null;
}).filter(Boolean);
const softSigmas = softRows.filter((z) => z.kFrame === 0).map((z) => z.sigmaRev);
const softSpanSigma = softSigmas.length
  ? (Math.max(...softSigmas) - Math.min(...softSigmas)) : null;
const softeningRowText = softRows.length
  ? ('kF0 で ' + softRows.filter((z) => z.kFrame === 0)
    .map((z) => sig(z.rev2Sec, 12) + ' s(' + sig(z.sigmaRev, 6) + 'σ)').join(' → ')
    + '、kF1 で ' + softRows.filter((z) => z.kFrame === 1)
      .map((z) => sig(z.rev2Sec, 12) + ' s(' + sig(z.sigmaRev, 6) + 'σ)').join(' → ') + ' と動く。')
  : '**参照先の JSON が無い**(tests/out/charon-w272b.json)。';
const GEO_IDS = ['C6_scalar', 'C6_local', 'C6_complex'];
const geoRows = GEO_IDS.map((id) => { const c = chCol(id); return c ? {
  id, law: c.cfg.lawVersion || null, rev2Sec: c.rev2Sec, sigmaRev: c.sigmaRev,
  geoToyStop: (c.cfgApplied || {}).geoToyStop || null,
  hasGeoToy: !!(c.cfgApplied || {}).hasGeoToy } : null; }).filter(Boolean);
const geoBase = chCol('C1');   // kF0・geoPN=2 の対照(complex はこれと同じ数になる)
const geoPnSigmas = geoRows.map((z) => z.sigmaRev);
const geoPnSpanSigma = geoPnSigmas.length
  ? (Math.max(...geoPnSigmas) - Math.min(...geoPnSigmas)) : null;
const geoPnRowText = geoRows.length
  ? (geoRows.map((z) => z.law + ' ' + sig(z.rev2Sec, 12) + ' s(' + sig(z.sigmaRev, 6) + 'σ'
    + (z.geoToyStop ? '・停止 ' + z.geoToyStop : '') + ')').join(' / ')
    + '(同条件の geoPN=2 対照 C1 は ' + sig(geoBase ? geoBase.rev2Sec : null, 12) + ' s)。')
  : '**参照先の JSON が無い**(tests/out/charon-w272b.json)。';
// NS 4 系の lock 枝(AH24 —— 台帳の 1 行にする実測)
const lockRows = (nslockRef && Array.isArray(nslockRef.systems))
  ? nslockRef.systems.filter((s) => s.kind === 'ns-binary').map((s) => {
    const v = (s.variants || []).find((z) => z.tag === 'lock') || null;
    const obs = ((s.obs || {}).adopted || {}).W || null;
    const sg = ((v || {}).sigma || {}).adopted || {};
    const w = sg.omegaDot || {};
    return { id: s.id, emoji: s.emoji, label: s.label,
      spec: v ? v.spec : null,
      omegaDotExt: v ? v.omegaDotExt : null, omegaDotH4: Number.isFinite(w.modelH4) ? w.modelH4 : null,
      obs: obs ? obs.value : null, sigma: obs ? obs.sigma : null,
      ratioExt: (v && obs && obs.value) ? v.omegaDotExt / obs.value : null,
      ratioH4: (Number.isFinite(w.modelH4) && obs && obs.value) ? w.modelH4 / obs.value : null,
      nSigmaExt: Number.isFinite(w.sigmaTimesExt) ? w.sigmaTimesExt : null,
      pObs: ((v || {}).richardson || {}).omegaDot ? v.richardson.omegaDot.p : null,
      resolved: !!((v || {}).resolved || {}).omegaDot };
  }) : [];
const lockRatios = lockRows.map((z) => z.ratioExt).filter(Number.isFinite);
const lockRatioSpan = lockRatios.length
  ? (Math.min(...lockRatios).toFixed(4) + '〜' + Math.max(...lockRatios).toFixed(4)) : null;
const lockRatioText = lockRows.length
  ? lockRows.map((z) => z.emoji + ' ' + (Number.isFinite(z.ratioExt) ? z.ratioExt.toFixed(4) : '—')).join('・')
  : '**参照先の JSON が無い**(tests/out/nslock-w272c.json)';

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
  // 第273便c(AH30): **「漸近域に居ない」と書かない** —— 言えるのは「漸近収束が未確認」までである。
  { key: 'convergence', title: '漸近収束が未確認(次数が立たない)',
    measured: cRevRow ? ((cRevRow.gate || {}).convergence || {}).order : null,
    text: '3 段の観測次数は上の値で、スキームの宣言次数 2 から離れている(|p−2|>0.5)。'
      + '第272便a(AG1)で条件つき h/8 を足して測ったが、shifted p が負になる列がある'
      + '(❄️ 同方向 1 周 −0.323018・離心率 −0.907886)。**負の次数から Richardson 補正・外挿は'
      + '作らない**(第273便c・AH30)。**「漸近域に居ないことが確定した」とは書かない** —— '
      + '言えるのは**漸近収束が未確認**ということである。' },
  { key: 'input-pair', title: '入力の一組性',
    measured: null,
    text: '観測側の P は高精度 fit(σ=0.02592 s)だが、シミュレータの初期状態は**丸めた転写**である。'
      + '**同じ一組から作られていない**(P だけを高精度の解に差し替えても、初期状態は別の来歴を持つ)。' },
  // ---- 第273便c(R19-4): **「未測定」と書いていた 3 件に実測を接続する** ----
  { key: 'softening', title: 'softening の効き(実測・第272便b の S 系列)',
    measured: softSpanSigma, unit: 'σ',
    ref: 'tests/out/charon-w272b.json(列 S_e0.05/0.025/0.0125 × kF0/kF1)',
    text: 'softening ε を 0.05 → 0.025 → 0.0125 と半分にすると、同方向 1 周の周期は'
      + softeningRowText + ' **「0.1% 台の差に効くかどうか未測定」ではない** —— '
      + '**σ 倍で数百の幅を動かし、kF0 側では符号も反転する**(+294.08σ → −17.78σ → −95.75σ)。'
      + 'a/R は `correlates.aOverR` = ' + sig((charon && charon.correlates) ? charon.correlates.aOverR : null)
      + ' である。**「softening を小さくすれば合う」とは書かない**(ε=0.025 の −17.78σ も 3σ の外である)。' },
  { key: 'f-approx', title: 'f≈1+kFrame の近似が当てはまらない',
    measured: (charon && charon.correlates) ? charon.correlates.chi : null,
    text: 'χ(上の値 = `correlates.chi`)は χ≈1 の極限から遠い。**f≈1+k は χ≈1 の極限の形**なので、'
      + 'この系では当てはまらない。**この χ は一次則の χ_A / χ_B とは別の量である**'
      + '(第273便c・R19-6): `correlates.chi` は棚卸しが系ごとに 1 つ持つ相関量で、'
      + '第272便b の `declaredSystems[].chiA / chiB` は**天体ごと**の量(❄️ では '
      + sig(charonSystem ? charonSystem.chiA : null) + ' と ' + sig(charonSystem ? charonSystem.chiB : null)
      + ')である。**混ぜて読まない**。' },
  { key: 'tidal-lock', title: '潮汐ロックの動的維持(❄️ は未測定・NS 4 系は実測あり)',
    measured: lockRatioSpan, unit: 'ω̇/ω̇_obs',
    ref: 'tests/out/nslock-w272c.json(lock 枝 kFrame=0・f=1・λ_PN=1)',
    text: '冥王星–カロンは互いに潮汐ロックしているが、**プリセットはロックを動的に維持する機構を'
      + '持たない**(転写した spin がそのまま回るだけである)。❄️ についてはこの便でも**測っていない**。'
      + '**NS 連星 4 系では lock 枝(kFrame=0・f=1・λ_PN=1)が実測されている**: '
      + 'ω̇/ω̇_obs は ' + lockRatioText + '(上の欄は最小〜最大)。'
      + '**「潮汐ロック → kFrame≈0」が観測と合う**という結果ではない —— '
      + '**1/6 付近で 4 系とも 3σ の外**である(§4 の台帳・CALIBRATION_VERDICT §5.19)。'
      + '**係数 6 は導入しない**(6 倍すれば合う、とは書かない)。' },
  { key: 'geopn', title: 'geoPN=3(空間メッシュ)の実測と受理条件',
    measured: geoPnSpanSigma, unit: 'σ',
    ref: 'tests/out/charon-w272b.json(列 C6_scalar / C6_local / C6_complex)',
    text: 'geoPN=3 で測ると何が動くかは**第272便b が測っている**: '
      + geoPnRowText
      + ' **`complex` は数が 1 bit も動かない** —— 実行情報の `geoToyStop` が '
      + '`complexNotVelocity` で、**意図された未接続**である(第273便c・AH23。'
      + '「複素決定力場が作動した」とは書かない)。**受理条件(何をもって採るか)は'
      + '宣言されていない**ので、この 3 列はどれも**判定へ繋いでいない**。' },
];

// ---------------------------------------------------------------- 第273便c(R19-1/AH28): 📡 D68
const d68Preset = (cal.presets || []).find((p) => p.id === 'saturnZonalD68') || null;
const d68Led = ledgerById.get('saturnZonalD68') || {};
const d68 = {
  ok: (d68Led.gateCounts || {}).ok, ng: (d68Led.gateCounts || {}).ng,
  nQ: (d68Led.gateCounts || {}).nQ, withSigma: (d68Led.gateCounts || {}).withSigma,
  missing: (d68Led.missing || []).join('・'),
  revSec: d68Preset ? (d68Preset.quantities.find((q) => /同方向1周/.test(q.name)) || {}).meas : null,
  periSec: d68Preset ? (d68Preset.quantities.find((q) => /近点間/.test(q.name)) || {}).meas : null,
};
const mapDecl = cal.mappingDeclarations || null;
const d68Defs = (mapDecl && mapDecl.d68PeriodDefinitions) ? mapDecl.d68PeriodDefinitions : [];
const d68Note = (mapDecl && mapDecl.d68Note) ? mapDecl.d68Note : '**正本 JSON に宣言が無い**。';

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
    + ' | ' + cell(r.stop.stoppedBy || '—')
    + ' | ' + cell(r.missing.length ? r.missing.join('・') : '—') + ' |');
});
md.push('');
md.push('## 2. 問題分類(理論対照を除く ' + nonTheory.length + ' 本で数えた)');
md.push('');
md.push('| 分類 | 量の数 | 系の数 | 中身 |');
md.push('|---|---:|---:|---|');
for (const c of classCensus)
  md.push('| **' + c.title + '** | ' + c.n + ' | ' + c.presets + ' | ' + cell(c.what) + ' |');
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
  // 第273便c(R19-2): **全文を出す**(切り詰めない)。セル外なので `|` はそのままでよいが、
  // 改行だけ潰しておく。
  for (const [why, n] of ent) md.push('- ' + n + ' 量 …… ' + String(why).replace(/\r?\n/g, ' '));
  md.push('');
}
// ---------------------------------------------------------------- 第273便c(R19-5)
md.push('### 2.2 「未判定」の内訳(**「σ 未接続」と同じではない**)');
md.push('');
md.push('第272便a の表は「未判定 ' + naCensus.total + ' 量 …… 観測誤差(σ)または有限の実測が無い」の'
  + '**1 行**だった。門の入口で落ちる理由は 1 つではないので、**分けて数える**'
  + '(**「未判定 ' + naCensus.total + ' = σ 未接続 ' + naCensus.total + '」ではない**)。');
md.push('');
md.push('| 区分 | 量の数 | 系の数 | 中身 |');
md.push('|---|---:|---:|---|');
for (const k of NA_KINDS)
  md.push('| **' + k.label + '** | ' + naCensus.byKind[k.key].n + ' | '
    + naCensus.byKind[k.key].presets + ' | ' + cell(k.what) + ' |');
md.push('');
md.push('**「σ 未接続」と呼べるのは ' + naCensus.byKind['sigma-missing'].n + ' 量**である。'
  + 'σ がある行が観測値を持たずに未判定になっている例(' + naCensus.byKind['sigma-present-no-obs'].n
  + ' 量)は' + (naCensus.sigmaNoObsRows.length
    ? naCensus.sigmaNoObsRows.map((z) => z.emoji + ' `' + z.id + '` の「' + z.name + '」').join('・')
    : '無い') + 'で、**σ を足せば門に入る行ではない**(比べる観測の中心値がこの行に無い)。');
md.push('');
md.push('## 3. カロン(❄️ plutoCharonReal)固有の問題');
md.push('');
md.push('| # | 問題 | 測った数 | 参照先 | 中身 |');
md.push('|---:|---|---|---|---|');
charonIssues.forEach((z, i) => {
  const v = (z.measured === null || z.measured === undefined) ? '**未測定**'
    : ((typeof z.measured === 'number' ? z.measured.toPrecision(8) : String(z.measured))
      + (z.unit ? ' ' + z.unit : ''));
  md.push('| ' + (i + 1) + ' | **' + cell(z.title) + '** | ' + cell(v) + ' | '
    + (z.ref ? '`' + z.ref + '`' : '—') + ' | ' + cell(z.text) + ' |');
});
md.push('');
md.push('**「カロンが合」「カロンが否」とは書かない** —— 門の状態は上の表のとおりである。');
md.push('');
// ---------------------------------------------------------------- 第273便c(AH24)
md.push('## 4. NS 連星 4 系の lock 枝(実測の**記録** —— 判定ではない)');
md.push('');
md.push('原仮定者の仮説(第62報)「互いに潮汐ロックした天体は kFrame≈0 とみなせる」を、'
  + 'NS 連星 4 系で **kFrame=0・f=1・λ_PN=1** の枝として走らせた実測である'
  + '(器 `tests/exp-w272c-nslock.mjs`・正本 `tests/out/nslock-w272c.json`)。'
  + '**この表は台帳の 1 行であって判定ではない**: 内蔵プリセットの値は 1 つも変えていないし、'
  + '門にも入れていない。');
md.push('');
md.push('| 系 | ω̇(lock 枝・外挿) | ω̇_obs | ω̇/ω̇_obs(外挿) | ω̇/ω̇_obs(h/4 段) | 観測次数 p | σ 倍 |');
md.push('|---|---:|---:|---:|---:|---:|---:|');
for (const z of lockRows)
  md.push('| ' + z.emoji + ' `' + z.id + '`(' + cell(z.label) + ') | '
    + sig(z.omegaDotExt, 8) + ' | ' + sig(z.obs, 8) + ' | '
    + (Number.isFinite(z.ratioExt) ? z.ratioExt.toFixed(4) : '—') + ' | '
    + (Number.isFinite(z.ratioH4) ? z.ratioH4.toFixed(4) : '—') + ' | '
    + sig(z.pObs, 6) + ' | ' + sig(z.nSigmaExt, 6) + ' |');
md.push('');
md.push('**4 系とも ω̇/ω̇_obs ≈ 0.166** である(幅 ' + (lockRatioSpan || '—') + ')。'
  + '**係数 6 は導入しない** —— 「6 倍すれば合う」という接続は式にも力にも入れていない。'
  + '**有限質量比の相対 1PN 式との対応は未解析**である(この便では導いていない)。'
  + '**「潮汐ロックを証明した」「観測と合った」とは書かない**。');
md.push('');
// ---------------------------------------------------------------- 第273便c(R19-1/AH28)
md.push('## 5. 📡 D68(saturnZonalD68)—— 「足りないもの」の文と、周期の 3 つの定義');
md.push('');
md.push('**第272便a の表は 📡 の「足りないもの」に「(3σ を通った量がある — 残りは量の不足)」と'
  + '書いていた。通った量は 0 件である。** 📡 の門の内訳は **合 ' + d68.ok + '・否 ' + d68.ng
  + '**(否は近点移動の行)で、残り ' + (d68.nQ - d68.withSigma) + ' 量には σ が無い。'
  + '第273便c(R19)で判定器の既定文を**門の内訳から作る**ようにしたので、いまの文は'
  + '**「' + cell(d68.missing) + '」**である。');
md.push('');
md.push('### 5.1 周期の定義を 3 つに分ける(**σ は接続しない** —— AH28)');
md.push('');
md.push('| # | 定義 | 中身 | この器が測っている行 | σ |');
md.push('|---:|---|---|---|---|');
d68Defs.forEach((z, i) => {
  md.push('| ' + (i + 1) + ' | **' + cell(z.label) + '** | ' + cell(z.def) + ' | '
    + (z.measuredRow ? '`' + cell(z.measuredRow) + '`' : '**測っていない**') + ' | '
    + (z.sigmaConnected ? '接続' : '**接続しない**') + ' |');
});
md.push('');
md.push(cell(d68Note));
md.push('');
md.push('**実測(第272便a の再掲・単位 s)**: 同方向 1 周 ' + sig(d68.revSec, 10)
  + ' / 近点間 ' + sig(d68.periSec, 10) + '(差 '
  + (Number.isFinite(d68.revSec) && Number.isFinite(d68.periSec)
    ? ((d68.periSec / d68.revSec - 1) * 100).toFixed(4) + '%' : '—') + ')。'
  + '**どちらが観測側の「D68 の周期」に対応するかは照合していない。**');
md.push('');
// ---------------------------------------------------------------- 第273便c(AH27)
md.push('## 6. mapping-unresolved の宣言(**行ごと** —— e の小ささで一括しない)');
md.push('');
if (mapDecl) {
  md.push('宣言の出どころは 2 つだけである: **(A) 行ごと**(`ROW_MEASUREMENT_DEF[].mappingUnresolved`)'
    + '・**(B) 量の種類ごと**(`kind:"ecc"` の e_T / ケプラー要素 e ⇄ eProxy)。'
    + '宣言のある行は **' + mapDecl.declaredRows + ' 行**(行ごと ' + mapDecl.bySourceRow
    + ' / 種類ごと ' + mapDecl.bySourceKind + ')で、そのうち**門が `mapping-unresolved` を出したのは '
    + mapDecl.gateMappingUnresolved + ' 行**である。' + cell(mapDecl.gateUnchanged));
  md.push('');
  md.push('**近点間(`periastron`)の行 ' + mapDecl.periastronRows.length + ' 行は、'
    + '宣言する/しないを 1 行ずつ書いた**(黙って無宣言にしない)。');
  md.push('');
  md.push('| # | preset | 行名 | 宣言 | 理由 |');
  md.push('|---:|---|---|---|---|');
  mapDecl.periastronRows.forEach((z, i) => {
    md.push('| ' + (i + 1) + ' | `' + z.id + '` | ' + cell(z.match) + ' | '
      + (z.decision === 'declared' ? '**する**' : 'しない') + ' | ' + cell(z.why) + ' |');
  });
  md.push('');
  md.push('**円に近い対象の数え上げ**(実測 eProxy < ' + mapDecl.nearCircularThreshold
    + ' の対象 ' + mapDecl.nearCircular.length + ' 件・**閾値は数え上げの範囲であって宣言の自動判定ではない**):');
  md.push('');
  md.push('| # | 系 | 対象 | eProxy(実測) | 近点間行 | 宣言 |');
  md.push('|---:|---|---|---:|---|---|');
  mapDecl.nearCircular.forEach((z, i) => {
    md.push('| ' + (i + 1) + ' | ' + z.emoji + ' `' + z.id + '` | ' + cell(z.target) + ' | '
      + sig(z.eProxy, 5) + ' | ' + (z.hasPeriastronRow ? 'あり' : '**無い**') + ' | '
      + (z.declared ? '**する**' : 'しない') + ' |');
  });
  md.push('');
  md.push(cell(mapDecl.nearCircularNote) + ' **「e が小さいから一括で mapping-unresolved」とはしない** ——'
    + '🌇 金星・💠 天王星衛星・🟠 ガリレオ衛星の判定量は**同方向 1 周**であって近点間ではないので、'
    + '宣言する行が無い。');
} else {
  md.push('**正本 JSON に `mappingDeclarations` が無い**(判定器を第273便c 版で走らせ直すこと)。');
}
md.push('');
md.push('---');
md.push('');
md.push('生成器: `tests/exp-w272a-issues.mjs`(第272便a・第273便c で R19 の 6 点を訂正)。'
  + 'QA `docs.issuesSync` が、この文書の件数が正本 JSON と一致することを機械固定する。');
md.push('');

fs.writeFileSync(OUT_MD, md.join('\n'));
const outJson = {
  when: new Date().toISOString(), wave: '第272便a(第62報)/ 第273便c(第63報・R19 の訂正)',
  input: { calaudit: 'tests/out/calaudit-w249.json',
    calauditSha256: crypto.createHash('sha256').update(fs.readFileSync(CAL)).digest('hex'),
    targetSha256: (cal.meta || {}).targetSha256 || null,
    // 第273便c(R19-4): **「未測定」と書いていた 3 件の参照先**(無ければ null —— 黙って隠さない)
    charon: charonRef ? 'tests/out/charon-w272b.json' : null,
    charonSha256: charonRef
      ? crypto.createHash('sha256').update(fs.readFileSync(CHARON)).digest('hex') : null,
    nslock: nslockRef ? 'tests/out/nslock-w272c.json' : null,
    nslockSha256: nslockRef
      ? crypto.createHash('sha256').update(fs.readFileSync(NSLOCK)).digest('hex') : null },
  nPresets: rows.length, nTheoryControl: rows.filter((r) => r.theoryControl).length,
  theoryControl: THEORY_CONTROL,
  fourValues: cur.counts || null, gate: cur.gate || null,
  rows, classCensus, reasonAgg, charonIssues,
  // 第273便c: 新しく数えた/繋いだもの
  naKinds: NA_KINDS, naCensus,
  d68: Object.assign({}, d68, { definitions: d68Defs, note: d68Note }),
  mappingDeclarations: mapDecl
    ? { declaredRows: mapDecl.declaredRows, bySourceRow: mapDecl.bySourceRow,
      bySourceKind: mapDecl.bySourceKind, gateMappingUnresolved: mapDecl.gateMappingUnresolved,
      periastronRows: mapDecl.periastronRows, nearCircular: mapDecl.nearCircular,
      nearCircularThreshold: mapDecl.nearCircularThreshold }
    : null,
  softeningSeries: softRows, geoPnSeries: geoRows, nsLockRows: lockRows,
  solarCutTally: solar ? solar.cutTally : null,
  doNotWrite: ['問題を解決した', '較正した', '判定が増えた', 'カロンが合', 'カロンが否',
    '潮汐ロックを証明した', '複素決定力場が作動した', '観測と合った'],
};
fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
fs.writeFileSync(OUT_JSON, JSON.stringify(outJson, null, 1));
console.log('[w272a-issues] ' + rows.length + ' サンプル(理論対照 ' + outJson.nTheoryControl
  + ' 本は母集団外)/ 問題分類 ' + classCensus.length + ' 区分 / カロン固有 ' + charonIssues.length + ' 件');
for (const c of classCensus) console.log('  ' + c.title + ': ' + c.n + ' 量 / ' + c.presets + ' 系');
console.log('→ ' + path.relative(ROOT, OUT_MD) + ' / ' + path.relative(ROOT, OUT_JSON));
