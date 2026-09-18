// 第265便a(第57報 W1)「**基準走行の判定器**」。
//
// ■ この器が答える 1 つの問い
//   原仮定者(第57報)「『geoPN=2』と『kFrame=1』で成立しない場合は、観測質量に対する補正が必要な
//   状況と判断し、質量補正 f と kFrame を同時に補正する」。
//   —— これは**手順**である。手順の第 1 段は「**基準走行(geoPN=2・kFrame=1・f=1=観測質量そのもの)で
//   P と ω̇ が 3σ に入るか**」を測ることで、入れば補正しない。本器はその 1 段だけを 4 系で測る。
//
// ■ 3 条件(**2 つが本題・3 つ目は対照**)
//   (A) **f=1**(較正台帳の質量係数を外し、観測質量そのものを置く)・kFrame=1・**コア v2 を外す**。
//       —— コア v2 の massFrac=(f−1)/f は f=1 で 0 になり、実行値域 `CORE_RUN_CLAMPS`(massFrac ∈ [0.01, 0.999])
//       に当たって**黙って 0.01 へ切り上がる**。f=1 は「殻質量=観測質量・追加のコアが無い」構成なので、
//       コアを外して `coupleSink:"reservoir"` にするのが宣言と合う(第262便a の既定と同じ)。
//   (B) **現行台帳 f**(本体 ⚡🧮🩺🧶 が持っている f≈2)・kFrame=1・コア v2 を残す族A(第264便a と同じ)。
//   (C) **対照**: f=1・kFrame=1・**コア v2 を残す**(massFrac が 0.01 へ切り上がる構成)を **h だけ**走らせ、
//       (A) との差を数で残す —— 「コアの扱いで判定が変わっていない」ことを測って書くためである。
//   3 条件とも geoPN=2・現行 E6′/E12・framePrecision:"double"。
//
// ■ 測り方(第264便a と同じ宣言 —— 段をまたいで同じであることが読む前提)
//   近点間 P = 位相制限(1.5π)の検出器が採った最初の 20 近点(19 区間)の平均間隔。
//   ω̇ = 採用近点の方位を**実時刻**に回帰した傾き(°/年・ユリウス年 3.15576×10⁷ s)。
//   dt = 0.016(h)・0.008(h/2)・0.004(h/4) の 3 段 + Richardson 外挿(`tests/lib-w265a-analogy.mjs`)。
//   判定は**外挿値**の残差を観測 σ で割って行う(採用レコードと「判定に使う解」の両方)。
//
// ■ 離脱判定について(**f=1 では軌道が大きく変わる**)
//   遠点発の初期条件で質量を 1/f に減らすと、**出発点が新しい軌道の近点になる**(e が大きくなる)。
//   第264便a の器は離脱を「r > 4·r₀」で切っていたが、それでは**束縛しているのに離脱と記録される**。
//   本器は既定で 60·r₀ に置き、r_max/r₀ を記録する(**「測れなかった」と「測ったら外れた」を分ける**)。
//
// ■ 触らないもの
//   `beta/index.html` は**読むだけ**。本体 ⚡🧮🩺🧶 の JSON を 1 bit も書き換えない。
//   `S._core` には 1 命令も足していない。診断コピーは `sampleClass:"principle"`。
//
// 実行: node tests/exp-w265a-basis.mjs [--only id,...] [--divs 1,2,4] [--peri 20] [--esc 60]
// 出力: tests/out/basis-w265a.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { richardson3, baselineVerdict, protocolDeclaration } from './lib-w265a-analogy.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + path.join(ROOT, TARGET);
const OUT = path.join(ROOT, 'tests', 'out', 'basis-w265a.json');
const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(k); return (i >= 0 && argv[i + 1]) ? argv[i + 1] : d; };
const DT0 = Number(arg('--dt0', 0.016));
const DIVS = arg('--divs', '1,2,4').split(',').map(Number).filter((z) => z > 0);
const PERI_WINDOW = Number(arg('--peri', 20));
const ESC = Number(arg('--esc', 60));
const BUDGET_MS = Number(arg('--budget-ms', 900000));
const YEAR_SEC = 31557600;

const SYSTEMS = [
  { id: 'psrDoubleABDFM', emoji: '⚡', label: 'J0737−3039A/B', csvBody: 'PSR J0737-3039 B', solution: 'Kramer2021-DDS' },
  { id: 'psrJ1757DFM', emoji: '🧮', label: 'J1757−1854', csvBody: 'PSR J1757-1854', solution: 'Singha2026-DDH' },
  { id: 'psrJ1946DFM', emoji: '🩺', label: 'J1946+2052', csvBody: 'PSR J1946+2052', solution: 'Meng2025-DDFWHE' },
  { id: 'psrB1534DFM', emoji: '🧶', label: 'B1534+12', csvBody: 'PSR B1534+12', solution: 'Fonseca2014-DDGR' },
];
const ONLY = (() => { const s = arg('--only', null); return s ? s.split(',') : null; })();

// ---- 観測(CSV が正本。この器に観測数値は 1 つも書かない)
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
// 第270便c(AD9): `note.includes('solution=' + t)` は **`adopted_solution=` の部分文字列にも当たる**
// (第270便c が採用解の注記 `adopted_solution=Meng2025-DDFWHE` を旧行へ足したとき、旧行が解タグ行として
// 当たってしまった)。**語境界つきの照合**にする —— 直前が英数字・`_`・`-` なら別の鍵である。
const solutionTagged = (note, tag) => new RegExp('(?:^|[^A-Za-z0-9_-])solution='
  + String(tag).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?![A-Za-z0-9_])').test(String(note || ''));
const solRow = (b, q, t) => OBS_ROWS.find((r) => r.body === b && r.quantity === q
  && solutionTagged(r.note, t)) || null;
const toSec = (r) => (!r ? null : (r.unit === 's' ? r.value : (r.unit === 'd' ? r.value * 86400 : null)));
const sigSec = (r) => (!r || r.sigma === null ? null
  : (r.unit === 's' ? r.sigma : (r.unit === 'd' ? r.sigma * 86400 : null)));

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
  window.__w265aRun = (srcId, f, kFrame, dt, nWant, escFactor, budgetMs, keepCore) => {
    const src = HP.allPresets().find((q) => q.id === srcId);
    if (!src) return { ok: false, errors: ['no such preset: ' + srcId] };
    const pd = psrMassScaled(src, f, { kFrame, keepCore: !!keepCore, id: 'w265aBasis' });
    const v = HP.validatePreset(pd);
    if (!v.ok) return { ok: false, errors: v.errors };
    HP.sim.build(v.preset);
    const S = HP.sim, ci = 0, oi = 1;
    const det = createPeriastronDetector({ phaseGate: 1.5 * Math.PI });
    const t0 = performance.now();
    const r00 = Math.hypot(S.x[oi] - S.x[ci], S.y[oi] - S.y[ci]);
    let k = 0, stopped = 'window', nPeri = 0, inWin = false;
    let rMin = Infinity, rMax = -Infinity;
    for (; k < 4e8; k++) {
      S.step(dt);
      const dx = S.x[oi] - S.x[ci], dy = S.y[oi] - S.y[ci];
      const rr = Math.hypot(dx, dy), th = Math.atan2(dy, dx);
      const dvx = S.vx[oi] - S.vx[ci], dvy = S.vy[oi] - S.vy[ci];
      const rd = (rr > 0) ? (dx * dvx + dy * dvy) / rr : 0;
      if (rr < rMin) rMin = rr; if (rr > rMax) rMax = rr;
      const a = det.push(k, rr, rd, th);
      if (a.accepted) { nPeri++; inWin = true; }
      if (nPeri >= nWant) { stopped = 'window'; break; }
      if (rr > escFactor * r00) { stopped = 'escape'; break; }
      if (S.hasNaN()) { stopped = 'nan'; break; }
      if ((k & 65535) === 0 && (performance.now() - t0) > budgetMs) { stopped = 'time-budget'; break; }
    }
    const res = det.result(nWant);
    return { ok: true, steps: k, stopped, nan: S.hasNaN(), nPeri: res.nPeri, inWin,
      unwrapFailed: res.unwrapFailed,
      peri: (res.peri || []).map((p) => p.k), ang: (res.ang || []).slice(),
      clamp: (S.clampVN || 0) + (S.clampSN || 0) + (S.clampHN || 0) + (S.clampRN || 0) + (S.clampTN || 0),
      r0: r00, rMaxOverR0: (r00 > 0) ? rMax / r00 : null, rMinOverR0: (r00 > 0) ? rMin / r00 : null,
      eProxy: (rMax > 0 && rMax + rMin > 0) ? (rMax - rMin) / (rMax + rMin) : null,
      kFrame: v.preset.physics.kFrame, geoPN: v.preset.physics.geoPN,
      coupleSink: v.preset.physics.coupleSink,
      coreMassFrac: (v.preset.bodies[0] && v.preset.bodies[0].core)
        ? v.preset.bodies[0].core.massFrac : null,
      coreMassFracRun: (S.coreMF && S.coreMF.length) ? S.coreMF[0] : null,
      sampleClass: v.preset.sampleClass, hasMassCal: !!v.preset.massCalibration,
      mHeld: [S.m[ci], S.m[oi]], elapsedMs: performance.now() - t0 };
  };
  // 台帳 f(bodies.m / massCalibration.baseMass)。**読むだけ**
  window.__w265aLedgerF = (id) => {
    const p = HP.allPresets().find((q) => q.id === id);
    if (!p) return null;
    const mc = p.massCalibration;
    const base = (mc && Array.isArray(mc.baseMass)) ? mc.baseMass : null;
    if (!base) return null;
    const rat = p.bodies.map((b, i) => (base[i] > 0 ? b.m / base[i] : null));
    return { ratios: rat, f: rat[0], spread: Math.max(...rat) - Math.min(...rat),
      declaredFactor: (mc.factor === undefined) ? null : mc.factor,
      law: mc.law === undefined ? null : String(mc.law).slice(0, 80),
      kFrame: p.physics.kFrame, geoPN: p.physics.geoPN, sampleClass: p.sampleClass };
  };
});

function windowStats(peri, ang, i0, n, dt, unitSec) {
  if (!peri || peri.length < i0 + n) return null;
  const P = (peri[i0 + n - 1] - peri[i0]) * dt / (n - 1) * unitSec;
  const xs = [], ys = [];
  for (let i = i0; i < i0 + n; i++) { xs.push(peri[i] * dt); ys.push(ang[i]); }
  const m = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / m, my = ys.reduce((a, b) => a + b, 0) / m;
  let sxy = 0, sxx = 0;
  for (let i = 0; i < m; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; }
  if (!(sxx > 0)) return { P, W: null, seW: null };
  const slope = sxy / sxx;
  const se = Math.sqrt(ys.reduce((s, y, i) => s + (y - (my + slope * (xs[i] - mx))) ** 2, 0) / (m - 2) / sxx);
  return { P, W: slope * 180 / Math.PI / unitSec * YEAR_SEC, seW: se * 180 / Math.PI / unitSec * YEAR_SEC };
}

const out = { meta: { wave: '第265便a', target: TARGET, dt0: DT0, divs: DIVS, periWindow: PERI_WINDOW,
  escapeFactor: ESC, yearSec: YEAR_SEC,
  question: '**基準走行(geoPN=2・kFrame=1・f=1)で P と ω̇ が 3σ に入るか**(共同補正プロトコルの第 1 段)。',
  metric: '近点間 P = 位相制限(1.5π)の最初の 20 近点(19 区間)の平均間隔。ω̇ は採用近点の方位を実時刻に回帰した傾き(°/年)。',
  conditions: 'A: f=1(観測質量そのもの)・kFrame=1 / B: 現行台帳 f(f≈2)・kFrame=1。どちらも geoPN=2。',
  touched: '**本体 ⚡🧮🩺🧶 の JSON は 1 bit も書き換えていない**(走行用のコピーをページ内で作る)。'
    + '`S._core` には 1 命令も足していない。',
  claim: '**この表は較正則ではない。** 判定は「補正が要るか要らないか」の 1 段だけである。'
    + '**f≠1 から観測質量の誤りや未観測質量の存在が確定するわけではない。**' },
  rows: [], pageErrors: [] };

const tAll = Date.now();
for (const sys of SYSTEMS) {
  if (ONLY && !ONLY.includes(sys.id)) continue;
  const unitSec = await pg.evaluate((id) => Math.pow(10,
    Number(HP.allPresets().find((q) => q.id === id).scaleExp.T)), sys.id);
  const led = await pg.evaluate((id) => window.__w265aLedgerF(id), sys.id);
  const obs = {
    adopted: { P: toSec(firstRow(sys.csvBody, 'orbital_period')), sP: sigSec(firstRow(sys.csvBody, 'orbital_period')),
      W: (firstRow(sys.csvBody, 'periastron_advance') || {}).value ?? null,
      sW: (firstRow(sys.csvBody, 'periastron_advance') || {}).sigma ?? null,
      e: (firstRow(sys.csvBody, 'eccentricity') || {}).value ?? null },
    solution: { P: toSec(solRow(sys.csvBody, 'orbital_period', sys.solution)),
      sP: sigSec(solRow(sys.csvBody, 'orbital_period', sys.solution)),
      W: (solRow(sys.csvBody, 'periastron_advance', sys.solution) || {}).value ?? null,
      sW: (solRow(sys.csvBody, 'periastron_advance', sys.solution) || {}).sigma ?? null,
      e: (solRow(sys.csvBody, 'eccentricity', sys.solution) || {}).value ?? null },
  };
  const rec = { id: sys.id, emoji: sys.emoji, label: sys.label, unitSec, ledger: led, obs,
    declaration: protocolDeclaration({ systemKind: 'ns-binary', id: sys.id, sampleClass: 'calibration',
      calibrationClass: 'calibration',
      window: { nPeriastron: PERI_WINDOW, phaseGate: '1.5π', why: '第252便b 以来の宣言(段をまたいで同じ)' },
      extractor: { name: 'radial-crossing/orbit-phase-1.5pi-v1',
        quantity: ['periastron-interval-P', 'periastron-azimuth-slope-omegaDot'],
        definition: '最初の 20 近点(19 区間)の平均間隔・方位の実時刻回帰' },
      observationVersion: { adopted: 'CSV の最初の行', solution: sys.solution },
      quantities: ['orbital_period', 'periastron_advance'], gateConnected: true }),
    conditions: [] };
  out.rows.push(rec);

  for (const cond of [
    { tag: 'A_f1', f: 1, k: 1, keepCore: false, divs: DIVS, label: 'f=1(観測質量そのもの)・kFrame=1・コア v2 なし' },
    { tag: 'B_ledger', f: (led && led.f) || 1, k: 1, keepCore: true, divs: DIVS, label: '現行台帳 f・kFrame=1・族A(コア v2 あり)' },
    { tag: 'C_f1core', f: 1, k: 1, keepCore: true, divs: [DIVS[0]], label: '対照: f=1・コア v2 あり(massFrac が 0.01 へ切り上がる)' }]) {
    const cr = { tag: cond.tag, label: cond.label, f: cond.f, kFrame: cond.k, keepCore: cond.keepCore, stages: [] };
    rec.conditions.push(cr);
    for (const div of cond.divs) {
      const dt = DT0 / div;
      const r = await pg.evaluate(({ id, f, k, dt, nWant, esc, bms, kc }) =>
        window.__w265aRun(id, f, k, dt, nWant, esc, bms, kc),
      { id: sys.id, f: cond.f, k: cond.k, dt, nWant: PERI_WINDOW, esc: ESC, bms: BUDGET_MS, kc: cond.keepCore });
      const w = (r.ok && r.nPeri >= PERI_WINDOW) ? windowStats(r.peri, r.ang, 0, PERI_WINDOW, dt, unitSec) : null;
      const st = { div, dt, ok: r.ok, stopped: r.stopped, nPeri: r.nPeri, steps: r.steps,
        unwrapFailed: r.unwrapFailed, clamp: r.clamp, e: r.eProxy,
        rMaxOverR0: r.rMaxOverR0, rMinOverR0: r.rMinOverR0, mHeld: r.mHeld,
        kFrame: r.kFrame, geoPN: r.geoPN, sampleClass: r.sampleClass, hasMassCal: r.hasMassCal,
        elapsedMs: r.elapsedMs, errors: r.errors || null,
        P: w ? w.P : null, omegaDot: w ? w.W : null, seOmegaDot: w ? w.seW : null };
      cr.stages.push(st);
      console.error(`  ${sys.emoji} ${cond.tag} dt/${div}: P=${st.P === null ? '—' : st.P.toFixed(4)} s`
        + `  ω̇=${st.omegaDot === null ? '—' : st.omegaDot.toFixed(6)} °/yr  e=${st.e === null ? '—' : st.e.toFixed(5)}`
        + `  ${st.stopped}/${st.nPeri}  steps=${st.steps}  [${((Date.now() - tAll) / 1000).toFixed(0)} s]`);
      fs.mkdirSync(path.dirname(OUT), { recursive: true });
      fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
    }
    const g = (key) => cr.stages.map((s) => s[key]);
    if (cr.stages.length >= 3) {
      cr.richardson = { P: richardson3(...g('P')), omegaDot: richardson3(...g('omegaDot')),
        e: richardson3(...g('e')) };
    } else cr.richardson = { P: { ext: null }, omegaDot: { ext: null }, note: '3 段が揃っていない(対照列)' };
    // 判定(**外挿値**で・観測 2 版で)
    cr.verdict = {};
    for (const [nm, o] of Object.entries(obs)) {
      const Pext = cr.richardson.P ? cr.richardson.P.ext : null;
      const Wext = cr.richardson.omegaDot ? cr.richardson.omegaDot.ext : null;
      const Ph4 = cr.stages.length ? cr.stages[cr.stages.length - 1].P : null;
      const Wh4 = cr.stages.length ? cr.stages[cr.stages.length - 1].omegaDot : null;
      cr.verdict[nm] = {
        onExtrapolated: baselineVerdict({ residualP: (Pext !== null && o.P !== null) ? Pext - o.P : null,
          sigmaP: o.sP, residualW: (Wext !== null && o.W !== null) ? Wext - o.W : null, sigmaW: o.sW }),
        onFinestStage: baselineVerdict({ residualP: (Ph4 !== null && o.P !== null) ? Ph4 - o.P : null,
          sigmaP: o.sP, residualW: (Wh4 !== null && o.W !== null) ? Wh4 - o.W : null, sigmaW: o.sW }),
        residPctExtrapolated: { P: (Pext !== null && o.P) ? (Pext - o.P) / o.P * 100 : null,
          omegaDot: (Wext !== null && o.W) ? (Wext - o.W) / o.W * 100 : null },
        residPctFinest: { P: (Ph4 !== null && o.P) ? (Ph4 - o.P) / o.P * 100 : null,
          omegaDot: (Wh4 !== null && o.W) ? (Wh4 - o.W) / o.W * 100 : null } };
    }
    console.error(`  ${sys.emoji} ${cond.tag} 判定(採用レコード・外挿): `
      + `${cr.verdict.adopted.onExtrapolated.verdict}`);
  }
  // (C) 対照との差(h のみ)。**コアの扱いで判定が変わっていないか**を数で残す
  {
    const A = rec.conditions.find((c) => c.tag === 'A_f1');
    const C = rec.conditions.find((c) => c.tag === 'C_f1core');
    const a0 = A && A.stages[0], c0 = C && C.stages[0];
    rec.coreControl = (a0 && c0 && a0.P !== null && c0.P !== null) ? {
      dt: a0.dt, P_A: a0.P, P_C: c0.P, dP: c0.P - a0.P, dPrel: (c0.P - a0.P) / a0.P,
      W_A: a0.omegaDot, W_C: c0.omegaDot,
      dW: (c0.omegaDot !== null && a0.omegaDot !== null) ? c0.omegaDot - a0.omegaDot : null,
      coreMassFrac_C: c0.coreMassFrac, coreMassFracRun_C: c0.coreMassFracRun,
      coupleSink_A: a0.coupleSink, coupleSink_C: c0.coupleSink,
      note: 'f=1 でコア v2 を残すと massFrac=(f−1)/f=0 が実行値域 0.01 へ切り上がる。**その差をここに数で残す**。'
    } : { note: '対照が測れていない' };
  }
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
}

out.meta.spentSec = +((Date.now() - tAll) / 1000).toFixed(1);
out.pageErrors = pageErrors;
await browser.close();
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.error('[w265a-basis] wrote ' + OUT + '  (' + out.meta.spentSec + ' s)');
