// 第337便e(原仮定者の指示(2026-11-14 —— 第138報)「銀河を個々の天体でシミュレーションする事は不可能だが、流体とみなせばシミュレーションが出来る。それが geoPN=4 である」
//   「『土星の環』と『太陽系の惑星』がヒントとなる。その為に、並進引きずりと回転引きずりの検証を進める。長期的な安定については、軸引きずりが担う」・統括の検証項目 R341):
//   **銀河を流体と見る探索の器** —— T1 流体の要素の自己の重みの読み(B 体積の内の積分〔主候補〕・A 軟化の半径・C 星 1 個の R_d〔対照〕)の解像度の試し(静的: 同じ滑らかな密度と速度の場・
//   動的: 押しの列の構造の量への効き)/T2 流体のモーメントと保存する引きずり(行ごとに正規化〔第335便f の型 —— 対照〕・共通の分母の全成分・中心方向・中心方向 + 要素の中の散らばり Π)と帳簿/
//   T3 押しと速度の場を同格に(刻み h・h/2・h/4 と陰の積分)/T4 場の読み(中心の点・内の和・局所)/T5 環のヒント(並進・回転・軸の読みの候補 × 単体と連星)
//   (段 fluid-337e —— 正本 tests/out/fluid-337e.json・lib tests/lib-w337e-fluid.mjs・文書の lib tests/lib-w337e-fluiddoc.mjs)。**診断だけ** ——
//   エンジン・内蔵の本・受理器・第329〜336便の lib の本文は変えない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w337e-fluid.mjs —— 第317便d の satan の型・領域の宣言なし)。入力のファイルは無い(標本は種を宣言した乱数から)。1 プロセス。
// 任意の旗 `--heavy`: 重い列(T1 の N 1024・2048・T3 の h/8・T5 の試験の粒子 256 × 60 周)を正本の外のファイル(環境変数 W337E_HEAVY_OUT・既定は一時のディレクトリ)に書く —— 正本は作り直さない。
//   既定の正本は 60 s の内に収めるため間引いた格子(T1 は N 256・512・T2 は N 512・T3/T4 の動的は N 256・T5 は 128 粒子 × 20 周)。
//
// ■ 走らせた格子と判定の物差し(式の形の宣言ではなく、何を測ったかの記録 —— PLAN。後から型やノブを足したら AMEND に理由と一緒に書く)
//   T1 静的: Plummer 球(G = M = a = 1・切り 0.99)× N 256・512 × 種 3 × 軟化 ε 0.05 × 重み α 2(連続の場との比べはこれだけ)・1 × 読み none・A・B(解析の密度)・Bk(k 近傍の密度)・C ×
//     速度の場 rigid(Ω 0.5)・shear(S 0.5)・diff(Ω₀ 0.5)・iso(分布関数の速度 —— 散らばり)。量: 自己の分け前 w_ii/(w_ii + W_i) の平均・全体の重み (w_ii + W_i)/W_連続 − 1 の平均と RMS・
//     引きずりの大きさ RMS|d|/RMS|V|・線形の場の連続の引きずりとの差 RMS|d − d_連続|/RMS|d_連続|。N の依存 = ln(Q₅₁₂/Q₂₅₆)/ln 2(種の平均)。
//     物差し: |傾き| < 0.1 を「この格子では N に依らない」・0.1〜0.5 を「弱く依る」・≥ 0.5 を「強く依る」(+1 は N に比例・−1/3 は要素の大きさに比例)。
//   T1 動的: N 256・512 × 種 1 × 押し row γ 0.1/t_cr × 読み none・A・B(k 近傍・測りの間隔ごとに更新)・C と重力だけ × 窓 3 t_cr・刻み t_cr/100。効き = Q(T) の差(引きずり − 重力だけ・rel は ÷ |Q(0)|)。
//   T2: N 512 × 種 1 × 窓 2 t_cr × γ 0.1・1 ÷ t_cr × 型 row・symFull・symCentral・symCentral + Π(h_sph 0.3・u₀ = 0)と重力だけ。帳簿: 運動量 |ΔP|/(M v_rms)・角運動量 |ΔL|/(M r_h v_rms)・
//     E の残差 (E₁ + U₁ + Q − E₀ − U₀)/|E₀|・熱の口 Q/|E₀|・内部のエネルギー U/|E₀|・近傍の平均のまわりの散らばり σ²_pec と要素の中の σ²_int。物差し: |ΔP|・|ΔL| ≤ 1e-12 を「保存」。
//   T3: N 256 × 種 1 × 窓 2 t_cr × 刻み h = t_cr/100・h/2・h/4 × 作用 重力だけ・押し(row γ 0.1/t_cr)・速度の場(陽 —— 第335便f の 1 步遅れ)・速度の場(陰の中点・反復 3)。
//     e₁ = |Q_h − Q_{h/2}|・e₂ = |Q_{h/2} − Q_{h/4}|・次数 p = log₂(e₁/e₂)。物差し: e₂ ≤ e₁/2(p ≥ 1)を「刻みで決まる向き」・重力だけの e₂ を混沌の床として並べる。
//   T4: 静的 N 512(Plummer と回転の支え v_rot/σ 0.3)× 読み center0(全質量を重心に・自転 0)・centerL(自転 L_z/Σ m R²)・inner(内の質量・平均の速度・自転)・local(全分布の直接の和)×
//     自己の重み B(k 近傍)。動的 N 256(回転の支え)× 押し γ 0.1/t_cr × 窓 3 t_cr。
//   T5: 環 128 粒子(a 0.9〜1.1・σ_e 0.02・σ_i 0.02)× 20 周 × 刻み 公転/300 × 中心 単体・連星(質量比 1・離れ 0.25)× 中心の自転 s = 1 × 列 grav・T・R・A・TRA × γ 1e-3・1e-2 ×
//     自己の重み none(B は γ 1e-2 の T・A だけ)。率 = ln σ の公転あたりの傾き(最小二乗)。物差し: > +1e-3 を「増える」・< −1e-3 を「減る」・その間を「平ら」。
// ■ 言わないこと: 表は宣言した型とノブの組の測った数(銀河が流体で解けた・楕円銀河が出来た・環の安定を担う引きずりが分かったとは書かない)・B は解像度の依存を消す式ではない(測った N の依存)・
//   N は解像の要素の数(実在の星の数ではない)・軟化と h_sph は宣言の長さ・観測の銀河の値に合わせない。
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import * as L from './lib-w337e-fluid.mjs';
import * as E5 from './lib-w335f-elliptical.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w337e-fluid-1';
/** 版の履歴(結果を見て変えた所・足した型とノブ —— 理由つき) */
export const AMEND = Object.freeze([]);
export const OUT_MAIN = 'tests/out/fluid-337e.json';
export const TARGET = 'tests/lib-w337e-fluid.mjs';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
export const NOT_CLAIM = Object.freeze(['表は宣言した型とノブの組の測った数 —— 銀河が流体で解けたとは書かない', 'B(体積の内の積分)は解像度の依存を消す式ではない —— 測った N の依存を書く',
  'N は解像の要素の数(実在の星の数ではない)', '軟化 ε と h_sph は宣言の長さ(物理の大きさではない)', '星 1 個の R_d = Y_k m(C)は実在の星の規則として変えない —— 流体の要素には別の口',
  '環の表は率の符号と桁 —— 長期の安定を担う引きずりが分かったとは書かない', '観測の銀河の値に合わせない', '主列は W₀ = 0']);
export const PLAN = Object.freeze({
  model: 'plummer', eps: 0.05, alphas: Object.freeze([2, 1]), stepsPerTcr: 100, every: 25,
  t1: Object.freeze({ Ns: Object.freeze([256, 512]), heavyNs: Object.freeze([1024, 2048]), seeds: Object.freeze([1, 2, 3]), rules: Object.freeze(['none', 'A', 'B', 'Bk', 'C']), fields: Object.freeze(['rigid', 'shear', 'diff', 'iso']),
    dynRules: Object.freeze(['none', 'A', 'B', 'C']), dynGammaTcr: 0.1, dynWindowTcr: 3, slopeFlat: 0.1, slopeStrong: 0.5, arrange: Object.freeze({ nSides: Object.freeze([6, 8, 12]) }) }),
  t2: Object.freeze({ N: 512, windowTcr: 2, gammaTcr: Object.freeze([0.1, 1]), types: Object.freeze(['row', 'symFull', 'symCentral', 'symCentralPi']), consTol: 1e-12, u0: 0 }),
  t3: Object.freeze({ N: 256, windowTcr: 2, hdivs: Object.freeze([1, 2, 4]), heavyHdiv: 8, actions: Object.freeze(['grav', 'push', 'velE', 'velI']), gammaTcr: 0.1, keys: Object.freeze(['r10', 'r50', 'r90', 'vir', 'sigR', 'resid']) }),
  t4: Object.freeze({ N: 512, dynN: 256, readings: Object.freeze(['center0', 'centerL', 'inner', 'local']), gammaTcr: 0.1, windowTcr: 3 }),
  t5: Object.freeze({ centers: Object.freeze(['single', 'binary']), cols: Object.freeze(['grav', 'T', 'R', 'A', 'TRA']), gammas: Object.freeze([1e-3, 1e-2]), selfB: Object.freeze({ gamma: 1e-2, cols: Object.freeze(['T', 'A']) }),
    orbits: 20, stepsPerOrbit: 300, seed: 1, rateFlat: 1e-3, heavy: Object.freeze({ n: 256, orbits: 60 }) }),
  seedRule: '標本の種 = 種 × 10007 + N(第335便f の seedOf と同じ —— Plummer)・回転の支えの反しの乱数は種 + 500',
  structKeys: Object.freeze(['r10', 'r50', 'r90', 'vir', 'sigR', 'sigT', 'beta', 'vrot']),
});
const seedOf = (N, seed) => seed * 10007 + N;
const sampleOf = (N, seed, rotate = false) => { let S = E5.sampleModel({ model: 'plummer', N, seed: seedOf(N, seed) }).S; if (rotate) S = E5.rotateOf(S, E5.DECL.rotFlip, seed + 500); return S; };
const SC = E5.scalesOf('plummer');
const last = (a) => a[a.length - 1];
const relOf = (k) => E5.QKIND[k] === 'rel' || k === 'vir';
const effOf = (D, G, k) => { const a = last(D.series).q[k], b = last(G.series).q[k], q0 = G.series[0].q[k]; return relOf(k) ? (a - b) / Math.abs(q0) : a - b; };
const slope2 = (a, b) => (fin(a) && fin(b) && a !== 0 && b !== 0 ? Math.log(Math.abs(b) / Math.abs(a)) / Math.LN2 : null);
const dependOf = (s) => (s === null ? '—' : Math.abs(s) < PLAN.t1.slopeFlat ? 'flat' : Math.abs(s) < PLAN.t1.slopeStrong ? 'weak' : 'strong');
const ledgerOf = (R) => { const Lg = R.ledger, q = last(R.series).q; return { dP: Math.hypot(Lg.P1[0] - Lg.P0[0], Lg.P1[1] - Lg.P0[1], Lg.P1[2] - Lg.P0[2]) / SC.vrms, dL: Math.hypot(Lg.L1[0] - Lg.L0[0], Lg.L1[1] - Lg.L0[1], Lg.L1[2] - Lg.L0[2]) / (SC.rh * SC.vrms),
  resid: Lg.resid, dCM: q.dCM, Q: Lg.Qrad / Math.abs(Lg.E0), U: Lg.U1 / Math.abs(Lg.E0), sig2pec0: R.series[0].q.sig2pec, sig2pec1: q.sig2pec, sig2int1: q.sig2int, Wdrag: Lg.Wdrag / Math.abs(Lg.E0) }; };
const steps = (w, hdiv = 1) => PLAN.stepsPerTcr * w * hdiv;

/* ───────── T1 静的 ───────── */
export function t1Static({ Ns = PLAN.t1.Ns, table = null } = {}) {
  const tab = table || L.continuumTable(PLAN.eps, L.rCutOf()), rows = [];
  for (const N of Ns) for (const alpha of PLAN.alphas) for (const rule of PLAN.t1.rules) for (const field of PLAN.t1.fields) {
    const per = PLAN.t1.seeds.map((sd) => { const S = sampleOf(N, sd), rho = rule === 'Bk' ? L.knnDensity(S) : 'analytic'; return L.resolutionRow({ S, field, rule: rule === 'Bk' ? 'B' : rule, eps: PLAN.eps, alpha, table: alpha === 2 ? tab : null, rho }); });
    const mean = (k) => (per.every((x) => fin(x[k])) ? per.reduce((s, x) => s + x[k], 0) / per.length : null);
    rows.push({ N, alpha, rule, field, shareMean: mean('shareMean'), wTotBias: mean('wTotBias'), wTotRms: mean('wTotRms'), dOverV: mean('dOverV'), contErr: mean('contErr') });
  }
  return rows;
}
export function t1Slopes(rows, Na = 256, Nb = 512) {
  const out = [];
  for (const alpha of PLAN.alphas) for (const rule of PLAN.t1.rules) for (const field of PLAN.t1.fields) {
    const a = rows.find((r) => r.N === Na && r.alpha === alpha && r.rule === rule && r.field === field), b = rows.find((r) => r.N === Nb && r.alpha === alpha && r.rule === rule && r.field === field);
    if (!a || !b) continue;
    const s = { alpha, rule, field, share: slope2(a.shareMean, b.shareMean), dOverV: slope2(a.dOverV, b.dOverV), contErr: slope2(a.contErr, b.contErr), wTotBias: slope2(a.wTotBias, b.wTotBias) };
    s.dependD = dependOf(s.dOverV); s.dependShare = dependOf(s.share);
    out.push(s);
  }
  return out;
}

/* ───────── 1 本の動的な走行(spec は integrateFluid の spec + 初期の型) ───────── */
export function runDyn(r) {
  const t0 = Date.now(), S = sampleOf(r.N, r.seed, !!r.rotate);
  const sp = { action: r.action, drag: r.drag, self: r.self || 'none', rhoMode: 'knn', eps: PLAN.eps, gamma: (r.gammaTcr || 0) / SC.tcr, h: SC.tcr / PLAN.stepsPerTcr / (r.hdiv || 1), steps: steps(r.windowTcr, r.hdiv || 1), every: PLAN.every * (r.hdiv || 1),
    implicit: !!r.implicit, pi: !!r.pi, spinMode: r.spinMode || '0', u0: PLAN.t2.u0 };
  const R = L.integrateFluid(S, sp, SC);
  const fin0 = R.state;
  return { key: r.key, spec: r, series: R.series.map((s) => ({ t: s.t / SC.tcr, q: Object.fromEntries(Object.entries(s.q).filter(([k]) => k !== 'L' && k !== 'cm' && k !== 'P')) })), ledger: ledgerOf(R), shareMean: R.shareMean, evals: R.evals, iterResid: R.iterResid,
    posFinal: r.keepPos ? Array.from({ length: fin0.N }, (_, i) => [fin0.x[i], fin0.y[i], fin0.z[i]]) : null, wallSec: (Date.now() - t0) / 1000 };
}
const K = (o) => [o.part, 'N' + o.N, 's' + o.seed, o.action, o.drag || '-', o.self || '-', 'g' + (o.gammaTcr || 0), o.pi ? 'pi' : '-', o.implicit ? 'imp' : '-', 'h' + (o.hdiv || 1), o.rotate ? 'rot' : 'sph', o.spinMode || '-', 'w' + o.windowTcr].join('|');
export function dynList({ heavy = false } = {}) {
  const out = [], P = PLAN;
  const add = (o) => out.push(Object.assign(o, { key: K(o) }));
  const t1N = heavy ? P.t1.heavyNs : P.t1.Ns;
  for (const N of t1N) { add({ part: 't1', N, seed: 1, action: 'grav', windowTcr: P.t1.dynWindowTcr }); for (const self of P.t1.dynRules) add({ part: 't1', N, seed: 1, action: 'push', drag: 'row', self, gammaTcr: P.t1.dynGammaTcr, windowTcr: P.t1.dynWindowTcr }); }
  if (heavy) {
    add({ part: 't3', N: P.t3.N, seed: 1, action: 'grav', windowTcr: P.t3.windowTcr, hdiv: P.t3.heavyHdiv, keepPos: true });
    add({ part: 't3', N: P.t3.N, seed: 1, action: 'push', drag: 'row', gammaTcr: P.t3.gammaTcr, windowTcr: P.t3.windowTcr, hdiv: P.t3.heavyHdiv, keepPos: true });
    add({ part: 't3', N: P.t3.N, seed: 1, action: 'vel', drag: 'row', windowTcr: P.t3.windowTcr, hdiv: P.t3.heavyHdiv, keepPos: true });
    add({ part: 't3', N: P.t3.N, seed: 1, action: 'vel', drag: 'row', implicit: true, windowTcr: P.t3.windowTcr, hdiv: P.t3.heavyHdiv, keepPos: true });
    return out;
  }
  add({ part: 't2', N: P.t2.N, seed: 1, action: 'grav', windowTcr: P.t2.windowTcr });
  for (const g of P.t2.gammaTcr) for (const ty of P.t2.types) add({ part: 't2', N: P.t2.N, seed: 1, action: 'push', drag: ty === 'symCentralPi' ? 'symCentral' : ty, pi: ty === 'symCentralPi', gammaTcr: g, windowTcr: P.t2.windowTcr });
  for (const hdiv of P.t3.hdivs) {
    add({ part: 't3', N: P.t3.N, seed: 1, action: 'grav', windowTcr: P.t3.windowTcr, hdiv, keepPos: true });
    add({ part: 't3', N: P.t3.N, seed: 1, action: 'push', drag: 'row', gammaTcr: P.t3.gammaTcr, windowTcr: P.t3.windowTcr, hdiv, keepPos: true });
    add({ part: 't3', N: P.t3.N, seed: 1, action: 'vel', drag: 'row', windowTcr: P.t3.windowTcr, hdiv, keepPos: true });
    add({ part: 't3', N: P.t3.N, seed: 1, action: 'vel', drag: 'row', implicit: true, windowTcr: P.t3.windowTcr, hdiv, keepPos: true });
  }
  add({ part: 't4', N: P.t4.dynN, seed: 1, action: 'grav', rotate: true, windowTcr: P.t4.windowTcr });
  for (const rd of P.t4.readings) add({ part: 't4', N: P.t4.dynN, seed: 1, action: 'push', rotate: true, self: 'B', drag: rd === 'local' ? 'row' : rd === 'inner' ? 'inner' : 'center', spinMode: rd === 'centerL' ? 'L' : '0', gammaTcr: P.t4.gammaTcr, windowTcr: P.t4.windowTcr });
  return out;
}

/* ───────── T4 静的 ───────── */
export function t4Static() {
  const rows = [];
  for (const rotate of [false, true]) {
    const S = sampleOf(PLAN.t4.N, 1, rotate), sw = L.selfWeightsOf(S, 'B', { eps: PLAN.eps, rho: L.knnDensity(S) }), N = S.N;
    let s1 = 0, M = 0; for (let i = 0; i < N; i++) { s1 += S.m[i] * (S.vx[i] ** 2 + S.vy[i] ** 2 + S.vz[i] ** 2); M += S.m[i]; }
    const sig = Math.sqrt(s1 / (3 * M)), D = {};
    for (const rd of PLAN.t4.readings) { const F = L.evalForces(S, { drag: rd === 'local' ? 'row' : rd === 'inner' ? 'inner' : 'center', eps: PLAN.eps, selfW: sw, spinMode: rd === 'centerL' ? 'L' : '0' }); D[rd] = { dx: Float64Array.from(F.dx), dy: Float64Array.from(F.dy), dz: Float64Array.from(F.dz), W: Float64Array.from(F.W) }; }
    for (const rd of PLAN.t4.readings) {
      const d = D[rd], l = D.local; let d2 = 0, dphi = 0, dr = 0, dot = 0, l2 = 0, share = 0, n = 0;
      for (let i = 0; i < N; i++) {
        const R = Math.hypot(S.x[i], S.y[i]), r = Math.hypot(S.x[i], S.y[i], S.z[i]);
        d2 += d.dx[i] ** 2 + d.dy[i] ** 2 + d.dz[i] ** 2; l2 += l.dx[i] ** 2 + l.dy[i] ** 2 + l.dz[i] ** 2; dot += d.dx[i] * l.dx[i] + d.dy[i] * l.dy[i] + d.dz[i] * l.dz[i];
        if (R > 0) dphi += (S.x[i] * d.dy[i] - S.y[i] * d.dx[i]) / R; if (r > 0) dr += (S.x[i] * d.dx[i] + S.y[i] * d.dy[i] + S.z[i] * d.dz[i]) / r;
        share += d.W[i] > 0 ? sw[i] / (sw[i] + d.W[i]) : 1; n++;
      }
      rows.push({ model: rotate ? 'rotate' : 'plummer', reading: rd, dRms: Math.sqrt(d2 / n) / sig, dPhi: dphi / n / sig, dR: dr / n / sig, corrLocal: d2 > 0 && l2 > 0 ? dot / Math.sqrt(d2 * l2) : null, shareMean: share / n });
    }
  }
  return rows;
}

/* ───────── T5 環 ───────── */
export function t5List({ heavy = false } = {}) {
  const P = PLAN.t5, out = [];
  for (const center of P.centers) {
    out.push({ center, col: 'grav', self: 'none', gamma: 0 });
    for (const g of P.gammas) for (const col of P.cols) if (col !== 'grav') out.push({ center, col, self: 'none', gamma: g });
    for (const col of P.selfB.cols) out.push({ center, col, self: 'B', gamma: P.selfB.gamma });
  }
  return out.map((r) => Object.assign(r, { n: heavy ? P.heavy.n : L.DECL.ring.n, orbits: heavy ? P.heavy.orbits : P.orbits, stepsPerOrbit: P.stepsPerOrbit, seed: P.seed, key: [r.center, r.col, r.self, 'g' + r.gamma].join('|') }));
}
const trendOf = (x) => (x > PLAN.t5.rateFlat ? 'grow' : x < -PLAN.t5.rateFlat ? 'decay' : 'flat');
export function t5Run(r) {
  const t0 = Date.now(), R = L.ringRun({ center: r.center, col: r.col, self: r.self, gamma: r.gamma, n: r.n, orbits: r.orbits, stepsPerOrbit: r.stepsPerOrbit, seed: r.seed });
  return { key: r.key, spec: r, rateE: R.rateE, rateI: R.rateI, trendE: trendOf(R.rateE), trendI: trendOf(R.rateI), ratioE: R.ratioE, ratioI: R.ratioI, dA: R.dA, dHz: R.dHz, betaMin: R.betaMin, betaMax: R.betaMax,
    sigE: R.perOrbit.map((o) => o.sigE), sigI: R.perOrbit.map((o) => o.sigI), wallSec: (Date.now() - t0) / 1000 };
}

/* ───────── 解析 ───────── */
export function analyse(runs, t1rows) {
  const P = PLAN, A = {};
  // T1 動的: 効き(引きずり − 重力だけ)と N の依存
  A.t1dyn = [];
  for (const N of P.t1.Ns) { const G = runs.find((x) => x.spec.part === 't1' && x.spec.N === N && x.spec.action === 'grav');
    for (const self of P.t1.dynRules) { const D = runs.find((x) => x.spec.part === 't1' && x.spec.N === N && x.spec.self === self && x.spec.action === 'push'), eff = {}; for (const k of P.structKeys) eff[k] = effOf(D, G, k);
      A.t1dyn.push({ N, self, shareMean: D.shareMean, eff, Q: D.ledger.Q, resid: D.ledger.resid }); } }
  A.t1dynSlope = P.t1.dynRules.map((self) => { const a = A.t1dyn.find((x) => x.N === P.t1.Ns[0] && x.self === self), b = A.t1dyn.find((x) => x.N === P.t1.Ns[1] && x.self === self), s = {};
    for (const k of P.structKeys) s[k] = slope2(a.eff[k], b.eff[k]); return { self, share: slope2(a.shareMean, b.shareMean), Q: slope2(a.Q, b.Q), eff: s, dependR50: dependOf(s.r50), dependVir: dependOf(s.vir) }; });
  A.t1slopes = t1Slopes(t1rows);
  // T2
  const G2 = runs.find((x) => x.spec.part === 't2' && x.spec.action === 'grav');
  A.t2 = [{ type: 'grav', gammaTcr: 0, ledger: G2.ledger, eff: Object.fromEntries(P.structKeys.map((k) => [k, 0])) }];
  for (const g of P.t2.gammaTcr) for (const ty of P.t2.types) {
    const D = runs.find((x) => x.spec.part === 't2' && x.spec.gammaTcr === g && x.spec.drag === (ty === 'symCentralPi' ? 'symCentral' : ty) && !!x.spec.pi === (ty === 'symCentralPi')), eff = {};
    for (const k of P.structKeys) eff[k] = effOf(D, G2, k);
    A.t2.push({ type: ty, gammaTcr: g, ledger: D.ledger, eff, consP: D.ledger.dP <= P.t2.consTol, consL: D.ledger.dL <= P.t2.consTol });
  }
  // T3
  A.t3 = [];
  for (const act of P.t3.actions) {
    const sel = (hd) => runs.find((x) => x.spec.part === 't3' && x.spec.hdiv === hd && (act === 'grav' ? x.spec.action === 'grav' : act === 'push' ? x.spec.action === 'push' : x.spec.action === 'vel' && !!x.spec.implicit === (act === 'velI')));
    const R = P.t3.hdivs.map(sel), vals = {}, row = { action: act, keys: {} };
    for (const k of P.t3.keys) {
      vals[k] = R.map((x) => (k === 'resid' ? x.ledger.resid : last(x.series).q[k]));
      const e1 = Math.abs(vals[k][0] - vals[k][1]), e2 = Math.abs(vals[k][1] - vals[k][2]);
      row.keys[k] = { vals: vals[k], e1, e2, order: e1 > 0 && e2 > 0 ? Math.log2(e1 / e2) : null, byStep: e2 <= e1 / 2 };
    }
    const pd = (a, b) => { let s = 0; for (let i = 0; i < a.posFinal.length; i++) s += (a.posFinal[i][0] - b.posFinal[i][0]) ** 2 + (a.posFinal[i][1] - b.posFinal[i][1]) ** 2 + (a.posFinal[i][2] - b.posFinal[i][2]) ** 2; return Math.sqrt(s / a.posFinal.length) / SC.rh; };
    row.pos = { e1: pd(R[0], R[1]), e2: pd(R[1], R[2]) };
    row.nByStep = P.t3.keys.filter((k) => row.keys[k].byStep).length;
    row.evals = R.map((x) => x.evals); row.iterResid = R.map((x) => x.iterResid);
    A.t3.push(row);
  }
  // T4 動的
  const G4 = runs.find((x) => x.spec.part === 't4' && x.spec.action === 'grav');
  A.t4dyn = P.t4.readings.map((rd) => { const D = runs.find((x) => x.spec.part === 't4' && x.spec.action === 'push' && x.spec.drag === (rd === 'local' ? 'row' : rd === 'inner' ? 'inner' : 'center') && (x.spec.spinMode || '0') === (rd === 'centerL' ? 'L' : '0'));
    const eff = {}; for (const k of P.structKeys) eff[k] = effOf(D, G4, k); return { reading: rd, eff, ledger: D.ledger }; });
  return A;
}
export function t5Analyse(rings) {
  const P = PLAN.t5, rows = [];
  for (const center of P.centers) {
    const G = rings.find((x) => x.spec.center === center && x.spec.col === 'grav');
    for (const x of rings.filter((y) => y.spec.center === center)) rows.push({ center, col: x.spec.col, self: x.spec.self, gamma: x.spec.gamma, rateE: x.rateE, rateI: x.rateI, trendE: x.trendE, trendI: x.trendI, ratioE: x.ratioE, ratioI: x.ratioI,
      dRateE: x.rateE - G.rateE, dRateI: x.rateI - G.rateI, dA: x.dA, betaMin: x.betaMin });
  }
  return rows;
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const nDyn = dynList().length, nRing = t5List().length;
  return {
    pure: Object.values(J.pure.gates).every(Boolean),
    t1Arrange: J.t1arrange.length === PLAN.t1.arrange.nSides.length && J.t1arrange.every((r) => fin(r.lattice.biasNone) && fin(r.random.biasNone)),
    t1Complete: J.t1static.length === PLAN.t1.Ns.length * PLAN.alphas.length * PLAN.t1.rules.length * PLAN.t1.fields.length && J.t1static.every((r) => fin(r.shareMean) && fin(r.dOverV)),
    runsComplete: J.runs.length === nDyn && J.runs.every((x) => x.series.every((s) => PLAN.structKeys.every((k) => fin(s.q[k])))),
    t2Ledger: J.analysis.t2.filter((r) => r.type === 'symFull' || r.type === 'symCentral' || r.type === 'symCentralPi').every((r) => r.consP) && J.analysis.t2.filter((r) => r.type === 'symCentral' || r.type === 'symCentralPi').every((r) => r.consL),
    t3Complete: J.analysis.t3.length === PLAN.t3.actions.length && J.analysis.t3.every((r) => PLAN.t3.keys.every((k) => r.keys[k].vals.every(fin))),
    t4Complete: J.t4static.length === 2 * PLAN.t4.readings.length && J.analysis.t4dyn.length === PLAN.t4.readings.length,
    t5Complete: J.rings.length === nRing && J.rings.every((x) => fin(x.rateE) && fin(x.rateI)),
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const t1static = t1Static(), t1arrange = PLAN.t1.arrange.nSides.map((nSide) => L.arrangementCheck({ nSide, eps: PLAN.eps, seed: 1 })); mark('t1static');
  const runs = dynList().map(runDyn); mark('runs');
  const t4static = t4Static(); mark('t4static');
  const rings = t5List().map(t5Run); mark('rings');
  const analysis = analyse(runs, t1static); analysis.t5 = t5Analyse(rings); mark('analysis');
  const cost = { runs: runs.length, evals: runs.reduce((s, x) => s + x.evals, 0), rings: rings.length, wallByPart: {} };
  for (const x of runs) { cost.wallByPart[x.spec.part] = (cost.wallByPart[x.spec.part] || 0) + x.wallSec; }
  cost.wallByPart.t5 = rings.reduce((s, x) => s + x.wallSec, 0);
  const J = { pure, t1static, t1arrange, t4static, runs: runs.map((r) => { const o = Object.assign({}, r); delete o.posFinal; return o; }), rings, analysis, cost, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/* ───────── 走らせる ───────── */
const writeJson = (OUT, out) => { fs.mkdirSync(path.dirname(OUT), { recursive: true }); fs.writeFileSync(OUT, JSON.stringify(out, null, 1).replace(/\[\s*(-?[\d.eE+-]+(?:,\s*-?[\d.eE+-]+|,\s*null)*)\s*\]/g, (m, a) => '[' + a.replace(/\s+/g, '') + ']') + '\n'); };
export async function main() {
  const t0 = Date.now();
  if (process.argv.includes('--heavy')) {   // 重い列 —— 正本の外へ(数は報告に)
    const OUT = process.env.W337E_HEAVY_OUT || path.join(os.tmpdir(), 'fluid-337e-heavy.json');
    console.log('第337便e fluid --heavy(版 ' + HARNESS_VERSION + ')');
    const t1 = t1Static({ Ns: PLAN.t1.heavyNs }); console.log('  t1 static', (Date.now() - t0) / 1000 + ' s');
    const runs = dynList({ heavy: true }).map((r) => { const x = runDyn(r); console.log(' ', x.key, x.wallSec + ' s'); return x; });
    const rings = t5List({ heavy: true }).filter((r) => r.gamma === 0 || r.gamma === 1e-3).map((r) => { const x = t5Run(r); console.log(' ', x.key, x.wallSec + ' s'); return x; });
    writeJson(OUT, { version: HARNESS_VERSION, heavy: true, plan: PLAN, t1static: t1, runs, rings, elapsedS: (Date.now() - t0) / 1000 });
    console.log('→', OUT, (Date.now() - t0) / 1000 + ' s');
    return;
  }
  const OUT = process.env.W337E_OUT ? (path.isAbsolute(process.env.W337E_OUT) ? process.env.W337E_OUT : path.join(ROOT, process.env.W337E_OUT)) : path.join(ROOT, OUT_MAIN);
  console.log('第337便e fluid(版 ' + HARNESS_VERSION + ')');
  const R = runAll();
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w337e-fluid.mjs', target: TARGET,
    ruling: '原仮定者の指示(2026-11-14 —— 第138報)「銀河を流体と見る」「『土星の環』と『太陽系の惑星』がヒント」・統括の検証項目 R341',
    decl: L.DECL, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w337e-fluid.mjs', 'tests/lib-w337e-fluid.mjs', 'tests/lib-w335f-elliptical.mjs', 'tests/lib-w333d-noncirc.mjs', 'tests/lib-w333b-axialfield.mjs', 'tests/lib-w334a-heightlaw.mjs',
    'tests/lib-w334e-gridfloor.mjs', 'tests/lib-w330b-dragweight.mjs', 'tests/lib-w329b-galrot.mjs', 'tests/lib-w272e-provenance.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第337便e', target: TARGET, code: CODE, inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'fluid', engine: 'Node の純関数だけ(html を読まない・エンジンの步を進めない —— 自前の直接の和と蛙跳び)', notClaim: NOT_CLAIM });
  writeJson(OUT, out);
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();
