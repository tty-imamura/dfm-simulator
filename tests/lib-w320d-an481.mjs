// 第320便d(決断事項 AN481・統括の検証項目 R265): **受理の鍵を足すとほぼ全段が動く型の調べ**(変異試験と候補の比べ —— 走らせない・正本を書かない・領域 hash の版は変えない)。
//
// ■ 何を調べるか
//   第319便a は受理器 validateAxisHoldMaintain の鍵の配列(REL_DRAG_AXIS_HOLD_MAINT_KEYS_319)と步の側の関数(inertialDrag3Maint*)を足し、宣言した全器の
//   領域 hash が動いた(鎖 regen 173)。候補の閉包の型ごとに、**1 つの最上位の段の本文だけを変える変異**で動く宣言の数を数える:
//     P0 現行(版 6 —— 停止集合 SCOPE_STOP・文の登録簿)
//     P1 validatePreset を丸ごと停止集合へ(**採らない** —— 決断事項 v79 §0 AN481 の対照。既存の拒否の条件の変更を見落とす)
//     P2 受理の鍵・値の表(*_KEYS・*_MODES …)を閉包の外の登録簿へ(文の登録簿 ACCEPT_REASONS と同じ型)
//     P4 実行した関数の閉包(器の走行の V8 の precise coverage —— 実行しなかった最上位の関数で閉包を止める)
//   変異(本文だけ・識別子は増やさない —— 閉包の集合は変わらないので「その段が閉包にある宣言」だけが動く。scopeHash は閉包の段の本文を並べた本文の sha):
//     m1key    使わない鍵を鍵の配列に足す(REL_DRAG_AXIS_HOLD_MAINT_KEYS_319)                → 望む: 再利用
//     m1guard  validatePreset に使わない鍵の門のブロックを足す(鍵が無ければ通らない)         → 望む: 再利用
//     m3reject 既存の拒否・丸めの条件を変える(validatePreset の camera.scale の上限)        → **要る: 再生成**(器が作る合成の本に効く)
//     m4step   步の側の関数を変える(inertialDrag3MaintStep)                               → 望む: その步を通る本を走らせる器だけ再生成
//   本の宣言の変更(m2 —— 宣言した本の生の定義・受理後の定義)は閉包の外の presets の部分で、どの候補でも宣言した器だけが動く(tests/lib-w320d-perbook.mjs の分類 book)。
//
// ■ しないこと: 領域 hash の版を上げない・停止集合を変えない(候補の比べだけ —— 実装は決断事項)。
import fs from 'node:fs';
import { parseTopLevel, readDeclaredScope, normalizeScope, closureOf, SCOPE_STOP, DATA_REGISTRIES, TEXT_REGISTRIES } from './lib-w281a-scope.mjs';

export const AN481_VERSION = 'w320d-an481-1';
/** 変異と、その変異で本文が変わる最上位の段。 */
export const MUTATIONS = Object.freeze({
  m1key: Object.freeze({ segs: ['REL_DRAG_AXIS_HOLD_MAINT_KEYS_319'], want: 'reuse', what: '使わない鍵を鍵の配列に足す' }),
  m1guard: Object.freeze({ segs: ['validatePreset'], want: 'reuse', what: 'validatePreset に使わない鍵の門のブロックを足す' }),
  m3reject: Object.freeze({ segs: ['validatePreset'], want: 'regen', what: '既存の拒否・丸めの条件を変える' }),
  m4step: Object.freeze({ segs: ['inertialDrag3MaintStep'], want: 'regen-users', what: '步の側の関数を変える' }),
});
/** 第319便a で本文が変わった・足された段(2c4df47 → 6bb6dc2 の beta —— 文の登録簿 I18N・ACCEPT_REASONS・版名・HP の公開の文を除く)。 */
export const W319A_ACCEPT = Object.freeze(['validateAxisHoldMaintain', 'REL_DRAG_AXIS_HOLD_MAINT_KEYS_319', 'REL_DRAG_AXIS_HOLD_COMPOSE', 'REL_DRAG_AXIS_HOLD_BALANCE',
  'REL_DRAG_AXIS_HOLD_SRC_VERSION', 'REL_DRAG_AXIS_HOLD_BALANCE_VERSION', 'REL_DRAG_AXIS_HOLD_SRC_LAST']);
export const W319A_STEP = Object.freeze(['INERTIAL_DRAG3_SC', 'INERTIAL_DRAG_CK_SAMPLES', 'SIM_STEP_SCRATCH', 'inertialDrag3MaintInit', 'inertialDrag3MaintStep', 'inertialDrag3MaintStateOf',
  'INERTIAL_DRAG3_MAINT_SRC_SC', 'inertialDrag3MaintSrcInit', 'inertialDrag3MaintGalaxyOf', 'axisHoldSourceSum', 'axisHoldComposeJudge', 'inertialDrag3MaintSrcBegin', 'inertialDrag3MaintSrcRow',
  'inertialDrag3MaintSrcAny', 'inertialDrag3MaintSrcRecv', 'inertialDrag3MaintSrcEnd', 'inertialDrag3Maint319Of', 'inertialDrag3MaintSourceOf']);
/** P2 の鍵・値の表(最上位の大文字の定数で、名が *_KEYS・*_MODES・*_KINDS・*_RULES・*_ALLOWED・*_COMPOSE・*_BALANCE —— 版の接尾 _NNN を許す)。 */
export const KEY_TABLE_RE = /^[A-Z][A-Z0-9_]*(_KEYS|_MODES|_KINDS|_RULES|_ALLOWED|_COMPOSE|_BALANCE)(_\d+)?$/;

const scriptOf = (htmlPath) => { const h = fs.readFileSync(htmlPath, 'utf8'); return h.slice(h.indexOf('<script>') + 8, h.lastIndexOf('</script>')); };
/** 宣言した器(tests/exp-*.mjs の REGEN_SCOPE)。 */
export function declaredScopes(root) {
  const out = [];
  for (const f of fs.readdirSync(root + '/tests').filter((x) => /^exp-.*\.mjs$/.test(x)).sort()) {
    const t = fs.readFileSync(root + '/tests/' + f, 'utf8'); if (t.indexOf('const REGEN_SCOPE = ') < 0) continue;
    const d = readDeclaredScope(t); if (d) out.push({ harness: 'tests/' + f, decl: normalizeScope(d) });
  }
  return out;
}
const rootsOf = (d) => d.roots.filter((r) => !TEXT_REGISTRIES.includes(String(r).replace(/^HP\./, '')));

/**
 * 変異試験の表(候補 P0/P1/P2 × 変異 → 動く宣言の数)と、閉包に入る段の数。
 * @param {{root:string, html:string}} o
 */
export function mutationTable(o) {
  const P = parseTopLevel(scriptOf(o.html));
  const decls = declaredScopes(o.root);
  const regs = DATA_REGISTRIES.concat(TEXT_REGISTRIES);
  const keyTables = [...new Set(P.segments.flatMap((s) => s.names))].filter((n) => KEY_TABLE_RE.test(n));
  const CAND = { P0: { regs, stop: SCOPE_STOP }, P1: { regs, stop: SCOPE_STOP.concat(['validatePreset']) }, P2: { regs: regs.concat(keyTables), stop: SCOPE_STOP } };
  const MUT = Object.assign({}, Object.fromEntries(Object.entries(MUTATIONS).map(([k, v]) => [k, v.segs])),
    { w319acc: W319A_ACCEPT.slice(), w319step: W319A_STEP.slice() });
  const table = {}, inClosure = {};
  for (const [c, opt] of Object.entries(CAND)) {
    const sets = decls.map(({ decl }) => new Set(closureOf(P, rootsOf(decl), opt.regs, { hardStop: opt.stop }).functions));
    inClosure[c] = Object.fromEntries(['validatePreset', 'validateAxisHoldMaintain', 'REL_DRAG_AXIS_HOLD_MAINT_KEYS_319', 'inertialDrag3MaintStep'].map((n) => [n, sets.filter((z) => z.has(n)).length]));
    for (const [m, segs] of Object.entries(MUT)) (table[m] = table[m] || {})[c] = sets.filter((z) => segs.some((n) => z.has(n))).length;
  }
  const missing = [...new Set(Object.values(MUT).flat())].filter((n) => !P.segments.some((s) => s.names.includes(n)));
  return { version: AN481_VERSION, decls: decls.length, keyTables: keyTables.length, inClosure, table, missing };
}

/**
 * P4 の調べ: html を headless で読み、本を受理・構築して N 步走らせた間の V8 の precise coverage(関数の粒度)から、実行した最上位の関数で止めた閉包を引く。
 * **呼ぶ側のプロセスで inspector を使う**(QA は子プロセスで呼ぶ —— tools/an481-probe.mjs)。
 * @param {{html:string, ids:string[], steps:number, roots:string[], watch?:string[]}} o
 */
export async function coverageClosure(o) {
  const inspector = await import('node:inspector');
  const { loadHtmlHeadless } = await import('./lib-w279b-headless.mjs');
  const sess = new inspector.Session(); sess.connect();
  const post = (m, p) => new Promise((res, rej) => sess.post(m, p || {}, (e, r) => (e ? rej(e) : res(r))));
  await post('Profiler.enable'); await post('Profiler.startPreciseCoverage', { callCount: true, detailed: false });
  const Lh = loadHtmlHeadless(o.html);
  let dt = null; try { dt = Number(Lh.evalExpr('typeof DT !== "undefined" ? DT : null')); } catch { dt = null; }
  if (!(dt > 0)) dt = 1 / 60;
  const ran = [];
  for (const id of o.ids) {
    const p = Lh.HP.allPresets().find((z) => z.id === id);
    if (!p) continue;
    const v = Lh.HP.validatePreset(JSON.parse(JSON.stringify(p)));
    if (!v || !v.ok) continue;
    Lh.HP.loadPreset(id, false);
    if ((Lh.HP.currentPreset() || {}).id !== id) continue;
    for (let i = 0; i < o.steps; i++) Lh.HP.sim.step(dt);
    if (!Lh.HP.sim.hasNaN()) ran.push(id);
  }
  const cov = await post('Profiler.takePreciseCoverage');
  await post('Profiler.stopPreciseCoverage'); sess.disconnect();
  const src = scriptOf(o.html);
  const P = parseTopLevel(src);
  const sc = cov.result.find((r) => r.url === o.html || r.url === 'file://' + o.html || String(r.url).endsWith(o.html));   // vm の filename は版で file:// が付く
  const exec = new Set();
  const segAt = (off) => { let lo = 0, hi = P.segments.length - 1; while (lo <= hi) { const m = (lo + hi) >> 1, s = P.segments[m]; if (off < s.start) hi = m - 1; else if (off >= s.end) lo = m + 1; else return m; } return -1; };
  for (const f of (sc ? sc.functions : [])) {
    const r = f.ranges[0];
    if (!r || r.count === 0 || (r.startOffset === 0 && r.endOffset >= src.length - 2)) continue;   // 最上位の script の本体は除く
    const k = segAt(r.startOffset); if (k >= 0) exec.add(k);
  }
  const regs = DATA_REGISTRIES.concat(TEXT_REGISTRIES);
  const isFn = (s) => /^\s*(async\s+)?function\b/.test(s.text);
  const stat = closureOf(P, o.roots, regs, { hardStop: SCOPE_STOP });
  const notExec = P.segments.flatMap((s, k) => (isFn(s) && !exec.has(k)) ? s.names : []);
  const dyn = closureOf(P, o.roots, regs, { hardStop: SCOPE_STOP.concat(notExec) });
  const sN = new Set(stat.functions), dN = new Set(dyn.functions);
  const fnN = (set) => [...set].filter((n) => { const s = P.segments.find((z) => z.names.includes(n)); return s && isFn(s); }).length;
  const bytes = (cl) => cl.segIdx.reduce((a, k) => a + P.segments[k].end - P.segments[k].start, 0);
  const watch = o.watch || [];
  return { coverage: !!sc, ran: ran.length, asked: o.ids.length, steps: o.steps, executedTopFns: exec.size,
    staticFns: fnN(sN), dynamicFns: fnN(dN), staticBytes: bytes(stat), dynamicBytes: bytes(dyn),
    inStatic: watch.filter((n) => sN.has(n)), inDynamic: watch.filter((n) => dN.has(n)) };
}
