// 第344便f(統括の検証項目 R390・BL-148): **tests/qa.mjs で lib・器・文書の lib の版を文字で期待している所の一覧**(純関数 —— qa.mjs の本文を読むだけ・html を読まない・正本を書かない)。
//   QA lint.libVersionImport344f が呼ぶ。
//
// ■ 何を数えるか
//   `<名>.LIB_VERSION === '…'`・`<名>.HARNESS_VERSION === '…'`・`<名>.DOC_VERSION === '…'`(と !==)の形 —— 版の値を文字で書いて比べる所。
//   その lib が版を上げると、版を上げた枝が qa.mjs のその行も直さないと鍵が落ちる(第343便c が lib-w342b-clockstop.mjs の版を上げられなかった型)。
//   **直す型**: 版の値を正本の記録(`J.libVersion`・`J.version` —— 器がその lib で作り直した記録)と比べ、名の型(`/^w343c-clockread-lib-\d+$/`)だけを文字で見る。
//   版の履歴の照合(`X.AMEND.length` など)は残す(版を上げた枝が AMEND を足す —— 履歴の契約)。
// ■ 本便で直した範囲: 第342便・第343便の lib の行だけ(全部はやらない —— 残りは一覧として出す)。
// ■ 言わないこと: 「文字の期待が無くなった」(残りの一覧が在る)。

export const LIB_VERSION = 'w344f-libversion-lib-1';
export const DECL = Object.freeze({
  /** 版の値を文字で比べる所(左辺 = <名>.<LIB|HARNESS|DOC>_VERSION・右辺 = 引用の文字)*/
  litRe: /\b([A-Za-z_$][\w$]*)\.(LIB_VERSION|HARNESS_VERSION|DOC_VERSION)\s*(===|!==)\s*'([^']+)'/g,
  /** 版の名の便の番号(w342b- → 342) */
  waveRe: /^w(\d{3})[a-z]?\d*-/,
  /** 本便で直した範囲(便の番号) */
  fixedWaves: Object.freeze([342, 343]),
  /** 直す前(基点 63adaac)の数 —— 本枝が qa.mjs を読んで数えた値(lint.libVersionImport344f が今の数と比べる) */
  before: Object.freeze({ total: 191, inFixed: 25, lines: 11 }),
  /** 直した後に第342便・第343便の範囲に残してよい数(0 —— 版のデータの欄 O.version などは左辺の型が違うので数えに入らない) */
  afterInFixed: 0,
});

/** qa.mjs の本文から、版の値を文字で比べる所を全部(行の番号・左辺・欄・値・便) */
export function literalVersionChecks(src) {
  const lines = String(src).split('\n'), out = [];
  lines.forEach((ln, i) => {
    for (const m of ln.matchAll(DECL.litRe)) {
      const w = DECL.waveRe.exec(m[4]);
      out.push({ line: i + 1, obj: m[1], field: m[2], op: m[3], value: m[4], wave: w ? Number(w[1]) : null });
    }
  });
  return out;
}
/** 便ごとの数(と直した範囲の数) */
export function summarize(rows) {
  const byWave = {};
  for (const r of rows) { const k = r.wave === null ? 'other' : String(r.wave); byWave[k] = (byWave[k] || 0) + 1; }
  const inFixed = rows.filter((r) => DECL.fixedWaves.includes(r.wave)).length;
  return { total: rows.length, inFixed, byWave };
}
/** 直した型の照合: 名の型(/^w…-\d+$/)で見る所の数(qa.mjs の本文の中の `/^w34[23]…-\d+$/.test(` の形) */
export function patternChecks(src) {
  const re = /\/\^(w\d{3}[a-z]?\d*-[a-z0-9]+(?:-lib)?)-\\d\+\$\/\.test\(([A-Za-z_$][\w$]*)\.(LIB_VERSION|HARNESS_VERSION|DOC_VERSION)\)/g, out = [];
  for (const m of String(src).matchAll(re)) out.push({ stem: m[1], obj: m[2], field: m[3] });
  return out;
}
