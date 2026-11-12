// 第335便f(原仮定者の補足(2026-11-12)「銀河の腕は密度波だが、単一の中心天体では安定しないと想定。まずは、楕円銀河の再現を目指す」・
//   原仮定者の回答(2026-11-12 —— AN665)「楕円銀河を先に」・AN638「離散化の依存を先に測る」・AN640 = A「主列は W₀ = 0」・AN654「自己を運ぶ式 —— v を分けた形」・
//   AN650「座標変換の基準は観測自転 —— 星は自転を持たない点として扱う」・統括の検証項目 R333):
//   **楕円銀河の型の模型の器 —— 分散で支える三次元の系(Plummer 球が主・Hernquist 球・扁平・回転の支えは対照)の重力だけの対照を複数の横断の時間で測り、
//   N・軟化・種を変えた誤差の幅を先に測ってから、星どうしの並進引きずりを 1 つずつ足した差(同じ初期条件・同じ乱数)を幅と比べる**
//   (段 elliptical-335f —— 正本 tests/out/elliptical-w335f.json・lib tests/lib-w335f-elliptical.mjs)。**診断だけ** ——
//   エンジン・内蔵の本・受理器・第329〜334便の lib の本文は変えない。在位の本(`galaxyDB`・`shapeToyCluster`・`shapeToyClusterCore`)は読まない・新しい在位の本は作らない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w335f-elliptical.mjs —— 第317便d の satan の型・領域の宣言なし)。入力のファイルは無い(標本は種を宣言した乱数から)。1 プロセス。
// 任意の旗 `--deep`: 重い列(N = 1024・2048)を正本の外のファイル(環境変数 W335F_DEEP_OUT・既定は一時のディレクトリ)に書く —— 正本は作り直さない。
//
// ■ 宣言(走行の前 —— PLAN。結果を見て変えない)
//   模型: 主 = Plummer 球(G = M = a = 1・質量の割合 0.99 で外側を切る)/対照 = Hernquist 球(同じ切り方)・扁平(Plummer の標本の z を 0.7 倍・速度を一様に倍してビリアル比を球と同じに —— 平衡の
//   分布関数ではない)・回転の支え(z のまわりで v_φ < 0 の星の割合 k = 0.3·√(π/2) の符号を反す —— v_rot/σ の目標 0.3)。初期条件は等方の分布関数からの標本(種 1〜3)。
//   N ∈ {256, 512}(主 512)・`--deep` で 1024・2048。軟化 ε ∈ {0.02, 0.05, 0.1}(尺度の半径の比・主 0.05)。積分器は蛙跳び(KDK)・刻み h = t_cr/100・窓 5 t_cr(t_cr = r_h/v_rms —— 切らない模型の解析の値)・
//   測りは 25 步ごと(時刻 0 を含む 21 点)。h/2 の照らし(主の組の種 1 —— 重力だけ・押し γ 0.1/t_cr・速度の場)。
//   測る量: ラグランジュ半径 10・50・90%・中心の集中 r10/r50・密度の傾き(殻 [r10, r50] と [r50, r90] の平均密度の log の比)・軸比 b/a・c/a(r ≤ r90 の慣性テンソル)・
//   速度分散 σ_r・σ_t と異方性 β_aniso = 1 − σ_t²/(2σ_r²)・ビリアル比 2K/|W|・脱落の割合(重心の枠の ½v² + Φ > 0)・E の残差 (E − E₀)/|E₀|・L の残差 |L − L₀|/(M r_h v_rms)・
//   重心の漂い |R_cm − R_cm₀|/r_h・回転 ⟨v_φ⟩/σ。
//   **誤差の幅** B_Q = 重力だけの対照の組(Plummer × N 2 × ε 3 × 種 3 = 18 本)の、窓の終わりの変化 ΔQ = Q(T) − Q(0)(rel の量は ÷ |Q(0)|・abs の量はそのまま)の(最大 − 最小)。
//   **効果** = 同じ初期条件の対(引きずり − 重力だけ)の Q(T) の差(rel は ÷ |Q(0)|)の種の平均(主の組 N 512・ε 0.05)。**効果 ÷ 幅 > 3 を「幅を超える」**。
//   引きずりの列(1 つずつ): 作用の型 vel(dp/dt = v + d)・push(dv/dt = a + γd —— γ = 0.01・0.1・1 ÷ t_cr)× 重み α = 2(主)・1 × 自己の重み なし(主)・R_d = Y_k m(銀河の尺度 1e11 M☉・5 kpc の写しの星 1 個)。
//   主の列(α 2・自己なし)は種 3・対照の列(α 1・R_d)は種 1。対照の模型は重力だけ 種 3・押し γ 0.1 と速度の場(α 2・自己なし)種 1 —— 幅は max(主の幅, その模型の種の幅)。
//   平衡の記録(対照の読み —— 門ではない): 重力だけの 18 本の全部の時刻で |2K/|W| − 1| ≤ 0.1・主の組の種の平均の ΔQ(r10・r50・r90・2K/|W|)が幅の内。
// ■ 言わないこと: 模型は宣言した分布関数の標本と積分器の表(楕円銀河の同定ではない)・軟化は離散化の依存を下げる宣言の長さ・引きずりの差は重力だけの対照との差と幅の比の表
//   (保たれる/崩れるの断定ではない)・回転曲線・腕・棒・暗黒物質は扱わない・観測の銀河の値に合わせない。
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import * as L from './lib-w335f-elliptical.mjs';
import * as GR from './lib-w329b-galrot.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w335f-elliptical-2';
/** 版の履歴(結果を見て変えた所 —— 理由つき) */
export const AMEND = Object.freeze([
  '版 2(初走の後): 重力だけの対照で L と重心は丸めの床(幅 ≈ 2e-16)で保存し、効果 ÷ 幅 が 1e14 の桁になった。自己 R_d の列では丸めの差(≈ 1e-15)が「幅を超える」に数えられた —— '
  + '幅に丸めの床 1e-12 を置き(max(B, 1e-12)・他の量の幅は 1e-3 以上で影響しない)、幅を超える数を構造の量と保存の量(dE・dL・dCM)に分けて数える。N・軟化・窓・刻み・判定の比 3・幅と効果の定義は変えていない',
]);
export const OUT_MAIN = 'tests/out/elliptical-w335f.json';
export const TARGET = 'tests/lib-w335f-elliptical.mjs';   // html を読まない器の来歴の対象(純関数 —— 第317便d の satan の型)
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
export const NOT_CLAIM = Object.freeze(['模型は宣言した分布関数の標本と積分器の表 —— 楕円銀河の同定ではない', '軟化は離散化の依存を下げるための宣言の長さ(物理の大きさではない)',
  '引きずりの差は重力だけの対照との差と誤差の幅の比の表 —— 系が保たれる/崩れるの断定ではない', '主列は W₀ = 0(背景慣性決定力を分母に入れない —— AN640)', '星は自転 0 の点(座標変換の回転の項なし —— AN650 の宣言)',
  '回転曲線・腕・棒・暗黒物質は扱わない', '観測の銀河の値に合わせない', 'κ_D と別の量を混ぜない']);
/** 器の宣言(走行の前に置く —— 結果を見て変えない) */
export const PLAN = Object.freeze({
  mainModel: 'plummer', variants: Object.freeze(['hernquist', 'oblate', 'rotate']), oblateQ: 0.7,
  Ns: Object.freeze([256, 512]), mainN: 512, deepNs: Object.freeze([1024, 2048]),
  epsList: Object.freeze([0.02, 0.05, 0.1]), mainEps: 0.05,
  seeds: Object.freeze([1, 2, 3]), seedRule: 'rngOf(種 × 10007 + N + 3 × 模型の番号)・回転の対照の反しの乱数は rngOf(種 + 500)',
  stepsPerTcr: 100, windowTcr: 5, every: 25,
  actions: Object.freeze(['vel', 'push']), alphas: Object.freeze([2, 1]), mainAlpha: 2, selfRules: Object.freeze(['none', 'Rd']),
  gammaTcr: Object.freeze([0.01, 0.1, 1]), mainGammaTcr: 0.1, W0: 0,
  bandDef: '重力だけの対照の組(Plummer × N 2 × ε 3 × 種 3)の窓の終わりの変化 ΔQ(rel は ÷ |Q(0)|)の(最大 − 最小)',
  effectDef: '同じ初期条件の対(引きずり − 重力だけ)の Q(T) の差(rel は ÷ |Q(0)|)の種の平均(主の組 N 512・ε 0.05)',
  exceedRatio: 3, virTol: 0.1, driftKeys: Object.freeze(['r10', 'r50', 'r90', 'vir']),
  roundFloor: 1e-12, consKeys: Object.freeze(['dE', 'dL', 'dCM']),   // 版 2(AMEND)
  halfStepRuns: Object.freeze(['grav', 'push', 'vel']),
});
const seedOf = (model, N, seed) => seed * 10007 + N + 3 * L.MODELS.indexOf(model);
const keyOf = (r) => [r.variant, 'N' + r.N, 'e' + r.eps, 's' + r.seed, r.action, r.action === 'grav' ? '-' : 'a' + r.alpha, r.action === 'grav' ? '-' : r.self, r.action === 'push' ? 'g' + r.gammaTcr : '-', 'h' + r.hdiv].join('|');

/* ───────── 走らせる組の一覧 ───────── */
export function runList({ deep = false } = {}) {
  const out = [], P = PLAN, base = (o) => Object.assign({ variant: P.mainModel, N: P.mainN, eps: P.mainEps, seed: 1, action: 'grav', alpha: 2, self: 'none', gammaTcr: 0, hdiv: 1, part: '' }, o);
  if (deep) {
    for (const N of P.deepNs) {
      const seeds = N === 1024 ? P.seeds : [1];
      for (const seed of seeds) {
        out.push(base({ part: 'deep', N, seed }), base({ part: 'deep', N, seed, action: 'push', gammaTcr: P.mainGammaTcr }));
        if (N === 1024) out.push(base({ part: 'deep', N, seed, action: 'vel' }));
      }
    }
    return out.map((r) => Object.assign(r, { key: keyOf(r) }));
  }
  for (const N of P.Ns) for (const eps of P.epsList) for (const seed of P.seeds) out.push(base({ part: 'ensemble', N, eps, seed }));
  for (const seed of P.seeds) { out.push(base({ part: 'drag', seed, action: 'vel' })); for (const g of P.gammaTcr) out.push(base({ part: 'drag', seed, action: 'push', gammaTcr: g })); }
  out.push(base({ part: 'drag', action: 'vel', alpha: 1 }), base({ part: 'drag', action: 'push', alpha: 1, gammaTcr: P.mainGammaTcr }));
  out.push(base({ part: 'drag', action: 'vel', self: 'Rd' }), base({ part: 'drag', action: 'push', self: 'Rd', gammaTcr: P.mainGammaTcr }));
  for (const v of P.variants) { for (const seed of P.seeds) out.push(base({ part: 'variant', variant: v, seed })); out.push(base({ part: 'variant', variant: v, action: 'push', gammaTcr: P.mainGammaTcr }), base({ part: 'variant', variant: v, action: 'vel' })); }
  out.push(base({ part: 'half', hdiv: 2 }), base({ part: 'half', hdiv: 2, action: 'push', gammaTcr: P.mainGammaTcr }), base({ part: 'half', hdiv: 2, action: 'vel' }));
  return out.map((r) => Object.assign(r, { key: keyOf(r) }));
}

/** 初期条件(模型の型と N・ε・種から —— 同じ組は同じ列) */
export function initialOf(variant, N, eps, seed) {
  const model = variant === 'hernquist' ? 'hernquist' : 'plummer', smp = L.sampleModel({ model, N, seed: seedOf(model, N, seed) });
  let S = smp.S;
  if (variant === 'oblate') S = L.oblateOf(S, PLAN.oblateQ, eps);
  if (variant === 'rotate') S = L.rotateOf(S, L.DECL.rotFlip, seed + 500);
  return { S, model, envelopeMiss: smp.envelopeMiss };
}
/** 1 本を走らせる(戻り値は量の時系列〔鍵ごとの配列〕と帳簿) */
export function runOne(r) {
  const t0 = Date.now(), I = initialOf(r.variant, r.N, r.eps, r.seed), sc = L.scalesOf(I.model);
  const h = sc.tcr / PLAN.stepsPerTcr / r.hdiv, steps = PLAN.stepsPerTcr * PLAN.windowTcr * r.hdiv, every = PLAN.every * r.hdiv;
  const R = L.integrate(I.S, { action: r.action, alpha: r.alpha, self: r.self, gamma: r.gammaTcr / sc.tcr, eps: r.eps, h, steps, every }, sc);
  const q = {}; for (const k of L.QKEYS) q[k] = R.series.map((s) => s.q[k]);
  return { key: r.key, spec: r, model: I.model, tcr: sc.tcr, h, steps, t: R.series.map((s) => s.t / sc.tcr), q, ledger: R.ledger, maxSuppress: R.maxSuppress, RdModel: R.RdModel,
    envelopeMiss: I.envelopeMiss, pairs: (r.N * (r.N - 1) / 2) * (steps + 1), wallSec: (Date.now() - t0) / 1000 };
}

/* ───────── 幅・効果・平衡の記録 ───────── */
const last = (a) => a[a.length - 1];
const chg = (run, k) => L.changeOf(k, { [k]: run.q[k][0] }, { [k]: last(run.q[k]) });
const pairDiff = (D, G, k) => (L.QKIND[k] === 'rel' ? (last(D.q[k]) - last(G.q[k])) / Math.abs(G.q[k][0]) : last(D.q[k]) - last(G.q[k]));
const find = (runs, o) => runs.find((x) => Object.entries(o).every(([k, v]) => x.spec[k] === v));
export function analyse(runs) {
  const P = PLAN, ens = runs.filter((x) => x.spec.part === 'ensemble');
  const band = {}, bandRaw = {}; for (const k of L.QKEYS) { bandRaw[k] = L.spread(ens.map((x) => chg(x, k))); band[k] = Math.max(bandRaw[k], P.roundFloor); }   // 版 2: 丸めの床
  // 幅の分解(N だけ・ε だけ・種だけ —— 主の組を固定して)と、変化の値そのものの列(18 本)
  const sub = (o) => ens.filter((x) => Object.entries(o).every(([k, v]) => x.spec[k] === v));
  const decomp = {}; for (const k of L.QKEYS) decomp[k] = { N: L.spread(sub({ eps: P.mainEps, seed: 1 }).map((x) => chg(x, k))), eps: L.spread(sub({ N: P.mainN, seed: 1 }).map((x) => chg(x, k))), seed: L.spread(sub({ N: P.mainN, eps: P.mainEps }).map((x) => chg(x, k))),
    q0Spread: L.spread(ens.map((x) => x.q[k][0])), mainMean: P.seeds.reduce((s, sd) => s + chg(find(ens, { N: P.mainN, eps: P.mainEps, seed: sd }), k), 0) / P.seeds.length };
  // 平衡の記録
  const virAll = Math.max(...ens.flatMap((x) => x.q.vir.map((v) => Math.abs(v - 1))));
  const drift = {}; for (const k of P.driftKeys) drift[k] = { mean: decomp[k].mainMean, band: band[k], within: Math.abs(decomp[k].mainMean) <= band[k] };
  const equilibrium = { virMaxDev: virAll, virWithin: virAll <= P.virTol, drift, allWithin: virAll <= P.virTol && Object.values(drift).every((d) => d.within) };
  // 効果(主の組)
  const cells = [];
  const cellOf = (o, label) => {
    const D = runs.filter((x) => x.spec.part === 'drag' && Object.entries(o).every(([k, v]) => x.spec[k] === v));
    const pairs = D.map((d) => [d, find(ens, { N: d.spec.N, eps: d.spec.eps, seed: d.spec.seed })]);
    const eff = {}, ratio = {}; let nEx = 0, nExS = 0;
    for (const k of L.QKEYS) { eff[k] = pairs.reduce((s, [d, g]) => s + pairDiff(d, g, k), 0) / pairs.length; ratio[k] = Math.abs(eff[k]) / band[k]; if (ratio[k] > P.exceedRatio) { nEx++; if (!P.consKeys.includes(k)) nExS++; } }
    const ledger = pairs.map(([d, g]) => ({ seed: d.spec.seed, Wdrag: d.ledger.Wdrag / Math.abs(d.ledger.E0), dE: (d.ledger.E1 - d.ledger.E0) / Math.abs(d.ledger.E0), resid: d.ledger.resid, gravResid: g.ledger.resid }));
    const bitSameAsGrav = pairs.every(([d, g]) => L.QKEYS.every((k) => d.q[k].every((v, i) => v === g.q[k][i])));
    cells.push({ label, spec: o, nSeeds: pairs.length, eff, ratio, exceed: nEx, exceedStruct: nExS, exceedCons: nEx - nExS, maxRatio: Math.max(...Object.values(ratio).filter(fin)), ledger, bitSameAsGrav, maxSuppress: D[0].maxSuppress, RdModel: D[0].RdModel });
  };
  cellOf({ action: 'vel', alpha: 2, self: 'none' }, 'vel・α 2・自己なし');
  for (const g of P.gammaTcr) cellOf({ action: 'push', alpha: 2, self: 'none', gammaTcr: g }, 'push γ ' + g + '/t_cr・α 2・自己なし');
  cellOf({ action: 'vel', alpha: 1, self: 'none' }, 'vel・α 1・自己なし');
  cellOf({ action: 'push', alpha: 1, self: 'none', gammaTcr: P.mainGammaTcr }, 'push γ 0.1/t_cr・α 1・自己なし');
  cellOf({ action: 'vel', alpha: 2, self: 'Rd' }, 'vel・α 2・自己 R_d');
  cellOf({ action: 'push', alpha: 2, self: 'Rd', gammaTcr: P.mainGammaTcr }, 'push γ 0.1/t_cr・α 2・自己 R_d');
  // 対照の模型
  const variants = P.variants.map((v) => {
    const G = runs.filter((x) => x.spec.part === 'variant' && x.spec.variant === v && x.spec.action === 'grav'), seedBand = {}, base = {};
    for (const k of L.QKEYS) { seedBand[k] = L.spread(G.map((x) => chg(x, k))); base[k] = { q0: G[0].q[k][0], qT: last(G[0].q[k]), mean: G.reduce((s, x) => s + chg(x, k), 0) / G.length }; }
    const g1 = G.find((x) => x.spec.seed === 1), cols = ['push', 'vel'].map((a) => {
      const D = runs.find((x) => x.spec.part === 'variant' && x.spec.variant === v && x.spec.action === a), eff = {}, ratio = {}; let nEx = 0, nExS = 0;
      for (const k of L.QKEYS) { eff[k] = pairDiff(D, g1, k); ratio[k] = Math.abs(eff[k]) / Math.max(band[k], seedBand[k]); if (ratio[k] > P.exceedRatio) { nEx++; if (!P.consKeys.includes(k)) nExS++; } }
      return { action: a, eff, ratio, exceed: nEx, exceedStruct: nExS, exceedCons: nEx - nExS, ledgerResid: D.ledger.resid, Wdrag: D.ledger.Wdrag / Math.abs(D.ledger.E0) };
    });
    return { variant: v, seedBand, base, cols, virMaxDev: Math.max(...G.flatMap((x) => x.q.vir.map((q) => Math.abs(q - 1)))) };
  });
  // h と h/2
  const half = P.halfStepRuns.map((a) => {
    const H2 = runs.find((x) => x.spec.part === 'half' && x.spec.action === a), H1 = a === 'grav' ? find(ens, { N: P.mainN, eps: P.mainEps, seed: 1 }) : runs.find((x) => x.spec.part === 'drag' && x.spec.action === a && x.spec.alpha === 2 && x.spec.self === 'none' && x.spec.seed === 1 && (a !== 'push' || x.spec.gammaTcr === P.mainGammaTcr));
    const G2 = runs.find((x) => x.spec.part === 'half' && x.spec.action === 'grav'), G1 = find(ens, { N: P.mainN, eps: P.mainEps, seed: 1 }), d = {};
    for (const k of L.QKEYS) d[k] = a === 'grav' ? Math.abs(chg(H1, k) - chg(H2, k)) / band[k] : Math.abs(pairDiff(H1, G1, k) - pairDiff(H2, G2, k)) / band[k];
    return { action: a, overBand: d, maxOverBand: Math.max(...Object.values(d)), resid: [H1.ledger.resid, H2.ledger.resid] };
  });
  // 主の組の種 1 の時系列(重力だけと主の引きずりの列)
  return { band, bandRaw, decomp, equilibrium, cells, variants, half };
}
/** 緩和の時間(N/(8 ln Λ) t_cr —— Λ = N と Λ = r_h/ε の 2 つ)と窓の比 */
export function relaxTable() {
  const sc = L.scalesOf(PLAN.mainModel), rows = [];
  for (const N of PLAN.Ns.concat(PLAN.deepNs)) {
    const tN = N / (8 * Math.log(N)), eps = PLAN.epsList.map((e) => { const t = N / (8 * Math.log(sc.rh / e)); return { eps: e, tRelaxTcr: t, windowOver: PLAN.windowTcr / t }; });
    rows.push({ N, tRelaxTcrN: tN, windowOverN: PLAN.windowTcr / tN, eps });
  }
  return rows;
}
/** 銀河の尺度への写し(表だけ): 時間・速さの単位・t_cr・窓・刻み・星 1 個の R_d */
export function unitsTable() {
  const g = L.DECL.galaxy, M = g.Msun * GR.MSUN_KG, a = g.aKpc * GR.KPC_M, tu = Math.sqrt(a ** 3 / (GR.G_SI * M)), vu = Math.sqrt(GR.G_SI * M / a), MYR = 3.15576e13;
  const models = L.MODELS.map((m) => { const s = L.scalesOf(m); return { model: m, rh: s.rh, vrms: s.vrms, tcr: s.tcr, tcrMyr: s.tcr * tu / MYR, windowMyr: PLAN.windowTcr * s.tcr * tu / MYR, hMyr: s.tcr / PLAN.stepsPerTcr * tu / MYR, vrmsSI: s.vrms * vu }; });
  const rd = PLAN.Ns.concat(PLAN.deepNs).map((N) => { const S = { N: 1, m: new Float64Array([1 / N]) }, w = L.selfWeights(S, 2); return { N, RdModel: w.RdModel, RdM: w.RdModel * a }; });
  return { Msun: g.Msun, aKpc: g.aKpc, timeUnitMyr: tu / MYR, velUnitSI: vu, models, rd };
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const nRuns = runList().length;
  return {
    pure: Object.values(J.pure.gates).every(Boolean),
    runsComplete: J.runs.length === nRuns && J.runs.every((x) => L.QKEYS.every((k) => x.q[k].length === PLAN.stepsPerTcr * PLAN.windowTcr / PLAN.every + 1 && x.q[k].every(fin))),
    envelope: J.runs.every((x) => x.envelopeMiss === 0),
    bandsFinite: L.QKEYS.every((k) => fin(J.analysis.band[k]) && J.analysis.band[k] > 0),
    cellsComplete: J.analysis.cells.length === 8 && J.analysis.cells.every((c) => L.QKEYS.every((k) => fin(c.ratio[k]))),
    gravLedger: J.runs.filter((x) => x.spec.action === 'grav').every((x) => Math.abs(x.ledger.Wdrag) === 0),
    variantsComplete: J.analysis.variants.length === PLAN.variants.length && J.analysis.variants.every((v) => v.cols.length === 2),
    halfComplete: J.analysis.half.length === 3 && J.analysis.half.every((h) => fin(h.maxOverBand)),
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const runs = runList().map(runOne); mark('runs');
  const analysis = analyse(runs); mark('analysis');
  const cost = { pairsTotal: runs.reduce((s, x) => s + x.pairs, 0), runs: runs.length, perPart: {} };
  for (const x of runs) { const p = cost.perPart[x.spec.part] || (cost.perPart[x.spec.part] = { runs: 0, pairs: 0 }); p.runs++; p.pairs += x.pairs; }
  const J = { pure, runs, analysis, relax: relaxTable(), units: unitsTable(), cost, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/* ───────── 走らせる ───────── */
const writeJson = (OUT, out) => { fs.mkdirSync(path.dirname(OUT), { recursive: true }); fs.writeFileSync(OUT, JSON.stringify(out, null, 1).replace(/\[\s*(-?[\d.eE+-]+(?:,\s*-?[\d.eE+-]+|,\s*null)*)\s*\]/g, (m, a) => '[' + a.replace(/\s+/g, '') + ']') + '\n'); };
export async function main() {
  const t0 = Date.now();
  if (process.argv.includes('--deep')) {   // 重い列 —— 正本の外へ(数は報告に)
    const OUT = process.env.W335F_DEEP_OUT || path.join(os.tmpdir(), 'elliptical-w335f-deep.json');
    console.log('第335便f elliptical --deep(版 ' + HARNESS_VERSION + ')');
    const runs = runList({ deep: true }).map((r) => { const x = runOne(r); console.log(' ', x.key, x.wallSec + ' s'); return x; });
    writeJson(OUT, { version: HARNESS_VERSION, deep: true, plan: PLAN, runs, elapsedS: (Date.now() - t0) / 1000 });
    console.log('→', OUT, (Date.now() - t0) / 1000 + ' s');
    return;
  }
  const OUT = process.env.W335F_OUT ? (path.isAbsolute(process.env.W335F_OUT) ? process.env.W335F_OUT : path.join(ROOT, process.env.W335F_OUT)) : path.join(ROOT, OUT_MAIN);
  console.log('第335便f elliptical(版 ' + HARNESS_VERSION + ')');
  const R = runAll();
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w335f-elliptical.mjs', target: TARGET,
    ruling: '原仮定者の補足(2026-11-12)「まずは、楕円銀河の再現を目指す」・原仮定者の回答(2026-11-12 —— AN665)楕円銀河を先に・AN638 離散化の依存を先に・AN640 = A 主列は W₀ = 0・AN654 自己を運ぶ式(v を分けた形)・AN650 星は自転 0 の点・統括の検証項目 R333',
    decl: L.DECL, plan: PLAN, amend: AMEND, qkeys: L.QKEYS, qkind: L.QKIND, notClaim: NOT_CLAIM, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w335f-elliptical.mjs', 'tests/lib-w335f-elliptical.mjs', 'tests/lib-w333d-noncirc.mjs', 'tests/lib-w334e-gridfloor.mjs', 'tests/lib-w332a-eqband.mjs', 'tests/lib-w332b-transgeo2.mjs',
    'tests/lib-w331a-coordtwist.mjs', 'tests/lib-w331b-centrifugal.mjs', 'tests/lib-w331c-k1scale.mjs', 'tests/lib-w330b-dragweight.mjs', 'tests/lib-w326d-axialheat.mjs', 'tests/lib-w309a-invsq.mjs', 'tests/lib-w312a-decay.mjs',
    'tests/lib-w310d-shell.mjs', 'tests/lib-w307a-sphereaxial.mjs', 'tests/lib-w329b-galrot.mjs', 'tests/lib-w272e-provenance.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第335便f', target: TARGET, code: CODE, inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'elliptical', engine: 'Node の純関数だけ(html を読まない・エンジンの步を進めない —— 自前の直接の和と蛙跳び)', notClaim: NOT_CLAIM });
  writeJson(OUT, out);
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();
