// 第345便b(原仮定者の回答(2026-11-21 —— 第145報)「AN921: 推奨で進める」・統括の検証項目 R393): **実行系(ブラウザと Node)の数学関数の指紋と、値の比べ方**(純関数 —— ブラウザを import しない・html を読まない・正本を書かない)。
//
// ■ 何を持つか
//   ① 数学関数の探り `mathProbe`(自分自身だけで閉じた関数 —— ページの page.evaluate と Node の両方で同じソースを走らせる)。決まった格子 2 万点 × アプリが使う関数の値の
//      ビットの列を、関数ごとに 64 ビットの FNV-1a(語ごと —— BigInt)で束ねる。格子と hash の作りは PROBE_VERSION に固定(変えたら版を上げる)。
//      `probeSource()` は関数のソースの文字列・`probeExpression()` はページで評価する式・`runProbe()` は Node で走らせた結果。
//   ② `mathFingerprint(probeOut)`: 関数ごとの hash を決まった順(PROBE_FUNCTIONS)に束ねた sha256 の先頭 16 桁。`diffFunctions(a, b)`: 違う関数の名の配列。
//   ③ `ulpDiff(a, b)`(有限の float64 の ulp の差 —— 符号の違い・非有限は null)・`compareValues(a, b, { sameEngine, maxUlp, relTol })`(同じ実行系ならビットで同じを要求・
//      違うなら宣言した許容 —— 返り値に mode・ulp・rel)・`compareArrays(a, b, opts)`(数の配列の最悪の行)。
//   ④ `loadDeclaration(root)`(宣言 tests/data-w345-engine.json)・`sameNumericEngine(fpA, fpB)`・`describeEngine({ chromium, v8, playwright, node, mathFingerprint })`・
//      `engineVerdict(probeOut, decl)`(宣言と同じ指紋か・違う関数の名)。
//   ⑤ 自己試験の場面 `pureScenes()`・`pureGates(PS)`。
// ■ 考え方: 「同じ数値の実行系か」は版の名前でなく数学関数の指紋で見る(版の名前・V8 の版は記録に残す)。同じ実行系の中ではビットで同じ・実行系の間は許容つき
//   (許容は呼ぶ側の検査の量に限る —— この lib は許容の値を持たない)。
// ■ 言わないこと: どの版の値が正しいか・アプリの物理が変わった(ブラウザの数学関数の実装の差 —— 最後の 1 ビット)。

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export const LIB_VERSION = 'w345-engine-lib-1';
export const PROBE_VERSION = 'w345-mathprobe-1';
export const DECL_FILE = 'tests/data-w345-engine.json';
export const DECL_VERSION = 'w345-engine-1';
/** 探りの関数の名(決まった順 —— 指紋はこの順で束ねる)。mulAdd は積和の対照(どの実行系でも同じの見込み) */
export const PROBE_FUNCTIONS = Object.freeze(['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'atan2', 'sinh', 'cosh', 'tanh', 'asinh', 'acosh', 'atanh',
  'exp', 'expm1', 'log', 'log1p', 'log2', 'log10', 'sqrt', 'cbrt', 'pow', 'hypot2', 'hypot3', 'mulAdd']);
const FP_RE = /^[0-9a-f]{16}$/;
const HASH_RE = /^[0-9a-f]{16}$/;

/**
 * 数学関数の探り(**自分自身だけで閉じた関数** —— 外の名を参照しない。ページと Node で同じソースを走らせる)。
 * 格子: 線形合同の列 s ← (s × 16807 + 0.5) mod 2147483647(初期 0.123456789)の 2 万点を [−20, 20) に写す。関数ごとの定義域の写し:
 *   asin・acos・atanh・log1p は x ÷ 20.0001/acosh は |x| + 1/log・log2・log10・sqrt は |x| + 1e−9/expm1 は x ÷ 20/pow は (|a| + 1e−3, b ÷ 4) の対/
 *   atan2・hypot2 は (a, b) の対/hypot3・mulAdd(a × b + c)は 3 つ組/ほかは x のまま。
 * hash: 値の 64 ビットの列を語ごとに FNV-1a(h ← (h xor bits) × 0x100000001b3 mod 2^64・初期 0xcbf29ce484222325)。NaN は来ない写し(来たら n の数に出る)。
 */
export function mathProbe() {
  const VERSION = 'w345-mathprobe-1', N = 20000;
  const xs = new Array(N); let s = 0.123456789;
  for (let i = 0; i < N; i++) { s = (s * 16807 + 0.5) % 2147483647; xs[i] = (s / 2147483647) * 40 - 20; }
  const buf = new Float64Array(1), u = new BigUint64Array(buf.buffer);
  const MASK = 0xFFFFFFFFFFFFFFFFn, PRIME = 0x100000001b3n, OFF = 0xcbf29ce484222325n;
  const one = (f, map) => { let h = OFF, n = 0, nan = 0; for (let i = 0; i < N; i++) { const v = f(map(xs[i])); if (v !== v) { nan++; continue; } buf[0] = v; h = ((h ^ u[0]) * PRIME) & MASK; n++; } return { h, n, nan }; };
  const pair = (f) => { let h = OFF, n = 0, nan = 0; for (let i = 0; i + 1 < N; i += 2) { const v = f(xs[i], xs[i + 1]); if (v !== v) { nan++; continue; } buf[0] = v; h = ((h ^ u[0]) * PRIME) & MASK; n++; } return { h, n, nan }; };
  const tri = (f) => { let h = OFF, n = 0, nan = 0; for (let i = 0; i + 2 < N; i += 3) { const v = f(xs[i], xs[i + 1], xs[i + 2]); if (v !== v) { nan++; continue; } buf[0] = v; h = ((h ^ u[0]) * PRIME) & MASK; n++; } return { h, n, nan }; };
  const id = (x) => x, unit = (x) => x / 20.0001, pos = (x) => Math.abs(x) + 1e-9;
  const R = {
    sin: one(Math.sin, id), cos: one(Math.cos, id), tan: one(Math.tan, id),
    asin: one(Math.asin, unit), acos: one(Math.acos, unit), atan: one(Math.atan, id),
    atan2: pair((a, b) => Math.atan2(a, b)),
    sinh: one(Math.sinh, id), cosh: one(Math.cosh, id), tanh: one(Math.tanh, id),
    asinh: one(Math.asinh, id), acosh: one(Math.acosh, (x) => Math.abs(x) + 1), atanh: one(Math.atanh, unit),
    exp: one(Math.exp, id), expm1: one(Math.expm1, (x) => x / 20),
    log: one(Math.log, pos), log1p: one(Math.log1p, unit), log2: one(Math.log2, pos), log10: one(Math.log10, pos),
    sqrt: one(Math.sqrt, pos), cbrt: one(Math.cbrt, id),
    pow: pair((a, b) => Math.pow(Math.abs(a) + 1e-3, b / 4)),
    hypot2: pair((a, b) => Math.hypot(a, b)), hypot3: tri((a, b, c) => Math.hypot(a, b, c)),
    mulAdd: tri((a, b, c) => a * b + c),
  };
  const functions = {}, counts = {};
  for (const k of Object.keys(R)) { functions[k] = R[k].h.toString(16).padStart(16, '0'); counts[k] = R[k].n; }
  return { version: VERSION, n: N, functions, counts };
}
/** 探りの関数のソースの文字列(page.evaluate に渡す —— 例: `page.evaluate(probeExpression())`) */
export function probeSource() { return mathProbe.toString(); }
/** ページで評価する式(関数を即時に呼ぶ) */
export function probeExpression() { return '(' + probeSource() + ')()'; }
/** Node で探りを走らせる(同じソースを Function で組み直す —— ページと同じ文字列を走らせる) */
export function runProbe() { return checkProbe(new Function('return ' + probeExpression())()); }

/** 探りの結果の形を見る(拒否 —— 型・版・関数の欠け・hash の形) */
export function checkProbe(p) {
  if (!p || typeof p !== 'object') throw new TypeError('探りの結果が object でない');
  if (p.version !== PROBE_VERSION) throw new Error('探りの版が違う: ' + p.version + '(期待 ' + PROBE_VERSION + ')');
  if (!p.functions || typeof p.functions !== 'object') throw new TypeError('探りの結果に functions が無い');
  for (const k of PROBE_FUNCTIONS) if (typeof p.functions[k] !== 'string' || !HASH_RE.test(p.functions[k])) throw new Error('探りの結果の関数 ' + k + ' の hash の形が違う');
  const extra = Object.keys(p.functions).filter((k) => !PROBE_FUNCTIONS.includes(k));
  if (extra.length) throw new Error('探りの結果に知らない関数: ' + extra.join(','));
  return p;
}
/** 関数ごとの hash を決まった順に束ねた指紋(sha256 の先頭 16 桁) */
export function mathFingerprint(probeOut) {
  const p = checkProbe(probeOut);
  const text = PROBE_VERSION + '\n' + PROBE_FUNCTIONS.map((k) => k + '=' + p.functions[k]).join('\n');
  return crypto.createHash('sha256').update(text).digest('hex').slice(0, 16);
}
/** 違う関数の名(PROBE_FUNCTIONS の順)。引数は探りの結果か functions の object */
export function diffFunctions(a, b) {
  const fa = a && a.functions ? a.functions : a, fb = b && b.functions ? b.functions : b;
  if (!fa || !fb || typeof fa !== 'object' || typeof fb !== 'object') throw new TypeError('diffFunctions: 関数の hash の object が要る');
  return PROBE_FUNCTIONS.filter((k) => fa[k] !== fb[k]);
}

// ---- ulp の差と値の比べ方 ----
const _b = new Float64Array(1), _u = new BigInt64Array(_b.buffer);
const ordered = (x) => { _b[0] = x; const v = _u[0]; return v < 0n ? -(v & 0x7FFFFFFFFFFFFFFFn) : v; };
/** 有限の float64 の ulp の差(Number)。非有限・数でない・符号の違い(0 は両側に含める)は null */
export function ulpDiff(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number' || !Number.isFinite(a) || !Number.isFinite(b)) return null;
  if (a === b) return 0;
  if ((a < 0 && b > 0) || (a > 0 && b < 0)) return null;
  const d = ordered(a) - ordered(b);
  return Number(d < 0n ? -d : d);
}
/** 相対の差 |a − b| ÷ max(|a|, |b|)(両方 0 なら 0) */
export function relDiff(a, b) { const m = Math.max(Math.abs(a), Math.abs(b)); return m === 0 ? 0 : Math.abs(a - b) / m; }
const sameBits = (a, b) => { _b[0] = a; const x = _u[0]; _b[0] = b; return x === _u[0]; };
/**
 * 2 つの数を比べる。sameEngine = true ならビットで同じを要求(mode 'bit')。false なら宣言した許容(maxUlp か relTol のどちらか —— 両方なら どちらかを満たせば可)で見る(mode 'tol')。
 * 許容を宣言しないで sameEngine = false を渡すと例外(許容は呼ぶ側の検査の量に限って宣言する)。返り値: { ok, mode, sameBits, ulp, rel, maxUlp, relTol }
 */
export function compareValues(a, b, opts) {
  const o = opts || {};
  if (typeof a !== 'number' || typeof b !== 'number') throw new TypeError('compareValues: 数が要る(' + typeof a + '・' + typeof b + ')');
  if (Number.isNaN(a) || Number.isNaN(b)) throw new RangeError('compareValues: NaN は比べない');
  if (typeof o.sameEngine !== 'boolean') throw new TypeError('compareValues: sameEngine(true/false)を宣言する');
  const maxUlp = o.maxUlp === undefined ? null : o.maxUlp, relTol = o.relTol === undefined ? null : o.relTol;
  if (maxUlp !== null && !(Number.isInteger(maxUlp) && maxUlp >= 0)) throw new RangeError('compareValues: maxUlp は 0 以上の整数');
  if (relTol !== null && !(typeof relTol === 'number' && relTol >= 0 && Number.isFinite(relTol))) throw new RangeError('compareValues: relTol は 0 以上の有限の数');
  const sb = sameBits(a, b), ulp = ulpDiff(a, b), rel = Number.isFinite(a) && Number.isFinite(b) ? relDiff(a, b) : (a === b ? 0 : null);
  if (o.sameEngine) return { ok: sb, mode: 'bit', sameBits: sb, ulp, rel, maxUlp, relTol };
  if (maxUlp === null && relTol === null) throw new Error('compareValues: 違う実行系の比べには maxUlp か relTol を宣言する');
  const ok = sb || (maxUlp !== null && ulp !== null && ulp <= maxUlp) || (relTol !== null && rel !== null && rel <= relTol);
  return { ok, mode: 'tol', sameBits: sb, ulp, rel, maxUlp, relTol };
}
/** 数の配列を比べる(長さが違えば例外)。返り値: { ok, mode, n, nDiffBits, worstUlp, worstRel, worstIndex, firstBad } */
export function compareArrays(a, b, opts) {
  if (!Array.isArray(a) || !Array.isArray(b) && !ArrayBuffer.isView(b)) throw new TypeError('compareArrays: 配列が要る');
  if (a.length !== b.length) throw new RangeError('compareArrays: 長さが違う ' + a.length + '・' + b.length);
  let ok = true, nDiffBits = 0, worstUlp = 0, worstRel = 0, worstIndex = -1, firstBad = -1, mode = null;
  for (let i = 0; i < a.length; i++) {
    const r = compareValues(a[i], b[i], opts); mode = r.mode;
    if (!r.sameBits) nDiffBits++;
    if (r.ulp === null ? !r.sameBits : r.ulp > worstUlp) { worstUlp = r.ulp === null ? Infinity : r.ulp; worstIndex = i; }
    if (r.rel !== null && r.rel > worstRel) worstRel = r.rel;
    if (!r.ok) { ok = false; if (firstBad < 0) firstBad = i; }
  }
  return { ok, mode: mode || (opts && opts.sameEngine ? 'bit' : 'tol'), n: a.length, nDiffBits, worstUlp, worstRel, worstIndex, firstBad };
}

// ---- 宣言と実行系 ----
/** 宣言 tests/data-w345-engine.json を読んで形を見る */
export function loadDeclaration(root) {
  if (typeof root !== 'string' || !root) throw new TypeError('loadDeclaration: root(リポジトリの根の path)が要る');
  const D = JSON.parse(fs.readFileSync(path.join(root, DECL_FILE), 'utf8'));
  return checkDeclaration(D);
}
/** 宣言の形を見る(版・探りの版・指紋の形・関数ごとの hash から指紋が作り直せる・observed の形) */
export function checkDeclaration(D) {
  if (!D || typeof D !== 'object') throw new TypeError('宣言が object でない');
  if (D.version !== DECL_VERSION) throw new Error('宣言の版が違う: ' + D.version);
  if (D.probeVersion !== PROBE_VERSION) throw new Error('宣言の探りの版が違う: ' + D.probeVersion + '(lib は ' + PROBE_VERSION + ')');
  if (typeof D.mathFingerprint !== 'string' || !FP_RE.test(D.mathFingerprint)) throw new Error('宣言の指紋の形が違う');
  const fp = mathFingerprint({ version: D.probeVersion, functions: D.functions });
  if (fp !== D.mathFingerprint) throw new Error('宣言の関数ごとの hash から作り直した指紋 ' + fp + ' が宣言の指紋 ' + D.mathFingerprint + ' と違う');
  if (!Array.isArray(D.observed) || D.observed.length < 1 || !D.observed.every((o) => o && typeof o.chromium === 'string' && typeof o.v8 === 'string')) throw new Error('宣言の observed(同じ指紋だった版の記録)の形が違う');
  return D;
}
/** 2 つの指紋が同じ数値の実行系か(形が違えば例外) */
export function sameNumericEngine(fpA, fpB) {
  if (typeof fpA !== 'string' || !FP_RE.test(fpA)) throw new TypeError('sameNumericEngine: 指紋 A の形が違う(16 桁の 16 進)');
  if (typeof fpB !== 'string' || !FP_RE.test(fpB)) throw new TypeError('sameNumericEngine: 指紋 B の形が違う(16 桁の 16 進)');
  return fpA === fpB;
}
/** 実行系の記録(欠けは null —— 版の名前は記録に残すが同じさの判定には使わない) */
export function describeEngine(e) {
  const o = e || {};
  const s = (v) => (v === undefined || v === null || v === '' ? null : String(v));
  const fp = s(o.mathFingerprint);
  if (fp !== null && !FP_RE.test(fp)) throw new TypeError('describeEngine: mathFingerprint の形が違う');
  const r = { chromium: s(o.chromium), v8: s(o.v8), playwright: s(o.playwright), node: s(o.node), mathFingerprint: fp };
  r.label = [r.chromium ? 'chromium ' + r.chromium : null, r.v8 ? 'V8 ' + r.v8 : null, r.playwright ? 'playwright ' + r.playwright : null, r.node ? 'node ' + r.node : null,
    fp ? '指紋 ' + fp : null].filter(Boolean).join('・');
  return Object.freeze(r);
}
/** 探りの結果が宣言と同じ指紋か(違う関数の名・宣言の observed に同じ版が在るか) */
export function engineVerdict(probeOut, decl, engine) {
  const D = checkDeclaration(decl), fp = mathFingerprint(probeOut);
  const same = sameNumericEngine(fp, D.mathFingerprint);
  const chromium = engine && engine.chromium ? String(engine.chromium) : null;
  return { same, fingerprint: fp, declared: D.mathFingerprint, diff: same ? [] : diffFunctions(probeOut, D), knownVersion: chromium ? D.observed.some((o) => o.chromium === chromium) : null };
}

// ---- 明示のブラウザの約束(qa.mjs の getBrowser・tools/engine-check.mjs・perf が同じ形で使う) ----
/** CHROMIUM_PATH と DFM_EXPECT_CHROMIUM の両方が在るときだけ { executablePath, expect } を返す。どちらかが無ければ null(今までの起動の順のまま) */
export function explicitBrowserSpec(env) {
  const e = env || {};
  const p = typeof e.CHROMIUM_PATH === 'string' ? e.CHROMIUM_PATH.trim() : '', x = typeof e.DFM_EXPECT_CHROMIUM === 'string' ? e.DFM_EXPECT_CHROMIUM.trim() : '';
  return p && x ? { executablePath: p, expect: x } : null;
}
/** 起動したブラウザの版が期待と違えば例外(明示のブラウザのとき) */
export function assertExpectedVersion(version, expect) {
  if (String(version) !== String(expect)) throw new Error('明示のブラウザの版が違う: browser.version() = ' + version + '・DFM_EXPECT_CHROMIUM = ' + expect);
  return true;
}

/**
 * 起動の順(ブラウザの module は呼ぶ側が渡す —— この lib は import しない)。明示のブラウザ(両方の環境変数)ならその実行ファイルで起動して版を照合(違えば閉じて例外)。
 * そうでなければ opts.fallback(呼ぶ側の今までの起動の関数 —— 例: qa.mjs の順)を呼ぶ。返り値: { browser, explicit }
 */
export async function launchEngine(chromium, env, fallback) {
  const spec = explicitBrowserSpec(env);
  if (spec) {
    if (!chromium || typeof chromium.launch !== 'function') throw new Error('明示のブラウザ: chromium の module が要る');
    const browser = await chromium.launch({ executablePath: spec.executablePath });
    try { assertExpectedVersion(browser.version(), spec.expect); } catch (e) { await browser.close().catch(() => {}); throw e; }
    return { browser, explicit: spec };
  }
  if (typeof fallback !== 'function') throw new Error('launchEngine: 既定の起動の関数が要る');
  return { browser: await fallback(), explicit: null };
}
/** 起動したブラウザの版・V8(CDP の Browser.getVersion —— 読めなければ null)・数学関数の探り(新しいページで走らせて閉じる) */
export async function measureBrowser(browser) {
  let v8 = null;
  try { const cdp = await browser.newBrowserCDPSession(); const v = await cdp.send('Browser.getVersion'); v8 = v && v.jsVersion ? String(v.jsVersion) : null; await cdp.detach().catch(() => {}); } catch (e) { v8 = null; }
  const page = await browser.newPage();
  try { const probe = checkProbe(await page.evaluate(probeExpression())); return { chromium: String(browser.version()), v8, probe, mathFingerprint: mathFingerprint(probe) }; }
  finally { await page.close().catch(() => {}); }
}

/** 文書の表(関数ごと: 宣言の observed の版は「同じ」・nodeDiffers の各 Node は違う関数に「違う」)—— PHYSICS〔第345便b〕に逐語で載せる */
export function functionTable(decl) {
  const D = checkDeclaration(decl);
  const nodes = Object.values(D.nodeDiffers || {});
  const head = '| 関数 | ' + D.observed.map((o) => 'chromium ' + o.chromium + '(V8 ' + o.v8 + ')').concat(nodes.map((n) => 'Node ' + n.node + '(V8 ' + n.v8 + ')')).join(' | ') + ' |';
  const sep = '|' + ' --- |'.repeat(1 + D.observed.length + nodes.length);
  const rows = PROBE_FUNCTIONS.map((k) => '| ' + k + ' | ' + D.observed.map(() => '宣言と同じ').concat(nodes.map((n) => (n.diff.includes(k) ? '違う' : '同じ'))).join(' | ') + ' |');
  return [head, sep].concat(rows).join('\n');
}

// ---- 自己試験の場面 ----
export function pureScenes() {
  const S = {};
  const thr = (f) => { try { f(); return false; } catch (e) { return true; } };
  S.ulp = { one: ulpDiff(1, 1 + 2 ** -52), zero: ulpDiff(0, -0), tiny: ulpDiff(0, 5e-324), neg: ulpDiff(-1, -(1 + 2 ** -52)), sign: ulpDiff(1, -1), nan: ulpDiff(NaN, 1), inf: ulpDiff(Infinity, 1), str: ulpDiff('1', 1) };
  const a = 0.1 + 0.2, b = 0.3;
  S.cmp = { bitSame: compareValues(1.5, 1.5, { sameEngine: true }).ok, bitDiff: compareValues(a, b, { sameEngine: true }).ok, tolUlp: compareValues(a, b, { sameEngine: false, maxUlp: 1 }).ok,
    tolUlp0: compareValues(a, b, { sameEngine: false, maxUlp: 0 }).ok, tolRel: compareValues(a, b, { sameEngine: false, relTol: 1e-15 }).ok, ulpOf: compareValues(a, b, { sameEngine: true }).ulp,
    mode: [compareValues(1, 1, { sameEngine: true }).mode, compareValues(1, 1, { sameEngine: false, relTol: 0 }).mode] };
  S.reject = { nan: thr(() => compareValues(NaN, 1, { sameEngine: true })), type: thr(() => compareValues('1', 1, { sameEngine: true })), noEngine: thr(() => compareValues(1, 1, {})),
    noTol: thr(() => compareValues(1, 1, { sameEngine: false })), badUlp: thr(() => compareValues(1, 1, { sameEngine: false, maxUlp: 0.5 })), badFp: thr(() => sameNumericEngine('xyz', '0123456789abcdef')),
    badProbe: thr(() => mathFingerprint({ version: PROBE_VERSION, functions: { sin: '0' } })), badVer: thr(() => mathFingerprint({ version: 'w0', functions: {} })) };
  const arr = compareArrays([1, a, 3], [1, b, 3], { sameEngine: false, maxUlp: 1 });
  S.arr = { ok: arr.ok, nDiffBits: arr.nDiffBits, worstUlp: arr.worstUlp, worstIndex: arr.worstIndex, len: thr(() => compareArrays([1], [1, 2], { sameEngine: true })) };
  const P1 = runProbe(), P2 = runProbe();
  const fp1 = mathFingerprint(P1), rev = { version: P1.version, functions: Object.fromEntries(Object.entries(P1.functions).reverse()) };
  const mut = { version: P1.version, functions: Object.assign({}, P1.functions, { cbrt: (BigInt('0x' + P1.functions.cbrt) ^ 1n).toString(16).padStart(16, '0') }) };
  S.probe = { det: fp1 === mathFingerprint(P2), order: fp1 === mathFingerprint(rev), mutDiff: diffFunctions(P1, mut), mutFp: mathFingerprint(mut) !== fp1, nFn: Object.keys(P1.functions).length,
    nanFree: Object.values(P1.counts).every((n) => n > 0) && P1.counts.sin === P1.n, same: sameNumericEngine(fp1, fp1), describe: describeEngine({ chromium: '1.2', mathFingerprint: fp1 }).label };
  S.explicit = { both: explicitBrowserSpec({ CHROMIUM_PATH: '/x/chrome', DFM_EXPECT_CHROMIUM: '1.2' }), onlyPath: explicitBrowserSpec({ CHROMIUM_PATH: '/x/chrome' }),
    onlyExpect: explicitBrowserSpec({ DFM_EXPECT_CHROMIUM: '1.2' }), none: explicitBrowserSpec({}), ok: assertExpectedVersion('1.2', '1.2'), bad: thr(() => assertExpectedVersion('1.3', '1.2')) };
  return S;
}
export function pureGates(S) {
  return {
    ulp: S.ulp.one === 1 && S.ulp.zero === 0 && S.ulp.tiny === 1 && S.ulp.neg === 1 && S.ulp.sign === null && S.ulp.nan === null && S.ulp.inf === null && S.ulp.str === null,
    compare: S.cmp.bitSame === true && S.cmp.bitDiff === false && S.cmp.tolUlp === true && S.cmp.tolUlp0 === false && S.cmp.tolRel === true && S.cmp.ulpOf === 1 && S.cmp.mode.join() === 'bit,tol',
    reject: Object.values(S.reject).every((v) => v === true),
    arrays: S.arr.ok === true && S.arr.nDiffBits === 1 && S.arr.worstUlp === 1 && S.arr.worstIndex === 1 && S.arr.len === true,
    probe: S.probe.det && S.probe.order && S.probe.mutDiff.join() === 'cbrt' && S.probe.mutFp && S.probe.nFn === PROBE_FUNCTIONS.length && S.probe.nanFree && S.probe.same === true && /^chromium 1\.2・指紋 [0-9a-f]{16}$/.test(S.probe.describe),
    explicit: !!S.explicit.both && S.explicit.both.executablePath === '/x/chrome' && S.explicit.both.expect === '1.2' && S.explicit.onlyPath === null && S.explicit.onlyExpect === null
      && S.explicit.none === null && S.explicit.ok === true && S.explicit.bad === true,
  };
}
