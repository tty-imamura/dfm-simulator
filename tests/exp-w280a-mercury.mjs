// 第280便a — 水星便(原仮定者の裁定(第70報)「mercuryReal: 観測値版で問題が出ている理由を調査する/
//   mercuryRealKF1: mercuryReal の精度を目標にする・引きずりは座標変換であり遠心力に関わらない」・
//   統括の検証項目 R65/R66)。
//
// ■ 何を測るか(**正式の測定演算子と窓のまま**)
//   判定器 `tests/exp-w249b-calaudit.mjs` のページ側ヘルパ(近点抽出 A = ṙ の −→+ 交差・近点位相の直線 fit・
//   20 近点の周期窓)を**ソース文字列のまま**切り出して(`extractCalauditHelpers`)、対象 html を Node の vm で
//   読み込んだ headless 器(`tests/lib-w279b-headless.mjs`)の中で評価する。停止条件は判定器と同じ
//   `stopRuleFor`(60 公転ぶんの步数・orbMax=60)で、☄️ の正式窓(近点 59 本)と同じ本数になる。
//   **判定器の正式値そのもの**(dt=0.016・ε=0.05 の ☄️ 2.2514656997711987e−5 deg/周)を最初に再現し、
//   ビットで一致しなければ器を止める(同じ抽出器・同じ窓の 1 表を先に作る)。
//
//   (1) 格子: ☄️ の kF0 走行を dt 4 段(0.032/0.016/0.008/0.004)× ε 3 段(0.05/0.02/0.01 = 5000/2000/1000 km)
//       × λ_PN 2 値(1/0)で回す。ε と λ_PN を変えた走行は**器の中だけの診断コピー**(内蔵には足さない)。
//   (2) 1 表(ε=0.05・dt 3 段 0.016/0.008/0.004・同じ状態ベクトル): kF0(☄️)/kF1(🪨)/geoPN=3 scalar
//       (現行トイ = 1PN なし対照)/meshVelocity vMinusU(field:"explicit"・kF0・geoPN=2 —— 座標変換の版)/λ_PN=0。
//   (3) 精度目標: 🪨 − ☄️ の差を ε 3 段 × dt 2 段と、太陽の自転 0 の診断コピーで測る。
//
// ■ 宣言(**測る前に書く**)
//   (M1) 較正 2 本(☄️🪨)の物理・入力・claims は 1 bit も変えない(診断コピーは器の中だけ)。
//   (M2) q は触らない(🪨 の診断コピーも qLock の宣言のまま)。
//   (M3) 窓は判定器の正式窓(近点 59 本)。これを変える診断はしない。
//   (M4) 外挿値(dt→0・ε→0)は**外挿**であって、そこで走らせた値ではない。「精度を上げれば成立」とは書かない。
//
// 実行: PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright node tests/exp-w280a-mercury.mjs
//       W280A_ENGINE=node … (Chromium なし・Node の vm —— 約 20 倍遅い)/ W280A_QUICK=1 …(正式値の再現だけ)
// 出力: tests/out/mercury-w280a.json(CANON・来歴は lib-w272e-provenance の形)
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { loadHtmlHeadless } from './lib-w279b-headless.mjs';
import { stopRuleFor, STOP_RULE_VERSION } from './lib-w270a-stoprule.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { MERCURY_W280A_VERSION, extractCalauditHelpers, richardson3, epsExtrap, pn1AnalyticDeg,
  softeningAnalyticDeg, softeningCoefDeg, arcsecPerCenturyToDegPerOrbit, degPerOrbitToArcsecPerCentury,
  decompose, JULIAN_CENTURY_DAYS } from './lib-w280a-mercury.mjs';
// 第281便a(原仮定者の裁定(第71報)・AN16・統括の検証項目 R71): **この器が読む html の領域**の宣言。
//   `tests/lib-w281a-scope.mjs` がこの領域だけの hash(`scopeSha256`)を正本の meta に刻む。
//   `lint.provenanceMeta` ② は「targetSha256 一致 **または**(scopeComplete かつ scopeSha256 が今の html で
//   引き直した値と一致)」で通す。`lint.regenScope` が「宣言 ⊇ 器のコードから機械で引いた下限
//   (HP.*・html の最上位名・内蔵プリセット id)」を照合する。**1 行の JSON**(lint が読む)。
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
const REGEN_SCOPE = {"presets":["alphaCenAB","alphaCenABDFM","earthMoonRealKF1","emAuditDFM","emAuditNewton","gw150914DFM","jupiterGalilean","marsMoonsReal","mercuryReal","mercuryRealKF1","neptuneReal","plutoCharonReal","psrB1534","psrB1534CF","psrB1534DFM","psrDoubleAB","psrDoubleABCF","psrDoubleABDFM","psrDoubleABPN","psrDoubleABSpinCal","psrJ1757CF","psrJ1757DFM","psrJ1757PN","psrJ1946CF","psrJ1946DFM","psrJ1946PN","qLockRadialAudit","qLockRadialAuditQ3","saturnZonalD68","siriusAB","siriusABDFM","venusReal"],"roots":["$","HP.allPresets","HP.coreState","HP.sim","HP.validatePreset","T","applyQLock","ch","clamp","ctx","isNum","scaleExpT","validatePreset"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);   // 第281便a: 走行開始時の html の領域
const OUT = path.join(ROOT, 'tests', 'out', 'mercury-w280a.json');
const CALAUDIT = 'tests/exp-w249b-calaudit.mjs';
const CANON_CAL = 'tests/out/calaudit-w249.json';
const QUICK = process.env.W280A_QUICK === '1';
const t0 = Date.now();
const log = (...a) => console.error('[w280a]', ...a);

// ---------------------------------------------------------------- 対象と正式の抽出器
// 走らせる場所: 既定は判定器と同じ Chromium(ページで html を読む)。W280A_ENGINE=node で Node の vm
// (`tests/lib-w279b-headless.mjs` —— 同じ inline script を評価する。**約 20 倍遅い**が Chromium 不要)。
const ENGINE = process.env.W280A_ENGINE === 'node' ? 'node' : 'chromium';
let H = null, browser = null, pg = null;
if (ENGINE === 'node') {
  H = loadHtmlHeadless(path.join(ROOT, TARGET));
  if (!H.HP) throw new Error('HP が無い');
} else {
  const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/opt/node22/lib/node_modules/playwright';
  const req = createRequire(path.join(PW_DIR, 'noop.js'));
  const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  try { browser = await req('playwright').chromium.launch(); }
  catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }
  pg = await browser.newPage();
  await pg.goto('file://' + path.join(ROOT, TARGET), { waitUntil: 'load' });
  await pg.waitForFunction(() => window.HP && HP.sim);
}
const E = async (code) => (ENGINE === 'node') ? H.evalExpr(code) : await pg.evaluate(code);
const calSrc = fs.readFileSync(path.join(ROOT, CALAUDIT), 'utf8');
const helperBody = extractCalauditHelpers(calSrc);
const helperSha = crypto.createHash('sha256').update(helperBody, 'utf8').digest('hex');
const PERI_WINDOW = Number((calSrc.match(/const PERI_WINDOW = (\d+);/) || [])[1]);
const ORB_MAX = Number((calSrc.match(/const ORB_MAX = (\d+);/) || [])[1]);
const DT0 = Number((calSrc.match(/const DT0 = ([\d.]+);/) || [])[1]);
if (!(PERI_WINDOW === 20 && ORB_MAX === 60 && DT0 === 0.016)) throw new Error('判定器の窓の宣言が想定と違う');
await E('(function(PERI_WINDOW){' + helperBody + '})(' + PERI_WINDOW + ')');
// 診断コピーを build する窓口(判定器の `__w249build` と同じ 4 行 —— 探す先だけが器の中の表)
await E(`(function(){
  const ORIG = window.__w249build;
  window.__w280aVariants = {};
  window.__w249build = (id, kFrame0) => {
    const V = window.__w280aVariants[id];
    if (!V) return ORIG(id, kFrame0);
    const copy = JSON.parse(JSON.stringify(V));
    const v = HP.validatePreset(copy);
    if (!v.ok) throw new Error('診断コピーが受理されない: ' + id + ' / ' + (v.err || v.error || JSON.stringify(v.errors || '')));
    HP.sim.build(v.preset);
    return { warnings: v.warnings, n: HP.sim.n, map: window.__w249map(v.preset),
      kFrameApplied: (v.preset.physics || {}).kFrame };
  };
})()`);

const presetOf = async (id) => JSON.parse(await E(`JSON.stringify(HP.allPresets().find((q) => q.id === ${JSON.stringify(id)}))`));
const KF0 = await presetOf('mercuryReal'), KF1 = await presetOf('mercuryRealKF1');
const sameBodies = JSON.stringify(KF0.bodies) === JSON.stringify(KF1.bodies);
if (!sameBodies) throw new Error('☄️ と 🪨 の bodies が違う(同じ状態ベクトルの前提が崩れた)');

function variant(base, id, patch, extra) {
  const p = JSON.parse(JSON.stringify(base));
  p.id = id; p.name = id;
  p.physics = Object.assign({}, p.physics, patch || {});
  if (extra) extra(p);
  return p;
}
async function register(p) {
  await E(`window.__w280aVariants[${JSON.stringify(p.id)}] = ${JSON.stringify(p)};`);
}

// 1 走行(判定器の `__w249run` をそのまま呼ぶ)
async function run(id, dt) {
  const b0 = await E(`window.__w249build(${JSON.stringify(id)}, false)`);
  const G = await E('HP.sim.params.G');
  const targets = [{ ci: b0.map[0], oi: b0.map[1], label: '水星' }];
  const osc0 = await E(`window.__w249osc0(${targets[0].ci}, ${targets[0].oi}, ${G})`);
  const spo = [osc0.P / dt];
  // 停止条件は判定器と同じ宣言(☄️ の id で引く —— 診断コピーも同じ步数上限・同じ近点数)
  const sr = stopRuleFor({ id: 'mercuryReal', n: b0.n, dt, dtBase: DT0, stepsPerOrbit: spo, orbMax: ORB_MAX });
  const w0 = Date.now();
  const r = await E(`window.__w249run(${JSON.stringify(id)}, ${dt}, ${sr.maxSteps}, ${JSON.stringify(targets)}, ${ORB_MAX}, ${G}, false)`);
  const S = await E(`(function(){ const S=HP.sim; return { hasMeshVelocity: S.hasMeshVelocity===true,
    meshVelN: S.meshVelN||0, meshVelUMax: S.meshVelUMax||0, meshVelKickMax: S.meshVelKickMax||0,
    meshVelWork: S.meshVelWork||0, meshVelUndef: S.meshVelUndef||0, meshVelBad: S.meshVelBad||0,
    meshVelDeny: S.meshVelDeny||null, hasGeoToy: S.hasGeoToy===true, geoToyStop: S.geoToyStop||null,
    geoPN: S.params.geoPN, lambdaPN: S.params.lambdaPN, kFrame: S.params.kFrame, q: S.params.q,
    softening: S.params.softening, spin0: S.spin[0] }; })()`);
  const t = r.targets[0];
  return {
    id, dt, steps: r.steps, maxSteps: sr.maxSteps, wallSec: (Date.now() - w0) / 1000, nan: r.nan, clamp: r.clamp,
    warnings: (b0.warnings || []).length,
    slopeDegA: t.A.slopeDeg, residDegA: t.A.residDeg, nPeriA: t.A.nPeri, rejA: t.A.rej,
    slopeDegB: t.B.slopeDeg, nPeriB: t.B.nPeri,
    perMeanSimA: t.A.perMean, perMeanFitSimA: t.A.perMeanFit,
    revP2Sim: (t.revP && t.revP.length > 1) ? t.revP[1] : null, revN: t.revN,
    eProxy: t.eProxy, osc0: { a: osc0.a, e: osc0.e, P: osc0.P, mu: osc0.mu },
    state: S,
  };
}

// ---------------------------------------------------------------- 正式値の再現(同じ抽出器・同じ窓)
const cal = JSON.parse(fs.readFileSync(path.join(ROOT, CANON_CAL), 'utf8'));
const calRow = (id) => cal.presets.find((p) => p.id === id).quantities.find((q) => q.kind === 'precession');
const CAL0 = calRow('mercuryReal'), CAL1 = calRow('mercuryRealKF1');
const r00 = await run('mercuryReal', 0.016);
const r01 = await run('mercuryRealKF1', 0.016);
const repro = {
  kF0: { formal: CAL0.meas, here: r00.slopeDegA, bitIdentical: r00.slopeDegA === CAL0.meas, nPeri: r00.nPeriA },
  kF1: { formal: CAL1.meas, here: r01.slopeDegA, bitIdentical: r01.slopeDegA === CAL1.meas, nPeri: r01.nPeriA },
  engine: ENGINE,
  note: '判定器の正本値(calaudit-w249.json)と、同じ抽出器のソースを本器(' + ENGINE + ')で評価した値のビット比較',
};
log('正式値の再現', JSON.stringify(repro));
if (!repro.kF0.bitIdentical || !repro.kF1.bitIdentical) throw new Error('正式値をビットで再現できない —— 器を止める');
if (QUICK) { log('QUICK 終了', (Date.now() - t0) / 1000, 's'); if (browser) await browser.close(); process.exit(0); }

// ---------------------------------------------------------------- (1) 格子 dt × ε × λ_PN
const DTS = [0.032, 0.016, 0.008, 0.004];
const EPS = [0.05, 0.02, 0.01];
const LAMS = [1, 0];
const KM_PER_UNIT = 1e5;   // 1 単位 = 10⁸ m = 10⁵ km
const grid = [];
for (const lam of LAMS) for (const eps of EPS) {
  const isBase = (lam === 1 && eps === 0.05);
  const id = isBase ? 'mercuryReal' : `mercuryDiag_eps${eps}_lam${lam}`;
  if (!isBase) await register(variant(KF0, id, { softening: eps, lambdaPN: lam }, (p) => { p.sampleClass = 'principle'; }));
  for (const dt of DTS) {
    const r = (isBase && dt === 0.016) ? r00 : await run(id, dt);
    grid.push(Object.assign({ lambdaPN: lam, eps, epsKm: eps * KM_PER_UNIT }, r));
    log(`grid λ=${lam} ε=${eps} dt=${dt}: ${r.slopeDegA} (n=${r.nPeriA}, ${r.wallSec}s)`);
  }
}
const Q = (lam, eps, dt) => grid.find((g) => g.lambdaPN === lam && g.eps === eps && g.dt === dt).slopeDegA;

// dt 外挿(ε ごと・λ ごと)
const rich = {};
for (const lam of LAMS) for (const eps of EPS) {
  const k = `lam${lam}_eps${eps}`;
  rich[k] = {
    lambdaPN: lam, eps,
    coarse: richardson3(Q(lam, eps, 0.032), Q(lam, eps, 0.016), Q(lam, eps, 0.008)),   // 主(0.032/0.016/0.008)
    fine: richardson3(Q(lam, eps, 0.016), Q(lam, eps, 0.008), Q(lam, eps, 0.004)),     // 検算(0.016/0.008/0.004)
  };
}
// ε 外挿(dt 外挿値に対して)
const epsFit = {};
for (const lam of LAMS) for (const which of ['coarse', 'fine']) {
  const qs = EPS.map((e) => rich[`lam${lam}_eps${e}`][which].qStar);
  epsFit[`lam${lam}_${which}`] = epsExtrap(EPS, qs);
}
// 1PN = λ1 − λ0(同じ ε・同じ dt・同じ窓)
const pnDiff = [];
for (const eps of EPS) for (const dt of DTS) pnDiff.push({ eps, dt, diff: Q(1, eps, dt) - Q(0, eps, dt) });

// ---------------------------------------------------------------- 解析値と観測換算
const ph = KF0.physics, sun = KF0.bodies[0];
const osc = r00.osc0;
const GMsun = ph.G * sun.m;
const pnAn = pn1AnalyticDeg({ GM: GMsun, c: ph.cLight, a: osc.a, e: osc.e });
const pnAnMu = pn1AnalyticDeg({ GM: osc.mu, c: ph.cLight, a: osc.a, e: osc.e });
const softCoef = softeningCoefDeg({ a: osc.a, e: osc.e });
const softAn = Object.fromEntries(EPS.map((e) => [e, softeningAnalyticDeg({ eps: e, a: osc.a, e: osc.e })]));
// 観測側(判定器の 2 行が使っている換算値と、CSV の行)
const P_OBS_DAY = 87.969;                    // 判定器の周期行の観測値(NSSDC)—— ″/世紀 → deg/周 の換算に使っている周期
const cy = (y) => degPerOrbitToArcsecPerCentury(y, P_OBS_DAY);   // deg/周 → ″/世紀(P=87.969 日)
const P_STANDISH_DAY = 87.9692565;           // CSV の JPL SSD 行(L̇ から)
const obsConv = {
  kF0Row: { value: CAL0.obs, source: 'obsCard の obs 欄 "42.98″/世紀"(☄️)', arcsecPerCentury: 42.98 },
  kF1Row: { value: CAL1.obs, source: 'obsCard の obs 欄 "+43″/世紀"(🪨)', arcsecPerCentury: 43 },
  rowsDiffer: CAL0.obs !== CAL1.obs,
  rowsDiffDeg: CAL1.obs - CAL0.obs,
  sigmaGateDeg: CAL0.gate ? CAL0.gate.sigma : null,
  sigmaFrom: 'CSV Mercury|periastron_advance の先頭行(Park 2017 Table 3 の **総量** 575.3100″/世紀・1σ 0.0015″/世紀)',
  parkGR: { arcsecPerCentury: 42.9799, sigma: 0.0009, degPerOrbit_P87969: arcsecPerCenturyToDegPerOrbit(42.9799, P_OBS_DAY),
    sigmaDegPerOrbit: arcsecPerCenturyToDegPerOrbit(0.0009, P_OBS_DAY),
    source: 'CSV Mercury|periastron_advance_gr(Park 2017 Table 3 Gravitoelectric)' },
  parkLT: { arcsecPerCentury: -0.0020, sigma: 0.0002, degPerOrbit_P87969: arcsecPerCenturyToDegPerOrbit(-0.0020, P_OBS_DAY),
    source: 'CSV の note(Park 2017 Table 3 Lense–Thirring —— GR 行には含まれない)' },
  // 判定器は ″/世紀 → deg/周 を**模型の近点間周期**(20 近点窓の perMean)で割り戻している(calaudit の conv)
  judgeConvPeriodDay: { kF0: CAL0.obs * JULIAN_CENTURY_DAYS * 3600 / 42.98, kF1: CAL1.obs * JULIAN_CENTURY_DAYS * 3600 / 43,
    note: '判定器の換算に使われた周期(日)—— 観測の 87.969 日ではなく模型の近点間周期' },
  periodChoice: { P87969: arcsecPerCenturyToDegPerOrbit(42.98, P_OBS_DAY),
    Pstandish: arcsecPerCenturyToDegPerOrbit(42.98, P_STANDISH_DAY),
    Psim: arcsecPerCenturyToDegPerOrbit(42.98, r00.perMeanFitSimA * 1e4 / 86400) },
};
// 入力・換算の内訳(解析 1PN を観測側の定数で作り直す): c の丸め(3×10⁸ vs 299792458)・GM・a・e
const C_TRUE = 299792458, GM_SUN_TRUE = 1.32712440018e20;
const A_TRUE_M = 5.7909050e10, E_TRUE = 0.20563069;   // NSSDC の a(0.387098 AU)と e(CSV の NSSDC 行)
const pnAnTrue = pn1AnalyticDeg({ GM: GM_SUN_TRUE, c: C_TRUE, a: A_TRUE_M, e: E_TRUE });
const inputBreak = {
  pnAnSim: pnAn, pnAnSimWithMu: pnAnMu,
  // 1 つずつ観測側の定数へ置き換える(残りはサンプルの値)
  cTrue: pn1AnalyticDeg({ GM: GMsun, c: C_TRUE / 1e4, a: osc.a, e: osc.e }),
  gmTrue: pn1AnalyticDeg({ GM: GM_SUN_TRUE / 1e16, c: ph.cLight, a: osc.a, e: osc.e }),
  aTrue: pn1AnalyticDeg({ GM: GMsun, c: ph.cLight, a: A_TRUE_M / 1e8, e: osc.e }),
  eTrue: pn1AnalyticDeg({ GM: GMsun, c: ph.cLight, a: osc.a, e: E_TRUE }),
  allTrue: pnAnTrue,
  allTrueArcsecPerCentury: degPerOrbitToArcsecPerCentury(pnAnTrue, P_OBS_DAY),
  simArcsecPerCentury: degPerOrbitToArcsecPerCentury(pnAn, P_OBS_DAY),
  constants: { cSim: ph.cLight * 1e4, cTrue: C_TRUE, GMsim: GMsun * 1e16, GMtrue: GM_SUN_TRUE,
    aSim_m: osc.a * 1e8, aTrue_m: A_TRUE_M, eSim: osc.e, eTrue: E_TRUE },
  note: 'サンプル単位: 1 単位=10⁸ m・10⁴ s → G·M の単位は 10¹⁶ m³/s²(L³/T²)・c の単位は 10⁴ m/s',
};
for (const k of ['cTrue', 'gmTrue', 'aTrue', 'eTrue']) inputBreak[k + 'Delta'] = inputBreak[k] - pnAn;
inputBreak.allTrueDelta = pnAnTrue - pnAn;
inputBreak.obsKF0MinusAllTrue = CAL0.obs - pnAnTrue;

// 不足の分解(主: 0.032/0.016/0.008 の Richardson・ε は 0.02/0.01 の 2 点 ε²)
const decomp = {};
for (const which of ['coarse', 'fine']) {
  const qStarEps = rich['lam1_eps0.05'][which].qStar;
  const q00 = epsFit[`lam1_${which}`].Q0;
  decomp[which] = {
    obsKF0: decompose({ obs: CAL0.obs, qFormal: CAL0.meas, qStarEps, q00, pnAn }),
    obsKF1Row: decompose({ obs: CAL1.obs, qFormal: CAL0.meas, qStarEps, q00, pnAn }),
    qStarEps005: qStarEps, q00,
    arcsecPerCentury: { formal: cy(CAL0.meas), qStarEps005: cy(qStarEps), q00: cy(q00), pnAn: cy(pnAn), obsKF0: cy(CAL0.obs),
      step: cy(qStarEps - CAL0.meas), softening: cy(q00 - qStarEps), inputConversion: cy(CAL0.obs - pnAn) },
  };
}
// ε=0.01 でも残る差(外挿ではない実測の最小 ε・最小 dt)
const atSmallest = {
  eps: 0.01, dt: 0.004, value: Q(1, 0.01, 0.004),
  deficitToObsKF0: CAL0.obs - Q(1, 0.01, 0.004),
  deficitShare: (CAL0.obs - Q(1, 0.01, 0.004)) / (CAL0.obs - CAL0.meas),
  softeningAnalyticAt: softAn[0.01],
  richardsonAtEps001: rich['lam1_eps0.01'].fine.qStar,
  deficitAfterDtExtrapAtEps001: CAL0.obs - rich['lam1_eps0.01'].fine.qStar,
};

// ---------------------------------------------------------------- (2) 1 表(ε=0.05・dt 3 段)
const DT_T = [0.016, 0.008, 0.004];
await register(variant(KF0, 'mercuryDiag_geoToyScalar', { geoPN: 3, spaceMesh: { mode: 'vertex', gravity: false, inertia: false, lawVersion: 'scalar' } },
  (p) => { p.sampleClass = 'principle'; }));
await register(variant(KF0, 'mercuryDiag_vMinusU', { meshVelocity: { law: 'vMinusU', field: 'explicit', mutual: 0,
  frame: { origin: 'body:0', epoch: 'J2000-sample-t0', rotation: 'none', translation: 'none' }, external: ['body:0'] } },
(p) => { p.sampleClass = 'principle'; }));
await register(variant(KF0, 'mercuryDiag_vMinusU_mutual1', { meshVelocity: { law: 'vMinusU', field: 'explicit', mutual: 1,
  frame: { origin: 'body:0', epoch: 'J2000-sample-t0', rotation: 'none', translation: 'none' }, external: ['body:0'] } },
(p) => { p.sampleClass = 'principle'; }));
const table = [];
const COND = [
  { key: 'kF0', id: 'mercuryReal', label: 'kF0(☄️ そのもの・λ_PN=1)' },
  { key: 'kF1', id: 'mercuryRealKF1', label: 'kF1(🪨 そのもの・q=6.1471 qLock・D0pull)' },
  { key: 'geoPN3scalar', id: 'mercuryDiag_geoToyScalar', label: 'geoPN=3 scalar(現行トイ —— _core の geoPN は 0 = 1PN なし)' },
  { key: 'vMinusU', id: 'mercuryDiag_vMinusU', label: 'meshVelocity vMinusU(field:"explicit"・external 太陽・mutual:0・kF0・geoPN=2・λ_PN=1)' },
  { key: 'vMinusU_mutual1', id: 'mercuryDiag_vMinusU_mutual1', label: '同上 mutual:1(2 体で外部=太陽なので局所の源は空)' },
  { key: 'lam0', id: 'mercuryDiag_eps0.05_lam0', label: 'λ_PN=0(1PN を切った対照)' },
];
for (const c of COND) for (const dt of DT_T) {
  const g = (c.key === 'kF0') ? grid.find((x) => x.lambdaPN === 1 && x.eps === 0.05 && x.dt === dt)
    : (c.key === 'lam0') ? grid.find((x) => x.lambdaPN === 0 && x.eps === 0.05 && x.dt === dt)
      : (c.key === 'kF1' && dt === 0.016) ? r01 : await run(c.id, dt);
  table.push(Object.assign({ cond: c.key, label: c.label }, g));
  log(`table ${c.key} dt=${dt}: ${g.slopeDegA}`);
}
const T = (k, dt) => table.find((x) => x.cond === k && x.dt === dt);
const tableDiff = DT_T.map((dt) => ({ dt,
  kF1_minus_kF0: T('kF1', dt).slopeDegA - T('kF0', dt).slopeDegA,
  vMinusU_minus_kF0: T('vMinusU', dt).slopeDegA - T('kF0', dt).slopeDegA,
  vMinusU_bitIdenticalToKF0: T('vMinusU', dt).slopeDegA === T('kF0', dt).slopeDegA,
  vMinusU_mutual1_minus_kF0: T('vMinusU_mutual1', dt).slopeDegA - T('kF0', dt).slopeDegA,
  geoPN3_minus_kF0: T('geoPN3scalar', dt).slopeDegA - T('kF0', dt).slopeDegA,
  geoPN3_minus_lam0: T('geoPN3scalar', dt).slopeDegA - T('lam0', dt).slopeDegA,
  lam0_minus_kF0: T('lam0', dt).slopeDegA - T('kF0', dt).slopeDegA }));

// ---------------------------------------------------------------- (3) 精度目標(🪨 − ☄️)
const aim = [];
for (const eps of [0.02, 0.01]) {
  const id = `mercuryDiag_kf1_eps${eps}`;
  await register(variant(KF1, id, { softening: eps }, (p) => { p.sampleClass = 'principle'; }));
  for (const dt of [0.016, 0.008]) {
    const r = await run(id, dt);
    aim.push({ eps, dt, kF1: r.slopeDegA, kF0: Q(1, eps, dt), diff: r.slopeDegA - Q(1, eps, dt), qApplied: r.state.q });
    log(`aim ε=${eps} dt=${dt}: diff ${r.slopeDegA - Q(1, eps, dt)}`);
  }
}
for (const dt of DT_T) aim.push({ eps: 0.05, dt, kF1: T('kF1', dt).slopeDegA, kF0: T('kF0', dt).slopeDegA,
  diff: T('kF1', dt).slopeDegA - T('kF0', dt).slopeDegA, qApplied: T('kF1', dt).state.q });
await register(variant(KF1, 'mercuryDiag_kf1_sunSpin0', {}, (p) => { p.sampleClass = 'principle'; p.bodies[0].spin = 0; }));
const spin0 = await run('mercuryDiag_kf1_sunSpin0', 0.016);
const aimSpin0 = { dt: 0.016, eps: 0.05, kF1spin0: spin0.slopeDegA, kF0: T('kF0', 0.016).slopeDegA,
  diff: spin0.slopeDegA - T('kF0', 0.016).slopeDegA, bitIdentical: spin0.slopeDegA === T('kF0', 0.016).slopeDegA };
const declaredDragRad = -4.98e-10;   // 🪨 の obsCard が宣言する kF1−kF0(rad/公転・RL 勾配・600 公転)

// ---------------------------------------------------------------- (i) 測定演算子の違い
//   判定器(近点通過・59 近点・☄️ そのもの)と、☄️ の failureFirst・claims が引く「43.0″/世紀」
//   (tests/exp-obscal.mjs §D の水星不変量ラダー —— 別の系で λ_PN=1 と 0 の RL 勾配の差を取る)を並べる。
const OBSCAL = 'tests/out/obscal-results.json';
let obscal = null;
try { obscal = JSON.parse(fs.readFileSync(path.join(ROOT, OBSCAL), 'utf8')); } catch { obscal = null; }
const lad = obscal && obscal.tests && obscal.tests.mercuryReal ? obscal.tests.mercuryReal : null;
const ladFin = lad ? lad.ladder[lad.ladder.length - 1] : null;
const solarRealC = obscal && obscal.profiles ? obscal.profiles.solarRealC : null;
const operator = {
  formal: { estimator: 'periapsis-crossing(検出器 A)', window: '59 近点(60 公転ぶんの步数)', system: '☄️ そのもの(a=579.09・ε=0.05・dt=0.016)',
    subtraction: 'なし(1PN + 軟化 + 刻みの総量)', degPerOrbit: CAL0.meas, arcsecPerCentury: cy(CAL0.meas) },
  lambdaDiffFormalCell: { estimator: 'periapsis-crossing(検出器 A)の λ_PN=1 − λ_PN=0', window: '59 近点', system: '☄️ そのもの(ε=0.05・dt=0.016)',
    degPerOrbit: Q(1, 0.05, 0.016) - Q(0, 0.05, 0.016), arcsecPerCentury: cy(Q(1, 0.05, 0.016) - Q(0, 0.05, 0.016)),
    ratioToAnalytic: (Q(1, 0.05, 0.016) - Q(0, 0.05, 0.016)) / pnAn },
  obscalD: ladFin ? { estimator: 'RL-gradient(Runge–Lenz 角の周回ボックスカー平均の最小二乗勾配)の λ_PN=1 − λ_PN=0',
    window: ladFin.orbits + ' 公転', dt: ladFin.dt,
    system: 'a=150・e=0.206・M=' + ladFin.M.toFixed(4) + '(GM/(c²a)=' + ladFin.depth + ' を合わせた別の系)・ε='
      + (solarRealC ? solarRealC.physics.softening : '?') + '・kFrame=' + (solarRealC ? solarRealC.physics.kFrame : '?') + '(自転 0)',
    pn1RadPerOrbit: ladFin.pn1Measured, theoRadPerOrbit: ladFin.theo, ratio: ladFin.ratio, lam0RadPerOrbit: ladFin.lam0,
    arcsecPerCentury: lad.arcsecPerCentury, orbitsPerCentury: 414.93,
    orbitsPerCenturyNote: '§D は 414.93 公転/世紀で換算している(36525/87.969 = ' + (JULIAN_CENTURY_DAYS / P_OBS_DAY).toFixed(4) + ' ではない)',
    source: OBSCAL + '(' + (obscal.date || '') + ')' } : null,
};

// ---------------------------------------------------------------- 出力
const out = {
  meta: Object.assign(provenanceMeta({ root: ROOT, wave: '第280便a', target: TARGET,
    code: ['tests/exp-w280a-mercury.mjs', 'tests/lib-w280a-mercury.mjs', 'tests/lib-w279b-headless.mjs',
      'tests/lib-w270a-stoprule.mjs', 'tests/lib-w272e-provenance.mjs', CALAUDIT],
    inputs: [TARGET, CANON_CAL, OBSCAL] }), {
    version: MERCURY_W280A_VERSION,
    extractor: { from: CALAUDIT, helperSha256: helperSha, periWindow: PERI_WINDOW, orbMax: ORB_MAX, dtBase: DT0,
      detector: 'A(ṙ の −→+ 交差 = 相対距離の極小)・近点位相の直線 fit(判定器の q.meas と同じ)',
      stopRuleVersion: STOP_RULE_VERSION },
    engine: ENGINE === 'node' ? 'Node の vm(tests/lib-w279b-headless.mjs)で対象 html の inline script をそのまま評価' : 'Chromium(判定器と同じ —— ページで対象 html を読む)',
    declarations: ['(M1) 較正 2 本の物理・入力・claims は不変 —— 診断コピーは器の中だけ',
      '(M2) q は触らない', '(M3) 窓は判定器の正式窓(近点 59 本)',
      '(M4) dt→0・ε→0 の外挿値は外挿であって、そこで走らせた値ではない'],
    units: { length: '1 単位 = 10⁸ m = 10⁵ km', time: '1 単位 = 10⁴ s', precession: 'deg/周(近点番号に対する傾き)' },
    wallSec: (Date.now() - t0) / 1000,
    doNotWrite: ['精度を上げれば成立する', '43″ を再現した', '観測一致を達成した', '較正した'],
  }),
  reproduction: repro,
  grid,
  richardson: rich,
  epsExtrap: epsFit,
  pnDiff,
  analytic: { pn1: pnAn, pn1WithMu: pnAnMu, softeningCoef: softCoef, softening: softAn,
    orbit: { a: osc.a, e: osc.e, Psim: osc.P, GM: GMsun } },
  observed: obsConv,
  inputBreak,
  operator,
  decomposition: decomp,
  atSmallest,
  table: { conds: COND, rows: table, diff: tableDiff },
  aim: { rows: aim, sunSpin0: aimSpin0, declaredDragRadPerOrbit: declaredDragRad,
    declaredDragDegPerOrbit: declaredDragRad * 180 / Math.PI,
    dragArcsecPerCentury: degPerOrbitToArcsecPerCentury(T('kF1', 0.016).slopeDegA - T('kF0', 0.016).slopeDegA, P_OBS_DAY) },
};
fs.mkdirSync(path.dirname(OUT), { recursive: true });
Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));   // 第281便a: 領域 hash の 3 欄 + JSON 入力の安定 hash
fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
log('書いた', path.relative(ROOT, OUT), (Date.now() - t0) / 1000, 's');
if (browser) await browser.close();
