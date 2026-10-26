// 第308便c(原仮定者の裁定(第102報)②「太陽の観測値の自転と、要求される慣性自転との乖離が大きい可能性が有る。つまり、銀河全体の慣性自転に由来する
// 引きずり軸回転の比率が大きい」・①「引きずりの計算は相互に行われているので、反作用を返すと二重計上にならないかを確認する」・原仮定者の裁定(第101報)
// 「慣性自転へのトルクのエネルギーの出所は、太陽系の惑星なら太陽の慣性自転 —— 反作用で太陽の慣性自転が減る。太陽は中心部の収縮で釣り合う」・
// 決断事項 AN355・AN348・統括の検証項目 R216): **要求される太陽の慣性自転と、銀河の慣性自転に由来する引きずり軸回転の見積もりの器**(器だけ)。
//
// Node だけ(対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、本の宣言 HP.allPresets() の質量・半径・位置・速度・自転・軸と
// relativeDrag の宣言〔W_bg・k = inertialR2.lambdaRs〕を読むだけ)。**html・本の宣言・エンジンの式は変えない** —— 鏡映の核・curl の核・三次元の CTL は器の中の
// 参照の純関数(tests/lib-w308c-sunspin.mjs・tests/lib-w307b-tide3d.mjs の ctl3)で測る。同じ便の他の枝のエンジンには依存しない。
//
// ■ 段
//   K(純関数の確かめ): 外部の級数と第307便a の直接の求積・鏡映の幾何(赤道で逆・45° で射影 0 —— ベクトルは横向き・軸上 0)・curl の 35.264°・R1/R2 の限界・
//     散逸の結合の仕事 ≤ 0・相互の駆動の恒等式・キックの厳密な増分・収縮。
//   S(要求される太陽の慣性自転 —— 第102報 ② の前半): 在位の惑星 7 本(宣言から探す)+ 木星 → イオ(第307便c の診断の配置)。
//     潮汐のブレーキ(k₂ = 1・Δt = 1 s の規格化 —— 符号だけが限界を決める)を打ち消す平行のトルクを、
//     R1(等しく反対のトルクで P_pair ≤ 0)と R2(散逸の結合 s∥ = ω_i − βΩ_☉ —— β は鏡映の核の A = 1 の値・Γ → ∞ の限界)で太陽の慣性自転の限界に。
//     公転の平均(固定の二体のケプラー・N = 256)・向きの整合・7 本の共通部分・表面の速さ(光速・破断との比)・観測の太陽で要る係数 A。
//   G(銀河を源とする引きずり軸回転 —— 第102報 ② の後半): 太陽の自転軸(本の宣言 = IAU の極)と銀河の北極・中心の向き(銀河座標の定義)から幾何、
//     銀河の源の宣言の候補(質量・引きずりの半径・V₀/R₀ の幅)× 核(鏡映 差分/速さ・curl)× 分母(対/行)の走査で太陽の位置の ω_D,gal と太陽の軸への射影。
//     分解の候補: Ω_☉,obs = Ω_☉,I + ω_D,gal∥ で S の限界から要る ω_D,gal∥ と見積もりの比(桁・向き)と、要る銀河の慣性自転。在位の銀河の本の扱いの記録。
//   M(相互の引きずりの二重計上の参照 —— 第102報 ①): 太陽 ↔ 木星・木星 ↔ イオ・対称な二体(等しい/違う自転 × 赤道/仰角 60°)で D(i←j)・D(j←i)・
//     (C) の候補の応答則のトルクと方式 (a) 相互・反作用なし (b) 相互 + 反作用 (c1) 片向き (c2) 対ごとに 1 回の散逸の結合。
//   C(収縮の診断): L 一定の収縮・核の I・L・引きずりの半径の宣言の候補ごとの強さの比・R1 の限界へ要る収縮。
// ■ 言わないこと: 「銀河の自転で太陽の自転を説明した」「太陽の自転を分解した」「金星の逆行を説明した」「帳簿が完全に閉じた」「自転が釣り合った」
//   (器は要る量と見積もりの表まで —— 天文の定数は出所の行つき・primary_numeric_verified = false)。
// ■ 使い方
//   node tests/exp-w308c-sunspin.mjs → 正本 tests/out/sunspin-w308c.json(段 sunspin-308c)
//   W308C_OUT=<json>(出力先)・W308C_TARGET=<html>(既定 beta/index.html)。全走行は数秒。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import { ctl3 } from './lib-w307b-tide3d.mjs';
import { sourceM1 } from './lib-w307a-sphereaxial.mjs';
import { keplerElements, keplerState } from './lib-w307c-spindecomp.mjs';
import { idsFromDecl, buildConfigs, unitsOf, bodyOf } from './exp-w307c-spindecomp.mjs';
import * as L from './lib-w308c-sunspin.mjs';
import { pinDecl315c, LEGACY7_DATA_FILE } from './lib-w315c-legacy7.mjs';   // 第315便c(決断事項 AN406・R244): 在位の 7 本を K1 へ移した世代では、この器は移行の前(af2f426)の宣言の写しで測る
// 第281便a の領域 hash の宣言(器と lib から deriveScope で引いた下限 + 本 11 本 —— 惑星 7・木星系 1・銀河 3)
const REGEN_SCOPE = {"presets":["galaxy","galaxyGeo2","galaxyStd","jupiterGalilean","jupiterSunInertial3d","marsSunInertial3d","mercurySunInertial3d","neptuneSunInertial3d","saturnSunInertial3d","uranusSunInertial3d","venusSunInertial3d"],"roots":["$","HP.allPresets","HP.dfmMeshVelocityFieldAt","HP.sim","HP.validatePreset","T","ctx","cw","sim"],"core":false,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w308c-sunspin-1';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const { add, sub, scale, dot, cross, norm, unit } = L;

/* ───────────── 天文の定数(出所の行つき —— ネットワークでの一次の照合はしていない: primary_numeric_verified = false) ───────────── */
const C0 = (value, unitStr, source) => Object.freeze({ value, unit: unitStr, source, primary_numeric_verified: false });
export const CONST = Object.freeze({
  obliquityArcsec: C0(84381.406, 'arcsec', 'IAU 2006 の歳差(Capitaine et al. 2003, A&A 412, 567)の J2000 の黄道傾斜 ε₀ —— 本の太陽の軸(黄道の傾き・方位)と IAU の極の照合に使う'),
  ngpRaDeg: C0(192.85948, 'deg', '銀河座標の定義(ICRS)—— 銀河の北極の赤経(Hipparcos and Tycho Catalogues, ESA SP-1200, Vol. 1 §1.5.3)'),
  ngpDecDeg: C0(27.12825, 'deg', '同 —— 銀河の北極の赤緯'),
  gcRaDeg: C0(266.40499, 'deg', '同 —— 銀河中心の向き(l = 0°・b = 0°)の赤経'),
  gcDecDeg: C0(-28.93617, 'deg', '同 —— 銀河中心の向きの赤緯'),
  R0kpc: C0([8.0, 8.2, 8.5], 'kpc', '太陽と銀河中心の距離 R₀: 中央 8.2 ± 0.1(Bland-Hawthorn & Gerhard 2016, ARA&A 54, 529)・8.5(IAU 1985 の推奨値)・8.0(幅の下側)'),
  V0kms: C0([220, 230, 240], 'km/s', '太陽の位置の銀河の回転の速さ Θ₀: 220(IAU 1985)・238 ± 15(Bland-Hawthorn & Gerhard 2016)・240 ± 8(Reid et al. 2014, ApJ 783, 130)—— 中央 230 で幅を走査'),
  zSunPc: C0(20.8, 'pc', '太陽の銀河面からの高さ z☉ = 20.8 ± 0.3 pc(Bennett & Bovy 2019, MNRAS 482, 1417)—— 銀河の中心から見た太陽の仰角 asin(z☉/R₀)'),
  massStellarMsun: C0(5e10, 'M☉', '銀河の星の総質量 5 ± 1 × 10¹⁰ M☉(Bland-Hawthorn & Gerhard 2016)'),
  massVirialMsun: C0(1.3e12, 'M☉', '銀河のビリアル質量 1.3 ± 0.3 × 10¹² M☉(Bland-Hawthorn & Gerhard 2016)'),
  pcMeters: C0(3.0856775814913673e16, 'm', 'IAU 2015 Resolution B2(1 pc = 648000/π au・au = 149597870700 m)'),
});
/** 走査の規格(正本に記録 —— QA は正本から読む) */
export const SCAN = Object.freeze({ RdKpc: [0.5, 1, 2, 4, 6], mass: ['stellar', 'enclosed', 'virial'], norms: ['diff', 'speed'], models: ['bevel', 'curl'], dens: ['pair', 'row'],
  central: { V0kms: 230, R0kpc: 8.2, mass: 'enclosed', RdKpc: 2, norm: 'diff', model: 'bevel', den: 'pair' } });
export const ORBIT_N = 256;
/** 相互の駆動の対称な二体(規格化の単位 —— 質量 1・半径 0.05・距離 1・q = 10・W = 0・τ_C = 1) */
export const SYM = Object.freeze({ m: 1, R: 0.05, r: 1, q: 10, W: 0, Om: 1 });
/** 収縮の診断: 2 層の例示の宣言(太陽の構造の値ではない —— 核の質量の比・核の半径の比)と収縮の比 */
export const CONTRACT = Object.freeze({ coreMassFrac: 0.5, coreRadiusFrac: 0.25, factors: [0.9, 0.5] });

/* ───────────── 宣言から本を探す(.findIndex で順に —— 走査の全体を変数に受けない) ───────────── */
const isPlanetPair = (p) => !!p && !!p.physics && p.physics.coord === '3d' && !!p.physics.relativeDrag && p.physics.relativeDrag.law === 'inertial'
  && !!p.physics.relativeDrag.inertialR2 && p.physics.relativeDrag.inertialR2.denom === 'pair' && Array.isArray(p.bodies) && p.bodies.length === 2
  && !!p.bodies[0].spinAxis && p.bodies[0].spinAxis.enable === true && !!p.bodies[1].spinAxis && p.bodies[1].spinAxis.enable === true;
const isGalaxyBook = (p) => !!p && p.scaleTier === 'galactic' && Array.isArray(p.claims) && p.claims.some((c) => c && c.metric === 'outerRotationBoostRatio')
  && Array.isArray(p.bodies) && p.bodies.length >= 2 && p.bodies[0].type === 'single' && p.bodies[1].type === 'disk';
function idsWhere(HP, pred) {
  const out = [];
  for (let k = 0; ;) { const p = HP.allPresets().find((q, idx) => idx >= k && pred(q)); if (!p) break; out.push(p.id); k = HP.allPresets().findIndex((q) => q === p) + 1; }
  return out;
}
const SUN_POLE_RE = /太陽の極 α0 ([0-9.]+)°・δ0 ([0-9.]+)°/;
const NAME_RE = /の([^の]+?)の極/;
/** 宣言から入力を作る(QA は正本の inputs から html を読まずに作り直す) */
export function inputsFromDecl(HP) {
  const pids = idsWhere(HP, isPlanetPair), gids = idsWhere(HP, isGalaxyBook);
  const byId = (id) => HP.allPresets().find((p) => p.id === id);
  const planets = pids.map((id) => {
    const p = byId(id), u = unitsOf(p), s = bodyOf(p, 0, '太陽'), m = NAME_RE.exec(p.bodies[1].spinAxis.source || ''), b = bodyOf(p, 1, m ? m[1] : id);
    const sp = SUN_POLE_RE.exec(p.bodies[0].spinAxis.source || '');
    return { id, emoji: p.emoji, name: b.label, G: u.G, c: u.c, k: u.k, W: u.Wbg, sun: s, planet: b,
      sunPole: sp ? { ra: Number(sp[1]), dec: Number(sp[2]), tiltDeg: p.bodies[0].spinAxis.tiltDeg, azimuthDeg: p.bodies[0].spinAxis.azimuthDeg } : null };
  }).sort((a, b) => norm(sub(a.planet.x, a.sun.x)) - norm(sub(b.planet.x, b.sun.x)));
  const ids307 = idsFromDecl(HP), cf = buildConfigs(HP, ids307), JI = cf.configs.find((c) => c.key === 'JIo'), S3 = cf.configs.find((c) => c.key === 'SJIo');
  const io = { preset: JI.preset, jovian: ids307.jovian, G: JI.G, c: JI.c, k: JI.k, W: JI.Wbg, jup: JI.bodies[0], io: JI.bodies[1], sunJ: S3.bodies[0], placement: cf.ioPlacement };
  const galaxyBooks = gids.map((id) => {
    const p = byId(id), c0 = p.bodies[0], dk = p.bodies[1], cl = p.claims.find((c) => c.metric === 'outerRotationBoostRatio');
    let boost = null;
    try { const mm = new RegExp(cl.descPattern).exec(JSON.stringify(p.descStruct || {})); if (mm) boost = Number(mm[1]); } catch (e) { boost = null; }
    return { id, emoji: p.emoji, centerMass: c0.m, centerSpin: c0.spin, centerPinned: c0.pinned === true, centerRadius: c0.radius, diskN: dk.n, diskRadius: dk.radius,
      diskVMode: dk.vMode || null, diskSpinMax: dk.spinMax, kFrame: p.physics.kFrame, geoPN: p.physics.geoPN, boost, window: cl.expected ? [cl.expected.min, cl.expected.max] : null };
  });
  return { planets, io, galaxyBooks };
}

/* ───────────── S: 要求される太陽の慣性自転 ───────────── */
const qOf = (P) => P.c * P.c / (2 * P.k * P.G);
const signStr = (x) => (x > 0 ? '正' : (x < 0 ? '負' : '0'));
/** 受け手 rec が源 src のまわりを回る二体(固定のケプラー)で、潮汐のブレーキ(k₂ = 1・Δt = 1 s)と β(A = 1 —— 源の単位の自転)の公転の平均と瞬間の値 */
export function receiverOf(P, srcB, rec, N = ORBIT_N) {
  const q = qOf(P), src = { m: srcB.m, R: srcB.R, q, W: P.W }, d0 = sub(rec.x, srcB.x), V0 = sub(rec.v, srcB.v);
  const el = keplerElements(d0, V0, P.G * (srcB.m + rec.m));
  const tide = (d, V) => ctl3({ G: P.G, k2: 1, lag: 1, R: rec.R, mj: srcB.m, r: scale(d, -1), V: scale(V, -1), spin: rec.omega, axis: rec.axis });
  const betas = (d) => ({ diff: dot(rec.axis, L.axialAt(d, srcB.axis, src, { model: 'bevel', norm: 'diff' })), speed: dot(rec.axis, L.axialAt(d, srcB.axis, src, { model: 'bevel', norm: 'speed' })),
    curl: dot(rec.axis, L.axialAt(d, srcB.axis, src, { model: 'curl' })) });
  const avg = (n) => { let br = 0, b = { diff: 0, speed: 0, curl: 0 }; for (let k = 0; k < n; k++) { const st = keplerState(el, k * el.P / n); br += tide(st.r, st.v).brake / n; const z = betas(st.r); for (const key of Object.keys(b)) b[key] += z[key] / n; } return { brake: br, beta: b }; };
  const A1 = avg(N), A2 = avg(N / 2), t0 = tide(d0, V0);
  const conv = Math.max(Math.abs(A1.brake - A2.brake) / Math.abs(A1.brake), ...Object.keys(A1.beta).map((k) => Math.abs(A1.beta[k] - A2.beta[k]) / Math.abs(A1.beta[k])));
  const sc = L.dragScale(norm(d0), src);
  return { el, brakeInst: t0.brake, brakeAvg: A1.brake, betaInst: betas(d0), betaAvg: A1.beta, orbitConv: conv, q: sc.qEff, diffOverSpeed: sc.diff / sc.speed,
    elevDeg: Math.asin(dot(unit(d0), srcB.axis)) / L.D2R, axisAngleDeg: L.angleDeg(rec.axis, srcB.axis), cosAxes: dot(rec.axis, srcB.axis) };
}
export function requiredSun(inputs) {
  const P0 = inputs.planets[0], sun = P0.sun, GM = P0.G * sun.m, cl = P0.c, Om = sun.omega;
  const rows = inputs.planets.map((P) => {
    const R = receiverOf(P, P.sun, P.planet), w = P.planet.omega;
    const r1 = L.r1Bound(R.brakeAvg, w, P.planet.axis, P.sun.axis), r1i = L.r1Bound(R.brakeInst, w, P.planet.axis, P.sun.axis);
    const r2 = {}; for (const k of ['diff', 'speed', 'curl']) r2[k] = L.r2Bound(R.brakeAvg, w, R.betaAvg[k]);
    // 観測の太陽で要る係数 A(R2 の限界 —— 変数を A に: s∥ = ω_i − (β₁ Ω_obs) A)
    const Areq = {}; for (const k of ['diff', 'speed', 'curl']) { const b = L.r2Bound(R.brakeAvg, w, R.betaAvg[k] * Om); Areq[k] = { sense: b.sense, bound: b.bound, positiveOk: L.satisfies(1e300, b) }; }
    // 瞬間の仕事率(k₂ = 1・Δt = 1 s —— 宣言の状態)
    const tau = scale(P.planet.axis, -R.brakeInst), pw = L.pairPower(tau, scale(P.planet.axis, w), scale(P.sun.axis, Om));
    // 限界でちょうど P_pair = 0・s∥ = 0(門)
    const tauA = scale(P.planet.axis, -R.brakeAvg);
    const r1Edge = r1.bound === null ? 0 : L.pairPower(tauA, scale(P.planet.axis, w), scale(P.sun.axis, r1.bound)).pair / Math.abs(dot(tauA, scale(P.planet.axis, w)));
    const r2Edge = Math.max(...['diff', 'speed', 'curl'].map((k) => Math.abs(w - R.betaAvg[k] * r2[k].bound) / Math.abs(w)));
    const surf = (x) => (x === null ? null : L.surface(sun.R, x, GM, cl));
    return { id: P.id, emoji: P.emoji, name: P.name, omega: w, n: R.el.n, e: R.el.e, a: R.el.a, axisAngleDeg: R.axisAngleDeg, cosAxes: R.cosAxes, elevDeg: R.elevDeg, qEff: R.q, diffOverSpeed: R.diffOverSpeed,
      brakeInst: R.brakeInst, brakeAvg: R.brakeAvg, betaInst: R.betaInst, betaAvg: R.betaAvg, orbitConv: R.orbitConv,
      r1, r1Inst: r1i, r1OverObs: r1.bound === null ? null : r1.bound / Om, r1Surface: surf(r1.bound), r1ObsOk: L.satisfies(Om, r1),
      r2, r2OverObs: { diff: r2.diff.bound / Om, speed: r2.speed.bound / Om, curl: r2.curl.bound / Om }, r2Surface: { diff: surf(r2.diff.bound), speed: surf(r2.speed.bound), curl: surf(r2.curl.bound) },
      Areq, power: pw, lossOverGain: -pw.src / pw.recv, r1Edge, r2Edge };
  });
  // 木星 → イオ(第307便c の診断の配置): 源 = 木星(観測の自転)・受け手 = イオ —— 木星の慣性自転の限界
  const I = inputs.io, Pj = { G: I.G, c: I.c, k: I.k, W: I.W }, RI = receiverOf(Pj, I.jup, I.io), wIo = I.io.omega;
  const ior = { name: 'イオ(木星の源)', omega: wIo, n: RI.el.n, e: RI.el.e, spinOverN: wIo / RI.el.n, sixE2: 6 * RI.el.e * RI.el.e, brakeInst: RI.brakeInst, brakeAvg: RI.brakeAvg, betaAvg: RI.betaAvg, orbitConv: RI.orbitConv,
    r1: L.r1Bound(RI.brakeAvg, wIo, I.io.axis, I.jup.axis), r1Inst: L.r1Bound(RI.brakeInst, wIo, I.io.axis, I.jup.axis), r2: {}, jupObs: I.jup.omega, elevDeg: RI.elevDeg, axisAngleDeg: RI.axisAngleDeg };
  for (const k of ['diff', 'speed', 'curl']) ior.r2[k] = L.r2Bound(RI.brakeAvg, wIo, RI.betaAvg[k]);
  ior.r1ObsOk = L.satisfies(I.jup.omega, ior.r1);
  ior.r2Surface = {}; for (const k of ['diff', 'speed', 'curl']) ior.r2Surface[k] = L.surface(I.jup.R, ior.r2[k].bound, I.G * I.jup.m, I.c);
  ior.signDelicate = Math.abs(ior.spinOverN - 1) < 10 * ior.sixE2;   // 宣言の自転と診断の軌道の n の差が 6e² の桁 —— 平均のブレーキの符号は軌道の細部に依る
  // 太陽–木星–イオ: 木星へのブレーキ(太陽 + イオ —— 瞬間)は符号が同じなら R1 の限界は同じ
  const jupT = (srcB) => ctl3({ G: I.G, k2: 1, lag: 1, R: I.jup.R, mj: srcB.m, r: sub(srcB.x, I.jup.x), V: sub(srcB.v, I.jup.v), spin: I.jup.omega, axis: I.jup.axis }).brake;
  const sj = { brakeSun: jupT(I.sunJ), brakeIo: jupT(I.io) }; sj.ratio = sj.brakeIo / sj.brakeSun; sj.r1 = L.r1Bound(sj.brakeSun + sj.brakeIo, I.jup.omega, I.jup.axis, I.sunJ.axis);
  // 7 本の共通部分(R1・R2 の 3 核)
  const joint = {};
  joint.r1 = L.intersect(rows.map((r) => ({ key: r.name, b: r.r1 })));
  for (const k of ['diff', 'speed', 'curl']) joint['r2' + k] = L.intersect(rows.map((r) => ({ key: r.name, b: r.r2[k] })));
  return { sunOmegaObs: Om, sunR: sun.R, sunGM: GM, sunBreak: L.surface(sun.R, Om, GM, cl), rows, io: ior, sjio: sj, joint };
}

/* ───────────── G: 銀河を源とする引きずり軸回転 ───────────── */
export function galaxyGeometry(inputs) {
  const sp = inputs.planets[0].sunPole, eps = CONST.obliquityArcsec.value / 3600;
  const aSun = inputs.planets[0].sun.axis, aIau = L.eqToEcl(L.radec(sp.ra, sp.dec), eps);
  const ngp = L.eqToEcl(L.radec(CONST.ngpRaDeg.value, CONST.ngpDecDeg.value), eps), gc = L.eqToEcl(L.radec(CONST.gcRaDeg.value, CONST.gcDecDeg.value), eps);
  const l90 = cross(ngp, gc), omHat = unit(cross(scale(gc, -1), l90));   // 太陽の位置 −ê_GC・速度 ê_l90 → 銀河の角運動量の向き
  return { aSun, aIau, sunAxisVsIauDeg: L.angleDeg(aSun, aIau), iauTiltAz: L.tiltAz(aIau), ngp, gc, ngpDotGc: dot(ngp, gc), omHat, omHatDotNgp: dot(omHat, ngp),
    sunAxisToNgpDeg: L.angleDeg(aSun, ngp), sunAxisToOmGalDeg: L.angleDeg(aSun, omHat), cosSunNgp: dot(aSun, ngp) };
}
/** 1 つの宣言の候補で太陽の位置の ω_D,gal(ベクトル)・太陽の軸への射影・横の割合 */
export function galaxyAt(geo, P, o) {
  const pc = CONST.pcMeters.value, R0 = o.R0kpc * 1e3 * pc, V0 = o.V0kms * 1e3, Om = V0 / R0, z = CONST.zSunPc.value * pc, el = Math.asin(z / R0);
  const msun = P.sunMass, M = o.mass === 'stellar' ? CONST.massStellarMsun.value * msun : (o.mass === 'virial' ? CONST.massVirialMsun.value * msun : V0 * V0 * R0 / P.G);
  const rhat = add(scale(geo.gc, -Math.cos(el)), scale(geo.ngp, Math.sin(el))), d = scale(rhat, R0), OmV = scale(geo.omHat, Om);
  const src = { m: M, R: o.RdKpc * 1e3 * pc, q: P.q, W: P.W };
  const pair = L.dragScale(R0, src), row = L.dragScale(R0, { ...src, extra: P.rowExtra });
  const rowFactor = o.den === 'row' ? row.den / pair.den : 1;
  const w = L.axialAt(d, OmV, src, { model: o.model, norm: o.norm, rowFactor: 1 / rowFactor });
  const par = dot(w, geo.aSun), perp = norm(sub(w, scale(geo.aSun, par)));
  return { M, Om, el, w, par, perp, perpFrac: perp / norm(w), perUnitOm: par / Om, amp: o.model === 'curl' ? pair.f : L.ampOf(pair, o.norm), qEff: pair.qEff, I: pair.I, D: pair.D, rowDenRatio: row.den / pair.den, terms: pair.terms };
}
export function galaxy(inputs, req) {
  const geo = galaxyGeometry(inputs), P0 = inputs.planets[0], q = qOf(P0);
  // 行の分母: 太陽の位置の他の源(在位の 7 本の惑星 —— 各本の宣言の距離)の I + D
  const rowExtra = inputs.planets.reduce((s, P) => { const r = norm(sub(P.planet.x, P.sun.x)); return s + q / (r * r) + P.planet.m / (r * r * r); }, 0);
  const Pg = { G: P0.G, q, W: P0.W, sunMass: P0.sun.m, rowExtra };
  const all = [];
  for (const V0kms of CONST.V0kms.value) for (const R0kpc of CONST.R0kpc.value) for (const mass of SCAN.mass) for (const RdKpc of SCAN.RdKpc) for (const model of SCAN.models) for (const nm of (SCAN.norms)) for (const den of SCAN.dens) {
    if (model === 'curl' && nm === 'speed') continue;   // curl は 1 通り(f と q から)
    const o = { V0kms, R0kpc, mass, RdKpc, model, norm: nm, den }, z = galaxyAt(geo, Pg, o);
    all.push({ ...o, par: z.par, perUnitOm: z.perUnitOm, perpFrac: z.perpFrac, amp: z.amp, qEff: z.qEff, terms: z.terms });
  }
  const c = SCAN.central;
  const central = SCAN.mass.flatMap((mass) => SCAN.RdKpc.map((RdKpc) => {
    const base = { V0kms: c.V0kms, R0kpc: c.R0kpc, mass, RdKpc }, g = (model, nm, den) => galaxyAt(geo, Pg, { ...base, model, norm: nm, den });
    const bd = g('bevel', 'diff', 'pair'), bs = g('bevel', 'speed', 'pair'), cu = g('curl', 'diff', 'pair'), br = g('bevel', 'diff', 'row');
    return { mass, RdKpc, M: bd.M, ampDiff: bd.amp, ampSpeed: bs.amp, qEff: bd.qEff, parDiff: bd.par, parSpeed: bs.par, parCurl: cu.par, parDiffRow: br.par, rowDenRatio: br.rowDenRatio, perpFrac: bd.perpFrac, ratioObs: bd.par / req.sunOmegaObs };
  }));
  const C = galaxyAt(geo, Pg, c);
  const ext = (f) => { const xs = all.filter(f); const mx = xs.reduce((a, b) => (Math.abs(b.par) > Math.abs(a.par) ? b : a)), mn = xs.reduce((a, b) => (Math.abs(b.par) < Math.abs(a.par) ? b : a));
    return { n: xs.length, maxAbs: mx.par, maxAt: { V0kms: mx.V0kms, R0kpc: mx.R0kpc, mass: mx.mass, RdKpc: mx.RdKpc }, minAbs: mn.par, allPositive: xs.every((x) => x.par > 0), maxTerms: Math.max(...xs.map((x) => x.terms)) }; };
  const extremes = [];
  for (const model of SCAN.models) for (const nm of (model === 'curl' ? ['diff'] : SCAN.norms)) for (const den of SCAN.dens) extremes.push({ model, norm: nm, den, ...ext((x) => x.model === model && x.norm === nm && x.den === den) });
  const maxPos = Math.max(...all.filter((x) => x.par > 0).map((x) => x.par), 0), maxNegAbs = Math.max(...all.filter((x) => x.par < 0).map((x) => -x.par), 0);
  // 分解の候補: Ω_☉,obs = Ω_☉,I + ω_D,gal∥ —— S の限界から要る ω_D,gal∥(向きつき)
  const Om = req.sunOmegaObs, flip = (s) => (s === 'ge' ? 'le' : (s === 'le' ? 'ge' : s));
  const need = (label, cond, b) => {
    if (!b || b.bound === null || b.sense === 'none' || b.sense === 'any') return { label, cond, sense: b ? b.sense : 'none', bound: null, needed: null, neededSense: null, zeroOk: b ? b.sense === 'any' : false };
    const nv = Om - b.bound, ns = flip(b.sense), zeroOk = L.satisfies(0, { sense: ns, bound: nv });
    const sign = zeroOk ? 0 : Math.sign(nv), est = sign > 0 ? maxPos : (sign < 0 ? maxNegAbs : 0);
    const per = C.perUnitOm;   // 中央の宣言(鏡映・差分・対)の銀河の自転 1 rad/s あたり
    const omGal = zeroOk ? 0 : nv / per;
    return { label, cond, sense: b.sense, bound: b.bound, needed: nv, neededSense: ns, zeroOk, signMatch: zeroOk ? null : est > 0, maxEstSameSign: est,
      ordersShort: (zeroOk || !(est > 0)) ? null : Math.log10(Math.abs(nv) / est), ordersShortAbs: zeroOk ? null : Math.log10(Math.abs(nv) / Math.max(maxPos, maxNegAbs)),
      omGalNeeded: omGal, omGalOverObs: omGal / C.Om, omGalEdgeOverC: Math.abs(omGal) * c.RdKpc * 1e3 * CONST.pcMeters.value / P0.c };
  };
  const cand = [];
  for (const r of req.rows) cand.push(need(r.name, 'R1', r.r1));
  for (const r of req.rows) cand.push(need(r.name, 'R2(鏡映・差分)', r.r2.diff));
  cand.push(need('7 本の R1 の下限(' + req.joint.r1.loBy + ')', 'R1 共通', { sense: 'ge', bound: req.joint.r1.lo }));
  cand.push(need('7 本の R1 の上限(' + req.joint.r1.hiBy + ')', 'R1 共通', { sense: 'le', bound: req.joint.r1.hi }));
  return { geometry: geo, rowExtra, central, centralDecl: { ...c, M: C.M, Om: C.Om, el: C.el, elDeg: C.el / L.D2R, par: C.par, perUnitOm: C.perUnitOm, perpFrac: C.perpFrac, qEff: C.qEff, I: C.I, D: C.D, W: P0.W, ratioObs: C.par / Om },
    extremes, nScan: all.length, maxPos, maxNegAbs, candidates: cand, books: inputs.galaxyBooks };
}

/* ───────────── M: 相互の引きずりの二重計上の参照 ───────────── */
const curlMatrix = (d, f, q, A = 1) => { const rh = unit(d); return [0, 1, 2].map((i) => [0, 1, 2].map((j) => A * f / 2 * ((2 - q) * (i === j ? 1 : 0) + q * rh[i] * rh[j]))); };
function kernelPair(bi, bj, P, kern) {
  // i の位置の j による: d = x_i − x_j・源 j
  const d = sub(bi.x, bj.x), src = { m: bj.m, R: bj.R, q: P.q, W: P.W }, sc = L.dragScale(norm(d), src);
  const B = kern === 'curl' ? curlMatrix(d, sc.f, sc.qEff) : L.bevelMatrix(d, bj.axis, L.ampOf(sc, kern === 'bevel-diff' ? 'diff' : 'speed'));
  return { B, D: L.matVec(B, scale(bj.axis, bj.omega)), amp: kern === 'curl' ? sc.f : L.ampOf(sc, kern === 'bevel-diff' ? 'diff' : 'speed') };
}
export function doubleCount(inputs) {
  const P0 = inputs.planets.find((P) => /木星/.test(P.name)) || inputs.planets[0], I = inputs.io;
  const sj = { key: 'SJ', ja: '太陽 ↔ 木星', i: P0.planet, j: P0.sun, P: { q: qOf(P0), W: P0.W }, units: 'SI(τ_C = 1 s)' };
  const ji = { key: 'JIo', ja: '木星 ↔ イオ', i: I.io, j: I.jup, P: { q: qOf(I), W: I.W }, units: 'SI(τ_C = 1 s)' };
  const sym = (key, ja, elDeg, Oj) => { const e = elDeg * L.D2R, d = [Math.cos(e), 0, Math.sin(e)];
    return { key, ja, i: { label: 'i', m: SYM.m, R: SYM.R, x: scale(d, SYM.r), axis: [0, 0, 1], omega: SYM.Om }, j: { label: 'j', m: SYM.m, R: SYM.R, x: [0, 0, 0], axis: [0, 0, 1], omega: Oj }, P: { q: SYM.q, W: SYM.W }, units: '規格化(τ_C = 1)' }; };
  const cases = [sj, ji, sym('SYMeq', '対称・赤道・等しい自転', 0, SYM.Om), sym('SYMeq2', '対称・赤道・j が 2 倍の自転', 0, 2 * SYM.Om), sym('SYMfw', '対称・仰角 60°・等しい自転', 60, SYM.Om), sym('SYMfw2', '対称・仰角 60°・j が 2 倍の自転', 60, 2 * SYM.Om)];
  const rows = [];
  for (const cs of cases) for (const kern of ['bevel-diff', 'bevel-speed', 'curl']) {
    const Ii = 0.4 * cs.i.m * cs.i.R * cs.i.R, Ij = 0.4 * cs.j.m * cs.j.R * cs.j.R;
    const kij = kernelPair(cs.i, cs.j, cs.P, kern), kji = kernelPair(cs.j, cs.i, cs.P, kern);
    const ms = L.mutualSchemes({ Ii, Ij, ai: cs.i.axis, aj: cs.j.axis, Oi: scale(cs.i.axis, cs.i.omega), Oj: scale(cs.j.axis, cs.j.omega), Dij: kij.D, Dji: kji.D, Bij: kij.B, tauC: 1 });
    const one = Math.abs(ms.TijPar), sc = (t) => t / one;
    const pw = (x) => x / (one * Math.abs(cs.i.omega));
    rows.push({ key: cs.key, ja: cs.ja, units: cs.units, kern, Dij: dot(cs.i.axis, kij.D), Dji: dot(cs.j.axis, kji.D), DijOverOmI: dot(cs.i.axis, kij.D) / cs.i.omega, DjiOverOmJ: dot(cs.j.axis, kji.D) / cs.j.omega,
      kappaRatio: (Ii * kij.amp) / (Ij * kji.amp), TijPar: ms.TijPar, TjiPar: ms.TjiPar, rhoT: ms.rhoT, spinRatio: cs.i.omega / cs.j.omega,
      a: { ti: sc(ms.a.tiPar), tj: sc(ms.a.tjPar), dL: ms.a.dLnorm / one, P: pw(ms.a.power) }, b: { ti: sc(ms.b.tiPar), tj: sc(ms.b.tjPar), dL: ms.b.dLnorm / one, P: pw(ms.b.power) },
      c1: { ti: sc(ms.c1.tiPar), tj: sc(ms.c1.tjPar), dL: ms.c1.dLnorm / one, P: pw(ms.c1.power) },
      // (c2) は自分の受け手のトルク |τ_i| で割る(Γ に依らない比 —— 散逸の結合は受け手の自転を目標 𝔅Ω_j へ緩和する)
      c2: { ti: ms.c2.tiPar / Math.abs(ms.c2.tiPar), tj: ms.c2.tjPar / Math.abs(ms.c2.tiPar), dL: ms.c2.dLnorm / Math.abs(ms.c2.tiPar), P: ms.c2.power / (Math.abs(ms.c2.tiPar) * Math.abs(cs.i.omega)),
        diss: ms.c2.dissipation / (Math.abs(ms.c2.tiPar) * Math.abs(cs.i.omega)), slipRel: ms.c2.sPar / cs.i.omega },
      zMax: Math.max(cs.i.R, cs.j.R) * Math.max(cs.i.R, cs.j.R) / dot(sub(cs.i.x, cs.j.x), sub(cs.i.x, cs.j.x)),
      bIsSumOfOneWay: ms.bIsSumOfOneWay, bRaw: norm(ms.b.ti) + norm(ms.b.tj) });
  }
  return { rows, tauC: 1, note: '(a)(b)(c1) のトルクは片向きの駆動 ‖T(i←j)·â_i‖ で割り、仕事率は ‖T(i←j)·â_i‖·‖Ω_i‖ で割る。(c2) は自分の ‖τ_i‖ と ‖τ_i‖·‖Ω_i‖ で割る(τ_C・Γ に依らない比)' };
}

/* ───────────── C: 収縮の診断 ───────────── */
export function contraction(inputs, req) {
  const P0 = inputs.planets.find((P) => /木星/.test(P.name)) || inputs.planets[0], sun = P0.sun, r = norm(sub(P0.planet.x, P0.sun.x));
  const m = sun.m, Rs = sun.R, Om = sun.omega, a = 0.4, mc = CONTRACT.coreMassFrac * m, Rc0 = CONTRACT.coreRadiusFrac * Rs, me = m - mc;
  const L0 = a * m * Rs * Rs * Om, E0 = 0.5 * L0 * Om, Lc0 = a * mc * Rc0 * Rc0 * Om;
  const lo = req.joint.r1.lo, xR1 = Math.sqrt(Om / lo);
  const rows = CONTRACT.factors.concat([xR1]).map((x) => {
    const Rc = x * Rc0, Omc = Om / (x * x);   // 核だけが L 一定で収縮(外層は観測の自転のまま)
    const S = (mm, Rd, w) => L.dragStrength(r, mm, Rd, w);
    const one = S(mc, Rc0, Om), whole = S(m, Rs, Om), env = S(me, Rs, Om);
    return { x, omegaRatio: Omc / Om, energyRatio: (0.5 * Lc0 * Omc) / (0.5 * Lc0 * Om), Lratio: (a * mc * Rc * Rc * Omc) / Lc0,
      cand: { sameRadius: S(mc, Rc, Omc) / one, coreOmegaSurfaceRadius: S(m, Rs, Omc) / whole, surfaceOmega: S(m, Rs, Om) / whole, layerSum: (S(mc, Rc, Omc) + env) / (one + env) },
      dEcore: 0.5 * Lc0 * Omc - 0.5 * Lc0 * Om };
  });
  const ex1 = L.changeInertia(8, 4, 2), ex2 = L.changeInertia(8, 4, 3, -2);
  return { r, rOverR: r / Rs, alpha: a, L0, E0, Lc0, binding: 0.6 * P0.G * m * m / Rs, r1lo: lo, r1loBy: req.joint.r1.loBy, xR1, rows, examples: [ex1, ex2],
    farLeadingInvariant: L.dragStrength(1e4, 1, 0.5, 4) / L.dragStrength(1e4, 1, 1, 1) };
}

/* ───────────── 受け手の体積平均と中心の値(鏡映・速さの型) ───────────── */
export function receiverSize(inputs) {
  const P0 = inputs.planets.find((P) => /木星/.test(P.name)), Pv = inputs.planets.find((P) => /金星/.test(P.name)), I = inputs.io;
  const pairs = [['金星 ← 太陽', Pv.planet, Pv.sun, qOf(Pv), Pv.W], ['木星 ← 太陽', P0.planet, P0.sun, qOf(P0), P0.W], ['イオ ← 木星', I.io, I.jup, qOf(I), I.W], ['木星 ← イオ', I.jup, I.io, qOf(I), I.W]];
  return pairs.map(([ja, rec, s, q, W]) => {
    const src = { m: s.m, R: s.R, q, W }, d = sub(rec.x, s.x), Om = scale(s.axis, s.omega), field = (p) => L.axialAt(p, Om, src, { model: 'bevel', norm: 'speed' });
    const v16 = L.volumeMean(d, rec.R, field, 16), v12 = L.volumeMean(d, rec.R, field, 12), c = field(d);
    return { ja, par: dot(v16, rec.axis), ratio: dot(v16, rec.axis) / rec.omega, volMinusCenter: norm(sub(v16, c)) / norm(v16), order12to16: norm(sub(v12, v16)) / norm(v16), RoverR: rec.R / norm(d) };
  });
}

/* ───────────── 全体 ───────────── */
export function computeAll(inputs) {
  const t = {}; let t0 = Date.now();
  const checks = L.checksOf(sourceM1); t.checks = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now();
  const req = requiredSun(inputs); t.required = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now();
  const gal = galaxy(inputs, req); t.galaxy = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now();
  const dc = doubleCount(inputs); t.doubleCount = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now();
  const con = contraction(inputs, req), rsz = receiverSize(inputs); t.contraction = { wallSec: (Date.now() - t0) / 1000 };
  const J = { checks, required: req, galaxy: gal, doubleCount: dc, contraction: con, receiverSize: rsz };
  J.findings = findingsOf(J);
  J.gates = gatesOf(J, inputs);
  J.ok = Object.values(J.gates).every(Boolean);
  J.timing = t;
  return J;
}
export function runAll(HP) {
  const inputs = inputsFromDecl(HP);
  return { inputs, constants: CONST, scan: SCAN, sym: SYM, contractDecl: CONTRACT, orbitN: ORBIT_N, ...computeAll(inputs) };
}
/** 正本の inputs から作り直す(QA —— html を読まない) */
export function recompute(J) { return computeAll(J.inputs); }

/* ───────────── 所見・門 ───────────── */
const rowByName = (J, re) => J.required.rows.find((r) => re.test(r.name));
export function findingsOf(J) {
  const R = J.required, v = rowByName(J, /金星/), j = rowByName(J, /木星/), me = rowByName(J, /水星/), u = rowByName(J, /天王星/);
  const sj = J.doubleCount.rows.find((r) => r.key === 'SJ' && r.kern === 'bevel-diff');
  return {
    r1JointInfeasible: R.joint.r1.feasible === false,
    r1VenusRetroJupiterPro: v.r1.sense === 'le' && v.r1.bound < 0 && j.r1.sense === 'ge' && j.r1.bound > 0,
    r2VenusProJupiterRetro: v.r2.diff.sense === 'ge' && v.r2.diff.bound > 0 && j.r2.diff.sense === 'le' && j.r2.diff.bound < 0,
    r2JointInfeasible: R.joint.r2diff.feasible === false && R.joint.r2speed.feasible === false && R.joint.r2curl.feasible === false,
    mercuryR1ByObs: me.r1ObsOk === true,
    uranusR1BeyondBreak: u.r1Surface.vOverBreak > 1,
    r2BeyondLight: R.rows.every((r) => r.r2Surface.diff.vOverC > 1 && r.r2Surface.speed.vOverC > 1),
    galaxySignPositive: J.galaxy.extremes.every((e) => e.allPositive),
    galaxyShortAll: J.galaxy.candidates.every((c) => c.zeroOk || c.ordersShortAbs > 10),
    bAntiDissipativeSJ: sj.b.P > 0,
    jupiterPositiveAImpossible: !j.Areq.diff.positiveOk && !j.Areq.speed.positiveOk,
  };
}
export function gatesOf(J, inputs) {
  const R = J.required, fin = (x) => Number.isFinite(x);
  const g = {
    checks: Object.values(J.checks.gates).every(Boolean),
    planets7: inputs.planets.length === 7 && inputs.planets.every((P) => P.sun.m === inputs.planets[0].sun.m && P.sun.omega === inputs.planets[0].sun.omega && norm(sub(P.sun.axis, inputs.planets[0].sun.axis)) === 0 && !!P.sunPole),
    sunAxisIau: J.galaxy.geometry.sunAxisVsIauDeg < 1e-6,
    finite: R.rows.every((r) => [r.brakeAvg, r.brakeInst, r.betaAvg.diff, r.betaAvg.speed, r.betaAvg.curl, r.power.pair].every(fin)) && [R.io.brakeAvg, R.io.betaAvg.diff].every(fin),
    orbitAverage: R.rows.every((r) => r.orbitConv < 1e-6) && R.io.orbitConv < 1e-6,
    r1Edge: R.rows.every((r) => Math.abs(r.r1Edge) < 1e-12),
    r2Edge: R.rows.every((r) => r.r2Edge < 1e-12),
    powerIdentity: R.rows.every((r) => r.power.pair === r.power.recv + r.power.src),
    farFieldRegime: R.rows.every((r) => Math.abs(r.qEff - 3) < 1e-3 && Math.abs(r.diffOverSpeed - 2) < 2e-3),
    galaxyFrame: Math.abs(J.galaxy.geometry.ngpDotGc) < 1e-6 && Math.abs(J.galaxy.geometry.omHatDotNgp + 1) < 1e-12 && J.galaxy.centralDecl.elDeg < 1,
    galaxyScan: J.galaxy.nScan === CONST.V0kms.value.length * CONST.R0kpc.value.length * SCAN.mass.length * SCAN.RdKpc.length * 3 * SCAN.dens.length && J.galaxy.extremes.every((e) => fin(e.maxAbs) && e.maxTerms < 20000),
    mutualIdentity: J.doubleCount.rows.every((r) => r.bIsSumOfOneWay < 1e-12 && r.c2.diss <= 0 && fin(r.rhoT)) && J.doubleCount.rows.filter((r) => r.key === 'SYMeq' || r.key === 'SYMfw').every((r) => r.bRaw === 0),
    kappaSymmetric: J.doubleCount.rows.every((r) => Math.abs(r.kappaRatio - 1) < 2 * r.zMax + 1e-6),   // 先頭の項で I_i amp_ij = I_j amp_ji(同じ α・同じ分母)—— 残りは M1 の (R/r)² の項
    contraction: Math.abs(J.contraction.rows[0].Lratio - 1) < 1e-12 && J.contraction.rows.every((x) => Math.abs(x.cand.sameRadius - 1) < 1e-5 && x.cand.surfaceOmega === 1),
    receiverSize: J.receiverSize.every((x) => x.order12to16 < 1e-12 && x.volMinusCenter < 1e-2),
  };
  return g;
}

/* ───────────── 表(PHYSICS の行)・数 ───────────── */
const f3 = (v) => (v === null || v === undefined || !Number.isFinite(v)) ? '—' : (v === 0 ? '0' : (Math.abs(v) >= 1e-3 && Math.abs(v) < 1e4 ? String(Number(v.toPrecision(4))) : v.toExponential(3)));
export const fmtNum = f3;
const SENSE = { ge: '≥', le: '≤', any: '(条件なし)', none: '(解なし)', eq: '=' };
const bnd = (b) => (b.bound === null ? SENSE[b.sense] : `${SENSE[b.sense]} ${f3(b.bound)}`);
const KJ = { diff: '鏡映・差分', speed: '鏡映・速さ', curl: 'curl' };
export function physicsTables(J) {
  const R = J.required, T = [];
  T.push('| 本 | 天体 | 観測の自転 ω [rad/s] | 公転の n [rad/s] | e | 軸と太陽の軸の角 [°] | 太陽の赤道からの仰角 [°] | ⟨ブレーキ⟩ [N m](k₂ = 1・Δt = 1 s) | 瞬間のブレーキの符号 | R1: Ω_☉,I の限界 [rad/s] | 限界 / Ω_☉,obs | 表面の速さ / c | 表面の速さ / 破断 | 観測の太陽で満たす |');
  T.push('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|');
  for (const r of R.rows) T.push(`| ${r.emoji} | ${r.name} | ${f3(r.omega)} | ${f3(r.n)} | ${f3(r.e)} | ${f3(r.axisAngleDeg)} | ${f3(r.elevDeg)} | ${f3(r.brakeAvg)} | ${signStr(r.brakeInst)} | ${bnd(r.r1)} | ${f3(r.r1OverObs)} | ${f3(r.r1Surface ? r.r1Surface.vOverC : null)} | ${f3(r.r1Surface ? r.r1Surface.vOverBreak : null)} | ${r.r1ObsOk ? 'はい' : 'いいえ'} |`);
  const io = R.io;
  T.push(`| 🟠(診断の配置) | ${io.name} | ${f3(io.omega)} | ${f3(io.n)} | ${f3(io.e)}(ω/n − 1 = ${f3(io.spinOverN - 1)}・6e² = ${f3(io.sixE2)}) | ${f3(io.axisAngleDeg)} | ${f3(io.elevDeg)} | ${f3(io.brakeAvg)} | ${signStr(io.brakeInst)}${Math.sign(io.brakeInst) !== Math.sign(io.brakeAvg) ? '(平均と逆)' : ''}${io.signDelicate ? '・平均の符号は軌道の細部に依る' : ''} | Ω_木星,I ${bnd(io.r1)} | ${f3(io.r1.bound === null ? null : io.r1.bound / io.jupObs)}(木星の観測の自転に対し) | — | — | ${io.r1ObsOk ? 'はい' : 'いいえ'}(木星の観測の自転) |`);
  T.push('');
  T.push('| 天体 | 核 | ⟨β⟩(A = 1・太陽の単位の自転あたり) | R2: Ω_☉,I の限界 [rad/s](Γ → ∞) | 限界 / Ω_☉,obs | 表面の速さ / c | 観測の太陽で要る係数 A | 正の A で足りるか |');
  T.push('|---|---|---|---|---|---|---|---|');
  for (const r of R.rows) for (const k of ['diff', 'speed', 'curl']) T.push(`| ${r.name} | ${KJ[k]} | ${f3(r.betaAvg[k])} | ${bnd(r.r2[k])} | ${f3(r.r2OverObs[k])} | ${f3(r.r2Surface[k].vOverC)} | A ${bnd(r.Areq[k])} | ${r.Areq[k].positiveOk ? 'はい' : 'いいえ'} |`);
  for (const k of ['diff', 'speed', 'curl']) T.push(`| ${io.name} | ${KJ[k]} | ${f3(io.betaAvg[k])}(木星の単位の自転あたり) | Ω_木星,I ${bnd(io.r2[k])} | ${f3(io.r2[k].bound / io.jupObs)}(木星の観測の自転に対し) | ${f3(io.r2Surface[k].vOverC)}(木星の表面) | — | — |`);
  T.push('');
  T.push('| 天体 | 受け手の仕事率 τ·Ω_i [W] | 太陽の自転の仕事率 −τ·Ω_☉,obs [W] | P_pair [W] | 太陽の損失 / 受け手の利得 |');
  T.push('|---|---|---|---|---|');
  for (const r of R.rows) T.push(`| ${r.name} | ${f3(r.power.recv)} | ${f3(r.power.src)} | ${f3(r.power.pair)} | ${f3(r.lossOverGain)} |`);
  T.push('');
  T.push('| 条件 | 下限(天体) | 上限(天体) | 7 本の共通の解 |');
  T.push('|---|---|---|---|');
  const jn = (x) => `${f3(Number.isFinite(x.lo) ? x.lo : null)}(${x.loBy || '—'})`, jx = (x) => `${f3(Number.isFinite(x.hi) ? x.hi : null)}(${x.hiBy || '—'})`;
  T.push(`| R1(等しく反対のトルク・P_pair ≤ 0) | ${jn(R.joint.r1)} | ${jx(R.joint.r1)} | ${R.joint.r1.feasible ? 'あり' : 'なし'} |`);
  for (const k of ['diff', 'speed', 'curl']) T.push(`| R2(${KJ[k]}) | ${jn(R.joint['r2' + k])} | ${jx(R.joint['r2' + k])} | ${R.joint['r2' + k].feasible ? 'あり' : 'なし'} |`);
  T.push(`| 太陽–木星–イオ: 木星へのブレーキ(瞬間)イオ / 太陽 | ${f3(R.sjio.ratio)} | R1 の限界 ${bnd(R.sjio.r1)} | — |`);
  T.push('');
  const G = J.galaxy, geo = G.geometry, cd = G.centralDecl;
  T.push('| 銀河の幾何(黄道 J2000 の枠) | 値 |');
  T.push('|---|---|');
  T.push(`| 本の太陽の軸と IAU の極(α₀, δ₀)の差 [°] | ${f3(geo.sunAxisVsIauDeg)} |`);
  T.push(`| 太陽の自転軸と銀河の北極のなす角 [°] | ${f3(geo.sunAxisToNgpDeg)} |`);
  T.push(`| 太陽の自転軸と銀河の角運動量の向きのなす角 [°] | ${f3(geo.sunAxisToOmGalDeg)} |`);
  T.push(`| 銀河の角運動量の向き · 銀河の北極 | ${f3(geo.omHatDotNgp)} |`);
  T.push(`| 銀河の中心から見た太陽の仰角 [°] | ${f3(cd.elDeg)} |`);
  T.push(`| 中央の宣言: 鏡映・差分・対の ω_D,gal の太陽の軸への射影 / 銀河の自転 | ${f3(cd.perUnitOm)} |`);
  T.push(`| 同: 太陽の軸に垂直な割合 | ${f3(cd.perpFrac)} |`);
  T.push(`| 同: q_eff(分母の距離則)・慣性決定力 I = q/r² [kg/m³]・D = m/r³・W_bg | ${f3(cd.qEff)}・${f3(cd.I)}・${f3(cd.D)}・${f3(cd.W)} |`);
  T.push(`| 行の分母: 太陽の位置の惑星 7 本の I + D [kg/m³] | ${f3(G.rowExtra)} |`);
  T.push('');
  T.push('| 銀河の質量の宣言 | M [kg] | 引きずりの半径 R_d [kpc] | 振幅(差分 ‖dg/dr‖) | 振幅(速さ g/r) | ω_D,gal∥(鏡映・差分・対)[rad/s] | 同(鏡映・速さ・対) | 同(curl・対) | 同(鏡映・差分・行) | 行 / 対の分母の比 | 鏡映・差分・対 / Ω_☉,obs |');
  T.push('|---|---|---|---|---|---|---|---|---|---|---|');
  const MJ = { stellar: '星の総質量', enclosed: 'V₀²R₀/G', virial: 'ビリアル' };
  for (const x of G.central) T.push(`| ${MJ[x.mass]} | ${f3(x.M)} | ${f3(x.RdKpc)} | ${f3(x.ampDiff)} | ${f3(x.ampSpeed)} | ${f3(x.parDiff)} | ${f3(x.parSpeed)} | ${f3(x.parCurl)} | ${f3(x.parDiffRow)} | ${f3(x.rowDenRatio)} | ${f3(x.ratioObs)} |`);
  T.push('');
  T.push(`| 核 | 分母 | 走査の数 | ‖ω_D,gal∥‖ の最大 [rad/s] | その宣言(V₀ km/s・R₀ kpc・質量・R_d kpc) | ‖ω_D,gal∥‖ の最小 | 全部が正(太陽の自転と同じ向き) |`);
  T.push('|---|---|---|---|---|---|---|');
  for (const e of G.extremes) T.push(`| ${e.model === 'curl' ? 'curl' : KJ[e.norm]} | ${e.den === 'pair' ? '対' : '行'} | ${e.n} | ${f3(e.maxAbs)} | ${e.maxAt.V0kms}・${e.maxAt.R0kpc}・${MJ[e.maxAt.mass]}・${e.maxAt.RdKpc} | ${f3(e.minAbs)} | ${e.allPositive ? 'はい' : 'いいえ'} |`);
  T.push('');
  T.push('| 要求(天体・条件) | Ω_☉,I の限界 [rad/s] | 要る ω_D,gal∥ = Ω_☉,obs − Ω_☉,I [rad/s] | 引きずりなしで足りるか | 見積もり(走査の最大・同じ向き)と向き | 桁の差 log₁₀(要る/見積もり) | 要る銀河の慣性自転(中央の宣言)[rad/s] | 同 / 観測の V₀/R₀ | R_d‖Ω_gal,I‖/c |');
  T.push('|---|---|---|---|---|---|---|---|---|');
  for (const c of G.candidates) {
    if (c.needed === null) { T.push(`| ${c.label}・${c.cond} | ${SENSE[c.sense]} | — | ${c.zeroOk ? 'はい' : '—'} | — | — | — | — | — |`); continue; }
    T.push(`| ${c.label}・${c.cond} | ${SENSE[c.sense]} ${f3(c.bound)} | ${SENSE[c.neededSense]} ${f3(c.needed)} | ${c.zeroOk ? 'はい' : 'いいえ'} | ${c.zeroOk ? '—' : (c.signMatch ? f3(c.maxEstSameSign) + '(向きが合う)' : '同じ向きの見積もりなし(向きが逆)')} | ${c.zeroOk ? '—' : f3(c.signMatch ? c.ordersShort : c.ordersShortAbs)} | ${c.zeroOk ? '—' : f3(c.omGalNeeded)} | ${c.zeroOk ? '—' : f3(c.omGalOverObs)} | ${c.zeroOk ? '—' : f3(c.omGalEdgeOverC)} |`);
  }
  T.push('');
  T.push('| 在位の銀河の本 | 中心の質量 | 中心の自転(宣言の入力) | 中心は固定 | 円盤の初速 | 円盤の自転の上限 | kFrame | geoPN | 外縁の増強(説明の実測) | 窓 |');
  T.push('|---|---|---|---|---|---|---|---|---|---|');
  for (const b of G.books) T.push(`| ${b.emoji} ${b.id} | ${f3(b.centerMass)} | ${f3(b.centerSpin)} | ${b.centerPinned ? 'はい' : 'いいえ'} | ${b.diskVMode || '—'} | ${f3(b.diskSpinMax)} | ${f3(b.kFrame)} | ${f3(b.geoPN)} | ${f3(b.boost)} | ${b.window ? b.window.join('〜') : '—'} |`);
  T.push('');
  T.push('| 対 | 核 | D(i←j)·â_i | D(j←i)·â_j | I_i amp_ij / I_j amp_ji | ρ = T(j←i)/(−T(i←j))(â_j へ) | Ω_i/Ω_j | (a) i・j・‖ΔL‖・P | (b) i・j・‖ΔL‖・P | (c1) i・j・‖ΔL‖・P | (c2) i・j・‖ΔL‖・P(自分の τ_i で割る) |');
  T.push('|---|---|---|---|---|---|---|---|---|---|---|');
  const sch = (s) => `${f3(s.ti)}・${f3(s.tj)}・${f3(s.dL)}・${f3(s.P)}`;
  for (const r of J.doubleCount.rows) T.push(`| ${r.ja} | ${r.kern} | ${f3(r.Dij)} | ${f3(r.Dji)} | ${f3(r.kappaRatio)} | ${f3(r.rhoT)} | ${f3(r.spinRatio)} | ${sch(r.a)} | ${sch(r.b)} | ${sch(r.c1)} | ${sch(r.c2)} |`);
  T.push('');
  const Cn = J.contraction;
  T.push('| 核の収縮 R_c/R_c0(L 一定) | Ω の比 | 回転のエネルギーの比 | L の比 | (i) 同じ半径(R_d = R_c・Ω_c) | (ii) 核の角速度・表面の半径 | (iii) 表面の角速度 | (iv) 層ごとの和 | 核の回転のエネルギーの増分 [J] |');
  T.push('|---|---|---|---|---|---|---|---|---|');
  for (const x of Cn.rows) T.push(`| ${f3(x.x)} | ${f3(x.omegaRatio)} | ${f3(x.energyRatio)} | ${f3(x.Lratio)} | ${f3(x.cand.sameRadius)} | ${f3(x.cand.coreOmegaSurfaceRadius)} | ${f3(x.cand.surfaceOmega)} | ${f3(x.cand.layerSum)} | ${f3(x.dEcore)} |`);
  T.push('');
  T.push('| 受け手 ← 源(鏡映・速さ) | 体積平均の ω_D·â [rad/s] | / 受け手の観測の自転 | 体積平均と中心の値の差 | 求積 12 と 16 の差 | R_受け手/r |');
  T.push('|---|---|---|---|---|---|');
  for (const x of J.receiverSize) T.push(`| ${x.ja} | ${f3(x.par)} | ${f3(x.ratio)} | ${f3(x.volMinusCenter)} | ${f3(x.order12to16)} | ${f3(x.RoverR)} |`);
  return T.join('\n');
}
/** 正本から作る数の文字列(PHYSICS の本文に入っていること —— QA が照合) */
export function docNumbers(J) {
  const R = J.required, v = rowByName(J, /金星/), j = rowByName(J, /木星/), s = rowByName(J, /土星/), u = rowByName(J, /天王星/), G = J.galaxy;
  const sjb = J.doubleCount.rows.find((r) => r.key === 'SJ' && r.kern === 'bevel-diff');
  return [f3(j.r1.bound), f3(j.r1OverObs), f3(v.r1.bound), f3(s.r1.bound), f3(u.r1.bound), f3(u.r1Surface.vOverBreak), f3(j.lossOverGain), f3(j.r2.diff.bound), f3(v.r2.diff.bound),
    f3(G.geometry.sunAxisToNgpDeg), f3(G.centralDecl.perUnitOm), f3(G.centralDecl.par), f3(G.extremes.find((e) => e.model === 'bevel' && e.norm === 'diff' && e.den === 'pair').maxAbs), f3(sjb.rhoT), f3(J.contraction.xR1)]
    .filter((x) => x !== '—' && x !== '0');
}
const NOT_CLAIM = ['銀河の自転で太陽の自転を説明した', '太陽の自転を分解した', '金星の逆行を説明した', '帳簿が完全に閉じた', '自転が釣り合った', '係数 A が決まった'];

export async function main() {
  const TARGET = process.env.W308C_TARGET || 'beta/index.html';
  const OUT = process.env.W308C_OUT || path.join(ROOT, 'tests', 'out', 'sunspin-w308c.json');
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now();
  const W281A_SCOPE = w281aScopeStamp(html, REGEN_SCOPE);
  const { HP } = loadHtmlMain(html);
  pinDecl315c();   // 第315便c(AN406): 在位の 7 本の宣言を移行の前の写しへ(本ごとの門 —— 基点の html では no-op・正本の欄は足さない)
  const R = runAll(HP);
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w308c-sunspin.mjs', target: TARGET,
    targetSha256: crypto.createHash('sha256').update(fs.readFileSync(html)).digest('hex'),
    ruling: '原仮定者の裁定(第102報)②(太陽の観測の自転と要求される慣性自転の乖離・銀河の慣性自転に由来する引きずり軸回転の比率)・①(相互の引きずりに反作用を返すと二重計上にならないか)・原仮定者の裁定(第101報)((C) のエネルギーの出所は太陽の慣性自転・中心部の収縮で釣り合う・軸引きずりは軸方向に対する角度差の 2 倍で傾いた軸)・決断事項 AN355・AN348・統括の検証項目 R216',
    ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w308c-sunspin.mjs', 'tests/lib-w315c-legacy7.mjs', 'tests/lib-w308c-sunspin.mjs', 'tests/exp-w307c-spindecomp.mjs', 'tests/lib-w307c-spindecomp.mjs', 'tests/lib-w307b-tide3d.mjs', 'tests/lib-w307a-sphereaxial.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第308便c', target: TARGET, code: CODE, inputs: [TARGET, LEGACY7_DATA_FILE] }), {
    harnessVersion: HARNESS_VERSION,
    engine: 'Node(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— 本の宣言を読むだけ。鏡映の核・curl の核・三次元の CTL は器の参照の純関数〔エンジンの式ではない〕)',
    notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), JSON.stringify(out.findings), out.elapsedS + ' s', JSON.stringify(out.timing));
}
if (IS_MAIN) await main();
