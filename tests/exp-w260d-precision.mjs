// 第260便d(第52報 W4)「🧮 PSR J1757−1854 の h8 検査点 —— 自前の器で測る」。
//
// ■ 背景
//   〔第258便d〕は ⚡ だけ 4 段(h…h/8)を走らせ、「🧮🩺🧶 は未走行」と書いた。
//   〔第259便d〕が 🧶 の h8 と ⚡ の h16 を足し、**残っているのは 🧮 と 🩺** である。
//   本器は **🧮 を 1 系だけ**走らせる(統括が設定した検証仮説 (12)「NS の h8 は 1 系ずつ」)。
//   🩺 は次便である。
//
// ■ 統括が設定した検証仮説 (12) の参照値(本器はこれを**再測**する)
//   h/h2/h4/h8 で 周期 15508.038975 / 15680.724197 / 15767.865779 / 15811.638441 s ・
//   eProxy 0.6089 / 0.6074 / 0.6067 / 0.6063 ・ deg/yr 21.3596 / 21.0290 / 20.8686 / 20.7895 ・
//   p_obs 周期 0.987→0.993 / e 1.014→1.007 / deg/yr 1.043→1.021。
//   **仮説であって測定ではない** —— 一致しても不一致でも、本器が印字するのは**自前の実測**である
//   (差は `refDelta` 欄に出す。合わせに行く操作は 1 つもしていない)。
//
// ■ 窓の定義(〔第259便d〕と同じ — 段をまたいで同じ窓にすることが収束次数を読む前提)
//   **最初の 20 近点(19 区間)**を窓とし、3 量をすべてその窓の中で作る:
//     ・近点間 P = (t₂₀ − t₁)/19
//     ・離心率 proxy = (r_max − r_min)/(r_max + r_min)(窓の内側の步だけ)
//     ・近点移動 = unwrap した近点方位の直線 fit の傾き。**2 通りを別欄に出す**:
//         [°/周] = 近点番号に対する fit(〔第259便d〕と同じ欄)
//         [deg/yr] = **近点時刻**(実時間)に対する fit(ユリウス年 3.15576×10⁷ s は単位の約束)
//   棚卸し(`tests/exp-w249b-calaudit.mjs`)は離心率と傾きを走行長いっぱいから作るので、
//   その 2 欄はここと一致しない(近点間 P は同じ窓なので一致するはずである)。
//
// ■ 触らないもの
//   `beta/index.html` は**読むだけ**である。プリセット JSON を 1 bit も書き換えない
//   (🧮 の physics・bodies・massCalibration は不変 —— dt を変えるだけである)。
//
// ■ 予算
//   既定 2.5 時間(`--budget-total`)。**1 段目の实测から残り段の步数を見積もり**、予算を超えるなら
//   h4 で止めて `truncated:true` を立てる(**打ち切りと失敗を混同しない** — 止めた理由を書く)。
//
// 実行: node tests/exp-w260d-precision.mjs [--only psrJ1757DFM] [--divs 1,2,4,8] [--budget-total 9000]
// 出力: tests/out/precision-w260d.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { refinedNumBound } from './lib-w258d-evidence.mjs';
import { massRoundingEstimate, float32Ulp, ulpSearchLegacy } from './lib-precision-diagnostics.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + path.join(ROOT, TARGET);
const OUT = path.join(ROOT, 'tests', 'out', 'precision-w260d.json');
const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(k); return (i >= 0 && argv[i + 1]) ? argv[i + 1] : d; };
const ONLY = arg('--only', null) ? arg('--only', '').split(',') : null;
const DIVS = arg('--divs', '1,2,4,8').split(',').map(Number).filter((z) => z > 0);
const BUDGET_STAGE_S = Number(arg('--budget', 1800));      // 1 段の打ち切り
const BUDGET_TOTAL_S = Number(arg('--budget-total', 9000)); // 系全体の予算(既定 2.5 時間)
const DT0 = 0.016;
const PERI_WINDOW = 20;
const YEAR_SEC = 31557600;   // ユリウス年(**単位の約束**であって観測ではない)

// 統括が設定した検証仮説 (12) の参照値(**仮説** — 本器の実測と並べるためだけに置く)
const HYP12 = {
  psrJ1757DFM: {
    perMeanSec: { 1: 15508.038975, 2: 15680.724197, 4: 15767.865779, 8: 15811.638441 },
    eProxy: { 1: 0.6089, 2: 0.6074, 4: 0.6067, 8: 0.6063 },
    degPerYear: { 1: 21.3596, 2: 21.0290, 4: 20.8686, 8: 20.7895 },
    pObs: { 'P': [0.987, 0.993], 'e': [1.014, 1.007], 'degYear': [1.043, 1.021] },
    ratios: { period: [0.987, 0.993], ecc: [1.014, 1.007], degYear: [1.043, 1.021] },
    source: '統括が設定した検証仮説 (12)(第260便 共通規約)。**本器はこれを再測する** —— '
      + '一致しても不一致でも印字するのは自前の実測である。',
  },
};

const CASES = [
  { id: 'psrJ1757DFM', emoji: '🧮', c: 0, o: 1, obsKey: 'PSR J1757-1854|orbital_period',
    obsHint: '1757', obsOmegaKey: 'PSR J1757-1854|periastron_advance',
    note: '〔第258便d〕⑥ が「未走行」と書いた 3 系のうち **🧮**(🩺 は次便)' },
];

function loadObs() {
  const txt = fs.readFileSync(path.join(ROOT, 'paper', 'data', 'solar-observations.csv'), 'utf8');
  const m = new Map();
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
    const key = cols[0] + '|' + cols[1];
    if (m.has(key)) continue;
    const sg = (cols[8] !== undefined && cols[8].trim() !== '') ? Number(cols[8]) : null;
    m.set(key, { value: Number(cols[2]), unit: cols[3], source: String(cols[4]).slice(0, 90),
      sigma: (Number.isFinite(sg) && sg > 0) ? sg : null });
  }
  return m;
}
const OBS = loadObs();
function findObs(key, hint, kind = 'orbital_period') {
  if (OBS.has(key)) return OBS.get(key);
  for (const [k, v] of OBS) if (k.endsWith('|' + kind) && k.toLowerCase().includes(hint)) return v;
  return null;
}

let browser;
try { const { chromium } = await import('playwright'); browser = await chromium.launch(); }
catch { const { chromium } = await import('playwright-core');
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }); }
const pg = await browser.newPage();
const pageErrors = [];
pg.on('pageerror', (e) => pageErrors.push(String(e)));
await pg.goto(INDEX, { waitUntil: 'load' });
await pg.waitForFunction(() => window.HP && HP.sim);

await pg.evaluate((PERI_WINDOW) => {
  // 1 段を走らせて、**同じ 20 近点窓**から 3 量を作る。**プリセットは差し替えない**(dt だけが変わる)。
  window.__w260p = (id, ci, oi, dt, maxSteps, budgetMs) => {
    const p = HP.allPresets().find((q) => q.id === id);
    const v = HP.validatePreset(JSON.parse(JSON.stringify(p)));
    HP.sim.build(v.preset);
    const S = HP.sim;
    const peri = [];
    let rd1 = 0, th1 = 0;
    let rMin = Infinity, rMax = -Infinity;
    let inWindow = false;
    const t0 = performance.now();
    let k = 0, stopped = 'window';
    for (; k < maxSteps; k++) {
      S.step(dt);
      const dx = S.x[oi] - S.x[ci], dy = S.y[oi] - S.y[ci];
      const rr = Math.hypot(dx, dy), th = Math.atan2(dy, dx);
      const dvx = S.vx[oi] - S.vx[ci], dvy = S.vy[oi] - S.vy[ci];
      const rd = (rr > 0) ? (dx * dvx + dy * dvy) / rr : 0;
      if (inWindow) { if (rr < rMin) rMin = rr; if (rr > rMax) rMax = rr; }
      if (k >= 1 && rd1 < 0 && rd >= 0) {
        const fr = (rd !== rd1) ? (-rd1 / (rd - rd1)) : 0;
        let a1 = th1, a2 = th;
        while (a2 - a1 > Math.PI) a2 -= 2 * Math.PI; while (a2 - a1 < -Math.PI) a2 += 2 * Math.PI;
        peri.push({ ang: a1 + fr * (a2 - a1), k: k - 1 + fr, r: rr });
        inWindow = true;
        if (peri.length >= PERI_WINDOW) break;
      }
      rd1 = rd; th1 = th;
      if (S.hasNaN()) { stopped = 'nan'; break; }
      if ((k & 65535) === 0 && (performance.now() - t0) > budgetMs) { stopped = 'time-budget'; break; }
    }
    if (k >= maxSteps) stopped = 'max-steps';
    const n = peri.length;
    const measured = (n >= PERI_WINDOW);
    const perMean = measured ? (peri[PERI_WINDOW - 1].k - peri[0].k) * dt / (PERI_WINDOW - 1) : null;
    // 近点方位の unwrap
    const ang = []; let jump = 0;
    for (let i = 0; i < n; i++) {
      let a = peri[i].ang;
      if (i) { let z = a - ang[i - 1]; while (z > Math.PI) z -= 2 * Math.PI; while (z < -Math.PI) z += 2 * Math.PI;
        if (Math.abs(z) > Math.PI / 2) { jump++; break; }
        a = ang[i - 1] + z; }
      ang.push(a);
    }
    // fit を 2 本: (A) 近点番号に対する傾き [rad/周]・(B) **近点時刻**に対する傾き [rad/sim 時間]
    const fit = (xs, ys) => {
      const m = ys.length;
      if (m < 2) return null;
      const mx = xs.reduce((a, b) => a + b, 0) / m, my = ys.reduce((a, b) => a + b, 0) / m;
      let sxy = 0, sxx = 0;
      for (let i = 0; i < m; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) * (xs[i] - mx); }
      if (!(sxx > 0)) return null;
      const sl = sxy / sxx;
      const resid = Math.sqrt(ys.reduce((s, y, i) => s + (y - (my + sl * (xs[i] - mx))) ** 2, 0) / m);
      // 傾きの標準誤差(fit の内的散らばり — 観測誤差ではない)
      const se = (m > 2) ? Math.sqrt(ys.reduce((s, y, i) => s + (y - (my + sl * (xs[i] - mx))) ** 2, 0) / (m - 2) / sxx) : null;
      return { slope: sl, resid, se, n: m, sxx };
    };
    const idx = ang.map((_, i) => i);
    const tim = ang.map((_, i) => peri[i].k * dt);          // sim 時間(秒換算は器の外)
    const fA = fit(idx, ang), fB = fit(tim, ang);
    const mHeld = [S.m[ci], S.m[oi]];
    const declared = (v.preset.bodies || []).map((b) => b.m);
    return { steps: k, stopped, dt, nPeri: n, measured, jump,
      perMeanSim: perMean, periStart: n ? peri[0].k * dt : null,
      periEnd: measured ? peri[PERI_WINDOW - 1].k * dt : null,
      rMin, rMax, eProxy: (rMax + rMin > 0 && rMax > 0) ? (rMax - rMin) / (rMax + rMin) : null,
      slopeRadPerOrbit: fA ? fA.slope : null, residRadPerOrbit: fA ? fA.resid : null,
      seRadPerOrbit: fA ? fA.se : null,
      slopeRadPerSimTime: fB ? fB.slope : null, seRadPerSimTime: fB ? fB.se : null,
      nan: S.hasNaN(),
      clamp: (S.clampVN || 0) + (S.clampSN || 0) + (S.clampHN || 0) + (S.clampRN || 0) + (S.clampTN || 0),
      mass: { held: mHeld, declared: declared.slice(0, 2), isFloat32: (S.m instanceof Float32Array) },
      precision: { framePrecision: v.preset.physics.framePrecision || null,
        stateCarry: v.preset.physics.stateCarry || null,
        xIsFloat64: (S.x instanceof Float64Array), vxIsFloat64: (S.vx instanceof Float64Array) } };
  };
  window.__w260decl = (id) => {
    const p = HP.allPresets().find((q) => q.id === id);
    return { physics: p.physics, scaleExp: p.scaleExp, massCalibration: p.massCalibration || null,
      bodies: (p.bodies || []).map((b) => b.m) };
  };
}, PERI_WINDOW);

const pObs = (q1, q2, q4) => {
  const a = q1 - q2, b = q2 - q4;
  if (!Number.isFinite(a) || !Number.isFinite(b) || b === 0) return null;
  const r = a / b;
  return (r > 0) ? Math.log2(r) : null;
};
const richardson = (qCoarse, qFine, order, ratio = 2) => {
  if (![qCoarse, qFine].every(Number.isFinite) || !Number.isFinite(order) || !(order > 0)) return null;
  const f = Math.pow(ratio, order);
  return qFine + (qFine - qCoarse) / (f - 1);
};

const out = { meta: { wave: '第260便d', target: TARGET, dt0: DT0, periWindow: PERI_WINDOW,
  divs: DIVS, budgetStageS: BUDGET_STAGE_S, budgetTotalS: BUDGET_TOTAL_S, yearSec: YEAR_SEC,
  window: '**最初の 20 近点(19 区間)を窓とし、3 量をすべて同じ窓の中で作る**(〔第259便d〕と同じ)。'
    + '棚卸しは離心率と傾きを走行長いっぱいから作るので、その 2 欄は一致しない。',
  degYearNote: '近点移動は **[°/周](近点番号への fit)と [deg/yr](近点時刻への fit)の 2 欄**を出す。'
    + 'ユリウス年 3.15576×10⁷ s は**単位の約束**であって観測ではない。',
  touched: '**プリセット JSON は 1 bit も書き換えていない**。変えるのは dt だけである。',
  gateNote: '**門の判定は動かさない**(🧮 は元から `数値未解決` である)。'
    + '**収束次数の合格と観測誤差内の合格は別である** —— p_obs が 1 に寄ることは 3σ とは無関係である。' },
  cases: [], pageErrors: [] };

for (const C of CASES) {
  if (ONLY && !ONLY.includes(C.id)) continue;
  const decl = await pg.evaluate((id) => window.__w260decl(id), C.id);
  const toSec = Math.pow(10, Number(decl.scaleExp.T));
  const obsRow = findObs(C.obsKey, C.obsHint, 'orbital_period');
  const omegaRow = findObs(C.obsOmegaKey, C.obsHint, 'periastron_advance');
  const hyp = HYP12[C.id] || null;
  const stages = [];
  let spent = 0, truncated = null;
  for (const d of DIVS) {
    // 予算の見積り: 1 段目の步/秒から残り段の步数を積む(**止めた理由を書くため**の欄)
    if (stages.length) {
      const s0 = stages[0];
      const rate = s0.steps / Math.max(s0.wallSec, 1e-9);       // 步/s
      const projSteps = s0.steps * d;                            // 步数は分母に比例する
      const projSec = projSteps / rate;
      if (spent + projSec > BUDGET_TOTAL_S) {
        truncated = { stoppedBefore: 'dt/' + d, projectedSec: +projSec.toFixed(1),
          spentSec: +spent.toFixed(1), budgetTotalS: BUDGET_TOTAL_S,
          note: '**予算で止めた**(失敗ではない)。見積りは 1 段目の步/秒 × 段の步数である。' };
        console.error(`  [予算] dt/${d} の見積り ${projSec.toFixed(0)} s で総予算 ${BUDGET_TOTAL_S} s を超える → ここで止める`);
        break;
      }
      console.error(`  [見積り] dt/${d}: 步 ${projSteps.toExponential(3)} / 約 ${projSec.toFixed(0)} s`);
    }
    const dt = DT0 / d;
    const t0 = Date.now();
    const r = await pg.evaluate(({ id, ci, oi, dt, maxSteps, budgetMs }) =>
      window.__w260p(id, ci, oi, dt, maxSteps, budgetMs),
    { id: C.id, ci: C.c, oi: C.o, dt, maxSteps: 4e8, budgetMs: BUDGET_STAGE_S * 1000 });
    const wall = (Date.now() - t0) / 1000;
    spent += wall;
    const perMeanSec = (r.perMeanSim !== null) ? r.perMeanSim * toSec : null;
    const degPerOrbit = (r.slopeRadPerOrbit !== null) ? r.slopeRadPerOrbit * 180 / Math.PI : null;
    const degPerYear = (r.slopeRadPerSimTime !== null)
      ? r.slopeRadPerSimTime * 180 / Math.PI / toSec * YEAR_SEC : null;
    const seDegPerYear = (r.seRadPerSimTime !== null && r.seRadPerSimTime !== undefined)
      ? r.seRadPerSimTime * 180 / Math.PI / toSec * YEAR_SEC : null;
    stages.push({ div: d, dt, wallSec: +wall.toFixed(2), ...r, perMeanSec, degPerOrbit, degPerYear,
      seDegPerYear,
      tSpanSec: (r.periEnd !== null && r.periStart !== null) ? (r.periEnd - r.periStart) * toSec : null,
      ref: hyp ? { perMeanSec: hyp.perMeanSec[d] ?? null, eProxy: hyp.eProxy[d] ?? null,
        degPerYear: hyp.degPerYear[d] ?? null } : null });
    const st = stages[stages.length - 1];
    if (st.ref) {
      st.refDelta = {
        perMeanSec: (st.ref.perMeanSec !== null && perMeanSec !== null) ? perMeanSec - st.ref.perMeanSec : null,
        perMeanRelPct: (st.ref.perMeanSec ? (perMeanSec - st.ref.perMeanSec) / st.ref.perMeanSec * 100 : null),
        eProxy: (st.ref.eProxy !== null && r.eProxy !== null) ? r.eProxy - st.ref.eProxy : null,
        degPerYear: (st.ref.degPerYear !== null && degPerYear !== null) ? degPerYear - st.ref.degPerYear : null,
      };
    }
    console.error(`  ${C.emoji} ${C.id} dt/${d}=${dt}  步 ${r.steps}  ${wall.toFixed(1)} s  近点 ${r.nPeri}`
      + `  P=${perMeanSec === null ? '—' : perMeanSec.toFixed(6)} s`
      + `  e=${r.eProxy === null ? '—' : r.eProxy.toFixed(7)}`
      + `  Δϖ=${degPerYear === null ? '—' : degPerYear.toFixed(4)} deg/yr`
      + `  (${r.stopped})`
      + (st.refDelta ? `  [仮説との差 P ${st.refDelta.perMeanSec === null ? '—' : st.refDelta.perMeanSec.toExponential(2)} s`
        + ` / deg/yr ${st.refDelta.degPerYear === null ? '—' : st.refDelta.degPerYear.toExponential(2)}]` : ''));
  }
  const Q = (name) => stages.map((s) => (name === 'P') ? s.perMeanSec
    : (name === 'e') ? s.eProxy : (name === 'degYear') ? s.degPerYear : s.degPerOrbit);
  const divs = stages.map((s) => s.div);
  const quantities = [
    { key: 'P', name: '近点間 P [s]' },
    { key: 'e', name: '離心率 proxy' },
    { key: 'degYear', name: '近点移動 [deg/yr]' },
    { key: 'degOrbit', name: '近点移動 [°/周]' },
  ].map(({ key, name }) => {
    const q = Q(key);
    const rows = [];
    for (let i = 0; i + 2 < q.length; i++) {
      const p = pObs(q[i], q[i + 1], q[i + 2]);
      rows.push({ triple: [divs[i], divs[i + 1], divs[i + 2]].map((d) => 'dt/' + d).join(','),
        pObs: p, richardson: richardson(q[i + 1], q[i + 2], p) });
    }
    const epsRaw = (Number.isFinite(q[0]) && Number.isFinite(q[2])) ? Math.abs(q[0] - q[2]) : null;
    const order0 = rows.length ? rows[0].pObs : null;
    return { name, key, values: q, stages: divs.map((d) => 'dt/' + d), pObsRows: rows,
      epsNum: epsRaw, epsNumEstimate: (epsRaw !== null) ? refinedNumBound(epsRaw, order0) : null,
      hypPObs: hyp && hyp.pObs[key] ? hyp.pObs[key] : null,
      asymptotic: (rows.length >= 2 && rows.every((z) => Number.isFinite(z.pObs)))
        ? { pObsShifts: rows.map((z) => z.pObs),
          inAsymptotic: Math.abs(rows[rows.length - 1].pObs - rows[0].pObs) < 0.1,
          note: '**段をずらしても観測次数が変わらないことが漸近域の条件**である。'
            + '**漸近域に居ることは観測と合うこととは別である。**' }
        : null };
  });
  const obs = obsRow ? obsRow.value : null, sigma = obsRow ? obsRow.sigma : null;
  // 質量の丸め(lib-precision-diagnostics の純関数 — **診断であって誤差上限ではない**)
  const m0 = stages.length ? stages[0].mass : null;
  const massDiag = m0 ? massRoundingEstimate(m0.declared, m0.held, obs, sigma) : null;
  if (massDiag) {
    massDiag.isFloat32 = m0.isFloat32;
    massDiag.ulpSearchLegacy = m0.declared.map((z) => ulpSearchLegacy(z));
    massDiag.ulpBitwise = m0.declared.map((z) => float32Ulp(z));
  }
  // deg/yr の観測との突き合わせ(**記録であって門ではない**)
  const degYearLast = stages.length ? stages[stages.length - 1].degPerYear : null;
  const degYearGate = omegaRow ? {
    obs: omegaRow.value, sigma: omegaRow.sigma, unit: 'deg/yr',
    meas: degYearLast, ratio: (degYearLast !== null && omegaRow.value) ? degYearLast / omegaRow.value : null,
    nSigma: (degYearLast !== null && omegaRow.sigma) ? Math.abs(degYearLast - omegaRow.value) / omegaRow.sigma : null,
    seDegPerYear: stages.length ? stages[stages.length - 1].seDegPerYear : null,
    yearSec: YEAR_SEC,
    gate: '数値未解決(本器では門を動かさない)',
    note: '**deg/yr は近点時刻への線形 fit** である。°/周 は別欄に残してある。'
      + '年の長さは単位の約束であって観測ではない。',
  } : null;
  const pq = quantities[0];
  const last = pq.values[pq.values.length - 1];
  const ext = pq.pObsRows.length ? pq.pObsRows[pq.pObsRows.length - 1].richardson : null;
  out.cases.push({ id: C.id, emoji: C.emoji, note: C.note, toSec, truncated,
    hypothesis: hyp ? { source: hyp.source, perMeanSec: hyp.perMeanSec, eProxy: hyp.eProxy,
      degPerYear: hyp.degPerYear, pObs: hyp.pObs } : null,
    obs: obsRow ? { key: C.obsKey, value: obs, sigma, source: obsRow.source,
      sigmaRelPct: (obs && sigma) ? 100 * sigma / Math.abs(obs) : null } : null,
    precision: stages.length ? stages[0].precision : null,
    massRounding: massDiag,
    degYearGate,
    stages: stages.map((s) => ({ div: s.div, dt: s.dt, steps: s.steps, wallSec: s.wallSec,
      stopped: s.stopped, nPeri: s.nPeri, measured: s.measured, jump: s.jump,
      perMeanSec: s.perMeanSec, tSpanSec: s.tSpanSec, eProxy: s.eProxy,
      degPerOrbit: s.degPerOrbit, degPerYear: s.degPerYear, seDegPerYear: s.seDegPerYear,
      ref: s.ref, refDelta: s.refDelta || null, nan: s.nan, clamp: s.clamp })),
    quantities,
    finest: { div: divs[divs.length - 1], perMeanSec: last,
      residualPct: (Number.isFinite(last) && obs) ? (last - obs) / obs * 100 : null,
      nSigma: (Number.isFinite(last) && obs !== null && sigma) ? Math.abs(last - obs) / sigma : null },
    extrapolated: { perMeanSec: ext,
      residualSec: (Number.isFinite(ext) && obs) ? ext - obs : null,
      residualPct: (Number.isFinite(ext) && obs) ? (ext - obs) / obs * 100 : null,
      nSigma: (Number.isFinite(ext) && obs !== null && sigma) ? Math.abs(ext - obs) / sigma : null,
      note: '**外挿は走行ではない**(推定値である)。「dt を細かくすれば合う」とは書けない。' },
    budget: { spentSec: +spent.toFixed(1), totalBudgetS: BUDGET_TOTAL_S } });
}

out.pageErrors = pageErrors;
await browser.close();
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.error('[w260d] wrote ' + OUT);
for (const c of out.cases) {
  console.error(`  ${c.emoji} ${c.id}: 最細 dt/${c.finest.div} P=${c.finest.perMeanSec === null ? '—' : c.finest.perMeanSec.toFixed(4)} s`
    + ` 残差 ${c.finest.residualPct === null ? '—' : c.finest.residualPct.toFixed(5) + '%'}`
    + ` (${c.finest.nSigma === null ? '—' : c.finest.nSigma.toExponential(3) + 'σ'})`
    + ` / 外挿 ${c.extrapolated.perMeanSec === null ? '—' : c.extrapolated.perMeanSec.toFixed(4)} s`
    + ` (${c.extrapolated.residualSec === null ? '—' : c.extrapolated.residualSec.toFixed(4) + ' s'})`);
  if (c.massRounding && c.massRounding.nSigma !== null)
    console.error(`    質量丸めの診断: ΔP=${c.massRounding.periodErrorSec.toExponential(3)} s`
      + ` = ${c.massRounding.nSigma.toPrecision(4)}σ(isBound:false・isMeasured:false)`);
  if (c.degYearGate) console.error(`    deg/yr: 実測 ${c.degYearGate.meas === null ? '—' : c.degYearGate.meas.toFixed(4)}`
    + ` / 観測 ${c.degYearGate.obs} → 比 ${c.degYearGate.ratio === null ? '—' : c.degYearGate.ratio.toFixed(4)}`);
  for (const q of c.quantities) console.error(`    ${q.name}: p_obs ${q.pObsRows.map((z) => z.pObs === null ? '—' : z.pObs.toFixed(4)).join(' → ')}`
    + (q.hypPObs ? ` [仮説 ${q.hypPObs.join(' → ')}]` : '')
    + ` / ε_num ${q.epsNum === null ? '—' : q.epsNum.toPrecision(6)}`);
}
