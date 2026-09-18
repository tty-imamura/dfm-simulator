// 第272便c §3(AA7)「**静止 2 体の相対加速度比 R∥**」の実測器である。
//
// ■ 何を測るか
//   mesh-v2(第265便b・`HP.dfmMeshV2Solve`)の 2 粒子の運動方程式から
//     **R∥ = −(a₂−a₁)·n̂ / (G(m₁+m₂)/r²)**(n̂ は 1→2 の単位ベクトル)
//   を作り、**独立に導いた解析式**(`tests/lib-w272c-binlock.mjs` の `restTwoBodyAnalytic`)と
//   突き合わせる。並べる列は 5 つ:
//     ① 同質量 ② 極端質量比 ③ 粒子交換(1↔2 のラベル入替) ④ Newton 極限(η→0) ⑤ 単位変更
//   **別欄**: 横成分 R⊥ ・ Σm_i a_i(重心の加速度)・ D₀ の帳簿(χ₁・χ₂・行和・δ・λ_min)。
//
// ■ **「比が 1 になる」と先に結論しない。** 値は実測して書く。
//   実測の結果が R∥≠1 でも、それは mesh-v2 という**候補の則**の性質の記録であって、
//   「引きずり式が確定した」でも「Newton が破れた」でもない。
//
// ■ 触らないもの
//   `beta/index.html` は**読むだけ**。内蔵プリセットは 1 bit も動かさない。`S._core` には触れない。
//
// 実行: PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright node tests/exp-w272c-rpar.mjs
// 出力: tests/out/rpar-w272c.json
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { restTwoBodyAnalytic, rParallel } from './lib-w272c-binlock.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + path.join(ROOT, TARGET);
const OUT = path.join(ROOT, 'tests', 'out', 'rpar-w272c.json');
const HARNESS_VERSION = 'w272c-rpar-1';

const sha = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');

const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let browser;
try { browser = await req('playwright').chromium.launch(); }
catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }
const pg = await browser.newPage();
const pageErrors = [];
pg.on('pageerror', (e) => pageErrors.push(String(e.message || e)));
await pg.goto(INDEX, { waitUntil: 'load' });
await pg.waitForFunction(() => window.HP && HP.sim && typeof HP.dfmMeshV2Solve === 'function');

const out = {
  meta: { wave: '第272便c', section: 'AA7 / R∥', harness: HARNESS_VERSION, target: TARGET,
    targetSha256: sha(path.join(ROOT, TARGET)),
    libSha256: sha(path.join(ROOT, 'tests', 'lib-w272c-binlock.mjs')),
    at: new Date().toISOString(),
    definition: 'R∥ = −(a₂−a₁)·n̂ /(G(m₁+m₂)/r²)、n̂ は 1→2。静止(v=0)なので計量の微分項は落ちる。',
    claim: '**「比が 1 になる」と先に結論していない。** 実装(HP.dfmMeshV2Solve)と'
      + '独立な解析式(lib-w272c-binlock.restTwoBodyAnalytic)の 2 列を並べた記録である。'
      + '**mesh-v2 は候補の則であって確立則ではない**(第265便b)。',
    touched: '内蔵プリセットは 1 bit も動かしていない。`S._core` には 1 命令も足していない。' },
  cases: [], pageErrors: [] };

// ---- 実装側を呼ぶ(静止 2 体)
async function solve(m1, m2, r, o) {
  return pg.evaluate(({ m1, m2, r, o }) => {
    const b = [{ m: m1, x: -r / 2, y: 0, vx: 0, vy: 0 }, { m: m2, x: r / 2, y: 0, vx: 0, vy: 0 }];
    const z = HP.dfmMeshV2Solve(b, o);
    if (!z) return { stop: 'noResult' };
    return { stop: z.stop, chi: z.chi, rowSum: z.rowSum, rowDev: z.rowDev, delta: z.delta,
      Mtot: z.Mtot, h11: z.h11, minEig: z.minEig, maxEig: z.maxEig, cond: z.cond,
      structural: z.structural, symRel: z.symRel,
      accel: z.accel ? { x: z.accel.x.slice(), y: z.accel.y.slice() } : null,
      gravAccel: z.gravAccel ? { x: z.gravAccel.x.slice(), y: z.gravAccel.y.slice() } : null };
  }, { m1, m2, r, o });
}

async function row(tag, m1, m2, r, o) {
  const z = await solve(m1, m2, r, o);
  const an = restTwoBodyAnalytic({ m1, m2, r, G: o.G, eps: o.eps, p: o.p, D0: o.D0, eta: o.eta, gauge: o.gauge });
  let impl = null;
  if (z.accel) {
    impl = rParallel({ a1: [z.accel.x[0], z.accel.y[0]], a2: [z.accel.x[1], z.accel.y[1]],
      n: [1, 0], G: o.G, M: m1 + m2, r, m1, m2 });
  }
  const rel = (impl && an && an.rPar !== null && Math.abs(an.rPar) > 0)
    ? Math.abs(impl.rPar - an.rPar) / Math.abs(an.rPar) : null;
  // **Σm_i a_i の帳簿**(重心が加速していないか)。絶対値では単位に依るので、
  // 各粒子の運動量変化率の大きさの和で割った**無次元の不均衡**も出す。
  let momImb = null;
  if (z.accel) {
    const s = Math.abs(m1 * z.accel.x[0] + m2 * z.accel.x[1]);
    const d = m1 * Math.abs(z.accel.x[0]) + m2 * Math.abs(z.accel.x[1]);
    momImb = (d > 0) ? s / d : null;
  }
  const rec = { tag, m1, m2, r, opts: o, stop: z.stop || null, momentumImbalance: momImb,
    accel: z.accel ? { x: z.accel.x.slice(), y: z.accel.y.slice() } : null,
    chi: z.chi || null, rowSum: z.rowSum || null, rowDev: z.rowDev, delta: z.delta,
    minEig: z.minEig, cond: z.cond, structural: z.structural, symRel: z.symRel,
    rParImpl: impl ? impl.rPar : null, rPerpImpl: impl ? impl.rPerp : null,
    sumMassAccel: impl ? impl.sumMassAccel : null,
    rParAnalytic: an ? an.rPar : null, relDiff: rel,
    rParAnalyticSoftDen: an ? an.rParSoftenedDenominator : null,
    softeningDenominatorRatio: an ? an.softeningDenominatorRatio : null,
    muOverM: an ? an.muOverM : null,
    newtonRatio: (impl && z.gravAccel)
      ? -((z.gravAccel.x[1] - z.gravAccel.x[0])) / (o.G * (m1 + m2) / (r * r)) : null };
  out.cases.push(rec);
  console.error(`  ${tag}: R∥(実装)=${rec.rParImpl === null ? '—' : rec.rParImpl.toFixed(9)} `
    + `R∥(解析)=${rec.rParAnalytic === null ? '—' : rec.rParAnalytic.toFixed(9)} `
    + `相対差=${rel === null ? '—' : rel.toExponential(2)} `
    + `Σma/Σ|ma|=${momImb === null ? '—' : momImb.toExponential(2)} stop=${rec.stop || '—'}`);
  return rec;
}

const BASE = { G: 6.674, eps: 0.05, p: 1, D0: 0, eta: 1, gauge: 'inertia' };
const SEP = 240;

// ---------------- ① 同質量 × D₀ × ゲージ
console.error('① 同質量');
for (const D0 of [0, 1e-6, 0.5, 8, 1e4]) {
  for (const gauge of ['inertia', 'constraint']) {
    await row(`equal/D0=${D0}/${gauge}`, 500, 500, SEP, { ...BASE, D0, gauge });
  }
}
// ---------------- ② 極端質量比
console.error('② 極端質量比');
for (const [m1, m2] of [[500, 500], [1000, 100], [1e4, 1], [1e6, 1e-2]]) {
  for (const D0 of [0, 0.5]) {
    for (const gauge of ['inertia', 'constraint']) {
      await row(`ratio/${m1}:${m2}/D0=${D0}/${gauge}`, m1, m2, SEP, { ...BASE, D0, gauge });
    }
  }
}
// ---------------- ③ 粒子交換(ラベル入替: R∥ は不変のはず —— 実測する)
console.error('③ 粒子交換');
for (const [m1, m2] of [[1000, 100], [1e4, 1]]) {
  for (const D0 of [0, 0.5]) {
    const a = await row(`swapA/${m1}:${m2}/D0=${D0}`, m1, m2, SEP, { ...BASE, D0 });
    const b = await row(`swapB/${m2}:${m1}/D0=${D0}`, m2, m1, SEP, { ...BASE, D0 });
    out.cases.push({ tag: `swapDiff/${m1}:${m2}/D0=${D0}`, kind: 'derived',
      rParA: a.rParImpl, rParB: b.rParImpl,
      absDiff: (a.rParImpl !== null && b.rParImpl !== null) ? Math.abs(a.rParImpl - b.rParImpl) : null,
      relDiff: (a.rParImpl && b.rParImpl) ? Math.abs(a.rParImpl - b.rParImpl) / Math.abs(a.rParImpl) : null });
  }
}
// ---------------- ④ Newton 極限(η→0)
console.error('④ Newton 極限(η→0)');
for (const eta of [1, 0.5, 0.1, 1e-2, 1e-4, 1e-8, 0]) {
  await row(`eta=${eta}`, 1000, 100, SEP, { ...BASE, eta, D0: 0.5 });
}
// ---------------- ⑤ 単位変更(無次元量なので不変のはず —— 実測する)
console.error('⑤ 単位変更');
{
  // (L, M) を変えると w=m·d^{−p} が変わるので、**χ を保つには D₀ も同じ率で変える**。
  // それを明示したうえで、①「D₀ を合わせた」列と ②「D₀ をそのままにした」列を両方出す。
  const cases = [{ sL: 1, sM: 1 }, { sL: 10, sM: 1 }, { sL: 1, sM: 1000 }, { sL: 10, sM: 1000 }];
  for (const c of cases) {
    const m1 = 1000 * c.sM, m2 = 100 * c.sM, r = SEP * c.sL;
    const wScale = c.sM * Math.pow(c.sL, -BASE.p);
    await row(`units/L×${c.sL}/M×${c.sM}/D0-scaled`, m1, m2, r,
      { ...BASE, eps: BASE.eps * c.sL, D0: 0.5 * wScale });
    await row(`units/L×${c.sL}/M×${c.sM}/D0-fixed`, m1, m2, r,
      { ...BASE, eps: BASE.eps * c.sL, D0: 0.5 });
  }
}

out.pageErrors = pageErrors;
await browser.close();
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.error('[w272c-rpar] wrote ' + OUT + '  (' + out.cases.length + ' 行)');
