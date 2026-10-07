// 第295便d(原仮定者の裁定(第85報)UI 関連修正・統括の検証項目 R156): **確認用のスクリーンショット**の器(表示だけ —— 正本は作らない・html を書かない)。
// 縦画面(412×915・タッチ)と横画面(1280×800)で 4 状態撮る:
//   1) 「サンプルを選ぶ」の分類を開き、分類の ⓘ を開いた状態(選択肢に「引きずり近似(q)」が無い・「観測再現」・ⓘ の 1.25 倍+二重の丸枠)
//   2) geoPN を開き、geoPN の ⓘ を開いた状態(「0: 汎用」「1: 1PN準拠」「2: 引きずり近似」「3: 慣性決定力」)
//   3) 一覧の区画「観測値サンプル」(実在天体との照合・太陽系 → 連星 → 実在天体のアナロジー)と、外の区画の群「腕と軸力」
//   4) パラメータタブ: 「引きずり・測地線」の ⓘ を開いた状態と「geoPN(目的の組)」の行
// 使い方: node tests/exp-w295d-shots.mjs [対象 html(既定 beta/index.html)]
//   出力先は環境変数 W295D_OUT(既定: OS の一時ディレクトリの w295d-shots)。tests/out には置かない。
//   playwright は PLAYWRIGHT_CORE_DIR(例 /opt/node22/lib/node_modules/playwright)か node_modules から読む。
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_CORE_DIR || 'playwright');
const TARGET = path.resolve(ROOT, process.argv[2] || 'beta/index.html');
const OUT = process.env.W295D_OUT || path.join(os.tmpdir(), 'w295d-shots');
fs.mkdirSync(OUT, { recursive: true });
const VPS = [{ name: 'portrait-412x915', width: 412, height: 915, mobile: true }, { name: 'landscape-1280x800', width: 1280, height: 800, mobile: false }];
const browser = await chromium.launch();
const done = [];
const errsAll = [];
try {
  for (const vp of VPS) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.mobile, hasTouch: vp.mobile, deviceScaleFactor: 2 });
    const pg = await ctx.newPage();
    const errs = [];
    pg.on('pageerror', (e) => errs.push(String(e.message || e)));
    await pg.goto(pathToFileURL(TARGET).href, { waitUntil: 'load' });
    await pg.waitForFunction(() => !!window.HP && !!HP.loadPreset);
    await pg.evaluate(() => { HP.setLang('ja'); try { localStorage.removeItem('hp_pick_fold'); localStorage.removeItem('hp_pick_open'); } catch (_) {}
      HP.loadPreset('psrDoubleAB', false); });
    const shot = async (tag) => { const f = path.join(OUT, `w295d-${vp.name}-${tag}.png`); await pg.screenshot({ path: f }); done.push(f); };
    const wait = (ms) => pg.waitForTimeout(ms);
    // 1) 分類
    await pg.evaluate(async () => { ppFold = { cls: true }; showPresetPicker(); await new Promise((r) => setTimeout(r, 60));
      document.getElementById('ppDimClassBtn').click(); await new Promise((r) => setTimeout(r, 40));
      const f = document.getElementById('ppFolds'); if (f) f.scrollTop = 0; });
    await wait(150); await shot('1-class-info');
    // 2) geoPN
    await pg.evaluate(async () => { hidePresetPicker(); ppFold = { geo: true }; showPresetPicker(); await new Promise((r) => setTimeout(r, 60));
      document.getElementById('ppDimGeoBtn').click(); await new Promise((r) => setTimeout(r, 40));
      const b = document.getElementById('ppFold_geo'); if (b) b.scrollIntoView({ block: 'start' }); });
    await wait(150); await shot('2-geo-info');
    // 3) 区画「観測値サンプル」と群「腕と軸力」
    await pg.evaluate(async () => { hidePresetPicker(); HP.loadPreset('gclock', false); ppFold = {}; showPresetPicker(); await new Promise((r) => setTimeout(r, 60));   // 本体の群の本を読み込む(較正と外の群は畳んだまま)
      const L = document.getElementById('ppList');
      const hs = [...document.querySelectorAll('#ppList .ppScopeHead')];
      const cal = hs[hs.length - 1];
      if (L && cal) L.scrollTop += cal.getBoundingClientRect().top - L.getBoundingClientRect().top - 260; });
    await wait(150); await shot('3-scope-observed');
    // 4) パラメータタブ
    await pg.evaluate(async () => { hidePresetPicker(); HP.loadPreset('mercuryReal', false);
      const tb = document.querySelector('[data-tab="params"]'); if (tb) tb.click(); await new Promise((r) => setTimeout(r, 60));
      const det = [...document.querySelectorAll('details.catParams')].find((d) => d.querySelector('[data-key="geoPN"], #geoToySaveNote') || /geoPN/.test(d.textContent));
      if (det) { det.open = true; const ci = det.querySelector(':scope > summary .catInfo'); if (ci) ci.click(); det.scrollIntoView({ block: 'start' }); } });
    await wait(200); await shot('4-params-info');
    if (errs.length) { console.log(vp.name + ' JS: ' + errs.slice(0, 2).join(' | ')); errsAll.push(...errs); }
    await ctx.close();
  }
} finally { await browser.close(); }
console.log(JSON.stringify({ target: path.relative(ROOT, TARGET), out: OUT, files: done.map((f) => path.basename(f)), jsErrors: errsAll.length }, null, 1));
