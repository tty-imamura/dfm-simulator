// P2(beta): PWA アイコン+OGP 画像の生成(再現可能な形でコミットする — gen-figures.mjs と同思想)
// 実行: node tools/gen-pwa-assets.mjs
// 出力: beta/icon-512.png / beta/icon-192.png / beta/icon-180.png / ogp.png(リポジトリ直下)
// モチーフ: 発光リング=光子球の光学的アナログ("an optical analogue of a photon sphere")
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function getBrowser() {
  const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  try { const { chromium } = await import('playwright'); return await chromium.launch(); } catch {}
  const { chromium } = await import('playwright-core'); return await chromium.launch({ executablePath: exe });
}

// 中央にリング+粒子。size は正方形アイコン用、ogp=true で 1200×630 のカード
function pageHtml({ size, ogp = false }) {
  const w = ogp ? 1200 : size, h = ogp ? 630 : size;
  const cx = ogp ? 330 : w / 2, cy = h / 2, R = ogp ? 200 : size * 0.30;
  const dots = [[0.95, 25], [1.28, 130], [1.22, 250], [0.72, 320]]
    .map(([f, deg]) => {
      const a = deg * Math.PI / 180, r = R * f;
      return `<circle cx="${cx + r * Math.cos(a)}" cy="${cy + r * Math.sin(a)}" r="${(ogp ? 9 : size * 0.016)}" fill="#8fd0ff" opacity="0.95"/>`;
    }).join('');
  const label = ogp ? `
    <text x="620" y="270" font-family="Hiragino Sans, Noto Sans CJK JP, sans-serif" font-size="54" font-weight="700" fill="#e8ecff">仮想物理ラボ</text>
    <text x="620" y="342" font-family="Hiragino Sans, Noto Sans CJK JP, sans-serif" font-size="32" fill="#aab4e8">決定力場モデル(DFM)シミュレータ</text>
    <text x="620" y="415" font-family="Georgia, serif" font-size="26" font-style="italic" fill="#6f7bb8">Determinacy-Field Mechanics — a Machian toy model</text>
    <text x="620" y="470" font-family="sans-serif" font-size="24" fill="#5a6499">単一HTML・依存ゼロ・BYOK / iPhone対応</text>` : `
    <text x="${cx}" y="${cy + size * 0.09}" text-anchor="middle" font-family="Georgia, serif" font-weight="700" font-size="${size * 0.24}" fill="#e8ecff">DFM</text>`;
  return `<!doctype html><meta charset="utf-8"><style>*{margin:0}</style>
  <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs>
      <radialGradient id="bg" cx="${cx / w}" cy="${cy / h}" r="1">
        <stop offset="0" stop-color="#141830"/><stop offset="1" stop-color="#0b0e1a"/>
      </radialGradient>
      <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0.62" stop-color="#ffb020" stop-opacity="0"/>
        <stop offset="0.80" stop-color="#ffb020" stop-opacity="0.85"/>
        <stop offset="0.88" stop-color="#ffd980" stop-opacity="1"/>
        <stop offset="1" stop-color="#ffb020" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#bg)"/>
    <circle cx="${cx}" cy="${cy}" r="${R * 1.25}" fill="url(#glow)"/>
    <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#ffcf60" stroke-width="${ogp ? 5 : size * 0.012}" opacity="0.9"/>
    <circle cx="${cx}" cy="${cy}" r="${R * 0.55}" fill="#05070f"/>
    ${dots}${label}
  </svg>`;
}

const browser = await getBrowser();
const jobs = [
  { out: 'beta/icon-512.png', size: 512 },
  { out: 'beta/icon-192.png', size: 192 },
  { out: 'beta/icon-180.png', size: 180 },
  { out: 'ogp.png', size: 0, ogp: true },
];
for (const j of jobs) {
  const w = j.ogp ? 1200 : j.size, h = j.ogp ? 630 : j.size;
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await page.setContent(pageHtml(j), { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(ROOT, j.out) });
  await page.close();
  console.log('wrote', j.out, `${w}x${h}`);
}
await browser.close();
