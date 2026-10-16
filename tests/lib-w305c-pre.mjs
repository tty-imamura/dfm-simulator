// 第305便c(統括の検証項目 R201): **第304便の本の宣言の写し**(Node の器と QA だけが読む —— html は読まない)。
// 第305便c で地球–月の本 2 本の宣言(bodies の地球に三次元の J₂ bodies[i].j2・fitRecord〔交点の標的〕・abBody・観測カード)を変えた。
// **第304便の宣言で測った記録**(第304便c の基線の見直しの器 tests/exp-w304c-baseline.mjs —— 段 solve の宣言の門・段 measure・record・emo)は、
// 本を次の写しにして測る(tests/lib-w304c-pre.mjs の pin303 と同じ型 —— 世代の lib を重ねる):
//   ・physics(全体)・bodies・fitRecord・abBody を第304便の宣言(基点 85d3797 = public main bdb7ae5)に戻す(本の他の欄〔obsCard・説明〕は今の宣言のまま)。
//     pin303 と重ねるときは pin303 が physics・bodies・fitRecord・abBody を全部戻すので pin304 は要らない(第303便の写しの器はそのまま —— 第305便c で値は動かない)。
//   ・写しの値は凍結のデータ tests/data-w305c-decl304.json(器の入力 —— 正本の meta.inputs に sha を刻む)。この lib の本文は本の ID を持たない
//     (器の再生成範囲の下限〔lib-w281a-scope の deriveScope —— 器と lib の文字列の ID〕は、器が自分で名指す本だけになる)。
//   ・世代の門は**本ごと**: 写しのある本で、第304便c の世代(physics.softeningFloor を宣言した本)なら写す(第304便の html では写しは元と同じ —— no-op)。
//     第304便c より前の世代では何もしない(その世代の器の値は pin303 の写しが持つ)。
// 使い方: (a) loadHtmlMain の直後に pinDecl304(evalExpr?, ids?) を呼ぶ(html の大域の BUILTIN_PRESETS の要素を器の中だけで差し替える —— html は変えない)。
//     (b) 1 本だけ写すときは pin304(p)(門は gate304(p) —— 写して変わるかは pinChanges304(p))。
import fs from "node:fs";
import vm from "node:vm";
export const LIB_VERSION = "w305c-pre-1";
/** 凍結の写しのデータ(器の入力 —— リポジトリの相対パス)。 */
export const DECL304_DATA_FILE = "tests/data-w305c-decl304.json";
const DATA = JSON.parse(fs.readFileSync(new URL("./data-w305c-decl304.json", import.meta.url), "utf8"));
export const DECL304_DATA_VERSION = DATA.version;
export const DECL304 = Object.freeze(DATA.decl);
const clone = (x) => JSON.parse(JSON.stringify(x));
const own = (o, k) => !!o && Object.prototype.hasOwnProperty.call(o, k);
/** 本ごとの世代の門: 写しのある本で、第304便c の世代(physics.softeningFloor の宣言がある)なら真。 */
export function gate304(p) {
  return !!(p && DECL304[p.id] && p.physics && own(p.physics, "softeningFloor"));
}
const view = (q) => JSON.stringify([q.physics || null, q.bodies || null, q.fitRecord || null, q.abBody || null]);
/** 本 p の写し(第304便の宣言の欄を戻す)。DECL304 に無い本は clone と同じ。o.dropFit で fitRecord を外す。 */
export function pin304(p, o = {}) {
  if (!p) return p;
  const q = clone(p), d = DECL304[q.id];
  if (!d) return q;
  q.physics = clone(d.physics);
  q.bodies = clone(d.bodies);
  if (o.dropFit) delete q.fitRecord; else if (d.fitRecord) q.fitRecord = clone(d.fitRecord); else delete q.fitRecord;
  if (d.abBody) q.abBody = clone(d.abBody);
  return q;
}
/** 門を通る本で、写すと宣言の欄(physics・bodies・fitRecord・abBody)が変わるなら真(第304便の html では偽)。 */
export function pinChanges304(p) {
  return gate304(p) && view(pin304(p)) !== view(p);
}
/** 第305便c の世代の印: 写しのある本のどれかが第304便の宣言から動いている(QA と器の世代切替)。第304便の html では偽。 */
export const GEN305C_MARK = /第305便c/;
export function isGen305c(arr) {
  return Array.isArray(arr) && arr.some((p) => pinChanges304(p));
}
/** 器の process の中で html の大域 BUILTIN_PRESETS の要素(DECL304 の本 —— ids を渡せばその本だけ)を第304便の宣言の欄に戻す(要素の同一性を保って書き換える ——
 *  allPresets・loadPreset が同じ写しを読む)。本ごとの門 gate304 を通らない本は変えない。 */
export function pinDecl304(evalExpr, ids) {
  let arr = null;
  try { arr = evalExpr ? evalExpr("BUILTIN_PRESETS") : vm.runInThisContext("BUILTIN_PRESETS"); } catch (_) { arr = null; }
  const want = Array.isArray(ids) ? new Set(ids) : null;
  if (!Array.isArray(arr)) return { version: LIB_VERSION, data: DECL304_DATA_FILE, pinned: false, changed: [], skipped: [], note: "BUILTIN_PRESETS が読めない" };
  const changed = [], skipped = [];
  for (const p of arr) {
    if (!p || !DECL304[p.id] || (want && !want.has(p.id))) continue;
    if (!gate304(p)) { skipped.push(p.id); continue; }
    const before = view(p), q = pin304(p);
    p.physics = q.physics; p.bodies = q.bodies;
    if (q.fitRecord) p.fitRecord = q.fitRecord; else delete p.fitRecord;
    if (q.abBody) p.abBody = q.abBody;
    if (view(p) !== before) changed.push(p.id);
  }
  return { version: LIB_VERSION, data: DECL304_DATA_FILE, pinned: changed.length > 0, changed, skipped,
    note: "第304便の本の宣言(physics・bodies・fitRecord・abBody)に器の中だけで戻した(本ごとの門)—— html と署名の宣言は変えない" };
}
