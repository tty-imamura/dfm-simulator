// 第345便b(原仮定者の回答(2026-11-21 —— 第145報)「AN921: 推奨で進める」・統括の検証項目 R393): **鎖が走った箱の実行系の記録**(常時の段 engine-345b → 正本 tests/out/engine-345b.json)。
//   今のブラウザ(既定の起動 —— CHROMIUM_PATH と DFM_EXPECT_CHROMIUM の両方が在ればその実行ファイル)の版・V8・playwright・node・数学関数の指紋と関数ごとの hash・
//   宣言 tests/data-w345-engine.json と同じかを書く。**宣言と違う指紋なら正本を書かずに rc 1**(鎖が止まる —— 違う実行系ではブラウザで測る正本を作り直さない)。
//   起動できないときは rc 2。html を読まない(来歴の対象は lib —— 領域の宣言なし)。
// 使い方: node tests/exp-w345b-engine.mjs   (W345B_OUT で書く先を変えられる)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import * as L from './lib-w345-engine.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w345b-engine-1';
export const OUT_MAIN = 'tests/out/engine-345b.json';
export const TARGET = 'tests/lib-w345-engine.mjs';
export const INPUT = L.DECL_FILE;
export const CODE = Object.freeze(['tests/exp-w345b-engine.mjs', 'tests/lib-w345-engine.mjs', 'tools/engine-check.mjs', 'tests/lib-w272e-provenance.mjs']);
export const NOT_CLAIM = 'どの版の値が正しいか・アプリの物理が変わった、とは言わない(ブラウザの数学関数の実装の差 —— 最後の 1 ビット)。指紋が同じなら同じ数値の実行系として扱う';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

/** 正本の形(engine-check の記録から) */
export function recordOf(R, D) {
  return { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, probeVersion: L.PROBE_VERSION, generator: 'tests/exp-w345b-engine.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-21 —— 第145報)「AN921: 推奨で進める」・統括の検証項目 R393',
    engine: R.engine, explicit: R.explicit, declared: { version: D.version, mathFingerprint: D.mathFingerprint }, mathFingerprint: R.fingerprint, functions: R.functions,
    sameAsDeclared: R.same, diff: R.diff, knownVersion: R.knownVersion, node: R.node, notClaim: NOT_CLAIM };
}
/** 正本の門(作り直さずに正本だけから引ける) */
export function gatesOf(J, D) {
  return {
    declared: !!J && J.sameAsDeclared === true && J.mathFingerprint === D.mathFingerprint && J.declared.mathFingerprint === D.mathFingerprint,
    rebuild: !!J && L.mathFingerprint({ version: J.probeVersion, functions: J.functions }) === J.mathFingerprint,
    engine: !!J && !!J.engine && typeof J.engine.chromium === 'string' && typeof J.engine.node === 'string' && J.engine.mathFingerprint === J.mathFingerprint,
    nodeFacts: !!J && !!J.node && Array.isArray(J.node.diffFromBrowser) && J.node.diffFromBrowser.every((k) => L.PROBE_FUNCTIONS.includes(k)),
  };
}
export async function main() {
  const t0 = Date.now();
  const OUT = process.env.W345B_OUT ? (path.isAbsolute(process.env.W345B_OUT) ? process.env.W345B_OUT : path.join(ROOT, process.env.W345B_OUT)) : path.join(ROOT, OUT_MAIN);
  console.log('第345便b engine(版 ' + HARNESS_VERSION + ')');
  const { checkEngine } = await import(pathToFileURL(path.join(ROOT, 'tools', 'engine-check.mjs')).href);
  const R = await checkEngine();
  if (R.rc === 2) { console.error('engine-345b: ' + R.error + ' —— 正本は書かない'); return 2; }
  const D = L.loadDeclaration(ROOT);
  if (!R.same) {
    console.error(`engine-345b: 今の実行系(${R.engine.label})の指紋 ${R.fingerprint} が宣言 ${D.mathFingerprint} と違う(違う関数: ${R.diff.join(',')})—— 正本は書かない・鎖を止める`);
    return 1;
  }
  const out = recordOf(R, D);
  out.gates = gatesOf(out, D); out.ok = Object.values(out.gates).every(Boolean);
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第345便b', target: TARGET, code: CODE, inputs: [INPUT] }), {
    harnessVersion: HARNESS_VERSION, stage: 'engine', engine: R.engine.label, notClaim: NOT_CLAIM });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, R.engine.label, out.elapsedS + ' s');
  return out.ok ? 0 : 1;
}
if (IS_MAIN) process.exit(await main());
