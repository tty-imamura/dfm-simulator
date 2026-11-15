// 第337便c(原仮定者の指示(2026-11-14 —— 第138報)「潮汐ロックしている状態は、外部からの軸引きずりによる回転よりも、潮汐力が上回っている」
//   「互いに潮汐ロックしていると、どちらかを基準にした座標系では、距離以外の引きずりが消え、遠方宇宙が回転している。遠方宇宙基準の通常の慣性系では、互いを自転速度で回す引きずりとなる」
//   「連星は、互いの潮汐力の反作用により、軸引きずりが連星同士の回転として現れる」・統括の検証項目 R339):
//   **潮汐ロックと連星の探索の純関数** —— T1 2 つの座標系の読み(片方の天体に固定して回る座標系/遠方宇宙基準の慣性系)・T2 ロックの条件の最小の型(ノブ)と実在の天体の表・
//   T3 潮汐の反作用 → 連星どうしの回転(角運動量の帳簿)と層の模型・T4 同期の 3 列(瞬間の同期・平均の同期・秤動する応答)の近点の永年の率
//   (器 tests/exp-w337c-tidelock.mjs と QA behavior.tidelock337c が読む —— html を読まない・状態を持たない・第335便b・第335便d・第334便d・第333便c の lib は呼ぶだけ・エンジンの式を写さない)。
//   出どころの型: T2 の最小の型 I ṡ = −K sin(2δ) − Γ_t (s − n) + N_ext は統括の参考の試作(探索の出発点 —— 採った潮汐の則ではない)。
//
// ■ 探索の方針(原仮定者の指示(2026-11-14 —— 第138報)): 式の形は走行の前に決め打ちしない。候補の型とノブを並べて測り、1 つのノブで同時に満たせなければノブを足す(ノブの表 KNOBS)。
//   測った数はそのまま残し、対照(ノブ 0・反作用なし・背景の重み 0)を同じ表に置く。候補を法則と書かない。
// ■ 区別: 実装 = 今の beta の html にある型(K1 の並進の一次 —— この lib は使わない)/診断 = この lib の表/宣言(未接続)= T2 の最小の型・T3 の反作用の口・層の模型(今のエンジンに無い)。
// ■ 単位: 無次元(G = 1・二体の質量の和 M = 1・長半径 a = 1・平均運動 n = 1・自転の慣性モーメント I = 1 —— K は I n²・Γ は I n の単位)。実在の天体の表だけ SI。
// ■ 言わないこと: 候補の型の表と条件付きの恒等式と残差(観測と比べた結果ではない)。実在の天体の表の比のしきいはノブ(係数は決めない)。文献の値は本環境では一次資料に当たっていない(未照合)。
//   加減速の繰り返しの損失は枝 d の題(この lib は持たない)。
import { coordVelocity, carriedVelocity } from './lib-w335b-carryledger.mjs';
import { syncTypeCase, secularTable } from './lib-w335d-binarytilt.mjs';
import { orbitOfState, vec } from './lib-w334d-binarylaw.mjs';

export const LIB_VERSION = 'w337c-tidelock-lib-1';
const isFin = Number.isFinite;
const { add, sub, scl, dot, crs, nrm, unit } = vec;
const wrapPi = (x) => Math.atan2(Math.sin(x), Math.cos(x));
const Z = [0, 0, 1];
const rotZ = (v, a) => { const c = Math.cos(a), s = Math.sin(a); return [c * v[0] - s * v[1], s * v[0] + c * v[1], v[2]]; };
const slopeOf = (xs, ys) => { const N = xs.length, mx = xs.reduce((a, q) => a + q, 0) / N, my = ys.reduce((a, q) => a + q, 0) / N; let sxy = 0, sxx = 0; for (let j = 0; j < N; j++) { sxy += (xs[j] - mx) * (ys[j] - my); sxx += (xs[j] - mx) * (xs[j] - mx); } return sxy / sxx; };

/* ───────── 宣言(走らせるノブの格子と判定の物差し —— 式の形の宣言ではなく、何を測ったかの記録)───────── */
export const DECL = Object.freeze({
  /** T1 2 つの座標系(質量比 q = m₂/m₁・位相・受け手・自己の重みの比 W_ii/w・背景の重みの比 W₀/w・座標系の向き ψ) */
  frames: Object.freeze({
    modes: Object.freeze(['circ', 'instant', 'mean']), e: Object.freeze([0, 0.1, 0.3, 0.6]), nPhase: 8, q: Object.freeze([0.122, 0.5, 1]), receivers: Object.freeze([0, 1]),
    selfRatios: Object.freeze([1e-3, 1, 1e3]), w0Ratios: Object.freeze([0, 1e-3, 1, 1e3]), psi: 0.7, farR: 1e6, tol: 1e-13,
  }),
  /** T2 ロックの条件(円 —— δ̇ = s − n・I ṡ = −K sin 2δ − Γ_t (s − n) + N_ext) */
  lock: Object.freeze({
    K: 1, nOverK: Object.freeze([0, 0.5, 0.9, 0.99, 1.01, 1.1, 2]), gammas: Object.freeze([0.1, 1, 10]), s0: Object.freeze([1, 6]), T: 800, h: 0.01, win: 100,
    /** ロックの判定: 最後の窓で δ の動き < lockDrift かつ |⟨s⟩ − n| < lockMean */
    lockDrift: 0.1, lockMean: 1e-6,
    /** 時定数(小さい揺れ δ* + 1e-3 から —— Q = (s − n)² + 2K cos 2δ* (δ − δ*)² の対数の傾き。窓は Q/Q₀ ∈ [1e-12, 1e-4]) */
    tauN: Object.freeze([0, 0.5, 0.9]), tauT: 600,
    /** 受動の型 N_ext = Γ_ax (ω_ext − s)(ω_ext − n = (K/Γ_ax) × 比) */
    passive: Object.freeze({ gax: Object.freeze([0.1, 1]), ratio: Object.freeze([0.5, 0.99, 1.01, 2]), gamma: 1 }),
    /** 離心(真近点角で積分 —— 復元 K (a/r)³ sin 2(θ − f)・減衰の型 inst = Γ (a/r)⁶ (s − ḟ)/mean = Γ (s − n)) */
    ecc: Object.freeze({ e: Object.freeze([0.1, 0.3]), nOverK: Object.freeze([0, 0.5, 0.9, 1.1]), damp: Object.freeze(['inst', 'mean']), gamma: 1, nOrb: 200, win: 50, stepsPerOrbit: 2000 }),
    /** 水星の離心での共鳴の読み(e は CSV の値・K 1・Γ 2 つ・初期の自転 3 つ —— 減衰の型 inst) */
    mercury: Object.freeze({ gammas: Object.freeze([0.01, 0.1]), s0: Object.freeze([1, 1.5, 2]), nOrb: 400, win: 100 }),
    /** 補足の向き(原仮定者の補足(2026-11-14 —— 第138報の補足)): 外部の軸引きずりが逆回転(N_ext < 0 —— 順行の同期に逆らう)の行 */
    negN: Object.freeze([-0.5, -0.9, -0.99, -1.01, -1.1]),
  }),
  /** T3 角運動量の帳簿(円と離心 —— 自転 2 つ + 相対の軌道。η = 0.0974〔冥王星–カロンの桁〕・S/L = σ・I₁ : I₂ = 0.8 : 0.2・外部のトルクは天体 1 に ν I₁ n²) */
  ledger: Object.freeze({
    eta: 0.0974, sigma: Object.freeze([0.01, 0.1, 0.5]), split: 0.8, kTil: Object.freeze([0, 1, 100]), gTil: Object.freeze([0, 0.01, 1, 10]), nu: 1e-4, nOrb: 20, stepsPerOrbit: 4000,
    ecc: Object.freeze({ e: 0.3, sigma: 0.1, rows: Object.freeze([[100, 1], [0, 1], [100, 0]]) }),
    /** 補足の向き: 外部の軸引きずりを逆回転(ν < 0)で掛けた行 [σ, K, Γ_t, ν] */
    neg: Object.freeze([Object.freeze([0.01, 100, 1, -1e-4]), Object.freeze([0.1, 100, 1, -1e-4]), Object.freeze([0.1, 0, 1, -1e-4])]),
  }),
  /** T3 層の模型(層の数 × 結合 —— 慣性 1 ずつ・外部のトルクは外の層 1 枚に) */
  layers: Object.freeze({ nL: Object.freeze([2, 3, 4]), c: Object.freeze([0.01, 0.1, 1]), N: 1e-3 }),
  /** T4 秤動する応答(真近点角で積分・周期の解を射撃で求める —— 復元 K (a/r)³・減衰 Γ (a/r)⁶ (s − ḟ)) */
  libr: Object.freeze({
    e: Object.freeze([0.1, 0.2, 0.4]), K: Object.freeze([0, 0.01, 0.1, 1, 10, 100]), gamma: Object.freeze([0, 0.1, 1, 10]), nQuad: 4096, fdStep: 1e-6, ladderPerDecade: 8, newtonIter: 30, newtonTol: 1e-12,
    /** 通過の角の同時発展(ε = 1e-6・8 公転・1 公転 2000 刻み)で求積と照らす部分集合 [e, K, Γ] */
    pass: Object.freeze([Object.freeze([0.2, 1, 1]), Object.freeze([0.4, 10, 0.1]), Object.freeze([0.1, 0.1, 10])]), passEps: 1e-6, passOrb: 8, passSteps: 2000, passTol: 2e-3,
    endTol: 1e-6,
  }),
  /** 実在の天体の表(年齢・初期の自転・k₂/Q の既定と振る範囲) */
  /** 補足 2(原仮定者の補足(2026-11-14 —— 第138報の補足 2)): 分類を目標の列にした 3 つの比の読み(α・釣り合いの幅 tol —— 金星で太陽と銀河の軸引きずりが釣り合うように比のノブを置く) */
  classify: Object.freeze({ alphas: Object.freeze([1.5, 2, 3]), tols: Object.freeze([1.5, 2, 3]), galProj: 0.5, au: 1.495978707e11, earthVenusMinAU: 0.277 }),
  bodies: Object.freeze({ alpha: 2, sideScan: Object.freeze([0, 0.25, 0.5, 0.75, 1]), galTiltDeg: 120, ageYr: 4.5e9, p0h: Object.freeze([5, 10, 24]), p0Main: 10, k2qSolid: 3e-3, k2qGas: 1e-5, k2qScan: Object.freeze([1e-8, 1e-7, 1e-6, 1e-5, 1e-4, 1e-3, 1e-2, 1e-1]) }),
});

/** ノブの表(PHYSICS の節に載せる —— 状態: 候補/対照/不用の見込み。効いた量・効かなかった量は器の正本から文書の lib が書く) */
export const KNOBS = Object.freeze([
  Object.freeze({ key: 'W0', name: '背景の慣性決定力 W₀(÷ w)', why: 'T1: 片方の天体に固定した座標系で、遠方宇宙(背景)の回転が運ぶ分の有無', grid: '0・1e-3・1・1e3', state: '対照(主列は 0)' }),
  Object.freeze({ key: 'K', name: '復元の強さ K', why: 'T2・T4: 位相のずれ δ を戻す(ロックを保つ)', grid: '0〜100(I n²)', state: '候補' }),
  Object.freeze({ key: 'Gt', name: '潮汐の減衰 Γ_t', why: 'T2・T3・T4: 自転の差を消す(ロックへ入る・トルクを軌道へ渡す)', grid: '0〜10(I n)', state: '候補' }),
  Object.freeze({ key: 'Next', name: '外部の軸引きずりのトルク N_ext(一定)', why: 'T2・T3: 「外部の軸引きずり < 潮汐」の比べる側', grid: 'N/K 0〜2', state: '候補' }),
  Object.freeze({ key: 'Gax', name: '受動の型 Γ_ax (ω_ext − s)', why: 'T2: 外部の軸引きずりを源の角速度との差で書く型', grid: 'Γ_ax 0.1・1 × 比 0.5〜2', state: '候補' }),
  Object.freeze({ key: 'damp', name: '減衰の基準(瞬間 ḟ/平均 n)', why: 'T2(離心)・T4: 近点の瞬間の同期と平均の同期を分ける', grid: 'inst・mean', state: '候補' }),
  Object.freeze({ key: 'rexp', name: '距離の冪(K ∝ r⁻³・Γ ∝ r⁻⁶)', why: 'T2(離心)・T4: 近点で強く効く', grid: '固定(振っていない)', state: '候補(未掃引)' }),
  Object.freeze({ key: 'thr', name: '比のしきい X* = N_tide/N_ax の境目', why: '実在の天体の表: ロックしている/していないを 1 本で分ける', grid: '表の比の全域', state: '候補' }),
  Object.freeze({ key: 'k2q', name: '天体の硬さ k₂/Q(固体と気体で分ける)', why: '実在の天体の表: 比のしきいで分けられない分', grid: '1e-8〜1e-1', state: '候補' }),
  Object.freeze({ key: 'age', name: '年齢', why: '実在の天体の表: ロックへ入る時間との比べ', grid: '4.5e9 年(固定)', state: '候補' }),
  Object.freeze({ key: 'p0', name: '初期の自転の周期', why: '実在の天体の表: ロックへ入る時間', grid: '5・10・24 時間', state: '候補' }),
  Object.freeze({ key: 'sigma', name: '自転と軌道の角運動量の比 σ = S/L', why: 'T3: トルクのうち軌道へ入る割合', grid: '0.01・0.1・0.5', state: '候補' }),
  Object.freeze({ key: 'react', name: '反作用の口(潮汐のトルクを軌道へ)', why: 'T3: 角運動量の帳簿を閉じる', grid: 'あり/なし', state: '対照(なしは帳簿が閉じない)' }),
  Object.freeze({ key: 'side', name: '差分の読み(横の面の分を入れる割合 f —— 係数 c = 1 − α + f α/2)', why: '補足の向き: 赤道面の軸引きずりの向き(f = 0 は近い面と遠い面の差分だけ c = 1 − α・f = 1 は回転率の全部 c = 1 − α/2)', grid: 'f 0・0.25・0.5・0.75・1(α = 2)', state: '候補(f = 0 が主の候補)' }),
  Object.freeze({ key: 'Qsg', name: '太陽の軸引きずりと背景軸引きずりの比のノブ Q(金星で釣り合う置き方)', why: '補足 2・3: 水星は太陽が強い・金星は釣り合い・地球より外は背景軸引きずり(銀河 —— 背景慣性決定力に含まれる一様な項)の側', grid: 'α 1.5・2・3 × 幅 tol 1.5・2・3', state: '候補' }),
  Object.freeze({ key: 'Tg', name: '軸引きずりのしきい T_g = Γ₀ |ω_背景|(潮汐 N_tide/I と比べる)', why: '補足 2: 主要な衛星は潮汐ロック・惑星はしない', grid: '帯を読む', state: '候補' }),
  Object.freeze({ key: 'cL', name: '層の結合 c', why: 'T3: 剛体でない天体が全体として回るまでの時間', grid: '0.01・0.1・1', state: '候補' }),
]);

/* ───────── 二体の状態(相対の軌道 —— 真近点角 f で)───────── */
export function kepAt(e, f) { const p = 1 - e * e, h = Math.sqrt(p), r = p / (1 + e * Math.cos(f)); return { p, h, r, rdot: e * Math.sin(f) / h, fdot: h / (r * r) }; }
/** 相互にロックした連星の状態(慣性系・重心原点)。mode: circ(e = 0・Ω = n)・instant(Ω = ḟ)・mean(Ω = n) */
export function pairState({ q, e, phase, mode }) {
  if (!['circ', 'instant', 'mean'].includes(mode)) throw new RangeError('pairState: mode は circ・instant・mean');
  if (mode === 'circ' && e !== 0) throw new RangeError('pairState: circ は e = 0');
  const m1 = 1 / (1 + q), m2 = q / (1 + q), K = kepAt(e, phase), xh = [Math.cos(phase), Math.sin(phase), 0], ph = [-Math.sin(phase), Math.cos(phase), 0];
  const x = scl(xh, K.r), w = add(scl(xh, K.rdot), scl(ph, K.r * K.fdot)), Om = mode === 'instant' ? K.fdot : 1;
  return { r: K.r, rdot: K.rdot, fdot: K.fdot, h: K.h, m: [m1, m2], p: [scl(x, -m2), scl(x, m1)], v: [scl(w, -m2), scl(w, m1)], s: [[0, 0, Om], [0, 0, Om]], Omega: Om };
}

/* ───────── T1 2 つの座標系の読み ───────── */
/**
 * 受け手 i・源 j(相互にロック —— 源の自転 s_j = Ω ẑ)。(B) 遠方宇宙基準の慣性系: C_{j→i} − v_i = v_j + s_j × (p_i − p_j) − v_i。
 * (A) 源 j に固定して源の自転 Ω で回る座標系(原点 p_j・向き ψ): P′ = R(−ψ)(P − p_j)・V′ = R(−ψ)(V − v_j − Ω × (P − p_j))・源の自転は s′ = s_j − Ω = 0。
 * 背景の重み W₀ の読み 2 つ: 共変(背景の静止の速度場 0 を同じ変換で写す)/素朴(回る座標系で背景を静止と置く v_bg′ = 0)。
 */
export function frameRow({ q, e, phase, mode, i, selfRatio, w0Ratio, psi = DECL.frames.psi, farR = DECL.frames.farR }) {
  const P = pairState({ q, e, phase, mode }), j = 1 - i, pi = P.p[i], pj = P.p[j], vi = P.v[i], vj = P.v[j], sj = P.s[j], Om = sj;
  const w = 1, selfW = selfRatio * w, W0 = w0Ratio * w, W = selfW + W0 + w, back = (v) => rotZ(v, psi);
  const toA = (Pp, Vv) => { const dp = sub(Pp, pj); return { p: rotZ(dp, -psi), v: rotZ(sub(sub(Vv, vj), crs(Om, dp)), -psi) }; };
  // (B)
  const CB = coordVelocity({ p: pj, v: vj, s: sj }, pi), relB = sub(CB, vi);
  const dB = carriedVelocity({ v: vi, selfW, W0, vBg: [0, 0, 0], sources: [{ w, C: CB }] }).d;
  // (A)
  const iA = toA(pi, vi), jA = { p: [0, 0, 0], v: [0, 0, 0], s: sub(sj, Om) };
  const CA = coordVelocity(jA, iA.p), relA = sub(CA, iA.v), relAb = back(relA);
  // 閉じた式 −ṙ r̂ + r(Ω − ḟ) φ̂(r̂ = (p_i − p_j)/r)
  const dp = sub(pi, pj), r = nrm(dp), rh = scl(dp, 1 / r), dv = sub(vi, vj), rdot = dot(rh, dv), fdot = crs(dp, dv)[2] / (r * r), phh = crs(Z, rh);
  const closed = add(scl(rh, -rdot), scl(phh, r * (Om[2] - fdot)));
  const rhA = unit(iA.p), radA = dot(relA, rhA), tanA = dot(relA, crs(Z, rhA));
  // 背景(遠方の慣性系で静止の点)が (A) で回る角速度
  const far = add(pj, scl([Math.cos(phase + 1), Math.sin(phase + 1), 0], farR)), fA = toA(far, [0, 0, 0]), omBg = crs(fA.p, fA.v)[2] / dot(fA.p, fA.p);
  // 背景の重みの 2 つの読み
  const vBgA = toA(pi, [0, 0, 0]).v;
  const dAcov = carriedVelocity({ v: iA.v, selfW, W0, vBg: vBgA, sources: [{ w, C: CA }] }).d, dAnaive = carriedVelocity({ v: iA.v, selfW, W0, vBg: [0, 0, 0], sources: [{ w, C: CA }] }).d;
  const naiveCf = (W0 / W) * nrm(add(vj, crs(Om, dp)));
  return {
    q, e, phase, mode, i, selfRatio, w0Ratio, r, rdot, fdot, Omega: Om[2],
    errFrame: nrm(sub(relAb, relB)), errClosed: nrm(sub(relB, closed)), radA, tanA, errRadA: Math.abs(radA + rdot), errTanA: Math.abs(tanA - r * (Om[2] - fdot)),
    rotB: nrm(crs(sj, dp)), rotA: nrm(crs(jA.s, iA.p)), transB: nrm(sub(vj, vi)), transA: nrm(iA.v), omBgPlusOmega: omBg + Om[2], omBg,
    errCov: nrm(sub(back(dAcov), dB)), diffNaive: nrm(sub(back(dAnaive), dB)), naiveCf, errNaiveCf: Math.abs(nrm(sub(back(dAnaive), dB)) - naiveCf),
  };
}
/** T1 の表(型 × e × 位相 × 質量比 × 受け手 × 自己の重み × 背景の重み —— circ は e = 0 だけ) */
export function frameTable(D = DECL.frames) {
  const rows = [], phases = Array.from({ length: D.nPhase }, (_, k) => 2 * Math.PI * k / D.nPhase);
  for (const mode of D.modes) for (const e of D.e) {
    if ((mode === 'circ') !== (e === 0)) continue;
    for (const phase of phases) for (const q of D.q) for (const i of D.receivers) for (const selfRatio of D.selfRatios) for (const w0Ratio of D.w0Ratios) rows.push(frameRow({ q, e, phase, mode, i, selfRatio, w0Ratio }));
  }
  const mx = (rr, k) => Math.max(...rr.map((x) => Math.abs(x[k])));
  const summary = [];
  for (const mode of D.modes) for (const e of D.e) {
    const rr = rows.filter((x) => x.mode === mode && x.e === e); if (!rr.length) continue;
    summary.push({ mode, e, n: rr.length, errFrame: mx(rr, 'errFrame'), errClosed: mx(rr, 'errClosed'), errRadA: mx(rr, 'errRadA'), errTanA: mx(rr, 'errTanA'), maxRadA: mx(rr, 'radA'), maxTanA: mx(rr, 'tanA'),
      maxRotB: mx(rr, 'rotB'), maxRotA: mx(rr, 'rotA'), maxTransB: mx(rr, 'transB'), maxTransA: mx(rr, 'transA'), omBgDev: mx(rr, 'omBgPlusOmega') });
  }
  const w0 = D.w0Ratios.map((w0Ratio) => { const rr = rows.filter((x) => x.w0Ratio === w0Ratio);
    return { w0Ratio, n: rr.length, errCov: mx(rr, 'errCov'), maxNaive: mx(rr, 'diffNaive'), errNaiveCf: mx(rr, 'errNaiveCf'), maxNaiveCirc: mx(rr.filter((x) => x.mode === 'circ'), 'diffNaive') }; });
  return { rows, summary, w0, maxErr: Math.max(...rows.map((x) => Math.max(x.errFrame, x.errClosed, x.errRadA, x.errTanA, x.errCov))) };
}
/** 第335便d の syncTypeCase(同期の型の閉じた式)との照らし —— 同じ配置の残る相対の速度(β = 1/(1 + W_ii/w) を掛けた d)の動径・接線 */
export function syncCrossCheck(D = DECL.frames) {
  let mx = 0, n = 0;
  for (const type of ['circ', 'instant', 'mean']) for (const e of [0, 0.1, 0.3]) {
    if ((type === 'circ') !== (e === 0)) continue;
    for (let k = 0; k < D.nPhase; k++) for (const q of [0.122, 1]) for (const recv of [0, 1]) {
      const phase = 2 * Math.PI * k / D.nPhase, c = syncTypeCase({ q, e, phase, recv, selfRatio: 1, type });
      const fr = frameRow({ q, e, phase, mode: type, i: recv, selfRatio: 1, w0Ratio: 0 });
      mx = Math.max(mx, Math.abs(c.dr - 0.5 * fr.radA), Math.abs(c.dt - 0.5 * fr.tanA)); n++;
    }
  }
  return { n, maxErr: mx, note: '第335便d の syncTypeCase の残る d(動径・接線 —— β = 1/2・自己の重みの比 1)と、この lib の (A) の座標系の動径・接線 × β' };
}
/** エネルギーの対応 E′ = E − Ω·L(重心のまわりを一定の Ω で回る座標系 —— 遠心の位置のエネルギーを含む) */
export function energyRow({ q, e, phase, Omega = 1 }) {
  const P = pairState({ q, e, phase, mode: e === 0 ? 'circ' : 'mean' }), Om = [0, 0, Omega], m = P.m;
  const r = nrm(sub(P.p[1], P.p[0])), U = -m[0] * m[1] / r;
  let E = U, L = 0, Ep = U;
  for (let k = 0; k < 2; k++) { const v = P.v[k], p = P.p[k], vp = sub(v, crs(Om, p)), w = crs(Om, p);
    E += 0.5 * m[k] * dot(v, v); L += m[k] * crs(p, v)[2]; Ep += 0.5 * m[k] * dot(vp, vp) - 0.5 * m[k] * dot(w, w); }
  let kinPrime = 0; for (let k = 0; k < 2; k++) { const vp = sub(P.v[k], crs(Om, P.p[k])); kinPrime += 0.5 * m[k] * dot(vp, vp); }
  return { q, e, phase, Omega, E, L, Ep, EmOL: E - Omega * L, err: Math.abs(Ep - (E - Omega * L)), kinPrime };
}

/* ───────── T2 ロックの条件(円)───────── */
/** δ̇ = s − n・I ṡ = −K sin 2δ − Γ_t (s − n) + N_ext(N_ext は一定 N か受動 Γ_ax (ω_ext − s))。n = 1・I = 1。戻り値: 窓の標本 */
export function spinCirc({ K, G, N = 0, gax = 0, wext = 1, d0 = 0, s0 = 1, T, h, every = 1, onSample = null }) {
  const f = (d, s) => [s - 1, -K * Math.sin(2 * d) - G * (s - 1) + (gax > 0 ? gax * (wext - s) : N)];
  let d = d0, s = s0, t = 0; const nS = Math.round(T / h);
  for (let k = 1; k <= nS; k++) {
    const a = f(d, s), b = f(d + 0.5 * h * a[0], s + 0.5 * h * a[1]), c = f(d + 0.5 * h * b[0], s + 0.5 * h * b[1]), e = f(d + h * c[0], s + h * c[1]);
    d += h * (a[0] + 2 * b[0] + 2 * c[0] + e[0]) / 6; s += h * (a[1] + 2 * b[1] + 2 * c[1] + e[1]) / 6; t = k * h;
    if (onSample && k % every === 0) onSample(t, d, s);
  }
  return { d, s, t };
}
/** ロックの判定の行(最後の窓で δ の動きと ⟨s⟩ − n) */
export function lockRow({ K, G, N = 0, gax = 0, wext = 1, s0 = 1, D = DECL.lock }) {
  const tw0 = D.T - D.win; let dW0 = null, sAcc = 0, nAcc = 0, dMin = Infinity, dMax = -Infinity;
  const R = spinCirc({ K, G, N, gax, wext, d0: 0, s0, T: D.T, h: D.h, onSample: (t, d, s) => { if (t > tw0 + 1e-9) { if (dW0 === null) dW0 = d; sAcc += s - 1; nAcc++; dMin = Math.min(dMin, d); dMax = Math.max(dMax, d); } } });
  const drift = R.d - dW0, meanSlip = sAcc / nAcc, locked = Math.abs(drift) < D.lockDrift && Math.abs(meanSlip) < D.lockMean;
  const Neff = gax > 0 ? gax * (wext - 1) : N, Gtot = G + (gax > 0 ? gax : 0), pred = Math.abs(Neff) <= K;
  const dStar = pred ? 0.5 * Math.asin(Neff / K) : null, dEnd = wrapPi(2 * R.d) / 2;
  const overdamped = !pred && Gtot > 0 ? Math.sqrt(Neff * Neff - K * K) / Gtot * Math.sign(Neff) : null;
  return { K, G, N: Neff, gax, wext, s0, locked, pred, agree: locked === pred, drift, meanSlip, dStar, errDstar: dStar === null ? null : Math.abs(dEnd - dStar), overdamped, swing: dMax - dMin };
}
/** 時定数(小さい揺れ —— 閉じた式: 減衰が弱い Γ² < 8 I K cos 2δ* なら Γ/(2I)・強ければ遅い根 (Γ − √(Γ² − 8 I K cos 2δ*))/(2I)) */
export function tauRow({ K, G, N, D = DECL.lock }) {
  const dS = 0.5 * Math.asin(N / K), c = Math.cos(2 * dS), disc = G * G - 8 * K * c, rateCf = disc < 0 ? G / 2 : (G - Math.sqrt(disc)) / 2;
  const ts = [], qs = []; let Q0 = null;
  spinCirc({ K, G, N, d0: dS + 1e-3, s0: 1, T: D.tauT, h: D.h, every: 10, onSample: (t, d, s) => { const Q = (s - 1) ** 2 + 2 * K * c * (d - dS) ** 2; if (Q0 === null) Q0 = (2 * K * c) * 1e-6; const rq = Q / Q0; if (rq < 1e-4 && rq > 1e-12) { ts.push(t); qs.push(Math.log(Q)); } } });
  const rate = ts.length > 10 ? -slopeOf(ts, qs) / 2 : null;
  return { K, G, N, dStar: dS, rateCf, rate, rel: rate === null ? null : Math.abs(rate - rateCf) / rateCf, regime: disc < 0 ? '減衰が弱い(振動)' : '減衰が強い(過減衰)', n: ts.length };
}
/** 離心の軌道の自転(真近点角 f で積分 —— dθ/df = s r²/h・ds/df = [−K r⁻³ sin 2(θ − f) − 減衰 + N] r²/h)。damp: inst = Γ r⁻⁶ (s − ḟ)/mean = Γ (s − 1) */
export function spinEcc({ e, K, G, N = 0, damp = 'inst', th0 = 0, s0 = 1, nOrb, stepsPerOrbit, onOrbit = null, onStep = null }) {
  const p = 1 - e * e, h = Math.sqrt(p), df = 2 * Math.PI / stepsPerOrbit;
  const rhs = (f, th, s) => { const r = p / (1 + e * Math.cos(f)), fd = h / (r * r), jac = 1 / fd;
    const dmp = damp === 'inst' ? G * (s - fd) / Math.pow(r, 6) : G * (s - 1); return [s * jac, (-K * Math.sin(2 * (th - f)) / (r * r * r) - dmp + N) * jac, jac]; };
  let th = th0, s = s0, t = 0, f = 0;
  for (let o = 0; o < nOrb; o++) {
    for (let k = 0; k < stepsPerOrbit; k++) {
      const a = rhs(f, th, s), b = rhs(f + df / 2, th + df / 2 * a[0], s + df / 2 * a[1]), c = rhs(f + df / 2, th + df / 2 * b[0], s + df / 2 * b[1]), d = rhs(f + df, th + df * c[0], s + df * c[1]);
      th += df * (a[0] + 2 * b[0] + 2 * c[0] + d[0]) / 6; s += df * (a[1] + 2 * b[1] + 2 * c[1] + d[1]) / 6; t += df * (a[2] + 2 * b[2] + 2 * c[2] + d[2]) / 6; f += df;
      if (onStep) onStep(f, th, s, t);
    }
    if (onOrbit) onOrbit(o + 1, th, s, t, f);
  }
  return { th, s, t, f };
}
/** 離心のロックの判定(最後の窓の ⟨s⟩ = Δθ/Δt と δ = θ − f の振れ) */
export function eccLockRow({ e, K, G, N = 0, damp = 'inst', s0 = 1, nOrb, win, stepsPerOrbit = DECL.lock.ecc.stepsPerOrbit }) {
  let th0 = null, t0 = null, dMin = Infinity, dMax = -Infinity;
  const R = spinEcc({ e, K, G, N, damp, s0, nOrb, stepsPerOrbit, onOrbit: (o, th, s, t) => { if (o === nOrb - win) { th0 = th; t0 = t; } },
    onStep: (f, th, s, t) => { if (f > 2 * Math.PI * (nOrb - win)) { const dl = th - f; dMin = Math.min(dMin, dl); dMax = Math.max(dMax, dl); } } });
  const meanS = (R.th - th0) / (R.t - t0), swing = dMax - dMin;
  const ratio = meanS;   // ÷ n(n = 1)
  return { e, K, G, N, damp, s0, meanS: ratio, swing, locked11: Math.abs(ratio - 1) < 1e-3 && swing < Math.PI, near32: Math.abs(ratio - 1.5) < 1e-3 };
}
/** 擬似の同期(K = 0・減衰 inst の一定の自転の釣り合い —— 閉じた式) */
export const pseudoSync = (e) => { const e2 = e * e; return (1 + 7.5 * e2 + 5.625 * e2 * e2 + 0.3125 * e2 * e2 * e2) / ((1 + 3 * e2 + 0.375 * e2 * e2) * Math.pow(1 - e2, 1.5)); };
/** 近点の瞬間の角速度 ÷ n = (1 + e)²/(1 − e²)^{3/2} */
export const fdotPeri = (e) => (1 + e) * (1 + e) / Math.pow(1 - e * e, 1.5);

/* ───────── 実在の天体の表(SI)───────── */
export const G_SI = 6.6743e-11, C_SI = 299792458, YR = 365.25 * 86400;
/** 値の出どころ: csv = paper/data/solar-observations.csv(本・量の行の値の写し)/jov = paper/data/jovian-satellites.csv/lit = 文献の値・未照合(本環境では一次資料に当たっていない) */
export const BODY_SRC = Object.freeze({
  Sun: Object.freeze({ M: [1.9885e30, 'csv'], R: [6.96e8, 'csv'], spin: [2164320, 'csv'], C: [0.070, 'lit'] }),
  Mercury: Object.freeze({ M: [3.3011e23, 'lit'], R: [2.4397e6, 'lit'], spin: [5067014, 'lit'], porb: [7600521.6, 'csv'], aHel: [5.7909e10, 'lit'], e: [0.20563593, 'csv'], C: [0.346, 'lit'] }),
  Venus: Object.freeze({ M: [4.8675e24, 'csv'], R: [6.05e6, 'csv'], spin: [-20997360, 'csv'], porb: [19414166.4, 'csv'], aHel: [1.08208e11, 'csv'], C: [0.33, 'lit'] }),
  Earth: Object.freeze({ M: [5.9722e24, 'lit'], R: [6.371e6, 'lit'], spin: [86164.1, 'lit'], porb: [31558149.7635456, 'csv'], aHel: [1.496e11, 'lit'], C: [0.3307, 'lit'] }),
  Moon: Object.freeze({ M: [7.342e22, 'lit'], R: [1.7374e6, 'lit'], porb: [2360591.559, 'csv'], a: [3.844e8, 'lit'], C: [0.394, 'lit'] }),
  Mars: Object.freeze({ M: [6.4171e23, 'csv'], R: [3389500, 'csv'], spin: [88642.6848, 'csv'], porb: [59355072.0, 'csv'], aHel: [2.2794e11, 'lit'], C: [0.366, 'lit'] }),
  Phobos: Object.freeze({ M: [1.0638e16, 'csv'], R: [11080, 'csv'], porb: [27553.843872, 'csv'], a: [9376000, 'csv'], C: [0.4, 'lit'] }),
  Deimos: Object.freeze({ M: [1.51e15, 'csv'], R: [6270, 'csv'], porb: [109123.2, 'csv'], a: [23463200, 'csv'], C: [0.4, 'lit'] }),
  Jupiter: Object.freeze({ M: [1.898e27, 'jov'], R: [7.1492e7, 'jov'], spin: [35730, 'jov'], porb: [3.7434e8, 'lit'], aHel: [7.7857e11, 'lit'], C: [0.254, 'lit'] }),
  Io: Object.freeze({ M: [8.9319e22, 'lit'], R: [1.8216e6, 'lit'], porb: [152300.0448, 'csv'], a: [4.217e8, 'lit'], C: [0.378, 'lit'] }),
  Europa: Object.freeze({ M: [4.7998e22, 'lit'], R: [1.5608e6, 'lit'], porb: [304600.0032, 'csv'], a: [6.709e8, 'lit'], C: [0.346, 'lit'] }),
  Ganymede: Object.freeze({ M: [1.4819e23, 'lit'], R: [2.6341e6, 'lit'], porb: [618242.8032, 'csv'], a: [1.0704e9, 'lit'], C: [0.311, 'lit'] }),
  Callisto: Object.freeze({ M: [1.0759e23, 'lit'], R: [2.4103e6, 'lit'], porb: [1442054.0160, 'csv'], a: [1.8827e9, 'lit'], C: [0.355, 'lit'] }),
  Pluto: Object.freeze({ M: [1.303e22, 'csv'], R: [1188000, 'csv'], spin: [551854.08, 'csv'], aHel: [5.9064e12, 'lit'], C: [0.4, 'lit'] }),
  Charon: Object.freeze({ M: [1.586e21, 'csv'], R: [606000, 'csv'], porb: [551854.08, 'csv'], a: [19596000, 'csv'], C: [0.4, 'lit'] }),
});
/** 銀河の回転の桁(観測の回転の桁だけ —— 枝 a の読みは使わない。文献の値・未照合): 太陽の位置の銀河の回転の角速度・円運動の速さの二乗 ÷ c₀² */
export const GALAXY = Object.freeze({ omega: 9.09e-16, beta: 5.9e-7, src: '銀河の円運動の速さと太陽の銀河中心からの距離の桁(文献の値・未照合)' });
/**
 * 行: 受け手の天体・状態(locked/notLocked/resonance/star)・固体か気体か・潮汐を起こす相手(perturbers)・外部の軸引きずりの源の候補(sources: 主星の自転・太陽・銀河)。
 * 公転の角速度 n は相手のまわりの公転(衛星)か太陽のまわりの公転(惑星)。
 */
export const BODY_ROWS = Object.freeze([
  Object.freeze({ id: 'Moon', state: 'locked', kind: 'solid', host: 'Earth', perturbers: ['Earth'], sources: ['Earth', 'Sun', 'galaxy'] }),
  Object.freeze({ id: 'Io', state: 'locked', kind: 'solid', host: 'Jupiter', perturbers: ['Jupiter'], sources: ['Jupiter', 'Sun', 'galaxy'] }),
  Object.freeze({ id: 'Europa', state: 'locked', kind: 'solid', host: 'Jupiter', perturbers: ['Jupiter'], sources: ['Jupiter', 'Sun', 'galaxy'] }),
  Object.freeze({ id: 'Ganymede', state: 'locked', kind: 'solid', host: 'Jupiter', perturbers: ['Jupiter'], sources: ['Jupiter', 'Sun', 'galaxy'] }),
  Object.freeze({ id: 'Callisto', state: 'locked', kind: 'solid', host: 'Jupiter', perturbers: ['Jupiter'], sources: ['Jupiter', 'Sun', 'galaxy'] }),
  Object.freeze({ id: 'Phobos', state: 'locked', kind: 'solid', host: 'Mars', perturbers: ['Mars'], sources: ['Mars', 'Sun', 'galaxy'] }),
  Object.freeze({ id: 'Deimos', state: 'locked', kind: 'solid', host: 'Mars', perturbers: ['Mars'], sources: ['Mars', 'Sun', 'galaxy'] }),
  Object.freeze({ id: 'Charon', state: 'locked', kind: 'solid', host: 'Pluto', perturbers: ['Pluto'], sources: ['Pluto', 'Sun', 'galaxy'], mutual: true }),
  Object.freeze({ id: 'Pluto', state: 'locked', kind: 'solid', host: 'Charon', perturbers: ['Charon'], sources: ['Charon', 'Sun', 'galaxy'], mutual: true }),
  Object.freeze({ id: 'Earth', state: 'notLocked', kind: 'solid', host: 'Sun', perturbers: ['Sun', 'Moon'], sources: ['Sun', 'galaxy'] }),
  Object.freeze({ id: 'Venus', state: 'notLocked', kind: 'solid', host: 'Sun', perturbers: ['Sun'], sources: ['Sun', 'galaxy'] }),
  Object.freeze({ id: 'Mars', state: 'notLocked', kind: 'solid', host: 'Sun', perturbers: ['Sun', 'Phobos'], sources: ['Sun', 'galaxy'] }),
  Object.freeze({ id: 'Jupiter', state: 'notLocked', kind: 'gas', host: 'Sun', perturbers: ['Sun', 'Io'], sources: ['Sun', 'galaxy'] }),
  Object.freeze({ id: 'Mercury', state: 'resonance', kind: 'solid', host: 'Sun', perturbers: ['Sun'], sources: ['Sun', 'galaxy'] }),
  Object.freeze({ id: 'Sun', state: 'star', kind: 'gas', host: 'Jupiter', perturbers: ['Jupiter'], sources: ['Jupiter', 'galaxy'] }),
]);
const val = (id, k) => (BODY_SRC[id] && BODY_SRC[id][k] ? BODY_SRC[id][k][0] : null);
/** 天体どうしの距離(衛星と主星は衛星の a・太陽と惑星は惑星の aHel) */
function distOf(a, b) {
  if (a === b) throw new RangeError('distOf: 同じ天体');
  const ra = BODY_ROWS.find((x) => x.id === a), rb = BODY_ROWS.find((x) => x.id === b);
  if (rb && rb.host === a && val(b, 'a')) return val(b, 'a');
  if (ra && ra.host === b && val(a, 'a')) return val(a, 'a');
  if (a === 'Sun') return val(b, 'aHel');
  if (b === 'Sun') return val(a, 'aHel');
  throw new RangeError('distOf: 距離が無い ' + a + '–' + b);
}
const spinOf = (id) => { const sp = val(id, 'spin'); if (sp) return 2 * Math.PI / sp; const po = val(id, 'porb'); return po ? 2 * Math.PI / po : null; };
const helioOf = (id) => { if (val(id, 'aHel')) return val(id, 'aHel'); const r = BODY_ROWS.find((x) => x.id === id); return r && r.host !== 'Sun' ? helioOf(r.host === 'Charon' ? 'Pluto' : r.host) : null; };
/** 1 行の物差し: 潮汐 N_tide = Σ G M_p² R⁵/a⁶(係数はノブ)・外部の軸引きずりの源ごと N_ax/Γ₀ = I β |ω_src − n|(β = G M_src/(d c₀²)・銀河は観測の回転の桁)・ロックへ入る時間 */
export function bodyRow(row, B = DECL.bodies) {
  const id = row.id, M = val(id, 'M'), R = val(id, 'R'), C = val(id, 'C'), I = C * M * R * R;
  const nOrb = 2 * Math.PI / (val(id, 'porb') || val(row.host, 'porb'));   // 自分の公転(衛星・惑星)か相手の公転(冥王星はカロンの公転・太陽は木星の公転)
  const tide = row.perturbers.map((p) => { const a = distOf(id, p), Mp = val(p, 'M'); return { p, a, N: G_SI * Mp * Mp * Math.pow(R, 5) / Math.pow(a, 6) }; });
  const Ntide = tide.reduce((s, x) => s + x.N, 0);
  const ax = row.sources.map((sId) => {
    if (sId === 'galaxy') return { src: 'galaxy', beta: GALAXY.beta, dOmega: Math.abs(GALAXY.omega - nOrb), Nax: I * GALAXY.beta * Math.abs(GALAXY.omega - nOrb) };
    const d = sId === 'Sun' ? helioOf(id) : distOf(id, sId), beta = G_SI * val(sId, 'M') / (d * C_SI * C_SI), wS = spinOf(sId), dOm = Math.abs(wS - nOrb);
    return { src: sId, beta, dOmega: dOm, Nax: I * beta * dOm };
  });
  const NaxSum = ax.reduce((s, x) => s + x.Nax, 0), dom = ax.reduce((a, x) => (x.Nax > a.Nax ? x : a), ax[0]);
  const age = B.ageYr * YR, k2q = row.kind === 'gas' ? B.k2qGas : B.k2qSolid;
  const tDespin = (p0h, kq) => I * Math.abs(2 * Math.PI / (p0h * 3600) - nOrb) / (1.5 * kq * Ntide);
  const kqReq = (p0h) => I * Math.abs(2 * Math.PI / (p0h * 3600) - nOrb) / (1.5 * Ntide * age);
  const sNow = spinOf(id), spinOverN = id === 'Venus' ? -Math.abs(sNow) / nOrb : sNow / nOrb;
  // 補足の向き: 源 src が受け手を回そうとする角速度 c β ω_src(c = 1 − α + f α/2 —— 赤道面・α = 2 の差分の読みで −1 = 逆回転)。銀河は太陽系の軸と 120° —— 射影 cos 120°。
  //   ロック(自転 n)に掛かる符号つきのトルク N/(I Γ₀) = β (c ω_src cosθ − n)。従来の列(c = 1・向きを揃えた |ω_src − n|)は比べる列
  const cosOf = (sId) => (sId === 'galaxy' ? Math.cos(B.galTiltDeg * Math.PI / 180) : 1);
  const signedAt = (f) => { const c = 1 - B.alpha + f * B.alpha / 2; const parts = ax.map((a) => { const wS = a.src === 'galaxy' ? GALAXY.omega : spinOf(a.src); return { src: a.src, n: a.beta * (c * wS * cosOf(a.src) - nOrb) }; });
    const net = parts.reduce((q, x) => q + x.n, 0), absSum = parts.reduce((q, x) => q + Math.abs(x.n), 0); return { f, c, parts, net, X: Ntide / (I * absSum), Xnet: Ntide / (I * Math.abs(net)) }; };
  const readings = B.sideScan.map(signedAt);
  const byRole = (sId) => { const q = sId ? ax.find((x) => x.src === sId) : null; return q ? Ntide / q.Nax : null; };
  return { id, state: row.state, kind: row.kind, mutual: !!row.mutual, M, R, C, I, nOrb, spinOverN, tide, Ntide, ax, NaxSum, dominant: dom.src, X: Ntide / NaxSum, Xdom: Ntide / dom.Nax,
    readings, Xdiff: readings.find((q) => q.f === 0).X, Xfull: readings.find((q) => q.f === 1).X, hostDiff: readings.find((q) => q.f === 0).parts[0].n, hostFull: readings.find((q) => q.f === 1).parts[0].n,
    Xhost: byRole(row.sources[0]), Xsun: row.sources[0] === 'Sun' ? null : byRole(row.sources.includes('Sun') ? 'Sun' : null), Xgal: byRole('galaxy'),
    tDespinYr: tDespin(B.p0Main, k2q) / YR, ageRatio: tDespin(B.p0Main, k2q) / age, kqReq: B.p0h.map((p) => ({ p0h: p, kq: kqReq(p) })),
    e: val(id, 'e'), fdotPeriOverN: val(id, 'e') ? fdotPeri(val(id, 'e')) : null, pseudo: val(id, 'e') ? pseudoSync(val(id, 'e')) : null };
}
/** 境目の読み: 値 key が大きいほどロック側として、ロックしている行の最小 > していない行の最大 なら 1 本で分けられる(帯 = [していない最大, している最小]) */
export function separate(rows, key, lockedSide = 'high') {
  const L = rows.filter((x) => x.state === 'locked').map((x) => x[key]), N = rows.filter((x) => x.state === 'notLocked' || x.state === 'star').map((x) => x[key]);
  if (!L.length || !N.length) return { key, separable: null, band: [null, null], overlap: null, nLocked: L.length, nNot: N.length };
  if (lockedSide === 'high') { const lo = Math.max(...N), hi = Math.min(...L); return { key, separable: hi > lo, band: [lo, hi], overlap: L.filter((v) => v <= lo).length + N.filter((v) => v >= hi).length }; }
  const lo = Math.max(...L), hi = Math.min(...N); return { key, separable: hi > lo, band: [lo, hi], overlap: N.filter((v) => v <= lo).length + L.filter((v) => v >= hi).length };
}
export function bodyTable(B = DECL.bodies) {
  const rows = BODY_ROWS.map((r) => bodyRow(r, B));
  // 単一の k₂/Q(固体と気体を分けない)で「ロックへ入る時間 < 年齢」が分けられるか —— 要る k₂/Q(大きいほどロックしやすい)
  const kq = B.p0h.map((p) => { const rr = rows.map((x) => Object.assign({}, x, { kqNeed: x.kqReq.find((q) => q.p0h === p).kq }));
    const one = separate(rr, 'kqNeed', 'low'), solid = separate(rr.filter((x) => x.kind === 'solid'), 'kqNeed', 'low');
    const gasNot = rr.filter((x) => x.kind === 'gas').map((x) => x.kqNeed);
    return { p0h: p, one, solid, gasMinNeed: Math.min(...gasNot) }; });
  const scan = B.k2qScan.map((kqv) => ({ kq: kqv, wrong: rows.filter((x) => x.state !== 'resonance').filter((x) => { const need = x.kqReq.find((q) => q.p0h === B.p0Main).kq, pred = kqv >= need; return pred !== (x.state === 'locked'); }).map((x) => x.id) }));
  const sepOf = (key) => { const rr = rows.filter((x) => x[key] !== null); return Object.assign(separate(rr, key, 'high'), { n: rr.length }); };
  const sepRead = B.sideScan.map((f) => { const rr = rows.map((x) => Object.assign({}, x, { Xf: x.readings.find((q) => q.f === f).X, Xn: x.readings.find((q) => q.f === f).Xnet })); return { f, c: 1 - B.alpha + f * B.alpha / 2, sep: separate(rr, 'Xf', 'high'), sepNet: separate(rr, 'Xn', 'high') }; });
  return { rows, sepRead, sepX: sepOf('X'), sepXdom: sepOf('Xdom'), sepXhost: sepOf('Xhost'), sepXsun: sepOf('Xsun'), sepXgal: sepOf('Xgal'), sepTide: sepOf('Ntide'), kq, scan };
}

/* ───────── 補足 2: 分類を目標の列にした 3 つの比 ───────── */
/** 目標の分類(原仮定者の補足(2026-11-14 —— 第138報の補足 2)): 主要な衛星 = 潮汐ロック/水星 = 太陽が強い/金星 = 太陽と銀河の釣り合い(+ 地球)/ほかの惑星 = 銀河の側。太陽は分類の外 */
export const CLASS_TARGET = Object.freeze({ Moon: 'lock', Io: 'lock', Europa: 'lock', Ganymede: 'lock', Callisto: 'lock', Phobos: 'lock', Deimos: 'lock', Charon: 'lock', Pluto: 'lock',
  Mercury: 'sun', Venus: 'balance', Earth: 'galaxy', Mars: 'galaxy', Jupiter: 'galaxy' });
/**
 * 軸引きずりの角速度の閉じた形(補足 2 の読み —— 遠方宇宙の静止を補う重み・源の取り分 f が小さい側): ω = (α − 1) s f × 向き。
 *   太陽: 太陽の自転と逆回転(−)・f_☉(d) = f₁ (1 AU/d)^α。銀河: 180° の軸 —— 太陽系の中では順行の向き・黄道の北極への射影 +0.5・取り分 f_g は太陽系の中で一定。
 *   比 R(d) = |ω_☉|/|ω_g| = Q (1 AU/d)^α(Q = f₁ s_☉/(0.5 Ω_g f_g) —— ノブ)。金星で釣り合う置き方 Q = (d_金星/1 AU)^α → R(d) = (d_金星/d)^α。
 * 分類の予測: 潮汐 N_tide/I > T_g max(1, R) なら lock(T_g = Γ₀ |ω_g| —— ノブ)・そうでなければ R > tol → sun・R < 1/tol → galaxy・間は balance。
 */
export function classTable(C = DECL.classify) {
  const rows = BODY_ROWS.filter((r) => CLASS_TARGET[r.id]).map((r) => { const b = bodyRow(r), dS = helioOf(r.id); return { id: r.id, target: CLASS_TARGET[r.id], dAU: dS / C.au, tideI: b.Ntide / b.I, Ntide: b.Ntide, I: b.I }; });
  const dV = helioOf('Venus') / C.au, out = [];
  for (const alpha of C.alphas) {
    const Rof = (d) => Math.pow(dV / d, alpha);
    const z = rows.map((x) => Object.assign({}, x, { R: Rof(x.dAU), score: x.tideI / Math.max(1, Rof(x.dAU)) }));
    const L = z.filter((x) => x.target === 'lock').map((x) => x.score), N = z.filter((x) => x.target !== 'lock').map((x) => x.score);
    const lo = Math.max(...N), hi = Math.min(...L), sepLock = hi > lo, Tg = sepLock ? Math.sqrt(lo * hi) : null;
    for (const tol of C.tols) {
      const pred = z.map((x) => { const lock = Tg !== null && x.score > Tg; const c = lock ? 'lock' : x.R > tol ? 'sun' : x.R < 1 / tol ? 'galaxy' : 'balance'; return { id: x.id, target: x.target, R: x.R, score: x.score, pred: c, ok: c === x.target }; });
      out.push({ alpha, tol, Tg, lockBand: [lo, hi], sepLock, nOk: pred.filter((q) => q.ok).length, n: pred.length, wrong: pred.filter((q) => !q.ok).map((q) => q.id + '→' + q.pred), rows: pred });
    }
  }
  // 金星に地球が与える潮汐のトルクの物差し(最接近 0.277 AU)と太陽の潮汐の比
  const V = bodyRow(BODY_ROWS.find((r) => r.id === 'Venus')), R = val('Venus', 'R'), dEV = C.earthVenusMinAU * C.au;
  const NEV = G_SI * Math.pow(val('Earth', 'M'), 2) * Math.pow(R, 5) / Math.pow(dEV, 6);
  const venusEarth = { NEarth: NEV, NSun: V.Ntide, ratio: NEV / V.Ntide, dMinAU: C.earthVenusMinAU };
  return { rows, out, venusEarth, dVenusAU: dV };
}

/* ───────── T3 角運動量の帳簿(自転 2 つ + 相対の軌道 —— 平面)───────── */
/**
 * 状態 [x, y, w_x, w_y, θ₁, s₁, θ₂, s₂](G = 1・M = 1・μ = η)。潮汐のトルク N_t,i = −K_i r⁻³ sin 2(θ_i − f) − Γ_i r⁻⁶ (s_i − ḟ)。
 * 反作用(react): 相対の軌道に接線の加速度 a_t = −(N_t,1 + N_t,2)/(η r)(dL_orb/dt = −Σ N_t)。外部のトルク N_ext,i は自転にだけ。
 */
export function ledgerRun({ eta, e = 0, I1, I2, K1, K2, G1, G2, N1, N2 = 0, react = true, nOrb, stepsPerOrbit, d1 = 0, d2 = 0, s1 = null, s2 = null }) {
  const P = 2 * Math.PI, h = P / stepsPerOrbit, st = new Float64Array(8), k1 = new Float64Array(8), k2 = new Float64Array(8), k3 = new Float64Array(8), k4 = new Float64Array(8), tmp = new Float64Array(8);
  st[0] = 1 - e; st[1] = 0; st[2] = 0; st[3] = Math.sqrt((1 + e) / (1 - e));
  const fd0 = st[3] / st[0];
  st[4] = d1; st[5] = s1 === null ? fd0 : s1; st[6] = d2; st[7] = s2 === null ? fd0 : s2;
  const F = (s, o) => { const x = s[0], y = s[1], wx = s[2], wy = s[3], r2 = x * x + y * y, r = Math.sqrt(r2), r3 = r2 * r, f = Math.atan2(y, x), fd = (x * wy - y * wx) / r2;
    const r6 = r3 * r3, Nt1 = -K1 / r3 * Math.sin(2 * (s[4] - f)) - G1 / r6 * (s[5] - fd), Nt2 = -K2 / r3 * Math.sin(2 * (s[6] - f)) - G2 / r6 * (s[7] - fd);
    const at = react ? -(Nt1 + Nt2) / (eta * r) : 0;
    o[0] = wx; o[1] = wy; o[2] = -x / r3 + at * (-y / r); o[3] = -y / r3 + at * (x / r); o[4] = s[5]; o[5] = (Nt1 + N1) / I1; o[6] = s[7]; o[7] = (Nt2 + N2) / I2; return o; };
  const J = (s) => eta * (s[0] * s[3] - s[1] * s[2]) + I1 * s[5] + I2 * s[7];
  const L = (s) => eta * (s[0] * s[3] - s[1] * s[2]);
  const aOf = (s) => 1 / (2 / Math.hypot(s[0], s[1]) - (s[2] * s[2] + s[3] * s[3]));
  const eOf = (s) => { const x = [s[0], s[1], 0], v = [s[2], s[3], 0]; return orbitOfState(x, v, 1).e; };
  const J0 = J(st), ts = [], Ls = [], as = [], es = [], S1s = [], S2s = [];
  let resMax = 0;
  const nAll = nOrb * stepsPerOrbit, every = Math.max(1, Math.round(stepsPerOrbit / 50));
  const rec = (t) => { ts.push(t); Ls.push(L(st)); as.push(aOf(st)); es.push(eOf(st)); S1s.push(I1 * st[5]); S2s.push(I2 * st[7]); resMax = Math.max(resMax, Math.abs(J(st) - J0 - (N1 + N2) * t)); };
  rec(0);
  for (let k = 1; k <= nAll; k++) {
    F(st, k1); for (let j = 0; j < 8; j++) tmp[j] = st[j] + 0.5 * h * k1[j]; F(tmp, k2); for (let j = 0; j < 8; j++) tmp[j] = st[j] + 0.5 * h * k2[j]; F(tmp, k3);
    for (let j = 0; j < 8; j++) tmp[j] = st[j] + h * k3[j]; F(tmp, k4); for (let j = 0; j < 8; j++) st[j] += h * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j]) / 6;
    if (k % every === 0) rec(k * h);
  }
  const T = nAll * h, Ntot = N1 + N2, Ldot = slopeOf(ts, Ls), adot = slopeOf(ts, as), edot = slopeOf(ts, es), S1dot = slopeOf(ts, S1s), S2dot = slopeOf(ts, S2s);
  return { T, Ldot, adot, edot, S1dot, S2dot, fOrb: Ntot !== 0 ? Ldot / Ntot : null, fSpin: Ntot !== 0 ? (S1dot + S2dot) / Ntot : null, resRel: Ntot !== 0 ? resMax / Math.abs(Ntot * T) : resMax, L0: Ls[0], a0: as[0], e0: es[0], spinSlip1: st[5] - (st[0] * st[3] - st[1] * st[2]) / (st[0] * st[0] + st[1] * st[1]) };
}
/** 円・ロックの閉じた式: L̇ = Σ N_ext / (1 − 3σ)(σ = (I₁ + I₂) n / L)・ṅ = −3 n L̇/L・ȧ = 2 a L̇/L */
export const ledgerClosed = ({ sigma, Ntot, L, n = 1, a = 1 }) => { const f = 1 / (1 - 3 * sigma), Ld = f * Ntot; return { fOrb: f, fSpin: 1 - f, Ldot: Ld, ndot: -3 * n * Ld / L, adot: 2 * a * Ld / L }; };
export function ledgerRow({ sigma, kTil, gTil, e = 0, react = true, nu = DECL.ledger.nu, D = DECL.ledger }) {
  const eta = D.eta, L0 = eta * Math.sqrt(1 - e * e), Itot = sigma * L0, I1 = D.split * Itot, I2 = (1 - D.split) * Itot, N1 = nu * I1;
  const K1 = kTil * I1, K2 = kTil * I2, G1 = gTil * I1, G2 = gTil * I2;
  const d1 = K1 > 0 ? 0.5 * Math.asin(Math.max(-1, Math.min(1, N1 / K1))) : 0, s1 = K1 === 0 && G1 > 0 && e === 0 ? 1 + N1 / G1 : null;
  const R = ledgerRun({ eta, e, I1, I2, K1, K2, G1, G2, N1, react, nOrb: D.nOrb, stepsPerOrbit: D.stepsPerOrbit, d1, s1 });
  const cf = e === 0 ? ledgerClosed({ sigma, Ntot: N1, L: L0 }) : null;
  return { sigma, kTil, gTil, e, react, nu, fOrb: R.fOrb, fSpin: R.fSpin, Ldot: R.Ldot, adot: R.adot, edot: R.edot, ndot: -1.5 * R.adot, resRel: R.resRel, cf, dfOrb: cf ? R.fOrb - cf.fOrb : null, dAdot: cf ? R.adot - cf.adot : null };
}
/** 層の模型(層 k の慣性 1・隣どうしの結合 c(ω_{k+1} − ω_k)・外部のトルク N を層 1 に)—— 閉じた式: 遅れ Σ = N (n_L − 1)/(2c)・時定数 1/λ(λ = 2c(1 − cos(π/n_L))) */
export function layerRow({ nL, c, N = DECL.layers.N }) {
  const lamCf = 2 * c * (1 - Math.cos(Math.PI / nL)), T = 30 / lamCf, h = Math.min(0.05, 0.1 / (4 * c)), nS = Math.round(T / h);
  let w = new Float64Array(nL); const f = (u) => { const o = new Float64Array(nL); for (let k = 0; k < nL; k++) { let tq = k === 0 ? N : 0; if (k > 0) tq += c * (u[k - 1] - u[k]); if (k < nL - 1) tq += c * (u[k + 1] - u[k]); o[k] = tq; } return o; };
  const lagInf = N * (nL - 1) / (2 * c), ts = [], ls = [];
  for (let s = 1; s <= nS; s++) {
    const a = f(w), b = f(w.map((v, k) => v + 0.5 * h * a[k])), cc = f(w.map((v, k) => v + 0.5 * h * b[k])), d = f(w.map((v, k) => v + h * cc[k]));
    w = w.map((v, k) => v + h * (a[k] + 2 * b[k] + 2 * cc[k] + d[k]) / 6);
    const lag = w[0] - w[nL - 1], rr = Math.abs(lag - lagInf) / lagInf; if (rr < 1e-2 && rr > 1e-8) { ts.push(s * h); ls.push(Math.log(Math.abs(lag - lagInf))); }
  }
  const lam = ts.length > 5 ? -slopeOf(ts, ls) : null, rateIn = f(w)[nL - 1], rate = N / nL;
  return { nL, c, lagInf, lag: w[0] - w[nL - 1], lamCf, lam, tau: lam ? 1 / lam : null, tauCf: 1 / lamCf, innerRateShare: rateIn / rate, errLag: Math.abs((w[0] - w[nL - 1]) - lagInf) / lagInf, relLam: lam ? Math.abs(lam - lamCf) / lamCf : null };
}

/* ───────── T4 同期の 3 列と秤動 ───────── */
/** 1 公転の写像(真近点角で積分 —— 復元 K r⁻³ sin 2(θ − f)・減衰 Γ r⁻⁶ (s − ḟ)・δ = θ − f の周期の解)。samples: 一様な f の点の s */
function libMap(e, K, G, d0, s0, N, wantSamples = false) {
  const p = 1 - e * e, h = Math.sqrt(p), df = 2 * Math.PI / N, out = wantSamples ? new Float64Array(N) : null;
  const rhs = (f, d, s) => { const r = p / (1 + e * Math.cos(f)), fd = h / (r * r), jac = 1 / fd; return [(s - fd) * jac, (-K * Math.sin(2 * d) / (r * r * r) - G * (s - fd) / Math.pow(r, 6)) * jac]; };
  let d = d0, s = s0, f = 0;
  for (let k = 0; k < N; k++) {
    if (out) out[k] = s;
    const a = rhs(f, d, s), b = rhs(f + df / 2, d + df / 2 * a[0], s + df / 2 * a[1]), c = rhs(f + df / 2, d + df / 2 * b[0], s + df / 2 * b[1]), q = rhs(f + df, d + df * c[0], s + df * c[1]);
    d += df * (a[0] + 2 * b[0] + 2 * c[0] + q[0]) / 6; s += df * (a[1] + 2 * b[1] + 2 * c[1] + q[1]) / 6; f += df;
  }
  return { d, s, samples: out };
}
/** 周期の解(射撃 —— ニュートン・差分のヤコビアン)。K = 0 なら δ は不定(s だけ —— 1 次元)。戻り値 { d0, s0, ok, res } */
export function periodicSpin(e, K, G, guess, D = DECL.libr) {
  const N = D.nQuad;
  if (K === 0) {
    if (G === 0) return { d0: 0, s0: 1, ok: true, res: 0, free: true };
    // s の写像は 1 次元の線形(s₁ = A s₀ + B)—— 2 点で解く
    const m0 = libMap(e, 0, G, 0, 0, N).s, m1 = libMap(e, 0, G, 0, 1, N).s, A = m1 - m0, s0 = m0 / (1 - A), res = Math.abs(libMap(e, 0, G, 0, s0, N).s - s0);
    return { d0: 0, s0, ok: res < 1e-10, res };
  }
  let d = guess.d0, s = guess.s0, res = Infinity;
  for (let it = 0; it < D.newtonIter; it++) {
    const m = libMap(e, K, G, d, s, N), F0 = [m.d - d, m.s - s]; res = Math.hypot(F0[0], F0[1]);
    if (res < D.newtonTol) break;
    const hd = 1e-7, md = libMap(e, K, G, d + hd, s, N), ms = libMap(e, K, G, d, s + hd, N);
    const J = [[(md.d - (d + hd) - F0[0]) / hd, (ms.d - d - F0[0]) / hd], [(md.s - s - F0[1]) / hd, (ms.s - (s + hd) - F0[1]) / hd]];
    const det = J[0][0] * J[1][1] - J[0][1] * J[1][0]; if (!isFin(det) || det === 0) break;
    let dd = -(J[1][1] * F0[0] - J[0][1] * F0[1]) / det, ds = -(-J[1][0] * F0[0] + J[0][0] * F0[1]) / det;
    const sc = Math.min(1, 0.5 / Math.max(Math.abs(dd), Math.abs(ds), 1e-300)); d += sc * dd; s += sc * ds;
  }
  return { d0: d, s0: s, ok: res < 1e-9, res };
}
/** 求積: Δ(要素) = ∮ ∇_w(要素)·dd(真近点角 f の一様な点 —— 中心差分 4 次)。d(ε = 1 あたり)= −10 ṙ/r r̂ + 10 (s(f) − ḟ) φ̂。戻り値 { dvarpi, de, da, share } */
export function secularOfSpin(e, sOfF, D = DECL.libr) {
  const N = sOfF.length, p = 1 - e * e, h = Math.sqrt(p), df = 2 * Math.PI / N;
  const X = [], Wv = [], dv = [];
  for (let k = 0; k < N; k++) { const f = k * df, K = kepAt(e, f), rh = [Math.cos(f), Math.sin(f), 0], ph = [-Math.sin(f), Math.cos(f), 0];
    X.push(scl(rh, K.r)); Wv.push(add(scl(rh, K.rdot), scl(ph, K.r * K.fdot))); dv.push(add(scl(rh, -10 * K.rdot / K.r), scl(ph, 10 * (sOfF[k] - K.fdot)))); }
  const el = (x, w) => { const o = orbitOfState(x, w, 1); return [Math.atan2(o.P[1], o.P[0]), o.e, o.a]; };
  const acc = [0, 0, 0], hs = D.fdStep;
  for (let j = 0; j < N; j++) {
    const jm2 = (j - 2 + N) % N, jm1 = (j - 1 + N) % N, jp1 = (j + 1) % N, jp2 = (j + 2) % N;
    const dd = [0, 1, 2].map((k) => (-dv[jp2][k] + 8 * dv[jp1][k] - 8 * dv[jm1][k] + dv[jm2][k]) / 12);   // dd/df × df
    const x = X[j], v = Wv[j];
    for (let k = 0; k < 2; k++) { const wp = v.slice(), wm = v.slice(); wp[k] += hs; wm[k] -= hs; const ep = el(x, wp), em = el(x, wm);
      const g = [wrapPi(ep[0] - em[0]) / (2 * hs), (ep[1] - em[1]) / (2 * hs), (ep[2] - em[2]) / (2 * hs)]; for (let m = 0; m < 3; m++) acc[m] += g[m] * dd[k]; }
  }
  return { dvarpi: acc[0], de: acc[1], da: acc[2], share: acc[0] / (6 * Math.PI / (1 - e * e)) };
}
/** 端の列(瞬間の同期 s = ḟ・平均の同期 s = n)の求積 */
export function endShares(e, D = DECL.libr) {
  const N = D.nQuad, fdots = Float64Array.from({ length: N }, (_, k) => kepAt(e, 2 * Math.PI * k / N).fdot), ones = new Float64Array(N).fill(1);
  return { instant: secularOfSpin(e, fdots, D), mean: secularOfSpin(e, ones, D) };
}
/** K の梯子(0 から上へ —— 前の解を次の初期値に)で、宣言の K の点の周期の解と求積 */
export function librTable(D = DECL.libr) {
  const rows = [], ends = [];
  const Kmax = Math.max(...D.K), ladder = []; for (let k = 0; -2 + k / D.ladderPerDecade <= Math.log10(Kmax) + 1e-9; k++) ladder.push(Math.pow(10, -2 + k / D.ladderPerDecade));
  for (const e of D.e) {
    const E = endShares(e, D); ends.push({ e, instant: E.instant, mean: E.mean });
    for (const G of D.gamma) {
      const sol0 = periodicSpin(e, 0, G, null, D); let g = { d0: 0, s0: sol0.s0 };
      const sols = new Map([[0, sol0]]);
      for (const K of ladder) { const sl = periodicSpin(e, K, G, g, D); if (sl.ok) { g = { d0: sl.d0, s0: sl.s0 }; } sols.set(Number(K.toPrecision(12)), sl); }
      for (const K of D.K) {
        const key = K === 0 ? 0 : Number(K.toPrecision(12)); let sl = sols.get(key);
        if (!sl) sl = periodicSpin(e, K, G, g, D);
        if (!sl.ok && K > 0) for (const s0 of [1, fdotPeri(e)]) { const t2 = periodicSpin(e, K, G, { d0: 0, s0 }, D); if (t2.ok) { sl = Object.assign(t2, { fallback: s0 }); break; } }   // 梯子で解けない点は初期値 2 つを試す(n・近点の ḟ)
        if (!sl.ok) { rows.push({ e, K, G, ok: false, free: false, fallback: null, res: sl.res, d0: null, s0: null, sMean: null, sSwing: null, share: null, dvarpi: null, de: null, da: null, dPoverP: null, x: null }); continue; }
        const smp = libMap(e, K, G, sl.d0, sl.s0, D.nQuad, true).samples, Q = secularOfSpin(e, smp, D);
        let sMin = Infinity, sMax = -Infinity, sMean = 0; for (const v of smp) { sMin = Math.min(sMin, v); sMax = Math.max(sMax, v); }
        // ⟨s⟩ は時間の平均(dt = r²/h df)
        { const p = 1 - e * e, h = Math.sqrt(p); let tt = 0, ss = 0; for (let k = 0; k < smp.length; k++) { const r = p / (1 + e * Math.cos(2 * Math.PI * k / smp.length)), w = r * r / h; tt += w; ss += w * smp[k]; } sMean = ss / tt; }
        const x = (Q.share - E.instant.share) / (E.mean.share - E.instant.share);
        rows.push({ e, K, G, ok: sl.ok, free: !!sl.free, fallback: sl.fallback === undefined ? null : sl.fallback, res: sl.res, d0: sl.d0, s0: sl.s0, sMean, sSwing: sMax - sMin, share: Q.share, dvarpi: Q.dvarpi, de: Q.de, da: Q.da, dPoverP: 1.5 * Q.da, x });
      }
    }
  }
  return { rows, ends };
}
/** 通過の角の同時発展(相対の軌道 ẋ = w + ε d・ẇ = −x/r³ と自転の連立 —— 8 公転)。近点の通過(x·ẋ が負から非負)の角の傾き ÷ [6πε/(1 − e²)] */
export function passRun({ e, K, G, eps, nOrb, steps, d0, s0 }) {
  const run = (on) => {
    const h = 2 * Math.PI / steps, S = new Float64Array(6), tmp = new Float64Array(6), k1 = new Float64Array(6), k2 = new Float64Array(6), k3 = new Float64Array(6), k4 = new Float64Array(6);
    const F = (s, o) => { const x = s[0], y = s[1], wx = s[2], wy = s[3], r2 = x * x + y * y, r = Math.sqrt(r2), r3 = r2 * r, f = Math.atan2(y, x), rd = (x * wx + y * wy) / r, fd = (x * wy - y * wx) / r2;
      const dr = on ? -10 * eps * rd / r : 0, dt = on ? 10 * eps * (s[5] - fd) : 0, rx = x / r, ry = y / r;
      o[0] = wx + dr * rx - dt * ry; o[1] = wy + dr * ry + dt * rx; o[2] = -x / r3; o[3] = -y / r3; o[4] = s[5]; o[5] = -K / r3 * Math.sin(2 * (s[4] - f)) - G / (r3 * r3) * (s[5] - fd); return o; };
    S[0] = 1 - e; S[1] = 0; S[2] = 0; S[3] = Math.sqrt((1 + e) / (1 - e)); S[4] = d0; S[5] = s0;
    { F(S, k1); S[2] -= k1[0] - S[2]; S[3] -= k1[1] - S[3]; }   // 接触の速度を無摂動のケプラーの速度に(一次)
    const step = (src, dst, tau) => { F(src, k1); for (let j = 0; j < 6; j++) tmp[j] = src[j] + 0.5 * tau * k1[j]; F(tmp, k2); for (let j = 0; j < 6; j++) tmp[j] = src[j] + 0.5 * tau * k2[j]; F(tmp, k3);
      for (let j = 0; j < 6; j++) tmp[j] = src[j] + tau * k3[j]; F(tmp, k4); for (let j = 0; j < 6; j++) dst[j] = src[j] + tau * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j]) / 6; };
    const gOf = (s) => { F(s, k4); return s[0] * k4[0] + s[1] * k4[1]; };
    const pass = [], prev = new Float64Array(6), probe = new Float64Array(6);
    let gNow = gOf(S); const nAll = Math.round((nOrb + 0.25) * steps);
    for (let k = 1; k <= nAll; k++) {
      prev.set(S); const gPrev = gNow; step(prev, S, h); gNow = gOf(S);
      if (gPrev < 0 && gNow >= 0) { let ta = 0, tb = h; for (let it = 0; it < 60; it++) { const tc = 0.5 * (ta + tb); step(prev, probe, tc); if (gOf(probe) < 0) ta = tc; else tb = tc; } step(prev, probe, 0.5 * (ta + tb)); pass.push({ t: (k - 1) * h + 0.5 * (ta + tb), ang: Math.atan2(probe[1], probe[0]) }); }
    }
    return pass;
  };
  const on = run(true), off = run(false), n = Math.min(on.length, off.length, nOrb);
  const idx = Array.from({ length: n }, (_, j) => j), da = []; let acc = 0;
  for (let j = 0; j < n; j++) { const d = wrapPi(on[j].ang - off[j].ang); if (j > 0) { let dd = d - da[j - 1]; while (dd > Math.PI) dd -= 2 * Math.PI; while (dd < -Math.PI) dd += 2 * Math.PI; acc = da[j - 1] + dd; da.push(acc); } else da.push(d); }
  const aps = slopeOf(idx, da), dtm = slopeOf(idx, on.slice(0, n).map((q, j) => q.t - off[j].t));
  return { nPass: n, aps, share: aps / (6 * Math.PI * eps / (1 - e * e)), dPanom: dtm / (2 * Math.PI) };
}

/* ───────── 純関数の場面(lint の検査 —— 閉じた式の点)───────── */
export function pureScenes() {
  const f1 = frameRow({ q: 0.5, e: 0, phase: 0.3, mode: 'circ', i: 0, selfRatio: 1, w0Ratio: 0 });
  const f2 = frameRow({ q: 0.5, e: 0.3, phase: 1.1, mode: 'instant', i: 1, selfRatio: 1, w0Ratio: 0 });
  const f3 = frameRow({ q: 0.5, e: 0.3, phase: 1.1, mode: 'mean', i: 1, selfRatio: 1, w0Ratio: 1 });
  const en = energyRow({ q: 0.3, e: 0.2, phase: 0.9 });
  const lk = lockRow({ K: 1, G: 1, N: 0.5 }), nl = lockRow({ K: 1, G: 1, N: 1.5 });
  const lc = ledgerClosed({ sigma: 0.1, Ntot: 1, L: 1 });
  const ps0 = pseudoSync(0), fp = fdotPeri(0.2056);
  return { f1, f2, f3, en, lk, nl, lc, ps0, fp };
}
export function pureGates(S) {
  return {
    circNull: S.f1.errFrame < 1e-14 && Math.abs(S.f1.radA) < 1e-14 && Math.abs(S.f1.tanA) < 1e-14 && S.f1.rotB > 0.1,
    instantRadial: S.f2.errFrame < 1e-14 && Math.abs(S.f2.tanA) < 1e-14 && Math.abs(S.f2.radA) > 1e-3,
    meanTangent: Math.abs(S.f3.tanA) > 1e-3 && S.f3.errCov < 1e-14 && S.f3.diffNaive > 1e-3 && S.f3.errNaiveCf < 1e-14,
    energy: S.en.err < 1e-14,
    lockInside: S.lk.locked && S.lk.pred && S.lk.errDstar < 1e-8,
    lockOutside: !S.nl.locked && !S.nl.pred,
    ledgerClosed: Math.abs(S.lc.fOrb - 1 / 0.7) < 1e-15,
    pseudoZero: S.ps0 === 1,
    mercuryPeri: Math.abs(S.fp - 1.5507) < 1e-3,
  };
}
export { secularTable };
