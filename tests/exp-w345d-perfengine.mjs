// 第345便d(原仮定者の回答(2026-11-21 —— 第145報)「AN921: 推奨で進める」「AN922: 進める。第345便で環境を揃え、第346便も進める」・統括の検証項目 R395)
// —— **性能の検査を 2 つの版のブラウザで測り直す器**(手動の診断の器 —— **再生成の鎖の段にしない**・**門を置かない**)。
//
// ■ なぜ段にしないか: 時間の量は箱と回で揺れる。鎖で作り直すと毎回数が動き、安定 hash も門も意味を持たない。
//   正本 tests/out/perfengine-w345d.json は「測った回の値と揺れ」と箱の記録(CPU・コア・Node・ブラウザの版・V8)だけを持つ
//   (〔第318便a〕の scopeprobe と同じ扱い —— 道具の記録をコミットし、QA は記録の形と表の逐語だけを見る)。
// ■ 使い方(重い —— 番号札の中で回す):
//   (T2)  node tests/exp-w345d-perfengine.mjs --t2-run 3 --t2-dir <dir>   … tests/perf.mjs を既定(157)と明示(153)で交互に N 回ずつ回し、
//                                                                          回ごとの結果の JSON を <dir>/<版>-<回>.json に写す(終わりに tests/out/perf-results.json を git checkout で戻す)
//         node tests/exp-w345d-perfengine.mjs --collect <dir>               … <dir> の default-<回>.json・explicit153-<回>.json を畳んで正本の t2 に書く
//   (T3)  node tests/exp-w345d-perfengine.mjs --probe                       … 渦巻銀河(galaxyGeo2)の自己対照の遅さの切り分け(2 版)を正本の t3 に書く
//   環境変数: W345D_OUT(正本の出力先)・W345D_BUDGET_MS(1 セルの打ち切り —— 既定 240000)・W345D_BROWSERS(既定 default,explicit153)
// ■ 明示のブラウザ: CHROMIUM_PATH と DFM_EXPECT_CHROMIUM の両方を渡して tests/perf.mjs を起こす(perf.mjs の約束 —— 版が違えば perf.mjs が例外で止まる)。
//   本器の T3 も同じ約束で版を確かめる(違えば止まる)。
// ■ 書かないこと: 「アプリが遅くなった」「版が悪い」と断定しない(読みは「この箱・この回では」)。アプリ(html)は読むだけ —— 1 byte も変えない。
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { execSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { LIB_VERSION, DECL, summarizePerfRun, t2Table, readCut, readUsage, msPerStepOfRow, median, decodeOpt } from './lib-w345d-perfengine.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w345d-perfengine-1';
export const OUT_DEFAULT = 'tests/out/perfengine-w345d.json';
export const OLD_REF = { commit: 'a7cd88e', file: 'tests/out/perf-results.json', note: '第344便の保存の perf の結果(chromium 141.0.7390.37・別の箱 —— 絶対値は比べず、版の中の比だけ)' };
const OUT = path.join(ROOT, process.env.W345D_OUT || OUT_DEFAULT);
const BUDGET_MS = Number(process.env.W345D_BUDGET_MS || 240000);
const BROWSERS = String(process.env.W345D_BROWSERS || DECL.browsers.join(',')).split(',').map((s) => s.trim()).filter(Boolean);
const BOOT_PRESET = 'saturn';   // perf.mjs と同じ起動の本

const sha256Of = (rel) => { try { return crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT, rel))).digest('hex'); } catch { return null; } };
const readOut = () => { try { return JSON.parse(fs.readFileSync(OUT, 'utf8')); } catch { return null; } };
function boxRecord() {
  let commit = null; try { commit = execSync('git rev-parse --short HEAD', { cwd: ROOT, stdio: 'pipe' }).toString().trim(); } catch { commit = null; }
  return { cpu: os.cpus()[0]?.model || 'unknown', cores: os.cpus().length, memGB: +(os.totalmem() / 2 ** 30).toFixed(1), node: process.version,
    platform: `${os.platform()}/${os.arch()}`, commit, beta: { file: 'beta/index.html', sha256: sha256Of('beta/index.html') },
    root: { file: 'index.html', sha256: sha256Of('index.html') }, perf: { file: 'tests/perf.mjs', sha256: sha256Of('tests/perf.mjs') } };
}

async function chromiumMod() {
  try { return (await import('playwright')).chromium; } catch {}
  try { return (await import('playwright-core')).chromium; } catch {}
  const dir = process.env.PLAYWRIGHT_CORE_DIR;
  if (dir) return createRequire(path.join(dir, 'noop.js'))('playwright-core').chromium;
  throw new Error('playwright が見つかりません');
}
async function launch(tag, args = []) {
  const chromium = await chromiumMod();
  const opt = { args };
  if (tag === 'explicit153') opt.executablePath = DECL.explicitPath;
  const b = await chromium.launch(opt);
  if (tag === 'explicit153' && b.version() !== DECL.expect153) { await b.close(); throw new Error(`明示のブラウザの版 ${b.version()} ≠ ${DECL.expect153}`); }
  let jsVersion = null; try { const c = await b.newBrowserCDPSession(); jsVersion = (await c.send('Browser.getVersion')).jsVersion; await c.detach(); } catch { jsVersion = null; }
  return { b, chromium: b.version(), jsVersion };
}
async function openPage(b) {
  const page = await b.newPage({ viewport: { width: 390, height: 844 } });
  await page.addInitScript((pid) => { try { localStorage.setItem('hp_last_preset', pid); } catch (_) {} }, BOOT_PRESET);
  await page.goto('file://' + path.join(ROOT, 'beta', 'index.html'));
  await page.waitForFunction(() => window.HP && HP.sim);
  return page;
}

// (i) 1 ページ・1 本の步ごとの列(chunk 步ごとの 1 sim 1 步の ms)。mode "ab" は perf.mjs の abJitCell と同じ作り(loadPreset → abStart('kFrame', 0) → 2 sim を交互)
const seriesCell = (page, pid, mode, total, chunk, budget) => page.evaluate(([pid, mode, total, chunk, budget]) => {
  HP.loadPreset(pid, false);
  const sA = HP.sim; let sB = null;
  if (mode === 'ab') { HP.abStart('kFrame', 0); sB = HP.ab().simB; }
  const out = []; const t00 = performance.now(); let done = 0;
  while (done < total && (performance.now() - t00) < budget) {
    let ta = 0, tb = 0;
    const t0 = performance.now();
    for (let i = 0; i < chunk; i++) {
      if (sB) { const u0 = performance.now(); sA.step(0.016); const u1 = performance.now(); sB.step(0.016); tb += performance.now() - u1; ta += u1 - u0; }
      else sA.step(0.016);
    }
    const dt = performance.now() - t0; done += chunk;
    out.push({ at: done, perSim: +(dt / (chunk * (sB ? 2 : 1))).toFixed(4), a: sB ? +(ta / chunk).toFixed(4) : null, b: sB ? +(tb / chunk).toFixed(4) : null });
  }
  const nan = sA.hasNaN() || (sB ? sB.hasNaN() : false);
  if (sB) HP.abStop();
  return { n: sA.n, series: out, nan, truncated: done < total };
}, [pid, mode, total, chunk, budget]);
// warm W の後の 3 chunk の中央値(perf.mjs の abJit の「warm 100 步・3 反復 × 100 步の中央値」と同じ作り)
const afterWarm = (series, w, chunk) => { const xs = series.filter((c) => c.at > w && c.at <= w + 3 * chunk).map((c) => c.perSim); return xs.length === 3 ? median(xs) : null; };
const afterWarmKey = (series, w, chunk, k) => { const xs = series.filter((c) => c.at > w && c.at <= w + 3 * chunk).map((c) => c[k]); return xs.length === 3 ? median(xs) : null; };

// (ii) 2 つの sim を別のページに置く: ページ 1 = A(素)・ページ 2 = B 相当(kFrame = 0 を当てた 1 sim —— abStart の B と同じ値の 1 本)。10 步ずつ交互に進める
async function sepCell(b, pid) {
  const p1 = await openPage(b), p2 = await openPage(b);
  try {
    await p1.evaluate((pid) => { HP.loadPreset(pid, false); }, pid);
    await p2.evaluate((pid) => { HP.loadPreset(pid, false); const S = HP.sim; S.params.kFrame = 0; if (typeof S.updateRadii === 'function') S.updateRadii(); }, pid);
    const run = (pg, k) => pg.evaluate((k) => { const t0 = performance.now(); for (let i = 0; i < k; i++) HP.sim.step(0.016); return performance.now() - t0; }, k);
    for (let i = 0; i < 10; i++) { await run(p1, 10); await run(p2, 10); }   // warm 100 步
    const a = [], bb = [];
    for (let r = 0; r < 3; r++) { let ta = 0, tb = 0; for (let i = 0; i < 10; i++) { ta += await run(p1, 10); tb += await run(p2, 10); } a.push(ta / 100); bb.push(tb / 100); }
    const ma = median(a), mb = median(bb);
    return { a: +ma.toFixed(4), b: +mb.toFixed(4), perSim: +((ma + mb) / 2).toFixed(4), note: 'B 相当 = 素の 1 本に kFrame = 0 を当てたもの(abStart の B の値と同じ —— 別のページ・別の文脈)' };
  } finally { await p1.close(); await p2.close(); }
}

// (iii) S._core の最適化の状態(--js-flags=--allow-natives-syntax の別の起動)と CPU の標本(CDP の Profiler)
// 状態の数の読み(lib の decodeOpt —— V8 の列挙の bit。版で意味が変わり得る)
async function deoptCell(b, pid, mode) {
  const page = await openPage(b);
  try {
    const cdp = await page.context().newCDPSession(page);
    await page.evaluate(([pid, mode]) => { HP.loadPreset(pid, false); window.__w345dA = HP.sim; window.__w345dB = null;
      if (mode === 'ab') { HP.abStart('kFrame', 0); window.__w345dB = HP.ab().simB; }
      const sims = window.__w345dB ? [window.__w345dA, window.__w345dB] : [window.__w345dA];
      for (let i = 0; i < 100; i++) for (const s of sims) s.step(0.016); }, [pid, mode]);
    await cdp.send('Profiler.enable'); await cdp.send('Profiler.setSamplingInterval', { interval: 500 }); await cdp.send('Profiler.start');
    const ms = await page.evaluate(() => { const sims = window.__w345dB ? [window.__w345dA, window.__w345dB] : [window.__w345dA];
      const t0 = performance.now(); for (let i = 0; i < 300; i++) for (const s of sims) s.step(0.016); return (performance.now() - t0) / (300 * sims.length); });
    const { profile } = await cdp.send('Profiler.stop');
    // 文字の式で渡す(Node 側は % の構文を読まない)
    const st = await page.evaluate('(() => { const g = (s) => { try { return %GetOptimizationStatus(s._core); } catch (e) { return null; } }; return [g(window.__w345dA), window.__w345dB ? g(window.__w345dB) : null]; })()');
    if (mode === 'ab') await page.evaluate(() => HP.abStop());
    const self = new Map(); let tot = 0;
    for (const nd of profile.nodes) { const h = nd.hitCount || 0; tot += h; const cf = nd.callFrame; const k = `${cf.functionName || '(無名)'}:${cf.lineNumber + 1}`; self.set(k, (self.get(k) || 0) + h); }
    const top = [...self.entries()].filter(([k]) => !/^\((idle|program|garbage collector|root)\)/.test(k)).sort((p, q) => q[1] - p[1]).slice(0, 3).map(([k, h]) => ({ fn: k, pct: +(100 * h / Math.max(1, tot)).toFixed(1) }));
    return { msPerStep: +ms.toFixed(4), coreA: st[0], coreB: st[1], top };
  } finally { await page.close(); }
}

async function probeOne(tag) {
  const pid = DECL.cutPreset, chunk = 100, total = Math.max(...DECL.warms) + 3 * chunk;
  const L = await launch(tag);
  const rec = { chromium: L.chromium, jsVersion: L.jsVersion };
  try {
    const pp = await openPage(L.b); const plain = await seriesCell(pp, pid, 'plain', total, chunk, BUDGET_MS); await pp.close();
    const pa = await openPage(L.b); const ab = await seriesCell(pa, pid, 'ab', total, chunk, BUDGET_MS); await pa.close();
    const sep = await sepCell(L.b, pid);
    const W = (s) => Object.fromEntries(DECL.warms.map((w) => ['w' + w, afterWarm(s.series, w, chunk)]));
    rec.plain = { ...W(plain), n: plain.n, nan: plain.nan, truncated: plain.truncated, series: plain.series.map((c) => c.perSim) };
    rec.ab = { ...W(ab), n: ab.n, nan: ab.nan, truncated: ab.truncated, series: ab.series.map((c) => c.perSim),
      aSide: Object.fromEntries(DECL.warms.map((w) => ['w' + w, afterWarmKey(ab.series, w, chunk, 'a')])),
      bSide: Object.fromEntries(DECL.warms.map((w) => ['w' + w, afterWarmKey(ab.series, w, chunk, 'b')])) };
    rec.sep = sep;
  } finally { await L.b.close(); }
  // (iii) 別の起動(natives の構文を許す)
  const D = await launch(tag, ['--js-flags=--allow-natives-syntax']);
  const dd = { chromium: D.chromium, jsVersion: D.jsVersion, flags: '--js-flags=--allow-natives-syntax(別の起動 —— (i)(ii) の数とは混ぜない)' };
  try {
    const p = await deoptCell(D.b, pid, 'plain'), a = await deoptCell(D.b, pid, 'ab');
    Object.assign(dd, { plainMsPerStep: p.msPerStep, abMsPerStep: a.msPerStep, ratio: +(a.msPerStep / p.msPerStep).toFixed(3),
      plainCore: { raw: p.coreA }, abCoreA: { raw: a.coreA }, abCoreB: { raw: a.coreB },
      plainTop: p.top, abTop: a.top,
      traceDeopt: '--trace-deopt の行は、既定の起動では renderer の標準出力が Playwright へ届かず取れなかった(--no-sandbox と --redirect-code-traces-to なら書けるが、関数の名が出ず、起動の条件が変わるので本器では使わない)' });
  } finally { await D.b.close(); }
  return { cut: rec, deopt: dd };
}

function oldUsage() {
  try {
    const j = JSON.parse(execSync(`git show ${OLD_REF.commit}:${OLD_REF.file}`, { cwd: ROOT, stdio: 'pipe', maxBuffer: 64 << 20 }).toString());
    const m = {}; for (const id of DECL.usagePresets) { const r = j.results.find((x) => x.id === id); m[id] = r ? +msPerStepOfRow(r).toFixed(4) : null; }
    return { chromium: j.env && j.env.chromium, msPerStep: m };
  } catch { return null; }
}

function usageFromT2(t2) {
  const u = {};
  for (const b of DECL.browsers) {
    const rs = (t2.runs || []).filter((x) => x.browser === b); if (!rs.length) continue;
    u[b] = Object.fromEntries(DECL.usagePresets.map((id) => [id, median(rs.map((x) => x.summary.usageStep[id].betaMsPerStep))]));
  }
  return u;
}

export function buildDoc(prev, patch) {
  const J = { version: HARNESS_VERSION, libVersion: LIB_VERSION, decl: DECL, judgement: 'informational(門なし —— 時間は箱で揺れる)', ...(prev || {}), ...patch };
  J.version = HARNESS_VERSION; J.libVersion = LIB_VERSION; J.decl = JSON.parse(JSON.stringify(DECL));
  if (J.t2 && J.t2.runs) { J.t2.table = t2Table(J.t2.runs); J.usage = readUsage(usageFromT2(J.t2), J.old141 ? J.old141.msPerStep : null); }
  if (J.t3 && J.t3.cut) J.t3.reading = Object.fromEntries(Object.entries(J.t3.cut).map(([b, c]) => [b, readCut(c)]));
  if (J.t3 && J.t3.deopt) for (const d of Object.values(J.t3.deopt)) for (const k of ['plainCore', 'abCoreA', 'abCoreB']) if (d[k]) d[k].decoded = decodeOpt(d[k].raw);
  return J;
}

async function main() {
  const argv = process.argv.slice(2);
  const prev = readOut();
  const patch = { box: boxRecord(), generatedAt: new Date().toISOString() };
  if (argv[0] === '--t2-run') {
    const n = Number(argv[1] || 3), dir = argv[argv.indexOf('--t2-dir') + 1];
    if (!dir || argv.indexOf('--t2-dir') < 0) throw new Error('--t2-dir <dir> が要る');
    fs.mkdirSync(dir, { recursive: true });
    for (let i = 1; i <= n; i++) for (const tag of BROWSERS) {
      const env = { ...process.env };
      if (tag === 'explicit153') { env.CHROMIUM_PATH = DECL.explicitPath; env.DFM_EXPECT_CHROMIUM = DECL.expect153; } else { delete env.CHROMIUM_PATH; delete env.DFM_EXPECT_CHROMIUM; }
      const r = spawnSync(process.execPath, ['tests/perf.mjs'], { cwd: ROOT, env, stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 << 20 });
      fs.writeFileSync(path.join(dir, `${tag}-${i}.log`), String(r.stdout) + String(r.stderr));
      fs.copyFileSync(path.join(ROOT, 'tests', 'out', 'perf-results.json'), path.join(dir, `${tag}-${i}.json`));
      console.log(`T2 ${tag}-${i} rc=${r.status}`);
    }
    try { execSync('git checkout -- tests/out/perf-results.json', { cwd: ROOT, stdio: 'pipe' }); } catch {}
    return;
  }
  if (argv[0] === '--collect') {
    const dir = argv[1]; const runs = [];
    for (const f of fs.readdirSync(dir).sort()) {
      const m = /^(default|explicit153)-(\d+)\.json$/.exec(f); if (!m) continue;
      runs.push({ browser: m[1], run: Number(m[2]), summary: summarizePerfRun(JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))) });
    }
    patch.t2 = { runs, method: 'tests/perf.mjs をそのまま(閾値・標本・再トスの決まりは不変)—— 既定と明示を交互に、1 回ごとに番号札', note: (prev && prev.t2 && prev.t2.note) || null };
    patch.old141 = oldUsage() ? { ...OLD_REF, ...oldUsage() } : (prev && prev.old141) || null;
  } else if (argv[0] === '--probe') {
    const cut = {}, deopt = {}, load0 = os.loadavg().map((x) => +x.toFixed(2));
    for (const tag of BROWSERS) { const r = await probeOne(tag); cut[tag] = r.cut; deopt[tag] = r.deopt; console.log(`T3 ${tag} ${r.cut.chromium} 素 ${r.cut.plain.w100} A/B ${r.cut.ab.w100} 別のページ ${r.cut.sep.perSim}`); }
    const rounds = ((prev && prev.t3 && prev.t3.rounds) || []).concat([{ at: new Date().toISOString(), loadavgStart: load0, loadavgEnd: os.loadavg().map((x) => +x.toFixed(2)),
      ...Object.fromEntries(Object.entries(cut).map(([b, c]) => [b, { chromium: c.chromium, plainW100: c.plain.w100, abW100: c.ab.w100, sepPerSim: c.sep.perSim, abSelf: +(c.ab.w100 / c.plain.w100).toFixed(3),
        coreAB: deopt[b].abCoreA.raw, coreABB: deopt[b].abCoreB.raw, corePlain: deopt[b].plainCore.raw, deoptRatio: deopt[b].ratio }])) }]);
    patch.t3 = { cut, deopt, rounds, preset: DECL.cutPreset, method: '1 ページ 1 本・新しいページ(起動の本 saturn)・chunk 100 步 × 19(warm 100・400・1600 の後の 3 chunk の中央値)・1 sim 1 步の ms' };
  } else { console.log('usage: --t2-run N --t2-dir <dir> | --collect <dir> | --probe'); process.exit(2); }
  const J = buildDoc(prev, patch);
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(J, null, 2) + '\n');
  console.log('→ ' + path.relative(ROOT, OUT));
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
