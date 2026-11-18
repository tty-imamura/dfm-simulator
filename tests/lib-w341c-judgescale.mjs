// 第341便c(原仮定者の指示(2026-11-18 —— 第141報)・統括の検証項目 R366・AN808・AN798):
//   **3 値の判定の境界の回帰と、真偽の判定の反転しうる葉の数え**(純関数 —— html を読まない・ファイルを読まない・状態を持たない。
//   器を走らせ直すのは呼び手〔tools/judge-survey341c.mjs〕)。
//
// ■ 境界(AN808 —— tests/lib-w340h-thin.mjs の judge3 を lib-2 に直した): 値・尺度・係数のどれかが有限の数でない(欠落・null・NaN・Infinity)か、
//   尺度・係数が負なら「未解決」(数値では決まらない)。尺度 0 は有効な入力(judge3(1, 0) は「正」のまま)。旧(lib-1)は欠けた尺度を 0 と置いて符号を返し、
//   負の尺度では −1 も「正」になった。今の正本の判定が誤っていた、という確認ではない(入力が欠けたときの備え —— 直しの前後で正本の判定が変わった葉は 0)。
// ■ 反転しうる葉の数え(AN798): 第338便c の尺度の測り方(Math の関数の戻り値を ±1〜2 ulp ずらす)を、第338便c の 2 つの種に追加の種を足して走らせ、
//   ① ずらした走行で真偽・文字列が元と違った葉(反転した見本)② 真偽の葉と同じ物の中に |値| ≤ NEAR_FACTOR × σ(σ > 0)の数の葉が在るもの(近い葉 —— 候補)を数える。
// ■ 言わないこと: 「未解決」「反転しうる」は数値の精度の話(物理の量が 0 だという主張ではない)。「未解決」を成功・満たすに数えない(集計は 3 つの数を並べる)。
import { judge3, validJudgeInput, DECL as THIN } from './lib-w340h-thin.mjs';
import { sigmaOf, DECL as R338 } from './lib-w338c-recheck.mjs';

export const LIB_VERSION = 'w341c-judgescale-lib-1';
export const DECL = Object.freeze({
  /** 境界の回帰(behavior.judgeScale341c): 尺度 5 種 × 値 ±1 → 全部「未解決」・係数 3 種 → 「未解決」・正しい入力 4 組 */
  badSigma: Object.freeze(['undefined', 'null', 'NaN', 'Infinity', '-1']),
  badFactor: Object.freeze(['NaN', 'Infinity', '-1']),
  good: Object.freeze([[5, 1, '正'], [-5, 1, '負'], [4, 1, '未解決'], [1, 0, '正']]),
  /** 反転しうる葉の数え: 追加の種(第338便c の SEEDS の後に足す —— 決まった擬似乱数)と近い葉の係数 */
  EXTRA_SEEDS: Object.freeze([341, 20261118]),
  NEAR_FACTOR: 5,
  /** 直しの前後で正本の判定が変わった葉(器 i 450 組・器 j 514 —— 第341便c の測り) */
  changedByBoundary: Object.freeze({ i: 0, j: 0, calls: 964 }),
  /** 3 値に直した器(T2 —— 第341便c): 340b の T3「主の列で減速しない」(9 行 —— 旧の真 → 未解決 1・真 → 正 1・偽 → 負 7) */
  converted: Object.freeze({ '340b': Object.freeze({ path: '/t3/rows/#/noDecelMain', margin: 'noDecelMainMargin', n: 9, changed: 1, counts: Object.freeze({ 正: 1, 負: 7, 未解決: 1 }) }) }),
  /** 常時群の 2 段が calaudit の正本から読む部分木(器の本文を読んで書いた —— 除外の Pointer と重ならないことを lint.stableRead341c が照合) */
  stableRead: Object.freeze({
    'tests/exp-w275b-d0audit.mjs': Object.freeze({ out: 'tests/out/d0audit-w275b.json', reads: Object.freeze(['/presets/*/id', '/presets/*/quantities']) }),
    'tests/exp-w282a-calcontract.mjs': Object.freeze({ out: 'tests/out/calcontract-w282a.json',
      reads: Object.freeze(['/presets/*/id', '/presets/*/quantities', '/verdictLedger/rows', '/fourValues/current/counts', '/fourValues/current/gate', '/fourValues/current/commit', '/fourValues/history']) }),
  }),
  stableReadInput: 'tests/out/calaudit-w249.json',
});
/** Pointer の重なり(`*` は 1 段の何でも): 読む部分木 reads と除外の Pointer vps のうち、一方が他方の先頭(祖先か同じ)になる組 */
export function pointerOverlap(reads, vps) {
  const seg = (p) => p.split('/').slice(1), m = (a, b) => a === '*' || b === '*' || a === b;
  const pre = (a, b) => a.length <= b.length && a.every((x, k) => m(x, b[k]));
  const out = [];
  for (const r of reads) for (const v of vps) { const A = seg(r), B = seg(v); if (pre(A, B) || pre(B, A)) out.push([r, v]); }
  return out;
}
const lit = (s) => (s === 'undefined' ? undefined : s === 'null' ? null : Number(s));

/** 境界の回帰の表 */
export function boundaryCases() {
  const rows = [];
  for (const s of DECL.badSigma) for (const v of [1, -1]) rows.push({ kind: 'sigma', v, sigma: s, factor: String(THIN.JUDGE_FACTOR), want: THIN.UNRESOLVED, got: judge3(v, lit(s)), valid: validJudgeInput(v, lit(s)) });
  for (const f of DECL.badFactor) rows.push({ kind: 'factor', v: 1, sigma: '1', factor: f, want: THIN.UNRESOLVED, got: judge3(1, 1, lit(f)), valid: validJudgeInput(1, 1, lit(f)) });
  for (const [v, s, w] of DECL.good) rows.push({ kind: 'good', v, sigma: String(s), factor: String(THIN.JUDGE_FACTOR), want: w, got: judge3(v, s), valid: validJudgeInput(v, s) });
  return rows;
}
export function boundaryGates(rows = boundaryCases()) {
  const bad = rows.filter((r) => r.kind !== 'good'), good = rows.filter((r) => r.kind === 'good');
  return { badAllUnresolved: bad.length === 13 && bad.every((r) => r.got === THIN.UNRESOLVED && r.valid === false),
    goodKept: good.length === 4 && good.every((r) => r.got === r.want && r.valid === true),
    zeroScaleValid: judge3(1, 0) === THIN.POS && judge3(-1, 0) === THIN.NEG && judge3(0, 0) === THIN.UNRESOLVED };
}
/** 旧(lib-1)の判定(比べる列 —— 直しの前後の比べと回帰の試験だけに使う) */
export function judge3Lib1(v, sigma, factor = THIN.JUDGE_FACTOR) {
  if (typeof v !== 'number' || !Number.isFinite(v)) return THIN.UNRESOLVED;
  const s = typeof sigma === 'number' && Number.isFinite(sigma) ? sigma : 0, lim = factor * s;
  return v > lim ? THIN.POS : v < -lim ? THIN.NEG : THIN.UNRESOLVED;
}

/** 数え方の対象の器(runAll を持つ —— tools/judge-survey341c.mjs が読む) */
export const SURVEY_HARNESS = Object.freeze({
  '338b': { harness: 'exp-w338b-bevelknob.mjs', out: 'bevelknob-338b.json' }, '338d': { harness: 'exp-w338d-ringbook.mjs', out: 'ringbook-338d.json' },
  '338e': { harness: 'exp-w338e-spinfield.mjs', out: 'spinfield-338e.json' }, '338f': { harness: 'exp-w338f-heatlock.mjs', out: 'heatlock-338f.json' },
  '340b': { harness: 'exp-w340b-axialsplit.mjs', out: 'axialsplit-340b.json' }, '340d': { harness: 'exp-w340d-gyropath.mjs', out: 'gyropath-340d.json' },
  '340e': { harness: 'exp-w340e-lightweight.mjs', out: 'lightweight-340e.json' }, '340f': { harness: 'exp-w340f-heatsource.mjs', out: 'heatsource-340f.json' },
  '340g': { harness: 'exp-w340g-fluidconv.mjs', out: 'fluidconv-340g.json' },
});
const kindOf = (p) => p.replace(/\/\d+(?=\/|$)/g, '/#');
/** 木の数え: base(元の走行)・sigma(尺度の木)・unstable(反転した見本の道)→ 真偽の葉・近い葉 */
export function surveyTree(base, sigma, unstable, { near = DECL.NEAR_FACTOR } = {}) {
  let nBool = 0, nearBool = 0; const boolKinds = new Set(), nearKinds = new Map();
  const w = (b, sg, p) => {
    if (!b || typeof b !== 'object') return;
    const keys = Object.keys(b), bools = keys.filter((k) => typeof b[k] === 'boolean');
    if (bools.length) {
      const nears = keys.filter((k) => typeof b[k] === 'number' && sg && typeof sg === 'object' && typeof sg[k] === 'number' && sg[k] > 0 && Math.abs(b[k]) <= near * sg[k]);
      for (const k of bools) { nBool++; boolKinds.add(kindOf(p + '/' + k)); if (nears.length) { nearBool++; const kk = kindOf(p + '/' + k); if (!nearKinds.has(kk)) nearKinds.set(kk, kindOf(p + '/' + nears[0])); } }
    }
    for (const k of keys) if (b[k] && typeof b[k] === 'object') w(b[k], sg && typeof sg === 'object' ? sg[k] : null, p + '/' + k);
  };
  w(base, sigma, '');
  const flips = unstable.slice(), flipKinds = [...new Set(flips.map(kindOf))];
  return { nBool, nBoolKinds: boolKinds.size, nearBool, nearKinds: [...nearKinds.entries()], flips, flipKinds };
}
/** 器の数え: 第338便c の種 + 追加の種 extra 個で尺度を測って surveyTree */
export function surveyRun(run, { extra = DECL.EXTRA_SEEDS.length, near = DECL.NEAR_FACTOR } = {}) {
  const seeds = [...R338.SEEDS, ...DECL.EXTRA_SEEDS.slice(0, extra)];
  const { base, sigma, unstable } = sigmaOf(run, { seeds });
  return Object.assign({ seeds }, surveyTree(base, sigma, unstable, { near }));
}
/** 自己試験(behavior.judgeScale341c): 小さな木 —— 尺度の内の数で決まる真偽は「近い」に数え、尺度を大きく超える数の真偽は数えない */
export function surveySelfTest() {
  const base = { a: { v: 1e-17, ok: true }, b: { v: 3.2, ok: true }, c: [{ v: 0, ok: false }] }, sigma = { a: { v: 1e-17, ok: null }, b: { v: 1e-16, ok: null }, c: [{ v: 0, ok: null }] };
  const S = surveyTree(base, sigma, ['/a/ok']);
  return { nearOnlyA: S.nearBool === 1 && S.nearKinds.length === 1 && S.nearKinds[0][0] === '/a/ok', nBool: S.nBool === 3, flip: S.flipKinds.length === 1 && S.flipKinds[0] === '/a/ok' };
}
