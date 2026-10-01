// 第289便d(原仮定者の裁定(第79報)で閉じた AN95/AN96/AN97・統括の検証項目 R122)—— **離散の後の状態引き継ぎ**と**口座の意味**の器。
//
// ■ 何を測るか(Node だけ —— 対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読む。1 步もエンジンを積分しない)
//   (A) 再現: 🥜 fixedCaptureCopy の中心だけの写しに `fixedEject`(REPRO_EJECT —— R_a=0.75・trigger {atStep:9999} で自動では放出しない)を宣言し、
//       `dfmFixedEject(S,'direct')` を直接呼ぶ。イベントの I′・E′(帳簿の行 I1・EsR —— 元から R_a で計算)と、**状態から読む** I′=½M′R_I²・
//       E′=½I′Ω²(R_I = `S.fixcap.rInertia`)を並べる。基点 ae29b8a は状態を更新しない(イベント 6.75/3.375 に対し状態 27/13.5 —— 宣言値 BEFORE_AE29)。
//   (B) 2 回連続の離散: 1 回目(宣言・R_a=0.75)→ 2 回目(spec・R_a=0.5)。2 回目の「前」の I0・E_s,before が 1 回目の「後」の I1・E_s,remaining と
//       ビット一致するか(イベントをまたぐ連続)・帳簿の格納残差 eE(イベントごと)は 0 のまま・状態の R_I は 0.5。
//   (C) 離散の後の捕獲: 同じ写しに束縛した粒子 1 体を置き、離散 → `dfmFixedCaptureStep(S)`。捕獲の行の I_c・E_s,c が離散の I1・E_s,remaining と
//       ビット一致するか(捕獲が新しい R_I を読む)・合体後の I′=½M″R_a²。
//   (D) 超過からの離散(trigger "overflow"): R_I=0.01・R_a=0.005 の写しで合体 → 同じ步の末に放出 → 状態の R_I=0.005・状態から読む E′ = イベントの E′。
//   (E) ⏮(`sim.build(写し)` —— btnReset と同じ経路): 離散の後に作り直すと R_I は宣言の 1.5 に戻り、帳簿(nEject・eE・ejLog)も初期値。
//   (F) 第288便a の正本 tests/out/fixcap-w288a.json の離散の行: 器 tests/exp-w288a-fixcap.mjs の roundTrip・negativeControls(超過からの放出)を
//       いまの html で引き直し、正本と比べる(どの事例も rInertiaAfter = rInertia —— 引き継ぎは同じ値の代入なので行は変わらない見込み)。
//       **fixcap の正本は書き直さない**(段 fixcap288 は鎖で走らせる)。
//   (G) ΔE_self の口座の意味(値は変えない —— 正本と式から読む): 合体の行の ΔE_self = U_pair の符号と和・最終の E_self = Σ U_pair(和の順序も同じ)・
//       離散の ΔE_self = −U_pair(c′,e) > 0・捕獲の無い宇宙の離散で E_self > 0 になる例(A の値 = G M′ m_e/√(r²+ε²))・
//       中心の自転エネルギー E_s,c と場の仕事の補償値 E_mesh の並び(fixcap の正本の supply を読むだけ)。
//   (H) E_rot の口座の正本(AN96): tests/lib-w288d-spinprec.mjs の純関数 `rotEnergyAniso`(J·I⁻¹J/2 —— **エンジン未接続**)を、
//       単一軸(|J|²/(2I) と相対 ≤ 1e-15)・対称こま(剛体式 `rigidErot` と相対 ≤ 1e-12・|J|²/(2I_∥) との残差は診断列)・三軸と座標回転の不変性・
//       正定値でない入力の拒否(NaN)で試す。
//
// ■ しないこと・言わないこと
//   ・物理を変えるのは `dfmFixedEject` の成功後の 1 行(`C.rInertia=Ra`)だけ(内蔵で fixedEject を宣言した本は 0 —— bitsame/sigsame 146/146 は
//     枝の実測・PHYSICS〔第289便d〕)。`S._core` 不変・エンジンの |J|²/(2I) は変えない・口座をエンジンへ接続しない。
//   ・「離散が物理的に正しくなった」「口座を接続した」と書かない。ΔE_self の正の符号だけでバグと断定しない。
//
// 実行(Node だけ・Chromium 不要): node tests/exp-w289d-ejectstate.mjs   [W289D_BASE=beta/_w289_base.html で基点を子プロセスで測り直す]
// 読む正本: tests/out/fixcap-w288a.json(段 fixcap288 の後)。正本: tests/out/ejectstate-w289d.json(target=beta/index.html・領域 hash REGEN_SCOPE)
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import * as EF from './exp-w288a-fixcap.mjs';
import * as SP from './lib-w288d-spinprec.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
const REGEN_SCOPE = {"presets":["clusterAnalogyBH","clusterGrowthCopy","fixedCaptureCopy","galaxyAnalogyBH","gas"],"roots":["$","CENTER_CAPTURE_VERSION","CONTACT_MODE_KEY","DT","FIXED_CAPTURE_VERSION","HP.allPresets","HP.dfmCenterCaptureStep","HP.dfmField","HP.dfmFieldContract","HP.dfmFieldContractOf","HP.dfmFieldSnapshot","HP.dfmFixedCaptureStep","HP.dfmFixedEject","HP.dfmMeshVelocityFieldAt","HP.frameWeightIsPull","HP.frameWeightPow","HP.sim","HP.validatePreset","T","centerCaptureCheck","ch","contactNoneOf","ctx","cw","dfmCenterCaptureStep","dfmField","dfmFieldContract","dfmFixedCaptureStep","dfmFixedEject","dfmGeoToySpinStep","fixedCaptureCheck","geoCoreDispatch","jeansRowsVelocities","jeansSigma2Profile","lensExcludedRows","rayHeavy","rayMassMin","sim","traceRay","validatePreset"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w289d-ejectstate-1';
export const PRESET = 'fixedCaptureCopy';
export const FIXCAP_CANON = 'tests/out/fixcap-w288a.json';
/** 再現の宣言(統括の検証項目 R122 の再現手順そのまま)。 */
export const REPRO_EJECT = Object.freeze({ version: 'w288a-fixcap-1', mass: 1, rInertiaAfter: 0.75, rLaunch: 2, direction: Object.freeze({ posDeg: 0, velDeg: 90 }),
  spinEject: 0, radiusEject: 0.01, omegaAfter: 1, trigger: Object.freeze({ atStep: 9999 }) });
/** 2 回目の離散(spec で直接渡す —— 宣言の形と同じ)。 */
export const SECOND_EJECT = Object.freeze({ version: 'w288a-fixcap-1', mass: 1, rInertiaAfter: 0.5, rLaunch: 2, direction: Object.freeze({ posDeg: 180, velDeg: 270 }),
  spinEject: 0, radiusEject: 0.01, omegaAfter: 0.5, trigger: Object.freeze({ atStep: 9999 }) });
/** 離散の後に捕獲させる粒子(中心から 1.4・束縛 —— 放出体〔距離 2〕は捕獲半径 1.5 の外)。 */
export const CAPTURE_BODY = Object.freeze({ type: 'single', m: 0.425, x: -1.4, y: 0, vx: 0, vy: 0.5, spin: 0, pinned: false, radius: 0.01 });
/** 超過からの離散(R_I=0.01・R_a=0.005)。 */
export const OVERFLOW_CASE = Object.freeze({ rInertia: 0.01, rInertiaAfter: 0.005, body: Object.freeze({ type: 'single', m: 0.425, x: -1.4, y: 0, vx: 0, vy: 2, spin: 0, pinned: false, radius: 0.01 }),
  eject: Object.freeze({ version: 'w288a-fixcap-1', mass: 0.2, rInertiaAfter: 0.005, rLaunch: 4, direction: Object.freeze({ posDeg: 90, velDeg: 90 }), spinEject: 0, radiusEject: 0.01, trigger: 'overflow' }) });
/** 異方的剛体の E_rot の試験の宣言(AN96)。 */
export const ROT_SPEC = Object.freeze({
  singleAxis: Object.freeze([[28.125, 12], [0.00127125, 20], [1, -0.3], [3.7, 1e-3], [0.5 * 25.425 * 2.25, 11.337]]),   // [I, Ω]
  top: Object.freeze({ Ipar: 1, Iperp: 0.75, thetaDeg: 60, phiDot: 1.1547005383792515, psiDot: 0.4, thetaDot: 0.3 }),
  sphere: Object.freeze({ Ipar: 0.75, Iperp: 0.75, thetaDeg: 60, phiDot: 1.1547005383792515, psiDot: 0.4, thetaDot: 0.3 }),
  triaxial: Object.freeze({ I: Object.freeze([1, 2, 3]), J: Object.freeze([1, 1, 1]), euler: Object.freeze([0.3, 1.1, -0.7]) }),
  singleRelMax: 1e-15, rigidRelMax: 1e-12, frameRelMax: 1e-12,
});
/** 基点 ae29b8a の値(枝の実測 —— 同じ器の probe を基点の beta/index.html で走らせ `summaryOf` で要約した値。基点 html は CI に無いので宣言値で持つ)。 */
export const BEFORE_AE29 = Object.freeze({ rev: 'ae29b8a', how: '枝の実測(W289D_BASE=beta/_w289_base.html で本器の probe を子プロセスで走らせ summaryOf で要約した値)',
  summary: {"repro":{"eventI":6.75,"eventE":3.375,"stateRI":1.5,"stateI":27,"stateE":13.5,"eE":0},"twice":{"dI":20.25,"dE":10.125,"K2":12.624367240166961,"eE":[0,-1.4210854715202004e-14],"stateRI":1.5},"capture":{"Ic":27,"EsC":13.5,"Estar":13.714269698171128,"spin1":0.9990973184347826,"dIc":20.25,"dEsC":10.125},"overflow":{"stateRI":0.01,"stateE":0.25225000000000003,"eventE":0.06306250000000001},"reset":{"afterEjectRI":1.5,"afterResetRI":1.5}} });
/** probe の要約(前後の比較に使う量だけ)。 */
export function summaryOf(P) {
  return {
    repro: { eventI: P.repro.event.I1, eventE: P.repro.event.EsR, stateRI: P.repro.state.rInertia, stateI: P.repro.state.I, stateE: P.repro.state.E, eE: P.repro.ledger.eE },
    twice: { dI: P.twice.dI, dE: P.twice.dE, K2: P.twice.second.K, eE: P.twice.eEeach, stateRI: P.twice.state2.rInertia },
    capture: { Ic: P.captureAfter.row.Ic, EsC: P.captureAfter.row.EsC, Estar: P.captureAfter.row.Estar, spin1: P.captureAfter.row.spin1, dIc: P.captureAfter.dIc, dEsC: P.captureAfter.dEsC },
    overflow: { stateRI: P.overflow.state.rInertia, stateE: P.overflow.state.E, eventE: P.overflow.event.EsR },
    reset: { afterEjectRI: P.reset.afterEject.rInertia, afterResetRI: P.reset.afterReset.rInertia },
  };
}

const clone = (o) => JSON.parse(JSON.stringify(o));
const rel = (a, b) => (a === b ? 0 : Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b), 1e-300));
const byId = (HP, id) => HP.allPresets().find((q) => q.id === id);

/** 🥜 の写し(中心だけ + 追加の body・fixedCapture の上書き・fixedEject の宣言)。 */
export function copyOf(HP, { extra = [], fc = {}, fe = REPRO_EJECT } = {}) {
  const p = clone(byId(HP, PRESET));
  p.bodies = [p.bodies[0]].concat(extra.map((b) => clone(b)));
  Object.assign(p.fixedCapture, fc);
  if (fe) p.fixedEject = clone(fe); else delete p.fixedEject;
  const v = HP.validatePreset(p);
  if (!v.ok) throw new Error('validatePreset: ' + (v.errors || []).join(' / '));
  return v.preset;
}
const buildOf = (HP, preset) => { HP.sim.build(clone(preset)); return HP.sim; };
/** 状態から読む中心の量(R_I = S.fixcap.rInertia —— 次の処理が読む値)。 */
export function stateRead(S) {
  const C = S.fixcap, c = C.i, M = S.m[c], W = S.spin[c], I = 0.5 * M * C.rInertia * C.rInertia;
  return { rInertia: C.rInertia, M, spin: W, I, E: 0.5 * I * W * W };
}
const ledger = (S) => { const C = S.fixcap; return { nEject: C.nEject, nRefEject: C.nRefEject, nCap: C.nCap, eE: C.eE, eM: C.eM, Eself: C.Eself, Q: C.Q, Epend: C.Epend, ejLog: C.ejLog.length, log: C.log.length }; };
const pickEj = (z) => ({ why: z.why, I0: z.I0, I1: z.I1, EsB: z.EsB, EsR: z.EsR, K: z.K, eE: z.eE, scE: z.scE, M0: z.M0, M1: z.M1, spin0: z.spin0, spin1: z.spin1,
  EselfB: z.EselfB, EselfA: z.EselfA, Upair: z.Upair });

/** (A)〜(E) —— エンジンの関数を直接呼ぶ(いまの html でも基点 html でも同じ関数で測る)。 */
export function probe(HP) {
  const out = {};
  // (A) 再現
  {
    const pr = copyOf(HP);
    const S = buildOf(HP, pr);
    const s0 = stateRead(S);
    const got = HP.dfmFixedEject(S, 'direct');
    const ev = pickEj(S.fixcap.ejLog[0]);
    const st = stateRead(S);
    const G = S.params.G, eps = S.params.softening;
    const EselfExpect = G * (pr.bodies[0].m - REPRO_EJECT.mass) * REPRO_EJECT.mass / Math.sqrt(REPRO_EJECT.rLaunch * REPRO_EJECT.rLaunch + eps * eps);
    out.repro = { declaredRI: pr.fixedCapture.rInertia, before: s0, ejected: got, event: ev, state: st,
      stateEqualsEvent: Object.is(st.I, ev.I1) && Object.is(st.E, ev.EsR),
      dI: st.I - ev.I1, dE: st.E - ev.EsR, ledger: ledger(S),
      EselfAfter: S.fixcap.Eself, EselfExpect, EselfRel: rel(S.fixcap.Eself, EselfExpect) };
  }
  // (B) 2 回連続の離散
  {
    const S = buildOf(HP, copyOf(HP));
    const g1 = HP.dfmFixedEject(S, 'direct');
    const st1 = stateRead(S);
    const g2 = HP.dfmFixedEject(S, 'direct', clone(SECOND_EJECT));
    const st2 = stateRead(S);
    const e1 = pickEj(S.fixcap.ejLog[0]), e2 = pickEj(S.fixcap.ejLog[1]);
    out.twice = { ejected: [g1, g2], first: e1, second: e2, state1: st1, state2: st2,
      continuityI: Object.is(e2.I0, e1.I1), continuityE: Object.is(e2.EsB, e1.EsR), dI: e2.I0 - e1.I1, dE: e2.EsB - e1.EsR,
      eEeach: [e1.eE, e2.eE], eEsum: S.fixcap.eE, relEeach: [Math.abs(e1.eE) / e1.scE, Math.abs(e2.eE) / e2.scE],
      stateEqualsEvent: Object.is(st2.I, e2.I1) && Object.is(st2.E, e2.EsR), ledger: ledger(S) };
  }
  // (C) 離散の後の捕獲
  {
    const S = buildOf(HP, copyOf(HP, { extra: [CAPTURE_BODY] }));
    const g = HP.dfmFixedEject(S, 'direct');
    const e = pickEj(S.fixcap.ejLog[0]);
    const nc = HP.dfmFixedCaptureStep(S);
    const row = S.fixcap.log[0] || null;
    const st = stateRead(S);
    out.captureAfter = { ejected: g, captured: nc, event: e,
      row: row ? { Ic: row.Ic, EsC: row.EsC, In: row.In, spin0: row.spin0, spin1: row.spin1, mC: row.mC, mJ: row.mJ, Estar: row.Estar, eE: row.eE, scE: row.scE, relE: Math.abs(row.eE) / row.scE } : null,
      readsNewRI: !!row && Object.is(row.Ic, e.I1) && Object.is(row.EsC, e.EsR),
      dIc: row ? row.Ic - e.I1 : null, dEsC: row ? row.EsC - e.EsR : null,
      InExpect: row ? 0.5 * (row.mC + row.mJ) * REPRO_EJECT.rInertiaAfter * REPRO_EJECT.rInertiaAfter : null, state: st, ledger: ledger(S) };
  }
  // (D) 超過からの離散
  {
    const S = buildOf(HP, copyOf(HP, { extra: [OVERFLOW_CASE.body], fc: { rInertia: OVERFLOW_CASE.rInertia, overflowTo: 'eject' }, fe: OVERFLOW_CASE.eject }));
    const nc = HP.dfmFixedCaptureStep(S);
    const e = S.fixcap.ejLog[0] ? pickEj(S.fixcap.ejLog[0]) : null;
    const st = stateRead(S);
    out.overflow = { captured: nc, event: e, state: st, stateEqualsEvent: !!e && Object.is(st.I, e.I1) && Object.is(st.E, e.EsR),
      relE: e ? Math.abs(e.eE) / e.scE : null, ledger: ledger(S) };
  }
  // (E) ⏮(btnReset と同じ: 宣言の写しで build し直す)
  {
    const pr = copyOf(HP);
    const S = buildOf(HP, pr);
    HP.dfmFixedEject(S, 'direct');
    const after = stateRead(S);
    const S2 = buildOf(HP, pr);
    const st = stateRead(S2);
    out.reset = { afterEject: after, afterReset: st, ledger: ledger(S2), backToDeclared: st.rInertia === pr.fixedCapture.rInertia && S2.fixcap.nEject === 0 && S2.fixcap.eE === 0 && S2.fixcap.ejLog.length === 0 };
  }
  return out;
}

/** (F) 第288便a の正本の離散の行をいまの html で引き直す(正本は書き直さない)。 */
export function fixcapEjectRows(HP, JF) {
  const RT = EF.roundTrip(HP);
  const NC = EF.negativeControls(HP);
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const pairs = { roundTrip: [RT, JF.roundTrip], overflowEject: [NC.overflowEject, JF.negativeControls.overflowEject], negativeControls: [NC, JF.negativeControls] };
  const rows = Object.entries(pairs).map(([key, [now, canon]]) => {
    let nDiff = 0, worst = 0;
    const walk = (x, y) => {
      if (typeof x === 'number' && typeof y === 'number') { if (!Object.is(x, y)) { nDiff++; worst = Math.max(worst, rel(x, y)); } return; }
      if (x && y && typeof x === 'object' && typeof y === 'object') { for (const k of new Set(Object.keys(x).concat(Object.keys(y)))) walk(x[k], y[k]); return; }
      if (x !== y) nDiff++;
    };
    walk(now, canon);
    return { key, bitSame: same(now, canon), nDiff, worstRel: worst };
  });
  // どの事例も rInertiaAfter = rInertia(器 exp-w288a-fixcap.mjs の宣言を読む —— 往復は R_I ごとに同じ値・超過と宣言した歩は 0.01)
  const src = fs.readFileSync(path.join(ROOT, 'tests', 'exp-w288a-fixcap.mjs'), 'utf8');
  const sameRI = /rInertiaAfter: RI,/.test(src) && (src.match(/rInertiaAfter: 0\.01,/g) || []).length >= 3;
  return { rows, allBitSame: rows.every((r) => r.bitSame), rInertiaAfterEqualsRInertia: sameRI };
}

/** (G) ΔE_self の口座(fixcap の正本と (A) の値を読むだけ)。 */
export function selfAccount(JF, P) {
  const runs = JF.runs.concat([JF.radiusRun]).map((r) => {
    const L = r.capture.log, last = r.samples[r.samples.length - 1];
    let sum = 0, nNeg = 0, nPos = 0;
    for (const z of L) { sum += z.Upair; if (z.Upair < 0) nNeg++; else if (z.Upair > 0) nPos++; }
    return { key: r.key, nCap: L.length, nUpairNeg: nNeg, nUpairPos: nPos, sumUpair: sum, EselfFinal: last.cap.Eself, sumEqualsFinal: Object.is(sum, last.cap.Eself),
      centerEs0: r.supply.centerEs0, centerEs1: r.supply.centerEs1, maxAbsMeshE: r.supply.maxAbsMeshE };
  });
  const rt = JF.roundTrip.rows.map((z) => ({ rInertia: z.rInertia, EselfEnd: z.EselfEnd }));
  return { runs, roundTrip: rt,
    ejectNoCapture: { Eself: P.repro.EselfAfter, expect: P.repro.EselfExpect, rel: P.repro.EselfRel, positive: P.repro.EselfAfter > 0 },
    twiceEself: P.twice.ledger.Eself,
    reading: 'E_self = Σ(合体で消えた U_pair) − Σ(離散で生まれた U_pair(c′,e))。R_I・質量分布・構造則に依らない —— 収支調整の口座(自己束縛エネルギーではない)' };
}

/** 回転行列(z-x-z の Euler 角)。 */
function rotZXZ([a, b, c]) {
  const ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b), cc = Math.cos(c), sc = Math.sin(c);
  return [[ca * cc - sa * cb * sc, -ca * sc - sa * cb * cc, sa * sb], [sa * cc + ca * cb * sc, -sa * sc + ca * cb * cc, -ca * sb], [sb * sc, sb * cc, cb]];
}
const mulMV = (M, v) => M.map((r) => r[0] * v[0] + r[1] * v[1] + r[2] * v[2]);
/** R diag(I) Rᵀ(対称化して丸めの非対称を消す)。 */
function tensorOf(R, I) {
  const T = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) { let s = 0; for (let k = 0; k < 3; k++) s += R[i][k] * I[k] * R[j][k]; T[i][j] = s; }
  for (let i = 0; i < 3; i++) for (let j = i + 1; j < 3; j++) { const m = 0.5 * (T[i][j] + T[j][i]); T[i][j] = m; T[j][i] = m; }
  return T;
}
/** (H) E_rot の口座の正本(AN96)—— 純関数だけ。 */
export function rotEnergy() {
  const S = ROT_SPEC;
  const single = [];
  for (const [I, W] of S.singleAxis) {
    const J = I * W, ref = J * J / (2 * I);
    const a = SP.rotEnergyAniso([I, I, I], [0, 0, J]), b = SP.rotEnergyAniso([[I, 0, 0], [0, I, 0], [0, 0, I]], [0, 0, J]);
    const c = SP.rotEnergyAniso([2 * I, 3 * I, I], [0, 0, J]);   // 主軸 1 本(他の主軸の I は違う)
    const half = 0.5 * I * W * W;
    single.push({ I, omega: W, jSq2I: ref, halfIOmega2: half, principal: a, tensor: b, mixedPrincipal: c,
      rel: Math.max(rel(a, ref), rel(b, ref), rel(c, ref)), relHalf: rel(ref, half) });
  }
  const top = (T) => {
    const th = T.thetaDeg * Math.PI / 180, w3 = T.psiDot + T.phiDot * Math.cos(th);
    const J = [T.Iperp * T.phiDot * Math.sin(th), T.Iperp * T.thetaDot, T.Ipar * w3];
    const rigid = SP.rigidErot(T.Ipar, T.Iperp, T.psiDot, T.phiDot, th, T.thetaDot);
    const aniso = SP.rotEnergyAniso([T.Iperp, T.Iperp, T.Ipar], J);
    const jsq = SP.jSquaredOver2I(T.Ipar, T.Iperp, w3, T.phiDot, th, T.thetaDot, T.Ipar);
    return { J, rigid, aniso, jSq2Ipar: jsq, relRigid: rel(aniso, rigid), residual: rigid - jsq, residualRel: rel(rigid, jsq) };
  };
  const tri = S.triaxial, R = rotZXZ(tri.euler);
  const E0 = SP.rotEnergyAniso(tri.I.slice(), tri.J.slice());
  const Er = SP.rotEnergyAniso(tensorOf(R, tri.I), mulMV(R, tri.J));
  const Jsq = tri.J.reduce((s, v) => s + v * v, 0);
  // 回転した座標で単一の主軸(第 3 軸)に沿う J —— 主軸の座標では ½J²/I₃
  const Jax = mulMV(R, [0, 0, tri.I[2] * 2]), Eax = SP.rotEnergyAniso(tensorOf(R, tri.I), Jax), Eax0 = (tri.I[2] * 2) * (tri.I[2] * 2) / (2 * tri.I[2]);
  const refuse = [
    { key: 'zeroMoment', E: SP.rotEnergyAniso([1, 0, 1], [1, 1, 1]) },
    { key: 'negativeMoment', E: SP.rotEnergyAniso([1, -2, 1], [1, 1, 1]) },
    { key: 'notSymmetric', E: SP.rotEnergyAniso([[1, 0.1, 0], [0, 1, 0], [0, 0, 1]], [1, 1, 1]) },
    { key: 'notPositiveDefinite', E: SP.rotEnergyAniso([[1, 2, 0], [2, 1, 0], [0, 0, 1]], [1, 1, 1]) },
  ].map((z) => ({ key: z.key, isNaN: Number.isNaN(z.E) }));
  const out = { single, worstSingleRel: Math.max(...single.map((z) => z.rel)),
    top: top(S.top), sphere: top(S.sphere),
    triaxial: { I: tri.I, J: tri.J, E: E0, closed: 0.5 * (1 + 0.5 + 1 / 3), relClosed: rel(E0, 0.5 * (1 + 0.5 + 1 / 3)), rotated: Er, relFrame: rel(Er, E0),
      jSq2I: tri.I.map((I) => Jsq / (2 * I)), axisRotated: Eax, axisClosed: Eax0, relAxisRotated: rel(Eax, Eax0) },
    refuse };
  out.ok = out.worstSingleRel <= S.singleRelMax && out.top.relRigid <= S.rigidRelMax && out.sphere.relRigid <= S.rigidRelMax && out.sphere.residual === 0
    && Math.abs(out.top.residual) > 1e-6 && out.triaxial.relClosed <= S.rigidRelMax && out.triaxial.relFrame <= S.frameRelMax && out.triaxial.relAxisRotated <= S.frameRelMax
    && refuse.every((z) => z.isNaN);
  return out;
}

/** 前後の表(基点 ae29b8a の宣言値 → いまの html)。 */
export function beforeAfterOf(now) {
  const B = BEFORE_AE29.summary;
  return {
    reproStateI: [B.repro.stateI, now.repro.stateI], reproStateE: [B.repro.stateE, now.repro.stateE], reproEvent: [now.repro.eventI, now.repro.eventE],
    interEventDE: [B.twice.dE, now.twice.dE], secondK: [B.twice.K2, now.twice.K2],
    captureEsC: [B.capture.EsC, now.capture.EsC], captureEstar: [B.capture.Estar, now.capture.Estar], captureSpin1: [B.capture.spin1, now.capture.spin1],
    overflowStateE: [B.overflow.stateE, now.overflow.stateE], resetRI: [B.reset.afterResetRI, now.reset.afterResetRI],
    eventSame: B.repro.eventI === now.repro.eventI && B.repro.eventE === now.repro.eventE && B.overflow.eventE === now.overflow.eventE,
  };
}
/** 判定(宣言の規則 —— 引き継ぎの修正が効いたか・帳簿が閉じたままか)。 */
export function verdictOf(P, F, Rt) {
  const checks = {
    reproStateEqualsEvent: P.repro.stateEqualsEvent && P.repro.state.rInertia === REPRO_EJECT.rInertiaAfter,
    twiceContinuity: P.twice.continuityI && P.twice.continuityE && P.twice.stateEqualsEvent && P.twice.state2.rInertia === SECOND_EJECT.rInertiaAfter,
    ledgerZero: P.twice.eEeach.every((v) => Math.abs(v) <= 1e-12) && P.repro.ledger.eE === P.repro.event.eE && P.twice.relEeach.every((v) => v <= 1e-12),
    captureReadsNewRI: P.captureAfter.ejected === 1 && P.captureAfter.captured === 1 && P.captureAfter.readsNewRI && rel(P.captureAfter.row.In, P.captureAfter.InExpect) <= 1e-15,
    overflowCarry: P.overflow.captured === 1 && P.overflow.stateEqualsEvent && P.overflow.state.rInertia === OVERFLOW_CASE.rInertiaAfter && P.overflow.relE <= 1e-12,
    resetToDeclared: P.reset.backToDeclared && P.reset.afterEject.rInertia === REPRO_EJECT.rInertiaAfter,
    fixcapEjectRowsSame: F === null ? null : F.allBitSame,
    rotEnergy: Rt.ok,
  };
  return { checks, ok: Object.values(checks).every((v) => v === true || v === null) };
}

const g6 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : String(Number(x.toPrecision(6))));
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(3));
const e2 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toExponential(2));
/** PHYSICS〔第289便d〕の表の行(QA が正本から作り直して探す)。 */
export function docRows(J) {
  const B = J.before.summary, N = J.summary;
  const ba = [
    ['再現: 状態から読む I′', B.repro.stateI, N.repro.stateI, 'イベント ' + g6(N.repro.eventI)],
    ['再現: 状態から読む E′', B.repro.stateE, N.repro.stateE, 'イベント ' + g6(N.repro.eventE)],
    ['2 回連続: E_s,before(2 回目) − E_s,remaining(1 回目)', B.twice.dE, N.twice.dE, 'イベントをまたぐ連続'],
    ['2 回連続: 2 回目の K_eject', B.twice.K2, N.twice.K2, '帳簿の格納残差 ' + e2(N.twice.eE[1])],
    ['離散の後の捕獲: E_s,c', B.capture.EsC, N.capture.EsC, '離散の E_s,remaining ' + g6(N.repro.eventE)],
    ['離散の後の捕獲: E_*', B.capture.Estar, N.capture.Estar, ''],
    ['離散の後の捕獲: Ω′', B.capture.spin1, N.capture.spin1, ''],
    ['超過からの離散: 状態から読む E′', B.overflow.stateE, N.overflow.stateE, 'イベント ' + g6(N.overflow.eventE)],
    ['⏮ の後の R_I', B.reset.afterResetRI, N.reset.afterResetRI, '宣言 1.5'],
  ].map(([q, b, n, note]) => `| ${q} | ${g6(b)} | ${g6(n)} | ${note} |`);
  const self = J.selfAccount.runs.map((r) => `| ${r.key} | ${r.nCap} | ${r.nUpairNeg}/${r.nUpairPos} | ${f3(r.sumUpair)} | ${r.sumEqualsFinal ? '一致' : '不一致'} | ${f3(r.centerEs0)} → ${f3(r.centerEs1)} | ${f3(r.maxAbsMeshE)} |`);
  const R = J.rotEnergy;
  const rot = [
    `| 単一軸(5 例・主軸の 3 成分/3×3/他の主軸が違う) | ${e2(R.worstSingleRel)} | \\|J\\|²/(2I) との最大相対差 |`,
    `| 対称こま I_∥=${J.spec.rot.top.Ipar}・I_⊥=${J.spec.rot.top.Iperp}・θ=${J.spec.rot.top.thetaDeg}° | ${e2(R.top.relRigid)} | 剛体式との相対差・診断列(剛体式 − \\|J\\|²/(2I_∥))= ${g6(R.top.residual)} |`,
    `| 球 I_∥=I_⊥=${J.spec.rot.sphere.Ipar} | ${e2(R.sphere.relRigid)} | 診断列 = ${g6(R.sphere.residual)} |`,
    `| 三軸 I=(1,2,3)・J=(1,1,1) | ${e2(R.triaxial.relClosed)} | 閉形式 ${g6(R.triaxial.closed)}・座標回転の不変 ${e2(R.triaxial.relFrame)} |`,
  ];
  return { beforeAfter: ba, self, rot };
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN && process.argv.includes('--probe')) {
  const html = process.argv[process.argv.indexOf('--probe') + 1];
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const { HP } = loadHtmlMain(path.isAbsolute(html) ? html : path.join(ROOT, html));
  process.stdout.write(JSON.stringify(probe(HP)));
} else if (IS_MAIN) {
  const TARGET = process.env.QA_TARGET || 'beta/index.html';
  const OUT_PATH = process.env.W289D_OUT || path.join(ROOT, 'tests', 'out', 'ejectstate-w289d.json');
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const t0 = Date.now();
  const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
  const P = probe(HP);
  console.log(`(A) 再現: イベント I′ ${P.repro.event.I1}・E′ ${P.repro.event.EsR} / 状態 I′ ${P.repro.state.I}・E′ ${P.repro.state.E}(R_I ${P.repro.state.rInertia})・一致 ${P.repro.stateEqualsEvent}`);
  console.log(`(B) 2 回連続: I0₂−I1₁ ${P.twice.dI}・E_s,before₂−E_s,remaining₁ ${P.twice.dE}・eE ${JSON.stringify(P.twice.eEeach)}・状態 R_I ${P.twice.state2.rInertia}`);
  console.log(`(C) 離散の後の捕獲: I_c−I1 ${P.captureAfter.dIc}・E_s,c−E_s,remaining ${P.captureAfter.dEsC}・新しい R_I を読む ${P.captureAfter.readsNewRI}`);
  console.log(`(D) 超過からの離散: 状態 R_I ${P.overflow.state.rInertia}・状態 = イベント ${P.overflow.stateEqualsEvent}`);
  console.log(`(E) ⏮: R_I ${P.reset.afterEject.rInertia} → ${P.reset.afterReset.rInertia}・宣言に戻る ${P.reset.backToDeclared}`);
  const JF = JSON.parse(fs.readFileSync(path.join(ROOT, FIXCAP_CANON), 'utf8'));
  const F = fixcapEjectRows(HP, JF);
  console.log(`(F) fixcap の正本の離散の行: ${F.rows.map((r) => r.key + ' ' + (r.bitSame ? 'ビット同一' : '差 ' + r.nDiff)).join('・')}`);
  const G = selfAccount(JF, P);
  console.log(`(G) ΔE_self: 合体の U_pair<0 ${G.runs.reduce((s, r) => s + r.nUpairNeg, 0)}/${G.runs.reduce((s, r) => s + r.nCap, 0)}・Σ = 最終 ${G.runs.every((r) => r.sumEqualsFinal)}・捕獲の無い離散 E_self ${G.ejectNoCapture.Eself}(> 0)`);
  const Rt = rotEnergy();
  console.log(`(H) E_rot: 単一軸 ${Rt.worstSingleRel.toExponential(2)}・対称こま 剛体式 ${Rt.top.relRigid.toExponential(2)}・残差 ${Rt.top.residual}・球 ${Rt.sphere.residual}・座標回転 ${Rt.triaxial.relFrame.toExponential(2)}`);
  const V = verdictOf(P, F, Rt);
  console.log('判定 ' + JSON.stringify(V));
  let baseLive = null;
  if (process.env.W289D_BASE) {
    const txt = execFileSync(process.execPath, [fileURLToPath(import.meta.url), '--probe', process.env.W289D_BASE], { cwd: ROOT, maxBuffer: 1 << 26 }).toString();
    baseLive = JSON.parse(txt);
    if (JSON.stringify(summaryOf(baseLive)) !== JSON.stringify(BEFORE_AE29.summary)) { console.error('基点の測り直しが宣言値 BEFORE_AE29 と違う —— 宣言を見直すこと'); process.exit(1); }
    console.log('基点(子プロセス): ' + JSON.stringify({ repro: baseLive.repro.state, event: baseLive.repro.event.I1, twice: [baseLive.twice.dI, baseLive.twice.dE], cap: [baseLive.captureAfter.dIc, baseLive.captureAfter.dEsC] }));
  }
  const CODE = ['tests/exp-w289d-ejectstate.mjs', 'tests/exp-w288a-fixcap.mjs', 'tests/lib-w288a-fixcap.mjs', 'tests/lib-w288d-spinprec.mjs', 'tests/lib-w275e-powerball.mjs', 'tests/lib-w276c-axiswork.mjs',
    'tests/exp-w287a-growth.mjs', 'tests/lib-w287a-growth.mjs', 'tests/exp-w286a-cluster.mjs', 'tests/exp-w285a-cluster.mjs', 'tests/exp-w284a-cluster.mjs', 'tests/exp-w283f-cluster.mjs',
    'tests/lib-w280b-emgrid.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  const meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第289便d', target: TARGET, code: CODE, inputs: [TARGET, FIXCAP_CANON] }), {
    harnessVersion: HARNESS_VERSION, libVersion: SP.SPINPREC_VERSION, fixcapHarnessVersion: EF.HARNESS_VERSION, loadErrors: errors.length,
    ruling: '原仮定者の裁定(第79報)で閉じた AN95(h=0・Ω_max=20 は宣言値で物理上限ではない・overflowTo は熱を先行・離散トリガは逆写像のまま)・AN96(E_rot の口座の正本は剛体式・エンジンの |J|²/(2I) は変えない・割れたら残差を診断)・AN97(エンジンへ接続しない)',
    reading: '統括の検証項目 R122(離散の後の慣性半径の状態引き継ぎ・E_self の口座の意味・AN95/AN96/AN97 の文言)',
    engine: 'Node の headless(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・1 步も積分しない)',
    baseRev: 'ae29b8a', notClaim: ['離散が物理的に正しくなった', '口座を接続した', '自己束縛エネルギーを実装した', '新発見'] });
  const out = { meta, spec: { preset: PRESET, reproEject: REPRO_EJECT, secondEject: SECOND_EJECT, captureBody: CAPTURE_BODY, overflowCase: OVERFLOW_CASE, rot: ROT_SPEC },
    probe: P, summary: summaryOf(P), before: BEFORE_AE29, beforeAfter: beforeAfterOf(summaryOf(P)), fixcapEjectRows: F, selfAccount: G, rotEnergy: Rt, verdict: V, elapsedS: (Date.now() - t0) / 1000 };
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 1) + '\n');
  console.log('→ ' + path.relative(ROOT, OUT_PATH) + '(' + out.elapsedS.toFixed(1) + ' s)');
}
