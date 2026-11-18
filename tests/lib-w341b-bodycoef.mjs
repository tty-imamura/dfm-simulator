// 第341便b(原仮定者の回答(2026-11-18 —— 第141報)AN790「推奨で進める。ただし、軸引きずりにおける近い面と遠い面の差は近似である。正確には、球体の部位別の並進引きずりに対して、
//   半径、密度、粘性などを考慮しなければならない。しかしそれは難しいので、天体の特性を表す係数のノブにする」・原仮定者の指示(2026-11-17 —— 第140報)・原仮定者の回答(2026-11-15 —— AN720)・
//   原仮定者の指示(2026-10-28 —— 第129報 AN537「潮汐の応答は、天体ごとに自由。法則を探す検証は行う」)・統括の検証項目 R365):
//   **軸引きずりの天体の特性の係数のノブ C_b(lib の名前は bodyCoef)・和の型を金星の釣り合い・8 惑星と主な衛星・冥王星とカロンへ・赤道面以外の仰角のずれの率** の純関数。
//   (段 bodycoef-341b —— 器 tests/exp-w341b-bodycoef.mjs・正本 tests/out/bodycoef-341b.json)。**探索の候補の表だけ** —— エンジン・内蔵の本・受理器・既存の lib の本文は変えない
//   (第340便b・第338便b・第337便l・第337便c・第335便b・第330便a の lib を呼ぶだけ)。html を読まない・ネットへ取りに行かない・乱数を使わない。薄い角は Math.atan2(|外積|, 内積)。
//
// ■ 記号: 源の自転 s(向き ŝ)・受け手の中心の向き r̂(仰角 el —— sin el = ŝ·r̂)・s∥ = (s·r̂) r̂・s⊥ = s − s∥・源の取り分 f・重みのべき α(2)・天体の特性の係数 C_b(無次元・受け手ごと)。
// ■ 型: 軸引きずり(受け手の自転に入る部位差分)= C_b × (−α f(1 − f) s⊥)(ずれの率 × 係数)。和(見え方)= 座標の回転 f s + 軸引きずり = f[s∥ + (1 − C_b α (1 − f)) s⊥]。
//   C_b 1 = 第340便b の T5 の置き方 (b)(角速度の勾配 —— ずれの率)そのまま・C_b ½ = 置き方 (a)(半分の渦度 —— 回転率)と同じ大きさ(2 つの数え方の違いは C_b の 1 と ½ に当たる)。
// ■ 言わないこと: 係数の値を決めない(要る値の表)。係数を天体ごとに自由に振れば 1 つの量は何でも合う —— 合うこと自体は成果にしない(見るのは要る値の並び方)。光速を判定に使わない。文献の値は未照合。
import { col3At, col4At, sumClosed, fOfR, rOfF, angDeg, kindOf, FLOOR, z12, LIB_VERSION as B340_VERSION } from './lib-w340b-axialsplit.mjs';
import { orbitMeanAxis, LIB_VERSION as K338_VERSION } from './lib-w338b-bevelknob.mjs';
import { splitSpin, venusBalance, planetRows, moonRows, shareSun, DECL as L337, LIT as LIT337, LIB_VERSION as L337_VERSION } from './lib-w337l-bevel.mjs';
import { BODY_SRC, LIB_VERSION as C337_VERSION } from './lib-w337c-tidelock.mjs';
import { galacticAxes } from './lib-w335b-carryledger.mjs';
import { DECL as D330 } from './lib-w330a-spinclass.mjs';

export const LIB_VERSION = 'w341b-bodycoef-lib-1';
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const scl = (a, k) => [a[0] * k, a[1] * k, a[2] * k], add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const D2R = Math.PI / 180, DAY = 86400, AU = 1.495978707e11;
const fin = (x) => typeof x === 'number' && Number.isFinite(x);

/** 宣言(走行の前に置く —— 走らせたノブの格子と判定の物差しの記録) */
export const DECL = Object.freeze({
  alpha: 2,
  /** T1: 係数 C_b・仰角・源の取り分 f の格子 */
  cGrid: Object.freeze([0, 0.25, 0.5, 1, 1.5, 2]),
  elevDeg: Object.freeze([0, 15, 30, 45, 60, 75, 90]),
  fGrid: Object.freeze([1e-6, 0.01, 0.1, 0.3, 0.5, 0.7]),
  /** T2: 金星の釣り合いを読む係数の格子(0〜2) */
  cVenus: Object.freeze([0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2]),
  /** T4: 赤道面以外の仰角・受け手の半径 ÷ 距離・2 層の球(核の半径 ÷ 受け手の半径 ½・核の密度 ÷ 外層の密度)・源の取り分・体積の殻の数と点の数 */
  elevT4: Object.freeze([15, 30, 45, 60, 75]), kT4: Object.freeze([0.01, 0.1, 0.3, 0.5]), fT4: 0.3,
  layerCore: 0.5, layerRatio: Object.freeze([1, 3, 10]), nShell: 8, nPts: 400,
  /** T5: 赤道面の見え方を引き直す係数 */
  cT5: Object.freeze([0.5, 1, 2]),
  /** 順位相関で並べる天体の性質 */
  props: Object.freeze(['rho', 'R', 'flat', 'gas', 'periodAbs', 'f', 'aAU']),
});

/** 文献の値(本環境では未照合 —— 出典の名と確かさ)。質量・半長軸・自転の周期は既存の lib の表を呼ぶ(第337便l の LIT.planets・第337便c の BODY_SRC・第330便a の lit.spinDays) */
export const LIT = Object.freeze({
  note: '文献の値・未照合(この環境から一次資料のサイトに届かない —— 半径と扁平率は NASA NSSDC の Fact Sheet の値の記憶の写し・確かさ 中)',
  /** 平均の半径 [km]・扁平率・気体か(1)固体か(0) */
  bodies: Object.freeze({
    mercury: [2439.7, 0, 0], venus: [6051.8, 0, 0], earth: [6371.0, 0.00335, 0], mars: [3389.5, 0.00589, 0],
    jupiter: [69911, 0.06487, 1], saturn: [58232, 0.09796, 1], uranus: [25362, 0.02293, 1], neptune: [24622, 0.01708, 1],
    pluto: [1188.3, 0, 0], moon: [1737.4, 0.0012, 0], io: [1821.6, null, 0], europa: [1560.8, null, 0], ganymede: [2634.1, null, 0], callisto: [2410.3, null, 0],
    titan: [2574.7, null, 0], triton: [1353.4, null, 0], charon: [606, null, 0],
  }),
  /** 衛星の質量 [kg](第337便c の BODY_SRC に無いもの) */
  moonMass: Object.freeze({ titan: 1.3452e23, triton: 2.139e22 }),
  /** 冥王星の自転の軸の傾き(軌道に対して)[°]・太陽からの半長軸 [AU] */
  plutoObliqDeg: 122.53, plutoAAU: 39.482,
});

/* ───────── T1 係数 C_b を置いた和の型 ───────── */
/** 軸引きずり(部位差分)の大きさの因子: C_b × (−α f(1 − f))(s⊥ に掛ける) */
export const axialFactor = (f, bodyCoef, alpha = DECL.alpha) => {
  if (!fin(f) || !fin(bodyCoef) || bodyCoef < 0 || f < 0 || f > 1) throw new RangeError('axialFactor: f は 0〜1・係数は有限で非負');
  return -bodyCoef * alpha * f * (1 - f);
};
/** 和 ÷ f の s⊥ の係数 c = 1 − C_b α (1 − f) */
export const perpCoef = (f, bodyCoef, alpha = DECL.alpha) => 1 - bodyCoef * alpha * (1 - f);
/** 和(÷ s)のベクトル(源の自転 ẑ・受け手の向き (cos el, 0, sin el)) */
export function sumVec(elDeg, f, bodyCoef, alpha = DECL.alpha) {
  const ce = elDeg === 90 ? 0 : Math.cos(elDeg * D2R), se = elDeg === 90 ? 1 : Math.sin(elDeg * D2R), sPar = [se * ce, 0, se * se], sPerp = [-se * ce, 0, ce * ce], c = perpCoef(f, bodyCoef, alpha);
  return scl(add(sPar, scl(sPerp, c)), f);
}
/** 90° 傾く仰角(閉じた形): sin² el* = 1 − 1/(C_b α (1 − f))(C_b α (1 − f) ≥ 1 のときだけ在る) */
export const el90 = (f, bodyCoef, alpha = DECL.alpha) => { const k = bodyCoef * alpha * (1 - f); return k >= 1 ? Math.asin(Math.sqrt(1 - 1 / k)) / D2R : null; };
/** 赤道面の和が 0 になる源の取り分(閉じた形): f₀ = 1 − 1/(C_b α)(C_b α > 1 のときだけ 0 < f₀ < 1) */
export const fZeroEq = (bodyCoef, alpha = DECL.alpha) => (bodyCoef * alpha > 1 ? 1 - 1 / (bodyCoef * alpha) : null);
/** 45° で 90° になる条件: C_b α (1 − f) = 2 —— α 2 で f → 0 なら C_b 1 だけ・f が有限なら C_b = 2/(α(1 − f)) */
export const c45 = (f, alpha = DECL.alpha) => 2 / (alpha * (1 - f));

export function t1Rows() {
  const s = [0, 0, 1], rows = [];
  for (const C of DECL.cGrid) for (const f of DECL.fGrid) {
    const row = { C, f, el90: el90(f, C), cells: [] };
    for (const el of DECL.elevDeg) {
      const v = sumVec(el, f, C), m = z12(nrm(v), f), c3 = col3At(el, f);
      // 数値: 第340便b の列 (iii) の数値の回転(半分の渦度)× 2 C_b + 座標の回転 f ŝ
      const num = add([0, 0, c3.coordRot], scl(c3.rotNum, 2 * C));
      row.cells.push({ elDeg: el, ang: m === 0 ? null : angDeg(v, s), magOverF: z12(m / f), kind: kindOf(m === 0 ? null : angDeg(v, s)), dNum: z12(nrm(sub(num, v)) / f, 1e3) });
    }
    rows.push(row);
  }
  return rows;
}
/** C_b ごとの境目: 赤道面の和が 0 になる取り分 f₀・45° で 90° になる f(C_b α (1 − f) = 2)・f → 0 の 90° の仰角 */
export function t1Bounds() {
  return DECL.cGrid.map((C) => { const k = C * DECL.alpha; return { C, fZeroEq: fZeroEq(C), f45: k >= 2 ? 1 - 2 / k : null, el90Small: el90(0, C), el90Half: el90(0.5, C) }; });
}
/** C_b 1 と ½ が第340便b の置き方 (b)・(a)(sumClosed の k 2・k 1)と同じ・零試験(天体が 1 つ・軸の方向で C_b に依らず差分 0) */
export function t1Same340() {
  let db = 0, da = 0;
  for (const el of DECL.elevDeg) for (const f of DECL.fGrid) { db = Math.max(db, nrm(sub(sumVec(el, f, 1), sumClosed(el, f, 2))) / f); da = Math.max(da, nrm(sub(sumVec(el, f, 0.5), sumClosed(el, f, 1))) / f); }
  const nul = DECL.cGrid.map((C) => {
    let single = 0, axis = 0;
    for (const el of DECL.elevDeg) { const c = col3At(el, 1, { single: true }); single = Math.max(single, nrm(scl(c.rotNum, 2 * C))); }
    for (const f of DECL.fGrid) { const c = col3At(90, f); axis = Math.max(axis, nrm(scl(c.rotNum, 2 * C))); }
    return { C, single: z12(single), axis: z12(axis), singleFactor: axialFactor(1, C) === 0 ? 0 : axialFactor(1, C) };
  });
  return { dB: z12(db), dA: z12(da), nul };
}

/* ───────── T2 金星の釣り合い ───────── */
/** 太陽の赤道面に対する傾き i の軌道の平均の ⟨s⊥·ŝ⟩(s 1)= 1 − ½ sin² i */
export const perpMean = (iDeg) => orbitMeanAxis({ iDeg, fn: (s, r) => splitSpin(s, r).perp }).alongSpin;
/** 和の型の太陽の項の振幅 S(f) = f − C_b α P⊥ f(1 − f) の係数(第337便l の venusBalance の amp に直に渡す —— P = 1)。差分だけの列は C_b α P⊥ f(1 − f) の符号を変えた形 */
export const sumCoef = (C, Pp, alpha = DECL.alpha) => [0, 1 - C * alpha * Pp, C * alpha * Pp];
export const diffCoef = (C, Pp, alpha = DECL.alpha) => [0, -C * alpha * Pp, C * alpha * Pp];
/** 金星の 3 成分(第340便b の T4 の型): 和 = S(f) s☉ ŝ☉ + (1 − f) ω_bg L̂ の金星の自転の軸に平行な分と垂直な分 */
function threeComp(S, f) {
  const sun = L337.spins.sun, Lh = galacticAxes().Lhat, sV = L337.spins.venus.sHat;
  const sunV = scl(sun.sHat, S * sun.s), bgV = scl(Lh, (1 - f) * L337.wbg), sum = add(sunV, bgV), sc = nrm(sunV) + nrm(bgV), along = dot(sum, sV), perp = nrm(sub(sum, scl(sV, along)));
  return { alongRel: z12(along / sc), perpRel: z12(perp / sc), bgOverCoord: (1 - f) * Math.abs(L337.wbg) / (f * sun.s) };
}
export function t2Venus() {
  const ven = planetRows().find((p) => p.key === 'venus'), Pp = perpMean(ven.iSunDeg), sun = L337.spins.sun, Lh = galacticAxes().Lhat, sV = L337.spins.venus.sHat, rows = [];
  for (const C of DECL.cVenus) for (const col of ['sum', 'diff']) {
    const coef = col === 'sum' ? sumCoef(C, Pp) : diffCoef(C, Pp);
    if (coef.every((x) => x === 0)) { rows.push({ C, col, nRoots: 0, roots: [], alongRoots: [] }); continue; }
    const vb = venusBalance({ P: 1, amp: coef }), Sof = (f) => coef[0] + coef[1] * f + coef[2] * f * f;
    const roots = vb.rows.filter((r) => 1 - r.f > 1e-9).map((r) => ({ f: r.f, kind: r.kind, W0: r.W0, ...threeComp(Sof(r.f), r.f) }));
    // 金星の自転の軸に平行な分を 0 にする釣り合い(黄道の北の 1 成分の代わり): S(f) s☉ (ŝ☉·ŝ_V) + (1 − f) ω_bg (L̂·ŝ_V) = 0 —— 根は閉じた形(2 次以下)
    const a = sun.s * dot(sun.sHat, sV), b = L337.wbg * dot(Lh, sV), q = [b + a * coef[0], a * coef[1] - b, a * coef[2]];
    const alongRoots = polyRoots(q).filter((f) => f > 0 && 1 - f > 1e-9).map((f) => ({ f, ...threeComp(Sof(f), f) }));
    rows.push({ C, col, nRoots: roots.length, roots, alongRoots });
  }
  // 3 成分の残りは和 = a ŝ☉ + b L̂ の比 a/b だけで決まる(C_b は比を作る f の位置を動かすだけ)—— 黄道の北で釣り合う比の閉じた形と、3 成分とも 0 になる組の有無
  const nE = [0, 0, 1], tN = -dot(Lh, nE) / dot(sun.sHat, nE), sumN = add(scl(sun.sHat, tN), Lh), scN = Math.abs(tN) + 1;
  const invariant = { alongRel: Math.abs(dot(sumN, sV)) / scN, perpRel: nrm(sub(sumN, scl(sV, dot(sumN, sV)))) / scN };
  return { Pp, iSunDeg: ven.iSunDeg, rows, invariant };
}
/** 2 次以下の実根(数値的に安定な形) */
function polyRoots([c0, c1, c2]) {
  if (c2 === 0) return c1 !== 0 ? [-c0 / c1] : [];
  const D = c1 * c1 - 4 * c2 * c0; if (D < 0) return [];
  const q = -0.5 * (c1 + (c1 >= 0 ? 1 : -1) * Math.sqrt(D)); return q !== 0 ? [q / c2, c0 / q].sort((x, y) => x - y) : [0];
}

/* ───────── T3 8 惑星・主な衛星・冥王星とカロンの要る係数 ───────── */
/**
 * 受け手ごとに 2 つの読みで要る C_b:
 *  (i) 釣り合い(駆動 0 —— AN720 の型): 受け手の自転の軸に沿う和 D(C_b) = s_src cos θ [f − C_b α P⊥ f(1 − f)] + b_r = 0 → C_b = (f s_src cos θ + b_r)/(s_src cos θ α P⊥ f(1 − f))
 *  (ii) 速さの一致(和の受け手の自転の軸に沿う分 = 観測の自転の速さ s_obs): C_b = (f s_src cos θ + b_r − s_obs)/(s_src cos θ α P⊥ f(1 − f))
 *  θ = 源の自転の軸と受け手の自転の軸の角(惑星は軌道に対する自転の軸の傾きで近似 —— 軌道の法線と太陽の軸の差 iSun ≤ 7.2° は無視。金星は第337便l の 2 つの向きのベクトル)・
 *  b_r = 背景軸引きずりの項 (1 − f) ω_bg (L̂·ŝ☉) cos θ(近似 —— 大きさは太陽の項の 1e-6 より小さい)。C_b < 0 なら「このノブだけでは定常にならない」。
 */
function needC({ f, ssrc, cosT, Pp, sobs, br }) {
  const D1 = ssrc * cosT * DECL.alpha * Pp * f * (1 - f);
  if (D1 === 0) return { bal: null, spd: null };
  const bal = (f * ssrc * cosT + br) / D1, spd = (f * ssrc * cosT + br - sobs) / D1;
  return { bal: bal >= 0 ? bal : null, balRaw: bal, spd: spd >= 0 ? spd : null, spdRaw: spd, balNoBg: f * ssrc * cosT / D1, bgRel: Math.abs(br / (f * ssrc * cosT)) };
}
const propsOf = (key, m) => { const [Rkm, flat, gas] = LIT.bodies[key], R = Rkm * 1e3; return { R: Rkm, rho: m / (4 / 3 * Math.PI * R * R * R) / 1e3, flat, gas }; };
export function t3Bodies() {
  const sun = L337.spins.sun, Lh = galacticAxes().Lhat, LdotS = dot(Lh, sun.sHat), sp = D330.lit.spinDays, rows = [];
  for (const P of planetRows()) {
    const Pp = perpMean(P.iSunDeg), cosT = P.key === 'venus' ? dot(sun.sHat, L337.spins.venus.sHat) : Math.cos(P.obliqDeg * D2R), sobs = 2 * Math.PI / (Math.abs(sp[P.key]) * DAY);
    const br = (1 - P.f) * L337.wbg * LdotS * cosT, m = LIT337.planets.find((x) => x.key === P.key).m;
    rows.push({ key: P.key, group: 'planet', src: 'sun', f: P.f, aAU: P.aAU, cosT, Pp, sobs, periodAbs: Math.abs(sp[P.key]), ...propsOf(P.key, m), ...needC({ f: P.f, ssrc: sun.s, cosT, Pp, sobs, br }) });
  }
  { // 冥王星(太陽のまわり —— 主星にロックしていない比べる相手)
    const sh = shareSun(LIT.plutoAAU), Pp = perpMean(17.16), cosT = Math.cos(LIT.plutoObliqDeg * D2R), sobs = 2 * Math.PI / Math.abs(BODY_SRC.Pluto.spin[0]), br = (1 - sh.f) * L337.wbg * LdotS * cosT;
    rows.push({ key: 'pluto', group: 'planet', src: 'sun', f: sh.f, aAU: LIT.plutoAAU, cosT, Pp, sobs, periodAbs: Math.abs(BODY_SRC.Pluto.spin[0]) / DAY, ...propsOf('pluto', BODY_SRC.Pluto.M[0]), ...needC({ f: sh.f, ssrc: sun.s, cosT, Pp, sobs, br }) });
  }
  const mm = { moon: BODY_SRC.Moon.M[0], io: BODY_SRC.Io.M[0], europa: BODY_SRC.Europa.M[0], ganymede: BODY_SRC.Ganymede.M[0], callisto: BODY_SRC.Callisto.M[0], titan: LIT.moonMass.titan, triton: LIT.moonMass.triton };
  for (const M of moonRows().moons) {
    const ssrc = 2 * Math.PI / (Math.abs(sp[M.host]) * DAY), Pp = perpMean(M.iDeg), cosT = Math.cos(M.iDeg * D2R), sobs = 2 * Math.PI / (Math.abs(sp[M.key]) * DAY);
    rows.push({ key: M.key, group: 'moon', src: M.host, f: M.f, aAU: null, cosT, Pp, sobs, periodAbs: Math.abs(sp[M.key]), ...propsOf(M.key, mm[M.key]), locked: true, ...needC({ f: M.f, ssrc, cosT, Pp, sobs, br: 0 }) });
  }
  { // カロン(冥王星の自転が源 —— 相互にロック)
    const ch = moonRows().charon, ssrc = 2 * Math.PI / Math.abs(BODY_SRC.Pluto.spin[0]), Pp = perpMean(0), sobs = 2 * Math.PI / BODY_SRC.Charon.porb[0];
    rows.push({ key: 'charon', group: 'moon', src: 'pluto', f: ch.f, aAU: null, cosT: 1, Pp, sobs, periodAbs: BODY_SRC.Charon.porb[0] / DAY, ...propsOf('charon', BODY_SRC.Charon.M[0]), locked: true, mutual: true, ...needC({ f: ch.f, ssrc, cosT: 1, Pp, sobs, br: 0 }) });
  }
  return rows;
}
/** 相互にロックした連星の部位差分(第340便b の列 (iv) —— 受け手の並進 v = Ω × p₀・自転 s_r = Ω・W₀ の割合 φ): 閉じた形 ½ ∇f × (Ω × p₀)(1 − (1 − φ)) = φ × 列 (iii) */
export function lockedPair() {
  return [0, 0.5, 1].map((phi) => {
    const f = 0.3, el = 0, r = rOfF(f), p0 = [r, 0, 0], v = [0, r, 0], c = col4At(el, f, 1e-3, { phi, v, sr: [0, 0, 1] }), c0 = col4At(el, f, 1e-3, {});
    return { phi, mag: c.mag, magStatic: c0.mag, ratio: c0.mag > 0 ? z12(c.mag / c0.mag) : null };
  });
}
/** 順位相関(Spearman —— 同順位は平均の順位)。点が少ないので「関係が見えるか」まで */
export function spearman(x, y) {
  const idx = x.map((_, i) => i).filter((i) => fin(x[i]) && fin(y[i])), n = idx.length;
  if (n < 3) return { n, rho: null };
  const rank = (a) => { const o = idx.map((i) => [a[i], i]).sort((p, q) => p[0] - q[0]), r = {}; let k = 0; while (k < o.length) { let j = k; while (j + 1 < o.length && o[j + 1][0] === o[k][0]) j++; for (let t = k; t <= j; t++) r[o[t][1]] = (k + j) / 2 + 1; k = j + 1; } return r; };
  const rx = rank(x), ry = rank(y), mx = (n + 1) / 2;
  let sxy = 0, sxx = 0, syy = 0; for (const i of idx) { sxy += (rx[i] - mx) * (ry[i] - mx); sxx += (rx[i] - mx) ** 2; syy += (ry[i] - mx) ** 2; }
  return { n, rho: sxx > 0 && syy > 0 ? sxy / Math.sqrt(sxx * syy) : null };
}
/** 要る C_b(釣り合い・速さ)と天体の性質の順位相関(惑星 8 + 冥王星)・候補の関数の形 3 つ(閉じた形 1/(α P⊥ (1 − f))・s_obs/(s☉ α f)・密度のべき)の当てはまり(対数の残差の標準偏差) */
export function t3Law(rows) {
  const P = rows.filter((r) => r.group === 'planet'), out = { corr: {} };
  for (const want of ['bal', 'spd']) { out.corr[want] = {}; for (const k of DECL.props) out.corr[want][k] = spearman(P.map((r) => r[k]), P.map((r) => r[want])); }
  const sdLog = (pred, want) => { const d = P.filter((r) => fin(r[want]) && r[want] > 0).map((r) => Math.log10(r[want] / pred(r))); if (d.length < 2) return { n: d.length, sd: null }; const m = d.reduce((a, b) => a + b, 0) / d.length; return { n: d.length, sd: Math.sqrt(d.reduce((a, b) => a + (b - m) ** 2, 0) / (d.length - 1)), mean: m }; };
  const sunS = L337.spins.sun.s;
  out.forms = {
    balClosed: sdLog((r) => 1 / (DECL.alpha * r.Pp * (1 - r.f)), 'bal'),
    spdRatio: sdLog((r) => r.sobs / (sunS * DECL.alpha * r.f * Math.abs(r.cosT)), 'spd'),
    spdRho: sdLog((r) => r.rho, 'spd'),
  };
  out.nBal = P.filter((r) => r.bal !== null).length; out.nSpd = P.filter((r) => r.spd !== null).length;
  return out;
}

/* ───────── T4 赤道面以外の仰角のずれの率・2 層の球 ───────── */
/** 運ばれる速度 u(q) = f(q) Ω × q(W_rest 1・r_½ 1・Ω = ẑ) */
const uAt = (q) => scl([-q[1], q[0], 0], fOfR(nrm(q)));
const atEl = (el) => [Math.cos(el * D2R), 0, Math.sin(el * D2R)];
/** (b) ずれの率: 近い面と遠い面の速度の差 ÷ 直径 J r̂ から r̂ × (J r̂) − 座標の回転の垂直な分 f s⊥ ⇒ 閉じた形 −α f(1 − f) s⊥(C_b 1)。相対の差 */
export function shearNearFar(el, f, k) {
  const r = rOfF(f), rh = atEl(el), p0 = scl(rh, r), R = k * r, du = scl(sub(uAt(add(p0, scl(rh, R))), uAt(sub(p0, scl(rh, R)))), 1 / (2 * R));
  const w = [rh[1] * du[2] - rh[2] * du[1], rh[2] * du[0] - rh[0] * du[2], rh[0] * du[1] - rh[1] * du[0]], fc = fOfR(r), se = rh[2], sPerp = [-se * rh[0], 0, 1 - se * se];
  const got = sub(w, scl(sPerp, fc)), want = scl(sPerp, -DECL.alpha * fc * (1 - fc));
  return { rel: nrm(sub(got, want)) / nrm(want), got, want };
}
/** 球の体積の点(殻 nShell × 表面の点 —— 決まった点)と 2 層の密度の重み */
function volumePts(R, ratio) {
  const N = DECL.nPts, h = N / 2, ga = Math.PI * (3 - Math.sqrt(5)), dirs = [];
  for (let k = 0; k < h; k++) { const z = 1 - 2 * (k + 0.5) / h, rr = Math.sqrt(1 - z * z), ph = ga * k, v = [rr * Math.cos(ph), rr * Math.sin(ph), z]; dirs.push(v, scl(v, -1)); }
  const out = [];
  for (let i = 0; i < DECL.nShell; i++) { const x = (i + 0.5) / DECL.nShell, rad = x * R, dens = x < DECL.layerCore ? ratio : 1, wShell = dens * x * x / DECL.nShell; for (const d of dirs) out.push([scl(d, rad), wShell]); }
  return out;
}
/** (a) 回転: 質量で重みを付けた最小二乗で線形の写し δu ≈ A ξ を当て(A = [Σ m δu ξᵀ][Σ m ξ ξᵀ]⁻¹ —— 点の組の 2 次の偏りに依らない・第340便b の列 (iv) の型)、
 *  A の反対称の部分の回転から座標の回転 f Ω を引く ⇒ 閉じた形 −(α/2) f(1 − f) s⊥(C_b ½)。相対の差。密度(2 層)は重み m に入る */
export function rotMoment(el, f, k, ratio = 1) {
  const r = rOfF(f), rh = atEl(el), p0 = scl(rh, r), R = k * r, pts = volumePts(R, ratio), u0 = uAt(p0);
  let M = 0; const mean = [0, 0, 0], Mm = [[0, 0, 0], [0, 0, 0], [0, 0, 0]], Dx = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  for (const [xi, m] of pts) { const u = uAt(add(p0, xi)); for (let a = 0; a < 3; a++) mean[a] += m * (u[a] - u0[a]); M += m; }
  for (let a = 0; a < 3; a++) mean[a] /= M;
  for (const [xi, m] of pts) { const d = sub(sub(uAt(add(p0, xi)), u0), mean);
    for (let a = 0; a < 3; a++) for (let c = 0; c < 3; c++) { Mm[a][c] += m * xi[a] * xi[c]; Dx[a][c] += m * d[a] * xi[c]; } }
  const A = [0, 1, 2].map((a) => solve3(Mm, Dx[a])), om = [(A[2][1] - A[1][2]) / 2, (A[0][2] - A[2][0]) / 2, (A[1][0] - A[0][1]) / 2];
  const fc = fOfR(r), se = rh[2], sPerp = [-se * rh[0], 0, 1 - se * se], got = sub(om, [0, 0, fc]), want = scl(sPerp, -(DECL.alpha / 2) * fc * (1 - fc));
  return { rel: nrm(sub(got, want)) / nrm(want) };
}
function solve3(M, b) {
  const det = (A) => A[0][0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1]) - A[0][1] * (A[1][0] * A[2][2] - A[1][2] * A[2][0]) + A[0][2] * (A[1][0] * A[2][1] - A[1][1] * A[2][0]);
  const d = det(M); return [0, 1, 2].map((c) => det(M.map((row, i) => row.map((v, j) => (j === c ? b[i] : v)))) / d);
}
export function t4Rows() {
  const f = DECL.fT4, rows = DECL.elevT4.map((el) => {
    const b = {}, a = {};
    for (const k of DECL.kT4) { b[k] = shearNearFar(el, f, k).rel; a[k] = rotMoment(el, f, k, 1).rel; }
    const slope = (o) => Math.log10(o[0.1] / o[0.01]);
    return { elDeg: el, b, a, slopeB: slope(b), slopeA: slope(a) };
  });
  const layers = DECL.layerRatio.map((ratio) => { const o = { ratio }; for (const k of DECL.kT4) o[k] = rotMoment(45, f, k, ratio).rel; return o; });
  return { f, rows, layers };
}

/* ───────── T5 赤道面の見え方の境(取り分 f₀ = 1 − 1/(C_b α))───────── */
export function t5Rows() {
  const pl = planetRows(), mo = moonRows().moons, bodies = [...pl.map((p) => ({ key: p.key, f: p.f })), ...mo.map((m) => ({ key: m.key, f: m.f })), { key: 'charon', f: moonRows().charon.f }];
  return DECL.cT5.map((C) => { const f0 = fZeroEq(C); return { C, f0, pro: bodies.filter((b) => perpCoef(b.f, C) > 0).map((b) => b.key), retro: bodies.filter((b) => perpCoef(b.f, C) < 0).map((b) => b.key) }; });
}

/* ───────── 純関数の場面 ───────── */
export function pureScenes() {
  const S = {};
  // ① C_b 1 = 第340便b の置き方 (b)・C_b ½ = (a)
  { const T = t1Same340(); S.same340 = { dB: T.dB, dA: T.dA }; S.nul = { single: Math.max(...T.nul.map((x) => x.single)), axis: Math.max(...T.nul.map((x) => x.axis)) }; }
  // ② 閉じた形の境目: C_b 1・α 2・f → 0 で 90° の仰角 45°・f₀ ½/C_b 2・f ½ で 45°/C_b ½ で赤道の境なし
  S.bounds = { el45: el90(0, 1), f0c1: fZeroEq(1), el45c2: el90(0.5, 2), f0half: fZeroEq(0.5) };
  // ③ 和の型の金星の振幅の係数(C_b 1・P⊥ 1)= f(2f − 1)
  S.coef = { sum: sumCoef(1, 1), diff: diffCoef(1, 1) };
  // ④ ずれの率は赤道面以外でも閉じた形 −α f(1 − f) s⊥ に寄る(R/r 1e-3・仰角 30°)
  S.shear = { rel: shearNearFar(30, 0.3, 1e-3).rel, relRot: rotMoment(30, 0.3, 1e-3).rel };
  // ⑤ 順位相関の自己試験(単調なら ±1)
  S.spear = { up: spearman([1, 2, 3, 4], [10, 20, 30, 40]).rho, down: spearman([1, 2, 3, 4], [4, 3, 2, 1]).rho };
  // ⑥ 入力の拒否(係数が負・非有限・f の範囲の外)
  { const tries = [() => axialFactor(0.5, -1), () => axialFactor(0.5, NaN), () => axialFactor(1.5, 1)]; S.rejects = tries.map((t) => { try { t(); return false; } catch (e) { return e instanceof RangeError; } }); }
  return S;
}
export function pureGates(S) {
  return {
    same340: S.same340.dB <= 1e-12 && S.same340.dA <= 1e-12,
    nul: S.nul.single === 0 && S.nul.axis === 0,
    bounds: Math.abs(S.bounds.el45 - 45) <= 1e-9 && Math.abs(S.bounds.f0c1 - 0.5) <= 1e-15 && Math.abs(S.bounds.el45c2 - 45) <= 1e-9 && S.bounds.f0half === null,
    coef: JSON.stringify(S.coef.sum) === JSON.stringify([0, -1, 2]) && JSON.stringify(S.coef.diff) === JSON.stringify([0, -2, 2]),
    shear: S.shear.rel <= 1e-5 && S.shear.relRot <= 1e-5,
    spear: Math.abs(S.spear.up - 1) <= 1e-12 && Math.abs(S.spear.down + 1) <= 1e-12,
    rejects: S.rejects.every(Boolean),
  };
}
export { B340_VERSION, K338_VERSION, L337_VERSION, C337_VERSION, FLOOR };
