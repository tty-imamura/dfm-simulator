// 第19便 探索実験: 「高速回転天体=ダークマター(ダークローター)」仮説の数値検証
// - 本スクリプトは QA ではない(合否判定なし)。tests/out/darkrotor-results.json に計測値を保存する。
// - 実験A: few-shot BH 条件での中心スピン走査 — 光線の有限時間捕捉が高スピンで消える現象
//   (回転フレームによる光線掃き出し)の相図と、物理対応ロック Kt=c0²/G での対照。
// - 実験B: 🌌銀河プリセット+高スピンハロー(20体×m30)の A/B 群 — スピン整列/反転/ランダム/0
//   × kRep(スピン斥力)× kFrame の分離比較。外縁帯 v_φ・回転曲線・u_φ(r)・円盤膨張を計測。
// 実行: node tests/exp-darkrotor.mjs(playwright 必須。約15分)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const INDEX = 'file://' + path.join(ROOT, process.env.QA_TARGET || 'index.html');
const OUT_DIR = path.join(ROOT, 'tests', 'out');
fs.mkdirSync(OUT_DIR, { recursive: true });

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

// ---- 実験A: 光子掃き出しスキャン(few-shot BH 条件・単一中心天体)----
// 捕捉判定は QA fewshot.bh-capture と同一(340步後に終端半径<300)。加えて
// 1020步版・最小接近半径・巻き付き角・順行(y<0)/逆行(y>0)非対称を記録する。
const BH_PHYSICS = { G: 1, D0: 2, kFrame: 1, q: 2, kRep: 1, muF: 0.5, gammaN: 0.4, kappaS: 0.05,
  Kt: 40, cLight: 60, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
  geoPN: 0, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1.2, softening: 2, timeScale: 1 };

async function runExpA(page) {
  return page.evaluate(({ PHY }) => {
    const mkPreset = (spin, Kt) => ({ name: 'bh-scan', description: 'd', seed: 20260723,
      camera: { scale: 300 }, world: { boundary: 'none', size: 0 },
      physics: Object.assign({}, PHY, { Kt }),
      bodies: [{ type: 'single', m: 2000, x: 0, y: 0, vx: 0, vy: 0, spin, pinned: true }] });
    const trace = (y0, steps) => {
      let minR = Infinity, wind = 0, prev = Math.atan2(y0, -300);
      const t = HP.traceRay(HP.sim, -300, y0, 1, 0, 2.7, steps, (px, py) => {
        const r = Math.hypot(px, py); if (r < minR) minR = r;
        const a = Math.atan2(py, px); let d = a - prev;
        while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
        wind += d; prev = a;
      });
      return { endR: Math.hypot(t.x, t.y), minR, wind };
    };
    const scan = (spins, Kt) => spins.map(s => {
      HP.sim.build(HP.validatePreset(mkPreset(s, Kt)).preset);
      // QA と同じ5本(y>0=中心スピン正に対し逆行側)+鏡映5本(y<0=順行側)
      const ysQA = [10, 40, 80, 120, 160];
      const qa = ysQA.map(y => trace(y, 340));
      const qaN = ysQA.map(y => trace(-y, 340));
      const long = ysQA.map(y => trace(y, 1020));
      // 細分ファン(±4..200 step4)で捕捉率と臨界衝突径数(捕捉された最大 |y0|)
      let capP = 0, capR = 0, bP = 0, bR = 0, nF = 0;
      for (let y = 4; y <= 200; y += 4) {
        nF++;
        if (trace(-y, 340).endR < 300) { capP++; bP = y; }   // y<0: 順行(フレームと同方向)
        if (trace(y, 340).endR < 300) { capR++; bR = y; }    // y>0: 逆行
      }
      return { spin: s, Kt,
        capQA: qa.filter(t => t.endR < 300).length,
        capQAneg: qaN.filter(t => t.endR < 300).length,
        capLong: long.filter(t => t.endR < 300).length,
        endR: qa.map(t => +t.endR.toFixed(1)), minR: qa.map(t => +t.minR.toFixed(1)),
        wind: qa.map(t => +(t.wind / (2 * Math.PI)).toFixed(2)),
        fan: { n: nF, capPro: capP, capRetro: capR, bCritPro: bP, bCritRetro: bR } };
    });
    const spins = [0, 0.1, 0.2, 0.3, 0.4, 0.45, 0.5, 0.52, 0.54, 0.56, 0.58, 0.6, 0.7, 0.8, 1.0, 1.25, 1.5, 2.0];
    const toy = scan(spins, PHY.Kt);                    // 一般化トイ設定 Kt=40
    const lock = scan([0, 0.5, 1, 2, 5, 10, 20], 3600); // 物理対応ロック Kt=c0²/G=3600
    // χ = kF·|u_φ|·n_eff/c0(掃き出し支配の無次元指標)の解析表
    const chiTab = [];
    for (const s of [0.5, 0.54, 0.6, 0.8, 1.0, 2.0]) for (const r of [30, 40, 50, 70, 100, 150, 200]) {
      const R = PHY.radiusScale * Math.sqrt(2000), eps = PHY.softening;
      const w = 2000 / Math.sqrt(r * r + eps * eps), W = PHY.D0 + w;
      const om = s * Math.pow(R / (R + r), PHY.q), uphi = (w / W) * om * r;
      const neff = Math.exp(2 * W / PHY.Kt);
      chiTab.push({ spin: s, r, uphi: +uphi.toFixed(3), neff: +neff.toFixed(2),
        chi: +(uphi * neff / PHY.cLight).toFixed(3) });
    }
    return { toy, lock, chiTab };
  }, { PHY: BH_PHYSICS });
}

// ---- 実験B: ダークローターハロー付き銀河 ----
// 🌌銀河プリセット(中心 m600 spin0.05 + 円盤380粒子)に、光線には見えない(m<RAY_MASS_MIN)
// ハロー20体(m30×20=600)を2リング(r=170/230)で追加。seed 固定で円盤初期配置は全変種同一。
const GAL_PHYSICS = { G: 1, D0: 1, kFrame: 1, q: 2, kRep: 1.0, muF: 0.02, gammaN: 0.05, kappaS: 0.05,
  Kt: 60, cLight: 60, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
  geoPN: 0, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1.2, softening: 4, timeScale: 4 };
const N_DISK = 380, N_HALO = 20, M_HALO = 30;

function haloBodies(spinMode) { // spinMode: 'none'|'aligned'|'anti'|'random'(±交互)
  const out = [];
  for (let k = 0; k < N_HALO; k++) {
    const ring = k < 10 ? 0 : 1, idx = k % 10;
    const r = ring === 0 ? 170 : 230, ang = (idx / 10) * Math.PI * 2 + (ring ? Math.PI / 10 : 0);
    // 円軌道速度は内包質量(中心600+円盤~[r/260]²·323+内側リング)の概算で与える
    const vScale = ring === 0 ? 1.11 : 1.39;
    const v = vScale * Math.sqrt(600 / r);
    const s = spinMode === 'none' ? 0 : spinMode === 'aligned' ? 2 : spinMode === 'anti' ? -2
      : (k % 2 === 0 ? 2 : -2);
    out.push({ type: 'single', m: M_HALO, x: r * Math.cos(ang), y: r * Math.sin(ang),
      vx: -v * Math.sin(ang), vy: v * Math.cos(ang), spin: s, pinned: false });
  }
  return out;
}

const VARIANTS = [
  { id: 'base', halo: null, kFrame: 1, kRep: 1 },
  { id: 'base-kF0', halo: null, kFrame: 0, kRep: 1 },
  { id: 'halo-s0', halo: 'none', kFrame: 1, kRep: 1 },
  { id: 'halo-aligned', halo: 'aligned', kFrame: 1, kRep: 1 },
  { id: 'halo-anti', halo: 'anti', kFrame: 1, kRep: 1 },
  { id: 'halo-random', halo: 'random', kFrame: 1, kRep: 1 },
  { id: 'halo-s0-kRep0', halo: 'none', kFrame: 1, kRep: 0 },
  { id: 'halo-aligned-kRep0', halo: 'aligned', kFrame: 1, kRep: 0 },
  { id: 'halo-random-kRep0', halo: 'random', kFrame: 1, kRep: 0 },
  { id: 'halo-aligned-kF0', halo: 'aligned', kFrame: 0, kRep: 1 },
];

function galPreset(v) {
  const bodies = [
    { type: 'single', m: 600, x: 0, y: 0, vx: 0, vy: 0, spin: 0.05, pinned: false },
    { type: 'disk', n: N_DISK, cx: 0, cy: 0, radius: 260, mMin: 0.5, mMax: 1.2,
      spinMin: 0, spinMax: 0, vMode: 'kepler', aroundMass: 600, vScale: 1.05, direction: 1 },
  ];
  if (v.halo) bodies.push(...haloBodies(v.halo));
  return { name: 'darkrotor-' + v.id, description: 'd', seed: 20260723,
    camera: { scale: 300 }, world: { boundary: 'none', size: 0 },
    physics: Object.assign({}, GAL_PHYSICS, { kFrame: v.kFrame, kRep: v.kRep }),
    bodies, overlays: { rotationCurve: true, tempHistogram: false, field: false } };
}

async function runVariant(page, variant) {
  return page.evaluate(({ preset, nDisk }) => {
    const s = HP.sim;
    s.build(HP.validatePreset(preset).preset);
    const iDisk0 = 1, iDisk1 = nDisk;            // 円盤粒子 = index 1..380
    const iHalo0 = nDisk + 1;                    // ハロー = index 381..(存在する場合)
    const diskStats = () => {
      let sum = 0, c = 0; const rs = [];
      const bins = new Array(10).fill(0), binC = new Array(10).fill(0);
      let vrRms = 0;
      for (let i = iDisk0; i <= iDisk1; i++) {
        const r = Math.hypot(s.x[i], s.y[i]); rs.push(r);
        const vphi = (s.x[i] * s.vy[i] - s.y[i] * s.vx[i]) / (r || 1);
        const vr = (s.x[i] * s.vx[i] + s.y[i] * s.vy[i]) / (r || 1);
        vrRms += vr * vr;
        if (r >= 156 && r <= 286) { sum += vphi; c++; }
        const b = Math.floor((r - 20) / 28); if (b >= 0 && b < 10) { bins[b] += vphi; binC[b]++; }
      }
      rs.sort((a, b) => a - b);
      return { outer: c ? +(sum / c).toFixed(4) : 0, nOuter: c,
        r50: +rs[Math.floor(rs.length * 0.5)].toFixed(1), r90: +rs[Math.floor(rs.length * 0.9)].toFixed(1),
        vrRms: +Math.sqrt(vrRms / rs.length).toFixed(4),
        curve: bins.map((b, k) => binC[k] ? +(b / binC[k]).toFixed(3) : null) };
    };
    const haloStats = () => {
      if (s.n <= iHalo0) return null;
      let rMin = 1e9, rMax = 0, rSum = 0, spinSum = 0, inside = 0, n = 0;
      for (let i = iHalo0; i < s.n; i++) {
        const r = Math.hypot(s.x[i], s.y[i]); n++;
        rMin = Math.min(rMin, r); rMax = Math.max(rMax, r); rSum += r;
        spinSum += Math.abs(s.spin[i]);
        if (r > 60 && r < 400) inside++;
      }
      return { rMean: +(rSum / n).toFixed(1), rMin: +rMin.toFixed(1), rMax: +rMax.toFixed(1),
        inside, n, spinAbsMean: +(spinSum / n).toFixed(3) };
    };
    // u_φ(r): E1′/E3 をそのまま場の点で評価(kFrame を掛けない素の決定フレーム速度)
    const uphiAt = (r) => {
      const p = s.params, eps2 = p.softening * p.softening, q = p.q;
      let acc = 0;
      for (let a = 0; a < 16; a++) {
        const th = (a / 16) * Math.PI * 2, px = r * Math.cos(th), py = r * Math.sin(th);
        let uNx = 0, uNy = 0, W = p.D0;
        for (let j = 0; j < s.n; j++) {
          const dx = px - s.x[j], dy = py - s.y[j], d2 = dx * dx + dy * dy;
          const inv = 1 / Math.sqrt(d2 + eps2), w = s.m[j] * inv, d = Math.sqrt(d2);
          W += w;
          let om = 0; const sj = s.spin[j];
          if (sj !== 0) { const tt = s.R[j] / (s.R[j] + d); om = sj * Math.pow(tt, q); }
          uNx += w * (s.vx[j] + om * (-dy)); uNy += w * (s.vy[j] + om * dx);
        }
        acc += (px * uNy - py * uNx) / r / W;
      }
      return +(acc / 16).toFixed(4);
    };
    const res = { checkpoints: [] };
    const CK = [3000, 6000, 9000, 12000];
    let done = 0;
    for (const ck of CK) {
      for (let k = done; k < ck; k++) s.step(0.016);
      done = ck;
      const entry = { step: ck, disk: diskStats(), halo: haloStats(), nan: s.hasNaN() };
      if (ck === 6000) entry.uphi = [60, 100, 140, 180, 220, 260, 300].map(r => ({ r, u: uphiAt(r) }));
      res.checkpoints.push(entry);
      if (entry.nan) break;
    }
    return res;
  }, { preset: galPreset(variant), nDisk: N_DISK });
}

// ---- 実行 ----
const t0 = Date.now();
const commit = (() => { try { return execSync('git rev-parse HEAD', { cwd: ROOT }).toString().trim(); } catch { return 'unknown'; } })();
console.log('実験A: 光子掃き出しスキャン(BH few-shot 条件)...');
const browserA = await launch();
const pageA = await newPage(browserA);
const expA = await runExpA(pageA);
await browserA.close();
console.log(`  完了 [${((Date.now() - t0) / 1000).toFixed(1)}s]`);
for (const r of expA.toy) console.log(`  spin=${r.spin}: QA捕捉 ${r.capQA}/5(順行側 ${r.capQAneg}/5・1020步 ${r.capLong}/5) ファン 順行${r.fan.capPro}/${r.fan.n} 逆行${r.fan.capRetro}/${r.fan.n}`);
for (const r of expA.lock) console.log(`  [Kt=3600] spin=${r.spin}: QA捕捉 ${r.capQA}/5 ファン 順行${r.fan.capPro} 逆行${r.fan.capRetro}`);

console.log('実験B: ダークローターハロー銀河(10変種×12000步・4並列)...');
const NW = 4;
const queue = [...VARIANTS];
const expB = {};
await Promise.all(Array.from({ length: NW }, async () => {
  const browser = await launch();
  const page = await newPage(browser);
  while (queue.length) {
    const v = queue.shift();
    const t1 = Date.now();
    expB[v.id] = await runVariant(page, v);
    const last = expB[v.id].checkpoints.at(-1);
    console.log(`  ${v.id}: 外縁v_φ ${expB[v.id].checkpoints.map(c => c.disk.outer).join(' → ')}` +
      ` r90=${last.disk.r90} NaN=${last.nan} [${((Date.now() - t1) / 1000).toFixed(0)}s]`);
  }
  await browser.close();
}));

const out = { generatedAt: new Date().toISOString(), commit, target: process.env.QA_TARGET || 'index.html',
  note: '第19便 探索実験(QAではない)。実験A=BH光子掃き出しスキャン、実験B=ダークローターハロー銀河A/B',
  params: { BH_PHYSICS, GAL_PHYSICS, N_DISK, N_HALO, M_HALO, variants: VARIANTS.map(v => v.id) },
  expA, expB };
fs.writeFileSync(path.join(OUT_DIR, 'darkrotor-results.json'), JSON.stringify(out, null, 1));
console.log(`保存: tests/out/darkrotor-results.json  合計 ${((Date.now() - t0) / 1000).toFixed(1)}s`);
