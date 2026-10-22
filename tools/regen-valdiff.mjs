#!/usr/bin/env node
// 第312便c(統括の検証項目 R232・決断事項 AN394 の影の運用の土台)—— **正本の値の差の記録**(判定ではなく測定)。
//
// ■ 何をするか
//   鎖(再生成)の後の作業木の正本 JSON と、基点の rev の正本(`git show <rev>:<file>`)を、**揮発の鍵を除いて**比べ、再生成表の段ごとに
//   「値が変わった / 同じ」を出す。AN394 の影の運用(本番の再利用はしない)の基準線 —— 第312便の鎖の後に統括が走らせ、DECISIONS に数を書く。
//
// ■ 除く鍵(揮発 —— 値ではない)
//   ① 正本の最上位の来歴: `/meta`(来歴・時刻・code の sha・領域の刻印)・`/h4Carry`(第312便c の h/4 の影の記録)・`/h4Carried`(第311便c の転記の来歴)。
//   ② 再生成表の段の `volatilePaths`(正本ごとに宣言した JSON Pointer —— tests/lib-w281a-regentable.mjs の volatilePathsOf)と META_RUN の 3 本。
//   ③ 鍵の名(階層を問わない)で除く実行時の量: 時刻・壁時計の所要・速さ(`VALDIFF_RUNTIME_KEYS`)・同一性の hash(`VALDIFF_ID_RE` —— *Sha256・sha256・sha)・
//      html の行番号(鍵 `line` で値が整数)。③ で除いた値の数は正本ごとに `droppedByName` に数える(観測の時刻・継続時間の欄〔when・durationMs〕は
//      ③ に入れない —— ② の宣言だけで除く。第282便e の教訓)。
//   比べ方は値ごとの JSON の表現の一致(−0 と 0・NaN と null を区別しない)・鍵の順は見ない・配列の順と長さは見る。
//
// ■ 使い方
//   node tools/regen-valdiff.mjs --base <rev> [--json <out>] [--steps 段,段] [--all-files] [--ignore 鍵,鍵]
//     標準出力に段ごとの 1 行(changed / same / added / removed / unreadable)と合計。--json に全件(差の Pointer の先頭 5 つ・差の数)。
//     既定は再生成表の現行の段(role current —— 履歴の段は --all-files で足す)の書く JSON(outs + merges)。--ignore は名で除く鍵を足す(例: 走行の数 stats ——
//     基点の正本が h/4 を転記した世代〔第311便〕だと an336・shell の stats が走行の数だけ違う。足した名は結果の excluded.ignore に残る)。
//   node tools/regen-valdiff.mjs --self-test    小さな JSON の対で除く鍵と差の検出を確かめる(QA lint.regenTools312 (b))。違えば 1。
//
// ■ しないこと: 判定しない・書き換えない(読むだけ)。「値が同じ」は除いた鍵の外が同じことだけを意味する(結果が正しいことの保証ではない)。
//
// ==== 第313便c の塊(ここから)====
// ■ 第313便c(統括の検証項目 R236・決断事項 AN394 の影の 2 回目の土台)—— **除外の宣言**(版 w313c-valdiff-2)
//   ④ 宣言の除外: tests/data-w313c-valdiff-volatile.json(版 w313c-valdiff-decl-1 —— **鎖の計画に響かない別のデータ**: 再生成表の volatilePaths は
//      安定 hash の刻印〔stampedDeclDrift〕と表の lib の sha〔families・timing294 の meta.code〕に入るので、そこへ足すと読み手の段の計画が regen に動く)。
//      段ごと・正本ごとに JSON Pointer(`*` は 1 段の任意 —— volatilePaths の型)と種類(kind)と理由(why)を書く。種類は 3 つの扱い:
//        除く(clock 実行時刻・wall 所要・rate 速さ・wallText 所要を埋めた文・timingRecord 所要の記録の節・mergeKey 結合の鍵・codeId コードと対象の同一性・
//              provenance 来歴・line html の行番号・build beta の版名・sched 実行の割り振り)/
//        並びを問わない(order —— 配列を `by` の欄で引く表に直して比べる。並びが所要の順の表)/
//        数え上げ(count —— 除かない。差は「構成の差」に数え、物理の差に数えない)。
//      **観測の epoch・物理の時刻・正本の値は宣言しない**(`checkDeclared` が種類ごとに値の型を照合する —— clock は 2026 年以後の ISO の時刻だけ・
//      wall は数だけ・rate は非負の数だけ ほか)。CLI は既定で宣言を読む(--no-declared で外す・--declared <file> で差し替え)。
//   ⑤ 差の分類: 宣言の後に残った差を葉の型で分ける —— 数(物理の差の候補)/ 文字列(文言の差)/ 鍵の有無・長さ・型・真偽・数え上げ(構成の差)。
//      段の分類 category: same(宣言の前から同じ)/ same-by-declared(宣言で同じになった)/ text(文言の差だけ)/ count(数え上げの差 —— と文言 —— だけ)/
//      struct(構成の差あり・数の差なし)/ number(数の差あり —— 物理の差の候補。意味を確かめるのは人)/ added・removed・no-json・unreadable・absent。
//   ⑥ --now <rev>: 今の側も rev の正本で読む(既定は作業木)—— 便の基準線(例 --base c98db78 --now a28c4c1)を git だけで引き直す。
//   ⑦ --table: 段ごとの分類の表(宣言の前の状態・宣言の後の状態・分類・残った差の型の数)。
// ==== 第313便c の塊(ここまで)====
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// 第313便c: 版 w313c-valdiff-2(宣言の除外・差の分類・--now・--table)。前の版は VALDIFF_HISTORY に残す(QA は世代を履歴で見る)
export const VALDIFF_VERSION = 'w313c-valdiff-2';
export const VALDIFF_HISTORY = ['w312c-valdiff-1', 'w313c-valdiff-2'];
export const VALDIFF_TOP = ['meta', 'h4Carry', 'h4Carried'];
export const VALDIFF_RUNTIME_KEYS = ['generatedAt', 'mtime', 'carriedFrom', 'carriedOverFrom', 'wallSec', 'rateStepsPerSec', 'spentSec', 'elapsedS', 'elapsedSec',
  'wallNearBudget', 'wallMs', 'elapsedMs', 'headlessMs', 'htmlLoadMs', 'wallBeforeMs', 'wallAfterMs', 'totalWallSec', 'heavyWallSec'];
export const VALDIFF_ID_RE = /^(sha256|sha|[A-Za-z0-9]*Sha256|[A-Za-z0-9]*Sha12)$/;

/** JSON Pointer('/a/*\/b' —— `*` は 1 段の任意)を鍵の並びへ。 */
function toks(ptr) { return String(ptr).split('/').slice(1).map((t) => t.replace(/~1/g, '/').replace(/~0/g, '~')); }
/** 宣言した Pointer の位置を消す(写しの上で)。 */
function dropPointer(J, ptr) {
  const t = toks(ptr);
  let n = 0;   // 第313便c: 消した位置の数を返す(宣言の除外の数え上げ)
  const walk = (x, i) => {
    if (!x || typeof x !== 'object') return;
    const keys = t[i] === '*' ? Object.keys(x) : (Object.prototype.hasOwnProperty.call(x, t[i]) ? [t[i]] : []);
    for (const k of keys) { if (i === t.length - 1) { n++; if (Array.isArray(x)) x[k] = '<除外>'; else delete x[k]; } else walk(x[k], i + 1); }
  };
  walk(J, 0);
  return n;
}
/** 鍵の名で除く(階層を問わない)—— 除いた数を返す。extra は --ignore で足した名。 */
function dropByName(J, extra) {
  let n = 0;
  const walk = (x) => {
    if (!x || typeof x !== 'object') return;
    if (Array.isArray(x)) { for (const v of x) walk(v); return; }
    for (const k of Object.keys(x)) {
      if (VALDIFF_RUNTIME_KEYS.includes(k) || VALDIFF_ID_RE.test(k) || (k === 'line' && Number.isInteger(x[k])) || (extra && extra.includes(k))) { delete x[k]; n++; continue; }
      walk(x[k]);
    }
  };
  walk(J);
  return n;
}
// ==== 第313便c の塊(ここから)====
// 第313便c(R236): 除外の宣言(tests/data-w313c-valdiff-volatile.json)。鎖の計画に響かない別のデータ —— 器・表の lib は読まない(QA lint.valdiffDecl313 ④)
export const VALDIFF_DECL_FILE = 'tests/data-w313c-valdiff-volatile.json';
export const VALDIFF_DECL_VERSION = 'w313c-valdiff-decl-1';
/** 種類 → 扱い(exclude 除く / order 並びを問わない / count 数え上げ —— 除かない)と意味。 */
export const VALDIFF_DECL_KINDS = {
  clock: { mode: 'exclude', ja: '実行時刻(器が new Date() で刻む時刻・入力の正本の実行時刻の写し)—— 観測の epoch・物理の時刻ではない' },
  wall: { mode: 'exclude', ja: '所要(壁時計の秒・ms・その比と割合)' },
  rate: { mode: 'exclude', ja: '速さ(步/秒・µs/步 —— 壁時計から作る)' },
  wallText: { mode: 'exclude', ja: '所要の数を埋めた文(器が壁時計の最長などを文に書く)' },
  timingRecord: { mode: 'exclude', ja: '所要の記録の節(QA・速さの測定 —— 中の数・並び・顔ぶれ・割り振りは所要の走行で決まる)' },
  mergeKey: { mode: 'exclude', ja: '結合の鍵(対象 html と入力の hash —— 列を同じ html で作ったかの照合用)' },
  codeId: { mode: 'exclude', ja: 'コードと対象の同一性(エンジンの sha・契約の hash・閉包の大きさ・対象 html の sha の写し)' },
  provenance: { mode: 'exclude', ja: '来歴(比べた相手・転記元の契約・QA の rev・見積りの出所)' },
  line: { mode: 'exclude', ja: 'html の行番号(html の行が動くと動く)' },
  build: { mode: 'exclude', ja: 'beta の版名(便ごとに変わる)' },
  sched: { mode: 'exclude', ja: '実行の割り振り(どの worker で走ったか —— 走らせるたびに変わる)' },
  order: { mode: 'order', ja: '並びを問わない(配列を by の欄で引く表に直して比べる —— 並びが所要の順の表)' },
  count: { mode: 'count', ja: '数え上げ(段・QA・本の数 —— 除かない。差は構成の差に数え、物理の差に数えない)' },
};
/** 宣言のファイルを読む(無ければ null)。 */
export function loadDeclared(root, file) {
  const f = file ? (path.isAbsolute(file) ? file : path.join(root, file)) : path.join(root, VALDIFF_DECL_FILE);
  try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return null; }
}
/** 正本 file の宣言(段をまたいで和)—— { exclude:[ptr], order:[{ptr,by}], count:[ptr], n }。宣言が無ければ null。 */
export function declaredOf(doc, file) {
  if (!doc || !doc.steps) return null;
  const out = { exclude: [], order: [], count: [], n: 0 };
  for (const st of Object.values(doc.steps)) for (const e of ((st || {})[file] || [])) {
    const k = VALDIFF_DECL_KINDS[e.kind]; if (!k) continue;
    out.n++;
    if (k.mode === 'exclude') out.exclude.push(e.ptr); else if (k.mode === 'order') out.order.push({ ptr: e.ptr, by: e.by }); else out.count.push(e.ptr);
  }
  return out.n ? out : null;
}
/**
 * 配列(Pointer の位置 —— `*` 可)を by の欄で引く表に直す(要素がすべて by の欄を持つときだけ)。直した配列の数を返す。
 * 同じ値の要素が複数あれば、除いた後の本文(JSON)の順に `#2`・`#3` を付ける(例: 保存 QA で同じ試験の名が 2 回 —— 並びに依らない)。
 */
function orderByKey(J, ptr, by) {
  const t = toks(ptr);
  let n = 0;
  const fix = (arr) => {
    if (!Array.isArray(arr) || !arr.every((z) => z && typeof z === 'object' && !Array.isArray(z) && Object.prototype.hasOwnProperty.call(z, by))) return null;
    const groups = new Map();
    for (const z of arr) { const k = by + '=' + String(z[by]); if (!groups.has(k)) groups.set(k, []); groups.get(k).push(z); }
    const out = {};
    for (const [k, list] of groups) {
      const sorted = list.length > 1 ? list.slice().sort((a, b) => { const x = JSON.stringify(a), y = JSON.stringify(b); return x < y ? -1 : x > y ? 1 : 0; }) : list;
      sorted.forEach((z, i) => { out[i ? k + '#' + (i + 1) : k] = z; });
    }
    n++; return out;
  };
  const walk = (x, i) => {
    if (!x || typeof x !== 'object') return;
    const keys = t[i] === '*' ? Object.keys(x) : (Object.prototype.hasOwnProperty.call(x, t[i]) ? [t[i]] : []);
    for (const k of keys) { if (i === t.length - 1) { const v = fix(x[k]); if (v) x[k] = v; } else walk(x[k], i + 1); }
  };
  if (!t.length) return 0;
  walk(J, 0);
  return n;
}
/** Pointer の位置の値(`*` 可)を集める。 */
export function resolvePointer(J, ptr) {
  const t = toks(ptr), got = [];
  const walk = (x, i) => {
    if (i === t.length) { got.push(x); return; }
    if (!x || typeof x !== 'object') return;
    const keys = t[i] === '*' ? Object.keys(x) : (Object.prototype.hasOwnProperty.call(x, t[i]) ? [t[i]] : []);
    for (const k of keys) walk(x[k], i + 1);
  };
  walk(J, 0);
  return got;
}
const leaves = (v) => { const out = []; const w = (x) => { if (x && typeof x === 'object') { for (const y of Object.values(x)) w(y); } else out.push(x); }; w(v); return out; };
const ISO_RE = /^\d{4}-\d\d-\d\dT\d\d:\d\d/;
/** 種類ごとの値の型(宣言の意味の機械の照合 —— 観測の epoch を clock に入れた・正本の文を wall に入れた、を落とす)。違えば理由の文字列。 */
export function kindTypeError(kind, v, by) {
  const L = leaves(v);
  const nonNeg = (x) => x === null || (typeof x === 'number' && Number.isFinite(x) && x >= 0);
  switch (kind) {
    case 'clock': return L.every((x) => x === null || (typeof x === 'string' && ISO_RE.test(x) && x >= '2026-01-01')) ? null : '2026 年以後の ISO の時刻でない値(観測の epoch・物理の時刻は宣言しない)';
    case 'wall': return L.every((x) => x === null || (typeof x === 'number' && Number.isFinite(x))) ? null : '数でない値';   // 壁時計の差(負もある)を含む
    case 'rate': return L.every(nonNeg) ? null : '非負の数でない値';
    case 'wallText': return typeof v === 'string' && /\d/.test(v) ? null : '数を含む文でない';
    case 'timingRecord': return L.some((x) => typeof x === 'number') && !L.some((x) => typeof x === 'string' && ISO_RE.test(x) && x < '2026-01-01') ? null : '数を含まないか 2026 年より前の時刻を含む';
    case 'mergeKey': return L.every((x) => typeof x === 'string' && /^[0-9a-f]{12,}$/.test(x)) ? null : '16 進の鍵でない';
    case 'codeId': return L.every((x) => (typeof x === 'string' && /^[0-9a-f]{12,}$/.test(x)) || nonNeg(x)) ? null : '16 進の hash か非負の数でない';
    case 'provenance': case 'sched': return L.every((x) => x === null || typeof x === 'string') ? null : '文字列でない';
    case 'line': return L.every((x) => Number.isInteger(x) && x >= 1) ? null : '1 以上の整数でない';
    case 'build': return L.every((x) => typeof x === 'string' && /^v\d/.test(x)) ? null : '版名(v…)でない';
    case 'order': return Array.isArray(v) && v.every((z) => z && typeof z === 'object' && Object.prototype.hasOwnProperty.call(z, by)) ? null : '配列の要素が by の欄を持たない';
    case 'count': return L.every((x) => (Number.isInteger(x) && x >= 0) || x === 'all') ? null : '非負の整数(か all)でない';
    default: return '知らない種類';
  }
}
/**
 * 宣言の照合(QA lint.valdiffDecl313 ②)—— 版・種類の語彙・理由・段が表の現行の段・正本がその段の outs/merges・Pointer の形・**種類ごとの値の型**
 * (今の正本で引けた位置だけ —— 引けない Pointer は数えるだけ〔鎖の後に欄が消えることがある〕)。
 * @param {object} doc 宣言 @param {{REGEN_STEPS:Array}} T 再生成表 @param {(f:string)=>string|null} readNow 今の正本の本文
 */
export function checkDeclared(doc, T, readNow) {
  const bad = [], rows = [];
  if (!doc || doc.version !== VALDIFF_DECL_VERSION) bad.push('版が ' + VALDIFF_DECL_VERSION + ' でない: ' + (doc && doc.version));
  const cur = new Map((T.REGEN_STEPS || []).filter((z) => z.role !== 'history').map((z) => [z.key, z]));
  const cache = new Map();
  const J = (f) => { if (!cache.has(f)) { let v = null; try { const t = readNow(f); v = t === null ? null : JSON.parse(t); } catch { v = null; } cache.set(f, v); } return cache.get(f); };
  for (const [key, files] of Object.entries((doc && doc.steps) || {})) {
    const st = cur.get(key);
    if (!st) { bad.push('表の現行の段に無い ' + key); continue; }
    const own = new Set((st.outs || []).concat(st.merges || []));
    for (const [file, list] of Object.entries(files || {})) {
      if (!own.has(file)) bad.push(key + ' の書く正本でない ' + file);
      for (const e of (Array.isArray(list) ? list : [])) {
        const row = { step: key, file, ptr: e.ptr, kind: e.kind, resolved: 0, typeError: null };
        if (!VALDIFF_DECL_KINDS[e.kind]) bad.push('知らない種類 ' + key + ':' + e.ptr + ':' + e.kind);
        if (typeof e.ptr !== 'string' || !/^\/./.test(e.ptr)) bad.push('Pointer の形 ' + key + ':' + e.ptr);
        if (!e.why || String(e.why).length < 4) bad.push('理由が無い ' + key + ':' + e.ptr);
        if (e.kind === 'order' && !e.by) bad.push('order に by が無い ' + key + ':' + e.ptr);
        const D = J(file);
        if (D && typeof e.ptr === 'string' && VALDIFF_DECL_KINDS[e.kind]) {
          const vals = resolvePointer(D, e.ptr);
          row.resolved = vals.length;
          for (const v of vals) { const er = kindTypeError(e.kind, v, e.by); if (er) { row.typeError = er; bad.push('型 ' + key + ':' + e.ptr + '(' + e.kind + ')—— ' + er); break; } }
        }
        rows.push(row);
      }
    }
  }
  const byKind = {}; for (const z of rows) byKind[z.kind] = (byKind[z.kind] || 0) + 1;
  return { ok: bad.length === 0, bad, rows, steps: Object.keys((doc && doc.steps) || {}).length, pointers: rows.length, byKind,
    unresolved: rows.filter((z) => !z.resolved).map((z) => z.step + ':' + z.ptr) };
}
// ==== 第313便c の塊(ここまで)====

/** 比べる写し(① 最上位の来歴 ② 宣言の Pointer ③ 鍵の名)。 */
export function valueView(J, volatilePaths, extra, decl) {
  if (!J || typeof J !== 'object') return { view: J, droppedByName: 0, droppedDeclared: 0, ordered: 0 };
  const V = JSON.parse(JSON.stringify(J));
  if (!Array.isArray(V)) for (const k of VALDIFF_TOP) delete V[k];
  for (const p of volatilePaths || []) dropPointer(V, p);
  // 第313便c ④: 宣言の除外(種類 exclude)→ 鍵の名 → 並びを問わない表(order)
  let nd = 0, no = 0;
  for (const p of ((decl || {}).exclude || [])) nd += dropPointer(V, p);
  const n = dropByName(V, extra);
  for (const o of ((decl || {}).order || [])) no += orderByKey(V, o.ptr, o.by);
  return { view: V, droppedByName: n, droppedDeclared: nd, ordered: no };
}
/** 値の差(Pointer の並び —— 先頭 limit 個と総数)。鍵の順は見ない・配列は順と長さを見る・葉は JSON の表現で比べる。 */
export function valueDiffs(a, b, limit, opt) {
  const out = []; let n = 0;
  // 第313便c ⑤: 差の型の数(number 数の葉 / text 文字列の葉 / struct 型・長さ・鍵の有無 / other 真偽・null ほか / count 宣言の数え上げの数の葉)
  const kinds = { number: 0, text: 0, struct: 0, other: 0, count: 0 };
  const countPats = ((opt || {}).count || []).map(toks);
  const isCount = (p) => countPats.some((t) => { const q = p.split('/').slice(1); return q.length >= t.length && t.every((w, i) => w === '*' || w === q[i]); });
  const push = (p, kind) => { n++; kinds[kind]++; if (out.length < (limit || 5)) out.push(p || '/'); };
  const walk = (x, y, p) => {
    const ax = Array.isArray(x), ay = Array.isArray(y);
    if (ax || ay) {
      if (!ax || !ay) { push(p + '(型)', 'struct'); return; }
      if (x.length !== y.length) push(p + '(長さ ' + y.length + ' → ' + x.length + ')', 'struct');
      for (let i = 0; i < Math.min(x.length, y.length); i++) walk(x[i], y[i], p + '/' + i);
      return;
    }
    if (x && y && typeof x === 'object' && typeof y === 'object') {
      for (const k of new Set(Object.keys(x).concat(Object.keys(y)))) {
        if (!(k in x)) { push(p + '/' + k + '(消えた)', 'struct'); continue; }
        if (!(k in y)) { push(p + '/' + k + '(足された)', 'struct'); continue; }
        walk(x[k], y[k], p + '/' + k);
      }
      return;
    }
    if (JSON.stringify(x) !== JSON.stringify(y)) {
      const tx = typeof x, ty = typeof y;
      push(p, tx === 'number' && ty === 'number' ? (isCount(p) ? 'count' : 'number') : tx === 'string' && ty === 'string' ? 'text'
        : (tx !== ty || (x === null) !== (y === null) || tx === 'object') ? 'struct' : 'other');
    }
  };
  walk(a, b, '');
  return { n, first: out, kinds };
}
/** 1 ファイルの比べ(now・base は JSON の本文か null)。 */
export function compareFile(nowText, baseText, volatilePaths, extra, decl) {
  if (nowText === null && baseText === null) return { status: 'absent' };
  if (baseText === null) return { status: 'added' };
  if (nowText === null) return { status: 'removed' };
  let A = null, B = null;
  try { A = JSON.parse(nowText); B = JSON.parse(baseText); } catch { return { status: 'unreadable' }; }
  const va = valueView(A, volatilePaths, extra, decl), vb = valueView(B, volatilePaths, extra, decl);
  const d = valueDiffs(va.view, vb.view, 5, decl);
  const r = { status: d.n ? 'changed' : 'same', nDiff: d.n, firstDiffs: d.first, droppedByName: { now: va.droppedByName, base: vb.droppedByName },
    byteSame: nowText === baseText };
  // 第313便c ⑤: 宣言を当てたとき —— 宣言の前の状態・除いた数・残った差の型と分類
  if (decl) {
    const u = valueDiffs(valueView(A, volatilePaths, extra).view, valueView(B, volatilePaths, extra).view, 5);
    r.statusUndeclared = u.n ? 'changed' : 'same'; r.nDiffUndeclared = u.n;
    r.droppedDeclared = { now: va.droppedDeclared, base: vb.droppedDeclared }; r.ordered = { now: va.ordered, base: vb.ordered };
    r.kinds = d.kinds; r.category = categoryOf(r.status, r.statusUndeclared, d.kinds);
  }
  return r;
}
/** 第313便c ⑤: 段(ファイル)の分類 —— 宣言の後の状態・宣言の前の状態・残った差の型の数から。 */
export function categoryOf(status, statusUndeclared, kinds) {
  if (status !== 'changed') return status === 'same' && statusUndeclared === 'changed' ? 'same-by-declared' : status;
  const k = kinds || {};
  return k.number ? 'number' : (k.struct || k.other) ? 'struct' : k.count ? 'count' : 'text';
}

/**
 * 段ごとの値の差(再生成表 —— 段の書く JSON)。
 * @param {{root:string, base:string, steps?:string[], allFiles?:boolean, T:object, readBase?:Function, readNow?:Function, ignore?:string[]}} o
 */
export function valDiff(o) {
  const T = o.T;
  const gitShow = (rev, f) => { try { return execFileSync('git', ['-C', o.root, 'show', rev + ':' + f], { encoding: 'utf8', maxBuffer: 1 << 30, stdio: ['ignore', 'pipe', 'ignore'] }); } catch { return null; } };
  // 第313便c ⑥: o.now(rev)があれば今の側も rev の正本で読む
  const readNow = o.readNow || (o.now ? ((f) => gitShow(o.now, f)) : ((f) => { try { return fs.readFileSync(path.join(o.root, f), 'utf8'); } catch { return null; } }));
  const readBase = o.readBase || ((f) => gitShow(o.base, f));
  const D = o.declared || null;   // 第313便c ④: 除外の宣言(null なら宣言なし —— 第312便c の比べ方)
  const want = o.steps && o.steps.length ? new Set(o.steps) : null;
  const rows = [];
  for (const st of T.REGEN_STEPS) {
    if (want && !want.has(st.key)) continue;
    if (!want && !o.allFiles && st.role === 'history') continue;
    const files = [...new Set((st.outs || []).concat(st.merges || []))].filter((f) => /\.json$/.test(f));
    if (!files.length) { rows.push(Object.assign({ key: st.key, status: 'no-json', files: [] }, D ? { statusUndeclared: 'no-json', category: 'no-json' } : {})); continue; }
    const fr = files.map((f) => Object.assign({ file: f }, compareFile(readNow(f), readBase(f), T.volatilePathsOf(f), o.ignore, D ? (declaredOf(D, f) || { exclude: [], order: [], count: [] }) : undefined)));
    const agg = (k) => (fr.some((z) => z[k] === 'changed') ? 'changed' : fr.some((z) => z[k] === 'unreadable') ? 'unreadable'
      : fr.some((z) => z[k] === 'added') ? 'added' : fr.some((z) => z[k] === 'removed') ? 'removed' : fr.every((z) => z[k] === 'absent') ? 'absent' : 'same');
    const st2 = agg('status');
    const row = { key: st.key, status: st2, files: fr };
    if (D) {
      // 第313便c ⑤: 段の分類(ファイルの差の型の和から —— number > struct > count > text > same-by-declared > same)
      row.statusUndeclared = fr.every((z) => z.statusUndeclared === undefined) ? st2 : agg('statusUndeclared');
      const kinds = { number: 0, text: 0, struct: 0, other: 0, count: 0 };
      for (const z of fr) for (const k of Object.keys(kinds)) kinds[k] += ((z.kinds || {})[k] || 0);
      row.kinds = kinds;
      row.category = st2 === 'changed' || st2 === 'same' ? categoryOf(st2, row.statusUndeclared, kinds) : st2;
    }
    rows.push(row);
  }
  const count = {}; for (const r of rows) count[r.status] = (count[r.status] || 0) + 1;
  const out = { version: VALDIFF_VERSION, base: o.base, now: o.now || '作業木', rows, count,
    excluded: { top: VALDIFF_TOP, declared: '再生成表の volatilePaths(正本ごと)と META_RUN', byName: VALDIFF_RUNTIME_KEYS, idPattern: String(VALDIFF_ID_RE), line: 'line(整数)', ignore: o.ignore || [] } };
  if (D) {
    const byCat = {}; for (const r of rows) byCat[r.category] = (byCat[r.category] || 0) + 1;
    const undeclared = {}; for (const r of rows) undeclared[r.statusUndeclared] = (undeclared[r.statusUndeclared] || 0) + 1;
    out.byCategory = byCat; out.countUndeclared = undeclared;
    out.excluded.declaredFile = { file: o.declaredFile || VALDIFF_DECL_FILE, version: D.version, steps: Object.keys(D.steps || {}).length,
      pointers: Object.values(D.steps || {}).reduce((a, st) => a + Object.values(st || {}).reduce((b, l) => b + (Array.isArray(l) ? l.length : 0), 0), 0) };
  }
  return out;
}

/** 自己試験(QA lint.regenTools312 (b)): 小さな JSON の対で除く鍵と差の検出。 */
export function valDiffSelfTest() {
  const r = {};
  const base = { meta: { generatedAt: '2026-10-21T00:00:00.000Z', code: [{ file: 'x', sha256: 'a'.repeat(64) }] }, h4Carry: { mode: 'shadow', prev: { generatedAt: '2026-10-20T00:00:00.000Z' } },
    elapsedS: 12.5, rows: [{ v: 1.25, wallSec: 3, targetSha256: 'a'.repeat(64), line: 6255, obs: { when: '2015-09-14T09:50:45Z', durationMs: 200 } }], timing: { M: { wallSec: 4 } }, z: -0 };
  const same = JSON.parse(JSON.stringify(base));
  same.meta.generatedAt = '2026-10-22T00:00:00.000Z'; same.meta.code[0].sha256 = 'b'.repeat(64); same.h4Carry.prev.generatedAt = '2026-10-21T00:00:00.000Z';
  same.elapsedS = 99; same.rows[0].wallSec = 7; same.rows[0].targetSha256 = 'c'.repeat(64); same.rows[0].line = 6300; same.timing.M.wallSec = 9; same.z = 0;
  const reorder = { z: 0, timing: same.timing, rows: same.rows, elapsedS: 1, meta: {} };
  const s1 = compareFile(JSON.stringify(same), JSON.stringify(base), []);
  const s2 = compareFile(JSON.stringify(reorder), JSON.stringify(base), []);
  r.same = s1.status === 'same' && s2.status === 'same' && s1.byteSame === false && s1.droppedByName.now === 5;
  // 値の 1 bit・観測の when・durationMs(③ に入れない)・配列の長さ・鍵の有無は差
  const ch = (f) => { const x = JSON.parse(JSON.stringify(base)); f(x); return compareFile(JSON.stringify(x), JSON.stringify(base), []); };
  const c1 = ch((x) => { x.rows[0].v = 1.25 + Math.pow(2, -50); }), c2 = ch((x) => { x.rows[0].obs.when = '2015-09-14T09:50:46Z'; }), c3 = ch((x) => { x.rows[0].obs.durationMs = 201; }),
    c4 = ch((x) => { x.rows.push({ v: 2 }); }), c5 = ch((x) => { x.extra = 1; });
  r.changed = c1.status === 'changed' && c1.firstDiffs[0] === '/rows/0/v' && c2.status === 'changed' && c3.status === 'changed' && c4.status === 'changed' && /長さ/.test(c4.firstDiffs[0])
    && c5.status === 'changed' && /足された/.test(c5.firstDiffs[0]);
  // 宣言の Pointer(② —— 観測の when でも宣言すれば除く)
  const c6 = ch((x) => { x.rows[0].obs.when = '2015-09-14T09:50:46Z'; x.rows[0].v = 9; });
  const d6 = compareFile(JSON.stringify(Object.assign(JSON.parse(JSON.stringify(base)), { rows: [Object.assign({}, base.rows[0], { obs: { when: 'X', durationMs: 200 } })] })), JSON.stringify(base), ['/rows/*/obs/when']);
  r.declared = c6.nDiff === 2 && d6.status === 'same';
  // 追加・消えた・読めない
  r.ignore = compareFile(JSON.stringify({ v: 1, stats: { runs: 82 } }), JSON.stringify({ v: 1, stats: { runs: 68 } }), [], ['stats']).status === 'same'
    && compareFile(JSON.stringify({ v: 1, stats: { runs: 82 } }), JSON.stringify({ v: 1, stats: { runs: 68 } }), []).status === 'changed';
  r.files = compareFile('{}', null, []).status === 'added' && compareFile(null, '{}', []).status === 'removed' && compareFile('{', '{}', []).status === 'unreadable'
    && compareFile(null, null, []).status === 'absent';
  // 段ごと(表の写し)
  const T = { REGEN_STEPS: [{ key: 'A', outs: ['a.json'], role: 'current' }, { key: 'B', outs: ['b.json', 'b.md'], role: 'current' }, { key: 'H', outs: ['h.json'], role: 'history' }, { key: 'C', outs: ['c.md'], role: 'current' }],
    volatilePathsOf: (f) => (f === 'b.json' ? ['/t'] : []) };
  const NOW = { 'a.json': JSON.stringify({ v: 1, meta: { x: 2 } }), 'b.json': JSON.stringify({ v: 2, t: 'now' }) }, BASE = { 'a.json': JSON.stringify({ v: 1, meta: { x: 1 } }), 'b.json': JSON.stringify({ v: 3, t: 'base' }) };
  const vd = valDiff({ root: '/nonexistent', base: 'REV', T, readBase: (f) => (BASE[f] === undefined ? null : BASE[f]), readNow: (f) => (NOW[f] === undefined ? null : NOW[f]) });
  r.steps = vd.rows.map((z) => z.key + ':' + z.status).join(',');
  r.stepsOk = r.steps === 'A:same,B:changed,C:no-json' && vd.count.same === 1 && vd.count.changed === 1;
  // ==== 第313便c の塊(ここから)====
  // 第313便c ④⑤: 除外の宣言(exclude・order・count)と差の分類・宣言の照合(checkDeclared —— 観測の epoch を clock に入れた宣言を落とす)
  {
    const d = {};
    const B0 = { when: '2026-10-21T21:00:00.000Z', obs: { epoch: '2015-09-14T09:50:45Z', v: 1.5 }, rows: [{ id: 'a', ms: 3, v: 1 }, { id: 'b', ms: 4, v: 2 }], n: 2, err: '未知の鍵 x' };
    const N0 = JSON.parse(JSON.stringify(B0)); N0.when = '2026-10-22T21:00:00.000Z'; N0.rows = [{ id: 'b', ms: 9, v: 2 }, { id: 'a', ms: 1, v: 1 }];
    const decl = { exclude: ['/when', '/rows/*/ms'], order: [{ ptr: '/rows', by: 'id' }], count: ['/n'] };
    const c1 = compareFile(JSON.stringify(N0), JSON.stringify(B0), [], undefined, decl);
    d.sameByDeclared = c1.status === 'same' && c1.statusUndeclared === 'changed' && c1.category === 'same-by-declared' && c1.droppedDeclared.now === 3 && c1.ordered.now === 1;
    // 並びを問わない表で要素が足された → 構成の差 / 数え上げの数 → count / 文言 → text / 値 → number / 観測の epoch は宣言しなければ差
    const N1 = JSON.parse(JSON.stringify(N0)); N1.rows.push({ id: 'c', ms: 2, v: 3 }); N1.n = 3;
    const c2 = compareFile(JSON.stringify(N1), JSON.stringify(B0), [], undefined, decl);
    const N2 = JSON.parse(JSON.stringify(N0)); N2.n = 3;
    const c3 = compareFile(JSON.stringify(N2), JSON.stringify(B0), [], undefined, decl);
    const N3 = JSON.parse(JSON.stringify(N0)); N3.err = '未知の鍵 x(kernel)';
    const c4 = compareFile(JSON.stringify(N3), JSON.stringify(B0), [], undefined, decl);
    const N4 = JSON.parse(JSON.stringify(N0)); N4.rows[1].v = 1 + Math.pow(2, -50); N4.obs.epoch = '2015-09-14T09:50:46Z';
    const c5 = compareFile(JSON.stringify(N4), JSON.stringify(B0), [], undefined, decl);
    d.categories = [c2.category, c3.category, c4.category, c5.category].join(',');
    d.categoriesOk = d.categories === 'struct,count,text,number' && c2.firstDiffs[0] === '/rows/id=c(足された)' && c5.kinds.number === 1 && c5.kinds.text === 1
      && c5.firstDiffs.includes('/obs/epoch') && c5.firstDiffs.includes('/rows/id=a/v');
    // 同じ値の要素が 2 つ(並びに依らない)
    const dup = (a) => JSON.stringify({ t: a });
    d.dupOk = compareFile(dup([{ id: 'x', ms: 1 }, { id: 'x', ms: 2 }, { id: 'y', ms: 3 }]), dup([{ id: 'y', ms: 3 }, { id: 'x', ms: 2 }, { id: 'x', ms: 1 }]), [], undefined,
      { exclude: [], order: [{ ptr: '/t', by: 'id' }], count: [] }).status === 'same';
    // 宣言の照合: 良い宣言は ok・観測の epoch を clock に・文を wall に・知らない種類・表に無い段・書かない正本は落とす
    const Tx = { REGEN_STEPS: [{ key: 'S', outs: ['s.json'], role: 'current' }, { key: 'H', outs: ['h.json'], role: 'history' }] };
    const rd = (f) => (f === 's.json' ? JSON.stringify(B0) : null);
    const good = { version: VALDIFF_DECL_VERSION, steps: { S: { 's.json': [{ ptr: '/when', kind: 'clock', why: '器の実行時刻' }, { ptr: '/rows', kind: 'order', by: 'id', why: '並びは所要の順' },
      { ptr: '/rows/*/ms', kind: 'wall', why: '所要(ms)' }, { ptr: '/n', kind: 'count', why: '数え上げ' }] } } };
    const g = checkDeclared(good, Tx, rd);
    const badDoc = { version: VALDIFF_DECL_VERSION, steps: { S: { 's.json': [{ ptr: '/obs/epoch', kind: 'clock', why: '観測の epoch(誤り)' }, { ptr: '/err', kind: 'wall', why: '文(誤り)' },
      { ptr: '/n', kind: 'nope', why: '知らない種類' }], 'z.json': [] }, H: { 'h.json': [] } } };
    const b = checkDeclared(badDoc, Tx, rd);
    d.check = { good: g.ok, goodResolved: g.rows.map((z) => z.resolved).join(','), bad: b.bad.length };
    d.checkOk = g.ok && d.check.goodResolved === '1,1,2,1' && !b.ok && b.bad.length === 5
      && b.bad.some((x) => /epoch|2026/.test(x)) && b.bad.some((x) => /数でない/.test(x)) && b.bad.some((x) => /知らない種類/.test(x)) && b.bad.some((x) => /現行の段に無い H/.test(x)) && b.bad.some((x) => /書く正本でない z\.json/.test(x));
    // valDiff の段ごと(宣言あり)—— 分類と宣言の前の状態
    const T2 = { REGEN_STEPS: [{ key: 'S', outs: ['s.json'], role: 'current' }], volatilePathsOf: () => [] };
    const v2 = valDiff({ root: '/nonexistent', base: 'REV', T: T2, readBase: () => JSON.stringify(B0), readNow: () => JSON.stringify(N0), declared: good });
    d.valDiff = v2.rows[0].category + ':' + v2.rows[0].statusUndeclared;
    d.valDiffOk = d.valDiff === 'same-by-declared:changed' && v2.byCategory['same-by-declared'] === 1;
    d.ok = !!(d.sameByDeclared && d.categoriesOk && d.dupOk && d.checkOk && d.valDiffOk);
    r.decl = d;
  }
  // ==== 第313便c の塊(ここまで)====
  r.ok = !!(r.same && r.changed && r.declared && r.ignore && r.files && r.stepsOk && r.decl.ok);
  return r;
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) {
  const argv = process.argv.slice(2);
  const getArg = (k, d) => { const i = argv.indexOf(k); return (i >= 0 && argv[i + 1]) ? argv[i + 1] : d; };
  if (argv.includes('--self-test')) { const r = valDiffSelfTest(); console.log(JSON.stringify(r, null, 1)); process.exit(r.ok ? 0 : 1); }
  const base = getArg('--base', null);
  if (!base) { console.error('使い方: node tools/regen-valdiff.mjs --base <rev> [--now <rev>] [--json <out>] [--steps 段,段] [--all-files] [--ignore 鍵,鍵] [--declared <file> | --no-declared] [--table] | --self-test'); process.exit(2); }
  const nowRev = getArg('--now', null);
  for (const rv of [base, nowRev].filter(Boolean)) {
    try { execFileSync('git', ['-C', ROOT, 'rev-parse', '--verify', rv + '^{commit}'], { stdio: 'ignore' }); } catch { console.error('rev が無い: ' + rv); process.exit(2); }
  }
  const T = await import(pathToFileURL(path.join(ROOT, 'tests', 'lib-w281a-regentable.mjs')).href);
  const steps = (getArg('--steps', '') || '').split(',').filter(Boolean);
  const t0 = Date.now();
  const ignore = (getArg('--ignore', '') || '').split(',').filter(Boolean);
  // 第313便c ④: 除外の宣言(既定で読む)
  const declFile = argv.includes('--no-declared') ? null : (getArg('--declared', null) || VALDIFF_DECL_FILE);
  const declared = declFile ? loadDeclared(ROOT, declFile) : null;
  if (declFile && !declared) { console.error('宣言が読めない: ' + declFile); process.exit(2); }
  if (declared && declared.version !== VALDIFF_DECL_VERSION) { console.error('宣言の版が ' + VALDIFF_DECL_VERSION + ' でない: ' + declared.version); process.exit(2); }
  const r = valDiff({ root: ROOT, base, now: nowRev, steps, allFiles: argv.includes('--all-files'), T, ignore, declared, declaredFile: declFile });
  const tableMode = argv.includes('--table');
  for (const z of r.rows) {
    if (tableMode) {
      if (!declared || z.statusUndeclared === 'same' || z.status === 'no-json' || z.status === 'absent') continue;
      const k = z.kinds || {};
      const rest = z.status === 'changed' ? z.files.filter((w) => w.status === 'changed').map((w) => w.firstDiffs.slice(0, 2).join(' ')).join(' / ') : '';
      console.log(`  ${String(z.category).padEnd(17)} ${z.key.padEnd(18)} 宣言の前 ${String(z.statusUndeclared).padEnd(8)} 後 ${String(z.status).padEnd(8)} 数 ${k.number || 0}・文 ${k.text || 0}・構成 ${(k.struct || 0) + (k.other || 0)}・数え上げ ${k.count || 0}${rest ? '  ' + rest.slice(0, 120) : ''}`);
      continue;
    }
    if (z.status === 'same' || z.status === 'no-json' || z.status === 'absent') continue;
    const f = z.files.filter((w) => w.status !== 'same').map((w) => `${w.file.replace('tests/out/', '')} ${w.status}${w.nDiff ? '(' + w.nDiff + ' か所: ' + w.firstDiffs.slice(0, 3).join(' ') + ')' : ''}`).join(' / ');
    console.log(`  ${z.status.padEnd(10)} ${z.key.padEnd(22)} ${f}${z.category ? '  [' + z.category + ']' : ''}`);
  }
  console.log(`regen-valdiff(${VALDIFF_VERSION})基点 ${base} → ${nowRev || '作業木'}: 段 ${r.rows.length} —— ${Object.entries(r.count).map(([k, v]) => k + ' ' + v).join(' / ')}`
    + (declared ? `(宣言 ${r.excluded.declaredFile.version}・${r.excluded.declaredFile.steps} 段・${r.excluded.declaredFile.pointers} 個 —— 宣言の前 ${Object.entries(r.countUndeclared).map(([k, v]) => k + ' ' + v).join(' / ')}`
      + ` —— 分類 ${Object.entries(r.byCategory).map(([k, v]) => k + ' ' + v).join(' / ')})` : '(宣言なし)') + `(${((Date.now() - t0) / 1000).toFixed(1)} s)`);
  const js = getArg('--json', null);
  if (js) fs.writeFileSync(path.resolve(js), JSON.stringify(r, null, 1) + '\n');
  process.exit(0);
}
