// 第262便a(第54報 W1)「geoPN=3(トイの測地線モード)の診断コピーで **D₀ × η × lawVersion** を掃く」。
//
// ■ この器が答える 2 つ
//   (1) **D₀=0 の離脱**(統括が設定した検証仮説): 二体・D₀=0 では、自己を除いた正規化平均の
//       フレーム速度が**相手の速度そのもの**(u_A=v_B・χ=1 厳密)になり、その時間微分も
//       **相手の重力加速度そのもの**(∂ₜu_A=g_B)になる。トイは重力に ∂ₜū を足すので
//         a_A = g_A + g_B、a_B = g_B + g_A  →  **r̈ = a_B − a_A = 0(厳密)**
//       遠点発(ṙ₀=0)なら r(t)² = r₀² + |v_rel|²t² で、r=4r₀ は **t = √15 r₀/|v_rel|**。
//       これを h/h2/h4/h8 で実測し、解析値と比べる。**質量に依らない**(f=0.95/1.05 の対照)。
//   (2) **釣り合い点はあるか**: D₀ ∈ {0, 3.2e−7, 6e−4, 6e−3, 6e−2, 0.6} × η(toyGain) ∈ {0.25,0.5,1}
//       × lawVersion ∈ {scalar, local} を 1 段(既定 dt・観測周期 8 回分の診断時間)で走り、
//       **離脱 / 落下・接触 / 束縛(近点 ≥6)/ 未完** に分類する。束縛のものは近点間 P・e・ω̇ を出し、
//       **P_obs をまたぐ隣り合う D₀ があれば**その間を 5 点で刻み、交差点があれば 4 段(h〜h/8)を回す。
//
// ■ 言わないこと(先に書く)
//   **これは較正則ではない。** geoPN=3 のトイの慣性則は較正候補ではない(Negative Claim 27)。
//   交差が出ても採らない。**「空間メッシュなら f≈1 で成立した」とは書かない。**
//   **χ=1 は共回転の証拠ではない**: 自己を除外した一点の並進平均には、二体配置から共回転の
//   空間勾配を復元する処理が無い(D₀=0 で単一源なら u は位置に依らず一定で ∇u=0 である)。
//
// ■ 触らないもの
//   `beta/index.html` は**読むだけ**。本体 📻 と ⚡ の JSON を 1 bit も書き換えない。
//   `S._core` には 1 命令も足していない。
//
// 実行: node tests/exp-w262a-geotoy.mjs [--part escape,sweep,refine] [--budget-total 5400]
// 出力: tests/out/geotoy-w262a.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + path.join(ROOT, TARGET);
const OUT = path.join(ROOT, 'tests', 'out', 'geotoy-w262a.json');
const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(k); return (i >= 0 && argv[i + 1]) ? argv[i + 1] : d; };
const PARTS = arg('--part', 'escape,sweep,refine').split(',');
const BUDGET_TOTAL_S = Number(arg('--budget-total', 5400));
const DT0 = 0.016;
const PERI_WINDOW = 20;
const PERI_MIN_BOUND = 6;       // 「束縛」と呼ぶための最小の近点数(指示)
const ORBITS_DIAG = 8;          // 診断時間 = 観測周期 8 回分
const ESC_FACTOR = 4;           // 離脱の定義 r > 4 r₀
const FALL_FRACTION = 0.01;     // 落下・接触の定義 r < 0.01 r₀
const YEAR_SEC = 31557600;
const D0_LIST = [0, 3.2e-7, 6e-4, 6e-3, 6e-2, 0.6];
// **延長**(指示の 6 点の外側): D₀ を上げるほど χ→0 でトイが消える。**極限そのもの**(下の `toyOff`
// = geoPN=0 の Newton)が観測周期の**下**にいるので、**交差はこの延長の側にある** —— どこで交差し、
// そのとき χ がいくつかを数で出すために足した。**交差の位置より、交差点の χ のほうが読みどころである。**
const D0_TAIL = [6, 60, 600, 6000];
const ETA_LIST = [0.25, 0.5, 1];
const LAW_LIST = ['scalar', 'local'];

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
const OBS = loadObs();
const pick = (q) => OBS.find((r) => r.body === 'PSR J0737-3039 B' && r.quantity === q) || null;
const obsP = pick('orbital_period'), obsE = pick('eccentricity'), obsW = pick('periastron_advance');

const LIB_PREC = fs.readFileSync(path.join(ROOT, 'tests', 'lib-precision-diagnostics.mjs'), 'utf8')
  .replace(/^export /gm, '');
const LIB_DIAG = fs.readFileSync(path.join(ROOT, 'tests', 'lib-w262a-psrdiag.mjs'), 'utf8')
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
await pg.goto(INDEX, { waitUntil: 'load' });
await pg.waitForFunction(() => window.HP && HP.sim);
await pg.addScriptTag({ content: LIB_PREC });
await pg.addScriptTag({ content: LIB_DIAG });
const libOk = await pg.evaluate(() => typeof createPeriastronDetector === 'function'
  && typeof psrGeoToyCopy === 'function');
if (!libOk) { console.error('[w262a] lib がページへ入っていない'); await browser.close(); process.exit(2); }

await pg.evaluate(({ PERI_WINDOW, ESC_FACTOR, FALL_FRACTION }) => {
  window.__w262aToy = (o) => {
    const src = HP.allPresets().find((q) => q.id === 'psrDoubleAB');
    let pd = psrMassScaled(src, (o.f === undefined) ? 1 : o.f,
      { kFrame: 0, keepCore: false, id: 'w262aToy' });
    if (o.geoPN !== 0) pd = psrGeoToyCopy(pd, { lawVersion: o.law, toyGain: o.eta, D0: o.D0, id: 'w262aToy' });
    else { pd.physics.geoPN = 0; if (o.D0 !== undefined) { pd.physics.D0 = o.D0; delete pd.physics.D0pull; } }
    if (o.framePrecision) pd.physics.framePrecision = o.framePrecision;
    const v = HP.validatePreset(pd);
    if (!v.ok) return { ok: false, errors: v.errors };
    const S = HP.sim; S.build(v.preset);
    const ci = 0, oi = 1;
    const rel = () => {
      const dx = S.x[oi] - S.x[ci], dy = S.y[oi] - S.y[ci];
      const dvx = S.vx[oi] - S.vx[ci], dvy = S.vy[oi] - S.vy[ci];
      const rr = Math.hypot(dx, dy);
      return { rr, th: Math.atan2(dy, dx), rd: (rr > 0) ? (dx * dvx + dy * dvy) / rr : 0,
        vrel: Math.hypot(dvx, dvy) };
    };
    const s0 = rel();
    const r00 = s0.rr, vRel0 = s0.vrel;
    const det = createPeriastronDetector({ phaseGate: 1.5 * Math.PI });
    const t0 = performance.now();
    let k = 0, stopped = 'time', nPeri = 0, inWin = false;
    let rMin = Infinity, rMax = -Infinity, rMinAll = r00, rMaxAll = r00;
    let escSim = null, prevR = r00, contact = false;
    const maxSteps = o.maxSteps;
    for (; k < maxSteps; k++) {
      S.step(o.dt);
      const st = rel();
      const rr = st.rr;
      if (rr < rMinAll) rMinAll = rr;
      if (rr > rMaxAll) rMaxAll = rr;
      if (inWin) { if (rr < rMin) rMin = rr; if (rr > rMax) rMax = rr; }
      const a = det.push(k, rr, st.rd, st.th);
      if (a.accepted) { nPeri++; inWin = true; }
      if (escSim === null && rr > ESC_FACTOR * r00) {
        // **線形内挿**で交差時刻を取る(步の粒度で丸めない)
        const fr = (ESC_FACTOR * r00 - prevR) / (rr - prevR);
        escSim = (k + fr) * o.dt;
        if (o.stopOnEscape) { stopped = 'escape'; prevR = rr; break; }
      }
      if (rr < FALL_FRACTION * r00) { contact = true; stopped = 'fall'; break; }
      if (S.hasNaN()) { stopped = 'nan'; break; }
      if (nPeri >= PERI_WINDOW) { stopped = 'window'; break; }
      if ((k & 65535) === 0 && (performance.now() - t0) > o.budgetMs) { stopped = 'time-budget'; break; }
      prevR = rr;
    }
    const res = det.result(PERI_WINDOW);
    const peri = res.peri, ang = res.ang;
    let slopeT = null, seT = null;
    if (ang.length >= 3) {
      const m = ang.length;
      const xs = ang.map((_, i) => peri[i].k * o.dt);
      const mx = xs.reduce((p2, q2) => p2 + q2, 0) / m, my = ang.reduce((p2, q2) => p2 + q2, 0) / m;
      let sxy = 0, sxx = 0;
      for (let i = 0; i < m; i++) { sxy += (xs[i] - mx) * (ang[i] - my); sxx += (xs[i] - mx) * (xs[i] - mx); }
      if (sxx > 0) {
        slopeT = sxy / sxx;
        seT = (m > 2) ? Math.sqrt(ang.reduce((s, y, i) => s + (y - (my + slopeT * (xs[i] - mx))) ** 2, 0) / (m - 2) / sxx) : null;
      }
    }
    const nUse = Math.min(res.nPeri, PERI_WINDOW);
    return { ok: true, steps: k, stopped, nan: S.hasNaN(), contact,
      nPeri: res.nPeri, candidates: res.candidates, rejected: res.rejectedCount,
      unwrapFailed: res.unwrapFailed,
      geoToyStop: S.geoToyStop, geoToyChi: S.geoToyChi, geoToyN: S.geoToyN,
      hasGeoToy: S.hasGeoToy, geoPNHeld: S.params.geoPN,
      clamp: (S.clampVN || 0) + (S.clampSN || 0) + (S.clampHN || 0) + (S.clampRN || 0) + (S.clampTN || 0),
      r0: r00, vRel0, escapeSim: escSim,
      rMin: Number.isFinite(rMin) ? rMin : null, rMax: Number.isFinite(rMax) ? rMax : null,
      rMinAll, rMaxAll,
      eProxy: (rMax > 0 && rMax + rMin > 0) ? (rMax - rMin) / (rMax + rMin) : null,
      perMeanSim: (nUse >= 2 && !res.unwrapFailed)
        ? (peri[nUse - 1].k - peri[0].k) * o.dt / (nUse - 1) : null,
      perFullWindow: (res.nPeri >= PERI_WINDOW),
      slopeRadPerSimTime: slopeT, seRadPerSimTime: seT,
      state: [S.x[0], S.y[0], S.vx[0], S.vy[0], S.x[1], S.y[1], S.vx[1], S.vy[1]],
      warn: (v.warnings || []).length };
  };
}, { PERI_WINDOW, ESC_FACTOR, FALL_FRACTION });

const toSec = await pg.evaluate(() => Math.pow(10,
  Number(HP.allPresets().find((q) => q.id === 'psrDoubleAB').scaleExp.T)));
const P_OBS_SEC = obsP.value, P_OBS_SIM = P_OBS_SEC / toSec;

const out = { meta: { wave: '第262便a', target: TARGET, dt0: DT0, periWindow: PERI_WINDOW,
  periMinBound: PERI_MIN_BOUND, orbitsDiag: ORBITS_DIAG, escapeFactor: ESC_FACTOR,
  fallFraction: FALL_FRACTION, yearSec: YEAR_SEC, d0List: D0_LIST, d0Tail: D0_TAIL,
  etaList: ETA_LIST, lawList: LAW_LIST,
  analytic: 'D₀=0 の二体では u_A=v_B(χ=1 厳密)・∂ₜu_A=g_B なので a_A=g_A+g_B・a_B=g_B+g_A → '
    + '**r̈=0(厳密)**。遠点発なら r(t)²=r₀²+|v_rel|²t² で r=4r₀ は t=√15 r₀/|v_rel|。',
  claim: '**較正則ではない。** geoPN=3 のトイの慣性則は較正候補ではない(Negative Claim 27)。'
    + '交差が出ても採らない。**χ=1 は共回転の証拠ではない**(∇u=0 である)。',
  touched: '**本体 📻 と ⚡ の JSON は 1 bit も書き換えていない**。`S._core` には 1 命令も足していない。' },
  obs: { period: obsP, ecc: obsE, omegaDot: obsW }, escape: [], sweep: [], refine: [], stages: [],
  pageErrors: [] };

let spent = 0;
const run = async (o) => {
  const t0 = Date.now();
  const r = await pg.evaluate((z) => window.__w262aToy(z), o);
  const wall = (Date.now() - t0) / 1000;
  spent += wall;
  r.wallSec = +wall.toFixed(2);
  r.opts = o;
  r.periodSec = (r.perMeanSim !== null && r.perMeanSim !== undefined) ? r.perMeanSim * toSec : null;
  r.escapeSec = (r.escapeSim !== null && r.escapeSim !== undefined) ? r.escapeSim * toSec : null;
  r.degPerYear = (r.slopeRadPerSimTime !== null && r.slopeRadPerSimTime !== undefined)
    ? r.slopeRadPerSimTime * 180 / Math.PI / toSec * YEAR_SEC : null;
  r.klass = classify(r);
  return r;
};
const classify = (r) => {
  if (!r.ok) return { kind: 'invalid', label: '検証エラー' };
  if (r.nan) return { kind: 'nan', label: '発散(NaN)' };
  if (r.rMaxAll >= ESC_FACTOR * r.r0) return { kind: 'escape', label: '離脱' };
  if (r.contact || r.rMinAll <= FALL_FRACTION * r.r0) return { kind: 'fall', label: '落下・接触' };
  if (r.nPeri >= PERI_MIN_BOUND) return { kind: 'bound', label: '束縛' };
  return { kind: 'incomplete', label: '未完(近点 ' + r.nPeri + ' 個)' };
};

// ---------- (1) D₀=0 の離脱 ----------
if (PARTS.includes('escape')) {
  const analytic = await pg.evaluate(() => {
    const src = HP.allPresets().find((q) => q.id === 'psrDoubleAB');
    const b = src.bodies;
    const r0 = Math.hypot(b[1].x - b[0].x, b[1].y - b[0].y);
    const vr = Math.hypot(b[1].vx - b[0].vx, b[1].vy - b[0].vy);
    return { r0, vRel: vr, tEsc: straightLineEscapeTime(r0, vr, 4) };
  });
  out.escapeAnalytic = { ...analytic, tEscSec: analytic.tEsc * toSec };
  const cases = [];
  for (const div of [1, 2, 4, 8]) cases.push({ tag: 'local D₀=0 η=1 f=1', law: 'local', eta: 1, D0: 0, f: 1, div });
  cases.push({ tag: 'scalar D₀=0 η=1 f=1', law: 'scalar', eta: 1, D0: 0, f: 1, div: 1 });
  cases.push({ tag: 'local D₀=0 η=1 f=0.95', law: 'local', eta: 1, D0: 0, f: 0.95, div: 1 });
  cases.push({ tag: 'local D₀=0 η=1 f=1.05', law: 'local', eta: 1, D0: 0, f: 1.05, div: 1 });
  cases.push({ tag: 'local D₀=3.2e−7 η=1 f=1', law: 'local', eta: 1, D0: 3.2e-7, f: 1, div: 1 });
  cases.push({ tag: 'local D₀=0 η=0 f=1(除去だけ)', law: 'local', eta: 0, D0: 0, f: 1, div: 1, noEscape: true });
  cases.push({ tag: '対照 geoPN=0(Newton・D₀=0)', geoPN: 0, D0: 0, f: 1, div: 1, noEscape: true });
  for (const c of cases) {
    const dt = DT0 / c.div;
    const r = await run({ law: c.law, eta: c.eta, D0: c.D0, f: c.f, dt,
      geoPN: (c.geoPN === 0) ? 0 : 3,
      maxSteps: c.noEscape ? 600 : Math.ceil(ORBITS_DIAG * P_OBS_SIM / dt),
      budgetMs: 240000, stopOnEscape: !c.noEscape });
    r.tag = c.tag; r.div = c.div;
    r.escapeRatio = (r.escapeSim !== null && analytic.tEsc) ? r.escapeSim / analytic.tEsc : null;
    out.escape.push(r);
    console.error(`  離脱 ${c.tag} dt/${c.div}: t_esc=${r.escapeSec === null ? '—' : r.escapeSec.toFixed(3)} s`
      + ` (解析 ${out.escapeAnalytic.tEscSec.toFixed(3)} s・比 ${r.escapeRatio === null ? '—' : r.escapeRatio.toFixed(9)})`
      + `  ${r.klass.label}  χ=${r.geoToyChi === null || r.geoToyChi === undefined ? '—' : r.geoToyChi}`
      + `  stop=${r.geoToyStop}`);
  }
  // η=0 と Newton が状態で厳密一致するか(600 步)
  const a = out.escape.find((z) => z.tag.startsWith('local D₀=0 η=0'));
  const b = out.escape.find((z) => z.tag.startsWith('対照 geoPN=0'));
  if (a && b) {
    out.etaZeroVsNewton = { same: a.state.every((z, i) => Object.is(z, b.state[i])),
      a: a.state, b: b.state };
    console.error('  η=0(トイ)と geoPN=0(Newton)が 600 步で状態ビット同一: ' + out.etaZeroVsNewton.same);
  }
}

// ---------- (2) 掃引 ----------
const sweepKey = (law, eta, D0) => law + '|' + eta + '|' + D0;
if (PARTS.includes('sweep')) {
  const dt = DT0;
  const maxSteps = Math.ceil(ORBITS_DIAG * P_OBS_SIM / dt);
  // **トイを切った極限**(geoPN=0・f=1・kFrame=0)。掃引の D₀→∞(χ→0)はここへ寄る。
  const off = await run({ geoPN: 0, f: 1, dt, maxSteps, budgetMs: 240000, stopOnEscape: true });
  out.toyOff = off;
  console.error(`  対照 トイ off(geoPN=0・f=1・kF0): ${off.klass.label}  近点 ${off.nPeri}`
    + `  P=${off.periodSec === null ? '—' : off.periodSec.toFixed(6)} s`
    + `  Δ=${off.periodSec === null ? '—' : (off.periodSec - P_OBS_SEC).toExponential(4)} s`
    + `  e=${off.eProxy === null ? '—' : off.eProxy.toFixed(7)}  ω̇=${off.degPerYear === null ? '—' : off.degPerYear.toFixed(4)}`);
  for (const law of LAW_LIST) for (const eta of ETA_LIST) for (const D0 of D0_LIST.concat(D0_TAIL)) {
    if (spent > BUDGET_TOTAL_S) {
      out.sweep.push({ law, eta, D0, truncated: true, note: '**予算で止めた**(未走行)' });
      continue;
    }
    const r = await run({ law, eta, D0, f: 1, dt, geoPN: 3, maxSteps, budgetMs: 240000, stopOnEscape: true });
    r.key = sweepKey(law, eta, D0);
    out.sweep.push(r);
    console.error(`  掃引 ${law} η=${eta} D₀=${D0}: ${r.klass.label}`
      + `  近点 ${r.nPeri}  P=${r.periodSec === null ? '—' : r.periodSec.toFixed(3)} s`
      + `  e=${r.eProxy === null ? '—' : r.eProxy.toFixed(6)}`
      + `  ω̇=${r.degPerYear === null ? '—' : r.degPerYear.toFixed(3)}  χ=${r.geoToyChi}`
      + `  (${r.wallSec}s ${r.stopped})`);
  }
}

// ---------- (3) 交差の細刻み(あれば)----------
if (PARTS.includes('refine')) {
  const crossings = [];
  for (const law of LAW_LIST) for (const eta of ETA_LIST) {
    const row = D0_LIST.concat(D0_TAIL).map((D0) => out.sweep.find((z) => z.key === sweepKey(law, eta, D0)))
      .filter((z) => z && z.klass && z.klass.kind === 'bound' && z.periodSec !== null);
    for (let i = 0; i + 1 < row.length; i++) {
      const g0 = row[i].periodSec - P_OBS_SEC, g1 = row[i + 1].periodSec - P_OBS_SEC;
      if (g0 === 0 || g1 === 0 || (g0 > 0) !== (g1 > 0)) {
        crossings.push({ law, eta, lo: row[i].opts.D0, hi: row[i + 1].opts.D0,
          pLo: row[i].periodSec, pHi: row[i + 1].periodSec });
      }
    }
  }
  out.crossings = crossings;
  console.error('  交差(隣り合う D₀ で P が P_obs をまたぐ組): ' + crossings.length + ' 件');
  const dt = DT0;
  const maxSteps = Math.ceil(ORBITS_DIAG * P_OBS_SIM / dt);
  for (const c of crossings) {
    if (spent > BUDGET_TOTAL_S) break;
    const pts = [];
    for (let i = 1; i <= 5; i++) {
      const t = i / 6;
      const D0 = (c.lo > 0) ? Math.exp(Math.log(c.lo) + t * (Math.log(c.hi) - Math.log(c.lo)))
        : c.lo + t * (c.hi - c.lo);
      const r = await run({ law: c.law, eta: c.eta, D0, f: 1, dt, geoPN: 3, maxSteps,
        budgetMs: 240000, stopOnEscape: true });
      pts.push(r);
      console.error(`  細刻み ${c.law} η=${c.eta} D₀=${D0.toExponential(4)}: ${r.klass.label}`
        + `  P=${r.periodSec === null ? '—' : r.periodSec.toFixed(3)} s`
        + `  Δ=${r.periodSec === null ? '—' : (r.periodSec - P_OBS_SEC).toExponential(3)} s`
        + `  χ=${r.geoToyChi === null || r.geoToyChi === undefined ? '—' : r.geoToyChi.toExponential(3)}`);
    }
    out.refine.push({ ...c, points: pts.map((z) => ({ D0: z.opts.D0, periodSec: z.periodSec,
      deltaPSec: (z.periodSec === null) ? null : z.periodSec - P_OBS_SEC,
      chi: z.geoToyChi, eProxy: z.eProxy, degPerYear: z.degPerYear, klass: z.klass, nPeri: z.nPeri })) });
    // 最も近い点で 4 段(h〜h/8)
    const best = pts.filter((z) => z.periodSec !== null)
      .sort((z, w) => Math.abs(z.periodSec - P_OBS_SEC) - Math.abs(w.periodSec - P_OBS_SEC))[0];
    if (best && spent < BUDGET_TOTAL_S) {
      const stages = [];
      for (const div of [1, 2, 4, 8]) {
        if (spent > BUDGET_TOTAL_S) { stages.push({ div, truncated: true, note: '**予算で止めた**(未走行)' }); continue; }
        const d2 = DT0 / div;
        const r = await run({ law: c.law, eta: c.eta, D0: best.opts.D0, f: 1, dt: d2, geoPN: 3,
          maxSteps: Math.ceil(ORBITS_DIAG * P_OBS_SIM / d2) * 4, budgetMs: 600000, stopOnEscape: true });
        stages.push({ div, dt: d2, periodSec: r.periodSec, eProxy: r.eProxy,
          degPerYear: r.degPerYear, nPeri: r.nPeri, klass: r.klass, wallSec: r.wallSec });
        console.error(`  段 ${c.law} η=${c.eta} D₀=${best.opts.D0.toExponential(4)} dt/${div}: `
          + `P=${r.periodSec === null ? '—' : r.periodSec.toFixed(6)} s  ω̇=${r.degPerYear === null ? '—' : r.degPerYear.toFixed(4)}`);
      }
      out.stages.push({ law: c.law, eta: c.eta, D0: best.opts.D0, stages });
    }
  }
}

out.meta.spentSec = +spent.toFixed(1);
out.pageErrors = pageErrors;
await browser.close();
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.error('[w262a] wrote ' + OUT + '  (' + spent.toFixed(1) + ' s)');
