// 第275便a(第65報・判定器便)—— 第274便a の kF0 棚卸し器の **改版**である。
// 問い(「**kFrame=1 が成立しないサンプルで kF0 版が成立しているか**」)も、正本から機械生成する
// という流儀も変えていない。**統括の検証項目 R33 が指摘した 2 つの誤分類だけを直した**:
//   (P1) `kOnly` が **f(massFactor)が同じかどうかだけ**で「k のみの対照」を判定していた ——
//        D₀・q・frameWeight・bodies が一緒に動いている対も「k だけの対照」と分類されていた。
//        本版は **k を除く 5 成分(f・D₀・q・frameWeight・bodies)がすべて同一**のときだけ
//        「f 固定・k のみの対照」と呼ぶ(軸の正本 `tests/out/presetaxes-w275a.json`)。
//   (P2) 診断系列の **観測成立**欄に `|nSigmaExt|≤3`(**門を通っていない外挿残差**)を書いていた。
//        本版は列を 2 本に分ける —— **外挿残差**(|nσ|≤3 か)と **観測成立**(門が `合(3σ)`)。
//        **外挿残差が小さいことは観測成立ではない。**
// **判定器(calaudit)は 1 度も走らせていない**(4 値・門・5 区分は第274便a の正本のままである)。
//
// ■ 何をするか
//   ① 較正 37 本(tests/out/calaudit-w249.json)と**診断系列**(❄️ カロン C0/C1・NS 4 系の lock 枝・
//      🛞 銀河トイの kFrame=0 対照)を行にする。
//   ② 各行の **kF1 側**と **kF0 側**に、統括の検証項目 R28 の **4 列**を別々に置く:
//        **走行成立**(窓を完走・NaN 0・クランプ 0)/ **構造安定**(**事前に宣言した**形状条件を満たし
//        摂動から回復する)/ **数値成立**(3 段・次数ガード・ε̂ が σ 予算の内側)/
//        **観測成立**(定義・観測解・独立量が誤差内 = 門が 合(3σ))。
//      **完走だけを「成立」と書かない。**
//   ③ **「kF1 不成立(否 3σ)・kF0 成立(合 3σ)」と言える行だけ**に、診断ラベル
//      **「引きずりが完全に消えている空間メッシュ状態(候補)」**を付ける。
//      ラベルには**対象量・窓・作用**を添える。**これは較正完了ではない**。
//   ④ **f 固定・k のみ変更の対照があるか**を行ごとに機械で判定する(独立な質量補正 f は別軸である)。
//      f が一緒に動いている対(例 ✨↔✴️)は「k のみの対照ではない」と明記する。
//   ⑤ **未測定は未測定と書く**(推定で埋めない)。
//
// ■ この器がしないこと
//   ・エンジンを走らせない(ブラウザを開かない)。**値を作らず、正本 JSON から読むだけ**である。
//   ・観測残差を見て窓・段・基準を選ばない(基準は入力側の宣言をそのまま読む)。
//   ・「kF0 版が成立した」「引きずりが消えた」とは書かない ——**ラベルは候補**である。
//
// 実行: node tests/exp-w275a-kf0ledger.mjs
//   (**入力に他の正本を持つので、presetaxes・calaudit の後に走らせる**)
// 出力: tests/out/kf0ledger-w275a.json(正本)・docs/KF0_LEDGER_v1.45.md(機械生成の表)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_JSON = path.join(ROOT, 'tests', 'out', 'kf0ledger-w275a.json');
const OUT_DOC = path.join(ROOT, 'docs', 'KF0_LEDGER_v1.45.md');

export const LEDGER_VERSION = 'w275a-1';
export const COL = { OK: '✓', NG: '✗', NA: '未測定' };
// 4 列の定義(**文書と QA が同じ 1 本を読む**)
export const COLUMNS = [
  { key: 'run', name: '走行成立',
    rule: '宣言した窓を完走し(停止条件)・**NaN 0**・**安全クランプ 0**。' },
  { key: 'structure', name: '構造安定',
    rule: '**事前に宣言した形状条件**(準定常の構造ドリフト・速度ドリフト・健全性)を満たし、'
      + '摂動から回復する。**条件を宣言していない系は「未測定」である**(完走を構造安定と書かない)。' },
  { key: 'numeric', name: '数値成立',
    rule: '3 段(h, h/2, h/4)が揃い・観測次数の推定が立ち・次数ガード \\|p−2\\|≤0.5 を満たし・'
      + 'ε̂ と最終 2 段差が 0.3σ の予算に収まる(AD4+AE3)。' },
  // 第275便a(R33 の処置 P2): **外挿残差**を観測成立から切り離した列。第274便a はここに
  // `|nSigmaExt|≤3` を書いて「観測成立」と呼んでいたが、**外挿残差は門を通っていない**。
  { key: 'extrapolated', name: '外挿残差',
    rule: '**門を通っていない残差**(Richardson 外挿や器の判定段の値と観測値の σ 倍)が \\|nσ\\| ≤ 3 か。'
      + '**これは観測成立ではない** —— σ_obs だけで割った生の残差であって、ε_num も写像の宣言も'
      + '入っていない。門を持つ行(較正)では**この列は使わない**(未測定)。',
    forLabel: false },
  { key: 'observation', name: '観測成立',
    rule: '門(\\|y_sim−y_obs\\| ≤ 3σ_obs + ε_num)を通った = `合(3σ)`。'
      + '`否(3σ)` は **✗**、保留(数値未解決・mapping-unresolved・未判定)は **未測定**である。'
      + '**門を持たない診断系列は「未測定」である**(第275便a・R33 —— 外挿残差で埋めない)。' },
];
/** ラベルの判定に使う列(**外挿残差は入らない** —— 門を通っていないので)。 */
export const LABEL_COLUMNS = COLUMNS.filter((c) => c.forLabel !== false).map((c) => c.key);
export const LABEL = '引きずりが完全に消えている空間メッシュ状態(候補)';
export const LABEL_RULE = '**kF1 側の観測成立が ✗(否 3σ)**かつ **kF0 側の判定 4 列'
  + '(走行成立・構造安定・数値成立・観測成立)がすべて ✓** の行だけに付く。'
  + '**外挿残差の列はラベルの判定に入れない**(門を通っていないので — 第275便a・R33)。'
  + '**候補である** —— 較正完了でも「引きずりが消えたことの確認」でもない。'
  + '付けるときは**対象量・窓・作用**を添える。';
export const DO_NOT_WRITE = [
  'kF0 版が成立した(観測と合った)', '引きずりが完全に消えていることを確認した',
  '潮汐ロックへ収束することを証明した', '銀河が安定した', '腕が創発した',
  '判定が増えた', '較正が完了した', 'kF0 = 較正完了',
];

// ---------------------------------------------------------------- 対の宣言(id の規約ではなく宣言)
// 「同じ天体系の kFrame=0 版と kFrame=1 版」の対。**f が一緒に動いていれば k のみの対照ではない**。
export const KF_PAIRS = [
  { k0: 'earthMoonReal', k1: 'earthMoonRealKF1', why: '🌙 / 🌘 地球・月' },
  { k0: 'mercuryReal', k1: 'mercuryRealKF1', why: '☄️ / 🪨 水星' },
  { k0: 'saturnRingReal', k1: 'saturnRingRealKF1', why: '💍 / 💿 土星の環' },
  { k0: 'alphaCenAB', k1: 'alphaCenABDFM', why: '✨ / ✴️ α Cen AB' },
  { k0: 'siriusAB', k1: 'siriusABDFM', why: '🌟 / 💫 Sirius AB' },
  { k0: 'psrDoubleAB', k1: 'psrDoubleABDFM', why: '📻 / ⚡ J0737−3039' },
  { k0: 'psrB1534', k1: 'psrB1534DFM', why: '📿 / 🧶 B1534+12' },
  { k0: 'gw150914', k1: 'gw150914DFM', why: '🎐 / 🎻 GW150914' },
];

const rd = (rel) => JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
const num = (v) => (Number.isFinite(Number(v)) ? Number(v) : null);
const fx = (v, n = 6) => (Number.isFinite(v) ? Number(v).toPrecision(n) : '—');

const INPUTS = [
  'tests/out/presetaxes-w275a.json',
  'tests/out/calaudit-w249.json',
  'tests/out/charon-w272b.json',
  'tests/out/nslockledger-w273c.json',
  'tests/out/galaxydiag-w271d.json',
  'tests/out/kf0-w259d.json',
  // 第282便a(R78): f の列は**基準質量との数値比較**(正本 calcontract-w282a.json の fEffective)から読む
  'tests/out/calcontract-w282a.json',
];
const CODE = ['tests/exp-w275a-kf0ledger.mjs', 'tests/lib-w272e-provenance.mjs'];

const cal = rd('tests/out/calaudit-w249.json');
const charon = rd('tests/out/charon-w272b.json');
const nslock = rd('tests/out/nslockledger-w273c.json');
const gdiag = rd('tests/out/galaxydiag-w271d.json');
const w259d = rd('tests/out/kf0-w259d.json');
// 第282便a(統括の検証項目 R78): **f は基準質量との数値比較で出す**。旧版は calaudit の `correlates.massFactor`
//   (= `massCalibration.factor`、**台帳が無ければ 1**)を f の列に書いていた —— 台帳を持たない ⏰ gw150914Merge4s
//   (質量は 🎐 の実質 2 倍)が f=1 と表示されていた。本版は正本 `tests/out/calcontract-w282a.json` の
//   fEffective(基準質量〔massCalibration.baseMass・宣言した観測版の対・観測解そのもの〕と現 m の比)を読み、
//   **基準質量が無い本は「出典不明」**と書く(推定で埋めない)。旧値は massFactorDeclared に残す。
const calContract = rd('tests/out/calcontract-w282a.json');
const fEff = new Map((calContract.rows || []).map((z) => [z.id, z]));
const fOf = (id, fallback) => { const z = fEff.get(id);
  if (!z) return { f: fallback, source: 'calcontract に行が無い(旧値のまま)', kind: 'fallback' };
  return { f: Number.isFinite(z.fEffective) ? z.fEffective : null, source: z.fSource, kind: z.fSourceKind }; };
// 文書の f のセル: 基準質量が無ければ「出典不明」・観測版の対の**宣言質量**との比(基準そのものは出典不明)には † を付ける
const fCell = (f, kind) => (f === null || f === undefined) ? '出典不明'
  : fx(f, 8) + ((kind === 'twin-unknown' || kind === 'twin-total') ? '†' : '');
// 第275便a(R33 の処置 P1): **対照の軸**(k を除く 5 成分)。器 `tests/exp-w275a-presetaxes.mjs`。
const axesDoc = rd('tests/out/presetaxes-w275a.json');
const AXIS_KEYS = axesDoc.meta.axisKeys;
const axes = new Map((axesDoc.rows || []).map((r) => [r.id, r]));
/** k を除く 5 成分がすべて同一か(**これが「f 固定・k のみの対照」の定義**である)。 */
function axisDiff(idA, idB) {
  const a = axes.get(idA), b = axes.get(idB);
  if (!a || !b) return { known: false, same: false, differing: null,
    why: '軸の正本に ' + (!a ? idA : idB) + ' が無い(宣言を読めていないので「k のみ」とは言えない)' };
  const differing = AXIS_KEYS.filter((k) => String(a[k]) !== String(b[k]));
  return { known: true, same: differing.length === 0, differing,
    values: AXIS_KEYS.reduce((o, k) => { o[k] = [a[k], b[k]]; return o; }, {}),
    kFrames: [a.kFrame, b.kFrame] };
}

// ================================================================ 較正 37 本
const kf0Health = new Map(((cal.kf0Runs || {}).health || []).map((h) => [h.id, h]));
const kf0Applied = (cal.kf0Runs || {}).applied || [];

function sideAssess(rec, k, health) {
  const qs = (rec.quantities || []).filter((q) => {
    const mc = q.measurementContext || {};
    return Number(mc.kFrame) === k && q.kind && q.kind !== 'other';
  });
  if (!qs.length) {
    return { present: false, run: COL.NA, structure: COL.NA, numeric: COL.NA,
      extrapolated: COL.NA, observation: COL.NA,
      why: 'この系に kFrame=' + k + ' の走行が無い(対照走行そのものが行われていない)' };
  }
  // 走行成立
  let run = COL.NA, runEvidence = null;
  const useHealth = (k === 0 && Number(((rec.correlates) || {}).kFrame) !== 0) ? health : null;
  if (useHealth) {
    run = useHealth.runComplete ? COL.OK : COL.NG;
    runEvidence = { source: 'calaudit-w249.json#kf0Runs.health', nan: useHealth.nan,
      clamp: useHealth.clamp, stoppedBy: useHealth.stoppedBy, periastraOk: useHealth.periastraOk,
      stages: useHealth.stages };
  } else if (rec.run) {
    const ok = (rec.run.nan === false) && (Number(rec.run.clamp) === 0);
    run = ok ? COL.OK : COL.NG;
    runEvidence = { source: 'calaudit-w249.json#presets[].run', nan: rec.run.nan,
      clamp: rec.run.clamp, stoppedBy: (rec.run.stopRule || {}).stoppedBy || null,
      periastraOk: (rec.run.stopRule || {}).periastraOk === undefined
        ? null : rec.run.stopRule.periastraOk };
  }
  // 数値成立(σ が門に繋がっている量だけで見る)
  const sig = qs.filter((q) => q.gate && Number(q.gate.sigma) > 0);
  const convOk = sig.filter((q) => q.gate.convergence && q.gate.convergence.ok === true);
  const three = sig.filter((q) => q.gate.convergence && Number(q.gate.convergence.steps) >= 3);
  let numeric = COL.NA;
  if (convOk.length) numeric = COL.OK;
  else if (three.length) numeric = COL.NG;
  // 観測成立
  const ok3 = qs.filter((q) => q.gate && q.gate.status === '合(3σ)');
  const ng3 = qs.filter((q) => q.gate && q.gate.status === '否(3σ)');
  let observation = COL.NA;
  if (ok3.length) observation = COL.OK;
  else if (ng3.length) observation = COL.NG;
  const st = {};
  for (const q of qs) { const s = (q.gate || {}).status || '(門なし)'; st[s] = (st[s] || 0) + 1; }
  return { present: true, run, structure: COL.NA, numeric, extrapolated: COL.NA, observation,
    // 第275便a(R33 の処置 P2): 較正行は**門を持つ**ので、外挿残差の列は使わない(未測定)。
    extrapolatedWhy: '**この行は門を持っている**(σ が接続した量の `gate.status` で観測成立を決める)ので、'
      + '門を通らない外挿残差の列は使わない —— 二重に書かないためである。',
    runEvidence,
    structureWhy: '**較正 2 体系には形状条件を宣言していない**(第274便a 時点)。'
      + '宣言が無いので「未測定」である —— 完走を構造安定と書かない。',
    nQuantities: qs.length, nWithSigma: sig.length, gateByStatus: st,
    numericEvidence: { convergedKeys: convOk.map((q) => q.gate.key),
      threeStageKeys: three.map((q) => q.gate.key),
      orders: convOk.map((q) => ({ key: q.gate.key, order: num(q.gate.convergence.order),
        epsHatInSigma: num(q.gate.convergence.epsHatInSigma),
        assessedStage: q.gate.convergence.assessedStage || null })) },
    observationEvidence: { okKeys: ok3.map((q) => q.gate.key), ngKeys: ng3.map((q) => q.gate.key),
      nSigma: qs.filter((q) => q.gate && Number.isFinite(q.gate.nSigma))
        .map((q) => ({ key: q.gate.key, nSigma: q.gate.nSigma, status: q.gate.status })) } };
}

const calRows = [];
for (const rec of (cal.presets || [])) {
  const pk = num((rec.correlates || {}).kFrame);
  const fDecl = num((rec.correlates || {}).massFactor);
  const fe = fOf(rec.id, fDecl);
  const f = fe.f;
  const kf1 = sideAssess(rec, 1, null);
  const kf0 = sideAssess(rec, 0, kf0Health.get(rec.id) || null);
  const appliedHere = kf0Applied.filter((z) => z.id === rec.id);
  calRows.push({ scope: 'calibration', id: rec.id, emoji: rec.emoji, name: rec.name,
    declaredKFrame: pk, massFactor: f, massFactorSource: fe.source, massFactorSourceKind: fe.kind, massFactorDeclared: fDecl, version: rec.version,
    kf0Source: appliedHere.length ? 'kf0-diagnostic-copy(第274便a・--kf0-runs)'
      : (pk === 0 ? 'preset(宣言そのものが kFrame=0)' : null),
    kf0AppliedRows: appliedHere.map((z) => ({ target: z.target, kind: z.kind, name: z.name,
      kf1Meas: z.kf1Meas, kf0Meas: z.kf0Meas, unit: z.unit, obs: z.obs,
      kf1ResidualPct: z.kf1ResidualPct, kf0ResidualPct: z.kf0ResidualPct, deltaPct: z.deltaPct })),
    kf1, kf0,
    // **f 固定・k のみの対照があるか**
    kOnlyContrast: appliedHere.length
      ? { has: true, how: 'same-preset-diagnostic-copy',
        why: '同じプリセットの複製で `physics.kFrame` の 1 鍵だけを 0 にした走行なので、'
          + '**f も bodies も 1 bit も動いていない**(k のみの対照である)。' }
      : { has: false, how: null, why: 'この系の kF0 と kF1 は同じ走行の中に並んでいない' },
    label: null, labelBasis: null });
}
// 対の宣言から「f 固定・k のみ」を判定する(**f が動いている対は k のみの対照ではない**)
const byId = new Map(calRows.map((r) => [r.id, r]));
const pairs = [];
for (const p of KF_PAIRS) {
  const a = byId.get(p.k0), b = byId.get(p.k1);
  if (!a || !b) { pairs.push(Object.assign({}, p, { missing: true })); continue; }
  const fSame = (a.massFactor !== null && b.massFactor !== null && a.massFactor === b.massFactor);
  // 第275便a(R33 の処置 P1): **f が同じだけでは「k のみの対照」ではない**。
  // k を除く 5 成分(f・D₀・q・frameWeight・bodies)がすべて同一のときだけそう呼ぶ。
  const ax = axisDiff(p.k0, p.k1);
  const kOnly = ax.known && ax.same;
  const diffText = (ax.known && ax.differing.length)
    ? ax.differing.map((k) => k + ' ' + String(ax.values[k][0]) + ' → ' + String(ax.values[k][1])).join(' / ')
    : (ax.known ? '(違いなし)' : (ax.why || '軸が読めない'));
  const row = { k0: p.k0, k1: p.k1, why: p.why, emoji0: a.emoji, emoji1: b.emoji,
    f0: a.massFactor, f1: b.massFactor, fSame,
    kOnly,
    axisKeys: AXIS_KEYS, axisKnown: ax.known, axisDiffering: ax.known ? ax.differing : null,
    axisValues: ax.known ? ax.values : null,
    fDeltaRel: (a.massFactor && b.massFactor) ? (b.massFactor - a.massFactor) / a.massFactor : null,
    kf1Observation: b.kf1.observation, kf0Observation: a.kf0.observation,
    note: kOnly ? '**f 固定・k のみの対照**である(k を除く 5 成分がすべて同一)'
      : '**k のみの対照ではない** —— **k と一緒に動いている軸**: ' + diffText
        + '。**独立な質量補正 f は別軸であり、f と k は別試験で振る**'
        + (fSame ? '(第274便a は f が同じことだけを見て「k のみ」と分類していた〔R33〕)。' : '。') };
  pairs.push(row);
  a.pair = { with: p.k1, side: 'kF0', kOnly, note: row.note, axisDiffering: row.axisDiffering };
  b.pair = { with: p.k0, side: 'kF1', kOnly, note: row.note, axisDiffering: row.axisDiffering };
  if (kOnly) for (const [x, y] of [[a, p.k1], [b, p.k0]]) {
    if ((x.kOnlyContrast || {}).has) continue;
    x.kOnlyContrast = { has: true, how: 'paired-preset', pairedWith: y,
      why: '対 `' + y + '` と **k を除く 5 成分(' + AXIS_KEYS.join('・') + ')がすべて同一**で '
        + 'kFrame だけが違う。**別サンプルの対**なので、同一プリセットの診断コピーより弱い対照である'
        + '(初期条件・停止条件の宣言も別である)。' };
  }
}

// ================================================================ 診断系列
const diagRows = [];
// ---- ❄️ カロン C0(kF1)/ C1(kF0)
{
  const so = charon.stageOrders || {};
  const col = (tag) => (charon.columns || {})[tag] || {};
  const mk = (tag) => {
    const h = col(tag).h || {};
    const o = so[tag] || null;
    const cl = h.clamp || {};
    const clampSum = Object.values(cl).reduce((a, b) => a + (Number(b) || 0), 0);
    const runOk = (h.nan === false) && clampSum === 0;
    let numeric = COL.NA;
    if (o && Number.isFinite(o.pObs)) {
      const guard = Math.abs(o.pObs - 2) <= 0.5;
      const eps = Number.isFinite(o.epsHatSigma) ? Math.abs(o.epsHatSigma) <= 0.3 : false;
      numeric = (o.orderEstimable && guard && eps) ? COL.OK : COL.NG;
    }
    const nSig = o ? num(o.sigma) : num(h.residPctRev !== undefined ? null : null);
    // 第275便a(R33 の処置 P2): **これは門を通っていない外挿残差である**。第274便a は同じ数を
    // 「観測成立」の欄に書いていた。本版は列を分け、**観測成立は「未測定」**にする
    // (カロンの診断列は判定器の門に接続していないので、`合(3σ)` も `否(3σ)` も出ない)。
    const extrapolated = Number.isFinite(nSig) ? (Math.abs(nSig) <= 3 ? COL.OK : COL.NG) : COL.NA;
    return { present: true, run: runOk ? COL.OK : COL.NG, structure: COL.NA,
      numeric, extrapolated, observation: COL.NA,
      runEvidence: { source: 'charon-w272b.json#columns.' + tag + '.h', nan: h.nan,
        clamp: clampSum, stop: h.stop || null, steps: h.steps },
      structureWhy: '**2 体系に形状条件を宣言していない**(未測定)。',
      numericEvidence: o ? { stages: o.stages, pObs: num(o.pObs), epsHat: num(o.epsHat),
        epsHatSigma: num(o.epsHatSigma), assessedStage: o.assessedStage || null,
        orderEstimable: o.orderEstimable === true } : null,
      extrapolatedEvidence: { nSigma: nSig, residPct: o ? num(o.residPct) : num(h.residPctRev),
        cfg: h.cfg || null, source: 'charon-w272b.json#stageOrders.' + tag,
        why: '**門を通っていない残差**(判定段の周期と観測周期の差を σ_obs で割った数)である。' },
      observationEvidence: { nSigma: nSig, residPct: o ? num(o.residPct) : num(h.residPctRev),
        cfg: h.cfg || null, source: 'charon-w272b.json#stageOrders.' + tag,
        why: '**この診断列は判定器の門に接続していない**(較正 37 本の量ではない)ので、'
          + '観測成立は**未測定**である。外挿残差は隣の列にある —— **小さいことは合格ではない**。' },
      gateByStatus: null, nQuantities: 1, nWithSigma: 1 };
  };
  const eps = ['S_e0.05_k0', 'S_e0.025_k0', 'S_e0.0125_k0'].map((t) => {
    const h = col(t).h || {};
    return { column: t, softening: (h.cfg || {}).softening, rev2Sec: num(h.rev2Sec),
      residPctRev: num(h.residPctRev) };
  });
  const signFlip = eps.length >= 2 && eps.some((z) => Number(z.residPctRev) > 0)
    && eps.some((z) => Number(z.residPctRev) < 0);
  diagRows.push({ scope: 'diagnostic', id: 'plutoCharonReal@charon-w272b', emoji: '❄️',
    name: 'カロン 公転周期(同方向1周・2周目) C0(kF1)↔ C1(kF0)',
    declaredKFrame: 1, massFactor: 1, version: 'diagnostic',
    kf0Source: 'charon-w272b.json 列 C1(kFrame 0・f 1・geoPN 2・softening 0.05)',
    kf1: mk('C0'), kf0: mk('C1'),
    kOnlyContrast: { has: true, how: 'same-harness-column',
      why: 'C0 と C1 は同じ器の同じ入力で **kFrame だけ**が 0/1 の列である(f=1 で固定)。' },
    softeningSeries: { columns: eps, signFlip,
      why: '**kF0 の残差は softening ε に依存し、ε を 0.05 → 0.025 で符号が反転する**。'
        + 'ε は観測量ではないので、この符号は物理の符号ではない。' },
    label: null, labelBasis: null });
}
// ---- NS 4 系の lock 枝(kFrame=0・f=1・λ_PN=1)
for (const r of (nslock.rows || [])) {
  const v = r.variants || {};
  const mk = (tag) => {
    const z = v[tag]; if (!z) return { present: false, run: COL.NA, structure: COL.NA,
      numeric: COL.NA, extrapolated: COL.NA, observation: COL.NA, why: '変種 ' + tag + ' が無い' };
    const guard = Number.isFinite(z.pObs) ? Math.abs(z.pObs - 2) <= 0.5 : false;
    return { present: true,
      run: (z.resolved === true) ? COL.OK : COL.NG,
      structure: COL.NA,
      // **ε̂ と 0.3σ の予算は本器(第273便c)で評価していない** —— 次数ガードだけでは数値成立と書かない
      numeric: COL.NA,
      // 第275便a(R33 の処置 P2): `nSigmaExt` は **Richardson 外挿値と観測値の σ 倍**であって
      // 門の判定ではない。第274便a はこれを「観測成立」に書いていた —— 本版は列を分ける。
      extrapolated: Number.isFinite(z.nSigmaExt) ? (Math.abs(z.nSigmaExt) <= 3 ? COL.OK : COL.NG) : COL.NA,
      observation: COL.NA,
      runEvidence: { source: 'nslockledger-w273c.json#rows[].variants.' + tag,
        resolved: z.resolved === true, spec: z.spec || null },
      structureWhy: '**2 体系に形状条件を宣言していない**(未測定)。',
      numericEvidence: { pObs: num(z.pObs), orderGuard: guard,
        why: '3 段は走っているが、**ε̂ と 0.3σ の予算は第273便c の器で評価していない** —— '
          + '次数ガードだけで「数値成立」とは書かない(未測定)。' },
      extrapolatedEvidence: { omegaDotExt: num(z.omegaDotExt), ratioExt: num(z.ratioExt),
        nSigma: num(z.nSigmaExt), obs: r.obs || null,
        source: 'nslockledger-w273c.json',
        why: '**外挿残差である**(ω̇ の Richardson 外挿値と観測値の σ 倍)。門ではない。' },
      observationEvidence: { nSigma: num(z.nSigmaExt), obs: r.obs || null,
        source: 'nslockledger-w273c.json',
        why: '**lock 枝は判定器の門に接続していない**(較正 37 本の量ではない)ので観測成立は'
          + '**未測定**である。第274便a はここに外挿残差を書いていた〔R33〕。' },
      gateByStatus: null, nQuantities: 1, nWithSigma: 1 };
  };
  diagRows.push({ scope: 'diagnostic', id: r.id + '@nslock-lock', emoji: r.emoji,
    name: (r.label || r.id) + ' ω̇(lock 枝: kFrame=0・f=1・λ_PN=1)↔ 内蔵(kFrame=1・f≈2)',
    declaredKFrame: 1, massFactor: num((r.declared || {}).massFactor), version: 'diagnostic',
    kf0Source: 'nslockledger-w273c.json variants.lock(kFrame 0・f 1・λ_PN 1)',
    kf1: mk('builtin'), kf0: mk('lock'),
    kOnlyContrast: { has: false, how: null,
      why: '**lock 枝は f も 1 へ戻している**(内蔵は f≈2)。k のみの対照ではない —— '
        + '同じ f で k だけを 0 にした列は `variants.kf0Ledger` であり、こちらは別欄に出す。' },
    kf0SameF: v.kf0Ledger ? { spec: v.kf0Ledger.spec, ratioExt: num(v.kf0Ledger.ratioExt),
      nSigma: num(v.kf0Ledger.nSigmaExt), pObs: num(v.kf0Ledger.pObs),
      why: '**f 固定(較正値)で k だけ 0**にした列。これが「f 固定・k のみ」の対照である。' } : null,
    root: v.root ? { spec: v.root.spec, ratioExt: num(v.root.ratioExt), nSigma: num(v.root.nSigmaExt),
      why: '比が 1 になる (f, k) の根。**0<k<1 の中間状態**であり、AH1 の近似の側に落ちる。' } : null,
    label: null, labelBasis: null });
}
// ---- 🛞 銀河トイの kFrame=0 対照(**形状条件が宣言されている唯一の系列**)
{
  const cols = (gdiag.quasiSteady || {}).columns || [];
  const crit = ((gdiag.quasiSteady || {}).criteria) || {};
  const pick = (tag) => cols.find((c) => String(c.tag).indexOf(tag) === 0) || null;
  const mk = (c) => {
    if (!c) return { present: false, run: COL.NA, structure: COL.NA, numeric: COL.NA,
      extrapolated: COL.NA, observation: COL.NA, why: '列が無い' };
    const cands = c.candidates || [];
    const healthAll = cands.every((z) => (z.conditions || {}).healthOk === true);
    const structAll = cands.filter((z) => (z.conditions || {}).structureOk === true
      && (z.conditions || {}).velocityOk === true && (z.conditions || {}).healthOk === true);
    return { present: true,
      run: (c.nan === false && healthAll) ? COL.OK : COL.NG,
      structure: structAll.length ? COL.OK : COL.NG,
      numeric: COL.NA,
      extrapolated: COL.NA,
      observation: COL.NA,
      runEvidence: { source: 'galaxydiag-w271d.json#quasiSteady.columns', nan: c.nan,
        clampIncreaseInWindow: cands.map((z) => z.clampIncreaseInWindow),
        tActual: c.tActual, stageDt: c.stageDt },
      structureWhy: '**宣言済みの形状条件**(' + crit.id + ': 構造ドリフト ≤ '
        + crit.structureDriftMax + ' / 速度ドリフト ≤ ' + crit.velocityDriftMaxKmsPerT
        + ' km/s per T / NaN 0 かつ全クランプ 0)を、宣言した 3 候補窓で評価した。',
      structureEvidence: cands.map((z) => ({ window: z.window,
        structureDriftMax: num(z.structureDriftMax),
        velocityDriftMaxKmsPerT: num(z.velocityDriftMaxKmsPerT),
        clampIncreaseInWindow: z.clampIncreaseInWindow, conditions: z.conditions })),
      numericEvidence: { why: '**段を振った走行が無い**(主判定窓は h/4 の 1 段) —— 未測定。' },
      extrapolatedEvidence: { why: '**外挿残差を作っていない**(段を振った走行が無い) —— 未測定。' },
      observationEvidence: { why: '**回転曲線の観測比較は本器の主判定ではない**'
        + '(正本は sparc-w269c.json)。この行は構造の診断であって観測適合の判定ではない —— 未測定。' },
      gateByStatus: null, nQuantities: null, nWithSigma: null };
  };
  const k1 = pick('🛞 ngc3198DFM'), k0 = pick('🛞 kFrame=0');
  diagRows.push({ scope: 'diagnostic', id: 'ngc3198DFM@galaxydiag-w271d', emoji: '🛞',
    name: '銀河トイ NGC 3198(DFM)準定常の形状条件 — 内蔵(kFrame=1)↔ kFrame=0 対照(診断コピー)',
    declaredKFrame: 1, massFactor: null, version: 'diagnostic',
    kf0Source: 'galaxydiag-w271d.json#quasiSteady 列「🛞 kFrame=0 対照(診断コピー)」',
    kf1: mk(k1), kf0: mk(k0),
    kOnlyContrast: { has: true, how: 'same-harness-column',
      why: '同じ器・同じ seed・同じ N で `physics.kFrame` だけを 0 にした診断コピーである。' },
    label: null, labelBasis: null });
}

// ================================================================ ラベル付け(候補)
const rows = calRows.concat(diagRows);
for (const r of rows) {
  const a = r.kf1 || {}, b = r.kf0 || {};
  // 第275便a: **外挿残差の列はラベルの判定に入れない**(門を通っていないので)。
  const kf0AllOk = LABEL_COLUMNS.every((k) => b[k] === COL.OK);
  if (a.observation === COL.NG && kf0AllOk) {
    r.label = LABEL;
    r.labelBasis = { rule: LABEL_RULE,
      quantity: (b.observationEvidence && b.observationEvidence.okKeys)
        ? b.observationEvidence.okKeys : null,
      window: null, action: null,
      note: '**対象量・窓・作用を添えること**(この欄が空のままラベルを出さない)。' };
  }
}
const labelled = rows.filter((r) => r.label);
const kf1NgKf0Ok = rows.filter((r) => (r.kf1 || {}).observation === COL.NG
  && (r.kf0 || {}).observation === COL.OK);

// ================================================================ 集計
const tallySide = (key) => {
  const t = {};
  for (const c of COLUMNS) { t[c.key] = { [COL.OK]: 0, [COL.NG]: 0, [COL.NA]: 0 }; }
  for (const r of rows) { const s = r[key] || {};
    for (const c of COLUMNS) { const v = s[c.key] || COL.NA; t[c.key][v] = (t[c.key][v] || 0) + 1; } }
  return t;
};
const summary = {
  nRows: rows.length, nCalibration: calRows.length, nDiagnostic: diagRows.length,
  kf1: tallySide('kf1'), kf0: tallySide('kf0'),
  nKf0RunApplied: kf0Applied.length,
  nLabelled: labelled.length,
  labelledIds: labelled.map((r) => r.id),
  kf1NgKf0OkIds: kf1NgKf0Ok.map((r) => r.id),
  nKOnlyContrast: rows.filter((r) => (r.kOnlyContrast || {}).has === true).length,
  kOnlyContrastIds: rows.filter((r) => (r.kOnlyContrast || {}).has === true).map((r) => r.id),
  nPairsKOnly: pairs.filter((p) => p.kOnly === true).length,
  pairsKOnly: pairs.filter((p) => p.kOnly === true).map((p) => p.k0 + '↔' + p.k1),
  pairsNotKOnly: pairs.filter((p) => p.kOnly === false).map((p) => p.k0 + '↔' + p.k1),
  // 第275便a(R33 の処置 P1): **f が同じ**だけの対は何組あったか(第274便a はこれを「k のみ」と数えた)
  nPairsFSameOnly: pairs.filter((p) => p.fSame === true && p.kOnly === false).length,
  pairsFSameOnly: pairs.filter((p) => p.fSame === true && p.kOnly === false)
    .map((p) => ({ pair: p.k0 + '↔' + p.k1, differing: p.axisDiffering })),
  axisKeys: AXIS_KEYS,
  axisOnlyKGroupsInBuiltins: (axesDoc.kOnlyGroups || []).map((g) => g.ids.join('↔')),
  observationDecided: {
    kf1Ok: rows.filter((r) => (r.kf1 || {}).observation === COL.OK).map((r) => r.id),
    kf1Ng: rows.filter((r) => (r.kf1 || {}).observation === COL.NG).map((r) => r.id),
    kf0Ok: rows.filter((r) => (r.kf0 || {}).observation === COL.OK).map((r) => r.id),
    kf0Ng: rows.filter((r) => (r.kf0 || {}).observation === COL.NG).map((r) => r.id),
  },
};

// ================================================================ 出力(JSON)
const out = {
  meta: Object.assign(provenanceMeta({ root: ROOT, wave: '第275便a(第65報・判定器便: R33 の対照分類と観測列の分離)',
    target: 'beta/index.html', inputs: INPUTS, code: CODE }),
  { ledgerVersion: LEDGER_VERSION,
    question: '**「kFrame=1 が成立しないサンプルで、kF0 版が成立しているか」**(原仮定者の優先課題・第64報)',
    answerRule: '**判定 4 列(走行成立・構造安定・数値成立・観測成立)がすべて ✓ のときだけ'
      + '「成立」と書く**。完走だけを成立と書かない。**外挿残差は判定に入れない**(第275便a・R33)。'
      + '**「kF1 不成立・kF0 成立」と言えるのは、kF1 が 否(3σ) で kF0 が 合(3σ) の行だけである** ——'
      + '保留(数値未解決・mapping-unresolved・未判定)は「不成立」ではない。',
    causality: '**採る**: 「連星が kFrame≈0 で安定なら相対メッシュ運動が消え、**独立の**同期トルクで'
      + '自転が公転へ引き込まれる。その極限が相互潮汐ロック」。'
      + '**採らない**: 「ロックしているから k≈0 と置く」。'
      + '同期率から k を作る診断式は比較用に残すが、**因果の検証は k を外から固定し'
      + '非同期から出発する試験**で行う(同期率→k の循環を作らない)。'
      + '**0<k<1 で安定するなら中間状態**(AH1 の近似)。**独立な質量補正 f は常に別軸**である。',
    doNotWrite: DO_NOT_WRITE }),
  columns: COLUMNS,
  labelColumns: LABEL_COLUMNS,
  label: { text: LABEL, rule: LABEL_RULE, columns: LABEL_COLUMNS },
  axes: { file: 'tests/out/presetaxes-w275a.json', version: axesDoc.meta.axesVersion,
    keys: AXIS_KEYS, rule: axesDoc.meta.rule,
    kOnlyGroupsInBuiltins: axesDoc.kOnlyGroups || [] },
  summary, pairs, rows,
  kf0RunsFromCalaudit: { on: (cal.kf0Runs || {}).on === true,
    stages: (cal.kf0Runs || {}).stages || null,
    nApplied: kf0Applied.length, applied: kf0Applied,
    conditionMismatchAfter: (cal.conditionMismatch || {}).n,
    charonCitation: (cal.kf0Runs || {}).charonCitation || null },
  w259dCrossCheck: { file: 'tests/out/kf0-w259d.json', wave: (w259d.meta || {}).wave || '第259便d',
    what: '**第259便d の 1 段(dt=0.016・2 公転)の kF0 対照**。本便の走行は同じ html の同じ定義で'
      + '**停止条件と段が違う**(60 公転・h/2・h/4)ので、値が一致する必要は無い ——'
      + '**同じ向き・同じ桁であることだけを見る**。',
    rows: (w259d.rows || []).map((z) => ({ id: z.id, emoji: z.emoji, row: z.row,
      targets: (z.rows || []).map((t) => ({ label: t.label, kf1ResidPct: num(t.kf1ResidPct),
        kf0ResidPct: num(t.kf0ResidPct), diffPct: num(t.diffPct) })) })) },
};
fs.writeFileSync(OUT_JSON, JSON.stringify(out, null, 1));

// ================================================================ 出力(文書)
const colCell = (s) => COLUMNS.map((c) => (s && s[c.key]) ? s[c.key] : COL.NA).join(' ');
const lines = [];
lines.push('# kF0 棚卸し表(v1.45 開発中 — 第275便a 改版)');
lines.push('');
lines.push('**この文書は機械生成である**(生成器 `tests/exp-w275a-kf0ledger.mjs` / 正本'
  + ' `tests/out/kf0ledger-w275a.json`)。**手で数字を書き換えない** —— 生成器を直して作り直す。');
lines.push('');
lines.push('**第275便a の改版点**(統括の検証項目 R33 —— **判定は 1 つも動かしていない**): '
  + '**(P1)** 「f 固定・k のみの対照」を、**k を除く 5 成分(' + AXIS_KEYS.join('・') + ')が'
  + 'すべて同一**のときだけに限定した(第274便a は **f が同じかどうかだけ**を見ていた)。'
  + '**(P2)** 「観測成立」に書いていた `|nσ|≤3` の**外挿残差**を別の列へ分けた —— '
  + '**門を通っていない残差は観測成立ではない**。');
lines.push('');
lines.push('答える問い: ' + out.meta.question);
lines.push('');
lines.push('## 0. 読み方(5 列 — 統括の検証項目 R28 の 4 列 + 第275便a で分けた「外挿残差」)');
lines.push('');
lines.push('| 列 | 何を見るか |');
lines.push('| --- | --- |');
for (const c of COLUMNS) lines.push('| **' + c.name + '** | ' + c.rule + ' |');
lines.push('');
lines.push('**完走だけを「成立」と書かない。** ' + out.meta.answerRule);
lines.push('');
lines.push('**判定に使う列は ' + LABEL_COLUMNS.length + ' 本**(`' + LABEL_COLUMNS.join('` / `')
  + '`)で、**外挿残差は記録専用**である。');
lines.push('');
lines.push('**因果の向き(原仮定者の裁定・第64報)**: ' + out.meta.causality);
lines.push('');
lines.push('診断ラベル **「' + LABEL + '」**: ' + LABEL_RULE);
lines.push('');
lines.push('## 1. 集計(実測)');
lines.push('');
lines.push('| 量 | 値 |');
lines.push('| --- | --- |');
lines.push('| 行数(較正 / 診断系列) | ' + summary.nRows + '(' + summary.nCalibration
  + ' / ' + summary.nDiagnostic + ') |');
lines.push('| kF0 対照走行を配った行(calaudit `--kf0-runs`) | ' + summary.nKf0RunApplied + ' |');
lines.push('| 配布後の `condition-mismatch` | ' + out.kf0RunsFromCalaudit.conditionMismatchAfter + ' |');
for (const c of COLUMNS) {
  lines.push('| kF1 側 ' + c.name + '(' + COL.OK + '/' + COL.NG + '/' + COL.NA + ') | '
    + summary.kf1[c.key][COL.OK] + ' / ' + summary.kf1[c.key][COL.NG] + ' / ' + summary.kf1[c.key][COL.NA] + ' |');
  lines.push('| kF0 側 ' + c.name + '(' + COL.OK + '/' + COL.NG + '/' + COL.NA + ') | '
    + summary.kf0[c.key][COL.OK] + ' / ' + summary.kf0[c.key][COL.NG] + ' / ' + summary.kf0[c.key][COL.NA] + ' |');
}
lines.push('| **「kF1 不成立(否 3σ)・kF0 成立(合 3σ)」の行** | **' + kf1NgKf0Ok.length + '** |');
lines.push('| **診断ラベルが付いた行** | **' + summary.nLabelled + '** |');
lines.push('| f 固定・k のみの対照を持つ行 | ' + summary.nKOnlyContrast + ' |');
lines.push('');
lines.push('## 2. 較正 ' + calRows.length + ' 本');
lines.push('');
lines.push('列は 5 列を **' + COLUMNS.map((c) => c.name).join(' ') + '** の順に並べたものである'
  + '(**外挿残差**は第275便a で観測成立から切り離した列 —— R33)。');
lines.push('');
const COLHEAD = COLUMNS.map((c) => c.name).join(' ');
lines.push('**f の列**(第282便a・R78): **基準質量との数値比較**(`tests/out/calcontract-w282a.json` の fEffective —— '
  + '`massCalibration.baseMass`・宣言した観測版の対・観測解そのもの、のどれかと現 m の比)。`massCalibration` が無いことを '
  + 'f=1 の根拠にしない(台帳を持たない ⏰ `gw150914Merge4s` は実質 ' + fx((fEff.get('gw150914Merge4s') || {}).fEffective, 8)
  + ')。**基準質量が無い本は「出典不明」**。**†** は観測版の対の**宣言質量**との比(その対の基準質量そのものは出典不明)。');
lines.push('');
lines.push('| # | 系 | 宣言 kFrame | f | kF1 側(' + COLHEAD + ') | kF0 側(' + COLHEAD + ') | f 固定・k のみの対照 | ラベル |');
lines.push('| ---: | --- | ---: | ---: | --- | --- | --- | --- |');
calRows.forEach((r, i) => {
  const how = (r.kOnlyContrast || {}).how;
  const kc = (r.kOnlyContrast || {}).has
    ? (how === 'paired-preset' ? 'あり(対 `' + r.kOnlyContrast.pairedWith + '`・f 同一)'
      : 'あり(同一プリセットの診断コピー)')
    : (r.pair ? 'なし(対 `' + r.pair.with + '` は '
        + ((r.pair.axisDiffering || []).join('・') || '他の軸') + ' も動く)' : 'なし');
  lines.push('| ' + (i + 1) + ' | ' + (r.emoji || '') + ' `' + r.id + '` | ' + r.declaredKFrame
    + ' | ' + fCell(r.massFactor, r.massFactorSourceKind) + ' | ' + colCell(r.kf1) + ' | ' + colCell(r.kf0)
    + ' | ' + kc + ' | ' + (r.label ? '**' + r.label + '**' : '—') + ' |');
});
lines.push('');
lines.push('## 3. 診断系列 ' + diagRows.length + ' 行');
lines.push('');
lines.push('| # | 系列 | kF1 側(' + COLHEAD + ') | kF0 側(' + COLHEAD + ') | kF0 側の根拠 | ラベル |');
lines.push('| ---: | --- | --- | --- | --- | --- |');
diagRows.forEach((r, i) => {
  lines.push('| ' + (i + 1) + ' | ' + (r.emoji || '') + ' ' + r.name + ' | ' + colCell(r.kf1)
    + ' | ' + colCell(r.kf0) + ' | `' + String(r.kf0Source).replace(/\|/g, '/') + '` | '
    + (r.label ? '**' + r.label + '**' : '—') + ' |');
});
lines.push('');
lines.push('## 4. kF0 対照走行を配った行(calaudit `--kf0-runs`)');
lines.push('');
if (!kf0Applied.length) {
  lines.push('**0 行**(`--kf0-runs` を通した正本ではない)。');
} else {
  lines.push('| 系 | 対象 | 行 | 観測 | kF1 実測 | kF0 実測 | kF1 残差 % | kF0 残差 % | kF1→kF0 の変化 % |');
  lines.push('| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |');
  for (const z of kf0Applied) {
    lines.push('| ' + (z.emoji || '') + ' `' + z.id + '` | ' + z.target + ' | ' + z.name
      + ' | ' + fx(z.obs, 10) + ' | ' + fx(z.kf1Meas, 10) + ' | ' + fx(z.kf0Meas, 10)
      + ' | ' + fx(z.kf1ResidualPct, 4) + ' | ' + fx(z.kf0ResidualPct, 4)
      + ' | ' + fx(z.deltaPct, 4) + ' |');
  }
  lines.push('');
  lines.push('**残差が小さくなったことは「合った」ではない** —— これらの行の観測欄には σ が'
    + '1 本も繋がっていない(太陽系 19 本の切断点)ので、**門は 3σ の判定に入れない**。'
    + '動いたのは「条件が違う」から「条件は合っている(まだ判定できない)」への 1 段だけである。');
}
lines.push('');
lines.push('## 4b. 対の軸(第275便a・R33 の処置 P1)');
lines.push('');
lines.push('「**f 固定・k のみの対照**」は、**k を除く 5 成分(`' + AXIS_KEYS.join('` / `')
  + '`)がすべて同一**のときだけそう呼ぶ。第274便a は **f(massFactor)が同じかどうかだけ**を'
  + '見ていたので、D₀・q・frameWeight・bodies が一緒に動いている対も「k のみ」と分類していた。'
  + '軸の正本は `tests/out/presetaxes-w275a.json`(内蔵の**宣言**をそのまま読む)。');
lines.push('');
lines.push('| 対 | kFrame | f | **k のみの対照か** | k と一緒に動いている軸 |');
lines.push('| --- | --- | ---: | --- | --- |');
for (const q of pairs) {
  if (q.missing) { lines.push('| `' + q.k0 + '` ↔ `' + q.k1 + '` | — | — | 軸が読めない | — |'); continue; }
  const dif = (q.axisDiffering || []);
  lines.push('| ' + (q.emoji0 || '') + ' `' + q.k0 + '` ↔ ' + (q.emoji1 || '') + ' `' + q.k1 + '` '
    + '(' + q.why + ') | ' + (q.axisValues ? '0 → 1' : '—') + ' | '
    + fCell(q.f0, (byId.get(q.k0) || {}).massFactorSourceKind) + ' → ' + fCell(q.f1, (byId.get(q.k1) || {}).massFactorSourceKind) + ' | '
    + (q.kOnly ? '**はい**' : 'いいえ') + ' | '
    + (dif.length ? dif.map((k) => '`' + k + '` ' + String(q.axisValues[k][0]).slice(0, 22)
      + ' → ' + String(q.axisValues[k][1]).slice(0, 22)).join(' / ') : '(なし)') + ' |');
}
lines.push('');
lines.push('**内蔵 ' + (axesDoc.nPresets) + ' 本の中で「k を除く 5 成分がすべて同一で kFrame だけが違う」'
  + '束は ' + (axesDoc.kOnlyGroups || []).length + ' 組**である'
  + ((axesDoc.kOnlyGroups || []).length
    ? '(' + (axesDoc.kOnlyGroups || []).map((g) => '`' + g.ids.join('` ↔ `') + '`').join(' , ') + ')'
    : '')
  + '。**宣言した対 ' + pairs.length + ' 組のうち、この定義を満たすのは '
  + pairs.filter((q) => q.kOnly === true).length + ' 組である。**');
lines.push('');
lines.push('## 5. 未測定の一覧(理由つき — 推定で埋めない)');
lines.push('');
lines.push('| 行 | 側 | 列 | 未測定の理由 |');
lines.push('| --- | --- | --- | --- |');
for (const r of rows) {
  for (const [key, s] of [['kF1', r.kf1], ['kF0', r.kf0]]) {
    if (!s) continue;
    if (!s.present) { lines.push('| ' + (r.emoji || '') + ' `' + r.id + '` | ' + key
      + ' | 4 列すべて | ' + (s.why || '走行が無い') + ' |'); continue; }
    for (const c of COLUMNS) {
      if (s[c.key] !== COL.NA) continue;
      const why = (c.key === 'structure') ? (s.structureWhy || '')
        : (c.key === 'numeric') ? ((s.numericEvidence && s.numericEvidence.why)
          || '3 段・次数・ε̂ の条件が揃っていない(σ が門に繋がっていない量を含む)')
        : (c.key === 'extrapolated') ? (s.extrapolatedWhy
          || (s.extrapolatedEvidence && s.extrapolatedEvidence.why)
          || '門を通らない残差を作っていない(段を振った走行・外挿が無い)')
        : (c.key === 'observation') ? ((s.observationEvidence && s.observationEvidence.why)
          || '門が保留(数値未解決 / mapping-unresolved / 未判定)である')
        : '走行の記録が無い';
      lines.push('| ' + (r.emoji || '') + ' `' + r.id + '` | ' + key + ' | ' + c.name
        + ' | ' + String(why).replace(/\|/g, '/') + ' |');
    }
  }
}
lines.push('');
lines.push('## 6. 書かないこと');
lines.push('');
for (const s of DO_NOT_WRITE) lines.push('- ' + s);
lines.push('');
lines.push('---');
lines.push('');
lines.push('生成: ' + out.meta.generatedAt + ' / 対象 `' + out.meta.target + '` sha256 `'
  + String(out.meta.targetSha256).slice(0, 16) + '…` / 表の版 `' + LEDGER_VERSION + '`');
fs.writeFileSync(OUT_DOC, lines.join('\n') + '\n');

console.error('[w275a] kF0 棚卸し表: 行 ' + rows.length + '(較正 ' + calRows.length
  + ' / 診断 ' + diagRows.length + ')・kF0 配布 ' + kf0Applied.length
  + ' 行・ラベル ' + labelled.length + ' 行・「kF1 否・kF0 合」 ' + kf1NgKf0Ok.length + ' 行');
console.error('[w275a] wrote ' + OUT_JSON);
console.error('[w275a] wrote ' + OUT_DOC);
