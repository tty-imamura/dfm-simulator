// 第309便c(原仮定者の裁定(第103報)「慣性自転の初期値 = 観測値の自転 − 引きずり軸回転の初期値」・AN357「正確な引きずりを訂正したので AN356 も踏まえて再確認」・
// (第104報)AN362・AN363・(第105報)AN364「慣性移動の初期値 = 観測値の移動 − 引きずり移動の初期値」・決断事項 AN355・AN357・AN362・AN363・AN364・
// 統括の検証項目 R220): **観測の自転と移動の初期値の分解の門**と **AN357 の再確認の器**。
//
// Node だけ(対象 html の inline script を tests/lib-w279b-headless.mjs の loadHtmlHeadless で読み、html の validatePreset・coord3d.makeSim・build・step・
// 読み口 inertialDragInitObsState をそのまま呼ぶ)。**在位の本の宣言は変えない** —— 器の中の写し(宣言の写しに鍵を足す)だけ。
//
// ■ 段
//   K(参照の純関数の確かめ): A₂・M₂ の閉じた式/級数と源の球の直接の求積・導関数と差分・自己の中心 3/R² と二重平均 9/(4R²)・受け手の求積の重み・
//     M₂ の先頭 2R²/(5r³)・dragCore の既定(SI でクランプ)・1 步の熱の例(DECISIONS の数)・刻みの半分で率 2 倍・背景の口座の和 0・逆写像と不動点。
//   E(エンジンの門 —— G = 0 の写し 3 体): 核 mu2・sphere・bevel × 分解の型 vector・parallel で、不動点の反復と残り・**最初の步の Δx/h → V_obs**(firstStep:"drag")・
//     **(rotA の増分)/h → Ω_obs·â_I**(初期値の門)・軸の回り方 ≈ ω_D⊥ × â・firstStep:"zero" の最初の步の差 = u(0)・チェックポイント(t = 0 の写し・復帰で分解し直さない・
//     復帰の後の走行が同じ)・分解し直し(redo)の冪等・非収束は分解しない + 走行の門が止める・受理の拒否 7 件・正準形・第296便b の逆写像との差(対角の足し分)。
//   P(在位の本の写し —— 今のエンジンの法則): 惑星 7 本(宣言から探す)に spinDrag:{rot, axial:"on", axialModel:"bevel"|"sphere", initSpin} と initMotion を足した写しで
//     ω_D∥(0)/Ω_obs・軸の角・|u(0)|/|V|・条件数・反復・前向きの残り・第296便b の逆写像との差・最初の步の Δx/h − V_obs(drag と zero —— 重力あり)。
//   R(AN357 の再確認 —— 修正版の引きずりの参照〔lib-w309c-recheck.mjs〕・W_bg′ = 0・ε = 0・R_d = min(R, 6.5e6 m)): 惑星 7 本の二体・木星 → イオ・太陽 –木星 –イオ・
//     太陽 + 惑星 7(太陽を原点に各本の相対の位置と速度を重ねた診断の配置)で、全源の慣性自転の同時の分解(vector・parallel・span)・ω_D(0)・ω_I(0)・
//     v(0) の補正(逆写像と不動点)・AN362 の熱(1 步の型 Q/h と τ_hold の型)・背景の口座。
// ■ 言わないこと: 「観測の自転に合わせた」「熱を説明した」「法則を導いた」「帳簿が完全に閉じた」「自転が釣り合った」(参照の条件の診断 —— W_bg′ の同定は後)。
// ■ 使い方
//   node tests/exp-w309c-recheck.mjs → 正本 tests/out/recheck-w309c.json(段 recheck-309c)
//   W309C_OUT=<json>(出力先)・W309C_TARGET=<html>(既定 beta/index.html)・W309C_QUICK=1(R の求積を下げた試走 —— 正本は書かない用途)。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlHeadless } from './lib-w279b-headless.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import { inputsFromDecl } from './exp-w308c-sunspin.mjs';
import * as L from './lib-w309c-recheck.mjs';
import { pinDecl315c, LEGACY7_DATA_FILE } from './lib-w315c-legacy7.mjs';   // 第315便c(決断事項 AN406・R244): 在位の 7 本を K1 へ移した世代では、この器は移行の前(af2f426)の宣言の写しで測る
// 第281便a の領域 hash の宣言(器と lib から deriveScope で引いた下限 + 本)
const REGEN_SCOPE = {"presets":["galaxy","galaxyGeo2","galaxyStd","jupiterGalilean","jupiterSunInertial3d","marsSunInertial3d","mercurySunInertial3d","neptuneSunInertial3d","saturnSunInertial3d","uranusSunInertial3d","venusSunInertial3d"],"roots":["$","HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.sim","HP.validatePreset","REL_DRAG_INIT_OBS_VERSION","T","appStepDt","ckRestoreOne","ckSnapOne","ctx","cw","inertialDragInitObsRedo","inertialDragInitObsState","inertialDragInverseMap","sim"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w309c-recheck-1';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (o) => JSON.parse(JSON.stringify(o));
const { dot, cross, norm, add, sub, scale, unit } = L;
const rel = (a, b) => Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b), 1e-300);
const e4 = (v) => (v === null || v === undefined || !Number.isFinite(v)) ? v : Number(v.toExponential(4));
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x)) ? '—' : (x === 0 ? '0' : (Math.abs(x) >= 1e-3 && Math.abs(x) < 1e4 ? Number(x.toPrecision(4)).toString() : x.toExponential(3).replace('e+', 'e')));
export const pow10 = (e) => Number('1e' + e);

/* ───────── 規格(正本に記録 —— QA は正本から読む) ───────── */
export const SPEC = Object.freeze({ order: { nr: 16, ns: 12 }, orderHi: { nr: 24, ns: 16 }, quickOrder: { nr: 10, ns: 8 }, Wbg: 0, eps: 0, gain: 1, inertiaF: 0.5,
  tauHold: [3600, 86400, 3.15576e7], spinTol: 1e-13, motionTol: 1e-15 });
const TOY = Object.freeze({ Wbg: 0.125, eps: 0.05, kappa: 4 });

/* ───────── 写しの本 ───────── */
const toyPhysics = (extra) => Object.assign({ coord: '3d', G: 0, D0: 2, kFrame: 0, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, kappaT: 0.0001, cLight: 30, bM: 1, etaRad: 0, pRad: 4,
  gravityX: 0, gravityY: 0, geoPN: 0, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 0.01, stateCarry: 'double', massPrecision: 'double' }, extra || {});
const toyPreset = (bodies, phys) => ({ id: 'w309cToy', name: 'w309c toy', description: '器の中の写し(内蔵ではない)', emoji: '·', group: '運動と時空',
  sampleClass: 'principle', fidelity: 'toy', camera: { scale: 50 }, world: { boundary: 'none', size: 0 }, physics: toyPhysics(phys), bodies });
const axisDeg = (tiltDeg, azimuthDeg) => ({ enable: true, tiltDeg, azimuthDeg, source: 'w309c 器の宣言(診断)' });
export const TOY_BODIES = Object.freeze([
  { type: 'single', m: 1, radius: 0.3, x: -1.5, y: 0.4, z: 0.3, vx: 0.1, vy: -0.05, vz: 0.02, spin: 0.6, pinned: false, spinAxis: axisDeg(20, 30) },
  { type: 'single', m: 0.4, radius: 0.2, x: 1.8, y: -0.5, z: -0.6, vx: -0.2, vy: 0.1, vz: 0, spin: -0.4, pinned: false },
  { type: 'single', m: 0.7, radius: 0.25, x: 0.2, y: 2.1, z: 0.9, vx: 0.05, vy: 0.15, vz: -0.03, spin: 0.3, pinned: false, spinAxis: axisDeg(50, 100) }]);
function spinDragOf(model, extra) {
  const sd = Object.assign({ rot: 'surfaceFlip', axial: 'on' }, extra || {});
  if (model === 'mu2') sd.axialCoupling = TOY.kappa; else sd.axialModel = model;
  return sd;
}
const toyDrag = (model, sdExtra, rdExtra) => Object.assign({ law: 'inertial', Wbg: TOY.Wbg, eps: TOY.eps, pairs: 'all', spinDrag: spinDragOf(model, sdExtra) }, rdExtra || {});
function simOf(H, p) {
  const v = H.HP.validatePreset(clone(p));
  if (!v.ok) return { err: (v.errors || [v.err]).join(' / ') };
  const S = H.HP.coord3d.makeSim(); S.build(clone(v.preset));
  return { S, dt: H.evalExpr('appStepDt')(S), preset: v.preset };
}
const stateOf = (H, S) => H.evalExpr('inertialDragInitObsState')(S);
const arr = (a, n) => Array.from(a.subarray ? a.subarray(0, n) : a.slice(0, n));

/* ───────── K: 参照の純関数 ───────── */
export function partK() {
  const g = {}, rows = [];
  let aMax = 0, mMax = 0, daMax = 0, dmMax = 0, leadMax = 0;
  for (const r of [1.5, 2, 2.5, 4, 10, 100, 1e4]) {
    const d = L.ballDirect(r, 1, 64, 96), a = L.ballA2(r, 1), m = L.ballM2(r, 1), h = r * 1e-5;
    const fa = (L.ballA2(r + h, 1) - L.ballA2(r - h, 1)) / (2 * h), fm = (L.ballM2(r + h, 1).M - L.ballM2(r - h, 1).M) / (2 * h);
    const row = { r, A2: a, A2direct: d.A, M2: m.M, M2direct: d.M, dA2: rel(L.ballA2Dr(r, 1), fa), dM2: rel(m.D, fm), lead: m.M / (2 / (5 * r ** 3)) - 1 };
    rows.push(row); aMax = Math.max(aMax, rel(a, d.A)); mMax = Math.max(mMax, rel(m.M, d.M)); daMax = Math.max(daMax, row.dA2); dmMax = Math.max(dmMax, row.dM2);
    if (r >= 100) leadMax = Math.max(leadMax, Math.abs(row.lead) / (1 / (r * r)));
  }
  g.a2Closed = aMax < 1e-12; g.m2Closed = mMax < 1e-12; g.derivFD = daMax < 1e-8 && dmMax < 1e-8; g.m2Lead = leadMax < 1;   // 先頭の次の項は (R/r)² の相対
  let wsum = 0, dbl = 0; for (const q of L.recvRadial(24)) { wsum += q.w; dbl += q.w * L.ballA2(q.t, 1); }
  g.selfCenter = rel(L.ballA2(0, 1), 3) < 1e-15 && rel(L.ballA2(1, 1), 1.5) < 1e-15;
  g.selfDouble = rel(dbl, 9 / 4) < 1e-13 && Math.abs(wsum - 1) < 1e-14;
  const dc1 = L.defaultDragCoreSI(1.989e30, 6.95e8), dc2 = L.defaultDragCoreSI(5.97e24, 6.371e6);
  g.coreCap = dc1.Rd === 6.5e6 && dc1.clamped && dc2.Rd === 6.371e6 && !dc2.clamped;
  // AN362 の例(DECISIONS v68 の数): I = 1・Ω_I = ẑ・ω_D = −0.1 ẑ → E_speed = −0.095・軸 0/ω_D = 0.1 x̂ → E_axis = 0.00501243788791・E_speed = 0.005
  const q1 = L.restoreBudget(1, [0, 0, 1], [0, 0, -0.1]), q2 = L.restoreBudget(1, [0, 0, 1], [0.1, 0, 0]), q3 = L.restoreBudget(1, [0, 0, 1], [0, 0, 1e-20]), q4 = L.restoreBudget(1, [0.3, 0.4, 0], [0, 0, 1e-25]);
  g.heatExamples = rel(q1.Espeed, -0.095) < 1e-14 && q1.Eaxis === 0 && q1.heat === 0 && rel(q1.supply, 0.095) < 1e-14
    && rel(q2.Eaxis, 0.00501243788791) < 1e-11 && rel(q2.Espeed, 0.005) < 1e-14 && rel(q2.heat, 0.01001243788791) < 1e-11;
  g.heatNoCancel = rel(q3.Espeed, 1e-20) < 1e-12 && rel(q4.Eaxis, 0.5e-50) < 1e-12;
  const rr = L.rates(q2.heat, 1, [1]);
  g.heatRateHalf = rel(rr.halfStep / rr.step, 2) < 1e-15;
  g.ledgerClose = [q1, q2, q3, q4].every((q) => q.closeL === 0 && Math.abs(q.closeE) <= 1e-15 * Math.max(q.heat, Math.abs(q.Espeed), 1e-300));
  // 逆写像と不動点(二体の写し —— 太陽と木星の桁を縮めた無次元)
  const B = [{ m: 2, Rd: 1, R: 1, x: [0, 0, 0], v: [0, 1, 0], axis: [0, 0, 1], omega: 1 }, { m: 1, Rd: 0.5, R: 0.5, x: [8, 0, 0], v: [0, 3, 0], axis: [0, 0, 1], omega: 0.1 }];
  const sp = L.decomposeSpin(B, { Wbg: 0 }, { nr: 8, ns: 6, tol: 1e-14 }), mo = L.motionOf(B, { Wbg: 0 }, sp.OmI, { nr: 8, ns: 6 });
  g.toySpin = sp.residual <= 1e-14; g.toyMotion = mo.forwardResidual < 1e-14 && mo.diffIterDirect < 1e-13;
  return { gates: g, rows: rows.map((r) => ({ r: r.r, A2: e4(r.A2), M2: e4(r.M2), relA2: e4(rel(r.A2, r.A2direct)), relM2: e4(rel(r.M2, r.M2direct)), dA2: e4(r.dA2), dM2: e4(r.dM2), lead: e4(r.lead) })),
    heat: { decrease: { Eaxis: q1.Eaxis, Espeed: q1.Espeed, heat: q1.heat, supply: q1.supply }, tilt: { Eaxis: q2.Eaxis, Espeed: q2.Espeed, heat: q2.heat }, halfStepRatio: rr.halfStep / rr.step },
    toy: { spinIter: sp.iterations, spinRes: e4(sp.residual), motionIter: mo.iterations, fwd: e4(mo.forwardResidual), diff: e4(mo.diffIterDirect) } };
}

/* ───────── E: エンジンの門(G = 0 の写し) ───────── */
export function partE(H) {
  const HP = H.HP, out = { rows: [], gates: {} };
  for (const model of ['mu2', 'sphere', 'bevel']) for (const split of ['vector', 'parallel']) {
    const sd = { initSpin: split === 'vector' ? 'observed' : { mode: 'observed', split: 'parallel' } };
    const o = simOf(H, toyPreset(TOY_BODIES, { relativeDrag: toyDrag(model, sd, { initMotion: 'observed' }) }));
    if (o.err) { out.rows.push({ model, split, err: o.err }); continue; }
    const S = o.S, dt = o.dt, st = stateOf(H, S), n = S.n;
    const x0 = [arr(S.x, n), arr(S.y, n), arr(S.z, n)], rA0 = arr(S.rotA, n), a0 = [arr(S.sax, n), arr(S.say, n), arr(S.saz, n)];
    S.step(dt);
    let dx = 0, ra = 0, axErr = 0, vScale = 0;
    for (let i = 0; i < n; i++) {
      const V = [st.obs.vx[i], st.obs.vy[i], st.obs.vz[i]]; vScale = Math.max(vScale, norm(V));
      dx = Math.max(dx, norm(sub([(S.x[i] - x0[0][i]) / dt, (S.y[i] - x0[1][i]) / dt, (S.z[i] - x0[2][i]) / dt], V)));
      const O = scale([st.obs.ax[i], st.obs.ay[i], st.obs.az[i]], st.obs.spin[i]), aI = [a0[0][i], a0[1][i], a0[2][i]];
      ra = Math.max(ra, Math.abs((S.rotA[i] - rA0[i]) / dt - dot(O, aI)) / Math.abs(st.obs.spin[i]));
      const r = st.spin.rows[i];
      if (S.saOn[i] && r.omegaD) {   // 軸の回り方: (â1 − â0)/h ≈ ω_D⊥ × â0(O(h ω²))
        const w = r.omegaD, wp = sub(w, scale(aI, dot(w, aI))), da = scale(sub([S.sax[i], S.say[i], S.saz[i]], aI), 1 / dt);
        axErr = Math.max(axErr, norm(sub(da, cross(wp, aI))) / Math.max(norm(wp), 1e-300) / (norm(w) * dt + 1e-300));
      }
    }
    const used = stateOf(H, S).firstStep.used;
    out.rows.push({ model, split, ok: st.ok, spinIter: st.spin.iterations, spinRes: e4(st.spin.residual), motionIter: st.motion.iterations, fwd: e4(st.motion.forwardResidual),
      diffIterDirect: e4(st.motion.diffIterDirect), cond: e4(st.motion.condMax), dxOverV: e4(dx / vScale), rotA: e4(ra), axisTurnRelOverWh: e4(axErr), firstUsed: used !== null && used > 0,
      spinStored: st.spin.spinStored.every(Boolean), motionStored: st.motion.stored.every(Boolean),
      bodies: st.spin.rows.map((r) => ({ mode: r.mode, dsRel: e4((r.sI - r.sObs) / Math.abs(r.sObs)), axisAngle: e4(r.axisAngle), uRel: e4(norm(st.motion.rows[r.i].u) / norm(st.motion.rows[r.i].V)) })) });
  }
  const R = out.rows.filter((r) => !r.err);
  out.gates.allBuilt = R.length === 6 && R.every((r) => r.ok);
  out.gates.spinConverged = R.every((r) => r.spinRes <= 1e-12);
  out.gates.firstStepDx = R.every((r) => r.dxOverV < 1e-12);
  out.gates.firstStepRotA = R.every((r) => r.rotA < 2e-12);
  out.gates.motionDirectVsIter = R.every((r) => r.diffIterDirect < 1e-11 && r.fwd < 1e-14);
  out.gates.firstUsed = R.every((r) => r.firstUsed);
  out.gates.stored = R.every((r) => r.spinStored && r.motionStored);
  out.gates.parallelKeepsAxis = R.filter((r) => r.split === 'parallel').every((r) => r.bodies.every((b) => b.axisAngle < 1e-15));
  out.gates.vectorTurnsAxis = R.filter((r) => r.split === 'vector').every((r) => r.bodies.some((b) => b.axisAngle > 1e-9));
  // firstStep:"zero" —— 最初の步の Δx/h − V_obs = −u(0)(今の「最初の步は u = 0」)
  {
    const o = simOf(H, toyPreset(TOY_BODIES, { relativeDrag: toyDrag('bevel', { initSpin: { mode: 'observed', firstStep: 'zero' } }, { initMotion: { mode: 'observed', firstStep: 'zero' } }) }));
    const S = o.S, st = stateOf(H, S), n = S.n, x0 = [arr(S.x, n), arr(S.y, n), arr(S.z, n)];
    S.step(o.dt);
    let d = 0, um = 0;
    for (let i = 0; i < n; i++) { const r = st.motion.rows[i], dxh = [(S.x[i] - x0[0][i]) / o.dt, (S.y[i] - x0[1][i]) / o.dt, (S.z[i] - x0[2][i]) / o.dt];
      d = Math.max(d, norm(add(sub(dxh, r.V), r.u)) / norm(r.V)); um = Math.max(um, norm(r.u) / norm(r.V)); }
    out.zeroFirst = { maxRelDxPlusU: e4(d), maxURel: e4(um), used: stateOf(H, S).firstStep.used, flagAfter: S._rdInitFirst === null || S._rdInitFirst === undefined };
    out.gates.zeroFirstLacksU = d < 1e-12 && um > 1e-3 && stateOf(H, S).firstStep.used === null;
  }
  // チェックポイント・分解し直し・非収束・受理
  {
    const o = simOf(H, toyPreset(TOY_BODIES, { relativeDrag: toyDrag('bevel', { initSpin: 'observed' }, { initMotion: 'observed' }) })), S = o.S, n = S.n;
    const snap = H.evalExpr('ckSnapOne')(S), v0 = arr(S.vx, n), s0 = arr(S.spin, n), f0 = S._rdInitFirst;
    for (let k = 0; k < 6; k++) S.step(o.dt);
    const xa = arr(S.x, n), ra = arr(S.rotA, n);
    H.evalExpr('ckRestoreOne')(S, snap);
    const sameV = arr(S.vx, n).every((x, i) => x === v0[i]), sameS = arr(S.spin, n).every((x, i) => x === s0[i]), sameF = S._rdInitFirst === f0;
    for (let k = 0; k < 6; k++) S.step(o.dt);
    const rerun = arr(S.x, n).every((x, i) => x === xa[i]) && arr(S.rotA, n).every((x, i) => x === ra[i]);
    // t > 0 の復帰(5 步目)—— 分解し直さない・最初の步の印は使った後
    const o2 = simOf(H, toyPreset(TOY_BODIES, { relativeDrag: toyDrag('bevel', { initSpin: 'observed' }, { initMotion: 'observed' }) })), S2 = o2.S;
    for (let k = 0; k < 5; k++) S2.step(o2.dt);
    const snap2 = H.evalExpr('ckSnapOne')(S2), xb = arr(S2.x, n);
    for (let k = 0; k < 4; k++) S2.step(o2.dt);
    const xc = arr(S2.x, n);
    H.evalExpr('ckRestoreOne')(S2, snap2);
    const back = arr(S2.x, n).every((x, i) => x === xb[i]);
    for (let k = 0; k < 4; k++) S2.step(o2.dt);
    const again = arr(S2.x, n).every((x, i) => x === xc[i]);
    out.checkpoint = { t0: { sameV, sameS, sameF, rerun }, tMid: { back, again, flag: S2._rdInitFirst } };
    out.gates.checkpointNoRedo = sameV && sameS && sameF && rerun && back && again;
    // redo の冪等(記録の観測の値へ戻してから)と、編集した欄は新しい観測の値として読む
    const o3 = simOf(H, toyPreset(TOY_BODIES, { relativeDrag: toyDrag('bevel', { initSpin: 'observed' }, { initMotion: 'observed' }) })), S3 = o3.S;
    const va = arr(S3.vx, n), sa = arr(S3.spin, n);
    H.evalExpr('inertialDragInitObsRedo')(S3);
    const idem = arr(S3.vx, n).every((x, i) => x === va[i]) && arr(S3.spin, n).every((x, i) => x === sa[i]) && stateOf(H, S3).from === 'redo';
    const st30 = stateOf(H, S3), obsAx2 = [st30.obs.ax[2], st30.obs.ay[2], st30.obs.az[2]];
    S3.vx[1] = -0.25;   // 編集(新しい観測の値)—— vx だけ。vy・vz は分解で書いた値のまま(欄ごとに観測の値へ戻す —— 二重に引かない)
    S3.spin[2] = 0.5;   // 自転の大きさだけ(軸は分解で書いた慣性の軸のまま —— 観測の軸へ戻す)
    H.evalExpr('inertialDragInitObsRedo')(S3);
    const st3 = stateOf(H, S3), edited = st3.obs.vx[1] === -0.25 && st3.obs.vx[0] === TOY_BODIES[0].vx;
    const perField = st3.obs.vy[1] === TOY_BODIES[1].vy && st3.obs.vz[1] === TOY_BODIES[1].vz && st3.obs.spin[2] === 0.5
      && st3.obs.ax[2] === obsAx2[0] && st3.obs.ay[2] === obsAx2[1] && st3.obs.az[2] === obsAx2[2] && st3.obs.spin[0] === TOY_BODIES[0].spin
      && obsAx2.some((a, k) => a !== [st30.state.ax[2], st30.state.ay[2], st30.state.az[2]][k]);   // 写しの軸は分解で回っている(戻す意味がある)
    out.redo = { idempotent: idem, editedReadAsObserved: edited, perField };
    out.gates.redo = idem && edited && perField;
    // 非収束: 分解しない・状態は観測のまま・走行の門が止める
    const o4 = simOf(H, toyPreset(TOY_BODIES, { relativeDrag: toyDrag('bevel', { initSpin: { mode: 'observed', maxIter: 1, tol: 1e-15 } }) })), S4 = o4.S, st4 = stateOf(H, S4);
    const t40 = S4.t; S4.step(o4.dt);
    out.noConverge = { ok: st4.ok, why: st4.why, spinUntouched: S4.spin[0] === TOY_BODIES[0].spin, halted: S4.t === t40 && typeof S4.coord3dHalt === 'string' && S4.coord3dHalt.indexOf('initSpin') >= 0 };
    out.gates.noConvergeRefused = st4.ok === false && out.noConverge.spinUntouched && out.noConverge.halted;
  }
  {
    const tryRd = (rd) => { const v = HP.validatePreset(clone(toyPreset(TOY_BODIES, { relativeDrag: rd }))); return v.ok ? v.preset.physics.relativeDrag : null; };
    const rejects = {
      axialOff: Object.assign(toyDrag('bevel'), { spinDrag: { rot: 'surfaceFlip', axial: 'off', initSpin: 'observed' } }),
      badSplit: toyDrag('bevel', { initSpin: { mode: 'observed', split: 'axis' } }),
      badMode: toyDrag('bevel', { initSpin: { mode: 'declared' } }),
      unknownKey: toyDrag('bevel', {}, { initMotion: { mode: 'observed', gain: 1 } }),
      history: toyDrag('bevel', {}, { solveFrom: 'history', initMotion: 'observed' }),
      rigid: toyDrag('bevel', { rotStep: 'rigid' }, { initMotion: 'observed' }),
      dragOff: Object.assign(toyDrag('bevel'), { Wbg: null, enabled: false, initMotion: 'observed' }),
      tolRange: toyDrag('bevel', { initSpin: { mode: 'observed', tol: 1 } }) };
    const rej = {}; for (const [k, rd] of Object.entries(rejects)) rej[k] = tryRd(rd) === null;
    const p2 = toyPreset(TOY_BODIES.map((b) => { const c = clone(b); delete c.spinAxis; c.z = 0; c.vz = 0; return c; }), { relativeDrag: { law: 'inertial', Wbg: TOY.Wbg, eps: TOY.eps, pairs: 'all', initMotion: 'observed' } });
    delete p2.physics.coord;
    rej.twoD = !HP.validatePreset(clone(p2)).ok;
    const p3 = toyPreset(TOY_BODIES, { relativeDrag: toyDrag('bevel', {}, { initMotion: 'observed' }) }); delete p3.physics.stateCarry;
    rej.noDouble = !HP.validatePreset(clone(p3)).ok;
    const canon = tryRd(toyDrag('bevel', { initSpin: { mode: 'observed', split: 'vector', firstStep: 'drag', tol: 1e-12 } }, { initMotion: { mode: 'observed' } }));
    const canon2 = tryRd(toyDrag('bevel', { initSpin: { mode: 'observed', split: 'parallel' } }, { initMotion: { mode: 'observed', firstStep: 'zero', maxIter: 30 } }));
    const omitted = tryRd(toyDrag('bevel'));
    out.accept = { rejects: rej, canonDefault: { initSpin: canon.spinDrag.initSpin, initMotion: canon.initMotion }, canonOther: { initSpin: canon2.spinDrag.initSpin, initMotion: canon2.initMotion },
      omittedHasNoKey: !('initMotion' in omitted) && !('initSpin' in omitted.spinDrag) };
    out.gates.rejectsAll = Object.values(rej).every(Boolean);
    out.gates.canonical = canon.spinDrag.initSpin === 'observed' && canon.initMotion === 'observed' && canon2.spinDrag.initSpin.split === 'parallel'
      && canon2.initMotion.firstStep === 'zero' && canon2.initMotion.maxIter === 30 && out.accept.omittedHasNoKey;
  }
  // 第296便b の逆写像 v = (I+L)W との差: 対角の足し分が 0・回転引きずりなしでは一致 —— inertialR2 の写しでは対角の足し分の分だけ違う
  {
    const planar = TOY_BODIES.map((b) => { const c = clone(b); delete c.spinAxis; c.z = 0; c.vz = 0; return c; });   // 第296便b の逆写像は二次元の行(z を読まない)—— 平面の写しで比べる
    const cmp = (rd) => {
      const o = simOf(H, toyPreset(planar, { relativeDrag: rd })), S = o.S, st = stateOf(H, S), n = S.n;
      // 観測の値へ戻した写しで旧の逆写像を作る(状態は観測の座標速度 W)
      const T = H.HP.coord3d.makeSim(); T.build(clone(o.preset));
      for (let i = 0; i < n; i++) { T.vx[i] = st.obs.vx[i]; T.vy[i] = st.obs.vy[i]; T.vz[i] = st.obs.vz[i]; }
      const im = H.evalExpr('inertialDragInverseMap')(T);
      let d = 0; for (let i = 0; i < n; i++) d = Math.max(d, Math.hypot(im.vx[i] - S.vx[i], im.vy[i] - S.vy[i]) / norm(st.motion.rows[i].V));
      return { maxRelDiff: e4(d), xMax: e4(st.motion.xMax) };
    };
    const plain = cmp({ law: 'inertial', Wbg: TOY.Wbg, eps: TOY.eps, pairs: 'all', initMotion: 'observed' });
    const i2 = cmp({ law: 'inertial', Wbg: TOY.Wbg, eps: TOY.eps, pairs: 'all', inertialR2: { lambda: 2 }, initMotion: 'observed' });
    out.inverseMap296 = { plain, inertialR2: i2 };
    out.gates.inverseMap296 = plain.maxRelDiff < 1e-14 && i2.maxRelDiff > 1e-6 && i2.xMax > 0;
  }
  return out;
}

/* ───────── P: 在位の本の写し(今のエンジンの法則) ───────── */
/** 惑星 7 本(宣言から —— 第308便c の inputsFromDecl と同じ探し方。本は .find で引く) */
export function planetIds(HP) { return inputsFromDecl(HP).planets.map((p) => p.id); }
export function partP(H) {
  const HP = H.HP, ids = planetIds(HP), rows = [];
  for (const id of ids) for (const model of ['bevel', 'sphere']) {
    const p0 = HP.allPresets().find((p) => p.id === id), p = clone(p0);
    p.physics.relativeDrag.spinDrag = { rot: 'surfaceFlip', axial: 'on', axialModel: model, initSpin: 'observed' };
    p.physics.relativeDrag.initMotion = 'observed';
    const o = simOf(H, p);
    if (o.err) { rows.push({ id, model, err: o.err }); continue; }
    const S = o.S, st = stateOf(H, S), n = S.n, T = 10 ** p.scaleExp.T;
    // 旧の逆写像(第296便b)との差 —— 観測の値の写しで
    const Tm = H.HP.coord3d.makeSim(); Tm.build(clone(o.preset)); for (let i = 0; i < n; i++) { Tm.vx[i] = st.obs.vx[i]; Tm.vy[i] = st.obs.vy[i]; Tm.vz[i] = st.obs.vz[i]; }
    const im = H.evalExpr('inertialDragInverseMap')(Tm);
    // 最初の步(重力あり): drag と zero
    const x0 = [arr(S.x, n), arr(S.y, n), arr(S.z, n)]; S.step(o.dt);
    const uStep = [S._rdUX[1], S._rdUY[1], S._rdUZ[1]];   // 最初の步が使った u(標本 —— semic の v + h a で解いた値)
    const pz = clone(p); pz.physics.relativeDrag.initMotion = { mode: 'observed', firstStep: 'zero' }; pz.physics.relativeDrag.spinDrag.initSpin = { mode: 'observed', firstStep: 'zero' };
    const oz = simOf(H, pz), Sz = oz.S; Sz.step(oz.dt);
    const recv = 1, r = st.motion.rows[recv], V = r.V;
    const dxh = (SS) => [(SS.x[recv] - x0[0][recv]) / o.dt, (SS.y[recv] - x0[1][recv]) / o.dt, (SS.z[recv] - x0[2][recv]) / o.dt];
    const sr = st.spin.rows;
    rows.push({ id, emoji: p0.emoji, model, ok: st.ok, spinIter: st.spin.iterations, spinRes: e4(st.spin.residual),
      sun: { dParOverObs: e4(sr[0].omegaDpar / sr[0].sObs), axisAngle: e4(sr[0].axisAngle) },
      planet: { dParOverObs: e4(sr[1].omegaDpar / sr[1].sObs), perpOverObs: e4(norm(sub(sr[1].omegaD, scale(sr[1].axisObs, sr[1].omegaDpar))) / Math.abs(sr[1].sObs)), axisAngle: e4(sr[1].axisAngle),
        omegaDparSI: e4(sr[1].omegaDpar / T) },
      motion: { uOverV: e4(norm(r.u) / norm(V)), sunUOverVplanet: e4(norm(st.motion.rows[0].u) / norm(V)), cond: e4(st.motion.condMax), xMax: e4(st.motion.xMax), iter: st.motion.iterations,
        fwd: e4(st.motion.forwardResidual), diffIterDirect: e4(st.motion.diffIterDirect),
        inverseMap296Diff: e4(Math.hypot(im.vx[recv] - r.v[0], im.vy[recv] - r.v[1]) / norm(V)) },
      firstStep: { dragDxMinusVOverV: e4(norm(sub(dxh(S), V)) / norm(V)), zeroDxMinusVOverV: e4(norm(sub(dxh(Sz), V)) / norm(V)),
        dragMinusZeroVsUstep: e4(norm(sub(sub(dxh(S), dxh(Sz)), uStep)) / norm(uStep)), uStepVsU0: e4(norm(sub(uStep, r.u)) / norm(r.u)) } });
  }
  const R = rows.filter((r) => !r.err);
  const gates = { built: R.length === ids.length * 2 && R.every((r) => r.ok), converged: R.every((r) => r.spinRes <= 1e-12),
    motionChecks: R.every((r) => r.motion.fwd < 1e-14 && r.motion.diffIterDirect < 1e-12), planets7: ids.length === 7,
    firstStepUsesU: R.every((r) => r.firstStep.dragMinusZeroVsUstep < 1e-4 && r.firstStep.uStepVsU0 < 3 * r.firstStep.dragDxMinusVOverV) };
  return { ids, rows, gates };
}

/* ───────── R: AN357 の再確認(修正版の参照) ───────── */
const bodySI = (b, label) => Object.assign({ label, m: b.m, R: b.R, x: b.x.slice(), v: b.v.slice(), axis: b.axis.slice(), omega: b.omega }, (() => { const c = L.defaultDragCoreSI(b.m, b.R); return { Rd: c.Rd, clamped: c.clamped }; })());
export function configsR(H) {
  const I = inputsFromDecl(H.HP), dtSI = {};
  for (const P of I.planets) { const p = H.HP.allPresets().find((q) => q.id === P.id), o = simOf(H, p); dtSI[P.id] = o.dt * 10 ** p.scaleExp.T; }
  const cfg = [];
  for (const P of I.planets) cfg.push({ key: P.id, ja: '太陽–' + P.name, kind: 'pair', h: dtSI[P.id], bodies: [bodySI(P.sun, '太陽'), bodySI(P.planet, P.name)] });
  const io = I.io, hJ = dtSI[io.preset] || dtSI.jupiterSunInertial3d;
  cfg.push({ key: 'JIo', ja: '木星–イオ(太陽なし)', kind: 'io', h: hJ, bodies: [bodySI(io.jup, '木星'), bodySI(io.io, 'イオ')] });
  cfg.push({ key: 'SJIo', ja: '太陽–木星–イオ', kind: 'io', h: hJ, bodies: [bodySI(io.sunJ, '太陽'), bodySI(io.jup, '木星'), bodySI(io.io, 'イオ')] });
  const sun = bodySI(I.planets[0].sun, '太陽'); sun.x = [0, 0, 0]; sun.v = [0, 0, 0];
  const S7 = [sun].concat(I.planets.map((P) => { const b = bodySI(P.planet, P.name); b.x = sub(P.planet.x, P.sun.x); b.v = sub(P.planet.v, P.sun.v); return b; }));
  cfg.push({ key: 'S7', ja: '太陽 + 惑星 7(太陽を原点に各本の相対の位置と速度を重ねた診断の配置)', kind: 'all', h: Math.min(...Object.values(dtSI)), bodies: S7 });
  return { configs: cfg, ioPlacement: io.placement, dtSI };
}
export function partR(H, quick) {
  const { configs, ioPlacement, dtSI } = configsR(H);
  return Object.assign(recheckFrom(configs, quick), { ioPlacement, dtSI, inputs: configs.map((c) => ({ key: c.key, ja: c.ja, kind: c.kind, h: c.h, bodies: c.bodies })) });
}
/** 構成(SI の天体の列)から表を作る —— html を読まない(QA が正本の inputs から作り直す) */
export function recheckFrom(configs, quick) {
  const ord = quick ? SPEC.quickOrder : SPEC.order, C = { Wbg: SPEC.Wbg };
  const out = [];
  for (const cf of configs) {
    const B = cf.bodies, o = { nr: ord.nr, ns: ord.ns, gain: SPEC.gain, tol: SPEC.spinTol };
    const vec = L.decomposeSpin(B, C, o), par = L.decomposeSpin(B, C, Object.assign({}, o, { split: 'parallel' })), span = L.decomposeSpin(B, C, Object.assign({}, o, { kind: 'span' }));
    const hi = quick ? null : L.decomposeSpin(B, C, Object.assign({}, o, { nr: SPEC.orderHi.nr, ns: SPEC.orderHi.ns }));
    const mo = L.motionOf(B, C, vec.OmI, { nr: ord.nr, ns: ord.ns, tol: SPEC.motionTol });
    const Vmax = Math.max(...B.map((b) => norm(b.v))), raw = { rate: 0, close: 0 };
    const rows = B.map((b, i) => {
      const wD0 = vec.wD[i], par0 = dot(wD0, b.axis), perp = norm(sub(wD0, scale(b.axis, par0))), I = SPEC.inertiaF * b.m * b.R * b.R;
      // 横成分の求積の床: 次数 (16,12) と (24,16) で横成分が 1e-3 より大きく動けば「床」(対称な配置で 0 のはずの成分 —— 0 とみなして熱の軸のコストに入れない)
      const perpHi = hi ? norm(sub(hi.wD[i], scale(b.axis, dot(hi.wD[i], b.axis)))) : null, perpFloor = hi ? Math.abs(perpHi - perp) > 1e-3 * perp : null;
      const wD = perpFloor ? scale(b.axis, par0) : wD0, OmIh = perpFloor ? scale(b.axis, dot(vec.OmI[i], b.axis)) : vec.OmI[i];   // 床の天体は軸の上へ(軸のコストは 0)
      const q = L.restoreBudget(I, OmIh, wD);
      if (perpFloor) { q.Eaxis = 0; q.heat = Math.max(q.Espeed, 0); q.E.heat = q.heat; q.E.background = -q.supply; q.closeE = q.heat - q.Espeed - q.supply; }   // 床: 軸のコストは 0(丸めの値を熱にしない)
      const rt = L.rates(q.heat, cf.h, SPEC.tauHold);
      raw.rate = Math.max(raw.rate, rel(rt.halfStep, 2 * rt.step)); if (q.closeL !== 0) raw.close = Infinity; raw.close = Math.max(raw.close, Math.abs(q.closeE) / Math.max(q.heat, Math.abs(q.Espeed), 1e-300));
      const av = mo.av[i], aI = unit(vec.OmI[i]);
      // 座標系に依らない比: |u(0)| / |V_i − V_k|(k = β_ik が最大の源 —— 支配的な引きずりの源に対する相対の速さ)。|u(0)|/|V| は配置の座標系(日心・重心)に依る
      let kDom = -1; av.beta.forEach((be, j) => { if (j !== i && be > 0 && (kDom < 0 || be > av.beta[kDom])) kDom = j; });
      const vRel = kDom >= 0 ? norm(sub(b.v, B[kDom].v)) : 0;
      return { body: b.label, m: b.m, R: b.R, Rd: b.Rd, clamped: b.clamped, omegaObs: b.omega,
        omegaD: wD0.map(e4), omegaDpar: e4(par0), omegaDparOverObs: e4(par0 / b.omega), omegaDperpOverObs: perpFloor ? null : e4(perp / Math.abs(b.omega)), perpFloor, perpHiRel: hi ? e4(Math.abs(perpHi - perp) / Math.max(perp, 1e-300)) : null,
        omegaIpar: e4(dot(vec.OmI[i], b.axis)), omegaIOverObsMinus1: e4(dot(vec.OmI[i], b.axis) / b.omega - 1), axisAngleRad: perpFloor ? null : e4(Math.atan2(norm(cross(aI, b.axis)), dot(aI, b.axis) * Math.sign(b.omega))),
        parallelOmegaIOverObsMinus1: e4(dot(par.OmI[i], b.axis) / b.omega - 1), spanOverPoint: e4(dot(span.wD[i], b.axis) / par0),
        orderHiRel: hi ? e4(norm(sub(hi.wD[i], wD)) / Math.max(norm(wD), 1e-300)) : null, negFrac: e4(av.negFrac), sumBeta: e4(av.sumBeta), cond: e4(mo.cond[i]),
        uOverV: norm(b.v) > 1e-6 * Vmax ? e4(norm(mo.u[i]) / norm(b.v)) : null, uOverVmax: e4(norm(mo.u[i]) / Vmax), u: mo.u[i].map(e4),
        uAbs: e4(norm(mo.u[i])), domSource: kDom >= 0 ? B[kDom].label : null, uOverVrel: vRel > 0 ? e4(norm(mo.u[i]) / vRel) : null, rot: av.rot.map(e4), Wmin: e4(av.Wmin), Wmax: e4(av.Wmax),
        heat: { I: e4(I), Eaxis: e4(q.Eaxis), Espeed: e4(q.Espeed), Q: e4(q.heat), supply: e4(q.supply), Pstep: e4(rt.step), PhalfStep: e4(rt.halfStep), Phold: rt.hold.map((x) => ({ tau: x.tau, P: e4(x.P) })) },
        ledger: { Lfield: q.L.field.map(e4), Lbackground: q.L.background.map(e4), Efield: e4(q.E.field), Ebackground: e4(q.E.background), heat: e4(q.E.heat), closeL: q.closeL, closeE: e4(q.closeE) } };
    });
    out.push({ key: cf.key, ja: cf.ja, kind: cf.kind, hSI: cf.h, spinIter: vec.iterations, spinRes: e4(vec.residual), parIter: par.iterations, spanIter: span.iterations, Vmax,
      rawRateHalfRel: raw.rate, rawLedgerCloseRel: raw.close,
      motion: { iter: mo.iterations, fwd: e4(mo.forwardResidual), diffIterDirect: e4(mo.diffIterDirect) }, rows });
  }
  return { configs: out, spec: SPEC, quick: !!quick };
}
export function gatesR(R) {
  const all = R.configs.flatMap((c) => c.rows);
  return { converged: R.configs.every((c) => c.spinRes <= SPEC.spinTol), motionChecks: R.configs.every((c) => c.motion.fwd < 1e-13 && c.motion.diffIterDirect < 1e-12),
    ledgerClosed: R.configs.every((c) => c.rawLedgerCloseRel <= 1e-15),
    rateHalf: R.configs.every((c) => c.rawRateHalfRel < 1e-15), orderConv: R.quick || all.every((r) => r.orderHiRel === null || r.orderHiRel < 1e-3),
    configs: R.configs.length === 10 };
}

/* ───────── 正本から作る表と数(PHYSICS の本文に入っていること —— QA が照合) ───────── */
const rowOf = (J, key, body) => J.recheck.configs.find((c) => c.key === key).rows.find((r) => r.body === body);
export function docTable(J) {
  const T = ['| 構成 | 受け手 | R_d [m] | ω_D∥/Ω_obs | ω_D⊥/Ω_obs | ω_I∥/Ω_obs − 1 | 軸の角 [rad] | 平行の型の ω_I/Ω_obs − 1 | span/point | 負の点 | Σβ | |u(0)| [m/s] | |u(0)|/|V − V_k| | Q [J] | E_speed [J] | P(1 步) [W] | P(τ=1 日) [W] |',
    '|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|'];
  for (const c of J.recheck.configs) for (const r of c.rows) {
    const fl = (x) => (r.perpFloor ? '床' : f3(x));
    T.push(`| ${c.key} | ${r.body} | ${f3(r.Rd)} | ${f3(r.omegaDparOverObs)} | ${fl(r.omegaDperpOverObs)} | ${f3(r.omegaIOverObsMinus1)} | ${fl(r.axisAngleRad)} | ${f3(r.parallelOmegaIOverObsMinus1)} | ${f3(r.spanOverPoint)} | ${f3(r.negFrac)} | ${f3(r.sumBeta)} | ${f3(r.uAbs)} | ${f3(r.uOverVrel)} | ${f3(r.heat.Q)} | ${f3(r.heat.Espeed)} | ${f3(r.heat.Pstep)} | ${f3(r.heat.Phold[1].P)} |`);
  }
  return T.join('\n');
}
export function docTableP(J) {
  const T = ['| 本 | 核 | 太陽 ω_D∥/Ω_obs | 惑星 ω_D∥/Ω_obs | 惑星 ω_D⊥/Ω_obs | 惑星の軸の角 [rad] | |u(0)|/|V| | 対角の足し分 x | 第296便b の逆写像との差 | 最初の步 drag − zero と u の差 | u(步)/u(0) − 1 | 最初の步の Δx/h − V(h a の分) |',
    '|---|---|---|---|---|---|---|---|---|---|---|---|'];
  for (const r of J.engine.planets.rows.filter((x) => !x.err)) T.push(`| ${r.emoji} | ${r.model} | ${f3(r.sun.dParOverObs)} | ${f3(r.planet.dParOverObs)} | ${f3(r.planet.perpOverObs)} | ${f3(r.planet.axisAngle)} | ${f3(r.motion.uOverV)} | ${f3(r.motion.xMax)} | ${f3(r.motion.inverseMap296Diff)} | ${f3(r.firstStep.dragMinusZeroVsUstep)} | ${f3(r.firstStep.uStepVsU0)} | ${f3(r.firstStep.dragDxMinusVOverV)} |`);
  return T.join('\n');
}
export function docNumbers(J) {
  const j = rowOf(J, 'jupiterSunInertial3d', '木星'), io = rowOf(J, 'JIo', 'イオ'), sj = rowOf(J, 'SJIo', 'イオ'), sun = rowOf(J, 'S7', '太陽'), v = rowOf(J, 'venusSunInertial3d', '金星'), me = rowOf(J, 'mercurySunInertial3d', '水星');
  return [f3(j.omegaDparOverObs), f3(j.uOverV), f3(io.omegaDparOverObs), f3(io.uOverV), f3(io.uOverVrel), f3(io.uAbs), f3(io.sumBeta), f3(sj.uOverVrel), f3(sun.omegaDparOverObs), f3(v.omegaDparOverObs), f3(v.heat.Espeed), f3(me.heat.Espeed), f3(me.uOverV)]
    .filter((x) => x !== '—' && x !== '0');
}
const NOT_CLAIM = ['観測の自転に合わせた', '熱を説明した', '法則を導いた', '帳簿が完全に閉じた', '自転が釣り合った', '銀河の自転で太陽の自転を説明した'];

export function runAll(H, quick) {
  const timing = {}, tm = (k, f) => { const t = Date.now(); const r = f(); timing[k] = { wallSec: (Date.now() - t) / 1000 }; return r; };
  const K = tm('K', () => partK()), E = tm('E', () => partE(H)), P = tm('P', () => partP(H)), R = tm('R', () => partR(H, quick));
  const gR = gatesR(R);
  const gates = {};
  for (const [pre, g] of [['K', K.gates], ['E', E.gates], ['P', P.gates], ['R', gR]]) for (const [k, v] of Object.entries(g)) gates[pre + '.' + k] = v;
  return { ok: Object.values(gates).every(Boolean), gates, lib: K, engine: { toy: E, planets: P }, recheck: R, timing };
}

export async function main() {
  const TARGET = process.env.W309C_TARGET || 'beta/index.html', QUICK = process.env.W309C_QUICK === '1';
  const OUT = process.env.W309C_OUT || path.join(ROOT, 'tests', 'out', 'recheck-w309c.json');
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now();
  const W281A_SCOPE = w281aScopeStamp(html, REGEN_SCOPE);
  const H = loadHtmlHeadless(html);
  pinDecl315c(H.evalExpr);   // 第315便c(AN406): 在位の 7 本の宣言を移行の前の写しへ(本ごとの門 —— 基点の html では no-op・正本の欄は足さない)
  const R = runAll(H, QUICK);
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w309c-recheck.mjs', target: TARGET,
    targetSha256: crypto.createHash('sha256').update(fs.readFileSync(html)).digest('hex'),
    ruling: '原仮定者の裁定(第103報)AN355(慣性自転の初期値 = 観測値の自転 − 引きずり軸回転の初期値)・AN357(正確な引きずりの修正版で再確認)・(第104報)AN362・AN363・(第105報)AN364(慣性移動の初期値 = 観測値の移動 − 引きずり移動の初期値)・決断事項 AN355・AN357・AN362・AN363・AN364・統括の検証項目 R220',
    initObsVersion: H.evalExpr('REL_DRAG_INIT_OBS_VERSION'), ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w309c-recheck.mjs', 'tests/lib-w315c-legacy7.mjs', 'tests/lib-w309c-recheck.mjs', 'tests/exp-w308c-sunspin.mjs', 'tests/lib-w308c-sunspin.mjs', 'tests/exp-w307c-spindecomp.mjs', 'tests/lib-w307c-spindecomp.mjs',
    'tests/lib-w307b-tide3d.mjs', 'tests/lib-w307a-sphereaxial.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第309便c', target: TARGET, code: CODE, inputs: [TARGET, LEGACY7_DATA_FILE] }), {
    harnessVersion: HARNESS_VERSION,
    engine: 'Node(tests/lib-w279b-headless.mjs の loadHtmlHeadless —— validatePreset・build・step・読み口はエンジンのまま。修正版の引きずりは器の参照の純関数〔エンジンの式ではない —— 第309便a の新則と統合の後に照合〕)',
    notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  if (!QUICK || process.env.W309C_OUT) { fs.mkdirSync(path.dirname(OUT), { recursive: true }); fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n'); }
  console.log('→', QUICK && !process.env.W309C_OUT ? '(試走 —— 正本は書かない)' : path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(Object.entries(out.gates).filter(([, v]) => !v).map(([k]) => k)), out.elapsedS + ' s', JSON.stringify(out.timing));
}
if (IS_MAIN) await main();
