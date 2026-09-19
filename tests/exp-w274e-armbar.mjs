// 第274便e: **渦巻パターン腕と棒の設計の値表**(実測器・エンジン未接続)。
//
// 何を測るか:
//   ① パターン腕 U_arm の力が解析形と一致する(−∇U の中心差分との最大差)。
//      **A′(r) 項と ∂χ/∂r 項を落としていない**ことを、それぞれを 0 にした対照で示す。
//   ② 横幅 σ_⊥² = Θr²/(m²A)(小振幅)と、厳密ポテンシャルの Boltzmann 分散の比。
//   ③ パターン腕のピッチ角は r にも t にも依らない / **材料**腕の巻き込み時間(差動回転)。
//   ④ 棒: まっすぐな 6 節点鎖の Hessian の固有値 —— **ゼロモード 5 本**(並進 3+回転 2)・
//      残り 13 本が正・最小非ゼロ固有値。剛体回転で U が変わらないこと。コア斥力を足すと
//      ゼロモードが何本残るか。角運動量の 3 口座(軌道+自転+メッシュ)の合計。
//   ⑤ 観測写像: 視線積分の数値 vs 解析・σ_LOS と面内速度分散の比(AE5)・見かけの軸比。
//
// 使い方: node tests/exp-w274e-armbar.mjs   → tests/out/armbar-w274e.json
// 書かないこと: 「腕が創発した」「棒が自己組織化した」「銀河が安定した」。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as AB from './lib-w274e-armbar.mjs';
import * as OM from './lib-w274e-obsmap.mjs';
import { withProvenance } from './lib-w272e-provenance.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/* ── ① 腕の力が解析形と一致する ────────────────────────────────────────────── */
const P = Object.assign({}, AB.ARM_DEFAULT);
function armGradNumeric(pt, p, h) {
  const hh = h || 1e-6;
  const U = (x, y, z) => AB.armPotential({ r: Math.hypot(x, y), phi: Math.atan2(y, x), z, t: pt.t }, p);
  return {
    gx: (U(pt.x + hh, pt.y, pt.z) - U(pt.x - hh, pt.y, pt.z)) / (2 * hh),
    gy: (U(pt.x, pt.y + hh, pt.z) - U(pt.x, pt.y - hh, pt.z)) / (2 * hh),
    gz: (U(pt.x, pt.y, pt.z + hh) - U(pt.x, pt.y, pt.z - hh)) / (2 * hh),
  };
}
const gridPts = [];
for (const r of [0.3, 1, 2, 4, 8, 16]) for (const ph of [0, 0.7, 1.9, 3.3, 5.1]) for (const z of [0, 0.4])
  gridPts.push({ x: r * Math.cos(ph), y: r * Math.sin(ph), z, t: 1.3 });
let worstForce = 0;
for (const q of gridPts) {
  const a = AB.armForceXY(q, P);
  const n = armGradNumeric(q, P, 1e-6);
  worstForce = Math.max(worstForce,
    Math.abs(a.fx + n.gx), Math.abs(a.fy + n.gy), Math.abs(a.fz + n.gz));
}
// 落とすと差が出ることの対照: A′ 項 / ∂χ/∂r 項 をそれぞれ 0 にした式との最大差
let dropA = 0, dropChi = 0;
for (const q of gridPts) {
  const r = Math.hypot(q.x, q.y), phi = Math.atan2(q.y, q.x);
  const s = AB.coreRadius(r, P), chi = AB.armPhase(r, phi, q.t, P);
  const Aamp = AB.armAmplitude(r, P), Ad = AB.armAmplitudeDr(r, P);
  const full = AB.armForceCyl({ r, phi, z: q.z, t: q.t }, P);
  const noA = -(Aamp * P.m * Math.sin(P.m * chi) * (-P.b * r / (s * s)));   // A′ 項を落とした式
  const noChi = -(Ad * (1 - Math.cos(P.m * chi)));                          // ∂χ/∂r 項を落とした式
  dropA = Math.max(dropA, Math.abs(full.Fr - noA));
  dropChi = Math.max(dropChi, Math.abs(full.Fr - noChi));
}

/* ── ② 横幅 ────────────────────────────────────────────────────────────────── */
const widthRows = [0.5, 0.2, 0.05, 0.01, 0.002].map((ratio) => {
  const r = 8, Aamp = 1, m = 2, Theta = ratio * Aamp;
  const an = AB.armWidthSigma({ r, A: Aamp, m, Theta });
  const nu = AB.armWidthNumeric({ r, A: Aamp, m, Theta, n: 6000 });
  return { ThetaOverA: ratio, sigmaAnalytic: an.sigma, sigmaNumeric: nu.sigma,
    ratio: nu.sigma / an.sigma };
});

/* ── ③ ピッチ角と巻き込み ──────────────────────────────────────────────────── */
const pitch = AB.patternPitchDeg(P);
// パターン腕の χ=0 軌跡のピッチ角を r と t を変えて測る(実測 —— 定義どおりなら一定)
const pitchSamples = [];
for (const r of [2, 4, 8, 16, 64]) for (const t of [0, 5, 50]) {
  // χ=0 ⇒ φ = Ω_p t + b ln(s/r₀)。dφ/d ln r を数値で取ってピッチ角へ
  const h = 1e-5;
  const f = (rr) => P.Omega_p * t + P.b * Math.log(AB.coreRadius(rr, P) / P.r0);
  const dphidlnr = (f(r * (1 + h)) - f(r * (1 - h))) / (2 * h);
  pitchSamples.push({ r, t, pitchDeg: Math.atan(1 / Math.abs(dphidlnr)) * 180 / Math.PI });
}
// **t 依存は厳密に 0**(= パターンは巻き込まない)。r 依存はコア長 r_min の宣言そのもの。
let pitchSpreadT = 0;
for (const r of [2, 4, 8, 16, 64]) {
  const v = pitchSamples.filter((q) => q.r === r).map((q) => q.pitchDeg);
  pitchSpreadT = Math.max(pitchSpreadT, Math.max(...v) - Math.min(...v));
}
const outer = pitchSamples.filter((q) => q.r >= 16).map((q) => q.pitchDeg);
const pitchSpreadOuter = Math.max(...outer) - Math.min(...outer);
const pitchSpread = Math.max(...pitchSamples.map((q) => q.pitchDeg))
  - Math.min(...pitchSamples.map((q) => q.pitchDeg));
// 材料腕(平坦回転曲線 Ω=v_c/r)の巻き込み: 初期ピッチ 25° → その角度に達するまでの時間
const vc = 1.0;
const windRows = [2, 4, 8, 16].map((r) => {
  const Om = vc / r, dOm = -vc / (r * r);
  const w = AB.windingTime({ r, Omega: Om, dOmegaDr: dOm, pitchDeg: 25 });
  return { r, Omega: Om, shear: w.shear, tToPitch25: w.t, orbitsToPitch25: w.orbits };
});

/* ── ④ 棒 ──────────────────────────────────────────────────────────────────── */
const bp = Object.assign({}, AB.BAR_DEFAULT);
const nodes = AB.barNodes({ n: 6, l0: bp.l0 });
const U0 = AB.barPotential(nodes, bp);
const gradAtEq = AB.barGradient(nodes, bp);
let gradMax = 0; for (const v of gradAtEq) gradMax = Math.max(gradMax, Math.abs(v));
const gradCheck = AB.barGradientCheck(nodes.map((q) => q.slice()), bp, 1e-6);
const H = AB.barHessian(nodes.map((q) => q.slice()), bp, 1e-5);
const eigs = AB.eigSym(H);
const zm = AB.zeroModeCount(eigs, 1e-8);
const rm = AB.rigidModes(nodes);
const rigidResid = {};
for (const k of ['tx', 'ty', 'tz', 'rz', 'ry']) rigidResid[k] = AB.hessianResidual(H, rm[k]);
let axialNorm = 0; for (const v of rm.axial) axialNorm += v * v;
const rot = AB.barRigidRotationDeltaU(nodes, bp, 0.37, [0, 0, 1]);
const rot2 = AB.barRigidRotationDeltaU(nodes, bp, 0.37, [0, 1, 0]);
// コア斥力を足した場合(原点に中心コア): 並進の対称性が破れる → ゼロモードは何本残るか
const bpc = Object.assign({}, bp, { Kc: 2, rho: 0.5 });
// 斥力込みの平衡は直線鎖ではないので、**平衡でない点での Hessian** であることを明記する
const gradC = AB.barGradient(nodes, bpc);
let gradCMax = 0; for (const v of gradC) gradCMax = Math.max(gradCMax, Math.abs(v));
const Hc = AB.barHessian(nodes.map((q) => q.slice()), bpc, 1e-5);
const eigsC = AB.eigSym(Hc);
const zmC = AB.zeroModeCount(eigsC, 1e-8);
// 角運動量の 3 口座
const vels = nodes.map((q) => [-0.2 * q[1], 0.2 * q[0], 0]);
const Lacc = AB.barAngularMomentum({ nodes, vels, masses: nodes.map(() => 1),
  spins: nodes.map(() => 0.2), inertias: nodes.map(() => 0.4), Jmesh: 3.5 });

/* ── ⑤ 観測写像 ────────────────────────────────────────────────────────────── */
const gm = OM.gaussian3D({ M: 1000, sx: 6, sy: 6, sz: 2 });
const projRows = [[0, 0], [4, 0], [0, 4], [8, 6]].map(([X, Y]) => {
  const num = OM.projectSurfaceDensity(gm, { X, Y, n: 4000 });
  const ana = OM.surfaceDensityAnalytic(gm, { X, Y });
  return { X, Y, numeric: num, analytic: ana, rel: Math.abs(num / ana - 1) };
});
const worstProj = Math.max(...projRows.map((q) => q.rel));
const los = OM.sigmaLOS(gm, { X: 3, Y: 0, sigmaZ: () => 1.5, vZ: () => 0, n: 4000 });
const losStream = OM.sigmaLOS(gm, { X: 3, Y: 0, sigmaZ: () => 1.5, vZ: (x, y, z) => 0.8 * z / gm.sz, n: 4000 });
const ae5 = OM.planarVsLOS({ sigma1: 1.5, n: 4000 });
const axisRows = [0, 30, 60, 90].map((i) => ({ incDeg: i, q: 0.3,
  apparent: OM.apparentAxisRatio({ q: 0.3, incDeg: i }) }));

/* ── 出力 ─────────────────────────────────────────────────────────────────── */
const out = {
  meta: withProvenance({
    wave: '第274便e',
    what: 'パターン腕・棒・観測写像の純関数の値表(エンジン未接続・形を指定する初版)',
    libVersion: AB.ARMBAR_VERSION, obsmapVersion: OM.OBSMAP_VERSION,
    doNotWrite: ['腕が創発した', '棒が自己組織化した', '銀河が安定した', '渦巻銀河を較正した'],
    caveat: 'U_arm・U_bar は**外から与えた形**である。線形安定性(Hessian の固有値)は'
      + '「与えた形が壊れないこと」を測るだけで、その形が力学から出てくることは示していない。',
  }, {
    root: ROOT, wave: '第274便e', target: 'tests/lib-w274e-armbar.mjs',
    code: ['tests/exp-w274e-armbar.mjs', 'tests/lib-w274e-armbar.mjs',
      'tests/lib-w274e-obsmap.mjs', 'tests/lib-w272e-provenance.mjs'],
    inputs: ['tests/lib-w274e-armbar.mjs', 'tests/lib-w274e-obsmap.mjs'],
  }),
  arm: { params: P, worstForceVsNumeric: worstForce, points: gridPts.length,
    dropAprimeMaxDiff: dropA, dropDchiDrMaxDiff: dropChi,
    width: widthRows, pitchDeg: pitch, pitchSamples,
    pitchSpreadOverT: pitchSpreadT, pitchSpreadOuter, pitchSpreadDeg: pitchSpread,
    winding: windRows },
  bar: { params: bp, nodes: nodes.length, dof: 3 * nodes.length,
    U0, gradMaxAtEq: gradMax, gradAnalyticVsNumeric: gradCheck,
    eigenvalues: eigs, zeroModes: zm.zero, zeroThreshold: zm.threshold,
    minNonZero: zm.minNonZero, maxEigen: zm.maxAbs,
    rigidResidual: rigidResid, axialModeNorm: axialNorm,
    rotationInvariance: { z: rot.dU, y: rot2.dU },
    withCoreRepulsion: { params: bpc, gradMax: gradCMax, zeroModes: zmC.zero, minNonZero: zmC.minNonZero,
      eigenvalues: eigsC, note: '直線鎖は斥力込みでは平衡点ではない —— 平衡でない点の Hessian である' },
    angularMomentum: Lacc },
  obsmap: { model: { M: gm.M, sx: gm.sx, sy: gm.sy, sz: gm.sz },
    projection: projRows, worstProjectionRel: worstProj,
    sigmaLOS: los, sigmaLOSWithStream: losStream, ae5: ae5,
    apparentAxisRatio: axisRows },
};
const dir = path.join(ROOT, 'tests', 'out');
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'armbar-w274e.json'), JSON.stringify(out, null, 1));

const e = (x) => (x === null || x === undefined ? '—' : Number(x).toExponential(3));
const f = (x, d) => (x === null || x === undefined ? '—' : Number(x).toFixed(d === undefined ? 6 : d));
console.log('# 第274便e — パターン腕・棒・観測写像');
console.log(`腕: −∇U と中心差分の最大差 ${e(worstForce)}(${gridPts.length} 点)/ `
  + `A′ 項を落とすと最大 ${e(dropA)}・∂χ/∂r 項を落とすと最大 ${e(dropChi)} ずれる`);
console.log('腕の横幅 Θ/A → σ_num/σ_an: '
  + widthRows.map((q) => `${q.ThetaOverA}→${f(q.ratio, 6)}`).join(' / '));
console.log(`パターンのピッチ角(漸近)${f(pitch, 6)}° / **t を変えた振れ幅 ${e(pitchSpreadT)}°**`
  + `(= パターンは巻き込まない)/ r≥16 の振れ幅 ${e(pitchSpreadOuter)}° / 全 15 点 ${e(pitchSpread)}°`
  + `(r 依存はコア長 r_min=${P.rmin} の宣言そのもの)`);
console.log('材料腕の巻き込み(25° まで): '
  + windRows.map((q) => `r=${q.r}→${f(q.orbitsToPitch25, 4)} 公転`).join(' / '));
console.log(`棒: 6 節点・${3 * nodes.length} 自由度 / 平衡点の |∇U|max=${e(gradMax)}・`
  + `解析勾配 vs 数値 ${e(gradCheck)}`);
console.log(`    固有値のゼロモード **${zm.zero} 本**(しきい値 ${e(zm.threshold)})・`
  + `最小非ゼロ **${f(zm.minNonZero, 9)}**・最大 ${f(zm.maxAbs, 6)}`);
console.log('    剛体モードの残差 |Hv|/|v|: '
  + Object.entries(rigidResid).map(([k, v]) => `${k}=${e(v)}`).join(' ')
  + ` / 軸回転モードのノルム=${e(axialNorm)}(= 自由度ではない)`);
console.log(`    剛体回転で ΔU: z 軸 ${e(rot.dU)} / y 軸 ${e(rot2.dU)}`);
console.log(`    コア斥力込み(K_c=2): |∇U|max=${e(gradCMax)}(**直線鎖は平衡点ではない**)・`
  + `ゼロモード ${zmC.zero} 本・最小非ゼロ ${f(zmC.minNonZero, 9)}`);
console.log(`    角運動量 軌道 ${f(Lacc.Lorb, 4)} + 自転 ${f(Lacc.Lspin, 4)} + メッシュ `
  + `${f(Lacc.Jmesh, 4)} = ${f(Lacc.total, 4)}`);
console.log(`観測写像: 視線積分 数値 vs 解析 最大相対差 ${e(worstProj)} / σ_LOS=${f(los.sigmaLOS, 6)}`
  + `(流れ込み ${f(losStream.sigmaLOS, 6)})/ 面内/σ_LOS=${f(ae5.planarOverLOS, 9)}`
  + `(√2=${f(Math.SQRT2, 9)})・空間/σ_LOS=${f(ae5.spaceOverLOS, 9)}`);
console.log('見かけの軸比(q=0.3): ' + axisRows.map((q) => `${q.incDeg}°→${f(q.apparent, 6)}`).join(' / '));
console.log('→ tests/out/armbar-w274e.json');
