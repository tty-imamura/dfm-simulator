// 第290便c(原仮定者の裁定(第80報)⑥「引きずりの計算が新しくなる。この計算の実装精度は大変重要」・統括の検証項目 R127)——
// **慣性引きずり(法則版 physics.relativeDrag.law:"inertial")の門と診断本 🐌 の器**(Node だけ —— 対象 html の inline script を
// tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、エンジン本体を走らせる)。
//
// ■ 何を測るか
//   門(ビット同一と契約):
//     (a) 宣言なし → 既存の本が基点とビット同一 —— 基点 html が要るので本器ではなく tests/exp-w258c-bitsame.mjs・exp-w272d-sigsame.mjs で示す(正本に載せない)。
//     (b) gain:0 を宣言した本は宣言なしと**全標本ビット同一**(位置・速度・自転 —— 🐌 と既存 3 本に gain:0 を足した写し)。
//     (c) 固定配置(5 体・うち 2 体は pinned の支持体)に規定の V を座標の履歴として与え、エンジンの 1 步の u・次数が第289便c の純関数
//         relDragAt と**ビット同一**(同じ核・同じ ε・同じ和の順序)。pinned は u=0・位置は x+u·dt・v は 1 bit も動かない。
//     (d) Δt を半分にしても固定配置の u が同じ(V を差分/Δt で作る契約の検査 —— 2 の冪の刻みでビット同一・0.016/0.008 でも相対 1e-12)。
//     (e) 2 体の前ステップ参照(G=0・a=0.2/0.5/0.8)をエンジンで再現: V の列が閉じた漸化式 V_n = v − 2aV_{n−1} と一致・上界の値と
//         「上界 ≥ 1 の步」の数・収束/振動/発散の判定。発散は clamp せず発散として残す。同じ物理時間で dt を半分にした対照。
//     (f) 自己項 0(1 体で u=0 —— 宣言なしとビット同一)・共通並進不変(V に共通の W を足しても u が同じ)・ε=0 でも有限。
//   診断本 🐌 inertialDragPair:
//     (i) gain:0 の対照とビット同一(門 b)(ii) 近点移動 Δϖ/周を gain 0.4/0.8/1.6 で測り、同じ dt の gain:0 の対照を引いた値を
//     限定模型(lib-w290c-inertial の RK4 —— ẋ=v/(1+a)・同じ初期値・同じ軟化)と解析 2π(√((1+a)/(1−2a))−1)・3πa と並べる
//     (iii) 上界と発散の有無 (iv) E と L_z の変化と帳簿(外部支持の仕事 S.inertialDragWork・移送の ΔL S.inertialDragDL)
//     (v) dt を半分にしたとき Δϖ が収束するか。
//
// ■ しないこと・言わないこと
//   ・C_d を観測・1PN・月 8.85 年に合わせない。発散を clamp しない。既存の q 付き場・u=A/W・E6′・pairSlip に足さない。
//   ・「1PN と同等が証明された」「回転引きずりが創発した」「連鎖で円盤ができた」「慣性決定力場を接続した(既定で)」「安定化した」と書かない。
//
// 実行(Node だけ・Chromium 不要): node tests/exp-w290c-inertial.mjs
// 読む正本: なし。正本: tests/out/inertial-w290c.json(target = beta/index.html —— 領域 REGEN_SCOPE)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as RD from './lib-w289c-reldrag.mjs';
import * as LI from './lib-w290c-inertial.mjs';
const REGEN_SCOPE = {"presets":["boxBinaryToy","compactForceToy","earthMoonFree","inertialDragPair"],"roots":["$","HP.REL_DRAG_INERTIAL_VERSION","HP.allPresets","HP.ckRestoreOne","HP.ckSnapOne","HP.cloneSimStateNow","HP.dfmInertialDragStep","HP.dfmMeshVelocityFieldAt","HP.inertialDragEpoch","HP.inertialDragState","HP.loadPreset","HP.sim","HP.validatePreset","T","cw","sim","validatePreset"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w290c-inertial-1';
export const DIAG_ID = 'inertialDragPair';
export const GATE_B_IDS = Object.freeze([DIAG_ID, 'earthMoonFree', 'compactForceToy', 'boxBinaryToy']);
export const GATE_B = Object.freeze({ steps: 600, every: 100, dt: 0.016 });
export const DIAG = Object.freeze({ gains: [0, 0.4, 0.8, 1.6], dt: 0.016, dtHalf: 0.008, halfGains: [0, 0.8], K: 5, maxOrbits: 8 });
export const TWO = Object.freeze({ m: 1, r: 4, eps: 0.5, vRel: 1, dt: 1e-6, updates: 20, couplings: [0.2, 0.5, 0.8] });
export const TWO_DT = Object.freeze({ a: 0.8, vRel: 1e-4, T: 2e-5, dts: [1e-6, 5e-7] });
const clone = (x) => JSON.parse(JSON.stringify(x));
const find = (HP, id) => HP.allPresets().find((q) => q.id === id);
function build(HP, preset) {
  const v = HP.validatePreset(clone(preset));
  if (!v.ok) throw new Error('validatePreset: ' + JSON.stringify(v.errors).slice(0, 300));
  HP.sim.build(v.preset);
  return HP.sim;
}
const toyPhysics = (extra) => Object.assign({ G: 0, D0: 2, kFrame: 0, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, kappaT: 0.0001, cLight: 30, bM: 1, etaRad: 0, pRad: 4,
  gravityX: 0, gravityY: 0, geoPN: 0, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 0.5, stateCarry: 'double', massPrecision: 'double' }, extra || {});
const toyPreset = (bodies, phys) => ({ id: 'w290cToy', name: 'w290c toy', description: '器の中の写し(内蔵ではない)', emoji: '·', group: '運動と時空',
  sampleClass: 'principle', fidelity: 'toy', camera: { scale: 50 }, world: { boundary: 'none', size: 0 }, physics: toyPhysics(phys), bodies });

/* ── (b) gain:0 と宣言なしのビット同一 ─────────────────────────────────── */
function snap(S) { const o = []; for (let i = 0; i < S.n; i++) o.push(S.x[i], S.y[i], S.vx[i], S.vy[i], S.spin[i]); o.push(S.t, S.n); return o; }
export function gateB(HP) {
  const rows = [];
  for (const id of GATE_B_IDS) {
    const p0 = clone(find(HP, id));
    const pa = clone(p0), pb = clone(p0);
    if (pa.physics) delete pa.physics.relativeDrag;
    pb.physics = Object.assign({}, pb.physics || {}, { relativeDrag: { law: 'inertial', gain: 0, pairs: 'all', history: 'positions' } });
    const sample = (preset) => { const S = build(HP, preset), out = [snap(S)]; for (let k = 1; k <= GATE_B.steps; k++) { S.step(GATE_B.dt); if (k % GATE_B.every === 0) out.push(snap(S)); }
      const st = HP.inertialDragState(S); return { out, st, spinPrec: S.spin.constructor.name }; };
    const A = sample(pa), B = sample(pb);
    let nVal = 0, nSame = 0, firstDiff = null;
    A.out.forEach((a, k) => a.forEach((v, j) => { nVal++; if (Object.is(v, B.out[k][j])) nSame++; else if (firstDiff === null) firstDiff = { sample: k, index: j }; }));
    rows.push({ id, samples: A.out.length, values: nVal, same: nSame, allSame: nSame === nVal, firstDiff, spinPrecUndeclared: A.spinPrec, spinPrecGain0: B.spinPrec,
      gain0Steps: B.st ? B.st.steps : null, gain0NoHistory: B.st ? B.st.noHistory : null, gain0UMax: B.st ? B.st.uMax : null });
  }
  return { decl: GATE_B, rows, ok: rows.every((r) => r.allSame && r.gain0UMax === 0 && r.gain0NoHistory === 1) };
}

/* ── (c)(d)(f) 固定配置への注入(1 步だけ・エンジンの関数そのもの)──────────── */
const FIX = Object.freeze({ m: [1, 2.5, 0.75, 4, 1.5], x: [0, 3, -2.5, 1.25, 6], y: [0, 1, 2, -4, -1.5],
  V: [[0.5, -0.25], [1.75, 0.5], [-1, 0.75], [0.25, 1.25], [-0.5, -1.5]], gain: 0.75, eps: 0.5, pinned: [1, 4], t: 8 });
function inject(HP, o) {
  const bodies = o.m.map((m, i) => ({ type: 'single', m, radius: 0.1, x: o.x[i], y: o.y[i], vx: 0.125 * i, vy: -0.0625 * i, spin: 0, pinned: (o.pinned || []).includes(i) }));
  const S = build(HP, toyPreset(bodies, { relativeDrag: Object.assign({ law: 'inertial', gain: o.gain }, (o.eps === undefined) ? {} : { eps: o.eps }) }));
  for (let i = 0; i < S.n; i++) { S.x[i] = o.x[i]; S.y[i] = o.y[i]; S.rdPrevX[i] = o.x[i] - o.V[i][0] * o.dt; S.rdPrevY[i] = o.y[i] - o.V[i][1] * o.dt; S.rdPrevT[i] = o.t - o.dt; }
  S.t = o.t; S.rdEpoch = HP.inertialDragEpoch(S);
  const v0 = Array.from(S.vx.slice(0, S.n)).concat(Array.from(S.vy.slice(0, S.n)));
  const ret = HP.dfmInertialDragStep(S, o.dt);
  const n = S.n, u = [], V = [], deg = [];
  for (let i = 0; i < n; i++) { u.push([S._rdUX[i], S._rdUY[i]]); V.push([S._rdVX[i], S._rdVY[i]]); deg.push(S._rdDeg[i]); }
  const v1 = Array.from(S.vx.slice(0, S.n)).concat(Array.from(S.vy.slice(0, S.n)));
  return { S, ret, u, V, deg, x: Array.from(S.x.slice(0, n)), y: Array.from(S.y.slice(0, n)), vUnchanged: v0.every((z, k) => Object.is(z, v1[k])) };
}
const bitVec = (A, B) => A.length === B.length && A.every((z, i) => Object.is(z[0], B[i][0]) && Object.is(z[1], B[i][1]));
const relVec = (A, B) => { let num = 0, den = 0; for (let i = 0; i < A.length; i++) for (let k = 0; k < 2; k++) { num = Math.max(num, Math.abs(A[i][k] - B[i][k])); den = Math.max(den, Math.abs(B[i][k])); } return num / Math.max(den, 1e-300); };
export function gateC(HP) {
  const dt = 1 / 64, E = inject(HP, Object.assign({}, FIX, { dt }));
  const pin = FIX.pinned;
  const Vexact = bitVec(E.V, FIX.V);
  const L = RD.relDragAt({ m: FIX.m, x: FIX.x, y: FIX.y, prevMove: E.V, gain: FIX.gain, eps: FIX.eps });
  const free = FIX.m.map((_, i) => i).filter((i) => !pin.includes(i));
  const uSame = free.every((i) => Object.is(E.u[i][0], L.u[i][0]) && Object.is(E.u[i][1], L.u[i][1]));
  const degSame = FIX.m.every((_, i) => Object.is(E.deg[i], L.degree[i]));
  const pinZero = pin.every((i) => E.u[i][0] === 0 && E.u[i][1] === 0);
  const pinStill = pin.every((i) => E.x[i] === FIX.x[i] && E.y[i] === FIX.y[i]);
  const moved = free.every((i) => Object.is(E.x[i], FIX.x[i] + L.u[i][0] * dt) && Object.is(E.y[i], FIX.y[i] + L.u[i][1] * dt));
  let degFree = 0; for (const i of free) degFree = Math.max(degFree, Math.abs(L.degree[i]));
  const boundSame = Object.is(E.ret.bound, 2 * degFree);
  return { decl: FIX, dt, Vexact, uSameFree: uSame, degSame, pinnedZero: pinZero, pinnedStill: pinStill, positionsXplusUdt: moved, vUnchanged: E.vUnchanged,
    bound: E.ret.bound, libBoundAll: L.spectralBound, boundSameFree: boundSame, u: E.u, hist: E.ret.hist,
    ok: Vexact && uSame && degSame && pinZero && pinStill && moved && E.vUnchanged && boundSame && E.ret.hist === true };
}
export function gateD(HP) {
  const rows = [];
  for (const pair of [[1 / 64, 1 / 128], [0.016, 0.008]]) {
    const A = inject(HP, Object.assign({}, FIX, { dt: pair[0] })), B = inject(HP, Object.assign({}, FIX, { dt: pair[1] }));
    rows.push({ dts: pair, bitSame: bitVec(A.u, B.u), relMax: relVec(A.u, B.u), Vrel: relVec(A.V, FIX.V) });
  }
  return { rows, ok: rows[0].bitSame && rows[1].relMax <= 1e-12 };
}
export function gateF(HP) {
  // 1 体: u=0(自己項を計算しない)・宣言なしとビット同一(10 步)
  const one = (rd) => { const S = build(HP, toyPreset([{ type: 'single', m: 2, radius: 0.1, x: 1, y: 1, vx: 3, vy: 4, spin: 0, pinned: false }], Object.assign({ G: 1 }, rd ? { relativeDrag: rd } : {})));
    for (let k = 0; k < 10; k++) S.step(0.016); return { s: snap(S), st: HP.inertialDragState(S) }; };
  const a = one(null), b = one({ law: 'inertial', gain: 1 });
  const single = { uMax: b.st.uMax, degMax: b.st.degMax, sameAsUndeclared: a.s.every((v, k) => Object.is(v, b.s[k])), ok: b.st.uMax === 0 && b.st.degMax === 0 && a.s.every((v, k) => Object.is(v, b.s[k])) };
  // 共通並進: V → V + W(2 の冪の値 —— ビット同一も見る)
  const W = [0.375, -2.125], dt = 1 / 64;
  const base = inject(HP, Object.assign({}, FIX, { dt, pinned: [] })), tr = inject(HP, Object.assign({}, FIX, { dt, pinned: [], V: FIX.V.map((z) => [z[0] + W[0], z[1] + W[1]]) }));
  const translation = { W, bitSame: bitVec(base.u, tr.u), relMax: relVec(tr.u, base.u) };
  translation.ok = translation.relMax <= 1e-12;
  // ε=0 でも有限(自己項 m/0³ を足していない)
  const e0 = inject(HP, Object.assign({}, FIX, { dt, eps: 0, pinned: [] }));
  const eps0 = { finite: e0.u.every((z) => Number.isFinite(z[0]) && Number.isFinite(z[1])), hist: e0.ret.hist };
  eps0.ok = eps0.finite && eps0.hist === true;
  // 一致点は拒否(状態は動かさず u=0・拒否を数える)
  const co = inject(HP, { m: [1, 1, 1], x: [0, 1, 1], y: [0, 2, 2], V: [[0, 0], [1, 0], [0, 1]], gain: 0.75, eps: 0.5, pinned: [], t: 8, dt });
  const coincident = { reject: co.ret.reject, unmoved: co.x.join(',') === '0,1,1' && co.y.join(',') === '0,2,2', ok: co.ret.reject === 'coincident' && co.x.join(',') === '0,1,1' };
  // チェックポイントの復元と A/B の複製((vi)(viii)): 履歴の配列(rdPrevX/Y/T)を同じ瞬間へ運ぶので、続きは中断なしとビット同一。
  //   stateCarry:"double" の本は**宣言の有無に依らず**復元・複製が最下位で食い違う(基点からある既存の欠落 —— 速度の補償和の
  //   繰越がチェックポイントに載らない。本便では直さない —— 第290便d の棚卸しの範囲)。門は stateCarry を外した 🐌 の写し(legacy)で取り、
  //   double の食い違いは宣言あり/なしの両方を記録だけする(新経路が足した欠落ではないことの対照)
//   統合後(第290便d が carVx/carVy を CK_ARRS に足した)は double でも restoreSame/cloneSame が true になる(記録の欄は同じ —— 正本は鎖で更新)
  const fp = (S) => (HP.inertialDragState(S) ? snap(S).concat([S.inertialDragWork, S.inertialDragDL, S.inertialDragN]) : snap(S));   // 帳簿は宣言した本だけ(未宣言の sim に前の build の残りの欄があっても読まない)
  // 複製(cloneSimState)は currentPreset から B を build するので、内蔵の 🐌 の physics を一時だけ差し替えて loadPreset する(finally で元の参照へ戻す)
  const ckRun = (mut) => {
    const P = find(HP, DIAG_ID), orig = P.physics, q = clone(P); mut(q);
    P.physics = q.physics;
    let S0;
    try { HP.loadPreset(DIAG_ID, false); S0 = HP.sim; return ckBody(S0); } finally { P.physics = orig; }
  };
  const ckBody = (S0) => {
    for (let k = 0; k < 300; k++) S0.step(0.016);
    const ck = HP.ckSnapOne(S0), B = HP.cloneSimStateNow();
    for (let k = 0; k < 300; k++) { S0.step(0.016); B.step(0.016); }
    const ref = fp(S0), cl = fp(B);
    HP.ckRestoreOne(S0, ck);
    for (let k = 0; k < 300; k++) S0.step(0.016);
    const rs = fp(S0);
    return { restoreSame: ref.every((v, k) => Object.is(v, rs[k])), cloneSame: ref.every((v, k) => Object.is(v, cl[k])), values: ref.length,
      inertialSteps: HP.inertialDragState(S0) ? S0.inertialDragN : null, noHistory: HP.inertialDragState(S0) ? S0.inertialDragNoHist : null };
  };
  const checkpoint = ckRun((p) => { delete p.physics.stateCarry; });
  checkpoint.stateCarry = 'legacy(🐌 の写し —— stateCarry を外す)';
  checkpoint.ok = checkpoint.restoreSame && checkpoint.cloneSame && checkpoint.noHistory === 1;
  const ckUndecl = ckRun((p) => { delete p.physics.stateCarry; delete p.physics.relativeDrag; });
  checkpoint.undeclaredLegacy = { restoreSame: ckUndecl.restoreSame, cloneSame: ckUndecl.cloneSame };
  const dD = ckRun(() => {}), dU = ckRun((p) => { delete p.physics.relativeDrag; });
  checkpoint.stateCarryDouble = { declared: { restoreSame: dD.restoreSame, cloneSame: dD.cloneSame }, undeclared: { restoreSame: dU.restoreSame, cloneSame: dU.cloneSame },
    note: '基点からある既存の欠落(宣言の有無に依らない)—— 門に使わない' };
  return { single, translation, eps0, coincident, checkpoint, ok: single.ok && translation.ok && eps0.ok && coincident.ok && checkpoint.ok };
}

/* ── (e) 2 体の前ステップ参照をエンジンで ─────────────────────────────── */
function twoBodyEngine(HP, a, o) {
  const k = RD.kernelK(o.r, o.eps), C = a / (o.m * k);
  const bodies = [{ type: 'single', m: o.m, radius: 0.1, x: 0, y: -o.r / 2, vx: o.vRel / 2, vy: 0, spin: 0, pinned: false },
    { type: 'single', m: o.m, radius: 0.1, x: 0, y: o.r / 2, vx: -o.vRel / 2, vy: 0, spin: 0, pinned: false }];
  const S = build(HP, toyPreset(bodies, { softening: o.eps, relativeDrag: { law: 'inertial', gain: C, eps: o.eps } }));
  const seq = [], bounds = [];
  const total = o.updates + 2;   // 步 1 は履歴なし(u=0)・步 2 で V=v —— 步 2..updates+2 の V が漸化式の V_0..V_updates
  for (let s = 1; s <= total; s++) {
    S.step(o.dt);
    bounds.push(S.inertialDragBound);
    if (s >= 2) seq.push(S._rdVX[0] - S._rdVX[1]);
  }
  return { C, seq, bounds, st: HP.inertialDragState(S) };
}
export function gateE(HP) {
  const rows = TWO.couplings.map((a) => {
    const E = twoBodyEngine(HP, a, TWO);
    const lib = RD.twoBody(a, { m: TWO.m, r: TWO.r, eps: TWO.eps, vRel: TWO.vRel, steps: TWO.updates, couplings: TWO.couplings });
    // 相対差の分母は max(|閉じた式|, v_rel)(a=0.5 の列は 1/0 を交互に取る —— 0 で割らない)
    let relMax = 0; for (let n = 0; n <= TWO.updates; n++) relMax = Math.max(relMax, Math.abs(E.seq[n] - lib.seq[n]) / Math.max(Math.abs(lib.seq[n]), TWO.vRel));
    const fp = TWO.vRel / (1 + 2 * a), devRatio = Math.abs(E.seq[TWO.updates] - fp) / Math.abs(E.seq[0] - fp);
    const regime = devRatio < 1e-3 ? 'converge' : devRatio > 1e3 ? 'diverge' : 'oscillate';
    const bMax = Math.max(...E.bounds), bMin = Math.min(...E.bounds);
    return { a, twoA: 2 * a, gain: E.C, libBound: lib.spectralBound, boundMax: bMax, boundMin: bMin, boundRelToLib: Math.abs(bMax - lib.spectralBound) / lib.spectralBound,
      boundOverSteps: E.st.boundOver, steps: E.bounds.length, seqFirst: E.seq[0], seqLast: E.seq[TWO.updates], libLast: lib.seq[TWO.updates], recurrenceRelMax: relMax,
      devRatio, libDevRatio: lib.devRatio, regime, libRegime: lib.regime, uMax: E.st.uMax, noHistory: E.st.noHistory };
  });
  const dtRows = TWO_DT.dts.map((dt) => {
    const updates = Math.round(TWO_DT.T / dt);
    const E = twoBodyEngine(HP, TWO_DT.a, Object.assign({}, TWO, { vRel: TWO_DT.vRel, dt, updates }));
    const fp = TWO_DT.vRel / (1 + 2 * TWO_DT.a);
    return { dt, updates, growth: Math.abs(E.seq[updates] - fp) / Math.abs(E.seq[0] - fp), boundOverSteps: E.st.boundOver, boundMax: Math.max(...E.bounds) };
  });
  const want = { 0.2: 'converge', 0.5: 'oscillate', 0.8: 'diverge' };
  const ok = rows.every((r) => r.regime === want[r.a] && r.recurrenceRelMax <= 1e-5 && r.boundRelToLib <= 1e-4 && r.noHistory === 1)
    && rows.find((r) => r.a === 0.2).boundOverSteps === 0 && rows.find((r) => r.a === 0.8).boundOverSteps === rows.find((r) => r.a === 0.8).steps
    && dtRows.every((z) => z.growth > 1) && dtRows[1].growth > dtRows[0].growth;
  return { decl: TWO, rows, dt: { decl: TWO_DT, rows: dtRows }, ok,
    note: 'G=0・等質量・離角 4(y 方向)・相対速度 v_rel を x 方向(離角に垂直 —— 幾何の変化は 2 次)。a=0.5(2a=1)は境界: 幾何がわずかに動くので上界は 1 の直下(boundMin〜boundMax)' };
}

/* ── 診断本 🐌 ───────────────────────────────────────────────────── */
function diagRun(HP, gain, dt) {
  const p = clone(find(HP, DIAG_ID));
  p.physics.relativeDrag = Object.assign({}, p.physics.relativeDrag, { gain });
  const S = build(HP, p), G = S.params.G, eg = S.params.softening;
  const E = () => { const dx = S.x[1] - S.x[0], dy = S.y[1] - S.y[0]; let k = 0; for (let i = 0; i < S.n; i++) k += 0.5 * S.m[i] * (S.vx[i] * S.vx[i] + S.vy[i] * S.vy[i]);
    return k - G * S.mEff[0] * S.mEff[1] / Math.sqrt(dx * dx + dy * dy + eg * eg); };
  const Lz = () => { let l = 0; for (let i = 0; i < S.n; i++) l += S.m[i] * (S.x[i] * S.vy[i] - S.y[i] * S.vx[i]); return l; };
  const Pv = () => { let px = 0, py = 0; for (let i = 0; i < S.n; i++) { px += S.m[i] * S.vx[i]; py += S.m[i] * S.vy[i]; } return [px, py]; };
  const E0 = E(), L0 = Lz(), P0 = Pv();
  const tr = LI.periTracker();
  const Torb = 2 * Math.PI * Math.sqrt(20 * 20 * 20 / (G * 11)), maxSteps = Math.ceil(DIAG.maxOrbits * Torb / dt);
  let closureMax = 0, eMaxAbs = 0, steps = 0;
  const periClosure = [];
  for (; steps < maxSteps && tr.peri.length < DIAG.K + 1; steps++) {
    S.step(dt);
    const np = tr.peri.length;
    tr.push(S.t, S.x[1] - S.x[0], S.y[1] - S.y[0], S.vx[1] - S.vx[0], S.vy[1] - S.vy[0]);
    const W = S.inertialDragWork, dE = E() - E0;
    closureMax = Math.max(closureMax, Math.abs(dE - W)); eMaxAbs = Math.max(eMaxAbs, Math.abs(dE));
    if (tr.peri.length > np) periClosure.push(dE - W);
  }
  const st = HP.inertialDragState(S), P1 = Pv();
  const dE = E() - E0, dL = Lz() - L0;
  return { gain, dt, steps, t: S.t, nPeri: tr.peri.length, dw: tr.dw(DIAG.K), period: tr.period(DIAG.K),
    boundMax: st.boundMax, boundOverSteps: st.boundOver, noHistory: st.noHistory, reject: st.reject, uMax: st.uMax,
    ledger: { dE, work: st.work, closureEnd: dE - st.work, closureMax, dEMaxAbs: eMaxAbs, closureAtPeri: periClosure,
      dL, dLbooked: st.dL, closureL: dL - st.dL, dP: [P1[0] - P0[0], P1[1] - P0[1]], sumMu: st.sumMu, sumMxU: st.sumMxU } };
}
export function diagnostic(HP) {
  const p = find(HP, DIAG_ID), M = p.bodies.reduce((s, b) => s + b.m, 0), eps = p.physics.softening, r0 = 20;
  const vc = Math.sqrt(p.physics.G * M / r0);
  const rk = (g) => LI.limitedModel({ GM: p.physics.G * M, CdM: g * M, eps, soft: eps, x0: [r0, 0], v0: [0.01 * vc, vc], K: DIAG.K, perOrbit: 20000 });
  const rk0 = rk(0);
  const runs = DIAG.gains.map((g) => diagRun(HP, g, DIAG.dt));
  const ctrl = runs.find((r) => r.gain === 0);
  const rows = runs.filter((r) => r.gain > 0).map((r) => {
    const m = rk(r.gain), net = r.dw - ctrl.dw, rkNet = m.dw - rk0.dw;
    return { gain: r.gain, a: m.a0, dwEngine: r.dw, dwControl: ctrl.dw, dwNet: net, dwModel: m.dw, dwModelNet: rkNet, diffModel: net - rkNet,
      relDiffModel: (net - rkNet) / rkNet, analytic: m.analytic, approx3pia: m.approx3pia, relToAnalytic: (net - m.analytic) / m.analytic, boundMax: r.boundMax };
  });
  const half = DIAG.halfGains.map((g) => diagRun(HP, g, DIAG.dtHalf));
  const h0 = half.find((r) => r.gain === 0), h8 = half.find((r) => r.gain === 0.8), f8 = rows.find((r) => r.gain === 0.8);
  const dtHalf = { gain: 0.8, dwNetFull: f8.dwNet, dwNetHalf: h8.dw - h0.dw, relChange: ((h8.dw - h0.dw) - f8.dwNet) / f8.dwNet,
    diffModelFull: f8.diffModel, diffModelHalf: (h8.dw - h0.dw) - f8.dwModelNet, ratio: ((h8.dw - h0.dw) - f8.dwModelNet) / f8.diffModel };
  const okRuns = runs.concat(half).every((r) => r.nPeri === DIAG.K + 1 && r.boundOverSteps === 0 && r.reject === 0 && r.noHistory === 1 && Math.abs(r.ledger.closureL) <= 1e-12);
  const ok = okRuns && rows.every((r) => Math.abs(r.relDiffModel) <= 1e-2) && Math.abs(dtHalf.relChange) <= 1e-2;
  return { decl: { id: DIAG_ID, M, r0, eps, vc, gainDeclared: p.physics.relativeDrag.gain, K: DIAG.K, dt: DIAG.dt, dtHalf: DIAG.dtHalf },
    model0: { dw: rk0.dw }, runs, rows, half, dtHalf, ok };
}

export function computeAll(HP) {
  return { selfTest: LI.selfTest(), gateB: gateB(HP), gateC: gateC(HP), gateD: gateD(HP), gateE: gateE(HP), gateF: gateF(HP), diag: diagnostic(HP) };
}
const f3 = (x) => (x === null || x === undefined) ? '—' : (x === 0 ? '0' : Number(x).toExponential(2));
const f4 = (x) => (x === null || x === undefined) ? '—' : Number(x).toFixed(4);
const f6 = (x) => (x === null || x === undefined) ? '—' : Number(x).toFixed(6);
const REG = { converge: '収束', oscillate: '振動', diverge: '発散' };
/** PHYSICS〔第290便c〕の表の行(QA が照合する)。 */
export function docRows(J) {
  const out = { gateB: [], gateE: [], diag: [], ledger: [] };
  for (const r of J.gateB.rows) out.gateB.push(`| ${r.id} | ${r.samples} | ${r.same}/${r.values} | ${r.spinPrecUndeclared}/${r.spinPrecGain0} |`);
  for (const r of J.gateE.rows) out.gateE.push(`| ${r.a} | ${f4(r.libBound)} | ${f6(r.boundMin)}〜${f6(r.boundMax)} | ${r.boundOverSteps}/${r.steps} | ${f3(r.recurrenceRelMax)} | ${f3(r.devRatio)} | ${REG[r.regime]} |`);
  for (const r of J.diag.rows) out.diag.push(`| ${r.gain} | ${f6(r.a)} | ${f6(r.dwNet)} | ${f6(r.dwModelNet)} | ${f3(r.diffModel)} | ${f6(r.analytic)} | ${f6(r.approx3pia)} | ${f4(r.boundMax)} |`);
  for (const r of J.diag.runs.concat(J.diag.half)) out.ledger.push(`| ${r.gain} | ${r.dt} | ${f3(r.ledger.dE)} | ${f3(r.ledger.work)} | ${f3(r.ledger.closureEnd)} | ${f3(r.ledger.closureMax)} | ${f3(r.ledger.closureL)} |`);
  return out;
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) {
  const TARGET = process.env.QA_TARGET || 'beta/index.html';
  const OUT_PATH = process.env.W290C_INERTIAL_OUT || path.join(ROOT, 'tests', 'out', 'inertial-w290c.json');
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const t0 = Date.now();
  const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
  const R = computeAll(HP);
  console.log(`単体 ${R.selfTest.ok}`);
  for (const r of R.gateB.rows) console.log(`(b) ${r.id}: ${r.same}/${r.values}(標本 ${r.samples})・自転 ${r.spinPrecUndeclared}/${r.spinPrecGain0}・gain0 の步 ${r.gain0Steps}・履歴なし ${r.gain0NoHistory}`);
  const C = R.gateC; console.log(`(c) V 正確 ${C.Vexact}・u(自由)ビット同一 ${C.uSameFree}・次数 ${C.degSame}・pinned 0 ${C.pinnedZero}・x+u·dt ${C.positionsXplusUdt}・v 不変 ${C.vUnchanged}・上界 ${C.bound} → ${C.ok}`);
  for (const r of R.gateD.rows) console.log(`(d) dt ${r.dts}: ビット同一 ${r.bitSame}・相対 ${f3(r.relMax)}`);
  for (const r of R.gateE.rows) console.log(`(e) a=${r.a}: 上界 ${f6(r.boundMin)}〜${f6(r.boundMax)}(純関数 ${r.libBound})・≥1 の步 ${r.boundOverSteps}/${r.steps}・漸化式との差 ${f3(r.recurrenceRelMax)}・ずれ比 ${f3(r.devRatio)} ${r.regime}`);
  for (const r of R.gateE.dt.rows) console.log(`(e) dt ${r.dt}: 更新 ${r.updates}・ずれ比 ${f3(r.growth)}`);
  const F = R.gateF; console.log(`(f) 1 体 ${F.single.ok}・並進 ${f3(F.translation.relMax)}(ビット ${F.translation.bitSame})・ε=0 有限 ${F.eps0.ok}・一致点 ${F.coincident.reject}・復元 ${F.checkpoint.restoreSame}・複製 ${F.checkpoint.cloneSame}`);
  for (const r of R.diag.rows) console.log(`🐌 gain ${r.gain}: a ${f6(r.a)}・Δϖ ${f6(r.dwNet)}(限定模型 ${f6(r.dwModelNet)}・差 ${f3(r.diffModel)})・解析 ${f6(r.analytic)}・3πa ${f6(r.approx3pia)}・上界 ${f4(r.boundMax)}`);
  console.log(`🐌 dt 半分: ${f6(R.diag.dtHalf.dwNetFull)} → ${f6(R.diag.dtHalf.dwNetHalf)}(相対 ${f3(R.diag.dtHalf.relChange)})・限定模型との差 ${f3(R.diag.dtHalf.diffModelFull)} → ${f3(R.diag.dtHalf.diffModelHalf)}`);
  for (const r of R.diag.runs.concat(R.diag.half)) console.log(`🐌 帳簿 gain ${r.gain} dt ${r.dt}: ΔE ${f3(r.ledger.dE)}・W ${f3(r.ledger.work)}・ΔE−W ${f3(r.ledger.closureEnd)}(最大 ${f3(r.ledger.closureMax)})・ΔL−ΔL_booked ${f3(r.ledger.closureL)}・ΔP ${r.ledger.dP.map(f3)}`);
  const CODE = ['tests/exp-w290c-inertial.mjs', 'tests/lib-w290c-inertial.mjs', 'tests/lib-w289c-reldrag.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  const meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第290便c', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, libVersion: LI.INERTIAL_LIB_VERSION, engineVersion: HP.REL_DRAG_INERTIAL_VERSION, loadErrors: errors.length,
    ruling: '原仮定者の裁定(第80報)⑥ DFM の更新(引きずりの計算が新しくなる —— 相対移動ベクトル=前回座標との差分・m/r³ の並進引きずり・引きずりベクトルは毎ステップリセット・自己項=慣性速度・この計算の実装精度は大変重要)',
    reading: '統括の検証項目 R127(宣言した本だけの別経路・既存 147 本は 1 bit 不変・既存の q 付き場・u=A/W・E6′・pairSlip に足さない・発散を clamp しない)',
    engine: 'Node の headless(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行)',
    gateA: '宣言なしの本の基点とのビット同一は tests/exp-w258c-bitsame.mjs・tests/exp-w272d-sigsame.mjs で示す(基点 html が要るので本正本に載せない)',
    notClaim: ['1PN と同等が証明された', '回転引きずりが創発した', '連鎖で円盤ができた', '慣性決定力場を接続した(既定で)', '安定化した', '新しい法則が正しい', '観測一致を達成した'] });
  const out = { meta, ...R };
  out.ok = R.selfTest.ok && R.gateB.ok && R.gateC.ok && R.gateD.ok && R.gateE.ok && R.gateF.ok && R.diag.ok;
  out.elapsedS = (Date.now() - t0) / 1000;
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 1) + '\n');
  console.log('→ ' + path.relative(ROOT, OUT_PATH) + '(' + out.elapsedS.toFixed(1) + ' s)・ok ' + out.ok);
}
