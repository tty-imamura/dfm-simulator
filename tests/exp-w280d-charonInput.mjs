// 第280便d(原仮定者の裁定(第70報)「plutoCharonReal: 観測値版で問題が出ている理由を調査する/
//   plutoCharonDFM・plutoCharonKF0Control: まとめても良い。plutoCharonReal の精度を目標にする。
//   互いに潮汐ロックで引きずりが消えると、観測値版と変わらない想定」・統括の検証項目 R68)—
// **❄️ の否(+7.62 s・294σ)の要因の再計測・入力を整えた二体・同一定義の表・零条件の 3 検査**を測る器。
//
// ■ しないこと(先に書く)
//   ・**❄️⛄🌨️ の物理・入力は 1 bit も変えない**(本器は診断コピーを器の中で組んで走らせるだけ)。
//   ・**残差がゼロになる ε・a・GM・κ を探索しない**。「観測一致」「較正した」「解決」「精度を上げれば成立」
//     は書かない。**合否は門(3σ)が出す** —— 本器の σ 倍は**比較値**であって門ではない。
//   ・Buie 2012 の a と PLU060 の GM を**混ぜた行**は「定義の混在」の物差しとしてだけ走らせる(候補にしない)。
//
// ■ 測るもの(**抽出器と窓は正式判定と同じ** —— 同方向 1 周の第 2 周・足し込みの抽出器 (A)。
//   (A) は `tests/lib-w273b-charonpage.mjs` の `run` と同じ式で、❄️ kF0 の h 段は正本
//   `tests/out/calaudit-w249.json` の 551864.0613632939 s を 1 bit 再現する —— 器が自分で照合して記録する)
//   §A 閉じた式の監査(定義の混在の大きさ・Buie の a・P が含意する GM)
//   §B ❄️ kF0 の要因(1 要因ずつ・dt 0.016/0.008/0.004〔=1.6/0.8/0.4 s〕・第 2 周)と、
//      「入力の丸め → 軟化 → 質量の精度 → 積分器」の**順に足した鎖**(残るのが定義の混在)
//   §C 入力を整えた二体(精密単位・ε=1 km・double・kF0)× 入力の組 4 通り × 3 刻み × 6 周
//   §D 同一定義の 1 表(入力 3 種 + ❄️ + ⛄ —— 第 2 周・第 5 周・Buie との差 [s]・[σ_Buie])
//   §E 零条件の 3 検査: (a) 厳密同期円 (b) 実入力(元期 A)ですべりが残る由来 (c) 座標移送 meshVelocity
//
// 実行:
//   PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright node tests/exp-w280d-charonInput.mjs
//       [--only A,B,C,D,E] [--pilot]
// 出力: tests/out/charoninput-w280d.json(来歴 meta は tests/lib-w272e-provenance.mjs 版 w272e-1)
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { withProvenance } from './lib-w272e-provenance.mjs';
import { BUIE_2012, ELEM_2024, HORIZONS_PR, GM_2024 } from './lib-w277b-charondfm.mjs';
import { unitChangeSpec, ACCEPT_LIMITS, epsFloorMeters } from './lib-w276b-units.mjs';
import { SMALL_MOONS, moonStateSim, sunLadder, fitPowerLaw } from './lib-w276b-charonfactors.mjs';
import { CHARON_INPUT_VERSION, OLD_INPUT, TARGETS, definitionMixAudit, oldUnitsPair, diagInputPair,
  syncZeroPair, periodShiftFromSpinTransfer, installW280dPage, keplerPeriodSec } from './lib-w280d-charoninput.mjs';
// 第281便a(原仮定者の裁定(第71報)・AN16・統括の検証項目 R71): **この器が読む html の領域**の宣言。
//   `tests/lib-w281a-scope.mjs` がこの領域だけの hash(`scopeSha256`)を正本の meta に刻む。
//   `lint.provenanceMeta` ② は「targetSha256 一致 **または**(scopeComplete かつ scopeSha256 が今の html で
//   引き直した値と一致)」で通す。`lint.regenScope` が「宣言 ⊇ 器のコードから機械で引いた下限
//   (HP.*・html の最上位名・内蔵プリセット id)」を照合する。**1 行の JSON**(lint が読む)。
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
const REGEN_SCOPE = {"presets":["plutoCharonDFM","plutoCharonDiagInput","plutoCharonKF0Control","plutoCharonReal","plutoCharonSyncZero"],"roots":["$","HP.allPresets","HP.dfmRelativeDragStep","HP.relativeDragProbe","HP.sim","HP.validatePreset","SCALE_DIMS","T","applyQLock","ch","clamp","ctx","cv","dfmRelativeDragStep","isNum","validatePreset"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);   // 第281便a: 走行開始時の html の領域
const INDEX = 'file://' + path.join(ROOT, TARGET);
const OUT = path.join(ROOT, 'tests', 'out', 'charoninput-w280d.json');
const CALAUDIT = path.join(ROOT, 'tests', 'out', 'calaudit-w249.json');
const HARNESS_VERSION = 'w280d-charoninput-1';

const argv = process.argv.slice(2);
const getArg = (k, d) => { const i = argv.indexOf(k); return (i >= 0 && argv[i + 1]) ? argv[i + 1] : d; };
const ONLY = (getArg('--only', '') || '').split(',').map((z) => z.trim()).filter(Boolean);
const want = (s) => !ONLY.length || ONLY.includes(s);
const PILOT = argv.includes('--pilot');
const OUT_PATH = getArg('--out', PILOT ? OUT.replace('.json', '-pilot.json') : OUT);
const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');

// ---- 契約(走らせる前に固定した) ------------------------------------------------
const OLD_STAGES = { h: 0.016, h2: 0.008, h4: 0.004 };        // ❄️ の単位(10² s)— 正式の 3 段
const PREC_STAGES = { h: 0.16, h2: 0.08, h4: 0.04 };          // 精密単位(10 s)— 同じ物理刻み 1.6/0.8/0.4 s
const STAGE_KEYS = PILOT ? ['h'] : ['h', 'h2', 'h4'];
const OBS = { value: BUIE_2012.periodSec, sigma: BUIE_2012.sigmaSec, source: BUIE_2012.source };
const sig = (s) => (Number.isFinite(s) ? (s - OBS.value) / OBS.sigma : null);
const DIAG_SCALE = { L: 5, T: 2, M: 20 }, OLD_SCALE = OLD_INPUT.scale;
const SPEC_DIAG = unitChangeSpec(OLD_SCALE, DIAG_SCALE);
const EPS_DIAG = 0.5;                                         // 診断単位の 50 km(第276便b と同じ)
// 正式の値(照合用 —— 正本から読む。手で打ち直さない)
let FORMAL = null;
try {
  const ca = JSON.parse(fs.readFileSync(CALAUDIT, 'utf8'));
  const pc = ca.presets.find((p) => p.id === 'plutoCharonReal');
  const row = pc.quantities.find((q) => q.kind === 'period' && q.version === 'obs');
  FORMAL = { from: 'tests/out/calaudit-w249.json', sha256: sha(fs.readFileSync(CALAUDIT)), row: row.name,
    h: row.dtStages.dt, h2: row.dtStages.dtHalf, h4: row.dtStages.dtQuarter, gate: row.gate.status,
    nSigma: row.gate.nSigma, residual: row.gate.residual };
} catch (e) { FORMAL = { error: String(e) }; }

// ================================================================ ブラウザ(1 本)
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
await page.evaluate(installW280dPage);
const hasPreset = await page.evaluate(() => ({
  diag: HP.allPresets().some((q) => q.id === 'plutoCharonDiagInput'),
  sync: HP.allPresets().some((q) => q.id === 'plutoCharonSyncZero') }));

const T0 = Date.now();
const runs = {};
async function run(tag, cfg, dt, orbits, opt) {
  const t0 = Date.now();
  const r = await page.evaluate((z) => window.__w280d.run(z.cfg, z.dt, z.orb, z.opt), { cfg, dt, orb: orbits, opt: opt || null });
  r.wallMs = Date.now() - t0; r.tag = tag;
  runs[tag] = r;
  const p2 = (r.periodsA || [])[1];
  console.log(tag.padEnd(34), 'dt', String(dt).padEnd(6), 'P2A', Number.isFinite(p2) ? p2.toFixed(6) : '—',
    'stop', r.stop, (r.err || (r.errors ? JSON.stringify(r.errors).slice(0, 120) : '')), r.wallMs + 'ms');
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH + '.partial', JSON.stringify({ runs: Object.keys(runs) }));
  return r;
}
const p2A = (r) => (r && r.periodsA && r.periodsA.length >= 2) ? r.periodsA[1] : NaN;
const pkA = (r, k) => (r && r.periodsA && r.periodsA.length >= k) ? r.periodsA[k - 1] : NaN;
const pkB = (r, k) => (r && r.periodsB && r.periodsB.length >= k) ? r.periodsB[k - 1] : NaN;

// ================================================================ §A 閉じた式
const audit = definitionMixAudit();

// ================================================================ §B ❄️ kF0 の要因
const factors = { rows: [], chain: [], note: null };
const snowBodies = await page.evaluate(() => window.__w280d.state({ id: 'plutoCharonReal' }));
if (want('B')) {
  const mP = snowBodies.m[0], mC = snowBodies.m[1];
  const base = { id: 'plutoCharonReal', kFrame: 0 };
  const diag = Object.assign({}, base, { diag: true });
  const pairB = (o) => { const q = oldUnitsPair(o); return q.bodies.map((b) => ({ x: b.x, y: b.y, vx: b.vx, vy: b.vy, m: b.m })); };
  // 宣言の質量(Float32 へ入る前の宣言値)で組む。**内蔵の bodies の宣言値そのもの**を使う
  const declared = await page.evaluate(() => { const p = HP.allPresets().find((q) => q.id === 'plutoCharonReal');
    return p.bodies.map((b) => ({ m: b.m, x: b.x, vx: b.vx, vy: b.vy })); });
  const dm = { mP: declared[0].m, mC: declared[1].m };
  const defs = [
    { key: 'base', label: '❄️ kF0(正式判定の構成 —— 内蔵の kFrame=1 を 0 にした診断コピー)', cfg: base, kind: 'baseline' },
    { key: 'baseDiagClass', label: '同上を principle へ落としただけ(物理は同じはず — 照合)', cfg: diag, kind: 'control' },
    { key: 'rebuilt', label: '同じ入力を器の組み立て関数で組み直した(組み立ての丸めの照合)',
      cfg: Object.assign({}, diag, { bodies: pairB({ aKm: 19596, mP: dm.mP, mC: dm.mC }) }), kind: 'control' },
    { key: 'eps10', label: 'softening ε 50 → 10 km(宣言単位の受理下限)', cfg: Object.assign({}, diag, { softening: 0.01 }), kind: 'numerical' },
    { key: 'eps1', label: 'softening ε 50 → 1 km(softeningFloor 0.001 の診断宣言)',
      cfg: Object.assign({}, diag, { softening: 0.001, softeningFloor: 0.001 }), kind: 'numerical' },
    { key: 'aPlus', label: 'a の丸め +0.5 km(19596.5 km・ケプラー初速を組み直す)',
      cfg: Object.assign({}, diag, { bodies: pairB({ aKm: 19596.5, mP: dm.mP, mC: dm.mC }) }), kind: 'input', ref: 'rebuilt' },
    { key: 'aMinus', label: 'a の丸め −0.5 km(19595.5 km)',
      cfg: Object.assign({}, diag, { bodies: pairB({ aKm: 19595.5, mP: dm.mP, mC: dm.mC }) }), kind: 'input', ref: 'rebuilt' },
    { key: 'aPlu060', label: 'a を PLU060 400 年平均 19595.764 km へ(質量は旧入力のまま)',
      cfg: Object.assign({}, diag, { bodies: pairB({ aKm: ELEM_2024.Charon.aKm, mP: dm.mP, mC: dm.mC }) }), kind: 'input', ref: 'rebuilt' },
    { key: 'gCodata', label: 'G の丸め 6.674 → 6.67430(質量は転写のまま・初速を組み直す)',
      cfg: Object.assign({}, diag, { G: 6.6743, bodies: pairB({ aKm: 19596, mP: dm.mP, mC: dm.mC, G: 6.6743 }) }), kind: 'input', ref: 'rebuilt' },
    { key: 'gmDirect', label: 'GM を観測解から直接作る(2024 Table 8: 869.3+106.1 km³/s² → m=GM/G・初速を組み直す)',
      cfg: Object.assign({}, diag, { bodies: pairB({ aKm: 19596, gmP: GM_2024.Pluto.value, gmC: GM_2024.Charon.value }) }), kind: 'input', ref: 'rebuilt' },
    { key: 'massDouble', label: '質量配列 Float32 → double(massPrecision:"double")',
      cfg: Object.assign({}, diag, { massPrecision: 'double' }), kind: 'numerical' },
    { key: 'noPN', label: '1PN を切る(geoPN 2 → 0)', cfg: Object.assign({}, diag, { geoPN: 0 }), kind: 'physical' },
    { key: 'leapfrog', label: '積分器 semi → leapfrog', cfg: Object.assign({}, diag, { integrator: 'leapfrog' }), kind: 'numerical' },
  ];
  // 小衛星と太陽は第276便b と同じ診断単位(L5・T2・M20 —— massFloor に質量が持ち上げられない単位)
  const Gd = 6.674 * SPEC_DIAG.phys.G, mPd = mP * SPEC_DIAG.body.m, mCd = mC * SPEC_DIAG.body.m;
  const moons = SMALL_MOONS.map((mn, i) => moonStateSim(mn, i, Gd, mPd + mCd, DIAG_SCALE));
  const diagU = Object.assign({}, diag, { units: SPEC_DIAG, softeningAfterUnits: EPS_DIAG });
  defs.push({ key: 'satNone', label: '診断単位(L5・T2・M20)・小衛星なし(基準列)', cfg: diagU, kind: 'control' });
  defs.push({ key: 'satAll', label: '小衛星 4 体(円・同一平面・位相 i×1.1 rad —— 第276便b と同じ置き方)',
    cfg: Object.assign({}, diagU, { bodies: [{}, {}].concat(moons.map((z) => z.body)) }), kind: 'physical', ref: 'satNone' });
  const aDiag = Math.abs(declared[1].x - declared[0].x) * SPEC_DIAG.body.x;
  const lad = sunLadder({ G: Gd, mPair: mPd + mCd, a: aDiag, scale: DIAG_SCALE, limits: ACCEPT_LIMITS,
    epsFloorM: epsFloorMeters(DIAG_SCALE.L) });
  for (const pt of lad.points) defs.push({ key: 'sunX' + pt.X, label: '太陽の代理配置 X=' + pt.X,
    cfg: Object.assign({}, diagU, { bodies: [{}, {}, pt.body], shiftPair: pt.shiftPair }), kind: 'sunLadder', ref: 'satNone', X: pt.X });
  for (const d of defs) {
    const row = { key: d.key, label: d.label, kind: d.kind, ref: d.ref || 'base', X: d.X === undefined ? null : d.X, stages: {} };
    for (const s of STAGE_KEYS) {
      const r = await run('B.' + d.key + '.' + s, d.cfg, OLD_STAGES[s], 3);
      row.stages[s] = { p2: p2A(r), p3: pkA(r, 3), p2B: pkB(r, 2), stop: r.stop, err: r.err || r.errors || null,
        applied: r.applied, clamp: r.clamp, warnings: r.warnings };
    }
    factors.rows.push(row);
  }
  const byKey = Object.fromEntries(factors.rows.map((r) => [r.key, r]));
  for (const r of factors.rows) {
    const ref = byKey[r.ref];
    r.delta = {}; r.deltaSigma = {};
    for (const s of STAGE_KEYS) {
      const v = r.stages[s].p2, rv = ref ? ref.stages[s].p2 : NaN;
      r.delta[s] = (r.key === r.ref) ? 0 : v - rv; r.deltaSigma[s] = r.delta[s] / OBS.sigma;
    }
    r.residual = {}; for (const s of STAGE_KEYS) r.residual[s] = r.stages[s].p2 - OBS.value;
  }
  // 太陽: 代理配置の梯子のべきを真の X へ延ばす(第276便b と同じ方法・**外挿である**)
  const sunRows = factors.rows.filter((r) => r.kind === 'sunLadder');
  factors.sun = { trueX: lad.trueX, obstruction: lad.obstruction, byStage: {} };
  for (const s of STAGE_KEYS) {
    const good = sunRows.filter((r) => Number.isFinite(r.delta[s]) && r.delta[s] !== 0);
    const fit = good.length >= 2 ? fitPowerLaw(good.map((r) => r.X), good.map((r) => Math.abs(r.delta[s]))) : null;
    const dp = fit && Number.isFinite(fit.a) ? Math.sign(good[0].delta[s]) * fit.a * Math.pow(lad.trueX, fit.p) : null;
    factors.sun.byStage[s] = { fit, extrapolatedSec: dp, sigma: dp === null ? null : dp / OBS.sigma,
      note: '**外挿である**(真の配置は受理値域に入らない —— 第276便b)' };
  }
  // 照合: 正式の値を 1 bit 再現したか
  factors.formalCheck = {};
  for (const s of STAGE_KEYS) factors.formalCheck[s] = { formal: FORMAL[s], measured: byKey.base.stages[s].p2,
    bitSame: Object.is(FORMAL[s], byKey.base.stages[s].p2) };
  // ---- 鎖: 入力の丸め → 軟化 → 質量の精度 → 積分器(**この順に 1 つずつ足す**)
  const chainDefs = [
    { key: 'c0', step: '出発点 ❄️ kF0(旧入力: a=19596 km・質量×G=6.674・ε=50 km・Float32 質量・semi)', cfg: base },
    { key: 'c1', step: '① 入力の丸めを外す: a=19595.764 km(PLU060 400 年平均)・GM を 2024 Table 8 から直接(m=GM/G)',
      cfg: Object.assign({}, diag, { bodies: pairB({ aKm: ELEM_2024.Charon.aKm, gmP: GM_2024.Pluto.value, gmC: GM_2024.Charon.value }) }) },
    { key: 'c2', step: '② 軟化を外す: ε 50 → 1 km',
      cfg: Object.assign({}, diag, { softening: 0.001, softeningFloor: 0.001,
        bodies: pairB({ aKm: ELEM_2024.Charon.aKm, gmP: GM_2024.Pluto.value, gmC: GM_2024.Charon.value }) }) },
    { key: 'c3', step: '③ 質量配列を double へ', cfg: Object.assign({}, diag, { softening: 0.001, softeningFloor: 0.001, massPrecision: 'double',
        bodies: pairB({ aKm: ELEM_2024.Charon.aKm, gmP: GM_2024.Pluto.value, gmC: GM_2024.Charon.value }) }) },
    { key: 'c4', step: '④ 積分器を leapfrog へ(⛄🌨️ と同じ)', cfg: Object.assign({}, diag, { softening: 0.001, softeningFloor: 0.001, massPrecision: 'double',
        integrator: 'leapfrog', bodies: pairB({ aKm: ELEM_2024.Charon.aKm, gmP: GM_2024.Pluto.value, gmC: GM_2024.Charon.value }) }) },
  ];
  let prev = null;
  for (const c of chainDefs) {
    const row = { key: c.key, step: c.step, stages: {} };
    for (const s of STAGE_KEYS) {
      const r = (c.key === 'c0') ? runs['B.base.' + s] : await run('B.chain.' + c.key + '.' + s, c.cfg, OLD_STAGES[s], 3);
      row.stages[s] = { p2: p2A(r), resid: p2A(r) - OBS.value, sigma: sig(p2A(r)),
        step: prev ? p2A(r) - prev.stages[s].p2 : null };
    }
    factors.chain.push(row); prev = row;
  }
  factors.chainTail = {
    remaining: '鎖の終点(c4)の Buie 比の残差は、PLU060 の同じ解から作った二体(a=400 年平均・GM=Table 8)の周期と、'
      + 'Buie 2012 の二体当てはめ P との**定義の差**である —— 閉じた式(ε=0)で ' + audit.periods.pluAWithPluGM.minusBuie.toFixed(4)
      + ' s。Buie の a と P が含意する GM は ' + audit.gmBuieImplied.toFixed(4) + ' km³/s²(PLU060 の 975.4±0.5 と '
      + audit.gmGapKm3s2.toFixed(3) + ' km³/s²・' + audit.gmGapInPluSigma.toFixed(2) + 'σ_GM 違う)',
  };
}

// ================================================================ §C 入力を整えた二体
const cleaned = { variants: {}, presetCheck: null };
const ORB6 = PILOT ? 2 : 6;
if (want('C') || want('D')) {
  for (const kind of ['plu060Mean', 'buie', 'mixed', 'oldA']) {
    const dp = diagInputPair(kind);
    const cfg = { id: 'plutoCharonKF0Control', diag: true, bodies: dp.bodies };
    const row = { kind, aKm: dp.aKm, mP: dp.mP, mC: dp.mC, stages: {} };
    for (const s of STAGE_KEYS) {
      const r = await run('C.' + kind + '.' + s, cfg, PREC_STAGES[s], ORB6);
      row.stages[s] = { periodsA: r.periodsA, periodsB: r.periodsB, p2: pkA(r, 2), p5: pkA(r, 5), stop: r.stop,
        applied: r.applied, osc0: r.osc0 };
    }
    row.closedForm = keplerPeriodSec(dp.mP * 1e24 * 6.674e-11 / 1e9 + dp.mC * 1e24 * 6.674e-11 / 1e9, dp.aKm);
    cleaned.variants[kind] = row;
  }
  if (hasPreset.diag) {
    const r = await run('C.preset.h', { id: 'plutoCharonDiagInput' }, PREC_STAGES.h, 2);
    const ref = runs['C.plu060Mean.h'];
    cleaned.presetCheck = { presetP2: p2A(r), constructedP2: p2A(ref), finalBitSame: null,
      p2BitSame: Object.is(p2A(r), p2A(ref)), note: '内蔵 plutoCharonDiagInput と、器が 🌨️ の複製に同じ bodies を書いた構成の照合' };
  }
}

// ================================================================ §D 同一定義の 1 表
const sameDef = { rows: [], note: null };
if (want('D')) {
  const ctl = {}, dfm = {}, snow = {};
  for (const s of STAGE_KEYS) {
    ctl[s] = await run('D.ctl.' + s, { id: 'plutoCharonKF0Control' }, PREC_STAGES[s], ORB6);
    dfm[s] = await run('D.dfm.' + s, { id: 'plutoCharonDFM' }, PREC_STAGES[s], ORB6);
    snow[s] = await run('D.snow.' + s, { id: 'plutoCharonReal', kFrame: 0 }, OLD_STAGES[s], ORB6);
  }
  const mk = (id, label, input, byStage, law) => {
    const h4 = byStage[STAGE_KEYS[STAGE_KEYS.length - 1]];
    // 第 2 周は正式の抽出器 (A)(足し込み)。第 5 周は**第278便b の位相の直接判定 (B)** を使う —— (A) は累積角が
    // 大きくなると丸めが揃って段差を作る(⛄ の第 5 周で (A)−(B)=+6.6×10⁻⁵ s を本器でも実測した。第 2 周は 1 μs 以内)
    const p2 = pkA(h4, 2), p5 = pkB(h4, 5);
    return { id, label, input, law, stage: STAGE_KEYS[STAGE_KEYS.length - 1],
      p2, p5, p2B: pkB(h4, 2), p5A: pkA(h4, 5),
      p2Stages: Object.fromEntries(STAGE_KEYS.map((s) => [s, pkA(byStage[s], 2)])),
      p5Stages: Object.fromEntries(STAGE_KEYS.map((s) => [s, pkB(byStage[s], 5)])),
      buieSec2: p2 - OBS.value, buieSigma2: sig(p2), buieSec5: p5 - OBS.value, buieSigma5: sig(p5),
      plu060MeanSec2: p2 - TARGETS.plu060Mean.periodSec, plu060MeanSec5: p5 - TARGETS.plu060Mean.periodSec };
  };
  const cv = (k) => Object.fromEntries(STAGE_KEYS.map((s) => [s, runs['C.' + k + '.' + s]]));
  sameDef.rows.push(mk('buieTwoBody', 'Buie 2012 二体解(a=19573 km・GM=4π²a³/P²)', 'Buie 二体解', cv('buie'), 'kF0'));
  sameDef.rows.push(mk('plutoCharonDiagInput', '入力を整えた ❄️ の診断コピー(PLU060 の同じ解: a=19595.764 km・GM 2024)', 'PLU060 400 年平均', cv('plu060Mean'), 'kF0'));
  sameDef.rows.push(mk('plutoCharonKF0Control', '🌨️ kF0 対照(PLU060 元期 A の状態)', 'PLU060 元期 A の状態', ctl, 'kF0'));
  sameDef.rows.push(mk('plutoCharonDFM', '⛄ 相対すべりモデル(同じ状態 + pairSlip κ=1・中点法)', 'PLU060 元期 A の状態', dfm, 'pairSlip'));
  sameDef.rows.push(mk('plutoCharonReal', '❄️ 観測値版の kF0 診断コピー(旧入力・ε 50 km・semi)', '旧入力(NSSDC)', snow, 'kF0'));
  sameDef.rows.push(mk('mixedDefinition', '(物差し)Buie の a × 2024 の GM —— **候補ではない**', '混在', cv('mixed'), 'kF0'));
  const R = Object.fromEntries(sameDef.rows.map((r) => [r.id, r]));
  sameDef.gaps = {
    diagMinusCtl2: R.plutoCharonDiagInput.p2 - R.plutoCharonKF0Control.p2,
    diagMinusCtl5: R.plutoCharonDiagInput.p5 - R.plutoCharonKF0Control.p5,
    diagMinusDfm2: R.plutoCharonDiagInput.p2 - R.plutoCharonDFM.p2,
    diagMinusDfm5: R.plutoCharonDiagInput.p5 - R.plutoCharonDFM.p5,
    dfmMinusCtl2: R.plutoCharonDFM.p2 - R.plutoCharonKF0Control.p2,
    dfmMinusCtl5: R.plutoCharonDFM.p5 - R.plutoCharonKF0Control.p5,
    snowMinusDiag2: R.plutoCharonReal.p2 - R.plutoCharonDiagInput.p2,
    note: '「plutoCharonReal の精度を目標にする」を**同じ入力の定義・同じ抽出器(第 2 周・第 5 周)・同じ物理刻み 0.4 s**で比べた差'
      + '(門ではない)' };
  sameDef.note = '列はすべて同方向 1 周(第 2 周は抽出器 (A)・正式判定と同じ/第 5 周は (B) 位相の直接判定)。σ は Buie 2012 の 26 ms で割った**比較値**であって門ではない。'
    + '❄️ の行だけ単位が 10² s・積分器 semi(正式判定の構成)で、他は精密単位・leapfrog';
}

// ================================================================ §E 零条件の 3 検査
const zero = { a: {}, b: {}, c: {} };
if (want('E')) {
  const st = await page.evaluate(() => window.__w280d.state({ id: 'plutoCharonDFM' }));
  const aSep = st.x[1] - st.x[0];
  // (a) 厳密同期円 —— 速度 2 通り × 1PN 2 通り × 刻み 2 通り、各々 則あり/なし(対)
  const aDt = PILOT ? [0.16] : [0.16, 0.04];
  for (const geoPN of [0, 2]) for (const speed of ['kdk', 'softened']) for (const dt of aDt) {
    const zp = syncZeroPair({ mP: st.m[0], mC: st.m[1], a: aSep, eps: st.eps, dt: 0.16, speed });
    const bodies = zp.bodies.map((b) => ({ x: b.x, y: b.y, vx: b.vx, vy: b.vy, spin: b.spin }));
    const key = 'g' + geoPN + '.' + speed + '.dt' + dt;
    const on = await run('E.a.on.' + key, { id: 'plutoCharonDFM', diag: true, geoPN, bodies }, dt, 3);
    const off = await run('E.a.off.' + key, { id: 'plutoCharonDFM', diag: true, geoPN, bodies, relativeDrag: null }, dt, 3);
    const one = await page.evaluate((z) => window.__w280d.oneStep({ id: 'plutoCharonDFM', diag: true, geoPN: z.geoPN, bodies: z.bodies }, z.dt),
      { geoPN, bodies, dt });
    zero.a[key] = { geoPN, speed, dt, velocityBuiltForDt: 0.16, Omega: zp.Omega,
      firstStep: one,
      heat: on.relDrag.heat, heatNonZeroSteps: on.relDrag.heatNonZeroSteps, steps: on.steps, pos: on.relDrag.pos,
      kickMax: on.relDrag.kickMax, torqueMax: on.relDrag.torqueMax, slipMax: on.relDrag.slipMax,
      p2On: pkA(on, 2), p2Off: pkA(off, 2), dP2: pkA(on, 2) - pkA(off, 2), p3On: pkA(on, 3), p3Off: pkA(off, 3),
      finalBitSame: on.finalStateHex === off.finalStateHex, spinEnd: on.revInfo.length ? on.revInfo[on.revInfo.length - 1].spin : null,
      spin0: on.spin0, eOsc2: on.revInfo[1] ? on.revInfo[1].e : null };
  }
  if (hasPreset.sync) {
    const on = await run('E.a.preset.on', { id: 'plutoCharonSyncZero' }, 0.16, 3);
    const off = await run('E.a.preset.off', { id: 'plutoCharonSyncZero', relativeDrag: null }, 0.16, 3);
    const one = await page.evaluate(() => window.__w280d.oneStep({ id: 'plutoCharonSyncZero' }, 0.16));
    zero.a.preset = { firstStep: one, heat: on.relDrag.heat, heatNonZeroSteps: on.relDrag.heatNonZeroSteps, steps: on.steps,
      pos: on.relDrag.pos, kickMax: on.relDrag.kickMax, torqueMax: on.relDrag.torqueMax, slipMax: on.relDrag.slipMax,
      p2On: pkA(on, 2), p2Off: pkA(off, 2), dP2: pkA(on, 2) - pkA(off, 2), finalBitSame: on.finalStateHex === off.finalStateHex,
      applied: on.applied };
  }
  // (b) 実入力(元期 A): すべりが残る由来の分解 —— 自転の定義 3 通り + 円化、各々 則あり/なし
  const bDt = PILOT ? [0.16] : [0.16, 0.04];
  const r0x = aSep, vrel = { vx: st.vx[1] - st.vx[0], vy: st.vy[1] - st.vy[0] };
  const vt = vrel.vy, vr = vrel.vx;                         // 初期は x 軸上(y=0)なので v_t=v_y・v_r=v_x
  const G = st.G, M = st.m[0] + st.m[1];
  const oscA = (() => { const v2 = vt * vt + vr * vr, inv = 2 / r0x - v2 / (G * M); return 1 / inv; })();
  const nOsc = Math.sqrt(G * M / (oscA * oscA * oscA));
  const spinDefs = {
    declared: { label: '宣言のまま(PLU060 400 年平均の同期 ω=2π/551855.8944 s)', spin: st.spin[0] },
    instantaneous: { label: '瞬間同期 ω=v_t/r(元期 A の接線速度 / 離角)', spin: vt / r0x },
    osculatingMean: { label: '接触要素の平均運動 ω=n=√(GM/a³)(元期 A)', spin: nOsc },
  };
  const circ = syncZeroPair({ mP: st.m[0], mC: st.m[1], a: aSep, eps: st.eps, dt: 0.16, speed: 'kdk' });
  const variantsB = [];
  for (const [k, d] of Object.entries(spinDefs)) variantsB.push({ key: k, label: d.label,
    bodies: [{ spin: d.spin }, { spin: d.spin }] });
  variantsB.push({ key: 'circularized', label: '円化(v_r=0・v_t=離散相対平衡)+ 瞬間同期(= 零条件)',
    bodies: circ.bodies.map((b) => ({ x: b.x, y: b.y, vx: b.vx, vy: b.vy, spin: b.spin })) });
  const IP = 0.5 * st.m[0] * st.R[0] * st.R[0], IC = 0.5 * st.m[1] * st.R[1] * st.R[1];
  const mu = st.m[0] * st.m[1] / M;
  for (const v of variantsB) for (const dt of bDt) {
    const key = v.key + '.dt' + dt;
    const on = await run('E.b.on.' + key, { id: 'plutoCharonDFM', bodies: v.bodies }, dt, ORB6);
    const off = await run('E.b.off.' + key, { id: 'plutoCharonDFM', bodies: v.bodies, relativeDrag: null }, dt, ORB6);
    const last = on.revInfo[on.revInfo.length - 1] || null;
    const est = last ? periodShiftFromSpinTransfer({ IP, IC, dOmegaP: last.spin[0] - on.spin0[0], dOmegaC: last.spin[1] - on.spin0[1],
      Lorb: mu * Math.sqrt(G * M * oscA), Psec: pkA(off, 2) }) : null;
    zero.b[key] = { label: v.label, dt, slip0: on.slip0, osc0: on.osc0, spin0: on.spin0,
      delta: [1, 2, 3, 4, 5, 6].map((k2) => pkA(on, k2) - pkA(off, k2)),
      pOn: on.periodsA, pOff: off.periodsA, heat: on.relDrag.heat, pos: on.relDrag.pos,
      spinEnd: last ? last.spin : null, eEnd: last ? last.e : null, slipEnd: last ? last.slip : null,
      estimateFromSpinTransfer: est };
  }
  zero.b.inputs = { aSepUnits: aSep, vt, vr, oscA, nOsc, omegaDeclared: st.spin[0], IP, IC, mu,
    spinMismatchRel: (st.spin[0] - vt / r0x) / (vt / r0x), spinMismatchVsNRel: (st.spin[0] - nOsc) / nOsc };
  // (c) 座標移送(meshVelocity・kFrame=0 専用)を 🌨️ の入力に載せる
  const frame = { origin: 'barycenter', epoch: 'JD2452600.5', rotation: 'none', translation: 'comoving' };
  // 遠い第 3 体(外部の点源)。質量は受理下限の 1e-9(massFloor も 1e-9 へ下げる —— 対の 2 体は床より 6 桁以上重いので
  // 床の変更は対に効かない)。第 3 体の重力(潮汐)が相対軌道へ入る分を小さくして、座標移送だけを見るため
  const third = { m: 1e-9, radius: 0.1, x: -4000, y: 0, vx: 0, vy: 0.01, spin: 0 };
  // 遠い第 3 体を置くと、第 3 体の重力(潮汐)の幾何が ON/OFF で変わる(ON では対が u=v_S で第 3 体と一緒に動く)。
  // その分を分けるため、OFF 側に「対へ一様な速度 v_S を足した(ガリレイ変換した)」対照を置き、1PN を切った組も並べる
  const boost = (b, g) => [{ vy: 0 }, { vy: 0 }].map((z, i) => ({ vy: b[i].vy + g }));
  const pairV = [{ vy: st.vy[0] }, { vy: st.vy[1] }];
  const cDefs = [
    { key: 'm0Third', label: 'mutual:0・外部 = 遠い第 3 体(40 万 km・0.01 単位=100 m/s で動く・質量 1e-9 単位=10¹⁵ kg)',
      on: { meshVelocity: { law: 'vMinusU', field: 'explicit', mutual: 0, frame, external: ['body:2'] }, bodies: [{}, {}, third] },
      offs: { plain: { bodies: [{}, {}, third] },
        boosted: { bodies: boost(pairV, third.vy).concat([third]) } } },
    { key: 'm0ThirdNoPN', label: '同上・1PN を切る(geoPN 0 —— 1PN が慣性速度 v を読む分を除く)',
      on: { geoPN: 0, meshVelocity: { law: 'vMinusU', field: 'explicit', mutual: 0, frame, external: ['body:2'] }, bodies: [{}, {}, third] },
      offs: { plain: { geoPN: 0, bodies: [{}, {}, third] },
        boosted: { geoPN: 0, bodies: boost(pairV, third.vy).concat([third]) } } },
    { key: 'm0Charon', label: 'mutual:0・外部 = カロン(冥王星だけが v_カロン で移される)',
      on: { meshVelocity: { law: 'vMinusU', field: 'explicit', mutual: 0, frame, external: ['body:1'] } }, offs: { plain: {} } },
    { key: 'm1Third', label: 'mutual:1・外部 = 遠い第 3 体(相手を含む合成 —— 相対作用の引きずりの全強度)',
      on: { meshVelocity: { law: 'vMinusU', field: 'explicit', mutual: 1, frame, external: ['body:2'] }, bodies: [{}, {}, third] },
      offs: { plain: { bodies: [{}, {}, third] } } },
    { key: 'm1Charon', label: 'mutual:1・外部 = カロン(2 体だけ)',
      on: { meshVelocity: { law: 'vMinusU', field: 'explicit', mutual: 1, frame, external: ['body:1'] } }, offs: { plain: {} } },
    { key: 'm0ThirdDfm', label: 'mutual:0・外部 = 遠い第 3 体 + ⛄ の pairSlip(座標移送と散逸の併用 —— 別口座)',
      base: 'plutoCharonDFM',
      on: { meshVelocity: { law: 'vMinusU', field: 'explicit', mutual: 0, frame, external: ['body:2'] }, bodies: [{}, {}, third],
        relativeDrag: { law: 'pairSlip', kappa: 1, pairs: [[0, 1]], spins: 'declared', integration: 'midpoint' } },
      offs: { boosted: { bodies: boost(pairV, third.vy).concat([third]),
        relativeDrag: { law: 'pairSlip', kappa: 1, pairs: [[0, 1]], spins: 'declared', integration: 'midpoint' } } } },
  ];
  const P_UNITS = 55188.66;
  for (const c of cDefs) {
    const dt = 0.16, id = c.base || 'plutoCharonKF0Control';
    const on = await run('E.c.on.' + c.key, Object.assign({ id, diag: true, massFloor: 1e-9 }, c.on), dt, 3,
      { maxSteps: Math.ceil(3.3 * P_UNITS / dt), traceEvery: 20000 });
    const row = { label: c.label, dt, applied: on.applied, stop: on.stop, err: on.err || on.errors || null,
      p2On: pkA(on, 2), p3On: pkA(on, 3), revsOn: (on.periodsA || []).length, meshVel: on.meshVel, osc0On: on.osc0,
      trace: (on.trace || []).filter((z, i) => i % 5 === 0).map((z) => ({ step: z[0], r: z[1], e: z[2], vr: z[3] })),
      rRange: on.trace && on.trace.length ? [Math.min(...on.trace.map((z) => z[1])), Math.max(...on.trace.map((z) => z[1]))] : null,
      offs: {} };
    for (const [ok, oc] of Object.entries(c.offs)) {
      const off = await run('E.c.off.' + c.key + '.' + ok, Object.assign({ id, diag: true, massFloor: 1e-9 }, oc), dt, 3);
      row.offs[ok] = { p2: pkA(off, 2), p3: pkA(off, 3), dP2: pkA(on, 2) - pkA(off, 2), dP3: pkA(on, 3) - pkA(off, 3) };
    }
    zero.c[c.key] = row;
  }
}

// ================================================================ 書き出し
const meta = withProvenance({
  wave: '第280便d', harness: HARNESS_VERSION, libVersion: CHARON_INPUT_VERSION, pilot: PILOT,
  ruling: '原仮定者の裁定(第70報): plutoCharonReal: 観測値版で問題が出ている理由を調査する / plutoCharonDFM・'
    + 'plutoCharonKF0Control: まとめても良い。plutoCharonReal の精度を目標にする。互いに潮汐ロックで引きずりが消えると、'
    + '観測値版と変わらない想定',
  contract: { extractor: '同方向 1 周・足し込み (A)(tests/lib-w273b-charonpage.mjs の run と同じ式)・第 2 周が正式判定の値',
    oldStages: OLD_STAGES, precStages: PREC_STAGES, stages: STAGE_KEYS,
    note: '窓(第 2 周)と抽出器は正式判定と同じ。第 5 周は第278便b の「過渡を含む」への対応で並べる(正式の置換ではない)' },
  observation: OBS, formal: FORMAL, hasPreset,
  doNotWrite: ['観測一致', '較正した', '較正を完了', 'kF0 版が成立した', '精度を上げれば成立', '引きずり消失を確認した'],
  wallSec: (Date.now() - T0) / 1000,
}, { root: ROOT, wave: '第280便d', target: TARGET,
  code: ['tests/exp-w280d-charonInput.mjs', 'tests/lib-w280d-charoninput.mjs', 'tests/lib-w277b-charondfm.mjs',
    'tests/lib-w276b-units.mjs', 'tests/lib-w276b-charonfactors.mjs', 'tests/lib-w272e-provenance.mjs'],
  inputs: [TARGET, 'tests/out/calaudit-w249.json'] });
const out = { meta, audit, factors, cleaned, sameDef, zero, pageErrors,
  runsSummary: Object.fromEntries(Object.entries(runs).map(([k, r]) => [k, { dt: r.dt, steps: r.steps, stop: r.stop,
    periodsA: r.periodsA, periodsB: r.periodsB, err: r.err || r.errors || null, wallMs: r.wallMs }])) };
fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));   // 第281便a: 領域 hash の 3 欄 + JSON 入力の安定 hash
fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 1));
try { fs.unlinkSync(OUT_PATH + '.partial'); } catch { /* 無ければよい */ }
console.log('wrote', path.relative(ROOT, OUT_PATH), 'sha256', sha(fs.readFileSync(OUT_PATH)).slice(0, 16), 'wall', meta.wallSec, 's');
await browser.close();
