// 第286便f(原仮定者の裁定(第76報)AN44「量ごとに窓と誤差予算」): **宣言表 tests/data-w286f-budget.json を読むだけの純関数**。
//   判定器(tests/exp-w249b-calaudit.mjs)は量ごとの行へ `budget` 欄を写すだけで、**門の合否の規則は変えない**
//   (gate の status・nSigma・numBound は 1 ビットも触らない)。QA `behavior.calauditBudgetTable` が同じ関数で表の形と全量の被覆を見る。
//   ・σ がある量: 数値誤差予算 ε_num ≤ factor × σ(factor 0.3 は**提案値**であって合意済みの閾値ではない)
//   ・σ の無い量: 事前に宣言した絶対幅/相対幅(結果を見て広げない)
//   ・窓不足・量の不一致を幅で救わない / 周期・近点移動・離心率を同じ契約にしない(種類ごとに窓と予算を分ける)
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export const BUDGET_TABLE_FILE = 'tests/data-w286f-budget.json';
export const BUDGET_LIB_VERSION = 'w287b-budgetlib-2';   // 第287便b: 採用(adopted)の表の検査を足した(w286f-budgetlib-1 → 2)
export const BUDGET_KINDS = ['period', 'precession', 'ecc', 'spin', 'other'];
export const BUDGET_MODES = ['sigma', 'relative', 'absolute', 'not-judged'];

export function loadBudgetTable(root) {
  const f = path.join(root, BUDGET_TABLE_FILE);
  const text = fs.readFileSync(f, 'utf8');
  return { table: JSON.parse(text), sha256: crypto.createHash('sha256').update(text).digest('hex') };
}

/** 量の行の鍵(門の鍵と同じ形 —— id|target|kind)。 */
export function budgetKey(id, q) { return id + '|' + (q && q.target !== undefined ? q.target : null) + '|' + (q ? q.kind : null); }

/** 行に σ があるか(門へ届いた σ —— 判定器が読んだ値だけ)。 */
function sigmaOf(q) {
  const g = (q && q.gate) || {};
  if (Number.isFinite(g.sigma) && g.sigma > 0) return g.sigma;
  if (q && Number.isFinite(q.obsSigmaCsv) && q.obsSigmaCsv > 0) return q.obsSigmaCsv;
  return null;
}

/**
 * 1 行の窓と予算を宣言表から引く(entries の鍵が優先・無ければ種類の既定)。**判定しない** —— 写すだけ。
 * @returns {{version,source,key,kind,window,budget,withSigma,sigma,allowance,allowanceUnit,rules}|null}
 */
export function resolveBudget(table, id, q) {
  if (!table || !q) return null;
  const key = budgetKey(id, q);
  const kindDecl = (table.kinds || {})[q.kind] || null;
  const ent = (table.entries || []).find((z) => z.key === key) || null;
  if (!kindDecl && !ent) return null;
  const sigma = sigmaOf(q);
  const withSigma = sigma !== null;
  const window = (ent && ent.window) || (kindDecl && kindDecl.window) || null;
  const bset = Object.assign({}, (kindDecl && kindDecl.budget) || {}, (ent && ent.budget) || {});
  const b = withSigma ? (bset.withSigma || null) : (bset.noSigma || null);
  let allowance = null, allowanceUnit = null;
  if (b && b.mode === 'sigma') { const k = Number.isFinite(b.factor) ? b.factor : (table.sigmaBudget || {}).factor; allowance = k * sigma; allowanceUnit = q.unit || null; }
  else if (b && b.mode === 'absolute') { allowance = b.width; allowanceUnit = b.unit || q.unit || null; }
  else if (b && b.mode === 'relative') {
    const base = b.of === 'obs' ? q.obs : (Number.isFinite(q.meas) ? q.meas : q.model);
    const rel = Number.isFinite(base) ? Math.abs(base) * b.width : null;
    allowance = (rel === null) ? (Number.isFinite(b.floorAbs) ? b.floorAbs : null) : Math.max(rel, Number.isFinite(b.floorAbs) ? b.floorAbs : 0);
    allowanceUnit = b.unit || q.unit || null;
  }
  return { version: table.version, source: ent ? 'entry' : 'kind', key, kind: q.kind, window, budget: b,
    withSigma, sigma, allowance: Number.isFinite(allowance) ? allowance : null, allowanceUnit,
    sigmaFactorStatus: (b && b.mode === 'sigma') ? ((table.sigmaBudget || {}).status || null) : null,
    first: ent ? !!ent.first : false };
}

/**
 * 正本の行へ写す**短い形**(文言は正本の `budgetTable` に 1 部だけ —— 316 行に同じ説明を複製しない)。
 */
export function compactBudget(r) {
  if (!r) return null;
  const b = r.budget || {};
  return { v: r.version, src: r.source, mode: b.mode || null,
    factor: Number.isFinite(b.factor) ? b.factor : null, width: Number.isFinite(b.width) ? b.width : null, of: b.of || null,
    floorAbs: Number.isFinite(b.floorAbs) ? b.floorAbs : null,
    withSigma: r.withSigma, allowance: r.allowance, unit: r.allowanceUnit,
    needPeriastra: r.window ? r.window.needPeriastra : null, orbits: r.window ? r.window.orbits : null,
    factorStatus: r.sigmaFactorStatus };
}

/**
 * 宣言表の形の検査(QA と判定器の自己検査が同じ 1 本を使う)。calaudit を渡すと**全量の被覆**も見る。
 */
export function auditBudgetTable(table, calaudit) {
  const bad = [];
  if (!table || typeof table !== 'object') return { ok: false, bad: ['表が読めない'] };
  // 第287便b(原仮定者の裁定(第77報)AN62): 版 w287b-budget-2 —— 0.3σ を**数値誤差予算の上限**として採用(status "adopted")。
  //   採用の表には「観測差を許す幅ではない」「3σ 門は広げない」「σ の無い量に 1% 等を補わない」と |Q_h−Q_h/2|/3 の条件(errorEstimate)・
  //   前の版(提案値)の履歴が要る。旧版 w286f-budget-1(提案値)の形も読める(履歴の表の検査)
  if (!/^w28[67][a-z]-budget-\d+$/.test(String(table.version))) bad.push('版が w286f-budget-N / w287b-budget-N でない');
  const sb = table.sigmaBudget || {};
  if (sb.status === 'adopted') {
    const t = String(sb.note || '') + '\n' + String(sb.definition || '') + '\n' + String(sb.notA || '');
    if (!(sb.factor === 0.3 && /数値誤差予算の上限/.test(t) && /観測差を許す幅ではない/.test(t) && /3σ 門は広げない/.test(t) && /1% 等を補わない/.test(t)))
      bad.push('0.3σ の採用の注記(数値誤差予算の上限・観測差を許す幅ではない・3σ 門は広げない・1% 等を補わない)が無い');
    if (!/2 次収束域/.test(String(sb.errorEstimate || '')) || !/窓/.test(String(sb.errorEstimate || '')) || !/次数/.test(String(sb.errorEstimate || '')))
      bad.push('|Q_h−Q_h/2|/3 の誤差推定の条件(2 次収束域・窓・抽出・次数)が無い');
    if (!((sb.history || []).some((h) => h.status === 'proposal'))) bad.push('提案値(前の版)の履歴が無い');
  } else if (!(sb.factor === 0.3 && sb.status === 'proposal' && /提案値/.test(String(sb.note || '')) && /合意済みの閾値ではない/.test(String(sb.note || ''))))
    bad.push('0.3σ が提案値であるという注記が無い');
  const rules = (table.rules || []).join('\n');
  if (!/幅で救わない/.test(rules)) bad.push('規則に「窓不足・量の不一致を幅で救わない」が無い');
  if (!/同じ契約にしない/.test(rules)) bad.push('規則に「周期・近点移動・離心率を同じ契約にしない」が無い');
  for (const k of BUDGET_KINDS) {
    const d = (table.kinds || {})[k];
    if (!d) { bad.push('種類 ' + k + ' の宣言が無い'); continue; }
    if (!d.window || !('needPeriastra' in d.window) || !('orbits' in d.window) || !d.window.def) bad.push(k + ' の窓(必要近点数・公転数・定義)が無い');
    for (const side of ['withSigma', 'noSigma']) {
      const b = (d.budget || {})[side];
      if (!b || !BUDGET_MODES.includes(b.mode)) { bad.push(k + ' の ' + side + ' の予算が無い / 語彙の外'); continue; }
      if (side === 'noSigma' && b.mode === 'sigma') bad.push(k + ' の σ なしの予算が σ 倍になっている');
      if ((b.mode === 'relative' || b.mode === 'absolute') && !(b.width > 0)) bad.push(k + ' の幅が正でない');
    }
  }
  // 周期・近点移動・離心率は同じ契約にしない
  const sig = (k) => JSON.stringify([(table.kinds[k] || {}).window, ((table.kinds[k] || {}).budget || {}).noSigma]);
  if (table.kinds && (sig('period') === sig('precession') || sig('period') === sig('ecc') || sig('precession') === sig('ecc'))) bad.push('周期・近点移動・離心率のどれかが同じ契約');
  const ents = table.entries || [];
  if (!(ents.length >= 2 && ents[0].key === 'saturnRingReal|C環内縁|precession' && ents[1].key === 'uranusReal|ミランダ|precession'))
    bad.push('💍 C 環内縁と 💠 ミランダが先頭に無い');
  const seen = new Set();
  for (const e of ents) {
    if (seen.has(e.key)) bad.push('鍵の重複 ' + e.key); seen.add(e.key);
    if (!e.window || !e.budget || !e.budget.noSigma || !e.why) bad.push(e.key + ' の窓・予算・理由が欠ける');
    const b = e.budget && e.budget.noSigma;
    if (b && !(BUDGET_MODES.includes(b.mode) && b.mode !== 'sigma' && (b.mode === 'not-judged' || b.width > 0))) bad.push(e.key + ' の σ なしの予算が語彙の外');
  }
  let cover = null;
  if (calaudit) {
    let n = 0, withW = 0, withB = 0, entryHits = 0; const miss = [], keysSeen = new Set();
    for (const p of (calaudit.presets || [])) for (const q of (p.quantities || [])) {
      n++; keysSeen.add(budgetKey(p.id, q));
      const r = resolveBudget(table, p.id, q);
      if (r && r.window) withW++; else miss.push(budgetKey(p.id, q) + '(窓)');
      if (r && r.budget && BUDGET_MODES.includes(r.budget.mode)) withB++; else miss.push(budgetKey(p.id, q) + '(予算)');
      if (r && r.source === 'entry') entryHits++;
    }
    const orphan = ents.filter((e) => !keysSeen.has(e.key)).map((e) => e.key);
    if (miss.length) bad.push('窓か予算の無い量 ' + miss.length + ' 件: ' + miss.slice(0, 3).join(','));
    if (orphan.length) bad.push('正本に無い鍵の行 ' + orphan.join(','));
    cover = { n, withWindow: withW, withBudget: withB, entryHits, orphan };
  }
  return { ok: bad.length === 0, bad, cover };
}

export default { BUDGET_TABLE_FILE, BUDGET_LIB_VERSION, BUDGET_KINDS, BUDGET_MODES, loadBudgetTable, budgetKey, resolveBudget, compactBudget, auditBudgetTable };
