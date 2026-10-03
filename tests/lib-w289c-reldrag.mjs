// 第289便c(原仮定者の裁定(第79報)⑤「複素決定力場: 慣性力、引きずり」の整理・第79報で閉じた AN98/AN99・統括の検証項目 R121)——
// **相対移動 r⁻³ 核(前ステップ参照)**の純関数(Node だけ・**エンジン未接続**・html を読まない)。
//
// ■ 何か(**提案する作用素**であって、通常の勾配をベクトル化したものではない)
//   第79報の整理の言葉: 複素決定力場 = 相対移動ベクトル × m/r²・その微分(m/r³)が並進引きずり・引きずりベクトルは毎フレームリセット。
//   これを次の形の純関数にする(p=2 の場 m/(r²+ε²) の半径方向微分の大きさの半分を幾何の重みにする —— 符号と係数 2 は利得 C_d に吸収した宣言):
//     k(r) = r/(r²+ε²)²(遠方 r⁻³・ε>0 なら原点で 0)・K_ij = m_j k(r_ij)
//     u_i = C_d Σ_{j≠i} K_ij ΔV_ij・ΔV_ij = V_j − V_i
//   V は**前の物理ステップ**の移動速度(v+u)のスナップショット prevMove(引きずりは毎ステップ作り直す —— 積み上げない)。
//   単位: m [M]・k [L⁻³]・K [M/L³]・V [L/T]・**C_d [L³/M]** → u [L/T]。**G だけを掛けると u の次元にならない**
//   (G [L³/(M T²)] × K × V = L/T³)—— C_d は G τ_D² のような追加の時間尺度 τ_D を要する(由来は決断事項)。
//   結合の重み a_ij = C_d K_ij = C_d m_j k(r_ij)(無次元)・次数 deg_i = Σ_j a_ij。
//   反復 V ← v + u(V) の線形写像は −L(L はグラフラプラシアン: L_ii = deg_i・L_ij = −a_ij)で、Gershgorin の円板から
//   **スペクトル上界 ρ(L) ≤ 2·max_i deg_i**。上界 < 1 なら反復は縮小写像(十分条件)。
//
// ■ 位置づけ(書くこと・書かないこと)
//   ・**既存の q 付き場・u=A/W・E6′ に足さない**(二重計上)。エンジンへ接続しない。器と QA が比較器で並べるだけ。
//   ・前ステップ参照の反復は**無次元結合 2a が 1 を超えると発散する**(2 体の閉じた漸化式で数で示す)。dt を小さくしても
//     a は dt を含まないので発散は消えない(更新の回数が増えるだけ)。対策 3 案(履歴の時間間隔を物理量にする/(I+L)V=v の暗黙解/
//     緩和時間)は**実装しない**(表に置く —— 決断事項)。clamp で「安定化」しない。
//   ・「回転引きずりが創発した」「連鎖で円盤ができた」「複素場を接続した」とは書かない。
//   ・冪は `**`/Math.pow を使わず積で書く(実行環境で Math.pow が 1 ulp 違っても表が変わらない —— tests/README §1)。
//   ・第290便c(原仮定者の裁定(第80報)⑥・統括の検証項目 R127): 対策表の暗黙解・緩和時間の行を訂正した(I+L は質量の重みで対称化すると
//     正定値 —— L 自身は対称でない/陽的緩和の条件は dt/τ<1 では不足)。反例(λ=1.6・α=0.9 → 倍率 −1.34)と Σm x×u≠0 の 2 体例を試験に足した(版 2)。
//     この核の**エンジンの経路**は physics.relativeDrag.law:"inertial"(宣言した本だけ —— 第290便c の器 tests/exp-w290c-inertial.mjs が門で照合)。
export const RELDRAG_VERSION = 'w289c-reldrag-2';

const fin = Number.isFinite;

/** 幾何の重み k(r) = r/(r²+ε²)²(ε>0 なら k(0)=0)。 */
export function kernelK(r, eps) { const s = r * r + eps * eps; return r / (s * s); }

/**
 * 相対移動 r⁻³ 核の評価(全粒子)。
 * @param {object} o
 *   m: [質量]・x: [x]・y: [y]・prevMove: [[Vx,Vy]](前の物理ステップの v+u)・gain: C_d [L³/M]・eps: ε ≥ 0
 *   mask?: (i,j) => boolean(false の対を結合しない —— 対称に使う。媒介を切る対照だけが使う)
 * @returns {{ok:boolean, why?:string, u:number[][], degree:number[], links:number[], spectralBound:number, contraction:boolean, version:string}}
 */
export function relDragAt(o) {
  const m = o.m, x = o.x, y = o.y, V = o.prevMove, C = o.gain, eps = o.eps, mask = o.mask || null;
  const n = Array.isArray(m) ? m.length : -1;
  if (!(n >= 0) || !Array.isArray(x) || !Array.isArray(y) || !Array.isArray(V) || x.length !== n || y.length !== n || V.length !== n) return { ok: false, why: 'shape' };
  if (!fin(C)) return { ok: false, why: 'gain' };
  if (!(eps >= 0) || !fin(eps)) return { ok: false, why: 'eps' };
  for (let i = 0; i < n; i++) {
    if (!(m[i] > 0) || !fin(m[i])) return { ok: false, why: 'mass' };
    if (!fin(x[i]) || !fin(y[i]) || !Array.isArray(V[i]) || !fin(V[i][0]) || !fin(V[i][1])) return { ok: false, why: 'state' };
  }
  const u = [], degree = [], links = [];
  let bound = 0;
  for (let i = 0; i < n; i++) {
    let ux = 0, uy = 0, deg = 0, nl = 0;
    for (let j = 0; j < n; j++) {
      if (j === i) continue;                                              // 自己除外(m/0³ を足さない)
      if (mask && !mask(i, j)) continue;
      const dx = x[j] - x[i], dy = y[j] - y[i], r2 = dx * dx + dy * dy;
      if (!(r2 > 0)) return { ok: false, why: 'coincident' };             // 一致点は拒否(ε で埋めない)
      const r = Math.sqrt(r2), s = r2 + eps * eps, a = C * m[j] * (r / (s * s));
      ux += a * (V[j][0] - V[i][0]); uy += a * (V[j][1] - V[i][1]);
      deg += a; nl++;
    }
    u.push([ux, uy]); degree.push(deg); links.push(nl);
    const ad = Math.abs(deg); if (ad > bound) bound = ad;
  }
  const spectralBound = 2 * bound;
  return { ok: true, version: RELDRAG_VERSION, u, degree, links, spectralBound, contraction: spectralBound < 1 };
}

/** 反復 V_n = v + u(V_{n−1})(fixed[i] の粒子は V=v のまま —— 規定運動の環)。履歴を返す。 */
export function iterate(o, steps) {
  const n = o.m.length, v = o.v, fixed = o.fixed || [];
  let V = v.map((z) => [z[0], z[1]]);
  const hist = [V];
  let bound = null;
  for (let k = 0; k < steps; k++) {
    const r = relDragAt({ m: o.m, x: o.x, y: o.y, prevMove: V, gain: o.gain, eps: o.eps, mask: o.mask });
    if (!r.ok) return { ok: false, why: r.why, hist };
    bound = r.spectralBound;
    V = V.map((_, i) => fixed[i] ? [v[i][0], v[i][1]] : [v[i][0] + r.u[i][0], v[i][1] + r.u[i][1]]);
    hist.push(V);
  }
  return { ok: true, hist, spectralBound: bound };
}

// ================= ① 単体試験(不変性 6 項 + 一致点の拒否 + 原点で 0) =================
const SAMPLE = Object.freeze({
  m: [1, 2.5, 0.75, 4, 1.5],
  x: [0, 3, -2.5, 1.25, 6],
  y: [0, 1, 2, -4, -1.5],
  V: [[0.5, -0.25], [1.75, 0.5], [-1, 0.75], [0.25, 1.25], [-0.5, -1.5]],
  gain: 0.75, eps: 0.5 });

function relMaxVec(A, B) {
  let num = 0, den = 0;
  for (let i = 0; i < A.length; i++) for (let k = 0; k < 2; k++) { num = Math.max(num, Math.abs(A[i][k] - B[i][k])); den = Math.max(den, Math.abs(B[i][k])); }
  return num / Math.max(den, 1e-300);
}

export function invariants() {
  const S = SAMPLE, base = relDragAt({ m: S.m, x: S.x, y: S.y, prevMove: S.V, gain: S.gain, eps: S.eps });
  const out = {};
  // (1) 共通並進不変: V → V + W(全粒子に同じ W)で u が変わらない
  const W = [0.375, -2.125];
  const tr = relDragAt({ m: S.m, x: S.x, y: S.y, prevMove: S.V.map((z) => [z[0] + W[0], z[1] + W[1]]), gain: S.gain, eps: S.eps });
  out.translation = { W, relMax: relMaxVec(tr.u, base.u), ok: relMaxVec(tr.u, base.u) <= 1e-12 };
  // (2) 等速(全粒子が同じ V)で u = 0(ビット)
  const eq = relDragAt({ m: S.m, x: S.x, y: S.y, prevMove: S.V.map(() => [1.3, -0.7]), gain: S.gain, eps: S.eps });
  out.uniform = { allZero: eq.u.every((z) => z[0] === 0 && z[1] === 0), ok: eq.u.every((z) => z[0] === 0 && z[1] === 0) };
  // (3) 自己除外: ε=0 でも有限(自己項 m/0³ を足していない)・結合の数 = n−1・k(0)=0(ε>0)
  const e0 = relDragAt({ m: S.m, x: S.x, y: S.y, prevMove: S.V, gain: S.gain, eps: 0 });
  out.selfExcluded = { finiteEps0: e0.ok && e0.u.every((z) => fin(z[0]) && fin(z[1])), links: e0.links, k0: kernelK(0, S.eps),
    ok: e0.ok && e0.u.every((z) => fin(z[0]) && fin(z[1])) && e0.links.every((l) => l === S.m.length - 1) && kernelK(0, S.eps) === 0 };
  // (4) 距離減衰 r⁻³: ε=0 で全距離を 2 倍にすると u は厳密に 1/8(2 の冪の縮尺はビットで正確)・ε>0 の遠方でも 1/8 に近づく
  const d1 = relDragAt({ m: S.m, x: S.x, y: S.y, prevMove: S.V, gain: S.gain, eps: 0 });
  const d2 = relDragAt({ m: S.m, x: S.x.map((v) => 2 * v), y: S.y.map((v) => 2 * v), prevMove: S.V, gain: S.gain, eps: 0 });
  const ratioExact = d1.u.every((z, i) => d2.u[i][0] === z[0] / 8 && d2.u[i][1] === z[1] / 8);
  const far = [10, 100, 1000].map((L) => { const a = kernelK(2 * L, S.eps) / kernelK(L, S.eps); return { r: L, ratio: a }; });
  out.decay = { ratioExactEps0: ratioExact, farRatioEps: far, ok: ratioExact && Math.abs(far[2].ratio - 0.125) < 1e-6 };
  // (5) 質量加重の作用反作用: Σ m_i u_i = 0(丸めの範囲 —— 相対は Σ m_i |u_i| で割る)
  let sx = 0, sy = 0, sa = 0;
  base.u.forEach((z, i) => { sx += S.m[i] * z[0]; sy += S.m[i] * z[1]; sa += S.m[i] * Math.hypot(z[0], z[1]); });
  const arRel = Math.hypot(sx, sy) / sa;
  out.actionReaction = { sum: [sx, sy], rel: arRel, ok: arRel <= 1e-14 };
  // (6) 1 体で 0
  const one = relDragAt({ m: [2], x: [1], y: [1], prevMove: [[3, 4]], gain: S.gain, eps: S.eps });
  out.single = { u: one.u[0], ok: one.ok && one.u[0][0] === 0 && one.u[0][1] === 0 };
  // (7) 一致点は拒否
  const co = relDragAt({ m: [1, 1, 1], x: [0, 1, 1], y: [0, 2, 2], prevMove: [[0, 0], [1, 0], [0, 1]], gain: S.gain, eps: S.eps });
  out.coincident = { rejected: co.ok === false && co.why === 'coincident', ok: co.ok === false && co.why === 'coincident' };
  out.sample = { u: base.u, degree: base.degree, spectralBound: base.spectralBound, contraction: base.contraction };
  out.ok = ['translation', 'uniform', 'selfExcluded', 'decay', 'actionReaction', 'single', 'coincident'].every((k) => out[k].ok);
  return out;
}

// ================= ② 前ステップ参照の安定性(2 体・位置固定・慣性速度一定) =================
export const STAB = Object.freeze({ m: 1, r: 4, eps: 0.5, vRel: 1, steps: 20, couplings: [0.2, 0.5, 0.8] });
/**
 * 2 体(等質量 m・距離 r・慣性速度 ±v_rel/2 を x 方向)で V_n = v + u(V_{n−1}) を steps 回。a = C_d m k(r)(C_d は a から逆算)。
 * 相対速度は V_n = v_rel − 2a V_{n−1}(閉じた漸化式)・固定点 v_rel/(1+2a)。
 */
export function twoBody(a, P = STAB) {
  const k = kernelK(P.r, P.eps), C = a / (P.m * k);
  const o = { m: [P.m, P.m], x: [0, P.r], y: [0, 0], v: [[P.vRel / 2, 0], [-P.vRel / 2, 0]], gain: C, eps: P.eps };
  const it = iterate(o, P.steps);
  const seq = it.hist.map((V) => V[0][0] - V[1][0]);
  // 閉じた漸化式(同じ初期値 V_0 = v_rel)
  const closed = [P.vRel];
  for (let n = 1; n <= P.steps; n++) closed.push(P.vRel - 2 * a * closed[n - 1]);
  let relMax = 0;
  for (let n = 0; n <= P.steps; n++) relMax = Math.max(relMax, Math.abs(seq[n] - closed[n]) / Math.max(Math.abs(closed[n]), 1e-300));
  const fp = P.vRel / (1 + 2 * a);
  const dev = seq.map((s) => s - fp);
  const ratio = Math.abs(dev[P.steps]) / Math.abs(dev[0]);
  const regime = (2 * a < 1) ? 'converge' : (2 * a === 1) ? 'oscillate' : 'diverge';
  return { a, twoA: 2 * a, gain: C, k, spectralBound: it.spectralBound, seq, closedRelMax: relMax, fixedPoint: fp, devFirst: dev[0], devLast: dev[P.steps],
    devRatio: ratio, regime, expectedRatio: mulPow(2 * a, P.steps) };
}
/** x^n を積で(n は非負整数)。 */
export function mulPow(x, n) { let r = 1; for (let i = 0; i < n; i++) r *= x; return r; }

/** dt を小さくしても(同じ物理時間に更新が増えるだけで)無次元結合 a は変わらない —— 同じ時刻 T でのずれ。 */
export function dtRefine(a, P = STAB) {
  const T = 0.32, rows = [0.016, 0.008].map((dt) => {
    const steps = Math.round(T / dt), r = twoBody(a, Object.assign({}, P, { steps }));
    return { dt, steps, devAtT: r.devLast, growth: r.devRatio };
  });
  return { a, T, rows, divergesBoth: rows.every((z) => z.growth > 1), worseWithSmallerDt: rows[1].growth > rows[0].growth };
}

/** 対策 3 案(**実装しない** —— 決断事項の表)。第290便c で implicit と relaxation の行を訂正(PHYSICS〔第289便c〕の表の同じ 2 行と同文 —— QA lint.relDragRemedies)。 */
export const REMEDIES = Object.freeze([
  Object.freeze({ key: 'historyInterval', ja: '履歴の時間間隔を物理量にする(前ステップ参照を「時間 τ_D 前の移動速度」と定義し、dt に依らない遅れにする)',
    needs: 'τ_D の由来(C_d=G τ_D² の τ_D と同じ尺度か)・dt が τ_D を割り切らないときの補間', fixes: '刻みの選び方で結合の回数が変わる問題' }),
  Object.freeze({ key: 'implicit', ja: '(I+L)V = v の暗黙解(同じステップの V で閉じる —— 前ステップ参照をやめる)',
    needs: 'n×n の連立(または反復解法)・毎ステップの線形解',
    fixes: '暗黙解は正の質量・gain≥0・対称結合で一意(質量重みで対称化して解く)— 前ステップ遅延則とは別の法則' }),
  Object.freeze({ key: 'relaxation', ja: '緩和時間(V を目標 v+u(V) へ dt/τ の割合だけ寄せる)',
    needs: '陽的緩和は τ>0・0<dt/τ<2/(1+λ_max(L))・十分条件は 2/(1+spectralBound) 未満(dt/τ<1 だけでは不足: λ=1.6・α=0.9 で倍率 −1.34)',
    fixes: '一度に全量を入れ替えることによる振動(条件の中でだけ)' })]);

/**
 * 第290便c: 陽的緩和 V ← V + α(v + u(V) − V)(α = dt/τ)の固有モード倍率。L の固有値 λ のモードで u = −λV なので
 * 斉次部の倍率は 1 − α(1+λ)。|倍率| < 1 ⇔ 0 < α < 2/(1+λ)。λ ≤ λ_max(L) ≤ spectralBound なので α < 2/(1+spectralBound) は十分条件。
 */
export function relaxationMultiplier(lambda, alpha) { return 1 - alpha * (1 + lambda); }
/** 反例: λ=1.6・α=0.9(dt/τ<1 を満たす)で倍率 −1.34(|·|>1 —— 発散)。条件 2/(1+λ)=0.769… を超えている。 */
export function relaxationCounterexample() {
  const lambda = 1.6, alpha = 0.9, mult = relaxationMultiplier(lambda, alpha), limit = 2 / (1 + lambda);
  // 2 体(等質量)で確かめる: 相対モードの λ = 2a(a = C_d m k)。a = 0.8 で λ = 1.6・相対速度の斉次部を 3 回の反復で追う
  const a = 0.8, steps = 3, seq = [1];
  for (let n = 0; n < steps; n++) seq.push(seq[n] + alpha * (-2 * a * seq[n] - seq[n]));   // v=0(斉次部)
  const ratioPerStep = seq[1] / seq[0];
  return { lambda, alpha, multiplier: mult, limit, alphaBelowOne: alpha < 1, unstable: Math.abs(mult) > 1, seq, ratioPerStep,
    ok: alpha < 1 && Math.abs(mult) > 1 && Math.abs(mult - (-1.34)) <= 1e-12 && Math.abs(ratioPerStep - mult) <= 1e-12 };
}
/**
 * 第290便c: 対称核で Σ m u = 0 だが Σ m x×u ≠ 0 の 2 体例(m=1/1・y=±0.5・V=∓1(x 向き)・C_d=0.2・ε=0 → Σm x×u = −0.4)。
 * 「座標変換だから保存則を満たす」とは言えないことの数の例。
 */
export function angularExample() {
  const r = relDragAt({ m: [1, 1], x: [0, 0], y: [0.5, -0.5], prevMove: [[-1, 0], [1, 0]], gain: 0.2, eps: 0 });
  let px = 0, py = 0, jz = 0;
  const X = [0, 0], Y = [0.5, -0.5], M = [1, 1];
  r.u.forEach((z, i) => { px += M[i] * z[0]; py += M[i] * z[1]; jz += M[i] * (X[i] * z[1] - Y[i] * z[0]); });
  return { u: r.u, sumMu: [px, py], sumMxU: jz, ok: r.ok && px === 0 && py === 0 && Math.abs(jz - (-0.4)) <= 1e-15 };
}

// ================= ③ 環の連鎖の対照(1 の核・位置固定・中心の環だけ規定運動) =================
export const CHAIN = Object.freeze({ nPerRing: 16, spacing: 10, mRing: 16, eps: 2, omegaC: 0.5, gain: 4, window: 40 });
/** 環の配置: 環 k(k=0 が中心の環)は半径 (k+1)·spacing・nPerRing 粒子(方位はずらさない)。中心の環は v = Ω ẑ×x(規定運動)。 */
export function ringSystem(nRings, P = CHAIN, perRingCount) {
  const m = [], x = [], y = [], v = [], ring = [], fixed = [];
  for (let k = 0; k < nRings; k++) {
    const R = (k + 1) * P.spacing, N = (perRingCount && perRingCount[k]) || P.nPerRing;
    for (let a = 0; a < N; a++) {
      const t = 2 * Math.PI * a / N, cx = R * Math.cos(t), cy = R * Math.sin(t);
      m.push(P.mRing / N); x.push(cx); y.push(cy); ring.push(k); fixed.push(k === 0);
      v.push(k === 0 ? [-P.omegaC * cy, P.omegaC * cx] : [0, 0]);
    }
  }
  return { m, x, y, v, ring, fixed, nRings };
}
function ringStatsOf(sys, V, k) {
  let s = 0, w = 0, ur = 0;
  for (let i = 0; i < sys.m.length; i++) {
    if (sys.ring[i] !== k) continue;
    const r = Math.hypot(sys.x[i], sys.y[i]), ex = sys.x[i] / r, ey = sys.y[i] / r;
    s += sys.m[i] * (-V[i][0] * ey + V[i][1] * ex); ur += sys.m[i] * (V[i][0] * ex + V[i][1] * ey); w += sys.m[i];
  }
  return { uPhi: s / w, uR: ur / w };
}
function energyAM(sys, V, freeOnly) {
  let E = 0, L = 0;
  for (let i = 0; i < sys.m.length; i++) {
    if (freeOnly && sys.fixed[i]) continue;
    E += 0.5 * sys.m[i] * (V[i][0] * V[i][0] + V[i][1] * V[i][1]); L += sys.m[i] * (sys.x[i] * V[i][1] - sys.y[i] * V[i][0]);
  }
  return { E, L };
}
/** 3 環: 全結合・媒介を切る(中間⇔外縁の結合を外す)・直接を切る(中心⇔外縁の結合を外す)を同じ窓で。 */
export function chain3(P = CHAIN) {
  const sys = ringSystem(3, P);
  const masks = {
    full: null,
    cutMediation: (i, j) => !((sys.ring[i] === 1 && sys.ring[j] === 2) || (sys.ring[i] === 2 && sys.ring[j] === 1)),
    cutDirect: (i, j) => !((sys.ring[i] === 0 && sys.ring[j] === 2) || (sys.ring[i] === 2 && sys.ring[j] === 0)) };
  const runs = {};
  for (const [key, mask] of Object.entries(masks)) {
    const it = iterate({ m: sys.m, x: sys.x, y: sys.y, v: sys.v, gain: P.gain, eps: P.eps, mask, fixed: sys.fixed }, P.window);
    const outer = it.hist.map((V) => ringStatsOf(sys, V, 2).uPhi), mid = it.hist.map((V) => ringStatsOf(sys, V, 1).uPhi);
    const e0 = energyAM(sys, it.hist[0], true), e1 = energyAM(sys, it.hist[P.window], true);
    const a0 = energyAM(sys, it.hist[0], false), a1 = energyAM(sys, it.hist[P.window], false);
    const fin99 = outer.findIndex((z) => Math.abs(z - outer[P.window]) <= 0.01 * Math.abs(outer[P.window]));
    runs[key] = { spectralBound: it.spectralBound, outerUPhi: outer, midUPhi: mid, firstOuterNonzero: outer.findIndex((z) => z !== 0),
      updatesTo99: fin99, lastChangeRel: Math.abs(outer[P.window] - outer[P.window - 1]) / Math.max(Math.abs(outer[P.window]), 1e-300),
      free: { E0: e0.E, E1: e1.E, L0: e0.L, L1: e1.L }, all: { E0: a0.E, E1: a1.E, L0: a0.L, L1: a1.L } };
  }
  const diff = runs.full.outerUPhi.map((z, n) => z - runs.cutMediation.outerUPhi[n]);
  const mediatedFirst = diff.findIndex((z) => z !== 0);
  // 相対速度 0 の対では並進項が 0: 全体が同じ速度(並進)なら u は全粒子で厳密に 0(同速の領域では蓄積しない)
  const same = relDragAt({ m: sys.m, x: sys.x, y: sys.y, prevMove: sys.m.map(() => [0.25, -0.5]), gain: P.gain, eps: P.eps });
  return { decl: P, n: sys.m.length, runs, mediated: { diff, firstUpdate: mediatedFirst, atWindow: diff[P.window],
    shareOfOuter: diff[P.window] / runs.full.outerUPhi[P.window] },
    sameVelocityZero: same.ok && same.u.every((z) => z[0] === 0 && z[1] === 0) };
}
/** 環数 3→6: u_φ(r)・∂_r u_φ(隣の環との差分)・安定指標(上界)と臨界利得 C_d*(上界 = 1)。 */
export function ringsScan(P = CHAIN, counts = [3, 4, 5, 6]) {
  return counts.map((nR) => {
    const sys = ringSystem(nR, P);
    const it = iterate({ m: sys.m, x: sys.x, y: sys.y, v: sys.v, gain: P.gain, eps: P.eps, fixed: sys.fixed }, P.window);
    const VN = it.hist[P.window], VP = it.hist[P.window - 1];
    const rows = [];
    for (let k = 0; k < nR; k++) {
      const s = ringStatsOf(sys, VN, k), sp = ringStatsOf(sys, VP, k);
      rows.push({ ring: k, r: (k + 1) * P.spacing, uPhi: s.uPhi, uR: s.uR, lastChange: Math.abs(s.uPhi - sp.uPhi) });
    }
    for (let k = 0; k < nR; k++) rows[k].dUPhiDr = (k + 1 < nR) ? (rows[k + 1].uPhi - rows[k].uPhi) / P.spacing : null;
    return { nRings: nR, n: sys.m.length, spectralBound: it.spectralBound, criticalGain: P.gain / it.spectralBound, rows };
  });
}
/**
 * 代表粒子の数(中間の環の総質量は同じ)を 16 → 4 → 1 に減らしたときの上界・外縁の粒子の最大次数・外縁の u_φ(平均と粒子間の幅)。
 * 核は m_j をそのまま掛けるので、1 粒子に多くの質量を代表させると、その近くの粒子の結合が r⁻³ の近距離で強く出る
 * (代表率と密度分布は別 —— 注記の数)。
 */
export function representation(P = CHAIN) {
  return [16, 4, 1].map((N) => {
    const sys = ringSystem(3, P, [P.nPerRing, N, P.nPerRing]);
    const it = iterate({ m: sys.m, x: sys.x, y: sys.y, v: sys.v, gain: P.gain, eps: P.eps, fixed: sys.fixed }, P.window);
    const r = relDragAt({ m: sys.m, x: sys.x, y: sys.y, prevMove: sys.v, gain: P.gain, eps: P.eps });
    let outerMaxDeg = 0, lo = Infinity, hi = -Infinity;
    const VN = it.hist[P.window];
    for (let i = 0; i < sys.m.length; i++) {
      if (sys.ring[i] !== 2) continue;
      if (r.degree[i] > outerMaxDeg) outerMaxDeg = r.degree[i];
      const rr = Math.hypot(sys.x[i], sys.y[i]), up = (-VN[i][0] * sys.y[i] + VN[i][1] * sys.x[i]) / rr;
      if (up < lo) lo = up; if (up > hi) hi = up;
    }
    return { midCount: N, midMassEach: P.mRing / N, spectralBound: it.spectralBound, outerMaxDegree: outerMaxDeg,
      outerUPhi: ringStatsOf(sys, VN, 2).uPhi, outerUPhiSpread: hi - lo };
  });
}

export function computeAll() {
  return { version: RELDRAG_VERSION, invariants: invariants(),
    stability: { decl: STAB, rows: STAB.couplings.map((a) => twoBody(a)), dt: dtRefine(0.8), remedies: REMEDIES,
      relaxationCounterexample: relaxationCounterexample(), angularExample: angularExample() },
    chain: chain3(), rings: ringsScan(), representation: representation() };
}
