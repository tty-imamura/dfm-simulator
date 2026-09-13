// 第259便d(第51報 W4)「🧶 の h8 検査点・⚡ の h16 検査点と Float64 診断」。
//
// ■ 背景(〔第258便d〕⑥)
//   ⚡ だけ dt/8 まで走らせて、**周期と離心率は漸近域に居るが近点移動は居ない**ことが分かった
//   (観測次数が段をずらすと 2.05 → 0.88 と変わる)。他の 3 系(🧮🩺🧶)は**未走行**だった。
//   本器は (a) **🧶 の dt/8 を 1 点**、(b) **⚡ の dt/16 を 1 点**足す。
//   さらに (c) **Float64 診断**: ⚡ は `framePrecision` / `stateCarry:"double"` を宣言しているが、
//   **質量 `S.m` は Float32Array** である(分解能 ~2×10⁻⁷ 相対)。この 2 つを混ぜないために、
//   誤差の出どころを**別の欄**へ分けて記録する ——(1) 周期の定義(窓)(2) 時系(3) 近点抽出
//   (4) 質量の丸め。**どれが効いているかを断定しない**(分けて並べるだけである)。
//
// ■ 窓の定義(この器の宣言 — 棚卸しと同じにはならない欄がある)
//   **最初の 20 近点(19 区間)を窓とし、3 つの量をすべてその同じ窓の中で作る**:
//     ・近点間 P = (t₂₀ − t₁)/19
//     ・離心率 proxy = (r_max − r_min)/(r_max + r_min) —— **窓の内側の步だけ**から作る
//     ・近点移動 [°/周] = unwrap した近点方位の、近点番号に対する直線 fit の傾き(20 点)
//   棚卸し(`tests/exp-w249b-calaudit.mjs`)は離心率と傾きを**走行長いっぱい**から作るので、
//   その 2 欄はここと一致しない(**近点間 P は同じ 20 近点窓なので一致するはずである** —— 確認する)。
//   段ごとに窓が同じであることが収束次数を読む前提なので、ここでは窓を揃える側を採る。
//
// ■ 触らないもの
//   `beta/index.html` は**読むだけ**である。プリセット JSON を 1 bit も書き換えない
//   (⚡🧶 の physics・bodies・massCalibration は不変 —— dt を変えるだけである)。
//
// 実行: node tests/exp-w259d-precision.mjs [--only psrB1534DFM] [--budget 900]
// 出力: tests/out/precision-w259d.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { refinedNumBound } from './lib-w258d-evidence.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + path.join(ROOT, TARGET);
const OUT = path.join(ROOT, 'tests', 'out', 'precision-w259d.json');
const argv = process.argv.slice(2);
const ONLY = (() => { const i = argv.indexOf('--only'); return (i >= 0 && argv[i + 1]) ? argv[i + 1].split(',') : null; })();
const BUDGET_S = (() => { const i = argv.indexOf('--budget'); return (i >= 0 && argv[i + 1]) ? Number(argv[i + 1]) : 900; })();
const DT0 = 0.016;            // アプリ既定
const PERI_WINDOW = 20;       // 第252便b の固定窓(20 近点 = 19 区間)

// 系ごとの段(分母)。⚡ は 16 まで・🧶 は 8 まで(第258便d の「未走行」を 1 点ずつ埋める)。
const CASES = [
  { id: 'psrB1534DFM', emoji: '🧶', c: 0, o: 1, obsKey: 'PSR B1534+12 B|orbital_period',
    obsHint: 'b1534', divs: [1, 2, 4, 8], note: '第258便d では**未走行**だった 4 段目(dt/8)を足す' },
  { id: 'psrDoubleABDFM', emoji: '⚡', c: 0, o: 1, obsKey: 'PSR J0737-3039 B|orbital_period',
    obsHint: 'j0737', divs: [1, 2, 4, 8, 16], note: '第258便d の 4 段に**5 段目(dt/16)**を足し、Float64 診断を分ける' },
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
// 観測 P_b の CSV 行名はサンプルによって違うので、宣言 obsKey が引けないときは body 名で総当りする
function findObs(key, hint) {
  if (OBS.has(key)) return OBS.get(key);
  for (const [k, v] of OBS) if (k.endsWith('|orbital_period') && k.toLowerCase().includes(hint)) return v;
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
  window.__w259p = (id, ci, oi, dt, maxSteps, budgetMs) => {
    const p = HP.allPresets().find((q) => q.id === id);
    const v = HP.validatePreset(JSON.parse(JSON.stringify(p)));
    HP.sim.build(v.preset);
    const S = HP.sim;
    const peri = [];                 // 検出器 A(ṙ の −→+ 交差)
    let rd1 = 0, th1 = 0;
    let rMin = Infinity, rMax = -Infinity;   // **窓の内側だけ**(最初の近点を見てから積む)
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
    // 近点方位の unwrap と、近点番号に対する直線 fit(°/周)
    const ang = []; let jump = 0;
    for (let i = 0; i < n; i++) {
      let a = peri[i].ang;
      if (i) { let z = a - ang[i - 1]; while (z > Math.PI) z -= 2 * Math.PI; while (z < -Math.PI) z += 2 * Math.PI;
        if (Math.abs(z) > Math.PI / 2) { jump++; break; }
        a = ang[i - 1] + z; }
      ang.push(a);
    }
    let slopeDeg = null, residDeg = null;
    if (ang.length >= 2) {
      const m = ang.length, mx = (m - 1) / 2, my = ang.reduce((a, b) => a + b, 0) / m;
      let sxy = 0, sxx = 0;
      for (let i = 0; i < m; i++) { sxy += (i - mx) * (ang[i] - my); sxx += (i - mx) * (i - mx); }
      const sl = sxy / sxx;
      slopeDeg = sl * 180 / Math.PI;
      residDeg = Math.sqrt(ang.reduce((s, a, i) => s + (a - (my + sl * (i - mx))) ** 2, 0) / m) * 180 / Math.PI;
    }
    // Float64 診断(質量の丸めを**別の欄**にする)
    const mHeld = [S.m[ci], S.m[oi]];
    const declared = (v.preset.bodies || []).map((b) => b.m);
    const ulp = mHeld.map((z) => { const f = Math.fround; let u = Math.abs(z) * 1e-8;
      while (f(z + u) === f(z)) u *= 2; return u; });
    return { steps: k, stopped, dt, nPeri: n, measured, jump,
      perMeanSim: perMean, periStart: n ? peri[0].k * dt : null,
      periEnd: measured ? peri[PERI_WINDOW - 1].k * dt : null,
      rMin, rMax, eProxy: (rMax + rMin > 0 && rMax > 0) ? (rMax - rMin) / (rMax + rMin) : null,
      slopeDegPerOrbit: slopeDeg, residDegPerOrbit: residDeg,
      nan: S.hasNaN(),
      clamp: (S.clampVN || 0) + (S.clampSN || 0) + (S.clampHN || 0) + (S.clampRN || 0) + (S.clampTN || 0),
      mass: { held: mHeld, declared: declared.slice(0, 2),
        heldIsFround: mHeld.every((z, i) => z === Math.fround(declared[i])),
        ulp32: ulp, ulpRel: ulp.map((u, i) => (mHeld[i] ? u / Math.abs(mHeld[i]) : null)),
        isFloat32: (S.m instanceof Float32Array) },
      precision: { framePrecision: v.preset.physics.framePrecision || null,
        stateCarry: v.preset.physics.stateCarry || null,
        xIsFloat64: (S.x instanceof Float64Array), vxIsFloat64: (S.vx instanceof Float64Array) } };
  };
  window.__w259pdecl = (id) => {
    const p = HP.allPresets().find((q) => q.id === id);
    return { physics: p.physics, scaleExp: p.scaleExp, massCalibration: p.massCalibration || null };
  };
}, PERI_WINDOW);

// 観測次数(3 段)と Richardson 外挿
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

const out = { meta: { wave: '第259便d', target: TARGET, dt0: DT0, periWindow: PERI_WINDOW,
  budgetS: BUDGET_S,
  window: '**最初の 20 近点(19 区間)を窓とし、3 量をすべて同じ窓の中で作る**。'
    + '棚卸しは離心率と傾きを走行長いっぱいから作るので、その 2 欄はここと一致しない'
    + '(近点間 P は同じ窓なので一致するはずである)。**段ごとに窓を揃えることが収束次数を読む前提**である。',
  touched: '**プリセット JSON は 1 bit も書き換えていない**。変えるのは dt だけである。',
  gateNote: '**門の判定は動かさない**。門が読む ε_num は |Q_h−Q_{h/4}| のままで、'
    + '/(1−4^−p) は**推定誤差の記録**である(第258便d ③)。' },
  cases: [], pageErrors: [] };

for (const C of CASES) {
  if (ONLY && !ONLY.includes(C.id)) continue;
  const decl = await pg.evaluate((id) => window.__w259pdecl(id), C.id);
  const toSec = Math.pow(10, Number(decl.scaleExp.T));
  const obsRow = findObs(C.obsKey, C.obsHint || C.id.toLowerCase());
  const stages = [];
  for (const d of C.divs) {
    const dt = DT0 / d;
    const t0 = Date.now();
    const r = await pg.evaluate(({ id, ci, oi, dt, maxSteps, budgetMs }) =>
      window.__w259p(id, ci, oi, dt, maxSteps, budgetMs),
    { id: C.id, ci: C.c, oi: C.o, dt, maxSteps: 4e8, budgetMs: BUDGET_S * 1000 });
    const wall = (Date.now() - t0) / 1000;
    stages.push({ div: d, dt, wallSec: +wall.toFixed(2), ...r,
      perMeanSec: (r.perMeanSim !== null) ? r.perMeanSim * toSec : null,
      tSpanSec: (r.periEnd !== null && r.periStart !== null) ? (r.periEnd - r.periStart) * toSec : null });
    console.error(`  ${C.emoji} ${C.id} dt/${d}=${dt}  步 ${r.steps}  ${wall.toFixed(1)} s  近点 ${r.nPeri}`
      + `  P=${r.perMeanSim === null ? '—' : (r.perMeanSim * toSec).toFixed(4)} s`
      + `  e=${r.eProxy === null ? '—' : r.eProxy.toFixed(7)}`
      + `  Δϖ=${r.slopeDegPerOrbit === null ? '—' : r.slopeDegPerOrbit.toExponential(5)} °/周`
      + `  (${r.stopped})`);
  }
  // 段が 3 つ以上あるところで p_obs・ε_num・推定誤差・外挿を作る
  const Q = (name) => stages.map((s) => (name === 'P') ? s.perMeanSec
    : (name === 'e') ? s.eProxy : s.slopeDegPerOrbit);
  const quantities = ['P', 'e', 'prec'].map((nm) => {
    const q = Q(nm === 'prec' ? 'prec' : nm);
    const rows = [];
    for (let i = 0; i + 2 < q.length; i++) {
      const p = pObs(q[i], q[i + 1], q[i + 2]);
      rows.push({ triple: [C.divs[i], C.divs[i + 1], C.divs[i + 2]].map((d) => 'dt/' + d).join(','),
        pObs: p, richardson: richardson(q[i + 1], q[i + 2], p) });
    }
    // ε_num は**棚卸しと同じ定義**(|Q_h − Q_{h/4}|)。推定誤差は /(1−4^−p)(第258便d ③)。
    const epsRaw = (Number.isFinite(q[0]) && Number.isFinite(q[2])) ? Math.abs(q[0] - q[2]) : null;
    const order0 = rows.length ? rows[0].pObs : null;
    return { name: nm === 'P' ? '近点間 P [s]' : nm === 'e' ? '離心率 proxy' : '近点移動 [°/周]',
      values: q, stages: C.divs.map((d) => 'dt/' + d), pObsRows: rows,
      epsNum: epsRaw, epsNumEstimate: (epsRaw !== null) ? refinedNumBound(epsRaw, order0) : null,
      asymptotic: (rows.length >= 2 && rows.every((z) => Number.isFinite(z.pObs)))
        ? { pObsShifts: rows.map((z) => z.pObs),
          inAsymptotic: Math.abs(rows[rows.length - 1].pObs - rows[0].pObs) < 0.1,
          note: '**段をずらしても観測次数が変わらないことが漸近域の条件**である'
            + '(変わるなら、3 段で測った p_obs を収束次数として使ってはいけない)' }
        : null };
  });
  // 観測との突き合わせ(**記録であって門ではない** — dt 段は揃っているが 3σ の門はここで動かさない)
  const obs = obsRow ? obsRow.value : null, sigma = obsRow ? obsRow.sigma : null;
  // ---- Float64 診断: **誤差の出どころを 4 つの欄に分ける**(どれが効いているかを断定しない)
  //   (1) 周期の定義(窓)/(2) 時系(窓が張る実時間)/(3) 近点抽出(個数と unwrap の跳び)/
  //   (4) 質量の丸め(`S.m` は Float32Array —— framePrecision/stateCarry が double でもここは 32 bit)。
  //   (4) は P ∝ M^(−1/2) を通して周期へ入る。**上限の見積もりであって、測った誤差ではない**。
  const m0 = stages.length ? stages[0].mass : null;
  let massImpact = null;
  if (m0 && Array.isArray(m0.held) && Array.isArray(m0.declared)) {
    const Md = m0.declared.reduce((a, b) => a + b, 0), Mh = m0.held.reduce((a, b) => a + b, 0);
    const relM = Md ? Math.abs(Mh - Md) / Md : null;
    const relP = (relM !== null) ? 0.5 * relM : null;         // P ∝ M^(−1/2)
    const dP = (relP !== null && obs) ? relP * obs : null;
    massImpact = { isFloat32: m0.isFloat32, heldIsFround: m0.heldIsFround,
      ulpRel: m0.ulpRel, sumDeclared: Md, sumHeld: Mh, relMassError: relM,
      relPeriodError: relP, periodErrorSec: dP,
      nSigma: (dP !== null && sigma) ? dP / sigma : null,
      note: '**質量の丸めだけ**の寄与である(P ∝ M^(−1/2) で M の相対誤差の半分が P に乗る)。'
        + 'framePrecision / stateCarry は double だが、**質量 `S.m` は Float32Array のまま**なので'
        + 'この項は double 化では消えない。**離散化の ε_num とは別の出どころである** —— 桁を比べる。' };
  }
  const diagnostics = { precision: stages.length ? stages[0].precision : null,
    periodDefinition: { window: PERI_WINDOW + ' 近点(' + (PERI_WINDOW - 1) + ' 区間)',
      note: '**段ごとに同じ窓**である(窓が段で変わると収束次数は読めない)。棚卸しは離心率と傾きを'
        + '走行長いっぱいから作るので、その 2 欄はここと一致しない(近点間 P は同じ窓なので一致する)。' },
    timeSeries: stages.map((s) => ({ div: s.div, tSpanSec: s.tSpanSec, steps: s.steps, wallSec: s.wallSec })),
    periastronExtraction: stages.map((s) => ({ div: s.div, nPeri: s.nPeri, jump: s.jump, stopped: s.stopped })),
    massRounding: massImpact };
  const pq = quantities[0];
  const last = pq.values[pq.values.length - 1];
  const ext = pq.pObsRows.length ? pq.pObsRows[pq.pObsRows.length - 1].richardson : null;
  out.cases.push({ id: C.id, emoji: C.emoji, note: C.note, toSec,
    obs: obsRow ? { key: C.obsKey, value: obs, sigma, source: obsRow.source,
      sigmaRelPct: (obs && sigma) ? 100 * sigma / Math.abs(obs) : null } : null,
    precision: stages.length ? stages[0].precision : null,
    massDiagnostic: stages.length ? stages[0].mass : null,
    diagnostics,
    stages: stages.map((s) => ({ div: s.div, dt: s.dt, steps: s.steps, wallSec: s.wallSec,
      stopped: s.stopped, nPeri: s.nPeri, measured: s.measured, jump: s.jump,
      perMeanSec: s.perMeanSec, tSpanSec: s.tSpanSec, eProxy: s.eProxy,
      slopeDegPerOrbit: s.slopeDegPerOrbit, residDegPerOrbit: s.residDegPerOrbit,
      nan: s.nan, clamp: s.clamp })),
    quantities,
    finest: { div: C.divs[C.divs.length - 1], perMeanSec: last,
      residualPct: (Number.isFinite(last) && obs) ? (last - obs) / obs * 100 : null,
      nSigma: (Number.isFinite(last) && obs !== null && sigma) ? Math.abs(last - obs) / sigma : null },
    extrapolated: { perMeanSec: ext,
      residualSec: (Number.isFinite(ext) && obs) ? ext - obs : null,
      residualPct: (Number.isFinite(ext) && obs) ? (ext - obs) / obs * 100 : null,
      nSigma: (Number.isFinite(ext) && obs !== null && sigma) ? Math.abs(ext - obs) / sigma : null,
      note: '**外挿は走行ではない**(推定値である)。「dt を細かくすれば合う」とは書けない。' } });
}

out.pageErrors = pageErrors;
await browser.close();
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.error('[w259d] wrote ' + OUT);
for (const c of out.cases) {
  console.error(`  ${c.emoji} ${c.id}: 最細 dt/${c.finest.div} P=${c.finest.perMeanSec === null ? '—' : c.finest.perMeanSec.toFixed(4)} s`
    + ` 残差 ${c.finest.residualPct === null ? '—' : c.finest.residualPct.toFixed(5) + '%'}`
    + ` / 外挿 ${c.extrapolated.perMeanSec === null ? '—' : c.extrapolated.perMeanSec.toFixed(4)} s`
    + ` (${c.extrapolated.residualSec === null ? '—' : c.extrapolated.residualSec.toFixed(4) + ' s'})`);
  if (c.diagnostics && c.diagnostics.massRounding && c.diagnostics.massRounding.nSigma !== null)
    console.error(`    Float64 診断: 質量の丸めだけで ΔP=${c.diagnostics.massRounding.periodErrorSec.toExponential(3)} s`
      + ` = ${c.diagnostics.massRounding.nSigma.toPrecision(4)}σ(S.m は Float32 のまま)`);
  for (const q of c.quantities) console.error(`    ${q.name}: p_obs ${q.pObsRows.map((z) => z.pObs === null ? '—' : z.pObs.toFixed(4)).join(' → ')}`
    + ` / ε_num ${q.epsNum === null ? '—' : q.epsNum.toPrecision(6)}`
    + ` / 推定誤差 ${(q.epsNumEstimate && q.epsNumEstimate.refined !== null) ? q.epsNumEstimate.refined.toPrecision(6) + '(×' + q.epsNumEstimate.factor.toFixed(4) + ')' : '—'}`);
}
