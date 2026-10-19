// 第309便d(決断事項 AN361・統括の検証項目 R221): **第308便の本の宣言の写し**と**第309便d の記録の変換**
// (Node の器と QA だけが読む —— html は読まない)。
// 第309便d で変えた宣言の欄は 1 つ: 退役の本 🌥️(地球–月の二次元の再現作業の本 —— familyRole:"retired" のまま)の fitRecord の標的に役割 role を宣言した
//   (近点回転の周期 118 公転窓 —— numerical-fit〔第297便b の gain の探索 —— 探索範囲で挟めず unreachable-in-bounds の記録〕)。数・窓・抽出器・条件の署名・status は
//   第308便のまま(役割は条件の署名 fitCondSig と門 |residual| + h2 ≤ tol に入らない —— 第307便e)。退役は解かない(現役のフィットに戻さない)。
// **第308便の宣言で測った記録**(第297便b のフィットの器 tests/exp-w297b-fit.mjs の段 5 の派生本の照合 derivedCheck —— html の記録と正本の記録が同じか)は、
//   本を次の写しにして照合する(tests/lib-w308d-pre.mjs の pin307d と同じ型 —— 世代の lib を重ねる。第307便・第308便の pin は切らない):
//   ・fitRecord を第308便の宣言(基点 37b596b = public main)に戻す(本の他の欄は今の宣言のまま —— physics・bodies は第309便d で変えていない)。
//   ・写しの値は凍結のデータ tests/data-w309d-decl308.json(器の入力 —— 正本の meta.inputs に sha を刻む)。**この lib の本文は本の ID を持たない**
//     (役割の表もデータの change に置く —— 器の再生成範囲の下限〔lib-w281a-scope の deriveScope〕は器が自分で名指す本だけ)。
//   ・世代の門は**本ごと**: 写しのある本で、第309便d の世代(fitRecord の標的に role がある)なら写す(第308便の html では写しは元と同じ —— no-op)。
// 第309便d の記録は**第308便の記録の決定的な変換** record309d(id, rec)(各標的の末尾に role を置くだけ —— 数は測り直していない)。
// QA(preset.fitRole309)は「html の記録 = record309d(第308便の宣言の写し)」を照合する。
// 使い方: (a) loadHtmlMain の直後に pinDecl308d(evalExpr?, ids?) を呼ぶ(html の大域の BUILTIN_PRESETS の要素を器の中だけで差し替える —— html は変えない)。
//     (b) 1 本だけ写すときは pin308d(p)(門は gate308d(p) —— 写して変わるかは pinChanges308d(p))。
import fs from "node:fs";
import vm from "node:vm";
export const LIB_VERSION = "w309d-pre-1";
/** 凍結の写しのデータ(器の入力 —— リポジトリの相対パス)。 */
export const DECL308D_DATA_FILE = "tests/data-w309d-decl308.json";
const DATA = JSON.parse(fs.readFileSync(new URL("./data-w309d-decl308.json", import.meta.url), "utf8"));
export const DECL308D_DATA_VERSION = DATA.version;
export const DECL308D = Object.freeze(DATA.decl);
/** 第309便d の変換の宣言(役割の表と理由)。 */
export const CHANGE309D = Object.freeze(DATA.change);
const clone = (x) => JSON.parse(JSON.stringify(x));
const hasRole = (fr) => !!(fr && Array.isArray(fr.targets) && fr.targets.some((t) => t && t.role !== undefined));
/** 本ごとの世代の門: 写しのある本で、第309便d の世代(fitRecord の標的に role)なら真。 */
export function gate308d(p) {
  const d = p && DECL308D[p.id];
  return !!(d && d.fitRecord && hasRole(p.fitRecord));
}
const view = (q) => JSON.stringify(q.fitRecord || null);
/** 本 p の写し(第308便の宣言の欄 fitRecord を戻す)。DECL308D に無い本は clone と同じ。 */
export function pin308d(p) {
  if (!p) return p;
  const q = clone(p), d = DECL308D[q.id];
  if (d && d.fitRecord) q.fitRecord = clone(d.fitRecord);
  return q;
}
/** 門を通る本で、写すと宣言の欄(fitRecord)が変わるなら真(第308便の html では偽)。 */
export function pinChanges308d(p) {
  return gate308d(p) && view(pin308d(p)) !== view(p);
}
/** 第309便d の世代の印: 写しのある本のどれかが第308便の宣言から動いている(QA と器の世代切替)。第308便の html では偽。 */
export function isGen309d(arr) {
  return Array.isArray(arr) && arr.some((p) => pinChanges308d(p));
}
/** 器の process の中で html の大域 BUILTIN_PRESETS の要素(DECL308D の本 —— ids を渡せばその本だけ)を第308便の宣言の欄に戻す(要素の同一性を保って書き換える ——
 *  allPresets・loadPreset が同じ写しを読む)。本ごとの門 gate308d を通らない本は変えない。 */
export function pinDecl308d(evalExpr, ids) {
  let arr = null;
  try { arr = evalExpr ? evalExpr("BUILTIN_PRESETS") : vm.runInThisContext("BUILTIN_PRESETS"); } catch (_) { arr = null; }
  const want = Array.isArray(ids) ? new Set(ids) : null;
  if (!Array.isArray(arr)) return { version: LIB_VERSION, data: DECL308D_DATA_FILE, pinned: false, changed: [], skipped: [], note: "BUILTIN_PRESETS が読めない" };
  const changed = [], skipped = [];
  for (const p of arr) {
    if (!p || !DECL308D[p.id] || (want && !want.has(p.id))) continue;
    if (!gate308d(p)) { skipped.push(p.id); continue; }
    const before = view(p), q = pin308d(p);
    if (q.fitRecord) p.fitRecord = q.fitRecord;
    if (view(p) !== before) changed.push(p.id);
  }
  return { version: LIB_VERSION, data: DECL308D_DATA_FILE, pinned: changed.length > 0, changed, skipped,
    note: "第308便の本の宣言(fitRecord)に器の中だけで戻した(本ごとの門)—— html と署名の宣言は変えない" };
}
/** 第309便d の記録の変換(純関数 —— 入力を書き換えない)。rec は第308便の記録(宣言の写しか正本の記録)。役割の表(change.roles)の本は各標的の末尾に role を置く。
 *  表に無い本・標的の数が表と違う記録は写しをそのまま返す。 */
export function record309d(id, rec) {
  if (!rec) return rec;
  const out = clone(rec), roles = CHANGE309D.roles[id];
  if (roles && Array.isArray(out.targets) && out.targets.length === roles.length) out.targets = out.targets.map((t, i) => Object.assign(clone(t), { role: roles[i] }));
  return out;
}
