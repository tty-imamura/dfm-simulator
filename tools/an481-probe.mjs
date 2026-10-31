#!/usr/bin/env node
// 第320便d(決断事項 AN481・統括の検証項目 R265): **受理の鍵を足すとほぼ全段の型の調べ**の器(走らせない —— 閉包の数え上げと 1 冊の短い走行の coverage だけ)。
//   node tools/an481-probe.mjs [--html beta/index.html] [--ids plutoCharonReal] [--steps 600] [--harness tests/exp-w272b-charon.mjs] [--json]
//   ① 変異試験の表(候補 P0/P1/P2 × 変異 m1key/m1guard/m3reject/m4step と第319便a の受理/步の段 → 動く宣言の数 —— tests/lib-w320d-an481.mjs の mutationTable)
//   ② P4(実行した関数の閉包)の調べ: 本を受理・構築して N 步走らせた間の V8 の precise coverage で、器の宣言の roots から引いた閉包を
//      実行しなかった最上位の関数で止める(coverageClosure)—— 静的な閉包と実行した閉包の関数の数・バイト数と、第319便a の段がどちらに入るか
//   QA docs.w320d が子プロセスで呼ぶ(inspector を QA のプロセスで使わない)。書くもの: 標準出力だけ
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const getArg = (k, d) => { const i = argv.indexOf(k); return (i >= 0 && argv[i + 1]) ? argv[i + 1] : d; };
const HTML = path.resolve(ROOT, getArg('--html', 'beta/index.html'));
const A = await import(pathToFileURL(path.join(ROOT, 'tests', 'lib-w320d-an481.mjs')).href);
const SC = await import(pathToFileURL(path.join(ROOT, 'tests', 'lib-w281a-scope.mjs')).href);
const t0 = Date.now();
const table = A.mutationTable({ root: ROOT, html: HTML });
const harness = getArg('--harness', 'tests/exp-w272b-charon.mjs');
const decl = SC.normalizeScope(SC.readDeclaredScope(fs.readFileSync(path.join(ROOT, harness), 'utf8')));
const roots = decl.roots.filter((r) => !SC.TEXT_REGISTRIES.includes(String(r).replace(/^HP\./, '')));
const cov = await A.coverageClosure({ html: HTML, ids: getArg('--ids', 'plutoCharonReal').split(','), steps: Number(getArg('--steps', '600')) || 600, roots,
  watch: ['validatePreset', 'makeSim', 'loadPreset'].concat(A.W319A_ACCEPT, A.W319A_STEP) });
const out = { version: A.AN481_VERSION, html: path.relative(ROOT, HTML), harness, table, coverage: cov, ms: Date.now() - t0 };
if (argv.includes('--json')) console.log(JSON.stringify(out));
else {
  console.log(`an481-probe(${out.version}): 宣言した器 ${table.decls}・鍵の表 ${table.keyTables}`);
  for (const [m, r] of Object.entries(table.table)) console.log(`  ${m.padEnd(9)} ` + Object.entries(r).map(([c, n]) => `${c} ${n}`).join(' / '));
  console.log(`  P4(${harness} の roots・${cov.ran}/${cov.asked} 冊 × ${cov.steps} 步): 静的 ${cov.staticFns} 関数 ${cov.staticBytes} B → 実行 ${cov.dynamicFns} 関数 ${cov.dynamicBytes} B`
    + ` / 第319便a の段: 静的 ${cov.inStatic.filter((n) => !['validatePreset', 'makeSim', 'loadPreset'].includes(n)).length}・実行 ${cov.inDynamic.filter((n) => !['validatePreset', 'makeSim', 'loadPreset'].includes(n)).length}`);
}
