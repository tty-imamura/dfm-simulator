// 第269便c(第59報 W3)「**BH 連星の比較サンプル v1**: GW150914 の 90% 区間比較器」。
//
// ■ 原仮定者の指示(第59報): 「ブラックホール連星、星団、銀河の各サンプルの完成を目指す」。
//   統括の読み (A)「完成=比較サンプル v1」・(B)「GWTC-2.1 の公表値は**波形モデルに基づく推論値**で、
//   **90% 区間**である」。
//
// ■ 契約(この器が守るもの —— `tests/lib-w269c-compare.mjs` が機械で守る)
//   ① 比較器は `lower/upper/confidence/frame/source/role` を持ち **区間の内/外だけ**を返す。
//      **非対称区間を対称 1σ に換算しない。周辺区間の AND を同時 90% 領域と呼ばない。**
//   ② `component_mass`・`chirp_mass`・`total_mass`・`mass_ratio` は **転写の確認**であって
//      **独立検証に数えない**(器の初期質量は CSV から手で置いた値である)。
//   ③ `orbital_period` 0.181818 s は 10 Hz からの**派生参照値**で独立観測量ではない →
//      区間比較の対象外(`not-applicable`)。
//   ④ `final_mass`・`final_spin` は **remnant 量** —— **合体を検出し remnant を測れるモデルだけ**に許す。
//      `merged:false` なら `not-applicable`(**終端の 2 体総質量を remnant に代入しない**)。
//   ⑤ 測れない量(光度距離・赤方偏移・χ_eff・remnant スピン)は `not-measurable`(**値は null**)。
//      **0 や最後の値で補わない。**
//   ⑥ 🎻 の周期ドリフトは **有限刻みの縮み**であって物理的放射ではない(3 段で測って書く)。
//   ⑦ ⏰ の合体は **外部 Peters 放射オーバーレイ**(用量 a=0.1313 の合わせ込み)によるもので、
//      **DFM 由来の合体ではない**。
//
// ■ 触らないもの
//   `beta/index.html` は**読むだけ**。🎐🎻⏰ の JSON を 1 bit も書き換えない(`asIs` で走らせる)。
//   `S._core` には 1 命令も足していない。新しい法則・力・プリセットは足していない。
//
// ■ この器が**言わないこと**
//   「BH 連星を完成した(観測一致版)」「観測と合った」「合体を再現した」「較正した」
//   「区間の内側だから合格」「3 量が区間内だから同時 90% 領域の中」。
//
// 実行: node tests/exp-w269c-bh90.mjs [--T0 240] [--minima 20] [--cap 8000] [--only 🎐,🎻,⏰]
// 出力: tests/out/bh90-w269c.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { richardson3 } from './lib-w265a-analogy.mjs';
import { compareRow, interval, intervalState, tallyStates, measurementStamp, fileStamp,
  loadObsCsv, noteField, MARGINAL_AND_NOTE, ASYMMETRIC_NOTE } from './lib-w269c-compare.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + (path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET));
const OUT = path.join(ROOT, 'tests', 'out', 'bh90-w269c.json');
const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(k); return (i >= 0 && argv[i + 1]) ? argv[i + 1] : d; };
const T0 = Number(arg('--T0', 240));          // 第265便a と**同じ短時間窓**(最終分離の照合)
const N_MIN = Number(arg('--minima', 20));    // 周期窓(極小 20 個)
const CAP = Number(arg('--cap', 8000));       // 周期窓の時間上限(⏰ は合体で先に止まる)
const DIVS = [1, 2, 4];
const DT0 = 0.016;
const MSUN_KG = 1.98847e30;

const CSV_REL = 'paper/data/solar-observations.csv';
const CSV = path.join(ROOT, CSV_REL);
const ROWS = loadObsCsv(CSV);

// ---- CSV の `sigma_kind=ci90` 行から 90% 区間を作る(**note 欄の ci90_lo/ci90_hi が正本**)
function ci90(body, quantity, role) {
  const r = ROWS.find((z) => z.body === body && z.quantity === quantity);
  if (!r) return null;
  if (noteField(r.note, 'sigma_kind') !== 'ci90') return null;
  const lo = Number(noteField(r.note, 'ci90_lo')), hi = Number(noteField(r.note, 'ci90_hi'));
  return interval({ value: r.value, lower: lo, upper: hi, unit: r.unit, confidence: 0.90,
    frame: noteField(r.note, 'frame') || 'source frame (GWTC-2.1 C01:Mixed)',
    source: String(r.source), role,
    verifiedMark: noteField(r.note, 'sigma_primary') || 'unverified' });
}
const OBS = {
  m1: ci90('GW150914 A', 'component_mass', '転写の確認(**独立検証に数えない**)'),
  m2: ci90('GW150914 B', 'component_mass', '転写の確認(**独立検証に数えない**)'),
  mChirp: ci90('GW150914', 'chirp_mass', '転写した 2 質量からの派生(**独立検証に数えない**)'),
  mTot: ci90('GW150914', 'total_mass', '転写した 2 質量からの派生(**独立検証に数えない**)'),
  mFinal: ci90('GW150914', 'final_mass', 'remnant 量(**合体を検出したモデルだけ**)'),
  aFinal: ci90('GW150914', 'final_spin', 'remnant 量(**合体を検出したモデルだけ**)'),
  q: ci90('GW150914', 'mass_ratio_candidate', '転写した 2 質量からの派生(**独立検証に数えない**)'),
  dL: ci90('GW150914', 'luminosity_distance', '器に無い量(検出器側の推論値)'),
  z: ci90('GW150914', 'redshift', '器に無い量(検出器側の推論値)'),
  chiEff: ci90('GW150914', 'effective_inspiral_spin', '器に無い量(波形モデルの推論値)'),
};
const periodRow = ROWS.find((z) => z.body === 'GW150914 B' && z.quantity === 'orbital_period');
const OBS_PERIOD = periodRow ? { value: periodRow.value, unit: periodRow.unit, lower: null, upper: null,
  confidence: null, frame: 'source frame', source: String(periodRow.source),
  role: '**派生参照値**(f_GW,det=10 Hz の基準状態からのニュートン換算)—— 独立観測量ではない',
  verifiedMark: noteField(periodRow.note, 'sigma_primary') || 'unverified' } : null;

// ---------------------------------------------------------------- ページ
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
  // **内蔵のまま**(asIs)走らせる —— プリセット JSON は 1 bit も書き換えない。
  window.__w269cBh = (id, dt, tEnd, nMinWant) => {
    const src = HP.allPresets().find((q) => q.id === id);
    if (!src) return { ok: false, errors: ['no such preset: ' + id] };
    const v = HP.validatePreset(JSON.parse(JSON.stringify(src)));
    if (!v.ok) return { ok: false, errors: v.errors };
    const S = HP.sim; S.build(v.preset);
    const ci = 0, oi = 1;
    const R01 = (S.R && S.R.length >= 2) ? S.R[0] + S.R[1] : null;
    const mass0 = Array.prototype.slice.call(S.m, 0, S.n);
    const coreMF0 = S.coreMF ? Array.prototype.slice.call(S.coreMF, 0, S.n) : null;
    // 分離極小の**ヒステリシス検出**(第265便a の抽出器 `separation-minima-v1` をそのまま使う)
    const AMP = 1e-3;
    const mins = [];
    let looking = 'min', extR = Infinity, extK = -1;
    let rEnd = null, nan = false, rdPrev = null, rawCross = 0, contactT = null, mergeT = null;
    const nSteps = Math.round(tEnd / dt);
    let k = 0, stopped = 'time';
    for (; k < nSteps; k++) {
      S.step(dt);
      if (S.n !== undefined && S.n < 2) { mergeT = S.t; stopped = 'merged'; break; }
      const dx = S.x[oi] - S.x[ci], dy = S.y[oi] - S.y[ci];
      const rr = Math.hypot(dx, dy);
      const dvx = S.vx[oi] - S.vx[ci], dvy = S.vy[oi] - S.vy[ci];
      const rd = (rr > 0) ? (dx * dvx + dy * dvy) / rr : 0;
      if (rdPrev !== null && rdPrev < 0 && rd >= 0) rawCross++;
      rdPrev = rd;
      if (contactT === null && R01 !== null && rr <= R01) contactT = S.t;
      if (looking === 'min') {
        if (rr < extR) { extR = rr; extK = k; }
        else if (rr - extR > AMP * extR) { mins.push(extK); looking = 'max'; extR = rr; extK = k; }
      } else {
        if (rr > extR) { extR = rr; extK = k; }
        else if (extR - rr > AMP * extR) { looking = 'min'; extR = rr; extK = k; }
      }
      rEnd = rr;
      if (S.hasNaN()) { nan = true; stopped = 'nan'; break; }
      if (nMinWant > 0 && mins.length >= nMinWant) { stopped = 'minima'; break; }
    }
    const merged = (S.n !== undefined && S.n < 2);
    return { ok: true, steps: k, stopped, nan, minima: mins, tEndActual: S.t,
      separationEnd: rEnd, rawCross, contactT, mergeT, merged,
      nBodies: S.n === undefined ? null : S.n, fusN: S.fusN === undefined ? null : S.fusN,
      mass0, coreMF0,
      // **remnant は合体したときだけ**読む(合体していないときは null —— 2 体総質量を代入しない)
      remnant: merged ? { m: S.m[0], coreMF: S.coreMF ? S.coreMF[0] : null,
        radius: S.R ? S.R[0] : null, spin: S.spin ? S.spin[0] : null,
        coreOmega: S.coreOm ? S.coreOm[0] : null } : null,
      radE: S.radE === undefined ? null : S.radE, radL: S.radL === undefined ? null : S.radL,
      clamp: (S.clampVN || 0) + (S.clampSN || 0) + (S.clampHN || 0) + (S.clampRN || 0) + (S.clampTN || 0) };
  };
  window.__w269cFacts = (ids) => ids.map((id) => {
    const p = HP.allPresets().find((q) => q.id === id);
    if (!p) return { id, missing: true };
    return { id, emoji: p.emoji, sampleClass: p.sampleClass, scaleExp: p.scaleExp,
      kFrame: p.physics.kFrame, geoPN: p.physics.geoPN,
      petersGW: p.physics.petersGW === undefined ? null : p.physics.petersGW,
      petersScale: p.physics.petersScale === undefined ? null : p.physics.petersScale,
      petersDirection: p.physics.petersDirection === undefined ? null : p.physics.petersDirection,
      spinSpin: p.physics.spinSpin === undefined ? null : p.physics.spinSpin,
      notClaim: p.notClaim || null,
      bodies: p.bodies.map((b) => ({ m: b.m, radius: b.radius,
        coreMassFrac: b.core ? b.core.massFrac : null })) };
  });
});

const facts = await pg.evaluate((ids) => window.__w269cFacts(ids),
  ['gw150914', 'gw150914DFM', 'gw150914Merge4s']);
const factOf = (id) => facts.find((f) => f.id === id) || {};

const out = {
  meta: measurementStamp({
    codeVersion: 'tests/exp-w269c-bh90.mjs 第269便c',
    declarationVersion: 'compare-v1 / 第59報「完成=比較サンプル v1」',
    inputs: [fileStamp(path.join(ROOT, TARGET), TARGET), fileStamp(CSV, CSV_REL),
      fileStamp(path.join(ROOT, 'tests', 'lib-w269c-compare.mjs'), 'tests/lib-w269c-compare.mjs')] }),
  declaration: {
    systemKind: 'bh-binary', sample: ['🎐 gw150914', '🎻 gw150914DFM', '⏰ gw150914Merge4s'],
    dynamicsUsed: '重力 E4 +(🎻⏰ のみ)空間引きずり E6′(kFrame=1)。geoPN=0(1PN 偶力は無い)。',
    externalModel: '⏰ だけ **外部 Peters 放射オーバーレイ**(petersGW・用量 petersScale=0.1313・'
      + '方向 tangential・玩具スピン–スピン λ=1)。**DFM の帰結ではない外部物理**である。',
    transcribedInputs: '2 体の質量(GWTC-2.1 source frame 34.6 / 30.0 M☉)・a=1.928116×10⁶ m・'
      + 'e=0.08(10 Hz 基準状態)・半径は Schwarzschild 換算 proxy。🎻⏰ は質量較正 f≈2 の二層で、'
      + '**殻質量が転写した観測質量**(massFrac=(f−1)/f)である。',
    fittedTargets: '⏰ の用量 a=0.1313 は「約 4 秒」へ寄せた**合わせ込みの 1 ノブ**。'
      + '🎻 の f≈2 は χ-law 由来(C=1)の宣言。**本便では 1 つも動かしていない。**',
    unusedChecks: 'チャープ波形・周波数位相・振幅・リングダウン・remnant スピン・光度距離・赤方偏移・χ_eff。',
    window: { short: { tStart: 0, tEnd: T0, unit: 'sim time(1 単位 = 10⁻³ s)',
      why: '第265便a と**同じ短時間窓**(最終分離の照合)' },
    period: { minimaWanted: N_MIN, capSimTime: CAP,
      why: '極小 20 個の周期窓。⏰ は窓の途中で合体して止まる(それも記録する)' } },
    extractor: { name: 'separation-minima-v1(第265便a と同じ)', amplitudeGate: 1e-3,
      definition: '分離 r のヒステリシス極小検出(極小 → 相対 1×10⁻³ 上昇で確定 → 極大 → '
        + '相対 1×10⁻³ 下降で極小探索へ)。周期は極小間隔の平均。周期ドリフトは前半窓と後半窓の'
        + '平均間隔の差を窓中心の時間差で割った無次元量。合体は `S.n<2`(融合)で検出し、'
        + '接触は r ≤ R₀+R₁ の初回で記録する。' },
    units: { massUnitKg: 1e29, msunKg: MSUN_KG, timeUnitSec: 1e-3, lengthUnitM: 1e4,
      note: '質量 M☉ = 器の質量単位 / 19.8847(1 M☉ = 1.98847×10³⁰ kg = 19.8847 単位)' },
    observationVersion: { csv: CSV_REL,
      rows: 'GW150914 の `sigma_kind=ci90` 行(note 欄の `ci90_lo=`/`ci90_hi=` が区間の正本)',
      caveat: '**GWTC-2.1 の公表値は波形モデルに基づく推論値**である。' + ASYMMETRIC_NOTE
        + ' ' + MARGINAL_AND_NOTE },
    presetFacts: facts },
  columns: [], pageErrors: [] };

const tA = Date.now();
const toMsun = (u) => u * 1e29 / MSUN_KG;

async function runColumn(tag, id) {
  const f = factOf(id);
  const col = { tag, id, emoji: f.emoji, sampleClass: f.sampleClass, stages: [], rows: [] };
  out.columns.push(col);
  for (const div of DIVS) {
    const dt = DT0 / div;
    const shortRun = await pg.evaluate(({ id, dt, t }) => window.__w269cBh(id, dt, t, 0),
      { id, dt, t: T0 });
    const periodRun = await pg.evaluate(({ id, dt, t, n }) => window.__w269cBh(id, dt, t, n),
      { id, dt, t: CAP, n: N_MIN });
    // **合体窓**: 極小で止めずに上限 t=CAP まで走らせ、合体(融合)を検出する。
    //   **合体しなければ `merged:false` のまま**で、終端の 2 体総質量を remnant に代入しない。
    const mergeRun = await pg.evaluate(({ id, dt, t }) => window.__w269cBh(id, dt, t, 0),
      { id, dt, t: CAP });
    let P = null, P1 = null, P2 = null, drift = null;
    if (periodRun.ok && periodRun.minima.length >= 4) {
      const m = periodRun.minima, n = m.length, u = 1e-3;
      P = (m[n - 1] - m[0]) * dt / (n - 1) * u;
      const h = Math.floor(n / 2);
      P1 = (m[h - 1] - m[0]) * dt / (h - 1) * u;
      P2 = (m[n - 1] - m[h]) * dt / (n - 1 - h) * u;
      const dc = ((m[n - 1] + m[h]) / 2 - (m[h - 1] + m[0]) / 2) * dt * u;
      drift = (dc > 0) ? (P2 - P1) / dc : null;
    }
    col.stages.push({ div, dt,
      short: { steps: shortRun.steps, stopped: shortRun.stopped, separationEnd: shortRun.separationEnd,
        merged: shortRun.merged, nan: shortRun.nan, clamp: shortRun.clamp },
      period: { steps: periodRun.steps, stopped: periodRun.stopped,
        nMinima: periodRun.ok ? periodRun.minima.length : 0, rawCross: periodRun.rawCross,
        periodSec: P, periodFirstHalfSec: P1, periodSecondHalfSec: P2, periodDrift: drift,
        nan: periodRun.nan, clamp: periodRun.clamp },
      merge: { steps: mergeRun.steps, stopped: mergeRun.stopped, capSimTime: CAP,
        separationEnd: mergeRun.separationEnd,
        merged: mergeRun.merged, fusN: mergeRun.fusN, nBodies: mergeRun.nBodies,
        contactSec: mergeRun.contactT === null ? null : mergeRun.contactT * 1e-3,
        mergeSec: mergeRun.mergeT === null ? null : mergeRun.mergeT * 1e-3,
        lagSec: (mergeRun.contactT === null || mergeRun.mergeT === null) ? null
          : (mergeRun.mergeT - mergeRun.contactT) * 1e-3,
        remnant: mergeRun.remnant, radE: mergeRun.radE, radL: mergeRun.radL,
        nan: mergeRun.nan, clamp: mergeRun.clamp },
      bodyMassUnits: periodRun.mass0 || null, bodyCoreMF: periodRun.coreMF0 || null,
      errors: shortRun.errors || periodRun.errors || null });
    console.error(`  ${f.emoji} ${tag} dt/${div}: 分離(T=${T0})=`
      + `${shortRun.separationEnd === null ? '—' : shortRun.separationEnd.toFixed(4)}`
      + `  P=${P === null ? '—' : P.toFixed(8)} s  Ṗ=${drift === null ? '—' : drift.toExponential(3)}`
      + `  合体=${mergeRun.merged}${mergeRun.mergeT !== null ? '(' + (mergeRun.mergeT * 1e-3).toFixed(6) + ' s)' : ''}`
      + `  [${((Date.now() - tA) / 1000).toFixed(0)} s]`);
    fs.mkdirSync(path.dirname(OUT), { recursive: true });
    fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
  }

  const g = (fn) => col.stages.map(fn);
  col.richardson = {
    separationEnd: richardson3(...g((s) => s.short.separationEnd)),
    periodSec: richardson3(...g((s) => s.period.periodSec)),
    periodDrift: richardson3(...g((s) => s.period.periodDrift)),
    mergeSec: richardson3(...g((s) => s.merge.mergeSec)),
    lagSec: richardson3(...g((s) => s.merge.lagSec)) };

  // ---- 質量(転写の確認)。🎻⏰ は**二層**なので殻質量と層総質量の両方を持つ。
  const decl = (f.bodies || []);
  const layerTotalU = decl.map((b) => b.m);
  const shellU = decl.map((b) => (b.coreMassFrac === null || b.coreMassFrac === undefined)
    ? b.m : b.m * (1 - b.coreMassFrac));
  const isTwoLayer = decl.some((b) => b.coreMassFrac !== null && b.coreMassFrac !== undefined);
  // **観測質量に対応するのは殻質量**である(🎻⏰ の JSON が massFrac=(f−1)/f でそう宣言している)。
  const mapped = shellU.map(toMsun);
  const layerTotal = layerTotalU.map(toMsun);
  const mkMassRow = (qName, obs, value, extra) => {
    const st = intervalState(value, obs);
    return compareRow({ quantity: qName,
      sim: { value, unit: 'M_sun', window: 't=0(初期条件 —— 走行に依存しない)',
        extractor: isTwoLayer
          ? '宣言された**殻質量** m(1−massFrac)(二層の総質量ではない)' : '宣言された body の m',
        stages: { h: value, h2: value, h4: value }, order: null, extrapolated: null },
      obs, state: st.state,
      reason: st.reason + ' —— **転写の確認であって独立検証ではない**'
        + '(この質量は CSV から手で置いた入力である)。',
      diagnostics: Object.assign({ layerTotalMsun: isTwoLayer ? layerTotal : null,
        shellMsun: mapped, twoLayer: isTwoLayer, offsetInWidths: st.offsetInWidths,
        stepIndependent: '**刻みに依らない**(初期条件の量なので h/h2/h4 は同値である)。' },
      extra || {}) });
  };

  if (OBS.m1) col.rows.push(mkMassRow('component_mass A', OBS.m1, mapped[0]));
  if (OBS.m2) col.rows.push(mkMassRow('component_mass B', OBS.m2, mapped[1]));
  const mc = (a, b) => Math.pow(a * b, 0.6) / Math.pow(a + b, 0.2);
  if (OBS.mChirp) col.rows.push(mkMassRow('chirp_mass', OBS.mChirp, mc(mapped[0], mapped[1])));
  if (OBS.mTot) col.rows.push(mkMassRow('total_mass', OBS.mTot, mapped[0] + mapped[1]));
  if (OBS.q) col.rows.push(mkMassRow('mass_ratio', OBS.q, mapped[1] / mapped[0]));

  // ---- 周期(**派生参照値** —— 区間比較の対象外)
  const Ps = g((s) => s.period.periodSec);
  if (OBS_PERIOD) col.rows.push(compareRow({ quantity: 'orbital_period',
    sim: { value: Ps[0], unit: 's', window: `周期窓(極小 ${N_MIN} 個)`,
      extractor: 'separation-minima-v1', stages: { h: Ps[0], h2: Ps[1], h4: Ps[2] },
      order: col.richardson.periodSec.p, extrapolated: col.richardson.periodSec.ext },
    obs: OBS_PERIOD, state: 'not-applicable',
    reason: 'CSV の 0.181818 s は **f_GW,det=10 Hz からの派生参照値**であって独立観測量ではない'
      + '(区間も持たない)—— 区間比較の対象外。並置は転写の確認にとどめる。',
    diagnostics: { relDiffPercentByStage: Ps.map((p) => (p === null ? null
      : (p - OBS_PERIOD.value) / OBS_PERIOD.value * 100)) } }));

  // ---- remnant 量(**合体を検出したモデルだけ**)
  const lastStage = col.stages[col.stages.length - 1];
  const mergedAny = col.stages.some((s) => s.merge.merged);
  if (!mergedAny) {
    if (OBS.mFinal) col.rows.push(compareRow({ quantity: 'final_mass',
      sim: { value: null, unit: 'M_sun', window: `周期窓(極小 ${N_MIN} 個・上限 t=${CAP})`,
        extractor: `合体検出(S.n<2)・上限 t=${CAP}(=${CAP * 1e-3} s)—— **合体していない**`,
        stages: {}, order: null },
      obs: OBS.mFinal, state: 'not-applicable',
      reason: '**`merged:false`** —— この走行は窓の中で合体に達していない。'
        + '**終端の 2 体総質量を remnant に代入しない。**',
      diagnostics: { merged: false, stoppedByStage: col.stages.map((s) => s.merge.stopped),
        separationEndByStage: col.stages.map((s) => s.merge.separationEnd) } }));
    if (OBS.aFinal) col.rows.push(compareRow({ quantity: 'final_spin',
      sim: { value: null, unit: '1', window: `周期窓(極小 ${N_MIN} 個・上限 t=${CAP})`,
        extractor: '—', stages: {}, order: null },
      obs: OBS.aFinal, state: 'not-applicable',
      reason: '**`merged:false`** —— remnant が存在しない。',
      diagnostics: { merged: false } }));
  } else {
    const rem = col.stages.map((s) => s.merge.remnant);
    const remTotU = rem.map((r) => (r ? r.m : null));
    const remTot = remTotU.map((u) => (u === null ? null : toMsun(u)));
    const remShell = rem.map((r) => (r === null ? null
      : toMsun(r.m * (1 - (Number.isFinite(r.coreMF) ? r.coreMF : 0)))));
    const totState = intervalState(remTot[2], OBS.mFinal);
    const shellState = intervalState(remShell[2], OBS.mFinal);
    if (OBS.mFinal) col.rows.push(compareRow({ quantity: 'final_mass',
      sim: { value: null, unit: 'M_sun', window: '合体(融合)時刻までの走行',
        extractor: '融合後に残った 1 体の質量(**総質量**と**殻質量**の 2 通りが取れる)',
        stages: {}, order: null },
      obs: OBS.mFinal, state: 'mapping-unresolved',
      reason: '**観測 final_mass が器のどの層に対応するかが未宣言である。** '
        + '🎻⏰ は質量較正 f≈2 の二層で、**初期の殻質量が転写した観測質量**という宣言を持つ'
        + '(massFrac=(f−1)/f)。しかし**融合後の remnant について殻/核の対応則は宣言されていない**ので、'
        + '総質量と殻質量のどちらを観測 remnant に当てるかが決まらない。**数値の不一致ではなく対応の未宣言である。**'
        + '(どちらも数値としては下の diagnostics に出す —— **片方を選んで状態を付けない**)',
      diagnostics: { merged: true,
        remnantTotalMsunByStage: remTot, remnantShellMsunByStage: remShell,
        remnantCoreMassFracByStage: rem.map((r) => (r ? r.coreMF : null)),
        ifTotal: { value: remTot[2], wouldBe: totState.state },
        ifShell: { value: remShell[2], wouldBe: shellState.state },
        note: '**この 2 つの「もし〜なら」は状態ではない**(対応が決まるまで判定しない)。'
          + '合体は **外部 Peters 放射オーバーレイ**(用量 a=0.1313 の合わせ込み)が駆動したもので、'
          + '**DFM 由来の合体ではない**。' } }));
    // **合体時刻**: CSV に区間を持つ観測行が無い(「約 4.0 秒」は 10 Hz からの**モデル換算目標**)
    const tM = g((s) => s.merge.mergeSec);
    col.rows.push(compareRow({ quantity: 'merger_time',
      sim: { value: tM[2], unit: 's', window: `合体窓(上限 t=${CAP})`,
        extractor: '融合(S.n<2)の時刻', stages: { h: tM[0], h2: tM[1], h4: tM[2] },
        order: col.richardson.mergeSec.p, extrapolated: col.richardson.mergeSec.ext },
      obs: { value: 4.0, unit: 's', lower: null, upper: null, confidence: null,
        frame: 'source frame', source: '10 Hz 基準状態からの Peters 換算(⏰ の obsCard の宣言)',
        role: '**モデル換算目標**(検出器が 4 秒全体を直接測った値ではない)—— 区間を持たない',
        verifiedMark: 'n/a' },
      state: 'not-applicable',
      reason: '**「約 4.0 秒」は観測の 90% 区間ではなくモデル換算目標である**ので区間比較の対象外。'
        + 'しかも合体は**用量 a=0.1313 を 4 秒へ寄せた合わせ込み**で駆動されており、'
        + '**この一致は fit の再現であって独立検証ではない**。',
      diagnostics: { note: '3 段は単調(見かけの次数 '
        + (col.richardson.mergeSec.p === null ? '—' : col.richardson.mergeSec.p.toFixed(3))
        + ')で外挿は ' + (col.richardson.mergeSec.ext === null ? '—'
          : col.richardson.mergeSec.ext.toFixed(6)) + ' s —— **外挿値を実走値と混同しない**。' } }));
    // **接触後の遅延**: 観測側に対応する量が無く、3 段で収束していない
    const lag = g((s) => s.merge.lagSec);
    col.rows.push(compareRow({ quantity: 'post_contact_lag',
      sim: { value: lag[2], unit: 's', window: `合体窓(上限 t=${CAP})`,
        extractor: '接触(r ≤ R₀+R₁)から融合までの時間',
        stages: { h: lag[0], h2: lag[1], h4: lag[2] },
        order: col.richardson.lagSec.p, extrapolated: col.richardson.lagSec.ext },
      obs: null, state: 'numerically-unresolved',
      reason: '**3 段(dt=0.016/0.008/0.004)で収束していない** —— 差が縮まず'
        + '(見かけの次数が正でないので外挿しない)、遅延は ~0.7 ms の水準に留まるが'
        + '**この刻み集合では数値的に未解決である**。観測側に対応する量も無い。',
      diagnostics: { lagSecByStage: lag, richardson: col.richardson.lagSec } }));
    if (OBS.aFinal) col.rows.push(compareRow({ quantity: 'final_spin',
      sim: { value: null, unit: '1', window: '合体(融合)時刻までの走行',
        extractor: '—(**この器には remnant の Kerr χ を測る抽出器が無い**)', stages: {}, order: null },
      obs: OBS.aFinal, state: 'not-measurable',
      reason: '**remnant の無次元スピン χ=cJ/(Gm²) を測る抽出器が無い。** '
        + '器が持つのは融合後の body の角速度と宣言半径だけで、'
        + 'J を作るには慣性モーメント則と地平線半径の対応を宣言する必要がある(未宣言)。'
        + '**0 や最後の値で補わない。**',
      diagnostics: { rawSpinByStage: rem.map((r) => (r ? r.spin : null)),
        rawRadiusByStage: rem.map((r) => (r ? r.radius : null)),
        coreOmegaByStage: rem.map((r) => (r ? r.coreOmega : null)) } }));
  }

  // ---- 測れない量(**値は null**)
  const nm = (q, obs, why) => { if (obs) col.rows.push(compareRow({ quantity: q,
    sim: { value: null, unit: obs.unit, window: '—', extractor: '—', stages: {}, order: null },
    obs, state: 'not-measurable', reason: why })); };
  nm('luminosity_distance', OBS.dL, '**器に光度距離が無い**(2 体力学だけで、検出器・宇宙論を持たない)。');
  nm('redshift', OBS.z, '**器に赤方偏移が無い**(source frame の質量を直接置いている)。');
  nm('effective_inspiral_spin', OBS.chiEff,
    '**器に χ_eff を測る抽出器が無い**(🎐🎻 は spin=0 宣言・⏰ は χ=0.7 の**宣言**であって測定値ではない)。');

  col.stateTally = tallyStates(col.rows);
  col.numericalDiagnostics = {
    separationEndByStage: g((s) => s.short.separationEnd),
    periodSecByStage: Ps,
    periodDriftByStage: g((s) => s.period.periodDrift),
    mergeSecByStage: g((s) => s.merge.mergeSec),
    lagSecByStage: g((s) => s.merge.lagSec),
    clampByStage: g((s) => s.period.clamp), nanByStage: g((s) => s.period.nan),
    mergeClampByStage: g((s) => s.merge.clamp), mergeNanByStage: g((s) => s.merge.nan),
    fusNByStage: g((s) => s.merge.fusN),
    driftReading: '**周期ドリフトは有限刻みの縮みであって物理的放射ではない。** '
      + '刻みを半分にするたび大きさがほぼ半分になり(見かけの次数 ≈1)、外挿は 0 の側へ向かう —— '
      + 'この器の 🎻 には放射チャネルが無い(petersGW 未宣言)ので、'
      + '**周期が縮んで見えるのは積分誤差である**。',
    lastStage: lastStage ? lastStage.div : null };
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
  return col;
}

const ONLY = (() => { const s = arg('--only', null); return s ? s.split(',') : null; })();
const want = (e) => !ONLY || ONLY.indexOf(e) >= 0;
if (want('🎐')) await runColumn('🎐 gw150914(観測質量の基準状態・kFrame=0)', 'gw150914');
if (want('🎻')) await runColumn('🎻 gw150914DFM(DFM 版・kFrame=1・放射なし)', 'gw150914DFM');
if (want('⏰')) await runColumn('⏰ gw150914Merge4s(外部 Peters 放射 a=0.1313・接線)', 'gw150914Merge4s');

out.summary = {
  stateTallyAll: tallyStates(out.columns.reduce((a, c) => a.concat(c.rows), [])),
  independentVerification: '**0 件**。区間内に入った質量系の行はすべて**転写の確認**であり、'
    + '**独立検証には数えない**(初期質量は CSV から手で置いた入力である)。',
  notSaid: ['「BH 連星を完成した(観測一致版)」', '「観測と合った」', '「合体を再現した」',
    '「較正した」', '「区間の内側だから合格」', '「複数の周辺区間の内側だから同時 90% 領域の中」'] };
out.meta.spentSec = +((Date.now() - tA) / 1000).toFixed(1);
out.pageErrors = pageErrors;
await browser.close();
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.error('[w269c-bh90] wrote ' + OUT + '  (' + out.meta.spentSec + ' s)  pageErrors='
  + pageErrors.length);
for (const c of out.columns) {
  console.log('--- ' + c.tag + '  状態: ' + JSON.stringify(c.stateTally));
  for (const r of c.rows) console.log('   ' + r.quantity.padEnd(24) + ' '
    + (r.sim.value === null ? '—' : String(r.sim.value)).padEnd(22) + ' ' + r.state);
}
