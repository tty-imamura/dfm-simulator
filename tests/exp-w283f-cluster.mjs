// 第283便f(原仮定者の裁定(第72報)⑥「アナロジーは geoPN=3・中心にスケール調整した DFM 版ブラックホール・対象は球状星団 →
// 楕円銀河 → 渦巻銀河 → 棒渦巻銀河・質量合わせは恒星質量ダークローター」の**第 1 段(球状星団)**・原仮定者の裁定(第73報)の
// AN27〔lens:"excluded" は宣言だけで rayHeavy に入っていない —— 実装する〕・統括の検証項目 R81)—— **球状星団アナロジーの器**。
//
// ■ 形状の門(**測る前に書いた** —— 下の `GATES`。第282便d の 🌚 の保持率 0.775 を通すために後から下げない)
//   窓: 初期緩和を除いた固定窓 [T_relax, T_end] = [1, 3] × T_out(T_out = 外縁 R_out の公転時間 2πR_out/v_c(R_out)・
//       v_c は t=0 の配置の**実際の重力加速度**の 64 方位の環平均 —— E4 と同じ核の `dfmField` need:"gravity")。
//       標本は 0.25 T_out ごと(窓の中は 9 点)。どの対照も**基準走行の T_out** で同じ窓を使う。
//   門(窓の**すべての標本**で満たす): NaN 0 / 保持率(r ≤ 2R_out の割合 —— 恒星と DR を別々に)≥ 0.90 /
//       恒星の半質量半径の変化 |r_h(t)/r_h(T_relax) − 1| ≤ 0.10 / 軸比(恒星・r ≤ 2R_out の 1/r² 重みの慣性テンソル
//       〔reduced inertia tensor〕の √(λ_min/λ_max))≥ 0.9 / 回転と分散の比 |v_rot|/σ ≤ 0.5(恒星・r ≤ 2R_out)/
//       トイの帳簿 E_toy+E_mesh = 0(厳密)/ 停止理由なし。
//   判定の語は**形状達成 / 未達**(未達なら未達と書く —— 門は動かさない)。
//
// ■ 何を測るか(Node だけ —— 対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読む)
//   (A) 💮 clusterAnalogyBH の走行(基準)と対照: 中心 spin 0 / DR なし / N_rep 80・160(DR の総質量一定)。
//   (B) 台帳の恒等式(bodies の質量の和 ↔ massLedger の宣言 ↔ 純関数 tests/lib-w281c-rotorledger.mjs)・中心の無次元量
//       GM/(Rc²)・ΩR/c(🌚 と同じ値の宣言)・W_bg の出どころ("declared")。
//   (C) 軸比の標本の床(N 個の等方な方位だけで決まる —— 走行と無関係の純計算)。
//   (D) 光線(AN37 の実装先 rayHeavy): 基点 html(`W283F_BASE` —— 既定 beta/_w283_base.html)と今の html で、内蔵の各本の
//       「重い天体」の集合と光線の扇 31 本の終端をビット比較する(🌚 だけが変わる宣言)。💮 は DR の質量を 0 にした写しと
//       終端が同じ(光線は DR に依らない)ことと、基点の規則なら DR が重い天体に入ることを数で置く。
//   (E) 47 Tuc の参照行(既存 CSV の行を読むだけ —— **一致とは書かない**・比較の数を作らない)。
//
// ■ しないこと・言わないこと
//   ・既存 140 本の力学に触らない(対照の写しは器の中だけ)。観測値と突き合わせない。
//   ・「形状が安定した」「観測一致を達成した」「較正を完了した」「47 Tuc を再現した」「新発見」と書かない。
//
// 実行(Node だけ・Chromium 不要): W283F_BASE=beta/_w283_base.html node tests/exp-w283f-cluster.mjs
//   (W283F_BASE が無ければ (D) の基点比較を SKIP して正本に `raysBase:null` と書く —— 統括の chain では基点 html を渡す)
// 読む正本: なし(html・CSV だけ)。正本: tests/out/cluster-w283f.json(target=beta/index.html・領域 hash REGEN_SCOPE)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import * as LR from './lib-w281c-rotorledger.mjs';
// 第281便a(AN16・R71): **この器が読む html の領域**の宣言(1 行の JSON —— lint.regenScope が読む)
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
const REGEN_SCOPE = {"presets":"all","roots":["$","DT","HP.allPresets","HP.dfmField","HP.dfmFieldContractOf","HP.dfmFieldSnapshot","HP.dfmMeshVelocityFieldAt","HP.sim","HP.validatePreset","T","ch","ctx","cw","dfmField","lensExcludedRows","rayHeavy","rayMassMin","traceRay"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w283f-cluster-1';
export const PRESET = 'clusterAnalogyBH';
export const DT = 0.016;
export const NAZ = 64;
export const RAY_FAN = 31;
export const REL_TOL = 1e-12;

/**
 * **形状の門(測る前に宣言 —— 第283便f)**。値を後から動かさない(QA `behavior.clusterAnalogy` が PHYSICS の門の段落・
 * 正本の `gates` と 1 字ずつ照合する)。
 */
export const GATES = Object.freeze({
  version: 'w283f-gates-1',
  window: Object.freeze({ relaxOut: 1, endOut: 3, sampleEveryOut: 0.25 }),
  nanMax: 0,
  retentionMin: 0.90, retentionRadiusOverRout: 2,
  halfMassRelChangeMax: 0.10,
  axisRatioMin: 0.9,
  vOverSigmaMax: 0.5,
  energyCloseAbsMax: 0,
  stop: null,
});
export const GATE_TEXT = [
  `窓 [T_relax, T_end] = [${GATES.window.relaxOut}, ${GATES.window.endOut}] × T_out(標本 ${GATES.window.sampleEveryOut} T_out ごと)`,
  `NaN ${GATES.nanMax}`,
  `保持率(r ≤ ${GATES.retentionRadiusOverRout} R_out・恒星と DR を別々に)≥ ${GATES.retentionMin.toFixed(2)}`,
  `恒星の半質量半径の変化 ≤ ${(GATES.halfMassRelChangeMax * 100).toFixed(0)}%`,
  `軸比(1/r² 重みの慣性テンソル)≥ ${GATES.axisRatioMin}`,
  `|v_rot|/σ ≤ ${GATES.vOverSigmaMax}`,
  `E_toy+E_mesh = ${GATES.energyCloseAbsMax}(厳密)・停止理由なし`,
];

const clone = (o) => JSON.parse(JSON.stringify(o));
const byId = (HP, id) => HP.allPresets().find((q) => q.id === id);
export const rel = (a, b) => (a === b) ? 0 : Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b), 1e-300);

/** 対照の写し(器の中だけ)。key: base / spin0 / noDR / nrep80 / nrep160。 */
export const RUNS = [
  { key: 'base', label: '基準(宣言どおり・N_rep 40)' },
  { key: 'spin0', label: '中心 spin 0(自転の寄与だけを外す)' },
  { key: 'noDR', label: 'DR なし(DR の行と台帳を外す —— 総質量は M★+中心だけ)' },
  { key: 'nrep80', label: 'N_rep 80(DR の総質量 2125 一定・1 体 26.5625)' },
  { key: 'nrep160', label: 'N_rep 160(DR の総質量 2125 一定・1 体 13.28125)' },
  // 情報の対照(**第 1 走の後に足した** —— 未達の理由の切り分け用。門の判定の対象ではない・門は動かしていない)
  { key: 'toyOff', label: '情報の対照: トイを外す(geoPN=0・spaceMesh なし —— 重力 E4 だけ・同じ初期配置)', info: true },
  { key: 'toyOffNoDR', label: '情報の対照: トイを外し DR も外す(重力 E4 だけ・恒星と中心)', info: true },
  { key: 'smallR', label: '情報の対照: DR 代表粒子の半径を小さく(rMul 1.2 → 0.2・R 8.75 → 1.46 —— E9 の接触ばねが DR どうしで働かない大きさ)', info: true },
];
export function variantPreset(HP, key) {
  const p = clone(byId(HP, PRESET));
  const k = p.bodies.findIndex((b) => b.type === 'disk' && b.lightSweep === 1);
  if (key === 'spin0') p.bodies[0].spin = 0;
  else if (key === 'noDR' || key === 'toyOffNoDR') { p.bodies.splice(k, 1); delete p.massLedger; }
  else if (key === 'nrep80' || key === 'nrep160') {
    const n = key === 'nrep80' ? 80 : 160, m = p.massLedger.darkRotor.totalUnit / n;
    p.bodies[k].n = n; p.bodies[k].mMin = m; p.bodies[k].mMax = m;
    p.massLedger.darkRotor.nRep = n; p.massLedger.darkRotor.mPerRepUnit = m;
  }
  if (key === 'smallR') p.bodies[k].rMul = 0.2;
  if (key === 'toyOff' || key === 'toyOffNoDR') { p.physics.geoPN = 0; delete p.physics.spaceMesh; if (p.overlays) delete p.overlays.spaceMesh; }
  return p;
}
export function buildVariant(HP, key) {
  const p = variantPreset(HP, key);
  const v = HP.validatePreset(p);
  if (!v.ok) throw new Error('validatePreset(' + key + '): ' + (v.errors || []).join(' / '));
  HP.sim.build(v.preset);
  return { S: HP.sim, preset: v.preset, warnings: v.warnings };
}
/** 行ごとの粒子の添字(build の順: single → disk 行)。 */
export function populations(preset) {
  let i = 0; const out = { center: [], stars: [], dr: [] };
  for (const b of preset.bodies) {
    if (b.type === 'single') { out.center.push(i); i += 1; continue; }
    const tgt = (b.lightSweep === 1) ? out.dr : out.stars;
    for (let j = 0; j < b.n; j++) tgt.push(i + j);
    i += b.n;
  }
  return out;
}

/** t=0 の配置の v_c(R)(実際の重力加速度の環平均)と T_out。 */
export function outerOrbit(HP, S, Rout) {
  const B = HP.dfmFieldSnapshot(S).bodies;
  const G = S.params.G, eps = S.params.softening;
  let ar = 0, n = 0;
  for (let a = 0; a < NAZ; a++) {
    const th = 2 * Math.PI * a / NAZ, x = Rout * Math.cos(th), y = Rout * Math.sin(th);
    const f = HP.dfmField(B, x, y, { need: 'gravity', G, eps, p: 1, D0: 0, background: 'static' });
    if (!f) continue;
    ar += -(f.gravity[0] * x + f.gravity[1] * y) / Rout; n++;
  }
  const aR = ar / n, vc = Math.sqrt(Rout * aR);
  return { Rout, aR, vc, Tout: 2 * Math.PI * Rout / vc, nAz: n };
}

/** 2×2 の対称テンソルの軸比 √(λ_min/λ_max)。 */
export function axisRatio2(a, b, c) {
  const h = 0.5 * (a + c), d = Math.sqrt(0.25 * (a - c) * (a - c) + b * b);
  const lp = h + d, lm = h - d;
  return (lp > 0) ? Math.sqrt(Math.max(lm, 0) / lp) : null;
}

/** 1 標本の量(門の量 + 情報の量)。 */
export function measure(S, pop, Rret) {
  const cx = S.x[pop.center[0]], cy = S.y[pop.center[0]], cvx = S.vx[pop.center[0]], cvy = S.vy[pop.center[0]];
  let nan = 0;
  for (let i = 0; i < S.n; i++) if (!(Number.isFinite(S.x[i]) && Number.isFinite(S.y[i]) && Number.isFinite(S.vx[i]) && Number.isFinite(S.vy[i]))) nan++;
  const rOf = (i) => Math.hypot(S.x[i] - cx, S.y[i] - cy);
  const ret = (ids) => ids.length ? ids.filter((i) => rOf(i) <= Rret).length / ids.length : null;
  const halfR = (ids) => {
    if (!ids.length) return null;
    const rs = ids.map((i) => ({ r: rOf(i), m: S.m[i] })).sort((p, q) => p.r - q.r);
    let M = 0; for (const z of rs) M += z.m;
    let c = 0; for (const z of rs) { c += z.m; if (c >= 0.5 * M) return z.r; }
    return rs[rs.length - 1].r;
  };
  const lag = (ids, f) => { if (!ids.length) return null; const rs = ids.map(rOf).sort((p, q) => p - q); return rs[Math.min(rs.length - 1, Math.max(0, Math.ceil(f * rs.length) - 1))]; };
  // 軸比と v/σ(恒星・r ≤ Rret)
  let a = 0, b = 0, c = 0, nIn = 0, sPhi = 0, sR = 0;
  const vp = [], vr = [];
  for (const i of pop.stars) {
    const dx = S.x[i] - cx, dy = S.y[i] - cy, r = Math.hypot(dx, dy);
    if (!(r > 0) || r > Rret) continue;
    a += dx * dx / (r * r); b += dx * dy / (r * r); c += dy * dy / (r * r); nIn++;
    const ux = S.vx[i] - cvx, uy = S.vy[i] - cvy;
    const vR = (ux * dx + uy * dy) / r, vF = (-ux * dy + uy * dx) / r;
    vr.push(vR); vp.push(vF); sPhi += vF; sR += vR;
  }
  const q = nIn ? axisRatio2(a / nIn, b / nIn, c / nIn) : null;
  let vRot = null, sigma = null;
  if (nIn) {
    vRot = sPhi / nIn; const mR = sR / nIn;
    let s2 = 0; for (let k = 0; k < nIn; k++) s2 += (vp[k] - vRot) * (vp[k] - vRot) + (vr[k] - mR) * (vr[k] - mR);
    sigma = Math.sqrt(s2 / (2 * nIn));
  }
  // 情報: 力学エネルギー(軟化した対ポテンシャル —— E4 と同じ核)と束縛の割合
  const G = S.params.G, eps2 = S.params.softening * S.params.softening;
  const phi = new Float64Array(S.n);
  let K = 0, W = 0, nOverlap = 0;
  for (let i = 0; i < S.n; i++) {
    if (S.pinned[i] !== 1) K += 0.5 * S.m[i] * ((S.vx[i]) ** 2 + (S.vy[i]) ** 2);
    for (let j = i + 1; j < S.n; j++) {
      const d = Math.sqrt((S.x[i] - S.x[j]) ** 2 + (S.y[i] - S.y[j]) ** 2 + eps2);
      phi[i] -= G * S.m[j] / d; phi[j] -= G * S.m[i] / d; W -= G * S.m[i] * S.m[j] / d;
      if (Math.hypot(S.x[i] - S.x[j], S.y[i] - S.y[j]) < S.R[i] + S.R[j]) nOverlap++;   // E9 の接触(重なり)の対の数
    }
  }
  const bound = (ids) => ids.length ? ids.filter((i) => 0.5 * ((S.vx[i] - cvx) ** 2 + (S.vy[i] - cvy) ** 2) + phi[i] < 0).length / ids.length : null;
  return {
    t: S.t, nan, stop: (S.geoToyStop === undefined) ? null : S.geoToyStop, Eclose: S.geoToyE + S.geoToyEmesh,
    retStars: ret(pop.stars), retDR: ret(pop.dr), rhStars: halfR(pop.stars), axis: q, nAxis: nIn,
    vRot, sigma, vOverSigma: (sigma > 0) ? Math.abs(vRot) / sigma : null,
    info: { rhDR: halfR(pop.dr), rhAll: halfR(pop.stars.concat(pop.dr)),
      lagStars: [lag(pop.stars, 0.1), lag(pop.stars, 0.5), lag(pop.stars, 0.9)], lagDR: [lag(pop.dr, 0.1), lag(pop.dr, 0.5), lag(pop.dr, 0.9)],
      boundStars: bound(pop.stars), boundDR: bound(pop.dr), K, W, E: K + W, n: S.n, nOverlap,
      Rdr: pop.dr.length ? S.R[pop.dr[0]] : null, Rstar: S.R[pop.stars[0]] },
  };
}

/** 窓の標本だけで門を判定する純関数(QA が正本の標本から作り直す)。 */
export function gateEval(samples, T, gates = GATES) {
  const w0 = gates.window.relaxOut * T - 1e-9 * T, w1 = gates.window.endOut * T + 1e-9 * T;
  const win = samples.filter((z) => z.t >= w0 && z.t <= w1);
  const ref = win[0];
  const pass = {}, worst = {};
  worst.nan = Math.max(...samples.map((z) => z.nan));
  pass.nan = worst.nan <= gates.nanMax;
  worst.retStars = Math.min(...win.map((z) => z.retStars));
  pass.retStars = worst.retStars >= gates.retentionMin;
  const hasDR = win.every((z) => z.retDR !== null);
  worst.retDR = hasDR ? Math.min(...win.map((z) => z.retDR)) : null;
  pass.retDR = hasDR ? worst.retDR >= gates.retentionMin : null;
  worst.rhRelChange = Math.max(...win.map((z) => Math.abs(z.rhStars / ref.rhStars - 1)));
  pass.rh = worst.rhRelChange <= gates.halfMassRelChangeMax;
  worst.axis = Math.min(...win.map((z) => z.axis));
  pass.axis = worst.axis >= gates.axisRatioMin;
  worst.vOverSigma = Math.max(...win.map((z) => z.vOverSigma));
  pass.vOverSigma = worst.vOverSigma <= gates.vOverSigmaMax;
  worst.Eclose = Math.max(...samples.map((z) => Math.abs(z.Eclose)));
  pass.Eclose = worst.Eclose <= gates.energyCloseAbsMax;
  pass.stop = samples.every((z) => z.stop === gates.stop);
  const failed = Object.keys(pass).filter((k) => pass[k] === false);
  return { nWindow: win.length, tRelax: ref.t, tEnd: win[win.length - 1].t, worst, pass, failed,
    verdict: failed.length === 0 ? '形状達成' : '未達' };
}

/** 1 走行(0〜T_end を 0.25 T_out ごとに標本)。 */
export function runVariant(HP, key, Tout, Rout) {
  const { S, preset } = buildVariant(HP, key);
  const pop = populations(preset);
  const Rret = GATES.retentionRadiusOverRout * Rout;
  const every = GATES.window.sampleEveryOut * Tout;
  const nS = Math.round(GATES.window.endOut / GATES.window.sampleEveryOut);
  const stepsPer = Math.round(every / DT);
  const samples = [measure(S, pop, Rret)];
  const t0 = Date.now();
  let k = 0;
  for (let s = 1; s <= nS; s++) {
    while (k < s * stepsPer) { S.step(DT); k++; }
    samples.push(measure(S, pop, Rret));
  }
  const wallRun = (Date.now() - t0) / 1000;
  const Tq = stepsPer * DT / GATES.window.sampleEveryOut;   // 標本の刻みを步の整数に丸めた実効の T_out
  const gates = gateEval(samples, Tq);
  return { key, n: S.n, nStars: pop.stars.length, nDR: pop.dr.length, steps: k, stepsPerSample: stepsPer, ToutEff: Tq, rateStepsPerSec: k / Math.max(wallRun, 1e-9),
    spinCenter: S.spin[pop.center[0]], samples, gates,
    finalStars: pop.stars.map((i) => [S.x[i], S.y[i]]) };
}

/** 台帳の恒等式と中心の無次元量。 */
export function ledgerAndScale(HP, lensFn) {
  const pd = byId(HP, PRESET);
  const v = HP.validatePreset(clone(pd));
  const ml = v.preset.massLedger;
  const { S, preset } = buildVariant(HP, 'base');
  const pop = populations(preset);
  let star = 0, dr = 0, core = 0;
  for (const i of pop.stars) star += S.m[i];
  for (const i of pop.dr) dr += S.m[i];
  for (const i of pop.center) core += S.m[i];
  const g = { starBase: ml.starBase, fStar: ml.fStar, gas: ml.gas, core: ml.core, unitKg: ml.unitKg };
  const led = LR.rotorLedger(g, { mStarSun: ml.mStarSun, nRatio: ml.nRatio, scenarios: ml.rotorScenarios.map((r) => r.mRotorSun) });
  let worst = 0;
  const cmp = (a, b) => { worst = Math.max(worst, rel(a, b)); };
  cmp(led.current.totalUnit, ml.currentTotalUnit); cmp(led.current.totalSun, ml.currentTotalSun);
  led.rows.forEach((r, k) => { const w = ml.rotorScenarios[k]; for (const f of ['mRotorSun', 'nRotor', 'mRotorUnit', 'totalUnit', 'totalSun']) cmp(r[f], w[f]); });
  const c = pd.bodies[0], G = pd.physics.G, cl = pd.physics.cLight;
  const moon = byId(HP, 'galaxyAnalogyBH');
  const mc = moon.bodies[0], mG = moon.physics.G, mcl = moon.physics.cLight;
  const lensRows = (typeof lensFn === 'function') ? lensFn(v.preset) : null;
  const contract = HP.dfmFieldContractOf(S, 'toy').contract;
  return {
    declared: { starBase: ml.starBase, core: ml.core, darkRotor: ml.darkRotor, fStar: ml.fStar, defaultScenario: ml.defaultScenario, warnings: v.warnings },
    built: { n: S.n, nStars: pop.stars.length, nDR: pop.dr.length, star, dr, core, lensExMarked: S.lensEx ? Array.from(S.lensEx).reduce((s, x) => s + x, 0) : 0 },
    identity: { nRepTimesMPerRep: ml.darkRotor.nRep * ml.darkRotor.mPerRepUnit, builtDrMinusDeclared: dr - ml.darkRotor.totalUnit,
      builtStarMinusStarBase: star - ml.starBase, builtCoreMinusCore: core - ml.core, drOverStar: dr / star,
      declaredRatio: ml.nRatio * ml.darkRotor.mRotorSun / ml.mStarSun, recomputeMaxRel: worst },
    ledger: { current: led.current, rows: led.rows.map((r) => ({ mRotorSun: r.mRotorSun, nRotor: r.nRotor, mRotorUnit: r.mRotorUnit, totalUnit: r.totalUnit, totalSun: r.totalSun })) },
    lensRows,
    center: { m: c.m, R: c.radius, spin: c.spin, GMoverRc2: G * c.m / (c.radius * cl * cl), OmegaRoverC: c.spin * c.radius / cl,
      McenterOverCluster: c.m / (star + dr) },
    centerMoon: { id: 'galaxyAnalogyBH', m: mc.m, R: mc.radius, spin: mc.spin, GMoverRc2: mG * mc.m / (mc.radius * mcl * mcl), OmegaRoverC: mc.spin * mc.radius / mcl },
    wbg: { Wbg: contract.Wbg, WbgFrom: contract.WbgFrom, D0: pd.physics.D0, spaceMeshD0: pd.physics.spaceMesh.D0 },
  };
}

/** 軸比の標本の床: N 個の等方な方位(乱数種固定)の 1/r² 重みテンソルの軸比の分布。 */
export function axisFloor(N, draws = 4000, seed = 283006) {
  let s = seed >>> 0;
  const rnd = () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const qs = [];
  for (let d = 0; d < draws; d++) {
    let a = 0, b = 0, c = 0;
    for (let k = 0; k < N; k++) { const th = 2 * Math.PI * rnd(), x = Math.cos(th), y = Math.sin(th); a += x * x; b += x * y; c += y * y; }
    qs.push(axisRatio2(a / N, b / N, c / N));
  }
  qs.sort((p, q) => p - q);
  const below = qs.filter((q) => q < GATES.axisRatioMin).length / draws;
  return { N, draws, seed, mean: qs.reduce((x, y) => x + y, 0) / draws, p05: qs[Math.floor(0.05 * draws)], median: qs[Math.floor(0.5 * draws)],
    fracBelowGate: below, fracMin9Below: 1 - Math.pow(1 - below, 9) };
}

/** 光線の扇(プリセットの広がりから決める —— 左から +x 向き)。 */
function fanOf(H, S) {
  const traceRay = H.evalExpr('traceRay');
  let Rb = 0; for (let i = 0; i < S.n; i++) { const r = Math.hypot(S.x[i], S.y[i]); if (Number.isFinite(r) && r > Rb) Rb = r; }
  if (!(Rb > 0)) Rb = 1;
  const out = [];
  for (let k = 0; k < RAY_FAN; k++) {
    const y0 = -Rb + 2 * Rb * k / (RAY_FAN - 1);
    const r = traceRay(S, -1.5 * Rb, y0, 1, 0, 3 * Rb / 700, 700, null);
    out.push([r.x, r.y, r.cx, r.cy, r.tau === undefined ? null : r.tau]);
  }
  return { Rb, ends: out };
}
function heavyOf(H, S) { const rh = H.evalExpr('rayHeavy'); const a = []; for (let i = 0; i < S.n; i++) if (rh(S, i)) a.push(i); return a; }
const sameArr = (a, b) => a.length === b.length && a.every((v, i) => Object.is(v, b[i]));

/** (D) 基点 html と今の html で、内蔵の各本の重い天体と光線の扇をビット比較する。 */
export function raySurvey(H0, H1) {
  const ids1 = H1.HP.allPresets().map((p) => p.id);
  const ids0 = new Set(H0 ? H0.HP.allPresets().map((p) => p.id) : []);
  const rows = [];
  for (const id of ids1) {
    const p1 = clone(byId(H1.HP, id));
    const v1 = H1.HP.validatePreset(p1); H1.HP.sim.build(v1.preset);
    const S1 = H1.HP.sim, heavy1 = heavyOf(H1, S1), f1 = fanOf(H1, S1);
    const row = { id, emoji: p1.emoji, n: S1.n, heavyNow: heavy1.length, lensEx: S1.lensEx ? Array.from(S1.lensEx).reduce((s, x) => s + x, 0) : 0 };
    if (H0 && ids0.has(id)) {
      const p0 = clone(byId(H0.HP, id));
      const v0 = H0.HP.validatePreset(p0); H0.HP.sim.build(v0.preset);
      const S0 = H0.HP.sim, heavy0 = heavyOf(H0, S0), f0 = fanOf(H0, S0);
      row.heavyBase = heavy0.length; row.heavySame = sameArr(heavy0, heavy1);
      let nd = 0, maxAng = 0;
      f1.ends.forEach((a, k) => { const b = f0.ends[k]; if (!a.every((v, j) => Object.is(v, b[j]))) nd++;
        maxAng = Math.max(maxAng, Math.abs(Math.atan2(a[3], a[2]) - Math.atan2(b[3], b[2]))); });
      row.raysDiffering = nd; row.maxDirDiffRad = maxAng;
    } else { row.heavyBase = null; row.heavySame = null; row.raysDiffering = null; row.newInNow = true; }
    rows.push(row);
  }
  return rows;
}
/** 💮: DR の質量を 0 にした写しと光線の終端が同じか(今の html)・基点の規則(DR が重い天体に入る)の数。 */
export function clusterRays(H1, H0) {
  const p = clone(byId(H1.HP, PRESET));
  const v = H1.HP.validatePreset(p); H1.HP.sim.build(v.preset);
  const S = H1.HP.sim, pop = populations(v.preset);
  const rh = H1.evalExpr('rayHeavy');
  const cnt = (ids) => ids.filter((i) => rh(S, i)).length;
  const heavy = { center: cnt(pop.center), stars: cnt(pop.stars), dr: cnt(pop.dr), nDR: pop.dr.length };
  const eWith = fanOf(H1, S).ends;
  const keep = pop.dr.map((i) => S.m[i]);
  pop.dr.forEach((i) => { S.m[i] = 0; });
  const eWithout = fanOf(H1, S).ends;
  pop.dr.forEach((i, k) => { S.m[i] = keep[k]; });
  const nd = eWith.filter((a, k) => !a.every((x, j) => Object.is(x, eWithout[k][j]))).length;
  let oldRule = null;
  if (H0) {
    // 基点の規則: 同じ写しを基点 html で build(基点は lens を読まない —— DR が重い天体に入る)
    const v0 = H0.HP.validatePreset(clone(p));
    if (v0.ok) {
      H0.HP.sim.build(v0.preset);
      const S0 = H0.HP.sim, rh0 = H0.evalExpr('rayHeavy');
      const e0 = fanOf(H0, S0).ends;
      oldRule = { drHeavy: pop.dr.filter((i) => rh0(S0, i)).length, raysDifferFromNow: e0.filter((a, k) => !a.every((x, j) => Object.is(x, eWith[k][j]))).length };
    } else oldRule = { error: (v0.errors || []).join(' / ').slice(0, 160) };
  }
  return { heavy, rays: eWith.length, raysDifferingDrMassZero: nd, oldRule };
}

/** (E) 47 Tuc の参照行(ヘッダ名で読む —— 値の比較は作らない)。 */
export const REF_QUANTITIES = ['distance', 'half_mass_radius_3d', 'sigma0', 'v_rot_over_sigma0'];
export function tucRefRows(root) {
  const CSV_REL = 'paper/data/cluster-galaxy-observations.csv';
  const parse = (line) => { const cols = []; let cur = '', q = false; for (const ch of line) { if (q) { if (ch === '"') q = false; else cur += ch; } else if (ch === '"') q = true; else if (ch === ',') { cols.push(cur); cur = ''; } else cur += ch; } cols.push(cur); return cols; };
  const lines = fs.readFileSync(path.join(root, CSV_REL), 'utf8').split('\n');
  const head = parse(lines[0]).map((z) => z.trim());
  const at = (c, k) => { const j = head.indexOf(k); return (j < 0 || c[j] === undefined || String(c[j]).trim() === '') ? null : String(c[j]); };
  const rows = [];
  lines.forEach((line, i) => {
    if (i === 0 || !line.trim()) return;
    const c = parse(line);
    if (at(c, 'body') !== '47 Tuc' || REF_QUANTITIES.indexOf(at(c, 'quantity')) < 0) return;
    rows.push({ csvRow: i + 1, quantity: at(c, 'quantity'), value: Number(at(c, 'value')), unit: at(c, 'unit'), recordId: at(c, 'record_id'),
      note: String(at(c, 'note') || '').slice(0, 120) });
  });
  return { csv: CSV_REL, rows, compare: 'not-compared', why: '参照の行を並べるだけ —— 単位の写像(トイ単位 ↔ pc・km/s)を宣言していないので比較の数を作らない(一致とは書かない)' };
}

/** PHYSICS〔第283便f〕の表の行(QA が正本から作り直して探す)。 */
export function docRows(J) {
  const f3 = (x) => (x === null || x === undefined ? '—' : Number(x).toFixed(3));
  const f4 = (x) => (x === null || x === undefined ? '—' : Number(x).toFixed(4));
  const out = { gates: GATE_TEXT.map((t) => '- ' + t), runs: [], rays: [], ledger: [], refs: [] };
  for (const r of J.runs) {
    const w = r.gates.worst;
    out.runs.push(`| ${r.key}${r.info ? '(情報)' : ''} | ${r.n} | ${f3(w.retStars)} | ${w.retDR === null ? '—' : f3(w.retDR)} | ${f3(w.rhRelChange)} | ${f3(w.axis)} | ${f3(w.vOverSigma)} | ${w.nan} | ${w.Eclose === 0 ? '0' : Number(w.Eclose).toExponential(1)} | ${r.gates.verdict}${r.gates.failed.length ? '(' + r.gates.failed.join('・') + ')' : ''} |`);
  }
  const moon = J.rays.survey.find((z) => z.id === 'galaxyAnalogyBH');
  const others = J.rays.survey.filter((z) => z.id !== 'galaxyAnalogyBH' && !z.newInNow);
  if (moon) out.rays.push(`| 🌚 galaxyAnalogyBH | ${moon.heavyBase} → ${moon.heavyNow} | ${moon.raysDiffering}/${J.rays.fan} |`);
  out.rays.push(`| 他の ${others.length} 本 | 集合が同じ ${others.filter((z) => z.heavySame).length}/${others.length} | ${others.reduce((s, z) => s + z.raysDiffering, 0)}/${others.length * J.rays.fan} |`);
  const L = J.ledger;
  out.ledger.push(`| 💮 clusterAnalogyBH | ${L.center.m} | ${L.center.R} | ${L.center.spin} | ${f4(L.center.GMoverRc2)} | ${f3(L.center.OmegaRoverC)} | ${f4(L.center.McenterOverCluster)} |`);
  out.ledger.push(`| 🌚 galaxyAnalogyBH | ${L.centerMoon.m} | ${L.centerMoon.R} | ${L.centerMoon.spin} | ${f4(L.centerMoon.GMoverRc2)} | ${f3(L.centerMoon.OmegaRoverC)} | — |`);
  for (const r of J.tuc47.rows) out.refs.push(`| ${r.quantity} | ${Number(r.value).toExponential()} ${r.unit} | ${r.recordId} | CSV ${r.csvRow} 行 |`);
  return out;
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) {
  const TARGET = process.env.QA_TARGET || 'beta/index.html';
  const BASE = process.env.W283F_BASE || null;
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const outDir = path.join(ROOT, 'tests', 'out');
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const { loadHtmlHeadless } = await import('./lib-w279b-headless.mjs');
  const t0 = Date.now();
  const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
  const pd = byId(HP, PRESET);
  if (!pd) throw new Error(PRESET + ' が内蔵に無い');
  const Rout = pd.bodies.find((b) => b.type === 'disk').radius;
  // (B)
  const ledger = ledgerAndScale(HP, globalThis.lensExcludedRows);
  console.log('(B) 台帳 ' + JSON.stringify(ledger.identity) + '・中心 ' + JSON.stringify(ledger.center) + '・W_bg ' + JSON.stringify(ledger.wbg));
  // T_out(基準の t=0)
  const { S: S0 } = buildVariant(HP, 'base');
  const orbit = outerOrbit(HP, S0, Rout);
  console.log(`T_out: R_out ${Rout}・v_c ${orbit.vc.toFixed(4)}・T_out ${orbit.Tout.toFixed(3)}(${Math.round(orbit.Tout / DT)} 步)`);
  // (A)
  const runs = [];
  for (const R of RUNS) {
    const t1 = Date.now();
    const r = runVariant(HP, R.key, orbit.Tout, Rout);
    r.label = R.label; r.info = !!R.info; r.wallSec = (Date.now() - t1) / 1000;
    const w = r.gates.worst;
    console.log(`(A) ${R.key}: ${r.gates.verdict}${r.gates.failed.length ? '(' + r.gates.failed.join(',') + ')' : ''}・保持 ${w.retStars.toFixed(3)}/${w.retDR === null ? '—' : w.retDR.toFixed(3)}・r_h 変化 ${w.rhRelChange.toFixed(3)}・軸比 ${w.axis.toFixed(3)}・v/σ ${w.vOverSigma.toFixed(3)}・NaN ${w.nan}・E ${w.Eclose}・${(1000 / r.rateStepsPerSec).toFixed(2)} ms/步・${r.wallSec.toFixed(0)} s`);
    runs.push(r);
  }
  const base = runs[0];
  const starsSame = runs.filter((r) => r.key !== 'base').map((r) => ({ key: r.key,
    t0StarsBitSame: (() => { const a = base.samples[0], b = r.samples[0]; return a.rhStars === b.rhStars && a.axis === b.axis; })() }));
  let dxSpin = 0; base.finalStars.forEach((p, i) => { const q = runs[1].finalStars[i]; dxSpin = Math.max(dxSpin, Math.hypot(p[0] - q[0], p[1] - q[1])); });
  // (C)
  const floor = axisFloor(base.samples[0].nAxis);
  console.log(`(C) 軸比の標本の床(N=${floor.N}): 平均 ${floor.mean.toFixed(4)}・5% 点 ${floor.p05.toFixed(4)}・0.9 未満の割合 ${floor.fracBelowGate.toFixed(4)}`);
  // (D)
  const H1 = loadHtmlHeadless(path.join(ROOT, TARGET));
  const H0 = BASE ? loadHtmlHeadless(path.join(ROOT, BASE)) : null;
  const t3 = Date.now();
  const survey = raySurvey(H0, H1);
  const cr = clusterRays(H1, H0);
  const moon = survey.find((z) => z.id === 'galaxyAnalogyBH');
  const others = survey.filter((z) => z.id !== 'galaxyAnalogyBH' && !z.newInNow);
  console.log(`(D) 光線 ${((Date.now() - t3) / 1000).toFixed(1)} s: 🌚 重い天体 ${moon.heavyBase}→${moon.heavyNow}・扇 ${moon.raysDiffering}/${RAY_FAN} 本が変わる / 他 ${others.length} 本: 集合が同じ ${others.filter((z) => z.heavySame).length}・変わった光線 ${others.reduce((s, z) => s + (z.raysDiffering || 0), 0)} / 💮 ${JSON.stringify(cr)}`);
  // (E)
  const tuc47 = tucRefRows(ROOT);
  const strip = (r) => { const o = Object.assign({}, r); delete o.finalStars; return o; };
  const CODE = ['tests/exp-w283f-cluster.mjs', 'tests/lib-w281c-rotorledger.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w279b-headless.mjs',
    'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  const INPUTS = [TARGET, 'paper/data/cluster-galaxy-observations.csv'].concat(BASE ? [BASE] : []);
  const meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第283便f', target: TARGET, code: CODE, inputs: INPUTS }), {
    harnessVersion: HARNESS_VERSION, loadErrors: errors.length, headlessErrors: H1.errors.length + (H0 ? H0.errors.length : 0), base: BASE,
    ruling: '原仮定者の裁定(第72報)⑥: アナロジーは geoPN=3・中心にスケール調整した DFM 版ブラックホール・対象は球状星団 → 楕円 → 渦巻 → 棒渦巻・質量合わせは恒星質量ダークローター(第 1 段: 球状星団)/ 原仮定者の裁定(第73報)AN27: lens:"excluded" を rayHeavy に実装',
    reading: '統括の検証項目 R81(中心 DFM BH・DR 台帳・形状の門を測る前に宣言)',
    dt: DT, nAz: NAZ, rayFan: RAY_FAN,
    notClaim: ['形状が安定した', '観測一致を達成した', '較正を完了した', '47 Tuc を再現した', '平坦回転を再現した', '新発見'] });
  const out = { meta,
    gates: Object.assign({}, GATES, { text: GATE_TEXT, declaredBeforeMeasure: true }),
    preset: PRESET, orbit, runs: runs.map(strip),
    controls: { t0StarsBitSame: starsSame, maxAbsDxStarsSpinVsZeroAtEnd: dxSpin },
    verdict: base.gates.verdict, failed: base.gates.failed,
    axisFloor: floor, ledger,
    rays: { fan: RAY_FAN, base: BASE, survey, cluster: cr },
    tuc47,
    elapsedS: (Date.now() - t0) / 1000 };
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'cluster-w283f.json'), JSON.stringify(out, null, 1) + '\n');
  console.log('→ tests/out/cluster-w283f.json(' + out.elapsedS.toFixed(1) + ' s)・判定 ' + out.verdict);
}
