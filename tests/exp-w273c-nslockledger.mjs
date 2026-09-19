// 第273便c(第63報・統括の検証項目 AH24): **NS 連星 4 系の lock 枝を台帳の 1 行にする器**。
//
// ■ 何をするか(**エンジンを 1 步も走らせない** —— 正本 JSON を読んで台帳の行を組むだけ)
//   ① `tests/out/nslock-w272c.json`(第272便c)の **lock 枝**(kFrame=0・f=1・λ_PN=1)から、
//      ω̇(Richardson 外挿・h/4 段)・ω̇_obs・σ 倍・観測次数を読む。
//   ② 同じ系の**質量枝**(builtin / kf0Ledger / corr / root / newton)の ω̇/ω̇_obs を並べる
//      (**lock 枝だけを見ると「1/6」が枝の性質なのか質量の性質なのか分からない**ため)。
//   ③ 内蔵プリセットの宣言(kFrame・λ_PN・pnAlpha・geoPN・frameWeight)を**ページから読む**
//      (手で打たない)。**pnAlpha と速度規約は宣言であって実測ではない**ので、そう書く。
//   ④ `tests/out/nslockledger-w273c.json` と、台帳へ貼る markdown 断片を書く。
//
// ■ この器が言わないこと
//   「潮汐ロックを証明した」「観測と合った」「6 倍すれば合う」。
//   **ω̇/ω̇_obs ≈ 0.166 は記録**であって、**係数 6 は導入しない**(式にも力にも接続しない)。
//   **有限質量比の相対 1PN 式との対応は未解析**である(この便では導いていない)。
//
// 実行: PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright node tests/exp-w273c-nslockledger.mjs
// 出力: tests/out/nslockledger-w273c.json / (markdown 断片は標準出力)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { provenanceMeta } from './lib-w272e-provenance.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const NSLOCK = path.join(ROOT, 'tests', 'out', 'nslock-w272c.json');
const OUT = path.join(ROOT, 'tests', 'out', 'nslockledger-w273c.json');
const src = JSON.parse(fs.readFileSync(NSLOCK, 'utf8'));
const systems = (src.systems || []).filter((s) => s.kind === 'ns-binary');
const ids = systems.map((s) => s.id);

// ---------------------------------------------------------------- 内蔵の宣言をページから読む
const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let browser;
try { browser = await req('playwright').chromium.launch(); }
catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }
const page = await browser.newPage();
const pageErrors = [];
page.on('pageerror', (e) => pageErrors.push(String(e.message || e)));
await page.goto('file://' + path.join(ROOT, 'beta', 'index.html'), { waitUntil: 'load' });
await page.waitForFunction(() => window.HP && HP.sim && HP.currentPreset());
const decl = await page.evaluate((wanted) => {
  const out = {};
  for (const p of HP.allPresets()) {
    if (wanted.indexOf(p.id) < 0) continue;
    const ph = p.physics || {};
    out[p.id] = { kFrame: ph.kFrame === undefined ? null : ph.kFrame,
      lambdaPN: ph.lambdaPN === undefined ? null : ph.lambdaPN,
      pnAlpha: ph.pnAlpha === undefined ? null : ph.pnAlpha,
      geoPN: ph.geoPN === undefined ? null : ph.geoPN,
      frameWeight: ph.frameWeight || null,
      massFactor: (p.massCalibration && (p.massCalibration.factor
        || p.massCalibration.factorUniform)) || null };
  }
  return out;
}, ids);
await page.close();
await browser.close();

// ---------------------------------------------------------------- 台帳の行を組む
const VAR = ['builtin', 'lock', 'root', 'kf0Ledger', 'corr', 'newton'];
const rows = systems.map((s) => {
  const obs = ((s.obs || {}).adopted || {}).W || {};
  const by = {};
  for (const tag of VAR) {
    const v = (s.variants || []).find((z) => z.tag === tag) || null;
    if (!v) { by[tag] = null; continue; }
    const w = (((v.sigma || {}).adopted) || {}).omegaDot || {};
    by[tag] = { spec: v.spec || null,
      omegaDotExt: Number.isFinite(v.omegaDotExt) ? v.omegaDotExt : null,
      omegaDotH4: Number.isFinite(w.modelH4) ? w.modelH4 : null,
      ratioExt: (Number.isFinite(v.omegaDotExt) && obs.value) ? v.omegaDotExt / obs.value : null,
      ratioH4: (Number.isFinite(w.modelH4) && obs.value) ? w.modelH4 / obs.value : null,
      nSigmaExt: Number.isFinite(w.sigmaTimesExt) ? w.sigmaTimesExt : null,
      pObs: ((v.richardson || {}).omegaDot || {}).p === undefined
        ? null : v.richardson.omegaDot.p,
      resolved: !!((v.resolved || {}).omegaDot) };
  }
  return { id: s.id, emoji: s.emoji, label: s.label,
    obs: { value: obs.value === undefined ? null : obs.value,
      sigma: obs.sigma === undefined ? null : obs.sigma,
      unit: obs.unit || 'deg/yr', recordId: obs.recordId || null, source: obs.source || null },
    declared: decl[s.id] || null, variants: by,
    spinTranscribed: !!((s.spinSynchrony || {}).anyTranscribed),
    spinAllWithin1Pct: !!((s.spinSynchrony || {}).allWithin1Percent) };
});
const lockRatios = rows.map((r) => (r.variants.lock || {}).ratioExt).filter(Number.isFinite);

const out = {
  meta: provenanceMeta({
    wave: '第273便c(第63報・AH24)', root: ROOT, target: 'beta/index.html',
    inputs: ['tests/out/nslock-w272c.json'],
    code: ['tests/exp-w273c-nslockledger.mjs', 'tests/lib-w272e-provenance.mjs'],
  }),
  section: 'NS 連星 4 系の lock 枝(kFrame=0・f=1・λ_PN=1)の記録',
  sourceHarness: (src.meta || {}).harness || null,
  sourceAt: (src.meta || {}).at || null,
  metric: (src.meta || {}).metric || null,
  assessedStageRule: '**ω̇ は 3 段(h, h/2, h/4)の Richardson 外挿**(`omegaDotExt`)と'
    + '**h/4 段の値**(`omegaDotH4`)を両方置く。外挿は観測次数 p が正で単調な列だけに作る'
    + '(第273便c・AH30 —— 非正の次数から外挿は作らない)。',
  declarationNote: '`pnAlpha`・`lambdaPN`・`geoPN`・`frameWeight` は**内蔵プリセットの宣言**であって'
    + '実測ではない。**速度は E12 の主張域どおり u=0 の絶対値(座標速度)**で、'
    + '正本は docs/PHYSICS.md の E12 節である(この器は宣言を読んだだけで、規約を作っていない)。',
  rows, lockRatioMin: lockRatios.length ? Math.min(...lockRatios) : null,
  lockRatioMax: lockRatios.length ? Math.max(...lockRatios) : null,
  doNotWrite: ['潮汐ロックを証明した', '観測と合った', '6 倍すれば合う', '係数 6 を導入した',
    '判定が増えた'],
  finding: '**4 系とも ω̇/ω̇_obs は 0.166 付近**で、**どれも 3σ の外**である。'
    + '**係数 6 は導入しない**(この比を式にも力にも接続していない)。'
    + '**有限質量比の相対 1PN 式との対応は未解析**である。',
  pageErrors,
};
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));

// ---------------------------------------------------------------- markdown 断片(台帳へ貼る)
const f = (x, d = 6) => (Number.isFinite(x) ? x.toPrecision(d) : '—');
const r4 = (x) => (Number.isFinite(x) ? x.toFixed(4) : '—');
const md = [];
md.push('| 系 | ω̇_obs(採用解) | lock 枝 ω̇(外挿 / h-4 段) | **ω̇/ω̇_obs** | σ 倍 | 観測次数 p | 内蔵の台帳 f | 内蔵 kFrame | 内蔵 λ_PN | 内蔵 pnAlpha |');
md.push('|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|');
for (const r of rows) {
  const L = r.variants.lock || {};
  const d = r.declared || {};
  md.push('| ' + r.emoji + ' `' + r.id + '`(' + r.label + ') | ' + f(r.obs.value, 8)
    + ' ± ' + f(r.obs.sigma, 3) + ' | ' + f(L.omegaDotExt, 8) + ' / ' + f(L.omegaDotH4, 8)
    + ' | **' + r4(L.ratioExt) + '** | ' + f(L.nSigmaExt, 6) + ' | ' + f(L.pObs, 6)
    + ' | ' + (d.massFactor === null || d.massFactor === undefined ? '—' : String(d.massFactor))
    + ' | ' + String(d.kFrame) + ' | ' + String(d.lambdaPN) + ' | ' + String(d.pnAlpha) + ' |');
}
md.push('');
md.push('| 系 | builtin | root(逆算) | kf0Ledger | corr | newton |');
md.push('|---|---:|---:|---:|---:|---:|');
for (const r of rows)
  md.push('| ' + r.emoji + ' `' + r.id + '` | '
    + ['builtin', 'root', 'kf0Ledger', 'corr', 'newton']
      .map((t) => r4((r.variants[t] || {}).ratioExt)).join(' | ') + ' |');
console.log(md.join('\n'));
console.log('\n[w273c-nslockledger] ' + rows.length + ' 系 / lock 枝 ω̇/ω̇_obs = '
  + lockRatios.map((x) => x.toFixed(4)).join('・') + ' → ' + path.relative(ROOT, OUT));
