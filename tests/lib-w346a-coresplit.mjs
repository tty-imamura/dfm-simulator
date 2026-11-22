// 第346便a(原仮定者の回答(2026-11-21 —— 第145報の回答 2)「AN931: Bで進める」・統括の検証項目 R397)
// —— **中心の関数の直し(C1)の戻り止め —— 純関数**(QA lint.coreSplit346a が使う)。
//
// ■ 直し C1(PHYSICS〔第346便a〕③): `S._core` の ③ E6′ 反作用の対のループの本体(`if(kFrame>0 && anyDp){ … }` の中身 97 行)を、
//   同じ文字のまま、トップレベルの関数 `reactionPass(…)` へ移した(式・順序・読み書きは同じ —— 移しただけ)。
//   この lib は、その「移しただけ」を記録の hash で見張る:
//   ① html に `function reactionPass(` が 1 つ在る。② `S._core` の本文(注を除く)が `reactionPass(` を 1 回だけ呼ぶ。
//   ③ `reactionPass` の本体の**正規化した文字**の sha256 が、宣言 tests/data-w346a-coresplit.json の値と同じ。
//      宣言の値は、直す前の html(第345便の最後の beta)の `S._core` の中の塊(`if(kFrame>0 && anyDp){` の波括弧の中)を
//      同じ正規化で数えたもの(= 逐語の移し替えの記録)。直す前の html が手元に在れば、そこからも同じ値になることを見る。
// ■ 正規化(固定する): 行コメント・ブロックコメントを除く(文字列の中は除かない —— tests/lib-core-budget.mjs の stripComments)→
//   連続する空白を半角空白 1 つに畳む → 前後の空白を落とす。字下げの違い(_core の中は 6 字・関数の中は 2 字)は数に入らない。
// ■ しないこと: ブラウザを起こさない・ファイルを読まない(html の文字は呼ぶ側が渡す)。
//   字数や hash は「最適化が通るか」の門ではない(図の上限は測っていない —— PHYSICS〔第346便a〕④)。
import crypto from 'node:crypto';
import { stripComments, extractCoreSource } from './lib-core-budget.mjs';

export const CORESPLIT_LIB_VERSION_346A = 'w346a-coresplit-lib-1';
export const CORESPLIT_DECL_FILE_346A = 'tests/data-w346a-coresplit.json';
export const REACTION_FN_TOKEN = 'function reactionPass(';
export const REACTION_BLOCK_TOKEN = 'if(kFrame>0 && anyDp){';
export const REACTION_CALL_RE = /\breactionPass\s*\(/g;

/** 波括弧の対応で、src[open] = '{' から対応する '}' までの中身(両端の括弧を除く)を返す。src は注を除いた文字(文字列の中の括弧は数えない) */
export function braceBody(src, open) {
  if (src[open] !== '{') return null;
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    const c = src[i];
    if (c === '"' || c === "'" || c === '`') {
      const q = c; i++;
      while (i < src.length) { if (src[i] === '\\') { i += 2; continue; } if (src[i] === q) break; i++; }
      continue;
    }
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) return src.slice(open + 1, i); }
  }
  return null;
}
export const normalizeBody = (s) => String(s).replace(/\s+/g, ' ').trim();
export const sha256 = (s) => crypto.createHash('sha256').update(String(s), 'utf8').digest('hex');

/** 直した html の `reactionPass` の本体(正規化済み)と引数の並び。無ければ found=false */
export function reactionPassBody(html) {
  const H = String(html), n = H.split(REACTION_FN_TOKEN).length - 1, at = H.indexOf(REACTION_FN_TOKEN);
  if (at < 0) return { found: false, count: 0, reason: REACTION_FN_TOKEN + ' が無い' };
  const s = stripComments(H.slice(at));
  const pc = s.indexOf(')'), args = s.slice(REACTION_FN_TOKEN.length, pc).split(',').map((x) => x.trim());
  const body = braceBody(s, s.indexOf('{', pc));
  if (body === null) return { found: false, count: n, reason: 'reactionPass の波括弧が閉じていない' };
  const norm = normalizeBody(body);
  return { found: true, count: n, args, chars: norm.length, sha256: sha256(norm), norm };
}
/** 直す前の html の `S._core` の中の ③ の塊(`if(kFrame>0 && anyDp){` の中身 —— 正規化済み) */
export function baseBlockBody(html) {
  const ex = extractCoreSource(String(html));
  if (!ex.found) return { found: false, reason: ex.reason };
  const at = ex.source.indexOf(REACTION_BLOCK_TOKEN);
  if (at < 0) return { found: false, reason: REACTION_BLOCK_TOKEN + ' が S._core に無い' };
  const body = braceBody(ex.source, at + REACTION_BLOCK_TOKEN.length - 1);
  if (body === null) return { found: false, reason: '塊の波括弧が閉じていない' };
  const norm = normalizeBody(body);
  return { found: true, chars: norm.length, sha256: sha256(norm), norm };
}
/** `S._core` の本文(注を除く)の中の `reactionPass(` の呼び出しの数と、③ の塊がまだ中に在るか */
export function coreCalls(html) {
  const ex = extractCoreSource(String(html));
  if (!ex.found) return { found: false, calls: null, inlineBlock: null, reason: ex.reason };
  return { found: true, calls: (ex.source.match(REACTION_CALL_RE) || []).length, inlineBlock: ex.source.indexOf(REACTION_BLOCK_TOKEN) >= 0 };
}

/** 判定(宣言 decl = tests/data-w346a-coresplit.json の中身・base は直す前の html の文字か null) */
export function assessCoreSplit(html, decl, base) {
  const bad = [];
  const r = reactionPassBody(html), c = coreCalls(html);
  if (!r.found) bad.push('① ' + r.reason);
  else if (r.count !== 1) bad.push('① function reactionPass( が ' + r.count + ' か所');
  if (!c.found) bad.push('② S._core が無い');
  else {
    if (c.calls !== 1) bad.push('② S._core の reactionPass( の呼び出し ' + c.calls + ' 回(1 回のはず)');
    if (c.inlineBlock) bad.push('② S._core の中に ③ の塊(' + REACTION_BLOCK_TOKEN + ')がまだ在る');
  }
  const D = decl || {};
  if (r.found) {
    if (r.sha256 !== D.bodySha256) bad.push('③ reactionPass の本体の hash が宣言と違う(' + r.sha256.slice(0, 12) + ' ≠ ' + String(D.bodySha256).slice(0, 12) + ')');
    if (r.chars !== D.bodyChars) bad.push('③ reactionPass の本体の字数が宣言と違う(' + r.chars + ' ≠ ' + D.bodyChars + ')');
    if (JSON.stringify(r.args) !== JSON.stringify(D.args)) bad.push('③ reactionPass の引数の並びが宣言と違う');
  }
  let baseRes = null;
  if (typeof base === 'string') {
    baseRes = baseBlockBody(base);
    if (!baseRes.found) bad.push('④ 直す前の html: ' + baseRes.reason);
    else if (baseRes.sha256 !== D.bodySha256) bad.push('④ 直す前の html の塊の hash が宣言と違う');
  }
  return { ok: bad.length === 0, bad, body: r.found ? { chars: r.chars, sha256: r.sha256, args: r.args } : null, calls: c.calls, base: baseRes ? { found: baseRes.found, chars: baseRes.chars, sha256: baseRes.sha256 } : null };
}

/** 変異(どれも落ちるはず): 本体の 1 字・呼び出しを 2 回・呼び出しを消す・関数を消す・引数の順・塊を _core に戻す */
export function mutants(html) {
  const H = String(html), at = H.indexOf(REACTION_FN_TOKEN);
  const call = 'if(kFrame>0 && anyDp) reactionPass(';
  const ci = H.indexOf(call);
  const fnAt = at, body0 = H.indexOf('accVx.fill(0,0,n);', fnAt);
  return [
    ['本体の 1 字(fill の 0 → 1)', body0 >= 0 ? H.slice(0, body0) + 'accVx.fill(1,0,n);' + H.slice(body0 + 'accVx.fill(0,0,n);'.length) : null],
    ['呼び出しを 2 回', ci >= 0 ? H.slice(0, ci) + call + 'S,n,m,x,y,vx,vy,spin,pinned,dpx,dpy,pairD,sumW,Imom,accVx,accVy,accS,bgW,eps2,hkOn,cplSink); ' + H.slice(ci) : null],
    ['呼び出しを消す', ci >= 0 ? H.slice(0, ci) + 'if(false) void(' + H.slice(ci + call.length) : null],
    ['関数の名を変える', at >= 0 ? H.slice(0, at) + 'function reactionPassX(' + H.slice(at + REACTION_FN_TOKEN.length) : null],
    ['引数の順(n と m)', at >= 0 ? H.slice(0, at) + REACTION_FN_TOKEN + 'S,m,n' + H.slice(at + REACTION_FN_TOKEN.length + 'S,n,m'.length) : null],
    ['塊を _core に戻す', ci >= 0 ? H.slice(0, ci) + REACTION_BLOCK_TOKEN + ' } ' + H.slice(ci) : null],
  ];
}
export function probeCoreSplit(html, decl) {
  const res = mutants(html).map(([nm, h]) => ({ nm, ok: h !== null && !assessCoreSplit(h, decl, null).ok }));
  return { ok: res.every((x) => x.ok), res };
}
