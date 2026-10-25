// 第315便d(原仮定者の裁定(第117報)・決断事項 AN413・AN414〔新記号〕・統括の検証項目 R245): **衛星 6 本(イオ・エウロパ・ガニメデ・カリスト・タイタン・トリトン)の
// K1 の検証の器の純関数**(html を読まない —— 在位の本の値は HP を引数で受ける。器 tests/exp-w315d-satk1.mjs が使う)。
//
// ■ 何をするか
//   ・近似要素の種(SAT_SEEDS): 在位の本の値があればそれ(🟠 jupiterGalilean の 4 衛星の m・半径・自転と、本の状態から読んだ a・e ——
//     💍 saturnRingReal のタイタンの m・半径・a・自転)、無ければ公表の平均要素の近似(タイタンの e・各衛星の赤道面に対する傾き・トリトンの全部)。
//     **観測レコードではない**(出典の語を種ごとに記録する —— 本の id か「公表の平均要素の近似〔原表は未取得 —— 公表値の転記〕」)。
//   ・母惑星と太陽: 凍結の写し tests/data-w306a-decl305.json(第306便a の世代の 🏀 jupiterSunInertial3d・🟡 saturnSunInertial3d・💙 neptuneSunInertial3d ——
//     太陽と惑星の状態・質量・半径・自転・IAU の極)。在位の本の宣言は読まない(在位の 7 本の宣言が変わっても写しは動かない)。
//   ・本の写し(bookOf): 単位は凍結の写しと同じ(1 単位 = 10⁹ m / 10⁵ s / 10²⁸ kg)。二体 = 母惑星 + 衛星(重心を原点・全運動量 0)/
//     三体 = 太陽 + 母惑星 + 衛星(凍結の写しの太陽と惑星の状態を太陽と「惑星 + 衛星の重心」とし、全体の重心を原点・全運動量 0 へ置き直す)。
//     衛星は母惑星の赤道面(凍結の写しの自転軸 —— IAU の極)に対する傾き i_eq の面に、近点 = 赤道面と母惑星の公転面の昇交点の向き(Ω_eq = 0・ω = 0)・
//     t = 0 は近点(M = 0)で置く(近似要素の種 —— 元期の宣言なし)。衛星の自転は同期(公転の向きの軸)。
//     軟化 ε = 10⁻⁴ 単位(10⁵ m —— physics.softeningFloor の下限)・半径の下限 physics.radiusFloor 10⁻³・積分器 leapfrog(16 体の器 tests/lib-w300c-solar16.mjs の判断 ——
//     三次元で受理される二次の積分器)・stateCarry:"double"・physics.coord:"3d"。走行の種類は q00(G_loc なし・引きずりなし)・q10(在位の G_loc {law:"kappaC2"}・
//     引きずりなし)・q11(G_loc + 新則 K1 —— **全天体 r_d = Y_k m** を規則の鍵 invSq.rdRule:"kappaM" で。Y_k = 10G_0/(C_1 c_0²) —— 本の G_0・c_0 と C_1 の閉じた式)。
//   ・抽出(attachSatSampler・windowOf): 同じ走行の入れ子の窓(最初の N 公転)で、恒星周期(固定の向きの通過の時刻の直線)・近点の移動の率(接触の離心ベクトルの
//     回帰 —— tests/lib-w304e-apsis.mjs の apsisRate と同じ式)・交点の移動の率(衛星の軌道の極の、母惑星の公転面〔t = 0 の太陽–惑星の公転の極〕に対する
//     昇交点の経度 Ω の時刻への直線 —— 位置の黄経の 1〜3 倍の正弦・余弦を足した回帰)・軸(衛星と母惑星の自転軸の t = 0 からの角)。
//
// ■ 入れないもの(理由を正本に記録する)
//   ・母惑星の J₂ と潮汐: 在位の本(🏀🟡💙・🟠・💍)が持たない —— 入れると「引きずりの有無の差」の基線が在位の本の範囲の外になる。
//     J₂ による近点と交点の移動(実際の衛星ではこれが主)は本の写しに無いので、q00 の率は実際の衛星の値と比べない(比べる量は q11 − q10 と q10 − q00)。
//   ・他の衛星(🟠 の 4 衛星の共鳴)と他の惑星: 衛星ごとに 1 本(二体と三体)—— 共鳴は在位の 🟠 の範囲。
//
// ■ 言わないこと: 観測の 3σ の合否を付けない(衛星の量に観測の σ は無い)。近点の ε_fit を衛星の合格に流用しない。「検証が完了した」「フィットした」と書かない。
//   近似要素の種を観測レコードと呼ばない。
import fs from 'node:fs';
import * as AP from './lib-w304e-apsis.mjs';
export const LIB_VERSION = 'w315d-satk1-lib-1';
export const DECL_FILE = 'tests/data-w306a-decl305.json';
export const PIN = JSON.parse(fs.readFileSync(new URL('./data-w306a-decl305.json', import.meta.url), 'utf8'));
/** 本の単位(凍結の写しの 🏀🟡💙 と同じ —— 10⁹ m / 10⁵ s / 10²⁸ kg) */
export const UNITS = Object.freeze({ L: 9, T: 5, M: 28 });
export const SOFTENING = 1e-4, RADIUS_FLOOR = 1e-3, INTEGRATOR = 'leapfrog';
/** K1 の一次の値の係数 C_1 = 6[(√3/2)ln(2+√3) − 1](tests/lib-w311d-planet3.mjs の C1_CLOSED と同じ式・同じ演算の順) */
export const C1 = 6 * ((Math.sqrt(3) / 2) * Math.log(2 + Math.sqrt(3)) - 1);
/** 引きずり係数 Y_k = 10 G_0/(C_1 c_0²)(本の単位 —— html の invSqKappa0 と同じ演算の順) */
export const YkBook = (p) => (10 * p.physics.G) / (C1 * p.physics.cLight * p.physics.cLight);
/** エンジンが使う質量(massPrecision が double でない本は Math.fround —— html の invSqEngineMass と同じ規則) */
export const engineMassOf = (m, ph) => ((ph && ph.massPrecision === 'double') ? m : Math.fround(m));
/** 母惑星(凍結の写しの行を絵文字で引く —— 器は在位の本の宣言を読まない。id は凍結の写しの鍵) */
const pinKeyOf = (emoji) => { const k = Object.keys(PIN.decl).find((z) => PIN.decl[z].emoji === emoji); if (!k) throw new Error('凍結の写しに ' + emoji + ' が無い'); return k; };
export const PARENTS = Object.freeze({
  jupiter: Object.freeze({ key: 'jupiter', id: pinKeyOf('🏀'), emoji: '🏀', ja: '木星' }),
  saturn: Object.freeze({ key: 'saturn', id: pinKeyOf('🟡'), emoji: '🟡', ja: '土星' }),
  neptune: Object.freeze({ key: 'neptune', id: pinKeyOf('💙'), emoji: '💙', ja: '海王星' }) });
const PUB = '公表の平均要素の近似(原表は未取得 —— 公表値の転記・観測レコードではない)';
/**
 * 近似要素の種。book: 在位の本の id と粒子の番号(m・半径・自転・状態から a・e)。pub: 公表の平均要素の近似で補う欄(book に無い欄だけ)。
 * iEqDeg: 母惑星の赤道面に対する軌道の傾き(公表の近似 —— 赤道面に近いラプラス面の傾きを赤道面に対する傾きとして置いた)。トリトンは逆行(156.9° の型)。
 */
export const SAT_SEEDS = Object.freeze([
  Object.freeze({ key: 'io', ja: 'イオ', parent: 'jupiter', book: Object.freeze({ id: 'jupiterGalilean', index: 1 }), pub: Object.freeze({ iEqDeg: 0.05 }) }),
  Object.freeze({ key: 'europa', ja: 'エウロパ', parent: 'jupiter', book: Object.freeze({ id: 'jupiterGalilean', index: 2 }), pub: Object.freeze({ iEqDeg: 0.47 }) }),
  Object.freeze({ key: 'ganymede', ja: 'ガニメデ', parent: 'jupiter', book: Object.freeze({ id: 'jupiterGalilean', index: 3 }), pub: Object.freeze({ iEqDeg: 0.2 }) }),
  Object.freeze({ key: 'callisto', ja: 'カリスト', parent: 'jupiter', book: Object.freeze({ id: 'jupiterGalilean', index: 4 }), pub: Object.freeze({ iEqDeg: 0.192 }) }),
  Object.freeze({ key: 'titan', ja: 'タイタン', parent: 'saturn', book: Object.freeze({ id: 'saturnRingReal', index: 6, circular: true }), pub: Object.freeze({ e: 0.0288, iEqDeg: 0.3485 }) }),
  Object.freeze({ key: 'triton', ja: 'トリトン', parent: 'neptune', book: null,
    pub: Object.freeze({ gmKm3s2: 1427.6, RKm: 1353.4, aKm: 354759, e: 0.000016, iEqDeg: 156.865 }) })]);
export const satOf = (k) => SAT_SEEDS.find((s) => s.key === k) || null;
export const SYSTEMS = Object.freeze(['two', 'three']);
export const SYSTEM_JA = Object.freeze({ two: '母惑星との二体', three: '太陽 + 母惑星 + 衛星の三体' });
export const KINDS = Object.freeze({ q00: Object.freeze({ gLoc: false, drag: false }), q10: Object.freeze({ gLoc: true, drag: false }), q11: Object.freeze({ gLoc: true, drag: true }) });
/** 在位の G_loc(第306便a の 7 本の一括と同じ —— tests/lib-w311d-planet3.mjs の GLOC_FIXED) */
export const GLOC = Object.freeze({ law: 'kappaC2' });
/** 引きずりなし(tests/lib-w311d-planet3.mjs の OFF_DRAG と同じ形) */
export const OFF_DRAG = Object.freeze({ law: 'inertial', invSq: Object.freeze({}), enabled: false, pairs: 'all', history: 'positions' });
/** 新則 K1 + 規則の鍵(tests/lib-w311d-planet3.mjs の NEW_DRAG から dragCoreDefault を外し、invSq に kernel:"k1"・rdRule:"kappaM" —— 全天体 r_d = Y_k m) */
export const K1_RULE_DRAG = Object.freeze({ law: 'inertial', invSq: Object.freeze({ outerShell: 'uniform', kernel: 'k1', rdRule: 'kappaM' }), pairs: 'all', history: 'positions', initMotion: 'observed',
  spinDrag: Object.freeze({ rot: 'surfaceFlip', axial: 'on', axialModel: 'bevel', initSpin: 'observed' }) });

const clone = (x) => JSON.parse(JSON.stringify(x));
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const unit = (a) => { const n = nrm(a); return [a[0] / n, a[1] / n, a[2] / n]; };
const add = (a, b, s = 1) => [a[0] + s * b[0], a[1] + s * b[1], a[2] + s * b[2]];
const D2R = Math.PI / 180;
/** 自転軸の宣言(傾き・方位 —— +z からの角と +x からの角)→ 単位ベクトル(tests/lib-w300c-solar16.mjs の poleToEcliptic の逆) */
export const axisOf = (sa) => { const t = sa.tiltDeg * D2R, a = sa.azimuthDeg * D2R; return [Math.sin(t) * Math.cos(a), Math.sin(t) * Math.sin(a), Math.cos(t)]; };
export const axisDecl = (u) => { const w = unit(u); let az = Math.atan2(w[1], w[0]) / D2R; if (az < 0) az += 360; return { tiltDeg: Math.acos(Math.max(-1, Math.min(1, w[2]))) / D2R, azimuthDeg: az }; };

/** 凍結の写しの太陽と惑星(本の単位)と、t = 0 の太陽–惑星の公転の極(交点の基準面の極) */
export function parentOf(key) {
  const P = PARENTS[key], d = PIN.decl[P.id];
  if (!d) throw new Error('凍結の写しが無い: ' + P.id);
  if (JSON.stringify(d.scaleExp) !== JSON.stringify(UNITS)) throw new Error('凍結の写しの単位が違う: ' + P.id);
  const sun = clone(d.bodies[0]), pl = clone(d.bodies[1]);
  const r = [pl.x - sun.x, pl.y - sun.y, pl.z - sun.z], v = [pl.vx - sun.vx, pl.vy - sun.vy, pl.vz - sun.vz];
  return { key, id: P.id, emoji: P.emoji, ja: P.ja, sun, planet: pl, physics: clone(d.physics), orbitPole: unit(cross(r, v)), spinPole: axisOf(pl.spinAxis) };
}
/**
 * 種を解く(本の単位の m・R・a・e・i_eq・自転・出典の語)。在位の本の値は HP.allPresets().find で引く(本の単位を 10⁹ m / 10⁵ s / 10²⁸ kg へ換算)。
 * a・e は在位の本の t = 0 の状態の母惑星に対する二体の接触要素(μ = G(m_P + m_s) —— 本の G)。
 */
export function seedOf(HP, key) {
  const s = satOf(key); if (!s) throw new Error('衛星が無い: ' + key);
  const P = parentOf(s.parent), G = P.physics.G, mP = P.planet.m, src = {};
  let m, R, a, e, spin = null;
  if (s.book) {
    const b = HP.allPresets().find((q) => q.id === s.book.id);
    if (!b) throw new Error('在位の本が無い: ' + s.book.id);
    const ex = b.scaleExp, fL = Math.pow(10, ex.L - UNITS.L), fM = Math.pow(10, ex.M - UNITS.M), fT = Math.pow(10, ex.T - UNITS.T), c = b.bodies[0], z = b.bodies[s.book.index];
    m = z.m * fM; R = z.radius * fL;
    const rr = [z.x - c.x, z.y - c.y, (z.z || 0) - (c.z || 0)], vv = [z.vx - c.vx, z.vy - c.vy, (z.vz || 0) - (c.vz || 0)].map((q) => q * fL / fT);
    // 在位の本の G は各本の単位で 6.674(= 6.674×10⁻¹¹ m³ kg⁻¹ s⁻² —— 写しの単位でも同じ数)。μ は写しの単位で G(m_c + m_s)
    const rn = nrm(rr) * fL, mu9 = G * (c.m * fM + z.m * fM), inv = 2 / rn - dot(vv, vv) / mu9;
    a = 1 / inv;
    const ev = AP.eccVector(rr.map((q) => q * fL), vv, mu9);
    e = nrm(ev);
    if (Number.isFinite(z.spin) && z.spin !== 0) spin = z.spin / fT;
    src.m = src.R = s.book.id + ' の粒子 ' + s.book.index + '(在位の本の宣言)';
    src.a = s.book.id + ' の t = 0 の状態の接触の長半径(μ = G(m_' + P.ja + ' + m_' + s.ja + ')・本の G)';
    src.e = s.book.circular ? null : s.book.id + ' の t = 0 の状態の接触の離心率';
    src.spin = spin !== null ? s.book.id + ' の自転(同期)' : null;
    if (s.book.circular) { e = s.pub.e; src.e = PUB + ' —— ' + s.book.id + ' は円軌道(e ≈ ' + nrm(ev).toExponential(2) + ')なので e は公表の近似'; }
  } else {
    m = s.pub.gmKm3s2 * 1e9 / (G * 1e-11) / Math.pow(10, UNITS.M);   // kg 換算は本の基準重力 G_0(6.674×10⁻¹¹ —— 決断事項 AN412 と同じ規則)
    R = s.pub.RKm * 1e3 / Math.pow(10, UNITS.L); a = s.pub.aKm * 1e3 / Math.pow(10, UNITS.L); e = s.pub.e;
    src.m = PUB + ' —— GM ' + s.pub.gmKm3s2 + ' km³/s² を本の基準重力 G_0 で kg へ'; src.R = src.a = src.e = PUB;
  }
  const mu = G * (mP + m), Pn = 2 * Math.PI * Math.sqrt(a * a * a / mu);
  if (spin === null) { spin = 2 * Math.PI / Pn; src.spin = '同期(2π/恒星周期 —— 種の a から)'; }
  src.iEq = PUB + ' —— 母惑星の赤道面に対する傾き(赤道面に近いラプラス面の傾きを赤道面に対する傾きとして置いた)';
  return { key, ja: s.ja, parent: s.parent, m, R, a, e, iEqDeg: s.pub.iEqDeg, spin, P: Pn, retro: s.pub.iEqDeg > 90, src };
}
/** 母惑星中心の衛星の状態(本の単位 —— 近点・ω = 0・Ω_eq = 0。赤道面の基底: x_e = 母惑星の公転の極 × 自転の極〔赤道面と公転面の昇交点の向き〕・z_e = 自転の極) */
export function satRelState(P, sd) {
  const k = P.spinPole, ne = cross(P.orbitPole, k), xe = nrm(ne) > 1e-12 ? unit(ne) : unit(cross([0, 0, 1], k)), ye = cross(k, xe);
  const i = sd.iEqDeg * D2R, mu = P.physics.G * (P.planet.m + sd.m), rp = sd.a * (1 - sd.e), vp = Math.sqrt(mu * (1 + sd.e) / rp);
  const r = xe.map((q) => q * rp), vdir = add(ye.map((q) => q * Math.cos(i)), k.map((q) => q * Math.sin(i))), v = vdir.map((q) => q * vp);
  return { r, v, mu, basis: { xe, ye, ze: k }, normal: unit(cross(r, v)) };
}
/** 重心を原点・全運動量 0 へ */
function recentre(B) {
  let M = 0; const c = [0, 0, 0], p = [0, 0, 0];
  for (const b of B) { M += b.m; c[0] += b.m * b.x; c[1] += b.m * b.y; c[2] += b.m * b.z; p[0] += b.m * b.vx; p[1] += b.m * b.vy; p[2] += b.m * b.vz; }
  for (const b of B) { b.x -= c[0] / M; b.y -= c[1] / M; b.z -= c[2] / M; b.vx -= p[0] / M; b.vy -= p[1] / M; b.vz -= p[2] / M; }
}
/** 刻み h = 恒星周期(種)/ stepsPerOrbit(本の単位 —— 12 桁) */
export const hOf = (sd, stepsPerOrbit) => Number((sd.P / stepsPerOrbit).toPrecision(12));
/**
 * 走行の本。sys = 'two' | 'three'・kind = q00 | q10 | q11・o.stepsPerOrbit(timeRef の宣言)。
 * 粒子の並び: 二体 [母惑星, 衛星]・三体 [太陽, 母惑星, 衛星]。
 */
export function bookOf(HP, key, sys, kind, o = {}) {
  const sd = o.seed || seedOf(HP, key), P = parentOf(sd.parent), K = KINDS[kind]; if (!K) throw new Error('走行の種類 ' + kind);
  const rel = satRelState(P, sd), mp = P.planet.m, ms = sd.m, fp = ms / (mp + ms), fs = mp / (mp + ms);
  const bary = sys === 'three' ? [P.planet.x, P.planet.y, P.planet.z] : [0, 0, 0], baryV = sys === 'three' ? [P.planet.vx, P.planet.vy, P.planet.vz] : [0, 0, 0];
  const planet = { type: 'single', m: mp, radius: P.planet.radius, x: bary[0] - fp * rel.r[0], y: bary[1] - fp * rel.r[1], z: bary[2] - fp * rel.r[2],
    vx: baryV[0] - fp * rel.v[0], vy: baryV[1] - fp * rel.v[1], vz: baryV[2] - fp * rel.v[2], spin: P.planet.spin, pinned: false, pnSource: true, spinAxis: clone(P.planet.spinAxis) };
  const sax = axisDecl(rel.normal);
  const sat = { type: 'single', m: ms, radius: sd.R, x: bary[0] + fs * rel.r[0], y: bary[1] + fs * rel.r[1], z: bary[2] + fs * rel.r[2],
    vx: baryV[0] + fs * rel.v[0], vy: baryV[1] + fs * rel.v[1], vz: baryV[2] + fs * rel.v[2], spin: sd.spin, pinned: false,
    spinAxis: { enable: true, tiltDeg: sax.tiltDeg, azimuthDeg: sax.azimuthDeg, source: sd.ja + 'の自転軸 = t = 0 の公転の極(同期の近似の種)' } };
  const bodies = sys === 'three' ? [Object.assign(clone(P.sun), { pinned: false, pnSource: true }), planet, sat] : [planet, sat];
  recentre(bodies);
  const physics = clone(P.physics);
  Object.assign(physics, { softening: SOFTENING, softeningFloor: SOFTENING, radiusFloor: RADIUS_FLOOR, stepDt: hOf(sd, o.stepsPerOrbit || 720) });
  if (K.gLoc) physics.gLoc = clone(GLOC); else delete physics.gLoc;
  physics.relativeDrag = clone(K.drag ? K1_RULE_DRAG : OFF_DRAG);
  const ip = sys === 'three' ? 1 : 0, is = ip + 1, rMax = Math.max(...bodies.map((b) => Math.hypot(b.x, b.y, b.z)));
  return { id: 'satK1_' + key + '_' + sys, name: sd.ja + '(' + SYSTEM_JA[sys] + ' —— 器の写し)', description: '器の写し(内蔵ではない —— 第315便d)', emoji: '🛰️', sampleClass: 'principle',
    scaleExp: clone(UNITS), integrator: INTEGRATOR, camera: { scale: Math.min(3000, Number((1.1 * Math.max(rMax, 4 * sd.a)).toPrecision(2))) }, world: { boundary: 'none', size: 0 },
    timeRef: { basis: 'orbit', pRef: Number(sd.P.toPrecision(12)), pair: [ip, is], def: 'revolution', source: (sd.ja + 'の' + P.ja + 'に対する恒星周期(近似要素の種の a から μ = G(m_P + m_s))').slice(0, 240), stepsPerOrbit: o.stepsPerOrbit || 720 },
    physics, bodies, overlays: { rotationCurve: false, tempHistogram: false, field: false, trail: true } };
}

/* ───────── 抽出 ───────── */
/**
 * 每步の記録(S.step を包む)。ci = 母惑星・oi = 衛星・pole = 交点の基準面の極(母惑星の公転の極)・every = 標本の間隔(步)。
 * 通過: 衛星の位置の t = 0 の軌道面の基底での角が 2π の倍数を越えた時刻(線形の内挿 —— tests/exp-w299c-planets3d.mjs の runPl3 と同じ式)。
 */
export function attachSatSampler(S, o) {
  const ci = o.ci, oi = o.oi, mu = o.mu, every = Math.max(1, o.every | 0 || 1), kr = unit(o.pole);
  const rel = () => [S.x[oi] - S.x[ci], S.y[oi] - S.y[ci], S.z[oi] - S.z[ci]];
  const relV = () => [S.vx[oi] - S.vx[ci], S.vy[oi] - S.vy[ci], S.vz[oi] - S.vz[ci]];
  const r0 = rel(), v0 = relV(), W0 = unit(cross(r0, v0)), P = unit(r0), Q = cross(W0, P);
  const n0 = cross(kr, W0), xr = nrm(n0) > 1e-12 ? unit(n0) : unit(cross(kr, [1, 0, 0])), yr = cross(kr, xr);
  const ax = (i) => (S.sax && S.saOn && S.saOn[i]) ? [S.sax[i], S.say[i], S.saz[i]] : null;
  const a0s = ax(oi), a0p = ax(ci);
  const T = [], EP = [], EQ = [], TH = [], OM = [], INC = [], EN = [], EC = [], AXS = [], AXP = [], rev = [];
  let t = 0, k = 0, thPrev = Math.atan2(dot(r0, Q), dot(r0, P)), thAcc = thPrev, acc = 0, omPrev = null, omAcc = 0, bad = false;
  const ang = (a, b) => (a && b) ? Math.acos(Math.max(-1, Math.min(1, dot(a, b)))) : null;
  const orig = S.step;
  S.step = function (dt) {
    const out = orig.apply(this, arguments);
    const t1 = t + dt; k++;
    const r = rel(), th = Math.atan2(dot(r, Q), dot(r, P));
    let d = th - thPrev; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
    const pa = acc; acc += d; thAcc += d; thPrev = th;
    const nP = Math.floor(Math.abs(pa) / (2 * Math.PI)), nN = Math.floor(Math.abs(acc) / (2 * Math.PI));
    if (nN > nP) { const tg = Math.sign(acc) * nN * 2 * Math.PI, fr = (tg - pa) / (acc - pa); rev.push(t + fr * dt); }
    t = t1;
    if (k % every === 0) {
      const v = relV(), rn = nrm(r), e = AP.eccVector(r, v, mu), h = cross(r, v), W = unit(h), nn = cross(kr, W), om = Math.atan2(dot(nn, yr), dot(nn, xr));
      if (omPrev !== null) { let dd = om - omPrev; while (dd > Math.PI) dd -= 2 * Math.PI; while (dd < -Math.PI) dd += 2 * Math.PI; omAcc += dd; } else omAcc = om;
      omPrev = om;
      const en = 0.5 * dot(v, v) - mu / rn;
      if (!(Number.isFinite(en) && en < 0 && nrm(e) < 1)) bad = true;
      T.push(t); EP.push(dot(e, P)); EQ.push(dot(e, Q)); TH.push(thAcc); OM.push(omAcc); INC.push(Math.acos(Math.max(-1, Math.min(1, dot(W, kr))))); EN.push(en); EC.push(nrm(e));
      AXS.push(ang(ax(oi), a0s)); AXP.push(ang(ax(ci), a0p));
    }
    return out;
  };
  return { basis: { P, Q, W0, xr, yr, kr }, rev, samples: () => ({ t: T, eP: EP, eQ: EQ, th: TH, om: OM, inc: INC, en: EN, ec: EC, axS: AXS, axP: AXP }), unbound: () => bad, detach: () => { S.step = orig; } };
}
/** 直線 + 位置の角の調和(K)の回帰の傾き(y の時刻への率 —— 窓 t0 < t ≤ t1) */
export function rateOf(s, y, o = {}) {
  const K = o.K === undefined ? 3 : o.K, t0 = o.t0 === undefined ? -Infinity : o.t0, t1 = o.t1 === undefined ? Infinity : o.t1;
  const idx = []; for (let i = 0; i < s.t.length; i++) if (s.t[i] > t0 && s.t[i] <= t1) idx.push(i);
  if (idx.length < 2 + 2 * K + 4) return null;
  const tm = (s.t[idx[0]] + s.t[idx[idx.length - 1]]) / 2;
  const X = idx.map((i) => { const row = [1, s.t[i] - tm]; for (let k = 1; k <= K; k++) row.push(Math.cos(k * s.th[i]), Math.sin(k * s.th[i])); return row; });
  const R = AP.lsqMulti(X, [idx.map((i) => y[i])]);
  return R ? { rate: R[0].c[1], rms: R[0].rms, n: idx.length } : null;
}
/** 恒星周期: 通過の時刻 t_k を番号 k の直線で(傾き) */
export function siderealOf(rev, N) {
  if (rev.length < N || N < 2) return null;
  const ts = rev.slice(0, N), km = (N - 1) / 2;
  const R = AP.lsqMulti(ts.map((_, i) => [1, i - km]), [ts]);
  return R ? { P: R[0].c[1], rms: R[0].rms } : null;
}
const perCentury = (rate, Tsec) => AP.toArcsecPerCentury(rate, Tsec);
/** 窓 N 公転(t = 0 から N 回目の通過まで)の量。Tsec = 本の時間単位の秒 */
export function windowOf(R, N, Tsec) {
  if (R.rev.length < N) return { N, complete: false };
  const s = R.s, t1 = R.rev[N - 1], last = (() => { let j = -1; for (let i = 0; i < s.t.length; i++) if (s.t[i] <= t1) j = i; return j; })();
  const ap = AP.apsisRate(s, { t0: 0, t1, K: 3 }), nd = rateOf(s, s.om, { t0: 0, t1, K: 3 }), sid = siderealOf(R.rev, N);
  const mean = (a) => { let x = 0, n = 0; for (let i = 0; i <= last; i++) if (Number.isFinite(a[i])) { x += a[i]; n++; } return n ? x / n : null; };
  const deg = (x) => (x === null || x === undefined ? null : x / D2R);
  return { N, complete: true, t1, sidDays: sid ? sid.P * Tsec / 86400 : null, sidRmsDays: sid ? sid.rms * Tsec / 86400 : null,
    aps: ap ? perCentury(ap.rate, Tsec) : null, apsE: ap ? ap.e : null, node: nd ? perCentury(nd.rate, Tsec) : null, nodeRms: nd ? nd.rms : null,
    incMeanDeg: deg(mean(s.inc)), eMean: mean(s.ec),
    // 軸: 衛星と母惑星の自転軸の t = 0 からの角(″ —— 窓の終わりの標本。率にしない —— 実測では引きずりの最初の步で一度だけ動いて止まる型)
    axSat: (last >= 0 && s.axS[last] !== null) ? deg(s.axS[last]) * 3600 : null, axPar: (last >= 0 && s.axP[last] !== null) ? deg(s.axP[last]) * 3600 : null };
}
/**
 * 1 本の走行(本は bookOf の写し)。runN 公転まで(上限の步は 1.5 倍)。wins: 入れ子の窓。div: 刻み h/div(標本は div 步ごと —— 刻みに依らず同じ時刻)。
 */
export function runBook(HP, book, o) {
  const v = HP.validatePreset(clone(book));
  if (!v.ok) return { status: 'rejected', err: JSON.stringify(v.errors).slice(0, 300) };
  const S = HP.coord3d.makeSim(); S.build(clone(v.preset));
  if (S.coord3d !== true) return { status: 'rejected', err: '三次元の本ではない' };
  const ip = book.timeRef.pair[0], is = book.timeRef.pair[1], mu = S.params.G * (S.m[ip] + S.m[is]);
  const pole = o.pole, dt = book.physics.stepDt / o.div, Tsec = Math.pow(10, book.scaleExp.T), t0 = Date.now();
  const smp = attachSatSampler(S, { ci: ip, oi: is, mu, every: o.div, pole });
  const maxSteps = Math.ceil(1.5 * o.runN * book.timeRef.stepsPerOrbit * o.div);
  let k = 0, stop = null;
  for (; ; k++) {
    if (k >= maxSteps) { stop = 'maxSteps'; break; }
    S.step(dt);
    if (S.coord3dHalt) { stop = 'coord3dHalt'; break; }
    if (S.inertialDragHalt === true) { stop = 'solveHalt'; break; }
    if (S.hasNaN()) { stop = 'nan'; break; }
    if (smp.rev.length >= o.runN) { k++; stop = 'revMax'; break; }
  }
  const R = { rev: smp.rev.slice(), s: smp.samples() }, windows = {};
  for (const N of o.wins) windows[N] = windowOf(R, N, Tsec);
  const st = HP.inertialDragIsqState ? HP.inertialDragIsqState(S) : null;
  smp.detach();
  return { status: 'run', steps: k, stop, complete: stop === 'revMax', nan: S.hasNaN(), unbound: smp.unbound(), dt, warnings: (v.warnings || []).length, windows,
    betaMax: st ? st.betaMax : null, isqSteps: st ? st.steps : null, wallSec: (Date.now() - t0) / 1000 };
}
