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
//   第318便a(AN427 ⑤): 刻印の道具(tests/lib-w281a-scope.mjs・tests/lib-w281a-regentable.mjs)を刻印だけに使う器の段は、道具の sha の違いを
//     「式」にせず刻印を今の道具で照合するだけ(一致 → 走らせ直さない —— 件数の「道具の照合」・段の toolChecked)。
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
// 第320便d(AN478): `--roster [--write|--check]` —— 本ごとに分けられる器の名簿(tests/data-w320d-perbook.json)を作る/照合する(計画は引かない)
if (argv.includes('--roster')) {
  const PB = await import(pathToFileURL(path.join(ROOT, 'tests', 'lib-w320d-perbook.mjs')).href);
  const doc = PB.rosterDoc({ root: ROOT, html: HTML });
  const file = path.join(ROOT, PB.ROSTER_FILE);
  console.log(`roster(AN478 —— ${doc.version}): A ${doc.count.A}(${doc.secByTier.A} s)・B ${doc.count.B}(${doc.secByTier.B} s)・C ${doc.count.C}(${doc.secByTier.C} s)`);
  for (const r of doc.rows) if (r.tier !== 'C') console.log(`  ${r.tier} ${r.key.padEnd(20)} ${r.why.slice(0, 110)}`);
  if (argv.includes('--write')) { fs.writeFileSync(file, JSON.stringify(doc, null, 1) + '\n'); console.log('  → ' + PB.ROSTER_FILE); }
  if (argv.includes('--check')) {
    let cur = null; try { cur = JSON.parse(fs.readFileSync(file, 'utf8')); } catch { cur = null; }
    const keys = (d) => (d && d.rows ? d.rows.map((z) => z.key).sort().join(',') : '');
    const ok = !!cur && cur.version === doc.version && keys(cur) === keys(doc);
    console.log(ok ? '  --check: 名簿の段の集合と版は今の表と同じ' : '  --check: 名簿が今の表と違う(統合で段が増えた —— node tools/regen-plan.mjs --roster --write で引き直す)');
    process.exit(ok ? 0 : 1);
  }
  process.exit(0);
}
const t0 = Date.now();
const plan = T.planRegen({ root: ROOT, html: HTML, baseHtml: BASE });
plan.generatedAt = new Date().toISOString();
plan.planMs = Date.now() - t0;
// 第320便d(決断事項 AN478・R265): `--classify` で領域の差を**核・本・表示**に分ける(tests/lib-w320d-perbook.mjs —— 段の判定〔status〕は変えない)。
//   刻印時の html は --base・--stamp-html <f>(何度でも)・--stamp-git <N>(beta/index.html の直近 N 版 —— 写しは --stamp-dir〔既定 os の一時〕)から sha で引く。
//   行ごとに「本 X の変更だけで動く(名簿 A/B/C)」/「核: 式 …」/「表示だけ」を plan.classify320 に出す。引けない刻印は unknown
if (argv.includes('--classify')) {
  const PB = await import(pathToFileURL(path.join(ROOT, 'tests', 'lib-w320d-perbook.mjs')).href);
  const t1 = Date.now();
  const files = argv.map((a, i) => (a === '--stamp-html' ? resolve(argv[i + 1]) : null)).filter(Boolean).concat(BASE ? [BASE] : []);
  const shas = new Set();
  for (const r of plan.steps) for (const f of (T.REGEN_STEPS.find((z) => z.key === r.key) || { outs: [] }).outs) {
    try { const m = JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8')).meta || {}; if (m.target === 'beta/index.html' && m.targetSha256) shas.add(m.targetSha256); } catch { /* 無い */ }
  }
  const stampHtmls = PB.findStampHtmls({ root: ROOT, shas: [...shas], files, gitDepth: Number(getArg('--stamp-git', '0')) || 0, dir: resolve(getArg('--stamp-dir', null)) || undefined });
  const cl = PB.classifyPlan(plan, { root: ROOT, html: HTML, stampHtmls });
  plan.classify320 = { version: cl.version, stampShas: shas.size, stampFound: stampHtmls.size, count: cl.count, books: cl.books, ms: Date.now() - t1,
    rows: cl.rows.map((z) => ({ key: z.key, status: z.status, kind: z.kind, tier: z.tier, books: z.books, text: z.text })) };
}
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(plan, null, 1));
if (!QUIET) {
  const fmt = (s) => (s >= 3600 ? (s / 3600).toFixed(2) + ' h' : (s / 60).toFixed(1) + ' min');
  console.log(`regen-plan: html ${plan.html}(${String(plan.htmlSha256).slice(0, 12)}…)`
    + (plan.baseHtml ? ` / base ${plan.baseHtml}` : ''));
  console.log('  件数: ' + Object.entries(plan.count).map(([k, v]) => k + ' ' + v).join(' / ')
    + (plan.toolChecked ? ` / 道具の照合 ${plan.toolChecked}(刻印の道具の変更を照合で通した段 —— 第318便a)` : ''));
  console.log(`  所要(実測秒の和): 下限 ${fmt(plan.secLower)}(regen+always)〜 上限 ${fmt(plan.secUpper)}(+recheck)`);
  for (const r of plan.steps) if (r.status !== 'reuse' && r.status !== 'history')
    console.log(`  ${r.status.padEnd(7)} ${r.key.padEnd(16)} ${String(r.sec).padStart(5)} s  ${(r.causeText || r.reasons[0] || '').slice(0, 110)}`);
  // 第320便d(AN478): 領域の差の分類の要約
  if (plan.classify320) {
    const c = plan.classify320;
    console.log(`  領域の差の分類(AN478 —— 刻印時の html ${c.stampFound}/${c.stampShas}): ` + Object.entries(c.count).map(([k, v]) => k + ' ' + v).join(' / ')
      + (Object.keys(c.books).length ? ' / 本だけで動く段: ' + Object.entries(c.books).map(([b, ks]) => b + '(' + ks.length + ' 段)').join('・') : ''));
    for (const r of c.rows) if (r.kind === 'book') console.log(`    本だけ ${r.key.padEnd(18)} 名簿 ${r.tier}  ${r.text.slice(0, 110)}`);
  } else console.log('  領域の差の分類(AN478): --classify で出す(刻印時の html は --base / --stamp-html / --stamp-git N)');
  console.log('  → ' + OUT);
}
