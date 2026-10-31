// 第320便d(決断事項 AN478・AN481 の前段・統括の検証項目 R265 —— 第319便の見落としの型): **lint の違反を種類で数え、刻印の型以外を先に並べる**。
//
// ■ 何のためか
//   第319便の統合で lint.regenScope は「違反 15 件」の先頭 5 件だけを detail に出し、その 5 件がすべて刻印の型
//   (meta.scope が器の宣言と違う —— 鎖で器を走らせ直せば直る)だったので、陰に隠れた「宣言が下限を覆わない」2 件
//   (走らせ直しても直らない —— 器の宣言を直す)がゲートまで見えなかった。
//   本 lib は違反の文を 2 種類に分ける(**判定 PASS/FAIL は変えない** —— 並びと数の表示だけ):
//     刻印の型(stamp) … 正本の刻印が今の html・器・入力と違う(targetSha256・meta.scope・領域の刻印の欠け・入力/コードの刻印 ——
//                          文に「走らせ直す」か「鎖で作り直す」を含む)。**鎖で器を走らせ直せば直る**。
//     それ以外(other)  … 宣言・表・形の違反(宣言が下限を覆わない・常時群の集合・履歴の入力・版・欄の欠け …)。走らせ直しても直らない。
//   detail は「それ以外」を先に並べ、刻印の型は後ろに数件だけ出す。数は印 `〔違反の種類 w320d: 刻印の型以外 b 件・刻印の型 a 件〕`
//   で出す(tools/post-merge-qa.sh の ① の要約がこの印を拾って「刻印の型以外の違反 k 件」を出す)。
//
// ■ しないこと: 判定しない・違反を足さない/消さない(数と並びだけ)。lint の本文の判定の式は変えない。
export const LINT_KINDS_VERSION = 'w320d-lintkinds-1';

/** 刻印の型の文の印(どれかに当たれば刻印の型)。文の作り手(qa.mjs の lint)は「器を走らせ直すこと」を必ず添える。 */
// lint.canon304 の刻印の型は「—— 鎖で作り直す段 <段>」と書く(第320便d の部分 QA で見つけた —— 入力・コード・対象の刻印の違い)
export const STAMP_PATTERNS = [/走らせ直す/, /鎖で作り直す/];

/** 違反の文を分類する('stamp' | 'other')。 */
export function classifyViolation(s) {
  const t = String(s || '');
  return STAMP_PATTERNS.some((re) => re.test(t)) ? 'stamp' : 'other';
}

/** 違反の並び → {n, stamp, other, ordered(それ以外を先 —— 元の順を保つ), others, stamps}。 */
export function violationKinds(bad) {
  const others = [], stamps = [];
  for (const s of (bad || [])) (classifyViolation(s) === 'stamp' ? stamps : others).push(String(s));
  return { n: others.length + stamps.length, stamp: stamps.length, other: others.length, ordered: others.concat(stamps), others, stamps };
}

/** post-merge が拾う印(数字だけを変える —— 文の形は lint.violationKinds320 が照合)。 */
export const markerOf = (k) => `〔違反の種類 w320d: 刻印の型以外 ${k.other} 件・刻印の型 ${k.stamp} 件〕`;
/** 印を読む正規表現(post-merge の ① と QA が使う —— 同じ形を 2 か所に持たない)。 */
export const MARKER_RE = /〔違反の種類 w320d: 刻印の型以外 (\d+) 件・刻印の型 (\d+) 件〕/;

/**
 * lint の detail の末尾に付ける違反の段(先頭の ` / ` を含む —— 違反 0 件なら '')。
 * それ以外はすべて(上限 otherMax)・刻印の型は stampMax 件まで(それ以外が 0 件のときは従来どおり stampMax 件)。
 * @param {string[]} bad 違反の並び
 * @param {{otherMax?:number, stampMax?:number}} [o]
 */
export function violationText(bad, o) {
  const k = violationKinds(bad);
  if (!k.n) return '';
  const otherMax = (o && Number.isFinite(o.otherMax)) ? o.otherMax : 12;
  const stampMax = (o && Number.isFinite(o.stampMax)) ? o.stampMax : 5;
  const os = k.others.slice(0, otherMax);
  const ss = k.stamps.slice(0, k.other ? Math.min(stampMax, 2) : stampMax);
  const more = (k.other - os.length) + (k.stamp - ss.length);
  return ` / **違反 ${k.n} 件**${markerOf(k)}`
    + (k.other ? '(**刻印の型以外を先に** —— 走らせ直しても直らない)' : '(すべて刻印の型 —— 鎖で器を走らせ直せば直る)')
    + ': ' + os.concat(ss).join(' , ') + (more > 0 ? ` …ほか ${more} 件` : '');
}

/**
 * post-merge の ① の要約(preflight のログの行 → lint ごとの刻印の型以外の数)。
 * @param {string} logText `PASS|FAIL <id>  <detail>` の行が並んだログ
 * @returns {{other:number, stamp:number, byLint:Array<[string, number, number]>}}
 */
export function summarizeLog(logText) {
  const byLint = [];
  let other = 0, stamp = 0;
  for (const line of String(logText || '').split('\n')) {
    const m = /^(PASS|FAIL) (\S+)/.exec(line);
    if (!m) continue;
    const k = MARKER_RE.exec(line);
    if (!k) continue;
    const o = +k[1], s = +k[2];
    other += o; stamp += s;
    byLint.push([m[2], o, s]);
  }
  return { other, stamp, byLint };
}
