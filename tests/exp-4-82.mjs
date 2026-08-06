// 第81便 実験 4-82: 🪜隠れ質量ラダー(暗い中心核の力学質量)の内蔵化前実測
//
// 主張: 減光 auto の重い中心核は T_obs=0(光度から推定される質量は 0)のまま、
//       外縁の測定リングから読む力学質量 M_dyn=⟨v²r⟩/G が実質量に比例する
//       = 「光度質量 ≪ 力学質量」がこの宇宙の法則の内側で成立する。
//       第74便 exp-4-70 E3(単一系・m=2500/5000/10000 の3回走行)の採択残を、
//       **3系を1画面に並べた1本のサンプル**として成立させるための較正実測。
//
// - 本スクリプトは QA ではない(合否 exit code なし)。tests/out/exp-4-82.json に計測値を保存する。
// - アプリ本体(beta/index.html)は変更しない — HP.sim.build() の直接注入で走らせる
//   (tests/exp-4-70.mjs / exp-4-75.mjs と同じ流儀)。内蔵後は S6 が内蔵プリセット経由の
//   同値性を確認する(プリセットが無い対象では SKIP)。
//
// 測定:
//   S0 E3 再現   … exp-4-70 E3 と同一構成を再走行し、系統比 1.40〜1.47 の再現を確かめる(基準点)
//   S1 円軌道較正 … リングの初速係数 f(= v/√(GM/r))を实測で決める。ケプラー値 f=1 では
//                   E6′ 引きずりぶんの遠心力が足りず/余ってリングが呼吸する(半径 RMS 最小の f)
//   S2 本測定    … 較正済み3系の M_dyn 時系列・比 2:4 の回復・中心の lSw/T_obs・NaN/クランプ
//   S3 スピン走査 … 中心スピンを変えると引きずりが変わる: 減光は不変(常に真っ暗)だが
//                   ラダー(比)は引きずりが強いほど圧縮される、を分離して見る
//   S4 汚染対照  … 系間距離を3倍にした対照。1画面配置による相互汚染が測定に効かないことの確認
//   S5 減光の力学不変性 … lightSweep を外した対照で M_dyn が 1 bit も変わらないこと(第70便 E2 の
//                   機械証明をこの構成でも確認 — 「暗いのに重い」の前提)
//   S6 内蔵同等性 … 内蔵プリセット 🪜massLadder があれば、正規の読込経路で S2 と同じ値が出るか
//
// 実行: node tests/exp-4-82.mjs(playwright 必須。既定 beta・数分)
//   QA_TARGET=beta/index.html node tests/exp-4-82.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + (TARGET.startsWith('/') ? TARGET : path.join(ROOT, TARGET));
const OUT_DIR = path.join(ROOT, 'tests', 'out');
fs.mkdirSync(OUT_DIR, { recursive: true });

// ---- 内蔵化する構成(フェーズ2で BUILTIN_PRESETS へ入れる形と同じ値)----
const SEED = 20260806;
const MS = [2500, 5000, 10000];   // ラダーの3段(実質量比 1 : 2 : 4)
const R0 = 180;                   // 測定リングの半径(3系とも同一 — 速度差がそのまま質量差になる)
const DSEP = 1440;                // 系間距離(= 8·R0。S4 で相互汚染の効きを実測して決めた)
const NR = 48;                    // 1系あたりのリング恒星数
const SPIN = 0.5;                 // 中心核のスピン(減光 auto の掻き出し源)
// 内蔵プリセットに書く角速度(= 較正係数 f × ケプラー値 √(GM/r)/r)。S1 の実測 f=1.05/1.04/1.04
const OMEGA = [0.019444, 0.027237, 0.038519];
const PHYS = { G: 0.8, D0: 1.5, kFrame: 1, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0,
  Kt: 50, cLight: 60, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
  geoPN: 0, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 3, timeScale: 3 };

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

// ページ側の共通ヘルパ(build / 測定)を1回だけ流し込む
await page.evaluate((C) => {
  window.__ML = C;
  // 3系ラダーの構築。fs=各系のリング初速係数・over で1回きりの差し替えを許す
  // oms = 各系のリング角速度(rad/時間)。ケプラー値からの較正係数 f は __mlOm(f) で作る
  window.__mlOm = (fs) => [0, 1, 2].map((k) => Math.sqrt(C.PHYS.G * C.MS[k] / C.R0) * fs[k] / C.R0);
  window.__mlBuild = (oms, over) => {
    const o = over || {};
    const spin = (o.spin === undefined) ? C.SPIN : o.spin;
    const D = (o.D === undefined) ? C.DSEP : o.D;
    const lsw = (o.lightSweep === undefined) ? 'auto' : o.lightSweep;
    const ph = Object.assign({}, C.PHYS, o.physics || {});
    const bodies = [];
    C.MS.forEach((m, k) => {
      const b = { type: 'single', rMul: 1.2, m, x: (k - 1) * D, y: 0, vx: 0, vy: 0,
        spin, pinned: true, radius: 15 };
      if (lsw !== null) b.lightSweep = lsw;
      bodies.push(b);
    });
    C.MS.forEach((m, k) => bodies.push({ type: 'ring', rMul: 1.2, n: C.NR, cx: (k - 1) * D, cy: 0,
      rIn: C.R0, rOut: C.R0, mMin: 0.05, mMax: 0.05, spinMin: 0, spinMax: 0, vMode: 'omega',
      aroundMass: 0, omega: oms[k], vNoise: 0,
      direction: 1, pinned: false, bulkVx: 0, bulkVy: 0 }));
    HP.sim.build({ id: 'massLadderExp', name: 'ml', description: 'exp',
      camera: { scale: D + C.R0 + 20 }, world: { boundary: 'none', size: 0 },
      seed: C.SEED, physics: ph, bodies });
    return HP.sim;
  };
  // 各系の測定: M_dyn=⟨v²r⟩/G(中心相対座標・リング恒星の固定IDで平均 — 第71便の教訓に従い
  // 終状態で群を再分類しない)。半径 RMS は円軌道からのずれ(較正の目的関数)
  window.__mlMeasure = (S, D) => {
    const G = S.params.G, out = [];
    for (let k = 0; k < 3; k++) {
      const cx = (k - 1) * D;
      let mD = 0, rm = 0, rq = 0;
      for (let i = 3 + k * window.__ML.NR; i < 3 + (k + 1) * window.__ML.NR; i++) {
        const dx = S.x[i] - cx, dy = S.y[i], r = Math.hypot(dx, dy);
        mD += (S.vx[i] * S.vx[i] + S.vy[i] * S.vy[i]) * r / G / window.__ML.NR;
        rm += r / window.__ML.NR;
        rq += (r - window.__ML.R0) * (r - window.__ML.R0) / window.__ML.NR;
      }
      out.push({ m: window.__ML.MS[k], mDyn: mD, ratio: mD / window.__ML.MS[k],
        rMean: rm, rRms: Math.sqrt(rq) / window.__ML.R0,
        lSw: S.lSw[k], Tobs: HP.obsTemp(S, k), spin: S.spin[k] });
    }
    return out;
  };
  // 走行中の半径 RMS(較正の目的関数 — 終端だけでなく全区間の呼吸を見る)
  window.__mlRun = (S, D, steps) => {
    const s2 = [0, 0, 0]; let c = 0;
    for (let k = 0; k < steps; k++) {
      S.step(0.016);
      if (k % 50 === 49) {
        c++;
        for (let g = 0; g < 3; g++) {
          const cx = (g - 1) * D; let rm = 0;
          for (let i = 3 + g * window.__ML.NR; i < 3 + (g + 1) * window.__ML.NR; i++)
            rm += Math.hypot(S.x[i] - cx, S.y[i]) / window.__ML.NR;
          s2[g] += ((rm - window.__ML.R0) / window.__ML.R0) ** 2;
        }
      }
    }
    return s2.map((v) => Math.sqrt(v / Math.max(1, c)));
  };
}, { SEED, MS, R0, DSEP, NR, SPIN, PHYS, OMEGA });

const OUT = { target: TARGET, at: new Date().toISOString(),
  config: { SEED, MS, R0, DSEP, NR, SPIN, PHYS, OMEGA } };

// ---- S0: exp-4-70 E3 の再現(基準点。単一系・disk 200体・band[140,260]・3000步) ----
OUT.s0_e3 = await page.evaluate((PH) => window.__ML.MS.map((mC) => {
  HP.sim.build({ id: 'e3', name: 'd', description: 'd', camera: { scale: 300 },
    world: { boundary: 'none', size: 0 }, seed: 20260804,
    physics: Object.assign({}, PH, { timeScale: 1 }),
    bodies: [
      { type: 'single', rMul: 1.2, m: mC, x: 0, y: 0, vx: 0, vy: 0, spin: 2, pinned: true,
        radius: 15, lightSweep: 'auto' },
      { type: 'disk', rMul: 1.2, n: 200, cx: 0, cy: 0, radius: 260, mMin: 0.16, mMax: 0.5,
        spinMin: 0, spinMax: 0, vMode: 'kepler', aroundMass: mC, vScale: 1.0, direction: 1,
        bulkVx: 0, bulkVy: 0 }] });
  const S = HP.sim;
  for (let k = 0; k < 3000; k++) S.step(0.016);
  const G = S.params.G; let mDyn = 0, c = 0;
  for (let i = 1; i < S.n; i++) { const rr = Math.hypot(S.x[i], S.y[i]);
    if (rr >= 140 && rr <= 260) { mDyn += (S.vx[i] ** 2 + S.vy[i] ** 2) * rr / G; c++; } }
  return { m: mC, mDyn: mDyn / c, ratio: mDyn / c / mC, cnt: c, lSw: S.lSw[0], Tobs: HP.obsTemp(S, 0) };
}), PHYS);
console.log('S0 E3 再現:', JSON.stringify(OUT.s0_e3));

// ---- S1: 円軌道較正 — リング初速係数 f のスキャン(半径 RMS 最小)。
//         kFrame=1(既定)と kFrame=0(引きずりなしの対照)の両方で取り、超過 f²−1 の
//         出どころが E6′ 引きずりであることを分離する ----
OUT.s1_calib = await page.evaluate(() => {
  const grid = [];
  for (let f = 0.96; f <= 1.1601; f += 0.01) grid.push(+f.toFixed(2));
  const scan = (kFrame) => {
    const rows = [];
    for (const f of grid) {
      const S = window.__mlBuild(window.__mlOm([f, f, f]), { physics: { kFrame } });
      rows.push({ f, rms: window.__mlRun(S, window.__ML.DSEP, 3000) });
    }
    return [0, 1, 2].map((g) => {
      let bf = 1, br = 1e9;
      for (const r of rows) if (r.rms[g] < br) { br = r.rms[g]; bf = r.f; }
      return { m: window.__ML.MS[g], f: bf, rms: br, excess: bf * bf - 1 };
    });
  };
  return { grid, kFrame1: scan(1), kFrame0: scan(0) };
});
const FS = OUT.s1_calib.kFrame1.map((b) => b.f);
console.log('S1 較正 f(kFrame=1):', JSON.stringify(OUT.s1_calib.kFrame1));
console.log('S1 較正 f(kFrame=0 対照):', JSON.stringify(OUT.s1_calib.kFrame0));

// ---- S2: 本測定(内蔵プリセットに書く角速度そのままで時系列) ----
OUT.s2_main = await page.evaluate((oms) => {
  const S = window.__mlBuild(oms);
  const D = window.__ML.DSEP;
  const ts = [];
  let done = 0;
  for (const st of [1500, 3000, 6000, 12000]) {
    window.__mlRun(S, D, st - done); done = st;
    const m = window.__mlMeasure(S, D);
    ts.push({ steps: st, t: S.t, sys: m,
      r21: m[1].mDyn / m[0].mDyn, r41: m[2].mDyn / m[0].mDyn,
      nan: S.hasNaN(), clampV: S.clampVN, clampS: S.clampSN, clampR: S.clampRN || 0,
      clampH: S.clampHN || 0 });
  }
  return { omega: oms, n: S.n, ts };
}, OMEGA);
console.log('S2 本測定:', JSON.stringify(OUT.s2_main.ts.map((r) => ({
  steps: r.steps, ratio: r.sys.map((s) => +s.ratio.toFixed(4)),
  r21: +r.r21.toFixed(4), r41: +r.r41.toFixed(4),
  lSw: r.sys.map((s) => +s.lSw.toFixed(5)), Tobs: r.sys.map((s) => s.Tobs) }))));

// ---- S3: 中心スピン走査(減光は不変・ラダーは引きずりで圧縮される、の分離) ----
OUT.s3_spin = await page.evaluate(() => {
  const out = [];
  for (const spin of [0.05, 0.2, 0.5, 1, 2]) {
    const grid = [];   // 走査コストを抑えるため S1 より粗い刻み(傾向の分離が目的)
    for (let f = 0.96; f <= 1.4401; f += 0.04) grid.push(+f.toFixed(2));
    const rms = [];
    for (const f of grid) {
      const S = window.__mlBuild(window.__mlOm([f, f, f]), { spin });
      rms.push({ f, r: window.__mlRun(S, window.__ML.DSEP, 2000) });
    }
    const fs = [0, 1, 2].map((g) => {
      let bf = 1, br = 1e9;
      for (const q of rms) if (q.r[g] < br) { br = q.r[g]; bf = q.f; }
      return bf;
    });
    const S = window.__mlBuild(window.__mlOm(fs), { spin });
    window.__mlRun(S, window.__ML.DSEP, 6000);
    const m = window.__mlMeasure(S, window.__ML.DSEP);
    out.push({ spin, fs, ratio: m.map((o) => o.ratio), lSw: m.map((o) => o.lSw),
      Tobs: m.map((o) => o.Tobs), r21: m[1].mDyn / m[0].mDyn, r41: m[2].mDyn / m[0].mDyn });
  }
  return out;
});
console.log('S3 スピン走査:', JSON.stringify(OUT.s3_spin.map((r) => ({
  spin: r.spin, fs: r.fs, r21: +r.r21.toFixed(4), r41: +r.r41.toFixed(4),
  lSw: r.lSw.map((v) => +v.toFixed(5)) }))));

// ---- S4: 汚染対照(系間距離 ×3) ----
OUT.s4_sep = await page.evaluate((oms) => {
  const runs = [];
  for (const D of [window.__ML.DSEP, window.__ML.DSEP * 3]) {
    const S = window.__mlBuild(oms, { D });
    window.__mlRun(S, D, 6000);
    const m = window.__mlMeasure(S, D);
    runs.push({ D, ratio: m.map((o) => o.ratio), mDyn: m.map((o) => o.mDyn),
      r21: m[1].mDyn / m[0].mDyn, r41: m[2].mDyn / m[0].mDyn });
  }
  return { runs, dRatio21: runs[0].r21 / runs[1].r21, dRatio41: runs[0].r41 / runs[1].r41 };
}, OMEGA);
console.log('S4 汚染対照:', JSON.stringify({ r21: OUT.s4_sep.runs.map((r) => +r.r21.toFixed(4)),
  r41: OUT.s4_sep.runs.map((r) => +r.r41.toFixed(4)) }));

// ---- S5: 減光の力学不変性(この構成での再確認 — 「暗いのに重い」の前提) ----
OUT.s5_dimInvariant = await page.evaluate((oms) => {
  const snap = (lightSweep) => {
    const S = window.__mlBuild(oms, { lightSweep });
    window.__mlRun(S, window.__ML.DSEP, 3000);
    return { x: [...S.x], y: [...S.y], vx: [...S.vx], vy: [...S.vy], sp: [...S.spin],
      lSw: [S.lSw[0], S.lSw[1], S.lSw[2]],
      m: window.__mlMeasure(S, window.__ML.DSEP).map((o) => o.mDyn) };
  };
  const a = snap(null), b = snap('auto');
  let diff = 0;
  for (let i = 0; i < a.x.length; i++)
    for (const k of ['x', 'y', 'vx', 'vy', 'sp']) if (a[k][i] !== b[k][i]) diff++;
  return { bitDiff: diff, lSwOff: a.lSw, lSwAuto: b.lSw,
    mDynOff: a.m, mDynAuto: b.m,
    mDynBitEqual: a.m.every((v, i) => v === b.m[i]) };
}, OMEGA);
console.log('S5 減光の力学不変性:', JSON.stringify(OUT.s5_dimInvariant));

// ---- S6: 内蔵プリセット経由の同等性(内蔵前は SKIP) ----
OUT.s6_builtin = await page.evaluate(() => {
  if (!HP.allPresets().some((p) => p.id === 'massLadder')) return null;
  HP.loadPreset('massLadder', false);
  const S = HP.sim;
  const D = window.__ML.DSEP;
  for (let k = 0; k < 6000; k++) S.step(0.016);
  const m = window.__mlMeasure(S, D);
  return { n: S.n, ratio: m.map((o) => o.ratio), mDyn: m.map((o) => o.mDyn),
    lSw: m.map((o) => o.lSw), Tobs: m.map((o) => o.Tobs),
    rMean: m.map((o) => o.rMean), rRms: m.map((o) => o.rRms),
    r21: m[1].mDyn / m[0].mDyn, r41: m[2].mDyn / m[0].mDyn,
    nan: S.hasNaN(), clampV: S.clampVN, clampS: S.clampSN, clampR: S.clampRN || 0 };
});
console.log('S6 内蔵同等性:', JSON.stringify(OUT.s6_builtin));

fs.writeFileSync(path.join(OUT_DIR, 'exp-4-82.json'), JSON.stringify(OUT, null, 1));
console.log('saved tests/out/exp-4-82.json');
await browser.close();
