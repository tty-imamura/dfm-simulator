// 第306便e(決断事項 AN339 —— 案 (A)・DECISIONS v65 §0・統括の検証項目 R208)——
// **🟪 plutoCharonInertialFit の宣言の直し (A) の器**(Node だけ —— 対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、
// アプリの步〔sim.build・sim.step〕を走らせる。走行は 1 プロセスで順に)。
//
// ■ 何をしたか(案 (A))
//   第305便e の基線の監査(tests/exp-w305e-charonaudit.mjs —— 引きずり OFF の走行の差 +7.22118 s のほとんど全部は、PLU060 の平均の要素の a を
//   二体のケプラーの a として円軌道に置いた**初期状態の作り方**)を受けて、宣言を次へ直した:
//     ・GM(質量)は PLU060 のまま(🥶 の写し —— 変えない)。
//     ・初期の距離を**二体のケプラーの a**(標的の P と本の GM から閉じた式 a = (GM (P/2π)²)^(1/3) —— 19595.593 km)へ、速度を同じ二体のケプラーの
//       円の状態(重心 0・全運動量 0)へ。値はこの器の declFrom305 が作った double をそのまま宣言に写す(桁を丸めない)。
//     ・**引きずり OFF**(relativeDrag:{law:"inertial", Wbg:null, enabled:false, …} —— 第304便c の 🌦️ と同じ形)。旧 W_bg 0.0001486103(第303便a)と
//       旧の初期の距離 19595.764 km は fitRecord.fixed の履歴の列へ。
//   **標的の周期から a を作るので、周期の一致は入力の整合の確かめであって独立な結果ではない**(合成したケプラー状態)。走行の残差は軟化(ε 1 km)の分。
//
// ■ 段(正本 tests/out/charonfix-w306e.json —— 段 charonfix-306e)。W306E_PARTS=decl,measure,soft,tide,control,parent,record(既定は全部)・
//   W306E_OUT で出力先を変える(試走は正本を書かない)。走行は決定的(同じ html・同じ Node で同じ数 —— 壁時計の欄は volatilePaths)。
//   decl     第305便の宣言の写し(tests/data-w306e-decl305.json)から案 (A) の宣言(physics・bodies)を作り、html の宣言と同じかの門・閉じた式の周期・重心・
//            GM の公表の幅に当たる a の帯(fitRecord.knobs の range)。
//   measure  本の宣言(引きずり OFF)の 8 公転の M1(同方向の周回の通過時刻の平均間隔 —— フィットの器と同じ)を h 0.16・h/2・h/4 で。h は 16 公転まで回し
//            第 2 周・M4(偏角の調和の回帰)・16 公転・後半 [8,16] も読む。
//   soft     軟化 ε 0.01(本)・0.005・0.0025(softeningFloor の写し)→ ε² で 0 へ外挿(軟化の分)。
//   tide     太陽の潮汐の桁(第305便e と同じ等価の質点 —— 30 au・面の内 / 三次元で法線の向き)と三次元の写し(z = 0)との差。
//   control  対照: 本の abBody(引きずり ON —— 旧 W_bg 0.0001486103)を新しい宣言に入れた走行・第305便の宣言(旧の初期の距離)の引きずり ON / OFF。
//   parent   🥶 plutoCharonDiagInput(親の二体 —— **宣言は変えない**)が同じ定義(平均の要素の a をケプラーの a に使う)かの点検: 閉じた式・
//            走行(本の宣言のまま・h と h/2)と、案 (A) の a・速度にした写し(器の中だけ)の残差・照合の標的(Buie 2012 の P ± σ)に対する倍。
//   record   本の fitRecord(w297b-1)を測った数から作り、本の宣言の記録と同じか・受理・条件の署名 match・門(|残差| + h/2 差 ≤ 許容)。
//
// ■ 言わないこと(引用 —— 本文には書かない): notClaim の配列(正本)。届かない量は「この探索範囲では未達 —— 次の見直し」と書く。
//
// 実行(Node だけ):
//   node tests/exp-w306e-charonfix.mjs                    → 正本 tests/out/charonfix-w306e.json
//   W306E_PARTS=decl,record node tests/exp-w306e-charonfix.mjs → その段だけ(他の段は既存の出力から残す)
//   W306E_OUT=<json> で試走(正本を書かない)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import { recordsOf, runRevs, readRun, m1Of, m4Of, UNIT, CONST, TIDE, CSV_FILE } from './exp-w305e-charonaudit.mjs';
import { DECL305, DECL305_DATA_FILE, LIB_VERSION as PRE_VERSION, pin305 } from './lib-w306e-pre.mjs';
import { pinDecl306e, DECL306_DATA_FILE } from './lib-w307e-pre.mjs';   // 第307便e: 第306便の 🟪 の fitRecord(標的の役割なし)へ器の中だけで戻す(段 record の「本の記録と同じか」の門 —— 第306便の html では no-op)
import { gateOf, statusOf, FITSTOP_VERSION } from './lib-w303e-fitstop.mjs';
const REGEN_SCOPE = {"presets":["plutoCharonDiagInput","plutoCharonInertialFit"],"roots":["$","DT","HP.FIT_COND_VERSION","HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.fitCondInputsOf","HP.fitCondSig","HP.fitCondStateOf","HP.sim","HP.validateFitRecord","HP.validatePreset","T","ab","auditRows","ch","cw","fmt"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w306e-charonfix-1';
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const clone = (x) => JSON.parse(JSON.stringify(x));
const canon = (v) => { if (Array.isArray(v)) return v.map(canon); if (v && typeof v === 'object') { const o = {}; for (const k of Object.keys(v).sort()) o[k] = canon(v[k]); return o; } return v; };
export const same = (a, b) => JSON.stringify(canon(a)) === JSON.stringify(canon(b));
export const FIT_ID = 'plutoCharonInertialFit';
export const PARENT_ID = 'plutoCharonDiagInput';
export const DT = 0.16, REV = 8, REV_LONG = 16;
export const EPS = Object.freeze([0.01, 0.005, 0.0025]);
export const PARTS_ALL = Object.freeze(['decl', 'measure', 'soft', 'tide', 'control', 'parent', 'record']);
export const findPreset = (HP, id) => HP.allPresets().find((q) => q.id === id);
/** 宣言の注記の語(本の fitRecord・obsCard・説明と QA preset.charonFix306 が同じ語を読む) */
export const NOTE_INPUT = '周期の一致は入力の整合の確かめで、独立な結果ではない(標的の周期から a を作った合成のケプラー状態)';
export const NOTE_INPUT_EN = 'the period agreement is an input-consistency check, not an independent result (a synthetic Kepler state whose a is built from the target period)';

/* ── 案 (A) の宣言(第305便の宣言の写しから作る —— html の宣言はこの出力の写し)── */
/** 二体のケプラーの a [本の長さ](GM = G(m₀+m₁)・P は標的 [s] を本の時間へ) */
export function keplerA(mu, Psec) { const P = Psec / UNIT.T; return Math.cbrt(mu * (P / (2 * Math.PI)) ** 2); }
/** 案 (A): 第305便の宣言(DECL305)の写しの初期の距離と速度を二体のケプラーの円の状態(重心 0・x 軸上)へ置き直し、引きずりを OFF にする。 */
export function declFrom305(Psec) {
  const d = DECL305[FIT_ID], physics = clone(d.physics), bodies = clone(d.bodies);
  const G = physics.G, m0 = bodies[0].m, m1 = bodies[1].m, M = m0 + m1, mu = G * M;
  const a = keplerA(mu, Psec), vc = Math.sqrt(mu / a);
  bodies[0].x = -a * m1 / M; bodies[0].y = 0; bodies[0].vx = 0; bodies[0].vy = -vc * m1 / M;
  bodies[1].x = a * m0 / M; bodies[1].y = 0; bodies[1].vx = 0; bodies[1].vy = vc * m0 / M;
  const rd = d.physics.relativeDrag;
  physics.relativeDrag = { law: 'inertial', Wbg: null, enabled: false, eps: rd.eps, history: rd.history, pairs: rd.pairs, coreTable: clone(rd.coreTable) };
  return { physics, bodies, a, vc, mu };
}
/** 本の写し(fitRecord・abBody を外す)。o.eps で重力の軟化(0.01 未満は softeningFloor)・o.three で三次元・o.extra で質点・o.drag で引きずりの宣言を差し替える */
export function copyOf(p, o = {}) {
  const q = clone(p); delete q.fitRecord; delete q.abBody;
  if (o.drag !== undefined) q.physics.relativeDrag = clone(o.drag);
  if (o.eps !== undefined) { q.physics.softening = o.eps; if (o.eps < 0.01) q.physics.softeningFloor = o.eps; }
  if (o.three) { delete q.physics.frameReaction; q.physics.coord = '3d'; q.bodies.forEach((b) => { b.z = 0; b.vz = 0; }); }
  if (o.extra) { if (o.extra.m < 1e-6) q.physics.massFloor = TIDE.mFloor; q.bodies.push(o.extra.body); }
  return q;
}
const run = (HP, q, dt, revMax) => runRevs(HP, q, { dt, revMax });

/* ── 段 ── */
export function stageDecl(HP, rec) {
  const obs = rec.target.value, D = declFrom305(obs), p = findPreset(HP, FIT_ID), d = DECL305[FIT_ID];
  const b = D.bodies, m0 = b[0].m, m1 = b[1].m;
  const PK = 2 * Math.PI * Math.sqrt(D.a ** 3 / D.mu) * UNIT.T;
  const old = d.bodies, aOld = Math.hypot(old[1].x - old[0].x, old[1].y - old[0].y);
  const gmKm = D.mu * UNIT.L ** 3 / UNIT.T ** 2 / 1e9, sGm = rec.gmSys.sigma / 1e9;
  const aLo = D.a * Math.cbrt((gmKm - sGm) / gmKm), aHi = D.a * Math.cbrt((gmKm + sGm) / gmKm);
  const htmlSame = !!p && same(p.physics, D.physics) && same(p.bodies, D.bodies);
  return { a: D.a, aKm: D.a * UNIT.L / 1000, aOld, aOldKm: aOld * UNIT.L / 1000, daKm: (D.a - aOld) * UNIT.L / 1000, vc: D.vc, mu: D.mu, gmKm,
    gmSigmaPub: sGm, aBand: { lo: aLo, hi: aHi, loKm: aLo * UNIT.L / 1000, hiKm: aHi * UNIT.L / 1000, note: 'GM の公表の幅(SOL-2ed99d44 の σ)に当たる二体のケプラーの a(標的の P は固定)' },
    PK, PKminusObs: PK - obs, bary: { x: m0 * b[0].x + m1 * b[1].x, p: m0 * b[0].vy + m1 * b[1].vy },
    decl: { physics: D.physics, bodies: D.bodies }, htmlSame,
    massSame: same(d.bodies.map((z) => z.m), b.map((z) => z.m)) && d.physics.G === D.physics.G, softSame: d.physics.softening === D.physics.softening };
}
export function stageMeasure(HP, rec, log) {
  const obs = rec.target.value, p = copyOf(findPreset(HP, FIT_ID)), sec = UNIT.T;
  const t = Date.now(), R0 = run(HP, p, DT, REV_LONG);
  const M1 = m1Of(R0.rev, 0, REV - 1) * sec, M4 = m4Of(R0.samp, m1Of(R0.rev, 0, REV - 1), R0.rev[REV - 1]);
  const h = { dt: DT, revN: R0.rev.length, nan: R0.nan, M1, d: M1 - obs, rev2: (R0.rev[1] - R0.rev[0]) * sec,
    M4: M4 ? M4.P * sec : null, M1_16: m1Of(R0.rev) * sec, late: m1Of(R0.rev, REV, REV_LONG - 1) * sec, eProxy: R0.eProxy, wallSec: (Date.now() - t) / 1000 };
  // 8 公転で止めた走行の步の数(フィットの器と同じ —— 通過の 8 回目を越えた步まで)
  const R8 = run(HP, p, DT, REV); h.steps = R8.steps;
  log(`measure h: M1 ${M1}(残差 ${M1 - obs})・第 2 周 ${h.rev2}・M4 ${h.M4}・16 公転 ${h.M1_16}`);
  const rows = [DT / 2, DT / 4].map((dt) => { const t1 = Date.now(), R = readRun(run(HP, p, dt, REV), obs); log(`measure h ${dt}: M1 ${R.M1}`);
    return Object.assign({ wallSec: (Date.now() - t1) / 1000 }, R); });
  const h2 = rows[0], h4 = rows[1];
  return { h, h2, h4, residual: M1 - obs, hh2: M1 - h2.M1, h2h4: h2.M1 - h4.M1, ratio: (M1 - h2.M1) / (h2.M1 - h4.M1), numerical: (M1 - h2.M1) * 4 / 3,
    diffs: { rev2MinusM1: h.rev2 - M1, m4MinusM1: h.M4 - M1, m1_16MinusM1: h.M1_16 - M1, lateMinusM1: h.late - M1 } };
}
export function stageSoft(HP, rec, M, log) {
  const obs = rec.target.value, p = findPreset(HP, FIT_ID);
  const rows = [{ eps: EPS[0], M1: M.h.M1, d: M.h.d, from: 'measure.h' }].concat(EPS.slice(1).map((e) => { const t = Date.now(), R = readRun(run(HP, copyOf(p, { eps: e }), DT, REV), obs);
    log(`soft ε ${e}: M1 ${R.M1}`); return { eps: e, M1: R.M1, d: R.d, nan: R.nan, revN: R.revN, wallSec: (Date.now() - t) / 1000 }; }));
  const p0 = (x, y) => { const k = (x.M1 - y.M1) / (x.eps * x.eps - y.eps * y.eps); return x.M1 - k * x.eps * x.eps; };
  const ext = p0(rows[0], rows[1]), ext2 = p0(rows[1], rows[2]);
  return { rows, extrapolated: ext, extrapolated2: ext2, softEffect: rows[0].M1 - ext, softEffect2: rows[0].M1 - ext2, scaling: (rows[0].M1 - rows[1].M1) / (rows[1].M1 - rows[2].M1),
    extMinusObs: ext - obs };
}
export function stageTide(HP, rec, M, log) {
  const obs = rec.target.value, p = findPreset(HP, FIT_ID);
  const base3 = readRun(run(HP, copyOf(p, { three: true }), DT, REV), obs);
  const Dsun = TIDE.DsunAu[0] * CONST.au / UNIT.L, mSun = CONST.GMsun / p.physics.G / (UNIT.L ** 3 / UNIT.T ** 2);
  const mEq = (D) => mSun * (D / Dsun) ** 3;
  const pert = (D, where, three) => { const m = mEq(D), pos = (where === 'normal') ? { x: 0, y: 0, z: D } : { x: D, y: 0 };
    const body = Object.assign({ type: 'single', m, radius: 0.5, vx: 0, vy: 0, spin: 0, pinned: true }, pos, three ? { z: pos.z || 0, vz: 0 } : {});
    const R = readRun(run(HP, copyOf(p, { three, extra: { m, body } }), DT, REV), obs);
    log(`tide ${where} D ${D}: M1 ${R.M1}`); return { D, where, three, m, M1: R.M1, n: R.n }; };
  const inP = pert(TIDE.D, 'plane', false), nrm = pert(TIDE.D, 'normal', true);
  const scale50 = (TIDE.DsunAu[0] / TIDE.DsunAu[1]) ** 3, dIn = inP.M1 - M.h.M1, dN = nrm.M1 - base3.M1;
  return { dsunUnits: Dsun, mSun, three: { M1: base3.M1, diff: base3.M1 - M.h.M1 }, plane: inP, normal: nrm,
    effect: { plane30: dIn, normal30: dN, plane50: dIn * scale50, normal50: dN * scale50 },
    note: '第305便e の段 tide と同じ等価の質点(質量 GM☉(D/D☉)³ —— GM/D³ が D☉ の太陽と同じ)・pinned・初速 0・D☉ = 30 au で作り 50 au は D⁻³ で換算' };
}
export function stageControl(HP, rec, log) {
  const obs = rec.target.value, p = findPreset(HP, FIT_ID);
  const ab = p.abBody && p.abBody.physicsPatch && p.abBody.physicsPatch.relativeDrag;
  const on = ab ? readRun(run(HP, copyOf(p, { drag: ab }), DT, REV), obs) : null;
  const old = pin305(p), oldOff = copyOf(old, { drag: Object.assign(clone(old.physics.relativeDrag), { Wbg: null, enabled: false }) });
  const rOn = readRun(run(HP, copyOf(old), DT, REV), obs), rOff = readRun(run(HP, oldOff, DT, REV), obs);
  log(`control: 新しい宣言 + 旧 W_bg ${on ? on.M1 : null}・第305便の宣言(ON)${rOn.M1}・同(OFF)${rOff.M1}`);
  const fr = DECL305[FIT_ID].fitRecord;
  return { abBody: ab ? clone(ab) : null, newWithOldWbg: on ? { M1: on.M1, d: on.d, Wbg: ab.Wbg } : null,
    old305On: { M1: rOn.M1, d: rOn.d, Wbg: old.physics.relativeDrag.Wbg, recordModel: fr.residual.model, minusRecord: rOn.M1 - fr.residual.model },
    old305Off: { M1: rOff.M1, d: rOff.d } };
}
export function stageParent(HP, rec, cl, log) {
  const obs = rec.target.value, sig = rec.target.sigma, p = findPreset(HP, PARENT_ID), f = findPreset(HP, FIT_ID);
  const b = p.bodies, G = p.physics.G, m0 = b[0].m, m1 = b[1].m, M = m0 + m1, mu = G * M;
  const r0 = Math.hypot(b[1].x - b[0].x, b[1].y - b[0].y), vrel = Math.hypot(b[1].vx - b[0].vx, b[1].vy - b[0].vy);
  const a0 = 1 / (2 / r0 - vrel * vrel / mu), PK = 2 * Math.PI * Math.sqrt(a0 ** 3 / mu) * UNIT.T;
  const d305 = DECL305[FIT_ID].bodies;
  const sameBodies = same(b.map((z) => [z.m, z.x, z.y, z.vx, z.vy]), d305.map((z) => [z.m, z.x, z.y, z.vx, z.vy]));
  const aK = keplerA(mu, obs), vc = Math.sqrt(mu / aK);
  const fixed = clone(p); fixed.bodies[0].x = -aK * m1 / M; fixed.bodies[1].x = aK * m0 / M; fixed.bodies[0].vy = -vc * m1 / M; fixed.bodies[1].vy = vc * m0 / M;
  const h = readRun(run(HP, copyOf(p), DT, REV), obs), h2 = readRun(run(HP, copyOf(p), DT / 2, REV), obs);
  const fh = readRun(run(HP, copyOf(fixed), DT, REV), obs), fh2 = readRun(run(HP, copyOf(fixed), DT / 2, REV), obs);
  log(`parent 🥶: 宣言のまま M1 ${h.M1}(差 ${h.d})・案 (A) の写し ${fh.M1}(差 ${fh.d})`);
  return { id: PARENT_ID, emoji: p.emoji, sampleClass: p.sampleClass, geoPN: p.physics.geoPN, integrator: p.integrator || null,
    sameDefinition: sameBodies, aKm: a0 * UNIT.L / 1000, aKeplerKm: aK * UNIT.L / 1000, PK, closedMinusObs: PK - obs, closedPerSigma: (PK - obs) / sig,
    run: { M1: h.M1, d: h.d, perSigma: h.d / sig, h2: h2.M1, h2gap: Math.abs(h.M1 - h2.M1) },
    fixedCopy: { M1: fh.M1, d: fh.d, perSigma: fh.d / sig, h2: fh2.M1, h2gap: Math.abs(fh.M1 - fh2.M1), withinSigma: Math.abs(fh.d) + Math.abs(fh.M1 - fh2.M1) <= sig,
      note: '器の中だけの写し(🥶 の宣言は変えない)—— 案 (A) と同じ a・速度(本の GM と標的の P から)' },
    sameAsFitBodiesNow: same(b.map((z) => [z.x, z.vy]), f.bodies.map((z) => [z.x, z.vy])),
    note: '🥶 の初期状態は PLU060 の 400 年平均の a(19595.764 km)を二体のケプラーの a として置いた円軌道(🟪 の第305便の宣言と同じ —— 同じ定義)。照合の標的は Buie 2012 の P ± σ 0.02592 s(較正の判定は calaudit の正本 —— この器は判定しない)' };
}
/* ── fitRecord(w297b-1 —— 単一の標的)── */
export const EXTRACTOR = 'tests/exp-w305e-charonaudit.mjs runRevs(同方向の周回の通過時刻の平均間隔 —— tests/exp-w295c-inertial3.mjs runPair と同じ定義)・w305e-charonaudit-1';
export const WINDOW = '8 公転・同方向の周回の通過時刻の平均間隔(8 公転の平均)・引きずり OFF';
export function recordOf(HP, J) {
  const d = DECL305[FIT_ID], fr0 = d.fitRecord, D = J.decl, Mz = J.measure, obs = J.obs.value;
  const t0 = fr0.targets[0];
  const residual = Mz.residual, h2 = Math.abs(Mz.hh2);
  const rec = {
    version: 'w297b-1', parent: fr0.parent,
    law: '引きずり OFF(relativeDrag.enabled:false —— 第306便e の案 (A))・重力だけの二体(🥶 の質量の写し・geoPN=3・kFrame=0・λ_PN=0・積分器 leapfrog)',
    targets: [{ q: t0.q, obs: t0.obs, unit: t0.unit, source: t0.source, window: WINDOW, tol: clone(t0.tol) }],
    knobs: [{ key: 'initial.keplerSemiMajorAxis', range: [D.aBand.lo, D.aBand.hi], final: D.a }],
    fixed: [
      `GM(冥王星とカロン ${D.gmKm.toFixed(1)} km³/s² —— PLU060・🥶 の質量の写し)・半径・自転(相互同期の宣言 —— 走りは読まない)・構造核 dragCore の事前値(引きずり OFF では走りに効かない)は第305便の宣言のまま`,
      `初期状態は二体のケプラーの円軌道(重心 0・全運動量 0・x 軸上)—— 距離 a = (GM (P/2π)²)^(1/3) = ${D.aKm.toFixed(3)} km は標的の P と本の GM から閉じた式で作った(数値の探索ではない —— 合成したケプラー状態)。range は GM の公表の幅 ±${D.gmSigmaPub.toFixed(1)} km³/s² に当たる a`,
      '重力の軟化 ε 0.01(= 1 km)・geoPN=3・kFrame=0・λ_PN=0・積分器 leapfrog・stateCarry double(第305便のまま)',
      '引きずり OFF(relativeDrag:{law:"inertial", Wbg:null, enabled:false, eps:0.01, history:"positions", pairs:"all", coreTable:{n:4096}})',
      `履歴: 第303便a の W_bg のフィット(${d.physics.relativeDrag.Wbg} [M/L³]・semic・残差 ${fr0.residual.value.toExponential(2)} s・旧 cond.sig ${fr0.cond.sig})と初期の距離 ${D.aOldKm.toFixed(3)} km(PLU060 の 400 年平均の要素の a —— 🥶 の写し)は履歴 —— 前後表は PHYSICS〔第306便e〕と正本 tests/out/charonfix-w306e.json`,
      '履歴: 第305便e の基線の監査(引きずり OFF の走行の差 +7.22118 s の内訳 —— 平均の要素の定義 +7.76113・解の違い −0.54432・軟化 +0.00431)—— 正本 tests/out/charonaudit-w305e.json'],
    procedure: `第306便e(決断事項 AN339 の案 (A)): 第305便の宣言の写しから、初期の距離を二体のケプラーの a(標的の P と本の GM から閉じた式)・速度を同じ円の状態へ置き直し、引きずりを OFF にして、h・h/2・h/4 で 8 公転の平均の周期を測った(|残差| + |h − h/2| ≤ 許容なら fitted —— 数値の探索はしていない・器 tests/exp-w306e-charonfix.mjs)`,
    dt: DT, steps: Mz.h.steps,
    residual: { value: residual, unit: 's', model: Mz.h.M1, rel: residual / obs },
    numerics: { h2, dtHalf: DT / 2 },
    status: statusOf({ reachable: true, gate: gateOf(residual, h2, t0.tol.value) }),
    notFitted: [
      NOTE_INPUT + ' —— 残差は軟化 1 km の分',
      '軌道の形(離心率の代理)・第 2 周の周期(記録だけ)・自転・潮汐',
      '引きずり OFF で σ の内(引きずりを無くしたのではなく、この探索範囲で引きずりで埋める差が σ の内で 0 だったことの記録 —— 第304便c の 🌦️ と同じ型)',
      '観測の時間標準の換算(標的の時刻系 TT/TDB of JDT —— 記録だけで換算しない・決断事項 AN333)'],
    cond: { version: HP.FIT_COND_VERSION || 'w297b-cond-1', sig: '0000000000000000', extractor: EXTRACTOR } };
  return rec;
}
export function stageRecord(HP, J) {
  const p = findPreset(HP, FIT_ID), rec = recordOf(HP, J);
  const q = clone(p); q.fitRecord = rec; rec.cond.sig = HP.fitCondSig(HP.validatePreset(clone(q)).preset, rec);
  const vr = HP.validateFitRecord(clone(rec)), vp = HP.validatePreset(clone(Object.assign(clone(p), { fitRecord: rec })));
  let condState = null;
  const vLive = HP.validatePreset(clone(p));
  if (vLive.ok && vLive.preset.fitRecord) { HP.sim.build(vLive.preset); condState = HP.fitCondStateOf(HP.fitCondInputsOf(vLive.preset, HP.sim.params), vLive.preset.fitRecord).state; }
  const gate = gateOf(rec.residual.value, rec.numerics.h2, rec.targets[0].tol.value);
  return { record: rec, accepted: !!vr.ok, acceptErr: vr.ok ? null : vr.err, presetOk: vp.ok && (vp.warnings || []).length === 0, presetWarnings: vp.warnings || [],
    liveSame: same(p.fitRecord, rec), condState, gate, fitstop: FITSTOP_VERSION };
}

/* ── 門 ── */
export function gatesOf(J) {
  const g = {}, sig = J.obs.sigma;
  if (J.decl) { g.declSame = J.decl.htmlSame === true && J.decl.massSame === true && J.decl.softSame === true;
    g.closedForm = Math.abs(J.decl.PKminusObs) <= 1e-6; g.bary = Math.abs(J.decl.bary.x) <= 1e-12 && Math.abs(J.decl.bary.p) <= 1e-15; }
  if (J.measure) { const M = J.measure; g.withinSigma = Math.abs(M.residual) + Math.abs(M.hh2) <= sig; g.bandShrinks = Math.abs(M.h2h4) <= Math.abs(M.hh2) + 1e-6;
    g.runs = !M.h.nan && M.h.revN === REV_LONG && M.h2.revN === REV && M.h4.revN === REV; }
  if (J.soft) g.softScaling = J.soft.scaling > 3 && J.soft.scaling < 5;
  if (J.soft && J.measure) g.residualIsSoft = Math.abs(J.measure.residual - J.soft.softEffect - J.measure.numerical) <= 1e-3;
  if (J.tide) g.tideBelowSigma = Math.max(Math.abs(J.tide.effect.plane30), Math.abs(J.tide.effect.normal30)) < sig && Math.abs(J.tide.three.diff) <= 1e-4;
  if (J.control) { g.oldOnSameAsRecord = Math.abs(J.control.old305On.minusRecord) <= 1e-6; g.oldWbgOutside = !!J.control.newWithOldWbg && Math.abs(J.control.newWithOldWbg.d) > sig; }
  if (J.parent) g.parentSameDefinition = J.parent.sameDefinition === true && Number.isFinite(J.parent.fixedCopy.M1);
  if (J.record) { g.recordAccepted = J.record.accepted === true && J.record.presetOk === true; g.recordFitted = J.record.record.status === 'fitted' && J.record.gate === true;
    g.recordLive = J.record.liveSame === true && J.record.condState === 'match'; }
  return g;
}

/* ── 表の行(PHYSICS〔第306便e〕—— QA docs.charonFix306 が正本から作り直して逐語で照合する)── */
const F = (x, d) => Number(x).toFixed(d), EXP = (x, d = 1) => Number(x).toExponential(d), SG = (x, d) => (x >= 0 ? '+' : '−') + F(Math.abs(x), d), SE = (x, d = 1) => (x >= 0 ? '+' : '−') + EXP(Math.abs(x), d);
const PS = (x, sig) => { const z = x / sig; return Math.abs(z) < 0.005 ? '< 0.01' : SG(z, 2); };
/** 表 1: 宣言の値(新旧) */
export function declRows(J) {
  const D = J.decl, B = D.decl.bodies, O = DECL305[FIT_ID].bodies;
  return [
    `| 初期の距離 a | ${F(D.aOldKm, 3)} km(PLU060 の 400 年平均の要素の a) | ${F(D.aKm, 3)} km(二体のケプラーの a —— 標的の P と GM から・${SG(D.daKm, 3)} km) |`,
    `| 冥王星の位置 x・速度 vy [本の単位] | ${O[0].x}・${O[0].vy} | ${B[0].x}・${B[0].vy} |`,
    `| カロンの位置 x・速度 vy [本の単位] | ${O[1].x}・${O[1].vy} | ${B[1].x}・${B[1].vy} |`,
    `| 引きずり | ON(W_bg ${DECL305[FIT_ID].physics.relativeDrag.Wbg} —— 第303便a のフィット) | OFF(履歴の列へ) |`,
    `| 閉じた式の周期(ε = 0) | ${F(J.parent.PK, 5)} s | ${F(D.PK, 5)} s(標的 ${J.obs.value} s との差 ${SE(D.PKminusObs, 1)} s) |`];
}
/** 表 2: 新しい宣言の測り(秒・σ の倍) */
export function measureRows(J) {
  const M = J.measure, S = J.soft, T = J.tide, sig = J.obs.sigma, r = (label, x, fmt) => `| ${label} | ${fmt(x)} | ${PS(x, sig)} |`;
  return [
    r(`残差(引きずり OFF・h ${DT}・8 公転の M1 ${F(M.h.M1, 5)} s − 標的)`, M.residual, (x) => SG(x, 5)),
    r(`軟化 ε 0.01(= 1 km —— ε 0.01/0.005/0.0025 の ε² の外挿・比 ${F(S.scaling, 2)})`, S.softEffect, (x) => SG(x, 5)),
    r('数値の帯(h → 0 —— (M1(h) − M1(h/2))·4/3)', M.numerical, (x) => SE(x, 2)),
    r('残り(残差 − 軟化 − 数値の帯)', M.residual - S.softEffect - M.numerical, (x) => SE(x, 1)),
    r(`数値の帯: M1(h)− M1(h/2)・M1(h/2)− M1(h/4)(比 ${F(M.ratio, 2)})`, M.hh2, (x) => SE(x, 2) + '・' + SE(M.h2h4, 2)),
    r('抽出器: 第 2 周 − M1・M4 − M1', M.diffs.rev2MinusM1, (x) => SE(x, 1) + '・' + SE(M.diffs.m4MinusM1, 1)),
    r('窓: M1(16 公転)− M1(8 公転)・後半 [8,16] − 前半', M.diffs.m1_16MinusM1, (x) => SE(x, 1) + '・' + SE(M.diffs.lateMinusM1, 1)),
    r('二次元の近似: 三次元の写し(z = 0)− 二次元', T.three.diff, (x) => SE(x, 1)),
    r(`太陽の潮汐の桁(等価の質点 —— ${TIDE.DsunAu[0]} au・面の内 / 法線の向き)`, T.effect.plane30, (x) => SE(x, 2) + ' / ' + SE(T.effect.normal30, 2))];
}
/** 表 3: 新旧の宣言と対照(引きずり ON / OFF —— 秒・σ の倍) */
export function historyRows(J) {
  const C = J.control, M = J.measure, sig = J.obs.sigma;
  const r = (label, m1, d) => `| ${label} | ${F(m1, 5)} | ${Math.abs(d) < 1e-3 ? SE(d, 2) : SG(d, 5)} | ${PS(d, sig)} |`;
  return [
    r(`第305便の宣言(a ${F(J.decl.aOldKm, 3)} km)・引きずり ON(W_bg ${C.old305On.Wbg} —— 第303便a のフィット)`, C.old305On.M1, C.old305On.d),
    r(`第305便の宣言(a ${F(J.decl.aOldKm, 3)} km)・引きずり OFF`, C.old305Off.M1, C.old305Off.d),
    r(`第306便e の宣言(a ${F(J.decl.aKm, 3)} km)・引きずり OFF(本の宣言)`, M.h.M1, M.residual),
    r(`第306便e の宣言・引きずり ON(旧 W_bg ${C.newWithOldWbg.Wbg} —— ワンタップの対照)`, C.newWithOldWbg.M1, C.newWithOldWbg.d)];
}
/** 表 4: 🥶 の点検(宣言は変えない) */
export function parentRows(J) {
  const P = J.parent, sig = J.obs.sigma, r = (label, x) => `| ${label} | ${SG(x, 5)} | ${PS(x, sig)} |`;
  return [
    r(`🥶 の閉じた式(a ${F(P.aKm, 3)} km —— 🟪 の第305便の宣言と同じ定義)− 標的`, P.closedMinusObs),
    r(`🥶 の走行(宣言のまま・geoPN ${P.geoPN}・h ${DT}・8 公転の M1 ${F(P.run.M1, 5)} s)− 標的`, P.run.d),
    r(`🥶 の写し(案 (A) の a ${F(P.aKeplerKm, 3)} km —— 器の中だけ・M1 ${F(P.fixedCopy.M1, 5)} s)− 標的`, P.fixedCopy.d)];
}

export async function main() {
  const OUT = process.env.W306E_OUT || path.join(ROOT, 'tests', 'out', 'charonfix-w306e.json');
  const PARTS = String(process.env.W306E_PARTS || PARTS_ALL.join(',')).split(',').filter((x) => PARTS_ALL.includes(x));
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const t0 = Date.now();
  const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
  pinDecl306e(null, [FIT_ID]);   // 第307便e(AN344 ①): 本の fitRecord に足した標的の役割 role は第306便の記録の外(この器の記録は第306便e の形のまま)
  const prev = (PARTS.length < PARTS_ALL.length && fs.existsSync(OUT)) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : {};
  const log = (s) => console.log('  ' + s);
  const rec = recordsOf(ROOT), p = findPreset(HP, FIT_ID);
  const J = { meta: null, version: HARNESS_VERSION, preVersion: PRE_VERSION,
    obs: { value: rec.target.value, sigma: rec.target.sigma, recordId: rec.target.recordId, source: rec.target.source, timeSystem: rec.target.timeSystem },
    book: { id: FIT_ID, emoji: p.emoji, softening: p.physics.softening, dt: DT, revMax: REV, scaleExp: p.scaleExp },
    gmRecord: { recordId: rec.gmSys.recordId, value: rec.gmSys.value, sigma: rec.gmSys.sigma, formal: rec.gmSys.formal },
    decl305: { Wbg: DECL305[FIT_ID].physics.relativeDrag.Wbg, sig: DECL305[FIT_ID].fitRecord.cond.sig, residual: DECL305[FIT_ID].fitRecord.residual.value } };
  const stages = { decl: () => stageDecl(HP, rec), measure: () => stageMeasure(HP, rec, log), soft: () => stageSoft(HP, rec, J.measure, log),
    tide: () => stageTide(HP, rec, J.measure, log), control: () => stageControl(HP, rec, log), parent: () => stageParent(HP, rec, J.decl, log), record: () => stageRecord(HP, J) };
  J.partsRun = [];
  for (const k of PARTS_ALL) {
    if (PARTS.includes(k)) { console.log(`段 ${k}`); const t = Date.now(); J[k] = await stages[k](); J.partsRun.push(k); console.log(`  (${((Date.now() - t) / 1000).toFixed(1)} s)`); }
    else if (prev[k]) J[k] = prev[k];
  }
  J.gates = gatesOf(J);
  J.ok = Object.values(J.gates).every(Boolean) && PARTS_ALL.every((k) => !!J[k]);
  J.notClaim = ['「周期を独立に出した」', '「カロンの周期が観測どおりになった」', '「引きずりが要らないことを示した」', '「観測と一致した」', '「時計の換算で合った」'];   // 書かない語(引用 —— 本文には書かない)
  const CODE = ['tests/exp-w306e-charonfix.mjs', 'tests/exp-w305e-charonaudit.mjs', 'tests/lib-w306e-pre.mjs', 'tests/lib-w307e-pre.mjs', 'tests/lib-w303e-fitstop.mjs', 'tests/lib-w280b-emgrid.mjs',
    'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  J.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第306便e', target: TARGET, code: CODE, inputs: [TARGET, CSV_FILE, DECL305_DATA_FILE, DECL306_DATA_FILE] }), {
    harnessVersion: HARNESS_VERSION, loadErrors: errors.length,
    ruling: '決断事項 AN339(案 (A) —— DECISIONS v65 §0)・AN334 ④', reading: '統括の検証項目 R208' });
  J.elapsedS = (Date.now() - t0) / 1000;
  Object.assign(J.meta, W281A_SCOPE, w281aStableInputs(ROOT, J.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(J, null, 1) + '\n');
  console.log(`門: ${JSON.stringify(J.gates)} → ${path.relative(ROOT, OUT)}(${J.elapsedS.toFixed(0)} s)`);
}
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) await main();
