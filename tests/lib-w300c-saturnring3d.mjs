// 第300便c(原仮定者の裁定(第90報)⑥「土星の輪の geoPN=3 版の三次元サンプルを作成する」・統括の検証項目 R177)——
// **土星の輪の geoPN=3 三次元の本 🍩 saturnRingInertial3d の宣言の生成器**(純関数 —— html の HP を受け取って既存の本から読む。
// エンジンは走らせない。器 tests/exp-w300c-saturnring3d.mjs と QA preset.saturnRing3d300 が同じ関数で宣言を作り、内蔵の本と照合する)。
//
// ■ 何をするか
//   ・幾何は 💍 saturnRingReal の宣言そのもの(土星・主要衛星 6・C/B/A 帯の群 —— 粒子は宣言から生成する。単位も 💍 と同じ 1 単位 = 10⁶ m / 10² s / 10²⁵ kg)。
//   ・土星の極は 🟡 saturnSunInertial3d の土星の spinAxis(IAU WGCCRE 2009 の極を J2000 の黄道へ —— 傾き・方位は宣言から読む)。
//   ・回転 R = Rz(方位 + 90°)·Rx(傾き)で、💍 の面(+z が法線)を土星の赤道面(法線 = 極)へ回す。衛星(single)は位置と速度を同じ R で回し、
//     群(ring)は受理器の incl(= 傾き)・node(= 方位 + 90°)で同じ回転を宣言する(群の build の回転 R_z(node)·R_x(incl)と同じ式 —— coord3dPlace)。
//   ・試験粒子: 三次元の受理の門は testParticle を拒否する(coord3dDenyOf)—— 💍 の帯は試験粒子(力を受けるが源にならない)なので、
//     本の帯は**数値の質量の有限粒子**(源になる)として明示し、1 粒の質量は帯 120 粒の合計を実環の総質量 1.5×10¹⁹ kg に合わせた 1.25×10⁻⁸ にした
//     (器の実測: 💍 の宣言の質量 10⁻⁵ の写しは粒どうしの近接で二次元の 💍〔試験粒子〕から離心率の代理が最大 4.9×10⁻² 動き、1.25×10⁻⁸ は 6.8×10⁻⁴ —— 正本の testParticle の節)。
//     乱数の種 seed は 💍 と同じ値を明示する(同じ粒の配置を回したもの)。
//   ・土星は pinned(局所の近似 —— 土星の周りの系だけを見る。太陽の潮汐・土星の公転は入れない)。
//
// ■ 言わないこと
//   ・「現実を再現した」。gain は 0 の基準(標的なし —— fitted と呼ばない)。帯の粒子数は実際の環の縮約。
import * as SPA from './lib-w301b-approxmany.mjs';   // 第301便b: 近似多粒子の宣言(html の受理器が physics.approxMany を持つ世代だけ)
export const LIB_VERSION = 'w300c-saturnring3d-lib-1';
export const ID = 'saturnRingInertial3d';
export const EMOJI = '🍩';
export const SRC_ID = 'saturnRingReal';          // 幾何の元(二次元・帯は試験粒子)
export const POLE_ID = 'saturnSunInertial3d';    // 土星の極の元(三次元・bodies[1].spinAxis)
export const POLE_INDEX = 1;
/** 移送の診断の gain(水星の三次元のフィット値 0.004522419〔10⁸ m・10²⁷ kg の単位〕を同じ SI 4.522419×10⁻⁶ m³/kg で 10⁶ m・10²⁵ kg の単位へ)。本には宣言しない(A/B の側だけ)。 */
export const GAIN_SI_MERCURY3D = 4.522419e-6;
/**
 * 帯の粒の質量(数値の有限粒子 —— 器の実測で決めた): 帯 120 粒の合計を 💍 の説明の実環の総質量 1.5×10¹⁹ kg に合わせた 1 粒 1.25×10⁻⁸(=1.25×10¹⁷ kg)。
 * 💍 の宣言の 10⁻⁵(=10²⁰ kg)の写しでは粒どうしの近接(ε=0.05)で C帯の粒の離心率と周期が刻みで大きく動いた(正本の testParticle の節)。
 * 質量の下限は physics.massFloor を 10⁻⁹ へ下げて宣言する(第244便 B7′ の契約 —— mEff の床が粒の質量を持ち上げないため)。
 */
export const RING_TOTAL_KG = 1.5e19;
export const GRAIN_MASS = 1.25e-8;          // = 1.5e19 kg / 120 粒 / 10²⁵ kg
export const GRAIN_RADIUS = 0.1;            // 表示の半径(💍 の代表粒 R=0.1 —— 明示半径 particleRadius)
export const MASS_FLOOR_LOW = 1e-9;
export const gainUnit = (X) => Math.pow(10, 3 * X.L) / Math.pow(10, X.M);
/** 群の乱数の種: 本の id の hash から作る既定(build の mulberry32(hashStr(id)+7))では 💍 と別の粒になるので、💍 と同じ種を**明示**する(帯の粒は 💍 と同じ配置を回したもの)。 */
export function hashStr(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
export const SEED = (hashStr(SRC_ID) + 7) >>> 0;
const D2R = Math.PI / 180;
const clone = (x) => JSON.parse(JSON.stringify(x));
/** 極(傾き・方位)→ 群の incl・node(R = Rz(node)·Rx(incl) の法線 (sin node sin incl, −cos node sin incl, cos incl) が極と一致する)。 */
export function inclNodeOf(tiltDeg, azimuthDeg) {
  let node = azimuthDeg + 90; if (node > 360) node -= 360;
  return { incl: tiltDeg, node };
}
/** 回転 R = Rz(node)·Rx(incl) を (X, Y, Z) にかける(coord3dPlace と同じ式)。 */
export function rotIN(incl, node, X, Y, Z) {
  const i = incl * D2R, n = node * D2R, ci = Math.cos(i), si = Math.sin(i), cn = Math.cos(n), sn = Math.sin(n);
  const y1 = Y * ci - Z * si, z1 = Y * si + Z * ci;
  return [X * cn - y1 * sn, X * sn + y1 * cn, z1];
}
/** 極の単位ベクトル(spinAxis3Unit と同じ角の定義)。 */
export function poleUnit(tiltDeg, azimuthDeg) {
  const t = tiltDeg * D2R, a = azimuthDeg * D2R;
  return [Math.sin(t) * Math.cos(a), Math.sin(t) * Math.sin(a), Math.cos(t)];
}
/** 元の本(💍 と 🟡)を読む。 */
export function sources(HP) {
  const all = HP.allPresets(), src = all.find((q) => q.id === SRC_ID), pol = all.find((q) => q.id === POLE_ID);
  if (!src || !pol) throw new Error('元の本が無い ' + SRC_ID + '/' + POLE_ID);
  const sa = pol.bodies[POLE_INDEX] && pol.bodies[POLE_INDEX].spinAxis;
  if (!(sa && sa.enable === true && typeof sa.tiltDeg === 'number' && typeof sa.azimuthDeg === 'number')) throw new Error(POLE_ID + ' の土星の spinAxis が無い');
  return { src, pol, pole: { tiltDeg: sa.tiltDeg, azimuthDeg: sa.azimuthDeg } };
}
/**
 * 本の宣言の生成(physics・bodies・timeRef・camera・scaleExp)。o.gain(既定 0)・o.grainMass(既定 = 💍 の宣言の質量 —— 器の感度の写しだけが変える)。
 */
export function ringDecl3(HP, o = {}) {
  const { src, pole } = sources(HP);
  const { incl, node } = inclNodeOf(pole.tiltDeg, pole.azimuthDeg);
  const gain = (typeof o.gain === 'number') ? o.gain : 0;
  const s = src.physics;
  const gm0 = (typeof o.grainMass === 'number') ? o.grainMass : GRAIN_MASS;
  const physics = { coord: '3d', G: s.G, D0: s.D0, kFrame: 0, q: s.q, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, kappaT: s.kappaT,
    cLight: s.cLight, bM: s.bM, etaRad: 0, pRad: s.pRad, gravityX: 0, gravityY: 0, massFloor: (gm0 < s.massFloor) ? MASS_FLOOR_LOW : s.massFloor,
    geoPN: 3, lambdaPN: 0, pnAlpha: s.pnAlpha, radiusScale: s.radiusScale, softening: s.softening, timeScale: 1, stepDt: s.stepDt, dispMag: s.dispMag,
    stateCarry: 'double', frameWeight: 'share', contactMode: 'none',
    relativeDrag: { law: 'inertial', gain, eps: s.softening, history: 'positions', pairs: 'all', solver: 'network-pcg-v1', spinDrag: { rot: 'surfaceFlip', axial: 'off' } } };
  const bodies = [];
  const poleSrc = 'IAU WGCCRE 2009(Archinal et al. 2011)の土星の極 —— 🟡 ' + POLE_ID + ' の宣言(傾き ' + pole.tiltDeg + '°・方位 ' + pole.azimuthDeg + '°)を写す(軸は一定の近似)';
  src.bodies.forEach((b, k) => {
    if (b.type === 'single') {
      const r = rotIN(incl, node, b.x, b.y, 0), v = rotIN(incl, node, b.vx, b.vy, 0);
      const o1 = { type: 'single', m: b.m, radius: b.radius, x: r[0], y: r[1], z: r[2], vx: v[0], vy: v[1], vz: v[2], spin: b.spin, pinned: b.pinned === true };
      if (b.pnSource) o1.pnSource = true;
      // 自転する源は軸を明示して有効化(AN275 ②): 土星は極・同期自転の衛星(タイタン)は公転の法線 = 土星の赤道面の法線に揃える(近似)
      if (k === 0) o1.spinAxis = { enable: true, tiltDeg: pole.tiltDeg, azimuthDeg: pole.azimuthDeg, source: poleSrc };
      else if (b.spin !== 0) o1.spinAxis = { enable: true, tiltDeg: pole.tiltDeg, azimuthDeg: pole.azimuthDeg, source: '同期自転 —— 公転の法線(土星の赤道面の法線)に揃えた(近似・🟡 の土星の極の写し)' };
      bodies.push(o1);
    } else if (b.type === 'ring') {
      const o2 = clone(b);
      delete o2.testParticle;   // 三次元は試験粒子を拒否する —— 数値の質量の有限粒子として明示(質量は 💍 の宣言のまま)
      const gm = (typeof o.grainMass === 'number') ? o.grainMass : GRAIN_MASS;
      o2.mMin = gm; o2.mMax = gm;
      if (gm !== b.mMin) { delete o2.rMul; o2.particleRadius = GRAIN_RADIUS; }   // 表示の半径は 💍 の代表粒 0.1(=100 km)のまま(明示半径 —— 接触なし・自転 0 なので力学に入らない)
      o2.incl = incl; o2.node = node;
      bodies.push(o2);
    } else throw new Error('想定外の粒子の型 ' + b.type);
  });
  // 第301便b(原仮定者の裁定(第91報)①・R180): 近似多粒子の契約 —— 土星が governor・衛星 6 は天体(💍 の自転の写し —— 0 は宣言した 0)・帯 120 粒は塵
  //   (塵どうしの重力・引きずり・接触なし)。旧世代の html(受理器に approxMany が無い)と器の対照 o.approx:false では足さない
  if (SPA.approxOn(HP, o)) physics.approxMany = SPA.ringApproxDecl(bodies);
  const tr = src.timeRef, timeRef = { basis: tr.basis, pRef: tr.pRef, pair: tr.pair.slice(), def: tr.def, source: tr.source, stepsPerOrbit: tr.stepsPerOrbit };
  return { id: ID, emoji: EMOJI, seed: SEED, scaleExp: clone(src.scaleExp), physics, bodies, timeRef, camera: { scale: src.camera.scale }, pole, incl, node, poleU: poleUnit(pole.tiltDeg, pole.azimuthDeg) };
}
