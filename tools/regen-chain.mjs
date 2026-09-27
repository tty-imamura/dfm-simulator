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
// 使い方:
//   node tools/regen-chain.mjs [--html <候補 html>] [--base <基点 html>] [--lanes 4] [--no-gate] [--out chain.sh] [--json chain.json]
//       計画を引いて鎖のシェルを出す(--out が無ければ標準出力)。
//   node tools/regen-chain.mjs --gate <段> [--html <html>]
//       鎖の gate: その段の**自分の判定**(依存の伝播の前)が reuse/history なら終了コード 10、regen/always なら 0。
//   node tools/regen-chain.mjs --check-order <段,段,…|列のファイル(1 行 1 段)>
//       実際に走った列を表の依存で照合する(入力より先の走行・後段の再走の欠落・無駄な先走り)。違反があれば 1。
//   node tools/regen-chain.mjs --audit        表の依存の完全性(入力の書き手 ⊆ after の閉包・書き手の全順序・循環)。
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
  const r = T.checkOrder(seq, { root: ROOT });
  console.log(JSON.stringify(r, null, 1));
  process.exit(r.order.length || r.downstream.length ? 1 : 0);
}

if (argv.includes('--audit')) {
  const r = T.tableDepsAudit({ root: ROOT });
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
const sh = T.chainShell(chain, { lanes: Number(getArg('--lanes', '4')) || 4, htmlSha: plan.htmlSha256 });
const out = resolve(getArg('--out', null));
const js = resolve(getArg('--json', null));
if (js) fs.writeFileSync(js, JSON.stringify(Object.assign({ html: plan.html, htmlSha256: plan.htmlSha256, planCount: plan.count }, chain), null, 1));
if (out) {
  fs.writeFileSync(out, sh, { mode: 0o755 });
  console.error(`regen-chain: 計画 ${Object.entries(plan.count).map(([k, v]) => k + ' ' + v).join(' / ')} → 鎖 run ${chain.count.run}・gate ${chain.count.gate}・manual ${chain.count.manual}`
    + `・波 ${chain.waves.length}(run の実測秒の和 ${chain.secRun} s・gate ${chain.secGate} s)→ ${out}`);
} else process.stdout.write(sh);
