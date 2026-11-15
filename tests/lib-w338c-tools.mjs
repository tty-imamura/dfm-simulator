// 第338便c(原仮定者の指示(2026-11-15 —— 第139報)・統括の検証項目 R351): **統合の道具の純関数**(tools/jsonpaths337f.mjs --compare・tools/regen-chain.mjs --check-order・
//   tools/qa-touched338c.mjs と QA lint.jsonCompare338c・lint.checkOrderAdded338c・lint.qaTouched338c が呼ぶ —— ファイルを読まない・状態を持たない)。
//   ① 正本の値の比べで来歴の欄を除く(列ごとの合流の鍵・壁時計・持ち越しの刻印 —— html の sha が変わる便で必ず違う欄)
//   ② 鎖の後に足した段を、鎖の順序の検査の「下流が走っていない」から分ける(鎖の計画の段の一覧 —— timeline の `# chain-steps` 行か、鎖を作った rev の表の段の名)
//   ③ 既存の QA の鍵のブロックの本文の書き換えを拾う(基点の rev の qa.mjs と今の qa.mjs —— 最上位の文の単位で比べる)
export const LIB_VERSION = 'w338c-tools-lib-1';

/* ───────── ① 来歴の欄 ───────── */
/** 来歴の欄(物理の値でない —— 走行の時刻・対象 html の sha・合流の鍵から決まる)。名は鍵の名(どの深さでも)・carried の中の名 */
export const PROV_KEYS_338C = Object.freeze({ anyDepth: Object.freeze(['mergeKey', 'wallSec']), underCarried: Object.freeze(['fromGeneratedAt', 'fromTargetSha256']) });
/** J の写しから来歴の欄を除く。戻り値 { value, removed: { 欄の名(carried の中は carried.名): 数 } } */
export function stripProvenance338c(J, keys = PROV_KEYS_338C) {
  const removed = {};
  const note = (k) => { removed[k] = (removed[k] || 0) + 1; };
  const w = (o, parentKey) => {
    if (Array.isArray(o)) return o.map((x) => w(x, null));
    if (!o || typeof o !== 'object') return o;
    const out = {};
    for (const k of Object.keys(o)) {
      if (keys.anyDepth.includes(k)) { note(k); continue; }
      if (parentKey === 'carried' && keys.underCarried.includes(k)) { note('carried.' + k); continue; }
      out[k] = w(o[k], k);
    }
    return out;
  };
  return { value: w(J, null), removed };
}
/** 比べの自己試験: shaOf(J) = 物理の値の hash(tools は lib-w323b-quick の physSha)。来歴の欄だけが違う写し → same・数値の欄が違う写し → diff */
export function compareSelfTest338c(shaOf) {
  const J = { meta: { generatedAt: 'x' }, rows: { a1: { val: 1.25, mergeKey: 'k-old', carried: { mark: '転記', fromGeneratedAt: 't0', fromTargetSha256: 'aa' }, timing: { wallSec: 3 } } }, n: 2 };
  const P = JSON.parse(JSON.stringify(J)); P.rows.a1.mergeKey = 'k-new'; P.rows.a1.carried.fromGeneratedAt = 't1'; P.rows.a1.carried.fromTargetSha256 = 'bb'; P.rows.a1.timing.wallSec = 9;
  const N = JSON.parse(JSON.stringify(J)); N.rows.a1.val = 1.2500001;
  const M = JSON.parse(JSON.stringify(J)); M.rows.a1.carried.mark = '別';
  const sa = (x) => shaOf(stripProvenance338c(x).value);
  const G = {
    provOnlySame: sa(J) === sa(P), numDiff: sa(J) !== sa(N), carriedOtherKept: sa(J) !== sa(M),
    rawDiffers: shaOf(J) !== shaOf(P),
    removedListed: JSON.stringify(Object.keys(stripProvenance338c(P).removed).sort()) === JSON.stringify(['carried.fromGeneratedAt', 'carried.fromTargetSha256', 'mergeKey', 'wallSec']),
  };
  return { version: LIB_VERSION, ok: Object.values(G).every(Boolean), gates: G };
}

/* ───────── ② 鎖の後に足した段 ───────── */
/** timeline の `# chain-steps <段…>` 行(鎖のシェルが書く —— 第338便c から)を回ごとに読む。無ければ null */
export function chainStepsOfTimeline338c(text) {
  const m = /^# chain-steps (.*)$/m.exec(String(text || ''));
  return m ? m[1].trim().split(/\s+/).filter(Boolean) : null;
}
/** 表の本文(tests/lib-w281a-regentable.mjs)から段の名(`S('<段>'`)を読む —— 鎖を作った rev の表の段の一覧(履歴の生成段は数えない) */
export function stepKeysOfTableSource338c(src) {
  return [...new Set([...String(src || '').matchAll(/^\s*S\('([^']+)'/mg)].map((m) => m[1]))];
}
/** 下流の欠落(checkOrder の downstream)を、鎖の計画に在った段(missing —— 従来の違反)と、鎖の計画に無かった段(added —— 鎖の後に統合で足した段)に分ける */
export function splitAdded338c(downstream, planned) {
  const P = planned instanceof Set ? planned : new Set(planned || []);
  const added = [], missing = [];
  for (const z of downstream || []) (P.has(z.step) ? missing : added).push(z);
  return { added, missing };
}
/** 自己試験: 依存 a → b → c・a → d。鎖の計画 {a, b, c}(d は鎖の後に足した段)。列 a, b, c → d だけが added・rc 0 の扱い/列 a, b → c は missing(従来の違反) */
export function checkOrderAddedSelfTest338c(checkOrder) {
  const deps = new Map([['a', new Set()], ['b', new Set(['a'])], ['c', new Set(['b'])], ['d', new Set(['a'])]]);
  const planned = new Set(['a', 'b', 'c']);
  const r1 = checkOrder(['a', 'b', 'c'], { deps }), s1 = splitAdded338c(r1.downstream, planned);
  const r2 = checkOrder(['a', 'b'], { deps }), s2 = splitAdded338c(r2.downstream, planned);
  const r3 = checkOrder(['b', 'a', 'c'], { deps }), s3 = splitAdded338c(r3.downstream, planned);
  const tl = '# ready-queue 2026-11-15T00:00:00Z lanes=4\n# chain-steps a b c\nstart a 1 1\nend a 0 2\n';
  const keys = stepKeysOfTableSource338c("  S('a', 'node x', []);\n  S('b', 'node y', []);\n// S('z' はコメント\n  S('a', 'dup', []);");
  const G = {
    addedOnly: s1.added.map((z) => z.step).join(',') === 'd' && s1.missing.length === 0 && r1.order.length === 0,
    missingKept: s2.missing.map((z) => z.step).sort().join(',') === 'c' && s2.added.map((z) => z.step).join(',') === 'd',
    orderStill: r3.order.length > 0,
    timelineLine: JSON.stringify(chainStepsOfTimeline338c(tl)) === JSON.stringify(['a', 'b', 'c']) && chainStepsOfTimeline338c('start a 1 1\n') === null,
    tableKeys: JSON.stringify(keys) === JSON.stringify(['a', 'b']),
  };
  return { version: LIB_VERSION, ok: Object.values(G).every(Boolean), gates: G };
}

/* ───────── ③ 既存の QA の鍵のブロックの書き換え ───────── */
/** qa.mjs の本文 → 鍵 → その鍵の `add('<鍵>'` を含む最上位の文の本文(splitTopLevel —— tests/lib-w279b-qaorder.mjs)。コメントの行の add は数えない */
export function keyBlocks338c(src, splitTopLevel) {
  const lines = String(src).split('\n'), units = splitTopLevel(String(src)), out = new Map();
  lines.forEach((l, i) => {
    if (/^\s*\/\//.test(l)) return;
    for (const m of l.matchAll(/(?<![\w$.])add\('([^'\s]+)'/g)) {
      if (out.has(m[1])) continue;
      const u = units.find((z) => z.l0 - 1 <= i && i <= z.l1 - 1);
      out.set(m[1], u ? { l0: u.l0, l1: u.l1, text: lines.slice(u.l0 - 1, u.l1).join('\n') } : { l0: i + 1, l1: i + 1, text: l });
    }
  });
  return out;
}
/** 行の差(最長共通部分列 —— 消えた行 −・足した行 +) */
export function lineDiff338c(a, b) {
  const A = String(a).split('\n'), B = String(b).split('\n');
  let p = 0; while (p < A.length && p < B.length && A[p] === B[p]) p++;
  let q = 0; while (q < A.length - p && q < B.length - p && A[A.length - 1 - q] === B[B.length - 1 - q]) q++;
  const a2 = A.slice(p, A.length - q), b2 = B.slice(p, B.length - q), n = a2.length, m = b2.length;
  if (!n || !m) return { minus: n, plus: m };
  if (n * m > 4e7) return { minus: n, plus: m, approx: true };
  let prev = new Uint32Array(m + 1), cur = new Uint32Array(m + 1);
  for (let i = 1; i <= n; i++) { for (let j = 1; j <= m; j++) cur[j] = a2[i - 1] === b2[j - 1] ? prev[j - 1] + 1 : Math.max(prev[j], cur[j - 1]); [prev, cur] = [cur, prev]; }
  const lcs = prev[m];
  return { minus: n - lcs, plus: m - lcs };
}
/** 基点の本文と今の本文 → { touched: [{ key, minus, plus, shared }], added: [鍵], removed: [鍵], same }(shared = 同じ最上位の文に入っている鍵の数) */
export function touchedKeys338c(baseSrc, headSrc, splitTopLevel) {
  const B = keyBlocks338c(baseSrc, splitTopLevel), H = keyBlocks338c(headSrc, splitTopLevel);
  const touched = [], added = [], removed = [], cache = new Map(); let same = 0;
  const sharedIn = (M, blk) => [...M.values()].filter((z) => z.text === blk.text).length;
  for (const [k, b] of B) {
    const h = H.get(k);
    if (!h) { removed.push(k); continue; }
    if (h.text === b.text) { same++; continue; }
    const ck = b.text + '\u0000' + h.text;
    if (!cache.has(ck)) cache.set(ck, lineDiff338c(b.text, h.text));
    touched.push(Object.assign({ key: k, line: h.l0, shared: sharedIn(H, h) }, cache.get(ck)));
  }
  for (const k of H.keys()) if (!B.has(k)) added.push(k);
  return { touched, added, removed, same };
}
/** 自己試験(缶詰の qa.mjs 3 版) */
export function qaTouchedSelfTest338c(splitTopLevel) {
  const base = ["// 頭", "{", "  add('a.one', x === 1, 'a');", "}", "", "{", "  const y = 2;", "  add('b.two', y === 2, 'b');", "  add('b.three', true, 'b3');", "}", "{", "  // add('c.cmt' はコメント", "  add('c.four', true, 'c');", "}", ""].join('\n');
  const head = ["// 頭", "{", "  add('a.one', x === 1, 'a');", "}", "", "{", "  const y = 3;", "  add('b.two', y === 3, 'b');", "  add('b.three', true, 'b3');", "}", "{", "  // add('c.cmt' はコメント", "  add('c.four', true, 'c');", "}", "{", "  add('d.new', true, 'd');", "}", ""].join('\n');
  const r = touchedKeys338c(base, head, splitTopLevel), t = Object.fromEntries(r.touched.map((z) => [z.key, z]));
  const G = {
    touched: r.touched.map((z) => z.key).sort().join(',') === 'b.three,b.two',
    lines: t['b.two'] && t['b.two'].minus === 2 && t['b.two'].plus === 2 && t['b.two'].shared === 2,
    added: r.added.join(',') === 'd.new', removed: r.removed.length === 0, same: r.same === 2,
    comment: !keyBlocks338c(base, splitTopLevel).has('c.cmt'),
    lcs: JSON.stringify(lineDiff338c('a\nb\nc\nd', 'a\nx\nc\nd\ne')) === JSON.stringify({ minus: 1, plus: 2 }),
  };
  return { version: LIB_VERSION, ok: Object.values(G).every(Boolean), gates: G };
}
