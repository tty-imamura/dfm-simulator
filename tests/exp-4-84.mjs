// 第82便 実験 4-84: 🥚selfRotor(自己形成ダークローター)の実測とノックアウト対照
//
// 主題: 「目標形状を初期条件に埋め込まず、局所則から構造が生成されるか」を対照つきで測る。
//   初期条件は一様円盤 180粒(全て m=1・spin=0・自由・弱い正味回転)+ 各粒に同一の微小コア種。
//   中心天体・暗い核・ハローはどれも初期条件に無い。
//
// 測定量(すべて 3000/6000/9000/12000 步で採る):
//   mFrac   = 最大質量天体の質量 / Σ|m|(= 融合成長した中心天体の質量比)
//   fusN    = 融合イベント数 / n = 残粒子数
//   spin,R  = 中心天体の殻スピンと半径 / lSw = 実効減光 lS_eff(auto)
//   lSwHalo = 中心天体を除く全天体の平均 lS_eff(「周囲は明るいまま」かを読む)
//   Jc      = 中心天体の J_core / JcSum = 系全体の Σ J_core(継承則の総和保存)
//   JcSeeds = Jc / J_seed(= 中心天体が飲み込んだ種の個数。質量比 m/m_seed と一致するはず)
//   bound   = 中心天体に重力束縛された天体の割合
//   em      = 創発モニタ(HP.emergenceStats): 塊の数・最大塊質量比・スピン整列度・回転支持比V/σ
//
// 対照(ノックアウト):
//   noFuse  : fusion キーを外す        → 中心天体が育たない(mFrac が 1/180 のまま)
//   noCore  : 群 core:{} を外す        → J_core が恒等的に 0(継承以外の生成経路が無い)
//   kF0     : kFrame=0(引きずりオフ)  → 外縁回転への系統差を見る(※実測は「差は立たない」)
//   dFrac   : 融合閾値の用量反応 0.7/0.6/0.5/0.35
//   seeds   : 3seed 頑健性(20260806/07/08)
//
// 実行: QA_TARGET=beta/index.html node tests/exp-4-84.mjs(playwright 必須・約10分)
// 出力: tests/out/exp-4-84.json(QA ではない — 合否判定はしない計測スクリプト)
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

const has = await page.evaluate(() => HP.allPresets().some((p) => p.id === 'selfRotor'));
if (!has) { console.log('SKIP: 対象に 🥚selfRotor がありません(第82便B 未適用)'); await browser.close(); process.exit(0); }

// mod: {noFuse, noCore, kFrame, dFrac, seed, Kt, G, steps}
const run = (mod) => page.evaluate((o) => {
  const p = JSON.parse(JSON.stringify(HP.allPresets().find((q) => q.id === 'selfRotor')));
  if (o.noFuse) delete p.fusion;
  else if (o.dFrac !== undefined) p.fusion.dFrac = o.dFrac;
  if (o.noCore) delete p.bodies[0].core;
  if (o.kFrame !== undefined) p.physics.kFrame = o.kFrame;
  if (o.Kt !== undefined) p.physics.Kt = o.Kt;
  if (o.G !== undefined) p.physics.G = o.G;
  if (o.seed !== undefined) p.seed = o.seed;
  const v = HP.validatePreset(p);
  if (!v.ok) return { err: v.errors };
  HP.sim.build(v.preset);
  const S = HP.sim;
  const N0 = S.n;
  // 種1個ぶんの J_core(継承の単位)
  const cs0 = HP.coreState(0);
  const jSeed = cs0 ? cs0.J : 0;
  const mSeed = Math.abs(S.m[0]);
  const T0 = S.totals(), L0 = T0.L + S.resL + S.radL;
  const meas = () => {
    let bi = 0, mTot = 0;
    for (let i = 0; i < S.n; i++) { mTot += Math.abs(S.m[i]); if (Math.abs(S.m[i]) > Math.abs(S.m[bi])) bi = i; }
    const cs = HP.coreState(bi);
    const G = S.params.G, MB = Math.abs(S.m[bi]);
    let bound = 0, lswH = 0, nH = 0, jSum = 0;
    for (let i = 0; i < S.n; i++) {
      const c2 = HP.coreState(i); if (c2) jSum += c2.J;
      if (i === bi) continue;
      const dx = S.x[i] - S.x[bi], dy = S.y[i] - S.y[bi];
      const dvx = S.vx[i] - S.vx[bi], dvy = S.vy[i] - S.vy[bi];
      const r = Math.hypot(dx, dy);
      if (0.5 * (dvx * dvx + dvy * dvy) - G * MB / Math.max(r, 1) < 0) bound++;
      lswH += S.lSw[i]; nH++;
    }
    const em = HP.emergenceStats(S);
    const Jc = cs ? cs.J : 0;
    return { step: Math.round(S.t / 0.016), n: S.n, fusN: S.fusN,
      mMax: MB, mFrac: MB / mTot, spin: S.spin[bi], R: S.R[bi],
      lSw: S.lSw[bi], lSwHalo: nH ? lswH / nH : 0,
      Jc, JcSum: jSum, JcSeeds: jSeed ? Jc / jSeed : 0, mSeeds: MB / mSeed,
      bound: bound / Math.max(1, nH),
      em: { nCluster: em.nCluster, maxFrac: em.maxFrac, align: em.align, vsig: em.vsig } };
  };
  const out = [meas()];
  for (const T of (o.steps || [3000, 6000, 9000, 12000])) {
    while (Math.round(S.t / 0.016) < T) S.step(0.016);
    out.push(meas());
  }
  const T1 = S.totals(), L1 = T1.L + S.resL + S.radL;
  let lScale = 0, pScale = 0;
  for (let i = 0; i < S.n; i++) {
    lScale += Math.abs(S.m[i] * (S.x[i] * S.vy[i] - S.y[i] * S.vx[i]))
      + 0.5 * Math.abs(S.m[i]) * S.R[i] * S.R[i] * Math.abs(S.spin[i]);
    pScale += Math.abs(S.m[i] * S.vx[i]) + Math.abs(S.m[i] * S.vy[i]);
  }
  return { N0, jSeed, mSeed, snaps: out,
    relL: Math.abs(L1 - L0) / Math.max(lScale, 1e-9),
    relP: Math.hypot(T1.px - T0.px, T1.py - T0.py) / Math.max(pScale, 1e-9),
    fusU: S.fusU, radE: S.radE, resL: S.resL,
    nan: S.hasNaN(), clampV: S.clampVN, clampR: S.clampRN || 0 };
}, mod);

const at = (r, step) => r.snaps.find((s) => s.step === step) || r.snaps[r.snaps.length - 1];
const show = (tag, r, step = 9000) => {
  if (r.err) { console.log(tag, 'ERR', r.err); return r; }
  const s = at(r, step);
  console.log(tag.padEnd(22),
    `@${step} n${s.n} fus${s.fusN} mFrac${(s.mFrac * 100).toFixed(1)}%(m=${s.mMax.toFixed(0)})`,
    `s${s.spin.toFixed(3)} R${s.R.toFixed(2)} lSw${s.lSw.toFixed(3)}/halo${s.lSwHalo.toFixed(3)}`,
    `Jc${s.Jc.toFixed(4)}(=${s.JcSeeds.toFixed(1)}種/質量${s.mSeeds.toFixed(0)}) ΣJc${s.JcSum.toFixed(4)}`,
    `b${s.bound.toFixed(2)} | em K${s.em.nCluster} f${s.em.maxFrac.toFixed(3)} a${s.em.align.toFixed(3)} V/σ${s.em.vsig.toFixed(2)}`,
    `relL${r.relL.toExponential(1)}`, r.nan ? 'NAN' : '', (r.clampV || r.clampR) ? `clamp${r.clampV}/${r.clampR}` : '');
  return r;
};

const out = { meta: { exp: '4-84', wave: 82, track: 'B', target: TARGET, date: new Date().toISOString().slice(0, 10),
  note: '🥚selfRotor 自己形成ダークローター — 生成とノックアウト対照(QA ではない計測)' }, cases: {} };

console.log('=== ① 本則(既定 seed 20260806)と時系列 ===');
out.cases.main = show('main', await run({}));
for (const s of out.cases.main.snaps)
  console.log(`   step${String(s.step).padStart(5)} n${String(s.n).padStart(3)} fus${String(s.fusN).padStart(3)}`,
    `mFrac${(s.mFrac * 100).toFixed(1)}% lSw${s.lSw.toFixed(3)}/halo${s.lSwHalo.toFixed(3)}`,
    `Jc${s.Jc.toFixed(4)} b${s.bound.toFixed(2)} K${s.em.nCluster} align${s.em.align.toFixed(3)} V/σ${s.em.vsig.toFixed(2)}`);

console.log('=== ② ノックアウト対照 ===');
out.cases.noFuse = show('noFuse(融合オフ)', await run({ noFuse: true }));
out.cases.noCore = show('noCore(コア種なし)', await run({ noCore: true }));
out.cases.kF0 = show('kFrame=0', await run({ kFrame: 0 }));

console.log('=== ③ 用量反応: 融合閾値 dFrac ===');
out.cases.dose = {};
for (const d of [0.7, 0.6, 0.5, 0.35]) out.cases.dose['d' + d] = show('dFrac=' + d, await run({ dFrac: d }));

console.log('=== ④ 用量反応: Kt(井戸の深さ → 暗さ)===');
out.cases.kt = {};
for (const k of [12, 14, 16, 20, 24]) out.cases.kt['Kt' + k] = show('Kt=' + k, await run({ Kt: k }));

console.log('=== ④b 用量反応: G(自己重力の強さ)===');
out.cases.g = {};
for (const G of [2, 4, 6, 8, 12]) out.cases.g['G' + G] = show('G=' + G, await run({ G }));

console.log('=== ⑤ 3seed 頑健性(本則 / noFuse / noCore)===');
out.cases.seeds = {};
for (const sd of [20260806, 20260807, 20260808]) {
  out.cases.seeds['s' + sd] = {
    main: show(`seed${sd} main`, await run({ seed: sd })),
    noFuse: show(`seed${sd} noFuse`, await run({ seed: sd, noFuse: true })),
    noCore: show(`seed${sd} noCore`, await run({ seed: sd, noCore: true })) };
}

// ---- claims 窓の候補(3seed の実測から)----
const g = (o, f) => [20260806, 20260807, 20260808].map((sd) => f(at(out.cases.seeds['s' + sd][o], 9000)));
const rng = (a) => ({ min: Math.min(...a), max: Math.max(...a), vals: a.map((v) => +v.toFixed(4)) });
out.summary = {
  mFrac: { main: rng(g('main', (s) => s.mFrac)), noFuse: rng(g('noFuse', (s) => s.mFrac)) },
  lSw: { main: rng(g('main', (s) => s.lSw)), noFuse: rng(g('noFuse', (s) => s.lSw)) },
  lSwHalo: { main: rng(g('main', (s) => s.lSwHalo)), noFuse: rng(g('noFuse', (s) => s.lSwHalo)) },
  Jc: { main: rng(g('main', (s) => s.Jc)), noCore: rng(g('noCore', (s) => s.Jc)) },
  JcSeedsVsMass: rng(g('main', (s) => s.JcSeeds / Math.max(1e-9, s.mSeeds))),
  bound: { main: rng(g('main', (s) => s.bound)), noFuse: rng(g('noFuse', (s) => s.bound)) },
};
console.log('=== 集計(3seed @9000步)===');
console.log(JSON.stringify(out.summary, null, 1));

fs.writeFileSync(path.join(OUT_DIR, 'exp-4-84.json'), JSON.stringify(out, null, 1));
console.log('saved tests/out/exp-4-84.json');
await browser.close();
