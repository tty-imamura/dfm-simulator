// 第337便l(原仮定者の回答(2026-11-15 —— 第138報の回答 3)「第101報、第103報の『２倍角の則』を、並進引きずりに対する軸引きずりの向きとして進める。回転だけでなく並進も考慮する」・
//   原仮定者の指示(2026-10-18 —— 第101報・第103報)「源の軸回転が、軸方向に対する角度差の、２倍の角度差で傾いた軸で作用する」「軸引きずりの強さは、軸方向で弱くなる」・統括の検証項目 R348):
//   **軸引きずりの向きの純関数** —— 2 倍角の則(源の自転 s を受け手への向き r̂ について半回転した向き 2(s·r̂)r̂ − s)・強さの仰角の依存の候補・
//   源の並進(受け手に対する相対の速度・背景に対する速度)の分を、並進引きずりが運ぶ速度 c = v_j + s_j × (p − p_j) の 1 つの式から出す形・天体への当てはめの向きの表。
//   (段 bevel-337l —— 器 tests/exp-w337l-bevel.mjs・正本 tests/out/bevel-337l.json)。**探索の候補の表だけ** —— エンジン・内蔵の本・受理器・既存の lib の本文は変えない。
//   この lib は第337便a・第337便j・第333便b・第332a 便・第335便b の lib を呼ぶ(本文は変えない)。html を読まない・ネットへ取りに行かない・乱数を使わない。
//
// ■ 記号: 源 j の自転のベクトル s(大きさ s・向き ŝ)・源から受け手への単位ベクトル r̂・距離 r・仰角 el(源の赤道面から r̂ への角 —— sin el = ŝ·r̂)・
//   s∥ = (s·r̂) r̂(線に沿う分)・s⊥ = s − s∥(線に垂直な分 —— |s⊥| = s cos el)・源の取り分 f = w/(w + W₀ + …)(w = (m/r_ref²)(r_ref/r)^α)・
//   受け手から見た源の見かけの回り Ω_app = −r̂ × v_rel / r(v_rel = 源の速度 − 基準の速度 —— 線に垂直)。
// ■ 差分の読み(第337便a の diff —— û × ∂_û F・W は受け手の位置で固定)の閉じた形(本 lib で導いた —— 器が数値の差分と照らす):
//   diff = f r̂ × [∂_r c − α_e (c − v_ref)/r] = f [(1 − α_e) s⊥ + α_e Ω_app]
//     今の並進の式の形(比べる列): α_e = α・v_ref = v_i(受け手の速度)/ 慣性系の背景宇宙が静止(主): α_e = α(1 − f)・v_ref = 0(背景に対する源の速度だけが並進の分)。
//   c の r̂ に沿う成分(近づく/遠ざかる)は r̂ × r̂ = 0 で現れない。
// ■ 2 倍角の則の候補(向き): reflect = s∥ − s⊥ = 2(s·r̂)r̂ − s(赤道面 −s・軸の方向 +s・仰角 45° で s から 90° —— 今のコードの EQ-16〔axialModel:"bevel"〕の向きと同じ)。
//   並進の分は「受け手に対する源の実効の自転」S_eff = s + r̂ × v_rel / r(S_eff × r r̂ = (c − v_ref) の線に垂直な分)に同じ則を当てる:
//   reflect(S_eff) = s∥ − s⊥ + Ω_app(並進の分は見かけの回りの向き —— 最も近い表面の移動の向きに受け手の近い面が運ばれる読みと同じ)。
// ■ 言わないこと: 向きの則は候補の表(この則ではこの向き・この配置に当たる)—— 自転の軸の傾きや逆行の原因の同定ではない。文献の値は未照合。
import { axialAt, complementDiff, staticRate, weight337, DECL as A337 } from './lib-w337a-supply.mjs';
import { LIT as LITJ, angleDeg, eclOfRaDec, orbitNormal, aKepler } from './lib-w337j-spinorbit.mjs';
import { integratedField } from './lib-w333b-axialfield.mjs';
import { LIT as LIT332A } from './lib-w332a-eqband.mjs';
import { galacticAxes } from './lib-w335b-carryledger.mjs';

export const LIB_VERSION = 'w337l-bevel-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const v3 = (a) => Array.isArray(a) && a.length === 3 && a.every(fin);
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const scl = (a, k) => [a[0] * k, a[1] * k, a[2] * k], add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (a) => { const n = nrm(a); return n > 0 ? scl(a, 1 / n) : [0, 0, 0]; };
const D2R = Math.PI / 180, AU = 1.495978707e11, DAY = 86400, MSUN = 1.98847e30, KPC = 3.0856775814913673e19;

/** 一覧 */
export const DIRS = Object.freeze(['reflect', 'diff', 'diffTwist']);
export const READINGS = Object.freeze(['static', 'self']);
export const AMPS = Object.freeze(['signed', 'share', 'unit']);
export const DIR_JA = Object.freeze({ reflect: '2 倍角の則(s∥ − s⊥ —— 半回転の向き)', diff: '差分の読み(第337便a の diff —— (1 − α_e) s⊥ + α_e Ω_app)', diffTwist: '差分の読み + 線のまわりの捩れ(μ cos^q el で s∥ を足す)' });
export const READING_JA = Object.freeze({ static: '慣性系の背景宇宙が静止(主 —— α_e = α(1 − f)・v_ref = 0)', self: '今の並進の式の形(比べる列 —— α_e = α・v_ref = v_i)' });
export const AMP_JA = Object.freeze({ signed: '符号つき f(α_e − 1)(差分の読みと同じ符号 —— α_e < 1 で向きが反転)', share: '取り分 f(反転しない)', unit: '1(向きだけ)' });

/** 宣言(走行の前に置く —— 走らせたノブの格子と判定の物差しの記録) */
export const DECL = Object.freeze({
  alpha: 2,
  /** 仰角の格子 [°](原文の 3 点 0°・45°・90° を含む) */
  elevDeg: Object.freeze([0, 15, 30, 45, 60, 75, 90]),
  /** 強さの仰角の依存の候補: reflect × (ε + (1 − ε) cos^p el)(p 0・1・2・ε 0・0.1)/ diffTwist の μ・q(45° で 90° になる組 μ = 2^{q/2}) */
  strengthP: Object.freeze([0, 1, 2]), strengthEps: Object.freeze([0, 0.1]), twistQ: Object.freeze([0, 1]),
  /** 並進の分の重み T(reflect の Ω_app に掛ける): 1(S_eff の則)・α_e/(α_e − 1)(差分の読みと同じ比)・0(回転の分だけ —— 対照) */
  transWeights: Object.freeze(['one', 'diffRatio', 'zero']),
  /** 受け手の公転 ÷ 源の自転の比 n/s の格子 */
  nOverS: Object.freeze([0, 0.05, 0.11, 0.29, 0.5, 1, 2]),
  /** 背景慣性決定力 W₀(第337便a の正本 background.balance の読み i〔背景が静止〕の解 —— 金星で釣り合う f = 0.5・r_½ 0.720 AU)と背景軸引きずり ω_bg(同じ正本の wbg —— 中心の点・R_½ 4 kpc) */
  W0: 171298195.09007522, wbg: -1.075544537880262e-16, W0Src: '第337便a の正本 tests/out/supply-337a.json の background.balance[読み i].W0 と background.wbg の写し(値を写した —— 入力のファイルにしない)',
  /** 天体の自転のベクトル(黄道 J2000 —— 第337便a の正本の bodies の sHat と s の写し) */
  spins: Object.freeze({
    sun: Object.freeze({ s: 2.8653296828269953e-6, sHat: Object.freeze([0.1223534935, -0.03103787025, 0.9920011458]) }),
    venus: Object.freeze({ s: 2.992449328303337e-7, sHat: Object.freeze([-0.01869081417, -0.01087252286, -0.9997661935]) }),
  }),
  /** 数値の差分の刻み(÷ 距離)と照合の許容 */
  h: 1e-4, numTol: 1e-6, idTol: 1e-12,
  /** 軌道の平均の点の数 */
  nPhi: 720,
  /** 合成の 60° の規則(原仮定者の指示(2026-10-30 —— 第121報)「逆向きでも 60° 以上違えば減速しない」)の境目 [°] */
  rule60Deg: 60,
});

/** 文献の値(本環境では未照合 —— 出典の名と確かさ) */
export const LIT = Object.freeze({
  note: '文献の値・未照合(この環境から一次資料のサイトに届かない —— 出典の名と値は記憶とリポジトリの中の値の写し)',
  /** 惑星の半長軸 [AU]・恒星の公転周期 [日]・質量 [kg](NASA NSSDC の Planetary Fact Sheet —— 確かさ 高) */
  planets: Object.freeze([
    Object.freeze({ key: 'mercury', ja: '水星', aAU: 0.387098, Pd: 87.969, m: 3.3011e23 }),
    Object.freeze({ key: 'venus', ja: '金星', aAU: 0.723332, Pd: 224.701, m: 4.8675e24 }),
    Object.freeze({ key: 'earth', ja: '地球', aAU: 1.000001, Pd: 365.256, m: 5.9724e24 }),
    Object.freeze({ key: 'mars', ja: '火星', aAU: 1.523679, Pd: 686.980, m: 6.4171e23 }),
    Object.freeze({ key: 'jupiter', ja: '木星', aAU: 5.2044, Pd: 4332.59, m: 1.89819e27 }),
    Object.freeze({ key: 'saturn', ja: '土星', aAU: 9.5826, Pd: 10759.22, m: 5.6834e26 }),
    Object.freeze({ key: 'uranus', ja: '天王星', aAU: 19.2184, Pd: 30685.4, m: 8.6813e25 }),
    Object.freeze({ key: 'neptune', ja: '海王星', aAU: 30.110, Pd: 60189, m: 1.02413e26 }),
  ]),
  planetsSrc: 'NASA NSSDC の Planetary Fact Sheet(半長軸・恒星の公転周期・質量)—— 文献の値・未照合・確かさ 高。太陽の赤道面に対する傾きと自転軸の傾きは第332便a の lib の表(LIT.planets —— Souami & Souchay 2012・Archinal et al. 2018 からの換算)を呼ぶ',
  /** 太陽の銀河面からの高さと銀河の中心までの距離(Bennett & Bovy 2019 MNRAS 482, 1417 の z☉ 約 20.8 pc・GRAVITY 2019 の R₀ 約 8.2 kpc の桁)—— 確かさ 中 */
  zSunPc: 20.8, R0kpc: 8.2, galSrc: 'Bennett & Bovy 2019 MNRAS 482, 1417(太陽の銀河面からの高さ 約 20.8 pc)・GRAVITY Collaboration 2019 A&A 625, L10(R₀ 約 8.2 kpc の桁)—— 文献の値・未照合・確かさ 中',
  /** 主要な衛星の主星の質量と半長軸・傾きは第337便j の lib の表(LIT.t2Receivers)を呼ぶ */
  hostMass: Object.freeze({ earth: 5.9724e24, jupiter: 1.89819e27, saturn: 5.6834e26, neptune: 1.02413e26, pluto: 1.303e22 }),
  hostA: Object.freeze({ earth: 1.000001, jupiter: 5.2044, saturn: 9.5826, neptune: 30.110, pluto: 39.482 }),
});

/* ───────── 基本の分け方 ───────── */
/** s・r̂ → s∥・s⊥・仰角 el [°] */
export function splitSpin(s, rhat) {
  if (!v3(s) || !v3(rhat)) throw new RangeError('splitSpin: 有限の 3 成分');
  const u = unit(rhat), sp = dot(s, u), par = scl(u, sp), perp = sub(s, par), sm = nrm(s);
  return { par, perp, elDeg: sm > 0 ? Math.asin(Math.max(-1, Math.min(1, sp / sm))) / D2R : 0, u };
}
/** 2 倍角の則の向き(半回転): 2(s·r̂)r̂ − s */
export function twoAngleAxis(s, rhat) { const { par, perp } = splitSpin(s, rhat); return sub(par, perp); }
/** 見かけの回り Ω_app = −r̂ × v_rel / r */
export const apparentSpin = (rhat, vRel, r) => scl(crs(unit(rhat), vRel), -1 / r);
/** 読みの α_e と基準の速度 */
export function readingOf({ reading, alpha, f, vRecv }) {
  if (!READINGS.includes(reading)) throw new RangeError('readingOf: 読み ' + reading);
  return reading === 'static' ? { alphaE: alpha * (1 - f), vRef: [0, 0, 0] } : { alphaE: alpha, vRef: vRecv };
}
/** 差分の読みの閉じた形: f[(1 − α_e) s⊥ + α_e Ω_app]・回転の分と並進の分を分けて返す */
export function diffClosed({ s, rhat, r, vSrc, vRecv = [0, 0, 0], f, alpha = DECL.alpha, reading }) {
  if (!v3(s) || !v3(rhat) || !v3(vSrc) || !v3(vRecv) || !fin(r) || !(r > 0) || !fin(f) || f < 0 || f > 1) throw new RangeError('diffClosed: 有限・r > 0・0 ≤ f ≤ 1');
  const { alphaE, vRef } = readingOf({ reading, alpha, f, vRecv }), { perp } = splitSpin(s, rhat), Om = apparentSpin(rhat, sub(vSrc, vRef), r);
  const rot = scl(perp, f * (1 - alphaE)), tr = scl(Om, f * alphaE);
  return { rot, tr, tot: add(rot, tr), alphaE, Om };
}
/** c の 1 つの式: f r̂ × [∂_r c − α_e (c − v_ref)/r](c = v_j + s × (p − p_j) を受け手の中心で・∂_r c = s × r̂)—— diffClosed と同じ値になる(器が照らす) */
export function diffFromC({ s, rhat, r, vSrc, vRecv = [0, 0, 0], f, alpha = DECL.alpha, reading }) {
  const { alphaE, vRef } = readingOf({ reading, alpha, f, vRecv }), u = unit(rhat), c = add(vSrc, crs(s, scl(u, r))), dc = crs(s, u);
  return scl(crs(u, sub(dc, scl(sub(c, vRef), alphaE / r))), f);
}
/** 強さの仰角の因子 g(el) = ε + (1 − ε) cos^p el */
export const strengthOf = (elDeg, p, eps = 0) => eps + (1 - eps) * Math.pow(Math.cos(elDeg * D2R), p);
/** 並進の分の重み T */
export function transWeightOf(tw, alphaE) {
  if (tw === 'one') return 1;
  if (tw === 'zero') return 0;
  if (tw === 'diffRatio') return Math.abs(alphaE - 1) > 1e-300 ? alphaE / (alphaE - 1) : null;
  if (fin(tw)) return tw;
  throw new RangeError('transWeightOf: ' + tw);
}
/** 振幅の候補 */
export function ampOf(amp, f, alphaE) {
  if (amp === 'signed') return f * (alphaE - 1);
  if (amp === 'share') return f;
  if (amp === 'unit') return 1;
  throw new RangeError('ampOf: ' + amp);
}
/**
 * 軸引きずりの向きの候補(1 つの源): dir(reflect・diff・diffTwist)・reading(static・self)・amp(signed・share・unit)・強さ p・ε・並進の重み tw・diffTwist の μ・q。
 * reflect: A [g(el)(s∥ − s⊥) + T Ω_app](A = 振幅・g は回転の分にだけ掛ける —— 並進の分は源の自転の軸の仰角を持たない)。
 * diff: f[(1 − α_e) s⊥ + α_e Ω_app](振幅・強さのノブは効かない —— 閉じた形のまま)。diffTwist: diff + f(α_e − 1) μ cos^q el · s∥。
 */
export function bevelOmega({ s, rhat, r, vSrc = [0, 0, 0], vRecv = [0, 0, 0], f, alpha = DECL.alpha, reading = 'static', dir = 'reflect', amp = 'signed', p = 1, eps = 0, tw = 'one', mu = Math.SQRT2, q = 1 }) {
  if (!DIRS.includes(dir)) throw new RangeError('bevelOmega: 向き ' + dir);
  const { alphaE, vRef } = readingOf({ reading, alpha, f, vRecv }), sp = splitSpin(s, rhat), Om = apparentSpin(rhat, sub(vSrc, vRef), r);
  if (dir === 'diff') { const d = diffClosed({ s, rhat, r, vSrc, vRecv, f, alpha, reading }); return { rot: d.rot, tr: d.tr, tot: d.tot, alphaE, elDeg: sp.elDeg }; }
  if (dir === 'diffTwist') { const d = diffClosed({ s, rhat, r, vSrc, vRecv, f, alpha, reading }), tw2 = scl(sp.par, f * (alphaE - 1) * mu * Math.pow(Math.cos(sp.elDeg * D2R), q));
    return { rot: add(d.rot, tw2), tr: d.tr, tot: add(add(d.rot, tw2), d.tr), alphaE, elDeg: sp.elDeg }; }
  const A = ampOf(amp, f, alphaE), g = strengthOf(sp.elDeg, p, eps), T = transWeightOf(tw, alphaE);
  const rot = scl(sub(sp.par, sp.perp), A * g), tr = T === null ? [NaN, NaN, NaN] : scl(Om, A * T);
  return { rot, tr, tot: add(rot, tr), alphaE, elDeg: sp.elDeg, A, g, T };
}
/** 歯車の読み(最も近い表面の移動の向き): 源の最も近い表面の点(源の中心 + R_s r̂)の速度 u_s = v_rel + s × R_s r̂ の線に垂直な分と、
 *  受け手の角速度 ω の近い面(受け手の中心 − R_r r̂)の速度 ω × (−R_r r̂) の向きの余弦(同じ向きなら +1)・軸の接触の向き(線のまわりの捩れ s·r̂ と ω·r̂ の符号) */
export function gearCheck({ s, rhat, omega, vRel = [0, 0, 0], Rs = 1, Rr = 1 }) {
  const u = unit(rhat), us0 = add(vRel, crs(s, scl(u, Rs))), us = sub(us0, scl(u, dot(us0, u))), ur = crs(omega, scl(u, -Rr));
  const cos = nrm(us) > 0 && nrm(ur) > 0 ? dot(us, ur) / (nrm(us) * nrm(ur)) : null;
  return { cos, twistSame: Math.sign(dot(s, u)) === Math.sign(dot(omega, u)) || dot(s, u) === 0, usMag: nrm(us) };
}

/* ───────── 数値の照らし(第337便a の差分の読み・第333便b の場) ───────── */
/** 今の並進の式の形: 第337便a の axialAt(W は受け手の位置で固定)の diff と diffClosed(self)の相対の差 */
export function checkSelf({ s, rhat, r, vSrc, vRecv, m = 1, alpha = DECL.alpha, rRef = 1, Wextra = 1 }) {
  const u = unit(rhat), at = scl(u, r), w = weight337(m, r, alpha, rRef), W = w + Wextra, f = w / W;
  const A = axialAt({ at, vRecv, src: { p: [0, 0, 0], v: vSrc, s, m }, W, alpha, rRef, h: DECL.h });
  const C = diffClosed({ s, rhat: u, r, vSrc, vRecv, f, alpha, reading: 'self' }).tot;
  return { num: A.diff, closed: C, rel: nrm(sub(A.diff, C)) / Math.max(f * (nrm(s) + nrm(sub(vSrc, vRecv)) / r), 1e-300), f };   // 尺度 f(|s| + |v_rel|/r)で割る(零点の近くの配置でも測れる)
}
/** 背景が静止: 第337便a の complementDiff(静止の補い W₀)の勾配の差分と diffClosed(static)の相対の差 */
export function checkStatic({ s, rhat, r, vSrc, m = 1, alpha = DECL.alpha, rRef = 1, W0 = 1 }) {
  const u = unit(rhat), at = scl(u, r), C0 = complementDiff({ at, vRecv: [0, 0, 0], srcs: [{ p: [0, 0, 0], v: vSrc, s, m }], W0, K: 0, alpha, rRef, u: scl(u, -1), R: r * 1e-3, h: DECL.h });
  const C = diffClosed({ s, rhat: u, r, vSrc, f: C0.f, alpha, reading: 'static' }).tot;
  return { num: C0.grad, closed: C, rel: nrm(sub(C0.grad, C)) / Math.max(C0.f * (nrm(s) + nrm(vSrc) / r), 1e-300), f: C0.f };
}
/** 第333便b の通過の場面(源は原点・速度 (0,3,0)・自転 0・m/r²・自己の重み 1・受け手 (2,0,0)): ω = ½∇×U の z と、diffClosed(static —— 自己の重みを W₀ と読む)の z */
export function passingScene() {
  const F = integratedField({ at: [2, 0, 0], sources: [{ p: [0, 0, 0], v: [0, 3, 0], s: [0, 0, 0], m: 1 }], alpha: 2, rRef: 1, selfW: 1, W0: 0 });
  const f = 0.25 / 1.25, d = diffClosed({ s: [0, 0, 0], rhat: [1, 0, 0], r: 2, vSrc: [0, 3, 0], f, alpha: 2, reading: 'static' });
  return { fullZ: F.omega[2], diffZ: d.tot[2], ratio: d.tot[2] / F.omega[2], OmAppZ: d.Om[2] };
}

/* ───────── T1 仰角の表 ───────── */
export function elevRow(elDeg, { alphaE = 2 } = {}) {
  const s = [0, 0, 1], rh = [Math.cos(elDeg * D2R), 0, Math.sin(elDeg * D2R)], sp = splitSpin(s, rh), R = twoAngleAxis(s, rh);
  const diffV = scl(sp.perp, 1 - alphaE), twV = (q) => add(diffV, scl(sp.par, (alphaE - 1) * Math.pow(2, q / 2) * Math.pow(Math.cos(elDeg * D2R), q)));
  const ang = (v) => (nrm(v) > 1e-14 ? angleDeg(v, s) : null);
  // 軸の方向(el = 90°)で大きさが 0 になる候補の向きは、el → 90° の極限(90° − 1e-7°)で読む
  const elL = Math.min(elDeg, 90 - 1e-7), rhL = [Math.cos(elL * D2R), 0, Math.sin(elL * D2R)], spL = splitSpin(s, rhL);
  const twL = (q) => add(scl(spL.perp, 1 - alphaE), scl(spL.par, (alphaE - 1) * Math.pow(2, q / 2) * Math.pow(Math.cos(elL * D2R), q)));
  return { elDeg, reflectAng: ang(R), twist1Lim: angleDeg(twL(1), s), diffLim: angleDeg(scl(spL.perp, 1 - alphaE), s), reflectAngClosed: 180 - 2 * elDeg, diffAng: ang(diffV), twist0Ang: ang(twV(0)), twist1Ang: ang(twV(1)),
    mag: { reflectP0: strengthOf(elDeg, 0), reflectP1: strengthOf(elDeg, 1), reflectP2: strengthOf(elDeg, 2), reflectP1e: strengthOf(elDeg, 1, 0.1), diff: nrm(diffV) / Math.abs(alphaE - 1), twist0: nrm(twV(0)) / Math.abs(alphaE - 1), twist1: nrm(twV(1)) / Math.abs(alphaE - 1) },
    axisComp: dot(R, s), gear: elDeg < 90 ? gearCheck({ s, rhat: rh, omega: R }).cos : null, gearTwist: gearCheck({ s, rhat: rh, omega: R }).twistSame };
}

/* ───────── T2 公転する受け手(赤道面・源は静止) ───────── */
/** n/s の関数: 今の形の diff((1 − α)s + αn)・reflect T = 1 と T = α/(α − 1)(振幅 f(α − 1))・背景が静止の diff(並進の分 0)。f = 1 の単位 */
export function orbitRow(x, { alpha = DECL.alpha, fSt = 0.3 } = {}) {
  const s = [0, 0, 1], rh = [1, 0, 0], r = 1, vRecv = [0, x, 0];
  const selfDiff = bevelOmega({ s, rhat: rh, r, vRecv, f: 1, alpha, reading: 'self', dir: 'diff' }).tot[2];
  const ref1 = bevelOmega({ s, rhat: rh, r, vRecv, f: 1, alpha, reading: 'self', dir: 'reflect', amp: 'signed', p: 1, tw: 'one' }).tot[2];
  const refD = bevelOmega({ s, rhat: rh, r, vRecv, f: 1, alpha, reading: 'self', dir: 'reflect', amp: 'signed', p: 1, tw: 'diffRatio' }).tot[2];
  const st = bevelOmega({ s, rhat: rh, r, vRecv, f: fSt, alpha, reading: 'static', dir: 'diff' }).tot[2];
  const stRef = bevelOmega({ s, rhat: rh, r, vRecv, f: fSt, alpha, reading: 'static', dir: 'reflect', amp: 'signed', p: 1, tw: 'one' }).tot[2];
  return { nOverS: x, selfDiff, selfDiffClosed: (1 - alpha) + alpha * x, ref1, ref1Closed: (alpha - 1) * (x - 1), refD, staticDiff: st, staticDiffClosed: staticRate({ s: 1, f: fSt, alpha }), staticRef: stRef };
}
/** 互いにロックした円の連星(赤道面・受け手は源の自転と同じ角速度で回る): 今の形の reflect T = 1 は 0・diff は f s */
export function lockedRow({ alpha = DECL.alpha } = {}) {
  const s = [0, 0, 1], rh = [1, 0, 0], vRecv = crs(s, rh);
  return { ref1: bevelOmega({ s, rhat: rh, r: 1, vRecv, f: 1, alpha, reading: 'self', dir: 'reflect', tw: 'one' }).tot,
    diff: bevelOmega({ s, rhat: rh, r: 1, vRecv, f: 1, alpha, reading: 'self', dir: 'diff' }).tot,
    staticRef: bevelOmega({ s, rhat: rh, r: 1, vRecv, f: 0.3, alpha, reading: 'static', dir: 'reflect', tw: 'one' }).tot };
}
/** 近づく/遠ざかる(相対の速度が r̂ に沿う)は軸引きずりを作らない: 全部の向きの候補で 0 */
export function radialRow() {
  const s = [0, 0, 0], rh = [1, 0, 0], vSrc = [-5, 0, 0];
  return DIRS.map((dir) => ({ dir, mag: nrm(bevelOmega({ s, rhat: rh, r: 2, vSrc, f: 0.4, reading: 'static', dir }).tot) + nrm(bevelOmega({ s, rhat: rh, r: 2, vSrc, f: 0.4, reading: 'self', dir }).tot) }));
}

/* ───────── T3 天体 ───────── */
/** 源の赤道面に対する傾き i の円の軌道の上の平均(受け手の位置 r̂(φ)): ⟨ω̂ の源の軸の向きの成分⟩・⟨軌道の法線の向きの成分⟩ —— 振幅 1 の向きの因子 */
export function orbitMeanDir({ iDeg, dir = 'reflect', p = 1, eps = 0, alphaE = 2, nPhi = DECL.nPhi }) {
  const s = [0, 0, 1], nO = [0, -Math.sin(iDeg * D2R), Math.cos(iDeg * D2R)], e1 = [1, 0, 0], e2 = crs(nO, e1);
  let as = 0, an = 0;
  for (let k = 0; k < nPhi; k++) { const ph = 2 * Math.PI * (k + 0.5) / nPhi, rh = add(scl(e1, Math.cos(ph)), scl(e2, Math.sin(ph))), sp = splitSpin(s, rh);
    let w;
    if (dir === 'reflect') w = scl(sub(sp.par, sp.perp), strengthOf(sp.elDeg, p, eps));
    else if (dir === 'diff') w = scl(sp.perp, -1);
    else w = add(scl(sp.perp, -1), scl(sp.par, Math.SQRT2 * Math.cos(sp.elDeg * D2R)));
    as += dot(w, s) / nPhi; an += dot(w, nO) / nPhi; }
  return { alongSpin: as, alongNormal: an };
}
/** 背景が静止の取り分(太陽の重みと W₀ —— 第337便a の解の W₀)・α_e */
export function shareSun(aAU, { W0 = DECL.W0, alpha = DECL.alpha } = {}) {
  const w = weight337(MSUN, aAU * AU, alpha, AU), f = w / (w + W0);
  return { w, f, alphaE: alpha * (1 - f), fBg: W0 / (w + W0) };
}
/** 逆行や横倒しの天体の配置: 2 倍角の則の向き(半回転)で受け手の自転の向きと同じ向きになる仰角 el* = (180° − θ)/2(θ = 源の軸と受け手の自転の軸の角) */
export const elNeeded = (thetaDeg) => (180 - thetaDeg) / 2;
/** 太陽 → 8 惑星の行 */
export function planetRows({ alpha = DECL.alpha } = {}) {
  const sun = DECL.spins.sun;
  return LIT.planets.map((P) => {
    const row332 = LIT332A.planets.rows.find((x) => x.name === P.ja), iS = row332.iSun, obl = row332.obliq, sh = shareSun(P.aAU, { alpha });
    const n = 2 * Math.PI / (P.Pd * DAY), x = n / sun.s;
    const mRef = orbitMeanDir({ iDeg: iS, dir: 'reflect', p: 1 }), mRef0 = orbitMeanDir({ iDeg: iS, dir: 'reflect', p: 0 }), mDiff = orbitMeanDir({ iDeg: iS, dir: 'diff' }), mTw = orbitMeanDir({ iDeg: iS, dir: 'diffTwist' });
    const ampSigned = sh.f * (sh.alphaE - 1);
    // 太陽の項(源の軸の向きの成分・rad/s): 符号つきの振幅の reflect(p 1)・diff(背景が静止)・share の reflect(反転しない)
    const sunRefSigned = ampSigned * sun.s * mRef.alongSpin, sunDiffSt = sh.f * (1 - sh.alphaE) * sun.s * (-mDiff.alongSpin), sunRefShare = sh.f * sun.s * mRef.alongSpin;
    // 今の並進の式の形の公転の分(赤道面の閉じた形 —— 振幅 f): diff は α n・reflect(T = 1)は (α − 1) n
    const selfDiff = sh.f * ((1 - alpha) * sun.s + alpha * n), selfRef1 = sh.f * (alpha - 1) * (n - sun.s);
    const bg = sh.fBg * DECL.wbg;
    const elMax = iS, eln = elNeeded(obl);
    return { key: P.key, ja: P.ja, aAU: P.aAU, f: sh.f, alphaE: sh.alphaE, nOverS: x, iSunDeg: iS, obliqDeg: obl,
      dirMean: { reflectP1: mRef.alongSpin, reflectP0: mRef0.alongSpin, diff: mDiff.alongSpin, diffTwist: mTw.alongSpin },
      sunRefSigned, sunDiffStatic: sunDiffSt, sunRefShare, selfDiff, selfRef1, bg, ratioSigned: bg !== 0 ? sunRefSigned / bg : null, ratioShare: sunRefShare / bg,
      elMaxDeg: elMax, elNeededDeg: eln, inRange: eln <= elMax, prograde: obl < 90 };
  });
}
/** 金星の釣り合い(第337便a の型: G(f) = (1 − f) ω_bg (L̂·n̂) + T(f) (ŝ☉·n̂) = 0・n̂ = 黄道の北)を向きの則の因子 P で読む: T(f) = P · s☉ f(1 − α(1 − f))(符号つき)/ P · s☉ f(share) */
export function venusBalance({ P, amp = 'signed', alpha = DECL.alpha }) {
  const sun = DECL.spins.sun, L = galacticAxes().Lhat, nE = [0, 0, 1], galN = dot(L, nE), sunN = dot(sun.sHat, nE);
  const T = amp === 'signed' ? (f) => P * sun.s * f * (1 - alpha * (1 - f)) : (f) => -P * sun.s * f;
  const Gf = (f) => (1 - f) * DECL.wbg * galN + T(f) * sunN, roots = [];
  for (let i = 1; i < 999; i++) { let a = i / 1000, b = (i + 1) / 1000; if (Math.sign(Gf(a)) !== Math.sign(Gf(b))) { for (let it = 0; it < 100; it++) { const m = (a + b) / 2; if (Math.sign(Gf(m)) === Math.sign(Gf(a))) a = m; else b = m; } roots.push((a + b) / 2); } }
  const f = roots.length ? roots.reduce((x, y) => (Math.abs(y - 0.5) < Math.abs(x - 0.5) ? y : x)) : null;
  const wV = weight337(MSUN, LIT.planets[1].aAU * AU, alpha, AU);
  // 背景の項を太陽の項に釣り合わせるのに要る背景の項の倍(share の型 —— f = 0.5 のまま)
  const need = amp === 'share' ? Math.abs(T(0.5) * sunN / (0.5 * DECL.wbg * galN)) : null;
  return { P, amp, roots, f, df: f === null ? null : f - 0.5, W0: f === null ? null : wV * (1 - f) / f, galN, sunN, bgFactorNeeded: need };
}
/** 銀河 → 太陽系の位置: 銀河面からの仰角・2 倍角の則の向きの源の軸からの角・120° に要る仰角と高さ・今の形の公転の分 */
export function galaxyRow({ alpha = DECL.alpha, sFieldOverOmega = [0, 0.5, 1, 2] } = {}) {
  const el = Math.atan2(LIT.zSunPc / 1e3, LIT.R0kpc) / D2R, ang = 180 - 2 * el, el120 = elNeeded(120), z120 = LIT.R0kpc * Math.tan(el120 * D2R);
  const oort = A337.oort, Om = (oort.A - oort.B);   // km s⁻¹ kpc⁻¹(Ω = A − B)
  const rows = sFieldOverOmega.map((k) => ({ sFieldOverOmega: k, selfDiff: (1 - alpha) * k + alpha * 1, selfRef1: (alpha - 1) * (1 - k), staticDiffSign: Math.sign(1 - alpha * (1 - 0.192)) * Math.sign(k) }));
  const sunAx = DECL.spins.sun.sHat, L = galacticAxes().Lhat;
  return { elDeg: el, reflectAngDeg: ang, el120Deg: el120, z120kpc: z120, OmegaKmsKpc: Om, rows, sunVsL: angleDeg(sunAx, L) };
}
/** 惑星 → 主要な衛星(背景が静止の取り分: 主星の重み ÷ (主星 + 太陽 + W₀))と冥王星 – カロン */
export function moonRows({ alpha = DECL.alpha } = {}) {
  const keys = ['moon', 'io', 'europa', 'ganymede', 'callisto', 'titan', 'triton'];
  const out = keys.map((k) => {
    const R = LITJ.t2Receivers.find((x) => x.key === k), mP = LIT.hostMass[R.host], wP = weight337(mP, R.a, alpha, AU), wS = weight337(MSUN, LIT.hostA[R.host] * AU, alpha, AU);
    const f = wP / (wP + wS + DECL.W0), aE = alpha * (1 - f), iDeg = R.iDeg, m = orbitMeanDir({ iDeg, dir: 'reflect', p: 1, alphaE: aE });
    return { key: k, host: R.host, iDeg, f, alphaE: aE, eqSign: Math.sign(1 - aE), reflectSignedSign: Math.sign((aE - 1) * m.alongSpin), dirMean: m.alongSpin, retro: iDeg > 90 };
  });
  const C = LITJ.charon, Pl = LITJ.pluto, wP = weight337(Pl.m, C.a, alpha, AU), wS = weight337(MSUN, LIT.hostA.pluto * AU, alpha, AU), f = wP / (wP + wS + DECL.W0);
  const lk = lockedRow({ alpha });
  return { moons: out, charon: { f, alphaE: alpha * (1 - f), selfRef1Locked: lk.ref1[2], selfDiffLocked: lk.diff[2], staticRefLocked: lk.staticRef[2] }, pole: { reflect: twoAngleAxis([0, 0, 1], [0, 0, 1])[2] } };
}
/** 比べる天体(主星にロックしていない —— 地球・火星・冥王星・コンパクト天体)と逆行・横倒しの天体の配置 */
export function compareRows() {
  const sun = DECL.spins.sun.sHat, rows = [];
  for (const k of ['earth', 'mars', 'uranus', 'venus']) { const r332 = LIT332A.planets.rows.find((x) => x.name === LIT.planets.find((p) => p.key === k).ja);
    rows.push({ key: k, src: 'sun', thetaDeg: r332.obliq, elMaxDeg: r332.iSun, elNeededDeg: elNeeded(r332.obliq), thetaKind: '自分の公転面に対する傾き(第332便a の表)' }); }
  { const Pl = LITJ.pluto, pole = eclOfRaDec(Pl.poleRA, Pl.poleDec) /* 右手の向きの極(第337便j の LIT の注)= 自転の向き */, spin = pole, nO = orbitNormal(Pl.iDeg, Pl.nodeDeg);
    const thSun = angleDeg(spin, sun);
    rows.push({ key: 'pluto', src: 'sun', thetaDeg: thSun, thetaOrb: angleDeg(spin, nO), elMaxDeg: Math.min(angleDeg(nO, sun), 180 - angleDeg(nO, sun)), elNeededDeg: elNeeded(thSun), thetaKind: '太陽の自転軸に対する角(第337便j の極と軌道の要素から)' }); }
  for (const c of LITJ.compact.filter((x) => x.comp)) { const tilt = c.tiltDeg;
    rows.push({ key: c.key, src: c.comp, thetaDeg: null, tiltDeg: tilt, elMaxDeg: tilt, reflectRange: [180 - 2 * tilt, 180], thetaKind: '伴星の自転の軸は未知(伴星を源とする向きの則は伴星の自転の軸が要る —— 軌道の法線からの傾きだけ)' }); }
  for (const r of rows) r.inRange = r.elNeededDeg === undefined || r.elNeededDeg === null ? null : r.elNeededDeg <= r.elMaxDeg;
  return rows;
}
/** T4 合成の 60° の規則: 金星の位置の太陽の項と背景の項のベクトルの和と、規則どおりの読み(なす角 ≥ 60° なら減速しない —— 大きさを足す) */
export function rule60({ a, b }) {
  const ang = angleDeg(a, b), vsum = nrm(add(a, b)), big = Math.max(nrm(a), nrm(b)), noDecel = ang !== null && ang <= 180 - DECL.rule60Deg;
  return { angDeg: ang, vecSum: vsum, ruleRead: noDecel ? Math.max(vsum, big) : vsum, noDecel, larger: big };
}

/* ───────── 純関数の場面 ───────── */
export function pureScenes() {
  const S = {};
  // ① 原文の 3 点: 赤道面 −ŝ・45° で 90°・軸の方向 +ŝ(半回転の向き)と |半回転| = |s|
  { const s = [0, 0, 2.5], e = elevRow(0), m = elevRow(45), p = elevRow(90), R = twoAngleAxis(s, [Math.cos(0.3), 0.2, Math.sin(0.3)]);
    S.three = { eq: e.reflectAng, mid: m.reflectAng, pole: p.reflectAng, norm: Math.abs(nrm(R) - 2.5) / 2.5 }; }
  // ② 差分の読みの閉じた形 = c の 1 つの式(ランダムでない固定の 4 配置)・第337便a の数値の差分(今の形 axialAt・静止 complementDiff)と同じ
  { const cfg = [{ s: [0.1, -0.3, 1.2], rhat: [1, 0.2, 0.1], r: 3, vSrc: [0.2, 0.5, -0.1], vRecv: [0, 0.3, 0.05] }, { s: [0, 0, 1], rhat: [1, 0, 0], r: 2, vSrc: [0, 0, 0], vRecv: [0, 0.4, 0] },
      { s: [0.5, 0.5, 0.2], rhat: [0.3, -1, 0.7], r: 5, vSrc: [1, 0, 0], vRecv: [0, 0, 0] }, { s: [0, 0, 0], rhat: [0, 1, 0], r: 1.5, vSrc: [0.7, 0, 0.2], vRecv: [0.1, 0, 0] }];
    S.cform = Math.max(...cfg.flatMap((c) => READINGS.map((rd) => { const a = diffClosed({ ...c, f: 0.37, reading: rd }).tot, b = diffFromC({ ...c, f: 0.37, reading: rd }); return nrm(sub(a, b)) / Math.max(nrm(a), 1e-300); })));
    S.self = Math.max(...cfg.map((c) => checkSelf(c).rel)); S.static = Math.max(...cfg.map((c) => checkStatic(c).rel)); }
  // ③ 第333便b の通過の場面: ½∇×U の z = −0.24・差分の読み(静止)の z は 2 倍(線に沿う微分だけ)で同じ符号
  S.passing = passingScene();
  // ④ 赤道面: 振幅 signed の reflect と背景が静止の diff は同じ符号(f < 0.5)・並進 0 で回転の分だけ・ノブ 0(振幅 0・f 0)で 0
  { const s = [0, 0, 1], rh = [1, 0, 0], a = bevelOmega({ s, rhat: rh, r: 1, f: 0.3, reading: 'static', dir: 'reflect' }).tot[2], b = bevelOmega({ s, rhat: rh, r: 1, f: 0.3, reading: 'static', dir: 'diff' }).tot[2];
    const t0 = bevelOmega({ s, rhat: [Math.cos(0.4), 0, Math.sin(0.4)], r: 1, vSrc: [0, 0, 0], f: 0.3, reading: 'static', dir: 'reflect' }), z = bevelOmega({ s, rhat: rh, r: 1, vSrc: [0, 2, 0], f: 0, reading: 'static', dir: 'reflect' });
    S.equator = { reflect: a, diff: b, sameSign: Math.sign(a) === Math.sign(b) && a < 0, trZero: nrm(t0.tr), zeroKnob: nrm(z.tot) }; }
  // ⑤ 近づく/遠ざかる分は 0・互いにロックした連星で今の形の reflect(T = 1)は 0
  { const R = radialRow(), L = lockedRow(); S.radial = Math.max(...R.map((x) => x.mag)); S.locked = { ref1: nrm(L.ref1), diff: L.diff[2] }; }
  // ⑥ 入力の拒否
  { const tries = [() => splitSpin([0, 0], [1, 0, 0]), () => diffClosed({ s: [0, 0, 1], rhat: [1, 0, 0], r: 0, vSrc: [0, 0, 0], f: 0.3, reading: 'static' }), () => diffClosed({ s: [0, 0, 1], rhat: [1, 0, 0], r: 1, vSrc: [0, 0, 0], f: 1.5, reading: 'static' }),
      () => bevelOmega({ s: [0, 0, 1], rhat: [1, 0, 0], r: 1, f: 0.3, dir: 'x' }), () => readingOf({ reading: 'x', alpha: 2, f: 0.3 }), () => ampOf('x', 0.3, 1.4)];
    S.rejects = tries.map((t) => { try { t(); return false; } catch (e) { return e instanceof RangeError; } }); }
  return S;
}
export function pureGates(S) {
  const t = DECL.idTol;
  return {
    three: Math.abs(S.three.eq - 180) <= 1e-9 && Math.abs(S.three.mid - 90) <= 1e-9 && Math.abs(S.three.pole) <= 1e-6 && S.three.norm <= t,
    cform: S.cform <= t && S.self <= DECL.numTol && S.static <= DECL.numTol,
    passing: Math.abs(S.passing.fullZ + 0.24) <= 1e-9 && Math.abs(S.passing.ratio - 2) <= 1e-9 && S.passing.diffZ < 0 && S.passing.OmAppZ < 0,
    equator: S.equator.sameSign && S.equator.trZero === 0 && S.equator.zeroKnob === 0,
    radial: S.radial === 0 && S.locked.ref1 <= 1e-15 && Math.abs(S.locked.diff - 1) <= t,
    rejects: S.rejects.every(Boolean),
  };
}
export { AU, MSUN, KPC, DAY, aKepler };
