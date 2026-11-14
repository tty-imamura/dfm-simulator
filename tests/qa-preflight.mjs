// 第279便b(原仮定者の裁定 第69報「簡易チェックを先に一周回す」・統括の検証項目 R61 ①): QA の preflight。
//   `npm run test:preflight`(= `QA_TIER=lint npm test`)。QA_TARGET 対応(既定 index.html — tests/qa.mjs と同じ)。
// 一周するもの(**Chromium を起動しない**)。第318便a(統括の検証項目 R254)で所要の注記を実測へ直した: 今の箱で**約 22.5 分**(第318便の統括の実測 —— 試験 358 本)。
//   重いのは領域 hash と鎖の表を引き直す lint(フル QA の結果 tests/out/qa-results-full-beta.json の ms で lint.scopeStop 約 6 分・lint.scopeClosureSame294 約 3 分・
//   lint.regenChain 約 3 分・lint.readyQueue311 と lint.regenScope と docs.retired と lint.provenanceMeta が 0.5〜1 分ずつ)で、残りの大半は 1 本あたり秒の桁:
//   ① tests/qa.mjs の**ブラウザに触れない最上位の試験ブロック**(構文 `syntax`・`lint.coreBudget`・hash・
//      provenance・文書検査 等)を、**qa.mjs の本文そのまま**切り出して実行する(コピーを持たない —
//      切り出しは tests/lib-w279b-qaorder.mjs splitTopLevel。page/browser/ワーカーに触れる文と、
//      それに依存する宣言は入れない)。
//   ② 全内蔵プリセットの**受理(validatePreset)・構築(loadPreset)・1 歩(sim.step)**を Node の vm で
//      一周する(tests/lib-w279b-headless.mjs — html の物理コードをそのまま評価し、DOM はスタブ)。
// **フル QA の代わりではない**(描画・UI・長時間の物理・並列ユニットは見ない)— 結果 JSON に
// `fullQaStillRequired:true` を書く。保存先は tests/out/qa-preflight[-beta].json(**フル結果を上書きしない**)。
// 終了コード: 1 件でも FAIL なら 1。
// 第337便h(統括の検証項目 R344・AN707 —— 第336便の post-merge の ① は途中でコンテナが再起動した): **鍵ごとの済み印と続きから**。
//   `--resume <dir>`: 最上位の試験の文が終わるたびに、その文の結果(add の行と console の行)を <dir>/done.jsonl に 1 行で追記する(書いて fsync)。
//   <dir>/contract.json の契約(対象の html の SHA-256・tests/qa.mjs と本器と切り出しの lib の指紋・鍵の一覧・Node の版・環境変数 QA_*/W###x_*・作業の木)が
//   今と同じときだけ、済みの文を走らせずに記録の行を同じ位置で出し直す(結果の並び・数・印のない FAIL の一覧は通しと同じ形)。1 つでも違えば最初から(理由を 1 行)。
//   preflight 専用の項(preflight.builtinsAcceptBuildStep)は種類 'preflight' の済み印・preflight.qaBlocks は毎回まとめ直す。
//   `--remaining <dir>`: 済み印の中で済んでいない qa.mjs の鍵の id を空白区切りで 1 行(preflight.* は入れない —— 部分 QA〔qapart〕へ渡す一覧)。
//   試験用の環境変数(契約に入る): QA_PREFLIGHT_ONLY(鍵の id を空白かコンマで —— その id を出す文だけ)・QA_PREFLIGHT_NO_BUILTINS=1(② を飛ばす)・
//   QA_PREFLIGHT_STOP_AFTER=N(N 文を走らせたら終了コード 3 で止まる —— 再起動の合成 —— 契約の外)。QA_PREFLIGHT_OUT(結果 JSON の置き場 —— 契約の外)。
//   契約と済み印の lib: tests/lib-w337h-postmerge.mjs。
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
const PM7 = await import(pathToFileURL(path.join(ROOT, 'tests', 'lib-w337h-postmerge.mjs')).href);
const ARGV = process.argv.slice(2), argOf = (k) => { const i = ARGV.indexOf(k); return i >= 0 ? ARGV[i + 1] : undefined; };
// 第337便h: --remaining <dir> —— 済み印の中で済んでいない qa.mjs の鍵(preflight.* は入れない)を 1 行で出して終わる(走らせない)
if (argOf('--remaining')) {
  const dir = path.resolve(argOf('--remaining'));
  let C = null; try { C = JSON.parse(fs.readFileSync(path.join(dir, 'contract.json'), 'utf8')); } catch (e) { C = null; }
  if (!C || !Array.isArray(C.keyList)) { console.error(`[preflight] ${dir} に済み印の契約(contract.json)が無い`); process.exit(2); }
  const D = PM7.readDone(path.join(dir, 'done.jsonl'));
  const R = PM7.remainingIds(C.keyList, D.recs);
  console.log(R.ids.join(' '));
  console.error(`[preflight] 残り ${R.units} 文・鍵 ${R.ids.length}(接頭辞だけの文 ${R.prefixes.length}${R.prefixes.length ? ' —— ' + R.prefixes.slice(0, 4).join('・') : ''})・preflight の項 ${D.recs.has('preflight:preflight.builtinsAcceptBuildStep') ? '済み' : '未'}(一覧に入れない)`);
  process.exit(0);
}
const RESUME_DIR = argOf('--resume') ? path.resolve(argOf('--resume')) : null;
const ONLY = new Set(String(process.env.QA_PREFLIGHT_ONLY || '').split(/[\s,]+/).filter(Boolean));
const STOP_AFTER = Number(process.env.QA_PREFLIGHT_STOP_AFTER || 0);

// ---- ① qa.mjs のブラウザに触れない試験ブロック ----
const src = fs.readFileSync(path.join(ROOT, 'tests', 'qa.mjs'), 'utf8');
const units = L.splitTopLevel(src);
const deps = L.unitDeps(units);
const avail = new Set();
const keep = new Set();
const excluded = [];
let nTests = 0, nOnlyCut = 0;
units.forEach((u, ui) => {
  const isImport = /^import\s/.test(u.head);
  const isDecl = u.kind === 'decl' || u.kind === 'fn';
  const isTest = L.isTestUnit(u);
  if (!isImport && !isDecl && !isTest) return;         // 準備・終端・並列の段取り等は入れない
  const cls = L.classifyUnit(u);
  const refs = deps[ui];
  let ok = isImport || (cls.tier === 'lint' && refs.every((n) => avail.has(n)));
  // 第337便h: QA_PREFLIGHT_ONLY —— 指定の id を出す試験の文だけ(宣言・関数は従来どおり)
  if (ok && isTest && ONLY.size && !L.unitIds(u.text).ids.some((id) => ONLY.has(id))) { ok = false; nOnlyCut++; return; }
  if (ok) { keep.add(u.l0); for (const n of u.names) avail.add(n); if (isTest) nTests++; }
  else if (isTest) excluded.push(u);
});
const lines = src.split('\n');
// 第337便h: 試験の文を済み印の包みで囲む(begin が真なら記録の行を出し直して文は走らせない —— 文の本文は変えない)
const keyList = units.filter((u) => keep.has(u.l0) && L.isTestUnit(u)).map((u) => {
  const { ids, prefixes } = L.unitIds(u.text);
  return { l0: u.l0, ids, prefixes, sha: crypto.createHash('sha256').update(u.text).digest('hex').slice(0, 16) };
});
const body = units.filter((u) => keep.has(u.l0)).map((u) => {
  const t = lines.slice(u.l0 - 1, u.l1).join('\n');
  return L.isTestUnit(u) ? `if (!globalThis.__PF337H.begin(${u.l0}, results)) {\n${t}\n}\nglobalThis.__PF337H.end(${u.l0}, results);` : t;
}).join('\n\n');
// ---- 済み印(--resume)----
const RS = { dir: RESUME_DIR, resumed: false, reason: '済み印なし(--resume を渡していない)', skippedUnits: 0, ranUnits: 0, badLines: 0, stopped: false };
let doneRecs = new Map();
const doneFile = RESUME_DIR ? path.join(RESUME_DIR, 'done.jsonl') : null;
if (RESUME_DIR) {
  fs.mkdirSync(RESUME_DIR, { recursive: true });
  const cNow = PM7.resumeContract({ root: ROOT, target: TARGET, keys: keyList });
  let cOld = null; try { cOld = JSON.parse(fs.readFileSync(path.join(RESUME_DIR, 'contract.json'), 'utf8')); } catch (e) { cOld = null; }
  const why = PM7.contractDiff(cOld, cNow);
  if (why === null) {
    const D = PM7.readDone(doneFile);
    doneRecs = D.recs; RS.badLines = D.bad; RS.resumed = true;
    RS.reason = `契約が同じ —— 済み ${[...doneRecs.keys()].filter((k) => k.startsWith('qa:')).length} 文から続き${D.bad ? '(読めない行 ' + D.bad + ' —— 書きかけの文は走らせ直す)' : ''}`;
  } else {
    RS.reason = '最初から: ' + why;
    PM7.writeJsonAtomic(path.join(RESUME_DIR, 'contract.json'), { ...cNow, keyList });
    fs.writeFileSync(doneFile, '');
  }
  console.log(`[preflight] 済み印 ${RESUME_DIR}: ${RS.reason}`);
}
const LOG0 = console.log.bind(console), ERR0 = console.error.bind(console);
let cap = null;
console.log = (...a) => { if (cap) cap.push(['o', a.map(String).join(' ')]); LOG0(...a); };
console.error = (...a) => { if (cap) cap.push(['e', a.map(String).join(' ')]); ERR0(...a); };
let unitStart = 0;
globalThis.__PF337H = {
  begin(l0, res) {
    const r = doneRecs.get('qa:' + l0);
    if (r) {
      for (const [k, t] of (r.lines || [])) (k === 'e' ? ERR0 : LOG0)(t);
      for (const x of (r.results || [])) res.push(x);
      RS.skippedUnits++;
      cap = null;
      return true;
    }
    unitStart = res.length; cap = [];
    return false;
  },
  end(l0, res) {
    if (cap === null) return;
    const lines0 = cap; cap = null;
    RS.ranUnits++;
    if (doneFile) PM7.appendDone(doneFile, { kind: 'qa', key: l0, ids: (keyList.find((k) => k.l0 === l0) || {}).ids || [], results: res.slice(unitStart), lines: lines0 });
    if (STOP_AFTER > 0 && RS.ranUnits >= STOP_AFTER) {
      RS.stopped = true;
      LOG0(`[preflight] QA_PREFLIGHT_STOP_AFTER=${STOP_AFTER}: ${RS.ranUnits} 文で止める(再起動の合成 —— 終了コード 3)`);
      process.exit(3);
    }
  },
};
const tmp = path.join(ROOT, 'tests', `.qa-preflight-${process.pid}.mjs`);
process.on('exit', () => { try { fs.unlinkSync(tmp); } catch {} });
fs.writeFileSync(tmp, body + '\n\nglobalThis.__QA_PREFLIGHT_RESULTS = results;\n');
const results = [];
let harnessError = null;
const tA = Date.now();
try { await import(pathToFileURL(tmp).href); }
catch (e) { harnessError = e; }
finally { try { fs.unlinkSync(tmp); } catch {} cap = null; }
const msBlocks = Date.now() - tA;
for (const r of (globalThis.__QA_PREFLIGHT_RESULTS || [])) results.push(r);
const addP = (id, pass, detail) => {
  results.push({ id, pass: !!pass, detail: String(detail ?? ''), ms: 0 });
  console.log(`${pass ? 'PASS' : 'FAIL'} ${id}${detail ? '  ' + detail : ''}`);
};
addP('preflight.qaBlocks', !harnessError && results.length > 0,
  `tests/qa.mjs のブラウザに触れない試験ブロック ${nTests} 件を本文そのまま実行(${results.length} 判定・`
  + `${(msBlocks / 1000).toFixed(1)}s)/ ブラウザ段へ残した試験ブロック ${excluded.length} 件`
  + (ONLY.size ? ` / QA_PREFLIGHT_ONLY で外した試験ブロック ${nOnlyCut} 件` : '')
  + (RS.resumed ? ` / 済み印から続き(記録を出し直した文 ${RS.skippedUnits}・走らせた文 ${RS.ranUnits})` : '')
  + (harnessError ? ` / **切り出し実行が例外で停止**: ${String(harnessError && harnessError.stack || harnessError).slice(0, 300)}` : ''));

// ---- ② 全内蔵プリセットの受理・構築・1 歩(Node vm)----
// 第337便h: 済み印に種類 'preflight' の記録があれば出し直す・QA_PREFLIGHT_NO_BUILTINS=1 なら飛ばす(試験用)
const B337 = doneRecs.get('preflight:preflight.builtinsAcceptBuildStep');
if (B337) {
  for (const [k, t] of (B337.lines || [])) (k === 'e' ? ERR0 : LOG0)(t);
  for (const x of (B337.results || [])) results.push(x);
} else if (process.env.QA_PREFLIGHT_NO_BUILTINS === '1') {
  console.log('SKIP preflight.builtinsAcceptBuildStep(QA_PREFLIGHT_NO_BUILTINS=1 —— 試験用)');
} else {
  const tB = Date.now();
  const r0 = results.length;
  cap = [];
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
  const lines1 = cap || []; cap = null;
  if (doneFile) PM7.appendDone(doneFile, { kind: 'preflight', key: 'preflight.builtinsAcceptBuildStep', results: results.slice(r0), lines: lines1 });
}

// ---- 保存(別名 — フル結果を上書きしない)----
const pass = results.every((r) => r.pass);
const targetSha256 = crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT, TARGET))).digest('hex');
const out = {
  tool: 'tests/qa-preflight.mjs', version: 'w279b-1', date: new Date().toISOString(), target: TARGET, targetSha256,
  fullQaStillRequired: true,
  note: 'preflight はフル QA の前に落ちるものを早く落とすための一周であって、フル QA(npm test)の代わりではない',
  total: results.length, failed: results.filter((r) => !r.pass).length, pass, wallMs: Date.now() - T0,
  blocks: { run: nTests, leftForBrowser: excluded.length, onlyCut: nOnlyCut },
  resume: RS,   // 第337便h: 済み印(--resume)の状態
  results,
};
fs.mkdirSync(OUT_DIR, { recursive: true });
const outName = TARGET.startsWith('beta/') ? 'qa-preflight-beta.json' : 'qa-preflight.json';
const outPath = process.env.QA_PREFLIGHT_OUT ? path.resolve(process.env.QA_PREFLIGHT_OUT) : path.join(OUT_DIR, outName);   // 第337便h: 試験用の置き場
fs.writeFileSync(outPath, JSON.stringify(out, null, 1));
console.log(`\n[preflight] ${pass ? 'ALL PASS' : 'FAILED'} (${results.filter((r) => r.pass).length}/${results.length})`
  + ` ${(out.wallMs / 1000).toFixed(1)}s → ${path.relative(ROOT, outPath)}(fullQaStillRequired:true — フル QA は npm test)`);
process.exit(pass ? 0 : 1);
