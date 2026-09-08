// 第249便a W1「NS 応答候補 λ_PN=1/f + 正確な c の実測」。
//
// 背景: 第248便b の監査で、⚡🧮🩺 の近点移動が観測換算の約 2 倍になるのは、
//       **軌道を保つための較正質量 fM がそのまま 1PN チャネル(E12)へ入るから**だと同定された
//       (Δϖ ∝ λ_PN·G(fM)/(c²p) — D1〜D5 の掃引で 5 桁一致)。
//       そこで慣性応答の候補として **λ_PN = 1/f**(既存キー physics.lambdaPN。新キーは作らない)
//       を宣言すると λ_PN·fM = M となる。あわせて cLight を丸め値 3000 から
//       **2997.92458**(=299,792,458 m/s を 1単位=10⁶m/10¹s へ換算した正確値)へ直す
//       (1/c² が 0.1383% 動くので補正後の残差では無視できない)。κ=G/c² も同時に同期する。
//
// **エンジンの物理は 1 bit も変えない**。すべて JSON(preset)側の宣言を差し替えて測るだけである。
// 近点検出は第246便b→第247便a→第248便 と同一手続き(検出器 A=ṙ の −→+ 交差 / B=距離極小の
// 放物線頂点、柵は 近点/遠点の区別・一周に近点1つ・半周ジャンプ拒否、5近点の位相を直線 fit)。
//
// 節:
//   NS : 3 系(⚡ psrDoubleABDFM / 🧮 psrJ1757DFM / 🩺 psrJ1946DFM)
//        × 3 処方(旧則 = 現行宣言 / 1/f のみ / 1/f + 正確な c)× dt {0.002, 0.001, 0.0005}。
//        近点移動 °/周(検出器 A/B)・近点間 P・同方向 P(相対角が 2π 進む時間)・e proxy・
//        NaN/clamp を出し、観測換算(ω̇[°/yr]×P[s]/(365.25×86400 s))との残差 % を付ける。
//        dt 3 点の一次外挿(最小二乗の dt→0 切片)も 1 行。
//   NU : **kFrame=0 の ν 則の数値検証**。📻 psrDoubleAB(観測版・kFrame=0)を基に、
//        総質量 M・a・e を固定して質量比だけを変えた対(ν=m₁m₂/M²=0.05/0.10/0.15/0.20/0.25)を作り、
//        近点移動 / GR 1PN を測って解析予測 **1−(10/3)ν** と比べる。Plummer 軟化の一次寄与
//        −3πε²/p² を差し引いた列も併記する。
//   SAMPLE: 内蔵 variant 🪶 psrDoubleABPN / 🪃 psrJ1757PN / 🪀 psrJ1946PN の実測(obsCard の裏取り)。
//        NS 節の 'invFc' 行と同じ値になること・宣言(λ_PN=1/f・c・κ・bodies ビット同一)の照合。
//
// 実行: node tests/exp-w249a.mjs [--ns] [--nu] [--sample] [--fast]
//       (節を 1 つも指定しなければ全部。--fast は dt=0.0005 と ν の細段を省く)
// 較正はしない: f は各サンプルの massCalibration.factor をそのまま読む(fit ノブではない)。
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + path.join(ROOT, TARGET);
const argv = process.argv.slice(2);
const FAST = argv.includes('--fast');
const only = argv.filter((a) => a.startsWith('--') && a !== '--fast').map((a) => a.slice(2));
const want = (k) => !only.length || only.includes(k);

let browser;
try { const { chromium } = await import('playwright'); browser = await chromium.launch(); }
catch { const { chromium } = await import('playwright-core');
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }); }
const pg = await browser.newPage();
const pageErrors = [];
pg.on('pageerror', (e) => pageErrors.push(String(e)));
await pg.goto(INDEX, { waitUntil: 'load' });
await pg.waitForFunction(() => window.HP && HP.sim);

// ---------------------------------------------------------------- ページ側ヘルパ(本体には入れない)
await pg.evaluate(() => {
  // 正確な光速(1単位=10⁶m/10¹s の相対論的連星族 L−T=5): 299792458 × 10^(T−L) = 2997.92458
  window.__W249C = 299792458 * Math.pow(10, 1 - 6);
  window.__W249YR = 365.25 * 86400;                       // 年の規約(ユリウス年)
  // 観測レコードの転写(paper/data/solar-observations.csv の 2026-09-08 行)。
  //   PobsS = 公転周期[s]・omegaDot = ω̇[°/yr]・e = 転写離心率・Tunit = 1時間単位の秒数
  window.__W249SYS = {
    psrDoubleABDFM: { label: '⚡ J0737−3039A/B', PobsS: 8834.534723278, omegaDot: 16.899323, e: 0.087777036, Tunit: 10 },
    psrJ1757DFM: { label: '🧮 J1757−1854', PobsS: 15857.669019168, omegaDot: 10.3651, e: 0.6058142, Tunit: 10 },
    psrJ1946DFM: { label: '🩺 J1946+2052', PobsS: 6781.366656, omegaDot: 25.79205, e: 0.063848, Tunit: 10 },
  };
  // ---- 処方(physics の宣言だけを差し替える。bodies・massCalibration は 1 bit 触らない)
  //   'legacy' = 現行宣言のまま / 'invF' = λ_PN=1/f / 'invFc' = λ_PN=1/f かつ c を正確値(κ も同期)
  //   **3 処方とも framePrecision:"double" を敷く**(第247便a の数値床除去)。🧮🩺 は既に宣言済み
  //   なので 1 bit 不変で、⚡ 本体だけが native のままなので、ここで第248便b の監査基点
  //   (0.00945°/周)へ揃える。native の ⚡ は dt を細かくすると逆に発散する(0.0175→0.0277→0.0756)
  //   ため、λ_PN の比較に使えない。
  window.__w249variant = (id, mode) => {
    const pd = JSON.parse(JSON.stringify(HP.allPresets().find((q) => q.id === id)));
    const f = pd.massCalibration.factor;
    pd.physics.framePrecision = 'double';
    if (mode !== 'legacy') pd.physics.lambdaPN = 1 / f;
    if (mode === 'invFc') {
      pd.physics.cLight = window.__W249C;
      pd.physics.kappaT = pd.physics.G / (window.__W249C * window.__W249C);
    }
    delete pd.massCalibration;    // 台帳の三者一致検査を実験へ持ち込まない
    return { pd, f };
  };
  // ---- 近点移動・近点間 P・同方向 P の測定(第246便b/第247便a/第248便 と同一手続き)
  //   nPeri 個の近点位相を直線 fit した傾き = 1周あたりの近点移動。
  //   同方向 P は相対角の**累積**が 2π 進む時刻の差(近点間 P との差が近点移動そのもの)。
  window.__w249peri = (S, dt, tEnd, pRef, nPeri) => {
    const steps = Math.round(tEnd / dt), NP = nPeri || 5;
    const A = [], Bd = [], sid = [];
    let r2 = 0, r1 = 0, t2 = 0, t1 = 0, rd1 = 0, rMin = Infinity, rMax = -Infinity;
    let acc = 0, accPrev = 0, thPrev = null, nTurn = 0;
    for (let k = 0; k < steps; k++) {
      S.step(dt);
      const dx = S.x[1] - S.x[0], dy = S.y[1] - S.y[0];
      const rr = Math.hypot(dx, dy), th = Math.atan2(dy, dx);
      const dvx = S.vx[1] - S.vx[0], dvy = S.vy[1] - S.vy[0];
      const rd = (dx * dvx + dy * dvy) / rr;
      if (rr < rMin) rMin = rr; if (rr > rMax) rMax = rr;
      // 相対角の累積(同方向 P 用) — 符号は初期の回転方向に任せる(|acc| で判定)
      if (thPrev !== null) { let d = th - thPrev; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
        accPrev = acc; acc += d;
        while (sid.length < NP && Math.abs(acc) >= (nTurn + 1) * 2 * Math.PI) {
          const tgt = Math.sign(acc) * (nTurn + 1) * 2 * Math.PI;
          const fr = (acc !== accPrev) ? (tgt - accPrev) / (acc - accPrev) : 0;
          sid.push((k - 1 + fr) * dt); nTurn++;
        } }
      thPrev = th;
      if (k >= 1 && rd1 < 0 && rd >= 0) {
        const fr = (rd !== rd1) ? (-rd1 / (rd - rd1)) : 0;
        let a1 = t1, a2 = th; while (a2 - a1 > Math.PI) a2 -= 2 * Math.PI; while (a2 - a1 < -Math.PI) a2 += 2 * Math.PI;
        A.push({ ang: a1 + fr * (a2 - a1), k: k - 1 + fr, r: rr });
      }
      if (k >= 2 && r1 < r2 && r1 < rr) {
        const dd = (r2 - 2 * r1 + rr), fr = (dd !== 0) ? 0.5 * (r2 - rr) / dd : 0;
        let a1 = t2, a2 = t1, a3 = th;
        while (a2 - a1 > Math.PI) a2 -= 2 * Math.PI; while (a2 - a1 < -Math.PI) a2 += 2 * Math.PI;
        while (a3 - a2 > Math.PI) a3 -= 2 * Math.PI; while (a3 - a2 < -Math.PI) a3 += 2 * Math.PI;
        Bd.push({ ang: a2 + 0.5 * fr * (a3 - a1) + 0.5 * fr * fr * (a3 - 2 * a2 + a1), k: k - 1 + fr, r: r1 });
      }
      r2 = r1; r1 = rr; t2 = t1; t1 = th; rd1 = rd;
    }
    const fit = (raw) => {
      const mid = 0.5 * (rMin + rMax);
      const peri = raw.filter((p) => p.r < mid);
      const rej = { apo: raw.length - peri.length, dup: 0, jump: 0 };
      const keep = [];
      for (const p of peri) {
        if (keep.length && (p.k - keep[keep.length - 1].k) * dt < 0.5 * pRef) { rej.dup++; continue; }
        keep.push(p);
      }
      const use = keep.slice(0, NP), ang = [];
      for (let i = 0; i < use.length; i++) {
        let a = use[i].ang;
        if (i) {
          let z = a - ang[i - 1]; while (z > Math.PI) z -= 2 * Math.PI; while (z < -Math.PI) z += 2 * Math.PI;
          if (Math.abs(z) > Math.PI / 2) { rej.jump++; break; }
          a = ang[i - 1] + z;
        }
        ang.push(a);
      }
      const n = ang.length; let slope = null, resid = null;
      if (n >= 2) {
        const mx = (n - 1) / 2, my = ang.reduce((a, b) => a + b, 0) / n;
        let sxy = 0, sxx = 0;
        for (let i = 0; i < n; i++) { sxy += (i - mx) * (ang[i] - my); sxx += (i - mx) * (i - mx); }
        slope = sxy / sxx;
        resid = Math.sqrt(ang.reduce((s, a, i) => s + (a - (my + slope * (i - mx))) ** 2, 0) / n);
      }
      const per = []; for (let i = 1; i < use.length; i++) per.push((use[i].k - use[i - 1].k) * dt);
      const perMean = per.length ? per.reduce((a, b) => a + b, 0) / per.length : null;
      return { nPeri: n, rej, slopeDeg: slope === null ? null : slope * 180 / Math.PI,
        residDeg: resid === null ? null : resid * 180 / Math.PI, per, perMean };
    };
    const sidPer = []; for (let i = 1; i < sid.length; i++) sidPer.push(sid[i] - sid[i - 1]);
    return { rMin, rMax, eProxy: (rMax - rMin) / (rMax + rMin),
      A: fit(A), B: fit(Bd),
      sidPer, sidMean: sidPer.length ? sidPer.reduce((a, b) => a + b, 0) / sidPer.length : null,
      nan: S.hasNaN(), clamp: S.clampVN + S.clampSN + S.clampRN + S.clampTN, framePrec: S.framePrec };
  };
  // ---- NS 1 行を測る
  window.__w249run = (id, mode, dt) => {
    const { pd, f } = window.__w249variant(id, mode);
    const s = window.__W249SYS[id];
    const Pu = s.PobsS / s.Tunit;                 // 観測周期(時間単位)
    const v = HP.validatePreset(pd); const S = HP.sim; S.build(v.preset);
    const o = window.__w249peri(S, dt, 5.6 * Pu, Pu, 5);
    o.f = f; o.lambdaPN = v.preset.physics.lambdaPN; o.cLight = v.preset.physics.cLight;
    o.kappaT = v.preset.physics.kappaT;
    o.warn = (v.warnings || []).length; o.warnMsgs = (v.warnings || []).slice(0, 3);
    o.Pu = Pu; o.PobsS = s.PobsS;
    o.obsDegPerOrbit = s.omegaDot * s.PobsS / window.__W249YR;
    o.PmeasS = o.A.perMean === null ? null : o.A.perMean * s.Tunit;         // 近点間 P(秒)
    o.PsidS = o.sidMean === null ? null : o.sidMean * s.Tunit;              // 同方向 P(秒)
    o.eObs = s.e;
    return o;
  };
  // ---- ν 則(kFrame=0): 📻 の総質量・a・e を固定して質量比だけを変えた対を作る
  //   ν=m₁m₂/M² → m₁/M=(1+√(1−4ν))/2。位置・速度は遠点整列の重心配分(質量比だけで決まる)。
  window.__w249nuBuild = (nu) => {
    const src = HP.allPresets().find((q) => q.id === 'psrDoubleAB');
    const pd = JSON.parse(JSON.stringify(src));
    const m0 = src.bodies[0].m, m1 = src.bodies[1].m, M = m0 + m1;
    const sep = Math.abs(src.bodies[1].x - src.bodies[0].x);
    const vrel = Math.abs(src.bodies[1].vy - src.bodies[0].vy);
    const e = window.__W249SYS.psrDoubleABDFM.e;
    const a = sep / (1 + e);
    const root = Math.sqrt(Math.max(0, 1 - 4 * nu));
    const mA = M * (1 + root) / 2, mB = M * (1 - root) / 2;
    pd.id = 'w249nu';
    pd.bodies[0].m = mA; pd.bodies[1].m = mB;
    pd.bodies[0].x = -sep * mB / M; pd.bodies[1].x = sep * mA / M;
    pd.bodies[0].vy = -vrel * mB / M; pd.bodies[1].vy = vrel * mA / M;
    const G = pd.physics.G, c = pd.physics.cLight, eps = pd.physics.softening;
    const p = a * (1 - e * e);
    return { pd, meta: { nu, M, a, e, p, mA, mB, G, c, eps, sep, vrel,
      // GR 1PN(質量比に依らない試験粒子型の参照): Δϖ = 6πGM/(c²a(1−e²))
      gr1pnDeg: 6 * Math.PI * G * M / (c * c * p) * 180 / Math.PI,
      // Plummer 軟化の一次寄与: Δϖ_soft = −3πε²/p²(rad/周)
      softDeg: -3 * Math.PI * eps * eps / (p * p) * 180 / Math.PI,
      // 解析予測(第248便b の同定): Δϖ_E12/Δϖ_GR = 1 − (10/3)ν
      ratioPred: 1 - 10 * nu / 3 } };
  };
  window.__w249nuRun = (nu, dt) => {
    const b = window.__w249nuBuild(nu);
    const s = window.__W249SYS.psrDoubleABDFM, Pu = s.PobsS / s.Tunit;
    const v = HP.validatePreset(JSON.parse(JSON.stringify(b.pd)));
    const S = HP.sim; S.build(v.preset);
    const o = window.__w249peri(S, dt, 5.6 * Pu, Pu, 5);
    o.meta = b.meta; o.warn = (v.warnings || []).length;
    o.ratio = (o.A.slopeDeg === null) ? null : o.A.slopeDeg / b.meta.gr1pnDeg;
    o.ratioSoft = (o.A.slopeDeg === null) ? null : (o.A.slopeDeg - b.meta.softDeg) / b.meta.gr1pnDeg;
    return o;
  };
});

const out = { target: TARGET, fast: FAST };

// ============================================================ NS: 3 系 × 3 処方 × dt
if (want('ns')) {
  const IDS = ['psrDoubleABDFM', 'psrJ1757DFM', 'psrJ1946DFM'];
  const MODES = ['legacy', 'invF', 'invFc'];
  const DTS = FAST ? [0.002, 0.001] : [0.002, 0.001, 0.0005];
  const rows = [];
  for (const id of IDS) for (const mode of MODES) for (const dt of DTS) {
    const t0 = Date.now();
    const r = await pg.evaluate(({ id, mode, dt }) => window.__w249run(id, mode, dt), { id, mode, dt });
    const adv = r.A.slopeDeg, obs = r.obsDegPerOrbit;
    rows.push({ id, mode, dt, advA: adv, advB: r.B.slopeDeg,
      detDiff: (adv === null || r.B.slopeDeg === null) ? null : Math.abs(adv - r.B.slopeDeg),
      residPct: adv === null ? null : (adv / obs - 1) * 100,
      obsDegPerOrbit: obs, PmeasS: r.PmeasS, PsidS: r.PsidS, PobsS: r.PobsS,
      PresidPct: r.PmeasS === null ? null : (r.PmeasS / r.PobsS - 1) * 100,
      PsidResidPct: r.PsidS === null ? null : (r.PsidS / r.PobsS - 1) * 100,
      eProxy: r.eProxy, eObs: r.eObs, eResidPct: (r.eProxy / r.eObs - 1) * 100,
      nan: r.nan, clamp: r.clamp, warn: r.warn, warnMsgs: r.warnMsgs,
      f: r.f, lambdaPN: r.lambdaPN, cLight: r.cLight, kappaT: r.kappaT,
      nPeriA: r.A.nPeri, residFitDeg: r.A.residDeg, framePrec: r.framePrec });
    console.error(`  NS ${id}/${mode} dt=${dt} → ${adv} °/周 (残差 ${(adv / obs - 1) * 100}%)  [${((Date.now() - t0) / 1000).toFixed(1)}s]`);
  }
  // dt の一次外挿(最小二乗の dt→0 切片)
  const extrap = [];
  for (const id of IDS) for (const mode of MODES) {
    const sel = rows.filter((r) => r.id === id && r.mode === mode && r.advA !== null);
    if (sel.length < 2) continue;
    const lin = (ys) => { const n = sel.length;
      const mx = sel.reduce((s, r) => s + r.dt, 0) / n, my = ys.reduce((a, b) => a + b, 0) / n;
      let sxy = 0, sxx = 0;
      for (let i = 0; i < n; i++) { sxy += (sel[i].dt - mx) * (ys[i] - my); sxx += (sel[i].dt - mx) ** 2; }
      const k = sxx ? sxy / sxx : 0; return my - k * mx; };
    const a0 = lin(sel.map((r) => r.advA));
    const p0 = lin(sel.map((r) => r.PmeasS));
    const obs = sel[0].obsDegPerOrbit, Pobs = sel[0].PobsS;
    extrap.push({ id, mode, nDt: sel.length, dts: sel.map((r) => r.dt),
      advA0: a0, residPct0: (a0 / obs - 1) * 100, PmeasS0: p0, PresidPct0: (p0 / Pobs - 1) * 100 });
    console.error(`  EXTRAP ${id}/${mode} → ${a0} °/周 (残差 ${(a0 / obs - 1) * 100}%)`);
  }
  out.ns = rows; out.nsExtrap = extrap;
}

// ============================================================ NU: kFrame=0 の ν 則
if (want('nu')) {
  const NUS = FAST ? [0.05, 0.15, 0.25] : [0.05, 0.10, 0.15, 0.20, 0.25];
  const DT = 0.001;
  const rows = [];
  for (const nu of NUS) {
    const t0 = Date.now();
    const r = await pg.evaluate(({ nu, dt }) => window.__w249nuRun(nu, dt), { nu, dt: DT });
    rows.push({ nu, dt: DT, advA: r.A.slopeDeg, advB: r.B.slopeDeg,
      detDiff: (r.A.slopeDeg === null || r.B.slopeDeg === null) ? null : Math.abs(r.A.slopeDeg - r.B.slopeDeg),
      gr1pnDeg: r.meta.gr1pnDeg, softDeg: r.meta.softDeg,
      ratio: r.ratio, ratioSoft: r.ratioSoft, ratioPred: r.meta.ratioPred,
      dRatio: r.ratio === null ? null : r.ratio - r.meta.ratioPred,
      dRatioSoft: r.ratioSoft === null ? null : r.ratioSoft - r.meta.ratioPred,
      mA: r.meta.mA, mB: r.meta.mB, M: r.meta.M, p: r.meta.p,
      eProxy: r.eProxy, nan: r.nan, clamp: r.clamp, warn: r.warn, nPeriA: r.A.nPeri });
    console.error(`  NU ν=${nu} → 比 ${r.ratio} (軟化補正 ${r.ratioSoft} / 解析 ${r.meta.ratioPred})  [${((Date.now() - t0) / 1000).toFixed(1)}s]`);
  }
  out.nu = rows;
}

// ============================================================ SAMPLE: 内蔵 variant(🪶🪃🪀)の実測
//   NS 節の 'invFc' 行と**同じ値**になること(= プリセットの宣言が処方どおりであること)の裏取り。
if (want('sample')) {
  const PAIR = [['psrDoubleABPN', 'psrDoubleABDFM'], ['psrJ1757PN', 'psrJ1757DFM'], ['psrJ1946PN', 'psrJ1946DFM']];
  const DTS = FAST ? [0.002] : [0.002, 0.001, 0.0005];
  const rows = [];
  for (const [id, base] of PAIR) for (const dt of DTS) {
    const t0 = Date.now();
    const r = await pg.evaluate(({ id, base, dt }) => {
      const pd = JSON.parse(JSON.stringify(HP.allPresets().find((q) => q.id === id)));
      const src = HP.allPresets().find((q) => q.id === base);
      const s = window.__W249SYS[base], Pu = s.PobsS / s.Tunit;
      const v = HP.validatePreset(pd); const S = HP.sim; S.build(v.preset);
      const o = window.__w249peri(S, dt, 5.6 * Pu, Pu, 5);
      o.warn = (v.warnings || []).length;
      o.obsDegPerOrbit = s.omegaDot * s.PobsS / window.__W249YR;
      o.PmeasS = o.A.perMean === null ? null : o.A.perMean * s.Tunit;
      o.PsidS = o.sidMean === null ? null : o.sidMean * s.Tunit;
      o.PobsS = s.PobsS; o.eObs = s.e;
      // 宣言の照合: λ_PN=1/f(±1e-9)・c=2997.92458・κ=G/c²・bodies は本体とビット同一
      const f = pd.massCalibration.factor;
      o.lamOK = Math.abs(pd.physics.lambdaPN - 1 / f) < 1e-9;
      o.cOK = pd.physics.cLight === 2997.92458;
      o.kapOK = Math.abs(pd.physics.kappaT - pd.physics.G / (pd.physics.cLight * pd.physics.cLight)) < 1e-18;
      o.bodiesBit = JSON.stringify(pd.bodies) === JSON.stringify(src.bodies);
      o.massCalBit = JSON.stringify(pd.massCalibration) === JSON.stringify(src.massCalibration);
      o.f = f; o.lambdaPN = pd.physics.lambdaPN; o.cLight = pd.physics.cLight;
      return o;
    }, { id, base, dt });
    rows.push({ id, base, dt, advA: r.A.slopeDeg, advB: r.B.slopeDeg,
      residPct: (r.A.slopeDeg / r.obsDegPerOrbit - 1) * 100,
      PmeasS: r.PmeasS, PresidPct: (r.PmeasS / r.PobsS - 1) * 100,
      PsidS: r.PsidS, eProxy: r.eProxy, eResidPct: (r.eProxy / r.eObs - 1) * 100,
      lamOK: r.lamOK, cOK: r.cOK, kapOK: r.kapOK, bodiesBit: r.bodiesBit, massCalBit: r.massCalBit,
      f: r.f, lambdaPN: r.lambdaPN, cLight: r.cLight,
      nan: r.nan, clamp: r.clamp, warn: r.warn });
    console.error(`  SAMPLE ${id} dt=${dt} → ${r.A.slopeDeg} °/周 (残差 ${(r.A.slopeDeg / r.obsDegPerOrbit - 1) * 100}%) `
      + `λOK=${r.lamOK} cOK=${r.cOK} κOK=${r.kapOK} bodies bit=${r.bodiesBit}  [${((Date.now() - t0) / 1000).toFixed(1)}s]`);
  }
  out.sample = rows;
}

out.pageErrors = pageErrors;
console.log(JSON.stringify(out, null, 1));
await browser.close();
