// 第265便a(第57報 W1)「**収束先に対して (k, f) 共同根を取り直す**」。
//
// ■ この器が答える 2 つの問い
//   (i) 第264便a の共同根 (k\*, f\*) は **刻み依存**か。保存した (f, k) を固定して
//       dt = 0.016 / 0.008 / 0.004 で P と ω̇ を測り直し、動く幅を数で出す。
//   (ii) **収束先(3 刻みの Richardson 外挿値)**に対して共同根を取り直すと (k\*, f\*) はどこへ行くか。
//       —— 第264便a の根は **h(dt=0.016)の測定値**に対する根だった。刻みを細かくすると P も ω̇ も動くので、
//       「どの刻みの P に合わせた根か」を宣言しないと根は決まらない。本器は**外挿値**に合わせ直す。
//
// ■ 手順(統括の読み (A) の 4 段のうち第 3 段)
//   1 点の評価 = dt を 3 段走らせ、P と ω̇ の **Richardson 外挿値**を作る(`richardson3`)。
//     **見かけの次数 p_obs が正でなければ外挿しない**(= その点は `measurement-unresolved`)。
//   ヤコビアン ∂(P_ext, ω̇_ext)/∂(k, f) を**中心差分で実測**(Δk=0.02・Δf=0.01・各点 3 段)。
//   Newton を **外挿値の残差**に対して回し、毎歩の残差を記録する。
//   根の返り値には **`rootCheck`**(`tests/lib-w265a-analogy.mjs`)を必ず付ける ——
//   **停止条件(|ΔP|<10⁻³ s・|Δω̇|/ω̇<5×10⁻⁴)は探索許容であって σ ではない。**
//   感度は**無次元化**して条件数を保存する(**次元付き行列式で識別性を判断しない**)。
//
// ■ この器が**言わないこと**
//   「kFrame≈0.7 を採った」「共同根が 3σ に入った」「事前予測式」「NS の現実較正を完了した」。
//   **f≠1 から観測質量の誤りや未観測質量の存在が確定するわけではない**(初期条件・力則・数値誤差も
//   同じ不一致に寄与しうる)。
//
// ■ 触らないもの
//   `beta/index.html` は**読むだけ**。本体 ⚡🧮🩺🧶 の JSON を 1 bit も書き換えない。
//   `S._core` には 1 命令も足していない。診断コピーは `sampleClass:"principle"`。
//
// 実行: node tests/exp-w265a-kjoint2.mjs [--only id,...] [--newton 3] [--no-newton]
// 出力: tests/out/kjoint2-w265a.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { richardson3, rootCheck, nondimJacobian, protocolDeclaration } from './lib-w265a-analogy.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + path.join(ROOT, TARGET);
const OUT = path.join(ROOT, 'tests', 'out', 'kjoint2-w265a.json');
const SRC264 = path.join(ROOT, 'tests', 'out', 'kjoint-w264a.json');
const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(k); return (i >= 0 && argv[i + 1]) ? argv[i + 1] : d; };
const DT0 = 0.016;
const DIVS = [1, 2, 4];
const PERI_WINDOW = 20;
const YEAR_SEC = 31557600;
const P_TOL_SEC = 1e-3;     // **探索許容**(σ ではない)
const W_TOL_REL = 5e-4;     // **探索許容**(σ ではない)
const NEWTON_MAX = Number(arg('--newton', 3));
const NO_NEWTON = argv.includes('--no-newton');
const DK = 0.02, DF = 0.01;

const SYSTEMS = [
  { id: 'psrDoubleABDFM', emoji: '⚡', label: 'J0737−3039A/B', csvBody: 'PSR J0737-3039 B', solution: 'Kramer2021-DDS' },
  { id: 'psrJ1757DFM', emoji: '🧮', label: 'J1757−1854', csvBody: 'PSR J1757-1854', solution: 'Singha2026-DDH' },
  { id: 'psrJ1946DFM', emoji: '🩺', label: 'J1946+2052', csvBody: 'PSR J1946+2052', solution: 'Meng2025-DDFWHE' },
  { id: 'psrB1534DFM', emoji: '🧶', label: 'B1534+12', csvBody: 'PSR B1534+12', solution: 'Fonseca2014-DDGR' },
];
const ONLY = (() => { const s = arg('--only', null); return s ? s.split(',') : null; })();

// **統括の予備測定**(保存主列 (f, k) を 3 刻みで測り直した値・照合のためだけに置く。観測値ではない)
const PRELIM = {
  psrDoubleABDFM: { P: [8834.53, 8874.30, 8894.19], omegaDotH: 16.89, omegaDotH2: 16.64, omegaDotH4: 16.54 },
  psrJ1757DFM: { P: [15857.67, 16000.58, 16072.56] },
  psrJ1946DFM: { P: [6781.37, 6819.26, 6838.20] },
  psrB1534DFM: { P: [36351.70, 36409.21, 36437.98] },
};

// ---- 観測(CSV が正本)
function parseCsvLine(line) {
  const cols = []; let cur = '', inQ = false;
  for (const ch of line) {
    if (inQ) { if (ch === '"') inQ = false; else cur += ch; }
    else if (ch === '"') inQ = true;
    else if (ch === ',') { cols.push(cur); cur = ''; }
    else cur += ch;
  }
  cols.push(cur); return cols;
}
const OBS_ROWS = (() => {
  const txt = fs.readFileSync(path.join(ROOT, 'paper', 'data', 'solar-observations.csv'), 'utf8');
  const rows = [];
  for (const line of txt.split('\n')) {
    if (!line.trim() || line.startsWith('body,')) continue;
    const c = parseCsvLine(line);
    const sg = (c[8] !== undefined && c[8].trim() !== '') ? Number(c[8]) : null;
    rows.push({ body: c[0], quantity: c[1], value: Number(c[2]), unit: c[3], source: String(c[4]),
      note: String(c[7] || ''), sigma: (Number.isFinite(sg) && sg > 0) ? sg : null });
  }
  return rows;
})();
const firstRow = (b, q) => OBS_ROWS.find((r) => r.body === b && r.quantity === q) || null;
const solRow = (b, q, t) => OBS_ROWS.find((r) => r.body === b && r.quantity === q
  && r.note.includes('solution=' + t)) || null;
const toSec = (r) => (!r ? null : (r.unit === 's' ? r.value : (r.unit === 'd' ? r.value * 86400 : null)));
const sigSec = (r) => (!r || r.sigma === null ? null
  : (r.unit === 's' ? r.sigma : (r.unit === 'd' ? r.sigma * 86400 : null)));

const SAVED = JSON.parse(fs.readFileSync(SRC264, 'utf8'));
const saved264 = (id) => (SAVED.systems || []).find((s) => s.id === id) || null;

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

await pg.evaluate(() => {
  window.__w265aKRun = (srcId, f, kFrame, dt, nWant, budgetMs) => {
    const src = HP.allPresets().find((q) => q.id === srcId);
    if (!src) return { ok: false, errors: ['no such preset: ' + srcId] };
    const pd = psrMassScaled(src, f, { kFrame, keepCore: true, id: 'w265aK2' });
    const v = HP.validatePreset(pd);
    if (!v.ok) return { ok: false, errors: v.errors };
    HP.sim.build(v.preset);
    const S = HP.sim, ci = 0, oi = 1;
    const det = createPeriastronDetector({ phaseGate: 1.5 * Math.PI });
    const t0 = performance.now();
    const r00 = Math.hypot(S.x[oi] - S.x[ci], S.y[oi] - S.y[ci]);
    let k = 0, stopped = 'window', nPeri = 0;
    let rMin = Infinity, rMax = -Infinity, inWin = false;
    for (; k < 4e8; k++) {
      S.step(dt);
      const dx = S.x[oi] - S.x[ci], dy = S.y[oi] - S.y[ci];
      const rr = Math.hypot(dx, dy), th = Math.atan2(dy, dx);
      const dvx = S.vx[oi] - S.vx[ci], dvy = S.vy[oi] - S.vy[ci];
      const rd = (rr > 0) ? (dx * dvx + dy * dvy) / rr : 0;
      if (inWin) { if (rr < rMin) rMin = rr; if (rr > rMax) rMax = rr; }
      const a = det.push(k, rr, rd, th);
      if (a.accepted) { nPeri++; inWin = true; }
      if (nPeri >= nWant) { stopped = 'window'; break; }
      if (rr > 8 * r00) { stopped = 'escape'; break; }
      if (S.hasNaN()) { stopped = 'nan'; break; }
      if ((k & 65535) === 0 && (performance.now() - t0) > budgetMs) { stopped = 'time-budget'; break; }
    }
    const res = det.result(nWant);
    return { ok: true, steps: k, stopped, nan: S.hasNaN(), nPeri: res.nPeri,
      unwrapFailed: res.unwrapFailed,
      peri: (res.peri || []).map((p) => p.k), ang: (res.ang || []).slice(),
      clamp: (S.clampVN || 0) + (S.clampSN || 0) + (S.clampHN || 0) + (S.clampRN || 0) + (S.clampTN || 0),
      r0: r00, eProxy: (rMax > 0 && rMax + rMin > 0) ? (rMax - rMin) / (rMax + rMin) : null };
  };
  // χ_eff(p=2 を正本・p=q は探索列)。**走らせずに t=0 の宣言から読む**
  window.__w265aChi = (srcId, f, kFrame) => {
    const src = HP.allPresets().find((q) => q.id === srcId);
    if (!src) return null;
    const pd = psrMassScaled(src, f, { kFrame, keepCore: true, id: 'w265aK2' });
    const v = HP.validatePreset(pd);
    if (!v.ok) return { ok: false, errors: v.errors };
    const P = v.preset, B = P.bodies.map((b) => ({ m: b.m, x: b.x, y: b.y, vx: b.vx, vy: b.vy }));
    const D0p = (P.physics.D0pull !== undefined) ? P.physics.D0pull : P.physics.D0;
    const dom = (p) => (typeof HP.dfmDominance === 'function')
      ? HP.dfmDominance(B, { p, eps: P.physics.softening, D0: D0p }) : null;
    const d2 = dom(2), dq = dom(P.physics.q);
    return { ok: true, qExp: P.physics.q, D0pull: D0p,
      chiEffP2: d2 ? d2.chiMassWeighted : null,        // **正本**(裁定 Y1(e))
      chiEffPq: dq ? dq.chiMassWeighted : null,        // **探索列**
      massRatio: d2 ? d2.massRatio : null, chiBias: d2 ? d2.chiBias : null };
  };
  window.__w265aBuiltinK = (ids) => ids.map((id) => {
    const p = HP.allPresets().find((q) => q.id === id);
    return { id, kFrame: p ? p.physics.kFrame : null, geoPN: p ? p.physics.geoPN : null,
      sampleClass: p ? p.sampleClass : null };
  });
});

function windowStats(peri, ang, n, dt, unitSec) {
  if (!peri || peri.length < n) return null;
  const P = (peri[n - 1] - peri[0]) * dt / (n - 1) * unitSec;
  const xs = [], ys = [];
  for (let i = 0; i < n; i++) { xs.push(peri[i] * dt); ys.push(ang[i]); }
  const m = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / m, my = ys.reduce((a, b) => a + b, 0) / m;
  let sxy = 0, sxx = 0;
  for (let i = 0; i < m; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; }
  if (!(sxx > 0)) return { P, W: null };
  const slope = sxy / sxx;
  return { P, W: slope * 180 / Math.PI / unitSec * YEAR_SEC };
}

const out = { meta: { wave: '第265便a', target: TARGET, dt0: DT0, divs: DIVS, periWindow: PERI_WINDOW,
  pTolSec: P_TOL_SEC, wTolRel: W_TOL_REL, jacStep: { dk: DK, df: DF }, newtonMax: NEWTON_MAX,
  base: '第264便a の主列(採用レコード)の (k\\*, f\\*) を出発点にする(tests/out/kjoint-w264a.json)。',
  metric: '近点間 P = 位相制限(1.5π)の最初の 20 近点(19 区間)の平均間隔。ω̇ は採用近点の方位を実時刻に回帰した傾き(°/年)。',
  method: '1 点の評価 = 3 刻み(h, h/2, h/4)+ Richardson 外挿。ヤコビアンは**外挿値**の中心差分(各点 3 刻み)。'
    + 'Newton は**外挿値の残差**に対して回す。**停止条件は探索許容であって σ ではない。**',
  prelimSource: 'PRELIM は**統括の予備測定**(保存主列を 3 刻みで測り直した値)。照合のためだけに置いた定数で、観測値ではない。',
  touched: '**本体 ⚡🧮🩺🧶 の JSON は 1 bit も書き換えていない**。`S._core` には 1 命令も足していない。',
  claim: '**この表は較正則ではない。**「kFrame≈0.7 を採った」「事前予測式」とは書かない。'
    + '**f≠1 は観測質量の誤りの確定ではない。**' },
  builtinK: null, systems: [], pageErrors: [] };

out.builtinK = await pg.evaluate((ids) => window.__w265aBuiltinK(ids), SYSTEMS.map((s) => s.id));

const tAll = Date.now();
let nEval = 0;
for (const sys of SYSTEMS) {
  if (ONLY && !ONLY.includes(sys.id)) continue;
  const sv = saved264(sys.id);
  if (!sv || !sv.columns || !sv.columns.adopted || sv.columns.adopted.kStar === null) {
    out.systems.push({ id: sys.id, emoji: sys.emoji, error: '第264便a の保存根が読めない' }); continue;
  }
  const k0 = sv.columns.adopted.kStar, f0 = sv.columns.adopted.fStar;
  const unitSec = await pg.evaluate((id) => Math.pow(10,
    Number(HP.allPresets().find((q) => q.id === id).scaleExp.T)), sys.id);
  const obs = {
    adopted: { P: toSec(firstRow(sys.csvBody, 'orbital_period')), sP: sigSec(firstRow(sys.csvBody, 'orbital_period')),
      W: (firstRow(sys.csvBody, 'periastron_advance') || {}).value ?? null,
      sW: (firstRow(sys.csvBody, 'periastron_advance') || {}).sigma ?? null },
    solution: { P: toSec(solRow(sys.csvBody, 'orbital_period', sys.solution)),
      sP: sigSec(solRow(sys.csvBody, 'orbital_period', sys.solution)),
      W: (solRow(sys.csvBody, 'periastron_advance', sys.solution) || {}).value ?? null,
      sW: (solRow(sys.csvBody, 'periastron_advance', sys.solution) || {}).sigma ?? null },
  };
  const rec = { id: sys.id, emoji: sys.emoji, label: sys.label, unitSec, obs,
    saved264: { kStar: k0, fStar: f0, P: sv.columns.adopted.P, omegaDot: sv.columns.adopted.omegaDot,
      residP: sv.columns.adopted.residP, residW: sv.columns.adopted.residW,
      jacobianAtH: sv.jacobian || null },
    declaration: protocolDeclaration({ systemKind: 'ns-binary', id: sys.id, sampleClass: 'calibration',
      calibrationClass: 'calibration',
      window: { nPeriastron: PERI_WINDOW, phaseGate: '1.5π' },
      extractor: { name: 'radial-crossing/orbit-phase-1.5pi-v1',
        quantity: ['periastron-interval-P', 'periastron-azimuth-slope-omegaDot'],
        definition: '最初の 20 近点(19 区間)の平均間隔・方位の実時刻回帰・**3 刻みの Richardson 外挿値**' },
      observationVersion: { adopted: 'CSV の最初の行', solution: sys.solution },
      quantities: ['orbital_period', 'periastron_advance'], gateConnected: true }),
    evals: [] };
  out.systems.push(rec);

  // 1 点 = 3 刻み + 外挿
  const evalPoint = async (k, f, tag) => {
    const stages = [];
    for (const div of DIVS) {
      const dt = DT0 / div;
      const r = await pg.evaluate(({ id, f, k, dt, n }) => window.__w265aKRun(id, f, k, dt, n, 600000),
        { id: sys.id, f, k, dt, n: PERI_WINDOW });
      const w = (r.ok && r.nPeri >= PERI_WINDOW) ? windowStats(r.peri, r.ang, PERI_WINDOW, dt, unitSec) : null;
      stages.push({ div, dt, ok: r.ok, stopped: r.stopped, nPeri: r.nPeri, steps: r.steps,
        unwrapFailed: r.unwrapFailed, clamp: r.clamp, e: r.eProxy,
        P: w ? w.P : null, omegaDot: w ? w.W : null });
      nEval++;
    }
    const gp = stages.map((s) => s.P), gw = stages.map((s) => s.omegaDot);
    const rp = richardson3(...gp), rw = richardson3(...gw);
    const pt = { tag, k, f, stages, richardson: { P: rp, omegaDot: rw },
      Pext: rp.ext, omegaDotExt: rw.ext,
      resolved: Number.isFinite(rp.ext) && Number.isFinite(rw.ext) };
    rec.evals.push(pt);
    console.error(`    ${sys.emoji} ${tag} k=${k.toFixed(6)} f=${f.toFixed(8)}: `
      + `P(h/h2/h4)=${gp.map((z) => z === null ? '—' : z.toFixed(2)).join('/')} `
      + `ext=${rp.ext === null ? '—' : rp.ext.toFixed(3)}(p=${rp.p === null ? '—' : rp.p.toFixed(3)})  `
      + `ω̇=${gw.map((z) => z === null ? '—' : z.toFixed(4)).join('/')} `
      + `ext=${rw.ext === null ? '—' : rw.ext.toFixed(5)}(p=${rw.p === null ? '—' : rw.p.toFixed(3)})  `
      + `[${((Date.now() - tAll) / 1000).toFixed(0)} s]`);
    fs.mkdirSync(path.dirname(OUT), { recursive: true });
    fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
    return pt;
  };

  // ---- (i) 保存根での刻み依存(**予備測定の再現**)
  const base = await evalPoint(k0, f0, 'saved-root');
  rec.stepDependence = {
    P: base.stages.map((s) => s.P), omegaDot: base.stages.map((s) => s.omegaDot),
    e: base.stages.map((s) => s.e),
    richardson: base.richardson,
    prelim: PRELIM[sys.id] || null,
    prelimDeltaP: (PRELIM[sys.id] && PRELIM[sys.id].P)
      ? base.stages.map((s, i) => (s.P === null ? null : s.P - PRELIM[sys.id].P[i])) : null,
    residualVsObs: {
      adopted: { P: (base.Pext !== null && obs.adopted.P !== null) ? base.Pext - obs.adopted.P : null,
        omegaDot: (base.omegaDotExt !== null && obs.adopted.W !== null) ? base.omegaDotExt - obs.adopted.W : null },
      atH: { P: (base.stages[0].P !== null && obs.adopted.P !== null) ? base.stages[0].P - obs.adopted.P : null,
        omegaDot: (base.stages[0].omegaDot !== null && obs.adopted.W !== null)
          ? base.stages[0].omegaDot - obs.adopted.W : null } },
    note: '**第264便a の根は h の測定値に対する根である**。3 刻みで測り直すと P も ω̇ も動く。',
  };
  rec.rootCheckSavedAtExtrapolated = rootCheck({
    residualP: rec.stepDependence.residualVsObs.adopted.P,
    residualW: rec.stepDependence.residualVsObs.adopted.omegaDot,
    omegaDotObs: obs.adopted.W, pTolSec: P_TOL_SEC, wTolRel: W_TOL_REL,
    measurementResolved: base.resolved });

  if (!base.resolved) {
    rec.note = '外挿が付かない(見かけの次数が正でない)— この系は収束先に対する根を取らない';
    fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
    continue;
  }

  // ---- ヤコビアン(外挿値・中心差分)
  const a = await evalPoint(k0 + DK, f0, 'jac+k');
  const b = await evalPoint(k0 - DK, f0, 'jac−k');
  const c = await evalPoint(k0, f0 + DF, 'jac+f');
  const d = await evalPoint(k0, f0 - DF, 'jac−f');
  let J = null;
  if ([a, b, c, d].every((z) => z.resolved)) {
    J = { dPdk: (a.Pext - b.Pext) / (2 * DK), dWdk: (a.omegaDotExt - b.omegaDotExt) / (2 * DK),
      dPdf: (c.Pext - d.Pext) / (2 * DF), dWdf: (c.omegaDotExt - d.omegaDotExt) / (2 * DF), dk: DK, df: DF };
    J.det = J.dPdk * J.dWdf - J.dPdf * J.dWdk;
    J.ratioWk_over_Wf = (Math.abs(J.dWdf) > 0) ? J.dWdk / J.dWdf : null;
  }
  rec.jacobianExt = J || { error: 'ヤコビアンの 4 点のどれかで外挿が付かない' };
  if (J) {
    rec.sensitivityExt = nondimJacobian(J, { k: k0, f: f0, P: base.Pext, omegaDot: base.omegaDotExt });
    console.error(`    ${sys.emoji} J_ext: ∂P/∂k=${J.dPdk.toExponential(3)} ∂P/∂f=${J.dPdf.toExponential(3)}`
      + ` ∂ω̇/∂k=${J.dWdk.toExponential(3)} ∂ω̇/∂f=${J.dWdf.toExponential(3)}`
      + ` cond=${rec.sensitivityExt ? rec.sensitivityExt.cond.toFixed(3) : '—'}`);
  }
  // h のヤコビアン(第264便a の保存値)も同じ書式で無次元化する
  if (sv.jacobian && Number.isFinite(sv.jacobian.dPdk)) {
    rec.sensitivityAtH = nondimJacobian(sv.jacobian,
      { k: k0, f: f0, P: sv.columns.adopted.P, omegaDot: sv.columns.adopted.omegaDot });
    rec.ratioWk_over_Wf_atH = (Math.abs(sv.jacobian.dWdf) > 0) ? sv.jacobian.dWdk / sv.jacobian.dWdf : null;
  }

  // ---- Newton(外挿値の残差に対して)
  rec.columns = {};
  const newton = async (Pobs, Wobs, tag, kStart, fStart) => {
    if (!J || !Number.isFinite(J.det) || J.det === 0) return { tag, error: 'ヤコビアンが無い' };
    let k = (kStart === undefined) ? k0 : kStart, f = (fStart === undefined) ? f0 : fStart;
    let last = base, steps = [];
    for (let it = 0; it < NEWTON_MAX; it++) {
      const reuse = rec.evals.find((z) => Math.abs(z.k - k) < 1e-12 && Math.abs(z.f - f) < 1e-12);
      const m = reuse || await evalPoint(k, f, tag + '#' + it);
      last = m;
      const rP = (m.Pext === null) ? null : m.Pext - Pobs;
      const rW = (m.omegaDotExt === null) ? null : m.omegaDotExt - Wobs;
      steps.push({ it, k, f, Pext: m.Pext, omegaDotExt: m.omegaDotExt, residP: rP, residW: rW,
        resolved: m.resolved });
      if (rP === null || rW === null) { steps.push({ note: '外挿が付かない — 止めた' }); break; }
      if (Math.abs(rP) < P_TOL_SEC && Math.abs(rW) / Math.abs(Wobs) < W_TOL_REL) break;
      if (it === NEWTON_MAX - 1) break;
      const dk = (-rP * J.dWdf + rW * J.dPdf) / J.det;
      const df = (-rW * J.dPdk + rP * J.dWdk) / J.det;
      k += dk; f += df;
      if (!(k > -0.5 && k < 1.7 && f > 1.0 && f < 2.6)) { steps.push({ note: 'Newton が探索区間の外へ出た' }); break; }
    }
    const lastStep = steps.filter((s) => s.it !== undefined).pop();
    const r = { tag, kStar: lastStep ? lastStep.k : null, fStar: lastStep ? lastStep.f : null,
      Pext: lastStep ? lastStep.Pext : null, omegaDotExt: lastStep ? lastStep.omegaDotExt : null,
      residP: lastStep ? lastStep.residP : null, residW: lastStep ? lastStep.residW : null,
      steps, how: 'newton(外挿値・実測ヤコビアン)',
      searchInterval: { k: [-0.5, 1.7], f: [1.0, 2.6] } };
    r.rootCheck = rootCheck({ residualP: r.residP, residualW: r.residW, omegaDotObs: Wobs,
      pTolSec: P_TOL_SEC, wTolRel: W_TOL_REL,
      measurementResolved: !!(lastStep && lastStep.resolved) });
    r.deltaFrom264a = (r.kStar !== null) ? { dK: r.kStar - k0, dF: r.fStar - f0 } : null;
    return r;
  };
  if (!NO_NEWTON) {
    rec.columns.adopted = await newton(obs.adopted.P, obs.adopted.W, 'adopted');
    console.error(`    ${sys.emoji} 収束先の根(採用レコード): k*=${rec.columns.adopted.kStar === null ? '—'
      : rec.columns.adopted.kStar.toFixed(6)} f*=${rec.columns.adopted.fStar === null ? '—'
      : rec.columns.adopted.fStar.toFixed(8)}  ${rec.columns.adopted.rootCheck.status}`);
    if (Number.isFinite(obs.solution.P) && Number.isFinite(obs.solution.W)) {
      const A = rec.columns.adopted;
      rec.columns.solution = await newton(obs.solution.P, obs.solution.W, 'solution',
        (A && A.kStar !== null) ? A.kStar : k0, (A && A.fStar !== null) ? A.fStar : f0);
    } else rec.columns.solution = { error: '判定に使う解の P または ω̇ が CSV に無い' };
  }

  // σ 倍(**記録のみ**・合否は出さない)
  const sig = (col, o) => (col && col.residP !== null) ? {
    PSigma: o.sP ? col.residP / o.sP : null, WSigma: o.sW ? col.residW / o.sW : null } : null;
  rec.residualSigma = { adopted: sig(rec.columns.adopted, obs.adopted),
    solution: sig(rec.columns.solution, obs.solution),
    note: '**探索許容と σ は別物である。** この欄は記録であって合否ではない。' };

  // χ_eff(正本 p=2・探索列 p=q)
  rec.chi = await pg.evaluate(({ id, f, k }) => window.__w265aChi(id, f, k),
    { id: sys.id, f: (rec.columns.adopted && rec.columns.adopted.fStar) || f0,
      k: (rec.columns.adopted && rec.columns.adopted.kStar) || k0 });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
}

out.meta.spentSec = +((Date.now() - tAll) / 1000).toFixed(1);
out.meta.evals = nEval;
out.pageErrors = pageErrors;
await browser.close();
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.error('[w265a-kjoint2] wrote ' + OUT + '  (' + out.meta.spentSec + ' s / ' + nEval + ' 走行)');
