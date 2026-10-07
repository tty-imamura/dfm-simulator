// 第287便a(原仮定者の裁定(第77報)④「銀河の成長を考える」・統括の検証項目 R107・AN63/AN74)—— **成長経路の原理コピー 🌰 の器**。
//
// ■ 何を測るか(**門は測る前に宣言** —— 下の `GATES`・`RUNS`・`VERDICT_RULE`・`PERTURB` を PHYSICS〔第287便a〕の結果より前に書いた)
//   ・🌰 clusterGrowthCopy(自由な中心 + 落ちてくる塊 4 個・中心とだけの捕獲 `centerCapture`)を、順行(宣言)・逆行・真正面の 3 対照 × 乱数種 3 で走らせ、
//     **合体が止んだ後**の窓 [t_last + 1, t_last + 3] × T_dyn(t_last は最後の捕獲の時刻)で保持率・半質量半径の変化・軸比を測る(閾値は 💮 の門 ——
//     器 tests/exp-w283f-cluster.mjs の GATES の値を読む・下げない)。合体の回数は門にしない。
//   ・捕獲の帳簿の閉じ(捕獲ごとの P・J・E の格納の残差 ≤ 1e-12 相対・Q ≥ 0・エンジンの安全上限〔速度 100・スピン ±40〕の発火 0)・トイの帳簿
//     (E_toy+E_mesh=0 厳密)・粒子とメッシュと捕獲の運動量の和の保存。
//   ・半径別の D_g(r)=|a_g,core|/(|a_g,core|+|a_g,group|)(環の方位平均)と、符号つきの η_mesh(r)=⟨a_mesh,r⟩/|⟨a_g,r⟩|(+ は外向き=斥力)・
//     F_r=a_g,r+a_mesh,r+⟨v_φ⟩²/r̄+a_disp,r(2D Jeans の分散項)の各項。a_mesh は場の契約の瞬時のトイ加速度
//     a=∂ₜū+(∇ū)v−(∇ū)ᵀ(v−ū)(dfmGeoToySpinStep と同じ式 —— (A) でエンジンの 1 步と照合)。
//   ・摂動後の復元(窓の終わりの状態を決定論の再走で作り直し、中心を除く粒子の位置を中心から 1.05 倍 → 2 T_dyn の r_h を無摂動の続きと比べる)。
//   ・負の対照 2 つ(エンジンの捕獲関数を直接呼ぶ): 無自転・真正面の落下で J を作らない / 逆行の相手でスピンが減り得る(+ 順行で増える・
//     エネルギー不足と安全上限の拒否)。
//   ・半径の対照(**同じ初期状態**から中心の本体半径だけ 0.01 → 1.5): 捕獲なしで状態の差の数(本体半径が力学に入るか)・捕獲ありの全走行。
//   ・💮 の走査器の同一初期状態化(tests/exp-w286a-cluster.mjs の `sameInitSeparation` —— 別 build の差と同じ初期状態の差)。
//   ・第286便a の Jeans 初期値の走行(宣言の構成 × 乱数種 3)との歩数と壁時計の並び(`JEANS_REF` —— 正本 cluster-w286a.json〔履歴〕の写し。
//     QA が正本と照合する)。
//   ・対照の最小模型(tests/lib-w287a-growth.mjs)の単体試験。
//
// ■ しないこと・言わないこと
//   ・💮 を 1 bit も変えない(走らせるのは 🌰 と、💮 の同一初期状態の比較だけ)。門を動かさない。観測値と突き合わせない。
//   ・「星団が落ち着いた」「合体で自転が増えて斥力になった」「中心の引きずりが支配的になった」「形状が安定した」と書かない(門の語は形状達成/未達だけ)。
//     2D の面内運動で渦伸長と呼ばない。
//
// 実行(Node だけ): node tests/exp-w287a-growth.mjs   (並列: W287A_WORKERS —— 既定 2。結果は並列数に依らない)
// 読む正本: なし(html だけ —— JEANS_REF は第286便a の正本の写しで、正本は読まない)。正本: tests/out/growth-w287a.json
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import * as E283 from './exp-w283f-cluster.mjs';
import * as E286 from './exp-w286a-cluster.mjs';
import * as LG from './lib-w287a-growth.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
const REGEN_SCOPE = {"presets":["clusterAnalogyBH","clusterGrowthCopy","galaxyAnalogyBH","gas"],"roots":["$","CENTER_CAPTURE_VERSION","CONTACT_MODE_KEY","DT","HP.allPresets","HP.dfmCenterCaptureStep","HP.dfmField","HP.dfmFieldContract","HP.dfmFieldContractOf","HP.dfmFieldSnapshot","HP.dfmMeshVelocityFieldAt","HP.frameWeightIsPull","HP.frameWeightPow","HP.sim","HP.validatePreset","T","centerCaptureCheck","ch","contactNoneOf","ctx","cw","dfmCenterCaptureStep","dfmField","dfmFieldContract","dfmGeoToySpinStep","geoCoreDispatch","jeansRowsVelocities","jeansSigma2Profile","lensExcludedRows","rayHeavy","rayMassMin","sim","traceRay","validatePreset"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w287a-growth-1';
export const PRESET = 'clusterGrowthCopy';
export const REF_PRESET = 'clusterAnalogyBH';
export const DT = E283.DT;
export const SEEDS = Object.freeze([20260929, 20260930, 20261001]);

/** 門(測る前に宣言 —— 閾値は 💮 の門〔第283便f の GATES〕の値をそのまま読む)。 */
export const GATES = Object.freeze({
  version: 'w287a-gates-1',
  thresholdsFrom: 'tests/exp-w283f-cluster.mjs GATES(' + E283.GATES.version + ')',
  population: '中心を除く全粒子(質量重み)—— 捕獲された質量は保持に数える',
  window: Object.freeze({ afterQuietDyn: 1, lenDyn: 2, sampleEveryDyn: 0.25, maxDyn: 20 }),
  nanMax: 0,
  retentionMin: E283.GATES.retentionMin, retentionRadiusOverD: 2,
  halfMassRelChangeMax: E283.GATES.halfMassRelChangeMax,
  axisRatioMin: E283.GATES.axisRatioMin,
  toyEnergyCloseAbsMax: 0,
  clampMax: 0,
  ledgerRelMax: 1e-12,
});
export const GATE_TEXT = [
  `窓 = 合体が止んだ後 [t_last + ${GATES.window.afterQuietDyn}, t_last + ${GATES.window.afterQuietDyn + GATES.window.lenDyn}] × T_dyn(t_last = 最後の捕獲の時刻・標本 ${GATES.window.sampleEveryDyn} T_dyn ごと・${GATES.window.maxDyn} T_dyn までに合体が止まなければ未達)`,
  `保持率(中心から r ≤ ${GATES.retentionRadiusOverD} D の質量 + 捕獲された質量)/(中心を除く初期の質量)≥ ${GATES.retentionMin.toFixed(2)}`,
  `半質量半径(中心を除く全粒子・質量重み)の変化 ≤ ${(GATES.halfMassRelChangeMax * 100).toFixed(0)}%(窓の最初の標本に対して)`,
  `軸比(1/r² 重みの慣性テンソル・質量重み)≥ ${GATES.axisRatioMin}`,
  `NaN ${GATES.nanMax}・E_toy+E_mesh = ${GATES.toyEnergyCloseAbsMax}(厳密)・エンジンの安全上限(速度 100・スピン ±40)の発火 ${GATES.clampMax}・捕獲の帳簿の格納残差 ≤ ${GATES.ledgerRelMax}(相対)・Q ≥ 0`,
  `合体の回数は門にしない(記録するだけ)`,
];
/** 走行(測る前に宣言)。宣言の構成 = 順行。逆行 = 塊の並進速度の符号を反転・真正面 = 並進速度 0(同じ乱数種 —— 配置は同じ)。 */
export const ORBITS = Object.freeze([
  Object.freeze({ key: 'pro', label: '順行(宣言 —— 塊の並進は接線 +1.4・中心の spin 12 と同じ向き)' }),
  Object.freeze({ key: 'retro', label: '逆行(並進速度の符号を反転 —— 同じ配置)' }),
  Object.freeze({ key: 'head', label: '真正面(並進速度 0 —— 塊は中心へ落ちる)' })]);
export const RUNS = Object.freeze(ORBITS.flatMap((o) => [0, 1, 2].map((s) => Object.freeze({ key: `${o.key}-seed${s}`, orbit: o.key, seed: s }))));
export const RADIUS_RUN = Object.freeze({ key: 'pro-seed0-bodyR1.5', orbit: 'pro', seed: 0, bodyR: 1.5, info: true });
export const VERDICT_RULE = Object.freeze({ version: 'w287a-verdict-1',
  text: '宣言の構成(順行)が乱数種 3 つすべてで形状達成なら「形状達成」、そうでなければ「未達」(逆行・真正面は対照の記録)' });
export const PERTURB = Object.freeze({ version: 'w287a-perturb-1', scale: 1.05, lenDyn: 2, sampleEveryDyn: 0.25,
  rule: '中心を除く粒子の位置を中心から 1.05 倍 → 2 T_dyn。δ(t)=r_h,摂動/r_h,無摂動−1。最後の 1 T_dyn の |δ| の平均 ≤ 0.5 |δ(0)| なら「復元」' });
export const DIAG = Object.freeze({ version: 'w287a-diag-1', rings: Object.freeze([2.5, 5, 10, 20]), nAz: 64,
  bins: Object.freeze([[0, 2.5], [2.5, 5], [5, 10], [10, 20], [20, 40], [40, 80]]) });
export const RADIUS_STEPS = 2000;
/** 第286便a の Jeans 初期値の走行(宣言の構成 r20-v0.1-mc1/8.5-s12 × 乱数種 3)—— 正本 tests/out/cluster-w286a.json(履歴)の写し。 */
export const JEANS_REF = Object.freeze({ source: 'tests/out/cluster-w286a.json', harness: 'w286a-cluster-1', n: 526,
  runs: Object.freeze([
    Object.freeze({ key: 'r20-v0.1-mc1/8.5-s12-seed0', steps: 7021, wallSec: 594.168, verdict: '未達' }),
    Object.freeze({ key: 'r20-v0.1-mc1/8.5-s12-seed1', steps: 7081, wallSec: 597.162, verdict: '未達' }),
    Object.freeze({ key: 'r20-v0.1-mc1/8.5-s12-seed2', steps: 7009, wallSec: 590.557, verdict: '未達' })]) });

const clone = (o) => JSON.parse(JSON.stringify(o));
const rel = E283.rel;
const byId = (HP, id) => HP.allPresets().find((q) => q.id === id);

/** 写し(器の中だけ)。 */
export function variantPreset(HP, spec) {
  const p = clone(byId(HP, PRESET));
  p.seed = SEEDS[spec.seed || 0];
  for (const b of p.bodies) {
    if (b.type !== 'disk') continue;
    if (spec.orbit === 'retro') { b.bulkVx = -b.bulkVx; b.bulkVy = -b.bulkVy; }
    else if (spec.orbit === 'head') { b.bulkVx = 0; b.bulkVy = 0; }
  }
  return p;
}
/** build(同じ初期状態から条件を変える: bodyR〔radOv + updateRadii〕・capture:false〔捕獲を外す〕)。 */
export function buildSpec(HP, spec, change = {}) {
  const v = HP.validatePreset(variantPreset(HP, spec));
  if (!v.ok) throw new Error('validatePreset(' + spec.key + '): ' + (v.errors || []).join(' / '));
  HP.sim.build(v.preset);
  const S = HP.sim;
  if (change.bodyR !== undefined) { S.radOv[0] = change.bodyR / S.params.radiusScale; S.updateRadii(); }
  if (change.capture === false) { S.capture = null; S.hasCenterCapture = false; }
  return { S, preset: v.preset, warnings: v.warnings };
}
const totalMass = (S) => { let M = 0; for (let i = 0; i < S.n; i++) M += S.m[i]; return M; };
export function tdynOf(S, D) { return 2 * Math.PI * Math.sqrt(D * D * D / (S.params.G * totalMass(S))); }

/** 場の契約の瞬時のトイ加速度(dfmGeoToySpinStep と同じ式・同じ源の加速度・同じ dragR の規則)。 */
export function toyAccel(HP, S) {
  const p = S.params, n = S.n, cf = p.spaceMesh || {};
  const pw = HP.frameWeightPow(p), eps = p.softening, G = p.G;
  const D0p = HP.frameWeightIsPull(p) ? ((p.D0pull !== undefined) ? p.D0pull : p.D0) : p.D0;
  const dR = (cf.dragR !== undefined && cf.dragR !== null) ? cf.dragR : null;
  let dRfree = -1;
  if (dR !== null) { let anyPin = false, bm = -Infinity; for (let i = 0; i < n; i++) { if (S.pinned[i] === 1) { anyPin = true; break; } if (S.m[i] > bm) { bm = S.m[i]; dRfree = i; } } if (anyPin) dRfree = -1; }
  const BD = [];
  for (let i = 0; i < n; i++) BD.push({ id: i, m: S.m[i], x: S.x[i], y: S.y[i], vx: S.vx[i], vy: S.vy[i], ax: 0, ay: 0,
    spin: S.spin[i], R: (dR !== null && (S.pinned[i] === 1 || i === dRfree)) ? dR : S.R[i], omegaDot: 0, pinned: (S.pinned[i] === 1) });
  for (let i = 0; i < n; i++) {
    if (S.pinned[i]) continue;
    const f = HP.dfmField(BD, S.x[i], S.y[i], { excludeBodyId: i, need: 'gravity', G, eps, p: pw, D0: D0p, background: 'static', energyContract: 'toy' });
    BD[i].ax = f.gravity[0]; BD[i].ay = f.gravity[1];
  }
  const wDecl = (cf.D0 !== undefined && cf.D0 !== null);
  const C = { p: pw, eps, Wbg: wDecl ? cf.D0 : D0p, WbgFrom: wDecl ? 'declared' : 'D0', sources: 'all', velocity: 'v', spin: 'e6', spinSources: 'center', q: p.q,
    fit: 'mean', background: 'static', need: 'uBt', excludeBodyId: 0 };
  const eta = (cf.toyGain === undefined) ? 1 : cf.toyGain;
  const ax = new Float64Array(n), ay = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    if (S.pinned[i]) continue;
    C.excludeBodyId = i;
    const f = HP.dfmFieldContract(BD, S.x[i], S.y[i], C);
    if (!f) continue;
    const ubx = eta * f.u[0], uby = eta * f.u[1];
    const gxx = eta * f.gradU[0], gxy = eta * f.gradU[1], gyx = eta * f.gradU[2], gyy = eta * f.gradU[3];
    const tux = eta * f.dUdt[0], tuy = eta * f.dUdt[1];
    const vxi = S.vx[i], vyi = S.vy[i], rlx = vxi - ubx, rly = vyi - uby;
    ax[i] = tux + gxx * vxi + gxy * vyi - (gxx * rlx + gyx * rly);
    ay[i] = tuy + gyx * vxi + gyy * vyi - (gxy * rlx + gyy * rly);
  }
  return { ax, ay };
}
/** E4 の重力加速度(軟化 ε・全源・自己除外)。 */
export function gravAccel(S) {
  const n = S.n, G = S.params.G, e2 = S.params.softening ** 2, ax = new Float64Array(n), ay = new Float64Array(n);
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
    const dx = S.x[j] - S.x[i], dy = S.y[j] - S.y[i], d2 = dx * dx + dy * dy + e2, w = G / (d2 * Math.sqrt(d2));
    ax[i] += w * S.m[j] * dx; ay[i] += w * S.m[j] * dy; ax[j] -= w * S.m[i] * dx; ay[j] -= w * S.m[i] * dy;
  }
  return { ax, ay };
}

/** D_g(r)(環の方位平均)と η_mesh・F_r の bin(中心 ic のまわり)。 */
export function diagOf(HP, S, ic) {
  const G = S.params.G, e2 = S.params.softening ** 2, cx = S.x[ic], cy = S.y[ic], cvx = S.vx[ic], cvy = S.vy[ic];
  const dg = DIAG.rings.map((r) => {
    let acc = 0;
    for (let a = 0; a < DIAG.nAz; a++) {
      const th = 2 * Math.PI * a / DIAG.nAz, x = cx + r * Math.cos(th), y = cy + r * Math.sin(th);
      let gx = 0, gy = 0, cxA = 0, cyA = 0;
      for (let j = 0; j < S.n; j++) { const dx = S.x[j] - x, dy = S.y[j] - y, d2 = dx * dx + dy * dy + e2, w = G * S.m[j] / (d2 * Math.sqrt(d2));
        if (j === ic) { cxA += w * dx; cyA += w * dy; } else { gx += w * dx; gy += w * dy; } }
      const ac = Math.hypot(cxA, cyA), ag = Math.hypot(gx, gy);
      acc += (ac + ag > 0) ? ac / (ac + ag) : 0;
    }
    return { r, Dg: acc / DIAG.nAz };
  });
  const g = gravAccel(S), t = toyAccel(HP, S);
  const bins = DIAG.bins.map(([r0, r1]) => {
    let n = 0, M = 0, rm = 0, agr = 0, amr = 0, vphi = 0, vr = 0, vr2 = 0, vp2 = 0;
    for (let i = 0; i < S.n; i++) {
      if (i === ic) continue;
      const dx = S.x[i] - cx, dy = S.y[i] - cy, r = Math.hypot(dx, dy);
      if (!(r >= r0 && r < r1) || !(r > 0)) continue;
      const ex = dx / r, ey = dy / r, m = S.m[i], ux = S.vx[i] - cvx, uy = S.vy[i] - cvy;
      const vR = ux * ex + uy * ey, vP = -ux * ey + uy * ex;
      n++; M += m; rm += m * r; agr += m * (g.ax[i] * ex + g.ay[i] * ey); amr += m * (t.ax[i] * ex + t.ay[i] * ey);
      vr += m * vR; vphi += m * vP; vr2 += m * vR * vR; vp2 += m * vP * vP;
    }
    if (!n) return { r0, r1, n: 0 };
    const mvr = vr / M, mvp = vphi / M;
    return { r0, r1, n, M, rbar: rm / M, aGr: agr / M, aMeshR: amr / M, vPhi: mvp, vR: mvr,
      sig2R: Math.max(0, vr2 / M - mvr * mvr), sig2Phi: Math.max(0, vp2 / M - mvp * mvp), Sigma: M / (Math.PI * (r1 * r1 - r0 * r0)) };
  });
  // η_mesh(符号つき・+ は外向き)と F_r の項(a_disp,r は隣の bin との差分 —— 端と空の bin は null)
  for (let k = 0; k < bins.length; k++) {
    const b = bins[k];
    if (!b.n) continue;
    b.eta = (Math.abs(b.aGr) > 0) ? b.aMeshR / Math.abs(b.aGr) : null;
    b.cen = b.vPhi * b.vPhi / b.rbar;
    const lo = bins[k - 1], hi = bins[k + 1];
    let dP = null;
    if (lo && hi && lo.n && hi.n) dP = (hi.Sigma * hi.sig2R - lo.Sigma * lo.sig2R) / (hi.rbar - lo.rbar);
    else if (hi && hi.n) dP = (hi.Sigma * hi.sig2R - b.Sigma * b.sig2R) / (hi.rbar - b.rbar);
    else if (lo && lo.n) dP = (b.Sigma * b.sig2R - lo.Sigma * lo.sig2R) / (b.rbar - lo.rbar);
    b.disp = (dP === null) ? null : -dP / b.Sigma - (b.sig2R - b.sig2Phi) / b.rbar;
    b.Fr = (b.disp === null) ? null : b.aGr + b.aMeshR + b.cen + b.disp;
    b.FrOverG = (b.Fr === null || !(Math.abs(b.aGr) > 0)) ? null : b.Fr / Math.abs(b.aGr);
  }
  return { Dg: dg, bins };
}

/** 1 標本(門の量 + 情報)。 */
export function measure(S, ic, Rret, M0other) {
  const cx = S.x[ic], cy = S.y[ic], cvx = S.vx[ic], cvy = S.vy[ic];
  let nan = 0; for (let i = 0; i < S.n; i++) if (!(Number.isFinite(S.x[i]) && Number.isFinite(S.y[i]) && Number.isFinite(S.vx[i]) && Number.isFinite(S.vy[i]))) nan++;
  const rs = [];
  let Min = 0, a = 0, b = 0, c = 0, w = 0, sP = 0, sR = 0, Mv = 0;
  for (let i = 0; i < S.n; i++) {
    if (i === ic) continue;
    const dx = S.x[i] - cx, dy = S.y[i] - cy, r = Math.hypot(dx, dy), m = S.m[i];
    rs.push({ r, m });
    if (r <= Rret) {
      Min += m;
      if (r > 0) { a += m * dx * dx / (r * r); b += m * dx * dy / (r * r); c += m * dy * dy / (r * r); w += m;
        const ux = S.vx[i] - cvx, uy = S.vy[i] - cvy; sR += m * (ux * dx + uy * dy) / r; sP += m * (-ux * dy + uy * dx) / r; Mv += m; }
    }
  }
  rs.sort((p, q) => p.r - q.r);
  let Mo = 0; for (const z of rs) Mo += z.m;
  let acc = 0, rh = null; for (const z of rs) { acc += z.m; if (acc >= 0.5 * Mo) { rh = z.r; break; } }
  const C = S.capture;
  const captured = C ? C.M : 0;
  const axis = w > 0 ? E283.axisRatio2(a / w, b / w, c / w) : null;
  let sig2 = 0;
  if (Mv > 0) { const mR = sR / Mv, mP = sP / Mv;
    for (let i = 0; i < S.n; i++) { if (i === ic) continue; const dx = S.x[i] - cx, dy = S.y[i] - cy, r = Math.hypot(dx, dy); if (!(r > 0) || r > Rret) continue;
      const ux = S.vx[i] - cvx, uy = S.vy[i] - cvy, vr = (ux * dx + uy * dy) / r, vp = (-ux * dy + uy * dx) / r; sig2 += S.m[i] * ((vr - mR) ** 2 + (vp - mP) ** 2); }
    sig2 /= 2 * Mv; }
  let Px = 0, Py = 0; for (let i = 0; i < S.n; i++) { Px += S.m[i] * S.vx[i]; Py += S.m[i] * S.vy[i]; }
  const Jc = 0.5 * S.m[ic] * S.R[ic] * S.R[ic] * S.spin[ic];
  return { t: S.t, nan, n: S.n, retention: (Min + captured) / M0other, rh, axis, vRot: Mv > 0 ? sP / Mv : null, sigma: Math.sqrt(sig2),
    vOverSigma: (Mv > 0 && sig2 > 0) ? Math.abs(sP / Mv) / Math.sqrt(sig2) : null,
    center: { m: S.m[ic], spin: S.spin[ic], Jspin: Jc, R: S.R[ic], x: cx, y: cy, vx: cvx, vy: cvy, chi: S.params.cLight * Jc / (S.params.G * S.m[ic] ** 2) },
    toyEclose: S.geoToyE + S.geoToyEmesh, stop: (S.geoToyStop === undefined) ? null : S.geoToyStop,
    P: [Px, Py], Pmesh: [S.geoToyMeshPx, S.geoToyMeshPy], clampV: S.clampVN || 0, clampS: S.clampSN || 0,
    cap: C ? { n: C.nCap, cand: C.nCand, refBound: C.nRefBound, refEnergy: C.nRefEnergy, refSpinCap: C.nRefSpinCap, M: C.M, Eself: C.Eself, Q: C.Q, Jorb: C.Jorb } : null };
}

/** 門の判定(窓の標本だけ —— QA が正本の標本から作り直す純関数)。 */
export function gateEval(samples, win, extra) {
  const W = samples.filter((z) => z.t >= win[0] - 1e-9 && z.t <= win[1] + 1e-9);
  const pass = {}, worst = {};
  if (!W.length || extra.notQuiet) {
    return { nWindow: W.length, worst, pass: { quiet: false }, failed: ['notQuiet'], verdict: '未達' };
  }
  const ref = W[0];
  worst.nan = Math.max(...samples.map((z) => z.nan)); pass.nan = worst.nan <= GATES.nanMax;
  worst.retention = Math.min(...W.map((z) => z.retention)); pass.retention = worst.retention >= GATES.retentionMin;
  worst.rhRelChange = Math.max(...W.map((z) => Math.abs(z.rh / ref.rh - 1))); pass.rh = worst.rhRelChange <= GATES.halfMassRelChangeMax;
  worst.axis = Math.min(...W.map((z) => z.axis)); pass.axis = worst.axis >= GATES.axisRatioMin;
  worst.toyEclose = Math.max(...samples.map((z) => Math.abs(z.toyEclose))); pass.toyEclose = worst.toyEclose <= GATES.toyEnergyCloseAbsMax;
  const last = samples[samples.length - 1];
  worst.clamp = last.clampV + last.clampS; pass.clamp = worst.clamp <= GATES.clampMax;
  worst.ledgerRel = extra.ledgerRel; pass.ledger = extra.ledgerRel <= GATES.ledgerRelMax && extra.qMin >= 0;
  pass.stop = samples.every((z) => z.stop === null);
  const failed = Object.keys(pass).filter((k) => pass[k] === false);
  return { nWindow: W.length, tRef: ref.t, worst, pass, failed, verdict: failed.length === 0 ? '形状達成' : '未達' };
}
/** 捕獲の帳簿の残差(捕獲ごとの格納残差の相対の最大・Q の最小・Ω′ の符号)。 */
export function ledgerSummary(log) {
  let rP = 0, rL = 0, rE = 0, qMin = Infinity, nUp = 0, nDown = 0;
  for (const z of log) {
    rP = Math.max(rP, z.scP > 0 ? Math.max(Math.abs(z.ePx), Math.abs(z.ePy)) / z.scP : 0);
    rL = Math.max(rL, z.scL > 0 ? Math.abs(z.eL) / z.scL : 0);
    rE = Math.max(rE, z.scE > 0 ? Math.abs(z.eE) / z.scE : 0);
    qMin = Math.min(qMin, z.Q);
    if (Math.abs(z.spin1) > Math.abs(z.spin0)) nUp++; else if (Math.abs(z.spin1) < Math.abs(z.spin0)) nDown++;
  }
  return { n: log.length, relP: rP, relL: rL, relE: rE, ledgerRel: Math.max(rP, rL, rE), qMin: log.length ? qMin : 0, nSpinUp: nUp, nSpinDown: nDown };
}

/** 1 走行(合体が止むまで → 窓 → 摂動の復元)。 */
export function runOne(HP, spec) {
  const t0 = Date.now();
  const { S, preset } = buildSpec(HP, spec, spec.bodyR !== undefined ? { bodyR: spec.bodyR } : {});
  const D = Math.hypot(preset.bodies[1].cx, preset.bodies[1].cy);
  const Tdyn = tdynOf(S, D), Rret = GATES.retentionRadiusOverD * D;
  let M0other = 0; for (let i = 1; i < S.n; i++) M0other += S.m[i];
  const stepsPer = Math.round(GATES.window.sampleEveryDyn * Tdyn / DT);
  const need = GATES.window.afterQuietDyn + GATES.window.lenDyn;
  const samples = [measure(S, S.capture.i, Rret, M0other)], diags = [{ t: 0, d: diagOf(HP, S, S.capture.i) }];
  let k = 0, tLast = 0, nCapPrev = 0, notQuiet = false;
  for (;;) {
    S.step(DT); k++;
    if (S.capture.nCap !== nCapPrev) { nCapPrev = S.capture.nCap; tLast = S.t; }
    if (k % stepsPer === 0) { samples.push(measure(S, S.capture.i, Rret, M0other)); diags.push({ t: S.t, d: diagOf(HP, S, S.capture.i) }); }
    if (k % stepsPer === 0 && S.t >= tLast + need * Tdyn - 1e-9) break;
    if (S.t >= GATES.window.maxDyn * Tdyn) { notQuiet = S.t < tLast + need * Tdyn; break; }
  }
  const win = [tLast + GATES.window.afterQuietDyn * Tdyn, tLast + need * Tdyn];
  const L = ledgerSummary(S.capture.log);
  const gates = gateEval(samples, win, { notQuiet, ledgerRel: L.ledgerRel, qMin: L.qMin });
  const kEnd = k, stateEnd = []; for (let i = 0; i < S.n; i++) stateEnd.push(S.x[i], S.y[i]);
  const wallMain = (Date.now() - t0) / 1000;
  const capLog = S.capture.log.map((z) => ({ t: z.t, id: z.id, d: z.d, mJ: z.mJ, Krel: z.Krel, Upair: z.Upair, dU3: z.dU3, Jc: z.Jc, Jj: z.Jj, Jorb: z.Jorb, Jesc: z.Jesc, Jrad: z.Jrad, Jn: z.Jn,
    In: z.In, spin0: z.spin0, spin1: z.spin1, Ks0: z.Ks0, Ks1: z.Ks1, Q: z.Q, eM: z.eM, ePx: z.ePx, ePy: z.ePy, eL: z.eL, eE: z.eE, scP: z.scP, scL: z.scL, scE: z.scE }));
  // 摂動後の復元(無摂動の続き → 決定論の再走で窓の終わりの状態を作り直して摂動)
  const lenP = Math.round(PERTURB.lenDyn / PERTURB.sampleEveryDyn), spP = stepsPer;
  const rhRef = [], rhPert = [];
  const rhOf = (Q) => measure(Q, Q.capture.i, Rret, M0other).rh;
  rhRef.push(rhOf(S));
  for (let s = 1; s <= lenP; s++) { for (let q = 0; q < spP; q++) S.step(DT); rhRef.push(rhOf(S)); }
  const { S: S2 } = buildSpec(HP, spec, spec.bodyR !== undefined ? { bodyR: spec.bodyR } : {});
  for (let q = 0; q < kEnd; q++) S2.step(DT);
  let replaySame = S2.n === stateEnd.length / 2; if (replaySame) for (let i = 0; i < S2.n; i++) if (!Object.is(S2.x[i], stateEnd[2 * i]) || !Object.is(S2.y[i], stateEnd[2 * i + 1])) { replaySame = false; break; }
  const ic = S2.capture.i, cx = S2.x[ic], cy = S2.y[ic];
  for (let i = 0; i < S2.n; i++) { if (i === ic) continue; S2.x[i] = cx + PERTURB.scale * (S2.x[i] - cx); S2.y[i] = cy + PERTURB.scale * (S2.y[i] - cy); }
  rhPert.push(rhOf(S2));
  for (let s = 1; s <= lenP; s++) { for (let q = 0; q < spP; q++) S2.step(DT); rhPert.push(rhOf(S2)); }
  const delta = rhPert.map((v, i) => v / rhRef[i] - 1);
  const lastN = Math.round(1 / PERTURB.sampleEveryDyn);
  const tail = delta.slice(-lastN).map(Math.abs), tailMean = tail.reduce((a, b) => a + b, 0) / tail.length;
  const restore = { replayBitSame: replaySame, delta, delta0: delta[0], tailMeanAbs: tailMean, restored: tailMean <= 0.5 * Math.abs(delta[0]) };
  const pick = (t) => diags.reduce((best, z) => (Math.abs(z.t - t) < Math.abs(best.t - t) ? z : best), diags[0]);
  return { key: spec.key, orbit: spec.orbit, seedIdx: spec.seed, seed: SEEDS[spec.seed], bodyR: spec.bodyR === undefined ? null : spec.bodyR, info: !!spec.info,
    D, Tdyn, Rret, M0other, stepsPerSample: stepsPer, steps: kEnd, tLast, notQuiet, window: win,
    samples, diag: { t0: diags[0], winStart: pick(win[0]), winEnd: pick(win[1]) },
    capture: { summary: L, counts: samples[samples.length - 1].cap, log: capLog, logTrim: S.capture.logTrim },
    gates, restore, wallSec: wallMain, spentSec: (Date.now() - t0) / 1000 };   // wallSec = 本走行・spentSec = 摂動の走行を含む全体(安定 hash の除外語彙 STABLE_RUNTIME_KEYS)
}

/** 負の対照(エンジンの捕獲関数を直接呼ぶ)—— 中心 + 1 体を捕獲半径の内側に置いた最小の宇宙。 */
export function negativeControls(HP) {
  const base = byId(HP, PRESET);
  const mk = (center, part) => { const p = clone(base); p.bodies = [Object.assign({ type: 'single', m: 25, x: 0, y: 0, vx: 0, vy: 0, spin: 12, pinned: false, radius: 0.01 }, center),
    Object.assign({ type: 'single', m: 0.425, x: -1, y: 0, vx: 0, vy: 0, spin: 0, pinned: false, radius: 0.01 }, part)];
    const v = HP.validatePreset(p); if (!v.ok) throw new Error(v.errors.join('/')); HP.sim.build(v.preset); return HP.sim; };
  const Jtot = (S) => { let L = 0; for (let i = 0; i < S.n; i++) L += S.m[i] * (S.x[i] * S.vy[i] - S.y[i] * S.vx[i]) + 0.5 * S.m[i] * S.R[i] * S.R[i] * S.spin[i]; return L; };
  const one = (key, center, part) => {
    const S = mk(center, part); const J0 = Jtot(S), s0 = S.spin[0], n0 = S.n;
    const got = HP.dfmCenterCaptureStep(S);
    const C = S.capture, row = C.log[C.log.length - 1] || null;
    return { key, captured: got, n0, n1: S.n, spin0: s0, spin1: S.spin[0], Jtot0: J0, Jtot1: Jtot(S), dJtot: Jtot(S) - J0,
      Jorb: row ? row.Jorb : null, Q: row ? row.Q : null, refEnergy: C.nRefEnergy, refSpinCap: C.nRefSpinCap, refBound: C.nRefBound };
  };
  const cases = [
    one('headOnNoSpin', { spin: 0 }, { x: -1, y: 0, vx: 2, vy: 0 }),
    one('retrograde', { spin: 12 }, { x: -1.4, y: 0, vx: 0, vy: 0.0342 }),
    one('prograde', { spin: 12 }, { x: -1.4, y: 0, vx: 5, vy: -0.0342 }),
    one('energyShort', { spin: 12 }, { x: -1.4, y: 0, vx: 0, vy: -3 }),
    one('spinCap', { spin: 12 }, { x: -1.4, y: 0, vx: 5, vy: -0.2 }),
    one('unbound', { spin: 12 }, { x: -1.4, y: 0, vx: 20, vy: 0 })];
  const by = Object.fromEntries(cases.map((z) => [z.key, z]));
  const checks = {
    headOnNoJ: by.headOnNoSpin.captured === 1 && by.headOnNoSpin.spin1 === 0 && by.headOnNoSpin.Jorb === 0 && by.headOnNoSpin.Jtot1 === 0,
    retroLowersSpin: by.retrograde.captured === 1 && Math.abs(by.retrograde.spin1) < Math.abs(by.retrograde.spin0) && by.retrograde.Jorb < 0,
    proRaisesSpin: by.prograde.captured === 1 && by.prograde.spin1 > by.prograde.spin0,
    energyRefused: by.energyShort.captured === 0 && by.energyShort.refEnergy === 1,
    spinCapRefused: by.spinCap.captured === 0 && by.spinCap.refSpinCap === 1,
    unboundRefused: by.unbound.captured === 0 && by.unbound.refBound === 1,
  };
  return { cases, checks, ok: Object.values(checks).every(Boolean) };
}

/** (A) 宣言の照合: 💮 の台帳の写し・自由中心・捕獲の宣言・トイ加速度の写しとエンジンの 1 步の照合。 */
export function declarationCheck(HP) {
  const P = HP.validatePreset(clone(byId(HP, PRESET))), R = HP.validatePreset(clone(byId(HP, REF_PRESET)));
  if (!P.ok || !R.ok) throw new Error('validatePreset');
  const p = P.preset, r = R.preset, ph = p.physics, rh = r.physics;
  const same = {};
  for (const k of ['G', 'cLight', 'geoPN', 'kFrame', 'softening', 'D0', 'q', 'frameWeight', 'contactMode', 'timeScale', 'stateCarry']) same[k] = ph[k] === rh[k];
  // 第295便b(原仮定者の裁定(第85報)・R154): 写しの元 💮 は geoPN=4(空間メッシュ —— 旧法則版の置き場)へ移住した(力学は 3 とビット同一)。凍結の写し(3)との差は番号の付け替えだけ
  if (!same.geoPN && ph.geoPN === 3 && rh.geoPN === 4) same.geoPN = true;
  for (const k of ['lawVersion', 'centerSpin', 'D0', 'dragR', 'gravity', 'inertia']) same['spaceMesh.' + k] = ph.spaceMesh[k] === rh.spaceMesh[k];
  const rStar = r.bodies.find((b) => b.type === 'disk' && b.lightSweep !== 1), rDR = r.bodies.find((b) => b.type === 'disk' && b.lightSweep === 1);
  const disks = p.bodies.filter((b) => b.type === 'disk');
  same.mStar = disks.filter((b) => b.lightSweep !== 1).every((b) => b.mMin === rStar.mMin && b.mMax === rStar.mMax);
  same.mDR = disks.filter((b) => b.lightSweep === 1).every((b) => b.mMin === rDR.mMin && b.mMax === rDR.mMax);
  same.centerM = p.bodies[0].m === r.bodies[0].m; same.centerSpin = p.bodies[0].spin === r.bodies[0].spin; same.centerR = p.bodies[0].radius === r.bodies[0].radius;
  const nStar = disks.filter((b) => b.lightSweep !== 1).reduce((a, b) => a + b.n, 0), nDR = disks.filter((b) => b.lightSweep === 1).reduce((a, b) => a + b.n, 0);
  // トイ加速度の写し ↔ エンジン(微小な dt の 1 步: Δv/dt − a_E4 ≈ a_toy)
  const { S } = buildSpec(HP, { orbit: 'pro', seed: 0 });
  const tA = toyAccel(HP, S), gA = gravAccel(S);
  const v0x = Float64Array.from(S.vx), v0y = Float64Array.from(S.vy), h = 1e-7;
  S.step(h);
  let worst = 0, scale = 0;
  for (let i = 0; i < S.n; i++) scale = Math.max(scale, Math.hypot(tA.ax[i], tA.ay[i]));
  for (let i = 0; i < S.n; i++) { const ex = (S.vx[i] - v0x[i]) / h - gA.ax[i] - tA.ax[i], ey = (S.vy[i] - v0y[i]) / h - gA.ay[i] - tA.ay[i]; worst = Math.max(worst, Math.hypot(ex, ey)); }
  return { preset: PRESET, ref: REF_PRESET, sampleClass: p.sampleClass, scaleExp: p.scaleExp, pinned: p.bodies[0].pinned === true, capture: p.centerCapture,
    physicsSameAsRef: same, allSame: Object.values(same).every(Boolean), nStar, nDR, nTotal: 1 + nStar + nDR, countRatio: nDR / nStar,
    toyAllowDrag: ph.spaceMesh.toyAllowDrag === undefined, massPrecision: ph.massPrecision,
    toyReplica: { h, maxAbsDiff: worst, toyScale: scale, relToToy: scale > 0 ? worst / scale : null } };
}

/** 半径の対照(同じ初期状態): 捕獲なしで本体半径 0.01 と 1.5 の状態の差の数(RADIUS_STEPS 步)。 */
export function radiusControl(HP) {
  const stateOf = (S) => { const a = []; for (let i = 0; i < S.n; i++) a.push(S.x[i], S.y[i], S.vx[i], S.vy[i]); return a; };
  const nd = (a, b) => { let n = 0; for (let i = 0; i < Math.max(a.length, b.length); i++) if (!Object.is(a[i], b[i])) n++; return n; };
  const run = (change) => { const { S } = buildSpec(HP, { orbit: 'pro', seed: 0 }, change); const s0 = stateOf(S); for (let k = 0; k < RADIUS_STEPS; k++) S.step(DT); return { s0, s1: stateOf(S), R0: S.R[0] }; };
  const A = run({ capture: false }), B = run({ capture: false, bodyR: 1.5 });
  return { steps: RADIUS_STEPS, n: A.s0.length, captureOff: { t0Diff: nd(A.s0, B.s0), endDiff: nd(A.s1, B.s1), R: [A.R0, B.R0] } };
}

/** 判定(宣言の規則)。 */
export function verdictOf(runs) {
  const dec = runs.filter((r) => r.orbit === 'pro' && !r.info);
  const nPass = dec.filter((r) => r.gates.verdict === '形状達成').length;
  return { nDeclared: dec.length, nPass, verdict: (dec.length === 3 && nPass === 3) ? '形状達成' : '未達' };
}
/** 「早いか」の並び(同じ門の閾値・同じ乱数種の数 —— 歩数と壁時計。窓の定義と N は違う)。 */
export function speedTable(runs) {
  const dec = runs.filter((r) => r.orbit === 'pro' && !r.info);
  return { growth: dec.map((r) => ({ key: r.key, steps: r.steps, wallSec: r.wallSec, verdict: r.gates.verdict, n0: r.samples[0].n })), jeans: JEANS_REF,
    growthSteps: dec.reduce((a, r) => a + r.steps, 0), jeansSteps: JEANS_REF.runs.reduce((a, r) => a + r.steps, 0),
    growthTotal: { wallSec: dec.reduce((a, r) => a + r.wallSec, 0) }, jeansTotal: { wallSec: JEANS_REF.runs.reduce((a, r) => a + r.wallSec, 0) },   // 壁時計の和(鍵 wallSec —— 安定 hash の除外語彙)
    growthPass: dec.filter((r) => r.gates.verdict === '形状達成').length, jeansPass: JEANS_REF.runs.filter((r) => r.verdict === '形状達成').length };
}

const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(3));
const e2 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toExponential(2));
/** PHYSICS〔第287便a〕の表の行(QA が正本から作り直して探す)。 */
export function docRows(J) {
  const out = { gates: GATE_TEXT.map((t) => '- ' + t), runs: [], dg: [], eta: [], fr: [] };
  for (const r of J.runs.concat(J.radiusRun ? [J.radiusRun] : [])) {
    const w = r.gates.worst || {}, c = r.capture.counts, L = r.capture.summary, z = r.samples[r.samples.length - 1].center;
    out.runs.push(`| ${r.key} | ${r.steps} | ${f3(r.tLast / r.Tdyn)} | ${c.n}/${c.refBound}/${c.refEnergy}/${c.refSpinCap} | ${f3(r.samples[0].center.m)} → ${f3(z.m)} | ${f3(r.samples[0].center.spin)} → ${f3(z.spin)} | ${e2(L.ledgerRel)} | ${f3(w.retention)} | ${f3(w.rhRelChange)} | ${f3(w.axis)} | ${r.restore.restored ? '復元' : '復元せず'}(${f3(r.restore.delta0)} → ${f3(r.restore.tailMeanAbs)}) | ${r.gates.verdict}${r.gates.failed.length ? '(' + r.gates.failed.join('・') + ')' : ''} |`);
    const dgs = (d) => d.d.Dg.map((q) => f3(q.Dg)).join('/');
    out.dg.push(`| ${r.key} | ${dgs(r.diag.t0)} | ${dgs(r.diag.winEnd)} |`);
    const et = (d) => d.d.bins.map((q) => (q.n ? (q.eta === null ? '—' : (q.eta >= 0 ? '+' : '') + q.eta.toFixed(3)) : '—')).join('/');
    out.eta.push(`| ${r.key} | ${et(r.diag.t0)} | ${et(r.diag.winEnd)} |`);
    const fr = (d) => d.d.bins.map((q) => (q.n && q.FrOverG !== null ? (q.FrOverG >= 0 ? '+' : '') + q.FrOverG.toFixed(2) : '—')).join('/');
    out.fr.push(`| ${r.key} | ${fr(r.diag.winEnd)} |`);
  }
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
  console.log('(A) ' + JSON.stringify({ allSame: decl.allSame, n: decl.nTotal, toyReplica: decl.toyReplica }));
  const neg = negativeControls(HP);
  console.log('(B) 負の対照 ' + JSON.stringify(neg.checks));
  const rad = radiusControl(HP);
  console.log('(C) 半径の対照(捕獲なし・同じ初期状態)' + JSON.stringify(rad.captureOff));
  const same286 = E286.sameInitSeparation(HP);
  console.log('(D) 💮 の同一初期状態 ' + JSON.stringify(same286.cases));
  const minimal = LG.selfTest();
  console.log('(E) 最小模型 ok=' + minimal.ok + ' worst ' + minimal.worstRel);
  const CODE = ['tests/exp-w287a-growth.mjs', 'tests/lib-w287a-growth.mjs', 'tests/exp-w286a-cluster.mjs', 'tests/exp-w285a-cluster.mjs', 'tests/exp-w284a-cluster.mjs', 'tests/exp-w283f-cluster.mjs',
    'tests/lib-w280b-emgrid.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  const meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第287便a', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, libVersion: LG.GROWTH_LIB_VERSION, loadErrors: errors.length,
    ruling: '原仮定者の裁定(第77報)④: 銀河の成長を考える —— 星団から銀河へと合体して成長する。中心天体の重力は支配的で、捉えられた天体は中心に落ちる。落ちてきた天体と合体すると質量を増しつつ自転を増し、引きずりが増して斥力となり、釣り合ったところで落ち着く(という流れで探した方が、初期値でいきなり釣り合わせるより早いのではないか)',
    reading: '統括の検証項目 R107(成長経路の原理コピー・帳簿・門を測る前に・D_g と符号つき η_mesh・F_r・摂動後の復元・半径の対照・負の対照 2 つ・走査器の同一初期状態化・対照の最小模型)・AN63/AN74',
    dt: DT, seeds: SEEDS,
    notClaim: ['星団が落ち着いた', '合体で自転が増えて斥力になった', '中心の引きずりが支配的になった', '形状が安定した', '銀河ができた', '観測一致を達成した', '新発見'] });
  Object.assign(meta, W281A_SCOPE, w281aStableInputs(ROOT, meta.inputs));
  const NW = Math.max(1, Number(process.env.W287A_WORKERS) || 2);
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
      console.log(`${r.key}: ${r.gates.verdict}${r.gates.failed.length ? '(' + r.gates.failed.join(',') + ')' : ''}・步 ${r.steps}・t_last/T_dyn ${f3(r.tLast / r.Tdyn)}・捕獲 ${c.n}(拒否 束縛 ${c.refBound}/供給 ${c.refEnergy}/上限 ${c.refSpinCap})・保持 ${f3(w.retention)}・r_h ${f3(w.rhRelChange)}・軸比 ${f3(w.axis)}・${r.wallSec.toFixed(0)} s`);
      res(); });
  });
  const lane = async () => { while (next < specs.length) { const i = next++; await runChild(i); } };
  await Promise.all(Array.from({ length: Math.min(NW, specs.length) }, lane));
  const runs = results.slice(0, RUNS.length), radiusRun = results[RUNS.length];
  const out = { meta, gates: Object.assign({}, GATES, { text: GATE_TEXT, declaredBeforeMeasure: true }), orbits: ORBITS, runSpecs: RUNS, radiusSpec: RADIUS_RUN,
    verdictRule: VERDICT_RULE, perturb: PERTURB, diagSpec: DIAG,
    preset: PRESET, declaration: decl, negativeControls: neg, radiusControl: rad, sameInit286: same286, minimal,
    runs, radiusRun, summary: verdictOf(runs), speed: speedTable(runs), elapsedS: (Date.now() - t0) / 1000 };
  out.verdict = out.summary.verdict;
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'growth-w287a.json'), JSON.stringify(out, null, 1) + '\n');
  console.log('→ tests/out/growth-w287a.json(' + out.elapsedS.toFixed(1) + ' s)・判定 ' + out.verdict);
}
