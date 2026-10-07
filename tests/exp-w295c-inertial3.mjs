// 第295便c(原仮定者の裁定(第85報)「慣性決定力版サンプルを追加する。対象は、地球と月と太陽、水星と太陽、冥王星とカロン」・統括の検証項目 R155)——
// **慣性決定力版サンプル 3 本**(🌤️ earthMoonSunInertial・🟤 mercurySunInertial・🟣 plutoCharonInertial)の宣言の門と、同じ抽出器で測った値の記録の器
// (Node だけ —— 対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、エンジン本体を走らせる。走行は子プロセスで並列)。
//
// ■ 何を測るか(**値だけ** —— 合否・年数の約束は書かない・gain はフィットしない)
//   gain は 🌛 earthMoonInertial の 514182(1 単位 = 10⁶ m / 10² s / 10²⁵ kg)を**同じ SI 係数** C_d,SI = 514182 × (10⁶ m)³ / 10²⁵ kg = 0.0514182 m³/kg として
//   各本の単位へ換算した値(L8/M27 → 51.4182・L5/M24 → 5.14182×10⁷)。器は 🌛 の宣言と各本の scaleExp から換算し直して宣言と相対 1e-12 で照合する。
//   (1) 宣言の門(3 本): 親の bodies の写し(🌤️ は地球の dragCore を外して比べる)・physics は親から geoPN(→3)と relativeDrag だけが違う・
//       relativeDrag の宣言(gain・eps = 重力の軟化・pairs・history・compose 未記載)・受理の警告 0・geoLawOfSim = inertial-drag・実効番号 0・
//       2000 步で NaN なし・gain が宣言のまま・上界の超過/拒否 0。
//   (2) 🌤️: tests/exp-w293d-swing.mjs の childTask(kind:"cond"・dt 0.016 と 0.008・revMax 118・窓 [0,27][27,54][54,81][81,108][0,118])を再利用して、
//       A1(本の宣言のまま —— 慣性の対は地球と月だけ)・A2(pairs:"all" —— 太陽も慣性の源)・G0(gain 0)の 3 条件の近点周期・恒星月・離心率・
//       近点方位の直線 fit の残差 RMS。childTask は 🔆 の名前で本を引くので、器の中だけの HP の写し(allPresets が条件の写しを 🔆 の名前で返す)を渡す
//       (id は build に効かない —— 本そのものとの 200 步のビット同一を門で確かめる)。
//   (3) 🟤・🟣: 同じ初期状態で gain 0 と移送 gain を 8 公転・h と h/2(lib-w280b-emgrid の runRow と同じ検出器 B・同じ式と順序 —— 距離の極値と u の比を
//       足して記録・h の 4 走行は runRow そのものと近点の傾きと平均周期がビット同一であることを門で確かめる): 公転周期・近点率(°/公転・″/世紀)・
//       距離振幅・eProxy・|u|/|v|。**入力速度の写像の限界**: 親の vx/vy を力学速度 v にそのまま与えた(ẋ=v+u)ので、観測の座標速度と同一の比較ではない。
//
// ■ しないこと・言わないこと
//   ・gain を再フィットしない(8.85 年・43″/世紀・公転周期のどれにも合わせない)。太陽・水星・冥王星・カロンの内部核を捏造しない(点源)。
//   ・「月を再現した」「43″ を再現」「較正 合」「C_d は普遍定数」と書かない。較正母集団に入れない(sampleClass:"principle")。
//
// 実行(Node だけ・Chromium 不要・子プロセス 3 本 —— W295C_WORKERS で変える。結果は並列数に依らない):
//   node tests/exp-w295c-inertial3.mjs          → 正本 tests/out/inertial3-w295c.json(W295C_OUT で出力先を変える)
// 読む正本: tests/out/swing-w293d.json(第293便d の一時プリセットの A1/A2/C との照合だけ —— 測った値には使わない)。
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import { fitPeri, runRow } from './lib-w280b-emgrid.mjs';
import * as SW from './exp-w293d-swing.mjs';
const REGEN_SCOPE = {"presets":["earthMoonInertial","earthMoonSunInertial","emAuditSolar","mercuryReal","mercurySunInertial","plutoCharonDiagInput","plutoCharonInertial"],"roots":["HP.DRAG_CORE_RMAX_FACTOR","HP.DRAG_CORE_VERSION","HP.REL_DRAG_COMPOSE_DEFAULT","HP.REL_DRAG_INERTIAL_VERSION","HP.REL_DRAG_SOLVE_FROM_DEFAULT","HP.allPresets","HP.dfmMeshVelocityFieldAt","HP.dragCoreState","HP.geoEffectiveMode","HP.geoLawOfSim","HP.inertialDragState","HP.sim","HP.validatePreset"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w295c-inertial3-1';
export const SOURCE_ID = 'earthMoonInertial';      // 🌛(gain の出どころ —— 1 次元フィットの推定)
export const BOOKS = Object.freeze([
  Object.freeze({ key: 'ems', id: 'earthMoonSunInertial', parent: 'emAuditSolar', emoji: '🌤️', pairs: [[1, 2]], dragCore: { 1: { massFrac: 0.325, radius: 0.0348 } },
    notClaim: ['solar_cal', 'gain_universal', 'apsidal_8p85_transfer'], dt: 0.016 }),
  Object.freeze({ key: 'mer', id: 'mercurySunInertial', parent: 'mercuryReal', emoji: '🟤', pairs: 'all', dragCore: {},
    notClaim: ['solar_cal', 'perihelion_43', 'gain_universal'], dt: 0.016, ci: 0, oi: 1 }),
  Object.freeze({ key: 'plu', id: 'plutoCharonInertial', parent: 'plutoCharonDiagInput', emoji: '🟣', pairs: 'all', dragCore: {},
    notClaim: ['solar_cal', 'period_fit', 'gain_universal'], dt: 0.16, ci: 0, oi: 1 }),
]);
export const DRAG_CORE_SOURCE = Object.freeze({ massFrac: 0.325, radius: 3.48 });   // 🌛 の起点の宣言(🌛 単位 —— 3.48×10⁶ m)
export const EM_CONDS = Object.freeze([
  { key: 'A1', label: '本の宣言のまま —— 慣性の対は地球と月だけ(太陽は重力の第三体)' },
  { key: 'A2', label: '対照 —— pairs:"all"(太陽も慣性の源・pinned の太陽は u=0 のまま源)' },
  { key: 'G0', label: '対照 —— gain 0(慣性引きずりなし —— 🔆 の重力だけの三体・geoPN 3)' },
]);
export const EM_RUN = Object.freeze({ dts: [0.016, 0.008], revMax: 118, spans: SW.BASE_SPANS });
export const TWO_RUN = Object.freeze({ revMax: 8, gains: ['gain0', 'gain'] });
export const DECL_STEPS = 2000, ID_STEPS = 200;
const clone = (x) => JSON.parse(JSON.stringify(x));
const find = (HP, id) => HP.allPresets().find((q) => q.id === id);
const bookOf = (k) => BOOKS.find((b) => b.key === k);
/** 系の時間単位(scaleExp.T)から年・日・世紀の単位数。 */
export function timeUnits(scaleExp) { const T = Math.pow(10, scaleExp.T); return { sec: T, year: 365.25 * 86400 / T, day: 86400 / T, century: 36525 * 86400 / T }; }

/* ── 換算(🌛 の宣言と各本の scaleExp から)── */
export function conversion(HP) {
  const src = find(HP, SOURCE_ID), se = src.scaleExp, g0 = src.physics.relativeDrag.gain;
  const cdSI = g0 * Math.pow(10, 3 * se.L) / Math.pow(10, se.M);   // [m³/kg]
  const rows = BOOKS.map((b) => { const p = find(HP, b.id), s = p.scaleExp, unit = Math.pow(10, 3 * s.L) / Math.pow(10, s.M);
    const want = cdSI / unit, got = p.physics.relativeDrag.gain;
    return { id: b.id, emoji: b.emoji, scaleExp: s, unitM3PerKg: unit, gainWant: want, gainDeclared: got, rel: (got - want) / want,
      epsMeters: p.physics.relativeDrag.eps * Math.pow(10, s.L), softeningMeters: p.physics.softening * Math.pow(10, s.L) }; });
  return { source: { id: SOURCE_ID, scaleExp: se, gain: g0, epsMeters: src.physics.relativeDrag.eps * Math.pow(10, se.L) }, cdSI, rows,
    formula: 'C_d,SI = gain_🌛 × (10^L_🌛 m)³ / 10^M_🌛 kg・gain_本 = C_d,SI ÷ ((10^L_本 m)³ / 10^M_本 kg) —— 時間の単位は効かない(u = C_d Σ m 𝒦 Δv は無次元の係数 × 速度)' };
}

/* ── 宣言の門 ─────────────────────────────────────────────── */
function stripCore(bodies) { return bodies.map((b) => { const c = clone(b); delete c.dragCore; return c; }); }
export function declGate(HP) {
  const out = [];
  for (const b of BOOKS) {
    const p = find(HP, b.id), par = find(HP, b.parent), bad = [];
    if (!p || !par) { out.push({ id: b.id, ok: false, bad: ['本か親が無い'] }); continue; }
    const bodiesSame = JSON.stringify(stripCore(p.bodies)) === JSON.stringify(par.bodies);
    if (!bodiesSame) bad.push('bodies が親の写しでない');
    const coreIdx = p.bodies.map((z, i) => (z.dragCore ? i : -1)).filter((i) => i >= 0);
    const coreOk = JSON.stringify(Object.fromEntries(coreIdx.map((i) => [i, p.bodies[i].dragCore]))) === JSON.stringify(b.dragCore);
    if (!coreOk) bad.push('dragCore の宣言(🌤️ の地球だけ)');
    const keys = [...new Set(Object.keys(p.physics).concat(Object.keys(par.physics)))];
    const physDiff = keys.filter((k) => JSON.stringify(p.physics[k]) !== JSON.stringify(par.physics[k])).sort();
    if (JSON.stringify(physDiff) !== JSON.stringify(['geoPN', 'relativeDrag'])) bad.push('physics の親との差が geoPN と relativeDrag だけでない: ' + physDiff.join(','));
    const ph = p.physics, rd = ph.relativeDrag || {};
    const rdKeys = Object.keys(rd).sort();
    if (!(ph.geoPN === 3 && ph.kFrame === 0 && ph.geodesic === undefined && rd.law === 'inertial' && rd.history === 'positions' && rd.compose === undefined
      && rd.eps === ph.softening && JSON.stringify(rd.pairs) === JSON.stringify(b.pairs) && JSON.stringify(rdKeys) === JSON.stringify(['eps', 'gain', 'history', 'law', 'pairs'])))
      bad.push('relativeDrag/geoPN の宣言');
    const sameMeta = JSON.stringify(p.scaleExp) === JSON.stringify(par.scaleExp) && p.integrator === par.integrator;
    if (!sameMeta) bad.push('scaleExp/integrator が親と違う');
    const prim = HP.allPresets().find((q) => q.familyId === p.familyId && q.familyRole === 'primary');
    const cls = { group: p.group, primary: prim ? prim.id : null, primaryGroup: prim ? prim.group : null, familyId: p.familyId, familyRole: p.familyRole, sampleClass: p.sampleClass, fidelity: p.fidelity, referenceKind: p.referenceKind, notClaim: p.notClaim,
      activeParams: p.activeParams, emoji: p.emoji, parentGroup: par.group, parentRole: par.familyRole, parentFamily: par.familyId };
    if (!(prim && p.group === prim.group && p.familyId === par.familyId && p.familyRole === 'variant' && p.sampleClass === 'principle' && p.fidelity === 'real'
      && p.emoji === b.emoji && JSON.stringify(p.notClaim) === JSON.stringify(b.notClaim) && JSON.stringify(p.activeParams) === JSON.stringify(['geoPN', 'dispMag'])))
      bad.push('分類(群・家族・variant・principle・real・絵文字・notClaim・activeParams)');
    const v = HP.validatePreset(clone(p));
    if (!(v.ok && (v.warnings || []).length === 0)) bad.push('受理の警告: ' + JSON.stringify(v.warnings || v.errors).slice(0, 120));
    let run = null;
    if (v.ok) {
      HP.sim.build(v.preset);
      const S = HP.sim, law = HP.geoLawOfSim(S), eff = HP.geoEffectiveMode(S);
      for (let k = 0; k < DECL_STEPS; k++) S.step(b.dt);
      const st = HP.inertialDragState(S), core = HP.dragCoreState(S);
      run = { law, eff, steps: DECL_STEPS, dt: b.dt, nan: S.hasNaN(), gainAfter: S.relDrag ? S.relDrag.gain : null, pairsAfter: S.relDrag ? S.relDrag.pairs : null,
        drag: st ? { boundMax: st.boundMax, boundOver: st.boundOver, reject: st.reject, noHistory: st.noHistory, uMax: st.uMax } : null,
        core: core ? core.sources.map((z) => ({ index: z.index, R: z.R, rMax: z.rMax, rMaxFrom: z.rMaxFrom, interpRelMax: z.interpRelMax, interpRelMaxFar: z.interpRelMaxFar, jumpAtRMax: z.jumpAtRMax })) : null };
      if (!(law === 'inertial-drag' && eff === 0 && !run.nan && run.gainAfter === rd.gain && st && st.boundOver === 0 && st.reject === 0)) bad.push('走行(law・実効番号・NaN・gain・上界)');
    }
    out.push({ id: b.id, parent: b.parent, emoji: b.emoji, ok: bad.length === 0, bad, bodiesSame, coreOk, physDiff, relativeDrag: rd, cls, run });
  }
  return out;
}
/** childTask に渡す HP の写し(allPresets が条件の写しを 🔆 の名前で返す)と、本そのものとの 200 步のビット同一。 */
export function emVariant(HP, cond) {
  const p = clone(find(HP, bookOf('ems').id));
  if (cond === 'A2') p.physics.relativeDrag.pairs = 'all';
  if (cond === 'G0') p.physics.relativeDrag.gain = 0;
  return p;
}
export function asSolarName(HP, cond) { return Object.assign(emVariant(HP, cond), { id: SW.SOLAR_ID }); }
export function proxyHP(HP, cond) {
  const q = asSolarName(HP, cond);
  const X = Object.create(HP);
  X.allPresets = () => [q];
  return X;
}
function stHash(S) {
  let h1 = 0x811c9dc5, h2 = 0x01000193; const f = new Float64Array(1), u8 = new Uint8Array(f.buffer);
  for (const k of ['x', 'y', 'vx', 'vy']) for (let i = 0; i < S.n; i++) { f[0] = S[k][i]; for (let j = 0; j < 8; j++) { h1 = Math.imul(h1 ^ u8[j], 16777619) >>> 0; h2 = Math.imul(h2 ^ u8[j], 2246822519) >>> 0; } }
  return h1.toString(16).padStart(8, '0') + h2.toString(16).padStart(8, '0');
}
export function proxyIdentity(HP) {
  const b = bookOf('ems'), run = (p) => { const v = HP.validatePreset(clone(p)); HP.sim.build(v.preset); for (let k = 0; k < ID_STEPS; k++) HP.sim.step(b.dt); return stHash(HP.sim); };
  const direct = run(find(HP, b.id)), viaProxy = run(asSolarName(HP, 'A1'));
  return { steps: ID_STEPS, direct, viaProxy, same: direct === viaProxy };
}

/* ── 二体(🟤🟣)の走行: runRow と同じ検出器 B(同じ式・同じ順序)+ 距離の極値・|u|/|v| ── */
export function twoBodyPreset(HP, key, gainKey) {
  const p = clone(find(HP, bookOf(key).id));
  if (gainKey === 'gain0') p.physics.relativeDrag.gain = 0;
  return p;
}
export function runPair(HP, preset, o) {
  const { ci, oi, dt, revMax } = o;
  const v = HP.validatePreset(clone(preset));
  if (!v.ok) throw new Error('validatePreset: ' + JSON.stringify(v.errors).slice(0, 200));
  HP.sim.build(v.preset);
  const S = HP.sim;
  const rel = () => { const dx = S.x[oi] - S.x[ci], dy = S.y[oi] - S.y[ci]; return [dx, dy, Math.hypot(dx, dy), Math.atan2(dy, dx)]; };
  let [, , r0, th0] = rel();
  const dvx0 = S.vx[oi] - S.vx[ci], dvy0 = S.vy[oi] - S.vy[ci];
  const mu = S.params.G * (S.m[ci] + S.m[oi]), v2 = dvx0 * dvx0 + dvy0 * dvy0;
  const a0 = 1 / (2 / r0 - v2 / mu), P0 = 2 * Math.PI * Math.sqrt(a0 * a0 * a0 / mu);
  let angPrev = th0, angAcc = 0, r1 = r0, r2 = r0, th1 = th0, th2 = th0;
  const B = [], rev = [];
  let rMin = Infinity, rMax = -Infinity, k = 0, nan = false;
  const U = { n: 0, sum: 0, max: 0 };
  for (; ; k++) {
    S.step(dt);
    const [, , rr, th] = rel();
    if (!Number.isFinite(rr)) { nan = true; break; }
    if (rev.length < revMax) { if (rr < rMin) rMin = rr; if (rr > rMax) rMax = rr; }
    let d = th - angPrev; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
    const prevAcc = angAcc; angAcc += d; angPrev = th;
    const nP = Math.floor(Math.abs(prevAcc) / (2 * Math.PI)), nN = Math.floor(Math.abs(angAcc) / (2 * Math.PI));
    if (nN > nP) { const tg = Math.sign(angAcc) * nN * 2 * Math.PI; const fr = (tg - prevAcc) / (angAcc - prevAcc); rev.push((k - 1 + fr + 1) * dt); }
    if (k >= 2 && r1 < r2 && r1 < rr) {
      const dd = (r2 - 2 * r1 + rr), fr = (dd !== 0) ? 0.5 * (r2 - rr) / dd : 0;
      let a1 = th2, a2 = th1, a3 = th;
      while (a2 - a1 > Math.PI) a2 -= 2 * Math.PI; while (a2 - a1 < -Math.PI) a2 += 2 * Math.PI;
      while (a3 - a2 > Math.PI) a3 -= 2 * Math.PI; while (a3 - a2 < -Math.PI) a3 += 2 * Math.PI;
      B.push({ ang: a2 + 0.5 * fr * (a3 - a1) + 0.5 * fr * fr * (a3 - 2 * a2 + a1), k: k + fr, r: r1 });
    }
    r2 = r1; r1 = rr; th2 = th1; th1 = th;
    if ((k & 255) === 0 && S._rdUX) {
      const ux = S._rdUX[oi] - S._rdUX[ci], uy = S._rdUY[oi] - S._rdUY[ci], vx = S.vx[oi] - S.vx[ci], vy = S.vy[oi] - S.vy[ci];
      const q = Math.hypot(ux, uy) / Math.hypot(vx, vy); U.n++; U.sum += q; if (q > U.max) U.max = q;
    }
    if (rev.length >= revMax) { k++; break; }
  }
  const tCut = rev.length >= revMax ? rev[revMax - 1] : null;
  const fb = tCut === null ? null : fitPeri(B.filter((p) => p.k * dt <= tCut), rMin, rMax, P0, dt);
  const st = HP.inertialDragState(S);
  return { dt, steps: k, revN: rev.length, nan: nan || S.hasNaN(), osc0: { r: r0, a: a0, P: P0 }, rev, rMin, rMax, eProxy: (rMax - rMin) / (rMax + rMin), B: fb,
    uRatio: U.n ? { n: U.n, mean: U.sum / U.n, max: U.max } : null, warnings: v.warnings || [],
    drag: st ? { boundMax: st.boundMax, boundOver: st.boundOver, reject: st.reject, noHistory: st.noHistory, uMax: st.uMax } : null };
}
/** runRow そのもの(同じ検出器 B)との照合 —— 近点の傾きと平均周期がビット同一。 */
export function runRowCheck(HP, preset, o, mine) {
  const r = runRow(HP, preset, { ci: o.ci, oi: o.oi, dt: o.dt, revMax: o.revMax, windows: [o.revMax] });
  const w = r.windows[0], meanMine = (mine.rev[mine.rev.length - 1] - mine.rev[0]) / (mine.rev.length - 1);
  return { slopeDegPerPeri: [w.B.slopeDegPerPeri, mine.B.slopeDegPerPeri], slopeDegPerTime: [w.B.slopeDegPerTime, mine.B.slopeDegPerTime], eProxy: [w.eProxy, mine.eProxy],
    sidMean: [r.sidMeanDays * 1, meanMine / 1], same: w.B.slopeDegPerPeri === mine.B.slopeDegPerPeri && w.B.slopeDegPerTime === mine.B.slopeDegPerTime && w.eProxy === mine.eProxy
      && r.sidMeanDays === meanMine / 864 };
}

/* ── 子プロセスの仕事 ─────────────────────────────────────────── */
export function taskSpecs() {
  const out = [];
  for (const dt of EM_RUN.dts) for (const c of EM_CONDS) out.push({ key: `em-${c.key}-${dt}`, kind: 'em', cond: c.key, dt, revMax: EM_RUN.revMax, spans: EM_RUN.spans });
  for (const key of ['mer', 'plu']) { const b = bookOf(key);
    for (const g of TWO_RUN.gains) for (const [hk, dt] of [['h', b.dt], ['h2', b.dt / 2]]) out.push({ key: `${key}-${g}-${hk}`, kind: 'two', book: key, gain: g, hk, dt, revMax: TWO_RUN.revMax, check: hk === 'h' }); }
  return out;
}
export function childTask(HP, spec) {
  const t0 = Date.now();
  if (spec.kind === 'em') {
    const R = SW.childTask(proxyHP(HP, spec.cond), { key: spec.key, kind: 'cond', law: null, sun: 'asIs', dt: spec.dt, revMax: spec.revMax, spans: spec.spans });
    return Object.assign(R, { cond: spec.cond, wallSec: (Date.now() - t0) / 1000 });
  }
  const b = bookOf(spec.book), o = { ci: b.ci, oi: b.oi, dt: spec.dt, revMax: spec.revMax };
  const p = twoBodyPreset(HP, spec.book, spec.gain);
  const R = runPair(HP, p, o);
  let check = null;
  if (spec.check) check = runRowCheck(HP, p, o, R);
  return { key: spec.key, kind: 'two', book: spec.book, gain: spec.gain, hk: spec.hk, dt: spec.dt, steps: R.steps, revN: R.revN, nan: R.nan, osc0: R.osc0, rev: R.rev,
    rMin: R.rMin, rMax: R.rMax, eProxy: R.eProxy, B: R.B, uRatio: R.uRatio, drag: R.drag, warnings: R.warnings, check, wallSec: (Date.now() - t0) / 1000 };
}

/* ── 集計(親)── */
const rel = (a, b) => (a === null || b === null || a === undefined || b === undefined) ? null : (b - a) / a;
function twoReading(HP, key, r) {
  const b = bookOf(key), p = find(HP, b.id), U = timeUnits(p.scaleExp), Lm = Math.pow(10, p.scaleExp.L);
  const rv = r.rev, n = rv.length, periodMean = (rv[n - 1] - rv[0]) / (n - 1), period2 = rv[1] - rv[0];
  return { dt: r.dt, steps: r.steps, revN: n, nan: r.nan,
    periodMeanDays: periodMean / U.day, periodMeanSec: periodMean * U.sec, period2Sec: period2 * U.sec, period2Days: period2 / U.day,
    apsDegPerOrbit: r.B.slopeDegPerPeri, apsArcsecPerCentury: r.B.slopeDegPerTime * U.century * 3600, nPeri: r.B.nPeri, residRmsDeg: r.B.residRmsDeg,
    ampUnits: (r.rMax - r.rMin) / 2, ampKm: (r.rMax - r.rMin) / 2 * Lm / 1000, rMin: r.rMin, rMax: r.rMax, eProxy: r.eProxy,
    uRatioMean: r.uRatio ? r.uRatio.mean : null, uRatioMax: r.uRatio ? r.uRatio.max : null, drag: r.drag };
}
export function assemble(HP, res, J293 = null) {
  const em = {}, two = {};
  for (const c of EM_CONDS) {
    const h = res[`em-${c.key}-${EM_RUN.dts[0]}`], h2 = res[`em-${c.key}-${EM_RUN.dts[1]}`];
    const win = (R) => R.windows.map((w) => ({ from: w.from, to: w.to, complete: w.complete, apsPeriodYr: w.apsPeriodYr, dwRadPerPeri: w.dwRadPerPeri, siderealDays: w.siderealDays,
      eMean: w.eMean, eMin: w.eMin, eMax: w.eMax, eProxy: w.eProxy, residRmsDeg: w.residRmsDeg, incSdRad: w.incSdRad, nPeri: w.nPeri, anomDays: w.anomDays }));
    const W1 = win(h), W2 = win(h2);
    em[c.key] = { label: c.label, h: { dt: h.dt, steps: h.steps, revN: h.revN, nan: h.nan, warnings: h.warnings, windows: W1, drag: h.drag, core: h.core ? h.core.sources : null, uAcc: h.uAcc, ledgerEnd: h.ledger[h.ledger.length - 1] },
      h2: { dt: h2.dt, steps: h2.steps, revN: h2.revN, nan: h2.nan, warnings: h2.warnings, windows: W2, drag: h2.drag },
      hh: W1.map((w, i) => ({ from: w.from, to: w.to, relP: rel(w.apsPeriodYr, W2[i].apsPeriodYr), relSid: rel(w.siderealDays, W2[i].siderealDays), relE: rel(w.eMean, W2[i].eMean) })) };
  }
  for (const key of ['mer', 'plu']) {
    const o = {};
    for (const g of TWO_RUN.gains) o[g] = { h: twoReading(HP, key, res[`${key}-${g}-h`]), h2: twoReading(HP, key, res[`${key}-${g}-h2`]), check: res[`${key}-${g}-h`].check };
    const d = (hk) => ({ periodRel: rel(o.gain0[hk].periodMeanSec, o.gain[hk].periodMeanSec), period2Rel: rel(o.gain0[hk].period2Sec, o.gain[hk].period2Sec),
      period2DiffSec: o.gain[hk].period2Sec - o.gain0[hk].period2Sec, apsDiffDegPerOrbit: o.gain[hk].apsDegPerOrbit - o.gain0[hk].apsDegPerOrbit,
      apsDiffArcsecPerCentury: o.gain[hk].apsArcsecPerCentury - o.gain0[hk].apsArcsecPerCentury, eProxyRel: rel(o.gain0[hk].eProxy, o.gain[hk].eProxy) });
    o.delta = { h: d('h'), h2: d('h2') };
    o.hh = Object.fromEntries(TWO_RUN.gains.map((g) => [g, { periodRel: rel(o[g].h.periodMeanSec, o[g].h2.periodMeanSec), apsDiff: o[g].h2.apsDegPerOrbit - o[g].h.apsDegPerOrbit, eProxyRel: rel(o[g].h.eProxy, o[g].h2.eProxy) }]));
    two[key] = o;
  }
  // 読み(正本の数から)
  const iL = EM_RUN.spans.findIndex(([a, b]) => a === 0 && b === EM_RUN.revMax), i27 = 0;
  const W = (c, i) => em[c].h.windows[i];
  const emRead = Object.fromEntries(EM_CONDS.map((c) => [c.key, { P27: W(c.key, i27).apsPeriodYr, P118: W(c.key, iL).apsPeriodYr, dw118: W(c.key, iL).dwRadPerPeri,
    sid27: W(c.key, i27).siderealDays, sid118: W(c.key, iL).siderealDays, e27: W(c.key, i27).eMean, e118: W(c.key, iL).eMean, eProxy118: W(c.key, iL).eProxy,
    resid27: W(c.key, i27).residRmsDeg, resid118: W(c.key, iL).residRmsDeg, blocksYr: em[c.key].h.windows.slice(0, 4).map((w) => w.apsPeriodYr),
    uMean: em[c.key].h.uAcc.withSun.n ? em[c.key].h.uAcc.withSun.sum / em[c.key].h.uAcc.withSun.n : null }]));
  emRead.A2vsA1 = { rel118: rel(emRead.A1.P118, emRead.A2.P118), rel27: rel(emRead.A1.P27, emRead.A2.P27), sumMuA1: em.A1.h.drag ? em.A1.h.drag.sumMu : null, sumMuA2: em.A2.h.drag ? em.A2.h.drag.sumMu : null };
  emRead.A1vsG0 = { rel118: rel(emRead.G0.P118, emRead.A1.P118), rel27: rel(emRead.G0.P27, emRead.A1.P27) };
  // 第293便d の器の一時プリセット(🔆 の bodies + 🌛 の physics を換算 —— 核の ε 0.001・表の r_max を地球–月で宣言)との照合(読むだけ・同じ dt 0.016 の窓)
  let swingRef = null;
  if (J293) {
    const sw = (k) => J293.conditions[k].h.windows;
    swingRef = { source: 'tests/out/swing-w293d.json(conditions.A1/A2/C の h —— dt 0.016)',
      G0vsC: em.G0.h.windows.map((w, i) => ({ from: w.from, to: w.to, same: w.apsPeriodYr === sw('C')[i].apsPeriodYr && w.eMean === sw('C')[i].eMean })),
      A1vsA1: em.A1.h.windows.map((w, i) => ({ from: w.from, to: w.to, rel: rel(sw('A1')[i].apsPeriodYr, w.apsPeriodYr) })),
      A2vsA2: em.A2.h.windows.map((w, i) => ({ from: w.from, to: w.to, rel: rel(sw('A2')[i].apsPeriodYr, w.apsPeriodYr) })),
      note: 'G0 は 🔆 の重力だけの三体(geoPN 3 —— 1PN なし・gain 0)で、器 swing の C と同じ数になる。A1/A2 の差は核の ε(本 0.01・swing 0.001)と構造核の表の r_max(本は既定・swing は地球–月で宣言)の違い' };
  }
  return { em, two, readings: { em: emRead, swingRef } };
}
export function gates(decl, ident, res, A) {
  const all = Object.values(res);
  const runsOk = all.every((r) => !r.nan && (!r.drag || (r.drag.boundOver === 0 && r.drag.reject === 0)));
  const warnFree = all.every((r) => !r.warnings || r.warnings.length === 0);
  const declOk = decl.every((z) => z.ok);
  const emComplete = Object.values(A.em).every((c) => c.h.windows.concat(c.h2.windows).every((w) => w.complete) && c.h.revN >= EM_RUN.revMax && c.h2.revN >= EM_RUN.revMax);
  const twoComplete = Object.values(A.two).every((o) => TWO_RUN.gains.every((g) => o[g].h.revN >= TWO_RUN.revMax && o[g].h2.revN >= TWO_RUN.revMax && o[g].h.nPeri >= 3));
  const runRowSame = Object.values(A.two).every((o) => TWO_RUN.gains.every((g) => o[g].check && o[g].check.same));
  const g = { declOk, proxySame: ident.same, runsOk, warnFree, emComplete, twoComplete, runRowSame };
  g.ok = Object.values(g).every((x) => x === true);
  return g;
}

/* ── 表示用の数(obsCard と PHYSICS〔第295便c〕—— QA docs.inertial3Contract295 が照合する)── */
export const fx = (x, d) => (x === null || x === undefined || !Number.isFinite(x)) ? '—' : Number(x).toFixed(d);
export const ex = (x, d = 2) => (x === null || x === undefined || !Number.isFinite(x)) ? '—' : (x === 0 ? '0' : Number(x).toExponential(d));
const sg = (x, d) => (x > 0 ? '+' : '') + fx(x, d);
/** obsCard の model 欄に入っているべき数の文字列(本ごと —— ja と en の両方に同じ文字列で入る)。 */
export function obsNumbers(J) {
  const R = J.readings.em, M = J.two.mer, P = J.two.plu;
  return {
    earthMoonSunInertial: [fx(R.A1.P27, 3), fx(R.A1.P118, 3), fx(R.A1.dw118, 5), fx(R.A1.resid118, 1), fx(R.A1.sid118, 3), fx(R.A1.e118, 4),
      fx(R.A2.P118, 3), fx(R.G0.P118, 3), fx(R.G0.sid118, 3), fx(R.G0.e118, 4)],
    mercurySunInertial: [fx(M.gain.h.periodMeanDays, 3), fx(M.gain0.h.periodMeanDays, 3), sg(M.delta.h.periodRel * 100, 3), fx(M.gain.h.apsDegPerOrbit, 4), fx(M.gain.h2.apsDegPerOrbit, 4),
      fx(M.gain0.h.apsArcsecPerCentury, 0), fx(M.gain.h.eProxy, 5), fx(M.gain0.h.eProxy, 5), ex(M.gain.h.uRatioMean)],
    plutoCharonInertial: [fx(P.gain.h.period2Sec, 3), fx(P.gain0.h.period2Sec, 3), sg(P.delta.h.period2DiffSec, 3), sg(P.delta.h.period2Rel * 100, 3), ex(P.gain.h.eProxy), ex(P.gain0.h.eProxy),
      fx(P.gain.h.ampKm, 3), ex(P.gain.h.uRatioMean)],
  };
}
export function docRows(J) {
  const out = { em: [], two: [] };
  for (const c of EM_CONDS) {
    const z = J.em[c.key], w = z.h.windows, L = w[w.length - 1], hhL = z.hh[z.hh.length - 1];
    out.em.push(`| ${c.key} | ${w.slice(0, 4).map((q) => fx(q.apsPeriodYr, 4)).join(' / ')} | ${fx(L.apsPeriodYr, 4)} | ${fx(L.dwRadPerPeri, 6)} | ${fx(L.siderealDays, 4)} | ${fx(L.eMean, 5)} | ${fx(L.residRmsDeg, 2)} | ${ex(hhL.relP)} |`);
  }
  for (const key of ['mer', 'plu']) for (const g of TWO_RUN.gains) for (const hk of ['h', 'h2']) {
    const r = J.two[key][g][hk];
    out.two.push(`| ${bookOf(key).emoji} | ${g === 'gain0' ? 'gain 0' : 'gain 移送'} | ${hk} ${r.dt} | ${key === 'plu' ? fx(r.period2Sec, 3) + ' s' : fx(r.periodMeanDays, 4) + ' 日'} | ${fx(r.apsDegPerOrbit, 5)} | ${fx(r.apsArcsecPerCentury, 1)} | ${ex(r.ampKm, 4)} km | ${ex(r.eProxy, 3)} | ${ex(r.uRatioMean)} |`);
  }
  return out;
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const TARGET = process.env.QA_TARGET || 'beta/index.html';
if (IS_MAIN && process.argv.includes('--child')) {
  const spec = JSON.parse(process.argv[process.argv.indexOf('--child') + 1]);
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const { HP } = loadHtmlMain(path.join(ROOT, TARGET));
  process.stdout.write(JSON.stringify(childTask(HP, spec)));
} else if (IS_MAIN) {
  const OUT_PATH = process.env.W295C_OUT || path.join(ROOT, 'tests', 'out', 'inertial3-w295c.json');
  const IN293 = 'tests/out/swing-w293d.json';
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const t0 = Date.now();
  const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
  const conv = conversion(HP), decl = declGate(HP), ident = proxyIdentity(HP);
  console.log(`換算: C_d,SI ${conv.cdSI} m³/kg・${conv.rows.map((r) => r.emoji + ' gain ' + r.gainDeclared + '(差 ' + ex(r.rel) + ')').join('・')}`);
  for (const d of decl) console.log(`宣言 ${d.emoji} ${d.id}: ok ${d.ok}${d.bad.length ? ' —— ' + d.bad.join(' , ') : ''}・law ${d.run && d.run.law}・実効 ${d.run && d.run.eff}`);
  console.log(`🔆 の名前で引いた写し ≡ 本そのもの(${ident.steps} 步): ${ident.same}`);
  const ONLY = process.env.W295C_ONLY ? process.env.W295C_ONLY.split(',') : null;   // 開発用(指定したら正本を書かずに終わる)
  const specs = taskSpecs().filter((z) => !ONLY || ONLY.some((o) => z.key.startsWith(o)));
  const NW = Math.max(1, Number(process.env.W295C_WORKERS) || 3);
  const results = {};
  const self = fileURLToPath(import.meta.url);
  const runChild = (sp) => new Promise((res, rej) => {
    const ch = spawn(process.execPath, [self, '--child', JSON.stringify(sp)], { cwd: ROOT, env: process.env });
    let out = '', err = '';
    ch.stdout.on('data', (d) => { out += d; }); ch.stderr.on('data', (d) => { err += d; });
    ch.on('close', (code) => { if (code !== 0) return rej(new Error(sp.key + ': ' + err.slice(0, 600)));
      try { results[sp.key] = JSON.parse(out); } catch (e) { return rej(e); }
      const r = results[sp.key];
      if (r.kind === 'two') console.log(`  ${sp.key}: ${r.revN} 公転・周期 ${(r.rev[r.rev.length - 1] - r.rev[0]) / (r.rev.length - 1)}・近点 ${fx(r.B && r.B.slopeDegPerPeri, 6)}°/公転・eProxy ${ex(r.eProxy, 3)}・u/v ${ex(r.uRatio && r.uRatio.mean)}${r.check ? '・runRow ≡ ' + r.check.same : ''}(${r.wallSec.toFixed(0)} s)`);
      else console.log(`  ${sp.key}: ${r.windows.map((w) => `[${w.from},${w.to}) ${fx(w.apsPeriodYr, 4)} 年・e ${fx(w.eMean, 5)}`).join(' | ')}(${r.wallSec.toFixed(0)} s)`);
      res(); });
  });
  const order = specs.slice().sort((a, b) => (a.kind === 'em' ? 0 : 1) - (b.kind === 'em' ? 0 : 1) || (a.dt - b.dt));
  let next = 0;
  const lane = async () => { while (next < order.length) { const sp = order[next++]; await runChild(sp); } };
  await Promise.all(Array.from({ length: Math.min(NW, order.length) }, lane));
  if (ONLY) { console.log('W295C_ONLY —— 正本は書かない'); process.exit(0); }
  const J293 = (() => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, IN293), 'utf8')); } catch (e) { return null; } })();
  const A = assemble(HP, results, J293);
  const G = gates(decl, ident, results, A);
  const timing = Object.fromEntries(Object.entries(results).map(([k, r]) => [k, { wallSec: r.wallSec }]));
  const out = { meta: null, conversion: conv, decl, proxyIdentity: ident, run: { em: EM_RUN, emConds: EM_CONDS, two: TWO_RUN, books: BOOKS }, ...A, gates: G, ok: G.ok, timing,
    inputMapping: '🟤・🟣 は親の vx/vy を力学速度 v にそのまま与えた(ẋ=v+u)—— 観測の座標速度と同一の比較ではない(🌤️ も 🔆 の状態を v に与えた)。gain 0 の行だけが親と同じ座標速度で始まる',
    notTarget: '合否・年数の約束は書かない(値の記録)。gain はフィットしない —— 8.85 年・43″/世紀・公転周期のどれにも合わせない' };
  const CODE = ['tests/exp-w295c-inertial3.mjs', 'tests/exp-w293d-swing.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第295便c', target: TARGET, code: CODE, inputs: [TARGET, IN293] }), {
    harnessVersion: HARNESS_VERSION, swingVersion: SW.HARNESS_VERSION, engineVersion: HP.REL_DRAG_INERTIAL_VERSION, coreVersion: HP.DRAG_CORE_VERSION, loadErrors: errors.length,
    ruling: '原仮定者の裁定(第85報)「慣性決定力版サンプルを追加する。対象は、地球と月と太陽、水星と太陽、冥王星とカロン」',
    reading: '統括の検証項目 R155(gain は 🌛 の 514182 を同じ SI 係数として単位換算で移送・フィットしない・原理サンプル —— 較正母集団の外・値だけを記録)',
    composeDefault: [HP.REL_DRAG_COMPOSE_DEFAULT, HP.REL_DRAG_SOLVE_FROM_DEFAULT],
    engine: 'Node の headless(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・子プロセスで並列)',
    notClaim: ['月を再現した', '43″ を再現', '較正 合', 'C_d は普遍定数', 'GR の何 PN と同定', '全系の保存則が閉じた'] });
  out.elapsedS = (Date.now() - t0) / 1000;
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 1) + '\n');
  const R = A.readings.em;
  for (const c of EM_CONDS) console.log(`🌤️ ${c.key}: 27 公転 ${fx(R[c.key].P27, 4)} 年・118 公転 ${fx(R[c.key].P118, 4)} 年・恒星月 ${fx(R[c.key].sid118, 4)} 日・e ${fx(R[c.key].e118, 5)}・残差 ${fx(R[c.key].resid118, 2)}°`);
  for (const key of ['mer', 'plu']) for (const g of TWO_RUN.gains) { const r = A.two[key][g].h; console.log(`${bookOf(key).emoji} ${g}: 周期 ${fx(r.periodMeanDays, 5)} 日(第 2 周 ${fx(r.period2Sec, 4)} s)・近点 ${fx(r.apsDegPerOrbit, 6)}°/公転 = ${fx(r.apsArcsecPerCentury, 1)}″/世紀・振幅 ${ex(r.ampKm, 4)} km・eProxy ${ex(r.eProxy, 3)}・u/v ${ex(r.uRatioMean)}`); }
  if (A.readings.swingRef) console.log(`swing との照合: G0 ≡ C ${A.readings.swingRef.G0vsC.every((z) => z.same)}・A1 の差 ${A.readings.swingRef.A1vsA1.map((z) => ex(z.rel)).join('/')}`);
  console.log(`門: ${JSON.stringify(G)}`);
  console.log('→ ' + path.relative(ROOT, OUT_PATH) + '(' + out.elapsedS.toFixed(1) + ' s)・ok ' + out.ok);
}
