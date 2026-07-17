// 機械QAスイート(Phase 1 再現性基盤)。1コマンド実行: `npm test`(または node tests/qa.mjs)
// - HP.verify.all() / 全内蔵プリセットのスモーク / i18n / few-shot / BH捕捉 / 互換 /
//   インポート4形式+ID重複 / seed再現性 / 新サンプル挙動 / ♨️🪐の長時間挙動(QA_FAST=1 で省略)
// - 結果は tests/out/qa-results.json に機械可読で保存(CI が artifact 化)
// - 1件でも FAIL なら exit code 1
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const INDEX = 'file://' + path.join(ROOT, 'index.html');
const OUT_DIR = path.join(ROOT, 'tests', 'out');
const FAST = process.env.QA_FAST === '1';

async function getBrowser() {
  // CI: playwright(npm install でブラウザ管理)。ローカル: playwright-core + 既存 Chromium も可。
  // どちらも無い環境では PLAYWRIGHT_CORE_DIR(playwright-core 入り node_modules を持つディレクトリ)を指定。
  const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  try { const { chromium } = await import('playwright'); return chromium.launch(); } catch {}
  try { const { chromium } = await import('playwright-core'); return chromium.launch({ executablePath: exe }); } catch {}
  const dir = process.env.PLAYWRIGHT_CORE_DIR;
  if (dir) {
    const { createRequire } = await import('node:module');
    const { chromium } = createRequire(path.join(dir, 'noop.js'))('playwright-core');
    return chromium.launch({ executablePath: exe });
  }
  throw new Error('playwright が見つかりません。`npm install` を実行するか PLAYWRIGHT_CORE_DIR を指定してください');
}

const results = [];
const add = (id, pass, detail) => {
  results.push({ id, pass: !!pass, detail: String(detail ?? '') });
  console.log(`${pass ? 'PASS' : 'FAIL'} ${id}${detail ? '  ' + detail : ''}`);
};

// ---- 0) 構文検査(node --check)----
{
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const m = html.match(/<script>([\s\S]*)<\/script>/);
  const tmp = path.join(OUT_DIR, '_extracted.js');
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(tmp, m ? m[1] : 'throw new Error("no script")');
  try { execSync(`node --check ${JSON.stringify(tmp)}`, { stdio: 'pipe' }); add('syntax', true, ''); }
  catch (e) { add('syntax', false, String(e.stderr || e)); }
}

const browser = await getBrowser();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const pageErrors = [];
page.on('pageerror', e => pageErrors.push(String(e)));
page.on('console', m => { if (m.type() === 'error') pageErrors.push(m.text()); });
await page.goto(INDEX);
await page.waitForFunction(() => window.HP && HP.sim);

// ---- 1) HP.verify.all() ----
for (const v of await page.evaluate(() => HP.verify.all().map(v => ({ id: v.id, pass: v.pass, detail: v.detail })))) {
  add('verify.' + v.id, v.pass, v.detail);
}

// ---- 2) 全内蔵プリセット起動スモーク(120フレーム・NaNなし)----
for (const id of await page.evaluate(() => HP.allPresets().filter(p => !String(p.id).startsWith('custom_')).map(p => p.id))) {
  const r = await page.evaluate((id) => { HP.loadPreset(id, false); HP.tick(120); return { nan: HP.sim.hasNaN(), n: HP.sim.n }; }, id);
  add('preset.' + id, !r.nan, 'n=' + r.n);
}

// ---- 3) i18n(全内蔵に en / EN切替 / JA復帰)----
{
  const r = await page.evaluate(() => {
    const missing = HP.allPresets().filter(p => !String(p.id).startsWith('custom_'))
      .filter(p => !(p.en && p.en.name && p.en.description)).map(p => p.id);
    HP.setLang('en');
    const en = document.title.includes('Virtual Physics Lab')
      && document.querySelector('#presetSelect optgroup').label === 'Space & Time'
      && HP.getSystemPrompt().includes('Language override');
    HP.setLang('ja');
    const ja = document.title.includes('仮想物理ラボ') && !HP.getSystemPrompt().includes('Language override');
    return { missing, en, ja };
  });
  add('i18n.presets-en', r.missing.length === 0, r.missing.join(','));
  add('i18n.toggle', r.en && r.ja, '');
}

// ---- 4) few-shot 全例の validatePreset + BH例の光子捕捉 ----
{
  const r = await page.evaluate(() => {
    const lines = HP.SYSTEM_PROMPT.split('\n').filter(l => l.trim().startsWith('{'));
    const fs2 = lines.map((l, i) => { try { const v = HP.validatePreset(JSON.parse(l)); return { i, ok: v.ok, w: v.warnings.length }; } catch (e) { return { i, ok: false }; } });
    HP.sim.build(HP.validatePreset(JSON.parse(lines[2])).preset);
    let cap = 0; const ys = [10, 40, 80, 120, 160];
    for (const y0 of ys) { const t = HP.traceRay(HP.sim, -300, y0, 1, 0, 2.7, 340, null); if (Math.hypot(t.x, t.y) < 300) cap++; }
    return { fs2, cap, n: ys.length };
  });
  add('fewshot.validate', r.fs2.every(f => f.ok && f.w === 0), JSON.stringify(r.fs2));
  add('fewshot.bh-capture', r.cap === r.n, `${r.cap}/${r.n}`);
}

// ---- 5) 旧セーブ互換(kLens 受理)----
{
  const ok = await page.evaluate(() => HP.validatePreset({ name: '旧', description: 'kLens互換', camera: { scale: 200 },
    world: { boundary: 'none', size: 0 }, physics: { kLens: 0.004, G: 1 },
    bodies: [{ type: 'single', m: 10, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: false }] }).ok);
  add('compat.kLens', ok, '');
}

// ---- 6) インポート4形式+ID重複スキップ+seed 再現性 ----
{
  const r = await page.evaluate(() => {
    const mk = (id) => ({ id, name: 'imp' + id, description: 'd', camera: { scale: 200 }, world: { boundary: 'none', size: 0 },
      bodies: [{ type: 'single', m: 10, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: false }] });
    const doImport = (obj) => { document.querySelector('#ioArea').value = JSON.stringify(obj); document.querySelector('#btnImport').click(); };
    const count = () => JSON.parse(localStorage.getItem('hp_custom_presets') || '[]').length;
    localStorage.setItem('hp_custom_presets', '[]');
    const c0 = count();
    doImport(mk('custom_qa_a'));                                   // 単独
    doImport([mk('custom_qa_b'), mk('custom_qa_c')]);              // 配列
    doImport({ customPresets: [mk('custom_qa_d')] });              // ラッパー
    doImport({ schemaVersion: 2, saves: [], customPresets: [mk('custom_qa_e')] }); // バックアップ全体
    const c1 = count();
    doImport(mk('custom_qa_a'));                                   // 重複 → スキップ
    const c2 = count();
    // seed 再現性: 同じ seed なら id が違っても同一初期配置
    const sp = (id, seed) => ({ id, seed, name: 's', description: 'd', camera: { scale: 200 }, world: { boundary: 'box', size: 200 },
      bodies: [{ type: 'box', n: 30, cx: 0, cy: 0, w: 300, h: 300, mMin: 1, mMax: 2, spinMin: 0, spinMax: 1, vScale: 1 }] });
    const layout = (p) => { HP.sim.build(HP.validatePreset(p).preset); return [...HP.sim.x.slice(0, 5)].map(v => +v.toFixed(4)).join(','); };
    const same = layout(sp('idA', 42)) === layout(sp('idB', 42));
    const diff = layout(sp('idA', 42)) !== layout(sp('idA', 43));
    localStorage.setItem('hp_custom_presets', '[]');
    return { addedAll: c1 - c0, dupDelta: c2 - c1, same, diff };
  });
  add('import.formats', r.addedAll === 5, `added=${r.addedAll}/5`);
  add('import.dedup', r.dupDelta === 0, `delta=${r.dupDelta}`);
  add('seed.deterministic', r.same && r.diff, `sameSeed=${r.same} diffSeed=${r.diff}`);
}

// ---- 7) 新内蔵サンプルの挙動(v1.12 付録L)----
{
  const r = await page.evaluate(() => {
    const s = HP.sim, res = {};
    // ⏱ gclock: τ/t が解析値 e^{-ψ} と一致し、内側ほど遅い
    HP.loadPreset('gclock', false);
    for (let k = 0; k < 1000; k++) s.step(0.016);
    const eps = s.params.softening;
    const psi = (i) => { let w = s.params.D0;
      for (let j = 0; j < s.n; j++) { if (j === i) continue; w += s.m[j] / Math.hypot(Math.hypot(s.x[i] - s.x[j], s.y[i] - s.y[j]), eps); }
      return w / s.params.Kt; };
    res.gErr = Math.max(...[1, 2, 3].map(i => Math.abs(s.tau[i] / s.t - Math.exp(-psi(i))) / Math.exp(-psi(i))));
    res.gOrder = s.tau[1] < s.tau[2] && s.tau[2] < s.tau[3];
    // 🌈 coolrace: 冷却速度比 ≈ s³(1:8:64)・位置不変
    HP.loadPreset('coolrace', false);
    const s0 = [s.spin[0], s.spin[1], s.spin[2]], x0 = [s.x[0], s.x[1], s.x[2]];
    for (let k = 0; k < 200; k++) s.step(0.016);
    const ds = [0, 1, 2].map(i => s0[i] - s.spin[i]);
    res.cR21 = ds[1] / ds[0]; res.cR32 = ds[2] / ds[1];
    res.cDrift = Math.max(...[0, 1, 2].map(i => Math.abs(s.x[i] - x0[i])));
    // 💥 counterring: muF=1 は加熱、muF=0 は非加熱
    const mas = () => { let a = 0, c = 0; for (let i = 1; i < s.n; i++) { a += Math.abs(s.spin[i]); c++; } return a / c; };
    HP.loadPreset('counterring', false);
    for (let k = 0; k < 6000; k++) s.step(0.016);
    res.rHot = mas(); res.rNaN = s.hasNaN();
    HP.loadPreset('counterring', false); s.params.muF = 0;
    for (let k = 0; k < 6000; k++) s.step(0.016);
    res.rCold = mas();
    return res;
  });
  add('new.gclock', r.gErr < 1e-3 && r.gOrder, `err=${r.gErr.toExponential(1)}`);
  add('new.coolrace', r.cR21 > 5 && r.cR21 < 12 && r.cR32 > 5 && r.cR32 < 12 && r.cDrift < 1e-6,
    `ratio=${r.cR21.toFixed(1)}/${r.cR32.toFixed(1)} (理論8) drift=${r.cDrift}`);
  add('new.counterring', !r.rNaN && r.rHot > 0.3 && r.rCold < 0.05, `muF1=${r.rHot.toFixed(2)} muF0=${r.rCold.toFixed(3)}`);
}

// ---- 8) 長時間挙動: ♨️対流(膠着・循環)と🪐土星(環残存)。QA_FAST=1 で省略 ----
if (!FAST) {
  const r = await page.evaluate(() => {
    const s = HP.sim, res = {};
    // ♨️ convection
    HP.loadPreset('convection', false);
    const circs = []; let stuckLast = 0;
    for (let k = 1; k <= 24000; k++) { s.step(0.016);
      if (k % 2000 === 0) {
        let c = 0, cs = 0, nf = 0, stuck = 0; const colds = [];
        for (let i = 0; i < s.n; i++) if (s.pinned[i] && Math.abs(s.spin[i]) < 0.5 && s.m[i] < 100) colds.push(i);
        for (let i = 0; i < s.n; i++) { if (s.pinned[i]) continue; nf++;
          cs += s.x[i] * s.vy[i] - s.y[i] * s.vx[i]; c++;
          if (Math.hypot(s.vx[i], s.vy[i]) <= 0.2) for (const j of colds) { if (Math.hypot(s.x[i] - s.x[j], s.y[i] - s.y[j]) < 24) { stuck++; break; } }
        }
        circs.push(cs / c); stuckLast = stuck / nf;
      } }
    const latter = circs.slice(6);
    res.convSign = Math.max(latter.filter(v => v > 0).length, latter.filter(v => v < 0).length);
    res.convN = latter.length; res.convStuck = stuckLast; res.convNaN = s.hasNaN();
    // 🪐 saturn
    HP.loadPreset('saturn', false);
    for (let k = 0; k < 24000; k++) s.step(0.016);
    let inAnn = 0, tot = 0;
    for (let i = 1; i < s.n; i++) { tot++; const r2 = Math.hypot(s.x[i], s.y[i]); if (r2 > 45 && r2 < 280) inAnn++; }
    res.satAnn = inAnn / tot; res.satDrift = Math.hypot(s.x[0], s.y[0]); res.satNaN = s.hasNaN();
    return res;
  });
  add('behavior.convection', !r.convNaN && r.convStuck < 0.08 && r.convSign >= r.convN - 1,
    `stuck=${(r.convStuck * 100).toFixed(1)}% sign=${r.convSign}/${r.convN}`);
  add('behavior.saturn', !r.satNaN && r.satAnn >= 0.95 && r.satDrift < 5,
    `inAnn=${(r.satAnn * 100).toFixed(1)}% drift=${r.satDrift.toFixed(1)}`);
} else {
  console.log('SKIP behavior.* (QA_FAST=1)');
}

add('page.no-errors', pageErrors.length === 0, pageErrors.slice(0, 3).join(' | '));
await browser.close();

// ---- 結果JSON(コミット固定の再現記録)----
let commit = 'unknown';
try { commit = execSync('git rev-parse HEAD', { cwd: ROOT, stdio: 'pipe' }).toString().trim(); } catch {}
const pass = results.every(r => r.pass);
fs.writeFileSync(path.join(OUT_DIR, 'qa-results.json'), JSON.stringify({
  commit, date: new Date().toISOString(), fast: FAST,
  total: results.length, failed: results.filter(r => !r.pass).length, pass, results,
}, null, 1));
console.log(`\n${pass ? 'ALL PASS' : 'FAILED'} (${results.filter(r => r.pass).length}/${results.length}) → tests/out/qa-results.json`);
process.exit(pass ? 0 : 1);
