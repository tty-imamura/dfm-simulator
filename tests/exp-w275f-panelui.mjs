// 第275便f(原仮定者の裁定(第65報)(9)「縦画面レイアウトでタブ表示時に『閉じる』だけでなく
// 『広げる』ボタンを用意」)の実機採寸ハーネス。**読み取り+UI 操作だけ**(力学へは触れない)。
//
// 正本ではない(provenance 版付き JSON を出さない) — ログ用の採寸器である。
// 使い方: PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright \
//         node tests/exp-w275f-panelui.mjs [target]
// 出力: 標準出力の JSON 1 個。viewport ごとに
//   before(タブを閉じたまま) / narrow(タブを開いた既定=狭い) / wide(広げた) / afterShrink /
//   afterCloseFromWide の 5 相で、#canvasWrap の可視高さ・#panel の高さと max-height・
//   header の矩形(広げてもヘッダーが隠れないことの確認)を採る。
// 基点 html(#btnPanelExpand が無い)へ向けても走る — その場合 wide 以降は null になる。
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.argv[2] || 'beta/index.html';
const INDEX = 'file://' + path.join(ROOT, TARGET);
const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let browser;
try { browser = await req('playwright').chromium.launch(); }
catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }

// 縦 2 種(iPhone 12/13/14 相当・Pixel 相当)と横 1 種(2カラムに組み替わる幅)
const VIEWPORTS = [
  { name: '390x844(縦)', width: 390, height: 844 },
  { name: '412x915(縦)', width: 412, height: 915 },
  { name: '1280x800(横)', width: 1280, height: 800 },
];

// ページ内で 1 相ぶんを採る(px は小数第 1 位まで)
const SNAP = `(() => {
  const r = (s) => { const e = document.querySelector(s); if (!e) return null;
    const b = e.getBoundingClientRect();
    return { top: +b.top.toFixed(1), bottom: +b.bottom.toFixed(1), h: +b.height.toFixed(1) }; };
  const panel = document.getElementById('panel');
  const be = document.getElementById('btnPanelExpand');
  return {
    header: r('header'), transport: r('#transport'), tabs: r('nav#tabs'),
    canvas: r('#canvasWrap'), panel: r('#panel'),
    panelMaxH: getComputedStyle(panel).maxHeight,
    panelOpen: panel.classList.contains('open'),
    panelWideCls: panel.classList.contains('wide'),
    appWideCls: document.getElementById('app').classList.contains('panelWide'),
    reserve: getComputedStyle(document.documentElement).getPropertyValue('--panelWideReserve').trim() || null,
    expand: be ? { display: getComputedStyle(be).display, label: be.textContent,
      pressed: be.getAttribute('aria-pressed') } : null,
    // 内部キャンバスの実サイズ(resizeCanvas が追随したか)
    cvPx: (() => { const c = document.getElementById('cv'); return c ? { w: c.width, h: c.height } : null; })(),
    appDisplay: getComputedStyle(document.getElementById('app')).display,
  };
})()`;

const out = { target: TARGET, hasExpandBtn: null, viewports: [] };
const errs = [];

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errs.push(vp.name + ': ' + String(e.message || e)));
  // 既定=狭い から始めるため localStorage を掃除してから読み込む
  await page.goto(INDEX, { waitUntil: 'load' });
  await page.evaluate(() => { try { localStorage.removeItem('hp_panel_wide'); } catch (_) {} });
  await page.reload({ waitUntil: 'load' });
  await page.waitForFunction(() => !!window.HP);

  const rec = { name: vp.name, w: vp.width, h: vp.height };
  rec.before = await page.evaluate(SNAP);
  out.hasExpandBtn = rec.before.expand !== null;

  // ---- タブを開く(既定=狭い)
  await page.evaluate(() => document.querySelector('nav#tabs button[data-tab="params"]').click());
  await page.waitForTimeout(120);   // closePanel/openTab と同じ setTimeout(resizeCanvas,50) の後
  rec.narrow = await page.evaluate(SNAP);

  if (rec.before.expand && rec.before.expand.display !== 'none') {
    // ---- 広げる
    await page.evaluate(() => document.getElementById('btnPanelExpand').click());
    await page.waitForTimeout(120);
    rec.wide = await page.evaluate(SNAP);
    // ヘッダーが隠れていないか: 矩形が画面内に丸ごと収まり、高さが狭い状態と同じ
    rec.headerIntact = rec.wide.header.top >= -0.5 && rec.wide.header.bottom <= vp.height + 0.5
      && Math.abs(rec.wide.header.h - rec.narrow.header.h) < 0.5;
    // ---- 広い状態で「閉じる」が効くか
    await page.evaluate(() => document.getElementById('btnPanelClose').click());
    await page.waitForTimeout(120);
    rec.afterCloseFromWide = await page.evaluate(SNAP);
    // ---- 開き直すと広いまま(状態は保持)→ 狭くする
    await page.evaluate(() => document.querySelector('nav#tabs button[data-tab="params"]').click());
    await page.waitForTimeout(120);
    rec.reopened = await page.evaluate(SNAP);
    await page.evaluate(() => document.getElementById('btnPanelExpand').click());
    await page.waitForTimeout(120);
    rec.afterShrink = await page.evaluate(SNAP);
    // ---- localStorage への永続(リロードで復元されるか)
    await page.evaluate(() => document.getElementById('btnPanelExpand').click());
    await page.waitForTimeout(60);
    rec.lsAfterWide = await page.evaluate(() => { try { return localStorage.getItem('hp_panel_wide'); } catch (_) { return 'ERR'; } });
    await page.reload({ waitUntil: 'load' });
    await page.waitForFunction(() => !!window.HP);
    await page.evaluate(() => document.querySelector('nav#tabs button[data-tab="params"]').click());
    await page.waitForTimeout(120);
    rec.afterReload = await page.evaluate(SNAP);
  } else {
    rec.wide = null; rec.headerIntact = null; rec.afterCloseFromWide = null;
    rec.reopened = null; rec.afterShrink = null; rec.lsAfterWide = null; rec.afterReload = null;
  }
  out.viewports.push(rec);
  await ctx.close();
}
out.pageErrors = errs;
await browser.close();
console.log(JSON.stringify(out, null, 1));
