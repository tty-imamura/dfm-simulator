// 第248便a(第40報「中性子星までの較正を目指す。検証用の天体の観測レコードを提案する」)。
//   BUILD: 🧮 PSR J1757−1854 / 🩺 PSR J1946+2052 の**構成規約からの機械算出**(質量・遠点状態・
//          一次則の f・q_exact)— プリセットの数値リテラルがこの計算と一致することの裏取り。
//   SENS : **感度表** — (a) 伴星スピン 0 / 仮定 10 ms / 仮定 100 ms(いずれも**未観測**)、
//          (b) NS 半径 11 / 11.75(EOS proxy)/ 13 km、(c) dt 2 段。
//          近点移動 °/周は軌道積分(半径と dt に依存・スピンには**依存しない**= λ 既定で
//          spinDipole は読み取り専用)、η=|F_SS|/|F_N| は HP.dfmCompactMeasures(スピンと半径に依存)。
//   SPIN : スピン不感の**機械対照** — spinDipole の ω を変えても軌道が 400 步ビット一致すること。
//   SAMPLE: 内蔵プリセット(psrJ1757DFM / psrJ1946DFM)の実測(obsCard の裏取り)。
// 実行: node tests/exp-w248a.mjs [--build] [--sens] [--spin] [--sample] [--fast]
//       (節を 1 つも指定しなければ全部。--fast は細かい dt 段を省く)
// 較正はしない: f は ⚡ と同じ一次則 f=1+k_F(αχ_A+βχ_B) の不動点・λ は既定(spinSpin 未宣言)。
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
  // --- 観測転写(paper/data/solar-observations.csv の 2026-09-08 追加行)---
  //     質量は本リポジトリのコミット済み太陽質量 1.9885e30 kg、a は (GM)_sun=1.3271244e20(IAU 2015 B3)
  //     と観測 P からの Kepler 等価値(J0737 の 📻/⚡ と同じ規約)。
  window.__W248 = {
    J1757: { name: 'PSR J1757-1854', mAsun: 1.3384, mBsun: 1.3946, Mtot: 2.73295,
      Pd: 0.18353783587, e: 0.6058142, PspinS: 21.4972318900292e-3, omegaDotDegYr: 10.3651 },
    J1946: { name: 'PSR J1946+2052', mAsun: 1.2838, mBsun: 1.2480, Mtot: 2.531858,
      Pd: 0.07848804, e: 0.063848, PspinS: 16.96017532298e-3, omegaDotDegYr: 25.79205 },
  };
  window.__w248build = (key, opt) => {
    const s = window.__W248[key], o = opt || {};
    const MSUN = 1.9885e30, GMSUN = 1.3271244e20;          // 単位換算の規約(観測ではない)
    const L = 1e6, T = 1e1, M = 1e27;                      // 相対論的連星族 L−T=5(⚡📻 と同一)
    const G = 6.674, c = 3000, eps = 0.05, D0 = 0.006, D0p = 3.24204e-7;
    const P = s.Pd * 86400, aSI = Math.cbrt(s.Mtot * GMSUN * P * P / (4 * Math.PI * Math.PI));
    const a = aSI / L, mA = s.mAsun * MSUN / M, mB = s.mBsun * MSUN / M;
    const sep = a * (1 + s.e);
    const vrel = Math.sqrt(G * (mA + mB) / a * (1 - s.e) / (1 + s.e));   // f=1 の実ケプラー遠点速度
    const f = HP.dfmBinaryMassFactorLinear(mA, mB, a, D0p, eps, 1, 2).f; // 一次則の不動点(fit なし)
    const mAc = mA * f, mBc = mB * f, Mc = mAc + mBc;
    const R = (o.radiusKm === undefined) ? 0.01175 : o.radiusKm / 1000;  // 1単位=10⁶m → km/1000
    const qe = (Ms) => { const X = 1.25 * c * c * R / (G * Ms), Ln = Math.log((R + a) / R);
      return 3 + Math.log(X) / Ln + 3 * Math.log(a / (R + a)) / Ln; };
    const wA = 2 * Math.PI / (s.PspinS / T);               // 観測自転(rad/単位)— 値域外(宣言)
    const wB = (o.companionMs === undefined || o.companionMs === null) ? null
      : 2 * Math.PI / (o.companionMs * 1e-3 / T);          // 仮定スピン(**未観測** — 感度帯用)
    const mf = (f - 1) / f;
    const body = (m, x, vy, dq, dip) => {
      const b = { type: 'single', dragQ: dq, m, radius: R, x, y: 0, vx: 0, vy,
        spin: 0, pinned: false, pnSource: true,
        core: { mode: 'differential', massFrac: mf, radius: 0.01, omega: 0, Kcs: 0, inertiaScale: 1000000 } };
      if (dip !== null) b.spinDipole = { omega: dip, radius: R, source: (dip === wA) ? 'observed' : 'assumed' };
      return b;
    };
    return { pd: {
      id: 'w248_' + key, name: 'w248 ' + s.name, emoji: '🧪', group: '現実との照合・太陽系外',
      description: 'QA/実験用(第248便a)', scaleTier: 'planetary', scaleExp: { L: 6, T: 1, M: 27 },
      camera: { scale: 500 }, world: { boundary: 'none', size: 0 },
      physics: { G, D0, kFrame: 1, q: qe(mA), kRep: 0, muF: 0, gammaN: 0, kappaS: 0, kappaT: G / (c * c),
        cLight: c, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0, massFloor: 1e-6,
        geoPN: 2, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: eps, timeScale: 300, dispMag: 1000,
        stateCarry: 'double', framePrecision: 'double',
        frameReaction: 'pairReduced', coupleSink: 'core', cmGauge: 'barycentric',
        frameWeight: 'pull', D0pull: D0p },
      bodies: [body(mAc, -sep * mBc / Mc, -vrel * mBc / Mc, qe(mA), wA),
        body(mBc, sep * mAc / Mc, vrel * mAc / Mc, qe(mB), wB)],
      overlays: { rotationCurve: false, tempHistogram: false, field: false, trail: true } },
      meta: { P, aSI, a, Pu: P / T, mA, mB, f, mAc, mBc, sep, vrel, mf, R,
        qA: qe(mA), qB: qe(mB), wA, wB, e: s.e, G, c, eps,
        orbitsPerCentury: 100 * 365.25 * 86400 / P } };
  };
  // 近点検出(第246便b/第247便a の手続きそのまま): 検出器 A=ṙ の −→+ 交差(線形内挿)/
  // B=距離極小の放物線頂点。柵 ①近点/遠点の区別 ②一周に近点 1 つ ③半周ジャンプ拒否。位相を直線 fit。
  window.__w248peri = (S, dt, tEnd, pRef, nPeri) => {
    const steps = Math.round(tEnd / dt), NP = nPeri || 4;
    const A = [], Bd = [];
    let r2 = 0, r1 = 0, t2 = 0, t1 = 0, rd1 = 0, rMin = Infinity, rMax = -Infinity;
    for (let k = 0; k < steps; k++) {
      S.step(dt);
      const dx = S.x[1] - S.x[0], dy = S.y[1] - S.y[0];
      const rr = Math.hypot(dx, dy), th = Math.atan2(dy, dx);
      const dvx = S.vx[1] - S.vx[0], dvy = S.vy[1] - S.vy[0];
      const rd = (dx * dvx + dy * dvy) / rr;
      if (rr < rMin) rMin = rr; if (rr > rMax) rMax = rr;
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
      return { nRaw: raw.length, nPeri: n, rej, slopeDeg: slope === null ? null : slope * 180 / Math.PI,
        residDeg: resid === null ? null : resid * 180 / Math.PI, per };
    };
    return { rMin, rMax, A: fit(A), B: fit(Bd), nan: S.hasNaN(),
      clamp: S.clampVN + S.clampSN + S.clampRN + S.clampTN, framePrec: S.framePrec };
  };
  // η(スピン–スピン比)は純関数 HP.dfmCompactMeasures で(軌道積分に依存しない読み取り専用の台帳)
  window.__w248eta = (key, radiusKm, companionMs) => {
    const b = window.__w248build(key, { radiusKm, companionMs });
    const m = b.meta, s = window.__W248[key];
    const wB = (companionMs === null) ? 0 : m.wB;
    return HP.dfmCompactMeasures({ name: s.name, G: m.G, c: m.c, eps: m.eps,
      r: Math.abs(b.pd.bodies[1].x - b.pd.bodies[0].x),
      a: { m: m.mA, R: m.R, omega: m.wA }, b: { m: m.mB, R: m.R, omega: wB },
      orbit: { a: m.a, e: m.e, orbitsPerCentury: m.orbitsPerCentury } }, {});
  };
});

const out = {};

// ============================================================ BUILD: 構成規約からの機械算出
if (want('build')) {
  out.build = await pg.evaluate(() => {
    const o = {};
    for (const k of ['J1757', 'J1946']) {
      const b = window.__w248build(k, {});
      o[k] = { meta: b.meta, bodies: b.pd.bodies.map((z) => ({ m: z.m, x: z.x, vy: z.vy, dragQ: z.dragQ, radius: z.radius,
        massFrac: z.core.massFrac, dipole: z.spinDipole || null })), q: b.pd.physics.q };
    }
    return o;
  });
  console.error('  build done');
}

// ============================================================ SPIN: スピン不感の機械対照
if (want('spin')) {
  out.spin = await pg.evaluate(() => {
    const run = (k, ms) => {
      const b = window.__w248build(k, { companionMs: ms });
      const v = HP.validatePreset(JSON.parse(JSON.stringify(b.pd)));
      const S = HP.sim; S.build(v.preset);
      for (let i = 0; i < 400; i++) S.step(0.008);
      return { st: [S.x[0], S.y[0], S.x[1], S.y[1], S.vx[0], S.vy[0], S.vx[1], S.vy[1]],
        warn: (v.warnings || []).length, hasSS: S.hasSpinSpin };
    };
    const o = {};
    for (const k of ['J1757', 'J1946']) {
      const z = run(k, null), a = run(k, 10), c = run(k, 100);
      o[k] = { warn: z.warn, hasSpinSpin: z.hasSS,
        bit10: z.st.every((v, i) => Object.is(v, a.st[i])),
        bit100: z.st.every((v, i) => Object.is(v, c.st[i])) };
    }
    return o;
  });
  console.error('  spin done');
}

// ============================================================ SENS: 感度表
if (want('sens')) {
  const DTS = FAST ? [0.008] : [0.008, 0.004];
  const RADII = [11, 11.75, 13];
  const SPINS = [null, 10, 100];         // 伴星スピン: 未観測(0 扱い)/ 仮定 10 ms / 仮定 100 ms
  const rows = [], etas = [];
  for (const key of ['J1757', 'J1946']) {
    // η は純関数(軌道積分なし)— スピン 3 × 半径 3
    for (const rk of RADII) for (const ms of SPINS) {
      const e = await pg.evaluate(({ key, rk, ms }) => window.__w248eta(key, rk, ms), { key, rk, ms });
      etas.push({ key, radiusKm: rk, companionMs: ms, eta: e.eta, Q: e.Q, Xi: e.Xi,
        dPeriDegSS: e.dPeriDeg, arcsecPerCentury: e.dPeriArcsecPerCentury });
      }
    // 近点移動は軌道積分(半径 × dt。スピンには依存しない = SPIN 節の機械対照)
    for (const rk of RADII) for (const dt of DTS) {
      const t0 = Date.now();
      const r = await pg.evaluate(({ key, rk, dt }) => {
        const b = window.__w248build(key, { radiusKm: rk });
        const v = HP.validatePreset(JSON.parse(JSON.stringify(b.pd)));
        const S = HP.sim; S.build(v.preset);
        const o = window.__w248peri(S, dt, 4.6 * b.meta.Pu, b.meta.Pu, 4);
        o.Pu = b.meta.Pu; o.warn = (v.warnings || []).length; return o;
      }, { key, rk, dt });
      rows.push({ key, radiusKm: rk, dt, ...r });
      console.error(`  SENS: ${key} R=${rk}km dt=${dt} (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
    }
  }
  out.sensEta = etas; out.sensOrbit = rows;
}

// ============================================================ CONV: dt 収束(EOS proxy 半径で 4 段)
if (want('conv')) {
  const DTS = FAST ? [0.008, 0.004] : [0.008, 0.004, 0.002, 0.001];
  const rows = [];
  for (const key of ['J1757', 'J1946']) for (const dt of DTS) {
    const t0 = Date.now();
    const r = await pg.evaluate(({ key, dt }) => {
      const b = window.__w248build(key, {});
      const v = HP.validatePreset(JSON.parse(JSON.stringify(b.pd)));
      const S = HP.sim; S.build(v.preset);
      const o = window.__w248peri(S, dt, 4.6 * b.meta.Pu, b.meta.Pu, 4);
      o.Pu = b.meta.Pu; o.PobsS = b.meta.P; o.eMeas = (o.rMax - o.rMin) / (o.rMax + o.rMin);
      return o;
    }, { key, dt });
    rows.push({ key, dt, ...r });
    console.error(`  CONV: ${key} dt=${dt} (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
  }
  out.conv = rows;
}

// ============================================================ SAMPLE: 内蔵プリセットの実測
if (want('sample')) {
  const rows = [];
  for (const [id, key, dt] of [['psrJ1757DFM', 'J1757', 0.008], ['psrJ1757DFM', 'J1757', 0.004],
    ['psrJ1946DFM', 'J1946', 0.008], ['psrJ1946DFM', 'J1946', 0.004]]) {
    const has = await pg.evaluate((id) => !!HP.allPresets().find((q) => q.id === id), id);
    if (!has) { rows.push({ id, dt, missing: true }); continue; }
    const t0 = Date.now();
    const r = await pg.evaluate(({ id, key, dt }) => {
      const pd = JSON.parse(JSON.stringify(HP.allPresets().find((q) => q.id === id)));
      const v = HP.validatePreset(pd); const S = HP.sim; S.build(v.preset);
      const meta = window.__w248build(key, {}).meta;
      const o = window.__w248peri(S, dt, 4.6 * meta.Pu, meta.Pu, 4);
      o.warn = (v.warnings || []).length; o.Pu = meta.Pu; o.PobsS = meta.P;
      // 実測離心率(1周目の rMin/rMax)と近点
      o.eMeas = (o.rMax - o.rMin) / (o.rMax + o.rMin);
      // 宣言と構成計算の一致(ビット)
      o.bitSameAsBuild = ['m', 'x', 'vy', 'dragQ', 'radius'].every((f) =>
        Object.is(v.preset.bodies[0][f], window.__w248build(key, {}).pd.bodies[0][f])
        && Object.is(v.preset.bodies[1][f], window.__w248build(key, {}).pd.bodies[1][f]));
      return o;
    }, { id, key, dt });
    rows.push({ id, dt, ...r });
    console.error(`  SAMPLE: ${id} dt=${dt} (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
  }
  out.sample = rows;
}

out.pageErrors = pageErrors;
console.log(JSON.stringify(out, null, 1));
await browser.close();
