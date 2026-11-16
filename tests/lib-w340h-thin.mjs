// 第340便h(原仮定者の指示(2026-11-17 —— 第140報)・統括の検証項目 R363): **診断の数値の安定** —— 薄い角を桁を失わない形で求める道具と、
//   丸めの残りに依って反転する判定を 3 値(正・負・未解決)で書く道具(純関数 —— html を読まない・ファイルを読まない・状態を持たない)。
//
// ■ 何を直したか(第338便c の変異の試しの残り —— AN768・AN769)
//   ① 薄い角: 2 つの単位ベクトルのなす角を Math.acos(内積) で求めると、内積が 1 に近い所(1e-3 rad より小さい角)で桁を失う
//      (cos θ = 1 − θ²/2 の θ² の分が倍精度の末尾に埋もれる —— 傾き 1e-8 rad で 0 を返す)。同じ量を Math.atan2(|外積|, 内積) で求める(式の意味は同じ)。
//      直した所: tests/lib-w333c-mercury3d.mjs の anglesOn(傾き)・tests/lib-w337k-gyrodrag.mjs の orthRow(傾きと赤道面からの角 δ —— π − i の差を使わない)・
//      tests/lib-w337j-spinorbit.mjs の twoAngleMean(軸と法線の角の最大)。
//   ② 3 値の判定: 器の判定のうち、値が葉ごとの数値の尺度(tests/lib-w338c-recheck.mjs が測る σ —— Math の関数の戻り値を ±1〜2 ulp ずらした走り直しの差の最大)の内に
//      ある量の符号で決まるものは、末尾の bit で真偽が入れ替わる(第338便c ④-6)。値 > 4σ → 「正」・値 < −4σ → 「負」・その間 → 「未解決」(数値では決まらない)。
//      係数 4 は正本で 0 と書く係数(ZERO_FACTOR)と同じ —— 正本で 0 と書いた量の符号で判定しない。**尺度の内を「0」「成功」「満たす」に読み替えない**。
// ■ 言わないこと: 3 値の「未解決」は「この計算の精度では符号が決まらない」—— 物理の量が 0 だという主張ではない。直した角で動いた候補の数は
//   「同じ式を桁を失わない形で計算した値」(新しい結果ではない)。
import { DECL as DECL338C } from './lib-w338c-recheck.mjs';

export const LIB_VERSION = 'w340h-thin-lib-1';
export const DECL = Object.freeze({
  /** 3 値の係数(正本で 0 と書く係数と同じ) */
  JUDGE_FACTOR: DECL338C.ZERO_FACTOR,
  POS: '正', NEG: '負', UNRESOLVED: '未解決',
  /** 回帰の試験の傾き [rad] と許容(相対) */
  thinGrid: Object.freeze([1e-10, 1e-8, 0.1, 1.2, Math.PI - 1e-10]),
  thinTol: 2e-14,
  /** 薄い環の行(z/r) */
  ringZoverR: 1e-10,
  /** 変異の試しの記録(tools/recheck-mutate338c.mjs —— 第338便c の器・許容は変えない): 名指し [拾う, 件数]・数の葉の種類 [拾う, 種類]。前 = 基点 d6f2f3b(第338便c の値と同じ)・後 = 本便の作り直しの後 */
  mutation: Object.freeze({
    before: Object.freeze({ named: Object.freeze([17, 20]), kinds: Object.freeze([959, 1105]) }),
    after: Object.freeze({ named: Object.freeze([17, 20]), kinds: Object.freeze([977, 1107]), kindsSameBase: Object.freeze([975, 1105]) }),   // 種類は j に 2 つ増えた(余裕と符号つきの率 —— どちらも拾う)
  }),
});
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

/** 2 つのベクトルのなす角 [rad](桁を失わない形 —— atan2(|a × b|, a·b)・長さは正規化しなくてよい) */
export const thinAngle = (a, b) => Math.atan2(nrm(crs(a, b)), dot(a, b));
/** 軸(向きを問わない)と面の法線のなす角の小さい方 [rad](0〜π/2 —— atan2(|a × b|, |a·b|)) */
export const thinAxisAngle = (a, b) => Math.atan2(nrm(crs(a, b)), Math.abs(dot(a, b)));
/** 3 値の判定: 値 v と尺度 σ(葉ごと)→ 「正」「負」「未解決」 */
export function judge3(v, sigma, factor = DECL.JUDGE_FACTOR) {
  if (typeof v !== 'number' || !Number.isFinite(v)) return DECL.UNRESOLVED;
  const s = typeof sigma === 'number' && Number.isFinite(sigma) ? sigma : 0, lim = factor * s;
  if (v > lim) return DECL.POS;
  if (v < -lim) return DECL.NEG;
  return DECL.UNRESOLVED;
}
/** 道(配列の鍵)で木の葉を読む */
export const at = (o, segs) => segs.reduce((a, k) => (a === null || a === undefined ? a : a[k]), o);

/** 回帰の試験(behavior.thinAngle340h): anglesOn の傾きの相対の差・π − 1e-10 の側・平行の扱い・薄い環の行の率が有限 */
export function regression({ anglesOn, sourceOf, ringSys, pointsOf, orthRow, orthFieldEffect }) {
  const rows = DECL.thinGrid.map((th) => { const a = anglesOn({ W: [Math.sin(th), 0, Math.cos(th)], P: [0, 1, 0] }, [0, 0, 1]);
    return { theta: th, i: a.i, rel: Math.abs(a.i - th) / th, degenerate: a.degenerate }; });
  const par = anglesOn({ W: [0, 0, 1], P: [1, 0, 0] }, [0, 0, 1]);
  const sat = Object.assign({}, sourceOf('saturn'), { axis: [0, 0, 1] }), r = 1e8, sys = ringSys(sat, { r, zMax: DECL.ringZoverR * r, nodeDeg: 0, omegaDeg: 0 });
  const row = orthRow(sys, orthFieldEffect(sat, { Omega: 1e-12 }), pointsOf(sys, null), sat.axis);
  const fin = [row.iDeg, row.di, row.dlnIown, ...Object.values(row.per).flatMap((v) => [v.dlnI, v.dlnIorth])].every(Number.isFinite);
  const iRel = Math.abs(row.iDeg * Math.PI / 180 / sys.iRad - 1);
  const thin = { thinAngle: Math.abs(thinAngle([Math.sin(1e-9), 0, Math.cos(1e-9)], [0, 0, 1]) / 1e-9 - 1), axis: Math.abs(thinAxisAngle([Math.sin(1e-9), 0, -Math.cos(1e-9)], [0, 0, 1]) / 1e-9 - 1),
    acosLoses: Math.acos(Math.cos(1e-8)) === 0 };
  const j3 = [judge3(5, 1), judge3(-5, 1), judge3(3.9, 1), judge3(-4, 1), judge3(1e-30, 0), judge3(0, 0), judge3(NaN, 1)];
  return { rows, maxRel: Math.max(...rows.map((q) => q.rel)), parallelDegenerate: par.degenerate === true, ring: { zOverR: DECL.ringZoverR, finite: fin, iRel, dlnIown: row.dlnIown }, thin, judge3: j3 };
}
export function regressionGates(R) {
  return { thin: R.maxRel < DECL.thinTol && R.rows.every((q) => q.degenerate === false), parallel: R.parallelDegenerate, ring: R.ring.finite && R.ring.iRel < 1e-12,
    helpers: R.thin.thinAngle < 1e-14 && R.thin.axis < 1e-14 && R.thin.acosLoses === true,
    judge3: JSON.stringify(R.judge3) === JSON.stringify(['正', '負', '未解決', '未解決', '正', '未解決', '未解決']) };
}
