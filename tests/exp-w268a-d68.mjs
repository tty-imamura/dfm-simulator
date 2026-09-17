// 第268便a(第58報 W1・統括の読み (A)): **📡 D68 の 3 段(h / h2 / h4)**。
//
// ■ なぜ走らせるか
//   第266便a は「換算していない σ で 📡 が偽の合(3σ)になる」ところを切断点 `unit-not-converted` で
//   止めた。統括の読み (A) は **その換算を入れても「合(3σ)」とは言えない**ことを数で置いた
//   (同じ近点窓の近点間周期で換算すると **−14.6221σ**・周期行なら **+81.1169σ**・丸めた観測周期なら
//   **+64.2909σ** —— **どの P を使うかで符号まで変わる**)。本器はその**手前の条件**を測る:
//   **換算後の量 ϖ̇ [deg/yr] が刻みに対して収束しているか**(2 段の |Q_h−Q_{h/2}| は誤差上限ではない)。
//
// ■ 第269便a(第59報 W1・統括の読み (E))で直したもの —— **窓の不一致(契約未達)**
//   第268便a のこの器は、**分子 Δϖ を最初の 58 近点**から、**分母 P_peri を最初の 20 近点**から
//   作っていた。同じ走行・同じ検出器でも**同じ近点集合ではない**ので、この器が自分で宣言した
//   換算契約(「分子と同じ窓の周期で割る」)を満たしていなかった。第269便a で
//   **周期も傾きと同じ最初の nFit 近点(57 区間)の平均**に直し(`tests/lib-w269a-periwindow.mjs`)、
//   **h/h2/h4 を新契約で再走**した。旧契約(20 近点窓)の 3 段は `previous` 欄に**対照として**残す
//   —— **旧値を新値として写さない**ためである。
//
// ■ 宣言(窓と抽出器 —— 3 段で同じものを使う)
//   ・窓: t ∈ [0, T]、**T = 10698.816(シミュレータ時間)**。これは第249便b の h 段(dt=0.016・
//     668676 步)と同じ終了時刻である。**步数ではなく時刻を揃える**。
//   ・抽出器: 近点 = ṙ の −→+ 交差(検出器 A・線形内挿)。近点方位を unwrap して**近点番号**に
//     線形 fit した傾きが Δϖ [deg/周]。**3 段とも最初の N=58 近点**で fit する(同じ窓)。
//   ・近点間周期 P_peri = **その 58 近点(57 区間)**の平均 × 10^scaleExp.T(第269便a の新契約)。
//     窓が埋まらない・unwrap が中断したときは**短い窓へ置換せず** `perMeanSim=null`・
//     `windowComplete=false` にする(未測定と書く)。
//   ・換算: ϖ̇ = Δϖ × 31557600 / P_peri [deg/yr](**分子と同じ窓の周期で割る**)。
//
// ■ この器が**しないこと**
//   ・`beta/index.html` を書き換えない(読むだけ)。`S._core` に 1 命令も足さない。
//   ・CSV の値を 1 文字も触らない。観測値と σ は `paper/data/solar-observations.csv` から読む。
//   ・**合否を言わない**。3 段が揃っても、判定は門(`tests/exp-w249b-calaudit.mjs`)の仕事である。
//
// 実行: PLAYWRIGHT_CORE_DIR=… node tests/exp-w268a-d68.mjs [--t 10698.816] [--divs 1,2,4]
// 出力: tests/out/d68-w268a.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { precessionDegPerYear, YEAR_SEC } from './lib-w268a-judgement.mjs';
import { fitPeriastronStage } from './lib-w269a-periwindow.mjs';
import { isSigmaPrimaryVerified } from './lib-w264d-sigmamark.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + path.join(ROOT, TARGET);
const OUT = path.join(ROOT, 'tests', 'out', 'd68-w268a.json');
const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(k); return (i >= 0 && argv[i + 1]) ? argv[i + 1] : d; };
const DT0 = 0.016;
const T_END = Number(arg('--t', 10698.816));      // 第249便b の h 段(668676 步 × 0.016)と同じ終了時刻
const DIVS = String(arg('--divs', '1,2,4')).split(',').map(Number);
const LEGACY_WINDOW = 20;                          // 第252便b の固定窓(**旧契約の対照としてだけ残す**)
const FIT_PERI = Number(arg('--fit-peri', 58));    // 3 段で共通の fit 窓(傾きも周期もこの窓で作る)
const ID = 'saturnZonalD68', LABEL = 'D68';

// ---- 観測(CSV が正本 —— この器に観測数値を 1 つも書かない)
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
const OBS = (() => {
  const txt = fs.readFileSync(path.join(ROOT, 'paper', 'data', 'solar-observations.csv'), 'utf8');
  for (const line of txt.split('\n')) {
    if (!line.trim() || line.startsWith('body,')) continue;
    const c = parseCsvLine(line);
    if (c[0] !== 'Saturn ring feature D68' || c[1] !== 'periastron_advance') continue;
    const sg = (c[8] || '').trim() !== '' ? Number(c[8]) : null;
    return { body: c[0], quantity: c[1], value: Number(c[2]), unit: c[3],
      source: String(c[4]).slice(0, 90), sigma: (Number.isFinite(sg) && sg > 0) ? sg : null,
      primaryVerified: isSigmaPrimaryVerified(c[7] || '') };
  }
  return null;
})();
if (!OBS || OBS.sigma === null) { console.error('[w268a-d68] CSV に D68 の ω̇ 行と σ が無い'); process.exit(2); }

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

// ---- ページ側の抽出器(第249便b の検出器 A と同じ手続き。**本体には入れない**)
await pg.evaluate(() => {
  window.__w268aRun = (id, dt, tEnd) => {
    const p = HP.allPresets().find((q) => q.id === id);
    if (!p) return { ok: false, error: 'no such preset: ' + id };
    const v = HP.validatePreset(JSON.parse(JSON.stringify(p)));
    if (!v.ok) return { ok: false, error: 'validate: ' + (v.errors || []).join(' / ') };
    HP.sim.build(v.preset);
    const S = HP.sim, ci = 0, oi = 1;
    const G = Number(v.preset.physics.G);
    // t=0 の接触要素(重複除去の基準周期にだけ使う — 判定には使わない)
    const dx0 = S.x[oi] - S.x[ci], dy0 = S.y[oi] - S.y[ci];
    const dvx0 = S.vx[oi] - S.vx[ci], dvy0 = S.vy[oi] - S.vy[ci];
    const r0 = Math.hypot(dx0, dy0), v20 = dvx0 * dvx0 + dvy0 * dvy0;
    const mu = G * (S.m[ci] + S.m[oi]);
    const inv0 = 2 / r0 - v20 / mu, a0 = (inv0 !== 0) ? 1 / inv0 : NaN;
    const pRef = (a0 > 0) ? 2 * Math.PI * Math.sqrt(a0 * a0 * a0 / mu) : 1;
    const nSteps = Math.round(tEnd / dt);
    const A = [];
    let rd1 = 0, th1 = 0, rMin = Infinity, rMax = -Infinity, nan = false, k = 0;
    for (; k < nSteps; k++) {
      S.step(dt);
      const dx = S.x[oi] - S.x[ci], dy = S.y[oi] - S.y[ci];
      const rr = Math.hypot(dx, dy), th = Math.atan2(dy, dx);
      const dvx = S.vx[oi] - S.vx[ci], dvy = S.vy[oi] - S.vy[ci];
      const rd = (rr > 0) ? (dx * dvx + dy * dvy) / rr : 0;
      if (rr < rMin) rMin = rr; if (rr > rMax) rMax = rr;
      if (k >= 1 && rd1 < 0 && rd >= 0) {
        const fr = (rd !== rd1) ? (-rd1 / (rd - rd1)) : 0;
        let a1 = th1, a2 = th;
        while (a2 - a1 > Math.PI) a2 -= 2 * Math.PI;
        while (a2 - a1 < -Math.PI) a2 += 2 * Math.PI;
        A.push({ ang: a1 + fr * (a2 - a1), k: k - 1 + fr, r: rr });
      }
      rd1 = rd; th1 = th;
      if (S.hasNaN()) { nan = true; break; }
    }
    return { ok: true, steps: k, tEnd: k * dt, dt, nan, rMin, rMax, pRef, A,
      clamp: (S.clampVN || 0) + (S.clampSN || 0) + (S.clampHN || 0) + (S.clampRN || 0) + (S.clampTN || 0),
      scaleExpT: Number(v.preset.scaleExp.T) };
  };
});

// ---- node 側の fit は **純関数モジュール** `tests/lib-w269a-periwindow.mjs` に置いた(第269便a)。
// ----   傾きと周期を**同じ近点集合**から作る。旧契約(20 近点窓)の周期は `legacy` 欄に併記される。

// ---- 3 段(新契約。旧契約の値は同じ走行から `previous` 欄へ —— **旧値を新値として写さない**)
const stages = [];
const previousStages = [];
for (const div of DIVS) {
  const dt = DT0 / div;
  const t0 = Date.now();
  const r = await pg.evaluate(({ id, dt, t }) => window.__w268aRun(id, dt, t), { id: ID, dt, t: T_END });
  if (!r.ok) { console.error('[w268a-d68] 走行できない: ' + r.error); await browser.close(); process.exit(2); }
  const f = fitPeriastronStage({ raw: r.A, rMin: r.rMin, rMax: r.rMax, pRef: r.pRef, dt,
    nFit: FIT_PERI, legacyWindow: LEGACY_WINDOW });
  const toSec = Math.pow(10, r.scaleExpT);
  const pPeriSec = (f.perMeanSim !== null) ? f.perMeanSim * toSec : null;
  const degPerYear = precessionDegPerYear({ degPerOrbit: f.slopeDegPerOrbit, pPeriSec });
  const tag = div === 1 ? 'h' : ('h/' + div);
  stages.push({ tag, dt, div, steps: r.steps, tEnd: r.tEnd,
    wallSec: (Date.now() - t0) / 1000, nan: r.nan, clamp: r.clamp,
    nPeriFound: f.nPeriFound, nFitUsed: f.nFitUsed, dup: f.dup, jump: f.jump,
    slopeDegPerOrbit: f.slopeDegPerOrbit, residDeg: f.residDeg,
    pPeriSec, toSec,
    // 第269便a: **窓の充足**を段ごとに記録する(短い窓へ自動置換しない契約の証拠)
    periodWindow: f.periodWindow, periodIntervals: f.periodIntervals,
    windowComplete: f.windowComplete, windowNote: f.windowNote,
    degPerYear,
    residualDegPerYear: (degPerYear === null) ? null : degPerYear - OBS.value,
    nSigma: (degPerYear === null) ? null : (degPerYear - OBS.value) / OBS.sigma });
  // 旧契約(第268便a: 周期だけ最初の 20 近点)を**同じ走行から**作り直して対照に置く
  const pPrevSec = (f.legacy.perMeanSim !== null) ? f.legacy.perMeanSim * toSec : null;
  const degPrev = precessionDegPerYear({ degPerOrbit: f.slopeDegPerOrbit, pPeriSec: pPrevSec });
  previousStages.push({ tag, dt, div, periodWindow: LEGACY_WINDOW,
    pPeriSec: pPrevSec, degPerYear: degPrev,
    residualDegPerYear: (degPrev === null) ? null : degPrev - OBS.value,
    nSigma: (degPrev === null) ? null : (degPrev - OBS.value) / OBS.sigma });
  console.log('[w268a-d68] ' + tag + ' dt=' + dt
    + ' 步 ' + r.steps + ' 近点 ' + f.nPeriFound + '(fit ' + f.nFitUsed + ')'
    + ' 窓充足=' + f.windowComplete
    + ' Δϖ=' + (f.slopeDegPerOrbit === null ? '—' : f.slopeDegPerOrbit.toPrecision(12)) + ' deg/周'
    + ' P_peri=' + (pPeriSec === null ? '—' : pPeriSec.toPrecision(12)) + ' s'
    + ' → ϖ̇=' + (degPerYear === null ? '—' : degPerYear.toPrecision(12)) + ' deg/yr'
    + ' (' + (degPerYear === null ? '—' : ((degPerYear - OBS.value) / OBS.sigma).toFixed(4) + 'σ') + ')'
    + ' [旧契約 ' + (degPrev === null ? '—' : ((degPrev - OBS.value) / OBS.sigma).toFixed(4) + 'σ') + ']'
    + '  [' + ((Date.now() - t0) / 1000).toFixed(1) + 's]');
}

// ---- 3 段の差・見かけの次数・Richardson 外挿(**差が単調でなければ外挿しない**)
function richardson(vals) {
  const [q0, q1, q2] = vals;
  if (![q0, q1, q2].every(Number.isFinite)) return { ok: false, why: '3 段が揃っていない' };
  const d1 = q0 - q1, d2 = q1 - q2;
  if (d2 === 0) return { ok: false, why: '2 段目と 3 段目の差が 0(次数を作れない)', d1, d2 };
  const ratio = d1 / d2;
  if (!(ratio > 0)) return { ok: false, why: '差の符号が反転している(漸近域に居ない)', d1, d2, ratio };
  const order = Math.log2(ratio);
  if (!(order > 0)) return { ok: false, why: '見かけの次数が正でない', d1, d2, ratio, order };
  const factor = 1 / (Math.pow(2, order) - 1);
  return { ok: true, d1, d2, ratio, order, factor, extrapolated: q2 + (q2 - q1) * factor };
}
const conv = {
  degPerYear: richardson(stages.map((s) => s.degPerYear)),
  slopeDegPerOrbit: richardson(stages.map((s) => s.slopeDegPerOrbit)),
  pPeriSec: richardson(stages.map((s) => s.pPeriSec)),
};
// **AD4 の収束規約**(第269便a・第59報「決断事項は概ね同意」で確定した形。閾値 0.3σ は
// 「数値誤差の予算」として採る —— 門の ε_num 予算と同じ数である)。
//   ① 3 段すべてで**窓が充足**(`windowComplete` かつ `nFitUsed === FIT_PERI`)
//   ② NaN 0・クランプ 0・重複除去 0・unwrap 中断 0(抽出の異常が 1 件も無い)
//   ③ 見かけの次数 order が**正**(漸近域に居る)
//   ④ **判定段(h/4)の Richardson 推定誤差** ε̂ = |Q_{h/2} − Q_{h/4}| / (2^p − 1) ≤ 0.3σ
//   ⑤ **最終 2 段差** |Q_{h/2} − Q_{h/4}| ≤ 0.3σ
// 第268便a は ⑤ だけを見ていた。⑤ は「差」であって推定誤差ではない —— 次数 p が小さいほど
// 外挿までの残りは大きくなるので、**判定段の推定誤差 ε̂ も同じ予算で見る**(AD4)。
// **ε̂ は漸近形(Q_h = Q + C h^p)からの推定であって厳密な上界ではない**。
// **次数が不安定なら h/8 を足す**(3 段の比 d1/d2 が 2^p から離れるとき —— 閾値は決断事項)。
const lastDiff = (conv.degPerYear.d2 === undefined) ? null : Math.abs(conv.degPerYear.d2);
const budget = 0.3 * OBS.sigma;
const windowsComplete = stages.every((s) => s.windowComplete === true && s.nFitUsed === FIT_PERI);
const extractionClean = stages.every((s) => s.nan === false && s.clamp === 0 && s.dup === 0 && s.jump === 0);
const order4 = (conv.degPerYear.order === undefined) ? null : conv.degPerYear.order;
const epsHat = (lastDiff === null || order4 === null || !(order4 > 0))
  ? null : lastDiff / (Math.pow(2, order4) - 1);
const judged = stages[stages.length - 1] || null;
const convergenceProposal = {
  rule: '**AD4**: ①3 段すべて窓充足(windowComplete ∧ nFitUsed=' + FIT_PERI + ')'
    + ' ②NaN 0・クランプ 0・重複 0・unwrap 中断 0 ③見かけの次数 order>0'
    + ' ④**判定段 h/4 の Richardson 推定誤差 ε̂ = |Q_{h/2}−Q_{h/4}|/(2^p−1) ≤ 0.3σ**'
    + ' ⑤**最終 2 段差 |Q_{h/2}−Q_{h/4}| ≤ 0.3σ**',
  sigma: OBS.sigma, budget,
  stagesRun: stages.length,
  judgedStage: judged ? judged.tag : null,
  windowsComplete, extractionClean,
  orderPositive: !!conv.degPerYear.ok,
  order: order4,
  lastStageDiff: lastDiff,
  lastStageDiffInSigma: (lastDiff === null) ? null : lastDiff / OBS.sigma,
  epsHat, epsHatInSigma: (epsHat === null) ? null : epsHat / OBS.sigma,
  epsHatOk: (epsHat !== null && epsHat <= budget),
  lastDiffOk: (lastDiff !== null && lastDiff <= budget),
  // 判定に使う値そのもの(**外挿は参考であり、判定段は h/4 である**)
  judgedEstimate: judged ? judged.degPerYear : null,
  refinedEstimate: (conv.degPerYear.extrapolated === undefined) ? null : conv.degPerYear.extrapolated,
  coarseEstimate: (conv.degPerYear.extrapolated === undefined || !stages.length) ? null
    : Math.abs(conv.degPerYear.extrapolated - stages[0].degPerYear),
  ok: !!(stages.length >= 3 && windowsComplete && extractionClean && conv.degPerYear.ok
    && epsHat !== null && epsHat <= budget && lastDiff !== null && lastDiff <= budget),
  caveats: [
    '**ε̂ は漸近形 Q_h = Q + C h^p からの推定であって厳密な上界ではない**',
    '**次数が不安定なら h/8 を足す**(本器の 3 段だけで次数を確定したとは書かない)',
    '**ok になっても合否は言わない** —— 判定は門(tests/exp-w249b-calaudit.mjs)の仕事であり、'
      + '📡 は THREE_STAGE_REGISTRY に登録されていない(登録は次便の署名便)',
  ],
  decision: '**閾値 0.3σ は決断事項**(門の ε_num 予算と同じ数を採った)。'
    + 'ここで ok になっても**判定は門の仕事**であり、本器は合否を言わない。',
};

const out = {
  when: new Date().toISOString(),
  wave: '第269便a(第59報 W1・統括の読み (E)) — 第268便a の器を**同じ近点窓**へ直して再走',
  target: TARGET, id: ID, label: LABEL,
  declaration: {
    window: { tEnd: T_END, unit: 'sim time',
      why: '第249便b の h 段(dt=0.016・668676 步)と同じ終了時刻。**步数ではなく時刻を揃える**' },
    extractor: { name: 'periastron-detectorA-v2-samewindow',
      definition: '近点 = ṙ の −→+ 交差(線形内挿)。近点方位を unwrap して**近点番号**に線形 fit した'
        + '傾きが Δϖ [deg/周]。3 段とも**最初の ' + FIT_PERI + ' 近点**で fit する',
      periodWindow: 'P_peri = **同じ最初の ' + FIT_PERI + ' 近点(' + (FIT_PERI - 1)
        + ' 区間)**の平均(第269便a の新契約 —— 傾きと同じ近点集合)',
      incomplete: '窓不足(nFitUsed<' + FIT_PERI + ')・unwrap 中断(jump>0)では'
        + '**短い窓へ自動置換せず** perMeanSim=null・windowComplete=false',
      module: 'tests/lib-w269a-periwindow.mjs(純関数)' },
    conversion: 'ϖ̇ [deg/yr] = Δϖ [deg/周] × ' + YEAR_SEC + ' / P_peri [s]'
      + '(**分子の Δϖ と同じ近点窓の周期で割る** —— 周期行・丸めた観測周期は使わない)',
  },
  observation: OBS,
  stages, convergence: conv, convergenceProposal,
  // ---- 旧契約(第268便a)の 3 段。**対照の記録であって新値ではない** ----
  previous: {
    contract: '20-periastron period window(第268便a: 周期だけ最初の ' + LEGACY_WINDOW + ' 近点 = '
      + (LEGACY_WINDOW - 1) + ' 区間・傾きは ' + FIT_PERI + ' 近点)',
    why: '**同じ走行・同じ検出器でも同じ近点集合ではない**ため、換算契約(分子と同じ窓)を'
      + '満たしていなかった。ここに残すのは**旧契約の記録**であり、**新値として写してはならない**',
    stages: previousStages,
    convergence: richardson(previousStages.map((s) => s.degPerYear)),
    note: '旧契約の 3 段は**この走行から作り直した**もので、第268便a の JSON の値と同じ手続きである',
  },
  verdict: '**数値未解決**(3 段の収束が宣言の条件を満たしても、判定は門の仕事であり、'
    + '📡 は THREE_STAGE_REGISTRY に登録されていない)',
  doNotWrite: ['D68 が合(3σ)', 'D68 が否(3σ)', '換算したら判定が増えた', '太陽系の σ が揃った',
    '3 段を走らせたので収束した(条件は上の数で見る)', '窓を直したので判定が確定した'],
  pageErrors,
};
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log('[w268a-d68] 見かけの次数 ϖ̇: '
  + (conv.degPerYear.order === undefined ? '—' : conv.degPerYear.order.toFixed(4))
  + ' / 外挿 ' + (conv.degPerYear.extrapolated === undefined ? '—'
    : conv.degPerYear.extrapolated.toPrecision(12) + ' deg/yr('
      + ((conv.degPerYear.extrapolated - OBS.value) / OBS.sigma).toFixed(4) + 'σ)'));
console.log('[w268a-d68] AD4: 判定段 ' + convergenceProposal.judgedStage
  + ' / 窓充足 ' + windowsComplete + ' / 抽出異常なし ' + extractionClean
  + ' / ε̂ = ' + (epsHat === null ? '—' : epsHat.toPrecision(6)) + ' deg/yr = '
  + (epsHat === null ? '—' : (epsHat / OBS.sigma).toPrecision(6)) + 'σ'
  + ' / 2 段差 = ' + (lastDiff === null ? '—' : lastDiff.toPrecision(6)) + ' deg/yr = '
  + (lastDiff === null ? '—' : (lastDiff / OBS.sigma).toPrecision(6)) + 'σ'
  + ' / 予算 0.3σ = ' + budget.toPrecision(6) + ' → ok=' + convergenceProposal.ok
  + '(**合否は言わない**)');
console.log('[w268a-d68] 旧契約(20 近点窓)の 3 段: '
  + previousStages.map((s) => (s.nSigma === null ? '—' : s.nSigma.toFixed(4) + 'σ')).join(' / ')
  + ' —— **対照の記録であり新値ではない**');
console.log('→ ' + path.relative(ROOT, OUT));
await browser.close();
