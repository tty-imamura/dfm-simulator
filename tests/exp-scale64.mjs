// 第64便 探索実験: 銀河標準サンプル候補「集団回転が作る局所フレーム」の成立性検証(スケールの整理スプリント)
// - 本スクリプトは QA ではない(合否判定なし)。tests/out/scale64-results.json に計測値を保存する。
// - 問い: 🌌galaxy の外縁増強(T4)は、熱斥力(kRep=0.8)・中心天体スピン(1.2)・恒星スピン(0〜0.3)を
//   すべて 0 に純化しても、**円盤の集団公転が作る u_φ だけで**成立するか。
//   成立すれば「銀河スケール=空間引きずり」の基準実験を複合要因なしで作れる(次便の標準サンプル化)。
//   成立しなければ「集団公転よりコヒーレントスピンが主源」と整理し直す(どちらでも決着がつく)。
// - 手順(exp-factors.mjs の正規経路と同じ): HP.loadPreset('galaxy',false) で既定物理のまま build →
//   sim.params へ純化上書き(kRep=0/muF=0/gammaN=0/kappaS=0)+ kFrame を用量反応で代入 →
//   **全粒子の spin 状態配列を 0 に上書き**(中心 1.2・恒星 0〜0.3 を消す — params では消せない初期状態) →
//   6000步(t=96。QA galaxyAB と同じ窓)。
// - 指標(tests/qa.mjs:268-283 W5C_UNITS.galaxyAB から転記・同式): 外縁帯 [156,286] の平均接線速度
//   v̄_φ = mean((x·vy−y·vx)/r)。加えて帯内粒子数(保持)と NaN。
// - 用量反応: kFrame ∈ {0, 0.25, 0.5, 1.0}。比較列として「純化なし(プリセット既定)」の
//   kFrame ∈ {0, 1} も測る(= QA galaxyAB の再現値。純化の影響量を読むための参照)。
// 実行: node tests/exp-scale64.mjs(playwright 必須。6条件×6000步 — 数分)
//   QA_TARGET=beta/index.html node tests/exp-scale64.mjs   … 既定は index.html(ルート固定版)
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

const CONDITIONS = [
  // 純化列: 熱・接触・スピン源をすべて切り、公転の集団運動だけを u_φ の源に残す
  { id: 'pure-kF0',    pure: true,  kFrame: 0 },
  { id: 'pure-kF0.25', pure: true,  kFrame: 0.25 },
  { id: 'pure-kF0.5',  pure: true,  kFrame: 0.5 },
  { id: 'pure-kF1',    pure: true,  kFrame: 1 },
  // スピン残置列: 純化パラメータ(kRep=0/muF=0/gammaN=0/kappaS=0)のまま初期スピンは残す —
  // 「コヒーレントスピンが u に与える回転成分」だけを集団公転の上に足した分解列
  { id: 'spin-kF0',    pure: 'params', kFrame: 0 },
  { id: 'spin-kF1',    pure: 'params', kFrame: 1 },
  // 参照列: プリセット既定のまま kFrame だけ A/B(QA galaxyAB の手動再現)
  { id: 'full-kF0',    pure: false, kFrame: 0 },
  { id: 'full-kF1',    pure: false, kFrame: 1 },
];

const browser = await launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto(INDEX);
await page.waitForFunction(() => window.HP && HP.sim);

const results = [];
for (const cond of CONDITIONS) {
  const r = await page.evaluate(async (c) => {
    const s = HP.sim;
    HP.loadPreset('galaxy', false);   // 既定物理で build(初期配置は全条件で厳密同一)
    s.params.kFrame = c.kFrame;
    if (c.pure) {   // true(完全純化) と 'params'(スピン残置) の両方でパラメータは純化
      s.params.kRep = 0; s.params.muF = 0; s.params.gammaN = 0; s.params.kappaS = 0;
      if (c.pure === true) for (let i = 0; i < s.n; i++) s.spin[i] = 0;   // 中心 1.2・恒星 0〜0.3 → 0(状態の上書き)
    }
    // 初期値(step 0)の外縁 v̄_φ — 増強比の分母ではなく健全性確認用
    const outer = (sm) => { let sum = 0, cN = 0;
      for (let i = 1; i < sm.n; i++) { const r2 = Math.hypot(sm.x[i], sm.y[i]);
        if (r2 >= 156 && r2 <= 286) { sum += (sm.x[i] * sm.vy[i] - sm.y[i] * sm.vx[i]) / r2; cN++; } }
      return { vphi: cN ? sum / cN : 0, count: cN }; };
    const o0 = outer(s);
    for (let k = 0; k < 6000; k++) s.step(0.016);
    const o1 = outer(s);
    return { vphi0: o0.vphi, count0: o0.count, vphi: o1.vphi, count: o1.count,
             nan: s.hasNaN(), maxSpin: Math.max(...Array.from(s.spin).map(Math.abs)) };
  }, cond);
  results.push({ ...cond, ...r });
  console.log(`${cond.id.padEnd(12)} v̄_φ=${r.vphi.toExponential(4)} 帯内=${r.count} maxSpin=${r.maxSpin.toFixed(3)} NaN=${r.nan}`);
}

// 用量反応の要約: 純化列の v̄_φ(kF)/v̄_φ(kF=0) と、参照列の従来比
const base = results.find(r => r.id === 'pure-kF0');
for (const r of results.filter(r => r.pure === true)) r.boostVsPureKF0 = base.vphi ? r.vphi / base.vphi : NaN;
const fA = results.find(r => r.id === 'full-kF1'), fB = results.find(r => r.id === 'full-kF0');
const sA = results.find(r => r.id === 'spin-kF1'), sB = results.find(r => r.id === 'spin-kF0');
const summary = {
  date: new Date().toISOString(), target: TARGET,
  pureDose: results.filter(r => r.pure === true).map(r => ({ kFrame: r.kFrame, vphi: r.vphi, boost: r.boostVsPureKF0, count: r.count })),
  spinRef: { galA: sA.vphi, galB: sB.vphi, ratio: sB.vphi ? sA.vphi / sB.vphi : NaN },
  fullRef: { galA: fA.vphi, galB: fB.vphi, ratio: fB.vphi ? fA.vphi / fB.vphi : NaN },
  results,
};
fs.writeFileSync(path.join(OUT_DIR, 'scale64-results.json'), JSON.stringify(summary, null, 2));
console.log('\n純化列の用量反応(対 kFrame=0):');
for (const d of summary.pureDose) console.log(`  kFrame=${d.kFrame}: v̄_φ=${d.vphi.toExponential(4)} 比=${(d.boost || 0).toFixed(4)} 帯内=${d.count}`);
console.log(`スピン残置列(純化+初期スピン): kF1/kF0 = ${summary.spinRef.ratio.toFixed(4)}`);
console.log(`参照列(既定物理): kF1/kF0 = ${summary.fullRef.ratio.toFixed(4)}`);
console.log('saved: tests/out/scale64-results.json');
await browser.close();
