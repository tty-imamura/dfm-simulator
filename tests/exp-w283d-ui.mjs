// 第283便d(原仮定者の裁定(第73報)⑥「空間メッシュの線の表示が暗い(D₀ の変更で明るさが変動)→ D₀=0 のときの明るさにする」
// 「背景複素決定力のパラメータを『背景決定力 D₀』の下に追加」・統括の検証項目 R87)の実機採寸ハーネス(2 部):
//   MEASURE(線の明るさ — QA ui.meshLineBrightness)/ PANEL(背景複素決定力の欄 — QA ui.bgComplexPanel)。**読み取り+表示の操作だけ**(力学・presetSig・保存 JSON へは触れない —
// D₀ を 3 値へ書き換えるのは測定用の一時値で、測り終えたら元へ戻す)。正本ではない(provenance 版付き JSON を出さない)。
//
// 使い方: PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright \
//         node tests/exp-w283d-ui.mjs [target=beta/index.html] [--quick] [--panel]
//   環境変数: PLAYWRIGHT_CORE_DIR(必須 — node_modules は無い)。基点との比較は target に基点 html を渡して 2 回走らせる
//   (例 `git show de9e39b:beta/index.html > beta/_w283_base.html` — コミット前に消す)。
//   --quick は 390×844 だけ(QA ui.meshLineBrightness と同じ組)。--panel は欄の検査(PANEL)も 3 viewport で走らせる。
// 測り方(1 組 = viewport × スキン × サンプル × D₀): サンプルを読み停止 → D₀ を書く → 格子のキャッシュを捨てる →
//   2 フレーム待って #cv を読む(ON)→ overlays.spaceMesh を一時的に外して同じく読む(OFF)→ 戻す。
//   **fillText は両方の撮影で止める**(凡例の文字は D₀ で中身が変わるので線の画素から外す)。
//   ON と OFF で 1 チャネルでも 3 以上違う画素を「線の画素」とし、その ON の画素の相対輝度(WCAG・sRGB 復号)の
//   p50/p95/最大と画素数、および画素から逆算した実効 α(下地に依らない)の p50/p95 を出す。あわせて描画中に代入された strokeStyle のうち空間メッシュの琥珀
//   (SPACE_LINE_RGB)と氷青の α の集合を記録する(画素とコードの両側で同じことを言う)。
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
  { name: '768x1024', width: 768, height: 1024 },
  { name: '1280x800', width: 1280, height: 800 },
];
export const SKINS = ['dark', 'light'];
export const D0S = [0, 100, 1e4];
// 連星(🫂 boxBinaryToy — 格子の χ は D₀ を読む)と銀河(🎠 galaxyMeshSpiral — 局所場の χ=W/(W+D₀))
export const PRESETS = ['boxBinaryToy', 'galaxyMeshSpiral'];

/** ページ内で 1 サンプル × D₀ 3 値を測る(QA ui.meshLineBrightness も同じ関数を使う)。 */
export const MEASURE = async (opts) => {
  const raf = () => new Promise((r) => requestAnimationFrame(() => r()));
  const frames = async (n) => { for (let i = 0; i < n; i++) await raf(); };
  const cv = document.getElementById('cv');
  const c2 = cv.getContext('2d');
  const proto = CanvasRenderingContext2D.prototype;
  const ft = proto.fillText;
  const sd = Object.getOwnPropertyDescriptor(proto, 'strokeStyle');
  const lin = (u) => { u /= 255; return u <= 0.04045 ? u / 12.92 : Math.pow((u + 0.055) / 1.055, 2.4); };
  const lum = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  const pct = (a, q) => { if (!a.length) return null; const s = a.slice().sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(q * (s.length - 1) + 0.5))]; };
  const grab = () => c2.getImageData(0, 0, cv.width, cv.height).data;
  HP.loadPreset(opts.preset);
  HP.setRunning(false);
  await frames(3);
  const S = HP.sim;
  const d0Orig = S.params.D0;
  const ov0 = S.overlays.spaceMesh;
  // opts.mode(任意): 表示モードを一時的に差し替える(lines/guide/transport/tracer の診断モードも同じ手順で測る)
  if (opts.mode) S.overlays.spaceMesh = { mode: opts.mode };
  const ov = S.overlays.spaceMesh;
  const out = { preset: opts.preset, mode: HP.spaceMeshView(S), skin: HP.skin(), cw: cv.width, ch: cv.height, rows: [] };
  let styles = null;
  proto.fillText = function () {};
  Object.defineProperty(proto, 'strokeStyle', { configurable: true, get() { return sd.get.call(this); },
    set(v) { if (styles && typeof v === 'string' && /^rgba\((232,168,72|150,220,255|255,110,110),/.test(v)) styles.add(v); sd.set.call(this, v); } });
  try {
    for (const d0 of opts.d0s) {
      S.params.D0 = d0;
      if (HP.spaceGridInvalidate) HP.spaceGridInvalidate(S);
      if (HP.spaceLineInvalidate) HP.spaceLineInvalidate(S);
      styles = new Set();
      HP.requestRender(); await frames(3);
      const on = grab();
      const st = [...styles]; styles = null;
      S.overlays.spaceMesh = null;
      HP.requestRender(); await frames(3);
      const off = grab();
      S.overlays.spaceMesh = ov;
      // 線の色(記録した strokeStyle の先頭)。実効 α = Σ_c (ON−OFF)(線−OFF) / Σ_c (線−OFF)²(最小二乗・
      // 下地との差が小さい画素〔Σ(線−OFF)² < 40²〕は α が読めないので外す)— 下地(星・軌跡)の明るさに依らない量
      const rgb = st.length ? st[0].slice(5, st[0].lastIndexOf(',')).split(',').map(Number) : null;
      const L = [], A = [];
      for (let i = 0; i < on.length; i += 4) {
        if (Math.abs(on[i] - off[i]) >= 3 || Math.abs(on[i + 1] - off[i + 1]) >= 3 || Math.abs(on[i + 2] - off[i + 2]) >= 3) {
          L.push(lum(on[i], on[i + 1], on[i + 2]));
          if (rgb) {
            let nu = 0, de = 0;
            for (let c = 0; c < 3; c++) { const d = rgb[c] - off[i + c]; nu += (on[i + c] - off[i + c]) * d; de += d * d; }
            if (de >= 1600) A.push(nu / de);
          }
        }
      }
      const alphas = [...new Set(st.map((s) => Number(s.slice(s.lastIndexOf(',') + 1, -1))))].sort((a, b) => a - b);
      out.rows.push({ d0, px: L.length, p50: pct(L, 0.5), p95: pct(L, 0.95), max: L.length ? Math.max(...L) : null,
        aP50: pct(A, 0.5), aP95: pct(A, 0.95), alphas, styles: st.slice(0, 6) });
    }
  } finally {
    proto.fillText = ft;
    Object.defineProperty(proto, 'strokeStyle', sd);
    S.params.D0 = d0Orig; S.overlays.spaceMesh = ov0;
    if (HP.spaceGridInvalidate) HP.spaceGridInvalidate(S);
    HP.requestRender();
  }
  return out;
};

/** ページ内で背景複素決定力の欄を検査する(QA ui.bgComplexPanel も同じ関数を使う)。
 *  位置(D₀ 行の直下・左端と幅)/未宣言の表示/開閉と組み直しで params・presetSig・状態が動かない/拒否(受理器の文そのまま・
 *  params 不変)/受理(正規化後の宣言・欄の表示)/セーブの保存→読込の往復/A/B(編集対象 B だけに書く・A は不変・
 *  ワンタップ対照の D₀ と別鍵)/未宣言に戻す/英語表示。localStorage の hp_saves は測り終えたら元へ戻す。 */
export const PANEL = async (opts) => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const $ = (s) => document.querySelector(s);
  const o = { bad: [] };
  const savesBak = localStorage.getItem('hp_saves');
  const clk = async (sel) => { const e = $(sel); if (!e) { o.bad.push('no ' + sel); return; } e.click(); await wait(60); };
  const set = (sel, v) => { const e = $(sel); if (!e) { o.bad.push('no ' + sel); return; } e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); e.dispatchEvent(new Event('change', { bubbles: true })); };
  const stSum = () => { const S = HP.sim; let a = 0; for (let i = 0; i < S.n; i++) a += S.x[i] * 1.1 + S.y[i] * 1.3 + S.vx[i] * 1.7 + S.vy[i] * 1.9; return a; };
  const d0Row = () => [...document.querySelectorAll('#paramRows details.catParams .prow')]
    .find((r) => { const l = r.querySelector('label'); return l && /^(背景決定力 D₀|Background determinacy D₀|Background determinacy)/.test((l.firstChild && l.firstChild.textContent) || ''); });
  const pos = () => {
    const r = d0Row(), p = $('#bgcPanel');
    if (!r || !p) return null;
    const a = r.getBoundingClientRect(), b = p.getBoundingClientRect();
    return { next: r.nextElementSibling === p, gap: +(b.top - a.bottom).toFixed(1), dx: +(b.left - a.left).toFixed(1),
      w: +b.width.toFixed(1), rw: +a.width.toFixed(1), n: document.querySelectorAll('#bgcPanel').length,
      catLabel: (p.closest('details.catParams') && p.closest('details.catParams').querySelector('summary').firstChild.textContent) || null };
  };
  try {
    HP.setLang('ja');
    HP.loadPreset(opts.preset);
    HP.setRunning(false);
    const P0 = HP.currentPreset();
    const sig0 = HP.presetSig(P0), st0 = stSum(), d00 = HP.sim.params.D0;
    const pk0 = JSON.stringify(Object.keys(HP.sim.params).filter((k) => HP.sim.params[k] !== undefined).sort());
    document.querySelector('nav#tabs button[data-tab="params"]').click(); await wait(200);
    // 引きずり・測地線のカテゴリを開く(D₀ 行が入っている)
    const cat = [...document.querySelectorAll('#paramRows details.catParams')].find((d) => d.querySelector('#bgcPanel'));
    if (!cat) { o.bad.push('no category with #bgcPanel'); return o; }
    cat.open = true; await wait(80);
    o.pos = pos();
    const chip = () => ($('#bgcStatus') ? $('#bgcStatus').textContent : null);
    const state = () => ($('#bgcPanel') ? $('#bgcPanel').dataset.state : null);
    o.undeclared = { chip: chip(), state: state(), api: HP.bgcState().state, key: HP.sim.params.backgroundComplex === undefined };
    // 開閉・組み直しで何も動かない
    $('#bgcPanel').open = true; await wait(60);
    HP.setAbTarget('A'); await wait(60);
    const catB = [...document.querySelectorAll('#paramRows details.catParams')].find((d) => d.querySelector('#bgcPanel')); if (catB) catB.open = true;
    o.openKept = !!($('#bgcPanel') && $('#bgcPanel').open);
    o.pos2 = pos();
    o.inert = { sig: HP.presetSig(HP.currentPreset()) === sig0, st: Object.is(stSum(), st0), d0: HP.sim.params.D0 === d00,
      keys: JSON.stringify(Object.keys(HP.sim.params).filter((k) => HP.sim.params[k] !== undefined).sort()) === pk0 };
    // 拒否(部分宣言 — 未確定を 0 で補完しない)
    set('#bgcBackground', 'galactic'); set('#bgc_W0', '0.5');
    await clk('#bgcApply');
    const wantErr = HP.validateBackgroundComplex({ background: 'galactic', W0: 0.5 }).err;
    o.reject = { err: $('#bgcErr') ? $('#bgcErr').textContent : null, same: ($('#bgcErr') && $('#bgcErr').textContent) === wantErr,
      key: HP.sim.params.backgroundComplex === undefined, state: state() };
    // 受理
    const cand = { background: 'galactic', W0: 0.5, A0: [0.1, -0.2], gradW: [0, 0.01], gradA: [0, 0, 0, 0], dWdt: 0, dAdt: [0, 0], note: 'w283d test' };
    set('#bgcBackground', 'galactic'); set('#bgc_W0', '0.5'); set('#bgc_A0', '0.1, −0.2'); set('#bgc_gradW', '0 0.01');
    set('#bgc_gradA', '0,0,0,0'); set('#bgc_dWdt', '0'); set('#bgc_dAdt', '0, 0'); set('#bgc_note', 'w283d test');
    await clk('#bgcApply');
    const want = HP.validateBackgroundComplex(cand).backgroundComplex;
    const catC = [...document.querySelectorAll('#paramRows details.catParams')].find((d) => d.querySelector('#bgcPanel')); if (catC) catC.open = true;
    o.accept = { state: state(), chip: chip(), eq: JSON.stringify(HP.sim.params.backgroundComplex) === JSON.stringify(want),
      a0: $('#bgc_A0') ? $('#bgc_A0').value : null, err: $('#bgcErr') ? $('#bgcErr').textContent : null,
      d0: HP.sim.params.D0 === d00, presetSigOfPreset: HP.presetSig(HP.currentPreset()) === sig0 };
    o.pos3 = pos();
    // 宣言どおり: 同じ宣言を JSON に手で書いたプリセットと、欄で宣言したセーブの physics から作ったプリセットの署名
    const base = JSON.parse(JSON.stringify(HP.currentPreset()));
    const hand = JSON.parse(JSON.stringify(base)); hand.physics = Object.assign({}, hand.physics, { backgroundComplex: cand });
    o.sig = { changes: HP.presetSig(hand) !== sig0 };
    // セーブの往復
    localStorage.setItem('hp_saves', '[]');
    set('#saveName', 'w283d-bgc');
    await clk('#btnSave');
    const sv = JSON.parse(localStorage.getItem('hp_saves') || '[]');
    o.save = { n: sv.length, eq: !!sv[0] && JSON.stringify(sv[0].physics.backgroundComplex) === JSON.stringify(want) };
    const fromSave = JSON.parse(JSON.stringify(base)); fromSave.physics = Object.assign({}, fromSave.physics, { backgroundComplex: sv[0] ? sv[0].physics.backgroundComplex : null });
    o.sig.sameAsHand = HP.presetSig(fromSave) === HP.presetSig(hand);
    HP.loadPreset(opts.preset);
    const cleared = HP.sim.params.backgroundComplex === undefined;
    document.querySelector('nav#tabs button[data-tab="saves"]').click(); await wait(150);
    const item = [...document.querySelectorAll('#saveList .saveItem')].find((d) => d.querySelector('.name') && d.querySelector('.name').textContent === 'w283d-bgc');
    if (item) { item.querySelector('button.btn.primary').click(); await wait(150); } else o.bad.push('no save item');
    document.querySelector('nav#tabs button[data-tab="params"]').click(); await wait(150);
    o.load = { cleared, eq: JSON.stringify(HP.sim.params.backgroundComplex) === JSON.stringify(want), state: state() };
    // A/B: 編集対象 B にだけ書く
    HP.abStart('D0', 500); await wait(60);
    const ab = HP.ab();
    o.ab = { d0B: ab.simB.params.D0, d0A: HP.sim.params.D0, bgB0: JSON.stringify(ab.simB.params.backgroundComplex) === JSON.stringify(want) };
    HP.setAbTarget('B'); await wait(80);
    const catD = [...document.querySelectorAll('#paramRows details.catParams')].find((d) => d.querySelector('#bgcPanel')); if (catD) catD.open = true;
    o.ab.stateB = state();
    set('#bgcBackground', 'zero'); for (const k of ['W0', 'A0', 'gradW', 'gradA', 'dWdt', 'dAdt']) set('#bgc_' + k, k === 'W0' ? '0' : '');
    set('#bgc_note', '');
    await clk('#bgcApply');
    o.ab.bgB = ab.simB.params.backgroundComplex ? ab.simB.params.backgroundComplex.background : null;
    o.ab.bgA = HP.sim.params.backgroundComplex ? HP.sim.params.backgroundComplex.background : null;
    o.ab.shared = ab.simB.params.backgroundComplex === HP.sim.params.backgroundComplex;
    o.ab.d0B1 = ab.simB.params.D0;
    HP.setAbTarget('A'); HP.abStop(); await wait(60);
    const catE = [...document.querySelectorAll('#paramRows details.catParams')].find((d) => d.querySelector('#bgcPanel')); if (catE) catE.open = true;
    // 未宣言に戻す
    await clk('#bgcClear');
    o.clear = { key: HP.sim.params.backgroundComplex === undefined, state: state(), chip: chip() };
    // 英語
    HP.setLang('en'); document.querySelector('nav#tabs button[data-tab="params"]').click(); await wait(80);
    document.querySelector('nav#tabs button[data-tab="params"]').click(); await wait(150);
    o.en = { chip: chip(), label: $('#bgcPanel summary') ? $('#bgcPanel summary').firstChild.textContent : null };
    HP.setLang('ja');
    HP.loadPreset(opts.preset);
  } finally {
    if (savesBak === null) localStorage.removeItem('hp_saves'); else localStorage.setItem('hp_saves', savesBak);
  }
  return o;
};

export function panelGate(o, T) {
  const bad = (o.bad || []).slice();
  const p = o.pos, p2 = o.pos2, p3 = o.pos3;
  const posOk = (q) => q && q.next && q.n === 1 && q.gap >= -0.5 && q.gap <= 12 && Math.abs(q.dx) <= 16 && q.w >= q.rw * 0.8;
  if (!posOk(p)) bad.push('pos ' + JSON.stringify(p));
  if (!posOk(p2)) bad.push('pos2 ' + JSON.stringify(p2));
  if (!posOk(p3)) bad.push('pos3 ' + JSON.stringify(p3));
  const u = o.undeclared || {};
  if (!(u.chip === T.undeclaredJa && u.state === 'undeclared' && u.api === 'undeclared' && u.key)) bad.push('undeclared ' + JSON.stringify(u));
  if (!o.openKept) bad.push('openKept');
  const i = o.inert || {};
  if (!(i.sig && i.st && i.d0 && i.keys)) bad.push('inert ' + JSON.stringify(i));
  const r = o.reject || {};
  if (!(r.same && r.key && r.state === 'undeclared' && r.err)) bad.push('reject ' + JSON.stringify(r));
  const a = o.accept || {};
  if (!(a.state === 'declared' && a.eq && a.d0 && a.presetSigOfPreset && a.err === '' && a.chip === T.declaredJa)) bad.push('accept ' + JSON.stringify(a));
  const g = o.sig || {};
  if (!(g.changes && g.sameAsHand)) bad.push('sig ' + JSON.stringify(g));
  const s = o.save || {};
  if (!(s.n === 1 && s.eq)) bad.push('save ' + JSON.stringify(s));
  const l = o.load || {};
  if (!(l.cleared && l.eq && l.state === 'declared')) bad.push('load ' + JSON.stringify(l));
  const b = o.ab || {};
  if (!(b.d0B === 500 && b.d0A !== 500 && b.bgB0 && b.stateB === 'declared' && b.bgB === 'zero' && b.bgA === 'galactic' && !b.shared && b.d0B1 === 500)) bad.push('ab ' + JSON.stringify(b));
  const c = o.clear || {};
  if (!(c.key && c.state === 'undeclared' && c.chip === T.undeclaredJa)) bad.push('clear ' + JSON.stringify(c));
  const e = o.en || {};
  if (!(e.chip === T.undeclaredEn && e.label === T.labelEn)) bad.push('en ' + JSON.stringify(e));
  return { ok: bad.length === 0, bad };
}
export const PANEL_TEXT = { undeclaredJa: '未確定(未宣言)', declaredJa: '宣言済み: galactic', undeclaredEn: 'Undetermined (not declared)',
  labelEn: 'Background complex determinacy W0 / A0 (declaration)' };
export const PANEL_PRESET = 'galaxyMeshSpiral';

/** 判定: D₀ 3 値で線の α の集合が同じ・画素から逆算した実効 α の p95 の差 ≤ tolA・線の画素の輝度 p95 の差 ≤ tolL・
 *  線の画素がある。最大輝度は下地(星)と重なった画素を含むので報告だけ(判定に使わない)。 */
export function gateOf(r, tolA = 0.03, tolL = 0.02) {
  const bad = [];
  const rows = r.rows || [];
  if (rows.length < 2) bad.push('rows<2');
  for (const x of rows) if (!(x.px > 0)) bad.push(`d0=${x.d0}:px=0`);
  const a0 = rows.length ? JSON.stringify(rows[0].alphas) : '';
  for (const x of rows) if (JSON.stringify(x.alphas) !== a0) bad.push(`d0=${x.d0}:alphas=${JSON.stringify(x.alphas)}≠${a0}`);
  const spread = (k) => { const v = rows.map((x) => x[k]).filter((z) => z != null); return v.length ? Math.max(...v) - Math.min(...v) : 0; };
  const s95 = spread('p95'), sMax = spread('max'), sA = spread('aP95');
  if (s95 > tolL) bad.push(`p95 spread=${s95.toFixed(4)}`);
  if (sA > tolA) bad.push(`aP95 spread=${sA.toFixed(4)}`);
  return { ok: bad.length === 0, bad, p95Spread: +s95.toFixed(5), aP95Spread: +sA.toFixed(5), maxSpread: +sMax.toFixed(5) };
}

if (import.meta.url === 'file://' + path.resolve(process.argv[1] || '')) {
  let browser;
  try { browser = await req('playwright').chromium.launch(); }
  catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }
  const out = { target: TARGET, rows: [] };
  const vps = QUICK ? VIEWPORTS.slice(0, 1) : VIEWPORTS;
  for (const vp of vps) for (const skin of SKINS) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', (e) => errs.push(String(e.message || e)));
    await page.goto(INDEX, { waitUntil: 'load' });
    await page.waitForFunction(() => !!window.HP && !!HP.loadPreset);
    await page.evaluate((sk) => { HP.setLang('ja'); if (HP.setSkin) HP.setSkin(sk); }, skin);
    for (const preset of PRESETS) {
      const r = await page.evaluate(MEASURE, { preset, d0s: D0S });
      r.vp = vp.name; r.gate = gateOf(r);
      out.rows.push(r);
    }
    out.rows.filter((r) => r.vp === vp.name && r.skin === skin).forEach((r) => { r.jsErrors = errs.length; });
    await page.evaluate(() => { try { localStorage.removeItem('hp_skin'); } catch (_) {} });
    await ctx.close();
  }
  // 診断モード(lines/guide/transport/tracer)も 390×844 の dark で同じ手順で測る(QA には入れない —— 記録)
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    await page.goto(INDEX, { waitUntil: 'load' });
    await page.waitForFunction(() => !!window.HP && !!HP.loadPreset);
    await page.evaluate(() => HP.setLang('ja'));
    out.modes = [];
    for (const [preset, mode] of [['boxBinaryToy', 'lines'], ['boxBinaryToy', 'guide'], ['boxBinaryToy', 'transport'], ['galaxyMeshSpiral', 'lines'], ['galaxyMeshSpiral', 'tracer']]) {
      const r = await page.evaluate(MEASURE, { preset, d0s: D0S, mode });
      r.gate = gateOf(r, 0.05, 0.05);
      out.modes.push(r);
    }
    await ctx.close();
  }
  if (args.includes('--panel')) {
    out.panel = [];
    for (const vp of VIEWPORTS) {
      const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      const page = await ctx.newPage();
      const errs = [];
      page.on('pageerror', (e) => errs.push(String(e.message || e)));
      page.on('dialog', (d) => d.accept());
      await page.goto(INDEX, { waitUntil: 'load' });
      await page.waitForFunction(() => !!window.HP && !!HP.loadPreset);
      const r = await page.evaluate(PANEL, { preset: PANEL_PRESET });
      r.vp = vp.name; r.jsErrors = errs.length; r.gate = panelGate(r, PANEL_TEXT);
      out.panel.push(r);
      await ctx.close();
    }
  }
  await browser.close();
  out.ok = out.rows.every((r) => r.gate.ok && r.jsErrors === 0) && (!out.panel || out.panel.every((r) => r.gate.ok && r.jsErrors === 0));
  console.log(JSON.stringify(out, null, 1));
}
