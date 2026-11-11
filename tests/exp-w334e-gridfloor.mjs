// 第334便e(原仮定者の回答(2026-11-11 —— AN638 = A「先に離散化の依存を下げる」・AN639 = A・AN640 = A「主列は W₀ = 0」・AN621「重みは m/r² が主・α = 1 も」)・
//   原仮定者の整理(2026-11-11)「土星の環と銀河の円盤について」・統括の検証項目 R326):
//   **銀河の離散化の床の器 —— NGC 3198 の恒星の円盤(第333便d と同じ作り方・同じ方位平均の質量分布の 4 族)の統合した並進の場 U を、星の点でない固定の受け手の格子で読み、
//   離散化(環の間隔 × 方位の数)・軟化・種・方位の位相を変えた誤差の幅を先に測る。「腕あり − 円」の差と幅の比・m = 2 の密度との対応・円盤の源の場の高さ z の列(偶奇・次数)**
//   (段 gridfloor-334e —— 正本 tests/out/gridfloor-w334e.json・lib tests/lib-w334e-gridfloor.mjs)。**診断だけ・運動学の対照だけ(相互作用の時間発展はしない)** ——
//   エンジン・内蔵の本・受理器・第329〜333便の lib と器の本文は変えない(第333便d の器の readFixture・ringsOf・partDisc を呼ぶ)。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w334e-gridfloor.mjs —— 第317便d の satan の型・領域の宣言なし)。入力は NGC 3198 の rotmod の写し(第329便b の fixture)だけ。1 プロセス。
//
// ■ 宣言(走行の前 —— PLAN。結果を見て変えない)
//   受け手の格子: 半径 4・8・12・16・20・24・28 kpc × 方位 24 点(φ_j = 2π(j + 0.4)/24 —— 面内・円軌道の星の格子と方位の間隔の 1 割より近づかない: 離散化の 9 組 × 位相 3 で最小 0.1)。
//   離散化の列: 環の間隔 1・0.5・0.25 kpc × 方位の数 24・48・96(9 組 —— 格子の受け手は O(受け手 × 源)なので間引かない。星の点の受け手は 5・10・20 kpc の案内中心の環の星だけ)。
//   主の離散化は最も細かい (0.25, 96)(点 11233)。細かい 4 組 = 間隔 ≤ 0.5 kpc × 方位 ≥ 48。
//   軟化: Plummer w = m (r² + ε²)^(−α/2)・ε = 0・0.05・0.1・0.25 kpc(主 0.1)。種: random の族 1〜5。方位の位相: 円盤の全体(星の格子と腕の向き)を 2πf/K 回す・f = 0・1/4・1/2(主 0)。
//   族: circ・random(ε 0.1・0.2 × 種 5)・kin(ε 0.1・0.2)・pattern(ε 0.1・0.2・Ω_p 10 km s⁻¹ kpc⁻¹)。組: α = 2・s_d 0(主 —— 場の読み W₀ = 0)・α = 1・s_d 0・α = 2・s_d = Ω(sync)。
//   **誤差の幅** = 同じ族・組・軟化・位相・半径で、離散化だけを変えた ⟨U_φ⟩(受け手の方位 24 点の平均)の(最大 − 最小)÷ |平均|(9 組 —— 「幅 9」/細かい 4 組 —— 「幅 4」)。
//   **目標**: 主の組・主の軟化 ε = 0.1 kpc・主の位相で、族 4(circ・random 種 1・kin・pattern —— ε 0.1)× 半径 7 の幅 9 ≤ 1%(届かなければ届かなかったと書く)。他の軟化も同じ物差しで表に。
//   **判定の比**: 「腕あり − 円」の差(主の離散化・同じ軟化と位相 —— random は種 5 の平均)÷ 幅(両方の族の幅 9 の大きい方 —— random は種の幅〔5 種の(最大 − 最小)÷ 平均〕とも比べ大きい方)> 3 を「幅を超える」。
//   高さ z の列: 受け手の格子を z = 0・±0.05・±0.1・±0.25・±0.5・±1 kpc に・源は circ の族(薄い円盤 z = 0 と、厚みを持たせた対照 —— 鉛直の密度 ∝ sech²(z/z₀)・z₀ = 0.3 kpc・種 1〜3)・
//   離散化 (0.25, 96) と (1, 24)・軟化 0 と 0.1 kpc。表だけ(高さの則の式は当てない)。
// ■ 言わないこと: 幅は宣言した格子と離散化の列の表・軟化は離散化の依存を下げる宣言の長さ(物理の厚みではない)・族の差は運動学の型の表(腕の形成・平坦な回転の機構・回転曲線の理由の同定に使わない)・
//   z の列は表だけ・`κ_epi` と κ_D は別の量・棒は notClaim・暗黒物質のハロー全体の説明へ広げない。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as L from './lib-w334e-gridfloor.mjs';
import * as N3 from './lib-w333d-noncirc.mjs';
import * as X333 from './exp-w333d-noncirc.mjs';
import * as GR from './lib-w329b-galrot.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w334e-gridfloor-1';
export const OUT_MAIN = 'tests/out/gridfloor-w334e.json';
export const FIXTURE = X333.FIXTURE;
export const TARGET = 'tests/lib-w334e-gridfloor.mjs';   // html を読まない器の来歴の対象(純関数 —— 第317便d の satan の型)
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const KPC = GR.KPC_M;
const median = (a) => { const q = a.filter(fin).slice().sort((x, y) => x - y); if (!q.length) return null; const h = q.length >> 1; return q.length % 2 ? q[h] : 0.5 * (q[h - 1] + q[h]); };
export const NOT_CLAIM = Object.freeze(['誤差の幅は宣言した受け手の格子と離散化の列の表 —— 連続の円盤の値の同定ではない', '軟化は離散化の依存を下げるための宣言の長さ(物理の厚みではない)',
  '族の差は宣言した運動学の型(一次の周転円 —— 第333便d)の表 —— 腕の形成・平坦な回転の機構・回転曲線の理由の同定に使わない', '相互作用の時間発展はしない',
  '高さ z の列は表だけ(高さの則の式を当てない)', '主列は W₀ = 0(背景慣性決定力と自己の重みを分母に入れない —— AN640)', 'κ_epi と κ_D は別の量', '棒・暗黒物質のハロー全体は扱わない(notClaim)']);
/** 器の宣言(走行の前に置く —— 結果を見て変えない) */
export const PLAN = Object.freeze({
  recRadiiKpc: Object.freeze([4, 8, 12, 16, 20, 24, 28]), nAz: 24, azOffFrac: 0.4, ringFromKpc: 1,   // ringFromKpc は第333便d の PLAN と同じ(端の記録だけ)
  disc: Object.freeze([[1, 24], [1, 48], [1, 96], [0.5, 24], [0.5, 48], [0.5, 96], [0.25, 24], [0.25, 48], [0.25, 96]].map((q) => Object.freeze(q))),
  mainDisc: Object.freeze([0.25, 96]), fineDisc: Object.freeze([[0.5, 48], [0.5, 96], [0.25, 48], [0.25, 96]].map((q) => Object.freeze(q))),
  softKpc: Object.freeze([0, 0.05, 0.1, 0.25]), mainSoftKpc: 0.1, softForm: 'plummer',
  phases: Object.freeze([0, 0.25, 0.5]), mainPhase: 0,
  seeds: Object.freeze([1, 2, 3, 4, 5]), amps: Object.freeze([0.1, 0.2]), mainAmp: 0.1, omegaPKms: 10,
  W0: 0,
  bandDef: '同じ族・組・軟化・位相・半径で離散化だけを変えた ⟨U_φ⟩ の(最大 − 最小)÷ |平均|', target: 0.01, exceedRatio: 3,
  zKpc: Object.freeze([0, 0.05, -0.05, 0.1, -0.1, 0.25, -0.25, 0.5, -0.5, 1, -1]), thickZ0Kpc: 0.3, thickSeeds: Object.freeze([1, 2, 3]), thickSeedBase: 1000,
  zDisc: Object.freeze([Object.freeze([0.25, 96]), Object.freeze([1, 24])]), zSoftKpc: Object.freeze([0, 0.1]),
  starRingsKpc: Object.freeze([5, 10, 20]), m2HalfWidthKpc: 0.5, m2EdgeRule: 'between',   // 帯の端は環の間(R ± (0.5 + ΔR/2) —— 端が環の上に乗ると丸めで環が割れる)
});
const dkey = (q) => q[0] + 'x' + q[1];
const sameQ = (a, b) => a[0] === b[0] && a[1] === b[1];

/* ───────── 族の宣言 ───────── */
export function familyConfigs() {
  const out = [{ key: 'circ', family: 'circ', amp: 0 }];
  for (const amp of PLAN.amps) {
    for (const seed of PLAN.seeds) out.push({ key: 'random|' + amp + '|s' + seed, family: 'random', amp, seed });
    out.push({ key: 'kin|' + amp, family: 'kin', amp });
    out.push({ key: 'pattern|' + amp + '|' + PLAN.omegaPKms, family: 'pattern', amp, OmegaPKms: PLAN.omegaPKms });
  }
  return out;
}
/** 目標と幅の表に出す 4 族(ε 0.1 —— random は種 1) */
export const MAIN_FAMS = Object.freeze(['circ', 'random|0.1|s1', 'kin|0.1', 'pattern|0.1|10']);
const diskOf = (RG, cfg, spin) => N3.buildDisk({ rings: RG.rings, K: RG.K, family: cfg.family, amp: cfg.amp, seed: cfg.seed || 0, OmegaP: cfg.OmegaPKms ? cfg.OmegaPKms * GR.KMS_KPC_RADS : null,
  R0: N3.DECL.armR0Kpc * KPC, center: RG.center, spin });
const ringsCache = new Map();
function ringsAt(FX, q) { const k = dkey(q); if (!ringsCache.has(k)) ringsCache.set(k, Object.assign(X333.ringsOf(FX, q[0]), { dR: q[0], K: q[1] })); return ringsCache.get(k); }

/** 受け手の格子の環ごとの平均(U_φ・U_R・|U_z| の最大・U_φ の m = 2 ÷ |平均| と主軸)—— G は gridField の戻り値・rec は receiverGrid の列 */
function ringStats(G, rec, nR, e, c) {
  const out = { uPhi: [], uR: [], uzMax: [], a2: [], ph2: [], minDistKpc: [] };
  for (let i = 0; i < nR; i++) {
    const ks = rec.map((r, k) => (r.ri === i ? k : -1)).filter((k) => k >= 0), cy = ks.map((k) => L.cyl(rec[k].p, G.out[k][e][c]));
    const mP = cy.reduce((s, q) => s + q.phi, 0) / cy.length, F = N3.fourierM(ks.map((k) => rec[k].phi), cy.map((q) => q.phi - mP), 2);
    out.uPhi.push(mP); out.uR.push(cy.reduce((s, q) => s + q.R, 0) / cy.length); out.uzMax.push(Math.max(...cy.map((q) => Math.abs(q.z))));
    out.a2.push(2 * Math.hypot(F.c, F.s) / cy.length / Math.abs(mP)); out.ph2.push(F.phase); out.minDistKpc.push(Math.min(...ks.map((k) => G.minDist[k])) / KPC);
  }
  return out;
}

/* ───────── G 格子の受け手 × 離散化 × 族 × 位相 × 軟化 × 組 ───────── */
export function partGrid(FX) {
  const rec = L.receiverGrid(PLAN.recRadiiKpc.map((R) => R * KPC), PLAN.nAz, PLAN.azOffFrac, 0), eps = PLAN.softKpc.map((e) => e * KPC), nR = PLAN.recRadiiKpc.length;
  const vals = {}, m2 = {}, gap = { minFrac: Infinity }, discInfo = {};
  for (const q of PLAN.disc) {
    const RG = ringsAt(FX, q), dk = dkey(q); vals[dk] = {};
    // 離散化の列の円盤の量(環の質量の和・内と外の端 —— 間隔 ΔR の環は R_k ± ΔR/2 を代表する)
    discInfo[dk] = { n: RG.rings.length * q[1] + 1, MdiskMsun: RG.rings.reduce((s, r) => s + r.m, 0) / GR.MSUN_KG, innerEdgeKpc: PLAN.ringFromKpc - q[0] / 2, outerEdgeKpc: RG.rings[RG.rings.length - 1].RKpc + q[0] / 2 };
    for (const ph of PLAN.phases) gap.minFrac = Math.min(gap.minFrac, L.azGapFrac({ nAz: PLAN.nAz, offFrac: PLAN.azOffFrac, K: q[1], phaseFrac: ph }));
    for (const cfg of familyConfigs()) {
      const Dn = diskOf(RG, cfg, 'none'), Ds = diskOf(RG, cfg, 'sync'), rec0 = { n: Dn.pts.length, dropped: Dn.dropped };
      vals[dk][cfg.key] = rec0;
      for (const ph of PLAN.phases) {
        const ang = 2 * Math.PI * ph / q[1], S = L.packSources(L.rotateDisk(Dn.pts, ang), L.rotateDisk(Ds.pts, ang)), G = L.gridField({ rec: rec.map((r) => r.p), S, epsList: eps, W0: PLAN.W0 });
        rec0['f' + ph] = PLAN.softKpc.map((_, e) => L.COMBOS.map((_, c) => { const st = ringStats(G, rec, nR, e, c); return sameQ(q, PLAN.mainDisc) && ph === PLAN.mainPhase ? st : { uPhi: st.uPhi, minDistKpc: c === 0 ? st.minDistKpc : undefined }; }));
      }
      if (sameQ(q, PLAN.mainDisc)) {   // m = 2 の密度(帯 R ± (0.5 + ΔR/2) kpc —— 端は環の間・第333便d の annulusKinematics を呼ぶ・位相 0)
        const hw = PLAN.m2HalfWidthKpc + q[0] / 2;
        m2[cfg.key] = PLAN.recRadiiKpc.map((R) => { const a = N3.annulusKinematics(Dn.pts.slice(1), [(R - hw) * KPC, (R + hw) * KPC])[0]; return { RKpc: R, n: a.n, A2: a.n ? a.A2 : null, phase2: a.n ? a.phase2 : null }; });
      }
    }
  }
  const RG0 = ringsAt(FX, PLAN.mainDisc), vObs = PLAN.recRadiiKpc.map((R) => RG0.rings.find((r) => Math.abs(r.RKpc - R) < 1e-9).vObs);
  return { receivers: rec.length, gapMinFrac: gap.minFrac, discInfo, vObsAtRec: vObs, vals, m2 };
}

/* ───────── B 幅の表と分解 ───────── */
const getU = (GP, q, fam, ph, e, c) => GP.vals[dkey(q)][fam]['f' + ph][e][c].uPhi;
export function partBands(GP) {
  const nR = PLAN.recRadiiKpc.length, fams = familyConfigs().map((f) => f.key), out = { rows: [], decomp: [], target: null };
  const bandAt = (qs, fam, ph, e, c) => PLAN.recRadiiKpc.map((_, i) => L.bandOf(qs.map((q) => getU(GP, q, fam, ph, e, c)[i])));
  for (const fam of fams) for (let c = 0; c < L.COMBOS.length; c++) for (let e = 0; e < PLAN.softKpc.length; e++) {
    const b9 = bandAt(PLAN.disc, fam, PLAN.mainPhase, e, c), b4 = bandAt(PLAN.fineDisc, fam, PLAN.mainPhase, e, c);
    const bK = bandAt(PLAN.disc.filter((q) => q[0] === PLAN.mainDisc[0]), fam, PLAN.mainPhase, e, c), bdR = bandAt(PLAN.disc.filter((q) => q[1] === PLAN.mainDisc[1]), fam, PLAN.mainPhase, e, c);
    const bPh = (q) => PLAN.recRadiiKpc.map((_, i) => L.bandOf(PLAN.phases.map((ph) => getU(GP, q, fam, ph, e, c)[i])));
    const phMain = bPh(PLAN.mainDisc), phCoarse = bPh(PLAN.disc[0]), phAll = PLAN.recRadiiKpc.map((_, i) => Math.max(...PLAN.disc.map((q) => bPh(q)[i])));
    const soft = PLAN.recRadiiKpc.map((_, i) => L.bandOf(PLAN.softKpc.map((_, ee) => getU(GP, PLAN.mainDisc, fam, PLAN.mainPhase, ee, c)[i])));
    out.rows.push({ fam, combo: L.COMBOS[c], softKpc: PLAN.softKpc[e], band9: b9, band4: b4, bandK: bK, bandDR: bdR, phaseMain: phMain, phaseCoarse: phCoarse, phaseMax: phAll, softBand: soft,
      max9: Math.max(...b9), med9: median(b9), max4: Math.max(...b4) });
  }
  // 種の幅(random —— 同じ ε・離散化・軟化・位相・組で 5 種)
  out.seed = [];
  for (const amp of PLAN.amps) for (let c = 0; c < L.COMBOS.length; c++) for (let e = 0; e < PLAN.softKpc.length; e++) {
    const at = (q) => PLAN.recRadiiKpc.map((_, i) => L.bandOf(PLAN.seeds.map((s) => getU(GP, q, 'random|' + amp + '|s' + s, PLAN.mainPhase, e, c)[i])));
    out.seed.push({ amp, combo: L.COMBOS[c], softKpc: PLAN.softKpc[e], main: at(PLAN.mainDisc), coarse: at(PLAN.disc[0]) });
  }
  const R0 = out.rows.filter((r) => r.combo === L.COMBOS[0] && r.softKpc === PLAN.mainSoftKpc && MAIN_FAMS.includes(r.fam));
  out.target = { value: PLAN.target, maxBand9: Math.max(...R0.map((r) => r.max9)), reached: R0.every((r) => r.max9 <= PLAN.target), perSoft: PLAN.softKpc.map((s) => {
    const q = out.rows.filter((r) => r.combo === L.COMBOS[0] && r.softKpc === s && MAIN_FAMS.includes(r.fam)); return { softKpc: s, maxBand9: Math.max(...q.map((r) => r.max9)), maxBand4: Math.max(...q.map((r) => r.max4)), reached9: q.every((r) => r.max9 <= PLAN.target), reached4: q.every((r) => r.max4 <= PLAN.target) }; }) };
  return out;
}

/* ───────── A 「腕あり − 円」の差と幅の比・m = 2 ───────── */
export function partArms(GP, B) {
  const rows = [], bandOfRow = (fam, c, e) => B.rows.find((r) => r.fam === fam && r.combo === L.COMBOS[c] && r.softKpc === PLAN.softKpc[e]).band9;
  for (const amp of PLAN.amps) for (let c = 0; c < L.COMBOS.length; c++) for (let e = 0; e < PLAN.softKpc.length; e++) {
    const C0 = getU(GP, PLAN.mainDisc, 'circ', PLAN.mainPhase, e, c), bC = bandOfRow('circ', c, e);
    const seedB = B.seed.find((s) => s.amp === amp && s.combo === L.COMBOS[c] && s.softKpc === PLAN.softKpc[e]).main;
    const rnd = PLAN.recRadiiKpc.map((_, i) => PLAN.seeds.reduce((s, sd) => s + getU(GP, PLAN.mainDisc, 'random|' + amp + '|s' + sd, PLAN.mainPhase, e, c)[i], 0) / PLAN.seeds.length);
    const rndBand = PLAN.recRadiiKpc.map((_, i) => Math.max(...PLAN.seeds.map((sd) => bandOfRow('random|' + amp + '|s' + sd, c, e)[i])));
    const one = (nm, U, bF, extra) => {
      const diff = U.map((x, i) => (x - C0[i]) / C0[i]), band = U.map((_, i) => Math.max(bF[i], bC[i], extra ? extra[i] : 0)), ratio = diff.map((d, i) => Math.abs(d) / band[i]);
      return { arm: nm, diff, band, ratio, exceed: ratio.filter((x) => x > PLAN.exceedRatio).length, medDiff: median(diff), maxRatio: Math.max(...ratio) };
    };
    rows.push({ amp, combo: L.COMBOS[c], softKpc: PLAN.softKpc[e], arms: [
      one('kin', getU(GP, PLAN.mainDisc, 'kin|' + amp, PLAN.mainPhase, e, c), bandOfRow('kin|' + amp, c, e)),
      one('pattern', getU(GP, PLAN.mainDisc, 'pattern|' + amp + '|' + PLAN.omegaPKms, PLAN.mainPhase, e, c), bandOfRow('pattern|' + amp + '|' + PLAN.omegaPKms, c, e)),
      one('random', rnd, rndBand, seedB)] });
  }
  // m = 2: 密度(主の離散化・位相 0)と U_φ の m = 2(受け手 24 点 —— 主の組・主の軟化)
  const e0 = PLAN.softKpc.indexOf(PLAN.mainSoftKpc), m2 = [];
  for (const fam of ['circ', 'random|0.1|s1', 'kin|0.1', 'pattern|0.1|10', 'random|0.2|s1', 'kin|0.2', 'pattern|0.2|10']) {
    const st = GP.vals[dkey(PLAN.mainDisc)][fam]['f' + PLAN.mainPhase][e0][0], dn = GP.m2[fam];
    m2.push({ fam, RKpc: PLAN.recRadiiKpc, densA2: dn.map((d) => d.A2), densPhase2: dn.map((d) => d.phase2), uA2: st.a2, uPhase2: st.ph2,
      lag: dn.map((d, i) => (d.A2 > 1e-9 && st.a2[i] > 1e-9 ? Math.abs(N3.wrapM(st.ph2[i] - d.phase2)) : null)) });
  }
  return { rows, m2 };
}

/* ───────── S 星の点の受け手(第333便d の型)と第333便d の 20 kpc の出どころ ───────── */
export function partStar(FX) {
  const eps = PLAN.softKpc.map((e) => e * KPC), cfgs = [{ key: 'circ', family: 'circ', amp: 0 }, { key: 'random|0.1|s1', family: 'random', amp: 0.1, seed: 1 }, { key: 'kin|0.1', family: 'kin', amp: 0.1 }], out = [];
  for (const q of PLAN.disc) {
    const RG = ringsAt(FX, q), row = { disc: q, fams: {} };
    for (const cfg of cfgs) {
      const Dn = diskOf(RG, cfg, 'none'), Ds = diskOf(RG, cfg, 'sync'), S = L.packSources(Dn.pts, Ds.pts), byR = {};
      const ids = []; PLAN.starRingsKpc.forEach((R) => { Dn.pts.forEach((P, j) => { if (P.ring >= 0 && Math.abs(P.Rg / KPC - R) < 1e-9) ids.push([R, j]); }); });
      const G = L.gridField({ rec: ids.map(([, j]) => [Dn.pts[j].x, Dn.pts[j].y, 0]), S, epsList: eps, exclude: ids.map(([, j]) => j) });
      for (const R of PLAN.starRingsKpc) {
        const ks = ids.map((x, k) => (x[0] === R ? k : -1)).filter((k) => k >= 0);
        byR[R] = { n: ks.length, uPhi: PLAN.softKpc.map((_, e) => ks.reduce((s, k) => s + L.cyl([Dn.pts[ids[k][1]].x, Dn.pts[ids[k][1]].y], G.out[k][e][0]).phi, 0) / ks.length),
          minDistKpc: Math.min(...ks.map((k) => G.minDist[k])) / KPC };
      }
      row.fams[cfg.key] = byR;
    }
    row.armKinOverCirc = {}; for (const R of PLAN.starRingsKpc) row.armKinOverCirc[R] = PLAN.softKpc.map((_, e) => (row.fams['kin|0.1'][R].uPhi[e] - row.fams['random|0.1|s1'][R].uPhi[e]) / row.fams.circ[R].uPhi[e]);
    out.push(row);
  }
  // 第333便d の離散化の列(器の partDisc を呼ぶ —— 帯は実際の半径の箱)を作り直し、円軌道の族の値(案内中心の環 = 実際の半径の箱)を照らす
  const D333 = X333.partDisc(FX), repro = [];
  for (const r of D333) {
    const mine = out.find((o) => o.disc[0] === r.dR && o.disc[1] === r.K);
    repro.push({ dR: r.dR, K: r.K, circ333: r.families.circ.pick, circMine: PLAN.starRingsKpc.map((R) => mine.fams.circ[R].uPhi[0]), arm333: r.armKinOverCirc, armMine: PLAN.starRingsKpc.map((R) => mine.armKinOverCirc[R][0]),
      relCirc: Math.max(...r.families.circ.pick.map((x, k) => Math.abs(x - mine.fams.circ[PLAN.starRingsKpc[k]].uPhi[0]) / Math.abs(x))) });
  }
  // 星の点と格子の比べ(20 kpc —— 格子の半径にある環): 幅 9 と腕(kin − random)/円
  const bands = PLAN.softKpc.map((_, e) => {
    const st = (fam) => L.bandOf(out.map((o) => o.fams[fam][20].uPhi[e]));
    return { softKpc: PLAN.softKpc[e], starBand: { circ: st('circ'), random: st('random|0.1|s1'), kin: st('kin|0.1') }, starArm: out.map((o) => o.armKinOverCirc[20][e]) };
  });
  return { rows: out, repro, bands, reproMaxRel: Math.max(...repro.map((r) => r.relCirc)) };
}

/* ───────── Z 高さ z の列(円盤の源 —— circ の族)───────── */
export function partZ(FX) {
  const nR = PLAN.recRadiiKpc.length, eps = PLAN.zSoftKpc.map((e) => e * KPC), out = [];
  for (const q of PLAN.zDisc) {
    const RG = ringsAt(FX, q), cfg = { key: 'circ', family: 'circ', amp: 0 }, Dn = diskOf(RG, cfg, 'none'), Ds = diskOf(RG, cfg, 'sync');
    const variants = [['thin', null]].concat(PLAN.thickSeeds.map((s) => ['thick|s' + s, L.thickZ(Dn.pts, PLAN.thickZ0Kpc * KPC, PLAN.thickSeedBase + s)]));
    const row = { disc: q, variants: {} };
    for (const [nm, zs] of variants) {
      const S = L.packSources(Dn.pts, Ds.pts, zs), V = {};
      const perZ = PLAN.zKpc.map((zz) => { const rec = L.receiverGrid(PLAN.recRadiiKpc.map((R) => R * KPC), PLAN.nAz, PLAN.azOffFrac, zz * KPC); return { rec, G: L.gridField({ rec: rec.map((r) => r.p), S, epsList: eps, W0: PLAN.W0 }) }; });
      for (let e = 0; e < eps.length; e++) for (let c = 0; c < L.COMBOS.length; c++) {
        const st = perZ.map(({ rec, G }) => ringStats(G, rec, nR, e, c));
        const radii = PLAN.recRadiiKpc.map((R, i) => {
          const fphi = st.map((s) => s.uPhi[i]), fR = st.map((s) => s.uR[i]), P = L.parityOf(PLAN.zKpc, fphi), PR = L.parityOf(PLAN.zKpc, fR);
          return { RKpc: R, uPhi0: P.f0, relPhi: P.rows.map((r) => ({ z: r.z, even: r.even / Math.abs(P.f0), odd: r.odd / Math.abs(P.f0) })), orders: P.orders, d2Rel: P.d2 / Math.abs(P.f0), d1Rel: P.d1 / Math.abs(P.f0), oddOverEven: P.oddOverEven,
            uR0OverPhi: PR.f0 / Math.abs(P.f0), uREvenOverPhi: PR.rows.map((r) => r.even / Math.abs(P.f0)), uROddOverPhi: PR.rows.map((r) => r.odd / Math.abs(P.f0)), uzMaxOverPhi: Math.max(...st.map((s) => s.uzMax[i])) / Math.abs(P.f0) };
        });
        V[PLAN.zSoftKpc[e] + '|' + L.COMBOS[c]] = radii;
      }
      row.variants[nm] = V;
    }
    // 厚みの対照と薄い円盤の差(z = 0・種 3 の平均と幅)
    row.thickVsThin = {};
    for (const k of Object.keys(row.variants.thin)) row.thickVsThin[k] = PLAN.recRadiiKpc.map((_, i) => { const th = row.variants.thin[k][i].uPhi0, vs = PLAN.thickSeeds.map((s) => row.variants['thick|s' + s][k][i].uPhi0), mn = vs.reduce((a, x) => a + x, 0) / vs.length; return { diff: (mn - th) / Math.abs(th), seedBand: L.bandOf(vs) }; });
    out.push(row);
  }
  return out;
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const nF = familyConfigs().length;
  return {
    pure: Object.values(J.pure.gates).every(Boolean),
    fixture: J.inputs.fixtureSha256Same === true,
    gridComplete: Object.keys(J.grid.vals).length === PLAN.disc.length && Object.values(J.grid.vals).every((d) => Object.keys(d).length === nF && Object.values(d).every((f) => PLAN.phases.every((ph) => f['f' + ph].length === PLAN.softKpc.length
      && f['f' + ph].every((ee) => ee.length === L.COMBOS.length && ee.every((cc) => cc.uPhi.length === PLAN.recRadiiKpc.length && cc.uPhi.every(fin)))))),
    receiversOffStars: J.grid.gapMinFrac >= L.DECL.minAzFrac - 1e-12,
    bandsComplete: J.bands.rows.length === nF * L.COMBOS.length * PLAN.softKpc.length && J.bands.rows.every((r) => r.band9.every(fin) && r.band4.every(fin)) && typeof J.bands.target.reached === 'boolean',
    armsComplete: J.arms.rows.length === PLAN.amps.length * L.COMBOS.length * PLAN.softKpc.length && J.arms.rows.every((r) => r.arms.length === 3 && r.arms.every((a) => a.ratio.every(fin))),
    repro333d: J.star.repro.length === 3 && J.star.reproMaxRel <= 1e-12,
    zThinExact: J.z.every((r) => Object.values(r.variants.thin).every((v) => v.every((x) => x.oddOverEven === 0 && x.uzMaxOverPhi === 0))),
    zThickUz0: J.z.every((r) => Object.entries(r.variants).every(([, V]) => Object.values(V).every((v) => v.every((x) => x.uzMaxOverPhi === 0)))),
  };
}
export function runAll(root = ROOT) {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const FX = X333.readFixture(root); mark('inputs');
  const grid = partGrid(FX); mark('grid');
  const bands = partBands(grid); mark('bands');
  const arms = partArms(grid, bands); mark('arms');
  const star = partStar(FX); mark('star');
  const z = partZ(FX); mark('z');
  const J = { inputs: { fixtureSha256Same: FX.shaSame, fixtureVersion: FX.J.version, fixtureRows: FX.rows.length }, pure, grid, bands, arms, star, z, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W334E_OUT ? (path.isAbsolute(process.env.W334E_OUT) ? process.env.W334E_OUT : path.join(ROOT, process.env.W334E_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第334便e gridfloor(版 ' + HARNESS_VERSION + ')');
  const R = runAll();
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w334e-gridfloor.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-11 —— AN638 = A 先に離散化の依存を下げる・AN639 = A 円盤を源にする型はその後・AN640 = A 主列は W₀ = 0)・原仮定者の整理(2026-11-11)「土星の環と銀河の円盤について」(高さ z の列は表だけ)・統括の検証項目 R326',
    decl: L.DECL, plan: PLAN, combos: L.COMBOS, mainFams: MAIN_FAMS, notClaim: NOT_CLAIM, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w334e-gridfloor.mjs', 'tests/lib-w334e-gridfloor.mjs', 'tests/exp-w333d-noncirc.mjs', 'tests/lib-w333d-noncirc.mjs', 'tests/lib-w332b-transgeo2.mjs', 'tests/lib-w331a-coordtwist.mjs', 'tests/lib-w331b-centrifugal.mjs',
    'tests/lib-w330b-dragweight.mjs', 'tests/lib-w326d-axialheat.mjs', 'tests/lib-w309a-invsq.mjs', 'tests/lib-w312a-decay.mjs', 'tests/lib-w310d-shell.mjs', 'tests/lib-w307a-sphereaxial.mjs', 'tests/lib-w329b-galrot.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第334便e', target: TARGET, code: CODE, inputs: [FIXTURE] }), {
    harnessVersion: HARNESS_VERSION, stage: 'gridfloor', engine: 'Node の純関数だけ(html を読まない・エンジンの步を進めない —— 源は宣言の軌道の式の時刻 0)', notClaim: NOT_CLAIM });
  Object.assign(out.meta, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  // 数の配列は 1 行に(正本の大きさを抑える —— JSON としては同じ値)
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1).replace(/\[\s*(-?[\d.eE+-]+(?:,\s*-?[\d.eE+-]+|,\s*null)*)\s*\]/g, (m, a) => '[' + a.replace(/\s+/g, '') + ']') + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();
