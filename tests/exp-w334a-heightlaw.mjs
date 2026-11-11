// 第334便a(原仮定者の整理(2026-11-11)「回転引きずりは、距離 r において、赤道面からの高さ z が十分に小さい場合は、z/r に比例する。回転引きずりは、角速度を維持するので、
//   速度が r に比例。組み合わせると、源の重力が十分に支配的な範囲では、回転引きずりの速度が z に比例する区間がある」「扁平な天体は、赤道面方向の回転引きずりが強いと想定する。
//   『赤道面方向の引きずり半径を扁平率で割る』などの検証を行う。次数も幾つか試す」・原仮定者の回答(2026-11-11 —— AN623・AN624・AN625・AN627)・統括の検証項目 R322):
//   **回転引きずりの高さ則の読みの候補 T1〜T3 の表・「源の重力が支配的な範囲」の 2 つの物差しの表・環の厚みへ繋ぐ対照・扁平な源の則と回転楕円体の求積と J 固定の列**
//   (段 heightlaw-334a —— 正本 tests/out/heightlaw-w334a.json・lib tests/lib-w334a-heightlaw.mjs)。**診断だけ** —— エンジン・内蔵の本・受理器・第329〜333便の lib の本文は変えない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w334a-heightlaw.mjs —— 第333便d の型・領域の宣言なし)。入力は NGC 3198 の rotmod の写し(第329便b の fixture —— 第333便d の器の
//   readFixture・ringsOf を呼ぶ)だけ。太陽系の値は lib の文献の値(未照合)。1 プロセス。
//
// ■ 何をするか(宣言は走行の前 —— lib の DECL と器の PLAN)
//   P 純関数の場面(lib の pureScenes —— 偶奇・小さい z の極限・T2 の遠方の形・赤道面・z に比例する範囲・範囲の物差し・扁平の則・回転楕円体の求積・厚みの対照・J 案・拒否)
//   D 範囲の 2 つの物差し: 太陽系(土星と環の粒子・木星と環の粒子と衛星・天王星と環の粒子・地球と月・太陽と惑星)と NGC 3198 の円盤(中心の点・R の内の点の和 —— 受け手の R × z)で
//     D の割合・重力の加速度の大きさの割合・β(自己の重み none・kappaM・robs × W₀ = 0/宇宙の背景)と「支配的」の判定
//   H 高さの分布の表: 土星の主な環 4・木星の主環・天王星の ε 環・NGC 3198(R = 10 kpc)× 符号付きの z の格子 × s_d(観測自転・J 案 λ_J = 1)で T1〜T3 と比べる列 ①②③ と V/z・z に比例する範囲
//   K 環の厚みへ繋ぐ対照(宣言 —— 採用しない): 環 6 × s_d × 型(focus・diverge・shear・tilt)× σ_z で H ~ σ_z/ν_eff と H₀ = σ_z/ν_z の比
//   O 扁平な源: (a) 則の表(文字どおり・軸比 × q × f_flat)(b) 体積を保つ回転楕円体の求積(形 × α × 近接場 —— J 固定と半径だけの列・高さの分布・収束)(c) 土星の 2 つの則の形
//     (d) 天体の表(太陽・水星〜海王星・月・NGC 3198 の円盤 —— R_d,eq・2R_d,eq・環の典型の厚みとの比)
// ■ 言わないこと: 宣言の型の表・候補・残差・条件付きの恒等式(環の厚みや円盤を解いた・扁平な天体で引きずりが強まることを導いた・慣性を引きずりから導いたとは書かない)・
//   s_d は J を表す等価なパラメータ(J 案の T1 の速さが c₀ を超える列は速度として読まない)・範囲の外は適用外(0 に落とした値を予測と呼ばない)・文献の値は未照合。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as L from './lib-w334a-heightlaw.mjs';
import * as X333D from './exp-w333d-noncirc.mjs';
import { buildDisk } from './lib-w333d-noncirc.mjs';
import { bodyVel } from './lib-w333a-rotdiff.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w334a-heightlaw-1';
export const OUT_MAIN = 'tests/out/heightlaw-w334a.json';
export const FIXTURE = X333D.FIXTURE;
export const TARGET = 'tests/lib-w334a-heightlaw.mjs';   // html を読まない器の来歴の対象(純関数 —— 第333便d の型)
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const { AU, KPC, MSUN, HOUR } = L;
const G = L.DECL.G, C0 = L.DECL.c;
export const NOT_CLAIM = Object.freeze(['高さ則 T1〜T3・扁平の則・厚みの対照は宣言の型の表・候補・残差・条件付きの恒等式(原仮定者の整理の作業仮説 —— 今のエンジンに無い・未接続・AN627 = A)',
  '高さ則で環の厚みや円盤を解いたとは書かない(速度の比例則だけでは平衡の厚みは決まらない —— 厚みは σ_z と ν_z を宣言した対照の列)', '扁平な天体で引きずりが強まることを導いたとは書かない(則 × 次数の表 —— J 固定では遠方の場は不変)',
  '切り口・三次元の差分・帯と尾の列(第332〜333便)は比べる列(凍結の対照)—— 高さ則と同じ名前で採用済みにしない', 's_d は J を表す等価なパラメータ(物質の表面の速度ではない —— J 案の T1 の速さが c₀ を超える列は速度として読まない)',
  '範囲の外は適用外(0 に落とした値を予測と呼ばない)', '成分・次数・係数・範囲の物差しは走行の前に宣言した(観測に合うように後から選ばない)', '同じ「約 10 m」の典型の厚みを複数の環の独立な一致に数えない',
  '文献の値はこの環境で一次資料に当たっていない(未照合)', '慣性を引きずりから導いたとは書かない', '`κ_epi` と κ_D は別の量']);
/** 器の宣言(走行の前に置く —— 結果を見て変えない) */
export const PLAN = Object.freeze({
  /** 高さの格子(符号付き —— 正の値と 0 と負の値を全部): 土星と天王星の環 [m]・木星の主環 [m]・NGC 3198 [kpc] */
  zRing: Object.freeze([0.1, 1, 10, 100]), zJup: Object.freeze([1, 10, 100, 1e3, 1e4]), zGalKpc: Object.freeze([0.05, 0.1, 0.3, 1]),
  /** NGC 3198 の円盤(第333便d の器の ringsOf —— 間隔 1 kpc・方位 24・円軌道の族・中心の点の引きずり自転は v_obs(R_c)/R_c)・範囲の受け手の R [kpc] × z [kpc]・高さの表の R [kpc] */
  galDR: 1, galK: 24, galR: Object.freeze([5, 10, 20]), galZ: Object.freeze([0, 0.05, 0.2, 1]), galHeightR: 10,
  /** 銀河の受け手の星(自己の重みの列 —— 太陽の質量と半径の宣言)・中心の点の観測半径(第333便d の R_c)と慣性係数(一様な球 0.4 の宣言) */
  galRecv: Object.freeze({ m: MSUN, R: 6.957e8 }), galFObs: 0.4,
  /** s_d の 2 列(観測自転 s・J 案 λ_J = 1 —— 第333便a の dragSpin・f_d = 2/5) */
  sdCases: Object.freeze(['obs', 'J']),
  /** 厚みの対照の緩和の率(応答率は観測自転に固定 —— AN625 = A: γ = β_k1N |s|・β_k1N = C₁ R_d K1(r; R_d) —— 第332便a の couplingOf)と鉛直の場の傾き a = β s_d(T1 を鉛直へ割り当てる型) */
  thickRate: 'k1N',
});

/* ───────── 天体と系 ───────── */
const BOD = Object.fromEntries(L.LIT334A.bodies.map((b) => [b.key, b]));
const spinOf = (b) => 2 * Math.PI / (Math.abs(b.P) * HOUR);
export const galaxyPoint = () => { const g = L.LIT334A.galaxy, R = g.RKpc * KPC; return { m: g.v * g.v * R / G, r: R }; };
const particle = () => { const p = L.LIT334A.particle; return { m: (4 / 3) * Math.PI * p.R ** 3 * p.rho, R: p.R }; };
function sdOf(b, kase) {
  const s = spinOf(b);
  if (kase === 'obs') return { sd: s, s, Rd: L.rdOf(b.m), fObs: L.fObsOf(b.moi), fObsLit: L.fObsIsLit(b.moi) };
  const D = L.dragSpin({ m: b.m, Robs: b.R, s, fObs: L.fObsOf(b.moi), lambdaJ: 1 });
  return { sd: D.sd, s, Rd: D.Rd, fObs: D.fObs, fObsLit: L.fObsIsLit(b.moi), ratio: D.ratio, vdOverC: D.vdOverC };
}
/** 太陽系の受け手の範囲の行の宣言(受け手・注目の源・他の源 —— 他の源は合の距離〔最も近い —— 他の源の分が最大の側〕) */
export function solarCases() {
  const out = [], gal = galaxyPoint(), sun = BOD.sun, dA = (k1, k2) => Math.abs(BOD[k1].aAU - BOD[k2].aAU) * AU;
  const moonsOf = (h) => L.LIT334A.moons.filter((q) => q.host === h);
  for (const rg of L.LIT334A.rings) {
    const h = BOD[rg.host], other = rg.host === 'jupiter' ? 'saturn' : rg.host === 'saturn' ? 'jupiter' : 'saturn';
    const others = [{ name: '太陽', m: sun.m, r: h.aAU * AU }, { name: BOD[other].name, m: BOD[other].m, r: dA(rg.host, other) }].concat(moonsOf(rg.host).map((q) => ({ name: q.name, m: q.m, r: q.a - rg.r }))).concat([{ name: '銀河', m: gal.m, r: gal.r }]);
    out.push({ key: rg.key, kind: 'ring', name: rg.name + 'の粒子', src: { name: h.name, m: h.m, r: rg.r }, others, recv: particle() });
  }
  for (const q of L.LIT334A.moons) {
    const h = BOD[q.host], other = q.host === 'jupiter' ? 'saturn' : 'jupiter';
    const others = [{ name: '太陽', m: sun.m, r: h.aAU * AU }, { name: BOD[other].name, m: BOD[other].m, r: dA(q.host, other) }].concat(moonsOf(q.host).filter((x) => x.key !== q.key).map((x) => ({ name: x.name, m: x.m, r: Math.abs(x.a - q.a) }))).concat([{ name: '銀河', m: gal.m, r: gal.r }]);
    out.push({ key: q.key, kind: 'moon', name: h.name + '–' + q.name, src: { name: h.name, m: h.m, r: q.a }, others, recv: { m: q.m, R: q.R } });
  }
  { const e = BOD.earth, mo = BOD.moon; out.push({ key: 'luna', kind: 'moon', name: '地球–月', src: { name: e.name, m: e.m, r: 384400e3 }, others: [{ name: '太陽', m: sun.m, r: e.aAU * AU }, { name: '木星', m: BOD.jupiter.m, r: dA('earth', 'jupiter') }, { name: '銀河', m: gal.m, r: gal.r }], recv: { m: mo.m, R: mo.R } }); }
  for (const b of L.LIT334A.bodies.filter((x) => x.aAU > 0)) {
    const other = b.key === 'jupiter' ? 'saturn' : 'jupiter';
    out.push({ key: b.key, kind: 'planet', name: '太陽–' + b.name, src: { name: '太陽', m: sun.m, r: b.aAU * AU }, others: [{ name: BOD[other].name, m: BOD[other].m, r: dA(b.key, other) }, { name: '銀河', m: gal.m, r: gal.r }], recv: { m: b.m, R: b.R } });
  }
  return out;
}
/** NGC 3198 の円盤(第333便d の器 —— 円軌道の族・z = 0 の面) */
export function galaxyDisk(FX) {
  const RG = X333D.ringsOf(FX, PLAN.galDR), D = buildDisk({ rings: RG.rings, K: PLAN.galK, family: 'circ', R0: KPC, center: RG.center, spin: 'none' });
  return { pts: D.pts, center: RG.center, Mdisk: D.pts.reduce((t, p) => t + p.m, 0), RcKpc: X333D.PLAN.RcKpc };
}
/** 円盤の受け手 (R, z) の範囲の物差し(注目の源 center = 中心の点・inner = R の内の点の和〔重みと決定力は点ごとの和〕)。受け手は方位 π/K(点と重ならない) */
export function galaxyDominance(GD, RKpc, zKpc, srcKind) {
  const ph = Math.PI / PLAN.galK, at = [RKpc * KPC * Math.cos(ph), RKpc * KPC * Math.sin(ph), zKpc * KPC];
  const rr = GD.pts.map((p) => Math.hypot(at[0] - p.x, at[1] - p.y, at[2]));
  const inSrc = (i) => (srcKind === 'center' ? i === 0 : i === 0 || GD.pts[i].Rg < RKpc * KPC - 1e-6 * KPC);
  let Dj = 0, Ds = 0, Wj = 0, Ws = 0;
  GD.pts.forEach((p, i) => { const d = p.m / rr[i], w = p.m / (rr[i] * rr[i]); Ds += d; Ws += w; if (inSrc(i)) { Dj += d; Wj += w; } });
  // dominance の形に揃える(注目の源 1 つ + 他の源 1 つ —— 決定力と重みが同じになる等価な距離に置く)
  const mj = Dj * Dj / Wj, rj = Dj / Wj, mo = Ds - Dj > 0 ? (Ds - Dj) ** 2 / (Ws - Wj) : 0, ro = Ds - Dj > 0 ? (Ds - Dj) / (Ws - Wj) : 1;
  const dm = L.dominance({ src: { m: mj, r: rj }, others: mo > 0 ? [{ m: mo, r: ro }] : [], recv: PLAN.galRecv });
  const dc = L.dominance({ src: { m: mj, r: rj }, others: mo > 0 ? [{ m: mo, r: ro }] : [], recv: PLAN.galRecv, W0: L.cosmicBackgroundW() });
  return Object.assign(dm, { RKpc, zKpc, src: srcKind, betaCosmicW0: dc.beta.none, Wsrc: Wj, Wall: Ws, W0cosmic: L.cosmicBackgroundW() });
}

/* ───────── D 範囲の 2 つの物差し ───────── */
export function partDominance(GD) {
  const W0c = L.cosmicBackgroundW(), solar = solarCases().map((c) => {
    const d = L.dominance({ src: c.src, others: c.others, recv: c.recv }), dc = L.dominance({ src: c.src, others: c.others, recv: c.recv, W0: W0c });
    const allD = [c.src].concat(c.others).map((s) => ({ name: s.name, D: s.m / s.r, W: s.m / (s.r * s.r) })), topD = allD.reduce((a, b) => (b.D > a.D ? b : a)), topW = allD.reduce((a, b) => (b.W > a.W ? b : a));
    return { key: c.key, kind: c.kind, name: c.name, src: c.src.name, r: c.src.r, dShare: d.dShare, aShare: d.aShare, beta: d.beta, betaCosmicW0: dc.beta.none, dDominant: d.dDominant, aDominant: d.aDominant, betaDominant: d.betaDominant, topD: topD.name, topW: topW.name };
  });
  const galaxy = [];
  for (const src of ['center', 'inner']) for (const R of PLAN.galR) for (const z of PLAN.galZ) galaxy.push(galaxyDominance(GD, R, z, src));
  return { solar, galaxy, W0cosmic: W0c, share: L.DECL.dominance.share,
    note: 'D の割合 = D_j/ΣD(D₀ は入れない —— 一様で勾配を持たない)・重力の加速度の大きさの割合 = (m_j/r_j²)/Σ(m/r²)(= α = 2・自己なし・W₀ = 0 の β)・β は自己の重み none/kappaM(R_d = Y_k m)/robs(観測半径)・W₀ は 0 が主(宇宙の背景 3H₀c/(2G) は比べる列)・他の源は合の距離・銀河は点の宣言' };
}

/* ───────── H 高さの分布の表 ───────── */
export function heightSystems(GD) {
  const out = [];
  for (const rg of L.LIT334A.rings) {
    const h = BOD[rg.host], c = solarCases().find((x) => x.key === rg.key), dm = L.dominance({ src: c.src, others: c.others, recv: c.recv });
    out.push({ key: rg.key, name: rg.name, rho: rg.r, zs: rg.host === 'jupiter' ? PLAN.zJup : PLAN.zRing, unit: 'm', zUnit: 1, body: h, Robs: h.R, beta: dm.beta.none, inD: dm.dDominant, inBeta: dm.betaDominant.none,
      sd: Object.fromEntries(PLAN.sdCases.map((k) => [k, sdOf(h, k)])) });
  }
  { const R = PLAN.galHeightR, Mc = GD.center.m, Rc = GD.RcKpc * KPC, s = GD.center.spin, Rd = L.rdOf(Mc), D = L.dragSpin({ m: Mc, Robs: Rc, s, fObs: PLAN.galFObs, lambdaJ: 1 });
    out.push({ key: 'ngc3198', name: 'NGC 3198(R = ' + R + ' kpc・源は中心の点)', rho: R * KPC, zs: PLAN.zGalKpc, unit: 'kpc', zUnit: KPC, body: { name: 'NGC 3198 の中心の点', m: Mc, R: Rc }, Robs: Rc,
      domOfZ: (zKpc) => galaxyDominance(GD, R, zKpc, 'center'), beta: galaxyDominance(GD, R, 0, 'center').beta.none, inD: galaxyDominance(GD, R, 0, 'center').dDominant, inBeta: galaxyDominance(GD, R, 0, 'center').betaDominant.none,
      sd: { obs: { sd: s, s, Rd, fObs: PLAN.galFObs, fObsLit: false }, J: { sd: D.sd, s, Rd: D.Rd, fObs: PLAN.galFObs, fObsLit: false, ratio: D.ratio, vdOverC: D.vdOverC } } }); }
  return out;
}
export function partHeights(GD) {
  const rows = [], ranges = [], t3v = [];
  for (const sy of heightSystems(GD)) for (const k of PLAN.sdCases) {
    const S = sy.sd[k], Rd = S.Rd, zsSigned = [...sy.zs.map((z) => -z).reverse(), 0, ...sy.zs];
    for (const zz of zsSigned) {
      const z = zz * sy.zUnit, dz = sy.domOfZ ? sy.domOfZ(Math.abs(zz)) : null, beta = dz ? dz.beta.none : sy.beta, r = L.heightRow({ rho: sy.rho, z, Rd, sd: S.sd, beta });
      // 範囲の 2 つの物差し(D の割合・β〔自己なし・W₀ = 0〕)—— どちらかの外は「適用外」の印(値は表に残すが予測と呼ばない)
      const inD = dz ? dz.dDominant : sy.inD, inBeta = dz ? dz.betaDominant.none : sy.inBeta;
      const vz = (x) => (z !== 0 ? x / z : null);
      rows.push(Object.assign({ sys: sy.key, name: sy.name, sdCase: k, zLabel: zz, zUnit: sy.unit, Rd, sd: S.sd, beta }, r, {
        T1overZ: vz(r.T1), T1betaOverZ: vz(r.T1beta), T2sliceOverZ: vz(r.T2slice), T2ballOverZ: vz(r.T2ball), T3overZ: vz(r.T3),
        T1overSlice: r.slice !== 0 ? r.T1 / r.slice : null, T1overBall: r.ball !== 0 ? r.T1 / r.ball : null, T1overC: Math.abs(r.T1) / C0, inBand: Math.abs(z) <= Rd, inRangeD: inD, inRangeBeta: inBeta, verdict: inD && inBeta ? '範囲の内' : inBeta ? 'β の内・D の外' : inD ? 'D の内・β の外' : '適用外' }));
    }
    // z に比例する範囲(lib の propRange —— 読みごと)
    const beta = sy.beta, f = { T1: (z) => L.t1Twist({ rho: sy.rho, z, sd: S.sd }).par, T1beta: (z) => L.t1Twist({ rho: sy.rho, z, sd: S.sd, beta }).par,
      T2slice: (z) => L.t2Vort({ rho: sy.rho, z, Rd, sd: S.sd, col: 'slice' }).V, T2ball: (z) => L.t2Vort({ rho: sy.rho, z, Rd, sd: S.sd, col: 'ball' }).V,
      T3: (z) => L.t3Scalar({ rho: sy.rho, z, sd: S.sd, beta, H: Rd, ell: L.DECL.t3.ellMain }) };
    const rg = { sys: sy.key, name: sy.name, sdCase: k, Rd, sd: S.sd, beta, rho: sy.rho, inRangeD: sy.inD, inRangeBeta: sy.inBeta };
    for (const [nm, fn] of Object.entries(f)) { const p = L.propRange(fn, sy.rho); rg[nm] = { slope0: p.slope0, zMax: p.zMax, zMaxOverRd: p.zMax === null ? null : p.zMax / Rd, zMaxOverRho: p.zMaxOverRho }; }
    ranges.push(rg);
    // T3 の ℓ × H の列(z = 典型の格子の 2 点目・最大)
    for (const ell of L.DECL.t3.ells) for (const Hk of L.DECL.t3.Hs) {
      const H = Hk === 'Rd' ? Rd : sy.Robs, zA = sy.zs[1] * sy.zUnit, zB = sy.zs[sy.zs.length - 1] * sy.zUnit;
      t3v.push({ sys: sy.key, sdCase: k, ell, H: Hk, at: [zA, zB].map((z) => ({ z, V: L.t3Scalar({ rho: sy.rho, z, sd: S.sd, beta, H, ell }), overZ: L.t3Scalar({ rho: sy.rho, z, sd: S.sd, beta, H, ell }) / z / (beta * S.sd) })), range: L.propRange((z) => L.t3Scalar({ rho: sy.rho, z, sd: S.sd, beta, H, ell }), sy.rho).zMax });
    }
  }
  const sys = heightSystems(GD).map((s) => ({ key: s.key, name: s.name, rho: s.rho, beta: s.beta, inRangeD: s.inD, inRangeBeta: s.inBeta, sd: s.sd, Robs: s.Robs, m: s.body.m }));
  return { systems: sys, rows, ranges, t3v, note: 'z は赤道面からの符号付きの高さ(源の自転軸を ẑ)・T1 = s_d z・T1β = β s_d z(β は自己なし・W₀ = 0 の源の重みの割合)・T2 = r ω_ρ(ω_ρ = −½ ∂U_φ/∂z)・T3 は A = 1・ℓ = 4・H = R_d・比べる列は第333便a の ①②③(α = 2)' };
}

/* ───────── K 環の厚みへ繋ぐ対照 ───────── */
export function partThickness() {
  const rows = [], J2 = L.LIT334A.saturnJ2;
  for (const rg of L.LIT334A.rings) {
    const h = BOD[rg.host], GM = G * h.m, fr = rg.host === 'saturn' ? L.ringFreq(GM, rg.r, J2.value, J2.Rref) : { nuZ: Math.sqrt(GM / rg.r ** 3), Om: Math.sqrt(GM / rg.r ** 3) };
    const c = solarCases().find((x) => x.key === rg.key), beta = L.dominance({ src: c.src, others: c.others, recv: c.recv }).beta.none, lit = L.LIT334A.ringThickness.find((q) => q.key === rg.key);
    for (const k of PLAN.sdCases) {
      const S = sdOf(h, k), gamma = L.couplingOf(PLAN.thickRate, rg.r, S.Rd) * S.s, a = beta * S.sd;
      for (const type of L.THICK_TYPES) for (const sigmaZ of L.DECL.thickness.sigmaZ) {
        const v = L.verticalContrast({ type, nuZ: fr.nuZ, gamma, a, sigmaZ });
        rows.push({ ring: rg.key, name: rg.name, sdCase: k, type, sigmaZ, nuZ: fr.nuZ, gamma, a, gammaAOverNu2: v.gammaAOverNu2, bound: v.bound, H0: v.H0, H: v.H, ratio: v.ratio, Hlit: lit ? lit.H : null, HlitKind: lit ? lit.kind : null, H0OverLit: lit && lit.H ? v.H0 / lit.H : null });
      }
    }
  }
  return { rows, sigmaZ: L.DECL.thickness.sigmaZ, sigmaZSrc: L.LIT334A.sigmaZSrc,
    note: 'focus: U_z = −a z へ率 γ で緩和(ν_eff² = ν_z² + γ a)・diverge: U_z = +a z(ν_z² − γ a)・shear・tilt は厚みの式を変えない・a = β s_d(T1 を鉛直へ割り当てる型)・γ = β_k1N |s|(応答率は観測自転に固定 —— AN625 = A)・ν_z は土星だけ J₂ の一次(第331便c の ringFreq)・他は点の質量・σ_z は宣言の格子(文献の値・未照合の桁)' };
}

/* ───────── O 扁平な源 ───────── */
export function partOblate(GD) {
  const OB = L.DECL.oblate, SP = L.DECL.spheroid;
  // (a) 則の表
  const rules = [];
  for (const law of L.LAWS) for (const q of OB.qs) for (const f of OB.fGrid) {
    let g = null; try { g = L.oblateRule({ Rd: 1, fFlat: f, q, law }); } catch (e) { g = null; }
    rules.push({ law, q, f, ok: g !== null, ReqOverRd: g ? g.Req : null, RpolOverRd: g ? g.Rpol : null, fEff: g ? g.fEff : null, volumeRatio: g ? g.volumeRatio : null });
  }
  // (b) 回転楕円体の求積(形 = 軸比 q = 1/3〔実際の扁平率 = f_flat〕× α × 近接場 —— 球の R_d = 1・s_d = 1)
  const quad = [], heights = [], conv = [];
  for (const f of SP.fShapes) {
    const g = L.oblateRule({ Rd: 1, fFlat: f, q: 1 / 3, law: 'axisRatio' }), jf = L.jFixedSpin({ J: OB.kI * 1 * 1 * 1, m: 1, Req: g.Req });
    for (const alpha of SP.alphas) for (const k of SP.rhoOverReq) {
      const rho = k * g.Req, U0 = bodyVel({ rho, z: 0, Rd: 1, sd: 1, alpha }), Uj = L.spheroidVel({ rho, z: 0, Req: g.Req, Rpol: g.Rpol, sd: jf.sd, alpha }), Ur = L.spheroidVel({ rho, z: 0, Req: g.Req, Rpol: g.Rpol, sd: 1, alpha });
      quad.push({ f, alpha, rhoOverReq: k, Req: g.Req, Rpol: g.Rpol, sdJ: jf.sd, jFixedOverSphere: Uj / U0, radiusOnlyOverSphere: Ur / U0, radiusOnlyOverJ: Ur / Uj, farJ: Uj / L.spheroidFar({ rho, z: 0, Req: g.Req, sd: jf.sd, alpha }) });
    }
    for (const k of [2, 10]) {
      const rho = k * g.Req, row = { f, rhoOverReq: k, prof: [] };
      const s0 = L.spheroidVel({ rho, z: 0, Req: g.Req, Rpol: g.Rpol, sd: jf.sd, alpha: 2 }), b0 = bodyVel({ rho, z: 0, Rd: 1, sd: 1, alpha: 2 });
      for (const zq of SP.zOverReq) { const z = zq * g.Req, s = L.spheroidVel({ rho, z, Req: g.Req, Rpol: g.Rpol, sd: jf.sd, alpha: 2 }), b = bodyVel({ rho, z, Rd: 1, sd: 1, alpha: 2 }); row.prof.push({ zOverReq: zq, spheroid: s / s0, sphere: b / b0, jFixedOverSphere: s / b }); }
      // 回転楕円体の半渦度の動径の成分 × r(T2 の型 —— z = R_eq の中心差分)
      const z = g.Req, h = 1e-3 * g.Req, om = -0.5 * (L.spheroidVel({ rho, z: z + h, Req: g.Req, Rpol: g.Rpol, sd: jf.sd, alpha: 2 }) - L.spheroidVel({ rho, z: z - h, Req: g.Req, Rpol: g.Rpol, sd: jf.sd, alpha: 2 })) / (2 * h);
      const omS = -0.5 * (bodyVel({ rho, z: z + h, Rd: 1, sd: 1, alpha: 2 }) - bodyVel({ rho, z: z - h, Rd: 1, sd: 1, alpha: 2 })) / (2 * h);
      row.t2 = { omega: om, sphere: omS, ratio: om / omS };
      heights.push(row);
    }
    const o = { rho: 1.5 * g.Req, z: 0, Req: g.Req, Rpol: g.Rpol, sd: 1, alpha: 3 };
    conv.push({ f, rel: Math.abs(L.spheroidVel(o) / L.spheroidVel(Object.assign({ q: SP.quadHi }, o)) - 1) });
  }
  // (c) 土星の 2 つの則の形(q = 1 —— 文字どおり/軸比)の求積(α = 2 —— 近接場と遠方・J 固定と半径だけ)
  const sat = BOD.saturn, saturnShapes = [];
  for (const law of L.LAWS) {
    const g = L.oblateRule({ Rd: 1, fFlat: sat.f, q: OB.qMain, law }), jf = L.jFixedSpin({ J: OB.kI, m: 1, Req: g.Req }), row = { law, q: OB.qMain, Req: g.Req, Rpol: g.Rpol, fEff: g.fEff, pts: [] };
    for (const k of SP.rhoOverReq) {
      const rho = k * g.Req, U0 = bodyVel({ rho, z: 0, Rd: 1, sd: 1, alpha: 2 });
      row.pts.push({ rhoOverReq: k, jFixedOverSphere: L.spheroidVel({ rho, z: 0, Req: g.Req, Rpol: g.Rpol, sd: jf.sd, alpha: 2 }) / U0, radiusOnlyOverSphere: L.spheroidVel({ rho, z: 0, Req: g.Req, Rpol: g.Rpol, sd: 1, alpha: 2 }) / U0 });
    }
    const o = { rho: 1.5 * g.Req, z: 0, Req: g.Req, Rpol: g.Rpol, sd: 1, alpha: 2 };
    row.conv = Math.abs(L.spheroidVel(o) / L.spheroidVel(Object.assign({ q: SP.quadHi }, o)) - 1);
    saturnShapes.push(row);
  }
  // (d) 天体の表(f_flat は文献の値・未照合)と NGC 3198 の円盤(軸比の宣言)
  const bodies = L.LIT334A.bodies.map((b) => ({ key: b.key, name: b.name, m: b.m, f: b.f, fSrc: 'lit' })).concat([{ key: 'ngc3198', name: 'NGC 3198 の円盤(軸比 ' + L.LIT334A.galaxyAxisRatio + ' の宣言)', m: GD.Mdisk, f: 1 - L.LIT334A.galaxyAxisRatio, fSrc: 'decl' }]);
  const btab = bodies.map((b) => {
    const Rd = L.rdOf(b.m), row = { key: b.key, name: b.name, m: b.m, Rd, f: b.f, fSrc: b.fSrc, inverseF: {}, axisRatio: {} };
    for (const law of L.LAWS) for (const q of OB.qs) { let g = null; try { g = L.oblateRule({ Rd, fFlat: b.f, q, law }); } catch (e) { g = null; } row[law][String(q)] = g ? { Req: g.Req, twoReq: 2 * g.Req, fEff: g.fEff } : null; }
    const ax1 = row.axisRatio['1'];
    row.sdJFixedOverSphere = ax1 ? (Rd / ax1.Req) ** 2 : null;   // J 固定の s_d の球(R_eq = R_d)との比 = (R_d/R_eq)²
    return row;
  });
  const satRow = btab.find((r) => r.key === 'saturn'), Hsat = L.LIT334A.ringThickness.find((q) => q.key === 'satB').H;
  const ringCompare = { H: Hsat, independentCount: 1, rows: L.LAWS.flatMap((law) => OB.qs.map((q) => { const v = satRow[law][String(q)]; return { law, q, twoReq: v ? v.twoReq : null, overH: v ? v.twoReq / Hsat : null }; })),
    sphere: { twoRd: 2 * satRow.Rd, overH: 2 * satRow.Rd / Hsat }, note: '土星の主な環 4 本の典型の厚み約 10 m は 1 つの総説の値 —— 独立な一致の数は 1(4 本に数えない)' };
  return { rules, quad, heights, conv, saturnShapes, bodies: btab, ringCompare, kI: OB.kI, fSrc: L.LIT334A.bodiesSrc,
    note: '体積を保つ回転楕円体 R_pol = R_d³/R_eq²・形は軸比 q = 1/3(実際の扁平率 = f_flat)・J 固定 s_d = λ_J J/(k_I m R_eq²)(k_I = 2/5)・半径だけ = s_d を球の値のまま・比はいずれも同じ物理の点 ρ で球(半径 R_d・s_d = 1)との比' };
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const D = J.dominance, H = J.heights, K = J.thickness, O = J.oblate, nZ = (s) => 2 * s + 1;
  const nH = (2 * nZ(PLAN.zRing.length) * 5 + 2 * nZ(PLAN.zJup.length) + 2 * nZ(PLAN.zGalKpc.length));
  return {
    pure: Object.values(J.pure.gates).every(Boolean),
    dominanceTable: D.solar.length === solarCases().length && D.galaxy.length === 2 * PLAN.galR.length * PLAN.galZ.length && D.solar.concat(D.galaxy).every((r) => [r.dShare, r.aShare, r.beta.none, r.beta.kappaM, r.beta.robs].every((x) => Number.isFinite(x) && x >= 0 && x <= 1))
      && D.solar.every((r) => r.beta.kappaM <= r.beta.robs && r.beta.robs <= r.beta.none),
    heightTable: H.rows.length === nH && H.rows.every((r) => ['T1', 'T1beta', 'T2slice', 'T2ball', 'T3', 'slice', 'ball', 'pair', 'lorentz', 'sum2'].every((k) => Number.isFinite(r[k])))
      && H.rows.filter((r) => r.zLabel === 0).every((r) => r.T1 === 0 && r.T2slice === 0 && r.T2ball === 0 && r.T3 === 0)
      && H.rows.every((r) => { const m = H.rows.find((q) => q.sys === r.sys && q.sdCase === r.sdCase && q.zLabel === -r.zLabel); return m && m.T1 === -r.T1 && m.slice === r.slice && Math.abs(m.ball - r.ball) <= 1e-12 * Math.abs(r.ball); }),
    thicknessTable: K.rows.length === L.LIT334A.rings.length * PLAN.sdCases.length * L.THICK_TYPES.length * L.DECL.thickness.sigmaZ.length && K.rows.filter((r) => r.type === 'shear' || r.type === 'tilt').every((r) => r.ratio === 1),
    oblateTable: O.rules.filter((r) => r.f === 0 && r.law === 'inverseF').every((r) => !r.ok) && O.rules.filter((r) => r.ok).every((r) => Math.abs(r.volumeRatio - 1) < 1e-12)
      && O.quad.filter((r) => r.rhoOverReq === 100).every((r) => Math.abs(r.jFixedOverSphere - 1) < 1e-3) && O.conv.every((c) => c.rel < 1e-6) && O.saturnShapes.every((s) => s.conv < 1e-4)
      && O.bodies.length === L.LIT334A.bodies.length + 1 && O.ringCompare.independentCount === 1,
  };
}
export function runAll(FX) {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const GD = galaxyDisk(FX); mark('disk');
  const dominance = partDominance(GD); mark('dominance');
  const heights = partHeights(GD); mark('heights');
  const thickness = partThickness(); mark('thickness');
  const oblate = partOblate(GD); mark('oblate');
  const J = { fixtureSha256Same: FX.shaSame, galaxy: { Mc: GD.center.m, OmegaC: GD.center.spin, Mdisk: GD.Mdisk, n: GD.pts.length, RcKpc: GD.RcKpc }, pure, dominance, heights, thickness, oblate, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean) && FX.shaSame === true;
  return J;
}

/* ───────── 走らせる ───────── */
export const CODE = ['tests/exp-w334a-heightlaw.mjs', 'tests/lib-w334a-heightlaw.mjs', 'tests/lib-w333a-rotdiff.mjs', 'tests/lib-w332a-eqband.mjs', 'tests/lib-w333b-axialfield.mjs', 'tests/lib-w331c-k1scale.mjs',
  'tests/exp-w333d-noncirc.mjs', 'tests/lib-w333d-noncirc.mjs', 'tests/lib-w332b-transgeo2.mjs', 'tests/lib-w331a-coordtwist.mjs', 'tests/lib-w331b-centrifugal.mjs', 'tests/lib-w330b-dragweight.mjs',
  'tests/lib-w329b-galrot.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
export async function main() {
  const OUT = process.env.W334A_OUT ? (path.isAbsolute(process.env.W334A_OUT) ? process.env.W334A_OUT : path.join(ROOT, process.env.W334A_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第334便a heightlaw(版 ' + HARNESS_VERSION + ')');
  const FX = X333D.readFixture(ROOT), R = runAll(FX);
  // 正本の先頭は走行の前の宣言(lib の DECL・読みの候補・扁平の則・器の PLAN)
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w334a-heightlaw.mjs', target: TARGET,
    decl: L.DECL, readings: L.READINGS, contrasts: L.CONTRASTS, selfRules: L.SELF_RULES, laws: L.LAWS, thickTypes: L.THICK_TYPES, plan: PLAN,
    ruling: '原仮定者の整理(2026-11-11)「回転引きずりは、距離 r において、赤道面からの高さ z が十分に小さい場合は、z/r に比例する。回転引きずりは、角速度を維持するので、速度が r に比例。組み合わせると、源の重力が十分に支配的な範囲では、回転引きずりの速度が z に比例する区間がある」'
      + '「扁平な天体は、赤道面方向の回転引きずりが強いと想定する。『赤道面方向の引きずり半径を扁平率で割る』などの検証を行う。次数も幾つか試す」(作業仮説 —— 診断で検査・未接続)・原仮定者の回答(2026-11-11 —— AN623・AN624 = A・AN625 = A・AN627 = A)・統括の検証項目 R322',
    lit: L.LIT334A, notClaim: NOT_CLAIM, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第334便a', target: TARGET, code: CODE, inputs: [FIXTURE] }), {
    harnessVersion: HARNESS_VERSION, stage: 'heightlaw', engine: 'Node の純関数だけ(html を読まない・エンジンの步を進めない —— 太陽系は lib の文献の値・銀河は第329便b の fixture から第333便d の器の円盤)', notClaim: NOT_CLAIM });
  Object.assign(out.meta, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();
