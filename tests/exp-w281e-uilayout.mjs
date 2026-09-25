// 第281便e(原仮定者の裁定(第71報)「タブを広げた時にシミュレーション画面の隙間が不安定に残っている。『セーブ』
// タブで必ず発生している。タブを広げた時にヘッダー高さ程度のシミュレーション画面を残す事で安定させる」)の
// 実機採寸ハーネス。第279便d の tests/exp-w279d-uilayout.mjs を継ぐ。**読み取り+UI 操作だけ**(力学・presetSig・
// 保存 JSON へは触れない — 「セーブ」5 件は localStorage hp_saves へ表示用の最小の行を入れるだけで、読み込まない)。
// 正本ではない(provenance 版付き JSON を出さない)。
//
// 使い方: PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright \
//         node tests/exp-w281e-uilayout.mjs [target=beta/index.html] [--quick]
//   環境変数: PLAYWRIGHT_CORE_DIR(必須 — node_modules は無い)。基点との比較は target に基点 html を渡して 2 回走らせる
//   (例 `git show 53aaa64:beta/index.html > beta/_w281_base.html` — コミット前に消す)。
//   --quick は縦 390×844 と横 1024×768 だけ(QA ui.panelReserve と同じ組)。
// 出力: 標準出力の JSON 1 個。viewport × タブ(説明/パラメータ/セーブ〔保存 0 件〕/セーブ〔保存 5 件〕/AI追加)×
//   状態(開く=narrow・広げる=wide・戻す=back)ごとに:
//   hdr(header.offsetHeight)・cv(#canvasWrap の高さ)・gapCvTp(操作列の上端 − キャンバスの下端)・
//   gapTbPn(パネルの上端 − タブの下端)・pnBottom(画面下端 − パネルの下端)・cvBacking(resizeCanvas が
//   測った CSS 高 ch − #canvasWrap の高さ — 追随の遅れ)・cv0(クリック直後の次フレームのキャンバス高 — 不安定の検出)・
//   rsDelta(renderSaves()/renderCustomList() を呼んだ前後のキャンバス高の差)・reserve(--panelWideReserve)。
//   さらに縦 390×844 で文字サイズ「大」(--uz 1.3)+英語のときと、ヘッダーだけを 40px 高くしたとき(safe-area の
//   上端相当・window の resize が出ない)の広げた状態(控除分がヘッダーの高さに追随するか)。横画面 2 カラムの gapCvTp は
//   画面下端 − キャンバスの下端。
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const TARGET = args.find((a) => !a.startsWith('--')) || 'beta/index.html';
const QUICK = args.includes('--quick');
const INDEX = 'file://' + path.join(ROOT, TARGET);
const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

export const VIEWPORTS = [
  { name: '390x844', width: 390, height: 844 },
  { name: '412x915', width: 412, height: 915 },
  { name: '768x1024', width: 768, height: 1024 },
  { name: '1024x768', width: 1024, height: 768 },   // 横画面 2 カラム(変えない — 広げるボタンは出ない)
];
export const TABS = ['help', 'params', 'saves0', 'saves5', 'ai'];

/** ページ内で 1 つの viewport を測る(QA ui.panelReserve も同じ関数文字列を使う)。 */
export const MEASURE = async (opts) => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const raf = () => new Promise((r) => requestAnimationFrame(() => r()));
  const R = (s) => document.querySelector(s).getBoundingClientRect();
  const snap = () => {
    const hd = document.querySelector('header'), cv = R('#canvasWrap'), tp = R('#transport'), tb = R('nav#tabs');
    const pnEl = document.getElementById('panel'); const pn = pnEl.getBoundingClientRect();
    const open = pnEl.classList.contains('open');
    const bc = (window.HP && HP.backingCap) ? HP.backingCap() : null;
    const grid = getComputedStyle(document.getElementById('app')).display === 'grid';
    return { hdr: hd.offsetHeight, cv: +cv.height.toFixed(1),
      // 縦積み: 操作列の上端 − キャンバスの下端 / 横画面 2 カラム: 画面下端 − キャンバスの下端(キャンバス列は下端まで)
      gapCvTp: +((grid ? innerHeight : tp.top) - cv.bottom).toFixed(1),
      gapTbPn: open ? +(pn.top - tb.bottom).toFixed(1) : null,
      pnBottom: open ? +(innerHeight - pn.bottom).toFixed(1) : null,
      cvBacking: bc ? +(bc.cssH - Math.max(50, cv.height)).toFixed(1) : null,
      reserve: getComputedStyle(document.documentElement).getPropertyValue('--panelWideReserve').trim() || null };
  };
  const setSaves = (n) => {
    const a = [];
    for (let i = 0; i < n; i++) a.push({ name: 'w281e-probe-' + (i + 1), savedAt: Date.UTC(2026, 8, 25, 0, i), presetId: 'saturnRingRealKF1',
      presetName: 'probe', comment: i % 2 ? 'コメント ' + i : '' });
    try { localStorage.setItem('hp_saves', JSON.stringify(a)); } catch (_) {}
  };
  const tabBtn = (t) => document.querySelector('nav#tabs button[data-tab="' + t + '"]');
  const layout = getComputedStyle(document.getElementById('app')).display;
  const expBtn = document.getElementById('btnPanelExpand');
  const canWide = !!expBtn && getComputedStyle(expBtn).display !== 'none';
  const isWide = () => document.getElementById('panel').classList.contains('wide');
  const o = { layout, canWide, closed: snap(), tabs: {} };
  for (const tk of opts.tabs) {
    const t = tk.startsWith('saves') ? 'saves' : tk;
    if (tk === 'saves0') setSaves(0); if (tk === 'saves5') setSaves(5);
    const row = {};
    tabBtn(t).click(); await raf();
    const n0 = snap(); await wait(300); row.narrow = { ...snap(), cv0: n0.cv };
    if (canWide) {
      if (!isWide()) expBtn.click();
      await raf(); const w0 = snap(); await wait(300);
      const w = { ...snap(), cv0: w0.cv };
      // renderSaves / renderCustomList の前後(中身を描き直してもキャンバスが動かない)
      const before = snap().cv;
      if (t === 'saves' && typeof renderSaves === 'function') renderSaves();
      if (t === 'ai' && typeof renderCustomList === 'function') renderCustomList();
      await raf(); await wait(120);
      w.rsDelta = +(snap().cv - before).toFixed(1);
      row.wide = w;
      expBtn.click(); await raf(); const b0 = snap(); await wait(300);
      row.back = { ...snap(), cv0: b0.cv };
    } else {
      const before = snap().cv;
      if (t === 'saves' && typeof renderSaves === 'function') renderSaves();
      if (t === 'ai' && typeof renderCustomList === 'function') renderCustomList();
      await raf(); await wait(120);
      row.narrow.rsDelta = +(snap().cv - before).toFixed(1);
    }
    tabBtn(t).click(); await wait(150);   // 閉じる
    o.tabs[tk] = row;
  }
  if (opts.uz13en && canWide) {
    HP.setLang('en');
    document.documentElement.style.setProperty('--uz', '1.3');
    await wait(200);
    const res = {};
    for (const t of ['help', 'saves']) {
      tabBtn(t).click(); await raf();
      if (!isWide()) expBtn.click();
      await wait(300); res[t] = snap();
      expBtn.click(); await wait(100); tabBtn(t).click(); await wait(100);
    }
    o.uz13en = res;
    document.documentElement.style.removeProperty('--uz'); HP.setLang('ja');
    // ヘッダーだけが高くなる場合(iPhone の safe-area-inset-top 相当を style で 40px 足す — window の resize は出ない):
    // ヘッダー・操作列・タブの ResizeObserver が控除分を測り直すか
    const st = document.createElement('style'); st.textContent = 'header{padding-top:48px !important;}';
    document.head.appendChild(st); await wait(200);
    const res2 = {};
    for (const t of ['help', 'saves']) {
      tabBtn(t).click(); await raf();
      if (!isWide()) expBtn.click();
      await wait(300); res2[t] = snap();
      expBtn.click(); await wait(100); tabBtn(t).click(); await wait(100);
    }
    o.safeTop40 = res2;
    st.remove(); await wait(150);
  }
  try { localStorage.removeItem('hp_saves'); localStorage.removeItem('hp_panel_wide'); } catch (_) {}
  return o;
};

/** 1 つの viewport の結果 → 門(広げた状態: キャンバス ≥ ヘッダー高・隙間 0・描き直しで動かない・直後と 300 ms 後が同じ)。 */
export function gateOf(r) {
  const bad = [];
  const eq0 = (x) => x != null && Math.abs(x) <= 0.5;
  for (const [tk, row] of Object.entries(r.tabs)) {
    for (const [st, s] of Object.entries(row)) {
      if (!eq0(s.gapCvTp)) bad.push(`${tk}.${st}.gapCvTp=${s.gapCvTp}`);
      if (s.gapTbPn != null && !eq0(s.gapTbPn)) bad.push(`${tk}.${st}.gapTbPn=${s.gapTbPn}`);
      if (s.pnBottom != null && !eq0(s.pnBottom) && st === 'wide') bad.push(`${tk}.${st}.pnBottom=${s.pnBottom}`);
      if (s.cv + 0.5 < s.hdr) bad.push(`${tk}.${st}.cv=${s.cv}<hdr=${s.hdr}`);
      if (s.cvBacking != null && Math.abs(s.cvBacking) > 1) bad.push(`${tk}.${st}.cvBacking=${s.cvBacking}`);
      if (s.rsDelta != null && !eq0(s.rsDelta)) bad.push(`${tk}.${st}.rsDelta=${s.rsDelta}`);
      if (st === 'wide' && Math.abs(s.cv0 - s.cv) > 0.5) bad.push(`${tk}.wide.cv0=${s.cv0}≠${s.cv}`);
      if (st === 'wide' && Math.abs(s.cv - s.hdr) > 1.5) bad.push(`${tk}.wide.cv=${s.cv}≠hdr=${s.hdr}`);
    }
  }
  for (const k of ['uz13en', 'safeTop40']) if (r[k]) for (const [t, s] of Object.entries(r[k])) if (s.cv + 0.5 < s.hdr || Math.abs(s.cv - s.hdr) > 1.5) bad.push(`${k}.${t}.cv=${s.cv}/hdr=${s.hdr}`);
  // 広げた状態のキャンバス高が全タブで同じ(不安定の解消)
  const wides = Object.values(r.tabs).map((row) => row.wide && row.wide.cv).filter((x) => x != null);
  const spread = wides.length ? Math.max(...wides) - Math.min(...wides) : 0;
  if (spread > 0.5) bad.push(`wideSpread=${spread.toFixed(1)}`);
  return { ok: bad.length === 0, bad, wideSpread: +spread.toFixed(1) };
}

if (import.meta.url === 'file://' + path.resolve(process.argv[1] || '')) {
  let browser;
  try { browser = await req('playwright').chromium.launch(); }
  catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }
  const out = { target: TARGET, rows: {} };
  const vps = QUICK ? VIEWPORTS.filter((v) => v.name === '390x844' || v.name === '1024x768') : VIEWPORTS;
  for (const vp of vps) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', (e) => errs.push(String(e.message || e)));
    await page.goto(INDEX, { waitUntil: 'load' });
    await page.waitForFunction(() => !!window.HP);
    await page.evaluate(() => { try { HP.setLang('ja'); localStorage.removeItem('hp_panel_wide'); } catch (_) {} });
    const r = await page.evaluate(MEASURE, { tabs: TABS, uz13en: vp.name === '390x844' });
    r.jsErrors = errs.length;
    r.gate = gateOf(r);
    out.rows[vp.name] = r;
    await ctx.close();
  }
  await browser.close();
  out.ok = Object.values(out.rows).every((r) => r.gate.ok && r.jsErrors === 0);
  console.log(JSON.stringify(out, null, 1));
}
