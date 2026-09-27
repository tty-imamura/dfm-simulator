// 第281便c(原仮定者の裁定(第71報)「重力マイクロレンズで見つかる浮遊惑星の質量算出根拠を調べ、DFM のダークローターを
// 恒星質量程度に調整して当てはめる。調整結果を DFM 版銀河の質量に計上する」・統括の検証項目 R74):
// **条件付き質量台帳・η 対照・減光と偏向の機構の分離**の器。
//
// ■ 何をするか(Node だけ —— 対象 html の inline script を tests/lib-w279b-headless.mjs で読み、物理コードは html の本文そのまま)
//   (i)   🛞 ngc3198DFM の宣言(bodies・massCalibration・scaleExp)から質量群を読み(純関数 tests/lib-w281c-rotorledger.mjs)、
//         build 後の質量配列の和(Float32 に丸めた値)も並べる。
//   (ii)  条件付き台帳(⟨m_DR⟩ = 0.1 / 1 / 10 M☉)・観測の行(浮遊惑星の総質量)・η 対照(M_lens = 0.75 M⊕ と 0.37 M⊕ の 2 列)。
//   (iii) html の 🛞 が宣言した表示専用の `massLedger` を validatePreset に通し、純関数の値と相対 1e-12 で照合する。
//   (iv)  **減光 lightSweep は光線の偏向に入らない**ことの実測: 🕶️ darkrotor を build し、光線の扇(31 本)を traceRay で
//         積分して、減光の配列 S.lSw を宣言のまま / 全 0 / 全 1 にした 3 通りの終端(位置・方向)をビットで比べる。
//   (v)   **現行の光線は重力と同じ m を読む(η=1 が模型の構造)**ことの実測: 器の中で作った 1 体の宇宙(内蔵ではない ——
//         プリセットは足さない)で、同じ衝突径数の光線の偏向角を m = 10 / 20 / 40(弱い偏向の域)で測り比を取る。
//
// ■ この器がしないこと
//   ・合否・一致を言わない。エンジンへ何も接続しない(光線の積分は表示用の traceRay をそのまま呼ぶだけ)。
//   ・η を観測から決めない(η は仮説)。「ダークローターが浮遊惑星である」とは言わない。
//
// 環境変数: なし(`QA_TARGET` で対象 html を替えられる —— 既定 beta/index.html)。
// 実行: node tests/exp-w281c-rotorledger.mjs
// 出力: tests/out/rotorledger-w281c.json(来歴 w272e-1・target = 対象 html。html を変えたら走らせ直す)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadHtmlHeadless } from './lib-w279b-headless.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import * as L from './lib-w281c-rotorledger.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const OUT = path.join(ROOT, 'tests', 'out', 'rotorledger-w281c.json');

const H = loadHtmlHeadless(path.join(ROOT, TARGET));
const HP = H.HP;
const traceRay = H.evalExpr('traceRay');
const clone = (o) => JSON.parse(JSON.stringify(o));
const byId = (id) => HP.allPresets().find((q) => q.id === id);

// ---- (i) 質量群
const pd = byId('ngc3198DFM');
if (!pd) throw new Error('ngc3198DFM が無い');
const g = L.massGroupsFromPreset(pd);
const v0 = HP.validatePreset(clone(pd));
HP.sim.build(v0.preset);
const S0 = HP.sim;
let bStar = 0, bGas = 0, bCore = 0;
for (let i = 0; i < S0.n; i++) {
  if (S0.shellGas && S0.shellGas[i]) bGas += S0.m[i];
  else if (S0.m[i] > 50) bCore += S0.m[i];
  else bStar += S0.m[i];
}
const built = { n: S0.n, star: bStar, gas: bGas, core: bCore, total: bStar + bGas + bCore,
  note: '質量配列は Float32 —— 宣言値との差は丸めの分(台帳は宣言値で計算する)' };

// ---- (ii) 台帳・観測の行・η 対照
const led = L.rotorLedger(g);
const ffp = L.ffpObsRow(g, led);
const eta075 = L.lensEtaTable({ mLensEarth: 0.75 });
const eta037 = L.lensEtaTable({ mLensEarth: 0.37 });

// ---- (iii) html の宣言との照合
const ml = v0.preset.massLedger || null;
const decl = { present: !!ml, warnings: v0.warnings || [], maxRel: null, rows: 0, defaultScenario: ml ? ml.defaultScenario : null,
  rotorInFStar: ml ? ml.rotorInFStar : null };
if (ml) {
  let worst = 0;
  const cmp = (a, b) => { const r = L.relDiff(a, b); if (!(r <= worst)) worst = Number.isFinite(r) ? Math.max(worst, r) : Infinity; };
  cmp(ml.starBase, g.starBase); cmp(ml.fStar, g.fStar); cmp(ml.gas, g.gas); cmp(ml.core, g.core);
  cmp(ml.unitKg, g.unitKg); cmp(ml.mStarSun, led.mStarSun); cmp(ml.nRatio, led.nRatio);
  cmp(ml.currentTotalUnit, led.current.totalUnit); cmp(ml.currentTotalSun, led.current.totalSun);
  (ml.rotorScenarios || []).forEach((r, k) => {
    const w = led.rows[k];
    if (!w) { worst = Infinity; return; }
    cmp(r.mRotorSun, w.mRotorSun); cmp(r.nRotor, w.nRotor); cmp(r.mRotorUnit, w.mRotorUnit);
    cmp(r.totalUnit, w.totalUnit); cmp(r.totalSun, w.totalSun);
  });
  decl.rows = (ml.rotorScenarios || []).length;
  decl.maxRel = worst;
  decl.identityRel = L.ledgerIdentityError(ml);
}
const nDeclared = HP.allPresets().filter((q) => q.massLedger !== undefined).map((q) => q.id);

// ---- (iv) 減光は偏向に入らない(🕶️ darkrotor)
function fanEnds(S, lswMode) {
  const keep = Float64Array.from(S.lSw);
  if (lswMode === 0) S.lSw.fill(0);
  if (lswMode === 1) S.lSw.fill(1);
  const ends = [];
  for (let k = 0; k <= 30; k++) {
    const y0 = -300 + 20 * k;
    const r = traceRay(S, -600, y0, 1, 0, 2, 700, null);
    ends.push([r.x, r.y, r.cx, r.cy]);
  }
  for (let i = 0; i < S.n; i++) S.lSw[i] = keep[i];
  return ends;
}
// 第283便b(原仮定者の裁定(第73報)④・統括の検証項目 R84): 🕶️ は**退役**(BUILTIN_PRESETS には残る)。機構の実測(減光は偏向に
// 入らない)は内蔵を読まず、**凍結した写し**(tests/fixtures/retired-w283b.json —— 基点 de9e39b の内蔵定義そのもの)から組み立てる。
// 写しと内蔵の presetSigHash が同じことを記録する(同じ本であることの確認 —— 違えば止める)。
const RETIRED_FX = 'tests/fixtures/retired-w283b.json';
const FX = JSON.parse(fs.readFileSync(path.join(ROOT, RETIRED_FX), 'utf8'));
const dr = FX.presets.darkrotor.raw;
const presetSigHashFn = H.evalExpr('presetSigHash');
const drBuiltin = byId('darkrotor');
const drSig = { fixture: FX.presets.darkrotor.presetSigHash, fixtureNow: presetSigHashFn(dr), builtin: drBuiltin ? presetSigHashFn(drBuiltin) : null };
if (drSig.fixture !== drSig.fixtureNow || (drSig.builtin !== null && drSig.builtin !== drSig.fixture)) {
  console.error('退役の写しと内蔵の署名が違う: ' + JSON.stringify(drSig)); process.exit(1);
}
HP.sim.build(HP.validatePreset(clone(dr)).preset);
const SD = HP.sim;
const lswDecl = [SD.lSw[0], SD.lSw[1], SD.lSw[2]];
const eDecl = fanEnds(SD, null), eZero = fanEnds(SD, 0), eOne = fanEnds(SD, 1);
const same = (A, B) => A.every((a, i) => a.every((x, j) => Object.is(x, B[i][j])));
let maxDefl = 0;
for (const e of eDecl) maxDefl = Math.max(maxDefl, Math.abs(Math.atan2(e[3], e[2])));
let heavy = 0; const rayHeavy = H.evalExpr('rayHeavy');
for (let i = 0; i < SD.n; i++) if (rayHeavy(SD, i)) heavy++;
const lswRay = { preset: 'darkrotor', source: RETIRED_FX, presetSig: drSig, rays: eDecl.length, lswDeclaredFirst3: lswDecl, heavyBodies: heavy,
  maxDeflectionRad: maxDefl, sameDeclVsZero: same(eDecl, eZero), sameDeclVsOne: same(eDecl, eOne) };

// ---- (v) 偏向は重力と同じ m を読む(器の中の 1 体の宇宙 —— 内蔵ではない)
function oneBody(m, lsw) {
  return { name: 'w281c-lens', description: 'harness only', camera: { scale: 300 }, world: { boundary: 'none', size: 0 },
    physics: { G: 1, D0: 2, kFrame: 0, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, kappaT: 1 / 60, cLight: 30, softening: 4, etaRad: 0 },
    bodies: [{ type: 'single', m, x: 0, y: 0, vx: 0, vy: 0, spin: 0, radius: 18, pinned: true, lightSweep: lsw }] };
}
const lensRows = [];
for (const m of [10, 20, 40]) {
  const res = {};
  for (const lsw of [0, 1]) {
    HP.sim.build(HP.validatePreset(oneBody(m, lsw)).preset);
    const r = traceRay(HP.sim, -2000, 150, 1, 0, 2, 2000, null);
    res[lsw] = r;
  }
  const a0 = Math.atan2(res[0].cy, res[0].cx);
  lensRows.push({ m, impactB: 150, deflectionRad: a0,
    lswInvariant: Object.is(res[0].x, res[1].x) && Object.is(res[0].y, res[1].y) && Object.is(res[0].cx, res[1].cx) && Object.is(res[0].cy, res[1].cy) });
}
const lensMass = { rows: lensRows,
  ratio2x: lensRows[1].deflectionRad / lensRows[0].deflectionRad,
  ratio4x: lensRows[2].deflectionRad / lensRows[0].deflectionRad };

const J = {
  meta: provenanceMeta({ root: ROOT, wave: '第281便c', target: TARGET,
    inputs: [TARGET, RETIRED_FX],
    code: ['tests/exp-w281c-rotorledger.mjs', 'tests/lib-w281c-rotorledger.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs'] }),
  note: '条件付き台帳(仮定の 3 シナリオ)と η 対照(仮説)。観測との一致や検出を主張しない。較正母集団に入れない。🛞 の既定は追加 0(現状)。',
  sources: {
    nasa: 'https://www.nasa.gov/missions/roman-space-telescope/new-study-reveals-nasas-roman-could-find-400-earth-mass-rogue-planets/',
    arxiv: ['2303.08279', '2303.08280', '2507.13794'],
    retrieved: '未取得(番号のみ)—— 値は統括の検証項目 R74 の転記',
  },
  constants: { ...L.CONST, earthPerSun: L.earthPerSun(), kappaMasPerSun: L.kappaMasPerSun() },
  groups: g, built, ledger: led, ffpObs: ffp,
  eta: { mLens075: eta075, mLens037: eta037 },
  declaration: decl, declaredPresets: nDeclared,
  lightSweepVsDeflection: lswRay, lensMassCoupling: lensMass,
  headlessMs: H.ms, headlessErrors: H.errors.length,
};
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(J, null, 1) + '\n');
console.log(JSON.stringify({ out: path.relative(ROOT, OUT), current: led.current, rows: led.rows.map((r) => [r.mRotorSun, r.mRotorUnit, r.totalUnit, r.totalSun]),
  ffp: [ffp.fracOfStarMass, ffp.addUnit], eta: eta075.rows.map((r) => [r.mRotorSun, r.eta, r.tEDaysEta1, r.piRelMasForSameThetaE, r.losGapAU]),
  decl, nDeclared, lswRay, lensMass: [lensMass.ratio2x, lensMass.ratio4x, lensRows.map((r) => r.lswInvariant)] }, null, 1));
