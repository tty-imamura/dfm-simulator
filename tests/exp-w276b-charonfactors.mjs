// 第276便b(第66報 (2)「**plutoCharonReal の kF0 版に問題がないか確認し、問題があれば解決する。
//   冥王星にはカロン以外にも衛星があり潮汐ロックされていない。カロン以外の衛星の影響も、それらの
//   質量補正を選択肢に入れつつ検討対象とする。『どの様な要因が加われば解決するか』を探る**」)—
// **❄️ kF0 の残差 +7.62 s(+294.08σ)を要因へ分解する器**。
//
// ■ しないこと(先に書く)
//   ・`beta/index.html` を 1 文字も変えない(本器はページを読むだけ)。**内蔵 ❄️ の値は 1 bit も
//     変えない** —— 質量・a・G・D₀・ε・kFrame はすべて**診断コピーの中だけ**で動かす。
//   ・**残差がゼロになる ε・f・a を探索して採用しない。** 「解決した」「観測と合った」「較正した」
//     「新発見」は書かない。本器が出すのは**感度表**であって判定ではない。
//   ・JPL PLU060 の GM は**出典として表に載せるだけ**で、内蔵の質量へ代入しない(代入して 26 ms の
//     精度を主張するには、**同じ観測解の状態ベクトルと共分散**が要る —— それは本便には無い)。
//   ・小衛星ごとの係数 f_i を当てない(カロン残差だけの一点 fit へ戻さないため。次に f_i を許すなら
//     **小衛星自身の位置・周期・長期安定性も同時に制約する**設計にする —— `fiDesign` に書く)。
//
// ■ 測るもの
//   §A 入力精度の監査(算術・ブラウザ不要)
//       a=19,596 km の丸め ±0.5 km / G=6.674 の丸め(CODATA 6.67430 との差)/ 質量の丸め /
//       PLU060 の GM と内蔵 GM の差 / 独立近似 (σ_P/P)²≃(9/4)(σ_a/a)²+(1/4)(σ_GM/GM)² と
//       **共分散が要る**こと / 低 ε 側の残差を消すのに要る a・f(**採用済み補正ではない**)。
//   §B Float32 の量子化(ページ): 状態配列 `S.m/S.x/S.y/S.vx/S.vy` は **Float32Array** である
//       (`stateCarry:"double"` が倍精度にするのは加速度累積と速度キックの補償和だけ)。
//       宣言値と build 後の値の差から GM のずれ → 周期のずれを出す。基準単位と診断単位の両方。
//   §C 小衛星 4 体(診断コピー・kF0・**単位を変えた**系): Styx/Nix/Kerberos/Hydra を円軌道・
//       同一平面・位相 φ_i=i×1.1 rad・自転 0(**実在の自転状態の主張ではない**)で足し、
//       カロン周期の変化を測る。**massFloor の扱い**(基準単位では Nix 相当が床 1e-6 に持ち上がる)
//       と **100 倍質量の反例**も測る。
//   §D 太陽を分解した 3 体: **真の配置は受理値域に入らない**(|x|≤5000 単位と ε≥0.01 単位が同時に
//       効くので、受理できる動的レンジは 5×10⁵ 止まり。冥王星–太陽 5.9×10¹² m を ε=10 km で
//       置くには 5.9×10⁸ が要る)。そこで **同じ潮汐小パラメータ X=(n′/n)²=(M_s/M_tot)(a/r_s)³**
//       を持つ代理配置の梯子で ΔP を実測し、べきを fit して真の X へ外挿する(**外挿である**)。
//   §E 要因表(`factors`): 要因 × 周期への感度 × 観測 σ との比 × 採用可否。
//
// 実行:
//   PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright node tests/exp-w276b-charonfactors.mjs
//       [--pilot] [--stage h|h2|h4] [--only A,B,C,D] [--steps N]
// 出力: tests/out/charonfactors-w276b.json(来歴 meta は tests/lib-w272e-provenance.mjs 版 w272e-1)
//   入力に他の正本(charoneps-w276b.json・calaudit-w249.json)を持つので**鎖の後**に回す。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { installCharonPage, CHARON_PAGE_VERSION } from './lib-w273b-charonpage.mjs';
import { charonMergeKey, isCanonicalRun, MERGEKEY_VERSION } from './lib-w273b-mergekey.mjs';
import { withProvenance } from './lib-w272e-provenance.mjs';
import { unitChangeSpec, ACCEPT_LIMITS, epsFloorMeters, acceptedDynamicRange, UNITS_VERSION }
  from './lib-w276b-units.mjs';
import { CHARON_FACTORS_VERSION, PLU060, SMALL_MOONS, CODATA_G, SOLAR, periodKepler, gSimFromSI,
  aFromPeriodShift, massFactorFromPeriodShift, sigmaPeriodIndependent, moonMassSim,
  moonStateSim, sunLadder, fitPowerLaw } from './lib-w276b-charonfactors.mjs';
// 第281便a(原仮定者の裁定(第71報)・AN16・統括の検証項目 R71): **この器が読む html の領域**の宣言。
//   `tests/lib-w281a-scope.mjs` がこの領域だけの hash(`scopeSha256`)を正本の meta に刻む。
//   `lint.provenanceMeta` ② は「targetSha256 一致 **または**(scopeComplete かつ scopeSha256 が今の html で
//   引き直した値と一致)」で通す。`lint.regenScope` が「宣言 ⊇ 器のコードから機械で引いた下限
//   (HP.*・html の最上位名・内蔵プリセット id)」を照合する。**1 行の JSON**(lint が読む)。
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
const REGEN_SCOPE = {"presets":["plutoCharonReal"],"roots":["$","DT","HP.allPresets","HP.dfmBinaryChi","HP.dfmBinaryMassFactor","HP.dfmBinaryMassFactorLinear","HP.sim","HP.validatePreset","SCALE_DIMS","T","applyQLock","ch","clamp","ctx","isNum","scaleExpT","validatePreset"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);   // 第281便a: 走行開始時の html の領域
const INDEX = 'file://' + path.join(ROOT, TARGET);
const OUT = path.join(ROOT, 'tests', 'out', 'charonfactors-w276b.json');
const PROBE_OUT = path.join(ROOT, 'tests', 'out', 'charonfactors-w276b-probe.json');
const CALAUDIT = path.join(ROOT, 'tests', 'out', 'calaudit-w249.json');
const EPSCANON = path.join(ROOT, 'tests', 'out', 'charoneps-w276b.json');
const HARNESS_VERSION = 'w276b-charonfactors-1';

const argv = process.argv.slice(2);
const getArg = (k, d) => { const i = argv.indexOf(k); return (i >= 0 && argv[i + 1]) ? argv[i + 1] : d; };
const PILOT = argv.includes('--pilot');
const STAGE = getArg('--stage', 'h');
const ONLY = (getArg('--only', '') || '').split(',').map((z) => z.trim()).filter(Boolean);
const want = (s) => !ONLY.length || ONLY.includes(s);

// ---- 契約(第272便b と同じ値・走らせる前に固定した) -------------------------------
const STEP_H = 20700000, ORB_MAX = 60, PERI_WINDOW = 20;
const STAGES = { h: { dt: 0.016, steps: STEP_H }, h2: { dt: 0.008, steps: STEP_H * 2 },
  h4: { dt: 0.004, steps: STEP_H * 4 } };
if (!STAGES[STAGE]) { console.error('--stage は h / h2 / h4'); process.exit(2); }
const STEPS = PILOT ? 2100000 : Number(getArg('--steps', STAGES[STAGE].steps));
const DT = STAGES[STAGE].dt;
const BASE_SCALE = { L: 6, T: 2, M: 25 };          // ❄️ の宣言(器は読むだけ)
const DIAG_SCALE = { L: 5, T: 2, M: 20 };          // 第276便b の診断単位(lib のコメントが理由)
const EPS_DIAG = 0.5;                              // 診断単位の 50 km = 内蔵 ε と同じ実長さ
const SPEC = unitChangeSpec(BASE_SCALE, DIAG_SCALE);

const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');
const targetSha256 = sha(fs.readFileSync(path.join(ROOT, TARGET)));
const measureSha256 = sha(fs.readFileSync(path.join(ROOT, 'tests', 'lib-w273b-charonpage.mjs')));
const libSha256 = sha(fs.readFileSync(path.join(ROOT, 'tests', 'lib-w276b-charonfactors.mjs')));

// ---- 観測は calaudit 正本から引く(手で打ち直さない) ------------------------------
let OBS = null;
try {
  const ca = JSON.parse(fs.readFileSync(CALAUDIT, 'utf8'));
  const pc = ca.presets.find((p) => p.id === 'plutoCharonReal');
  const row = pc.quantities.find((q) => q.kind === 'period' && q.adopted && q.adopted.value > 0);
  OBS = { value: row.adopted.value, sigma: row.adopted.sigma, unit: row.adopted.unit,
    key: row.adopted.key, recordId: row.adopted.recordId, source: row.adopted.source,
    from: 'tests/out/calaudit-w249.json', calauditSha256: sha(fs.readFileSync(CALAUDIT)) };
} catch (e) { OBS = { error: String(e) }; }
if (!OBS || !(OBS.sigma > 0)) { console.error('観測行が引けない: ' + JSON.stringify(OBS)); process.exit(2); }
const sigOf = (sec) => (Number.isFinite(sec)) ? (sec - OBS.value) / OBS.sigma : null;
const pctOf = (sec) => (Number.isFinite(sec)) ? (sec - OBS.value) / OBS.value * 100 : null;

// ---- ε 系列の正本(第276便b の別器)を読む。無ければ null のまま進める ------------
let EPS = null;
try {
  const J = JSON.parse(fs.readFileSync(EPSCANON, 'utf8'));
  const rows = [];
  for (const [id, byStage] of Object.entries(J.columns || {})) {
    const best = byStage.h4 || byStage.h2 || byStage.h;
    if (!best || !Number.isFinite(best.rev2Sec)) continue;
    rows.push({ id, units: id.indexOf('_diag_') > 0 ? 'diag' : 'base',
      epsRequested: best.cfg.softening, epsApplied: best.cfgApplied.softening,
      epsMeters: best.cfgApplied.softening * Math.pow(10, id.indexOf('_diag_') > 0 ? DIAG_SCALE.L : BASE_SCALE.L),
      stage: best.stage, periodSec: best.rev2Sec, residSec: best.rev2Sec - OBS.value,
      sigma: sigOf(best.rev2Sec), clamped: best.cfg.softening !== best.cfgApplied.softening });
  }
  rows.sort((a, b) => a.epsMeters - b.epsMeters);
  EPS = { from: 'tests/out/charoneps-w276b.json', sha256: sha(fs.readFileSync(EPSCANON)),
    generatedAt: J.meta && J.meta.generatedAt, rows };
} catch (e) { EPS = { error: '読めない(先に --eps 系列を回す): ' + String(e).slice(0, 90) }; }

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
// **測定コードは第272便b/第273便b と同一**(`tests/lib-w273b-charonpage.mjs` は 1 文字も変えない)
await page.evaluate(installCharonPage, { ORB_MAX, PERI_WINDOW });
// 診断コピーの作り方だけを包んで足す(単位換算・天体の追加・対の平行移動)。
// **倍率と座標はすべて node 側の純関数が作った数**で、ページ側は掛けて push するだけである。
await page.evaluate(() => {
  const base = window.__w272.make;
  window.__w272.make = (cfg) => {
    const p = base(cfg);
    if (cfg.units) {
      const sp = cfg.units;
      for (const k in sp.phys) if (typeof p.physics[k] === 'number') p.physics[k] = p.physics[k] * sp.phys[k];
      for (const b of p.bodies) for (const k in sp.body) if (typeof b[k] === 'number') b[k] = b[k] * sp.body[k];
      if (p.camera && typeof p.camera.scale === 'number') p.camera.scale /= sp.cameraDiv;
      p.scaleExp = { L: sp.to.L, T: sp.to.T, M: sp.to.M };
      if (cfg.softening !== undefined) p.physics.softening = cfg.softening;
    }
    if (cfg.diagClass) { p.sampleClass = 'principle'; p.fidelity = 'toy'; delete p.notClaim; delete p.claims; }
    if (cfg.shiftPair) { const s = cfg.shiftPair;
      for (let i = 0; i < 2; i++) { p.bodies[i].x += s.dx || 0; p.bodies[i].y += s.dy || 0;
        p.bodies[i].vx += s.dvx || 0; p.bodies[i].vy += s.dvy || 0; } }
    if (cfg.addBodies) for (const b of cfg.addBodies) p.bodies.push(JSON.parse(JSON.stringify(b)));
    return p;
  };
});

// ---------------------------------------------------------------- §B Float32 の量子化
// build 後の状態配列(Float32Array)から読み戻す。**宣言 JSON の数と build 後の数の差**が量子化。
const declaredJson = await page.evaluate(() => {
  const src = HP.allPresets().find((q) => q.id === 'plutoCharonReal');
  return { m: src.bodies.map((b) => b.m), x: src.bodies.map((b) => b.x), vy: src.bodies.map((b) => b.vy),
    G: src.physics.G, softening: src.physics.softening, scaleExp: src.scaleExp };
});
const stateBase = await page.evaluate((i) => window.__w272.declaredState(i), 'plutoCharonReal');
const stateDiag = await page.evaluate((z) => {
  const p = window.__w272.make({ kFrame: 0, f: 1, softening: z.eps, units: z.spec });
  const v = HP.validatePreset(p); if (!v.ok) return { error: v.errors };
  HP.sim.build(v.preset); const S = HP.sim;
  return { mA: S.m[0], mB: S.m[1], xA: S.x[0], xB: S.x[1], vyA: S.vy[0], vyB: S.vy[1],
    G: S.params.G, softening: S.params.softening, warnings: v.warnings,
    declared: { mA: p.bodies[0].m, mB: p.bodies[1].m, xA: p.bodies[0].x, xB: p.bodies[1].x,
      vyA: p.bodies[0].vy, vyB: p.bodies[1].vy, G: p.physics.G, softening: p.physics.softening } };
}, { eps: EPS_DIAG, spec: SPEC });

const SEC_BASE = Math.pow(10, BASE_SCALE.T);
function keplerRow(tag, G, mA, mB, a, secPerUnit) {
  const P = periodKepler(G, mA + mB, a) * secPerUnit;
  return { tag, G, mSum: mA + mB, a, periodSec: P, residSec: P - OBS.value,
    sigma: sigOf(P), pct: pctOf(P) };
}
const aBase = Math.abs(declaredJson.x[1] - declaredJson.x[0]);
const float32 = {
  note: '**alloc は S.m/S.x/S.y/S.vx/S.vy/S.spin/S.R を Float32Array で確保する**。'
    + '❄️ は stateCarry:"double" を宣言しているので **x/y/vx/vy と ax/ay・速度キャリーは Float64 へ'
    + '差し替わる**が、**質量 S.m は Float32Array のまま**である(器はこれを実測して下に出す)。'
    + '宣言 JSON の値と build 後の値の差が量子化である',
  base: { declared: declaredJson, built: { mA: stateBase.mA, mB: stateBase.mB,
    xA: stateBase.xA, xB: stateBase.xB, vyA: stateBase.vyA, vyB: stateBase.vyB },
    relMassA: (stateBase.mA - declaredJson.m[0]) / declaredJson.m[0],
    relMassB: (stateBase.mB - declaredJson.m[1]) / declaredJson.m[1],
    relSum: ((stateBase.mA + stateBase.mB) - (declaredJson.m[0] + declaredJson.m[1]))
      / (declaredJson.m[0] + declaredJson.m[1]),
    relSeparation: (Math.abs(stateBase.xB - stateBase.xA) - aBase) / aBase },
  diag: stateDiag.error ? stateDiag : {
    built: { mA: stateDiag.mA, mB: stateDiag.mB, xA: stateDiag.xA, xB: stateDiag.xB },
    declared: stateDiag.declared,
    relSum: ((stateDiag.mA + stateDiag.mB) - (stateDiag.declared.mA + stateDiag.declared.mB))
      / (stateDiag.declared.mA + stateDiag.declared.mB),
    relSeparation: (Math.abs(stateDiag.xB - stateDiag.xA)
      - Math.abs(stateDiag.declared.xB - stateDiag.declared.xA)) / Math.abs(stateDiag.declared.xB - stateDiag.declared.xA),
    warnings: stateDiag.warnings },
};
// 量子化ぶんだけ GM が動いたときの周期(ケプラーの閉じた式で評価 — 走行ではない)
float32.periodEffect = {
  declaredKepler: keplerRow('declared', declaredJson.G, declaredJson.m[0], declaredJson.m[1], aBase, SEC_BASE),
  builtKepler: keplerRow('built(Float32)', stateBase.G, stateBase.mA, stateBase.mB,
    Math.abs(stateBase.xB - stateBase.xA), SEC_BASE),
};
float32.periodEffect.deltaSec = float32.periodEffect.builtKepler.periodSec
  - float32.periodEffect.declaredKepler.periodSec;
float32.periodEffect.deltaSigma = float32.periodEffect.deltaSec / OBS.sigma;

// ---------------------------------------------------------------- §A 入力精度の監査(算術)
const precision = {
  kepler: {
    formula: 'P = 2π √(a³/(G(m_A+m_B)))(ニュートン二体・ε=0 の閉じた式。走行ではない)',
    declared: float32.periodEffect.declaredKepler,
    measuredKF0: null,   // ε 系列の正本から後で入れる
  },
  semiMajorAxis: {
    declaredKm: aBase * Math.pow(10, BASE_SCALE.L) / 1000,
    roundingKm: 0.5, why: '出典の a は 19,596 km と 1 km 刻みで丸められている(±0.5 km)',
    dPeriodSecPerHalfKm: null, dSigmaPerHalfKm: null },
  gravitationalConstant: {
    builtin: declaredJson.G, codata: CODATA_G.value, codataSource: CODATA_G.source,
    relDiff: null,   // 後で simValueCodata(同じサンプル単位)と比べて入れる
    dPeriodSec: null, dSigma: null,
    why: '内蔵は G=6.674(4 桁)。質量は出典表の値なので、GM は G の丸めぶんだけずれる' },
  gmPlu060: { source: PLU060.source, rows: PLU060.rows,
    builtinGMkm3s2: { pluto: declaredJson.G * 1e-11 * declaredJson.m[0] * Math.pow(10, BASE_SCALE.M) / 1e9,
      charon: declaredJson.G * 1e-11 * declaredJson.m[1] * Math.pow(10, BASE_SCALE.M) / 1e9 },
    note: '内蔵の GM は G(丸め)×転写質量。PLU060 は**出典として並べるだけ**で代入しない' },
  sigmaFormula: null, requiredCorrection: null,
};
{
  const P0 = precision.kepler.declared.periodSec;
  const aKm = precision.semiMajorAxis.declaredKm;
  const Pplus = periodKepler(declaredJson.G, declaredJson.m[0] + declaredJson.m[1],
    aBase * (1 + 0.5 / aKm)) * SEC_BASE;
  precision.semiMajorAxis.dPeriodSecPerHalfKm = Pplus - P0;
  precision.semiMajorAxis.dSigmaPerHalfKm = (Pplus - P0) / OBS.sigma;
  // G を CODATA 値へ置いた(**質量は転写のまま**)ときのケプラー周期の差。内蔵は変えない
  const gCodataSim = gSimFromSI(CODATA_G.value, BASE_SCALE);
  const PgReal = periodKepler(gCodataSim, declaredJson.m[0] + declaredJson.m[1], aBase) * SEC_BASE;
  precision.gravitationalConstant.simValueCodata = gCodataSim;
  precision.gravitationalConstant.dPeriodSec = PgReal - P0;
  precision.gravitationalConstant.dSigma = (PgReal - P0) / OBS.sigma;
  precision.gravitationalConstant.relDiff = (declaredJson.G - gCodataSim) / gCodataSim;
  precision.gravitationalConstant.note = 'G を CODATA 値へ置いた(質量は転写のまま)ときのケプラー周期の差。'
    + '**内蔵の G は 1 bit も変えていない**(変えると 131 本が動く署名便になる)';
  // PLU060 の総 GM を使ったときのケプラー周期(**採用ではない** — 出典の並置)
  const gmTot = PLU060.rows.filter((r) => r.body === 'Pluto' || r.body === 'Charon')
    .reduce((s, r) => s + r.gm, 0);
  const gmTotSigma = Math.hypot(...PLU060.rows.filter((r) => r.body === 'Pluto' || r.body === 'Charon')
    .map((r) => r.sigma || 0));
  const gmBuiltin = (precision.gmPlu060.builtinGMkm3s2.pluto + precision.gmPlu060.builtinGMkm3s2.charon);
  precision.gmPlu060.totalKm3s2 = gmTot;
  precision.gmPlu060.totalSigma = gmTotSigma;
  precision.gmPlu060.builtinTotalKm3s2 = gmBuiltin;
  precision.gmPlu060.builtinMinusSourceSigma = (gmBuiltin - gmTot) / gmTotSigma;
  const Pgm = 2 * Math.PI * Math.sqrt(Math.pow(aBase * Math.pow(10, BASE_SCALE.L), 3) / (gmTot * 1e9));
  precision.gmPlu060.periodFromSourceGM = Pgm;
  precision.gmPlu060.residSecFromSourceGM = Pgm - OBS.value;
  precision.gmPlu060.sigmaFromSourceGM = (Pgm - OBS.value) / OBS.sigma;
  precision.sigmaFormula = sigmaPeriodIndependent(
    { value: aBase * Math.pow(10, BASE_SCALE.L), sigma: 500 },
    { value: gmTot * 1e9, sigma: gmTotSigma * 1e9 }, OBS.value);
  precision.sigmaFormula.covarianceNote =
    '**独立近似である。** a と GM は同じ観測解の推定量なので相関があり、正しく伝播させるには'
    + '**同じ解の状態ベクトルと共分散行列**が要る(本便には無い)。この行は「丸め幅だけでも'
    + '観測 σ の何倍になるか」を示す上限側の目安であって、誤差予算の確定値ではない';
}

// ---------------------------------------------------------------- 走行ヘルパ
const results = {};
async function measure(id, cfg, note, stage) {
  const st = STAGES[stage || STAGE];
  const steps = PILOT ? STEPS : st.steps;
  const t0 = Date.now();
  const r = await page.evaluate((z) => window.__w272.run(z.cfg, z.dt, z.steps),
    { cfg, dt: st.dt, steps });
  const wall = (Date.now() - t0) / 1000;
  if (r.error) { results[id] = { id, note, stage: stage || STAGE, error: r.error, errors: r.errors };
    console.log(id.padEnd(18) + ' ERROR ' + JSON.stringify(r.errors).slice(0, 160)); return results[id]; }
  const SEC = Math.pow(10, (cfg.units ? cfg.units.to.T : BASE_SCALE.T));
  const revSec = r.rev.map((x) => x * SEC);
  const rev2 = (revSec.length > 1) ? revSec[1] : null;
  const row = { id, note, stage: stage || STAGE, dt: st.dt, steps: r.steps, wallSec: wall,
    rev2Sec: rev2, revN: r.revN, residSec: rev2 === null ? null : rev2 - OBS.value,
    sigma: sigOf(rev2), pct: pctOf(rev2), eProxy: r.eProxy,
    cfgApplied: r.cfgApplied, warnings: r.warnings, ledger: r.ledger, clamp: r.clamp,
    nan: r.nan, stop: r.stop, nBodies: (cfg.addBodies ? cfg.addBodies.length : 0) + 2 };
  results[id] = row;
  console.log([id.padEnd(18), 'n=' + row.nBodies, 'P2=' + (rev2 === null ? '—' : rev2.toFixed(4)).padStart(14),
    'σ=' + (row.sigma === null ? '—' : row.sigma.toFixed(3)).padStart(11),
    'stop=' + r.stop, 'nan=' + r.nan, 'wall=' + wall.toFixed(1) + 's'].join(' '));
  return row;
}

// ---------------------------------------------------------------- §C 小衛星
const satellites = { declaration: null, columns: [], massFloor: null, fiDesign: null };
if (want('C')) {
  const mP = declaredJson.m[0] * SPEC.body.m, mC = declaredJson.m[1] * SPEC.body.m;
  const Gd = declaredJson.G * SPEC.phys.G;
  const moons = SMALL_MOONS.map((mn, i) => moonStateSim(mn, i, Gd, mP + mC, DIAG_SCALE));
  satellites.declaration = {
    units: DIAG_SCALE, epsilon: EPS_DIAG, kFrame: 0,
    how: '円軌道・同一平面・位相 φ_i = i×1.1 rad・自転 0(**実在の自転状態の主張ではない**)。'
      + '質量は GM/G_sim から作る(上限しか無い Styx/Kerberos は**上限値を診断値として**使う)。'
      + '二体の初期条件は転写のまま —— 小衛星を足したことによる系の全運動量のずれは `momentum` に記録する',
    moons };
  const addAll = moons.map((z) => z.body);
  const base = { kFrame: 0, f: 1, geoPN: 2, softening: EPS_DIAG, units: SPEC, diagClass: true };
  await measure('SAT_none', { ...base }, '小衛星なし(診断単位の基準列)');
  await measure('SAT_all', { ...base, addBodies: addAll }, '小衛星 4 体(公称/上限)');
  for (let i = 0; i < moons.length; i++)
    await measure('SAT_' + moons[i].name, { ...base, addBodies: [moons[i].body] }, moons[i].name + ' 単独');
  await measure('SAT_all_x100', { ...base,
    addBodies: addAll.map((b) => ({ ...b, m: b.m * 100 })) }, '小衛星 4 体 ×100 質量(感度の反例)');
  // massFloor: **基準単位**では Nix 相当が床 1e-6 へ持ち上がる。同じ 4 体を基準単位でも組む
  const moonsBase = SMALL_MOONS.map((mn, i) => moonStateSim(mn, i, declaredJson.G,
    declaredJson.m[0] + declaredJson.m[1], BASE_SCALE));
  const builtBase = await page.evaluate((z) => {
    const p = window.__w272.make({ kFrame: 0, f: 1, softening: 0.05, diagClass: true, addBodies: z.add });
    const v = HP.validatePreset(p); if (!v.ok) return { error: v.errors };
    HP.sim.build(v.preset); const S = HP.sim;
    return { m: Array.from(S.m), warnings: v.warnings, declared: p.bodies.map((b) => b.m) };
  }, { add: moonsBase.map((z) => z.body) });
  satellites.massFloor = {
    key: 'physics.massFloor', declared: 1e-6,
    baseUnits: { scale: BASE_SCALE, declared: builtBase.declared, built: builtBase.m,
      lifted: builtBase.error ? null : builtBase.declared.map((d, i) =>
        ({ declared: d, built: builtBase.m[i], ratio: d > 0 ? builtBase.m[i] / d : null })),
      warnings: builtBase.warnings, error: builtBase.error || null },
    diagUnits: { scale: DIAG_SCALE, declared: moons.map((z) => z.body.m),
      floor: 1e-6, allAboveFloor: moons.every((z) => z.body.m > 1e-6) },
    note: '**html の SCALE_DIMS に massFloor が無い**(質量次元なのに換算表に載っていない)ので、'
      + '単位を変えると床は実質量で 10⁵ 倍下がる。これが「単位変更で回避したか」の答えである' };
  satellites.fiDesign = {
    ruling: '第66報 (2)「それらの質量補正を選択肢に入れつつ検討対象とする」',
    rule: '次の検証で小衛星ごとの係数 f_i を許すなら、**カロンの周期だけに当てない** —— '
      + '同じ f_i で ① 各小衛星の軌道長半径と公転周期 ② 4 体の相互共鳴(3:4:5:6 近傍)の長期安定性 '
      + '③ 冥王星–カロンの周期 を**同時に**制約する。自由度 4 に対して拘束が 9 本以上になるので、'
      + '**一点 fit にならない**ことが設計上の条件である',
    notDone: '本便では f_i を 1 つも当てていない(公称値と 100 倍の 2 点だけを測った)' };
}

// ---------------------------------------------------------------- §D 太陽を分解した 3 体
const sun = { obstruction: null, ladder: [], fit: null, extrapolated: null, separateSeries: null };
if (want('D')) {
  const mP = declaredJson.m[0] * SPEC.body.m, mC = declaredJson.m[1] * SPEC.body.m;
  const Gd = declaredJson.G * SPEC.phys.G;
  const aDiag = aBase * SPEC.body.x;
  const lad = sunLadder({ G: Gd, mPair: mP + mC, a: aDiag, scale: DIAG_SCALE,
    limits: ACCEPT_LIMITS, epsFloorM: epsFloorMeters(DIAG_SCALE.L) });
  sun.obstruction = lad.obstruction;
  sun.declaration = lad.declaration;
  sun.trueX = lad.trueX;
  const base = { kFrame: 0, f: 1, geoPN: 2, softening: EPS_DIAG, units: SPEC, diagClass: true };
  const ref = await measure('SUN_none', { ...base }, '太陽なし(同じ単位・同じ ε の基準列)');
  for (const pt of lad.points) {
    const r = await measure('SUN_X' + pt.X, { ...base, addBodies: [pt.body], shiftPair: pt.shiftPair },
      '代理配置 X=(n′/n)²=' + pt.X + '(M_s=' + pt.body.m.toPrecision(6) + '・r_s=' + pt.rs + ')');
    sun.ladder.push({ X: pt.X, Ms: pt.body.m, rs: pt.rs, id: r.id,
      periodSec: r.rev2Sec, dPeriodSec: (r.rev2Sec !== null && ref.rev2Sec !== null) ? r.rev2Sec - ref.rev2Sec : null,
      nan: r.nan, stop: r.stop, error: r.error || null });
  }
  const good = sun.ladder.filter((z) => Number.isFinite(z.dPeriodSec) && z.dPeriodSec !== 0);
  sun.fit = (good.length >= 2)
    ? fitPowerLaw(good.map((z) => z.X), good.map((z) => Math.abs(z.dPeriodSec)))
    : { error: '点が足りない' };
  if (sun.fit && Number.isFinite(sun.fit.a)) {
    const Xtrue = lad.trueX;
    const dp = sun.fit.a * Math.pow(Xtrue, sun.fit.p);
    const sgn = good.length ? Math.sign(good[0].dPeriodSec) : 1;
    sun.extrapolated = { trueX: Xtrue, dPeriodSecAbs: dp, dPeriodSecSigned: sgn * dp,
      sigmaOfObs: dp / OBS.sigma, residShare: dp / Math.abs(float32.periodEffect.declaredKepler.residSec || 1),
      note: '**外挿である。** 真の配置(太陽まで 5.9×10¹² m)は受理値域に入らないので、'
        + '同じ潮汐小パラメータ X をもつ代理配置の梯子で測ったべき則を延長した。'
        + '代理配置は a/r_s を固定して M_s だけを振ってあるので、X 以外の無次元量は動いていない' };
  }
  sun.separateSeries = {
    notMeasured: ['太陽潮汐の長期項(代理配置の 1 公転が走行時間より長いので secular 項は測っていない)',
      '冥王星の J₂ / C₂₂(**出典を持っていないので作らない**)',
      'カロンの J₂ / 潮汐変形', '観測周期の定義(Buie 2012 は二体ケプラー適合値 —— 同方向 1 周とも近点間とも別の推定量)',
      '観測時刻系(TDB/TT)と光行差の扱い'],
    why: '**未確認の値を作らない**(第66報の「探る」に対して、測れたものと測っていないものを分ける)' };
}

// ---------------------------------------------------------------- §E 要因表
const epsRow = (m) => (EPS && EPS.rows) ? EPS.rows.find((z) => Math.abs(z.epsMeters - m) < 1) : null;
const eps50k = epsRow(50000), eps10k = epsRow(10000), eps1k = epsRow(1000);
const factors = [];
const addFactor = (f) => factors.push(f);
addFactor({ factor: 'softening ε(50 km → 1 km)',
  kind: 'numerical',
  dPeriodSec: (eps50k && eps1k) ? (eps1k.periodSec - eps50k.periodSec) : null,
  residAtSmallestSec: eps1k ? eps1k.residSec : null,
  sigmaOfObs: (eps50k && eps1k) ? (eps1k.periodSec - eps50k.periodSec) / OBS.sigma : null,
  residSigmaAtSmallest: eps1k ? eps1k.sigma : null,
  adopt: '採らない(既定の ε は変えない)',
  why: '**ε→小 で残差はゼロへ行かない** —— 1 km でも残差が残る。ε は数値設定であって物理法則ではないので、'
    + '「残差が消える ε」を選ぶのは fit である。**受理下限 0.01 単位は基準単位で 10 km** なので、'
    + '1 km まで下げるには**単位を変える**しかない(実装上の問題であって物理ではない)' });
addFactor({ factor: 'a の丸め(19,596 km・±0.5 km)', kind: 'input',
  dPeriodSec: precision.semiMajorAxis.dPeriodSecPerHalfKm,
  sigmaOfObs: precision.semiMajorAxis.dSigmaPerHalfKm,
  adopt: '採らない(入力の同定が先)',
  why: '丸め幅だけで残差 +7.62 s の数倍を動かす。**a を動かして残差を消すのは一点 fit** で、'
    + '同じ観測解の状態ベクトルへ戻す作業とは別物である' });
addFactor({ factor: 'G の丸め(6.674 対 CODATA 6.67430)', kind: 'input',
  dPeriodSec: precision.gravitationalConstant.dPeriodSec,
  sigmaOfObs: precision.gravitationalConstant.dSigma,
  adopt: '採らない(**署名便になる** —— 内蔵 131 本の G を触る)',
  why: '内蔵は 4 桁の G。質量は出典表の値なので GM が丸めぶんずれる' });
addFactor({ factor: 'GM の観測精度(PLU060)', kind: 'input',
  dPeriodSec: null, sigmaOfObs: precision.sigmaFormula.sigmaPeriodSec / OBS.sigma,
  adopt: '採らない(内蔵の値は変えない)',
  why: '出典の GM 精度を独立近似で周期へ伝播させると観測 σ の '
    + precision.sigmaFormula.sigmaPeriodSec.toPrecision(4) + ' s 相当になる。'
    + '**共分散が要る**ので確定値ではない' });
addFactor({ factor: '状態配列が Float32', kind: 'numerical',
  dPeriodSec: float32.periodEffect.deltaSec, sigmaOfObs: float32.periodEffect.deltaSigma,
  adopt: '採らない(本便では変えない —— 変えれば 131 本が 1 bit 動く署名便)',
  why: '**質量 S.m は Float32Array のまま**である(stateCarry:"double" が Float64 にするのは '
    + 'x/y/vx/vy と加速度・速度キャリーだけ)。相対 2×10⁻⁸ の量子化が GM に入る。'
    + '**26 ms(=1σ)を論じるには状態表現そのものが足りていない**という指摘であって、'
    + 'この項だけで残差が説明できるという意味ではない' });
const dSat = (results.SAT_all && results.SAT_none && Number.isFinite(results.SAT_all.rev2Sec))
  ? results.SAT_all.rev2Sec - results.SAT_none.rev2Sec : null;
addFactor({ factor: '小衛星 4 体(Styx/Nix/Kerberos/Hydra)', kind: 'physical',
  dPeriodSec: dSat,
  dPeriodSecX100: (results.SAT_all_x100 && results.SAT_none && Number.isFinite(results.SAT_all_x100.rev2Sec))
    ? results.SAT_all_x100.rev2Sec - results.SAT_none.rev2Sec : null,
  sigmaOfObs: Number.isFinite(dSat) ? dSat / OBS.sigma : null,
  adopt: '内蔵へは足さない(❄️ は二体の転写サンプルである)',
  why: '第66報 (2) の「カロン以外の衛星の影響」を実測した。**基準単位では massFloor 1e-6 が'
    + 'Nix 相当を持ち上げてしまう**ので、単位を変えないと測れない(実装上の問題)' });
addFactor({ factor: '太陽を分解する', kind: 'physical',
  dPeriodSec: sun.extrapolated ? sun.extrapolated.dPeriodSecSigned : null,
  sigmaOfObs: sun.extrapolated ? sun.extrapolated.dPeriodSecSigned / OBS.sigma : null,
  adopt: '採らない(**真の配置が受理値域に入らない** —— 外挿値である)',
  why: '|x|≤5000 単位と ε≥0.01 単位が同時に効くので受理できる動的レンジは 5×10⁵ 止まり。'
    + '冥王星–太陽 5.9×10¹² m を ε=10 km で置くには 5.9×10⁸ が要る' });
addFactor({ factor: '周期の定義(同方向 1 周 / 近点間 / 二体ケプラー適合)', kind: 'definition',
  dPeriodSec: null, sigmaOfObs: null,
  adopt: '**未確定**(門は mapping-unresolved のまま)',
  why: '観測 551856.43872±0.02592 s は Buie 2012 の**二体ケプラー適合値**で、'
    + 'シミュレータの同方向 1 周とも近点間とも別の推定量である。'
    + '対応が決まるまで「合/否」を上書きしない(裁定 I6・第272便a の行契約)' });

const conclusion = {
  headline: '**解決したのは「説明」「低 ε 検査を妨げる単位設定」「小衛星の質量床」という実装上の 3 つで、'
    + '観測一致は達成していない。**',
  achieved: ['❄️ の obsCard と説明にあった「kFrame=0 は観測周期を +0.002% で写す」を正式判定'
    + '(+0.001381%・+294.08σ・否(3σ))へ改めた(**物理入力の署名は不変**)',
    '受理下限 ε=0.01 単位が基準単位で 10 km になる問題を、**単位を変えた診断コピー**で回避して 1 km まで測った',
    '基準単位では massFloor 1e-6 が Nix 相当(2.2×10⁻⁹)を持ち上げてしまうことを実測し、'
    + '単位変更で床を割らずに 4 体を置けることを確かめた',
    '「どの要因が加われば解決するか」を感度表に分解した'],
  notAchieved: ['**残差は消えていない。** ε を受理下限の 1/10(1 km)まで下げても残差は残り、符号は負である',
    '**小衛星も太陽も残差を説明しない**(どちらも観測 σ より小さいか、外挿でしか出せない)',
    '**入力精度(a の丸め・G の丸め・Float32)だけで残差の数倍が動く**ので、'
    + 'いまの入力のままでは 1σ(26 ms)の判定に意味が無い'],
  nextGate: '❄️ を 3σ で論じるには、① **同じ観測解の状態ベクトルと共分散**(Buie 2012 / PLU060 の元解)'
    + 'を入力にする ② 状態表現を Float32 から上げる ③ 周期の定義対応(mapping)を決める —— '
    + 'の 3 つが先で、①②③ の前に ε や f を動かして残差を合わせない',
};

// ---------------------------------------------------------------- 書き出し
const MK = charonMergeKey({ target: TARGET, targetSha256, measureSha256, libSha256,
  obsSha256: OBS.calauditSha256 || '', obsRow: { key: OBS.key, recordId: OBS.recordId,
    value: OBS.value, sigma: OBS.sigma },
  window: { periWindow: PERI_WINDOW, orbMax: ORB_MAX, judgedRevIndex: 1 }, stageSteps: STAGES });
const CANON = isCanonicalRun({ pilot: PILOT, steps: STEPS, stageSteps: STAGES[STAGE].steps });

if (EPS && EPS.rows && EPS.rows.length) {
  const r50 = EPS.rows.find((z) => Math.abs(z.epsMeters - 50000) < 1);
  precision.kepler.measuredKF0 = r50
    ? { id: r50.id, stage: r50.stage, periodSec: r50.periodSec, residSec: r50.residSec, sigma: r50.sigma }
    : null;
}
// 低 ε 側の残差を消すのに要る a・f(**採用済み補正ではない** —— 感度の例である)
precision.requiredCorrection = (eps1k && Number.isFinite(eps1k.residSec)) ? {
  fromEpsilon: eps1k.id, residSec: eps1k.residSec,
  aShiftMeters: aFromPeriodShift(-eps1k.residSec, OBS.value,
    Math.abs(declaredJson.x[1] - declaredJson.x[0]) * Math.pow(10, BASE_SCALE.L)),
  massFactor: massFactorFromPeriodShift(-eps1k.residSec, OBS.value),
  note: '**採用済み補正ではない。** 「残差を消すには a をこれだけ動かす / 質量をこの倍率にする」'
    + 'という感度の例で、どちらも一点 fit である(採らない)' } : null;

const out = {
  meta: withProvenance({ wave: '第276便b', harness: 'tests/exp-w276b-charonfactors.mjs',
    harnessVersion: HARNESS_VERSION, factorsVersion: CHARON_FACTORS_VERSION,
    unitsVersion: UNITS_VERSION, measureLib: 'tests/lib-w273b-charonpage.mjs',
    measureVersion: CHARON_PAGE_VERSION, measureSha256, libSha256,
    mergeKeyVersion: MERGEKEY_VERSION, mergeKey: MK.key, mergeKeyParts: MK.parts,
    canonicalRun: CANON.canonical, canonicalRunWhy: CANON.why,
    generatedAt: new Date().toISOString(), pilot: PILOT, stage: STAGE, dt: DT, stepsRequested: STEPS,
    ruling: '第66報 (2): plutoCharonReal の kF0 版に問題がないか確認し、問題があれば解決する / '
      + 'カロン以外の衛星の影響も、それらの質量補正を選択肢に入れつつ検討対象とする / '
      + '「どの様な要因が加われば解決するか」を探る',
    contract: { stepH: STEP_H, orbMax: ORB_MAX, periWindow: PERI_WINDOW, stages: STAGES,
      judgedRevIndex: 1, baseScale: BASE_SCALE, diagScale: DIAG_SCALE, epsilonDiag: EPS_DIAG,
      note: '窓・終了条件・測定コードは第272便b/第273便b と同一。**判定はしない —— 感度表である**' },
    unitSpec: SPEC, acceptLimits: ACCEPT_LIMITS, acceptedDynamicRange: acceptedDynamicRange(),
    observation: OBS,
    builtinUnchanged: { m: declaredJson.m, G: declaredJson.G, softening: declaredJson.softening,
      scaleExp: declaredJson.scaleExp,
      note: '**内蔵 ❄️ の物理入力は 1 bit も変えていない**(本便が変えたのは説明文だけ)' },
    notClaim: ['カロンの合否', '観測一致を達成した', 'D₀ を較正した', '残差ゼロの ε を採用した',
      '小衛星で残差を説明した', '太陽で残差を説明した', '質量補正 f_i を決めた', '新発見'] },
    { root: ROOT, wave: '第276便b', target: TARGET,
      code: ['tests/exp-w276b-charonfactors.mjs', 'tests/lib-w276b-charonfactors.mjs',
        'tests/lib-w276b-units.mjs', 'tests/lib-w273b-charonpage.mjs', 'tests/lib-w273b-mergekey.mjs',
        'tests/lib-w272e-provenance.mjs'],
      inputs: [TARGET, 'tests/out/calaudit-w249.json', 'tests/out/charoneps-w276b.json'] }),
  epsilonSeries: EPS, precision, float32, satellites, sun,
  factors, conclusion, columns: results, pageErrors };

fs.mkdirSync(path.dirname(OUT), { recursive: true });
Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));   // 第281便a: 領域 hash の 3 欄 + JSON 入力の安定 hash
fs.writeFileSync(CANON.canonical ? OUT : PROBE_OUT, JSON.stringify(out, null, 1));
console.log('wrote ' + (CANON.canonical ? OUT : PROBE_OUT) + (CANON.canonical ? '' : '(短い走行: ' + CANON.why + ')'));
await browser.close();
