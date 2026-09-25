// 第281便a(原仮定者の裁定(第71報)・AN16 採用・統括の検証項目 R71): **正本 JSON の再生成範囲 = 領域 hash**。
//
// ■ 何をするか
//   正本 JSON はこれまで「target = html 全体の sha256」で縛られていた(`lint.provenanceMeta` ②)。
//   CSS を 1 行変えただけでも、html を読む正本は全部「走らせ直せ」になる。本器は、器(exp-*.mjs)が
//   **読む html の領域**を宣言させ、その領域だけの hash(`scopeSha256`)を作る:
//     scope = { presets:[id…]|'all', roots:[関数名…], core:true, consts:[名前…], complete:true }
//   領域 = ① 宣言したプリセットの**生の定義**(`BUILTIN_PRESETS` の要素 — `sim.build` が読むのはこちら)と
//          **受理後の定義**(`validatePreset(p).preset`)の JSON(説明文だけの欄 PROSE_KEYS を除く)
//        ② roots から**最上位の識別子を辿った依存閉包**(関数・定数・変数の宣言本文 —— コメントを除いた原文)
//        ③ 閉包に入った名前を**書き換える最上位の文**(`X.k=…`・`X.push(…)`・`Object.assign(X,…)` 等)
//        ④ `S._core` の本文(headless で `HP.sim._core.toString()` —— コメントを除く)
//        ⑤ 宣言した定数の**評価値**(headless の同じコンテキストで評価した JSON)
//   を 1 本の正準 JSON に並べた sha256 である。
//
// ■ 完全性(`complete`)
//   ・宣言したプリセット・roots・定数が 1 つでも見つからない/評価できない → `complete:false`。
//   ・潰した写しの括弧の収支が 0 でない(境界を信用できない)→ `complete:false`。
//   ・headless の読み込みが失敗した/`S._core` が取れない(core:true のとき)→ `complete:false`。
//   閉包は**静的な識別子の閉包**(過大近似: 局所変数の同名も辿る)。html には `window[…]`・`eval`・
//   `new Function` による動的な最上位参照が無いことを本器が毎回数えて `dynamicRefs` に記録し、
//   0 でなければ `complete:false` にする。
//
// ■ しないこと
//   ・html を書き換えない・判定しない(`lint.provenanceMeta` ② と `lint.regenScope` が判定する)。
//   ・「領域が一致したから結果が同じ」とは言わない —— 一致は**同じ領域を読んだ**ことだけを意味する
//     (器・lib・入力ファイルは従来どおり `code[]`・`inputs[]` の完全 sha で縛る)。
//   ・CSS・マークアップ・閉包の外の関数(UI の描画・文言)は領域に入らない。
import fs from 'node:fs';
import crypto from 'node:crypto';
import { loadHtmlHeadless } from './lib-w279b-headless.mjs';

/** 領域 hash の版(形を変えたら上げる。`lint.regenScope` が見る)。 */
export const SCOPE_VERSION = 'w281a-scope-1';

/**
 * プリセットの**説明文だけの欄**(`sim.build`・`validatePreset` の受理判定・`applyQLock` が読まない欄)。
 * 領域から外す。`lint.regenScope` が「これらの欄名が makeSim / validatePreset / loadPreset / applyQLock の
 * 本文に `.欄名` で現れない」ことを毎回照合する(現れたら外してはいけない)。
 */
export const PROSE_KEYS = ['descStruct', 'en', 'description', 'status', 'notClaim', 'obsCard',
  'failureFirst', 'parameterAudit', 'fidelity', 'emoji', 'familyRole'];

/** 閉包を辿らない名前(**プリセットの配列そのもの** —— ① で宣言したプリセットだけを入れる)。 */
export const DATA_REGISTRIES = ['BUILTIN_PRESETS'];

/**
 * 閉包を辿らない**文言の表**(`T(key)` が引く UI 文言 —— 値は文字列か文字列を返す関数だけ)。
 * `lint.regenScope` が「表の葉が文字列/関数だけ」であることを headless で毎回照合する
 * (数値や配列が入ったら外してはいけない)。
 */
export const TEXT_REGISTRIES = ['I18N'];

/**
 * JS を走査して 2 つの写しを作る(どちらも元と同じ長さ・改行位置も同じ):
 *   code  … コメント・文字列の中身・テンプレートの地の文・正規表現の本体を空白へ潰した写し
 *           (**テンプレートの `${…}` の式は残す** —— その中の識別子も依存に数える)
 *   nocom … コメントだけを空白へ潰した写し(hash 用の原文)
 */
export function scanJs(src) {
  const n = src.length;
  const code = new Array(n);
  const nocom = new Array(n);
  let i = 0;
  let lastSig = '';
  // 状態の積み上げ: {k:'code', depth} または {k:'tpl'}
  const stack = [{ k: 'code', depth: 0 }];
  const put = (j, c, keepCode, keepNocom) => {
    const blank = c === '\n' ? '\n' : ' ';
    code[j] = keepCode ? c : blank;
    nocom[j] = keepNocom ? c : blank;
  };
  const RE_PREV_KW = /(?:^|[^\w$])(?:return|typeof|case|do|else|in|of|new|delete|void|throw|instanceof|yield|await)$/;
  let recent = '';   // 直近の有意な文字列(正規表現の判定用・最大 16 文字)
  while (i < n) {
    const top = stack[stack.length - 1];
    const c = src[i], d = src[i + 1];
    if (top.k === 'tpl') {
      if (c === '\\') { put(i, c, false, true); if (i + 1 < n) put(i + 1, src[i + 1], false, true); i += 2; continue; }
      if (c === '`') { put(i, c, true, true); stack.pop(); lastSig = '"'; recent = (recent + '"').slice(-16); i++; continue; }
      if (c === '$' && d === '{') { put(i, c, true, true); put(i + 1, d, true, true); stack.push({ k: 'code', depth: 0, inTpl: true }); lastSig = '('; recent = (recent + '(').slice(-16); i += 2; continue; }
      put(i, c, false, true); i++; continue;
    }
    // code
    if (c === '/' && d === '/') {
      let j = i; while (j < n && src[j] !== '\n') { put(j, src[j], false, false); j++; }
      i = j; continue;
    }
    if (c === '/' && d === '*') {
      let j = i + 2; put(i, c, false, false); put(i + 1, d, false, false);
      while (j < n && !(src[j] === '*' && src[j + 1] === '/')) { put(j, src[j], false, false); j++; }
      if (j < n) { put(j, src[j], false, false); put(j + 1, src[j + 1], false, false); j += 2; }
      i = j; continue;
    }
    if (c === '/') {
      const isRe = lastSig === '' || /[^\w$)\]]/.test(lastSig) || RE_PREV_KW.test(recent);
      if (isRe) {
        put(i, c, true, true);
        let j = i + 1, inClass = false;
        while (j < n) {
          const e = src[j];
          if (e === '\\') { put(j, e, false, true); if (j + 1 < n) put(j + 1, src[j + 1], false, true); j += 2; continue; }
          if (e === '[') inClass = true; else if (e === ']') inClass = false;
          else if (e === '/' && !inClass) break;
          else if (e === '\n') break;
          put(j, e, false, true); j++;
        }
        if (j < n) { put(j, src[j], true, true); j++; }
        while (j < n && /[a-z]/i.test(src[j])) { put(j, src[j], true, true); j++; }
        lastSig = ')'; recent = (recent + ')').slice(-16);
        i = j; continue;
      }
      put(i, c, true, true); lastSig = c; recent = (recent + c).slice(-16); i++; continue;
    }
    if (c === "'" || c === '"') {
      put(i, c, true, true);
      let j = i + 1;
      while (j < n && src[j] !== c && src[j] !== '\n') {
        if (src[j] === '\\') { put(j, src[j], false, true); if (j + 1 < n) put(j + 1, src[j + 1], false, true); j += 2; continue; }
        put(j, src[j], false, true); j++;
      }
      if (j < n) { put(j, src[j], true, true); j++; }
      lastSig = '"'; recent = (recent + '"').slice(-16);
      i = j; continue;
    }
    if (c === '`') { put(i, c, true, true); stack.push({ k: 'tpl' }); i++; continue; }
    if (c === '{') { top.depth++; }
    if (c === '}') {
      if (top.inTpl && top.depth === 0) { put(i, c, true, true); stack.pop(); i++; continue; }
      top.depth--;
    }
    put(i, c, true, true);
    if (!/\s/.test(c)) { lastSig = c; recent = (recent + c).slice(-16); }
    else recent = (recent + ' ').slice(-16);
    i++;
  }
  return { code: code.join(''), nocom: nocom.join(''), unclosed: stack.length - 1 };
}

/** hash 用の本文: 行末の空白と空行を落とす(コメントは scanJs で既に空白)。 */
export function normText(t) {
  return String(t).split('\n').map((l) => l.replace(/\s+$/, '')).filter((l) => l.length).join('\n');
}

const ID_RE = /[A-Za-z_$][\w$]*/g;
const KEYWORDS = new Set(('break case catch class const continue debugger default delete do else export extends '
  + 'finally for function if import in instanceof let new return super switch this throw try typeof var void '
  + 'while with yield await async of true false null undefined NaN Infinity').split(' '));

/** 潰した写しの 1 区間から識別子(プロパティ名 `.x` を除く)を集める。 */
function identsOf(codeText) {
  const out = new Set();
  let m; ID_RE.lastIndex = 0;
  while ((m = ID_RE.exec(codeText))) {
    const s = m.index;
    if (s > 0 && /[\w$]/.test(codeText[s - 1])) continue;
    if (s > 0 && codeText[s - 1] === '.' && !(s > 2 && codeText[s - 2] === '.' && codeText[s - 3] === '.')) continue;
    if (KEYWORDS.has(m[0])) continue;
    out.add(m[0]);
  }
  return out;
}

/** 宣言文の名前(`const a=…, {b,c}=…` 等)を depth 0 の区切りで拾う。 */
function declNames(stmt) {
  const body = stmt.replace(/^\s*(?:const|let|var)\s+/, '');
  const names = [];
  let depth = 0, cur = '', pieces = [];
  for (const ch of body) {
    if ('([{'.includes(ch)) depth++;
    else if (')]}'.includes(ch)) depth--;
    if (ch === ',' && depth === 0) { pieces.push(cur); cur = ''; continue; }
    if (ch === ';' && depth === 0) break;
    cur += ch;
  }
  pieces.push(cur);
  for (const p of pieces) {
    const t = p.trim();
    if (!t) continue;
    const eq = (() => { let dd = 0; for (let k = 0; k < t.length; k++) { const ch = t[k];
      if ('([{'.includes(ch)) dd++; else if (')]}'.includes(ch)) dd--;
      else if (ch === '=' && dd === 0 && t[k + 1] !== '=' && t[k - 1] !== '=' && t[k - 1] !== '!' && t[k - 1] !== '<' && t[k - 1] !== '>') return k; }
      return -1; })();
    const lhs = (eq >= 0 ? t.slice(0, eq) : t).trim();
    if (/^[A-Za-z_$][\w$]*$/.test(lhs)) names.push(lhs);
    else if (/^[[{]/.test(lhs)) {
      // 分割代入: `{a, b: c, ...d}` / `[a, , b]` —— 右辺側(`:` の後)の名前を拾う
      for (const part of lhs.replace(/^[[{]|[\]}]$/g, '').split(',')) {
        const q = part.split(':').pop().split('=')[0].replace(/\.\.\./, '').trim();
        if (/^[A-Za-z_$][\w$]*$/.test(q)) names.push(q);
      }
    }
  }
  return names;
}

/**
 * inline script を最上位の文に分ける。
 * @returns {{segments:Array<{start,end,names:string[],kind,codeText,text}>, selfCheck:object}}
 */
export function parseTopLevel(src) {
  const { code, nocom, unclosed } = scanJs(src);
  const segs = [];
  let depth = 0, minDepth = 0, par = 0, brk = 0;
  let segStart = -1;
  let lineStart = 0;
  const lineEnds = [];
  for (let k = 0; k <= code.length; k++) if (k === code.length || code[k] === '\n') lineEnds.push(k);
  let prevLineEndDepth = 0;
  let prevTail = ';';
  const CONT = /[=,(\[+\-*/%&|^!?:<>.~]$/;
  let ls = 0;
  const closeSeg = (end) => { if (segStart >= 0) { segs.push({ start: segStart, end }); segStart = -1; } };
  for (const le of lineEnds) {
    const line = code.slice(ls, le);
    const trimmed = line.trim();
    if (prevLineEndDepth === 0 && trimmed && /^\S/.test(line)) {
      const contPrev = CONT.test(prevTail) && !/^[}\])]/.test(trimmed);
      const contThis = /^[.?:+\-*/%&|^=,)\]}]/.test(trimmed) && !/^\+\+|^--/.test(trimmed);
      if (!(contPrev || contThis)) { closeSeg(ls); segStart = ls; }
    } else if (segStart < 0 && trimmed) { segStart = ls; }
    for (let k = ls; k < le; k++) {
      const ch = code[k];
      if (ch === '{') depth++; else if (ch === '}') { depth--; if (depth < minDepth) minDepth = depth; }
      else if (ch === '(') par++; else if (ch === ')') par--;
      else if (ch === '[') brk++; else if (ch === ']') brk--;
    }
    prevLineEndDepth = depth + par + brk;
    if (trimmed) prevTail = trimmed.slice(-1);
    ls = le + 1;
  }
  closeSeg(code.length);
  const selfCheck = { sameLength: code.length === src.length && nocom.length === src.length,
    braces: depth, minBraceDepth: minDepth, parens: par, brackets: brk, unclosedTemplates: unclosed };
  selfCheck.ok = selfCheck.sameLength && depth === 0 && minDepth === 0 && par === 0 && brk === 0 && unclosed === 0;
  const segments = segs.map((s) => {
    const codeText = code.slice(s.start, s.end);
    const head = codeText.trimStart();
    let names = [], kind = 'stmt';
    let m;
    if ((m = head.match(/^(?:async\s+)?function\s*\*?\s*([A-Za-z_$][\w$]*)/))) { names = [m[1]]; kind = 'function'; }
    else if ((m = head.match(/^class\s+([A-Za-z_$][\w$]*)/))) { names = [m[1]]; kind = 'class'; }
    else if (/^(?:const|let|var)\s/.test(head)) { names = declNames(head); kind = 'decl'; }
    const text = normText(nocom.slice(s.start, s.end));
    return { start: s.start, end: s.end, names, kind, codeText, text };
  });
  return { segments, selfCheck, code, nocom };
}

/** 最上位の文のうち、閉包の名前 `X` を**書き換える**文か(`X.k=`・`X[…]=`・`X.push(`・`Object.assign(X` 等)。 */
function mutatesAny(seg, names) {
  const t = seg.codeText.trim();
  let m = t.match(/^([A-Za-z_$][\w$]*)\s*(?:\.|\[|=[^=]|\+\+|--|\+=|-=)/);
  if (m && names.has(m[1])) return m[1];
  m = t.match(/^Object\.(?:assign|defineProperty|defineProperties|freeze|setPrototypeOf)\s*\(\s*([A-Za-z_$][\w$]*)/);
  if (m && names.has(m[1])) return m[1];
  return null;
}

/** `window.HP = { … }` の最上位プロパティ(名前 → 値の式の区間)。 */
export function hpProps(parsed) {
  const k = parsed.segments.findIndex((s) => /^\s*window\.HP\s*=\s*\{/.test(s.codeText));
  if (k < 0) return { segIdx: -1, props: new Map() };
  const seg = parsed.segments[k];
  const t = seg.codeText;
  const open = t.indexOf('{');
  const props = new Map();
  let depth = 0, st = open + 1;
  const flush = (end) => {
    const piece = t.slice(st, end);
    const m = piece.match(/^\s*([A-Za-z_$][\w$]*)\s*(:)?/);
    if (m) props.set(m[1], { start: seg.start + st, end: seg.start + end, shorthand: !m[2],
      exprCode: m[2] ? piece.slice(m[0].length) : m[1] });
    st = end + 1;
  };
  for (let i = open + 1; i < t.length; i++) {
    const ch = t[i];
    if ('([{'.includes(ch)) depth++;
    else if (')]}'.includes(ch)) { if (depth === 0) { flush(i); break; } depth--; }
    else if (ch === ',' && depth === 0) flush(i);
  }
  return { segIdx: k, props };
}

/**
 * roots からの依存閉包。roots の名前は最上位の宣言名か `HP.<名前>`(`window.HP` のプロパティ —
 * そのプロパティの式だけを領域に入れ、式の識別子を辿る)。
 * 規則: (a) 名前 → 宣言の文 → 文中の識別子(プロパティ名を除く)→ 名前 …(`DATA_REGISTRIES`・
 *       `TEXT_REGISTRIES` は辿らない)
 *       (b) 名前のついていない最上位の文のうち、閉包の名前を書き換える文(`X.k=`・`X.push(` 等)
 *       (c) 閉包の外の最上位関数のうち、閉包の `let`/`var` の名前へ**代入する**関数
 *       (b)(c) で入った文の識別子もまた辿る(不動点まで)。
 * @returns {{functions:string[], missing:string[], segIdx:number[], mutators:number[], writers:number[], hp:Array}}
 */
export function closureOf(parsed, roots, stop = DATA_REGISTRIES.concat(TEXT_REGISTRIES)) {
  const byName = new Map();
  parsed.segments.forEach((s, k) => { for (const nm of s.names) { if (!byName.has(nm)) byName.set(nm, []); byName.get(nm).push(k); } });
  const letNames = new Set();
  parsed.segments.forEach((s) => { if (s.kind === 'decl' && /^\s*(?:let|var)\s/.test(s.codeText)) for (const nm of s.names) letNames.add(nm); });
  const stopSet = new Set(stop);
  const inNames = new Set();
  const segIdx = new Set();
  const missing = [];
  const queue = [];
  const HPX = hpProps(parsed);
  const hp = [];
  for (const r of roots) {
    const m = /^HP\.([A-Za-z_$][\w$]*)$/.exec(r);
    if (m) {
      const pr = HPX.props.get(m[1]);
      if (!pr) { missing.push(r); continue; }
      hp.push({ name: m[1], text: normText(parsed.nocom.slice(pr.start, pr.end)) });
      for (const id of identsOf(pr.exprCode)) if (byName.has(id) && !stopSet.has(id)) queue.push(id);
      continue;
    }
    if (byName.has(r)) queue.push(r); else missing.push(r);
  }
  const identCache = new Map();
  const idents = (k) => { if (!identCache.has(k)) identCache.set(k, identsOf(parsed.segments[k].codeText)); return identCache.get(k); };
  const addSeg = (k) => {
    if (segIdx.has(k)) return;
    segIdx.add(k);
    for (const id of idents(k)) if (!inNames.has(id) && byName.has(id) && !stopSet.has(id)) queue.push(id);
  };
  const unnamed = [];
  const fnSegs = [];
  parsed.segments.forEach((s, k) => {
    if (!s.names.length && k !== HPX.segIdx) unnamed.push(k);
    if (s.kind === 'function') fnSegs.push(k);
  });
  const mutators = new Set();
  const writers = new Set();
  let changed = true;
  while (changed) {
    changed = false;
    while (queue.length) {
      const nm = queue.shift();
      if (inNames.has(nm)) continue;
      inNames.add(nm);
      for (const k of byName.get(nm)) addSeg(k);
      changed = true;
    }
    for (const k of unnamed) {
      if (mutators.has(k)) continue;
      if (mutatesAny(parsed.segments[k], inNames)) { mutators.add(k); addSeg(k); changed = true; }
    }
    const lets = [...inNames].filter((nm) => letNames.has(nm));
    if (lets.length) {
      const re = new RegExp('(?<![\\w$.])(?:' + lets.map((x) => x.replace(/\$/g, '\\$')).join('|')
        + ')\\s*(?:=(?!=)|\\+=|-=|\\*=|/=|\\|\\|=|&&=|\\?\\?=|\\+\\+|--)|(?:\\+\\+|--)(?:'
        + lets.map((x) => x.replace(/\$/g, '\\$')).join('|') + ')(?![\\w$])');
      for (const k of fnSegs) {
        if (segIdx.has(k) || writers.has(k)) continue;
        if (re.test(parsed.segments[k].codeText)) { writers.add(k); addSeg(k); changed = true; }
      }
    }
  }
  return { functions: [...inNames].sort(), missing, segIdx: [...segIdx].sort((a, b) => a - b),
    mutators: [...mutators].sort((a, b) => a - b), writers: [...writers].sort((a, b) => a - b), hp };
}

/** 動的な最上位参照の数(`window[`・`globalThis[`・`self[`・`HP[`・`eval(`・`new Function(`)。 */
export function countDynamicRefs(codeText) {
  const m = codeText.match(/\b(?:window|globalThis|self|HP)\s*\[|(?<![\w$.])eval\s*\(|\bnew\s+Function\s*\(/g);
  return m ? m.length : 0;
}

const sha256 = (s) => crypto.createHash('sha256').update(String(s), 'utf8').digest('hex');

/** 値の正準 JSON(キーを並べ替える・関数は本文・undefined は null)。 */
export function canonJson(v) {
  const seen = new WeakSet();
  const walk = (x) => {
    if (x === undefined) return null;
    if (typeof x === 'number') return Number.isFinite(x) ? x : String(x);
    if (typeof x === 'function') return 'fn:' + String(x);
    if (x === null || typeof x !== 'object') return x;
    if (seen.has(x)) return '[cycle]';
    seen.add(x);
    if (Array.isArray(x) || ArrayBuffer.isView(x)) return Array.from(x, walk);
    const o = {};
    for (const k of Object.keys(x).sort()) o[k] = walk(x[k]);
    return o;
  };
  return JSON.stringify(walk(v));
}

const stripProse = (p) => {
  const o = {};
  for (const k of Object.keys(p || {}).sort()) if (PROSE_KEYS.indexOf(k) < 0) o[k] = p[k];
  return o;
};

const htmlCache = new Map();
function loadCtx(htmlPath) {
  const buf = fs.readFileSync(htmlPath);
  const key = htmlPath + ':' + crypto.createHash('sha256').update(buf).digest('hex');
  if (htmlCache.has(key)) return htmlCache.get(key);
  const html = buf.toString('utf8');
  const sIdx = html.indexOf('<script>');
  const eIdx = html.lastIndexOf('</script>');
  const src = html.slice(sIdx + '<script>'.length, eIdx);
  const parsed = parseTopLevel(src);
  let L = null, loadError = null;
  try { L = loadHtmlHeadless(htmlPath); } catch (e) { loadError = String(e).slice(0, 200); }
  const dynamicRefs = countDynamicRefs(parsed.code);
  const ctx = { html, src, parsed, L, loadError, dynamicRefs };
  htmlCache.clear();
  htmlCache.set(key, ctx);
  return ctx;
}

/** 宣言を正規化する(欠けた欄は既定)。 */
export function normalizeScope(decl) {
  const d = decl || {};
  return {
    presets: d.presets === 'all' ? 'all' : (Array.isArray(d.presets) ? d.presets.slice() : []),
    roots: Array.isArray(d.roots) ? d.roots.slice() : [],
    core: d.core !== false,
    consts: Array.isArray(d.consts) ? d.consts.slice() : [],
    complete: d.complete === true,
    note: typeof d.note === 'string' ? d.note : undefined,
  };
}

/**
 * 領域 hash を引く。
 * @param {string} htmlPath html の絶対パス
 * @param {object} decl 器の宣言 {presets, roots, core, consts, complete}
 * @returns {{scope:object, scopeSha256:string|null, scopeComplete:boolean, detail:object}}
 */
export function scopeHash(htmlPath, decl) {
  const sc = normalizeScope(decl);
  const why = [];
  if (!sc.complete) why.push('器が complete:true を宣言していない');
  const X = loadCtx(htmlPath);
  if (!X.parsed.selfCheck.ok) why.push('潰した写しの括弧の収支が 0 でない');
  if (X.dynamicRefs !== 0) why.push(`動的な最上位参照が ${X.dynamicRefs} 件`);
  if (!X.L || !X.L.HP) why.push('headless の読み込みに失敗: ' + (X.loadError || 'HP が無い'));
  // ① プリセット
  const presets = [];
  if (X.L && X.L.HP) {
    const B = X.L.evalExpr('BUILTIN_PRESETS');
    const ids = sc.presets === 'all' ? B.map((p) => p.id) : sc.presets;
    for (const id of ids) {
      const raw = B.find((p) => p.id === id);
      if (!raw) { why.push('プリセットが無い: ' + id); presets.push({ id, missing: true }); continue; }
      let acc = null;
      try {
        const v = X.L.HP.validatePreset(JSON.parse(JSON.stringify(raw)));
        acc = { ok: !!v.ok, legacyCore: v.legacyCore === undefined ? null : v.legacyCore,
          kFrameSnapped: v.kFrameSnapped === undefined ? null : v.kFrameSnapped,
          preset: v.preset ? stripProse(v.preset) : null };
      } catch (e) { why.push('validatePreset が投げた: ' + id); }
      presets.push({ id, raw: stripProse(raw), accepted: acc });
    }
  }
  // ② ③ 依存閉包
  const cl = closureOf(X.parsed, sc.roots);
  for (const r of cl.missing) why.push('roots の名前が最上位に無い: ' + r);
  const segs = cl.segIdx.map((k) => X.parsed.segments[k]);
  const fnTexts = segs.map((s) => [s.names.length ? s.names.join(',') : '(stmt)', s.text]);
  const hpTexts = cl.hp.map((h) => ['HP.' + h.name, h.text]);
  // ④ S._core
  let core = null;
  if (sc.core) {
    try {
      const f = X.L && X.L.HP && X.L.HP.sim && X.L.HP.sim._core;
      if (typeof f !== 'function') throw new Error('no _core');
      const fsrc = String(f);
      const sc2 = scanJs(fsrc);
      core = normText(sc2.nocom);
    } catch (e) { why.push('S._core の本文が取れない'); }
  }
  // ⑤ 定数
  const consts = [];
  for (const nm of sc.consts) {
    try { consts.push([nm, canonJson(X.L.evalExpr(nm))]); }
    catch (e) { why.push('定数を評価できない: ' + nm); consts.push([nm, null]); }
  }
  const body = canonJson({ v: SCOPE_VERSION, presets, closure: fnTexts, hp: hpTexts, core, consts,
    proseKeys: PROSE_KEYS, registries: DATA_REGISTRIES, textRegistries: TEXT_REGISTRIES });
  const complete = why.length === 0;
  const scopeSha256 = sha256(body);
  const closureBytes = segs.reduce((a, s) => a + (s.end - s.start), 0);
  return {
    scope: Object.assign({ version: SCOPE_VERSION }, sc, { complete }),
    scopeSha256,
    scopeComplete: complete,
    detail: { why, nPresets: presets.length, nNames: cl.functions.length, nSegments: segs.length,
      nMutators: cl.mutators.length, nWriters: cl.writers.length, nHp: cl.hp.length, closureBytes, scriptBytes: X.src.length,
      closureShare: +(closureBytes / X.src.length).toFixed(4), names: cl.functions,
      selfCheck: X.parsed.selfCheck, dynamicRefs: X.dynamicRefs },
  };
}

/**
 * 正本の meta に載せる 3 欄を作る(`provenanceMeta({... , scope})` から呼ばれる)。
 * complete でなければ scopeSha256 は載せるが scopeComplete:false(lint は従来どおり html 全体で縛る)。
 */
export function scopeStamp(htmlPath, decl) {
  const r = scopeHash(htmlPath, decl);
  return { scope: Object.assign({}, r.scope, { names: r.detail.nNames, segments: r.detail.nSegments,
    closureShare: r.detail.closureShare, why: r.detail.why.length ? r.detail.why : undefined }),
  scopeSha256: r.scopeSha256, scopeComplete: r.scopeComplete };
}

export default { SCOPE_VERSION, PROSE_KEYS, DATA_REGISTRIES, TEXT_REGISTRIES, scanJs, normText, parseTopLevel, hpProps, closureOf,
  countDynamicRefs, canonJson, normalizeScope, scopeHash, scopeStamp };

/**
 * 来歴 meta(第272便e の形・版 w272e-1)に**領域の 3 欄**を足した meta を返す。
 * `tests/lib-w272e-provenance.mjs` は **1 バイトも変えない**(変えると、その lib を `code[]` に刻んだ
 * 既存 53 本の刻印 ④ が全部動く)。領域を宣言する器だけがこの関数を呼び、本 lib を `code[]` に入れる。
 * @param {object} o `provenanceMeta` と同じ引数 + `scope`(宣言)
 */
export async function provenanceMetaScoped(o) {
  const P = await import('./lib-w272e-provenance.mjs');
  const s = o || {};
  const base = P.provenanceMeta(s);
  if (!s.scope) return base;
  const root = s.root || process.cwd();
  const target = base.target;
  const abs = target.startsWith('/') ? target : root.replace(/\/$/, '') + '/' + target;
  if (!/\.html$/.test(target)) return base;
  return Object.assign(base, scopeStamp(abs, s.scope));
}

/**
 * 器のコード(`code[]` のファイル本文)から、**読んでいる html の領域の下限**を機械で引く:
 *   ・`HP.<名前>` の名前 → roots に `HP.<名前>`
 *   ・html の最上位名と同じ**識別子**(コメント・文字列を除いた写しで)→ roots
 *   ・html の最上位名と同じ**文字列**(`'isNum'` のように名前で抽出する器)→ roots
 *   ・内蔵プリセット id と同じ文字列 → presets
 *   ・**器本体と lib**(`primary` —— 他の器 exp-*.mjs を抽出元として読むだけのファイルは除く)が
 *     `allPresets()` / `BUILTIN_PRESETS` を `.find(` 以外で使う → presets:'all'
 * `lint.regenScope` が「宣言 ⊇ この下限」を照合する(宣言は広めでよい・狭いと落ちる)。
 * @param {string} htmlPath
 * @param {Array<{file:string,text:string,primary:boolean}>} codeFiles
 */
export function deriveScope(htmlPath, codeFiles) {
  const X = loadCtx(htmlPath);
  const topNames = new Set();
  for (const s of X.parsed.segments) for (const nm of s.names) topNames.add(nm);
  const hpx = hpProps(X.parsed);
  const ids = new Set(X.L && X.L.HP ? X.L.evalExpr('BUILTIN_PRESETS').map((p) => p.id) : []);
  const roots = new Set(), presets = new Set();
  let all = false;
  const allWhy = [];
  for (const cf of codeFiles) {
    const sc = scanJs(cf.text);
    for (const m of sc.code.matchAll(/\bHP\s*\.\s*([A-Za-z_$][\w$]*)/g)) if (hpx.props.has(m[1])) roots.add('HP.' + m[1]);
    for (const id of identsOf(sc.code)) if (topNames.has(id) && id !== 'HP') roots.add(id);
    for (const m of cf.text.matchAll(/(['"`])([A-Za-z_$][\w$]*)\1/g)) {
      if (topNames.has(m[2])) roots.add(m[2]);
      if (ids.has(m[2])) presets.add(m[2]);
    }
    if (cf.primary) {
      const re = /(?:allPresets\s*\(\s*\)|BUILTIN_PRESETS)\s*(?:\.\s*([A-Za-z_$][\w$]*))?/g;
      let m;
      while ((m = re.exec(sc.code))) {
        if (m[1] === 'find' || m[1] === 'findIndex' || m[1] === 'some') continue;
        all = true; allWhy.push(cf.file + ':' + (m[1] || '(値)'));
      }
    }
  }
  for (const r of [...roots]) if (DATA_REGISTRIES.includes(r) || TEXT_REGISTRIES.includes(r)) roots.delete(r);
  return { presets: all ? 'all' : [...presets].sort(), roots: [...roots].sort(), allWhy };
}

/** 宣言が下限を覆っているか(presets: 'all' か上位集合 / roots: 宣言 roots の閉包が下限の roots を全部含む)。 */
export function coversDerived(htmlPath, decl, derived) {
  const X = loadCtx(htmlPath);
  const sc = normalizeScope(decl);
  const miss = [];
  if (derived.presets === 'all') { if (sc.presets !== 'all') miss.push('presets は all が要る(' + derived.allWhy.slice(0, 2).join(', ') + ')'); }
  else if (sc.presets !== 'all') for (const id of derived.presets) if (!sc.presets.includes(id)) miss.push('preset ' + id);
  const cl = closureOf(X.parsed, sc.roots);
  const have = new Set(cl.functions.concat(sc.roots));
  for (const r of derived.roots) {
    if (have.has(r)) continue;
    const m = /^HP\.(.+)$/.exec(r);
    if (m && sc.roots.includes(r)) continue;
    if (DATA_REGISTRIES.includes(r) || TEXT_REGISTRIES.includes(r)) continue;
    miss.push('root ' + r);
  }
  return { ok: miss.length === 0, miss };
}

/**
 * 下限を引くときに読むコードの集合: 器本体 + import を辿った lib/器 + 器が文字列で名指しする他の器
 * (`'exp-….mjs'`)+ 正本の `meta.code[]`。器本体と lib は primary(`allPresets()` の走査を数える)。
 * @param {string} root リポジトリ root
 * @param {string} harness 器の相対パス(tests/exp-….mjs)
 * @param {string[]} [metaCode] 正本の meta.code[] の相対パス
 */
export function codeFilesOf(root, harness, metaCode) {
  const abs = (f) => root.replace(/\/$/, '') + '/' + f;
  const set = new Set([harness]);
  const walk = (f) => {
    let s = '';
    try { s = fs.readFileSync(abs(f), 'utf8'); } catch { return; }
    for (const m of s.matchAll(/from '\.\/((?:lib|exp)-[^']+)'/g)) {
      const n = 'tests/' + m[1];
      if (!set.has(n)) { set.add(n); walk(n); }
    }
  };
  walk(harness);
  try {
    const s = fs.readFileSync(abs(harness), 'utf8');
    for (const m of s.matchAll(/['/](exp-[\w-]+\.mjs)'/g)) set.add('tests/' + m[1]);
  } catch { /* 無ければ下で落ちる */ }
  for (const f of (metaCode || [])) set.add(f);
  return [...set].filter((f) => fs.existsSync(abs(f))).map((f) => ({ file: f,
    text: fs.readFileSync(abs(f), 'utf8'),
    primary: !(/^tests\/exp-/.test(f) && f !== harness) }));
}

/** 器の本文から `const REGEN_SCOPE = {…};`(1 行の JSON)を読む。無ければ null。 */
export function readDeclaredScope(harnessText) {
  const m = String(harnessText).match(/^const REGEN_SCOPE = (\{.*\});\s*$/m);
  if (!m) return null;
  try { return JSON.parse(m[1]); } catch { return null; }
}

/**
 * JSON の入力の**安定 hash**: 走行ごとに変わる欄(時刻・wall 秒・速度)を除いた正準 JSON の sha256。
 * 常時群(calaudit 系)は毎回走り直すので、ファイル全体の sha256 は毎回変わる。後段の器がその正本を
 * 入力にしているとき、「中身(時刻以外)が同じ」なら後段を走らせ直さなくてよい —— その判定に使う。
 * **除く欄は VOLATILE_KEYS だけ**(数値の結果・宣言・観測値は 1 つも除かない)。
 */
export const VOLATILE_KEYS = ['generatedAt', 'when', 'wallSec', 'wallClock', 'wallS', 'spentSec',
  'rateStepsPerSec', 'mtime', 'measuredAt', 'elapsedSec', 'elapsedS', 'elapsedMs', 'wallMs', 'wallDurationMs',
  'durationMs', 'runMs', 'spentSecTotal', 'measurementElapsedSecTotal', 'startedAt', 'htmlLoadMs',
  'baseWallSec', 'nowWallSec', 'baseRate', 'nowRate', 'maxWallSec'];

export function stableJsonSha(abs) {
  let J;
  try { J = JSON.parse(fs.readFileSync(abs, 'utf8')); } catch { return null; }
  const drop = (x) => {
    if (Array.isArray(x)) return x.map(drop);
    if (x && typeof x === 'object') {
      const o = {};
      for (const k of Object.keys(x)) if (VOLATILE_KEYS.indexOf(k) < 0) o[k] = drop(x[k]);
      return o;
    }
    return x;
  };
  return sha256(canonJson(drop(J)));
}

/**
 * meta.inputs[] のうち JSON の入力に**安定 hash** を添える(`inputsStable`)。
 * `lint.provenanceMeta` ③ は「sha256 一致 **または** 安定 hash 一致」で通す。
 * @param {string} root
 * @param {Array<{file:string}>|string[]} inputs
 */
export function stableInputs(root, inputs) {
  const rows = [];
  for (const s of (inputs || [])) {
    const file = typeof s === 'string' ? s : (s && s.file);
    if (!file || !/\.json$/.test(file)) continue;
    const h = stableJsonSha(root.replace(/\/$/, '') + '/' + file);
    if (h) rows.push({ file, stableSha256: h });
  }
  return { inputsStable: rows, volatileKeys: VOLATILE_KEYS };
}

const okCache = new Map();
/**
 * 領域の宣言つき正本が**今の html で**領域一致しているか(`lint.provenanceMeta` ② と各 QA の ① が使う)。
 * @param {string} root リポジトリ root
 * @param {object} meta 正本の meta(scope・scopeSha256・scopeComplete・target)
 */
export function scopeOkNow(root, meta) {
  if (!meta || meta.scopeComplete !== true || !meta.scope || !/^[0-9a-f]{64}$/.test(String(meta.scopeSha256 || ''))) return false;
  if (!/\.html$/.test(String(meta.target || ''))) return false;
  const abs = root.replace(/\/$/, '') + '/' + meta.target;
  let htmlSha = null;
  try { htmlSha = crypto.createHash('sha256').update(fs.readFileSync(abs)).digest('hex'); } catch { return false; }
  const key = htmlSha + '|' + JSON.stringify(normalizeScope(meta.scope));
  if (!okCache.has(key)) {
    let h = null;
    try { h = scopeHash(abs, meta.scope); } catch { h = null; }
    okCache.set(key, h ? (h.scopeComplete ? h.scopeSha256 : null) : null);
  }
  return okCache.get(key) === meta.scopeSha256;
}

/** 対象一致: `targetSha256` が今の対象の hash と一致 **または** 領域一致(scopeOkNow)。 */
export function provTargetOk(root, meta, nowSha) {
  if (!meta) return false;
  if (meta.targetSha256 && meta.targetSha256 === nowSha) return true;
  return scopeOkNow(root, meta);
}
