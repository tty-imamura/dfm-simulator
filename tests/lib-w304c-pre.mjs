// 第304便c(統括の検証項目 R197): **第303便の本の宣言の写し**(Node の器と QA だけが読む —— html は読まない)。
// 第304便c で地球–月の本 2 本の宣言(physics の軟化・softeningFloor・引きずりの宣言・bodies〔初期配置と e′〕・fitRecord・abBody)を基線の見直しで変えた。
// **第303便の宣言で測った記録**(第303便a の再フィット・第303便b の r⁻² の読み・第302便の宣言へ戻して測る歴史の器〔lib-w303a-pre の pin302 —— physics.relativeDrag・
// gLoc・bodies・fitRecord・abBody だけを戻す〕)は、本を次の写しにして測る(lib-w303a-pre と同じ型):
//   ・physics(全体 —— 軟化 softening・softeningFloor の有無を含む)・bodies・fitRecord・abBody を第303便の宣言(基点 caf1cde = public main 945f2a4)に戻す
//     (本の他の欄〔obsCard・説明〕は今の宣言のまま)。pin302 と重ねるときは pin302(pin303(p))(先に第303便へ・次に第302便の欄を戻す)
//   ・写しの値は凍結のデータ tests/data-w304c-decl303.json(器の入力 —— 正本の meta.inputs に sha を刻む)。この lib の本文は本の ID を持たない
//     (器の再生成範囲の下限〔lib-w281a-scope の deriveScope —— 器と lib の文字列の ID〕は、器が自分で名指す本だけになる)
//   ・世代の門は**本ごと**: 写しのある本で、宣言(physics・bodies・fitRecord・abBody)が第303便から動いていれば写す(第303便の html では写しは元と同じ —— no-op)。
//     第303便より前の世代(引きずりの宣言が Wbg の形でない —— 第302便a より前)では何もしない
// 使い方: (a) loadHtmlMain の直後(親と子プロセスの両方)に pinDecl303(evalExpr?, ids?) を呼ぶ(html の大域の BUILTIN_PRESETS の要素を器の中だけで差し替える
//         —— html は変えない)。lib-w303a-pre の pinDecl302 を使う器は、その**前に**呼ぶ(第302便の欄は pinDecl302 が上書きする)。
//     (b) 1 本だけ写すときは pin303(p)(門は gate303(p) —— 写して変わるかは pinChanges303(p))。
import fs from "node:fs";
import vm from "node:vm";
export const LIB_VERSION = "w304c-pre-1";
/** 凍結の写しのデータ(器の入力 —— リポジトリの相対パス)。 */
export const DECL303_DATA_FILE = "tests/data-w304c-decl303.json";
const DATA = JSON.parse(fs.readFileSync(new URL("./data-w304c-decl303.json", import.meta.url), "utf8"));
export const DECL303_DATA_VERSION = DATA.version;
export const DECL303 = Object.freeze(DATA.decl);
const clone = (x) => JSON.parse(JSON.stringify(x));
const own = (o, k) => !!o && Object.prototype.hasOwnProperty.call(o, k);
/** 本ごとの世代の門: 写しのある本で、引きずりの宣言が Wbg の形(第302便a 以降)なら真。 */
export function gate303(p) {
  return !!(p && DECL303[p.id] && p.physics && own(p.physics.relativeDrag, "Wbg"));
}
const view = (q) => JSON.stringify([q.physics || null, q.bodies || null, q.fitRecord || null, q.abBody || null]);
/** 本 p の写し(第303便の宣言の欄を戻す)。DECL303 に無い本は clone と同じ。o.dropFit で fitRecord を外す。 */
export function pin303(p, o = {}) {
  if (!p) return p;
  const q = clone(p), d = DECL303[q.id];
  if (!d) return q;
  q.physics = clone(d.physics);
  q.bodies = clone(d.bodies);
  if (o.dropFit) delete q.fitRecord; else if (d.fitRecord) q.fitRecord = clone(d.fitRecord); else delete q.fitRecord;
  if (d.abBody) q.abBody = clone(d.abBody);
  return q;
}
/** 門を通る本で、写すと宣言の欄(physics・bodies・fitRecord・abBody)が変わるなら真(第303便の html では偽)。 */
export function pinChanges303(p) {
  return gate303(p) && view(pin303(p)) !== view(p);
}
/** 第304便c の世代の印: 写しのある本のどれかが第303便の宣言から動いている(QA と器の世代切替)。第303便の html では偽。 */
export const GEN304C_MARK = /第304便c/;
export function isGen304c(arr) {
  return Array.isArray(arr) && arr.some((p) => pinChanges303(p));
}
/** 器の process の中で html の大域 BUILTIN_PRESETS の要素(DECL303 の本 —— ids を渡せばその本だけ)を第303便の宣言の欄に戻す(要素の同一性を保って書き換える ——
 *  allPresets・loadPreset が同じ写しを読む)。本ごとの門 gate303 を通らない本は変えない。 */
export function pinDecl303(evalExpr, ids) {
  let arr = null;
  try { arr = evalExpr ? evalExpr("BUILTIN_PRESETS") : vm.runInThisContext("BUILTIN_PRESETS"); } catch (_) { arr = null; }
  const want = Array.isArray(ids) ? new Set(ids) : null;
  if (!Array.isArray(arr)) return { version: LIB_VERSION, data: DECL303_DATA_FILE, pinned: false, changed: [], skipped: [], note: "BUILTIN_PRESETS が読めない" };
  const changed = [], skipped = [];
  for (const p of arr) {
    if (!p || !DECL303[p.id] || (want && !want.has(p.id))) continue;
    if (!gate303(p)) { skipped.push(p.id); continue; }
    const before = view(p), q = pin303(p);
    p.physics = q.physics; p.bodies = q.bodies;
    if (q.fitRecord) p.fitRecord = q.fitRecord; else delete p.fitRecord;
    if (q.abBody) p.abBody = q.abBody;
    if (view(p) !== before) changed.push(p.id);
  }
  return { version: LIB_VERSION, data: DECL303_DATA_FILE, pinned: changed.length > 0, changed, skipped,
    note: "第303便の本の宣言(physics・bodies・fitRecord・abBody)に器の中だけで戻した(本ごとの門)—— html と署名の宣言は変えない" };
}
