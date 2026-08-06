// 第82便 実験 4-83(トラックA・台帳「光学輸送拡張」): 体積吸収・波長依存(赤化)・散乱の実測
//
// 対象: beta/index.html の光学輸送(観測層のみ)
//   dτ_ref = kAbs·ρ_local·ds  /  τ(λ) = τ_ref·(λ_ref/λ)^pAbs  /  T(λ)=e^{−τ(λ)}
//   ρ_local(r) = Σ_j m_j·(3/(π a_j²))·(1−(d_j/a_j)²)²  (d_j<a_j・a_j=K·max(R_j,ε)・K=ABS_SUPPORT_K)
//
// 測るもの:
//   A) 透過率の波長依存 — 🌆reddening の光線束 24 本の τ_ref と青(450)/赤(650)の透過率
//   B) pAbs 掃引(0 / 2 / 4)— グレー吸収 → レイリー類似までの赤化の強さ
//   C) kAbs 用量反応(0 / ×0.5 / ×1 / ×2)— τ_ref が kAbs に厳密比例(積分の線形性)
//   D) fScat は描画層限定 — τ・力学は 1 bit 不変、画面だけが変わる(スクリーンショット差分)
//   E) 力学 bit 不変 — kAbs/fScat の on/off で 2000 步後の x,y,vx,vy,spin,τ が bit 一致
//   F) 局所質量核の台係数 K の較正 — K=2..6 で τ(y) 断面を独立再実装で積分し、
//      「一様円盤の解析柱密度からのずれ(粒状性)」と「台のはみ出し(光学半径の膨張)」を測る
//
// 出力: tests/out/exp-4-83.json
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
page.on('console', (m) => { if (m.type() === 'error') console.log('CONSOLEERR:', m.text()); });
await page.goto(INDEX);
await page.waitForFunction(() => window.HP && HP.sim);

// 共通の光線条件(QA・claims と同一): x=-310 から +x 方向・dl=2.7・400 步
const RAY = { x0: -310, dl: 2.7, steps: 400, lamRef: 550, blue: 450, red: 650 };

const out = { meta: { exp: '4-83', wave: 82, track: 'A', target: TARGET, date: '2026-08-06',
  ray: RAY, note: '光学輸送(体積吸収・赤化・散乱)は観測層のみ — 力学・時計・既存の減光は不変' }, cases: {} };

// ---- A) 透過率の波長依存(🌆reddening の光線束) ----
out.cases.profile = await page.evaluate((R) => {
  HP.loadPreset('reddening', false);
  const S = HP.sim, P = HP.allPresets().find((p) => p.id === 'reddening');
  const n = P.rays.n, spread = P.rays.spread, cs = P.camera.scale;
  const rows = [];
  for (let i = 0; i < n; i++) {
    const y = ((i + 0.5) / n - 0.5) * 2 * spread * cs;
    const t = HP.traceRay(S, R.x0, y, 1, 0, R.dl, R.steps, null).tau;
    rows.push({ y: +y.toFixed(2), tau: t,
      Tblue: HP.opticsTransmit(t, R.blue, R.lamRef), Tred: HP.opticsTransmit(t, R.red, R.lamRef) });
  }
  const center = HP.traceRay(S, R.x0, 0, 1, 0, R.dl, R.steps, null).tau;
  const clear = HP.traceRay(S, R.x0, 200, 1, 0, R.dl, R.steps, null).tau;
  return { n: S.n, kAbs: S.params.kAbs, pAbs: HP.ABS_DEFAULT.pAbs, fScat: S.params.fScat,
    supportK: HP.ABS_SUPPORT_K, lamRef: HP.ABS_LAMBDA_REF, rows,
    tauCloud: center, tauClear: clear,
    TblueCloud: HP.opticsTransmit(center, R.blue, R.lamRef),
    TredCloud: HP.opticsTransmit(center, R.red, R.lamRef),
    ratioCloud: HP.opticsTransmit(center, R.blue, R.lamRef) / HP.opticsTransmit(center, R.red, R.lamRef) };
}, RAY);
{
  const c = out.cases.profile;
  console.log(`A) 🌆reddening: n=${c.n} kAbs=${c.kAbs} pAbs=${c.pAbs} fScat=${c.fScat} K=${c.supportK} λ_ref=${c.lamRef}nm`);
  console.log(`   雲中心(y=0): τ_ref=${c.tauCloud.toFixed(4)} T(450)=${c.TblueCloud.toFixed(4)} `
    + `T(650)=${c.TredCloud.toFixed(4)} 青/赤=${c.ratioCloud.toFixed(4)}`);
  console.log(`   雲の脇(y=200): τ_ref=${c.tauClear.toFixed(6)}(コンパクト台の外 = 厳密0)`);
}

// ---- B) pAbs 掃引 / C) kAbs 用量反応 ----
out.cases.sweep = await page.evaluate((R) => {
  const base = JSON.parse(JSON.stringify(HP.allPresets().find((p) => p.id === 'reddening')));
  const k0 = base.physics.kAbs;
  const run = (kAbs, pAbs, fScat) => {
    const p = JSON.parse(JSON.stringify(base));
    p.physics.kAbs = kAbs;
    if (pAbs !== undefined) p.physics.pAbs = pAbs; else delete p.physics.pAbs;
    if (fScat !== undefined) p.physics.fScat = fScat;
    HP.sim.build(HP.validatePreset(p).preset);
    const S = HP.sim;
    const t = HP.traceRay(S, R.x0, 0, 1, 0, R.dl, R.steps, null).tau;
    const b = HP.opticsTransmit(t, R.blue, R.lamRef), rr = HP.opticsTransmit(t, R.red, R.lamRef);
    return { kAbs, pAbs: (pAbs === undefined ? HP.ABS_DEFAULT.pAbs : pAbs), tau: t,
      Tblue: b, Tred: rr, ratio: rr > 0 ? b / rr : 0 };
  };
  return { k0, pAbs: [0, 2, 4].map((p) => run(k0, p)),
    kAbs: [0, k0 / 2, k0, k0 * 2].map((k) => run(k, undefined)) };
}, RAY);
{
  const s = out.cases.sweep;
  console.log('B) pAbs 掃引(雲中心・kAbs=' + s.k0 + '):');
  for (const r of s.pAbs) console.log(`   pAbs=${r.pAbs}: T(450)=${r.Tblue.toFixed(4)} T(650)=${r.Tred.toFixed(4)} 青/赤=${r.ratio.toFixed(4)}`);
  console.log('C) kAbs 用量反応(雲中心・pAbs=4):');
  const t1 = s.kAbs[2].tau / s.kAbs[2].kAbs;
  for (const r of s.kAbs) console.log(`   kAbs=${r.kAbs}: τ_ref=${r.tau.toFixed(4)} (τ/kAbs=${r.kAbs ? (r.tau / r.kAbs).toFixed(6) : '—'}) 線形残差=${r.kAbs ? (r.tau / r.kAbs - t1).toExponential(1) : '0'}`);
}

// ---- E) 力学 bit 不変(kAbs/fScat の on/off) ----
out.cases.invariant = await page.evaluate(() => {
  const base = JSON.parse(JSON.stringify(HP.allPresets().find((p) => p.id === 'reddening')));
  const run = (kAbs, fScat) => {
    const p = JSON.parse(JSON.stringify(base));
    if (kAbs === null) { delete p.physics.kAbs; delete p.physics.fScat; }
    else { p.physics.kAbs = kAbs; p.physics.fScat = fScat; }
    HP.sim.build(HP.validatePreset(p).preset);
    const S = HP.sim;
    for (let k = 0; k < 2000; k++) S.step(0.016);
    return { x: [...S.x], y: [...S.y], vx: [...S.vx], vy: [...S.vy], sp: [...S.spin], tau: [...S.tau],
      n: S.n, nan: S.hasNaN(), kAbs: S.params.kAbs === undefined ? null : S.params.kAbs };
  };
  const diff = (a, b) => { let d = 0;
    for (let i = 0; i < a.n; i++) for (const k of ['x', 'y', 'vx', 'vy', 'sp', 'tau']) if (a[k][i] !== b[k][i]) d++;
    return d; };
  const off = run(null), on = run(3.4, 0.3), onNoScat = run(3.4, 0);
  return { n: off.n, nan: off.nan || on.nan, dOn: diff(off, on), dNoScat: diff(off, onNoScat),
    kAbsOff: off.kAbs, kAbsOn: on.kAbs };
})
;
console.log(`E) 力学 bit 不変(2000步・${out.cases.invariant.n}粒子): kAbs 無指定 vs 3.4/fScat0.3 の不一致=`
  + `${out.cases.invariant.dOn} / fScat0 との不一致=${out.cases.invariant.dNoScat}(x,y,vx,vy,spin,τ)`);

// ---- D) fScat は描画層限定(スクリーンショット差分) ----
{
  const shot = async (kAbs, fScat) => {
    await page.evaluate(([k, f]) => {
      const p = JSON.parse(JSON.stringify(HP.allPresets().find((q) => q.id === 'reddening')));
      if (k === null) { delete p.physics.kAbs; delete p.physics.fScat; }
      else { p.physics.kAbs = k; p.physics.fScat = f; }
      HP.sim.build(HP.validatePreset(p).preset);
      HP.requestRender();
    }, [kAbs, fScat]);
    await page.waitForTimeout(320);
    return await page.screenshot({ clip: { x: 0, y: 90, width: 390, height: 420 } });
  };
  const sOff = await shot(null, 0), sAbs = await shot(3.4, 0), sScat = await shot(3.4, 0.3);
  const eq = (a, b) => a.length === b.length && a.equals(b);
  out.cases.rendering = { offVsAbs: eq(sOff, sAbs), absVsScat: eq(sAbs, sScat),
    bytes: [sOff.length, sAbs.length, sScat.length] };
  console.log(`D) 描画: kAbs無 vs kAbs3.4 の画面一致=${out.cases.rendering.offVsAbs}(false=吸収が見えている) / `
    + `fScat0 vs 0.3 の画面一致=${out.cases.rendering.absVsScat}(false=拡散光が見えている)`);
}

// ---- F) 局所質量核の台係数 K の較正(独立再実装で τ(y) 断面を積分) ----
out.cases.kernel = await page.evaluate((R) => {
  HP.loadPreset('reddening', false);
  const S = HP.sim;
  // 雲の粒子だけ(背景星群は m=0.02 で寄与が 3 桁小さい)を抜き、幾何半径・総質量を測る
  const cx = 70, cy = 0, Rc = 120;
  const P = [];
  let M = 0;
  for (let i = 0; i < S.n; i++) if (S.m[i] > 0.5) { P.push([S.x[i], S.y[i], S.m[i], S.R[i]]); M += S.m[i]; }
  const eps = S.params.softening, ds = 0.5, kAbs = S.params.kAbs;
  // 一様円盤(面密度 Σ=M/πRc²)の解析柱密度: τ_an(y) = kAbs·Σ·2√(Rc²−y²)
  const Sig = M / (Math.PI * Rc * Rc);
  const tauOf = (K, y) => {
    let t = 0;
    for (let x = cx - 260; x <= cx + 260; x += ds) {
      let rho = 0;
      for (const [px, py, m, r] of P) {
        const a = K * Math.max(r, eps), A2 = a * a;
        const dx = x - px, dy = y - py, d2 = dx * dx + dy * dy;
        if (d2 < A2) { const u = 1 - d2 / A2; rho += m * 3 / (Math.PI * A2) * u * u; }
      }
      t += kAbs * rho * ds;
    }
    return t;
  };
  const res = [];
  for (const K of [1.5, 2, 3, 4, 5, 6]) {
    const ys = []; for (let y = -110; y <= 110; y += 5) ys.push(y);
    let s2 = 0, mean = 0, tmax = 0;
    const rel = ys.map((y) => {
      const t = tauOf(K, y + cy), an = kAbs * Sig * 2 * Math.sqrt(Math.max(0, Rc * Rc - y * y));
      if (t > tmax) tmax = t;
      return an > 0 ? t / an : 1;
    });
    for (const r of rel) mean += r / rel.length;
    for (const r of rel) s2 += (r - mean) * (r - mean) / rel.length;
    // 台のはみ出し: 幾何半径 Rc の外で τ が中心値の 1% を超える最遠 y
    let bleed = 0;
    for (let y = Rc; y <= Rc + 130; y += 5) if (tauOf(K, y + cy) > 0.01 * tmax) bleed = y - Rc;
    res.push({ K, mean: +mean.toFixed(4), rms: +Math.sqrt(s2).toFixed(4),
      granularity: +(Math.sqrt(s2) / mean).toFixed(4), tauCenter: +tauOf(K, cy).toFixed(4), bleed });
  }
  return { nCloud: P.length, cloudMass: +M.toFixed(3), Rc, Sigma: Sig, eps, kAbs, rows: res };
}, RAY);
{
  const k = out.cases.kernel;
  console.log(`F) 局所質量核の台係数 K(雲 ${k.nCloud}粒・総質量 ${k.cloudMass}・R_c=${k.Rc}・Σ=${k.Sigma.toExponential(3)}):`);
  for (const r of k.rows)
    console.log(`   K=${r.K}: τ(0)=${r.tauCenter} 解析比 平均=${r.mean} 粒状性(RMS/平均)=${r.granularity} 台のはみ出し=+${r.bleed}`);
}

// ---- G) 透過後スペクトルのピーク移動(表示読み口と同じ式・帯域中央 λ_c 基準) ----
out.cases.spectrum = await page.evaluate(() => {
  HP.loadPreset('reddening', false);
  const S = HP.sim, BINS = 28, p = S.params.pRad;
  const ls = [], Ts = [];
  let lMin = Infinity, lMax = -Infinity;
  for (let i = 0; i < S.n; i++) { const T = HP.obsTemp(S, i); if (T <= 1e-9) continue;
    const l = Math.log10(S.params.bM / T); ls.push(l); Ts.push(T);
    if (l < lMin) lMin = l; if (l > lMax) lMax = l; }
  const pad = (lMax - lMin) * 0.05; const lo = lMin - pad, hi = lMax + pad;
  const lum = new Float64Array(BINS);
  for (let k = 0; k < ls.length; k++) {
    let b = Math.floor((ls[k] - lo) / (hi - lo) * BINS); b = Math.max(0, Math.min(BINS - 1, b));
    lum[b] += Math.pow(Ts[k], p);
  }
  const lamC = Math.pow(10, (lo + hi) / 2);
  const tau = HP.traceRay(S, -310, 0, 1, 0, 2.7, 400, null).tau;
  const lamAt = (b) => Math.pow(10, lo + ((b + 0.5) / BINS) * (hi - lo));
  let sBin = 0, tBin = 0, sMax = -1, tMax = -1;
  for (let b = 0; b < BINS; b++) {
    const tr = HP.opticsTransmit(tau, lamAt(b), lamC);
    if (lum[b] > sMax) { sMax = lum[b]; sBin = b; }
    if (lum[b] * tr > tMax) { tMax = lum[b] * tr; tBin = b; }
  }
  return { nRad: ls.length, lamLo: Math.pow(10, lo), lamHi: Math.pow(10, hi), lamC, tau,
    lamPeakSource: lamAt(sBin), lamPeakTrans: lamAt(tBin),
    shift: lamAt(tBin) / lamAt(sBin), lamPeakLaw: lamC * Math.pow(tau, 1 / 4) };
});
{
  const s = out.cases.spectrum;
  console.log(`G) 透過後スペクトル(源 ${s.nRad}粒・帯域 ${s.lamLo.toExponential(2)}〜${s.lamHi.toExponential(2)}・λ_c=${s.lamC.toExponential(3)}):`);
  console.log(`   源ピーク λ=${s.lamPeakSource.toExponential(3)} → 透過後 λ=${s.lamPeakTrans.toExponential(3)}(${s.shift.toFixed(2)}倍へ長波長側へ移動)`);
  console.log(`   解析形 λ_c·τ_ref^{1/pAbs}=${s.lamPeakLaw.toExponential(3)}(pRad=pAbs=4 のとき厳密解)`);
}

fs.writeFileSync(path.join(OUT_DIR, 'exp-4-83.json'), JSON.stringify(out, null, 2));
console.log('saved tests/out/exp-4-83.json');
await browser.close();
