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
//
// **第269便a(第59報 W1・統括の読み (F))で塞いだ穴**(第268便a の同定は body・quantity・value・sigma
// だけを見ていた —— 現行の 2 件の選択が誤っていたのではなく、**拡張に対して開いていた穴**である):
//   ① 同じ数値・同じ σ の**別論文**が一致してしまう → 一致条件に `source` を足す。
//   ② 同じ数値の**別単位**(s と day)が一致してしまう → 一致条件に `unit` を足す。
//   ③ `Number(null) === 0` なので、**空欄の value に宣言値 0 が当たる** → 双方が有限でなければ不一致。
//   ④ 同じ key の宣言が 2 件あると**後勝ち**で黙って上書きされる → `ok:false` で**器を止める**。
//   ⑤ 不正スキーマ(schemaVersion≠1・必須欄欠け・σ≤0)も `ok:false` で**器を止める**。
// **止める**というのは「別の解に戻して走行を続けない」という意味である(黙って旧行へ戻らない)。
//
// **第270便b(第60報 W2・統括の読み (G) AE2)**: CSV に `record_id` 欄が付いたので、宣言にも
//   `record_id` を**足した**(文字列の `source`/`unit`/`value`/`sigma` は**残す**)。
//   `record_id` があるときは**それで厳密に同定する**(1 件に決まらなければ理由つきで `null` ——
//   **文字列出典へ黙って落ちない**)。`solution_id` は**空欄でよい**(本便では作らない — 決断事項)。

// 宣言オブジェクト(ファイルの中身)の検証。**純関数**(ファイルを読まない)。
export function validateJudgementSources(j, file = null) {
  const errors = [];
  if (!j || typeof j !== 'object') errors.push('schema: 宣言ファイルがオブジェクトでない');
  const decls = (j && Array.isArray(j.declarations)) ? j.declarations : [];
  if (j && j.schemaVersion !== 1) errors.push('schema: schemaVersion が 1 でない(' + String(j.schemaVersion) + ')');
  if (j && !Array.isArray(j.declarations)) errors.push('schema: declarations が配列でない');
  const str = (v) => (typeof v === 'string' && v.trim() !== '');
  const byKey = new Map();
  for (let i = 0; i < decls.length; i++) {
    const d = decls[i] || {};
    const where = '宣言[' + i + '] ' + String(d.body) + '|' + String(d.quantity);
    for (const k of ['body', 'quantity', 'source', 'unit'])
      if (!str(d[k])) errors.push(where + ': 必須欄 `' + k + '` が文字列でない(非空の文字列が要る)');
    // 第271便b(R1): **`value` / `sigma` は有限の number だけ**。`Number(v)` を通すと
    //   `null`(→0)・`""`(→0)・`"1.5"`(→1.5)が黙って通る。宣言は数値の複写なので、
    //   **数でないものは不正**として器を止める(黙って 0 として照合しない)。
    if (typeof d.value !== 'number' || !Number.isFinite(d.value))
      errors.push(where + ': `value` が有限の number でない(' + JSON.stringify(d.value) + ')');
    if (!('sigma' in d)) errors.push(where + ': `sigma` 欄が無い(null か正の数を書く)');
    else if (!(d.sigma === null || (typeof d.sigma === 'number' && Number.isFinite(d.sigma) && d.sigma > 0)))
      errors.push(where + ': `sigma` が null でも正の number でもない(' + JSON.stringify(d.sigma) + ')');
    // 第270便b(AE2): `record_id` は**あれば非空の文字列**(欄を置いて空にするのは宣言ではない)。
    //   `solution_id` は**空文字でよい**(本便では作らない — 決断事項)。
    if ('record_id' in d && !str(d.record_id))
      errors.push(where + ': `record_id` 欄があるのに非空の文字列でない');
    if ('solution_id' in d && typeof d.solution_id !== 'string')
      errors.push(where + ': `solution_id` が文字列でない(空欄可 —— 未作成は "" と書く)');
    const key = String(d.body) + '|' + String(d.quantity);
    if (byKey.has(key)) errors.push(where + ': **同じ key の宣言が 2 件ある**(後勝ちで黙って上書きしない)');
    else byKey.set(key, d);
  }
  return { file, ok: errors.length === 0, errors,
    schemaVersion: (j && j.schemaVersion) || null, wave: (j && j.wave) || null,
    declarations: decls, notDeclared: (j && Array.isArray(j.notDeclared)) ? j.notDeclared : [],
    byKey: errors.length === 0 ? byKey : new Map() };   // **不正なら 1 件も配らない**(黙って使わせない)
}

export function loadJudgementSources(file) {
  let j = null;
  try { j = JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch (e) { return { file, ok: false, error: String(e && e.message || e).slice(0, 140),
    errors: ['read: ' + String(e && e.message || e).slice(0, 140)],
    declarations: [], notDeclared: [], byKey: new Map() }; }
  const v = validateJudgementSources(j, file);
  return Object.assign(v, { error: v.ok ? null : v.errors.join(' / ').slice(0, 300) });
}

// ---------------------------------------------------------------- 第271便b(R1): 内容照合
// **`record_id` は候補行を一意に定める鍵であって、宣言内容の一致条件ではない。**
//   第270便b の `pickDeclaredRow` は record_id が 1 件に当たった時点で行を返していたので、
//   **次にレコードが訂正されたとき(値・σ・出典・単位・天体・量が動いたとき)に混在を検出できない**。
//   本関数は「ID で定まった行」と「宣言の内容」を突き合わせ、**食い違った欄の名前**を返す。
//   1 つでも食い違えば `pickDeclaredRow` は理由つきで `null` を返す(**別出典へ落ちない**)。
//
// 照合する欄: `body` / `quantity`(= `csvQuantity`)/ `source` / `unit` / `value` / `sigma` /
//   `solution_id`(宣言に欄があるときだけ — 第271便b AF4)。
// **`value` は双方が有限の数でなければ不一致**(`Number(null) === 0` の穴を塞ぐ)。
// **`sigma` は「両方 null」か「両方同じ数」だけが一致**(片方だけ null は不一致)。
export function declaredContentMismatch(decl, row) {
  const miss = [];
  if (!decl || !row) return ['declaration-or-row-missing'];
  const key = decl.csvQuantity || decl.quantity;
  if (String(row.body) !== String(decl.body)) miss.push('body');
  if (String(row.quantity) !== String(key)) miss.push('quantity');
  if (String(row.source) !== String(decl.source)) miss.push('source');
  if (String(row.unit) !== String(decl.unit)) miss.push('unit');
  const rowVraw = (row.valueRaw !== undefined) ? row.valueRaw
    : ((row.rawValue !== undefined) ? row.rawValue : row.value);
  const rowV = (rowVraw === null || rowVraw === undefined || String(rowVraw).trim() === '')
    ? null : Number(rowVraw);
  const declV = (typeof decl.value === 'number') ? decl.value : null;
  if (rowV === null || declV === null || !Number.isFinite(rowV) || !Number.isFinite(declV)
    || rowV !== declV) miss.push('value');
  const rowS = (row.sigma === undefined || row.sigma === '') ? null : row.sigma;
  const declS = (decl.sigma === undefined) ? null : decl.sigma;
  if ((rowS === null) !== (declS === null)) miss.push('sigma');
  else if (rowS !== null && Number(rowS) !== Number(declS)) miss.push('sigma');
  if (typeof decl.solution_id === 'string') {
    const rowSid = String((row.solutionId !== undefined) ? row.solutionId
      : (row.solution_id || '')).trim();
    if (rowSid !== decl.solution_id.trim()) miss.push('solution_id');
  }
  return miss;
}

// 宣言(1 件)に対応する CSV の行を、**全行の一覧から**選ぶ。
//   一致条件は「body・CSV 上の鍵(`csvQuantity`)・**source**・**unit**・value・sigma が
//   すべて宣言と一致」(第269便a で source と unit を足した)。
//   1 件に決まらなければ `null` を返し、理由を `reason` に置く(**推測で当てない**)。
export function pickDeclaredRow(decl, allRows) {
  if (!decl) return { row: null, reason: 'declaration-missing' };
  // 第270便b(AE2): **`record_id` があれば最優先で厳密一致**。1 件に決まらなければ
  // **理由つきで null**(文字列出典の一致条件へ黙って落ちない —— それでは鍵を足した意味が無い)。
  const rid = (typeof decl.record_id === 'string') ? decl.record_id.trim() : '';
  if (rid !== '') {
    const byId = (allRows || []).filter((r) => String(r.recordId || r.record_id || '').trim() === rid);
    if (byId.length === 1) {
      // 第271便b(R1): **ID は鍵、宣言内容は一致条件**。ID で 1 行に定まっても、その行の
      //   body/quantity/source/unit/value/sigma/solution_id が宣言と食い違えば**採らない**
      //   (レコード訂正で中身が動いたことを、ここで止める)。**別出典へ落ちない**。
      const miss = declaredContentMismatch(decl, byId[0]);
      if (miss.length === 0) return { row: byId[0], reason: null, matchedBy: 'record_id' };
      return { row: null, matchedBy: 'record_id', mismatch: miss,
        reason: 'record-id-content-mismatch(' + miss.join(',') + ')' };
    }
    return { row: null, matchedBy: 'record_id',
      reason: byId.length === 0 ? 'record-id-not-found' : ('record-id-ambiguous(' + byId.length + ')') };
  }
  const key = decl.csvQuantity || decl.quantity;
  const same = (a, b) => (a === null || a === undefined) ? (b === null || b === undefined) : (a === b);
  const declV = Number(decl.value);
  const hits = (allRows || []).filter((r) => {
    if (r.body !== decl.body || r.quantity !== key) return false;
    // **別論文・別単位を当てない**(同じ数値・同じ σ の別解があり得る)
    if (String(r.source) !== String(decl.source)) return false;
    if (String(r.unit) !== String(decl.unit)) return false;
    // **空欄を 0 に変換しない**(`Number(null) === 0` の穴)
    const rowV = (r.valueRaw !== undefined) ? r.valueRaw : r.value;
    if (!Number.isFinite(Number(rowV)) || rowV === null || !Number.isFinite(declV)) return false;
    if (Number(rowV) !== declV) return false;
    return same(r.sigma === undefined ? null : r.sigma, decl.sigma === undefined ? null : decl.sigma);
  });
  if (hits.length === 1) return { row: hits[0], reason: null };
  if (hits.length === 0) return { row: null, reason: 'csv-row-not-found' };
  return { row: null, reason: 'csv-row-ambiguous(' + hits.length + ')' };
}
