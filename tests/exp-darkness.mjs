// 第36便 E2(台帳4-48): 「光学的暗さ」の3機構の分離実験
// - 本スクリプトは QA ではない(合否判定なし)。tests/out/darkness-results.json に計測値を保存する。
// - 対象は 🕶️darkrotor の中心BH。次の4条件で (a)光線の非脱出率 (b)T_obs (c)放射エネルギー流 を測る:
//     1. base      : 現行(lightSweep=1 の数値指定)
//     2. auto      : lightSweep="auto"(第36便 C2 の lS_eff=min(1,|s|R/c_surf))
//     3. zero      : lightSweep=0(掻き出しなしの対照)
//     4. lock-auto : 物理対応ロック Kt=c₀²/G=3600 + auto
// - 併せて (d)E8R がコア差動項を見ない制限(REVIEW_20260724 §7)の再確認、
//   (e)機構①RAY_MASS_MIN(光線計算の省略)の人工性の参考定量 を行う。
// 実行: node tests/exp-darkness.mjs(playwright 必須。約5分)
//   QA_TARGET=beta/index.html node tests/exp-darkness.mjs   … 既定。絶対パスも可(/ で始まれば絶対扱い)
//
// 転記元(確定版は `git show HEAD:beta/index.html` を参照 — 実装ファイルは一切変更していない):
//   traceRay / rayField ....... beta/index.html:3082-3168(E8R 光線積分。RAY_MASS_MIN=40 は :924)
//   E11 放射冷却 .............. beta/index.html:2660-2669(Λ=η_rad·T^p·(1−lSw)、|Δs|≤0.5|s| クランプ)
//   T_obs ..................... beta/index.html:3349(T_obs=obsT·(1−lSw)·½mR²s²)
//   lS_eff(auto)............. beta/index.html:2593-2604(lS_eff=min(1,|s|R/c_surf)、c_surf=c₀e^{−2ψ_surf})
//   E3 フレーム ω ............. beta/index.html:2476-2493(コア差動 ω=s·f(R,d)+coreMR·s·(coreSR−1)·f(Rc,d))
//   捕捉判定 .................. tests/exp-darkrotor.mjs:38-91(実験A: 340步後の終端半径 <300)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + (TARGET.startsWith('/') ? TARGET : path.join(ROOT, TARGET));
const OUT_DIR = path.join(ROOT, 'tests', 'out');
fs.mkdirSync(OUT_DIR, { recursive: true });

const DT = 0.016;                       // tests/qa.mjs / seeds.mjs と同じ 1 step(timeScale は step() に無関係)
const CHECKPOINTS = [0, 300, 1200, 3000];

// ---- 起動(tests/exp-darkrotor.mjs 18-23 と同じフォールバック)----
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

// ---- ページ内共通カーネル(1回だけ注入。以降の evaluate から window.__E2 で使う)----
async function installKernel(page) {
  await page.evaluate(({ DT }) => {
    const K = { DT, RAY_MASS_MIN: 40 /* beta/index.html:924 転記 */ };

    K.drPreset = () => JSON.parse(JSON.stringify(HP.allPresets().find(p => p.id === 'darkrotor')));

    // 条件を適用してビルド。scope: 'bh'=中心BHのみ / 'all'=全 single(BH+ローター10体)
    K.build = ({ sweep, scope = 'bh', Kt = null, core = null, spinBH = null, isolate = false }) => {
      const p = K.drPreset();
      if (Kt !== null) p.physics.Kt = Kt;
      let si = 0;
      for (const b of p.bodies) {
        if (b.type !== 'single') continue;
        const isBH = (si === 0);
        if (sweep !== undefined && (scope === 'all' || isBH)) b.lightSweep = sweep;
        if (isBH && core) {
          b.coreMR = core.coreMR; b.coreSR = core.coreSR;
          if (core.coreRR !== undefined) b.coreRR = core.coreRR;   // Rc=coreRR·R(beta:2316)
        }
        if (isBH && spinBH !== null) b.spin = spinBH;
        si++;
      }
      if (isolate) p.bodies = [p.bodies[0]];    // 中心BHだけの孤立系(自己場のみの対照)
      const v = HP.validatePreset(p);
      HP.sim.build(v.preset);
      return { warnings: (v.warnings || []).length };
    };

    // ---- lS_eff(auto)の独立再計算。beta/index.html:2593-2604 の式を転記 ----
    // エンジンは「サブステップ冒頭の状態」で lSw[] を書くため、t=0(未 step)では 0 のまま。
    // ここでは現在状態から予測値を再計算し、両方を記録して照合する。
    K.lSwPredict = (i) => {
      const s = HP.sim, p = s.params, eps2 = p.softening * p.softening;
      let wExt = p.D0;
      for (let j = 0; j < s.n; j++) {
        if (j === i) continue;
        const dx = s.x[i] - s.x[j], dy = s.y[i] - s.y[j];
        wExt += s.m[j] / Math.sqrt(dx * dx + dy * dy + eps2);
      }
      const Ri = s.R[i];
      const psi = (wExt + s.m[i] / Math.sqrt(Ri * Ri + eps2)) / p.Kt;
      const cS = p.cLight * Math.exp(-2 * psi);
      const ls = Math.abs(s.spin[i]) * Ri / cS;
      return { wExt, psiSurf: psi, cSurf: cS, vSurf: Math.abs(s.spin[i]) * Ri,
        lSeff: Math.min(1, Math.max(0, ls)) };
    };
    // 現在状態での実効 lightSweep(auto は予測値・数値指定はエンジン値)
    K.lSwNow = (i) => {
      const s = HP.sim;
      const engine = s.lSw[i], predicted = K.lSwPredict(i).lSeff;
      return s.lSwAuto[i] ? { value: predicted, source: 'auto/predicted', engine, predicted }
        : { value: engine, source: 'numeric', engine, predicted };
    };

    // ---- (a) 光線の非脱出率(tests/exp-darkrotor.mjs:38-75 実験A の判定を転記)----
    // (-300,y0) から +x 方向へ dl=2.7 で maxSteps 積分し、終端半径<300 を「有限時間非脱出」とする。
    // y<0 = 順行側(中心スピン正のフレームと同方向)/ y>0 = 逆行側。
    K.trace = (y0, steps) => {
      let minR = Infinity, wind = 0, prev = Math.atan2(y0, -300);
      const t = HP.traceRay(HP.sim, -300, y0, 1, 0, 2.7, steps, (px, py) => {
        const r = Math.hypot(px, py); if (r < minR) minR = r;
        const a = Math.atan2(py, px); let d = a - prev;
        while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
        wind += d; prev = a;
      });
      return { endR: Math.hypot(t.x, t.y), minR, wind, end: t.end, x: t.x, y: t.y };
    };
    K.rayStats = () => {
      const ysQA = [10, 40, 80, 120, 160];                      // exp-darkrotor.mjs:57 を転記
      const qa = ysQA.map(y => K.trace(y, 340));                // 逆行側
      const qaN = ysQA.map(y => K.trace(-y, 340));              // 順行側
      const long = ysQA.map(y => K.trace(y, 1020));             // 3倍時間
      let capP = 0, capR = 0, bP = 0, bR = 0, nF = 0, minRs = 0;
      for (let y = 8; y <= 200; y += 8) {                       // 粗ファン(実験Aの step4 → step8)
        nF++;
        const tp = K.trace(-y, 340), tr = K.trace(y, 340);
        minRs += tp.minR + tr.minR;
        if (tp.endR < 300) { capP++; bP = y; }
        if (tr.endR < 300) { capR++; bR = y; }
      }
      return {
        capQAretro: qa.filter(t => t.endR < 300).length,
        capQApro: qaN.filter(t => t.endR < 300).length,
        capLong: long.filter(t => t.endR < 300).length,
        minR: qa.map(t => +t.minR.toFixed(1)),
        wind: qa.map(t => +(t.wind / (2 * Math.PI)).toFixed(2)),
        fan: { n: nF, capPro: capP, capRetro: capR, bCritPro: bP, bCritRetro: bR,
          minRmean: +(minRs / (2 * nF)).toFixed(2),
          rateNonEscape: +((capP + capR) / (2 * nF)).toFixed(4) }
      };
    };

    // ---- (b) T_obs(beta/index.html:3349 を転記)/ 絶対温度 T=Is² ----
    K.tAbs = (i) => { const s = HP.sim; return 0.5 * s.m[i] * s.R[i] * s.R[i] * s.spin[i] * s.spin[i]; };
    K.tObs = (i, lsw) => { const s = HP.sim; return s.obsT[i] * (1 - lsw) * K.tAbs(i); };
    // ---- (c) 放射エネルギー流(beta/index.html:2660-2669 の E11 を転記)----
    // Λ = η_rad·T^p·(1−lSw) が公称放射パワー。|Δs|≤0.5|s| クランプが効くので、
    // 1サブステップで実際に帳簿へ入る dE/dt(clamped)も併記する。
    K.lumin = (i, lsw) => {
      const s = HP.sim, p = s.params, dt = K.DT;
      const etaRad = p.etaRad, pRad = p.pRad, s0 = s.spin[i];
      if (!(etaRad > 0 && s0 !== 0 && s.m[i] > 0 && lsw < 1))
        return { nominal: 0, clamped: 0, clampHit: false, active: false };
      const Ii = 0.5 * s.m[i] * s.R[i] * s.R[i], T = Ii * s0 * s0;
      const nominal = etaRad * Math.pow(T, pRad) * (1 - lsw);
      let dsC = nominal * dt / (Ii * Math.abs(s0));
      const lim = 0.5 * Math.abs(s0);
      const clampHit = dsC > lim; if (clampHit) dsC = lim;
      const s1 = (s0 > 0) ? s0 - dsC : s0 + dsC;
      return { nominal, clamped: 0.5 * Ii * (s0 * s0 - s1 * s1) / dt, clampHit, active: true };
    };

    // ---- u_φ(r): E3 フレーム場(コア差動込み。beta/index.html:2476-2493 と同形)----
    // tests/exp-darkrotor.mjs:180-197 の uphiAt をコア差動項ありなしで切り替えられる形へ拡張。
    K.uphiAt = (r, withCore = true) => {
      const s = HP.sim, p = s.params, eps2 = p.softening * p.softening, q = p.q;
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
          if (withCore && s.coreMR[j] !== 0 && sj !== 0 && s.Rc[j] > 0 && s.coreSR[j] !== 1) {
            const tt = s.Rc[j] / (s.Rc[j] + d);
            om += s.coreMR[j] * sj * (s.coreSR[j] - 1) * Math.pow(tt, q);
          }
          uNx += w * (s.vx[j] + om * (-dy)); uNy += w * (s.vy[j] + om * dx);
        }
        acc += (px * uNy - py * uNx) / r / W;
      }
      return acc / 16;
    };

    // ---- 機構①(RAY_MASS_MIN)参考用: 質量閾値を可変にした光線積分の転記版 ----
    // beta/index.html:3089-3168(rayField+traceRay)からの転記。UniverseBox 経路は
    // 🕶️に箱が無い(S.box===null)ため省略(省略の妥当性は呼び出し側で検査する)。
    K.traceRayT = (px, py, cxv, cyv, dl, maxSteps, massMin) => {
      const S = HP.sim, p = S.params, kU = 2 / p.Kt, eps = p.softening, eps2 = eps * eps,
        q = p.q, c0 = p.cLight, D0 = p.D0, kF = p.kFrame;
      const heavy = [];
      for (let i = 0; i < S.n; i++) if (S.m[i] >= massMin) heavy.push(i);
      let minR = Infinity;
      for (let s2 = 0; s2 < maxSteps; s2++) {
        let gx = 0, gy = 0, uNx = 0, uNy = 0, wSum = 0;
        for (const i of heavy) {
          const dx = px - S.x[i], dy = py - S.y[i], d2 = dx * dx + dy * dy;
          const inv = 1 / Math.sqrt(d2 + eps2), inv3 = inv * inv * inv;
          gx -= kU * S.m[i] * dx * inv3; gy -= kU * S.m[i] * dy * inv3;
          const dd = Math.sqrt(d2), w = S.m[i] * inv;
          wSum += w;
          let om = 0; const si = S.spin[i];
          if (si !== 0) { const tt = S.R[i] / (S.R[i] + dd); om = (q === 2) ? si * tt * tt : si * Math.pow(tt, q); }
          uNx += kF * w * (S.vx[i] + om * (-dy)); uNy += kF * w * (S.vy[i] + om * (dx));
        }
        const dot = gx * cxv + gy * cyv;
        cxv += (gx - dot * cxv) * dl; cyv += (gy - dot * cyv) * dl;
        const cl = Math.sqrt(cxv * cxv + cyv * cyv); cxv /= cl; cyv /= cl;
        const Wtot = D0 + wSum;
        const neff = Math.exp(kU * Wtot);
        const adv = (Wtot > 1e-9) ? (neff / c0) * dl / Wtot : 0;
        px += cxv * dl + uNx * adv; py += cyv * dl + uNy * adv;
        const r = Math.hypot(px, py); if (r < minR) minR = r;
      }
      return { x: px, y: py, cx: cxv, cy: cyv, minR };
    };

    K.bhIndex = 0;          // 🕶️の中心BHは bodies 先頭 = index 0
    K.rotorFast = [1, 6];   // spin 2.0 の対向ローター(x=±200)
    K.rotorSlow = 2;        // spin 0.15 の通常ローター
    K.starIdx = 11;         // 恒星リング先頭(single 11体の直後)
    // 粒子1体の観測量まとめ
    K.probe = (i) => {
      const s = HP.sim, L = K.lSwNow(i), lum = K.lumin(i, L.value), pr = K.lSwPredict(i);
      return { i, spin: s.spin[i], R: s.R[i], lSw: L.value, lSwSource: L.source,
        lSwEngine: L.engine, lSwPredicted: L.predicted,
        cSurf: pr.cSurf, vSurf: pr.vSurf, psiSurf: pr.psiSurf, wExt: pr.wExt,
        tAbs: K.tAbs(i), tObs: K.tObs(i, L.value),
        lumNominal: lum.nominal, lumClamped: lum.clamped, clampHit: lum.clampHit };
    };
    window.__E2 = K;
    return true;
  }, { DT });
}

// ---- 条件1回分(ビルド → チェックポイントごとに (a)(b)(c) を計測)----
async function runCondition(page, cond) {
  return page.evaluate(({ cond, CHECKPOINTS, DT }) => {
    const K = window.__E2;
    K.build({ sweep: cond.sweep, scope: cond.scope, Kt: cond.Kt });
    const s = HP.sim;
    const out = { id: cond.id, scope: cond.scope, Kt: s.params.Kt, etaRad: s.params.etaRad,
      hasLSwAuto: s.hasLSwAuto, n: s.n, checkpoints: [] };
    let done = 0;
    for (const ck of CHECKPOINTS) {
      for (let k = done; k < ck; k++) s.step(DT);
      done = ck;
      const entry = {
        step: ck, t: +s.t.toFixed(3),
        bh: K.probe(K.bhIndex),
        rotorFast: K.rotorFast.map(i => K.probe(i)),
        rotorSlow: K.probe(K.rotorSlow),
        star: K.probe(K.starIdx),
        ledger: { radE: s.radE, radL: s.radL },
        rays: K.rayStats(),
        uphi: [80, 140, 200, 260].map(r => ({ r, u: +K.uphiAt(r).toFixed(4) })),
        nan: s.hasNaN()
      };
      out.checkpoints.push(entry);
      if (entry.nan) break;
    }
    return out;
  }, { cond, CHECKPOINTS, DT });
}

// ---- auto の用量反応(中心BHのスピン走査。Kt=60 と 3600 の両方)----
async function runDose(page) {
  return page.evaluate(({ DT }) => {
    const K = window.__E2;
    const spins = [0, 0.05, 0.12, 0.2, 0.3, 0.5, 1, 2, 3];
    // isolate=true は中心BHだけの孤立系(自己場のみ)。false は 🕶️全構成(BHのみ auto)。
    const scan = (Kt, isolate, withRays) => spins.map(sp => {
      K.build({ sweep: 'auto', scope: 'bh', Kt, spinBH: sp, isolate });
      const pre = K.probe(0);                 // t=0(予測式)での実効値
      HP.sim.step(DT);                        // auto はサブステップ冒頭で lSw[] を書く
      const r = { spin0: sp, lSwPredicted0: pre.lSw, lSwEngineAfter1: HP.sim.lSw[0],
        spinAfter1: HP.sim.spin[0], cSurf: pre.cSurf, vSurf: pre.vSurf, wExt: pre.wExt,
        tAbs: pre.tAbs, tObs: pre.tObs, lumNominal: pre.lumNominal, lumClamped: pre.lumClamped,
        clampHit: pre.clampHit };
      if (withRays) {
        K.build({ sweep: 'auto', scope: 'bh', Kt, spinBH: sp, isolate });   // 光線は t=0 の配置で
        const rs = K.rayStats();
        r.rays = { capQAretro: rs.capQAretro, capQApro: rs.capQApro, fan: rs.fan };
      }
      return r;
    });
    // 実在天体の自転比(第36便C2 QA sweep.auto-physlock と同じ較正: 表面速度比 v_eq/c を再現する spin)
    const realistic = [{ name: 'saturn', ratio: 9.87 / 299792 }, { name: 'sun', ratio: 2.0 / 299792 }]
      .map(o => {
        K.build({ sweep: 'auto', scope: 'bh', Kt: 3600, spinBH: 0 });
        const R = HP.sim.R[0], c0 = HP.sim.params.cLight, sp = o.ratio * c0 / R;
        K.build({ sweep: 'auto', scope: 'bh', Kt: 3600, spinBH: sp });
        const pre = K.probe(0); HP.sim.step(DT);
        return { name: o.name, vEqOverC: o.ratio, spin: sp,
          lSwPredicted0: pre.lSw, lSwEngineAfter1: HP.sim.lSw[0] };
      });
    return { note: 'spin 走査。full=🕶️全構成(BHのみ auto)/ isolated=中心BH単独(自己場のみ)。',
      spins, ktToyFull: scan(60, false, true), ktLockFull: scan(3600, false, true),
      ktToyIsolated: scan(60, true, false), ktLockIsolated: scan(3600, true, false), realistic };
  }, { DT });
}

// ---- (d) E8R はコア差動項を見ない(REVIEW_20260724 §7)の再確認 ----
async function runCoreDiff(page) {
  return page.evaluate(({ DT }) => {
    const K = window.__E2;
    const ysQA = [10, 40, 80, 120, 160];
    const measure = (core) => {
      K.build({ sweep: 1, scope: 'bh', core });
      const s = HP.sim;
      const mk = (y) => { const t = K.trace(y, 340); return { y0: y, ex: t.x, ey: t.y, minR: t.minR, endR: t.endR }; };
      const rays = [...ysQA.map(mk), ...ysQA.map(y => mk(-y))];
      const uphi = [80, 140, 200, 260].map(r => ({ r, u: K.uphiAt(r, true) }));
      for (let k = 0; k < 300; k++) s.step(DT);   // 粒子側(E3)がコア差動を見ることの対照
      let px = 0, py = 0;
      for (let i = 0; i < s.n; i++) { px += s.x[i] * (i + 1); py += s.y[i] * (i + 1); }
      return { hasCore: s.hasCore, coreMR: s.coreMR[0], coreSR: s.coreSR[0], Rc: s.Rc[0],
        rays, uphi, sig: { px, py } };
    };
    const off = measure(null);
    // ①REVIEW_20260724 §1 の「静かな外殻+高速コア」設計(mc/m=0.9・sc/s=10。Rc は既定式で R より大)
    // ②コアが天体内部に収まる穏当な設計(coreRR=0.4 → Rc=0.4·R=18)
    const CASES = [
      { id: 'extreme', core: { coreMR: 0.9, coreSR: 10 } },
      { id: 'moderate', core: { coreMR: 0.3, coreSR: 3, coreRR: 0.4 } }
    ];
    const cases = CASES.map(c => {
      const on = measure(c.core);
      const rayMaxDiff = Math.max(...off.rays.map((r, k) =>
        Math.max(Math.abs(r.ex - on.rays[k].ex), Math.abs(r.ey - on.rays[k].ey))));
      return { id: c.id, spec: c.core, on, rayIdentical: rayMaxDiff === 0, rayMaxDiff,
        particleIdentical: (off.sig.px === on.sig.px && off.sig.py === on.sig.py),
        uphiRatio: off.uphi.map((u, k) => ({ r: u.r, off: u.u, on: on.uphi[k].u,
          ratio: u.u !== 0 ? on.uphi[k].u / u.u : null })) };
    });
    return { off, cases,
      rayIdentical: cases.every(c => c.rayIdentical),
      rayMaxDiff: Math.max(...cases.map(c => c.rayMaxDiff)),
      particleIdentical: cases.every(c => c.particleIdentical),
      // 後方互換の別名(最初のケース=extreme)
      on: cases[0].on, uphiRatio: cases[0].uphiRatio };
  }, { DT });
}

// ---- (e) 機構①(RAY_MASS_MIN=40 の計算省略)の参考定量 ----
async function runMassMin(page) {
  return page.evaluate(() => {
    const K = window.__E2;
    K.build({ sweep: 1, scope: 'bh' });
    const s = HP.sim;
    if (s.box) return { skipped: 'UniverseBox のある宇宙では転記積分器は使えない' };
    const ys = [10, 40, 80, 120, 160];
    const valid = ys.map(y => {
      const a = HP.traceRay(s, -300, y, 1, 0, 2.7, 340, null);
      const b = K.traceRayT(-300, y, 1, 0, 2.7, 340, 40);
      return { y, dx: Math.abs(a.x - b.x), dy: Math.abs(a.y - b.y) };
    });
    const exact = valid.every(v => v.dx === 0 && v.dy === 0);
    let mAbove = 0, mBelow = 0, nAbove = 0, nBelow = 0;
    for (let i = 0; i < s.n; i++) {
      if (s.m[i] >= 40) { mAbove += s.m[i]; nAbove++; } else { mBelow += s.m[i]; nBelow++; }
    }
    const fanAt = (mm) => {
      let cap = 0, n = 0, minRsum = 0, defl = 0;
      for (let y = 8; y <= 200; y += 8) {
        for (const sgn of [1, -1]) {
          const t = K.traceRayT(-300, sgn * y, 1, 0, 2.7, 340, mm);
          n++; minRsum += t.minR; defl += Math.abs(Math.atan2(t.cy, t.cx));
          if (Math.hypot(t.x, t.y) < 300) cap++;
        }
      }
      return { massMin: mm, n, cap, rate: +(cap / n).toFixed(4),
        minRmean: +(minRsum / n).toFixed(2), deflMeanDeg: +(defl / n * 180 / Math.PI).toFixed(3) };
    };
    return { exactMatchWithTraceRay: exact, valid,
      mass: { mAbove, mBelow, nAbove, nBelow, fracBelow: +(mBelow / (mAbove + mBelow)).toFixed(5) },
      fans: [0, 1, 40, 200].map(fanAt),
      haloRef: { nHalo: 20, mHalo: 30, mTotalHalo: 600,
        note: '第19便 実験B のハロー(exp-darkrotor.mjs:99 の N_HALO=20/M_HALO=30)は m<40 で全質量が光学不可視' } };
  });
}

// ---- 実行 ----
const t0 = Date.now();
const commit = (() => { try { return execSync('git rev-parse HEAD', { cwd: ROOT }).toString().trim(); } catch { return 'unknown'; } })();
const browser = await launch();
const page = await newPage(browser);
await installKernel(page);
console.log(`対象: ${TARGET}  commit=${commit.slice(0, 7)}`);

const CONDS = [
  { id: 'base',      sweep: 1,      scope: 'bh',  Kt: null, label: '現行(lightSweep=1 数値指定)' },
  { id: 'auto',      sweep: 'auto', scope: 'bh',  Kt: null, label: 'lightSweep="auto"(第36便C2)' },
  { id: 'zero',      sweep: 0,      scope: 'bh',  Kt: null, label: 'lightSweep=0(掻き出しなし対照)' },
  { id: 'lock-auto', sweep: 'auto', scope: 'bh',  Kt: 3600, label: '物理対応ロック Kt=3600 + auto' },
  { id: 'lock-base', sweep: 1,      scope: 'bh',  Kt: 3600, label: '(補助)ロック + lightSweep=1' },
  { id: 'auto-all',  sweep: 'auto', scope: 'all', Kt: null, label: '(補助)全 single を auto' }
];

console.log('E2-1: 4条件(+補助2)× チェックポイント計測...');
const conditions = {};
for (const c of CONDS) {
  const t1 = Date.now();
  conditions[c.id] = await runCondition(page, c);
  const cps = conditions[c.id].checkpoints, first = cps[0], last = cps.at(-1);
  console.log(`  ${c.id.padEnd(10)}: lS_eff ${first.bh.lSw.toFixed(4)}→${last.bh.lSw.toFixed(4)} ` +
    `spin ${first.bh.spin.toFixed(4)}→${last.bh.spin.toFixed(4)} T_obs ${first.bh.tObs.toFixed(1)}→${last.bh.tObs.toFixed(1)} ` +
    `非脱出 ${first.rays.fan.rateNonEscape}→${last.rays.fan.rateNonEscape} [${((Date.now() - t1) / 1000).toFixed(0)}s]`);
}

console.log('E2-2: auto の用量反応(spin 走査 × Kt 60/3600)...');
const dose = await runDose(page);
console.log(`  Kt=60  : ${dose.ktToyFull.map(d => `${d.spin0}→${d.lSwPredicted0.toFixed(3)}`).join(' ')}`);
console.log(`  Kt=3600: ${dose.ktLockFull.map(d => `${d.spin0}→${d.lSwPredicted0.toFixed(3)}`).join(' ')}`);
console.log(`  実在自転比: ${dose.realistic.map(r => `${r.name} ${r.lSwPredicted0.toExponential(3)}`).join(' / ')}`);

console.log('E2-3: E8R コア差動不変の確認...');
const coreDiff = await runCoreDiff(page);
for (const c of coreDiff.cases) {
  console.log(`  [${c.id}] 光線経路 完全一致=${c.rayIdentical}(maxdiff=${c.rayMaxDiff}) / 粒子側 一致=${c.particleIdentical} ` +
    `Rc=${c.on.Rc.toFixed(2)} u_φ比(コア on/off)=${c.uphiRatio.map(u => u.ratio?.toFixed(3)).join('/')}`);
}

console.log('E2-4: 機構①(RAY_MASS_MIN)の参考定量...');
const massMin = await runMassMin(page);
console.log(`  転記積分器の厳密一致=${massMin.exactMatchWithTraceRay} 閾値未満質量比=${massMin.mass.fracBelow} ` +
  `非脱出率 ${massMin.fans.map(f => `mm${f.massMin}:${f.rate}`).join(' ')}`);

await browser.close();

const out = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(), commit, target: TARGET,
  note: '第36便 E2(台帳4-48): 光学的暗さの3機構の分離実験。QA ではない(合否なし)。' +
    '機構①=RAY_MASS_MIN 未満の光線計算省略(人工・本実験の主対象外 — massMin 節に参考定量)/' +
    '機構②=放射なし(lightSweep による E11 抑制・etaRad)/機構③=高スピンでの光線掃き出し(E8R の kF·u 移流)。',
  meta: {
    dt: DT, checkpoints: CHECKPOINTS, conditions: CONDS,
    sources: {
      traceRay: 'beta/index.html:3082-3168 (rayField/traceRay。RAY_MASS_MIN=40 は :924)',
      e11: 'beta/index.html:2660-2669 (Λ=η_rad·T^p·(1−lSw)、|Δs|≤0.5|s| クランプ)',
      tObs: 'beta/index.html:3349 (T_obs=obsT·(1−lSw)·½mR²s²)',
      lSwAuto: 'beta/index.html:2593-2604 (lS_eff=min(1,|s|R/c_surf), c_surf=c₀e^{−2ψ_surf})',
      frameOmega: 'beta/index.html:2476-2493 (ω=s·f(R,d)+coreMR·s·(coreSR−1)·f(Rc,d))',
      captureCriterion: 'tests/exp-darkrotor.mjs:38-91 (実験A: 340步後の終端半径<300 を有限時間非脱出とする)'
    }
  },
  conditions, dose, coreDiff, massMin
};
fs.writeFileSync(path.join(OUT_DIR, 'darkness-results.json'), JSON.stringify(out, null, 1));
console.log(`保存: tests/out/darkness-results.json  合計 ${((Date.now() - t0) / 1000).toFixed(1)}s`);
