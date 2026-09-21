// 第276便f(原仮定者の裁定(第66報)(5)「UI 5 件」)の実機採寸ハーネス。
// **読み取り+UI 操作だけ**(力学へは触れない)。正本ではない — ログ用の採寸器である。
//
// 使い方: PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright \
//         node tests/exp-w276f-helpui.mjs [target]
// 出力: 標準出力の JSON 1 個。
//   overlap  … 390×844 の縦画面で、タブを広げた状態(#app.panelWide)のとき
//              #hud / #bodyEdit / #aboutPanel / #pmPanel / #avPanel が #panel の上に
//              **描かれるか**。矩形の交差(rect)だけでなく、**ブラウザの当たり判定**
//              (elementsFromPoint — クリップを反映する)で実測する。#hud は
//              pointer-events:none なので、採寸の間だけ auto へ上書きして戻す。
//   brief    … 内蔵全本の「概要」(descStruct.brief があればそれ・無ければ summary からの
//              機械抽出)の字数分布。ja/en 別。抽出の決定性(2 回呼んで同一)も見る。
//   order    … 説明タブ #helpBody の直下要素の並び(クラス/タグ/id の列)。
//   toggle   … 監査ビューの開く→もう一度押す の表示状態。
//   fold     … 「失敗から見る」「観測結果カード」「数値主張」の折り畳みの既定開閉。
// 基点 html(未適用)へ向けても走る — 無い機能は null になる。
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

const out = { target: TARGET, pageErrors: [] };
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();
page.on('pageerror', (e) => out.pageErrors.push(String(e.message || e)));
await page.goto(INDEX, { waitUntil: 'load' });
await page.evaluate(() => { try { localStorage.removeItem('hp_panel_wide'); } catch (_) {} });
await page.reload({ waitUntil: 'load' });
await page.waitForFunction(() => !!window.HP);

// ---- ① 広げた状態のはみ出し(矩形 + 当たり判定)
out.overlap = await page.evaluate(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const IDS = ['hud', 'bodyEdit', 'aboutPanel', 'pmPanel', 'avPanel'];
  const rect = (e) => { const b = e.getBoundingClientRect();
    return { top: +b.top.toFixed(1), bottom: +b.bottom.toFixed(1), left: +b.left.toFixed(1),
      right: +b.right.toFixed(1), h: +b.height.toFixed(1), w: +b.width.toFixed(1) }; };
  // 「フッター」= 操作列(#transport)の上端から画面下端まで(操作列・タブ・パネル)。
  // その矩形の中を格子状に叩いて、その点に当該要素(かその子孫)が**描かれているか**を見る。
  // elementsFromPoint は overflow クリップを反映するので、矩形の交差より強い判定になる
  const footerBox = () => {
    const tr = document.getElementById('transport').getBoundingClientRect();
    return { left: 0, right: innerWidth, top: tr.top, bottom: innerHeight };
  };
  const hitsFooter = (el) => {
    const pb = footerBox();
    if (pb.bottom - pb.top < 1) return null;
    let hit = 0, n = 0;
    for (let fy = 0.02; fy < 1; fy += 0.04) for (let fx = 0.05; fx < 1; fx += 0.1) {
      const x = pb.left + (pb.right - pb.left) * fx, y = pb.top + (pb.bottom - pb.top) * fy;
      if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) continue;
      n++;
      const stack = document.elementsFromPoint(x, y);
      if (stack.some((e) => e === el || el.contains(e))) hit++;
    }
    return { n, hit };
  };
  // HUD は毎フレーム書き換わるので、**同じ同期タスクの中で**長文を入れて測り、最後に戻す
  const LONG = ('HUD ' + 'X'.repeat(40) + '\n').repeat(14);
  const snapAll = () => {
    const o = {};
    const hud = document.getElementById('hud');
    const savedText = hud.textContent, savedPe = hud.style.pointerEvents;
    hud.textContent = LONG; hud.style.pointerEvents = 'auto';
    const pn = document.getElementById('panel');
    o._panel = rect(pn);
    o._transport = rect(document.getElementById('transport'));
    o._tabs = rect(document.querySelector('nav#tabs'));
    o._canvasWrap = rect(document.getElementById('canvasWrap'));
    o._canvasOverflow = getComputedStyle(document.getElementById('canvasWrap')).overflow;
    const fb = footerBox();
    o._footer = { top: +fb.top.toFixed(1), bottom: +fb.bottom.toFixed(1) };
    for (const id of IDS) {
      const el = document.getElementById(id); if (!el) { o[id] = null; continue; }
      const cs = getComputedStyle(el);
      const r = rect(el);
      const inter = Math.max(0, Math.min(r.bottom, fb.bottom) - Math.max(r.top, fb.top))
        * Math.max(0, Math.min(r.right, fb.right) - Math.max(r.left, fb.left));
      o[id] = { rect: r, display: cs.display, rectOverlapArea: +inter.toFixed(1),
        hit: cs.display === 'none' ? null : hitsFooter(el) };
    }
    hud.textContent = savedText; hud.style.pointerEvents = savedPe;
    return o;
  };
  const res = {};
  document.querySelector('nav#tabs button[data-tab="params"]').click();
  await wait(140);
  res.narrow = snapAll();
  const be = document.getElementById('btnPanelExpand');
  if (be && getComputedStyle(be).display !== 'none') {
    be.click(); await wait(140);
    res.wide = snapAll();
    // 全面パネル 3 枚と粒子編集も開いた状態で測る
    document.getElementById('aboutPanel').style.display = 'block';
    document.getElementById('avPanel').style.display = 'block';
    document.getElementById('pmPanel').style.display = 'block';
    document.getElementById('bodyEdit').style.display = 'block';
    await wait(80);
    res.wideAllOpen = snapAll();
    document.getElementById('aboutPanel').style.display = 'none';
    document.getElementById('avPanel').style.display = 'none';
    document.getElementById('pmPanel').style.display = 'none';
    document.getElementById('bodyEdit').style.display = 'none';
    be.click(); await wait(140);
  } else { res.wide = null; res.wideAllOpen = null; }
  document.getElementById('btnPanelClose').click();
  await wait(120);
  return res;
});

// ---- ② 概要(brief)の字数分布
out.brief = await page.evaluate(() => {
  const has = typeof HP.descBriefOf === 'function';
  const mk = (lang) => {
    HP.setLang(lang);
    const rows = [];
    for (const p of HP.allPresets()) {
      if (String(p.id).startsWith('custom_')) continue;
      const ds = (lang === 'en') ? ((p.en && p.en.descStruct) || null) : (p.descStruct || null);
      let brief = null, src = 'none', stable = null;
      if (has) {
        brief = HP.descBriefOf(p);
        const again = HP.descBriefOf(p);
        stable = brief === again;
        src = (ds && typeof ds.brief === 'string' && ds.brief.trim()) ? 'declared'
          : (ds && ds.summary) ? 'extracted' : 'none';
      }
      // 切り方の分類: whole=落としていない / atSentence=文末で切った / midSentence=文の途中で切った
      let cut = null;
      if (typeof brief === 'string' && brief) {
        if (!brief.endsWith('…')) cut = 'whole';
        else cut = /[。．.！？!?][」』）)\]】〕]?$/.test(brief.slice(0, -1)) ? 'atSentence' : 'midSentence';
      }
      rows.push({ id: p.id, src, len: brief === null ? null : brief.length,
        sumLen: ds && ds.summary ? ds.summary.length : 0, stable, cut,
        text: brief });
    }
    return rows;
  };
  const ja = mk('ja'), en = mk('en');
  HP.setLang('ja');
  const stat = (rows) => {
    const ls = rows.filter((r) => r.len !== null).map((r) => r.len);
    const hist = {};
    for (const l of ls) { const b = Math.floor(l / 20) * 20; hist[b] = (hist[b] || 0) + 1; }
    return { n: rows.length, withBrief: ls.length,
      declared: rows.filter((r) => r.src === 'declared').length,
      extracted: rows.filter((r) => r.src === 'extracted').length,
      none: rows.filter((r) => r.src === 'none').length,
      max: ls.length ? Math.max(...ls) : null, min: ls.length ? Math.min(...ls) : null,
      over120: rows.filter((r) => r.len !== null && r.len > 120).map((r) => r.id + ':' + r.len),
      unstable: rows.filter((r) => r.stable === false).map((r) => r.id),
      whole: rows.filter((r) => r.cut === 'whole').length,
      atSentence: rows.filter((r) => r.cut === 'atSentence').length,
      midSentence: rows.filter((r) => r.cut === 'midSentence').map((r) => r.id),
      hist };
  };
  return { has, ja: stat(ja), en: stat(en),
    jaSample: ja.slice(0, 5).map((r) => ({ id: r.id, src: r.src, len: r.len, text: r.text })),
    jaLongest: ja.filter((r) => r.len !== null).sort((a, b) => b.len - a.len).slice(0, 8)
      .map((r) => ({ id: r.id, src: r.src, len: r.len, text: r.text })),
    jaAll: ja.map((r) => ({ id: r.id, src: r.src, len: r.len })) };
});

// ---- ③ 説明タブの並び / ④ 監査ビューのトグル / ⑤ 折り畳み
out.order = await page.evaluate(() => {
  const pick = (id) => { HP.loadPreset(id, false);
    return [...document.querySelectorAll('#helpBody > *')].map((e) =>
      (e.id ? '#' + e.id : '') + (e.className ? '.' + String(e.className).split(' ').join('.') : '')
      + '<' + e.tagName.toLowerCase() + '>'); };
  const o = { mercury: pick('mercury'), plutoCharonReal: pick('plutoCharonReal'), saturn: pick('saturn') };
  HP.loadPreset('saturn', false);
  return o;
});
out.toggle = await page.evaluate(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  HP.loadPreset('mercury', false);
  const btn = document.getElementById('btnAuditView'); if (!btn) return null;
  const st = () => ({ display: document.getElementById('avPanel').style.display,
    pressed: btn.getAttribute('aria-expanded') });
  const o = { before: st() };
  btn.click(); await wait(60); o.afterFirst = st();
  btn.click(); await wait(60); o.afterSecond = st();
  btn.click(); await wait(60); o.afterThird = st();
  document.getElementById('avClose').click(); await wait(60); o.afterClose = st();
  HP.loadPreset('saturn', false);
  return o;
});
out.fold = await page.evaluate(() => {
  const o = {};
  for (const id of ['mercury', 'plutoCharonReal']) {
    HP.loadPreset(id, false);
    const g = (sel) => { const e = document.querySelector(sel); return e
      ? { tag: e.tagName.toLowerCase(), open: e.tagName.toLowerCase() === 'details' ? e.open : null,
        rows: e.querySelectorAll('.ffRow').length } : null; };
    o[id] = { ff: g('#helpBody .ffBox:not(.ocBox)'), oc: g('#helpBody .ocBox'),
      claims: g('#claimsDetails'),
      ocRows: document.querySelectorAll('#helpBody .ocRow').length };
  }
  HP.loadPreset('saturn', false);
  return o;
});

await ctx.close();
await browser.close();
console.log(JSON.stringify(out, null, 1));
