// 第333便b(原仮定者の整理(2026-11-10)「軸引きずりは、回転を統合した並進引きずりに対する、手前と奥の差分とする。源の回転でも発生するが、源が横を通り抜けても発生する」・
//   「回転を統合した並進引きずりは、背景宇宙に対する回転により、順方向の公転に対しては遠心力を下げる。逆方向の公転に対しては遠心力を上げる」・「引きずりの重みは、m/r^2 が有力だが、
//   他の次数でも検証を行う」・原仮定者の回答(2026-11-10 —— AN604・AN606・AN607・AN621)・統括の検証項目 R318):
//   **回転を統合した並進引きずりの場 U(p) と、受け手の手前と奥の差分(軸引きずりの新しい定義)・遠心の要求の順行と逆行・重みの次数と単位の純関数**
//   (器 tests/exp-w333b-axialfield.mjs と QA lint.axialField333b・behavior.axialField333b が読む —— html を読まない・状態を持たない・第330便b の lib〔tests/lib-w330b-dragweight.mjs〕・
//   第331便b の lib〔tests/lib-w331b-centrifugal.mjs〕・第332便b の lib〔tests/lib-w332b-transgeo2.mjs〕は呼ぶだけ・エンジンの式を写さない)。**全部「診断」**(エンジン・在位の本・受理器へ足す操作ではない)。
//
// ■ 記号(本便から): 位置 p・距離 r = ‖p − p_j‖・質量 m・観測自転 s(ベクトル s = s â)・公転の角速度 Ω・慣性決定力(引きずりの重み)W・背景慣性決定力 W₀・引きずり係数 Y_k(R_d = Y_k m)。
//   重力と時計の背景決定力 D₀ はこの lib の分母に入れない(転用しない —— 統括の検証項目 R318)。
//
// ■ 何をするか
//   重みの次数(weightOf): W^(α)(m, r) = (m/r_ref²)(r_ref/r)^α —— α = 1, 1.5, 2, 3 を同じ単位 M/L² で比べる(r_ref は単位を揃える宣言の長さ —— フィットの長さにしない)。
//     W₀ = 0 の正規化平均では r_ref^(α−2) の共通の係数が分子と分母で消える(r_ref に依らない)・W₀ ≠ 0 では消えない(α = 2 だけ r_ref が式から消える)。
//   統合した並進の場(integratedField): 源 j の座標の速度 c_j(p) = v_j + s_j × (p − p_j)(回転を統合した並進引きずり —— 半径を見ない)・
//     U(p) = [Σ_j W_j c_j + K z(p)] / (K + Σ_j W_j)・K = W_self + W₀(位置に依らない —— 受け手の自己の重みは受け手の中で一定と宣言)・z(p) = 速度 0 の項の速度(静止 —— 0。共通の回転座標の引き算の場面だけ −Ω_c × p)。
//     解析の勾配 J_ab = ∂U_a/∂p_b = [∂_b P_a − U_a ∂_b W_t]/W_t(∂_b W_j = −α W_j n̂_jb / r_j)。
//     源ごとの分け方(場は源の運動 v_j・s_j について線形 —— 和は J に一致): 源の自転の直接の項 (W_j/W_t)[s_j]×(源の座標の剛体回転)・
//     源の自転のモーメントの勾配の項 ∂(W_j/W_t) ⊗ (s_j × (p − p_j))・**源の並進(通過)の項** ∂(W_j/W_t) ⊗ v_j(源の自転 0 でも残る —— 源が横を通り抜ける分)。
//     ∂(W_j/W_t) = [∂W_j − (W_j/W_t)∂W_t]/W_t は正規化の分母(自己・他の源・W₀)の勾配を含む。速度は背景の静止系で測る(K ≠ 0 では一様な並進を足すと値が変わる —— 背景が静止の宣言)。
//   局所の回転(localSpin): ω_field = ½∇×U(J の反対称の部 —— 球対称の受け手の剛体回転の成分)・ひずみ = (J + Jᵀ)/2(**全部を軸回転に足さない**)。
//     差分の局所の回転(fdSpin —— 中心差分の刻み h)・h/2 の収束(誤差 ∝ h²)。
//   有限の受け手(finiteReceiver): pair(手前と奥 —— p ± R ê_b の差分で J を作る)/ballL(一様な球の剛体の成分 ω_L = I⁻¹ ∫ρ r′ × U dV —— 体積の求積)/
//     ballCurl(球の体積平均の ½∇×U = (3/(8πR)) ∮ n̂ × U dΩ —— 表面の求積)。線形の場ではどれも ω_field(局所近似)と同じ —— 二次の差は (R/r)² の桁。
//   遠心の要求(centrifugalPair —— 第331便b の frameDemand・circularOmega を呼ぶ): 剛体の枠 a_req = R(Ω − Ω_f)²・半渦度の軸 R(Ω − Ω_f)(Ω − ω_f)(ω_f = 場の ω_field の軌道の法線の成分)。
//     x = Ω_f/Ω —— 逆行(x < 0)は増す・順行は 0 < x < 2 のとき減り、x > 2 でまた増す(順行なら常に減るのではない)。同じ半径・同じ g の順行と逆行の対の要る公転の速さの差(剛体 2Ω_f R)。
//
// ■ 言わないこと: ω_field は局所の場の回転率で、直ちにトルクや発熱ではない(受け手の慣性の自転との差・応答の時間・軸の帳簿を介す —— 未接続)・新しい軸の差分を今の軸の口に重ねて
//   足した値を「合計」と呼ばない(並べる)・自転や共鳴や公転面の機構の同定に使わない・遠心の判定は宣言した枠の型と自己の重みの型の表の値。
import * as W from './lib-w330b-dragweight.mjs';
import * as CF from './lib-w331b-centrifugal.mjs';
import * as TG from './lib-w332b-transgeo2.mjs';

export const LIB_VERSION = 'w333b-axialfield-lib-1';
/** 重みの次数(第134報 —— m/r² を主の候補・他の次数でも) */
export const ALPHAS = Object.freeze([1, 1.5, 2, 3]);
/** 自己の重みの半径の規則(none = 場の枠〔空間そのもの —— 自己の重みなし〕・kappaM = R_d = Y_k m〔K1 の規則〕・robs = 観測半径〔比べる列〕)—— 形は点(m/R^α —— 全部の α で有限) */
export const SELF_RULES = Object.freeze(['none', 'kappaM', 'robs']);
/** 有限の受け手の型 */
export const RECEIVER_MODES = Object.freeze(['pair', 'ballL', 'ballCurl']);
/** 宣言(走行の前に置く —— 結果を見て変えない) */
export const DECL = Object.freeze({
  alphaMain: 2,
  /** 体積と表面の求積の次数(Gauss–Legendre の点の数 —— 方位は 2 倍の等分) */
  quadOrder: 8,
  /** 恒等式の門の相対の許容・解析と差分の照らしの許容 */
  idTol: 1e-12, fdTol: 1e-7,
  /** 遠心の判定の境界(x = 0 と x = 2 だけを「同じ」—— 小さい x も符号で判定する) */
  xEqTol: 0,
});

const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const v3 = (a) => Array.isArray(a) && a.length === 3 && a.every(fin);
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], scl = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const relD = (a, b) => (a === b ? 0 : Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b), 1e-300));
const zero3 = () => [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
const skew = (s) => [[0, -s[2], s[1]], [s[2], 0, -s[0]], [-s[1], s[0], 0]];
const outer = (a, b) => [0, 1, 2].map((i) => [0, 1, 2].map((j) => a[i] * b[j]));
const madd = (A, B, f = 1) => A.map((r, i) => r.map((x, j) => x + f * B[i][j]));
const mscl = (A, f) => A.map((r) => r.map((x) => x * f));
const mmaxAbs = (A) => Math.max(...A.flat().map(Math.abs));

/* ───────── 重みの次数と単位 ───────── */
/** W^(α)(m, r) = (m/r_ref²)(r_ref/r)^α [M/L²](m ≥ 0・r > 0・r_ref > 0・α > 0) */
export function weightOf(m, r, alpha, rRef) {
  if (![m, r, alpha, rRef].every(fin) || m < 0 || !(r > 0) || !(alpha > 0) || !(rRef > 0)) throw new RangeError('weightOf: m ≥ 0・r > 0・α > 0・r_ref > 0 の有限');
  const w = (m / (rRef * rRef)) * Math.pow(rRef / r, alpha);
  if (!fin(w)) throw new RangeError('weightOf: 値域の外');
  return w;
}
/** 自己の重み(点の形 m/R^α を同じ単位で —— rule: none は 0・kappaM は R_d = Y_k m〔SI の G・c —— 第330便b の kappaMRadius〕・robs は観測半径) */
export function selfWeightOf({ rule, m, Robs = null, alpha, rRef, G = 6.674e-11, c = 299792458 }) {
  if (!SELF_RULES.includes(rule)) throw new RangeError('selfWeightOf: 規則は ' + SELF_RULES.join('・'));
  if (rule === 'none') return { w: 0, R: null, rule };
  if (!fin(m) || !(m > 0)) throw new RangeError('selfWeightOf: m > 0');
  const R = rule === 'kappaM' ? W.kappaMRadius(m, G, c) : Robs;
  if (!fin(R) || !(R > 0)) throw new RangeError('selfWeightOf: 半径 > 0 の有限(m/0^α にしない)');
  return { w: weightOf(m, R, alpha, rRef), R, rule };
}
/** 背景慣性決定力の比べる列 3H₀c/(2G)(第331便b の cosmicBackgroundWeight を呼ぶ —— 次元が合うだけで導いた値ではない) */
export function cosmicW0(H0, c = 299792458, G = 6.674e-11) { return CF.cosmicBackgroundWeight({ H0, c, G }); }

/* ───────── 統合した並進の場 ───────── */
function chkSources(sources) {
  if (!Array.isArray(sources)) throw new RangeError('integratedField: sources は配列');
  for (const s of sources) if (!s || !v3(s.p) || !v3(s.v) || !v3(s.s) || !fin(s.m) || s.m < 0) throw new RangeError('integratedField: 源は有限の p・v・s(3 成分)と非負の m');
}
/**
 * 場の式(1 点)。at:[3]・sources:[{ p, v, s, m }]・alpha・rRef・selfW ≥ 0・W0 ≥ 0・frame:{ spin:[3], all:boolean }(共通の回転座標の引き算 —— 場面だけ)・parts(源ごとの分け方を返す)。
 * 戻り値: U・Wt・Wsrc・J・omega・strain・div・shares{ src, self, bg }・parts?[{ spinDirect, spinGrad, trans }(J の部 —— frame.all の場面は最後に { rest })]
 */
export function integratedField({ at, sources, alpha, rRef, selfW = 0, W0 = 0, frame = null, parts = false }) {
  if (!v3(at)) throw new RangeError('integratedField: at は有限の 3 成分');
  chkSources(sources);
  if (!fin(alpha) || !(alpha > 0) || !fin(rRef) || !(rRef > 0)) throw new RangeError('integratedField: α > 0・r_ref > 0');
  if (!fin(selfW) || selfW < 0 || !fin(W0) || W0 < 0) throw new RangeError('integratedField: 自己の重み・W₀ ≥ 0');
  if (frame !== null && !(frame && v3(frame.spin) && typeof frame.all === 'boolean')) throw new RangeError('integratedField: frame は { spin:[3], all:boolean }');
  const Oc = frame ? frame.spin : [0, 0, 0];
  const src = frame ? sources.map((s) => ({ p: s.p, v: sub(s.v, crs(Oc, s.p)), s: sub(s.s, Oc), m: s.m })) : sources;
  const K = selfW + W0;
  let P = [0, 0, 0], Ws = 0, dWt = [0, 0, 0];
  const per = [];
  for (const s of src) {
    const d = sub(at, s.p), r = nrm(d);
    if (!(r > 0)) throw new RangeError('integratedField: 評価点と源が一致(受け手の自分は源に入れない —— 器が外す)');
    const w = weightOf(s.m, r, alpha, rRef), n = scl(d, 1 / r), gW = scl(n, -alpha * w / r), sd = crs(s.s, d), c = add(s.v, sd);
    P = add(P, scl(c, w)); Ws += w; dWt = add(dWt, gW);
    per.push({ w, gW, sd, c, s: s.s, v: s.v });
  }
  const zv = frame && frame.all ? scl(crs(Oc, at), -1) : [0, 0, 0];
  P = add(P, scl(zv, K));
  const Wt = K + Ws;
  if (!(Wt > 0) || !fin(Wt)) throw new RangeError('integratedField: 分母が 0(源・自己・背景のどれも無い)');
  const U = scl(P, 1 / Wt);
  // 源ごとの分け方(場は源の運動〔v_j・s_j〕について線形 —— 重みを固定して 1 つの運動だけを残した場の J の和が J): ∂(W_j/W_t) = [∂W_j − (W_j/W_t) ∂W_t]/W_t
  let J = zero3();
  const partOut = parts ? [] : null;
  for (const q of per) {
    const gS = scl(sub(q.gW, scl(dWt, q.w / Wt)), 1 / Wt);
    const sD = mscl(skew(q.s), q.w / Wt), sG = outer(q.sd, gS), tR = outer(q.v, gS);
    J = madd(madd(madd(J, sD), sG), tR);
    if (parts) partOut.push({ spinDirect: sD, spinGrad: sG, trans: tR, w: q.w });
  }
  if (frame && frame.all) { const rest = madd(outer(zv, scl(dWt, -K / (Wt * Wt))), mscl(skew(scl(Oc, -1)), K / Wt)); J = madd(J, rest); if (parts) partOut.push({ rest }); }
  const L = localSpin(J);
  const out = { U, Wt, Wsrc: Ws, J, omega: L.omega, strain: L.strain, div: J[0][0] + J[1][1] + J[2][2], shares: { src: Ws / Wt, self: selfW / Wt, bg: W0 / Wt } };
  if (parts) out.parts = partOut;
  return out;
}
/** J(3×3)から ω = ½∇×U(反対称の部)とひずみ (J + Jᵀ)/2 */
export function localSpin(J) {
  if (!Array.isArray(J) || J.length !== 3 || !J.every(v3)) throw new RangeError('localSpin: J は 3×3 の有限');
  const omega = [(J[2][1] - J[1][2]) / 2, (J[0][2] - J[2][0]) / 2, (J[1][0] - J[0][1]) / 2];
  const strain = J.map((r, i) => r.map((x, j) => (x + J[j][i]) / 2));
  return { omega, strain };
}
/** 差分の局所の回転(field: p → U の関数・中心差分の刻み h —— 統括の参考の試作の localSpin を今の型で書き直し) */
export function fdSpin(field, p, h) {
  if (typeof field !== 'function' || !v3(p) || !fin(h) || !(h > 0)) throw new RangeError('fdSpin: 関数・有限の 3 成分・h > 0');
  const J = zero3();
  for (let b = 0; b < 3; b++) {
    const a = p.slice(), m = p.slice(); a[b] += h; m[b] -= h;
    if (a[b] === p[b] || m[b] === p[b]) throw new RangeError('fdSpin: h が表せる間隔より小さい');
    const ua = field(a), um = field(m);
    if (!v3(ua) || !v3(um)) throw new RangeError('fdSpin: 場は有限の 3 成分を返す');
    for (let k = 0; k < 3; k++) J[k][b] = (ua[k] - um[k]) / (2 * h);
  }
  return Object.assign({ J }, localSpin(J));
}

/* ───────── 有限の受け手 ───────── */
function gl01(n) {
  // Gauss–Legendre の [0,1] の点と重み(Newton)
  const x = [], w = [];
  for (let i = 1; i <= n; i++) {
    let z = Math.cos(Math.PI * (i - 0.25) / (n + 0.5)), pp = 0;
    for (let it = 0; it < 100; it++) {
      let p1 = 1, p2 = 0;
      for (let j = 1; j <= n; j++) { const p3 = p2; p2 = p1; p1 = ((2 * j - 1) * z * p2 - (j - 1) * p3) / j; }
      pp = n * (z * p1 - p2) / (z * z - 1);
      const z1 = z; z = z1 - p1 / pp; if (Math.abs(z - z1) < 1e-16) break;
    }
    x.push((1 - z) / 2); w.push(1 / ((1 - z * z) * pp * pp));
  }
  return { x, w };
}
/** 単位の球面の求積(μ は Gauss–Legendre・方位 2n 等分 —— 重みの和 = 1) */
export function sphereRule(n = DECL.quadOrder) {
  const g = gl01(n), out = [];
  for (let b = 0; b < n; b++) {
    const mu = 2 * g.x[b] - 1, st = Math.sqrt(Math.max(0, 1 - mu * mu));
    for (let q = 0; q < 2 * n; q++) { const ph = 2 * Math.PI * (q + 0.5) / (2 * n); out.push({ n: [st * Math.cos(ph), st * Math.sin(ph), mu], w: g.w[b] / (2 * n) }); }
  }
  return out;
}
/**
 * 有限の受け手(中心 p・半径 R)の回転の成分。field: p → U。mode: pair(手前と奥 ±R ê_b の差分)/ballL(一様な球の ω_L = (5/(2R²))⟨r′ × U⟩_球)/
 * ballCurl(体積平均の ½∇×U = (3/(8πR))∮ n̂ × U dΩ —— 単位の球面の平均で (3/(2R))⟨n̂ × U⟩)。戻り値 { omega, mode, R, evals }
 */
export function finiteReceiver(field, p, R, mode, n = DECL.quadOrder) {
  if (typeof field !== 'function' || !v3(p) || !fin(R) || !(R > 0) || !RECEIVER_MODES.includes(mode)) throw new RangeError('finiteReceiver: 関数・中心・R > 0・型は ' + RECEIVER_MODES.join('・'));
  if (mode === 'pair') { const f = fdSpin(field, p, R); return { omega: f.omega, strain: f.strain, mode, R, evals: 6 }; }
  const S = sphereRule(n);
  if (mode === 'ballCurl') {
    let acc = [0, 0, 0];
    for (const q of S) acc = add(acc, scl(crs(q.n, field(add(p, scl(q.n, R)))), q.w));
    return { omega: scl(acc, 3 / (2 * R)), mode, R, evals: S.length };
  }
  const g = gl01(n), U0 = field(p);
  let acc = [0, 0, 0], ev = 1;
  for (let a = 0; a < n; a++) {
    const t = g.x[a], wr = g.w[a] * 3 * t * t;
    for (const q of S) { const rp = scl(q.n, R * t); acc = add(acc, scl(crs(rp, sub(field(add(p, rp)), U0)), wr * q.w)); ev++; }
  }
  return { omega: scl(acc, 5 / (2 * R * R)), mode, R, evals: ev };
}

/* ───────── 遠心の要求の順行と逆行 ───────── */
/** x = Ω_f/Ω の判定(剛体の枠 —— 要求 R(Ω − Ω_f)² と Ω²R の差 R(Ω_f² − 2ΩΩ_f) の符号): 'decrease'(0 < x < 2)・'increase'(x < 0 か x > 2)・'equal'(x = 0 か 2) */
export function demandVerdict(x) {
  if (!fin(x)) throw new RangeError('demandVerdict: x は有限');
  if (Math.abs(x) <= DECL.xEqTol || Math.abs(x - 2) <= DECL.xEqTol) return 'equal';
  return x > 0 && x < 2 ? 'decrease' : 'increase';
}
/**
 * 同じ半径の順行と逆行の対。R > 0・Omega > 0(順行の公転の大きさ —— 向きは軌道の法線)・OmegaF(場の回転の軌道の法線の成分 —— 符号つき)・omegaF(半渦度の軸 —— 省略は剛体)・g ≥ 0(内向き —— 省略は Ω²R)。
 * 戻り値: pro/retro の { x, verdict, demandRigid, changeRigid, demandAxis }・要る公転の角速度(同じ g —— 第331便b の circularOmega: 順行 Ω_f・逆行 −Ω_f の場の順行の根)と速さの差
 */
export function centrifugalPair({ R, Omega, OmegaF, omegaF = null, g = null }) {
  if (![R, Omega, OmegaF].every(fin) || !(R > 0) || !(Omega > 0) || (omegaF !== null && !fin(omegaF)) || (g !== null && (!fin(g) || g < 0))) throw new RangeError('centrifugalPair: R > 0・Ω > 0・有限の Ω_f');
  const side = (sgn) => {
    // 逆行は軌道の向きを反転 —— 軌道の法線を基準にすると場の成分が反転する(鏡映)
    const Of = sgn * OmegaF, wf = omegaF === null ? Of : sgn * omegaF;
    const fr = CF.frameDemand({ R, Omega, OmegaF: Of }), fa = CF.frameDemand({ R, Omega, OmegaF: Of, omegaF: wf });
    // 要求の変化は桁落ちを避けて閉じた式で: 剛体 R(Ω_f² − 2ΩΩ_f)・半渦度の軸 R(Ω_f ω_f − Ω(Ω_f + ω_f))(frameDemand の demand − total と同じ量)
    const x = Of / Omega, cR = R * (Of * Of - 2 * Omega * Of), cA = R * (Of * wf - Omega * (Of + wf));
    return { x, verdict: demandVerdict(x), demandRigid: fr.demand, changeRigid: cR, demandAxis: fa.demand, changeAxis: cA, verdictAxis: cA < 0 ? 'decrease' : cA > 0 ? 'increase' : 'equal' };
  };
  const gg = g === null ? Omega * Omega * R : g;
  const cp = CF.circularOmega({ g: gg, R, OmegaF }), cr = CF.circularOmega({ g: gg, R, OmegaF: -OmegaF });
  const ap = omegaF === null ? cp : CF.circularOmega({ g: gg, R, OmegaF, omegaF }), ar = omegaF === null ? cr : CF.circularOmega({ g: gg, R, OmegaF: -OmegaF, omegaF: -omegaF });
  // 速さの差は閉じた式(根の平方根の部は順行と逆行で同じ —— 剛体 2Ω_f R・半渦度の軸 (Ω_f + ω_f)R)。根の差 dvRoots は第331便b の circularOmega から(照らし)
  const wf = omegaF === null ? OmegaF : omegaF;
  return { pro: side(1), retro: side(-1), OmegaPro: cp.Omega, OmegaRetro: cr.Omega, dvRigid: 2 * OmegaF * R, dvAxis: (OmegaF + wf) * R, dvRoots: { rigid: (cp.Omega - cr.Omega) * R, axis: (ap.Omega - ar.Omega) * R }, OmegaK: cp.OmegaK };
}

/* ───────── 補助(器が使う) ───────── */
/** 軌道の要素から近日点の状態(二体 —— μ = G(M + m)・r と v は主星に対する相対)。戻り値 { r, v, a, e } */
export function periapsisState(r, v, mu) {
  if (!v3(r) || !v3(v) || !fin(mu) || !(mu > 0)) throw new RangeError('periapsisState: 有限の r・v・μ > 0');
  const R = nrm(r), h = crs(r, v), ev = sub(scl(crs(v, h), 1 / mu), scl(r, 1 / R)), e = nrm(ev), a = 1 / (2 / R - dot(v, v) / mu);
  if (!(e > 0 && e < 1) || !(a > 0)) throw new RangeError('periapsisState: 楕円でない');
  const eh = scl(ev, 1 / e), hh = scl(h, 1 / nrm(h)), rp = a * (1 - e), vp = Math.sqrt(mu * (1 + e) / rp);
  return { r: scl(eh, rp), v: scl(crs(hh, eh), vp), a, e };
}
/** ベクトル a を軸 k(単位)の周りに角 θ だけ回す(Rodrigues) */
export function rotateAbout(a, k, th) {
  const c = Math.cos(th), s = Math.sin(th);
  return add(add(scl(a, c), scl(crs(k, a), s)), scl(k, dot(k, a) * (1 - c)));
}
/** 源の自転だけの局所の回転の閉じた式(1 つの源 + 一定の分 K): ω = (W/W_t)[s − (α/2)(K/W_t) s_⊥](s_⊥ は n̂ に垂直な成分 —— 場面の照らし) */
export function singleSpinOmega({ m, s, d, alpha, rRef, K }) {
  const r = nrm(d), n = scl(d, 1 / r), w = weightOf(m, r, alpha, rRef), Wt = w + K, sPerp = sub(s, scl(n, dot(n, s)));
  return scl(sub(s, scl(sPerp, (alpha / 2) * (K / Wt))), w / Wt);
}

/* ───────── 純関数の場面と門 ───────── */
export function pureScenes() {
  const S = {};
  const SR = [{ p: [-2, 3, 0.5], v: [-1, 2, 0.3], s: [0.1, -0.2, 0.7], m: 8 }, { p: [1, -3, -0.4], v: [5, -3, 0], s: [0, 0, -0.2], m: 3 }, { p: [4, 1, 1.2], v: [0.5, 1.5, -0.7], s: [0.3, 0.4, 1.3], m: 5 },
    { p: [-3, -2, -1], v: [2, 0, 0.4], s: [0, 0, 0], m: 1.5 }];
  const at = [0.7, -0.4, 0.2];
  // ① 一様な場で ω = 0(全部の源が同じ並進・自転 0)
  { const src = SR.map((s) => ({ p: s.p, v: [1.3, -0.7, 0.4], s: [0, 0, 0], m: s.m })), rows = ALPHAS.map((a) => { const F = integratedField({ at, sources: src, alpha: a, rRef: 1 }); return Math.max(nrm(F.omega), mmaxAbs(F.J)); });
    S.uniform = { max: Math.max(...rows) }; }
  // ② 剛体回転の場: 1 つの源(自転 Ω)だけで正規化(自己・背景なし)→ U = v + Ω × (p − p_j)・ω = Ω・ひずみ 0(全部の α)
  { const Om = [0.2, -0.5, 0.9], src = [{ p: [1, 2, -1], v: [0.3, 0, 0], s: Om, m: 4 }], rows = ALPHAS.map((a) => { const F = integratedField({ at, sources: src, alpha: a, rRef: 1 }); return Math.max(nrm(sub(F.omega, Om)), mmaxAbs(F.strain)); });
    S.rigid = { max: Math.max(...rows) }; }
  // ③ せん断 U = (γ y, 0, 0): ω_z = −γ/2・ひずみ xy = γ/2(J を手で置く)
  { const g = 0.6, L = localSpin([[0, g, 0], [0, 0, 0], [0, 0, 0]]), f = fdSpin((p) => [g * p[1], 0, 0], at, 1e-3);
    S.shear = { omegaZ: L.omega[2], strainXY: L.strain[0][1], fdOmegaZ: f.omega[2], others: Math.max(Math.abs(L.omega[0]), Math.abs(L.omega[1])) }; }
  // ④ 解析の J と中心差分(α 4 × 自己と背景)
  { const rows = [];
    for (const a of ALPHAS) for (const [sw, w0] of [[0, 0], [0.3, 0], [0.3, 0.8]]) {
      const F = integratedField({ at, sources: SR, alpha: a, rRef: 1.7, selfW: sw, W0: w0 }), f = fdSpin((p) => integratedField({ at: p, sources: SR, alpha: a, rRef: 1.7, selfW: sw, W0: w0 }).U, at, 1e-5);
      rows.push({ alpha: a, selfW: sw, W0: w0, rel: mmaxAbs(madd(F.J, f.J, -1)) / mmaxAbs(F.J) });
    }
    S.gradient = { rows, maxRel: Math.max(...rows.map((r) => r.rel)) }; }
  // ⑤ 自転 0 の源の横の通過(統括の参考の試作の例): 源は原点・速度 (0, 3, 0)・自己の重み 1・m/r²・p = (2,0,0) → U = (0, 3/(1+r²), 0)・ω_z = −0.24。h/2 の収束・通過の向きの反転で符号が反転
  { const src = (vy) => [{ p: [0, 0, 0], v: [0, vy, 0], s: [0, 0, 0], m: 1 }], P = [2, 0, 0];
    const F = integratedField({ at: P, sources: src(3), alpha: 2, rRef: 1, selfW: 1, parts: true }), Fr = integratedField({ at: P, sources: src(-3), alpha: 2, rRef: 1, selfW: 1 });
    const fld = (p) => integratedField({ at: p, sources: src(3), alpha: 2, rRef: 1, selfW: 1 }).U, e1 = Math.abs(fdSpin(fld, P, 0.2).omega[2] + 0.24), e2 = Math.abs(fdSpin(fld, P, 0.1).omega[2] + 0.24);
    S.passing = { omegaZ: F.omega[2], Uy: F.U[1], reversed: Fr.omega[2], h2ratio: e1 / e2, passPart: localSpin(F.parts[0].trans).omega[2], spinParts: nrm(localSpin(madd(F.parts[0].spinDirect, F.parts[0].spinGrad)).omega) }; }
  // ⑥ 源だけの正規化(自己・背景なし・1 つの源・自転 0)で差分が消える —— 分母の勾配(自己・他の源・W₀)が要る
  { const src = [{ p: [0, 0, 0], v: [0, 3, 0], s: [0, 0, 0], m: 1 }], F = integratedField({ at: [2, 0, 0], sources: src, alpha: 2, rRef: 1 }), Fb = integratedField({ at: [2, 0, 0], sources: src, alpha: 2, rRef: 1, W0: 1 });
    const two = integratedField({ at: [2, 0, 0], sources: [src[0], { p: [5, 1, 0], v: [0, 0, 0], s: [0, 0, 0], m: 2 }], alpha: 2, rRef: 1 });
    S.sourceOnly = { omega: nrm(F.omega), withW0: Fb.omega[2], twoSources: nrm(two.omega) }; }
  // ⑦ 共通の回転座標の引き算: 全部の項(速度 0 の自己と背景も)を回すと ω は Ω_c だけ動く・源だけを回すと源の分の割合と勾配の分しか動かない
  { const Oc = [0.05, -0.1, 0.3], A = integratedField({ at, sources: SR, alpha: 2, rRef: 1, selfW: 0.4, W0: 0.2 }), B = integratedField({ at, sources: SR, alpha: 2, rRef: 1, selfW: 0.4, W0: 0.2, frame: { spin: Oc, all: true } });
    const C = integratedField({ at, sources: SR, alpha: 2, rRef: 1, selfW: 0.4, W0: 0.2, frame: { spin: Oc, all: false } });
    const fd = fdSpin((p) => integratedField({ at: p, sources: SR, alpha: 2, rRef: 1, selfW: 0.4, W0: 0.2, frame: { spin: Oc, all: true } }).U, at, 1e-5);
    S.commonFrame = { allShift: nrm(sub(sub(A.omega, B.omega), Oc)), srcOnlyShiftOverOc: nrm(sub(A.omega, C.omega)) / nrm(Oc), shareSrc: A.shares.src, fdAll: nrm(sub(fd.omega, B.omega)) / nrm(B.omega) }; }
  // ⑧ 源ごとの分け方の和は J(自転の直接・自転のモーメントの勾配・並進の通過)
  { const F = integratedField({ at, sources: SR, alpha: 1.5, rRef: 2, selfW: 0.3, W0: 0.1, parts: true });
    let Jsum = zero3(); for (const q of F.parts) Jsum = madd(madd(madd(Jsum, q.spinDirect), q.spinGrad), q.trans);
    // 線形性: 源 0 の並進だけを残した場(他の源の運動 0・重みは同じ)の J は源 0 の並進の項と同じ
    const only = SR.map((s, k) => ({ p: s.p, v: k === 0 ? s.v : [0, 0, 0], s: [0, 0, 0], m: s.m })), G = integratedField({ at, sources: only, alpha: 1.5, rRef: 2, selfW: 0.3, W0: 0.1 });
    const Ff = integratedField({ at, sources: SR, alpha: 2, rRef: 1, selfW: 0.4, W0: 0.2, frame: { spin: [0.05, -0.1, 0.3], all: true }, parts: true });
    let Jf = zero3(); for (const q of Ff.parts) Jf = q.rest ? madd(Jf, q.rest) : madd(madd(madd(Jf, q.spinDirect), q.spinGrad), q.trans);
    S.partsSum = { rel: mmaxAbs(madd(Jsum, F.J, -1)) / mmaxAbs(F.J), n: F.parts.length, linear: mmaxAbs(madd(G.J, F.parts[0].trans, -1)) / mmaxAbs(G.J), frameRel: mmaxAbs(madd(Jf, Ff.J, -1)) / mmaxAbs(Ff.J) }; }
  // ⑨ 源の自転だけの閉じた式 ω = (W/W_t)[s − (α/2)(K/W_t) s_⊥](1 つの源 + 一定の K —— α = 2・K ≫ W の赤道面で ω → 0、軸の上で (W/W_t)s)
  { const rows = [];
    for (const a of ALPHAS) for (const d of [[2, 0, 0], [0, 0, 2], [1.2, 0.5, 1.4]]) {
      const s = [0.1, 0.2, 0.9], K = 0.7, F = integratedField({ at: d, sources: [{ p: [0, 0, 0], v: [0, 0, 0], s, m: 1.3 }], alpha: a, rRef: 1.1, selfW: K }), c = singleSpinOmega({ m: 1.3, s, d, alpha: a, rRef: 1.1, K });
      rows.push(nrm(sub(F.omega, c)) / nrm(c));
    }
    const eq = integratedField({ at: [3, 0, 0], sources: [{ p: [0, 0, 0], v: [0, 0, 0], s: [0, 0, 1], m: 1 }], alpha: 2, rRef: 1, selfW: 1e12 });
    const ax = integratedField({ at: [0, 0, 3], sources: [{ p: [0, 0, 0], v: [0, 0, 0], s: [0, 0, 1], m: 1 }], alpha: 2, rRef: 1, selfW: 1e12 });
    S.spinClosed = { maxRel: Math.max(...rows), equatorOverShare: eq.omega[2] / eq.shares.src, axisOverShare: ax.omega[2] / ax.shares.src,
      alpha1Eq: integratedField({ at: [3, 0, 0], sources: [{ p: [0, 0, 0], v: [0, 0, 0], s: [0, 0, 1], m: 1 }], alpha: 1, rRef: 1, selfW: 1e12 }).omega[2] / (1 / 3 / (1e12 + 1 / 3)),
      alpha3Eq: integratedField({ at: [3, 0, 0], sources: [{ p: [0, 0, 0], v: [0, 0, 0], s: [0, 0, 1], m: 1 }], alpha: 3, rRef: 1, selfW: 1e12 }).omega[2] / (1 / 27 / (1e12 + 1 / 27)) }; }
  // ⑩ 有限の受け手: 線形の場(剛体 + せん断)で pair・ballL・ballCurl は局所と同じ・非線形の場で差は (R/r)² の桁(R を半分で 1/4)
  { const lin = (p) => [0.3 + 0.2 * p[1] - 0.5 * p[2], -0.1 - 0.2 * p[0] + 0.7 * p[2] + 0.4 * p[0], 0.5 * p[0] - 0.7 * p[1]];
    const Lw = fdSpin(lin, at, 1e-3).omega, md = RECEIVER_MODES.map((m) => nrm(sub(finiteReceiver(lin, at, 0.8, m).omega, Lw)) / nrm(Lw));
    const src = [{ p: [0, 0, 0], v: [0, 3, 0], s: [0, 0, 0.4], m: 1 }], fld = (p) => integratedField({ at: p, sources: src, alpha: 2, rRef: 1, selfW: 1 }).U, P = [2, 0, 0.3];
    const loc = integratedField({ at: P, sources: src, alpha: 2, rRef: 1, selfW: 1 }).omega;
    const dif = (m, R) => nrm(sub(finiteReceiver(fld, P, R, m).omega, loc)) / nrm(loc);
    S.finite = { linear: md, ratios: RECEIVER_MODES.map((m) => dif(m, 0.2) / dif(m, 0.1)), at02: RECEIVER_MODES.map((m) => dif(m, 0.2)) }; }
  // ⑪ 次数と単位: W₀ = 0 では r_ref に依らない(全部の α)・W₀ ≠ 0 では α ≠ 2 で依る・α = 2 は依らない
  { const rows = ALPHAS.map((a) => { const u = (rr, w0) => integratedField({ at, sources: SR, alpha: a, rRef: rr, W0: w0, selfW: 0 }).omega;
      return { alpha: a, w0zero: nrm(sub(u(1, 0), u(37, 0))) / nrm(u(1, 0)), w0pos: nrm(sub(u(1, 0.5), u(37, 0.5))) / nrm(u(1, 0.5)) }; });
    S.units = { rows, w330b: relD(weightOf(3, 2, 2, 5), W.pointWeight(3, 2, 2)) }; }
  // ⑫ 第332便b の平面の場(trans・coord —— 呼ぶだけ)と同じ値(z = 0 の源・自転は z 軸)
  { const pl = SR.map((s) => ({ x: s.p[0], y: s.p[1], vx: s.v[0], vy: s.v[1], m: s.m, spin: s.s[2] })), src = SR.map((s) => ({ p: [s.p[0], s.p[1], 0], v: [s.v[0], s.v[1], 0], s: [0, 0, s.s[2]], m: s.m }));
    const A = TG.frameField({ at: [at[0], at[1]], sources: pl, kernel: TG.kernelOf('trans'), rot: { type: 'coord' }, selfW: 0.3, bg: 0.2 }), B = integratedField({ at: [at[0], at[1], 0], sources: src, alpha: 2, rRef: 1, selfW: 0.3, W0: 0.2 });
    S.w332bLink = { u: Math.max(relD(A.u[0], B.U[0]), relD(A.u[1], B.U[1])), vortHalf: relD(A.vort / 2, B.omega[2]) }; }
  // ⑬ 遠心の順行と逆行(第331便b の式を呼ぶ): x = 0.5 は減る・x = 2.5 は増す・x = −0.5 は増す・x = 2 は同じ・対の速さの差は剛体 2Ω_f R
  { const a = centrifugalPair({ R: 2, Omega: 1, OmegaF: 0.5 }), b = centrifugalPair({ R: 2, Omega: 1, OmegaF: 2.5 }), c = centrifugalPair({ R: 2, Omega: 1, OmegaF: 2 }), d = centrifugalPair({ R: 3, Omega: 0.7, OmegaF: 0.1, g: 0.9 });
    const e = centrifugalPair({ R: 2, Omega: 1, OmegaF: 0.5, omegaF: 0.2 }), t = centrifugalPair({ R: 1, Omega: 1, OmegaF: 1e-20, omegaF: 3e-20 });
    const fr = CF.frameDemand({ R: 2, Omega: 1, OmegaF: 0.5, omegaF: 0.2 });
    S.centrifugal = { v: [a.pro.verdict, a.retro.verdict, b.pro.verdict, b.retro.verdict, c.pro.verdict, t.pro.verdict, t.retro.verdict, t.pro.verdictAxis, t.retro.verdictAxis], axisClosed: relD(e.pro.changeAxis, fr.demand - fr.total), dvRoots: Math.max(relD(e.dvRigid, e.dvRoots.rigid), relD(e.dvAxis, e.dvRoots.axis), relD(d.dvRigid, d.dvRoots.rigid)), changeA: a.pro.changeRigid, changeAformula: 2 * (0.25 - 1), dv: relD(d.dvRigid, 2 * 0.1 * 3),
      axisDemand: relD(e.pro.demandAxis, 2 * (1 - 0.5) * (1 - 0.2)), axisRetro: relD(e.retro.demandAxis, 2 * (1 + 0.5) * (1 + 0.2)) }; }
  // ⑭ 近日点の状態(二体)と回転
  { const mu = 1.3, r = [1, 0.2, 0.05], v = [-0.1, 1.05, 0.02], P = periapsisState(r, v, mu), en = (rr, vv) => dot(vv, vv) / 2 - mu / nrm(rr), hh = (rr, vv) => crs(rr, vv);
    const R = rotateAbout([1, 0, 0], [0, 0, 1], Math.PI / 2);
    S.periapsis = { energy: relD(en(r, v), en(P.r, P.v)), h: nrm(sub(hh(r, v), hh(P.r, P.v))) / nrm(hh(r, v)), radial: Math.abs(dot(P.r, P.v)) / (nrm(P.r) * nrm(P.v)), rot: nrm(sub(R, [0, 1, 0])) }; }
  // ⑮ 入力の拒否
  { const bad = [() => weightOf(1, 0, 2, 1), () => weightOf(1, 1, 0, 1), () => weightOf(1, 1, 2, 0), () => integratedField({ at: [0, 0, 0], sources: [{ p: [0, 0, 0], v: [0, 0, 0], s: [0, 0, 0], m: 1 }], alpha: 2, rRef: 1 }),
      () => integratedField({ at, sources: [], alpha: 2, rRef: 1 }), () => integratedField({ at, sources: SR, alpha: 2, rRef: 1, selfW: -1 }), () => integratedField({ at: [0, 0], sources: SR, alpha: 2, rRef: 1 }),
      () => selfWeightOf({ rule: 'radius', m: 1, alpha: 2, rRef: 1 }), () => selfWeightOf({ rule: 'robs', m: 1, alpha: 2, rRef: 1 }), () => finiteReceiver((p) => p, at, 0, 'pair'), () => finiteReceiver((p) => p, at, 1, 'cube'),
      () => centrifugalPair({ R: 1, Omega: -1, OmegaF: 0 }), () => demandVerdict(NaN), () => fdSpin((p) => p, at, 0), () => periapsisState([1, 0, 0], [0, 3, 0], 1)];
    let n = 0; for (const f of bad) { try { f(); } catch (e) { if (e instanceof RangeError) n++; } }
    S.reject = { n, of: bad.length }; }
  return S;
}
export function pureGates(S) {
  const tol = DECL.idTol;
  return {
    uniform: S.uniform.max <= 1e-15,
    rigid: S.rigid.max <= tol,
    shear: Math.abs(S.shear.omegaZ + 0.3) <= tol && Math.abs(S.shear.strainXY - 0.3) <= tol && Math.abs(S.shear.fdOmegaZ + 0.3) <= 1e-9 && S.shear.others === 0,
    gradient: S.gradient.rows.length === 12 && S.gradient.maxRel <= DECL.fdTol,
    passing: Math.abs(S.passing.omegaZ + 0.24) <= tol && Math.abs(S.passing.Uy - 0.6) <= tol && Math.abs(S.passing.reversed - 0.24) <= tol && Math.abs(S.passing.h2ratio - 4) < 0.1
      && Math.abs(S.passing.passPart + 0.24) <= tol && S.passing.spinParts === 0,
    sourceOnly: S.sourceOnly.omega <= 1e-15 && Math.abs(S.sourceOnly.withW0) > 0.01 && S.sourceOnly.twoSources > 0.01,
    commonFrame: S.commonFrame.allShift <= tol && Math.abs(S.commonFrame.srcOnlyShiftOverOc - 1) > 0.01 && S.commonFrame.fdAll <= DECL.fdTol,
    partsSum: S.partsSum.rel <= tol && S.partsSum.n === 4 && S.partsSum.linear <= tol && S.partsSum.frameRel <= tol,
    spinClosed: S.spinClosed.maxRel <= tol && Math.abs(S.spinClosed.equatorOverShare) <= 1e-9 && Math.abs(S.spinClosed.axisOverShare - 1) <= 1e-9 && Math.abs(S.spinClosed.alpha1Eq - 0.5) <= 1e-9 && Math.abs(S.spinClosed.alpha3Eq + 0.5) <= 1e-9,
    finite: S.finite.linear.every((x) => x <= 1e-9) && S.finite.ratios.every((x) => Math.abs(x - 4) < 0.3) && S.finite.at02.every((x) => x > 1e-4),
    units: S.units.rows.every((r) => r.w0zero <= 1e-14) && S.units.rows.filter((r) => r.alpha !== 2).every((r) => r.w0pos > 1e-3) && S.units.rows.find((r) => r.alpha === 2).w0pos <= 1e-14 && S.units.w330b <= tol,
    w332bLink: S.w332bLink.u <= tol && S.w332bLink.vortHalf <= 1e-10,
    centrifugal: S.centrifugal.v.join() === 'decrease,increase,increase,increase,equal,decrease,increase,decrease,increase' && S.centrifugal.axisClosed <= tol && S.centrifugal.dvRoots <= 1e-12 && Math.abs(S.centrifugal.changeA - S.centrifugal.changeAformula) <= tol && S.centrifugal.dv <= tol && S.centrifugal.axisDemand <= tol && S.centrifugal.axisRetro <= tol,
    periapsis: S.periapsis.energy <= 1e-12 && S.periapsis.h <= 1e-12 && S.periapsis.radial <= 1e-12 && S.periapsis.rot <= 1e-15,
    reject: S.reject.n === S.reject.of,
  };
}
