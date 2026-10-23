// 第314便d(原仮定者の裁定(第116報)の補足「太陽系の各天体の検証が完了したら、太陽と全惑星とトリトン以上の 7 大衛星を 1 つにまとめた三次元サンプルを用意する。
// 対照として geoPN=1 と geoPN=3 の両方を用意する」の前提・統括の検証項目 R241): **三次元の geoPN=1(EIH の 1PN の 3 成分)の器**。
//
// Node だけ(対象 html の inline script を tests/lib-w279b-headless.mjs の loadHtmlHeadless で読み、html の validatePreset・coord3d.makeSim・build・step と
// 読み口 HP.coord3d.pn1(delta = dfmPN1Delta3・test = dfmPN1Test3・state)をそのまま呼ぶ)。写しは器の中で組む(**在位の本の宣言は変えない** ——
// 三次元で geoPN=1 を宣言する在位の本は作らない)。16 体の写しは tests/lib-w300c-solar16.mjs の人工の入力(syntheticRecord —— 観測の入力ではない)。
//
// ■ 段
//   A(受理の表): 三次元の geoPN=1 は通る・geoPN=2 は拒否・一緒に宣言できない組(kFrame>0・geodesic:true・approxMany・試験粒子)と一緒にできる組
//     (λ_PN の係数・pnAlpha・pinned・leapfrog・Float32 の状態・慣性決定力・明示潮汐・pnSource:false)・走行中の門(geoPN を 0→1→2→1 と編集)。
//   P(平面の写し): ☄️ mercuryReal の宣言の太陽–水星(z = vz = 0)を二次元の本と三次元の本で geoPN=1・0 × h・h/2 × 太陽 固定(宣言のまま)/自由 × semi、
//     と自由 × leapfrog(h)—— 8 公転の近点の率(λ_PN の有無の差)・周期・離心率と、二次元との状態のビットの比較(零試験)。
//     Δ₃ と二次元の Δ を同じ平面の状態で比べる(ビット)・1PN の解析 q_1PN(AN336 の式 6πG(M+m)/(c²a(1−e²)) —— ″/世紀は初期の接触要素のケプラー周期で換算)。
//   R(回転の共変): 同じ軌道(自由な太陽)を任意の向き 3 通りへ回した三次元の本(geoPN=1・0 × h)—— 近点の率・周期・離心率の相対の差と軌道面の法線のずれ。
//   N(N 体の小さな写し): 太陽・木星・土星(人工の円軌道 —— 平面の写しと傾けた写し)を二次元・三次元(平面)・三次元(傾き)で geoPN=1・0 × leapfrog × 木星 2 公転 ——
//     1PN の有無の差・Σm·v と EIH の 1PN の運動量(Σ∂L/∂v —— lib-w285b-gr1pn の ppnMomenta の 3 成分版)の収支。
//   X(16 体の写し): MEMBERS の人工の配置で geoPN=1・三次元の受理・20 步の有限・源 16(詰め替え版 Δ₃ と素の Δ₃ のビット同一)・独立に書いた EIH の 3 成分(参照の式)との照合・
//     加速度の回転の共変・所要(步あたり)を geoPN=0 と geoPN=3(K1 + rdRule:"kappaM")と並べる。
//
// ■ 言わないこと: 「法則を確かめた」「較正した」「収束した」(h と h/2 は 2 段の感度診断)「完全に一致」「検証が完了した」(太陽系について)。
//   **DFM から導出した項ではない**(kF0 対照 —— 標準理論の 1PN と照合する物差し)。16 体の写しは人工の入力で、太陽系の配置の値ではない。
//
// ■ 使い方
//   node tests/exp-w314d-pn1x3d.mjs   → 正本 tests/out/pn1x3d-w314d.json(段 pn1x3d-314d)
//   W314D_OUT=<json> で出力先を変える(試走は正本を書かない)・W314D_TARGET=<html>(既定 beta/index.html)・W314D_QUICK=1(公転 2・N 体 1/4・16 体の所要 20 步 —— 煙試験の窓)・
//   W314D_STAGES=A,P,R,N,X(走らせる段 —— 既定は全部)。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlHeadless } from './lib-w279b-headless.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import { fmtFloor } from './lib-w311c-h4carry.mjs';
import * as S16 from './lib-w300c-solar16.mjs';
// 第281便a の領域 hash の宣言(器と lib から deriveScope で引いた下限 —— 器の本は .find で引く)
const REGEN_SCOPE = {"presets":"all","roots":["$","COORD3D_PN1_VERSION","COORD3D_VERSION","DT","HP.allPresets","HP.coord3d","HP.validatePreset","PN1_EIH_VERSION","RAY_ALPHA_MIN","T","coordSwitchPlanOf","ctx","dfmPN1Delta"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w314d-pn1x3d-1';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (o) => JSON.parse(JSON.stringify(o));
const E = (H, name) => H.evalExpr(name);
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a) => Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
const relD = (a, b) => (a === b) ? 0 : Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b));
const D2R = Math.PI / 180, ARCSEC = 180 * 3600 / Math.PI;
const pow10 = (k) => { let v = 1; for (let i = 0; i < Math.abs(k); i++) v *= 10; return k < 0 ? 1 / v : v; };
export const NOT_CLAIM = ['法則を確かめた', '較正した', '収束した', '完全に一致', '検証が完了した(太陽系について)', 'DFM から導出した'];
export const MER_ID = 'mercuryReal';
/** 回転の向き 3 通り(z-x-z の Euler 角 [Ω, i, ω] °—— 任意に選んだ値) */
export const ROTS = Object.freeze([[40, 30, 50], [200, 73, -15], [10, 120, 260]]);
export const ORBITS = 8, ORBITS_QUICK = 2;
/** N 体の写し(人工の円軌道 —— 本の単位 1 = 10⁸ m / 10⁴ s / 10²⁷ kg。半径・質量は丸めた値・傾きと昇交点は黄道に対する目安)。phase は軌道面の中の角 ° */
export const NB = Object.freeze([
  { key: 'jupiter', ja: '木星', m: 1.898, radius: 0.69911, a: 7784.8, incl: 1.303, node: 100.46, phase: 0 },
  { key: 'saturn', ja: '土星', m: 0.5683, radius: 0.58232, a: 14335, incl: 2.485, node: 113.66, phase: 120 }]);
export const NB_STEPS_PER_ORBIT = 1000, NB_ORBITS = 2;
export const X_STEPS = 20, X_TIME_STEPS = 200;
/** K1 + 規則の宣言(geoPN=3 の対照 —— 外殻を宣言しない〔DECISIONS v73〕・観測の初期値の分解) */
export const K1_DRAG = Object.freeze({ law: 'inertial', invSq: Object.freeze({ kernel: 'k1', rdRule: 'kappaM' }), pairs: 'all', history: 'positions', initMotion: 'observed',
  spinDrag: Object.freeze({ rot: 'surfaceFlip', axial: 'on', axialModel: 'bevel', initSpin: 'observed' }) });

/* ───────── 回転 ───────── */
export function rotOf(Om, inc, w) {
  const a = Om * D2R, b = inc * D2R, c = w * D2R, ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b), cc = Math.cos(c), sc = Math.sin(c);
  // R = Rz(Ω)·Rx(i)·Rz(ω)
  return [[ca * cc - sa * cb * sc, -ca * sc - sa * cb * cc, sa * sb], [sa * cc + ca * cb * sc, -sa * sc + ca * cb * cc, -ca * sb], [sb * sc, sb * cc, cb]];
}
const mv = (R, v) => [R[0][0] * v[0] + R[0][1] * v[1] + R[0][2] * v[2], R[1][0] * v[0] + R[1][1] * v[1] + R[1][2] * v[2], R[2][0] * v[0] + R[2][1] * v[1] + R[2][2] * v[2]];
const mtv = (R, v) => [R[0][0] * v[0] + R[1][0] * v[1] + R[2][0] * v[2], R[0][1] * v[0] + R[1][1] * v[1] + R[2][1] * v[2], R[0][2] * v[0] + R[1][2] * v[1] + R[2][2] * v[2]];

/* ───────── 写し ───────── */
/** ☄️ の宣言の太陽–水星。o = {coord3d, geoPN, free, integrator, rot:[Ω,i,ω], f(q)} */
export function merCopy(HP, o = {}) {
  const p = HP.allPresets().find((q) => q.id === MER_ID);
  if (!p) throw new Error('本が無い: ' + MER_ID);
  const q = clone(p);
  q.id = 'w314dMercuryCopy'; delete q.abBody; delete q.fitRecord;
  q.physics.geoPN = (o.geoPN === undefined) ? 1 : o.geoPN;
  if (o.coord3d) q.physics.coord = '3d'; else delete q.physics.coord;
  if (o.free) q.bodies[0].pinned = false;
  if (o.integrator) q.integrator = o.integrator;
  if (o.rot) { const R = rotOf(...o.rot);
    for (const b of q.bodies) { const r = mv(R, [b.x, b.y, b.z || 0]), v = mv(R, [b.vx, b.vy, b.vz || 0]); b.x = r[0]; b.y = r[1]; b.z = r[2]; b.vx = v[0]; b.vy = v[1]; b.vz = v[2]; } }
  if (o.f) o.f(q);
  return q;
}
export function simOf(HP, q) {
  const v = HP.validatePreset(clone(q));
  if (!v.ok) throw new Error('受理されない: ' + (v.errors || []).join(' ').slice(0, 200));
  const S = HP.coord3d.makeSim(); S.build(clone(v.preset));
  return S;
}
/** 二体の初期の接触要素と 1PN の式(AN336 —— tests/exp-w303b-inertialr2.mjs の pn1Formula と同じ式・μ は G(M+m) か GM) */
export function pn1FormulaOf(q, muKind) {
  const B = q.bodies, G = q.physics.G, c = q.physics.cLight, mu = G * ((muKind === 'M') ? B[0].m : (B[0].m + B[1].m));
  const rv = [B[1].x - B[0].x, B[1].y - B[0].y, (B[1].z || 0) - (B[0].z || 0)], vv = [B[1].vx - B[0].vx, B[1].vy - B[0].vy, (B[1].vz || 0) - (B[0].vz || 0)];
  const r = norm(rv), v2 = dot(vv, vv), a = 1 / (2 / r - v2 / mu), L = cross(rv, vv), h2 = dot(L, L);
  const e = Math.sqrt(Math.max(0, 1 - h2 / (mu * a))), P = 2 * Math.PI * Math.sqrt(a * a * a / mu);
  const century = 36525 * 86400 / pow10(q.scaleExp.T), perOrbitRad = 6 * Math.PI * mu / (c * c * a * (1 - e * e));
  return { mu, a, e, P, century, perOrbitRad, arcsecCy: perOrbitRad * century / P * ARCSEC };
}

/* ───────── 近点の検出(e ベクトル —— 近点の通過 r·v の −→+ で線形に補間)───────── */
function relState(S, Rinv) {
  let r = [S.x[1] - S.x[0], S.y[1] - S.y[0], S.z ? S.z[1] - S.z[0] : 0], v = [S.vx[1] - S.vx[0], S.vy[1] - S.vy[0], S.vz ? S.vz[1] - S.vz[0] : 0];
  if (Rinv) { r = mtv(Rinv, r); v = mtv(Rinv, v); }
  return { r, v };
}
function eVec(r, v, mu) {
  const rr = norm(r), v2 = dot(v, v), rv = dot(r, v), k = v2 - mu / rr;
  return [(k * r[0] - rv * v[0]) / mu, (k * r[1] - rv * v[1]) / mu, (k * r[2] - rv * v[2]) / mu];
}
const slope = (ys) => { const n = ys.length, xm = (n - 1) / 2; let sy = 0; for (const y of ys) sy += y; const ym = sy / n; let a = 0, b = 0; ys.forEach((y, k) => { a += (k - xm) * (y - ym); b += (k - xm) * (k - xm); }); return a / b; };
/** 二体の走行: nOrb 公転の近点(初期 + nOrb 個)。戻り値 {rate(rad/公転), period, ecc, S, steps, planeDrift(rad), wallSec} */
export function orbitRun(HP, q, h, nOrb, R) {
  const t0 = Date.now(), S = simOf(HP, q), G = S.params.G;
  const mu = G * (S.pinned[0] ? S.mEff[0] : (S.mEff[0] + S.mEff[1]));
  const f0 = pn1FormulaOf(q, S.pinned[0] ? 'M' : 'Mm');
  const st0 = relState(S, R), n0 = cross(st0.r, st0.v), nn0 = norm(n0);
  const peri = [{ t: 0, e: eVec(st0.r, st0.v, mu) }];
  let prev = { t: S.t, ...st0, f: dot(st0.r, st0.v), e: peri[0].e };
  const maxSteps = Math.ceil((nOrb + 0.75) * f0.P / h);
  let k = 0;
  for (; k < maxSteps && peri.length < nOrb + 1; k++) {
    S.step(h);
    const st = relState(S, R), f = dot(st.r, st.v), e = eVec(st.r, st.v, mu);
    if (prev.f < 0 && f >= 0) { const s = -prev.f / (f - prev.f); peri.push({ t: prev.t + s * (S.t - prev.t), e: [0, 1, 2].map((j) => prev.e[j] + s * (e[j] - prev.e[j])) }); }
    prev = { t: S.t, f, e };
  }
  if (peri.length < nOrb + 1) throw new Error('近点が足りない ' + peri.length);
  const w = []; let off = 0, last = null;
  for (const p of peri) { let a = Math.atan2(p.e[1], p.e[0]); if (last !== null) { while (a + off - last > Math.PI) off -= 2 * Math.PI; while (a + off - last < -Math.PI) off += 2 * Math.PI; } w.push(a + off); last = a + off; }
  const stE = relState(S, R), nE = cross(stE.r, stE.v);
  const planeDrift = Math.atan2(norm(cross(n0, nE)), dot(n0, nE));
  return { rate: slope(w), period: slope(peri.map((p) => p.t)), ecc: peri.reduce((s, p) => s + norm(p.e), 0) / peri.length, nPeri: peri.length, steps: k, S, planeDrift,
    zMax: R ? Math.abs(stE.r[2]) / norm(stE.r) : 0, nn0, wallSec: (Date.now() - t0) / 1000 };
}
const stateBits = (A, B) => { let nd = 0, nv = 0, mx = 0;
  for (const k of ['x', 'y', 'vx', 'vy', 'spin', 'rotA']) for (let i = 0; i < A.n; i++) { nv++; if (!Object.is(A[k][i], B[k][i])) { nd++; mx = Math.max(mx, relD(A[k][i], B[k][i])); } }
  nv++; if (!Object.is(A.t, B.t)) nd++;
  return { nv, nd, maxRel: mx }; };

/* ───────── A 受理の表 ───────── */
export function partA(H) {
  const HP = H.HP, rows = [];
  const T = (label, f, ok, denyKeys, warnRe) => {
    const q = merCopy(HP, { coord3d: true, free: true, f }), v = HP.validatePreset(clone(q));
    const deny = HP.coord3d.denyOf(v.ok ? v.preset : q).map((z) => z.key), errs = (v.errors || []).filter((e) => /三次元\(physics\.coord:"3d"\)では未対応/.test(e));
    const warn = (v.warnings || []).some((w) => warnRe && warnRe.test(w));
    const pass = ok ? (v.ok && deny.length === 0 && (!warnRe || warn)) : (!v.ok && errs.length > 0 && JSON.stringify([...new Set(deny)].sort()) === JSON.stringify(denyKeys.slice().sort()));
    rows.push({ label, expect: ok ? 'accept' : 'reject', ok: v.ok, deny: [...new Set(deny)], warned: warnRe ? warn : null, pass, why: v.ok ? null : (errs[0] || (v.errors || [])[0] || '').slice(0, 120) });
  };
  T('geoPN=1(三次元・kFrame=0)', () => {}, true);
  T('geoPN=2(kFrame=0 —— 互換入力)', (q) => { q.physics.geoPN = 2; }, false, ['geoPN12']);
  T('geoPN=1 ∧ kFrame=1', (q) => { q.physics.kFrame = 1; }, false, ['kFrame']);
  T('geoPN=1 ∧ physics.geodesic:true', (q) => { q.physics.geodesic = true; }, false, ['geodesic']);
  T('geoPN=1 ∧ physics.approxMany(太陽を支配天体 —— 固定)', (q) => { q.bodies[0].pinned = true; q.bodies[1].spin = 0; q.physics.approxMany = { version: 'v1', governor: 0, groups: [{ kind: 'body', rows: [1, 1], spinZero: 'declared' }] }; }, false, ['geoPN12']);
  T('geoPN=1 ∧ 試験粒子(bodies[1].testParticle)', (q) => { q.bodies[1].testParticle = true; }, false, ['testParticle']);
  T('geoPN=1 ∧ λ_PN の係数 0.5', (q) => { q.physics.lambdaPN = 0.5; }, true);
  T('geoPN=1 ∧ pnAlpha 1.0(PPN γ = 0.5)', (q) => { q.physics.pnAlpha = 1.0; }, true);
  T('geoPN=1 ∧ 太陽 pinned(宣言のまま)', (q) => { q.bodies[0].pinned = true; }, true);
  T('geoPN=1 ∧ integrator leapfrog', (q) => { q.integrator = 'leapfrog'; }, true);
  T('geoPN=1 ∧ stateCarry 省略(Float32 の状態)', (q) => { delete q.physics.stateCarry; }, true);
  T('geoPN=1 ∧ 慣性決定力 relativeDrag.law:"inertial"(警告 inertialPlusGeodesic —— 二次元と同じ)', (q) => { q.physics.relativeDrag = { law: 'inertial', Wbg: 0.125, eps: 0.05, pairs: 'all' }; }, true, null, /慣性決定力の引きずり/);
  T('geoPN=1 ∧ 明示潮汐 physics.tide と天体の tide', (q) => { q.physics.tide = { maxN: 8 }; q.bodies[1].tide = { k2: 0.3, lag: 6 }; }, true);
  T('geoPN=1 ∧ bodies[1].pnSource:false', (q) => { q.bodies[1].pnSource = false; }, true);
  T('geoPN=0 ∧ physics.geodesic:true(従来の拒否)', (q) => { q.physics.geoPN = 0; q.physics.geodesic = true; }, false, ['geodesic']);
  T('geoPN=3 ∧ 慣性の宣言なし(従来の拒否)', (q) => { q.physics.geoPN = 3; }, false, ['geoPN12']);
  // 走行中の門(geoPN を 0 → 1 → 2 → 1 と編集)
  const S = simOf(HP, merCopy(HP, { coord3d: true, free: true, geoPN: 0 })), h = S.params.stepDt, rt = [];
  const stepOnce = (g) => { S.params.geoPN = g; const t0 = S.t; S.step(h); rt.push({ geoPN: g, advanced: S.t > t0, halt: S.coord3dHalt || null, pn1: HP.coord3d.pn1.on(S), pnOrb: S._pnOrb === 1 }); };
  for (const g of [0, 1, 2, 1, 0]) stepOnce(g);
  const runtimeOk = rt[0].advanced && !rt[0].pn1 && rt[1].advanced && rt[1].pn1 && rt[1].pnOrb && !rt[2].advanced && /geoPN/.test(rt[2].halt || '') && rt[3].advanced && rt[3].pn1 && rt[4].advanced && !rt[4].pnOrb;
  // approxMany の本を走行中に geoPN=1 へ
  const qa = merCopy(HP, { coord3d: true, geoPN: 0, f: (q) => { q.bodies[1].spin = 0; q.physics.approxMany = { version: 'v1', governor: 0, groups: [{ kind: 'body', rows: [1, 1], spinZero: 'declared' }] }; } });
  const SA = simOf(HP, qa); SA.params.geoPN = 1; const ta = SA.t; SA.step(SA.params.stepDt);
  const amHalt = { advanced: SA.t > ta, halt: SA.coord3dHalt || null };
  // 二次元→三次元の切り替え(coordSwitchPlanOf)で通るようになった在位の二次元の本(宣言から導く —— 本の宣言は変えない)
  const plan = E(H, 'coordSwitchPlanOf');
  const ps = HP.allPresets().filter((p) => !String(p.id).startsWith('custom_') && p.familyRole !== 'retired');
  const g1 = ps.filter((p) => HP.coord3d.coordOf(p.physics) === '2d' && (p.physics || {}).geoPN === 1);
  const switchable = g1.filter((p) => plan(p, '3d').ok).map((p) => p.id), still = g1.filter((p) => !plan(p, '3d').ok).map((p) => ({ id: p.id, keys: [...new Set(plan(p, '3d').reasons.map((z) => z.key))] }));
  const builtin3dPN1 = ps.filter((p) => HP.coord3d.coordOf(p.physics) === '3d' && (p.physics || {}).geoPN === 1).map((p) => p.id);
  return { rows, nPass: rows.filter((r) => r.pass).length, nCases: rows.length, runtime: rt, runtimeOk, approxManyRuntime: amHalt,
    approxManyHalted: !amHalt.advanced && /approxMany/.test(amHalt.halt || ''), switch2dGeoPN1: { n2dGeoPN1: g1.length, switchable, still }, builtin3dPN1,
    supportedHasPn1: HP.coord3d.supported.some((z) => z.key === 'pn1'), rejectedHasGeoPN12: HP.coord3d.rejected.indexOf('geoPN12') >= 0 };
}

/* ───────── P 平面の写し ───────── */
export function partP(H, quick) {
  const HP = H.HP, nOrb = quick ? ORBITS_QUICK : ORBITS;
  const base = merCopy(HP, {}), h0 = base.physics.stepDt;
  const fM = pn1FormulaOf(base, 'M'), fMm = pn1FormulaOf(base, 'Mm');
  const toCy = (rad, f) => rad * f.century / f.P * ARCSEC;
  const variants = [{ key: 'pinned', free: false, integrator: undefined, hs: [1, 2] }, { key: 'free', free: true, integrator: undefined, hs: [1, 2] }, { key: 'freeLeapfrog', free: true, integrator: 'leapfrog', hs: [1] }];
  const rows = [];
  for (const vr of variants) for (const hd of vr.hs) {
    const h = h0 / hd, f = vr.free ? fMm : fM, run = {};
    for (const dim of ['2d', '3d']) for (const g of [1, 0]) run[dim + g] = orbitRun(HP, merCopy(HP, { coord3d: dim === '3d', geoPN: g, free: vr.free, integrator: vr.integrator }), h, nOrb, null);
    const inc2 = run['2d1'].rate - run['2d0'].rate, inc3 = run['3d1'].rate - run['3d0'].rate;
    const b1 = stateBits(run['2d1'].S, run['3d1'].S), b0 = stateBits(run['2d0'].S, run['3d0'].S);
    rows.push({ variant: vr.key, integrator: run['3d1'].S.integrator, h, hDiv: hd, orbits: nOrb, steps: run['3d1'].steps,
      rate2d: run['2d1'].rate, rate3d: run['3d1'].rate, rate0_2d: run['2d0'].rate, rate0_3d: run['3d0'].rate,
      inc2dRad: inc2, inc3dRad: inc3, inc2dCy: toCy(inc2, f), inc3dCy: toCy(inc3, f), q1pnCy: f.arcsecCy, ratio3d: inc3 / f.perOrbitRad,
      period2d: run['2d1'].period, period3d: run['3d1'].period, ecc2d: run['2d1'].ecc, ecc3d: run['3d1'].ecc,
      bits1: b1, bits0: b0, rateSame: Object.is(run['2d1'].rate, run['3d1'].rate) && Object.is(run['2d0'].rate, run['3d0'].rate),
      wallSec: Object.values(run).reduce((s, r) => s + r.wallSec, 0) });
  }
  // Δ₃ と二次元の Δ(同じ平面の状態 —— 自由・固定 × 初期と 100 步後)
  const d2f = E(H, 'dfmPN1Delta'), deltaRows = [];
  for (const free of [false, true]) for (const n of [0, 100]) {
    const S2 = simOf(HP, merCopy(HP, { free })), S3 = simOf(HP, merCopy(HP, { free, coord3d: true }));
    for (let k = 0; k < n; k++) { S2.step(h0); S3.step(h0); }
    const N = S2.n, a = [new Float64Array(N), new Float64Array(N)], b = [new Float64Array(N), new Float64Array(N), new Float64Array(N)];
    const r2 = d2f(S2, a[0], a[1]), r3 = HP.coord3d.pn1.delta(S3, b[0], b[1], b[2]);
    let same = r2 === r3, nz = 0;
    for (let i = 0; i < N; i++) { if (!Object.is(a[0][i], b[0][i]) || !Object.is(a[1][i], b[1][i])) same = false; if (b[2][i] !== 0) nz++; }
    deltaRows.push({ sun: free ? 'free' : 'pinned', steps: n, receivers: r3, bitSame: same, dzNonZero: nz, deltaMax: Math.max(...Array.from(a[0]).map(Math.abs), ...Array.from(a[1]).map(Math.abs)) });
  }
  return { orbits: nOrb, h0, formula: { pinned: { a: fM.a, e: fM.e, PK: fM.P, perOrbitRad: fM.perOrbitRad, arcsecCy: fM.arcsecCy }, free: { a: fMm.a, e: fMm.e, PK: fMm.P, perOrbitRad: fMm.perOrbitRad, arcsecCy: fMm.arcsecCy } },
    an336q1pn: 42.98051038206748, rows, deltaRows };
}

/* ───────── R 回転の共変 ───────── */
export function partR(H, quick) {
  const HP = H.HP, nOrb = quick ? ORBITS_QUICK : ORBITS, h = merCopy(HP, {}).physics.stepDt;
  const ref = { g1: orbitRun(HP, merCopy(HP, { coord3d: true, free: true, geoPN: 1 }), h, nOrb, null), g0: orbitRun(HP, merCopy(HP, { coord3d: true, free: true, geoPN: 0 }), h, nOrb, null) };
  const incRef = ref.g1.rate - ref.g0.rate, rows = [];
  for (const rot of ROTS) {
    const R = rotOf(...rot);
    const g1 = orbitRun(HP, merCopy(HP, { coord3d: true, free: true, geoPN: 1, rot }), h, nOrb, R), g0 = orbitRun(HP, merCopy(HP, { coord3d: true, free: true, geoPN: 0, rot }), h, nOrb, R);
    const inc = g1.rate - g0.rate;
    rows.push({ rot, rate: g1.rate, inc, relRate: relD(g1.rate, ref.g1.rate), relInc: relD(inc, incRef), relPeriod: relD(g1.period, ref.g1.period), relEcc: relD(g1.ecc, ref.g1.ecc),
      absRate: Math.abs(g1.rate - ref.g1.rate), planeDrift: g1.planeDrift, zEnd: g1.zMax, wallSec: g1.wallSec + g0.wallSec });
  }
  const worst = (k) => Math.max(...rows.map((r) => r[k]));
  return { orbits: nOrb, h, ref: { rate: ref.g1.rate, inc: incRef, period: ref.g1.period, ecc: ref.g1.ecc, planeDrift: ref.g1.planeDrift }, rows,
    worst: { relRate: worst('relRate'), relInc: worst('relInc'), relPeriod: worst('relPeriod'), relEcc: worst('relEcc'), absRate: worst('absRate'), planeDrift: worst('planeDrift') } };
}

/* ───────── N 体の小さな写し ───────── */
/** 太陽・木星・土星(人工の円軌道)。tilt: 傾きを入れる・coord3d: 三次元の本 */
export function nbBook(HP, o = {}) {
  const q = merCopy(HP, { coord3d: o.coord3d, geoPN: o.geoPN, free: true, integrator: 'leapfrog' });
  q.id = 'w314dSJS'; delete q.orbitObs; delete q.obsCard;
  const G = q.physics.G, M = q.bodies[0].m, sun = q.bodies[0];
  sun.x = 0; sun.y = 0; sun.vx = 0; sun.vy = 0; sun.spin = 0;
  const bodies = [sun];
  for (const p of NB) {
    const inc = o.tilt ? p.incl : 0, R = rotOf(p.node, inc, p.phase), vc = Math.sqrt(G * (M + p.m) / p.a);
    const r = mv(R, [p.a, 0, 0]), v = mv(R, [0, vc, 0]);
    bodies.push({ type: 'single', m: p.m, radius: p.radius, x: r[0], y: r[1], z: r[2], vx: v[0], vy: v[1], vz: v[2], spin: 0, pinned: false });
  }
  let Mt = 0; const c = [0, 0, 0], pm = [0, 0, 0];
  for (const b of bodies) { Mt += b.m; c[0] += b.m * b.x; c[1] += b.m * b.y; c[2] += b.m * (b.z || 0); pm[0] += b.m * b.vx; pm[1] += b.m * b.vy; pm[2] += b.m * (b.vz || 0); }
  for (const b of bodies) { b.x -= c[0] / Mt; b.y -= c[1] / Mt; b.z = (b.z || 0) - c[2] / Mt; b.vx -= pm[0] / Mt; b.vy -= pm[1] / Mt; b.vz = (b.vz || 0) - pm[2] / Mt; }
  if (!o.coord3d) for (const b of bodies) { delete b.z; delete b.vz; }
  q.bodies = bodies;
  const PJ = 2 * Math.PI * Math.sqrt(NB[0].a * NB[0].a * NB[0].a / (G * (M + NB[0].m)));
  q.physics.stepDt = PJ / NB_STEPS_PER_ORBIT;
  return q;
}
/** EIH の 1PN の運動量 p_a = ∂L/∂v_a(lib-w285b-gr1pn の ppnMomenta の 3 成分版 —— 軟化なし・全天体が源)と Σm·v */
export function momenta3(S, G, c, lam, gam) {
  const n = S.n, k2 = lam / (c * c), P = [0, 0, 0], PN = [0, 0, 0];
  const z = (i) => (S.z ? S.z[i] : 0), vz = (i) => (S.vz ? S.vz[i] : 0);
  for (let a = 0; a < n; a++) {
    const ma = S.mEff[a], va = [S.vx[a], S.vy[a], vz(a)], v2 = dot(va, va), f = ma * (1 + k2 * v2 / 2);
    const p = [f * va[0], f * va[1], f * va[2]];
    for (let b = 0; b < n; b++) { if (a === b) continue;
      const d = [S.x[a] - S.x[b], S.y[a] - S.y[b], z(a) - z(b)], r = norm(d), nn = [d[0] / r, d[1] / r, d[2] / r], K = G * ma * S.mEff[b] / r, vb = [S.vx[b], S.vy[b], vz(b)], nvb = dot(nn, vb);
      for (let j = 0; j < 3; j++) p[j] += k2 * K * ((2 * gam + 1) * va[j] - 0.5 * (4 * gam + 3) * vb[j] - 0.5 * nn[j] * nvb); }
    for (let j = 0; j < 3; j++) { P[j] += p[j]; PN[j] += ma * va[j]; }
  }
  return { P, PN };
}
export function partN(H, quick) {
  const HP = H.HP, steps = quick ? NB_STEPS_PER_ORBIT / 2 : NB_STEPS_PER_ORBIT * NB_ORBITS, out = {};
  const confs = { '2d': { coord3d: false, tilt: false }, '3dFlat': { coord3d: true, tilt: false }, '3dTilt': { coord3d: true, tilt: true } };
  for (const [ck, cf] of Object.entries(confs)) for (const g of [1, 0]) {
    const t0 = Date.now(), q = nbBook(HP, { ...cf, geoPN: g }), S = simOf(HP, q), h = S.params.stepDt, G = S.params.G, c = S.params.cLight;
    const m0 = momenta3(S, G, c, 1, 1);
    let scale = 0; for (let i = 0; i < S.n; i++) scale += S.mEff[i] * Math.sqrt(S.vx[i] * S.vx[i] + S.vy[i] * S.vy[i] + (S.vz ? S.vz[i] * S.vz[i] : 0));
    let dPN = 0, dP = 0;
    for (let k = 1; k <= steps; k++) { S.step(h);
      if (k % 10 === 0 || k === steps) { const m = momenta3(S, G, c, 1, 1); dPN = Math.max(dPN, norm([m.PN[0] - m0.PN[0], m.PN[1] - m0.PN[1], m.PN[2] - m0.PN[2]]) / scale); dP = Math.max(dP, norm([m.P[0] - m0.P[0], m.P[1] - m0.P[1], m.P[2] - m0.P[2]]) / scale); } }
    out[ck + '_g' + g] = { S, steps, h, dPNewton: dPN, dP1PN: dP, finite: [S.x, S.y, S.vx, S.vy].every((a) => Array.from(a.subarray(0, S.n)).every(Number.isFinite)), wallSec: (Date.now() - t0) / 1000 };
  }
  const rows = [], kmPerUnit = pow10(8) / 1000;
  for (const ck of Object.keys(confs)) {
    const A = out[ck + '_g1'], B = out[ck + '_g0'], d = [];
    for (let i = 0; i < A.S.n; i++) d.push(Math.sqrt((A.S.x[i] - B.S.x[i]) ** 2 + (A.S.y[i] - B.S.y[i]) ** 2 + (A.S.z ? (A.S.z[i] - B.S.z[i]) ** 2 : 0)) * kmPerUnit);
    rows.push({ conf: ck, steps: A.steps, h: A.h, pn1DiffKm: d, finite: A.finite && B.finite, dPNewton1: A.dPNewton, dP1PN1: A.dP1PN, dPNewton0: B.dPNewton, dP1PN0: B.dP1PN, wallSec: A.wallSec + B.wallSec });
  }
  const flatBits = { g1: stateBits(out['2d_g1'].S, out['3dFlat_g1'].S), g0: stateBits(out['2d_g0'].S, out['3dFlat_g0'].S) };
  // EIH の 1PN の運動量の変化の刻みの次数(傾けた写し・geoPN=1 × leapfrog・semi × h・h/2・h/4 —— 同じ時間)
  const hScan = [];
  for (const integ of ['leapfrog', 'semi']) for (const div of [1, 2, 4]) {
    const t0 = Date.now(), q = nbBook(HP, { coord3d: true, tilt: true, geoPN: 1 }); q.integrator = integ;
    const S = simOf(HP, q), h = S.params.stepDt / div, G = S.params.G, c = S.params.cLight, m0 = momenta3(S, G, c, 1, 1);
    let scale = 0; for (let i = 0; i < S.n; i++) scale += S.mEff[i] * Math.sqrt(S.vx[i] * S.vx[i] + S.vy[i] * S.vy[i] + S.vz[i] * S.vz[i]);
    let dP = 0; for (let k = 1; k <= steps * div; k++) { S.step(h); if (k % (10 * div) === 0) { const m = momenta3(S, G, c, 1, 1); dP = Math.max(dP, norm([m.P[0] - m0.P[0], m.P[1] - m0.P[1], m.P[2] - m0.P[2]]) / scale); } }
    hScan.push({ integrator: integ, hDiv: div, steps: steps * div, dP1PN: dP, wallSec: (Date.now() - t0) / 1000 });
  }
  const ord = (integ) => { const r = hScan.filter((x) => x.integrator === integ); return { r12: r[0].dP1PN / r[1].dP1PN, r24: r[1].dP1PN / r[2].dP1PN }; };
  return { steps, orbits: quick ? 0.5 : NB_ORBITS, bodies: NB.map((b) => ({ key: b.key, ja: b.ja, m: b.m, a: b.a, incl: b.incl, node: b.node })), rows, flatBits,
    hScan, hOrder: { leapfrog: ord('leapfrog'), semi: ord('semi') } };
}

/* ───────── X 16 体の写し ───────── */
/** 独立に書いた EIH の 1PN(3 成分 —— 全体の形・Plummer 軟化・源の旗と固定の旗)。戻り値 [[ax,ay,az]…] */
export function eihPN3(B, o) {
  const G = o.G, k2 = o.lambda / (o.c * o.c), gam = o.gamma, e2 = o.eps * o.eps, n = B.length;
  const Wof = (a, b) => 1 / Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2 + e2);
  const phi = new Array(n).fill(0), gb = B.map(() => [0, 0, 0]);
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { if (i === j || !B[j].src) continue;
    const W = Wof(B[i], B[j]), Gm = G * B[j].m; phi[i] += Gm * W;
    if (!B[i].pin) { gb[i][0] -= Gm * W * W * W * (B[i].x - B[j].x); gb[i][1] -= Gm * W * W * W * (B[i].y - B[j].y); gb[i][2] -= Gm * W * W * W * (B[i].z - B[j].z); } }
  return B.map((A, a) => {
    const acc = [0, 0, 0]; if (A.pin) return acc;
    const va = [A.vx, A.vy, A.vz];
    for (let b = 0; b < n; b++) { if (b === a || !B[b].src) continue;
      const Bb = B[b], d = [A.x - Bb.x, A.y - Bb.y, A.z - Bb.z], W = Wof(A, Bb), Gm = G * Bb.m, W3 = W * W * W, vb = [Bb.vx, Bb.vy, Bb.vz];
      const g = [-Gm * W3 * d[0], -Gm * W3 * d[1], -Gm * W3 * d[2]], dvb = dot(d, vb);
      const br = gam * dot(va, va) + (1 + gam) * dot(vb, vb) - 2 * (1 + gam) * dot(va, vb) - 1.5 * dvb * dvb * W * W - 2 * (1 + gam) * phi[a] - phi[b] - 0.5 * dot(d, gb[b]);
      const dn = dot(d, [2 * (1 + gam) * va[0] - (1 + 2 * gam) * vb[0], 2 * (1 + gam) * va[1] - (1 + 2 * gam) * vb[1], 2 * (1 + gam) * va[2] - (1 + 2 * gam) * vb[2]]);
      for (let j = 0; j < 3; j++) acc[j] += g[j] * br + Gm * W3 * dn * (va[j] - vb[j]) + 0.5 * (3 + 4 * gam) * Gm * W * gb[b][j]; }
    return acc.map((x) => k2 * x);
  });
}
/** html の EIH(Δ₃ + 試験粒子形₃)を S の今の状態で(状態は書かない)。narrow: Δ₃ を詰め替え版へ回さない */
export function htmlPN3(HP, S, narrow) {
  const n = S.n, D = [new Float64Array(n), new Float64Array(n), new Float64Array(n)], T = [new Float64Array(n), new Float64Array(n), new Float64Array(n)];
  HP.coord3d.pn1.delta(S, D[0], D[1], D[2], narrow); HP.coord3d.pn1.test(S, T[0], T[1], T[2]);
  return { D, T, sum: [...Array(n).keys()].map((i) => [D[0][i] + T[0][i], D[1][i] + T[1][i], D[2][i] + T[2][i]]) };
}
function bodiesOfSim(H, S) {
  const p = S.params, G = p.G, c = p.cLight, pnK = (E(H, 'RAY_ALPHA_MIN') / 4) * (c * c) / G, eps = p.softening, out = [];
  for (let i = 0; i < S.n; i++) out.push({ m: S.mEff[i], x: S.x[i], y: S.y[i], z: S.z[i], vx: S.vx[i], vy: S.vy[i], vz: S.vz[i], pin: !!S.pinned[i], src: !!(S.pnOv[i] || S.mEff[i] >= pnK * Math.max(S.R[i], eps)) });
  return out;
}
const accRel = (A, B) => { let mx = 0, sc = 0; for (let i = 0; i < A.length; i++) { sc = Math.max(sc, norm(B[i])); mx = Math.max(mx, norm([A[i][0] - B[i][0], A[i][1] - B[i][1], A[i][2] - B[i][2]])); } return sc > 0 ? mx / sc : mx; };
export function solar16Books(HP) {
  const base = S16.presetOf(S16.syntheticRecord());
  const g1 = clone(base); g1.physics.geoPN = 1; g1.physics.lambdaPN = 1; delete g1.physics.relativeDrag;
  const g0 = clone(base); g0.physics.geoPN = 0; g0.physics.lambdaPN = 1; delete g0.physics.relativeDrag;
  const g3 = clone(base); g3.physics.geoPN = 3; g3.physics.lambdaPN = 0; g3.physics.relativeDrag = clone(K1_DRAG);
  return { g1, g0, g3 };
}
export function partX(H, quick) {
  const HP = H.HP, books = solar16Books(HP), rows = {}, tSteps = quick ? X_STEPS : X_TIME_STEPS;
  let S1 = null;
  for (const [k, q] of Object.entries(books)) {
    const v = HP.validatePreset(clone(q));
    const row = { ok: v.ok, errors: (v.errors || []).slice(0, 2), warnings: (v.warnings || []).length, deny: HP.coord3d.denyOf(v.ok ? v.preset : q).map((z) => z.key) };
    if (v.ok) {
      const tb = Date.now(), S = HP.coord3d.makeSim(); S.build(clone(v.preset)); row.build = { wallSec: (Date.now() - tb) / 1000 };
      const h = S.params.stepDt; row.h = h; row.n = S.n; row.integrator = S.integrator;
      let t0 = Date.now(); for (let s = 0; s < X_STEPS; s++) S.step(h); row.run20 = { wallSec: (Date.now() - t0) / 1000 };
      row.finite = [S.x, S.y, S.z, S.vx, S.vy, S.vz].every((a) => Array.from(a.subarray(0, S.n)).every(Number.isFinite)) && !S.coord3dHalt;
      row.halt = S.coord3dHalt || null; row.t = S.t;
      // 所要(步あたり —— 壁時計・所要の欄は volatilePaths): geoPN=1・0 は 20 步の後の tSteps 步・geoPN=3 は 20 步
      const extra = (k === 'g3') ? 0 : tSteps;
      if (extra) { const S2 = HP.coord3d.makeSim(); S2.build(clone(v.preset)); for (let s = 0; s < X_STEPS; s++) S2.step(h); t0 = Date.now(); for (let s = 0; s < extra; s++) S2.step(h);
        const w = (Date.now() - t0) / 1000; row.cost = { steps: extra, wallSec: w, rateStepsPerSec: w > 0 ? extra / w : null }; }
      else row.cost = { steps: X_STEPS, wallSec: row.run20.wallSec, rateStepsPerSec: row.run20.wallSec > 0 ? X_STEPS / row.run20.wallSec : null };
      if (k === 'g1') { S1 = S; row.pn1 = HP.coord3d.pn1.state(S); }
      rows[k] = { row, S };
    } else rows[k] = { row, S: null };
  }
  const out = { members: S16.MEMBERS.map((m) => m.key), steps: X_STEPS, rows: Object.fromEntries(Object.entries(rows).map(([k, v]) => [k, v.row])) };
  if (S1) {
    const n = S1.n, Dw = [new Float64Array(n), new Float64Array(n), new Float64Array(n)], Dn = [new Float64Array(n), new Float64Array(n), new Float64Array(n)];
    const rw = HP.coord3d.pn1.delta(S1, Dw[0], Dw[1], Dw[2]), rn = HP.coord3d.pn1.delta(S1, Dn[0], Dn[1], Dn[2], true);
    let wideSame = rw === rn; for (let j = 0; j < 3; j++) for (let i = 0; i < n; i++) if (!Object.is(Dw[j][i], Dn[j][i])) wideSame = false;
    out.wide = { receivers: rw, sources: out.rows.g1.pn1.sources, wide: out.rows.g1.pn1.wide, bitSame: wideSame };
    // 独立に書いた EIH(参照の式)との照合 —— 16 体の 20 步後・N 体の傾けた写し・固定の源の写し
    const ora = [];
    const cmp = (label, S) => { const pp = S.params, o2 = { G: pp.G, c: pp.cLight, lambda: (pp.lambdaPN !== undefined ? pp.lambdaPN : 1), gamma: (pp.pnAlpha !== undefined ? pp.pnAlpha : 1.5) - 0.5, eps: pp.softening };
      const hv = htmlPN3(HP, S, false).sum, ov = eihPN3(bodiesOfSim(H, S), o2); ora.push({ label, n: S.n, rel: accRel(hv, ov), scale: Math.max(...ov.map(norm)) }); };
    cmp('16 体(人工の配置・20 步後)', S1);
    { const S = simOf(HP, nbBook(HP, { coord3d: true, tilt: true, geoPN: 1 })); for (let k = 0; k < 10; k++) S.step(S.params.stepDt); cmp('太陽・木星・土星(傾き・10 步後)', S); }
    { const S = simOf(HP, merCopy(HP, { coord3d: true, rot: ROTS[0] })); for (let k = 0; k < 10; k++) S.step(S.params.stepDt); cmp('太陽(固定)–水星(回した軌道・10 步後)', S); }
    { const S = simOf(HP, merCopy(HP, { coord3d: true, free: true, rot: ROTS[1], f: (q) => { q.physics.pnAlpha = 1.0; q.physics.lambdaPN = 0.5; } })); for (let k = 0; k < 10; k++) S.step(S.params.stepDt); cmp('太陽(自由)–水星(pnAlpha 1.0・λ_PN 0.5・回した軌道)', S); }
    out.oracle = ora;
    // 加速度の回転の共変(16 体の状態を回して Δ₃ + 試験粒子形₃ を引き直す)
    const R = rotOf(...ROTS[2]), a0 = htmlPN3(HP, S1, false).sum;
    const S2 = HP.coord3d.makeSim(); S2.build(clone(HP.validatePreset(clone(books.g1)).preset));
    for (let i = 0; i < n; i++) { const r = mv(R, [S1.x[i], S1.y[i], S1.z[i]]), v = mv(R, [S1.vx[i], S1.vy[i], S1.vz[i]]); S2.x[i] = r[0]; S2.y[i] = r[1]; S2.z[i] = r[2]; S2.vx[i] = v[0]; S2.vy[i] = v[1]; S2.vz[i] = v[2]; }
    const a1 = htmlPN3(HP, S2, false).sum;
    // 丸めの尺度: 回した座標の丸め(2⁻⁵² |x|)を対の距離で割った最大(遠い天体の近い衛星 —— 海王星とトリトンの対が最大)
    let floor = 0; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { const d = Math.sqrt((S1.x[i] - S1.x[j]) ** 2 + (S1.y[i] - S1.y[j]) ** 2 + (S1.z[i] - S1.z[j]) ** 2);
      const xm = Math.max(Math.abs(S1.x[i]), Math.abs(S1.y[i]), Math.abs(S1.z[i]), Math.abs(S1.x[j]), Math.abs(S1.y[j]), Math.abs(S1.z[j])); floor = Math.max(floor, Number.EPSILON * xm / d); }
    // 対照: 太陽・木星・土星(近い対が無い)の傾けた写しの同じ照合
    const SJ = simOf(HP, nbBook(HP, { coord3d: true, tilt: true, geoPN: 1 })), SJ2 = simOf(HP, nbBook(HP, { coord3d: true, tilt: true, geoPN: 1 })), b0 = htmlPN3(HP, SJ, false).sum;
    for (let i = 0; i < SJ.n; i++) { const r = mv(R, [SJ.x[i], SJ.y[i], SJ.z[i]]), v = mv(R, [SJ.vx[i], SJ.vy[i], SJ.vz[i]]); SJ2.x[i] = r[0]; SJ2.y[i] = r[1]; SJ2.z[i] = r[2]; SJ2.vx[i] = v[0]; SJ2.vy[i] = v[1]; SJ2.vz[i] = v[2]; }
    out.covAcc = { rot: ROTS[2], rel: accRel(a1, a0.map((a) => mv(R, a))), roundFloor: floor, relSJS: accRel(htmlPN3(HP, SJ2, false).sum, b0.map((a) => mv(R, a))) };
    // 1PN の有無の差(20 步)
    const S0 = rows.g0.S; let dmax = 0; for (let i = 0; i < n; i++) dmax = Math.max(dmax, Math.sqrt((S1.x[i] - S0.x[i]) ** 2 + (S1.y[i] - S0.y[i]) ** 2 + (S1.z[i] - S0.z[i]) ** 2));
    out.pn1DiffKm = dmax * S16.KM_PER_UNIT;
    // 試験粒子形₃ の核の中の塊と単独の版(二体の三次元の状態 —— 対が 1 つなので加算の順が同じ —— ビット)
    { const q = merCopy(HP, { coord3d: true, free: true, rot: ROTS[0] }), A = simOf(HP, q), B = simOf(HP, q), C = simOf(HP, q);
      const core = HP.coord3d.core, h = A.params.stepDt; core(A, h, 1, true); core(B, h, 1, false);
      const N2 = C.n, T = [new Float64Array(N2), new Float64Array(N2), new Float64Array(N2)]; HP.coord3d.pn1.test(C, T[0], T[1], T[2]);
      let same = true; for (let i = 0; i < N2; i++) { if (!Object.is(A.ax[i], B.ax[i] + T[0][i]) || !Object.is(A.ay[i], B.ay[i] + T[1][i]) || !Object.is(A.az3[i], B.az3[i] + T[2][i])) same = false; }
      out.coreInline = { bitSame: same, n: N2 }; }
  }
  return out;
}

/* ───────── 門 ───────── */
export const TOL = Object.freeze({ cov: 1e-9, covPlane: 1e-12, oracle: 1e-12, covAcc: 1e-13, pn1Ratio: 0.05, hOrder: [1.8, 2.2] });
export function gatesOf(J) {
  const g = {};
  if (J.A) {
    g.acceptance = J.A.nPass === J.A.nCases;
    g.runtimeGate = J.A.runtimeOk === true && J.A.approxManyHalted === true;
    g.supportedPn1 = J.A.supportedHasPn1 === true && J.A.rejectedHasGeoPN12 === true;
    g.noBuiltin3dPN1 = Array.isArray(J.A.builtin3dPN1) && J.A.builtin3dPN1.length === 0;
  }
  if (J.P) {
    g.planarBitSame = J.P.rows.every((r) => r.bits1.nd === 0 && r.bits0.nd === 0 && r.rateSame === true);
    g.deltaPlanarBitSame = J.P.deltaRows.every((r) => r.bitSame === true && r.dzNonZero === 0 && r.receivers > 0);
    g.pn1Magnitude = J.P.rows.filter((r) => r.hDiv === 2).every((r) => Math.abs(r.ratio3d - 1) < TOL.pn1Ratio);
  }
  if (J.R) {
    g.covariance = J.R.worst.relRate <= TOL.cov && J.R.worst.relPeriod <= TOL.cov && J.R.worst.relEcc <= TOL.cov;
    g.planeKept = J.R.worst.planeDrift <= TOL.covPlane;
  }
  if (J.N) {
    g.nbodyFinite = J.N.rows.every((r) => r.finite && r.pn1DiffKm.some((d) => d > 0) && r.pn1DiffKm.every(Number.isFinite));
    g.nbodyFlatBitSame = J.N.flatBits.g1.nd === 0 && J.N.flatBits.g0.nd === 0;
    g.momentumBudget = J.N.rows.every((r) => r.dP1PN1 < r.dPNewton1);
    g.momentumFirstOrder = ['leapfrog', 'semi'].every((k) => [J.N.hOrder[k].r12, J.N.hOrder[k].r24].every((x) => x >= TOL.hOrder[0] && x <= TOL.hOrder[1]));
  }
  if (J.X) {
    g.solar16Accepted = J.X.rows.g1.ok === true && J.X.rows.g1.finite === true && J.X.rows.g0.ok === true && J.X.rows.g0.finite === true;
    g.solar16K1Accepted = J.X.rows.g3.ok === true && J.X.rows.g3.finite === true;
    g.wideBitSame = !!(J.X.wide && J.X.wide.bitSame === true && J.X.wide.sources === 16 && J.X.wide.wide === true);
    g.oracle = !!(J.X.oracle && J.X.oracle.every((r) => r.rel <= TOL.oracle));
    g.covAcc = !!(J.X.covAcc && J.X.covAcc.rel <= J.X.covAcc.roundFloor && J.X.covAcc.relSJS <= TOL.covAcc);
    g.coreInline = !!(J.X.coreInline && J.X.coreInline.bitSame === true);
  }
  return g;
}

/* ───────── 表(PHYSICS〔第314便d〕に逐語)───────── */
const f3 = (v) => (v === null || v === undefined) ? '—' : Number(v).toFixed(3);
const f4 = (v) => (v === null || v === undefined) ? '—' : Number(v).toFixed(4);
const e2s = (v) => (v === null || v === undefined) ? '—' : Number(v).toExponential(2);
const e3s = (v) => (v === null || v === undefined) ? '—' : Number(v).toExponential(3);
const fl = (v, floor) => (v === null || v === undefined) ? '—' : (v === 0 ? '0' : fmtFloor(v, floor, 3));
const VAR_JA = { pinned: '太陽 固定(宣言のまま)', free: '太陽 自由', freeLeapfrog: '太陽 自由・leapfrog' };
const CONF_JA = { '2d': '二次元', '3dFlat': '三次元(平面)', '3dTilt': '三次元(傾き)' };
export function physicsTables(J) {
  const out = [];
  if (J.A) {
    out.push('| 宣言(三次元・太陽–水星の写し) | 期待 | 受理 | 受理の門の鍵 | 表と一致 |', '|---|---|---|---|---|');
    for (const r of J.A.rows) out.push(`| ${r.label} | ${r.expect === 'accept' ? '受理' : '拒否'} | ${r.ok ? '受理' : '拒否'} | ${r.deny.length ? r.deny.join('・') : '—'} | ${r.pass ? '一致' : '違う'} |`);
  }
  if (J.P) {
    out.push('', '| 写し | 積分器 | 刻み | 1PN の近点の率(geoPN=1 − 0)[″/世紀] | 解析 q_1PN [″/世紀] | 比 | 周期 [本の時間] | 離心率 | 二次元と三次元の状態(ビット) |', '|---|---|---|---|---|---|---|---|---|');
    for (const r of J.P.rows) out.push(`| ${VAR_JA[r.variant]} | ${r.integrator} | h/${r.hDiv} | ${f4(r.inc3dCy)} | ${f4(r.q1pnCy)} | ${f4(r.ratio3d)} | ${f3(r.period3d)} | ${r.ecc3d.toFixed(6)} | ${r.bits1.nd === 0 && r.bits0.nd === 0 && r.rateSame ? '同一(' + r.bits1.nv + ' 値 × 2)' : '違う ' + r.bits1.nd + '・' + r.bits0.nd} |`);
  }
  if (J.R) {
    // 丸めの床の程度の数は床で書く(逐語の表 —— 実測の値は正本と節の読み)
    out.push('', '| 向き [Ω, i, ω]° | 近点の率の相対の差 | 1PN の分の相対の差 | 周期の相対の差 | 離心率の相対の差 | 軌道面の法線のずれ [rad] |', '|---|---|---|---|---|---|');
    for (const r of J.R.rows) out.push(`| ${r.rot.join(', ')} | ${fl(r.relRate, 1e-9)} | ${fl(r.relInc, 1e-7)} | ${fl(r.relPeriod, 1e-9)} | ${fl(r.relEcc, 1e-9)} | ${fl(r.planeDrift, 1e-12)} |`);
  }
  if (J.N) {
    out.push('', '| 配置(太陽・木星・土星) | 步 | 1PN の有無の差(木星・土星)[km] | Σm·v の変化(geoPN=1) | EIH の 1PN の運動量の変化(geoPN=1) | Σm·v の変化(geoPN=0) |', '|---|---|---|---|---|---|');
    for (const r of J.N.rows) out.push(`| ${CONF_JA[r.conf]} | ${r.steps} | ${r.pn1DiffKm.slice(1).map((d) => d.toFixed(2)).join('・')} | ${e2s(r.dPNewton1)} | ${e2s(r.dP1PN1)} | ${fl(r.dPNewton0, 1e-14)} |`);
    out.push('', '| 積分器(傾けた写し・geoPN=1) | 刻み | 步 | EIH の 1PN の運動量の変化 |', '|---|---|---|---|');
    for (const r of J.N.hScan) out.push(`| ${r.integrator} | h/${r.hDiv} | ${r.steps} | ${e3s(r.dP1PN)} |`);
    out.push('', '| 積分器 | 変化の比 h/(h/2) | 変化の比 (h/2)/(h/4) |', '|---|---|---|');
    for (const k of ['leapfrog', 'semi']) out.push(`| ${k} | ${f3(J.N.hOrder[k].r12)} | ${f3(J.N.hOrder[k].r24)} |`);
  }
  if (J.X) {
    const X = J.X;
    out.push('', '| 16 体の写し(人工の配置) | 受理 | 20 步の有限 | 源 | 所要の步 |', '|---|---|---|---|---|');
    for (const [k, nm] of [['g1', 'geoPN=1(EIH の 1PN)'], ['g0', 'geoPN=0(ニュートン)'], ['g3', 'geoPN=3(K1 + rdRule:"kappaM")']]) { const r = X.rows[k];
      out.push(`| ${nm} | ${r.ok ? '受理' : '拒否'} | ${r.finite ? '有限' : '違う'} | ${k === 'g1' && r.pn1 ? r.pn1.sources + (r.pn1.wide ? '(詰め替え版)' : '') : '—'} | ${r.cost ? r.cost.steps : '—'} |`); }
    out.push('', '| 照合(16 体と小さな写し) | 値 |', '|---|---|');
    out.push(`| 詰め替え版 Δ₃ と素の Δ₃(16 体・源 ${X.wide.sources}) | ${X.wide.bitSame ? 'ビット同一' : '違う'} |`);
    for (const r of X.oracle) out.push(`| 独立に書いた EIH の 3 成分との差(${r.label}) | ${fl(r.rel, 1e-14)} |`);
    out.push(`| 加速度の回転の共変(16 体 —— 向き ${X.covAcc.rot.join(', ')}・丸めの尺度 ${e2s(X.covAcc.roundFloor)}) | ${fl(X.covAcc.rel, 1e-12)} |`);
    out.push(`| 加速度の回転の共変(太陽・木星・土星の傾けた写し —— 同じ向き) | ${fl(X.covAcc.relSJS, 1e-14)} |`);
    out.push(`| 核の中の試験粒子形₃ と単独の版(二体・回した軌道) | ${X.coreInline.bitSame ? 'ビット同一' : '違う'} |`);
  }
  return out.join('\n');
}
export function docNumbers(J) {
  const out = [];
  if (J.P) { const r2 = J.P.rows.find((r) => r.variant === 'free' && r.hDiv === 2); if (r2) out.push(f4(r2.inc3dCy), f4(r2.q1pnCy)); }
  if (J.A) out.push(String(J.A.switch2dGeoPN1.switchable.length));
  return out;
}

export function runAll(H, o = {}) {
  const quick = !!o.quick, stages = o.stages || ['A', 'P', 'R', 'N', 'X'], t = {};
  let t0 = Date.now();
  const tick = (k) => { t[k] = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now(); };
  const J = { quick, stages };
  if (stages.includes('A')) { J.A = partA(H); tick('A'); }
  if (stages.includes('P')) { J.P = partP(H, quick); tick('P'); }
  if (stages.includes('R')) { J.R = partR(H, quick); tick('R'); }
  if (stages.includes('N')) { J.N = partN(H, quick); tick('N'); }
  if (stages.includes('X')) { J.X = partX(H, quick); tick('X'); }
  J.gates = gatesOf(J);
  J.ok = Object.values(J.gates).every(Boolean);
  J.timing = t;
  return J;
}

// 鍵と読み口を読む既存の器・QA(第314便d の枝で列挙して走らせた —— 報告に結果)
export const VERSION_READERS = [
  { file: 'tests/exp-w298a-coord3d.mjs・正本 coord3d-w298a.json', reads: '受理の門 coord3dDenyOf の拒否の表(鍵 geoPN12 の行は geoPN=1 を宣言して拒否を期待)', handling: '行の宣言を geoPN=2 へ(geoPN12 の鍵は 2 を今のまま拒否 —— 両方の世代で同じ行・正本の値は変わらない)' },
  { file: 'tests/qa.mjs ui.paramTab299', reads: '二次元→三次元の切り替えられる在位の本(coordSwitchPlanOf から導く)と零試験(300 步・ビット同一)', handling: '変えない(geoPN=1 の在位の二次元の本 6 本が切り替えられるようになる —— 零試験はビット同一〔器の段 P・A〕)' },
  { file: 'tests/exp-w285b-pn1.mjs・exp-w291b-pnsources.mjs・exp-w291b-retiredfx.mjs', reads: '二次元の dfmPN1Delta・dfmPN1EIHKick・geoCoreDispatch', handling: '変わらない(二次元の関数は 1 文字も変えない —— 試走で正本と照合)' },
];

export async function main() {
  const TARGET = process.env.W314D_TARGET || 'beta/index.html';
  const OUT = process.env.W314D_OUT || path.join(ROOT, 'tests', 'out', 'pn1x3d-w314d.json');
  const quick = process.env.W314D_QUICK === '1', stages = process.env.W314D_STAGES ? process.env.W314D_STAGES.split(',') : undefined;
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now();
  const W281A_SCOPE = w281aScopeStamp(html, REGEN_SCOPE);
  const H = loadHtmlHeadless(html);
  const R = runAll(H, { quick, stages });
  const out = { version: HARNESS_VERSION, generator: 'tests/exp-w314d-pn1x3d.mjs', target: TARGET,
    targetSha256: crypto.createHash('sha256').update(fs.readFileSync(html)).digest('hex'),
    ruling: '原仮定者の裁定(第116報)の補足 —— 太陽と全惑星とトリトン以上の 7 大衛星を 1 つにまとめた三次元サンプルの対照に geoPN=1 と geoPN=3 の両方・統括の検証項目 R241',
    coord3dPn1Version: E(H, 'COORD3D_PN1_VERSION'), pn1EihVersion: E(H, 'PN1_EIH_VERSION'), coord3dVersion: E(H, 'COORD3D_VERSION'),
    rots: ROTS, tol: TOL, k1Drag: K1_DRAG, versionReaders: VERSION_READERS, notClaim: NOT_CLAIM, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w314d-pn1x3d.mjs', 'tests/lib-w300c-solar16.mjs', 'tests/lib-w302a-wbg.mjs', 'tests/lib-w311c-h4carry.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第314便d', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION,
    engine: 'Node の headless(tests/lib-w279b-headless.mjs の loadHtmlHeadless —— html の本文をそのまま実行・1 プロセス)',
    notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  // 走行の S は正本に書かない(状態の写しを JSON にしない)
  const strip = (o) => JSON.parse(JSON.stringify(o, (k, v) => (k === 'S' ? undefined : v)));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(strip(out), null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s', JSON.stringify(out.timing));
}
if (IS_MAIN) await main();
