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
//
// ■ 第282便e(原仮定者の裁定(第72報)AN22・統括の検証項目 R82)—— **停止集合**と**安定 hash の除外契約**
//   ・版 w282e-scope-2: 閉包は `SCOPE_STOP`(純粋な表示関数 —— 保存一覧・スキン・パラメータ行の組み立て・
//     パネルの控除・キャンバスの寸法・描画)で**止める**。止めた関数は (a) 名前で辿らない (b) 書き換える文
//     (mutator)・閉包の let/var へ代入する関数(writer)としても入れない (c) 器の roots に**素の名前**で
//     書かれていても辿らない(roots の素の名前は器の中の同名の局所変数から機械で引いた下限なので)。
//     `$`・`ctx`・`sim` は止めない(物理パラメータの書き換えや保存の再読込に繋がる参照がある)。物理側
//     (validatePreset・applyQLock・背景係数・速度定義・コア・初速生成・`S._core`)は依存に残す。
//   ・**刻印の版で照合する**: 旧版 w281a-scope-1 の刻印は旧版の閉包(停止集合なし)で引き直して照合する
//     (旧版は新版より広い —— 旧版で一致すれば新版でも同じ領域を読んだ)。新しい刻印は新版だけで作る。
//   ・安定 hash(`stableJsonSha`)は**正本ごとに宣言した JSON Pointer**(再生成表の `volatilePaths`)だけを
//     除く(既定は除外なし・方式の版を hash に含める)。欄名で階層を問わず除く旧方式(版なしの刻印)は
//     **旧刻印の照合専用**に `legacyStableJsonSha` として残した(新しい刻印には使わない)。
import fs from 'node:fs';
import crypto from 'node:crypto';
import { loadHtmlHeadless } from './lib-w279b-headless.mjs';
// 第282便e: 安定 hash の除外 Pointer は再生成表の段が宣言する(循環 import —— どちらも最上位では相手を呼ばない)
import { volatilePathsOf } from './lib-w281a-regentable.mjs';

/** 領域 hash の版(形を変えたら上げる。`lint.regenScope` が見る)。第282便e で停止集合を入れて 2 へ。 */
export const SCOPE_VERSION = 'w282e-scope-2';
/** 旧版(第281便a —— 停止集合なし)。この版の刻印は旧版の閉包で照合する(`scopeHash(…, {version})`)。 */
export const SCOPE_VERSION_LEGACY = 'w281a-scope-1';
/** 照合できる版の一覧(これ以外の版の刻印は照合できない = 不一致)。 */
export const SCOPE_VERSIONS = [SCOPE_VERSION_LEGACY, SCOPE_VERSION];

/**
 * **停止集合**(第282便e・AN22 —— 原仮定者の裁定(第72報)・統括の検証項目 R82)。
 * 閉包の roots(`$`・`ctx`・`sim`)から辿ると、閉包の let へ代入する関数(loadPreset・showFirstVisit・
 * resizeCanvas …)を経て UI の関数まで入り、CSS と UI 関数だけの変更でも宣言した全正本が「再生成」になる。
 * ここに挙げるのは**純粋な表示関数**(DOM・キャンバス・localStorage の表示設定だけを書き、sim・プリセット・
 * 物理の let/var を書かない —— `lint.scopeStop` が静的に毎回照合する)。`$`・`ctx`・`sim` のような
 * 入力境界そのものは止めない。物理側(validatePreset・applyQLock・背景係数・速度定義・コア・初速生成)は
 * ここに入れない(入れると `lint.scopeStop` が落ちる)。
 */
export const SCOPE_STOP = [
  // 保存・カスタム一覧とパネルの再計測(第281便e で変えた群)
  'renderSaves', 'renderCustomList', 'panelContentChanged',
  // スキン(第281便e)
  'applySkin', 'setSkin', 'setCanvasSkin',
  // パラメータタブの行の組み立て・ワンタップ対照の行・パネルの控除とキャンバスの寸法
  'buildParamRows', 'updateAbQuickRow', 'syncPanelWideReserve', 'resizeCanvas', 'applyUiScale',
  // 言語の切替(文言の貼り直し)・説明タブ・初回案内
  'applyLang', 'renderHelp', 'showFirstVisit',
  // 描画(キャンバスへの 1 フレーム)
  'render', 'drawSpaceLinesOn', 'drawEmergence', 'drawOrbitObs', 'pmRender',
];

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
export function closureOf(parsed, roots, stop = DATA_REGISTRIES.concat(TEXT_REGISTRIES), opts) {
  // 第282便e: opts.hardStop(停止集合)—— 名前で辿らない・mutator/writer に入れない・素の名前の roots も辿らない。
  //   opts を渡さなければ第281便a と 1 文字も変わらない動き(旧版 w281a-scope-1 の照合に使う)。
  const hard = new Set((opts && opts.hardStop) || []);
  const stoppedHit = new Set();
  const byName = new Map();
  parsed.segments.forEach((s, k) => { for (const nm of s.names) { if (!byName.has(nm)) byName.set(nm, []); byName.get(nm).push(k); } });
  const letNames = new Set();
  parsed.segments.forEach((s) => { if (s.kind === 'decl' && /^\s*(?:let|var)\s/.test(s.codeText)) for (const nm of s.names) letNames.add(nm); });
  const stopSet = new Set(stop);
  for (const nm of hard) stopSet.add(nm);
  const segStopped = (k) => { const nm = parsed.segments[k].names; return nm.length > 0 && nm.every((x) => hard.has(x)); };
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
      for (const id of identsOf(pr.exprCode)) { if (hard.has(id)) stoppedHit.add(id); if (byName.has(id) && !stopSet.has(id)) queue.push(id); }
      continue;
    }
    if (hard.has(r)) { stoppedHit.add(r); if (!byName.has(r)) missing.push(r); continue; }
    if (byName.has(r)) queue.push(r); else missing.push(r);
  }
  const identCache = new Map();
  const idents = (k) => { if (!identCache.has(k)) identCache.set(k, identsOf(parsed.segments[k].codeText)); return identCache.get(k); };
  const addSeg = (k) => {
    if (segIdx.has(k)) return;
    segIdx.add(k);
    for (const id of idents(k)) { if (hard.size && hard.has(id)) stoppedHit.add(id); if (!inNames.has(id) && byName.has(id) && !stopSet.has(id)) queue.push(id); }
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
        if (hard.size && segStopped(k)) { if (re.test(parsed.segments[k].codeText)) for (const x of parsed.segments[k].names) stoppedHit.add(x); continue; }
        if (re.test(parsed.segments[k].codeText)) { writers.add(k); addSeg(k); changed = true; }
      }
    }
  }
  return { functions: [...inNames].sort(), missing, segIdx: [...segIdx].sort((a, b) => a - b),
    mutators: [...mutators].sort((a, b) => a - b), writers: [...writers].sort((a, b) => a - b), hp,
    stopped: [...stoppedHit].sort() };
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

/**
 * 第282便e: **感度の自己試験用の一時 html**(`lint.scopeStop` と `tools/scope-probe.mjs` が使う —— html は書き換えない)。
 * 最上位の関数 `name` の本体の先頭に無害な文 `void 0;` を 1 つ差し込む(本文の hash だけが変わる)。
 * @returns {{html:string, ok:boolean}}
 */
export function touchFunction(htmlText, name, stmt = 'void 0;') {
  const re = new RegExp('^(?:async\\s+)?function\\s+' + name.replace(/\$/g, '\\$') + '\\s*\\(', 'm');
  const m = re.exec(htmlText);
  if (!m) return { html: htmlText, ok: false };
  let i = m.index + m[0].length, dep = 1;
  while (i < htmlText.length && dep > 0) { const c = htmlText[i]; if (c === '(') dep++; else if (c === ')') dep--; i++; }
  const open = htmlText.indexOf('{', i);
  if (open < 0) return { html: htmlText, ok: false };
  return { html: htmlText.slice(0, open + 1) + stmt + htmlText.slice(open + 1), ok: true };
}

/** 第281便e で変えた表示関数(停止集合の部分集合 —— (b) の一時 html はこれらと CSS だけを変える)。 */
export const PROBE_UI_281E = ['applySkin', 'setSkin', 'setCanvasSkin', 'syncPanelWideReserve', 'buildParamRows',
  'renderSaves', 'panelContentChanged', 'renderCustomList', 'resizeCanvas'];

/**
 * 3 種の一時 html を作る(第282便e の (b)(c)(d)):
 *   ui   … CSS の `--bg` の値 + PROBE_UI_281E の本体に 1 文 + `#abQuickRow` の行を `#pmRow` の上へ戻す(マークアップ)
 *   vp   … `validatePreset` の本体に 1 文
 *   mass … ❄️ plutoCharonReal の最初の `m:` の数値の最下位桁を 1 つ変える(第281便a の ⑥ と同じ)
 * @returns {{ui:{html,ok,touched}, vp:{html,ok}, mass:{html,ok,from,to}}}
 */
export function probeHtmls(htmlText) {
  let ui = htmlText.replace(/(<style>[\s\S]*?)(--bg:\s*)([^;]+);/, (m0, a, b, c) => a + b + c + ' ;');
  const touched = [];
  for (const nm of PROBE_UI_281E) { const r = touchFunction(ui, nm); if (r.ok) { ui = r.html; touched.push(nm); } }
  const row = '<div class="rowBtns" id="abQuickRow" style="display:none"></div>';
  if (ui.indexOf(row) >= 0) ui = ui.replace(row, '').replace('<div class="rowBtns" id="pmRow"', row + '\n      <div class="rowBtns" id="pmRow"');
  const vp = touchFunction(htmlText, 'validatePreset');
  const iP = htmlText.indexOf('id:"plutoCharonReal"');
  const numRe = /(\bm:\s*)(\d+\.\d*[1-9])/g; numRe.lastIndex = Math.max(0, iP);
  const nm = iP >= 0 ? numRe.exec(htmlText) : null;
  let mass = { html: htmlText, ok: false, from: null, to: null };
  if (nm) {
    const v = nm[2], last = Number(v[v.length - 1]);
    const v2 = v.slice(0, -1) + String(last === 9 ? 8 : last + 1);
    mass = { html: htmlText.slice(0, nm.index) + nm[1] + v2 + htmlText.slice(nm.index + nm[0].length), ok: true, from: v, to: v2 };
  }
  return { ui: { html: ui, ok: ui !== htmlText && touched.length === PROBE_UI_281E.length, touched }, vp, mass };
}

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
export function scopeHash(htmlPath, decl, opts) {
  const sc = normalizeScope(decl);
  // 第282便e: 版(opts.version か宣言の version。無ければ現行版)。旧版は第281便a と同じ本文・同じ閉包で引く。
  const version = (opts && opts.version) || (decl && decl.version) || SCOPE_VERSION;
  const legacy = version === SCOPE_VERSION_LEGACY;
  const why = [];
  if (SCOPE_VERSIONS.indexOf(version) < 0) why.push('照合できない版: ' + version);
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
  const cl = legacy ? closureOf(X.parsed, sc.roots)
    : closureOf(X.parsed, sc.roots, undefined, { hardStop: SCOPE_STOP });
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
  const body = legacy
    ? canonJson({ v: SCOPE_VERSION_LEGACY, presets, closure: fnTexts, hp: hpTexts, core, consts,
      proseKeys: PROSE_KEYS, registries: DATA_REGISTRIES, textRegistries: TEXT_REGISTRIES })
    : canonJson({ v: version, presets, closure: fnTexts, hp: hpTexts, core, consts,
      proseKeys: PROSE_KEYS, registries: DATA_REGISTRIES, textRegistries: TEXT_REGISTRIES, scopeStop: SCOPE_STOP });
  const complete = why.length === 0;
  const scopeSha256 = sha256(body);
  const closureBytes = segs.reduce((a, s) => a + (s.end - s.start), 0);
  // 第282便e: 内訳の hash(再生成計画の「どの入力・式・受理規則で無効化されたか」の列に使う —— 刻印には載せない)
  const parts = {
    presetsRaw: Object.fromEntries(presets.map((p) => [p.id, sha256(canonJson(p.raw === undefined ? null : p.raw))])),
    presetsAccepted: Object.fromEntries(presets.map((p) => [p.id, sha256(canonJson(p.accepted === undefined ? null : p.accepted))])),
    closure: Object.fromEntries(fnTexts.map(([k, t], i) => [k === '(stmt)' ? '(stmt)#' + sha256(t).slice(0, 8) : k, sha256(t)])),
    hp: Object.fromEntries(hpTexts.map(([k, t]) => [k, sha256(t)])),
    core: core === null ? null : sha256(core),
    consts: Object.fromEntries(consts.map(([k, v]) => [k, sha256(String(v))])),
  };
  return {
    scope: Object.assign({ version }, sc, { complete }),
    scopeSha256,
    scopeComplete: complete,
    parts,
    detail: { why, version, stopped: cl.stopped || [], nPresets: presets.length, nNames: cl.functions.length, nSegments: segs.length,
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

export default { SCOPE_VERSION, SCOPE_VERSION_LEGACY, SCOPE_VERSIONS, SCOPE_STOP, PROSE_KEYS, DATA_REGISTRIES, TEXT_REGISTRIES,
  scanJs, normText, parseTopLevel, hpProps, closureOf, countDynamicRefs, canonJson, normalizeScope, scopeHash, scopeStamp };

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
  // 第282便e: 下限は**現行版の閉包**(停止集合で止めた閉包)で覆う —— 器が表示関数の先にしか無い名前を
  //   読んでいたら、ここで「root … が無い」になり宣言を広げさせる(素の名前の roots は宣言そのものなので覆う扱い)
  const cl = closureOf(X.parsed, sc.roots, undefined, { hardStop: SCOPE_STOP });
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
  // 第282便e: 刻印の道具(本 lib と再生成表)は html を**hash するだけ**で結果を作らない —— 下限を引く対象から外す
  //   (本 lib の停止集合の文字列 'renderSaves' 等を「器が名前で読む」と誤って数えないため)
  const walk = (f) => {
    let s = '';
    try { s = fs.readFileSync(abs(f), 'utf8'); } catch { return; }
    for (const m of s.matchAll(/from '\.\/((?:lib|exp)-[^']+)'/g)) {
      const n = 'tests/' + m[1];
      if (SCOPE_TOOLING.includes(n)) continue;
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

/** 刻印の道具(下限を引く対象から外す —— 第282便e)。 */
export const SCOPE_TOOLING = ['tests/lib-w281a-scope.mjs', 'tests/lib-w281a-regentable.mjs'];

/** 器の本文から `const REGEN_SCOPE = {…};`(1 行の JSON)を読む。無ければ null。 */
export function readDeclaredScope(harnessText) {
  const m = String(harnessText).match(/^const REGEN_SCOPE = (\{.*\});\s*$/m);
  if (!m) return null;
  try { return JSON.parse(m[1]); } catch { return null; }
}

/**
 * 第282便e: **安定 hash の除外契約**(原仮定者の裁定(第72報)・統括の検証項目 R82)。
 * 常時群(calaudit 系)は毎回走り直すので、ファイル全体の sha256 は毎回変わる。後段の器がその正本を入力にして
 * いるとき、「中身(実行時刻・所要以外)が同じ」なら後段を走らせ直さなくてよい —— その判定に使う。
 * **除くのは正本ごとに宣言した JSON Pointer だけ**(再生成表の段の `volatilePaths` —— `volatilePathsOf(file)`)。
 * 既定は**除外なし**。Pointer は RFC 6901(`~0`=`~`・`~1`=`/`)に、1 段を任意の鍵・添字に合わせる `*` を足した形
 * (内蔵の正本に `*` という名の鍵は無い —— `lint.stableHashPaths` が照合)。方式の版(`STABLE_VERSION`)と
 * 除いた Pointer の並びを hash の本文に入れる(版や宣言が変われば hash も変わる)。
 * 旧方式(第281便a —— 欄名 `LEGACY_VOLATILE_KEYS` を階層を問わず除く)は、観測の継続時間や元期の欄(`durationMs`・
 * `when`)まで落としうるので**新しい刻印には使わない**。版を持たない既存の刻印を照合するためだけに
 * `legacyStableJsonSha` として残す(統合時に刻印を付け替えたら照合でも使わなくなる)。
 */
export const STABLE_VERSION = 'w282e-stable-1';

/** 宣言してよい Pointer の最後の鍵(実行時刻・壁時計の所要・速度・ファイル時刻 —— 観測量の欄名は入れない)。 */
export const STABLE_RUNTIME_KEYS = ['generatedAt', 'when', 'carriedOverFrom', 'mtime',   // 時刻(ISO 日時)
  'wallSec', 'rateStepsPerSec', 'spentSec', 'elapsedS'];                                         // 壁時計の所要・速度(有限の数)
/** 時刻の欄(値は ISO 日時)。残りの STABLE_RUNTIME_KEYS は有限の数。 */
export const STABLE_TIME_KEYS = ['generatedAt', 'when', 'carriedOverFrom', 'mtime'];

/** 旧方式の欄名(第281便a の VOLATILE_KEYS —— **旧刻印の照合専用**)。 */
export const LEGACY_VOLATILE_KEYS = ['generatedAt', 'when', 'wallSec', 'wallClock', 'wallS', 'spentSec',
  'rateStepsPerSec', 'mtime', 'measuredAt', 'elapsedSec', 'elapsedS', 'elapsedMs', 'wallMs', 'wallDurationMs',
  'durationMs', 'runMs', 'spentSecTotal', 'measurementElapsedSecTotal', 'startedAt', 'htmlLoadMs',
  'baseWallSec', 'nowWallSec', 'baseRate', 'nowRate', 'maxWallSec'];

/** RFC 6901 の Pointer を鍵の並びへ(`*` は 1 段の任意)。不正なら null。 */
export function parsePointer(ptr) {
  if (typeof ptr !== 'string' || !ptr.startsWith('/')) return null;
  return ptr.slice(1).split('/').map((t) => t.replace(/~1/g, '/').replace(/~0/g, '~'));
}

/** 値 J の中で Pointer に合う位置の数(`*` は配列の添字・オブジェクトの鍵のすべて)。 */
export function pointerMatches(J, ptr) {
  const toks = parsePointer(ptr);
  if (!toks) return 0;
  let n = 0;
  const walk = (x, i) => {
    if (i === toks.length) { n++; return; }
    if (!x || typeof x !== 'object') return;
    const t = toks[i];
    const keys = t === '*' ? Object.keys(x) : (Object.prototype.hasOwnProperty.call(x, t) ? [t] : []);
    for (const k of keys) walk(x[k], i + 1);
  };
  walk(J, 0);
  return n;
}

/** Pointer に合う位置を取り除いた写し(元は変えない)。 */
export function dropPointers(J, ptrs) {
  const out = JSON.parse(JSON.stringify(J === undefined ? null : J));
  for (const ptr of (ptrs || [])) {
    const toks = parsePointer(ptr);
    if (!toks || !toks.length) continue;
    const walk = (x, i) => {
      if (!x || typeof x !== 'object') return;
      const t = toks[i];
      const keys = t === '*' ? Object.keys(x) : (Object.prototype.hasOwnProperty.call(x, t) ? [t] : []);
      if (i === toks.length - 1) {
        for (const k of keys) { if (Array.isArray(x)) x[k] = null; else delete x[k]; }   // 配列の要素は位置を保つため null
        return;
      }
      for (const k of keys) walk(x[k], i + 1);
    };
    walk(out, 0);
  }
  return out;
}

/** 値の安定 hash(宣言した Pointer だけを除く・版と Pointer の並びを本文に入れる)。 */
export function stableValueSha(J, volatilePaths) {
  const ptrs = [...new Set(volatilePaths || [])].sort();
  return sha256(canonJson({ v: STABLE_VERSION, volatilePaths: ptrs, data: dropPointers(J, ptrs) }));
}

/** ファイルの安定 hash(`volatilePaths` を省くと再生成表の宣言 —— 宣言が無ければ除外なし)。読めなければ null。 */
export function stableJsonSha(abs, volatilePaths) {
  let J;
  try { J = JSON.parse(fs.readFileSync(abs, 'utf8')); } catch { return null; }
  return stableValueSha(J, volatilePaths === undefined ? volatilePathsOfAbs(abs) : volatilePaths);
}

/** 旧方式(第281便a)の安定 hash —— **版を持たない既存の刻印の照合専用**。 */
export function legacyStableValueSha(J) {
  const drop = (x) => {
    if (Array.isArray(x)) return x.map(drop);
    if (x && typeof x === 'object') {
      const o = {};
      for (const k of Object.keys(x)) if (LEGACY_VOLATILE_KEYS.indexOf(k) < 0) o[k] = drop(x[k]);
      return o;
    }
    return x;
  };
  return sha256(canonJson(drop(J)));
}
export function legacyStableJsonSha(abs) {
  let J;
  try { J = JSON.parse(fs.readFileSync(abs, 'utf8')); } catch { return null; }
  return legacyStableValueSha(J);
}

/** 絶対パス → 再生成表の宣言(リポジトリ root からの相対パス `tests/out/…` で引く)。 */
function volatilePathsOfAbs(abs) {
  const m = String(abs).replace(/\\/g, '/').match(/(?:^|\/)(tests\/out\/[^/]+\.json)$/);
  return m ? volatilePathsOf(m[1]) : [];
}

/**
 * 刻印の 1 行(`inputsStable[k]`)が今のファイルと一致するか —— **刻印の版で**照合する。
 *   版 STABLE_VERSION … 刻印に書いた `volatilePaths` で引き直す
 *   版なし(第281便a)… 旧方式で引き直す
 * @returns {boolean}
 */
export function stableMatches(root, row) {
  if (!row || !row.file || !row.stableSha256) return false;
  const abs = root.replace(/\/$/, '') + '/' + row.file;
  if (row.stableVersion === STABLE_VERSION) return stableJsonSha(abs, row.volatilePaths || []) === row.stableSha256;
  if (row.stableVersion === undefined) return legacyStableJsonSha(abs) === row.stableSha256;
  return false;
}

/**
 * meta.inputs[] のうち JSON の入力に**安定 hash** を添える(`inputsStable`)。
 * `lint.provenanceMeta` ③ は「sha256 一致 **または** 安定 hash 一致(刻印の版で照合)」で通す。
 * 第282便e: 各行に版と除いた Pointer を刻む(旧刻印の `volatileKeys` 欄は出さない)。
 * @param {string} root
 * @param {Array<{file:string}>|string[]} inputs
 */
export function stableInputs(root, inputs) {
  const rows = [];
  for (const s of (inputs || [])) {
    const file = typeof s === 'string' ? s : (s && s.file);
    if (!file || !/\.json$/.test(file)) continue;
    const vp = volatilePathsOf(file);
    const h = stableJsonSha(root.replace(/\/$/, '') + '/' + file, vp);
    if (h) rows.push({ file, stableSha256: h, stableVersion: STABLE_VERSION, volatilePaths: vp });
  }
  return { inputsStable: rows, stableHashVersion: STABLE_VERSION };
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
  // 第282便e: 刻印の版で引き直す(旧版の刻印は旧版の閉包 —— 鍵にも版を入れる)
  const key = htmlSha + '|' + String(meta.scope.version || SCOPE_VERSION_LEGACY) + '|' + JSON.stringify(normalizeScope(meta.scope));
  if (!okCache.has(key)) {
    let h = null;
    try { h = scopeHash(abs, meta.scope, { version: meta.scope.version || SCOPE_VERSION_LEGACY }); } catch { h = null; }
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

/**
 * 第282便e: **宣言した器の現行の正本**(再生成表の段の outs —— 履歴を除く)と宣言の一覧。
 * @returns {Array<{harness:string, out:string, decl:object, meta:object|null}>}
 */
export async function declaredOuts(root) {
  const RT = await import('./lib-w281a-regentable.mjs');
  const HIST = new Set(RT.historyOuts());
  const abs = (f) => root.replace(/\/$/, '') + '/' + f;
  const rows = [];
  for (const f of fs.readdirSync(abs('tests')).filter((x) => /^exp-.*\.mjs$/.test(x)).sort()) {
    const rel = 'tests/' + f;
    const text = fs.readFileSync(abs(rel), 'utf8');
    if (text.indexOf('const REGEN_SCOPE = ') < 0) continue;
    const decl = readDeclaredScope(text);
    const outs = [...new Set(RT.REGEN_STEPS.filter((z) => z.cmd.indexOf(rel) >= 0 && z.role !== 'history').flatMap((z) => z.outs)
      .filter((o) => !HIST.has(o)))];
    for (const out of outs) {
      let meta = null;
      try { meta = JSON.parse(fs.readFileSync(abs(out), 'utf8')).meta || null; } catch { meta = null; }
      rows.push({ harness: rel, out, decl, meta });
    }
  }
  return rows;
}

/**
 * 第282便e: **停止集合の感度の実測**((a)〜(d) —— `tools/scope-probe.mjs` と `lint.scopeStop` が使う)。
 * 一時 html は os.tmpdir() に書いて消す。html・正本は書き換えない。
 * @param {{root:string, html?:string, baseHtml?:string, rows?:Array}} o
 */
export async function scopeStopProbe(o) {
  const root = o.root.replace(/\/$/, '');
  const HTML = o.html || root + '/beta/index.html';
  const rows = o.rows || await declaredOuts(root);
  const os = await import('node:os');
  const path = await import('node:path');
  const htmlText = fs.readFileSync(HTML, 'utf8');
  const P = probeHtmls(htmlText);
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'w282e-'));
  const res = { version: SCOPE_VERSION, legacyVersion: SCOPE_VERSION_LEGACY, scopeStop: SCOPE_STOP.slice(),
    rows: rows.map((r) => ({ harness: r.harness, out: r.out, presets: r.decl.presets === 'all' ? 'all' : r.decl.presets.length })),
    names: {}, share: {}, a: {}, b: { touched: P.ui.touched }, c: {}, d: { from: P.mass.from, to: P.mass.to } };
  const hN = (file, d) => { const h = scopeHash(file, d, { version: SCOPE_VERSION }); return h.scopeComplete ? h.scopeSha256 : 'incomplete:' + h.detail.why.join(';'); };
  const hL = (file, d) => { const h = scopeHash(file, d, { version: SCOPE_VERSION_LEGACY }); return h.scopeComplete ? h.scopeSha256 : 'incomplete:' + h.detail.why.join(';'); };
  try {
    // 今の html
    const nowN = rows.map((r) => hN(HTML, r.decl));
    const nowL = rows.map((r) => hL(HTML, r.decl));
    const s0 = scopeHash(HTML, rows[0].decl, { version: SCOPE_VERSION }), s1 = scopeHash(HTML, rows[0].decl, { version: SCOPE_VERSION_LEGACY });
    res.names = { now: s0.detail.nNames, legacy: s1.detail.nNames, stopped: s0.detail.stopped };
    res.share = { now: s0.detail.closureShare, legacy: s1.detail.closureShare };
    res.a.legacySameNow = rows.filter((r, i) => r.meta && r.meta.scope && r.meta.scopeSha256 === hL(HTML, r.meta.scope)).length;
    // (a) 基点
    if (o.baseHtml) {
      res.a.legacySame = rows.filter((r) => r.meta && r.meta.scopeSha256 === hL(o.baseHtml, r.meta.scope || r.decl)).length;
      res.a.nowDiffers = rows.filter((r) => !r.meta || r.meta.scopeSha256 !== hN(o.baseHtml, r.decl)).length;
    }
    // (b) CSS + 表示関数
    const fU = path.join(tmp, 'ui.html'); fs.writeFileSync(fU, P.ui.html);
    const uiN = rows.map((r) => hN(fU, r.decl)), uiL = rows.map((r) => hL(fU, r.decl));
    res.b.ok = P.ui.ok;
    res.b.nowChanged = uiN.filter((h, i) => h !== nowN[i]).length;
    res.b.legacyChanged = uiL.filter((h, i) => h !== nowL[i]).length;
    res.b.nowChangedOuts = rows.filter((r, i) => uiN[i] !== nowN[i]).map((r) => r.out);
    // (c) validatePreset
    const fV = path.join(tmp, 'vp.html'); fs.writeFileSync(fV, P.vp.html);
    const vpN = rows.map((r) => hN(fV, r.decl));
    res.c.ok = P.vp.ok;
    res.c.nowChanged = vpN.filter((h, i) => h !== nowN[i]).length;
    // (d) ❄️ の質量
    const fM = path.join(tmp, 'mass.html'); fs.writeFileSync(fM, P.mass.html);
    const mN = rows.map((r) => hN(fM, r.decl));
    const expect = rows.map((r) => r.decl.presets === 'all' || (Array.isArray(r.decl.presets) && r.decl.presets.includes('plutoCharonReal')));
    res.d.ok = P.mass.ok;
    res.d.nowChanged = mN.filter((h, i) => h !== nowN[i]).length;
    res.d.expected = expect.filter(Boolean).length;
    res.d.match = mN.every((h, i) => (h !== nowN[i]) === expect[i]);
    res.d.changedOuts = rows.filter((r, i) => mN[i] !== nowN[i]).map((r) => r.out);
    res.incomplete = nowN.filter((h) => String(h).startsWith('incomplete')).length;
  } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
  return res;
}

/**
 * 第282便e: **表示の境界**(停止集合の関数が本体で直接書いてよい閉包の名前 —— キャンバスの要素・文脈・寸法、
 * 描画用の平滑値・履歴、行の表示同期の表、相図のタップ領域、QA 用の描画サマリ)。
 * `lint.scopeStop` ② が「停止関数の直接の書き込み ⊆ この一覧」と「宣言した器がこれらを HP・文字列で読まない」を照合する。
 */
export const SCOPE_STOP_BOUNDARY = ['cv', 'ctx', 'dpr', 'cw', 'ch', 'tempP90EMA', 'emTick', 'emHist', '_ooLast',
  'pmCells', 'paramRowSync', '_monCls'];

/** 第282便e: 物理側(停止集合に入れてはいけない —— 現行版の閉包に残ることを `lint.scopeStop` ③ が照合)。 */
export const PHYSICS_KEEP = ['validatePreset', 'applyQLock', 'qLockCalc', 'makeSim', 'loadPreset', 'geo3InitVelocity',
  'meshVelocityPrepare', 'validateMeshVelocity', 'dfmMeshVelocityStep', 'dfmCoreFieldStep', 'coreFieldInitState',
  'bgSourcesBodyCheck'];

/**
 * 第282便e: 最上位の関数 `name` の本体が**直接**書く最上位の名前(入れ子の関数・アロー関数 = 操作ハンドラの中の
 * 書き込みは `nested` に分ける)。局所の宣言・引数と同名のものは除く(静的な近似 —— 過大に拾う側)。
 * @returns {{found:boolean, direct:string[], nested:string[]}} 要素は「名前+プロパティの道」(例 `ctx.fillStyle`)
 */
export function directWrites(parsed, name, names) {
  const seg = parsed.segments.find((s) => s.kind === 'function' && s.names.includes(name));
  if (!seg) return { found: false, direct: [], nested: [] };
  const t = seg.codeText;
  const inSet = names instanceof Set ? names : new Set(names || []);
  const mask = new Uint8Array(t.length);
  const first = t.indexOf('{');
  const markBlock = (open) => { let dep = 0; for (let j = open; j < t.length; j++) { if (t[j] === '{') dep++; else if (t[j] === '}') { dep--; if (dep === 0) { mask.fill(1, open, j + 1); return; } } } };
  const markExpr = (st) => { let dep = 0; for (let j = st; j < t.length; j++) { const c = t[j];
    if ('([{'.includes(c)) dep++; else if (')]}'.includes(c)) { if (dep === 0) { mask.fill(1, st, j); return; } dep--; }
    else if ((c === ',' || c === ';') && dep === 0) { mask.fill(1, st, j); return; } } };
  for (const m of t.matchAll(/function\s*[\w$]*\s*\([^)]*\)\s*\{/g)) { if (m.index <= first) continue; markBlock(m.index + m[0].length - 1); }
  for (const m of t.matchAll(/=>\s*/g)) { const j = m.index + m[0].length; if (t[j] === '{') markBlock(j); else markExpr(j); }
  const locals = new Set();
  for (const m of t.matchAll(/(?:const|let|var)\s+([A-Za-z_$][\w$]*)/g)) locals.add(m[1]);
  for (const m of t.matchAll(/(?:const|let|var)\s*[[{]([^\]}=]*)[\]}]/g)) for (const x of m[1].split(',')) { const q = x.split(':').pop().trim(); if (q) locals.add(q); }
  for (const m of t.matchAll(/function\s*[A-Za-z_$]*\s*\(([^)]*)\)/g)) for (const x of m[1].split(',')) locals.add(x.split('=')[0].trim());
  for (const m of t.matchAll(/\(([^()]*)\)\s*=>/g)) for (const x of m[1].split(',')) locals.add(x.split('=')[0].trim());
  for (const m of t.matchAll(/([A-Za-z_$][\w$]*)\s*=>/g)) locals.add(m[1]);
  for (const m of t.matchAll(/catch\s*\(\s*([A-Za-z_$][\w$]*)/g)) locals.add(m[1]);
  const direct = new Set(), nested = new Set();
  const re = /(?<![\w$.])([A-Za-z_$][\w$]*)((?:\s*(?:\.[A-Za-z_$][\w$]*|\[[^\]]*\]))*)\s*(=(?![=>])|\+=|-=|\*=|\/=|\|\|=|&&=|\?\?=|\+\+|--)|(?:\+\+|--)([A-Za-z_$][\w$]*)|(?<![\w$.])([A-Za-z_$][\w$]*)((?:\.[A-Za-z_$][\w$]*)*)\.(push|splice|pop|shift|unshift|set|delete|clear|add)\s*\(/g;
  let m;
  while ((m = re.exec(t))) {
    const nm = m[1] || m[4] || m[5];
    if (!nm || locals.has(nm) || !inSet.has(nm)) continue;
    const pth = m[1] ? m[2].replace(/\s+/g, '') : (m[5] ? m[6] + '.' + m[7] + '()' : '');
    (mask[m.index] ? nested : direct).add(nm + pth);
  }
  return { found: true, direct: [...direct].sort(), nested: [...nested].sort() };
}

/**
 * 第282便e: 器(と import した lib)が停止集合・表示の境界の名前を**実際に読む**か —— `HP.<名前>` の式の識別子と、
 * 引用符で囲んだ名前(`const REGEN_SCOPE = …` の行を除く)。素の識別子は器の局所変数との同名なので数えない。
 * @returns {string[]} 「ファイル:読み方」の並び(空なら読まない)
 */
export function stopReadsOf(htmlPath, codeFiles) {
  const X = loadCtx(htmlPath);
  const hpx = hpProps(X.parsed);
  const watch = new Set(SCOPE_STOP.concat(SCOPE_STOP_BOUNDARY));
  const out = [];
  for (const cf of codeFiles) {
    const sc = scanJs(cf.text);
    for (const m of sc.code.matchAll(/\bHP\s*\.\s*([A-Za-z_$][\w$]*)/g)) {
      const pr = hpx.props.get(m[1]);
      if (!pr) continue;
      for (const id of identsOf(pr.exprCode)) if (watch.has(id)) out.push(cf.file + ':HP.' + m[1] + '→' + id);
    }
    const text = cf.text.split('\n').filter((l) => !/^const REGEN_SCOPE = /.test(l)).join('\n');
    for (const m of text.matchAll(/(['"`])([A-Za-z_$][\w$]*)\1/g)) if (watch.has(m[2])) out.push(cf.file + ":'" + m[2] + "'");
  }
  return [...new Set(out)];
}
