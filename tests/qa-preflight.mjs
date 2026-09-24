// 第279便b(原仮定者の裁定 第69報「簡易チェックを先に一周回す」・統括の検証項目 R61 ①): QA の preflight。
//   `npm run test:preflight`(= `QA_TIER=lint npm test`)。QA_TARGET 対応(既定 index.html — tests/qa.mjs と同じ)。
// 一周するもの(**Chromium を起動しない** — 所要は秒):
//   ① tests/qa.mjs の**ブラウザに触れない最上位の試験ブロック**(構文 `syntax`・`lint.coreBudget`・hash・
//      provenance・文書検査 等)を、**qa.mjs の本文そのまま**切り出して実行する(コピーを持たない —
//      切り出しは tests/lib-w279b-qaorder.mjs splitTopLevel。page/browser/ワーカーに触れる文と、
//      それに依存する宣言は入れない)。
//   ② 全内蔵プリセットの**受理(validatePreset)・構築(loadPreset)・1 歩(sim.step)**を Node の vm で
//      一周する(tests/lib-w279b-headless.mjs — html の物理コードをそのまま評価し、DOM はスタブ)。
// **フル QA の代わりではない**(描画・UI・長時間の物理・並列ユニットは見ない)— 結果 JSON に
// `fullQaStillRequired:true` を書く。保存先は tests/out/qa-preflight[-beta].json(**フル結果を上書きしない**)。
// 終了コード: 1 件でも FAIL なら 1。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';

const T0 = Date.now();
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'index.html';
const OUT_DIR = path.join(ROOT, 'tests', 'out');
const L = await import(pathToFileURL(path.join(ROOT, 'tests', 'lib-w279b-qaorder.mjs')).href);
const H = await import(pathToFileURL(path.join(ROOT, 'tests', 'lib-w279b-headless.mjs')).href);

// ---- ① qa.mjs のブラウザに触れない試験ブロック ----
const src = fs.readFileSync(path.join(ROOT, 'tests', 'qa.mjs'), 'utf8');
const units = L.splitTopLevel(src);
const deps = L.unitDeps(units);
const avail = new Set();
const keep = new Set();
const excluded = [];
let nTests = 0;
units.forEach((u, ui) => {
  const isImport = /^import\s/.test(u.head);
  const isDecl = u.kind === 'decl' || u.kind === 'fn';
  const isTest = L.isTestUnit(u);
  if (!isImport && !isDecl && !isTest) return;         // 準備・終端・並列の段取り等は入れない
  const cls = L.classifyUnit(u);
  const refs = deps[ui];
  const ok = isImport || (cls.tier === 'lint' && refs.every((n) => avail.has(n)));
  if (ok) { keep.add(u.l0); for (const n of u.names) avail.add(n); if (isTest) nTests++; }
  else if (isTest) excluded.push(u);
});
const lines = src.split('\n');
const body = units.filter((u) => keep.has(u.l0)).map((u) => lines.slice(u.l0 - 1, u.l1).join('\n')).join('\n\n');
const tmp = path.join(ROOT, 'tests', `.qa-preflight-${process.pid}.mjs`);
fs.writeFileSync(tmp, body + '\n\nglobalThis.__QA_PREFLIGHT_RESULTS = results;\n');
const results = [];
let harnessError = null;
const tA = Date.now();
try { await import(pathToFileURL(tmp).href); }
catch (e) { harnessError = e; }
finally { try { fs.unlinkSync(tmp); } catch {} }
const msBlocks = Date.now() - tA;
for (const r of (globalThis.__QA_PREFLIGHT_RESULTS || [])) results.push(r);
const addP = (id, pass, detail) => {
  results.push({ id, pass: !!pass, detail: String(detail ?? ''), ms: 0 });
  console.log(`${pass ? 'PASS' : 'FAIL'} ${id}${detail ? '  ' + detail : ''}`);
};
addP('preflight.qaBlocks', !harnessError && results.length > 0,
  `tests/qa.mjs のブラウザに触れない試験ブロック ${nTests} 件を本文そのまま実行(${results.length} 判定・`
  + `${(msBlocks / 1000).toFixed(1)}s)/ ブラウザ段へ残した試験ブロック ${excluded.length} 件`
  + (harnessError ? ` / **切り出し実行が例外で停止**: ${String(harnessError && harnessError.stack || harnessError).slice(0, 300)}` : ''));

// ---- ② 全内蔵プリセットの受理・構築・1 歩(Node vm)----
{
  const tB = Date.now();
  const bad = [];
  let n = 0, nAll = 0, loadMs = null, dtUsed = null;
  try {
    const r = H.loadHtmlHeadless(path.join(ROOT, TARGET));
    loadMs = r.ms;
    const HP = r.HP;
    // html の DT 定数(最上位の const)を同じコンテキストで読む(無ければ 1/60)
    let dt = null;
    try { dt = Number(r.evalExpr('typeof DT !== "undefined" ? DT : null')); } catch {}
    if (!(dt > 0)) dt = 1 / 60;
    dtUsed = dt;
    const ids = HP.allPresets().filter((p) => !String(p.id).startsWith('custom_')).map((p) => p.id);
    nAll = ids.length;
    for (const id of ids) {
      const P = HP.allPresets().find((q) => q.id === id);
      const v = HP.validatePreset(JSON.parse(JSON.stringify(P)));
      if (!v || !v.ok) { bad.push(`${id}: 受理されない(${((v && v.errors) || []).slice(0, 2).join(' | ')})`); continue; }
      try {
        HP.loadPreset(id, false);
        HP.sim.step(dt);
        if (HP.sim.hasNaN()) { bad.push(`${id}: 1 歩で NaN`); continue; }
        n++;
      } catch (e) { bad.push(`${id}: 例外 ${String(e && e.message || e).slice(0, 120)}`); }
    }
    if (r.errors.length) bad.push(`console.error ${r.errors.length} 件: ${r.errors.slice(0, 2).join(' | ').slice(0, 200)}`);
  } catch (e) { bad.push('headless 読み込みに失敗: ' + String(e && e.stack || e).slice(0, 300)); }
  addP('preflight.builtinsAcceptBuildStep', bad.length === 0 && n === nAll && nAll > 0,
    `全内蔵 ${n}/${nAll} 本が受理(validatePreset)・構築(loadPreset)・1 歩(sim.step・dt=${dtUsed})を NaN なしで通過`
    + `(Node vm・html 読み込み ${loadMs} ms・計 ${((Date.now() - tB) / 1000).toFixed(1)}s — 描画/UI/長時間の物理はフル QA が見る)`
    + (bad.length ? ` / **NG ${bad.length}**: ${bad.slice(0, 4).join(' , ')}` : ''));
}

// ---- 保存(別名 — フル結果を上書きしない)----
const pass = results.every((r) => r.pass);
const targetSha256 = crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT, TARGET))).digest('hex');
const out = {
  tool: 'tests/qa-preflight.mjs', version: 'w279b-1', date: new Date().toISOString(), target: TARGET, targetSha256,
  fullQaStillRequired: true,
  note: 'preflight はフル QA の前に落ちるものを早く落とすための一周であって、フル QA(npm test)の代わりではない',
  total: results.length, failed: results.filter((r) => !r.pass).length, pass, wallMs: Date.now() - T0,
  blocks: { run: nTests, leftForBrowser: excluded.length },
  results,
};
fs.mkdirSync(OUT_DIR, { recursive: true });
const outName = TARGET.startsWith('beta/') ? 'qa-preflight-beta.json' : 'qa-preflight.json';
fs.writeFileSync(path.join(OUT_DIR, outName), JSON.stringify(out, null, 1));
console.log(`\n[preflight] ${pass ? 'ALL PASS' : 'FAILED'} (${results.filter((r) => r.pass).length}/${results.length})`
  + ` ${(out.wallMs / 1000).toFixed(1)}s → tests/out/${outName}(fullQaStillRequired:true — フル QA は npm test)`);
process.exit(pass ? 0 : 1);
