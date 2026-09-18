// 第264便a(第56報 W1)「**0.7 固定の転用試験**」。
//
// ■ この器が答える 1 つの問い
//   「geoPN=2・kFrame=0.7・f=1.7 を**1 系で決めて他系へそのまま写す**と、P と ω̇ はどれだけ外れるか」。
//   —— 共同根(`tests/exp-w264a-kjoint.mjs`)が系ごとの (k*, f*) を出すのに対し、こちらは
//   **固定した 1 組を 4 系へ転用したときの残差**を測る。統括の予備測定(J1757 −14%・J1946 +11%・
//   B1534 は逆行)を**同じ器で再現できるか**を確かめるのが目的である。
//
// ■ 段
//   dt = 0.016(h)・0.008(h/2)・0.004(h/4) の 3 段。3 段が揃った量には
//   観測次数 p_obs=log₂|(Q_h−Q_{h/2})/(Q_{h/2}−Q_{h/4})| と Richardson 外挿
//   Q_ext=Q_{h/4}+(Q_{h/4}−Q_{h/2})/(2^p−1) を出す(第255便d の規約と同じ)。
//   **p_obs が正でない量には外挿を書かない**(漸近域に居ないので補正できない)。
//
// ■ ω̇ の符号の切り分け(**逆行が出た系だけ**)
//   (a) coupleSink: コア v2 を残す(coupleSink:"core")/ 外して "reservoir" にする の 2 走行。
//   (b) builder: DFM 版(⚡ の処方)/ 観測版(📿 など・f と kFrame だけを当てる)の 2 走行。
//   (c) 初期条件・窓: 40 近点を採り、**近点 1–20 と 21–40 の 2 つの窓**で別々に回帰する
//       (初期条件由来の過渡なら窓を後ろへずらすと符号が変わる)。
//
// ■ 触らないもの
//   `beta/index.html` は**読むだけ**。本体プリセットの JSON は 1 bit も変えない。
//   `S._core` には 1 命令も足していない。
//
// 実行: node tests/exp-w264a-fixed07.mjs [--k 0.7] [--f 1.7] [--divs 1,2,4] [--only id,...]
// 出力: tests/out/fixed07-w264a.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + path.join(ROOT, TARGET);
const OUT = path.join(ROOT, 'tests', 'out', 'fixed07-w264a.json');
const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(k); return (i >= 0 && argv[i + 1]) ? argv[i + 1] : d; };
const K_FIX = Number(arg('--k', 0.7));
const F_FIX = Number(arg('--f', 1.7));
const DIVS = arg('--divs', '1,2,4').split(',').map(Number).filter((z) => z > 0);
const DT0 = 0.016;
const PERI_WINDOW = 20;
const YEAR_SEC = 31557600;

const SYSTEMS = [
  { id: 'psrDoubleABDFM', emoji: '⚡', label: 'J0737−3039A/B', obsId: 'psrDoubleAB',
    csvBody: 'PSR J0737-3039 B', solution: 'Kramer2021-DDS' },
  { id: 'psrJ1757DFM', emoji: '🧮', label: 'J1757−1854', obsId: null,
    csvBody: 'PSR J1757-1854', solution: 'Singha2026-DDH' },
  { id: 'psrJ1946DFM', emoji: '🩺', label: 'J1946+2052', obsId: null,
    csvBody: 'PSR J1946+2052', solution: 'Meng2025-DDFWHE' },
  { id: 'psrB1534DFM', emoji: '🧶', label: 'B1534+12', obsId: 'psrB1534',
    csvBody: 'PSR B1534+12', solution: 'Fonseca2014-DDGR' },
];
const ONLY = (() => { const s = arg('--only', null); return s ? s.split(',') : null; })();

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
  // nWant 近点まで走り、**任意の窓で回帰できるよう近点の (k, θ) を全部返す**
  window.__w264aRunW = (srcId, f, kFrame, dt, nWant, keepCore, budgetMs) => {
    const src = HP.allPresets().find((q) => q.id === srcId);
    if (!src) return { ok: false, errors: ['no such preset: ' + srcId] };
    const pd = psrMassScaled(src, f, { kFrame, keepCore, id: 'w264aFix' });
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
      if (inWin) { if (rr < rMin) rMin = rr; if (rr > rMax) rMax = rr; }
      const a = det.push(k, rr, rd, th);
      if (a.accepted) { nPeri++; inWin = true; }
      if (nPeri >= nWant) { stopped = 'window'; break; }
      if (rr > 4 * r00) { stopped = 'escape'; break; }
      if (S.hasNaN()) { stopped = 'nan'; break; }
      if ((k & 65535) === 0 && (performance.now() - t0) > budgetMs) { stopped = 'time-budget'; break; }
    }
    const res = det.result(nWant);
    return { ok: true, steps: k, stopped, nan: S.hasNaN(), nPeri: res.nPeri,
      unwrapFailed: res.unwrapFailed,
      peri: (res.peri || []).map((p) => p.k), ang: (res.ang || []).slice(),
      clamp: (S.clampVN || 0) + (S.clampSN || 0) + (S.clampHN || 0) + (S.clampRN || 0) + (S.clampTN || 0),
      r0: r00, eProxy: (rMax > 0 && rMax + rMin > 0) ? (rMax - rMin) / (rMax + rMin) : null,
      coupleSink: v.preset.physics.coupleSink, kFrame: v.preset.physics.kFrame,
      geoPN: v.preset.physics.geoPN, sampleClass: v.preset.sampleClass,
      mHeld: [S.m[ci], S.m[oi]] };
  };
});

// 窓 [i0, i0+n) の平均近点間隔と方位の実時刻回帰
function windowStats(peri, ang, i0, n, dt, unitSec) {
  if (!peri || peri.length < i0 + n) return null;
  const P = (peri[i0 + n - 1] - peri[i0]) * dt / (n - 1) * unitSec;
  const xs = [], ys = [];
  for (let i = i0; i < i0 + n; i++) { xs.push(peri[i] * dt); ys.push(ang[i]); }
  const m = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / m, my = ys.reduce((a, b) => a + b, 0) / m;
  let sxy = 0, sxx = 0;
  for (let i = 0; i < m; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; }
  if (!(sxx > 0)) return { P, W: null };
  const slope = sxy / sxx;
  const se = Math.sqrt(ys.reduce((s, y, i) => s + (y - (my + slope * (xs[i] - mx))) ** 2, 0) / (m - 2) / sxx);
  return { P, W: slope * 180 / Math.PI / unitSec * YEAR_SEC,
    seW: se * 180 / Math.PI / unitSec * YEAR_SEC };
}
// 3 段の観測次数と Richardson 外挿。**p が正でなければ外挿しない**
function richardson(qh, qh2, qh4) {
  if (![qh, qh2, qh4].every(Number.isFinite)) return { p: null, ext: null, note: '3 段が揃っていない' };
  const d1 = qh - qh2, d2 = qh2 - qh4;
  if (!(Math.abs(d2) > 0)) return { p: null, ext: null, note: '2 段目と 3 段目の差が 0' };
  const p = Math.log2(Math.abs(d1 / d2));
  if (!(p > 0)) return { p, ext: null, note: '**観測次数が正でない** — 漸近域に居ないので外挿しない' };
  return { p, ext: qh4 + (qh4 - qh2) / (Math.pow(2, p) - 1), note: null };
}

const out = { meta: { wave: '第264便a', target: TARGET, kFixed: K_FIX, fFixed: F_FIX, divs: DIVS,
  dt0: DT0, periWindow: PERI_WINDOW, yearSec: YEAR_SEC,
  claim: '**0.7 と 1.7 を固定して 4 系へ転用したときの残差**である。較正ではない。'
    + '「kFrame≈0.7 を採用した」とは書かない。',
  touched: '本体プリセットの JSON は 1 bit も変えない(走行用のコピーをページ内で作る)。' },
  rows: [], controls: [], pageErrors: [] };

const tAll = Date.now();
for (const sys of SYSTEMS) {
  if (ONLY && !ONLY.includes(sys.id)) continue;
  const unitSec = await pg.evaluate((id) => Math.pow(10,
    Number(HP.allPresets().find((q) => q.id === id).scaleExp.T)), sys.id);
  const obs = {
    adopted: { P: toSec(firstRow(sys.csvBody, 'orbital_period')),
      sP: sigSec(firstRow(sys.csvBody, 'orbital_period')),
      W: (firstRow(sys.csvBody, 'periastron_advance') || {}).value ?? null,
      sW: (firstRow(sys.csvBody, 'periastron_advance') || {}).sigma ?? null },
    solution: { P: toSec(solRow(sys.csvBody, 'orbital_period', sys.solution)),
      sP: sigSec(solRow(sys.csvBody, 'orbital_period', sys.solution)),
      W: (solRow(sys.csvBody, 'periastron_advance', sys.solution) || {}).value ?? null,
      sW: (solRow(sys.csvBody, 'periastron_advance', sys.solution) || {}).sigma ?? null },
  };
  const rec = { id: sys.id, emoji: sys.emoji, label: sys.label, obs, stages: [] };
  out.rows.push(rec);
  for (const div of DIVS) {
    const dt = DT0 / div;
    const r = await pg.evaluate(({ id, f, k, dt }) =>
      window.__w264aRunW(id, f, k, dt, 20, true, 300000),
    { id: sys.id, f: F_FIX, k: K_FIX, dt });
    const w = r.ok ? windowStats(r.peri, r.ang, 0, PERI_WINDOW, dt, unitSec) : null;
    const st = { div, dt, ok: r.ok, stopped: r.stopped, nPeri: r.nPeri, steps: r.steps,
      unwrapFailed: r.unwrapFailed, clamp: r.clamp, e: r.eProxy, coupleSink: r.coupleSink,
      P: w ? w.P : null, omegaDot: w ? w.W : null, seOmegaDot: w ? w.seW : null };
    for (const [nm, o] of Object.entries(obs)) {
      st['res_' + nm] = { Ppct: (st.P !== null && o.P) ? (st.P - o.P) / o.P * 100 : null,
        PSigma: (st.P !== null && o.sP) ? (st.P - o.P) / o.sP : null,
        Wpct: (st.omegaDot !== null && o.W) ? (st.omegaDot - o.W) / o.W * 100 : null,
        WSigma: (st.omegaDot !== null && o.sW) ? (st.omegaDot - o.W) / o.sW : null };
    }
    rec.stages.push(st);
    console.error(`  ${sys.emoji} ${sys.label} dt/${div}: P=${st.P === null ? '—' : st.P.toFixed(4)} s`
      + ` (${st.res_adopted.Ppct === null ? '—' : st.res_adopted.Ppct.toFixed(3)}%)`
      + `  ω̇=${st.omegaDot === null ? '—' : st.omegaDot.toFixed(6)} °/yr`
      + ` (${st.res_adopted.Wpct === null ? '—' : st.res_adopted.Wpct.toFixed(2)}%)`
      + `  e=${st.e === null ? '—' : st.e.toFixed(6)}  ${st.stopped}  [${((Date.now() - tAll) / 1000).toFixed(0)} s]`);
  }
  const g = (key) => rec.stages.map((s) => s[key]);
  if (rec.stages.length >= 3) {
    rec.richardson = { P: richardson(...g('P')), omegaDot: richardson(...g('omegaDot')) };
    for (const [nm, o] of Object.entries(obs)) {
      const rp = rec.richardson.P.ext, rw = rec.richardson.omegaDot.ext;
      rec.richardson['res_' + nm] = {
        Ppct: (rp !== null && o.P) ? (rp - o.P) / o.P * 100 : null,
        PSigma: (rp !== null && o.sP) ? (rp - o.P) / o.sP : null,
        Wpct: (rw !== null && o.W) ? (rw - o.W) / o.W * 100 : null,
        WSigma: (rw !== null && o.sW) ? (rw - o.W) / o.sW : null };
    }
  }
  rec.omegaDotSignNegative = rec.stages.some((s) => s.omegaDot !== null && s.omegaDot < 0);
}

// ---- ω̇ の符号の切り分け(逆行が出た系・および 🧶 は必ず)
const needCtl = out.rows.filter((r) => r.omegaDotSignNegative || r.id === 'psrB1534DFM');
for (const rec of needCtl) {
  const sys = SYSTEMS.find((s) => s.id === rec.id);
  const unitSec = await pg.evaluate((id) => Math.pow(10,
    Number(HP.allPresets().find((q) => q.id === id).scaleExp.T)), sys.id);
  const ctl = { id: sys.id, emoji: sys.emoji, runs: [] };
  out.controls.push(ctl);
  const one = async (tag, srcId, keepCore, nWant, dt) => {
    const r = await pg.evaluate(({ srcId, f, k, dt, nWant, keepCore }) =>
      window.__w264aRunW(srcId, f, k, dt, nWant, keepCore, 300000),
    { srcId, f: F_FIX, k: K_FIX, dt, nWant, keepCore });
    const w1 = r.ok ? windowStats(r.peri, r.ang, 0, Math.min(20, r.nPeri), dt, unitSec) : null;
    const w2 = (r.ok && r.nPeri >= 40) ? windowStats(r.peri, r.ang, 20, 20, dt, unitSec) : null;
    const rr = { tag, srcId, keepCore, dt, nWant, ok: r.ok, stopped: r.stopped, nPeri: r.nPeri,
      coupleSink: r.coupleSink, unwrapFailed: r.unwrapFailed, e: r.eProxy,
      win1: w1, win2: w2, errors: r.errors || null };
    ctl.runs.push(rr);
    console.error(`  [切り分け] ${sys.emoji} ${tag}: 窓1 ω̇=${w1 && w1.W !== null ? w1.W.toFixed(6) : '—'}`
      + `  窓2 ω̇=${w2 && w2.W !== null ? w2.W.toFixed(6) : '—'}  sink=${r.coupleSink}  ${r.stopped}`);
    return rr;
  };
  await one('(a) coupleSink=core(DFM 版・既定)', sys.id, true, 40, DT0);
  await one('(a′) coupleSink=reservoir(コアを外す)', sys.id, false, 40, DT0);
  if (sys.obsId) await one('(b) 観測版 builder', sys.obsId, false, 40, DT0);
  await one('(c) 窓を後ろへ(40 近点・窓 21–40)', sys.id, true, 40, DT0 / 2);
}

out.meta.spentSec = +((Date.now() - tAll) / 1000).toFixed(1);
out.pageErrors = pageErrors;
await browser.close();
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.error('[w264a-fixed07] wrote ' + OUT + '  (' + out.meta.spentSec + ' s)');
