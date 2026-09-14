// 第262便a(第54報 W1)「現行経路の**釣り合い曲線** f(kFrame)」。
//
// ■ この器が答える 1 つの問い
//   原仮定者(第54報)「D₀=0 は想定して無い。引きずりが強いので質量を約二倍にしているのであり、
//   **引きずりが弱まれば、途中で釣り合うバランスが有る**と想定している」。
//   —— では **kFrame を 0→1 で刻んだとき、観測周期を再現する質量係数 f はどう動くのか**。
//   各 kFrame で **近点間 P が観測 P_b になる f を根探索**し、f(kFrame)・ω̇(kFrame)・e・χ を並べる。
//
// ■ 測る量の定義(段をまたいで同じであることが読む前提)
//   **近点間 P** = 位相制限(1.5π)の検出器が採った最初の 20 近点(19 区間)の平均間隔
//   (`tests/lib-precision-diagnostics.mjs` の `createPeriastronDetector` — 第261便c)。
//   **これは ⚡ の較正が使った定義とは限らない**(⚡ の較正は fitDt=0.016 の一次則の不動点で、
//   本器の f(1) が 1.99994 と一致することは**要求していない**)。差はそのまま表に出す。
//   ω̇ は採用近点の方位を**実時刻に回帰**した傾き(°/年・ユリウス年 3.15576×10⁷ s の約束)。
//
// ■ 2 つの族を**両方**走らせる(第46報「判断出来ない場合は、各案を実装して検証を行う」)
//   族B「📻型」… 観測版 📻 の JSON に **質量係数 f と kFrame だけ**を当てる(コア無し・
//                 coupleSink:"reservoir")。**f=1・kFrame=0 は 📻 そのもの**に戻る連続な族。
//   族A「⚡型」… DFM 版 ⚡ の JSON に f と kFrame を当て、**コア v2 を残して massFrac=(f−1)/f**
//                 (第224便)を張り直す。**f→1 で massFrac→0 が検証器の下限 0.01 に当たる**ので、
//                 f≲1.0101 では族A は不連続である —— それも含めて表に出す。
//
// ■ 触らないもの
//   `beta/index.html` は**読むだけ**。本体 📻 と ⚡ の JSON を 1 bit も書き換えない
//   (走行用のコピーをページの中で作って捨てる)。`S._core` には 1 命令も足していない。
//
// 実行: node tests/exp-w262a-balance.mjs [--kframes 0,0.1,0.25,0.5,0.75,1] [--divs 1,2] [--budget-total 5400]
// 出力: tests/out/balance-w262a.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + path.join(ROOT, TARGET);
const OUT = path.join(ROOT, 'tests', 'out', 'balance-w262a.json');
const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(k); return (i >= 0 && argv[i + 1]) ? argv[i + 1] : d; };
const KFRAMES = arg('--kframes', '0,0.1,0.25,0.5,0.6,0.7,0.75,1').split(',').map(Number);
const DIVS = arg('--divs', '1,2').split(',').map(Number).filter((z) => z > 0);
const BUDGET_TOTAL_S = Number(arg('--budget-total', 5400));
const FAMILIES = arg('--families', 'B,A').split(',');
const DT0 = 0.016;
const PERI_WINDOW = 20;
const YEAR_SEC = 31557600;      // ユリウス年(**単位の約束**であって観測ではない)
const F_LO = 1, F_HI = 2.1;     // 根探索の初期区間(指示された区間)
const P_TOL_SEC = 1e-3;         // |P−P_obs| がこれを下回ったら止める(観測 σ の 4×10³ 倍 —— 精度主張ではない)
const MAX_ITER = 34;

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
const pick = (q) => OBS.find((r) => r.body === 'PSR J0737-3039 B' && r.quantity === q) || null;
const obsP = pick('orbital_period'), obsE = pick('eccentricity'), obsW = pick('periastron_advance');
if (!obsP) { console.error('[w262a] 観測周期の行が CSV に無い'); process.exit(2); }

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
const libOk = await pg.evaluate(() => typeof createPeriastronDetector === 'function'
  && typeof psrMassScaled === 'function');
if (!libOk) { console.error('[w262a] lib がページへ入っていない'); await browser.close(); process.exit(2); }

await pg.evaluate(({ PERI_WINDOW }) => {
  // 1 走行。**離脱で打ち切る**(束縛していない構成に周期は無い —— 0 で埋めない)
  window.__w262aRun = (family, f, kFrame, dt, maxSteps, budgetMs, escFactor) => {
    const srcId = (family === 'A') ? 'psrDoubleABDFM' : 'psrDoubleAB';
    const src = HP.allPresets().find((q) => q.id === srcId);
    const pd = psrMassScaled(src, f, { kFrame, keepCore: (family === 'A'), id: 'w262aDiag' });
    const v = HP.validatePreset(pd);
    if (!v.ok) return { ok: false, errors: v.errors };
    HP.sim.build(v.preset);
    const S = HP.sim, ci = 0, oi = 1;
    const det = createPeriastronDetector({ phaseGate: 1.5 * Math.PI });
    const t0 = performance.now();
    const r00 = Math.hypot(S.x[oi] - S.x[ci], S.y[oi] - S.y[ci]);
    let k = 0, stopped = 'window', nPeri = 0, inWin = false;
    let rMin = Infinity, rMax = -Infinity, rMinAll = r00, rMaxAll = r00;
    for (; k < maxSteps; k++) {
      S.step(dt);
      const dx = S.x[oi] - S.x[ci], dy = S.y[oi] - S.y[ci];
      const rr = Math.hypot(dx, dy), th = Math.atan2(dy, dx);
      const dvx = S.vx[oi] - S.vx[ci], dvy = S.vy[oi] - S.vy[ci];
      const rd = (rr > 0) ? (dx * dvx + dy * dvy) / rr : 0;
      if (rr < rMinAll) rMinAll = rr;
      if (rr > rMaxAll) rMaxAll = rr;
      if (inWin) { if (rr < rMin) rMin = rr; if (rr > rMax) rMax = rr; }
      const a = det.push(k, rr, rd, th);
      if (a.accepted) { nPeri++; inWin = true; }
      if (nPeri >= PERI_WINDOW) { stopped = 'window'; break; }
      if (rr > escFactor * r00) { stopped = 'escape'; break; }
      if (S.hasNaN()) { stopped = 'nan'; break; }
      if ((k & 65535) === 0 && (performance.now() - t0) > budgetMs) { stopped = 'time-budget'; break; }
    }
    if (k >= maxSteps) stopped = 'max-steps';
    const res = det.result(PERI_WINDOW);
    const full = res.measured;
    const peri = res.peri, ang = res.ang;
    let slopeT = null, seT = null;
    if (ang.length >= 3) {
      const m = ang.length;
      const xs = ang.map((_, i) => peri[i].k * dt);
      const mx = xs.reduce((a2, b) => a2 + b, 0) / m, my = ang.reduce((a2, b) => a2 + b, 0) / m;
      let sxy = 0, sxx = 0;
      for (let i = 0; i < m; i++) { sxy += (xs[i] - mx) * (ang[i] - my); sxx += (xs[i] - mx) * (xs[i] - mx); }
      if (sxx > 0) {
        slopeT = sxy / sxx;
        seT = Math.sqrt(ang.reduce((s, y, i) => s + (y - (my + slopeT * (xs[i] - mx))) ** 2, 0) / (m - 2) / sxx);
      }
    }
    return { ok: true, steps: k, stopped, nan: S.hasNaN(), nPeri: res.nPeri,
      candidates: res.candidates, rejected: res.rejectedCount, unwrapFailed: res.unwrapFailed,
      clamp: (S.clampVN || 0) + (S.clampSN || 0) + (S.clampHN || 0) + (S.clampRN || 0) + (S.clampTN || 0),
      perMeanSim: full ? (peri[PERI_WINDOW - 1].k - peri[0].k) * dt / (PERI_WINDOW - 1) : null,
      slopeRadPerSimTime: slopeT, seRadPerSimTime: seT,
      r0: r00, rMin: Number.isFinite(rMin) ? rMin : null, rMax: Number.isFinite(rMax) ? rMax : null,
      rMinAll, rMaxAll,
      eProxy: (rMax > 0 && rMax + rMin > 0) ? (rMax - rMin) / (rMax + rMin) : null,
      mHeld: [S.m[ci], S.m[oi]],
      chiDecl: [pullChi(v.preset.bodies[1].m, r00, v.preset.physics.D0pull !== undefined
        ? v.preset.physics.D0pull : v.preset.physics.D0, v.preset.physics.softening, 2),
      pullChi(v.preset.bodies[0].m, r00, v.preset.physics.D0pull !== undefined
        ? v.preset.physics.D0pull : v.preset.physics.D0, v.preset.physics.softening, 2)],
      sig: JSON.stringify(v.preset.physics), warn: (v.warnings || []).length };
  };
  // 族B・f=1・kFrame=0 が 📻 とビット同一であることの対照(600 步)
  window.__w262aIdentity = () => {
    const src = HP.allPresets().find((q) => q.id === 'psrDoubleAB');
    const run = (pd) => {
      const v = HP.validatePreset(JSON.parse(JSON.stringify(pd)));
      const S = HP.sim; S.build(v.preset);
      for (let i = 0; i < 600; i++) S.step(0.016);
      return [S.x[0], S.y[0], S.vx[0], S.vy[0], S.x[1], S.y[1], S.vx[1], S.vy[1]];
    };
    const a = run(src);
    const b = run(psrMassScaled(src, 1, { kFrame: 0, keepCore: false, id: 'w262aDiag' }));
    return { base: a, diag: b, same: a.every((z, i) => Object.is(z, b[i])) };
  };
}, { PERI_WINDOW });

const toSec = await pg.evaluate(() => Math.pow(10,
  Number(HP.allPresets().find((q) => q.id === 'psrDoubleAB').scaleExp.T)));
const identity = await pg.evaluate(() => window.__w262aIdentity());
console.error('[w262a] 族B f=1 kF0 が 📻 と 600 步ビット同一: ' + identity.same);

const out = { meta: { wave: '第262便a', target: TARGET, dt0: DT0, periWindow: PERI_WINDOW,
  yearSec: YEAR_SEC, fInterval: [F_LO, F_HI], pTolSec: P_TOL_SEC, kFrames: KFRAMES, divs: DIVS,
  metric: '**近点間 P** = 位相制限(1.5π)の最初の 20 近点(19 区間)の平均間隔。'
    + 'ω̇ は採用近点の方位を**実時刻**に回帰した傾き。',
  notMetric: '**⚡ の較正が使った定義と同じとは限らない** —— f(kFrame=1) が massCalibration の '
    + '1.99994 に一致することは要求していない。',
  families: { B: '📻(観測版)の JSON に質量係数 f と kFrame だけを当てた連続な族(コア無し・'
      + 'coupleSink:"reservoir")。f=1・kFrame=0 は 📻 そのもの。',
    A: '⚡(DFM 版)の JSON に f と kFrame を当て、コア v2 の massFrac=(f−1)/f(第224便)を'
      + '張り直した族。**f≲1.0101 では massFrac が検証器の下限 0.01 に当たり不連続**。' },
  touched: '**本体 📻 と ⚡ の JSON は 1 bit も書き換えていない**(走行用のコピーをページ内で作る)。'
    + '`S._core` には 1 命令も足していない。',
  claim: '**この表は較正則ではない。** 交差が出ても採らない(Negative Claim 27)。' },
  obs: { period: obsP, ecc: obsE, omegaDot: obsW }, identity, rows: [], pageErrors: [] };

const P_OBS = obsP.value, SIG = obsP.sigma;
let spent = 0;
const evalOne = async (family, f, kFrame, dt) => {
  const t0 = Date.now();
  const r = await pg.evaluate(({ family, f, kFrame, dt }) =>
    window.__w262aRun(family, f, kFrame, dt, 4e8, 240000, 4),
  { family, f, kFrame, dt });
  spent += (Date.now() - t0) / 1000;
  r.f = f;
  r.periodSec = (r.ok && r.perMeanSim !== null) ? r.perMeanSim * toSec : null;
  r.degPerYear = (r.ok && r.slopeRadPerSimTime !== null)
    ? r.slopeRadPerSimTime * 180 / Math.PI / toSec * YEAR_SEC : null;
  r.seDegPerYear = (r.ok && r.seRadPerSimTime !== null && r.seRadPerSimTime !== null)
    ? r.seRadPerSimTime * 180 / Math.PI / toSec * YEAR_SEC : null;
  return r;
};

for (const div of DIVS) {
  const dt = DT0 / div;
  for (const family of FAMILIES) {
    for (const kFrame of KFRAMES) {
      if (spent > BUDGET_TOTAL_S) {
        out.rows.push({ family, kFrame, div, dt, truncated: true,
          note: '**予算で止めた**(失敗ではない)。この点は「未走行」と表に書く。' });
        console.error(`  [予算] 族${family} kF=${kFrame} dt/${div} は未走行`);
        continue;
      }
      // g(f) = P(f) − P_obs。**束縛していない構成には周期が無い**ので +∞(質量が足りない側)とする。
      const trace = [];
      const g = async (f) => {
        const r = await evalOne(family, f, kFrame, dt);
        trace.push({ f, periodSec: r.periodSec, stopped: r.stopped, nPeri: r.nPeri,
          eProxy: r.eProxy, degPerYear: r.degPerYear });
        return { r, g: (r.periodSec === null) ? Infinity : (r.periodSec - P_OBS) };
      };
      let lo = F_LO, hi = F_HI;
      let gl = await g(lo), gh = await g(hi);
      let root = null, reason = null, best = null;
      const keepBest = (f, v) => {
        if (v.r.periodSec === null) return;
        if (!best || Math.abs(v.g) < Math.abs(best.g)) best = { f, ...v };
      };
      keepBest(lo, gl); keepBest(hi, gh);
      if (!(gh.g < 0)) reason = 'f=' + F_HI + ' でもまだ P > P_obs(この区間に根が無い)';
      else if (gl.g < 0) reason = 'f=' + F_LO + ' で既に P < P_obs(この区間に根が無い)';
      else {
        let fl = lo, fh = hi, vl = gl, vh = gh, side = 0;
        for (let it = 0; it < MAX_ITER; it++) {
          let fm;
          if (Number.isFinite(vl.g)) {
            // Illinois(改良 regula falsi)
            fm = fh - vh.g * (fh - fl) / (vh.g - vl.g);
            if (!(fm > fl && fm < fh)) fm = 0.5 * (fl + fh);
          } else fm = 0.5 * (fl + fh);
          const vm = await g(fm);
          keepBest(fm, vm);
          if (Math.abs(vm.g) < P_TOL_SEC && vm.r.periodSec !== null) { root = { f: fm, ...vm }; break; }
          if (vm.g > 0) { fl = fm; vl = vm; if (side === -1 && Number.isFinite(vh.g)) vh = { ...vh, g: vh.g / 2 }; side = -1; }
          else { fh = fm; vh = vm; if (side === 1 && Number.isFinite(vl.g)) vl = { ...vl, g: vl.g / 2 }; side = 1; }
          if (fh - fl < 1e-12) {
            // **区間が潰れても |ΔP| が許容へ入らないことがある**: 位相制限(1.5π)の採否が f に対して
            // 切り替わる点で、窓の 20 個目が 1 公転ぶん入れ替わり **P が段差で跳ぶ**ためである
            // (根の位置 f は 10⁻¹² まで決まっていて、残差はこの段差の高さである)。
            root = { f: 0.5 * (fl + fh), ...(best || vm) };
            reason = '区間が 10⁻¹² まで潰れた(|ΔP| は抽出器の段差で残る)';
            break;
          }
        }
        if (!root && best) { root = best; reason = '反復上限(' + MAX_ITER + ')— |ΔP| 最小の点を採った'; }
        else if (!root) reason = '反復上限(' + MAX_ITER + ')で収束しなかった';
      }
      const rec = { family, kFrame, div, dt, fRoot: root ? root.f : null, reason,
        deltaPSec: (root && root.r && root.r.periodSec !== null) ? root.r.periodSec - P_OBS : null,
        nSigma: (root && root.r && root.r.periodSec !== null && SIG)
          ? Math.abs(root.r.periodSec - P_OBS) / SIG : null,
        run: root ? root.r : null, trace, spentSec: +spent.toFixed(1) };
      out.rows.push(rec);
      const R = root ? root.r : null;
      console.error(`  族${family} kF=${kFrame} dt/${div}: f=${root ? root.f.toFixed(8) : '—'}`
        + `  P=${R && R.periodSec !== null ? R.periodSec.toFixed(6) : '—'} s`
        + `  e=${R && R.eProxy !== null ? R.eProxy.toFixed(7) : '—'}`
        + `  ω̇=${R && R.degPerYear !== null ? R.degPerYear.toFixed(4) : '—'} °/yr`
        + `  χ=${R && R.chiDecl ? R.chiDecl.map((z) => z === null ? '—' : z.toFixed(6)).join('/') : '—'}`
        + `  ΔP=${rec.deltaPSec === null ? '—' : rec.deltaPSec.toExponential(2)} s`
        + `  (${trace.length} 回評価・${reason || 'root'})`);
    }
  }
}

out.meta.spentSec = +spent.toFixed(1);
out.pageErrors = pageErrors;
await browser.close();
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.error('[w262a] wrote ' + OUT + '  (' + spent.toFixed(1) + ' s)');
if (SIG) console.error('[w262a] 観測 σ=' + SIG + ' s / 根の許容 ' + P_TOL_SEC + ' s = ' + (P_TOL_SEC / SIG).toFixed(0) + 'σ');
