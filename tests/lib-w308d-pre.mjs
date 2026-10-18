// 第308便d(決断事項 AN351・統括の検証項目 R217): **第307便の本の宣言の写し**と**第308便d の記録の変換**
// (Node の器と QA だけが読む —— html は読まない)。
// 第308便d で変えた宣言の欄は 1 つ: 三本の fitRecord の標的に役割 role を宣言した(水星の三次元の本 —— 近点率の差 numerical-fit・恒星周期 independent /
//   水星のフィットの本 —— 近点率の差 numerical-fit / 地球–月の kFrame=1 の本 —— 朔望月 numerical-fit)。数・窓・抽出器・条件の署名・status は第307便のまま
//   (役割は条件の署名 fitCondSig と門 |residual| + h2 ≤ tol に入らない —— 第307便e)。
// **第307便の宣言で測った記録**(第306便a の水星の器 tests/exp-w306a-an336.mjs の段 G の「本の記録と同じか」の門 fitRecordLive など)は、
//   本を次の写しにして照合する(tests/lib-w307e-pre.mjs の pin306e と同じ型 —— 世代の lib を重ねる):
//   ・fitRecord を第307便の宣言(基点 1724b6e = public main)に戻す(本の他の欄は今の宣言のまま —— physics・bodies は第308便d で変えていない)。
//   ・写しの値は凍結のデータ tests/data-w308d-decl307.json(器の入力 —— 正本の meta.inputs に sha を刻む)。**この lib の本文は本の ID を持たない**
//     (役割の表もデータの change に置く —— 器の再生成範囲の下限〔lib-w281a-scope の deriveScope〕は器が自分で名指す本だけ)。
//   ・世代の門は**本ごと**: 写しのある本で、第308便d の世代(fitRecord の標的に role がある)なら写す(第307便の html では写しは元と同じ —— no-op)。
// 第308便d の記録は**第307便の記録の決定的な変換** record308d(id, rec)(各標的の末尾に role を置くだけ —— 数は測り直していない)。
// QA(preset.fitRole308)は「html の記録 = record308d(第307便の宣言の写し)」を照合する。
// 使い方: (a) loadHtmlMain の直後に pinDecl307d(evalExpr?, ids?) を呼ぶ(html の大域の BUILTIN_PRESETS の要素を器の中だけで差し替える —— html は変えない)。
//     (b) 1 本だけ写すときは pin307d(p)(門は gate307d(p) —— 写して変わるかは pinChanges307d(p))。
import fs from "node:fs";
import vm from "node:vm";
export const LIB_VERSION = "w308d-pre-1";
/** 凍結の写しのデータ(器の入力 —— リポジトリの相対パス)。 */
export const DECL307D_DATA_FILE = "tests/data-w308d-decl307.json";
const DATA = JSON.parse(fs.readFileSync(new URL("./data-w308d-decl307.json", import.meta.url), "utf8"));
export const DECL307D_DATA_VERSION = DATA.version;
export const DECL307D = Object.freeze(DATA.decl);
/** 第308便d の変換の宣言(役割の表と理由)。 */
export const CHANGE308D = Object.freeze(DATA.change);
const clone = (x) => JSON.parse(JSON.stringify(x));
const hasRole = (fr) => !!(fr && Array.isArray(fr.targets) && fr.targets.some((t) => t && t.role !== undefined));
/** 本ごとの世代の門: 写しのある本で、第308便d の世代(fitRecord の標的に role)なら真。 */
export function gate307d(p) {
  const d = p && DECL307D[p.id];
  return !!(d && d.fitRecord && hasRole(p.fitRecord));
}
const view = (q) => JSON.stringify(q.fitRecord || null);
/** 本 p の写し(第307便の宣言の欄 fitRecord を戻す)。DECL307D に無い本は clone と同じ。 */
export function pin307d(p) {
  if (!p) return p;
  const q = clone(p), d = DECL307D[q.id];
  if (d && d.fitRecord) q.fitRecord = clone(d.fitRecord);
  return q;
}
/** 門を通る本で、写すと宣言の欄(fitRecord)が変わるなら真(第307便の html では偽)。 */
export function pinChanges307d(p) {
  return gate307d(p) && view(pin307d(p)) !== view(p);
}
/** 第308便d の世代の印: 写しのある本のどれかが第307便の宣言から動いている(QA と器の世代切替)。第307便の html では偽。 */
export function isGen308d(arr) {
  return Array.isArray(arr) && arr.some((p) => pinChanges307d(p));
}
/** 器の process の中で html の大域 BUILTIN_PRESETS の要素(DECL307D の本 —— ids を渡せばその本だけ)を第307便の宣言の欄に戻す(要素の同一性を保って書き換える ——
 *  allPresets・loadPreset が同じ写しを読む)。本ごとの門 gate307d を通らない本は変えない。 */
export function pinDecl307d(evalExpr, ids) {
  let arr = null;
  try { arr = evalExpr ? evalExpr("BUILTIN_PRESETS") : vm.runInThisContext("BUILTIN_PRESETS"); } catch (_) { arr = null; }
  const want = Array.isArray(ids) ? new Set(ids) : null;
  if (!Array.isArray(arr)) return { version: LIB_VERSION, data: DECL307D_DATA_FILE, pinned: false, changed: [], skipped: [], note: "BUILTIN_PRESETS が読めない" };
  const changed = [], skipped = [];
  for (const p of arr) {
    if (!p || !DECL307D[p.id] || (want && !want.has(p.id))) continue;
    if (!gate307d(p)) { skipped.push(p.id); continue; }
    const before = view(p), q = pin307d(p);
    if (q.fitRecord) p.fitRecord = q.fitRecord;
    if (view(p) !== before) changed.push(p.id);
  }
  return { version: LIB_VERSION, data: DECL307D_DATA_FILE, pinned: changed.length > 0, changed, skipped,
    note: "第307便の本の宣言(fitRecord)に器の中だけで戻した(本ごとの門)—— html と署名の宣言は変えない" };
}
/** 第308便d の記録の変換(純関数 —— 入力を書き換えない)。rec は第307便の記録(宣言の写しか正本の記録)。役割の表(change.roles)の本は各標的の末尾に role を置く。
 *  表に無い本・標的の数が表と違う記録は写しをそのまま返す。 */
export function record308d(id, rec) {
  if (!rec) return rec;
  const out = clone(rec), roles = CHANGE308D.roles[id];
  if (roles && Array.isArray(out.targets) && out.targets.length === roles.length) out.targets = out.targets.map((t, i) => Object.assign(clone(t), { role: roles[i] }));
  return out;
}
