// 第278便c(R55): 符号修正の前後で**格子の正本 nsgrid-w277c.json が動いたか**を葉ごとに突き合わせる器。
// 旧正本(w277c-1)を引数で渡す: node tests/exp-w278c-nsgriddiff.mjs <旧 JSON> [新 JSON]
// 比べるのは stage1〜stage6・systems・observedMaterial の**数値と文字列の葉**。meta(来歴・時刻・版)と、
// 第278便c で**足した鍵**(whyCode・failed・gateDt2・whyBreakdown・time_scale_gain 等)は「追加」として別に数える。
// 旧 JSON は git から取り出せる: git show d09f2ea:tests/out/nsgrid-w277c.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const oldP = process.argv[2];
const newP = process.argv[3] || path.join(ROOT, 'tests', 'out', 'nsgrid-w277c.json');
if (!oldP) { console.error('使い方: node tests/exp-w278c-nsgriddiff.mjs <旧 JSON> [新 JSON]'); process.exit(2); }
const A = JSON.parse(fs.readFileSync(oldP, 'utf8')), B = JSON.parse(fs.readFileSync(newP, 'utf8'));
const res = { leaves: 0, same: 0, changed: [], added: 0, removed: [] };
const SKIP = new Set(['seconds']);
function walk(a, b, p) {
  if (a === undefined) { res.added++; return; }
  if (b === undefined) { res.removed.push(p); return; }
  if (a !== null && typeof a === 'object') {
    for (const k of Object.keys(b)) if (!(k in a)) res.added++;
    for (const k of Object.keys(a)) { if (SKIP.has(k)) continue; walk(a[k], b[k], p + '.' + k); }
    return;
  }
  res.leaves++;
  if (Object.is(a, b)) res.same++; else res.changed.push({ path: p, old: a, new: b });
}
for (const k of ['systems', 'observedMaterial', 'stage1', 'stage2', 'stage3', 'stage4', 'stage5', 'stage6']) walk(A[k], B[k], k);
// 文字列のうち「kind」「why」など説明文の変化と、数値の変化を分ける
const numChanged = res.changed.filter((c) => typeof c.old === 'number' || typeof c.new === 'number');
const strChanged = res.changed.filter((c) => !(typeof c.old === 'number' || typeof c.new === 'number'));
const out = { oldVersion: (A.meta && A.meta.premise && A.meta.premise.version) || null,
  newVersion: (B.meta && B.meta.premise && B.meta.premise.version) || null,
  leaves: res.leaves, same: res.same, numericChanged: numChanged.length, stringChanged: strChanged.length,
  added: res.added, removed: res.removed.length,
  numericSamples: numChanged.slice(0, 10), stringSamples: strChanged.slice(0, 10) };
console.log(JSON.stringify(out, null, 1));
