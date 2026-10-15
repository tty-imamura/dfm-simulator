// 第303便a(原仮定者の裁定(第93報)①②・統括の検証項目 R191): **第302便の本の宣言の写し**(Node の器だけが読む —— html は読まない)。
// 第303便a で在位の惑星の本 7 本(🌡️🌋🔴🏀🟡🔷💙)から physics.gLoc(cLocPow n=−3 —— 第302便c)を外し、フィットの本 4 本(🌡️🟫🟪🌦️)を semic(第302便d の既定の步)で
// 再フィットし、🌔 へ 🌦️ の W_bg を移送した。**第302便の宣言で測った記録**(第302便b の G_loc の族・第302便c の W_bg の推定と n の選択・第302便d の semic の影響・
// 第301便g の W_bg の法則性・第297便b/第298便c/第299便c のフィットの探索の器の派生本の照合)は、本を次の写しにして測る(lib-w302c-pre の逆向き):
//   ・physics.relativeDrag・physics.gLoc・bodies・fitRecord・abBody を第302便の宣言(基点 9f92262 = 第302便の確定 7598e8e と同じ宣言)に戻す
//     (本の他の欄は今の宣言のまま —— 🌦️🌔 は第303便a の再フィットで初期配置〔bodies〕も動いた)
//   ・写しの値は凍結のデータ tests/data-w303a-decl302.json(器の入力 —— 正本の meta.inputs に sha を刻む)。この lib の本文は本の ID を持たない
//     (器の再生成範囲の下限〔lib-w281a-scope の deriveScope —— 器と lib の文字列の ID〕は、器が自分で名指す本だけになる)
//   ・世代の門は**本ごと**(その本の宣言だけを読む): 引きずりの宣言が背景慣性決定力 Wbg の形(第302便a の直接定義 —— 鍵 Wbg がある)の本だけを写す。
//     第302便a より前の世代の html(gain の形)では何もしない(それより前の世代に第302便の宣言を被せない)。第302便の html では写しは元と同じ(no-op)
// 使い方: (a) loadHtmlMain の直後(親と子プロセスの両方)に pinDecl302(evalExpr?, ids?) を呼ぶ(html の大域の BUILTIN_PRESETS の要素を器の中だけで差し替える
//         —— html は変えない)。ids を渡した器はその本だけを写す(再生成範囲の宣言に入っている本 —— 渡さなければ写しのある本を全部)。
//     (b) 1 本だけ写すときは pin302(p)(門は gate302(p) —— 写して変わるかは pinChanges302(p))。
import fs from "node:fs";
import vm from "node:vm";
export const LIB_VERSION = "w303a-pre-1";
/** 凍結の写しのデータ(器の入力 —— リポジトリの相対パス)。 */
export const DECL302_DATA_FILE = "tests/data-w303a-decl302.json";
const DATA = JSON.parse(fs.readFileSync(new URL("./data-w303a-decl302.json", import.meta.url), "utf8"));
export const DECL302_DATA_VERSION = DATA.version;
export const DECL302 = Object.freeze(DATA.decl);
const clone = (x) => JSON.parse(JSON.stringify(x));
const own = (o, k) => !!o && Object.prototype.hasOwnProperty.call(o, k);
/** 本ごとの世代の門: 写しのある本で、引きずりの宣言が Wbg の形(第302便a 以降)なら真。 */
export function gate302(p) {
  return !!(p && DECL302[p.id] && p.physics && own(p.physics.relativeDrag, "Wbg"));
}
const pinnedView = (q) => JSON.stringify([q.physics && q.physics.relativeDrag, (q.physics && q.physics.gLoc) || null, q.bodies, q.fitRecord, q.abBody]);
/** 本 p の写し(第302便の宣言の欄を戻す)。DECL302 に無い本は clone と同じ。o.dropFit で fitRecord を外す。 */
export function pin302(p, o = {}) {
  if (!p) return p;
  const q = clone(p), d = DECL302[q.id];
  if (!d) return q;
  if (q.physics) {
    q.physics.relativeDrag = clone(d.relativeDrag);
    if (d.gLoc) q.physics.gLoc = clone(d.gLoc); else delete q.physics.gLoc;
  }
  if (d.bodies) q.bodies = clone(d.bodies);
  if (d.fitRecord && !o.dropFit) q.fitRecord = clone(d.fitRecord); else if (o.dropFit) delete q.fitRecord;
  if (d.abBody) q.abBody = clone(d.abBody);
  return q;
}
/** 門を通る本で、写すと宣言の欄(relativeDrag・gLoc・bodies・fitRecord・abBody)が変わるなら真(第302便の html では偽)。 */
export function pinChanges302(p) {
  return gate302(p) && pinnedView(pin302(p)) !== pinnedView(p);
}
/** 第303便a の世代の印: 写しのある本のどれかが第302便の宣言から動いている(pinChanges302 —— QA と再フィットの器の世代切替。写しのある本を全部読む)。
 *  第302便の html では偽・第302便a より前の世代では門を通らないので偽。GEN303A_MARK は記録の来歴(procedure・law)の印。 */
export const GEN303A_MARK = /第303便a/;
export function isGen303a(arr) {
  return Array.isArray(arr) && arr.some((p) => pinChanges302(p));
}
/** 器の process の中で html の大域 BUILTIN_PRESETS の要素(DECL302 の本 —— ids を渡せばその本だけ)を第302便の宣言の欄に戻す(要素の同一性を保って書き換える ——
 *  allPresets・loadPreset が同じ写しを読む)。本ごとの門 gate302 を通らない本(第302便a より前の世代)は変えない。 */
export function pinDecl302(evalExpr, ids) {
  let arr = null;
  try { arr = evalExpr ? evalExpr("BUILTIN_PRESETS") : vm.runInThisContext("BUILTIN_PRESETS"); } catch (_) { arr = null; }
  const want = Array.isArray(ids) ? new Set(ids) : null;
  if (!Array.isArray(arr)) return { version: LIB_VERSION, data: DECL302_DATA_FILE, pinned: false, changed: [], skipped: [], note: "BUILTIN_PRESETS が読めない" };
  const changed = [], skipped = [];
  for (const p of arr) {
    if (!p || !DECL302[p.id] || (want && !want.has(p.id))) continue;
    if (!gate302(p)) { skipped.push(p.id); continue; }
    const before = pinnedView(p), q = pin302(p);
    if (p.physics) { p.physics.relativeDrag = q.physics.relativeDrag; if (q.physics.gLoc) p.physics.gLoc = q.physics.gLoc; else delete p.physics.gLoc; }
    if (q.bodies) p.bodies = q.bodies;
    if (q.fitRecord) p.fitRecord = q.fitRecord;
    if (q.abBody) p.abBody = q.abBody;
    if (pinnedView(p) !== before) changed.push(p.id);
  }
  return { version: LIB_VERSION, data: DECL302_DATA_FILE, pinned: changed.length > 0, changed, skipped,
    note: "第302便の本の宣言(relativeDrag・gLoc・bodies・fitRecord・abBody)に器の中だけで戻した(本ごとの門 —— Wbg の形の本だけ)—— html と署名の宣言は変えない" };
}
