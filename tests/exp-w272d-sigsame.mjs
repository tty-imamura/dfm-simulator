// 第272便d(第62報「サンプル整理」): **presetSig 全本不変**の突き合わせ。
// `tests/exp-w258c-bitsame.mjs` は指紋に `presetSig(p).length` しか入れていない(長さが同じで
// 中身が違う書き換えは通ってしまう)ので、**署名の文字列そのもの**を基点 html と現行 html で
// 1 本ずつ比べる器を別に置く。本便は group 文字列の移動・side table・チップ・文言だけなので、
// **124/124 で署名が 1 文字も変わらない**ことが契約である。
//
// 使い方: PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright \
//         node tests/exp-w272d-sigsame.mjs beta/_w272_base.html beta/index.html
// 終了コード: 1 本でも差があれば 1。
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

async function sigs(target) {
  const page = await browser.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e.message || e)));
  await page.goto('file://' + path.join(ROOT, target), { waitUntil: 'load' });
  await page.waitForFunction(() => window.HP && HP.sim && HP.currentPreset());
  const out = await page.evaluate(() => {
    const rows = {};
    for (const p of HP.allPresets()) rows[p.id] = presetSig(p);
    return rows;
  });
  await page.close();
  return { out, errs };
}

const a = await sigs(A);
const b = await sigs(B);
await browser.close();
const ids = Object.keys(a.out);
const diff = ids.filter((k) => !(k in b.out) || a.out[k] !== b.out[k]);
const added = Object.keys(b.out).filter((k) => !(k in a.out));
console.log(JSON.stringify({
  base: A, now: B, n: ids.length, nNow: Object.keys(b.out).length,
  identical: diff.length === 0 && added.length === 0,
  same: ids.length - diff.length,
  diff: diff.slice(0, 10).map((k) => ({ id: k, baseLen: a.out[k].length, nowLen: (b.out[k] || '').length })),
  added,
  pageErrorsBase: a.errs.slice(0, 3), pageErrorsNow: b.errs.slice(0, 3),
}, null, 1));
process.exit(diff.length === 0 && added.length === 0 ? 0 : 1);
