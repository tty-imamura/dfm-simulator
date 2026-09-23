// 第279便a(原仮定者の裁定(第69報)「各サンプルの状況確認」「『説明』タブの『概要』を全サンプルで
// 専用に用意する」・統括の読み R59/R60): **サンプルの状況(status)と概要(brief)を作る純関数**。
//
// ■ 何を作るか
//   各内蔵プリセットの `status` = {purpose, objective, state, calibration, mismatch, outlook, evidence}
//   (ja)と `en.status` = {purpose, state, mismatch, outlook}、および `descStruct.brief`(ja)・
//   `en.descStruct.brief` を、**手書きの原稿**(tests/data-w279a-samplestatus-src.json —— 目的・
//   状況・根拠 ID)と**正本 JSON**(tests/out/calaudit-w249.json の judgement 段・
//   tests/out/charonwin-w278b.json の比較値)から組み立てる。
//   ・`calibration`・`mismatch`・`outlook` は**手で書かない**(較正母集団 37 本は calaudit の
//     verdictLedger から、⛄🌨️ は charonwin の比較値から、それ以外は「較正対象外」で null)。
//   ・brief は「目的。状況。較正。」の 1 行 3 節で、**3 節とも status から機械的に作る**
//     (brief と status が食い違う余地を作らない — QA `ui.descBrief` が同じ関数で照合する)。
//
// ■ この lib がしないこと
//   ・ファイルを書かない(書くのは器 tests/exp-w279a-samplestatus.mjs)。
//   ・判定をしない —— 4 値は calaudit の verdictLedger の**転記**であり、ここで作り直さない。
//   ・「精度を上げれば合格」と書かない —— 見込みは**正本にある数**(σ の有無・刻み間差の σ 倍・
//     写像の未確定)から決まった語だけを出す。
import fs from 'node:fs';

/** 版(形を変えたら上げる。html の SAMPLE_STATUS_VERSION と同じ文字列)。 */
export const STATUS_VERSION = 'w279a-1';

export const OBJECTIVES = ['met', 'partial', 'unmet', 'n/a'];
export const CALIBRATIONS = ['pass', 'pass-limited', 'fail', 'hold', 'hold-definition', 'out-of-scope'];

/** 目的の達成(状況節の頭の語)。 */
export const OBJ_WORD = {
  ja: { met: '達', partial: '部分', unmet: '未達', 'n/a': '対象外' },
  en: { met: 'Met', partial: 'Partial', unmet: 'Unmet', 'n/a': 'N/A' },
};
/** 較正の語(台帳 37 本は 4 値の正式語そのまま)。 */
export const CAL_WORD = {
  ja: { pass: '合', 'pass-limited': '量限定合', fail: '否', hold: '保留',
    'hold-definition': '判定保留(量定義不一致)', 'out-of-scope': '較正対象外' },
  en: { pass: 'pass', 'pass-limited': 'limited pass', fail: 'fail', hold: 'hold',
    'hold-definition': 'hold (definitions differ)', 'out-of-scope': 'out of calibration scope' },
};
/** 台帳の 4 値 → calibration の列挙値。 */
export const VERDICT_TO_CAL = { '合': 'pass', '量限定合': 'pass-limited', '否': 'fail', '保留': 'hold' };

/** ⛄🌨️(判定保留(量定義不一致))の比較値の出所 —— charonwin-w278b.json の grid の行。 */
export const HOLD_DEFINITION_ROWS = { plutoCharonDFM: 'dfmMid', plutoCharonKF0Control: 'kf0Leap' };

/** 量の名前。 */
export const KIND_WORD = {
  ja: { period: '周期', precession: '近点移動', ecc: '離心率' },
  en: { period: 'period', precession: 'apsidal advance', ecc: 'eccentricity' },
};

/** brief・一覧 md に書かない語(docs.fourValuesHistory の禁止語 + 共通規約の「書かないこと」)。 */
export const FORBIDDEN = /判定が増えた|較正を完了|較正した|較正完了|D68 が合\(3σ\)|カロンが合|カロンが否|kF0 版が成立した|引きずりが完全に消えていることを確認|観測一致を達成|観測と一致した|引きずり消失を確認|平衡を実証|慣性を導出|無視してよいことを証明|精度限界に到達|完全に実証|新発見|RC を切った|精度を上げれば合格/;

const SUP = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
const sup = (n) => String(n).split('').map((c) => SUP[c] || c).join('');
const MINUS = '−';

/** 差の % を符号つき 3 桁で(負号は U+2212)。 */
export function fmtPct(x) {
  if (x === null || x === undefined || !isFinite(x)) return null;
  const s = x < 0 ? MINUS : '+';
  const a = Math.abs(x);
  if (a === 0) return '0';
  let t = a.toPrecision(3);
  if (/e/.test(t)) { const [m, e] = a.toExponential(1).split('e'); t = m + '×10' + sup(Number(e)); }
  return s + t;
}
/** σ 倍(<10 は小数 2 桁・<1000 は 3 桁・それ以上は 1 桁の仮数 ×10ⁿ)。 */
export function fmtSigma(n) {
  if (n === null || n === undefined || !isFinite(n)) return null;
  const a = Math.abs(n);
  if (a < 0.01) return a.toExponential(0).replace(/e([+-]\d+)/, (_, e) => '×10' + sup(Number(e))).replace(/^1×/, '1×');
  if (a < 10) return a.toFixed(2).replace(/0$/, '').replace(/\.$/, '');
  if (a < 1000) return String(Number(a.toPrecision(3)));
  const e = Math.floor(Math.log10(a));
  const m = a / Math.pow(10, e);
  return m.toFixed(1) + '×10' + sup(e);
}

/** calaudit の preset 行の中から、代表量(verdictLedger.representative)と同じ門の量を探す。 */
function findRepQuantity(pre, rep) {
  if (!pre || !rep) return null;
  return (pre.quantities || []).find((q) => q.gate && q.gate.nSigma === rep.nSigma && q.kind === rep.kind) || null;
}

/**
 * 較正母集団 1 本の {calibration, mismatch, outlook}(ja/en)を**正本から**作る。
 * mismatch: ① 代表量が 3σ を外れていれば その量の差 %(σ 倍)。② そうでなければ、写像が確定していて
 *   calaudit の目安判定が「否/窓」の量のうち |差 %| が最大のもの(σ なし)。③ どれも無ければ null。
 * outlook: 正本の数から決まる語だけ ——
 *   ・門で否(3σ)かつ刻み間差 < 1σ: 「刻み間差 xσ・刻みでは縮まない」(差の σ 倍 ≫ 刻みで動く幅)
 *   ・missing に「数値精度」: 「数値未解決」/「σ 未接続」: 「σ 未接続」/「写像未確定」: 「写像未確定」
 * @returns {null | {calibration, verdict4, mismatch:{ja,en}, outlook:{ja,en}, source}}
 */
export function ledgerStatus(calaudit, id) {
  const rows = ((calaudit || {}).verdictLedger || {}).rows || [];
  const row = rows.find((r) => r.id === id);
  if (!row) return null;
  const calibration = VERDICT_TO_CAL[row.verdict4];
  if (!calibration) return { error: `未知の 4 値: ${row.verdict4}` };
  const pre = ((calaudit || {}).presets || []).find((p) => p.id === id) || null;
  const rep = row.representative || null;
  const kindJa = (k) => KIND_WORD.ja[k] || k;
  const kindEn = (k) => KIND_WORD.en[k] || k;
  let mm = null, source = null;
  if (rep && isFinite(rep.nSigma) && rep.nSigma > 3) {
    const p = fmtPct(rep.residualPct), s = fmtSigma(rep.nSigma);
    mm = { ja: p === null ? `${kindJa(rep.kind)} ${s}σ(差の%は正本に無い)` : `${kindJa(rep.kind)} ${p}%(${s}σ)`,
      en: p === null ? `${kindEn(rep.kind)} ${s}σ (no % in the ledger)` : `${kindEn(rep.kind)} ${p}% (${s}σ)` };
    source = 'verdictLedger.representative';
  } else {
    let best = null;
    for (const q of (pre ? pre.quantities : []) || []) {
      if (!isFinite(q.residualPct) || q.residualPct === null) continue;
      if (!(q.verdict === '否' || q.verdict === '窓')) continue;
      if (q.gate && q.gate.mappingResolved === false) continue;
      if (!best || Math.abs(q.residualPct) > Math.abs(best.residualPct)) best = q;
    }
    if (best) {
      const p = fmtPct(best.residualPct);
      mm = { ja: `${kindJa(best.kind)} ${p}%(σ なし)`, en: `${kindEn(best.kind)} ${p}% (no σ)` };
      source = 'presets[].quantities(目安判定 否/窓・写像確定・|差%| 最大)';
    }
  }
  const miss = (row.missing || []).join(' ');
  const oj = [], oe = [];
  const q = findRepQuantity(pre, rep);
  const conv = q && q.gate && q.gate.convergence;
  const ld = conv && isFinite(conv.lastDiffInSigma) ? conv.lastDiffInSigma : null;
  if (calibration === 'fail' && q && q.gate.status === '否(3σ)' && ld !== null && ld < 1) {
    oj.push(`刻み間差 ${fmtSigma(ld)}σ・刻みでは縮まない`);
    oe.push(`step Δ ${fmtSigma(ld)}σ (not step-limited)`);
  }
  if (/数値精度/.test(miss)) { oj.push('数値未解決'); oe.push('numerics unresolved'); }
  if (/σ 未接続/.test(miss)) { oj.push('σ 未接続'); oe.push('no σ connected'); }
  if (/写像未確定/.test(miss)) { oj.push('写像未確定'); oe.push('mapping unresolved'); }
  return { calibration, verdict4: row.verdict4,
    mismatch: mm, outlook: oj.length ? { ja: oj.join('・'), en: oe.join('; ') } : null,
    source: { row: 'verdictLedger.rows[' + rows.indexOf(row) + ']', mismatch: source,
      lastDiffInSigma: ld, missing: row.missing || [] } };
}

/** ⛄🌨️: 判定保留(量定義不一致)。比較値は charonwin の grid(Buie 2012 比・門ではない)。 */
export function holdDefinitionStatus(charonwin, id) {
  const key = HOLD_DEFINITION_ROWS[id];
  if (!key) return null;
  const g = (((charonwin || {}).tables || {}).grid || {})[key];
  if (!g || !isFinite(g.vsBuieSec)) return { error: `charonwin の grid.${key} が無い` };
  const v = (g.vsBuieSec < 0 ? MINUS : '+') + Math.abs(g.vsBuieSec).toFixed(1);
  return { calibration: 'hold-definition',
    mismatch: { ja: `比較値 ${v} s(Buie 2012 比・門ではない)`, en: `comparison ${v} s vs Buie 2012` },
    outlook: { ja: '量の定義が揃うまで門に入れない', en: 'not gated until definitions match' },
    source: { row: 'tables.grid.' + key, vsBuieSec: g.vsBuieSec } };
}

/** 較正節(3 節目)。 */
export function calClause(st, lang) {
  const L = lang === 'en' ? 'en' : 'ja';
  const cal = st.calibration;
  if (cal === 'out-of-scope') return L === 'ja' ? '較正対象外' : 'Out of calibration scope';
  const w = CAL_WORD[L][cal];
  const mm = L === 'ja' ? st.mismatch : (st.en || {}).mismatch;
  const ol = L === 'ja' ? st.outlook : (st.en || {}).outlook;
  if (L === 'ja') return '較正は' + w + (mm ? '・' + mm : '') + (ol ? '・' + ol : '');
  return 'Calibration: ' + w + (mm ? ' — ' + mm : '') + (ol ? '; ' + ol : '');
}

/** 1 行 3 節の概要。ja「目的。状況。較正。」/ en "Purpose. State. Calibration." */
export function composeBrief(st, lang) {
  const L = lang === 'en' ? 'en' : 'ja';
  if (L === 'ja') return `${st.purpose}。${OBJ_WORD.ja[st.objective]}・${st.state}。${calClause(st, 'ja')}。`;
  const e = st.en || {};
  return `${e.purpose}. ${OBJ_WORD.en[st.objective]}: ${e.state}. ${calClause(st, 'en')}.`;
}

/** 概要を 3 節へ割る(ja は「。」・en は ". " の後に大文字)。 */
export function splitBrief(b, lang) {
  const s = String(b || '');
  if (lang === 'en') return s.replace(/\.$/, '').split(/\. (?=[A-Z])/);
  return s.replace(/。$/, '').split('。');
}

/** 較正節から語を読む(QA の照合用)。 */
export function calWordOfClause(clause, lang) {
  const L = lang === 'en' ? 'en' : 'ja';
  const c = String(clause || '');
  if (L === 'ja') {
    if (c === '較正対象外') return 'out-of-scope';
    // 長い語から順に照合する(「判定保留(量定義不一致)」を「保留」と読まない・「量限定合」を「合」と読まない)
    const order = ['hold-definition', 'pass-limited', 'hold', 'fail', 'pass'];
    for (const k of order) if (c.startsWith('較正は' + CAL_WORD.ja[k])) return k;
    return null;
  }
  if (c === 'Out of calibration scope') return 'out-of-scope';
  const order = ['hold-definition', 'pass-limited', 'hold', 'fail', 'pass'];
  for (const k of order) if (c.startsWith('Calibration: ' + CAL_WORD.en[k])) return k;
  return null;
}

/** 上限(ja 120 字 = DESC_BRIEF_CAP・en 200 文字 = DESC_BRIEF_CAP_EN)。 */
export const BRIEF_CAP = { ja: 120, en: 200 };

/**
 * 原稿 + 正本 → 表(html の SAMPLE_STATUS に書く形)。
 * @param {object} src   {version, rows:{id:{purpose,objective,state,evidence,en:{purpose,state}}}}
 * @param {object} calaudit
 * @param {object} charonwin
 * @param {object} [opt] {qaIds:Set(保存 QA で PASS の id), outFiles:Set(tests/out/ の相対パスで存在するもの)}
 * @returns {{table:object, errors:string[], provenance:object}}
 */
export function buildTable(src, calaudit, charonwin, opt) {
  const o = opt || {};
  const errors = [];
  const table = {};
  const prov = {};
  const rows = (src || {}).rows || {};
  const ledgerIds = new Set((((calaudit || {}).verdictLedger || {}).rows || []).map((r) => r.id));
  for (const id of Object.keys(rows)) {
    const r = rows[id];
    const st = { purpose: r.purpose, objective: r.objective, state: r.state,
      calibration: 'out-of-scope', mismatch: null, outlook: null, evidence: (r.evidence || []).slice(),
      en: { purpose: (r.en || {}).purpose, state: (r.en || {}).state, mismatch: null, outlook: null } };
    let s = null;
    if (ledgerIds.has(id)) s = ledgerStatus(calaudit, id);
    else if (HOLD_DEFINITION_ROWS[id]) s = holdDefinitionStatus(charonwin, id);
    if (s && s.error) errors.push(`${id}: ${s.error}`);
    else if (s) {
      st.calibration = s.calibration;
      st.mismatch = s.mismatch ? s.mismatch.ja : null; st.en.mismatch = s.mismatch ? s.mismatch.en : null;
      st.outlook = s.outlook ? s.outlook.ja : null; st.en.outlook = s.outlook ? s.outlook.en : null;
      prov[id] = s.source;
    }
    // 型と語の検査(原稿の書き間違いを黙って通さない)
    if (OBJECTIVES.indexOf(st.objective) < 0) errors.push(`${id}: objective が列挙値でない(${st.objective})`);
    for (const [k, v] of [['purpose', st.purpose], ['state', st.state], ['en.purpose', st.en.purpose], ['en.state', st.en.state]]) {
      if (typeof v !== 'string' || !v.trim()) errors.push(`${id}: ${k} が空`);
      else if (/。/.test(v) && k.indexOf('en') < 0) errors.push(`${id}: ${k} に「。」がある(3 節の区切りが壊れる)`);
      else if (k.indexOf('en') === 0 && /\. [A-Z]/.test(v)) errors.push(`${id}: ${k} に文の区切り ". X" がある`);
    }
    if (!st.evidence.length) errors.push(`${id}: evidence が空`);
    for (const e of st.evidence) {
      if (/^tests\/out\//.test(e)) { if (o.outFiles && !o.outFiles.has(e)) errors.push(`${id}: 根拠の正本が無い ${e}`); }
      else if (o.qaIds && !o.qaIds.has(e)) errors.push(`${id}: 根拠の QA が保存 QA で PASS でない/無い ${e}`);
    }
    st.brief = composeBrief(st, 'ja');
    st.en.brief = composeBrief(st, 'en');
    if (st.brief.length > BRIEF_CAP.ja) errors.push(`${id}: ja brief ${st.brief.length} 字 > ${BRIEF_CAP.ja}`);
    if (st.en.brief.length > BRIEF_CAP.en) errors.push(`${id}: en brief ${st.en.brief.length} 字 > ${BRIEF_CAP.en}`);
    if (FORBIDDEN.test(st.brief) || FORBIDDEN.test(st.en.brief)) errors.push(`${id}: brief に禁止語`);
    table[id] = st;
  }
  for (const id of ledgerIds) if (!rows[id]) errors.push(`較正母集団の ${id} が原稿に無い`);
  for (const id of Object.keys(HOLD_DEFINITION_ROWS)) if (!rows[id]) errors.push(`${id} が原稿に無い`);
  return { table, errors, provenance: prov };
}

/** 生成領域のマーカー(lib-w275a-physsha の綴りと同じ —— 物理コード領域の hash から外れる)。 */
export const REGION = 'sample-status';
export const BEGIN = '// >>> w275a-generated: ' + REGION;
export const END = '// <<< w275a-generated: ' + REGION;

/** 表 → html の生成領域(1 本 1 行の厳密 JSON。器が読み戻せる形)。 */
export function renderRegion(table, meta) {
  const ids = Object.keys(table);
  const lines = [BEGIN,
    '// 第279便a(原仮定者の裁定(第69報)「各サンプルの状況確認」・統括の読み R59/R60): **サンプルの状況と概要**。',
    '// **この領域は器 tests/exp-w279a-samplestatus.mjs が生成する(手で直さない)**。原稿(目的・状況・根拠)は',
    '// tests/data-w279a-samplestatus-src.json、較正の語・合わない量・見込みは正本 tests/out/calaudit-w249.json',
    '// (verdictLedger)と tests/out/charonwin-w278b.json(⛄🌨️ の比較値)から機械で作る。',
    '// 表示専用の宣言である —— presetSig・description・物理・保存 JSON の物理には 1 bit も効かない。',
    `const SAMPLE_STATUS_VERSION="${STATUS_VERSION}";`,
    `const SAMPLE_STATUS_META=${JSON.stringify(meta || {})};`,
    'const SAMPLE_STATUS={'];
  ids.forEach((id, i) => lines.push(JSON.stringify(id) + ':' + JSON.stringify(table[id]) + (i < ids.length - 1 ? ',' : '')));
  lines.push('};', END);
  return lines.join('\n');
}

/** html から生成領域の表を読む(無ければ null)。 */
export function parseRegion(html) {
  const t = String(html).replace(/\r\n?/g, '\n');
  const a = t.indexOf(BEGIN), b = t.indexOf(END);
  if (a < 0 || b < 0 || b < a) return null;
  const body = t.slice(a, b);
  const k = body.indexOf('const SAMPLE_STATUS={');
  if (k < 0) return null;
  const j = body.lastIndexOf('};');
  const json = body.slice(k + 'const SAMPLE_STATUS='.length, j + 1);
  const mv = body.match(/const SAMPLE_STATUS_VERSION="([^"]+)"/);
  const mm = body.match(/const SAMPLE_STATUS_META=(\{.*\});/);
  return { version: mv ? mv[1] : null, meta: mm ? JSON.parse(mm[1]) : null, table: JSON.parse(json) };
}

/** md の表の 1 行(| 絵文字 | ID | 名前 | 目的 | 状況 | 較正 | 合わない量と差 | 精度見込み |)。 */
export function mdRow(p, st) {
  const esc = (s) => String(s === null || s === undefined ? '—' : s).replace(/\|/g, '\\|');
  const stateCell = OBJ_WORD.ja[st.objective] + '・' + st.state + '(根拠: ' + st.evidence.map((e) => '`' + e + '`').join(', ') + ')';
  return `| ${p.emoji || ''} | \`${p.id}\` | ${esc(p.name)} | ${esc(st.purpose)} | ${esc(stateCell)} | ${CAL_WORD.ja[st.calibration]} | ${esc(st.mismatch)} | ${esc(st.outlook)} |`;
}

/** md の表の行を読み戻す(QA 用)。返り値: [{id, cal, cells}] */
export function parseMdRows(md) {
  const out = [];
  for (const line of String(md).split('\n')) {
    const m = line.match(/^\| [^|]* \| `([^`]+)` \|/);
    if (!m) continue;
    const cells = line.split(/(?<!\\)\|/).slice(1, -1).map((c) => c.trim());
    out.push({ id: m[1], cal: cells[5], cells });
  }
  return out;
}

/** 集計(objective の内訳・calibration の内訳・群別の本数)。 */
export function tally(table, presets) {
  const obj = { met: 0, partial: 0, unmet: 0, 'n/a': 0 };
  const cal = {}; for (const c of CALIBRATIONS) cal[c] = 0;
  for (const id of Object.keys(table)) { obj[table[id].objective]++; cal[table[id].calibration]++; }
  const four = { '合': cal.pass, '量限定合': cal['pass-limited'], '否': cal.fail, '保留': cal.hold };
  const byGroup = {};
  for (const p of presets || []) byGroup[p.group] = (byGroup[p.group] || 0) + 1;
  return { objective: obj, calibration: cal, four, byGroup, n: Object.keys(table).length };
}

export function readJSON(abs) { return JSON.parse(fs.readFileSync(abs, 'utf8')); }

export default { STATUS_VERSION, OBJECTIVES, CALIBRATIONS, OBJ_WORD, CAL_WORD, VERDICT_TO_CAL,
  HOLD_DEFINITION_ROWS, FORBIDDEN, fmtPct, fmtSigma, ledgerStatus, holdDefinitionStatus, calClause,
  composeBrief, splitBrief, calWordOfClause, BRIEF_CAP, buildTable, REGION, BEGIN, END, renderRegion,
  parseRegion, mdRow, parseMdRows, tally, readJSON };
