// 第284便a(原仮定者の裁定(第74報)④「clusterAnalogyBH を修正する。ダークローターは恒星質量で、大きさは惑星、数は恒星の 10〜20 倍。
// 星団では中心の DFM 版 BH の引きずりが支配的。この条件で安定させる」・統括の検証項目 R89・R90)—— **球状星団安定化便の器**。
//
// ■ 門(**第283便f の門をそのまま使う** —— AN36「門は現行を維持・0.094 を通すために下げない」)
//   窓 [1, 3]×T_out・保持率 ≥0.90(恒星と DR 別)・恒星の半質量半径の変化 ≤10%・軸比 ≥0.9・|v_rot|/σ ≤0.5・E_toy+E_mesh=0・停止なし。
//   値と判定の関数は器 tests/exp-w283f-cluster.mjs の `GATES`・`gateEval` を**そのまま読む**(1 字も写さない)。
//   軸比の門は N=170 の標本の床(0.9 未満 15%)に近い —— **注記**として質量重みの形状テンソルと N_eff の床を並べる(門は動かさない)。
//
// ■ 中心の引きずり支配の目標(**測る前に宣言** —— 下の `DOMINANCE`。開発目標であって観測値ではない)
//   D_A(r) = |A_center| / (|A_center| + Σ_{j≠center}|A_j| + |A₀|)(相殺で小さくなる |A_total| を分母にしない)。
//   A_j = w_j·u_j・w_j = m_j/(d²+ε²)^{p/2}・u_j = v_j + ω_j ẑ×(x−x_j)(ω_j は中心だけ: s(R/(R+d))^q —— トイの場の契約
//   `dfmFieldContractOf(S,"toy")` と同じ p・ε・q・R)。A₀ = W_bg·u_bg は**静止背景の宣言で 0**(算出ではない)。
//   環(半径 2.5/7.5/15/30 = bin [0,5)/[5,10)/[10,20)/[20,40) の中央)の 16 方位の平均。
//   目標: 窓のすべての標本・すべての bin で D_A ≥ 0.5 → 語は「支配(目標達成)/未達」。
//
// ■ 何を測るか(Node だけ —— html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読む)
//   (A) 宣言: 台帳(nRep と nTrue・質量合計・個数比・⟨m_DR⟩・⟨m★⟩)と radii(物理半径〔惑星級・m〕・代表粒子の半径・軟化・R_drag・表示半径)を
//       bodies・physics と照合する。
//   (B) 接触ばね E9 が発火しないことの機械検査: 💮 の宣言(contactK=0)で、DR の代表粒子の半径だけを 1.46 → 8.75(第283便f の値)にした
//       写しと 300 步の全状態がビット一致(半径が力学に入らない = E9 の力が 0)・同じ比較を contactK 既定(40)で行うと一致しない(検出力)。
//   (C) 平衡初速: build の `S.eqInit.equilibrium`(状態・Ψ の単調・ℰ=0 の原子)・t=0 の束縛率(実ポテンシャル)・トイの実効項 ½|ū|²。
//   (D) 門の走行: 代表数 40/80/160 × 個数比 20/10 × 乱数種 3(18 走行)+ 対照(中心 spin 0 × 3 種・virial 初速・接触あり・
//       中心固定の基準場・中心自由・トイなし・診断の 0.8 v_esc 切り)。
//   (E) 軸比の床(N=170 の 1/r² 重み・質量重みの N_eff)。
//
// ■ しないこと・言わないこと
//   ・門を動かさない。既存 141 本の力学に触らない(対照の写しは器の中だけ)。観測値と突き合わせない。
//   ・「形状が安定した」「観測一致を達成した」「較正を完了した」「47 Tuc を再現した」「新発見」と書かない。
//
// 実行(Node だけ・Chromium 不要): node tests/exp-w284a-cluster.mjs   (並列: W284A_WORKERS=3 —— 既定 3。結果は並列数に依らない)
// 読む正本: なし(html だけ)。正本: tests/out/cluster-w284a.json(target=beta/index.html・領域 hash REGEN_SCOPE)
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import * as LR from './lib-w281c-rotorledger.mjs';
import * as E283 from './exp-w283f-cluster.mjs';
// 第281便a(AN16・R71): **この器が読む html の領域**の宣言(1 行の JSON —— lint.regenScope が読む)
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
const REGEN_SCOPE = {"presets":"all","roots":["$","DT","HP.allPresets","HP.dfmField","HP.dfmFieldContractOf","HP.dfmFieldSnapshot","HP.dfmMeshVelocityFieldAt","HP.sim","HP.validatePreset","T","ch","ctx","cw","dfmField","dfmFieldContract","lensExcludedRows","rayHeavy","rayMassMin","traceRay"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w284a-cluster-1';
export const PRESET = 'clusterAnalogyBH';
export const DT = E283.DT;
export const REL_TOL = 1e-12;
export const GATES = E283.GATES;
export const GATE_TEXT = E283.GATE_TEXT;
export const SEEDS = [20260926, 20260927, 20260928];
export const NREPS = [40, 80, 160];
export const RATIOS = [20, 10];
export const E9_STEPS = 300;

/**
 * **中心の引きずり支配の目標(測る前に宣言 —— 第284便a)**。開発目標であって観測値ではない。後から動かさない
 * (QA `behavior.clusterAnalogy` が PHYSICS の段落・正本の `dominance` と照合する)。
 */
export const DOMINANCE = Object.freeze({
  version: 'w284a-dom-1',
  bins: Object.freeze([[0, 5], [5, 10], [10, 20], [20, 40]]),
  ringR: Object.freeze([2.5, 7.5, 15, 30]),
  nAz: 16,
  dAMin: 0.5,
  a0: 'static-declared-zero',
});
export const DOMINANCE_TEXT = [
  `D_A(r) = |A_center| / (|A_center| + Σ|A_j| + |A₀|)(相殺で小さくなる |A_total| を分母にしない)`,
  `bin [0,5)・[5,10)・[10,20)・[20,40) の中央の環(半径 2.5・7.5・15・30)の ${DOMINANCE.nAz} 方位の平均`,
  `A₀ = W_bg·u_bg は静止背景の宣言で 0(算出ではない)`,
  `目標: 窓 [1, 3] × T_out のすべての標本・すべての bin で D_A ≥ ${DOMINANCE.dAMin}(開発目標 —— 観測値ではない)`,
];

const clone = (o) => JSON.parse(JSON.stringify(o));
const byId = (HP, id) => HP.allPresets().find((q) => q.id === id);
export const rel = E283.rel;
export const runKey = (nRep, ratio, s) => `n${nRep}-r${ratio}-s${s}`;

/** 走行の一覧(行列 18 + 対照)。 */
export function runSpecs() {
  const out = [];
  for (const nRep of NREPS) for (const ratio of RATIOS) for (let s = 0; s < SEEDS.length; s++)
    out.push({ key: runKey(nRep, ratio, s), nRep, ratio, seed: s, variant: 'base', matrix: true });
  for (let s = 0; s < SEEDS.length; s++) out.push({ key: 'spin0-s' + s, nRep: 40, ratio: 20, seed: s, variant: 'spin0', label: '中心 spin 0(自転の寄与だけを外す)' });
  const C = [
    ['virial', '初速を第283便f の行ごとの virial に戻す(接触なし・R_rep 1.46 のまま —— 原因 (ii) だけ)'],
    ['contactOn', '接触ばねを既定(contactK 40)に戻し R_rep を 8.75 に戻す(平衡初速のまま —— 原因 (i) だけ)'],
    ['eqPinned', '平衡初速の場を pinned 源だけにする(中心固定の基準 —— eqSources:"pinned")'],
    ['centerFree', '中心を自由にする(pinned:false —— 運動量は中心と星団で閉じる)'],
    ['toyOff', 'トイを外す(geoPN=0・spaceMesh なし —— 重力 E4 だけ・同じ初期配置)'],
    ['cut08', '診断: build の後に速さを実ポテンシャルの脱出速度の 0.8 倍で切る(原因の切り分けだけ —— 採用する法則ではない)'],
    ['eps8', '診断: 重力の数値軟化 ε を 3 → 8(代表粒子の二体の加熱を弱める向き —— 原因の切り分けだけ・宣言は変えない)'],
  ];
  for (const [v, label] of C) out.push({ key: v, nRep: 40, ratio: 20, seed: 0, variant: v, label, info: v === 'cut08' || v === 'eps8' });
  return out;
}

/** 台帳を nRep・個数比に合わせて作り直す(値は純関数 lib-w281c-rotorledger の rotorLedger)。 */
export function ledgerFor(ml0, nRep, ratio) {
  const ml = clone(ml0);
  const g = { starBase: ml.starBase, fStar: ml.fStar, gas: ml.gas, core: ml.core, unitKg: ml.unitKg };
  const led = LR.rotorLedger(g, { mStarSun: ml.mStarSun, nRatio: ratio, scenarios: ml.rotorScenarios.map((r) => r.mRotorSun), mSunKg: ml.mSunKg });
  ml.nRatio = ratio;
  ml.currentTotalUnit = led.current.totalUnit; ml.currentTotalSun = led.current.totalSun;
  ml.rotorScenarios = led.rows.map((r) => ({ mRotorSun: r.mRotorSun, nRotor: r.nRotor, mRotorUnit: r.mRotorUnit, totalUnit: r.totalUnit, totalSun: r.totalSun }));
  const row = led.rows.find((r) => r.mRotorSun === ml.darkRotor.mRotorSun);
  const d = ml.darkRotor;
  d.nRep = nRep; d.totalUnit = row.mRotorUnit; d.mPerRepUnit = row.mRotorUnit / nRep; d.nTrue = row.nRotor;
  return ml;
}

/** 走行の写し(器の中だけ)。 */
export function variantPreset(HP, spec) {
  const p = clone(byId(HP, PRESET));
  const k = p.bodies.findIndex((b) => b.type === 'disk' && b.lightSweep === 1);
  const ks = p.bodies.findIndex((b) => b.type === 'disk' && b.lightSweep !== 1);
  p.seed = SEEDS[spec.seed];
  if (spec.nRep !== p.massLedger.darkRotor.nRep || spec.ratio !== p.massLedger.nRatio) {
    p.massLedger = ledgerFor(p.massLedger, spec.nRep, spec.ratio);
    const m = p.massLedger.darkRotor.mPerRepUnit;
    p.bodies[k].n = spec.nRep; p.bodies[k].mMin = m; p.bodies[k].mMax = m;
    const rr = p.massLedger.darkRotor.radii; rr.rep = p.bodies[k].rMul * Math.sqrt(m); rr.draw = rr.rep;
  }
  const v = spec.variant;
  if (v === 'spin0') p.bodies[0].spin = 0;
  else if (v === 'virial') { p.bodies[k].vMode = 'virial'; p.bodies[ks].vMode = 'virial'; }
  else if (v === 'contactOn') { delete p.physics.contactK; p.bodies[k].rMul = 1.2; p.massLedger.darkRotor.radii.rep = 1.2 * Math.sqrt(p.bodies[k].mMin); p.massLedger.darkRotor.radii.draw = p.massLedger.darkRotor.radii.rep; }
  else if (v === 'eqPinned') { p.bodies[k].eqSources = 'pinned'; p.bodies[ks].eqSources = 'pinned'; }
  else if (v === 'centerFree') p.bodies[0].pinned = false;
  else if (v === 'eps8') { p.physics.softening = 8; p.massLedger.darkRotor.radii.softening = 8; }
  else if (v === 'toyOff') { p.physics.geoPN = 0; delete p.physics.spaceMesh; if (p.overlays) delete p.overlays.spaceMesh; }
  return p;
}
export function buildSpec(HP, spec) {
  const p = variantPreset(HP, spec);
  const v = HP.validatePreset(p);
  if (!v.ok) throw new Error('validatePreset(' + spec.key + '): ' + (v.errors || []).join(' / '));
  HP.sim.build(v.preset);
  const S = HP.sim;
  if (spec.variant === 'cut08') cutEscape(S, 0.8);
  return { S, preset: v.preset, warnings: v.warnings };
}

/** 実ポテンシャル(E4 と同じ軟化した対)で各粒子の φ_i。 */
export function potentials(S) {
  const G = S.params.G, eps2 = S.params.softening * S.params.softening, phi = new Float64Array(S.n);
  for (let i = 0; i < S.n; i++) for (let j = i + 1; j < S.n; j++) {
    const d = Math.sqrt((S.x[i] - S.x[j]) ** 2 + (S.y[i] - S.y[j]) ** 2 + eps2);
    phi[i] -= G * S.m[j] / d; phi[j] -= G * S.m[i] / d;
  }
  return phi;
}
/** 診断(cut08 だけ): 速さを f·v_esc(v_esc=√(−2φ))で切る。 */
function cutEscape(S, f) {
  const phi = potentials(S);
  for (let i = 0; i < S.n; i++) {
    if (S.pinned[i] === 1) continue;
    const ve = Math.sqrt(Math.max(0, -2 * phi[i])), v = Math.hypot(S.vx[i], S.vy[i]);
    if (v > f * ve && v > 0) { const c = f * ve / v; S.vx[i] *= c; S.vy[i] *= c; }
  }
}

/** D_A(r)(bin ごと・16 方位の平均)。契約はトイの読み手 dfmFieldContractOf(S,"toy") の p・ε・q・W_bg。 */
export function dominanceProfile(HP, S, ic) {
  const C = HP.dfmFieldContractOf(S, 'toy').contract;
  const pw = C.p, eps2 = C.eps * C.eps, q = (C.q === undefined || C.q === null) ? S.params.q : C.q;
  const readSpin = C.spin === 'e6';
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
          const d = Math.sqrt(d2), R = S.R[j], tt = R / (R + d), om = S.spin[j] * ((q === 2) ? tt * tt : Math.pow(tt, q));
          ux += -om * dy; uy += om * dx;
        }
        const A = w * Math.hypot(ux, uy);
        if (j === ic) Ac += A; else Ao += A;
      }
      const den = Ac + Ao;   // |A₀| = 0(静止背景の宣言)
      acc += (den > 0) ? Ac / den : 0; accC += Ac; accO += Ao;
    }
    out.push({ r, dA: acc / DOMINANCE.nAz, aCenter: accC / DOMINANCE.nAz, aOthers: accO / DOMINANCE.nAz });
  }
  return out;
}
/** 窓の標本だけで支配の目標を判定する純関数(QA が正本の標本から作り直す)。 */
export function dominanceEval(samples, T) {
  const w0 = GATES.window.relaxOut * T - 1e-9 * T, w1 = GATES.window.endOut * T + 1e-9 * T;
  const win = samples.filter((z) => z.t >= w0 && z.t <= w1);
  const worst = DOMINANCE.ringR.map((_, b) => Math.min(...win.map((z) => z.dA[b].dA)));
  const median = DOMINANCE.ringR.map((_, b) => { const v = win.map((z) => z.dA[b].dA).sort((p, q) => p - q); return v[Math.floor(v.length / 2)]; });
  const pass = worst.every((x) => x >= DOMINANCE.dAMin);
  return { nWindow: win.length, worst, median, verdict: pass ? '支配(目標達成)' : '未達' };
}

/** 注記: 質量重みの形状テンソル(恒星+DR・r ≤ Rret・1/r² 重み)と N_eff=(Σm)²/Σm²。 */
export function massAxis(S, pop, Rret) {
  const cx = S.x[pop.center[0]], cy = S.y[pop.center[0]];
  let a = 0, b = 0, c = 0, M = 0, M2 = 0;
  for (const i of pop.stars.concat(pop.dr)) {
    const dx = S.x[i] - cx, dy = S.y[i] - cy, r = Math.hypot(dx, dy);
    if (!(r > 0) || r > Rret) continue;
    const m = S.m[i]; a += m * dx * dx / (r * r); b += m * dx * dy / (r * r); c += m * dy * dy / (r * r); M += m; M2 += m * m;
  }
  return { q: M > 0 ? E283.axisRatio2(a / M, b / M, c / M) : null, nEff: M2 > 0 ? M * M / M2 : null };
}
/** 重み付きの軸比の床(等方な方位・重みは与えた質量の並び —— 乱数種固定)。 */
export function axisFloorWeighted(ms, draws = 4000, seed = 284001) {
  let s = seed >>> 0;
  const rnd = () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const qs = []; let M = 0, M2 = 0; for (const m of ms) { M += m; M2 += m * m; }
  for (let d = 0; d < draws; d++) {
    let a = 0, b = 0, c = 0;
    for (const m of ms) { const th = 2 * Math.PI * rnd(), x = Math.cos(th), y = Math.sin(th); a += m * x * x; b += m * x * y; c += m * y * y; }
    qs.push(E283.axisRatio2(a / M, b / M, c / M));
  }
  qs.sort((p, q) => p - q);
  return { n: ms.length, nEff: M * M / M2, draws, seed, mean: qs.reduce((x, y) => x + y, 0) / draws, p05: qs[Math.floor(0.05 * draws)],
    fracBelowGate: qs.filter((q) => q < GATES.axisRatioMin).length / draws };
}

/** 1 標本(第283便f の measure + D_A + 質量重みの形状)。 */
export function sampleOf(HP, S, pop, Rret) {
  const z = E283.measure(S, pop, Rret);
  z.dA = dominanceProfile(HP, S, pop.center[0]);
  z.massAxis = massAxis(S, pop, Rret);
  return z;
}

/** 1 走行(0〜3 T_out を 0.25 T_out ごと —— 窓は基準走行の T_out)。 */
export function runOne(HP, spec, Tout, Rout) {
  const t0 = Date.now();
  const { S, preset, warnings } = buildSpec(HP, spec);
  const pop = E283.populations(preset);
  const Rret = GATES.retentionRadiusOverRout * Rout;
  const every = GATES.window.sampleEveryOut * Tout;
  const nS = Math.round(GATES.window.endOut / GATES.window.sampleEveryOut);
  const stepsPer = Math.round(every / DT);
  const eqInit = S.eqInit ? clone(S.eqInit) : null;
  const orbit0 = E283.outerOrbit(HP, S, Rout);
  const samples = [sampleOf(HP, S, pop, Rret)];
  const t1 = Date.now();
  let k = 0;
  for (let s = 1; s <= nS; s++) {
    while (k < s * stepsPer) { S.step(DT); k++; }
    samples.push(sampleOf(HP, S, pop, Rret));
  }
  const wallRun = (Date.now() - t1) / 1000;
  const Tq = stepsPer * DT / GATES.window.sampleEveryOut;
  return { key: spec.key, nRep: spec.nRep, ratio: spec.ratio, seed: SEEDS[spec.seed], seedIdx: spec.seed, variant: spec.variant,
    matrix: !!spec.matrix, info: !!spec.info, label: spec.label || null,
    n: S.n, nStars: pop.stars.length, nDR: pop.dr.length, mDR: pop.dr.length ? S.m[pop.dr[0]] : null, mStar: S.m[pop.stars[0]],
    RDR: pop.dr.length ? S.R[pop.dr[0]] : null, contactK: S.params.contactK, warnings,
    eqInit, ToutOwn: orbit0.Tout, steps: k, stepsPerSample: stepsPer, ToutEff: Tq, samples,
    gates: E283.gateEval(samples, Tq), dominance: dominanceEval(samples, Tq),
    wallSec: (Date.now() - t0) / 1000, rateStepsPerSec: k / Math.max(wallRun, 1e-9) };
}

/** (B) E9 が発火しないことの機械検査: DR の半径だけを変えた写しと n 步の全状態をビット比較する。 */
export function contactInert(HP, steps = E9_STEPS) {
  const snap = (S) => { const a = []; for (let i = 0; i < S.n; i++) a.push(S.x[i], S.y[i], S.vx[i], S.vy[i], S.spin[i]); return a; };
  const runP = (p) => { const v = HP.validatePreset(p); if (!v.ok) throw new Error(v.errors.join('/')); HP.sim.build(v.preset); const S = HP.sim;
    let ov0 = 0; for (let i = 0; i < S.n; i++) for (let j = i + 1; j < S.n; j++) if (Math.hypot(S.x[i] - S.x[j], S.y[i] - S.y[j]) < S.R[i] + S.R[j]) ov0++;
    const R = S.R[S.n - 1];
    for (let k = 0; k < steps; k++) S.step(DT);
    return { st: snap(S), ov0, R, contactK: (S.params.contactK === undefined) ? null : S.params.contactK }; };
  const base = clone(byId(HP, PRESET));
  const k = base.bodies.findIndex((b) => b.type === 'disk' && b.lightSweep === 1);
  const big = clone(base); big.bodies[k].rMul = 1.2;
  const a = runP(base), b = runP(big);
  const same = a.st.length === b.st.length && a.st.every((x, i) => Object.is(x, b.st[i]));
  // 検出力: 同じ比較を contactK 既定(40)で —— 一致しないはず
  const baseK = clone(base); delete baseK.physics.contactK;
  const bigK = clone(big); delete bigK.physics.contactK;
  const c = runP(baseK), d = runP(bigK);
  let nd = 0; for (let i = 0; i < c.st.length; i++) if (!Object.is(c.st[i], d.st[i])) nd++;
  return { steps, declared: { contactK: a.contactK, Rrep: a.R, overlapPairsT0: a.ov0 }, bigR: { Rrep: b.R, overlapPairsT0: b.ov0 },
    bitSame: same, sensitivity: { contactK: c.contactK, differingValues: nd, of: c.st.length } };
}

/** (C) t=0 の平衡初速の量: トイの実効項 ½|ū|²(質量あたり)と運動エネルギー(質量あたり)の比。 */
export function toyTermAtT0(HP, S, pop) {
  const C = Object.assign({}, HP.dfmFieldContractOf(S, 'toy').contract);
  const BD = []; for (let i = 0; i < S.n; i++) BD.push({ id: i, m: S.m[i], x: S.x[i], y: S.y[i], vx: S.vx[i], vy: S.vy[i], ax: 0, ay: 0,
    spin: S.spin[i], R: S.R[i], omegaDot: 0, pinned: (S.pinned[i] === 1) });
  C.need = 'u';
  const u2 = [], k2 = [];
  for (const i of pop.stars.concat(pop.dr)) {
    C.excludeBodyId = i;
    const f = globalThis.dfmFieldContract(BD, S.x[i], S.y[i], C);
    if (!f) continue;
    u2.push(0.5 * (f.u[0] ** 2 + f.u[1] ** 2)); k2.push(0.5 * (S.vx[i] ** 2 + S.vy[i] ** 2));
  }
  const med = (a) => { const b = a.slice().sort((p, q) => p - q); return b[Math.floor(b.length / 2)]; };
  const sum = (a) => a.reduce((x, y) => x + y, 0);
  return { n: u2.length, halfU2Median: med(u2), halfU2Max: Math.max(...u2), halfV2Median: med(k2), ratioSum: sum(u2) / sum(k2) };
}

/** (A) 宣言の照合(台帳・radii ↔ bodies・physics)。 */
export function declarationCheck(HP) {
  const pd = byId(HP, PRESET);
  const v = HP.validatePreset(clone(pd));
  const ml = v.preset.massLedger, d = ml.darkRotor, ph = v.preset.physics;
  const { S, preset } = buildSpec(HP, { key: 'decl', nRep: d.nRep, ratio: ml.nRatio, seed: 0, variant: 'base' });
  const pop = E283.populations(preset);
  let star = 0, dr = 0; for (const i of pop.stars) star += S.m[i]; for (const i of pop.dr) dr += S.m[i];
  const g = { starBase: ml.starBase, fStar: ml.fStar, gas: ml.gas, core: ml.core, unitKg: ml.unitKg };
  const led = LR.rotorLedger(g, { mStarSun: ml.mStarSun, nRatio: ml.nRatio, scenarios: ml.rotorScenarios.map((r) => r.mRotorSun), mSunKg: ml.mSunKg });
  const row = led.rows.find((r) => r.mRotorSun === d.mRotorSun);
  const drRow = preset.bodies.find((b) => b.type === 'disk' && b.lightSweep === 1);
  const c = preset.bodies[0];
  return {
    warnings: v.warnings,
    ledger: { nRep: d.nRep, nTrue: d.nTrue, nStarsTrue: led.nStars, nRatio: ml.nRatio, mRotorSun: d.mRotorSun, mStarSun: ml.mStarSun,
      totalUnit: d.totalUnit, mPerRepUnit: d.mPerRepUnit, starBase: ml.starBase,
      massRatioDRoverStar: d.totalUnit / ml.starBase, massRatioRule: ml.nRatio * d.mRotorSun / ml.mStarSun,
      nTrueRecomputeRel: rel(d.nTrue, row.nRotor), totalRecomputeRel: rel(d.totalUnit, row.mRotorUnit) },
    built: { n: S.n, nStars: pop.stars.length, nDR: pop.dr.length, star, dr, builtDrMinusDeclared: dr - d.totalUnit, builtStarMinusStarBase: star - ml.starBase },
    radii: Object.assign({}, d.radii, {
      repBuilt: S.R[pop.dr[0]], repDeclaredVsRule: rel(d.radii.rep, drRow.rMul * Math.sqrt(drRow.mMin)),
      softeningVsPhysics: rel(d.radii.softening, ph.softening), dragVsCenterR: rel(d.radii.drag, c.radius), drawVsRep: rel(d.radii.draw, d.radii.rep),
      physicalOverMax: d.radii.physicalM / d.radii.physicalMaxM }),
    physics: { contactK: ph.contactK, contactCap: (ph.contactCap === undefined) ? null : ph.contactCap, gammaN: ph.gammaN, muF: ph.muF,
      geoPN: ph.geoPN, kFrame: ph.kFrame, softening: ph.softening, centerPinned: c.pinned === true, vModes: preset.bodies.filter((b) => b.type === 'disk').map((b) => b.vMode) },
  };
}

/** PHYSICS〔第284便a〕の表の行(QA が正本から作り直して探す)。 */
export function docRows(J) {
  const f3 = (x) => (x === null || x === undefined ? '—' : Number(x).toFixed(3));
  const out = { gates: GATE_TEXT.map((t) => '- ' + t), dominance: DOMINANCE_TEXT.map((t) => '- ' + t), matrix: [], controls: [], summary: [] };
  const line = (r) => {
    const w = r.gates.worst;
    return `| ${r.key}${r.info ? '(診断)' : ''} | ${r.n} | ${f3(w.retStars)} | ${w.retDR === null ? '—' : f3(w.retDR)} | ${f3(w.rhRelChange)} | ${f3(w.axis)} | ${f3(w.vOverSigma)} | ${r.dominance.worst.map(f3).join('/')} | ${r.gates.verdict}${r.gates.failed.length ? '(' + r.gates.failed.join('・') + ')' : ''} |`;
  };
  for (const r of J.runs) (r.matrix ? out.matrix : out.controls).push(line(r));
  for (const s of J.summary) out.summary.push(`| ${s.nRep} | ${s.ratio} | ${s.mDR === null ? '—' : Number(s.mDR).toFixed(4)} | ${s.nPass}/${s.nSeeds} | ${f3(s.retStarsMin)}〜${f3(s.retStarsMax)} | ${f3(s.rhMin)}〜${f3(s.rhMax)} | ${f3(s.dAInnerMax)} |`);
  return out;
}

/** 行列の要約(代表数 × 個数比ごとに 3 種)。 */
export function summarize(runs) {
  const out = [];
  for (const nRep of NREPS) for (const ratio of RATIOS) {
    const rs = runs.filter((r) => r.matrix && r.nRep === nRep && r.ratio === ratio);
    const ws = rs.map((r) => r.gates.worst);
    out.push({ nRep, ratio, mDR: rs[0] ? rs[0].mDR : null, nSeeds: rs.length, nPass: rs.filter((r) => r.gates.verdict === '形状達成').length,
      retStarsMin: Math.min(...ws.map((w) => w.retStars)), retStarsMax: Math.max(...ws.map((w) => w.retStars)),
      rhMin: Math.min(...ws.map((w) => w.rhRelChange)), rhMax: Math.max(...ws.map((w) => w.rhRelChange)),
      dAInnerMax: Math.max(...rs.map((r) => r.dominance.worst[0])) });
  }
  return out;
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const TARGET = process.env.QA_TARGET || 'beta/index.html';
if (IS_MAIN && process.argv.includes('--child')) {
  // 子プロセス: 1 走行だけ(JSON を標準出力へ)
  const spec = JSON.parse(process.argv[process.argv.indexOf('--child') + 1]);
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const { HP } = loadHtmlMain(path.join(ROOT, TARGET));
  const r = runOne(HP, spec.spec, spec.Tout, spec.Rout);
  process.stdout.write(JSON.stringify(r));
} else if (IS_MAIN) {
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const outDir = path.join(ROOT, 'tests', 'out');
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const t0 = Date.now();
  const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
  const pd = byId(HP, PRESET);
  if (!pd) throw new Error(PRESET + ' が内蔵に無い');
  const Rout = pd.bodies.find((b) => b.type === 'disk').radius;
  // (A)
  const decl = declarationCheck(HP);
  console.log('(A) 宣言 ' + JSON.stringify(decl.ledger) + ' / radii ' + JSON.stringify(decl.radii));
  // T_out(基準 = 宣言どおり n40-r20-s0 の t=0)
  const { S: S0, preset: P0 } = buildSpec(HP, { key: 'orbit', nRep: 40, ratio: 20, seed: 0, variant: 'base' });
  const orbit = E283.outerOrbit(HP, S0, Rout);
  const toyTerm = toyTermAtT0(HP, S0, E283.populations(P0));
  console.log(`T_out: R_out ${Rout}・v_c ${orbit.vc.toFixed(4)}・T_out ${orbit.Tout.toFixed(3)}(${Math.round(orbit.Tout / DT)} 步)・トイ項 ${JSON.stringify(toyTerm)}`);
  // (B)
  const tB = Date.now();
  const e9 = contactInert(HP);
  console.log(`(B) E9: ${JSON.stringify(e9)}(${((Date.now() - tB) / 1000).toFixed(1)} s)`);
  // (D) 走行(子プロセスの並列 —— 結果は並列数に依らない)
  const ONLY = process.env.W284A_ONLY ? process.env.W284A_ONLY.split(',') : null;   // 開発用(正本を書くときは使わない)
  const specs = runSpecs().filter((z) => !ONLY || ONLY.includes(z.key));
  const NW = Math.max(1, Number(process.env.W284A_WORKERS) || 3);
  const results = new Array(specs.length);
  let next = 0;
  const self = fileURLToPath(import.meta.url);
  const runChild = (idx) => new Promise((res, rej) => {
    const arg = JSON.stringify({ spec: specs[idx], Tout: orbit.Tout, Rout });
    const ch = spawn(process.execPath, [self, '--child', arg], { cwd: ROOT, env: process.env });
    let out = '', err = '';
    ch.stdout.on('data', (d) => { out += d; }); ch.stderr.on('data', (d) => { err += d; });
    ch.on('close', (code) => { if (code !== 0) return rej(new Error(specs[idx].key + ': ' + err.slice(0, 400)));
      try { results[idx] = JSON.parse(out); } catch (e) { return rej(e); }
      const r = results[idx], w = r.gates.worst;
      console.log(`(D) ${r.key}: ${r.gates.verdict}${r.gates.failed.length ? '(' + r.gates.failed.join(',') + ')' : ''}・保持 ${w.retStars.toFixed(3)}/${w.retDR === null ? '—' : w.retDR.toFixed(3)}・r_h 変化 ${w.rhRelChange.toFixed(3)}・軸比 ${w.axis.toFixed(3)}・v/σ ${w.vOverSigma.toFixed(3)}・D_A 最悪 ${r.dominance.worst.map((x) => x.toFixed(3)).join('/')}・${r.wallSec.toFixed(0)} s`);
      res(); });
  });
  const order = specs.map((_, i) => i).sort((a, b) => (specs[b].nRep - specs[a].nRep) || (a - b));   // 重い走行から(並べ替えは走らせる順だけ —— 結果の並びは specs の順)
  const lane = async () => { while (next < order.length) { const i = order[next++]; await runChild(i); } };
  await Promise.all(Array.from({ length: Math.min(NW, specs.length) }, lane));
  const runs = results;
  const base = runs.find((r) => r.key === runKey(40, 20, 0));
  // (E)
  const floorStars = E283.axisFloor(base.samples[0].nAxis);
  const mAll = []; { const { S, preset } = buildSpec(HP, { key: 'floor', nRep: 40, ratio: 20, seed: 0, variant: 'base' });
    const pop = E283.populations(preset); for (const i of pop.stars.concat(pop.dr)) mAll.push(S.m[i]); }
  const floorMass = axisFloorWeighted(mAll);
  // 前後(第283便f の基準走行 —— 正本 cluster-w283f.json の値を読むだけ)
  let before = null;
  try { const J0 = JSON.parse(fs.readFileSync(path.join(outDir, 'cluster-w283f.json'), 'utf8'));
    const b0 = J0.runs[0]; before = { source: 'tests/out/cluster-w283f.json', key: b0.key, verdict: b0.gates.verdict, failed: b0.gates.failed, worst: b0.gates.worst,
      boundStarsT0: b0.samples[0].info.boundStars, E0: b0.samples[0].info.E, E1: b0.samples[1].info.E }; } catch { before = null; }
  const CODE = ['tests/exp-w284a-cluster.mjs', 'tests/exp-w283f-cluster.mjs', 'tests/lib-w281c-rotorledger.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w279b-headless.mjs',
    'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  const INPUTS = [TARGET, 'tests/out/cluster-w283f.json'];
  const meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第284便a', target: TARGET, code: CODE, inputs: INPUTS }), {
    harnessVersion: HARNESS_VERSION, loadErrors: errors.length,
    ruling: '原仮定者の裁定(第74報)④: clusterAnalogyBH を修正する。ダークローターは恒星質量で、大きさは惑星、数は恒星の 10〜20 倍。星団では中心の DFM 版 BH の引きずりが支配的。この条件で安定させる。楕円銀河以降では引きずりの連鎖でディスクになる',
    reading: '統括の検証項目 R89(未達の 2 つの原因・量の分離・D_A)・R90(平衡初速の規則)',
    dt: DT, seeds: SEEDS, nReps: NREPS, ratios: RATIOS,
    notClaim: ['形状が安定した', '観測一致を達成した', '較正を完了した', '47 Tuc を再現した', '新発見', '楕円銀河でディスクになった'] });
  const out = { meta,
    gates: Object.assign({}, GATES, { text: GATE_TEXT, declaredBeforeMeasure: true, source: 'tests/exp-w283f-cluster.mjs' }),
    dominance: Object.assign({}, DOMINANCE, { text: DOMINANCE_TEXT, declaredBeforeMeasure: true }),
    preset: PRESET, declaration: decl, orbit, toyTerm, contactInert: e9,
    runs, summary: summarize(runs),
    verdict: base.gates.verdict, failed: base.gates.failed, dominanceVerdict: base.dominance.verdict,
    axisFloor: { stars: floorStars, massWeighted: floorMass },
    before,
    elapsedS: (Date.now() - t0) / 1000 };
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'cluster-w284a.json'), JSON.stringify(out, null, 1) + '\n');
  console.log('→ tests/out/cluster-w284a.json(' + out.elapsedS.toFixed(1) + ' s)・判定 ' + out.verdict + '・支配 ' + out.dominanceVerdict);
}
