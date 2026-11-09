// 第331便b(原仮定者の追記(2026-11-09)「回転引きずりで空間を引きずる事による大きな影響は、遠心力を弱める事で有る」・原仮定者の決断(2026-11-09 —— AN593 = B・AN595 = A)・
//   原仮定者の整理(2026-11-09)「引きずりは、相対的な移動回転に、m/r^2 の重みが付く」「慣性力は、自分自身の引きずり」・統括の検証項目 R311):
//   **引きずられた枠の回転と遠心の要求の関係・枠の 2 つの読みと自己の重みの型・円盤の枠の固定点の純関数**(器 tests/exp-w331b-centrifugal.mjs と QA lint.centrifugal331b・
//   behavior.centrifugal331b が読む —— html を読まない・状態を持たない・第330便b の重みの lib〔tests/lib-w330b-dragweight.mjs〕と第312便a の参照の lib〔tests/lib-w312a-decay.mjs〕は呼ぶだけ・
//   エンジンの式を写さない)。
//
// ■ 何をするか(作業仮説の検査の道具 —— 新しい力・新しい則をエンジンへ足す操作ではない)
//   回る枠の中の円軌道の釣り合い(宣言の式): 引きずられた局所の枠を、並進の流れ u_f = Ω_f(R) R φ̂ と軸の回転 ω_f で表す。枠に対する速度 w = v − u_f が、
//     枠の軸の中で重力だけで変わる(枠が局所の慣性系 —— 作業仮説)と置くと、背景の式は dv/dt = g + (v·∇)u_f + ω_f × w。円軌道 v = ΩR φ̂ では
//     **要求 R(Ω − Ω_f)(Ω − ω_f) = g**(g は内向きの重力の大きさ)。分け方: 剛体の枠の部 R(Ω − Ω_f)²・枠のずれの部 R(Ω − Ω_f)(Ω_f − ω_f)。
//     背景から見た内訳: Ω²R = 要求 + 流れの項 RΩΩ_f(枠の並進が軌道に沿って変わる分 —— (v·∇)u_f)+ 軸の項 Rω_f(Ω − Ω_f)(枠の軸の回転が相対の速度に効く分 —— コリオリの型)。
//     軸の型(AXES_TYPES —— 走行の前の宣言): rigid(ω_f = Ω_f —— 剛体の枠の一次の読み: 要求 (Ω − Ω_f)²R・v = √(gR) + Ω_f R)/
//     halfCurl(ω_f = Ω_f + ½R dΩ_f/dR —— 枠の流れの半渦度で軸が回る: ずれの部 −½R²Ω_f′(Ω − Ω_f))/fixed(ω_f = 0 —— 軸は回らず並進の流れだけ: 要求 RΩ(Ω − Ω_f)・
//     一次で Ω ≈ √(g/R) + Ω_f/2〔Larmor の型〕)。順行の根 Ω = [(Ω_f + ω_f) + √((Ω_f − ω_f)² + 4g/R)]/2。
//   要る枠の回転(逆算): rigid —— Ω_f,req = (v_obs − v_bar)/R(v_bar = √(gR))・fixed —— (v_obs² − v_bar²)/(R v_obs)。halfCurl は微分を含む(shearCheck で
//     rigid の要る形のずれの部の大きさを表に)。遠心の要求を弱める割合 1 − 要求/(Ω²R)(x = Ω_f/Ω —— rigid 2x − x²・fixed x)。
//   一次の目安(firstOrderGuide): 剛体の枠が一様に Ω_f で回れば、枠の中の Kepler の楕円は背景から見て近点が Ω_f で回る(rigid)・fixed は Ω_f/2(Larmor の型)・
//     周期の比のずれ −x(rigid)・−x/2(fixed)。半径に依る Ω_f の分(軌道の上の変化)は入れない(宣言)。
//   枠の 2 つの読み(frameOmega —— 自己の項は分母だけ): field(場の枠 —— 空間そのもの・評価点に自己の重みが無い)Ω_f = Σ w_j Ω_j /(Σ w_j + w_bg)/
//     receiver(受け手の枠 —— 自己の重みを分母に)Ω_f = Σ w_j Ω_j /(w_ii + Σ w_j + w_bg)。w_bg は背景の重み(背景の宇宙は静止 —— 速度 0 の項)。
//     **自己の項を分子にも入れる型は否定対照**(selfInNumeratorOmega —— Ω = (Ω_K + Σβ_jΩ_j)/(1 − α) で α → 1 に発散 —— 慣性の分を枠の回転に二重に数える)。
//     背景の重みの宣言の型(cosmicBackgroundWeight): 静止した一様な宇宙(臨界密度・ハッブル半径まで)の Σ m/r² = 4πρ_c c/H₀ = 3H₀c/(2G) [kg/m²](次数の読み)。
//   円盤の枠の固定点(diskFrameFixedPoint): 半径 R_k の環(方位 K 点 —— 点の質量 m_k/K)・中心の有限の一様球(質量 M_c・半径 R_c・自転 Ω_c)・背景の重み・境界(静止の外の環)。
//     受け手(各環の φ = 0 の点)の枠の角速度 Ω_f,k = Σ_l B_kl Ω_l + c_k。源の回転の型(SOURCE_SPINS): sync(源は並進 v_j = Ω_l ẑ × x_j と回転 Ω_l を持つ ——
//     m/r² の座標則で並進と回転を 1 つにすると受け手の位置で Ω_l ẑ × x_k: B_kl = Σ_q w/W)/none(並進だけ: B_kl = Σ_q w (R_l/R_k) cos φ_q/W)。
//     中心の型(CENTER_ROTS): frame(座標変換 —— w_c Ω_c)/moment(第330便b の源の中の速度の重みつきの平均 Ω_c M_c M_p(R_k; R_c)/R_k)。
//     rigid の軸では (I − B)Ω = Ω_K + c を直接法と反復(Jacobi)で解く・fixed と halfCurl の軸は不動点の反復(halfCurl の dΩ_f/dR は環の格子の不等間隔の差分)。**錨(自己・中心・境界・背景の分母の分)が全部 0 なら一様の回転を足しても
//     式が変わらず(行和 1)、解が無いか一意でない —— 退化として記録**(解を作らない)。
//
// ■ 言わないこと: 枠の回転・円盤の速度・太陽系と環の大きさは、宣言した型の表の値と残差として書く(遠心の要求が下がる関係は宣言の式 —— 平坦な回転の機構の同定・
//   暗黒物質の置き換え・寄与の度合いの主張に使わない)・`κ_epi` と κ_D を同じ量と書かない・枠の角速度と密度波のパターン速度 Ω_p を混ぜない(AN595 —— Ω_p は格子)。
import * as W from './lib-w330b-dragweight.mjs';
import * as D from './lib-w312a-decay.mjs';

export const LIB_VERSION = 'w331b-centrifugal-lib-1';
export const AXES_TYPES = Object.freeze(['rigid', 'halfCurl', 'fixed']);
export const FRAME_READINGS = Object.freeze(['field', 'receiver']);
export const SOURCE_SPINS = Object.freeze(['sync', 'none']);
export const CENTER_ROTS = Object.freeze(['frame', 'moment']);
/** 宣言(走行の前に置く —— 結果を見て変えない) */
export const DECL = Object.freeze({
  /** 反復の止め(最大の変化 ≤ iterTol × max|Ω|)と上限 */
  iterTol: 1e-13, iterMax: 20000,
  /** 退化の判定(錨の分の最大 ≤ degenerateAnchor、か直接法の軸の値の相対 ≤ singularPivot) */
  degenerateAnchor: 0, singularPivot: 1e-13,
  /** 退化の列で反復を回す回数(増え方の記録 —— 解を作らない) */
  degenerateIters: 200,
  /** 点の重みの距離の次数(第133報の m/r²) */
  p: 2,
});

const isFin = (x) => typeof x === 'number' && Number.isFinite(x);
const vmax = (a) => a.reduce((m, x) => Math.max(m, Math.abs(x)), 0);
const relD = (a, b) => (a === b ? 0 : Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b), 1e-300));
const chkAxes = (axes) => { if (!AXES_TYPES.includes(axes)) throw new RangeError('軸の型は ' + AXES_TYPES.join('・')); };

/* ───────── 回る枠の中の円軌道の釣り合い ───────── */
/** 軸の型から ω_f(rigid → Ω_f・fixed → 0・halfCurl → Ω_f + ½R dΩ_f/dR —— dOmegaFdR が要る) */
export function axesOmega(axes, { R, OmegaF, dOmegaFdR = null }) {
  chkAxes(axes);
  if (!isFin(R) || !(R > 0) || !isFin(OmegaF)) throw new RangeError('axesOmega: R > 0・Ω_f は有限');
  if (axes === 'rigid') return OmegaF;
  if (axes === 'fixed') return 0;
  if (!isFin(dOmegaFdR)) throw new RangeError('axesOmega: halfCurl は dΩ_f/dR が要る');
  return OmegaF + 0.5 * R * dOmegaFdR;
}
/**
 * 要求 R(Ω − Ω_f)(Ω − ω_f) とその分け方。戻り値: demand・rigidPart R(Ω − Ω_f)²・shearPart R(Ω − Ω_f)(Ω_f − ω_f)・
 * 背景から見た内訳 total Ω²R = demand + convective RΩΩ_f + coriolis Rω_f(Ω − Ω_f)
 */
export function frameDemand({ R, Omega, OmegaF, omegaF = OmegaF }) {
  if (![R, Omega, OmegaF, omegaF].every(isFin) || !(R > 0)) throw new RangeError('frameDemand: 有限の数・R > 0');
  const rel = Omega - OmegaF;
  return { demand: R * rel * (Omega - omegaF), rigidPart: R * rel * rel, shearPart: R * rel * (OmegaF - omegaF), total: Omega * Omega * R, convective: R * Omega * OmegaF, coriolis: R * omegaF * rel };
}
/** 円軌道の角速度(順行の根): R(Ω − Ω_f)(Ω − ω_f) = g → Ω = [(Ω_f + ω_f) + √((Ω_f − ω_f)² + 4g/R)]/2(g ≥ 0 —— 内向き) */
export function circularOmega({ g, R, OmegaF = 0, omegaF = OmegaF }) {
  if (![g, R, OmegaF, omegaF].every(isFin) || !(R > 0) || g < 0) throw new RangeError('circularOmega: g ≥ 0・R > 0・有限の数');
  const d = OmegaF - omegaF, Om = 0.5 * ((OmegaF + omegaF) + Math.sqrt(d * d + 4 * g / R));
  return { Omega: Om, v: Om * R, OmegaK: Math.sqrt(g / R) };
}
/** 剛体の枠の一次の読み v = √(gR) + Ω_f R */
export function rigidVelocity({ g, R, OmegaF }) {
  if (![g, R, OmegaF].every(isFin) || !(R > 0) || g < 0) throw new RangeError('rigidVelocity: g ≥ 0・R > 0');
  return Math.sqrt(g * R) + OmegaF * R;
}
/** 要る枠の回転(rigid —— (v_obs − v_bar)/R・fixed —— (v_obs² − v_bar²)/(R v_obs))。v_obs > 0・v_bar ≥ 0・R > 0 */
export function requiredFrame({ vObs, vBar, R, axes = 'rigid' }) {
  if (![vObs, vBar, R].every(isFin) || !(vObs > 0) || vBar < 0 || !(R > 0)) throw new RangeError('requiredFrame: v_obs > 0・v_bar ≥ 0・R > 0');
  if (axes === 'rigid') return (vObs - vBar) / R;
  if (axes === 'fixed') return (vObs * vObs - vBar * vBar) / (R * vObs);
  throw new RangeError('requiredFrame: rigid か fixed(halfCurl は微分を含む —— shearCheck)');
}
/** 遠心の要求を弱める割合 1 − 要求/(Ω²R)(x = Ω_f/Ω —— rigid 2x − x²・fixed x) */
export function demandReduction({ x, axes = 'rigid' }) {
  if (!isFin(x)) throw new RangeError('demandReduction: x は有限');
  if (axes === 'rigid') return 2 * x - x * x;
  if (axes === 'fixed') return x;
  throw new RangeError('demandReduction: rigid か fixed');
}
/** 一次の目安: 近点の移動の率(rigid Ω_f・fixed Ω_f/2)と周期の比のずれ(−x・−x/2 —— x = Ω_f/n) */
export function firstOrderGuide({ OmegaF, n, axes = 'rigid' }) {
  if (![OmegaF, n].every(isFin) || !(n > 0)) throw new RangeError('firstOrderGuide: n > 0');
  const k = axes === 'rigid' ? 1 : axes === 'fixed' ? 0.5 : null;
  if (k === null) throw new RangeError('firstOrderGuide: rigid か fixed');
  return { periRate: k * OmegaF, periodShift: -k * OmegaF / n, x: OmegaF / n };
}

/* ───────── 枠の 2 つの読み ───────── */
/** field —— Σ w Ω/(Σw + w_bg)・receiver —— Σ w Ω/(w_ii + Σw + w_bg)。sources = [{ weight ≥ 0, omega }]。戻り値 OmegaF・W・shares(sources・self・bg) */
export function frameOmega({ reading, sources, selfW = null, wBg = 0 }) {
  if (!FRAME_READINGS.includes(reading)) throw new RangeError('frameOmega: 読みは ' + FRAME_READINGS.join('・'));
  if (!Array.isArray(sources) || sources.some((s) => !s || !isFin(s.weight) || s.weight < 0 || !isFin(s.omega))) throw new RangeError('frameOmega: 非負の重みと有限の角速度');
  if (!isFin(wBg) || wBg < 0) throw new RangeError('frameOmega: 背景の重み w_bg ≥ 0');
  if (reading === 'receiver' && !(isFin(selfW) && selfW > 0)) throw new RangeError('frameOmega: receiver は自己の重み > 0 が要る(m/0² にできない —— 有限の宣言)');
  const sw = reading === 'receiver' ? selfW : 0, Ws = sources.reduce((a, s) => a + s.weight, 0), Wt = sw + Ws + wBg;
  if (!(Wt > 0)) throw new RangeError('frameOmega: 重みの和が 0');
  const num = sources.reduce((a, s) => a + s.weight * s.omega, 0);
  return { OmegaF: num / Wt, W: Wt, shares: { sources: Ws / Wt, self: sw / Wt, bg: wBg / Wt } };
}
/** 否定対照: 自己の項を分子にも入れる(受け手自身の Ω を w_ii で足す)と Ω − Ω_f = Ω_K から Ω = (Ω_K + Σβ_jΩ_j)/(1 − α) */
export function selfInNumeratorOmega({ OmegaK, alpha, betaOmega = 0 }) {
  if (![OmegaK, alpha, betaOmega].every(isFin) || !(alpha >= 0 && alpha < 1)) throw new RangeError('selfInNumeratorOmega: 0 ≤ α < 1');
  return (OmegaK + betaOmega) / (1 - alpha);
}
/** 背景の重みの宣言の型: 3H₀c/(2G) [kg/m²](= 4πρ_c c/H₀ —— 静止した一様な宇宙の Σ m/r² をハッブル半径まで) */
export function cosmicBackgroundWeight({ H0, c = 299792458, G = 6.674e-11 }) {
  if (![H0, c, G].every(isFin) || !(H0 > 0 && c > 0 && G > 0)) throw new RangeError('cosmicBackgroundWeight: 正の有限');
  return 1.5 * H0 * c / G;
}
/** 1 つの点の源の枠(源の自転 OmegaSrc —— 受け手の軸へ射影した値): 読み × 自己の重みの型 × 自己の半径。field は自己を使わない */
export function pointSourceFrame({ mSrc, OmegaSrc, r, mRecv = null, Rself = null, selfType = null, reading, wBg = 0, p = DECL.p }) {
  const w = W.pointWeight(mSrc, r, p);
  const sw = reading === 'receiver' ? W.selfWeight({ type: selfType, m: mRecv, R: Rself, p }).w : null;
  const F = frameOmega({ reading, sources: [{ weight: w, omega: OmegaSrc }], selfW: sw, wBg });
  return { OmegaF: F.OmegaF, beta: w / F.W, wSrc: w, wSelf: sw, wBg, shares: F.shares };
}

/* ───────── 要る形のずれの部(halfCurl の大きさ)───────── */
/** 不等間隔の中心差分(端は片側)の df/dR */
export function derivNonUniform(R, f) {
  const n = R.length;
  return R.map((Rk, k) => {
    if (k === 0) return (f[1] - f[0]) / (R[1] - R[0]);
    if (k === n - 1) return (f[n - 1] - f[n - 2]) / (R[n - 1] - R[n - 2]);
    const h1 = Rk - R[k - 1], h2 = R[k + 1] - Rk;
    return (-h2 / (h1 * (h1 + h2))) * f[k - 1] + ((h2 - h1) / (h1 * h2)) * f[k] + (h1 / (h2 * (h1 + h2))) * f[k + 1];
  });
}
/** 不等間隔の中心差分(端は片側)の dΩ_f/dR・halfCurl の ω_f・rigid の要る形での要求の残差 [R(Ω − Ω_f)(Ω − ω_f) − g]/g */
export function shearCheck({ R, OmegaF, Omega, g }) {
  const n = R.length;
  if (!(n >= 3) || [OmegaF, Omega, g].some((a) => !Array.isArray(a) || a.length !== n) || !R.every((x, k) => isFin(x) && x > 0 && (k === 0 || x > R[k - 1]))) throw new RangeError('shearCheck: R の昇順・同じ長さ');
  const dd = derivNonUniform(R, OmegaF);
  return R.map((Rk, k) => {
    const d = dd[k];
    const wf = axesOmega('halfCurl', { R: Rk, OmegaF: OmegaF[k], dOmegaFdR: d }), fd = frameDemand({ R: Rk, Omega: Omega[k], OmegaF: OmegaF[k], omegaF: wf });
    return { R: Rk, dOmegaFdR: d, omegaF: wf, shearOverG: g[k] > 0 ? fd.shearPart / g[k] : null, residualOverG: g[k] > 0 ? (fd.demand - g[k]) / g[k] : null, logSlope: OmegaF[k] !== 0 ? d * Rk / OmegaF[k] : null };
  });
}

/* ───────── 円盤の枠の固定点 ───────── */
function gauss(Min, rhs) {
  const n = Min.length, A = Min.map((r) => r.slice()), b = rhs.slice();
  let minPiv = Infinity; const scale = Math.max(1e-300, ...A.map((r) => vmax(r)));
  for (let k = 0; k < n; k++) {
    let pv = k; for (let i = k + 1; i < n; i++) if (Math.abs(A[i][k]) > Math.abs(A[pv][k])) pv = i;
    minPiv = Math.min(minPiv, Math.abs(A[pv][k]) / scale);
    if (!(Math.abs(A[pv][k]) > 0)) return { x: null, minPivRel: 0 };
    if (pv !== k) { [A[k], A[pv]] = [A[pv], A[k]]; [b[k], b[pv]] = [b[pv], b[k]]; }
    for (let i = k + 1; i < n; i++) { const f = A[i][k] / A[k][k]; if (f === 0) continue; for (let j = k; j < n; j++) A[i][j] -= f * A[k][j]; b[i] -= f * b[k]; }
  }
  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) { let s = b[i]; for (let j = i + 1; j < n; j++) s -= A[i][j] * x[j]; x[i] = s / A[i][i]; }
  return { x, minPivRel: minPiv };
}
const matVec = (B, x) => B.map((r) => r.reduce((s, b, j) => s + b * x[j], 0));
/**
 * decl = { rings:[{ R [m], m [kg] }](R の昇順)・K(方位の点 ≥ 4)・p(2)・reading('field'|'receiver')・self:{ type, Rs:[m] }(receiver だけ —— 環ごとの点の自己の半径)・
 *   center: null | { M [kg], Rc [m], Omega [rad/s], rot:'frame'|'moment' }・wBg [kg/m² —— p = 2 の単位]・sourceSpin('sync'|'none')・OmegaK:[rad/s —— 環ごとの √(g/R)]・
 *   axes('rigid'|'fixed'|'halfCurl' —— halfCurl の dΩ_f/dR は環の格子の差分)・boundary: null | { R [m], m [kg], K }(静止の外の環 —— 速度 0) }
 * 戻り値: rows(環ごとの R・Ω_K・Ω・Ω_f・v・分母の内訳 shares・B の行和・錨の分)・solve(方式・止まったか・回数・反復の率の目安・直接法と反復の差・式の残差)・degenerate と理由
 */
export function diskFrameFixedPoint(decl) {
  const { rings, K, p = DECL.p, reading, self = null, center = null, wBg = 0, sourceSpin = 'sync', OmegaK, axes = 'rigid', boundary = null } = decl;
  if (!FRAME_READINGS.includes(reading)) throw new RangeError('diskFrameFixedPoint: 読みは ' + FRAME_READINGS.join('・'));
  if (!SOURCE_SPINS.includes(sourceSpin)) throw new RangeError('diskFrameFixedPoint: 源の回転の型は ' + SOURCE_SPINS.join('・'));
  chkAxes(axes);
  if (p !== 2) throw new RangeError('diskFrameFixedPoint: p = 2(第133報の m/r²)だけ');
  if (!(Array.isArray(rings) && rings.length >= 2 && rings.every((r, k) => isFin(r.R) && r.R > 0 && isFin(r.m) && r.m > 0 && (k === 0 || r.R > rings[k - 1].R)))) throw new RangeError('diskFrameFixedPoint: 環は R の昇順・正の質量');
  if (!(Number.isInteger(K) && K >= 4)) throw new RangeError('diskFrameFixedPoint: K は 4 以上の整数');
  if (!(Array.isArray(OmegaK) && OmegaK.length === rings.length && OmegaK.every((x) => isFin(x) && x >= 0))) throw new RangeError('diskFrameFixedPoint: Ω_K は環ごとの非負の有限');
  if (!isFin(wBg) || wBg < 0) throw new RangeError('diskFrameFixedPoint: w_bg ≥ 0');
  if (reading === 'receiver' && !(self && W.SELF_TYPES.includes(self.type) && Array.isArray(self.Rs) && self.Rs.length === rings.length && self.Rs.every((x) => isFin(x) && x > 0))) throw new RangeError('diskFrameFixedPoint: receiver は self の宣言が要る');
  if (center !== null && !(isFin(center.M) && center.M > 0 && isFin(center.Rc) && center.Rc > 0 && isFin(center.Omega) && CENTER_ROTS.includes(center.rot))) throw new RangeError('diskFrameFixedPoint: 中心の宣言');
  if (boundary !== null && !(isFin(boundary.R) && boundary.R > rings[rings.length - 1].R && isFin(boundary.m) && boundary.m > 0 && Number.isInteger(boundary.K) && boundary.K >= 4)) throw new RangeError('diskFrameFixedPoint: 境界の宣言');
  const nR = rings.length;
  if (reading === 'receiver') for (let k = 0; k < nR; k++) {
    const Rs = self.Rs[k];
    if (!(2 * rings[k].R * Math.sin(Math.PI / K) > 2 * Rs) || (k < nR - 1 && !(rings[k + 1].R - rings[k].R > Rs + self.Rs[k + 1]))) throw new RangeError('diskFrameFixedPoint: 環 ' + k + ' の自己の球が近い点と重なる');
    if (center !== null && !(rings[k].R - center.Rc > Rs)) throw new RangeError('diskFrameFixedPoint: 環 ' + k + ' の自己の球が中心の球と重なる');
  }
  if (center !== null && !(rings[0].R > center.Rc)) throw new RangeError('diskFrameFixedPoint: 最初の環が中心の球の中');
  const rows = [], B = [], c = [];
  for (let k = 0; k < nR; k++) {
    const Rk = rings[k].R, row = new Array(nR).fill(0);
    let Wd = 0, Wb = 0;
    for (let l = 0; l < nR; l++) {
      const ml = rings[l].m / K, Rl = rings[l].R;
      for (let q = 0; q < K; q++) {
        if (l === k && q === 0) continue;
        const f = 2 * Math.PI * q / K, r = Math.hypot(Rl * Math.cos(f) - Rk, Rl * Math.sin(f)), wq = W.pointWeight(ml, r, p);
        Wd += wq; row[l] += sourceSpin === 'sync' ? wq : wq * (Rl / Rk) * Math.cos(f);
      }
    }
    if (boundary) for (let q = 0; q < boundary.K; q++) { const f = 2 * Math.PI * (q + 0.5) / boundary.K; Wb += W.pointWeight(boundary.m / boundary.K, Math.hypot(boundary.R * Math.cos(f) - Rk, boundary.R * Math.sin(f)), p); }
    const wc = center ? center.M * D.Kball(p, Rk, center.Rc) : 0;
    const cNum = !center ? 0 : center.rot === 'frame' ? wc * center.Omega : center.Omega * center.M * D.Mball(p, Rk, center.Rc) / Rk;
    const sw = reading === 'receiver' ? W.selfWeight({ type: self.type, m: rings[k].m / K, R: self.Rs[k], p }).w : 0;
    const Wt = sw + Wd + Wb + wc + wBg;
    B.push(row.map((x) => x / Wt)); c.push(cNum / Wt);
    rows.push({ R: Rk, OmegaK: OmegaK[k], W: Wt, shares: { self: sw / Wt, center: wc / Wt, disk: Wd / Wt, boundary: Wb / Wt, bg: wBg / Wt }, rowSumB: row.reduce((a, x) => a + x, 0) / Wt,
      anchor: (sw + wc + Wb + wBg) / Wt, centerTerm: cNum / Wt });
  }
  const anchorMax = Math.max(...rows.map((r) => r.anchor)), anchorMin = Math.min(...rows.map((r) => r.anchor));
  const rhs = OmegaK.map((x, k) => x + c[k]);
  const out = { rows, anchorMax, anchorMin, degenerate: false, why: null, solve: null };
  // 錨が全部 0(sync —— 行和 1): 一様の回転を足しても式が同じ —— 解が無いか一意でない
  if (anchorMax <= DECL.degenerateAnchor) {
    let x = rhs.slice(); for (let it = 0; it < DECL.degenerateIters; it++) x = rhs.map((b, k) => b + matVec([B[k]], x)[0]);
    out.degenerate = true; out.why = '錨(自己・中心・境界・背景の分母の分)が全部 0 —— (I − B) の行和が 0 で一様の回転を足しても同じ式(解が無いか一意でない)';
    out.solve = { method: axes === 'rigid' ? 'linear' : 'picard', converged: false, iters: DECL.degenerateIters, growth: vmax(x) / Math.max(1e-300, vmax(OmegaK)) };
    rows.forEach((r) => { r.Omega = null; r.OmegaF = null; r.v = null; });
    return out;
  }
  let Om, solve;
  if (axes === 'rigid') {
    const M = B.map((r, i) => r.map((x, j) => (i === j ? 1 - x : -x))), G = gauss(M, rhs);
    if (G.x === null || G.minPivRel <= DECL.singularPivot) {
      out.degenerate = true; out.why = '直接法の軸の値が 0 に近い(特異 —— 相対 ' + G.minPivRel + ')';
      out.solve = { method: 'linear', converged: false, minPivRel: G.minPivRel }; rows.forEach((r) => { r.Omega = null; r.OmegaF = null; r.v = null; }); return out;
    }
    let x = rhs.slice(), it = 0, prev = null, rho = null, conv = false;
    for (; it < DECL.iterMax; it++) {
      const nx = matVec(B, x).map((s, k) => s + rhs[k]), ch = vmax(nx.map((v, k) => v - x[k]));
      if (prev !== null && prev > 0) rho = ch / prev; prev = ch; x = nx;
      if (ch <= DECL.iterTol * Math.max(1e-300, vmax(x))) { conv = true; it++; break; }
    }
    const res = vmax(matVec(M, G.x).map((s, k) => s - rhs[k])) / Math.max(1e-300, vmax(rhs));
    Om = G.x; solve = { method: 'linear', converged: conv, iters: it, rhoEst: rho, directVsIterRel: vmax(G.x.map((v, k) => v - x[k])) / Math.max(1e-300, vmax(G.x)), residualRel: res, minPivRel: G.minPivRel };
  } else {
    // fixed: ω_f = 0 / halfCurl: ω_f = Ω_f + ½R dΩ_f/dR(環の格子の不等間隔の差分 —— 端は片側)。順行の根 Ω = [(Ω_f + ω_f) + √((Ω_f − ω_f)² + 4Ω_K²)]/2 の不動点の反復
    const Rr = rings.map((r) => r.R), wfOf = (of) => (axes === 'fixed' ? of.map(() => 0) : derivNonUniform(Rr, of).map((d, k) => of[k] + 0.5 * Rr[k] * d));
    const F = (of, wf, k) => 0.5 * ((of + wf) + Math.sqrt((of - wf) * (of - wf) + 4 * OmegaK[k] * OmegaK[k]));
    let x = OmegaK.slice(), it = 0, prev = null, rho = null, conv = false;
    for (; it < DECL.iterMax; it++) {
      const of = matVec(B, x).map((s, k) => s + c[k]), wf = wfOf(of), nx = of.map((o, k) => F(o, wf[k], k)), ch = vmax(nx.map((v, k) => v - x[k]));
      if (!nx.every(isFin)) break;
      if (prev !== null && prev > 0) rho = ch / prev; prev = ch; x = nx;
      if (ch <= DECL.iterTol * Math.max(1e-300, vmax(x))) { conv = true; it++; break; }
    }
    const of = matVec(B, x).map((s, k) => s + c[k]), wf = wfOf(of);
    const res = vmax(x.map((o, k) => (o - of[k]) * (o - wf[k]) - OmegaK[k] * OmegaK[k])) / Math.max(1e-300, vmax(OmegaK.map((q) => q * q)));
    Om = x; solve = { method: 'picard', converged: conv, iters: it, rhoEst: rho, directVsIterRel: null, residualRel: res, minPivRel: null };
    if (axes === 'halfCurl') rows.forEach((r, k) => { r.omegaF = wf[k]; r.shearOverOmK2 = OmegaK[k] > 0 ? (x[k] - of[k]) * (of[k] - wf[k]) / (OmegaK[k] * OmegaK[k]) : null; });
    if (!conv) { out.degenerate = false; out.why = '不動点の反復が止まらない(上限 ' + DECL.iterMax + ' 回)'; }
  }
  const OmF = matVec(B, Om).map((s, k) => s + c[k]);
  rows.forEach((r, k) => { r.Omega = Om[k]; r.OmegaF = OmF[k]; r.v = Om[k] * r.R; });
  out.solve = solve;
  return out;
}
/** 残差: (v − v_obs)/v_obs の二乗平均の平方根・最大の絶対値・平均(R ≥ Rmin の行) */
export function residualStats({ R, v, vObs, Rmin = 0 }) {
  if (![R, v, vObs].every(Array.isArray) || R.length !== v.length || R.length !== vObs.length) throw new RangeError('residualStats: 同じ長さ');
  const idx = R.map((_, k) => k).filter((k) => R[k] >= Rmin && isFin(v[k]) && isFin(vObs[k]) && vObs[k] > 0);
  if (!idx.length) return { n: 0, rms: null, maxAbs: null, mean: null };
  const e = idx.map((k) => (v[k] - vObs[k]) / vObs[k]);
  return { n: idx.length, rms: Math.sqrt(e.reduce((s, x) => s + x * x, 0) / e.length), maxAbs: vmax(e), mean: e.reduce((s, x) => s + x, 0) / e.length };
}
/** 中央値(null を除く) */
export function median(a) { const b = a.filter(isFin).slice().sort((x, y) => x - y); if (!b.length) return null; const m = b.length >> 1; return b.length % 2 ? b[m] : 0.5 * (b[m - 1] + b[m]); }

/* ───────── 純関数の場面と門 ───────── */
export function pureScenes() {
  const S = {};
  const g = 2.5e-10, R = 3.1e20, OmK = Math.sqrt(g / R);
  // ① Ω_f = 0 でニュートンの円軌道(3 つの軸の型とも)
  S.newton = { Om: AXES_TYPES.map((a) => circularOmega({ g, R, OmegaF: 0, omegaF: axesOmega(a, { R, OmegaF: 0, dOmegaFdR: 0 }) }).Omega), OmK, v: circularOmega({ g, R }).v, vK: Math.sqrt(g * R) };
  // ② Ω_f = Ω で遠心の要求 0(g = 0 なら Ω = Ω_f —— 剛体の枠と共に回る)・x = 1 の弱める割合 1
  { const of = 4e-16; S.coRotate = { Om: circularOmega({ g: 0, R, OmegaF: of }).Omega, of, demand: frameDemand({ R, Omega: of, OmegaF: of }).demand, red: demandReduction({ x: 1 }) }; }
  // ③ 剛体の枠の一次の読み v = √(gR) + Ω_f R(厳密)・fixed は一次で Ω_K + Ω_f/2(Larmor の型 —— 差は Ω_f² の次数)
  { const of = 1e-3 * OmK, rg = circularOmega({ g, R, OmegaF: of }), fx = circularOmega({ g, R, OmegaF: of, omegaF: 0 });
    S.firstOrder = { rigidV: rg.v, rigidRef: rigidVelocity({ g, R, OmegaF: of }), fixedDev: (fx.Omega - OmK - of / 2) / of, of, OmK }; }
  // ④ 符号: 逆向きの枠(Ω_f < 0)は Ω < Ω_K・弱める割合は負(要求が増える)・rigid は Ω_f について奇(Ω(−Ω_f) − Ω_K = −(Ω(Ω_f) − Ω_K))・Ω − Ω_f = Ω_K > 0 のまま
  { const of = 0.3 * OmK, a = circularOmega({ g, R, OmegaF: of }).Omega, b = circularOmega({ g, R, OmegaF: -of }).Omega;
    S.sign = { counter: b, OmK, odd: (a - OmK) + (b - OmK), relCounter: b + of, redCounter: demandReduction({ x: -of / b }), deep: circularOmega({ g, R, OmegaF: -3 * OmK }).Omega }; }
  // ⑤ 恒等式: 解で R(Ω − Ω_f)(Ω − ω_f) = g(3 つの軸)・Ω²R = 要求 + 流れの項 + 軸の項・剛体の部 + ずれの部 = 要求
  { const of = 0.4 * OmK, d = -1.7 * of / R, out = AXES_TYPES.map((a) => { const wf = axesOmega(a, { R, OmegaF: of, dOmegaFdR: d }), Om = circularOmega({ g, R, OmegaF: of, omegaF: wf }).Omega, fd = frameDemand({ R, Omega: Om, OmegaF: of, omegaF: wf });
      return { axes: a, eq: relD(fd.demand, g), split: relD(fd.rigidPart + fd.shearPart, fd.demand), total: relD(fd.demand + fd.convective + fd.coriolis, fd.total) }; });
    S.identity = out; }
  // ⑥ 単位: (λg, λR) で Ω は同じ・要る枠を m/s と m で作っても km s⁻¹ と kpc で作って rad/s に直しても同じ
  { const lam = 3.0856775814913673e16, a = circularOmega({ g, R, OmegaF: 0.2 * OmK }).Omega, b = circularOmega({ g: g * lam, R: R * lam, OmegaF: 0.2 * OmK }).Omega;
    const KPC = 3.0856775814913673e19, q1 = requiredFrame({ vObs: 1.5e5, vBar: 1.1e5, R: 20 * KPC }), q2 = requiredFrame({ vObs: 150, vBar: 110, R: 20 }) * 1e3 / KPC;
    S.units = { scale: relD(a, b), kpc: relD(q1, q2) }; }
  // ⑦ 逆算: 要る枠 → 前向きの式で v_obs に戻る(rigid・fixed)
  { const vO = 1.5e5, vB = 1.1e5, gg = vB * vB / R, back = ['rigid', 'fixed'].map((a) => { const of = requiredFrame({ vObs: vO, vBar: vB, R, axes: a }); return relD(circularOmega({ g: gg, R, OmegaF: of, omegaF: a === 'rigid' ? of : 0 }).v, vO); });
    S.inverse = { back, rigid: requiredFrame({ vObs: vO, vBar: vB, R }), fixed: requiredFrame({ vObs: vO, vBar: vB, R, axes: 'fixed' }) }; }
  // ⑧ halfCurl: Ω_f ∝ R^s なら ω_f = Ω_f(1 + s/2)・一様の Ω_f はずれの部 0・shearCheck の数値の微分がべきの表で解析の値に近い(相対の刻み 4% の中心差分 —— 打ち切りの誤差の内 1e-2)
  { const s = -1.3, Rs = Array.from({ length: 40 }, (_, k) => (1 + 0.25 * k) * 3e19), OF = Rs.map((x) => 1e-15 * Math.pow(x / 3e19, s)), Om = Rs.map((x, k) => OF[k] + 2e-15), gg = Rs.map((x, k) => x * (Om[k] - OF[k]) ** 2);
    const sc = shearCheck({ R: Rs, OmegaF: OF, Omega: Om, g: gg }), mid = sc[20], exact = OF[20] * (1 + s / 2), u = shearCheck({ R: Rs, OmegaF: Rs.map(() => 1e-15), Omega: Om, g: gg });
    S.halfCurl = { powerRel: relD(axesOmega('halfCurl', { R: 2e20, OmegaF: 1e-15, dOmegaFdR: s * 1e-15 / 2e20 }), 1e-15 * (1 + s / 2)), midRel: relD(mid.omegaF, exact), midSlope: mid.logSlope, uniformShear: vmax(u.map((q) => q.shearOverG)) }; }
  // ⑨ 枠の 2 つの読み: field の源 1 つ・背景 0 は Ω_f = Ω_src(全部共に回る)・receiver は β Ω_src・背景で薄まる・Ω_src に線形・逆向きの同じ重みは打ち消す
  { const src = [{ weight: 3, omega: 2e-6 }], f0 = frameOmega({ reading: 'field', sources: src }), r0 = frameOmega({ reading: 'receiver', sources: src, selfW: 1 }), fb = frameOmega({ reading: 'field', sources: src, wBg: 1 });
    const lin = frameOmega({ reading: 'receiver', sources: [{ weight: 3, omega: 4e-6 }], selfW: 1 }), opp = frameOmega({ reading: 'field', sources: [{ weight: 2, omega: 5e-6 }, { weight: 2, omega: -5e-6 }], wBg: 0.5 });
    S.readings = { field: f0.OmegaF, receiver: r0.OmegaF, fieldBg: fb.OmegaF, lin: lin.OmegaF / r0.OmegaF, opp: opp.OmegaF, shares: r0.shares }; }
  // ⑩ 否定対照: 自己の項を分子にも入れると Ω = Ω_K/(1 − α)(α = 0.99 で 100 倍・α = 1 − 1e-6 で 1e6 倍)
  S.selfNum = { r99: selfInNumeratorOmega({ OmegaK: OmK, alpha: 0.99 }) / OmK, r6: selfInNumeratorOmega({ OmegaK: OmK, alpha: 1 - 1e-6 }) / OmK };
  // ⑪ 入力の拒否
  { const rej = [() => circularOmega({ g: -1, R }), () => circularOmega({ g, R: 0 }), () => circularOmega({ g: NaN, R }), () => axesOmega('spin', { R, OmegaF: 0 }), () => axesOmega('halfCurl', { R, OmegaF: 0 }),
      () => frameOmega({ reading: 'self', sources: [] }), () => frameOmega({ reading: 'receiver', sources: [{ weight: 1, omega: 1 }] }), () => frameOmega({ reading: 'field', sources: [{ weight: -1, omega: 1 }] }),
      () => frameOmega({ reading: 'field', sources: [{ weight: 1, omega: 1 }], wBg: -1 }), () => requiredFrame({ vObs: 0, vBar: 1, R: 1 }), () => requiredFrame({ vObs: 1, vBar: 1, R: 1, axes: 'halfCurl' }),
      () => selfInNumeratorOmega({ OmegaK: 1, alpha: 1 }), () => diskFrameFixedPoint({ rings: [{ R: 1, m: 1 }, { R: 2, m: 1 }], K: 8, reading: 'field', OmegaK: [1, 1], p: 1 }),
      () => diskFrameFixedPoint({ rings: [{ R: 1, m: 1 }, { R: 2, m: 1 }], K: 8, reading: 'receiver', OmegaK: [1, 1] })];
    S.reject = rej.map((f) => { try { f(); return false; } catch (e) { return e instanceof RangeError; } }); }
  // ⑫ 小さな円盤(6 環・K = 12・中心だけが錨): sync・field・背景 0・Ω_K = 0 なら全部が Ω_c で剛体に共に回る(行和の恒等式)・直接法と反復が同じ・
  //    錨 0(中心なし・背景 0・field)は退化・背景を大きくすると Ω → Ω_K・receiver は自己の分だけ Ω_c より遅い
  { const rings = [1, 2, 3, 4, 5, 6].map((x) => ({ R: x, m: 1 })), Oc = 0.7, ctr = { M: 3, Rc: 0.5, Omega: Oc, rot: 'frame' }, OK = rings.map((r) => 0.3 / Math.sqrt(r.R));
    const a = diskFrameFixedPoint({ rings, K: 12, reading: 'field', center: ctr, OmegaK: rings.map(() => 0) });
    const b = diskFrameFixedPoint({ rings, K: 12, reading: 'field', center: ctr, OmegaK: OK });
    const dg = diskFrameFixedPoint({ rings, K: 12, reading: 'field', center: null, OmegaK: OK });
    const big = diskFrameFixedPoint({ rings, K: 12, reading: 'field', center: ctr, OmegaK: OK, wBg: 1e12 });
    const rc = diskFrameFixedPoint({ rings, K: 12, reading: 'receiver', self: { type: 'ballMean', Rs: rings.map(() => 0.1) }, center: ctr, OmegaK: rings.map(() => 0) });
    const fx = diskFrameFixedPoint({ rings, K: 12, reading: 'field', center: ctr, OmegaK: OK, axes: 'fixed', wBg: 0.5 });
    const nn = diskFrameFixedPoint({ rings, K: 12, reading: 'field', center: ctr, OmegaK: OK, sourceSpin: 'none', wBg: 0.5 });
    S.miniDisk = { rigidCo: vmax(a.rows.map((r) => r.Omega - Oc)) / Oc, dvi: b.solve.directVsIterRel, res: b.solve.residualRel, conv: b.solve.converged, above: b.rows.every((r) => r.Omega > r.OmegaK + Oc * 0.999),
      degenerate: dg.degenerate, degWhy: dg.why, growth: dg.solve.growth, bigBg: vmax(big.rows.map((r) => (r.Omega - r.OmegaK) / r.OmegaK)), receiverSlow: rc.rows.every((r) => r.Omega < Oc && r.Omega > 0),
      fixedConv: fx.solve.converged, fixedRes: fx.solve.residualRel, fixedBelow: fx.rows.every((r, k) => r.Omega > r.OmegaK && r.Omega < b.rows[k].Omega), noneSolved: nn.solve.converged && nn.solve.residualRel < 1e-12 }; }
  // ⑬ 背景の重みの宣言の型: 3H₀c/(2G) = 4πρ_c c/H₀(ρ_c = 3H₀²/(8πG))
  { const H0 = 67.4e3 / 3.0856775814913673e22, wc = cosmicBackgroundWeight({ H0 }), rho = 3 * H0 * H0 / (8 * Math.PI * 6.674e-11); S.cosmic = { w: wc, alt: relD(wc, 4 * Math.PI * rho * 299792458 / H0) }; }
  // ⑭ 弱める割合と一次の目安: rigid 2x − x²・fixed x・近点の率 rigid Ω_f・fixed Ω_f/2・周期の比のずれ −x・−x/2
  { const x = 0.1, gr = firstOrderGuide({ OmegaF: 2e-14, n: 8e-7 }), gf = firstOrderGuide({ OmegaF: 2e-14, n: 8e-7, axes: 'fixed' });
    S.reduce = { rigid: demandReduction({ x }), fixed: demandReduction({ x, axes: 'fixed' }), gr, gf }; }
  return S;
}
export function pureGates(S) {
  const close = (a, b, t = 1e-12) => Math.abs(a - b) <= t * Math.max(Math.abs(a), Math.abs(b), 1e-300);
  return {
    newtonAtZeroFrame: S.newton.Om.every((x) => close(x, S.newton.OmK)) && close(S.newton.v, S.newton.vK),
    coRotateZeroDemand: close(S.coRotate.Om, S.coRotate.of) && S.coRotate.demand === 0 && S.coRotate.red === 1,
    rigidFirstOrder: close(S.firstOrder.rigidV, S.firstOrder.rigidRef) && Math.abs(S.firstOrder.fixedDev) < 1e-3,
    signCounterFrame: S.sign.counter < S.sign.OmK && Math.abs(S.sign.odd) <= 1e-12 * S.sign.OmK && close(S.sign.relCounter, S.sign.OmK) && S.sign.redCounter < 0 && S.sign.deep < 0,
    balanceIdentity: S.identity.length === 3 && S.identity.every((q) => q.eq <= 1e-12 && q.split <= 1e-12 && q.total <= 1e-12),
    unitsInvariant: S.units.scale <= 1e-12 && S.units.kpc <= 1e-12,
    inverseRoundTrip: S.inverse.back.every((x) => x <= 1e-12) && S.inverse.fixed > S.inverse.rigid,
    halfCurlShear: S.halfCurl.powerRel <= 1e-12 && S.halfCurl.midRel < 1e-2 && Math.abs(S.halfCurl.midSlope + 1.3) < 1e-2 && S.halfCurl.uniformShear === 0,
    frameReadings: close(S.readings.field, 2e-6) && close(S.readings.receiver, 1.5e-6) && close(S.readings.fieldBg, 1.5e-6) && close(S.readings.lin, 2) && Math.abs(S.readings.opp) <= 1e-30 && close(S.readings.shares.self, 0.25),
    selfInNumeratorDiverges: close(S.selfNum.r99, 100) && Math.abs(S.selfNum.r6 / 1e6 - 1) < 1e-9,
    rejectInputs: S.reject.every((x) => x === true),
    miniDiskFixedPoint: S.miniDisk.rigidCo <= 1e-10 && S.miniDisk.dvi <= 1e-10 && S.miniDisk.res <= 1e-12 && S.miniDisk.conv === true && S.miniDisk.above && S.miniDisk.degenerate === true && S.miniDisk.growth > 10
      && S.miniDisk.bigBg < 1e-6 && S.miniDisk.receiverSlow && S.miniDisk.fixedConv === true && S.miniDisk.fixedRes <= 1e-10 && S.miniDisk.fixedBelow && S.miniDisk.noneSolved,
    cosmicBackground: S.cosmic.alt <= 1e-12 && S.cosmic.w > 10 && S.cosmic.w < 20,
    reductionAndGuide: close(S.reduce.rigid, 0.19) && close(S.reduce.fixed, 0.1) && close(S.reduce.gr.periRate, 2e-14) && close(S.reduce.gf.periRate, 1e-14) && close(S.reduce.gr.periodShift, -2.5e-8) && close(S.reduce.gf.periodShift, -1.25e-8),
  };
}
