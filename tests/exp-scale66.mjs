// 第66便 探索実験 66A: 銀河外縁増強の源の追加分解 — 中心スピンのみ / 恒星スピンのみ
// - 第64便 exp-scale64 の続き(銀河標準サンプル設計の先行タスク — 03e §5-2-1)。
//   64便の確定: 既定 1.321 / 純化+全スピン残置 1.265 / 集団公転のみ 1.021。
//   本便の問い: スピン残置分(1.265)の主源は**中心天体(m2500・spin1.2・pinned)のコヒーレント
//   スピン**か、**380個の恒星スピン(0〜0.3)**か。銀河標準サンプルにどの回転体を残すかを決める。
// - 手順は exp-scale64 と同一(loadPreset('galaxy') → params 純化 → spin 状態の選択的ゼロ化 →
//   6000步 → 外縁帯 [156,286] の v̄_φ)。中心=粒子0(single が bodies 先頭)。
// 実行: node tests/exp-scale66.mjs / QA_TARGET=beta/index.html node tests/exp-scale66.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'index.html';
const INDEX = 'file://' + (TARGET.startsWith('/') ? TARGET : path.join(ROOT, TARGET));
const OUT_DIR = path.join(ROOT, 'tests', 'out');
fs.mkdirSync(OUT_DIR, { recursive: true });

async function launch() {
  const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  try { const { chromium } = await import('playwright'); return await chromium.launch(); } catch {}
  const { chromium } = await import('playwright-core');
  return chromium.launch({ executablePath: exe });
}

// spinKeep: 'none'(全ゼロ=64便の完全純化・対照) / 'center'(粒子0のみ残す) / 'stars'(粒子0だけゼロ) / 'all'
const CONDITIONS = [
  { id: 'center-kF0', spinKeep: 'center', kFrame: 0 },
  { id: 'center-kF1', spinKeep: 'center', kFrame: 1 },
  { id: 'stars-kF0',  spinKeep: 'stars',  kFrame: 0 },
  { id: 'stars-kF1',  spinKeep: 'stars',  kFrame: 1 },
  { id: 'all-kF1',    spinKeep: 'all',    kFrame: 1 },   // 64便 spin-kF1 の再現(=1.2648 の確認)
  { id: 'none-kF1',   spinKeep: 'none',   kFrame: 1 },   // 64便 pure-kF1 の再現(=1.0214 の確認)
];

const browser = await launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto(INDEX);
await page.waitForFunction(() => window.HP && HP.sim);

const results = [];
for (const cond of CONDITIONS) {
  const r = await page.evaluate(async (c) => {
    const s = HP.sim;
    HP.loadPreset('galaxy', false);
    s.params.kFrame = c.kFrame;
    s.params.kRep = 0; s.params.muF = 0; s.params.gammaN = 0; s.params.kappaS = 0;   // 純化(64便と同一)
    for (let i = 0; i < s.n; i++) {
      const isCenter = (i === 0);
      const keep = (c.spinKeep === 'all') || (c.spinKeep === 'center' && isCenter) || (c.spinKeep === 'stars' && !isCenter);
      if (!keep) s.spin[i] = 0;
    }
    const outer = (sm) => { let sum = 0, cN = 0;
      for (let i = 1; i < sm.n; i++) { const r2 = Math.hypot(sm.x[i], sm.y[i]);
        if (r2 >= 156 && r2 <= 286) { sum += (sm.x[i] * sm.vy[i] - sm.y[i] * sm.vx[i]) / r2; cN++; } }
      return { vphi: cN ? sum / cN : 0, count: cN }; };
    for (let k = 0; k < 6000; k++) s.step(0.016);
    const o1 = outer(s);
    return { vphi: o1.vphi, count: o1.count, nan: s.hasNaN(),
             centerSpin: s.spin[0], maxStarSpin: Math.max(...Array.from(s.spin).slice(1).map(Math.abs)) };
  }, cond);
  results.push({ ...cond, ...r });
  console.log(`${cond.id.padEnd(11)} v̄_φ=${r.vphi.toExponential(4)} 帯内=${r.count} 中心spin=${r.centerSpin.toFixed(3)} 恒星max=${r.maxStarSpin.toFixed(3)} NaN=${r.nan}`);
}

const g = (id) => results.find(r => r.id === id);
const base = 3.1198;   // 64便 pure-kF0(kFrame=0 では spin 配置に依らず同値 — 64便で確認済み)
const summary = {
  date: new Date().toISOString(), target: TARGET, baseKF0: base,
  ratios: {
    center: g('center-kF1').vphi / g('center-kF0').vphi,
    stars: g('stars-kF1').vphi / g('stars-kF0').vphi,
    all: g('all-kF1').vphi / base,
    none: g('none-kF1').vphi / base,
  },
  results,
};
fs.writeFileSync(path.join(OUT_DIR, 'scale66-results.json'), JSON.stringify(summary, null, 2));
console.log('\n増強比 kF1/kF0(純化パラメータ・スピン選択残置):');
console.log(`  中心のみ: ${summary.ratios.center.toFixed(4)} / 恒星のみ: ${summary.ratios.stars.toFixed(4)}`);
console.log(`  全部(64便 1.2648 の再現): ${summary.ratios.all.toFixed(4)} / ゼロ(64便 1.0214 の再現): ${summary.ratios.none.toFixed(4)}`);
console.log('saved: tests/out/scale66-results.json');
await browser.close();
