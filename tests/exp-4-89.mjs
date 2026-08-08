// 第89便 実験 4-89: 🥚selfRotor の**数値頑健性** — dt収束(3段階)+ softening ε 感度(3値)
//
// 主題: 論文3 P0 実験(2026-08-08c ハンドオフ §5)。exp-4-85 が担った標準試験(多seed・
//   N scaling・摂動回復・時間窓)は「物理側の頑健性」であり、本ハーネスは残る「数値側」:
//   ① dt を 0.016/0.008/0.004 と半分にしても秩序変数が変わらないか(時間離散化の収束)
//   ② softening ε を ×0.5/×1/×2 に振っても中心形成が消えないか(E1′ 緩和長の感度)
//
// 判定の考え方(カオス系の正直な扱い):
//   自己重力+融合はカオスなので、dt を変えると**軌跡は**必ず分岐する。論文3 で主張するのは
//   軌跡の一致ではなく「秩序変数(mFrac・maxFrac・align・V/σ・bound)が、16seed の物理的
//   ばらつき(exp-4-85 実測: mFrac 18.3〜53.3% 等)の**内側に留まる**こと」= 数値依存が
//   seed 依存より小さいこと。あわせて保存則(|ΔL|/L_scale)が dt とともに改善するかを記録する。
//
// 実行: QA_TARGET=beta/index.html node tests/exp-4-89.mjs(playwright 必須・約3分)
// 出力: tests/out/exp-4-89.json(QA ではない計測スクリプト — 末尾に自動判定の要約を出す)
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
if (!has) { console.log('SKIP: 対象に 🥚selfRotor がありません'); await browser.close(); process.exit(0); }

// ---- 共通ランナー(exp-4-85 の run を dt/softening 対応に拡張。測定量は同一定義)-----------
// mod: {seed, dt(既定0.016), softMul(既定1), tEnd(0.016単位の步数=物理時間/0.016)}
const run = (mod) => page.evaluate((o) => {
  const p = JSON.parse(JSON.stringify(HP.allPresets().find((q) => q.id === 'selfRotor')));
  if (o.seed !== undefined) p.seed = o.seed;
  if (o.softMul !== undefined) p.physics.softening = +(p.physics.softening * o.softMul).toFixed(6);
  const v = HP.validatePreset(p);
  if (!v.ok) return { err: v.errors };
  HP.sim.build(v.preset);
  const S = HP.sim;
  const dt = o.dt || 0.016;
  const T0 = S.totals(), L0 = T0.L + S.resL + S.radL;
  const tEnd = (o.tEnd || 9000) * 0.016;   // 物理時間で揃える(dt を変えても同じ t まで)
  const meas = () => {
    let bi = 0, mTot = 0;
    for (let i = 0; i < S.n; i++) { mTot += Math.abs(S.m[i]); if (Math.abs(S.m[i]) > Math.abs(S.m[bi])) bi = i; }
    const G = S.params.G, MB = Math.abs(S.m[bi]);
    let bound = 0, lswH = 0, nH = 0;
    for (let i = 0; i < S.n; i++) {
      if (i === bi) continue;
      const dx = S.x[i] - S.x[bi], dy = S.y[i] - S.y[bi];
      const dvx = S.vx[i] - S.vx[bi], dvy = S.vy[i] - S.vy[bi];
      const r = Math.hypot(dx, dy);
      if (0.5 * (dvx * dvx + dvy * dvy) - G * MB / Math.max(r, 1) < 0) bound++;
      lswH += S.lSw[i]; nH++;
    }
    const em = HP.emergenceStats(S);
    const cs = HP.coreState(bi);
    return { t: +S.t.toFixed(2), n: S.n, fusN: S.fusN, mFrac: MB / mTot,
      maxFrac: em.maxFrac, align: em.align, vsig: em.vsig, nCluster: em.nCluster,
      lSw: S.lSw[bi], lSwHalo: nH ? lswH / nH : 0, Jc: cs ? cs.J : 0,
      bound: bound / Math.max(1, nH) };
  };
  while (S.t < tEnd - 1e-9) S.step(dt);
  const T1 = S.totals(), L1 = T1.L + S.resL + S.radL;
  let lScale = 0;
  for (let i = 0; i < S.n; i++) lScale += Math.abs(S.m[i] * (S.x[i] * S.vy[i] - S.y[i] * S.vx[i]))
    + 0.5 * Math.abs(S.m[i]) * S.R[i] * S.R[i] * Math.abs(S.spin[i]);
  return { final: meas(), relL: Math.abs(L1 - L0) / Math.max(lScale, 1e-9),
    nan: S.hasNaN(), clampV: S.clampVN, clampR: S.clampRN || 0, softening: S.params.softening };
}, mod);

const out = { meta: { exp: '4-89', wave: 89, target: TARGET, date: new Date().toISOString().slice(0, 10),
  note: '🥚selfRotor 数値頑健性 — dt収束(0.016/0.008/0.004)+ ε感度(×0.5/×1/×2)。論文3 P0(QA ではない計測)' } };
// exp-4-85 実測の16seed幅(第83便A)— 「数値依存 < seed依存」判定の物差し
const SEED_RANGE = { mFrac: [0.183, 0.533], maxFrac: [0.972, 1.000], align: [0.985, 1.000],
  vsig: [3.1, 20.8], bound: [0.43, 1.00] };
out.seedRangeRef = { source: 'tests/exp-4-85.mjs(第83便A・16seed 実測)', range: SEED_RANGE };
const SEED3 = [20260806, 20260807, 20260808];
const inRange = (k, v) => v >= SEED_RANGE[k][0] - 1e-9 && v <= SEED_RANGE[k][1] + 1e-9;
const KEYS = ['mFrac', 'maxFrac', 'align', 'vsig', 'bound'];

// ==== ① dt 収束(0.016 / 0.008 / 0.004・3seed・同一物理時間 t=144)==========================
console.log('=== ① dt 収束(dt=0.016/0.008/0.004・3seed・t=144)===');
const dtSec = { dts: [0.016, 0.008, 0.004], seeds: SEED3, runs: {} };
for (const dt of dtSec.dts) {
  dtSec.runs['dt' + dt] = {};
  for (const sd of SEED3) {
    const r = await run({ seed: sd, dt, tEnd: 9000 });
    dtSec.runs['dt' + dt]['s' + sd] = r;
    const F = r.final;
    console.log(`dt=${String(dt).padEnd(5)} seed${sd}`,
      `mFrac${(F.mFrac * 100).toFixed(1)}% maxFrac${F.maxFrac.toFixed(3)} align${F.align.toFixed(3)}`,
      `V/σ${F.vsig.toFixed(2)} bound${F.bound.toFixed(2)} fus${F.fusN} relL=${r.relL.toExponential(1)}`,
      r.nan ? 'NAN' : '', (r.clampV || r.clampR) ? `clamp${r.clampV}/${r.clampR}` : '');
  }
}
// 判定: 全 dt×seed の秩序変数が 16seed 幅の内側か+relL の dt 依存
dtSec.judge = {};
for (const k of KEYS) {
  const all = [];
  for (const dt of dtSec.dts) for (const sd of SEED3) all.push(dtSec.runs['dt' + dt]['s' + sd].final[k]);
  dtSec.judge[k] = { inSeedRange: all.every((v) => inRange(k, v)), min: Math.min(...all), max: Math.max(...all) };
}
dtSec.judge.relL = Object.fromEntries(dtSec.dts.map((dt) =>
  ['dt' + dt, Math.max(...SEED3.map((sd) => dtSec.runs['dt' + dt]['s' + sd].relL))]));
dtSec.judge.nan = dtSec.dts.some((dt) => SEED3.some((sd) => dtSec.runs['dt' + dt]['s' + sd].nan));
out.dtConvergence = dtSec;
console.log('--- dt 収束判定 ---');
console.log(JSON.stringify(dtSec.judge, null, 1));

// ==== ② softening ε 感度(×0.5 / ×1 / ×2・3seed・dt=0.016・t=144)==========================
console.log('=== ② ε 感度(softening ×0.5/×1/×2・3seed)===');
const epSec = { muls: [0.5, 1, 2], seeds: SEED3, runs: {} };
for (const mul of epSec.muls) {
  epSec.runs['x' + mul] = {};
  for (const sd of SEED3) {
    const r = await run({ seed: sd, softMul: mul, tEnd: 9000 });
    epSec.runs['x' + mul]['s' + sd] = r;
    const F = r.final;
    console.log(`ε×${String(mul).padEnd(3)}(=${r.softening}) seed${sd}`,
      `mFrac${(F.mFrac * 100).toFixed(1)}% maxFrac${F.maxFrac.toFixed(3)} align${F.align.toFixed(3)}`,
      `V/σ${F.vsig.toFixed(2)} bound${F.bound.toFixed(2)} fus${F.fusN} relL=${r.relL.toExponential(1)}`,
      r.nan ? 'NAN' : '', (r.clampV || r.clampR) ? `clamp${r.clampV}/${r.clampR}` : '');
  }
}
epSec.judge = {};
for (const k of KEYS) {
  const all = [];
  for (const mul of epSec.muls) for (const sd of SEED3) all.push(epSec.runs['x' + mul]['s' + sd].final[k]);
  epSec.judge[k] = { inSeedRange: all.every((v) => inRange(k, v)), min: Math.min(...all), max: Math.max(...all) };
}
epSec.judge.nan = epSec.muls.some((m) => SEED3.some((sd) => epSec.runs['x' + m]['s' + sd].nan));
out.epsilonSensitivity = epSec;
console.log('--- ε 感度判定 ---');
console.log(JSON.stringify(epSec.judge, null, 1));

// ==== 総合(論文3 Robustness 章の判定素材)===================================================
const allOk = (sec) => KEYS.every((k) => sec.judge[k].inSeedRange) && !sec.judge.nan;
out.summary = {
  dtConvergedWithinSeedSpread: allOk(dtSec),
  epsilonRobustWithinSeedSpread: allOk(epSec),
  note: '判定=「dt/ε を振った秩序変数が 16seed の物理ばらつきの内側に留まる」(カオス系なので' +
    '軌跡一致ではなく分布内一致を主張する)。外れた量があれば論文3 では正直にその感度を記す。',
};
console.log('=== 総合 ===');
console.log(JSON.stringify(out.summary, null, 1));
fs.writeFileSync(path.join(OUT_DIR, 'exp-4-89.json'), JSON.stringify(out, null, 1));
console.log('→ tests/out/exp-4-89.json');
await browser.close();
