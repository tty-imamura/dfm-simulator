// 第333便d(原仮定者の整理(2026-11-10)「銀河は全体が回っているが、個々の星の軌道は同心円ではなく、楕円軌道の密度波で腕が形成される。その為、同心円に近い前提の計算では
//   合わせにくいのではないか」「重みは m/r² が有力だが他の次数でも検証」・原仮定者の回答(2026-11-10 —— AN608・AN618・AN621・AN622)・統括の検証項目 R320):
//   **銀河の非円軌道と密度波の低 N の対照の器 —— NGC 3198 の恒星の円盤で、同じ方位平均の質量分布(案内中心の環の質量が同じ)の 円軌道/位相を乱した非円軌道/
//   パターンの枠で位相を揃えた非円軌道 に統合した並進の場 U(α = 2 を主・α = 1 を比べる列)を置き、方位平均・m = 2・渦度・J の流れ・∂U/∂t を並べる**
//   (段 noncirc-333d —— 正本 tests/out/noncirc-w333d.json・lib tests/lib-w333d-noncirc.mjs)。**診断だけ・運動学の対照だけ(相互作用の時間発展はしない)** ——
//   エンジン・内蔵の本・受理器・第329〜332便の lib の本文は変えない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w333d-noncirc.mjs —— 第317便d の satan の型・領域の宣言なし)。入力は NGC 3198 の rotmod の写し(第329便b の fixture)だけ。1 プロセス。
//
// ■ 何をするか(宣言は走行の前 —— PLAN)
//   P 純関数の場面(lib —— 軌道の式と微分・角運動量の一次の保存・閉じないロゼット・円の族・位相を揃える・種・パターンの枠・∂U/∂t と中心差分・1 つの源・剛体の回転・Fourier・拒否)
//   F 族と格子: circ/random(ε × 種)/kin(ε)/pattern(ε × Ω_p)× 組(核 trans〔α = 2〕・transR〔α = 1〕× 星の引きずり自転 none・sync × 分母 場の読み・自己 R_d = Y_k m)
//   C 比べ: 方位平均 U_φ の族の差(円軌道との差・位相を揃えた族 − 位相を乱した族〔腕〕・位相を乱した族 − 円軌道〔分散〕・種のばらつき)・観測の要る分 v_obs − v_bar との比・
//     m = 2 の密度と U の成分と位相・渦度・J の流れ・トルクと仕事の目安(引きずりの緩和の率あたり)・∂U/∂t と定常の輸送の読みの比
//   Z 離散化(間隔・方位の数)と ∂U/∂t の中心差分の照らし(刻み h と h/2)・共鳴の半径(第330便b の resonanceRadii を呼ぶ —— Ω_p の格子)
// ■ 言わないこと: 3 つの族の差は宣言した運動学の型の表(腕の形成・平坦な回転の機構・回転曲線の理由に使わない)・自己の重みは決めない・
//   引きずりの速度とトルクと仕事は緩和の率あたりの目安(力・加速度の値ではない)・`κ_epi` と κ_D は別の量・棒は notClaim。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as L from './lib-w333d-noncirc.mjs';
import * as TG from './lib-w332b-transgeo2.mjs';
import * as GR from './lib-w329b-galrot.mjs';
import * as DW from './lib-w330b-dragweight.mjs';
import * as CF from './lib-w331b-centrifugal.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w333d-noncirc-1';
export const OUT_MAIN = 'tests/out/noncirc-w333d.json';
export const FIXTURE = 'tests/fixtures/ngc3198-rotmod-w329b.json';
export const TARGET = 'tests/lib-w333d-noncirc.mjs';   // html を読まない器の来歴の対象(純関数 —— 第317便d の satan の型)
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const KPC = GR.KPC_M, MSUN = GR.MSUN_KG, median = CF.median;
export const NOT_CLAIM = Object.freeze(['3 つの族の差は宣言した運動学の型(一次の周転円・卵形の向きの巻き・Ω_p の格子)の表 —— 腕の形成・平坦な回転の機構・回転曲線の理由の同定に使わない',
  '相互作用の時間発展はしない(源の軌道は宣言の式で動かす —— ∂U/∂t は宣言の軌道の上の値)', '自己の重みは決めない(場の読みと R_d = Y_k m の列 —— AN618)',
  '引きずりの速度・トルク・仕事は緩和の率あたりの目安(力・加速度の値ではない)', '軌道は閉じたケプラー楕円ではない(ν = κ_epi のロゼット・ν = 2(Ω − Ω_p) の卵形)',
  'κ_epi と κ_D は別の量', '棒は扱わない(notClaim)']);
/** 器の宣言(走行の前に置く —— 結果を見て変えない) */
export const PLAN = Object.freeze({
  /** NGC 3198 の恒星の円盤(第332便b の円盤と同じ作り方): Υ_disk 0.5・環 1〜30 kpc・中心の点は 0.5 kpc の内の質量(固定・速度 0)・中心の引きずり自転 s_d = v_obs(R_c)/R_c(第332便b の宣言) */
  upsDisk: 0.5, ringFromKpc: 1, ringToKpc: 30, RcKpc: 0.5,
  /** 離散化 [間隔 kpc, 方位の点の数] —— 主は先頭・残りは離散化の依存の列 */
  disc: Object.freeze([Object.freeze([1, 24]), Object.freeze([1, 48]), Object.freeze([0.5, 24])]),
  /** 動径の振幅 ε(X = εR_g)・random の種・Ω_p の格子 [km s⁻¹ kpc⁻¹](第330便b の格子の部分) */
  amps: Object.freeze([0.05, 0.1, 0.2]), seeds: Object.freeze([1, 2, 3]), omegaPKms: Object.freeze([5, 10, 20]),
  /** 組: 核(trans = α 2・transR = α 1 —— ε 0)× 星の引きずり自転 × 分母。主は先頭 */
  combos: Object.freeze([Object.freeze({ key: 'a2|none|field', kernel: 'trans', spin: 'none', denom: 'field' }), Object.freeze({ key: 'a2|none|selfRd', kernel: 'trans', spin: 'none', denom: 'selfRd' }),
    Object.freeze({ key: 'a2|sync|field', kernel: 'trans', spin: 'sync', denom: 'field' }), Object.freeze({ key: 'a1|none|field', kernel: 'transR', spin: 'none', denom: 'field' }),
    Object.freeze({ key: 'a1|sync|field', kernel: 'transR', spin: 'sync', denom: 'field' })]),
  /** 自己の重みの宣言(R_d = Y_k m・形 ballMean —— 核と同じ p) */
  selfShape: 'ballMean', selfRule: 'kappaM',
  /** 要約の半径の範囲 [kpc](切った円盤の端を外す)・離散化の列の振幅 */
  sumFromKpc: 3, sumToKpc: 28, discAmp: 0.1, discSeed: 1, discOmegaPKms: 10,
  /** ∂U/∂t の中心差分の照らし: 刻み h = hFrac / 最大の率(Ω・κ_epi・|ν| —— 全部の環)・受け手の間引き(every 番目)・許容(差 ÷ max(|∂U/∂t|, |U| Ω_受け手の環)) */
  hFrac: 1e-5, fdEvery: 15, fdTol: 1e-6,
  G: GR.G_SI, c: 299792458,
});

/* ───────── 入力 ───────── */
export function readFixture(root = ROOT) {
  const J = JSON.parse(fs.readFileSync(path.join(root, FIXTURE), 'utf8'));
  const sha = crypto.createHash('sha256').update(Buffer.from(J.rawText, 'utf8')).digest('hex');
  return { J, rows: J.rows, shaSame: sha === J.provenance.sha256 };
}
function interpAt(rows, R, key) {
  if (R <= rows[0].R) return rows[0][key];
  for (let k = 0; k + 1 < rows.length; k++) if (R <= rows[k + 1].R) { const a = rows[k], b = rows[k + 1], t = (R - a.R) / (b.R - a.R); return a[key] + t * (b[key] - a[key]); }
  return rows[rows.length - 1][key];
}
function vbarKms(rows, R) { const vg = interpAt(rows, R, 'Vgas'), vd = interpAt(rows, R, 'Vdisk'), vb = interpAt(rows, R, 'Vbul'), v2 = vg * Math.abs(vg) + PLAN.upsDisk * vd * Math.abs(vd) + GR.DECL.upsilonBul * vb * Math.abs(vb); return v2 > 0 ? Math.sqrt(v2) : null; }
/** `κ_epi`(R) のラベル(第329便b の labelsTable の localQuad —— 表の点の値を環の半径へ線形に補間・km s⁻¹ kpc⁻¹) */
export function labelRows(rows) { return GR.labelsTable(rows.map((r) => ({ R: r.R, v: r.Vobs, sigma: r.errV })), 'localQuad'); }
function labelAt(T, R, key) {
  const ok = T.filter((q) => q.labels && q.labels[key] !== null);
  if (R <= ok[0].R) return ok[0].labels[key];
  for (let k = 0; k + 1 < ok.length; k++) if (R <= ok[k + 1].R) { const a = ok[k], b = ok[k + 1], t = (R - a.R) / (b.R - a.R); return a.labels[key] + t * (b.labels[key] - a.labels[key]); }
  return ok[ok.length - 1].labels[key];
}
/** 環の宣言(dR [kpc])—— 案内中心の Ω は v_obs(R_g)/R_g(第332便b の源の速度と同じ)・`κ_epi` はラベルの補間 */
export function ringsOf(FX, dR) {
  const rows = FX.rows, T = labelRows(rows), sigma = (R) => PLAN.upsDisk * interpAt(rows, R, 'SBdisk');
  const Rs = []; for (let k = 0; ; k++) { const R = PLAN.ringFromKpc + k * dR; if (R > PLAN.ringToKpc + 1e-9) break; Rs.push(Math.round(R * 1e6) / 1e6); }
  const rings = Rs.map((R) => {
    const vo = interpAt(rows, R, 'Vobs') * 1e3, Rm = R * KPC, kap = labelAt(T, R, 'kappaEpi') * GR.KMS_KPC_RADS;
    return { Rg: Rm, m: 2 * Math.PI * (R * 1e3) * (dR * 1e3) * sigma(R) * MSUN, Omega: vo / Rm, kappaEpi: kap, RKpc: R, vObs: vo, vBar: vbarKms(rows, R) * 1e3 };
  });
  let Mc = 0; const nn = 200; for (let i = 0; i < nn; i++) { const r = (i + 0.5) * PLAN.RcKpc / nn; Mc += 2 * Math.PI * r * 1e3 * (PLAN.RcKpc / nn * 1e3) * sigma(r); } Mc *= MSUN;
  const OmC = interpAt(rows, PLAN.RcKpc, 'Vobs') * 1e3 / (PLAN.RcKpc * KPC);
  return { rings, center: { m: Mc, spin: OmC }, Rs, T };
}

/* ───────── 族の宣言 ───────── */
export function familyConfigs() {
  const out = [{ key: 'circ', family: 'circ', amp: 0 }];
  for (const amp of PLAN.amps) for (const seed of PLAN.seeds) out.push({ key: 'random|' + amp + '|s' + seed, family: 'random', amp, seed });
  for (const amp of PLAN.amps) out.push({ key: 'kin|' + amp, family: 'kin', amp });
  for (const amp of PLAN.amps) for (const Op of PLAN.omegaPKms) out.push({ key: 'pattern|' + amp + '|' + Op, family: 'pattern', amp, OmegaPKms: Op });
  return out;
}
const diskOf = (RG, cfg, spin, t = 0) => L.buildDisk({ rings: RG.rings, K: RG.K, family: cfg.family, amp: cfg.amp, seed: cfg.seed || 0, OmegaP: cfg.OmegaPKms ? cfg.OmegaPKms * GR.KMS_KPC_RADS : null, R0: L.DECL.armR0Kpc * KPC, center: RG.center, spin, t });

/* ───────── 場の評価(1 円盤 × 1 組)───────── */
function evalCombo(D, combo) {
  const K = TG.kernelOf(combo.kernel, 0), pts = D.pts, n = pts.length, rows = [];
  for (let i = 1; i < n; i++) {
    const P = pts[i], src = new Array(n - 1);
    for (let j = 0, k = 0; j < n; j++) if (j !== i) src[k++] = pts[j];
    const selfW = combo.denom === 'selfRd' ? TG.selfWeightOf({ shape: PLAN.selfShape, rule: PLAN.selfRule, m: P.m, G: PLAN.G, c: PLAN.c, p: K.p }).w : 0;
    const at = [P.x, P.y], v = [P.vx, P.vy];
    const F = TG.frameField({ at, sources: src, kernel: K, rot: { type: 'coord' }, selfW, v }), Dt = L.fieldDot({ at, sources: src, kernel: K, selfW });
    const tr = TG.transportSteady({ u: F.u, J: F.J, v, kF: 1 }), Jv = [F.J[0][0] * v[0] + F.J[0][1] * v[1], F.J[1][0] * v[0] + F.J[1][1] * v[1]];
    const up = TG.polar(at, F.u), vp = TG.polar(at, v), dp = TG.polar(at, Dt.dudt), dux = F.u[0] - v[0], duy = F.u[1] - v[1];
    rows.push({ i, R: up.r, phi: Math.atan2(P.y, P.x), m: P.m, uPhi: up.phi, uR: up.R, vPhi: vp.phi, vR: vp.R, vortHalf: 0.5 * F.vort, dudtPhi: dp.phi, dudtR: dp.R,
      dudtAbs: Math.hypot(Dt.dudt[0], Dt.dudt[1]), steadyAbs: Math.hypot(tr.a[0], tr.a[1]), convAbs: Math.hypot(Jv[0], Jv[1]),
      torque: P.m * (P.x * duy - P.y * dux), work: P.m * (P.vx * dux + P.vy * duy), shareSelf: F.shares.self, uDotSame: Math.max(Math.abs(Dt.u[0] - F.u[0]), Math.abs(Dt.u[1] - F.u[1])) / Math.max(Math.hypot(F.u[0], F.u[1]), 1e-300) });
  }
  return rows;
}
/** 帯(実際の半径の箱)ごとの集計: 箱の端は環の中点(R_k ± ΔR/2) */
function edgesOf(RG) { const dR = RG.dR * KPC, e = RG.rings.map((r) => r.Rg - dR / 2); e.push(RG.rings[RG.rings.length - 1].Rg + dR / 2); return e; }
function annuli(D, rows, edges, RG) {
  const kin = L.annulusKinematics(D.pts.slice(1), edges);
  return kin.map((a, b) => {
    const q = rows.filter((r) => r.R >= a.lo && r.R < a.hi), base = { RKpc: RG.rings[b].RKpc, n: a.n };
    if (!q.length) return base;
    const M = q.reduce((s, r) => s + r.m, 0), mean = (k) => q.reduce((s, r) => s + r.m * r[k], 0) / M;
    const uF = L.fourierM(q.map((r) => r.phi), q.map((r) => r.uPhi - mean('uPhi')), 2), uPhiMean = mean('uPhi');
    return Object.assign(base, { mass: a.mass, A2: a.A2, phase2: a.phase2, vphiMean: a.vphiMean, vRMean: a.vRMean, sigmaR: a.sigmaR, sigmaPhi: a.sigmaPhi, jFlux: a.jFlux,
      uPhiMean, uRMean: mean('uR'), uPhiA2: 2 * Math.hypot(uF.c, uF.s) / q.length / Math.abs(uPhiMean), uPhiPhase2: uF.phase,   // U_φ の m = 2 の振幅 ÷ |方位平均|
      vortHalfMean: mean('vortHalf'), dudtPhiMean: mean('dudtPhi'), dudtOverConv: median(q.map((r) => r.dudtAbs / r.convAbs)), dudtOverSteady: median(q.map((r) => r.dudtAbs / r.steadyAbs)),
      torque: q.reduce((s, r) => s + r.torque, 0), work: q.reduce((s, r) => s + r.work, 0), shareSelf: median(q.map((r) => r.shareSelf)) });
  });
}
const inSum = (a) => a.RKpc >= PLAN.sumFromKpc && a.RKpc <= PLAN.sumToKpc;
function summaryOf(an, RG) {
  const q = an.filter((a) => inSum(a) && a.n > 0), mo = (k) => median(q.map((a) => a[k]));
  return { n: q.length, A2: mo('A2'), uPhiA2: mo('uPhiA2'), sigmaROverV: median(q.map((a) => a.sigmaR / RG.rings.find((r) => r.RKpc === a.RKpc).vObs)), dudtOverConv: mo('dudtOverConv'), dudtOverSteady: mo('dudtOverSteady'),
    jFluxSum: q.reduce((s, a) => s + a.jFlux, 0), torqueSum: q.reduce((s, a) => s + a.torque, 0), workSum: q.reduce((s, a) => s + a.work, 0), shareSelf: mo('shareSelf'),
    phaseLag: median(q.filter((a) => a.A2 > 1e-9 && a.uPhiA2 > 1e-9).map((a) => Math.abs(L.wrapM(a.uPhiPhase2 - a.phase2)))) };   // 円軌道の族は m = 2 が丸めの桁 —— 位相を比べない(null)
}

/* ───────── F 族と格子(主の離散化)───────── */
export function partFamilies(FX) {
  const [dR, K] = PLAN.disc[0], RG = Object.assign(ringsOf(FX, dR), { dR, K }), edges = edgesOf(RG), out = {};
  for (const cfg of familyConfigs()) {
    const rec = { cfg, combos: {} };
    for (const cmb of PLAN.combos) {
      const D = diskOf(RG, cfg, cmb.spin), rows = evalCombo(D, cmb), an = annuli(D, rows, edges, RG);
      rec.dropped = D.dropped; rec.droppedKpc = D.droppedRg.map((x) => x / KPC);
      const main = cmb.key === PLAN.combos[0].key;
      rec.combos[cmb.key] = { summary: summaryOf(an, RG), uPhiMean: an.map((a) => (a.n ? a.uPhiMean : null)), uDotSameMax: Math.max(...rows.map((r) => r.uDotSame)) };
      if (main) rec.annuli = an;
    }
    out[cfg.key] = rec;
  }
  return { decl: { dR, K, n: RG.rings.length * K + 1, McMsun: RG.center.m / MSUN, MdiskMsun: RG.rings.reduce((s, r) => s + r.m, 0) / MSUN, OmegaC: RG.center.spin,
    ringsKpc: RG.Rs, vObs: RG.rings.map((r) => r.vObs), vBar: RG.rings.map((r) => r.vBar), Omega: RG.rings.map((r) => r.Omega), kappaEpi: RG.rings.map((r) => r.kappaEpi) }, families: out };
}

/* ───────── C 比べ(腕と分散の切り分け)───────── */
export function compare(F) {
  const fam = F.families, d = F.decl, need = d.vObs.map((v, k) => v - d.vBar[k]), rows = [];
  const sumIdx = d.ringsKpc.map((R, k) => (R >= PLAN.sumFromKpc && R <= PLAN.sumToKpc ? k : -1)).filter((k) => k >= 0);
  const med = (arr) => median(sumIdx.map((k) => arr[k]));
  for (const cmb of PLAN.combos) {
    const C0 = fam.circ.combos[cmb.key].uPhiMean;
    for (const amp of PLAN.amps) {
      const Rr = PLAN.seeds.map((s) => fam['random|' + amp + '|s' + s].combos[cmb.key].uPhiMean);
      const Rm = C0.map((_, k) => Rr.reduce((s, a) => s + a[k], 0) / Rr.length), Rsd = C0.map((_, k) => Math.sqrt(Rr.reduce((s, a) => s + (a[k] - Rm[k]) ** 2, 0) / (Rr.length - 1)));
      const disp = C0.map((c, k) => Rm[k] - c), scat = Rsd;
      const arms = [['kin', fam['kin|' + amp].combos[cmb.key].uPhiMean]].concat(PLAN.omegaPKms.map((Op) => ['pattern|' + Op, fam['pattern|' + amp + '|' + Op].combos[cmb.key].uPhiMean]));
      const row = { combo: cmb.key, amp, dispOverCirc: med(disp.map((x, k) => x / C0[k])), dispOverNeed: med(disp.map((x, k) => x / need[k])), seedScatterOverCirc: med(scat.map((x, k) => x / C0[k])), arms: {} };
      for (const [nm, A] of arms) {
        const arm = A.map((x, k) => x - Rm[k]), tot = A.map((x, k) => x - C0[k]);
        row.arms[nm] = { armOverCirc: med(arm.map((x, k) => x / C0[k])), armOverNeed: med(arm.map((x, k) => x / need[k])), armOverScatter: med(arm.map((x, k) => Math.abs(x) / scat[k])), totOverCirc: med(tot.map((x, k) => x / C0[k])),
          maxAbsTotOverCirc: Math.max(...sumIdx.map((k) => Math.abs(tot[k] / C0[k]))) };
      }
      rows.push(row);
    }
  }
  return { needMedianKms: med(need) / 1e3, circOverNeed: med(fam.circ.combos[PLAN.combos[0].key].uPhiMean.map((x, k) => x / need[k])), rows };
}

/* ───────── Z 離散化・∂U/∂t の差分・共鳴の半径 ───────── */
export function partDisc(FX) {
  const out = [];
  const cfgs = [{ key: 'circ', family: 'circ', amp: 0 }, { key: 'random|' + PLAN.discAmp + '|s' + PLAN.discSeed, family: 'random', amp: PLAN.discAmp, seed: PLAN.discSeed }, { key: 'kin|' + PLAN.discAmp, family: 'kin', amp: PLAN.discAmp },
    { key: 'pattern|' + PLAN.discAmp + '|' + PLAN.discOmegaPKms, family: 'pattern', amp: PLAN.discAmp, OmegaPKms: PLAN.discOmegaPKms }];
  const cmb = PLAN.combos[0];
  for (const [dR, K] of PLAN.disc) {
    const RG = Object.assign(ringsOf(FX, dR), { dR, K }), edges = edgesOf(RG), res = { dR, K, families: {} };
    for (const cfg of cfgs) { const D = diskOf(RG, cfg, cmb.spin), rows = evalCombo(D, cmb), an = annuli(D, rows, edges, RG); res.families[cfg.key] = { summary: summaryOf(an, RG), pick: [5, 10, 20].map((R) => { const a = an.find((x) => Math.abs(x.RKpc - R) < 1e-9); return a && a.n ? a.uPhiMean : null; }) }; }
    out.push(res);
  }
  // 位相を揃えた族と位相を乱した族の差(腕)の離散化の依存: 半径 5・10・20 kpc の U_φ の差 ÷ 円軌道
  out.forEach((r) => { const c = r.families.circ.pick, rr = r.families['random|' + PLAN.discAmp + '|s' + PLAN.discSeed].pick; r.armKinOverCirc = r.families['kin|' + PLAN.discAmp].pick.map((x, k) => (x - rr[k]) / c[k]); r.dispOverCirc = rr.map((x, k) => (x - c[k]) / c[k]); });
  return out;
}
export function partFd(FX) {
  const [dR, K] = PLAN.disc[0], RG = Object.assign(ringsOf(FX, dR), { dR, K });
  let rate = 0; for (const r of RG.rings) { rate = Math.max(rate, r.Omega, r.kappaEpi); for (const Op of PLAN.omegaPKms) rate = Math.max(rate, Math.abs(2 * (r.Omega - Op * GR.KMS_KPC_RADS))); }
  const h = PLAN.hFrac / rate, rows = [];
  for (const cfg of familyConfigs().filter((q) => q.family === 'circ' || q.amp === PLAN.discAmp)) for (const cmb of [PLAN.combos[0], PLAN.combos[2], PLAN.combos[3]]) {
    const D0 = diskOf(RG, cfg, cmb.spin, 0), Dp = [diskOf(RG, cfg, cmb.spin, h), diskOf(RG, cfg, cmb.spin, h / 2)], Dm = [diskOf(RG, cfg, cmb.spin, -h), diskOf(RG, cfg, cmb.spin, -h / 2)];
    const Kn = TG.kernelOf(cmb.kernel, 0); let e1 = 0, e2 = 0, cnt = 0;
    for (let i = 1; i < D0.pts.length; i += PLAN.fdEvery) {
      const at = [D0.pts[i].x, D0.pts[i].y], ex = (P) => P.filter((_, j) => j !== i);
      const A = L.fieldDot({ at, sources: ex(D0.pts), kernel: Kn }), sc = Math.max(Math.hypot(A.dudt[0], A.dudt[1]), Math.hypot(A.u[0], A.u[1]) * RG.rings[D0.pts[i].ring].Omega);
      const fd = (k, hh) => { const up = L.fieldDot({ at, sources: ex(Dp[k].pts), kernel: Kn }).u, um = L.fieldDot({ at, sources: ex(Dm[k].pts), kernel: Kn }).u; return [(up[0] - um[0]) / (2 * hh), (up[1] - um[1]) / (2 * hh)]; };
      const f1 = fd(0, h), f2 = fd(1, h / 2);
      e1 = Math.max(e1, Math.hypot(f1[0] - A.dudt[0], f1[1] - A.dudt[1]) / sc); e2 = Math.max(e2, Math.hypot(f2[0] - A.dudt[0], f2[1] - A.dudt[1]) / sc); cnt++;
    }
    rows.push({ cfg: cfg.key, combo: cmb.key, receivers: cnt, relH: e1, relH2: e2 });
  }
  return { hSec: h, rateMax: rate, rows, maxRelH: Math.max(...rows.map((r) => r.relH)), maxRelH2: Math.max(...rows.map((r) => r.relH2)) };
}
export function partResonance(FX) {
  const T = labelRows(FX.rows), grid = PLAN.omegaPKms.map((Op) => { const R = DW.resonanceRadii(T, Op); return { OmegaP: Op, ILR: R.ILR.at, CR: R.CR.at, OLR: R.OLR.at, rangeKpc: R.rangeKpc }; });
  const RG = ringsOf(FX, PLAN.disc[0][0]), ratio = RG.rings.map((r) => r.kappaEpi / r.Omega), impl = RG.rings.map((r) => (r.Omega - 0.5 * r.kappaEpi) / GR.KMS_KPC_RADS);
  return { grid, kappaOverOmega: { min: Math.min(...ratio), max: Math.max(...ratio), median: median(ratio) }, implied: { RKpc: RG.Rs, OmegaMinusHalfKappaKms: impl }, bar: { status: 'notClaim', note: '棒は扱わない(原仮定者の整理(2026-11-08))' } };
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const F = J.fam.families, nCfg = familyConfigs().length;
  return {
    pure: Object.values(J.pure.gates).every(Boolean),
    fixture: J.inputs.fixtureSha256Same === true,
    familiesComplete: Object.keys(F).length === nCfg && Object.values(F).every((r) => Object.keys(r.combos).length === PLAN.combos.length && r.annuli.length === J.fam.decl.ringsKpc.length
      && Object.values(r.combos).every((c) => c.uPhiMean.every((x) => x === null || fin(x)) && c.summary.n > 0)),
    fieldDotSameU: Object.values(F).every((r) => Object.values(r.combos).every((c) => c.uDotSameMax <= 1e-12)),
    circZero: F.circ.annuli.every((a) => a.n === 0 || (a.A2 <= 1e-12 && a.sigmaR <= 1e-9 * Math.abs(a.vphiMean) && Math.abs(a.jFlux) <= 1e-9 * Math.abs(a.mass * a.vphiMean * a.vphiMean))),
    sameRingMass: Object.values(F).every((r) => r.annuli.length === F.circ.annuli.length),
    compared: J.cmp.rows.length === PLAN.combos.length * PLAN.amps.length && J.cmp.rows.every((r) => fin(r.dispOverCirc) && Object.keys(r.arms).length === 1 + PLAN.omegaPKms.length),
    discretized: J.disc.length === PLAN.disc.length && J.disc.every((r) => Object.keys(r.families).length === 4),
    fdMatch: J.fd.rows.length > 0 && J.fd.maxRelH <= PLAN.fdTol && J.fd.maxRelH2 <= PLAN.fdTol,
    resonance: J.res.grid.length === PLAN.omegaPKms.length && J.res.bar.status === 'notClaim' && J.res.kappaOverOmega.min > 1,
  };
}
export function runAll(root = ROOT) {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const FX = readFixture(root); mark('inputs');
  const fam = partFamilies(FX); mark('families');
  const cmp = compare(fam); mark('compare');
  const disc = partDisc(FX); mark('disc');
  const fd = partFd(FX); mark('fd');
  const res = partResonance(FX); mark('resonance');
  const J = { inputs: { fixtureSha256Same: FX.shaSame, fixtureVersion: FX.J.version, fixtureRows: FX.rows.length }, pure, fam, cmp, disc, fd, res, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W333D_OUT ? (path.isAbsolute(process.env.W333D_OUT) ? process.env.W333D_OUT : path.join(ROOT, process.env.W333D_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第333便d noncirc(版 ' + HARNESS_VERSION + ')');
  const R = runAll();
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w333d-noncirc.mjs', target: TARGET,
    ruling: '原仮定者の整理(2026-11-10)「個々の星の軌道は同心円ではなく、楕円軌道の密度波で腕が形成される —— 同心円に近い前提の計算では合わせにくいのではないか」「重みは m/r² が有力だが他の次数でも検証」(作業仮説 —— 診断で検査)・'
      + '原仮定者の回答(2026-11-10 —— AN608 非円軌道の対照・AN618 = C・AN621 = A・AN622 = C)・統括の検証項目 R320',
    decl: L.DECL, plan: PLAN, families: L.FAMILIES, spinTypes: L.SPIN_TYPES, notClaim: NOT_CLAIM, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w333d-noncirc.mjs', 'tests/lib-w333d-noncirc.mjs', 'tests/lib-w332b-transgeo2.mjs', 'tests/lib-w331a-coordtwist.mjs', 'tests/lib-w331b-centrifugal.mjs', 'tests/lib-w330b-dragweight.mjs',
    'tests/lib-w326d-axialheat.mjs', 'tests/lib-w309a-invsq.mjs', 'tests/lib-w312a-decay.mjs', 'tests/lib-w310d-shell.mjs', 'tests/lib-w307a-sphereaxial.mjs', 'tests/lib-w329b-galrot.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第333便d', target: TARGET, code: CODE, inputs: [FIXTURE] }), {
    harnessVersion: HARNESS_VERSION, stage: 'noncirc', engine: 'Node の純関数だけ(html を読まない・エンジンの步を進めない —— 源は宣言の軌道の式で動かす)', notClaim: NOT_CLAIM });
  Object.assign(out.meta, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();
