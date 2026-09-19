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
// ■ 第273便d(AH26)で足したもの: **不均衡を 2 種に分けて並べる**
//   ① **Σ mᵢ aᵢ**(通常の重心 —— 粒子セクタの運動量 Σmᵢvᵢ の変化率)
//   ② **1ᵀH′a**(正準運動量 p=H′v の微分の第 1 項)
//   運動方程式は H′a=R で、静止では R=F(重力)・1ᵀF=0 なので **② は恒等的に 0** になる一方、
//   ① は χ₁≠χ₂ かつ η>0 では 0 にならない(第272便c の否定結果)。**この 2 つは別の量である。**
//   非静止では d(1ᵀH′v)/dt = 1ᵀH′a + 1ᵀ(dH′/dt)v なので、H′ を **q ± h·v** で 2 回評価して
//   Ḣ′ を中心差分で作り、**第 2 項も測る**(h を 2 つ振って刻み依存も出す)。
//   **「保存則違反」とは書かない** —— 受理条件(長時間の正準運動量・角運動量・エネルギー・
//   背景交換・通常の重心)は**未確定**であり、候補を並べただけである。
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
import { restTwoBodyAnalytic, rParallel, canonicalMomentumCheck,
  CANONICAL_ACCEPTANCE_CANDIDATES } from './lib-w272c-binlock.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + path.join(ROOT, TARGET);
const OUT = path.join(ROOT, 'tests', 'out', 'rpar-w272c.json');
const HARNESS_VERSION = 'w273d-rpar-2';   // 第273便d(AH26): 不均衡 2 種・非静止の Ḣ′ 項を足した

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
  meta: { wave: '第272便c(第273便d で AH26 を追加)', section: 'AA7 / R∥ + 正準運動量(AH26)',
    harness: HARNESS_VERSION, target: TARGET,
    targetSha256: sha(path.join(ROOT, TARGET)),
    libSha256: sha(path.join(ROOT, 'tests', 'lib-w272c-binlock.mjs')),
    at: new Date().toISOString(),
    definition: 'R∥ = −(a₂−a₁)·n̂ /(G(m₁+m₂)/r²)、n̂ は 1→2。静止(v=0)なので計量の微分項は落ちる。',
    claim: '**「比が 1 になる」と先に結論していない。** 実装(HP.dfmMeshV2Solve)と'
      + '独立な解析式(lib-w272c-binlock.restTwoBodyAnalytic)の 2 列を並べた記録である。'
      + '**mesh-v2 は候補の則であって確立則ではない**(第265便b)。',
    touched: '内蔵プリセットは 1 bit も動かしていない。`S._core` には 1 命令も足していない。',
    canonical: {
      definition: 'H′a = R(運動方程式)。① Σmᵢaᵢ = 通常の重心 / ② 1ᵀH′a = 正準運動量 p=H′v の'
        + '微分の第 1 項。非静止では d(1ᵀH′v)/dt = 1ᵀH′a + 1ᵀ(dH′/dt)v で、Ḣ′ は q±h·v の中心差分で作る。',
      claim: '**「保存則違反」とは書かない。** ①②は別の量であり、②が 0 でも①は 0 にならない。'
        + '受理条件は**未確定**で、下の候補を並べただけである(どれも採用していない)。',
      acceptanceCandidates: CANONICAL_ACCEPTANCE_CANDIDATES } },
  cases: [], canonicalRest: [], canonicalMoving: [], pageErrors: [] };

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

// ---- 第273便d(AH26): 任意の bodies で解き、**H′ と不均衡 2 種**まで持ち帰る
async function solveBodies(bodies, o) {
  return pg.evaluate(({ bodies, o }) => {
    const z = HP.dfmMeshV2Solve(bodies, o);
    if (!z) return { stop: 'noResult' };
    return { stop: z.stop, n: z.n, Hg: z.Hg ? z.Hg.slice() : null,
      accel: z.accel ? { x: z.accel.x.slice(), y: z.accel.y.slice() } : null,
      sumMassAccel: z.sumMassAccel || null, canonicalAccel: z.canonicalAccel || null,
      minEig: z.minEig, cond: z.cond };
  }, { bodies, o });
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

// ---------------- ⑥ 第273便d(AH26): **静止 2 体の不均衡 2 種**
// 統括の予備測定と同じ構成(m₁=2・m₂=1・r=3・D₀=1・η=0.7・ε=0)を**先頭に置く**。
// **実装の返り値**(`sumMassAccel`/`canonicalAccel`)と**純関数**(`canonicalMomentumCheck`)を
// 2 列で並べ、一致を測る(片方だけの数は書かない)。
console.error('⑥ 正準運動量(静止・AH26)');
{
  const CASES = [
    { tag: 'brief/m2:1/r3/D0=1/eta0.7/eps0', m1: 2, m2: 1, r: 3,
      o: { G: 1, eps: 0, p: 1, D0: 1, eta: 0.7, gauge: 'inertia' } },
    { tag: 'equal/D0=0.5/eta1', m1: 500, m2: 500, r: SEP, o: { ...BASE, D0: 0.5 } },
    { tag: 'ratio/1000:100/D0=0.5/eta1', m1: 1000, m2: 100, r: SEP, o: { ...BASE, D0: 0.5 } },
    { tag: 'ratio/1e4:1/D0=0.5/eta1', m1: 1e4, m2: 1, r: SEP, o: { ...BASE, D0: 0.5 } },
    { tag: 'equal/D0=0/eta1(structural)', m1: 500, m2: 500, r: SEP, o: { ...BASE, D0: 0 } },
    { tag: 'ratio/1000:100/eta=0(Newton)', m1: 1000, m2: 100, r: SEP, o: { ...BASE, D0: 0.5, eta: 0 } },
  ];
  for (const c of CASES) {
    const bodies = [{ m: c.m1, x: -c.r / 2, y: 0, vx: 0, vy: 0 },
      { m: c.m2, x: c.r / 2, y: 0, vx: 0, vy: 0 }];
    const z = await solveBodies(bodies, c.o);
    const pure = z.accel ? canonicalMomentumCheck({ n: 2, m: [c.m1, c.m2], accel: z.accel, Hg: z.Hg }) : null;
    const dImpl = (z.sumMassAccel && pure)
      ? Math.abs(z.sumMassAccel.x - pure.sumMassAccel.x) : null;
    const dCan = (z.canonicalAccel && pure && pure.canonicalAccel)
      ? Math.abs(z.canonicalAccel.x - pure.canonicalAccel.x) : null;
    const rec = { tag: c.tag, m1: c.m1, m2: c.m2, r: c.r, opts: c.o, stop: z.stop || null,
      sumMassAccel: z.sumMassAccel, canonicalAccel: z.canonicalAccel,
      pureSumMassAccel: pure ? pure.sumMassAccel : null,
      pureCanonicalAccel: pure ? pure.canonicalAccel : null,
      implMinusPure: { sumMassAccel: dImpl, canonicalAccel: dCan } };
    out.canonicalRest.push(rec);
    console.error(`  ${c.tag}: Σma_x=${z.sumMassAccel ? z.sumMassAccel.x.toExponential(4) : '—'} `
      + `1ᵀH′a_x=${z.canonicalAccel ? z.canonicalAccel.x.toExponential(4) : '—'} `
      + `(相対 ${z.canonicalAccel && z.canonicalAccel.rel[0] !== null ? z.canonicalAccel.rel[0].toExponential(2) : '—'})`
      + ` 実装−純関数 ${dImpl === null ? '—' : dImpl.toExponential(1)}/${dCan === null ? '—' : dCan.toExponential(1)}`);
  }
}

// ---------------- ⑦ 第273便d(AH26): **非静止**の d(1ᵀH′v)/dt = 1ᵀH′a + 1ᵀ(Ḣ′)v
// Ḣ′ は **q ± h·v** で H′ を 2 回評価した中心差分で作る(実装へ問い合わせるだけ —— 解析は使わない)。
// h を 2 つ振って**刻み依存**も出す(1 つの h だけの値は書かない)。
console.error('⑦ 正準運動量(非静止・AH26)');
{
  const MOV = [
    { tag: 'circularish/500:500/D0=0.5', m1: 500, m2: 500, r: SEP, o: { ...BASE, D0: 0.5 }, vk: 1 },
    { tag: 'circularish/1000:100/D0=0.5', m1: 1000, m2: 100, r: SEP, o: { ...BASE, D0: 0.5 }, vk: 1 },
    { tag: 'radial/1000:100/D0=0.5', m1: 1000, m2: 100, r: SEP, o: { ...BASE, D0: 0.5 }, vk: 0 },
    { tag: 'brief/m2:1/r3/D0=1/eta0.7', m1: 2, m2: 1, r: 3,
      o: { G: 1, eps: 0, p: 1, D0: 1, eta: 0.7, gauge: 'inertia' }, vk: 1 },
  ];
  for (const c of MOV) {
    const M = c.m1 + c.m2, vc = Math.sqrt(c.o.G * M / c.r);
    // 重心静止の 2 体(円軌道に近い接線速度 / vk=0 は径方向の接近)
    const vA = c.vk ? { vx: 0, vy: -vc * c.m2 / M } : { vx: 0.3 * vc * c.m2 / M, vy: 0 };
    const vB = c.vk ? { vx: 0, vy: vc * c.m1 / M } : { vx: -0.3 * vc * c.m1 / M, vy: 0 };
    const bodies = [{ m: c.m1, x: -c.r / 2, y: 0, ...vA }, { m: c.m2, x: c.r / 2, y: 0, ...vB }];
    const z0 = await solveBodies(bodies, c.o);
    const hs = [c.r * 1e-4, c.r * 1e-5];
    const stages = [];
    for (const h of hs) {
      const shift = (s) => bodies.map((b) => ({ ...b, x: b.x + s * h * b.vx, y: b.y + s * h * b.vy }));
      const zp = await solveBodies(shift(1), c.o), zm = await solveBodies(shift(-1), c.o);
      const chk = (z0.accel && zp.Hg && zm.Hg) ? canonicalMomentumCheck({
        n: 2, m: [c.m1, c.m2], accel: z0.accel, Hg: z0.Hg, h,
        vel: { x: bodies.map((b) => b.vx), y: bodies.map((b) => b.vy) },
        HgPlus: zp.Hg, HgMinus: zm.Hg }) : null;
      stages.push({ h, stopPlus: zp.stop || null, stopMinus: zm.stop || null,
        canonicalAccel: chk ? chk.canonicalAccel : null,
        hdotTerm: chk ? chk.hdotTerm : null,
        canonicalTotal: chk ? chk.canonicalTotal : null,
        hdotAvailable: !!(chk && chk.hdotAvailable) });
    }
    const t0 = stages[0].canonicalTotal, t1 = stages[1].canonicalTotal;
    const rec = { tag: c.tag, m1: c.m1, m2: c.m2, r: c.r, opts: c.o,
      velocities: bodies.map((b) => [b.vx, b.vy]), stop: z0.stop || null,
      sumMassAccel: z0.sumMassAccel, canonicalAccel: z0.canonicalAccel, stages,
      stepDependence: (t0 && t1)
        ? { dx: Math.abs(t0.x - t1.x), dy: Math.abs(t0.y - t1.y) } : null };
    out.canonicalMoving.push(rec);
    console.error(`  ${c.tag}: Σma_x=${z0.sumMassAccel ? z0.sumMassAccel.x.toExponential(4) : '—'} `
      + `1ᵀH′a_x=${z0.canonicalAccel ? z0.canonicalAccel.x.toExponential(4) : '—'} `
      + `1ᵀḢ′v_x=${t0 && stages[0].hdotTerm ? stages[0].hdotTerm.x.toExponential(4) : '—'} `
      + `計=${t0 ? t0.x.toExponential(4) : '—'} (h 依存 ${rec.stepDependence ? rec.stepDependence.dx.toExponential(1) : '—'})`);
  }
}

out.pageErrors = pageErrors;
await browser.close();
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.error('[w272c-rpar] wrote ' + OUT + '  (R∥ ' + out.cases.length + ' 行 / 正準 静止 '
  + out.canonicalRest.length + ' 行・非静止 ' + out.canonicalMoving.length + ' 行)');
