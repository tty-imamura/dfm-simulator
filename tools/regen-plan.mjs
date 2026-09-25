#!/usr/bin/env node
// 第281便a(原仮定者の裁定(第71報)・AN16 採用・統括の検証項目 R71)— **正本の再生成計画**を出す。
//
// 2 つの html(基点と今)と正本の再生成表(`tests/lib-w281a-regentable.mjs`)から、正本ごとに
//   再生成(regen)/ 再利用(reuse —— 対象 html の hash か領域 hash が一致)/ 履歴(history)/
//   常時(always)/ 再計画(recheck —— 依存先が走った後に計画し直す)
// を判定し、依存順(charonInput・geo3・mercury・samplestatus は calaudit の後)の実行計画を JSON で出す。
// **走らせない・正本を書かない**(統括の chain スクリプトがこの JSON を読んで走らせる)。
//
// 使い方:
//   node tools/regen-plan.mjs [--html <候補 html>] [--base <基点 html>] [--out <json>] [--quiet]
//     --html … 照合する html(既定 beta/index.html)。正本の target が beta/index.html のとき、この html で照合する
//              (「CSS だけ変えた一時コピー」のような候補を、実物を書き換えずに試せる)
//     --base … 基点の html(情報: 基点でも領域が同じだったか)
//     --out  … 計画 JSON の出力先(既定 tests/out/regen-plan-w281a.json —— コミットしない作業物)
//   第282便e: 各段に `causeText`(どの入力・式・受理規則で無効化されたか)を出す。領域の不一致の内訳
//     (プリセット/受理規則/式〔関数名〕/S._core/定数)は、--base が刻印時の html(meta.targetSha256 と同じ sha)の
//     ときだけ引ける。領域 hash・安定 hash は**刻印の版で**照合する(旧版の刻印は旧版で引き直す)。
// 終了コード: 0(計画を出した)/ 2(表に無い正本が lint の CANON にある等、表が壊れている)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const getArg = (k, d) => { const i = argv.indexOf(k); return (i >= 0 && argv[i + 1]) ? argv[i + 1] : d; };
const resolve = (p) => (p ? (path.isAbsolute(p) ? p : path.join(ROOT, p)) : null);
const HTML = resolve(getArg('--html', 'beta/index.html'));
const BASE = resolve(getArg('--base', null));
const OUT = resolve(getArg('--out', 'tests/out/regen-plan-w281a.json'));
const QUIET = argv.includes('--quiet');

const T = await import(pathToFileURL(path.join(ROOT, 'tests', 'lib-w281a-regentable.mjs')).href);
const t0 = Date.now();
const plan = T.planRegen({ root: ROOT, html: HTML, baseHtml: BASE });
plan.generatedAt = new Date().toISOString();
plan.planMs = Date.now() - t0;
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(plan, null, 1));
if (!QUIET) {
  const fmt = (s) => (s >= 3600 ? (s / 3600).toFixed(2) + ' h' : (s / 60).toFixed(1) + ' min');
  console.log(`regen-plan: html ${plan.html}(${String(plan.htmlSha256).slice(0, 12)}…)`
    + (plan.baseHtml ? ` / base ${plan.baseHtml}` : ''));
  console.log('  件数: ' + Object.entries(plan.count).map(([k, v]) => k + ' ' + v).join(' / '));
  console.log(`  所要(実測秒の和): 下限 ${fmt(plan.secLower)}(regen+always)〜 上限 ${fmt(plan.secUpper)}(+recheck)`);
  for (const r of plan.steps) if (r.status !== 'reuse' && r.status !== 'history')
    console.log(`  ${r.status.padEnd(7)} ${r.key.padEnd(16)} ${String(r.sec).padStart(5)} s  ${(r.causeText || r.reasons[0] || '').slice(0, 110)}`);
  console.log('  → ' + OUT);
}
