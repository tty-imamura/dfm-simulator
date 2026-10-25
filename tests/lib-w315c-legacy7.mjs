// 第315便c(原仮定者の裁定(第117報)・決断事項 AN406・統括の検証項目 R244): **移行の前の在位の惑星 7 本の宣言の凍結の写し**(Node の器と QA だけが読む —— html は読まない)。
// 第315便c で在位の惑星 7 本(🌡️ mercury・🌋 venus・🔴 mars・🏀 jupiter・🟡 saturn・🔷 uranus・💙 neptune の SunInertial3d —— 🌦️ earthMoonSunInertial3d は含まない)の
// 宣言を新則 invSq の K1 + 規則の鍵 rdRule:"kappaM"(太陽を含む全天体 r_d = Y_k m・外殻なし・shellRecv 省略・initMotion "observed"・太陽 free)へ移した。
// **旧則(λ ∝ m の k・W_bg = W_ext・G_loc n = 2・fitRecord w298b-1)を研究対象にする器**は、本を次の写しにして測る(tests/lib-w306a-pre.mjs の pin305 と同じ型 —— 世代の lib を重ねる):
//   ・本の**全欄**(physics・bodies・fitRecord・abBody・notClaim・obsCard・説明 …)を第315便の基点(af2f426 = public main 7cd6234 + 便の開始の 1 本)の宣言に戻す
//     (BUILTIN_PRESETS の要素の写しをビット同一に —— 凍結のデータ tests/data-w315c-legacy7.json。器の入力として正本の meta.inputs に sha を刻む)。
//   ・世代の門は**本ごと**: 写しのある本で、第315便c の世代(physics.relativeDrag.invSq.rdRule が "kappaM")なら写す。基点の html(移行の前)では門が偽 —— 何もしない。
//   ・**写しの後に旧い世代の lib を重ねる**(例: pinDecl315c() の後に lib-w306a-pre の pinDecl305() —— 第306便a の世代の門〔inertialR2.denom "pair" + gLoc kappaC2〕は
//     写しの後の宣言で引く)。
// 使い方: (a) loadHtmlMain の直後に pinDecl315c()(loadHtmlHeadless なら pinDecl315c(H.evalExpr))—— html の大域の BUILTIN_PRESETS の要素を器の中だけで差し替える(html は変えない)。
//     (b) 1 本だけ写すときは legacy7Of(id) / pinLegacy7(p)(門は gateInposK1(p))。
// しないこと: html を書き換えない・正本の欄を足さない(写しの記録は meta.inputs のデータ file と meta.code の lib だけ —— 正本の意味的出力は移行の前と同じ)。
import fs from "node:fs";
import vm from "node:vm";
export const LIB_VERSION = "w315c-legacy7-1";
/** 凍結の写しのデータ(器の入力 —— リポジトリの相対パス)。 */
export const LEGACY7_DATA_FILE = "tests/data-w315c-legacy7.json";
const DATA = JSON.parse(fs.readFileSync(new URL("./data-w315c-legacy7.json", import.meta.url), "utf8"));
export const LEGACY7_DATA_VERSION = DATA.version;
export const LEGACY7_BASE = Object.freeze(Object.assign({}, DATA.base));
/** 7 本の ID(データの並び —— 太陽からの順) */
export const LEGACY7_IDS = Object.freeze(DATA.ids.slice());
const DECL = Object.freeze(DATA.decl);
const clone = (x) => JSON.parse(JSON.stringify(x));
/** 本ごとの世代の門: 写しのある本で、第315便c の世代(新則 invSq の K1 + rdRule "kappaM")なら真。 */
export function gateInposK1(p) {
  const rd = p && p.physics && p.physics.relativeDrag, isq = rd && rd.invSq;
  return !!(p && DECL[p.id] && rd && rd.law === "inertial" && isq && isq.kernel === "k1" && isq.rdRule === "kappaM");
}
/** 移行の前の宣言(全欄の写し)。写しの無い ID は null。 */
export function legacy7Of(id) { return DECL[id] ? clone(DECL[id]) : null; }
/** 本 p の写し: 門を通れば移行の前の宣言(全欄)・通らなければ clone(p)。 */
export function pinLegacy7(p) { return (p && gateInposK1(p)) ? clone(DECL[p.id]) : (p ? clone(p) : p); }
/** 第315便c の世代の印: 写しのある本のどれかが門を通る(QA と器の世代切替)。基点の html では偽。 */
export function isGen315c(arr) { return Array.isArray(arr) && arr.some((p) => gateInposK1(p)); }
/** 器の process の中で html の大域 BUILTIN_PRESETS の要素(写しのある本 —— ids を渡せばその本だけ)を移行の前の宣言に戻す
 *  (要素の同一性を保って全欄を書き換える —— allPresets・loadPreset が同じ写しを読む)。本ごとの門を通らない本は変えない。 */
export function pinDecl315c(evalExpr, ids) {
  let arr = null;
  try { arr = evalExpr ? evalExpr("BUILTIN_PRESETS") : vm.runInThisContext("BUILTIN_PRESETS"); } catch (_) { arr = null; }
  const want = Array.isArray(ids) ? new Set(ids) : null;
  if (!Array.isArray(arr)) return { version: LIB_VERSION, data: LEGACY7_DATA_FILE, pinned: false, changed: [], skipped: [], note: "BUILTIN_PRESETS が読めない" };
  const changed = [], skipped = [];
  for (const p of arr) {
    if (!p || !DECL[p.id] || (want && !want.has(p.id))) continue;
    if (!gateInposK1(p)) { skipped.push(p.id); continue; }
    const q = clone(DECL[p.id]);
    for (const k of Object.keys(p)) delete p[k];
    Object.assign(p, q);
    changed.push(p.id);
  }
  return { version: LIB_VERSION, data: LEGACY7_DATA_FILE, pinned: changed.length > 0, changed, skipped,
    note: "第315便c の移行の前(基点 af2f426)の在位の惑星の本の宣言(全欄)に器の中だけで戻した(本ごとの門)—— html は変えない" };
}
/** headless の写し(tests/lib-w279b-headless.mjs の loadHtmlHeadless の戻り値 H)の BUILTIN_PRESETS を移行の前の宣言へ戻して H を返す(QA の世代切替の 1 式 ——
 *  `pinHeadless(loadHtmlHeadless(html))`)。H が無い・evalExpr が無いときはそのまま返す。 */
export function pinHeadless(H) { if (H && typeof H.evalExpr === "function") pinDecl315c(H.evalExpr); return H; }
