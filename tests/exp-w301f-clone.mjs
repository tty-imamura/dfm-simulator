// 第301便f(DECISIONS v58 の AN288 ③④ —— 「二次元の本の複製の漏れは優先度を上げて次便の先頭で原因から」「前の本の鍵の持ち越しは build で
// 機能ごとに初期化」・統括の検証項目 R184)—— **複製(cloneSimState)とチェックポイント(保存→復帰)の全本の同一**と、
// **本を切り替えた後の内蔵の sim が新しく組んだ sim と同じか**の器(Node だけ —— 対象 html の inline script を
// tests/lib-w279b-headless.mjs の loadHtmlHeadless で読み、アプリの入口〔loadPreset・cloneSimState・ckSnapOne/ckRestoreOne・appStepDt〕を
// そのまま呼ぶ。UI のボタンは押さない)。
//
// ■ 何を測るか(在位の全本 —— 宣言から列挙: familyRole が "retired" でない内蔵の本。二次元・三次元とも)
//   本ごとに、直前に別の本を開いた内蔵の sim(G)へ loadPreset で本を開き(アプリと同じ)、同じ本を makeSim → build で新しく組んだ sim(F)と並べて
//     (1) 開いた直後: G の鍵のうち F に無い鍵(前の本の持ち越し)と、両方にある鍵で値の違う鍵
//     (2) N 步 → 複製 C=cloneSimState()・保存 o=ckSnapOne(G) → G・C・F を M 步 → G と C(複製)・G と F(持ち越し)の全欄の指紋の差
//     (3) 復帰 ckRestoreOne(G,o) → M 步 → (2) の G(保存しなかった走行)との全欄の指紋の差
//     (4) 作業配列の確かめ: もう 1 つの複製 C2 の SIM_STEP_SCRATCH(html の宣言 —— 毎步作り直す作業配列)を NaN/-7/255 で塗って M 步 → G との全欄の差
//         (次の步が読まないなら差は無い —— 「毎步作り直す作業配列」と「次の步が読む履歴」の分け方を機械で確かめる)
//   (5) 逆順の開き直し: 本を逆の順に開き(前の本は 2 步走らせる)、開いた直後を新しく組んだ sim と比べる(build の機能ごとの初期化の網を広げる)
//   全欄の指紋 = sim の自前の鍵の全部(関数と値が undefined の鍵を除く —— 型付き配列は型・長さ・バイト列の sha1、数値は -0 を区別、入れ子は再帰)から SIM_STEP_SCRATCH を除いたもの。
//   状態の契約(複製と保存の両方が運ぶもの)の正本は html の CK_ARRS・CK_SC・CK_DEEP(この器は一覧を持たない —— 手書きの一覧を第二の正本にしない)。
//
// ■ 言わないこと: 「全部を写せば同一になる」「浮動小数の非決定性」。差が出たら原因の欄を名指しする(第301便f の原因は U_rep の中点補正が読む duT の写し漏れ)。
//
// ■ 使い方
//   node tests/exp-w301f-clone.mjs   → 正本 tests/out/clone-w301f.json(段 clone-301f)
//   W301F_OUT=<json> で出力先を変える(試走は正本を書かない)・W301F_TARGET=<html>(既定 beta/index.html)・W301F_IDS=<id,…> で本を絞る・
//   W301F_N / W301F_M で步数(既定 20 / 20)・W301F_SCRATCH=<鍵,…> は基点の html を同じ作業配列の一覧で測るときだけ。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlHeadless } from './lib-w279b-headless.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
// 第281便a の領域 hash の宣言(全本を走らせる —— presets "all")
const REGEN_SCOPE = {"presets":"all","roots":["$","HP.allPresets","HP.loadPreset","SIM_STEP_SCRATCH","appStepDt","applyQLock","ckRestoreOne","ckSnapOne","cloneSimState","ctx","currentPreset","makeSim","qLockOn","sim"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w301f-clone-1';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

/* ── 全欄の指紋 ── */
const sha = (b) => crypto.createHash('sha1').update(b).digest('hex').slice(0, 16);
function taSig(v) { return 'T:' + v.constructor.name + ':' + v.length + ':' + sha(Buffer.from(v.buffer, v.byteOffset, v.byteLength)); }
function valSig(v, root, seen, depth) {
  if (v === null) return 'null';
  const t = typeof v;
  if (t === 'undefined') return null;   // 値が undefined の鍵は「鍵が無い」と同じに扱う(コードは値だけを読む —— build の初期化は delete せず undefined にする)
  if (t === 'number') return Object.is(v, -0) ? 'n:-0' : 'n:' + String(v);
  if (t === 'boolean' || t === 'string' || t === 'bigint') return t[0] + ':' + String(v);
  if (t === 'function' || t === 'symbol') return null;
  if (ArrayBuffer.isView(v)) return taSig(v);
  if (v === root) return '<S>';
  if (seen.has(v)) return '<cyc>';
  if (depth > 6) return '<deep>';
  seen.add(v);
  let out;
  if (Array.isArray(v)) out = '[' + v.map((x) => { const s = valSig(x, root, seen, depth + 1); return s === null ? (x === undefined ? 'undef' : 'fn') : s; }).join(',') + ']';
  else if (v instanceof Map) out = 'Map{' + [...v.entries()].map(([k, x]) => String(k) + '=' + valSig(x, root, seen, depth + 1)).join(',') + '}';
  else if (v instanceof Set) out = 'Set{' + [...v.values()].map((x) => valSig(x, root, seen, depth + 1)).join(',') + '}';
  else {
    const ks = Object.keys(v).sort(), parts = [];
    for (const k of ks) { const s = valSig(v[k], root, seen, depth + 1); if (s !== null) parts.push(k + '=' + s); }
    out = '{' + parts.join(',') + '}';
  }
  seen.delete(v);
  return out.length > 200 ? 'H:' + sha(out) : out;
}
/** sim の自前の鍵の全部 → {鍵: 指紋}(関数は除く) */
export function simPrint(S) {
  const o = {};
  for (const k of Object.keys(S).sort()) { const s = valSig(S[k], S, new WeakSet(), 0); if (s !== null) o[k] = s; }
  return o;
}
export function printDiff(a, b) {
  const onlyA = [], onlyB = [], val = [];
  for (const k of Object.keys(a)) { if (!(k in b)) onlyA.push(k); else if (a[k] !== b[k]) val.push(k); }
  for (const k of Object.keys(b)) if (!(k in a)) onlyB.push(k);
  return { onlyA, onlyB, val };
}
/** 主要な欄の最大差(診断 —— 位置・速度・Tint・自転・回転角) */
function maxAbs(A, B) {
  const o = {};
  for (const k of ['x', 'y', 'z', 'vx', 'vy', 'vz', 'spin', 'rotA', 'Tint']) {
    if (!A[k] || !B[k]) continue;
    let m = 0; const n = Math.min(A.n, B.n);
    for (let i = 0; i < n; i++) { const d = Math.abs(A[k][i] - B[k][i]); if (d > m || (Number.isNaN(d) && !(Number.isNaN(A[k][i]) && Number.isNaN(B[k][i])))) m = Number.isNaN(d) ? Infinity : d; }
    if (m > 0) o[k] = m;
  }
  return o;
}

/* ── 1 本の測定 ── */
export function measureBook(H, p, o) {
  const E = H.evalExpr, HP = H.HP;
  const N = o.N, M = o.M;
  HP.loadPreset(p.id, false);
  const G = E('sim'), dt = E('appStepDt')(G);
  const F = E('makeSim')(); F.build(JSON.parse(JSON.stringify(E('currentPreset'))));
  if (E('qLockOn')) E('applyQLock')(F);
  F.overlays = Object.assign({}, G.overlays);
  const sc = o.scratch;
  const strip = (P) => { for (const k of sc) delete P[k]; return P; };
  const d0 = printDiff(strip(simPrint(G)), strip(simPrint(F)));
  const row = { id: p.id, emoji: p.emoji || '', coord: ((p.physics || {}).coord === '3d') ? '3d' : '2d', n: G.n, thermal: G.thermal, dt,
    open: { carried: d0.onlyA, missing: d0.onlyB, val: d0.val } };
  for (let k = 0; k < N; k++) { G.step(dt); F.step(dt); }
  const C = E('cloneSimState')(), ck = E('ckSnapOne')(G);
  // 作業配列の確かめ: もう 1 つ複製して SIM_STEP_SCRATCH を塗る(浮動小数は NaN・整数は -7・Uint8 は 255)—— 次の步が読まないなら M 步後の全欄は同じ
  const C2 = E('cloneSimState')(), painted = [];
  for (const k of sc) { const a = C2[k]; if (!a || !ArrayBuffer.isView(a)) continue;
    a.fill((a instanceof Float32Array || a instanceof Float64Array) ? NaN : (a instanceof Uint8Array ? 255 : -7)); painted.push(k); }
  const nanG = () => { for (const k of ['x', 'y', 'vx', 'vy']) if (G[k]) for (let i = 0; i < G.n; i++) if (!Number.isFinite(G[k][i])) return true; return false; };
  for (let k = 0; k < M; k++) { G.step(dt); C.step(dt); F.step(dt); C2.step(dt); }
  const pG = strip(simPrint(G)), dC = printDiff(pG, strip(simPrint(C))), dF = printDiff(pG, strip(simPrint(F)));
  row.clone = { ok: dC.val.length === 0 && dC.onlyB.length === 0, val: dC.val, onlyG: dC.onlyA, onlyC: dC.onlyB, max: maxAbs(G, C) };
  const dS = printDiff(pG, strip(simPrint(C2)));
  row.scratch = { ok: dS.val.length === 0 && dS.onlyB.length === 0, painted, val: dS.val, onlyC2: dS.onlyB };
  row.fresh = { ok: dF.val.length === 0 && dF.onlyA.length === 0 && dF.onlyB.length === 0, val: dF.val, onlyG: dF.onlyA, onlyF: dF.onlyB, max: maxAbs(G, F) };
  const tAfter = G.t;
  E('ckRestoreOne')(G, ck);
  for (let k = 0; k < M; k++) G.step(dt);
  const dR = printDiff(pG, strip(simPrint(G)));
  row.ck = { ok: dR.val.length === 0 && dR.onlyA.length === 0 && dR.onlyB.length === 0, val: dR.val, onlyBefore: dR.onlyA, onlyAfter: dR.onlyB, tSame: G.t === tAfter };
  row.nan = nanG();
  row.ok = row.clone.ok && row.ck.ok && row.fresh.ok && row.scratch.ok;
  return row;
}

export async function main() {
  const TARGET = process.env.W301F_TARGET || 'beta/index.html';
  const OUT = process.env.W301F_OUT || path.join(ROOT, 'tests', 'out', 'clone-w301f.json');
  const N = Number(process.env.W301F_N) || 20, M = Number(process.env.W301F_M) || 20;
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const targetSha256 = crypto.createHash('sha256').update(fs.readFileSync(html)).digest('hex');
  const t0 = Date.now();
  const log = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a);
  const W281A_SCOPE = w281aScopeStamp(html, REGEN_SCOPE);
  const H = loadHtmlHeadless(html);
  const E = H.evalExpr, HP = H.HP;
  // 一致の外に置く欄(html の宣言 —— 無い世代は空)
  // W301F_SCRATCH=<鍵,…> は基点の html(SIM_STEP_SCRATCH が無い世代)を同じ一覧で測るときだけ(正本は html の宣言を読む)
  const scratch = process.env.W301F_SCRATCH ? process.env.W301F_SCRATCH.split(',') : E("typeof SIM_STEP_SCRATCH!=='undefined' ? SIM_STEP_SCRATCH.slice() : []");
  const want = process.env.W301F_IDS ? process.env.W301F_IDS.split(',') : null;
  const books = HP.allPresets().filter((p) => p.familyRole !== 'retired' && (!want || want.includes(p.id)));
  const rows = [];
  for (const p of books) {
    const t = Date.now();
    const r = measureBook(H, p, { N, M, scratch });
    r.wallSec = (Date.now() - t) / 1000;
    rows.push(r);
    log(`${r.ok ? 'ok ' : 'NG '} ${p.emoji || ''} ${p.id} ${r.coord} n=${r.n} ${r.thermal}`
      + (r.clone.ok ? '' : ` 複製[${r.clone.val.concat(r.clone.onlyC).slice(0, 8).join(',')}] ${JSON.stringify(r.clone.max)}`)
      + (r.ck.ok ? '' : ` 復帰[${r.ck.val.concat(r.ck.onlyAfter).slice(0, 8).join(',')}]`)
      + (r.scratch.ok ? '' : ` 作業配列を塗ると[${r.scratch.val.concat(r.scratch.onlyC2).slice(0, 8).join(',')}]`)
      + (r.fresh.ok ? '' : ` 持越[${r.fresh.val.concat(r.fresh.onlyG, r.fresh.onlyF).slice(0, 8).join(',')}] ${JSON.stringify(r.fresh.max)}`)
      + (r.open.carried.length ? ` 開いた直後の持越 ${r.open.carried.length} 鍵` : '') + ` ${r.wallSec}s`);
  }
  // 逆順の開き直し(build の機能ごとの初期化の網を広げる —— 前の本を 2 步走らせてから次の本を開き、開いた直後を新しく組んだ sim と比べる)
  const reverse = [];
  for (const p of books.slice().reverse()) {
    HP.loadPreset(p.id, false);
    const G = E('sim'), F = E('makeSim')(); F.build(JSON.parse(JSON.stringify(E('currentPreset'))));
    if (E('qLockOn')) E('applyQLock')(F);
    F.overlays = Object.assign({}, G.overlays);
    const strip = (P) => { for (const k of scratch) delete P[k]; return P; };
    const d = printDiff(strip(simPrint(G)), strip(simPrint(F)));
    if (d.onlyA.length || d.onlyB.length || d.val.length) reverse.push({ id: p.id, carried: d.onlyA, missing: d.onlyB, val: d.val });
    const dt = E('appStepDt')(G); for (let k = 0; k < 2; k++) G.step(dt);
  }
  log(`逆順の開き直し ${books.length} 本: 新しく組んだ sim と違う ${reverse.length} 本`);
  const cnt = (f) => rows.filter(f).length;
  const out = {
    version: HARNESS_VERSION, generator: 'tests/exp-w301f-clone.mjs', target: TARGET, targetSha256,
    ruling: 'DECISIONS v58 の AN288 ③④(二次元の本の複製の漏れを原因から・前の本の鍵の持ち越しは build で機能ごとに初期化)・統括の検証項目 R184',
    steps: { N, M }, scratch,
    summary: { books: rows.length, d2: cnt((r) => r.coord === '2d'), d3: cnt((r) => r.coord === '3d'),
      cloneOk: cnt((r) => r.clone.ok), ckOk: cnt((r) => r.ck.ok), freshOk: cnt((r) => r.fresh.ok), scratchOk: cnt((r) => r.scratch.ok), allOk: cnt((r) => r.ok),
      openCarried: cnt((r) => r.open.carried.length > 0 || r.open.val.length > 0), nan: cnt((r) => r.nan), reverseOpenNg: reverse.length },
    rows, reverse,
  };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w301f-clone.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第301便f', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION,
    engine: 'Node の headless(tests/lib-w279b-headless.mjs の loadHtmlHeadless —— html の本文をそのまま実行・1 プロセス・アプリの入口 loadPreset/cloneSimState/ckSnapOne/ckRestoreOne)',
    notClaim: ['全部を写せば同一になる', '浮動小数の非決定性'] });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  log('→', path.relative(ROOT, OUT), JSON.stringify(out.summary), out.elapsedS + ' s');
}
if (IS_MAIN) await main();
