// 第282便a(原仮定者の裁定(第72報)②③⑤⑥・統括の検証項目 R77/R78): **較正契約の 3 系統の棚卸し**と **f=1 の棚卸し**の器。
//
// ■ 何をするか(**判定を 1 つも変えない** —— 数えるだけ)
//   ① 内蔵 140 本を {系統(kf0 / dfm / compare / analogy / outside)・対象(太陽系/恒星連星/NS 連星/BH 連星)・f(基準質量との
//      数値比較)・kFrame・geoPN・frameWeight・旧母集団 37 か・sampleClass・観測量(門の状態)・旧 4 値の区分} で棚卸しする。
//      系統の語彙と既定設定は html の side table `CAL_CONTRACT`(1 行の JSON)を読む(ここで語彙を作らない)。
//   ② `sampleClass:"calibration"` の**文字列の出現数**(html 全体の grep)と**プリセットの本数**・旧母集団 37 の差を、
//      出現した行ごとに理由つきで列挙する(プリセットの宣言か・検証器のコメント/文言か)。
//   ③ 旧 4 値 0/2/2/33 は「旧契約(第281便まで)の履歴」欄に保存し、新集計は系統ごとに**母集団・法則版・観測量**を明記して
//      別欄に数える(DFM 版を外して合率が上がったように見せない —— 旧 4 値の区分を系統別に並べるだけ)。
//   ④ **fLedger**: `massCalibration` の f≠1 の本・基準質量との比が 1 でない本(Merge4s のように台帳が無くても検出する)・
//      本便で f=1 へ移した本について {現 f(宣言)・基準質量と現 m の比(実質の f)・基準の出所・隠れコア((f−1)/f 由来か
//      物理コアか)・λ_PN・CF の f 依存・減光相殺・移行段} を出す。**基準質量が無い本は「出典不明」**と書く(推定で埋めない)。
//   ⑤ `tests/out/calcontract-w282a.json` を書く(docs/PHYSICS.md〔第282便a〕の表と QA `docs.calContract` がこれを読む)。
//
// ■ この器がしないこと
//   ・判定を変えない・許容幅を当てない(DFM 版の許容幅は未裁定 —— 残差を併記するだけ)。
//   ・「f=1 で合った」「kF0 版が成立した」「較正を完了した」とは書かない。
//
// 実行: PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright node tests/exp-w282a-calcontract.mjs
//   (**calaudit の後に走らせる** —— 旧 4 値の区分・門の状態・残差を正本 calaudit-w249.json から読む)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { provenanceMetaScoped } from './lib-w281a-scope.mjs';

const REGEN_SCOPE = {"presets":"all","roots":["$","CAL_CONTRACT","HP.allPresets","HP.currentPreset","HP.sim","HP.validatePreset","MASS_BASIS","applyQLock","ch","ctx","isNum","validatePreset"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = 'beta/index.html';
const HTML = path.join(ROOT, TARGET);
const OUT = path.join(ROOT, 'tests', 'out', 'calcontract-w282a.json');
const CODE = ['tests/exp-w282a-calcontract.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
const INPUTS = [TARGET, 'tests/out/calaudit-w249.json'];
export const CONTRACT_TABLE_VERSION = 'w282a-1';
export const DO_NOT_WRITE = ['f=1 で合った', 'kF0 版が成立した', '較正を完了した', '観測一致を達成した',
  '精度を上げれば成立する', 'DFM 版を外して合率が上がった', '判定が増えた'];

// ---------------------------------------------------------------- 宣言(id の規約ではなく宣言)
/** 基準質量を持たない本の**観測版の対**(比較の基準)。**宣言**であって id からの推測ではない。 */
export const TWIN = {
  alphaCenABDFM: 'alphaCenAB', siriusABDFM: 'siriusAB',
  psrDoubleABDFM: 'psrDoubleAB', psrDoubleABSpinCal: 'psrDoubleAB', psrDoubleABPN: 'psrDoubleAB', psrDoubleABCF: 'psrDoubleAB',
  psrB1534DFM: 'psrB1534', psrB1534CF: 'psrB1534',
  gw150914DFM: 'gw150914', gw150914Merge4s: 'gw150914', gw150914SpinDipole: 'gw150914',
  earthMoonRealKF1: 'earthMoonReal', mercuryRealKF1: 'mercuryReal', saturnRingRealKF1: 'saturnRingReal',
  supernovaProgDFM: 'supernovaProg', tuc47DFM: 'tuc47', ngc3198DFM: 'ngc3198',
};
/** 移行段(R78 —— 本便で物理を変えるのは恒星連星 2 本だけ)。 */
function stageOf(id, fam) {
  if (id === 'alphaCenABDFM' || id === 'siriusABDFM') return { key: 'w282a', text: '第282便a(本便)で f=1 へ移した(m=基準質量・初速は入力軌道のまま)' };
  if (/^psr/.test(id)) return { key: 'next-ns', text: '第283便以降(NS 連星 —— 移行計画のみ。λ_PN=1/f・CF の閉形式・隠れコア (f−1)/f が f に絡む)' };
  if (/^gw150914/.test(id)) return { key: 'next-bh', text: '第283便以降(BH 連星 —— 移行計画のみ。Merge4s は台帳が無く実質 2 倍)' };
  if (id === 'tuc47DFM' || id === 'ngc3198DFM') return { key: 'analogy', text: 'アナロジーの系統(🛞 の f=1 台帳は別の枝・🫐 は後続)' };
  if (fam === 'transfer') return { key: 'toy', text: '転用トイ(宣言質量の決め方は決断事項 —— 本便は棚卸しだけ)' };
  return { key: 'none', text: '—' };
}

// ---------------------------------------------------------------- html の宣言(1 行の JSON)
const htmlText = fs.readFileSync(HTML, 'utf8');
const cm = htmlText.match(/^const CAL_CONTRACT=(\{.*\});$/m);
if (!cm) throw new Error('html に CAL_CONTRACT(1 行の JSON)が無い');
const CONTRACT = JSON.parse(cm[1]);
// sampleClass:"calibration" の出現(行ごと)
const calLines = [];
htmlText.split('\n').forEach((l, i) => { if (l.indexOf('sampleClass:"calibration"') >= 0) calLines.push({ line: i + 1, text: l.trim().slice(0, 140) }); });

// ---------------------------------------------------------------- ページから宣言を読む
const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let browser;
try { browser = await req('playwright').chromium.launch(); }
catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }
const page = await browser.newPage();
const pageErrors = [];
page.on('pageerror', (e) => pageErrors.push(String(e.message || e)));
await page.goto('file://' + HTML, { waitUntil: 'load' });
await page.waitForFunction(() => window.HP && HP.sim && HP.currentPreset());
const P = await page.evaluate(() => {
  const MB = (typeof MASS_BASIS === 'object' && MASS_BASIS) ? MASS_BASIS : {};
  return HP.allPresets().filter((p) => !String(p.id).startsWith('custom_')).map((p) => {
    const ph = p.physics || {};
    return { id: p.id, emoji: p.emoji || null, name: p.name || null, sampleClass: p.sampleClass || null,
      group: p.group || null, scaleTier: p.scaleTier || null, familyId: p.familyId || null,
      kFrame: ph.kFrame === undefined ? null : Number(ph.kFrame), geoPN: ph.geoPN === undefined ? null : Number(ph.geoPN),
      frameWeight: ph.frameWeight === undefined ? 'pull' : ph.frameWeight,
      lambdaPN: ph.lambdaPN === undefined ? 1 : Number(ph.lambdaPN),
      compactForce: ph.compactForce || null,
      massCalibration: p.massCalibration || null,
      massBasisKind: MB[p.id] ? MB[p.id].kind : null,
      bodies: (p.bodies || []).map((b) => ({ type: b.type, m: b.m === undefined ? null : b.m, n: b.n === undefined ? null : b.n,
        mMin: b.mMin === undefined ? null : b.mMin, mMax: b.mMax === undefined ? null : b.mMax,
        coreMassFrac: b.core && b.core.massFrac !== undefined ? b.core.massFrac : null,
        lightSweep: b.lightSweep === undefined ? null : b.lightSweep })) };
  });
});
await page.close();
await browser.close();
const byId = new Map(P.map((p) => [p.id, p]));

// ---------------------------------------------------------------- 正本 calaudit
const CAL = JSON.parse(fs.readFileSync(path.join(ROOT, 'tests', 'out', 'calaudit-w249.json'), 'utf8'));
const calPop = (CAL.presets || []).map((z) => z.id);
const calRow = new Map((CAL.presets || []).map((z) => [z.id, z]));
const vl = new Map(((CAL.verdictLedger || {}).rows || []).map((z) => [z.id, z]));

// ---------------------------------------------------------------- 分類
function targetOf(p) {
  if (p.sampleClass !== 'calibration') return null;   // 対象(太陽系/恒星/NS/BH)は現実較正の本だけに付ける
  if (/^psr/.test(p.id)) return 'ns-binary';
  if (/^gw150914/.test(p.id)) return 'bh-binary';
  if (p.familyId === 'alphaCen' || p.familyId === 'sirius') return 'stellar-binary';
  if (p.sampleClass === 'calibration' && /^現実との照合/.test(p.group || '')) return 'solar-system';
  return null;
}
function systemOf(p) {
  if (p.sampleClass === 'calibration') return p.kFrame === 0 ? 'kf0' : 'dfm';
  if (p.scaleTier === 'galactic' || p.group === '実在天体のアナロジー' || p.group === '銀河の力学') return 'analogy';
  return 'outside';
}
const singles = (p) => p.bodies.filter((b) => b.type === 'single');
const declaredF = (mc) => !mc ? null : (Number.isFinite(mc.factor) ? mc.factor
  : (Number.isFinite(mc.factorUniform) ? mc.factorUniform : (Number.isFinite(mc.f) ? mc.f : null)));
const same = (arr) => arr.length && arr.every((x) => Math.abs(x / arr[0] - 1) < 1e-12);
/** **基準質量との数値比較**で f を出す(`massCalibration` が無いことを f=1 の根拠にしない)。 */
function effectiveF(p) {
  const mc = p.massCalibration;
  const sp = singles(p);
  if (mc && Array.isArray(mc.baseMass) && sp.length >= 2) {
    const r = [sp[0].m / mc.baseMass[0], sp[1].m / mc.baseMass[1]];
    return { ratios: r, f: same(r) ? r[0] : null, source: 'massCalibration.baseMass', sourceKind: 'declared-base' };
  }
  const tw = TWIN[p.id] ? byId.get(TWIN[p.id]) : null;
  if (tw) {
    const a = singles(p), b = singles(tw);
    if (a.length && a.length === b.length && p.bodies.length === tw.bodies.length) {
      const r = a.map((x, i) => x.m / b[i].m);
      const twBasis = tw.massBasisKind === 'observed-solution' ? '観測解の質量' : '基準は出典不明(観測版の宣言質量)';
      return { ratios: r, f: same(r) ? r[0] : null, source: 'twin:' + tw.id + '(' + twBasis + ')',
        sourceKind: tw.massBasisKind === 'observed-solution' ? 'twin-observed' : 'twin-unknown' };
    }
    // 円盤など: 最初の円盤の総質量(n·mMin)の比 —— 粒の質量は観測されていない
    const da = p.bodies.find((x) => x.type === 'disk'), db = tw.bodies.find((x) => x.type === 'disk');
    if (da && db && da.n && db.n) {
      const r = (da.n * da.mMin) / (db.n * db.mMin);
      return { ratios: [r], f: r, source: 'twin-total:' + tw.id + '(最初の円盤の総質量の比 —— 粒の質量は観測されていない)',
        sourceKind: 'twin-total' };
    }
    const ma = a.reduce((s, x) => s + x.m, 0), mb = b.reduce((s, x) => s + x.m, 0);
    if (ma > 0 && mb > 0) return { ratios: [ma / mb], f: ma / mb, source: 'twin-total:' + tw.id + '(single の総質量の比)', sourceKind: 'twin-total' };
  }
  if (p.massBasisKind === 'observed-solution') return { ratios: [1], f: 1, source: 'MASS_BASIS observed-solution(自身が基準)', sourceKind: 'self-observed' };
  return { ratios: null, f: null, source: '出典不明', sourceKind: 'unknown' };
}
function coreOrigin(p, f) {
  const cs = p.bodies.filter((b) => b.coreMassFrac !== null);
  if (!cs.length) return { kind: 'none', text: '無し' };
  if (Number.isFinite(f) && f > 1 && cs.every((b) => Math.abs(b.coreMassFrac - (f - 1) / f) < 1e-9))
    return { kind: 'f-derived', text: '(f−1)/f 由来(massFrac=' + cs[0].coreMassFrac + ')' };
  return { kind: 'physical', text: '物理コアの宣言(massFrac=' + cs.map((b) => b.coreMassFrac).join('/') + ')' };
}
const TOYS = ['supernovaCore', 'whiteDwarfDFM', 'whiteDwarfBareDFM', 'envelopeShedDFM', 'lfbotTrap', 'supernovaProgDFM'];

const rows = [];
for (const p of P) {
  const ef = effectiveF(p);
  const fDecl = declaredF(p.massCalibration);
  const c = calRow.get(p.id) || null;
  const v = vl.get(p.id) || null;
  const obs = c ? (c.quantities || []).filter((q) => q.gate && q.gate.status && q.gate.status !== '未判定')
    .map((q) => ({ kind: q.kind, target: q.target, status: q.gate.status, nSigma: Number.isFinite(q.gate.nSigma) ? q.gate.nSigma : null,
      residualPct: Number.isFinite(q.residualPct) ? q.residualPct : null,
      absResidual: (Number.isFinite(q.gate.assessedValue) && Number.isFinite(q.obs)) ? q.gate.assessedValue - q.obs : null,
      unit: q.unit || null })) : [];
  const fShow = Number.isFinite(ef.f) ? ef.f : null;
  rows.push({ id: p.id, emoji: p.emoji, sampleClass: p.sampleClass, oldPopulation: calPop.indexOf(p.id) >= 0,
    system: systemOf(p), target: targetOf(p),
    kFrame: p.kFrame, geoPN: p.geoPN, frameWeight: p.frameWeight, lambdaPN: p.lambdaPN,
    fDeclared: fDecl, law: p.massCalibration ? (p.massCalibration.law || null) : null,
    fEffective: fShow, fRatios: ef.ratios, fSource: ef.source, fSourceKind: ef.sourceKind,
    lawVersion: 'kF' + p.kFrame + '・geoPN' + (p.geoPN === null ? '?' : p.geoPN) + '・' + p.frameWeight
      + '・f=' + (fShow === null ? '出典不明' : String(Number(fShow.toPrecision(8))))
      + (p.lambdaPN !== 1 ? '・λ_PN=' + p.lambdaPN : '') + (p.compactForce ? '・CF' : ''),
    observables: obs, oldVerdict4: v ? v.verdict4 : null,
    oldRepresentative: v ? v.representative : null });
}

// ---------------------------------------------------------------- sampleClass の数え方(55 と 37 の差)
const presetCal = P.filter((p) => p.sampleClass === 'calibration').map((p) => p.id);
const presetDeclLines = new Set();
for (const id of presetCal) { const i = htmlText.indexOf('{ id:"' + id + '"'); if (i >= 0) {
  const j = htmlText.indexOf('sampleClass:"calibration"', i); presetDeclLines.add(htmlText.slice(0, j).split('\n').length); } }
const sampleClassAudit = {
  htmlOccurrences: calLines.length, presets: presetCal.length, population: calPop.length,
  presetsNotInPopulation: presetCal.filter((id) => calPop.indexOf(id) < 0),
  populationNotPresets: calPop.filter((id) => presetCal.indexOf(id) < 0),
  nonPresetOccurrences: calLines.filter((z) => !presetDeclLines.has(z.line)).map((z) => Object.assign({}, z, {
    reason: /^\/\//.test(z.text) ? '検証器・受理契約のコメント(プリセットではない)' : '検証器の拒否文言(プリセットではない)' })),
  rule: '`sampleClass:"calibration"` の文字列は html に ' + calLines.length + ' 回出るが、**プリセットの宣言は '
    + presetCal.length + ' 本**で、残りは検証器のコメントと拒否文言である(ID を持たない)。旧母集団 '
    + calPop.length + ' 本(calaudit の走行対象)とプリセットの宣言は ID の集合として一致する(差 '
    + (presetCal.filter((id) => calPop.indexOf(id) < 0).length + calPop.filter((id) => presetCal.indexOf(id) < 0).length) + ' 本)。',
};

// ---------------------------------------------------------------- 旧 4 値(履歴)と新集計(数えるだけ)
const FV = CAL.fourValues || {};
const legacy = { label: '旧契約(第281便まで)の履歴', population: calPop.length,
  current: FV.current ? { counts: FV.current.counts, gate: FV.current.gate, commit: FV.current.commit } : null,
  history: (FV.history || []).map((h) => ({ wave: h.wave, commit: h.commit, counts: h.counts })),
  rule: '旧 4 値は**旧契約の単一母集団(較正 37 本・kFrame を混ぜた 1 列)**の数である。新集計は系統ごとの別欄で、'
    + '旧 4 値を置き換えない(合否は 1 つも動かしていない)。' };
const zero4 = () => ({ '合': 0, '量限定合': 0, '否': 0, '保留': 0 });
const newTally = {};
for (const sys of CONTRACT.systems.map((s) => s.key).concat(['outside'])) {
  const rs = rows.filter((r) => r.system === sys);
  const t = { system: sys, population: rs.length, ids: rs.map((r) => r.id),
    oldPopulationMembers: rs.filter((r) => r.oldPopulation).length,
    byTarget: rs.reduce((o, r) => { const k = r.target || '—'; o[k] = (o[k] || 0) + 1; return o; }, {}),
    lawVersions: rs.reduce((o, r) => { o[r.lawVersion] = (o[r.lawVersion] || 0) + 1; return o; }, {}),
    observablesGated: rs.reduce((s, r) => s + r.observables.length, 0),
    oldVerdict4: rs.reduce((o, r) => { if (r.oldVerdict4) o[r.oldVerdict4] = (o[r.oldVerdict4] || 0) + 1; return o; }, zero4()),
    newVocabularyApplied: false };
  newTally[sys] = t;
}
newTally.dfm.note = 'DFM 版の語彙(概略整合/調整中/適用外)は**許容幅が未裁定なので当てない**。行ごとの残差(周期は相対 %・'
  + '近点移動は判定段の値 − 観測の絶対差)を observables に併記する。';
newTally.compare.note = '本便の時点で比較系列として宣言された本は ' + newTally.compare.population + ' 本(主系列の principle コピーは別の枝)。';
newTally.analogy.note = 'アナロジーの対象群(scaleTier:"galactic"・群「実在天体のアナロジー」「銀河の力学」)を数えるだけ。判定語彙は後続の便で当てる。';
const sum4 = (k) => ['kf0', 'dfm'].reduce((s, sys) => s + newTally[sys].oldVerdict4[k], 0);
const tallyCheck = { sameAsLegacy: ['合', '量限定合', '否', '保留'].every((k) => FV.current && sum4(k) === FV.current.counts[k]),
  rule: 'kf0 と dfm の旧 4 値の和は旧 4 値そのものと一致する(系統に分けただけで数は動かない)。' };

// ---------------------------------------------------------------- fLedger
const fLedger = [];
for (const r of rows) {
  const p = byId.get(r.id);
  const migrated = r.id === 'alphaCenABDFM' || r.id === 'siriusABDFM';
  const fd = r.fDeclared, fe = r.fEffective;
  const off = (x) => Number.isFinite(x) && Math.abs(x - 1) > 1e-12;
  if (!(off(fd) || off(fe) || migrated || (r.fRatios || []).some((x) => off(x)))) continue;
  const fam = TOYS.indexOf(r.id) >= 0 ? 'transfer' : null;
  const fForCore = Number.isFinite(fe) ? fe : fd;
  const cf = p.compactForce;
  fLedger.push({ id: r.id, emoji: r.emoji, system: r.system, target: r.target,
    law: r.law, fDeclared: fd, fEffective: fe, fRatios: r.fRatios, fSource: r.fSource, fSourceKind: r.fSourceKind,
    ledgerMissingButEffective: !p.massCalibration && off(fe),
    hiddenCore: coreOrigin(p, fForCore),
    lambdaPN: p.lambdaPN, lambdaIsInvF: p.lambdaPN !== 1 && Number.isFinite(fd) ? Math.abs(p.lambdaPN * fd - 1) < 1e-12 : false,
    cfDependsOnF: cf ? (cf.model === 'manev' ? 'manev: fMass=' + cf.fMass : 'current: κ は ⚡ の f≈2 で 1 度評価して凍結(κ=' + cf.kappa + ')') : null,
    dimmingCancel: p.bodies.some((b) => b.lightSweep !== null && b.lightSweep !== 0)
      ? '(1−l)·f=1 の測光相殺(lightSweep=' + p.bodies.map((b) => b.lightSweep).filter((x) => x !== null && x !== 0).join('/') + ')' : null,
    stage: stageOf(r.id, fam), migrated });
}
const fSummary = { n: fLedger.length,
  declaredOff: fLedger.filter((z) => Number.isFinite(z.fDeclared) && Math.abs(z.fDeclared - 1) > 1e-12).length,
  effectiveOff: fLedger.filter((z) => Number.isFinite(z.fEffective) && Math.abs(z.fEffective - 1) > 1e-12).length,
  ledgerMissingButEffective: fLedger.filter((z) => z.ledgerMissingButEffective).map((z) => z.id),
  unknownBase: fLedger.filter((z) => z.fSourceKind === 'unknown').map((z) => z.id),
  migratedThisWave: fLedger.filter((z) => z.migrated).map((z) => z.id),
  byStage: fLedger.reduce((o, z) => { o[z.stage.key] = (o[z.stage.key] || 0) + 1; return o; }, {}) };

const out = {
  meta: Object.assign(await provenanceMetaScoped({ root: ROOT,
    wave: '第282便a(原仮定者の裁定(第72報)②③⑤⑥・R77/R78 —— 較正契約の 3 系統と f=1 の棚卸し)',
    target: TARGET, inputs: INPUTS, code: CODE, scope: REGEN_SCOPE }),
  { tableVersion: CONTRACT_TABLE_VERSION, contractVersion: CONTRACT.version, doNotWrite: DO_NOT_WRITE,
    rule: '**数えるだけで合否を変えない**。f は `massCalibration` の有無ではなく**基準質量との数値比較**で出す'
      + '(基準質量が無い本は「出典不明」)。旧 4 値は旧契約の履歴として別欄に残す。' }),
  contract: CONTRACT,
  nPresets: rows.length,
  rows,
  sampleClassAudit,
  legacyFourValues: legacy,
  newTally, tallyCheck,
  fLedger, fSummary,
  twinDeclaration: TWIN,
  pageErrors,
};
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log('[w282a-contract] 内蔵 ' + rows.length + ' 本 / 系統 ' + Object.values(newTally).map((t) => t.system + ' ' + t.population).join('・')
  + ' / sampleClass の出現 ' + sampleClassAudit.htmlOccurrences + '(プリセット ' + sampleClassAudit.presets + '・母集団 ' + sampleClassAudit.population + ')'
  + ' / fLedger ' + fSummary.n + ' 本(宣言 f≠1 ' + fSummary.declaredOff + '・実質 f≠1 ' + fSummary.effectiveOff
  + '・台帳なしで実質 f≠1 ' + fSummary.ledgerMissingButEffective.join(',') + '・出典不明 ' + fSummary.unknownBase.length + ')'
  + ' / 旧 4 値の和の一致=' + tallyCheck.sameAsLegacy + ' / pageErrors=' + pageErrors.length + ' → ' + OUT);
