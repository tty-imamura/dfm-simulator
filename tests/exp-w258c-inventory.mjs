// 第258便c(第50報 UI 7 件)の棚卸しハーネス。**読み取り専用**(ページを 1 枚だけ開き、
// 内蔵サンプルの宣言メタと「ベースのスケール」選択肢の使用状況を数える)。
// 使い方: node tests/exp-w258c-inventory.mjs [target]
//   target 既定 beta/index.html。結果は標準出力の JSON(1 個)。
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
  const A = HP.SCALE_ANCHORS, TIERS = HP.SCALE_TIERS;
  const bases = (typeof SCALE_BASES !== 'undefined') ? SCALE_BASES : [];
  const eff = (p) => {
    const s = p.scaleExp;
    if (s && typeof s.L === 'number' && typeof s.T === 'number' && typeof s.M === 'number')
      return { L: s.L, T: s.T, M: s.M, declared: true };
    const a = A[(TIERS.indexOf(p.scaleTier) >= 0) ? p.scaleTier : 'everyday'];
    return { L: a.expL, T: a.expT, M: a.expM, declared: false };
  };
  const matchBase = (e) => {
    for (const b of bases)
      if (Math.abs(e.L - b.L) < 1e-9 && Math.abs(e.T - b.T) < 1e-9 && Math.abs(e.M - b.M) < 1e-9) return b.id;
    return null;
  };
  const rows = [];
  for (const p of HP.allPresets()) {
    const v = HP.validatePreset(JSON.parse(JSON.stringify(p)));
    const ph = (v.ok && v.preset.physics) ? v.preset.physics : {};
    const e = eff(p);
    rows.push({ id: p.id, emoji: p.emoji, name: p.name, group: p.group || null,
      cls: p.sampleClass || null, tier: p.scaleTier || null,
      tierEff: (typeof presetTierOf === 'function') ? presetTierOf(p) : null,
      L: e.L, T: e.T, M: e.M, declared: e.declared, base: matchBase(e),
      kFrame: ph.kFrame, familyId: p.familyId || null, familyRole: p.familyRole || null,
      fidelity: p.fidelity || null, refKind: p.referenceKind || null,
      hasGalaxyField: !!(p.overlays && p.overlays.galaxyField),
      spaceMesh: (p.overlays && p.overlays.spaceMesh) ? JSON.stringify(p.overlays.spaceMesh) : null });
  }
  return { bases: bases.map((b) => ({ id: b.id, tier: b.tier, L: b.L, T: b.T, M: b.M,
      name: (typeof scaleBaseName === 'function') ? scaleBaseName(b) : b.id })),
    anchors: A, rows, n: rows.length };
});
console.log(JSON.stringify({ target: TARGET, pageErrors: errs, ...out }, null, 1));
await browser.close();
