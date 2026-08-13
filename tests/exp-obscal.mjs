// 第111便 観測較正ハーネス exp-obscal.mjs(第107便B設計 → 第109便B仕様 → 第110便プロファイル規約 → 本便実装)
// - 本スクリプトは QA ではない(合否は JSON に記録するが suite 非連動)。tests/out/obscal-results.json へ保存。
// - ドメイン宣言プロファイル(PHYSICS §5「観測較正プロファイル」):
//     solar = q=3・D0=0.1・geoPN=2・λPN=1・α=1.5・kFrame=1・physLock(Kt=c₀²/G)
//     +G=6.674(☀️stellar ティアの実G対応値 G_sim*=6.674e-11×10^11 — 第111便裁定採用。
//       表示換算 G_SI=G_sim×10^(3x−2eT−eM) が万有引力定数 6.674e-11 に厳密一致)
//   参照 solarG1 = 同一で G=1・Kt=900(第107便B フィジビリティとの連続性確認用)
// - physLock はプリセットに保存されないため、各試験の開始時に Kt==c₀²/G をアサートする(107B §3)。
// - 歳差は Runge–Lenz(RL)ベクトルの角度ドリフトで測る。近点検出(r 極小)は Float32 状態配列の
//   平底量子化が偽極小を量産して不成立(第111便 実測 — ☿陽性対照で RL は λ1=+0.049 rad/TK の
//   順行・λ0≈0 を正しく返す)。
// - 試験3種(誇張アナログ座標系 — 実座標の再現ではなく、プロファイル下の較正自由度 kM と
//   λPN/kFrame/スピンの A/B 差分を実測する。43″/世紀の直接再現は域外 = V18〜V20 が正式経路):
//   A) earthMoon型(質量比 0.0123 固定): 自由二体は kFrame=1×D0=0.1 で崩壊する(第111便の
//      一次発見 — 軽い伴星のフレーム重み w/(D0+w)≈0.4 が自由主星を引きずる。D0・kFrame・pinned の
//      用量反応で機構確定)。崩壊の記録+実用経路(主星 pinned)での kM フィット・周期残差
//   B) mercury型: RL 歳差の λPN 1/0 A/B(1PN寄与)を M 掃引で弱場式と比較+中心スピン ±2 の
//      引きずり寄与(Lense–Thirring 型の順行/逆行非対称)
//   C) saturn環型: 実半径比の C/B/A 3帯テスト粒子 — 単一 kM での帯別角速度残差(同時 <1% か =
//      予測評価)+離心率RMS の kFrame 1/0 A/B(legacy の既知悪化 2.24倍が geoPN=2 で改善するか)
// 第112便 改良(原仮定者裁定「次便候補: 進める」):
//   ①B) RL 歳差を最小二乗勾配(8TK)で計測 — 非整数周回の窓誤差(±0.1 相当)を解消
//   ②B) 引きずりのスピン用量分解 s∈{−2,−1,+1,+2}(λ1)+λ0 対照 — Δϖ(s)=A·s+B·s² の
//      線形(LT型)と二次(a₁ₚₙ(w) の w² 項)への分解。λ0+スピンは対照(geoPN=2 の
//      スピン→軌道経路は E12 の w=v−kF·u だけなので、λ0 では消えるはず)
//   ③A) 自由二体に λ0 条件を追加 — geoPN=2 の崩壊経路が E12 の w=v−kF·u 置換であることの検証
//   ④C) 弱場環(M=100・深さ半減)を追加し、3帯残差と eccRMS 比の深さ依存を測る
// 実行: node tests/exp-obscal.mjs(playwright 必須・数分〜10分)
//   QA_TARGET=index.html node tests/exp-obscal.mjs  … ルート対象(物理キーは共通)
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

// ドメイン宣言プロファイル(q を万能値にしない — 109B §5。物理キーは全キー明示)
const C0 = 30;
const profile = (G) => ({
  G, cLight: C0, Kt: C0 * C0 / G,           // physLock 条件を厳密に満たす導出値
  q: 3, D0: 0.1, kFrame: 1, geoPN: 2, lambdaPN: 1, pnAlpha: 1.5,
  kRep: 0, muF: 0, gammaN: 0, kappaS: 0, bM: 1, etaRad: 0, pRad: 4,
  gravityX: 0, gravityY: 0, radiusScale: 1, softening: 2, timeScale: 1,
});
const PROFILES = {
  solar:   { domain: 'solar', note: '☀️stellar 実G値(第111便裁定)', phys: profile(6.674) },
  solarG1: { domain: 'solar(G=1参照)', note: '第107便B フィジビリティとの連続性', phys: profile(1) },
};

const browser = await launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto(INDEX);
await page.waitForFunction(() => window.HP && HP.sim);

const out = { date: new Date().toISOString(), target: TARGET, profiles: {}, tests: {} };
for (const [k, p] of Object.entries(PROFILES)) out.profiles[k] = { domain: p.domain, note: p.note, physics: p.phys };

// ---- A) earthMoon型: 自由二体の安定性(機構)+kM フィット ------------------------------------
// 質量規約: 実G値プロファイル(G=6.674)では M=1000/6.674(GM 不変の質量再スケール)を標準とする。
//   physLock 下では (G,m,Kt)→(kG, m/k, Kt/k) で軌道・1PN(U=Gm/d)・時計(ψ=W/Kt)がすべて不変 —
//   これが実G値規約での kM(質量補正)の物理的正体。**フレーム重み w/(D0+w) と半径 R=√m だけが
//   変わる**(w が 1/k)ため、G=1 で崩壊した自由二体が実G値+再スケールでは成立し得る(本試験で実測)。
// 崩壊機構の分解列(第111便 一次発見: kFrame=1×D0=0.1 の自由二体は、軽い伴星のフレーム重み
//   w/(D0+w)≈0.4 が自由主星を引きずって崩壊する — D0/kFrame/pinned の用量反応)は G=1 側で記録する。
{
  const CONFIGS = [
    // G=1 参照(M=1000・m2=12.3 — 第107便B と同系): 崩壊記録+kM フィット
    { id: 'G1-free-kF1',   pk: 'solarG1', M: 1000, pin: false, over: {},             fit: false },
    { id: 'G1-free-kF0',   pk: 'solarG1', M: 1000, pin: false, over: { kFrame: 0 }, fit: true },
    { id: 'G1-free-D0=2',  pk: 'solarG1', M: 1000, pin: false, over: { D0: 2 },     fit: false },
    // 第112便③: λ0(geoPN=2 のまま 1PN 切)— 崩壊経路が E12 の w=v−kF·u なら安定するはず
    { id: 'G1-free-lam0',  pk: 'solarG1', M: 1000, pin: false, over: { lambdaPN: 0 }, fit: true },
    { id: 'G1-pin-kF1',    pk: 'solarG1', M: 1000, pin: true,  over: {},             fit: true },
    // 実G値(G=6.674)+GM不変の質量再スケール(M=1000/6.674): 自由二体の成立性+kM フィット
    { id: 'realG-free-kF1', pk: 'solar', M: 1000 / 6.674, pin: false, over: {},      fit: true },
    { id: 'realG-pin-kF1',  pk: 'solar', M: 1000 / 6.674, pin: true,  over: {},      fit: true },
  ];
  const res = {};
  for (const c of CONFIGS) {
    const r = await page.evaluate(async ({ phys, pin, fit, M }) => {
      const m2 = 0.0123 * M, d = 180, mu = pin ? M : M + m2;
      const mk = (f) => {
        const vrel = f * Math.sqrt(phys.G * mu / d);
        const bodies = pin
          ? [{ type: 'single', m: M, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: true },
             { type: 'single', m: m2, x: d, y: 0, vx: 0, vy: vrel, spin: 0, pinned: false }]
          : [{ type: 'single', m: M, x: -d * m2 / (M + m2), y: 0, vx: 0, vy: -vrel * m2 / (M + m2), spin: 0, pinned: false },
             { type: 'single', m: m2, x: d * M / (M + m2), y: 0, vx: 0, vy: vrel * M / (M + m2), spin: 0, pinned: false }];
        return { id: 'obscalEM', name: 'obscal-em', emoji: '🧪', seed: 1,
          camera: { scale: 300 }, world: { boundary: 'none', size: 0 }, physics: phys, bodies };
      };
      const TK = 2 * Math.PI * Math.sqrt(d * d * d / (phys.G * mu));
      const run1 = (f, orbits) => {
        const S = HP.sim; S.build(mk(f));
        if (!HP.physLockSatisfied(S)) return { lockFail: true };
        const steps = Math.ceil(orbits * TK / 0.016);
        let rmin = Infinity, rmax = 0, ang = 0, px = S.x[1] - S.x[0], py = S.y[1] - S.y[0], tTwoPi = 0;
        for (let k = 0; k < steps; k++) {
          S.step(0.016);
          const dx = S.x[1] - S.x[0], dy = S.y[1] - S.y[0], rr = Math.hypot(dx, dy);
          if (rr < rmin) rmin = rr; if (rr > rmax) rmax = rr;
          ang += Math.atan2(px * dy - py * dx, px * dx + py * dy); px = dx; py = dy;
          if (!tTwoPi && Math.abs(ang) >= 2 * Math.PI) tTwoPi = (k + 1) * 0.016;
        }
        const cmx = (M * S.x[0] + m2 * S.x[1]) / (M + m2), cmy = (M * S.y[0] + m2 * S.y[1]) / (M + m2);
        return { amp: (rmax - rmin) / ((rmax + rmin) / 2), rmin, rmax, tTwoPi,
          cmDrift: Math.hypot(cmx, cmy) / d, nan: S.hasNaN() };
      };
      if (!fit) { const m = run1(1, 1.05); return Object.assign({ f: 1, fitted: false }, m); }
      let best = null;
      for (let f = 0.97; f <= 1.0101; f += 0.005) {
        const m = run1(f, 1.05); if (m.lockFail) return { lockFail: true };
        if (!best || m.amp < best.amp) best = Object.assign({ f }, m);
      }
      for (let f = best.f - 0.004; f <= best.f + 0.0041; f += 0.001) {
        const m = run1(f, 1.05);
        if (m.amp < best.amp) best = Object.assign({ f }, m);
      }
      const fin = run1(best.f, 3.1);   // 最良 f で3公転 — 周期の確定計測
      return { fitted: true, f: best.f, kM: best.f * best.f, amp: fin.amp, TK,
        T: fin.tTwoPi, Tres: fin.tTwoPi ? fin.tTwoPi / (TK) - 1 : null, cmDrift: fin.cmDrift, nan: fin.nan };
    }, { phys: Object.assign({}, PROFILES[c.pk].phys, c.over), pin: c.pin, fit: c.fit, M: c.M });
    res[c.id] = r;
    console.log(`[A:${c.id.padEnd(14)}] ${r.fitted ? `f=${r.f.toFixed(3)} kM=${r.kM.toFixed(4)} ` : '(f=1固定) '}amp=${(r.amp * 100).toFixed(2)}%${r.Tres != null ? ` T/TK−1=${(r.Tres * 100).toFixed(2)}%` : ''} cmDrift=${r.cmDrift?.toExponential(2)} NaN=${r.nan}`);
  }
  out.tests.earthMoon = res;
  const broken = res['G1-free-kF1'].amp > 0.5;
  console.log(`[A:機構      ] G1自由二体=崩壊(amp>50%)=${broken}(D0=2 → ${(res['G1-free-D0=2'].amp * 100).toFixed(1)}% / kF0 → ${(res['G1-free-kF0'].amp * 100).toFixed(2)}% / pinned → ${(res['G1-pin-kF1'].amp * 100).toFixed(2)}%)/ 実G+再スケール自由二体 amp=${(res['realG-free-kF1'].amp * 100).toFixed(2)}%(w再スケールで成立するか)`);
}

// ---- B) mercury型: RL 歳差 — λPN 1/0 の M 掃引(弱場式比較)+スピン用量分解(引きずり) --------
// 第112便①: 歳差は RL 角の**最小二乗勾配**(8TK)で測る — 端点差分の非整数周回窓誤差を解消
{
  const rlRun = async (M, lam, spin) => page.evaluate(async ({ phys, M, lam, spin }) => {
    const RL = (S, GM, i) => {
      const rx = S.x[i], ry = S.y[i], vx = S.vx[i], vy = S.vy[i];
      const L = rx * vy - ry * vx, r = Math.hypot(rx, ry);
      return Math.atan2((-vx * L) / GM - ry / r, (vy * L) / GM - rx / r);
    };
    const rp = 120, e = 0.2, a = rp / (1 - e);
    const P = Object.assign({}, phys, { lambdaPN: lam });
    const vp = Math.sqrt(P.G * M * (1 + e) / rp);
    const S = HP.sim;
    S.build({ id: 'obscalMerc', name: 'obscal-merc', emoji: '🧪', seed: 1,
      camera: { scale: 300 }, world: { boundary: 'none', size: 0 }, physics: P,
      bodies: [{ type: 'single', m: M, x: 0, y: 0, vx: 0, vy: 0, spin, pinned: true },
               { type: 'single', m: 1, x: rp, y: 0, vx: 0, vy: vp, spin: 0, pinned: false }] });
    if (!HP.physLockSatisfied(S)) return { lockFail: true };
    const GM = P.G * M, TK = 2 * Math.PI * Math.sqrt(a ** 3 / GM);
    const dt = 0.016, steps = Math.ceil(8 * TK / dt);
    // アンラップ RL 角の最小二乗勾配(逐次和 — 配列を持たない)
    let prev = null, un = 0, n = 0, St = 0, Sy = 0, Stt = 0, Sty = 0;
    for (let k = 0; k < steps; k++) {
      S.step(dt);
      const ang = RL(S, GM, 1);
      let dd = ang - (prev === null ? ang : prev);
      while (dd > Math.PI) dd -= 2 * Math.PI; while (dd < -Math.PI) dd += 2 * Math.PI;
      un += dd; prev = ang;
      const t = k * dt;
      n++; St += t; Sy += un; Stt += t * t; Sty += t * un;
    }
    const slope = (n * Sty - St * Sy) / (n * Stt - St * St);
    const theo = 6 * Math.PI * GM / (P.cLight ** 2 * a * (1 - e * e));   // α=1.5(完全1PN)の弱場式
    return { perOrbit: slope * TK, theo, nan: S.hasNaN() };
  }, { phys: PROFILES.solar.phys, M, lam, spin });
  const sweep = [];
  for (const M of [30, 60, 150, 300]) {
    const r1 = await rlRun(M, 1, 0), r0 = await rlRun(M, 0, 0);
    const pn = r1.perOrbit - r0.perOrbit;
    sweep.push({ M, pn1Measured: pn, theo: r1.theo, ratio: pn / r1.theo, lam0Residual: r0.perOrbit });
    console.log(`[B:M=${String(M).padStart(3)}    ] Δϖ_1PN=${pn.toFixed(5)} rad/TK 弱場式=${r1.theo.toFixed(5)} 比=${(pn / r1.theo).toFixed(3)} λ0残差=${r0.perOrbit.toExponential(2)} NaN=${r1.nan || r0.nan}`);
  }
  // 第112便②: スピン用量分解(M=300・λ1・s∈{−2,−1,+1,+2})+λ0 スピン対照。
  // Δϖ_drag(s)=Δϖ(s)−Δϖ(0) を A·s+B·s² にフィット — A=LT型(線形・順逆反対称)、
  // B=a₁ₚₙ(w) の w² 項由来(二次・順逆対称)。λ0+spin は「E12 経由以外のスピン→軌道経路なし」の対照
  const base = await rlRun(300, 1, 0);
  const doses = [];
  for (const s of [-2, -1, 1, 2]) {
    const r = await rlRun(300, 1, s);
    doses.push({ s, dPrec: r.perOrbit - base.perOrbit });
  }
  // 最小二乗: dPrec = A·s + B·s²(4点・s の対称集合なので正規方程式が対角化する)
  const Ssum2 = doses.reduce((t, d) => t + d.s * d.s, 0);
  const Ssum4 = doses.reduce((t, d) => t + d.s ** 4, 0);
  const A = doses.reduce((t, d) => t + d.s * d.dPrec, 0) / Ssum2;
  const B = doses.reduce((t, d) => t + d.s * d.s * d.dPrec, 0) / Ssum4;
  const ctrl = await rlRun(300, 0, 2);
  const lam0ref = sweep.find((x) => x.M === 300).lam0Residual;
  out.tests.mercury = { sweep, base: base.perOrbit, doses, dragLinearA: A, dragQuadB: B,
    lam0SpinCtrl: ctrl.perOrbit - lam0ref };
  for (const d of doses) console.log(`[B:s=${String(d.s).padStart(2)}    ] Δϖ_drag=${d.dPrec.toExponential(3)} rad/TK`);
  console.log(`[B:分解    ] Δϖ_drag(s)≈A·s+B·s²: A=${A.toExponential(3)}(LT型・線形) B=${B.toExponential(3)}(w²項・二次) / λ0+spin2 対照=${(ctrl.perOrbit - lam0ref).toExponential(2)}(≈0 なら経路は E12 のみ)`);
}

// ---- C) saturn環型: 単一 kM での3帯同時性(予測評価)+離心率RMS の kFrame A/B ------------
{
  // 実観測境界(10³km): C=74.7〜92 / B=92〜117.6 / A=122.2〜136.8 → C内縁を110に置く相似倍率
  const sc = 110 / 74.7;
  const BANDS = [
    { id: 'C', r0: 74.7 * sc, r1: 92 * sc },
    { id: 'B', r0: 92 * sc, r1: 117.6 * sc },
    { id: 'A', r0: 122.2 * sc, r1: 136.8 * sc },
  ];
  // 第112便④: 弱場条件 M=100(深さ U/c²≈0.6% — M=300 の 1/3)を追加し深さ依存を測る。
  // 走行は外帯の1動径周期以上を確保(T∝1/√GM で M=100 は 1.7倍長い)
  const conds = [
    { id: 'M300-kF1-s2', M: 300, steps: 30000, kFrame: 1, spin: 2 },
    { id: 'M100-kF1-s2', M: 100, steps: 48000, kFrame: 1, spin: 2 },
    { id: 'M100-kF0-s2', M: 100, steps: 48000, kFrame: 0, spin: 2 },
    { id: 'M100-kF1-s0', M: 100, steps: 48000, kFrame: 1, spin: 0 },
  ];
  const res = {};
  for (const c of conds) {
    const r = await page.evaluate(async ({ phys, kF, spin, bands, M, STEPS }) => {
      const NB = 45, P = Object.assign({}, phys, { kFrame: kF });
      const bodies = [{ type: 'single', m: M, x: 0, y: 0, vx: 0, vy: 0, spin, pinned: true }];
      const meta = [];
      const GA = Math.PI * (3 - Math.sqrt(5));   // 黄金角 — 決定的に方位を散らす
      for (let bi = 0; bi < bands.length; bi++) { const b = bands[bi];
        for (let i = 0; i < NB; i++) {
          const r0 = b.r0 + (b.r1 - b.r0) * (i + 0.5) / NB, th = GA * (i + bi * NB);
          const v = Math.sqrt(P.G * M / r0);
          bodies.push({ type: 'single', m: 0.01, x: r0 * Math.cos(th), y: r0 * Math.sin(th),
            vx: -v * Math.sin(th), vy: v * Math.cos(th), spin: 0, pinned: false });
          meta.push({ band: b.id, r0 });
        } }
      const S = HP.sim;
      S.build({ id: 'obscalSat', name: 'obscal-sat', emoji: '🧪', seed: 1,
        camera: { scale: 300 }, world: { boundary: 'none', size: 0 }, physics: P, bodies });
      if (!HP.physLockSatisfied(S)) return { lockFail: true };
      // 角速度は**時間平均**(累積角/走行時間)で測る — 楕円化した粒子の瞬時 Ω は位相で偏るため
      const N = S.n, rmin = new Float64Array(N).fill(Infinity), rmax = new Float64Array(N);
      const px = new Float64Array(N), py = new Float64Array(N), cum = new Float64Array(N);
      for (let i = 1; i < N; i++) { px[i] = S.x[i]; py[i] = S.y[i]; }
      for (let k = 0; k < STEPS; k++) {
        S.step(0.016);
        for (let i = 1; i < N; i++) { const xx = S.x[i], yy = S.y[i], rr = Math.hypot(xx, yy);
          if (rr < rmin[i]) rmin[i] = rr; if (rr > rmax[i]) rmax[i] = rr;
          cum[i] += Math.atan2(px[i] * yy - py[i] * xx, px[i] * xx + py[i] * yy);
          px[i] = xx; py[i] = yy; }
      }
      const bandStat = {};
      for (const b of bands) bandStat[b.id] = { rho: 0, e2: 0, n: 0, lost: 0 };
      for (let i = 1; i < N; i++) {
        const mt = meta[i - 1], st = bandStat[mt.band];
        const rr = Math.hypot(S.x[i], S.y[i]);
        if (rr < 80 || rr > 280) { st.lost++; continue; }   // 帯域を大きく逸脱した粒子は統計から除外
        const om = cum[i] / (STEPS * 0.016);
        const omK = Math.sqrt(P.G * M / (mt.r0 * mt.r0 * mt.r0));
        const ecc = (rmax[i] - rmin[i]) / (rmax[i] + rmin[i]);
        st.rho += om / omK; st.e2 += ecc * ecc; st.n++;
      }
      for (const b of bands) { const st = bandStat[b.id];
        st.rho = st.n ? st.rho / st.n : NaN; st.eccRMS = st.n ? Math.sqrt(st.e2 / st.n) : NaN; delete st.e2; }
      return { lockOk: true, bands: bandStat, nan: S.hasNaN() };
    }, { phys: PROFILES.solar.phys, kF: c.kFrame, spin: c.spin, bands: BANDS, M: c.M, STEPS: c.steps });
    res[c.id] = r;
    const bs = r.bands || {};
    console.log(`[C:${c.id.padEnd(11)}] ρ(C/B/A)=${['C', 'B', 'A'].map(b => bs[b]?.rho?.toFixed(4)).join('/')} eccRMS=${['C', 'B', 'A'].map(b => bs[b]?.eccRMS?.toExponential(2)).join('/')} 逸脱=${['C', 'B', 'A'].map(b => bs[b]?.lost).join('/')} NaN=${r.nan}`);
  }
  // 単一 kM 残差(帯B正規化 — 相対比なので f の再走行は不要)を深さ別に、eccRMS 比は M=100 で
  const rel3 = (bs) => ({ C: bs.C.rho / bs.B.rho - 1, A: bs.A.rho / bs.B.rho - 1 });
  const r300 = rel3(res['M300-kF1-s2'].bands), r100 = rel3(res['M100-kF1-s2'].bands);
  const eRatio = {};
  for (const b of ['C', 'B', 'A']) eRatio[b] = res['M100-kF1-s2'].bands[b].eccRMS / res['M100-kF0-s2'].bands[b].eccRMS;
  out.tests.saturn = { conds: res,
    relResidual: { M300: r300, M100: r100 },
    singleKmWithin1pc: { M300: Math.abs(r300.C) < 0.01 && Math.abs(r300.A) < 0.01,
                         M100: Math.abs(r100.C) < 0.01 && Math.abs(r100.A) < 0.01 },
    eccRatioKF_M100: eRatio };
  console.log(`[C:予測      ] 単一kM残差(帯B正規化): M300 C=${(r300.C * 100).toFixed(2)}%/A=${(r300.A * 100).toFixed(2)}% → M100 C=${(r100.C * 100).toFixed(2)}%/A=${(r100.A * 100).toFixed(2)}%(同時<1%: M300=${out.tests.saturn.singleKmWithin1pc.M300}・M100=${out.tests.saturn.singleKmWithin1pc.M100}) / eccRMS比 kF1/kF0(M100): C=${eRatio.C.toFixed(3)} B=${eRatio.B.toFixed(3)} A=${eRatio.A.toFixed(3)}`);
}

fs.writeFileSync(path.join(OUT_DIR, 'obscal-results.json'), JSON.stringify(out, null, 2));
console.log('saved: tests/out/obscal-results.json');
await browser.close();
