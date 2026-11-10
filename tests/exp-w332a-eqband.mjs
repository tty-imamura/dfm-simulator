// 第332便a(原仮定者の補足(2026-11-10)「K1 の『回転引きずり』は、自転時に赤道面からの距離が κ_D·m 以下の範囲で強く働く力と仮定する」「R_d = κ_D·m は観測半径とは別の値」
//   「新たな『回転引きずり』なら、土星環の幅と一致・太陽系の公転面が揃っている・公転面と赤道面がほぼ一致している『太陽–木星』で顕著、と繋がる」・統括の検証項目 R315):
//   **新しい「回転引きずり」(帯の力)の診断の器 —— 環の厚みと帯の厚み・帯の中の鉛直の振動・公転面の揃いと届く/届かない・揃える時間・太陽–木星の物差し・今の K1 の球の核との違い**
//   (段 eqband-332a —— 正本 tests/out/eqband-w332a.json・lib tests/lib-w332a-eqband.mjs)。**診断だけ** —— エンジン・内蔵の本・受理器・第330便b と第331便c の lib の本文は変えない。
//
// Node だけ(html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、🗺️ solarSystem16Inertial3d と 💍 saturnRingReal の宣言の値を .find で引いて読む ——
//   本の JSON は 1 bit も変えない・步は進めない)。比べる列 K だけ 🗺️ の 2 体の**写し**(器の中)を受理器と読み口 inertialDragIsqState に通す(今のエンジンの K1 の球の核の回転の項)。1 プロセス。
//
// ■ 何をするか
//   P 純関数の場面(lib の pureScenes —— 鏡映・符号・帯の外で 0・連続・自転 0・共に回る・ガリレイ・入力の拒否・規則の比・恒等式・球の核・軌道の平均の求積)
//   R 環: R1 帯の厚み 2R_d(κ₀m と κ_D m)と文献の厚みの比(土星 C・B・カッシーニの間隙・A・木星・天王星・海王星)/R2 土星の環の点で帯の A の力と重力(J₂)の鉛直の比べ・
//     速度の分散 c = (H/2)ν_z の粒子が届く高さ・帯の内に収まるか(強さ × 形 × 鉛直の形 × 規則)/R3 B の滑りの率と共に回る時間・同期の半径
//   O 公転面: O1 届く/届かない(太陽–惑星・惑星–衛星・環 —— 赤道面からの高さ ÷ R_d・角の半幅 R_d/a・帯の中の時間の割合)/O2 揃える時間の目安(宣言の型 × 組 —— 太陽系の年齢との比・
//     公転の大きさが変わる時間との比・A は永年の変化 0 と節の歳差)
//   J 太陽–木星: 「顕著」の物差しを宣言して惑星ごとに(質量比・傾き・帯の中の時間・トルク・揃える率・両方の帯・質量 × 両方の帯)—— 木星が最大になる物差しとならない物差し
//   K 今の K1 の球の核との違い: 同じ入力(土星の B 環の外縁の半径・赤道面からの高さ 0〜2R_d・緯度 45°・軸の上)で球の核の回転の速度と帯の型の大きさ・向き —— 球の核は lib の読みの式と
//     🗺️ の 2 体の写しのエンジンの読み口で比べる(写しは 土星 + タイタンを点へ置き直す・太陽 + 木星は本の位置)
//   S3 原仮定者の補足その3(2026-11-10): R_d = κ₀m の表(太陽・8 惑星・月)・主の宣言を「手前と奥の差分」(nearfar・NF)へ・交点ごとの寄与(Δi は両方の交点で同じ符号・
//     法線の向きの力積は逆)・年齢の間の累積・原始太陽系の円盤(帯の中に居続ける物質と円盤の質量の割合)・水平との違い(1 − cos i・sin i)・符号と累積の判定(大きさの門を置かない)
// ■ 言わないこと: 帯の力は宣言の型(原仮定者の補足の作業仮説 —— 未接続)の表の値と残差。土星の環の厚み・公転面の揃い・太陽–木星を帯で決めたとは書かない。今のエンジンの K1 は R_d の球
//   (中心からの距離)で、帯(赤道面からの距離)と形が違う。文献の値は本便は一次資料に当たっていない。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as L from './lib-w332a-eqband.mjs';
// 第281便a の領域 hash の宣言(版 8 —— 器と lib と import の閉包から deriveScope で引いた下限そのもの。器が引く本は 🗺️ solarSystem16Inertial3d と 💍 saturnRingReal の 2 本〔宣言の値を .find で
//   引いて読む・🗺️ は比べる列 K の 2 体の写しの元〕。roots の T・ch・ctx・cw・HP.sim・HP.dfmMeshVelocityFieldAt は import した tests/lib-w280b-emgrid.mjs・tests/lib-w279b-headless.mjs の綴りが
//   数えられた分 —— この器と lib の局所の変数には使わない。エンジンを読む〔core —— 写しの読み口 inertialDragIsqState〕・ワンタップ対照 A/B は走らせない〔abBody:false〕・説明文の欄は読まない)
const REGEN_SCOPE = {"presets":["saturnRingReal","solarSystem16Inertial3d"],"roots":["HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.inertialDragIsqState","HP.sim","HP.validatePreset","T","ch","ctx","cw"],"core":true,"consts":[],"complete":true,"abBody":false};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w332a-eqband-2';
export const OUT_MAIN = 'tests/out/eqband-w332a.json';
export const SOLAR_ID = 'solarSystem16Inertial3d';
export const RING_ID = 'saturnRingReal';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (x) => JSON.parse(JSON.stringify(x));
const relD = (a, b) => (a === b ? 0 : Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b)));
const { add, sub, scl, dot, crs, nrm } = L.vec;
const unit = (a) => scl(a, 1 / nrm(a));
const DEG = Math.PI / 180;
export const NOT_CLAIM = Object.freeze(['帯の力は宣言の型の表の値と残差(原仮定者の補足の作業仮説 —— 今のエンジンに無い・未接続)', '土星の環の厚み・公転面の揃い・太陽–木星を帯で決めたとは書かない(比・届く/届かない・時間の目安の表)',
  '今のエンジンの K1 の核は R_d の球(中心からの距離)で、帯(赤道面からの距離)と形が違う —— 同じとは書かない', 'R_d は観測の半径ではない(質点の扱いと似る —— 原仮定者の補足)', '揃える時間は一次の目安(円軌道・永年の平均 —— 写しの時間発展ではない)',
  '文献の値は本便は一次資料に当たっていない(要確認の印のある値がある)', 'κ_epi(周転円の振動数)と κ_D は別の量']);
/** 器の宣言(走行の前に置く —— 結果を見て変えない) */
export const PLAN = Object.freeze({
  /** 🗺️ の添字(第330便a の lib の順 —— 0 太陽・1 水星・2 金星・3 地球・4 月・5 火星・6 木星・7 イオ・8 エウロパ・9 ガニメデ・10 カリスト・11 土星・12 タイタン・13 天王星・14 海王星・15 トリトン) */
  sunIndex: 0, planets: Object.freeze([1, 2, 3, 5, 6, 11, 13, 14]), planetNames: Object.freeze(['水星', '金星', '地球', '火星', '木星', '土星', '天王星', '海王星']),
  moons: Object.freeze([Object.freeze([4, 3, '月']), Object.freeze([7, 6, 'イオ']), Object.freeze([8, 6, 'エウロパ']), Object.freeze([9, 6, 'ガニメデ']), Object.freeze([10, 6, 'カリスト']), Object.freeze([12, 11, 'タイタン']), Object.freeze([15, 14, 'トリトン'])]),
  /** 文献の衛星の主星の名から 🗺️ の添字へ */
  hostIndex: Object.freeze({ 地球: 3, 火星: 5, 木星: 6, 土星: 11, 天王星: 13, 海王星: 14 }),
  /** 環の点(💍 の帯の縁 —— C・B・A の rIn・rOut〔本の単位〕とカッシーニの間隙の中ほど) */
  ringPointNames: Object.freeze(['C 環内縁', 'C/B 境', 'B 環外縁', 'カッシーニの間隙(中ほど)', 'A 環内縁', 'A 環外縁']),
  /** 環の厚みの典型 [m](文献の値 LIT.thickness —— 速度の分散 c = (H/2)ν_z の宣言に使う)・環の粒子の傾き(H/2)/r の宣言 */
  ringH: 10,
  /** R2 の形 × 鉛直の形の比べ(B 環外縁・k1N・κ₀m) */
  shapeVariants: Object.freeze([['step', 'none'], ['step', 'inv'], ['k1plane', 'none'], ['k1plane', 'inv'], ['gauss', 'own'], ['sech2', 'own']].map((x) => Object.freeze(x))),
  /** O2 の宣言の型(揃える時間 —— 主は literal) */
  decls: Object.freeze([
    Object.freeze({ key: 'nfMain', label: '主: 手前と奥の差分(nearfar・尾 0・NF・k1N・R_d = Y_k m)', decl: Object.freeze({ shape: 'nearfar', tail: 'none', dir: 'NF', strength: 'k1N', rule: 'kappa0' }), bodyR: false }),
    Object.freeze({ key: 'nfChord', label: '手前と奥の差分の弦の形(nfchord・NF)', decl: Object.freeze({ shape: 'nfchord', tail: 'none', dir: 'NF', strength: 'k1N', rule: 'kappa0' }), bodyR: false }),
    Object.freeze({ key: 'nfStep', label: '差分の押しを段の形で(step・NF)', decl: Object.freeze({ shape: 'step', tail: 'none', dir: 'NF', strength: 'k1N', rule: 'kappa0' }), bodyR: false }),
    Object.freeze({ key: 'nfD', label: '手前と奥の差分・R_d = κ_D m', decl: Object.freeze({ shape: 'nearfar', tail: 'none', dir: 'NF', strength: 'k1N', rule: 'kappaD' }), bodyR: false }),
    Object.freeze({ key: 'nfBody', label: '手前と奥の差分・受け手の大きさを足す', decl: Object.freeze({ shape: 'nearfar', tail: 'none', dir: 'NF', strength: 'k1N', rule: 'kappa0' }), bodyR: true }),
    Object.freeze({ key: 'nsMain', label: '差分の速度への滑り(nearfar・NS)', decl: Object.freeze({ shape: 'nearfar', tail: 'none', dir: 'NS', strength: 'k1N', rule: 'kappa0' }), bodyR: false }),
    Object.freeze({ key: 'literal', label: '第1版の主: 共回りへの滑り(段・尾 0・B・k1N・R_d = Y_k m)', decl: Object.freeze({ shape: 'step', tail: 'none', dir: 'B', strength: 'k1N', rule: 'kappa0' }), bodyR: false }),
    Object.freeze({ key: 'literalD', label: '字どおり・R_d = κ_D m', decl: Object.freeze({ shape: 'step', tail: 'none', dir: 'B', strength: 'k1N', rule: 'kappaD' }), bodyR: false }),
    Object.freeze({ key: 'tailInv', label: '帯の外の尾 R_d/|z|(段・B・k1N)', decl: Object.freeze({ shape: 'step', tail: 'inv', dir: 'B', strength: 'k1N', rule: 'kappa0' }), bodyR: false }),
    Object.freeze({ key: 'k1plane', label: 'K1 の核の平面の類比(尾 2R_d/(3|z|)・B・k1N)', decl: Object.freeze({ shape: 'k1plane', tail: 'inv', dir: 'B', strength: 'k1N', rule: 'kappa0' }), bodyR: false }),
    Object.freeze({ key: 'smooth', label: '滑らか(gauss・B・k1N)', decl: Object.freeze({ shape: 'gauss', tail: 'own', dir: 'B', strength: 'k1N', rule: 'kappa0' }), bodyR: false }),
    Object.freeze({ key: 'bodySize', label: '受け手の大きさを帯に足す(段・B・k1N —— 帯の座標 max(0, |z| − R_受け手)/R_d)', decl: Object.freeze({ shape: 'step', tail: 'none', dir: 'B', strength: 'k1N', rule: 'kappa0' }), bodyR: true }),
    Object.freeze({ key: 'strongN', label: '強さ N(β = 1 —— 上の端)', decl: Object.freeze({ shape: 'step', tail: 'none', dir: 'B', strength: 'N', rule: 'kappa0' }), bodyR: false }),
    Object.freeze({ key: 'weakK2', label: '強さ k2N(β = (R_d/r)²)', decl: Object.freeze({ shape: 'step', tail: 'none', dir: 'B', strength: 'k2N', rule: 'kappa0' }), bodyR: false }),
    Object.freeze({ key: 'vertA', label: '向き A(赤道面へ戻す鉛直の力・段・k1N)', decl: Object.freeze({ shape: 'step', tail: 'none', dir: 'A', strength: 'k1N', rule: 'kappa0' }), bodyR: false }),
  ]),
  /** K の点(赤道面からの高さ ÷ R_d)と緯度 45°・軸の上 */
  sphereZ: Object.freeze([0, 0.5, 0.999, 1.001, 2]),
  /** 写しに宣言する spinDrag(第331便a と同じ宣言 —— 読むのは回転の係数だけ) */
  spinDecl: Object.freeze({ rot: 'surfaceFlip', axial: 'on', axialModel: 'bevel' }),
  /** 球の核の lib の読みの式とエンジンの読み口の相対の差の上限(受け手の自己の場の一次 —— 源の場 C₁R_d/r の桁が残る) */
  sphereTol: 1e-6,
  /** 補足その3: R_d = κ₀m の表の天体(🗺️ の添字 —— 太陽・8 惑星・月)・交点の表と原始太陽系の円盤の列の宣言の型(主と第1版の主と滑り)・円盤の厚みの比 H/r(文献の値)・円盤の中の物質の傾き(帯の中 —— 0.5 R_d/a) */
  kappaBodies: Object.freeze([0, 1, 2, 3, 4, 5, 6, 11, 13, 14]), kappaNames: Object.freeze(['太陽', '水星', '金星', '地球', '月', '火星', '木星', '土星', '天王星', '海王星']),
  crossDecls: Object.freeze(['nfMain', 'nsMain', 'literal']), diskDecls: Object.freeze(['nfMain', 'nsMain', 'literal']), diskAspect: 0.05, diskInBandFrac: 0.5,
  G: L.DECL.G, c: L.DECL.c, yearS: L.DECL.yearS, ageYr: L.DECL.ageYr,
});

/* ───────── 入力(本の宣言 —— SI へ)───────── */
const axisOfSpin = (b) => { if (!b.spinAxis) return [0, 0, 1]; const t = b.spinAxis.tiltDeg * DEG, a = b.spinAxis.azimuthDeg * DEG; return [Math.sin(t) * Math.cos(a), Math.sin(t) * Math.sin(a), Math.cos(t)]; };
export function readBooks(HP) {
  const sb = clone(HP.allPresets().find((p) => p.id === SOLAR_ID)), se = sb.scaleExp, uL = 10 ** se.L, uT = 10 ** se.T, uM = 10 ** se.M;
  const bodies = sb.bodies.map((b) => ({ m: b.m * uM, R: b.radius * uL, x: [b.x * uL, b.y * uL, (b.z || 0) * uL], v: [b.vx * uL / uT, b.vy * uL / uT, (b.vz || 0) * uL / uT], Omega: b.spin / uT, axis: axisOfSpin(b) }));
  const rb = clone(HP.allPresets().find((p) => p.id === RING_ID)), re = rb.scaleExp, rL = 10 ** re.L, rT = 10 ** re.T, rM = 10 ** re.M;
  const sat = rb.bodies[0], bands = rb.bodies.filter((b) => b.type === 'ring').map((b) => ({ rIn: b.rIn * rL, rOut: b.rOut * rL }));
  const ring = { m: sat.m * rM, R: sat.radius * rL, Omega: sat.spin / rT, spinHours: 2 * Math.PI / (sat.spin / rT) / 3600, bands };
  return { solar: { bodies, uL, uT, uM }, ring };
}
/** 受け手 r の源 s に対する円軌道の要素(接触 —— a・n・v = na・i は源の自転のベクトル Ω ŝ に対する軌道の法線の角 0〜π) */
export function orbitOf(s, r, G = PLAN.G) {
  const rx = sub(r.x, s.x), rv = sub(r.v, s.v), mu = G * (s.m + r.m), rr = nrm(rx), a = 1 / (2 / rr - dot(rv, rv) / mu), h = crs(rx, rv), hh = nrm(h), hu = scl(h, 1 / hh);
  const ecc = Math.sqrt(Math.max(0, 1 - hh * hh / (mu * a))), n = Math.sqrt(mu / (a * a * a)), w = scl(s.axis, Math.sign(s.Omega) || 1);
  const i = Math.acos(Math.max(-1, Math.min(1, dot(hu, w))));
  return { a, ecc, n, v: n * a, i, hHat: hu, r: rr };
}
/** 不変面の法線(16 体の公転の角運動量の和 —— 重心系) */
function invariableNormal(B) {
  const M = B.reduce((s, b) => s + b.m, 0), xc = scl(B.reduce((s, b) => add(s, scl(b.x, b.m)), [0, 0, 0]), 1 / M), vc = scl(B.reduce((s, b) => add(s, scl(b.v, b.m)), [0, 0, 0]), 1 / M);
  return unit(B.reduce((s, b) => add(s, scl(crs(sub(b.x, xc), sub(b.v, vc)), b.m)), [0, 0, 0]));
}
const angleDeg = (a, b) => Math.acos(Math.max(-1, Math.min(1, dot(unit(a), unit(b))))) / DEG;
const planeDeg = (iRad) => Math.min(iRad, Math.PI - iRad) / DEG;
/** 環の点(💍 の帯の縁) */
export function ringPoints(ring) {
  const [C, Bb, A] = ring.bands;
  return [C.rIn, C.rOut, Bb.rOut, 0.5 * (Bb.rOut + A.rIn), A.rIn, A.rOut].map((r, k) => ({ label: PLAN.ringPointNames[k], r }));
}

/* ───────── R 環 ───────── */
export function partRings(BK) {
  const B = BK.solar.bodies, ring = BK.ring, J2 = L.LIT.saturnJ2.value, Rref = L.LIT.saturnJ2.Rref;
  const massOf = (planet) => (planet === '土星' ? ring.m : B[PLAN.hostIndex[planet]].m);
  const ringRange = { satC: [ring.bands[0].rIn, ring.bands[0].rOut], satB: [ring.bands[1].rIn, ring.bands[1].rOut], satCD: [ring.bands[1].rOut, ring.bands[2].rIn], satA: [ring.bands[2].rIn, ring.bands[2].rOut] };
  const thick = L.LIT.rings.map((q) => Object.assign({ key: q.key, planet: q.planet, name: q.name, kind: q.kind, src: q.src, M: massOf(q.planet), rRange: ringRange[q.key] || null }, L.ringThicknessRow({ M: massOf(q.planet), H: q.H })));
  const pts = ringPoints(ring);
  const vert = [];
  for (const p of pts) for (const st of L.STRENGTHS) for (const rule of L.RULES) {
    if (rule === 'kappaD' && st !== 'k1N') continue;
    vert.push(Object.assign({ label: p.label, strength: st, rule, shape: 'step', tail: 'none', vprof: 'sgn' }, L.ringPoint({ M: ring.m, Omega: ring.Omega, r: p.r, J2, Rref, H: PLAN.ringH, decl: { shape: 'step', tail: 'none', dir: 'A', vprof: 'sgn', strength: st, rule } })));
  }
  const pB = pts.find((p) => p.label === 'B 環外縁'), shapes = [];
  for (const [sh, tl] of PLAN.shapeVariants) for (const vp of L.VPROFS) shapes.push(Object.assign({ label: pB.label, shape: sh, tail: tl, vprof: vp, strength: 'k1N', rule: 'kappa0' },
    L.ringPoint({ M: ring.m, Omega: ring.Omega, r: pB.r, J2, Rref, H: PLAN.ringH, decl: { shape: sh, tail: tl, dir: 'A', vprof: vp, strength: 'k1N', rule: 'kappa0' } })));
  return { saturn: { m: ring.m, Omega: ring.Omega, spinHours: ring.spinHours, R: ring.R, Rd0: L.rdOf(ring.m, 'kappa0'), RdD: L.rdOf(ring.m, 'kappaD') }, J2, Rref, H: PLAN.ringH, points: pts, thick, vert, shapes,
    ringAge: L.LIT.ringAge, note: '速度の分散 c = (H/2)ν_z(厚み H = 10 m の半分を振幅とする —— 宣言)・帯の力のポテンシャルは数値の求積・重力の鉛直は J₂ の一次(第331便c の ringFreq)・本の JSON を読むだけ' };
}

/* ───────── O 公転面 ───────── */
function pairsOf(BK) {
  const B = BK.solar.bodies, sun = B[PLAN.sunIndex], pairs = [];
  PLAN.planets.forEach((pi, k) => pairs.push({ kind: 'sun-planet', name: '太陽–' + PLAN.planetNames[k], src: sun, rec: B[pi], recIndex: pi, orb: orbitOf(sun, B[pi]) }));
  for (const [mi, hi, nm] of PLAN.moons) pairs.push({ kind: 'planet-moon', name: PLAN.planetNames[PLAN.planets.indexOf(hi)] + '–' + nm, src: B[hi], rec: B[mi], recIndex: mi, orb: orbitOf(B[hi], B[mi]) });
  const ring = BK.ring, satSrc = { m: ring.m, Omega: ring.Omega, axis: [0, 0, 1], x: [0, 0, 0], v: [0, 0, 0], R: ring.R };
  for (const p of ringPoints(ring)) { const n = Math.sqrt(PLAN.G * ring.m / (p.r ** 3)); pairs.push({ kind: 'ring', name: '土星–' + p.label + 'の粒子', src: satSrc, rec: { m: 1, R: 0 }, recIndex: null, orb: { a: p.r, ecc: 0, n, v: n * p.r, i: (PLAN.ringH / 2) / p.r, r: p.r } }); }
  return pairs;
}
export function partReach(BK) {
  const B = BK.solar.bodies, nInv = invariableNormal(B), sun = B[PLAN.sunIndex];
  const litP = L.LIT.planets.rows, litM = L.LIT.moons.rows;
  const row = (name, kind, srcM, a, angBook, angLit, Rbody) => {
    const ang = angBook !== null ? angBook : angLit, zMax = a * Math.sin(ang * DEG), Rd0 = L.rdOf(srcM, 'kappa0'), RdD = L.rdOf(srcM, 'kappaD');
    const frac = (Rd) => (zMax <= Rd ? 1 : (2 / Math.PI) * Math.asin(Rd / zMax));
    return { name, kind, a, angleBook: angBook, angleLit: angLit, angle: ang, zMax, Rd0, RdD, zOverRd0: zMax / Rd0, zOverRdD: zMax / RdD, halfWidth0: Rd0 / a, halfWidthD: RdD / a, fracIn0: frac(Rd0), fracInD: frac(RdD),
      Rbody: Rbody === null ? null : Rbody, fracInBody0: Rbody === null ? null : frac(Rd0 + Rbody), lambdaReq: zMax / Rd0 };
  };
  const rows = [];
  PLAN.planets.forEach((pi, k) => {
    const o = orbitOf(sun, B[pi]), lp = litP[k];
    rows.push(Object.assign(row('太陽–' + PLAN.planetNames[k], 'sun-planet', sun.m, o.a, planeDeg(o.i), lp.iSun, B[pi].R), { iInvBook: angleDeg(o.hHat, nInv), iInvLit: lp.iInv, obliqBook: angleDeg(scl(B[pi].axis, Math.sign(B[pi].Omega) || 1), o.hHat), obliqLit: lp.obliq }));
  });
  for (const [mi, hi, nm] of PLAN.moons) {
    const o = orbitOf(B[hi], B[mi]), lm = litM.find((q) => q.name === nm);
    rows.push(row(PLAN.planetNames[PLAN.planets.indexOf(hi)] + '–' + nm, 'planet-moon', B[hi].m, o.a, planeDeg(o.i), lm ? planeDeg(lm.i * DEG) : null, B[mi].R));
  }
  for (const lm of litM) {
    if (PLAN.moons.some(([, , nm]) => nm === lm.name)) continue;
    const h = B[PLAN.hostIndex[lm.host]];
    rows.push(row(lm.host + '–' + lm.name + '(文献の値)', 'planet-moon-lit', h.m, lm.a * 1e3, null, planeDeg(lm.i * DEG), null));
  }
  for (const p of ringPoints(BK.ring)) rows.push(row('土星–' + p.label + 'の粒子(傾き (H/2)/r)', 'ring', BK.ring.m, p.r, ((PLAN.ringH / 2) / p.r) / DEG, null, 0));
  const sunAxisToInvDeg = angleDeg(scl(sun.axis, Math.sign(sun.Omega) || 1), nInv), pr = rows.filter((q) => q.kind === 'sun-planet');
  const spread = { iSun: [Math.min(...pr.map((q) => q.angleBook)), Math.max(...pr.map((q) => q.angleBook))], iInv: [Math.min(...pr.map((q) => q.iInvBook)), Math.max(...pr.map((q) => q.iInvBook))],
    iInvNoMercury: [Math.min(...pr.slice(1).map((q) => q.iInvBook)), Math.max(...pr.slice(1).map((q) => q.iInvBook))] };
  return { rows, invariableNormal: nInv, sunAxisToInvDeg, spread, note: '角は赤道面からの角(源の自転軸に対する軌道の法線の角の min(i, 180° − i))・本の角は 🗺️ の J2000 の接触の軌道と自転軸の宣言から・文献の角は LIT(月は黄道に対する値)' };
}
export function partAlign(BK) {
  const pairs = pairsOf(BK), rows = [];
  for (const D of PLAN.decls) for (const p of pairs) {
    const q = L.orbitRates({ src: { m: p.src.m, Omega: Math.abs(p.src.Omega) }, orbit: { a: p.orb.a, i: p.orb.i, n: p.orb.n, v: p.orb.v }, decl: D.decl, bodyR: D.bodyR ? (p.rec.R || 0) : 0 });
    const yr = PLAN.yearS;
    rows.push({ decl: D.key, pair: p.name, kind: p.kind, a: p.orb.a, planeAngleDeg: q.planeAngle / DEG, eps: q.eps, fracIn: q.fracIn, beta: q.beta, gamma: q.gamma, dIdt: q.dIdt, dAdtOverA: q.dAdtOverA, nodeRate: q.nodeRate,
      aSecRel: q.aSecular ? (q.aSecular.scale > 0 ? Math.abs(q.aSecular.dIdt) / q.aSecular.scale : 0) : null, aligning: q.aligning,
      tAlignYr: q.tAlign === null ? null : q.tAlign / yr, tAlignOverAge: q.tAlign === null ? null : q.tAlign / yr / PLAN.ageYr, tAYr: q.tA === null ? null : q.tA / yr, tAOverAge: q.tA === null ? null : q.tA / yr / PLAN.ageYr,
      tAlignOverTA: q.tAlign !== null && q.tA !== null ? q.tAlign / q.tA : null, tNodeYr: q.tNode === null ? null : q.tNode / yr });
  }
  const summary = PLAN.decls.map((D) => {
    const rs = rows.filter((r) => r.decl === D.key && r.kind === 'sun-planet'), ms = rows.filter((r) => r.decl === D.key && r.kind === 'planet-moon'), gs = rows.filter((r) => r.decl === D.key && r.kind === 'ring');
    const rng = (a) => { const f = a.filter((x) => x !== null && Number.isFinite(x)); return f.length ? [Math.min(...f), Math.max(...f)] : null; };
    const sg = (a) => a.map((r) => (r.aligning === true ? '+' : r.aligning === false ? '−' : '0')).join('');
    return { decl: D.key, label: D.label, sign: { planets: sg(rs), moons: sg(ms), rings: sg(gs) },
      planets: { tAlignOverAge: rng(rs.map((r) => r.tAlignOverAge)), nAligning: rs.filter((r) => r.aligning === true).length, nUnderAge: rs.filter((r) => r.tAlignOverAge !== null && r.tAlignOverAge < 1).length, n: rs.length },
      moons: { tAlignOverAge: rng(ms.map((r) => r.tAlignOverAge)), nAligning: ms.filter((r) => r.aligning === true).length, nMisaligning: ms.filter((r) => r.aligning === false).length, n: ms.length },
      rings: { tAlignYr: rng(gs.map((r) => r.tAlignYr)), tAYr: rng(gs.map((r) => r.tAYr)), n: gs.length } };
  });
  return { rows, summary, ageYr: PLAN.ageYr, ageSrc: L.LIT.age.src, note: '円軌道・ガウスの式の 1 周の平均(一次の目安 —— 写しの時間発展ではない)・源は静止・Ω は源の自転の大きさ(軌道の傾きは源の自転のベクトルに対する角)・環の粒子の傾きは (H/2)/r の宣言' };
}

/* ───────── J 太陽–木星の物差し ───────── */
export function partMetrics(BK, AL) {
  const B = BK.solar.bodies, sun = B[PLAN.sunIndex], rows = [];
  PLAN.planets.forEach((pi, k) => {
    const P = B[pi], o = orbitOf(sun, P), lit = AL.rows.find((r) => r.decl === 'literal' && r.pair === '太陽–' + PLAN.planetNames[k]);
    const obl = angleDeg(scl(P.axis, Math.sign(P.Omega) || 1), o.hHat), oblPlane = Math.min(obl, 180 - obl), Rd0 = L.rdOf(sun.m), RdP = L.rdOf(P.m);
    const zF = o.a * Math.sin(o.i), zR = o.a * Math.sin(oblPlane * DEG);
    const fF = zF <= Rd0 ? 1 : (2 / Math.PI) * Math.asin(Rd0 / zF), fR = zR <= RdP ? 1 : (2 / Math.PI) * Math.asin(RdP / zR);
    const T = lit.dAdtOverA * o.n * o.a / 2;   // 軌道の向きの平均の加速度 [m/s²]((da/dt)/a = 2T/(na))
    const nf = AL.rows.find((r) => r.decl === 'nfMain' && r.pair === '太陽–' + PLAN.planetNames[k]), Tn = nf.dAdtOverA * o.n * o.a / 2;
    rows.push({ name: PLAN.planetNames[k], eta: P.m / sun.m, obliqPlaneDeg: oblPlane, iSunDeg: planeDeg(o.i), fFwd: fF, fRev: fR, torque: P.m * o.a * Math.abs(T), alignRate: lit.tAlignYr ? 1 / lit.tAlignYr : 0,
      both: fF * fR, massBoth: P.m * fF * fR, share43: (4 / 3) * P.m / (sun.m + P.m), nfTorque: P.m * o.a * Math.abs(Tn), nfAlignRate: nf.tAlignYr ? 1 / nf.tAlignYr : 0 });
  });
  const METRICS = [['eta', '質量比 η = m/M_☉', 'max'], ['obliqPlaneDeg', '自転軸と公転面の法線の角(赤道面と公転面の角)', 'min'], ['iSunDeg', '太陽の赤道面と公転面の角', 'min'], ['fFwd', '太陽の帯の中の時間の割合(字どおり・Y_k m)', 'max'],
    ['fRev', '惑星の帯の中に太陽がいる時間の割合(惑星の R_d・自転軸の傾き)', 'max'], ['torque', '太陽の帯の B のトルク m a|⟨T⟩|(字どおり)[N m]', 'max'], ['alignRate', '揃える率 1/t_align(字どおり)[1/年]', 'max'],
    ['both', '両方の帯(時間の割合の積 —— 位相が独立の宣言)', 'max'], ['massBoth', '質量 × 両方の帯 [kg]', 'max'], ['share43', '第331便c の K1 の宣言の 1PN からの外れ (4/3)η(質量比の物差し)', 'max'],
    ['nfTorque', '主(手前と奥の差分)の太陽の帯のトルク m a|⟨T⟩| [N m]', 'max'], ['nfAlignRate', '主(手前と奥の差分)の揃える率 1/t_align [1/年]', 'max']];
  const table = METRICS.map(([key, label, best]) => {
    const vals = rows.map((r) => r[key]), pick = best === 'max' ? Math.max(...vals) : Math.min(...vals), who = rows[vals.indexOf(pick)].name;
    return { key, label, best, values: vals, top: who, jupiterTop: who === '木星', jupiterRank: 1 + vals.filter((v) => (best === 'max' ? v > rows[4][key] : v < rows[4][key])).length };
  });
  return { rows, table, note: '源は太陽(第1版の主 —— 段・尾 0・B・k1N・κ₀m —— と主の手前と奥の差分)と惑星(自分の R_d・自転軸 —— 太陽がその帯の中にいる時間)・「顕著」の物差しは宣言(どれかを採らない)' };
}

/* ───────── K 今の K1 の球の核との違い ───────── */
function bookOf(HP) { return clone(HP.allPresets().find((p) => p.id === SOLAR_ID)); }
function copyOf(book, idx, place) {
  const b = clone(book); b.id = SOLAR_ID + '_w332a'; b.description = '器の写し(内蔵ではない —— 第332便a)';
  b.bodies = idx.map((i) => clone(book.bodies[i]));
  if (place) { const t = b.bodies[1]; t.x = place[0]; t.y = place[1]; t.z = place[2]; }
  delete b.physics.relativeDrag.initMotion; delete b.orbitObs; delete b.obsCard;
  b.physics.relativeDrag = Object.assign(clone(b.physics.relativeDrag), { spinDrag: clone(PLAN.spinDecl) });
  return b;
}
/** 写しを受理して build し、受け手 1 の源 0 の回転の係数 ⟨(m M1/W) n̂⟩ から u_rot = Ω ŝ × RV(SI)を返す */
function engineRot(HP, book, idx, place) {
  const v = HP.validatePreset(copyOf(book, idx, place));
  if (!v.ok) return { ok: false, errors: v.errors.slice(0, 3) };
  const S = HP.coord3d.makeSim(); S.build(clone(v.preset));
  const se = v.preset.scaleExp, uL = 10 ** se.L, uT = 10 ** se.T;
  const st = HP.inertialDragIsqState(S, { perSource: true }), rr = st && st.receivers.find((q) => q.i === 1);
  if (!rr || !rr.rot) return { ok: false, errors: ['読み口に受け手 1 の回転の係数が無い'] };
  const RV = [rr.rot[0] * uL, rr.rot[1] * uL, rr.rot[2] * uL], ax = [S.sax[0], S.say[0], S.saz[0]], Om = S.spin[0] / uT, u = scl(crs(ax, RV), Om);
  return { ok: true, uRot: u, mag: nrm(u), beta: rr.beta[0], RdRecv: rr.Rd * uL, law: st.law };
}
export function partSphere(HP, BK) {
  const ring = BK.ring, body = { x: [0, 0, 0], v: [0, 0, 0], m: ring.m, axis: [0, 0, 1], Omega: ring.Omega }, Rd = L.rdOf(ring.m), r0 = ring.bands[1].rOut;
  const pts = PLAN.sphereZ.map((k) => ({ label: 'z = ' + k + ' R_d', zOverRd: k, x: [Math.sqrt(r0 * r0 - (k * Rd) ** 2), 0, k * Rd] }))
    .concat([{ label: '緯度 45°', zOverRd: r0 * Math.SQRT1_2 / Rd, x: [r0 * Math.SQRT1_2, 0, r0 * Math.SQRT1_2] }, { label: '軸の上', zOverRd: r0 / Rd, x: [0, 0, r0] }]);
  const vK = Math.sqrt(PLAN.G * ring.m / r0);
  const lib = pts.map((p) => {
    const sp = L.sphereRot(body, { x: p.x }), qB = L.bandForce(body, { x: p.x }, { dir: 'B', shape: 'step', tail: 'none' }), qA = L.bandForce(body, { x: p.x }, { dir: 'A', strength: 'k1N', shape: 'step', tail: 'none' });
    const qN = L.bandForce(body, { x: p.x }, { dir: 'NF', shape: 'nearfar', tail: 'none' }), uNvel = qN.beta * qN.S * qN.U0;
    const S = Object.fromEntries(PLAN.shapeVariants.map(([sh, tl]) => [sh + '|' + tl, L.shapeWeight(sh, tl, qB.t)]));
    const uBvel = qB.beta * qB.S * qB.slip, rho = qB.rho, slipK = ring.Omega * rho - (rho > 0 ? vK * rho / r0 : 0);
    const cosDir = sp.mag > 0 && nrm(qB.aB) > 0 ? dot(sp.uRot, qB.aB) / (sp.mag * nrm(qB.aB)) : null;
    return { label: p.label, zOverRd: p.zOverRd, thetaDeg: Math.acos(p.x[2] / r0) / DEG, sphereMag: sp.mag, sphereVert: sp.uRot[2], sphereBeta: sp.beta, S, uBvel, uBvelOverSphere: sp.mag > 0 ? uBvel / sp.mag : null,
      aB: nrm(qB.aB), aA: qA.aA[2], slipRest: qB.slip, slipK, uBvelK: qB.beta * qB.S * slipK, cosDir,
      Snf: qN.S, uNvel, uNvelOverSphere: sp.mag > 0 ? uNvel / sp.mag : null, aNF: nrm(qN.aNF), cosNF: sp.mag > 0 && nrm(qN.aNF) > 0 ? dot(sp.uRot, qN.aNF) / (sp.mag * nrm(qN.aNF)) : null };
  });
  // エンジンの読み口(🗺️ の写し —— 土星 + タイタンを土星の自転軸の枠の点へ置き直す)
  const book = bookOf(HP), B = BK.solar.bodies, uL = BK.solar.uL, si = 11, ti = 12, sat = B[si], ax = sat.axis;
  const e1 = unit(Math.abs(ax[2]) < 0.9 ? crs(ax, [0, 0, 1]) : crs(ax, [1, 0, 0])), e2 = crs(ax, e1), RdS = L.rdOf(sat.m), sb = book.bodies[si];
  const satBody = { x: [0, 0, 0], v: [0, 0, 0], m: sat.m, axis: ax, Omega: sat.Omega };
  const eng = pts.map((p) => {
    // 写しの土星の自転軸の枠の点(面内の距離は B 環外縁の半径・高さは写しの土星の R_d で z/R_d を置く —— 緯度 45° と軸の上は同じ半径)
    const rhoL = p.label === '緯度 45°' ? r0 * Math.SQRT1_2 : p.label === '軸の上' ? 0 : Math.sqrt(r0 * r0 - (p.zOverRd * RdS) ** 2), zL = p.label === '緯度 45°' ? r0 * Math.SQRT1_2 : p.label === '軸の上' ? r0 : p.zOverRd * RdS;
    const w = add(scl(e1, rhoL), scl(ax, zL)), place = [sb.x + w[0] / uL, sb.y + w[1] / uL, (sb.z || 0) + w[2] / uL];
    const E = engineRot(HP, book, [si, ti], place);
    const wq = sub([place[0] * uL, place[1] * uL, place[2] * uL], [sb.x * uL, sb.y * uL, (sb.z || 0) * uL]);   // 写しの中の実際の相対の位置(丸めの後)
    const sp = L.sphereRot(satBody, { x: wq });
    return { label: p.label, ok: E.ok, engineMag: E.ok ? E.mag : null, libMag: sp.mag, rel: E.ok ? (sp.mag === 0 && E.mag === 0 ? 0 : relD(E.mag, sp.mag)) : null, cos: E.ok && sp.mag > 0 && E.mag > 0 ? dot(E.uRot, sp.uRot) / (E.mag * sp.mag) : null,
      engineBeta: E.ok ? E.beta : null, libBeta: sp.beta, betaRel: E.ok ? relD(E.beta, sp.beta) : null, errors: E.ok ? null : E.errors };
  });
  { const eq = eng.find((q) => q.label === 'z = 0 R_d'); for (const q of eng) { q.engineOverEq = q.engineMag === null ? null : q.engineMag / eq.engineMag; q.libOverEq = q.libMag / eq.libMag; } }   // 軸の上は丸めの残り(赤道の値との比)
  // 太陽 + 木星(本の位置)
  const sun = B[0], jup = B[6], Ej = engineRot(HP, book, [0, 6], null), spj = L.sphereRot({ x: sun.x, m: sun.m, axis: sun.axis, Omega: sun.Omega }, { x: jup.x });
  const qj = L.bandForce({ x: sun.x, m: sun.m, axis: sun.axis, Omega: sun.Omega }, { x: jup.x, v: jup.v }, { dir: 'C', shape: 'step', tail: 'none' });
  const sunJup = { engineMag: Ej.ok ? Ej.mag : null, libMag: spj.mag, rel: Ej.ok ? relD(Ej.mag, spj.mag) : null, engineBeta: Ej.ok ? Ej.beta : null, libBeta: spj.beta, zOverRd: qj.t, bandS: qj.S, bandA: nrm(qj.aA), bandB: nrm(qj.aB), ok: Ej.ok };
  return { saturn: { m: ring.m, Omega: ring.Omega, Rd, r0, vK }, lib, engine: { saturnBook: { m: sat.m, Omega: sat.Omega, spinHours: 2 * Math.PI / Math.abs(sat.Omega) / 3600, Rd: RdS }, rows: eng, sunJupiter: sunJup, law: Ej.ok ? Ej.law : null },
    note: '受け手は静止(B の Δ = Ωρ)と円軌道の速さ(ケプラー)の 2 つ。球の核の u_rot は今のエンジンの回転の項(在位の 7 本は宣言しない —— 写しに spinDrag を宣言して読む)・帯の B の速度の形 β S Δ は比べるための写像(帯の力は加速度の宣言)' };
}

/* ───────── S3 原仮定者の補足その3(R_d = κ₀m の表・交点ごとの寄与・原始太陽系の円盤・水平との違い・符号と累積)───────── */
export function partSupp3(BK, AL) {
  const B = BK.solar.bodies, sun = B[PLAN.sunIndex], G = PLAN.G, c = PLAN.c;
  const kappa = { kappa0: L.kappa0(), kappaD: L.kappaD(), C1: L.C1, formula: 'κ₀ = 10G/(C₁c²)・C₁ = 6[(√3/2)ln(2+√3) − 1]・R_d = κ₀m(G = 6.674e-11・c = 299792458 —— SI)',
    rows: PLAN.kappaBodies.map((bi, k) => ({ name: PLAN.kappaNames[k], m: B[bi].m, Rd0: L.rdOf(B[bi].m, 'kappa0'), RdD: L.rdOf(B[bi].m, 'kappaD'), Robs: B[bi].R, RdOverRobs: L.rdOf(B[bi].m, 'kappa0') / B[bi].R })) };
  kappa.rows.push({ name: '土星(💍 の宣言)', m: BK.ring.m, Rd0: L.rdOf(BK.ring.m, 'kappa0'), RdD: L.rdOf(BK.ring.m, 'kappaD'), Robs: BK.ring.R, RdOverRobs: L.rdOf(BK.ring.m, 'kappa0') / BK.ring.R });
  const declOf = (key) => PLAN.decls.find((d) => d.key === key);
  // 交点ごとの寄与(太陽–惑星 —— 主・滑り・第1版の主)
  const cross = [];
  PLAN.planets.forEach((pi, k) => {
    const o = orbitOf(sun, B[pi]);
    for (const key of PLAN.crossDecls) {
      const q = L.crossingTable({ src: { m: sun.m, Omega: Math.abs(sun.Omega) }, orbit: { a: o.a, i: o.i, n: o.n, v: o.v }, decl: declOf(key).decl }), ar = AL.rows.find((r) => r.decl === key && r.pair === '太陽–' + PLAN.planetNames[k]);
      cross.push({ name: PLAN.planetNames[k], decl: key, planeAngleDeg: planeDeg(o.i), arcHalf: q.arcHalf, durS: q.durS, fracIn: q.durS * 2 / q.periodS, dIasc: q.asc.dI, dIdesc: q.desc.dI, Wasc: q.asc.Wimp, Wdesc: q.desc.Wimp, dLnAasc: q.asc.dLnA,
        sumOverAvg: ar.dIdt !== 0 ? (q.sum.dI / q.periodS) / ar.dIdt : null });
    }
  });
  // 原始太陽系の円盤(面の中の物質が帯の中に居続ける —— 傾き 0.5 R_d/a の円軌道・太陽が源)・円盤の質量のうち帯の中の割合(H = (H/r) a —— 文献の値)
  const disk = PLAN.planets.map((pi, k) => {
    const o = orbitOf(sun, B[pi]), Rd = L.rdOf(sun.m), iIn = PLAN.diskInBandFrac * Rd / o.a, vC = Math.sqrt(G * sun.m / o.a), nC = vC / o.a;
    const row = { name: PLAN.planetNames[k], a: o.a, iIn, frac: Object.fromEntries(L.LIT.diskAspect.values.map((h) => [String(h), L.diskBandFraction(Rd, h * o.a)])) };
    for (const key of PLAN.diskDecls) {
      const q = L.orbitRates({ src: { m: sun.m, Omega: Math.abs(sun.Omega) }, orbit: { a: o.a, i: iIn, n: nC, v: vC }, decl: declOf(key).decl });
      row[key] = { aligning: q.aligning, fracIn: q.fracIn, tAlignYr: q.tAlign === null ? null : q.tAlign / PLAN.yearS, tAYr: q.tA === null ? null : q.tA / PLAN.yearS,
        overLife: q.tAlign === null ? null : q.tAlign / PLAN.yearS / L.LIT.diskLife.hi, overAge: q.tAlign === null ? null : q.tAlign / PLAN.yearS / PLAN.ageYr };
    }
    return row;
  });
  // 水平との違い(源の赤道面と受け手の公転面の角 i —— 方位の押しの軌道の向きの成分 cos i・法線の成分の最大 sin i)・惑星の自転軸の傾き(惑星の帯 —— 衛星の公転面と太陽の方向)
  const tilt = PLAN.planets.map((pi, k) => {
    const o = orbitOf(sun, B[pi]), iS = Math.min(o.i, Math.PI - o.i), obl = angleDeg(scl(B[pi].axis, Math.sign(B[pi].Omega) || 1), o.hHat) * DEG, oP = Math.min(obl, Math.PI - obl);
    return { name: PLAN.planetNames[k], iSunDeg: iS / DEG, alongLoss: 1 - Math.cos(iS), normalMax: Math.sin(iS), obliqDeg: obl / DEG, alongLossOb: 1 - Math.cos(oP), normalMaxOb: Math.sin(oP) };
  });
  const moonTilt = PLAN.moons.map(([mi, hi, nm]) => { const o = orbitOf(B[hi], B[mi]), iP = Math.min(o.i, Math.PI - o.i); return { name: PLAN.planetNames[PLAN.planets.indexOf(hi)] + '–' + nm, planeAngleDeg: iP / DEG, alongLoss: 1 - Math.cos(iP), normalMax: Math.sin(iP), retro: o.i > Math.PI / 2 }; });
  // 符号と累積(補足その3「わずかでもプラスの影響があれば有効」—— 判定は符号・大きさの門を置かない)
  const verdict = AL.summary.map((s) => ({ decl: s.decl, label: s.label, sign: s.sign, planetsAllPlus: /^\+{8}$/.test(s.sign.planets), moonsPlus: (s.sign.moons.match(/\+/g) || []).length, ringsPlus: (s.sign.rings.match(/\+/g) || []).length }));
  // 累積(太陽系の年齢の間の傾きの変化 Δi = 年齢 × di/dt —— 符号つき・今の角に対する割合)
  const ageS = PLAN.ageYr * PLAN.yearS;
  const accum = PLAN.planets.map((pi, k) => { const row = { name: PLAN.planetNames[k] };
    for (const key of PLAN.crossDecls) { const r = AL.rows.find((x) => x.decl === key && x.pair === '太陽–' + PLAN.planetNames[k]); row[key] = { dIdeg: r.dIdt * ageS / DEG, frac: r.dIdt * ageS / (r.planeAngleDeg * DEG), dLnA: r.dAdtOverA * ageS }; }
    return row; });
  return { kappa, cross, disk, accum, diskAspect: L.LIT.diskAspect, diskLife: L.LIT.diskLife, tilt, moonTilt, verdict,
    note: '補足その3 の物差し: 揃える向きの符号(+)と累積(大きさの表は残す・大きさの門は置かない)。円盤の列は帯の中に居続ける物質(傾き 0.5 R_d/a)・円盤の質量の割合はガウスの鉛直の分布の宣言' };
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const R = J.rings, O = J.reach, A = J.align, M = J.metrics, K = J.sphere;
  return {
    pure: Object.values(J.pure.gates).every(Boolean),
    thickTable: R.thick.length === L.LIT.rings.length && R.thick.every((q) => Math.abs(q.Rd0 / q.RdD - 5 / L.C1) <= 1e-12 * 5 && (q.H === null ? q.ratio0 === null : Math.abs(q.ratio0 - 2 * q.Rd0 / q.H) <= 1e-15 * q.ratio0)),
    vertTable: R.vert.length === R.points.length * (L.STRENGTHS.length + 1) && R.vert.every((q) => Number.isFinite(q.zMax) && q.zMax <= q.zMaxGrav * (1 + 1e-12) && q.confined === (q.zMax <= q.Rd))
      && R.vert.filter((q) => q.strength === 'k1N').every((q) => Math.abs(q.gA / (q.Rd * PLAN.G * R.saturn.m / q.r ** 3) - L.C1) <= 1e-12)
      && R.shapes.length === PLAN.shapeVariants.length * L.VPROFS.length,
    reachTable: O.rows.length >= PLAN.planets.length + PLAN.moons.length + 6 && O.rows.every((q) => Number.isFinite(q.zOverRd0) && q.zOverRd0 > 0 && Math.abs(q.zOverRdD / q.zOverRd0 - 5 / L.C1) <= 1e-9 * 6),
    alignTable: A.rows.length === PLAN.decls.length * (PLAN.planets.length + PLAN.moons.length + 6) && A.rows.every((q) => Number.isFinite(q.dIdt) && Number.isFinite(q.dAdtOverA))
      && A.rows.filter((q) => q.decl === 'vertA').every((q) => q.dIdt === 0 && q.dAdtOverA === 0 && (q.aSecRel === null || q.aSecRel <= 1e-12)),
    metricsTable: M.rows.length === PLAN.planets.length && M.table.length === 12 && M.table.every((t) => t.values.every(Number.isFinite)),
    supp3: J.supp3.kappa.rows.length === PLAN.kappaBodies.length + 1 && J.supp3.kappa.rows.every((q) => Math.abs(q.Rd0 / q.m - J.supp3.kappa.kappa0) <= 1e-12 * J.supp3.kappa.kappa0)
      && J.supp3.cross.length === PLAN.planets.length * PLAN.crossDecls.length && J.supp3.cross.every((q) => q.sumOverAvg !== null && Math.abs(q.sumOverAvg - 1) <= 1e-6 && Math.sign(q.dIasc) === Math.sign(q.dIdesc) && Math.sign(q.Wasc) === -Math.sign(q.Wdesc))
      && J.supp3.disk.length === PLAN.planets.length && J.supp3.disk.every((q) => PLAN.diskDecls.every((k) => q[k].fracIn === 1)) && J.supp3.verdict.length === PLAN.decls.length
      && J.supp3.accum.length === PLAN.planets.length && J.supp3.accum.every((q) => q.nfMain.dIdeg < 0 && q.nsMain.dIdeg > 0),
    sphereEngine: K.engine.rows.every((q) => q.ok === true && (q.label === '軸の上' ? q.engineOverEq <= 1e-9 && q.libOverEq <= 1e-9 : q.rel !== null && q.rel <= PLAN.sphereTol && q.cos > 1 - 1e-9) && q.betaRel <= PLAN.sphereTol)
      && K.engine.sunJupiter.ok === true && K.engine.sunJupiter.rel <= PLAN.sphereTol,
    sphereVsBand: K.lib.every((q) => q.sphereVert === 0) && Math.abs(K.lib[0].uNvelOverSphere - 5) <= 1e-9 && K.lib.filter((q) => q.zOverRd >= 1).every((q) => q.Snf === 0 && q.aNF === 0) && K.lib.find((q) => q.label === '軸の上').sphereMag === 0 && K.lib.filter((q) => q.zOverRd > 1).every((q) => q.S['step|none'] === 0 && q.aB === 0)
      && K.lib.filter((q) => q.zOverRd <= 1).every((q) => q.S['step|none'] === 1 && q.aB > 0),
  };
}
export function runAll(HP) {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const BK = readBooks(HP); mark('books');
  const rings = partRings(BK); mark('rings');
  const reach = partReach(BK); mark('reach');
  const align = partAlign(BK); mark('align');
  const metrics = partMetrics(BK, align); mark('metrics');
  const sphere = partSphere(HP, BK); mark('sphere');
  const supp3 = partSupp3(BK, align); mark('supp3');
  const J = { books: { saturnRing: { m: BK.ring.m, spinHours: BK.ring.spinHours, R: BK.ring.R, bands: BK.ring.bands }, solarScale: { uL: BK.solar.uL, uT: BK.solar.uT, uM: BK.solar.uM } }, pure, rings, reach, align, metrics, sphere, supp3, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/* ───────── 走らせる ───────── */
export async function main() {
  const TARGET = process.env.W332A_TARGET || 'beta/index.html';
  const OUT = process.env.W332A_OUT ? (path.isAbsolute(process.env.W332A_OUT) ? process.env.W332A_OUT : path.join(ROOT, process.env.W332A_OUT)) : path.join(ROOT, OUT_MAIN);
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now(), text = fs.readFileSync(html, 'utf8'), targetSha256 = crypto.createHash('sha256').update(text).digest('hex');
  const W281A_SCOPE = REGEN_SCOPE ? w281aScopeStamp(html, REGEN_SCOPE) : {};
  const { HP } = loadHtmlMain(html);
  console.log('第332便a eqband(版 ' + HARNESS_VERSION + ')');
  const R = runAll(HP);
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w332a-eqband.mjs', target: TARGET, targetSha256, reuseFrom: null,
    ruling: '原仮定者の補足(2026-11-10)「R_d = κ_D·m は観測半径とは別の値」「座標変換版の回転引きずりは並進引きずりに統合する」「K1 の回転引きずりは、自転時に赤道面からの距離が κ_D·m 以下の範囲で強く働く力と仮定する」「土星環の幅・太陽系の公転面の揃い・太陽–木星で顕著、と繋がる」(作業仮説 —— 診断で検査・未接続)・原仮定者の補足その3(2026-11-10)「R_d = κ₀m を採用・κ₀ の計算式と太陽と各惑星の κ₀m を提示」「回転引きずりは源の天体の自転の手前側と奥側の差分 —— 赤道面が最も強く、赤道面からの距離が引きずり半径を超えるとほぼ消える」「公転面の揃いは長い年月の結果 —— わずかでもプラスの影響があれば有効・原始太陽系が円盤状であることも考慮」「斜めに横切る軌道は公転面からの位置で影響が変わる・斜めの自転は水平と若干違う」・統括の検証項目 R315(R_d の規則の値 Y_k m〔統括の読みの κ₀m〕と原文の字どおりの κ_D m の 2 列)',
    decl: L.DECL, shapes: L.SHAPES, tails: L.TAILS, shapeTails: L.SHAPE_TAILS, dirs: L.DIRS, vprofs: L.VPROFS, strengths: L.STRENGTHS, rules: L.RULES, units: L.UNITS, lit: L.LIT, plan: PLAN, notClaim: NOT_CLAIM, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w332a-eqband.mjs', 'tests/lib-w332a-eqband.mjs', 'tests/lib-w331c-k1scale.mjs', 'tests/lib-w330b-dragweight.mjs', 'tests/lib-w309a-invsq.mjs', 'tests/lib-w312a-decay.mjs', 'tests/lib-w310d-shell.mjs',
    'tests/lib-w307a-sphereaxial.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第332便a', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, stage: 'eqband', engine: 'Node(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・1 プロセス)・🗺️ と 💍 の本の宣言を読む(步を進めない)・🗺️ の 2 体の写しの読み口 inertialDragIsqState(比べる列 K)・純関数(lib)', notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();
