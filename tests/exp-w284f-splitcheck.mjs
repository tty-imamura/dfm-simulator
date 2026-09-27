#!/usr/bin/env node
// 第284便f(原仮定者の裁定(第74報)⑥・統括の検証項目 R94): **直列の較正正本と分割で作った較正正本の同一性の照合**。
//
//   node tests/exp-w284f-splitcheck.mjs --a <直列 calaudit.json> --b <分割 calaudit.json> [--a-diag <…>] [--b-diag <…>] [--json <記録>]
//
// 照合: 2 ファイルの全 JSON の差を Pointer で列挙し、(1) 再生成表で宣言した除外 Pointer(実行時刻・壁時計・非物理の同一性 meta
// —— `volatilePathsOf`)(2) 測定コードの同一性(`measurementCodeSha256`・`measurementCodeFiles` —— 分割の器を足したので変わる)
// (3) それ以外 に分ける。**(3) が 0 件**で、(1)(2) を除いた安定 hash が一致することを「ビット同一」と呼ぶ(物理欄は 1 つも除かない)。
// 走らせない・正本を書かない(読むだけ)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const L = await import(pathToFileURL(path.join(ROOT, 'tests', 'lib-w284f-calshard.mjs')).href);
const RT = await import(pathToFileURL(path.join(ROOT, 'tests', 'lib-w281a-regentable.mjs')).href);
const SC = await import(pathToFileURL(path.join(ROOT, 'tests', 'lib-w281a-scope.mjs')).href);
const argv = process.argv.slice(2);
const getArg = (k) => { const i = argv.indexOf(k); return (i >= 0 && argv[i + 1]) ? path.resolve(argv[i + 1]) : null; };
const CAL = 'tests/out/calaudit-w249.json', DIAG = 'tests/out/calaudit-w249-diag.json';
export const CODE_PTRS = ['/meta/measurementCodeSha256', '/meta/measurementCodeFiles', '/mergeKey/measurementCodeSha256', '/mergeKey/measurementCodeFiles',
  '/fourValues/current/measurementCodeSha256'];
// 壁時計から作る記録の欄で、除外 Pointer に宣言されていないもの(第284便f の実測で見つかった —— `budgetHit = wallSec ≥ 0.9×予算`)。
// 分割とは無関係に容器の負荷で動く(直列どうしでも動く)ので別に数える。**物理欄ではない**(走行長・判定に入らない —— 第270便a)。
export const WALL_DERIVED_PTRS = ['/presets/*/run/timeBudget/*/budgetHit'];
// diag の dt/4 転記元(h4Store)の壁時計・時刻(新しく走らせた h4 の記録と、前回の diag の時刻の写し)—— 除外 Pointer に未宣言。
// 正本(直列の鎖)と比べるとき、その鎖で新しく走った h4 は必ず動く(分割とは無関係)。**物理欄ではない**
export const WALL_DERIVED_DIAG_PTRS = ['/h4Store/carriedFrom', '/h4Store/entries/*/generatedAt', '/h4Store/entries/*/run/wallSec', '/h4Store/entries/*/run/rateStepsPerSec',
  '/h4Store/entries/*/run/timeBudget/wallSec', '/h4Store/entries/*/run/timeBudget/rateStepsPerSec', '/h4Store/entries/*/run/timeBudget/budgetHit',
  '/h4Store/entries/*/run/stopRule/wallSec', '/h4Store/entries/*/run/stopRule/rateStepsPerSec'];

function one(fa, fb, rel) {
  const A = JSON.parse(fs.readFileSync(fa, 'utf8')), B = JSON.parse(fs.readFileSync(fb, 'utf8'));
  const vp = RT.volatilePathsOf(rel);
  const d = L.jsonDiff(A, B);
  const c = L.classifyDiff(d, vp, CODE_PTRS);
  const WD = rel === CAL ? WALL_DERIVED_PTRS : WALL_DERIVED_DIAG_PTRS;
  const wall = c.other.filter((z) => WD.some((w) => L.pointerMatches(w, z.ptr)));
  c.other = c.other.filter((z) => !wall.includes(z));
  const ex = vp.concat(CODE_PTRS.filter((p) => rel === CAL));
  const sa = SC.stableValueSha(A, ex), sb = SC.stableValueSha(B, ex);
  const exW = ex.concat(WD);
  const saW = SC.stableValueSha(A, exW), sbW = SC.stableValueSha(B, exW);
  const short = (z) => ({ ptr: z.ptr, kind: z.kind, a: JSON.stringify(z.a === undefined ? null : z.a).slice(0, 80), b: JSON.stringify(z.b === undefined ? null : z.b).slice(0, 80) });
  const heads = (arr) => { const m = {}; for (const z of arr) { const h = z.ptr.split('/').slice(0, 2).join('/'); m[h] = (m[h] || 0) + 1; } return m; };
  return { file: rel, diffs: d.length, declared: c.declared.length, code: c.code.length, wallDerived: wall.map(short), other: c.other.length,
    stableSameExclWallDerived: saW === sbW,
    declaredHeads: heads(c.declared), otherList: c.other.slice(0, 40).map(short), stableA: sa, stableB: sb, stableSame: sa === sb,
    bytesSame: fs.readFileSync(fa).equals(fs.readFileSync(fb)),
    // ok: 物理欄を含む「その他」の差 0 かつ安定 hash 一致(壁時計から作る未宣言の記録欄 budgetHit だけは別に数えて除く)
    ok: c.other.length === 0 && saW === sbW };
}

const a = getArg('--a'), b = getArg('--b');
if (!a || !b) { console.error('使い方: --a <直列> --b <分割> [--a-diag --b-diag] [--json <記録>]'); process.exit(2); }
const res = { rows: [one(a, b, CAL)] };
if (getArg('--a-diag') && getArg('--b-diag')) res.rows.push(one(getArg('--a-diag'), getArg('--b-diag'), DIAG));
res.ok = res.rows.every((r) => r.ok);
const js = getArg('--json');
if (js) fs.writeFileSync(js, JSON.stringify(res, null, 1));
console.log(JSON.stringify(res, null, 1));
process.exit(res.ok ? 0 : 1);
