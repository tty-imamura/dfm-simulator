// 第306便c(統括の検証項目 R206): **第305便の本の宣言の写し**(Node の器と QA だけが読む —— html は読まない)。
// 第306便c で地球–月の本 2 本の宣言(bodies の地球・月の初期状態〔J₂ ありで解き直した初期配置〕・fitRecord・観測カード・説明)を変えた。
// **第305便の宣言で測った記録**(第305便c の J₂ の器 tests/exp-w305c-j2.mjs —— 段 em・emo・record)は、本を次の写しにして測る
// (tests/lib-w305c-pre.mjs の pin304・tests/lib-w304c-pre.mjs の pin303 と同じ型 —— 世代の lib を重ねる):
//   ・physics(全体)・bodies・fitRecord・abBody を第305便の宣言(基点 eaeb6da = public main 02ca93b)に戻す(本の他の欄〔obsCard・説明〕は今の宣言のまま)。
//   ・重ね方: pin304(lib-w305c-pre)と pin303(lib-w304c-pre)は physics・bodies・fitRecord・abBody を全部戻すので、それらを呼ぶ器
//     (tests/exp-w304c-baseline.mjs・pinDecl303 を呼ぶ第299〜303便の器)に pin305 は要らない(第304便・第303便の写しの値はそのまま —— 第306便c で値は動かない)。
//     pin305 を呼ぶのは第305便の宣言で測った器だけ(第305便c の J₂ の器)。同じ器で pin304 と pin305 を両方呼ばない(古い世代の写しが勝つ順で呼ぶなら pin305 → pin304)。
//   ・写しの値は凍結のデータ tests/data-w306c-decl305.json(器の入力 —— 正本の meta.inputs に sha を刻む)。この lib の本文は本の ID を持たない
//     (器の再生成範囲の下限〔lib-w281a-scope の deriveScope —— 器と lib の文字列の ID〕は、器が自分で名指す本だけになる)。
//   ・世代の門は**本ごと**: 写しのある本で、第305便c の世代(地球に三次元の J₂ の宣言 bodies[i].j2 がある)なら写す(第305便の html では写しは元と同じ —— no-op)。
//     第305便c より前の世代では何もしない(その世代の器の値は pin304・pin303 の写しが持つ)。
// 使い方: (a) loadHtmlMain の直後に pinDecl305(evalExpr?, ids?) を呼ぶ(html の大域の BUILTIN_PRESETS の要素を器の中だけで差し替える —— html は変えない)。
//     (b) 1 本だけ写すときは pin305(p)(門は gate305(p) —— 写して変わるかは pinChanges305(p))。
import fs from "node:fs";
import vm from "node:vm";
export const LIB_VERSION = "w306c-pre-1";
/** 凍結の写しのデータ(器の入力 —— リポジトリの相対パス)。 */
export const DECL305_DATA_FILE = "tests/data-w306c-decl305.json";
const DATA = JSON.parse(fs.readFileSync(new URL("./data-w306c-decl305.json", import.meta.url), "utf8"));
export const DECL305_DATA_VERSION = DATA.version;
export const DECL305 = Object.freeze(DATA.decl);
const clone = (x) => JSON.parse(JSON.stringify(x));
/** 本ごとの世代の門: 写しのある本で、第305便c の世代(bodies のどれかに三次元の J₂ の宣言 j2 がある)なら真。 */
export function gate305(p) {
  return !!(p && DECL305[p.id] && Array.isArray(p.bodies) && p.bodies.some((b) => b && b.j2));
}
const view = (q) => JSON.stringify([q.physics || null, q.bodies || null, q.fitRecord || null, q.abBody || null]);
/** 本 p の写し(第305便の宣言の欄を戻す)。DECL305 に無い本は clone と同じ。o.dropFit で fitRecord を外す。 */
export function pin305(p, o = {}) {
  if (!p) return p;
  const q = clone(p), d = DECL305[q.id];
  if (!d) return q;
  q.physics = clone(d.physics);
  q.bodies = clone(d.bodies);
  if (o.dropFit) delete q.fitRecord; else if (d.fitRecord) q.fitRecord = clone(d.fitRecord); else delete q.fitRecord;
  if (d.abBody) q.abBody = clone(d.abBody);
  return q;
}
/** 門を通る本で、写すと宣言の欄(physics・bodies・fitRecord・abBody)が変わるなら真(第305便の html では偽)。 */
export function pinChanges305(p) {
  return gate305(p) && view(pin305(p)) !== view(p);
}
/** 第306便c の世代の印: 写しのある本のどれかが第305便の宣言から動いている(QA と器の世代切替)。第305便の html では偽。 */
export const GEN306C_MARK = /第306便c/;
export function isGen306c(arr) {
  return Array.isArray(arr) && arr.some((p) => pinChanges305(p));
}
/** 器の process の中で html の大域 BUILTIN_PRESETS の要素(DECL305 の本 —— ids を渡せばその本だけ)を第305便の宣言の欄に戻す(要素の同一性を保って書き換える ——
 *  allPresets・loadPreset が同じ写しを読む)。本ごとの門 gate305 を通らない本は変えない。 */
export function pinDecl305(evalExpr, ids) {
  let arr = null;
  try { arr = evalExpr ? evalExpr("BUILTIN_PRESETS") : vm.runInThisContext("BUILTIN_PRESETS"); } catch (_) { arr = null; }
  const want = Array.isArray(ids) ? new Set(ids) : null;
  if (!Array.isArray(arr)) return { version: LIB_VERSION, data: DECL305_DATA_FILE, pinned: false, changed: [], skipped: [], note: "BUILTIN_PRESETS が読めない" };
  const changed = [], skipped = [];
  for (const p of arr) {
    if (!p || !DECL305[p.id] || (want && !want.has(p.id))) continue;
    if (!gate305(p)) { skipped.push(p.id); continue; }
    const before = view(p), q = pin305(p);
    p.physics = q.physics; p.bodies = q.bodies;
    if (q.fitRecord) p.fitRecord = q.fitRecord; else delete p.fitRecord;
    if (q.abBody) p.abBody = q.abBody;
    if (view(p) !== before) changed.push(p.id);
  }
  return { version: LIB_VERSION, data: DECL305_DATA_FILE, pinned: changed.length > 0, changed, skipped,
    note: "第305便の本の宣言(physics・bodies・fitRecord・abBody)に器の中だけで戻した(本ごとの門)—— html と署名の宣言は変えない" };
}
