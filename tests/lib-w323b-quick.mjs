// 第323便b(原仮定者の指示(2026-11-01)「再生成の段で毎回長時間掛かるのを改善する。今より半減が目標」「β版は、歩数を減らした簡易チェックでの一致確認で
//   済ませたり、複数便に再生成を分散する方式を検討する」・決断事項 AN517/AN518「推奨を採用」・統括の検証項目 R276)—— **β の簡易一致確認(quick-verify)の影**・
//   **窓の出力の指紋の記録**・**来歴 `meta.verify` の受理(β で受理・root で拒否)**。
//
// ■ 何をするか(本便は**影** —— 判定と記録だけ。鎖は今の通りフルで走る・正本はすべてフル)
//   ① `quickShadow(plan, o)` —— 再生成の計画(planRegen)の各段に `quick` の判定を足す。候補 = 次をすべて満たす段:
//        理由が「領域」だけ(planRegen の causeKinds が scope だけ —— 器・lib のコードと入力は同じ・領域の宣言の無い html 全体の段は外す)/
//        簡易一致を使わない段でない(AN518: 常時群・較正の判定を出す段〔表から導く —— calaudit を書く段・較正の器の段・calaudit を入力に読む段〕・
//        html の生成領域を書く段・履歴・手動・段の宣言 `quickVerify:false`・`quickVerify:'long'` の段で步の関数か受理器か S._core が変わった便)/
//        簡易の窓がある(段の宣言 `quickWindow` か煙試験の窓の表 SMOKE_KNOBS)/ 指紋の記録がある(窓の環境・器と lib の sha・正本の物理の値の hash が
//        記録と同じ)/ wavesSinceFull(この便を入れた数)< K / root 昇格の便でない。
//      輪番: 候補のうち ceil(n/K) 段をフルへ(前の wavesSinceFull の大きい順 → 便の番号の剰余と段の札〔key の hash の剰余〕が合う段 → 秒の大きい順。
//      600 s 以上の段は 1 便に QUICK_BIG_MAX 本まで —— 壁時計の床を散らす)。
//   ② 指紋 —— 窓の出力(と正本)から**物理の値の hash**(`physSha`): meta の全体・段の除外 Pointer(volatilePathsOf)・来歴と時刻の欄(SEMANTIC_RUN_META)・
//      どの階層でも実行時刻と壁時計の欄名(STABLE_RUNTIME_KEYS と旧方式の欄名 LEGACY_VOLATILE_KEYS と ms)と刻印・来歴の欄名(FP_STAMP_KEYS)を除いた正準 JSON の sha256。
//      記録(QUICK_FP_FILE —— コミットする作業記録・正本ではない)は段ごとに 窓の環境・指紋・窓の秒・器と lib の sha・html の sha・正本の物理の値の hash・便。
//      取り方は `node tools/harness-smoke.mjs --fingerprint <記録>`(煙試験の写しで窓を走らせる —— 鎖の後に 1 回)。
//   ③ 来歴 `meta.verify`(本運用の便で簡易一致で済ませた正本が持つ): `{mode:"quick", quickFingerprint:<64 桁>, fullRunAt:{wave, sha}, wavesSinceFull:n}`。
//      `verifyViolations(meta, {target})` —— β では形が正しければ受理・root では quick を拒否(root 昇格の便は全段フル —— 鎖で作り直す)。
//      lint.provenanceMeta・lint.canon304・lint.regenScope が呼ぶ(本便の正本は verify を持たない —— 判定は変わらない)。
//
// ■ 段の宣言の欄(段の行に値を書くのは枝 c と統括 —— 既定値で今の表がそのまま動く)
//   quickVerify?: false | 'long'  … false = 簡易一致を使わない(`quickVerifyWhy` に理由)/ 'long' = 長期の量(近点・周期・永年の窓)を出す段 ——
//                                    步の関数・受理器・S._core が変わった便では使わない / 無ければ既定の規則だけ
//   quickVerifyWhy?: string        … quickVerify:false の理由
//   quickWindow?: {env:{…}, note:string} … 簡易の窓(無ければ煙試験の窓の表 SMOKE_KNOBS の行)
//   afterOrderOnly?: string[] / afterData?: string[] … after の辺の種類の手の上書き(tests/lib-w281a-regentable.mjs の afterDepKinds)
//
// ■ 言わないこと: 「簡易の窓で一致したので物理が同じ」(窓は最初の数段だけ —— 輪番〔K 便以内にフル〕と root 昇格の便の全段フルで補う)・
//   「指紋の記録が無い段は簡易一致できない」以上のこと(記録が無ければ候補にしない —— 保守側)。
import fs from 'node:fs';
import crypto from 'node:crypto';
import { REGEN_STEPS, volatilePathsOf, SEMANTIC_RUN_META, codeFilesOf, writesOf, HTML_TARGET } from './lib-w281a-regentable.mjs';
import { canonJson, parseTopLevel, closureOf, SCOPE_STOP, STABLE_RUNTIME_KEYS, LEGACY_VOLATILE_KEYS } from './lib-w281a-scope.mjs';

export const QUICK_VERSION = 'w323b-quick-1';
export const QUICK_K_DEFAULT = 3;
export const QUICK_BIG_SEC = 600;
export const QUICK_BIG_MAX = 2;
export const QUICK_FP_FILE = 'tests/data-w323b-quickfp.json';
export const QUICK_FP_VERSION = 'w323b-quickfp-1';
export const VERIFY_VERSION = 'w323b-verify-1';
/** 段の宣言の欄の名前と型(枝 c と統括が段の行に書く —— 本枝は読み口と既定の規則)。 */
export const QUICK_DECL_FIELDS = Object.freeze({
  quickVerify: "false | 'long' | (無し)",
  quickVerifyWhy: 'string(quickVerify:false の理由)',
  quickWindow: '{ env: { 名前: 値 }, note: string }(無ければ SMOKE_KNOBS の行)',
  afterOrderOnly: 'string[](順序だけと宣言する after の上流)',
  afterData: 'string[](データの依存と宣言する after の上流)',
});
/**
 * 指紋で除く欄名(どの階層でも)—— 実行時刻・壁時計の所要と速度(新方式の語彙と旧方式の欄名)と `ms`(行ごとの壁時計のミリ秒 ——
 * 第323便b の試走で bgbudget2 の窓の指紋が 2 回で違った欄。今の正本で `ms` はすべて壁時計〔bgbudget2・charonwin・samplestatus・timing・ledgernorm〕)。
 */
export const FP_RUNTIME_KEYS = Object.freeze([...new Set(STABLE_RUNTIME_KEYS.concat(LEGACY_VOLATILE_KEYS, ['ms']))].sort());
/**
 * 指紋で除く**刻印と来歴**の欄(どの階層でも —— meta の外に写した刻印): 名が `sha256`・名が `Sha256` で終わる欄(対象・html・領域・コード・lib・入力のファイルの
 * sha —— targetSha256・nowSha256・measureSha256・obsSha256 ほか)と、前の世代から写した来歴の文字列 `baseFrom`(semic-302d の「carried(carried(…))」—— 鎖のたびに伸びる)。
 * **除かない** sha: 結果と宣言の hash(FP_KEEP_SHA_KEYS —— bodiesSha256・resultsSha256・rowsSha256・declSha256・rulesSha256・coreSha256)。
 * 第323便b の第322便の鎖 2 の振り返りの照合で、semic-302d の正本の差が baseFrom だけ・clone-301f と pnsource286 と pn1 の差が meta の外の targetSha256 / nowSha256 だけだった(物理の値は同じ)。
 */
export const FP_STAMP_KEYS = Object.freeze(['baseFrom', 'sha256']);
export const FP_KEEP_SHA_KEYS = Object.freeze(['bodiesSha256', 'coreSha256', 'declSha256', 'resultsSha256', 'rowsSha256', 'rulesSha256']);
const dropKeyFp = (() => { const rt = new Set(FP_RUNTIME_KEYS.concat(FP_STAMP_KEYS)), keep = new Set(FP_KEEP_SHA_KEYS); return (k) => rt.has(k) || (/Sha256$/.test(k) && !keep.has(k)); })();
/** 較正の判定の正本(書く段・読む段は簡易一致を使わない —— AN518)。 */
export const CALIBRATION_FILES = Object.freeze(['tests/out/calaudit-w249.json', 'tests/out/calaudit-w249-diag.json']);
export const CALIBRATION_HARNESS = 'tests/exp-w249b-calaudit.mjs';

const sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex');
const shaFileHex = (abs) => { try { return crypto.createHash('sha256').update(fs.readFileSync(abs)).digest('hex'); } catch { return null; } };
const readJson = (abs) => { try { return JSON.parse(fs.readFileSync(abs, 'utf8')); } catch { return null; } };

// ---------------------------------------------------------------------------------------------
// 指紋(物理の値の hash)
// ---------------------------------------------------------------------------------------------
function dropPtr(J, toks) {
  const walk = (x, i) => {
    if (!x || typeof x !== 'object') return;
    const t = toks[i];
    const keys = t === '*' ? Object.keys(x) : (Object.prototype.hasOwnProperty.call(x, t) ? [t] : []);
    if (i === toks.length - 1) { for (const k of keys) { if (Array.isArray(x)) x[k] = null; else delete x[k]; } return; }
    for (const k of keys) walk(x[k], i + 1);
  };
  walk(J, 0);
}
function dropKeysDeep(x, drop) {
  if (Array.isArray(x)) { for (const v of x) dropKeysDeep(v, drop); return; }
  if (!x || typeof x !== 'object') return;
  for (const k of Object.keys(x)) { if (drop(k)) delete x[k]; else dropKeysDeep(x[k], drop); }
}
/** 物理の値(meta・除外 Pointer・来歴と時刻・どの階層でも実行時刻と壁時計の欄名を除いた写し)。rel は除外 Pointer の宣言を引く名(正本の相対パス)。 */
export function physValue(J, rel) {
  const out = JSON.parse(JSON.stringify(J === undefined ? null : J));
  if (!out || typeof out !== 'object') return out;
  if (!Array.isArray(out)) delete out.meta;
  const ptrs = [...new Set((rel ? volatilePathsOf(rel) : []).concat(SEMANTIC_RUN_META))].filter((p) => !/^\/meta(\/|$)/.test(p));
  for (const p of ptrs) { const toks = p.slice(1).split('/').map((t) => t.replace(/~1/g, '/').replace(/~0/g, '~')); if (toks.length) dropPtr(out, toks); }
  dropKeysDeep(out, dropKeyFp);
  return out;
}
/** 物理の値の hash(版つき)。 */
export function physSha(J, rel) { return sha256(canonJson({ v: QUICK_FP_VERSION, data: physValue(J, rel) })); }
/** ファイルの物理の値の hash(読めなければ null)。 */
export function physShaFile(abs, rel) { const J = readJson(abs); return J === null ? null : physSha(J, rel); }
/** 窓の出力の指紋(出力ファイルの並び —— as〔正本の名〕と物理の値の hash の組を名で並べた sha256)。files が空なら null。 */
export function windowFingerprint(files) {
  const rows = (files || []).filter((z) => z && z.sha).map((z) => [z.as || z.file, z.sha]).sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
  return rows.length ? sha256(canonJson({ v: QUICK_FP_VERSION, files: rows })) : null;
}
/** 標準出力の正規化の hash(時刻・秒の数を含む行を除く —— 参考の欄。簡易一致の判定には使わない)。 */
export function stdoutNormSha(text) {
  const keep = String(text || '').split('\n').filter((l) => !/\d{4}-\d\d-\d\dT\d\d:\d\d|\d+(?:\.\d+)?\s*(?:s|ms|min|秒|分)\b|elapsed|wall|所要|→\s*tests\/out/i.test(l));
  return sha256(keep.join('\n'));
}
/** 段の器と lib のコードの sha(codeFilesOf の並びと各ファイルの sha256)。 */
export function codeShaOf(st, root) {
  const files = codeFilesOf(st, root);
  return { sha: sha256(canonJson(files.map((f) => [f, shaFileHex(String(root).replace(/\/$/, '') + '/' + f)]))), files };
}

// ---------------------------------------------------------------------------------------------
// 段の静的な判定(AN518 の名簿)と窓
// ---------------------------------------------------------------------------------------------
/** 簡易の窓(煙試験の窓の表 SMOKE_KNOBS の行 → 無ければ段の宣言 quickWindow)。無ければ null。煙試験(--fingerprint)が走らせるのは SMOKE_KNOBS の行だけ。 */
export function stepWindow(st, knobs) {
  const k = knobs && st ? knobs[st.key] : null;
  if (k && k.env) return { source: 'smoke', env: Object.assign({}, k.env), note: String(k.note || '') };
  if (st && st.quickWindow && st.quickWindow.env && typeof st.quickWindow.env === 'object') return { source: 'decl', env: Object.assign({}, st.quickWindow.env), note: String(st.quickWindow.note || '') };
  return null;
}
/**
 * 較正の判定を出す段(表と正本の meta から導く): 較正の正本(CALIBRATION_FILES)を書く段(outs・merges)・較正の器(CALIBRATION_HARNESS)を cmd に持つ段・
 * 較正の正本を正本の meta の入力(inputs[]・inputsStable[])に持つ段。metaOf が無ければ前の 2 つだけ。
 */
export function calibrationSteps(o) {
  const steps = (o && o.steps) || REGEN_STEPS;
  const metaOf = (o && o.metaOf) || ((o && o.root) ? (f) => { const J = readJson(String(o.root).replace(/\/$/, '') + '/' + f); return J ? J.meta || null : null; } : null);
  const out = new Map();
  for (const st of steps) {
    if (st.role === 'history') continue;
    if (writesOf(st).some((f) => CALIBRATION_FILES.includes(f))) { out.set(st.key, '較正の正本を書く'); continue; }
    if (String(st.cmd || '').indexOf(CALIBRATION_HARNESS) >= 0) { out.set(st.key, '較正の器の段'); continue; }
    if (metaOf) for (const f of (st.outs || [])) {
      const m = metaOf(f);
      if (m && [...(m.inputs || []), ...(m.inputsStable || [])].some((z) => z && CALIBRATION_FILES.includes(z.file))) { out.set(st.key, '較正の正本を読む(' + f.replace('tests/out/', '') + ')'); break; }
    }
  }
  return out;
}
/** 簡易一致を使わない段の静的な理由(無ければ null)。cal は calibrationSteps の戻り。 */
export function staticExclusion(st, cal) {
  if (!st) return '表に無い段';
  if (st.role === 'history') return '履歴';
  if (st.outside) return '鎖の外';
  if (st.manual) return '手動の段';
  if (st.alwaysRun) return '常時群(AN518)';
  if (st.quickVerify === false) return '段の宣言 quickVerify:false' + (st.quickVerifyWhy ? '(' + st.quickVerifyWhy + ')' : '');
  if ((st.htmlRegions || []).length || st.htmlAggregate || (st.touches || []).includes(HTML_TARGET)) return 'html の生成領域を書く段';
  if (cal && cal.has(st.key)) return '較正の判定を出す段(AN518 —— ' + cal.get(st.key) + ')';
  return null;
}

// ---------------------------------------------------------------------------------------------
// html の差の種類(步の関数・受理器・S._core —— quickVerify:'long' の段の判定)
// ---------------------------------------------------------------------------------------------
/** 步の関数の名(最上位の名前 —— 名前が Step か Step3 で終わる・S._core は別に見る)。 */
export const STEP_FN_RE = /Step\d?$/;
export const ACCEPTOR_ROOTS = Object.freeze(['validatePreset']);
const scriptOf = (t) => t.slice(t.indexOf('<script>') + 8, t.lastIndexOf('</script>'));
/**
 * 基点の html と今の html の差の種類: changed(本文が変わった最上位の名前)・stepFns(步の関数の閉包に入る変わった名前)・acceptor(受理器の閉包に入る変わった名前)・
 * core(S._core の本文が違う)。読めなければ known:false(保守側 —— 'long' の段は簡易一致を使わない)。
 */
export async function htmlChangeKinds(baseHtml, html) {
  try {
    const A = parseTopLevel(scriptOf(fs.readFileSync(baseHtml, 'utf8'))), B = parseTopLevel(scriptOf(fs.readFileSync(html, 'utf8')));
    const top = (P) => { const m = new Map(); for (const s of P.segments) for (const n of s.names) m.set(n, (m.has(n) ? m.get(n) + '\u0000' : '') + s.text); return m; };
    const ta = top(A), tb = top(B);
    const changed = new Set([...new Set([...ta.keys(), ...tb.keys()])].filter((n) => ta.get(n) !== tb.get(n)));
    const stepRoots = [...tb.keys()].filter((n) => STEP_FN_RE.test(n));
    const clStep = new Set(closureOf(B, stepRoots, undefined, { hardStop: SCOPE_STOP }).functions.concat(stepRoots));
    const clAcc = new Set(closureOf(B, ACCEPTOR_ROOTS.slice(), undefined, { hardStop: SCOPE_STOP }).functions.concat(ACCEPTOR_ROOTS));
    let core = null;
    try {
      const { loadHtmlHeadless } = await import('./lib-w279b-headless.mjs');
      const ca = String(loadHtmlHeadless(baseHtml).HP.sim._core), cb = String(loadHtmlHeadless(html).HP.sim._core);
      core = ca !== cb;
    } catch { core = null; }
    return { known: core !== null, changed: changed.size, stepFns: [...changed].filter((n) => clStep.has(n)).sort(), acceptor: [...changed].filter((n) => clAcc.has(n)).sort(), core };
  } catch (e) { return { known: false, why: String(e && e.message || e).slice(0, 120), changed: null, stepFns: [], acceptor: [], core: null }; }
}

// ---------------------------------------------------------------------------------------------
// 影の判定(planRegen の行に quick を足す)
// ---------------------------------------------------------------------------------------------
const slotOf = (key, K) => parseInt(sha256('slot:' + key).slice(0, 8), 16) % K;
const eqEnv = (a, b) => canonJson(a || {}) === canonJson(b || {});
/**
 * @param {object} plan planRegen の戻り(steps[].status・causeKinds・ownStatus)
 * @param {{steps?:Array, knobs?:object, record?:object|null, K?:number, promote?:boolean, wave?:number|null, change?:object|null,
 *          root?:string, metaOf?:Function, cal?:Map, codeOf?:Function, physOf?:Function, verifyOf?:Function}} o
 * @returns 影の表(plan.steps の各行に row.quick を足す)
 */
export function quickShadow(plan, o) {
  const opt = o || {};
  const steps = opt.steps || REGEN_STEPS;
  const by = new Map(steps.map((z) => [z.key, z]));
  const K = Math.max(2, Number(opt.K) || QUICK_K_DEFAULT);
  const root = opt.root ? String(opt.root).replace(/\/$/, '') : null;
  const metaOf = opt.metaOf || (root ? (f) => { const J = readJson(root + '/' + f); return J ? J.meta || null : null; } : () => null);
  const cal = opt.cal || calibrationSteps({ steps, metaOf });
  const rec = (opt.record && opt.record.steps) || {};
  const codeOf = opt.codeOf || ((st) => (root ? codeShaOf(st, root).sha : null));
  const physOf = opt.physOf || ((f) => (root ? physShaFile(root + '/' + f, f) : null));
  const verifyOf = opt.verifyOf || ((st) => { for (const f of (st.outs || [])) { const m = metaOf(f); if (m && m.verify) return m.verify; } return null; });
  const chg = opt.change || null;
  const stepChange = !chg || chg.known === false ? 'unknown' : (chg.core || (chg.stepFns || []).length || (chg.acceptor || []).length) ? 'yes' : 'no';
  const rows = [];
  for (const r of (plan.steps || [])) {
    const st = by.get(r.key);
    if (!st || r.status === 'history') continue;
    const q = { regionOnly: false, eligible: false, ifRecorded: false, why: [], window: null, sec: Number(r.sec) || 0, quickSec: null, wavesSinceFull: 0, next: 1, decision: null };
    r.quick = q;
    const kinds = r.causeKinds || [];
    q.regionOnly = r.status === 'regen' && r.ownStatus === 'regen' && kinds.length > 0 && kinds.every((k) => k === 'scope');
    if (r.status !== 'regen') continue;
    if (!q.regionOnly) { q.why.push('理由が領域だけでない(' + (kinds.join(',') || '—') + ')'); continue; }
    const ex = staticExclusion(st, cal);
    if (ex) q.why.push(ex);
    if (st.quickVerify === 'long' && stepChange !== 'no') q.why.push("段の宣言 quickVerify:'long' —— 步の関数・受理器・S._core が" + (stepChange === 'yes' ? '変わった便' : '変わったか分からない便(--base が要る)'));
    q.window = stepWindow(st, opt.knobs);
    if (!q.window) q.why.push('簡易の窓が無い');
    if (opt.promote) q.why.push('root 昇格の便(全段フル)');
    const v = verifyOf(st);
    q.wavesSinceFull = v && v.mode === 'quick' && Number.isInteger(v.wavesSinceFull) ? v.wavesSinceFull : 0;
    q.next = q.wavesSinceFull + 1;
    if (q.next >= K) q.why.push(`K 便以内のフル(この便で wavesSinceFull ${q.next} ≥ K ${K})`);
    q.ifRecorded = q.why.length === 0;
    // 指紋の記録
    const e = rec[r.key] || null;
    if (!e) q.why.push('指紋の記録が無い');
    else {
      if (!e.fingerprint) q.why.push('記録の指紋が無い(' + (e.why || e.verdict || '—') + ')');
      if (q.window && !eqEnv(e.window && e.window.env, q.window.env)) q.why.push('窓の環境が記録と違う');
      const cs = codeOf(st);
      if (e.codeSha && cs && e.codeSha !== cs) q.why.push('器・lib が記録の後に変わった');
      for (const f of (st.outs || [])) { const now = physOf(f); if (!e.canon || e.canon[f] === undefined || e.canon[f] !== now) { q.why.push('正本の物理の値が記録と違う(' + f.replace('tests/out/', '') + ')'); break; } }
      if (Number.isFinite(e.sec)) q.quickSec = e.sec;
    }
    q.eligible = q.why.length === 0;
    rows.push(r);
  }
  // 輪番(候補の ceil(n/K) をフルへ)
  const wave = Number.isFinite(Number(opt.wave)) ? Number(opt.wave) : null;
  const rotate = (pool) => {
    const nFull = Math.ceil(pool.length / K);
    const ord = pool.slice().sort((a, b) => (b.quick.wavesSinceFull - a.quick.wavesSinceFull)
      || ((wave !== null ? (slotOf(b.key, K) === wave % K) - (slotOf(a.key, K) === wave % K) : 0))
      || (b.quick.sec - a.quick.sec) || (a.key < b.key ? -1 : 1));
    const full = [];
    let big = 0;
    for (const r of ord) {
      if (full.length >= nFull) break;
      const isBig = r.quick.sec >= QUICK_BIG_SEC;
      if (isBig && big >= QUICK_BIG_MAX && r.quick.wavesSinceFull < K - 2) continue;
      full.push(r.key); if (isBig) big++;
    }
    return new Set(full);
  };
  const elig = rows.filter((r) => r.quick.eligible);
  const fullSet = rotate(elig);
  for (const r of elig) r.quick.decision = fullSet.has(r.key) ? 'full-rotation' : 'quick';
  const ifRec = rows.filter((r) => r.quick.ifRecorded);
  const fullIf = rotate(ifRec);
  for (const r of ifRec) r.quick.decisionIfRecorded = fullIf.has(r.key) ? 'full-rotation' : 'quick';
  const sum = (arr, f) => arr.reduce((a, r) => a + (Number(f(r)) || 0), 0);
  const qsOf = (r) => (r.quick.quickSec !== null ? r.quick.quickSec : r.quick.sec * 0.1);
  const why = {};
  for (const r of rows) if (!r.quick.eligible) for (const w of r.quick.why) { const k = w.replace(/[((].*$/, '').replace(/ \d.*$/, ''); why[k] = (why[k] || 0) + 1; }
  const qk = elig.filter((r) => r.quick.decision === 'quick'), qkIf = ifRec.filter((r) => r.quick.decisionIfRecorded === 'quick');
  return {
    version: QUICK_VERSION, K, promote: !!opt.promote, wave, stepChange, change: chg ? { known: chg.known, changed: chg.changed, stepFns: (chg.stepFns || []).slice(0, 8), acceptor: (chg.acceptor || []).slice(0, 8), core: chg.core } : null,
    record: opt.record ? { version: opt.record.version || null, wave: opt.record.wave || null, steps: Object.keys(rec).length } : null,
    count: { regen: (plan.steps || []).filter((r) => r.status === 'regen').length, regionOnly: rows.filter((r) => r.quick.regionOnly).length,
      eligible: elig.length, quick: qk.length, rotationFull: elig.length - qk.length, ifRecorded: ifRec.length, quickIfRecorded: qkIf.length },
    sec: { regen: sum((plan.steps || []).filter((r) => r.status === 'regen'), (r) => r.sec), regionOnly: sum(rows.filter((r) => r.quick.regionOnly), (r) => r.sec),
      quickFull: sum(qk, (r) => r.sec), quickWindow: Math.round(sum(qk, qsOf)), saved: Math.round(sum(qk, (r) => r.sec - qsOf(r))),
      quickFullIfRecorded: sum(qkIf, (r) => r.sec), quickWindowIfRecorded: Math.round(sum(qkIf, qsOf)), savedIfRecorded: Math.round(sum(qkIf, (r) => r.sec - qsOf(r))) },
    notEligible: why,
    quick: qk.map((r) => r.key), rotationFull: elig.filter((r) => r.quick.decision === 'full-rotation').map((r) => r.key),
    quickIfRecorded: qkIf.map((r) => r.key), rotationFullIfRecorded: ifRec.filter((r) => r.quick.decisionIfRecorded === 'full-rotation').map((r) => r.key),
    rows: rows.filter((r) => r.quick.regionOnly).map((r) => ({ key: r.key, sec: r.quick.sec, window: r.quick.window ? r.quick.window.source : null, eligible: r.quick.eligible,
      ifRecorded: r.quick.ifRecorded, decision: r.quick.decision, decisionIfRecorded: r.quick.decisionIfRecorded || null, quickSec: r.quick.quickSec, wavesSinceFull: r.quick.wavesSinceFull, why: r.quick.why })),
    note: '影(判定だけ —— 鎖はフルで走る)。quickWindow の秒は記録の窓の実測(無ければフルの 1/10 の見積り)。ifRecorded = 指紋の記録の条件を除いた候補(記録を取った後の見込み)',
  };
}

// ---------------------------------------------------------------------------------------------
// 記録(QUICK_FP_FILE —— コミットする作業記録・正本ではない)
// ---------------------------------------------------------------------------------------------
/** 空の記録。 */
export function emptyRecord() { return { version: QUICK_FP_VERSION, what: '', tool: 'node tools/harness-smoke.mjs --fingerprint ' + QUICK_FP_FILE, wave: null, rev: null, steps: {} }; }
/** 記録へ段の行を入れる(同じ段は置き換える・他の段は残す)。 */
export function mergeRecord(doc, entries, head) {
  const d = doc && doc.version === QUICK_FP_VERSION ? JSON.parse(JSON.stringify(doc)) : emptyRecord();
  d.what = '簡易一致確認(AN517/AN518)の影の照合の材料 —— 段ごとに簡易の窓(煙試験の窓の表 SMOKE_KNOBS か段の宣言 quickWindow)の出力の物理の値の指紋・窓の秒・'
    + '器と lib の sha・html の sha・その時点のフルの正本の物理の値の hash(meta・除外 Pointer・来歴と時刻・実行時刻と壁時計の欄名を除く —— tests/lib-w323b-quick.mjs の physSha)。'
    + '正本ではない(lint は形だけ)。書くのは node tools/harness-smoke.mjs --fingerprint ' + QUICK_FP_FILE + '(鎖の後に 1 回)';
  d.tool = 'node tools/harness-smoke.mjs --fingerprint ' + QUICK_FP_FILE;
  if (head) for (const k of ['wave', 'rev', 'html', 'htmlSha', 'node', 'at']) if (head[k] !== undefined) d[k] = head[k];
  for (const e of (entries || [])) if (e && e.key) d.steps[e.key] = e;
  d.steps = Object.fromEntries(Object.keys(d.steps).sort().map((k) => [k, d.steps[k]]));
  return d;
}
const HEX64 = /^[0-9a-f]{64}$/;
/** 記録の形(lint は形だけ)。違反の文の並びを返す。 */
export function recordShape(doc, o) {
  const bad = [];
  if (!doc || typeof doc !== 'object') return ['記録が JSON のオブジェクトでない'];
  if (doc.version !== QUICK_FP_VERSION) bad.push('記録の版が ' + QUICK_FP_VERSION + ' でない(' + doc.version + ')');
  if (!doc.steps || typeof doc.steps !== 'object') return bad.concat(['記録に steps が無い']);
  const keys = new Set(((o && o.steps) || REGEN_STEPS).filter((z) => z.role !== 'history').map((z) => z.key));
  for (const [k, e] of Object.entries(doc.steps)) {
    if (!keys.has(k)) bad.push('記録の段 ' + k + ' が現行の表に無い');
    if (!e || e.key !== k) { bad.push('記録の段 ' + k + ' の key'); continue; }
    if (!(e.window && e.window.env && typeof e.window.env === 'object')) bad.push('記録の段 ' + k + ' に窓の環境が無い');
    if (e.fingerprint !== null && !HEX64.test(String(e.fingerprint || ''))) bad.push('記録の段 ' + k + ' の指紋が 64 桁でない');
    if (e.fingerprint === null && !e.why) bad.push('記録の段 ' + k + ' は指紋が無いのに理由が無い');
    if (!HEX64.test(String(e.codeSha || ''))) bad.push('記録の段 ' + k + ' の codeSha');
    if (!HEX64.test(String(e.htmlSha || ''))) bad.push('記録の段 ' + k + ' の htmlSha');
    if (!e.canon || typeof e.canon !== 'object') bad.push('記録の段 ' + k + ' に正本の物理の値の hash が無い');
    if (!(Number.isFinite(e.sec) && e.sec >= 0)) bad.push('記録の段 ' + k + ' の窓の秒');
  }
  return bad;
}

// ---------------------------------------------------------------------------------------------
// 影の照合(次の便 —— 鎖のフルの走行の後に、前の記録と今の記録・今の正本を比べる)
// ---------------------------------------------------------------------------------------------
/**
 * 段ごとに 窓が同じか(前の記録の指紋 = 今の記録の指紋)と 物理の値が同じか(前の記録の正本の hash = 今の正本の physSha)を比べる。
 *   trueSame  … 窓が同じ ∧ 物理が同じ(簡易一致で済ませてよかった)
 *   falseSame … 窓が同じ ∧ 物理が違う(**誤判定** —— 本運用の門: 0 段)
 *   trueDiff  … 窓が違う ∧ 物理が違う(フルへ回して正しい)
 *   missed    … 窓が違う ∧ 物理が同じ(取りこぼし —— 誤りではない・節約を逃しただけ)
 *   na        … 比べられない(どちらかの指紋が無い・窓の環境か器と lib の sha が違う・正本が読めない)
 * @param {object} prev 前の記録(鎖の前 —— 前の便のフルの後に取った記録)
 * @param {object} cur 今の記録(今の便の鎖の後に取った記録)
 * @param {{physOf:(f:string)=>string|null, keys?:string[]}} o keys で比べる段を絞る(既定は両方の記録にある段)
 */
export function shadowCompare(prev, cur, o) {
  const P = (prev && prev.steps) || {}, C = (cur && cur.steps) || {};
  const keys = (o && o.keys) || Object.keys(P).filter((k) => k in C);
  const rows = [];
  for (const k of keys.slice().sort()) {
    const a = P[k] || null, b = C[k] || null;
    let cat = 'na', why = null;
    if (!a || !b) why = '記録に無い';
    else if (!a.fingerprint || !b.fingerprint) why = '指紋が無い';
    else if (!eqEnv(a.window && a.window.env, b.window && b.window.env)) why = '窓の環境が違う';
    else if (a.codeSha !== b.codeSha) why = '器・lib が違う(フル —— 簡易一致の対象外)';
    else {
      const win = a.fingerprint === b.fingerprint;
      let phys = true;
      for (const [f, h] of Object.entries(a.canon || {})) { const now = o.physOf(f); if (now === null) { why = '正本が読めない ' + f; break; } if (now !== h) phys = false; }
      if (!why) cat = win ? (phys ? 'trueSame' : 'falseSame') : (phys ? 'missed' : 'trueDiff');
    }
    rows.push({ key: k, cat, why, htmlSame: !!(a && b && a.htmlSha === b.htmlSha) });
  }
  const n = (c) => rows.filter((r) => r.cat === c).length;
  return { version: QUICK_VERSION, count: { trueSame: n('trueSame'), falseSame: n('falseSame'), trueDiff: n('trueDiff'), missed: n('missed'), na: n('na') },
    falseSame: rows.filter((r) => r.cat === 'falseSame').map((r) => r.key), ok: n('falseSame') === 0, rows,
    note: '誤判定(falseSame)= 簡易の窓が同じなのに物理の値が違った段 —— 本運用の門は 0 段。missed は節約を逃しただけ(誤りではない)。html が同じ段(htmlSame)は窓が同じで当然 —— 数は html が違う段で読む' };
}

// ---------------------------------------------------------------------------------------------
// 来歴 meta.verify の受理(β で quick を受理・root で拒否 —— 本運用の便で効く。本便の正本は verify を持たない)
// ---------------------------------------------------------------------------------------------
/** 簡易一致の来歴(本運用の便で刻印を更新する道具が書く形)。 */
export function quickVerifyMeta(o) {
  return { mode: 'quick', version: VERIFY_VERSION, quickFingerprint: o.quickFingerprint, fullRunAt: { wave: String(o.fullWave), sha: String(o.fullSha) }, wavesSinceFull: o.wavesSinceFull };
}
/**
 * 正本の meta.verify の違反(空 = 受理)。target 'beta' は quick を形の照合だけで受理・'root' は quick を拒否(root 昇格の便は全段フル)。
 * verify が無い・mode:'full' は受理(フルの走行)。
 * @param {object} meta
 * @param {{target:'beta'|'root', K?:number, file?:string}} o
 */
export function verifyViolations(meta, o) {
  const v = meta && meta.verify;
  if (v === undefined || v === null) return [];
  const f = (o && o.file) ? o.file + ' の ' : '';
  const K = Math.max(2, Number(o && o.K) || QUICK_K_DEFAULT);
  if (typeof v !== 'object') return [f + 'meta.verify がオブジェクトでない'];
  if (v.mode === 'full') return [];
  if (v.mode !== 'quick') return [f + 'meta.verify.mode が full / quick でない(' + String(v.mode) + ')'];
  const bad = [];
  if (!HEX64.test(String(v.quickFingerprint || ''))) bad.push(f + 'meta.verify.quickFingerprint が 64 桁でない');
  if (!(v.fullRunAt && typeof v.fullRunAt.wave === 'string' && v.fullRunAt.wave && /^[0-9a-f]{7,40}$/.test(String(v.fullRunAt.sha || '')))) bad.push(f + 'meta.verify.fullRunAt(wave・sha)の形');
  if (!(Number.isInteger(v.wavesSinceFull) && v.wavesSinceFull >= 1 && v.wavesSinceFull < K)) bad.push(f + 'meta.verify.wavesSinceFull が 1〜' + (K - 1) + ' の整数でない(' + String(v.wavesSinceFull) + ')');
  if (o && o.target === 'root') bad.push(f + '簡易一致(meta.verify.mode quick)の正本 —— root では受理しない(root 昇格の便は全段フル —— 鎖で作り直す)');
  return bad;
}

// ---------------------------------------------------------------------------------------------
// 自己試験(器を走らせない —— QA lint.regenQuick323 と regen-chain --self-test の補足)
// ---------------------------------------------------------------------------------------------
export function quickSelfTest() {
  const bad = [], cases = [];
  // ① 影の規則の変異
  const mk = (key, o) => Object.assign({ key, cmd: 'node tests/exp-x-' + key + '.mjs', outs: ['tests/out/' + key + '.json'], sec: 100, role: 'current' }, o || {});
  const steps = [mk('a'), mk('b'), mk('c', { alwaysRun: true }), mk('d', { quickVerify: false, quickVerifyWhy: '試験' }), mk('e', { quickVerify: 'long' }), mk('f'), mk('g'), mk('h', { sec: 900 }), mk('i', { sec: 800 }), mk('j', { sec: 700 }), mk('w')];
  const knobs = Object.fromEntries(steps.filter((z) => z.key !== 'w').map((z) => [z.key, { env: { X_QUICK: '1' }, note: 'q' }]));
  const row = (key, status, kinds, o) => Object.assign({ key, status, ownStatus: status, causeKinds: kinds, sec: (steps.find((z) => z.key === key) || {}).sec || 100 }, o || {});
  const plan = { steps: [row('a', 'regen', ['scope']), row('b', 'regen', ['scope', 'code']), row('c', 'always', ['scope']), row('d', 'regen', ['scope']), row('e', 'regen', ['scope']),
    row('f', 'regen', ['html']), row('g', 'regen', ['scope']), row('h', 'regen', ['scope']), row('i', 'regen', ['scope']), row('j', 'regen', ['scope']), row('w', 'regen', ['scope'])] };
  const recOf = (keys) => ({ version: QUICK_FP_VERSION, steps: Object.fromEntries(keys.map((k) => [k, { key: k, window: { env: { X_QUICK: '1' } }, fingerprint: 'f'.repeat(64), codeSha: 'c'.repeat(64), htmlSha: 'h'.repeat(64), canon: { ['tests/out/' + k + '.json']: 'p' } }])) });
  const base = { steps, knobs, record: recOf(steps.map((z) => z.key)), K: 3, wave: 323, change: { known: true, core: false, stepFns: ['dfmStep3'], acceptor: [] }, cal: new Map(),
    codeOf: () => 'c'.repeat(64), physOf: () => 'p', verifyOf: (st) => (st.key === 'g' ? { mode: 'quick', wavesSinceFull: 2 } : null) };
  const clone = (p) => JSON.parse(JSON.stringify(p));
  const s1 = quickShadow(clone(plan), base);
  const el = new Set(s1.rows.filter((z) => z.eligible).map((z) => z.key));
  const want = ['a', 'h', 'i', 'j'];
  if (JSON.stringify([...el].sort()) !== JSON.stringify(want)) bad.push('① 候補 ' + [...el].sort().join(',') + ' ≠ ' + want.join(','));
  const not = (k, re) => { const r = s1.rows.find((z) => z.key === k); return r ? r.why.some((w) => re.test(w)) : true; };
  if (s1.rows.some((z) => z.key === 'b' || z.key === 'f' || z.key === 'c')) bad.push('① 器のコード・html 全体・常時群の段が領域だけの行に入った');
  if (!not('d', /quickVerify:false/)) bad.push('① quickVerify:false が外れない');
  if (!not('e', /long/)) bad.push("① 'long' の段が步の関数の変わった便で外れない");
  if (!not('g', /K 便以内/)) bad.push('① K 便を超えた段が外れない');
  if (!not('w', /窓が無い/)) bad.push('① 窓の無い段が外れない');
  if (s1.count.rotationFull !== Math.ceil(4 / 3) || s1.rotationFull.filter((k) => ['h', 'i', 'j'].includes(k)).length > QUICK_BIG_MAX) bad.push('① 輪番の数 ' + s1.count.rotationFull);
  cases.push(`① 規則の変異: 候補 ${[...el].sort().join(',')}(器のコード・html 全体・常時群・quickVerify:false・'long' と步の関数・K 便・窓なし は外れる)・輪番のフル ${s1.rotationFull.join(',')}`);
  const s2 = quickShadow(clone(plan), Object.assign({}, base, { promote: true }));
  if (s2.count.eligible !== 0) bad.push('② root 昇格の便に候補');
  const s3 = quickShadow(clone(plan), Object.assign({}, base, { record: null }));
  if (s3.count.eligible !== 0 || s3.count.ifRecorded !== 4) bad.push('② 記録なしの候補 ' + s3.count.eligible + '・ifRecorded ' + s3.count.ifRecorded);
  const s4 = quickShadow(clone(plan), Object.assign({}, base, { physOf: (f) => (f.indexOf('/a.json') >= 0 ? 'q' : 'p'), codeOf: (st) => (st.key === 'h' ? 'x'.repeat(64) : 'c'.repeat(64)) }));
  const el4 = s4.rows.filter((z) => z.eligible).map((z) => z.key).sort().join(',');
  if (el4 !== 'i,j') bad.push('② 正本の物理の値・器の sha が記録と違う段が外れない: ' + el4);
  const s5 = quickShadow(clone(plan), Object.assign({}, base, { change: { known: true, core: false, stepFns: [], acceptor: [] } }));
  if (!s5.rows.find((z) => z.key === 'e' && z.eligible)) bad.push("② 步の関数が変わらない便で 'long' の段が候補にならない");
  const s6 = quickShadow(clone(plan), Object.assign({}, base, { change: null }));
  if (s6.rows.find((z) => z.key === 'e' && z.eligible)) bad.push("② 差が分からない便で 'long' の段が候補");
  cases.push(`② root 昇格 → 候補 ${s2.count.eligible}・記録なし → 候補 ${s3.count.eligible}(記録があれば ${s3.count.ifRecorded})・正本の物理の値か器の sha が記録と違う → ${el4}・'long' は步の関数が変わらない便でだけ候補`);
  // ③ 指紋: meta・時刻・壁時計は除く/物理の値は効く/配列の位置は保つ
  const J = { meta: { generatedAt: '2026-11-02T00:00:00Z', target: 'x' }, rows: [{ v: 1.5, wallSec: 3, generatedAt: 't' }, { v: 2 }], elapsedS: 9 };
  const J2 = JSON.parse(JSON.stringify(J)); J2.meta.generatedAt = 'z'; J2.rows[0].wallSec = 7; J2.elapsedS = 1;
  const J3 = JSON.parse(JSON.stringify(J)); J3.rows[1].v = 2.0000000001;
  J2.targetSha256 = 'a'.repeat(64); J2.rows[1].baseFrom = 'carried(x)'; J2.rows[0].ms = 12.5; J2.rows[1].nowSha256 = 'b'.repeat(64);
  const J4 = JSON.parse(JSON.stringify(J)); J4.rows[0].resultsSha256 = 'c'.repeat(64);
  if (physSha(J, null) !== physSha(J2, null)) bad.push('③ 時刻・壁時計だけ違う写しの指紋が違う');
  if (physSha(J, null) === physSha(J3, null)) bad.push('③ 物理の値が違う写しの指紋が同じ');
  if (physSha(J, null) === physSha(J4, null)) bad.push('③ 結果の hash(resultsSha256)を除いた');
  const fp1 = windowFingerprint([{ as: 'b', sha: '1' }, { as: 'a', sha: '2' }]), fp2 = windowFingerprint([{ as: 'a', sha: '2' }, { as: 'b', sha: '1' }]);
  if (fp1 !== fp2 || windowFingerprint([]) !== null) bad.push('③ 窓の指紋の並び');
  cases.push(`③ 指紋(${QUICK_FP_VERSION}): meta・時刻・壁時計(ms を含む)・刻印と来歴(…Sha256・baseFrom)の欄だけ違う → 同じ・物理の値が 1e-10 違う → 違う・結果の hash(resultsSha256)は残す・出力の並びに依らない`);
  // ④ 来歴 verify の受理
  const qm = quickVerifyMeta({ quickFingerprint: 'a'.repeat(64), fullWave: '第323便', fullSha: 'bff6711', wavesSinceFull: 1 });
  const vb = verifyViolations({ verify: qm }, { target: 'beta' }), vr = verifyViolations({ verify: qm }, { target: 'root' });
  const vbad = verifyViolations({ verify: Object.assign({}, qm, { wavesSinceFull: 3 }) }, { target: 'beta' });
  const vbad2 = verifyViolations({ verify: Object.assign({}, qm, { quickFingerprint: 'x' }) }, { target: 'beta' });
  const vfull = verifyViolations({ verify: { mode: 'full' } }, { target: 'root' }), vnone = verifyViolations({}, { target: 'root' }), vodd = verifyViolations({ verify: { mode: 'fast' } }, { target: 'beta' });
  if (vb.length || vr.length !== 1 || !/root では受理しない/.test(vr[0]) || !vbad.length || !vbad2.length || vfull.length || vnone.length || !vodd.length) bad.push('④ verify の受理: β ' + vb.length + '・root ' + vr.length + '・K 超え ' + vbad.length + '・指紋の形 ' + vbad2.length + '・full ' + vfull.length + '・無し ' + vnone.length + '・別の mode ' + vodd.length);
  cases.push(`④ 来歴 verify(${VERIFY_VERSION}): β で quick を受理(違反 ${vb.length})・root で拒否(${vr.length})・wavesSinceFull ≥ K と指紋の形の違反を拒否・full と無しは受理・別の mode は拒否`);
  // ⑤ 記録の形
  const doc = mergeRecord(null, [{ key: 'a', window: { env: { X: '1' } }, fingerprint: 'a'.repeat(64), codeSha: 'c'.repeat(64), htmlSha: 'b'.repeat(64), canon: {}, sec: 1.5 }], { wave: 323 });
  const sh = recordShape(doc, { steps: [{ key: 'a' }] });
  const sh2 = recordShape(mergeRecord(doc, [{ key: 'zz', window: {}, fingerprint: 'x' }]), { steps: [{ key: 'a' }] });
  if (sh.length || sh2.length < 3) bad.push('⑤ 記録の形: ' + sh.concat(sh2).slice(0, 3).join(' / '));
  cases.push(`⑤ 記録の形(${QUICK_FP_VERSION}): 正しい行 → 違反 ${sh.length}・表に無い段と壊れた行 → 違反 ${sh2.length}`);
  // ⑥ 影の照合の数え方
  const e = (fp, canon, codeSha) => ({ window: { env: { X: '1' } }, fingerprint: fp, codeSha: codeSha || 'c', canon, htmlSha: 'h' });
  const prevR = { steps: { a: e('1', { 'x/a': 'p' }), b: e('1', { 'x/b': 'p' }), c: e('1', { 'x/c': 'p' }), d: e('1', { 'x/d': 'p' }), z: e(null, {}) } };
  const curR = { steps: { a: e('1', {}), b: e('1', {}), c: e('2', {}), d: e('2', {}), z: e('1', {}) } };
  const sc = shadowCompare(prevR, curR, { physOf: (f) => ({ 'x/a': 'p', 'x/b': 'q', 'x/c': 'q', 'x/d': 'p' })[f] });
  if (JSON.stringify(sc.count) !== JSON.stringify({ trueSame: 1, falseSame: 1, trueDiff: 1, missed: 1, na: 1 }) || sc.ok || sc.falseSame.join(',') !== 'b') bad.push('⑥ 影の照合の数え方: ' + JSON.stringify(sc.count));
  cases.push(`⑥ 影の照合: 窓が同じ ∧ 物理が同じ → trueSame・窓が同じ ∧ 物理が違う → **誤判定 falseSame**(門 0)・窓が違う ∧ 物理が違う → trueDiff・窓が違う ∧ 物理が同じ → missed・指紋なし → na`);
  return { version: QUICK_VERSION, ok: bad.length === 0, bad, cases };
}

export default { QUICK_VERSION, QUICK_K_DEFAULT, QUICK_BIG_SEC, QUICK_BIG_MAX, QUICK_FP_FILE, QUICK_FP_VERSION, VERIFY_VERSION, QUICK_DECL_FIELDS, FP_RUNTIME_KEYS,
  FP_STAMP_KEYS, FP_KEEP_SHA_KEYS, CALIBRATION_FILES, CALIBRATION_HARNESS, physValue, physSha, physShaFile, windowFingerprint, stdoutNormSha, codeShaOf, stepWindow, calibrationSteps, staticExclusion,
  STEP_FN_RE, ACCEPTOR_ROOTS, htmlChangeKinds, quickShadow, emptyRecord, mergeRecord, recordShape, shadowCompare, quickVerifyMeta, verifyViolations, quickSelfTest };
