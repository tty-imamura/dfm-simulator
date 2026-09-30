// 第288便a(原仮定者の裁定(第78報)⑤・統括の検証項目 R113・AN76/AN77/AN78)—— **固定中心の合体・離散の器**(🥜 fixedCaptureCopy)。
//
// ■ 何を測るか(**門は測る前に宣言** —— 下の `GATES`・`RUNS`・`VERDICT_RULE`・`PERTURB` を PHYSICS〔第288便a〕の結果より前に書いた)
//   ・🥜(🌰 と同じ初期状態・中心だけ pinned・`fixedCapture` 版 w288a-fixcap-1)を、順行(宣言)・逆行・真正面の 3 対照 × 乱数種 3 で走らせ、
//     **合体が止んだ後**の窓 [t_last + 1, t_last + 3] × T_dyn で保持率・半質量半径の変化・軸比を測る(閾値は 🌰 の門〔第287便a の GATES
//     = 💮 の門〕の値をそのまま読む・下げない)。合体の回数は門にしない。
//   ・帳簿: 合体ごとの M・E の格納残差(相対 ≤ 1e-12)・**J_pin**(持ち込み J と I′Ω′ の差 —— ピンが持ち去った分)・**P_pin**(固定近似の
//     運動量残差)・拘束仕事(0 の列)・ΔQ ≥ 0・超過の口座・配分器(tests/lib-w288a-fixcap.mjs)で行を作り直して一致(相対 1e-12)。
//     エネルギーの行と運動量の行は別に置く(固定中心は運動量と角運動量を保存しない —— ピンの力積 `pinImpulse` も別欄)。
//   ・`centerSpin:"read"` の場が粒子へした仕事の供給源(トイの帳簿の補償値 E_mesh = −E_toy の累積)を、中心の自転エネルギー
//     E_s,c=½I_cΩ_c²(I_c=½M R_I²)と並べて記録する(**有限の中心スピンで支えたとは数えない** —— 測って記録するだけ)。
//   ・半径別の D_g(r)・符号つき η_mesh(r)・F_r(🌰 の器 `diagOf` をそのまま使う)・摂動後の復元(🌰 と同じ規則)。
//   ・**同じ初期状態**: 🌰 の variant と 🥜 の variant を同じ spec で build し、pinned の旗以外の初期状態がビット一致することを示してから、
//     🌰 の正本 tests/out/growth-w287a.json の同じ鍵の走行と並べる(🌰 の正本は読むだけ)。
//   ・**半径対照**(AN77): R_I=0.01(本体半径)と 1.5 で**同じ捕獲列**(順行 seed0 の合体の記録)から Ω′ の列を配分器で作り直す(上限なし)+
//     R_I=0.01 のエンジン走行(Ω_max=20・超過は熱)。
//   ・負の対照(エンジンの関数を直接呼ぶ最小の宇宙): 真正面・無自転は符号を選ばず全部を熱へ(Ω′=0・J_pin=0)/ 真正面・自転ありは J を作らず
//     J_pin に落ちる / 逆行でも |Ω| は増え得る(順行と同じ |v| で同じ Ω′ —— 🌰 とは違う)/ E_* < 0 の拒否 / 非束縛の拒否 /
//     超過の受け皿 null の拒否 と heat・precession・eject の 3 口座。
//   ・離散(逆写像): h=0 の合体 → 同じ位置・同じ速度での離散の往復(M・E の残差・J_pin/P_pin の符号反転・状態の戻り)・K<0 の拒否・
//     宣言した歩の放出(trigger {atStep})と超過からの放出(trigger "overflow")。
//   ・受理器の事例(自由中心・thermal:"tint"・h/Ω_max/R_I 未宣言・centerCapture との併用・柵を越える Ω_max・受け皿の無い eject の拒否)。
//
// ■ しないこと・言わないこと
//   ・🌰・💮 を 1 bit も変えない(🌰 の正本は読むだけ)。門を動かさない。観測値と突き合わせない。
//   ・「固定中心で閉鎖系になった」「有限の中心スピンで支えた」「合体で必ず Ω が増す」「合体で自転が増えて斥力になった」「星団が落ち着いた」
//     「形状が安定した」と書かない(門の語は形状達成/未達だけ)。2D の面内運動を渦伸長と呼ばない。
//
// 実行(Node だけ): node tests/exp-w288a-fixcap.mjs   (並列: W288A_WORKERS —— 既定 2。結果は並列数に依らない)
// 読む正本: tests/out/growth-w287a.json(🌰 の同じ鍵の走行と並べるだけ —— 段 growth287 の後)。正本: tests/out/fixcap-w288a.json
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import * as E283 from './exp-w283f-cluster.mjs';
import * as E287 from './exp-w287a-growth.mjs';
import * as LF from './lib-w288a-fixcap.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
const REGEN_SCOPE = {"presets":["clusterAnalogyBH","clusterGrowthCopy","fixedCaptureCopy","galaxyAnalogyBH","gas"],"roots":["$","CENTER_CAPTURE_VERSION","CONTACT_MODE_KEY","DT","FIXED_CAPTURE_VERSION","HP.allPresets","HP.dfmCenterCaptureStep","HP.dfmField","HP.dfmFieldContract","HP.dfmFieldContractOf","HP.dfmFieldSnapshot","HP.dfmFixedCaptureStep","HP.dfmFixedEject","HP.dfmMeshVelocityFieldAt","HP.frameWeightIsPull","HP.frameWeightPow","HP.sim","HP.validatePreset","T","centerCaptureCheck","ch","contactNoneOf","ctx","cw","dfmCenterCaptureStep","dfmField","dfmFieldContract","dfmFixedCaptureStep","dfmFixedEject","dfmGeoToySpinStep","fixedCaptureCheck","geoCoreDispatch","jeansRowsVelocities","jeansSigma2Profile","lensExcludedRows","rayHeavy","rayMassMin","sim","traceRay","validatePreset"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w288a-fixcap-1';
export const PRESET = 'fixedCaptureCopy';
export const FREE_PRESET = 'clusterGrowthCopy';
export const GROWTH_CANON = 'tests/out/growth-w287a.json';
export const DT = E287.DT;
export const SEEDS = E287.SEEDS;

/** 門(測る前に宣言 —— 閾値は 🌰 の門〔第287便a の GATES = 💮 の門〕の値をそのまま読む)。 */
export const GATES = Object.freeze({
  version: 'w288a-gates-1',
  thresholdsFrom: 'tests/exp-w287a-growth.mjs GATES(' + E287.GATES.version + ')',
  population: '中心を除く全粒子(質量重み)—— 合体した質量は保持に数える(🌰 と同じ)',
  window: E287.GATES.window,
  nanMax: 0,
  retentionMin: E287.GATES.retentionMin, retentionRadiusOverD: E287.GATES.retentionRadiusOverD,
  halfMassRelChangeMax: E287.GATES.halfMassRelChangeMax,
  axisRatioMin: E287.GATES.axisRatioMin,
  toyEnergyCloseAbsMax: 0,
  clampMax: 0,
  ledgerRelMax: 1e-12,
});
export const GATE_TEXT = [
  `窓 = 合体が止んだ後 [t_last + ${GATES.window.afterQuietDyn}, t_last + ${GATES.window.afterQuietDyn + GATES.window.lenDyn}] × T_dyn(t_last = 最後の合体の時刻・標本 ${GATES.window.sampleEveryDyn} T_dyn ごと・${GATES.window.maxDyn} T_dyn までに合体が止まなければ未達)—— 🌰 と同じ`,
  `保持率(固定中心から r ≤ ${GATES.retentionRadiusOverD} D の質量 + 合体した質量)/(中心を除く初期の質量)≥ ${GATES.retentionMin.toFixed(2)}`,
  `半質量半径(中心を除く全粒子・質量重み)の変化 ≤ ${(GATES.halfMassRelChangeMax * 100).toFixed(0)}%(窓の最初の標本に対して)`,
  `軸比(1/r² 重みの慣性テンソル・質量重み)≥ ${GATES.axisRatioMin}`,
  `NaN ${GATES.nanMax}・E_toy+E_mesh = ${GATES.toyEnergyCloseAbsMax}(厳密)・エンジンの安全上限(速度 100・スピン ±40)の発火 ${GATES.clampMax}・合体の帳簿の M・E の格納残差 ≤ ${GATES.ledgerRelMax}(相対)・ΔQ ≥ 0・配分器で作り直した行と一致`,
  `合体の回数は門にしない(記録するだけ)。J_pin・P_pin は門にしない(0 でないことを記録する —— 固定中心の帳簿の別口座)`,
];
export const ORBITS = E287.ORBITS;
export const RUNS = Object.freeze(ORBITS.flatMap((o) => [0, 1, 2].map((s) => Object.freeze({ key: `${o.key}-seed${s}`, orbit: o.key, seed: s }))));
/** 半径対照(AN77 —— R_I だけを本体半径 0.01 へ。Ω_max=20・超過は熱のまま)。 */
export const RADIUS_RUN = Object.freeze({ key: 'pro-seed0-RI0.01', orbit: 'pro', seed: 0, rInertia: 0.01, info: true });
export const VERDICT_RULE = Object.freeze({ version: 'w288a-verdict-1',
  text: '宣言の構成(順行)が乱数種 3 つすべてで形状達成なら「形状達成」、そうでなければ「未達」(逆行・真正面・R_I=0.01 は対照の記録)' });
export const PERTURB = E287.PERTURB;
export const DIAG = E287.DIAG;
/** 半径対照の配分器の再計算(同じ捕獲列)。 */
export const RADIUS_REPLAY = Object.freeze({ version: 'w288a-rireplay-1', from: 'pro-seed0', rInertia: Object.freeze([0.01, 1.5]), omega0: 12, M0: 25,
  rule: '順行 seed0 の合体の記録(K_in・E_s,j・ΔU₃・m_j の列)を、中心 Ω=12・M=25 から R_I だけを替えて配分器 allocate に順に通す(h=0・上限なし —— Ω_max=1e300)' });

const clone = (o) => JSON.parse(JSON.stringify(o));
const rel = (a, b) => (a === b ? 0 : Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b), 1e-300));
const byId = (HP, id) => HP.allPresets().find((q) => q.id === id);

/** 写し(器の中だけ)。orbit・seed・R_I・h・Ω_max・overflowTo を替える。 */
export function variantPreset(HP, spec, id = PRESET) {
  const p = clone(byId(HP, id));
  p.seed = SEEDS[spec.seed || 0];
  for (const b of p.bodies) {
    if (b.type !== 'disk') continue;
    if (spec.orbit === 'retro') { b.bulkVx = -b.bulkVx; b.bulkVy = -b.bulkVy; }
    else if (spec.orbit === 'head') { b.bulkVx = 0; b.bulkVy = 0; }
  }
  if (id === PRESET && spec.rInertia !== undefined) p.fixedCapture.rInertia = spec.rInertia;
  return p;
}
export function buildSpec(HP, spec, id = PRESET) {
  const v = HP.validatePreset(variantPreset(HP, spec, id));
  if (!v.ok) throw new Error('validatePreset(' + spec.key + '): ' + (v.errors || []).join(' / '));
  HP.sim.build(v.preset);
  return { S: HP.sim, preset: v.preset };
}
const totalMass = (S) => { let M = 0; for (let i = 0; i < S.n; i++) M += S.m[i]; return M; };

/** 1 標本(門の量 + 帳簿の口座 + トイの補償値)。 */
export function measure(S, ic, Rret, M0other) {
  const cx = S.x[ic], cy = S.y[ic], cvx = S.vx[ic], cvy = S.vy[ic];
  let nan = 0; for (let i = 0; i < S.n; i++) if (!(Number.isFinite(S.x[i]) && Number.isFinite(S.y[i]) && Number.isFinite(S.vx[i]) && Number.isFinite(S.vy[i]))) nan++;
  const rs = [];
  let Min = 0, a = 0, b = 0, c = 0, w = 0;
  for (let i = 0; i < S.n; i++) {
    if (i === ic) continue;
    const dx = S.x[i] - cx, dy = S.y[i] - cy, r = Math.hypot(dx, dy), m = S.m[i];
    rs.push({ r, m });
    if (r <= Rret) { Min += m; if (r > 0) { a += m * dx * dx / (r * r); b += m * dx * dy / (r * r); c += m * dy * dy / (r * r); w += m; } }
  }
  rs.sort((p, q) => p.r - q.r);
  let Mo = 0; for (const z of rs) Mo += z.m;
  let acc = 0, rh = null; for (const z of rs) { acc += z.m; if (acc >= 0.5 * Mo) { rh = z.r; break; } }
  const C = S.fixcap;
  const axis = w > 0 ? E283.axisRatio2(a / w, b / w, c / w) : null;
  let Px = 0, Py = 0, Lp = 0; for (let i = 0; i < S.n; i++) { if (i === ic) continue; Px += S.m[i] * S.vx[i]; Py += S.m[i] * S.vy[i]; Lp += S.m[i] * ((S.x[i] - cx) * S.vy[i] - (S.y[i] - cy) * S.vx[i]); }
  const Ic = 0.5 * S.m[ic] * C.rInertia * C.rInertia;
  return { t: S.t, nan, n: S.n, retention: (Min + C.M) / M0other, rh, axis,
    center: { m: S.m[ic], spin: S.spin[ic], Ic, Es: 0.5 * Ic * S.spin[ic] * S.spin[ic], x: cx, y: cy, vx: cvx, vy: cvy, pinned: S.pinned[ic] },
    toyEclose: S.geoToyE + S.geoToyEmesh, toyE: S.geoToyE, meshE: S.geoToyEmesh, stop: (S.geoToyStop === undefined) ? null : S.geoToyStop,
    P: [Px, Py], Lorb: Lp, Pmesh: [S.geoToyMeshPx, S.geoToyMeshPy], clampV: S.clampVN || 0, clampS: S.clampSN || 0,
    cap: { n: C.nCap, cand: C.nCand, refBound: C.nRefBound, refEnergy: C.nRefEnergy, refOverflow: C.nRefOverflow, nOverflow: C.nOverflow, heatAll: C.nHeatAll,
      M: C.M, Eself: C.Eself, Q: C.Q, Qover: C.Qover, Eprec: C.Eprec, Epend: C.Epend, Jpin: C.Jpin, Ppin: [C.PpinX, C.PpinY], Wcon: C.Wcon, eE: C.eE, eM: C.eM } };
}

/** 門の判定(窓の標本だけ —— QA が正本の標本から作り直す純関数。🌰 の gateEval と同じ規則)。 */
export function gateEval(samples, win, extra) {
  const W = samples.filter((z) => z.t >= win[0] - 1e-9 && z.t <= win[1] + 1e-9);
  const pass = {}, worst = {};
  if (!W.length || extra.notQuiet) return { nWindow: W.length, worst, pass: { quiet: false }, failed: ['notQuiet'], verdict: '未達' };
  const ref = W[0];
  worst.nan = Math.max(...samples.map((z) => z.nan)); pass.nan = worst.nan <= GATES.nanMax;
  worst.retention = Math.min(...W.map((z) => z.retention)); pass.retention = worst.retention >= GATES.retentionMin;
  worst.rhRelChange = Math.max(...W.map((z) => Math.abs(z.rh / ref.rh - 1))); pass.rh = worst.rhRelChange <= GATES.halfMassRelChangeMax;
  worst.axis = Math.min(...W.map((z) => z.axis)); pass.axis = worst.axis >= GATES.axisRatioMin;
  worst.toyEclose = Math.max(...samples.map((z) => Math.abs(z.toyEclose))); pass.toyEclose = worst.toyEclose <= GATES.toyEnergyCloseAbsMax;
  const last = samples[samples.length - 1];
  worst.clamp = last.clampV + last.clampS; pass.clamp = worst.clamp <= GATES.clampMax;
  worst.ledgerRel = extra.ledgerRel; pass.ledger = extra.ledgerRel <= GATES.ledgerRelMax && extra.qMin >= 0 && extra.allocOk === true;
  pass.stop = samples.every((z) => z.stop === null);
  const failed = Object.keys(pass).filter((k) => pass[k] === false);
  return { nWindow: W.length, tRef: ref.t, worst, pass, failed, verdict: failed.length === 0 ? '形状達成' : '未達' };
}

/** 帳簿の要約(合体ごとの格納残差・配分器での作り直し・J_pin/P_pin・Ω′ の向き)。 */
export function ledgerSummary(log, decl) {
  let rE = 0, eM = 0, qMin = Infinity, allocWorst = 0, allocOk = true, nUp = 0, nDown = 0, nJpinNZ = 0, nPpinNZ = 0, Jpin = 0, PpinX = 0, PpinY = 0, ovf = 0;
  for (const z of log) {
    rE = Math.max(rE, z.scE > 0 ? Math.abs(z.eE) / z.scE : 0);
    eM = Math.max(eM, Math.abs(z.eM));
    qMin = Math.min(qMin, z.dQ);
    const A = LF.allocate({ Kin: z.Kin, EsC: z.EsC, EsJ: z.EsJ, dU: z.Upair + z.dU3pre, dEself: z.Upair, h: decl.h, I: z.In, s: z.s, omegaMax: decl.omegaMax, overflowTo: decl.overflowTo });
    if (!A.ok) allocOk = false;
    else {
      const e = Math.max(rel(A.Estar, z.Estar), rel(A.EsP, z.EsP), rel(A.dQ, z.dQ), rel(A.omega, z.spin1), rel(A.overflow, z.ovf));
      allocWorst = Math.max(allocWorst, e);
    }
    if (Math.abs(z.spin1) > Math.abs(z.spin0)) nUp++; else if (Math.abs(z.spin1) < Math.abs(z.spin0)) nDown++;
    if (z.Jpin !== 0) nJpinNZ++;
    if (z.PpinX !== 0 || z.PpinY !== 0) nPpinNZ++;
    Jpin += z.Jpin; PpinX += z.PpinX; PpinY += z.PpinY; ovf += z.ovf;
  }
  if (allocWorst > 1e-12) allocOk = false;
  return { n: log.length, relE: rE, absEM: eM, ledgerRel: rE, qMin: log.length ? qMin : 0, allocWorst, allocOk,
    nSpinUp: nUp, nSpinDown: nDown, nJpinNonZero: nJpinNZ, nPpinNonZero: nPpinNZ, Jpin, Ppin: [PpinX, PpinY], overflow: ovf };
}

/** 1 走行(合体が止むまで → 窓 → 摂動の復元)。 */
export function runOne(HP, spec) {
  const t0 = Date.now();
  const { S, preset } = buildSpec(HP, spec);
  const decl = preset.fixedCapture;
  const D = Math.hypot(preset.bodies[1].cx, preset.bodies[1].cy);
  const Tdyn = E287.tdynOf(S, D), Rret = GATES.retentionRadiusOverD * D;
  let M0other = 0; for (let i = 1; i < S.n; i++) M0other += S.m[i];
  const stepsPer = Math.round(GATES.window.sampleEveryDyn * Tdyn / DT);
  const need = GATES.window.afterQuietDyn + GATES.window.lenDyn;
  const ic = () => S.fixcap.i;
  const samples = [measure(S, ic(), Rret, M0other)], diags = [{ t: 0, d: E287.diagOf(HP, S, ic()) }];
  let k = 0, tLast = 0, nCapPrev = 0, notQuiet = false, maxAbsMesh = 0;
  for (;;) {
    S.step(DT); k++;
    maxAbsMesh = Math.max(maxAbsMesh, Math.abs(S.geoToyEmesh));
    if (S.fixcap.nCap !== nCapPrev) { nCapPrev = S.fixcap.nCap; tLast = S.t; }
    if (k % stepsPer === 0) { samples.push(measure(S, ic(), Rret, M0other)); diags.push({ t: S.t, d: E287.diagOf(HP, S, ic()) }); }
    if (k % stepsPer === 0 && S.t >= tLast + need * Tdyn - 1e-9) break;
    if (S.t >= GATES.window.maxDyn * Tdyn) { notQuiet = S.t < tLast + need * Tdyn; break; }
  }
  const win = [tLast + GATES.window.afterQuietDyn * Tdyn, tLast + need * Tdyn];
  const L = ledgerSummary(S.fixcap.log, decl);
  const gates = gateEval(samples, win, { notQuiet, ledgerRel: L.ledgerRel, qMin: L.qMin, allocOk: L.allocOk });
  const kEnd = k, stateEnd = []; for (let i = 0; i < S.n; i++) stateEnd.push(S.x[i], S.y[i]);
  const wallMain = (Date.now() - t0) / 1000;
  const first = samples[0], last = samples[samples.length - 1];
  // ピンの力積(粒子 + メッシュの運動量の変化 + 合体で持ち去った P_pin —— 重力でピンが粒子へ与えた分)
  const pinImpulse = [last.P[0] + last.Pmesh[0] - first.P[0] - first.Pmesh[0] + L.Ppin[0], last.P[1] + last.Pmesh[1] - first.P[1] - first.Pmesh[1] + L.Ppin[1]];
  const supply = { toyE: last.toyE, meshE: last.meshE, maxAbsMeshE: maxAbsMesh, centerEs0: first.center.Es, centerEs1: last.center.Es,
    ratioMeshToEs0: first.center.Es > 0 ? maxAbsMesh / first.center.Es : null,
    note: 'E_mesh = −E_toy(トイが粒子へした仕事の補償値の累積 —— 無制限の口座)。中心の自転エネルギー E_s,c は合体でだけ変わる(トイの仕事は中心の自転を減らさない)' };
  const capLog = S.fixcap.log.map((z) => ({ t: z.t, id: z.id, d: z.d, mJ: z.mJ, Kin: z.Kin, Upair: z.Upair, dU3: z.dU3, dU3pre: z.dU3pre, EsC: z.EsC, EsJ: z.EsJ, Estar: z.Estar,
    s: z.s, h: z.h, EsP: z.EsP, dQ: z.dQ, ovf: z.ovf, ovfTo: z.ovfTo, omRaw: z.omRaw, In: z.In, spin0: z.spin0, spin1: z.spin1, Jin: z.Jin, Jorb: z.Jorb, Jpin: z.Jpin,
    PpinX: z.PpinX, PpinY: z.PpinY, Wcon: z.Wcon, eM: z.eM, eE: z.eE, scE: z.scE }));
  // 摂動後の復元(🌰 と同じ規則)
  const lenP = Math.round(PERTURB.lenDyn / PERTURB.sampleEveryDyn), spP = stepsPer;
  const rhRef = [], rhPert = [];
  const rhOf = (Q) => measure(Q, Q.fixcap.i, Rret, M0other).rh;
  rhRef.push(rhOf(S));
  for (let s = 1; s <= lenP; s++) { for (let q = 0; q < spP; q++) S.step(DT); rhRef.push(rhOf(S)); }
  const { S: S2 } = buildSpec(HP, spec);
  for (let q = 0; q < kEnd; q++) S2.step(DT);
  let replaySame = S2.n === stateEnd.length / 2; if (replaySame) for (let i = 0; i < S2.n; i++) if (!Object.is(S2.x[i], stateEnd[2 * i]) || !Object.is(S2.y[i], stateEnd[2 * i + 1])) { replaySame = false; break; }
  const i2 = S2.fixcap.i, cx = S2.x[i2], cy = S2.y[i2];
  for (let i = 0; i < S2.n; i++) { if (i === i2) continue; S2.x[i] = cx + PERTURB.scale * (S2.x[i] - cx); S2.y[i] = cy + PERTURB.scale * (S2.y[i] - cy); }
  rhPert.push(rhOf(S2));
  for (let s = 1; s <= lenP; s++) { for (let q = 0; q < spP; q++) S2.step(DT); rhPert.push(rhOf(S2)); }
  const delta = rhPert.map((v, i) => v / rhRef[i] - 1);
  const lastN = Math.round(1 / PERTURB.sampleEveryDyn);
  const tail = delta.slice(-lastN).map(Math.abs), tailMean = tail.reduce((a, b) => a + b, 0) / tail.length;
  const restore = { replayBitSame: replaySame, delta, delta0: delta[0], tailMeanAbs: tailMean, restored: tailMean <= 0.5 * Math.abs(delta[0]) };
  const pick = (t) => diags.reduce((best, z) => (Math.abs(z.t - t) < Math.abs(best.t - t) ? z : best), diags[0]);
  return { key: spec.key, orbit: spec.orbit, seedIdx: spec.seed, seed: SEEDS[spec.seed], rInertia: decl.rInertia, info: !!spec.info,
    D, Tdyn, Rret, M0other, stepsPerSample: stepsPer, steps: kEnd, tLast, notQuiet, window: win,
    samples, diag: { t0: diags[0], winStart: pick(win[0]), winEnd: pick(win[1]) },
    capture: { summary: L, counts: last.cap, log: capLog, logTrim: S.fixcap.logTrim }, pinImpulse, supply,
    gates, restore, wallSec: wallMain, spentSec: (Date.now() - t0) / 1000 };
}

/** 同じ初期状態(🌰 と 🥜 を同じ spec で build —— pinned の旗以外がビット一致するか)。 */
export function sameInitCheck(HP) {
  const rows = [];
  for (const spec of RUNS) {
    const A = buildSpec(HP, spec, FREE_PRESET).S; const a = { n: A.n, m: Array.from(A.m.slice(0, A.n)), x: Array.from(A.x.slice(0, A.n)), y: Array.from(A.y.slice(0, A.n)), vx: Array.from(A.vx.slice(0, A.n)), vy: Array.from(A.vy.slice(0, A.n)), spin: Array.from(A.spin.slice(0, A.n)), pin: Array.from(A.pinned.slice(0, A.n)) };
    const B = buildSpec(HP, spec, PRESET).S; const b = { n: B.n, m: Array.from(B.m.slice(0, B.n)), x: Array.from(B.x.slice(0, B.n)), y: Array.from(B.y.slice(0, B.n)), vx: Array.from(B.vx.slice(0, B.n)), vy: Array.from(B.vy.slice(0, B.n)), spin: Array.from(B.spin.slice(0, B.n)), pin: Array.from(B.pinned.slice(0, B.n)) };
    let nd = 0; for (const k of ['m', 'x', 'y', 'vx', 'vy', 'spin']) for (let i = 0; i < Math.max(a[k].length, b[k].length); i++) if (!Object.is(a[k][i], b[k][i])) nd++;
    const pinDiff = a.pin.map((v, i) => (v !== b.pin[i] ? i : -1)).filter((i) => i >= 0);
    rows.push({ key: spec.key, n: [a.n, b.n], stateDiff: nd, pinDiffIdx: pinDiff });
  }
  return { rows, ok: rows.every((r) => r.stateDiff === 0 && r.n[0] === r.n[1] && JSON.stringify(r.pinDiffIdx) === '[0]') };
}

/** 最小の宇宙(🥜 の宣言の写しに bodies と fixedCapture の上書き)。 */
function mini(HP, bodies, fc = {}, extra = {}) {
  const p = clone(byId(HP, PRESET));
  p.bodies = bodies.map((b) => Object.assign({ type: 'single', vx: 0, vy: 0, spin: 0, pinned: false, radius: 0.01 }, b));
  Object.assign(p.fixedCapture, fc);
  Object.assign(p, extra);
  const v = HP.validatePreset(p); if (!v.ok) throw new Error(v.errors.join('/'));
  HP.sim.build(v.preset); return { S: HP.sim, preset: v.preset };
}
const center = (o = {}) => Object.assign({ m: 25, x: 0, y: 0, spin: 12, pinned: true }, o);

/** 負の対照(エンジンの合体関数を直接呼ぶ)。 */
export function negativeControls(HP) {
  const one = (key, c, part, fc = {}, third = null) => {
    const bodies = [center(c), Object.assign({ m: 0.425, x: -1, y: 0 }, part)]; if (third) bodies.push(third);
    const { S, preset } = mini(HP, bodies, Object.assign({ rInertia: 0.01 }, fc));
    const s0 = S.spin[0], n0 = S.n;
    const got = HP.dfmFixedCaptureStep(S);
    const C = S.fixcap, row = C.log[C.log.length - 1] || null;
    let alloc = null;
    if (row) { const A = LF.allocate({ Kin: row.Kin, EsC: row.EsC, EsJ: row.EsJ, dU: row.Upair + row.dU3pre, dEself: row.Upair, h: preset.fixedCapture.h, I: row.In, s: row.s, omegaMax: preset.fixedCapture.omegaMax, overflowTo: preset.fixedCapture.overflowTo });
      alloc = { ok: A.ok, rel: A.ok ? Math.max(rel(A.omega, row.spin1), rel(A.EsP, row.EsP), rel(A.dQ, row.dQ), rel(A.overflow, row.ovf)) : null }; }
    return { key, captured: got, n0, n1: S.n, spin0: s0, spin1: S.spin[0], m1: S.m[0], Jorb: row ? row.Jorb : null, Jin: row ? row.Jin : null, Jpin: row ? row.Jpin : null,
      Ppin: row ? [row.PpinX, row.PpinY] : null, Estar: row ? row.Estar : null, dQ: row ? row.dQ : null, ovf: row ? row.ovf : null, ovfTo: row ? row.ovfTo : null, s: row ? row.s : null,
      eE: row ? row.eE : null, refEnergy: C.nRefEnergy, refBound: C.nRefBound, refOverflow: C.nRefOverflow, Qover: C.Qover, Eprec: C.Eprec, Epend: C.Epend,
      nEject: C.nEject, alloc };
  };
  const ejectDecl = { fixedEject: { version: 'w288a-fixcap-1', mass: 0.2, rInertiaAfter: 0.01, rLaunch: 4, direction: { posDeg: 90, velDeg: 90 }, spinEject: 0, radiusEject: 0.01, trigger: 'overflow' } };
  const oneEj = (key) => {
    const { S } = mini(HP, [center(), { m: 0.425, x: -1.4, y: 0, vy: 2 }], { rInertia: 0.01, overflowTo: 'eject' }, ejectDecl);
    const got = HP.dfmFixedCaptureStep(S), C = S.fixcap, row = C.log[0] || null, ej = C.ejLog[0] || null;
    return { key, captured: got, n1: S.n, spin1: S.spin[0], m0: S.m[0], ovf: row ? row.ovf : null, nEject: C.nEject, Epend: C.Epend, ejK: ej ? ej.K : null, ejV: ej ? ej.v : null,
      ejRelE: ej ? Math.abs(ej.eE) / ej.scE : null, ejMass: ej ? ej.mE : null, ejJpin: ej ? ej.Jpin : null };
  };
  const cases = [
    one('headOnNoSpin', { spin: 0 }, { vx: 2 }),
    one('headOnSpin', { spin: 12 }, { vx: 2 }),
    one('retrograde', { spin: 12 }, { x: -1.4, vy: 0.5 }),
    one('prograde', { spin: 12 }, { x: -1.4, vy: -0.5 }),
    one('energyShort', { spin: 0 }, {}, {}, { type: 'single', m: 5, x: -3.2, y: 0 }),
    one('unbound', { spin: 12 }, { x: -1.4, vx: 20 }),
    one('overflowNull', { spin: 12 }, { x: -1.4, vy: 2 }, { overflowTo: null }),
    one('overflowHeat', { spin: 12 }, { x: -1.4, vy: 2 }, { overflowTo: 'heat' }),
    one('overflowPrecession', { spin: 12 }, { x: -1.4, vy: 2 }, { overflowTo: 'precession' }),
  ];
  const ejc = oneEj('overflowEject');
  const by = Object.fromEntries(cases.map((z) => [z.key, z]));
  const checks = {
    headOnNoSpinToHeat: by.headOnNoSpin.captured === 1 && by.headOnNoSpin.spin1 === 0 && by.headOnNoSpin.s === 0 && by.headOnNoSpin.Jpin === 0 && by.headOnNoSpin.dQ === by.headOnNoSpin.Estar,
    headOnJToPin: by.headOnSpin.captured === 1 && by.headOnSpin.Jorb === 0 && Math.abs(by.headOnSpin.spin1) > 12 && by.headOnSpin.Jpin < 0,
    retroRaisesSpin: by.retrograde.captured === 1 && by.retrograde.Jorb < 0 && by.retrograde.spin1 > 12,
    proRetroSameOmega: by.prograde.captured === 1 && by.prograde.Jorb > 0 && rel(by.prograde.spin1, by.retrograde.spin1) <= 1e-12 && by.prograde.Jpin !== by.retrograde.Jpin,
    energyRefused: by.energyShort.captured === 0 && by.energyShort.refEnergy === 1,
    unboundRefused: by.unbound.captured === 0 && by.unbound.refBound === 1,
    overflowNullRefused: by.overflowNull.captured === 0 && by.overflowNull.refOverflow === 1,
    overflowHeat: by.overflowHeat.captured === 1 && by.overflowHeat.spin1 === 20 && by.overflowHeat.Qover > 0 && by.overflowHeat.Qover === by.overflowHeat.ovf,
    overflowPrecession: by.overflowPrecession.captured === 1 && by.overflowPrecession.spin1 === 20 && by.overflowPrecession.Eprec > 0 && by.overflowPrecession.Qover === 0,
    overflowEject: ejc.captured === 1 && ejc.nEject === 1 && ejc.Epend === 0 && ejc.spin1 === 20 && ejc.ejK > 0 && ejc.ejRelE <= 1e-12,
    allocMatches: cases.every((z) => !z.alloc || (z.alloc.ok && z.alloc.rel <= 1e-12)),
    ledgerCloses: cases.every((z) => z.eE === null || Math.abs(z.eE) <= 1e-12 * (Math.abs(z.Estar) + 100)),
  };
  return { cases, overflowEject: ejc, checks, ok: Object.values(checks).every(Boolean) };
}

/** 離散の往復(h=0): 合体 → 同じ位置・同じ速度の向きで離散。周辺の 1 体(ΔU₃ を 0 にしない)を置く。 */
export function roundTrip(HP) {
  const rows = [];
  for (const RI of [0.01, 1.5]) {
    const { S } = mini(HP, [center(), { m: 0.425, x: -1.1, y: 0.4, vx: 0.3, vy: -0.25, radius: 0.01 }, { type: 'single', m: 1, x: 6, y: 2 }], { rInertia: RI });
    const st0 = { m: Array.from(S.m.slice(0, S.n)), x: Array.from(S.x.slice(0, S.n)), y: Array.from(S.y.slice(0, S.n)), vx: Array.from(S.vx.slice(0, S.n)), vy: Array.from(S.vy.slice(0, S.n)), spin: Array.from(S.spin.slice(0, S.n)) };
    const got = HP.dfmFixedCaptureStep(S), row = S.fixcap.log[0];
    const d = Math.hypot(st0.x[1], st0.y[1]), vIn = Math.hypot(st0.vx[1], st0.vy[1]);
    const spec = { version: 'w288a-fixcap-1', mass: st0.m[1], rInertiaAfter: RI, rLaunch: d, direction: { posDeg: Math.atan2(st0.y[1], st0.x[1]) * 180 / Math.PI, velDeg: Math.atan2(st0.vy[1], st0.vx[1]) * 180 / Math.PI },
      spinEject: 0, radiusEject: 0.01, omegaAfter: 12, trigger: { atStep: 1 } };
    const ejGot = HP.dfmFixedEject(S, 'direct', spec), ej = S.fixcap.ejLog[0];
    const j = S.n - 1;
    const back = { m: [S.m[0], S.m[j], S.m[1]], x: [S.x[j], S.x[1]], y: [S.y[j], S.y[1]], vx: S.vx[j], vy: S.vy[j], spin: S.spin[0] };
    rows.push({ rInertia: RI, captured: got, ejected: ejGot, n: S.n, Kin: row.Kin, Kej: ej.K, relK: rel(ej.K, row.Kin), scE: row.scE, relKscale: Math.abs(ej.K - row.Kin) / row.scE, vIn, vOut: ej.v, relV: rel(ej.v, vIn),
      spin: [st0.spin[0], row.spin1, S.spin[0]], M: [st0.m[0], row.mC + row.mJ, S.m[0]], dM: S.m[0] + S.m[j] - (st0.m[0] + st0.m[1]),
      JpinCap: row.Jpin, JpinEj: ej.Jpin, JpinSum: row.Jpin + ej.Jpin, PpinCap: [row.PpinX, row.PpinY], PpinEj: [ej.PpinX, ej.PpinY], PpinSum: [row.PpinX + ej.PpinX, row.PpinY + ej.PpinY],
      eEcap: row.eE, eEej: ej.eE, EselfEnd: S.fixcap.Eself,
      posErr: Math.max(Math.abs(back.x[0] - st0.x[1]), Math.abs(back.y[0] - st0.y[1])), velErr: Math.max(Math.abs(back.vx - st0.vx[1]), Math.abs(back.vy - st0.vy[1])) });
  }
  const ok = rows.every((r) => r.captured === 1 && r.ejected === 1 && r.relKscale <= 1e-12 && r.dM === 0 && r.spin[2] === 12
    && Math.sign(r.JpinCap) === -Math.sign(r.JpinEj) && Math.abs(r.JpinSum) <= 1e-12 * (Math.abs(r.JpinCap) + 1) && Math.abs(r.PpinSum[0]) <= 1e-12 && Math.abs(r.PpinSum[1]) <= 1e-12
    && r.posErr <= 1e-12 && r.velErr <= 1e-12 && Math.abs(r.EselfEnd) <= 1e-12);   // 差の尺度は捕獲の行の scE(E_s,c・|U|・K の和 —— R_I=1.5 では E_s,c≈2025 の打ち消しで K の相対は 1e-12 台)
  // K<0 の拒否(中心の自転 0・待ち口座 0 で、周辺の 1 体から遠ざかる向きへ置くと U_after > U_before —— 放出しない)と宣言した歩の放出
  const { S: Sn } = mini(HP, [center({ spin: 0 }), { m: 0.425, x: 10, y: 0 }], { rInertia: 0.01 });
  const negGot = HP.dfmFixedEject(Sn, 'direct', { version: 'w288a-fixcap-1', mass: 0.2, rInertiaAfter: 0.01, rLaunch: 4, direction: { posDeg: 180, velDeg: 180 }, spinEject: 0, radiusEject: 0.01, omegaAfter: 0, trigger: { atStep: 1 } });
  const negRow = Sn.fixcap.ejLog[0], negN = Sn.n;   // HP.sim は次の build で作り直されるので先に読む
  const { S: Sa } = mini(HP, [center(), { m: 0.425, x: 10, y: 0 }], { rInertia: 0.01 },
    { fixedEject: { version: 'w288a-fixcap-1', mass: 0.2, rInertiaAfter: 0.01, rLaunch: 4, direction: { posDeg: 90, velDeg: 90 }, spinEject: 0, radiusEject: 0.01, omegaAfter: 6, trigger: { atStep: 1 } } });
  const nA0 = Sa.n; Sa.step(DT);
  const atRow = Sa.fixcap.ejLog[0] || null;
  const atStep = { n: [nA0, Sa.n], nEject: Sa.fixcap.nEject, spin1: atRow ? atRow.spin1 : null, K: atRow ? atRow.K : null, relE: atRow ? Math.abs(atRow.eE) / atRow.scE : null, finite: [Sa.x[Sa.n - 1], Sa.vy[Sa.n - 1]].every(Number.isFinite) };
  const negOk = negGot === 0 && !!negRow && negRow.refused === 'energy' && negN === 2;
  const atOk = atStep.nEject === 1 && atStep.n[1] === nA0 + 1 && Math.abs(atStep.spin1) === 6 && atStep.K > 0 && atStep.relE <= 1e-12 && atStep.finite;
  return { rows, negative: { ejected: negGot, row: negRow, n: negN }, atStep, ok: ok && negOk && atOk, okRoundTrip: ok, okNegative: negOk, okAtStep: atOk };
}

/** 受理器の事例(拒否の理由を記録)。 */
export function contractCases(HP) {
  const base = () => clone(byId(HP, PRESET));
  const mk = (key, f, expectOk) => { const p = base(); f(p); const v = HP.validatePreset(p); return { key, ok: v.ok, expectOk, err: v.ok ? null : (v.errors || []).join(' / ').slice(0, 160) }; };
  const cases = [
    mk('declared', () => {}, true),
    mk('freeCenter', (p) => { p.bodies[0].pinned = false; }, false),
    mk('thermalTint', (p) => { p.thermal = 'tint'; }, false),
    mk('noH', (p) => { delete p.fixedCapture.h; }, false),
    mk('noOmegaMax', (p) => { delete p.fixedCapture.omegaMax; }, false),
    mk('noRInertia', (p) => { delete p.fixedCapture.rInertia; }, false),
    mk('noOverflowTo', (p) => { delete p.fixedCapture.overflowTo; }, false),
    mk('omegaMaxOverFence', (p) => { p.fixedCapture.omegaMax = 41; }, false),
    mk('withCenterCapture', (p) => { p.centerCapture = { version: 'w287a-capture-1', center: 0, rCap: 1.5, inertia: 'body' }; }, false),
    mk('ejectWithoutSink', (p) => { p.fixedCapture.overflowTo = 'eject'; }, false),
    mk('ejectAlone', (p) => { delete p.fixedCapture; p.fixedEject = { version: 'w288a-fixcap-1', mass: 0.2, rInertiaAfter: 1.5, rLaunch: 4, direction: { posDeg: 0, velDeg: 0 }, spinEject: 0, radiusEject: 0.01, trigger: 'overflow' }; }, false),
    mk('ejectInsideCap', (p) => { p.fixedEject = { version: 'w288a-fixcap-1', mass: 0.2, rInertiaAfter: 1.5, rLaunch: 1, direction: { posDeg: 0, velDeg: 0 }, spinEject: 0, radiusEject: 0.01, omegaAfter: 5, trigger: { atStep: 3 } }; }, false),
    mk('ejectAtStep', (p) => { p.fixedEject = { version: 'w288a-fixcap-1', mass: 0.2, rInertiaAfter: 1.5, rLaunch: 4, direction: { posDeg: 0, velDeg: 0 }, spinEject: 0, radiusEject: 0.01, omegaAfter: 5, trigger: { atStep: 3 } }; }, true),
    mk('overflowEject', (p) => { p.fixedCapture.overflowTo = 'eject'; p.fixedEject = { version: 'w288a-fixcap-1', mass: 0.2, rInertiaAfter: 1.5, rLaunch: 4, direction: { posDeg: 0, velDeg: 0 }, spinEject: 0, radiusEject: 0.01, trigger: 'overflow' }; }, true),
  ];
  // build も最後の門番(受理器を通らない内蔵の経路): 自由中心の宣言を build へ直に渡すと捕獲の状態は作られない
  const p = base(); p.bodies[0].pinned = false; HP.sim.build(p);
  const buildGate = { freeCenterFixcap: HP.sim.fixcap === null && HP.sim.hasFixedCapture === false };
  const ok = cases.every((z) => z.ok === z.expectOk) && buildGate.freeCenterFixcap;
  return { cases, buildGate, ok };
}

/** 半径対照(同じ捕獲列を R_I だけ替えて配分器に通す —— 上限なし)。 */
export function radiusReplay(log) {
  const out = {};
  for (const RI of RADIUS_REPLAY.rInertia) {
    let M = RADIUS_REPLAY.M0, om = RADIUS_REPLAY.omega0; const seq = [];
    let firstOver40 = null;
    for (let k = 0; k < log.length; k++) {
      const z = log[k], Mn = M + z.mJ, Ic = LF.inertia(M, RI), In = LF.inertia(Mn, RI);
      const A = LF.allocate({ Kin: z.Kin, EsC: 0.5 * Ic * om * om, EsJ: z.EsJ, dU: z.Upair + z.dU3pre, dEself: z.Upair, h: 0, I: In, s: Math.sign(om) || 0, omegaMax: 1e300, overflowTo: null });
      om = A.omega; M = Mn; seq.push(om);
      if (firstOver40 === null && Math.abs(om) > 40) firstOver40 = k + 1;
    }
    out['RI' + RI] = { rInertia: RI, omega: seq, first5: seq.slice(0, 5), final: seq[seq.length - 1], firstOver40 };
  }
  return out;
}

/** 判定(宣言の規則)。 */
export function verdictOf(runs) {
  const dec = runs.filter((r) => r.orbit === 'pro' && !r.info);
  const nPass = dec.filter((r) => r.gates.verdict === '形状達成').length;
  return { nDeclared: dec.length, nPass, verdict: (dec.length === 3 && nPass === 3) ? '形状達成' : '未達' };
}
/** 🌰 の正本の同じ鍵の走行と並べる(読むだけ)。 */
export function sideBySide(runs, G) {
  return runs.map((r) => { const g = G.runs.find((q) => q.key === r.key);
    const lastG = g.samples[g.samples.length - 1], lastF = r.samples[r.samples.length - 1];
    return { key: r.key,
      free: { verdict: g.gates.verdict, failed: g.gates.failed, retention: g.gates.worst.retention ?? null, rh: g.gates.worst.rhRelChange ?? null, axis: g.gates.worst.axis ?? null, nCap: g.capture.counts.n, spin: [g.samples[0].center.spin, lastG.center.spin], m: lastG.center.m, steps: g.steps },
      fixed: { verdict: r.gates.verdict, failed: r.gates.failed, retention: r.gates.worst.retention ?? null, rh: r.gates.worst.rhRelChange ?? null, axis: r.gates.worst.axis ?? null, nCap: r.capture.counts.n, spin: [r.samples[0].center.spin, lastF.center.spin], m: lastF.center.m, steps: r.steps } }; });
}

const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(3));
const e2 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toExponential(2));
/** PHYSICS〔第288便a〕の表の行(QA が正本から作り直して探す)。 */
export function docRows(J) {
  const out = { gates: GATE_TEXT.map((t) => '- ' + t), runs: [], ledger: [], eta: [], side: [] };
  for (const r of J.runs.concat(J.radiusRun ? [J.radiusRun] : [])) {
    const w = r.gates.worst || {}, c = r.capture.counts, L = r.capture.summary, z = r.samples[r.samples.length - 1].center;
    out.runs.push(`| ${r.key} | ${r.steps} | ${f3(r.tLast / r.Tdyn)} | ${c.n}/${c.refBound}/${c.refEnergy}/${c.refOverflow} | ${f3(r.samples[0].center.m)} → ${f3(z.m)} | ${f3(r.samples[0].center.spin)} → ${f3(z.spin)} | ${f3(w.retention)} | ${f3(w.rhRelChange)} | ${f3(w.axis)} | ${r.restore.restored ? '復元' : '復元せず'}(${f3(r.restore.delta0)} → ${f3(r.restore.tailMeanAbs)}) | ${r.gates.verdict}${r.gates.failed.length ? '(' + r.gates.failed.join('・') + ')' : ''} |`);
    out.ledger.push(`| ${r.key} | ${e2(L.ledgerRel)} | ${e2(L.allocWorst)} | ${f3(L.Jpin)} | ${f3(L.Ppin[0])}, ${f3(L.Ppin[1])} | ${f3(r.pinImpulse[0])}, ${f3(r.pinImpulse[1])} | ${f3(c.Qover)} | ${L.nSpinUp}/${L.nSpinDown} | ${f3(r.supply.maxAbsMeshE)} | ${f3(r.supply.centerEs0)} → ${f3(r.supply.centerEs1)} |`);
    const et = (d) => d.d.bins.map((q) => (q.n ? (q.eta === null ? '—' : (q.eta >= 0 ? '+' : '') + q.eta.toFixed(3)) : '—')).join('/');
    out.eta.push(`| ${r.key} | ${et(r.diag.t0)} | ${et(r.diag.winEnd)} |`);
  }
  for (const s of (J.sideBySide || [])) out.side.push(`| ${s.key} | ${s.free.verdict}(保持 ${f3(s.free.retention)}・捕獲 ${s.free.nCap}・Ω ${f3(s.free.spin[1])}) | ${s.fixed.verdict}(保持 ${f3(s.fixed.retention)}・合体 ${s.fixed.nCap}・Ω ${f3(s.fixed.spin[1])}) |`);
  return out;
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const TARGET = process.env.QA_TARGET || 'beta/index.html';
if (IS_MAIN && process.argv.includes('--child')) {
  const spec = JSON.parse(process.argv[process.argv.indexOf('--child') + 1]);
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const { HP } = loadHtmlMain(path.join(ROOT, TARGET));
  process.stdout.write(JSON.stringify(runOne(HP, spec)));
} else if (IS_MAIN) {
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const outDir = path.join(ROOT, 'tests', 'out');
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const t0 = Date.now();
  const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
  const lib = LF.selfTest();
  console.log('(A) 配分器 ok=' + lib.ok + ' worst ' + lib.worstRel);
  const same = sameInitCheck(HP);
  console.log('(B) 🌰 と同じ初期状態 ok=' + same.ok);
  const neg = negativeControls(HP);
  console.log('(C) 負の対照 ' + JSON.stringify(neg.checks));
  const rt = roundTrip(HP);
  console.log('(D) 離散の往復 ok=' + rt.ok + ' ' + JSON.stringify(rt.rows.map((r) => ({ RI: r.rInertia, relK: r.relK, JpinSum: r.JpinSum, PpinSum: r.PpinSum }))));
  const con = contractCases(HP);
  console.log('(E) 受理器 ok=' + con.ok);
  const G = JSON.parse(fs.readFileSync(path.join(ROOT, GROWTH_CANON), 'utf8'));
  const CODE = ['tests/exp-w288a-fixcap.mjs', 'tests/lib-w288a-fixcap.mjs', 'tests/exp-w287a-growth.mjs', 'tests/lib-w287a-growth.mjs', 'tests/exp-w286a-cluster.mjs', 'tests/exp-w285a-cluster.mjs', 'tests/exp-w284a-cluster.mjs', 'tests/exp-w283f-cluster.mjs',
    'tests/lib-w280b-emgrid.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  const meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第288便a', target: TARGET, code: CODE, inputs: [TARGET, GROWTH_CANON] }), {
    harnessVersion: HARNESS_VERSION, libVersion: LF.FIXCAP_LIB_VERSION, loadErrors: errors.length,
    ruling: '原仮定者の裁定(第78報)⑤: 支配天体との合体/離散のサンプルでは支配天体の位置を固定する。合体で消滅する衝突天体の運動エネルギー(慣性移動とスピン)は合体後のスピンの角速度に加算してエネルギーを保存(近似・経路は問わない)。離散はその逆。計算可能なら熱の経路も用意する',
    reading: '統括の検証項目 R113(固定中心・別の版キー・宣言座標系の K_in・E_* の配分・熱の割合 h・物理上限 Ω_max と超過の口座・J_pin/P_pin の別口座・離散の逆写像・h=0 の往復・🌰 と同じ初期状態・半径対照・符号つき η_mesh・場の仕事の供給源を別欄)・AN76/AN77/AN78',
    dt: DT, seeds: SEEDS,
    notClaim: ['固定中心で閉鎖系になった', '有限の中心スピンで支えた', '合体で必ず Ω が増す', '合体で自転が増えて斥力になった', '星団が落ち着いた', '形状が安定した', '観測一致を達成した', '新発見'] });
  Object.assign(meta, W281A_SCOPE, w281aStableInputs(ROOT, meta.inputs));
  const NW = Math.max(1, Number(process.env.W288A_WORKERS) || 2);
  const specs = RUNS.concat([RADIUS_RUN]);
  const results = new Array(specs.length);
  const self = fileURLToPath(import.meta.url);
  let next = 0;
  const runChild = (idx) => new Promise((res, rej) => {
    const ch = spawn(process.execPath, [self, '--child', JSON.stringify(specs[idx])], { cwd: ROOT, env: process.env });
    let out = '', err = '';
    ch.stdout.on('data', (d) => { out += d; }); ch.stderr.on('data', (d) => { err += d; });
    ch.on('close', (code) => { if (code !== 0) return rej(new Error(specs[idx].key + ': ' + err.slice(0, 800)));
      try { results[idx] = JSON.parse(out); } catch (e) { return rej(e); }
      const r = results[idx], w = r.gates.worst || {}, c = r.capture.counts;
      console.log(`${r.key}: ${r.gates.verdict}${r.gates.failed.length ? '(' + r.gates.failed.join(',') + ')' : ''}・步 ${r.steps}・t_last/T_dyn ${f3(r.tLast / r.Tdyn)}・合体 ${c.n}(拒否 束縛 ${c.refBound}/供給 ${c.refEnergy}/上限 ${c.refOverflow})・保持 ${f3(w.retention)}・r_h ${f3(w.rhRelChange)}・軸比 ${f3(w.axis)}・Ω ${f3(r.samples[r.samples.length - 1].center.spin)}・${r.wallSec.toFixed(0)} s`);
      res(); });
  });
  const lane = async () => { while (next < specs.length) { const i = next++; await runChild(i); } };
  await Promise.all(Array.from({ length: Math.min(NW, specs.length) }, lane));
  const runs = results.slice(0, RUNS.length), radiusRun = results[RUNS.length];
  const rr = radiusReplay(runs.find((r) => r.key === RADIUS_REPLAY.from).capture.log);
  const out = { meta, gates: Object.assign({}, GATES, { text: GATE_TEXT, declaredBeforeMeasure: true }), orbits: ORBITS, runSpecs: RUNS, radiusSpec: RADIUS_RUN,
    verdictRule: VERDICT_RULE, perturb: PERTURB, diagSpec: DIAG, radiusReplaySpec: RADIUS_REPLAY,
    preset: PRESET, freePreset: FREE_PRESET, lib, sameInit: same, negativeControls: neg, roundTrip: rt, contract: con,
    runs, radiusRun, radiusReplay: rr, sideBySide: sideBySide(runs, G), summary: verdictOf(runs), elapsedS: (Date.now() - t0) / 1000 };
  out.verdict = out.summary.verdict;
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'fixcap-w288a.json'), JSON.stringify(out, null, 1) + '\n');
  console.log('→ tests/out/fixcap-w288a.json(' + out.elapsedS.toFixed(1) + ' s)・判定 ' + out.verdict + '・半径対照 ' + JSON.stringify({ a: rr['RI0.01'].first5, over40: rr['RI0.01'].firstOver40, b: rr['RI1.5'].final }));
}
