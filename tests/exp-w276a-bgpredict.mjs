// 第276便a(原仮定者の裁定〔第66報〕(1))— **背景(D₀ と背景複素決定力)の事前予測表**。
//
// ■ 裁定の字義
//   「両者は**サンプルによって変動するが、シチュエーションで決まるので事前予測が可能**。」
//   規則(第65報 (2) からそのまま引き継ぐ):
//     ・太陽を天体として**置く**サンプル … 太陽は背景に含めない
//     ・太陽を**置かない**サンプル      … 太陽からの距離で決まる
//     ・太陽系外のサンプル              … 銀河内位置
//     ・銀河サンプル                    … 銀河自身を含めない
//
// ■ 本器が出すもの(**宣言した質量分布からの計算**であって、特定時刻の環境値ではない)
//   シチュエーションごとに **D₀([M/L])・W₀([M/L²])・|A₀|([M/(L·T)])・|∇W₀|・|∇A₀|・|∂ₜW₀|・|∂ₜA₀|** を
//   出し、**内蔵 37 本の較正サンプルの単位系(scaleExp)へ落とした値**を並べる。
//   ・**u_bg = |A₀|/W₀** は「背景が基準点から見てどれだけ動いているか」で、
//     **エンジンの既定は u_bg=0(静止ゼロ)である** —— その差を数で出す(統括の読み R40)。
//   ・**一様近似の誤差**: 背景を「サンプル内で一様」と扱ったときの相対誤差 ≈ p·Δ/r
//     (Δ はサンプルの広がり・r は背景源までの距離)。
//   ・規則が値を決めない欄は **`undetermined`** のまま残す(**推定で埋めない**)。
//
// ■ 仮定(**すべて出典つきで JSON に並べる**。観測入力ではない)
//   第275便b の `tests/lib-w275b-dsplit.mjs` の ASSUMPTIONS をそのまま使い、
//   本器で足すのは **G の SI 値**(CODATA 2018)だけである。速度・加速度は
//   **円軌道近似 v=√(GM/r)・a=GM/r²** で**同じ仮定から導く**(新しい観測値を持ち込まない)。
//
// ■ しないこと
//   ・内蔵の D₀・D0pull の値を 1 本も変えない(本器はページを読むだけ)。
//   ・「この値が正しい背景である」「背景を較正した」とは書かない。
//   ・カロンの残差に合わせて背景を選ばない(**合わせて選んだ背景は「事前予測」ではない**)。
//
// 実行:
//   PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright node tests/exp-w276a-bgpredict.mjs
// 出力: tests/out/bgpredict-w276a.json(CANON・来歴は lib-w272e-provenance の形)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { ASSUMPTIONS, assumptionRows, DSPLIT_VERSION } from './lib-w275b-dsplit.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const OUT = path.join(ROOT, 'tests', 'out', 'bgpredict-w276a.json');
const HARNESS_VERSION = 'w276a-bgpredict-1';

// ---------------------------------------------------------------- 本器で足す仮定
const EXTRA = {
  gravitationalConstantSI: { value: 6.67430e-11, from: 'CODATA 2018 の G(m³ kg⁻¹ s⁻²)',
    kind: 'defined-reference',
    note: '速度 v=√(GM/r) と加速度 a=GM/r² を**同じ仮定から**導くためだけに使う' },
  sunMassIauNominal: { value: 1.98847e30, from: 'IAU 2015 B3 の公称太陽質量パラメータから換算',
    kind: 'reference-value',
    note: '**本器が使うのはアプリ自身の転写値 1.9885×10³⁰ kg**(第275便b と同じ) —— 比は JSON の `sunMassRatio`' },
};

// ---------------------------------------------------------------- 所在の宣言(第275便b の表を引き継ぐ)
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
// 太陽を置かない太陽系サンプルの「太陽からの距離」(軌道長半径 —— 第275便b と同じ仮定)
const HELIO_BODY = {
  earthMoonReal: 'earth', earthMoonRealKF1: 'earth', emAuditDFM: 'earth',
  jupiterGalilean: 'jupiter', marsMoonsReal: 'mars', plutoCharonReal: 'pluto',
  uranusReal: 'uranus', neptuneReal: 'neptune',
  saturnZonalD68: 'saturn', saturnRingReal: 'saturn', saturnRingRealKF1: 'saturn',
};

const Msun = ASSUMPTIONS.sunMassKg.value;
const AU = ASSUMPTIONS.auMeters.value;
const PC = ASSUMPTIONS.parsecMeters.value;
const R0 = ASSUMPTIONS.galacticR0Kpc.value * 1e3 * PC;
const Mgal = ASSUMPTIONS.galacticMassEnclosedMsun.value * Msun;
const G_SI = EXTRA.gravitationalConstantSI.value;

/** 1 つの点源(質量 M・距離 r・相対速度 v・相対加速度 a)が作る背景の 7 量(SI)。 */
function backgroundOfPointSource(M, r, opts) {
  const o = opts || {};
  const p = (o.p === undefined) ? 2 : o.p;
  if (!(M > 0) || !(r > 0)) return null;
  const v = (o.v === undefined) ? Math.sqrt(G_SI * M / r) : o.v;      // 円軌道近似
  const a = (o.a === undefined) ? (G_SI * M / (r * r)) : o.a;
  const W0 = M / Math.pow(r, p);                                      // [M/L^p]
  const A0 = W0 * v;                                                  // [M/(L^(p−1)·T)]
  const gradW = p * W0 / r;                                           // |∇W₀| = p·W₀/r
  const gradA = p * A0 / r;                                           // |∇A₀| ≈ p·A₀/r
  const dWdt = gradW * v;                                             // |∂ₜW|_x| = |∇W·v|
  const dAdt = W0 * a + dWdt * v;                                     // |∂ₜA| ≲ W₀·a + |∂ₜW|·v
  return { p, M, r, v, a, W0, A0, gradW, gradA, dWdt, dAdt, uBg: v,
    D0: M / r, formula: 'W₀=M/r^p ・ A₀=W₀·v ・ |∇W₀|=p·W₀/r ・ |∂ₜW₀|=|∇W₀|·v' };
}

/** サンプルの単位系(scaleExp)へ落とす。量は M^1 L^(−a) T^(−b)。 */
function toUnits(si, scaleExp, a, b) {
  if (!scaleExp || si === null || si === undefined) return null;
  const M = Number(scaleExp.M), L = Number(scaleExp.L), T = Number(scaleExp.T);
  if (![M, L, T].every(Number.isFinite)) return null;
  return si / Math.pow(10, M - a * L - b * T);
}
const UNIT_DIMS = { D0: [1, 0], W0: [2, 0], A0: [1, 1], gradW: [3, 0], gradA: [2, 1],
  dWdt: [2, 1], dAdt: [1, 2] };
function allToUnits(bg, scaleExp) {
  if (!bg || !scaleExp) return null;
  const o = {};
  for (const [k, [a, b]] of Object.entries(UNIT_DIMS)) o[k] = toUnits(bg[k], scaleExp, a, b);
  return o;
}

// ================================================================ ページ(宣言を読むだけ)
const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let browser;
try { browser = await req('playwright').chromium.launch(); }
catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }
const pageErrors = [];
const page = await browser.newPage();
page.on('pageerror', (e) => pageErrors.push(String(e)));
await page.goto('file://' + path.join(ROOT, TARGET), { waitUntil: 'load' });
await page.waitForFunction(() => window.HP && HP.sim);

const declared = await page.evaluate(() => {
  const out = [];
  for (const src of HP.allPresets()) {
    if (src.sampleClass !== 'calibration'
      && ['galaxyMeshSpiralGeoToy', 'galaxyMeshSpiralGeoToyLite'].indexOf(src.id) < 0) continue;
    const v = HP.validatePreset(JSON.parse(JSON.stringify(src)));
    if (!v.ok) { out.push({ id: src.id, error: v.errors }); continue; }
    const ph = v.preset.physics;
    const bodies = (v.preset.bodies || []).map((b) => ({ m: b.m, x: b.x, y: b.y }));
    out.push({ id: src.id, emoji: src.emoji, name: src.name, group: src.group,
      scaleExp: src.scaleExp || null, D0: ph.D0,
      D0pull: ph.D0pull === undefined ? null : ph.D0pull,
      frameWeight: ph.frameWeight === undefined ? null : ph.frameWeight,
      framePow: HP.frameWeightPow ? HP.frameWeightPow(ph) : null,
      G: ph.G, kFrame: ph.kFrame, softening: ph.softening,
      backgroundComplex: ph.backgroundComplex === undefined ? null : ph.backgroundComplex,
      D0Source: ph.D0Source === undefined ? null : ph.D0Source,
      bodies, nBodies: bodies.length });
  }
  return out;
});
await browser.close();

// ================================================================ ① シチュエーション表
const situations = [];
const addSituation = (o) => situations.push(o);
// (S1) 太陽系・太陽を置かない(背景 = 太陽 + 銀河)
for (const [id, planet] of Object.entries(HELIO_BODY)) {
  const r = ASSUMPTIONS.semiMajorAxisAu.value[planet] * AU;
  addSituation({ key: 'heliocentric:' + planet, rule: 'heliocentric', sample: id, planet,
    placesSun: false, distanceM: r,
    bgSun: { p1: backgroundOfPointSource(Msun, r, { p: 1 }), p2: backgroundOfPointSource(Msun, r, { p: 2 }) },
    bgGalaxy: { p1: backgroundOfPointSource(Mgal, R0, { p: 1 }), p2: backgroundOfPointSource(Mgal, R0, { p: 2 }) },
    note: '太陽を天体として置いていないサンプル —— 背景は**太陽からの距離**で決まる(銀河は別欄)' });
}
// (S2) 太陽系・太陽を置く(背景 = 太陽を含めない。残りは規則が決めていない)
addSituation({ key: 'solar-excluded', rule: 'solar-excluded', sample: '(太陽を置く 5 本)',
  placesSun: true, distanceM: null,
  candidates: { zero: { p1: 0, p2: 0 },
    galactic: { p1: backgroundOfPointSource(Mgal, R0, { p: 1 }), p2: backgroundOfPointSource(Mgal, R0, { p: 2 }) } },
  undetermined: '規則は「太陽を含めない」としか言っていない —— 残り(銀河の寄与)を足すかは決断事項' });
// (S3) 太陽系外(銀河内位置)。**銀河中心までの距離は R₀ と仮定する**(サンプルが宣言していない)
addSituation({ key: 'galactic', rule: 'galactic', sample: '(系外連星 18 本)',
  placesSun: false, distanceM: R0,
  bgGalaxy: { p1: backgroundOfPointSource(Mgal, R0, { p: 1 }), p2: backgroundOfPointSource(Mgal, R0, { p: 2 }) },
  assumption: '銀河中心までの距離を **R₀ = 8.178 kpc と仮定**した(各サンプルは銀河内位置を宣言していない)',
  approximation: '**M_enc(R₀) を 1 点に集めた近似**であって、外側の殻の寄与を含まない'
    + '(球対称なら外側の一様殻は ∇Φ に寄与しないが、**決定力の総和 D には寄与する**)' });
// (S4) 孤立銀河(自身を含めない)
addSituation({ key: 'isolated-galaxy', rule: 'galaxy-excludes-itself', sample: '🪁🎋',
  placesSun: false, distanceM: null,
  undetermined: '銀河は自身を含めない —— 外に何を置くかはサンプルが宣言していない'
    + '(**ゼロと宣言**するか**未確定**とするかは決断事項)。'
    + 'さらに 🪁🎋 は `scaleExp` を持たないので SI 換算の対象が無い(第275便b ④)' });
// (S5) 系外(ホスト銀河が宣言されていない)
addSituation({ key: 'extragalactic', rule: null, sample: '🎐🎻⏰',
  placesSun: false, distanceM: null,
  undetermined: 'ホスト銀河の質量分布が宣言されていないので背景が作れない(第275便b ⑧-3 と同じ)' });

// ================================================================ ② 内蔵 37 本 + 🪁🎋 の単位系へ落とす
const rows = [];
for (const d of declared) {
  if (d.error) { rows.push({ id: d.id, error: d.error }); continue; }
  const site = SITE[d.id] || null;
  const pw = d.framePow === null ? 2 : d.framePow;
  const mUnit = d.scaleExp ? Math.pow(10, Number(d.scaleExp.M)) : null;
  const placesSun = d.bodies.some((b) => mUnit !== null && Number.isFinite(Number(b.m))
    && Math.abs(Number(b.m) * mUnit / Msun - 1) < 1e-3);
  let rule = null, why = null, r = null, planet = null, Msrc = null;
  if (site === 'solar-system') {
    if (placesSun) { rule = 'solar-excluded'; why = '太陽を天体として置いている(背景に含めない)'; }
    else {
      rule = 'heliocentric'; planet = HELIO_BODY[d.id] || null;
      if (planet) { r = ASSUMPTIONS.semiMajorAxisAu.value[planet] * AU; Msrc = Msun; }
      else why = '太陽からの距離が宣言されていない';
    }
  } else if (site === 'galactic') { rule = 'galactic'; r = R0; Msrc = Mgal; }
  else if (site === 'extragalactic') why = 'ホスト銀河の質量分布が宣言されていない';
  else if (site === 'toy') why = 'トイ(実在の背景が無い・scaleExp も宣言していない)';
  else why = '所在が宣言されていない';

  // **D₀ は定義上 p=1([M/L])・背景複素決定力は定義上 p=2([M/L²])** —— サンプルの
  // `frameWeight` が何であっても、この 2 つは**別の量**である(第275便b ①・統括の読み R40)。
  // `framePow` は「**エンジンが今どちらの数を χ の分母へ入れているか**」にだけ効く。
  const bg1 = (Msrc && r) ? backgroundOfPointSource(Msrc, r, { p: 1 }) : null;
  const bg2 = (Msrc && r) ? backgroundOfPointSource(Msrc, r, { p: 2 }) : null;
  const bg = (bg1 && bg2) ? { pD0: 1, pComplex: 2, pEngineReads: pw, M: bg2.M, r: bg2.r,
    v: bg2.v, a: bg2.a, uBg: bg2.uBg, D0: bg1.D0, W0: bg2.W0, A0: bg2.A0,
    gradW: bg2.gradW, gradA: bg2.gradA, dWdt: bg2.dWdt, dAdt: bg2.dAdt,
    D0gradSI: bg1.gradW, formula: bg2.formula } : null;
  const bgUnits = bg ? allToUnits(bg, d.scaleExp) : null;
  // **エンジンが実際に χ の分母へ入れる数**(`dfmGeoToyStep` の D0p と同じ読み方)
  const d0Used = (pw >= 2 && d.D0pull !== null) ? d.D0pull : d.D0;
  const d0UsedKey = (pw >= 2 && d.D0pull !== null) ? 'physics.D0pull' : 'physics.D0';
  // サンプルの広がり Δ(天体間の最大距離)と一様近似の相対誤差 p·Δ/r
  let spread = null;
  for (let i = 0; i < d.bodies.length; i++) {
    for (let j = i + 1; j < d.bodies.length; j++) {
      const dd = Math.hypot(Number(d.bodies[i].x) - Number(d.bodies[j].x),
        Number(d.bodies[i].y) - Number(d.bodies[j].y));
      if (Number.isFinite(dd) && (spread === null || dd > spread)) spread = dd;
    }
  }
  const lUnit = d.scaleExp ? Math.pow(10, Number(d.scaleExp.L)) : null;
  const spreadM = (spread !== null && lUnit !== null) ? spread * lUnit : null;
  const uniformErr = (spreadM !== null && r) ? 2 * spreadM / r : null;       // 複素場(p=2)
  const uniformErrD0 = (spreadM !== null && r) ? 1 * spreadM / r : null;     // スカラー D₀(p=1)
  // **G の SI 値をサンプルの宣言から逆算**(アプリ自身の転写値との突き合わせ)
  const gSiFromPreset = d.scaleExp
    ? d.G * Math.pow(10, 3 * Number(d.scaleExp.L) - Number(d.scaleExp.M) - 2 * Number(d.scaleExp.T))
    : null;
  rows.push({ id: d.id, emoji: d.emoji, group: d.group, site, rule, ruleWhy: why,
    scaleExp: d.scaleExp, frameWeight: d.frameWeight, framePow: pw, placesSun,
    D0: d.D0, D0pull: d.D0pull, d0Used, d0UsedKey,
    backgroundComplexDeclared: d.backgroundComplex, D0SourceDeclared: d.D0Source,
    heliocentricBody: planet, distanceM: r,
    predictedSI: bg, predictedUnits: bgUnits,
    // 宣言値との比(**規則値が正しいという主張ではない**)
    ratioD0: (bg && bgUnits && bgUnits.D0) ? d0Used / (pw >= 2 ? bgUnits.W0 : bgUnits.D0) : null,
    ruleValueInUnits: bgUnits ? (pw >= 2 ? bgUnits.W0 : bgUnits.D0) : null,
    spreadUnits: spread, spreadM, uniformApproxRelError: uniformErr,
    uniformApproxRelErrorD0: uniformErrD0,
    gSiFromPreset, gSiRatio: gSiFromPreset ? gSiFromPreset / G_SI : null });
}

const withPrediction = rows.filter((r) => r.predictedSI);
const summary = {
  rows: rows.length,
  byRule: rows.reduce((o, r) => { const k = r.rule || 'undetermined'; o[k] = (o[k] || 0) + 1; return o; }, {}),
  byFramePow: rows.reduce((o, r) => { const k = 'p' + r.framePow; o[k] = (o[k] || 0) + 1; return o; }, {}),
  predicted: withPrediction.length,
  declaredBackgroundComplex: rows.filter((r) => r.backgroundComplexDeclared).map((r) => r.id),
  declaredD0Source: rows.filter((r) => r.D0SourceDeclared).map((r) => r.id),
  uniformApproxRange: (() => {
    const v = withPrediction.map((r) => r.uniformApproxRelError).filter(Number.isFinite);
    return v.length ? { n: v.length, min: Math.min(...v), max: Math.max(...v) } : { n: 0 };
  })(),
  gSiRatioRange: (() => {
    const v = rows.map((r) => r.gSiRatio).filter(Number.isFinite);
    return v.length ? { n: v.length, min: Math.min(...v), max: Math.max(...v) } : { n: 0 };
  })(),
};
// **エンジンの既定は u_bg=0** —— 予測した u_bg との差(統括の読み R40)
const uBgVsEngineZero = withPrediction.map((r) => ({ id: r.id, emoji: r.emoji,
  uBgSI: r.predictedSI.uBg, uBgUnits: (r.predictedUnits && r.scaleExp)
    ? r.predictedSI.uBg / Math.pow(10, Number(r.scaleExp.L) - Number(r.scaleExp.T)) : null,
  engineDefault: 0 }));

// ---------------------------------------------------------------- 書き出し
const CODE = ['tests/exp-w276a-bgpredict.mjs', 'tests/lib-w275b-dsplit.mjs',
  'tests/lib-w272e-provenance.mjs'];
const out = {
  meta: Object.assign(provenanceMeta({ root: ROOT, wave: '第276便a', target: TARGET,
    code: CODE, inputs: [TARGET] }), {
    harness: 'tests/exp-w276a-bgpredict.mjs', harnessVersion: HARNESS_VERSION,
    dsplitVersion: DSPLIT_VERSION,
    ruling: '第66報 (1): 両者はサンプルによって変動するが**シチュエーションで決まるので事前予測が可能**',
    rules: ['太陽を置くサンプル → 太陽を背景に含めない(残りは規則が決めていない)',
      '太陽を置かないサンプル → 太陽からの距離',
      '太陽系外 → 銀河内位置', '銀河 → 自身を含めない'],
    definition: 'D₀ = M/r^1 [M/L] ・ W₀ = M/r^p [M/L^p] ・ A₀ = W₀·v [M/(L^(p−1)·T)] ・ '
      + '|∇W₀| = p·W₀/r ・ |∂ₜW₀| = |∇W₀·v| ・ |∂ₜA₀| ≲ W₀·a + |∂ₜW₀|·v',
    unitDims: UNIT_DIMS,
    assumptions: assumptionRows().concat(Object.entries(EXTRA).map(([k, v]) => ({ key: k,
      value: v.value, from: v.from, kind: v.kind, note: v.note === undefined ? null : v.note }))),
    sunMassRatio: EXTRA.sunMassIauNominal.value / Msun,
    caveat: '**これは概算条件からの計算であって、特定時刻の環境値ではない**。'
      + '速度・加速度は円軌道近似 v=√(GM/r)・a=GM/r² で同じ仮定から導いた。'
      + '**カロンの残差に合わせて選んだ背景は「事前予測」と呼ばない。**',
    notClaim: ['背景を較正した', 'この値が正しい背景である', '❄️ が成立した',
      '背景複素決定力を接続した', '新発見'] }),
  situations, rows, summary, uBgVsEngineZero, pageErrors,
};
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log('wrote ' + OUT + ' (' + rows.length + ' rows / ' + withPrediction.length + ' predicted)');
console.log('byRule=' + JSON.stringify(summary.byRule));
const pl = rows.find((r) => r.id === 'plutoCharonReal');
if (pl && pl.predictedSI) {
  console.log('❄️ D₀(SI)=' + pl.predictedSI.D0.toExponential(4)
    + ' W₀(SI)=' + pl.predictedSI.W0.toExponential(4)
    + ' A₀(SI)=' + pl.predictedSI.A0.toExponential(4)
    + ' u_bg=' + pl.predictedSI.uBg.toFixed(1) + ' m/s'
    + ' uniformErr=' + pl.uniformApproxRelError.toExponential(3));
}
