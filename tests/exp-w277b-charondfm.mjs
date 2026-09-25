// 第277便b(原仮定者の裁定(第67報)(1))— **同一観測解の冥王星–カロン**を測る器。
//
// ■ しないこと(先に書く)
//   ・**内蔵 ❄️ plutoCharonReal を 1 bit も触らない**(本器は新 ID 2 本と診断コピーだけを走らせる)。
//   ・**残差がゼロになる ε・a・質量係数 f を探索して採用しない**(第276便b の禁止をそのまま継ぐ)。
//   ・「較正が済んだ」「観測と一致した」「新発見」は書かない。本器が出すのは**表**であって判定ではない
//     (判定は門 —— 観測 σ に対する 3σ の線を機械で当てて「合/否/保留」の語を返すだけである)。
//
// ■ 測るもの
//   §A 入力の監査(ブラウザ不要): GM→質量・軌道面射影・接触要素・**公表 3 値の互いの差**。
//   §B 則の純関数検定(ブラウザ不要): **零条件**(相互同期した円軌道で s=0・キック 0・ΔE 0)・
//       否定対照(片側の自転 0 / 自転反転 / 動径速度の追加 / κ=0)・運動量と J_z の閉じ方・Q̇≥0。
//       **NS 延長の否定対照**: 無減衰の局所試作を中性子星連星へ「一般則」として延長した配置で
//       初期動径加速度がニュートン値からどれだけ外れるかを測り、**一般則として採らない**を回帰に残す。
//   §C エンジン実測(ページ): 新 ID 2 本 × 3 段(dt=0.16/0.08/0.04)の**同方向1周**の周期・
//       接触要素・帳簿・キック・NaN/クランプ。**2 本の差**が則の寄与である。
//   §D 追加系列: (i) ε 1/2.5/5/10 km、(ii) 自転 0.9Ω/1.1Ω/0/反転、(iii) massPrecision single/double、
//       (iv) 小衛星 4 体を足した診断コピー(Kerberos/Styx は unconstrained → 0 と 2015 値の 2 通り)。
//   §E 要因表 v2(`--factors2`): 第276便b の要因表を**同一解の入力**で置き直したもの。
//
// 実行:
//   PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright node tests/exp-w277b-charondfm.mjs
//       [--pilot] [--only A,B,C,D,E] [--stages h,h2,h4]
// 出力: tests/out/charondfm-w277b.json(来歴 meta は tests/lib-w272e-provenance.mjs 版 w272e-1)
//
// ■ 第278便b(統括の検証項目 R53・R54)で改めたこと(版 w278b-1 —— 旧版の値は `history.w277b` に残す)
//   ・⛄ は `integrator:"leapfrog"`+`relativeDrag.integration:"midpoint"`、🌨️ は `integrator:"leapfrog"` を宣言した
//     (入力は変えていない)。§C はその宣言のまま測る。
//   ・**判定量を 2 欄に分ける**(AM16): 欄 (1) **暦の再現**(PLU060 400 年平均 P・Horizons PR 元期 A/B に対する
//     差を s と ppm で記帳 —— σ は無いので合否を出さない)/ 欄 (2) **観測検定**(Buie 2012 二体 P)は
//     差と σ 倍を**比較値**として記帳し、状態語は **「判定保留(量定義不一致)」**(同一暦の入力を Buie の σ で
//     判定しない)。**門の語をこの 2 本の正式判定に使わない**(母集団外・4 値は動かない)。
//   ・追加の診断行 **「Buie 二体再現(転写・積分器の試験)」**: Buie の a・P から GM=4π²a³/P² を作って二体を回し
//     P を再現する(**独立の検証ではない**)。
//   ・帳簿の読み口: `S.totals()` は物質+コアだけなので、**器の側で 1 回だけ** resPx/resPy/resL/radL を足す。
//   ・周の数え方: 角度の足し込み(累積 32 rad 超で丸めが揃い ≈4e-4 s の段差を生む)をやめ、初期方向に対する
//     位相 φ=atan2(r₀×r, r₀·r) の負→非負を直接判定する(第278便b の器 `exp-w278b-charonwin.mjs` と同じ)。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { withProvenance } from './lib-w272e-provenance.mjs';
import { CHARON_DFM_VERSION, GM_2024, GM_2015, ELEM_2024, BUIE_2012, HORIZONS_PR, HORIZONS_STATE,
  G_MODEL, PRECISE_UNITS, projectToOrbitPlane, massFromGM, charonPairState, osculating,
  pairSlipStep, totalsOf, syncCircularPair } from './lib-w277b-charondfm.mjs';
import { pairSlipMidpointStep } from './lib-w278b-midpoint.mjs';
// 第281便a(原仮定者の裁定(第71報)・AN16・統括の検証項目 R71): **この器が読む html の領域**の宣言。
//   `tests/lib-w281a-scope.mjs` がこの領域だけの hash(`scopeSha256`)を正本の meta に刻む。
//   `lint.provenanceMeta` ② は「targetSha256 一致 **または**(scopeComplete かつ scopeSha256 が今の html で
//   引き直した値と一致)」で通す。`lint.regenScope` が「宣言 ⊇ 器のコードから機械で引いた下限
//   (HP.*・html の最上位名・内蔵プリセット id)」を照合する。**1 行の JSON**(lint が読む)。
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
const REGEN_SCOPE = {"presets":["plutoCharonDFM","plutoCharonKF0Control"],"roots":["$","HP.allPresets","HP.orbitPlaneProject","HP.presetSig","HP.relativeDragProbe","HP.sim","HP.validatePreset","T","applyQLock","ch","clamp","ctx","dfmRelativeDragMidpointStep","dfmRelativeDragStep","isNum","relativeDragMidpointGuard","relativeDragMidpointSolve","validatePreset"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);   // 第281便a: 走行開始時の html の領域
const INDEX = 'file://' + path.join(ROOT, TARGET);
const OUT = path.join(ROOT, 'tests', 'out', 'charondfm-w277b.json');
const HARNESS_VERSION = 'w278b-1';   // 第278便b: 2 欄・中点法の宣言・Buie 二体再現・帳簿の読み口(旧 w277b-charondfm-1)

const argv = process.argv.slice(2);
const getArg = (k, d) => { const i = argv.indexOf(k); return (i >= 0 && argv[i + 1]) ? argv[i + 1] : d; };
const PILOT = argv.includes('--pilot');
const ONLY = (getArg('--only', '') || '').split(',').map((z) => z.trim()).filter(Boolean);
const want = (s) => !ONLY.length || ONLY.includes(s);
const STAGE_LIST = (getArg('--stages', 'h,h2,h4') || '').split(',').map((z) => z.trim()).filter(Boolean);

// ---- 契約(走らせる前に固定した) ------------------------------------------------
// **dt の意味が ❄️ と違う**: 時間単位が 10 s なので、同じ物理刻みには 10 倍の dt が要る。
// ❄️ の h=0.016(=1.6 s)に対応するのは 0.16 である。
const STAGES = { h: { dt: 0.16 }, h2: { dt: 0.08 }, h4: { dt: 0.04 } };
const ORB_MAX = 3;                    // 同方向 3 周まで(判定に使うのは 2 周目)
const SEC_PER_UNIT = Math.pow(10, PRECISE_UNITS.T);
const OBS = { value: BUIE_2012.periodSec, sigma: BUIE_2012.sigmaSec, source: BUIE_2012.source };
const sigOf = (sec) => Number.isFinite(sec) ? (sec - OBS.value) / OBS.sigma : null;
const pctOf = (sec) => Number.isFinite(sec) ? (sec - OBS.value) / OBS.value * 100 : null;
// 第278便b(R53): ⛄🌨️ の観測検定欄は**門を掛けない**(同一暦の入力を Buie の σ で判定しない)。
// 返すのは状態語 1 つだけで、差と σ 倍は**比較値**として別の欄に置く。
const OBS_STATUS = '判定保留(量定義不一致)';
const gateWord = (nSigma) => (nSigma === null || !Number.isFinite(nSigma)) ? '保留(測定不能)' : OBS_STATUS;
// 欄 (1) 暦の再現(σ なし —— 合否を出さない)
const ALMANAC = [
  { key: 'plu060-mean400', label: 'PLU060 400 年平均 P', sec: ELEM_2024.Charon.periodSec },
  { key: 'horizons-PR-epochA', label: 'Horizons osculating PR 元期 A', sec: HORIZONS_PR.epochA.periodSec },
  { key: 'horizons-PR-epochB', label: 'Horizons osculating PR 元期 B', sec: HORIZONS_PR.epochB.periodSec },
];
const almanacOf = (sec) => ALMANAC.map((a) => ({ key: a.key, label: a.label, refSec: a.sec,
  diffSec: sec - a.sec, ppm: (sec - a.sec) / a.sec * 1e6, verdict: '合否なし(σ なし — 表示桁・400 年の散らばりは σ ではない)' }));
const observationOf = (sec) => ({ refSec: OBS.value, sigmaSec: OBS.sigma, diffSec: sec - OBS.value,
  comparisonSigma: sigOf(sec), status: OBS_STATUS,
  note: '比較値(門ではない)—— 入力も目標も同一暦(PLU060)の量であり、Buie 2012 の二体 P の σ で判定しない' });

const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');

// ================================================================ §A 入力の監査
const st = charonPairState({});
const oscA = osculating(st.rel.r, st.rel.v, G_MODEL, st.mPluto + st.mCharon);
const published = [
  { key: 'buie2012-twoBody', label: 'Buie 2012 二体 P(判定行)', sec: BUIE_2012.periodSec, sigma: BUIE_2012.sigmaSec },
  { key: 'plu060-mean400', label: 'PLU060 400 年平均 P', sec: ELEM_2024.Charon.periodSec, sigma: null },
  { key: 'horizons-PR-epochA', label: 'Horizons osculating PR 元期 A(重心基準)', sec: HORIZONS_PR.epochA.periodSec, sigma: null },
  { key: 'horizons-PR-epochB', label: 'Horizons osculating PR 元期 B(重心基準)', sec: HORIZONS_PR.epochB.periodSec, sigma: null },
].map((r) => Object.assign(r, { diffSec: r.sec - OBS.value, nSigmaVsBuie: sigOf(r.sec) }));

const inputs = {
  note: '**数値をここで作らない** —— 一次資料の表・列の転記と、決定論的な換算だけである',
  gm: GM_2024, gm2015: GM_2015, elements: ELEM_2024, buie: BUIE_2012,
  horizonsPR: HORIZONS_PR,
  horizonsStateSource: HORIZONS_STATE.source, covariance: HORIZONS_STATE.covariance,
  units: PRECISE_UNITS, G: G_MODEL,
  masses: { plutoKg: massFromGM(GM_2024.Pluto.value), charonKg: massFromGM(GM_2024.Charon.value),
    plutoUnit: st.mPluto, charonUnit: st.mCharon, ratio: st.massRatio },
  projection: { sepKm: st.sepKm, relSpeedKms: st.relSpeedKms,
    outOfPlaneKm: st.outOfPlaneKm, outOfPlaneKms: st.outOfPlaneKms,
    relUnits: st.rel, note: 'ê₁=r/|r|・ê₃=r×v/|r×v|・ê₂=ê₃×ê₁(位置と速度を同じ回転で射影・z を捨てない)' },
  osculating: { aUnit: oscA.a, aKm: oscA.a * PRECISE_UNITS.kmPerUnit, e: oscA.e,
    periodSec: oscA.P * SEC_PER_UNIT, nSigmaVsBuie: sigOf(oscA.P * SEC_PER_UNIT),
    vsTable10: { daKm: oscA.a * PRECISE_UNITS.kmPerUnit - ELEM_2024.Charon.aKm,
      de: oscA.e - ELEM_2024.Charon.ecc } },
  bodies: { pluto: st.pluto, charon: st.charon, omega: st.omega },
  published,
  publishedSpread: { maxAbsSigmaVsBuie: Math.max(...published.map((r) => Math.abs(r.nSigmaVsBuie))),
    note: '**3 つは別の量である**(二体ケプラー当てはめ / 暦の 400 年平均 / 接触要素の瞬時値)。'
      + 'この食い違い自体は誤りではないが、26 ms の σ は「どの量に対する σ か」を宣言しないと使えない' },
};

// ================================================================ §B 則の純関数検定
const A_UNIT = 195.97369307113357, R_P = 11.88, R_C = 6.06, EPS = 0.01;
const mk = () => {
  const sp = syncCircularPair({ m1: st.mPluto, m2: st.mCharon, a: A_UNIT, R1: R_P, R2: R_C });
  return { m: sp.m.slice(), x: sp.x.slice(), y: sp.y.slice(), vx: sp.vx.slice(), vy: sp.vy.slice(),
    spin: sp.spin.slice(), R: sp.R.slice(), Omega: sp.Omega };
};
const OMEGA_SYNC = mk().Omega;
function lawCase(tag, mut, opt) {
  const s = mk(); if (mut) mut(s);
  const a = totalsOf(s), p0 = Math.abs(s.m[1] * s.vy[1]);
  const r = pairSlipStep(s, Object.assign({ dt: 0.16, kappa: 1, eps: EPS }, opt || {}));
  const b = totalsOf(s);
  return { tag, slipMax: r.slipMax, kickMax: r.kickMax, torqueMax: r.torqueMax, heat: r.heat,
    dLz: b.L - a.L, dLzRel: (a.L !== 0) ? Math.abs(b.L - a.L) / Math.abs(a.L) : null,
    dPx: b.px - a.px, dPy: b.py - a.py, dPrel: (p0 > 0) ? Math.hypot(b.px - a.px, b.py - a.py) / p0 : null,
    dE: b.E - a.E, heatNonNegative: r.heat >= 0, resL: r.resL,
    kickRelToMomentum: (p0 > 0) ? r.kickMax / p0 : null };
}
const lawRows = [
  lawCase('zero-condition(相互同期した円軌道)', null),
  lawCase('spin_i=0(片側の自転を 0)', (s) => { s.spin[0] = 0; }),
  lawCase('spin_i=反転', (s) => { s.spin[0] = -OMEGA_SYNC; }),
  lawCase('radial +1e-3(動径速度の追加)', (s) => {
    const M = s.m[0] + s.m[1];
    s.vx[0] -= 1e-3 * s.m[1] / M; s.vx[1] += 1e-3 * s.m[0] / M; }),
  lawCase('spin 0.9Ω(両体)', (s) => { s.spin[0] = 0.9 * OMEGA_SYNC; s.spin[1] = 0.9 * OMEGA_SYNC; }),
  lawCase('spin 1.1Ω(両体)', (s) => { s.spin[0] = 1.1 * OMEGA_SYNC; s.spin[1] = 1.1 * OMEGA_SYNC; }),
  lawCase('κ=0(則を宣言したまま用量 0)', (s) => { s.spin[0] = 0; }, { kappa: 0 }),
  lawCase('W₀=1e-6(背景の重みが効く)', (s) => { s.spin[0] = 0; }, { W0: 1e-6 }),
];
// 零条件の残差(**相対で報告する** —— 絶対 0 でも「0 と書ける」ことを機械で確かめる)
const zero = lawRows[0];
// **NS 延長の否定対照**(R50 の「初期動径加速度 −1.1e11」型): 無減衰の局所試作を中性子星連星へ
// 一般則として延長すると、初期動径加速度がニュートン値から桁で外れる。**一般則として採らない**。
const nsControl = (() => {
  // PSR J0737−3039A/B の転写(1単位=10⁶m/10¹s/10²⁷kg・c₀=3e3 —— 📻 psrDoubleAB と同じ族)。
  // 質量 A 2.660982861×10³⁰kg・B 2.483370041×10³⁰kg・a=8.788366×10⁸m・自転 22.7ms / 2.77s。
  const G = 6.674, mA = 2660.982861, mB = 2483.370041, a = 878.8366, eps = 0.05;
  const omA = 276.7998768 * 10, omB = 2.2654675 * 10;     // rad / 10 s(時間単位が 10 s)
  const M = mA + mB, Om = Math.sqrt(G * M / (a * a * a));
  const s = { m: [mA, mB], x: [-(mB / M) * a, (mA / M) * a], y: [0, 0], vx: [0, 0],
    vy: [Om * (-(mB / M) * a), Om * ((mA / M) * a)], spin: [omA, omB], R: [1.175, 1.175] };
  const aNewton = G * M / (a * a);                       // 相対運動のニュートン加速度の大きさ
  const before = { vx: s.vx.slice(), vy: s.vy.slice() };
  const dt = 1e-6;
  const r = pairSlipStep(s, { dt, kappa: 1, eps });
  const dvx = (s.vx[1] - before.vx[1]) - (s.vx[0] - before.vx[0]);
  const dvy = (s.vy[1] - before.vy[1]) - (s.vy[0] - before.vy[0]);
  const aDrag = Math.hypot(dvx, dvy) / dt;               // 引きずり則だけが作る相対加速度の大きさ
  return { note: '**一般則として採らない**ことの回帰試験 —— 相互同期していない系(|ω|/n が A≈3.9×10⁵・'
      + 'B≈3.2×10³)へ同じ κ=1 で延長すると、引きずり則だけが作る相対加速度がニュートン値と'
      + '同じ桁に収まらない。この系は **kF0(相互同期)に分類しない**(R49)',
    omegaOverN: { A: omA / Om, B: omB / Om }, aNewton, aDrag,
    ratio: aDrag / aNewton, slipMax: r.slipMax, kickMax: r.kickMax, heat: r.heat,
    verdict: (Math.abs(aDrag / aNewton) > 10) ? '一般則として採らない(桁で外れる)' : '桁は外れない(記録のみ)' };
})();

// ================================================================ ブラウザ
let browser = null, page = null, pageErrors = [];
async function openPage() {
  const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
  const req = createRequire(path.join(PW_DIR, 'noop.js'));
  const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  try { browser = await req('playwright').chromium.launch(); }
  catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }
  page = await browser.newPage();
  page.on('pageerror', (e) => pageErrors.push(String(e)));
  await page.goto(INDEX, { waitUntil: 'load' });
  await page.waitForFunction(() => window.HP && HP.sim);
  await page.evaluate(installRunner);
}

// ページ側の測定コード(**1 か所だけ**)。内蔵 2 本の診断コピーを作って走らせる。
function installRunner() {
  window.__w277b = {};
  window.__w277b.make = (cfg) => {
    const src = HP.allPresets().find((q) => q.id === cfg.id);
    if (!src) return null;
    const p = JSON.parse(JSON.stringify(src));
    if (cfg.softening !== undefined) p.physics.softening = cfg.softening;
    if (cfg.massPrecision !== undefined) {
      if (cfg.massPrecision === 'single') delete p.physics.massPrecision;
      else p.physics.massPrecision = cfg.massPrecision;
    }
    if (cfg.kappa !== undefined) {
      const integ = p.physics.relativeDrag ? p.physics.relativeDrag.integration : undefined;
      if (cfg.kappa === null) delete p.physics.relativeDrag;
      else { p.physics.relativeDrag = { law: 'pairSlip', kappa: cfg.kappa, pairs: 'all', spins: 'declared' };
        if (integ) p.physics.relativeDrag.integration = integ; }
    }
    if (cfg.integration !== undefined && p.physics.relativeDrag) {
      if (cfg.integration === 'explicit') delete p.physics.relativeDrag.integration;
      else p.physics.relativeDrag.integration = cfg.integration;
    }
    if (cfg.integrator !== undefined) p.integrator = cfg.integrator;
    if (cfg.pairs !== undefined && p.physics.relativeDrag) p.physics.relativeDrag.pairs = cfg.pairs;
    if (cfg.spinScale !== undefined) for (const b of p.bodies) b.spin = b.spin * cfg.spinScale;
    if (cfg.spin0 === true) p.bodies[0].spin = 0;
    if (cfg.addBodies) for (const b of cfg.addBodies) p.bodies.push(JSON.parse(JSON.stringify(b)));
    if (cfg.diagClass) { p.sampleClass = 'principle'; p.fidelity = 'toy';
      delete p.notClaim; delete p.claims; }
    if (cfg.softeningFloor !== undefined) p.physics.softeningFloor = cfg.softeningFloor;
    return p;
  };
  window.__w277b.declared = (id) => {
    const src = HP.allPresets().find((q) => q.id === id);
    if (!src) return null;
    const v = HP.validatePreset(JSON.parse(JSON.stringify(src)));
    if (!v.ok) return { id, error: v.errors };
    HP.sim.build(v.preset);
    const S = HP.sim;
    return { id, emoji: src.emoji, n: S.n, warnings: v.warnings,
      G: S.params.G, softening: S.params.softening, kFrame: S.params.kFrame,
      massPrec: S.massPrec, framePrec: S.framePrec, spinPrec: S.spinPrec, hasRelativeDrag: !!S.hasRelativeDrag,
      integrator: S.integrator, integration: S.relDrag ? (S.relDrag.integration || 'explicit') : null,
      spinIsF64: S.spin instanceof Float64Array,
      relDrag: S.relDrag ? JSON.parse(JSON.stringify(S.relDrag)) : null,
      mIsF64: S.m instanceof Float64Array, xIsF64: S.x instanceof Float64Array,
      m: [S.m[0], S.m[1]], x: [S.x[0], S.x[1]], y: [S.y[0], S.y[1]],
      vx: [S.vx[0], S.vx[1]], vy: [S.vy[0], S.vy[1]], spin: [S.spin[0], S.spin[1]],
      R: [S.R[0], S.R[1]], sig: HP.presetSig(v.preset) };
  };
  // 1 走行(同方向 n 周・2 周目の周期を判定に使う)
  window.__w277b.run = (cfg, dt, maxSteps, orbMax) => {
    const p = window.__w277b.make(cfg);
    if (!p) return { error: 'no-preset' };
    const v = HP.validatePreset(p);
    if (!v.ok) return { error: 'validate', errors: v.errors, warnings: v.warnings };
    HP.sim.build(v.preset);
    const S = HP.sim;
    const G = S.params.G, eps = S.params.softening, ci = 0, oi = 1;
    const mA = S.m[ci], mB = S.m[oi], MT = mA + mB;
    const cm0x = (mA * S.x[ci] + mB * S.x[oi]) / MT, cm0y = (mA * S.y[ci] + mB * S.y[oi]) / MT;
    // 第278便b(R54): 帳簿の読み口 —— S.totals() は物質+コアだけなので、器の側で 1 回だけ
    // リザーバ(resPx/resPy/resL)と放射(radL)を足す(**S.totals 自体は変えない**)
    const ledger = () => { const t = S.totals();
      return { px: t.px + (S.resPx || 0), py: t.py + (S.resPy || 0), L: t.L + (S.resL || 0) + (S.radL || 0) }; };
    const tot0 = ledger();
    const spin0 = [S.spin[ci], S.spin[oi]];
    const energy = () => { const E = S.energies(); return E.kin + E.rot; };
    const eNewton = () => {
      const dx = S.x[oi] - S.x[ci], dy = S.y[oi] - S.y[ci];
      const rr = Math.sqrt(dx * dx + dy * dy + eps * eps);
      return energy() - G * mA * mB / rr;
    };
    const pAbs = () => { let s = 0; for (let i = 0; i < S.n; i++) s += S.m[i] * Math.hypot(S.vx[i], S.vy[i]); return s; };
    const e0 = eNewton(), pScale0 = pAbs();
    const osc = () => {
      const dx = S.x[oi] - S.x[ci], dy = S.y[oi] - S.y[ci];
      const dvx = S.vx[oi] - S.vx[ci], dvy = S.vy[oi] - S.vy[ci];
      const r = Math.hypot(dx, dy), v2 = dvx * dvx + dvy * dvy, mu = G * MT;
      const inv = 2 / r - v2 / mu, a = (inv !== 0) ? 1 / inv : NaN;
      const ex = (v2 * dx - (dx * dvx + dy * dvy) * dvx) / mu - dx / r;
      const ey = (v2 * dy - (dx * dvx + dy * dvy) * dvy) / mu - dy / r;
      return { r, a, e: Math.hypot(ex, ey), P: (a > 0) ? 2 * Math.PI * Math.sqrt(a * a * a / mu) : NaN };
    };
    const osc0 = osc();
    const rev = [];
    // 第278便b: 周は**初期方向に対する位相の負→非負**で数える(角度の足し込みはしない)
    const r0x = S.x[oi] - S.x[ci], r0y = S.y[oi] - S.y[ci];
    const hSign = Math.sign(r0x * (S.vy[oi] - S.vy[ci]) - r0y * (S.vx[oi] - S.vx[ci])) || 1;
    let phPrev = 0;
    let rMin = Infinity, rMax = -Infinity, cmMax = 0, nan = false, stop = 'steps', err = null;
    const sampleEvery = Math.max(1, Math.round(maxSteps / 2000));
    let k = 0;
    try { for (; k < maxSteps; k++) {
      S.step(dt);
      const dx = S.x[oi] - S.x[ci], dy = S.y[oi] - S.y[ci];
      const rr = Math.hypot(dx, dy);
      if (rr < rMin) rMin = rr; if (rr > rMax) rMax = rr;
      const ph = hSign * Math.atan2(r0x * dy - r0y * dx, r0x * dx + r0y * dy);
      const prevPh = phPrev; phPrev = ph;
      if (prevPh < 0 && ph >= 0 && rev.length < orbMax + 1) {
        const fr = (ph !== prevPh) ? (0 - prevPh) / (ph - prevPh) : 0;
        rev.push((k + fr) * dt);
      }
      if (k % sampleEvery === 0) {
        const cx = (S.m[ci] * S.x[ci] + S.m[oi] * S.x[oi]) / MT, cy = (S.m[ci] * S.y[ci] + S.m[oi] * S.y[oi]) / MT;
        const cd = Math.hypot(cx - cm0x, cy - cm0y); if (cd > cmMax) cmMax = cd;
        if (S.hasNaN()) { nan = true; stop = 'nan'; break; }
      }
      if (rev.length >= orbMax) { stop = 'orbMax'; break; }
    } } catch (e) { err = String(e); stop = 'error'; }
    const tot1 = ledger(), e1 = eNewton(), osc1 = osc();
    const revP = []; for (let i = 0; i < rev.length; i++) revP.push(i ? rev[i] - rev[i - 1] : rev[0]);
    const heat = S.relDragHeat || 0;
    return {
      err, applied: { integrator: S.integrator, integration: S.relDrag ? (S.relDrag.integration || 'explicit') : null,
        kFrame: S.params.kFrame, softening: S.params.softening, massPrec: S.massPrec, spinPrec: S.spinPrec,
        hasRelativeDrag: !!S.hasRelativeDrag, kappa: S.relDrag ? S.relDrag.kappa : null,
        n: S.n, warnings: v.warnings },
      steps: k, stop, nan, dt,
      rev: revP, revN: revP.length,
      rMin, rMax, eProxy: (rMax + rMin > 0) ? (rMax - rMin) / (rMax + rMin) : null,
      osc0, osc1,
      spin0, spin1: [S.spin[ci], S.spin[oi]],
      spinChange: [S.spin[ci] - spin0[0], S.spin[oi] - spin0[1]],
      relDrag: { heat, pos: S.relDragPos || 0, kickMax: S.relDragKickMax || 0,
        torqueMax: S.relDragTorqueMax || 0, slipMax: S.relDragSlipMax || 0,
        resL: S.relDragResL || 0, n: S.relDragN || 0 },
      ledger: {
        Lrel: (tot0.L !== 0) ? Math.abs(tot1.L - tot0.L) / Math.abs(tot0.L) : null,
        Labs: tot1.L - tot0.L,
        Prel: (pScale0 > 0) ? Math.hypot(tot1.px - tot0.px, tot1.py - tot0.py) / pScale0 : null,
        Erel: (e0 !== 0) ? (e1 - e0) / Math.abs(e0) : null,
        EplusHeatRel: (e0 !== 0) ? (e1 + heat - e0) / Math.abs(e0) : null,
        cmMax },
      clamp: { V: S.clampVN, S: S.clampSN, H: S.clampHN, A: S.clampAN, R: S.clampRN, T: S.clampTN },
    };
  };
  // 第278便b(R53): **Buie 二体再現(転写・積分器の試験 —— 独立の検証ではない)**。
  // Buie 2012 の a と P から GM=4π²a³/P² を作り、🌨️ の診断コピーを**円軌道の二体**に置き直して P を測る。
  // 質量比は 2024 の GM 比のまま(ニュートン二体の相対運動の周期には効かない — geoPN=0 の行)。
  // geoPN=2 の行は同じ置き直しに 1PN を残したもの(1PN が足す量の記録)。ε の寄与は解析式で並べる。
  window.__w277b.buieTwoBody = (o) => {
    const src = HP.allPresets().find((q) => q.id === 'plutoCharonKF0Control');
    const p = JSON.parse(JSON.stringify(src));
    p.sampleClass = 'principle'; p.fidelity = 'toy'; delete p.notClaim; delete p.claims;
    const G = p.physics.G, a = o.aUnit, Pu = o.Punit;
    const GM = 4 * Math.PI * Math.PI * a * a * a / (Pu * Pu);
    const M = GM / G, q = o.ratio, m1 = M / (1 + q), m2 = M - m1;
    const eps = p.physics.softening, d2 = a * a + eps * eps;
    const w = Math.sqrt(GM / (d2 * Math.sqrt(d2)));     // Plummer 軟化の円軌道の角速度
    p.bodies[0].m = m1; p.bodies[1].m = m2;
    p.bodies[0].x = -(m2 / M) * a; p.bodies[1].x = (m1 / M) * a; p.bodies[0].y = 0; p.bodies[1].y = 0;
    p.bodies[0].vx = 0; p.bodies[1].vx = 0; p.bodies[0].vy = w * p.bodies[0].x; p.bodies[1].vy = w * p.bodies[1].x;
    p.bodies[0].spin = w; p.bodies[1].spin = w;
    if (o.geoPN !== undefined) p.physics.geoPN = o.geoPN;
    const v = HP.validatePreset(p);
    if (!v.ok) return { error: v.errors };
    HP.sim.build(v.preset);
    const S = HP.sim, ci = 0, oi = 1;
    const r0x = S.x[oi] - S.x[ci], r0y = S.y[oi] - S.y[ci];
    let phPrev = 0; const rev = []; let k = 0;
    const maxSteps = Math.ceil((o.orbits + 0.3) * Pu / o.dt);
    for (; k < maxSteps && rev.length < o.orbits; k++) {
      S.step(o.dt);
      const dx = S.x[oi] - S.x[ci], dy = S.y[oi] - S.y[ci];
      const ph = Math.atan2(r0x * dy - r0y * dx, r0x * dx + r0y * dy);
      if (phPrev < 0 && ph >= 0) rev.push((k + (0 - phPrev) / (ph - phPrev)) * o.dt);
      phPrev = ph;
    }
    const P = rev.map((t, i) => (i ? t - rev[i - 1] : t));
    return { GM, M, m1, m2, eps, geoPN: S.params.geoPN, integrator: S.integrator, dt: o.dt,
      revUnits: P, keplerSoftenedUnits: 2 * Math.PI / w, keplerUnits: Pu };
  };
  // 同一構成 2 回のビット同一
  window.__w277b.twice = (cfg, dt, steps) => {
    const fp = () => {
      const p = window.__w277b.make(cfg); const v = HP.validatePreset(p);
      HP.sim.build(v.preset); const S = HP.sim;
      for (let k = 0; k < steps; k++) S.step(dt);
      const o = [];
      for (let i = 0; i < S.n; i++) o.push(S.x[i], S.y[i], S.vx[i], S.vy[i], S.spin[i]);
      o.push(S.relDragHeat || 0);
      return JSON.stringify(o);
    };
    const a = fp(), b = fp();
    return { identical: a === b, len: a.length };
  };
  // エンジンの 1 步と純関数の 1 步の突き合わせ(器が node 側の値と比べる)
  window.__w277b.oneStepProbe = (id, dt) => {
    const p = window.__w277b.make({ id });
    const v = HP.validatePreset(p); HP.sim.build(v.preset);
    const S = HP.sim;
    const pr = HP.relativeDragProbe(S, 0, 1, dt);
    return { probe: pr, m: [S.m[0], S.m[1]], x: [S.x[0], S.x[1]], y: [S.y[0], S.y[1]],
      vx: [S.vx[0], S.vx[1]], vy: [S.vy[0], S.vy[1]], spin: [S.spin[0], S.spin[1]], R: [S.R[0], S.R[1]],
      eps: S.params.softening, G: S.params.G };
  };
  // 受理契約(massPrecision / softeningFloor / massFloorScaled)
  window.__w277b.accept = () => {
    const out = {};
    const base = () => JSON.parse(JSON.stringify(HP.allPresets().find((q) => q.id === 'plutoCharonDFM')));
    let p = base(); p.physics.massPrecision = 'quad';
    let v = HP.validatePreset(p);
    out.massPrecBadValue = { ok: v.ok, has: v.ok ? (v.preset.physics.massPrecision !== undefined) : null,
      warn: (v.warnings || []).filter((w) => /massPrecision/.test(w)) };
    p = base(); p.physics.massPrecision = 'single'; v = HP.validatePreset(p);
    out.massPrecSingleDropped = { ok: v.ok, has: v.ok ? (v.preset.physics.massPrecision !== undefined) : null,
      sigSame: v.ok ? (HP.presetSig(v.preset) === HP.presetSig(HP.validatePreset(
        (() => { const q = base(); delete q.physics.massPrecision; return q; })()).preset)) : null };
    // softeningFloor は calibration では拒否
    p = base(); p.physics.softeningFloor = 0.001; v = HP.validatePreset(p);
    out.softFloorRejectedInCalibration = { ok: v.ok, errors: (v.errors || []).slice(0, 2) };
    // principle クラスの診断コピーでは 0.001 まで下げられる
    p = base(); p.sampleClass = 'principle'; p.fidelity = 'toy'; delete p.notClaim; delete p.claims;
    p.physics.softeningFloor = 0.001; p.physics.softening = 0.001;
    v = HP.validatePreset(p);
    out.softFloorAcceptedInDiag = { ok: v.ok, applied: v.ok ? v.preset.physics.softening : null,
      declared: v.ok ? v.preset.physics.softeningFloor : null, warnings: (v.warnings || []).slice(0, 3),
      inSig: v.ok ? /softeningFloor/.test(HP.presetSig(v.preset)) : null };
    // 下限より下は値域へ丸める
    p = base(); p.sampleClass = 'principle'; p.fidelity = 'toy'; delete p.notClaim; delete p.claims;
    p.physics.softeningFloor = 1e-9; p.physics.softening = 1e-9;
    v = HP.validatePreset(p);
    out.softFloorClamped = { ok: v.ok, applied: v.ok ? v.preset.physics.softening : null,
      declared: v.ok ? v.preset.physics.softeningFloor : null, warnings: (v.warnings || []).slice(0, 3) };
    // 未宣言の本は従来どおり 0.01 でクランプ(内蔵の受理契約は不変)
    p = base(); p.physics.softening = 0.001; v = HP.validatePreset(p);
    out.softFloorDefaultClamp = { ok: v.ok, applied: v.ok ? v.preset.physics.softening : null,
      warnings: (v.warnings || []).filter((w) => /softening/.test(w)) };
    // massFloorScaled は表示専用(適用値は変わらない)
    p = base(); p.physics.massFloorScaled = true; v = HP.validatePreset(p);
    out.massFloorScaled = { ok: v.ok, declared: v.ok ? v.preset.physics.massFloorScaled : null,
      massFloorApplied: v.ok ? v.preset.physics.massFloor : null,
      inSig: v.ok ? /massFloorScaled/.test(HP.presetSig(v.preset)) : null };
    // relativeDrag の受理契約
    const rd = [];
    for (const cand of [null, { law: 'pairSlip', kappa: 1 }, { law: 'pairSlip', kappa: 0 },
      { law: 'other', kappa: 1 }, { law: 'pairSlip', kappa: 2 }, { law: 'pairSlip', kappa: 1, pairs: [[0, 1]] },
      { law: 'pairSlip', kappa: 1, pairs: [] }, { law: 'pairSlip', kappa: 1, spins: 'measured' }]) {
      const q = base(); if (cand === null) delete q.physics.relativeDrag; else q.physics.relativeDrag = cand;
      const w = HP.validatePreset(q);
      rd.push({ input: cand, ok: w.ok, out: w.ok ? (w.preset.physics.relativeDrag || null) : null,
        err: (w.errors || [])[0] || null });
    }
    out.relativeDrag = rd;
    // 2D 射影は html の純関数と lib で同じ式
    out.projection = HP.orbitPlaneProject(
      [-1.123218444101707e+04 - 1.370860133507983e+03, -8.995444528122283e+03 - 1.097857913042653e+03,
        9.897987186425396e+03 - (-1.208110104842008e+03)],
      [7.078521538859640e-02 - (-8.639354888307112e-03), 9.032347757027705e-02 - (-1.102398237662285e-02),
        1.623640495333425e-01 - (-1.981641679170623e-02)]);
    return out;
  };
}

// ================================================================ main
const results = { columns: {}, series: {}, accept: null, declared: {}, twice: {}, oneStep: null };
if (want('C') || want('D')) {
  await openPage();
  for (const id of ['plutoCharonDFM', 'plutoCharonKF0Control']) {
    results.declared[id] = await page.evaluate((z) => window.__w277b.declared(z), id);
  }
  results.accept = await page.evaluate(() => window.__w277b.accept());
  // 1 步の突き合わせ(エンジンの読み口 vs 純関数)
  const os = await page.evaluate((z) => window.__w277b.oneStepProbe(z.id, z.dt), { id: 'plutoCharonDFM', dt: 0.16 });
  {
    const s2 = { m: os.m.slice(), x: os.x.slice(), y: os.y.slice(), vx: os.vx.slice(), vy: os.vy.slice(),
      spin: os.spin.slice(), R: os.R.slice() };
    // 第278便b: ⛄ は中点法を宣言したので、突き合わせる純関数も中点法(lib-w278b-midpoint)にする
    const r2 = (os.probe && os.probe.integration === 'midpoint')
      ? pairSlipMidpointStep(s2, { dt: 0.16, kappa: 1, eps: os.eps, G: os.G })
      : pairSlipStep(s2, { dt: 0.16, kappa: 1, eps: os.eps, G: os.G });
    results.oneStep = { engineProbe: os.probe, libStep: r2,
      kickMatch: Math.abs(os.probe.kickMag - r2.kickMax) / Math.max(1e-300, Math.abs(r2.kickMax)),
      slipMatch: Math.abs(Math.max(os.probe.slipI, os.probe.slipJ) - r2.slipMax)
        / Math.max(1e-300, Math.abs(r2.slipMax)) };
  }
  // §C 本測定
  const P_UNITS = ELEM_2024.Charon.periodSec / SEC_PER_UNIT;
  for (const id of ['plutoCharonDFM', 'plutoCharonKF0Control']) {
    results.columns[id] = {};
    for (const sname of STAGE_LIST) {
      const dt = STAGES[sname].dt;
      const orbMax = PILOT ? 1 : ORB_MAX;
      const maxSteps = Math.ceil((orbMax + 0.2) * P_UNITS / dt);
      const r = await page.evaluate((z) => window.__w277b.run(z.cfg, z.dt, z.maxSteps, z.orbMax),
        { cfg: { id }, dt, maxSteps, orbMax });
      const judgeUnits = (r.rev && r.rev.length >= 2) ? r.rev[1] : (r.rev && r.rev[0]);
      const sec = Number.isFinite(judgeUnits) ? judgeUnits * SEC_PER_UNIT : NaN;
      r.stage = sname;
      r.periodSec = sec; r.revSec = (r.rev || []).map((z) => z * SEC_PER_UNIT);
      r.diffSec = sec - OBS.value; r.nSigma = sigOf(sec); r.pct = pctOf(sec);
      r.gate = gateWord(r.nSigma);
      r.almanac = almanacOf(sec); r.observation = observationOf(sec);
      r.vsPlu060Sec = sec - ELEM_2024.Charon.periodSec;
      r.vsHorizonsPRSec = sec - HORIZONS_PR.epochA.periodSec;
      results.columns[id][sname] = r;
    }
    results.twice[id] = await page.evaluate((z) => window.__w277b.twice(z.cfg, z.dt, z.steps),
      { cfg: { id }, dt: 0.16, steps: 4000 });
  }
  // **1 次 Richardson 外挿**(刻みを半分にする段なので P* = 2P(h/2) − P(h))。
  // 同じ外挿を 2 組(h→h2 と h2→h4)で作り、**一致するかどうか**をそのまま書く。
  results.richardson = {};
  for (const id of Object.keys(results.columns)) {
    const C = results.columns[id];
    const p = (s2) => (C[s2] && Number.isFinite(C[s2].periodSec)) ? C[s2].periodSec : NaN;
    const e1 = 2 * p('h2') - p('h'), e2 = 2 * p('h4') - p('h2');
    const use = Number.isFinite(e2) ? e2 : e1;
    results.richardson[id] = { stages: { h: p('h'), h2: p('h2'), h4: p('h4') },
      extrapFromH: e1, extrapFromH2: e2, agreeSec: e2 - e1, periodSec: use,
      diffSec: use - OBS.value, nSigma: sigOf(use), gate: gateWord(sigOf(use)),
      almanac: almanacOf(use), observation: observationOf(use),
      vsPlu060Sec: use - ELEM_2024.Charon.periodSec, vsHorizonsPRSec: use - HORIZONS_PR.epochA.periodSec,
      note: '**1 次外挿**であって観測との一致ではない。観測検定欄の状態語は「判定保留(量定義不一致)」(第278便b)' };
  }
  {
    const a = results.richardson.plutoCharonDFM, b = results.richardson.plutoCharonKF0Control;
    if (a && b && Number.isFinite(a.periodSec) && Number.isFinite(b.periodSec))
      results.lawContributionExtrapolated = { dfmSec: a.periodSec, controlSec: b.periodSec,
        diffSec: a.periodSec - b.periodSec, diffSigma: (a.periodSec - b.periodSec) / OBS.sigma,
        note: '**dt→0 での則の寄与**(3 段の 1 次外挿どうしの差)。生の dt=0.16 の差は下の h 行にある' };
  }
  // 則の寄与(同じ段どうしの差)
  results.lawContribution = {};
  for (const sname of STAGE_LIST) {
    const a = (results.columns.plutoCharonDFM || {})[sname], b = (results.columns.plutoCharonKF0Control || {})[sname];
    if (!a || !b || !Number.isFinite(a.periodSec) || !Number.isFinite(b.periodSec)) continue;
    results.lawContribution[sname] = { dfmSec: a.periodSec, controlSec: b.periodSec,
      diffSec: a.periodSec - b.periodSec, diffSigma: (a.periodSec - b.periodSec) / OBS.sigma,
      dfmSpinChange: a.spinChange, controlSpinChange: b.spinChange,
      dfmHeat: a.relDrag.heat, dfmKickMax: a.relDrag.kickMax, dfmSlipMax: a.relDrag.slipMax,
      dEcc: a.osc1.e - b.osc1.e, dA: a.osc1.a - b.osc1.a };
  }
  // 第278便b(R53): Buie 二体再現(転写・積分器の試験)
  results.buieTwoBody = { note: '**転写・積分器の試験であって独立の検証ではない** —— Buie 2012 の a と P から '
      + 'GM=4π²a³/P² を作り、その GM で二体を回して同じ P が出るかを見る(出るのは作り方から当然で、'
      + '外れた量が転写・積分器・軟化・1PN の誤差の上限になる)。**Buie の a と PLU060 の GM を混ぜない**'
      + '(質量比だけ 2024 の GM 比を使う —— ニュートン二体の相対周期には効かない)', rows: [] };
  for (const geoPN of [0, 2]) for (const sname of STAGE_LIST) {
    const dt = STAGES[sname].dt;
    const b = await page.evaluate((z) => window.__w277b.buieTwoBody(z), { aUnit: BUIE_2012.aKm / PRECISE_UNITS.kmPerUnit,
      Punit: BUIE_2012.periodSec / SEC_PER_UNIT, ratio: st.massRatio, geoPN, dt, orbits: 2 });
    const secs = (b.revUnits || []).map((z) => z * SEC_PER_UNIT);
    const p2 = secs.length >= 2 ? secs[1] : NaN;
    results.buieTwoBody.rows.push({ geoPN, stage: sname, dt, periodSec: p2, revSec: secs,
      vsBuieSec: p2 - BUIE_2012.periodSec, keplerSoftenedSec: b.keplerSoftenedUnits * SEC_PER_UNIT,
      vsSoftenedSec: p2 - b.keplerSoftenedUnits * SEC_PER_UNIT,
      softeningShiftSec: (b.keplerSoftenedUnits - b.keplerUnits) * SEC_PER_UNIT,
      GMunit: b.GM, integrator: b.integrator, error: b.error || null });
  }
  // §D 追加系列
  if (want('D') && !PILOT) {
    const dt = STAGES.h.dt, orbMax = 2;
    const maxSteps = Math.ceil((orbMax + 0.2) * P_UNITS / dt);
    const seriesRun = async (tag, cfg) => {
      const r = await page.evaluate((z) => window.__w277b.run(z.cfg, z.dt, z.maxSteps, z.orbMax),
        { cfg, dt, maxSteps, orbMax });
      const u = (r.rev && r.rev.length >= 2) ? r.rev[1] : (r.rev && r.rev[0]);
      const sec = Number.isFinite(u) ? u * SEC_PER_UNIT : NaN;
      return Object.assign({ tag, cfg }, { periodSec: sec, diffSec: sec - OBS.value, nSigma: sigOf(sec),
        gate: gateWord(sigOf(sec)), applied: r.applied, relDrag: r.relDrag, ledger: r.ledger,
        spinChange: r.spinChange, osc1: r.osc1, stop: r.stop, nan: r.nan, clamp: r.clamp });
    };
    results.series.eps = [];
    for (const eKm of [1, 2.5, 5, 10]) {
      results.series.eps.push(await seriesRun('eps=' + eKm + 'km',
        { id: 'plutoCharonDFM', softening: eKm / PRECISE_UNITS.kmPerUnit * 1 }));
    }
    results.series.spin = [];
    for (const z of [{ t: '0.9Ω', spinScale: 0.9 }, { t: '1.1Ω', spinScale: 1.1 },
      { t: 'spin_i=0', spin0: true }, { t: '反転', spinScale: -1 }]) {
      const cfg = Object.assign({ id: 'plutoCharonDFM' }, z); delete cfg.t;
      results.series.spin.push(await seriesRun('spin ' + z.t, cfg));
    }
    results.series.massPrecision = [];
    for (const mp of ['single', 'double'])
      results.series.massPrecision.push(await seriesRun('massPrecision=' + mp, { id: 'plutoCharonDFM', massPrecision: mp }));
    results.series.kappa = [];
    for (const kp of [0, 0.1, 1])
      results.series.kappa.push(await seriesRun('kappa=' + kp, { id: 'plutoCharonDFM', kappa: kp }));
    // (iv) 小衛星 4 体の診断コピー
    const U = PRECISE_UNITS;
    const moonBodies = (useKS) => {
      const E = HORIZONS_STATE.epochA;
      const rel = (b) => ({ r: [E[b].r[0] - E.Pluto.r[0], E[b].r[1] - E.Pluto.r[1], E[b].r[2] - E.Pluto.r[2]],
        v: [E[b].v[0] - E.Pluto.v[0], E[b].v[1] - E.Pluto.v[1], E[b].v[2] - E.Pluto.v[2]] });
      // 冥王星–カロンの面の基底で射影する(**同じ回転**を全天体へ当てる)
      const base = projectToOrbitPlane(
        [E.Charon.r[0] - E.Pluto.r[0], E.Charon.r[1] - E.Pluto.r[1], E.Charon.r[2] - E.Pluto.r[2]],
        [E.Charon.v[0] - E.Pluto.v[0], E.Charon.v[1] - E.Pluto.v[1], E.Charon.v[2] - E.Pluto.v[2]]);
      const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
      const gm = { Nix: GM_2024.Nix.value, Hydra: GM_2024.Hydra.value,
        Kerberos: useKS ? GM_2015.Kerberos.value : 0, Styx: useKS ? GM_2015.Styx.upper : 0 };
      const out = [], oop = {};
      for (const nm of ['Nix', 'Hydra', 'Kerberos', 'Styx']) {
        const q = rel(nm);
        const x = dot3(q.r, base.basis.e1) / U.kmPerUnit, y = dot3(q.r, base.basis.e2) / U.kmPerUnit;
        const vx = dot3(q.v, base.basis.e1) / U.kmsPerUnit, vy = dot3(q.v, base.basis.e2) / U.kmsPerUnit;
        oop[nm] = { outRkm: dot3(q.r, base.basis.e3), outVkms: dot3(q.v, base.basis.e3) };
        const m = gm[nm] ? massFromGM(gm[nm]) / U.kgPerUnit : 1e-6;
        out.push({ body: { type: 'single', m, radius: 0.5, x, y, vx, vy, spin: 0, pinned: false }, name: nm, m });
      }
      return { bodies: out.map((z) => z.body), oop, masses: out.map((z) => ({ name: z.name, m: z.m })) };
    };
    results.series.smallMoons = [];
    for (const useKS of [false, true]) {
      const mb = moonBodies(useKS);
      // **則は主対 (0,1) だけに当てる**(下の pairs:"all" が発散する否定対照になる)
      const r = await seriesRun('smallMoons(Kerberos/Styx=' + (useKS ? '2015 値' : '0') + ')・pairs=[[0,1]]',
        { id: 'plutoCharonDFM', addBodies: mb.bodies, diagClass: true, pairs: [[0, 1]] });
      r.outOfPlane = mb.oop; r.moonMasses = mb.masses;
      results.series.smallMoons.push(r);
    }
    // **否定対照(記録として残す)**: pairs:"all" で試験粒子級の小衛星まで則の反トルクを受けると、
    // I=½mR² が小さすぎて自転が暴走し、すべりが正帰還する。**「全対に当てる」を既定にしない**根拠。
    {
      const mb = moonBodies(false);
      const r = await seriesRun('smallMoons・pairs="all"(**否定対照** — 試験粒子の I が小さく自転が暴走)',
        { id: 'plutoCharonDFM', addBodies: mb.bodies, diagClass: true, integration: 'explicit' });
      r.negativeControl = true;
      r.note = '第278便b: 中点法は単一対に限るので、この否定対照は**陽的経路**のまま回す(第277便b と同じ条件)';
      results.series.smallMoons.push(r);
    }
  }
  await browser.close();
}

// §E 要因表 v2(同一解の入力で置き直したもの — **感度表であって判定ではない**)
const factors2 = (() => {
  const rows = [];
  const base = inputs.osculating.periodSec;
  const kep = (G, M, a) => 2 * Math.PI * Math.sqrt(a * a * a / (G * M)) * SEC_PER_UNIT;
  const M0 = st.mPluto + st.mCharon, a0 = oscA.a;
  const push = (factor, kind, sec, adopt) => rows.push({ factor, kind, periodSec: sec,
    dSec: sec - base, dSigma: (sec - base) / OBS.sigma, adopt });
  push('同一解の接触要素(元期 A・2 体)', 'baseline', base, '本サンプルの入力(採る)');
  push('Table 10 の平均 a=19595.764km', 'input', kep(G_MODEL, M0, ELEM_2024.Charon.aKm / PRECISE_UNITS.kmPerUnit),
    '採らない(元期の状態と別の量 — 暦の再現欄で並べる)');
  push('GM を 1σ 上へ(Pluto +0.4)', 'input',
    kep(G_MODEL, (massFromGM(GM_2024.Pluto.value + GM_2024.Pluto.sigma) + massFromGM(GM_2024.Charon.value)) / PRECISE_UNITS.kgPerUnit, a0),
    '採らない(共分散が未公表 — 独立近似で伝播しない)');
  push('GM を 1σ 下へ(Pluto −0.4)', 'input',
    kep(G_MODEL, (massFromGM(GM_2024.Pluto.value - GM_2024.Pluto.sigma) + massFromGM(GM_2024.Charon.value)) / PRECISE_UNITS.kgPerUnit, a0),
    '採らない(同上)');
  push('2015 解の GM(対照)', 'control',
    kep(G_MODEL, (massFromGM(GM_2015.Pluto.value) + massFromGM(GM_2015.Charon.value)) / PRECISE_UNITS.kgPerUnit, a0),
    '採らない(**2015 と 2024 を混ぜない** — 対照行である)');
  push('G を CODATA 6.67430 へ', 'input', kep(6.67430, M0 * 6.674 / 6.67430, a0),
    '採らない(GM を固定したまま G を動かすと質量が動く — AL23: G は変えない)');
  return { note: '**感度表であって判定ではない。** 残差がゼロになる a・f・ε を探索して採用していない。',
    baselineSec: base, obs: OBS, rows };
})();

const meta = withProvenance({
  harness: HARNESS_VERSION, libVersion: CHARON_DFM_VERSION,
  wave: '第278便b', pilot: PILOT, stages: STAGE_LIST, orbMax: ORB_MAX,
  doNotWrite: ['較正完了', '観測一致', '較正した', 'kF0 版が成立した'],
  gateRule: '⛄🌨️ の観測検定欄は門を掛けない —— 状態語「判定保留(量定義不一致)」+ 比較値(差・σ 倍)。'
    + '暦の再現欄は σ なし(合否を出さない)',
  obs: OBS,
}, { root: ROOT, wave: '第278便b', target: TARGET,
  code: ['tests/exp-w277b-charondfm.mjs', 'tests/lib-w277b-charondfm.mjs', 'tests/lib-w278b-midpoint.mjs'],
  inputs: [TARGET] });

// 第278便b: 旧版(w277b-charondfm-1)の値を history に残す(**消さない** —— 陽的 semi の履歴値)
let history = null;
try {
  const old = JSON.parse(fs.readFileSync(OUT, 'utf8'));
  if (old && old.meta && old.meta.harness === 'w277b-charondfm-1') {
    const oc = (old.engine || {}).columns || {};
    const pick = (id) => { const c = oc[id] || {}; const o2 = {};
      for (const k of Object.keys(c)) o2[k] = { periodSec: c[k].periodSec, revSec: c[k].revSec, diffSec: c[k].diffSec,
        nSigma: c[k].nSigma, gateAtThatTime: c[k].gate, dt: c[k].dt, ledger: c[k].ledger };
      return o2; };
    history = { w277b: { harness: old.meta.harness, targetSha256: old.meta.targetSha256, codeSha256: old.meta.codeSha256,
      configuration: '⛄ semi(既定)+ 陽的インパルス・🌨️ semi(既定)—— 第277便b の構成',
      columns: { plutoCharonDFM: pick('plutoCharonDFM'), plutoCharonKF0Control: pick('plutoCharonKF0Control') },
      richardson: (old.engine || {}).richardson || null, lawContributionExtrapolated: (old.engine || {}).lawContributionExtrapolated || null,
      lawContribution: (old.engine || {}).lawContribution || null,
      note: '当時の器は角度の足し込みで周を数えていた(第278便b で位相の直接判定へ変更)。当時の「門」の語は記録として残す' } };
  } else if (old && old.history) history = old.history;
} catch { history = null; }

// 第278便b(R53・AM16): 2 欄の要約(dt=0.04・第 2 周 —— 過渡を含む値であることは charonwin-w278b.json の時間窓が示す)
const twoColumns = (() => {
  const C = results.columns || {};
  const one = (id) => { const r = (C[id] || {}).h4 || (C[id] || {}).h; if (!r) return null;
    return { stage: r.stage, dt: r.dt, periodSec: r.periodSec, almanac: r.almanac, observation: r.observation }; };
  return { definition: { almanac: '欄 (1) 暦の再現 —— 入力も目標も PLU060。σ は無い(表示桁・400 年の散らばりは σ ではない)ので'
      + '合否を出さず、差を s と ppm で記帳する',
    observation: '欄 (2) 観測検定 —— 判定行は Buie 2012 二体 P。⛄🌨️ は (1) の入力に (2) の門を掛けていた(量定義の不一致)ので、'
      + '状態語は「判定保留(量定義不一致)」、差と σ 倍は比較値(門ではない)。4 値の母集団外なので 0/2/2/33 は動かない',
    buieTwoBody: 'Buie 二体再現は転写・積分器の試験であって独立の検証ではない' },
    plutoCharonDFM: one('plutoCharonDFM'), plutoCharonKF0Control: one('plutoCharonKF0Control'),
    buieTwoBody: (results.buieTwoBody || {}).rows || null };
})();

const out = { meta, inputs, history, twoColumns, law: { rows: lawRows, zero, nsControl,
  version: 'pairSlip(κ χ μ ν dt・ν=√(G(m_i+m_j)/d³)・χ_ij=W_j/(W_j+W₀))',
  note: '**統括が設定した検証仮説**であって現行 DFM から一意に導出された法則ではない' },
  factors2, engine: results, pageErrors };

fs.mkdirSync(path.dirname(OUT), { recursive: true });
Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));   // 第281便a: 領域 hash の 3 欄 + JSON 入力の安定 hash
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log('wrote', path.relative(ROOT, OUT), 'sha256', sha(fs.readFileSync(OUT)).slice(0, 16));
for (const id of Object.keys(results.columns || {})) {
  for (const sname of Object.keys(results.columns[id])) {
    const r = results.columns[id][sname];
    console.log(id, sname, 'P=' + (Number.isFinite(r.periodSec) ? r.periodSec.toFixed(4) : 'NaN'),
      'd=' + (Number.isFinite(r.diffSec) ? r.diffSec.toFixed(4) : '-'),
      'σ=' + (Number.isFinite(r.nSigma) ? r.nSigma.toFixed(2) : '-'), r.gate,
      'stop=' + r.stop, 'heat=' + (r.relDrag ? r.relDrag.heat : 0));
  }
}
console.log('lawContribution', JSON.stringify(results.lawContribution || {}, null, 1));
