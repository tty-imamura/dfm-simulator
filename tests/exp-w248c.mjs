// 第248便c(第40報 W3): 銀河形態の原理サンプル3本(🍥 galaxyFieldLines / 🪁 galaxyTiltPrecess /
// 🍢 galaxyBarRotors)の実測ハーネス。
//
// 主題: 3本とも「腕は**配置則で置いた**」サンプルなので、測るのは「腕が生えるか」ではなく
//   **置いた形がどれだけ持つか**である。
//     ① 腕の可視窓  : A2 帯平均(m=2 四重極振幅)の時間減衰と、ノイズ床 √(π/4N) を割る步数
//     ② ピッチ角    : 対数螺旋フィット(重み付き最小二乗)で配置値 i を回収できるか・巻き込み
//     ③ 歳差(🪁)   : コア J の方位 atan2(J_y,J_x) の回転と J_z=0(=面内引きずりが消える)
//     ④ 棒の保持(🍢): 棒の内側/外側ローターの位置角差(=棒の曲がり)が 5° を超える步数
//   計測式(a2 / pitchFit)は tests/exp-4-88.mjs(= qa.mjs behavior.darkrotorLong /
//   behavior.darkrotor-pitch)から**一字も変えずに移植**した。
//
// **合否判定はしない計測スクリプトである**(本3本に claim・regression window は無い —
//   較正していないので窓を張らない、が第248便c の方針)。
//
// 実行: QA_TARGET=beta/index.html node tests/exp-w248c.mjs
//       W248C_OMEGA_SCAN=1 を付けると 🍢 の棒の剛体回転 Ω を走査する(内蔵値の決め直し用)
// 出力: tests/out/exp-w248c.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + (TARGET.startsWith('/') ? TARGET : path.join(ROOT, TARGET));
const OUT_DIR = path.join(ROOT, 'tests', 'out');
fs.mkdirSync(OUT_DIR, { recursive: true });
const SCAN = process.env.W248C_OMEGA_SCAN === '1';

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

const have = await page.evaluate(() => ['galaxyFieldLines', 'galaxyTiltPrecess', 'galaxyBarRotors']
  .filter((id) => HP.allPresets().some((p) => p.id === id)));
if (!have.length) { console.log('SKIP: 対象に第248便c の3本がありません'); await browser.close(); process.exit(0); }

// ---- 共通の走行関数(ページ内)------------------------------------------------------------
const run = (cfg) => page.evaluate((o) => {
  const P0 = HP.allPresets().find((q) => q.id === o.id);
  const p = JSON.parse(JSON.stringify(P0));
  if (o.patchPhysics) Object.assign(p.physics, o.patchPhysics);
  if (o.omega !== undefined) {   // 🍢 の棒だけ剛体回転 Ω を差し替える
    for (const b of p.bodies) if (b.type === 'single' && b.radius === 18) b.vy = o.omega * b.x;
  }
  if (o.barCirc) {   // 各ローターを「その半径での円運動速度」で回す(剛体回転ではない対照)
    const rot = p.bodies.filter((b) => b.type === 'single' && b.radius === 18);
    const G = p.physics.G, e2 = p.physics.softening * p.physics.softening;
    for (const b of rot) {
      if (b.x === 0) { b.vy = 0; continue; }
      let ar = 0;
      for (const c of rot) { if (c === b) continue; const dx = c.x - b.x, d2 = dx * dx;
        ar += G * c.m * dx / Math.pow(d2 + e2, 1.5); }
      const inward = -ar * Math.sign(b.x);
      b.vy = (inward > 0 ? Math.sqrt(inward * Math.abs(b.x)) : 0) * Math.sign(b.x) * (o.barCirc || 1);
    }
  }
  if (o.coreTilt !== undefined && p.bodies[0].core) p.bodies[0].core.tilt = o.coreTilt;
  const v = HP.validatePreset(p);
  if (!v.ok) return { err: v.errors };
  const S = HP.sim; S.build(v.preset);
  const OFF = o.off, BANDS = o.bands;
  // 中心の基準点(単一 pinned 中心はその粒子、棒は棒 5 体の重心)
  const ctr = () => {
    if (!o.barIdx) return { x: S.x[0], y: S.y[0] };
    let m = 0, cx = 0, cy = 0;
    for (const k of o.barIdx) { const a = Math.abs(S.m[k]); m += a; cx += a * S.x[k]; cy += a * S.y[k]; }
    return { x: cx / m, y: cy / m };
  };
  // --- 測定式(tests/exp-4-88.mjs から一字も変えずに移植)---
  const a2 = () => { const c = ctr(); return BANDS.map(([lo, hi]) => {
    let cr = 0, ci = 0, N = 0;
    for (let i = OFF; i < S.n; i++) {
      const dx = S.x[i] - c.x, dy = S.y[i] - c.y, r = Math.hypot(dx, dy);
      if (r >= lo && r < hi) { const th = Math.atan2(dy, dx); cr += Math.cos(2 * th); ci += Math.sin(2 * th); N++; }
    }
    return { A2: N ? Math.hypot(cr, ci) / N : 0, N, noise: N ? Math.sqrt(Math.PI / (4 * N)) : 0 };
  }); };
  const PB = []; for (let r = o.pb[0]; r < o.pb[1]; r += 15) PB.push([r, r + 15]);
  const pitchFit = (dirSign) => {
    const c = ctr(); const pts = [];
    for (const [lo, hi] of PB) {
      let cr = 0, ci = 0, N = 0;
      for (let i = OFF; i < S.n; i++) {
        const dx = S.x[i] - c.x, dy = S.y[i] - c.y, r = Math.hypot(dx, dy);
        if (r >= lo && r < hi) { const th = Math.atan2(dy, dx); cr += Math.cos(2 * th); ci += Math.sin(2 * th); N++; }
      }
      if (N < 8) continue;
      const A = Math.hypot(cr, ci) / N, noise = Math.sqrt(Math.PI / (4 * N));
      pts.push({ r: Math.sqrt(lo * hi), psi: Math.atan2(ci, cr) / 2, A, N, noise });
    }
    const use = pts.filter((z) => z.A > 2 * z.noise);
    if (use.length < 4) return { ok: false, nBand: use.length };
    let prev = use[0].psi; const xs = [], ys = [], ws = [];
    for (let k = 0; k < use.length; k++) {
      let w2 = use[k].psi; if (k > 0) w2 += Math.round((prev - w2) / Math.PI) * Math.PI; prev = w2;
      xs.push(Math.log(use[k].r)); ys.push(w2); ws.push(use[k].N * use[k].A);
    }
    let Sw = 0, Sx = 0, Sy = 0, Sxx = 0, Sxy = 0;
    for (let k = 0; k < xs.length; k++) { const w = ws[k];
      Sw += w; Sx += w * xs[k]; Sy += w * ys[k]; Sxx += w * xs[k] * xs[k]; Sxy += w * xs[k] * ys[k]; }
    const den = Sw * Sxx - Sx * Sx;
    if (!(Math.abs(den) > 1e-12)) return { ok: false, nBand: use.length };
    const b = (Sw * Sxy - Sx * Sy) / den;
    return { ok: true, slope: b, pitchDeg: Math.atan(1 / Math.abs(b)) * 180 / Math.PI,
      nBand: use.length, trailing: dirSign * b < 0 };
  };
  // 棒の曲がり(内側 ±60 と外側 ±120 の位置角差。±π の折り返しを取る)
  const wrap = (a) => { while (a > Math.PI / 2) a -= Math.PI; while (a < -Math.PI / 2) a += Math.PI; return a; };
  const barBend = () => {
    if (!o.barIdx) return null;
    const c = ctr(); const ang = [], rad = [];
    for (const k of o.barIdx) { const dx = S.x[k] - c.x, dy = S.y[k] - c.y;
      ang.push(Math.atan2(dy, dx)); rad.push(Math.hypot(dx, dy)); }
    // barIdx = [中心, +60, -60, +120, -120]
    const bendA = Math.abs(wrap(ang[3] - ang[1])), bendB = Math.abs(wrap(ang[4] - ang[2]));
    const bendC = Math.abs(wrap(ang[3] - ang[4]));   // 両端どうしの直線性
    return { bend: Math.max(bendA, bendB, bendC) * 180 / Math.PI,
      rIn: +((rad[1] + rad[2]) / 2).toFixed(2), rOut: +((rad[3] + rad[4]) / 2).toFixed(2) };
  };
  const coreState = () => {
    if (!S.coreJx) return null;
    const jx = S.coreJx[0], jy = S.coreJy[0], jz = S.coreJ[0];
    return { az: Math.atan2(jy, jx) * 180 / Math.PI, jperp: Math.hypot(jx, jy), jz,
      lSw: S.lSw ? S.lSw[0] : null };
  };
  let lz0 = 0; for (let i = OFF; i < S.n; i++) lz0 += S.x[i] * S.vy[i] - S.y[i] * S.vx[i];
  const dirSign = Math.sign(lz0) || 1;
  const st0 = []; { const c = ctr(); for (let i = OFF; i < S.n; i++) st0.push(Math.hypot(S.x[i] - c.x, S.y[i] - c.y)); }
  const T0 = S.totals(), L0 = T0.L + S.resL + S.radL;
  const series = [];
  const rec0 = a2(), nb0 = rec0.map((z) => z.N);
  series.push({ t: 0, A2: rec0.map((z) => +z.A2.toFixed(4)), N: nb0,
    noise: rec0.map((z) => +z.noise.toFixed(4)),
    avg: +(rec0.reduce((a, z) => a + z.A2, 0) / rec0.length).toFixed(4),
    pitch: pitchFit(dirSign), bar: barBend(), core: coreState() });
  const BLK = o.blk || 250, NBLK = o.nBlk || 48;
  let maxSpin = 0;
  for (let blk = 0; blk < NBLK; blk++) {
    for (let k = 0; k < BLK; k++) S.step(0.016);
    for (let i = 0; i < S.n; i++) maxSpin = Math.max(maxSpin, Math.abs(S.spin[i]));
    const z = a2();
    series.push({ t: (blk + 1) * BLK, A2: z.map((u) => +u.A2.toFixed(4)), N: z.map((u) => u.N),
      noise: z.map((u) => +u.noise.toFixed(4)),
      avg: +(z.reduce((a, u) => a + u.A2, 0) / z.length).toFixed(4),
      pitch: pitchFit(dirSign), bar: barBend(), core: coreState() });
  }
  const c = ctr();
  let keep = 0, tot = 0;
  for (let i = OFF; i < S.n; i++) { const r = Math.hypot(S.x[i] - c.x, S.y[i] - c.y);
    if (st0[i - OFF] < o.keepIn) { tot++; if (r < o.keepOut) keep++; } }
  const T1 = S.totals(), L1 = T1.L + S.resL + S.radL;
  let lScale = 0;
  for (let i = 0; i < S.n; i++) lScale += Math.abs(S.m[i] * (S.x[i] * S.vy[i] - S.y[i] * S.vx[i]))
    + 0.5 * Math.abs(S.m[i]) * S.R[i] * S.R[i] * Math.abs(S.spin[i]);
  return { n: S.n, nStar: S.n - OFF, dirSign, series,
    keepPct: +(100 * keep / Math.max(1, tot)).toFixed(1), maxSpin: +maxSpin.toFixed(3),
    relL: +(Math.abs(L1 - L0) / Math.max(lScale, 1e-9)).toExponential(2),
    nan: S.hasNaN(), clampV: S.clampVN, clampR: S.clampRN || 0, kKind: S._kKind };
}, cfg);

const CFG = {
  galaxyFieldLines: { id: 'galaxyFieldLines', off: 1, bands: [[80, 120], [120, 160], [160, 200], [200, 240]],
    pb: [80, 260], keepIn: 350, keepOut: 500 },
  galaxyTiltPrecess: { id: 'galaxyTiltPrecess', off: 1, bands: [[80, 120], [120, 160], [160, 200], [200, 240]],
    pb: [80, 260], keepIn: 350, keepOut: 500 },
  galaxyBarRotors: { id: 'galaxyBarRotors', off: 5, bands: [[140, 180], [180, 220], [220, 260], [260, 300]],
    pb: [140, 300], keepIn: 400, keepOut: 600, barIdx: [0, 1, 2, 3, 4] },
};

const out = { target: TARGET, generatedAt: new Date().toISOString(), runs: {}, scan: null };

// ---- 🍢 の Ω 走査(内蔵値の決め直し用)------------------------------------------------------
if (SCAN) {
  const rows = [];
  const cases = [{ omega: 0.0200 }, { omega: 0.0224 }, { omega: 0.0240 }, { omega: 0.0255 },
    { omega: 0.0270 }, { omega: 0.0285 }, { omega: 0.0300 }, { omega: 0.0314 },
    { barCirc: 1 }, { barCirc: 0.95 }, { barCirc: 1.05 }];
  for (const cs of cases) {
    const om = cs.omega !== undefined ? cs.omega : ('circ×' + cs.barCirc);
    const r = await run({ ...CFG.galaxyBarRotors, ...cs, blk: 250, nBlk: 40 });
    const first = r.series.find((z) => z.bar && z.bar.bend > 5);
    rows.push({ omega: om, bendWin: first ? first.t : '>' + r.series[r.series.length - 1].t,
      bendEnd: +r.series[r.series.length - 1].bar.bend.toFixed(2),
      rIn: r.series[r.series.length - 1].bar.rIn, rOut: r.series[r.series.length - 1].bar.rOut,
      armAvgEnd: r.series[r.series.length - 1].avg, keep: r.keepPct, nan: r.nan });
    console.log(`Ω=${om}: 曲がり5°超=${rows[rows.length - 1].bendWin}步 終端曲がり${rows[rows.length - 1].bendEnd}° ` +
      `r_in ${rows[rows.length - 1].rIn} r_out ${rows[rows.length - 1].rOut} A2末${rows[rows.length - 1].armAvgEnd} 保持${r.keepPct}%`);
  }
  out.scan = rows;
}

// ---- 本走行 --------------------------------------------------------------------------------
for (const id of (process.env.W248C_SCAN_ONLY === '1' ? [] : have)) {
  const r = await run({ ...CFG[id], blk: 250, nBlk: 48 });
  out.runs[id] = r;
  const s = r.series;
  const noiseAvg = (z) => z.noise.reduce((a, u) => a + u, 0) / z.noise.length;
  const first = s.find((z) => z.avg <= 2 * noiseAvg(z));
  const half = s.find((z) => z.avg <= 0.5 * s[0].avg);
  console.log(`\n== ${id} ==  n=${r.n}(恒星 ${r.nStar}) kKind=${r.kKind} NaN=${r.nan} clampV=${r.clampV} |ΔL|/L=${r.relL} 保持=${r.keepPct}%`);
  console.log(`  A2帯平均: ` + s.filter((z) => z.t % 1000 === 0).map((z) => `t${z.t}:${z.avg.toFixed(3)}`).join(' '));
  console.log(`  ノイズ床(平均): ` + s.filter((z) => z.t % 3000 === 0).map((z) => `t${z.t}:${noiseAvg(z).toFixed(3)}`).join(' '));
  console.log(`  半減=${half ? half.t : '>' + s[s.length - 1].t}步 / 2×ノイズ床割れ=${first ? first.t : '>' + s[s.length - 1].t}步`);
  console.log(`  ピッチ: ` + s.filter((z) => z.t % 1500 === 0).map((z) => `t${z.t}:${z.pitch.ok ? z.pitch.pitchDeg.toFixed(1) + (z.pitch.trailing ? '後行' : '先行') : '—'}`).join(' '));
  if (s[0].core) console.log(`  コア: ` + s.filter((z) => z.t % 3000 === 0).map((z) => `t${z.t}:方位${z.core.az.toFixed(1)}° |J⊥|${z.core.jperp.toExponential(3)} Jz${z.core.jz.toExponential(2)} 減光${z.core.lSw === null ? '—' : z.core.lSw.toFixed(3)}`).join(' / '));
  if (s[0].bar) {
    const b5 = s.find((z) => z.bar.bend > 5), b15 = s.find((z) => z.bar.bend > 15);
    console.log(`  棒: 曲がり ` + s.filter((z) => z.t % 2000 === 0).map((z) => `t${z.t}:${z.bar.bend.toFixed(2)}°(r_in ${z.bar.rIn}/r_out ${z.bar.rOut})`).join(' '));
    console.log(`      5°超=${b5 ? b5.t : '>' + s[s.length - 1].t}步 / 15°超=${b15 ? b15.t : '>' + s[s.length - 1].t}步`);
  }
}

fs.writeFileSync(path.join(OUT_DIR, 'exp-w248c.json'), JSON.stringify(out, null, 2));
console.log('\n→ tests/out/exp-w248c.json');
await browser.close();
