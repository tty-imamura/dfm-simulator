#!/usr/bin/env node
// 第284便f(原仮定者の裁定(第74報)⑥「まだ時間が長いので改善する」・統括の検証項目 R94)—— **QA の確認順の薄いランナー**。
//
//   node tools/qa-staged.mjs [--target beta/index.html] [--workers 4] [--record <記録.json>] [--no-preflight]
//
// ① preflight(tests/qa-preflight.mjs)→ ②③④ tests/qa.mjs(QA_REPLAY_FAIL=1 で前回 FAIL を先に・QA_CHANGED=1 で変更に依存する
// 短い試験を先に・その後に**全件**の本走行)→ ⑤ 最終ゲート(結果 JSON の ALL PASS と件数 —— 前回のフル保存と比べて件数が減っていない)。
// **試験は 1 つも減らさない・窓も短くしない**(判定は qa.mjs のまま)。worker 数(QA_WORKERS)ごとの壁時計とメモリ
// (qa.mjs の子孫プロセスの RSS の和の最大と、容器全体の使用量の最大 —— 2 s ごとに /proc を読む)を記録する。
// 既定の環境変数(PLAYWRIGHT_CORE_DIR 等)はそのまま渡す。
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const getArg = (k, d) => { const i = argv.indexOf(k); return (i >= 0 && argv[i + 1]) ? argv[i + 1] : d; };
const TARGET = getArg('--target', process.env.QA_TARGET || 'beta/index.html');
const WORKERS = getArg('--workers', process.env.QA_WORKERS || '4');
const RECORD = getArg('--record', null);
const beta = TARGET.startsWith('beta/');
const env = Object.assign({}, process.env, { QA_TARGET: TARGET, QA_WORKERS: String(WORKERS) });
if (env.QA_REPLAY_FAIL === undefined) env.QA_REPLAY_FAIL = '1';
if (env.QA_CHANGED === undefined) env.QA_CHANGED = '1';

// ---- メモリの標本(2 s ごと)
const readTxt = (f) => { try { return fs.readFileSync(f, 'utf8'); } catch { return ''; } };
function treeRssKb(rootPid) {
  const kids = new Map();
  for (const d of fs.readdirSync('/proc')) {
    if (!/^\d+$/.test(d)) continue;
    const st = readTxt(`/proc/${d}/stat`);
    const m = st.match(/^\d+ \(.*\) \S (\d+)/s);
    if (!m) continue;
    const pp = Number(m[1]);
    if (!kids.has(pp)) kids.set(pp, []);
    kids.get(pp).push(Number(d));
  }
  let sum = 0, n = 0;
  const walk = (p) => { const s = readTxt(`/proc/${p}/status`).match(/VmRSS:\s+(\d+)/); if (s) { sum += Number(s[1]); n++; } for (const c of (kids.get(p) || [])) walk(c); };
  walk(rootPid);
  return { kb: sum, procs: n };
}
function sysUsedKb() {
  const t = readTxt('/proc/meminfo');
  const tot = Number((t.match(/MemTotal:\s+(\d+)/) || [])[1]), av = Number((t.match(/MemAvailable:\s+(\d+)/) || [])[1]);
  return Number.isFinite(tot) && Number.isFinite(av) ? tot - av : null;
}
function run(name, args) {
  return new Promise((resolve) => {
    const t0 = Date.now();
    const ch = spawn(process.execPath, args, { cwd: ROOT, env, stdio: 'inherit' });
    let peakTree = 0, peakProcs = 0, peakSys = 0, n = 0, load = [];
    const iv = setInterval(() => {
      const r = treeRssKb(ch.pid); const s = sysUsedKb();
      if (r.kb > peakTree) { peakTree = r.kb; peakProcs = r.procs; }
      if (s && s > peakSys) peakSys = s;
      const la = readTxt('/proc/loadavg').split(' ')[0]; if (la) load.push(Number(la));
      n++;
    }, 2000);
    ch.on('exit', (code) => {
      clearInterval(iv);
      const avgLoad = load.length ? +(load.reduce((a, b) => a + b, 0) / load.length).toFixed(2) : null;
      resolve({ name, rc: code, ms: Date.now() - t0, samples: n, peakTreeRssMB: Math.round(peakTree / 1024), peakTreeProcs: peakProcs,
        peakSysUsedMB: Math.round(peakSys / 1024), avgLoad1: avgLoad });
    });
  });
}

const rec = { version: 'w284f-qastaged-1', target: TARGET, workers: Number(WORKERS), startedAt: new Date().toISOString(), stages: [] };
const save = () => { if (RECORD) fs.writeFileSync(path.resolve(RECORD), JSON.stringify(rec, null, 1)); };
if (!argv.includes('--no-preflight')) {
  const r = await run('preflight', [path.join(ROOT, 'tests', 'qa-preflight.mjs')]);
  rec.stages.push(r); save();
  if (r.rc !== 0) { console.error('[qa-staged] ① preflight rc=' + r.rc + ' —— 本走行へ進まない'); process.exit(1); }
}
// 前回のフル保存(同じ対象のものだけ —— beta の走行は qa-results-full.json も書くので target で確かめる)
const prevFull = (() => { try { const j = JSON.parse(fs.readFileSync(path.join(ROOT, 'tests', 'out', beta ? 'qa-results-full-beta.json' : 'qa-results-full.json'), 'utf8')); return j && j.target === TARGET ? j : null; } catch { return null; } })();
const q = await run('qa', [path.join(ROOT, 'tests', 'qa.mjs')]);
rec.stages.push(q);
let res = null;
try { res = JSON.parse(fs.readFileSync(path.join(ROOT, 'tests', 'out', beta ? 'qa-results-beta.json' : 'qa-results.json'), 'utf8')); } catch { res = null; }
rec.final = res ? { pass: res.pass, total: res.total, failed: res.failed, wallDurationMs: res.wallDurationMs,
  replay: res.replay ? { failedIds: (res.replay.failedIds || []).length, ms: res.replay.ms, failedNow: res.replay.failedNow } : null,
  changed: res.changed ? { units: (res.changed.units || []).length, ms: res.changed.ms, failedNow: res.changed.failedNow, long: res.changed.long } : null,
  prevFullTotal: prevFull ? prevFull.total : null,
  notFewer: prevFull ? res.total >= prevFull.total : null,
  failedIds: (res.results || []).filter((z) => !z.pass).map((z) => z.id) } : { pass: false, why: '結果 JSON が無い' };
rec.ok = q.rc === 0 && !!res && res.pass === true;
save();
console.error(`[qa-staged] ⑤ 最終ゲート: ${rec.ok ? 'ALL PASS' : 'FAIL'}(${res ? res.total - res.failed : '?'}/${res ? res.total : '?'}・前回フル ${rec.final.prevFullTotal ?? '?'} 件)`
  + `・workers ${WORKERS}・壁時計 ${(q.ms / 60000).toFixed(1)} 分・子孫 RSS 最大 ${q.peakTreeRssMB} MB(${q.peakTreeProcs} プロセス)・容器 最大 ${q.peakSysUsedMB} MB・平均負荷 ${q.avgLoad1}`);
process.exit(rec.ok ? 0 : 1);
