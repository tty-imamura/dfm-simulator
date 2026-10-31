// 第321便d(決断事項 AN493・統括の検証項目 R269): **ゲートの後の samplestatus の段**の差の分類(純関数 —— ファイルを読まない・書かない)。
//
// ■ なぜ要るか
//   鎖の常時群の段 samplestatus(器 tests/exp-w279a-samplestatus.mjs)はゲートの QA の**前**に走るので、SAMPLE_STATUS の保存 QA の欄
//   (来歴 meta.evidenceQa・timingNote.qaProvenance・本ごとの QA の秒)は前の便のゲートの保存物を写す(1 便遅れる —— 第320便d の来歴の欄)。
//   ゲートの後に同じ段を 1 回だけ走らせれば今の便の保存物を写せるが、その走行で**変わってよいのは来歴と時間の欄だけ**である
//   (html の生成領域・全 hash・状態と較正の意味は変わらない)。道具 tools/samplestatus-postgate.mjs が走行の前後を写し、ここで分類する。
//
// ■ 分類(許す欄の外が 1 つでもあれば道具は非零で止まる)
//   ・JSON(正本 tests/out/samplestatus-w279a.json)の差は JSON Pointer で数える。**来歴**: 実行の時刻(meta.generatedAt・入力とコードの mtime)・
//     根拠の保存 QA の記録(meta.evidenceQa)・保存 QA の来歴(timingNote.qaProvenance)・入力の行のうち一覧 md そのものの sha256 と bytes
//     (md の時間の行が変わるので必ず変わる)。**時間**: 本ごとの保存 QA の秒と帰属(rows[].timing.qa)・保存 QA の総数と総時間・帰属なしの本の数。
//     それ以外(状態 status・較正・tally・台帳の出どころ・較正走行の秒・再生成の段・コードの sha・対象 html の sha・版)は**変わってはならない**。
//   ・md(docs/SAMPLE_STATUS.md)は行で比べる(行の数が同じ・違う行は「保存 QA の来歴」「保存 QA」の 2 行と、所要時間の表の行の
//     保存 QA の 2 列〔秒・本数 / 内訳〕だけ —— 本・較正走行・段別の列は同じ)。
//   ・ファイル: 走行の前後で sha の変わったファイルが段の書き(outs + touches)から html を除いた集合に入ること(html は 1 byte も変わらない)。
// ■ この lib がしないこと: 器を走らせない・判定の式を持たない(分類だけ)・許す欄を走行の結果から広げない(表は下の定数だけ)
export const POSTGATE_VERSION = 'w321d-postgate-1';
export const STAGE_KEY = 'samplestatus';
export const OUT_JSON = 'tests/out/samplestatus-w279a.json';
export const OUT_MD = 'docs/SAMPLE_STATUS.md';
export const HTML = 'beta/index.html';
export const QA_SAVED = 'tests/out/qa-results-full-beta.json';
/** 許す欄(JSON Pointer の型 —— `*` は 1 段の任意の鍵・`**` は末尾の任意の深さ〔0 段を含む〕)。 */
export const ALLOW_JSON = {
  provenance: ['/meta/generatedAt', '/meta/inputs/*/mtime', '/meta/code/*/mtime', '/meta/evidenceQa/**', '/timingNote/qaProvenance/**'],
  time: ['/rows/*/timing/qa/**', '/timingNote/qaTotal', '/timingNote/qaDurationMs', '/timingNote/qaAttribution/unattributed'],
};
/** 入力の行のうち md そのもの(file === OUT_MD)の sha256・bytes は来歴(条件つき —— 前後とも同じ行が md のときだけ)。 */
export const MD_INPUT_KEYS = ['sha256', 'bytes'];
/** md の許す行(行の頭)と所要時間の表の見出し(行の頭)。 */
export const MD_ALLOW_LINES = { provenance: ['- **保存 QA の来歴**'], time: ['- **保存 QA**:'] };
export const MD_TIME_TABLE_HEAD = '| 本 | 較正走行(s) | 段別(s) | 保存 QA(s・本数) | QA の内訳(上位 3) |';
export const MD_TIME_TABLE_FIXED = 3;   // 表の列 1〜3(本・較正走行・段別)は変わらない —— 4・5 列(保存 QA)だけ

const esc = (s) => String(s).replace(/~/g, '~0').replace(/\//g, '~1');
const isObj = (x) => x !== null && typeof x === 'object';
/** 2 つの JSON の差(葉の単位 —— 型が違えばその位置で 1 件)。[{ptr, kind:'changed'|'added'|'removed', a, b}] */
export function diffJson(a, b, at = '') {
  const out = [];
  if (Object.is(a, b)) return out;
  if (isObj(a) && isObj(b) && Array.isArray(a) === Array.isArray(b)) {
    const ka = Array.isArray(a) ? a.map((_, i) => String(i)) : Object.keys(a), kb = Array.isArray(b) ? b.map((_, i) => String(i)) : Object.keys(b);
    const sb = new Set(kb);
    for (const k of ka) {
      const p = at + '/' + esc(k);
      if (!sb.has(k)) out.push({ ptr: p, kind: 'removed', a: a[k], b: undefined });
      else out.push(...diffJson(a[k], b[k], p));
    }
    const sa = new Set(ka);
    for (const k of kb) if (!sa.has(k)) out.push({ ptr: at + '/' + esc(k), kind: 'added', a: undefined, b: b[k] });
    return out;
  }
  if (!isObj(a) && !isObj(b) && a === b) return out;
  out.push({ ptr: at || '/', kind: 'changed', a, b });
  return out;
}
/** Pointer が型に合うか(`*` = 1 段・末尾の `**` = 0 段以上)。 */
export function matchPtr(pattern, ptr) {
  const P = pattern.split('/').slice(1), Q = ptr.split('/').slice(1);
  for (let i = 0; i < P.length; i++) {
    if (P[i] === '**' && i === P.length - 1) return Q.length >= i;
    if (i >= Q.length) return false;
    if (P[i] !== '*' && P[i] !== Q[i]) return false;
  }
  return P.length === Q.length;
}
/** JSON の差の分類。before・after は正本の object。返す: {n, provenance, time, other:[{ptr,kind,a,b}], byClass:{ptr: class}} */
export function classifyJson(before, after) {
  const d = diffJson(before, after);
  const res = { n: d.length, provenance: 0, time: 0, other: [], byClass: {} };
  const inB = ((before || {}).meta || {}).inputs || [], inA = ((after || {}).meta || {}).inputs || [];
  for (const z of d) {
    let c = null;
    for (const cls of ['provenance', 'time']) if (ALLOW_JSON[cls].some((p) => matchPtr(p, z.ptr))) { c = cls; break; }
    if (!c) {
      const m = /^\/meta\/inputs\/(\d+)\/([^/]+)$/.exec(z.ptr);
      if (m && MD_INPUT_KEYS.includes(m[2]) && inB[m[1]] && inA[m[1]] && inB[m[1]].file === OUT_MD && inA[m[1]].file === OUT_MD) c = 'provenance';
    }
    res.byClass[z.ptr] = c || 'other';
    if (c) res[c]++; else res.other.push(z);
  }
  return res;
}
const cellsOf = (line) => line.split('|').slice(1, -1).map((s) => s.trim());
/** md の差の分類(行で比べる)。返す: {n, provenance, time, other:[{line, a, b, why}]} */
export function classifyMd(before, after) {
  const A = String(before).split('\n'), B = String(after).split('\n');
  const res = { n: 0, provenance: 0, time: 0, other: [] };
  if (A.length !== B.length) { res.n = Math.abs(A.length - B.length) || 1; res.other.push({ line: -1, a: A.length, b: B.length, why: '行の数が違う' }); return res; }
  const hA = A.indexOf(MD_TIME_TABLE_HEAD), hB = B.indexOf(MD_TIME_TABLE_HEAD);
  let tEnd = -1;
  if (hA >= 0 && hA === hB) { tEnd = hA + 2; while (tEnd < A.length && A[tEnd].startsWith('|')) tEnd++; }
  for (let i = 0; i < A.length; i++) {
    if (A[i] === B[i]) continue;
    res.n++;
    let c = null, why = '許す行の外';
    for (const cls of ['provenance', 'time']) if (MD_ALLOW_LINES[cls].some((h) => A[i].startsWith(h) && B[i].startsWith(h))) { c = cls; break; }
    if (!c && hA >= 0 && hA === hB && i >= hA + 2 && i < tEnd && B[i].startsWith('|')) {
      const ca = cellsOf(A[i]), cb = cellsOf(B[i]);
      if (ca.length === cb.length && ca.length > MD_TIME_TABLE_FIXED && ca.slice(0, MD_TIME_TABLE_FIXED).every((x, k) => x === cb[k])) c = 'time';
      else why = '所要時間の表の本・較正走行・段別の列が違う';
    }
    if (c) res[c]++; else res.other.push({ line: i + 1, a: A[i].slice(0, 160), b: B[i].slice(0, 160), why });
  }
  return res;
}
/** ファイルの sha の写しの差。allowed は変わってよいファイル(段の書きから html を除いた集合)。返す: {changed, disallowed, removed, added} */
export function compareSnapshots(before, after, allowed) {
  const ok = new Set(allowed || []), changed = [], disallowed = [], removed = [], added = [];
  for (const [f, s] of Object.entries(before)) {
    if (!(f in after)) { removed.push(f); disallowed.push(f); continue; }
    if (after[f] !== s) { changed.push(f); if (!ok.has(f)) disallowed.push(f); }
  }
  for (const f of Object.keys(after)) if (!(f in before)) { added.push(f); if (!ok.has(f)) disallowed.push(f); }
  return { changed, disallowed, removed, added };
}
/** 段の宣言(再生成表の行)から、ゲートの後の走行が書いてよいファイル(outs + touches から html を除く)と変わってはならない html。 */
export function stageWritesOf(stage) {
  const writes = [...new Set([].concat(stage.outs || [], stage.touches || []))];
  return { writes, allowed: writes.filter((f) => f !== HTML), mustStay: writes.filter((f) => f === HTML) };
}
/** 全体の判定(道具の終了コードの元)。snap = compareSnapshots の結果・json/md = classify の結果・ev = 走行の後の正本と保存 QA の来歴の突き合わせ */
export function verdictOf({ snap, json, md, ev }) {
  const why = [];
  if (snap.disallowed.length) why.push('段の書きの外のファイルが変わった: ' + snap.disallowed.slice(0, 5).join(', '));
  if (json.other.length) why.push('正本の許す欄の外の差 ' + json.other.length + ' 件: ' + json.other.slice(0, 3).map((z) => z.ptr).join(', '));
  if (md.other.length) why.push('一覧 md の許す行の外の差 ' + md.other.length + ' 件: ' + md.other.slice(0, 3).map((z) => 'L' + z.line + '(' + z.why + ')').join(', '));
  if (ev && !ev.evidenceSame) why.push('正本の meta.evidenceQa が保存 QA(commit・date)と違う');
  if (ev && !ev.sameHtml) why.push('正本の timingNote.qaProvenance.sameHtml が真でない(保存 QA がこの html のものでない)');
  return { pass: why.length === 0, why };
}
export default { POSTGATE_VERSION, STAGE_KEY, OUT_JSON, OUT_MD, HTML, QA_SAVED, ALLOW_JSON, MD_INPUT_KEYS, MD_ALLOW_LINES, MD_TIME_TABLE_HEAD, MD_TIME_TABLE_FIXED,
  diffJson, matchPtr, classifyJson, classifyMd, compareSnapshots, stageWritesOf, verdictOf };
