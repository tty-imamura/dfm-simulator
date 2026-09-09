// 第250便a W1(続)「誘起応答 — ファンデルワールス相当の力の**符号**を確定する」(第42報)。
//
// 原仮定者(第42報): 「コンパクト天体同士に、ファンデルワールス力に相当する力が働いている事を検証する」。
// ChatGPT v8 §5 の類推: 外場 𝓔 が内部応答 Q を誘起し、その応答を消去すると高次の引力が残る
//   U(Q,r)=Q²/2α−Q𝓔 → Q_eq=α𝓔 → U_min=−(α/2)𝓔²。潮汐型 𝓔∝r⁻³ なら U_min ∝ −r⁻⁶。
// 球対称の最小候補(HP.dfmInducedPair — 本便の純関数):
//   U(r) = −C₆/(r²+r_c²)³ + C₁₂/(r²+r_c²)⁶ 、 F(r) = [−6C₆/(r²+r_c²)⁴ + 12C₁₂/(r²+r_c²)⁷]·r
//
// **エンジンには接続しない。** 本ハーネスは**独立の相対軌道 RK4**(この 1 ファイルの中だけで閉じた
// 積分器 — S.step も E12 も E6′ も 1 度も呼ばない)で、追加引力の**作用方向**だけを確かめる。
//   系: m₁=m₂=1・G=1/2(⇒ μ=G(m₁+m₂)=1・換算質量 μ_r=1/2)・p=1・e=0.1・r_c=10⁻⁴
//   η ≡ |F_add(r=p)| / F_N(p) = 6C₆/(G m₁m₂ p⁵) ⇒ C₆ = η·G m₁m₂ p⁵/6
//   一次式(ChatGPT v8 §5.2): Δϖ = 30πC₆/(G m₁m₂ p⁵)·(1+3e²/2+e⁴/8) > 0(**前進**)
//
// 節:
//   FD  : HP.dfmInducedPair の F と有限差分 −(U(r+h)−U(r−h))/(2h) の一致(純関数の自己検査)。
//   ORB : η=0 / 10⁻⁵ / 10⁻⁴ × dt=0.002/0.001 の近点移動を測り、一次式と符号・値を比べる。
//   SCALE: J0737 の尺度 — 通常の潮汐の相対的強さ k₂(R/r)⁵ を 1 行で。
//
// 実行: node tests/exp-w250a-induced.mjs [--fd] [--orb] [--scale]
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + path.join(ROOT, TARGET);
const argv = process.argv.slice(2);
const only = argv.filter((a) => a.startsWith('--')).map((a) => a.slice(2));
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

const out = { target: TARGET, node: process.version, at: new Date().toISOString() };

// ============================================================ FD: 力=−dU/dr の有限差分照合
if (want('fd')) {
  out.fd = await pg.evaluate(() => {
    const CASES = [];
    for (const C6 of [0, 1e-3, 1, 7.5]) for (const C12 of [0, 1e-6, 2]) for (const rc of [0, 1e-4, 0.3]) CASES.push({ C6, C12, rc });
    let maxAbs = 0, maxAbsB = 0, maxRel = 0, n = 0, worst = null;
    for (const c of CASES) for (const r of [0.05, 0.2, 0.5, 1, 2, 5, 20]) {
      const h = 1e-6 * Math.max(r, 1e-3);
      const a = HP.dfmInducedPair({ r: r + h, C6: c.C6, C12: c.C12, rc: c.rc });
      const b = HP.dfmInducedPair({ r: r - h, C6: c.C6, C12: c.C12, rc: c.rc });
      const m = HP.dfmInducedPair({ r, C6: c.C6, C12: c.C12, rc: c.rc });
      const fd = -(a.U - b.U) / (2 * h), d = Math.abs(m.F - fd);
      const rel = (Math.abs(fd) > 0) ? d / Math.abs(fd) : d;
      n++;
      if (d > maxAbs) { maxAbs = d; worst = { r, c, F: m.F, fd }; }
      if (Math.abs(fd) <= 1e3 && d > maxAbsB) maxAbsB = d;   // 値そのものが 10³ を超える強発散域を除いた絶対差
      if (rel > maxRel && Math.abs(fd) > 1e-9) maxRel = rel;
    }
    // 単調性と符号: 引力型 C₆>0・C₁₂=0 では F<0(引力)で |F| は r とともに単調減少
    const mono = [];
    for (const r of [0.5, 1, 2, 4, 8]) mono.push(HP.dfmInducedPair({ r, C6: 1, C12: 0, rc: 1e-4 }));
    return { n, maxAbs, maxAbsBounded: maxAbsB, maxRel, worst,
      attractive: mono.every((z) => z.F < 0),
      decays: mono.every((z, i) => i === 0 || Math.abs(z.F) < Math.abs(mono[i - 1].F)),
      mono: mono.map((z) => ({ F: z.F, U: z.U })),
      bad: [HP.dfmInducedPair(null), HP.dfmInducedPair({ r: -1 }), HP.dfmInducedPair({ r: 0, rc: 0 }),
        HP.dfmInducedPair({ r: 1, C6: NaN })] };
  });
  console.error(`  FD  n=${out.fd.n} 最大相対差 ${out.fd.maxRel.toExponential(3)} / 最大絶対差(|F|≤10³ の域) ${out.fd.maxAbsBounded.toExponential(3)} / 全域 ${out.fd.maxAbs.toExponential(3)}`
    + `  引力=${out.fd.attractive} 単調減衰=${out.fd.decays}`);
}

// ============================================================ ORB: 独立 RK4 で近点移動の符号
if (want('orb')) {
  out.orb = await pg.evaluate(() => {
    // ---- 独立の相対軌道 RK4(エンジンを 1 度も呼ばない)
    const m1 = 1, m2 = 1, G = 0.5, mu = G * (m1 + m2), mur = m1 * m2 / (m1 + m2);
    const p = 1, e = 0.1, rc = 1e-4;
    const run = (eta, dt, nPeri) => {
      const C6 = eta * G * m1 * m2 * Math.pow(p, 5) / 6;
      const acc = (x, y) => {
        const r2 = x * x + y * y, r = Math.sqrt(r2), ir3 = 1 / (r2 * r);
        let ax = -mu * x * ir3, ay = -mu * y * ir3;
        if (C6 !== 0) { const z = HP.dfmInducedPair({ r, C6, C12: 0, rc });
          ax += z.coeff * x / mur; ay += z.coeff * y / mur; }
        return [ax, ay];
      };
      const ener = (x, y, vx, vy) => {
        const r = Math.hypot(x, y);
        const z = (C6 !== 0) ? HP.dfmInducedPair({ r, C6, C12: 0, rc }).U : 0;
        return 0.5 * mur * (vx * vx + vy * vy) - G * m1 * m2 / r + z;
      };
      // 近点発の初期条件: r₀=p/(1+e)・v₀=√(mu(1+e)/... ) は h=√(mu·p) から
      const h0 = Math.sqrt(mu * p), r0 = p / (1 + e);
      let x = r0, y = 0, vx = 0, vy = h0 / r0, t = 0;
      const a0 = p / (1 - e * e), T = 2 * Math.PI * Math.sqrt(a0 * a0 * a0 / mu);
      const steps = Math.ceil((nPeri + 1.2) * T / dt);
      const E0 = ener(x, y, vx, vy);
      let dE = 0, rd1 = 0, peri = [];
      for (let k = 0; k < steps && peri.length < nPeri; k++) {
        // RK4(位置・速度を同時に)
        const [a1x, a1y] = acc(x, y);
        const k1 = [vx, vy, a1x, a1y];
        const [a2x, a2y] = acc(x + 0.5 * dt * k1[0], y + 0.5 * dt * k1[1]);
        const k2 = [vx + 0.5 * dt * k1[2], vy + 0.5 * dt * k1[3], a2x, a2y];
        const [a3x, a3y] = acc(x + 0.5 * dt * k2[0], y + 0.5 * dt * k2[1]);
        const k3 = [vx + 0.5 * dt * k2[2], vy + 0.5 * dt * k2[3], a3x, a3y];
        const [a4x, a4y] = acc(x + dt * k3[0], y + dt * k3[1]);
        const k4 = [vx + dt * k3[2], vy + dt * k3[3], a4x, a4y];
        const nx = x + dt / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]);
        const ny = y + dt / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
        const nvx = vx + dt / 6 * (k1[2] + 2 * k2[2] + 2 * k3[2] + k4[2]);
        const nvy = vy + dt / 6 * (k1[3] + 2 * k2[3] + 2 * k3[3] + k4[3]);
        const rPrev = Math.hypot(x, y);
        x = nx; y = ny; vx = nvx; vy = nvy; t += dt;
        const r = Math.hypot(x, y), rd = (x * vx + y * vy) / r;
        const ee = ener(x, y, vx, vy); const d = Math.abs(ee / E0 - 1); if (d > dE) dE = d;
        if (k >= 1 && rd1 < 0 && rd >= 0) {                     // ṙ の −→+ 交差 = 近点
          const fr = (rd !== rd1) ? (-rd1 / (rd - rd1)) : 0;
          // 近点方位は 1 步前と現在の角度の線形補間(周期跨ぎを解いてから)
          let a = Math.atan2(y - vy * dt, x - vx * dt), b2 = Math.atan2(y, x);
          while (b2 - a > Math.PI) b2 -= 2 * Math.PI; while (b2 - a < -Math.PI) b2 += 2 * Math.PI;
          peri.push({ t: t - dt + fr * dt, ang: a + fr * (b2 - a), r: rPrev });
        }
        rd1 = rd;
      }
      // 近点方位の直線 fit(1 周あたりの前進)
      const ang = [];
      for (let i = 0; i < peri.length; i++) {
        let a = peri[i].ang;
        if (i) { let z = a - ang[i - 1]; while (z > Math.PI) z -= 2 * Math.PI; while (z < -Math.PI) z += 2 * Math.PI; a = ang[i - 1] + z; }
        ang.push(a);
      }
      const n = ang.length; let slope = null;
      if (n >= 2) { const mx = (n - 1) / 2, my = ang.reduce((s, z) => s + z, 0) / n;
        let sxy = 0, sxx = 0; for (let i = 0; i < n; i++) { sxy += (i - mx) * (ang[i] - my); sxx += (i - mx) * (i - mx); }
        slope = sxy / sxx; }
      const lin = 30 * Math.PI * C6 / (G * m1 * m2 * Math.pow(p, 5)) * (1 + 1.5 * e * e + e * e * e * e / 8);
      return { eta, dt, C6, nPeri: n, T, measRad: slope, linRad: lin,
        diffPct: (lin !== 0 && slope !== null) ? (slope / lin - 1) * 100 : null,
        dEmax: dE, periT: peri.map((z) => z.t) };
    };
    const rows = [];
    for (const eta of [0, 1e-5, 1e-4]) for (const dt of [0.002, 0.001]) rows.push(run(eta, dt, 5));
    return rows;
  });
  for (const r of out.orb) console.error(`  ORB η=${r.eta} dt=${r.dt} → 実測 ${r.measRad.toExponential(9)} rad/周`
    + `  一次式 ${r.linRad.toExponential(9)}  差 ${r.diffPct === null ? 'n/a' : r.diffPct.toFixed(5) + '%'}  |ΔE/E|≤${r.dEmax.toExponential(2)}`);
}

// ============================================================ SCALE: J0737 の尺度
if (want('scale')) {
  out.scale = await pg.evaluate(() => {
    // 通常の潮汐の相対的強さ ~ k₂(R/r)⁵(Love 数 k₂ の代表値 0.1 — NS の文献帯 0.05〜0.15 の中央)。
    // J0737: R=11.75 km(EOS proxy)・r は近点 8.016949e8 m と 半長径 8.788366e8 m。
    const R = 1.175e4, k2 = 0.1;
    const one = (r) => k2 * Math.pow(R / r, 5);
    const rPeri = 8.016949e8, rA = 8.788366e8;
    // λ=(2/3G)k₂R⁵(Hinderer et al.)— 応答係数の尺度(SI)
    const lam = (2 / (3 * 6.674e-11)) * k2 * Math.pow(R, 5);
    return { k2, R, rPeri, rA, tidePeri: one(rPeri), tideA: one(rA), lambdaSI: lam,
      // 誘起 r⁻⁶ を「歳差を有意に変える」水準(η~10⁻⁶)まで持ち上げるのに要る増幅
      needEta: 1e-6, amp: 1e-6 / one(rPeri) };
  });
  console.error(`  SCALE k₂(R/r)⁵ = ${out.scale.tidePeri.toExponential(3)}(近点)/ ${out.scale.tideA.toExponential(3)}(半長径)`
    + `  → η~10⁻⁶ に届かせるには ${out.scale.amp.toExponential(2)} 倍の増幅が要る`);
}

out.pageErrors = pageErrors;
console.log(JSON.stringify(out, null, 1));
await browser.close();
