// 第285便c(原仮定者の裁定(第75報)⑥・統括の検証項目 R99)—— **背景場の微分の宣言の型 bgModel の表示**(#bgcPanel の型の選択と算出結果の表)の器。
// QA ui.bgDerivPanel が同じ関数(PANEL・gate)を使う。正本は出さない(表示の検査だけ —— 物理は 1 bit も動かさない)。
//
// ■ 何を見るか(390×844 と 1024×768)
//   ① 未宣言: #bgcModel の既定は「手入力」(値 "")・算出結果の表 #bgcDerived の 6 成分がすべて「未確定」・接続の行は「未接続」(💮 系の share 経路)
//   ② 型ごとの欄: uniform は W0・A0・domain・U だけ / sources は ledger・refPos・eps だけ / distantSource は W0・Rbg・thetaBg・Vext・aExt だけ /
//      null は W0・A0 だけ / 手入力は 6 成分(隠れた欄は宣言に入れない)
//   ③ 宣言 → 表: uniform は W0・A0「宣言」・微分 4 つ「宣言による 0」/ sources(反例の源対)は 6 つ「算出」・∂A_y/∂x=1.5 /
//      distantSource は W0「宣言」・残り「算出」で値が閉じた式と一致 / null は微分 4 つ「未確定」(値は「—」)
//   ④ 拒否: 台帳の加速度の欠落は受理器の文をそのまま出し params を変えない
//   ⑤ 開く・型を選ぶだけでは params も presetSig も変わらない・「未宣言に戻す」で鍵が消える・横はみ出し 0・英語表示の語
//   ⑥ meshVelocity(field:"backgroundComplex")の本(🔁 mercuryGeoToy3)では接続の行が「適用中」
// 実行: PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright node tests/exp-w285c-ui.mjs
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const PANEL_PRESET = 'galaxyMeshSpiral';
export const MESH_PRESET = 'mercuryGeoToy3';
export const VIEWPORTS = [{ name: '390x844', width: 390, height: 844 }, { name: '1024x768', width: 1024, height: 768 }];
/** 表示の語(ja/en)—— 4 語 + 「宣言による 0」 */
export const WORDS = { ja: { computed: '算出', declared: '宣言', declaredZero: '宣言による 0', undetermined: '未確定', applied: '適用中', unwired: '未接続' },
  en: { computed: 'computed', declared: 'declared', declaredZero: '0 by declaration', undetermined: 'undetermined', applied: 'applied', unwired: 'not wired' } };
/** ③ の宣言(反例の源対・遠方 1 源) */
export const LEDGER_PAIR = [{ id: 'g1', m: 1, x: 2, y: 0, vx: 0, vy: 3, ax: 0, ay: 0 }, { id: 'g2', m: 1, x: -2, y: 0, vx: 0, vy: -3, ax: 0, ay: 0 }];
export const DISTANT = { W0: 0.25, Rbg: 2, thetaBg: 0.5, Vext: [0.3, -0.2], aExt: [0.01, 0.02] };

export const PANEL = async (opts) => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const $ = (s) => document.querySelector(s);
  const o = { bad: [] };
  const clk = async (sel) => { const e = $(sel); if (!e) { o.bad.push('no ' + sel); return; } e.click(); await wait(60); };
  const set = (sel, v) => { const e = $(sel); if (!e) { o.bad.push('no ' + sel); return; } e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); e.dispatchEvent(new Event('change', { bubbles: true })); };
  const openCat = async () => { const c = [...document.querySelectorAll('#paramRows details.catParams')].find((d) => d.querySelector('#bgcPanel'));
    if (c) c.open = true; if ($('#bgcPanel')) $('#bgcPanel').open = true; await wait(60); return !!c; };
  const table = () => [...document.querySelectorAll('#bgcDerived .bgcDerSt')].map((e) => ({ key: e.dataset.key, status: e.dataset.status, text: e.textContent,
    val: e.previousElementSibling && e.previousElementSibling.classList.contains('bgcDerVal') ? e.previousElementSibling.textContent : null }));
  const vis = () => { const out = []; for (const k of ['W0', 'A0', 'gradW', 'gradA', 'dWdt', 'dAdt', 'domain', 'U', 'ledger', 'refPos', 'eps', 'Rbg', 'thetaBg', 'Vext', 'aExt']) {
    const e = $('#bgc_' + k); if (e && e.style.display !== 'none' && e.offsetParent !== null) out.push(k); } return out; };
  const over = () => { const p = $('#bgcPanel'); if (!p) return null; const pr = p.getBoundingClientRect(); let worst = 0;
    for (const e of p.querySelectorAll('*')) { const r = e.getBoundingClientRect(); if (r.width === 0) continue; worst = Math.max(worst, r.right - pr.right); }
    return { worst: +worst.toFixed(1), doc: document.documentElement.scrollWidth - document.documentElement.clientWidth }; };
  try {
    HP.setLang('ja');
    HP.loadPreset(opts.preset); HP.setRunning(false);
    const sig0 = HP.presetSig(HP.currentPreset());
    document.querySelector('nav#tabs button[data-tab="params"]').click(); await wait(200);
    if (!(await openCat())) { o.bad.push('no category with #bgcPanel'); return o; }
    // ①
    o.undeclared = { model: $('#bgcModel') ? $('#bgcModel').value : null, table: table(), key: HP.sim.params.backgroundComplex === undefined };
    // ② 型ごとの欄(選ぶだけ —— 宣言しない)
    o.fields = {};
    for (const m of ['uniform', 'sources', 'distantSource', 'null', '']) { set('#bgcModel', m); await wait(20); o.fields[m || 'manual'] = vis(); }
    o.inertSelect = { sig: HP.presetSig(HP.currentPreset()) === sig0, key: HP.sim.params.backgroundComplex === undefined };
    o.overflow = over();
    // ③ uniform
    set('#bgcModel', 'uniform'); set('#bgcBackground', 'galactic'); set('#bgc_W0', '0.5'); set('#bgc_A0', '0, 0'); set('#bgc_domain', 'finite'); set('#bgc_U', '');
    await clk('#bgcApply'); await openCat();
    o.uniform = { decl: HP.bgcState().decl, table: table(), err: $('#bgcErr') ? $('#bgcErr').textContent : null };
    // ③ sources(反例の源対)
    set('#bgcModel', 'sources'); set('#bgc_ledger', JSON.stringify(opts.ledger)); set('#bgc_refPos', '0, 0'); set('#bgc_eps', '0');
    await clk('#bgcApply'); await openCat();
    o.sources = { decl: HP.bgcState().decl, table: table(), err: $('#bgcErr') ? $('#bgcErr').textContent : null };
    // ③ distantSource
    const D = opts.distant;
    set('#bgcModel', 'distantSource'); set('#bgc_W0', String(D.W0)); set('#bgc_Rbg', String(D.Rbg)); set('#bgc_thetaBg', String(D.thetaBg));
    set('#bgc_Vext', D.Vext.join(', ')); set('#bgc_aExt', D.aExt.join(', '));
    await clk('#bgcApply'); await openCat();
    const cl = HP.bgcDistantClosed(D.W0, D.Rbg, D.thetaBg, D.Vext, D.aExt);
    const dd = HP.bgcState().decl;
    o.distant = { decl: dd, table: table(), closedSame: !!dd && ['W0', 'A0', 'gradW', 'gradA', 'dWdt', 'dAdt'].every((k) => JSON.stringify(dd[k]) === JSON.stringify(cl[k])) };
    // ③ null
    set('#bgcModel', 'null'); set('#bgc_W0', '0.5'); set('#bgc_A0', '0, 0');
    await clk('#bgcApply'); await openCat();
    o.nullModel = { decl: HP.bgcState().decl, table: table() };
    o.overflow2 = over();
    // ④ 拒否(台帳の加速度の欠落)
    const before = JSON.stringify(HP.sim.params.backgroundComplex);
    const badLedger = [{ id: 'g1', m: 1, x: 2, y: 0, vx: 0, vy: 3 }];
    set('#bgcModel', 'sources'); set('#bgc_ledger', JSON.stringify(badLedger)); set('#bgc_refPos', '0, 0'); set('#bgc_eps', '0');
    await clk('#bgcApply');
    const want = HP.validateBackgroundComplex({ background: 'galactic', bgModel: 'sources', ledger: badLedger, refPos: [0, 0], eps: 0 }).err;
    o.reject = { err: $('#bgcErr') ? $('#bgcErr').textContent : null, want, same: ($('#bgcErr') && $('#bgcErr').textContent) === want,
      unchanged: JSON.stringify(HP.sim.params.backgroundComplex) === before };
    // ⑤ 未宣言に戻す・英語
    await openCat(); await clk('#bgcClear'); await openCat();
    o.clear = { key: HP.sim.params.backgroundComplex === undefined, table: table() };
    HP.setLang('en'); await wait(80); await openCat();
    o.en = { table: table() };
    HP.setLang('ja'); await wait(60);
    // ⑥ meshVelocity の本
    HP.loadPreset(opts.mesh); HP.setRunning(false); await wait(120); await openCat();
    o.mesh = { table: table(), model: $('#bgcModel') ? $('#bgcModel').value : null };
  } catch (e) { o.bad.push('例外 ' + String(e && e.message || e).slice(0, 120)); }
  return o;
};

/** 判定(QA と器で同じ)。 */
export function gate(r) {
  const bad = (r.bad || []).slice();
  const W = WORDS.ja, E = WORDS.en;
  const st = (t, k) => (t || []).find((z) => z.key === k) || {};
  const C6 = ['W0', 'A0', 'gradW', 'gradA', 'dWdt', 'dAdt'], D4 = ['gradW', 'gradA', 'dWdt', 'dAdt'];
  if (!r.undeclared || r.undeclared.model !== '' || !r.undeclared.key) bad.push('① 既定の型/鍵');
  else { if (!C6.every((k) => st(r.undeclared.table, k).status === 'undetermined' && st(r.undeclared.table, k).text === W.undetermined)) bad.push('① 未宣言の 6 成分が未確定でない');
    if (st(r.undeclared.table, 'wire').status !== 'unwired' || st(r.undeclared.table, 'wire').text !== W.unwired) bad.push('① 接続の行が未接続でない'); }
  const F = r.fields || {};
  const want = { uniform: ['W0', 'A0', 'domain', 'U'], sources: ['ledger', 'refPos', 'eps'], distantSource: ['W0', 'Rbg', 'thetaBg', 'Vext', 'aExt'], null: ['W0', 'A0'], manual: C6 };
  for (const [m, w] of Object.entries(want)) if (JSON.stringify((F[m] || []).slice().sort()) !== JSON.stringify(w.slice().sort())) bad.push('② ' + m + ' の欄 ' + JSON.stringify(F[m]));
  if (!r.inertSelect || !r.inertSelect.sig || !r.inertSelect.key) bad.push('⑤ 型を選ぶだけで params/presetSig が動いた');
  const u = r.uniform || {};
  if (!u.decl || u.decl.bgModel !== 'uniform' || u.decl.domain !== 'finite') bad.push('③ uniform の宣言 ' + (u.err || ''));
  else if (!(st(u.table, 'W0').status === 'declared' && st(u.table, 'A0').status === 'declared' && D4.every((k) => st(u.table, k).status === 'declaredZero' && st(u.table, k).text === W.declaredZero))) bad.push('③ uniform の表');
  const s = r.sources || {};
  if (!s.decl || s.decl.bgModel !== 'sources' || s.decl.gradA[2] !== 1.5 || s.decl.W0 !== 0.5 || s.decl.A0[1] !== 0) bad.push('③ sources の宣言 ' + (s.err || ''));
  else if (!C6.every((k) => st(s.table, k).status === 'computed' && st(s.table, k).text === W.computed)) bad.push('③ sources の表');
  const d = r.distant || {};
  if (!d.decl || d.decl.bgModel !== 'distantSource' || !d.closedSame) bad.push('③ distantSource の値が閉じた式と違う');
  else if (!(st(d.table, 'W0').status === 'declared' && C6.slice(1).every((k) => st(d.table, k).status === 'computed'))) bad.push('③ distantSource の表');
  const n = r.nullModel || {};
  if (!n.decl || n.decl.bgModel !== null || D4.some((k) => n.decl[k] !== undefined)) bad.push('③ null の宣言(微分の鍵が残った)');
  else if (!D4.every((k) => st(n.table, k).status === 'undetermined' && st(n.table, k).val === '—')) bad.push('③ null の表(微分が未確定・値「—」でない)');
  if (!r.reject || !r.reject.same || !r.reject.unchanged || !/加速度/.test(r.reject.err || '')) bad.push('④ 拒否 ' + JSON.stringify(r.reject || {}).slice(0, 120));
  if (!r.clear || !r.clear.key || !C6.every((k) => st(r.clear.table, k).status === 'undetermined')) bad.push('⑤ 未宣言に戻す');
  if (!r.en || !C6.every((k) => st(r.en.table, k).text === E.undetermined) || st(r.en.table, 'wire').text !== E.unwired) bad.push('⑤ 英語の語');
  for (const ov of [r.overflow, r.overflow2]) if (!ov || ov.worst > 1 || ov.doc > 0) bad.push('⑤ 横はみ出し ' + JSON.stringify(ov));
  if (!r.mesh || st(r.mesh.table, 'wire').status !== 'applied' || st(r.mesh.table, 'wire').text !== W.applied || r.mesh.model !== '') bad.push('⑥ 🔁 の接続の行 ' + JSON.stringify(r.mesh && st(r.mesh.table, 'wire')));
  return { ok: bad.length === 0, bad };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const TARGET = process.env.QA_TARGET || 'beta/index.html';
  const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
  const req = createRequire(path.join(PW_DIR, 'noop.js'));
  const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  let browser;
  try { browser = await req('playwright').chromium.launch(); } catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }
  const out = [];
  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await ctx.newPage(); const errs = [];
    page.on('pageerror', (e) => errs.push(String(e.message || e))); page.on('dialog', (d) => d.accept());
    await page.goto('file://' + path.join(ROOT, TARGET), { waitUntil: 'load' });
    await page.waitForFunction(() => !!window.HP && !!HP.loadPreset && !!HP.bgcState);
    const r = await page.evaluate(PANEL, { preset: PANEL_PRESET, mesh: MESH_PRESET, ledger: LEDGER_PAIR, distant: DISTANT });
    if (process.env.W285C_SHOT) { await page.evaluate(() => { const p = document.getElementById('bgcPanel'); if (p) p.scrollIntoView(); });
      await page.screenshot({ path: process.env.W285C_SHOT.replace('.png', '-' + vp.name + '.png'), fullPage: false }); }
    r.vp = vp.name; r.jsErrors = errs; r.gate = gate(r);
    out.push(r); await ctx.close();
  }
  await browser.close();
  for (const r of out) console.log(r.vp, r.gate.ok ? 'OK' : 'NG', JSON.stringify(r.gate.bad), 'jsErr', r.jsErrors.length, 'overflow', JSON.stringify(r.overflow), JSON.stringify(r.overflow2));
  if (process.argv.includes('--json')) console.log(JSON.stringify(out, null, 1));
  process.exit(out.every((r) => r.gate.ok && r.jsErrors.length === 0) ? 0 : 1);
}
