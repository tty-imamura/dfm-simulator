// 第262便c(第54報 W3)「門(4) の独立推定 —— 同じ抽出器・別の積分」。
//
// ■ この器が答える 4 つ
//   (1) **`integrator:"leapfrog"`(KDK)は本当に別の積分か** —— 600 步のビット比較で機械に言わせる。
//       (NS プリセットは追加フック〔spinSpin/axisForce/…〕を 1 つも宣言していないので、
//        **step ラッパの半キック分割だけでは何も変わらない**。変わるのは `S._core(dt,mode)` の
//        KDK フェーズ分割の側である —— 測って書く。)
//   (2) **台帳の系列**(⚡🧮🩺🧶 = kFrame=1)の独立推定: leapfrog-KDK の段ずらし Richardson。
//   (3) **kFrame=0 の診断系列**の独立推定: **エンジンの外の RK4 参照器**
//       (`tests/lib-w262c-refint.mjs` —— 同じ式を Float64・古典 RK4 で解く)。
//       📻 psrDoubleAB は**もともと kFrame=0**なので、ここが「観測量に対して門(4) が通る」唯一の系である。
//   (4) その独立推定を `HP.dfmForecastGate` へ**そのまま**渡し、門(4)(5) を機械で再判定する。
//
// ■ 作れなかったもの(Failure First —— 隠さない)
//   **kFrame=1 の DFM 全経路の「エンジンの外の」参照積分器は作れない。** E6′/geoPN=2 の引きずりは
//   `Δv = k_F·(u_n − u_{n−1})`(前步に保存した u との**差分をそのままインパルスとして足す**)であって、
//   dt を掛ける右辺(=常微分方程式の場)ではない。RK4 の中間段には「前步の u」が定義されないので、
//   **法則を書き換えずには RK4 化できない**。だから kFrame=1 側の独立推定は**エンジン内の別積分**
//   (leapfrog-KDK)だけである —— 「kF0 経路だけ」と表に明記する。
//
// ■ 触らないもの
//   `beta/index.html` は読むだけ。プリセット JSON は 1 bit も書き換えない(**診断コピー**に
//   `physics.kFrame=0` / `integrator:"leapfrog"` を当てるだけで、内蔵 JSON は不変)。
//   `S._core` には 1 命令も足していない。
//
// 実行: node tests/exp-w262c-independent.mjs [--only psrJ1946DFM,...] [--divs 1,2,4,8] [--budget-total 9000]
// 出力: tests/out/independent-w262c.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { createPeriastronDetector, PERI_PHASE_GATE_DEFAULT } from './lib-precision-diagnostics.mjs';
import { forceDfmE12kF0, runReference, shiftedRichardson } from './lib-w262c-refint.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const OUT = path.join(ROOT, 'tests', 'out', 'independent-w262c.json');
const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(k); return (i >= 0 && argv[i + 1]) ? argv[i + 1] : d; };
const ONLY = arg('--only', null) ? arg('--only', '').split(',') : null;
const DIVS = arg('--divs', null) ? arg('--divs', '').split(',').map(Number).filter((z) => z > 0) : [1, 2, 4, 8];
const BUDGET_TOTAL_S = Number(arg('--budget-total', 9000));
const BUDGET_STAGE_S = Number(arg('--budget', 2400));
const DT0 = 0.016;
const PERI_WINDOW = 20;
const YEAR_SEC = 31557600;   // ユリウス年(**単位の約束**であって観測ではない)

// 系(body は CSV の行名)。**観測数値はこの器に 1 つも書かない**(CSV が正本)。
const CASES = [
  { id: 'psrDoubleABDFM', emoji: '⚡', body: 'PSR J0737-3039 B', kind: 'ledger-kF1' },
  { id: 'psrJ1757DFM', emoji: '🧮', body: 'PSR J1757-1854', kind: 'ledger-kF1' },
  { id: 'psrJ1946DFM', emoji: '🩺', body: 'PSR J1946+2052', kind: 'ledger-kF1' },
  { id: 'psrB1534DFM', emoji: '🧶', body: 'PSR B1534+12', kind: 'ledger-kF1' },
  { id: 'psrDoubleAB', emoji: '📻', body: 'PSR J0737-3039 B', kind: 'observation-kF0' },
];

// ---- 観測レコード(CSV が正本)----
function loadObs() {
  const txt = fs.readFileSync(path.join(ROOT, 'paper', 'data', 'solar-observations.csv'), 'utf8');
  const rows = [];
  for (const line of txt.split('\n')) {
    if (!line.trim() || line.startsWith('body,')) continue;
    const cols = []; let cur = '', inQ = false;
    for (const ch of line) {
      if (inQ) { if (ch === '"') inQ = false; else cur += ch; }
      else if (ch === '"') inQ = true;
      else if (ch === ',') { cols.push(cur); cur = ''; }
      else cur += ch;
    }
    cols.push(cur);
    const sg = (cols[8] !== undefined && cols[8].trim() !== '') ? Number(cols[8]) : null;
    rows.push({ body: cols[0], quantity: cols[1], value: Number(cols[2]), unit: cols[3],
      source: String(cols[4]), sigma: (Number.isFinite(sg) && sg > 0) ? sg : null });
  }
  return rows;
}
const OBS_ROWS = loadObs();
const obsPick = (body, quantity, opt) => {
  const all = OBS_ROWS.filter((r) => r.body === body && r.quantity === quantity
    && (!opt || !opt.unit || r.unit === opt.unit));
  if (!all.length) return null;
  if (opt && opt.ddfwhe) {
    const v2 = all.filter((r) => /DDFWHE/.test(r.source));
    return v2.find((r) => r.sigma !== null) || v2[0] || null;
  }
  return all[0];
};

const LIB_SRC = fs.readFileSync(path.join(ROOT, 'tests', 'lib-precision-diagnostics.mjs'), 'utf8')
  .replace(/^export /gm, '');
const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let browser;
try { browser = await req('playwright').chromium.launch(); }
catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }
const pg = await browser.newPage();
const pageErrors = [];
pg.on('pageerror', (e) => pageErrors.push(String(e.message || e)));
await pg.goto('file://' + path.join(ROOT, TARGET), { waitUntil: 'load' });
await pg.waitForFunction(() => window.HP && HP.sim && HP.dfmForecastGate);
await pg.addScriptTag({ content: LIB_SRC });

await pg.evaluate((PERI_WINDOW) => {
  // 診断コピーを作る(**内蔵 JSON は 1 bit も書き換えない**)
  window.__w262build = (id, patch) => {
    const p = HP.allPresets().find((q) => q.id === id);
    const c = JSON.parse(JSON.stringify(p));
    if (patch && patch.integrator) c.integrator = patch.integrator;
    if (patch && patch.physics) Object.assign(c.physics, patch.physics);
    const v = HP.validatePreset(c);
    HP.sim.build(v.preset);
    return { warnings: v.warnings || [], kFrame: HP.sim.params.kFrame, integrator: HP.sim.integrator,
      n: HP.sim.n, scaleExpT: p.scaleExp.T };
  };
  // ビット比較(同じ dt・同じ步数で 2 経路を走らせて状態を突き合わせる)
  window.__w262bits = (id, dt, steps) => {
    const snap = () => { const S = HP.sim; return { x: Array.from(S.x), y: Array.from(S.y),
      vx: Array.from(S.vx), vy: Array.from(S.vy), spin: Array.from(S.spin) }; };
    window.__w262build(id, null);
    for (let k = 0; k < steps; k++) HP.sim.step(dt);
    const a = snap();
    window.__w262build(id, { integrator: 'leapfrog' });
    for (let k = 0; k < steps; k++) HP.sim.step(dt);
    const b = snap();
    let same = true, maxRel = 0;
    for (const k of ['x', 'y', 'vx', 'vy', 'spin']) {
      for (let i = 0; i < a[k].length; i++) {
        if (a[k][i] !== b[k][i]) same = false;
        const sc = Math.max(Math.abs(a[k][i]), 1e-30);
        maxRel = Math.max(maxRel, Math.abs(a[k][i] - b[k][i]) / sc);
      }
    }
    return { steps, dt, bitSame: same, maxRelDiff: maxRel };
  };
  // 走行 1 段(位相制限 1.5π の検出器 1 本 —— w261c と同じ窓・同じ抽出器)
  window.__w262run = (id, patch, dt, maxSteps, budgetMs) => {
    const b = window.__w262build(id, patch);
    const S = HP.sim, ci = 0, oi = 1;
    const det = createPeriastronDetector({ phaseGate: 1.5 * Math.PI });
    const t0 = performance.now();
    let k = 0, stopped = 'window', accepted = 0;
    let inWindow = false, rMin = Infinity, rMax = -Infinity;
    for (; k < maxSteps; k++) {
      S.step(dt);
      const dx = S.x[oi] - S.x[ci], dy = S.y[oi] - S.y[ci];
      const rr = Math.hypot(dx, dy), th = Math.atan2(dy, dx);
      const dvx = S.vx[oi] - S.vx[ci], dvy = S.vy[oi] - S.vy[ci];
      const rd = (rr > 0) ? (dx * dvx + dy * dvy) / rr : 0;
      if (inWindow) { if (rr < rMin) rMin = rr; if (rr > rMax) rMax = rr; }
      const a = det.push(k, rr, rd, th);
      if (a.accepted) { accepted++; inWindow = true; }
      if (accepted >= PERI_WINDOW) { stopped = 'window'; break; }
      if (S.hasNaN()) { stopped = 'nan'; break; }
      if ((k & 65535) === 0 && (performance.now() - t0) > budgetMs) { stopped = 'time-budget'; break; }
    }
    if (k >= maxSteps) stopped = 'max-steps';
    const res = det.result(PERI_WINDOW);
    const n = Math.min(res.nPeri, PERI_WINDOW);
    const full = (res.nPeri >= PERI_WINDOW) && !res.unwrapFailed;
    const peri = res.peri.slice(0, n), ang = res.ang.slice(0, n);
    const perMean = full ? (peri[PERI_WINDOW - 1].k - peri[0].k) * dt / (PERI_WINDOW - 1) : null;
    let slope = null, se = null;
    if (ang.length >= 3) {
      const tim = ang.map((_, i) => peri[i].k * dt);
      const mt = tim.reduce((s, v) => s + v, 0) / tim.length;
      const ma = ang.reduce((s, v) => s + v, 0) / ang.length;
      let sxy = 0, sxx = 0;
      for (let i = 0; i < ang.length; i++) { sxy += (tim[i] - mt) * (ang[i] - ma); sxx += (tim[i] - mt) ** 2; }
      if (sxx > 0) { slope = sxy / sxx;
        se = Math.sqrt(ang.reduce((s, y, i) => s + (y - (ma + slope * (tim[i] - mt))) ** 2, 0)
          / Math.max(1, ang.length - 2) / sxx); }
    }
    return { steps: k, stopped, dt, nan: S.hasNaN(), build: b,
      clamp: (S.clampVN || 0) + (S.clampSN || 0) + (S.clampHN || 0) + (S.clampRN || 0) + (S.clampTN || 0),
      measured: full && res.measured, nPeri: res.nPeri, candidates: res.candidates,
      rejectedCount: res.rejectedCount, unwrapFailed: res.unwrapFailed,
      measurementMethod: res.measurementMethod,
      perMeanSim: perMean, slopeRadPerSimTime: slope, seRadPerSimTime: se,
      rMin: Number.isFinite(rMin) ? rMin : null, rMax: Number.isFinite(rMax) ? rMax : null,
      eProxy: (rMax > 0 && rMax + rMin > 0) ? (rMax - rMin) / (rMax + rMin) : null };
  };
  // RK4 参照器へ渡す初期状態(**エンジンが保持している値そのもの** —— 質量は Float32 のまま)
  window.__w262state = (id, patch) => {
    window.__w262build(id, patch);
    const S = HP.sim, p = S.params;
    return { x: [S.x[0], S.x[1]], y: [S.y[0], S.y[1]], vx: [S.vx[0], S.vx[1]], vy: [S.vy[0], S.vy[1]],
      m: [S.m[0], S.m[1]], R: [S.R[0], S.R[1]], pnOv: [S.pnOv[0], S.pnOv[1]],
      pinned: [S.pinned[0], S.pinned[1]],
      G: p.G, eps: p.softening, cLight: p.cLight, lambdaPN: p.lambdaPN, pnAlpha: p.pnAlpha,
      geoPN: p.geoPN, kFrame: p.kFrame, n: S.n, hasCoreV2: !!S.hasCoreV2 };
  };
}, PERI_WINDOW);

const out = { meta: { wave: '第262便c', target: TARGET, dt0: DT0, periWindow: PERI_WINDOW,
  yearSec: YEAR_SEC, divs: DIVS, phaseGate: PERI_PHASE_GATE_DEFAULT,
  extractor: '位相制限 1.5π(`radial-crossing/orbit-phase-1.5pi-v1` —— 全経路で同一)',
  window: '**最初の 20 近点(19 区間)**。段・積分法・参照器のあいだで窓は同じである。',
  independentContract: '独立推定は **同じ抽出器・別の積分**だけを採る(検証仮説 (6))。'
    + '**別の理論の式を解いた値(標準二体相対 1PN 等)は門(4) に入れない**(対照は別器 exp-w262c-e12ref)。',
  kF1Limitation: '**kFrame=1 の DFM 全経路は常微分方程式ではない** —— E6′/geoPN=2 の引きずりは '
    + 'Δv=k_F·(u_n−u_{n−1}) という**前步の u との差分インパルス**で、dt を掛ける右辺が無い。'
    + 'RK4 の中間段に「前步の u」は定義できないので、**法則を書き換えずにエンジンの外の参照器は作れない**。'
    + 'よって kFrame=1 側の独立推定は **leapfrog-KDK(エンジン内の別積分)だけ**である。',
  touched: '**プリセット JSON は 1 bit も書き換えていない**(診断コピーに patch を当てただけ)。'
    + '`S._core` には 1 命令も足していない。' },
  bitChecks: [], cases: [], forecastGates: [], pageErrors: [] };

// ================================ (1) leapfrog が別積分であることのビット比較
for (const C of CASES) {
  if (ONLY && !ONLY.includes(C.id)) continue;
  const b = await pg.evaluate(({ id, dt, steps }) => window.__w262bits(id, dt, steps),
    { id: C.id, dt: DT0, steps: 600 });
  out.bitChecks.push({ id: C.id, emoji: C.emoji, ...b,
    note: b.bitSame
      ? '**semi と bit 同一** —— この系では leapfrog は別積分になっていない(独立推定に使えない)。'
      : '**semi と bit が違う** —— `S._core(dt,mode)` の KDK フェーズ分割が効いている(別積分である)。' });
  console.error(`  [bit] ${C.emoji} ${C.id}: leapfrog vs semi  bitSame=${b.bitSame}  maxRel=${b.maxRelDiff.toExponential(3)}`);
}

// ================================ (2)(3) 段を走らせる
const YEARCONV = (slope, toSec) => (slope === null ? null : slope * 180 / Math.PI / toSec * YEAR_SEC);
let spentAll = 0;

for (const C of CASES) {
  if (ONLY && !ONLY.includes(C.id)) continue;
  const meta = await pg.evaluate((id) => {
    const p = HP.allPresets().find((q) => q.id === id);
    return { scaleExp: p.scaleExp, integratorDecl: p.integrator || null };
  }, C.id);
  const TOSEC = Math.pow(10, Number(meta.scaleExp.T));
  const obsP = obsPick(C.body, 'orbital_period', { unit: 's' });
  const obsP2 = obsPick(C.body, 'orbital_period', { unit: 's', ddfwhe: true });
  const obsW = obsPick(C.body, 'periastron_advance');
  const obsE = obsPick(C.body, 'eccentricity');

  // 走らせる系列: 台帳(preset のまま)・leapfrog・kFrame=0 診断(kF1 の系だけ)
  const series = [{ tag: 'ledger-semi', patch: null },
    { tag: 'ledger-leapfrog', patch: { integrator: 'leapfrog' } }];
  if (C.kind === 'ledger-kF1') {
    series.push({ tag: 'kF0-semi', patch: { physics: { kFrame: 0 } } });
    series.push({ tag: 'kF0-leapfrog', patch: { integrator: 'leapfrog', physics: { kFrame: 0 } } });
  }
  const runs = {};
  for (const S of series) {
    const stages = [];
    let truncated = null;
    for (const d of DIVS) {
      if (spentAll > BUDGET_TOTAL_S) {
        truncated = { stoppedBefore: 'h/' + d, note: '**予算で止めた**(失敗ではない)。この段は「未走行」と表に書く。' };
        break;
      }
      const dt = DT0 / d;
      const t0 = Date.now();
      const r = await pg.evaluate(({ id, patch, dt, maxSteps, budgetMs }) =>
        window.__w262run(id, patch, dt, maxSteps, budgetMs),
      { id: C.id, patch: S.patch, dt, maxSteps: 8e8, budgetMs: BUDGET_STAGE_S * 1000 });
      const wall = (Date.now() - t0) / 1000;
      spentAll += wall;
      stages.push({ div: d, dt, wallSec: +wall.toFixed(2), steps: r.steps, stopped: r.stopped,
        nan: r.nan, clamp: r.clamp, measured: r.measured, nPeri: r.nPeri,
        candidates: r.candidates, rejectedCount: r.rejectedCount, unwrapFailed: r.unwrapFailed,
        perMeanSec: (r.perMeanSim !== null) ? r.perMeanSim * TOSEC : null,
        degPerYear: YEARCONV(r.slopeRadPerSimTime, TOSEC),
        seDegPerYear: YEARCONV(r.seRadPerSimTime, TOSEC),
        eProxy: r.eProxy, build: r.build });
      console.error(`  ${C.emoji} ${C.id} [${S.tag}] h/${d}  步 ${r.steps}  ${wall.toFixed(1)} s`
        + `  P=${r.perMeanSim === null ? '—' : (r.perMeanSim * TOSEC).toFixed(6)} s`
        + `  ω̇=${r.slopeRadPerSimTime === null ? '—' : YEARCONV(r.slopeRadPerSimTime, TOSEC).toFixed(5)} °/yr`
        + `  e=${r.eProxy === null ? '—' : r.eProxy.toFixed(7)}  (${r.stopped})`);
    }
    const P = stages.map((z) => z.perMeanSec);
    const W = stages.map((z) => z.degPerYear);
    const E = stages.map((z) => z.eProxy);
    runs[S.tag] = { stages, truncated,
      richardson: { P: shiftedRichardson(P), degPerYear: shiftedRichardson(W), e: shiftedRichardson(E) } };
  }

  // ---- RK4 参照器(kFrame=0 の系列にだけ当てる。kF1 には当てられない —— meta.kF1Limitation)
  const refs = {};
  for (const [tag, patch] of [['ledger-semi', null], ['kF0-semi', { physics: { kFrame: 0 } }]]) {
    if (!runs[tag]) continue;
    const st = await pg.evaluate(({ id, patch }) => window.__w262state(id, patch), { id: C.id, patch });
    if (st.kFrame !== 0) { refs[tag] = { applicable: false, reason: 'kFrame=' + st.kFrame,
      note: out.meta.kF1Limitation }; continue; }
    const sy = { G: st.G, eps: st.eps, m: st.m, invC2: st.lambdaPN / (st.cLight * st.cLight),
      cA: 1 + 2 * st.pnAlpha, cB: st.pnAlpha - 0.5, pnSource: st.pnOv };
    const z0 = [st.x[0], st.y[0], st.x[1], st.y[1], st.vx[0], st.vy[0], st.vx[1], st.vy[1]];
    // RK4 は**自分の刻みで収束させる**(エンジンの段とは別の刻み列 —— 独立であることの要)
    const rkStages = [];
    const P0 = (obsP ? obsP.value : 8834) / TOSEC;
    for (const nPerOrbit of [400, 800, 1600, 3200]) {
      const dt = P0 / nPerOrbit;
      const r = runReference({ force: forceDfmE12kF0, sy, z0, dt, window: PERI_WINDOW,
        detFactory: () => createPeriastronDetector({ phaseGate: 1.5 * Math.PI }),
        maxSteps: 6e7, budgetMs: 180000 });
      rkStages.push({ nPerOrbit, dt, steps: r.steps, stopped: r.stopped, measured: r.measured,
        perMeanSec: (r.perMeanSim !== null) ? r.perMeanSim * TOSEC : null,
        degPerYear: YEARCONV(r.slopeRadPerSimTime, TOSEC), wallSec: +r.wallSec.toFixed(2) });
      console.error(`  ${C.emoji} [rk4:${tag}] n/orbit ${nPerOrbit}  步 ${r.steps}`
        + `  P=${r.perMeanSim === null ? '—' : (r.perMeanSim * TOSEC).toFixed(9)} s`
        + `  ω̇=${r.slopeRadPerSimTime === null ? '—' : YEARCONV(r.slopeRadPerSimTime, TOSEC).toFixed(9)}`);
    }
    const vs = rkStages.map((z) => z.perMeanSec);
    const last2 = (vs.length >= 2) ? Math.abs(vs[vs.length - 1] - vs[vs.length - 2]) : null;
    refs[tag] = { applicable: true, method: 'rk4-reference',
      law: 'エンジンの kFrame=0・geoPN=2 経路と同じ式(E4 ソフトニング重力 + E12 測地線 1PN + 対反作用)',
      stages: rkStages, value: vs.length ? vs[vs.length - 1] : null,
      selfSpread: last2, degPerYear: rkStages.length ? rkStages[rkStages.length - 1].degPerYear : null,
      note: '**エンジンの外**の Float64・古典 RK4。刻みはエンジンの段と別列(P_obs/400…/3200)で、'
        + '**同じ抽出器**(位相制限 1.5π)を通している。' };
  }

  out.cases.push({ id: C.id, emoji: C.emoji, kind: C.kind, body: C.body, toSec: TOSEC,
    obs: { period: obsP, periodV2: obsP2, omegaDot: obsW, ecc: obsE },
    runs, references: refs });
  // 途中経過を毎系ごとに書き出す(バックグラウンド走行の進捗はこのファイルで見る)
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
}

// ================================ (4) 門 5 つの再判定
for (const c of out.cases) {
  const obs = c.obs.period;
  if (!obs) continue;
  const entries = [];
  // 台帳の系列(独立推定 = leapfrog-KDK)
  if (c.runs['ledger-semi'] && c.runs['ledger-leapfrog']) {
    entries.push({ tag: 'ledger', stages: c.runs['ledger-semi'].stages,
      indep: { value: c.runs['ledger-leapfrog'].richardson.P.yInf, method: 'leapfrog-KDK' } });
  }
  // kF0 診断系列(独立推定 = RK4 参照器 / leapfrog-KDK の 2 法)
  if (c.runs['kF0-semi']) {
    entries.push({ tag: 'kF0-rk4', stages: c.runs['kF0-semi'].stages,
      indep: { value: (c.references['kF0-semi'] || {}).value, method: 'rk4-reference' } });
    if (c.runs['kF0-leapfrog']) entries.push({ tag: 'kF0-leapfrog', stages: c.runs['kF0-semi'].stages,
      indep: { value: c.runs['kF0-leapfrog'].richardson.P.yInf, method: 'leapfrog-KDK' } });
  }
  // 📻 は台帳そのものが kFrame=0 —— RK4 を台帳系列の独立推定に使える唯一の系
  if (c.kind === 'observation-kF0' && c.references['ledger-semi'] && c.references['ledger-semi'].applicable) {
    entries.push({ tag: 'ledger-rk4', stages: c.runs['ledger-semi'].stages,
      indep: { value: c.references['ledger-semi'].value, method: 'rk4-reference' } });
  }
  for (const E of entries) {
    // 🩺 は観測版 v2 が正本(第262便c の署名便)。他系は v1 の行しかない
    const O = (c.obs.periodV2 && c.obs.periodV2.sigma) ? c.obs.periodV2 : obs;
    const s = {
      fixed: { quantity: '近点間 P', observationVersion: O.source.slice(0, 70), unit: 's',
        timeSystem: (O === c.obs.periodV2) ? 'TDB/DE440' : '宣言なし(版 v1)',
        window: '最初の 20 近点(19 区間)', extractor: 'radial-crossing/orbit-phase-1.5pi-v1',
        f: '宣言値(段ごとに再 fit しない)', refitPerStage: false },
      stages: E.stages.map((z) => ({ h: z.dt, y: z.perMeanSec })),
      excluded: { duplicateEvents: 0, nan: E.stages.filter((z) => z.nan).length,
        incomplete: E.stages.filter((z) => z.stopped !== 'window').length,
        unwrapFailed: E.stages.filter((z) => z.unwrapFailed).length, roundingFloor: 0 },
      yObs: O.value, sigma: O.sigma, systematic: 0,
      independent: Number.isFinite(E.indep.value) ? { value: E.indep.value, method: E.indep.method } : null,
    };
    const g = await pg.evaluate((z) => HP.dfmForecastGate(z), s);
    out.forecastGates.push({ id: c.id, emoji: c.emoji, seriesTag: E.tag,
      observationVersion: s.fixed.observationVersion, independent: s.independent,
      ok: g.ok, verdict: g.verdict, failed: g.failed, p: g.p, pShifts: g.pShifts,
      yInf: g.yInf, uInf: g.uInf, residual: g.residual, distanceSigma: g.distanceSigma,
      uParts: g.gates.g5.uParts, gates: g.gates });
    console.error(`  [門] ${c.emoji} ${c.id} <${E.tag}>: ok=${g.ok} 落ちた門 ${g.failed.join(',') || '—'}`
      + ` / p ${g.p === null ? '—' : g.p.toFixed(4)} / 距離 ${g.distanceSigma === null ? '—' : g.distanceSigma.toExponential(3)}σ`);
  }
}

out.pageErrors = pageErrors;
out.meta.spentSec = +spentAll.toFixed(1);
await browser.close();
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.error('[w262c-indep] wrote ' + OUT + '  (' + spentAll.toFixed(1) + ' s)');
