// 第322便d(統括の検証項目 R273): QA の部分実行器 `tests/exp-w258c-qapart.mjs` の**切り出し**の純関数(本文は第258便c・第279便b・第296便・第319便の
//   qapart の実装を 1 字も変えずに移した —— 器と `tools/qa-keys.mjs` が**同じ関数**で範囲を取る)。
//
//   切り出し: 「`add('<id>'` を含む**最初の行**から、列 0 の `{` だけの行まで遡り(その上の列 0 のコメントの行を含む)、次の列 0 の `}` だけの行まで」。
//   W5b で関数宣言へ持ち上げたブロック(`await w5bRun('<key>', <ガード>); async function W5B_<key>(…) {`)は最上位の文の切り出し
//   (`tests/lib-w279b-qaorder.mjs` splitTopLevel)で範囲を取り、見出し行を `if (<ガード>) {` に戻す。
//   前文に写す世代定数: 最上位の 1 行の `const W\d{3}[A-Z]_… = …`(切り出した範囲に同じ行があれば外す)と、第284〜287便の複数行の範囲(W284_PSR_F1 … W284_CORE)。
//
// 第323便a(統括の検証項目 R275 —— 原仮定者の指示(2026-11-01)「今後は、すぐに確認可能な規約を先に判定する」): 部分 QA で走らなかった鍵の直し。
//   ① 範囲の取り直し: 上の検索の範囲が add の行を含まない鍵(列 0 の `if (…) {`・`for (…) {` の中・最上位の文 —— 第322便d の 45 鍵)は、
//      **その add の行を含む列 0 の最上位の文**(splitTopLevel の 1 単位 —— 列 0 のブロックは入れ子にならないので、これが最も内側の列 0 のブロック)を切り出す
//      (その上の列 0 のコメントの行を含む)。上の検索の範囲が add の行を含む鍵は**従来の範囲のまま**(生成する本文は変わらない)。
//   ② 上流の宣言の閉包: 範囲が読む最上位の名前のうち前文に無いもの(範囲より前の const・関数宣言 —— 第322便d の 11 鍵の getBrowser・hasE6Acc・hasSat240・
//      hasEchoFlipAt と、①で切り出した if の見出しの旗)を、**その宣言の文をそのまま**前文へ写す(写した宣言が読む名前も同じ規則で閉包をとる)。
//      写さない(写せない)宣言: let/var(フル QA の途中で書き換わる)・W5b の関数・add(…) を呼ぶ宣言・w5cGetUnit / w5bRun(W5c/W5b の器)を読む宣言。
//      写せない名前を読む鍵は `upstreamOf` の unsafe に名指す(qa-keys が外す・qapart は走らせる前に印字する)。
//   ③ 走った鍵の分類(`classifyRequested`): 要求した鍵ごとに PASS / FAIL / SKIP / 未実行(NOTRUN)。add の行が無い鍵は、
//      走行中に出た `SKIP …`・`RETIRED …` の行が鍵を名指せば SKIP(PASS に数えない)、名指さなければ未実行(FAIL として数える)。
//      名指しの型(`skipCovers`): 行の語(英数字と `_ $ . -` の続き)が鍵と同じ・または `<接頭>*`(`geo2.*`・`ui.54d-*`)/`<接頭>.`(`ice.`)の語が鍵の接頭(qa.mjs の SKIP の印字の数え上げで決めた ——
//      PHYSICS〔第323便a〕)。
//
// ■ 言わないこと
//   「切り出せた鍵は qapart で走る」(切り出しは行の範囲だけ —— 範囲が上流の局所の名前〔w5cGetUnit など〕を読めば ReferenceError になる。
//   `tools/qa-keys.mjs` がその鍵を外す)。「部分 QA の通過数はフルの被覆」(部分 QA は選んだ範囲だけ —— 上流のページの状態はフル QA の順と違いうる)。

export const QAPART_LIB_VERSION = 'w323a-qapart-2';

// 第323便a: 前文に写さない宣言の印(コードの位置で探す —— コメント・文字列の中は数えない)
const UNSAFE_CALLS = [['w5cGetUnit', 'W5c のワーカープール'], ['w5bRun', 'W5b の器'], ['add', 'add(…) を呼ぶ(結果の行を作る)']];
const IDENT_RE = /(?<![\w$.])[A-Za-z_$][\w$]*(?![\w$])/g;
const escRe = (s) => s.replace(/[$]/g, '\\$');
/** 範囲の中の局所の宣言・分割代入・引数(tools/qa-keys.mjs の第322便d の判定と同じ式) */
const declaresLocally = (code, nm) => new RegExp('(?:const|let|var|function\\*?|class)\\s+' + escRe(nm) + '(?![\\w$])|[{,]\\s*' + escRe(nm) + '\\s*[,}=]|\\(\\s*' + escRe(nm) + '\\s*[,)=]').test(code);

/**
 * 切り出しの器を作る。
 * @param {string} qaSrc tests/qa.mjs の本文
 * @param {object} QO tests/lib-w279b-qaorder.mjs の import(splitTopLevel・w5bHeadKey・stripLiterals)
 * @returns {{lines:string[], headRewrite:Map<number,string>, spanOf:(id:string)=>[number,number], mergeSpans:(spans:Array)=>Array, bodyOf:(merged:Array)=>string,
 *   constsOf:(merged:Array)=>string, consts284Of:(merged:Array)=>string, spanKindOf:(id:string)=>string, upstreamOf:(merged:Array)=>object, upstreamTextOf:(up:object)=>string,
 *   guardedBodyOf:(merged:Array)=>string, units:Array}}
 */
export function qaSpanner(qaSrc, QO) {
  const lines = qaSrc.split('\n');
  const units = QO.splitTopLevel(qaSrc);
  const W5B_UNITS = units.filter((u) => QO.w5bHeadKey(lines[u.l0 - 1]));
  const headRewrite = new Map();
  const spanKind = new Map();   // 第323便a: id → 'block'(従来の検索)・'w5b'・'unit'(①の取り直し)
  function spanOf(id) {
    const i = lines.findIndex((l) => l.includes("add('" + id + "'"));
    if (i < 0) throw new Error('QA ブロックが見つからない: ' + id);
    const wu = W5B_UNITS.find((u) => u.l0 - 1 <= i && i <= u.l1 - 1);
    if (wu) {
      const m = /^await w5bRun\('[\w$]+', ([^;]*)\); async function /.exec(lines[wu.l0 - 1]);
      headRewrite.set(wu.l0 - 1, `if (${m[1]}) {`);
      spanKind.set(id, 'w5b');
      return [wu.l0 - 1, wu.l1];
    }
    let old = null, err = null;
    try {
      let a = i;
      while (a >= 0 && lines[a].trimEnd() !== '{') a--;
      if (a < 0) throw new Error('列 0 の { が見つからない: ' + id);
      let c = a - 1;
      while (c >= 0 && lines[c].startsWith('//')) c--;
      let b = a + 1;
      while (b < lines.length && lines[b].trimEnd() !== '}') b++;
      if (b >= lines.length) throw new Error('対応する } が見つからない: ' + id);
      old = [c + 1, b + 1];
    } catch (e) { err = e; }
    if (old && old[0] <= i && i < old[1]) { spanKind.set(id, 'block'); return old; }
    // 第323便a ①: 従来の範囲が add の行を含まない(または取れない)鍵 —— add の行を含む列 0 の最上位の文
    const u = units.find((z) => z.l0 - 1 <= i && i <= z.l1 - 1);
    if (!u) { if (err) throw err; spanKind.set(id, 'block'); return old; }
    let c = u.l0 - 2;
    while (c >= 0 && lines[c].startsWith('//')) c--;
    spanKind.set(id, 'unit');
    return [c + 1, u.l1];
  }
  function mergeSpans(spans0) {
    const spans = spans0.slice().sort((p, q) => p[0] - q[0]);
    const merged = [];
    for (const [s0, e0] of spans) {
      if (merged.length && s0 <= merged[merged.length - 1][1]) {
        merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], e0);
      } else merged.push([s0, e0]);
    }
    return merged;
  }
  const textOfSpan = (s0, e0) => lines.slice(s0, e0).map((l, k) => headRewrite.get(s0 + k) ?? l).join('\n');
  const bodyOf = (merged) => merged.map(([s0, e0]) => textOfSpan(s0, e0)).join('\n');
  // 第296便(統合): 最上位の 1 行の世代定数(切り出した範囲に同じ宣言があれば二重になるので外す)
  const constsOf = (merged) => lines.filter((l) => /^const W\d{3}[A-Z]_[A-Z0-9_]+ = /.test(l) && !merged.some(([s0, e0]) => lines.slice(s0, e0).includes(l))).join('\n');
  // 第319便(統括の統合 —— 枝 d の直し): 第284〜287便の複数行の世代定数(W284_PSR_F1 … W284_CORE)
  const i284a = lines.findIndex((l) => l.startsWith('const W284_PSR_F1 = ')), i284b = lines.findIndex((l) => l.startsWith('const W284_CORE = '));
  const consts284Of = (merged) => {
    return (i284a >= 0 && i284b >= i284a && !merged.some(([s0, e0]) => s0 <= i284a && i284a < e0)) ? lines.slice(i284a, i284b + 1).join('\n') : '';
  };

  // ---- 第323便a ②: 上流の宣言の閉包 ----
  // 前文が用意する名前(qapart の前文・1 行の世代定数・第284〜287便の複数行の世代定数)
  const provided = new Set(QAPART_PRELUDE_NAMES);
  for (const l of lines) { const mc = /^const (W\d{3}[A-Z]_[A-Z0-9_]+) = /.exec(l); if (mc) provided.add(mc[1]); }
  if (i284a >= 0 && i284b >= i284a) for (const l of lines.slice(i284a, i284b + 1)) { const mc = /^const ([A-Za-z_$][\w$]*) = /.exec(l); if (mc) provided.add(mc[1]); }
  const topDecl = new Map();   // name -> unit(最初の宣言)
  for (const u of units) for (const nm of u.names) if (!topDecl.has(nm)) topDecl.set(nm, u);
  const isW5b = (u) => /^await w5bRun\(/.test(u.head);
  const hoisted = (u) => u.kind === 'fn' || isW5b(u);
  const codeOf = (text) => QO.stripLiterals(text);
  /**
   * コードが読む上流の最上位の名前(前文に無い・範囲 [s0, e0) の外で範囲より前〔関数宣言は位置を問わない〕に宣言)。
   *   局所の同名(第322便d の qa-keys の型 `declaresLocally`)は**写す側では外さない** —— その型は `if (hasX) {` の `(hasX)` を引数と見なす
   *   (ガードの旗を見落とす)ので、写す側は多めに写す(局所に同名があれば局所の宣言が隠すだけ)。写せない名前の判定(unsafe)だけ局所の型で外す(local:true)。
   */
  function readsOf(code, s0, e0) {
    const out = [];
    for (const nm of new Set(code.match(IDENT_RE) || [])) {
      const d = topDecl.get(nm);
      if (!d || provided.has(nm)) continue;
      if (!(hoisted(d) || d.l0 - 1 < s0)) continue;           // 範囲より後の宣言は局所の同名(TDZ)
      if (d.l0 - 1 >= s0 && d.l0 - 1 < e0) continue;          // 範囲の中の最上位の宣言
      out.push({ nm, local: declaresLocally(code, nm) });
    }
    return out;
  }
  function unsafeOf(u, code) {
    if (isW5b(u)) return 'W5b の関数';
    if (u.kind === 'decl' && !/^const\s/.test(u.head)) return 'let/var(フル QA の途中で書き換わる)';
    if (u.kind !== 'decl' && u.kind !== 'fn') return '宣言の文でない(' + u.kind + ')';
    for (const [nm, why] of UNSAFE_CALLS) if (new RegExp('(^|[^\\w$.])' + nm + '\\s*\\(').test(code)) return why;
    return null;
  }
  /**
   * 範囲(merged)が読む上流の宣言の閉包。
   * @returns {{names:string[], units:Array<{l0,l1,names,kind}>, unsafe:Array<{name:string, why:string, via:string|null}>, local:Array, reads:Object<string,string[]>}}
   *   names = 前文に写す宣言の名前(写す順)・units = 写す宣言の文(行の順)・unsafe = 写せない名前(via = どの宣言から辿ったか —— 範囲が直に読むなら null)・
   *   local = 写せない宣言だが範囲に局所の同名の型がある名前(写さず、写せないとも数えない)
   */
  const upMemo = new Map();   // 範囲ごとのメモ(qa-keys は同じ範囲の鍵を何度も引く)
  function upstreamOf(merged) {
    const mk = JSON.stringify(merged) + '|' + merged.map(([s0]) => headRewrite.has(s0) ? 'w' : '').join('');
    if (upMemo.has(mk)) return upMemo.get(mk);
    const r = upstreamOf0(merged);
    upMemo.set(mk, r);
    return r;
  }
  function upstreamOf0(merged) {
    const need = new Map(), unsafe = [], local = [], reads = {};
    const queue = [];
    for (const [s0, e0] of merged) {
      const r = readsOf(codeOf(textOfSpan(s0, e0)), s0, e0);
      reads[`${s0 + 1}-${e0}`] = r.map((z) => z.nm);
      for (const z of r) queue.push({ nm: z.nm, local: z.local, via: null });
    }
    const seen = new Set();
    while (queue.length) {
      const { nm, via, local: isLocal } = queue.shift();
      if (seen.has(nm)) continue;
      seen.add(nm);
      const u = topDecl.get(nm);
      const code = codeOf(u.text);
      const why = unsafeOf(u, code);
      if (why) { (isLocal ? local : unsafe).push({ name: nm, why, via }); continue; }   // 局所の同名の型に当たる名前は写さず、写せないとも数えない
      need.set(nm, u);
      for (const z of readsOf(code, u.l0 - 1, u.l1)) if (!seen.has(z.nm)) queue.push({ nm: z.nm, local: z.local, via: nm });
    }
    const us = [...new Set(need.values())].sort((p, q) => p.l0 - q.l0);
    return { names: us.flatMap((u) => u.names.filter((n) => need.has(n))), units: us.map((u) => ({ l0: u.l0, l1: u.l1, names: u.names, kind: u.kind })), unsafe, local, reads };
  }
  /** 前文に写す宣言の本文(行の順・qa.mjs の文をそのまま) */
  const upstreamTextOf = (up) => up.units.map((u) => lines.slice(u.l0 - 1, u.l1).join('\n')).join('\n');
  /**
   * 第323便a: 範囲ごとに try/catch で包んだ本文(本文の各行は bodyOf と同じ —— 範囲の前後に包みの行を足すだけ)。
   *   範囲の例外は `__qapartErr(e, '<a>-<b>')` に渡し、後の範囲は走らせ続ける(例外で止まった範囲の鍵は分類で「未実行」になる)。
   *   宣言の文で始まる範囲(const/let/var/function/class —— 後の範囲が名前を読みうる)は包まない。
   */
  const guardedBodyOf = (merged) => merged.map(([s0, e0]) => {
    const t = textOfSpan(s0, e0);
    const first = lines.slice(s0, e0).find((l) => l.length && !l.startsWith('//')) || '';
    if (/^(?:export\s+)?(?:const|let|var|class|(?:async\s+)?function)\b/.test(first)) return t;
    return `try {   // 第323便a(qapart の包み): 範囲 ${s0 + 1}-${e0}\n${t}\n} catch (e) { __qapartErr(e, '${s0 + 1}-${e0}'); }`;
  }).join('\n');
  const spanKindOf = (id) => { if (!spanKind.has(id)) spanOf(id); return spanKind.get(id); };
  return { lines, units, headRewrite, spanOf, mergeSpans, bodyOf, constsOf, consts284Of, spanKindOf, upstreamOf, upstreamTextOf, guardedBodyOf };
}

/** qapart の前文が用意する名前(切り出した範囲が上流の名前を読むかの照合に使う —— `tests/exp-w258c-qapart.mjs` の前文と同じ集合)。 */
export const QAPART_PRELUDE_NAMES = ['fs', 'crypto', 'path', 'execSync', 'createRequire', 'ROOT', 'TARGET', 'INDEX', 'PW_DIR', 'req', 'EXE', 'browser', 'page', 'pageErrors',
  'FAST', 'OUT_DIR', 'hasMerger', 'C_TRUE_286B', 'C4_286B', 'KAPPA4_286B', 'C5_286B', 'C7_286B', 'fpRun', 'results', 'lastAddAt', 'add'];

/**
 * 鍵の束(--batch N): 鍵を切り出しの範囲の順に並べ、**範囲が重なる鍵は同じ束**に入れて、束の鍵の数が N を超えないように分ける
 * (1 つの範囲に N を超える鍵があればその範囲だけで 1 束)。
 * 第330便c(R309 —— 第329便の継ぎ目: docs.w322d ⑤「50 鍵を超える束」): 範囲は半開区間 [始め, 終わり) —— **端が接するだけの範囲は重ならない**(`<`)。
 *   第322便d〜第329便は `<=` で接する塊も 1 つの組にした(統合で塊の前に空行を挟んで組を切っていた)。今の qa.mjs の範囲は「同じ」か「離れている」だけ(一部だけ重なる範囲 0)。
 * @param {Array<{id:string, span:[number,number]}>} keyed
 * @param {number} n
 * @returns {string[][]}
 */
// ==== 第330便c の塊(ここから)====
export const BATCH_KEYS_VERSION_330C = 'w330c-batchkeys-2';   // 版 1 = 第322便d の `<=`(接する範囲も組)・版 2 = 半開区間の重なり `<`
// ==== 第330便c の塊(ここまで)====
export function batchKeys(keyed, n) {
  const sorted = keyed.slice().sort((p, q) => p.span[0] - q.span[0] || p.span[1] - q.span[1]);
  // 重なる範囲を組にまとめる(第330便c: 半開区間 —— 接するだけの範囲は別の組)
  const groups = [];
  for (const k of sorted) {
    const g = groups[groups.length - 1];
    if (g && k.span[0] < g.end) { g.ids.push(k.id); g.end = Math.max(g.end, k.span[1]); }
    else groups.push({ ids: [k.id], end: k.span[1] });
  }
  const out = [];
  let cur = [];
  for (const g of groups) {
    if (cur.length && cur.length + g.ids.length > n) { out.push(cur); cur = []; }
    cur = cur.concat(g.ids);
  }
  if (cur.length) out.push(cur);
  return out;
}

// ---- 第323便a ③: 走った鍵の分類(PASS / FAIL / SKIP / 未実行)----
export const QAPART_SUMMARY_VERSION = 'w323a-qapart-summary-1';
/** SKIP の行の語(英数字と `_ $ . -` の続き —— `*` は接頭の印として残す) */
export function skipTokens(line) {
  const body = String(line).replace(/^\s*(SKIP|RETIRED)\s+/, '');
  return body.match(/[A-Za-z0-9_$.\-]+\*?/g) || [];
}
/** SKIP/RETIRED の行が鍵を名指すか: 語が鍵と同じ・または `<接頭>*`(`geo2.*`・`ui.54d-*`)・`<接頭>.`(`ice.`)の語が鍵の接頭(接頭は `.` を含む語だけ —— `*` 単独で全部を覆わない) */
export function skipCovers(line, id) {
  if (!/^\s*(SKIP|RETIRED)\s/.test(String(line))) return false;
  for (const t of skipTokens(line)) {
    if (t === id) return true;
    const p = t.endsWith('*') ? t.slice(0, -1) : (t.endsWith('.') ? t : null);
    if (p && p.includes('.') && id.startsWith(p) && id.length > p.length) return true;
  }
  return false;
}
/**
 * 要求した鍵の分類。
 * @param {string[]} requested 要求した鍵
 * @param {Array<{id:string, pass:boolean}>} results 走行の add の行
 * @param {string[]} skipLines 走行中に出た `SKIP …`・`RETIRED …` の行
 * @param {{errors?:Array<{span:string, message:string}>, strictSkip?:boolean, savedFull?:{file:string, ids:string[]}}} [opt]
 *   savedFull = 同じ対象の保存のフル QA の結果の id(未実行の鍵がフル QA でもこの対象で走らない型かの**注記**だけ —— 数え方は変えない)
 * @returns {{version:string, rows:Array<{id,state,n,line?}>, counts:{pass,fail,skip,notRun}, extra:{pass,fail}, errors:number, ok:boolean, rc:number, label:string}}
 */
export function classifyRequested(requested, results, skipLines, opt) {
  const o = opt || {};
  const req = [...new Set(requested)];
  const reqSet = new Set(req);
  const by = new Map();
  for (const r of results) { if (!by.has(r.id)) by.set(r.id, []); by.get(r.id).push(r); }
  const rows = [], counts = { pass: 0, fail: 0, skip: 0, notRun: 0 }, extra = { pass: 0, fail: 0 };
  const fullIds = o.savedFull && Array.isArray(o.savedFull.ids) ? new Set(o.savedFull.ids) : null;
  for (const id of req) {
    const rs = by.get(id);
    if (rs && rs.length) {
      const st = rs.every((r) => r.pass) ? 'PASS' : 'FAIL';
      rows.push({ id, state: st, n: rs.length });
      counts[st === 'PASS' ? 'pass' : 'fail']++;
      continue;
    }
    const line = (skipLines || []).find((l) => skipCovers(l, id));
    if (line) { rows.push({ id, state: 'SKIP', n: 0, line: String(line).slice(0, 160) }); counts.skip++; }
    else { rows.push({ id, state: 'NOTRUN', n: 0, inSavedFull: fullIds ? fullIds.has(id) : null }); counts.notRun++; }
  }
  counts.notRunAbsentInFull = fullIds ? rows.filter((r) => r.state === 'NOTRUN' && r.inSavedFull === false).length : null;
  for (const r of results) if (!reqSet.has(r.id)) extra[r.pass ? 'pass' : 'fail']++;
  const errors = (o.errors || []).length;
  const bad = counts.fail + counts.notRun + extra.fail + errors > 0 || req.length === 0;   // 要求した鍵 0 は何も確かめていない —— 成功にしない
  const strictBad = !!o.strictSkip && counts.skip > 0;
  const rc = bad || strictBad ? 1 : 0;
  const label = req.length === 0 ? 'FAILED(要求した鍵 0)' : bad ? 'FAILED' : strictBad ? 'FAILED(--strict-skip: SKIP あり)'
    : (counts.skip > 0 && counts.pass === 0 ? 'SKIP ONLY(走った鍵 0 —— PASS に数えない)' : counts.skip > 0 ? 'PASS(SKIP は PASS に数えない)' : 'ALL PASS');
  return { version: QAPART_SUMMARY_VERSION, rows, counts, extra, errors, ok: rc === 0, rc, label, savedFull: o.savedFull ? o.savedFull.file : null };
}
/** 分類の 1 行(qapart の終わりの行・--batch の要約と同じ型) */
export function summaryText(c) {
  return `要求した鍵 ${c.rows.length}: PASS ${c.counts.pass}・FAIL ${c.counts.fail}・SKIP ${c.counts.skip}・未実行 ${c.counts.notRun}`
    + (c.counts.notRun && c.counts.notRunAbsentInFull ? `(うち保存のフル QA ${c.savedFull} にもこの対象の行が無い ${c.counts.notRunAbsentInFull})` : '')
    + (c.extra.pass + c.extra.fail ? `(同じ範囲の他の鍵 PASS ${c.extra.pass}・FAIL ${c.extra.fail})` : '')
    + (c.errors ? `・範囲の例外 ${c.errors}` : '');
}

export default { QAPART_LIB_VERSION, qaSpanner, QAPART_PRELUDE_NAMES, batchKeys, BATCH_KEYS_VERSION_330C, QAPART_SUMMARY_VERSION, skipTokens, skipCovers, classifyRequested, summaryText };
