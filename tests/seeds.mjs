// 第35便 W5d(台帳4-20): 多seed不確かさスプリント
// - 本スクリプトは QA ではない(探索・統計。合否 exit code なし)。tests/out/seeds-results.json に保存する。
// - 起動フォールバック・NW=4 ワーカーキューは tests/exp-darkrotor.mjs(226-241)の体裁を踏襲。
// - galaxy 外縁増強(claim.galaxy-outerboost)/ darkrotor 腕振幅(behavior.darkrotorLong)の
//   帯定義・計算式は tests/qa.mjs から「転記」した(転記元行番号は各所のコメントに明記。
//   qa.mjs 自体は本スクリプトから一切変更していない — 台帳4-20 の指示どおり)。
// 実行: node tests/seeds.mjs(playwright 必須。既定8seed・NW=4並列)
//   SEEDS=20260723,1,2 node tests/seeds.mjs   … カンマ区切りで seed を上書き
//   QA_TARGET=beta/index.html node tests/seeds.mjs … 対象切替(既定 index.html)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const INDEX = 'file://' + path.join(ROOT, process.env.QA_TARGET || 'index.html');
const OUT_DIR = path.join(ROOT, 'tests', 'out');
fs.mkdirSync(OUT_DIR, { recursive: true });

// 既定8seed。SEEDS=環境変数でカンマ区切り上書き(台帳4-20 指示どおり)
const DEFAULT_SEEDS = [20260723, 1, 2, 3, 4, 5, 6, 7];
const SEEDS = process.env.SEEDS
  ? process.env.SEEDS.split(',').map(s => s.trim()).filter(Boolean).map(Number)
  : DEFAULT_SEEDS;

const GALAXY_STEPS = 6000;     // tests/qa.mjs:1433 (for k<6000)と同じ步数
const DARKROTOR_STEPS = 6000;  // tests/qa.mjs:2410-2414 (blk<12 * 500步 = 6000)と同じ步数

// ---- 第36便 E1(台帳4-49): 半径依存曲線 v(r)/v_bar(r) の8帯プロファイル(galaxy専用・追加節) ----
// 帯は r=40〜300 を8等分(等間隔)。v_bar(r) の計算式は beta/index.html:3138-3153(curveVBarAt。
// git show HEAD:beta/index.html で確定版を確認)を転記 — tests/qa.mjs:3377-3433 の
// curve.vbar-degenerate/curve.vbar-distributed が検証している式と同一(中心(cx,cy)まわり8方位点の
// 平均動径加速度 a_r=⟨-(a・r̂)⟩ から v_bar=√(r·a_r)〔a_r≤0 なら0〕を求める)。galaxy 中心BHは
// beta/index.html:1252 で x:0,y:0・pinned:true のため中心は(0,0)固定でよい。
// v(r) 実測式は下記 outer()(qa.mjs:1429-1432 転記)の vφ=(x·vy−y·vx)/r を8帯へ汎用化したもの。
const PROFILE_N = 8, PROFILE_RMIN = 40, PROFILE_RMAX = 300;
const PROFILE_BANDS = Array.from({ length: PROFILE_N }, (_, i) => {
  const lo = PROFILE_RMIN + i * (PROFILE_RMAX - PROFILE_RMIN) / PROFILE_N;
  const hi = PROFILE_RMIN + (i + 1) * (PROFILE_RMAX - PROFILE_RMIN) / PROFILE_N;
  return { lo, hi, mid: (lo + hi) / 2 };
});

// QA 閾値(tests/qa.mjs の現行判定値をそのまま転記 — 「割る seed の数」の参照用。判定式は変更しない)
const QA_GALAXY_BOOST_MIN = 1.04;   // tests/qa.mjs:1458  add('claim.galaxy-outerboost', ... r.galA > r.galB * 1.04
const QA_DARKROTOR_ARM_MIN = 0.22;  // tests/qa.mjs:2430  const armOk = lg.on.A2.every(v => v > 0.22)
const QA_DARKROTOR_CTRL_MAX = 0.19; // tests/qa.mjs:2431  const ctrlOk = lg.ctrl.A2.every(v => v < 0.19)

// ---- 起動(tests/exp-darkrotor.mjs 18-23 と同じフォールバック: playwright→無ければ playwright-core+固定パス) ----
async function launch() {
  const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  try { const { chromium } = await import('playwright'); return await chromium.launch(); } catch {}
  const { chromium } = await import('playwright-core');
  return chromium.launch({ executablePath: exe });
}
async function newPage(browser) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(INDEX);
  await page.waitForFunction(() => window.HP && HP.sim);
  return page;
}

// ---- 1seed分の計測(galaxy 外縁増強 + darkrotor 腕振幅)を1回の page.evaluate で実行 ----
async function runSeed(page, seed) {
  return page.evaluate(({ seed, GALAXY_STEPS, DARKROTOR_STEPS, PROFILE_BANDS }) => {
    // ===== galaxy 外縁増強: tests/qa.mjs 1420-1435(claim.galaxy-outerboost)を転記 =====
    // 帯 r∈[156,286](=[0.6,1.1]×260)・vφ=(x·vy − y·vx)/r の平均。qa.mjs:1429-1432 を転記(不変)。
    const outer = (sm) => {
      let sum = 0, c = 0;
      for (let i = 1; i < sm.n; i++) {
        const r2 = Math.hypot(sm.x[i], sm.y[i]);
        if (r2 >= 156 && r2 <= 286) { sum += (sm.x[i] * sm.vy[i] - sm.y[i] * sm.vx[i]) / r2; c++; }
      }
      return c ? sum / c : 0;
    };
    // ===== 第36便 E1(台帳4-49): v(r)/v_bar(r) の8帯プロファイル =====
    // v(r) 実測: 上記 outer() の帯を [lo,hi) に汎用化したもの(qa.mjs:1429-1432 のvφ式を再利用)。
    const vMeasBand = (sm, lo, hi) => {
      let sum = 0, c = 0;
      for (let i = 1; i < sm.n; i++) {
        const r2 = Math.hypot(sm.x[i], sm.y[i]);
        if (r2 >= lo && r2 < hi) { sum += (sm.x[i] * sm.vy[i] - sm.y[i] * sm.vx[i]) / r2; c++; }
      }
      return c ? sum / c : 0;
    };
    // v_bar(r): beta/index.html:3138-3153(curveVBarAt)を転記(中心(0,0)まわり8方位点の平均動径
    // 加速度 a=ΣG·m_j(r_j−r)/(|r_j−r|²+ε²)^{3/2} の内向き成分平均 a_r から v_bar=√(r·a_r) を返す。
    // a_r≤0(正味外向き)なら0。tests/qa.mjs:3380 curve.vbar-degenerate/distributed が検証する式と同一)。
    const vBarAt = (sm, r) => {
      const G = sm.params.G, eps2 = sm.params.softening * sm.params.softening;
      let accSum = 0;
      for (let a2 = 0; a2 < 8; a2++) {
        const th = (a2 / 8) * Math.PI * 2, px = r * Math.cos(th), py = r * Math.sin(th);
        let axp = 0, ayp = 0;
        for (let j = 0; j < sm.n; j++) {
          const dx = sm.x[j] - px, dy = sm.y[j] - py, d2 = dx * dx + dy * dy;
          const fg = G * sm.m[j] / Math.pow(d2 + eps2, 1.5);
          axp += fg * dx; ayp += fg * dy;
        }
        accSum += -(axp * Math.cos(th) + ayp * Math.sin(th));
      }
      const ar = accSum / 8;
      return ar > 0 ? Math.sqrt(r * ar) : 0;
    };
    const profileOf = (sm) => PROFILE_BANDS.map(({ lo, hi, mid }) => {
      const vMeas = vMeasBand(sm, lo, hi);
      const vBar = vBarAt(sm, mid);
      return { rLo: lo, rHi: hi, rMid: mid, vMeas, vBar, ratio: vBar > 0 ? vMeas / vBar : null };
    });
    const galP = HP.allPresets().find(q => q.id === 'galaxy');
    // qa.mjs は HP.abStart('kFrame',0) で A/B を同時駆動する(1426-1436)が、本スクリプトは
    // seed を差し替えるため「同一 seed で kFrame だけ違う2ビルドを順に走らせる」方式にした
    // (build の初期配置は seed のみに依存し kFrame には依存しないため数値的に等価)。
    const buildGalaxy = (kFrame) => {
      const preset = JSON.parse(JSON.stringify(galP));
      preset.seed = seed;
      preset.physics.kFrame = kFrame;
      HP.sim.build(HP.validatePreset(preset).preset);
    };
    buildGalaxy(1);
    for (let k = 0; k < GALAXY_STEPS; k++) HP.sim.step(0.016);
    const galA = outer(HP.sim), galANaN = HP.sim.hasNaN();
    const profileA = profileOf(HP.sim); // 第36便 E1: kFrame=1 の8帯プロファイル
    buildGalaxy(0);
    for (let k = 0; k < GALAXY_STEPS; k++) HP.sim.step(0.016);
    const galB = outer(HP.sim), galBNaN = HP.sim.hasNaN();
    const profileB = profileOf(HP.sim); // 第36便 E1: kFrame=0 の8帯プロファイル
    const galaxy = {
      galA, galB, boost: galB !== 0 ? galA / galB : 0, nan: galANaN || galBNaN,
      profile: { A: profileA, B: profileB } // 第36便 E1(台帳4-49): 追加節(既存フィールドは不変)
    };

    // ===== darkrotor 腕振幅: tests/qa.mjs 2380-2427(behavior.darkrotorLong)を転記 =====
    const BANDS = [[80, 120], [120, 160], [160, 200], [200, 240]]; // qa.mjs:2381 を転記(不変)
    const drP = HP.allPresets().find(q => q.id === 'darkrotor');
    const NH = drP.bodies.filter(b => b.type === 'single').length - 1; // qa.mjs:2384 を転記
    const OFF = NH + 1;
    // ローター(+中心BH)のインデックス列挙。qa.mjs:2386-2389 を転記(命名は qa.mjs 踏襲・BH含む)
    const rotorIdx = () => {
      const idx = []; let k = 0;
      for (const b of drP.bodies) {
        if (b.type === 'single') idx.push(k);
        k += (b.type === 'single' ? 1 : (b.n || 0));
      }
      return idx;
    };
    // A2=|Σ_j e^{2iθ_j}|/N_band(θ は中心BH基準)。qa.mjs:2390-2400 を転記(noise算出は本スクリプトでは省略)
    const a2 = (s, OFF) => BANDS.map(([lo, hi]) => {
      const bx = s.x[0], by = s.y[0];
      let cr = 0, ci = 0, N = 0;
      for (let i = OFF; i < s.n; i++) {
        const dx = s.x[i] - bx, dy = s.y[i] - by, r = Math.hypot(dx, dy);
        if (r >= lo && r < hi) {
          const th = Math.atan2(dy, dx);
          cr += Math.cos(2 * th); ci += Math.sin(2 * th); N++;
        }
      }
      return N ? Math.hypot(cr, ci) / N : 0;
    });
    // 後半平均 = t=3000〜6000 の7スナップショット平均。qa.mjs:2401-2427(run関数)の骨子を転記
    // (behavior.darkrotorLong に付随する keepPct/rotDev/maxSpin 等の健全性統計は本スクリプトの
    // 目的〔腕振幅A2の多seed分布〕には不要なため割愛した)。
    const runDarkrotor = (ctrl) => {
      const preset = JSON.parse(JSON.stringify(drP));
      preset.seed = seed;
      HP.sim.build(HP.validatePreset(preset).preset);
      const s = HP.sim;
      if (ctrl) for (const i of rotorIdx()) s.spin[i] = 0; // qa.mjs:2404 を転記(対照=中心BH+全ローターのスピン0)
      const late = [];
      const nBlk = Math.round(DARKROTOR_STEPS / 500);
      for (let blk = 0; blk < nBlk; blk++) {
        for (let k = 0; k < 500; k++) s.step(0.016);
        const t = (blk + 1) * 500;
        if (t >= 3000) late.push(a2(s, OFF));
      }
      const A2 = BANDS.map((_, b) => late.reduce((a, v) => a + v[b], 0) / late.length);
      return { A2, nLate: late.length, nan: s.hasNaN() };
    };
    const on = runDarkrotor(false), ctrl = runDarkrotor(true);

    return { seed, galaxy, darkrotor: { on, ctrl } };
  }, { seed, GALAXY_STEPS, DARKROTOR_STEPS, PROFILE_BANDS });
}

// ---- 統計ヘルパ ----
function stats(arr) {
  const a = arr.filter(v => Number.isFinite(v)).slice().sort((x, y) => x - y);
  const n = a.length;
  if (!n) return { n: 0, mean: null, sd: null, min: null, max: null, median: null };
  const mean = a.reduce((s, v) => s + v, 0) / n;
  const sd = n > 1 ? Math.sqrt(a.reduce((s, v) => s + (v - mean) ** 2, 0) / (n - 1)) : 0;
  const median = n % 2 ? a[(n - 1) / 2] : (a[n / 2 - 1] + a[n / 2]) / 2;
  return { n, mean, sd, min: a[0], max: a[n - 1], median };
}

// ---- 実行(NW=4 並列キュー。tests/exp-darkrotor.mjs 226-241 と同方式) ----
const t0 = Date.now();
const commit = (() => { try { return execSync('git rev-parse HEAD', { cwd: ROOT }).toString().trim(); } catch { return 'unknown'; } })();
console.log(`多seed不確かさスプリント: ${SEEDS.length}seed(${SEEDS.join(',')})・NW=4並列...`);

const NW = 4;
const queue = SEEDS.map(seed => ({ seed }));
const perSeed = {};
await Promise.all(Array.from({ length: NW }, async () => {
  const browser = await launch();
  const page = await newPage(browser);
  while (queue.length) {
    const job = queue.shift();
    const t1 = Date.now();
    const r = await runSeed(page, job.seed);
    perSeed[job.seed] = r;
    console.log(`  seed=${job.seed}: galaxy boost=${r.galaxy.boost.toFixed(3)}(NaN=${r.galaxy.nan}) ` +
      `darkrotor on.A2=${r.darkrotor.on.A2.map(v => v.toFixed(3)).join('/')} ` +
      `ctrl.A2=${r.darkrotor.ctrl.A2.map(v => v.toFixed(3)).join('/')} ` +
      `[${((Date.now() - t1) / 1000).toFixed(0)}s]`);
  }
  await browser.close();
}));

// ---- 集計 ----
const orderedSeeds = SEEDS.filter(s => perSeed[s] !== undefined);
const boosts = orderedSeeds.map(s => perSeed[s].galaxy.boost);
const onA2ByBand = [0, 1, 2, 3].map(b => orderedSeeds.map(s => perSeed[s].darkrotor.on.A2[b]));
const ctrlA2ByBand = [0, 1, 2, 3].map(b => orderedSeeds.map(s => perSeed[s].darkrotor.ctrl.A2[b]));
const onMinAcrossBands = orderedSeeds.map(s => Math.min(...perSeed[s].darkrotor.on.A2));
const ctrlMaxAcrossBands = orderedSeeds.map(s => Math.max(...perSeed[s].darkrotor.ctrl.A2));
const anyNaN = orderedSeeds.filter(s => perSeed[s].galaxy.nan || perSeed[s].darkrotor.on.nan || perSeed[s].darkrotor.ctrl.nan);

// 第36便 E1(台帳4-49): v(r)/v_bar(r) 8帯プロファイルの集計(帯別mean/sd。既存集計には手を入れない)
const profileStatsFor = (cond) => {
  const vMeas = PROFILE_BANDS.map((_, b) => orderedSeeds.map(s => perSeed[s].galaxy.profile[cond][b].vMeas));
  const vBar = PROFILE_BANDS.map((_, b) => orderedSeeds.map(s => perSeed[s].galaxy.profile[cond][b].vBar));
  const ratio = PROFILE_BANDS.map((_, b) => orderedSeeds
    .map(s => perSeed[s].galaxy.profile[cond][b].ratio)
    .filter(v => v !== null));
  return { vMeas: vMeas.map(stats), vBar: vBar.map(stats), ratio: ratio.map(stats) };
};
const profileA = profileStatsFor('A');
const profileB = profileStatsFor('B');
const boostByBand = PROFILE_BANDS.map((_, b) => orderedSeeds
  .map(s => {
    const vA = perSeed[s].galaxy.profile.A[b].vMeas, vB = perSeed[s].galaxy.profile.B[b].vMeas;
    return vB !== 0 ? vA / vB : null;
  })
  .filter(v => v !== null));

const out = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  commit,
  target: process.env.QA_TARGET || 'index.html',
  note: '第35便 W5d(台帳4-20): 多seed不確かさスプリント。QAではない(合否なし)。' +
    'galaxy外縁増強/darkrotor腕振幅の帯定義・計算式は tests/qa.mjs から転記(行番号はソース参照)。',
  meta: {
    steps: { galaxy: GALAXY_STEPS, darkrotor: DARKROTOR_STEPS },
    bands: {
      galaxyOuter: { rMin: 156, rMax: 286, source: 'tests/qa.mjs:1429-1432 (claim.galaxy-outerboost)' },
      darkrotorArm: { rings: [[80, 120], [120, 160], [160, 200], [200, 240]],
        source: 'tests/qa.mjs:2381,2390-2400 (behavior.darkrotorLong)' },
      vbarProfile: { // 第36便 E1(台帳4-49)で追加(既存キーは不変)
        n: PROFILE_N, rMin: PROFILE_RMIN, rMax: PROFILE_RMAX,
        edges: PROFILE_BANDS.map(b => ({ rLo: +b.lo.toFixed(2), rHi: +b.hi.toFixed(2), rMid: +b.mid.toFixed(2) })),
        source: {
          vBar: 'beta/index.html:3138-3153 (curveVBarAt; git show HEAD:beta/index.html で確定版参照) — ' +
            'tests/qa.mjs:3377-3433 (curve.vbar-degenerate/curve.vbar-distributed) が検証する式と同一',
          vMeas: 'tests/qa.mjs:1429-1432 (claim.galaxy-outerboost) の vφ=(x·vy−y·vx)/r を8帯へ汎用化' +
            '(tests/seeds.mjs 内 vMeasBand。中心は galaxy 中心BH〔beta/index.html:1252, x:0,y:0,pinned:true〕に固定)'
        }
      }
    },
    qaThresholds: {
      galaxyBoostMin: QA_GALAXY_BOOST_MIN,        // tests/qa.mjs:1458
      darkrotorArmMin: QA_DARKROTOR_ARM_MIN,       // tests/qa.mjs:2430
      darkrotorCtrlMax: QA_DARKROTOR_CTRL_MAX      // tests/qa.mjs:2431
    },
    seeds: orderedSeeds,
    elapsedSec: +((Date.now() - t0) / 1000).toFixed(1)
  },
  perSeed: orderedSeeds.map(s => ({ seed: s, ...perSeed[s] })),
  stats: {
    galaxyBoost: { ...stats(boosts), belowQaThreshold: boosts.filter(v => v <= QA_GALAXY_BOOST_MIN).length },
    darkrotorOnA2: {
      perBand: onA2ByBand.map(stats),
      minAcrossBandsPerSeed: onMinAcrossBands,
      seedsFailingArmMin: orderedSeeds.filter((s, i) => onMinAcrossBands[i] <= QA_DARKROTOR_ARM_MIN).length
    },
    darkrotorCtrlA2: {
      perBand: ctrlA2ByBand.map(stats),
      maxAcrossBandsPerSeed: ctrlMaxAcrossBands,
      seedsFailingCtrlMax: orderedSeeds.filter((s, i) => ctrlMaxAcrossBands[i] >= QA_DARKROTOR_CTRL_MAX).length
    },
    seedsWithNaN: anyNaN
  },
  // 第36便 E1(台帳4-49): v(r)/v_bar(r) 半径8帯プロファイル節(既存節への追加のみ・後方互換)。
  // ratio=v(r)/v_bar(r)(A=kFrame1,B=kFrame0それぞれ)。boostByBand=v_A(r)/v_B(r)(検証仮説:
  // 増強比が外縁ほど大きい単調プロファイルになるか — perSeed詳細は perSeed[].galaxy.profile 参照)。
  profile: {
    note: '第36便 E1(台帳4-49): 半径依存曲線 v(r)/v_bar(r) の8帯プロファイル(r=40〜300等分)。' +
      'kFrame=1(A)/0(B)双方を per-seed 記録(perSeed[].galaxy.profile)し、本節に帯別mean/sdを集計した。',
    bands: PROFILE_BANDS.map((b, i) => ({ index: i, rLo: +b.lo.toFixed(2), rHi: +b.hi.toFixed(2), rMid: +b.mid.toFixed(2) })),
    A: profileA,
    B: profileB,
    boostByBand: boostByBand.map(stats)
  }
};
fs.writeFileSync(path.join(OUT_DIR, 'seeds-results.json'), JSON.stringify(out, null, 1));
console.log(`保存: tests/out/seeds-results.json  合計 ${((Date.now() - t0) / 1000).toFixed(1)}s`);
console.log(`galaxy boost: mean=${out.stats.galaxyBoost.mean?.toFixed(3)} sd=${out.stats.galaxyBoost.sd?.toFixed(3)} ` +
  `min=${out.stats.galaxyBoost.min?.toFixed(3)} max=${out.stats.galaxyBoost.max?.toFixed(3)} ` +
  `(閾値${QA_GALAXY_BOOST_MIN}を割るseed=${out.stats.galaxyBoost.belowQaThreshold}/${orderedSeeds.length})`);
console.log(`darkrotor arm(on) 帯別mean=${out.stats.darkrotorOnA2.perBand.map(b => b.mean?.toFixed(3)).join('/')} ` +
  `(閾値${QA_DARKROTOR_ARM_MIN}を割るseed=${out.stats.darkrotorOnA2.seedsFailingArmMin}/${orderedSeeds.length})`);
console.log(`v/v_bar profile(E1・台帳4-49) 帯別rMid=${out.profile.bands.map(b => b.rMid.toFixed(0)).join('/')}`);
console.log(`  ratio_A(v/v_bar,kFrame1) mean=${out.profile.A.ratio.map(b => b.mean?.toFixed(3)).join('/')}`);
console.log(`  ratio_B(v/v_bar,kFrame0) mean=${out.profile.B.ratio.map(b => b.mean?.toFixed(3)).join('/')}`);
console.log(`  boostByBand(v_A/v_B) mean=${out.profile.boostByBand.map(b => b.mean?.toFixed(3)).join('/')}`);
