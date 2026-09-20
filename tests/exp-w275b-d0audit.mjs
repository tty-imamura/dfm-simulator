// 第275便b(原仮定者の裁定〔第65報〕(2))— **D₀ の単位監査・規則適用表・源分割不変性試験**。
//
// ■ 裁定(第65報 (2))の字義
//   「**D₀ は『何を背景とするか』でサンプル毎に変わる**(慣習の一値を固定しない):
//     太陽を表示するなら太陽は背景に含まない / 表示しないなら太陽からの距離で変わる /
//     太陽系外は銀河内位置 / 銀河は自身を含まない。**D₀ の補正は冥王星とカロンで検証する。**
//     **D₀ は距離に反比例する決定力の総和なので、距離の二乗に反比例する空間メッシュ=
//     複素決定力場では使わない。**」
//
// ■ 何をするか / しないか
//   ・**内蔵 128 本の D₀ の値は 1 本も変えない**(本器はページを読むだけ)。
//   ・較正 37 本 + 🪁🎋 について、`scaleExp` から **D₀ の SI 値**を作り、**規則で計算した D_bg** と
//     並べ、比 D₀/D_bg を出す。**仮定はすべて列挙する**(`tests/lib-w275b-dsplit.mjs` の ASSUMPTIONS)。
//   ・**源分割不変性試験**: 🌇 venusReal で「太陽を置いて背景から外す」と「太陽を置かずに背景へ畳む」を
//     比べ、(a) 基準点での D 総和が一致するか(純関数)、(b) kF0/kF1 の短窓軌道がどうなるか(実走行)。
//   ・**判定はしない**。「D₀ を較正した」「規則値が正しい」とは書かない。
//
// ■ 走行前に固定した契約(この節を先に書いてから 1 本目を回した)
//   ・短窓は 🌇 venusReal の **同方向 1 周 3 本まで(ORB_MAX=3)**・判定に使うのは **2 周目**。
//   ・3 段は h=0.016 / h/2=0.008 / h/4=0.004 で**物理時間を揃える**(步数は 2 倍ずつ)。
//     步数上限は h 段 400,000 步(= 約 3.3 公転 —— 金星の公転は 1941.4 時間単位)。
//   ・終了条件は ① 步数上限 ② 同方向 1 周が ORB_MAX 本 ③ NaN。停止理由を記録する。
//   ・観測値は `tests/out/calaudit-w249.json` の採用行から引く(**手打ちしない**)。
//
// 実行:
//   PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright node tests/exp-w275b-d0audit.mjs
// 出力: tests/out/d0audit-w275b.json(CANON・来歴は lib-w272e-provenance の形)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { DSPLIT_VERSION, ASSUMPTIONS, assumptionRows, determinacySum, splitInvariance,
  ruleBackgroundSI, d0UnitSI } from './lib-w275b-dsplit.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + path.join(ROOT, TARGET);
const OUT = path.join(ROOT, 'tests', 'out', 'd0audit-w275b.json');
const CALAUDIT = path.join(ROOT, 'tests', 'out', 'calaudit-w249.json');
const HARNESS_VERSION = 'w275b-d0audit-1';

const argv = process.argv.slice(2);
const getArg = (k, d) => { const i = argv.indexOf(k); return (i >= 0 && argv[i + 1]) ? argv[i + 1] : d; };
const QUICK = argv.includes('--quick');

// ---- 固定契約 -------------------------------------------------------------------
const ORB_MAX = 3, JUDGED_REV = 1;                    // 判定に使うのは 2 周目(index 1)
const STAGES = { h: { dt: 0.016, steps: 400000 }, h2: { dt: 0.008, steps: 800000 },
  h4: { dt: 0.004, steps: 1600000 } };
const SPLIT_PRESET = 'venusReal';
const TOY_IDS = ['galaxyMeshSpiralGeoToy', 'galaxyMeshSpiralGeoToyLite'];

// ---- 宣言(仮定): サンプルが「どこに在るか」-----------------------------------
//   規則は「太陽系の中か / 太陽系外(銀河内)か / 銀河の外か」でしか分かれない。
//   **この表は宣言であって測定ではない**(どの群に属するかは内蔵の group からも読めるが、
//   GW150914 のような系外の系は group だけでは分けられないので、ここに明示で置く)。
const SITE = {
  earthMoonReal: 'solar-system', earthMoonRealKF1: 'solar-system', emAuditDFM: 'solar-system',
  emAuditSolar: 'solar-system', mercuryReal: 'solar-system', mercuryRealKF1: 'solar-system',
  solarInner: 'solar-system', jupiterGalilean: 'solar-system', venusReal: 'solar-system',
  marsMoonsReal: 'solar-system', plutoCharonReal: 'solar-system', uranusReal: 'solar-system',
  neptuneReal: 'solar-system', saturnZonalD68: 'solar-system', saturnRingReal: 'solar-system',
  saturnRingRealKF1: 'solar-system',
  alphaCenAB: 'galactic', alphaCenABDFM: 'galactic', siriusAB: 'galactic', siriusABDFM: 'galactic',
  psrDoubleAB: 'galactic', psrDoubleABDFM: 'galactic', psrDoubleABSpinCal: 'galactic',
  psrJ1757DFM: 'galactic', psrJ1946DFM: 'galactic', psrDoubleABPN: 'galactic',
  psrJ1757PN: 'galactic', psrJ1946PN: 'galactic', psrDoubleABCF: 'galactic',
  psrJ1757CF: 'galactic', psrJ1946CF: 'galactic', psrB1534: 'galactic', psrB1534DFM: 'galactic',
  psrB1534CF: 'galactic',
  gw150914: 'extragalactic', gw150914DFM: 'extragalactic', gw150914Merge4s: 'extragalactic',
  galaxyMeshSpiralGeoToy: 'toy', galaxyMeshSpiralGeoToyLite: 'toy',
};
// 太陽を置かない太陽系サンプルの「太陽からの距離」(軌道長半径 —— 仮定値)
const HELIO_BODY = {
  earthMoonReal: 'earth', earthMoonRealKF1: 'earth', emAuditDFM: 'earth',
  jupiterGalilean: 'jupiter', marsMoonsReal: 'mars', plutoCharonReal: 'pluto',
  uranusReal: 'uranus', neptuneReal: 'neptune',
  saturnZonalD68: 'saturn', saturnRingReal: 'saturn', saturnRingRealKF1: 'saturn',
};

// ================================================================ ブラウザ
const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let browser;
try { browser = await req('playwright').chromium.launch(); }
catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }
const pageErrors = [];
const page = await browser.newPage();
page.on('pageerror', (e) => pageErrors.push(String(e)));
await page.goto(INDEX, { waitUntil: 'load' });
await page.waitForFunction(() => window.HP && HP.sim);

// ---------------------------------------------------------------- ページ側ヘルパ
await page.evaluate((W) => {
  window.__w275b = {};
  // 宣言値の読み出し(**build 後の実効値**も併せて出す —— 検証器が落とした鍵が見えるように)
  window.__w275b.declared = (id) => {
    const src = HP.allPresets().find((q) => q.id === id);
    if (!src) return { id, error: 'missing' };
    const v = HP.validatePreset(JSON.parse(JSON.stringify(src)));
    if (!v.ok) return { id, error: v.errors };
    const ph = v.preset.physics;
    const bodies = (v.preset.bodies || []).map((b) => ({ type: b.type || 'single', m: b.m,
      x: b.x, y: b.y, n: b.n === undefined ? null : b.n }));
    return { id, emoji: src.emoji, name: src.name, group: src.group, sampleClass: src.sampleClass,
      scaleExp: src.scaleExp || null, D0: ph.D0, D0pull: ph.D0pull === undefined ? null : ph.D0pull,
      frameWeight: ph.frameWeight === undefined ? null : ph.frameWeight,
      framePow: HP.frameWeightPow ? HP.frameWeightPow(ph) : null,
      kFrame: ph.kFrame, softening: ph.softening, geoPN: ph.geoPN,
      D0Source: ph.D0Source === undefined ? null : ph.D0Source,
      bodies, nBodies: bodies.length };
  };
  // 🌇 の診断コピー(**内蔵は 1 bit も触らない**)。太陽を外す/D₀ を替える/kFrame を替える
  window.__w275b.makeSplit = (cfg) => {
    const src = HP.allPresets().find((q) => q.id === cfg.preset);
    const p = JSON.parse(JSON.stringify(src));
    if (cfg.dropSun) p.bodies = p.bodies.slice(1);              // 第 1 天体(太陽)を置かない
    if (cfg.D0 !== undefined) p.physics.D0 = cfg.D0;
    if (cfg.kFrame !== undefined) p.physics.kFrame = cfg.kFrame;
    if (cfg.D0Source) p.physics.D0Source = cfg.D0Source;
    return p;
  };
  // 2 体の同方向 1 周を測る最小の走行(❄️ の器と同じ角度アンラップ・線形内挿)
  window.__w275b.run = (cfg, dt, maxSteps) => {
    const p = window.__w275b.makeSplit(cfg);
    const v = HP.validatePreset(p);
    if (!v.ok) return { error: 'validate', errors: v.errors };
    HP.sim.build(v.preset);
    const S = HP.sim;
    const n0 = S.n;
    if (n0 < 2) {
      // **天体が 1 つしか無い** —— 相対角が定義できない。0 で埋めずにそのまま返す
      let k = 0; const x0 = S.x[0], y0 = S.y[0];
      for (; k < Math.min(maxSteps, 200000); k++) S.step(dt);
      return { single: true, steps: k, dt, n: n0, drift: Math.hypot(S.x[0] - x0, S.y[0] - y0),
        speed: Math.hypot(S.vx[0], S.vy[0]), nan: S.hasNaN(), stop: 'singleBody',
        cfgApplied: { D0: S.params.D0, kFrame: S.params.kFrame, softening: S.params.softening } };
    }
    const ci = 0, oi = 1;
    let angAcc = 0, angPrev = Math.atan2(S.y[oi] - S.y[ci], S.x[oi] - S.x[ci]);
    const rev = []; let rMin = Infinity, rMax = -Infinity;
    let k = 0, stop = 'steps', nan = false;
    const sampleEvery = Math.max(1, Math.round(maxSteps / 2000));
    for (; k < maxSteps; k++) {
      S.step(dt);
      const dx = S.x[oi] - S.x[ci], dy = S.y[oi] - S.y[ci];
      const rr = Math.hypot(dx, dy), th = Math.atan2(dy, dx);
      if (rr < rMin) rMin = rr; if (rr > rMax) rMax = rr;
      let d = th - angPrev; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
      const prevAcc = angAcc; angAcc += d; angPrev = th;
      const nPrev = Math.floor(Math.abs(prevAcc) / (2 * Math.PI));
      const nNow = Math.floor(Math.abs(angAcc) / (2 * Math.PI));
      if (nNow > nPrev && rev.length < W.ORB_MAX + 2) {
        const target = Math.sign(angAcc) * nNow * 2 * Math.PI;
        const fr = (angAcc !== prevAcc) ? (target - prevAcc) / (angAcc - prevAcc) : 0;
        rev.push((k - 1 + fr) * dt);
      }
      if (k % sampleEvery === 0 && S.hasNaN()) { nan = true; stop = 'nan'; break; }
      if (rev.length >= W.ORB_MAX) { stop = 'orbMax'; break; }
    }
    const revP = []; for (let i = 0; i < rev.length; i++) revP.push(i ? rev[i] - rev[i - 1] : rev[0]);
    return { single: false, steps: k, dt, n: n0, stop, nan, rev: revP, revN: revP.length,
      rMin, rMax, eProxy: (rMax + rMin > 0) ? (rMax - rMin) / (rMax + rMin) : null,
      clamp: { V: S.clampVN, S: S.clampSN, H: S.clampHN, A: S.clampAN, R: S.clampRN, T: S.clampTN },
      cfgApplied: { D0: S.params.D0, kFrame: S.params.kFrame, softening: S.params.softening,
        frameWeight: S.params.frameWeight, nBodies: n0 } };
  };
  // t=0 の実座標(源分割不変性の純関数へ渡す材料)
  window.__w275b.state0 = (cfg) => {
    const p = window.__w275b.makeSplit(cfg);
    const v = HP.validatePreset(p);
    if (!v.ok) return { error: v.errors };
    HP.sim.build(v.preset);
    const S = HP.sim, out = [];
    for (let i = 0; i < S.n; i++) out.push({ i, m: S.m[i], x: S.x[i], y: S.y[i] });
    return { n: S.n, bodies: out, D0: S.params.D0, softening: S.params.softening };
  };
}, { ORB_MAX });

// ---------------------------------------------------------------- ① 単位監査と規則適用表
const ids = await page.evaluate(() => HP.allPresets()
  .filter((p) => p.sampleClass === 'calibration'
    || ['galaxyMeshSpiralGeoToy', 'galaxyMeshSpiralGeoToyLite'].indexOf(p.id) >= 0)
  .map((p) => p.id));

const Msun = ASSUMPTIONS.sunMassKg.value;
const AU = ASSUMPTIONS.auMeters.value;
const audit = [];
for (const id of ids) {
  const d = await page.evaluate((z) => window.__w275b.declared(z), id);
  if (d.error) { audit.push({ id, error: d.error }); continue; }
  const pw = d.framePow === null ? (d.frameWeight === 'share' ? 1 : 2) : d.framePow;
  // **エンジンが実際に χ の分母へ入れる数**(`dfmGeoToyStep` の D0p と同じ読み方)
  const d0Used = (pw >= 2 && d.D0pull !== null && d.D0pull !== undefined) ? d.D0pull : d.D0;
  const d0UsedKey = (pw >= 2 && d.D0pull !== null && d.D0pull !== undefined) ? 'physics.D0pull' : 'physics.D0';
  const unit = d0UnitSI(d.scaleExp, pw);
  const unitP1 = d0UnitSI(d.scaleExp, 1), unitP2 = d0UnitSI(d.scaleExp, 2);
  // **質量の SI**(太陽を置いているか — 機械判定)
  const mUnit = d.scaleExp ? Math.pow(10, Number(d.scaleExp.M)) : null;
  const masses = d.bodies.map((b) => (mUnit !== null && Number.isFinite(Number(b.m)))
    ? Number(b.m) * mUnit : null);
  const placesSun = masses.some((m) => m !== null && Math.abs(m / Msun - 1) < 1e-3);
  const site = SITE[id] || null;
  let rule = null, why = null;
  if (site === 'solar-system') rule = placesSun ? 'solar-excluded' : 'heliocentric';
  else if (site === 'galactic') rule = 'galactic';
  else if (site === 'extragalactic') { rule = null; why = 'ホスト銀河の質量分布が宣言されていない(系外)'; }
  else if (site === 'toy') { rule = null; why = 'トイ(実在の背景が無い・scaleExp も宣言していない)'; }
  else why = '所在が宣言されていない';
  let rMeters = null, planet = null;
  if (rule === 'heliocentric') {
    planet = HELIO_BODY[id] || null;
    if (planet) rMeters = ASSUMPTIONS.semiMajorAxisAu.value[planet] * AU;
    else why = '太陽からの距離が宣言されていない';
  }
  const rb = rule ? ruleBackgroundSI(rule, { heliocentricDistanceM: rMeters }) : null;
  const d0SI = (unit !== null && Number.isFinite(d0Used)) ? d0Used * unit : null;
  const dbgSI = rb ? (pw >= 2 ? rb.p2 : rb.p1) : null;
  audit.push({ id, emoji: d.emoji, group: d.group, site, scaleExp: d.scaleExp,
    frameWeight: d.frameWeight, framePow: pw, D0: d.D0, D0pull: d.D0pull,
    d0Used, d0UsedKey, kFrame: d.kFrame, softening: d.softening, geoPN: d.geoPN,
    D0Source: d.D0Source, nBodies: d.nBodies,
    unitSI: unit, unitSI_p1: unitP1, unitSI_p2: unitP2,
    d0SI, d0SI_unit: pw >= 2 ? 'kg/m²' : 'kg/m',
    placesSun, rule, ruleWhy: why,
    heliocentricBody: planet, heliocentricDistanceM: rMeters,
    dbg: rb, dbgSI, ratio: (d0SI !== null && dbgSI) ? d0SI / dbgSI : null });
}

// ---------------------------------------------------------------- ② 源分割不変性(純関数)
const st0 = await page.evaluate((z) => window.__w275b.state0(z), { preset: SPLIT_PRESET });
const sun = st0.bodies[0], venus = st0.bodies[1];
const mUnitV = 1e27, lUnitV = 1e8;                  // 🌇 の scaleExp(L:8, T:4, M:27)
// 分解集合に入らない背景(銀河)をサンプル単位へ換算した値
const galRule = ruleBackgroundSI('galactic', {});
const galUnits = galRule.p1 / (mUnitV / lUnitV);    // kg/m → サンプル単位(M/L)
const helioRule = ruleBackgroundSI('heliocentric', { heliocentricDistanceM: Math.hypot(
  (venus.x - sun.x) * lUnitV, (venus.y - sun.y) * lUnitV) });
const helioUnits = helioRule.p1 / (mUnitV / lUnitV);
// 仮想の「銀河」源を 1 点に置いて、分け方を変えても D 総和が変わらないことを確かめる。
// 位置は基準点(金星)から R₀ = 8.178 kpc の距離に置く(単位換算した値)
const R0units = ASSUMPTIONS.galacticR0Kpc.value * 1e3 * ASSUMPTIONS.parsecMeters.value / lUnitV;
const Mgalunits = ASSUMPTIONS.galacticMassEnclosedMsun.value * Msun / mUnitV;
const allSources = [
  { id: 'sun', m: sun.m, x: sun.x, y: sun.y },
  { id: 'galaxy', m: Mgalunits, x: venus.x - R0units, y: venus.y },
];
const inv = splitInvariance({ sources: allSources, px: venus.x, py: venus.y,
  eps: st0.softening, p: 1, partitions: [['sun'], [], ['sun', 'galaxy']] });
const invEps0 = splitInvariance({ sources: allSources, px: venus.x, py: venus.y,
  eps: 0, p: 1, partitions: [['sun'], [], ['sun', 'galaxy']] });

// ---------------------------------------------------------------- ③ 短窓走行(kF0 / kF1)
const D0_DECLARED = 0.006;
const COLS = [];
const addCol = (id, cfg, note) => COLS.push({ id, cfg, note });
for (const kf of [0, 1]) {
  addCol(`V0_kF${kf}`, { preset: SPLIT_PRESET, kFrame: kf, D0: D0_DECLARED },
    '宣言値 D₀=0.006(現行入力)');
  addCol(`V1_kF${kf}`, { preset: SPLIT_PRESET, kFrame: kf, D0: 0 },
    '規則「太陽を置くので背景に含めない」+ 残りを 0 と置いた場合');
  addCol(`V2_kF${kf}`, { preset: SPLIT_PRESET, kFrame: kf, D0: galUnits },
    '規則「太陽を置くので背景に含めない」+ 残りを銀河(M_enc(R₀)/R₀)と置いた場合 D₀=' + galUnits);
  addCol(`V3_kF${kf}`, { preset: SPLIT_PRESET, kFrame: kf, dropSun: true,
    D0: galUnits + helioUnits }, '太陽を置かず背景へ畳む(D₀ に太陽 + 銀河)—— **重力が消える**');
}
const runs = {};
const stageList = QUICK ? ['h'] : ['h', 'h2', 'h4'];
for (const col of COLS) {
  runs[col.id] = { note: col.note, cfg: col.cfg, stages: {} };
  for (const st of stageList) {
    const t0 = Date.now();
    const r = await page.evaluate((z) => window.__w275b.run(z.cfg, z.dt, z.steps),
      { cfg: col.cfg, dt: STAGES[st].dt, steps: STAGES[st].steps });
    r.wallSec = (Date.now() - t0) / 1000;
    runs[col.id].stages[st] = r;
    console.log([col.id.padEnd(9), st.padEnd(3),
      'D0=' + String(col.cfg.D0).slice(0, 10).padEnd(11),
      'rev2=' + (r.rev && r.rev.length > JUDGED_REV ? r.rev[JUDGED_REV].toFixed(4) : '—').padStart(12),
      'n=' + r.n, 'stop=' + r.stop, 'nan=' + r.nan, r.wallSec.toFixed(1) + 's'].join(' '));
  }
}

// ---- 観測値(calaudit の正本から引く —— **手打ちしない**) -------------------------
//   🌇 の σ は CSV の sigma 列が空欄(**未記録であって 0 ではない**)なので σ 倍は出さない。
//   同じ行の `meas`(第274便a までに配られた実測)を**独立照合**の相手として持つ。
let OBS = null, XCHECK = null;
try {
  const ca = JSON.parse(fs.readFileSync(CALAUDIT, 'utf8'));
  const pv = ca.presets.find((p) => p.id === SPLIT_PRESET);
  const rowK1 = pv.quantities.find((q) => q.kind === 'period' && q.version === 'dfm'
    && Number.isFinite(q.obs) && q.obs > 0);
  const rowK0 = pv.quantities.find((q) => q.kind === 'period' && q !== rowK1
    && Number.isFinite(q.obs) && q.obs > 0 && /kFrame=0/.test(String(q.name)));
  OBS = { value: rowK1.obs, sigma: rowK1.obsErr, unit: rowK1.unit, name: rowK1.name,
    sigmaNote: rowK1.sigmaNote || null, method: rowK1.method,
    from: 'tests/out/calaudit-w249.json' };
  XCHECK = { kF1: { calaudit: rowK1.meas, name: rowK1.name },
    kF0: rowK0 ? { calaudit: rowK0.meas, name: rowK0.name } : null };
} catch (e) { OBS = { error: String(e) }; }
const SEC = 1e4;                                     // 🌇 の scaleExp.T=4 → 1 時間単位 = 10⁴ s
for (const [id, r] of Object.entries(runs)) {
  for (const [st, z] of Object.entries(r.stages)) {
    const rev2 = (z.rev && z.rev.length > JUDGED_REV) ? z.rev[JUDGED_REV] * SEC : null;
    z.rev2Sec = rev2;
    z.residPct = (rev2 !== null && OBS && OBS.value) ? (rev2 - OBS.value) / OBS.value * 100 : null;
    z.sigma = (rev2 !== null && OBS && OBS.sigma > 0) ? (rev2 - OBS.value) / OBS.sigma : null;
  }
}
// **独立照合**: 宣言値のまま走らせた列(V0)が、判定器の正本 `calaudit-w249.json` の実測と一致するか。
// 一致すれば「別の器で同じ数が出た」ということで、**観測と合ったという意味ではない**。
if (XCHECK) {
  const pick = (id) => { const z = runs[id] && runs[id].stages.h; return z ? z.rev2Sec : null; };
  const mk = (got, want) => ({ here: got, calaudit: want,
    absDiff: (got !== null && Number.isFinite(want)) ? Math.abs(got - want) : null,
    bitSame: (got !== null && Number.isFinite(want)) ? (got === want) : null });
  XCHECK.kF1 = Object.assign(XCHECK.kF1, mk(pick('V0_kF1'), XCHECK.kF1.calaudit));
  if (XCHECK.kF0) XCHECK.kF0 = Object.assign(XCHECK.kF0, mk(pick('V0_kF0'), XCHECK.kF0.calaudit));
  XCHECK.note = '同じ数が別の器から出たことだけを意味する(**観測と合ったことではない**)';
}

// ---------------------------------------------------------------- 書き出し
const CODE = ['tests/exp-w275b-d0audit.mjs', 'tests/lib-w275b-dsplit.mjs',
  'tests/lib-w272e-provenance.mjs'];
const out = {
  meta: Object.assign(provenanceMeta({ root: ROOT, wave: '第275便b', target: TARGET,
    code: CODE, inputs: [TARGET, 'tests/out/calaudit-w249.json'] }), {
    harness: 'tests/exp-w275b-d0audit.mjs', harnessVersion: HARNESS_VERSION,
    dsplitVersion: DSPLIT_VERSION,
    definition: 'D_bg(x*) = Σ_{j∉分解集合} m_j/(r_j²+ε²)^(p/2)(p=1 で M/L・p=2 で M/L²)',
    ruling: '第65報 (2): D₀ は「何を背景とするか」でサンプル毎に変わる。'
      + '太陽を置くサンプルでは太陽を背景に含めない / 置かないサンプルは太陽からの距離 / '
      + '太陽系外は銀河内位置 / 銀河は自身を含めない。**D₀ は複素決定力場(p=2)では使わない**',
    contract: { orbMax: ORB_MAX, judgedRevIndex: JUDGED_REV, stages: STAGES,
      splitPreset: SPLIT_PRESET, stagesRun: stageList,
      note: '窓・終了条件・保存量は走行前に固定した(器の冒頭コメントが正本)。**判定はしない**' },
    assumptions: assumptionRows(),
    observation: OBS, independentCheck: XCHECK, secondsPerUnit: SEC,
    notClaim: ['D₀ を較正した', 'D₀ の補正で ❄️ が成立', '規則値が正しい D₀ である',
      '背景の定義を解決した', '複素決定力場を実装した'] }),
  audit,
  auditSummary: {
    rows: audit.length,
    calibration: audit.filter((a) => a.site !== 'toy').length,
    byRule: audit.reduce((o, a) => { const k = a.rule || 'undetermined'; o[k] = (o[k] || 0) + 1; return o; }, {}),
    byFramePow: audit.reduce((o, a) => { const k = 'p' + a.framePow; o[k] = (o[k] || 0) + 1; return o; }, {}),
    unitUnknown: audit.filter((a) => a.unitSI === null).map((a) => a.id),
    declaredD0Source: audit.filter((a) => a.D0Source).map((a) => a.id),
    ratioRange: (() => {
      const v = audit.map((a) => a.ratio).filter((z) => Number.isFinite(z));
      return v.length ? { n: v.length, min: Math.min(...v), max: Math.max(...v) } : { n: 0 };
    })(),
  },
  splitInvariance: {
    at: { preset: SPLIT_PRESET, refBody: 'venus', px: venus.x, py: venus.y },
    sources: allSources, epsUsed: st0.softening,
    withSoftening: inv, atEpsZero: invEps0,
    galacticUnits: galUnits, heliocentricUnits: helioUnits,
    note: '**置いた源には softening が入り、背景へ畳んだ源には入らない** —— '
      + 'ε=0 では厳密に一致し、ε>0 では ε/r の 2 次でずれる(下の epsGap)',
  },
  runs, pageErrors,
};
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log('wrote ' + OUT + ' (' + audit.length + ' rows / ' + Object.keys(runs).length + ' columns)');
await browser.close();
