// 第343便f(統括の検証項目 R383・AN798・原仮定者の回答(2026-11-19 —— 第142報の回答 2)の便): **3 値の判定の残り —— 第338便b の軸の上の行・門と、
//   第338便e の secularSame の門**(純関数 —— html を読まない・ファイルを読まない・状態を持たない)。
//
// ■ 何を直すか(第341便c の数えの道具 tools/judge-survey341c.mjs が数えた反転 —— 338b 17 種類・338e 3 種類)
//   ① 第338便b の仰角 90°(軸の上)と 0°(赤道)の行: 受け手の向きは宣言の格子でちょうど ŝ に平行(または垂直)で、強さは閉じた形で決まる
//      (q > 0・p > 0 の軸の上では |h| = μ cos^q(90°) s = 0)。旧は Math の関数を通した数(cos el = |s⊥|/|s|)から読み、ずらした走行では
//      |s⊥| が 1e-16 の桁になって「強さ 0」が向きのある種類(順の側)に変わった。→ 仰角が DECL.analyticEl の行は閉じた形の値を書き、
//      強さが解析的に 0 の欄の種類は「解析の 0」(数値の判定に流さない)。
//   ② 「軸方向で弱くなる」(赤道の強さ − 軸の上の強さ の符号): 2 つの欄がどちらも閉じた形なので、差が解析的に 0(q 0・p 0)なら「解析の 0」・
//      それ以外は符号(正・負)。閉じた形でない欄が混ざるときは器の 3 値の判定(judge3 —— tests/lib-w340h-thin.mjs)に回す。
//   ③ 合成の規則の (iii) 境目を比で動かす型の「減速しない」: 余裕 cos θ + B/(2A) を葉ごとの尺度で 3 値に(120°・比 1 は解析的に等号 ——
//      「未解決」のまま。等号を「減速しない」に含めるかは式の宣言の話 —— 第341便c の 340b と同じ扱い)。(ii) 今の規則は宣言の角の比べ(θ ≤ 120°)で
//      数値を通らないので真偽のまま。
//   ④ 第338便e の secularSame(同じ式の 2 つの実装の相対の差): 旧は |A − B| ÷ |A| で、ϖ̇ のように打ち消しで 1e-19 の桁になる量では丸めの残りで割っていた。
//      → 打ち消す前の項の大きさ(求積の各点の項の絶対値の重み付きの平均)で割る(門の意味「2 つの実装が同じ」と許容 1e-12 は変えない)。
// ■ 言わないこと: 「未解決」は数値の精度の話(物理の量が 0 だという主張ではない)。「解析の 0」は宣言の格子の上での閉じた形の値。
//   「未解決」「解析の 0」を成功・満たすに数えない(集計は数を並べる)。判定が正しくなった、とは書かない(直した器・数えた葉の事実だけ)。
import * as K from './lib-w338b-bevelknob.mjs';
import { judge3, at as atPath, DECL as THIN, LIB_VERSION as THIN_VERSION } from './lib-w340h-thin.mjs';

export const LIB_VERSION = 'w343f-judge3rest-lib-1';
export const DECL = Object.freeze({
  /** 閉じた形で書く仰角 [°](宣言の格子の端 —— 受け手の向きがちょうど ŝ に垂直・平行) */
  analyticEl: Object.freeze([0, 90]),
  ANALYTIC_ZERO: '解析の 0',
  /** 3 値の係数(tests/lib-w340h-thin.mjs の JUDGE_FACTOR —— 文字で持たない) */
  factor: THIN.JUDGE_FACTOR,
  /** 第341便c の数え(基点 89995a2 —— 本枝の木で測り直した反転の種類): 338b 17・338e 3 */
  flipsBefore: Object.freeze({ '338b': 17, '338e': 3 }),
});
export { THIN_VERSION };
const D2R = Math.PI / 180;

/** 閉じた形の欄(仰角 0° と 90°・源の自転 s = 1): 族 fam = 'q' | 'p'・k = q か p */
export function closedCell(fam, k, el) {
  if (!DECL.analyticEl.includes(el)) throw new RangeError('closedCell: 仰角は ' + DECL.analyticEl.join('・'));
  if (el === 0) return { ang: 180, mag: 1, limit: null, kind: K.kindOf(180) };   // h = −s⊥(どの q・p も)
  if (k === 0) return { ang: 0, mag: 1, limit: null, kind: K.kindOf(0) };       // q 0(μ = 1)・p 0: h = s∥
  return { ang: null, mag: 0, limit: fam === 'q' ? K.twistPoleLimitDeg(k) : 0, kind: DECL.ANALYTIC_ZERO };
}
/** (a) 仰角ごとの向きと強さ(第338便b の elevRows —— 仰角が analyticEl の行は閉じた形) */
export function elevRows343f() {
  return K.elevRows().map((row) => {
    if (!DECL.analyticEl.includes(row.elDeg)) return row;
    const out = { elDeg: row.elDeg, q: {}, p: {} };
    for (const q of K.DECL.qGrid) out.q[q] = closedCell('q', q, row.elDeg);
    for (const p of K.DECL.pGrid) out.p[p] = closedCell('p', p, row.elDeg);
    return out;
  });
}
/** (d) 向き × 強さ(第338便b の knobJudge —— 「軸方向で弱くなる」を 3 値の文字に)。weakMargin = 赤道の強さ − 軸の上の強さ */
export function knobJudge343f(rows) {
  const r = (el) => rows.find((x) => x.elDeg === el), analytic = DECL.analyticEl.includes(0) && DECL.analyticEl.includes(90), out = {};
  const one = (c0, c45, c90) => {
    const margin = c0.mag - c90.mag;
    const weak = analytic ? (margin === 0 ? DECL.ANALYTIC_ZERO : margin > 0 ? THIN.POS : THIN.NEG) : null;   // 閉じた形でない欄が混ざるなら器の judge343f が 3 値で書く
    return { eqAng: c0.ang, eqKind: c0.kind, midAng: c45.ang, midKind: c45.kind, midMag: c45.mag, poleAng: c90.ang === null ? c90.limit : c90.ang,
      poleKind: c90.ang === null ? K.kindOf(c90.limit) : c90.kind, poleMag: c90.mag, weakRatio: K.z12(c90.mag / c0.mag), weakMargin: margin, weak, weakAnalytic: analytic };
  };
  for (const q of K.DECL.qGrid) out['q' + q] = one(r(0).q[q], r(45).q[q], r(90).q[q]);
  for (const p of K.DECL.pGrid) out['p' + p] = one(r(0).p[p], r(45).p[p], r(90).p[p]);
  return out;
}
/** T4 合成の規則(第338便b の ruleTable —— (iii) の「減速しない」を余裕 marginIII = cos θ + B/(2A) にして真偽を外す。器の judge343f が 3 値で書く) */
export function ruleTable343f() {
  const T = K.ruleTable();
  const conv = (x, ratio) => { const { noDecelIII, ...rest } = x; return Object.assign(rest, { noDecelIII: null, marginIII: Math.cos(x.thDeg * D2R) + ratio / 2 }); };
  return { rows: T.rows.map((x) => conv(x, x.B)), gal120: T.gal120.map((x) => conv(x, x.B)), bodies: T.bodies.map((x) => conv(x, x.ratio)) };
}
/** 3 値の判定を書く(尺度を測った後 —— base を書き換える)。戻り値は数え */
export function judge343f(base, sigma) {
  const P = THIN.POS, N = THIN.NEG, U = THIN.UNRESOLVED, Z = DECL.ANALYTIC_ZERO;
  const cnt = { version: LIB_VERSION, thinVersion: THIN_VERSION, factor: DECL.factor, noDecelIII: { [P]: 0, [N]: 0, [U]: 0 }, weak: { [P]: 0, [N]: 0, [U]: 0, [Z]: 0 } };
  for (const part of ['rows', 'gal120', 'bodies']) ((base.t4 && base.t4[part]) || []).forEach((x, i) => { x.noDecelIII = judge3(x.marginIII, atPath(sigma, ['t4', part, i, 'marginIII']), DECL.factor); cnt.noDecelIII[x.noDecelIII]++; });
  for (const [k, j] of Object.entries((base.t2 && base.t2.judge) || {})) { if (j.weak === null) j.weak = judge3(j.weakMargin, atPath(sigma, ['t2', 'judge', k, 'weakMargin']), DECL.factor); cnt.weak[j.weak]++; }
  return cnt;
}

/* 第338便e の secularSame の直し(打ち消す前の項の大きさで割る)は tests/lib-w338e-spinfield.mjs の secularPreScale・secularSameScaled(版 2)に置いた
   (第340便e の器が import する lib の閉包を広げないため —— 本 lib は第338便b の lib だけを呼ぶ)。 */
