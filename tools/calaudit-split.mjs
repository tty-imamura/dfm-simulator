#!/usr/bin/env node
// 第284便f(原仮定者の裁定(第74報)⑥「並列実行を検討する」・統括の検証項目 R94)—— **較正走行のプリセット分割ランナー**。
//
//   node tools/calaudit-split.mjs [--k 4] [--lanes <k>] [--harness tests/exp-w249b-calaudit.mjs] [--dir <作業ディレクトリ>] [--keep]
//                                  [--record <記録.json>] -- <calaudit の引数…>
//   (--harness は分割の口〔--shard-plan / --shard-jobs --shard-dump / --shard-load〕を持つ器 —— 再生成表の cmd に器の名前を残すために明示する)
//
// 1. `node tests/exp-w249b-calaudit.mjs <引数> --shard-plan` で job の一覧(直列の順)を得る。
// 2. job を k 個に割り付ける(前回の正本の段の壁時計の和で LPT —— **割り付けだけ**に使う。結果には入らない)。
// 3. 各分割を `<引数> --shard-jobs <鍵,…> --shard-dump <dir>/shard-<i>.v8` で**同時に ≤lanes 本**走らせる
//    (分割は正本を読むだけで書かない —— 共有 JSON への同時書きは起きない)。1 本でも rc≠0 なら合流しない(rc 1)。
// 4. 合流は 1 段: `<引数> --shard-load <産物,…>`(直列と同じ経路で判定・--merge・診断の分離・書き出し)。
// 正本は**直列とビット同一**であること(安定 hash と物理欄 —— 第284便f で kF0 5 本と全 37 本の鎖を実測。
// 照合は tests/exp-w284f-splitcheck.mjs)。所要の欄(宣言した除外 Pointer)と測定コードの sha だけが違ってよい。
// 環境変数(PLAYWRIGHT_CORE_DIR・W249_OUT・W249_DIAG_OUT・QA_TARGET)はそのまま分割と合流へ渡す。
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const L = await import(pathToFileURL(path.join(ROOT, 'tests', 'lib-w284f-calshard.mjs')).href);
const all = process.argv.slice(2);
const dd = all.indexOf('--');
const own = dd >= 0 ? all.slice(0, dd) : all;
const calArgs = dd >= 0 ? all.slice(dd + 1) : [];
const getArg = (k, d) => { const i = own.indexOf(k); return (i >= 0 && own[i + 1]) ? own[i + 1] : d; };
const K = Math.max(1, Number(getArg('--k', '4')) || 4);
const LANES = Math.max(1, Number(getArg('--lanes', String(K))) || K);
const DIR = getArg('--dir', null) || fs.mkdtempSync(path.join(os.tmpdir(), 'w284f-split-'));
const KEEP = own.includes('--keep');
const RECORD = getArg('--record', null);
const HARNESS = getArg('--harness', 'tests/exp-w249b-calaudit.mjs');
const CAL = path.resolve(ROOT, HARNESS);
if (!fs.existsSync(CAL) || fs.readFileSync(CAL, 'utf8').indexOf('--shard-load') < 0) { console.error('[split] 分割の口を持たない器: ' + HARNESS); process.exit(2); }
fs.mkdirSync(DIR, { recursive: true });
const now = () => Date.now() / 1000;
const t0 = now();

// 1. job の一覧
const pl = spawnSync(process.execPath, [CAL, ...calArgs, '--shard-plan'], { cwd: ROOT, encoding: 'utf8', env: process.env, maxBuffer: 64 << 20 });
if (pl.status !== 0) { process.stderr.write(pl.stderr || ''); console.error('[split] --shard-plan が rc=' + pl.status); process.exit(1); }
const planLine = (pl.stdout || '').trim().split('\n').filter((z) => z.startsWith('{')).pop();
const plan = JSON.parse(planLine);
const tPlan = now();
// 2. 割り付け
const OUT = process.env.W249_OUT ? path.resolve(ROOT, process.env.W249_OUT) : path.join(ROOT, 'tests', 'out', 'calaudit-w249.json');
let prev = null;
try { prev = JSON.parse(fs.readFileSync(OUT, 'utf8')); } catch { prev = null; }
const secOf = L.secTableFrom(prev);
const shards = L.lptShards(plan.jobs, secOf, K);
console.error(`[split] job ${plan.jobs.length} → 分割 ${shards.length}(レーン ≤${LANES})` + shards.map((s, i) => `\n  #${i + 1} 見積り ${Math.round(s.sec)} s: ${s.keys.join(',')}`).join(''));
// 3. 分割を走らせる(≤LANES 本)
const res = shards.map((s, i) => ({ i: i + 1, keys: s.keys, estSec: Math.round(s.sec), dump: path.join(DIR, `shard-${i + 1}.v8`), log: path.join(DIR, `shard-${i + 1}.log`), rc: null, wallSec: null }));
await new Promise((done) => {
  let next = 0, running = 0;
  const launch = () => {
    while (running < LANES && next < res.length) {
      const r = res[next++];
      running++;
      const fd = fs.openSync(r.log, 'w');
      const ts = now();
      r.startSec = +(ts - t0).toFixed(1);
      const ch = spawn(process.execPath, [CAL, ...calArgs, '--shard-jobs', r.keys.join(','), '--shard-dump', r.dump], { cwd: ROOT, env: process.env, stdio: ['ignore', fd, fd] });
      ch.on('exit', (code) => { fs.closeSync(fd); r.rc = code; r.wallSec = +(now() - ts).toFixed(1); running--; console.error(`[split] #${r.i} rc=${code} ${r.wallSec} s`); if (next >= res.length && running === 0) done(); else launch(); });
    }
  };
  launch();
});
const tShards = now();
if (res.some((r) => r.rc !== 0)) { console.error('[split] 分割に rc≠0 —— 合流しない(ログ ' + DIR + ')'); process.exit(1); }
// 4. 合流
const mlog = path.join(DIR, 'merge.log');
const mfd = fs.openSync(mlog, 'w');
const mg = spawnSync(process.execPath, [CAL, ...calArgs, '--shard-load', res.map((r) => r.dump).join(',')], { cwd: ROOT, env: process.env, stdio: ['ignore', mfd, mfd] });
fs.closeSync(mfd);
const tEnd = now();
const rec = { version: L.SHARD_VERSION, harness: HARNESS, calArgs, k: K, lanes: LANES, jobs: plan.jobs.length,
  shards: res.map((r) => ({ i: r.i, keys: r.keys, estSec: r.estSec, startSec: r.startSec, wallSec: r.wallSec, rc: r.rc })),
  planSec: +(tPlan - t0).toFixed(1), shardsWallSec: +(tShards - tPlan).toFixed(1), mergeWallSec: +(tEnd - tShards).toFixed(1),
  totalWallSec: +(tEnd - t0).toFixed(1), serialEstSec: Math.round(plan.jobs.reduce((a, k) => a + secOf(k), 0)), mergeRc: mg.status, dir: DIR };
if (RECORD) fs.writeFileSync(path.resolve(RECORD), JSON.stringify(rec, null, 1));
console.error(`[split] 合流 rc=${mg.status} ${rec.mergeWallSec} s・全体 ${rec.totalWallSec} s(分割 ${rec.shardsWallSec} s・直列の見積り ${rec.serialEstSec} s)`);
if (!KEEP && mg.status === 0) for (const r of res) fs.rmSync(r.dump, { force: true });
process.exit(mg.status === 0 ? 0 : 1);
