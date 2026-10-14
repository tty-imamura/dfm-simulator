// 第302便c(原仮定者の裁定(第92報)AN304 ①・統括の検証項目 R190): **G_loc の前の本の宣言の写し**(Node の器だけが読む —— html は読まない)。
// 第302便c で在位の惑星の本(🌡️🌋🔴🏀🟡🔷💙)が physics.gLoc を宣言し、🌡️ の W_bg を G_loc の上で合わせ直した。G_loc の前の宣言で測る意味の器
// (第301便g の W_bg の法則性・第302便b の G_loc の族・第302便d の semic の影響)は、本を次の写しにして測る:
//   ・physics.gLoc を外す(G_loc は器が条件として足す)
//   ・PRE302C_GAIN の本は引きずりの強さを第302便c の前の値に戻す(🌡️ —— 第299便c のフィットの gain 0.004522419 = W_bg 221.1205993960312)
//   ・keepFit が偽なら fitRecord を外す(新しい記録は G_loc の上の条件 —— 写しの宣言とは条件が違う)
// G_loc を宣言しない本(と第302便c の前の世代の html)は写しも元と同じ(clone だけ)。
import * as W302A from './lib-w302a-wbg.mjs';
export const LIB_VERSION = 'w302c-pre-1';
export const PRE302C_GAIN = Object.freeze({ mercurySunInertial3d: 0.004522419 });
export function pre302c(p, o = {}) {
  if (!p) return p;
  const q = JSON.parse(JSON.stringify(p));
  if (!q.physics || !q.physics.gLoc) return q;
  delete q.physics.gLoc;
  if (PRE302C_GAIN[q.id] !== undefined && q.physics.relativeDrag) W302A.rdSetGain(q.physics.relativeDrag, PRE302C_GAIN[q.id]);
  if (!o.keepFit) delete q.fitRecord;
  return q;
}
