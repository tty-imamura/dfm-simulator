#!/usr/bin/env node
// 第345便b(原仮定者の回答(2026-11-21 —— 第145報)「AN921: 推奨で進める」・統括の検証項目 R393): **今のブラウザの実行系を宣言と比べる**。
//   今のブラウザ(既定の起動 —— CHROMIUM_PATH と DFM_EXPECT_CHROMIUM の両方が在ればその実行ファイル)を起こし、版・V8(CDP の Browser.getVersion)・数学関数の指紋を出し、
//   宣言 tests/data-w345-engine.json と比べる。Node の指紋との違いも事実の列として出す。鎖の準備の脚本が、鎖の前にこれを呼ぶ。
// 使い方: node tools/engine-check.mjs [--json]
//   rc 0 = 宣言と同じ指紋/rc 1 = 違う(違う関数の名を出す)/rc 2 = 起動できない・宣言が読めない
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const L = await import(pathToFileURL(path.join(ROOT, 'tests', 'lib-w345-engine.mjs')).href);
const JSON_OUT = process.argv.includes('--json');

/** ブラウザの module(qa.mjs の順: playwright → playwright-core → PLAYWRIGHT_CORE_DIR) */
async function chromiumModule() {
  try { return { mod: (await import('playwright')).chromium, via: 'playwright' }; } catch {}
  try { return { mod: (await import('playwright-core')).chromium, via: 'playwright-core' }; } catch {}
  const dir = process.env.PLAYWRIGHT_CORE_DIR;
  if (dir) {
    const { createRequire } = await import('node:module');
    const req = createRequire(path.join(dir, 'noop.js'));
    try { return { mod: req('playwright').chromium, via: 'PLAYWRIGHT_CORE_DIR/playwright' }; } catch {}
    return { mod: req('playwright-core').chromium, via: 'PLAYWRIGHT_CORE_DIR/playwright-core' };
  }
  throw new Error('playwright が見つからない(npm install か PLAYWRIGHT_CORE_DIR)');
}
function playwrightVersion() {
  for (const p of [path.join(ROOT, 'node_modules', 'playwright', 'package.json'), process.env.PLAYWRIGHT_CORE_DIR ? path.join(process.env.PLAYWRIGHT_CORE_DIR, 'package.json') : null].filter(Boolean)) {
    try { return JSON.parse(fs.readFileSync(p, 'utf8')).version; } catch {}
  }
  return null;
}

/** 測って宣言と比べる(rc と記録を返す —— 器 tests/exp-w345b-engine.mjs も呼ぶ) */
export async function checkEngine() {
  let D;
  try { D = L.loadDeclaration(ROOT); } catch (e) { return { rc: 2, error: '宣言が読めない: ' + String(e && e.message || e).slice(0, 200) }; }
  let browser = null, M = null, explicit = null, via = null;
  try {
    const C = await chromiumModule(); via = C.via;
    const r = await L.launchEngine(C.mod, process.env, () => C.mod.launch());
    browser = r.browser; explicit = r.explicit;
    M = await L.measureBrowser(browser);
  } catch (e) { if (browser) await browser.close().catch(() => {}); return { rc: 2, error: '起動できない: ' + String(e && e.message || e).slice(0, 300) }; }
  await browser.close().catch(() => {});
  const V = L.engineVerdict(M.probe, D, { chromium: M.chromium });
  const N = L.runProbe(), nodeFp = L.mathFingerprint(N);
  const engine = L.describeEngine({ chromium: M.chromium, v8: M.v8, playwright: playwrightVersion(), node: process.version, mathFingerprint: M.mathFingerprint });
  return { rc: V.same ? 0 : 1, libVersion: L.LIB_VERSION, probeVersion: L.PROBE_VERSION, declVersion: D.version, engine, via, explicit,
    same: V.same, declared: D.mathFingerprint, fingerprint: M.mathFingerprint, diff: V.diff, knownVersion: V.knownVersion, functions: M.probe.functions,
    node: { node: process.version, v8: process.versions.v8, mathFingerprint: nodeFp, diffFromBrowser: L.diffFunctions(N, M.probe) } };
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) {
  const R = await checkEngine();
  if (JSON_OUT) console.log(JSON.stringify(R, null, 1));
  else if (R.rc === 2) console.log('engine-check: ' + R.error);
  else {
    console.log(`engine-check(${R.libVersion}・探り ${R.probeVersion}): ${R.engine.label}${R.explicit ? '(明示のブラウザ ' + R.explicit.executablePath + ')' : '(既定の起動 —— ' + R.via + ')'}`);
    console.log(`  宣言の指紋 ${R.declared} / 今の指紋 ${R.fingerprint} → ${R.same ? '同じ(同じ数値の実行系として扱う)' : '違う —— 違う関数: ' + R.diff.join(',') + '(ブラウザで測る正本は作り直さない)'}`
      + (R.knownVersion === false ? '・版は宣言の observed に無い(指紋で判定)' : ''));
    console.log(`  Node ${R.node.node}(V8 ${R.node.v8})の指紋 ${R.node.mathFingerprint} —— ブラウザと違う関数 ${R.node.diffFromBrowser.length}: ${R.node.diffFromBrowser.join(',') || '(なし)'}(事実の列)`);
  }
  process.exit(R.rc);
}
