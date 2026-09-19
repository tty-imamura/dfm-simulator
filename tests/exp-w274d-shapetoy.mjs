// 第274便d(第64報「実在天体に先立ち**安定サンプル**を用意する」): **形状トイの完成判定器**。
//
// 何を測るか(**判定の列は測る前に決めてある** —— 第273便 R28 の「4 列で別々に記録する」流儀):
//   ① **参照形状**   …… 定常共分散が理論値(Cov(y)=I・Cov(w)=ω₀²I)へ入るか / 任意視線の投影の
//                        正規性(KS 距離)/ 軸幅の機械比較 / 有限時間で発散しない(NaN 0・clamp 0)。
//   ② **安定成長**   …… σ̂(t) と目標 σ(t) の残差(成長窓)と、成長が止まった後のドリフトを**分けて**測る。
//                        **1 枚の σ̂ は N 粒子の標本標準偏差**なので 1/√(2N) のゆらぎを持つ(N=240 で 4.6%)。
//                        判定は**偏り(残差の平均)**と、**ドリフト/その推定量のゆらぎ(z)**で行う。
//                        **無成長対照**(τ=0)を並べる。成長は「σ₀ の定常分布から出発した状態」で測る
//                        (初期配置の緩和と成長追従を混ぜないため —— 手順は下の `growth()`)。
//   ③ **復元性**     …… 潜在状態へ 5%・10% の摂動を入れ、複数 seed・複数 N(総質量固定)で
//                        幅が戻るかを測る。**物理座標だけを摂動しても規定運動が次の步で上書きする**ので、
//                        その列も「上書きされた」と**そのまま**記録する(Failure First)。
//   ④ **離散化**     …… エンジンの解析形 F・Q_h を、独立な行列指数(`tests/lib-w274d-shapetoy.mjs` の
//                        scaling-and-squaring)と突き合わせ、恒等式 C=F C Fᵀ+Q_h の残差を出す。
//                        **刻み dt を 16 倍にしても定常共分散が動かない**ことも測る。
//   ⑤ **結合の 2 案** …… `coupling:"prescribed"`(既定)と `"feedback"` を同じ宣言で並べる。
//   ⑥ **重力の対照**  …… G=0 / 0.8 / 8 の 600 步指紋を比べる(規定運動なら 1 bit も動かない)。
//
// **この器は合否を宣言しない**(数と、事前に決めた条件を満たしたかの真偽値だけを JSON へ置く)。
// 「安定した」と書いてよいのは ①〜③ の条件を満たした列だけで、**観測との一致は 1 つも測っていない**。
//
// **刻みについて**(正直な限界): 定常・復元の列は **dt=0.25 で回している**。この模型の離散化は
// 厳密(F=e^{Bh}・Q_h=C−F C Fᵀ)なので定常分布は刻みに依らず、④ の `stepSize` 列がそれを実測する。
// 細かい刻みを使わないのは、エンジン本体の 1 步が N=240 で約 2.9 ms かかるためである(性能の主張はしない)。
//
// 使い方:
//   PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright node tests/exp-w274d-shapetoy.mjs
// 環境変数: W274D_OUT(既定 tests/out/shapetoy-w274d.json)/ W274D_TARGET(既定 beta/index.html)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { discRef, ksStat, gaussKs95, moments } from './lib-w274d-shapetoy.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.W274D_TARGET || 'beta/index.html';
const OUT = process.env.W274D_OUT || path.join(ROOT, 'tests', 'out', 'shapetoy-w274d.json');
const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

// **事前に決めた合格条件**(宣言値。導出ではない)
const CRIT = {
  covRel: 0.05,        // 定常共分散の相対残差 |measured/theory − 1|
  crossAbs: 0.05,      // 主軸間の相関(標準化した積の平均)の絶対値
  ksK: 1.0,            // 投影の KS 距離 / (1.36/√n) —— 1 以下で「95% 点の内側」
  growRel: 0.05,       // 成長窓での |σ̂/σ_target − 1| の最大値
  driftZ: 2.0,         // 成長後のドリフトを**その推定量自身のゆらぎ**で割った z(2σ)
  recovRel: 0.05,      // 摂動から戻った後の |σ̂/σ_target − 1|
  discAbs: 1e-12,      // F と参照 expm の最大差・恒等式 C−(F C Fᵀ+Q) の最大残差
};
// 走行の刻みと窓(**宣言値**)。`W274D_SMOKE=1` は**配線の確認用の短い走行**で、
// この短縮版の数は正本にしない(正本は既定の窓で作る —— JSON の `run.smoke` に印が残る)。
const SMOKE = process.env.W274D_SMOKE === '1';
const RUN = { dt: 0.25, burnT: SMOKE ? 40 : 400, measT: SMOKE ? 100 : 2000, everyT: 20,
  growDt: SMOKE ? 0.25 : 0.05, growT: SMOKE ? 60 : 400, smoke: SMOKE };

// **落ちたら作り直して測り直す**(5 つの worktree が同時に Chromium を回すと、短い evaluate でも
// ページごと落ちることがある —— 落ちた回数は JSON の `retries` にそのまま残す)。
let browser = null, page = null;
const pageErrors = [];
const retries = [];
async function launchBrowser() {
  try { return await req('playwright').chromium.launch(); }
  catch { return await req('playwright-core').chromium.launch({ executablePath: EXE }); }
}
async function ensurePage() {
  if (page && !page.isClosed()) return page;
  try { if (browser) await browser.close(); } catch { /* 落ちている */ }
  browser = await launchBrowser();
  page = await browser.newPage();
  page.on('pageerror', (e) => pageErrors.push(String(e.message || e)));
  await page.goto('file://' + path.join(ROOT, TARGET), { waitUntil: 'load' });
  await page.waitForFunction(() => window.HP && HP.sim && HP.currentPreset());
  await injectHelpers();
  return page;
}
// 1 つの測定を**まるごと**やり直す(途中状態は `W.start` が作り直すので、再走は決定論のまま)
async function retry(label, fn, n) {
  const max = n || 3;
  for (let i = 0; i < max; i++) {
    try { await ensurePage(); return await fn(); }
    catch (e) {
      const msg = String((e && e.message) || e);
      if (i === max - 1) throw e;
      retries.push({ label, attempt: i + 1, error: msg.slice(0, 140) });
      try { if (page && !page.isClosed()) await page.close(); } catch { /* 済み */ }
      try { if (browser) await browser.close(); } catch { /* 済み */ }
      browser = null; page = null;
    }
  }
  return null;
}

// ---- 共通の in-page ヘルパ(ページを作り直すたびに注入する)
async function injectHelpers() {
  await page.evaluate(() => {
  window.W = {};
  // 宣言を差し替えた**診断コピー**を作る(**内蔵プリセットの physics は 1 バイトも変えない**)
  W.copy = (id, patch, top, seed) => {
    const p = JSON.parse(JSON.stringify(HP.allPresets().find((z) => z.id === id)));
    if (patch) p.physics.shapeToy = Object.assign({}, p.physics.shapeToy, patch);
    if (top) Object.assign(p.physics, top);
    if (seed) p.seed = seed;
    return p;
  };
  W.build = (p) => {
    const v = HP.validatePreset(JSON.parse(JSON.stringify(p)));
    if (!v.ok) throw new Error('validate: ' + (v.errors || []).join('|'));
    const S = HP.sim; S.build(v.preset); return S;
  };
  W.sample = (S) => {
    const y1 = [], y2 = [], z = [], w1 = [], w2 = [], wz = [];
    for (let i = 0; i < S.n; i++) {
      if (S.pinned[i]) continue;
      y1.push(S.yLat[2 * i]); y2.push(S.yLat[2 * i + 1]); z.push(S.zLat[i]);
      w1.push(S.wLat[2 * i]); w2.push(S.wLat[2 * i + 1]); wz.push(S.wzLat[i]);
    }
    return { y1, y2, z, w1, w2, wz };
  };
  W.phys = (S) => {
    const cf = S.params.shapeToy;
    const X = [], Y = [], Z = [], V = [];
    for (let i = 0; i < S.n; i++) {
      if (S.pinned[i]) continue;
      X.push(S.x[i] - cf.cx); Y.push(S.y[i] - cf.cy); Z.push(S.zLat[i] * S.shapeToySigmaZ);
      V.push(Math.hypot(S.vx[i], S.vy[i]));
    }
    return { X, Y, Z, V };
  };
  // 面内の標本標準偏差(腕は横断方向だけ)
  W.sd = (S) => {
    const p = W.phys(S), n = p.X.length;
    const mx = p.X.reduce((q, v) => q + v, 0) / n, my = p.Y.reduce((q, v) => q + v, 0) / n;
    let sx = 0, sy = 0;
    for (let i = 0; i < n; i++) { sx += (p.X[i] - mx) ** 2; sy += (p.Y[i] - my) ** 2; }
    return (S.params.shapeToy.shape === 'arm') ? Math.sqrt(sy / n) : Math.sqrt((sx + sy) / (2 * n));
  };
  // **チャンク実行**(1 回の evaluate を短く保つ —— 長い evaluate はページごと落ちることがある)。
  // 状態は `W.S` に置き、標本は `W.ACC` に積む。刻みと採取間隔は呼び出し側が決める。
  W.start = (p) => {
    W.S = W.build(p);
    W.ACC = { y1: [], y2: [], z: [], w1: [], w2: [], wz: [] };
    W.c12 = 0; W.n12 = 0; W.snaps = 0; W.vmax = 0; W.rmax = 0; W.rs = []; W.rows = [];
    return { n: W.S.n };
  };
  W.go = (steps, dt) => { const S = W.S; for (let k = 0; k < steps; k++) S.step(dt); return S.t; };
  // 採取つき(every 步ごと)。cap は積む標本の上限(転送量を抑える)
  W.goSample = (steps, dt, every, cap) => {
    const S = W.S;
    for (let k = 0; k < steps; k++) {
      S.step(dt);
      if (every <= 0 || (k + 1) % every) continue;
      W.snaps++;
      const s = W.sample(S), p = W.phys(S);
      if (W.ACC.z.length < cap) for (const key of Object.keys(W.ACC)) for (const v of s[key]) W.ACC[key].push(v);
      for (let i = 0; i < s.y1.length; i++) { W.c12 += s.y1[i] * s.y2[i]; W.n12++; }
      for (let i = 0; i < p.X.length; i++) {
        if (p.V[i] > W.vmax) W.vmax = p.V[i];
        const r = Math.hypot(p.X[i], p.Y[i]);
        if (r > W.rmax) W.rmax = r;
        if (W.rs.length < 20000) W.rs.push(Math.hypot(p.X[i], p.Y[i], p.Z[i]) / S.shapeToySigma);
      }
    }
    return W.snaps;
  };
  // σ̂(t) の行だけを積む(成長の列)
  W.goRows = (steps, dt, every) => {
    const S = W.S;
    for (let k = 0; k < steps; k++) {
      if ((k % every) === 0) W.rows.push({ t: S.t, sd: W.sd(S), sigma: S.shapeToySigma, len: S.shapeToyLen });
      S.step(dt);
    }
    return W.rows.length;
  };
  W.result = () => {
    const S = W.S, cf = S.params.shapeToy;
    return { acc: W.ACC, cross12: W.n12 ? W.c12 / W.n12 : 0, snaps: W.snaps,
      vmax: W.vmax, rmax: W.rmax, rs: W.rs, rows: W.rows,
      sigma: S.shapeToySigma, sigmaZ: S.shapeToySigmaZ, omega0: cf.omega0,
      shape: cf.shape, coupling: cf.coupling, branch: S.shapeToyBranch,
      stop: S.shapeToyStop, nan: S.hasNaN(), clampV: S.clampVN, clampS: S.clampSN, n: S.shapeToyN,
      ledger: { p: [S.shapeToyPx + S.shapeToyBathPx, S.shapeToyPy + S.shapeToyBathPy],
        l: S.shapeToyL + S.shapeToyBathL, e: S.shapeToyE + S.shapeToyBathE,
        sup: S.shapeToySupE, det: S.shapeToyDetE, got: S.shapeToyE },
      t: S.t };
  };
  W.fingerprint = (S) => {
    let a = 0x811c9dc5;
    const buf = new ArrayBuffer(8), f = new Float64Array(buf), u = new Uint8Array(buf);
    const push = (v) => { f[0] = v; for (let b = 0; b < 8; b++) { a ^= u[b]; a = Math.imul(a, 0x01000193) >>> 0; } };
    for (const k of ['x', 'y', 'vx', 'vy']) for (let i = 0; i < S.n; i++) push(S[k][i]);
    return a.toString(16);
  };
  });
}
await ensurePage();

// **チャンク駆動**(1 回の evaluate を短く保つ)。`fn` は in-page の関数名、`n` は総步数。
async function drive(fn, n, dt, every, cap) {
  const chunk = every > 0 ? every * Math.max(1, Math.ceil(800 / every)) : 800;
  let done = 0;
  while (done < n) {
    const k = Math.min(chunk, n - done);
    await page.evaluate((a) => W[a.fn](a.k, a.dt, a.every, a.cap),
      { fn, k, dt, every: every || 0, cap: cap || 0 });
    done += k;
  }
}

const IDS = ['shapeToyCluster', 'shapeToyDisk', 'shapeToyArm'];

// ================= ④ 離散化(解析形 vs 独立な行列指数・恒等式)=================
const discCases = [
  { omega0: 0.10, gamma: 0.25, h: 0.016 },   // 過減衰(🔮)
  { omega0: 0.10, gamma: 0.08, h: 0.016 },   // 不足減衰(🥏)
  { omega0: 0.12, gamma: 0.24, h: 0.016 },   // 臨界(🧵)
  { omega0: 0.10, gamma: 0.25, h: 0.25 },    // 本器の走行刻み
  { omega0: 0.10, gamma: 0.25, h: 5 },       // **とても大きな刻み**(定常は動かないはず)
  { omega0: 2.0, gamma: 0.1, h: 0.25 },      // 強い振動
];
const disc = [];
for (const c of discCases) {
  const eng = await retry('disc', () => page.evaluate((q) => HP.shapeToyDisc(q.omega0, q.gamma, q.h), c));
  const ref = discRef(c.omega0, c.gamma, c.h);
  const dF = Math.max(Math.abs(eng.F11 - ref.F11), Math.abs(eng.F12 - ref.F12),
    Math.abs(eng.F21 - ref.F21), Math.abs(eng.F22 - ref.F22));
  const dQ = Math.max(Math.abs(eng.q11 - ref.q11), Math.abs(eng.q12 - ref.q12),
    Math.abs(eng.q22 - ref.q22));
  const w2 = c.omega0 * c.omega0;
  const id11 = Math.abs(1 - (eng.F11 * eng.F11 + w2 * eng.F12 * eng.F12 + eng.q11));
  const id12 = Math.abs(0 - (eng.F11 * eng.F21 + w2 * eng.F12 * eng.F22 + eng.q12));
  const id22 = Math.abs(w2 - (eng.F21 * eng.F21 + w2 * eng.F22 * eng.F22 + eng.q22));
  const r11 = Math.abs(eng.l11 * eng.l11 - eng.q11);
  const r12 = Math.abs(eng.l11 * eng.l21 - eng.q12);
  const r22 = Math.abs(eng.l21 * eng.l21 + eng.l22 * eng.l22 - eng.q22);
  disc.push({ ...c, branch: eng.branch, dF, dQ, identity: Math.max(id11, id12, id22),
    chol: Math.max(r11, r12, r22),
    pass: Math.max(dF, dQ, id11, id12, id22, r11, r12, r22) <= CRIT.discAbs });
}

// ================= ① 参照形状(定常共分散・投影・軸幅)=================
async function stationary(id, patch, top, opt) {
  const o = Object.assign({ dt: RUN.dt, burnT: RUN.burnT, measT: RUN.measT, everyT: RUN.everyT },
    opt || {});
  const burn = Math.round(o.burnT / o.dt), steps = Math.round(o.measT / o.dt);
  const every = Math.max(1, Math.round(o.everyT / o.dt));
  await page.evaluate((a) => W.start(W.copy(a.id, a.patch, a.top, a.seed)),
    { id, patch, top, seed: (opt && opt.seed) || 0 });
  await drive('go', burn, o.dt, 0, 0);
  await drive('goSample', steps, o.dt, every, 80000);
  const raw = await page.evaluate(() => W.result());
  raw.dt = o.dt;
  return raw;
}

function shapeRow(id, raw, note) {
  const m = {};
  for (const k of ['y1', 'y2', 'z', 'w1', 'w2', 'wz']) m[k] = moments(raw.acc[k]);
  const isArm = raw.shape === 'arm';
  const axes = isArm ? ['y2', 'z'] : ['y1', 'y2', 'z'];
  const vel = isArm ? ['w2', 'wz'] : ['w1', 'w2', 'wz'];
  const varRel = axes.map((k) => m[k].var - 1);
  const velRel = vel.map((k) => m[k].var / (raw.omega0 * raw.omega0) - 1);
  const proj = [];
  for (const ang of [0, 30, 45, 60, 90]) {
    const a = ang * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a);
    const u = [];
    const A = isArm ? raw.acc.y2 : raw.acc.y1, B = raw.acc.z;
    for (let i = 0; i < A.length; i++) u.push(ca * A[i] + sa * B[i]);
    const mm = moments(u);
    const ks = ksStat(u.map((v) => (v - mm.mean) / mm.sd));
    proj.push({ ang, sd: mm.sd, kurt: mm.kurt, ks, ks95: gaussKs95(u.length),
      ksRatio: ks / gaussKs95(u.length) });
  }
  const rMean = raw.rs.length ? raw.rs.reduce((p, q) => p + q, 0) / raw.rs.length : null;
  const r2Mean = raw.rs.length ? raw.rs.reduce((p, q) => p + q * q, 0) / raw.rs.length : null;
  const ok = {
    cov: Math.max(...varRel.map(Math.abs)) <= CRIT.covRel,
    vel: Math.max(...velRel.map(Math.abs)) <= CRIT.covRel,
    cross: Math.abs(raw.cross12) <= CRIT.crossAbs,
    proj: Math.max(...proj.map((p) => p.ksRatio)) <= CRIT.ksK,
    finite: raw.nan === false && raw.clampV === 0 && raw.clampS === 0 && raw.stop === null,
    ledger: raw.ledger.p[0] === 0 && raw.ledger.p[1] === 0 && raw.ledger.l === 0 && raw.ledger.e === 0,
  };
  return { id, note, shape: raw.shape, coupling: raw.coupling, branch: raw.branch, dt: raw.dt,
    t: raw.t, snaps: raw.snaps, nSamples: m.z.n,
    varLatent: Object.fromEntries(axes.map((k) => [k, m[k].var])),
    varVel: Object.fromEntries(vel.map((k) => [k, m[k].var / (raw.omega0 * raw.omega0)])),
    cross12: raw.cross12, kurtosis: Object.fromEntries(axes.map((k) => [k, m[k].kurt])),
    proj, radial: { meanOverSigma: rMean, mean2OverSigma2: r2Mean,
      theoryMean: 2 * Math.sqrt(2 / Math.PI), theoryMean2: 3 },
    sigma: raw.sigma, sigmaZ: raw.sigmaZ, axisRatio: raw.sigmaZ / raw.sigma,
    vmax: raw.vmax, rmax: raw.rmax, nan: raw.nan, clampV: raw.clampV, clampS: raw.clampS,
    stop: raw.stop, n: raw.n, ledger: raw.ledger, ok,
    pass: Object.values(ok).every(Boolean) };
}

const stationaryRows = [];
for (const id of IDS) {
  const raw = await retry('reference:' + id, () => stationary(id, { tauGrow: 0 }, null, {}));
  stationaryRows.push(shapeRow(id, raw, '成長を切った定常(τ=0)・prescribed'));
}
// 刻み依存(厳密離散化なら定常は動かない)
const stepRows = [];
for (const dt of (SMOKE ? [0.25, 4] : [0.016, 0.25, 4])) {
  const raw = await retry('stepSize:' + dt, () => stationary('shapeToyCluster', { tauGrow: 0 }, null,
    { dt, measT: (dt < 0.1 ? 400 : RUN.measT), burnT: (dt < 0.1 ? 150 : 400) }));
  stepRows.push(Object.assign({ dtRun: dt }, shapeRow('shapeToyCluster', raw, 'dt=' + dt)));
}
// ⑤ coupling の 2 案
const couplingRows = [];
for (const c of ['prescribed', 'feedback']) {
  const raw = await retry('coupling:' + c,
    () => stationary('shapeToyCluster', { tauGrow: 0, coupling: c }, null, {}));
  couplingRows.push(Object.assign({ coupling: c }, shapeRow('shapeToyCluster', raw, 'coupling=' + c)));
}

// ================= ② 安定成長 =================
// **手順**: まず σ₀ の定常分布へ緩和させ(宣言 τ=0・σ=σ₀)、そこから成長の宣言へ差し替えて
// `S.t=0` に戻す。初期配置の緩和と、成長への追従を**分けて**測るための診断手順である
// (内蔵プリセットの JSON は 1 バイトも変えていない —— 走行中の params を診断のために差し替えている)。
async function growth(id, opt) {
  const o = Object.assign({ dt: RUN.growDt, T: RUN.growT, everyT: 2 }, opt || {});
  const pre = await page.evaluate((a) => {
    const base = W.copy(a.id, null, null);
    // **正準形**(検証器を通した宣言)を使う —— 生の宣言は省略キー(sigmaZ 等)を持たない
    const vp = HP.validatePreset(JSON.parse(JSON.stringify(base)));
    const cf0 = JSON.parse(JSON.stringify(vp.preset.physics.shapeToy));
    const mk = (o) => {
      const q = Object.assign({}, cf0, o);
      if (q.shape !== 'arm') { delete q.armLength; delete q.armLength0; }
      if (q.shape !== 'disk') delete q.omegaSpin;
      return q;
    };
    const r0 = cf0.sigma0 / cf0.sigma;
    const noGrow = a.patch ? mk(a.patch)
      : mk({ tauGrow: 0, sigma: cf0.sigma * r0, sigma0: cf0.sigma * r0, sigmaZ: cf0.sigmaZ * r0,
        armLength: cf0.armLength ? cf0.armLength0 : undefined });
    W.start(W.copy(a.id, noGrow, null));
    const relax = 1 / Math.max(1e-9, cf0.gamma / 2
      - Math.sqrt(Math.max(0, cf0.gamma * cf0.gamma / 4 - cf0.omega0 * cf0.omega0)));
    return { cf0, noGrow, relax, burn: Math.round(5 * relax / a.dt) };
  }, { id, patch: (opt && opt.patch) || null, dt: o.dt });
  await drive('go', pre.burn, o.dt, 0, 0);
  // 宣言を**成長あり**へ差し替え、t=0 に戻す(初期緩和と成長追従を分けるための診断手順)
  await page.evaluate((a) => {
    const S = W.S;
    S.params.shapeToy = JSON.parse(JSON.stringify(a.cf));
    S.shapeToy = S.params.shapeToy; S.t = 0;
  }, { cf: (opt && opt.patch) ? pre.noGrow : pre.cf0 });   // **正準形**を入れる(省略キーなし)
  const steps = Math.round(o.T / o.dt), every = Math.max(1, Math.round(o.everyT / o.dt));
  await drive('goRows', steps, o.dt, every, 0);
  const r = await page.evaluate(() => W.result());
  return { rows: r.rows, cf: (opt && opt.patch) ? pre.noGrow : pre.cf0, relax: pre.relax,
    burn: pre.burn, dt: o.dt, nan: r.nan, stop: r.stop, nPart: r.n };
}

function growthRow(id, g, note) {
  const cf = g.cf, tau = cf.tauGrow;
  const isArm = cf.shape === 'arm';
  const sigInf = isArm ? cf.sigma : cf.sigma;
  const target = (t) => sigInf * (tau > 0 ? (1 + (cf.sigma0 / cf.sigma - 1) * Math.exp(-t / tau)) : 1);
  const win = g.rows.filter((r) => r.t >= 0.2 * (tau || 10) && r.t <= 4 * (tau || 10));
  const post = g.rows.filter((r) => r.t >= 6 * (tau || 10));
  // **1 枚の σ̂ は N 粒子の標本標準偏差**なので、それ自体が 1/√(2N) のゆらぎを持つ(N=240 で 4.6%)。
  // 判定は**残差の平均(偏り)**で行い、1 枚ごとのばらつき(rms・max)は数として並べるだけにする。
  const resid = win.map((r) => r.sd / target(r.t) - 1);
  const meanResid = resid.length ? resid.reduce((p, q) => p + q, 0) / resid.length : null;
  const rmsResid = resid.length
    ? Math.sqrt(resid.reduce((p, q) => p + q * q, 0) / resid.length) : null;
  const maxResid = resid.length ? Math.max(...resid.map(Math.abs)) : null;
  const noise = g.nPart ? 1 / Math.sqrt(2 * g.nPart) : null;
  // **ドリフトは「その推定量自身のゆらぎ」と比べる**。σ̂ は 1 枚あたり 1/√(2N) のゆらぎを持ち、
  // 連続する枚は模型の緩和時間(`relax`)ぶん相関しているので、独立枚数は窓幅/relax で数える。
  // σ_drift = σ_point·√(12/n_eff)(等間隔標本の最小二乗の傾き × 窓幅 の標準偏差)。
  let drift = null, driftZ = null, driftSigma = null, nEff = null, pointSd = null;
  if (post.length > 2) {
    const n = post.length;
    const tm = post.reduce((p, r) => p + r.t, 0) / n, vm = post.reduce((p, r) => p + r.sd, 0) / n;
    let sxy = 0, sxx = 0;
    for (const r of post) { sxy += (r.t - tm) * (r.sd - vm); sxx += (r.t - tm) ** 2; }
    const slope = sxy / sxx, span = post[post.length - 1].t - post[0].t;
    drift = slope * span / vm;
    let s2 = 0;
    for (const r of post) { const fit = vm + slope * (r.t - tm); s2 += ((r.sd - fit) / vm) ** 2; }
    pointSd = Math.sqrt(s2 / n);
    nEff = Math.max(2, span / Math.max(1e-9, g.relax));
    driftSigma = pointSd * Math.sqrt(12 / nEff);
    driftZ = driftSigma > 0 ? drift / driftSigma : null;
  }
  return { id, note, tau, dt: g.dt, relax: g.relax, burnSteps: g.burn,
    sigma_inf: cf.sigma, sigma_0: cf.sigma0, armLength: cf.armLength, armLength0: cf.armLength0,
    rows: g.rows.filter((r, i) => i % 10 === 0 || i === g.rows.length - 1)
      .map((r) => ({ t: +r.t.toFixed(2), sd: +r.sd.toFixed(4), target: +target(r.t).toFixed(4),
        rel: +(r.sd / target(r.t) - 1).toFixed(5), len: +r.len.toFixed(2) })),
    maxResidGrowWindow: maxResid, meanResidGrowWindow: meanResid, rmsResidGrowWindow: rmsResid,
    samplingNoise: noise, nPart: g.nPart, postDrift: drift, postDriftZ: driftZ,
    postDriftSigma: driftSigma, postPointSd: pointSd, postNEff: nEff,
    nan: g.nan, stop: g.stop,
    ok: { grow: meanResid !== null && Math.abs(meanResid) <= CRIT.growRel,
      drift: driftZ !== null && Math.abs(driftZ) <= CRIT.driftZ,
      finite: g.nan === false && g.stop === null },
    pass: meanResid !== null && Math.abs(meanResid) <= CRIT.growRel && driftZ !== null
      && Math.abs(driftZ) <= CRIT.driftZ && g.nan === false && g.stop === null };
}

const growthRows = [];
for (const id of IDS) {
  growthRows.push(growthRow(id, await retry('growth:' + id, () => growth(id, {})), '既定の成長'));
}
growthRows.push(growthRow('shapeToyCluster',
  await retry('growth:control', () => growth('shapeToyCluster', { patch: { tauGrow: 0, sigma0: 90 } })),
  '**無成長対照**(τ=0・σ₀=σ_∞)'));

// ================= ③ 復元性(摂動 → 回復)=================
async function recover(id, o) {
  const a = Object.assign({ dt: RUN.dt, burnT: 300, measT: 400, mode: 'latent' }, o || {});
  const burn = Math.round(a.burnT / a.dt), steps = Math.round(a.measT / a.dt);
  await page.evaluate((q) => W.start(W.copy(q.id, { tauGrow: 0 }, null, q.seed)),
    { id, seed: a.seed || 0 });
  await drive('go', burn, a.dt, 0, 0);
  const kick = await page.evaluate((q) => {
    const S = W.S, before = W.sd(S);
    if (q.mode === 'latent') {
      for (let i = 0; i < S.n; i++) {
        S.yLat[2 * i] *= q.k; S.yLat[2 * i + 1] *= q.k; S.zLat[i] *= q.k;
      }
      S.step(q.dt);
    } else {
      // **物理座標だけの摂動**(規定運動なので次の步で上書きされる —— そのまま記録する)
      for (let i = 0; i < S.n; i++) { S.x[i] *= q.k; S.y[i] *= q.k; }
    }
    return { before, after: W.sd(S) };
  }, { k: a.k, mode: a.mode, dt: a.dt });
  const every = Math.max(1, Math.round(10 / a.dt));
  await drive('goRows', steps, a.dt, every, 0);
  const r = await page.evaluate(() => {
    const S = W.S;
    const tr = W.rows.map((q) => ({ t: +q.t.toFixed(2), sd: +q.sd.toFixed(4) }));
    const tail = tr.slice(-10);
    return { end: W.sd(S), endMean: tail.reduce((p, q) => p + q.sd, 0) / Math.max(1, tail.length),
      tailN: tail.length, target: S.shapeToySigma, sigmaZ: S.shapeToySigmaZ, trace: tr,
      n: S.shapeToyN, nan: S.hasNaN(), stop: S.shapeToyStop, t: S.t };
  });
  return Object.assign({ before: kick.before, after: kick.after }, r);
}

const recoveryRows = [];
for (const id of IDS) {
  for (const k of [1.05, 1.10]) {
    for (const seed of (SMOKE ? [20260919] : [20260919, 20260920, 20260921])) {
      const r = await retry(`recover:${id}:${k}:${seed}`, () => recover(id, { k, seed }));
      recoveryRows.push({ id, k, seed, mode: 'latent', ...r,
        kickRel: r.after / r.before - 1, endRel: r.endMean / r.target - 1,
        pass: Math.abs(r.endMean / r.target - 1) <= CRIT.recovRel
          && r.nan === false && r.stop === null });
    }
  }
}
{
  const r = await retry('recover:physical',
    () => recover('shapeToyCluster', { k: 1.10, mode: 'physical', measT: 100 }));
  recoveryRows.push({ id: 'shapeToyCluster', k: 1.10, mode: 'physical', ...r,
    kickRel: r.after / r.before - 1, endRel: r.endMean / r.target - 1,
    note: '**物理座標だけの摂動は次の步で規定運動が上書きする**(復元ではない)', pass: null });
}
// N を変える(総質量固定)
const nRows = [];
for (const n of (SMOKE ? [120] : [120, 240, 480])) {
  const mtot = 144;
  const nRow = await retry('nScaling:' + n, async () => {
  await page.evaluate((a) => {
    const p = W.copy('shapeToyCluster', { tauGrow: 0 }, null);
    p.bodies[0].n = a.n; p.bodies[0].mMin = a.mtot / a.n; p.bodies[0].mMax = a.mtot / a.n;
    W.start(p);
  }, { n, mtot });
  const burn = Math.round(RUN.burnT / RUN.dt), steps = Math.round(RUN.measT / RUN.dt);
  const every = Math.max(1, Math.round(RUN.everyT / RUN.dt));
  await drive('go', burn, RUN.dt, 0, 0);
  await drive('goSample', steps, RUN.dt, every, 200000);
  const r = await page.evaluate(() => {
    const S = W.S, y = W.ACC.y1.concat(W.ACC.y2);
    let m = 0; for (const v of y) m += v; m /= y.length;
    let s2 = 0; for (const v of y) s2 += (v - m) ** 2; s2 /= y.length;
    let mass = 0; for (let i = 0; i < S.n; i++) mass += S.m[i];
    return { n: S.n, mass, snaps: W.snaps, nSamples: y.length, varLatent: s2, sd: W.sd(S),
      sigma: S.shapeToySigma, nan: S.hasNaN(), stop: S.shapeToyStop };
  });
  return r;
  });
  nRows.push({ ...nRow, rel: nRow.varLatent - 1,
    pass: Math.abs(nRow.varLatent - 1) <= CRIT.covRel });
}

// ================= ⑥ 重力の対照(規定運動なら 1 bit も動かない)=================
const gravityRows = [];
for (const id of IDS) {
  const runs = await retry('gravity:' + id, () => page.evaluate((a) => {
    const out = [];
    for (const G of [0, 0.8, 8]) {
      const S = W.build(W.copy(a.id, null, { G }));
      for (let k = 0; k < 600; k++) S.step(0.016);
      out.push({ G, fp: W.fingerprint(S), nan: S.hasNaN(), stop: S.shapeToyStop, sd: W.sd(S) });
    }
    return out;
  }, { id }));
  gravityRows.push({ id, runs, same: runs.every((q) => q.fp === runs[0].fp) });
}

// ================= 出力 =================
const summary = {
  reference: stationaryRows.map((r) => ({ id: r.id, pass: r.pass, ok: r.ok })),
  growth: growthRows.map((r) => ({ id: r.id, note: r.note, pass: r.pass,
    meanResid: r.meanResidGrowWindow, rmsResid: r.rmsResidGrowWindow,
    maxResid: r.maxResidGrowWindow, noise: r.samplingNoise,
    drift: r.postDrift, driftZ: r.postDriftZ })),
  recoveryAllPass: recoveryRows.filter((r) => r.pass !== null).every((r) => r.pass),
  discretisation: disc.every((d) => d.pass),
  gravityBitSame: gravityRows.every((r) => r.same),
  stepIndependent: stepRows.every((r) => r.ok.cov && r.ok.vel),
  couplingFeedbackVar: couplingRows.map((r) => ({ coupling: r.coupling, varLatent: r.varLatent })),
};
const out = {
  meta: provenanceMeta({
    wave: '第274便d(第64報・安定サンプル)', root: ROOT, target: TARGET,
    inputs: [TARGET],
    code: ['tests/exp-w274d-shapetoy.mjs', 'tests/lib-w274d-shapetoy.mjs', 'tests/lib-w272e-provenance.mjs'],
  }),
  section: '形状トイ(指定した 3D 正規分布を定常分布に持つ参照モデル)の完成判定',
  notCalibration: '**較正ではない**。観測された星団・銀河・渦状腕の量を 1 つも入力していない。'
    + '「銀河が安定した」「腕が創発した」「DFM から正規分布が創発した」とは書かない —— '
    + '**指定した形状を定常分布に持つように作った参照モデル**の数である。',
  prescribedNote: '対象粒子は**規定運動**であり、重力はこの粒子の状態を決めない(G を変えても指紋が同じ)。',
  criteria: CRIT, run: RUN,
  discretisation: disc,
  reference: stationaryRows,
  stepSize: stepRows,
  coupling: couplingRows,
  growth: growthRows,
  recovery: recoveryRows,
  nScaling: nRows,
  gravityControl: gravityRows,
  summary,
  retries,      // **落ちて測り直した回数**(5 worktree の同時実行で起きる —— 隠さない)
  pageErrors,
};
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
await browser.close();
console.log('wrote', OUT);
console.log(JSON.stringify(summary, null, 1));
if (pageErrors.length) { console.error('pageErrors', pageErrors.slice(0, 3)); process.exit(1); }
