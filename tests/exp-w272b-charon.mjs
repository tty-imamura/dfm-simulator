// 第272便b(第62報「カロン」「引きずり」)— **❄️ 冥王星–カロンの対照系列 C0〜C7/S(診断のみ)**。
//
// ■ 何をするか / しないか
//   ・内蔵プリセット ❄️ `plutoCharonReal` の**診断コピー**(JSON の複製)だけを走らせる。
//     **内蔵 124 本は 1 bit も変えない**(kFrame<1・geoPN=3・f≠1 はこの器の中だけ)。
//   ・`beta/index.html` を 1 文字も変えない(本器はページを読むだけ)。
//   ・判定はしない。「合/否」「新発見」は書かない —— 次数が立ち・残差が観測 σ の 3 倍に入り・
//     独立な観測量を予測できたときにだけ結論の語を使う(本便の出力はその手前である)。
//
// ■ **走行前に固定した契約**(この節を先に書いてから 1 本目を回した)
//   ・基準刻み h = 0.016(アプリ既定 DT)。步数 N_h = 20,700,000 = 第271便a の ❄️ 3 段登録の h 段。
//     h/2 = (dt 0.008, 41,400,000 步)・h/4 = (dt 0.004, 82,800,000 步)—— **物理時間は 3 段とも同じ**
//     331,200 時間単位(= 33,120,000 s)。
//   ・抽出窓: 近点間は**最初の 20 近点(19 区間)**(PERI_WINDOW=20 —— calaudit と同一)。
//     同方向 1 周は **ORB_MAX=60** 本まで記録し、**判定に使うのは revSec[1](2 周目)**(obsCard の数え方)。
//   ・終了条件: ① 步数上限 ② 同方向 1 周が ORB_MAX 本 ③ NaN 検出 —— のいずれか。停止理由を記録する。
//   ・保存量(列ごとに必ず出す): 同方向 P(1〜6 周目)・近点間 P(検出器 A/B)・接触要素 P・
//     e proxy(全窓/1 周目)・近点移動(°/周・A/B・fit 残差)・
//     帳簿 3 本(総 L の相対ドリフト・粒子線運動量 |ΔP|/Σm|v|・ニュートン二体エネルギーの相対ドリフト)・
//     重心変位(最大)・実効 k(build 後の params.kFrame)・clamp 6 本・NaN・geoToy の停止理由。
//   ・**帳簿は「保存を主張する量」ではない**(E6′/1PN は保存力ではなく、softening も入っている)。
//     列どうしを同じ定義で比べるための診断値である。
//
// ■ 系列(--only で絞れる)
//   C0 現行入力・kF1・f1・geoPN2          … 公開測定(553210.634 s・+0.246%)の再現
//   C1 kF0・f1                            … 同期仮説の最小対照(既知 +0.002%)
//   C2 kF={0,0.1,0.3,0.5,0.7,1}・f1       … 分数係数への感度(**最良点は fit であって予測ではない**)
//   C3 同 kF 系列・f=一次則の自己無撞着解  … 慣性補正で P と径方向挙動が同時に説明できるか
//   C4 同 kF 系列・f=1+kF                  … χ≈1 近似の外挿対照(❄️ の χ は 0.0013/0.011 —— 反例用)
//   C5 3 候補(lib-w272b-pairlock)を係数に(α=1)・f1 と f=一次則
//      **候補は t=0 で 1 度だけ評価した定数**として kFrame に入れる(時間依存の法則を核へ接続してはいない)
//   C6 geoPN=3・kF0・f1・lawVersion scalar/local/complex(principle クラスの診断コピー)
//   C7 geoPN=3 + toyAllowDrag・kF={0.3,0.7,1}(mesh と E6′ の重畳 —— 二重計上の有無。較正扱いしない)
//   S  softening ε={0.05,0.025,0.0125} × {kF0,kF1}(刻み収束と softening 依存を混ぜない)
//
//   f の定義: **質量だけを f 倍する**(初期位置・初速は転写のまま)。転写初速は観測された相対速度
//   そのもの(2πa/P_obs と 0.003% で一致)なので、「同じ観測軌道を支える質量が f 倍」の診断に対応する。
//
// 実行:
//   PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright node tests/exp-w272b-charon.mjs [--stage h|h2|h4]
//       [--only C0,C1,C2_k0.3,…] [--pilot] [--steps N]
//   --pilot … 步数を 2,100,000(約 6 周)に落として検出器の同値だけ確かめる(正本に書かない)
// 出力: tests/out/charon-w272b.json(列 × 段で**併合**する。meta.targetSha256 が違う走行は混ぜない)
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { pairLockCandidates, pairLockInvariance, pairLockReferenceCases, PAIRLOCK_VERSION }
  from './lib-w272b-pairlock.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + path.join(ROOT, TARGET);
const OUT = path.join(ROOT, 'tests', 'out', 'charon-w272b.json');
const CALAUDIT = path.join(ROOT, 'tests', 'out', 'calaudit-w249.json');
const HARNESS_VERSION = 'w272b-1';

const argv = process.argv.slice(2);
const getArg = (k, d) => { const i = argv.indexOf(k); return (i >= 0 && argv[i + 1]) ? argv[i + 1] : d; };
const PILOT = argv.includes('--pilot');
const STAGE = getArg('--stage', 'h');
const ONLY = (getArg('--only', '') || '').split(',').map((z) => z.trim()).filter(Boolean);

// ---- 固定契約(走行前に決めた値) ------------------------------------------------
const STEP_H = 20700000, ORB_MAX = 60, PERI_WINDOW = 20;
const STAGES = { h: { dt: 0.016, steps: STEP_H }, h2: { dt: 0.008, steps: STEP_H * 2 }, h4: { dt: 0.004, steps: STEP_H * 4 } };
if (!STAGES[STAGE]) { console.error('--stage は h / h2 / h4'); process.exit(2); }
const STEPS = PILOT ? 2100000 : Number(getArg('--steps', STAGES[STAGE].steps));
const DT = STAGES[STAGE].dt;
const KF_SERIES = [0, 0.1, 0.3, 0.5, 0.7, 1];
const EPS_SERIES = [0.05, 0.025, 0.0125];

const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');
const targetSha256 = sha(fs.readFileSync(path.join(ROOT, TARGET)));
const libSha256 = sha(fs.readFileSync(path.join(ROOT, 'tests', 'lib-w272b-pairlock.mjs')));

// ---- 観測値・σ は **calaudit の正本から読む**(手で打ち直さない) ----------------
let OBS = null;
try {
  const ca = JSON.parse(fs.readFileSync(CALAUDIT, 'utf8'));
  const pc = ca.presets.find((p) => p.id === 'plutoCharonReal');
  const row = pc.quantities.find((q) => q.kind === 'period' && q.adopted && q.adopted.value > 0);
  OBS = { value: row.adopted.value, sigma: row.adopted.sigma, unit: row.adopted.unit,
    key: row.adopted.key, recordId: row.adopted.recordId, source: row.adopted.source,
    from: 'tests/out/calaudit-w249.json', calauditSha256: sha(fs.readFileSync(CALAUDIT)) };
} catch (e) { OBS = { error: String(e) }; }

// ================================================================ ブラウザ
const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let browser;
try { browser = await req('playwright').chromium.launch(); }
catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }
const pageErrors = [];
const page = await browser.newPage();
page.on('pageerror', (e) => pageErrors.push(String(e)));
await page.goto(INDEX, { waitUntil: 'load' });
await page.waitForFunction(() => window.HP && HP.sim);

// ---------------------------------------------------------------- ページ側ヘルパ
await page.evaluate((W) => {
  const ORB_MAX = W.ORB_MAX, PERI_WINDOW = W.PERI_WINDOW;
  window.__w272 = {};
  // 診断コピーを作る(内蔵は 1 bit も触らない)
  window.__w272.make = (cfg) => {
    const src = HP.allPresets().find((q) => q.id === 'plutoCharonReal');
    const p = JSON.parse(JSON.stringify(src));
    if (cfg.f !== undefined && cfg.f !== 1) for (const b of p.bodies) b.m = b.m * cfg.f;
    if (cfg.kFrame !== undefined) p.physics.kFrame = cfg.kFrame;
    if (cfg.softening !== undefined) p.physics.softening = cfg.softening;
    if (cfg.geoPN !== undefined) p.physics.geoPN = cfg.geoPN;
    if (cfg.geoPN === 3) {
      // geoPN=3 は sampleClass:"calibration" では拒否される(現実較正にトイを混ぜない)。
      // **診断コピーを principle クラスへ落として**受理条件を満たす形にする
      p.sampleClass = 'principle'; p.fidelity = 'toy'; delete p.notClaim;
      p.physics.spaceMesh = { mode: 'vertex', gravity: false, inertia: false,
        lawVersion: cfg.lawVersion || 'scalar' };
      if (cfg.toyAllowDrag) p.physics.spaceMesh.toyAllowDrag = true;
    }
    return p;
  };
  window.__w272.declaredState = (id) => {
    const src = HP.allPresets().find((q) => q.id === id);
    if (!src) return null;
    const v = HP.validatePreset(JSON.parse(JSON.stringify(src)));
    if (!v.ok) return { id, error: v.errors };
    HP.sim.build(v.preset);
    const S = HP.sim;
    if (S.n < 2) return { id, error: 'n<2' };
    const ph = v.preset.physics;
    return { id, emoji: src.emoji, name: src.name, n: S.n,
      G: S.params.G, D0: S.params.D0, D0pull: S.params.D0pull, softening: S.params.softening,
      kFrame: S.params.kFrame, frameWeight: S.params.frameWeight, scaleExpT: (src.scaleExp || {}).T,
      mA: S.m[0], mB: S.m[1], xA: S.x[0], yA: S.y[0], xB: S.x[1], yB: S.y[1],
      vxA: S.vx[0], vyA: S.vy[0], vxB: S.vx[1], vyB: S.vy[1],
      omegaA: S.spin[0], omegaB: S.spin[1], declaredGeoPN: ph.geoPN };
  };
  window.__w272.chi = (mA, mB, a, D0, eps, p) => HP.dfmBinaryChi(mA, mB, a, D0, eps, p);
  window.__w272.fLin = (mA, mB, a, D0, eps, kF, p) => HP.dfmBinaryMassFactorLinear(mA, mB, a, D0, eps, kF, p);
  window.__w272.fQuad = (mA, mB, a, D0, eps, kF, p) => HP.dfmBinaryMassFactor(mA, mB, a, D0, eps, kF, p);

  // 本体: 1 走行で固定した保存量をすべて測る
  window.__w272.run = (cfg, dt, maxSteps) => {
    const p = window.__w272.make(cfg);
    const v = HP.validatePreset(p);
    if (!v.ok) return { error: 'validate', errors: v.errors, warnings: v.warnings };
    HP.sim.build(v.preset);
    const S = HP.sim;
    const G = S.params.G, eps = S.params.softening;
    const ci = 0, oi = 1;
    const mA = S.m[ci], mB = S.m[oi], MT = mA + mB;
    const cm0x = (mA * S.x[ci] + mB * S.x[oi]) / MT, cm0y = (mA * S.y[ci] + mB * S.y[oi]) / MT;
    const tot0 = S.totals();
    const eNewton = () => {
      const dx = S.x[oi] - S.x[ci], dy = S.y[oi] - S.y[ci];
      const rr = Math.sqrt(dx * dx + dy * dy + eps * eps);
      let k = 0; for (let i = 0; i < S.n; i++) k += 0.5 * S.m[i] * (S.vx[i] * S.vx[i] + S.vy[i] * S.vy[i]);
      return k - G * mA * mB / rr;
    };
    const pAbs = () => { let s = 0; for (let i = 0; i < S.n; i++) s += S.m[i] * Math.hypot(S.vx[i], S.vy[i]); return s; };
    const e0 = eNewton(), pScale0 = pAbs();
    const osc0 = (() => {
      const dx = S.x[oi] - S.x[ci], dy = S.y[oi] - S.y[ci];
      const dvx = S.vx[oi] - S.vx[ci], dvy = S.vy[oi] - S.vy[ci];
      const r = Math.hypot(dx, dy), v2 = dvx * dvx + dvy * dvy, mu = G * MT;
      const inv = 2 / r - v2 / mu, a = (inv !== 0) ? 1 / inv : NaN;
      const ex = (v2 * dx - (dx * dvx + dy * dvy) * dvx) / mu - dx / r;
      const ey = (v2 * dy - (dx * dvx + dy * dvy) * dvy) / mu - dy / r;
      return { r, a, e: Math.hypot(ex, ey), mu, P: (a > 0) ? 2 * Math.PI * Math.sqrt(a * a * a / mu) : NaN };
    })();

    let r2p = 0, r1p = 0, th2 = 0, th1 = 0, rd1 = 0;
    let rMin = Infinity, rMax = -Infinity, rMin1 = Infinity, rMax1 = -Infinity;
    const A = [], B = [], rev = [];
    let angAcc = 0, angPrev = Math.atan2(S.y[oi] - S.y[ci], S.x[oi] - S.x[ci]);
    let oscA = 0, oscP = 0, oscE = 0, oscN = 0, cmMax = 0;
    const sampleEvery = Math.max(1, Math.round(maxSteps / 2000));
    let k = 0, stop = 'steps', nan = false;
    for (; k < maxSteps; k++) {
      S.step(dt);
      const dx = S.x[oi] - S.x[ci], dy = S.y[oi] - S.y[ci];
      const rr = Math.hypot(dx, dy), th = Math.atan2(dy, dx);
      const dvx = S.vx[oi] - S.vx[ci], dvy = S.vy[oi] - S.vy[ci];
      const rd = (rr > 0) ? (dx * dvx + dy * dvy) / rr : 0;
      if (rr < rMin) rMin = rr; if (rr > rMax) rMax = rr;
      if (!rev.length) { if (rr < rMin1) rMin1 = rr; if (rr > rMax1) rMax1 = rr; }
      let d = th - angPrev; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
      const prevAcc = angAcc; angAcc += d; angPrev = th;
      const nPrev = Math.floor(Math.abs(prevAcc) / (2 * Math.PI)), nNow = Math.floor(Math.abs(angAcc) / (2 * Math.PI));
      if (nNow > nPrev && rev.length < ORB_MAX + 2) {
        const target = Math.sign(angAcc) * nNow * 2 * Math.PI;
        const fr = (angAcc !== prevAcc) ? (target - prevAcc) / (angAcc - prevAcc) : 0;
        rev.push((k - 1 + fr) * dt);
      }
      if (k >= 1 && rd1 < 0 && rd >= 0 && A.length < ORB_MAX + 3) {
        const fr = (rd !== rd1) ? (-rd1 / (rd - rd1)) : 0;
        let a1 = th1, a2 = th; while (a2 - a1 > Math.PI) a2 -= 2 * Math.PI; while (a2 - a1 < -Math.PI) a2 += 2 * Math.PI;
        A.push({ ang: a1 + fr * (a2 - a1), k: k - 1 + fr, r: rr });
      }
      if (k >= 2 && r1p < r2p && r1p < rr && B.length < ORB_MAX + 3) {
        const dd = (r2p - 2 * r1p + rr), fr = (dd !== 0) ? 0.5 * (r2p - rr) / dd : 0;
        let a1 = th2, a2 = th1, a3 = th;
        while (a2 - a1 > Math.PI) a2 -= 2 * Math.PI; while (a2 - a1 < -Math.PI) a2 += 2 * Math.PI;
        while (a3 - a2 > Math.PI) a3 -= 2 * Math.PI; while (a3 - a2 < -Math.PI) a3 += 2 * Math.PI;
        B.push({ ang: a2 + 0.5 * fr * (a3 - a1) + 0.5 * fr * fr * (a3 - 2 * a2 + a1), k: k - 1 + fr, r: r1p });
      }
      r2p = r1p; r1p = rr; th2 = th1; th1 = th; rd1 = rd;
      if (k % sampleEvery === 0) {
        const v2 = dvx * dvx + dvy * dvy, mu = osc0.mu;
        const inv = 2 / rr - v2 / mu, a = (inv !== 0) ? 1 / inv : NaN;
        if (Number.isFinite(a) && a > 0) {
          const ex = (v2 * dx - (dx * dvx + dy * dvy) * dvx) / mu - dx / rr;
          const ey = (v2 * dy - (dx * dvx + dy * dvy) * dvy) / mu - dy / rr;
          oscA += a; oscP += 2 * Math.PI * Math.sqrt(a * a * a / mu); oscE += Math.hypot(ex, ey); oscN++;
        }
        const cx = (S.m[ci] * S.x[ci] + S.m[oi] * S.x[oi]) / MT, cy = (S.m[ci] * S.y[ci] + S.m[oi] * S.y[oi]) / MT;
        const cd = Math.hypot(cx - cm0x, cy - cm0y); if (cd > cmMax) cmMax = cd;
        if (S.hasNaN()) { nan = true; stop = 'nan'; break; }
      }
      if (rev.length >= ORB_MAX) { stop = 'orbMax'; break; }
    }
    const steps = k;
    const fit = (raw, pRef) => {
      const mid = 0.5 * (rMin + rMax);
      const peri = raw.filter((q) => q.r <= mid);
      const rej = { apo: raw.length - peri.length, dup: 0, jump: 0 };
      const keep = [];
      for (const q of peri) {
        if (keep.length && (q.k - keep[keep.length - 1].k) * dt < 0.5 * pRef) { rej.dup++; continue; }
        keep.push(q);
      }
      const use = keep, ang = [];
      for (let i = 0; i < use.length; i++) {
        let a = use[i].ang;
        if (i) { let z = a - ang[i - 1]; while (z > Math.PI) z -= 2 * Math.PI; while (z < -Math.PI) z += 2 * Math.PI;
          if (Math.abs(z) > Math.PI / 2) { rej.jump++; break; }
          a = ang[i - 1] + z; }
        ang.push(a);
      }
      const n = ang.length; let slope = null, resid = null;
      if (n >= 2) {
        const mx = (n - 1) / 2, my = ang.reduce((x, y) => x + y, 0) / n;
        let sxy = 0, sxx = 0;
        for (let i = 0; i < n; i++) { sxy += (i - mx) * (ang[i] - my); sxx += (i - mx) * (i - mx); }
        slope = sxy / sxx;
        resid = Math.sqrt(ang.reduce((s2, a2, i) => s2 + (a2 - (my + slope * (i - mx))) ** 2, 0) / n);
      }
      const win = use.slice(0, PERI_WINDOW), measured = (win.length >= PERI_WINDOW);
      return { nPeri: n, rej, slopeDeg: slope === null ? null : slope * 180 / Math.PI,
        residDeg: resid === null ? null : resid * 180 / Math.PI,
        perMean: measured ? (win[PERI_WINDOW - 1].k - win[0].k) * dt / (PERI_WINDOW - 1) : null,
        perFound: use.length, perWindow: PERI_WINDOW, perUnmeasured: !measured };
    };
    const pRef = Number.isFinite(osc0.P) ? osc0.P : (rev.length > 1 ? rev[1] - rev[0] : 1);
    const revP = []; for (let i = 0; i < rev.length; i++) revP.push(i ? rev[i] - rev[i - 1] : rev[0]);
    const tot1 = S.totals(), e1 = eNewton();
    const px = tot1.px - tot0.px, py = tot1.py - tot0.py;
    return {
      cfgApplied: { kFrame: S.params.kFrame, geoPN: S.params.geoPN, softening: S.params.softening,
        mA: S.m[ci], mB: S.m[oi], D0: S.params.D0, frameWeight: S.params.frameWeight,
        hasGeoToy: !!S.hasGeoToy, geoToyDeny: S.geoToyDeny || null, geoToyStop: S.geoToyStop || null,
        geoToyOverlay: S.geoToyOverlay || null },
      warnings: v.warnings, steps, stop, nan, dt,
      rev: revP.slice(0, 8), revN: revP.length,
      revMean: revP.length ? revP.reduce((x, y) => x + y, 0) / revP.length : null,
      A: fit(A, pRef), B: fit(B, pRef),
      rMin, rMax, rMin1, rMax1,
      eProxy: (rMax + rMin > 0) ? (rMax - rMin) / (rMax + rMin) : null,
      eProxy1: (rMax1 + rMin1 > 0 && rMax1 > 0) ? (rMax1 - rMin1) / (rMax1 + rMin1) : null,
      osc0, oscA: oscN ? oscA / oscN : null, oscP: oscN ? oscP / oscN : null, oscE: oscN ? oscE / oscN : null,
      ledger: {
        Lrel: (tot0.L !== 0) ? Math.abs(tot1.L - tot0.L) / Math.abs(tot0.L) : null,
        Pabs: Math.hypot(px, py), Prel: (pScale0 > 0) ? Math.hypot(px, py) / pScale0 : null,
        Erel: (e0 !== 0) ? Math.abs(e1 - e0) / Math.abs(e0) : null, E0: e0, E1: e1,
        cmMax, note: 'E6′/1PN は保存力ではない — 保存の主張ではなく列間比較のための同一定義の診断値' },
      clamp: { V: S.clampVN, S: S.clampSN, H: S.clampHN, A: S.clampAN, R: S.clampRN, T: S.clampTN }
    };
  };
}, { ORB_MAX, PERI_WINDOW });

// ---------------------------------------------------------------- 宣言済みの系の t=0 状態
const DECLARED_IDS = ['plutoCharonReal', 'psrDoubleABDFM', 'psrJ1757DFM', 'psrJ1946DFM',
  'psrB1534DFM', 'alphaCenAB', 'siriusAB', 'neptuneReal', 'venusReal'];
const declared = [];
for (const id of DECLARED_IDS) {
  const st = await page.evaluate((i) => window.__w272.declaredState(i), id);
  if (!st || st.error) { declared.push({ id, error: st ? st.error : 'missing' }); continue; }
  const a = Math.hypot(st.xB - st.xA, st.yB - st.yA);
  const pw = (st.frameWeight === 'pull') ? 2 : 1;
  const D0use = (pw === 2 && st.D0pull > 0) ? st.D0pull : st.D0;
  const chi = await page.evaluate((z) => window.__w272.chi(z.mA, z.mB, z.a, z.D0, z.eps, z.p),
    { mA: st.mA, mB: st.mB, a, D0: D0use, eps: st.softening, p: pw });
  // **3 候補とも k₀=k_Frame=1 で正規化した値**を表にする(系ごとの宣言 kFrame は別欄 —— そうしないと
  // kFrame=0 を宣言した系〔📻 型〕では候補(ii)が構造的に 0 になり、系どうしを比べられない)
  const cand = pairLockCandidates({ ...st, k0: 1, kFrame: 1, alpha: 1, chiA: chi.chiA, chiB: chi.chiB });
  const inv = pairLockInvariance({ ...st, k0: 1, kFrame: 1, alpha: 1, chiA: chi.chiA, chiB: chi.chiB });
  declared.push({ id, emoji: st.emoji, kFrameDeclared: st.kFrame, frameWeight: st.frameWeight,
    normalization: 'k0=kFrame=1, alpha=1',
    a, chiA: chi.chiA, chiB: chi.chiB, omegaA: st.omegaA, omegaB: st.omegaB,
    kin: cand.kin, candI: cand.candI.k, candII: cand.candII.k, candIII: cand.candIII.k,
    X2: cand.candI.X2, sLock: cand.candII.sLock, tLock: cand.candIII.tLock, rQuiet: cand.candIII.rQuiet,
    invarianceOk: inv.ok, invariance: inv.checks.map((c) => ({ name: c.name, resid: c.resid })) });
}

// ---------------------------------------------------------------- 列の定義
const pc = declared.find((d) => d.id === 'plutoCharonReal');
const A0 = pc.a, D00 = 0.006, EPS0 = 0.05;
const base = await page.evaluate((i) => window.__w272.declaredState(i), 'plutoCharonReal');
const fLinAt = {};
for (const kf of KF_SERIES) {
  const r = await page.evaluate((z) => window.__w272.fLin(z.mA, z.mB, z.a, z.D0, z.eps, z.kF, 1),
    { mA: base.mA, mB: base.mB, a: A0, D0: D00, eps: EPS0, kF: kf });
  fLinAt[kf] = r ? r.f : null;
}
const candK = { i: pc.candI, ii: pc.candII, iii: pc.candIII };
const fLinCand = {};
for (const key of ['i', 'ii', 'iii']) {
  const r = await page.evaluate((z) => window.__w272.fLin(z.mA, z.mB, z.a, z.D0, z.eps, z.kF, 1),
    { mA: base.mA, mB: base.mB, a: A0, D0: D00, eps: EPS0, kF: candK[key] });
  fLinCand[key] = r ? r.f : null;
}

const COLUMNS = [];
const add = (id, series, cfg, note) => COLUMNS.push({ id, series, cfg, note });
add('C0', 'C0', { kFrame: 1, f: 1, geoPN: 2, softening: EPS0 }, '現行入力(公開測定の再現)');
add('C1', 'C1', { kFrame: 0, f: 1, geoPN: 2, softening: EPS0 }, '同期仮説の最小対照');
for (const kf of KF_SERIES) add('C2_k' + kf, 'C2', { kFrame: kf, f: 1, geoPN: 2, softening: EPS0 }, 'kF 感度・f=1');
for (const kf of KF_SERIES) add('C3_k' + kf, 'C3', { kFrame: kf, f: fLinAt[kf], geoPN: 2, softening: EPS0 }, 'f=一次則の自己無撞着解 ' + fLinAt[kf]);
for (const kf of KF_SERIES) add('C4_k' + kf, 'C4', { kFrame: kf, f: 1 + kf, geoPN: 2, softening: EPS0 }, 'f=1+kF(χ≈1 近似の外挿対照)');
for (const key of ['i', 'ii', 'iii']) {
  add('C5_' + key + '_f1', 'C5', { kFrame: candK[key], f: 1, geoPN: 2, softening: EPS0 }, '候補(' + key + ')の t=0 定数 k=' + candK[key]);
  add('C5_' + key + '_flin', 'C5', { kFrame: candK[key], f: fLinCand[key], geoPN: 2, softening: EPS0 }, '候補(' + key + ')+一次則 f=' + fLinCand[key]);
}
for (const lv of ['scalar', 'local', 'complex']) add('C6_' + lv, 'C6', { kFrame: 0, f: 1, geoPN: 3, lawVersion: lv, softening: EPS0 }, 'geoPN=3・kF0・lawVersion=' + lv);
for (const kf of [0.3, 0.7, 1]) add('C7_k' + kf, 'C7', { kFrame: kf, f: 1, geoPN: 3, lawVersion: 'scalar', toyAllowDrag: true, softening: EPS0 }, 'geoPN=3 + toyAllowDrag(重畳・較正扱いしない)');
for (const ep of EPS_SERIES) for (const kf of [0, 1]) add('S_e' + ep + '_k' + kf, 'S', { kFrame: kf, f: 1, geoPN: 2, softening: ep }, 'softening 依存');

const run = COLUMNS.filter((c) => !ONLY.length || ONLY.includes(c.id) || ONLY.includes(c.series));

// ---------------------------------------------------------------- 走行
const SEC = Math.pow(10, base.scaleExpT);   // 1 時間単位 = 10^T 秒
const results = {};
for (const col of run) {
  const t0 = Date.now();
  const r = await page.evaluate((z) => window.__w272.run(z.cfg, z.dt, z.steps),
    { cfg: col.cfg, dt: DT, steps: STEPS });
  const wall = (Date.now() - t0) / 1000;
  if (r.error) { results[col.id] = { ...col, stage: STAGE, error: r.error, errors: r.errors }; continue; }
  const revSec = r.rev.map((x) => x * SEC);
  const rev2 = (revSec.length > 1) ? revSec[1] : null;
  const periASec = (r.A.perMean !== null) ? r.A.perMean * SEC : null;
  const periBSec = (r.B.perMean !== null) ? r.B.perMean * SEC : null;
  const pct = (m) => (m === null || !OBS.value) ? null : (m - OBS.value) / OBS.value * 100;
  const sig = (m) => (m === null || !OBS.sigma) ? null : (m - OBS.value) / OBS.sigma;
  results[col.id] = { ...col, stage: STAGE, dt: DT, stepsRequested: STEPS, wallSec: wall,
    revSec, revN: r.revN, rev2Sec: rev2, periASec, periBSec, oscSec: r.oscP ? r.oscP * SEC : null,
    residPctRev: pct(rev2), sigmaRev: sig(rev2), residPctPeriA: pct(periASec), sigmaPeriA: sig(periASec),
    precessDegPerRevA: r.A.slopeDeg, precessResidDegA: r.A.residDeg,
    precessDegPerRevB: r.B.slopeDeg, precessResidDegB: r.B.residDeg,
    eProxy: r.eProxy, eProxy1: r.eProxy1, rMin: r.rMin, rMax: r.rMax,
    ledger: r.ledger, clamp: r.clamp, nan: r.nan, stop: r.stop, steps: r.steps,
    cfgApplied: r.cfgApplied, warnings: r.warnings, oscA: r.oscA, oscE: r.oscE };
  const R = results[col.id];
  console.log([col.id.padEnd(14), 'kF=' + String(r.cfgApplied.kFrame).padEnd(8),
    'P2=' + (rev2 === null ? '—' : rev2.toFixed(3)).padStart(14),
    'res%=' + (R.residPctRev === null ? '—' : R.residPctRev.toFixed(5)).padStart(11),
    'σ=' + (R.sigmaRev === null ? '—' : R.sigmaRev.toExponential(3)).padStart(11),
    'e=' + (r.eProxy === null ? '—' : r.eProxy.toExponential(3)),
    'stop=' + r.stop, 'nan=' + r.nan, 'wall=' + wall.toFixed(1) + 's'].join(' '));
}

// ---------------------------------------------------------------- 純関数の基準ケース
const refCases = pairLockReferenceCases().map((c) => {
  const v = pairLockCandidates(c.s), inv = pairLockInvariance(c.s);
  return { id: c.id, k: [v.candI.k, v.candII.k, v.candIII.k], expect: c.expect,
    invarianceOk: inv.ok, checks: inv.checks.map((z) => ({ name: z.name, resid: z.resid })) };
});

// ---------------------------------------------------------------- 併合して書く
let prev = null;
try { prev = JSON.parse(fs.readFileSync(OUT, 'utf8')); } catch { prev = null; }
if (prev && prev.meta && prev.meta.targetSha256 !== targetSha256) {
  console.error('meta.targetSha256 が違う走行は混ぜない(既存を捨てる): ' + prev.meta.targetSha256 + ' → ' + targetSha256);
  prev = null;
}
const merged = (prev && prev.columns) ? prev.columns : {};
for (const [id, r] of Object.entries(results)) { merged[id] = merged[id] || {}; merged[id][STAGE] = r; }

// ---------------------------------------------------------------- 3 段そろった列の次数と ε̂
// 規約は第271便a と同じ: p_obs=log₂|(Q_h−Q_{h/2})/(Q_{h/2}−Q_{h/4})|・**ε̂=|Q_{h/2}−Q_{h/4}|/(2^p−1)**・
// 次数は**連続 2 段差が同符号のときだけ**立てる。**判定はしない**(門は統括の器が持つ)。
const stageOrders = {};
for (const [id, byStage] of Object.entries(merged)) {
  if (!byStage.h || !byStage.h2 || !byStage.h4) continue;
  const q = [byStage.h.rev2Sec, byStage.h2.rev2Sec, byStage.h4.rev2Sec];
  if (!q.every((z) => Number.isFinite(z))) continue;
  const d1 = q[1] - q[0], d2 = q[2] - q[1];
  const sameSign = Math.sign(d1) === Math.sign(d2) && d2 !== 0;
  const p = sameSign ? Math.log2(Math.abs(d1 / d2)) : null;
  const eps = (p !== null && Math.pow(2, p) !== 1) ? Math.abs(d2) / (Math.pow(2, p) - 1) : null;
  const sg = OBS && OBS.sigma > 0 ? OBS.sigma : null;
  stageOrders[id] = { stages: q, d1, d2, sameSign, pObs: p,
    epsHat: eps, epsHatSigma: (eps !== null && sg) ? eps / sg : null,
    assessedValue: q[2], assessedStage: 'h4',
    residPct: (OBS && OBS.value) ? (q[2] - OBS.value) / OBS.value * 100 : null,
    sigma: sg ? (q[2] - OBS.value) / sg : null,
    orderEstimable: sameSign,
    note: '次数は連続 2 段差が同符号のときだけ立てる(第271便a と同じ規約)。**判定はしていない**' };
}

const out = {
  meta: { wave: '第272便b', harness: 'tests/exp-w272b-charon.mjs', harnessVersion: HARNESS_VERSION,
    pairlockVersion: PAIRLOCK_VERSION, libSha256, target: TARGET, targetSha256,
    generatedAt: new Date().toISOString(), pilot: PILOT, stage: STAGE, dt: DT, stepsRequested: STEPS,
    contract: { stepH: STEP_H, orbMax: ORB_MAX, periWindow: PERI_WINDOW,
      stages: STAGES, judgedRevIndex: 1,
      note: '窓・終了条件・保存量は走行前に固定した(器の冒頭コメントが正本)。判定はしない —— 診断である' },
    stagesPresent: [...new Set(Object.values(merged).flatMap((z) => Object.keys(z)))].sort(),
    observation: OBS, secondsPerUnit: SEC,
    notClaim: ['カロンの合否', '新発見', 'kFrame≈0 の法則化', '潮汐ロックの証明', '引きずり式の確定'] },
  declaredSystems: declared, referenceCases: refCases, stageOrders,
  fLinearAtKF: fLinAt, fLinearAtCandidate: fLinCand, candidateK: candK,
  columns: merged, pageErrors };
if (!PILOT) {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
  console.log('wrote ' + OUT + ' (' + Object.keys(merged).length + ' columns)');
} else {
  console.log(JSON.stringify({ meta: out.meta, results }, null, 1).slice(0, 4000));
}
await browser.close();
