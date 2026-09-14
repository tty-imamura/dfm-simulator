// 第263便a(第55報 W1)「geoPN=3 × 部分引きずり」——
// 第55報の仮説「**コンパクト連星では空間メッシュ(複素決定力場)の影響が強まるので geoPN=3 の適用となり、
// 引きずりが弱まるので kFrame≈0.7 などの結果となる**」を**測る**器である。
//
// ■ この器が答える 5 つ
//   bit   … §0 既定経路 1 bit 不変(全内蔵 × 600 步の状態ハッシュと physics 署名を基点 html と突き合わせ)
//   ctrl  … §1 **二重計上の対照 3 走行**(f=1・kFrame=0.7):
//             (i)  geoPN=2 … E12(統一測地線則)あり・トイなし・E6′ あり
//             (ii) geoPN=3・η=0 … E12 なし(`_core` から見た geoPN が 0)・トイなし・**E6′ だけ**
//             (iii)geoPN=3・η=1 … E12 なし・**トイあり**・E6′ あり(= 明示キーの重畳)
//           (ii)−(i) が「**E12 が切れた分**」、(iii)−(ii) が「**トイの分**」である。
//           D₀ の宣言は 2 通り(🩻 系 = D0pull を消して D₀=0.006 / 📻 系 = D0pull=3.24204e-7)を**両方**出す。
//   sweep … §2 **掃引 30 点**: kFrame∈{0,0.25,0.5,0.7,1} × η∈{0,0.5,1} × law∈{scalar,local}。
//           各点で **近点間 P=P_obs になる共通 f を根探索**し、その f での ω̇・e・χ・離脱/落下を表に。
//           **f=1 固定**の行(P と ω̇ の観測比)も同じ 30 点で並べる。
//   valley… §3 **ω̇(kFrame) の谷**: 第262便a の曲線(現行経路 geoPN=2・族A)に kFrame∈{0.05,…,0.25} を足す。
//   dom   … §4 **支配度の器** `HP.dfmDominance` の 3 軸を較正連星 8 系 + 太陽系 3 例で出し、
//           「支配度 vs kFrame=1 で P_obs を出す f*」の相関表にする。**法則の自動分岐は実装しない。**
//
// ■ 測る量の定義(第262便a と同じ —— 段をまたいで同じであることが読む前提)
//   **近点間 P** = 位相制限(1.5π)の検出器が採った最初の 20 近点(19 区間)の平均間隔
//   (`tests/lib-precision-diagnostics.mjs` の `createPeriastronDetector` — 第261便c)。
//   ω̇ は採用近点の方位を**実時刻**に回帰した傾き(°/年・ユリウス年 3.15576×10⁷ s の約束)。
//   **根の許容は 10⁻² s** —— 第262便a ⑤で測った**抽出器の段差(10⁻²〜10⁻¹ s)**より下は意味が無い
//   (観測 σ_P=2.5056×10⁻⁷ s の 4×10⁴ 倍。**精度の主張ではなく分解能の床である** — Negative Claim 40)。
//
// ■ 言わないこと(先に書く)
//   **これは較正則ではない。** geoPN=3 のトイの慣性則は較正候補ではない(Negative Claim 27)。
//   **明示キー `toyAllowDrag` の重畳は「二重計上の可能性がある診断構成」**であって、
//   「引きずりが弱い法則」ではない。**対照(η=0)と並べてしか読めない。**
//   **kFrame≈0.7 を観測安定則にしない**(QA `preset.kframe-binary01` が内蔵の kFrame∈{0,1} を機械固定する)。
//
// ■ 触らないもの
//   `beta/index.html` は**読むだけ**。本体 📻・⚡・🩻 の JSON を 1 bit も書き換えない
//   (走行用のコピーをページの中で作って捨てる)。`S._core` には 1 命令も足していない。
//
// 実行: node tests/exp-w263a-dragoverlay.mjs [--part bit,ctrl,sweep,valley,dom] [--budget-total 7200]
// 出力: tests/out/dragoverlay-w263a.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const BASE = process.env.W263A_BASE || path.join(ROOT, 'beta', '_w263_base.html');
const INDEX = 'file://' + path.join(ROOT, TARGET);
const OUT = process.env.W263A_OUT || path.join(ROOT, 'tests', 'out', 'dragoverlay-w263a.json');
const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(k); return (i >= 0 && argv[i + 1]) ? argv[i + 1] : d; };
const PARTS = arg('--part', 'bit,ctrl,sweep,valley,dom').split(',');
const want = (k) => PARTS.indexOf(k) >= 0;
const BUDGET_TOTAL_S = Number(arg('--budget-total', 7200));
const DT0 = 0.016;
const PERI_WINDOW = 20;
const YEAR_SEC = 31557600;                 // ユリウス年(**単位の約束**であって観測ではない)
const F_LO = Number(arg('--flo', 0.5)), F_HI = Number(arg('--fhi', 4));
const P_TOL_SEC = Number(arg('--ptol', 1e-2));   // 抽出器の段差より下は意味が無い(Negative Claim 40)
const MAX_ITER = Number(arg('--maxiter', 26));
const KF_SWEEP = arg('--kframes', '0,0.25,0.5,0.7,1').split(',').map(Number);
const ETA_SWEEP = arg('--etas', '0,0.5,1').split(',').map(Number);
const LAW_SWEEP = arg('--laws', 'scalar,local').split(',');
const KF_VALLEY = arg('--valley', '0.05,0.1,0.15,0.2,0.25').split(',').map(Number);

// ---- 観測(CSV が正本。この器に観測数値は 1 つも書かない)----
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
const pickOf = (body, q) => OBS.find((r) => r.body === body && r.quantity === q) || null;
const obsP = pickOf('PSR J0737-3039 B', 'orbital_period');
const obsE = pickOf('PSR J0737-3039 B', 'eccentricity');
const obsW = pickOf('PSR J0737-3039 B', 'periastron_advance');
if (!obsP) { console.error('[w263a] 観測周期の行が CSV に無い'); process.exit(2); }
const P_OBS = obsP.value, SIG_P = obsP.sigma;
const W_OBS = obsW ? obsW.value : null, SIG_W = obsW ? obsW.sigma : null;

const LIB_PREC = fs.readFileSync(path.join(ROOT, 'tests', 'lib-precision-diagnostics.mjs'), 'utf8').replace(/^export /gm, '');
const LIB_DIAG = fs.readFileSync(path.join(ROOT, 'tests', 'lib-w262a-psrdiag.mjs'), 'utf8').replace(/^export /gm, '');
const LIB_W263 = fs.readFileSync(path.join(ROOT, 'tests', 'lib-w263a-dragdiag.mjs'), 'utf8').replace(/^export /gm, '');

const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let browser;
try { browser = await req('playwright').chromium.launch(); }
catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }
const pageErrors = [];
async function openPage(url) {
  const pg = await browser.newPage();
  pg.on('pageerror', (e) => pageErrors.push(String(e.message || e)));
  await pg.goto(url, { waitUntil: 'load' });
  await pg.waitForFunction(() => window.HP && HP.sim);
  await pg.addScriptTag({ content: LIB_PREC });
  await pg.addScriptTag({ content: LIB_DIAG });
  await pg.addScriptTag({ content: LIB_W263 });
  return pg;
}
const pg = await openPage(INDEX);
const libOk = await pg.evaluate(() => typeof createPeriastronDetector === 'function'
  && typeof psrMassScaled === 'function' && typeof psrDragOverlayCopy === 'function');
if (!libOk) { console.error('[w263a] lib がページへ入っていない'); await browser.close(); process.exit(2); }

await pg.evaluate(({ PERI_WINDOW }) => {
  // 1 走行。**離脱で打ち切る**(束縛していない構成に周期は無い —— 0 で埋めない)
  window.__w263aRun = (spec) => {
    const src = HP.allPresets().find((q) => q.id === (spec.srcId || 'psrDoubleABGeoToy'));
    if (!src) return { ok: false, errors: ['preset なし: ' + spec.srcId] };
    // f は**観測質量(較正の基点)に共通係数**を掛ける(位置・速度は 1 bit も動かさない)
    let pd = psrMassScaled(src, (spec.f === undefined) ? 1 : spec.f,
      { kFrame: 0, keepCore: false, id: 'w263aDiag' });
    if (spec.mode === 'pn2') pd = psrGeoPN2Copy(pd, { kFrame: spec.kFrame, geoPN: spec.geoPN,
      d0Mode: spec.d0Mode, id: 'w263aDiag' });
    else pd = psrDragOverlayCopy(pd, { kFrame: spec.kFrame, toyGain: spec.eta,
      lawVersion: spec.law, d0Mode: spec.d0Mode, allowDrag: spec.allowDrag, id: 'w263aDiag' });
    if (spec.D0 !== undefined) pd.physics.D0 = spec.D0;
    // d0Mode:"keep" = 📻 の宣言(D0pull)を戻して **E6′ とトイに同じ D₀ を読ませる**
    // (器に観測由来の定数を書かない —— 値は 📻 の JSON から読む)
    if (spec.d0Mode === 'keep') {
      const radio = HP.allPresets().find((z) => z.id === 'psrDoubleAB');
      if (radio && radio.physics && radio.physics.D0pull !== undefined) pd.physics.D0pull = radio.physics.D0pull;
    }
    const v = HP.validatePreset(pd);
    if (!v.ok) return { ok: false, errors: v.errors };
    const S = HP.sim;
    S.build(v.preset);
    const dt = spec.dt, ci = 0, oi = 1;
    const det = createPeriastronDetector({ phaseGate: 1.5 * Math.PI });
    const t0 = performance.now();
    const r00 = Math.hypot(S.x[oi] - S.x[ci], S.y[oi] - S.y[ci]);
    const maxSteps = spec.maxSteps || 4e8, budgetMs = spec.budgetMs || 180000;
    const escFactor = spec.escFactor || 4;
    let k = 0, stopped = 'window', nPeri = 0, inWin = false;
    let rMin = Infinity, rMax = -Infinity;
    for (; k < maxSteps; k++) {
      S.step(dt);
      const dx = S.x[oi] - S.x[ci], dy = S.y[oi] - S.y[ci];
      const rr = Math.hypot(dx, dy), th = Math.atan2(dy, dx);
      const dvx = S.vx[oi] - S.vx[ci], dvy = S.vy[oi] - S.vy[ci];
      const rd = (rr > 0) ? (dx * dvx + dy * dvy) / rr : 0;
      if (inWin) { if (rr < rMin) rMin = rr; if (rr > rMax) rMax = rr; }
      const a = det.push(k, rr, rd, th);
      if (a.accepted) { nPeri++; inWin = true; }
      if (nPeri >= PERI_WINDOW) { stopped = 'window'; break; }
      if (rr > escFactor * r00) { stopped = 'escape'; break; }
      if (rr < 0.01 * r00) { stopped = 'fall'; break; }
      if (S.hasNaN()) { stopped = 'nan'; break; }
      if ((k & 65535) === 0 && (performance.now() - t0) > budgetMs) { stopped = 'time-budget'; break; }
    }
    if (k >= maxSteps) stopped = 'max-steps';
    const res = det.result(PERI_WINDOW);
    const peri = res.peri, ang = res.ang;
    // **第263便a の分離**(第262便a との違いを先に書く): 近点抽出器の `measured` は
    // **近点方位の unwrap が通ったか**で立つフラグなので、第262便a はそれを P にも掛けていた。
    // 本便の帯は**歳差が速くて unwrap が落ちる点が多い**ので、**P と ω̇ を分ける**:
    //   ・**近点間 P は窓(20 個)が埋まれば出す**(近点の時刻そのものは unwrap に依らない)
    //   ・**ω̇ は unwrap が通ったときだけ出す**(通らなければ null —— 0 で埋めない)
    let slopeT = null;
    if (res.measured && ang.length >= 3) {
      const m = ang.length;
      const xs = ang.map((_, i) => peri[i].k * dt);
      const mx = xs.reduce((a2, b) => a2 + b, 0) / m, my = ang.reduce((a2, b) => a2 + b, 0) / m;
      let sxy = 0, sxx = 0;
      for (let i = 0; i < m; i++) { sxy += (xs[i] - mx) * (ang[i] - my); sxx += (xs[i] - mx) * (xs[i] - mx); }
      if (sxx > 0) slopeT = sxy / sxx;
    }
    const winFull = (res.nPeri >= PERI_WINDOW && peri.length >= PERI_WINDOW);
    return { ok: true, steps: k, stopped, nan: S.hasNaN(), nPeri: res.nPeri,
      unwrapFailed: res.unwrapFailed, measured: res.measured, winFull,
      clamp: (S.clampVN || 0) + (S.clampSN || 0) + (S.clampHN || 0) + (S.clampRN || 0) + (S.clampTN || 0),
      perMeanSim: winFull ? (peri[PERI_WINDOW - 1].k - peri[0].k) * dt / (PERI_WINDOW - 1) : null,
      slopeRadPerSimTime: slopeT,
      r0: r00, rMin: Number.isFinite(rMin) ? rMin : null, rMax: Number.isFinite(rMax) ? rMax : null,
      eProxy: (rMax > 0 && rMax + rMin > 0) ? (rMax - rMin) / (rMax + rMin) : null,
      geoToy: { deny: S.geoToyDeny, overlay: S.geoToyOverlay, stop: S.geoToyStop, N: S.geoToyN, chi: S.geoToyChi },
      ledger: { e: Math.abs(S.geoToyE + S.geoToyEmesh),
        dP: Math.hypot(S.geoToyPx + S.geoToyMeshPx, S.geoToyPy + S.geoToyMeshPy) },
      sig: JSON.stringify(v.preset.physics), warn: (v.warnings || []).length,
      warnings: (v.warnings || []).slice(0, 2) };
  };
}, { PERI_WINDOW });

const toSec = await pg.evaluate(() => Math.pow(10,
  Number(HP.allPresets().find((q) => q.id === 'psrDoubleAB').scaleExp.T)));

const R = { meta: { wave: '第263便a', target: TARGET, base: BASE, dt0: DT0, periWindow: PERI_WINDOW,
  yearSec: YEAR_SEC, fInterval: [F_LO, F_HI], pTolSec: P_TOL_SEC, toSec,
  metric: '**近点間 P** = 位相制限(1.5π)の最初の 20 近点(19 区間)の平均間隔。ω̇ は採用近点の方位を**実時刻**に回帰した傾き。',
  tolNote: '根の許容 ' + P_TOL_SEC + ' s は**抽出器の段差(10⁻²〜10⁻¹ s・第262便a ⑤)より上**に置いた。'
    + '観測 σ_P の ' + (SIG_P ? (P_TOL_SEC / SIG_P).toExponential(2) : '—') + ' 倍で、**精度の主張ではない**(Negative Claim 40)。',
  claim: '**この表は較正則ではない。** 明示キー `toyAllowDrag` の重畳は**二重計上の可能性がある診断構成**であり、'
    + '対照(η=0)と並べてしか読めない(Negative Claim 27 を維持する)。',
  parts: PARTS },
  obs: { period: obsP, ecc: obsE, omegaDot: obsW }, pageErrors: [] };

let spent = 0;
const evalOne = async (spec) => {
  const t0 = Date.now();
  const r = await pg.evaluate((s) => window.__w263aRun(s), Object.assign({ dt: DT0 }, spec));
  spent += (Date.now() - t0) / 1000;
  r.spec = spec;
  r.periodSec = (r.ok && r.perMeanSim !== null) ? r.perMeanSim * toSec : null;
  r.degPerYear = (r.ok && r.slopeRadPerSimTime !== null)
    ? r.slopeRadPerSimTime * 180 / Math.PI / toSec * YEAR_SEC : null;
  return r;
};

// f の根探索(Illinois)。**束縛していない構成には周期が無い**ので g=+∞(質量が足りない側)とする。
async function rootF(specBase) {
  const trace = [];
  const g = async (f) => {
    const r = await evalOne(Object.assign({}, specBase, { f }));
    trace.push({ f, periodSec: r.periodSec, stopped: r.stopped, nPeri: r.nPeri,
      eProxy: r.eProxy, degPerYear: r.degPerYear });
    return { r, g: (r.periodSec === null) ? Infinity : (r.periodSec - P_OBS) };
  };
  let vl = await g(F_LO), vh = await g(F_HI);
  let best = null;
  const keepBest = (f, v) => { if (v.r.periodSec === null) return;
    if (!best || Math.abs(v.g) < Math.abs(best.g)) best = { f, ...v }; };
  keepBest(F_LO, vl); keepBest(F_HI, vh);
  if (!(vh.g < 0)) return { root: null, reason: 'f=' + F_HI + ' でもまだ P > P_obs(この区間に根が無い)', trace, best };
  if (vl.g < 0) return { root: null, reason: 'f=' + F_LO + ' で既に P < P_obs(この区間に根が無い)', trace, best };
  let fl = F_LO, fh = F_HI, side = 0, root = null, reason = null;
  for (let it = 0; it < MAX_ITER; it++) {
    let fm;
    if (Number.isFinite(vl.g)) { fm = fh - vh.g * (fh - fl) / (vh.g - vl.g); if (!(fm > fl && fm < fh)) fm = 0.5 * (fl + fh); }
    else fm = 0.5 * (fl + fh);
    const vm = await g(fm);
    keepBest(fm, vm);
    if (Math.abs(vm.g) < P_TOL_SEC && vm.r.periodSec !== null) { root = { f: fm, ...vm }; break; }
    if (vm.g > 0) { fl = fm; vl = vm; if (side === -1 && Number.isFinite(vh.g)) vh = { ...vh, g: vh.g / 2 }; side = -1; }
    else { fh = fm; vh = vm; if (side === 1 && Number.isFinite(vl.g)) vl = { ...vl, g: vl.g / 2 }; side = 1; }
    if (fh - fl < 1e-12) { root = { f: 0.5 * (fl + fh), ...(best || vm) };
      reason = '区間が 10⁻¹² まで潰れた(|ΔP| は抽出器の段差で残る)'; break; }
  }
  if (!root && best) { root = best; reason = '反復上限(' + MAX_ITER + ')— |ΔP| 最小の点を採った'; }
  else if (!root) reason = '反復上限(' + MAX_ITER + ')で収束しなかった';
  return { root, reason, trace, best };
}

const brief = (r) => (r && r.ok)
  ? `P=${r.periodSec === null ? '—' : r.periodSec.toFixed(6)}s e=${r.eProxy === null ? '—' : r.eProxy.toFixed(6)}`
    + ` ω̇=${r.degPerYear === null ? '—' : r.degPerYear.toExponential(4)}°/yr`
    + ` ${r.stopped} peri=${r.nPeri} toy=${r.geoToy.stop || 'on'}/${r.geoToy.overlay || '—'} χ=${r.geoToy.chi.toExponential(3)}`
  : `ERR ${(r && r.errors) ? r.errors.join('|') : '—'}`;

// ============================================================ §0 既定経路 1 bit 不変
if (want('bit')) {
  if (!fs.existsSync(BASE)) R.bit = { skipped: '基点 html が無い: ' + BASE };
  else {
    const basePage = await openPage('file://' + BASE);
    const snapOf = async (p2) => p2.evaluate(async (nStep) => {
      const out = {};
      for (const q of HP.allPresets()) {
        const v = HP.validatePreset(JSON.parse(JSON.stringify(q)));
        if (!v.ok) { out[q.id] = { err: (v.errors || []).join('|') }; continue; }
        const S = HP.sim; S.build(v.preset);
        for (let k = 0; k < nStep; k++) S.step(0.016);
        let h = 0;
        const mix = (z) => { const f = Math.fround(z); h = (h * 31 + (Number.isFinite(f) ? Math.round(f * 1e6) : 987654321)) | 0; };
        for (let i = 0; i < S.n; i++) { mix(S.x[i]); mix(S.y[i]); mix(S.vx[i]); mix(S.vy[i]); mix(S.spin[i]); mix(S.R[i]); mix(S.m[i]); }
        mix(S.t); mix(S.n);
        out[q.id] = { h, n: S.n, nan: S.hasNaN(), sig: JSON.stringify(v.preset.physics) };
      }
      return out;
    }, 600);
    const a = await snapOf(basePage), b = await snapOf(pg);
    await basePage.close();
    const ids = Object.keys(a), idsNew = Object.keys(b);
    const stateDiff = [], sigDiff = [];
    for (const id of ids) {
      const x = a[id], y = b[id];
      if (!y) { stateDiff.push(id); continue; }
      if (x.h !== y.h || x.n !== y.n || x.nan !== y.nan) stateDiff.push(id);
      if (x.sig !== y.sig) sigDiff.push(id);
    }
    R.bit = { presetsBase: ids.length, presetsCur: idsNew.length, steps: 600, stateDiff, sigDiff,
      added: idsNew.filter((z) => ids.indexOf(z) < 0) };
    console.error(`[w263a/bit] 内蔵 ${ids.length} 本 × 600 步: 状態差 ${stateDiff.length} 本 / 署名差 ${sigDiff.length} 本`);
  }
}

// ============================================================ §1 二重計上の対照 3 走行
if (want('ctrl')) {
  const KF = Number(arg('--ctrl-kframe', 0.7));
  R.ctrl = { kFrame: KF, f: 1, rows: [],
    note: '(i) geoPN=2 = E12 あり・トイなし・E6′ あり / (ii) geoPN=3・η=0 = **E12 が切れて E6′ だけ** / '
      + '(iii) geoPN=3・η=1 = E12 なし・トイあり・E6′ あり。(ii)−(i) が「E12 が切れた分」・(iii)−(ii) が「トイの分」。' };
  for (const d0Mode of ['toy', 'keep']) {
    for (const div of [1, 2]) {
      const dt = DT0 / div;
      const mk = [
        { tag: 'i.geoPN2', mode: 'pn2', geoPN: 2, kFrame: KF },
        { tag: 'ii.geoPN3-eta0', eta: 0, law: 'local', kFrame: KF },
        { tag: 'iii.geoPN3-eta1', eta: 1, law: 'local', kFrame: KF },
        // 参考: kFrame=0 の 3 本(重畳が無い側の同じ 3 法則)
        { tag: 'i0.geoPN2-kF0', mode: 'pn2', geoPN: 2, kFrame: 0 },
        { tag: 'ii0.geoPN3-eta0-kF0', eta: 0, law: 'local', kFrame: 0 },
        { tag: 'iii0.geoPN3-eta1-kF0', eta: 1, law: 'local', kFrame: 0 }];
      for (const s of mk) {
        const r = await evalOne(Object.assign({ f: 1, dt, d0Mode, srcId: 'psrDoubleABGeoToy' }, s));
        R.ctrl.rows.push({ tag: s.tag, d0Mode, div, dt, kFrame: s.kFrame,
          periodSec: r.periodSec, deltaPSec: r.periodSec === null ? null : r.periodSec - P_OBS,
          nSigmaP: (r.periodSec !== null && SIG_P) ? Math.abs(r.periodSec - P_OBS) / SIG_P : null,
          degPerYear: r.degPerYear, wRatio: (r.degPerYear !== null && W_OBS) ? r.degPerYear / W_OBS : null,
          eProxy: r.eProxy, rMin: r.rMin, rMax: r.rMax, stopped: r.stopped, nPeri: r.nPeri,
          unwrapFailed: r.unwrapFailed, measured: r.measured, winFull: r.winFull,
          geoToy: r.geoToy, ledger: r.ledger, clamp: r.clamp,
          warnings: r.warnings, sig: r.sig, ok: r.ok, errors: r.errors || null });
        console.error(`  [ctrl] D0=${d0Mode} dt/${div} ${s.tag} kF=${s.kFrame}: ${brief(r)}`);
      }
    }
  }
}

// ============================================================ §2 掃引 30 点(根探索 + f=1 固定)
if (want('sweep')) {
  R.sweep = { kFrames: KF_SWEEP, etas: ETA_SWEEP, laws: LAW_SWEEP, rows: [],
    note: '🩻 系(D0pull を消して D₀=0.006 の一本化)。**f は自由**で、近点間 P=P_obs を出す共通 f を根探索した。'
      + 'f=1 固定の行は同じ構成を f=1 で 1 回走らせた結果である。' };
  for (const law of LAW_SWEEP) for (const eta of ETA_SWEEP) for (const kFrame of KF_SWEEP) {
    const spec = { mode: 'toy', law, eta, kFrame, d0Mode: 'toy', dt: DT0, srcId: 'psrDoubleABGeoToy' };
    // f=1 固定(1 走行)
    const r1 = await evalOne(Object.assign({}, spec, { f: 1 }));
    let rr = { root: null, reason: '予算で止めた(未走行)', trace: [], best: null };
    if (spent < BUDGET_TOTAL_S) rr = await rootF(spec);
    const rt = rr.root ? rr.root.r : null;
    R.sweep.rows.push({ law, eta, kFrame,
      f1: { periodSec: r1.periodSec, deltaPSec: r1.periodSec === null ? null : r1.periodSec - P_OBS,
        nSigmaP: (r1.periodSec !== null && SIG_P) ? Math.abs(r1.periodSec - P_OBS) / SIG_P : null,
        pRatio: r1.periodSec === null ? null : r1.periodSec / P_OBS,
        degPerYear: r1.degPerYear, wRatio: (r1.degPerYear !== null && W_OBS) ? r1.degPerYear / W_OBS : null,
        eProxy: r1.eProxy, stopped: r1.stopped, nPeri: r1.nPeri, unwrapFailed: r1.unwrapFailed,
        geoToy: r1.geoToy, ok: r1.ok, errors: r1.errors || null },
      fStar: rr.root ? rr.root.f : null, reason: rr.reason || null,
      at: rt ? { periodSec: rt.periodSec, deltaPSec: rt.periodSec === null ? null : rt.periodSec - P_OBS,
        nSigmaP: (rt.periodSec !== null && SIG_P) ? Math.abs(rt.periodSec - P_OBS) / SIG_P : null,
        degPerYear: rt.degPerYear, wRatio: (rt.degPerYear !== null && W_OBS) ? rt.degPerYear / W_OBS : null,
        wSigma: (rt.degPerYear !== null && W_OBS && SIG_W) ? Math.abs(rt.degPerYear - W_OBS) / SIG_W : null,
        eProxy: rt.eProxy, stopped: rt.stopped, nPeri: rt.nPeri, unwrapFailed: rt.unwrapFailed,
        geoToy: rt.geoToy, ledger: rt.ledger, clamp: rt.clamp } : null,
      evals: rr.trace.length, spentSec: +spent.toFixed(1) });
    console.error(`  [sweep] ${law} η=${eta} kF=${kFrame}: f*=${rr.root ? rr.root.f.toFixed(6) : '—'}`
      + ` (${rr.reason || 'root'}) / f=1: ${brief(r1)}  [${spent.toFixed(0)}s]`);
  }
}

// ============================================================ §3 ω̇(kFrame) の谷(現行経路 geoPN=2・族A)
if (want('valley')) {
  R.valley = { kFrames: KF_VALLEY, rows: [],
    note: '第262便a §① の族A(⚡ の JSON にコア v2 を残して f と kFrame を当てる)と**同じ測り方**で、'
      + '0.05〜0.25 を足して谷の形を出す。**現行経路(geoPN=2)の記録であって較正則ではない。**' };
  await pg.evaluate(() => {
    window.__w263aBal = (f, kFrame, dt, nWin) => {
      const src = HP.allPresets().find((q) => q.id === 'psrDoubleABDFM');
      const pd = psrMassScaled(src, f, { kFrame, keepCore: true, id: 'w263aBal' });
      const v = HP.validatePreset(pd);
      if (!v.ok) return { ok: false, errors: v.errors };
      const S = HP.sim; S.build(v.preset);
      const det = createPeriastronDetector({ phaseGate: 1.5 * Math.PI });
      const ci = 0, oi = 1, t0 = performance.now();
      const r00 = Math.hypot(S.x[oi] - S.x[ci], S.y[oi] - S.y[ci]);
      let k = 0, nPeri = 0, stopped = 'window', rMin = Infinity, rMax = -Infinity, inWin = false;
      for (; k < 4e8; k++) {
        S.step(dt);
        const dx = S.x[oi] - S.x[ci], dy = S.y[oi] - S.y[ci];
        const rr = Math.hypot(dx, dy), th = Math.atan2(dy, dx);
        const dvx = S.vx[oi] - S.vx[ci], dvy = S.vy[oi] - S.vy[ci];
        const rd = (rr > 0) ? (dx * dvx + dy * dvy) / rr : 0;
        if (inWin) { if (rr < rMin) rMin = rr; if (rr > rMax) rMax = rr; }
        const a = det.push(k, rr, rd, th);
        if (a.accepted) { nPeri++; inWin = true; }
        if (nPeri >= nWin) break;
        if (rr > 4 * r00) { stopped = 'escape'; break; }
        if (S.hasNaN()) { stopped = 'nan'; break; }
        if ((k & 65535) === 0 && (performance.now() - t0) > 240000) { stopped = 'time-budget'; break; }
      }
      const res = det.result(nWin), peri = res.peri, ang = res.ang;
      let slopeT = null;
      if (ang.length >= 3) {
        const m = ang.length, xs = ang.map((_, i) => peri[i].k * dt);
        const mx = xs.reduce((a2, b) => a2 + b, 0) / m, my = ang.reduce((a2, b) => a2 + b, 0) / m;
        let sxy = 0, sxx = 0;
        for (let i = 0; i < m; i++) { sxy += (xs[i] - mx) * (ang[i] - my); sxx += (xs[i] - mx) * (xs[i] - mx); }
        if (sxx > 0) slopeT = sxy / sxx;
      }
      return { ok: true, stopped, nPeri: res.nPeri, measured: res.measured,
        perMeanSim: res.measured ? (peri[nWin - 1].k - peri[0].k) * dt / (nWin - 1) : null,
        slopeRadPerSimTime: slopeT,
        eProxy: (rMax > 0 && rMax + rMin > 0) ? (rMax - rMin) / (rMax + rMin) : null };
    };
  });
  const evalBal = async (f, kFrame, dt) => {
    const t0 = Date.now();
    const r = await pg.evaluate((a) => window.__w263aBal(a[0], a[1], a[2], a[3]), [f, kFrame, dt, PERI_WINDOW]);
    spent += (Date.now() - t0) / 1000;
    r.periodSec = (r.ok && r.perMeanSim !== null) ? r.perMeanSim * toSec : null;
    r.degPerYear = (r.ok && r.slopeRadPerSimTime !== null)
      ? r.slopeRadPerSimTime * 180 / Math.PI / toSec * YEAR_SEC : null;
    return r;
  };
  for (const kFrame of KF_VALLEY) {
    const row = { kFrame, byDiv: {} };
    for (const div of [1, 2]) {
      const dt = DT0 / div;
      // 根探索(f∈[1,2.1] — 第262便a と同じ区間)
      let lo = 1, hi = 2.1, root = null, reason = null, best = null, evals = 0;
      const g = async (f) => { const r = await evalBal(f, kFrame, dt); evals++;
        return { r, g: (r.periodSec === null) ? Infinity : (r.periodSec - P_OBS) }; };
      let vl = await g(lo), vh = await g(hi);
      const keepBest = (f, v) => { if (v.r.periodSec === null) return;
        if (!best || Math.abs(v.g) < Math.abs(best.g)) best = { f, ...v }; };
      keepBest(lo, vl); keepBest(hi, vh);
      if (!(vh.g < 0) || vl.g < 0) reason = 'この区間に根が無い';
      else {
        let fl = lo, fh = hi, side = 0;
        for (let it = 0; it < MAX_ITER; it++) {
          let fm = Number.isFinite(vl.g) ? (fh - vh.g * (fh - fl) / (vh.g - vl.g)) : 0.5 * (fl + fh);
          if (!(fm > fl && fm < fh)) fm = 0.5 * (fl + fh);
          const vm = await g(fm); keepBest(fm, vm);
          if (Math.abs(vm.g) < P_TOL_SEC && vm.r.periodSec !== null) { root = { f: fm, ...vm }; break; }
          if (vm.g > 0) { fl = fm; vl = vm; if (side === -1 && Number.isFinite(vh.g)) vh = { ...vh, g: vh.g / 2 }; side = -1; }
          else { fh = fm; vh = vm; if (side === 1 && Number.isFinite(vl.g)) vl = { ...vl, g: vl.g / 2 }; side = 1; }
          if (fh - fl < 1e-12) { root = { f: 0.5 * (fl + fh), ...(best || vm) };
            reason = '区間が 10⁻¹² まで潰れた(|ΔP| は抽出器の段差で残る)'; break; }
        }
        if (!root && best) { root = best; reason = '反復上限 — |ΔP| 最小の点を採った'; }
      }
      const rt = root ? root.r : null;
      row.byDiv[div] = { dt, fStar: root ? root.f : null, reason, evals,
        periodSec: rt ? rt.periodSec : null, degPerYear: rt ? rt.degPerYear : null,
        wRatio: (rt && rt.degPerYear !== null && W_OBS) ? rt.degPerYear / W_OBS : null,
        eProxy: rt ? rt.eProxy : null, stopped: rt ? rt.stopped : null };
      console.error(`  [valley] kF=${kFrame} dt/${div}: f*=${root ? root.f.toFixed(8) : '—'}`
        + ` ω̇=${rt && rt.degPerYear !== null ? rt.degPerYear.toFixed(4) : '—'} °/yr`
        + ` (${evals} 評価・${reason || 'root'})  [${spent.toFixed(0)}s]`);
    }
    // 2 点の一次外挿(第262便a と同じ流儀)
    const a1 = row.byDiv[1], a2 = row.byDiv[2];
    row.extrap = { fStar: (a1 && a2 && a1.fStar !== null && a2.fStar !== null) ? 2 * a2.fStar - a1.fStar : null,
      degPerYear: (a1 && a2 && a1.degPerYear !== null && a2.degPerYear !== null)
        ? 2 * a2.degPerYear - a1.degPerYear : null };
    row.extrap.wRatio = (row.extrap.degPerYear !== null && W_OBS) ? row.extrap.degPerYear / W_OBS : null;
    R.valley.rows.push(row);
  }
}

// ============================================================ §4 支配度の器と f* の相関表
if (want('dom')) {
  const IDS = arg('--dom-ids', 'alphaCenAB,siriusAB,alphaCenABDFM,siriusABDFM,psrDoubleABDFM,'
    + 'psrJ1757DFM,psrJ1946DFM,psrB1534DFM,mercuryRealKF1,earthMoonRealKF1,saturnRingRealKF1').split(',');
  R.dom = { ids: IDS, rows: [],
    note: '`HP.dfmDominance` は **3 軸を別々に返す純関数**である(1 つの数に畳まない)。'
      + 'f* は各サンプルの `massCalibration.factor`(= kFrame=1 の現行経路で立てた台帳)を読んだ値で、'
      + '**台帳が無い系は「台帳なし」と書く**(0 や 1 で埋めない)。**法則の自動分岐は実装していない。**' };
  const rows = await pg.evaluate((ids) => {
    const out = [];
    for (const id of ids) {
      const q = HP.allPresets().find((z) => z.id === id);
      if (!q) { out.push({ id, err: 'preset なし' }); continue; }
      const v = HP.validatePreset(JSON.parse(JSON.stringify(q)));
      if (!v.ok) { out.push({ id, err: (v.errors || []).join('|') }); continue; }
      const S = HP.sim; S.build(v.preset);
      const p = v.preset.physics;
      // **χ の分母と冪はエンジンの読み口から取る**(既定値が正準形に出ないので `p.frameWeight` の
      // 直読みでは pull 族を取り落とす —— `frameWeightIsPull` の既定は pull である)
      const pull = HP.frameWeightIsPull(p);
      const pw = HP.frameWeightPow(p);
      const D0 = pull ? ((p.D0pull !== undefined) ? p.D0pull : p.D0) : p.D0;
      const bodies = [];
      for (let i = 0; i < S.n; i++) bodies.push({ m: S.m[i], x: S.x[i], y: S.y[i], vx: S.vx[i], vy: S.vy[i] });
      const dom = HP.dfmDominance(bodies, { p: pw, eps: p.softening, D0 });
      const mc = q.massCalibration || null;
      out.push({ id, emoji: q.emoji, name: q.name, n: S.n, sampleClass: q.sampleClass || null,
        kFrame: p.kFrame, geoPN: p.geoPN, frameWeight: HP.frameWeightOf(p), pullPow: pw, D0, softening: p.softening,
        fLedger: (mc && Number.isFinite(mc.factor)) ? mc.factor : null,
        fLedgerLaw: mc ? mc.law : null, fQuad: (mc && Number.isFinite(mc.factorQuad)) ? mc.factorQuad : null,
        chiLedger: (mc && Array.isArray(mc.chi)) ? mc.chi.slice() : null,
        dom: dom ? { n: dom.n, massRatio: dom.massRatio, massFracTotal: dom.massFracTotal,
          chiTop: dom.chiTop, chiSecond: dom.chiSecond, chiBias: dom.chiBias,
          chiMassWeighted: dom.chiMassWeighted, chiMassWeightedTop2: dom.chiMassWeightedTop2,
          uAlign: dom.uAlign, uMagRatio: dom.uMagRatio } : null });
    }
    return out;
  }, IDS);
  R.dom.rows = rows;
  for (const z of rows) {
    console.error(`  [dom] ${z.emoji || ''} ${z.id}: n=${z.n} kF=${z.kFrame}`
      + ` 質量比=${z.dom ? z.dom.massRatio.toFixed(6) : '—'}`
      + ` χ偏り=${z.dom && z.dom.chiBias !== null ? z.dom.chiBias.toFixed(6) : '—'}`
      + ` uAlign=${z.dom && z.dom.uAlign !== null ? z.dom.uAlign.toExponential(4) : '—'}`
      + ` χ_eff=${z.dom && z.dom.chiMassWeighted !== undefined ? z.dom.chiMassWeighted.toExponential(4) : '—'}`
      + ` f*(台帳)=${z.fLedger === null ? '台帳なし' : z.fLedger.toFixed(8)}`);
  }
  // 純関数の自己検査(二体・D₀=0 で uAlign=1 厳密 / 負質量拒否)
  R.dom.selfCheck = await pg.evaluate(() => {
    const B = [{ m: 5, x: -10, y: 0, vx: 0.1, vy: -0.4 }, { m: 3, x: 12, y: 3, vx: -0.2, vy: 0.7 }];
    const d0 = HP.dfmDominance(B, { p: 2, eps: 0, D0: 0 });
    const d1 = HP.dfmDominance(B, { p: 2, eps: 0.05, D0: 1 });
    return { uAlignAtD0Zero: d0 ? d0.uAlign : null, chiAtD0Zero: d0 ? d0.chiSecond : null,
      identity2body: d1 ? Math.abs(d1.uAlign - d1.chiSecond) : null,
      massRatio: d0 ? d0.massRatio : null,
      neg: [HP.dfmDominance([{ m: -1, x: 0, y: 0 }, { m: 1, x: 1, y: 0 }], {}),
        HP.dfmDominance([{ m: 1, x: 0, y: 0 }], {})].every((z) => z === null) };
  });
  console.error('  [dom] 自己検査: ' + JSON.stringify(R.dom.selfCheck));
}

R.meta.spentSec = +spent.toFixed(1);
R.pageErrors = pageErrors.slice(0, 8);
await browser.close();
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(R, null, 1));
console.error('[w263a] wrote ' + OUT + '  (' + spent.toFixed(1) + ' s)');
