#!/usr/bin/env node
// 第341便c(統括の検証項目 R366・AN798): **真偽で正本に書いている判定のうち、丸めの残りで反転しうるものを数える道具**(正本は書かない・読むだけ)。
//   器(runAll を持つ —— 第338便b・d・e・f・第340便b・d・e・f・g・第337便i・j・k)を、第338便c の尺度の測り方(Math の関数の戻り値を ±1〜2 ulp ずらす)で
//   SEEDS(第338便c の 2 つ)+ 追加の種(EXTRA_SEEDS)の数だけ走らせ直し、次を数える(tests/lib-w341c-judgescale.mjs の surveyTree):
//   ① 反転した見本: ずらした走行で真偽・文字列が元と違った葉(実際に反転した —— 3 値へ直す第一の対象)
//   ② 近い葉: 真偽の葉と同じ物の中に、尺度 σ > 0 で |値| ≤ NEAR_FACTOR × σ の数の葉が在るもの(判定がその数の符号・大小で決まるなら反転しうる —— 字句で結び付けないので候補)
//   ③ 真偽の葉の数と種類(道の添字を # にした形)。
//   「未解決」「反転しうる」は数値の精度の話で、物理の量が 0 だという主張ではない。許容・係数は変えない。
// 使い方: node tools/judge-survey341c.mjs [器の名 …] [--extra N] [--json <出力>]   器の名: 338b 338d 338e 338f 340b 340d 340e 340f 340g 337i 337j 337k
//   (器の走り直しは 2 + N 回 —— 1 分を超える器〔340d・340g・337i〕は番号札で)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const L = await import('file://' + path.join(ROOT, 'tests', 'lib-w341c-judgescale.mjs'));
const argv = process.argv.slice(2), ji = argv.indexOf('--json'), xi = argv.indexOf('--extra');
const jsonOut = ji >= 0 ? argv[ji + 1] : null, extra = xi >= 0 ? Number(argv[xi + 1]) : L.DECL.EXTRA_SEEDS.length;
const skip = new Set([...(ji >= 0 ? [ji, ji + 1] : []), ...(xi >= 0 ? [xi, xi + 1] : [])]);
const which = argv.filter((a, k) => !skip.has(k) && !a.startsWith('--'));
const names = which.length ? which : Object.keys(L.SURVEY_HARNESS);
const report = { node: process.version, version: L.LIB_VERSION, decl: L.DECL, extra, sets: {} };
for (const w of names) {
  const h = L.SURVEY_HARNESS[w]; if (!h) { console.error('知らない器: ' + w); process.exit(2); }
  const X = await import('file://' + path.join(ROOT, 'tests', h.harness));
  const t0 = Date.now();
  const r = L.surveyRun(() => { const R = X.runAll(); delete R.timing; return R; }, { extra });
  r.wallSec = Math.round((Date.now() - t0) / 100) / 10; r.harness = h.harness; r.out = h.out;
  report.sets[w] = r;
  console.log(`${w}: 真偽 ${r.nBool}(種類 ${r.nBoolKinds})・反転した見本 ${r.flips.length}(種類 ${r.flipKinds.length})・近い葉を持つ真偽 ${r.nearBool}(種類 ${r.nearKinds.length})・${r.wallSec} s`);
  for (const k of r.flipKinds.slice(0, 8)) console.log('   反転 ' + k);
  for (const k of r.nearKinds.slice(0, 8)) console.log('   近い ' + k[0] + ' ← ' + k[1]);
}
if (jsonOut) fs.writeFileSync(jsonOut, JSON.stringify(report, null, 1) + '\n');
