// 第258便c(第50報 UI 7 件)の実機確認ハーネス。**読み取り+UI 操作だけ**(力学へは触れない)。
// 使い方: node tests/exp-w258c-uicheck.mjs [target]
// 出力: 標準出力の JSON 1 個(分類チップの本数・ベースのスケールの 2 形・空間メッシュ行・
//       固定 τ の再現表・折返しセル・top2 凡例・不正入力の拒否)。
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
const page = await browser.newPage();
const errs = [];
page.on('pageerror', (e) => errs.push(String(e.message || e)));
await page.goto(INDEX, { waitUntil: 'load' });
await page.waitForFunction(() => window.HP && HP.sim && HP.currentPreset());

const out = await page.evaluate(() => {
  const o = {};
  // ---- ① 分類 DFM/kF0
  const ps = HP.allPresets();
  o.cls = { cal: ps.filter((p) => p.sampleClass === 'calibration').length,
    dfm: ps.filter((p) => ppClassMatch(p, 'calibration:dfm')).length,
    kf0: ps.filter((p) => ppClassMatch(p, 'calibration:kf0')).length,
    kf0ids: ps.filter((p) => ppClassMatch(p, 'calibration:kf0')).map((p) => p.emoji + p.id) };
  // 宣言の派生値が validatePreset 後の kFrame と一致するか(安い規則の妥当性)
  o.cls.mismatch = ps.filter((p) => {
    const v = HP.validatePreset(JSON.parse(JSON.stringify(p)));
    const kf = (v.ok && v.preset.physics) ? v.preset.physics.kFrame : null;
    const want = (p.sampleClass !== 'calibration') ? null : ((kf === 0) ? 'kf0' : 'dfm');
    return calVariantOf(p) !== want;
  }).map((p) => p.id);
  // ---- ② グループの 3 分割
  const gs = {};
  for (const p of ps) gs[p.group || '内蔵'] = (gs[p.group || '内蔵'] || 0) + 1;
  o.groups = gs;
  // ---- ③ 単独ファミリー
  const fam = (fid) => ps.filter((p) => p.familyId === fid).map((p) => p.emoji + p.id + ':' + p.familyRole);
  o.fam = { solarInner: fam('solarInner'), venusReal: fam('venusReal'), mercury: fam('mercury'),
    earthmoon: fam('earthmoon'), saturn: fam('saturn') };
  // ---- ④ ベースのスケール
  o.bases = { all: SCALE_BASES.length, live: SCALE_BASES_LIVE().length,
    retired: SCALE_BASES.filter((b) => b.retired).map((b) => b.id + '=' + scaleBaseLine2(b)
      + '→' + (scaleBaseAltOf(b) || {}).id) };
  return o;
});

// ---- ⑤ パラメータタブを開いて UI を見る
const ui = await page.evaluate(() => {
  const o = {};
  { const tb = document.querySelector('[data-tab="params"]'); if (tb) tb.click(); }
  const row = document.getElementById('smGainRange') ? document.getElementById('smGainRange').closest('.prow') : null;
  o.meshRow = row ? { hasCb: !!row.querySelector('input[type=checkbox]'),
    hasRange: !!row.querySelector('#smGainRange'), numType: (document.getElementById('smGainVal') || {}).type || null,
    label: row.querySelector('label') ? row.querySelector('label').textContent : null } : null;
  o.tauRow = !!document.getElementById('smTauCb');
  const sb = document.getElementById('scaleBaseSel');
  o.scaleBase = sb ? { opts: [...sb.options].map((x) => x.textContent),
    titles: [...sb.options].map((x) => x.title), line2: (document.getElementById('scaleBaseLine2') || {}).textContent } : null;
  const vb = document.getElementById('scaleBaseViewBtn');
  if (vb) { vb.click();
    o.grid = [...document.querySelectorAll('#scaleBaseHost .sbChip')].map((b) =>
      b.querySelector('.sbL1').textContent + '|' + b.querySelector('.sbL2').textContent);
    vb.click(); }
  return o;
});

// ---- ⑥ 固定 τ の再現(剛体回転 Ω=0.1 / 0.2)
const tau = await page.evaluate(() => {
  const mk = (om) => (x, y, out) => { out[0] = -om * y; out[1] = om * x; out[2] = 1; return true; };
  const run = (om, R, t) => { const sp = { field: mk(om), cx: 0, cy: 0, R, gain: 1 };
    if (t !== undefined) sp.tau = t;
    return HP.dfmSpaceGridBuild(sp); };
  const diff = (a, b) => { let m = 0; for (let k = 0; k < a.X.length; k++) {
    if (!a.ok[k] || !b.ok[k]) continue;
    const d = Math.hypot(a.X[k] - b.X[k], a.Y[k] - b.Y[k]); if (d > m) m = d; } return m; };
  const o = {};
  for (const R of [10, 100]) {
    const a1 = run(0.1, R), a2 = run(0.2, R);
    const f1 = run(0.1, R, 1), f2 = run(0.2, R, 1);
    o['R=' + R] = { autoTau: [a1.tau, a2.tau], autoDiff: diff(a1, a2),
      fixDiff: diff(f1, f2), fixDiffRel: diff(f1, f2) / R,
      autoBitEq: (() => { for (let k = 0; k < a1.X.length; k++)
        if (a1.X[k] !== a2.X[k] || a1.Y[k] !== a2.Y[k]) return false; return true; })() };
  }
  // 不正入力の拒否
  const good = (x, y, out) => { out[0] = 1; out[1] = 0; out[2] = 1; return true; };
  const nan2 = () => [NaN, 0, 1];
  const forget = () => true;                       // out を 1 バイトも書かずに true
  o.reject = {
    nanField: HP.dfmSpaceGridBuild({ field: nan2, cx: 0, cy: 0, R: 10, gain: 1 }),
    forgetful: HP.dfmSpaceGridBuild({ field: forget, cx: 0, cy: 0, R: 10, gain: 1 }),
    nanSteps: HP.dfmSpaceGridBuild({ field: good, cx: 0, cy: 0, R: 10, gain: 1, steps: NaN }),
    nanTau: HP.dfmSpaceGridBuild({ field: good, cx: 0, cy: 0, R: 10, gain: 1, tau: NaN }),
    negTau: HP.dfmSpaceGridBuild({ field: good, cx: 0, cy: 0, R: 10, gain: 1, tau: -1 }),
    okCtrl: !!HP.dfmSpaceGridBuild({ field: good, cx: 0, cy: 0, R: 10, gain: 1 }) };
  for (const k of Object.keys(o.reject)) if (k !== 'okCtrl') o.reject[k] = (o.reject[k] === null);
  return o;
});

console.log(JSON.stringify({ target: TARGET, pageErrors: errs, ...out, ui, tau }, null, 1));
await browser.close();
