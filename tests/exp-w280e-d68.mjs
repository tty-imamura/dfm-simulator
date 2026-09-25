// 第280便e(原仮定者の裁定(第70報)「saturnZonalD(68): 観測値版で問題が出ている理由を調査する」・
// 統括の検証項目 R67): **📡 D68 の問題の分解**。
//
// ■ 何をするか(3 部)
//   (i)  **独立計算**(純関数 tests/lib-w280e-d68.mjs —— エンジンを走らせない): 📡 と同じ帯状ポテンシャル
//        U(r) で、現行の初速(帯状込みの局所円速度 × √(1+e))が作る実軌道の遠点・平均半径・近点間周期・
//        近点移動と、**宣言 a=67627 km の円軌道極限**(ε=0.05 / 0.01 / 0)を並べ、差を「半径のずれ」と
//        「有限離心率」に分ける。整合した初速(r_p=a(1−e*)・r_a=a(1+e*))と観測定義の初速
//        (r_p=a−ae・r_a=a+ae)の予測値も同じ関数で出す。
//   (ii) **実エンジン**(Chromium・内蔵 html をそのまま): **正式の抽出器と窓**(第269便a の
//        tests/exp-w268a-d68.mjs と同じ —— 近点 = ṙ の −→+ 交差・最初の 58 近点の方位を近点番号へ回帰・
//        周期は同じ 58 近点の平均・終了時刻 T=10698.816)で、条件だけを変えたコピーを刻み 3 段で測る。
//        コピーはページ内で 📡 の宣言を複製して作る(**プリセット本体は 1 bit も書き換えない**)。
//        内蔵の診断コピー 2 本(saturnD68Consistent・saturnD68ObsOrbit)は ID で走らせ、器が作った
//        同じ条件のコピーと初期状態がビット一致することを確かめる。
//   (iii) **単位換算の点検**(°/日 ↔ °/年・R_ref・J の次数)。
//
// ■ この器がしないこと
//   ・合否を言わない(門は tests/exp-w249b-calaudit.mjs)。📡 の物理・入力を変えない。
//   ・診断コピーの値を観測成功と書かない(e*=0.001 は診断用・C は既存 fit)。
//
// 実行: PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright node tests/exp-w280e-d68.mjs [--divs 1,2,4]
// 出力: tests/out/d68-w280e.json(来歴 w272e-1)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { precessionDegPerYear, YEAR_SEC } from './lib-w268a-judgement.mjs';
import { fitPeriastronStage } from './lib-w269a-periwindow.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import * as L from './lib-w280e-d68.mjs';
// 第281便a(原仮定者の裁定(第71報)・AN16・統括の検証項目 R71): **この器が読む html の領域**の宣言。
//   `tests/lib-w281a-scope.mjs` がこの領域だけの hash(`scopeSha256`)を正本の meta に刻む。
//   `lint.provenanceMeta` ② は「targetSha256 一致 **または**(scopeComplete かつ scopeSha256 が今の html で
//   引き直した値と一致)」で通す。`lint.regenScope` が「宣言 ⊇ 器のコードから機械で引いた下限
//   (HP.*・html の最上位名・内蔵プリセット id)」を照合する。**1 行の JSON**(lint が読む)。
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
const REGEN_SCOPE = {"presets":"all","roots":["$","HP.allPresets","HP.sim","HP.validatePreset","T","ZONAL_P0","applyQLock","ch","clamp","ctx","isNum","scaleExpT","validatePreset"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);   // 第281便a: 走行開始時の html の領域
const INDEX = 'file://' + path.join(ROOT, TARGET);
const OUT = path.join(ROOT, 'tests', 'out', 'd68-w280e.json');
const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(k); return (i >= 0 && argv[i + 1]) ? argv[i + 1] : d; };
const DT0 = 0.016;
const T_END = 10698.816;           // 正式の窓(第249便b の h 段 668676 步 × 0.016 と同じ終了時刻)
const FIT_PERI = 58;               // 正式の fit 窓(第270便a AD8 の 58 近点・57 区間)
const DIVS = String(arg('--divs', '1,2,4')).split(',').map(Number);
const E_STAR = L.D68_DIAG.eStar;   // 整合コピーの診断用離心率(観測入力ではない)
const EPS_COPY = L.D68_DIAG.eps;   // 診断コピーの軟化(=10 km)

// ---- 観測(CSV が正本 —— 数値を器に打たない)
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
const CSV_REL = 'paper/data/solar-observations.csv';
const csvRows = fs.readFileSync(path.join(ROOT, CSV_REL), 'utf8').split('\n')
  .filter((l) => l.startsWith('Saturn ring feature D68,')).map(parseCsvLine)
  .map((c) => ({ quantity: c[1], value: c[2] === '' ? null : Number(c[2]), unit: c[3], note: c[7] || '',
    sigma: (c[8] || '').trim() === '' ? null : Number(c[8]), record_id: c[9] || '' }));
const pick = (q, unit) => csvRows.find((r) => r.quantity === q && (!unit || r.unit === unit) && r.value !== null) || null;
const OBS = {
  prec: pick('periastron_advance', 'deg/yr'),
  ae: pick('radial_amplitude_ae', 'km'),
  a: pick('semi_major_axis', 'km'),
  radius: pick('radius', 'km'),
  n: csvRows.filter((r) => r.quantity === 'mean_motion' && r.value !== null),
  e: csvRows.find((r) => r.quantity === 'eccentricity') || null,
};
if (!OBS.prec || !OBS.prec.sigma || !OBS.ae || !OBS.a) { console.error('[w280e-d68] CSV に D68 の行が足りない'); process.exit(2); }
const epochOf = (r) => { const m = /epoch[ =]([^;]*)/.exec(r.note || ''); return m ? m[1].trim() : null; };

// ================================================================ (i) 独立計算
const D = L.D68_DECL;
const P = (eps) => ({ G: D.G, M: D.M, refR: D.refR, calib: D.calib, J: D.J, eps });
const dday = (w) => L.radPerTimeToDegPerDay(w, D.unitSec);
const dyr = (w) => L.radPerTimeToDegPerYear(w, D.unitSec);
const km = (x) => x * D.unitKm;
const orbitRow = (label, r0, vt, eps) => {
  const o = L.orbitElements(r0, vt, P(eps), 20000);
  return { label, eps, r0, vt, rpKm: km(o.rp), raKm: km(o.ra), meanRKm: km(o.meanR), eGeom: o.eGeom,
    TrSec: o.Tr * D.unitSec, dPomegaDegPerOrbit: o.dPomegaRad * 180 / Math.PI,
    rateDegPerDay: dday(o.rate), rateDegPerYear: dyr(o.rate), stepDiffDegPerYear: dyr(o.stepDiffRate) };
};
const circRow = (label, a, eps) => {
  const c = L.circularLimit(a, P(eps));
  return { label, aKm: km(a), eps, OmegaDegPerDay: dday(c.omega), kappaDegPerDay: dday(c.kappa),
    rateDegPerDay: dday(c.rate), rateDegPerYear: dyr(c.rate),
    legacyCTimesRateDegPerDay: dday(c.legacyCTimesRate),
    helperFixDegPerDay: dday(c.rate) - dday(c.legacyCTimesRate) };
};
const cur = L.currentPeriSpeed(D.aDecl, D.eDecl, P(D.eps));
const curOrbit = orbitRow('現行 📡 の初速(宣言値 x0・vy0・ε=0.05)', D.x0, D.vy0, D.eps);
const curOrbitFormula = orbitRow('現行の式で丸めない初速(ε=0.05)', cur.rp, cur.vp, D.eps);
const curOrbitEps01 = orbitRow('現行 📡 の初速・ε=0.01', D.x0, D.vy0, EPS_COPY);
const circ = [circRow('a=67627 km の円軌道極限(ε=0.05)', D.aDecl, 0.05),
  circRow('a=67627 km の円軌道極限(ε=0.01)', D.aDecl, 0.01),
  circRow('a=67627 km の円軌道極限(ε=0)', D.aDecl, 0),
  circRow('現行軌道の平均半径の円軌道極限(ε=0.05)', curOrbit.meanRKm / D.unitKm, 0.05)];
const cons = L.d68ConsistentIc();
const consOrbit = orbitRow('整合コピー(e*=0.001・ε=0.01)', cons.rp, cons.vp, EPS_COPY);
const eObs = OBS.ae.value / OBS.a.value;
const obsIc = L.d68ObsOrbitIc(OBS.ae.value, OBS.a.value);
const obsOrbit = orbitRow('観測定義コピー(r=a∓ae・ae/a=' + eObs.toPrecision(6) + '・ε=0.01)', obsIc.rp, obsIc.vp, EPS_COPY);
const cons05 = L.consistentPeriSpeed(D.aDecl, E_STAR, P(0.05));
// C=1(fit なし —— J2〜J12 だけ)の整合初速と実軌道(C=1.000302283 は D68 の ϖ̇ そのものへの fit なので対照に置く)
const PC1 = { G: D.G, M: D.M, refR: D.refR, calib: 1, J: D.J, eps: EPS_COPY };
const consC1 = L.consistentPeriSpeed(D.aDecl, E_STAR, PC1);
const consC1Orbit = (() => { const o = L.orbitElements(consC1.rp, consC1.vp, PC1, 20000);
  return { label: '整合初速・C=1(fit なし)・ε=0.01', eps: EPS_COPY, calib: 1, r0: consC1.rp, vt: consC1.vp,
    rpKm: km(o.rp), raKm: km(o.ra), meanRKm: km(o.meanR), eGeom: o.eGeom, TrSec: o.Tr * D.unitSec,
    dPomegaDegPerOrbit: o.dPomegaRad * 180 / Math.PI, rateDegPerDay: dday(o.rate), rateDegPerYear: dyr(o.rate),
    stepDiffDegPerYear: dyr(o.stepDiffRate) }; })();
const consOrbit05 = orbitRow('整合初速(e*=0.001)・ε=0.05(対照)', cons05.rp, cons05.vp, 0.05);
// 差の分解(°/日): 現行軌道 − a の円軌道極限 = (平均半径の円軌道極限 − a の円軌道極限)[半径] + (現行 − 平均半径の円軌道極限)[有限 e]
const decomp = {
  totalDegPerDay: curOrbit.rateDegPerDay - circ[0].rateDegPerDay,
  radiusShiftDegPerDay: circ[3].rateDegPerDay - circ[0].rateDegPerDay,
  finiteEDegPerDay: curOrbit.rateDegPerDay - circ[3].rateDegPerDay,
};
for (const k of Object.keys(decomp)) decomp[k.replace('DegPerDay', 'DegPerYear')] = L.degPerDayToDegPerYear(decomp[k]);
// 離心率の走査(同じ a=67627 km に整合させた初速で e だけを変える —— 📡 の e=0.05 を同じ a で整合させたときの値も出す)
const eScan = [];
for (const eps of [D.eps, EPS_COPY]) for (const e of [D.eDecl, 0.01, E_STAR, eObs]) {
  const c = L.consistentPeriSpeed(D.aDecl, e, P(eps));
  const o = orbitRow('整合初速 e=' + e, c.rp, c.vp, eps);
  eScan.push({ e, eps, meanRKm: o.meanRKm, rateDegPerYear: o.rateDegPerYear,
    nSigma: (o.rateDegPerYear - OBS.prec.value) / OBS.prec.sigma });
}
// 半径の感度(円軌道極限・ε=0.01): dϖ̇/da を ±1 km の中心差分で
const rateAt = (aUnits, eps) => dyr(L.circularLimit(aUnits, P(eps)).rate);
const dRateDaPerKm = (rateAt(D.aDecl + 0.001, EPS_COPY) - rateAt(D.aDecl - 0.001, EPS_COPY)) / 2;
// 平均運動(記録値)が同じポテンシャルで要求する半径(Ω(a)=n を二分法で解く・ε=0.01)
const aForMeanMotion = (nDegDay) => {
  let lo = 60, hi = 80;
  for (let it = 0; it < 200; it++) {
    const mid = 0.5 * (lo + hi);
    if (dday(L.circularLimit(mid, P(EPS_COPY)).omega) > nDegDay) lo = mid; else hi = mid;
  }
  const a = 0.5 * (lo + hi);
  return { nDegPerDay: nDegDay, aKm: km(a), rateDegPerYear: rateAt(a, EPS_COPY) };
};
// J の次数の打ち切り(円軌道極限・a=67627 km・ε=0)
const orderRows = [];
for (const top of L.ZONAL_ORDERS) {
  const J = {}; for (const l of L.ZONAL_ORDERS) if (l <= top) J[l] = D.J[l];
  const c = L.circularLimit(D.aDecl, { G: D.G, M: D.M, refR: D.refR, calib: D.calib, J, eps: 0 });
  orderRows.push({ upToJ: top, rateDegPerDay: dday(c.rate) });
}
// GM の入力(G×M の宣言値と、QA の解析ヘルパが使う 37931207.7 km³/s²)
const gmDecl = D.G * D.M;                       // 単位系の値(1 単位 = 10⁹ km³ / 10⁴ s²)
const gmDeclKm3s2 = gmDecl * 1e9 / 1e4;
const GM_QA = 37931207.7;
const gmRateShift = (() => {
  const PP = { GM: GM_QA / (1e9 / 1e4), refR: D.refR, calib: D.calib, J: D.J, eps: 0 };
  return dyr(L.circularLimit(D.aDecl, PP).rate) - rateAt(D.aDecl, 0);
})();

const independent = {
  potential: 'U(r) = −GM/√(r²+ε²) − C·GM/r·Σ_l A_l (R/r)^l(A_l = −J_l P_l(0)・l=2..12)。単極子だけ軟化・C はポテンシャルに掛ける',
  method: '動径運動の ODE(r̈ = −g + L²/r³・θ̇ = L/r²)を RK4 で近点 → 遠点に積分(半周期 20000 / 40000 刻み —— 差は stepDiffDegPerYear)',
  currentInitialSpeed: { declaredVy0: D.vy0, formulaVp: cur.vp, formulaVc: cur.vc,
    roundingDiff: D.vy0 - cur.vp, note: '宣言の vy0 は現行の式 √(g(r_p)·r_p·(1+e)) の小数 6 桁丸め' },
  orbits: [curOrbit, curOrbitFormula, curOrbitEps01, consOrbit, consOrbit05, obsOrbit, consC1Orbit],
  circular: circ,
  decomposition: decomp,
  eScan,
  consistentIc: { eStar: E_STAR, eps: EPS_COPY, rp: cons.rp, ra: cons.ra, vp: cons.vp },
  obsIc: { eObs, aeKm: OBS.ae.value, aKm: OBS.a.value, eps: EPS_COPY, rp: obsIc.rp, ra: obsIc.ra, vp: obsIc.vp },
  sensitivity: {
    dRateDaDegPerYearPerKm: dRateDaPerKm,
    aRoundingHalfKm: 0.5, aRoundingDegPerYear: 0.5 * Math.abs(dRateDaPerKm),
    table4RangeKm: [67618.8, 67635.1],
    table4RangeDegPerYear: [rateAt(67.6188, EPS_COPY) - rateAt(D.aDecl, EPS_COPY), rateAt(67.6351, EPS_COPY) - rateAt(D.aDecl, EPS_COPY)],
    aDriftKmPerYear: -2.4,
    note: 'a の感度は円軌道極限(ε=0.01)の中心差分。Table 4 の範囲と年 −2.4 km のドリフトは CSV の note の記載(σ ではない)',
  },
  meanMotionImpliedA: OBS.n.map((r) => aForMeanMotion(r.value)),
  meanMotionAtDeclA: dday(L.circularLimit(D.aDecl, P(EPS_COPY)).omega),
  orderTruncation: orderRows,
  gm: { declUnits: gmDecl, declKm3s2: gmDeclKm3s2, qaHelperKm3s2: GM_QA,
    relDiff: gmDeclKm3s2 / GM_QA - 1, rateShiftDegPerYear: gmRateShift,
    note: 'rateShift = QA ヘルパの GM で作った円軌道極限 − 宣言 G×M の円軌道極限(ε=0・a=67627 km)' },
};

// ================================================================ (iii) 単位換算の点検
const units = {
  csvDegPerYear: OBS.prec.value, csvSigmaDegPerYear: OBS.prec.sigma,
  degPerDayFromCsv: OBS.prec.value * 86400 / YEAR_SEC, sigmaDegPerDayFromCsv: OBS.prec.sigma * 86400 / YEAR_SEC,
  yearSec: YEAR_SEC, daysPerYear: YEAR_SEC / 86400,
  timeUnitSec: D.unitSec, timeUnitsPerDay: 86400 / D.unitSec, lengthUnitKm: D.unitKm,
  refRKm: D.refR * D.unitKm, orders: L.ZONAL_ORDERS.slice(),
  note: 'CSV の deg/yr = 38.243 deg/d × 365.25(ユリウス年)。σ 0.008 deg/d = 2.922 deg/yr。1 時間単位 = 100 s(864 単位 = 1 日)',
};

// ================================================================ (ii) 実エンジン
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

await pg.evaluate(() => {
  // 条件 c: {src, pair, eps, lambdaPN, geoPN3, ic:{x,vy}}。src の宣言を複製して条件だけ変える。
  window.__w280eMake = (c) => {
    const p = HP.allPresets().find((q) => q.id === c.src);
    if (!p) return null;
    const copy = JSON.parse(JSON.stringify(p));
    if (c.pair) copy.bodies = copy.bodies.slice(0, 2);
    copy.physics = copy.physics || {};
    if (c.eps !== undefined) copy.physics.softening = c.eps;
    if (c.lambdaPN !== undefined) copy.physics.lambdaPN = c.lambdaPN;
    if (c.calib !== undefined) copy.bodies[0].zonal.calib = c.calib;
    // geoPN=3 は較正クラスでは受理されない(検証器の門)ので、**この対照のコピーだけ** principle にする
    if (c.geoPN3) { copy.physics.geoPN = 3; copy.sampleClass = 'principle';
      copy.physics.spaceMesh = { mode: 'vertex', gravity: false, inertia: false, lawVersion: 'scalar' }; }
    if (c.ic) { copy.bodies[1].x = c.ic.x; copy.bodies[1].y = 0; copy.bodies[1].vx = 0; copy.bodies[1].vy = c.ic.vy; }
    return copy;
  };
  window.__w280eState = () => {
    const S = HP.sim; const o = [];
    for (let i = 0; i < S.n; i++) o.push([S.x[i], S.y[i], S.vx[i], S.vy[i], S.m[i]]);
    return { n: S.n, eps: S.params.softening, lambdaPN: S.params.lambdaPN, geoPN: S.params.geoPN,
      hasGeoToy: !!S.hasGeoToy, geoToyDeny: S.geoToyDeny || null, zonalCalib: S.zonal ? S.zonal.calib : null, o };
  };
  window.__w280eRun = (c, dt, tEnd) => {
    const pre = c.presetId ? HP.allPresets().find((q) => q.id === c.presetId) : window.__w280eMake(c);
    if (!pre) return { ok: false, error: 'no preset ' + (c.presetId || c.src) };
    const v = HP.validatePreset(JSON.parse(JSON.stringify(pre)));
    if (!v.ok) return { ok: false, error: 'validate: ' + (v.errors || []).join(' / ') };
    HP.sim.build(v.preset);
    const S = HP.sim, ci = 0, oi = 1, G = Number(v.preset.physics.G);
    const st0 = window.__w280eState();
    const dx0 = S.x[oi] - S.x[ci], dy0 = S.y[oi] - S.y[ci];
    const dvx0 = S.vx[oi] - S.vx[ci], dvy0 = S.vy[oi] - S.vy[ci];
    const r0 = Math.hypot(dx0, dy0), v20 = dvx0 * dvx0 + dvy0 * dvy0, mu = G * (S.m[ci] + S.m[oi]);
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
    return { ok: true, steps: k, dt, nan, rMin, rMax, pRef, A, state0: st0,
      clamp: (S.clampVN || 0) + (S.clampSN || 0) + (S.clampHN || 0) + (S.clampRN || 0) + (S.clampTN || 0),
      geoToyStop: S.geoToyStop || null, scaleExpT: Number(v.preset.scaleExp.T), warnings: v.warnings.length };
  };
});

const SRC = 'saturnZonalD68';
const CONDS = [
  { key: 'formal11', label: '現行 11 天体(📡 そのもの)', c: { src: SRC } },
  { key: 'pair', label: '土星+D68 の 2 天体', c: { src: SRC, pair: true } },
  { key: 'geo3scalar11', label: '11 天体・geoPN=3(lawVersion scalar)対照', c: { src: SRC, geoPN3: true } },
  { key: 'eps01lpn0_11', label: '11 天体・ε=0.01・λPN=0', c: { src: SRC, eps: EPS_COPY, lambdaPN: 0 } },
  { key: 'pairLpn0', label: '2 天体・λPN=0(ε=0.05)', c: { src: SRC, pair: true, lambdaPN: 0 } },
  { key: 'pairEps01', label: '2 天体・ε=0.01(λPN=1)', c: { src: SRC, pair: true, eps: EPS_COPY } },
  { key: 'pairEps01Lpn0', label: '2 天体・ε=0.01・λPN=0', c: { src: SRC, pair: true, eps: EPS_COPY, lambdaPN: 0 } },
  { key: 'consistent', label: '整合コピー(2 天体・e*=0.001・ε=0.01・既存 C)', c: { src: SRC, pair: true, eps: EPS_COPY,
    ic: { x: cons.rp, vy: cons.vp } }, presetId: 'saturnD68Consistent' },
  { key: 'obsOrbit', label: '観測定義コピー(2 天体・r=a∓ae・ε=0.01・既存 C)', c: { src: SRC, pair: true, eps: EPS_COPY,
    ic: { x: obsIc.rp, vy: obsIc.vp } }, presetId: 'saturnD68ObsOrbit' },
  { key: 'consistentC1', label: '整合初速・C=1(fit なし —— J2〜J12 だけ)・2 天体・ε=0.01', c: { src: SRC, pair: true,
    eps: EPS_COPY, calib: 1, ic: { x: consC1.rp, vy: consC1.vp } } },
];
const indepFor = { formal11: curOrbit, pair: curOrbit, pairLpn0: curOrbit, pairEps01: curOrbitEps01,
  pairEps01Lpn0: curOrbitEps01, eps01lpn0_11: curOrbitEps01, consistent: consOrbit, obsOrbit: obsOrbit, consistentC1: consC1Orbit };

const presentIds = await pg.evaluate(() => HP.allPresets().map((p) => p.id));
const rows = [];
for (const C of CONDS) {
  const stages = [];
  let presetIdentity = null;
  // 内蔵の診断コピーがあれば、その ID で走らせる(器のコピーとは初期状態の突合だけに使う)
  const runC = (C.presetId && presentIds.includes(C.presetId)) ? { presetId: C.presetId } : C.c;
  for (const div of DIVS) {
    const dt = DT0 / div;
    const t0 = Date.now();
    const r = await pg.evaluate(({ c, dt, t }) => window.__w280eRun(c, dt, t), { c: runC, dt, t: T_END });
    if (!r.ok) { console.error('[w280e-d68] ' + C.key + ': ' + r.error); await browser.close(); process.exit(2); }
    const f = fitPeriastronStage({ raw: r.A, rMin: r.rMin, rMax: r.rMax, pRef: r.pRef, dt, nFit: FIT_PERI });
    const toSec = Math.pow(10, r.scaleExpT);
    const pPeriSec = (f.perMeanSim !== null) ? f.perMeanSim * toSec : null;
    const dpy = precessionDegPerYear({ degPerOrbit: f.slopeDegPerOrbit, pPeriSec });
    const tag = div === 1 ? 'h' : ('h/' + div);
    stages.push({ tag, dt, steps: r.steps, nan: r.nan, clamp: r.clamp, warnings: r.warnings,
      geoToyStop: r.geoToyStop, nPeriFound: f.nPeriFound, nFitUsed: f.nFitUsed, dup: f.dup, jump: f.jump,
      windowComplete: f.windowComplete, slopeDegPerOrbit: f.slopeDegPerOrbit, pPeriSec,
      degPerYear: dpy, degPerDay: (dpy === null) ? null : dpy * 86400 / YEAR_SEC,
      residualDegPerYear: (dpy === null) ? null : dpy - OBS.prec.value,
      nSigma: (dpy === null) ? null : (dpy - OBS.prec.value) / OBS.prec.sigma,
      rMinKm: r.rMin * 1000, rMaxKm: r.rMax * 1000, wallSec: (Date.now() - t0) / 1000,
      state0: { n: r.state0.n, eps: r.state0.eps, lambdaPN: r.state0.lambdaPN, geoPN: r.state0.geoPN,
        hasGeoToy: r.state0.hasGeoToy, geoToyDeny: r.state0.geoToyDeny, zonalCalib: r.state0.zonalCalib,
        d68: r.state0.o[1] } });
    if (C.presetId && div === DIVS[0] && presentIds.includes(C.presetId)) {
      const a = await pg.evaluate(({ c }) => { const v = HP.validatePreset(JSON.parse(JSON.stringify(window.__w280eMake(c))));
        HP.sim.build(v.preset); return window.__w280eState(); }, { c: C.c });
      const b = await pg.evaluate(({ id }) => { const p = HP.allPresets().find((q) => q.id === id);
        const v = HP.validatePreset(JSON.parse(JSON.stringify(p))); HP.sim.build(v.preset); return window.__w280eState(); }, { id: C.presetId });
      presetIdentity = { presetId: C.presetId, sameInitialState: JSON.stringify(a) === JSON.stringify(b), harness: a.o[1], preset: b.o[1] };
    }
    console.log('[w280e-d68] ' + C.key + ' ' + tag + ' 步 ' + r.steps + ' 近点 ' + f.nPeriFound + '(fit ' + f.nFitUsed + ')'
      + ' Δϖ=' + (f.slopeDegPerOrbit === null ? '—' : f.slopeDegPerOrbit.toPrecision(12))
      + ' P=' + (pPeriSec === null ? '—' : pPeriSec.toPrecision(12)) + ' s → ' + (dpy === null ? '—' : dpy.toPrecision(12))
      + ' deg/yr (' + (dpy === null ? '—' : ((dpy - OBS.prec.value) / OBS.prec.sigma).toFixed(4)) + 'σ) [' + ((Date.now() - t0) / 1000).toFixed(1) + 's]');
  }
  const ind = indepFor[C.key] || null;
  const last = stages[stages.length - 1];
  rows.push({ key: C.key, label: C.label, cond: C.c, presetId: C.presetId || null,
    ranAs: runC.presetId ? 'preset' : 'harness-copy', presetIdentity, stages,
    stageDiffH2DegPerYear: (stages.length >= 2 && stages[0].degPerYear !== null && stages[1].degPerYear !== null)
      ? stages[1].degPerYear - stages[0].degPerYear : null,
    stageDiffLastDegPerYear: (stages.length >= 3) ? stages[stages.length - 1].degPerYear - stages[stages.length - 2].degPerYear : null,
    independentDegPerYear: ind ? ind.rateDegPerYear : null,
    engineMinusIndependentDegPerYear: (ind && last.degPerYear !== null) ? last.degPerYear - ind.rateDegPerYear : null,
    independentTrSec: ind ? ind.TrSec : null });
}
await browser.close();
const R = Object.fromEntries(rows.map((r) => [r.key, r]));
const lastOf = (k) => R[k].stages[R[k].stages.length - 1].degPerYear;
const engineDecomp = {
  judgedStage: R.formal11.stages[R.formal11.stages.length - 1].tag,
  otherParticlesDegPerYear: lastOf('formal11') - lastOf('pair'),
  pn1DegPerYear: lastOf('pair') - lastOf('pairLpn0'),
  softening005to001DegPerYear: lastOf('pairEps01Lpn0') - lastOf('pairLpn0'),
  initialGeometryDegPerYear: lastOf('consistent') - lastOf('pairEps01'),
  geo3MinusFormalDegPerYear: lastOf('geo3scalar11') - lastOf('formal11'),
  calibFitDegPerYear: lastOf('consistent') - lastOf('consistentC1'),
  note: '差はすべて判定段(最後の段)の値の差。initialGeometry = 整合コピー − 同じ ε=0.01・λPN=1 の 2 天体(初速だけが違う)',
};

const out = {
  meta: provenanceMeta({ root: ROOT, wave: '第280便e', target: TARGET,
    code: ['tests/exp-w280e-d68.mjs', 'tests/lib-w280e-d68.mjs', 'tests/lib-w269a-periwindow.mjs',
      'tests/lib-w268a-judgement.mjs', 'tests/lib-w272e-provenance.mjs'],
    inputs: [TARGET, CSV_REL] }),
  declaration: {
    window: { tEnd: T_END, fitPeri: FIT_PERI, divs: DIVS, dt0: DT0,
      why: '正式の窓(第249便b の h 段と同じ終了時刻・第270便a AD8 の 58 近点)。步数ではなく時刻を揃える' },
    extractor: '近点 = ṙ の −→+ 交差(線形内挿)。最初の 58 近点の方位を近点番号へ回帰(Δϖ)・周期は同じ 58 近点の平均・'
      + 'ϖ̇ = Δϖ × ' + YEAR_SEC + ' / P_peri(tests/exp-w268a-d68.mjs・lib-w269a-periwindow と同じ)',
    notFormal: '診断の器である —— 正式の門(tests/exp-w249b-calaudit.mjs)を置き換えない。📡 の判定は門のとおり',
    eStar: E_STAR, epsCopy: EPS_COPY,
  },
  observation: { periastronAdvance: OBS.prec, radialAmplitude: OBS.ae, semiMajorAxis: OBS.a, radius: OBS.radius,
    meanMotion: OBS.n, eccentricity: OBS.e,
    epochs: { prec: epochOf(OBS.prec), ae: epochOf(OBS.ae), a: epochOf(OBS.a), n: OBS.n.map(epochOf) } },
  independent, units, engine: rows, engineDecomp,
  reproduction: (() => {
    let prev = null;
    try { prev = JSON.parse(fs.readFileSync(path.join(ROOT, 'tests/out/d68-w268a.json'), 'utf8')); } catch { prev = null; }
    if (!prev) return null;
    return prev.stages.map((s, i) => ({ tag: s.tag, w268a: s.degPerYear,
      w280e: R.formal11.stages[i] ? R.formal11.stages[i].degPerYear : null,
      diff: R.formal11.stages[i] ? R.formal11.stages[i].degPerYear - s.degPerYear : null }));
  })(),
  doNotWrite: ['D68 が合(3σ)', '観測一致を達成した', '較正を完了した', 'e*=0.001 のコピーで観測を再現した',
    '引きずりで説明できた', 'C を再 fit した'],
  pageErrors,
};
fs.mkdirSync(path.dirname(OUT), { recursive: true });
Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));   // 第281便a: 領域 hash の 3 欄 + JSON 入力の安定 hash
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log('[w280e-d68] 独立計算: 現行軌道 ' + curOrbit.rateDegPerDay.toFixed(6) + ' °/日(平均半径 ' + curOrbit.meanRKm.toFixed(2)
  + ' km)/ a の円軌道極限 ε=0.05 ' + circ[0].rateDegPerDay.toFixed(6) + '・ε=0 ' + circ[2].rateDegPerDay.toFixed(6)
  + ' / 整合 ' + consOrbit.rateDegPerYear.toFixed(4) + ' deg/yr / 観測定義 ' + obsOrbit.rateDegPerYear.toFixed(4) + ' deg/yr');
console.log('[w280e-d68] 分解(deg/yr): ' + JSON.stringify(engineDecomp));
console.log('→ ' + path.relative(ROOT, OUT));
