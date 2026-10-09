// 第297便a(原仮定者の裁定(第87報)「光学と力学を分ける。λ_PN は力学の作用なので、geoPN=2 の引きずり減衰 q・geoPN=3 の慣性決定力の
// 引きずり gain(geoPN=4 も)と重ねない。geoPN=2・3・4 のサンプルは全て λ_PN=0。修正したサンプルは再フィットする」・統括の検証項目 R161)
// —— **λ_PN=0 にした本の再測定と再フィット**の器(純 Node・ブラウザ不要 —— html の inline script を主コンテキストで読む
// `tests/lib-w280b-emgrid.mjs` の `loadHtmlMain`/`runRow`)。
//
// ■ 何をするか
//   内蔵の geoPN≥2 の本(宣言から列挙する —— 手書きの名簿を持たない)のうち、λ_PN=0 で軌道が変わる本について、
//   「第296便までの宣言(λ_PN=旧値 —— 下の LAMBDA_BEFORE)」と「現行の宣言(λ_PN=0)」を同じ抽出器・同じ窓・同じ刻みで並べ、
//   その本が以前合わせていた量(説明・claims・obsCard・parameterAudit に書いてある標的)を測る。λ=0 で標的から外れた本は、
//   **その本が既に持つ調整ノブだけ**で合わせ直す(新しいノブを足さない)。刻みは h と h/2 で数値誤差を見る。
//   届かなかった本は「この探索範囲では未達 —— 次の見直し(実装・初期条件・調整範囲)へ」と記録する(成功を作らない)。
//
// ■ 段(part)
//   em      🌘 earthMoonRealKF1: 恒星月(同方向 1 周の平均)と 8 公転窓の近点回転の周期(検出器 B)。ノブ D0pull と初速の係数 f
//   qlock   📶📐 qLockRadialAudit(Q3): 参照プローブの引きずり近点移動 Δϖ_drag(kFrame=1 − kFrame=0 の同一構成差分)
//   galaxy  💫 galaxyGeo2: 外縁帯 [156,286] の回転の増強 kF1/kF0(claim galaxygeo2.outer-boost-ratio の手続き —— 12000 步)と機構の内訳
//   geotoy  🔁🌒 mercuryGeoToy3 / charonGeoToy3: 零試験(pn:off の旧メッシュと geoPN=2・λ_PN=0 の対照の近点移動の差)
//   retired 退役の geoPN=2(15 本): λ=0 前後の近点移動・周期(1 本あたりの計算を区切る)
//
// ■ 使い方
//   node tests/exp-w297a-refit.mjs [--part em,qlock,...]            → 正本 tests/out/refit-w297a.json(段 refit-297a)
//   W297A_OUT=<json> で出力先を変える(器の試走は正本を書かない)。W297A_PART=<part,...> で段を絞る(既存の正本の他の段を残して上書き)。
//   W297A_TARGET=<html>(既定 beta/index.html)
//   並走: 段ごとに W297A_OUT=<写し> node tests/exp-w297a-refit.mjs --part <段> を別の process で走らせ、node tests/exp-w297a-refit.mjs --merge <写し,…> で正本にまとめる
//   (写しの targetSha256 がいまの html と違えば止める)
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain, runRow, fitPeri } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
// 第281便a の領域 hash の宣言(再生成の鎖が「この器の正本を走らせ直すか」を引く)—— 読む本は宣言から列挙するので presets は全本
const REGEN_SCOPE = {"presets":"all","roots":["HP.FIT_RECORD_VERSION","HP.FIT_RECORD_VERSIONS","HP.abStart","HP.abStop","HP.ab","HP.allPresets","HP.dfmMeshVelocityFieldAt","HP.geoModeOf","HP.loadPreset","HP.sim","HP.validateFitRecord","HP.validatePreset","isNum","sim"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.W297A_TARGET || 'beta/index.html';
const OUT = process.env.W297A_OUT || path.join(ROOT, 'tests', 'out', 'refit-w297a.json');
const argOf = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const PARTS = String(argOf('--part') || process.env.W297A_PART || 'em,emfit,qlock,galaxy,geotoy,retired').split(',').filter(Boolean);
export const REFIT_W297A_VERSION = 'w297a-refit-1';
/** 本器が書く fitRecord の形の版(targets[].tol・cond を持たない形 —— 第296便b の w296b-1)。 */
export const FIT_RECORD_VERSION_FORM = 'w296b-1';

// 第296便までの宣言の λ_PN(履歴 —— 基点 8f380ee の physics.lambdaPN)。🪶🪃🪀 は massCalibration の 1/f(第249便a の処方 —— 第297便a で撤回)。
// それ以外の 35 本は 1。**走る正本は 0**(本の宣言)—— この表は「前」の行を作るためだけに読む
const LAMBDA_BEFORE_PN = { psrDoubleABPN: 0.5000144330801174, psrJ1757PN: 0.5000260856666837, psrJ1946PN: 0.5000086177580901 };
const lambdaBefore = (id) => (Object.prototype.hasOwnProperty.call(LAMBDA_BEFORE_PN, id) ? LAMBDA_BEFORE_PN[id] : 1);

const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
const targetSha256 = crypto.createHash('sha256').update(fs.readFileSync(html)).digest('hex');
const { HP } = loadHtmlMain(html);
const BUILTIN = vm.runInThisContext('BUILTIN_PRESETS');
const clone = (o) => JSON.parse(JSON.stringify(o));
const presetOf = (id) => { const p = BUILTIN.find((q) => q.id === id); if (!p) throw new Error('no preset ' + id); return clone(p); };
const withPhys = (p, patch) => { const q = clone(p); q.physics = Object.assign({}, q.physics, patch); return q; };
const t0All = Date.now();
const log = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a);

// 第296便までの旧メッシュの 1PN の宣言(履歴 —— 🔁🌒 は spaceMesh.pn:"reference-1PN"・pnVelocity:"v")。第297便a から pn:"off"
const MESH_PN_BEFORE = { mercuryGeoToy3: { pn: 'reference-1PN', pnVelocity: 'v' }, charonGeoToy3: { pn: 'reference-1PN', pnVelocity: 'v' } };
const physBefore = (p) => { const ph = Object.assign({}, p.physics, { lambdaPN: lambdaBefore(p.id) });
  if (MESH_PN_BEFORE[p.id]) ph.spaceMesh = Object.assign({}, ph.spaceMesh, MESH_PN_BEFORE[p.id]); return ph; };
// 宣言から列挙: geoPN≥2 の内蔵(λ_PN=0 の対象)。pn1Before = 第296便までの宣言で力学の 1PN が走っていたか(経路フラグ ∧ 係数≠0 —— geoModeOf の pn1Active)
// = λ_PN=0 で軌道が変わる本(器の外の bitsame 600 步の差分 ID と同じ集合になるはず —— 第297便a の枝で 21 本を確認)
const DECL = BUILTIN.filter((p) => ((p.physics || {}).geoPN || 0) >= 2).map((p) => ({ id: p.id, emoji: p.emoji, geoPN: p.physics.geoPN,
  lambdaPN: p.physics.lambdaPN, lambdaBefore: lambdaBefore(p.id), retired: p.familyRole === 'retired', kFrame: p.physics.kFrame,
  pn1Before: HP.geoModeOf(physBefore(p)).pn1Active === true, pn1Now: HP.geoModeOf(p.physics).pn1Active === true, law: HP.geoModeOf(p.physics).law }));

// ---------------------------------------------------------------------------------------------------------------
// em —— 🌘(1 単位 = 10⁶ m / 10² s / 10²⁵ kg)。恒星月 = 同方向 1 周の平均・近点回転 = 検出器 B の 8 公転窓の直線 fit
const EM_ID = 'earthMoonRealKF1', EM_TARGET = { siderealMonthDays: 27.3217, apsidalPeriodYr: 8.85 };
function emRun(p, dt, revMax = 9) {
  const r = runRow(HP, p, { ci: 0, oi: 1, dt, revMax, windows: [8], maxSteps: 4e7 });
  const w = r.windows[0];
  return { dt, steps: r.steps, sidMeanDays: r.sidMeanDays, apsPeriodYr: w.B ? w.B.apsPeriodYr : null,
    slopeDegPerPeri: w.B ? w.B.slopeDegPerPeri : null, nPeri: w.B ? w.B.nPeri : null, nan: !!r.nan };
}
// 初速の係数 f(地球と月の速度を同じ倍率で —— 宣言の bodies は f=0.99880 を焼き込んだ値なので、ここでは「現行の値に掛ける比 s」で動かす)
function emScaled(p, s, d0pull) {
  const q = clone(p);
  for (const b of q.bodies) { b.vx *= s; b.vy *= s; }
  if (d0pull !== undefined) q.physics.D0pull = d0pull;
  return q;
}
async function partEm() {
  const base = presetOf(EM_ID);
  const rows = [];
  for (const [lam, dt] of [[lambdaBefore(EM_ID), 0.016], [0, 0.016], [0, 0.008]]) {
    const t = Date.now(); const r = emRun(withPhys(base, { lambdaPN: lam }), dt);
    rows.push(Object.assign({ lambdaPN: lam, wallSec: (Date.now() - t) / 1000 }, r));
    log('em', lam, dt, r.sidMeanDays, r.apsPeriodYr);
  }
  const before = rows[0], after = rows[1], half = rows[2];
  // 第296便までの宣言そのもの(D0pull 3.24204e-5・f 0.99880・λ_PN=1 —— EM_HISTORY)を同じ抽出器・同じ窓で(本の速度は f を焼き込んだ値なので比で戻す)
  const fBook = Number(((base.fitRecord && base.fitRecord.knobs) || []).find((k) => /初速|bodies/.test(k.key))?.final ?? EM_HISTORY.f);
  { const t = Date.now(); const r = emRun(withPhys(emScaled(base, EM_HISTORY.f / fBook, EM_HISTORY.D0pull), { lambdaPN: EM_HISTORY.lambdaPN }), 0.016);
    rows.push(Object.assign({ lambdaPN: EM_HISTORY.lambdaPN, history: true, D0pull: EM_HISTORY.D0pull, f: EM_HISTORY.f, wallSec: (Date.now() - t) / 1000 }, r));
    log('em history', r.sidMeanDays, r.apsPeriodYr); }
  const res = { id: EM_ID, target: EM_TARGET, knobs: ['physics.D0pull', 'bodies[*].v (初速の係数 f)'], rows,
    lambdaEffect: { sidMeanDays: after.sidMeanDays - before.sidMeanDays, apsPeriodYr: after.apsPeriodYr - before.apsPeriodYr },
    numerics: { h2SidMeanDays: half.sidMeanDays - after.sidMeanDays, h2ApsPeriodYr: half.apsPeriodYr - after.apsPeriodYr } };
  return res;
}

// 🌘 の再フィット(段 emfit): λ_PN=0 の宣言のまま、**既存のノブ 2 つ**(physics.D0pull と初速の係数 f)だけで、恒星月 27.3217 日と
// 8 公転窓の近点回転 8.85 年(検出器 B —— 第280便b の emgrid と同じ抽出器・同じ窓)に合わせる。2×2 の Newton(差分のヤコビアン → Broyden 更新)。
// 刻み h=0.016 で解き、採用値(D0pull 6 桁・f 9 桁に丸めた値)を h と h/2=0.008 で測り直して残差と数値誤差を記録する。
// 止める条件 EM_TOL: 2 つの標的の相対残差の最大が 2×10⁻⁵ 以下(検出器 B の 8 近点の直線 fit は、ノブを 10⁻⁵ 動かしても周期が ±5×10⁻⁵ 程度
// 揺れる —— 第297便a の枝の実測。これより細かい許容は追えない)。本の値が既に満たしていれば反復しない(採用値 = 本の値)
const EM_RANGE = { D0pull: [1e-5, 1e-4], f: [0.998, 1.0] };
const EM_TOL = 2e-5;
const EM_HISTORY = { wave: '第120便〜第296便', D0pull: 3.24204e-5, f: 0.99880, lambdaPN: 1, note: '旧フィット(exp-kf1b の窓・λ_PN=1)の値 —— 宣言の bodies は f=0.99880 を焼き込んだ速度' };
const round = (x, sig) => Number(x.toPrecision(sig));
async function partEmFit() {
  const base = presetOf(EM_ID);
  const fBook = Number(((base.fitRecord && base.fitRecord.knobs) || []).find((k) => /初速|bodies/.test(k.key))?.final ?? EM_HISTORY.f);
  const d0 = base.physics.D0pull;
  const T = EM_TARGET;
  const evals = [];
  // x = {D0pull, f}: 本の速度(f=fBook を焼き込んだ値)に f/fBook を掛ける
  const presetAt = (x) => emScaled(base, x.f / fBook, x.D0pull);
  const F = (x, dt = 0.016) => {
    const t = Date.now(); const r = emRun(presetAt(x), dt);
    const e = { D0pull: x.D0pull, f: x.f, dt, sidMeanDays: r.sidMeanDays, apsPeriodYr: r.apsPeriodYr, steps: r.steps, nan: r.nan, wallSec: (Date.now() - t) / 1000,
      rel: [r.sidMeanDays / T.siderealMonthDays - 1, r.apsPeriodYr / T.apsidalPeriodYr - 1] };
    evals.push(e); log('emfit', JSON.stringify(e));
    return e.rel;
  };
  const mx = (v) => Math.max(Math.abs(v[0]), Math.abs(v[1]));
  let x = { D0pull: d0, f: fBook };
  let fx = F(x);
  let it = 0;
  if (mx(fx) > EM_TOL) {
    const hD = 0.02 * x.D0pull, hF = 2e-5;
    const fD = F({ D0pull: x.D0pull + hD, f: x.f }), fF = F({ D0pull: x.D0pull, f: x.f + hF });
    const J = [[(fD[0] - fx[0]) / hD, (fF[0] - fx[0]) / hF], [(fD[1] - fx[1]) / hD, (fF[1] - fx[1]) / hF]];
    const clampX = (z) => ({ D0pull: Math.min(EM_RANGE.D0pull[1], Math.max(EM_RANGE.D0pull[0], z.D0pull)), f: Math.min(EM_RANGE.f[1], Math.max(EM_RANGE.f[0], z.f)) });
    while (it < 8 && mx(fx) > EM_TOL) {
      const det = J[0][0] * J[1][1] - J[0][1] * J[1][0];
      const dx = [-(J[1][1] * fx[0] - J[0][1] * fx[1]) / det, -(-J[1][0] * fx[0] + J[0][0] * fx[1]) / det];
      const xn = clampX({ D0pull: x.D0pull + dx[0], f: x.f + dx[1] });
      const fn = F(xn);
      const sx = [xn.D0pull - x.D0pull, xn.f - x.f], df = [fn[0] - fx[0], fn[1] - fx[1]];
      const ss = sx[0] * sx[0] + sx[1] * sx[1];
      if (ss > 0) for (let i = 0; i < 2; i++) { const Js = J[i][0] * sx[0] + J[i][1] * sx[1]; for (let j = 0; j < 2; j++) J[i][j] += (df[i] - Js) * sx[j] / ss; }
      x = xn; fx = fn; it++;
    }
  }
  // 採用値(丸め)を h と h/2 で測り直す
  const adoptedX = (it === 0) ? { D0pull: d0, f: fBook } : { D0pull: round(x.D0pull, 6), f: round(x.f, 9) };
  const pA = presetAt(adoptedX);
  const hRow = F(adoptedX, 0.016), eh = evals[evals.length - 1];
  F(adoptedX, 0.008); const eh2 = evals[evals.length - 1];
  const h2 = Math.max(Math.abs(eh2.sidMeanDays / eh.sidMeanDays - 1), Math.abs(eh2.apsPeriodYr / eh.apsPeriodYr - 1));
  const resid = mx(hRow);
  const status = resid <= h2 ? 'fitted' : 'unreachable-in-bounds';
  const adopted = { D0pull: adoptedX.D0pull, f: adoptedX.f, bodies: pA.bodies.map((b) => ({ vx: b.vx, vy: b.vy })),
    sidMeanDays: eh.sidMeanDays, apsPeriodYr: eh.apsPeriodYr, rel: hRow, half: { dt: 0.008, sidMeanDays: eh2.sidMeanDays, apsPeriodYr: eh2.apsPeriodYr } };
  // 第297便(統合 —— 枝 b の記録の版 w297b-1 は targets[].tol と cond〔条件の署名〕を要る): 本器が書く記録は w296b-1 の形(tol・cond を持たない)で、
  //   🌘 の本の fitRecord も w296b-1(旧版の記録として受理される)—— 版は形に合わせて w296b-1 で書く(受理器が w296b-1 を読めない世代だけ受理器の現行版)
  const fitRecord = {
    version: (Array.isArray(HP.FIT_RECORD_VERSIONS) && HP.FIT_RECORD_VERSIONS.indexOf(FIT_RECORD_VERSION_FORM) >= 0) ? FIT_RECORD_VERSION_FORM : HP.FIT_RECORD_VERSION, parent: EM_ID, law: 'geoPN=2・kFrame=1・λ_PN=0(第297便a —— 力学の 1PN を q の引きずりと重ねない)・qLock・frameWeight:"pull"',
    targets: [
      { q: '恒星月(同方向 1 周の平均)', obs: T.siderealMonthDays, unit: 'd', source: '恒星月 27.3217 日(本の parameterAudit の観測値)', window: '同方向 1〜9 周(8 公転窓)' },
      { q: '近点回転の周期(検出器 B・近点方位の時刻に対する直線 fit)', obs: T.apsidalPeriodYr, unit: 'yr', source: '月の近点回転 8.85 年(本の parameterAudit の観測値)', window: '最初の 8 公転(第280便b の emgrid と同じ窓と抽出器)' }],
    knobs: [{ key: 'physics.D0pull', range: EM_RANGE.D0pull.slice(), final: adoptedX.D0pull },
      { key: 'bodies[*].v(初速の係数 f —— 地球と月の速度に同じ倍率)', range: EM_RANGE.f.slice(), final: adoptedX.f }],
    fixed: ['G・質量・半径・自転・離角(🌙 と同じ観測入力)', 'D0=0.006(E1′)', 'q=8.2358(qLock の厳密一致式)', 'kFrame=1・geoPN=2・λ_PN=0', 'frameWeight:"pull"', 'softening 0.1・stateCarry:"double"'],
    procedure: '2×2 Newton(差分のヤコビアン → Broyden 更新・器 tests/exp-w297a-refit.mjs の段 emfit)。止める条件は 2 つの相対残差の最大 ≤ ' + EM_TOL + '。採用値は D0pull 6 桁・f 9 桁に丸めて h と h/2 で測り直した',
    dt: 0.016, steps: eh.steps,
    residual: { value: resid, unit: '相対(2 つの標的の最大)', rel: resid },
    numerics: { h2, dtHalf: 0.008 },
    status,
    notFitted: ['27 公転窓の近点回転(窓を延ばすと定常ではない —— 第135便・第280便b)', '近点間の周期(近点間は観測の恒星月に対応しない)', '機構(実際の主因は太陽摂動 —— 機構の同定ではない)'] };
  const vr = HP.validateFitRecord(fitRecord);
  return { id: EM_ID, target: T, ranges: EM_RANGE, tol: EM_TOL, history: EM_HISTORY, start: { D0pull: d0, f: fBook }, iterations: it, evals,
    adopted, numerics: { h2Rel: h2 }, residualRel: resid, status, fitRecord: vr.ok ? vr.fitRecord : fitRecord, fitRecordAccepted: vr.ok, fitRecordErr: vr.ok ? null : vr.err };
}

// ---------------------------------------------------------------------------------------------------------------
// galaxy —— 💫 galaxyGeo2: claim galaxygeo2.outer-boost-ratio と同じ手続き(外縁帯 [156,286] の平均 vφ・kFrame=1 の本と kFrame=0 の写し・
// 12000 步〔c₀=30 の本は 6000×2〕・dt=0.016)。h/2 は dt=0.008 で同じ時刻まで(24000 步)。機構の内訳 mechSpec(true).pi は kFrame=1 側
const GAL_ID = 'galaxyGeo2';
function galOuter(S) { let sum = 0, c = 0;
  for (let i = 1; i < S.n; i++) { const rr = Math.hypot(S.x[i], S.y[i]);
    if (rr >= 156 && rr <= 286) { sum += (S.x[i] * S.vy[i] - S.y[i] * S.vx[i]) / rr; c++; } }
  return c ? sum / c : 0; }
// claim の手続きそのもの(HP.loadPreset → HP.abStart('kFrame', 0) で B 側を作り、A と B を同じ步で進める)。λ の前の行は、読み込む本(この
// process の内蔵の写し)の physics.lambdaPN を一時的に旧値へ置いて作る(読み込み後に戻す —— 他の段は読まない)
function galRun(lam, dt, steps) {
  const bp = BUILTIN.find((q) => q.id === GAL_ID), keep = bp.physics.lambdaPN;
  bp.physics.lambdaPN = lam;
  try {
    HP.loadPreset(GAL_ID, false);
    HP.abStart('kFrame', 0);
    const ab = HP.ab(), S = HP.sim;
    for (let k = 0; k < steps; k++) { S.step(dt); ab.simB.step(dt); }
    const sp = S.mechSpec(true);
    const r = { vphiKF1: galOuter(S), vphiKF0: galOuter(ab.simB), nan: S.hasNaN() || ab.simB.hasNaN(), clampV: S.clampVN, clampR: S.clampRN || 0,
      lamA: S.params.lambdaPN, lamB: ab.simB.params.lambdaPN, kFB: ab.simB.params.kFrame, pi: sp ? Array.from(sp.pi) : null };
    HP.abStop();
    return r;
  } finally { bp.physics.lambdaPN = keep; }
}
async function partGalaxy() {
  const base = presetOf(GAL_ID);
  const F96 = base.physics.cLight === 30 ? 2 : 1, N = 6000 * F96;
  const rows = [];
  for (const [lam, dt, n] of [[lambdaBefore(GAL_ID), 0.016, N], [0, 0.016, N], [0, 0.008, 2 * N]]) {
    const t = Date.now();
    const A = galRun(lam, dt, n);
    const row = { lambdaPN: lam, dt, steps: n, vphiKF1: A.vphiKF1, vphiKF0: A.vphiKF0, ratio: A.vphiKF1 / A.vphiKF0, piKF1: A.pi, nan: A.nan, clampV: A.clampV, clampR: A.clampR,
      lamA: A.lamA, lamB: A.lamB, kFrameB: A.kFB, wallSec: (Date.now() - t) / 1000 };
    rows.push(row); log('galaxy', lam, dt, row.ratio, JSON.stringify(row.piKF1));
  }
  const claim = (base.claims || []).find((c) => c.metric === 'outerRotationBoostRatio');
  return { id: GAL_ID, procedure: 'claim galaxygeo2.outer-boost-ratio(外縁帯 [156,286]・' + N + ' 步・kF1/kF0)', claimWindow: claim ? claim.expected : null,
    piLabels: ['重力', '測地線(1PN)', '熱斥力', '接触', '結合', '引きずり'], rows,
    lambdaEffect: rows[1].ratio - rows[0].ratio, h2: Math.abs(rows[2].ratio - rows[1].ratio) };
}

// qlock —— 📶📐: 試験粒子(質量床・pnSource なし)の近点方位の時間変化を、離心ベクトル(地球は pinned)の角度で読む。
// 同じ時間窓 T(参照プローブの約 1 公転 = 1.5×10⁶ 步)で kFrame=1(宣言)と kFrame=0 を走らせ、差 Δϖ_drag(rad/窓)を λ の前後で並べる
function eccAngles(S, G) {
  const out = [];
  for (let i = 1; i < S.n; i++) {
    const rx = S.x[i] - S.x[0], ry = S.y[i] - S.y[0], vx = S.vx[i] - S.vx[0], vy = S.vy[i] - S.vy[0];
    const r = Math.hypot(rx, ry), mu = G * (S.m[0] + S.m[i]), v2 = vx * vx + vy * vy, rv = rx * vx + ry * vy;
    out.push(Math.atan2(((v2 - mu / r) * ry - rv * vy) / mu, ((v2 - mu / r) * rx - rv * vx) / mu));
  }
  return out;
}
function qlockRun(p, dt, steps) {
  const v = HP.validatePreset(clone(p)); HP.sim.build(v.preset); const S = HP.sim, G = S.params.G;
  const a0 = eccAngles(S, G); const acc = a0.map(() => 0); let prev = a0.slice();
  const chunk = Math.max(1, Math.floor(steps / 2000));
  for (let k = 0; k < steps; k++) {
    S.step(dt);
    if ((k + 1) % chunk === 0 || k === steps - 1) { const a = eccAngles(S, G);
      for (let i = 0; i < a.length; i++) { let d = a[i] - prev[i]; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; acc[i] += d; }
      prev = a; }
  }
  const r = []; for (let i = 1; i < S.n; i++) r.push(Math.hypot(S.x[i] - S.x[0], S.y[i] - S.y[0]));
  return { dVarpi: acc, r, nan: S.hasNaN() };
}
async function partQlock() {
  const res = {};
  for (const id of ['qLockRadialAudit', 'qLockRadialAuditQ3']) {
    const base = presetOf(id), T = 24000;
    const rows = [];
    for (const [lam, dt] of [[lambdaBefore(id), 0.016], [0, 0.016], [0, 0.008]]) {
      const t = Date.now(), n = Math.round(T / dt);
      const A = qlockRun(withPhys(base, { lambdaPN: lam }), dt, n), B = qlockRun(withPhys(base, { lambdaPN: lam, kFrame: 0 }), dt, n);
      rows.push({ lambdaPN: lam, dt, steps: n, T, dVarpiKF1: A.dVarpi, dVarpiKF0: B.dVarpi, dragRad: A.dVarpi.map((z, i) => z - B.dVarpi[i]), rEnd: A.r, nan: A.nan || B.nan, wallSec: (Date.now() - t) / 1000 });
      log('qlock', id, lam, dt, JSON.stringify(rows[rows.length - 1].dragRad.map((z) => z.toExponential(3))));
    }
    const [b, a, h] = rows;
    res[id] = { rows, lambdaEffectRel: a.dragRad.map((z, i) => (b.dragRad[i] !== 0 ? z / b.dragRad[i] - 1 : null)),
      h2Rel: a.dragRad.map((z, i) => (z !== 0 ? h.dragRad[i] / z - 1 : null)) };
  }
  return { procedure: '離心ベクトルの角度の累積(地球 pinned)・窓 T=24000(参照プローブの約 1 公転)・Δϖ_drag = kFrame=1 − kFrame=0', books: res };
}

// geotoy —— 🔁🌒 の零試験。A = 本の宣言(現行は pn:off)・B = ワンタップ対照(geoPN=2・λ_PN=0 —— ニュートンの二体)。前 = 第296便までの宣言
// (pn:"reference-1PN"・pnVelocity:"v"・λ_PN=1)と B 側 geoPN=2・λ_PN=1。🔁 は近点移動(検出器 B・59 近点)・🌒 は 2 周目の周期(同方向 1 周)
function revTimes(p, dt, nRev, ci = 0, oi = 1, opts = {}) {
  const v = HP.validatePreset(clone(p)); HP.sim.build(v.preset); const S = HP.sim;
  let prev = Math.atan2(S.y[oi] - S.y[ci], S.x[oi] - S.x[ci]), acc = 0; const rev = [];
  for (let k = 0; k < (opts.maxSteps || 5e7) && rev.length < nRev; k++) {
    S.step(dt);
    const th = Math.atan2(S.y[oi] - S.y[ci], S.x[oi] - S.x[ci]);
    let d = th - prev; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
    const pa = acc; acc += d; prev = th;
    const nP = Math.floor(Math.abs(pa) / (2 * Math.PI)), nN = Math.floor(Math.abs(acc) / (2 * Math.PI));
    if (nN > nP) { const tg = Math.sign(acc) * nN * 2 * Math.PI; rev.push((k + (tg - pa) / (acc - pa)) * dt); }
  }
  return { rev, nan: S.hasNaN(), hasGeo3: S.hasGeo3 === true, hasGeo3PN: S.hasGeo3PN === true };
}
// ワンタップ対照の B 側の作り方(abStart と同じ —— A の宣言で build したあと params に physicsPatch を当てて updateRadii)
function withAbPatch(patch, fn) {
  const orig = HP.sim.build;
  HP.sim.build = function (p) { const r = orig.call(this, p); Object.assign(this.params, patch); this.updateRadii(); return r; };
  try { return fn(); } finally { HP.sim.build = orig; }
}
async function partGeotoy() {
  const out = {};
  {   // 🔁
    const id = 'mercuryGeoToy3', base = presetOf(id);
    const old = clone(base); old.physics.lambdaPN = 1; old.physics.spaceMesh = Object.assign({}, old.physics.spaceMesh, { pn: 'reference-1PN', pnVelocity: 'v' });
    const rows = [];
    for (const [tag, p, patch] of [['A', base, null], ['B', base, { geoPN: 2, lambdaPN: 0 }], ['A_before', old, null], ['B_before', old, { geoPN: 2 }]]) for (const dt of [0.016, 0.008]) {
      const t = Date.now(); const go = () => runRow(HP, p, { ci: 0, oi: 1, dt, revMax: 60, windows: [59], maxSteps: 2e7, dayUnits: 1, yearUnits: 1 });
      const r = patch ? withAbPatch(patch, go) : go();
      const w = r.windows[0];
      rows.push({ tag, dt, slopeDegPerPeri: w.B ? w.B.slopeDegPerPeri : null, nPeri: w.B ? w.B.nPeri : null, steps: r.steps, nan: !!r.nan, wallSec: (Date.now() - t) / 1000 });
      log('geotoy', id, tag, dt, rows[rows.length - 1].slopeDegPerPeri);
    }
    const g = (tag, dt) => rows.find((z) => z.tag === tag && z.dt === dt).slopeDegPerPeri;
    out[id] = { measure: '近点移動 °/周(検出器 B・59 近点)', rows,
      nullDiff: { dt: g('A', 0.016) - g('B', 0.016), dtHalf: g('A', 0.008) - g('B', 0.008) },
      nullDiffBefore: { dt: g('A_before', 0.016) - g('B_before', 0.016), dtHalf: g('A_before', 0.008) - g('B_before', 0.008) },
      pn1Size: { dt: g('B_before', 0.016) - g('B', 0.016) } };
  }
  {   // 🌒
    const id = 'charonGeoToy3', base = presetOf(id);
    const old = clone(base); old.physics.lambdaPN = 1; old.physics.spaceMesh = Object.assign({}, old.physics.spaceMesh, { pn: 'reference-1PN', pnVelocity: 'v' });
    const unitS = 100;   // 1 単位 = 10² s
    const rows = [];
    for (const [tag, p, patch] of [['A', base, null], ['B', base, { geoPN: 2, lambdaPN: 0 }], ['A_before', old, null], ['B_before', old, { geoPN: 2 }]]) for (const dt of [0.016, 0.008]) {
      const t = Date.now(); const go = () => revTimes(p, dt, 2);
      const r = patch ? withAbPatch(patch, go) : go();
      rows.push({ tag, dt, period2S: (r.rev[1] - r.rev[0]) * unitS, hasGeo3: r.hasGeo3, hasGeo3PN: r.hasGeo3PN, nan: r.nan, wallSec: (Date.now() - t) / 1000 });
      log('geotoy', id, tag, dt, rows[rows.length - 1].period2S);
    }
    const g = (tag, dt) => rows.find((z) => z.tag === tag && z.dt === dt).period2S;
    out[id] = { measure: '周期(同方向 1 周・2 周目)s', rows,
      nullDiff: { dt: g('A', 0.016) - g('B', 0.016), dtHalf: g('A', 0.008) - g('B', 0.008) },
      nullDiffBefore: { dt: g('A_before', 0.016) - g('B_before', 0.016), dtHalf: g('A_before', 0.008) - g('B_before', 0.008) },
      pn1Size: { dt: g('B_before', 0.016) - g('B', 0.016) } };
  }
  return out;
}

// retired —— 退役の geoPN=2(二体 14 本 —— 🪐💿 saturnRingRealKF1 は 127 体で器が無い)。λ_PN の前後で、近点移動(検出器 B)と
// 同方向 1 周の平均周期を同じ窓(公転数 N = min(20, 3×10⁶ 步に入る数))で測る。1 本あたりの計算は 2 走行(概ね 1 分以内)に区切る
async function partRetired() {
  const out = {};
  for (const d of DECL.filter((z) => z.retired && z.geoPN === 2)) {
    const base = presetOf(d.id);
    if ((base.bodies || []).length !== 2 || base.bodies.some((b) => b.type !== 'single')) { out[d.id] = { skipped: '二体でない(器が無い —— 次の見直しで器を作る)' }; continue; }
    // 公転周期は走らせて測る(較正質量の本はケプラーの見積りと桁が違う)—— 最初の 1 周が 3×10⁶ 步に入らない本は器の外(次の見直し)
    const r1 = revTimes(withPhys(base, { lambdaPN: 0 }), 0.016, 2, 0, 1, { maxSteps: 3e6 });
    if (r1.rev.length < 2) { out[d.id] = { emoji: d.emoji, skipped: '3×10⁶ 步で 2 周しない(器の窓に入らない —— 次の見直しで窓を作る)' }; log('retired', d.id, 'skip'); continue; }
    const P = r1.rev[1] - r1.rev[0];
    const N = Math.max(3, Math.min(20, Math.floor(3e6 * 0.016 / P)));
    const unitS = Math.pow(10, (base.scaleExp && Number.isFinite(base.scaleExp.T)) ? base.scaleExp.T : 0);
    const rows = [];
    for (const lam of [d.lambdaBefore, 0]) {
      const t = Date.now();
      const rr = runRow(HP, withPhys(base, { lambdaPN: lam }), { ci: 0, oi: 1, dt: 0.016, revMax: N + 1, windows: [N], maxSteps: 2e7, dayUnits: 1, yearUnits: 1 });
      const w = rr.windows[0];
      rows.push({ lambdaPN: lam, dt: 0.016, revolutions: N, steps: rr.steps, advanceDegPerOrbit: w.B ? w.B.slopeDegPerPeri : null,
        nPeri: w.B ? w.B.nPeri : null, periodS: rr.sidMeanDays === null ? null : rr.sidMeanDays * unitS, nan: !!rr.nan, wallSec: (Date.now() - t) / 1000 });
      log('retired', d.id, lam, JSON.stringify(rows[rows.length - 1]));
    }
    const [b, z] = rows;
    out[d.id] = { emoji: d.emoji, unitS, rows, advanceRatioAfterOverBefore: (b.advanceDegPerOrbit ? z.advanceDegPerOrbit / b.advanceDegPerOrbit : null),
      periodRelChange: (b.periodS ? z.periodS / b.periodS - 1 : null) };
  }
  return out;
}

// ---------------------------------------------------------------------------------------------------------------
const W281A_SCOPE = w281aScopeStamp(html, REGEN_SCOPE);
const out = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : {};
out.version = REFIT_W297A_VERSION;
out.generator = 'tests/exp-w297a-refit.mjs';
out.ruling = '原仮定者の裁定(第87報)・統括の検証項目 R161';
out.target = TARGET; out.targetSha256 = targetSha256;
out.declared = { rule: 'geoPN≥2 の内蔵 = physics.lambdaPN 0(宣言から列挙)', n: DECL.length, books: DECL };
out.parts = out.parts || {};
// --merge a.json,b.json …: 段ごとに別の process(W297A_OUT を分けて並走)で走らせた写しの parts を 1 つの正本へまとめる(数は写しのまま・meta はいまの html と器で刻む)
const MERGE = argOf('--merge');
// 壁時計の欄の名前は wallSec(安定 hash の除外の語彙 —— 第297便a の枝の初回の写しは wallS だったので、まとめるときに名前だけを揃える)
const renameWall = (o) => { if (Array.isArray(o)) return o.map(renameWall); if (!o || typeof o !== 'object') return o;
  const r = {}; for (const [k, v] of Object.entries(o)) r[k === 'wallS' ? 'wallSec' : k] = renameWall(v); return r; };
if (MERGE) for (const f of MERGE.split(',').filter(Boolean)) { const j = JSON.parse(fs.readFileSync(f, 'utf8')); Object.assign(out.parts, renameWall(j.parts || {}));
  if (j.targetSha256 && j.targetSha256 !== targetSha256) throw new Error('--merge: 写し ' + f + ' の targetSha256 がいまの html と違う(同じ html で走らせ直すこと)'); }
const RUN = { em: partEm, emfit: partEmFit, galaxy: partGalaxy, qlock: partQlock, geotoy: partGeotoy, retired: partRetired };
for (const k of (MERGE ? [] : PARTS)) {
  if (!RUN[k]) continue;
  const t = Date.now();
  out.parts[k] = await RUN[k]();
  out.parts[k].wallSec = (Date.now() - t) / 1000;
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  log('part', k, 'done', out.parts[k].wallSec + 's');
}
out.timing = MERGE ? { wallSec: Object.values(out.parts).reduce((a, p) => a + (Number(p.wallSec) || 0), 0), mode: 'merge(段ごとの壁時計の和 —— 段は別の process で並走)' }
  : { wallSec: (Date.now() - t0All) / 1000 };
const CODE = ['tests/exp-w297a-refit.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第297便a', target: TARGET, code: CODE, inputs: [TARGET] }), {
  harnessVersion: REFIT_W297A_VERSION, parts: Object.keys(out.parts),
  ruling: '原仮定者の裁定(第87報)(光学と力学を分ける。λ_PN は力学の作用なので、geoPN=2 の引きずり減衰 q・geoPN=3 の慣性決定力の引きずり gain〔geoPN=4 も〕と重ねない。geoPN=2・3・4 のサンプルは全て λ_PN=0。修正したサンプルは再フィットする)',
  reading: '統括の検証項目 R161(λ_PN=0 と再フィット —— 既存のノブだけ・h と h/2・届かなければ次の見直しへ)',
  engine: 'Node の headless(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・1 プロセス)',
  notClaim: ['月の近点回転を再現した', '較正 合', 'gain は普遍定数', '1PN を DFM から導出した'] });
out.elapsedS = out.timing.wallSec;
Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
log('→', path.relative(ROOT, OUT), out.elapsedS + ' s');
