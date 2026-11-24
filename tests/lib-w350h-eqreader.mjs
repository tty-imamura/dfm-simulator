// 第350便h(統括の検証項目 R425): **計算式の一覧(docs/EQUATIONS.md)の読み手の共通の関数**
//   (項の番号・項の本文の切り出し・ラベル・PHYSICS の節の参照・プログラム版の抜粋のブロック・節〔## 2a. など〕の切り出し・項の参照の字・番号の点検)。
//   項の番号は EQ-100 から 3 桁(第348便g)。第331便d 以来の読み手は 2 桁の番号の項だけを読む正規表現を各所に持っていた
//   (tests/lib-w334f-terms.mjs の eqItems334f・tests/qa.mjs の第331便d の items331d と blocks331d・第348便g の eqItems348g・§2a の参照の読み)。
//   本 lib はその切り出しを 1 つにまとめ、**番号の桁の上限を引数**(maxDigits —— 2 = 前の便の読み手と同じ・3・4)に取る。
//   既存の鍵は今までと同じ桁の上限で呼ぶ(結果は変わらない —— 第350便h で読み手を替える前と後の部分 QA の文を突き合わせた)。新しい鍵は 4 まで読む。
//   html・エンジン・正本は読まない・状態を持たない・ファイルを読まない(文書の文字列を引数に取る純関数)。
//   項の範囲: 見出し「### EQ-NN 」の行の頭から、次の「### 」か「## 」の行の手前まで(eqItems334f と同じ)。

export const EQ_READER_350H = 'w350h-eqreader-1';
/** 桁の上限の既定(新しい鍵) —— 前の便の読み手は 2 で呼ぶ */
export const EQ_MAX_DIGITS_350H = 4;

const digitsOf = (o) => {
  const d = o && o.maxDigits != null ? Number(o.maxDigits) : EQ_MAX_DIGITS_350H;
  if (!(Number.isInteger(d) && d >= 2 && d <= 6)) throw new Error('eqreader350h: maxDigits は 2〜6 の整数(' + String(o && o.maxDigits) + ')');
  return d;
};
/** 見出しの正規表現(番号は 2 桁から maxDigits 桁 —— 2 なら前の便の /\n### (EQ-\d\d) ([^\n]*)/g と同じ) */
export function eqHeadRe350h(opt) {
  const d = digitsOf(opt);
  return new RegExp('\\n### (EQ-\\d{2,' + d + '}) ([^\\n]*)', 'g');
}
/** ラベルの欄の字(trim しない —— 第331便d の docs.equations331d と同じ取り出し) */
export function eqLabelRaw350h(text) {
  return (/\n- \*\*ラベル\*\*: ([^\n]+)/.exec(String(text || '')) || [])[1] || '';
}
/** ラベル(trim する —— eqItems334f と同じ) */
export function eqLabel350h(text) { return eqLabelRaw350h(text).trim(); }
/** 「PHYSICS の節」の欄の〔第NNN便x〕の参照 */
export function eqPhysRefs350h(text) {
  const physLine = (/\n- \*\*PHYSICS の節\*\*: ([^\n]+)/.exec(String(text || '')) || [])[1] || '';
  return [...physLine.matchAll(/〔第(\d+)便([a-z]*)〕/g)].map((z) => ({ ref: z[0], head: '〔第' + z[1] + '便' + z[2] + ' — ', wave: Number(z[1]) }));
}
/** プログラム版の抜粋のブロック(番号・ファイル・名・「// …」で分けた断片) */
export function eqBlocks350h(text) {
  const blocks = [];
  for (const b of String(text || '').matchAll(/- \*\*プログラム版 (\d+)\*\*\(`([^`]+)` · `([^`]+)`\)\n\n```js\n([\s\S]*?)\n```/g)) {
    const frags = [], cur = [];
    for (const ln of b[4].split('\n')) { if (ln.trim() === '// …') frags.push(cur.splice(0).join('\n')); else cur.push(ln); }
    frags.push(cur.splice(0).join('\n'));
    blocks.push({ k: Number(b[1]), file: b[2], name: b[3], frags });
  }
  return blocks;
}
/** 項の一覧(eqItems334f と同じ形の物: id・num・title・text・label・physRefs・blocks) */
export function eqItems350h(eq, opt) {
  const s = String(eq || ''), out = [], re = eqHeadRe350h(opt);
  let m;
  while ((m = re.exec(s))) {
    const a = m.index + 1, n1 = s.indexOf('\n### ', a + 1), n2 = s.indexOf('\n## ', a + 1);
    const ends = [n1, n2].filter((x) => x >= 0), text = s.slice(a, ends.length ? Math.min(...ends) : s.length);
    out.push({ id: m[1], num: Number(m[1].slice(3)), title: m[2], text, label: eqLabel350h(text), physRefs: eqPhysRefs350h(text), blocks: eqBlocks350h(text) });
  }
  return out;
}
/** 節の切り出し: 見出し「## <key>. 」の行から次の「## 」の手前まで(key = '2a' なら termSection334f と同じ)。無ければ '' */
export function eqSection350h(eq, key) {
  const s = String(eq || ''), i = s.indexOf('\n## ' + key + '. ');
  if (i < 0) return '';
  const j = s.indexOf('\n## ', i + 1);
  return s.slice(i + 1, j < 0 ? s.length : j);
}
/** 文の中の項の参照の字(重複を含む・出た順)。maxDigits = 2 は前の便の /EQ-\d\d/g と同じ(「EQ-100」の中の「EQ-10」も拾う —— 前の便の読みのまま) */
export function eqRefs350h(text, opt) {
  const d = digitsOf(opt);
  return [...String(text || '').matchAll(new RegExp('EQ-\\d{2,' + d + '}', 'g'))].map((m) => m[0]);
}
/** 項の番号の字 → 数(形が違えば NaN) */
export function eqNum350h(id, opt) {
  const d = digitsOf(opt);
  return new RegExp('^EQ-\\d{2,' + d + '}$').test(String(id || '')) ? Number(String(id).slice(3)) : NaN;
}
/** 番号の点検: 重複・EQ-01 からの連続の外れ・2 桁の読み手から見えない項(3 桁以上)の数 */
export function eqAudit350h(eq, opt) {
  const items = eqItems350h(eq, opt), nums = items.map((z) => z.num), seen = new Set(), dups = [];
  for (const z of items) { if (seen.has(z.id)) dups.push(z.id); seen.add(z.id); }
  const gaps = [];
  nums.forEach((n, k) => { if (n !== k + 1) gaps.push(k + 1); });
  const wide = items.filter((z) => z.id.length > 5).length;
  return { n: items.length, last: nums.length ? nums[nums.length - 1] : 0, dups, firstGap: gaps.length ? gaps[0] : 0, wide, ok: !dups.length && !gaps.length };
}
/** 世代の写し: 番号 > upto の項と、節 key(既定 '2a')の中の番号 > upto の参照の字を外す(第348便g の view347fOf348g と同じ型 —— 番号の桁は maxDigits まで) */
export function eqFixedView350h(eq, upto, opt) {
  const d = digitsOf(opt), key = (opt && opt.key) || '2a';
  let s = String(eq || '');
  s = s.replace(new RegExp('\\n### EQ-(\\d{2,' + d + '}) [^\\n]*[\\s\\S]*?(?=\\n### |\\n## )', 'g'), (m, n) => (Number(n) > upto ? '' : m));
  const i = s.indexOf('\n## ' + key + '. '), j = i >= 0 ? s.indexOf('\n## ', i + 1) : -1;
  if (i < 0 || j < 0) return s;
  return s.slice(0, i) + s.slice(i, j).replace(new RegExp('EQ-(\\d{2,' + d + '})', 'g'), (m, n) => (Number(n) > upto ? '' : m)) + s.slice(j);
}
