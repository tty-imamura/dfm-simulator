// 第258便c: **既定経路 1 bit 不変**の突き合わせ(第253便a/第254便a の手順の流用)。
// 基点 html(引数 1)と現行 html(引数 2)で、全内蔵プリセットを 600 步走らせ、
// 型付き配列(x/y/vx/vy/spin/R/m)と t・NaN・クランプ数の指紋を比べる。
// 表示専用の変更(本便の UI 7 件)なら、全プリセットで指紋が完全一致するはずである。
// 使い方: node tests/exp-w258c-bitsame.mjs beta/_w258c_base.html beta/index.html
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const A = process.argv[2], B = process.argv[3];
const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let browser;
try { browser = await req('playwright').chromium.launch(); }
catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }

const STEPS = Number(process.env.W258C_STEPS || 600);

async function fingerprint(target) {
  const page = await browser.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e.message || e)));
  await page.goto('file://' + path.join(ROOT, target), { waitUntil: 'load' });
  await page.waitForFunction(() => window.HP && HP.sim && HP.currentPreset());
  const out = await page.evaluate((steps) => {
    const hash = (T) => { let a = 0x811c9dc5;
      const buf = new ArrayBuffer(8), f = new Float64Array(buf), u = new Uint8Array(buf);
      const push = (v) => { f[0] = v; for (let b = 0; b < 8; b++) { a ^= u[b]; a = Math.imul(a, 0x01000193) >>> 0; } };
      for (const k of ['x', 'y', 'vx', 'vy', 'spin', 'R', 'm']) { const Ar = T[k]; if (!Ar) continue;
        for (let i = 0; i < T.n; i++) push(Ar[i]); }
      push(T.t); return a.toString(16); };
    const rows = {};
    for (const p of HP.allPresets()) {
      HP.loadPreset(p.id, false);
      const T = HP.sim;
      for (let i = 0; i < steps; i++) T.step(0.016);
      rows[p.id] = hash(T) + '|' + T.n + '|' + T.hasNaN() + '|' + T.clampVN + '|' + T.clampSN
        + '|' + presetSig(p).length;
    }
    return rows;
  }, STEPS);
  await page.close();
  return { out, errs };
}

const a = await fingerprint(A);
const b = await fingerprint(B);
await browser.close();
const ids = Object.keys(a.out);
const diff = ids.filter((k) => a.out[k] !== b.out[k]);
const missing = Object.keys(b.out).filter((k) => !(k in a.out));
console.log(JSON.stringify({ base: A, now: B, steps: STEPS, n: ids.length,
  identical: diff.length === 0, diff: diff.map((k) => k + ': ' + a.out[k] + ' vs ' + b.out[k]),
  newInNow: missing, pageErrorsBase: a.errs.slice(0, 3), pageErrorsNow: b.errs.slice(0, 3) }, null, 1));
process.exit(diff.length === 0 && missing.length === 0 ? 0 : 1);
