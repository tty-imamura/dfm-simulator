// 第249便c(第41報 W3): 案A(有限範囲の二極軸ポテンシャル physics.axisForce)の実測ハーネス。
//
// 対象: 🥢 axisBarStill(回転ゼロ→棒)/ 🎏 axisBarArms(回転あり→内側棒+外側2本腕)/
//       🎚️ axisBarReach(R_b を半分にした短い棒)。
//
// 測るもの:
//   ① A₂(m=2 四重極振幅)の帯平均と**半径プロファイル**、雑音床 √(π/4N)
//   ② **棒の長さ** = 中心から連続して A₂>0.5 を保つ最外帯の外縁(R_b 依存を読む主指標)
//   ③ ピッチ角 = 対数螺旋フィット(重み付き最小二乗)/ 可視窓 = A₂ 帯平均と 2×雑音床の交差。
//      **本 3 本は軸対称から始まるので、まず「超える(立ち上がり)」を読み、峰のあとに「割る」を読む**
//      (第248便c の 3 本は置いた形が減衰するだけなので「割る」しか無かった — 向きが逆である)
//   ④ **反作用の保存**: 総運動量・総角運動量(粒子+リザーバ帳簿)の残差
//   ⑤ **axisForce=0 とのビット同一性**(🎡 galaxyStd・🕶️ darkrotor を 300 步)
//   ⑥ dt/2 での安定(同じ模型時間まで走らせて A₂ と棒長を比べる)
//   ⑦ A・R_b の 2×2 掃引(A=150/300 × R_b=60/120)+ R_b=60/80/120/200 の棒長表
//   ⑧ **第250便c 追加**: E6′ 反作用の速度上限 clampRN(R=reaction。1 サブステップの |Δv|≤16)の
//      **発動回数**を、同じ模型時間 8(dt=0.016 の 500 步 / dt=0.008 の 1000 步 / dt=0.004 の 2000 步)で
//      A₂・棒長・保持率と**同時に**測る。上限を消す・値を大きくすることで解決したことにはしない —
//      「NaN なし・帳簿 P/L 保存」は形が連続力学から生成された保証にならない、という記録である
//   計測式(a2 / pitchFit)は tests/exp-4-88.mjs(= qa.mjs behavior.darkrotorLong /
//   behavior.darkrotor-pitch)から**一字も変えずに移植**した。
//
// **合否判定はしない計測スクリプトである**(3 本とも claim・regression window を持たない —
//   較正していないので窓を張らない、が第248便c から続く方針)。
//
// 実行: QA_TARGET=beta/index.html node tests/exp-w249c.mjs
// 出力: tests/out/exp-w249c.json
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

const IDS = ['axisBarStill', 'axisBarArms', 'axisBarReach'];
const have = await page.evaluate((ids) => ids.filter((id) => HP.allPresets().some((p) => p.id === id)), IDS);
if (!have.length) { console.log('SKIP: 対象に第249便c の3本がありません'); await browser.close(); process.exit(0); }

// ---- 共通の走行関数(ページ内)------------------------------------------------------------
const run = (cfg) => page.evaluate((o) => {
  const P0 = HP.allPresets().find((q) => q.id === o.id);
  const p = JSON.parse(JSON.stringify(P0));
  if (o.patchPhysics) Object.assign(p.physics, o.patchPhysics);
  if (o.axis) p.physics.axisForce = Object.assign({}, p.physics.axisForce, o.axis);
  if (o.noAxis) delete p.physics.axisForce;
  const v = HP.validatePreset(p);
  if (!v.ok) return { err: v.errors };
  const S = HP.sim; S.build(v.preset);
  const OFF = 1;
  const ctr = () => ({ x: S.x[0], y: S.y[0] });
  // --- 測定式(tests/exp-4-88.mjs から一字も変えずに移植)---
  const band = (lo, hi) => { const c = ctr(); let cr = 0, ci = 0, N = 0;
    for (let i = OFF; i < S.n; i++) {
      const dx = S.x[i] - c.x, dy = S.y[i] - c.y, r = Math.hypot(dx, dy);
      if (r >= lo && r < hi) { const th = Math.atan2(dy, dx); cr += Math.cos(2 * th); ci += Math.sin(2 * th); N++; }
    }
    return { A2: N ? Math.hypot(cr, ci) / N : 0, psi: Math.atan2(ci, cr) / 2, N,
      noise: N ? Math.sqrt(Math.PI / (4 * N)) : 0 }; };
  const BANDS = o.bands, PBW = 15;
  const a2 = () => BANDS.map(([lo, hi]) => band(lo, hi));
  // 棒の長さ = 中心から連続して A₂>0.5 を保つ最外帯(幅 20)の外縁
  const barLen = () => { let L = 0;
    for (let r = 0; r < 320; r += 20) { const b = band(r, r + 20); if (b.N < 6) continue;
      if (b.A2 > 0.5) L = r + 20; else break; } return L; };
  const prof = () => { const out = [];
    for (let r = 20; r < 300; r += 20) { const b = band(r, r + 20);
      out.push({ r: r + 10, A2: +b.A2.toFixed(3), psi: +(b.psi * 180 / Math.PI).toFixed(1), N: b.N,
        noise: +b.noise.toFixed(3) }); } return out; };
  const PB = []; for (let r = o.pb[0]; r < o.pb[1]; r += PBW) PB.push([r, r + PBW]);
  let lz0 = 0; for (let i = OFF; i < S.n; i++) lz0 += S.x[i] * S.vy[i] - S.y[i] * S.vx[i];
  const dirSign = Math.sign(lz0) || 1;
  const pitchFit = () => { const pts = [];
    for (const [lo, hi] of PB) { const b = band(lo, hi); if (b.N < 8) continue;
      pts.push({ r: Math.sqrt(lo * hi), psi: b.psi, A: b.A2, N: b.N, noise: b.noise }); }
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
      nBand: use.length, trailing: dirSign * b < 0 }; };
  const globA2 = () => band(0, 320).A2;
  const st0 = []; { const c = ctr(); for (let i = OFF; i < S.n; i++) st0.push(Math.hypot(S.x[i] - c.x, S.y[i] - c.y)); }
  const T0 = S.totals(), P0v = [T0.px + S.resPx, T0.py + S.resPy], L0 = T0.L + S.resL + S.radL;
  const series = [];
  const snap = () => { const z = a2();
    return { A2: z.map((u) => +u.A2.toFixed(4)), N: z.map((u) => u.N),
      noise: z.map((u) => +u.noise.toFixed(4)),
      avg: +(z.reduce((a, u) => a + u.A2, 0) / z.length).toFixed(4),
      glob: +globA2().toFixed(4), barLen: barLen(), pitch: pitchFit() }; };
  series.push(Object.assign({ t: 0 }, snap()));
  const BLK = o.blk, NBLK = o.nBlk, DT = o.dt || 0.016;
  for (let blk = 0; blk < NBLK; blk++) {
    for (let k = 0; k < BLK; k++) S.step(DT);
    series.push(Object.assign({ t: (blk + 1) * BLK }, snap()));
  }
  const T1 = S.totals(), P1 = [T1.px + S.resPx, T1.py + S.resPy], L1 = T1.L + S.resL + S.radL;
  let pS = 0, lS = 0;
  for (let i = 0; i < S.n; i++) { pS += Math.abs(S.m[i] * S.vx[i]) + Math.abs(S.m[i] * S.vy[i]);
    lS += Math.abs(S.m[i] * (S.x[i] * S.vy[i] - S.y[i] * S.vx[i]))
      + 0.5 * Math.abs(S.m[i]) * S.R[i] * S.R[i] * Math.abs(S.spin[i]); }
  const c = ctr(); let keep = 0, tot = 0;
  for (let i = OFF; i < S.n; i++) { const r = Math.hypot(S.x[i] - c.x, S.y[i] - c.y);
    if (st0[i - OFF] < 300) { tot++; if (r < 600) keep++; } }
  return { n: S.n, nStar: S.n - OFF, dirSign, series, prof: prof(),
    keepPct: +(100 * keep / Math.max(1, tot)).toFixed(1),
    relP: +(((Math.abs(P1[0] - P0v[0]) + Math.abs(P1[1] - P0v[1])) / Math.max(pS, 1e-9)).toExponential(2)),
    relL: +((Math.abs(L1 - L0) / Math.max(lS, 1e-9)).toExponential(2)),
    axisU: S.axisU, axisW: S.axisWorkE, spin0: S.spin[0],
    nan: S.hasNaN(), clampV: S.clampVN, clampS: S.clampSN, clampR: S.clampRN, kKind: S._kKind };
}, cfg);

const CFG = {
  axisBarStill: { id: 'axisBarStill', bands: [[40, 80], [80, 120], [120, 160], [160, 200]], pb: [40, 220], blk: 500, nBlk: 6 },
  axisBarArms:  { id: 'axisBarArms',  bands: [[60, 100], [100, 140], [140, 180], [180, 220]], pb: [40, 200], blk: 750, nBlk: 8 },
  axisBarReach: { id: 'axisBarReach', bands: [[20, 60], [60, 100], [100, 140], [140, 180]], pb: [40, 220], blk: 500, nBlk: 6 },
};

const out = { target: TARGET, generatedAt: new Date().toISOString(), runs: {}, bitIdentity: null,
  conservation: null, dtHalf: {}, sweep: [], reachTable: [], reactionCap: {} };

// ---- ① 3 本の本走行 --------------------------------------------------------------------
for (const id of have) {
  const r = await run(CFG[id]);
  out.runs[id] = r;
  const s = r.series;
  const noiseAvg = (z) => z.noise.reduce((a, u) => a + u, 0) / z.noise.length;
  // 本 3 本は**軸対称から始まる**ので、可視窓は「2×雑音床を初めて超える步(立ち上がり)」と
  // 「峰のあと再び割る步(消える)」の 2 つで読む(第248便c の 3 本は逆で、置いた形が減衰した)
  const rise = s.find((z) => z.avg > 2 * noiseAvg(z));
  const peak = s.reduce((a, z) => (z.avg > a.avg ? z : a), s[0]);
  const fall = s.filter((z) => z.t > peak.t).find((z) => z.avg <= 2 * noiseAvg(z));
  console.log(`\n== ${id} ==  n=${r.n}(恒星 ${r.nStar}) NaN=${r.nan} clampV=${r.clampV} clampS=${r.clampS} 保持=${r.keepPct}%`);
  console.log(`  |ΔP|/P=${r.relP} |ΔL|/L=${r.relL} / U_axis=${r.axisU.toFixed(2)} 外部駆動の仕事=${r.axisW.toExponential(2)} 中心 spin=${r.spin0.toFixed(4)}`);
  console.log(`  A2 全域: ` + s.map((z) => `t${z.t}:${z.glob.toFixed(3)}`).join(' '));
  console.log(`  A2 帯平均: ` + s.map((z) => `t${z.t}:${z.avg.toFixed(3)}`).join(' ') + `(雑音床 ${noiseAvg(s[0]).toFixed(3)})`);
  console.log(`  棒の長さ: ` + s.map((z) => `t${z.t}:${z.barLen}`).join(' '));
  console.log(`  ピッチ: ` + s.map((z) => `t${z.t}:${z.pitch.ok ? z.pitch.pitchDeg.toFixed(1) + (z.pitch.trailing ? '後' : '先') : '—'}`).join(' '));
  console.log(`  可視窓: 立ち上がり(2×雑音床超え)=${rise ? rise.t : 'なし'}步 / 峰=t${peak.t}(${peak.avg.toFixed(3)}) / 再び割る=${fall ? fall.t : '>' + s[s.length - 1].t}步`);
  r.visible = { rise: rise ? rise.t : null, peakT: peak.t, peakAvg: peak.avg, fall: fall ? fall.t : null };
  console.log(`  終端プロファイル: ` + r.prof.map((z) => `${z.r}:${z.A2}(${z.N})`).join(' '));
}

// ---- ② 500 步の棒長プロファイル(🥢/🎚️ の見出しの正本)---------------------------------
for (const id of ['axisBarStill', 'axisBarReach']) {
  if (!have.includes(id)) continue;
  const r = await run(Object.assign({}, CFG[id], { blk: 500, nBlk: 1 }));
  out.runs[id + '@500'] = { barLen: r.series[1].barLen, prof: r.prof, glob: r.series[1].glob };
  console.log(`\n-- ${id} @500步: 棒長 ${r.series[1].barLen} 全A2 ${r.series[1].glob}`);
  console.log(`   ` + r.prof.map((z) => `${z.r}:${z.A2}(${z.N})`).join(' '));
}

// ---- ②b 3 本が「同じ初期円盤」であること(恒星の位置・質量が 1 体ずつ同一)---------------
out.sameDisk = await page.evaluate((ids) => {
  const grab = (id) => { const v = HP.validatePreset(JSON.parse(JSON.stringify(HP.allPresets().find((q) => q.id === id))));
    const S = HP.sim; S.build(v.preset); const o = [];
    for (let i = 0; i < S.n; i++) o.push(S.x[i], S.y[i], S.m[i]); return { o, n: S.n }; };
  const a = grab(ids[0]); const rows = [];
  for (const id of ids.slice(1)) { const b = grab(id);
    rows.push({ id, same: a.n === b.n && a.o.every((z, i) => Object.is(z, b.o[i])) }); }
  return { base: ids[0], n: a.n, rows };
}, have);
console.log(`\n== 同じ初期円盤(位置・質量が 1 体ずつ同一)== 基準 ${out.sameDisk.base}(n=${out.sameDisk.n}): `
  + out.sameDisk.rows.map((r) => `${r.id}=${r.same}`).join(' / '));

// ---- ③ axisForce=0 とのビット同一性(既定サンプル 2 本・300 步)-------------------------
out.bitIdentity = await page.evaluate(() => {
  const snap = (S) => { const o = [];
    for (let i = 0; i < S.n; i++) o.push(S.x[i], S.y[i], S.vx[i], S.vy[i], S.spin[i]); return o; };
  const go = (id, patch) => { const pd = JSON.parse(JSON.stringify(HP.allPresets().find((q) => q.id === id)));
    if (patch) Object.assign(pd.physics, patch);
    const v = HP.validatePreset(pd); const S = HP.sim; S.build(v.preset);
    for (let k = 0; k < 300; k++) S.step(0.016);
    return { s: snap(S), sig: JSON.stringify(v.preset.physics), warn: (v.warnings || []).length,
      has: S.hasAxisForce }; };
  const rows = [];
  for (const id of ['galaxyStd', 'darkrotor']) {
    const a = go(id, null), b = go(id, { axisForce: { A: 0, Rb: 50, rc: 2 } });
    rows.push({ id, bitSame: a.s.every((z, i) => Object.is(z, b.s[i])), sigSame: a.sig === b.sig,
      warn: b.warn, hasA: a.has, hasB: b.has });
  }
  return rows;
});
console.log(`\n== axisForce=0 のビット同一性(300 步)==`);
for (const r of out.bitIdentity) console.log(`  ${r.id}: bit同一=${r.bitSame} 署名同一=${r.sigSame} 警告=${r.warn} hasAxisForce=${r.hasA}/${r.hasB}`);

// ---- ④ 反作用の保存(玩具・重力なし・軸力だけ)------------------------------------------
out.conservation = await page.evaluate(() => {
  const mk = (carry, af) => { const ph = { G: 0, D0: 1, kFrame: 0, q: 2, kRep: 0, muF: 0, gammaN: 0,
      kappaS: 0, kappaT: 0, cLight: 300, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
      geoPN: 0, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 2, timeScale: 1, axisForce: af };
    if (carry) ph.stateCarry = 'double';
    return { id: 'axcons', name: 'axcons', emoji: 'x', description: '軸力の保存検査', camera: { scale: 1 },
      world: { boundary: 'none', size: 0 }, seed: 1, physics: ph,
      bodies: [{ type: 'single', m: 1000, x: 0, y: 0, vx: 0, vy: 0, spin: 0.5, pinned: false, radius: 10 },
        { type: 'single', m: 1, x: 40, y: 20, vx: 0.1, vy: -0.2, spin: 0, pinned: false, radius: 1 },
        { type: 'single', m: 2, x: -70, y: 35, vx: -0.05, vy: 0.15, spin: 0, pinned: false, radius: 1 },
        { type: 'single', m: 1.5, x: 15, y: -90, vx: 0.2, vy: 0.05, spin: 0, pinned: false, radius: 1 }] }; };
  const go = (carry, af, integ) => { const pd = mk(carry, af);
    if (integ) pd.integrator = integ;
    const v = HP.validatePreset(pd); if (!v.ok) return { err: v.errors };
    const S = HP.sim; S.build(v.preset);
    const T0 = S.totals(), P0 = [T0.px + S.resPx, T0.py + S.resPy], L0 = T0.L + S.resL;
    for (let k = 0; k < 400; k++) S.step(0.01);
    const T1 = S.totals(), P1 = [T1.px + S.resPx, T1.py + S.resPy], L1 = T1.L + S.resL;
    let pS = 0, lS = 0;
    for (let i = 0; i < S.n; i++) { pS += Math.abs(S.m[i] * S.vx[i]) + Math.abs(S.m[i] * S.vy[i]);
      lS += Math.abs(S.m[i] * (S.x[i] * S.vy[i] - S.y[i] * S.vx[i]))
        + 0.5 * Math.abs(S.m[i]) * S.R[i] * S.R[i] * Math.abs(S.spin[i]); }
    return { relP: (Math.abs(P1[0] - P0[0]) + Math.abs(P1[1] - P0[1])) / pS,
      relL: Math.abs(L1 - L0) / lS, axisU: S.axisU, axisW: S.axisWorkE, spin: S.spin[0] }; };
  // 有限差分との一致(純関数 HP.dfmAxisPotential)
  const cfg = { A: 3.5, Rb: 120, rc: 7, phi: 0.4 }; let gmax = 0;
  for (const [dx, dy] of [[10, 3], [-40, 60], [5, -90], [130, 20], [0.5, 0.2]]) {
    const h = 1e-4, f = (a, b) => HP.dfmAxisPotential(a, b, cfg).U;
    const gx = -(f(dx + h, dy) - f(dx - h, dy)) / (2 * h), gy = -(f(dx, dy + h) - f(dx, dy - h)) / (2 * h);
    const q = HP.dfmAxisPotential(dx, dy, cfg);
    gmax = Math.max(gmax, Math.abs(gx - q.ax), Math.abs(gy - q.ay));
  }
  return { gradMaxDiff: gmax,
    fixed: go(true, { A: 200, Rb: 120, rc: 5, axis: 0.3 }),
    legacy: go(false, { A: 200, Rb: 120, rc: 5, axis: 0.3 }),
    driven: go(true, { A: 200, Rb: 120, rc: 5, axis: 0.3, omegaAxis: 0.05 }),
    leap: go(true, { A: 200, Rb: 120, rc: 5, axis: 0.3 }, 'leapfrog') };
});
const cn = out.conservation;
console.log(`\n== 反作用の保存(玩具・G=0・軸力だけ・400 步)==`);
console.log(`  有限差分との最大差 ${cn.gradMaxDiff.toExponential(2)}`);
for (const k of ['fixed', 'legacy', 'driven', 'leap']) {
  const z = cn[k]; if (!z || z.err) { console.log(`  ${k}: ERR`, z && z.err); continue; }
  console.log(`  ${k}: |ΔP|/P=${z.relP.toExponential(2)} |ΔL|/L=${z.relL.toExponential(2)} U_axis=${z.axisU.toFixed(4)} 外部仕事=${z.axisW.toExponential(2)}`);
}

// ---- ⑤ dt/2 の安定(同じ模型時間まで)---------------------------------------------------
for (const id of have) {
  const base = CFG[id];
  const a = await run(Object.assign({}, base, { blk: base.blk, nBlk: 2, dt: 0.016 }));
  const b = await run(Object.assign({}, base, { blk: base.blk * 2, nBlk: 2, dt: 0.008 }));
  const ea = a.series[a.series.length - 1], eb = b.series[b.series.length - 1];
  out.dtHalf[id] = { dt016: { avg: ea.avg, glob: ea.glob, barLen: ea.barLen },
    dt008: { avg: eb.avg, glob: eb.glob, barLen: eb.barLen },
    relL016: a.relL, relL008: b.relL, nan: a.nan || b.nan };
  console.log(`  dt/2 ${id}: A2帯 ${ea.avg}→${eb.avg} / 全A2 ${ea.glob}→${eb.glob} / 棒長 ${ea.barLen}→${eb.barLen}`);
}

// ---- ⑥ A・R_b の 2×2 掃引(🥢 の構成で)-------------------------------------------------
if (have.includes('axisBarStill')) {
  console.log(`\n== A×R_b 2×2 掃引(🥢 の円盤・1000 步)==`);
  for (const A of [150, 300]) for (const Rb of [60, 120]) {
    const r = await run(Object.assign({}, CFG.axisBarStill, { blk: 500, nBlk: 2, axis: { A, Rb } }));
    const e = r.series[r.series.length - 1], m = r.series[1];
    out.sweep.push({ A, Rb, barLen500: m.barLen, barLen1000: e.barLen, glob1000: e.glob,
      keepPct: r.keepPct, relL: r.relL });
    console.log(`  A=${A} R_b=${Rb}: 棒長 500步 ${m.barLen} / 1000步 ${e.barLen} 全A2 ${e.glob.toFixed(3)} 保持 ${r.keepPct}% |ΔL|/L=${r.relL}`);
  }
  console.log(`\n== 棒の長さ vs R_b(A=300・500 步・同じ円盤)==`);
  for (const Rb of [60, 80, 120, 200]) {
    const r = await run(Object.assign({}, CFG.axisBarStill, { blk: 500, nBlk: 1, axis: { A: 300, Rb } }));
    out.reachTable.push({ Rb, barLen: r.series[1].barLen, glob: r.series[1].glob, keepPct: r.keepPct });
    console.log(`  R_b=${Rb}: 棒長 ${r.series[1].barLen}(L/R_b=${(r.series[1].barLen / Rb).toFixed(2)}) 全A2 ${r.series[1].glob.toFixed(3)} 保持 ${r.keepPct}%`);
  }
}

// ---- ⑦ 交差対照: 「強さ A は回転の有無で桁が違う」(本便の負の発見の正本)------------------
out.cross = {};
if (have.includes('axisBarArms')) {
  const mid = await run(Object.assign({}, CFG.axisBarArms, { blk: 3000, nBlk: 1 }));
  out.cross.armsAt3000 = { avg: mid.series[1].avg, glob: mid.series[1].glob,
    pitch: mid.series[1].pitch, prof: mid.prof, keepPct: mid.keepPct, axisW: mid.axisW };
  console.log(`\n== 🎏 の 3000 步(峰)==  A2帯 ${mid.series[1].avg} 全A2 ${mid.series[1].glob} ` +
    `ピッチ ${mid.series[1].pitch.ok ? mid.series[1].pitch.pitchDeg.toFixed(1) + (mid.series[1].pitch.trailing ? '後行' : '先行') : '—'} 保持 ${mid.keepPct}%`);
  console.log(`   ` + mid.prof.map((z) => `${z.r}:${z.A2}/ψ${z.psi}(${z.N})`).join(' '));
  const strong = await run(Object.assign({}, CFG.axisBarArms, { blk: 3000, nBlk: 1, axis: { A: 300 } }));
  out.cross.armsStrongA = { avg: strong.series[1].avg, glob: strong.series[1].glob, keepPct: strong.keepPct };
  console.log(`   回転円盤に A=300(🥢 の強さ)を入れる: A2帯 ${strong.series[1].avg} 保持 ${strong.keepPct}%(A=15 は ${mid.keepPct}%)`);
}
if (have.includes('axisBarStill')) {
  const weak = await run(Object.assign({}, CFG.axisBarStill, { blk: 3000, nBlk: 1, axis: { A: 15 } }));
  const base = await run(Object.assign({}, CFG.axisBarStill, { blk: 3000, nBlk: 1 }));
  out.cross.stillWeakA = { avg: weak.series[1].avg, glob: weak.series[1].glob, barLen: weak.series[1].barLen,
    keepPct: weak.keepPct, baseAvg: base.series[1].avg, baseBarLen: base.series[1].barLen };
  console.log(`   回転ゼロの円盤に A=15(🎏 の強さ)を入れる: A2帯 ${weak.series[1].avg}・棒長 ${weak.series[1].barLen}(A=300 は ${base.series[1].avg}・${base.series[1].barLen})`);
}

// ---- ⑧ 第250便c: E6′ 反作用の速度上限 clampRN の発動(同じ模型時間 8 で dt / dt/2 / dt/4)------
console.log(`\n== 反作用の速度上限 clampRN の発動(模型時間 8・|Δv|≤16)==`);
for (const id of have) {
  const rows = [];
  for (const [dt, blk] of [[0.016, 500], [0.008, 1000], [0.004, 2000]]) {
    const r = await run(Object.assign({}, CFG[id], { blk, nBlk: 1, dt }));
    const e = r.series[1];
    rows.push({ dt, steps: blk, tModel: +(dt * blk).toFixed(3), clampR: r.clampR, clampV: r.clampV,
      clampS: r.clampS, a2band: e.avg, glob: e.glob, barLen: e.barLen, keepPct: r.keepPct,
      relP: r.relP, relL: r.relL, nan: r.nan });
    console.log(`  ${id} dt=${dt}(${blk} 步・t=${(dt * blk).toFixed(2)}): clampRN=${r.clampR}`
      + ` A2帯=${e.avg} 全A2=${e.glob} 棒長=${e.barLen} 保持=${r.keepPct}%`
      + ` |ΔP|/P=${r.relP} |ΔL|/L=${r.relL} NaN=${r.nan}`);
  }
  out.reactionCap[id] = rows;
}

fs.writeFileSync(path.join(OUT_DIR, 'exp-w249c.json'), JSON.stringify(out, null, 2));
console.log('\n→ tests/out/exp-w249c.json');
await browser.close();
