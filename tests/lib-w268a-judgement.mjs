// 第268便a(第58報 W1): **判定器の純関数 3 本**(副作用なし・走行しない・数値を手で打たない)。
//
//   (1) `requiredGuards(gate)` …… 統括の読み (B)。**σ が門へ届いただけでは判定しない**。
//       正本(`tests/exp-w249b-calaudit.mjs` の門)が既に持っている 3 欄
//       `definitionDeclared`(判定量の定義が宣言されているか)・`mappingResolved`(観測量対応が
//       確定しているか)・`convergence.ok`(数値収束が確認されているか)を**必須**にする。
//       1 つでも欠けたら「**保留(…)**」で止める(否でも合でもない)。
//   (2) `precessionDegPerYear(...)` …… 統括の読み (A)・AB1。近点移動の **deg/orbit → deg/yr**。
//       **分子の Δϖ と同じ近点窓の近点間周期 `pPeriSec`** で割る。周期行(`periodDef=revolution`)や
//       丸めた観測周期を使うと**符号まで変わる**ことを第268便a が数で示した(統括の予備測定の再現)。
//   (3) `loadJudgementSources` / `pickDeclaredRow` …… 統括の読み (D)・AB2。**採用観測解の明示宣言**。
//       宣言の無い body|quantity は**従来どおりファイル順の最初の行**を採る(後方互換)。
//
// **このモジュールが言わないこと**: 「判定が増えた」「D68 が合(3σ)」。ガードは**止める**ための欄で
// あり、換算は**単位を揃える**だけであり、宣言は**どの行を読むか**を決めるだけである。

import fs from 'node:fs';

// 年の長さは**単位の約束**であって観測ではない(ユリウス年 365.25 d = 3.15576e7 s)。
// `tests/lib-w258d-evidence.mjs` の `YEAR_SEC` と同じ約束を使う(器ごとに変えない)。
export const YEAR_SEC = 3.15576e7;

// ---------------------------------------------------------------- (1) 必須ガード(統括の読み (B))
// gate = 門の欄(`q.gate`)。返り値の `ok` が true のときだけ 3σ の判定に入ってよい。
// **「保留」は否定ではない** —— 判定の前提が宣言されていない、という状態の名前である。
export function requiredGuards(gate) {
  const g = gate || {};
  const conv = g.convergence || {};
  const missing = [];
  if (g.definitionDeclared !== true) missing.push('判定量の定義が未宣言');
  if (g.mappingResolved !== true) missing.push('観測量対応が未確定');
  if (conv.ok !== true) missing.push('数値収束が未確認');
  return {
    ok: missing.length === 0,
    missing,
    definitionDeclared: g.definitionDeclared === true,
    mappingResolved: g.mappingResolved === true,
    convergenceOk: conv.ok === true,
    verdict: missing.length === 0 ? null : ('保留(' + missing.join('/') + ')'),
    rule: '`definitionDeclared` ∧ `mappingResolved` ∧ `convergence.ok` が**必須**'
      + '(第268便a・統括の読み (B) —— 1 つでも欠けたら合とも否とも言わない)',
  };
}

// ---------------------------------------------------------------- (2) 単位換算(統括の読み (A))
// **換算契約**(第268便a):
//   ・分子の Δϖ [deg/orbit] と**同じ近点・同じ窓**の時刻から作った周期を使う(= `pPeriSec`)。
//   ・観測値と観測 σ は**同じ係数で同じ単位へ**写す(ここでは観測側が既に deg/yr なので写さない)。
//   ・換算係数の数値誤差は σ に混ぜない。**換算後の量そのもの**を h/h2/h4 で検査する。
//   ・obsCard の表示単位と内部判定単位は分けてよい(表示は deg/orbit のままでよい)。
// periodDef が `periastron` 以外の周期(同方向 1 周・接触要素・丸めた観測周期)は**使わない**。
export function precessionDegPerYear({ degPerOrbit, pPeriSec, yearSec = YEAR_SEC }) {
  if (!Number.isFinite(degPerOrbit)) return null;
  if (!Number.isFinite(pPeriSec) || !(pPeriSec > 0)) return null;
  return degPerOrbit * yearSec / pPeriSec;
}
// 観測側を deg/orbit へ写す逆向きの換算(**同値であることの確認用**)。
// 残差を σ で割った数は、どちらの向きに換算しても同じである(同じ正の係数で両辺を割るだけ)。
export function degPerYearToPerOrbit({ degPerYear, pPeriSec, yearSec = YEAR_SEC }) {
  if (!Number.isFinite(degPerYear)) return null;
  if (!Number.isFinite(pPeriSec) || !(pPeriSec > 0)) return null;
  return degPerYear * pPeriSec / yearSec;
}

// ---------------------------------------------------------------- (3) 採用観測解の明示宣言(統括の読み (D))
// 宣言ファイルのスキーマは `docs/AI_SPEC.md` の「judgement-sources.json」節にある。
export function loadJudgementSources(file) {
  let j = null;
  try { j = JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch (e) { return { file, ok: false, error: String(e && e.message || e).slice(0, 140),
    declarations: [], byKey: new Map() }; }
  const decls = Array.isArray(j.declarations) ? j.declarations : [];
  const byKey = new Map();
  for (const d of decls) byKey.set(d.body + '|' + d.quantity, d);
  return { file, ok: true, schemaVersion: j.schemaVersion || null, wave: j.wave || null,
    declarations: decls, notDeclared: Array.isArray(j.notDeclared) ? j.notDeclared : [], byKey };
}

// 宣言(1 件)に対応する CSV の行を、**全行の一覧から**選ぶ。
//   一致条件は「body・CSV 上の鍵(`csvQuantity`)・value・sigma がすべて宣言と一致」。
//   1 件に決まらなければ `null` を返し、理由を `reason` に置く(**推測で当てない**)。
export function pickDeclaredRow(decl, allRows) {
  if (!decl) return { row: null, reason: 'declaration-missing' };
  const key = decl.csvQuantity || decl.quantity;
  const same = (a, b) => (a === null || a === undefined) ? (b === null || b === undefined) : (a === b);
  const hits = (allRows || []).filter((r) => r.body === decl.body && r.quantity === key
    && Number(r.valueRaw !== undefined ? r.valueRaw : r.value) === Number(decl.value)
    && same(r.sigma === undefined ? null : r.sigma, decl.sigma === undefined ? null : decl.sigma));
  if (hits.length === 1) return { row: hits[0], reason: null };
  if (hits.length === 0) return { row: null, reason: 'csv-row-not-found' };
  return { row: null, reason: 'csv-row-ambiguous(' + hits.length + ')' };
}
