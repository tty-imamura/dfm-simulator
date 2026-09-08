// 第247便a(第39報 最優先「コンパクト天体連星の重力磁気 — 係数や質量の補正も含めて様々な手段を講じる」)。
//   R  : leapfrog の SS 半キック分割の**可逆性試験**(150 単位前進 → v 反転 → 150 単位)
//   D2 : 引きずり場の倍精度化(physics.framePrecision:"double")での ⚡ 近点移動の dt 収束表
//        (native vs frame × dt 5 段 × 近点検出 2 方式 — 検出手続きは第246便b と同一)
//   CAL: ⚡ の f/λ 掃引(粗掃引 → 近傍の細分)。**⚡ 本体の claim/質量は変えない** — 較正候補を測るだけ
//   M  : 「手段」表 — 3 系(⚡ NS–NS・🎻 BH・🪨 太陽–水星)を **HP.dfmCompactMeasures の同じ無次元則**で同時評価
// 実行: node tests/exp-w247a.mjs [--rev] [--d2] [--cal] [--measures] [--fast]
//       (節を 1 つも指定しなければ全部。--fast は D2 の dt=0.001 と CAL の細分を省く)
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
  // ⚡ の f/λ 変種を組む。位置・速度は**質量比だけで決まる**(f に依らない — 遠点整列の重心配分)ので
  // 触らない。f が動かすのは m と core.massFrac=(f−1)/f だけ(殻質量=観測質量の記帳・第224便)。
  window.__w247psr = (f, lam) => {
    const pd = JSON.parse(JSON.stringify(HP.allPresets().find((q) => q.id === 'psrDoubleABDFM')));
    const f0 = pd.massCalibration.factor;                    // 現行の較正 f(=1.999942269345993)
    for (const b of pd.bodies) {
      b.m = b.m / f0 * f;                                    // 観測質量 × 新しい f
      if (b.core) b.core.massFrac = (f - 1) / f;
    }
    pd.physics = Object.assign({}, pd.physics, { framePrecision: 'double' });
    if (lam) pd.physics.spinSpin = lam;
    delete pd.massCalibration;                               // 台帳の三者一致検査を持ち込まない(実験用)
    return pd;
  };
  // 近点検出(第246便b の手続きそのまま): 検出器 A=ṙ の −→+ 交差(線形内挿)/ B=距離極小の放物線頂点。
  // 柵 ①近点/遠点の区別 ②一周に近点 1 つ ③半周ジャンプ拒否。5 近点の位相を直線 fit。
  window.__w247peri = (S, dt, tEnd, pRef) => {
    const steps = Math.round(tEnd / dt);
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
      const use = keep.slice(0, 5), ang = [];
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

  // 「手段」表: 3 系を **同じ rule** で評価する(HP.dfmCompactMeasures が正本)。
  window.__w247measures = () => {
    const get = (id) => HP.allPresets().find((q) => q.id === id);
    const psr = get('psrDoubleABDFM'), gw = get('gw150914DFM'), me = get('mercuryRealKF1');
    const fP = psr.massCalibration.factor, fG = gw.massCalibration.factor;
    // --- ⚡ NS–NS(観測の自転と半径をそのまま Q へ。Ξ は観測質量で測る)---
    const NS = { name: '⚡ J0737−3039A/B(NS–NS)', G: psr.physics.G, c: psr.physics.cLight,
      eps: psr.physics.softening, r: Math.abs(psr.bodies[1].x - psr.bodies[0].x),
      a: { m: psr.bodies[0].m / fP, R: psr.bodies[0].spinDipole.radius, omega: psr.bodies[0].spinDipole.omega },
      b: { m: psr.bodies[1].m / fP, R: psr.bodies[1].spinDipole.radius, omega: psr.bodies[1].spinDipole.omega },
      orbit: { a: 878.8366, e: 0.087777036, orbitsPerCentury: 100 * 365.25 * 86400 / 8834.534723278 } };
    // --- 🎻 BH(Kerr Q=χGm²/c・χ=0.7・**観測質量の R_s**)---
    const mA = gw.bodies[0].m / fG, mB = gw.bodies[1].m / fG, cG = gw.physics.cLight, GG = gw.physics.G;
    const RsA = 2 * GG * mA / (cG * cG), RsB = 2 * GG * mB / (cG * cG);
    const rGw = Math.abs(gw.bodies[1].x - gw.bodies[0].x), RsT = 2 * GG * (mA + mB) / (cG * cG);
    const BH = (r) => ({ name: '🎻 GW150914(BH–BH)', G: GG, c: cG, eps: gw.physics.softening, r,
      a: { m: mA, kind: 'kerr', chi: 0.7, Rbody: RsA },
      b: { m: mB, kind: 'kerr', chi: 0.7, Rbody: RsB } });
    // --- 🪨 太陽–水星(観測の自転と半径 — 較正系。ここは触らない=無傷であることを示す対照)---
    const SM = { name: '🪨 太陽–水星', G: me.physics.G, c: me.physics.cLight, eps: me.physics.softening,
      r: me.bodies[1].x,
      a: { m: me.bodies[0].m, R: me.bodies[0].radius, omega: me.bodies[0].spin },
      b: { m: me.bodies[1].m, R: me.bodies[1].radius, omega: me.bodies[1].spin },
      orbit: { a: 579.09, e: 0.20563, orbitsPerCentury: 100 * 365.25 / 87.9691 } };
    const systems = { NS, BH_now: BH(rGw), BH_5Rs: BH(5 * RsT), SM };
    const ev = (rule) => {
      const o = {};
      for (const k of Object.keys(systems)) o[k] = HP.dfmCompactMeasures(systems[k], rule);
      return o;
    };
    // η(⚡)を目標へ届かせる α(コンパクトネス則)と β(慣性則)を**解析で解く**(2 次方程式)
    const base = HP.dfmCompactMeasures(NS, {});
    const Xa = base.Xi[0], Xb = base.Xi[1], target = 1e-5, Rt = target / base.eta;
    const quad = (A, B) => { const a = A * B, b = A + B, c = 1 - Rt;
      return (a !== 0) ? (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a) : -c / b; };
    const alpha = quad(Xa * Xa, Xb * Xb);            // λ_eff=λ(1+αΞ_a²)(1+αΞ_b²)
    const betaR = quad(Xa, Xb);                      // Q_i×=(1+βΞ_i)
    const rules = [
      { id: 'base', label: 'λ=1(物理係数 G/c²)・f=1', rule: {} },
      { id: 'massF', label: '(1) 質量補正 f≈2 を掛ける', rule: { f: 2 } },
      { id: 'lamCommon', label: '(2) 共通 λ=1e11(⚡ を見せる用量)', rule: { lambda: 1e11 } },
      { id: 'compact', label: '(3) コンパクトネス則 λ_eff=λ₀(1+αΞ²)', rule: { alphaXi: alpha } },
      { id: 'inertia', label: '(4) 慣性則 Γ(1+βΞ)', rule: { betaXi: betaR } },
      { id: 'kidder', label: '(5) Kidder 符号 λ=−1', rule: { lambda: -1 } },
      { id: 'compactMass', label: '(3)+(1) コンパクトネス則 × f≈2', rule: { alphaXi: alpha, f: 2 } }
    ];
    // 合否の宣言(3 系**同時**の条件 — これが「共通則」の定義)
    //   visible : ⚡ で η ≥ 1e-5(数値床 ±0.01°/周 から符号のある信号が出る水準)
    //   bhBound : 🎻 の合体直前(r=5R_s)で |η| ≤ 0.1(ニュートン力の 10% 未満 = まだ束縛連星)
    //   solarSafe: 🪨 の 1/r⁴ 由来 |Δϖ| ≤ 0.1 ″/世紀(43″/世紀 の較正を 0.25% 以上動かさない)
    const judge = (v) => ({
      visible: Math.abs(v.NS.eta) >= 1e-5 * (1 - 1e-6),
      bhBound: Math.abs(v.BH_5Rs.eta) <= 0.1,
      solarSafe: Math.abs(v.SM.dPeriArcsecPerCentury) <= 0.1
    });
    const rows = rules.map((r) => {
      const v = ev(r.rule); const j = judge(v);
      return { id: r.id, label: r.label, rule: r.rule, v, ok: j, allThree: j.visible && j.bhBound && j.solarSafe };
    });
    // **単調な** g(Ξ) では 3 系を同時に満たせないことの数量化:
    //   ⚡ を見せるのに要る 1 体あたりの増幅 √Rt に対し、🎻 が束縛を保てる上限は √(1e-2/η_BH(5R_s))。
    //   Ξ_BH=0.5 > Ξ_NS≈0.16 なので、単調増加の g は必ず BH 側を NS 以上に増幅する = 構造的に不可能。
    const bh0 = HP.dfmCompactMeasures(systems.BH_5Rs, {});
    const gNeedNS = Math.sqrt(Rt), gMaxBH = Math.sqrt(0.1 / Math.abs(bh0.eta));
    return { alpha, betaR, target, Rt, gNeedNS, gMaxBH, gDropRequired: gNeedNS / gMaxBH,
      Xi: { NS: base.Xi, BH: [0.5, 0.5], SM: HP.dfmCompactMeasures(SM, {}).Xi },
      etaBase: { NS: base.eta, BH_now: HP.dfmCompactMeasures(systems.BH_now, {}).eta, BH_5Rs: bh0.eta,
        SM: HP.dfmCompactMeasures(SM, {}).eta },
      geom: { rPsrApo: NS.r, rGw, RsA, RsB, RsT, r5Rs: 5 * RsT, fP, fG }, rows };
  };
});

const out = {};

// ============================================================ R: 可逆性(SS 半キック分割)
if (want('rev')) {
  out.rev = await pg.evaluate(() => {
    const S = HP.sim;
    const mk = (lam) => {
      const pd = JSON.parse(JSON.stringify(HP.allPresets().find((q) => q.id === 'spinDipoleBinary')));
      pd.integrator = 'leapfrog';                       // 可逆積分器(第35便)
      pd.physics = Object.assign({}, pd.physics, { spinSpin: lam });
      const v = HP.validatePreset(pd); S.build(v.preset);
      return v.warnings.length;
    };
    const trial = (lam, dt, T, kind) => {
      const w = mk(lam);
      const x0 = []; for (let i = 0; i < S.n; i++) x0.push(S.x[i], S.y[i]);
      const n = Math.round(T / dt);
      const old = () => { S._spinSpin(dt); S._core(dt, 1); S._core(dt, 2); };             // 第245便の 1 次分割
      const half = () => { S._spinSpin(dt * .5); S._core(dt, 1); S._core(dt, 2); S._spinSpin(dt * .5); };
      const eng = () => S.step(dt);                                                        // 本体(= half のはず)
      const f = (kind === 'old') ? old : (kind === 'engine') ? eng : half;
      for (let k = 0; k < n; k++) f();
      const mid = []; for (let i = 0; i < S.n; i++) mid.push(S.x[i], S.y[i]);
      for (let i = 0; i < S.n; i++) { S.vx[i] = -S.vx[i]; S.vy[i] = -S.vy[i]; }
      for (let k = 0; k < n; k++) f();
      let e = 0;
      for (let i = 0; i < S.n; i++) e = Math.max(e, Math.abs(S.x[i] - x0[2 * i]), Math.abs(S.y[i] - x0[2 * i + 1]));
      return { lam, dt, T, kind, warn: w, err: e, mid, nan: S.hasNaN(), clamp: S.clampVN + S.clampSN };
    };
    const rows = [];
    for (const kind of ['old', 'half', 'engine']) {
      for (const dt of [0.016, 0.008]) rows.push(trial(200, dt, 150, kind));
      rows.push(trial(200, 0.016, 600, kind));         // 長い窓(ChatGPT v5 §7 と同じ 600 単位)
    }
    rows.push(trial(0, 0.016, 150, 'engine'));         // λ=0 の対照(leapfrog 自体の可逆性の床)
    rows.push(trial(0, 0.016, 600, 'engine'));
    const a = rows.find((r) => r.kind === 'half' && r.dt === 0.016).mid;
    const b = rows.find((r) => r.kind === 'engine' && r.dt === 0.016).mid;
    const bitSame = a.every((z, i) => Object.is(z, b[i]));
    for (const r of rows) delete r.mid;
    return { rows, engineIsHalfKick: bitSame };
  });
  console.error('  rev done');
}

// ============================================================ D2: framePrecision の dt 収束
if (want('d2')) {
  const dts = FAST ? [0.016, 0.008, 0.004, 0.002] : [0.016, 0.008, 0.004, 0.002, 0.001];
  const rows = [];
  for (const prec of ['native', 'frame']) {
    for (const dt of dts) {
      const r = await pg.evaluate(({ dt, prec }) => {
        const pd = JSON.parse(JSON.stringify(HP.allPresets().find((q) => q.id === 'psrDoubleABDFM')));
        pd.physics = Object.assign({}, pd.physics);
        if (prec === 'frame') pd.physics.framePrecision = 'double';
        const v = HP.validatePreset(pd); const S = HP.sim; S.build(v.preset);
        return window.__w247peri(S, dt, 5.6 * 881.9, 881.9);
      }, { dt, prec });
      rows.push({ prec, dt, ...r });
      console.error(`  D2 done: ${prec} dt=${dt}`);
    }
  }
  out.d2 = rows;
}

// ============================================================ CAL: ⚡ の f/λ 掃引
if (want('cal')) {
  const run = (f, lam, dt) => pg.evaluate(({ f, lam, dt }) => {
    const S = HP.sim; S.build(HP.validatePreset(window.__w247psr(f, lam)).preset);
    return window.__w247peri(S, dt, 5.6 * 881.9, 881.9);
  }, { f, lam, dt });
  const coarse = [];
  for (const f of [1.995, 2, 2.005]) {
    for (const lam of [-1e12, 0, 1e12]) {
      coarse.push({ f, lam, dt: 0.004, ...(await run(f, lam, 0.004)) });
      console.error(`  CAL coarse: f=${f} lam=${lam}`);
    }
  }
  out.calCoarse = coarse;
  if (!FAST) {
    const fine = [];
    for (const [f, lam, dt] of [
      [1.999914, 8.0e10, 0.004], [1.999914, 1.0e11, 0.004], [1.999914, 1.2e11, 0.004],
      [1.999914, 1.0e11, 0.002], [1.999914, 1.0e11, 0.001],
      [1.999942269345993, 1.0e11, 0.002]]) {
      fine.push({ f, lam, dt, ...(await run(f, lam, dt)) });
      console.error(`  CAL fine: f=${f} lam=${lam} dt=${dt}`);
    }
    out.calFine = fine;
  }
}

// ============================================================ SAMPLE: 🧿 variant の実測(obsCard の裏取り)
if (want('sample')) {
  const rows = [];
  for (const [id, dt] of [['psrDoubleABSpinCal', 0.001], ['psrDoubleABSpinCal', 0.002], ['psrDoubleABSpinCalOff', 0.001]]) {
    const r = await pg.evaluate(({ id, dt }) => {
      const pd = JSON.parse(JSON.stringify(HP.allPresets().find((q) => q.id === 'psrDoubleABSpinCal')));
      if (id.endsWith('Off')) pd.physics = Object.assign({}, pd.physics, { spinSpin: 0 });   // A/B の B 側
      const v = HP.validatePreset(pd); const S = HP.sim; S.build(v.preset);
      const o = window.__w247peri(S, dt, 5.6 * 881.9, 881.9);
      o.warn = v.warnings.length; o.hasSS = S.hasSpinSpin;
      return o;
    }, { id, dt });
    rows.push({ id, dt, ...r });
    console.error(`  SAMPLE done: ${id} dt=${dt}`);
  }
  out.sample = rows;
}

// ============================================================ M: 「手段」表(3 系同時評価)
if (want('measures')) {
  out.measures = await pg.evaluate(() => window.__w247measures());
  console.error('  measures done');
}

out.pageErrors = pageErrors;
console.log(JSON.stringify(out, null, 1));
await browser.close();
