// 第286便a(原仮定者の裁定(第76報)⑤「銀河スケールは星団に合わないので星団スケールを用意する・中心天体の半径が大き過ぎる・
// 画面縮小で潰れる粒子も点として見える表示を残す・球状星団はわずかに回転している —— これをヒントにバランスの取れる状態を計算で割り出す」・
// 統括の検証項目 R101〜R103・AN60)—— **💮 の星団スケールと平衡の走査**の器。
//
// ■ 門(**第283便f の門をそのまま使う** —— 下げない)・中心の引きずり支配の目標(第284便a の DOMINANCE —— 動かさない)
//   値と判定の関数は器 tests/exp-w283f-cluster.mjs の `GATES`・`gateEval` と tests/exp-w284a-cluster.mjs の `DOMINANCE`・`dominanceEval` を
//   **そのまま読む**。窓 [1, 3] × T_out は**各構成の T_out**。D_A(r) は R_drag(spaceMesh.dragR)を中心の自転項の R として読む
//   (本器の `dominanceProfile` —— 第284便a の関数は中心の本体半径 S.R を読むので、半径を分けた 💮 では使わない)。
//   **η_mesh(r)=|⟨a_mesh,r⟩|/|⟨g_r⟩|**(a_mesh ≡ Δv/dt − a_E4(x₀) —— 第285便a の `diagStep`・分母 ≈0 は未定義 null)を D_A と別に記録する。
//
// ■ 測る前に宣言したこと(下の `SCAN`・`RUNS`・`NOISE`・`VERDICT_RULE` —— QA が PHYSICS の段落と正本と照合する)
//   ・代表率: 恒星と DR に**同じ w=nTrue/nRep**(個数比 20 → 恒星 25+DR 500・個数比 10 → 50+500)。
//   ・v_rot/σ の候補 {0, 0.1, 0.25, 0.47〔47 Tuc の参照値〕}(門の上限 0.5 の内側)—— 行の jeansRot(外側の漸近値)。
//   ・中心質量比 M_c/M_DR ∈ {1/8.5(宣言), 1, 4}・中心 spin ∈ {12(宣言), 3, 0〔対照〕}。
//   ・全組合せ 2×4×3×3=72 は所要が器の予算を超えるので、**走らせる 8 構成を先に決めた**(`RUNS` —— 宣言の構成の乱数種 3 + 宣言の構成から
//     1 因子ずつ: v_rot/σ 0 と 0.47・M_c/M_DR 4・spin 0〔対照〕・代表率 r10)。v_rot/σ 0.25・M_c/M_DR 1・spin 3 は**走らせない**
//     (1 走行 ≈ 7000 步 × N 526 —— 同じ機械の並走で 1 走行 20 分級。結果を見る前に外した)。結果を見て足したり外したりしない。
//   ・恒星の標本雑音: 恒星は位置だけ 5 回対称(angularSym 5)・宣言の構成は乱数種 3・**粒子数に応じた測定不確かさ**(`NOISE` —— 等方な
//     独立標本の r_h 変化と軸比の床)を先に計算して並べる(門は下げない —— 不確かさは読みの補助)。
//   ・判定の規則 `VERDICT_RULE`: 宣言の構成が乱数種 3 つすべてで形状達成なら「形状達成」・そうでなければ「未達」。1 種だけの構成は候補の記録。
//
// ■ 宣言の照合(A): 単位の一組(G_sim・c_sim を L₀/T₀/M₀ から作り直して physics と照合)・同じ代表率・中心の無次元量をこの単位で
//   (GM/(R_body c²)・ΩR_drag/c)・**本体半径 < R_drag**・表示半径(レンダラの式 max(1.2, min(R·dispMag·z, rCap)))で **DR ≤ 恒星**
//   (実半径では 3 つの画面の大きさで全員が床 1.2 px に潰れる —— DR は暗い色で区別)・**4 半径の分離の力学検査**(dragR = 本体半径のとき
//   宣言なしとビット一致 / dragR を変えると動く / 本体半径を変えると動く —— 本体半径が力学に入る経路があることの記録)。
//
// ■ しないこと・言わないこと
//   ・門を動かさない。既存の本の力学に触らない(走査の写しは器の中だけ)。観測値と突き合わせない。2D の 1/r² 軟化核の面内運動は
//     3D 分布の投影と同じではない(**2D 投影のアナロジー**)。
//   ・「形状が安定した」「47 Tuc を再現した」「中心の引きずりが支配的になった」「観測一致を達成した」「安定平衡版」と書かない(門の語は形状達成/未達だけ)。
//
// 実行(Node だけ): node tests/exp-w286a-cluster.mjs   (並列: W286A_WORKERS —— 既定 2。結果は並列数に依らない。
//   途中の結果は走行が済むたびに正本へ partial:true で書き出す —— 最後に partial:false)
// 読む正本: なし(html だけ)。正本: tests/out/cluster-w286a.json
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import * as E283 from './exp-w283f-cluster.mjs';
import * as E284 from './exp-w284a-cluster.mjs';
import * as E285 from './exp-w285a-cluster.mjs';
// 第281便a(AN16・R71): **この器が読む html の領域**の宣言(1 行の JSON —— lint.regenScope が読む)
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
const REGEN_SCOPE = {"presets":"all","roots":["$","CONTACT_MODE_KEY","DT","HP.allPresets","HP.dfmField","HP.dfmFieldContractOf","HP.dfmFieldSnapshot","HP.dfmMeshVelocityFieldAt","HP.sim","HP.validatePreset","T","ch","contactNoneOf","ctx","cw","dfmField","dfmFieldContract","geoCoreDispatch","jeansRowsVelocities","jeansSigma2Profile","lensExcludedRows","rayHeavy","rayMassMin","traceRay"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w286a-cluster-1';
export const PRESET = 'clusterAnalogyBH';
export const DT = E283.DT;
export const GATES = E283.GATES;
export const GATE_TEXT = E283.GATE_TEXT;
export const DOMINANCE = E284.DOMINANCE;
export const SEEDS = E284.SEEDS;
export const PHYS = Object.freeze({ G_SI: 6.6743e-11, c_SI: 299792458, R_SUN_M: 6.957e8 });
export const DISPLAY = Object.freeze({ floorPx: 1.2, canvasMin: [360, 720, 1080], formula: 'Math.max(1.2,Math.min(sim.R[i]*(sim.params.dispMag||1)*z,rCap))' });
export const SEP_STEPS = 100;

/** 走査の軸(測る前に宣言)。 */
export const SCAN = Object.freeze({
  version: 'w286a-scan-1',
  rep: Object.freeze([Object.freeze({ key: 'r20', nStar: 25, nDR: 500, ratio: 20 }), Object.freeze({ key: 'r10', nStar: 50, nDR: 500, ratio: 10 })]),
  vRot: Object.freeze([0, 0.1, 0.25, 0.47]),
  mcOverMdr: Object.freeze([1 / 8.5, 1, 4]),
  spin: Object.freeze([12, 3, 0]),
  declared: Object.freeze({ rep: 'r20', vRot: 0.1, mcOverMdr: 1 / 8.5, spin: 12 }),
  seeds: 3, fullFactorial: 72,
});
const fmtMc = (x) => (Math.abs(x - 1 / 8.5) < 1e-12 ? '1/8.5' : String(x));
export const cfgKey = (c) => `${c.rep}-v${c.vRot}-mc${fmtMc(c.mcOverMdr)}-s${c.spin}`;
/** 走らせる 8 構成(測る前に宣言 —— 走らせる順も優先度の順: 宣言の構成の乱数種 3 → 1 因子ずつ)。 */
export const RUNS = Object.freeze((() => {
  const D = SCAN.declared, out = [];
  const add = (patch, seed, group) => { const c = Object.assign({}, D, patch); out.push(Object.freeze(Object.assign({ key: cfgKey(c) + '-seed' + seed, cfg: cfgKey(c), seed, group }, c))); };
  for (let s = 0; s < SCAN.seeds; s++) add({}, s, 'declared');
  add({ vRot: 0 }, 0, 'vRot'); add({ vRot: 0.47 }, 0, 'vRot');
  add({ mcOverMdr: 4 }, 0, 'mc'); add({ spin: 0 }, 0, 'spin'); add({ rep: 'r10' }, 0, 'rep');
  return out;
})());
export const NOT_RUN = Object.freeze(['v_rot/σ 0.25', 'M_c/M_DR 1', 'spin 3']);
export const VERDICT_RULE = Object.freeze({ version: 'w286a-verdict-1', declaredAllSeeds: true,
  text: '宣言の構成(r20・v_rot/σ 0.1・M_c/M_DR 1/8.5・spin 12)が乱数種 3 つすべてで形状達成なら「形状達成」、そうでなければ「未達」(1 種だけの構成は候補の記録)' });
/** 粒子数に応じた測定不確かさ(測る前に宣言 —— 等方な独立標本の床。門は下げない)。 */
export const NOISE = Object.freeze({ version: 'w286a-noise-1', nStars: Object.freeze([25, 50]), draws: 4000, seed: 286001, nSamples: 9 });
export const SCAN_TEXT = [
  `代表率: 恒星と DR に同じ w=nTrue/nRep(個数比 20 → 恒星 25+DR 500・個数比 10 → 50+500)`,
  `v_rot/σ の候補 {0, 0.1, 0.25, 0.47(47 Tuc の参照値)}(門の上限 0.5 の内側・行の jeansRot = 外側の漸近値)`,
  `中心質量比 M_c/M_DR ∈ {1/8.5(宣言), 1, 4}・中心 spin ∈ {12(宣言), 3, 0(対照)}`,
  `走らせる構成は ${RUNS.length}(全組合せ ${SCAN.fullFactorial} のうち、宣言の構成の乱数種 ${SCAN.seeds} + 宣言の構成から 1 因子ずつ: v_rot/σ 0・0.47・M_c/M_DR 4・spin 0・代表率 r10)・走らせない: ${NOT_RUN.join('・')}(所要 —— 結果を見る前に外した)`,
  `判定の規則: ${VERDICT_RULE.text}`,
  `粒子数に応じた測定不確かさ: 恒星 ${NOISE.nStars.join('・')} 体の等方な独立標本(${NOISE.draws} 回)で r_h の変化と軸比の床を先に計算して並べる(門は下げない)`,
];

const clone = (o) => JSON.parse(JSON.stringify(o));
const rel = E283.rel;
function mulberry(seed) { let s = seed >>> 0; return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const byId = (HP, id) => HP.allPresets().find((q) => q.id === id);

/** 台帳を代表率・個数比・中心質量に合わせて作り直す(恒星の総質量 M★ は宣言のまま)。 */
export function ledgerFor(ml0, rep, mc) {
  const ml = clone(ml0), u = ml.unitTable;
  const Nstar = ml.fStar * ml.starBase * ml.unitKg / (ml.mStarSun * ml.mSunKg);
  ml.nRatio = rep.ratio; ml.core = mc;
  ml.currentTotalUnit = ml.fStar * ml.starBase + ml.gas + mc; ml.currentTotalSun = ml.currentTotalUnit * ml.unitKg / ml.mSunKg;
  ml.rotorScenarios = ml.rotorScenarios.map((r) => { const mU = rep.ratio * ml.starBase * r.mRotorSun / ml.mStarSun, t = ml.currentTotalUnit + mU;
    return { mRotorSun: r.mRotorSun, nRotor: rep.ratio * Nstar, mRotorUnit: mU, totalUnit: t, totalSun: t * ml.unitKg / ml.mSunKg }; });
  const row = ml.rotorScenarios.find((r) => r.mRotorSun === ml.darkRotor.mRotorSun);
  const w = Nstar / rep.nStar;
  u.w = w;
  u.rows = [{ pop: 'star', mSun: ml.mStarSun, nTrue: Nstar, nRep: rep.nStar, mRep: w * ml.mStarSun * ml.mSunKg / u.M0Kg },
    { pop: 'darkRotor', mSun: ml.darkRotor.mRotorSun, nTrue: row.nRotor, nRep: rep.nDR, mRep: (row.nRotor / rep.nDR) * ml.darkRotor.mRotorSun * ml.mSunKg / u.M0Kg }];
  const d = ml.darkRotor; d.nRep = rep.nDR; d.totalUnit = row.mRotorUnit; d.mPerRepUnit = row.mRotorUnit / rep.nDR; d.nTrue = row.nRotor;
  return ml;
}

/** 写し(器の中だけ)。宣言どおりの構成なら台帳と質量を作り直さない(丸めで動かさない)。 */
export function variantPreset(HP, spec) {
  const p = clone(byId(HP, PRESET));
  const kS = p.bodies.findIndex((b) => b.type === 'disk' && b.lightSweep !== 1), kD = p.bodies.findIndex((b) => b.type === 'disk' && b.lightSweep === 1);
  p.seed = SEEDS[spec.seed || 0];
  const rep = SCAN.rep.find((r) => r.key === spec.rep);
  const ml = p.massLedger, Mdr = rep.ratio * ml.starBase * ml.darkRotor.mRotorSun / ml.mStarSun;
  const mc = (Math.abs(spec.mcOverMdr - 1 / 8.5) < 1e-12 && rep.ratio === ml.nRatio) ? ml.core : spec.mcOverMdr * Mdr;
  if (rep.nStar !== p.bodies[kS].n || rep.nDR !== p.bodies[kD].n || rep.ratio !== ml.nRatio || mc !== ml.core) {
    const nl = ledgerFor(ml, rep, mc);
    p.massLedger = nl;
    const mS = nl.unitTable.rows[0].mRep, mD = nl.darkRotor.mPerRepUnit;
    p.bodies[kS].n = rep.nStar; p.bodies[kS].mMin = mS; p.bodies[kS].mMax = mS;
    p.bodies[kD].n = rep.nDR; p.bodies[kD].mMin = mD; p.bodies[kD].mMax = mD;
  }
  p.bodies[0].m = mc; p.bodies[0].spin = spec.spin;
  for (const k of [kS, kD]) { if (spec.vRot === 0) delete p.bodies[k].jeansRot; else p.bodies[k].jeansRot = spec.vRot; }
  if (spec.variant === 'bodyR15') p.bodies[0].radius = 1.5;
  if (spec.variant === 'bodyR15noDrag') { p.bodies[0].radius = 1.5; delete p.physics.spaceMesh.dragR; }
  if (spec.variant === 'drag3') p.physics.spaceMesh.dragR = 3;
  return p;
}

/** D_A(r)(第284便a と同じ式・同じ環 —— 中心の自転項の R は spaceMesh.dragR〔宣言があれば〕)。 */
export function dominanceProfile(HP, S, ic) {
  const C = HP.dfmFieldContractOf(S, 'toy').contract;
  const pw = C.p, eps2 = C.eps * C.eps, q = (C.q === undefined || C.q === null) ? S.params.q : C.q;
  const readSpin = C.spin === 'e6';
  const sm = S.params.spaceMesh || {}, Rd = (sm.dragR > 0) ? sm.dragR : null;
  const cx = S.x[ic], cy = S.y[ic];
  const out = [];
  for (const r of DOMINANCE.ringR) {
    let acc = 0, accC = 0, accO = 0;
    for (let a = 0; a < DOMINANCE.nAz; a++) {
      const th = 2 * Math.PI * a / DOMINANCE.nAz, x = cx + r * Math.cos(th), y = cy + r * Math.sin(th);
      let Ac = 0, Ao = 0;
      for (let j = 0; j < S.n; j++) {
        const dx = x - S.x[j], dy = y - S.y[j], d2 = dx * dx + dy * dy, w = S.m[j] * Math.pow(d2 + eps2, -pw / 2);
        let ux = S.vx[j], uy = S.vy[j];
        if (j === ic && readSpin && S.spin[j] !== 0) {
          const d = Math.sqrt(d2), R = (Rd !== null) ? Rd : S.R[j], tt = R / (R + d), om = S.spin[j] * ((q === 2) ? tt * tt : Math.pow(tt, q));
          ux += -om * dy; uy += om * dx;
        }
        const A = w * Math.hypot(ux, uy);
        if (j === ic) Ac += A; else Ao += A;
      }
      const den = Ac + Ao;
      acc += (den > 0) ? Ac / den : 0; accC += Ac; accO += Ao;
    }
    out.push({ r, dA: acc / DOMINANCE.nAz, aCenter: accC / DOMINANCE.nAz, aOthers: accO / DOMINANCE.nAz });
  }
  return out;
}

/** 帳簿(自由粒子の運動量・中心まわりの角運動量・トイの帳簿)—— 固定した中心の拘束が受け持つ分を読む。 */
export function ledgerOf(S, pop) {
  const ic = pop.center[0];
  let px = 0, py = 0, L = 0;
  for (let i = 0; i < S.n; i++) { if (S.pinned[i] === 1) continue; px += S.m[i] * S.vx[i]; py += S.m[i] * S.vy[i];
    L += S.m[i] * ((S.x[i] - S.x[ic]) * S.vy[i] - (S.y[i] - S.y[ic]) * S.vx[i]); }
  return { Pfree: [px, py], Lfree: L, toyE: S.geoToyE, meshE: S.geoToyEmesh, toyL: S.geoToyL, meshL: S.geoToyMeshL, resL: S.resL };
}
export function sampleOf(HP, S, pop, Rret) {
  const z = E283.measure(S, pop, Rret);
  z.dA = dominanceProfile(HP, S, pop.center[0]);
  z.ledger = ledgerOf(S, pop);
  return z;
}
/** η_mesh(r) = |⟨a_mesh,r⟩| / |⟨g_r⟩|(bin ごと・集団ごと)。分母が 0(|⟨g_r⟩| < 1e-12·最大)の bin は null(未定義)。 */
export function etaOf(bins) {
  const gmax = Math.max(...bins.filter((b) => b.n).map((b) => Math.abs(b.aE4r)), 0);
  return bins.map((b) => ({ r0: b.r0, r1: b.r1, n: b.n, eta: (b.n && Math.abs(b.aE4r) > 1e-12 * gmax) ? Math.abs(b.aMeshR) / Math.abs(b.aE4r) : null }));
}

/** 1 走行(0〜3 T_out を 0.25 T_out ごと —— 窓は**自分の** T_out)。η_mesh の診断は 0/1/2/3 T_out で 1 步ずつ(第285便a と同じ)。 */
export function runOne(HP, spec) {
  const t0 = Date.now();
  const p = variantPreset(HP, spec);
  const v = HP.validatePreset(p);
  if (!v.ok) throw new Error('validatePreset(' + spec.key + '): ' + (v.errors || []).join(' / '));
  HP.sim.build(v.preset);
  const S = HP.sim, preset = v.preset;
  const pop = E283.populations(preset);
  const Rout = preset.bodies.find((b) => b.type === 'disk').radius;
  const jeans = (S.eqInit && S.eqInit.jeans) ? S.eqInit.jeans.map((z) => ({ status: z.status, badRadius: z.badRadius, rot: z.rot, sigma0: z.sigma0, vMax: z.vMax,
    iters: z.iters, toyField: z.toyField, dragR: z.dragR })) : null;
  const orbit = E283.outerOrbit(HP, S, Rout);
  const Tout = orbit.Tout, Rret = GATES.retentionRadiusOverRout * Rout;
  const nS = Math.round(GATES.window.endOut / GATES.window.sampleEveryOut);
  const stepsPer = Math.round(GATES.window.sampleEveryOut * Tout / DT);
  const samples = [sampleOf(HP, S, pop, Rret)];
  const diag = [];
  const diagAt = new Set([0, 1, 2, 3].map((x) => Math.round(x / GATES.window.sampleEveryOut)));
  let k = 0;
  const pushDiag = (atOut) => { const b = E285.diagStep(S, pop); diag.push({ atOut, t: S.t, bins: b, eta: { stars: etaOf(b.stars), dr: etaOf(b.dr) } }); k++; };
  if (jeans && jeans.some((z) => z.status !== 'ok')) {
    return { key: spec.key, cfg: spec.cfg, group: spec.group, seedIdx: spec.seed, seed: SEEDS[spec.seed], rep: spec.rep, vRot: spec.vRot, mcOverMdr: spec.mcOverMdr, spin: spec.spin,
      jeans, noEquilibrium: true, gates: { verdict: '未達', failed: ['noEquilibrium'], worst: {}, pass: {} }, wallSec: (Date.now() - t0) / 1000 };
  }
  if (diagAt.has(0)) pushDiag(0);
  for (let s = 1; s <= nS; s++) {
    while (k < s * stepsPer) { S.step(DT); k++; }
    samples.push(sampleOf(HP, S, pop, Rret));
    if (diagAt.has(s)) pushDiag(s * GATES.window.sampleEveryOut);
  }
  const Tq = stepsPer * DT / GATES.window.sampleEveryOut;
  const c = preset.bodies[0], ph = preset.physics;
  const gates = E283.gateEval(samples, Tq);
  const win = samples.filter((z) => z.t >= GATES.window.relaxOut * Tq - 1e-9 * Tq);
  const rhDR0 = win[0].info.rhDR;
  return { key: spec.key, cfg: spec.cfg, group: spec.group, seedIdx: spec.seed, seed: SEEDS[spec.seed], rep: spec.rep, vRot: spec.vRot, mcOverMdr: spec.mcOverMdr, spin: spec.spin,
    mCenter: c.m, n: S.n, nStars: pop.stars.length, nDR: pop.dr.length, mStar: S.m[pop.stars[0]], mDR: S.m[pop.dr[0]],
    dimless: { GMoverRbodyC2: ph.G * c.m / (c.radius * ph.cLight ** 2), OmegaRdragOverC: c.spin * ph.spaceMesh.dragR / ph.cLight,
      OmegaRdragOverSigma0: (jeans && jeans[0].sigma0 > 0) ? c.spin * ph.spaceMesh.dragR / jeans[0].sigma0 : null },
    jeans, orbit, steps: k, stepsPerSample: stepsPer, ToutEff: Tq, samples, diag,
    gates, dominance: E284.dominanceEval(samples, Tq),
    info: { boundT0: [samples[0].info.boundStars, samples[0].info.boundDR], boundEnd: [samples[nS].info.boundStars, samples[nS].info.boundDR],
      rhDRRelChangeMax: Math.max(...win.map((z) => Math.abs(z.info.rhDR / rhDR0 - 1))), vOverSigmaT0: samples[0].vOverSigma,
      EEnd: samples[nS].info.E, E0: samples[0].info.E },
    wallSec: (Date.now() - t0) / 1000 };
}

/** 判定(宣言の規則)と候補の一覧。 */
export function verdictOf(runs) {
  const D = cfgKey(SCAN.declared);
  const dec = runs.filter((r) => r.cfg === D);
  const nPass = dec.filter((r) => r.gates.verdict === '形状達成').length;
  const verdict = (dec.length === SCAN.seeds && nPass === SCAN.seeds) ? '形状達成' : '未達';
  const candidates = runs.filter((r) => r.cfg !== D && r.gates.verdict === '形状達成').map((r) => r.key);
  return { declaredCfg: D, nDeclared: dec.length, nPass, verdict, candidates };
}

/** 粒子数に応じた測定不確かさ(等方な独立標本の床 —— 測る前に宣言)。 */
export function noisePrior(preset) {
  const row = preset.bodies.find((b) => b.type === 'disk'), a = row.plummerScale, Rt = row.radius, FT = 1 - 1 / (1 + Rt * Rt / (a * a));
  const out = [];
  for (const N of NOISE.nStars) {
    const rnd = mulberry(NOISE.seed + N);
    const ws = [];
    for (let d = 0; d < NOISE.draws; d++) {
      let rh0 = null, w = 0;
      for (let s = 0; s < NOISE.nSamples; s++) {
        const rs = []; for (let k = 0; k < N; k++) { const u = rnd(); rs.push(a * Math.sqrt(1 / (1 - u * FT) - 1)); }
        rs.sort((p, q) => p - q); const rh = rs[Math.ceil(N / 2) - 1];
        if (s === 0) rh0 = rh; else w = Math.max(w, Math.abs(rh / rh0 - 1));
      }
      ws.push(w);
    }
    ws.sort((p, q) => p - q);
    const ax = E283.axisFloor(N, NOISE.draws, NOISE.seed + 7 * N);
    out.push({ N, rhWorstMedian: ws[Math.floor(0.5 * ws.length)], rhWorstP90: ws[Math.floor(0.9 * ws.length)],
      fracRhGatePass: ws.filter((x) => x <= GATES.halfMassRelChangeMax).length / ws.length, axisMedian: ax.median, axisP05: ax.p05, fracAxisMin9Below: ax.fracMin9Below });
  }
  return out;
}

/** (A) 宣言の照合: 単位の一組・同じ代表率・中心の無次元量・本体半径 < R_drag・表示半径・4 半径の分離の力学検査。 */
export function declarationCheck(HP) {
  const pd = byId(HP, PRESET), v = HP.validatePreset(clone(pd)), P = v.preset;
  const ml = P.massLedger, u = ml.unitTable, ph = P.physics, rr = ml.darkRotor.radii;
  const Gs = u.GSI * u.M0Kg * u.T0S ** 2 / u.L0M ** 3, cs = u.cSI * u.T0S / u.L0M;
  HP.sim.build(P);
  const S = HP.sim, pop = E283.populations(P);
  const kS = P.bodies.findIndex((b) => b.type === 'disk' && b.lightSweep !== 1), kD = P.bodies.findIndex((b) => b.type === 'disk' && b.lightSweep === 1);
  let Mst = 0, Mdr = 0; for (const i of pop.stars) Mst += S.m[i]; for (const i of pop.dr) Mdr += S.m[i];
  const Rdr = S.R[pop.dr[0]], Rst = S.R[pop.stars[0]], Rc = S.R[pop.center[0]], dm = ph.dispMag, cam = P.camera.scale;
  const draw = DISPLAY.canvasMin.map((cmin) => { const z = cmin / 2 / cam; const px = (R) => Math.max(DISPLAY.floorPx, R * dm * z);
    return { canvasMin: cmin, z, drPx: px(Rdr), starPx: px(Rst), centerPx: px(Rc), drNotAboveStar: px(Rdr) <= px(Rst), allAtFloor: px(Rdr) === DISPLAY.floorPx && px(Rst) === DISPLAY.floorPx && px(Rc) === DISPLAY.floorPx }; });
  const snap = (p) => { const vv = HP.validatePreset(p); if (!vv.ok) throw new Error(vv.errors.join('/')); HP.sim.build(vv.preset); const Q = HP.sim;
    for (let k = 0; k < SEP_STEPS; k++) Q.step(DT); const a = []; for (let i = 0; i < Q.n; i++) a.push(Q.x[i], Q.y[i], Q.vx[i], Q.vy[i]); return a; };
  const nd = (a, b) => { let n = 0; for (let i = 0; i < a.length; i++) if (!Object.is(a[i], b[i])) n++; return n; };
  const D = Object.assign({ seed: 0 }, SCAN.declared);
  const A0 = snap(variantPreset(HP, D)), B = snap(variantPreset(HP, Object.assign({ variant: 'bodyR15' }, D))),
    C = snap(variantPreset(HP, Object.assign({ variant: 'bodyR15noDrag' }, D))), Dd = snap(variantPreset(HP, Object.assign({ variant: 'drag3' }, D)));
  return { warnings: v.warnings, scaleExp: P.scaleExp || null, scaleTier: P.scaleTier,
    units: { L0M: u.L0M, T0S: u.T0S, M0Kg: u.M0Kg, Gsim: u.Gsim, cSim: u.cSim, GsimRecomputed: Gs, cSimRecomputed: cs, physicsG: ph.G, physicsC: ph.cLight,
      relG: rel(Gs, ph.G), relC: rel(cs, ph.cLight), unitKgIsM0: ml.unitKg === u.M0Kg },
    rep: { w: u.w, rows: u.rows, wStar: u.rows[0].nTrue / u.rows[0].nRep, wDR: u.rows[1].nTrue / u.rows[1].nRep, relW: rel(u.rows[0].nTrue / u.rows[0].nRep, u.rows[1].nTrue / u.rows[1].nRep),
      builtStar: Mst, builtDR: Mdr, starBase: ml.starBase, drTotal: ml.darkRotor.totalUnit, nStars: pop.stars.length, nDR: pop.dr.length,
      mRepStarBuilt: S.m[pop.stars[0]], mRepDRBuilt: S.m[pop.dr[0]] },
    center: { m: P.bodies[0].m, bodyR: P.bodies[0].radius, bodyRBuilt: Rc, dragR: ph.spaceMesh.dragR, spin: P.bodies[0].spin, eps: ph.softening,
      GMoverRbodyC2: ph.G * P.bodies[0].m / (P.bodies[0].radius * ph.cLight ** 2), OmegaRdragOverC: P.bodies[0].spin * ph.spaceMesh.dragR / ph.cLight,
      bodyRBelowDrag: P.bodies[0].radius < ph.spaceMesh.dragR, bodyRM: P.bodies[0].radius * u.L0M, schwarzschildM: 2 * PHYS.G_SI * P.bodies[0].m * u.M0Kg / PHYS.c_SI ** 2 },
    radii: { drParticle: P.bodies[kD].particleRadius, drRecomputed: rr.physicalM / u.L0M, starParticle: P.bodies[kS].particleRadius, starRecomputed: PHYS.R_SUN_M / u.L0M,
      drBuilt: Rdr, starBuilt: Rst, ledgerLengthUnitM: rr.lengthUnitM, dispMag: dm },
    draw,
    separation: { steps: SEP_STEPS, n: A0.length,
      dragREqualsBodyRBitSame: nd(B, C) === 0, dragRChangeDiffers: nd(A0, Dd), bodyRChangeDiffers: nd(A0, B) },
    physics: { geoPN: ph.geoPN, kFrame: ph.kFrame, contactMode: ph.contactMode, centerSpin: ph.spaceMesh.centerSpin, Wbg: ph.spaceMesh.D0, D0: ph.D0, pinned: P.bodies[0].pinned === true,
      vModes: P.bodies.filter((b) => b.type === 'disk').map((b) => b.vMode), jeansRot: P.bodies.filter((b) => b.type === 'disk').map((b) => b.jeansRot === undefined ? 0 : b.jeansRot), angularSym: P.bodies[kS].angularSym || null } };
}

const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(3));
/** PHYSICS〔第286便a〕の表の行(QA が正本から作り直して探す)。 */
export function docRows(J) {
  const out = { gates: GATE_TEXT.map((t) => '- ' + t), scan: SCAN_TEXT.map((t) => '- ' + t), runs: [], eta: [], noise: [] };
  for (const r of J.runs) {
    if (r.noEquilibrium) { out.runs.push(`| ${r.key} | 平衡解なし(${r.jeans.map((z) => z.status + (z.badRadius !== null ? ' r=' + f3(z.badRadius) : '')).join('/')}) |`); continue; }
    const w = r.gates.worst;
    out.runs.push(`| ${r.key} | ${f3(r.orbit.Tout)} | ${f3(r.jeans[0].sigma0)} | ${f3(r.info.vOverSigmaT0)} | ${f3(r.info.boundT0[0])}/${f3(r.info.boundT0[1])} | ${f3(w.retStars)}/${f3(w.retDR)} | ${f3(w.rhRelChange)} | ${f3(r.info.rhDRRelChangeMax)} | ${f3(w.axis)} | ${f3(w.vOverSigma)} | ${r.dominance.worst.map(f3).join('/')} | ${r.gates.verdict}${r.gates.failed.length ? '(' + r.gates.failed.join('・') + ')' : ''} |`);
    const d0 = r.diag.find((z) => z.atOut === 0), d3 = r.diag.find((z) => z.atOut === 3);
    const e = (d) => d ? d.eta.stars.concat(d.eta.dr).map((z) => z.eta === null ? '—' : z.eta.toFixed(3)).join('/') : '—';
    out.eta.push(`| ${r.key} | ${e(d0)} | ${e(d3)} |`);
  }
  for (const z of J.noise) out.noise.push(`| ${z.N} | ${f3(z.rhWorstMedian)} | ${f3(z.rhWorstP90)} | ${f3(z.fracRhGatePass)} | ${f3(z.axisMedian)} | ${f3(z.fracAxisMin9Below)} |`);
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
  const decl = declarationCheck(HP);
  console.log('(A) ' + JSON.stringify({ units: decl.units, center: decl.center, draw: decl.draw.map((z) => [z.drPx, z.starPx, z.centerPx]), sep: decl.separation }));
  const noise = noisePrior(byId(HP, PRESET));
  console.log('noise ' + JSON.stringify(noise));
  const CODE = ['tests/exp-w286a-cluster.mjs', 'tests/exp-w285a-cluster.mjs', 'tests/exp-w284a-cluster.mjs', 'tests/exp-w283f-cluster.mjs', 'tests/lib-w281c-rotorledger.mjs', 'tests/lib-w280b-emgrid.mjs',
    'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  const meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第286便a', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, loadErrors: errors.length,
    ruling: '原仮定者の裁定(第76報)⑤: 銀河スケールは星団に合わないので星団スケールを用意する。中心天体の半径が大き過ぎる。画面縮小で潰れる粒子も点として見える表示を残す。球状星団はわずかに回転している —— これをヒントにバランスの取れる状態を計算で割り出す',
    reading: '統括の検証項目 R101(星団スケールの単位の一組)・R102(半径の 4 分離・中心のコンパクト化)・R103(同じ代表率・わずかな回転の平衡・D_A と η_mesh)・AN60(自己無撞着な初期分布を 1 段)',
    dt: DT, seeds: SEEDS,
    notClaim: ['形状が安定した', '47 Tuc を再現した', '中心の引きずりが支配的になった', '観測一致を達成した', '較正を完了した', '安定平衡版', '新発見'] });
  Object.assign(meta, W281A_SCOPE, w281aStableInputs(ROOT, meta.inputs));
  const NW = Math.max(1, Number(process.env.W286A_WORKERS) || 2);
  const ONLY = process.env.W286A_ONLY ? process.env.W286A_ONLY.split(',') : null;   // 開発用(正本を書くときは使わない)
  const specs = RUNS.filter((z) => !ONLY || ONLY.includes(z.key));
  const results = new Array(specs.length);
  const outOf = (partial) => ({ meta, partial,
    gates: Object.assign({}, GATES, { text: GATE_TEXT, declaredBeforeMeasure: true, source: 'tests/exp-w283f-cluster.mjs' }),
    dominance: Object.assign({}, DOMINANCE, { declaredBeforeMeasure: true, source: 'tests/exp-w284a-cluster.mjs', dragRRead: true }),
    scan: Object.assign({}, SCAN, { text: SCAN_TEXT, declaredBeforeMeasure: true }), runSpecs: RUNS, notRun: NOT_RUN, verdictRule: VERDICT_RULE, noiseSpec: NOISE,
    preset: PRESET, declaration: decl, noise, runs: results.filter(Boolean),
    summary: partial ? null : verdictOf(results), elapsedS: (Date.now() - t0) / 1000 });
  const write = (partial) => { if (ONLY) return; fs.mkdirSync(outDir, { recursive: true }); const o = outOf(partial);
    if (!partial) { o.verdict = o.summary.verdict; }
    fs.writeFileSync(path.join(outDir, 'cluster-w286a.json'), JSON.stringify(o, null, 1) + '\n'); };
  const self = fileURLToPath(import.meta.url);
  let next = 0;
  const order = specs.map((_, i) => i);   // 宣言の RUNS の順(優先度の順)
  const runChild = (idx) => new Promise((res, rej) => {
    const ch = spawn(process.execPath, [self, '--child', JSON.stringify(specs[idx])], { cwd: ROOT, env: process.env });
    let out = '', err = '';
    ch.stdout.on('data', (d) => { out += d; }); ch.stderr.on('data', (d) => { err += d; });
    ch.on('close', (code) => { if (code !== 0) return rej(new Error(specs[idx].key + ': ' + err.slice(0, 600)));
      try { results[idx] = JSON.parse(out); } catch (e) { return rej(e); }
      const r = results[idx], w = r.gates.worst || {};
      console.log(`${r.key}: ${r.gates.verdict}${r.gates.failed.length ? '(' + r.gates.failed.join(',') + ')' : ''}・T_out ${r.orbit ? r.orbit.Tout.toFixed(2) : '—'}・保持 ${f3(w.retStars)}/${f3(w.retDR)}・r_h ${f3(w.rhRelChange)}・軸比 ${f3(w.axis)}・v/σ ${f3(w.vOverSigma)}・D_A ${r.dominance ? r.dominance.worst.map(f3).join('/') : '—'}・${r.wallSec.toFixed(0)} s`);
      write(true); res(); });
  });
  const lane = async () => { while (next < order.length) { const i = order[next++]; await runChild(i); } };
  await Promise.all(Array.from({ length: Math.min(NW, specs.length) }, lane));
  write(false);
  const s = verdictOf(results);
  console.log(ONLY ? 'W286A_ONLY: 正本は書かない' : '→ tests/out/cluster-w286a.json(' + ((Date.now() - t0) / 1000).toFixed(1) + ' s)・判定 ' + s.verdict + '・候補 ' + s.candidates.join(','));
}
