// 第45便 45A(台帳4-48): RAY_MASS_MIN / PN_MASS_MIN を偏向角基準へ置換するための較正実測。
// - 本スクリプトは QA ではない(合否 exit code なし)。tests/out/exp-4-48.json に計測値を保存する。
// - 現行判定 m_i ≥ RAY_MASS_MIN(=40) と、新判定
//     m_i ≥ (α_min/4)·Kt·max(R_i, ε)      (α = 4ψ = 4m/(Kt·b) の逆読み。ε=softening)
//   の heavy 集合(光線源)/ PN 源集合を、全内蔵プリセット × α_min 掃引で機械比較する。
// - 目的: 「光線を使うプリセットで heavy 集合が現行と変わらない最大の α_min」を既定として採る。
// - 判定は t=0 だけでなく走行後(既定 600 步)でも取る — 合体・降着で m/R が変わるプリセットで
//   集合が動きうるため(キャッシュキー・E12 の追随性の確認も兼ねる)。
//
// 実行: QA_TARGET=beta/index.html node tests/exp-4-48.mjs
//   EXP448_STEPS=600 … 走行後の判定を取る步数(0 で t=0 のみ)
//
// ---- 実測の結論(2026-07-30・基点 5b00341 / 39プリセット・t=0 と t=600)----
// ・光線/1PN を使う8プリセットの源集合が現行(m≥40)と厳密一致する窓は 0.0167 < α_min ≤ 0.430
//   (下限=☿mercury の惑星 α_max=1.667e-2 が源に入り始める点、上限=🛰️grcal の主星 4.303e-1)
// ・物理対応ロック Kt=c²/G を掛けた状態でも同じ集合を保つには α_min ≤ 0.0207(💡lensing)
//   → 交わり (0.0167, 0.0207] の最大値として **α_min = 0.02 rad** を採用した
// ・1PN(E12)側は Kt ではなく c²/G を時空係数に使う。E12 に Kt は現れず(補正の小ささは
//   U/c² が決める)、Kt を使うと VERIFY V18/V19/V20(Kt=10000・c₀=40 の水星1PN)で
//   主星が源から外れて前進が消えるため。ロック時は両者が厳密一致する。
// ・コスト: 内蔵の光線ありプリセット6件は源集合が不変なので光線コストも不変。増えるのは
//   「光線トグルを手動で ON にしたときの熱系プリセット」だけ — 🎈pressure は源 0→240 に増え、
//   26本×340步の traceRay 実費が 3.1 ms → 約 40 ms/回(実測)。既定表示では発生しない。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + path.join(ROOT, TARGET);
const OUT_DIR = path.join(ROOT, 'tests', 'out');
fs.mkdirSync(OUT_DIR, { recursive: true });

const STEPS = Number(process.env.EXP448_STEPS ?? 600);
const ALPHAS = [0.005, 0.01, 0.02, 0.05, 0.1];
const RAY_MASS_MIN_OLD = 40;

// 光線が本質のプリセット(overlays/説明で光線を使うもの)。rays!=null で機械判定するが、
// 参考として既知の一覧も持つ(判定結果と突き合わせて報告する)。
const RAY_PRESETS_HINT = ['grcal', 'lensing', 'spinlens', 'blens', 'gclock', 'boxredshift', 'darkrotor', 'darkrotor1'];

async function getBrowser() {
  const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  try { const { chromium } = await import('playwright'); return await chromium.launch(); } catch {}
  try { const { chromium } = await import('playwright-core'); return await chromium.launch({ executablePath: exe }); } catch {}
  throw new Error('playwright が見つかりません');
}

const browser = await getBrowser();
const page = await browser.newPage();
page.on('pageerror', e => console.error('PAGEERROR', e.message));
await page.goto(INDEX);
await page.waitForFunction(() => !!window.HP);

const data = await page.evaluate(async ({ ALPHAS, OLD, STEPS }) => {
  const out = [];
  const presets = HP.allPresets();
  const snap = (label) => {
    const S = HP.sim, p = S.params;
    const eps = p.softening, Kt = p.Kt;
    const rows = [];
    for (let i = 0; i < S.n; i++) rows.push({ i, m: S.m[i], R: S.R[i] });
    const old = rows.filter(r => r.m >= OLD).map(r => r.i);
    const neu = {};
    for (const a of ALPHAS)
      neu['a' + a] = rows.filter(r => r.m >= (a / 4) * Kt * Math.max(r.R, eps)).map(r => r.i);
    // 各天体のしきい質量(現行 40 相当の α: alphaEq = 4·m/(Kt·max(R,eps)) — 天体が実際に出す最大偏向)
    const alphaMaxOf = rows.map(r => ({ i: r.i, m: r.m, R: r.R,
      alphaMax: 4 * r.m / (Kt * Math.max(r.R, eps)) }));
    return { label, n: S.n, Kt, eps, cLight: p.cLight, G: p.G, geoPN: p.geoPN, old, neu, alphaMaxOf };
  };
  for (const P of presets) {
    HP.loadPreset(P.id, false);
    const S = HP.sim;
    const rec = { id: P.id, name: P.name, emoji: P.emoji, group: P.group,
      hasRays: !!(P.rays && P.rays.n > 0), rays: P.rays || null,
      geoPN: !!(S.params.geoPN), snaps: [snap('t0')] };
    if (STEPS > 0) {
      for (let k = 0; k < STEPS; k++) S.step(0.016);
      rec.snaps.push(snap('t' + STEPS));
    }
    out.push(rec);
  }
  return out;
}, { ALPHAS, OLD: RAY_MASS_MIN_OLD, STEPS });

// ---- 光線コストの実測(heavy 集合が増える最悪ケースの見積り)----
// 現行コードのまま「heavy=k 個」の traceRay 実費を測る。プリセットの粒子の質量だけを
// 一律に持ち上げた合成 sim(配置・パラメータは 🎈pressure と同一)で、
// heavy=0(現行)/ 数個 / 全粒子 の3水準を比較する。
const perf = await page.evaluate(async () => {
  const P = JSON.parse(JSON.stringify(HP.allPresets().find(q => q.id === 'pressure')));
  const S = HP.sim;
  const run = (mScale) => {
    S.build(P);
    for (let i = 0; i < S.n; i++) S.m[i] *= mScale;
    // 源の数は実装の判定子で数える(置換後は rayHeavy、置換前は旧 m≥40)
    const isSrc = (i) => (typeof HP.rayHeavy === 'function') ? HP.rayHeavy(S, i) : (S.m[i] >= 40);
    let heavy = 0, old = 0;
    for (let i = 0; i < S.n; i++) { if (isSrc(i)) heavy++; if (S.m[i] >= 40) old++; }
    // drawRays 相当: 26 本 × 340 步(既定束・最短ステップ数)
    const t0 = performance.now();
    for (let k = 0; k < 26; k++) HP.traceRay(S, -300, -200 + k * 16, 1, 0, 2.7, 340, null);
    const ms = performance.now() - t0;
    return { mScale, n: S.n, heavy, old, ms };
  };
  const out = [];
  for (const s of [1, 40, 400, 4000]) { run(s); out.push(run(s)); }   // 1回捨てて JIT を暖める
  HP.loadPreset('pressure', false);
  return out;
});

await browser.close();

// ---- 集計 ----
const eq = (a, b) => a.length === b.length && a.every((v, k) => v === b[k]);
const summary = [];
for (const rec of data) {
  const per = {};
  for (const a of ALPHAS) {
    let same = true; const diffs = [];
    for (const s of rec.snaps) {
      const nn = s.neu['a' + a];
      if (!eq(s.old, nn)) {
        same = false;
        const add = nn.filter(i => !s.old.includes(i));
        const del = s.old.filter(i => !nn.includes(i));
        diffs.push({ at: s.label, add, del,
          addInfo: add.map(i => s.alphaMaxOf[i]), delInfo: del.map(i => s.alphaMaxOf[i]) });
      }
    }
    per['a' + a] = { same, diffs };
  }
  summary.push({ id: rec.id, hasRays: rec.hasRays, geoPN: rec.geoPN,
    Kt: rec.snaps[0].Kt, eps: rec.snaps[0].eps, n: rec.snaps[0].n,
    oldCount: rec.snaps.map(s => s.old.length), per });
}

const rayIds = summary.filter(s => s.hasRays).map(s => s.id);
// 「光線を使うプリセットで heavy 集合が現行と変わらない最大の α_min」
let bestRay = null;
for (const a of ALPHAS) if (summary.filter(s => s.hasRays).every(s => s.per['a' + a].same)) bestRay = a;
// 全プリセット(PN 源も含む集合一致)で不変な最大 α_min
let bestAll = null;
for (const a of ALPHAS) if (summary.every(s => s.per['a' + a].same)) bestAll = a;

console.log('対象: ' + TARGET + '  プリセット数=' + data.length + '  走行步数=' + STEPS);
console.log('光線を使うプリセット(' + rayIds.length + '件): ' + rayIds.join(', '));
console.log('');
const hdr = ['preset', 'rays', 'Kt', 'eps', 'n', 'old|H|', ...ALPHAS.map(a => 'α=' + a)];
const rows = [hdr];
for (const s of summary) {
  rows.push([s.id, s.hasRays ? 'Y' : '-', String(s.Kt), String(s.eps), String(s.n),
    s.oldCount.join('/'),
    ...ALPHAS.map(a => {
      const p = s.per['a' + a];
      if (p.same) return '=';
      const d = p.diffs[0];
      return (d.add.length ? '+' + d.add.length : '') + (d.del.length ? '-' + d.del.length : '');
    })]);
}
const w = hdr.map((_, c) => Math.max(...rows.map(r => r[c].length)));
for (const r of rows) console.log(r.map((v, c) => v.padEnd(w[c])).join('  '));
console.log('');
console.log('光線プリセットで heavy 集合が不変な最大 α_min = ' + bestRay);
console.log('全プリセットで集合が不変な最大 α_min       = ' + bestAll);
console.log('');
for (const s of summary) {
  for (const a of ALPHAS) {
    const p = s.per['a' + a];
    if (p.same) continue;
    for (const d of p.diffs) {
      const fmt = (x) => `#${x.i}(m=${x.m.toFixed(2)},R=${x.R.toFixed(2)},αmax=${x.alphaMax.toExponential(2)})`;
      console.log(`  ${s.id} α=${a} @${d.at}: ` +
        (d.add.length ? '追加 ' + d.addInfo.map(fmt).join(' ') : '') +
        (d.del.length ? ' 除外 ' + d.delInfo.map(fmt).join(' ') : ''));
    }
  }
}

console.log('\n光線コスト実測(🎈pressure 配置・26本×340步の traceRay 実費):');
for (const p of perf) console.log(`  m×${p.mScale}: 源=${p.heavy}/${p.n}(旧 m≥40 基準では ${p.old})  ${p.ms.toFixed(1)} ms/回`);

fs.writeFileSync(path.join(OUT_DIR, 'exp-4-48.json'),
  JSON.stringify({ target: TARGET, steps: STEPS, alphas: ALPHAS, bestRay, bestAll, perf, summary, data }, null, 1));
console.log('\n-> tests/out/exp-4-48.json');
