#!/usr/bin/env node
// 第283便e(原仮定者の裁定(第73報)⑤「正本再生成と QA の最適化」・統括の検証項目 R88)— **再生成の鎖を表から機械で作る**。
//
// 再生成表(`tests/lib-w281a-regentable.mjs` の after・alwaysRun・role・env・merges)と再生成計画
// (`planRegen` —— always / regen / recheck)から、**依存順の波と並列レーンの bash** を出す。手で書いた鎖で起きた
// 「入力より先に走らせる」「上流の再走の後に後段を走らせ直さない」を、表の依存の閉包で起こさない:
//   ・鎖に入った段の**下流はすべて**鎖に入り、上流の後に置かれる(gate —— 上流が走った後に自分の判定を引き直し、
//     対象・コード・入力〔安定 hash〕が一致すれば再利用、違えば走る)。
//   ・済み印(`$REGEN_LOG/done/<段>.done`)で再開・段の rc≠0 はその波の終わりで鎖を止める(rc 1)・
//     ログ名 `$REGEN_LOG/<波 2 桁>-<段>.log`・cmd が参照する環境変数は冒頭で必須にする。
// **走らせない・正本を書かない**(シェルの文字列を出すだけ —— 走らせるのは統括)。
//
// 第284便f(原仮定者の裁定(第74報)⑥「まだ時間が長いので改善する・並列実行を検討する」・統括の検証項目 R94)—— 鎖のランナーを
// **ready queue** に替えた(波全体の完了を待たない):
//   ・依存(鎖の中)が済んだ段から、優先度(自分から下流の端までの実測秒の最長路 —— 臨界路)の順に空きレーン(≤ REGEN_LANES、既定 --lanes)へ。
//   ・**書込排他**: 書くファイル(outs + merges —— charon h→h2→h4・calaudit→dt3→kf0 の書き戻し・samplestatus の html)が重なる段は
//     同時に走らせない(表の after で全順序になっていることは --audit ②、走行の時系列は --check-order で照合)。
//   ・**共有 worker 予算**: 段の `workers`(表 —— 分割して走る段は分割数)ぶんのレーンを取る。再生成のレーン × 段の中の並列 × QA を
//     重ねない(QA は鎖の外 —— 鎖の後に 1 本)。
//   ・**済み印の契約**: `$REGEN_LOG/done/<段>.done` の 2 行目 `contract <64 桁>` = sha256(表の版・段・mode・cmd・env の名前・書くファイル・
//     workers〔policy〕/ cmd の器と正本の meta.code[] の現行 sha〔code〕/ 計画の対象 html の sha と鎖の中の上流の契約〔input〕)。
//     **同じ契約の済み印だけ**を済みと見なす(違えば `.stale` へ退けて走らせ直す —— 器や表や html を変えて鎖を作り直した再開で、
//     古い済み印を信じない)。上流の契約が変われば下流の済み印も無効(Merkle)。
//   ・時系列 `$REGEN_LOG/timeline.txt`(start/end)—— `--check-order <timeline.txt>` が順序違反・書込の重なり・予算超過を照合する。
//   ・第283便の再判定の見落としの再発防止: (1) 同じファイルを段階的に書く上流が実際に走った段は gate で再利用しない(sameFileUps —— 第283便 統合)
//     (2) **刻印の Pointer ≠ 今の宣言 → regen**(AN43 —— planRegen と --gate が同じ判定を引く)。
//   分割して走る較正走行は tools/calaudit-split.mjs(プリセット分割 —— 直列とビット同一を tests/exp-w284f-splitcheck.mjs で照合)。
//
// 使い方:
//   node tools/regen-chain.mjs [--html <候補 html>] [--base <基点 html>] [--lanes 4] [--no-gate] [--out chain.sh] [--json chain.json]
//       計画を引いて鎖のシェルを出す(--out が無ければ標準出力)。
//   node tools/regen-chain.mjs --gate <段> [--html <html>]
//       鎖の gate: その段の**自分の判定**(依存の伝播の前)が reuse/history なら終了コード 10、regen/always なら 0。
//       第284便c(原仮定者の裁定(第74報)AN43): 入力の**刻印の安定 hash の Pointer 宣言・方式の版が今の宣言と違えば**(随伴の行も)、
//       入力のバイト sha が同じでも regen(`planRegen` の `stampedDeclDrift`)。
//   node tools/regen-chain.mjs --check-order <段,段,…|列のファイル(1 行 1 段)>
//       実際に走った列を表の依存で照合する(入力より先の走行・後段の再走の欠落・無駄な先走り)。違反があれば 1。
//   node tools/regen-chain.mjs --audit        表の依存の完全性(入力の書き手 ⊆ after の閉包・書き手の全順序・循環)。
//   node tools/regen-chain.mjs --check-order <段,段,…|列のファイル(1 行 1 段)|timeline.txt>
//       実際に走った列を表の依存で照合する(入力より先の走行・後段の再走の欠落・無駄な先走り)。timeline.txt(第284便f)なら
//       加えて ready queue の順序違反(依存の end より前の start)・書込の重なり・worker 予算の超過も見る。違反があれば 1。
//   node tools/regen-chain.mjs --audit [--lanes 4]  表の依存の完全性(入力の書き手 ⊆ after の閉包・書き手の全順序・循環)と、
//       全段 regen の鎖の ready queue の模擬(順序違反・書込の重なり・予算超過 0 —— 第284便f)。
//   node tools/regen-chain.mjs --self-test    dry-run の自己試験(QA `lint.regenChain` と同じ関数)。違反があれば 1。
//   node tools/regen-chain.mjs --env          鎖を回す環境の版(Node・Chromium)を 1 行の JSON で(第288便f —— chainShell が $REGEN_LOG/env.json に書く)。
//   node tools/regen-chain.mjs --scope-all [--write] [--check]   第312便c: 領域の宣言が presets:"all" の段の理由の一覧(tests/data-w312c-scopeall.json)。
//
// 第287便f(原仮定者の裁定(第77報)AN69・統括の検証項目 R112):
//   ・**済み印の契約 = 静的な部分(policy・code)+ 入力の安定 hash**(版 w287f-chaincontract-2 —— tests/lib-w281a-regentable.mjs の
//     `chainInputSpecs`・`inputDigest`)。入力 = 読む正本の意味的出力(除外 Pointer と来歴・時刻の欄を除いた安定 hash)・表の外の入力のバイト sha・
//     html の読み方(領域 hash / 自分と下流の書く段の生成領域を除いた本文 / 本文全体)・同じファイルを段階的に書く上流の走行行・env の値。
//     上流が走り直しても意味的出力が同じなら読み手の済み印は生きる(第286便の鎖 7〜8 の空回りの再現と解消 —— 自己試験 (p))。
//     `--digest` は鎖のランナーが段を入れる直前に呼ぶ(ランナーは REGEN_TOOL でこの器の場所を受ける)。
//   ・`--audit` に **html を書く段の検査**(`htmlTailAudit`: 書く段の宣言と器の本文・領域の印・書く段の全順序・html 本文を読む段の after 欠落・
//     領域の閉包と生成領域の重なり・表の依存の循環)を足した。末尾に移しただけで依存が満たされるとは決めない(自己試験 (q) が型ごとに検出を確かめる)。
//   ・html を書く段は今も各段が beta/index.html を直に書く。**一時出力を最後に集約する方式**(中断時に半分書いた html を完成扱いしない)は
//     設計だけ(tests/README.md「再生成の鎖」)—— 本便は検査と契約まで。
//
// 第288便f(原仮定者の裁定(第78報)AN90・統括の検証項目 R118): **一時出力の集約を実装した**。鎖のランナーは REGEN_HTML_STAGE=$REGEN_LOG/html を
//   入れ、書く段(obscompare → samplestatus)は領域の断片をそこへ置き(tests/lib-w288f-htmlstage.mjs)、集約段 htmlagg
//   (tools/regen-html-aggregate.mjs)が 1 回だけ html を置き換える。`--audit` の html 検査に ⑦ 直書き・⑧ 集約段を、`--self-test` に (r)
//   「中断 → 再開で html が 1 回だけ書かれる」を足した。`--env` は鎖を回した Node と Chromium の版(env.json)。
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
const T = await import(pathToFileURL(path.join(ROOT, 'tests', 'lib-w281a-regentable.mjs')).href);

// 第287便f(原仮定者の裁定(第77報)AN69): 済み印の契約の**入力の安定 hash**(鎖のランナーが段を入れる直前に呼ぶ —— 手で呼ぶ用途は照合だけ)。
//   node tools/regen-chain.mjs --digest --static <静的な契約> [--html <html>] [--log <REGEN_LOG>] [--lines <出力>] [--root <dir>] -- <入力…>
//   標準出力に契約(64 桁)。--lines に入力ごとの hash の行(済み印に写す)。root の既定は今のディレクトリ(鎖は cd "$ROOT" の後に呼ぶ)。
if (argv.includes('--digest')) {
  const dd = argv.indexOf('--');
  const specs = dd >= 0 ? argv.slice(dd + 1) : [];
  const head = dd >= 0 ? argv.slice(0, dd) : argv;
  const hArg = (k, d) => { const i = head.indexOf(k); return (i >= 0 && head[i + 1] !== undefined) ? head[i + 1] : d; };
  const root = path.resolve(hArg('--root', process.cwd()));
  const htmlArg = hArg('--html', 'beta/index.html');
  const r = T.inputDigest(specs, { root, html: path.isAbsolute(htmlArg) ? htmlArg : path.join(root, htmlArg),
    logDir: hArg('--log', null) ? path.resolve(hArg('--log', null)) : null, staticContract: hArg('--static', null) });
  const lf = hArg('--lines', null);
  if (lf) fs.writeFileSync(path.resolve(lf), r.lines.join('\n') + (r.lines.length ? '\n' : ''));
  process.stdout.write(r.contract + '\n');
  process.exit(0);
}

// 第288便f(原仮定者の裁定(第78報)AN90): 鎖を回した環境の版(Node・Chromium —— CI の 1228 と手元の 1194 で Math.pow 等が 1 ulp 違う切り分け用)。
//   node tools/regen-chain.mjs --env   → 標準出力に 1 行の JSON(chainShell が $REGEN_LOG/env.json に書く)。REGEN_ENV_BROWSER=0 なら Chromium を起こさない
if (argv.includes('--env')) {
  const out = { tool: 'regen-chain --env', node: process.version, platform: process.platform + '/' + process.arch, chromium: null, when: new Date().toISOString() };
  if (process.env.REGEN_ENV_BROWSER !== '0') {
    try {
      const { createRequire } = await import('node:module');
      const req = createRequire(path.join(process.env.PLAYWRIGHT_CORE_DIR || ROOT, 'noop.js'));
      let b = null;
      try { b = await req('playwright').chromium.launch(); }
      catch { b = await req('playwright-core').chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }); }
      out.chromium = b.version(); await b.close();
    } catch (e) { out.chromiumError = String(e && e.message || e).slice(0, 160); }
  } else out.chromium = 'skipped(REGEN_ENV_BROWSER=0)';
  console.log(JSON.stringify(out));
  process.exit(0);
}

// ==== 第311便c の塊(ここから)====
// 第311便c(統括の検証項目 R228): **前回の鎖の実測で見積りを更新する**。
//   node tools/regen-chain.mjs --calibrate <timeline.txt> [--log <REGEN_LOG>] [--source <出所の名>] [--tol 0.1] [--apply] [--base-sec <file>] [--out <file>] [--json <file>]
//   (第312便c: 規則 w312c-calibrate-2 —— 済み印の `run Ns` を先に読む・再開した回の済み印の確かめを飛ばす)
//   差の一覧(段・今の見積り・表の値・実測・比・処置)を出す。--apply で tests/data-w311c-regensec.json(表の外 —— 段の sec を読み込み時に上書き)へ
//   書く(既にある段の行は上書き・無い段は足す)。表の本文は書き換えない(表は families・timing294 の正本の meta.code —— 書き換えると 2 段が regen)。
if (argv.includes('--calibrate')) {
  // 第312便c(R232): 規則の版 w312c-calibrate-2 —— --log の済み印の `run Ns` を実測として先に読む・再開した回の済み印の確かめ(≤ 5 s)を飛ばす
  //   (tests/lib-w281a-regentable.mjs の calibrateSec)。--base-sec <file>: 「今の見積り」をそのファイル(例: 鎖の前の版の見積り)から読む・
  //   --apply はそのファイルを元に書く。--out <file>: --apply の書き先(既定 tests/data-w311c-regensec.json)。--json <file>: 差の一覧を JSON で
  const tlPath = resolve(getArg('--calibrate', null));
  if (!tlPath || !fs.existsSync(tlPath)) { console.error('timeline が無い: ' + tlPath); process.exit(2); }
  const text = fs.readFileSync(tlPath, 'utf8');
  let marks = null;
  const logDir = getArg('--log', null);
  if (logDir) {
    marks = new Map();
    const dd = path.join(resolve(logDir), 'done');
    if (fs.existsSync(dd)) for (const f of fs.readdirSync(dd)) if (f.endsWith('.done')) marks.set(f.replace(/\.done$/, ''), fs.readFileSync(path.join(dd, f), 'utf8').split('\n')[0]);
  }
  const baseSec = getArg('--base-sec', null);
  let baseDoc = null, steps;
  if (baseSec) {
    try { baseDoc = JSON.parse(fs.readFileSync(resolve(baseSec), 'utf8')); } catch (e) { console.error('--base-sec が読めない: ' + baseSec); process.exit(2); }
    steps = T.REGEN_STEPS.map((z) => { const tbl = z.secTable !== undefined ? z.secTable : z.sec; const m = baseDoc.steps && baseDoc.steps[z.key];
      return Object.assign({}, z, { sec: (m && Number.isFinite(m.sec) && m.sec >= 0 && z.role !== 'history') ? m.sec : tbl, secTable: tbl }); });
  }
  const source = getArg('--source', null) || ('chain ' + ((text.match(/^# ready-queue (\S+)/m) || [])[1] || 'measured'));
  const r = T.calibrateSec(text, { marks, tol: Number(getArg('--tol', '0.1')), source, steps });
  const fmt = (x) => (x === null || x === undefined ? '—' : String(x));
  console.log(`regen-chain --calibrate(規則 ${r.rule}): ${r.header || '(見出しなし)'} —— 回 ${r.runs}(再起動 ${r.restarts})・段 ${r.rows.length}・更新 ${Object.keys(r.apply).length}・`
    + `許容の内 ${r.rows.filter((z) => z.action === 'keep').length}・飛ばした ${r.rows.filter((z) => z.action === 'skip').length}・済み印の秒 ${r.rows.filter((z) => z.from === 'mark').length}`
    + `(出所の名 ${source}${baseSec ? '・今の見積り ' + baseSec : ''})`);
  for (const z of r.rows) console.log(`  ${z.action.padEnd(6)} ${z.key.padEnd(22)} 見積り ${fmt(z.sec).padStart(6)} s(表 ${fmt(z.secTable).padStart(6)})・実測 ${fmt(z.measured).padStart(8)} s(${fmt(z.from)})・比 ${fmt(z.ratio).padStart(6)}  ${z.why}`);
  const js = getArg('--json', null);
  if (js) fs.writeFileSync(resolve(js), JSON.stringify(r, null, 1) + '\n');
  if (argv.includes('--apply')) {
    const file = getArg('--out', null) ? resolve(getArg('--out', null)) : path.join(ROOT, T.REGEN_SEC_FILE);
    let cur = null;
    if (baseDoc) cur = JSON.parse(JSON.stringify(baseDoc));
    else { try { cur = JSON.parse(fs.readFileSync(path.join(ROOT, T.REGEN_SEC_FILE), 'utf8')); } catch { cur = null; } }
    if (!cur || cur.version !== T.REGEN_SEC_VERSION) cur = { version: T.REGEN_SEC_VERSION, steps: {} };
    cur.what = '再生成の鎖の段の所要の見積り(秒)—— 前回の鎖の実測(timeline の start/end)。tests/lib-w281a-regentable.mjs が読み込み時に段の sec を上書きする'
      + '(優先度〔臨界路〕・予約・模擬の見積りにだけ使う —— 済み印の契約と計画の判定には入らない)。書くのは node tools/regen-chain.mjs --calibrate <timeline> --apply';
    cur.tool = 'tools/regen-chain.mjs --calibrate';
    for (const [k, v] of Object.entries(r.apply)) cur.steps[k] = { sec: v.sec, source: v.source };
    cur.steps = Object.fromEntries(Object.keys(cur.steps).sort().map((k) => [k, cur.steps[k]]));
    // 出所の名 → timeline の見出し(鎖の開始時刻・レーン)
    cur.sources = Object.assign({}, cur.sources || {}, Object.keys(r.apply).length ? { [source]: r.header || null } : {});
    fs.writeFileSync(file, JSON.stringify(cur, null, 1) + '\n');
    console.log(`  → ${path.relative(ROOT, file)}(段 ${Object.keys(cur.steps).length} —— 今回 ${Object.keys(r.apply).length} 段を書いた)`);
  }
  process.exit(0);
}

// 第311便c(R228): 鎖の計画(--json の出力)と実測の timeline で、旧の規則(greedy)と予約(easy)の壁時計を模擬する(走らせない)。
//   node tools/regen-chain.mjs --simulate <chain.json> [--timeline <timeline.txt>] [--lanes 4] [--workers 段=n,段=n]
//   所要は timeline の実測(無い段は計画の sec)・見積りは計画の sec(est=plan)と実測(est=meas)の 2 通り・優先度は計画の並びと実測の臨界路の 2 通り
// 第313便c(統括の検証項目 R236): **末端の直列の模擬**(走らせない)。
//   node tools/regen-chain.mjs --simulate <chain.json|all> [--timeline <timeline.txt>] [--log <REGEN_LOG>] [--est <見積りの json>] [--alpha 1,0.5] [--tail 段,段]
//                                [--lanes 4] [--workers 段=n,段=n]
//   ・all: 今の再生成表の全段 regen の鎖(計画の json の代わり —— 所要は表の sec〔tests/data-w311c-regensec.json の見積り〕)。
//   ・実測は**再起動の型を直した規則**(calibrateSec —— w312c-calibrate-2: 済み印の `run Ns` を先に・再開した回の済み印の確かめ〔≤ 5 s〕を飛ばす)で読む
//     (第311便c の版は timeline の最後の組を読んでいた —— 再開した回の確かめの 0.3 s を所要と読む)。
//   ・--est <file>: 見積りを別のファイルの段の sec から(例: 前の便の tests/data-w311c-regensec.json —— 見積りが外れた場合の模擬)。
//   ・--alpha: 予約の前の backfill の余裕 α の並び(既定 1 と今の規則の RESERVE_BEFORE_ALPHA)。
//   ・依存だけの下限(lowerBoundSec —— レーン無限・所要は実測)と臨界路(criticalPath)・末端の段(--tail、既定は臨界路の最後の 6 段)の
//     依存だけの最早の開始(es)と、模擬ごとの開始(start)・遅れ(start − es)を出す。
if (argv.includes('--simulate')) {
  const src = getArg('--simulate', null);
  let plan;
  if (src === 'all') {
    const all = { steps: T.REGEN_STEPS.map((z) => ({ key: z.key, status: z.role === 'history' ? 'history' : 'regen' })) };
    plan = T.buildChain(all, { root: ROOT });
  } else plan = JSON.parse(fs.readFileSync(resolve(src), 'utf8'));
  const tlp = getArg('--timeline', null);
  const meas = new Map();
  let calib = null;
  if (tlp) {
    // 第313便c: 再起動の型を直した規則で実測を読む(計画の段の表 —— 表に無い段は計画の sec を今の見積りに)
    let marks = null;
    const logDir = getArg('--log', null);
    if (logDir) {
      marks = new Map();
      const dd = path.join(resolve(logDir), 'done');
      if (fs.existsSync(dd)) for (const f of fs.readdirSync(dd)) if (f.endsWith('.done')) marks.set(f.replace(/\.done$/, ''), fs.readFileSync(path.join(dd, f), 'utf8').split('\n')[0]);
    }
    const steps = Object.values(plan.steps).map((r) => ({ key: r.key, sec: r.sec || 0, role: 'current' }));
    calib = T.calibrateSec(fs.readFileSync(resolve(tlp), 'utf8'), { marks, tol: 0, steps });
    for (const z of calib.rows) if (z.measured !== null && z.action !== 'skip') meas.set(z.key, z.measured);
  }
  const lanes = Number(getArg('--lanes', '4')) || 4;
  const over = Object.fromEntries((getArg('--workers', '') || '').split(',').filter(Boolean).map((z) => z.split('=')).map(([k, v]) => [k, v === 'all' ? 'all' : Number(v)]));
  const rows = Object.fromEntries(Object.entries(plan.steps).map(([k, r]) => [k, Object.assign({}, r, k in over ? { workers: over[k] } : {})]));
  const secOf = (k) => (meas.has(k) ? meas.get(k) : (rows[k].sec || 0));
  // 第313便c: --est <file> —— 見積り(est=plan の側)を別のファイルの段の sec から
  const estFile = getArg('--est', null);
  const estDoc = estFile ? JSON.parse(fs.readFileSync(resolve(estFile), 'utf8')) : null;
  const planOf = (k) => { const m = estDoc && estDoc.steps ? estDoc.steps[k] : null; return m && Number.isFinite(m.sec) ? m.sec : (rows[k].sec || 0); };
  const priMeas = T.chainPriority({ steps: Object.fromEntries(Object.entries(rows).map(([k, r]) => [k, Object.assign({}, r, { sec: secOf(k) })])) });
  const priPlan = estDoc ? T.chainPriority({ steps: Object.fromEntries(Object.entries(rows).map(([k, r]) => [k, Object.assign({}, r, { sec: planOf(k) })])) })
    : (plan.priority || T.chainPriority({ steps: rows }));
  // 第313便c: 依存だけの下限・臨界路・末端の段の最早の開始(所要は実測)
  const es = new Map();
  const ES = (k) => { if (es.has(k)) return es.get(k); const v = Math.max(0, ...((rows[k].deps || []).filter((d) => rows[d]).map((d) => ES(d) + secOf(d)))); es.set(k, v); return v; };
  for (const k of Object.keys(rows)) ES(k);
  const endKey = Object.keys(rows).reduce((a, k) => (ES(k) + secOf(k) > ES(a) + secOf(a) ? k : a), Object.keys(rows)[0]);
  const lb = ES(endKey) + secOf(endKey);
  const cpath = [endKey];
  for (let k = endKey; ;) { const d = (rows[k].deps || []).filter((q) => rows[q]).find((q) => Math.abs(ES(q) + secOf(q) - ES(k)) < 1e-6); if (!d) break; cpath.unshift(d); k = d; }
  const tail = (getArg('--tail', '') || '').split(',').filter(Boolean);
  const tailKeys = (tail.length ? tail : cpath.slice(-6)).filter((k) => rows[k]);
  const alphas = (getArg('--alpha', '') || '').split(',').filter(Boolean).map(Number).filter(Number.isFinite);
  const AL = alphas.length ? alphas : [...new Set([1, T.RESERVE_BEFORE_ALPHA])];
  const out = [];
  for (const [pl, pri] of [['plan', priPlan], ['meas', priMeas]])
    for (const [el, estOf] of [['plan', planOf], ['meas', secOf]])
      for (const [rule, al] of [['greedy', 1]].concat(AL.map((a) => ['easy', a]))) {
        const s = T.simulateReadyQueue({ steps: rows, priority: pri }, { lanes, secOf, estOf, rule, alpha: al });
        const st = Object.fromEntries(s.events.map((e) => [e.key, e.start]));
        out.push({ rule, alpha: rule === 'easy' ? al : null, priority: pl, estimate: el, makespanSec: Math.round(s.makespan), makespanH: Math.round(s.makespan / 36) / 100,
          overLowerBoundSec: Math.round(s.makespan - lb), ok: s.check.ok, pending: s.pending.length,
          backfills: s.events.filter((e) => e.backfill).length, reservations: s.reservations.length,
          tail: Object.fromEntries(tailKeys.map((k) => [k, { start: Math.round(st[k]), delay: Math.round(st[k] - ES(k)) }])) });
      }
  console.log(JSON.stringify({ steps: Object.keys(rows).length, measured: meas.size, lanes, workers: over, rule: T.READY_QUEUE_RULE, alphaDefault: T.RESERVE_BEFORE_ALPHA,
    source: src === 'all' ? '全段 regen(今の表)' : src, est: estFile || '計画の sec', calibrate: calib ? { rule: calib.rule, runs: calib.runs, restarts: calib.restarts } : null,
    lowerBoundSec: Math.round(lb), criticalPath: cpath, tailEs: Object.fromEntries(tailKeys.map((k) => [k, Math.round(ES(k))])), runs: out }, null, 1));
  process.exit(0);
}
// ==== 第311便c の塊(ここまで)====

// ==== 第312便c の塊(ここから)====
// 第312便c(統括の検証項目 R232・決断事項 AN394): **領域の宣言が presets:"all" の段の理由の一覧**(絞らない —— 記録だけ)。
//   node tools/regen-chain.mjs --scope-all [--write] [--check]
//   段ごとに理由(器と lib の allPresets() / BUILTIN_PRESETS の使い方)・名指しの本の ID・見込みを出す。--write で tests/data-w312c-scopeall.json を書く
//   (生成物 —— 手で直さない)。--check は書いた一覧と今の器の一覧(段の集合・使い方の種類・見込み)を照合する(違えば 1 —— QA lint.scopeAll312 と同じ)。
if (argv.includes('--scope-all')) {
  const r = await T.scopeAllReasons312({ root: ROOT, html: HTML });
  const file = path.join(ROOT, 'tests', 'data-w312c-scopeall.json');
  const doc = { version: r.version, what: '再生成表の現行の段のうち、器の領域の宣言(REGEN_SCOPE)が presets:"all" の段の理由の一覧(決断事項 AN394 —— 絞らない・記録だけ)。'
      + '理由は器と lib の本文の allPresets() / BUILTIN_PRESETS の使い方(行は書いた時点の行 —— 照合は段・種類・見込みだけ)。namedIds は本文が文字列で名指す内蔵の本の ID(絞るときの候補)',
    tool: 'node tools/regen-chain.mjs --scope-all --write', counts: r.counts,
    kinds: { value: '変数に受ける(使い方は varUses)', 'find-via-var': '変数に受けて .find/.findIndex/.some だけで引く', iterate: 'for … of・forEach で全本を回る', filter: '条件で全本から選ぶ',
      map: '全本を写す・並べる', count: '.length で名簿の数を数える', spread: '展開して写す', 'value-arg': '引数・式に渡す', other: 'その他のメソッド', 'declared-wide': '宣言だけが all(器と lib の下限は all でない)' },
    prospects: { 'narrow-now': '宣言だけが広い —— 下限の本の集合に絞れる', 'find-only': '変数に受けて名指しで引くだけ —— 受け方を .find に直せば名指しの本に絞れる見込み',
      'count-only': '数だけ —— 数を読む口に替えれば絞れる見込み', enumerates: '全本を読む —— 絞ると器の目的(全本の一覧・数え上げ・条件の選別)が変わる' },
    steps: r.rows };
  const sig = (rows) => rows.map((z) => z.key + ':' + z.prospect + ':' + z.kinds.join('+')).sort().join(',');
  console.log(`regen-chain --scope-all(${r.version}): 段 ${r.counts.steps}(器 ${r.counts.harnesses})—— 見込み ${Object.entries(r.counts.byProspect).map(([k, v]) => k + ' ' + v).join(' / ')}`
    + ` —— 使い方 ${Object.entries(r.counts.byKind).map(([k, v]) => k + ' ' + v).join(' / ')}`);
  for (const z of r.rows) console.log(`  ${z.prospect.padEnd(11)} ${z.key.padEnd(20)} ${z.kinds.join(',').padEnd(26)} 名指し ${String(z.nNamed).padStart(3)}  ${z.reasons.slice(0, 2).map((q) => q.file.replace('tests/', '') + ':' + q.line).join(' ')}`);
  if (argv.includes('--write')) { fs.writeFileSync(file, JSON.stringify(doc, null, 1) + '\n'); console.log('  → tests/data-w312c-scopeall.json'); }
  if (argv.includes('--check')) {
    let cur = null; try { cur = JSON.parse(fs.readFileSync(file, 'utf8')); } catch { cur = null; }
    const ok = !!cur && cur.version === r.version && sig(cur.steps || []) === sig(r.rows);
    console.log('  照合: ' + (ok ? '一覧と今の器が同じ' : '一覧と今の器が違う(--scope-all --write で書き直す)'));
    process.exit(ok ? 0 : 1);
  }
  process.exit(0);
}
// ==== 第312便c の塊(ここまで)====

if (argv.includes('--gate')) {
  const key = getArg('--gate', null);
  const plan = T.planRegen({ root: ROOT, html: HTML });
  const r = plan.steps.find((z) => z.key === key);
  if (!r) { console.error('表に無い段: ' + key); process.exit(2); }
  console.log(JSON.stringify({ key, ownStatus: r.ownStatus, status: r.status, cause: r.causeText, reasons: r.reasons.slice(0, 6) }));
  process.exit(r.ownStatus === 'reuse' || r.ownStatus === 'history' ? 10 : 0);
}

if (argv.includes('--check-order')) {
  const a = getArg('--check-order', '');
  const seq = (fs.existsSync(resolve(a)) ? fs.readFileSync(resolve(a), 'utf8').split(/\r?\n/) : a.split(','))
    .map((z) => z.trim()).filter((z) => z && !z.startsWith('#'));
  const f = resolve(a);
  const text = fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : '';
  if (/^start /m.test(text)) {
    // 第284便f: ready queue の時系列(start/end)—— 依存・書込・worker は表から(全段 regen の鎖の行)
    // 統括(第284便 統合): 済み印で**再開した回**や別の鎖の時系列を連結したファイルは `# ready-queue` の見出しごとに 1 回として照合する
    //   (再開した回では済みの段が瞬時の start/end を残すので、回をまたいで「終わり」を引くと偽の順序違反になる)。全回 ok のとき 0
    const all = { steps: T.REGEN_STEPS.map((z) => ({ key: z.key, status: z.role === 'history' ? 'history' : 'regen' })) };
    const ch = T.buildChain(all, { root: ROOT });
    const checkOne = (t) => {
      const tl = T.parseTimeline(t);
      const ran = new Set(tl.events.map((e) => e.key));
      const rows = Object.fromEntries(Object.entries(ch.steps).map(([k, r]) => [k, Object.assign({}, r, { deps: r.deps.filter((d) => ran.has(d)) })]));
      const tc = T.checkTimeline(tl.events, { rows, lanes: Number(getArg('--lanes', String(tl.lanes || 4))) || 4 });
      const ends = tl.events.filter((e) => Number.isFinite(e.end)).sort((x, y) => x.end - y.end).map((e) => e.key);
      const r = T.checkOrder(ends, { root: ROOT });
      const failed = tl.events.filter((e) => e.rc !== 0).map((e) => e.key + ' rc=' + e.rc);
      const ranOk = tl.events.filter((e) => e.rc === 0).map((e) => e.key);
      return { ok: tc.ok && !r.order.length && !r.downstream.length,
        timeline: { events: tl.events.length, lanes: tl.lanes, order: tc.order, writes: tc.writes, budget: tc.budget, failed }, order: r.order, downstream: r.downstream, wasted: r.wasted, ranOk };
    };
    const blocks = text.split(/^(?=# ready-queue )/m).filter((t) => /^start /m.test(t));
    if (blocks.length <= 1) { const one = checkOne(text); console.log(JSON.stringify(one, null, 1)); process.exit(one.ok ? 0 : 1); }
    const runs = blocks.map((t, i) => Object.assign({ run: i + 1, header: (t.match(/^# ready-queue [^\n]*/) || [''])[0] }, checkOne(t)));
    // 統括(第285便 統合): 先の回の順序違反は、後の回でその段が rc=0 で走り直していれば**治っている**(cured)—— 違反として数えず、記録は cured に残す
    //   (後の回の中の順序はその回で照合済み。依存が後の回で走らなければ、その産物は後の回の前に出来ている)。最後の回では治しようがないので厳密
    runs.forEach((z, i) => {
      const later = new Set(runs.slice(i + 1).flatMap((w) => w.ranOk));
      const cure = (o) => later.has(o.step);
      // 統括(第286便 統合): 下流の欠落(downstream —— 依存が走ったのにその下流がその回に無い)も同じ規則で治る: 後の回でその下流が
      //   rc=0 で走っていれば、その産物は依存の最後の走行の後に出来ている(表に段を足した回〔d68three〕や再利用で列に出ない回で偽の欠落になる)
      z.cured = z.timeline.order.filter(cure).concat(z.order.filter(cure), z.downstream.filter(cure));
      z.timeline.order = z.timeline.order.filter((o) => !cure(o)); z.order = z.order.filter((o) => !cure(o)); z.downstream = z.downstream.filter((o) => !cure(o));
      z.ok = z.ok || (!z.timeline.order.length && !z.timeline.writes.length && !z.timeline.budget.length && !z.order.length && !z.downstream.length && !z.timeline.failed.length);
      delete z.ranOk;
    });
    // 回ごとに順序・書込・予算の違反 0。後段の欠落は rc≠0 で止まった回にだけ許す(止まりは順序違反ではない —— 再開した回で埋まる)。最後の回は全部 ok
    const last = runs[runs.length - 1];
    const okAll = runs.every((z) => !z.timeline.order.length && !z.timeline.writes.length && !z.timeline.budget.length && !z.order.length
      && (z.downstream.length === 0 || z.timeline.failed.length > 0)) && last.ok;
    console.log(JSON.stringify({ runs: runs.length, ok: okAll, stoppedRuns: runs.filter((z) => z.timeline.failed.length).map((z) => z.run + ':' + z.timeline.failed.join(',')),
      cured: runs.flatMap((z) => z.cured.map((o) => z.run + ':' + o.step + '<' + o.dep)), perRun: runs }, null, 1));
    process.exit(okAll ? 0 : 1);
  }
  const r = T.checkOrder(seq, { root: ROOT });
  console.log(JSON.stringify(r, null, 1));
  process.exit(r.order.length || r.downstream.length ? 1 : 0);
}

if (argv.includes('--audit')) {
  const r = T.tableDepsAudit({ root: ROOT });
  // 第284便f: 全段 regen の鎖を ready queue で模擬(表の実測秒 —— 見積り)。書込排他・順序・worker 予算の違反 0
  const lanes = Number(getArg('--lanes', '4')) || 4;
  const all = { steps: T.REGEN_STEPS.map((z) => ({ key: z.key, status: z.role === 'history' ? 'history' : 'regen' })) };
  const ch = T.buildChain(all, { root: ROOT });
  const sim = T.simulateReadyQueue(ch, { lanes });
  // 第311便c(R228): 予約つき(easy —— 既定)と旧の規則(greedy)の両方・workers all の段の見直し(laneReview311)
  const simG = T.simulateReadyQueue(ch, { lanes, rule: 'greedy' });
  const lr = T.laneReview311({ root: ROOT });
  r.readyQueue = { lanes, rule: T.READY_QUEUE_RULE, steps: sim.events.length, pending: sim.pending, order: sim.check.order, writes: sim.check.writes, budget: sim.check.budget,
    makespanSec: Math.round(sim.makespan), greedyMakespanSec: Math.round(simG.makespan), waveMakespanSec: Math.round(T.waveMakespan(ch, lanes)),
    reservations: sim.reservations.length, backfills: sim.events.filter((e) => e.backfill).length,
    secSource: T.REGEN_SEC ? T.REGEN_SEC_FILE + '(' + Object.keys(T.REGEN_SEC.steps || {}).length + ' 段を実測で上書き)' : '表の sec だけ',
    lanes311: lr.rows.map((z) => `${z.key}: workers ${z.workers}・鎖で html を置き換える ${z.rewritesHtmlInChain}・順序の無い html 読み ${z.unorderedHtmlReaders}・望む ${z.want}${z.ok ? '' : ' ✗'}`),
    note: '所要は表の実測秒(見積り —— 並列度・容器の負荷で変わる)。書込排他は outs + merges の重なり' };
  r.ok = r.ok && sim.check.ok && !sim.pending.length && simG.check.ok && lr.ok;
  console.log(JSON.stringify(r, null, 1));
  process.exit(r.ok ? 0 : 1);
}

if (argv.includes('--self-test')) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'w283e-chain-'));
  try {
    const plan = T.planRegen({ root: ROOT, html: HTML });
    const r = await T.regenChainSelfTest({ root: ROOT, tmpDir: tmp, plan });
    console.log(JSON.stringify(r, null, 1));
    process.exit(r.ok ? 0 : 1);
  } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
}

const plan = T.planRegen({ root: ROOT, html: HTML, baseHtml: BASE });
const chain = T.buildChain(plan, { root: ROOT, noGate: argv.includes('--no-gate') });
const simLanes = Number(getArg('--lanes', '4')) || 4;
const sim = T.simulateReadyQueue(chain, { lanes: simLanes });
const sh = T.chainShell(chain, { lanes: Number(getArg('--lanes', '4')) || 4, htmlSha: plan.htmlSha256 });
const out = resolve(getArg('--out', null));
const js = resolve(getArg('--json', null));
if (js) fs.writeFileSync(js, JSON.stringify(Object.assign({ html: plan.html, htmlSha256: plan.htmlSha256, planCount: plan.count }, chain), null, 1));
if (out) {
  fs.writeFileSync(out, sh, { mode: 0o755 });
  console.error(`regen-chain: 計画 ${Object.entries(plan.count).map(([k, v]) => k + ' ' + v).join(' / ')} → 鎖 run ${chain.count.run}・gate ${chain.count.gate}・manual ${chain.count.manual}`
    + `・波 ${chain.waves.length}(run の実測秒の和 ${chain.secRun} s・gate ${chain.secGate} s)・ready queue の模擬 ${Math.round(sim.makespan)} s`
    + `(波の型 ${Math.round(T.waveMakespan(chain, simLanes))} s・レーン ${simLanes}・gate も走る場合の見積り)→ ${out}`);
} else process.stdout.write(sh);
