// 第320便d(決断事項 AN477・AN462・統括の検証項目 R265): **後に入った本の除外を宣言の条件へ**(器の名指しの除外の集合の代わり)。
//
// ■ 何か
//   第318便の統合で、器の世代より後に入った本 🗺️ solarSystem16Inertial3d(K1 の規則の宣言で生まれた本)を、6 本の器が名指しの集合で数え上げの外に置いた。
//   AN462「未対応を恒久的に隠す一覧にしない」に沿い、名指しを**宣言の条件**に置き換える:
//     K1 の規則の宣言(relativeDrag.invSq.rdRule)を持ち、**移行の前の宣言の写し(tests/lib-w315c-legacy7.mjs の LEGACY7_IDS)が無い**本。
//   在位の 7 本も今の html では invSq.rdRule を持つが写しがある(器は pinDecl315c で移行の前の写しへ戻して読む)ので当たらない ——
//   html を写しへ戻す前でも後でも、条件に当たるのは「K1 の短い形で生まれた本」だけ(本便の html では 🗺️ の 1 本 —— QA docs.w320d ⑤ が照合)。
//   器は外した本を正本に数える(ruleBooks —— 既存の欄と値は不変)。
import { LEGACY7_IDS } from './lib-w315c-legacy7.mjs';

export const RULE_BOOKS_VERSION = 'w320d-rulebooks-1';
export const RULE_BOOKS_WHY = 'K1 の規則の宣言(relativeDrag.invSq.rdRule)の本のうち移行の前の宣言の写しが無い本(K1 の短い形で生まれた本 —— 第320便d・AN477)';
/** K1 の規則の宣言の本で、移行の前の写しが無い本か。 */
export function isRuleBookNoCopy(p) {
  const r = p && p.physics && p.physics.relativeDrag;
  return !!(r && r.invSq && r.invSq.rdRule) && !LEGACY7_IDS.includes(p && p.id);
}
