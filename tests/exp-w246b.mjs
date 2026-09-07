// 第246便b(第38報 最優先): コンパクト天体連星の重力磁気の検証。
//   B: η=|F_SS|/|F_N| の梯子(観測の自転と半径をそのまま使う)+ λ=1 の 4.3 公転走行
//   C(D2): ⚡ の微小近点移動の測定手続き(dt 3 段 × 近点検出 2 方式 × stateCarry 2 種)
// 実行: node tests/exp-w246b.mjs [--fast]   (--fast は D2 の dt=0.004 を省く)
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + path.join(ROOT, TARGET);
const FAST = process.argv.includes('--fast');

let browser;
try { const { chromium } = await import('playwright'); browser = await chromium.launch(); }
catch { const { chromium } = await import('playwright-core');
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }); }
const pg = await browser.newPage();
await pg.goto(INDEX, { waitUntil: 'load' });
await pg.waitForFunction(() => window.HP && HP.sim);

// ---------------------------------------------------------------- B: η の梯子
const ladder = await pg.evaluate(() => {
  const get = (id) => JSON.parse(JSON.stringify(HP.allPresets().find((q) => q.id === id)));
  const out = { rows: [], checks: {} };
  const psr = get('psrDoubleABDFM'), gw = get('gw150914DFM');
  const cP = psr.physics.cLight, GP = psr.physics.G, epsP = psr.physics.softening;
  const cG = gw.physics.cLight, GG = gw.physics.G;
  const A = psr.bodies[0], B = psr.bodies[1];

  // --- ⚡ を build して遠点/近点の分離と Q を実測 ---
  const v = HP.validatePreset(JSON.parse(JSON.stringify(psr)));
  const S = HP.sim; S.build(v.preset);
  out.checks.warn = (v.warnings || []).length;
  out.checks.warns = (v.warnings || []).slice(0, 4);
  const Qa = HP.dfmSpinDipoleMoment(0), Qb = HP.dfmSpinDipoleMoment(1);
  const QaF = 0.5 * S.m[0] * A.spinDipole.radius ** 2 * A.spinDipole.omega;
  const QbF = 0.5 * S.m[1] * B.spinDipole.radius ** 2 * B.spinDipole.omega;
  out.checks.Q = [Qa, Qb]; out.checks.Qformula = [QaF, QbF];
  out.checks.Qexact = (Qa === QaF && Qb === QbF);
  out.checks.Qov = [HP.dfmSpinDipoleQov(0), HP.dfmSpinDipoleQov(1)];
  // 遠点(t=0)と、1 公転回して見つけた近点
  const rNow = () => Math.hypot(S.x[1] - S.x[0], S.y[1] - S.y[0]);
  const rApo = rNow();
  let rMin = Infinity, rMax = -Infinity;
  for (let k = 0; k < 70000; k++) { S.step(0.016); const r = rNow(); if (r < rMin) rMin = r; if (r > rMax) rMax = r; }
  out.checks.rApo = rApo; out.checks.rPeri = rMin; out.checks.rMax = rMax;
  // 遠点でのエンジン η(λ=1 換算)と純関数の一致
  S.build(v.preset);
  const etaEngineApo = HP.dfmSpinSpinEta(0, 1);
  const ldApo = HP.dfmCompactSpinSpinLadder(A.spinDipole, B.spinDipole, rApo, cP, epsP);
  out.checks.etaEngineApo = etaEngineApo;
  out.checks.etaLadderApo = ldApo.eta;
  out.checks.etaRel = Math.abs(etaEngineApo / ldApo.eta - 1);

  const row = (name, a, b, r, c, eps, note) => {
    const L = HP.dfmCompactSpinSpinLadder(a, b, r, c, eps || 0);
    out.rows.push({ name, Ra: a.radius, wa: a.omega, Rb: b.radius, wb: b.omega, r,
      va: L.vA, vb: L.vB, eta: L.eta, lam3: L.lamTarget, note: note || '' });
    return L;
  };
  // 1) ⚡ 実配置(観測の自転と半径をそのまま)
  row('J0737 A×B 遠点', A.spinDipole, B.spinDipole, rApo, cP, epsP, 'ε=0.05 込み');
  row('J0737 A×B 近点', A.spinDipole, B.spinDipole, rMin, cP, epsP, 'ε=0.05 込み');
  // 2) NS–NS 接触(r=2R)
  row('NS–NS 接触 r=2R', A.spinDipole, B.spinDipole, 2 * A.spinDipole.radius, cP, 0, 'ε=0');
  // 3) ミリ秒パルサー対(P=1.4 ms・同じ 11.75 km)
  const wMs = 2 * Math.PI / (1.4e-3 / 10);   // T 単位 = 10 s
  const MS = { radius: 0.01175, omega: wMs };
  row('ms パルサー対 接触 r=2R', MS, MS, 2 * MS.radius, cP, 0, 'P=1.4 ms 両者');
  row('ms パルサー対 r=1000 km', MS, MS, 1, cP, 0, 'P=1.4 ms 両者');
  // 4) 🎻 BH(Q=J=χGm²/c の玩具宣言)
  const mA = gw.bodies[0].m, mB = gw.bodies[1].m, RA = gw.bodies[0].radius, RB = gw.bodies[1].radius;
  const rGw = Math.abs(gw.bodies[1].x - gw.bodies[0].x);
  const RsA = 2 * GG * mA / (cG * cG), RsB = 2 * GG * mB / (cG * cG);       // 較正質量の R_s
  const RsAo = RsA / 2, RsBo = RsB / 2;                                     // 観測質量(f≈2)の R_s
  const RsTot = 2 * GG * (mA + mB) / 2 / (cG * cG);                         // 観測質量の合計 R_s
  out.checks.gw = { mA, mB, RA, RB, rGw, RsA, RsB, RsAo, RsBo, RsTot, cG, GG };
  const bh = (chi, m, R) => ({ radius: R, omega: 2 * chi * GG * m / (cG * R * R), source: 'declared' });
  for (const chi of [0.3, 0.7]) {
    for (const [tag, rr] of [['現在分離', rGw], ['r=5R_s(合体直前)', 5 * RsTot]]) {
      const L = row(`GW150914 χ=${chi} ${tag}`, bh(chi, mA, RA), bh(chi, mB, RB), rr, cG, 0,
        'Q=J=χGm²/c(玩具宣言)');
      // GR のスピン–スピン項の桁 (3/4)χ₁χ₂(R_s/r)²(観測質量の R_s・符号は Kidder では逆)
      L.grObs = 0.75 * chi * chi * RsAo * RsBo / (rr * rr);
      out.rows[out.rows.length - 1].grObs = L.grObs;
      out.rows[out.rows.length - 1].engOverGr = out.rows[out.rows.length - 1].eta / L.grObs;
    }
  }
  return out;
});

// ------------------------------------------- B: λ 掃引で 4.3 公転(λ=0 との bit 差と Δϖ・ΔP)
// λ=1(=G/c² の物理係数)が「信号」なのか「丸めの床」なのかは、λ を桁で振って
// 差が λ に比例するか(信号)頭打ちか(床)で分ける。値の窓は張らない — 記録する。
const lams = [null, 0, 1e-12, 1e-6, 1, 1e3, 1e6, 1e9, 1e12, 6.447e12];
const lamRun = await pg.evaluate((lams) => {
  const base = JSON.parse(JSON.stringify(HP.allPresets().find((q) => q.id === 'psrDoubleABDFM')));
  const run = (lam) => {
    const pd = JSON.parse(JSON.stringify(base));
    if (lam !== null) pd.physics = Object.assign({}, pd.physics, { spinSpin: lam });
    const v = HP.validatePreset(pd); const S = HP.sim; S.build(v.preset);
    const dt = 0.016, steps = Math.round(3792 / dt);   // 4.3 公転(1 公転 ≈ 881.9 単位)
    const raw = [];
    let rd1 = 0, rMin = Infinity, rMax = -Infinity, t1 = 0;
    for (let k = 0; k < steps; k++) {
      S.step(dt);
      const dx = S.x[1] - S.x[0], dy = S.y[1] - S.y[0], rr = Math.hypot(dx, dy), th = Math.atan2(dy, dx);
      const dvx = S.vx[1] - S.vx[0], dvy = S.vy[1] - S.vy[0], rd = (dx * dvx + dy * dvy) / rr;
      if (rr < rMin) rMin = rr; if (rr > rMax) rMax = rr;
      if (k >= 1 && rd1 < 0 && rd >= 0) {              // 方式A(r·v 交差)+ D2 の 3 つの柵
        const fr = (rd !== rd1) ? (-rd1 / (rd - rd1)) : 0;
        let a1 = t1, a2 = th; while (a2 - a1 > Math.PI) a2 -= 2 * Math.PI; while (a2 - a1 < -Math.PI) a2 += 2 * Math.PI;
        raw.push({ ang: a1 + fr * (a2 - a1), k: k - 1 + fr, r: rr });
      }
      t1 = th; rd1 = rd;
    }
    const mid = 0.5 * (rMin + rMax), keep = [];
    for (const p of raw.filter((q) => q.r < mid))
      if (!keep.length || (p.k - keep[keep.length - 1].k) * dt >= 0.5 * 881.9) keep.push(p);
    const dAng = [], dP = []; let jump = 0;
    for (let i = 1; i < keep.length; i++) {
      let z = keep[i].ang - keep[i - 1].ang;
      while (z > Math.PI) z -= 2 * Math.PI; while (z < -Math.PI) z += 2 * Math.PI;
      if (Math.abs(z) > Math.PI / 2) { jump++; continue; }
      dAng.push(z * 180 / Math.PI); dP.push((keep[i].k - keep[i - 1].k) * dt);
    }
    const o = []; for (let i = 0; i < S.n; i++) o.push(S.x[i], S.y[i], S.vx[i], S.vy[i]);
    const mean = (a) => a.length ? a.reduce((x, y) => x + y, 0) / a.length : null;
    return { o, hasSS: S.hasSpinSpin, nPeri: keep.length, nRaw: raw.length, jump,
      dAng, dP, dPeriMean: mean(dAng), pMean: mean(dP),
      Q: [HP.dfmSpinDipoleMoment(0), HP.dfmSpinDipoleMoment(1)], nan: S.hasNaN(),
      clamp: S.clampVN + S.clampSN + S.clampRN + S.clampTN };
  };
  const bit = (a, b) => a.o.length === b.o.length && a.o.every((z, i) => Object.is(z, b.o[i]));
  const maxAbs = (a, b) => Math.max(...a.o.map((z, i) => Math.abs(z - b.o[i])));
  const ref = run(0);
  const rows = [];
  for (const lam of lams) {
    const r = run(lam);
    rows.push({ lam, bitSame: bit(ref, r), dMax: maxAbs(ref, r), hasSS: r.hasSS,
      nPeri: r.nPeri, nRaw: r.nRaw, jump: r.jump, dPeriMean: r.dPeriMean, pMean: r.pMean,
      dAng: r.dAng, dP: r.dP, nan: r.nan, clamp: r.clamp });
  }
  return { Q: ref.Q, rows };
}, lams);

// ------------------------------------------------------------------- C(D2): 測定手続き
const dts = FAST ? [0.016, 0.008] : [0.016, 0.008, 0.004];
const d2 = [];
for (const carry of ['double', 'legacy']) {
  for (const dt of dts) {
    const r = await pg.evaluate(({ dt, carry }) => {
      const pd = JSON.parse(JSON.stringify(HP.allPresets().find((q) => q.id === 'psrDoubleABDFM')));
      pd.physics = Object.assign({}, pd.physics);
      if (carry === 'legacy') delete pd.physics.stateCarry; else pd.physics.stateCarry = 'double';
      const v = HP.validatePreset(pd); const S = HP.sim; S.build(v.preset);
      const tEnd = 5.6 * 881.9, steps = Math.round(tEnd / dt);
      // --- 2 方式の検出器を同じ走行で同時に回す ---
      const A = [], Bd = [];                       // A=r·v 交差 / B=距離極小の放物線
      let r2 = 0, r1 = 0, t2 = 0, t1 = 0, rd1 = 0;
      let rMin = Infinity, rMax = -Infinity;
      for (let k = 0; k < steps; k++) {
        S.step(dt);
        const dx = S.x[1] - S.x[0], dy = S.y[1] - S.y[0];
        const rr = Math.hypot(dx, dy), th = Math.atan2(dy, dx);
        const dvx = S.vx[1] - S.vx[0], dvy = S.vy[1] - S.vy[0];
        const rd = (dx * dvx + dy * dvy) / rr;     // ṙ = r·v/|r|
        if (rr < rMin) rMin = rr; if (rr > rMax) rMax = rr;
        // 方式A: ṙ の − → + 交差(線形内挿)
        if (k >= 1 && rd1 < 0 && rd >= 0) {
          const fr = (rd !== rd1) ? (-rd1 / (rd - rd1)) : 0;
          let a1 = t1, a2 = th; while (a2 - a1 > Math.PI) a2 -= 2 * Math.PI; while (a2 - a1 < -Math.PI) a2 += 2 * Math.PI;
          A.push({ ang: a1 + fr * (a2 - a1), k: k - 1 + fr, r: rr });
        }
        // 方式B: 距離極小の放物線頂点(3 点)
        if (k >= 2 && r1 < r2 && r1 < rr) {
          const dd = (r2 - 2 * r1 + rr), fr = (dd !== 0) ? 0.5 * (r2 - rr) / dd : 0;
          let a1 = t2, a2 = t1, a3 = th;
          while (a2 - a1 > Math.PI) a2 -= 2 * Math.PI; while (a2 - a1 < -Math.PI) a2 += 2 * Math.PI;
          while (a3 - a2 > Math.PI) a3 -= 2 * Math.PI; while (a3 - a2 < -Math.PI) a3 += 2 * Math.PI;
          Bd.push({ ang: a2 + 0.5 * fr * (a3 - a1) + 0.5 * fr * fr * (a3 - 2 * a2 + a1), k: k - 1 + fr, r: r1 });
        }
        r2 = r1; r1 = rr; t2 = t1; t1 = th; rd1 = rd;
      }
      // --- 契約(3 つの柵)を掛けてから 5 近点の位相 fit ---
      const fit = (raw) => {
        const mid = 0.5 * (rMin + rMax);
        const peri = raw.filter((p) => p.r < mid);              // ①近点/遠点の区別
        const rej = { apo: raw.length - peri.length, dup: 0, jump: 0 };
        const keep = [];
        for (const p of peri) {                                  // ②一周に近点 1 つ(間隔の下限)
          if (keep.length && (p.k - keep[keep.length - 1].k) * dt < 0.5 * 881.9) { rej.dup++; continue; }
          keep.push(p);
        }
        const use = keep.slice(0, 5);
        const ang = [], kk = [];
        for (let i = 0; i < use.length; i++) {
          let a = use[i].ang;
          if (i) { let z = a - ang[i - 1]; while (z > Math.PI) z -= 2 * Math.PI; while (z < -Math.PI) z += 2 * Math.PI;
            if (Math.abs(z) > Math.PI / 2) { rej.jump++; break; }   // ③半周ジャンプ拒否
            a = ang[i - 1] + z; }
          ang.push(a); kk.push(i);
        }
        // 位相 fit: θ_i = θ₀ + slope·i(最小二乗)
        const n = ang.length; let slope = null, resid = null;
        if (n >= 2) {
          const mx = (n - 1) / 2, my = ang.reduce((a, b) => a + b, 0) / n;
          let sxy = 0, sxx = 0;
          for (let i = 0; i < n; i++) { sxy += (i - mx) * (ang[i] - my); sxx += (i - mx) * (i - mx); }
          slope = sxy / sxx;
          resid = Math.sqrt(ang.reduce((s, a, i) => s + (a - (my + slope * (i - mx))) ** 2, 0) / n);
        }
        const dAng = []; for (let i = 1; i < n; i++) dAng.push((ang[i] - ang[i - 1]) * 180 / Math.PI);
        const per = []; for (let i = 1; i < use.length; i++) per.push((use[i].k - use[i - 1].k) * dt);
        return { nRaw: raw.length, nPeri: n, rej, slopeDeg: slope === null ? null : slope * 180 / Math.PI,
          residDeg: resid === null ? null : resid * 180 / Math.PI, dAng, per };
      };
      return { rMin, rMax, A: fit(A), B: fit(Bd), nan: S.hasNaN(),
        clamp: S.clampVN + S.clampSN + S.clampRN + S.clampTN };
    }, { dt, carry });
    d2.push({ carry, dt, ...r });
    console.error(`  D2 done: carry=${carry} dt=${dt}`);
  }
}

console.log(JSON.stringify({ ladder, lamRun, d2 }, null, 1));
await browser.close();
