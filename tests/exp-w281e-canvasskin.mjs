// 第281便e(原仮定者の裁定(第71報)「UI のスキン … 『ライト』を追加」)の**キャンバス配色 2 案の比較器**。
// 案「固定」(採用・ライトでもシミュレーション画面は暗い背景のまま)と案「追随」(<html data-canvas="follow"> —
// 描画済みの画素を invert(1) hue-rotate(180deg) で反転)を、同じ停止中の 1 フレームの画面の画素で比べる。
// **読み取り+表示の切替だけ**(力学・presetSig・保存 JSON に触れない — 停止した状態でスキンの属性だけを替えて撮る)。
// 正本ではない(provenance 版付き JSON を出さない)。
//
// 使い方: PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright node tests/exp-w281e-canvasskin.mjs [target=beta/index.html]
//   環境変数: PLAYWRIGHT_CORE_DIR(必須)。viewport は 412×915(縦)・パネルは閉じた状態・#hud 等の重なりは隠して
//   キャンバスの画素だけを撮る。
// 出力: 標準出力の JSON 1 個。サンプルごと・案(dark / lightFixed / lightFollow)ごとに:
//   bg(最頻色 = 背景)・marks(ダークの画面で背景との比 ≥1.2 の画素 = 描かれた印。位置はダークで固定)・
//   vis3(印の画素のうち背景との比 ≥3 = WCAG の非文字の下限を満たす割合)・medRatio(印の画素の背景との比の中央値)・
//   lumRho(印の画素の相対輝度のダークとの順位相関 — 1 = 明るさの順が同じ・−1 = 逆転)・
//   hueMed(彩度のある印の画素の色相差の中央値〔度〕— ダークとの差)・same(ダークと画素が完全一致した割合)。
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const TARGET = args.find((a) => !a.startsWith('--')) || 'beta/index.html';
const INDEX = 'file://' + path.join(ROOT, TARGET);
const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

export const PRESETS = ['saturnRingRealKF1', 'galaxyMeshSpiral', 'bhCore', 'gw150914DFM'];
export const MODES = [
  { name: 'dark', skin: 'dark', canvas: 'fixed' },
  { name: 'lightFixed', skin: 'light', canvas: 'fixed' },
  { name: 'lightFollow', skin: 'light', canvas: 'follow' },
];

const lin = (x) => { const s = x / 255; return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); };
const lum = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const cr = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
function hsv(r, g, b) {
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  let h = 0;
  if (d > 0) { if (mx === r) h = ((g - b) / d) % 6; else if (mx === g) h = (b - r) / d + 2; else h = (r - g) / d + 4; h *= 60; if (h < 0) h += 360; }
  return { h, s: mx ? d / mx : 0 };
}
const median = (a) => { if (!a.length) return null; const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
function rankOf(a) { const idx = a.map((v, i) => [v, i]).sort((x, y) => x[0] - y[0]); const r = new Array(a.length); idx.forEach(([, i], k) => { r[i] = k; }); return r; }
function spearman(a, b) {
  const n = a.length; if (n < 3) return null;
  const ra = rankOf(a), rb = rankOf(b); const m = (n - 1) / 2;
  let sab = 0, saa = 0, sbb = 0;
  for (let i = 0; i < n; i++) { const x = ra[i] - m, y = rb[i] - m; sab += x * y; saa += x * x; sbb += y * y; }
  return sab / Math.sqrt(saa * sbb);
}
function modeColor(px) {
  const cnt = new Map(); let best = null, bn = 0;
  for (let i = 0; i < px.length; i += 4) { const k = (px[i] << 16) | (px[i + 1] << 8) | px[i + 2]; const n = (cnt.get(k) || 0) + 1; cnt.set(k, n); if (n > bn) { bn = n; best = k; } }
  return [(best >> 16) & 255, (best >> 8) & 255, best & 255];
}

/** 3 案の画素(RGBA の平坦配列・同じ寸法)→ 指標。 */
export function compare(imgs) {
  const D = imgs.dark;
  const bgD = modeColor(D); const lbD = lum(...bgD);
  const marks = [];
  for (let i = 0; i < D.length; i += 4) if (cr(lum(D[i], D[i + 1], D[i + 2]), lbD) >= 1.2) marks.push(i);
  const out = { pixels: D.length / 4, marks: marks.length, markFrac: +(marks.length / (D.length / 4)).toFixed(4) };
  // 印の画素は多いので決定的に間引く(順位相関の計算量)
  const step = Math.max(1, Math.floor(marks.length / 20000));
  const lumD = []; const sub = [];
  for (let k = 0; k < marks.length; k += step) { const i = marks[k]; sub.push(i); lumD.push(lum(D[i], D[i + 1], D[i + 2])); }
  for (const [name, P] of Object.entries(imgs)) {
    const bg = modeColor(P); const lb = lum(...bg);
    let v3 = 0; const rs = []; let same = 0;
    for (let i = 0; i < P.length; i += 4) if (P[i] === D[i] && P[i + 1] === D[i + 1] && P[i + 2] === D[i + 2]) same++;
    for (const i of marks) { const r = cr(lum(P[i], P[i + 1], P[i + 2]), lb); if (r >= 3) v3++; }
    const lumP = []; const dh = [];
    for (const i of sub) {
      rs.push(cr(lum(P[i], P[i + 1], P[i + 2]), lb));
      lumP.push(lum(P[i], P[i + 1], P[i + 2]));
      const a = hsv(D[i], D[i + 1], D[i + 2]), b = hsv(P[i], P[i + 1], P[i + 2]);
      if (a.s > 0.25 && b.s > 0.25) { let d = Math.abs(a.h - b.h); if (d > 180) d = 360 - d; dh.push(d); }
    }
    out[name] = { bg: '#' + bg.map((x) => x.toString(16).padStart(2, '0')).join(''),
      vis3: marks.length ? +(v3 / marks.length).toFixed(4) : null, medRatio: rs.length ? +median(rs).toFixed(2) : null,
      lumRho: +(spearman(lumD, lumP) ?? NaN).toFixed(3), hueMed: dh.length ? +median(dh).toFixed(1) : null, hueN: dh.length,
      same: +(same / (P.length / 4)).toFixed(4) };
  }
  return out;
}

if (import.meta.url === 'file://' + path.resolve(process.argv[1] || '')) {
  let browser;
  try { browser = await req('playwright').chromium.launch(); }
  catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }
  const ctx = await browser.newContext({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e.message || e)));
  await page.goto(INDEX, { waitUntil: 'load' });
  await page.waitForFunction(() => !!window.HP && !!HP.setSkin);
  const out = { target: TARGET, viewport: '412x915', rows: {} };
  for (const id of PRESETS) {
    await page.evaluate((id) => { HP.setLang('ja'); HP.loadPreset(id, false); HP.setRunning(false); HP.tick(40); }, id);
    await page.addStyleTag({ content: '#hud,#notice,#bodyEdit,#pmPanel{visibility:hidden !important;}' });
    const imgs = {};
    for (const m of MODES) {
      await page.evaluate((m) => { HP.setSkin(m.skin); HP.setCanvasSkin(m.canvas); }, m);
      await page.waitForTimeout(250);
      const buf = await page.locator('#canvasWrap').screenshot();
      imgs[m.name] = await page.evaluate(async (b64) => {
        const im = new Image(); im.src = 'data:image/png;base64,' + b64; await im.decode();
        const c = document.createElement('canvas'); c.width = im.width; c.height = im.height;
        const g = c.getContext('2d'); g.drawImage(im, 0, 0);
        return Array.from(g.getImageData(0, 0, c.width, c.height).data);
      }, buf.toString('base64'));
    }
    out.rows[id] = compare(imgs);
  }
  await page.evaluate(() => { HP.setSkin('dark'); HP.setCanvasSkin('fixed'); try { localStorage.removeItem('hp_skin'); } catch (_) {} });
  out.jsErrors = errs.length;
  await browser.close();
  console.log(JSON.stringify(out, null, 1));
}
