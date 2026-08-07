// 第83便B 実験 4-86: 相図ランナーの基準マップ(2変数バッチ掃引と秩序変数の色マップ)
//
// 主題: 「創発の標準試験」の相図部分 — 物理パラメータを2軸で振り、第82便B の創発モニタの
//   秩序変数(emergenceStats)がどこで跳ぶか(= 相境界がどこに立つか)を機械可読に記録する。
//   アプリ内「相図ランナー」がプリセットの phaseMap 宣言どおりに走らせるのと**同じ経路**を使う
//   (HP.phaseMap.runSync = UI の分割実行と、セル生成・スクラッチ sim・秩序変数を共有する同期版)。
//
// 対象2枚(いずれもプリセットの phaseMap 宣言=本番グリッドをそのまま回す):
//   🧬emergent   kRep(熱圧)× gravityY(一様重力)/ metric=最大塊の質量比 maxFrac
//                → 固体(単一格子 f≈1.00)から気体(ばらけた分子 f≈0.1台)への相境界
//   🥚selfRotor  G(自己重力)× D0(背景決定力)/ metric=スピン整列度 align
//                → 自転ゼロで始まった粒がそろって同じ向きに回るようになる境界
//
// 記録する量:
//   ①各セルの metric(色マップに載る量そのもの)
//   ②マップ全体の min / max / range(= 相境界の存在: 最小セルと最大セルの差が有意か)
//   ③行ごとの境界位置(metric が min と max の中点をまたぐ x を線形内挿)
//   ④1枚の実測所要時間(秒/枚・秒/セル)
//   ⑤決定性の確認: 各枚の 2×2 部分格子を2回走らせ、bit 一致することを見る
//
// 実行: QA_TARGET=beta/index.html node tests/exp-4-86.mjs(playwright 必須・約3分)
// 出力: tests/out/exp-4-86.json(QA ではない — 合否判定はしない計測スクリプト)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + (TARGET.startsWith('/') ? TARGET : path.join(ROOT, TARGET));
const OUT_DIR = path.join(ROOT, 'tests', 'out');
fs.mkdirSync(OUT_DIR, { recursive: true });

async function launch() {
  const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  try { const { chromium } = await import('playwright'); return await chromium.launch(); } catch {}
  const { chromium } = await import('playwright-core');
  return chromium.launch({ executablePath: exe });
}
const browser = await launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
page.on('pageerror', (e) => console.log('PAGEERROR:', e.message));
await page.goto(INDEX);
await page.waitForFunction(() => window.HP && HP.sim);

const has = await page.evaluate(() => !!(window.HP && HP.phaseMap && HP.phaseMap.runSync));
if (!has) { console.log('SKIP: 対象に 相図ランナー がありません(第83便B 未適用)'); await browser.close(); process.exit(0); }

// 1枚ぶんの基準マップ — プリセットの phaseMap 宣言(本番グリッド)をそのまま走らせる。
// 本編 sim には一切書かない(runSync は描画なしのスクラッチ sim だけを使う)ことも同時に見る
const sheet = (id) => page.evaluate((id) => {
  const p0 = HP.allPresets().find((q) => q.id === id);
  if (!p0 || !p0.phaseMap) return null;
  HP.loadPreset(id, false);
  const S0 = HP.sim;
  const hash = () => { const a = [];
    for (let i = 0; i < S0.n; i++) a.push(S0.x[i], S0.y[i], S0.spin[i]);
    return a.map((v) => v.toExponential(12)).join(','); };
  const h0 = hash(), t0 = S0.t;
  const g = HP.phaseMap.runSync(id);                    // 本番グリッド1回
  const mainUntouched = (h0 === hash()) && t0 === S0.t;
  // 決定性: 左下 2×2 の部分格子を2回走らせて bit 一致を見る(短めの步数で足りる)
  const sub = { xKey: g.xKey, xValues: g.xValues.slice(0, 2), yKey: g.yKey,
    yValues: g.yValues.slice(0, 2), steps: Math.min(g.steps, 400), metric: g.metric };
  const a = HP.phaseMap.runSync(id, sub), b = HP.phaseMap.runSync(id, sub);
  const deterministic = a.vals.every((v, i) => (Number.isNaN(v) && Number.isNaN(b.vals[i])) || v === b.vals[i]);
  return { id, emoji: p0.emoji, name: p0.name,
    label: (p0.phaseMap.label && (p0.phaseMap.label.ja || p0.phaseMap.label.en)) || null,
    xKey: g.xKey, yKey: g.yKey, metric: g.metric, steps: g.steps,
    xValues: g.xValues, yValues: g.yValues, nx: g.nx, ny: g.ny, vals: g.vals,
    ms: g.ms, mainUntouched, deterministic, subVals: a.vals };
}, id);

const summarize = (S) => {
  const fin = S.vals.filter((v) => Number.isFinite(v));
  const lo = Math.min(...fin), hi = Math.max(...fin), mid = (lo + hi) / 2;
  // 行ごとの境界位置: metric が中点をまたぐ最初の x(線形内挿。またがない行は null)
  const bounds = [];
  for (let iy = 0; iy < S.ny; iy++) {
    let b = null;
    for (let ix = 1; ix < S.nx; ix++) {
      const a = S.vals[iy * S.nx + ix - 1], c = S.vals[iy * S.nx + ix];
      if (!Number.isFinite(a) || !Number.isFinite(c) || a === c) continue;
      if ((a - mid) * (c - mid) <= 0) {
        b = S.xValues[ix - 1] + ((mid - a) / (c - a)) * (S.xValues[ix] - S.xValues[ix - 1]);
        break;
      }
    }
    bounds.push(b);
  }
  // 有意性: 最小セルと最大セルの差が、metric の代表スケール(|max| と 1 の大きい方)の 20% 超
  const scale = Math.max(1, Math.abs(hi), Math.abs(lo));
  return { min: lo, max: hi, range: hi - lo, mid, finite: fin.length, total: S.vals.length,
    bounds, significant: (hi - lo) > 0.2 * scale };
};

const show = (S, sum) => {
  console.log(`\n=== ${S.emoji}${S.id} — ${S.xKey} × ${S.yKey} / metric=${S.metric} / ${S.steps}步 ===`);
  if (S.label) console.log(`    ${S.label}`);
  const padY = Math.max(8, S.yKey.length + 3);
  for (let iy = S.ny - 1; iy >= 0; iy--) {
    const row = [];
    for (let ix = 0; ix < S.nx; ix++) {
      const v = S.vals[iy * S.nx + ix];
      row.push(Number.isFinite(v) ? v.toFixed(3).padStart(7) : '    ---');
    }
    console.log(`${S.yKey}=${String(S.yValues[iy])}`.padEnd(padY), row.join(' '),
      ` | 境界 ${S.xKey}≈${sum.bounds[iy] === null ? '—' : sum.bounds[iy].toFixed(2)}`);
  }
  console.log(''.padEnd(padY), S.xValues.map((x) => String(x).padStart(7)).join(' '), ` <- ${S.xKey}`);
  console.log(`    レンジ ${sum.min.toFixed(3)} 〜 ${sum.max.toFixed(3)}(幅 ${sum.range.toFixed(3)})`
    + ` / 有限セル ${sum.finite}/${sum.total}`
    + ` / 実測 ${(S.ms / 1000).toFixed(1)}秒 = ${(S.ms / S.vals.length / 1000).toFixed(2)}秒/セル`
    + ` / 本編不変=${S.mainUntouched} 決定的=${S.deterministic}`);
};

const out = { at: new Date().toISOString(), target: TARGET, sheets: [] };
for (const id of ['emergent', 'selfRotor']) {
  const S = await sheet(id);
  if (!S) { console.log(`SKIP ${id}(phaseMap 宣言なし)`); continue; }
  const sum = summarize(S);
  show(S, sum);
  out.sheets.push(Object.assign({}, S, { summary: sum }));
}

console.log('\n---- 相境界の存在(最小/最大セル差が有意か)----');
for (const S of out.sheets) {
  console.log(`${S.emoji}${S.id}: ${S.metric} ${S.summary.min.toFixed(3)} 〜 ${S.summary.max.toFixed(3)}`
    + ` 幅 ${S.summary.range.toFixed(3)} → 有意な差=${S.summary.significant}`
    + ` / 境界 ${S.xKey}≈[${S.summary.bounds.map((b) => (b === null ? '—' : b.toFixed(2))).join(', ')}]`
    + `(${S.yKey}=${S.yValues.join('/')})`);
}
out.totalMs = out.sheets.reduce((a, S) => a + S.ms, 0);
console.log(`\n合計 ${(out.totalMs / 1000).toFixed(1)}秒(2枚ぶんの本番グリッド)`);
fs.writeFileSync(path.join(OUT_DIR, 'exp-4-86.json'), JSON.stringify(out, null, 2));
console.log('→ tests/out/exp-4-86.json');
await browser.close();
