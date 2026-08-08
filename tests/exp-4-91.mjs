// 第90便 実験 4-91: 🔥gas 熱平衡の**摂動回復**(標準試験⑤)+ λ(κs, n) スケーリングの整理
//
// 主題: 論文3 ミクロ章の深掘り(2026-08-08d §5-2)。exp-4-90 で成立した4試験に、残る
//   標準試験⑤「摂動回復」を加える。摂動は2種:
//   (a) 温度再分裂: 部分平衡化後(3000步)に左群へ ΔT=+3 を注入して勾配を作り直し、
//       再緩和の減衰率 λ2 が元の λ1 と同程度(0.5〜2倍)であることを見る(自己回復性)。
//       T_int の直接書換えはハーネス操作(アプリの摂動UIは速度系 — 温度注入はスコープ外)。
//   (b) 速度キック: 第90便で正式化したアプリ API S.injectPerturb(vAmp=1)を使う。
//       散逸(E9)で運動エネルギーが熱化して全体温度は上がるが、**群間の平衡化 λ3 は
//       元の λ1 と同程度に保たれる**ことを見る(平衡化機構はキックで壊れない)。
//   加えて、exp-4-90.json の実測から λ ≈ λ0·(κs/0.15)^β·(n/120)^α の指数を最小二乗で出し、
//   ミクロ章の「時間尺度の整理」節の素材にする(新規走行なし — 既存 JSON の後処理)。
//
// 実行: QA_TARGET=beta/index.html node tests/exp-4-91.mjs(playwright 必須・約4分)
// 出力: tests/out/exp-4-91.json(QA ではない計測スクリプト — 末尾に自動判定を出す)
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

const has = await page.evaluate(() =>
  HP.allPresets().some((p) => p.id === 'gas') && !!HP.obsTemp && !!(HP.sim && HP.sim.injectPerturb));
if (!has) { console.log('SKIP: 🔥gas / HP.obsTemp / injectPerturb のいずれかが無い(第90便未適用)'); await browser.close(); process.exit(0); }

// ---- 共通ランナー ------------------------------------------------------------------------
// mod: {seed, phase1(既定3000), phase2(既定3000), every(既定100),
//       perturb: null | {kind:"resplit", dT} | {kind:"kick", vAmp}}
// 返り: phase1/phase2 それぞれの λ(ln R 最小二乗)と曲線。R は**各 phase 開始時の ΔT で正規化**
const run = (mod) => page.evaluate((o) => {
  const p = JSON.parse(JSON.stringify(HP.allPresets().find((q) => q.id === 'gas')));
  if (o.seed !== undefined) p.seed = o.seed;
  const v = HP.validatePreset(p);
  if (!v.ok) return { err: v.errors };
  HP.sim.build(v.preset);
  const S = HP.sim;
  const n1 = p.bodies[0].n;
  const groupT = (lo, hi) => { let s = 0; for (let i = lo; i < hi; i++) s += HP.obsTemp(S, i);
    return s / Math.max(1, hi - lo); };
  const dT = () => Math.abs(groupT(n1, S.n) - groupT(0, n1));
  const every = o.every || 100;
  const lamOf = (steps) => {   // steps 步ぶん走らせ、その区間の λ を最小二乗で返す
    const d0 = Math.max(dT(), 1e-12);
    const xs = [], ys = [], curve = [];
    for (let done = 0; done < steps; done += every) {
      const chunk = Math.min(every, steps - done);
      for (let k = 0; k < chunk; k++) S.step(0.016);
      const R = dT() / d0;
      curve.push(+R.toFixed(4));
      if (R > 0.02) { xs.push(done + chunk); ys.push(Math.log(R)); }
    }
    let lam = 0;
    if (xs.length >= 2) {
      const mx = xs.reduce((a, b) => a + b, 0) / xs.length, my = ys.reduce((a, b) => a + b, 0) / ys.length;
      let sxy = 0, sxx = 0;
      for (let i = 0; i < xs.length; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) * (xs[i] - mx); }
      lam = sxx > 0 ? -sxy / sxx : 0;
    }
    return { lam, d0, curve };
  };
  const ph1 = lamOf(o.phase1 || 3000);
  let applied = null;
  if (o.perturb && o.perturb.kind === 'resplit') {
    // 左群(初期低温側)へ ΔT を注入 — 勾配を作り直す(ハーネス操作・帳簿外の介入)
    for (let i = 0; i < n1; i++) S.Tint[i] += o.perturb.dT;
    applied = { kind: 'resplit', dT: o.perturb.dT };
  } else if (o.perturb && o.perturb.kind === 'kick') {
    const r = S.injectPerturb({ vAmp: o.perturb.vAmp, rngSeed: 20260808 });
    applied = { kind: 'kick', vAmp: o.perturb.vAmp, sigma: r.sigma };
  }
  const meanT0 = (groupT(0, n1) + groupT(n1, S.n)) / 2;
  const ph2 = lamOf(o.phase2 || 3000);
  const meanT1 = (groupT(0, n1) + groupT(n1, S.n)) / 2;
  return { n: S.n, ph1: { lam: ph1.lam, d0: ph1.d0 }, applied,
    ph2: { lam: ph2.lam, d0: ph2.d0, curve: ph2.curve },
    meanT: { beforePh2: meanT0, afterPh2: meanT1 }, nan: S.hasNaN() };
}, mod);

const fL = (x) => (x === 0 ? '0' : x.toExponential(2));
const out = { meta: { exp: '4-91', wave: 90, target: TARGET, date: new Date().toISOString().slice(0, 10),
  note: '🔥gas 摂動回復(標準試験⑤)+ λ(κs,n) スケーリング整理(QA ではない計測)' } };
const SEED3 = [20260806, 20260807, 20260808];

// ==== ⑤a 温度再分裂からの再緩和 ==============================================================
console.log('=== ⑤a 温度再分裂(3000步で部分平衡化 → 左群に ΔT=+3 → 再緩和 3000步)===');
const ra = { runs: {} };
for (const sd of SEED3) {
  const r = await run({ seed: sd, perturb: { kind: 'resplit', dT: 3 } });
  ra.runs['s' + sd] = { lam1: r.ph1.lam, lam2: r.ph2.lam, ratio: r.ph2.lam / r.ph1.lam,
    d0ph2: +r.ph2.d0.toFixed(3), nan: r.nan };
  console.log(`seed${sd}: λ1=${fL(r.ph1.lam)} → 再分裂(ΔT=${r.ph2.d0.toFixed(2)})→ λ2=${fL(r.ph2.lam)}`,
    `比=${(r.ph2.lam / r.ph1.lam).toFixed(2)}`, r.nan ? 'NAN' : '');
}
ra.judge = SEED3.every((sd) => { const x = ra.runs['s' + sd]; return x.ratio > 0.5 && x.ratio < 2 && !x.nan; });
out.resplit = ra;
console.log('--- ⑤a 判定(λ2/λ1 ∈ [0.5, 2]・全seed)---', ra.judge);

// ==== ⑤b 速度キック(正式API)後の平衡化維持 ================================================
console.log('=== ⑤b 速度キック(S.injectPerturb vAmp=1 @3000步 → 3000步)===');
const kb = { runs: {} };
for (const sd of SEED3) {
  const r = await run({ seed: sd, perturb: { kind: 'kick', vAmp: 1 } });
  kb.runs['s' + sd] = { lam1: r.ph1.lam, lam3: r.ph2.lam, ratio: r.ph2.lam / r.ph1.lam,
    meanTBefore: +r.meanT.beforePh2.toFixed(3), meanTAfter: +r.meanT.afterPh2.toFixed(3), nan: r.nan };
  console.log(`seed${sd}: λ1=${fL(r.ph1.lam)} → キック(σ=${r.applied.sigma.toFixed(3)})→ λ3=${fL(r.ph2.lam)}`,
    `比=${(r.ph2.lam / r.ph1.lam).toFixed(2)} 全体T ${r.meanT.beforePh2.toFixed(2)}→${r.meanT.afterPh2.toFixed(2)}`,
    r.nan ? 'NAN' : '');
}
kb.judge = SEED3.every((sd) => { const x = kb.runs['s' + sd]; return x.ratio > 0.5 && x.ratio < 2 && !x.nan; });
out.kick = kb;
console.log('--- ⑤b 判定(λ3/λ1 ∈ [0.5, 2]・全seed)---', kb.judge);

// ==== λ(κs, n) スケーリングの整理(exp-4-90.json の後処理 — 新規走行なし)===================
console.log('=== λ(κs,n) スケーリング(exp-4-90.json の最小二乗)===');
let scaling = null;
try {
  const e90 = JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'exp-4-90.json'), 'utf8'));
  const lnFit = (pairs) => {   // pairs=[x,y] → y=λ0·x^β の β(ln-ln 最小二乗)
    const xs = pairs.map((p2) => Math.log(p2[0])), ys = pairs.map((p2) => Math.log(p2[1]));
    const mx = xs.reduce((a, b) => a + b, 0) / xs.length, my = ys.reduce((a, b) => a + b, 0) / ys.length;
    let sxy = 0, sxx = 0;
    for (let i = 0; i < xs.length; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) * (xs[i] - mx); }
    return sxy / sxx;
  };
  const kPairs = [], nPairs = [];
  for (const ks of [0.05, 0.15, 0.45]) for (const sd of SEED3)
    kPairs.push([ks, e90.doseResponse.runs['k' + ks]['s' + sd].lam]);
  for (const n of [60, 120, 240]) for (const sd of SEED3)
    nPairs.push([n, e90.nScaling.runs['n' + n]['s' + sd].lam]);
  const beta = lnFit(kPairs), alpha = lnFit(nPairs);
  const lam0 = e90.summary.lamDefaultMedian;
  scaling = { beta: +beta.toFixed(3), alpha: +alpha.toFixed(3), lam0,
    form: 'λ ≈ λ0 · (κs/0.15)^β · (n/120)^α(λ0 = 16seed 中央値)',
    note: 'β≈1 なら伝導係数に比例、α≈1 なら密度(粒子数)に比例 — ミクロ章の時間尺度節の素材' };
  console.log(`β(κs指数)=${beta.toFixed(3)} α(n指数)=${alpha.toFixed(3)} λ0=${fL(lam0)}`);
} catch (e) { console.log('exp-4-90.json が読めないため省略:', String(e).slice(0, 80)); }
out.scaling = scaling;

// ==== 総合 ====================================================================================
out.summary = {
  resplitRecovery: ra.judge, kickRobustness: kb.judge,
  test5Pass: ra.judge && kb.judge,
  note: '⑤摂動回復 =(a)温度再分裂の再緩和 λ2 と(b)速度キック後の λ3 が、いずれも元の λ1 の ' +
    '0.5〜2倍に収まること(平衡化は一回限りの初期条件ではなく機構が毎步維持する到達点)。' +
    'これで🔥は標準試験①②′③④⑤⑥の6試験が揃う。',
};
console.log('=== 総合 ===');
console.log(JSON.stringify(out.summary, null, 1));
fs.writeFileSync(path.join(OUT_DIR, 'exp-4-91.json'), JSON.stringify(out, null, 1));
console.log('→ tests/out/exp-4-91.json');
await browser.close();
