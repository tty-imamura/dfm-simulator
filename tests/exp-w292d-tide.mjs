// 第292便d(原仮定者の裁定(第82報)⑦「慣性決定力版では、引きずりの実装とともに潮汐力の実装も進める。引きずりと潮汐力が合わさることで、
// 自転速度に影響する高次の項が出現する。粒子を近似した多粒子サンプルでは、潮汐力は無視するなど、最適化を行う」・統括の検証項目 R140)——
// **明示潮汐(physics.tide と天体の tide —— 定時間遅延 CTL)の門と診断本 🌜 の器**(Node だけ —— 対象 html の inline script を
// tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、エンジン本体を走らせる)。
//
// ■ 何を測るか
//   門:
//     (a) 宣言なし → 既存の本が基点とビット同一 —— 基点 html が要るので本器ではなく tests/exp-w258c-bitsame.mjs・exp-w272d-sigsame.mjs で示す(正本に載せない)。
//     (b) 純関数の検査 6 項(lib-w292d-tide の runChecks —— 作用反作用・軌道+自転のトルク収支・仕事+発熱の残差・同期自転の円軌道で散逸 0・
//         速い自転で減速トルクと正の発熱〔解析式と一致〕・代表粒子/試験粒子は 0)。
//     (c) エンジンの 1 回の評価(HP.tideEvalRates —— 状態を書かない)が純関数 ctlSystem と**ビット同一**(同じ式・同じ和の順序・3 体のうち受け手 2)。
//     (d) J の更新: 各步の後 Ω = J/I(ビット)・ΔJ(状態)と Στ dt(帳簿)の一致・ほかの経路が自転を書き換えたら J を取り直す。
//     (e) サブステップ: 遅延の大きい 2 体(τ_tide ≪ dt —— 陽的 1 回なら増幅率 |1−dt/τ| > 1)で分割回数を帳簿に数え、自転が同期へ単調に近づく
//         (行き過ぎない)・dt 半分との差。
//     (f) 最適化(足さない本): 内蔵の全本に physics.tide を足した写しの分類(群・maxN・形状トイ・光学迷彩矮星・受け手なし・働く)と、
//         足さない代表 4 本(maxN 超の 9 体・群のある内蔵・形状トイの内蔵・lightSweep:auto の 2 体)が未宣言と全標本ビット同一・maxN を上書きすると働く。
//     (g) チェックポイントの復元(J の補償和と帳簿を運ぶ —— 続きは中断なしとビット同一)・velocity:"xdot" は引きずりが無ければ "v" とビット同一・
//         split:"half" と "full" の差・lag=0 で散逸 0(保存的な変形だけ)・inertia:"sphere" の ΔΩ。
//   診断本 🌜 earthMoonTide(1 恒星月・dt 0.016 と 0.008):
//     地球・月の ΔJ・ΔΩ・発熱・仕事・交換の残差・円軌道の解析式との比・素朴な spin+=τ/I·dt(倍精度)との比較。
//   引きずりとの交差項(第82報⑦の「高次の項」—— 器の中の一時プリセット・内蔵にしない):
//     🌙 の bodies に tide(🌜 と同じ宣言)と relativeDrag:{law:"inertial", gain}(点源)を宣言した写しで 4 条件
//     (C_d=0〔gain 0 の宣言〕/潮汐だけ/引きずりだけ/両方)× velocity "v"・"xdot" × gain 3 点を 1 恒星月走らせ、
//     交差項 X = q(両方) − q(潮汐だけ) − q(引きずりだけ) + q(C_d=0) を自転の ΔJ・軌道の ΔL/ΔE・引きずりの帳簿・潮汐の帳簿について記録する。
//
// ■ しないこと・言わないこと
//   ・k₂・lag を月の後退率・自転の減速の観測値に合わせない(感度実験の起点の宣言)。CTL が実在天体の広い周波数で正しいとは仮定しない。
//   ・交差項を「GR の何 PN」と同定しない・別名で再加算しない・力に返さない(本便は診断だけ)。
//   ・「全系の保存則が閉じた」「月の後退率を再現した」「観測一致を達成した」と書かない(潮汐の部品は角運動量交換と熱が閉じるが、
//     慣性引きずりの u の移送は別の帳簿 inertialDragWork/DL)。
//
// 実行(Node だけ・Chromium 不要): node tests/exp-w292d-tide.mjs   [W292D_OUT=… で出力先を変える]
// 読む正本: なし。正本: tests/out/tide-w292d.json(target = beta/index.html —— 領域 REGEN_SCOPE)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as LT from './lib-w292d-tide.mjs';
const REGEN_SCOPE = {"presets":["earthMoonReal","earthMoonTide","saturn","shapeToyArm"],"roots":["$","HP.TIDE_INERTIA_FACTOR","HP.TIDE_STEP_VERSION","HP.allPresets","HP.ckRestoreOne","HP.ckSnapOne","HP.dfmMeshVelocityFieldAt","HP.inertialDragState","HP.sim","HP.tideCrossCheck","HP.tideEvalRates","HP.tideState","HP.validatePreset","T","cw"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w292d-tide-1';
export const DIAG_ID = 'earthMoonTide';
export const BASE_ID = 'earthMoonReal';
/** 1 恒星月(27.321661 日 × 864 単位/日)を dt 0.016 で刻んだ步数。 */
export const MONTH_UNITS = 27.321661 * 864;
export const DIAG = Object.freeze({ dt: 0.016, steps: 1475370, dtHalf: 0.008, stepsHalf: 2950740 });
export const CROSS = Object.freeze({ dt: 0.016, steps: 1475370, gains: Object.freeze([100, 1000, 10000]), velocities: Object.freeze(['v', 'xdot']), eps: 0.1 });
export const TIDE_DECL = Object.freeze({ earth: Object.freeze({ k2: 0.3, lag: 6 }), moon: Object.freeze({ k2: 0.024, lag: 6 }) });
export const SUB = Object.freeze({ M: 1, m: 0.1, a: 3, R: 0.5, k2: 0.5, lag: 1e8, spinFactor: 2, dt: 0.016, steps: 100, stepsHalf: 200 });
export const OMIT = Object.freeze({ steps: 300, dt: 0.016, groupId: 'saturn', shapeId: 'shapeToyArm' });
export const SHORT = Object.freeze({ steps: 2000, dt: 0.016, ck: Object.freeze({ before: 500, between: 500 }), spinKick: 1e-6, jSteps: 20000 });
const clone = (x) => JSON.parse(JSON.stringify(x));
const find = (HP, id) => HP.allPresets().find((q) => q.id === id);
function build(HP, preset) {
  const v = HP.validatePreset(clone(preset));
  if (!v.ok) throw new Error('validatePreset: ' + JSON.stringify(v.errors).slice(0, 300));
  HP.sim.build(v.preset);
  return { S: HP.sim, warnings: v.warnings || [] };
}
function snap(S) { const o = []; for (let i = 0; i < S.n; i++) o.push(S.x[i], S.y[i], S.vx[i], S.vy[i], S.spin[i]); o.push(S.t, S.n); return o; }
const bitSame = (a, b) => a.length === b.length && a.every((v, k) => Object.is(v, b[k]));
const relD = (a, b) => Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b), 1e-300);
/** 🌙 の写し(潮汐の宣言・引きずりの宣言・物理の上書き)。 */
function emCopy(HP, { tide = null, tidePhys = null, drag = null, phys = {} } = {}) {
  const p = clone(find(HP, BASE_ID));
  p.id = 'w292dCopy'; p.sampleClass = 'principle'; delete p.claims; delete p.abBody;
  if (tidePhys) p.physics.tide = clone(tidePhys);
  if (tide) { p.bodies[0].tide = clone(tide.earth); p.bodies[1].tide = clone(tide.moon); }
  if (drag) p.physics.relativeDrag = clone(drag);
  Object.assign(p.physics, phys);
  return p;
}
const toyPhysics = (extra) => Object.assign({ G: 1, D0: 2, kFrame: 0, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, kappaT: 0.0001, cLight: 30, bM: 1, etaRad: 0, pRad: 4,
  gravityX: 0, gravityY: 0, geoPN: 0, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 0.01, stateCarry: 'double', massPrecision: 'double' }, extra || {});
const toyPreset = (bodies, phys) => ({ id: 'w292dToy', name: 'w292d toy', description: '器の中の写し(内蔵ではない)', emoji: '·', group: '運動と時空',
  sampleClass: 'principle', fidelity: 'toy', camera: { scale: 50 }, world: { boundary: 'none', size: 0 }, physics: toyPhysics(phys), bodies });

/* ── (b) 純関数の検査 6 項 ───────────────────────────────────────────── */
export function gateB() { return LT.runChecks(); }

/* ── (c) エンジンの 1 回の評価と純関数のビット同一 ─────────────────────── */
export function gateC(HP) {
  const D = LT.CHECK_DECL;
  const bodies = D.bodies.map((b) => Object.assign({ type: 'single', m: b.m, radius: b.R, x: b.x, y: b.y, vx: b.vx, vy: b.vy, spin: b.spin, pinned: false }, b.tide ? { tide: clone(b.tide) } : {}));
  const { S } = build(HP, toyPreset(bodies, { G: D.G, tide: { maxN: 8 } }));
  const st0 = snap(S);
  HP.tideEvalRates(S);
  // 純関数には**エンジンが格納した半径**(S.R は Float32 —— 0.6 → 0.6000000238…)を渡す(それ以外の量は宣言どおり倍精度で格納される)
  const lib = LT.ctlSystem(D.bodies.map((b, i) => Object.assign({}, b, { R: S.R[i] })), { G: D.G });
  const n = S.n, eng = { F: [], torque: [] };
  for (let i = 0; i < n; i++) { eng.F.push([S._tdFX[i], S._tdFY[i]]); eng.torque.push(S._tdTQ[i]); }
  const fSame = eng.F.every((z, i) => Object.is(z[0], lib.F[i][0]) && Object.is(z[1], lib.F[i][1]));
  const tSame = eng.torque.every((t, i) => Object.is(t, lib.torque[i]));
  const ev = HP.tideEvalRates(S);
  const stateUntouched = bitSame(st0, snap(S));
  const out = { receivers: Array.from(S.tideRecv), forceBitSame: fSame, torqueBitSame: tSame, heatBitSame: Object.is(ev.heat, lib.heat),
    tauMinBitSame: Object.is(ev.tauMin, lib.tauMin), stateUntouched, spinPrec: S.spin.constructor.name, radiusStored: [0, 1, 2].map((i) => S.R[i]), heat: lib.heat, tauMin: lib.tauMin };
  out.ok = fSame && tSame && out.heatBitSame && out.tauMinBitSame && stateUntouched && JSON.stringify(out.receivers) === '[0,1]' && out.spinPrec === 'Float64Array';
  return out;
}

/* ── (d) J の更新 ──────────────────────────────────────────────────── */
export function gateD(HP) {
  const { S } = build(HP, find(HP, DIAG_ID));
  const f = HP.TIDE_INERTIA_FACTOR.half;
  const I = [0, 1].map((i) => f * S.m[i] * S.R[i] * S.R[i]);
  const J0 = [0, 1].map((i) => S.tideJh[i] + S.tideJl[i]);
  let omegaIsJoverI = true;
  for (let k = 1; k <= SHORT.jSteps; k++) {
    S.step(SHORT.dt);
    if (k % 1000 === 0) for (const i of [0, 1]) if (!Object.is(S.spin[i], (S.tideJh[i] + S.tideJl[i]) / I[i])) omegaIsJoverI = false;
  }
  const dJstate = [0, 1].map((i) => (S.tideJh[i] - J0[i]) + S.tideJl[i]);
  const dJbook = [0, 1].map((i) => S.tideDJ[i]);
  const rel = dJstate.map((d, i) => relD(d, dJbook[i]));
  // ほかの経路が自転を書き換えたら J をその自転から取り直す(地球の自転を 1e-6 だけ書き換えて 1 步)
  const om1 = S.spin[0] * (1 + SHORT.spinKick);
  S.spin[0] = om1;
  S.step(SHORT.dt);
  const resync = { omegaSet: om1, jAfter: S.tideJh[0] + S.tideJl[0], expect: I[0] * om1 + S._tdTQ[0] * SHORT.dt };
  resync.rel = relD(resync.jAfter, resync.expect);
  resync.ok = resync.rel <= 1e-12;
  const out = { steps: SHORT.jSteps, inertia: I, omegaIsJoverI, dJstate, dJbook, relDJ: rel, resync };
  out.ok = omegaIsJoverI && rel.every((z) => z <= 1e-9) && resync.ok;
  return out;
}

/* ── (e) サブステップ ──────────────────────────────────────────────── */
function subRun(HP, dt, steps) {
  const c = SUB, M = c.M + c.m, n = Math.sqrt(M / (c.a * c.a * c.a)), v = n * c.a;
  const bodies = [
    { type: 'single', m: c.M, radius: c.R, x: -c.m / M * c.a, y: 0, vx: 0, vy: -c.m / M * v, spin: c.spinFactor * n, pinned: false, tide: { k2: c.k2, lag: c.lag } },
    { type: 'single', m: c.m, radius: 0.05, x: c.M / M * c.a, y: 0, vx: 0, vy: c.M / M * v, spin: 0, pinned: false }];
  const { S } = build(HP, toyPreset(bodies, { tide: { maxN: 8 } }));
  // 単調性は「同期の 10⁻⁶ 以内に入るまで」の区間で見る(入った後は自転が瞬時の軌道角速度に従って丸めの桁で揺れる)。
  // 行き過ぎ = どこかの步で Ω が瞬時の軌道角速度を 10⁻⁶ より下に越える(陽的 1 回なら増幅率 |1−dt/τ| > 1 で符号が反転する)
  const om = [S.spin[0]], nsub = [];
  let monotone = true, minRel = Infinity, lockStep = null;
  for (let k = 0; k < steps; k++) {
    S.step(dt); nsub.push(S.tideNsubLast);
    const rx = S.x[1] - S.x[0], ry = S.y[1] - S.y[0], vx = S.vx[1] - S.vx[0], vy = S.vy[1] - S.vy[0];
    const nNow = (rx * vy - ry * vx) / (rx * rx + ry * ry), rel = (S.spin[0] - nNow) / nNow;
    if (lockStep === null && S.spin[0] > om[om.length - 1]) monotone = false;
    if (lockStep === null && Math.abs(rel) < 1e-6) lockStep = k + 1;
    if (rel < minRel) minRel = rel;
    om.push(S.spin[0]);
  }
  const overshoot = minRel < -1e-6;
  const st = HP.tideState(S);
  const rx = S.x[1] - S.x[0], ry = S.y[1] - S.y[0], vx = S.vx[1] - S.vx[0], vy = S.vy[1] - S.vy[0];
  const nEnd = (rx * vy - ry * vx) / (rx * rx + ry * ry);
  return { dt, steps, omega0: om[0], omegaEnd: S.spin[0], nEnd, syncRel: (S.spin[0] - nEnd) / nEnd, monotone, overshoot, minSyncRel: minRel, lockStep,
    nsubMin: Math.min(...nsub), nsubMax: Math.max(...nsub), substeps: st.substeps, subCapped: st.subCapped, tauMinAll: st.tauMinAll,
    explicitGain: Math.abs(1 - dt / st.tauMinAll), residualE: st.residualE, residualL: st.residualL, heat: st.heat };
}
export function gateE(HP) {
  const A = subRun(HP, SUB.dt, SUB.steps), B = subRun(HP, SUB.dt / 2, SUB.stepsHalf);
  const out = { decl: SUB, full: A, half: B, omegaEndRel: relD(A.omegaEnd, B.omegaEnd) };
  out.ok = A.substeps > 0 && A.subCapped === 0 && A.monotone && !A.overshoot && B.monotone && !B.overshoot && A.lockStep !== null && A.explicitGain > 1 && out.omegaEndRel <= 1e-3;
  return out;
}

/* ── (f) 最適化(足さない本)───────────────────────────────────────── */
export function withTide(p, phys) {
  const q = clone(p);
  q.physics = Object.assign({}, q.physics || {}, { tide: Object.assign({ maxN: 8 }, phys || {}) });
  q.bodies = (q.bodies || []).map((b) => (b && b.type === 'single' && b.radius > 0) ? Object.assign({}, b, { tide: { k2: 0.3, lag: 1 } }) : b);
  return q;
}
function runSnaps(HP, preset, steps, dt) { const { S } = build(HP, preset); const out = [snap(S)]; for (let k = 1; k <= steps; k++) { S.step(dt); if (k % 100 === 0) out.push(snap(S)); }
  return { out: out.flat(), st: HP.tideState(S), prec: S.spin.constructor.name }; }
export function gateF(HP) {
  // 内蔵の全本に足した写しの分類は**正本に載せない**(他の便が本を足すと数が動く —— QA behavior.tideGate が今の html で同じ写し withTide を数えて報告する)
  const dv = HP.validatePreset(clone(find(HP, DIAG_ID)));
  const diagOff = HP.tideCrossCheck(dv.preset.physics, dv.preset.bodies, dv.preset).off;
  // 代表 4 本: 未宣言との全標本ビット同一
  const nine = [];
  for (let k = 0; k < 9; k++) { const a = 2 * Math.PI * k / 9; nine.push({ type: 'single', m: 0.1 + 0.01 * k, radius: 0.2, x: 5 * Math.cos(a), y: 5 * Math.sin(a), vx: -0.3 * Math.sin(a), vy: 0.3 * Math.cos(a), spin: 0.05 * k, pinned: false }); }
  const nineToy = toyPreset(nine, {});
  const cloak = toyPreset([{ type: 'single', m: 1, radius: 0.5, x: -1, y: 0, vx: 0, vy: -0.2, spin: 0.5, pinned: false, lightSweep: 'auto' },
    { type: 'single', m: 1, radius: 0.5, x: 1, y: 0, vx: 0, vy: 0.2, spin: 0.5, pinned: false }], {});
  const reps = [['maxN', 'nine-body toy', nineToy], ['group', OMIT.groupId, find(HP, OMIT.groupId)], ['shapeToy', OMIT.shapeId, find(HP, OMIT.shapeId)], ['cloakedDwarf', 'lightSweep:auto toy', cloak]];
  const rows = [];
  for (const [want, label, p] of reps) {
    const A = runSnaps(HP, p, OMIT.steps, OMIT.dt), B = runSnaps(HP, withTide(p), OMIT.steps, OMIT.dt);
    rows.push({ want, label, off: B.st ? B.st.off : null, steps: B.st ? B.st.steps : null, values: A.out.length, bitSame: bitSame(A.out, B.out), spinPrec: B.prec });
  }
  const over = runSnaps(HP, withTide(nineToy, { maxN: 9 }), OMIT.steps, OMIT.dt);
  const maxNOverride = { off: over.st.off, steps: over.st.steps, receivers: over.st.receivers.length, heatPositive: over.st.heat > 0, spinPrec: over.prec };
  const out = { diagOff, rows, maxNOverride };
  out.ok = diagOff === null && rows.every((r) => r.bitSame && r.steps === 0 && r.spinPrec === 'Float32Array') && rows.every((r) => r.off === r.want || (r.want === 'shapeToy' && r.off === 'group'))
    && maxNOverride.off === null && maxNOverride.steps === OMIT.steps && maxNOverride.receivers === 9;
  return out;
}
/* ── (g) 復元・速度の読み・分割・lag 0・慣性 ─────────────────────────── */
function ledgerPrint(S) { const st = HP_LOCAL.tideState(S); return snap(S).concat([st.work, st.workCons, st.heat, st.mix, st.dL, st.steps, st.substeps], st.J, st.Jlo, st.dJ); }
let HP_LOCAL = null;
export function gateG(HP) {
  HP_LOCAL = HP;
  const P = find(HP, DIAG_ID);
  // チェックポイント
  let { S } = build(HP, P);
  for (let k = 0; k < SHORT.ck.before; k++) S.step(SHORT.dt);
  const sn = HP.ckSnapOne(S);
  for (let k = 0; k < SHORT.ck.between; k++) S.step(SHORT.dt);
  const fA = ledgerPrint(S);
  HP.ckRestoreOne(S, sn);
  for (let k = 0; k < SHORT.ck.between; k++) S.step(SHORT.dt);
  const fB = ledgerPrint(S);
  const checkpoint = { values: fA.length, rerunBitSame: bitSame(fA, fB) };
  // 走行の要約
  const run = (preset) => { const r = build(HP, preset); for (let k = 0; k < SHORT.steps; k++) r.S.step(SHORT.dt); return { f: ledgerPrint(r.S), st: HP.tideState(r.S) }; };
  const base = run(P);
  const withPhys = (ph) => { const q = clone(P); q.physics.tide = Object.assign({}, q.physics.tide, ph); return q; };
  const xd = run(withPhys({ velocity: 'xdot' }));
  const half = run(withPhys({ split: 'half' }));
  const sph = run(withPhys({ inertia: 'sphere' }));
  const q0 = clone(P); q0.bodies.forEach((b) => { b.tide.lag = 0; });
  const lag0 = run(q0);
  const dOm = (st) => st.omega[0] - P.bodies[0].spin;
  const dOmJ = (st) => st.dJ[0] / st.inertia[0];   // ΔJ/I(J の補償和から —— Ω の格納値は ulp で量子化される)
  const out = { checkpoint,
    xdotNoDrag: { bitSame: bitSame(base.f, xd.f) },
    split: { dJfull: base.st.dJ[0], dJhalf: half.st.dJ[0], rel: relD(base.st.dJ[0], half.st.dJ[0]) },
    lag0: { dJ: lag0.st.dJ, heat: lag0.st.heat, workCons: lag0.st.workCons, work: lag0.st.work, consOnly: lag0.st.dJ.every((z) => z === 0) && lag0.st.heat === 0 && lag0.st.workCons !== 0 },
    inertia: { dOmegaHalf: dOm(base.st), dOmegaSphere: dOm(sph.st), ratioStored: dOm(sph.st) / dOm(base.st), ratioJ: dOmJ(sph.st) / dOmJ(base.st), dJrel: relD(base.st.dJ[0], sph.st.dJ[0]) } };
  out.ok = checkpoint.rerunBitSame && out.xdotNoDrag.bitSame && out.split.rel <= 1e-3 && out.lag0.consOnly && Math.abs(out.inertia.ratioJ - 1.25) <= 1e-9;
  return out;
}

/* ── 診断本 🌜(1 恒星月)───────────────────────────────────────────── */
function diagRun(HP, dt, steps) {
  const P = find(HP, DIAG_ID);
  const { S } = build(HP, P);
  const st0 = HP.tideState(S);
  const I = st0.inertia, om0 = st0.omega.slice(), J0 = st0.J.slice();
  const naive = om0.slice();
  const t0 = Date.now();
  for (let k = 0; k < steps; k++) {
    S.step(dt);
    for (let q = 0; q < 2; q++) naive[q] += S._tdTQ[q] * dt / I[q];   // 素朴な spin += τ/I·dt(倍精度・比較のためだけ —— 状態へは書かない)
  }
  const wall = (Date.now() - t0) / 1000;
  const st = HP.tideState(S);
  const T = steps * dt;
  // 円軌道の解析の自転トルク(a = 軌道長半径 384.748・n = 2π/恒星月)
  const G = S.params.G, a = 384.748, n = 2 * Math.PI / MONTH_UNITS;
  const ana = LT.circularSpinTorque({ G, k2: TIDE_DECL.earth.k2, lag: TIDE_DECL.earth.lag, R: S.R[0], mj: S.m[1], r: a, n, Omega: om0[0] });
  const dJ = st.dJ, dOm = st.omega.map((w, i) => w - om0[i]);
  const rx = S.x[1] - S.x[0], ry = S.y[1] - S.y[0];
  return { dt, steps, T, wallSec: wall, inertia: I, omega0: om0, J0, dJ, dJrelEarth: dJ[0] / J0[0], dOmega: dOm, dOmegaPerDay: dOm.map((z) => z / T * 864),
    naiveDOmega: naive.map((w, i) => w - om0[i]), heat: st.heat, work: st.work, workCons: st.workCons, dL: st.dL, residualE: st.residualE, residualL: st.residualL,
    residualERel: st.residualE / st.heat, residualLRel: st.residualL / Math.abs(dJ[0]), tauMinAll: st.tauMinAll, substeps: st.substeps, subCapped: st.subCapped,
    torqueMeanEarth: dJ[0] / T, torqueAnalyticEarth: ana, ratioAnalytic: (dJ[0] / T) / ana, rEnd: Math.hypot(rx, ry) };
}
export function diag(HP) {
  const A = diagRun(HP, DIAG.dt, DIAG.steps), B = diagRun(HP, DIAG.dtHalf, DIAG.stepsHalf);
  const out = { decl: { tide: TIDE_DECL, dt: DIAG.dt, steps: DIAG.steps, dtHalf: DIAG.dtHalf, stepsHalf: DIAG.stepsHalf }, run: A, half: B,
    dJrelHalf: relD(A.dJ[0], B.dJ[0]), naiveLost: A.naiveDOmega[0] === 0 || Math.abs(A.naiveDOmega[0]) < 0.5 * Math.abs(A.dOmega[0]) };
  out.ok = A.dJ[0] < 0 && A.heat > 0 && Math.abs(A.residualERel) <= 1e-9 && Math.abs(A.residualLRel) <= 1e-9 && A.substeps === 0 && out.dJrelHalf <= 1e-3;
  return out;
}

/* ── 引きずりとの交差項(器の一時プリセット)──────────────────────────── */
function crossRun(HP, { gain, tide, velocity }) {
  const drag = { law: 'inertial', gain, eps: CROSS.eps, pairs: 'all', history: 'positions' };
  const p = emCopy(HP, { tide: tide ? TIDE_DECL : null, tidePhys: tide ? { maxN: 8, velocity } : null, drag });
  const { S } = build(HP, p);
  const orb = (S) => { const mu = S.m[0] * S.m[1] / (S.m[0] + S.m[1]), rx = S.x[1] - S.x[0], ry = S.y[1] - S.y[0], vx = S.vx[1] - S.vx[0], vy = S.vy[1] - S.vy[0];
    const r = Math.hypot(rx, ry); return { L: mu * (rx * vy - ry * vx), E: 0.5 * mu * (vx * vx + vy * vy) - S.params.G * S.m[0] * S.m[1] / Math.sqrt(r * r + S.params.softening * S.params.softening), r }; };
  const o0 = orb(S);
  const t0 = Date.now();
  for (let k = 0; k < CROSS.steps; k++) S.step(CROSS.dt);
  const o1 = orb(S), st = HP.tideState(S), di = HP.inertialDragState(S);
  return { gain, tide, velocity, wallSec: (Date.now() - t0) / 1000,
    dJEarth: st ? st.dJ[0] : 0, dJMoon: st ? st.dJ[1] : 0, tideHeat: st ? st.heat : 0, tideDL: st ? st.dL : 0, tideMix: st ? st.mix : 0,
    dragDL: di ? di.dL : 0, dragWork: di ? di.work : 0, dLorb: o1.L - o0.L, dEorb: o1.E - o0.E, Lorb: o0.L, rEnd: o1.r, boundMax: di ? di.boundMax : null };
}
export function cross(HP) {
  const C0 = crossRun(HP, { gain: 0, tide: false, velocity: 'v' });
  const T = crossRun(HP, { gain: 0, tide: true, velocity: 'v' });
  const Q = ['dJEarth', 'dJMoon', 'tideHeat', 'tideDL', 'tideMix', 'dragDL', 'dragWork', 'dLorb', 'dEorb'];
  const rows = [];
  const runs = [C0, T];
  for (const g of CROSS.gains) {
    const D = crossRun(HP, { gain: g, tide: false, velocity: 'v' });
    runs.push(D);
    for (const vel of CROSS.velocities) {
      const B = crossRun(HP, { gain: g, tide: true, velocity: vel });
      runs.push(B);
      const X = {};
      for (const k of Q) X[k] = B[k] - T[k] - D[k] + C0[k];
      // 尺度(交差項を読む物差し): 引きずりだけの帳簿 DL・W と軌道角運動量 L(丸めの床はそれぞれの 10⁻¹³ 程度)
      const Mtot = find(HP, BASE_ID).bodies.reduce((z, q) => z + q.m, 0), rA = 384.748, sK = rA * rA + CROSS.eps * CROSS.eps;
      const aC = g * Mtot * (rA / (sK * sK));   // 相対モードの結合 a = C_d M K_ε(a)(軌道長半径で評価 —— 第290便c の限定模型と同じ量)
      rows.push({ gain: g, velocity: vel, X, XrelEarth: X.dJEarth / T.dJEarth, aCoupling: aC, XrelOverA: (X.dJEarth / T.dJEarth) / aC,
        XrelDragDL: X.dragDL / D.dragDL, XrelDragWork: X.dragWork / D.dragWork,
        dragOnly: { dragDL: D.dragDL, dragWork: D.dragWork, dLorb: D.dLorb - C0.dLorb }, Lorb: B.Lorb, tideOnlyDJEarth: T.dJEarth, boundMax: B.boundMax });
    }
  }
  // 交差項の gain への比例(v と xdot それぞれ —— 地球の ΔJ)
  const scaling = CROSS.velocities.map((vel) => { const r = rows.filter((z) => z.velocity === vel); return { velocity: vel, XperGain: r.map((z) => z.X.dJEarth / z.gain) }; });
  // xdot の直接の混合 = X(xdot) − X(v)
  const mixing = CROSS.gains.map((g) => { const a = rows.find((z) => z.gain === g && z.velocity === 'v'), b = rows.find((z) => z.gain === g && z.velocity === 'xdot');
    return { gain: g, dJEarth: b.X.dJEarth - a.X.dJEarth, tideMix: b.X.tideMix }; });
  const out = { decl: CROSS, tide: TIDE_DECL, baseline: C0, tideOnly: T, rows, scaling, mixing, runs: runs.map((r) => ({ gain: r.gain, tide: r.tide, velocity: r.velocity, wallSec: r.wallSec })) };
  out.ok = C0.dJEarth === 0 && C0.dragDL === 0 && T.dJEarth < 0 && rows.every((r) => Number.isFinite(r.X.dJEarth)) && rows.filter((r) => r.velocity === 'v').every((r) => r.X.tideMix === 0)
    && rows.every((r) => r.boundMax < 1);
  return out;
}

export function computeAll(HP) {
  return { gateB: gateB(), gateC: gateC(HP), gateD: gateD(HP), gateE: gateE(HP), gateF: gateF(HP), gateG: gateG(HP), diag: diag(HP), cross: cross(HP) };
}

const e3 = (x) => (x === null || x === undefined || !Number.isFinite(x)) ? '—' : Number(x).toExponential(3);
const f4 = (x) => (x === null || x === undefined) ? '—' : Number(x).toFixed(4);
const ok = (b) => (b ? '○' : '×');
/** PHYSICS〔第292便d〕の表の行(QA docs.tideContract が照合する)。 */
export function docRows(J) {
  const out = { checks: [], omit: [], diag: [], cross: [] };
  const B = J.gateB;
  out.checks.push(`| ① 作用反作用 ΣF | ${e3(B.actionReaction.rel)} | ${ok(B.actionReaction.ok)} |`);
  out.checks.push(`| ② 軌道+自転のトルク収支 | ${e3(B.torqueBalance.rel)} | ${ok(B.torqueBalance.ok)} |`);
  out.checks.push(`| ③ 仕事+発熱の残差 | ${e3(B.workHeat.rel)} | ${ok(B.workHeat.ok)} |`);
  out.checks.push(`| ④ 同期自転の円軌道(散逸トルク・発熱) | ${e3(B.syncZero.torque)}・${e3(B.syncZero.heat)}(保存力 ${e3(B.syncZero.consMag)}) | ${ok(B.syncZero.ok)} |`);
  out.checks.push(`| ⑤ 速い自転(Ω=3n)の減速トルクと解析式 | ${e3(B.fastBrakes.torqueFast)}・相対差 ${e3(B.fastBrakes.rel)}・発熱 ${e3(B.fastBrakes.heatFast)} | ${ok(B.fastBrakes.ok)} |`);
  out.checks.push(`| ⑥ 代表粒子・試験粒子 | 対 ${B.superTestZero.pairsSuperAndTest}・${B.superTestZero.pairsOnlyReceiver}(力・トルク・熱 0) | ${ok(B.superTestZero.ok)} |`);
  for (const r of J.gateF.rows) out.omit.push(`| ${r.label} | ${r.off} | ${r.steps} | ${r.values} 値 ${r.bitSame ? 'ビット同一' : '不一致'} | ${r.spinPrec} |`);
  out.omit.push(`| 9 体に maxN:9 を宣言(上書き) | ${J.gateF.maxNOverride.off === null ? '働く' : J.gateF.maxNOverride.off} | ${J.gateF.maxNOverride.steps} | 受け手 ${J.gateF.maxNOverride.receivers} | ${J.gateF.maxNOverride.spinPrec} |`);
  for (const r of [J.diag.run, J.diag.half]) out.diag.push(`| ${r.dt} | ${e3(r.dJ[0])} | ${e3(r.dJrelEarth)} | ${e3(r.dOmega[0])} | ${e3(r.dJ[1])} | ${e3(r.heat)} | ${e3(r.residualERel)} | ${e3(r.residualLRel)} | ${f4(r.ratioAnalytic)} | ${e3(r.naiveDOmega[0])} |`);
  for (const r of J.cross.rows) out.cross.push(`| ${r.gain} | ${r.velocity} | ${e3(r.X.dJEarth)} | ${e3(r.XrelEarth)} | ${f4(r.XrelOverA)} | ${e3(r.X.dJMoon)} | ${e3(r.X.tideMix)} | ${e3(r.X.dragDL)}(${e3(r.XrelDragDL)}) | ${e3(r.X.dLorb)} | ${e3(r.boundMax)} |`);
  return out;
}

/** 🌜 の obsCard に書く実測の文字列(QA preset.earthMoonTide が正本から作り直して照合する)。 */
export function obsValues(J) {
  const A = J.diag.run;
  const X = J.cross.rows.find((r) => r.gain === CROSS.gains[0] && r.velocity === 'v');
  return { DJE: e3(A.dJrelEarth), DOE: e3(A.dOmega[0]), RATIO: f4(A.ratioAnalytic), HEAT: e3(A.heat), RESL: e3(A.residualLRel), RESE: e3(A.residualERel),
    XREL: e3(X.XrelEarth), XOVA: X.XrelOverA.toFixed(1) };
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) {
  const TARGET = process.env.QA_TARGET || 'beta/index.html';
  const OUT_PATH = process.env.W292D_OUT || path.join(ROOT, 'tests', 'out', 'tide-w292d.json');
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const t0 = Date.now();
  const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
  const R = computeAll(HP);
  console.log(`(b) 純関数 6 項 ${R.gateB.ok}・(c) エンジン=純関数 ${R.gateC.ok}・(d) J ${R.gateD.ok}・(e) 分割 ${R.gateE.ok}(n ${R.gateE.full.nsubMin}〜${R.gateE.full.nsubMax})・(f) 足さない ${R.gateF.ok}・(g) ${R.gateG.ok}`);
  const A = R.diag.run;
  console.log(`🌜 1 恒星月: ΔJ_地球 ${e3(A.dJ[0])}(ΔJ/J ${e3(A.dJrelEarth)})・ΔΩ ${e3(A.dOmega[0])}・ΔJ_月 ${e3(A.dJ[1])}・熱 ${e3(A.heat)}・残差 E ${e3(A.residualERel)}・L ${e3(A.residualLRel)}・解析比 ${f4(A.ratioAnalytic)}・素朴 ΔΩ ${e3(A.naiveDOmega[0])}・dt 半分 ${e3(R.diag.dJrelHalf)}`);
  for (const r of R.cross.rows) console.log(`交差項 gain ${r.gain} ${r.velocity}: X_ΔJ地球 ${e3(r.X.dJEarth)}(相対 ${e3(r.XrelEarth)})・X_ΔL軌道 ${e3(r.X.dLorb)}・X_引きずり DL ${e3(r.X.dragDL)}・X_mix ${e3(r.X.tideMix)}`);
  const CODE = ['tests/exp-w292d-tide.mjs', 'tests/lib-w292d-tide.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  const meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第292便d', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, libVersion: LT.TIDE_LIB_VERSION, engineVersion: HP.TIDE_STEP_VERSION, loadErrors: errors.length,
    ruling: '原仮定者の裁定(第82報)⑦ 慣性決定力版では引きずりの実装とともに潮汐力の実装も進める・引きずりと潮汐力が合わさることで自転速度に影響する高次の項が出現する・粒子を近似した多粒子サンプルでは潮汐力は無視するなど最適化を行う',
    reading: '統括の検証項目 R140(保存的な変形+散逸の遅延+自転へのトルク・opt-in・多粒子は足さない・引きずりとの交差項は診断帳簿)',
    engine: 'Node の headless(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行)',
    gateA: '宣言なしの本の基点とのビット同一は tests/exp-w258c-bitsame.mjs・tests/exp-w272d-sigsame.mjs で示す(基点 html が要るので本正本に載せない)',
    notClaim: ['月の後退率を再現した', '地球の自転の減速の観測値を再現した', '全系の保存則が閉じた', '交差項が GR の高次 PN に当たる', '観測一致を達成した', '新発見'] });
  const out = { meta, ...R };
  out.ok = R.gateB.ok && R.gateC.ok && R.gateD.ok && R.gateE.ok && R.gateF.ok && R.gateG.ok && R.diag.ok && R.cross.ok;
  out.elapsedS = (Date.now() - t0) / 1000;
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 1) + '\n');
  console.log('→ ' + path.relative(ROOT, OUT_PATH) + '(' + out.elapsedS.toFixed(1) + ' s)・ok ' + out.ok);
}
