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
      return { ok: tc.ok && !r.order.length && !r.downstream.length,
        timeline: { events: tl.events.length, lanes: tl.lanes, order: tc.order, writes: tc.writes, budget: tc.budget, failed }, order: r.order, downstream: r.downstream, wasted: r.wasted };
    };
    const blocks = text.split(/^(?=# ready-queue )/m).filter((t) => /^start /m.test(t));
    if (blocks.length <= 1) { const one = checkOne(text); console.log(JSON.stringify(one, null, 1)); process.exit(one.ok ? 0 : 1); }
    const runs = blocks.map((t, i) => Object.assign({ run: i + 1, header: (t.match(/^# ready-queue [^\n]*/) || [''])[0] }, checkOne(t)));
    // 回ごとに順序・書込・予算の違反 0。後段の欠落は rc≠0 で止まった回にだけ許す(止まりは順序違反ではない —— 再開した回で埋まる)。最後の回は全部 ok
    const last = runs[runs.length - 1];
    const okAll = runs.every((z) => !z.timeline.order.length && !z.timeline.writes.length && !z.timeline.budget.length && !z.order.length
      && (z.downstream.length === 0 || z.timeline.failed.length > 0)) && last.ok;
    console.log(JSON.stringify({ runs: runs.length, ok: okAll, stoppedRuns: runs.filter((z) => z.timeline.failed.length).map((z) => z.run + ':' + z.timeline.failed.join(',')), perRun: runs }, null, 1));
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
  r.readyQueue = { lanes, steps: sim.events.length, pending: sim.pending, order: sim.check.order, writes: sim.check.writes, budget: sim.check.budget,
    makespanSec: Math.round(sim.makespan), waveMakespanSec: Math.round(T.waveMakespan(ch, lanes)),
    note: '所要は表の実測秒(見積り —— 並列度・容器の負荷で変わる)。書込排他は outs + merges の重なり' };
  r.ok = r.ok && sim.check.ok && !sim.pending.length;
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
