// 第259便d(第51報 W4)「`S._core` の lint 予算」の**純関数**ライブラリ。
//
// 背景(〔第258便e〕): 第258便の統合ツリーで beta のフルゲートを回すと、シミュレーション本体を
// 長く走らせるテストだけが 15〜20 倍遅くなった。原因は `S._core`(単一の巨大関数)に 13 行足したこと
// そのもので、**A/B や 2 度目の build で一度 deopt した後に再最適化が通らなくなる**。第258便e は
// 光子伝播を `_core` の外へ出して基点より 620 字小さくし、余裕を作った。
// **しきい値そのものは測っていない**(基点 becda7a は 0〜288 字のどこかで崖の縁にいた)。
//
// ■ この lib がするのは 2 つだけ(ブラウザも fs も触らない — 文字列を受け取って数を返す)
//   ① `extractCoreSource(html)` … `S._core = function(dt, mode){` から**波括弧の対応**で関数末尾までを
//      切り出し、**行コメント `//` とブロックコメント `/* */` を除去**した文字列を返す
//      (文字列リテラル `' " \`` の中は除去しない — URL の `//` や絵文字の中の記号を壊さないため)。
//   ② `countCoreChars(html)` … ① の結果を**空白正規化**(`/\s+/g → " "`)して**文字数**を数える。
//
// ■ 数え方の定義(固定する — この 5 行が「数え方」の全部である)
//   (1) 範囲 = `S._core = function(dt, mode){` の **S** から、対応する `}` まで(`;` は含めない)。
//   (2) 行コメント・ブロックコメントを除去する(文字列リテラルの中は除去しない)。
//   (3) 連続する空白(改行・タブ・全角空白を含む `\s+`)を**半角空白 1 つ**に畳む。
//   (4) 文字数は JavaScript の `String.prototype.length`(**UTF-16 コード単位**)で数える
//       —— サロゲートペア(絵文字)は 2 と数える。_core 内に絵文字は無いので現状は同値である。
//   (5) 数えるのは **beta/index.html の `S._core` だけ**である(root の旧世代 html は対象外)。
//   この (1)〜(4) は〔第258便e〕が「コメント除去・空白正規化後の文字数」と書いた数え方と**同じ**で、
//   基点 becda7a を 36249・第258便 HEAD を 36920・第258便e を **35629** と数えたものである。
//
// ■ 予算 36000 字は **プロジェクトの保守的 lint 予算**である
//   **V8 普遍のしきい値ではない。** 実測で分かっているのは「36249 字では崖の縁にいて、そこから
//   +288〜+671 字で 15〜20 倍になった」「35629 字では基点と同じ速度で走る」の 2 点だけで、
//   崖の位置は測っていない(0〜288 字のどこか)。36000 はその**内側**に引いた線であって、
//   「36000 未満なら安全」という主張ではない。**上げるときは A/B(ms/步)を測ってからにする。**
//   数え方(1)〜(4)を変えると数が変わるので、**数え方も予算と一緒に固定する**。

export const CORE_BUDGET_CHARS = 36000;
export const CORE_START_TOKEN = 'S._core = function(dt, mode){';
// 〔第258便e〕の記録値(この数え方で測った実測 — 再現の突き合わせに使う)
export const CORE_REFERENCE = {
  'becda7a(第257便・基点)': 36249,
  '第258便 HEAD(a+b の 13 行)': 36920,
  '第258便e(光子伝播を外へ)': 35629,
};

// コメント除去(文字列リテラルの中は触らない)。正規表現リテラルは判別しない —— `_core` の中に
// 正規表現リテラルが無いことを `hasRegexLiteralRisk` で機械確認する(あれば数え方の前提が崩れる)。
export function stripComments(src) {
  let out = '', i = 0, quote = null;
  const n = src.length;
  while (i < n) {
    const c = src[i];
    if (quote) {
      out += c;
      if (c === '\\') { out += (src[i + 1] || ''); i += 2; continue; }
      if (c === quote) quote = null;
      i++; continue;
    }
    if (c === '"' || c === "'" || c === '`') { quote = c; out += c; i++; continue; }
    if (c === '/' && src[i + 1] === '/') { while (i < n && src[i] !== '\n') i++; continue; }
    if (c === '/' && src[i + 1] === '*') { i += 2; while (i < n && !(src[i] === '*' && src[i + 1] === '/')) i++; i += 2; continue; }
    out += c; i++;
  }
  return out;
}

// `S._core = function(dt, mode){` … 対応する `}` までを、コメント除去したうえで切り出す。
export function extractCoreSource(html) {
  const at = html.indexOf(CORE_START_TOKEN);
  if (at < 0) return { found: false, source: null, reason: CORE_START_TOKEN + ' が見つからない' };
  const stripped = stripComments(html.slice(at));
  let depth = 0, end = -1;
  for (let i = 0; i < stripped.length; i++) {
    const c = stripped[i];
    if (c === '"' || c === "'" || c === '`') {
      const q = c; i++;
      while (i < stripped.length) {
        if (stripped[i] === '\\') { i += 2; continue; }
        if (stripped[i] === q) break;
        i++;
      }
      continue;
    }
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) { end = i; break; } }
  }
  if (end < 0) return { found: false, source: null, reason: '対応する } が見つからない(波括弧が閉じていない)' };
  return { found: true, source: stripped.slice(0, end + 1), reason: null };
}

// 空白正規化後の文字数(数え方 (3)(4))
export function normalizeWhitespace(src) { return String(src).replace(/\s+/g, ' '); }

export function countCoreChars(html) {
  const ex = extractCoreSource(html);
  if (!ex.found) return { found: false, chars: null, reason: ex.reason };
  const norm = normalizeWhitespace(ex.source);
  return { found: true, chars: norm.length, rawChars: ex.source.length, reason: null };
}

// 予算の判定(FAIL は超過のときだけ。残量は常に返す)
export function assessCoreBudget(html, budget = CORE_BUDGET_CHARS) {
  const c = countCoreChars(html);
  if (!c.found) return { ok: false, chars: null, budget, remaining: null, reason: c.reason };
  const remaining = budget - c.chars;
  return { ok: remaining >= 0, chars: c.chars, rawChars: c.rawChars, budget, remaining,
    pct: +(100 * c.chars / budget).toFixed(2),
    note: remaining >= 0
      ? `残量 ${remaining} 字(予算 ${budget} 字の ${(100 * c.chars / budget).toFixed(1)}%)。`
        + '**予算は V8 普遍のしきい値ではない**(崖の位置は測っていない — 〔第258便e〕)'
      : `**予算超過 ${-remaining} 字**。新しい経路は \`S._core\` の外の関数に置き、`
        + '既存フック(`S._hookOn` の 4 か所)か step ラッパから呼ぶ(〔第258便e〕〔第239便 §4.5〕)' };
}

// 数え方の前提が崩れていないかの自己点検(正規表現リテラルがあると stripComments が誤る)。
export function hasRegexLiteralRisk(coreSource) {
  // `(` `,` `=` `return` の直後に来る `/` は正規表現リテラルの可能性がある。
  // コメント除去後の本文にこの形が無いことを確認する(現状は 0 件のはずである)。
  const m = String(coreSource).match(/(?:[(,=:[!&|?{;]|return|typeof)\s*\/(?![/*])/g);
  return { risky: !!(m && m.length), hits: m ? m.length : 0 };
}
