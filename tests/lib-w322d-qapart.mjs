// 第322便d(統括の検証項目 R273): QA の部分実行器 `tests/exp-w258c-qapart.mjs` の**切り出し**の純関数(本文は第258便c・第279便b・第296便・第319便の
//   qapart の実装を 1 字も変えずに移した —— 器と `tools/qa-keys.mjs` が**同じ関数**で範囲を取る)。
//
//   切り出し: 「`add('<id>'` を含む**最初の行**から、列 0 の `{` だけの行まで遡り(その上の列 0 のコメントの行を含む)、次の列 0 の `}` だけの行まで」。
//   W5b で関数宣言へ持ち上げたブロック(`await w5bRun('<key>', <ガード>); async function W5B_<key>(…) {`)は最上位の文の切り出し
//   (`tests/lib-w279b-qaorder.mjs` splitTopLevel)で範囲を取り、見出し行を `if (<ガード>) {` に戻す。
//   前文に写す世代定数: 最上位の 1 行の `const W\d{3}[A-Z]_… = …`(切り出した範囲に同じ行があれば外す)と、第284〜287便の複数行の範囲(W284_PSR_F1 … W284_CORE)。
//
// ■ 言わないこと
//   「切り出せた鍵は qapart で走る」(切り出しは行の範囲だけ —— 範囲が上流の局所の名前〔w5cGetUnit など〕を読めば ReferenceError になる。
//   `tools/qa-keys.mjs` がその鍵を外す)。

export const QAPART_LIB_VERSION = 'w322d-qapart-1';

/**
 * 切り出しの器を作る。
 * @param {string} qaSrc tests/qa.mjs の本文
 * @param {object} QO tests/lib-w279b-qaorder.mjs の import(splitTopLevel・w5bHeadKey)
 * @returns {{lines:string[], headRewrite:Map<number,string>, spanOf:(id:string)=>[number,number], mergeSpans:(spans:Array)=>Array, bodyOf:(merged:Array)=>string,
 *   constsOf:(merged:Array)=>string, consts284Of:(merged:Array)=>string}}
 */
export function qaSpanner(qaSrc, QO) {
  const lines = qaSrc.split('\n');
  const W5B_UNITS = QO.splitTopLevel(qaSrc).filter((u) => QO.w5bHeadKey(lines[u.l0 - 1]));
  const headRewrite = new Map();
  function spanOf(id) {
    const i = lines.findIndex((l) => l.includes("add('" + id + "'"));
    if (i < 0) throw new Error('QA ブロックが見つからない: ' + id);
    const wu = W5B_UNITS.find((u) => u.l0 - 1 <= i && i <= u.l1 - 1);
    if (wu) {
      const m = /^await w5bRun\('[\w$]+', ([^;]*)\); async function /.exec(lines[wu.l0 - 1]);
      headRewrite.set(wu.l0 - 1, `if (${m[1]}) {`);
      return [wu.l0 - 1, wu.l1];
    }
    let a = i;
    while (a >= 0 && lines[a].trimEnd() !== '{') a--;
    if (a < 0) throw new Error('列 0 の { が見つからない: ' + id);
    let c = a - 1;
    while (c >= 0 && lines[c].startsWith('//')) c--;
    let b = a + 1;
    while (b < lines.length && lines[b].trimEnd() !== '}') b++;
    if (b >= lines.length) throw new Error('対応する } が見つからない: ' + id);
    return [c + 1, b + 1];
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
  const bodyOf = (merged) => merged.map(([s0, e0]) => lines.slice(s0, e0).map((l, k) => headRewrite.get(s0 + k) ?? l).join('\n')).join('\n');
  // 第296便(統合): 最上位の 1 行の世代定数(切り出した範囲に同じ宣言があれば二重になるので外す)
  const constsOf = (merged) => lines.filter((l) => /^const W\d{3}[A-Z]_[A-Z0-9_]+ = /.test(l) && !merged.some(([s0, e0]) => lines.slice(s0, e0).includes(l))).join('\n');
  // 第319便(統括の統合 —— 枝 d の直し): 第284〜287便の複数行の世代定数(W284_PSR_F1 … W284_CORE)
  const consts284Of = (merged) => {
    const i284a = lines.findIndex((l) => l.startsWith('const W284_PSR_F1 = ')), i284b = lines.findIndex((l) => l.startsWith('const W284_CORE = '));
    return (i284a >= 0 && i284b >= i284a && !merged.some(([s0, e0]) => s0 <= i284a && i284a < e0)) ? lines.slice(i284a, i284b + 1).join('\n') : '';
  };
  return { lines, headRewrite, spanOf, mergeSpans, bodyOf, constsOf, consts284Of };
}

/** qapart の前文が用意する名前(切り出した範囲が上流の名前を読むかの照合に使う —— `tests/exp-w258c-qapart.mjs` の前文と同じ集合)。 */
export const QAPART_PRELUDE_NAMES = ['fs', 'crypto', 'path', 'execSync', 'createRequire', 'ROOT', 'TARGET', 'INDEX', 'PW_DIR', 'req', 'EXE', 'browser', 'page', 'pageErrors',
  'FAST', 'OUT_DIR', 'hasMerger', 'C_TRUE_286B', 'C4_286B', 'KAPPA4_286B', 'C5_286B', 'C7_286B', 'fpRun', 'results', 'lastAddAt', 'add'];

/**
 * 鍵の束(--batch N): 鍵を切り出しの範囲の順に並べ、**範囲が重なる鍵は同じ束**に入れて、束の鍵の数が N を超えないように分ける
 * (1 つの範囲に N を超える鍵があればその範囲だけで 1 束)。
 * @param {Array<{id:string, span:[number,number]}>} keyed
 * @param {number} n
 * @returns {string[][]}
 */
export function batchKeys(keyed, n) {
  const sorted = keyed.slice().sort((p, q) => p.span[0] - q.span[0] || p.span[1] - q.span[1]);
  // 重なる範囲を組にまとめる
  const groups = [];
  for (const k of sorted) {
    const g = groups[groups.length - 1];
    if (g && k.span[0] <= g.end) { g.ids.push(k.id); g.end = Math.max(g.end, k.span[1]); }
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

export default { QAPART_LIB_VERSION, qaSpanner, QAPART_PRELUDE_NAMES, batchKeys };
