// 第319便c(原仮定者の指示(第121報)「時間が掛かっている再生成の段について、時間短縮を行う」・決断事項 AN454・統括の検証項目 R260)——
// **再生成の段の短縮の文書の表**(純関数 —— 道具 tools/scope-probe319.mjs の記録 tests/out/scopeprobe-w319c.json と再生成表の記録
// 〔tests/lib-w281a-regentable.mjs の HISTORY_319C・CLOSED_KEEP_319C・NARROWED_319C・KEEP_ALL_319C・AN454_319C・AN454_SKIP_319C〕から PHYSICS〔第319便c〕の表を作る。
// QA docs.regenShort319c が同じ関数で作り直して節に逐語で照合する)。
//
// ■ 言わないこと: 「鎖が N 時間短くなった」(数は段 1 回の実測の見積りの和で、鎖の壁時計ではない —— 並列・再起動・混みぐあいで変わる)。
//   「絞った段は他の本を読まない」(機械の下限と実行時の記録で確かめた範囲 —— 器を書き換えた便は下限を引き直す)。
export const LIB_VERSION = 'w319c-regenshort-lib-1';
export const PROBE_OUT = 'tests/out/scopeprobe-w319c.json';
export const PROBE_VERSION = 'w319c-scope-probe-1';
/** 変更の種類の並び(道具の CASES と同じ) */
export const CASE_KEYS = Object.freeze(['addPreset', 'planetDecl', 'stepMaint', 'engineCoef', 'lawsText', 'reasonText']);
const KIND_JA = { book: '本', step: '步の関数', text: '表示の文' };
/** 省ける段を本便の変更の種類(履歴へ・presets の絞り・AN454)に分ける(段の秒は記録 J.stages) */
export function savedBy(J, RT, c) {
  const S = J.stages || {}, cat = (k) => (RT.HISTORY_319C.some((z) => z.key === k) ? 'history' : RT.NARROWED_319C.some((z) => z.key === k) ? 'narrowed' : RT.AN454_319C.some((z) => z.key === k) ? 'an454' : 'other');
  const o = { history: [0, 0], narrowed: [0, 0], an454: [0, 0], other: [0, 0] };
  for (const k of (c.saved.steps_ || [])) { const g = cat(k); o[g][0]++; o[g][1] += (S[k] && Number.isFinite(S[k].sec)) ? S[k].sec : 0; }
  return o;
}
/** 変更の種類ごとの前後の regen の段の数と見積りの秒(PHYSICS〔第319便c〕の表 1) */
export function probeTable(J, RT) {
  const out = ['| 変更の種類 | 区分 | 前: regen の段(見積りの秒) | 後: regen の段(見積りの秒) | 省ける段(秒) | 省ける内訳: 履歴へ・presets の絞り・AN454(段/秒) | 後の内訳: 領域の段・html 全体の段 | 後の recheck |',
    '|---|---|---|---|---|---|---|---|'];
  for (const k of CASE_KEYS) {
    const c = (J.cases || []).find((z) => z.key === k);
    if (!c || !c.made) { out.push(`| ${k} | — | 作れない | 作れない | — | — | — | — |`); continue; }
    const b = savedBy(J, RT, c), f = (x) => x[0] + '/' + x[1];
    out.push(`| ${c.ja} | ${KIND_JA[c.kind] || c.kind} | ${c.before.regen}(${c.before.regenSec} s) | ${c.after.regen}(${c.after.regenSec} s) | ${c.saved.steps}(${c.saved.sec} s) | ${f(b.history)}・${f(b.narrowed)}・${f(b.an454)}${b.other[0] ? '・ほか ' + f(b.other) : ''} | ${c.after.scoped}・${c.after.wholeHtml} | ${c.after.recheck} |`);
  }
  return out.join('\n');
}
/** 鎖の全段の見積りの秒の和と区分(表 2) */
export function totalsTable(J) {
  const b = J.totals.before, a = J.totals.after;
  return ['| 区分 | 前(基点 ' + J.baseRev + ') | 後(第319便c) |', '|---|---|---|',
    `| 現行の段(履歴を除く) | ${b.steps} | ${a.steps} |`,
    `| 見積りの秒の和(段 1 回の実測の和 —— 鎖の壁時計ではない) | ${b.sec} s | ${a.sec} s |`,
    `| 履歴の段 | ${b.history} | ${a.history} |`,
    `| presets "all" の段(見積りの秒) | ${b.allPresets}(${b.allPresetsSec} s) | ${a.allPresets}(${a.allPresetsSec} s) |`,
    `| html 全体を刻む段(見積りの秒) | ${b.wholeHtml}(${b.wholeHtmlSec} s) | ${a.wholeHtml}(${a.wholeHtmlSec} s) |`,
    `| 常時群(見積りの秒) | ${b.fixed.always}(${b.alwaysSec} s) | ${a.fixed.always}(${a.alwaysSec} s) |`,
    `| html を読まない段・正本の無い段 | ${b.fixed.noHtml}・${b.fixed.noMeta} | ${a.fixed.noHtml}・${a.fixed.noMeta} |`].join('\n');
}
/** AN454 の段ごとの変異の対照(表 4) */
export function an454Table(J) {
  const out = ['| 段 | presets | 表示の文(LAWS) | 表示の文(受理器の理由) | 宣言した本の物理の数(最下位桁) |', '|---|---|---|---|---|'];
  const ja = (v) => (v === 'same' ? '領域 hash 不変' : v === 'changed' ? '変わる' : v);
  for (const r of (J.an454 || [])) out.push(`| ${r.key} | ${r.presets === 'all' ? 'all' : r.presets + ' 本'} | ${ja(r.lawsText)} | ${ja(r.reasonText)} | ${ja(r.mass)}(${r.massOf} の ${r.massField}) |`);
  return out.join('\n');
}
/**
 * 段ごとの扱いと根拠(表 3 —— 再生成表の記録〔扱いと根拠〕と道具の記録 J.stages〔記録の時点の見積りの秒と器の宣言の本の数〕から)。
 * @param {object} RT 再生成表の module(HISTORY_319C ほか)
 * @param {object} J 道具の記録
 */
export function stageTable(RT, J) {
  const S = J.stages || {}, sec = (k) => (S[k] && Number.isFinite(S[k].sec) ? S[k].sec : '—'), np = (k) => (S[k] ? S[k].presets : null);
  const out = ['| 段 | 見積りの秒 | 扱い | 根拠 |', '|---|---|---|---|'];
  for (const h of RT.HISTORY_319C) out.push(`| ${h.key} | ${sec(h.key)} | 履歴へ(走らせない) | ${h.closedBy.join('・')} —— ${h.why} |`);
  for (const h of RT.CLOSED_KEEP_319C) out.push(`| ${h.key} | ${sec(h.key)} | 現行のまま | ${h.why} |`);
  for (const n of RT.NARROWED_319C) out.push(`| ${n.key} | ${sec(n.key)} | presets "all" → ${np(n.key)} 本 | ${n.via === 'lib-find' ? n.lib + ' を .find で直に引く形に(下限が名指しの本へ)' : '下限が元から名指しの本(宣言だけが広かった)'} |`);
  for (const k of RT.KEEP_ALL_319C) out.push(`| ${k.key} | ${sec(k.key)} | "all" のまま | ${k.why} |`);
  for (const z of RT.AN454_319C) out.push(`| ${z.key} | ${sec(z.key)} | REGEN_SCOPE を足す(AN454 —— presets ${np(z.key) === 'all' ? 'all' : np(z.key) + ' 本'}) | html を読む宣言の無い段(所要の大きい順) |`);
  for (const z of RT.AN454_SKIP_319C) out.push(`| ${z.key} | ${sec(z.key)} | 宣言なしのまま | ${z.why} |`);
  return out.join('\n');
}
/** 節に必ず載る数(表の外の本文の数 —— 照合用) */
export function docNumbers(J) {
  const b = J.totals.before, a = J.totals.after;
  return [String(b.sec), String(a.sec), String(b.allPresetsSec), String(a.allPresetsSec)];
}
