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
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const VALDIFF_VERSION = 'w312c-valdiff-1';
export const VALDIFF_TOP = ['meta', 'h4Carry', 'h4Carried'];
export const VALDIFF_RUNTIME_KEYS = ['generatedAt', 'mtime', 'carriedFrom', 'carriedOverFrom', 'wallSec', 'rateStepsPerSec', 'spentSec', 'elapsedS', 'elapsedSec',
  'wallNearBudget', 'wallMs', 'elapsedMs', 'headlessMs', 'htmlLoadMs', 'wallBeforeMs', 'wallAfterMs', 'totalWallSec', 'heavyWallSec'];
export const VALDIFF_ID_RE = /^(sha256|sha|[A-Za-z0-9]*Sha256|[A-Za-z0-9]*Sha12)$/;

/** JSON Pointer('/a/*\/b' —— `*` は 1 段の任意)を鍵の並びへ。 */
function toks(ptr) { return String(ptr).split('/').slice(1).map((t) => t.replace(/~1/g, '/').replace(/~0/g, '~')); }
/** 宣言した Pointer の位置を消す(写しの上で)。 */
function dropPointer(J, ptr) {
  const t = toks(ptr);
  const walk = (x, i) => {
    if (!x || typeof x !== 'object') return;
    const keys = t[i] === '*' ? Object.keys(x) : (Object.prototype.hasOwnProperty.call(x, t[i]) ? [t[i]] : []);
    for (const k of keys) { if (i === t.length - 1) { if (Array.isArray(x)) x[k] = '<除外>'; else delete x[k]; } else walk(x[k], i + 1); }
  };
  walk(J, 0);
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
/** 比べる写し(① 最上位の来歴 ② 宣言の Pointer ③ 鍵の名)。 */
export function valueView(J, volatilePaths, extra) {
  if (!J || typeof J !== 'object') return { view: J, droppedByName: 0 };
  const V = JSON.parse(JSON.stringify(J));
  if (!Array.isArray(V)) for (const k of VALDIFF_TOP) delete V[k];
  for (const p of volatilePaths || []) dropPointer(V, p);
  const n = dropByName(V, extra);
  return { view: V, droppedByName: n };
}
/** 値の差(Pointer の並び —— 先頭 limit 個と総数)。鍵の順は見ない・配列は順と長さを見る・葉は JSON の表現で比べる。 */
export function valueDiffs(a, b, limit) {
  const out = []; let n = 0;
  const push = (p) => { n++; if (out.length < (limit || 5)) out.push(p || '/'); };
  const walk = (x, y, p) => {
    const ax = Array.isArray(x), ay = Array.isArray(y);
    if (ax || ay) {
      if (!ax || !ay) { push(p + '(型)'); return; }
      if (x.length !== y.length) push(p + '(長さ ' + y.length + ' → ' + x.length + ')');
      for (let i = 0; i < Math.min(x.length, y.length); i++) walk(x[i], y[i], p + '/' + i);
      return;
    }
    if (x && y && typeof x === 'object' && typeof y === 'object') {
      for (const k of new Set(Object.keys(x).concat(Object.keys(y)))) {
        if (!(k in x)) { push(p + '/' + k + '(消えた)'); continue; }
        if (!(k in y)) { push(p + '/' + k + '(足された)'); continue; }
        walk(x[k], y[k], p + '/' + k);
      }
      return;
    }
    if (JSON.stringify(x) !== JSON.stringify(y)) push(p);
  };
  walk(a, b, '');
  return { n, first: out };
}
/** 1 ファイルの比べ(now・base は JSON の本文か null)。 */
export function compareFile(nowText, baseText, volatilePaths, extra) {
  if (nowText === null && baseText === null) return { status: 'absent' };
  if (baseText === null) return { status: 'added' };
  if (nowText === null) return { status: 'removed' };
  let A = null, B = null;
  try { A = JSON.parse(nowText); B = JSON.parse(baseText); } catch { return { status: 'unreadable' }; }
  const va = valueView(A, volatilePaths, extra), vb = valueView(B, volatilePaths, extra);
  const d = valueDiffs(va.view, vb.view, 5);
  return { status: d.n ? 'changed' : 'same', nDiff: d.n, firstDiffs: d.first, droppedByName: { now: va.droppedByName, base: vb.droppedByName },
    byteSame: nowText === baseText };
}

/**
 * 段ごとの値の差(再生成表 —— 段の書く JSON)。
 * @param {{root:string, base:string, steps?:string[], allFiles?:boolean, T:object, readBase?:Function, readNow?:Function, ignore?:string[]}} o
 */
export function valDiff(o) {
  const T = o.T;
  const readNow = o.readNow || ((f) => { try { return fs.readFileSync(path.join(o.root, f), 'utf8'); } catch { return null; } });
  const readBase = o.readBase || ((f) => { try { return execFileSync('git', ['-C', o.root, 'show', o.base + ':' + f], { encoding: 'utf8', maxBuffer: 1 << 30, stdio: ['ignore', 'pipe', 'ignore'] }); } catch { return null; } });
  const want = o.steps && o.steps.length ? new Set(o.steps) : null;
  const rows = [];
  for (const st of T.REGEN_STEPS) {
    if (want && !want.has(st.key)) continue;
    if (!want && !o.allFiles && st.role === 'history') continue;
    const files = [...new Set((st.outs || []).concat(st.merges || []))].filter((f) => /\.json$/.test(f));
    if (!files.length) { rows.push({ key: st.key, status: 'no-json', files: [] }); continue; }
    const fr = files.map((f) => Object.assign({ file: f }, compareFile(readNow(f), readBase(f), T.volatilePathsOf(f), o.ignore)));
    const st2 = fr.some((z) => z.status === 'changed') ? 'changed' : fr.some((z) => z.status === 'unreadable') ? 'unreadable'
      : fr.some((z) => z.status === 'added') ? 'added' : fr.some((z) => z.status === 'removed') ? 'removed' : fr.every((z) => z.status === 'absent') ? 'absent' : 'same';
    rows.push({ key: st.key, status: st2, files: fr });
  }
  const count = {}; for (const r of rows) count[r.status] = (count[r.status] || 0) + 1;
  return { version: VALDIFF_VERSION, base: o.base, rows, count,
    excluded: { top: VALDIFF_TOP, declared: '再生成表の volatilePaths(正本ごと)と META_RUN', byName: VALDIFF_RUNTIME_KEYS, idPattern: String(VALDIFF_ID_RE), line: 'line(整数)', ignore: o.ignore || [] } };
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
  r.ok = !!(r.same && r.changed && r.declared && r.ignore && r.files && r.stepsOk);
  return r;
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) {
  const argv = process.argv.slice(2);
  const getArg = (k, d) => { const i = argv.indexOf(k); return (i >= 0 && argv[i + 1]) ? argv[i + 1] : d; };
  if (argv.includes('--self-test')) { const r = valDiffSelfTest(); console.log(JSON.stringify(r, null, 1)); process.exit(r.ok ? 0 : 1); }
  const base = getArg('--base', null);
  if (!base) { console.error('使い方: node tools/regen-valdiff.mjs --base <rev> [--json <out>] [--steps 段,段] [--all-files] [--ignore 鍵,鍵] | --self-test'); process.exit(2); }
  try { execFileSync('git', ['-C', ROOT, 'rev-parse', '--verify', base + '^{commit}'], { stdio: 'ignore' }); } catch { console.error('rev が無い: ' + base); process.exit(2); }
  const T = await import(pathToFileURL(path.join(ROOT, 'tests', 'lib-w281a-regentable.mjs')).href);
  const steps = (getArg('--steps', '') || '').split(',').filter(Boolean);
  const t0 = Date.now();
  const ignore = (getArg('--ignore', '') || '').split(',').filter(Boolean);
  const r = valDiff({ root: ROOT, base, steps, allFiles: argv.includes('--all-files'), T, ignore });
  for (const z of r.rows) {
    if (z.status === 'same' || z.status === 'no-json' || z.status === 'absent') continue;
    const f = z.files.filter((w) => w.status !== 'same').map((w) => `${w.file.replace('tests/out/', '')} ${w.status}${w.nDiff ? '(' + w.nDiff + ' か所: ' + w.firstDiffs.slice(0, 3).join(' ') + ')' : ''}`).join(' / ');
    console.log(`  ${z.status.padEnd(10)} ${z.key.padEnd(22)} ${f}`);
  }
  console.log(`regen-valdiff(${VALDIFF_VERSION})基点 ${base}: 段 ${r.rows.length} —— ${Object.entries(r.count).map(([k, v]) => k + ' ' + v).join(' / ')}(${((Date.now() - t0) / 1000).toFixed(1)} s)`);
  const js = getArg('--json', null);
  if (js) fs.writeFileSync(path.resolve(js), JSON.stringify(r, null, 1) + '\n');
  process.exit(0);
}
