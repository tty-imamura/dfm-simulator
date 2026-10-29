// 第301便g(原仮定者の裁定(第91報)への追加の裁定 AN300「慣性決定力は、重力決定力に比べて近距離の天体の影響が大きい為、背景慣性決定力が
// サンプル毎に異なるのは問題無い。法則性の探索を行う」・統括の検証項目 R185)—— **背景慣性決定力 W_bg の法則性の探索の器**
// (Node だけ —— 対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、アプリの步をそのまま走らせる・1 プロセス)。
// **探索だけ —— 在位の本の宣言・力学・署名は変えない**(法則の候補が見つかっても本に当てるのは次便の裁定の後)。
//
// ■ 前提(第301便a): 既定の合成則 solve は総和正規化の法則そのもの —— u_i = C_d Σ_j w_ij (W_j − v_i)/(W_bg + Σ_j w_ij)、
//   w_ij = m_j 𝒦_j(r_ij)(点源 K_ε = r/(r²+ε²)²・構造核 ⟨K⟩)、既定 W_bg = 1/gain・C_d = 1(html の relDragBackgroundOf)。
//   二体(または慣性の対が 2 体だけ)の相対運動では Δu = X/(1+X)·(v_c − v_o)、X = Σw_rel/W_bg(Σw_rel = 受け手 2 体の Σw の和 —— pinned の受け手は除く)。
//
// ■ 段(正本 tests/out/wbglaw-w301g.json —— 段 wbglaw-301g)
//   A データの表(宣言から機械で選ぶ —— 手書きの ID 一覧を置かない):
//     fit       = 在位 ∧ law inertial ∧ gain>0 ∧ fitRecord.status "fitted"(🟫🌡️🟪🌦️ —— 系の束ね = fitRecord.parent を fit の行の中で辿る)
//     record    = 退役の本のフィットの記録(RETIRED_FIT_RECORDS —— fitRecord を持たない退役の本の 1 次元フィット。再フィットしない)
//     censored  = fitRecord.status が "fitted" でない本(根を挟めなかった記録 —— W_bg は決まらない)
//     transfer  = gain>0 ∧ scaleExp ∧ fitRecord なし ∧ record でない(移送した値 —— フィットではない。応答の検算にだけ使う)
//     unfit     = 在位 ∧ gain 0 ∧ scaleExp(予測の記録を出す本)
//     excluded  = scaleExp の無いトイ(本の単位が物理単位でない)
//     各行: W_bg(本の単位と SI)・標的の量(観測・記録のモデル値・gain 0 の対照の実測・宣言の gain の実測)・系の量(M・m・a・e・P・R・Ω・密度・ε・
//     構造核・三体目の距離と m/d³・単位系)・局所の重み Σw̄_rel(1 公転の時間平均 —— 宣言した対だけ・核は html の dragCoreLookup)・X̄・ξ̄=⟨X/(1+X)⟩・
//     要る効果の大きさ δ(近点: Δϖ̇·P/360°・周期: ΔP/P —— 実測と、観測の標的から引いた δ_obs)。
//   B 候補(次元 M/L³ —— SI で log10 に当てはめる・自由パラメータ 1〜2 だけ): 一定・M/a³・m/a³・(M+m)/a³(= ω²/G —— ケプラーで同じ尺度なので
//     重ねて数えない。表に比を記録)・M/R³・M/(a²ε)・Ω²/G・ωΩ/G・Σw̄_rel・c²/(G a²)・外の天体+宇宙の一様な分(自由パラメータ 0)・
//     応答の分解 Σw̄_rel/δ_obs(自由パラメータ 1 —— 標的の差 δ_obs を入力に持つので「系の量だけの法則」ではない)。
//     1 パラメータ W = k·X と 2 パラメータ W = k·X^β。残差の rms(dex)と leave-one-out(系を 1 つ抜いて残りで決め、抜いた系の W_bg を当てる)。
//     集合は 2 つ: all(fit + record —— 系 4)/ inPlace(fit だけ —— 系 3)。
//   C leave-one-out の標的: 系の量の候補で LOO の rms が最小の 1 パラメータの候補と、応答の分解で、抜いた系の本を W_pred(gain = C_d/W_pred・C_d = 1)で
//     走らせ、標的の量を観測と比べる。
//   D 応答の検算: κ = δ/ξ̄(近点と周期)を fit の本で決め、transfer の本(W_bg が 1e3〜1e7 倍違う)で δ の予測 κ̄ξ̄ と実測を比べる。
//   E 未フィットの本への予測(記録): 惑星(🌋🔴🏀🟡🔷💙)を W_pred で走らせ、gain 0 との近点率の差と周期の差・応答の予測 κ̄ξ̄·n・1PN の式の値
//     (参考 —— 観測ではない)・恒星周期の観測の行(観測の行がある量だけ比べる)。🍩 は 2 公転の走行で X̄ と位置の差だけを記録する。
//
// ■ しないこと・言わないこと
//   ・本の宣言・力学・fitRecord・署名を変えない(この器は html を読むだけ)。退役の本は再フィットしない(記録として使う)。
//   ・「法則を発見した」「W_bg が決まった」と書かない。gain を系をまたぐ定数と呼ばない・現実の再現の主張をしない。点が少ない —— 候補と予測の記録。
//   ・届かないものは「この探索範囲では未達 —— 次の見直し」。
//
// 実行(Node だけ・1 プロセス):
//   node tests/exp-w301g-wbglaw.mjs          → 正本 tests/out/wbglaw-w301g.json(W301G_OUT で出力先を変える)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as C from './exp-w295c-inertial3.mjs';
import * as M3 from './exp-w298c-moon3d.mjs';
import * as PL from './exp-w299c-planets3d.mjs';
import * as P3 from './lib-w299c-planets3d.mjs';
import * as L from './lib-w297b-fit.mjs';
import { cosmicBackground } from './exp-w301a-dragnorm.mjs';
import * as W302A from './lib-w302a-wbg.mjs';   // 第302便a: gain ⇔ W_bg の読み書き(器の側)
import { pre302c } from './lib-w302c-pre.mjs';   // 第302便c: G_loc の前の宣言の写し
import { pinDecl302, DECL302_DATA_FILE } from './lib-w303a-pre.mjs';   // 第303便a: 第302便の本の宣言の写し(この正本は第302便の宣言で測った歴史の記録 —— 器の中だけ・html と署名は変えない)
import { pinDecl303, DECL303_DATA_FILE } from './lib-w304c-pre.mjs';   // 第304便c: 第303便の 🌦️🌔 の宣言の写し(pinDecl302 の前に —— 軟化・初期配置・引きずりの宣言を第303便へ戻してから第302便の欄を戻す・歴史の値を保つ)
import { pinDecl315c, LEGACY7_DATA_FILE } from './lib-w315c-legacy7.mjs';   // 第315便c(決断事項 AN406・R244): 在位の 7 本を K1 へ移した世代では、この器は移行の前(af2f426)の宣言の写しで測る
const REGEN_SCOPE = {"presets":"all","roots":["$","DT","FIT_COND_KEYS","FIT_COND_VERSION","FIT_KNOB_KEYS","FIT_NUMERICS_KEYS","FIT_RECORD_KEYS","FIT_RECORD_VERSION","FIT_RECORD_VERSIONS","FIT_RESIDUAL_KEYS","FIT_TARGET_KEYS","FIT_TOL_KEYS","HP.DRAG_CORE_RMAX_FACTOR","HP.DRAG_CORE_VERSION","HP.FIT_COND_VERSION","HP.REL_DRAG_COMPOSE_DEFAULT","HP.REL_DRAG_INERTIAL_VERSION","HP.REL_DRAG_NORM_VERSION","HP.REL_DRAG_SOLVE_FROM_DEFAULT","HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.dragCoreLookup","HP.dragCoreState","HP.fitCondSig","HP.geoEffectiveMode","HP.geoLawOfSim","HP.inertialDragState","HP.relDragBackgroundOf","HP.relDragStepOrderOf","HP.sim","HP.validateFitRecord","HP.validatePreset","LAWS","T","ab","ch","ctx","cw","fmt","pnSource","validateFitRecord"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w301g-wbglaw-1';
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const clone = (x) => JSON.parse(JSON.stringify(x));
/** SI の定数(第301便a の COSMO と同じ値)。 */
export const SI = Object.freeze({ G: 6.674e-11, c: 2.99792458e8 });
/** 退役の本のフィットの記録(fitRecord を持たない退役の本 —— 宣言の gain が 1 次元フィットの値であることを文書が記録している本だけ)。再フィットしない。 */
export const RETIRED_FIT_RECORDS = Object.freeze([
  Object.freeze({ id: 'earthMoonInertial', kind: 'apsPeriod', obs: 8.85, unit: 'yr', window: 27,
    source: 'PHYSICS〔第292便c〕(gain 514182 は 27 公転窓の近点周期 8.85 年への 1 次元フィット —— 太陽なしの地球と月)・〔第293便g〕(既定の solve(velocity) で最初の評価が許容に入る —— 再フィットなし)',
    note: '刻みは器の規則(1 公転 47503 步 —— stepsOf)で、記録の刻み 0.016 とは違う(門は 8.85 年に 0.001 年以内)' }),
]);
/** 候補(次元 M/L³)。f は SI の系の量から X を返す。kind: scale(系の量だけ)/ ext(自由パラメータ 0 の読み)/ response(標的の差を入力に持つ)。 */
export const CANDIDATES = Object.freeze([
  { key: 'const', label: '一定(W_bg = k)', kind: 'scale', f: () => 1 },
  { key: 'Ma3', label: 'M/a³(支配天体の局所の重み)', kind: 'scale', f: (q) => q.M / q.a ** 3 },
  { key: 'ma3', label: 'm/a³(伴の局所の重み)', kind: 'scale', f: (q) => q.m / q.a ** 3 },
  { key: 'Mma3', label: '(M+m)/a³(= ω²/G —— ケプラーで同じ尺度・重ねて数えない)', kind: 'scale', f: (q) => (q.M + q.m) / q.a ** 3 },
  { key: 'MR3', label: 'M/R³(支配天体の平均密度の尺度)', kind: 'scale', f: (q) => q.M / q.R ** 3 },
  { key: 'Ma2e', label: 'M/(a²ε)(核の正則化 ε との組)', kind: 'scale', f: (q) => q.M / (q.a * q.a * q.eps) },
  { key: 'O2G', label: 'Ω²/G(支配天体の自転)', kind: 'scale', f: (q) => q.Om * q.Om / SI.G },
  { key: 'wOG', label: 'ωΩ/G(公転と自転)', kind: 'scale', f: (q) => q.w * q.Om / SI.G },
  { key: 'sumW', label: 'Σw̄_rel(実測の局所の重み —— 構造核と離心率を含む)', kind: 'scale', f: (q) => q.sumW },
  { key: 'c2Ga2', label: 'c²/(G a²)(1PN の近日点前進を引きずりで写す尺度)', kind: 'scale', f: (q) => SI.c * SI.c / (SI.G * q.a * q.a) },
  { key: 'ext', label: '外の天体 + 宇宙の一様な分(W_cos + Σ_ext m/d³ —— 自由パラメータ 0)', kind: 'ext', f: (q) => q.Wext },
  { key: 'resp', label: '応答の分解 Σw̄_rel/δ_obs(標的の差を入力に持つ —— 系の量だけの法則ではない)', kind: 'response', f: (q) => (q.deltaObs > 0 ? q.sumW / q.deltaObs : null) },
]);

const find = (HP, id) => pre302c(HP.allPresets().find((q) => q.id === id));   // 第302便c: G_loc の前の宣言の写し(この器は引きずりだけの法則性の探索 —— G_loc を宣言した本は G_loc を外し記録〔G_loc の上の条件〕も外す: 🌡️ は移送の行・G_loc を宣言しない本は clone と同じ)
const T = (x, d = 6) => (x === null || x === undefined || !Number.isFinite(x)) ? null : Number(x.toPrecision(d));
const lg = (x) => (x > 0 && Number.isFinite(x)) ? Math.log10(x) : null;
const withGain = (p, g) => { const q = clone(p); W302A.rdSetGain(q.physics.relativeDrag, g); delete q.physics.relativeDrag.background; delete q.fitRecord; return q; };
const unitsOf = (X) => { const Lm = Math.pow(10, X.L), Ms = Math.pow(10, X.M), Ts = Math.pow(10, X.T); return { Lm, Ms, Ts, dens: Ms / (Lm * Lm * Lm), U: C.timeUnits(X) }; };

/* ── 宣言から行の種類・抽出器・刻み・窓を決める ── */
function pairTest(rd, n) {
  const P = rd.pairs;
  if (P === undefined || P === 'all') return () => true;
  const s = new Set(); for (const [i, j] of P) { s.add(i * n + j); s.add(j * n + i); }
  return (i, j) => s.has(i * n + j);
}
function targetKind(t) {
  if (!t) return null;
  if (t.unit === '″/世紀') return 'apsRateDiff';
  if (t.unit === 's') return 'period';
  if (t.unit === 'yr' || t.unit === '年') return 'apsPeriod';
  return null;
}
function windowOfTarget(t) {
  const s = String((t && t.window) || '') + ' ' + String((t && t.q) || '');
  const m = s.match(/(\d+)\s*公転/) || s.match(/(\d+)\s*$/);
  return m ? Number(m[1]) : null;
}
// 第318便(統括の統合 —— 鎖で見つけた): 🗺️ solarSystem16Inertial3d(第318便c)はこの器の世代より後に入った本(K1 の規則の宣言 —— gain を書き込む写しは受理されない)—— 分類の外に置く(正本の欄と値は不変)
const LATER_BOOKS_318 = new Set(['solarSystem16Inertial3d']);
export function classify(HP) {
  const rows = [], excluded = [];
  const inert = HP.allPresets().filter((p) => ((p.physics || {}).relativeDrag || {}).law === 'inertial' && !LATER_BOOKS_318.has(p.id)).map((p) => pre302c(p));   // 第318便(統括): 後に入った本は分類の外   // 第302便c
  const recIds = new Set(RETIRED_FIT_RECORDS.map((r) => r.id));
  for (const p of inert) {
    const rd = p.physics.relativeDrag, retired = p.familyRole === 'retired', f = p.fitRecord || null;
    if (!p.scaleExp) { excluded.push({ id: p.id, emoji: p.emoji, why: 'scaleExp なし(トイ —— 本の単位が物理単位でない)' }); continue; }
    let role;
    if (f && f.status === 'fitted' && W302A.rdGainOf(rd) > 0 && !retired) role = 'fit';
    else if (f && f.status !== 'fitted') role = 'censored';
    else if (recIds.has(p.id)) role = 'record';
    else if (W302A.rdGainOf(rd) > 0 && !f) role = 'transfer';
    else if (W302A.rdGainOf(rd) === 0 && !retired) role = 'unfit';
    else { excluded.push({ id: p.id, emoji: p.emoji, why: '分類の外(gain ' + W302A.rdGainOf(rd) + '・retired ' + retired + ')' }); continue; }
    const n = p.bodies.length, c3 = p.physics.coord === '3d';
    const ci = p.orbitObs ? p.orbitObs.center : (p.timeRef && p.timeRef.pair ? p.timeRef.pair[0] : 0);
    const oi = p.orbitObs ? p.orbitObs.orbiter : (p.timeRef && p.timeRef.pair ? p.timeRef.pair[1] : 1);
    let ex = null;
    if (n === 2 && !c3 && ci === 0 && oi === 1) ex = 'pair2d';
    else if (n === 2 && c3 && ci === 0 && oi === 1) ex = 'pl3';
    else if (n === 3 && ci === 1 && oi === 2) ex = 'ems';
    else ex = 'ring';
    const rec = RETIRED_FIT_RECORDS.find((r) => r.id === p.id) || null;
    const t0 = f ? f.targets[0] : null;
    const target = rec ? { kind: rec.kind, obs: rec.obs, unit: rec.unit, window: rec.window, source: rec.source, model: null }
      : (t0 ? { kind: targetKind(t0), obs: t0.obs, unit: t0.unit, window: windowOfTarget(t0), q: t0.q, model: (typeof t0.model === 'number') ? t0.model : (f.residual && typeof f.residual.model === 'number' ? f.residual.model : null),
        tol: t0.tol ? t0.tol.value : null } : null);
    const N = (target && target.window) || (ex === 'ems' ? 118 : 8);
    const dt = (f && typeof f.dt === 'number') ? f.dt : P3.stepsOf(p.timeRef.pRef).h;
    rows.push({ id: p.id, emoji: p.emoji, role, retired, coord: c3 ? '3d' : '2d', ex, ci, oi, N, dt, gain: W302A.rdGainOf(rd), parent: f ? f.parent : null, target, recordNote: rec ? rec.note : null });
  }
  // 系の束ね: fit の行は fitRecord.parent を fit の行の中で辿った根(🌡️ → 🟫)
  const byId = new Map(rows.map((r) => [r.id, r]));
  for (const r of rows) { let g = r; while (g.role === 'fit' && g.parent && byId.has(g.parent) && byId.get(g.parent).role === 'fit') g = byId.get(g.parent); r.group = g.id; }
  return { rows, excluded };
}

/* ── 走行(アプリの步)—— 抽出器ごとに P・ϖ̇・a・e を返す(時間は本の単位・角は度) ── */
export function runOrbit(HP, preset, row, gain) {
  const t0 = Date.now(), q = withGain(preset, gain), X = preset.scaleExp, u = unitsOf(X), N = row.N;
  let o;
  if (row.ex === 'pair2d') {
    const R = C.runPair(HP, q, { ci: row.ci, oi: row.oi, dt: row.dt, revMax: N });
    const n = R.rev.length;
    o = { P: n >= N ? (R.rev[N - 1] - R.rev[0]) / (N - 1) : null, varpiRate: R.B && Number.isFinite(R.B.slopeDegPerTime) ? R.B.slopeDegPerTime : null,
      a: (R.rMin + R.rMax) / 2, e: R.eProxy, steps: R.steps, nan: R.nan, complete: n >= N };
  } else if (row.ex === 'ems') {
    const R = M3.runEmx3(HP, q, { dt: row.dt, revMax: N });
    const w = L.emMethods(R.ev, N, { year: u.U.year, day: u.U.day });
    o = { P: w.complete ? w.sid * u.U.day : null, varpiRate: (w.complete && w.T1) ? 360 / (w.T1 * u.U.year) : null, a: w.aOsc, e: w.eOsc, steps: R.steps, nan: R.nan, complete: R.complete && w.complete, stop: R.stop };
  } else if (row.ex === 'pl3') {
    const R = PL.runPl3(HP, q, { dt: row.dt, revMax: N });
    const w = PL.windowOf(R, N, u.Ts), cent = 36525 * 86400 / u.Ts;
    o = { P: w.complete ? w.periodUnits : null, varpiRate: (w.complete && w.apsArcsecPerCentury !== null) ? w.apsArcsecPerCentury / 3600 / cent : null, a: w.aMean, e: w.ecc, steps: R.steps, nan: R.nan, complete: w.complete };
  } else throw new Error('抽出器なし ' + row.id);
  o.gain = gain; o.wallSec = (Date.now() - t0) / 1000;
  return o;
}

/* ── 局所の重み Σw_rel の時間平均(1 公転・宣言した対だけ・核は html の dragCoreLookup —— 点源は K_ε) ── */
export function sampleSumW(HP, preset, row, gain) {
  const q = withGain(preset, gain), v = HP.validatePreset(clone(q));
  if (!v.ok) throw new Error('validatePreset: ' + JSON.stringify(v.errors).slice(0, 200));
  HP.sim.build(v.preset);
  const S = HP.sim, rd = v.preset.physics.relativeDrag, eps = (rd.eps !== undefined) ? rd.eps : (S.params.softening || 0), e2 = eps * eps;
  const n = S.n, inPair = pairTest(rd, n), Z = S.coord3d ? S.z : null, CT = S._dragCoreT || null;
  const steps = Math.max(1, Math.round(preset.timeRef.pRef / row.dt)), every = Math.max(1, Math.floor(steps / 2000));
  const sw = (i) => { let s = 0; for (let j = 0; j < n; j++) { if (j === i || !(S.m[j] > 0) || !inPair(i, j)) continue;
    const dx = S.x[j] - S.x[i], dy = S.y[j] - S.y[i], dz = Z ? Z[j] - Z[i] : 0, r2 = dx * dx + dy * dy + dz * dz, r = Math.sqrt(r2), qq = r2 + e2;
    const kv = (CT && CT[j]) ? HP.dragCoreLookup(CT[j], r) : null; s += S.m[j] * ((kv === null) ? r / (qq * qq) : kv); } return s; };
  const ciFree = !S.pinned[row.ci], samples = [];
  let so = 0, sc = 0, k = 0, coreUsed = false;
  if (CT) for (let j = 0; j < n; j++) if (CT[j]) coreUsed = true;
  for (let s = 0; s <= steps; s++) {
    if (s % every === 0) { const a = sw(row.oi), b = ciFree ? sw(row.ci) : 0; so += a; sc += b; samples.push(a + b); k++; }
    S.step(row.dt); if (S.hasNaN()) break;
  }
  // 三体目(対の外 —— 外の天体の読み): t=0 の宣言の位置で m/d³(点源 K_ε)
  const ext = [];
  for (let j = 0; j < preset.bodies.length; j++) { if (j === row.ci || j === row.oi) continue; const b = preset.bodies[j], c = preset.bodies[row.ci];
    const d = Math.hypot(b.x - c.x, b.y - c.y, (b.z || 0) - (c.z || 0)); ext.push({ index: j, m: b.m, d, inPairWithOrbiter: inPair(row.oi, j), w: b.m * d / ((d * d + e2) ** 2) }); }
  return { steps, every, samples, sumWo: so / k, sumWc: sc / k, sumWrel: (so + sc) / k, ciFree, coreUsed, eps, ext };
}
const xiOf = (samples, W) => samples.reduce((s, x) => s + (x / W) / (1 + x / W), 0) / samples.length;

/* ── 段 A: データの表 ── */
function systemOf(preset, row, base, sw) {
  const X = preset.scaleExp, u = unitsOf(X), B = preset.bodies, c = B[row.ci], o = B[row.oi];
  const M = c.m * u.Ms, m = o.m * u.Ms, a = base.a * u.Lm, P = base.P * u.Ts, R = c.radius * u.Lm, Rm = o.radius * u.Lm;
  const Om = Math.abs(c.spin || 0) / u.Ts, Omm = Math.abs(o.spin || 0) / u.Ts, w = 2 * Math.PI / P;
  const cos = cosmicBackground(X, sw.eps);
  const extW = sw.ext.reduce((s, z) => s + z.w, 0) * u.dens;
  return { unit: { L: X.L, T: X.T, M: X.M, densSI: u.dens }, M, m, a, e: base.e, P, R, Rm, Om, Omm, w, eps: sw.eps * u.Lm,
    rhoM: 3 * M / (4 * Math.PI * R ** 3), rhoMm: 3 * m / (4 * Math.PI * Rm ** 3),
    core: { center: !!c.dragCore, orbiter: !!o.dragCore, used: sw.coreUsed }, centerPinned: !sw.ciFree,
    third: sw.ext.map((z) => ({ index: z.index, mSI: z.m * u.Ms, dSI: z.d * u.Lm, inPairWithOrbiter: z.inPairWithOrbiter, mOverD3SI: z.m * u.Ms / (z.d * u.Lm) ** 3 })),
    sumW: sw.sumWrel * u.dens, sumWo: sw.sumWo * u.dens, sumWc: sw.sumWc * u.dens, Wcos: cos.WSI, Wext: cos.WSI + extW,
    keplerRatio: (w * w / SI.G) / ((M + m) / a ** 3) };
}
function deltas(base, run) {
  if (!base || !run) return { dAps: null, dP: null };
  return { dAps: (base.varpiRate !== null && run.varpiRate !== null) ? (run.varpiRate - base.varpiRate) * base.P / 360 : null,
    dP: (base.P && run.P) ? (base.P - run.P) / base.P : null };
}
/** 標的の値(行の単位 —— ″/世紀・s・yr)を走行から読む。 */
function targetValue(row, preset, base, run) {
  const u = unitsOf(preset.scaleExp), k = row.target && row.target.kind;
  if (k === 'apsRateDiff') return (base.varpiRate !== null && run.varpiRate !== null) ? (run.varpiRate - base.varpiRate) * 3600 * u.U.century : null;
  if (k === 'period') return run.P ? run.P * u.Ts : null;
  if (k === 'apsPeriod') return run.varpiRate ? 360 / run.varpiRate / u.U.year : null;
  return null;
}
/** 観測の標的から引いた「要る効果の大きさ」δ_obs(gain 0 の対照からの差 —— 近点は 1 公転あたりの回転・周期は相対の短縮)。 */
function deltaObsOf(row, preset, base) {
  const u = unitsOf(preset.scaleExp), t = row.target; if (!t || !base) return null;
  if (t.kind === 'apsRateDiff') return (t.obs / 3600 / u.U.century) * base.P / 360;
  if (t.kind === 'apsPeriod') return base.varpiRate === null ? null : (360 / (t.obs * u.U.year) - base.varpiRate) * base.P / 360;
  if (t.kind === 'period') return (base.P - t.obs / u.Ts) / base.P;
  return null;
}
export function partA(HP, cls, log = () => {}) {
  const out = [];
  for (const row of cls.rows) {
    if (row.ex === 'ring') continue;
    const p = find(HP, row.id);
    const base = runOrbit(HP, p, row, 0);
    const run = (row.role === 'censored' || row.role === 'unfit') ? null : runOrbit(HP, p, row, row.gain);
    const sw = sampleSumW(HP, p, row, (row.role === 'censored' || row.role === 'unfit') ? 0 : row.gain);
    const bg = row.gain > 0 ? HP.relDragBackgroundOf(p.physics.relativeDrag) : null;
    const sys = systemOf(p, row, base, sw), u = unitsOf(p.scaleExp);
    const W = bg ? bg.Wbg : null, d = deltas(base, run), dObs = deltaObsOf(row, p, base);
    const xBar = W ? sw.sumWrel / W : null, xi = W ? xiOf(sw.samples, W) : null;
    const tv = run ? targetValue(row, p, base, run) : null;
    const r = { id: row.id, emoji: row.emoji, role: row.role, group: row.group, retired: row.retired, coord: row.coord, ex: row.ex, dt: row.dt, N: row.N,
      gain: row.gain, Wbg: W, WbgSI: W ? W * u.dens : null, Cd: bg ? bg.Cd : null, pairs: p.physics.relativeDrag.pairs === undefined ? 'all' : p.physics.relativeDrag.pairs,
      target: row.target, recordNote: row.recordNote, targetMeasured: tv, targetBase: null,
      base: { P: base.P, varpiRate: base.varpiRate, a: base.a, e: base.e, steps: base.steps, nan: base.nan, complete: base.complete, wallSec: base.wallSec },
      run: run ? { P: run.P, varpiRate: run.varpiRate, a: run.a, e: run.e, steps: run.steps, nan: run.nan, complete: run.complete, wallSec: run.wallSec } : null,
      sys, sumWbook: sw.sumWrel, xBar, xi, dAps: d.dAps, dP: d.dP, deltaObs: dObs,
      kappaAps: (xi && d.dAps !== null) ? d.dAps / xi : null, kappaP: (xi && d.dP !== null) ? d.dP / xi : null };
    if (row.target && row.target.kind === 'apsPeriod' && base.varpiRate) r.targetBase = 360 / base.varpiRate / u.U.year;
    else if (row.target && row.target.kind === 'period') r.targetBase = base.P * u.Ts;
    else if (row.target && row.target.kind === 'apsRateDiff') r.targetBase = 0;
    out.push(r);
    log(r);
  }
  return out;
}

/* ── 段 B: 候補の当てはめ(log10・系ごとに 1 点) ── */
function fit1(pts) { if (pts.length < 1) return null; const k = pts.reduce((s, p) => s + (p.y - p.x), 0) / pts.length; return { lk: k, beta: 1 }; }
function fit2(pts) {
  if (pts.length < 2) return null; const n = pts.length, mx = pts.reduce((s, p) => s + p.x, 0) / n, my = pts.reduce((s, p) => s + p.y, 0) / n;
  let sxx = 0, sxy = 0; for (const p of pts) { sxx += (p.x - mx) ** 2; sxy += (p.x - mx) * (p.y - my); }
  if (!(sxx > 1e-24)) return null; const b = sxy / sxx; return { lk: my - b * mx, beta: b };
}
const predOf = (f, x) => f.lk + f.beta * x;
const rmsOf = (a) => a.length ? Math.sqrt(a.reduce((s, z) => s + z * z, 0) / a.length) : null;
export function groupsOf(table, roles) {
  const G = new Map();
  for (const r of table) { if (!roles.includes(r.role) || !(r.WbgSI > 0)) continue; if (!G.has(r.group)) G.set(r.group, []); G.get(r.group).push(r); }
  return [...G.entries()].map(([g, rs]) => ({ group: g, members: rs.map((z) => z.id), rows: rs }));
}
function xOfGroup(cand, gr) {
  const xs = gr.rows.map((r) => cand.f(Object.assign({}, r.sys, { deltaObs: r.deltaObs })));
  if (xs.some((x) => !(x > 0))) return null;
  return xs.reduce((s, x) => s + Math.log10(x), 0) / xs.length;
}
export function partB(table) {
  const sets = { all: groupsOf(table, ['fit', 'record']), inPlace: groupsOf(table, ['fit']) };
  const res = {};
  for (const [sk, groups] of Object.entries(sets)) {
    const ys = groups.map((g) => g.rows.reduce((s, r) => s + Math.log10(r.WbgSI), 0) / g.rows.length);
    res[sk] = { groups: groups.map((g, i) => ({ group: g.group, members: g.members, logW: ys[i] })), cands: [] };
    for (const cand of CANDIDATES) {
      const xs = groups.map((g) => xOfGroup(cand, g));
      if (xs.some((x) => x === null)) { res[sk].cands.push({ key: cand.key, label: cand.label, kind: cand.kind, missing: true }); continue; }
      const pts = groups.map((g, i) => ({ g: g.group, x: xs[i], y: ys[i] }));
      const forms = cand.kind === 'ext' ? [['p0', null]] : (cand.key === 'const' ? [['p1', fit1]] : [['p1', fit1], ['p2', fit2]]);
      const row = { key: cand.key, label: cand.label, kind: cand.kind, logX: pts.map((p) => ({ group: p.g, logX: p.x, ratioW: p.y - p.x })) };
      for (const [fk, fn] of forms) {
        const nPar = fk === 'p0' ? 0 : (fk === 'p1' ? 1 : 2);
        const full = fn ? fn(pts) : { lk: 0, beta: 1 };
        if (!full) { row[fk] = { nPar, insufficient: true }; continue; }
        const resid = pts.map((p) => p.y - predOf(full, p.x));
        const loo = pts.map((p, i) => { const rest = pts.filter((_, j) => j !== i), f = fn ? fn(rest) : { lk: 0, beta: 1 };
          return f ? { group: p.g, err: p.y - predOf(f, p.x), lk: f.lk, beta: f.beta } : { group: p.g, err: null }; });
        const looErr = loo.map((z) => z.err).filter((z) => z !== null);
        row[fk] = { nPar, logk: full.lk, beta: full.beta, rms: rmsOf(resid), maxAbs: Math.max(...resid.map(Math.abs)), resid: pts.map((p, i) => ({ group: p.g, dex: resid[i] })),
          dof: pts.length - nPar, loo, looRms: looErr.length === pts.length ? rmsOf(looErr) : null, looMaxAbs: looErr.length === pts.length ? Math.max(...looErr.map(Math.abs)) : null,
          looExactFit: nPar === 2 && pts.length - 1 <= 2 };
      }
      res[sk].cands.push(row);
    }
    const scale1 = res[sk].cands.filter((z) => z.kind === 'scale' && z.p1 && z.p1.looRms !== null);
    scale1.sort((a, b) => a.p1.looRms - b.p1.looRms);
    const scale2 = res[sk].cands.filter((z) => z.kind === 'scale' && z.p2 && z.p2.looRms !== null);
    scale2.sort((a, b) => a.p2.looRms - b.p2.looRms);
    res[sk].best1 = scale1.length ? { key: scale1[0].key, looRms: scale1[0].p1.looRms, rms: scale1[0].p1.rms } : null;
    res[sk].best2 = scale2.length ? { key: scale2[0].key, looRms: scale2[0].p2.looRms, rms: scale2[0].p2.rms } : null;
    res[sk].rank1 = scale1.map((z) => ({ key: z.key, looRms: z.p1.looRms, rms: z.p1.rms }));
    const resp = res[sk].cands.find((z) => z.key === 'resp');
    res[sk].response = resp && resp.p1 ? { looRms: resp.p1.looRms, rms: resp.p1.rms, kappa: Math.pow(10, resp.p1.logk) } : null;   // W = κ·Σw̄/δ_obs(κ = 10^logk —— 種類を混ぜた幾何平均)
  }
  return res;
}

/* ── 段 C: leave-one-out の標的(抜いた系の根の本を W_pred で走らせる) ── */
export function partC(HP, cls, table, B, log = () => {}) {
  const set = B.all, out = [];
  const keys = [set.best1 ? set.best1.key : null, 'resp', 'respKind'].filter(Boolean);
  // respKind: 応答の分解で κ を「同じ種類の標的(近点 / 周期)の他の系」だけから決める(同じ種類の系が無ければ予測しない)
  const kindOf = (g) => { const r = table.find((t) => t.id === g); return r.target.kind === 'period' ? 'period' : 'aps'; };
  const kapOf = (g) => { const r = table.find((t) => t.id === g); return kindOf(g) === 'period' ? r.kappaP : r.kappaAps; };
  for (const key of keys) {
    const cand = set.cands.find((z) => z.key === (key === 'respKind' ? 'resp' : key));
    for (const z0 of cand.p1.loo) {
      let z = z0;
      if (key === 'respKind') { const others = set.groups.filter((g) => g.group !== z0.group && kindOf(g.group) === kindOf(z0.group)).map((g) => kapOf(g.group));
        if (!others.length) { out.push({ cand: key, group: z0.group, emoji: table.find((t) => t.id === z0.group).emoji, skipped: '同じ種類の標的の系が他に無い' }); continue; }
        z = { group: z0.group, lk: others.reduce((s, k) => s + Math.log10(k), 0) / others.length }; }
      const r = table.find((t) => t.id === z.group), row = cls.rows.find((q) => q.id === z.group), p = find(HP, z.group), u = unitsOf(p.scaleExp);
      const lx = cand.logX.find((q) => q.group === z.group).logX, Wsi = Math.pow(10, z.lk + lx), Wbook = Wsi / u.dens, g = 1 / Wbook;
      const run = runOrbit(HP, p, row, g), base = { P: r.base.P, varpiRate: r.base.varpiRate };
      const tv = targetValue(row, p, base, run);
      const o = { cand: key, group: z.group, emoji: r.emoji, WpredSI: Wsi, WfitSI: r.WbgSI, dex: Math.log10(Wsi / r.WbgSI), gainPred: g, target: { kind: row.target.kind, obs: row.target.obs, unit: row.target.unit },
        predicted: tv, residual: tv === null ? null : tv - row.target.obs,
        deltaRun: (() => { const d = deltas(base, run); return row.target.kind === 'period' ? d.dP : d.dAps; })(), deltaObs: r.deltaObs,
        relToEffect: (() => { const d = deltas(base, run), x = row.target.kind === 'period' ? d.dP : d.dAps; return (x === null || !r.deltaObs) ? null : (x - r.deltaObs) / r.deltaObs; })(),
        gain0: r.targetBase, steps: run.steps, nan: run.nan, wallSec: run.wallSec };
      out.push(o); log(o);
    }
  }
  return out;
}

/* ── 段 D: 応答の検算(fit の κ で transfer の δ を予測) ── */
export function partD(table) {
  const fits = table.filter((r) => r.role === 'fit' || r.role === 'record');
  const gm = (a) => a.length ? Math.pow(10, a.reduce((s, x) => s + Math.log10(x), 0) / a.length) : null;
  const kA = fits.filter((r) => r.target.kind !== 'period' && r.kappaAps > 0).map((r) => r.kappaAps);
  const kP = fits.filter((r) => r.target.kind === 'period' && r.kappaP > 0).map((r) => r.kappaP);
  const kappaAps = gm(kA), kappaP = gm(kP);
  const spreadA = kA.length ? Math.log10(Math.max(...kA) / Math.min(...kA)) : null;
  const checks = table.filter((r) => r.role === 'transfer').map((r) => ({ id: r.id, emoji: r.emoji, WbgSI: r.WbgSI, xBar: r.xBar, xi: r.xi, dAps: r.dAps, dP: r.dP,
    predAps: kappaAps && r.xi ? kappaAps * r.xi : null, ratioAps: (kappaAps && r.xi && r.dAps !== null) ? r.dAps / (kappaAps * r.xi) : null,
    predP: kappaP && r.xi ? kappaP * r.xi : null, ratioP: (kappaP && r.xi && r.dP !== null) ? r.dP / (kappaP * r.xi) : null, e: r.base.e }));
  return { kappaAps, kappaApsFrom: fits.filter((r) => r.target.kind !== 'period').map((r) => ({ id: r.id, kappa: r.kappaAps })), kappaApsSpreadDex: spreadA,
    kappaP, kappaPFrom: fits.filter((r) => r.target.kind === 'period').map((r) => ({ id: r.id, kappa: r.kappaP })), checks };
}

/* ── 段 E: 未フィットの本への予測(記録) ── */
export function partE(HP, cls, table, B, D, log = () => {}) {
  const set = B.all, keys = [];
  if (set.best1) keys.push(set.best1.key);
  for (const k of ['Ma3', 'const']) if (!keys.includes(k)) keys.push(k);
  const fullOf = (key) => Object.assign({ f: CANDIDATES.find((c) => c.key === key).f }, set.cands.find((z) => z.key === key));
  const planets = [];
  for (const r of table.filter((t) => t.role === 'unfit')) {
    const row = cls.rows.find((q) => q.id === r.id), p = find(HP, r.id), u = unitsOf(p.scaleExp), cent = u.U.century;
    const pl = P3.PLANETS.find((z) => z.id === r.id) || null;
    const n = 360 / r.base.P;   // 度/本の時間
    const pn1 = pl ? P3.pn1RateArcsecPerCentury(p.physics.G, p.bodies[0].m + p.bodies[1].m, p.physics.cLight, r.base.a, r.base.e, r.base.P, p.scaleExp) : null;
    const obsP = pl ? pl.period.s : null;
    const rowsOut = [];
    const preds = keys.map((key) => { const c = fullOf(key); const q = Object.assign({}, r.sys, { deltaObs: null }); const x = c.f(q); return { key, Wsi: Math.pow(10, c.p1.logk) * x }; });
    // 応答の分解の逆(参考): 1PN の式の値を引きずりで出すのに要る W(κ̄ は fit の近点の本から)—— 観測ではない
    if (pn1 !== null && D.kappaAps) { const dPn = (pn1 / 3600 / cent) * r.base.P / 360; preds.push({ key: 'ref1pn', Wsi: D.kappaAps * r.sys.sumW / dPn, note: '1PN の式の値を出すのに要る W(参考 —— 観測ではない)' }); }
    for (const pr of preds) {
      const Wbook = pr.Wsi / u.dens, g = 1 / Wbook, run = runOrbit(HP, p, row, g);
      const dRate = (run.varpiRate !== null && r.base.varpiRate !== null) ? (run.varpiRate - r.base.varpiRate) * 3600 * cent : null;
      const xi = r.sumWbook / Wbook;   // 小さい X の近似(ξ ≈ X)
      const o = { cand: pr.key, WpredSI: pr.Wsi, gain: g, xBar: xi, apsDiffArcsecPerCentury: dRate, respPredArcsecPerCentury: D.kappaAps ? D.kappaAps * xi * n * 3600 * cent : null,
        periodShiftSec: (run.P && r.base.P) ? (run.P - r.base.P) * u.Ts : null, periodDays: run.P ? run.P * u.Ts / 86400 : null, nan: run.nan, steps: run.steps, wallSec: run.wallSec, note: pr.note };
      rowsOut.push(o); log(r, o);
    }
    planets.push({ id: r.id, emoji: r.emoji, pn1RefArcsecPerCentury: pn1, obsPeriodDays: obsP ? obsP / 86400 : null, obsPeriodSource: pl ? pl.period.source : null,
      gain0: { periodDays: r.base.P * u.Ts / 86400, apsArcsecPerCentury: r.base.varpiRate !== null ? r.base.varpiRate * 3600 * cent : null, a: r.base.a, e: r.base.e }, preds: rowsOut });
  }
  // 🍩(粒が多い本 —— 抽出器 ring): 2 公転(timeRef.pRef)の走行で X̄ と位置の差だけを記録
  const rings = [];
  for (const row of cls.rows.filter((q) => q.ex === 'ring' && q.role === 'unfit')) {
    const p = find(HP, row.id), u = unitsOf(p.scaleExp), dt = p.physics.stepDt, steps = Math.round(2 * p.timeRef.pRef / dt);
    const build = (g) => { const v = HP.validatePreset(withGain(p, g)); HP.sim.build(v.preset); return HP.sim; };
    const S0 = build(0), n = S0.n, ci = 0, eps = p.physics.relativeDrag.eps, e2 = eps * eps;
    const sw = [], dist = [];
    for (let i = 0; i < n; i++) { if (i === ci || !(S0.m[i] > 0)) continue; let s = 0;
      for (let j = 0; j < n; j++) { if (j === i || !(S0.m[j] > 0)) continue; const dx = S0.x[j] - S0.x[i], dy = S0.y[j] - S0.y[i], dz = S0.z[j] - S0.z[i], r2 = dx * dx + dy * dy + dz * dz, qq = r2 + e2; s += S0.m[j] * Math.sqrt(r2) / (qq * qq); }
      sw.push(s); dist.push(Math.hypot(S0.x[i] - S0.x[ci], S0.y[i] - S0.y[ci], S0.z[i] - S0.z[ci])); }
    const med = (a) => { const b = a.slice().sort((x, y) => x - y); return b[Math.floor(b.length / 2)]; };
    const aMed = med(dist), mMed = med(Array.from(S0.m.subarray(1, n))), M = S0.m[ci];
    const t0 = Date.now(); for (let k = 0; k < steps; k++) S0.step(dt);
    const X0 = Array.from(S0.x.subarray(0, n)), Y0 = Array.from(S0.y.subarray(0, n)), Z0 = Array.from(S0.z.subarray(0, n)), w0 = (Date.now() - t0) / 1000;
    const sys = { M: M * u.Ms, m: mMed * u.Ms, a: aMed * u.Lm, R: p.bodies[ci].radius * u.Lm, eps: eps * u.Lm, Om: Math.abs(p.bodies[ci].spin) / u.Ts, sumW: med(sw) * u.dens };
    sys.w = Math.sqrt(SI.G * sys.M / sys.a ** 3); sys.Wext = cosmicBackground(p.scaleExp, eps).WSI;
    const preds = keys.map((key) => { const c = fullOf(key), x = c.f(Object.assign({}, sys, { deltaObs: null })); return { key, Wsi: Math.pow(10, c.p1.logk) * x }; });
    const out = [];
    for (const pr of preds) {
      const Wbook = pr.Wsi / u.dens, g = 1 / Wbook, t1 = Date.now(), S = build(g);
      for (let k = 0; k < steps; k++) S.step(dt);
      let dr = 0, rr = 0; for (let i = 1; i < n; i++) { dr += Math.hypot(S.x[i] - X0[i], S.y[i] - Y0[i], S.z[i] - Z0[i]); rr += Math.hypot(X0[i] - X0[ci], Y0[i] - Y0[ci], Z0[i] - Z0[ci]); }
      const st = HP.inertialDragState(S) || {};
      const o = { cand: pr.key, WpredSI: pr.Wsi, gain: g, xMed: med(sw) / Wbook, xMax: Math.max(...sw) / Wbook, relPosDiff: dr / rr, nan: S.hasNaN(), halt: S.inertialDragHalt === true, uMax: st.uMax, steps, wallSec: (Date.now() - t1) / 1000 };
      out.push(o); log({ id: row.id, emoji: row.emoji }, o);
    }
    rings.push({ id: row.id, emoji: row.emoji, n, steps, dt, aMedSI: sys.a, sumWMedSI: sys.sumW, gain0: { wallSec: w0 }, preds: out });
  }
  return { keys, planets, rings };
}

export function gatesOf(cls, table, B, Cc, D, E) {
  const fits = table.filter((r) => r.role === 'fit');
  const recs = table.filter((r) => r.role === 'record');
  return {
    selection: fits.length >= 3 && recs.length === RETIRED_FIT_RECORDS.length && cls.rows.some((r) => r.role === 'unfit'),
    finite: table.every((r) => !r.base.nan && r.base.complete && (!r.run || (!r.run.nan && r.run.complete))),
    reproduceRecord: fits.every((r) => r.target.model === null || (r.targetMeasured !== null && Math.abs(r.targetMeasured - r.target.model) <= 1e-6 * Math.abs(r.target.obs))),
    reproduceRetired: recs.every((r) => r.targetMeasured !== null && Math.abs(r.targetMeasured - r.target.obs) <= 1e-3),
    wbgFromDecl: table.every((r) => r.gain === 0 || (r.Wbg > 0 && Math.abs(r.Wbg * r.gain * (r.Cd ? 1 / r.Cd : 1) - 1) < 1e-12)),
    kepler: table.filter((r) => r.role !== 'transfer').every((r) => Math.abs(r.sys.keplerRatio - 1) < 0.03),
    candidates: B.all.cands.filter((z) => z.kind === 'scale').length >= 9 && B.all.groups.length >= 3,
    loo: Cc.every((z) => z.skipped || (!z.nan && z.predicted !== null)),
    response: D.kappaAps > 0 && D.checks.every((z) => z.dAps !== null || z.dP !== null),
    predictions: E.planets.length > 0 && E.planets.every((z) => z.preds.every((q) => !q.nan && q.apsDiffArcsecPerCentury !== null)) && E.rings.every((z) => z.preds.every((q) => !q.nan)),
  };
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) {
  const t0 = Date.now();
  const OUT_PATH = process.env.W301G_OUT || path.join(ROOT, 'tests', 'out', 'wbglaw-w301g.json');
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
  pinDecl315c();   // 第315便c(AN406): 在位の 7 本の宣言を移行の前の写しへ(本ごとの門 —— 基点の html では no-op・正本の欄は足さない)
  pinDecl303();   // 第304便c: 🌦️🌔 を第303便の宣言へ(軟化 0.01・初期配置・W_bg —— 続く pinDecl302 が第302便の欄を戻す)
  pinDecl302();   // 第303便a: 在位の惑星の本の G_loc と フィットの本の W_bg・初期配置を第302便の宣言に戻して測る(歴史の値を保つ)
  const e3 = (x) => (x === null || x === undefined || !Number.isFinite(x)) ? '—' : Number(x).toExponential(3);
  const cls = classify(HP);
  console.log('分類 ' + cls.rows.map((r) => r.emoji + r.role).join(' ') + '・除外 ' + cls.excluded.map((z) => z.emoji).join(''));
  const A = partA(HP, cls, (r) => console.log(`A ${r.emoji} ${r.id} ${r.role} W ${e3(r.WbgSI)} Σw ${e3(r.sys.sumW)} ξ ${e3(r.xi)} δaps ${e3(r.dAps)} δP ${e3(r.dP)} δobs ${e3(r.deltaObs)} κ ${e3(r.kappaAps)}/${e3(r.kappaP)} 標的 ${r.targetMeasured}(${(r.base.wallSec + (r.run ? r.run.wallSec : 0)).toFixed(1)} s)`));
  const B = partB(A);
  for (const sk of Object.keys(B)) { console.log(`B ${sk}: 系 ${B[sk].groups.length}・best1 ${JSON.stringify(B[sk].best1)}・best2 ${JSON.stringify(B[sk].best2)}・応答 ${JSON.stringify(B[sk].response)}`);
    for (const z of B[sk].cands) if (!z.missing) console.log(`   ${z.key}: p1 rms ${z.p1 ? e3(z.p1.rms) : '—'} loo ${z.p1 ? e3(z.p1.looRms) : '—'} / p2 rms ${z.p2 && !z.p2.insufficient ? e3(z.p2.rms) : '—'} loo ${z.p2 && !z.p2.insufficient ? e3(z.p2.looRms) : '—'} β ${z.p2 && !z.p2.insufficient ? z.p2.beta.toFixed(3) : '—'} / p0 ${z.p0 ? e3(z.p0.rms) : ''}`); }
  const Cc = partC(HP, cls, A, B, (o) => console.log(`C ${o.cand} ${o.emoji} W ${e3(o.WpredSI)}(${o.dex.toFixed(3)} dex)→ ${o.predicted} ${o.target.unit}(観測 ${o.target.obs}・効果に対する相対 ${e3(o.relToEffect)})`));
  const D = partD(A);
  console.log('D κ_aps ' + e3(D.kappaAps) + '(幅 ' + e3(D.kappaApsSpreadDex) + ' dex)・κ_P ' + e3(D.kappaP) + ' ' + JSON.stringify(D.checks.map((z) => [z.emoji, T(z.ratioAps, 4), T(z.ratioP, 4)])));
  const E = partE(HP, cls, A, B, D, (r, o) => console.log(`E ${r.emoji} ${o.cand} W ${e3(o.WpredSI)} Δϖ̇ ${e3(o.apsDiffArcsecPerCentury)}″/世紀(応答の予測 ${e3(o.respPredArcsecPerCentury)})ΔP ${e3(o.periodShiftSec)} s${o.relPosDiff !== undefined ? ' 位置差 ' + e3(o.relPosDiff) : ''}`));
  const gates = gatesOf(cls, A, B, Cc, D, E);
  const out = { meta: null, version: HARNESS_VERSION, si: SI, selection: { rows: cls.rows.map((r) => ({ id: r.id, emoji: r.emoji, role: r.role, group: r.group, ex: r.ex, dt: r.dt, N: r.N })), excluded: cls.excluded,
      retiredFitRecords: RETIRED_FIT_RECORDS },
    candidates: CANDIDATES.map((c) => ({ key: c.key, label: c.label, kind: c.kind })), table: A, fits: B, loo: Cc, response: D, predictions: E, gates, ok: Object.values(gates).every(Boolean) };
  const CODE = ['tests/exp-w301g-wbglaw.mjs', 'tests/lib-w315c-legacy7.mjs', 'tests/lib-w302c-pre.mjs', 'tests/exp-w295c-inertial3.mjs', 'tests/exp-w298c-moon3d.mjs', 'tests/exp-w299c-planets3d.mjs', 'tests/lib-w299c-planets3d.mjs', 'tests/lib-w297b-fit.mjs',
    'tests/exp-w301a-dragnorm.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs', 'tests/lib-w303a-pre.mjs', 'tests/lib-w304c-pre.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第301便g', target: TARGET, code: CODE, inputs: [TARGET, LEGACY7_DATA_FILE, DECL302_DATA_FILE, DECL303_DATA_FILE] }), {
    harnessVersion: HARNESS_VERSION, loadErrors: errors.length,
    ruling: '原仮定者の裁定(AN300 —— 第91報への追加): 慣性決定力は、重力決定力に比べて近距離の天体の影響が大きい為、背景慣性決定力がサンプル毎に異なるのは問題無い。法則性の探索を行う',
    reading: '統括の検証項目 R185(W_bg を近距離の天体の影響で説明する候補を次元の合う形で列挙し、自由パラメータ 1〜2 で当てはめ、leave-one-out と未フィットの本への予測で確かめる —— 本の宣言は変えない)',
    notClaim: ['法則を発見した', 'W_bg が決まった', 'gain を系をまたぐ定数と呼ぶ', '現実の再現の主張'] });
  out.elapsedS = (Date.now() - t0) / 1000;
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 1) + '\n');
  console.log('gates ' + JSON.stringify(gates));
  console.log('→ ' + path.relative(ROOT, OUT_PATH) + '(' + out.elapsedS.toFixed(1) + ' s)・ok ' + out.ok);
  process.exit(out.ok ? 0 : 1);
}
