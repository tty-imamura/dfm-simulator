// 第38便 38C 実験1(台帳4-67): 「中心はブラックホール、周囲のダークローターを2つに減らして
// 恒星の動きが安定するか」の数値検証(原仮定者指示)。
// - 本スクリプトは QA ではない(合否 exit code なし)。tests/out/exp-4-67.json に計測値を保存する。
// - 対象実装ファイル(beta/index.html)は一切変更しない。プリセットの改変・追加もしない —
//   変種は「内蔵 🕶️darkrotor プリセットの深いコピーを書き換えて validatePreset に通す」
//   カスタムプリセット注入経路(tests/qa.mjs:1208-1224 freebox base()/run() と
//   tests/seeds.mjs:113-117/162-165 と同一の HP API)だけで作る。
// - 起動直後に一度だけ HP.loadPreset('darkrotor', false) を通す(= ページ内グローバル
//   currentPreset を正規経路で同期させる。tests/exp-factors.mjs:13-16 の A/B複製破損バグの教訓)。
//   本スクリプトは A/B(HP.abStart)を使わないが、経路は正規のまま揃える。
//
// 変種(統括の実験設計):
//   V0  対照 = 現行 darkrotor そのまま(ローター10体・BH m=2000)
//   V1a       対向高スピン2体(x=±200・spin2.0)だけ残し、低スピン8体を削除(ハロー 1500→300)
//   V1b       同上+削除分をBHへ繰り入れ(BH m=2000→3200・恒星リングの aroundMass も 3200 へ)
//   いずれも「総運動量ゼロ化」を BH の vx/vy で解き直す(2パス — single の運動量は v に線形)。
//   恒星リングの初速は現行の配置生成ロジック(type:"ring" / vMode:"kepler")をそのまま流用し、
//   aroundMass を各構成の中心質量に合わせて置き換える(V0/V1a=2000・V1b=3200)。
// BHスピン掃引: S_bh ∈ {0.12, 1, 2, 4, 8}(「制限は付けない」— 高スピン側の異常も観察対象)。
//
// 実行: node tests/exp-4-67.mjs(playwright 必須。既定 4 並列・約20分)
//   QA_TARGET=beta/index.html node tests/exp-4-67.mjs   … 既定。ルート index.html(v1.32)には
//     🕶️v5 が rMul 焼込前の等価形で入っているが、実験2(4-68c)が beta 専用機能を使うため
//     本実験も既定を beta に揃えてある。対象ファイルは起動時に一時ディレクトリへスナップショット
//     してから開く(他便が同ファイルを並行編集していても1回の実験中は不変 — SHA-256 を記録)。
//   EXP467_NW=2 node tests/exp-4-67.mjs                 … 並列ワーカー数(既定4)
//
// 転記元(指標式は tests/qa.mjs から一字も変えず転記。qa.mjs 自体は変更していない):
//   m=2 腕振幅 A2 / 環帯定義 ... tests/qa.mjs:197(BANDS)+ 398-410(a2)
//   恒星保持・ローター偏差 ..... tests/qa.mjs:427-433(keep/tot/rotDev/rotIn)
//   保存則の尺度 pS/lS と相対ずれ tests/qa.mjs:1211-1220(scales)+ 1170-1173(relP/relL/dLrel0)
//     = beta/index.html:5866-5867(HP.verify.v1 の恒等式)と同形
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const TARGET_ABS = TARGET.startsWith('/') ? TARGET : path.join(ROOT, TARGET);
const OUT_DIR = path.join(ROOT, 'tests', 'out');
fs.mkdirSync(OUT_DIR, { recursive: true });

// 対象HTMLのスナップショット(並行編集からの隔離+ハッシュ記録)
const TARGET_SRC = fs.readFileSync(TARGET_ABS);
const TARGET_SHA = crypto.createHash('sha256').update(TARGET_SRC).digest('hex');
const TMP_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'exp467-'));
const SNAP = path.join(TMP_DIR, 'target.html');
fs.writeFileSync(SNAP, TARGET_SRC);
const INDEX = 'file://' + SNAP;

const DT = 0.016;                     // tests/qa.mjs と同じ 1 step
const STEPS = 24000;                  // 統括指示の本走行長
const CKS = [6000, 12000, 24000];     // チェックポイント
const BLK = 500;                      // A2 スナップショット間隔(qa.mjs darkrotorLong と同じ)
const A2_WIN = 3000;                  // 各チェックポイントの帯平均窓([ck-3000, ck] の7点)
const BANDS = [[80, 120], [120, 160], [160, 200], [200, 240]];   // tests/qa.mjs:197 を転記
const REF_SEED = 20260726;            // 内蔵プリセットの seed
const SEEDS = [REF_SEED, 20260727, 20260728];
const SPINS = [0.12, 1, 2, 4, 8];     // BHスピン掃引(制限なし)
const CAL_STEPS = 6000;               // ローター周速の較正走行長(= 🕶️ の有効窓と同じ)
const CAL_ITER = 2;                   // セカント追加評価の上限(初期2点+2点 = 最大4評価)
const NW = Math.max(1, Number(process.env.EXP467_NW || 4));

// ---- 起動(tests/exp-darkrotor.mjs:18-23 と同じフォールバック)----
async function launch() {
  const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  try { const { chromium } = await import('playwright'); return await chromium.launch(); } catch {}
  const { chromium } = await import('playwright-core');
  return chromium.launch({ executablePath: exe });
}

// ---- ページ内ヘルパの設置(全ワーカー共通)----
// ここで定義する関数はすべてブラウザ側で動く。プリセットは HP.allPresets() の深いコピーだけを
// 書き換え、HP.validatePreset() を通してから HP.sim.build() する(= qa.mjs/seeds.mjs と同じ経路)。
function pageSetup() {
  HP.loadPreset('darkrotor', false);   // 正規経路でプリセットを読む(currentPreset 同期)
  const BASE = () => JSON.parse(JSON.stringify(HP.allPresets().find(q => q.id === 'darkrotor')));

  const mkPreset = (o) => {
    const p = BASE();
    p.seed = o.seed;
    const src = p.bodies;
    const bh = src[0], rotors = src.slice(1, 11), ring = src[11];
    bh.spin = o.spin;
    let bodies;
    if (o.variant === 'V0') {
      bodies = [bh].concat(rotors, [ring]);
    } else {
      // 対向2体(x=±200・y=0)だけ残す(= spin 2.0 の高スピン対)
      const keep = rotors.filter(b => Math.abs(b.y) < 1e-9 && Math.abs(Math.abs(b.x) - 200) < 1e-9);
      if (o.vRot !== undefined) for (const b of keep) b.vy = (b.x > 0 ? 1 : -1) * o.vRot;
      bh.m = o.bhM;
      ring.aroundMass = o.aroundMass;
      bodies = [bh].concat(keep, [ring]);
    }
    if (o.bhVx !== undefined) { bh.vx = o.bhVx; bh.vy = o.bhVy; }
    p.bodies = bodies;
    return p;
  };
  const buildRaw = (o) => {
    const v = HP.validatePreset(mkPreset(o));
    if (!v.ok) throw new Error('validatePreset NG: ' + v.errors.join(' / '));
    HP.sim.build(v.preset);
    return v;
  };
  // 総運動量ゼロ化(2パス): single の運動量は v に線形なので BH の Δv = −P/m_BH で厳密に 0 になる
  const buildZeroed = (o) => {
    buildRaw(Object.assign({}, o, { bhVx: 0, bhVy: 0 }));
    const t = HP.sim.totals(), mBH = HP.sim.m[0];
    const bhVx = -t.px / mBH, bhVy = -t.py / mBH;
    const v = buildRaw(Object.assign({}, o, { bhVx, bhVy }));
    const t1 = HP.sim.totals();
    return { warnings: v.warnings, bhVx, bhVy, P0: [t.px, t.py], P1: [t1.px, t1.py] };
  };
  const nSingleOf = (o) => mkPreset(o).bodies.filter(b => b.type === 'single').length;

  // ---- 指標(tests/qa.mjs からの転記)----
  // A2: qa.mjs:398-410(darkrotorLong の a2)を一字も変えず転記
  const a2 = (s, OFF, BANDS) => BANDS.map(([lo, hi]) => {
    const bx = s.x[0], by = s.y[0];
    let cr = 0, ci = 0, N = 0;
    for (let i = OFF; i < s.n; i++) {
      const dx = s.x[i] - bx, dy = s.y[i] - by, r = Math.hypot(dx, dy);
      if (r >= lo && r < hi) { const th = Math.atan2(dy, dx);
        cr += Math.cos(2 * th); ci += Math.sin(2 * th); N++; }
    }
    return { A2: N ? Math.hypot(cr, ci) / N : 0, N, noise: N ? Math.sqrt(Math.PI / (4 * N)) : 0 };
  });
  // 保存則の尺度: qa.mjs:1211-1220(freebox scales)を転記
  const scales = (s) => {
    let pS = 0, lS = 0;
    for (let i = 0; i < s.n; i++) {
      pS += s.m[i] * Math.hypot(s.vx[i], s.vy[i]);
      lS += Math.abs(s.m[i] * s.x[i] * s.vy[i]) + Math.abs(s.m[i] * s.y[i] * s.vx[i])
          + 0.5 * s.m[i] * s.R[i] * s.R[i] * Math.abs(s.spin[i]);
    }
    return { pS, lS };
  };
  const med = (arr) => { if (!arr.length) return null;
    const a = arr.slice().sort((x, y) => x - y); return a[Math.floor(a.length / 2)]; };
  // 恒星統計。中心は BH(qa.mjs:427 と同じく s.x[0],s.y[0] 基準)
  const starStats = (s, OFF, st0) => {
    const bx = s.x[0], by = s.y[0], bvx = s.vx[0], bvy = s.vy[0];
    const all = [], inR = [];
    let keep400 = 0, keep500 = 0, tot = 0, sVr2 = 0;
    for (let i = OFF; i < s.n; i++) {
      const dx = s.x[i] - bx, dy = s.y[i] - by, r = Math.hypot(dx, dy);
      all.push(r);
      if (st0[i - OFF] < 350) { tot++; if (r < 400) keep400++; if (r < 500) keep500++; }
      if (r < 400) { inR.push(r);
        const vr = (dx * (s.vx[i] - bvx) + dy * (s.vy[i] - bvy)) / (r || 1);
        sVr2 += vr * vr; }
    }
    const mean = inR.reduce((a, v) => a + v, 0) / (inR.length || 1);
    const varR = inR.reduce((a, v) => a + (v - mean) * (v - mean), 0) / (inR.length || 1);
    const sortAll = all.slice().sort((x, y) => x - y);
    return { keep400, keep500, tot, keepPct: tot ? 100 * keep400 / tot : 0,
      nIn: inR.length, sigmaR: Math.sqrt(varR), medR: med(inR), meanR: mean,
      sigmaVr: Math.sqrt(sVr2 / (inR.length || 1)),
      medRall: med(all), r90all: sortAll[Math.floor(sortAll.length * 0.9)] };
  };

  // ---- 1変種の本走行 ----
  const runOne = (o, cfg) => {
    const meta = buildZeroed(o);
    const s = HP.sim;
    const OFF = nSingleOf(o), NH = OFF - 1;
    const bx0 = s.x[0], by0 = s.y[0];
    const st0 = [], hr0 = [];
    for (let i = OFF; i < s.n; i++) st0.push(Math.hypot(s.x[i] - bx0, s.y[i] - by0));
    for (let k = 1; k <= NH; k++) hr0.push(Math.hypot(s.x[k] - bx0, s.y[k] - by0));
    const t0 = s.totals(), sc0 = scales(s);
    const init = starStats(s, OFF, st0);
    const snaps = [];          // {t, A2[4], N[4], noise[4]}
    const cks = [];
    let maxSpin = 0, nanAt = null;
    const nBlk = cfg.STEPS / cfg.BLK;
    for (let blk = 0; blk < nBlk; blk++) {
      for (let k = 0; k < cfg.BLK; k++) s.step(0.016);
      const t = (blk + 1) * cfg.BLK;
      for (let i = 0; i < s.n; i++) { const a = Math.abs(s.spin[i]); if (a > maxSpin) maxSpin = a; }
      const z = a2(s, OFF, cfg.BANDS);
      snaps.push({ t, A2: z.map(v => +v.A2.toFixed(6)), N: z.map(v => v.N), noise: z.map(v => +v.noise.toFixed(5)) });
      if (s.hasNaN() && nanAt === null) nanAt = t;
      if (cfg.CKS.indexOf(t) >= 0) {
        const st = starStats(s, OFF, st0);
        const t1 = s.totals(), sc1 = scales(s);
        // ローター(index 1..NH)の半径偏差: qa.mjs:431-433 を転記
        let rotDev = 0, rotIn = 0;
        for (let k = 1; k <= NH; k++) {
          const r = Math.hypot(s.x[k] - s.x[0], s.y[k] - s.y[0]);
          if (r > 60 && r < 400) rotIn++;
          rotDev = Math.max(rotDev, Math.abs(r / hr0[k - 1] - 1));
        }
        const win = snaps.filter(v => v.t >= t - cfg.A2_WIN && v.t <= t);
        const A2m = cfg.BANDS.map((_, b) => win.reduce((a, v) => a + v.A2[b], 0) / win.length);
        cks.push({ step: t, tSim: +(t * 0.016).toFixed(3), star: st,
          A2: A2m.map(v => +v.toFixed(5)), A2mean: +(A2m.reduce((a, v) => a + v, 0) / A2m.length).toFixed(5),
          A2winN: win.length, noise: snaps[snaps.length - 1].noise, nBand: snaps[snaps.length - 1].N,
          rotDev: +rotDev.toFixed(5), rotIn, NH,
          maxSpinSoFar: +maxSpin.toFixed(4), nan: s.hasNaN(),
          Lz: t1.L, P: [t1.px, t1.py],
          ledger: [s.resPx, s.resPy, s.resL, s.radE, s.radL],
          relP: Math.hypot(t1.px + s.resPx - t0.px, t1.py + s.resPy - t0.py) / sc1.pS,
          relL: Math.abs(t1.L + s.resL + s.radL - t0.L) / sc1.lS,
          dLrel0: Math.abs(t1.L + s.resL + s.radL - t0.L) / Math.max(Math.abs(t0.L), 1e-9) });
      }
      if (nanAt !== null) break;   // NaN 後は測っても意味がないので打ち切り(記録は残る)
    }
    return { meta, n: s.n, OFF, NH, nanAt,
      init: { star: init, Lz: t0.L, P: [t0.px, t0.py], pScale: sc0.pS, lScale: sc0.lS },
      cks, snaps };
  };

  // ---- ローター周速の較正 ----
  // 目的: 残した2体のローターリングが「初期半径に留まる」周速を各変種ごとに求める
  // (内蔵 🕶️ の 3.9169 は10体構成で較正された値で、8体を抜くと求心力が変わるため)。
  // 判定量は 🕶️ の有効窓と同じ 6000步後のローター半径。セカント法で r(6000)=200 を解く。
  const calibrate = (o, cfg) => {
    const rAt = (vRot) => {
      buildZeroed(Object.assign({}, o, { vRot }));
      const s = HP.sim;
      for (let k = 0; k < cfg.CAL_STEPS; k++) s.step(0.016);
      return Math.hypot(s.x[1] - s.x[0], s.y[1] - s.y[0]);
    };
    const R0 = 200, TOL = 1.0, VLO = 2.5, VHI = 5.5;   // r(CAL_STEPS) は vRot に単調増加(実測)
    let v0 = 3.30, r0 = rAt(v0);
    let v1 = 3.60, r1 = rAt(v1);
    const hist = [{ v: v0, r: +r0.toFixed(3) }, { v: v1, r: +r1.toFixed(3) }];
    for (let it = 0; it < cfg.CAL_ITER && Math.abs(r1 - R0) > TOL; it++) {
      let v2;
      if (Math.abs(r1 - r0) < 1.0) v2 = v1 + (r1 < R0 ? 0.4 : -0.4);   // 傾きが取れないときは掃く
      else v2 = v1 + (R0 - r1) * (v1 - v0) / (r1 - r0);
      if (!(v2 > VLO)) v2 = VLO; if (!(v2 < VHI)) v2 = VHI;
      if (Math.abs(v2 - v1) < 1e-4) break;
      const r2 = rAt(v2);
      hist.push({ v: +v2.toFixed(6), r: +r2.toFixed(3) });
      v0 = v1; r0 = r1; v1 = v2; r1 = r2;
    }
    // 履歴の中で |r−200| が最小の点を採る(発散したセカント段を採らないための保険)
    const best = hist.slice().sort((a, b) => Math.abs(a.r - R0) - Math.abs(b.r - R0))[0];
    return { vRot: +best.v.toFixed(6), rEnd: best.r, hist };
  };

  window.__E467 = { mkPreset, buildRaw, buildZeroed, nSingleOf, runOne, calibrate, a2, scales, starStats };
}

async function newPage(browser) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(INDEX);
  await page.waitForFunction(() => window.HP && HP.sim);
  await page.evaluate(pageSetup);
  return page;
}

// ---- 適用可否(qa.mjs:188-193 w5cHasObs/w5cDrFree と同条件)----
async function checkApplicable(page) {
  return page.evaluate(() => {
    if (!HP.allPresets().some(p => p.id === 'darkrotor')) return { ok: false, reason: '対象に darkrotor プリセットなし' };
    if (!(HP.sim && HP.sim.obsT)) return { ok: false, reason: '対象に観測温度系(obsT)なし(旧v3以前)' };
    const P = HP.allPresets().find(q => q.id === 'darkrotor');
    const free = P.bodies.every(b => !b.pinned && !b.railOmega && !b.railH);
    if (!free) return { ok: false, reason: '対象の darkrotor はレール駆動の旧v3構成(qa.mjs SKIP と同条件)' };
    const nS = P.bodies.filter(b => b.type === 'single').length;
    const nR = P.bodies.filter(b => b.type === 'ring').length;
    if (nS !== 11 || nR !== 1) return { ok: false, reason: `darkrotor の構成が v5 と違う(single=${nS} ring=${nR})` };
    return { ok: true, reason: '', nSingle: nS,
      bhM: P.bodies[0].m, bhSpin: P.bodies[0].spin, ringAround: P.bodies[11].aroundMass,
      rotorVy: P.bodies[1].vy, physics: P.physics, seed: P.seed };
  });
}

// ---- ワーカーキュー(exp-darkrotor.mjs:226-241 の体裁)----
async function runJobs(jobs, worker) {
  const queue = jobs.slice();
  const results = new Array(jobs.length);
  await Promise.all(Array.from({ length: Math.min(NW, jobs.length) }, async () => {
    const browser = await launch();
    const page = await newPage(browser);
    while (queue.length) {
      const job = queue.shift();
      const i = jobs.indexOf(job);
      const t1 = Date.now();
      try { results[i] = await worker(page, job); }
      catch (e) { results[i] = { error: String((e && e.message) || e) }; }
      results[i].elapsedSec = +((Date.now() - t1) / 1000).toFixed(1);
      results[i].job = job;
    }
    await browser.close();
  }));
  return results;
}

const CFG = { STEPS, CKS, BLK, A2_WIN, BANDS, CAL_STEPS, CAL_ITER };
const optOf = (job) => ({ variant: job.variant, seed: job.seed, spin: job.spin,
  bhM: job.bhM, aroundMass: job.aroundMass, vRot: job.vRot });

const runVariant = (page, job) => page.evaluate(
  ({ o, cfg }) => window.__E467.runOne(o, cfg), { o: optOf(job), cfg: CFG });

// ================================ 実行 ================================
const t0 = Date.now();
const commit = (() => { try { return execSync('git rev-parse HEAD', { cwd: ROOT }).toString().trim(); } catch { return 'unknown'; } })();
console.log(`第38便 38C 実験1(台帳4-67)対象: ${TARGET}  sha256=${TARGET_SHA.slice(0, 12)}  commit=${commit.slice(0, 7)}  並列=${NW}`);

{
  const b = await launch(); const pg = await newPage(b);
  const ap = await checkApplicable(pg);
  await b.close();
  if (!ap.ok) { console.error(`中止: ${ap.reason}`); process.exit(1); }
  console.log(`  前提OK: darkrotor v5(single=${ap.nSingle} BH m=${ap.bhM} spin=${ap.bhSpin} `
    + `ring.aroundMass=${ap.ringAround} rotor vy=${ap.rotorVy} seed=${ap.seed})`);
}

// ---- Phase 0: V1a/V1b のローター周速較正(参照 seed で1回。全 seed・全スピンで共用)----
console.log(`Phase 0: ローター周速の較正(${CAL_STEPS}步・セカント法で r(6000)=200)...`);
const CAL_JOBS = [
  { variant: 'V1a', bhM: 2000, aroundMass: 2000, seed: REF_SEED, spin: 0.12 },
  { variant: 'V1b', bhM: 3200, aroundMass: 3200, seed: REF_SEED, spin: 0.12 },
];
const calRes = await runJobs(CAL_JOBS, (page, job) => page.evaluate(
  ({ o, cfg }) => window.__E467.calibrate(o, cfg), { o: optOf(job), cfg: CFG }));
const VROT = {};
for (const r of calRes) {
  VROT[r.job.variant] = r.vRot;
  console.log(`  ${r.job.variant}: vRot=${r.vRot}(r(${CAL_STEPS}步)=${r.rEnd}) `
    + `履歴 ${r.hist.map(h => `${h.v}→${h.r}`).join(' , ')} [${r.elapsedSec}s]`);
}

// ---- Phase 1: V0 / V1a / V1b × 3seed(24000步)----
const P1_JOBS = [];
for (const seed of SEEDS) {
  P1_JOBS.push({ tag: `V0/s${seed}`, variant: 'V0', seed, spin: 0.12 });
  P1_JOBS.push({ tag: `V1a/s${seed}`, variant: 'V1a', bhM: 2000, aroundMass: 2000, seed, spin: 0.12, vRot: VROT.V1a });
  P1_JOBS.push({ tag: `V1b/s${seed}`, variant: 'V1b', bhM: 3200, aroundMass: 3200, seed, spin: 0.12, vRot: VROT.V1b });
}
console.log(`Phase 1: 主構成 ${P1_JOBS.length}本(${STEPS}步)...`);
const p1 = await runJobs(P1_JOBS, runVariant);
// 表示用の数値整形。恒星が1つも r<400 に残らないチェックポイントでは medR が null になる
// (BHスピン掃引の高スピン側で実際に起きる)ので、表示は必ず null 安全にする。
const nf = (v, d = 1) => (v === null || v === undefined || !Number.isFinite(v)) ? '—' : v.toFixed(d);
const brief = (r) => {
  if (r.error) return `エラー=${r.error}`;
  const c = r.cks;
  if (!c || !c.length) return '(チェックポイントなし)';
  return `保持% ${c.map(v => nf(v.star.keepPct)).join('→')} `
    + `σ_r ${c.map(v => nf(v.star.sigmaR)).join('→')} `
    + `中央値r ${c.map(v => nf(v.star.medR)).join('→')} `
    + `残存n(r<400) ${c.map(v => v.star.nIn).join('→')} `
    + `A2 ${c.map(v => nf(v.A2mean, 3)).join('→')} `
    + `|ΔL|/L_scale ${c[c.length - 1].relL.toExponential(2)} NaN=${r.nanAt === null ? 'なし' : 't=' + r.nanAt}`;
};
// 表示の失敗で実測データを失わないよう、コンソール出力は必ず try で囲う
const report = (rs) => { for (const r of rs) {
  try { console.log(`  ${r.job.tag}: ${brief(r)} [${r.elapsedSec}s]`); }
  catch (e) { console.log(`  ${r.job.tag}: (表示エラー ${String(e && e.message || e)} — 数値は JSON に保存)`); }
} };
report(p1);

// ---- 勝ち V1 の決定(統括の判定式: 12000〜24000步で保持率が V0 以上かつ σ_r ドリフトが V0 より小)----
const mean = (a) => { const v = a.filter(Number.isFinite); return v.length ? v.reduce((x, y) => x + y, 0) / v.length : null; };
const grp = (variant) => p1.filter(r => r.job.variant === variant && !r.error);
const summarize = (variant) => {
  const rs = grp(variant);
  const at = (ck) => rs.map(r => r.cks.find(c => c.step === ck)).filter(Boolean);
  const k12 = at(12000), k24 = at(24000);
  if (!k12.length || !k24.length) return null;
  return {
    variant, nSeed: rs.length,
    keep12: mean(k12.map(c => c.star.keepPct)), keep24: mean(k24.map(c => c.star.keepPct)),
    sig12: mean(k12.map(c => c.star.sigmaR)), sig24: mean(k24.map(c => c.star.sigmaR)),
    sigDrift: mean(k24.map((c, i) => c.star.sigmaR - k12[i].star.sigmaR)),
    medDrift: mean(k24.map((c, i) => c.star.medR - k12[i].star.medR)),
    A2_24: mean(k24.map(c => c.A2mean)), relL24: Math.max(...k24.map(c => c.relL)),
    anyNaN: rs.some(r => r.nanAt !== null),
  };
};
const sumV0 = summarize('V0'), sumV1a = summarize('V1a'), sumV1b = summarize('V1b');
const verdictOf = (s) => (s && sumV0 && Number.isFinite(s.keep24) && Number.isFinite(s.sigDrift))
  ? { stable: (s.keep24 >= sumV0.keep24) && (s.sigDrift < sumV0.sigDrift), keepOk: s.keep24 >= sumV0.keep24,
      sigOk: s.sigDrift < sumV0.sigDrift }
  : null;
const vV1a = verdictOf(sumV1a), vV1b = verdictOf(sumV1b);
// 勝ち = 「安定」判定を満たすもの。両方満たす/両方満たさない場合は 24000步保持率→σ_rドリフト小 の順で選ぶ
const score = (s) => [s.keep24, -s.sigDrift];
let WIN = 'V1a';
if (sumV1a && sumV1b) {
  const a = score(sumV1a), b = score(sumV1b);
  const okA = !!(vV1a && vV1a.stable), okB = !!(vV1b && vV1b.stable);
  if (okA !== okB) WIN = okA ? 'V1a' : 'V1b';
  else WIN = (a[0] !== b[0]) ? (a[0] > b[0] ? 'V1a' : 'V1b') : (a[1] >= b[1] ? 'V1a' : 'V1b');
}
console.log(`  判定: V0 keep24=${nf(sumV0.keep24, 2)}% σ_rドリフト=${nf(sumV0.sigDrift, 3)} / `
  + `V1a keep24=${nf(sumV1a.keep24, 2)}% ドリフト=${nf(sumV1a.sigDrift, 3)}(安定=${vV1a && vV1a.stable}) / `
  + `V1b keep24=${nf(sumV1b.keep24, 2)}% ドリフト=${nf(sumV1b.sigDrift, 3)}(安定=${vV1b && vV1b.stable}) → 勝ち=${WIN}`);
const WINCFG = WIN === 'V1a' ? { bhM: 2000, aroundMass: 2000 } : { bhM: 3200, aroundMass: 3200 };

// ---- Phase 2: BHスピン掃引(勝ち構成・参照 seed 固定)+ 較正なし対照 ----
const P2_JOBS = SPINS.filter(sp => sp !== 0.12).map(sp => ({
  tag: `${WIN}/spin${sp}`, variant: WIN, ...WINCFG, seed: REF_SEED, spin: sp, vRot: VROT[WIN] }));
P2_JOBS.push({ tag: `${WIN}/vRot=3.9169(較正なし対照)`, variant: WIN, ...WINCFG,
  seed: REF_SEED, spin: 0.12, vRot: 3.9169 });
console.log(`Phase 2: BHスピン掃引 ${P2_JOBS.length}本(${STEPS}步)...`);
const p2 = await runJobs(P2_JOBS, runVariant);
report(p2);

// ---- Phase 3: 代表2点目(掃引で最良の保持率のスピン)を残り2seed で ----
const sweep = p2.filter(r => !r.error && r.cks && r.cks.length && r.job.spin !== 0.12);
let rep2 = null;
if (sweep.length) {
  const keep24 = (r) => { const c = r.cks.find(v => v.step === 24000); return (c && Number.isFinite(c.star.keepPct)) ? c.star.keepPct : -1; };
  rep2 = sweep.slice().sort((a, b) => keep24(b) - keep24(a))[0].job.spin;
}
const P3_JOBS = (rep2 === null) ? [] : SEEDS.filter(s => s !== REF_SEED).map(seed => ({
  tag: `${WIN}/spin${rep2}/s${seed}`, variant: WIN, ...WINCFG, seed, spin: rep2, vRot: VROT[WIN] }));
if (P3_JOBS.length) console.log(`Phase 3: 代表2点目 S_bh=${rep2} を残り ${P3_JOBS.length} seed で...`);
const p3 = P3_JOBS.length ? await runJobs(P3_JOBS, runVariant) : [];
report(p3);

// ---- 保存 ----
const strip = (r) => ({ job: r.job, elapsedSec: r.elapsedSec, error: r.error || null,
  meta: r.meta, n: r.n, OFF: r.OFF, NH: r.NH, nanAt: r.nanAt, init: r.init, cks: r.cks, snaps: r.snaps });
const out = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(), commit, target: TARGET, targetSha256: TARGET_SHA,
  note: '第38便 38C 実験1(台帳4-67「中心BH+ダークローター2つで恒星は安定するか」)。QA ではない(合否判定なし)。'
    + '内蔵 🕶️darkrotor プリセットは一切変更していない — 変種は allPresets() の深いコピーを書き換え '
    + 'validatePreset→sim.build で注入している(qa.mjs freebox / seeds.mjs と同じ経路)。',
  meta: {
    dt: DT, steps: STEPS, checkpoints: CKS, blockSteps: BLK, a2Window: A2_WIN, bands: BANDS,
    seeds: SEEDS, spins: SPINS, refSeed: REF_SEED, workers: NW,
    node: process.version, platform: `${os.platform()} ${os.release()}`, cpus: os.cpus().length,
    calibration: { steps: CAL_STEPS, maxIter: CAL_ITER, target: 200,
      results: calRes.map(r => ({ variant: r.job.variant, vRot: r.vRot, rEnd: r.rEnd, hist: r.hist })) },
    vRot: VROT, winner: WIN, rep2Spin: rep2,
    sources: {
      a2: 'tests/qa.mjs:197(BANDS)+ 398-410(darkrotorLong の a2)',
      keepRotDev: 'tests/qa.mjs:427-433(keep/tot/rotDev/rotIn)',
      conservation: 'tests/qa.mjs:1211-1220(freebox scales)+ 1170-1173(relP/relL/dLrel0)= beta/index.html:5866-5867(HP.verify.v1)と同形',
      presetInjection: 'tests/qa.mjs:1208-1224 / tests/seeds.mjs:113-117・162-165(allPresets 深いコピー→validatePreset→sim.build)',
    },
    designNotes: [
      '恒星リングの初速は現行の type:"ring"/vMode:"kepler" 生成ロジックをそのまま流用し、aroundMass を各構成の中心質量へ置換した(V0/V1a=2000・V1b=3200)。',
      '総運動量ゼロ化は BH の vx/vy を2パスで解いた(全変種・全seedに同一手順を適用)。参照seedのV0では内蔵値 (0.00166,-0.00435) を 6 桁で再現する。',
      'ローター8体の削除で build() 内の insideBig 再試行回数が変わるため、V1系の恒星リング初期配置は V0 と同一にはならない(3seed で平均化・レポートに明記)。',
      'V1系のローター周速は「6000步後の半径が初期値に戻る」条件でセカント較正した(内蔵の 3.9169 は10体構成の較正値)。較正なし(3.9169)の対照も1本走らせている。',
      'スピン掃引では周速を再較正しない(掃引の目的はスピン起因の異常の観察であり、それを較正で消さないため)。',
    ],
  },
  summary: { V0: sumV0, V1a: sumV1a, V1b: sumV1b, verdict: { V1a: vV1a, V1b: vV1b }, winner: WIN },
  runs: { phase1: p1.map(strip), phase2: p2.map(strip), phase3: p3.map(strip) },
};
fs.writeFileSync(path.join(OUT_DIR, 'exp-4-67.json'), JSON.stringify(out, null, 1));
console.log(`保存: tests/out/exp-4-67.json  合計 ${((Date.now() - t0) / 1000).toFixed(1)}s`);
try { fs.rmSync(TMP_DIR, { recursive: true, force: true }); } catch (_) {}
