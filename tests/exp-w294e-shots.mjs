// 第294便e(原仮定者の裁定(第84報)「サンプルを選ぶ」の UI 7 点・統括の検証項目 R152): **確認用のスクリーンショット**の器(表示だけ —— 正本は作らない・html を書かない)。
// 縦画面(412×915・タッチ)と横画面(1280×800)で「サンプルを選ぶ」を 3 状態撮る:
//   1) 既定(群名の色・変種の家族の語「〔🌙 の家族〕」・先頭の「全て」の太字)
//   2) 説明タブの題材チップ相当(topicChipPick('inertial'))→「その他」の 4 段目「題材」が含む・段ごとの「全て」
//   3) 「その他」の ⓘ を開いた状態(開いている間だけ太字)と 1PN・測地線 を含む ∧ 観測較正 を除く(AND/NOT)
// 使い方: node tests/exp-w294e-shots.mjs [対象 html(既定 beta/index.html)]
//   出力先は環境変数 W294E_OUT(既定: OS の一時ディレクトリの w294e-shots)。tests/out には置かない。
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
const OUT = process.env.W294E_OUT || path.join(os.tmpdir(), 'w294e-shots');
fs.mkdirSync(OUT, { recursive: true });
const VPS = [{ name: 'portrait-412x915', width: 412, height: 915, mobile: true }, { name: 'landscape-1280x800', width: 1280, height: 800, mobile: false }];
const browser = await chromium.launch();
const done = [];
try {
  for (const vp of VPS) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.mobile, hasTouch: vp.mobile, deviceScaleFactor: 2 });
    const pg = await ctx.newPage();
    const errs = [];
    pg.on('pageerror', (e) => errs.push(String(e.message || e)));
    await pg.goto(pathToFileURL(TARGET).href, { waitUntil: 'load' });
    await pg.waitForFunction(() => !!window.HP && !!HP.loadPreset);
    await pg.evaluate(() => { HP.setLang('ja'); try { localStorage.removeItem('hp_pick_fold'); localStorage.removeItem('hp_pick_open'); } catch (_) {}
      HP.loadPreset('earthMoonReal', false); });
    const shot = async (tag) => { const f = path.join(OUT, `w294e-${vp.name}-${tag}.png`); await pg.screenshot({ path: f }); done.push(f); };
    // 1) 既定 —— 地球と月の群を開いて家族の語を見せる
    await pg.evaluate(async () => { showPresetPicker(); await new Promise((r) => setTimeout(r, 60));
      const row = [...document.querySelectorAll('#ppList .ppRow')].find((b) => b.textContent.indexOf('〔🌙 の家族〕') >= 0);
      const L = document.getElementById('ppList');
      if (row && L) L.scrollTop += row.getBoundingClientRect().top - L.getBoundingClientRect().top - 140; });
    await pg.waitForTimeout(150); await shot('1-default');
    // 2) 説明タブの題材チップ相当 —— 「その他」の段「題材」で 慣性決定力 を含む
    await pg.evaluate(async () => { hidePresetPicker(); topicChipPick('inertial'); await new Promise((r) => setTimeout(r, 60));
      const g = document.querySelector('#ppOtherRow .ppOtherGrp[data-sec="topic"]'); if (g) g.scrollIntoView({ block: 'start' }); });
    await pg.waitForTimeout(150); await shot('2-topic-section');
    // 3) AND/NOT と ⓘ を開いた状態
    await pg.evaluate(async () => { ppOther = ['topic:pn1Geo', '!topic:obsCal']; ppOtherSecOpen = { decl: false, badge: false, status: false, topic: true }; showPresetPicker(true);
      await new Promise((r) => setTimeout(r, 60)); document.getElementById('ppDimOtherBtn').click(); await new Promise((r) => setTimeout(r, 40));
      const f = document.getElementById('ppFolds'); if (f) f.scrollTop = 0; });
    await pg.waitForTimeout(150); await shot('3-and-not-info');
    await pg.evaluate(() => { hidePresetPicker(); ppOther = []; });
    if (errs.length) console.log(vp.name + ' JS: ' + errs.slice(0, 2).join(' | '));
    await ctx.close();
  }
} finally { await browser.close(); }
console.log(JSON.stringify({ target: path.relative(ROOT, TARGET), out: OUT, files: done.map((f) => path.basename(f)) }, null, 1));
