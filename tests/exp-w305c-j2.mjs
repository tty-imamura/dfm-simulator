// 第305便c(DECISIONS v63 AN327 ③⑤・v64 §0 AN327「交点は J₂ —— 全残差の帰属は追加の測定の後」・統括の検証項目 R201)——
// **三次元の J₂ の器**(Node だけ —— 対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、アプリの三次元の步
// 〔HP.coord3d.makeSim の step〕を走らせる。走行は 1 プロセスで順に —— 1062 公転の走行は同時 1 本)。
// エンジンの宣言 bodies[i].j2:{J2, req, axis?}(三次元の本だけ・省略時オフ —— dfmCore3 の外の j2Kick3・反作用で運動量を保つ)を確かめ、
// 🌦️ の写しで地球の J₂ による交点・近地点・恒星月(長窓 M4)を測る。
//
// ■ 段(正本 tests/out/j2-w305c.json —— 段 j2-305c)。W305C_PARTS=unit,analytic,em,emo,record(既定は全部)で段を分けて走らせられる
//   (分けたときは既存の出力 JSON の他の段を残して上書き —— 鎖は全段で走らせる)。W305C_OUT で出力先を変える(試走は正本を書かない)。
//   unit      零試験(J₂ = 0 の宣言 ↔ 宣言なしで全状態がビット同一 —— 🌦️ の写し・二体の leapfrog)・軸の経路("spin" + spinAxis.enable ↔ 同じ角の固定の軸で
//             ビット同一・軸の無い "spin" ↔ 傾き 0 の固定の軸)・保存(二体とも自由: 全運動量・軌道の L + 図形の帳簿 j2FigL・E_N + U_J₂)・受理(二次元の拒否・値域)。
//   analytic  試験粒子(質量比 10⁻⁶ —— 中心 pinned)の交点 Ω̇・近点の引数 ω̇ を解析の一次の永年の式(HP.j2SecularRates)と比べる。J₂ の分 =(J₂ あり − J₂ なし)の
//             同じ刻みの差(積分器の近点の偽の回転を引く)・軸は +z / 傾けた固定の軸・積分器 semi と leapfrog・1 周 1000/2000 步 —— 門は相対 1e-3。
//   em        🌦️ の写し(本の宣言から j2 を外した写し = J₂ なし / 地球に EARTH_J2 を置いた写し = J₂ あり)の長窓 [0,1062] の M4・恒星月・交点・近点月(h・h/2)、
//             軸の方位の感度(方位 0°)、器の中の参照積分(EM.refRun の J₂ 項 —— 極は黄経 90° 側)との一致、解析の見積り(交点と近地点の J₂ の分)。
//   emo       🌔 = J₂ ありの 🌦️ の写しの規則(emOnlyBodies・emOnlyPhysics)の 118/354 公転窓(h・h/2)と J₂ なしの写しとの差。
//   record    J₂ ありの 🌦️ の fitRecord(標的 4: 近点の周期 M4・恒星月・平均離心率・交点の周期 —— 長窓)を測った数から作り、本の宣言の記録と同じか・受理・条件の署名 match・門。
//
// ■ しないこと・言わないこと
//   ・引きずりの式は変えない(🌦️🌔 は引きずり OFF のまま)。閾値を作り替えない。届かない量は「この探索範囲では未達 —— 次の見直し」と書く。
//   ・「月を再現した」「現実を再現した」「交点を再現した」とは書かない(J₂ を入れて残る差の帰属は追加の測定の後)。
//
// 実行(Node だけ):
//   node tests/exp-w305c-j2.mjs                        → 正本 tests/out/j2-w305c.json
//   W305C_PARTS=analytic node tests/exp-w305c-j2.mjs   → 段 analytic だけ(他の段は既存の出力から残す)
//   W305C_OUT=<json> で試走(正本を書かない)。走行は決定的(同じ html・同じ Node で同じ数 —— 壁時計の欄は volatilePaths)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as L from './lib-w297b-fit.mjs';
import * as EM from './exp-w303c-earthmoon.mjs';
import { emOnlyBodies, emOnlyPhysics, declCheck as emDeclCheck, runEm3, windowsOf as emWindowsOf } from './exp-w300b-emonly.mjs';
import { pinDecl315c, LEGACY7_DATA_FILE } from './lib-w315c-legacy7.mjs';   // 第315便c(決断事項 AN406・R244): 在位の 7 本を K1 へ移した世代では、この器は移行の前(af2f426)の宣言の写しで測る
const REGEN_SCOPE = {"presets":["earthMoonOnly3d","earthMoonSunInertial3d","mercurySunInertial3d","plutoCharonInertialFit"],"roots":["$","DT","FIT_COND_KEYS","FIT_COND_VERSION","FIT_KNOB_KEYS","FIT_NUMERICS_KEYS","FIT_RECORD_KEYS","FIT_RECORD_VERSION","FIT_RECORD_VERSIONS","FIT_RESIDUAL_KEYS","FIT_TARGET_KEYS","FIT_TOL_KEYS","HP.FIT_COND_VERSION","HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.fitCondInputsOf","HP.fitCondSig","HP.fitCondStateOf","HP.fitTargetGates","HP.inertialDragState","HP.j2SecularRates","HP.j2State","HP.sim","HP.synodic","HP.validateFitRecord","HP.validatePreset","T","ctx","cw","dfmGaussLegendre01","dfmInertialDragStep","dragCoreAngular","dragCoreAvgK","dragCoreLookup","dragCoreTableBuild","inertialDragNormApply","j2Energy","j2Kick3","j2Prepare","pnSource","relDragCoefficientOf","synUniform","validateFitRecord","validateJ2Body"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w305c-j2-1';
const clone = (x) => JSON.parse(JSON.stringify(x));
const TARGET = process.env.QA_TARGET || 'beta/index.html';
export const FIT_ID = EM.FIT_ID, EMO_ID = EM.EMO_ID;
export const DT = 0.016, DT2 = 0.008;
export const YEAR = EM.YEAR, DAY = EM.DAY;
export const LONG = 1062, WINS = Object.freeze([118, 354, 708, 1062]);
/** 地球の J₂ の宣言(本の単位: 長さ 10⁸ m)。GRS80 の定義定数 J₂ = 1.08263×10⁻³・a = 6378137 m(Moritz 2000)・平均の黄道傾斜 23.4392911°(IERS Conventions 2010 の J2000 の値 84381.406″)。
 *  軸は固定の軸(地球の自転軸の宣言 spinAxis は変えない —— 図形の軸だけ): 傾き = 黄道傾斜・方位 90°(極は黄経 90° 側 = 本の +x を春分点とみなした置き方 ——
 *  第303便c の参照積分 J2_EARTH と同じ・元期の宣言なし)。本の xy 面は地球–月の重心の公転面(黄道)・月の軌道傾斜と交点はこの面で測る。 */
export const EARTH_J2 = Object.freeze({ J2: 1.08263e-3, req: 0.06378137, axis: Object.freeze({ tiltDeg: 23.4392911, azimuthDeg: 90 }) });
export const EARTH_J2_SOURCE = 'GRS80 の定義定数(Moritz 2000 —— J₂ 1.08263×10⁻³・赤道半径 6378137 m)・黄道傾斜 23.4392911°(IERS Conventions 2010 の J2000 の平均の値)';
/** 照合許容(第304便c と同じ宣言 —— 出典に σ が無い)。近点・交点 0.005 年・恒星月 0.00005 日・平均離心率 0.00005 */
export const TOL = Object.freeze({ aps: 0.005, sid: 0.00005, node: 0.005, e: 0.00005 });
export const OBS_B1 = EM.OBS_B1;
/** 解析の門(試験粒子の J₂ の一次の永年の率との相対差) */
export const ANALYTIC_TOL = 1e-3;
export const findPreset = (HP, id) => HP.allPresets().find((q) => q.id === id);
const canon = (v) => { if (Array.isArray(v)) return v.map(canon); if (v && typeof v === 'object') { const o = {}; for (const k of Object.keys(v).sort()) o[k] = canon(v[k]); return o; } return v; };
export const same = (a, b) => JSON.stringify(canon(a)) === JSON.stringify(canon(b));
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const unit = (a) => { const n = Math.hypot(...a); return a.map((x) => x / n); };

/* ── 写し ── */
/** 本の宣言から j2 を外した bodies(J₂ なし)と、地球(添字 iE)に j2 を置いた bodies(J₂ あり)。他の欄は本の宣言のまま */
export function withJ2(bodies, iE, j2) { const B = clone(bodies); if (j2) B[iE].j2 = clone(j2); else delete B[iE].j2; return B; }
/** 🌦️(か 🌔)の写し(他の欄は html から・fitRecord を外す)。o.j2 = null で J₂ なし・オブジェクトで地球に置く */
export function copyOf(HP, id, o = {}) {
  const q = clone(findPreset(HP, id)); delete q.fitRecord;
  const iE = id === EMO_ID ? 0 : 1;
  if (o.j2 !== undefined) q.bodies = withJ2(q.bodies, iE, o.j2);
  return q;
}
/** 二体の試験の本(中心 m 1・半径 0.01・試験粒子 mp)。軸の基底 p で軌道要素 (a, e, inc, Om, w) を置く。physics は 🌦️ の写しから引きずりを外し G 1・ε 1e-4 */
export function twoBodyOf(HP, o) {
  const ph = clone(findPreset(HP, FIT_ID).physics);
  delete ph.relativeDrag; ph.geoPN = 0; ph.G = 1; ph.softening = 1e-4; ph.softeningFloor = 1e-4; ph.massFloor = 1e-9;
  const [e1, e2, e3] = basisOf(o.p || [0, 0, 1]), mp = o.mp ?? 1e-6, mc = o.mc ?? 1, mu = mc + mp;
  const inc = o.inc * Math.PI / 180, Om = (o.Om || 0) * Math.PI / 180, w = (o.w || 0) * Math.PI / 180, rp = o.a * (1 - o.e), vp = Math.sqrt(mu * (1 + o.e) / rp);
  const cO = Math.cos(Om), sO = Math.sin(Om), ci = Math.cos(inc), si = Math.sin(inc), cw = Math.cos(w), sw = Math.sin(w);
  const P = [cO * cw - sO * sw * ci, sO * cw + cO * sw * ci, sw * si], Q = [-cO * sw - sO * cw * ci, -sO * sw + cO * cw * ci, cw * si];
  const toW = (x) => [0, 1, 2].map((k) => x[0] * e1[k] + x[1] * e2[k] + x[2] * e3[k]);
  const R = toW(P.map((v) => rp * v)), V = toW(Q.map((v) => vp * v)), fc = mp / mu, fp = mc / mu;
  const free = o.pinC === false;
  const c = { type: 'single', m: mc, radius: 0.01, x: free ? -fc * R[0] : 0, y: free ? -fc * R[1] : 0, z: free ? -fc * R[2] : 0,
    vx: free ? -fc * V[0] : 0, vy: free ? -fc * V[1] : 0, vz: free ? -fc * V[2] : 0, spin: 0, pinned: !free };
  if (o.j2) c.j2 = clone(o.j2);
  if (o.spinAxis) c.spinAxis = clone(o.spinAxis);
  const t = { type: 'single', m: mp, radius: 0.001, x: free ? fp * R[0] : R[0], y: free ? fp * R[1] : R[1], z: free ? fp * R[2] : R[2],
    vx: free ? fp * V[0] : V[0], vy: free ? fp * V[1] : V[1], vz: free ? fp * V[2] : V[2], spin: 0, pinned: false };
  return { id: 'j2test305c', name: 'J₂ の試験(器の中だけ)', emoji: '🧪', description: '第305便c の器の中の試験の本', camera: { scale: 100, follow: 0 }, world: { boundary: 'none', size: 0 },
    physics: ph, integrator: o.integ || 'semi', bodies: [c, t] };
}
export function basisOf(p) { const e3 = unit(p), t = Math.abs(e3[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0], e1 = unit(cross(t, e3)); return [e1, cross(e3, e1), e3]; }
function buildSim(HP, preset) {
  const v = HP.validatePreset(clone(preset));
  if (!v.ok) throw new Error('validatePreset: ' + JSON.stringify(v.errors).slice(0, 300));
  const S = HP.coord3d.makeSim(); S.build(clone(v.preset));
  if (S.coord3d !== true) throw new Error('三次元の本ではない');
  return { S, warnings: v.warnings || [] };
}
const STATE_KEYS = ['x', 'y', 'z', 'vx', 'vy', 'vz', 'spin', 'carVx', 'carVy', 'carVz'];
function sameBits(A, B) {
  const diff = [];
  for (const k of STATE_KEYS) {
    const a = A[k], b = B[k];
    if (!a && !b) continue;
    if (!a || !b || a.length !== b.length) { diff.push(k); continue; }
    const ba = Buffer.from(a.buffer, a.byteOffset, a.byteLength), bb = Buffer.from(b.buffer, b.byteOffset, b.byteLength);
    if (!ba.equals(bb)) diff.push(k);
  }
  if (!Object.is(A.t, B.t)) diff.push('t');
  return diff;
}

/* ── 段 unit ── */
export async function stageUnit(HP, log) {
  const t0 = Date.now(), out = {};
  // ① 零試験(🌦️ の写し 20000 步・二体の leapfrog 40000 步)
  const pairs = [
    ['em', copyOf(HP, FIT_ID, { j2: null }), copyOf(HP, FIT_ID, { j2: Object.assign(clone(EARTH_J2), { J2: 0 }) }), DT, 20000],
    ['twoBodyLeapfrog', twoBodyOf(HP, { a: 1, e: 0.1, inc: 30, Om: 20, w: 40, integ: 'leapfrog', pinC: false, mp: 0.3 }),
      twoBodyOf(HP, { a: 1, e: 0.1, inc: 30, Om: 20, w: 40, integ: 'leapfrog', pinC: false, mp: 0.3, j2: { J2: 0, req: 0.1 } }), 2 * Math.PI / 1000, 40000]];
  out.zero = pairs.map(([key, a, b, dt, N]) => {
    const A = buildSim(HP, a).S, B = buildSim(HP, b).S;
    for (let k = 0; k < N; k++) { A.step(dt); B.step(dt); }
    const d = sameBits(A, B), st = HP.j2State(B);
    log(`unit.zero ${key}: 差 ${d.length ? d.join(',') : 'なし'}(${N} 步)`);
    return { key, steps: N, dt, diff: d, same: d.length === 0, evals: st ? st.evals : null, aMax: st ? st.aMax : null };
  });
  // ② 軸の経路("spin" + spinAxis.enable ↔ 同じ角の固定の軸・軸の無い既定 ↔ 傾き 0 の固定の軸)
  const ax = { tiltDeg: 35, azimuthDeg: 120 }, base = { a: 1, e: 0.2, inc: 45, Om: 20, w: 40, integ: 'semi', p: [0, 0, 1] };
  const axisCases = [
    ['spinAxis', twoBodyOf(HP, Object.assign({}, base, { j2: { J2: 0.01, req: 0.1, axis: 'spin' }, spinAxis: { enable: true, tiltDeg: 35, azimuthDeg: 120, source: '器の中の試験' } })),
      twoBodyOf(HP, Object.assign({}, base, { j2: { J2: 0.01, req: 0.1, axis: ax }, spinAxis: { enable: true, tiltDeg: 35, azimuthDeg: 120, source: '器の中の試験' } }))],
    ['defaultZ', twoBodyOf(HP, Object.assign({}, base, { j2: { J2: 0.01, req: 0.1 } })), twoBodyOf(HP, Object.assign({}, base, { j2: { J2: 0.01, req: 0.1, axis: { tiltDeg: 0 } } }))]];
  out.axis = axisCases.map(([key, a, b]) => {
    const A = buildSim(HP, a).S, B = buildSim(HP, b).S, dt = 2 * Math.PI / 1000;
    for (let k = 0; k < 20000; k++) { A.step(dt); B.step(dt); }
    const d = sameBits(A, B), sa = HP.j2State(A), sb = HP.j2State(B);
    log(`unit.axis ${key}: 差 ${d.length ? d.join(',') : 'なし'}・軸 ${sa.sources[0].axisFrom}/${sb.sources[0].axisFrom}`);
    return { key, diff: d, same: d.length === 0, axisFrom: [sa.sources[0].axisFrom, sb.sources[0].axisFrom], axis: sa.sources[0].axis };
  });
  // ③ 保存(二体とも自由 —— 質量比 0.3・J₂ 0.05・R 0.2・傾けた軸)
  {
    const pre = twoBodyOf(HP, { a: 1, e: 0.15, inc: 40, Om: 30, w: 50, integ: 'leapfrog', pinC: false, mp: 0.3, j2: { J2: 0.05, req: 0.2, axis: { tiltDeg: 25, azimuthDeg: 60 } } });
    const { S } = buildSim(HP, pre), dt = 2 * Math.PI / 2000, N = 200000;
    const tot = () => { const T = HP.coord3d.totals(S), st = HP.j2State(S); return { P: T.P, L: T.L, E: T.E, U: st.U, figL: st.figL }; };
    const z0 = tot();
    let dPmax = 0, dLmax = 0, dEmax = 0, dLorbMax = 0;
    const pScale = Math.abs(S.m[1] * Math.hypot(S.vx[1], S.vy[1], S.vz[1])), lScale = Math.hypot(...z0.L), eScale = Math.abs(z0.E);
    for (let k = 1; k <= N; k++) {
      S.step(dt);
      if (k % 200 === 0) {
        const z = tot();
        dPmax = Math.max(dPmax, Math.hypot(...z.P.map((v, i) => v - z0.P[i])) / pScale);
        dLmax = Math.max(dLmax, Math.hypot(...z.L.map((v, i) => v + z.figL[i] - z0.L[i] - z0.figL[i])) / lScale);
        dLorbMax = Math.max(dLorbMax, Math.hypot(...z.L.map((v, i) => v - z0.L[i])) / lScale);
        dEmax = Math.max(dEmax, Math.abs(z.E + z.U - z0.E - z0.U) / eScale);
      }
    }
    const st = HP.j2State(S);
    out.conserve = { steps: N, dt, momentumRel: dPmax, angMomWithFigRel: dLmax, angMomOrbitOnlyRel: dLorbMax, energyWithJ2Rel: dEmax, relMax: st.relMax, evals: st.evals,
      lim: { momentum: 1e-12, angMom: 1e-10, energy: 1e-5 },
      note: '全運動量(作用反作用)・軌道の L + 図形の帳簿 j2FigL(軸は規定 —— 図形が受けるはずの角運動量)・E_N + U_J₂(軸が固定 —— leapfrog の有界な誤差)。軌道の L だけは J₂ のトルクで動く(対照)' };
    out.conserve.ok = dPmax <= 1e-12 && dLmax <= 1e-10 && dEmax <= 1e-5 && dLorbMax > 1e3 * dLmax;
    log(`unit.conserve: P ${dPmax.toExponential(2)}・L+fig ${dLmax.toExponential(2)}(軌道だけ ${dLorbMax.toExponential(2)})・E+U ${dEmax.toExponential(2)}`);
  }
  // ④ 受理
  {
    const q = copyOf(HP, FIT_ID, { j2: EARTH_J2 }), r = (x) => { const v = HP.validatePreset(clone(x)); return { ok: v.ok, err: v.ok ? null : String((v.errors || [])[0] || '').slice(0, 160), warn: (v.warnings || []).length }; };
    const q2d = clone(q); delete q2d.physics.coord;
    const bad = (j2) => { const z = clone(q); z.bodies[1].j2 = j2; return r(z); };
    out.accept = { ok3d: r(q), reject2d: r(q2d), badJ2: bad({ J2: 0.6, req: 0.06 }), badReq: bad({ J2: 1e-3, req: 0 }), badKey: bad({ J2: 1e-3, req: 0.06, c22: 1 }),
      badAxis: bad({ J2: 1e-3, req: 0.06, axis: 'x' }), badTilt: bad({ J2: 1e-3, req: 0.06, axis: { tiltDeg: 200 } }),
      groupWarn: (() => { const z = clone(q); z.bodies.push({ type: 'ring', n: 4, cx: 0, cy: 0, r: 10, m: 1e-9, j2: { J2: 1e-3, req: 1 } }); const v = HP.validatePreset(z); return { ok: v.ok, warn: (v.warnings || []).filter((w) => /j2/.test(w)).length }; })() };
    out.accept.ok = out.accept.ok3d.ok && !out.accept.reject2d.ok && /三次元/.test(out.accept.reject2d.err || '') && ['badJ2', 'badReq', 'badKey', 'badAxis', 'badTilt'].every((k) => !out.accept[k].ok);
  }
  out.ok = out.zero.every((z) => z.same) && out.axis.every((z) => z.same) && out.conserve.ok && out.accept.ok;
  out.wallSec = (Date.now() - t0) / 1000;
  return out;
}

/* ── 段 analytic ── */
/** 試験粒子の走行: 軸 p の基底で接触要素を 25 步ごとに作り、Ω・ω の時刻への直線の傾き(rad/時間)と平均の a・e・i */
export function runTest(HP, o) {
  const { S } = buildSim(HP, twoBodyOf(HP, o)), [e1, e2, e3] = basisOf(o.p || [0, 0, 1]), mu = (o.mc ?? 1) + (o.mp ?? 1e-6);
  const P = 2 * Math.PI * Math.sqrt(o.a ** 3 / mu), dt = P / o.spo, N = Math.round(o.orbits * o.spo);
  const ts = [], Om = [], om = [], aa = [], ee = [], ii = [];
  let Op = null, wp = null, Oacc = 0, wacc = 0;
  const wrap = (d) => { while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; return d; };
  for (let k = 0; k <= N; k++) {
    if (k % 25 === 0) {
      const rW = [S.x[1] - S.x[0], S.y[1] - S.y[0], S.z[1] - S.z[0]], vW = [S.vx[1] - S.vx[0], S.vy[1] - S.vy[0], S.vz[1] - S.vz[0]];
      const r = [dot(rW, e1), dot(rW, e2), dot(rW, e3)], v = [dot(vW, e1), dot(vW, e2), dot(vW, e3)];
      const h = cross(r, v), hn = Math.hypot(...h), rn = Math.hypot(...r), ev = cross(v, h).map((x, i) => x / mu - r[i] / rn), Nn = [-h[1], h[0], 0];
      const O = Math.atan2(h[0], -h[1]), w = Math.atan2(dot(cross(Nn, ev), h) / hn, dot(Nn, ev));
      if (Op === null) { Oacc = O; wacc = w; } else { Oacc += wrap(O - Op); wacc += wrap(w - wp); }
      Op = O; wp = w; ts.push(S.t); Om.push(Oacc); om.push(wacc); aa.push(1 / (2 / rn - dot(v, v) / mu)); ee.push(Math.hypot(...ev)); ii.push(Math.acos(h[2] / hn));
    }
    if (k < N) S.step(dt);
  }
  const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
  return { node: L.linfit(ts, Om).slope, peri: L.linfit(ts, om).slope, a: mean(aa), e: mean(ee), inc: mean(ii), steps: N, dt, j2: HP.j2State(S) };
}
export const CASES = Object.freeze([
  Object.freeze({ key: 'z-i30', p: [0, 0, 1], axis: null, inc: 30, e: 0.1 }),
  Object.freeze({ key: 'z-i50', p: [0, 0, 1], axis: null, inc: 50, e: 0.1 }),
  Object.freeze({ key: 'tilt35-i45', p: null, axis: Object.freeze({ tiltDeg: 35, azimuthDeg: 120 }), inc: 45, e: 0.2 })]);
export const TEST_J2 = Object.freeze({ J2: 0.01, req: 0.1, a: 1, orbits: 400 });
export async function stageAnalytic(HP, log) {
  const t0 = Date.now(), rows = [];
  for (const c of CASES) {
    const p = c.p || HP.coord3d.axisUnit(c.axis.tiltDeg, c.axis.azimuthDeg);
    for (const integ of ['semi', 'leapfrog']) for (const spo of [1000, 2000]) {
      const base = { a: TEST_J2.a, e: c.e, inc: c.inc, Om: 20, w: 40, mp: 1e-6, orbits: TEST_J2.orbits, spo, integ, p };
      const j2 = { J2: TEST_J2.J2, req: TEST_J2.req }; if (c.axis) j2.axis = clone(c.axis);
      const on = runTest(HP, Object.assign({}, base, { j2 })), off = runTest(HP, base);
      const n = Math.sqrt((1 + 1e-6) / on.a ** 3), an = HP.j2SecularRates(n, TEST_J2.J2, TEST_J2.req, on.a, on.e, on.inc);
      const row = { key: c.key, integ, spo, inc: c.inc, e: c.e, axis: c.axis || 'z', meanA: on.a, meanE: on.e, meanIncDeg: on.inc * 180 / Math.PI,
        nodeJ2: on.node - off.node, periJ2: on.peri - off.peri, nodeAn: an.node, periAn: an.peri, offNode: off.node, offPeri: off.peri };
      row.nodeRel = row.nodeJ2 / an.node - 1; row.periRel = row.periJ2 / an.peri - 1;
      row.pass = Math.abs(row.nodeRel) <= ANALYTIC_TOL && Math.abs(row.periRel) <= ANALYTIC_TOL;
      rows.push(row);
      log(`analytic ${c.key} ${integ} ${spo}: Ω̇ ${row.nodeRel.toExponential(2)}・ω̇ ${row.periRel.toExponential(2)}(J₂ なしの ω̇ / 解析 ${(off.peri / an.peri).toExponential(2)})`);
    }
  }
  return { note: '試験粒子(質量比 1e-6・中心 pinned)・J₂ 0.01・R 0.1・a 1(J₂(R/a)² = 1e-4)・400 公転・接触要素 25 步ごと。J₂ の分 = J₂ あり − J₂ なし(同じ刻み —— 積分器の近点の偽の回転を引く)。解析は一次の永年の式に走行の平均の a・e・i を入れた',
    J2: TEST_J2, tol: ANALYTIC_TOL, rows, ok: rows.every((r) => r.pass), maxRel: Math.max(...rows.map((r) => Math.max(Math.abs(r.nodeRel), Math.abs(r.periRel)))), wallSec: (Date.now() - t0) / 1000 };
}

/* ── 段 em ── */
const winSum = (w) => w && w.complete ? { N: w.N, T1: w.T1, T4p: w.T4p, sidH: w.sidH, anom: w.anom, node: w.node, eMean: w.eMean, incMean: w.incMean, aMean: w.aMean, nPeri: w.nPeri } : { N: w ? w.N : null, complete: false };
function engRun(HP, preset, N, dt, log, key) {
  const t0 = Date.now(), R = EM.runEngine(HP, preset, { dt, revMax: N });
  if (!R.complete || R.nan) throw new Error(`走行が窓を満たさない(${key}: stop=${R.stop}・公転 ${R.ev.rev.length}/${N})`);
  R.wallSec = (Date.now() - t0) / 1000;
  if (log) log(`${key}: ${N} 公転・dt ${dt}・${R.steps} 步・${R.wallSec.toFixed(1)} s`);
  return R;
}
/** 解析の見積り(実測と分けて): 地球の J₂ の月の交点・近地点への一次の永年の効き(黄道の交点で平均 —— 太陽の歳差が速いので黄道の Ω で平均した ⟨cos² I_eq⟩)。
 *  dΩ/dt = −(3/4) n J₂ (R/a)² cos i (2cos²ε − sin²ε)/(1−e²)²・dϖ/dt = dΩ/dt + dω/dt(dω/dt = (3/4) n J₂ (R/a)² (5⟨cos² I⟩ − 1)/(1−e²)² の黄道版は
 *  (3/8) n J₂ (R/a)² [(3cos²ε − 1)(5cos²i − 1) ...] —— ここでは交点だけを解析の見積りにし、近地点は実測の差で書く) */
export function nodeJ2Estimate(o) {
  const ce = Math.cos(o.eps), se = Math.sin(o.eps), f = o.n * o.J2 * (o.R / o.a) ** 2 / (1 - o.e * o.e) ** 2;
  const rate = -0.75 * f * Math.cos(o.inc) * (2 * ce * ce - se * se);   // rad/時間(負 = 後退を速める)
  return { rate, note: 'dΩ/dt = −(3/4) n J₂ (R/a)² cos i (2cos²ε − sin²ε)/(1−e²)²(⟨cos² I_eq⟩ = cos²i cos²ε + ½ sin²i sin²ε を黄道の Ω で平均した一次の永年の項)' };
}
export async function stageEm(HP, log) {
  const t0 = Date.now(), off = copyOf(HP, FIT_ID, { j2: null }), on = copyOf(HP, FIT_ID, { j2: EARTH_J2 });
  const onAz0 = copyOf(HP, FIT_ID, { j2: Object.assign(clone(EARTH_J2), { axis: { tiltDeg: EARTH_J2.axis.tiltDeg, azimuthDeg: 0 } }) });
  const Roff = engRun(HP, off, LONG, DT, log, 'off-h'), Ron = engRun(HP, on, LONG, DT, log, 'j2-h'), Ron2 = engRun(HP, on, LONG, DT2, log, 'j2-h2');
  const Raz = engRun(HP, onAz0, LONG, DT, log, 'j2-az0-h');
  const Roff2 = engRun(HP, off, LONG, DT2, log, 'off-h2');
  // 引きずり ON の対照(本の abBody の W_bg —— 第303便a の 3.85583・物理の量と読まない)に J₂ を足した写し(abBody の表示の数の照合)
  const dragOn = clone(on); dragOn.physics = Object.assign(clone(on.physics), clone(findPreset(HP, FIT_ID).abBody.physicsPatch));
  const Rdrag = engRun(HP, dragOn, LONG, DT, log, 'j2-dragOn-h');
  const fz = (R) => EM.windowsOf(R.ev, WINS, 0).fromZero.map(winSum);
  const W = { off: fz(Roff), off2: fz(Roff2), on: fz(Ron), on2: fz(Ron2), az0: fz(Raz), dragOn: fz(Rdrag) };
  // 器の中の参照積分(アプリの物理ではない —— 同じ ε・同じ初期配置・J₂ の項は EM.refRun〔極は黄経 90° 側〕)
  const eps = on.physics.softening;
  const ref = EM.refRun({ bodies: on.bodies, revMax: LONG, eps, J2: { J2: EARTH_J2.J2, R: EARTH_J2.req, obliquityDeg: EARTH_J2.axis.tiltDeg } });
  const ref0 = EM.refRun({ bodies: off.bodies, revMax: LONG, eps });
  W.ref = EM.windowsOf(ref.ev, WINS, 0).fromZero.map(winSum); W.ref0 = EM.windowsOf(ref0.ev, WINS, 0).fromZero.map(winSum);
  const L4 = (k) => W[k][W[k].length - 1];
  const g = { T4p: Math.abs(L4('ref').T4p / L4('on').T4p - 1), sidH: Math.abs(L4('ref').sidH / L4('on').sidH - 1), node: Math.abs(L4('ref').node / L4('on').node - 1), lim: { T4p: 1e-4, sidH: 1e-6, node: 1e-4 } };
  g.ok = g.T4p <= g.lim.T4p && g.sidH <= g.lim.sidH && g.node <= g.lim.node;
  // 差と許容(長窓)
  const B = OBS_B1, o = L4('on'), o2 = L4('on2'), f = L4('off'), f2 = L4('off2');
  const tgt = (k, obs, tol, h2k) => ({ model: o[k], residual: o[k] - obs, h2: Math.abs(o[k] - o2[k]), offModel: f[k], offResidual: f[k] - obs, offH2: Math.abs(f[k] - f2[k]),
    j2Effect: o[k] - f[k], refJ2Effect: L4('ref')[k] - L4('ref0')[k], az0Diff: L4('az0')[k] - o[k], tol, ratio: Math.abs(o[k] - obs) / tol, offRatio: Math.abs(f[k] - obs) / tol,
    gate: Math.abs(o[k] - obs) + Math.abs(o[k] - o2[k]) <= tol, offGate: Math.abs(f[k] - obs) + Math.abs(f[k] - f2[k]) <= tol });
  const diff = { aps: tgt('T4p', B.aps.value, TOL.aps), sid: tgt('sidH', B.sid.value, TOL.sid), node: tgt('node', B.node.value, TOL.node), anom: tgt('anom', B.anom.value, Infinity),
    e: tgt('eMean', 0.0549, TOL.e) };
  // 解析の見積り(交点)
  const G = on.physics.G, mt = on.bodies[1].m + on.bodies[2].m, a = o.aMean, n = Math.sqrt(G * mt / a ** 3);
  const est = nodeJ2Estimate({ n, J2: EARTH_J2.J2, R: EARTH_J2.req, a, e: o.eMean, inc: o.incMean * Math.PI / 180, eps: EARTH_J2.axis.tiltDeg * Math.PI / 180 });
  const node0 = 2 * Math.PI / f.node / YEAR;   // 交点の後退の率 [rad/本の時間](正)
  const estDT = 2 * Math.PI / (node0 - est.rate) / YEAR - f.node;
  const out = { note: '🌦️ の写し: J₂ なし(本の宣言から j2 を外した写し)と J₂ あり(地球に EARTH_J2)・長窓 [0,1062] の M4・恒星月(調和)・交点・近点月。参照積分は器の中の速度 Verlet(EM.refRun)',
    earthJ2: EARTH_J2, source: EARTH_J2_SOURCE, windows: W, refGate: g, diff,
    analytic: { nodeRate: est.rate, nodePeriodShift: estDT, measuredShift: diff.node.j2Effect, a, e: o.eMean, incDeg: o.incMean, note: est.note },
    within: { node: diff.node.gate, aps: diff.aps.gate, sid: diff.sid.gate, e: diff.e.gate }, steps: { off: Roff.steps, on: Ron.steps, on2: Ron2.steps },
    dragOn: { Wbg: dragOn.physics.relativeDrag.Wbg, T4p: L4('dragOn').T4p, residual: L4('dragOn').T4p - B.aps.value, ratio: Math.abs(L4('dragOn').T4p - B.aps.value) / TOL.aps, drag: Rdrag.drag },
    wallSec: (Date.now() - t0) / 1000 };
  out.allWithin = out.within.node && out.within.aps && out.within.sid && out.within.e;
  log(`em: 交点 ${f.node.toFixed(5)} → ${o.node.toFixed(5)}(J₂ の分 ${diff.node.j2Effect.toExponential(3)}・解析 ${estDT.toExponential(3)})・M4 ${f.T4p.toFixed(6)} → ${o.T4p.toFixed(6)}・恒星月 ${f.sidH.toFixed(7)} → ${o.sidH.toFixed(7)}・許容の内 ${JSON.stringify(out.within)}`);
  return out;
}

/* ── 段 emo(🌔)── */
export async function stageEmo(HP, log) {
  const t0 = Date.now(), src = findPreset(HP, FIT_ID), ctrl = findPreset(HP, EMO_ID), chk = emDeclCheck(src, ctrl);
  const srcJ = copyOf(HP, FIT_ID, { j2: EARTH_J2 }), ctrlJ = clone(ctrl); ctrlJ.bodies = emOnlyBodies(srcJ.bodies); ctrlJ.physics = emOnlyPhysics(srcJ.physics);
  const ctrl0 = clone(ctrl); ctrl0.bodies = withJ2(ctrl.bodies, 0, null);
  const go = (key, p, dt, N, wins) => { const t = Date.now(), R = runEm3(HP, clone(p), { dt, revMax: N, ci: 0, oi: 1, com: true });
    if (!R.complete || R.nan) throw new Error(`🌔 の走行が窓を満たさない(${key})`);
    const W = emWindowsOf(R, wins, HP).map((w) => ({ N: w.N, T1: w.T1, sid: w.sid, synUniform: w.synUniform, eOsc: w.eOsc, incMean: w.incMean, nPeri: w.nPeri }));
    log(`emo: ${key} 恒星月 ${W[0].sid}・近点 ${W[0].T1} 年`); return { key, dt, steps: R.steps, com: R.com, windows: W, wallSec: (Date.now() - t) / 1000 }; };
  const j = go('j2-h', ctrlJ, DT, 354, [118, 354]), j2 = go('j2-h2', ctrlJ, DT2, 118, [118]), z = go('noJ2-h', ctrl0, DT, 354, [118, 354]);
  // 解析の見積り(地球の J₂ だけの二体 —— 月の軌道面は地球の極のまわりを傾き I で回る。近地点の経度は ϖ̇ ≈ Ω̇ + ω̇)
  const declSame = same(ctrl.bodies, ctrlJ.bodies) && same(ctrl.physics, ctrlJ.physics);
  return { note: '🌔 = J₂ ありの 🌦️ の写しの規則(emOnlyBodies・emOnlyPhysics)—— 引きずり OFF の地球と月の二体(重力と地球の J₂)。J₂ なしは同じ宣言から j2 を外した写し', declCheck: chk,
    declSameAsRule: declSame, runs: { j2: j, j2h2: j2, noJ2: z },
    j2Effect: { sid: j.windows[0].sid - z.windows[0].sid, synUniform: j.windows[0].synUniform - z.windows[0].synUniform, incMean: j.windows[0].incMean - z.windows[0].incMean },
    h2Diff: { sid: Math.abs(j.windows[0].sid - j2.windows[0].sid), synUniform: Math.abs(j.windows[0].synUniform - j2.windows[0].synUniform) },
    t1Note: '近点の 118 公転窓の傾きは数値の誤差か J₂ の遅い回転(解析で 10⁵ 年の桁)で、118 窓では周期として読めない —— 観測カードへ転記しない(第305便c の契約)', wallSec: (Date.now() - t0) / 1000 };
}

/* ── 段 record ── */
export const EXTRACTOR = Object.freeze({
  aps: 'tests/exp-w303c-earthmoon.mjs harmonicRate(w303c-emx4-1)—— M4 調和の回帰: 距離の極小の 3 点放物線・瞬間の軌道面で ϖ・ϖ の時刻への直線に φ = 2(λ☉ − ϖ̄) の 1〜3 倍の正弦・余弦',
  sid: 'tests/exp-w303c-earthmoon.mjs sidHarmonic(w303c-emx4-1)—— 黄道経度の通過の時刻を周回の番号の直線と中心差・出差・二均差・黄道への還元の正弦・余弦で回帰',
  e: 'tests/exp-w303c-earthmoon.mjs makeRec(w303c-emx4-1)—— 位置の中心差分の座標速度から作る接触離心率・64 步ごとの時間平均',
  node: 'tests/exp-w303c-earthmoon.mjs winOf(w303c-emx4-1)—— 接触の昇交点の経度 Ω(xy 面 = 黄道に対する)の時刻への直線(64 步ごと)の後退の周期',
  cond: 'tests/exp-w303c-earthmoon.mjs winOf(w303c-emx4-1)・長窓 [0,1062]' });
export const WINDOW_LONG = '1062 公転の窓 [0,1062](約 79.4 年 —— 近点の約 9 周・交点の約 4.3 周)・引きずり OFF・地球の J₂・semic';
export const EMS_NOTE_305C = '地球の J₂(第305便c —— 交点を標的に足した。J₂ を入れて残る差の帰属は追加の測定の後)';
export function recordOf(HP, E, prev) {
  const D = E.diff, h2 = (k) => D[k].h2;
  const tg = (q, obs, unit, source, tol, extractor, model) => {
    const residual = model.model - obs;
    return { q, obs, unit, source, window: WINDOW_LONG, tol, extractor, model: model.model, residual, rel: residual / obs, numerics: { h2: model.h2, dtHalf: DT2 } };
  };
  const pt = prev.targets;
  const targets = [
    Object.assign(tg(pt[0].q, pt[0].obs, pt[0].unit, pt[0].source, pt[0].tol, EXTRACTOR.aps, D.aps)),
    Object.assign(tg(pt[1].q, pt[1].obs, pt[1].unit, pt[1].source, pt[1].tol, EXTRACTOR.sid, D.sid)),
    Object.assign(tg(pt[2].q, pt[2].obs, pt[2].unit, pt[2].source, pt[2].tol, EXTRACTOR.e, D.e)),
    tg('交点の周期(黄道に対する昇交点 Ω の後退・長窓)', 18.6, 'yr', '月の交点の周期 18.600 年(JPL SSD の行 SOL-59edf981 の注記 P node —— σ なし)。B1 18.599525 年(Chapront 2002・Simon 1994 —— σ なし・unverified)との差は正本に記録',
      { value: TOL.node, kind: 'declared', note: '照合許容の宣言 0.005 年 —— 18.600 年は表記の末位の 5 倍(σ なし)。B1 18.599525 年はこの幅の中' }, EXTRACTOR.node, D.node)];
  const rec = clone(prev);
  rec.law = '引きずり OFF(relativeDrag.enabled:false —— 第304便c の基線の見直しで埋める差が照合許容の内で 0)・重力 E4 の三体(太陽 pinned)・地球の J₂(bodies[1].j2 —— 第305便c)・三次元(physics.coord:"3d")・λ_PN=0・積分器 semic';
  rec.targets = targets;
  rec.fixed = prev.fixed.slice(0, 3).concat([
    '地球の J₂ = 1.08263×10⁻³・赤道半径 0.06378137(6378137 m —— GRS80 の定義定数)・図形の軸は黄道に対して 23.4392911°(IERS 2010 の J2000 の平均の黄道傾斜)で方位 90°(極は黄経 90° 側 = 本の +x を春分点とみなした置き方・元期の宣言なし)の固定の軸(bodies[1].j2.axis —— 地球の自転軸の宣言 spinAxis は有効化しない)。反作用は地球へ(太陽は pinned)',
    prev.fixed[3], prev.fixed[4],
    '第304便c の宣言(J₂ なし —— 長窓 M4 8.84983 年・交点 18.6052 年・cond.sig ' + prev.cond.sig + ')は履歴 —— 前後表は PHYSICS〔第305便c〕と正本 tests/out/j2-w305c.json']);
  rec.procedure = '第305便c: 第304便c の宣言(初期配置・軟化・e′・引きずり OFF)に地球の J₂(bodies[1].j2)だけを足し、h / h/2 と窓 118・354・708・1062 で測り直した(初期配置は解き直していない —— 器 tests/exp-w305c-j2.mjs)。' + prev.procedure;
  rec.steps = E.steps.on;
  rec.notFitted = ['近点回転の周期と交点の周期は合わせていない —— 引きずり OFF の純ニュートンの三体と地球の J₂ の値(ノブは初期配置の 3 つだけ・予言ではなく基線の確かめ)',
    '恒星月・平均離心率・平均傾斜は初期配置の入力として長窓の平均に合わせた(第304便c —— J₂ を足した後も解き直していない・法則の予言として数えない)',
    prev.notFitted[2], EMS_NOTE_305C, '機構(主因は太陽摂動 —— 機構の同定ではない)'];
  rec.cond = { version: HP.FIT_COND_VERSION || 'w297b-cond-1', sig: '0000000000000000', extractor: EXTRACTOR.cond };
  return rec;
}
export async function stageRecord(HP, J, prevRec) {
  const p = findPreset(HP, FIT_ID), rec = recordOf(HP, J.em, prevRec);
  const want = copyOf(HP, FIT_ID, { j2: EARTH_J2 }); want.fitRecord = rec;
  rec.cond.sig = HP.fitCondSig(HP.validatePreset(clone(want)).preset, rec);
  const vr = HP.validateFitRecord(clone(rec)), vp = HP.validatePreset(clone(want));
  let condState = null;
  const vLive = HP.validatePreset(clone(p));
  if (vLive.ok && vLive.preset.fitRecord) { HP.sim.build(vLive.preset); condState = HP.fitCondStateOf(HP.fitCondInputsOf(vLive.preset, HP.sim.params), vLive.preset.fitRecord).state; }
  const gates = HP.fitTargetGates ? HP.fitTargetGates(rec) : rec.targets.map((t) => ({ pass: Math.abs(t.residual) + t.numerics.h2 <= t.tol.value }));
  return { record: rec, accepted: !!vr.ok, acceptErr: vr.ok ? null : vr.err, presetOk: vp.ok && (vp.warnings || []).length === 0, presetWarnings: vp.warnings || [],
    liveSame: same(p.fitRecord, rec) && same(p.bodies, want.bodies), liveHasJ2: !!(p.bodies[1] && p.bodies[1].j2), condState, targetGates: gates };
}

/* ── 本体 ── */
export const PARTS_ALL = Object.freeze(['unit', 'analytic', 'em', 'emo', 'record']);
export function gatesOf(J) {
  const g = {};
  if (J.unit) { g.zero = J.unit.zero.every((z) => z.same); g.axis = J.unit.axis.every((z) => z.same); g.conserve = J.unit.conserve.ok === true; g.accept = J.unit.accept.ok === true; }
  if (J.analytic) g.analytic = J.analytic.ok === true;
  if (J.em) { g.refEngine = J.em.refGate.ok === true; g.emWithin = J.em.allWithin === true; }
  if (J.emo) g.emoDecl = J.emo.declCheck.ok === true;
  if (J.record) { g.recordAccepted = J.record.accepted === true && J.record.presetOk === true; g.recordFitted = J.record.record.status === 'fitted' && J.record.targetGates.every((t) => t.pass);
    g.recordLive = J.record.liveSame === true && J.record.condState === 'match'; }
  return g;
}
export async function main() {
  const OUT = process.env.W305C_OUT || path.join(ROOT, 'tests', 'out', 'j2-w305c.json');
  const PARTS = String(process.env.W305C_PARTS || PARTS_ALL.join(',')).split(',').filter((x) => PARTS_ALL.includes(x));
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const t0 = Date.now();
  const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
  pinDecl315c();   // 第315便c(AN406): 在位の 7 本の宣言を移行の前の写しへ(本ごとの門 —— 基点の html では no-op・正本の欄は足さない)
  if (typeof HP.j2State !== 'function') throw new Error('対象の html に三次元の J₂(第305便c)が無い');
  // 第306便c(R206): 🌦️🌔 の初期配置を J₂ ありで解き直した世代では、この器は第305便の宣言の写し(tests/lib-w306c-pre.mjs の pin305)で測る(歴史の値を保つ ——
  //   第305便の html では no-op)。器の中の BUILTIN_PRESETS だけを書き換える(html と署名の宣言は変えない)
  const { pinDecl305, DECL305_DATA_FILE } = await import('./lib-w306c-pre.mjs');
  const PIN305 = pinDecl305();
  const prev = (PARTS.length < PARTS_ALL.length && fs.existsSync(OUT)) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : {};
  const log = (s) => console.log('  ' + s);
  const { DECL304, DECL304_DATA_FILE, LIB_VERSION: PRE_VERSION } = await import('./lib-w305c-pre.mjs');
  const J = { meta: null, version: HARNESS_VERSION, preVersion: PRE_VERSION, earthJ2: EARTH_J2, earthJ2Source: EARTH_J2_SOURCE, tol: TOL, obs: OBS_B1,
    decl304: { sig: DECL304[FIT_ID].fitRecord.cond.sig } };
  const stages = { unit: () => stageUnit(HP, log), analytic: () => stageAnalytic(HP, log), em: () => stageEm(HP, log), emo: () => stageEmo(HP, log),
    record: () => stageRecord(HP, J, DECL304[FIT_ID].fitRecord) };
  if (PIN305.pinned) J.decl305Pin = { changed: PIN305.changed, note: '第306便c: 🌦️🌔 の宣言(初期配置・fitRecord)が第305便から動いた世代 —— この器は第305便の宣言の写し(tests/lib-w306c-pre.mjs の pin305)で測った' };
  J.partsRun = [];
  for (const k of PARTS_ALL) {
    if (PARTS.includes(k)) { console.log(`段 ${k}`); J[k] = await stages[k](); J.partsRun.push(k); }
    else if (prev[k]) J[k] = prev[k];
  }
  J.gates = gatesOf(J);
  J.ok = Object.values(J.gates).every(Boolean) && PARTS_ALL.every((k) => !!J[k]);
  J.notClaim = ['「月を再現した」', '「交点を再現した」', '「現実を再現した」'];   // 書かない語(引用 —— 本文には書かない)
  const CODE = ['tests/exp-w305c-j2.mjs', 'tests/lib-w315c-legacy7.mjs', 'tests/lib-w305c-pre.mjs', 'tests/lib-w306c-pre.mjs', 'tests/exp-w303c-earthmoon.mjs', 'tests/exp-w300b-emonly.mjs', 'tests/lib-w297b-fit.mjs', 'tests/lib-w296b-fit.mjs',
    'tests/lib-w292c-dragcore.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  J.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第305便c', target: TARGET, code: CODE, inputs: [TARGET, LEGACY7_DATA_FILE, DECL304_DATA_FILE, DECL305_DATA_FILE] }), {
    harnessVersion: HARNESS_VERSION, loadErrors: errors.length,
    ruling: 'DECISIONS v63 AN327 ③⑤・v64 §0 AN327(交点は J₂ —— 全残差の帰属は追加の測定の後)', reading: '統括の検証項目 R201(三次元の J₂ と 🌦️ の交点・🌔 のヘルプと T1 の転記の契約)' });
  J.elapsedS = (Date.now() - t0) / 1000;
  Object.assign(J.meta, W281A_SCOPE, w281aStableInputs(ROOT, J.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(J, null, 1) + '\n');
  console.log(`門: ${JSON.stringify(J.gates)} → ${path.relative(ROOT, OUT)}(${J.elapsedS.toFixed(0)} s)`);
}
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) await main();

/* ── 表の行(PHYSICS〔第305便c〕—— QA docs.j2_305 が正本から作り直して逐語で照合する)── */
const F = L.fx, EX = L.ex, sg = (x, d) => (x >= 0 ? '+' : '') + F(x, d);
/** 表 1: 解析の歳差との一致(試験粒子) */
export function analyticRows(J) {
  return J.analytic.rows.map((r) => `| ${r.key} | ${r.integ} | ${r.spo} | ${EX(r.nodeAn, 4)} | ${sg(r.nodeRel * 1e4, 2)} | ${EX(r.periAn, 4)} | ${sg(r.periRel * 1e4, 2)} |`);
}
/** 表 2: 🌦️ の長窓(J₂ なし/あり・h/2・方位 0°・参照積分) */
export function emRows(J) {
  const W = J.em.windows, last = (k) => W[k][W[k].length - 1];
  const r = (label, w) => `| ${label} | ${F(w.T4p, 5)} | ${F(w.sidH, 7)} | ${F(w.node, 4)} | ${F(w.anom, 7)} | ${F(w.eMean, 6)} | ${F(w.incMean, 4)} |`;
  return [r('J₂ なし(第304便c の宣言・h)', last('off')), r('J₂ なし(h/2)', last('off2')), r('J₂ あり(h)', last('on')), r('J₂ あり(h/2)', last('on2')),
    r('J₂ あり・軸の方位 0°(感度・h)', last('az0')), r('参照積分(J₂ あり・器の中)', last('ref'))];
}
/** 表 3: B1 との差と照合許容(J₂ あり/なし) */
export function diffRows(J) {
  const D = J.em.diff, B = J.obs, se = (x) => (x >= 0 ? '+' : '') + EX(x, 1);
  const row = (label, x, d, tol) => { const f = d === null ? se : (v) => sg(v, d);
    return `| ${label} | ${f(x.offResidual)} | ${tol ? F(x.offRatio, 2) : '—'} | ${f(x.residual)} | ${tol ? F(x.ratio, 2) : '—'} | ${f(x.j2Effect)} | ${EX(x.h2, 1)} |`; };
  return [row(`近点の周期 M4 − B1 ${F(B.aps.value, 6)} [年]`, D.aps, 5, true), row(`恒星月 − B1 ${F(B.sid.value, 9)} [日]`, D.sid, 7, true),
    row(`交点の周期 − B1 ${F(B.node.value, 6)} [年]`, D.node, 4, true), row('平均離心率 − 0.0549', D.e, null, true), row(`近点月 − B1 ${F(B.anom.value, 9)} [日]`, D.anom, 7, false)];
}
/** 表 4: 🌔(J₂ ありの写し) */
export function emoRows(J) {
  const E = J.emo, j = E.runs.j2.windows, z = E.runs.noJ2.windows[0], h2 = E.runs.j2h2.windows[0];
  const r = (label, w) => `| ${label} | ${F(w.sid, 6)} | ${F(w.synUniform, 6)} | ${F(w.eOsc, 6)} | ${F(w.incMean, 4)} |`;
  return [r('[0, 118] J₂ あり(h)', j[0]), r('[0, 354] J₂ あり(h)', j[1]), r('[0, 118] J₂ あり(h/2)', h2), r('[0, 118] J₂ なし(h)', z)];
}
