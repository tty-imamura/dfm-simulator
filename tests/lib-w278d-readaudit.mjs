// 第278便d(統括の読み R56)— **宣言専用鍵の読み口監査**(`docs.d0sites-sync` ⑤ と同型の機械抽出・純関数)。
//
// ■ 何をするか
//   html の inline script から**コメント・文字列・正規表現リテラルを潰した写し**を作り
//   (第276便a の `tests/exp-w276a-d0audit2.mjs` と同じ潰し方)、指定した識別子の出現を
//   **囲っている最上位関数**ごとに数える。許可した関数(検証器・検証器の分岐・定数の宣言)の外に
//   1 つでも出れば「エンジンのどこかが読んでいる」ことになる。
//   潰した写しの**波括弧・丸括弧・角括弧の収支がすべて 0** でなければ表を信用しない(`selfCheck`)。
//
// ■ しないこと
//   ・html を書き換えない・判定しない(数えて並べるだけ —— 合否は QA が出す)。
export const READAUDIT_VERSION = 'w278d-readaudit-1';

/** コメント・文字列・正規表現リテラルを空白へ潰す(長さと改行は保つ)。 */
export function stripJs(code) {
  const n = code.length;
  let out = '', i = 0, st = 0, lastSig = '', inClass = false;
  const push = (c) => { out += c; };
  const blank = (c) => { push(c === '\n' ? '\n' : ' '); };
  while (i < n) {
    const c = code[i], d = code[i + 1];
    if (st === 0) {
      if (c === '/' && d === '/') { st = 1; push(' '); push(' '); i += 2; continue; }
      if (c === '/' && d === '*') { st = 2; push(' '); push(' '); i += 2; continue; }
      if (c === '/') {
        if (lastSig === '' || /[^\w$)\]]/.test(lastSig)) { st = 6; inClass = false; push(' '); i++; continue; }
        push(c); lastSig = c; i++; continue;
      }
      if (c === "'") { st = 3; push('"'); i++; continue; }
      if (c === '"') { st = 4; push('"'); i++; continue; }
      if (c === '`') { st = 5; push('`'); i++; continue; }
      push(c); if (!/\s/.test(c)) lastSig = c; i++; continue;
    }
    if (st === 1) { if (c === '\n') { st = 0; push('\n'); i++; continue; } blank(c); i++; continue; }
    if (st === 2) { if (c === '*' && d === '/') { st = 0; push(' '); push(' '); i += 2; continue; } blank(c); i++; continue; }
    if (st === 3 || st === 4 || st === 5) {
      const q = st === 3 ? "'" : (st === 4 ? '"' : '`');
      if (c === '\\') { push(' '); push(' '); i += 2; continue; }
      if (c === q) { const was = st; st = 0; push(was === 5 ? '`' : '"'); lastSig = '"'; i++; continue; }
      blank(c); i++; continue;
    }
    if (st === 6) {
      if (c === '\\') { push(' '); push(' '); i += 2; continue; }
      if (c === '[') { inClass = true; blank(c); i++; continue; }
      if (c === ']') { inClass = false; blank(c); i++; continue; }
      if (c === '/' && !inClass) { st = 0; push(' '); lastSig = ')'; i++; continue; }
      if (c === '\n') { st = 0; push('\n'); i++; continue; }
      blank(c); i++; continue;
    }
  }
  return out;
}

/**
 * html 全文から識別子 `re`(g フラグつき正規表現)の出現を最上位関数ごとに数える。
 * @returns {{selfCheck:object, sites:Array<{line:number,fn:string,token:string}>, functions:string[],
 *            outsideAllowed:string[]}}
 */
export function auditTokenSites(html, re, allowed) {
  const sIdx = html.indexOf('<script');
  const bIdx = html.indexOf('>', sIdx) + 1;
  const eIdx = html.lastIndexOf('</script>');
  const OFFSET = html.slice(0, bIdx).split('\n').length - 1;
  const code = html.slice(bIdx, eIdx);
  const stripped = stripJs(code);
  let bal = 0, par = 0, brk = 0, minBal = 0;
  for (const ch of stripped) {
    if (ch === '{') bal++; else if (ch === '}') { bal--; if (bal < minBal) minBal = bal; }
    else if (ch === '(') par++; else if (ch === ')') par--;
    else if (ch === '[') brk++; else if (ch === ']') brk--;
  }
  const selfCheck = { sameLength: stripped.length === code.length, braces: bal, minBraceDepth: minBal,
    parens: par, brackets: brk,
    ok: stripped.length === code.length && bal === 0 && minBal === 0 && par === 0 && brk === 0 };
  const lines = stripped.split('\n');
  const sites = [];
  let depth = 0, cur = null;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (depth === 0) { const m = l.match(/^function\s+([A-Za-z_$][\w$]*)\s*\(/); cur = m ? m[1] : null; }
    let mm; re.lastIndex = 0;
    while ((mm = re.exec(l))) sites.push({ line: i + 1 + OFFSET, fn: cur || '(top-level)', token: mm[1] || mm[0] });
    for (const ch of l) { if (ch === '{') depth++; else if (ch === '}') depth--; }
    if (depth === 0) cur = null;
  }
  const functions = [...new Set(sites.map((z) => z.fn))].sort();
  const outsideAllowed = functions.filter((f) => allowed.indexOf(f) < 0);
  return { selfCheck, sites, functions, outsideAllowed };
}

export default { READAUDIT_VERSION, stripJs, auditTokenSites };
