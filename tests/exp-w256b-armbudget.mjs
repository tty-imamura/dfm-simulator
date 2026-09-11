// 第256便b W2「腕の所要力(arm budget)—— 腕を保つのに要る ε と Q_T を先に測る」(第48報)。
//
// 原仮定者(第48報・原文は docs/PHYSICS.md 〔第256便b〕に引用):
//   「渦巻き銀河や棒渦巻銀河は、棒状に天体を引き付ける腕の生成に必要な力の大きさを先に計算する。
//    後から整合する理論を選択すれば良い」
//
// **「腕が自律生成した」とは 1 行も書かない**。ここで測るのは「**外力で腕を保ったときに要った力の量**」である。
// 回転ポテンシャル Φ_arm は **器の中だけ**で粒子へ当てる(S.step の後に Δv=a·dt を足す蹴り)。
// **エンジンの opt-in にはしていない**(physics/overlays に鍵は 1 つも増えていない)。
// **プリセットは読むが 1 文字も書き換えない**(診断コピーの粒子配列だけを触る)。
//
// 測る量:
//   ① 純関数の門 —— 解析勾配 vs 有限差分・∂ₜΦ=Ω_p τ の恒等・r=0 で 0・ε=0 で 0・ChatGPT §5 の数値例。
//   ② 予算表   —— 🎠 の円盤で実測した (r, v_c, σ⊥, w) から ε_req=σ⊥²/(w²v_c²f|∇ψ|²)・Q_T=mεf。
//   ③ ε 掃引   —— ε ∈ {0, 0.03, 0.0625, 0.125, 0.25} を外力として当て、A₂・腕の幅 w・位相速度・
//                  加熱(σ⊥ の増加)を測る。棒(pitch=90°・m=2)も同じ器で。
//   ④ 突き合わせ —— 掃引で実際に保たれた腕の (w, σ⊥) を ② の式へ戻し、ε_req と ε_applied を並べる。
//
// 実行: node tests/exp-w256b-armbudget.mjs [--gate] [--budget] [--sweep]
// 出力: tests/out/armbudget-w256b.json(未コミット —— 数値は PHYSICS に全載)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + (path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET));
const OUT = process.env.W256B_ARM_OUT || path.join(ROOT, 'tests', 'out', 'armbudget-w256b.json');
const argv = process.argv.slice(2);
const only = argv.filter((a) => a.startsWith('--')).map((a) => a.slice(2));
const want = (k) => !only.length || only.includes(k);
const STEPS = Number(process.env.W256B_STEPS || 2000);

let browser;
try { const { chromium } = await import('playwright'); browser = await chromium.launch(); }
catch {
  const { chromium } = await import('playwright');
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
}
const pg = await browser.newPage();
const pageErrors = [];
pg.on('pageerror', (e) => pageErrors.push(String(e)));
await pg.goto(INDEX, { waitUntil: 'load' });
await pg.waitForFunction(() => window.HP && HP.sim);

const out = { target: TARGET, node: process.version, at: new Date().toISOString(), wave: '256b', steps: STEPS };

await pg.evaluate(() => {
  const A = (window.__w256arm = {});
  A.build = () => {
    const pd = JSON.parse(JSON.stringify(HP.allPresets().find((p) => p.id === 'galaxyMeshSpiral')));
    const v = HP.validatePreset(pd);
    const S = HP.sim; S.build(v.preset); return S;
  };
  // 帯(r ビン)の測定 —— ψ は腕の位相(腕の尾根は Φ の谷 ψ=π)。
  //   w      = rms(|Δψ|)/|∇ψ|         … 尾根からの垂直距離の rms(**腕の幅**)
  //   sigma  = rms((v−<v>)·n̂)         … 尾根に垂直な速度分散(n̂=∇ψ/|∇ψ|)
  //   A2     = |Σ m e^{2iθ}|/Σm       … m=2 の振幅
  A.measure = (S, opt, bins) => {
    const m = opt.m, cot = opt.cot, om = opt.omega, Rb = opt.Rb, t = S.t;
    const rows = [];
    for (const B of bins) {
      const list = [];
      let M = 0, sVphi = 0, sVr = 0, sc = 0, ss = 0;
      for (let i = 0; i < S.n; i++) {
        const x = S.x[i], y = S.y[i], r = Math.hypot(x, y);
        if (!(r >= B[0] && r < B[1])) continue;
        const mi = S.m[i]; if (!(mi > 0)) continue;
        const th = Math.atan2(y, x);
        const vphi = (x * S.vy[i] - y * S.vx[i]) / r, vr = (x * S.vx[i] + y * S.vy[i]) / r;
        M += mi; sVphi += mi * vphi; sVr += mi * vr;
        sc += mi * Math.cos(2 * th); ss += mi * Math.sin(2 * th);
        list.push({ i, r, th, vphi, vr, m: mi });
      }
      if (!(M > 0) || list.length < 4) { rows.push(null); continue; }
      const vBar = sVphi / M, vrBar = sVr / M;
      const A2 = Math.hypot(sc, ss) / M, psi2 = Math.atan2(ss, sc);
      let sdp = 0, sPerp = 0, sRad = 0, wM = 0;
      for (const P of list) {
        const gTh = m / P.r, gR = m * cot / P.r, g = Math.hypot(gTh, gR);
        // 腕の位相(尾根 = Φ の谷 = ψ−π が 0)
        let dp = m * (P.th - om * t - Math.log(P.r / Rb) * cot) - Math.PI;
        dp = dp - 2 * Math.PI * Math.round(dp / (2 * Math.PI));         // (−π,π] へ畳む
        // m 本の尾根があるので位相差は ±π/1 でなく ±π のまま(ψ は既に m 倍されている)
        const perp = dp / g;                                            // 尾根からの垂直距離
        // 尾根に垂直な向き n̂ = (∇ψ)/|∇ψ| を (r̂,φ̂) 成分で: ∇ψ = (−m cot/r) r̂ + (m/r) φ̂
        const nr = (-gR) / g, nph = gTh / g;
        const dv = (P.vr - vrBar) * nr + (P.vphi - vBar) * nph;
        sdp += P.m * perp * perp; sPerp += P.m * dv * dv;
        sRad += P.m * (P.vr - vrBar) * (P.vr - vrBar);
        wM += P.m;
      }
      rows.push({ r: 0.5 * (B[0] + B[1]), count: list.length, mass: M,
        vc: vBar, A2, psi2, width: Math.sqrt(sdp / wM),
        sigmaPerp: Math.sqrt(sPerp / wM), sigmaR: Math.sqrt(sRad / wM) });
    }
    return rows;
  };
  // 外力(**器の中だけ** —— S.step の後に Δv = a·dt を足す)。pinned は動かさない
  A.kick = (S, dt, opt) => {
    for (let i = 0; i < S.n; i++) {
      if (S.pinned && S.pinned[i]) continue;
      const P = HP.dfmArmPotential(S.x[i], S.y[i], S.t, opt);
      if (!P) continue;
      S.vx[i] += P.ax * dt; S.vy[i] += P.ay * dt;
    }
  };
  A.BINS = [[40, 80], [80, 120], [120, 160], [160, 200], [200, 250]];
});

// ============================================================ ① 純関数の門
if (want('gate')) {
  out.gate = await pg.evaluate(() => {
    const o = {};
    // ChatGPT §5 の数値例(r=5・v_c=200・σ⊥=20・w=0.5・m=2・i=90°・f=1 → ε=0.25・Q_T=0.5)
    const b = HP.dfmArmBudget({ r: 5, vc: 200, sigma: 20, width: 0.5, m: 2, pitch: 90, f: 1 });
    o.example = b;
    o.exampleErr = { eps: Math.abs(b.epsilon - 0.25), QT: Math.abs(b.QT - 0.5) };
    // 解析勾配 vs 有限差分
    const op = { epsilon: 0.2, vc: 6, Rb: 30, Rout: 220, omega: 0.04, m: 2, pitch: 18 };
    const pts = [[37, -12], [-90, 55], [140, 130], [5, 3], [-200, 10]];
    let gMax = 0, idMax = 0, dtMax = 0;
    const h = 1e-5;
    for (const [x, y] of pts) {
      const P = HP.dfmArmPotential(x, y, 0.37, op);
      const fx = (HP.dfmArmPotential(x + h, y, 0.37, op).Phi - HP.dfmArmPotential(x - h, y, 0.37, op).Phi) / (2 * h);
      const fy = (HP.dfmArmPotential(x, y + h, 0.37, op).Phi - HP.dfmArmPotential(x, y - h, 0.37, op).Phi) / (2 * h);
      gMax = Math.max(gMax, Math.abs(P.ax + fx), Math.abs(P.ay + fy));
      idMax = Math.max(idMax, Math.abs(P.dPhidt - op.omega * P.torque));
      const ft = (HP.dfmArmPotential(x, y, 0.37 + h, op).Phi - HP.dfmArmPotential(x, y, 0.37 - h, op).Phi) / (2 * h);
      dtMax = Math.max(dtMax, Math.abs(P.dPhidt - ft));
    }
    o.fd = { gradMax: gMax, identityMax: idMax, dtMax: dtMax, h };
    o.zeroR = HP.dfmArmPotential(0, 0, 1, op);
    const z = HP.dfmArmPotential(40, 20, 1, Object.assign({}, op, { epsilon: 0 }));
    o.zeroEps = { Phi: z.Phi, ax: z.ax, ay: z.ay };
    // 棒(i=90°)は cot=0(厳密)・腕の半径波数 0
    o.bar = HP.dfmArmBudget({ r: 100, vc: 5, sigma: 1, width: 20, m: 2, pitch: 90 });
    o.spiral = HP.dfmArmBudget({ r: 100, vc: 5, sigma: 1, width: 20, m: 2, pitch: 18 });
    o.gates = {
      badR: HP.dfmArmBudget({ r: 0, vc: 5, sigma: 1, width: 2 }) === null,
      badVc: HP.dfmArmBudget({ r: 5, vc: 0, sigma: 1, width: 2 }) === null,
      badW: HP.dfmArmBudget({ r: 5, vc: 5, sigma: 1, width: 0 }) === null,
      badPitch0: HP.dfmArmBudget({ r: 5, vc: 5, sigma: 1, width: 2, pitch: 0 }) === null,
      badPitch91: HP.dfmArmBudget({ r: 5, vc: 5, sigma: 1, width: 2, pitch: 91 }) === null,
      badF: HP.dfmArmBudget({ r: 5, vc: 5, sigma: 1, width: 2, f: 0 }) === null,
      nanR: HP.dfmArmBudget({ r: NaN, vc: 5, sigma: 1, width: 2 }) === null,
      noOpts: HP.dfmArmBudget() === null,
      potNaN: HP.dfmArmPotential(NaN, 0, 0, op) === null,
      potBadRb: HP.dfmArmPotential(1, 1, 0, { Rb: 0 }) === null,
      potBadPitch: HP.dfmArmPotential(1, 1, 0, { pitch: 0 }) === null,
    };
    return o;
  });
  console.log('§GATE done');
}

// ============================================================ ② 予算表(🎠 の円盤の実測値から)
if (want('budget')) {
  out.budget = await pg.evaluate(() => {
    const A = window.__w256arm;
    const S = A.build();
    for (let k = 0; k < 2000; k++) S.step(0.016);
    const rows = A.measure(S, { m: 2, cot: 0, omega: 0, Rb: 30 }, A.BINS);
    const tbl = [];
    for (const R of rows) {
      if (!R) continue;
      for (const pitch of [90, 20, 10]) {
        const b = HP.dfmArmBudget({ r: R.r, vc: R.vc, sigma: R.sigmaR, width: 0.25 * R.r, m: 2, pitch, f: 1 });
        tbl.push({ r: R.r, vc: R.vc, sigma: R.sigmaR, width: 0.25 * R.r, pitch,
          gradPsi: b.gradPsi, epsilon: b.epsilon, QT: b.QT, aWidth: b.aWidth, aAxis: b.aAxis,
          forceRatio: b.forceRatio });
      }
    }
    // ChatGPT §5 の例の再掲(単位は kpc・km/s —— **このアプリの単位ではない**)
    const ex = HP.dfmArmBudget({ r: 5, vc: 200, sigma: 20, width: 0.5, m: 2, pitch: 90, f: 1 });
    return { disk: rows, table: tbl, chatgptExample: ex, t: S.t };
  });
  console.log('§BUDGET done');
}

// ============================================================ ③④ ε 掃引(外力で保った腕)
if (want('sweep')) {
  out.sweep = await pg.evaluate((STEPS) => {
    const A = window.__w256arm, dt = 0.016;
    // 位相速度は円盤自身の Ω(r_co) から採る(**観測から入れない**)
    const S0 = A.build();
    for (let k = 0; k < 2000; k++) S0.step(0.016);
    const base = A.measure(S0, { m: 2, cot: 0, omega: 0, Rb: 30 }, A.BINS);
    const co = base[2];                                 // r≈140 の帯を共回転に置く
    const omegaP = co.vc / co.r, vcRef = co.vc;
    const runs = [];
    for (const pitch of [90, 20]) {
      const pr = pitch * Math.PI / 180;
      const cot = (Math.abs(pitch - 90) < 1e-12) ? 0 : Math.cos(pr) / Math.sin(pr);
      for (const eps of [0, 0.03, 0.0625, 0.125, 0.25]) {
        const opt = { epsilon: eps, vc: vcRef, Rb: 30, Rout: 220, omega: omegaP, m: 2, pitch };
        const S = A.build();
        const m0 = A.measure(S, { m: 2, cot, omega: omegaP, Rb: 30 }, A.BINS);
        for (let k = 0; k < STEPS; k++) { S.step(dt); if (eps > 0) A.kick(S, dt, opt); }
        const mPre = A.measure(S, { m: 2, cot, omega: omegaP, Rb: 30 }, A.BINS);
        const tPre = S.t;
        // 位相速度の基線は 600 步(t=9.6)—— 最内帯 r=60 でも m=2 の位相が π を跨がない長さ
        for (let k = 0; k < 600; k++) { S.step(dt); if (eps > 0) A.kick(S, dt, opt); }
        const mPost = A.measure(S, { m: 2, cot, omega: omegaP, Rb: 30 }, A.BINS);
        const dtP = S.t - tPre;
        const bins = mPre.map((R, j) => {
          if (!R || !mPost[j] || !m0[j]) return null;
          let d = mPost[j].psi2 - R.psi2;
          while (d > Math.PI) d -= 2 * Math.PI;
          while (d < -Math.PI) d += 2 * Math.PI;
          const b = HP.dfmArmBudget({ r: R.r, vc: R.vc, sigma: R.sigmaPerp, width: R.width, m: 2, pitch, f: 1 });
          return { r: R.r, count: R.count, vc: R.vc, A2: R.A2, A2_0: m0[j].A2,
            width: R.width, sigmaPerp: R.sigmaPerp, sigmaPerp0: m0[j].sigmaPerp,
            sigmaR: R.sigmaR, sigmaR0: m0[j].sigmaR,
            omegaPattern: d / (2 * dtP), omegaP,
            epsReq: b ? b.epsilon : null, QTreq: b ? b.QT : null, forceRatio: b ? b.forceRatio : null };
        });
        runs.push({ pitch, eps, omegaP, vcRef, nan: S.hasNaN(), t: S.t, bins });
      }
    }
    return { omegaP, vcRef, coRadius: co.r, base, runs };
  }, STEPS);
  console.log('§SWEEP done runs=' + out.sweep.runs.length);
}

out.pageErrors = pageErrors;
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log('written', OUT, 'pageErrors', pageErrors.length);
await browser.close();
