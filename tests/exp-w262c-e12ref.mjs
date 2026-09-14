// 第262便c(第54報 W3)「📻 の E12 と標準二体相対 1PN の対照」。
//
// ■ 何を測るか(統括の読み (C))
//   📻 psrDoubleAB(kFrame=0・f=1・観測転写)の近点移動は **2.82 °/yr** で、同じ転写量から
//   出る**標準二体相対 1PN の 16.87 °/yr の約 1/6** である。〔第220便〕以来サンプルのカードは
//   「約 1/6」と**宣言**してきたが、**比べる相手の側を自前で積分した記録が無かった**。
//   本器は同じ初期状態・同じ定数で **3 つの式**を**同じ RK4・同じ抽出器**に通して並べる:
//     (a) **現行 E12 の式**(エンジンの kFrame=0・geoPN=2 経路 —— 各源のポテンシャル ∇U_j と
//         **個々の粒子の速度 v_i** で組み、∇U_j 因子の**対反作用**を源へ返す)
//     (b) **標準二体相対 1PN**(Blanchet Living Rev. §9.3・調和座標 EIH —— **相対**座標 r=x_A−x_B と
//         **相対**速度 v=v_A−v_B だけで組む。ν=m_Am_B/M² が入る)
//     (c) **ソフトニング付きニュートン**(ε=0.05 —— 数値床。ソフトニングによる**逆行**がここに出る)
//   さらに **c の規約**(cLight=3000 = 3×10⁸ m/s)と**厳密値** 2997.92458 の差(c⁻² で 0.138%)を
//   別欄で測る —— **dt 誤差に混ぜない**。
//
// ■ 書かないこと(最重要)
//   **エンジンの E12 を二体相対 1PN に置き換えない。** 本器は**対照**であって置換ではない。
//   「1PN の式に直せば合う」とも書かない —— (b) の P も観測 P から 0.269 s 離れている(下の表)。
//   置換するなら**明示キー + 署名便 + 対照試験**が要る(決断事項候補)。
//
// 実行: node tests/exp-w262c-e12ref.mjs
// 出力: tests/out/e12ref-w262c.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { createPeriastronDetector } from './lib-precision-diagnostics.mjs';
import { forceDfmE12kF0, forceRelative1PN, forceNewtonSoft, runReference, shiftedRichardson }
  from './lib-w262c-refint.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const OUT = path.join(ROOT, 'tests', 'out', 'e12ref-w262c.json');
const PERI_WINDOW = 20;
const YEAR_SEC = 31557600;
const C_EXACT = 2997.92458;   // 単位 10⁶m/10¹s での真空光速(規約値 3000 との差を測るため)

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
const pick = (b, q, u) => OBS.find((r) => r.body === b && r.quantity === q && (!u || r.unit === u)) || null;

const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let browser;
try { browser = await req('playwright').chromium.launch(); }
catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }
const pg = await browser.newPage();
await pg.goto('file://' + path.join(ROOT, TARGET), { waitUntil: 'load' });
await pg.waitForFunction(() => window.HP && HP.sim);

// **エンジンが保持している初期状態そのもの**を読む(質量は Float32 のまま — 丸めを揃える)
const st = await pg.evaluate(() => {
  const p = HP.allPresets().find((q) => q.id === 'psrDoubleAB');
  const v = HP.validatePreset(JSON.parse(JSON.stringify(p)));
  HP.sim.build(v.preset);
  const S = HP.sim, q = S.params;
  return { x: [S.x[0], S.x[1]], y: [S.y[0], S.y[1]], vx: [S.vx[0], S.vx[1]], vy: [S.vy[0], S.vy[1]],
    m: [S.m[0], S.m[1]], pnOv: [S.pnOv[0], S.pnOv[1]], n: S.n,
    G: q.G, eps: q.softening, cLight: q.cLight, lambdaPN: q.lambdaPN, pnAlpha: q.pnAlpha,
    geoPN: q.geoPN, kFrame: q.kFrame, scaleT: p.scaleExp.T };
});
await browser.close();

const TOSEC = Math.pow(10, Number(st.scaleT));
const obsP = pick('PSR J0737-3039 B', 'orbital_period', 's');
const obsW = pick('PSR J0737-3039 B', 'periastron_advance');
const obsE = pick('PSR J0737-3039 B', 'eccentricity');
const z0 = [st.x[0], st.y[0], st.x[1], st.y[1], st.vx[0], st.vy[0], st.vx[1], st.vy[1]];
const mkSy = (c) => ({ G: st.G, eps: st.eps, m: st.m, invC2: st.lambdaPN / (c * c),
  cA: 1 + 2 * st.pnAlpha, cB: st.pnAlpha - 0.5, pnSource: st.pnOv });

const LAWS = [
  { key: 'E12kF0', force: forceDfmE12kF0, c: st.cLight,
    label: '現行 E12(エンジンの kFrame=0・geoPN=2 経路 —— 各源の ∇U_j と個々の v_i・対反作用)' },
  { key: 'relative1PN', force: forceRelative1PN, c: st.cLight,
    label: '標準二体相対 1PN(Blanchet §9.3・調和座標 —— 相対 r と相対 v・ν 依存)' },
  { key: 'newtonSoft', force: forceNewtonSoft, c: st.cLight,
    label: 'ソフトニング付きニュートン(ε=0.05 —— 数値床。逆行がここに出る)' },
  { key: 'E12kF0-cExact', force: forceDfmE12kF0, c: C_EXACT,
    label: '現行 E12 を c=2997.92458(厳密値)で —— **規約 c=3000 との差を dt 誤差に混ぜないための別欄**' },
  { key: 'relative1PN-cExact', force: forceRelative1PN, c: C_EXACT,
    label: '相対 1PN を c=2997.92458 で(同上)' },
];

const P0 = obsP.value / TOSEC;
const rows = [];
for (const L of LAWS) {
  const stages = [];
  for (const nPerOrbit of [400, 800, 1600, 3200]) {
    const dt = P0 / nPerOrbit;
    const r = runReference({ force: L.force, sy: mkSy(L.c), z0, dt, window: PERI_WINDOW,
      detFactory: () => createPeriastronDetector({ phaseGate: 1.5 * Math.PI }),
      maxSteps: 6e7, budgetMs: 180000 });
    stages.push({ nPerOrbit, dt, steps: r.steps, stopped: r.stopped, measured: r.measured,
      perMeanSec: (r.perMeanSim !== null) ? r.perMeanSim * TOSEC : null,
      degPerYear: (r.slopeRadPerSimTime !== null)
        ? r.slopeRadPerSimTime * 180 / Math.PI / TOSEC * YEAR_SEC : null,
      seDegPerYear: (r.seRadPerSimTime !== null)
        ? r.seRadPerSimTime * 180 / Math.PI / TOSEC * YEAR_SEC : null,
      wallSec: +r.wallSec.toFixed(2) });
  }
  const P = stages.map((z) => z.perMeanSec), W = stages.map((z) => z.degPerYear);
  const last = stages[stages.length - 1];
  rows.push({ key: L.key, label: L.label, c: L.c, stages,
    richardson: { P: shiftedRichardson(P), degPerYear: shiftedRichardson(W) },
    finest: { perMeanSec: last.perMeanSec, degPerYear: last.degPerYear },
    obs: { periodResidualSec: last.perMeanSec - obsP.value,
      periodNSigma: (obsP.sigma > 0) ? Math.abs(last.perMeanSec - obsP.value) / obsP.sigma : null,
      omegaDotResidual: (obsW && Number.isFinite(obsW.value)) ? last.degPerYear - obsW.value : null,
      omegaDotNSigma: (obsW && obsW.sigma > 0) ? Math.abs(last.degPerYear - obsW.value) / obsW.sigma : null } });
  console.error(`  [${L.key}] P=${last.perMeanSec.toFixed(9)} s  ω̇=${last.degPerYear.toFixed(9)} °/yr`
    + `  (観測 P ${(last.perMeanSec - obsP.value).toFixed(6)} s)`);
}

const get = (k) => rows.find((r) => r.key === k);
const e12 = get('E12kF0'), rel = get('relative1PN'), nw = get('newtonSoft');
const cEx = get('E12kF0-cExact'), relEx = get('relative1PN-cExact');
const ratio = (e12.finest.degPerYear && rel.finest.degPerYear)
  ? e12.finest.degPerYear / rel.finest.degPerYear : null;

const out = { meta: { wave: '第262便c', target: TARGET, sample: 'psrDoubleAB(📻)', toSec: TOSEC,
  state: st, window: '最初の 20 近点(19 区間)', yearSec: YEAR_SEC,
  extractor: 'radial-crossing/orbit-phase-1.5pi-v1(**3 つの式すべてに同じもの**を通した)',
  integrator: '古典 RK4(Float64)。刻みは P_obs/400 … P_obs/3200 の 4 段。',
  notReplacement: '**エンジンの E12 は 1 bit も変えていない。** 本器は**対照**であって置換ではない。'
    + '置換するなら明示キー(例 `pnForm`)+ 署名便 + 対照試験が要る —— 決断事項候補である。',
  cNote: 'cLight=3000 は L6/T1 で 3×10⁸ m/s。厳密値 2997.92458 との差は c⁻² で 0.138% で、'
    + '**この差は dt 誤差ではない**(別欄で測る)。' },
  laws: rows,
  summary: {
    e12DegPerYear: e12.finest.degPerYear, rel1PNDegPerYear: rel.finest.degPerYear,
    newtonDegPerYear: nw.finest.degPerYear,
    ratioE12overRel1PN: ratio, inverseRatio: ratio ? 1 / ratio : null,
    e12PeriodSec: e12.finest.perMeanSec, rel1PNPeriodSec: rel.finest.perMeanSec,
    newtonPeriodSec: nw.finest.perMeanSec, obsPeriodSec: obsP.value, obsPeriodSigma: obsP.sigma,
    obsEcc: obsE ? obsE.value : null,
    cExactDeltaDegPerYear: cEx.finest.degPerYear - e12.finest.degPerYear,
    cExactDeltaPeriodSec: cEx.finest.perMeanSec - e12.finest.perMeanSec,
    cExactRelPct: 100 * (cEx.finest.degPerYear - e12.finest.degPerYear) / e12.finest.degPerYear,
    relExactDeltaDegPerYear: relEx.finest.degPerYear - rel.finest.degPerYear,
    note: '**どちらの式も観測 P からは離れている**(E12 +0.24 s 級・相対 1PN +0.27 s 級 = いずれも 10⁵〜10⁶σ)。'
      + '「1PN の式に直せば合う」とは書けない。' } };

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.error('[w262c-e12ref] wrote ' + OUT);
console.error(`  ω̇: E12 ${e12.finest.degPerYear.toFixed(6)} / 相対1PN ${rel.finest.degPerYear.toFixed(6)}`
  + ` / ニュートン(ε) ${nw.finest.degPerYear.toFixed(6)}  → 比 ${ratio.toFixed(6)}(= 1/${(1 / ratio).toFixed(4)})`);
