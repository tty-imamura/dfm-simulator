// 第335便d(原仮定者の補足(2026-11-12)「自転軸の傾きで引きずりの効果が大きく変わるので、連星での自転軸の傾きの組み合わせは、ノブになる」
//   「互いに潮汐ロックしている連星は、『距離の変化による並進引きずり』以外の、相互の引きずりが消える。ただし、遠方宇宙に対する慣性移動は消えないので、互いに周回する」・
//   原仮定者の回答(2026-11-12 —— AN660 = A 残差の族を走行の前に宣言・設計の系と検証の系を分ける/AN661 傾きの組み合わせはノブ —— 同じ軸の組で複数の量を見る・量ごとに別の軸を選ばない/
//   AN662 = A 重心の自己加速と周期/AN663 = A 近点の定義は 1 つ —— 近点の通過の角を主・接触の要素の窓の平均は補助の列/AN664 = A パルサーには回転の分をそのまま当てない/AN650 = A 座標変換の基準は観測自転)・
//   統括の検証項目 R331): **連星の同期の型(円・相互同期/離心・瞬間の同期/離心・平均の同期)・一周の平均の永年の効き(求積)・近点の通過の角の二体の同時発展・残差の族 G1〜G3 の判定・
//   自転軸の傾きの組み合わせの格子(ノブ —— 同じ軸の組の 1 行に複数の量)・重心の自己加速と周期の純関数**
//   (器 tests/exp-w335d-binarytilt.mjs と QA lint.binaryTilt335d・behavior.binaryTilt335d が読む —— html を読まない・状態を持たない・第334便d・第333便c の lib は呼ぶだけ・エンジンの式を写さない)。
//   出どころの型は統括の参考の試作(瞬間の同期と平均の同期の照合 —— 今のコードを読んで書き直した)。
//
// ■ 区別(各表・各式に付ける —— 作業仮説と今のコードの実装を混ぜない)
//   実装 = 今の beta の html にある型(G_loc の受け手 n = 2・K1 の並進の一次)/診断 = この lib の求積・同時発展・族の判定/
//   宣言(未接続)= 今のエンジンに無い型(並進引きずりの回転の分〔源の観測自転 s の座標の回転 —— α = 1・自己の半径 R = Y_k m で β は K1 と同じ係数〕・瞬間の同期の自転・対称の G_loc)。
// ■ 用語(原仮定者の補足(2026-11-12)—— 本便から恒久)
//   距離の変化による並進引きずり = 並進引きずりの相対の速度のうち動径の成分(−ṙ r̂ —— 今の K1 の並進の分に含まれている・別の項として足さない)。
//   ロックした連星: 軸一致で源の座標の角速度 Ω のとき C_{j→i} − v_i = −ṙ r̂ + r(Ω − ḟ) φ̂(r̂ = (p_i − p_j)/r・φ̂ = ẑ × r̂・ḟ は r̂ の回る角速度)——
//   瞬間の角速度への同期(Ω = ḟ(t)): 動径の分 −ṙ r̂ だけ/平均の角速度への同期(Ω = n): 離心軌道で接線の r(n − ḟ) も残る/円・相互同期: 0。
//   これは座標変換の部分の条件付きの恒等式 —— 空間の捩れ(回転引きずり)や受け手の有限の大きさの回転の応答まで同期だけで 0 とは言わない。
//   遠方宇宙に対する慣性移動は U = v + d の v として残る(d が消えても v は残るので互いに周回する —— 自己を運ぶ式の lib は第335便b)。
// ■ (1) 同期の型(syncTypeTable —— 第334便d の syncCase を呼ぶ・瞬間の同期は syncCase の非同期の操作に ḟ(位相)/n を渡す): 残る d の動径と接線の成分を閉じた式 −β ṙ・β r(Ω − ḟ)
//   (β = w/(W_ii + w) = 1/(1 + W_ii/w) —— 自己の重みの比から独立に)と照合。
// ■ (2) 一周の平均の永年の効き(secularQuad —— 求積・一次): 速度の型 ẋ = v + d では接触の速度 w = v + d の軌道に摂動の力 ḋ(軌道に沿う時間微分)が働く —— 1 公転の要素の変化 = ∮ ∇_w(要素)·ḋ dt
//   (ケプラーの軌道に沿う求積・∇_w は orbitOfState の中心差分・ḋ は周期の 4 次の中心差分)。相対の d(二体 —— β_12 + β_21 = 10ε/r の和): 動径 −(10ε/r) ṙ r̂・接線(ḟ の分)−10ε ḟ φ̂・接線(Ω の分)+10ε Ω φ̂。
//   K1 の並進 = 動径 + 接線(ḟ の分)(第331便c の +5/3 = 動径 −5/3 + 接線 +10/3 の照らし)/瞬間の同期 = 動径だけ/平均の同期 = K1 + 接線(Ω = n の分)。
// ■ (3) 二体の同時発展(runPair —— 両方の天体を動かす RK4・第334便d の twoBody と同じ力と速度の型〔受け手/対称の G_loc・K1 の並進の二体版・並進引きずりの回転の分〕に、瞬間の同期の自転
//   〔s_1 = s_2 = (Δ × Δv)/r² —— 正準の速度から〕を足す): **近点の定義の主 = 近点の通過の角**(相対の距離の極小 Δ·Δẋ = 0 の時刻を刻みの内で解き〔RK4 の部分の刻みと割線〕、初期の面の基底での角)・
//   **補助 = 接触の要素の公転ごとの窓の平均**(第334便d の定義)。周期は通過の時刻の間隔(近点の周期・主)と平均経度の率(補助)。面(L̂ の率)・e の率・E と L・重心は窓の平均。
// ■ (4) 残差の族(走行の前に DECL.law に宣言 —— AN660): δ = ρ − ρ₁(ρ は通過の角の定義)に G1: ε a/(1 − e²)^k・G2: ε(a + b e²)/(1 − e²)^k・G3: ε(a + b e² + c η)/(1 − e²)^k を設計の系で当て
//   (k は {1, 3/2, 2, 5/2, 3} から設計の系の二乗の和の最小で選ぶ)、検証の系の全点で |予測 − 同時発展| ≤ max(5%·|δ|, ε) なら「法則と呼ぶ」。簡単な族から(G1 → G2 → G3)。
// ■ (5) 自転軸の傾きの組み合わせ(tiltPair —— 天体 1 の軸の全部 × 天体 2 の関係 4 つ —— 宣言した間引き): 並進引きずりの回転の分(観測自転・α = 1・R = Y_k m)。1 つの軸の組の 1 行に
//   近点の残差 ρ(通過の角)・周期・L̂ の率・e の率・重心・E と L を並べる。フィットはしない(格子の表)。
// ■ 言わないこと: 連星の観測と比べた結果ではない。同期の型の 0 は座標変換の部分の条件付きの恒等式。一次の式(入れた式)を発見と呼ばない。傾きの格子で残差が消えたことを解決と呼ばない。
import { syncCase, twoBody, massesOfEta, firstShare, cmKickPerOrbit, tiltAxis, orbitOfState, vec } from './lib-w334d-binarylaw.mjs';
import { stateAt } from './lib-w333c-mercury3d.mjs';

export const LIB_VERSION = 'w335d-binarytilt-lib-1';
const isFin = Number.isFinite;
const D2R = Math.PI / 180;
const { add, sub, scl, dot, crs, nrm, unit } = vec;
const wrapPi = (x) => Math.atan2(Math.sin(x), Math.cos(x));

/* ───────── 宣言(走行の前に置く —— 結果を見て変えない)───────── */
export const DECL = Object.freeze({
  /** (1) 同期の型の照合(閉じた式との差の上限は公転の速さ n a で割った相対) */
  sync: Object.freeze({
    e: Object.freeze([0, 0.05, 0.1, 0.2, 0.4, 0.6]), nPhase: 8,
    /** 0.122 は冥王星–カロンの文献の値の比(第334便d と同じ —— Brozović & Jacobson 2024 の GM の比・文献の値・未照合) */
    massRatios: Object.freeze([0.05, 0.122, 0.3, 1]), selfRatios: Object.freeze([1e-3, 1, 1e3]), receivers: Object.freeze([0, 1]),
    types: Object.freeze(['circ', 'instant', 'mean']), tol: 1e-13,
  }),
  /** (2) 一周の平均の永年の効き(求積の点の数・中心差分の幅・照らしの許容 —— 動径 −5/3・接線(ḟ)+10/3・K1 +5/3 は第331便c の値) */
  secular: Object.freeze({
    e: Object.freeze([0.05, 0.1, 0.2, 0.4, 0.6]), nQuad: 4096, fdStep: 1e-6,
    pieces: Object.freeze(['radial', 'tangF', 'tangOmega']), radialShare: -5 / 3, tangFShare: 10 / 3, k1Share: 5 / 3, tol: 1e-6,
  }),
  /** (3) 同時発展の刻み(1 公転 2000 刻み・8 公転 + 1/4 公転の余り —— 通過の 8 回)・通過の時刻の解き方 */
  run: Object.freeze({ stepsPerOrbit: 2000, nOrb: 8, tailFrac: 0.25, perOrbitSamples: 200, refineIter: 60, refineTol: 1e-14 }),
  /** (3′) 同期の型の同時発展(引きずりだけ〔G_loc なし〕と今の型〔受け手 n = 2〕・η は冥王星–カロンの桁) */
  lock: Object.freeze({
    modes: Object.freeze(['k1', 'mean', 'instant']), e: Object.freeze([0.05, 0.1, 0.2, 0.4, 0.6]), eps: Object.freeze([1e-6, 1e-5]), eta: 0.0974,
    gNow: Object.freeze({ pair: 'receiver', n: 2 }), shareTol: 1e-3,
  }),
  /** (4) 残差の族(族・k の集合・設計の系・検証の系・物差し) */
  law: Object.freeze({
    types: Object.freeze([
      Object.freeze({ key: 'recv2K1', g: Object.freeze({ pair: 'receiver', n: 2 }), k1: true, label: '受け手 n = 2 + K1(今)' }),
      Object.freeze({ key: 'sym2K1', g: Object.freeze({ pair: 'symmetric', n: 2 }), k1: true, label: '対称 n = 2 + K1' }),
      Object.freeze({ key: 'sym4K1', g: Object.freeze({ pair: 'symmetric', n: 4 }), k1: true, label: '対称 n = 4 + K1' }),
      Object.freeze({ key: 'recv2', g: Object.freeze({ pair: 'receiver', n: 2 }), k1: false, label: '受け手 n = 2(K1 なし)' })]),
    families: Object.freeze([
      Object.freeze({ key: 'G1', terms: Object.freeze(['1']), label: 'ε a/(1 − e²)^k' }),
      Object.freeze({ key: 'G2', terms: Object.freeze(['1', 'e2']), label: 'ε(a + b e²)/(1 − e²)^k' }),
      Object.freeze({ key: 'G3', terms: Object.freeze(['1', 'e2', 'eta']), label: 'ε(a + b e² + c η)/(1 − e²)^k' })]),
    kSet: Object.freeze([1, 1.5, 2, 2.5, 3]),
    /** 設計の系 = 第334便d の同時発展の格子の η・e(近点の定まる e > 0)× ε(1e-8 は数値の床の下 —— 1e-5 に置き換える) */
    design: Object.freeze({ eta: Object.freeze([1e-6, 0.05, 0.0974, 0.1875, 0.2222, 0.25]), e: Object.freeze([0.1, 0.3, 0.6]), eps: Object.freeze([1e-6, 1e-5, 1e-4]) }),
    /** 検証の系 = 在位の本の η・e・ε(読むだけ)+ 設計に使っていない格子の点 */
    verifyBooks: Object.freeze(['alphaCenABInertial3d', 'siriusABInertial3d', 'psrDoubleABInertial3d', 'psrJ1757DFM', 'psrJ1946DFM', 'psrB1534']),
    readingBooks: Object.freeze(['plutoCharonInertialFit', 'plutoCharonDiagInput']),
    verifyGrid: Object.freeze([Object.freeze({ id: 'grid-a', eta: 0.15, e: 0.45, eps: 3e-6 }), Object.freeze({ id: 'grid-b', eta: 0.0222, e: 0.2, eps: 3e-5 }),
      Object.freeze({ id: 'grid-c', eta: 0.24, e: 0.5, eps: 1e-5 }), Object.freeze({ id: 'grid-d', eta: 0.12, e: 0.15, eps: 5e-5 })]),
    /** 法則と呼ぶ条件: 検証の系の全点で |予測 − 同時発展| ≤ max(tolRel·|δ|, tolAbsPerEps·ε)(= max(5%·|δ|, 1e-6·(ε/1e-6))) */
    tolRel: 0.05, tolAbsPerEps: 1,
    /** ε の床(本の ε がこれより小さければ床の値で走らせ、δ ∝ ε で外挿 —— 比例の確かめは epsProp)・近点の定まる e の下限 */
    epsFloor: 1e-6, eMin: 0.01,
    /** ε に比例(設計の系の ε = 1e-6 → 1e-4 の log の傾きが 1 ± epsPropTol) */
    epsPropTol: 0.05,
  }),
  /** (5) 自転軸の傾きの組み合わせ(天体 1 の軸の全部 × 天体 2 の関係 —— 走行の前の間引き) */
  tilt: Object.freeze({
    thetaDeg: Object.freeze([0, 30, 60, 90, 120, 150, 180]), phiDeg: Object.freeze([0, 90, 180, 270]),
    /** orbit = 天体 2 は軌道の軸(軸一致)・same = 天体 1 と同じ軸・opposite = 同じ傾きで方位 +180°・ortho = 同じ子午面で傾き +90°(天体 1 の軸に直交) */
    rel: Object.freeze(['orbit', 'same', 'opposite', 'ortho']),
    /** 自転の速さ(× n —— 両天体) */
    spins: Object.freeze([1, 10, 100]),
    gType: 'recv2K1', eta: 0.0974, e: 0.1, eps: 1e-6,
    /** 読み (a) の物差し: ρ を「小さくする」= ρ ≤ ρ_基線 − reduceFrac·ρ₁/「0 にする」= ρ ≤ 0 の行が有る */
    reduceFrac: 0.01,
    /** 一次外挿が壊れる印: |Δρ(100 n) ÷ (10·Δρ(10 n)) − 1| > linBreakTol か、目安 10 ε m_j s_j/n > linearMax */
    linBreakTol: 0.1, linearMax: 1e-3,
    /** 方位の原点 = 初期の近点の向き(軌道面の内)—— 全体を同じだけ回す操作の対照の回転 */
    covAxis: Object.freeze([1, -2, 0.5]), covAngleDeg: 50,
  }),
  /** (6) 重心の自己加速と周期(受け手の型 —— 第334便d の一次の式 cmKickPerOrbit と照らす) */
  cm: Object.freeze({ types: Object.freeze(['recv2K1', 'recv2', 'sym2K1']), eta: Object.freeze([0.05, 0.0974, 0.1875]), e: Object.freeze([0.1, 0.3, 0.6]), eps: Object.freeze([1e-6, 1e-4]), tol: 1e-2,
    /** パルサーの見かけの周期の変化率と比べる物差し(宣言だけ —— 観測の値は次の便): (Ṗ/P)_cm ≤ |a_cm|/c₀ = (ΔV_cm/公転)·√ε·n/(2π)(ΔV は公転の速さ n a の単位・視線の成分 ≤ 1) */
    pdotRule: '(Ṗ/P)_cm ≤ |a_cm|/c₀ = (ΔV_cm/公転)·√ε·n/(2π)' }),
  /** 刻みの感度(h と h/2 —— 宣言の部分集合) */
  band: Object.freeze({ tol: 1e-6 }),
});

/* ───────── 小道具 ───────── */
const typeOf = (key) => DECL.law.types.find((t) => t.key === key);
const rotAbout = (axis, ang) => { const k = unit(axis), c = Math.cos(ang), s = Math.sin(ang);
  return (v) => add(add(scl(v, c), scl(crs(k, v), s)), scl(k, dot(k, v) * (1 - c))); };
export { rotAbout, typeOf };
/** 一次の分担(入れた式): G_loc の型 + 引きずりの型(k1 +5/3・瞬間の同期 −5/3・平均の同期 +5/3 + Ω の分の求積の分担) */
export function firstShareLock(g, mode, eta, tangOmegaShare = null) {
  const gs = firstShare(g, false, eta);
  if (mode === 'none') return gs;
  if (mode === 'k1') return gs + DECL.secular.k1Share;
  if (mode === 'instant') return gs + DECL.secular.radialShare;
  if (mode === 'mean') { if (!isFin(tangOmegaShare)) throw new RangeError('firstShareLock: 平均の同期は Ω の分の分担が要る'); return gs + DECL.secular.k1Share + tangOmegaShare; }
  throw new RangeError('firstShareLock: mode は none・k1・instant・mean');
}

/* ───────── (1) 同期の型 ───────── */
/**
 * 1 つの配置(質量比 q・位相・受け手・自己の重み)と型の、残る d の動径・接線・面外の成分と閉じた式。
 * 型: circ(e = 0・Ω = n)・instant(Ω = ḟ(位相) —— syncCase の非同期に ḟ/n)・mean(Ω = n)。G = 1・M = 1・a = 1・n = 1。
 */
export function syncTypeCase({ q, e, phase, recv, selfRatio, type }) {
  if (!DECL.sync.types.includes(type)) throw new RangeError('syncTypeCase: 型は circ・instant・mean');
  if (type === 'circ' && e !== 0) throw new RangeError('syncTypeCase: circ は e = 0');
  const p = 1 - e * e, h = Math.sqrt(p), r = p / (1 + e * Math.cos(phase)), rdot = e * Math.sin(phase) / h, fdot = h / (r * r);
  const Omega = type === 'instant' ? fdot : 1;
  const c = syncCase({ q, phase, recv, selfRatio, op: { e, async: Omega } });
  // 受け手の r̂ = (p_i − p_j)/r(相対 p_2 − p_1 の向きは位相の向き —— 受け手が主なら反対)・φ̂ = ẑ × r̂
  const sg = recv === 1 ? 1 : -1, er = [sg * Math.cos(phase), sg * Math.sin(phase), 0], et = [-er[1], er[0], 0];
  const beta = 1 / (1 + selfRatio);
  const dr = dot(c.d, er), dt = dot(c.d, et), dz = c.d[2];
  const drC = -beta * rdot, dtC = beta * r * (Omega - fdot);
  return { q, e, phase, recv, selfRatio, type, r, rdot, fdot, Omega, beta, betaLib: c.beta, dr, dt, dz, drC, dtC, errR: Math.abs(dr - drC), errT: Math.abs(dt - dtC), errZ: Math.abs(dz), slip: c.slipNorm };
}
/** 同期の型の表(e × 位相 × 質量比 × 受け手 × 自己の重み × 型 —— circ は e = 0 だけ・e = 0 の instant と mean は circ と同じ配置) */
export function syncTypeTable(D = DECL.sync) {
  const rows = [], phases = Array.from({ length: D.nPhase }, (_, j) => 2 * Math.PI * j / D.nPhase);
  for (const type of D.types) for (const e of D.e) {
    if (type === 'circ' && e !== 0) continue;
    for (const phase of phases) for (const q of D.massRatios) for (const recv of D.receivers) for (const selfRatio of D.selfRatios) rows.push(syncTypeCase({ q, e, phase, recv, selfRatio, type }));
  }
  const by = (type, e) => rows.filter((x) => x.type === type && x.e === e);
  const summary = [];
  for (const type of D.types) for (const e of D.e) {
    const rr = by(type, e); if (!rr.length) continue;
    summary.push({ type, e, n: rr.length, maxErrR: Math.max(...rr.map((x) => x.errR)), maxErrT: Math.max(...rr.map((x) => x.errT)), maxErrZ: Math.max(...rr.map((x) => x.errZ)),
      maxDr: Math.max(...rr.map((x) => Math.abs(x.dr))), maxDt: Math.max(...rr.map((x) => Math.abs(x.dt))), maxBetaErr: Math.max(...rr.map((x) => Math.abs(x.beta - x.betaLib))) });
  }
  return { rows, summary, maxErr: Math.max(...rows.map((x) => Math.max(x.errR, x.errT, x.errZ))) };
}

/* ───────── (2) 一周の平均の永年の効き(求積)───────── */
/** 相対の d(ε = 1 あたり —— 二体の β 和 10ε/r)の部: radial・tangF・tangOmega(Ω = n = 1) */
function dPiece(piece, x, w) {
  const r = nrm(x), rh = scl(x, 1 / r), z = unit(crs(x, w)), ph = crs(z, rh), rdot = dot(x, w) / r, fdot = nrm(crs(x, w)) / (r * r);
  if (piece === 'radial') return scl(rh, -10 * rdot / r);
  if (piece === 'tangF') return scl(ph, -10 * fdot);
  if (piece === 'tangOmega') return scl(ph, 10);
  throw new RangeError('dPiece: radial・tangF・tangOmega');
}
/**
 * 1 公転の要素の変化(ε = 1 あたりの一次 —— 求積): Δ(要素) = ∮ ∇_w(要素)·ḋ dt。要素: ϖ(近点の向き)・e・a。
 * 戻り値: { dvarpi, de, da, share = dvarpi ÷ [6π/(1 − e²)] }
 */
export function secularQuad(piece, e, D = DECL.secular) {
  if (!(e > 0 && e < 0.9)) throw new RangeError('secularQuad: 0 < e < 0.9');
  const N = D.nQuad, dt = 2 * Math.PI / N, orb = { a: 1, e, P: [1, 0, 0], Q: [0, 1, 0], W: [0, 0, 1], mu: 1 };
  const st = Array.from({ length: N }, (_, j) => stateAt(orb, 2 * Math.PI * j / N));
  const dv = st.map((s) => dPiece(piece, s.x, s.v));
  const el = (x, w) => { const o = orbitOfState(x, w, 1); return [Math.atan2(o.P[1], o.P[0]), o.e, o.a]; };
  const acc = [0, 0, 0], hs = D.fdStep;
  for (let j = 0; j < N; j++) {
    const jm2 = (j - 2 + N) % N, jm1 = (j - 1 + N) % N, jp1 = (j + 1) % N, jp2 = (j + 2) % N;
    const dd = [0, 1, 2].map((k) => (-dv[jp2][k] + 8 * dv[jp1][k] - 8 * dv[jm1][k] + dv[jm2][k]) / (12 * dt));
    const { x, v } = st[j];
    for (let k = 0; k < 3; k++) {
      const wp = v.slice(), wm = v.slice(); wp[k] += hs; wm[k] -= hs;
      const ep = el(x, wp), em = el(x, wm);
      const g = [wrapPi(ep[0] - em[0]) / (2 * hs), (ep[1] - em[1]) / (2 * hs), (ep[2] - em[2]) / (2 * hs)];
      for (let m = 0; m < 3; m++) acc[m] += g[m] * dd[k] * dt;
    }
  }
  return { piece, e, dvarpi: acc[0], de: acc[1], da: acc[2], share: acc[0] / (6 * Math.PI / (1 - e * e)) };
}
/** 求積の表(部 × e)と K1 = 動径 + 接線(ḟ)の照らし・平均の同期 = K1 + 接線(Ω) */
export function secularTable(D = DECL.secular) {
  const rows = [];
  for (const e of D.e) {
    const R = {}; for (const pc of D.pieces) R[pc] = secularQuad(pc, e, D);
    rows.push({ e, radial: R.radial, tangF: R.tangF, tangOmega: R.tangOmega,
      k1: { share: R.radial.share + R.tangF.share, de: R.radial.de + R.tangF.de, da: R.radial.da + R.tangF.da },
      instant: { share: R.radial.share, de: R.radial.de, da: R.radial.da },
      mean: { share: R.radial.share + R.tangF.share + R.tangOmega.share, de: R.radial.de + R.tangF.de + R.tangOmega.de, da: R.radial.da + R.tangF.da + R.tangOmega.da } });
  }
  return { rows };
}

/* ───────── (3) 二体の同時発展(近点の通過の角)───────── */
/**
 * opt: { eta, e, eps, g: null | { pair, n }, k1: bool, spin: null | { kind: 'fixed', s: [s1, s2] } | { kind: 'instant' }, stepsPerOrbit, nOrb, plane: 回転の関数 | null }
 * 戻り値: 生の標本(通過の角と時刻・窓の標本)
 */
function integrate({ eta, e, eps, g = null, k1 = false, spin = null, stepsPerOrbit, nOrb, plane = null }, on) {
  const R = DECL.run, { m1, m2 } = massesOfEta(eta), b = 10 * eps, P3 = plane || ((v) => v);
  const P0 = P3([1, 0, 0]), Q0 = P3([0, 1, 0]), W0 = P3([0, 0, 1]);
  const gp = on && g ? g.pair : null, gn = on && g ? g.n : 0, kk = on && k1, sk = on && spin ? spin.kind : null;
  const S1 = sk === 'fixed' ? P3(spin.s[0]) : null, S2 = sk === 'fixed' ? P3(spin.s[1]) : null;
  const f = (s, o) => {
    const dx = s[3] - s[0], dy = s[4] - s[1], dz = s[5] - s[2], r2 = dx * dx + dy * dy + dz * dz, r = Math.sqrt(r2), r3 = r2 * r;
    let g1 = 1, g2 = 1;
    if (gp === 'receiver') { g1 = Math.exp(-2 * gn * eps * m2 / r); g2 = Math.exp(-2 * gn * eps * m1 / r); }
    else if (gp === 'symmetric') { g1 = g2 = Math.exp(-gn * eps / r); }
    const k1x = g1 * m2 / r3, k2x = g2 * m1 / r3;
    let d1x = 0, d1y = 0, d1z = 0, d2x = 0, d2y = 0, d2z = 0;
    if (kk || sk) {
      const b12 = b * m2 / r, b21 = b * m1 / r, rvx = s[9] - s[6], rvy = s[10] - s[7], rvz = s[11] - s[8];
      if (kk) { d1x += b12 * rvx; d1y += b12 * rvy; d1z += b12 * rvz; d2x -= b21 * rvx; d2y -= b21 * rvy; d2z -= b21 * rvz; }
      let a1 = S1, a2 = S2;
      if (sk === 'instant') { const hx = dy * rvz - dz * rvy, hy = dz * rvx - dx * rvz, hz = dx * rvy - dy * rvx; a1 = a2 = [hx / r2, hy / r2, hz / r2]; }
      if (sk) {   // d_1 += β_12 s_2 × (p_1 − p_2) = −β_12 s_2 × Δ・d_2 += β_21 s_1 × Δ(Δ = p_2 − p_1)
        d1x -= b12 * (a2[1] * dz - a2[2] * dy); d1y -= b12 * (a2[2] * dx - a2[0] * dz); d1z -= b12 * (a2[0] * dy - a2[1] * dx);
        d2x += b21 * (a1[1] * dz - a1[2] * dy); d2y += b21 * (a1[2] * dx - a1[0] * dz); d2z += b21 * (a1[0] * dy - a1[1] * dx);
      }
    }
    o[0] = s[6] + d1x; o[1] = s[7] + d1y; o[2] = s[8] + d1z; o[3] = s[9] + d2x; o[4] = s[10] + d2y; o[5] = s[11] + d2z;
    o[6] = k1x * dx; o[7] = k1x * dy; o[8] = k1x * dz; o[9] = -k2x * dx; o[10] = -k2x * dy; o[11] = -k2x * dz;
    return o;
  };
  const orb0 = { a: 1, e, P: P0, Q: Q0, W: W0, mu: 1 }, st0 = stateAt(orb0, 0);
  let s = new Float64Array(12);
  for (let j = 0; j < 3; j++) { s[j] = -m2 * st0.x[j]; s[3 + j] = m1 * st0.x[j]; s[6 + j] = -m2 * st0.v[j]; s[9 + j] = m1 * st0.v[j]; }
  const tmpC = new Float64Array(12);
  { const c = f(s, tmpC); for (let j = 0; j < 6; j++) s[6 + j] -= c[j] - s[6 + j]; }   // 接触の速度を無摂動のケプラーの速度に(一次)
  const h = 2 * Math.PI / stepsPerOrbit, ka = new Float64Array(12), kb = new Float64Array(12), kc = new Float64Array(12), kd = new Float64Array(12), tmp = new Float64Array(12);
  const step = (src, dst, tau, k0) => {   // k0 = f(src)(既に計算した値 —— 無ければ計算)
    if (k0) ka.set(k0); else f(src, ka);
    for (let j = 0; j < 12; j++) tmp[j] = src[j] + 0.5 * tau * ka[j]; f(tmp, kb);
    for (let j = 0; j < 12; j++) tmp[j] = src[j] + 0.5 * tau * kb[j]; f(tmp, kc);
    for (let j = 0; j < 12; j++) tmp[j] = src[j] + tau * kc[j]; f(tmp, kd);
    for (let j = 0; j < 12; j++) dst[j] = src[j] + tau * (ka[j] + 2 * kb[j] + 2 * kc[j] + kd[j]) / 6;
  };
  const gOf = (st, fv) => (st[3] - st[0]) * (fv[3] - fv[0]) + (st[4] - st[1]) * (fv[4] - fv[1]) + (st[5] - st[2]) * (fv[5] - fv[2]);
  const angOf = (st) => { const x = [st[3] - st[0], st[4] - st[1], st[5] - st[2]]; return Math.atan2(dot(x, Q0), dot(x, P0)); };
  const sample = (s1) => {
    const c = f(s1, new Float64Array(12)), x = [s1[3] - s1[0], s1[4] - s1[1], s1[5] - s1[2]], w = [c[3] - c[0], c[4] - c[1], c[5] - c[2]], o = orbitOfState(x, w, 1);
    const aps = Math.atan2(dot(o.P, Q0), dot(o.P, P0)), lam = aps + o.M;
    const r = nrm(x), x1 = [s1[0], s1[1], s1[2]], x2 = [s1[3], s1[4], s1[5]], w1 = [c[0], c[1], c[2]], w2 = [c[3], c[4], c[5]];
    const E = 0.5 * m1 * dot(w1, w1) + 0.5 * m2 * dot(w2, w2) - m1 * m2 / r, L = add(scl(crs(x1, w1), m1), scl(crs(x2, w2), m2)), cm = add(scl(x1, m1), scl(x2, m2)), vcm = add(scl(w1, m1), scl(w2, m2));
    return { aps, lam, e: o.e, tx: dot(o.W, P0), ty: dot(o.W, Q0), E, Ln: nrm(L), cm: nrm(cm), vcm: nrm(vcm) };
  };
  const sub = Math.max(1, Math.round(stepsPerOrbit / R.perOrbitSamples)), nMain = nOrb * stepsPerOrbit, nAll = Math.round((nOrb + R.tailFrac) * stepsPerOrbit);
  const samp = [sample(s)], pass = [];
  const prev = new Float64Array(12), fPrev = new Float64Array(12), fNow = new Float64Array(12), probe = new Float64Array(12), fProbe = new Float64Array(12);
  f(s, fNow); let gNow = gOf(s, fNow);
  for (let k = 1; k <= nAll; k++) {
    prev.set(s); fPrev.set(fNow); const gPrev = gNow;
    step(prev, s, h, fPrev);
    f(s, fNow); gNow = gOf(s, fNow);
    if (gPrev < 0 && gNow >= 0) {   // 近点の通過(Δ·Δẋ が負から非負へ)—— 刻みの内で割線(Illinois)
      let ta = 0, tb = h, ga = gPrev, gb = gNow, side = 0, tc = h;
      for (let it = 0; it < R.refineIter; it++) {
        tc = (ta * gb - tb * ga) / (gb - ga);
        step(prev, probe, tc, fPrev); f(probe, fProbe); const gc = gOf(probe, fProbe);
        if (gc === 0 || Math.abs(tb - ta) <= R.refineTol * h) break;
        if (gc * gb < 0) { ta = tb; ga = gb; tb = tc; gb = gc; side = 0; } else { tb = tc; gb = gc; if (side === 1) ga /= 2; side = 1; }
        if (Math.abs(tb - ta) <= R.refineTol * h) break;
      }
      step(prev, probe, tc, fPrev);
      pass.push({ t: (k - 1) * h + tc, ang: angOf(probe) });
    }
    if (k <= nMain && k % sub === 0) samp.push(sample(s));
  }
  return { samp, pass, perOrbit: Math.round(stepsPerOrbit / sub) };
}
const slopeOf = (y) => { const N = y.length, mx = (N - 1) / 2, my = y.reduce((a, q) => a + q, 0) / N; let sxy = 0, sxx = 0; for (let j = 0; j < N; j++) { sxy += (j - mx) * (y[j] - my); sxx += (j - mx) * (j - mx); } return sxy / sxx; };
const unwrap = (y) => { const o = y.slice(); for (let j = 1; j < o.length; j++) { let d = o[j] - o[j - 1]; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; o[j] = o[j - 1] + d; } return o; };
/**
 * 同時発展の率(無摂動の同じ刻みの走行との差 —— 1 公転あたり)。近点の主 = 通過の角(apsPass)・補助 = 窓の平均(apsWin)。
 * 周期: dPanom(通過の時刻の間隔の相対差 —— 主)・dPoverP(平均経度の率 −Δλ/2π —— 補助・第334便d と同じ)。
 */
export function runPair(opt, offCache = null) {
  const R = DECL.run, stepsPerOrbit = opt.stepsPerOrbit || R.stepsPerOrbit, nOrb = opt.nOrb || R.nOrb;
  const { eta, e, eps } = opt;
  if (!(eps > 0) || !(e >= 0 && e < 0.9) || !(nOrb >= 2)) throw new RangeError('runPair: ε > 0・0 ≤ e < 0.9・公転の数 ≥ 2');
  if (opt.g && !(['receiver', 'symmetric'].includes(opt.g.pair) && isFin(opt.g.n))) throw new RangeError('runPair: g は { pair: receiver|symmetric, n }');
  if (opt.spin && !((opt.spin.kind === 'fixed' && Array.isArray(opt.spin.s) && opt.spin.s.length === 2 && opt.spin.s.every((v) => Array.isArray(v) && v.length === 3 && v.every(isFin))) || opt.spin.kind === 'instant'))
    throw new RangeError('runPair: spin は { kind: fixed, s: [s1, s2] } か { kind: instant }');
  const o2 = Object.assign({}, opt, { stepsPerOrbit, nOrb });
  const key = [e, stepsPerOrbit, nOrb, eta, opt.plane ? 'p' : '0'].join('|');
  const off = offCache && offCache.has(key) ? offCache.get(key) : integrate(o2, false);
  if (offCache && !offCache.has(key)) offCache.set(key, off);
  const on = integrate(o2, true), K = on.perOrbit, sOn = on.samp, sOff = off.samp;
  const winMean = (y) => { const out = []; for (let w = 0; w < nOrb; w++) { let a = 0; for (let j = 0; j < K; j++) a += y[w * K + j]; out.push(a / K); } return out; };
  const angDiff = (k) => winMean(unwrap(sOn.map((q, j) => wrapPi(q[k] - sOff[j][k]))));
  const lin = (k) => winMean(sOn.map((q, j) => q[k] - sOff[j][k]));
  const q1 = 6 * Math.PI * eps / (1 - e * e);
  let apsPass = null, dPanom = null, nPass = Math.min(on.pass.length, off.pass.length, nOrb);
  if (e > 0 && nPass >= 3) {
    const da = unwrap(on.pass.slice(0, nPass).map((p, j) => wrapPi(p.ang - off.pass[j].ang))), dtm = on.pass.slice(0, nPass).map((p, j) => p.t - off.pass[j].t);
    apsPass = slopeOf(da); dPanom = slopeOf(dtm) / (2 * Math.PI);
  }
  const apsWin = e > 0 ? slopeOf(angDiff('aps')) : null, dlam = slopeOf(angDiff('lam')), de = slopeOf(lin('e')), tx = slopeOf(lin('tx')), ty = slopeOf(lin('ty'));
  const orbE = winMean(sOn.map((q) => q.E)), orbL = winMean(sOn.map((q) => q.Ln)), E0 = Math.abs(sOn[0].E), Es = sOn.map((q) => q.E);
  const ledger = { eSlopeRel: slopeOf(orbE) / E0, eSpanRel: (Math.max(...Es) - Math.min(...Es)) / E0, lSlopeRel: slopeOf(orbL) / sOn[0].Ln, cmFinal: sOn[sOn.length - 1].cm, vcmFinal: sOn[sOn.length - 1].vcm };
  return { apsPass, apsWin, sharePass: apsPass === null ? null : apsPass / q1, shareWin: apsWin === null ? null : apsWin / q1, rhoPass: apsPass === null ? null : apsPass / q1 - 1, rhoWin: apsWin === null ? null : apsWin / q1 - 1,
    dPanom, dPoverP: -dlam / (2 * Math.PI), de, tilt: [tx, ty], tiltRate: Math.hypot(tx, ty), q1, nPass, ledger, nOrb };
}

/* ───────── (4) 残差の族 ───────── */
const termOf = (t, p) => (t === '1' ? 1 : t === 'e2' ? p.e * p.e : t === 'eta' ? p.eta : NaN);
/** 族 fam と指数 k の最小二乗(δ/ε の空間で当てる —— ε の点が同じ重み)。pts = [{ eta, e, eps, delta }] */
export function fitLaw(fam, k, pts) {
  const T = fam.terms, n = T.length, A = pts.map((p) => T.map((t) => termOf(t, p) / Math.pow(1 - p.e * p.e, k))), y = pts.map((p) => p.delta / p.eps);
  const M = Array.from({ length: n }, () => new Array(n + 1).fill(0));
  for (let i = 0; i < A.length; i++) for (let a = 0; a < n; a++) { for (let c = 0; c < n; c++) M[a][c] += A[i][a] * A[i][c]; M[a][n] += A[i][a] * y[i]; }
  for (let c = 0; c < n; c++) { let pv = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[pv][c])) pv = r; [M[c], M[pv]] = [M[pv], M[c]];
    for (let r = 0; r < n; r++) if (r !== c) { const fc = M[r][c] / M[c][c]; for (let cc = c; cc <= n; cc++) M[r][cc] -= fc * M[c][cc]; } }
  const coef = T.map((_, j) => M[j][n] / M[j][j]);
  const pred = (p) => p.eps * T.reduce((s, t, j) => s + coef[j] * termOf(t, p), 0) / Math.pow(1 - p.e * p.e, k);
  const res = pts.map((p) => (p.delta - pred(p)) / p.eps);
  return { key: fam.key, k, terms: T.slice(), coef, pred, ss: res.reduce((s, x) => s + x * x, 0), maxResOverEps: Math.max(...res.map(Math.abs)) };
}
/** k を設計の系の二乗の和の最小で選ぶ */
export function fitLawBestK(fam, pts, L = DECL.law) {
  const fits = L.kSet.map((k) => fitLaw(fam, k, pts));
  return fits.reduce((a, b) => (b.ss < a.ss ? b : a), fits[0]);
}
/** 判定(検証の系の点 —— { id, eta, e, eps, delta })*/
export function judgeLaw(fit, vpts, L = DECL.law) {
  const rows = vpts.map((p) => { const pr = fit.pred(p), tol = Math.max(L.tolRel * Math.abs(p.delta), L.tolAbsPerEps * p.eps); return { id: p.id, pred: pr, num: p.delta, diff: pr - p.delta, tol, ratio: Math.abs(pr - p.delta) / tol, inside: Math.abs(pr - p.delta) <= tol }; });
  return { rows, law: rows.length > 0 && rows.every((q) => q.inside), maxRatio: rows.length ? Math.max(...rows.map((q) => q.ratio)) : null };
}

/* ───────── (5) 自転軸の傾きの組み合わせ ───────── */
/** 天体 1 の軸の宣言(θ・φ〔度〕—— θ = 0・180 は方位 0 だけ) */
export function tiltAxes1(D = DECL.tilt) {
  const out = [];
  for (const th of D.thetaDeg) for (const ph of D.phiDeg) { if ((th === 0 || th === 180) && ph !== 0) continue; out.push({ theta: th, phi: ph }); }
  return out;
}
/** 天体 2 の軸(天体 1 の軸 θ・φ と関係 rel から) */
export function axis2Of(theta, phi, rel) {
  if (rel === 'orbit') return [0, 0, 1];
  if (rel === 'same') return tiltAxis(theta, phi);
  if (rel === 'opposite') return tiltAxis(theta, phi + 180);
  if (rel === 'ortho') { const t = (theta + 90) * D2R, p = phi * D2R; return [Math.sin(t) * Math.cos(p), Math.sin(t) * Math.sin(p), Math.cos(t)]; }
  throw new RangeError('axis2Of: rel は orbit・same・opposite・ortho');
}
/** 軸の組と自転の速さ → 2 天体の自転のベクトル(公転の n の単位) */
export function tiltPair(theta, phi, rel, mag) { return [scl(tiltAxis(theta, phi), mag), scl(axis2Of(theta, phi, rel), mag)]; }

/* ───────── 純関数の場面と門 ───────── */
export function pureScenes() {
  const S = {};
  // ① 同期の型の閉じた式(少数の配置 —— 表は器で)
  S.sync = [syncTypeCase({ q: 0.122, e: 0.2, phase: 0.7, recv: 1, selfRatio: 1, type: 'instant' }), syncTypeCase({ q: 0.122, e: 0.2, phase: 0.7, recv: 1, selfRatio: 1, type: 'mean' }),
    syncTypeCase({ q: 0.3, e: 0, phase: 2.1, recv: 0, selfRatio: 1e3, type: 'circ' }), syncTypeCase({ q: 1, e: 0.4, phase: 4.0, recv: 0, selfRatio: 1e-3, type: 'mean' })];
  // ② 求積: K1 = 動径 + 接線(ḟ)= +5/3・動径 −5/3(e = 0.3)
  const qr = secularQuad('radial', 0.3), qt = secularQuad('tangF', 0.3);
  S.quad = { radial: qr.share, tangF: qt.share, k1: qr.share + qt.share, de: qr.de + qt.de, da: qr.da + qt.da };
  // ③ 同時発展: 摂動なしで率 0・固定の自転で第334便d の twoBody の窓の平均の近点と同じ・瞬間の同期で接線が消え、引きずりの分担が動径の −5/3 に近い・円の瞬間の同期で 0
  const quick = { stepsPerOrbit: 800, nOrb: 4 };
  S.zero = runPair(Object.assign({ eta: 0.1, e: 0.3, eps: 1e-6, g: { pair: 'receiver', n: 0 }, k1: false }, quick));
  const spins = [[0, 0.5, 1], [0.3, 0, 1]];
  S.eqA = runPair(Object.assign({ eta: 0.1875, e: 0.3, eps: 1e-6, g: { pair: 'receiver', n: 2 }, k1: true, spin: { kind: 'fixed', s: spins } }, quick));
  S.eqB = twoBody(Object.assign({ eta: 0.1875, e: 0.3, eps: 1e-6, g: { pair: 'receiver', n: 2 }, k1: true, spins }, quick));
  S.inst = runPair(Object.assign({ eta: 0.0974, e: 0.3, eps: 1e-6, g: null, k1: true, spin: { kind: 'instant' } }, quick));
  S.instCirc = runPair(Object.assign({ eta: 0.0974, e: 0, eps: 1e-6, g: null, k1: true, spin: { kind: 'instant' } }, quick));
  // ④ 全体を同じだけ回す(面と軸を一緒に)と同じ
  const Rt = rotAbout(DECL.tilt.covAxis, DECL.tilt.covAngleDeg * D2R), sp = tiltPair(60, 90, 'ortho', 10);
  S.covA = runPair(Object.assign({ eta: 0.0974, e: 0.1, eps: 1e-6, g: { pair: 'receiver', n: 2 }, k1: true, spin: { kind: 'fixed', s: sp } }, quick));
  S.covB = runPair(Object.assign({ eta: 0.0974, e: 0.1, eps: 1e-6, g: { pair: 'receiver', n: 2 }, k1: true, spin: { kind: 'fixed', s: sp }, plane: Rt }, quick));
  // ⑤ 族: 作った点で係数と k が戻る
  const pts = []; for (const eta of [0.01, 0.1, 0.2]) for (const e of [0.1, 0.3, 0.5]) for (const eps of [1e-6, 1e-4]) pts.push({ eta, e, eps, delta: eps * (-40 + 12 * e * e + 7 * eta) / Math.pow(1 - e * e, 2) });
  S.fit = fitLawBestK(DECL.law.families[2], pts);
  // ⑥ 軸の宣言の数と直交
  S.axes = tiltAxes1();
  S.ortho = Math.max(...S.axes.map((a) => Math.abs(dot(tiltAxis(a.theta, a.phi), axis2Of(a.theta, a.phi, 'ortho')))));
  // ⑦ 拒否
  const rejects = (fn) => { try { fn(); return false; } catch (e) { return e instanceof RangeError; } };
  S.rejects = [rejects(() => syncTypeCase({ q: 0.1, e: 0.1, phase: 0, recv: 0, selfRatio: 1, type: 'circ' })), rejects(() => secularQuad('radial', 0)), rejects(() => runPair({ eta: 0.1, e: 0.95, eps: 1e-6 })),
    rejects(() => runPair({ eta: 0.1, e: 0.1, eps: 1e-6, spin: { kind: 'x' } })), rejects(() => axis2Of(0, 0, 'x')), rejects(() => firstShareLock(null, 'mean', 0.1))];
  return S;
}
export function pureGates(S) {
  const rel = (a, b) => Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b), 1e-300);
  return {
    sync: S.sync.every((c) => c.errR <= DECL.sync.tol && c.errT <= DECL.sync.tol && c.errZ <= DECL.sync.tol) && Math.abs(S.sync[0].dt) <= DECL.sync.tol && Math.abs(S.sync[1].dt) > 1e-3 && Math.hypot(S.sync[2].dr, S.sync[2].dt) <= DECL.sync.tol,
    quad: Math.abs(S.quad.radial - DECL.secular.radialShare) <= DECL.secular.tol && Math.abs(S.quad.tangF - DECL.secular.tangFShare) <= DECL.secular.tol && Math.abs(S.quad.k1 - DECL.secular.k1Share) <= DECL.secular.tol,
    zeroRun: S.zero.apsPass === 0 && S.zero.apsWin === 0 && S.zero.dPanom === 0 && S.zero.de === 0,
    equalTwoBody: rel(S.eqA.apsWin, S.eqB.aps) <= 1e-9 && rel(S.eqA.dPoverP, S.eqB.dPoverP) <= 1e-9 && rel(S.eqA.tiltRate, S.eqB.tiltRate) <= 1e-9,
    instant: Math.abs(S.inst.sharePass - DECL.secular.radialShare) <= 1e-2 && Math.abs(S.instCirc.dPoverP) <= 1e-12 && S.instCirc.tiltRate <= 1e-12,
    covariance: rel(S.covA.apsPass, S.covB.apsPass) <= 1e-7 && rel(S.covA.dPanom, S.covB.dPanom) <= 1e-7 && rel(S.covA.tiltRate, S.covB.tiltRate) <= 1e-7,
    fit: S.fit.k === 2 && rel(S.fit.coef[0], -40) <= 1e-9 && rel(S.fit.coef[1], 12) <= 1e-9 && rel(S.fit.coef[2], 7) <= 1e-9,
    axes: S.axes.length === 22 && S.ortho <= 1e-15,
    rejects: S.rejects.every(Boolean),
  };
}
export { cmKickPerOrbit, massesOfEta, tiltAxis, vec };
