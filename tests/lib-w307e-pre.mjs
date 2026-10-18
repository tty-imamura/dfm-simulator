// 第307便e(DECISIONS v66 §0 AN340 ④・AN342 ③・AN344 ①②・統括の検証項目 R213): **第306便の本の宣言の写し**と**第307便e の記録の変換**
// (Node の器と QA だけが読む —— html は読まない)。
// 第307便e で変えた宣言の欄は 3 つ:
//   ・地球–月の三体の本の fitRecord —— 交点の標的の obs を JPL SSD の 18.600 年から恒星に対する 18.599525 年(候補の行 OBS-56488774・Simon 1994)へ替え
//     (残差・rel・出所・許容の注記・履歴の列・手順の注記が追従 —— 模型の値・h/2 の差・窓・抽出器・条件の署名は第306便c のまま)、標的ごとの役割 role を宣言した。
//   ・冥王星–カロンの引きずりの本の fitRecord —— 標的の役割 role(入力の整合)を宣言した(他の欄は第306便e のまま)。
//   ・在位の惑星 7 本の abBody —— ワンタップの対照を「両方 OFF」(引きずり OFF ∧ physicsPatch.gLoc:null)へ・表示名。
// **第306便の宣言で測った記録**(第306便c の地球–月の器 tests/exp-w306c-emresolve.mjs・第306便e の冥王星–カロンの器 tests/exp-w306e-charonfix.mjs の
// 段 record の「本の記録と同じか」の門)は、本を次の写しにして照合する(tests/lib-w306e-pre.mjs の pin305 と同じ型 —— 世代の lib を重ねる):
//   ・fitRecord・abBody を第306便の宣言(基点 aebcf54 = public main 7da91df)に戻す(本の他の欄は今の宣言のまま —— physics・bodies は第307便e で変えていない)。
//   ・写しの値は凍結のデータ tests/data-w307e-decl306.json(器の入力 —— 正本の meta.inputs に sha を刻む)。**この lib の本文は本の ID を持たない**
//     (役割の表・交点の標的もデータの change に置く —— 器の再生成範囲の下限〔lib-w281a-scope の deriveScope〕は器が自分で名指す本だけ)。
//   ・世代の門は**本ごと**: 写しのある本で、第307便e の世代(fitRecord の標的に role がある ∨ abBody.physicsPatch に gLoc:null がある)なら写す
//     (第306便の html では写しは元と同じ —— no-op)。
// 第307便e の記録は**第306便の記録の決定的な変換** record307e(id, rec) で作る(数は測り直していない —— 交点の残差は model − 18.599525 を倍精度で引いた値)。
// QA(preset.fitRole307)は「html の記録 = record307e(第306便の正本の記録)」を照合する。
// 使い方: (a) loadHtmlMain の直後に pinDecl306e(evalExpr?, ids?) を呼ぶ(html の大域の BUILTIN_PRESETS の要素を器の中だけで差し替える —— html は変えない)。
//     (b) 1 本だけ写すときは pin306e(p)(門は gate306e(p) —— 写して変わるかは pinChanges306e(p))。
import fs from "node:fs";
import vm from "node:vm";
export const LIB_VERSION = "w307e-pre-1";
/** 凍結の写しのデータ(器の入力 —— リポジトリの相対パス)。 */
export const DECL306_DATA_FILE = "tests/data-w307e-decl306.json";
const DATA = JSON.parse(fs.readFileSync(new URL("./data-w307e-decl306.json", import.meta.url), "utf8"));
export const DECL306_DATA_VERSION = DATA.version;
export const DECL306 = Object.freeze(DATA.decl);
/** 第307便e の変換の宣言(役割の表・交点の標的・履歴の列・手順の注記)。 */
export const CHANGE307E = Object.freeze(DATA.change);
/** 役割の語(html の FIT_TARGET_ROLES と同じ 4 語 —— QA が html の定数と照合する)。 */
export const ROLES_307E = Object.freeze(["input-consistency", "numerical-fit", "transfer", "independent"]);
const clone = (x) => JSON.parse(JSON.stringify(x));
const hasRole = (fr) => !!(fr && Array.isArray(fr.targets) && fr.targets.some((t) => t && t.role !== undefined));
const glocNull = (ab) => !!(ab && ab.physicsPatch && Object.prototype.hasOwnProperty.call(ab.physicsPatch, "gLoc") && ab.physicsPatch.gLoc === null);
/** 本ごとの世代の門: 写しのある本で、第307便e の世代(fitRecord の標的に role ∨ abBody の physicsPatch に gLoc:null)なら真。 */
export function gate306e(p) {
  const d = p && DECL306[p.id];
  if (!d) return false;
  return (d.fitRecord ? hasRole(p.fitRecord) : false) || (d.abBody ? glocNull(p.abBody) : false);
}
const view = (q) => JSON.stringify([q.fitRecord || null, q.abBody || null]);
/** 本 p の写し(第306便の宣言の欄 fitRecord・abBody を戻す)。DECL306 に無い本は clone と同じ。 */
export function pin306e(p) {
  if (!p) return p;
  const q = clone(p), d = DECL306[q.id];
  if (!d) return q;
  if (d.fitRecord) q.fitRecord = clone(d.fitRecord);
  if (d.abBody) q.abBody = clone(d.abBody);
  return q;
}
/** 門を通る本で、写すと宣言の欄(fitRecord・abBody)が変わるなら真(第306便の html では偽)。 */
export function pinChanges306e(p) {
  return gate306e(p) && view(pin306e(p)) !== view(p);
}
/** 第307便e の世代の印: 写しのある本のどれかが第306便の宣言から動いている(QA と器の世代切替)。第306便の html では偽。 */
export function isGen307e(arr) {
  return Array.isArray(arr) && arr.some((p) => pinChanges306e(p));
}
/** 器の process の中で html の大域 BUILTIN_PRESETS の要素(DECL306 の本 —— ids を渡せばその本だけ)を第306便の宣言の欄に戻す(要素の同一性を保って書き換える ——
 *  allPresets・loadPreset が同じ写しを読む)。本ごとの門 gate306e を通らない本は変えない。 */
export function pinDecl306e(evalExpr, ids) {
  let arr = null;
  try { arr = evalExpr ? evalExpr("BUILTIN_PRESETS") : vm.runInThisContext("BUILTIN_PRESETS"); } catch (_) { arr = null; }
  const want = Array.isArray(ids) ? new Set(ids) : null;
  if (!Array.isArray(arr)) return { version: LIB_VERSION, data: DECL306_DATA_FILE, pinned: false, changed: [], skipped: [], note: "BUILTIN_PRESETS が読めない" };
  const changed = [], skipped = [];
  for (const p of arr) {
    if (!p || !DECL306[p.id] || (want && !want.has(p.id))) continue;
    if (!gate306e(p)) { skipped.push(p.id); continue; }
    const before = view(p), q = pin306e(p);
    if (q.fitRecord) p.fitRecord = q.fitRecord;
    if (q.abBody) p.abBody = q.abBody;
    if (view(p) !== before) changed.push(p.id);
  }
  return { version: LIB_VERSION, data: DECL306_DATA_FILE, pinned: changed.length > 0, changed, skipped,
    note: "第306便の本の宣言(fitRecord・abBody)に器の中だけで戻した(本ごとの門)—— html と署名の宣言は変えない" };
}
/** 第307便e の記録の変換(純関数 —— 入力を書き換えない)。rec は第306便の記録(正本の record.record か宣言の写し)。
 *  ①交点の標的(change.node の本と番号)の obs・residual = model − obs・rel = residual/obs・出所・許容の注記を替え、履歴の列と手順の注記を足す
 *  ②役割の表(change.roles)の本は各標的の末尾に role を置く。表に無い本は写しをそのまま返す。 */
export function record307e(id, rec) {
  if (!rec) return rec;
  const out = clone(rec), C = CHANGE307E, roles = C.roles[id];
  if (C.node && C.node.book === id) {
    const t = out.targets[C.node.target];
    t.obs = C.node.value; t.residual = t.model - t.obs; t.rel = t.residual / t.obs;
    t.source = C.node.source; t.tol = Object.assign({}, t.tol, { note: C.node.tolNote });
    out.fixed = out.fixed.concat([C.node.fixed]);
    out.procedure = C.procedure + out.procedure;
  }
  if (roles) out.targets = out.targets.map((t, i) => Object.assign(clone(t), { role: roles[i] }));
  return out;
}
/** 交点の標的の残差の門(|residual| + h2 ≤ tol)と B1 との差の照合(数は記録から —— 判定は fitTargetGates と同じ式)。 */
export function nodeGate307e(rec) {
  const C = CHANGE307E.node, t = rec && rec.targets && rec.targets[C.target];
  if (!t) return null;
  return { obs: t.obs, model: t.model, residual: t.residual, h2: t.numerics.h2, tol: t.tol.value, sum: Math.abs(t.residual) + t.numerics.h2,
    ratio: (Math.abs(t.residual) + t.numerics.h2) / t.tol.value, pass: Math.abs(t.residual) + t.numerics.h2 <= t.tol.value };
}
