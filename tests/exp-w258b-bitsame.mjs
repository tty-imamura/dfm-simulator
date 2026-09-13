// 第258便b W2「既定経路 1 bit 不変の機械確認」(第50報)。
// 全内蔵プリセットを 600 步(dt=0.016)回し、状態(x/y/vx/vy/spin/m/R/t)と
// **検証後プリセットの正準形**(JSON)のハッシュを出す。基点 html と本便 html で
// 突き合わせて、**署名が変わるのは 🎠🌌🎡 の 3 本だけ**・**状態は全本ビット同一**を確認する。
//
// 実行: QA_TARGET=<html> node tests/exp-w258b-bitsame.mjs > out.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + (path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET));
const OUT = process.env.W258B_OUT3 || path.join(ROOT, 'tests', 'out', 'bitsame-w258b.json');

let browser;
try { const { chromium } = await import('playwright'); browser = await chromium.launch(); }
catch {
  const { chromium } = await import('playwright');
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
}
const pg = await browser.newPage();
const pageErrors = [];
pg.on('pageerror', (e) => pageErrors.push(String(e)));
await pg.goto(INDEX, { waitUntil: 'load' });
await pg.waitForFunction(() => window.HP && HP.sim);

const rows = await pg.evaluate(() => {
  const h64 = (s) => { let a = 0x811c9dc5, b = 0x01000193;
    for (let i = 0; i < s.length; i++) { a ^= s.charCodeAt(i); a = Math.imul(a, b) >>> 0; }
    return a.toString(16); };
  const out = [];
  for (const pd of HP.allPresets()) {
    const v = HP.validatePreset(JSON.parse(JSON.stringify(pd)));
    if (!v.ok) { out.push({ id: pd.id, emoji: pd.emoji, invalid: true }); continue; }
    const canon = JSON.stringify(v.preset);
    const S = HP.sim;
    let state = null, nan = null;
    try {
      S.build(v.preset);
      for (let k = 0; k < 600; k++) S.step(0.016);
      const buf = [];
      for (const k of ['x', 'y', 'vx', 'vy', 'spin', 'm', 'R'])
        for (let i = 0; i < S.n; i++) buf.push(S[k][i]);
      buf.push(S.t, S.n);
      state = buf.map((z) => (Object.is(z, -0) ? '-0' : String(z))).join(',');
      nan = typeof S.hasNaN === 'function' ? S.hasNaN() : null;
    } catch (e) { state = 'ERR:' + String(e); }
    out.push({ id: pd.id, emoji: pd.emoji, canonLen: canon.length, canonHash: h64(canon),
      stateHash: h64(state), stateLen: state.length, nan,
      gf: v.preset.overlays ? JSON.stringify(v.preset.overlays.galaxyField || null) : null,
      ledger: v.preset.physics ? JSON.stringify(v.preset.physics.ledger || null) : null });
  }
  return out;
});

await browser.close();
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify({ target: TARGET, n: rows.length, pageErrors, rows }, null, 1));
console.log('wrote', OUT, 'presets', rows.length, 'pageErrors', pageErrors.length);
