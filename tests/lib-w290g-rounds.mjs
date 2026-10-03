// 第290便g(統括の検証項目 R131): **確認記録の回(`confirmation_round=<N>`)を読む 1 本**と、
// 「**自分の回より大きい回で上がった印を全部除く**」数え方(第278便の教訓の恒久策)。
//
// ■ なぜ要るか
//   確認記録の器(`tests/exp-w267a-confirm2.mjs`・`exp-w269b-confirm3.mjs`・`exp-w270b-confirm4.mjs`)と
//   QA `docs.confirm4-sync` ⑥ は、「自分の回の増分」を数えるときに**後の回で上がった行**を引いていた。
//   ところが引く回を**名指し**していた(第 3 回・第 4 回・第 5 回を 1 本ずつ書き足す)ので、
//   新しい回(第 6 回以降)が印を上げるたびに**全部の器の固定値が黙って食い違う**(第278便で起きた型)。
//   本 lib は「自分の回 R より大きい回」を**全部**数える。回ごとの規則(その回で印が**動いた**行の
//   見分け方)は下の表 `ROUND_RULES` に宣言し、表に無い回は既定規則で数える。
//
// ■ 回ごとの規則(**数は第289便の正本と 1 つも変わらない** —— 各器の旧い書き方をそのまま表にした)
//   第 3 回: `verified` かつ `same_mark_as=` を持たない(同印写しは第 2 回で既に verified)。
//   第 4 回: `verified` かつ `previous_mark=unverified`(X7 の 3 欄を埋めただけの行は前から verified)。
//   第 5 回: `verified`(新規行を含む)。
//   既定(第 6 回以降): `verified` かつ `same_mark_as=` を持たず `previous_mark=verified` でもない
//            (前から verified だった行の欄埋めは増分に入れない —— 第 3・4 回と同じ考え方)。
//
// ■ この lib がしないこと
//   CSV を書かない・印を上げ下げしない・4 値を動かさない(**数えるだけ**)。
//   印を上げるのは原仮定者の照合だけである。

const ROUND_RE = /(?:^|[^A-Za-z0-9_])confirmation_round=(\d+)(?![0-9])/;

/** note の `confirmation_round=<N>`(最初の出現)。無ければ null。 */
export function confirmationRoundOf(note) {
  const m = ROUND_RE.exec(String(note || ''));
  return m ? Number(m[1]) : null;
}

const has = (note, re) => re.test(String(note || ''));
const SAME_MARK_RE = /(?:^|[^A-Za-z0-9_])same_mark_as=/;
const PREV_UNVERIFIED_RE = /(?:^|[^A-Za-z0-9_])previous_mark=unverified\b/;
const PREV_VERIFIED_RE = /(?:^|[^A-Za-z0-9_])previous_mark=verified\b/;

/** 回ごとの「この回で印が動いた行」の規則(表に無い回は DEFAULT_RULE)。 */
export const ROUND_RULES = Object.freeze({
  3: { rule: 'verified かつ same_mark_as= なし', fn: (note) => !has(note, SAME_MARK_RE) },
  4: { rule: 'verified かつ previous_mark=unverified', fn: (note) => has(note, PREV_UNVERIFIED_RE) },
  5: { rule: 'verified(新規行を含む)', fn: () => true },
});
export const DEFAULT_RULE = Object.freeze({
  rule: 'verified かつ same_mark_as= なし かつ previous_mark=verified でない',
  fn: (note) => !has(note, SAME_MARK_RE) && !has(note, PREV_VERIFIED_RE) });

/**
 * 自分の回 `ownRound` より**大きい回**で印が上がった行を、回ごとに数える。
 * @param {Array<{note:string}>} rows CSV の行(loadObsCsv の rows でよい)
 * @param {number} ownRound 器の回(2・3・4 …)
 * @param {(note:string)=>boolean} isVerified 印の厳密読み(lib-w264d-sigmamark の readSigmaMark(note).verified)
 * @returns {{total:number, byRound:Object<string,number>, rules:Object<string,string>}}
 */
export function laterRoundsVerified(rows, ownRound, isVerified) {
  const byRound = {}, rules = {};
  let total = 0;
  for (const r of (rows || [])) {
    const note = r && r.note;
    const n = confirmationRoundOf(note);
    if (n === null || !(n > ownRound)) continue;
    if (!isVerified(note)) continue;
    const R = ROUND_RULES[n] || DEFAULT_RULE;
    rules[n] = R.rule;
    if (!R.fn(note)) continue;
    byRound[n] = (byRound[n] || 0) + 1;
    total++;
  }
  return { total, byRound, rules };
}

export default { confirmationRoundOf, laterRoundsVerified, ROUND_RULES, DEFAULT_RULE };
