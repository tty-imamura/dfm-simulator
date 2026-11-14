// 第337便f(原仮定者の指示(恒久)「サンプルの変更だけでは、全行程を再実行しない」・決断事項 AN702・統括の検証項目 R342 —— 道具)—
//   **上流の正本の入力の指紋を「読む部分(JSON の経路)」に絞る**ための小さな lib(器が import する —— 本文はなるべく変えない:
//   変えると、この lib を code[] に持つ器の正本が全部走り直す)。
//
// ■ 何をするか
//   ・器は上流の正本(tests/out/*.json)を `jr337fRead(root, decl)` で読む。返る `data` は**読み取りを記録する包み**(Proxy —— 値は元の JSON と同じ・
//     書き込みは記録して通す)。器は今までどおり `data.transfer.table.find(…)` のように読む。
//   ・器は正本を書く直前に `jr337fMeta()` を meta へ足す(`meta.jsonRead337f`):
//       { version, rows: [{ file, decl, declSha256, pathsSha256, picked, unsafe, readPaths, outside }] }
//     pathsSha256 = 宣言した経路の部分木だけを正規化した hash(読んだ時点の JSON から)・readPaths = 器が実際に読んだ経路(正規化した Pointer)・
//     outside = 宣言の外を読んだ経路(空でなければ QA が FAIL・計画は再利用しない)。
//   ・計画(tests/lib-w281a-regentable.mjs の planRegen)と QA(lint.provenanceMeta ほか)は `pathsInputCheck337f` で、入力のファイルの sha も安定 hash も
//     違うとき、刻印の経路の指紋が今のファイルで同じなら再利用にする。
//
// ■ 宣言(器の本文に 1 行の JSON —— `const JSON_READ_337F = [...]`。宣言を変える = 器の本文が変わる = 次の鎖で 1 回走る〔初回は走らせる〕)
//   { file: 上流の正本の相対パス, paths: [JSON Pointer(RFC 6901)+ 1 段の任意 `*`],
//     keyed?: { 配列の Pointer: id の欄の名 }(その配列は位置でなく id の欄で引く —— 並べ替えに強い・重複や欠けは走らせる側),
//     optional?: [paths のうち、無くてよい経路](無いことも指紋に入る —— どこまで在ったかの深さつき),
//     exclude?: [部分木の中で除く Pointer](上流の安定 hash の除外の宣言〔volatilePaths〕が読む経路の内側に在るときに写す —— 計画が照合する) }
//
// ■ 安全側の規則(迷う型は「走らせる側」—— 誤って再利用すると古い正本が残る)
//   経路が無い(optional でない)・途中が数や文字で降りられない(型が違う)・keyed の配列が配列でない・要素が object でない・id の欄が欠ける/重複する
//   → 指紋は作らない(unsafe —— 計画は走らせる)。位置で読む配列は Pointer に添字が入るので、並べ替えれば指紋が変わる(走らせる)。
//   値の型は正規化の JSON に入る(1 と "1" は違う)。宣言の形が壊れている(知らない鍵・Pointer でない)→ unsafe。
//   刻印の時に unsafe だった行・宣言の外を読んだ行・版が違う行 → 再利用しない。
//
// ■ 言わないこと
//   ・「経路の指紋が同じなら器の正本は同じ」(器が宣言どおりに読むという前提 —— だから実際に読んだ経路を記録して宣言と照合する。
//     ファイル全体のバイトの sha を来歴として写す器〔charon の族の obsSha256 ほか〕は、再利用のとき前の刻印のまま —— 来歴の欄で物理の値ではない)。
//   ・「Proxy の記録で全部の読みが取れる」(JSON.parse の前のバイトを読む読み〔sha256 の来歴〕は記録の外 —— 来歴の欄として扱う)。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export const JSONREAD_VERSION_337F = 'w337f-jsonpaths-1';
const DECL_KEYS = ['file', 'paths', 'keyed', 'optional', 'exclude', 'note'];
/** 記録の擬似の段(配列の長さ・object の鍵の列挙・書き込み)。 */
export const PSEUDO_337F = Object.freeze({ length: '#length', keys: '#keys', write: '#write' });
const IGNORE_PROPS = new Set(['toJSON', 'then', 'constructor', '__proto__', 'valueOf', 'toString', 'inspect', 'asymmetricMatch', '$$typeof', 'nodeType']);

const sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex');
/** 正規化の JSON(鍵を並べる・有限でない数は文字)。 */
export function canon337f(v) {
  const walk = (x) => {
    if (x === undefined) return null;
    if (typeof x === 'number') return Number.isFinite(x) ? x : 'num:' + String(x);
    if (x === null || typeof x !== 'object') return x;
    if (Array.isArray(x)) return x.map(walk);
    const o = {};
    for (const k of Object.keys(x).sort()) o[k] = walk(x[k]);
    return o;
  };
  return JSON.stringify(walk(v));
}
/** RFC 6901 の Pointer → 段の列(`*` は 1 段の任意)。不正は null。 */
export function parsePtr337f(p) {
  if (typeof p !== 'string' || !p.startsWith('/')) return null;
  return p.slice(1).split('/').map((t) => t.replace(/~1/g, '/').replace(/~0/g, '~'));
}
export function fmtPtr337f(toks) { return '/' + toks.map((t) => String(t).replace(/~/g, '~0').replace(/\//g, '~1')).join('/'); }
const matchAll = (pat, cp) => pat.length === cp.length && pat.every((t, i) => t === '*' || t === cp[i]);
const prefixMatch = (pat, cp) => pat.length <= cp.length && pat.every((t, i) => t === '*' || t === cp[i]);

/** 宣言を正規化して形を照合する(壊れていれば ok:false)。 */
export function normDecl337f(decl) {
  const bad = (why) => ({ ok: false, why, decl: null });
  if (!decl || typeof decl !== 'object' || Array.isArray(decl)) return bad('宣言は object');
  for (const k of Object.keys(decl)) if (!DECL_KEYS.includes(k)) return bad('知らない鍵 ' + k);
  if (typeof decl.file !== 'string' || !/\.json$/.test(decl.file) || decl.file.startsWith('/')) return bad('file は相対パスの .json');
  if (!Array.isArray(decl.paths) || !decl.paths.length) return bad('paths は 1 つ以上');
  for (const p of decl.paths) if (!parsePtr337f(p) || p === '/') return bad('paths に Pointer でないもの ' + p);
  const keyed = decl.keyed === undefined ? {} : decl.keyed;
  if (!keyed || typeof keyed !== 'object' || Array.isArray(keyed)) return bad('keyed は object');
  for (const [p, f] of Object.entries(keyed)) { if (!parsePtr337f(p)) return bad('keyed の Pointer ' + p); if (typeof f !== 'string' || !f || f.startsWith('#')) return bad('keyed の欄の名 ' + p); }
  const optional = decl.optional === undefined ? [] : decl.optional, exclude = decl.exclude === undefined ? [] : decl.exclude;
  if (!Array.isArray(optional) || optional.some((p) => !decl.paths.includes(p))) return bad('optional は paths の部分集合');
  if (!Array.isArray(exclude) || exclude.some((p) => !parsePtr337f(p))) return bad('exclude は Pointer の列');
  const n = { file: decl.file, paths: [...new Set(decl.paths)].sort(), keyed: Object.fromEntries(Object.entries(keyed).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))),
    optional: [...new Set(optional)].sort(), exclude: [...new Set(exclude)].sort() };
  return { ok: true, why: null, decl: n, sha: sha256(canon337f(n)) };
}
const keyedPats = (nd) => Object.entries(nd.keyed).map(([p, f]) => [parsePtr337f(p), f]);
const keyFieldAt = (kps, cp) => { for (const [pt, f] of kps) if (matchAll(pt, cp)) return f; return undefined; };

class Unsafe337f extends Error {}
/** keyed の配列 → id の欄の値 → 要素(重複・欠け・型 → Unsafe)。 */
function keyedMap(x, f, cp) {
  if (!Array.isArray(x)) throw new Unsafe337f('型が違う: ' + fmtPtr337f(cp) + ' は keyed の配列のはず(' + (x === null ? 'null' : typeof x) + ')');
  const m = new Map();
  for (let i = 0; i < x.length; i++) {
    const e = x[i];
    if (!e || typeof e !== 'object' || Array.isArray(e)) throw new Unsafe337f('keyed の要素が object でない: ' + fmtPtr337f(cp.concat(String(i))));
    const k = e[f];
    if (!(typeof k === 'string' && k.length) && !Number.isFinite(k)) throw new Unsafe337f('keyed の id の欄 ' + f + ' が欠ける: ' + fmtPtr337f(cp.concat(String(i))));
    const ks = String(k);
    if (m.has(ks)) throw new Unsafe337f('keyed の id が重複: ' + fmtPtr337f(cp) + ' の ' + ks);
    m.set(ks, e);
  }
  return m;
}
/** 子の並び(token → 値)。数や文字・null は null(降りられない)。 */
function childrenOf(x, cp, kps) {
  const f = keyFieldAt(kps, cp);
  if (f !== undefined) return keyedMap(x, f, cp);
  if (Array.isArray(x)) return new Map(x.map((e, i) => [String(i), e]));
  if (x && typeof x === 'object') return new Map(Object.keys(x).map((k) => [k, x[k]]));
  return null;
}
/** 部分木の正規化(keyed の配列は id → 要素の object へ・exclude の Pointer は印へ)。 */
function normValue(x, cp, kps, exs) {
  if (exs.some((e) => matchAll(e, cp))) return '#excluded';
  const ch = childrenOf(x, cp, kps);
  if (ch === null) return x;
  const keyed = keyFieldAt(kps, cp) !== undefined;
  if (Array.isArray(x) && !keyed) return x.map((e, i) => normValue(e, cp.concat(String(i)), kps, exs));
  const o = {};
  for (const [k, v] of ch) o[k] = normValue(v, cp.concat(k), kps, exs);
  return keyed ? { '#keyed': o } : o;
}

/**
 * 経路の指紋(純関数): J = 上流の JSON・decl = 宣言。
 * @returns {{ok:boolean, why:string|null, sha:string|null, pairs:Array<[string, any]>, declSha:string|null}}
 */
export function pathsFingerprint337f(J, decl) {
  const nd = normDecl337f(decl);
  if (!nd.ok) return { ok: false, why: '宣言の形: ' + nd.why, sha: null, pairs: [], declSha: null };
  const kps = keyedPats(nd.decl), exs = nd.decl.exclude.map(parsePtr337f);
  const pairs = [];
  try {
    for (const p of nd.decl.paths) {
      const toks = parsePtr337f(p), found = [];
      let deepest = 0;
      const walk = (x, i, cp) => {
        if (i > deepest) deepest = i;
        if (i === toks.length) { found.push([cp, x]); return; }
        const ch = childrenOf(x, cp, kps);
        if (ch === null) return;   // 降りられない(型が違うか葉)
        const t = toks[i];
        if (t === '*') { for (const [k, v] of ch) walk(v, i + 1, cp.concat(k)); }
        else if (ch.has(t)) walk(ch.get(t), i + 1, cp.concat(t));
      };
      walk(J, 0, []);
      if (!found.length) {
        if (nd.decl.optional.includes(p)) { pairs.push([p, { '#absent': true, depth: deepest }]); continue; }
        throw new Unsafe337f('経路が無い(か途中の型が違う): ' + p + '(在ったのは ' + deepest + ' 段まで)');
      }
      for (const [cp, v] of found) pairs.push([fmtPtr337f(cp), normValue(v, cp, kps, exs)]);
    }
  } catch (e) {
    if (e instanceof Unsafe337f) return { ok: false, why: e.message, sha: null, pairs: [], declSha: nd.sha };
    throw e;
  }
  pairs.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
  return { ok: true, why: null, sha: sha256(canon337f({ v: JSONREAD_VERSION_337F, decl: nd.decl, pairs })), pairs, declSha: nd.sha };
}

/**
 * 読んだ経路 ⊆ 宣言 の照合(純関数)。読んだ経路は正規化した Pointer(keyed の配列の段は id の値)。
 *   覆う: 宣言の経路が前置になる(部分木の内側)/ keyed の配列の id の欄・長さ / `*` で全部の子を数える段の長さと鍵の列挙 / 部分木の内側の長さと鍵の列挙。
 * @returns {{ok:boolean, outside:string[]}}
 */
export function coverage337f(readPaths, decl) {
  const nd = normDecl337f(decl);
  if (!nd.ok) return { ok: false, outside: ['(宣言の形: ' + nd.why + ')'] };
  const kps = keyedPats(nd.decl), D = nd.decl.paths.map(parsePtr337f);
  const outside = [];
  for (const r of (readPaths || [])) {
    const t = parsePtr337f(r);
    if (!t) { outside.push(r); continue; }
    const last = t[t.length - 1];
    if (last === PSEUDO_337F.write) { outside.push(r); continue; }
    if (last === PSEUDO_337F.length || last === PSEUDO_337F.keys) {
      const A = t.slice(0, -1);
      const ok = (last === PSEUDO_337F.length && keyFieldAt(kps, A) !== undefined)
        || D.some((d) => prefixMatch(d, A))
        || D.some((d) => d.length > A.length && matchAll(d.slice(0, A.length), A) && d[A.length] === '*');
      if (!ok) outside.push(r);
      continue;
    }
    if (t.length >= 2 && keyFieldAt(kps, t.slice(0, -2)) === last) continue;   // keyed の id の欄
    if (!D.some((d) => prefixMatch(d, t))) outside.push(r);
  }
  return { ok: outside.length === 0, outside };
}

/** 上流の安定 hash の除外(volatilePaths —— 位置の `*`)が読む経路の内側に重なり、宣言の exclude に無いもの(計画と QA が照合 —— 重なれば走らせる側)。 */
export function volatileOverlap337f(decl, volatilePaths) {
  const nd = normDecl337f(decl);
  if (!nd.ok) return ['(宣言の形)'];
  const D = nd.decl.paths.map(parsePtr337f), ex = new Set(nd.decl.exclude);
  const compat = (a, b) => a.every((x, i) => i >= b.length || x === '*' || b[i] === '*' || x === b[i]);
  const out = [];
  for (const v of (volatilePaths || [])) {
    const vt = parsePtr337f(v);
    if (!vt || ex.has(v)) continue;
    if (D.some((d) => d.length <= vt.length && compat(d, vt))) out.push(v);
  }
  return out;
}

// ------------------------------------------------------------------ 器が使う読み口(読み取りの記録)
const registry337f = [];
/**
 * 上流の正本を読む(読み取りを記録する包み)。器は返る data を元の JSON と同じに読む。
 * @param {string} root リポジトリ root(絶対パス)
 * @param {object} decl 宣言(器の JSON_READ_337F の 1 行)
 * @returns {{data:any, raw:any, reads:Set<string>, decl:object, file:string}}
 */
export function jr337fRead(root, decl) {
  const file = decl && decl.file;
  const raw = JSON.parse(fs.readFileSync(path.join(root, String(file)), 'utf8'));
  const reads = new Set();
  const r = { data: recordingProxy337f(raw, decl, reads), raw, reads, decl, file };
  registry337f.push(r);
  return r;
}
/**
 * 読み取りを記録する包み(Proxy)。読んだ葉・無い欄の読み・配列の長さ(#length)・鍵の列挙(#keys)・書き込み(#write)を、正規化した Pointer
 * (keyed の配列の段は id の値)で reads に足す。値は元のまま返す(object は包んで返す)。
 */
export function recordingProxy337f(raw, decl, reads) {
  const nd = normDecl337f(decl);
  const kps = nd.ok ? keyedPats(nd.decl) : [];
  const cache = new WeakMap();
  const tokOf = (t, prop, cp) => {
    if (Array.isArray(t)) {
      const f = keyFieldAt(kps, cp);
      if (f !== undefined && /^\d+$/.test(prop)) { const e = t[Number(prop)]; const k = e && typeof e === 'object' ? e[f] : undefined; return (typeof k === 'string' && k) || Number.isFinite(k) ? String(k) : '#badkey'; }
    }
    return prop;
  };
  const wrap = (x, cp) => {
    if (x === null || typeof x !== 'object') return x;
    if (cache.has(x)) return cache.get(x);
    const pr = new Proxy(x, {
      get(t, prop, recv) {
        if (typeof prop === 'symbol') return Reflect.get(t, prop, recv);
        if (Array.isArray(t) && prop === 'length') { reads.add(fmtPtr337f(cp.concat(PSEUDO_337F.length))); return t.length; }
        if (!Object.prototype.hasOwnProperty.call(t, prop)) {
          const v = Reflect.get(t, prop, recv);
          if (typeof v === 'function' || IGNORE_PROPS.has(prop)) return v;
          reads.add(fmtPtr337f(cp.concat(prop)));   // 無い欄の読み(無いことを読んだ)
          return v;
        }
        const v = t[prop], ccp = cp.concat(tokOf(t, prop, cp));
        if (v !== null && typeof v === 'object') return wrap(v, ccp);
        reads.add(fmtPtr337f(ccp));
        return v;
      },
      has(t, prop) { if (typeof prop !== 'symbol') reads.add(fmtPtr337f(cp.concat(tokOf(t, String(prop), cp)))); return Reflect.has(t, prop); },
      ownKeys(t) { reads.add(fmtPtr337f(cp.concat(PSEUDO_337F.keys))); return Reflect.ownKeys(t); },
      set(t, prop, v) { reads.add(fmtPtr337f(cp.concat(PSEUDO_337F.write))); t[prop] = v; return true; },
      deleteProperty(t, prop) { reads.add(fmtPtr337f(cp.concat(PSEUDO_337F.write))); delete t[prop]; return true; },
      defineProperty(t, prop, d) { reads.add(fmtPtr337f(cp.concat(PSEUDO_337F.write))); return Reflect.defineProperty(t, prop, d); },
    });
    cache.set(x, pr);
    return pr;
  };
  return wrap(raw, []);
}
/** 記録の行(1 つの読み)。 */
export function jr337fRow(r) {
  const fp = pathsFingerprint337f(r.raw, r.decl), nd = normDecl337f(r.decl);
  const readPaths = [...r.reads].sort();
  const cov = coverage337f(readPaths, r.decl);
  return { file: r.file, decl: nd.ok ? nd.decl : r.decl, declSha256: nd.ok ? nd.sha : null, pathsSha256: fp.ok ? fp.sha : null, picked: fp.pairs.length,
    unsafe: fp.ok ? null : fp.why, readPaths, outside: cov.outside };
}
/**
 * 正本の meta へ足す欄(このプロセスで jr337fRead した読みの全部 —— 同じファイルを 2 回読んだら読みの記録を合わせる)。
 * @returns {{jsonRead337f:{version:string, rows:object[]}}}
 */
export function jr337fMeta(readers) {
  const list = readers || registry337f;
  const byFile = new Map();
  for (const r of list) {
    const k = r.file + '|' + canon337f(r.decl);
    if (!byFile.has(k)) byFile.set(k, { file: r.file, decl: r.decl, raw: r.raw, reads: new Set() });
    for (const p of r.reads) byFile.get(k).reads.add(p);
  }
  return { jsonRead337f: { version: JSONREAD_VERSION_337F, rows: [...byFile.values()].map(jr337fRow) } };
}

// ------------------------------------------------------------------ 計画と QA の照合
/**
 * 入力 file の経路の指紋の照合(計画 planRegen と QA が同じ関数)。meta に経路の刻印の行が無ければ applicable:false(従来どおり —— ファイル丸ごと)。
 * ok:true は「宣言した経路の部分木が刻印の時と同じ・刻印の時に宣言の外を読んでいない・安全側の規則に当たらない」。
 * @param {{root:string, meta:object, file:string, volatilePaths?:string[], text?:string}} o text は今のファイルの本文(試験の差し替え)
 * @returns {{applicable:boolean, ok:boolean, why:string|null}}
 */
export function pathsInputCheck337f(o) {
  const jr = o.meta && o.meta.jsonRead337f;
  if (!jr || !Array.isArray(jr.rows)) return { applicable: false, ok: false, why: null };
  const rows = jr.rows.filter((z) => z && z.file === o.file);
  if (!rows.length) return { applicable: false, ok: false, why: null };
  const no = (why) => ({ applicable: true, ok: false, why });
  if (jr.version !== JSONREAD_VERSION_337F) return no('経路の刻印の版 ' + jr.version + ' ≠ ' + JSONREAD_VERSION_337F);
  let J = null;
  try { J = JSON.parse(o.text !== undefined ? o.text : fs.readFileSync(path.join(o.root, o.file), 'utf8')); } catch { return no('今のファイルが読めない'); }
  for (const row of rows) {
    const nd = normDecl337f(row.decl);
    if (!nd.ok) return no('刻印の宣言の形: ' + nd.why);
    if (row.declSha256 !== nd.sha) return no('刻印の宣言の hash が宣言と合わない');
    if (!row.pathsSha256) return no('刻印の時に経路の指紋を作れなかった(' + (row.unsafe || '?') + ')');
    const cov = coverage337f(row.readPaths, row.decl);
    if ((row.outside && row.outside.length) || !cov.ok) return no('刻印の時に宣言の外を読んだ: ' + (row.outside && row.outside.length ? row.outside : cov.outside).slice(0, 2).join(','));
    const ov = volatileOverlap337f(row.decl, o.volatilePaths || []);
    if (ov.length) return no('上流の安定 hash の除外が読む経路の内側に在る(宣言の exclude に無い): ' + ov.slice(0, 2).join(','));
    const fp = pathsFingerprint337f(J, row.decl);
    if (!fp.ok) return no(fp.why);
    if (fp.sha !== row.pathsSha256) return no('読む経路の中身が刻印と違う');
  }
  return { applicable: true, ok: true, why: null };
}

// ------------------------------------------------------------------ 変異の試し(QA lint.jsonPathInputs337f が回す —— 純関数・一時ファイルなし)
/**
 * 上流の正本の写し(J)に変異を当て、刻印(元の J の指紋)に対して「再利用 / 走らせる」を引く。期待と違えば bad。
 * @param {any} J 上流の JSON(既定は小さな合成の正本)
 * @param {object} decl 位置で読む宣言と keyed の宣言の 2 本を内で作る(J が既定のとき)
 */
export function mutationSelfTest337f(J0) {
  const J = J0 || {
    meta: { generatedAt: '2026-11-14T00:00:00Z', scopeSha256: 'a'.repeat(64) },
    transfer: { table: [{ id: 'p1', h: 0.016, target: { value: 42.98, pn1: 42.98, a1: -0.002, recordId: 'R1' }, pred: 1 },
      { id: 'p2', h: 0.016, target: { value: 8.62, pn1: 8.62, a1: 0, recordId: 'R2' }, pred: 2 }] },
    timing: { T: { wallSec: 1.5 } },
  };
  const declPos = { file: 'tests/out/x.json', paths: ['/transfer/table/*/target/value', '/transfer/table/*/h'] };
  const declKey = { file: 'tests/out/x.json', keyed: { '/transfer/table': 'id' }, paths: ['/transfer/table/*/target/value', '/transfer/table/*/h'] };
  const declOpt = { file: 'tests/out/x.json', keyed: { '/transfer/table': 'id' }, paths: ['/transfer/table/p3/target', '/transfer/table/p1/target'], optional: ['/transfer/table/p3/target'] };
  const cl = () => JSON.parse(JSON.stringify(J));
  const judge = (decl, Jn) => {
    const a = pathsFingerprint337f(J, decl), b = pathsFingerprint337f(Jn, decl);
    if (!a.ok) return 'stamp-unsafe';
    return b.ok && b.sha === a.sha ? 'reuse' : 'run';
  };
  const M = (f) => { const x = cl(); f(x); return x; };
  const rows = [
    ['読まない経路を変える(meta・timing・pred)', declPos, M((x) => { x.meta.scopeSha256 = 'b'.repeat(64); x.timing.T.wallSec = 9; x.transfer.table[0].pred = 7; }), 'reuse'],
    ['読む経路を変える(target.value)', declPos, M((x) => { x.transfer.table[1].target.value = 8.63; }), 'run'],
    ['読む経路を 1 ulp 変える', declPos, M((x) => { x.transfer.table[0].target.value = 42.980000000000004; }), 'run'],
    ['経路を消す(h)', declPos, M((x) => { delete x.transfer.table[0].h; }), 'run'],
    ['型を変える(value を文字に)', declPos, M((x) => { x.transfer.table[0].target.value = '42.98'; }), 'run'],
    ['型を変える(target を数に —— 途中で降りられない)', declPos, M((x) => { x.transfer.table[0].target = 42.98; }), 'run'],
    ['配列を並べ替える(位置で読む宣言)', declPos, M((x) => { x.transfer.table.reverse(); }), 'run'],
    ['配列を並べ替える(id で引く宣言)', declKey, M((x) => { x.transfer.table.reverse(); }), 'reuse'],
    ['id が重複する(id で引く宣言)', declKey, M((x) => { x.transfer.table[1].id = 'p1'; }), 'run'],
    ['id の欄が欠ける(id で引く宣言)', declKey, M((x) => { delete x.transfer.table[1].id; }), 'run'],
    ['keyed の配列が object になる', declKey, M((x) => { x.transfer.table = { p1: x.transfer.table[0], p2: x.transfer.table[1] }; }), 'run'],
    ['行を 1 本足す(`*` で読む —— 数える集合が変わる)', declKey, M((x) => { x.transfer.table.push({ id: 'p9', h: 0.016, target: { value: 1 } }); }), 'run'],
    ['読まない欄を足す(行の中の新しい欄)', declKey, M((x) => { x.transfer.table[0].extra = 1; }), 'reuse'],
    ['無くてよい経路が現れる(optional)', declOpt, M((x) => { x.transfer.table.push({ id: 'p3', h: 0.016, target: { value: 3 } }); }), 'run'],
    ['無くてよい経路の親だけが現れる(optional の深さ)', declOpt, M((x) => { x.transfer.table.push({ id: 'p3', h: 0.016 }); }), 'run'],
    ['無くてよい経路が無いまま・読まない欄を変える', declOpt, M((x) => { x.transfer.table[1].target.value = 99; }), 'reuse'],
    ['値は同じで object の鍵の順だけ違う', declPos, M((x) => { const t = x.transfer.table[0].target; x.transfer.table[0].target = { recordId: t.recordId, a1: t.a1, pn1: t.pn1, value: t.value }; }), 'reuse'],
  ];
  const table = [], bad = [];
  for (const [name, decl, Jn, want] of rows) { const got = judge(decl, Jn); table.push({ name, want, got }); if (got !== want) bad.push(name + ' → ' + got + '(期待 ' + want + ')'); }
  // 宣言の形が壊れている → 指紋を作らない(走らせる側)
  for (const [name, d] of [['知らない鍵', { file: 'tests/out/x.json', paths: ['/a'], pathz: [] }], ['Pointer でない', { file: 'tests/out/x.json', paths: ['a/b'] }], ['optional が paths の外', { file: 'tests/out/x.json', paths: ['/a'], optional: ['/b'] }]]) {
    const f = pathsFingerprint337f(J, d); table.push({ name: '宣言の形: ' + name, want: 'run', got: f.ok ? 'reuse' : 'run' }); if (f.ok) bad.push('宣言の形 ' + name + ' で指紋を作った');
  }
  // 読みの記録と照合(包みの上で実際に読む)
  const tmpReads = (decl, fn) => { const reads = new Set(); fn(wrapForTest(J, decl, reads)); return coverage337f([...reads].sort(), decl); };
  const c1 = tmpReads(declKey, (d) => { const L = d.transfer.table.find((z) => z.id === 'p2'); return [L.target.value, L.h]; });
  table.push({ name: '読みの記録: find で id を引いて宣言の内を読む', want: 'inside', got: c1.ok ? 'inside' : 'outside' }); if (!c1.ok) bad.push('宣言の内の読みを外と判定: ' + c1.outside.join(','));
  const c2 = tmpReads(declKey, (d) => d.transfer.table[0].pred);
  table.push({ name: '読みの記録: 宣言の外(pred)を読む', want: 'outside', got: c2.ok ? 'inside' : 'outside' }); if (c2.ok) bad.push('宣言の外の読みを見落とした');
  const c3 = tmpReads(declKey, (d) => JSON.stringify(d.meta));
  table.push({ name: '読みの記録: meta を丸ごと読む', want: 'outside', got: c3.ok ? 'inside' : 'outside' }); if (c3.ok) bad.push('meta の丸ごとの読みを見落とした');
  const c4 = tmpReads(declPos, (d) => { d.transfer.table[0].target.value = 1; });
  table.push({ name: '読みの記録: 書き込み', want: 'outside', got: c4.ok ? 'inside' : 'outside' }); if (c4.ok) bad.push('書き込みを見落とした');
  return { version: JSONREAD_VERSION_337F, ok: bad.length === 0, bad, table };
}
/** 試験用の包み(登録簿に載せない —— 写しの上で器と同じ包み)。 */
function wrapForTest(raw, decl, reads) { return recordingProxy337f(JSON.parse(JSON.stringify(raw)), decl, reads); }
