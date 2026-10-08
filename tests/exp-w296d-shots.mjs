// 第296便d(原仮定者の裁定(第86報)・統括の検証項目 R160): **確認用のスクリーンショット**の器(表示だけ —— 正本は作らない・html を書かない)。
// 縦画面(412×915・タッチ)と横画面(1280×800)で 3 状態 = 6 枚撮る:
//   1) 「サンプルを選ぶ」の一覧 —— 「実在天体との照合・太陽系」の 🌙(家族 earthmoon の primary)の直後に「〔+n 本の家族を開く(🌙)〕」の行(既定で畳む)
//   2) 1) の畳みの行を押して家族を開いた状態(🔆🌤️🌓 の行・🌤️ の役割名「慣性決定力版(係数移送)」・畳みの行は「〔n 本の家族を畳む(🌙)〕」)
//   3) geoPN の ⓘ を開いた状態(用途文 0〜3 を短くした「推奨は…(逸脱は保存時に警告)」)
// 使い方: node tests/exp-w296d-shots.mjs [対象 html(既定 beta/index.html)]
//   出力先は環境変数 W296D_OUT(既定: OS の一時ディレクトリの w296d-shots)。tests/out には置かない。
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
const OUT = process.env.W296D_OUT || path.join(os.tmpdir(), 'w296d-shots');
fs.mkdirSync(OUT, { recursive: true });
const VPS = [{ name: 'portrait-412x915', width: 412, height: 915, mobile: true }, { name: 'landscape-1280x800', width: 1280, height: 800, mobile: false }];
const browser = await chromium.launch();
const done = [];
const errsAll = [];
const notes = [];
try {
  for (const vp of VPS) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.mobile, hasTouch: vp.mobile, deviceScaleFactor: 2 });
    const pg = await ctx.newPage();
    const errs = [];
    pg.on('pageerror', (e) => errs.push(String(e.message || e)));
    await pg.goto(pathToFileURL(TARGET).href, { waitUntil: 'load' });
    await pg.waitForFunction(() => !!window.HP && !!HP.loadPreset);
    await pg.evaluate(() => { HP.setLang('ja'); try { localStorage.removeItem('hp_pick_fold'); localStorage.removeItem('hp_pick_open');
      for (const k of Object.keys(localStorage)) if (k.indexOf('hp_family_open_') === 0) localStorage.removeItem(k); } catch (_) {}
      HP.loadPreset('saturn', false); });
    const shot = async (tag) => { const f = path.join(OUT, `w296d-${vp.name}-${tag}.png`); await pg.screenshot({ path: f }); done.push(f); };
    const wait = (ms) => pg.waitForTimeout(ms);
    // 1) 既定で畳んだ家族(群「実在天体との照合・太陽系」を開いて 🌙 の行へ送る)
    const n1 = await pg.evaluate(async () => {
      const pr = BUILTIN_PRESETS.find((p) => p.familyId === 'earthmoon' && p.familyRole === 'primary');
      ppSetOpen(groupIdOf(ppDispGroup(pr)), true); ppFold = {}; showPresetPicker(); await new Promise((r) => setTimeout(r, 60));
      const row = [...document.querySelectorAll('#ppList .ppRow')].find((b) => b.firstChild.textContent.indexOf((pr.emoji || '') + ' ' + pName(pr)) === 0);
      const L = document.getElementById('ppList');
      if (L && row) L.scrollTop += row.getBoundingClientRect().top - L.getBoundingClientRect().top - 60;
      const t = row && row.nextElementSibling;
      return t ? t.textContent : '';
    });
    await wait(150); await shot('1-family-folded');
    // 2) 開いた状態
    const n2 = await pg.evaluate(async () => {
      const pr = BUILTIN_PRESETS.find((p) => p.familyId === 'earthmoon' && p.familyRole === 'primary');
      const row = [...document.querySelectorAll('#ppList .ppRow')].find((b) => b.firstChild.textContent.indexOf((pr.emoji || '') + ' ' + pName(pr)) === 0);
      const t = row && row.nextElementSibling; if (t && t.classList.contains('ppFamFold')) t.click();
      await new Promise((r) => setTimeout(r, 40));
      return t ? t.textContent : '';
    });
    await wait(150); await shot('2-family-open');
    // 3) geoPN の ⓘ(用途文)
    await pg.evaluate(async () => { hidePresetPicker(); ppFold = { geo: true }; showPresetPicker(); await new Promise((r) => setTimeout(r, 60));
      document.getElementById('ppDimGeoBtn').click(); await new Promise((r) => setTimeout(r, 40));
      const b = document.getElementById('ppFold_geo'); if (b) b.scrollIntoView({ block: 'start' }); });
    await wait(150); await shot('3-geo-use');
    notes.push({ vp: vp.name, folded: n1, open: n2 });
    if (errs.length) { console.log(vp.name + ' JS: ' + errs.slice(0, 2).join(' | ')); errsAll.push(...errs); }
    await ctx.close();
  }
} finally { await browser.close(); }
console.log(JSON.stringify({ target: path.relative(ROOT, TARGET), out: OUT, files: done.map((f) => path.basename(f)), rows: notes, jsErrors: errsAll.length }, null, 1));
