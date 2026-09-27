// 第284便f(原仮定者の裁定(第74報)⑥「まだ時間が長いので改善する」・統括の検証項目 R94)—— **QA の確認順の段**。
//
// ■ 順序(試験は 1 つも減らさない・窓も短くしない —— 本走行は常に全件)
//   ① preflight(`QA_TIER=lint` —— 構文・読み取り専用 lint・全内蔵の受理/構築/1 步。tests/qa-preflight.mjs)
//   ② 前回 FAIL の先行再実行(`QA_REPLAY_FAIL` —— 第279便b)
//   ③ **変更に依存する短い試験**(`QA_CHANGED` —— 本 lib): 基点との差分で変わったファイルを**本文で名指しする**試験の文のうち、
//      長走行でないもの(W5b/W5c のプールに載る文・マニフェストの想定所要 ≥ 30 s は除く)を、②と同じ仕組み(選んだ文以外を空行に
//      した qa.mjs の版を別プロセスで)で先に走らせる。html(beta/index.html・index.html)と qa.mjs 自身は名指しの鍵にしない
//      (ほぼ全文が読む —— 絞り込みにならない)。
//   ④ 本走行(全件 —— 先頭の lint 群 → ブラウザ。重いブロックは W5c/W5b プール)
//   ⑤ 最終ゲート(本走行の結果 JSON の ALL PASS・件数)
//   ①〜⑤ を 1 本で回す薄いランナーは tools/qa-staged.mjs(worker 数・壁時計・メモリの記録つき)。
//
// ■ しないこと: 判定を変えない・試験を省かない(③は先に見るだけで、④が全件を走る)。
import { execFileSync } from 'node:child_process';
import path from 'node:path';

export const QA_STAGE_VERSION = 'w284f-qastage-1';
export const QA_STAGES = ['preflight', 'replay-fail', 'changed-short', 'full', 'final-gate'];
/** 名指しの鍵にしない(ほぼ全文が読む・または QA 本体)。 */
export const GENERIC_BASENAMES = ['index.html', 'qa.mjs', 'package.json', 'package-lock.json', 'qa-manifest.json'];
export const LONG_MS_DEFAULT = 30000;

/**
 * 基点との差分のファイル(コミット済みの差 + 作業木の変更 + 未追跡)。git が無ければ []。
 * @param {{root:string, base?:string}} o base 既定: origin/main との merge-base(無ければ HEAD)
 */
export function changedFiles(o) {
  const git = (args) => { try { return execFileSync('git', ['-C', o.root, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { return null; } };
  let base = o.base || null;
  if (!base) base = git(['merge-base', 'HEAD', 'origin/main']) || 'HEAD';
  const set = new Set();
  for (const out of [git(['diff', '--name-only', base]), git(['ls-files', '--others', '--exclude-standard'])]) {
    for (const f of String(out || '').split('\n')) if (f.trim()) set.add(f.trim());
  }
  return { base, files: [...set].sort() };
}

/** 変更ファイル → 名指しの鍵(ファイル名。汎用のものは除く)。 */
export function changeTokens(files) {
  return [...new Set((files || []).map((f) => path.basename(f)).filter((b) => b && !GENERIC_BASENAMES.includes(b)))].sort();
}

/**
 * 変更に依存する短い試験の文を選ぶ。
 * @param {Array} units lib-w279b-qaorder の splitTopLevel の戻り(isTestUnit で絞った試験の文)
 * @param {string[]} tokens changeTokens の戻り
 * @param {{unitIds:Function, classifyUnit:Function, manifestUnits?:Array, beta?:boolean, longMs?:number, exclude?:Set<number>, maxUnits?:number, maxMs?:number}} o
 * @returns {{selected:Array, long:Array, capped:Array, tokenHits:object}}
 */
export function unitsForChanged(units, tokens, o) {
  const longMs = o.longMs || LONG_MS_DEFAULT;
  const man = o.manifestUnits || [];
  const expOf = (u) => {
    const { ids, prefixes } = o.unitIds(u.text);
    let ms = null;
    for (const r of man) {
      const hit = (r.ids || []).some((x) => ids.includes(x)) || (r.prefixes || []).some((x) => prefixes.includes(x));
      if (!hit) continue;
      const v = o.beta ? r.expectedMsBeta : r.expectedMsRoot;
      if (Number.isFinite(v)) ms = Math.max(ms || 0, v);
      if (r.w5b || r.tier === 'pooled') ms = Math.max(ms || 0, longMs);
    }
    return ms;
  };
  const selected = [], long = [], tokenHits = {};
  for (const u of units) {
    if (o.exclude && o.exclude.has(u.l0)) continue;
    const hits = tokens.filter((t) => u.text.indexOf(t) >= 0);
    if (!hits.length) continue;
    for (const t of hits) tokenHits[t] = (tokenHits[t] || 0) + 1;
    const cls = o.classifyUnit(u);
    const ms = expOf(u);
    const row = { u, hits, ms, tier: cls.tier };
    if (cls.tier === 'pooled' || (ms !== null && ms >= longMs)) long.push(row); else selected.push(row);
  }
  selected.sort((a, b) => ((a.ms ?? 0) - (b.ms ?? 0)) || (a.u.l0 - b.u.l0));
  const maxUnits = o.maxUnits || 60, maxMs = o.maxMs || 240000;
  const keep = [], capped = [];
  let sum = 0;
  for (const r of selected) {
    if (keep.length < maxUnits && sum + (r.ms ?? 0) <= maxMs) { keep.push(r); sum += (r.ms ?? 0); } else capped.push(r);
  }
  keep.sort((a, b) => a.u.l0 - b.u.l0);
  return { selected: keep, long, capped, tokenHits, expectedMs: sum };
}

/** 自己試験(QA `lint.regenChain` ⑧ —— 合成の文で: 鍵の除外・長走行の除外・上限・行順)。 */
export function qaStageSelfTest(lib) {
  const mk = (l0, text) => ({ l0, l1: l0, kind: 'block', text });
  const units = [
    mk(10, "{ const x = 'tests/lib-w281a-regentable.mjs'; add('lint.a', true); }"),
    mk(20, "{ await w5bRun('K', 1); add('heavy.b', true, 'regen-chain.mjs'); }"),
    mk(30, "{ add('lint.c', true, 'index.html'); }"),
    mk(40, "{ add('lint.d', true, path.join(ROOT, 'tools', 'regen-chain.mjs')); }"),
    mk(50, "{ add('lint.e', true, 'lib-w281a-regentable.mjs'); }"),
  ];
  const toks = changeTokens(['tests/lib-w281a-regentable.mjs', 'tools/regen-chain.mjs', 'beta/index.html', 'tests/qa.mjs']);
  const classify = (u) => ({ tier: /w5bRun\(/.test(u.text) ? 'pooled' : 'lint', htmlDependent: false });
  const man = [{ ids: ['lint.e'], prefixes: [], expectedMsBeta: 45000 }];
  const r = unitsForChanged(units, toks, { unitIds: lib.unitIds, classifyUnit: classify, manifestUnits: man, beta: true, exclude: new Set([40]) });
  const got = r.selected.map((z) => z.u.l0);
  const res = { tokens: toks, selected: got, long: r.long.map((z) => z.u.l0),
    ok: JSON.stringify(toks) === JSON.stringify(['lib-w281a-regentable.mjs', 'regen-chain.mjs'])
      && JSON.stringify(got) === '[10]' && JSON.stringify(r.long.map((z) => z.u.l0).sort()) === '[20,50]' };
  const r2 = unitsForChanged(units, toks, { unitIds: lib.unitIds, classifyUnit: classify, manifestUnits: [], beta: true, maxUnits: 1 });
  res.cap = { selected: r2.selected.map((z) => z.u.l0), capped: r2.capped.map((z) => z.u.l0) };
  res.ok = res.ok && r2.selected.length === 1 && r2.capped.length === 2;
  return res;
}

export default { QA_STAGE_VERSION, QA_STAGES, GENERIC_BASENAMES, LONG_MS_DEFAULT, changedFiles, changeTokens, unitsForChanged, qaStageSelfTest };
