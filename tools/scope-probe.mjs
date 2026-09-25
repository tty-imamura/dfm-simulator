#!/usr/bin/env node
// 第282便e(原仮定者の裁定(第72報)AN22・統括の検証項目 R82)— **停止集合の実測**(領域 hash の感度)を表で出す。
//
// 宣言した器(`const REGEN_SCOPE = {…}`)が書いた現行の正本ごとに、次を引く(**走らせない・正本を書かない**):
//   (a) 基点 html(--base)で: 刻印(旧版 w281a-scope-1)を旧版で引き直して一致するか・現行版で引くと変わるか
//   (b) CSS と表示関数だけを変えた一時 html(`probeHtmls().ui`)で: 旧版/現行版それぞれ領域が変わった本数
//   (c) `validatePreset` の本体に 1 文を足した一時 html で: 現行版で変わった本数
//   (d) ❄️ の質量の最下位桁を 1 つ変えた一時 html で: 現行版で変わった本数(宣言したプリセットから予想した本数と比べる)
// 使い方: node tools/scope-probe.mjs [--html beta/index.html] [--base <基点 html>] [--json <出力先>]
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const getArg = (k, d) => { const i = argv.indexOf(k); return (i >= 0 && argv[i + 1]) ? argv[i + 1] : d; };
const resolve = (p) => (p ? (path.isAbsolute(p) ? p : path.join(ROOT, p)) : null);
const HTML = resolve(getArg('--html', 'beta/index.html'));
const BASE = resolve(getArg('--base', null));
const OUT = resolve(getArg('--json', null));

const SC = await import(pathToFileURL(path.join(ROOT, 'tests', 'lib-w281a-scope.mjs')).href);
const T0 = Date.now();
const r = await SC.scopeStopProbe({ root: ROOT, html: HTML, baseHtml: BASE });
r.probeMs = Date.now() - T0;
console.log(`scope-probe: html ${path.relative(ROOT, HTML)}${BASE ? ' / base ' + path.relative(ROOT, BASE) : ''} —— 宣言 ${r.rows.length} 本`);
console.log(`  閉包の名前(現行版/旧版): ${r.names.now}/${r.names.legacy}・inline script に占める割合 ${r.share.now}/${r.share.legacy}`);
if (BASE) console.log(`  (a) 基点で 旧版の引き直し = 刻印 ${r.a.legacySame}/${r.rows.length}・現行版で引くと変わる ${r.a.nowDiffers}/${r.rows.length}`);
console.log(`  (a′) 今の html で 旧版の引き直し = 刻印 ${r.a.legacySameNow}/${r.rows.length}`);
console.log(`  (b) CSS+表示関数 ${r.b.touched.length} 個: 変わった本数 旧版 ${r.b.legacyChanged}・現行版 ${r.b.nowChanged}`);
console.log(`  (c) validatePreset に 1 文: 変わった本数(現行版) ${r.c.nowChanged}/${r.rows.length}`);
console.log(`  (d) ❄️ の質量 ${r.d.from}→${r.d.to}: 変わった本数(現行版) ${r.d.nowChanged}(予想 ${r.d.expected}・一致 ${r.d.match})`);
console.log(`  所要 ${(r.probeMs / 1000).toFixed(1)} s`);
if (OUT) { fs.mkdirSync(path.dirname(OUT), { recursive: true }); fs.writeFileSync(OUT, JSON.stringify(r, null, 1)); console.log('  → ' + OUT); }
