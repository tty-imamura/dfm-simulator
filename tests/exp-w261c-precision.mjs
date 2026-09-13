// 第261便c(第53報 W3)「近点抽出器の位相制限 + NS 4 系の段」。
//
// ■ この器が答える 3 つ
//   (1) **旧法(無条件採用)と位相制限(1.5π)で何が変わるか** —— 同じ 1 回の走行の中で
//       4 つの検出器(旧法 / 1.25π / 1.5π / 1.75π)に**同じ標本列**を流し、採用数・棄却数・
//       周期・離心率 proxy・近点移動を並べる。**走行は 1 回**なので、差は抽出器の差だけである。
//   (2) **🩺 psrJ1946DFM の段**(h…h/16)—— 〔第258便d〕が「未走行」と書いた最後の 1 系。
//   (3) **⚡🧮🧶 を同じ抽出器で測り直す** —— 段ずらし Richardson を 4 系そろえるため
//       (Richardson の集計は `tests/exp-w261c-richardson.mjs` が別に行う)。
//
// ■ 触らないもの
//   `beta/index.html` は**読むだけ**。プリセット JSON を 1 bit も書き換えない(変えるのは dt だけ)。
//   `S._core` には 1 命令も足していない(この器はブラウザの外から `S.step` を呼ぶだけである)。
//
// ■ 窓(段をまたいで同じであることが収束次数を読む前提)
//   **位相制限の検出器が採った最初の 20 近点(19 区間)**。旧法は同じ標本列から**自分の**
//   最初の 20 候補で同じ量を作る(旧法の窓は物理的に 20 公転ではない —— それが (1) の要点である)。
//
// 実行: node tests/exp-w261c-precision.mjs [--only psrJ1946DFM] [--divs 1,2,4,8,16] [--budget-total 7200]
// 出力: tests/out/precision-w261c.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { refinedNumBound } from './lib-w258d-evidence.mjs';
import { massRoundingEstimate, float32Ulp, PERI_PHASE_GATE_DEFAULT } from './lib-precision-diagnostics.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + path.join(ROOT, TARGET);
const OUT = path.join(ROOT, 'tests', 'out', 'precision-w261c.json');
const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(k); return (i >= 0 && argv[i + 1]) ? argv[i + 1] : d; };
const ONLY = arg('--only', null) ? arg('--only', '').split(',') : null;
const DIVS_OVERRIDE = arg('--divs', null) ? arg('--divs', '').split(',').map(Number).filter((z) => z > 0) : null;
const BUDGET_STAGE_S = Number(arg('--budget', 3600));
const BUDGET_TOTAL_S = Number(arg('--budget-total', 12000));
const DT0 = 0.016;
const PERI_WINDOW = 20;
const YEAR_SEC = 31557600;   // ユリウス年(**単位の約束**であって観測ではない)
const GATES = [1.25, 1.5, 1.75];   // ×π

const CASES = [
  { id: 'psrJ1946DFM', emoji: '🩺', c: 0, o: 1, body: 'PSR J1946+2052',
    divs: [1, 2, 4, 8, 16],
    note: '〔第258便d〕⑥ が「未走行」と書いた最後の 1 系。**抽出器の欠陥が最初に見つかった系**でもある' },
  { id: 'psrDoubleABDFM', emoji: '⚡', c: 0, o: 1, body: 'PSR J0737-3039 B',
    divs: [1, 2, 4, 8, 16], note: '近点移動が h/16 でも漸近域外である系(〔第259便d〕)。イベント列を監査する' },
  { id: 'psrJ1757DFM', emoji: '🧮', c: 0, o: 1, body: 'PSR J1757-1854',
    divs: [1, 2, 4, 8], note: '〔第260便d〕の h8 を新しい抽出器で測り直す' },
  { id: 'psrB1534DFM', emoji: '🧶', c: 0, o: 1, body: 'PSR B1534+12',
    divs: [1, 2, 4, 8], note: '〔第259便d〕の h8 を新しい抽出器で測り直す' },
];

// ---- 観測レコード(CSV が正本。この器に観測数値は 1 つも書かない)----
// 同じ (body|quantity) が複数行あるときは **最初の行 = 版 v1**、**source に DDFWHE を含む行 = 版 v2**。
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
      source: String(cols[4]), sigma: (Number.isFinite(sg) && sg > 0) ? sg : null,
      primaryVerified: /sigma_primary=verified/.test(cols[7] || '') });
  }
  return rows;
}
const OBS_ROWS = loadObs();
const obsPick = (body, quantity, opt) => {
  const all = OBS_ROWS.filter((r) => r.body === body && r.quantity === quantity);
  if (!all.length) return null;
  if (opt && opt.ddfwhe) {
    // 版 v2 = source に DDFWHE を含む行。同じ量に複数あるときは **σ 列が埋まっている行**を採る
    // (第261便c の台帳行)。**単位の換算はしない** —— 求めた単位の行が無ければ null である。
    const v2 = all.filter((r) => /DDFWHE/.test(r.source) && (!opt.unit || r.unit === opt.unit));
    return v2.find((r) => r.sigma !== null) || v2[0] || null;
  }
  return all[0];
};

// ---- lib の純関数をページへ入れる(**実装は 1 つ** —— コピーを持たない)----
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
await pg.goto(INDEX, { waitUntil: 'load' });
await pg.waitForFunction(() => window.HP && HP.sim);
await pg.addScriptTag({ content: LIB_SRC });
const libOk = await pg.evaluate(() => typeof createPeriastronDetector === 'function');
if (!libOk) { console.error('[w261c] lib がページへ入っていない'); await browser.close(); process.exit(2); }

await pg.evaluate(({ PERI_WINDOW, GATES }) => {
  window.__w261c = (id, ci, oi, dt, maxSteps, budgetMs) => {
    const p = HP.allPresets().find((q) => q.id === id);
    const v = HP.validatePreset(JSON.parse(JSON.stringify(p)));
    HP.sim.build(v.preset);
    const S = HP.sim;
    // 同じ標本列を 4 つの検出器へ流す(走行は 1 回)
    const dets = [{ tag: 'legacy', d: createPeriastronDetector({ mode: 'legacy' }) }];
    for (const g of GATES) dets.push({ tag: 'phase' + g, d: createPeriastronDetector({ phaseGate: g * Math.PI }) });
    const t0 = performance.now();
    let k = 0, stopped = 'window';
    // rMin/rMax は**位相制限(1.5π)の最初の近点から最後の近点まで**で作る(1 本の窓・逐次更新。
    // 全步の r を貯めると段が細かいときに数十 GB になるので貯めない)
    let inWindow = false, rMin = Infinity, rMax = -Infinity, primaryCount = 0;
    for (; k < maxSteps; k++) {
      S.step(dt);
      const dx = S.x[oi] - S.x[ci], dy = S.y[oi] - S.y[ci];
      const rr = Math.hypot(dx, dy), th = Math.atan2(dy, dx);
      const dvx = S.vx[oi] - S.vx[ci], dvy = S.vy[oi] - S.vy[ci];
      const rd = (rr > 0) ? (dx * dvx + dy * dvy) / rr : 0;
      if (inWindow) { if (rr < rMin) rMin = rr; if (rr > rMax) rMax = rr; }
      for (const z of dets) {
        const a = z.d.push(k, rr, rd, th);
        if (z.tag === 'phase1.5' && a.accepted) { primaryCount++; inWindow = true; }
      }
      if (primaryCount >= PERI_WINDOW) { stopped = 'window'; break; }
      if (S.hasNaN()) { stopped = 'nan'; break; }
      if ((k & 65535) === 0 && (performance.now() - t0) > budgetMs) { stopped = 'time-budget'; break; }
    }
    if (k >= maxSteps) stopped = 'max-steps';
    const fit = (xs, ys) => {
      const m = ys.length;
      if (m < 2) return null;
      const mx = xs.reduce((a, b) => a + b, 0) / m, my = ys.reduce((a, b) => a + b, 0) / m;
      let sxy = 0, sxx = 0;
      for (let i = 0; i < m; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) * (xs[i] - mx); }
      if (!(sxx > 0)) return null;
      const sl = sxy / sxx;
      const se = (m > 2) ? Math.sqrt(ys.reduce((s, y, i) => s + (y - (my + sl * (xs[i] - mx))) ** 2, 0) / (m - 2) / sxx) : null;
      return { slope: sl, se };
    };
    const summarize = (res) => {
      const n = Math.min(res.nPeri, PERI_WINDOW);
      const full = (res.nPeri >= PERI_WINDOW) && !res.unwrapFailed;
      const peri = res.peri.slice(0, n);
      const ang = res.ang.slice(0, n);
      const perMean = full ? (peri[PERI_WINDOW - 1].k - peri[0].k) * dt / (PERI_WINDOW - 1) : null;
      // **旧器が印字していた値**(unwrap 失敗を無視して 20 個目まで割る「無効集計」)。
      // 「測れなかった」と「測ったら 0 だった」を分けるために、**別の欄**に残す。
      const perMeanRaw = (res.nPeri >= PERI_WINDOW)
        ? (peri[PERI_WINDOW - 1].k - peri[0].k) * dt / (PERI_WINDOW - 1) : null;
      const idx = ang.map((_, i) => i);
      const tim = ang.map((_, i) => peri[i].k * dt);
      const fA = (ang.length >= 3) ? fit(idx, ang) : null;
      const fB = (ang.length >= 3) ? fit(tim, ang) : null;
      return { measured: full && res.measured, nPeri: res.nPeri,
        candidates: res.candidates, rejectedCount: res.rejectedCount,
        unwrapFailed: res.unwrapFailed, jump: res.jump,
        measurementMethod: res.measurementMethod, phaseGate: res.phaseGate,
        perMeanSim: perMean, perMeanSimRaw: perMeanRaw,
        periStartSim: peri.length ? peri[0].k * dt : null,
        periEndSim: full ? peri[PERI_WINDOW - 1].k * dt : null,
        slopeRadPerOrbit: fA ? fA.slope : null, seRadPerOrbit: fA ? fA.se : null,
        slopeRadPerSimTime: fB ? fB.slope : null, seRadPerSimTime: fB ? fB.se : null,
        // 先頭の 8 個の検出時刻(sim 時間)—— **重複検出はここに現れる**
        firstTimes: peri.slice(0, 8).map((z) => z.k * dt),
        // 位相制限が**採らなかった**候補の先頭 8 個(旧法なら 0 件)
        rejectedTimes: res.rejected.slice(0, 8).map((z) => ({ tSim: z.k * dt, phase: z.phaseSincePrev })) };
    };
    const out = { steps: k, stopped, dt, nan: S.hasNaN(),
      clamp: (S.clampVN || 0) + (S.clampSN || 0) + (S.clampHN || 0) + (S.clampRN || 0) + (S.clampTN || 0),
      // 離心率 proxy は**位相制限(1.5π)の窓 1 本**から作る(検出器ごとに窓を変えない)
      rMin: Number.isFinite(rMin) ? rMin : null, rMax: Number.isFinite(rMax) ? rMax : null,
      eProxy: (rMax > 0 && rMax + rMin > 0) ? (rMax - rMin) / (rMax + rMin) : null,
      dets: {} };
    for (const z of dets) out.dets[z.tag] = summarize(z.d.result(PERI_WINDOW));
    out.mass = { held: [S.m[ci], S.m[oi]], declared: (v.preset.bodies || []).map((b) => b.m).slice(0, 2),
      isFloat32: (S.m instanceof Float32Array) };
    out.precision = { framePrecision: v.preset.physics.framePrecision || null,
      stateCarry: v.preset.physics.stateCarry || null,
      xIsFloat64: (S.x instanceof Float64Array) };
    return out;
  };
  window.__w261decl = (id) => {
    const p = HP.allPresets().find((q) => q.id === id);
    return { scaleExp: p.scaleExp, bodies: (p.bodies || []).map((b) => b.m) };
  };
}, { PERI_WINDOW, GATES });

const out = { meta: { wave: '第261便c', target: TARGET, dt0: DT0, periWindow: PERI_WINDOW,
  yearSec: YEAR_SEC, gates: GATES.map((g) => g + 'π'), phaseGateDefault: PERI_PHASE_GATE_DEFAULT,
  window: '**位相制限(1.5π)の検出器が採った最初の 20 近点(19 区間)**。旧法は同じ標本列から'
    + '自分の最初の 20 候補で同じ量を作る —— **旧法の窓は 20 公転とは限らない**(それがこの器の主題である)。',
  extractor: '**1 回の走行に 4 つの検出器**(旧法 / 1.25π / 1.5π / 1.75π)を同時に流す。'
    + '差は抽出器の差だけで、積分は 1 回しかしていない。',
  touched: '**プリセット JSON は 1 bit も書き換えていない**。変えるのは dt だけである。'
    + '`S._core` には 1 命令も足していない。',
  obsNote: '観測は paper/data/solar-observations.csv が正本。**版 v1 = 最初の行**・'
    + '**版 v2 = source に DDFWHE を含む行**(🩺 のみ)。**プリセットと builder は版 v1 のままである**。' },
  cases: [], pageErrors: [] };

let spentAll = 0;
for (const C of CASES) {
  if (ONLY && !ONLY.includes(C.id)) continue;
  const decl = await pg.evaluate((id) => window.__w261decl(id), C.id);
  const toSec = Math.pow(10, Number(decl.scaleExp.T));
  const obsP1 = obsPick(C.body, 'orbital_period');
  const obsE1 = obsPick(C.body, 'eccentricity');
  const obsW1 = obsPick(C.body, 'periastron_advance');
  const obsP2 = obsPick(C.body, 'orbital_period', { ddfwhe: true, unit: 's' });
  const obsE2 = obsPick(C.body, 'eccentricity', { ddfwhe: true });
  const obsW2 = obsPick(C.body, 'periastron_advance', { ddfwhe: true });
  const divs = DIVS_OVERRIDE || C.divs;
  const stages = [];
  let spent = 0, truncated = null;
  for (const d of divs) {
    if (stages.length) {
      const s0 = stages[0];
      const rate = s0.steps / Math.max(s0.wallSec, 1e-9);
      const projSec = (s0.steps * d) / rate;
      if (spent + projSec > BUDGET_TOTAL_S) {
        truncated = { stoppedBefore: 'dt/' + d, projectedSec: +projSec.toFixed(1), spentSec: +spent.toFixed(1),
          note: '**予算で止めた**(失敗ではない)。この段は「未走行」と表に書く。' };
        console.error(`  [予算] dt/${d} の見積り ${projSec.toFixed(0)} s → ここで止める`);
        break;
      }
    }
    const dt = DT0 / d;
    const t0 = Date.now();
    const r = await pg.evaluate(({ id, ci, oi, dt, maxSteps, budgetMs }) =>
      window.__w261c(id, ci, oi, dt, maxSteps, budgetMs),
    { id: C.id, ci: C.c, oi: C.o, dt, maxSteps: 8e8, budgetMs: BUDGET_STAGE_S * 1000 });
    const wall = (Date.now() - t0) / 1000;
    spent += wall; spentAll += wall;
    const conv = (z) => ({ ...z,
      perMeanSec: (z.perMeanSim !== null) ? z.perMeanSim * toSec : null,
      perMeanSecRaw: (z.perMeanSimRaw !== null && z.perMeanSimRaw !== undefined) ? z.perMeanSimRaw * toSec : null,
      degPerOrbit: (z.slopeRadPerOrbit !== null) ? z.slopeRadPerOrbit * 180 / Math.PI : null,
      degPerYear: (z.slopeRadPerSimTime !== null) ? z.slopeRadPerSimTime * 180 / Math.PI / toSec * YEAR_SEC : null,
      seDegPerYear: (z.seRadPerSimTime !== null && z.seRadPerSimTime !== undefined)
        ? z.seRadPerSimTime * 180 / Math.PI / toSec * YEAR_SEC : null,
      tSpanSec: (z.periEndSim !== null && z.periStartSim !== null) ? (z.periEndSim - z.periStartSim) * toSec : null,
      firstTimesSec: (z.firstTimes || []).map((q) => q * toSec),
      rejectedTimesSec: (z.rejectedTimes || []).map((q) => ({ tSec: q.tSim * toSec, phase: q.phase })) });
    const dets = {};
    for (const k of Object.keys(r.dets)) dets[k] = conv(r.dets[k]);
    stages.push({ div: d, dt, wallSec: +wall.toFixed(2), steps: r.steps, stopped: r.stopped,
      nan: r.nan, clamp: r.clamp, eProxy: r.eProxy, rMin: r.rMin, rMax: r.rMax,
      dets, mass: r.mass, precision: r.precision });
    const P = dets['phase1.5'], L = dets.legacy;
    P.eProxyWindow = r.eProxy;
    console.error(`  ${C.emoji} ${C.id} dt/${d}=${dt}  步 ${r.steps}  ${wall.toFixed(1)} s`
      + `  [1.5π] 近点 ${P.nPeri}(候補 ${P.candidates}・棄却 ${P.rejectedCount})`
      + ` P=${P.perMeanSec === null ? '—' : P.perMeanSec.toFixed(6)} s  e=${r.eProxy === null ? '—' : r.eProxy.toFixed(7)}`
      + `  ω̇=${P.degPerYear === null ? '—' : P.degPerYear.toFixed(4)} deg/yr`
      + `  [旧法] 近点 ${L.nPeri} P=${L.perMeanSec === null ? '—' : L.perMeanSec.toFixed(6)} s`
      + ` (無効集計 ${L.perMeanSecRaw === null ? '—' : L.perMeanSecRaw.toFixed(2)} s)`
      + ` measured=${L.measured}  (${r.stopped})`);
  }
  const m0 = stages.length ? stages[0].mass : null;
  const massDiag = m0 ? massRoundingEstimate(m0.declared, m0.held, obsP1 ? obsP1.value : null, obsP1 ? obsP1.sigma : null) : null;
  if (massDiag) { massDiag.isFloat32 = m0.isFloat32; massDiag.ulpBitwise = m0.declared.map((z) => float32Ulp(z)); }
  // 段列(位相制限 1.5π = 正本)の観測次数と ε_num
  const pObs = (q1, q2, q4) => { const a = q1 - q2, b = q2 - q4;
    if (![a, b].every(Number.isFinite) || b === 0) return null;
    const r = a / b; return (r > 0) ? Math.log2(r) : null; };
  const rich = (qC, qF, order, ratio = 2) => {
    if (![qC, qF].every(Number.isFinite) || !Number.isFinite(order) || !(order > 0)) return null;
    return qF + (qF - qC) / (Math.pow(ratio, order) - 1); };
  const quantities = [['P', '近点間 P [s]', (s) => s.dets['phase1.5'].perMeanSec],
    ['e', '離心率 proxy', (s) => s.eProxy],
    ['degYear', '近点移動 [deg/yr]', (s) => s.dets['phase1.5'].degPerYear],
    ['degOrbit', '近点移動 [°/周]', (s) => s.dets['phase1.5'].degPerOrbit]].map(([key, name, f]) => {
    const q = stages.map(f);
    const rows = [];
    for (let i = 0; i + 2 < q.length; i++) {
      const p = pObs(q[i], q[i + 1], q[i + 2]);
      rows.push({ triple: [stages[i].div, stages[i + 1].div, stages[i + 2].div].map((z) => 'dt/' + z).join(','),
        pObs: p, richardson: rich(q[i + 1], q[i + 2], p) });
    }
    const eps = (Number.isFinite(q[0]) && Number.isFinite(q[2])) ? Math.abs(q[0] - q[2]) : null;
    return { key, name, values: q, stages: stages.map((s) => 'dt/' + s.div), pObsRows: rows,
      epsNum: eps, epsNumEstimate: (eps !== null && rows.length) ? refinedNumBound(eps, rows[0].pObs) : null,
      asymptotic: (rows.length >= 2 && rows.every((z) => Number.isFinite(z.pObs)))
        ? { pObsShifts: rows.map((z) => z.pObs),
          inAsymptotic: Math.abs(rows[rows.length - 1].pObs - rows[0].pObs) < 0.1 } : null };
  });
  out.cases.push({ id: C.id, emoji: C.emoji, note: C.note, toSec, truncated,
    obs: { v1: { period: obsP1, ecc: obsE1, omegaDot: obsW1 },
      v2: { period: obsP2, ecc: obsE2, omegaDot: obsW2,
        note: '**版 v2 = Meng et al. (2025) Table 1 DDFWHE 列**(🩺 のみ)。'
          + '**プリセットと builder の入力は版 v1 のままである** —— 黙って置換していない。' } },
    precision: stages.length ? stages[0].precision : null,
    massRounding: massDiag,
    stages, quantities,
    budget: { spentSec: +spent.toFixed(1), budgetTotalS: BUDGET_TOTAL_S } });
}

out.pageErrors = pageErrors;
out.meta.spentSec = +spentAll.toFixed(1);
await browser.close();
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.error('[w261c] wrote ' + OUT + '  (' + spentAll.toFixed(1) + ' s)');
