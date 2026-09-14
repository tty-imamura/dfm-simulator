// 第262便c(第54報 W3)「🩺 観測版 v2(DDFWHE)—— 差を**先に測る**」。
//
// ■ なぜこの器が要るか(統括が設定した検証仮説 (7))
//   検証仮説 (7) は「🩺 の builder 入力・CSV・obsCard を**同時に**版 v2 へ揃える署名便」を求める。
//   署名便は **121 本のうち 1 本の初期状態を意図して動かす**変更なので、**動かす前に差を測る**。
//   本器は **プリセットを 1 bit も書き換えずに**、版 v2 の入力から作った初期状態を
//   **診断コピー**として組み立てて走らせ、版 v1 との P / e / ω̇ の差を表にする。
//
// ■ 版 v1 と版 v2(どちらも CSV が正本・同じ論文の別の列)
//   v1: Pb = 0.07848804 d = 6781.366656 s(σ 8.64×10⁻⁴ s)・e = 0.063848・ω̇ = 25.79205 °/yr
//   v2: Pb = 0.07848805554 d = 6781.367998656 s(σ 1.728×10⁻⁶ s)・e = 0.0638363(σ 8×10⁻⁷)・ω̇ 同じ
//   **σ が 500 倍きつくなる**ので、**版 v2 に揃えると門(5) の距離は σ 倍で増える**(縮まない)。
//   これは「合格へ近づく変更」ではない —— 測って書く。
//
// ■ 初期状態の作り方(⚡🧮🩺🧶 で共通の転写手続き —— 本器はそれを**再現**するだけ)
//   a = (G M Pb²/4π²)^{1/3}(ケプラー等価)・遠点分離 r_apo = a(1+e)・
//   遠点相対速度 v_apo = √(GM(1−e)/(a(1+e)))・それを較正質量 (f≈2) の重心系へ再配分。
//   **再現できているか**は、版 v1 の入力からプリセットの現在値が**桁一致で戻るか**で自己点検する。
//
// 実行: node tests/exp-w262c-v2delta.mjs [--divs 1,2,4,8]
// 出力: tests/out/v2delta-w262c.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { shiftedRichardson } from './lib-w262c-refint.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const OUT = path.join(ROOT, 'tests', 'out', 'v2delta-w262c.json');
const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(k); return (i >= 0 && argv[i + 1]) ? argv[i + 1] : d; };
const DIVS = arg('--divs', null) ? arg('--divs', '').split(',').map(Number).filter((z) => z > 0) : [1, 2, 4, 8];
const DT0 = 0.016, PERI_WINDOW = 20, YEAR_SEC = 31557600;
const ID = 'psrJ1946DFM', BODY = 'PSR J1946+2052';

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
const all = (b, q, u) => OBS.filter((r) => r.body === b && r.quantity === q && (!u || r.unit === u));
const v1of = (q, u) => all(BODY, q, u).find((r) => !/DDFWHE/.test(r.source)) || null;
const v2of = (q, u) => {
  const z = all(BODY, q, u).filter((r) => /DDFWHE/.test(r.source));
  return z.find((r) => r.sigma !== null) || z[0] || null;
};

const SCALE = { L: 6, T: 1, M: 27 };      // 🩺 の scaleExp(L−T=5 族)
const toM = Math.pow(10, SCALE.L), toS = Math.pow(10, SCALE.T), toKg = Math.pow(10, SCALE.M);
const G_UNIT = 6.674;                      // この単位族の G(規約)

const mPul = all(BODY, 'mass')[0], mCom = all(BODY + ' companion', 'mass')[0];
const m0kg = mPul.value, m1kg = mCom.value;
const M_UNIT = (m0kg + m1kg) / toKg;
const P1 = v1of('orbital_period', 's'), P2 = v2of('orbital_period', 's');
const E1 = v1of('eccentricity'), E2 = v2of('eccentricity');
const W1 = v1of('periastron_advance'), W2 = v2of('periastron_advance');
const A1 = all(BODY, 'semi_major_axis')[0];

// 転写手続き(単位系のなか)。
//   **a は CSV の `semi_major_axis` 行がそのまま正本**である(その行は論文の総質量 2.531858 M☉ と
//   Pb から**レコードの中で**導かれた値で、質量 2 行の和から自分でケプラーを解くと 7.5×10⁻⁶ ずれる
//   —— v1→v2 の差(1.3×10⁻⁷)より 57 倍大きい。**だから a は自分で解き直さない**)。
//   版 v2 の a は、**同じ総質量のまま Pb だけ動いた**ときのケプラー則 a ∝ Pb^{2/3} で CSV の a を送る。
//   遠点速度は **質量 2 行の和**(= プリセットの baseMass の出どころ)で作る —— この組合せだけが
//   プリセットの宣言値を**機械厳密に**再現する(下の selfCheck が 0 になることで機械固定する)。
function transcribe(Psec, e, aUnits) {
  const rApo = aUnits * (1 + e);
  const vApo = Math.sqrt(G_UNIT * M_UNIT * (1 - e) / (aUnits * (1 + e)));
  return { a: aUnits, rApo, vApo };
}
// 較正質量の重心系へ再配分(プリセットの m をそのまま使う —— 質量は版で変わらない)
function barycentric(rApo, vApo, m0, m1) {
  const M = m0 + m1;
  return { x0: -rApo * m1 / M, x1: rApo * m0 / M, vy0: -vApo * m1 / M, vy1: vApo * m0 / M };
}

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
await pg.waitForFunction(() => window.HP && HP.sim);
await pg.addScriptTag({ content: LIB_SRC });

const declared = await pg.evaluate((id) => {
  const p = HP.allPresets().find((q) => q.id === id);
  return { bodies: p.bodies.map((b) => ({ m: b.m, x: b.x, vy: b.vy })),
    massCalibration: p.massCalibration, scaleExp: p.scaleExp };
}, ID);

await pg.evaluate((PERI_WINDOW) => {
  // **診断コピー**(内蔵 JSON は 1 bit も書き換えない)。bodies の x/vy だけ差し替えて走らせる
  window.__w262v2 = (id, over, dt, maxSteps, budgetMs) => {
    const p = HP.allPresets().find((q) => q.id === id);
    const c = JSON.parse(JSON.stringify(p));
    if (over) { c.bodies[0].x = over.x0; c.bodies[1].x = over.x1;
      c.bodies[0].vy = over.vy0; c.bodies[1].vy = over.vy1; }
    const v = HP.validatePreset(c);
    HP.sim.build(v.preset);
    const S = HP.sim, ci = 0, oi = 1;
    const det = createPeriastronDetector({ phaseGate: 1.5 * Math.PI });
    const t0 = performance.now();
    let k = 0, stopped = 'window', accepted = 0, inWindow = false, rMin = Infinity, rMax = -Infinity;
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
    let slope = null;
    if (ang.length >= 3) {
      const tim = ang.map((_, i) => peri[i].k * dt);
      const mt = tim.reduce((s, v2) => s + v2, 0) / tim.length;
      const ma = ang.reduce((s, v2) => s + v2, 0) / ang.length;
      let sxy = 0, sxx = 0;
      for (let i = 0; i < ang.length; i++) { sxy += (tim[i] - mt) * (ang[i] - ma); sxx += (tim[i] - mt) ** 2; }
      if (sxx > 0) slope = sxy / sxx;
    }
    return { steps: k, stopped, measured: full && res.measured, nPeri: res.nPeri,
      unwrapFailed: res.unwrapFailed, nan: S.hasNaN(),
      perMeanSim: perMean, slopeRadPerSimTime: slope,
      eProxy: (rMax > 0 && rMax + rMin > 0) ? (rMax - rMin) / (rMax + rMin) : null,
      x0: S.x[0], x1: S.x[1], vy0: S.vy[0], vy1: S.vy[1] };
  };
}, PERI_WINDOW);

const m0 = declared.bodies[0].m, m1 = declared.bodies[1].m;
const aV1 = A1.value / toM;                                  // CSV の a(版 v1 の Pb から導かれた行)
const aV2 = aV1 * Math.pow(P2.value / P1.value, 2 / 3);      // 同じ総質量で Pb だけ動いたときのケプラー則
const t1 = transcribe(P1.value, E1.value, aV1), t2 = transcribe(P2.value, E2.value, aV2);
const b1 = barycentric(t1.rApo, t1.vApo, m0, m1), b2 = barycentric(t2.rApo, t2.vApo, m0, m1);
// 自己点検: 版 v1 の入力からプリセットの現在値が戻るか
const selfCheck = {
  x0: { declared: declared.bodies[0].x, reproduced: b1.x0, relDiff: (b1.x0 - declared.bodies[0].x) / declared.bodies[0].x },
  vy0: { declared: declared.bodies[0].vy, reproduced: b1.vy0, relDiff: (b1.vy0 - declared.bodies[0].vy) / declared.bodies[0].vy },
  x1: { declared: declared.bodies[1].x, reproduced: b1.x1, relDiff: (b1.x1 - declared.bodies[1].x) / declared.bodies[1].x },
  vy1: { declared: declared.bodies[1].vy, reproduced: b1.vy1, relDiff: (b1.vy1 - declared.bodies[1].vy) / declared.bodies[1].vy },
  aFromCsv: aV1, aV2Scaled: aV2, aRelDiff: (aV2 - aV1) / aV1,
  aKeplerFromMassRows: Math.cbrt(G_UNIT * M_UNIT * Math.pow(P1.value / toS, 2) / (4 * Math.PI * Math.PI)),
  aKeplerRelDiffVsCsv: (Math.cbrt(G_UNIT * M_UNIT * Math.pow(P1.value / toS, 2) / (4 * Math.PI * Math.PI))
    - aV1) / aV1,
  note: '**a は CSV の行が正本**(論文の総質量 2.531858 M☉ 由来)。質量 2 行の和からケプラーを'
    + '解き直すと 7.5×10⁻⁶ ずれる —— v1→v2 の差より 57 倍大きい。この 1 点が「署名便を'
    + '勘で組んではいけない」理由である。' };
console.error('  [自己点検] 版 v1 の入力からの再現 相対差: '
  + ['x0', 'vy0', 'x1', 'vy1'].map((k) => k + ' ' + selfCheck[k].relDiff.toExponential(2)).join(' / ')
  + '  (a は CSV 行が正本)');

const runs = { v1: [], v2: [] };
for (const [tag, over] of [['v1', null], ['v2', b2]]) {
  for (const d of DIVS) {
    const dt = DT0 / d;
    const t0 = Date.now();
    const r = await pg.evaluate(({ id, over, dt, maxSteps, budgetMs }) =>
      window.__w262v2(id, over, dt, maxSteps, budgetMs),
    { id: ID, over, dt, maxSteps: 8e8, budgetMs: 1800000 });
    const wall = (Date.now() - t0) / 1000;
    const P = (r.perMeanSim !== null) ? r.perMeanSim * toS : null;
    const W = (r.slopeRadPerSimTime !== null) ? r.slopeRadPerSimTime * 180 / Math.PI / toS * YEAR_SEC : null;
    runs[tag].push({ div: d, dt, wallSec: +wall.toFixed(2), steps: r.steps, stopped: r.stopped,
      measured: r.measured, nPeri: r.nPeri, unwrapFailed: r.unwrapFailed, nan: r.nan,
      perMeanSec: P, degPerYear: W, eProxy: r.eProxy, initX0: r.x0, initVy0: r.vy0 });
    console.error(`  🩺 [${tag}] h/${d}  步 ${r.steps} ${wall.toFixed(1)} s  P=${P === null ? '—' : P.toFixed(6)} s`
      + `  ω̇=${W === null ? '—' : W.toFixed(5)} °/yr  e=${r.eProxy === null ? '—' : r.eProxy.toFixed(7)}  (${r.stopped})`);
  }
}
const rich = (tag, key) => shiftedRichardson(runs[tag].map((z) => z[key]));
const nsig = (v, o) => (Number.isFinite(v) && o && o.sigma > 0) ? Math.abs(v - o.value) / o.sigma : null;

const summary = {
  inputs: {
    v1: { periodSec: P1.value, periodSigma: P1.sigma, ecc: E1.value, eccSigma: E1.sigma,
      omegaDot: W1 ? W1.value : null, omegaDotSigma: W1 ? W1.sigma : null,
      a: t1.a, rApo: t1.rApo, vApo: t1.vApo, source: P1.source.slice(0, 90) },
    v2: { periodSec: P2.value, periodSigma: P2.sigma, ecc: E2.value, eccSigma: E2.sigma,
      omegaDot: W2 ? W2.value : null, omegaDotSigma: W2 ? W2.sigma : null,
      a: t2.a, rApo: t2.rApo, vApo: t2.vApo, source: P2.source.slice(0, 90) },
    delta: { periodSec: P2.value - P1.value, periodRel: (P2.value - P1.value) / P1.value,
      ecc: E2.value - E1.value, eccRel: (E2.value - E1.value) / E1.value,
      sigmaRatioPeriod: (P1.sigma && P2.sigma) ? P1.sigma / P2.sigma : null,
      a: t2.a - t1.a, aRel: (t2.a - t1.a) / t1.a,
      rApo: t2.rApo - t1.rApo, rApoRel: (t2.rApo - t1.rApo) / t1.rApo,
      vApo: t2.vApo - t1.vApo, vApoRel: (t2.vApo - t1.vApo) / t1.vApo } },
  bodiesV1: b1, bodiesV2: b2, declaredBodies: declared.bodies, selfCheck,
  measured: {
    v1: { stages: runs.v1.map((z) => z.perMeanSec), richardsonP: rich('v1', 'perMeanSec'),
      richardsonW: rich('v1', 'degPerYear'), eFinest: runs.v1.length ? runs.v1[runs.v1.length - 1].eProxy : null },
    v2: { stages: runs.v2.map((z) => z.perMeanSec), richardsonP: rich('v2', 'perMeanSec'),
      richardsonW: rich('v2', 'degPerYear'), eFinest: runs.v2.length ? runs.v2[runs.v2.length - 1].eProxy : null } },
};
const pv1 = summary.measured.v1.richardsonP.yInf, pv2 = summary.measured.v2.richardsonP.yInf;
summary.verdict = {
  deltaPinfSec: (Number.isFinite(pv1) && Number.isFinite(pv2)) ? pv2 - pv1 : null,
  nSigmaV1againstV1obs: nsig(pv1, P1), nSigmaV1againstV2obs: nsig(pv1, P2),
  nSigmaV2againstV2obs: nsig(pv2, P2),
  deltaOmegaDot: (Number.isFinite(summary.measured.v2.richardsonW.yInf)
    && Number.isFinite(summary.measured.v1.richardsonW.yInf))
    ? summary.measured.v2.richardsonW.yInf - summary.measured.v1.richardsonW.yInf : null,
  deltaEccProxy: (Number.isFinite(summary.measured.v2.eFinest) && Number.isFinite(summary.measured.v1.eFinest))
    ? summary.measured.v2.eFinest - summary.measured.v1.eFinest : null,
  note: '**版 v2 に揃えても門(5) は近づかない** —— y∞ は 10⁻³ s 級しか動かないのに、'
    + 'σ が 500 倍きつくなるので σ 倍の距離はむしろ増える。**「v2 にすれば合う」とは書けない。**' };

const out = { meta: { wave: '第262便c', target: TARGET, sample: '🩺 psrJ1946DFM', divs: DIVS,
  window: '最初の 20 近点(19 区間)', extractor: 'radial-crossing/orbit-phase-1.5pi-v1',
  touched: '**プリセット JSON は 1 bit も書き換えていない。** 版 v2 側は**診断コピー**'
    + '(bodies の x/vy だけ差し替えたコピー)で走らせた —— 署名便は行っていない。',
  blastRadius: ['beta/index.html: 🩺 psrJ1946DFM の bodies(x/vy)',
    'beta/index.html: 🩺 を複製した variant 🪀 psrJ1946PN・🩹 psrJ1946CF の bodies(同じ初期状態を持つ)',
    'beta/index.html: 🩺 の obsCard / descStruct / failureFirst の実測数値(P・e・近点移動)',
    'beta/index.html: 🩺 の claims の expected 窓と descPattern',
    'tests/qa.mjs: 近点間 P の期待値表(psrJ1946DFM 6780.92 / psrJ1946PN 6780.50 など)',
    'tests/qa.mjs: 121 本の 600 步ビット指紋(署名便として 1 本だけ動く)',
    'paper/data/solar-observations.csv: semi_major_axis の版 v2 行(現在は v1 行のみ)',
    'docs/CALIBRATION_VERDICT_v1.44.md §2.1 / §5 の 🩺 行・docs/SAMPLE_RANKING.md・docs/PHYSICS.md'],
  notDone: '**本便では署名便を実施していない。** 上の blastRadius が 8 か所・変更する実測数値が 20 以上あり、'
    + 'その全部を測り直して揃えるには本便の走行予算に収まらない。**差だけを先に測って置く**'
    + '(検証仮説 (7) の「同時に揃える」条件は、揃える先の数値がこの表で確定してから満たす)。' },
  summary, runs, pageErrors };

await browser.close();
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.error('[w262c-v2delta] wrote ' + OUT);
console.error(`  ΔP∞ ${summary.verdict.deltaPinfSec === null ? '—' : summary.verdict.deltaPinfSec.toExponential(4)} s`
  + ` / σ 倍 v1→v1obs ${summary.verdict.nSigmaV1againstV1obs === null ? '—' : summary.verdict.nSigmaV1againstV1obs.toExponential(3)}`
  + ` / v2→v2obs ${summary.verdict.nSigmaV2againstV2obs === null ? '—' : summary.verdict.nSigmaV2againstV2obs.toExponential(3)}`);
