// 第89便 実験 4-90: 🔥gas(気体の熱平衡)への**創発の標準試験**適用 — ミクロ章の成立性確認
//
// 主題: 論文3「様々なスケールでの創発」のミクロ章(内部スピン温度の熱平衡化)が、メゾ章
//   (🥚selfRotor・exp-4-85)と**同じ標準試験の型**で書けるかを確認する(2026-08-08c §5-3:
//   「唯一の新規実験群のため最優先で成立性確認」)。不成立なら縮退経路「メゾ+マクロ」を発動。
//
// 秩序変数(熱平衡化): R(t) = ΔT(t)/ΔT(0) と、その**減衰率 λ**(主判定量)
//   ΔT = |左群(初期 T_int=0.01)と右群(初期 T_int=6.25)の平均観測温度の差|(HP.obsTemp)。
//   群は生成順 index で追う(🔥は融合なし・粒子数不変なので index は安定)。
//   λ = ln R(t) の傾き(最小二乗・1/步)。t_eq(R<0.1 到達步)は参考値として併記する。
//
// 【第1走の正直な記録 — 秩序変数を t_eq から λ に差し替えた理由】
//   初版は t_eq(R<0.1)を主判定にしたが、既定 κs=0.15 では R(3000)≈0.91・R(6000)≈0.82 で、
//   外挿平衡時間はおよそ 7万步 — 観測窓 3000步の 20倍超であり、16seed×7万步は計測予算外。
//   一方で減衰そのものは全条件で単調・再現的(全断ノックアウトで R=1.000 の完全凍結、
//   κs 1/3×/1×/3× で λ がほぼ比例、N でも単調)だったので、主判定量を「窓内で測れる λ」に
//   替えた。これは判定の失敗ではなく「伝導の時間尺度が長い」という測定事実の記録である
//   (論文3 ミクロ章では、この時間尺度自体を time window 試験の結果として報告する)。
//
// 適用する標準試験:
//   ① ノックアウト対照 : 熱チャネル(κs・muF・γn)を全て切ると λ≈0(ΔT が凍結する)
//   ②′ 用量反応       : κs を 0.05/0.15/0.45 と振ると λ が単調に増える
//   ③ 多seed(16)     : λ が seed によらず再現する(ばらつき max/min < 3)
//   ④ 粒子数スケーリング: 片側 n=60/120/240 の全てで λ>0(かつ n とともに単調)
//   ⑥ 時間窓          : R(t) 曲線(100步刻み)+ 外挿平衡時間 ln(10)/λ を記録
//   (⑤ 摂動回復は本ハーネスでは扱わない — 平衡状態への再緩和はミクロ章の次段)
//
// 実行: QA_TARGET=beta/index.html node tests/exp-4-90.mjs(playwright 必須・約2分)
// 出力: tests/out/exp-4-90.json(QA ではない計測スクリプト — 末尾に成立性の自動判定を出す)
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

const has = await page.evaluate(() => HP.allPresets().some((p) => p.id === 'gas') && !!HP.obsTemp);
if (!has) { console.log('SKIP: 対象に 🔥gas / HP.obsTemp がありません'); await browser.close(); process.exit(0); }

// ---- 共通ランナー ------------------------------------------------------------------------
// mod: {seed, nSide, kappaS, muF, gammaN, steps(既定3000), every(既定100)}
const run = (mod) => page.evaluate((o) => {
  const p = JSON.parse(JSON.stringify(HP.allPresets().find((q) => q.id === 'gas')));
  if (o.seed !== undefined) p.seed = o.seed;
  if (o.nSide !== undefined) { p.bodies[0].n = o.nSide; p.bodies[1].n = o.nSide; }
  for (const k of ['kappaS', 'muF', 'gammaN']) if (o[k] !== undefined) p.physics[k] = o[k];
  const v = HP.validatePreset(p);
  if (!v.ok) return { err: v.errors };
  HP.sim.build(v.preset);
  const S = HP.sim;
  const n1 = p.bodies[0].n;               // 生成順: [0..n1) = 左(低温)・[n1..n1+n2) = 右(高温)
  const groupT = (lo, hi) => { let s = 0; for (let i = lo; i < hi; i++) s += HP.obsTemp(S, i);
    return s / Math.max(1, hi - lo); };
  const meas = () => {
    const Tc = groupT(0, n1), Th = groupT(n1, S.n);
    return { step: Math.round(S.t / 0.016), Tc, Th, dT: Math.abs(Th - Tc) };
  };
  const every = o.every || 100, steps = o.steps || 3000;
  const m0 = meas(); const curve = [m0];
  for (let done = 0; done < steps; done += every) {
    const chunk = Math.min(every, steps - done);
    for (let k = 0; k < chunk; k++) S.step(0.016);
    curve.push(meas());
  }
  const dT0 = Math.max(m0.dT, 1e-12);
  const R = curve.map((c) => c.dT / dT0);
  let tEq = null;
  for (let i = 0; i < curve.length; i++) if (R[i] < 0.1) { tEq = curve[i].step; break; }
  // 減衰率 λ: ln R の最小二乗傾き(step 0 を除く・R>0.02 の点のみ)。単位 1/步(0.016 単位)
  let lam = 0;
  { const xs = [], ys = [];
    for (let i = 1; i < curve.length; i++) if (R[i] > 0.02) { xs.push(curve[i].step); ys.push(Math.log(R[i])); }
    if (xs.length >= 2) {
      const mx = xs.reduce((a, b) => a + b, 0) / xs.length, my = ys.reduce((a, b) => a + b, 0) / ys.length;
      let sxy = 0, sxx = 0;
      for (let i = 0; i < xs.length; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) * (xs[i] - mx); }
      lam = sxx > 0 ? -sxy / sxx : 0;
    } }
  return { n: S.n, dT0: m0.dT, T0: { Tc: m0.Tc, Th: m0.Th },
    final: curve[curve.length - 1], Rfinal: R[R.length - 1], tEq, lam,
    curveStep: curve.map((c) => c.step), curveR: R.map((x) => +x.toFixed(4)),
    nan: S.hasNaN() };
}, mod);
const fL = (x) => (x === 0 ? '0' : x.toExponential(2));

const out = { meta: { exp: '4-90', wave: 89, target: TARGET, date: new Date().toISOString().slice(0, 10),
  note: '🔥gas 熱平衡化への標準試験適用 — 論文3ミクロ章の成立性確認(QA ではない計測)' } };
const t00 = Date.now();

// ==== ③ 多seed 16(本則・3000步)=============================================================
console.log('=== ③ 多seed 16(本則・3000步)===');
const SEEDS16 = Array.from({ length: 16 }, (_, i) => 20260806 + i);
const ms = { seeds: SEEDS16, runs: {} };
for (const sd of SEEDS16) {
  const r = await run({ seed: sd });
  ms.runs['s' + sd] = { Rfinal: r.Rfinal, tEq: r.tEq, lam: r.lam, dT0: +r.dT0.toFixed(4), nan: r.nan };
  console.log(`seed${sd}`.padEnd(12), `ΔT0=${r.dT0.toFixed(3)} R(3000)=${r.Rfinal.toFixed(4)}`,
    `λ=${fL(r.lam)}/步`, r.nan ? 'NAN' : '');
}
const rf = SEEDS16.map((sd) => ms.runs['s' + sd].Rfinal);
const lm = SEEDS16.map((sd) => ms.runs['s' + sd].lam);
ms.stats = { Rfinal: { min: Math.min(...rf), max: Math.max(...rf) },
  lam: { min: Math.min(...lm), max: Math.max(...lm),
    spreadRatio: Math.min(...lm) > 0 ? Math.max(...lm) / Math.min(...lm) : null },
  nan: SEEDS16.filter((sd) => ms.runs['s' + sd].nan) };
out.multiSeed = ms;
console.log('--- 16seed 集計 ---', JSON.stringify(ms.stats));

// ==== ① ノックアウト対照(熱チャネル全断・代表3seed)=========================================
console.log('=== ① ノックアウト対照(κs=0, muF=0, γn=0・3seed・3000步)===');
const SEED3 = [20260806, 20260807, 20260808];
const ko = { runs: {}, single: {} };
for (const sd of SEED3) {
  const r = await run({ seed: sd, kappaS: 0, muF: 0, gammaN: 0 });
  ko.runs['s' + sd] = { Rfinal: r.Rfinal, lam: r.lam, nan: r.nan };
  console.log(`全断 seed${sd}: R(3000)=${r.Rfinal.toFixed(4)} λ=${fL(r.lam)}`);
}
// 単独ノックアウト(κs だけ切る — 衝突チャネルの寄与を分離)
for (const sd of SEED3) {
  const r = await run({ seed: sd, kappaS: 0 });
  ko.single['s' + sd] = { Rfinal: r.Rfinal, lam: r.lam };
  console.log(`κs=0 seed${sd}: R(3000)=${r.Rfinal.toFixed(4)} λ=${fL(r.lam)}(衝突経路のみ)`);
}
out.knockout = ko;

// ==== ②′ 用量反応(κs=0.05/0.15/0.45・3seed)================================================
console.log('=== ②′ 用量反応(κs=0.05/0.15/0.45・3seed・3000步)===');
const dose = { kappas: [0.05, 0.15, 0.45], runs: {} };
for (const ks of dose.kappas) {
  dose.runs['k' + ks] = {};
  for (const sd of SEED3) {
    const r = await run({ seed: sd, kappaS: ks });
    dose.runs['k' + ks]['s' + sd] = { Rfinal: r.Rfinal, lam: r.lam };
    console.log(`κs=${String(ks).padEnd(4)} seed${sd}: R(3000)=${r.Rfinal.toFixed(4)} λ=${fL(r.lam)}`);
  }
}
// 単調性: seed ごとに λ(κs) が単調増加か(平衡化がドーズとともに速くなる)
dose.monotone = SEED3.map((sd) => {
  const v = dose.kappas.map((ks) => dose.runs['k' + ks]['s' + sd].lam);
  return { seed: sd, lams: v.map(fL), monotoneUp: v[0] < v[1] && v[1] < v[2] };
});
out.doseResponse = dose;
console.log('--- 用量反応(λ 単調増)---', JSON.stringify(dose.monotone));

// ==== ④ 粒子数スケーリング(片側 n=60/120/240・3seed)========================================
console.log('=== ④ 粒子数スケーリング(片側 n=60/120/240・3seed・3000步)===');
const sc = { ns: [60, 120, 240], runs: {} };
for (const n of sc.ns) {
  sc.runs['n' + n] = {};
  for (const sd of SEED3) {
    const r = await run({ seed: sd, nSide: n });
    sc.runs['n' + n]['s' + sd] = { Rfinal: r.Rfinal, lam: r.lam, nan: r.nan };
    console.log(`n=${String(n).padEnd(3)}×2 seed${sd}: R(3000)=${r.Rfinal.toFixed(4)} λ=${fL(r.lam)}`, r.nan ? 'NAN' : '');
  }
}
// n とともに λ が単調増(密度↑=接触・近接伝導↑)か
sc.monotone = SEED3.map((sd) => {
  const v = sc.ns.map((n) => sc.runs['n' + n]['s' + sd].lam);
  return { seed: sd, lams: v.map(fL), monotoneUp: v[0] < v[1] && v[1] < v[2] };
});
out.nScaling = sc;
console.log('--- N scaling(λ 単調増)---', JSON.stringify(sc.monotone));

// ==== ⑥ 時間窓(代表1seed の R(t) 曲線 — 既定パラメータ・6000步)=============================
const tw = await run({ seed: 20260806, steps: 6000 });
out.timeWindow = { curveStep: tw.curveStep, curveR: tw.curveR, tEq: tw.tEq, lam: tw.lam,
  Rat6000: tw.Rfinal, tEqExtrapSteps: tw.lam > 0 ? Math.round(Math.log(10) / tw.lam) : null };
console.log(`=== ⑥ 時間窓: R(6000)=${tw.Rfinal.toFixed(4)} λ=${fL(tw.lam)} ` +
  `外挿平衡時間(R=0.1)≈${out.timeWindow.tEqExtrapSteps}步 ===`);

// ==== 総合判定(ミクロ章の成立性 — 主判定量 λ)===============================================
const lamDefMed = [...lm].sort((a, b) => a - b)[8];   // 16seed 既定 λ の中央値近傍
const msOk = lm.every((x) => x > 0) && ms.stats.lam.spreadRatio !== null && ms.stats.lam.spreadRatio < 3;
const koOk = SEED3.every((sd) => Math.abs(ko.runs['s' + sd].lam) < 0.05 * lamDefMed);
const doseOk = dose.monotone.every((m) => m.monotoneUp);
const scOk = sc.monotone.every((m) => m.monotoneUp)
  && sc.ns.every((n) => SEED3.every((sd) => { const x = sc.runs['n' + n]['s' + sd]; return x.lam > 0 && !x.nan; }));
out.summary = {
  multiSeed16: msOk, knockout: koOk, doseResponse: doseOk, nScaling: scOk,
  microChapterFeasible: msOk && koOk && doseOk && scOk,
  lamDefaultMedian: lamDefMed,
  note: '主判定量は減衰率 λ(初版の t_eq は観測窓 3000步に対し平衡時間 ≈7万步で全条件未到達 — ' +
    'この時間尺度自体は時間窓試験の結果として記録)。成立=①全断で λ≈0 ②′κs で λ 単調増 ' +
    '③16seed で λ>0 かつ ばらつき<3倍 ④n で λ>0 かつ単調増。不成立項目があれば論文3 では' +
    'その感度を正直に記すか、縮退経路「メゾ+マクロ」(2026-08-08 裁定済み)を発動する。',
  elapsedSec: Math.round((Date.now() - t00) / 1000),
};
console.log('=== 総合(ミクロ章成立性)===');
console.log(JSON.stringify(out.summary, null, 1));
fs.writeFileSync(path.join(OUT_DIR, 'exp-4-90.json'), JSON.stringify(out, null, 1));
console.log('→ tests/out/exp-4-90.json');
await browser.close();
