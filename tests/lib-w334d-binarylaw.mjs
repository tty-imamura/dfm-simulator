// 第334便d(原仮定者の整理(2026-11-11)「連星について —— 新しい引きずりや、傾いた自転軸でのフィットなどを検証する」「冥王星とカロンが、連星のヒントになると想定」
//   「合わなくても、合わない量に法則性が見付かれば、進展したとする」・原仮定者の回答(2026-11-11 —— AN637)連星の残差は残す・η の依存を成果として記録・冥王星–カロンと傾いた軸は比べる列・
//   原仮定者の回答(2026-11-11 —— AN634)二体の同時発展の小さな診断・原仮定者の回答(2026-11-11 —— AN624)s_d は J を表す等価なパラメータ —— 座標変換の角速度・観測自転と用途を分ける・
//   統括の検証項目 R325): **連星と冥王星–カロンの純関数 —— 同期の零試験と反例・二体の同時発展の積分器・残差の法則の族と判定の物差し・傾いた自転軸の型**
//   (器 tests/exp-w334d-binarylaw.mjs と QA lint.binaryLaw334d・behavior.binaryLaw334d が読む —— html を読まない・状態を持たない・第331便a・第331便c・第333便c の lib は呼ぶだけ・
//   エンジンの式を写さない)。出どころの型は統括の参考の試作(同期の零試験 —— 今のコードを読んで書き直した)。
//
// ■ 区別(各表・各式に付ける —— 作業仮説と今のコードの実装を混ぜない)
//   実装 = 今の beta の html にある型(G_loc の力の型 —— 受け手 n = 2〔作用反作用は崩れる —— エンジンは差を帳簿 gLocPx に積む〕・K1 の並進の一次)/
//   診断 = この lib の零試験・同時発展の積分器・族の当てはめ/宣言(未接続)= 今のエンジンに無い型(対称の G_loc の n の格子・並進引きずりの回転の分〔源の自転の座標の回転〕)。
// ■ 用語(原仮定者の整理(2026-11-11)—— 本便から恒久)
//   並進引きずり = 引きずる側(源)の移動と回転を使った座標変換(源の座標の速度 v_j + s_j × (p_i − p_j) の重み付き平均 —— 半径を見ない)・自分自身への並進引きずりが慣性(自己の項 W_ii)。
//   回転引きずり(空間の捩れ)は本 lib では扱わない —— **同期の零試験は座標変換の部分だけ**(回転引きずりまで 0 とは言わない)。引きずり自転 s_d(J 案)は座標変換の角速度に入れない
//   (入れた列は「源の角速度の混同」の否定対照 —— 宣言した反例の値 100 倍で J 案の値ではない)。
// ■ (1) 同期の零試験(syncCase —— 第331便a の coordTwist を呼ぶ): 円軌道・軸一致・相互同期で v_i = Ω × p_i・源の座標の回転も同じ Ω なら
//   v_j − v_i + Ω × (p_i − p_j) = 0 —— 座標変換の d と自転の滑りは質量比と有限の自己の重みに依らず 0(条件付きの恒等式)。操作を 1 つずつ足す(離心率・源の軸の傾き・非同期・
//   源の角速度の混同・自己の重みの 3 列)—— どの操作が残差を作るかと、残差の操作量への依存の次数(宣言した探りの 3 点の傾き)。無次元(G = 1・M = 1・a = 1・n = 1)。
// ■ (2) 二体の同時発展(twoBody —— 両方の天体を動かす RK4。重心は初期に原点・全運動量 0 —— 動くかは出力): ẋ_i = v_i + d_i・v̇_i = a_i。
//   G_loc(実装の型の二体版): 受け手 a_1 = G_1 m_2 (p_2 − p_1)/r³・G_1 = e^{−2n ε m_2/r}(ψ_1 = ε m_2/r —— 受け手ごと・作用反作用は崩れる)/対称 G_12 = e^{−n ε (m_1 + m_2)/r}(作用反作用を保つ)。
//   K1 の並進(実装の型の一次の二体版 —— 宣言): d_1 = β_12 (v_2 − v_1)・β_12 = 10 ε m_2/r(C₁Y_k = 10G/c² —— 相対の和が第331便c の b = C₁Y_k(M + m)・質量の重みの和 m_1 d_1 + m_2 d_2 = 0)。
//   並進引きずりの回転の分(宣言 —— 第333便c の transDragVelocity の型を二体へ・α = 1・自己の半径 R = Y_k m で β は K1 と同じ係数〔H₁ = C₁〕): d_1 += β_12 s_2 × (p_1 − p_2)。
//   無次元: G = 1・M = m_1 + m_2 = 1・相対の軌道の初期の接触の要素 a = 1(周期 2π)・ε = GM/(a c₀²)。出力は無摂動の同じ刻みの走行との差の最小二乗の傾き(1 公転あたり):
//   近点の回り aps・平均経度 λ = ϖ + M の率(公転の周期の相対差 ΔP/P = −Δλ/2π)・e の漂い・公転面の漂い(初期の面の基底での法線の傾きの 2 成分)・E と L の帳簿(ニュートンの E_N と全角運動量 ——
//   接触の速度で)・重心の漂い。ρ = aps/q_1PN − 1(q_1PN = 6πε/(1 − e²) —— 初期の接触の要素)。
// ■ (3) 残差の法則(lawFit —— 判定の物差しは走行の前に DECL.law に宣言): 族 F1 = c₀ + c₁η・F2 = F1 + c₂η²・F3 = F2 + d₁e²・F4 = F3 + kε を設計の格子の ρ に最小二乗で当て、
//   検証の系(在位の本の η・e・ε を器が読む —— 設計に使わない)で族の予測と同時発展の値の差が max(1%·|ρ|, 1e-4) の内なら「法則と呼ぶ」。**一次の式((4/3)η など)は入れた式** ——
//   同時発展で初めて出る項は c₂η²・d₁e²・kε の寄与(設計の格子での最大)が termSig を超えるかで書く。
// ■ 言わないこと: 連星の観測と比べた結果ではない(無次元の格子と本の η・e・ε の点)。周期・近点の率が同じでも、他の観測量まで同じとは言わない。一次の式から相関を作ったことを発見と呼ばない。
import { coordTwist } from './lib-w331a-coordtwist.mjs';
import { gLocShare } from './lib-w331c-k1scale.mjs';
import { BINARY_TYPES, binaryNumeric, orbitOfState, stateAt, vec } from './lib-w333c-mercury3d.mjs';

export const LIB_VERSION = 'w334d-binarylaw-lib-1';
const isFin = Number.isFinite;
const D2R = Math.PI / 180;
const { add, sub, scl, dot, crs, nrm, unit } = vec;
const wrapPi = (x) => Math.atan2(Math.sin(x), Math.cos(x));

/* ───────── 宣言(走行の前に置く —— 結果を見て変えない)───────── */
export const DECL = Object.freeze({
  /** (1) 同期の零試験 */
  sync: Object.freeze({
    /** 質量比 q = m_2/m_1(0.122 は冥王星–カロンの文献の値 —— Brozović & Jacobson 2024 の GM 869.3・106.1 km³/s² の比〔🥶🟪 の本の質量の写しと同じ〕・未照合) */
    massRatios: Object.freeze([0.05, 0.1, 0.122, 0.3, 1]),
    /** 公転の位相(rad —— 真近点角)・受け手(0 = 主・1 = 伴) */
    phases: Object.freeze([0, 0.7, 2.1]), receivers: Object.freeze([0, 1]),
    /** 自己の重みの 3 列(受け手の自己の重み W_ii ÷ 源の重み w_ij —— 有限の宣言・m/0² にしない) */
    selfRatios: Object.freeze([1e-3, 1, 1e3]),
    /** 操作(1 つずつ足す): 離心率(2e-4 は冥王星–カロンの文献の値の桁 —— 未照合)・源の自転軸の傾き〔度 —— 軌道の軸から〕・非同期(自転 ÷ 公転)・源の角速度の混同(宣言した反例の値 —— J 案の値ではない) */
    ecc: Object.freeze([2e-4, 0.05, 0.2]), tiltDeg: Object.freeze([10, 30, 90]), async: Object.freeze([0.9, 1.1, 2]), conflate: Object.freeze([100]),
    /** 次数の探り(操作量 = 格子の最小の値 × 1・0.1・0.01 —— 非同期は 1 からのずれ)・次数の判定の幅 */
    orderProbe: Object.freeze([1, 0.1, 0.01]), orderTol: 0.05,
    /** 零の上限(公転の速さ n a で割った相対)・反例の下限 */
    nullTol: 1e-13, counterMin: 1e-8,
    /** 共変性の対照(全体を一緒に回す回転と、枠の回転) */
    covAxis: Object.freeze([1, 2, 3]), covAngleDeg: 37, frameOmega: Object.freeze([0.3, -0.2, 0.5]),
  }),
  /** (2) 同時発展の格子(G_loc の型 × K1 の有無 × η × e × ε) */
  grid: Object.freeze({
    gTypes: Object.freeze([
      Object.freeze({ key: 'recv2', pair: 'receiver', n: 2, label: '受け手 n = 2(今)' }),
      Object.freeze({ key: 'sym2', pair: 'symmetric', n: 2, label: '対称 n = 2' }),
      Object.freeze({ key: 'sym4', pair: 'symmetric', n: 4, label: '対称 n = 4' }),
      Object.freeze({ key: 'recvM3', pair: 'receiver', n: -3, label: '受け手 n = −3' }),
      Object.freeze({ key: 'symM6', pair: 'symmetric', n: -6, label: '対称 n = −6' })]),
    k1: Object.freeze([true, false]),
    eta: Object.freeze([1e-6, 0.05, 0.0974, 0.1875, 0.2222, 0.25]),
    e: Object.freeze([0, 0.1, 0.3, 0.6]),
    eps: Object.freeze([1e-8, 1e-6, 1e-4]),
    stepsPerOrbit: 2000, nOrb: 16,
    /** 接触の要素の標本(1 公転あたりの点 —— 公転ごとの窓の平均を取る) */
    perOrbitSamples: 200,
    /** 間引き(走行の前の宣言): h/2・h/4 は ε = 1e-6・η ∈ {1e-6, 0.25}・e ∈ {0.1, 0.6} だけ/還元の和(第333便c の binaryNumeric)は ε ∈ {1e-6, 1e-4}・e ∈ {0.1, 0.3, 0.6} だけ/e = 0 は近点が定まらない(周期と漂いだけ) */
    bandSubset: Object.freeze({ eps: Object.freeze([1e-6]), eta: Object.freeze([1e-6, 0.25]), e: Object.freeze([0.1, 0.6]) }),
    reducedSubset: Object.freeze({ eps: Object.freeze([1e-6, 1e-4]), e: Object.freeze([0.1, 0.3, 0.6]) }),
  }),
  /** (3) 残差の法則(族・判定の物差し・設計と検証の分け方) */
  law: Object.freeze({
    families: Object.freeze([
      Object.freeze({ key: 'F1', terms: Object.freeze(['1', 'eta']), label: 'c₀ + c₁η' }),
      Object.freeze({ key: 'F2', terms: Object.freeze(['1', 'eta', 'eta2']), label: 'c₀ + c₁η + c₂η²' }),
      Object.freeze({ key: 'F3', terms: Object.freeze(['1', 'eta', 'eta2', 'e2']), label: 'F2 + d₁e²' }),
      Object.freeze({ key: 'F4', terms: Object.freeze(['1', 'eta', 'eta2', 'e2', 'eps']), label: 'F3 + kε' })]),
    /** 法則と呼ぶ条件: 検証の系の全点で |予測 − 同時発展| ≤ max(tolRel·|ρ|, tolAbs) */
    tolRel: 0.01, tolAbs: 1e-4,
    /** 新しい項(c₂η²・d₁e²・kε)の寄与が設計の格子で termSig を超え、かつ数値の帯(h と h/2 の差の最大)の 10 倍を超えるとき「有る」 */
    termSig: 1e-4, bandFactor: 10,
    /** 設計の系(格子と ♊⚖️🔶 —— 当てはめは格子だけ)・検証の系(📟🧮🩺📿 —— 本の η・e・ε を読む・当てはめに使わない)・🟪 は円に近い(e < eMin —— 近点は定まらない —— 位置づけだけ) */
    design: Object.freeze(['grid', 'binaryCheckEqualInertial3d', 'binaryCheckRatio3Inertial3d', 'alphaCenABInertial3d']),
    verify: Object.freeze(['psrDoubleABInertial3d', 'psrJ1757DFM', 'psrJ1946DFM', 'psrB1534']),
    reading: Object.freeze(['plutoCharonInertialFit', 'plutoCharonDiagInput']),
    /** 検証の系の数値の ε の床(格子の最小 —— これより小さい ε の本は床の値で走らせ、族の kε は外挿)と近点の定まる e の下限 */
    epsFloor: 1e-8, eMin: 0.01,
  }),
  /** (4) 傾いた自転軸(並進引きずりの回転の分 —— 源の自転の座標の回転・α = 1・R = Y_k m) */
  tilt: Object.freeze({
    tiltDeg: Object.freeze([0, 30, 60, 90, 120, 180]),
    /** 軸の組: both = 両方を同じ向きへ・first = 主だけ・second = 伴だけ・anti = 両方を反対の方位へ(傾ける向きは初期の近点の方位 0° —— 宣言) */
    pairs: Object.freeze(['both', 'first', 'second', 'anti']),
    /** 自転 ÷ 公転の 2 つの設定(sync = 冥王星–カロンの型・fast = 非同期の例 —— どちらも宣言の値) */
    spins: Object.freeze({ sync: 1, fast: 100 }),
    gType: 'recv2', eta: 0.0974, e: 0.1, eps: 1e-6,
    /** 線形の範囲の印(実在の系の |d_回転|/v の目安がこれを超えると一次外挿が壊れる) */
    linearMax: 1e-3,
  }),
});

/* ───────── 小道具 ───────── */
/** η → 質量(M = 1 —— m_1 ≥ m_2) */
export function massesOfEta(eta) {
  if (!isFin(eta) || !(eta > 0) || eta > 0.25) throw new RangeError('massesOfEta: 0 < η ≤ 1/4');
  const m2 = (1 - Math.sqrt(Math.max(0, 1 - 4 * eta))) / 2;
  return { m1: 1 - m2, m2 };
}
export const etaOfQ = (q) => q / ((1 + q) * (1 + q));
const rotAbout = (axis, ang) => { const k = unit(axis), c = Math.cos(ang), s = Math.sin(ang);
  return (v) => add(add(scl(v, c), scl(crs(k, v), s)), scl(k, dot(k, v) * (1 - c))); };
/** 自転軸(軌道の軸 ẑ から傾き θ・方位 φ〔度〕) */
export const tiltAxis = (tiltDeg, azDeg = 0) => [Math.sin(tiltDeg * D2R) * Math.cos(azDeg * D2R), Math.sin(tiltDeg * D2R) * Math.sin(azDeg * D2R), Math.cos(tiltDeg * D2R)];

/* ───────── (1) 同期の零試験 ───────── */
/**
 * 二体(G = 1・M = 1・a = 1)の 1 つの位相の配置を作り、受け手 recv に対する源の座標変換の d と自転の滑りを coordTwist で読む。
 * op: { e, tiltDeg, async, conflate } のどれか 1 つ(省略は同期・円・軸一致)。selfRatio = W_ii ÷ w_ij。戻り値の大きさは公転の速さ n a = 1 で割った相対(無次元)。
 */
export function syncCase({ q, phase, recv, selfRatio = 1, op = {}, rot = null, frame = null }) {
  if (!(q > 0) || !isFin(phase) || ![0, 1].includes(recv) || !(selfRatio > 0)) throw new RangeError('syncCase: q > 0・位相・受け手 0/1・自己の重みの比 > 0');
  const e = op.e || 0;
  if (!(e >= 0 && e < 1)) throw new RangeError('syncCase: 0 ≤ e < 1');
  const m1 = 1 / (1 + q), m2 = q / (1 + q), n = 1, p = 1 - e * e, r = p / (1 + e * Math.cos(phase)), h = Math.sqrt(p);
  const rv = [r * Math.cos(phase), r * Math.sin(phase), 0], vv = [-Math.sin(phase) / h, (e + Math.cos(phase)) / h, 0];   // 相対(p_2 − p_1)の位置と速度(μ = 1)
  const spinMag = n * (op.async || 1);
  let B = [{ id: 'P', m: m1, x: scl(rv, -m2), v: scl(vv, -m2), omega: [0, 0, spinMag] }, { id: 'C', m: m2, x: scl(rv, m1), v: scl(vv, m1), omega: [0, 0, spinMag] }];
  // 源の軸の操作(傾き・混同)は源の側(受け手でない方)だけに当てる
  const src = 1 - recv;
  if (op.conflate) B[src].omega = [0, 0, n * op.conflate];
  else if (op.tiltDeg) B[src].omega = scl(tiltAxis(op.tiltDeg), spinMag);
  if (rot) B = B.map((b) => Object.assign({}, b, { x: rot(b.x), v: rot(b.v), omega: rot(b.omega) }));
  if (frame) B = B.map((b) => Object.assign({}, b, { v: sub(b.v, crs(frame, b.x)), omega: sub(b.omega, frame) }));
  const R = B[recv], S = B[src], w = S.m / Math.pow(nrm(sub(R.x, S.x)), 2);
  const out = coordTwist({ id: R.id, x: R.x, v: R.v, omega: R.omega, selfW: selfRatio * w }, [{ id: S.id, x: S.x, v: S.v, omega: S.omega, m: S.m }]);
  return { d: out.d, dTrans: out.dTrans, dRot: out.dRot, slip: out.spin.slip, dNorm: nrm(out.d), slipNorm: nrm(out.spin.slip), beta: out.ports[0].beta };
}
/** 零試験の表(質量比 × 位相 × 受け手 × 自己の重みの 3 列) */
export function syncNullTable(D = DECL.sync) {
  const rows = [];
  for (const q of D.massRatios) for (const ph of D.phases) for (const rc of D.receivers) for (const sr of D.selfRatios) {
    const c = syncCase({ q, phase: ph, recv: rc, selfRatio: sr });
    rows.push({ q, phase: ph, recv: rc, selfRatio: sr, dNorm: c.dNorm, slipNorm: c.slipNorm });
  }
  return { rows, maxD: Math.max(...rows.map((x) => x.dNorm)), maxSlip: Math.max(...rows.map((x) => x.slipNorm)) };
}
/** 操作 1 つの残差(質量比 × 位相 × 受け手 × 自己の重みの最大と、q = 0.122・位相 0.7・受け手 1・自己 1 の代表) */
function opMax(op, D) {
  let mx = 0, sx = 0, mt = 0, mr = 0;
  for (const q of D.massRatios) for (const ph of D.phases) for (const rc of D.receivers) for (const sr of D.selfRatios) {
    const c = syncCase({ q, phase: ph, recv: rc, selfRatio: sr, op });
    mx = Math.max(mx, c.dNorm); sx = Math.max(sx, c.slipNorm); mt = Math.max(mt, nrm(c.dTrans)); mr = Math.max(mr, nrm(c.dRot));
  }
  const rep = syncCase({ q: 0.122, phase: 0.7, recv: 1, selfRatio: 1, op });
  return { maxD: mx, maxSlip: sx, maxTrans: mt, maxRot: mr, repD: rep.dNorm, repSlip: rep.slipNorm, repBeta: rep.beta };
}
/** 操作の表と次数(宣言した探りの 3 点 —— 代表の配置の d と滑りの log の傾き) */
export function syncOpsTable(D = DECL.sync) {
  const kinds = [['ecc', 'e', D.ecc], ['tilt', 'tiltDeg', D.tiltDeg], ['async', 'async', D.async], ['conflate', 'conflate', D.conflate]];
  const rows = [];
  for (const [kind, key, vals] of kinds) for (const v of vals) rows.push(Object.assign({ kind, value: v }, opMax({ [key]: v }, D)));
  const order = {};
  for (const [kind, key, vals] of kinds) {
    if (kind === 'conflate') { order[kind] = null; continue; }
    const base = kind === 'async' ? Math.min(...vals.map((x) => Math.abs(x - 1))) : Math.min(...vals);
    const amt = D.orderProbe.map((f) => base * f), val = (x) => (kind === 'async' ? 1 + x : x);
    const ds = amt.map((x) => syncCase({ q: 0.122, phase: 0.7, recv: 1, selfRatio: 1, op: { [key]: val(x) } }));
    const sl = (a, b, f) => Math.log(f(ds[a]) / f(ds[b])) / Math.log(amt[a] / amt[b]);
    const sD = sl(1, 2, (c) => c.dNorm), sS = sl(1, 2, (c) => c.slipNorm);
    const cls = (s) => (!isFin(s) ? '0(探りで変わらない)' : Math.abs(s - 1) <= D.orderTol ? '一次' : Math.abs(s - 2) <= D.orderTol ? '二次' : '他(' + s.toFixed(3) + ')');
    order[kind] = { amounts: amt, dSlope: sD, slipSlope: sS, dOrder: cls(sD), slipOrder: ds.every((c) => c.slipNorm === 0) ? '0(滑りは作らない)' : cls(sS) };
  }
  return { rows, order };
}
/** 共変性(全体を一緒に回す回転・枠の回転)—— d の大きさと向き・滑りの不変 */
export function syncCovariance(D = DECL.sync) {
  const R = rotAbout(D.covAxis, D.covAngleDeg * D2R);
  let rotRel = 0, frameRel = 0;
  for (const op of [{}, { e: 0.2 }, { tiltDeg: 30 }, { async: 1.1 }]) for (const rc of [0, 1]) {
    const a = syncCase({ q: 0.3, phase: 0.7, recv: rc, op }), b = syncCase({ q: 0.3, phase: 0.7, recv: rc, op, rot: R }), f = syncCase({ q: 0.3, phase: 0.7, recv: rc, op, frame: D.frameOmega });
    const sc = Math.max(1, a.dNorm, a.slipNorm);   // 公転の速さ n a = 1 を床に(零の配置の d は丸めの桁)
    rotRel = Math.max(rotRel, nrm(sub(b.d, R(a.d))) / sc, nrm(sub(b.slip, R(a.slip))) / sc);
    frameRel = Math.max(frameRel, nrm(sub(f.d, a.d)) / sc, nrm(sub(f.slip, a.slip)) / sc);
  }
  return { rotRel, frameRel };
}

/* ───────── (2) 二体の同時発展 ───────── */
/**
 * opt: { eta, e, eps, g: { pair, n } | null, k1: bool, spins: null | [s1:[3], s2:[3]](公転の平均運動 n = 1 の単位 —— 並進引きずりの回転の分), stepsPerOrbit, nOrb, plane: 回転の関数 | null }
 * 戻り値(1 公転あたり —— 無摂動の同じ刻みの走行との差の傾き): aps・dlam・de・tilt[2](公転面の法線の初期の面の基底での成分の率)・ρ・share・dPoverP・ledger(E・L・重心)
 */
export function twoBody({ eta, e, eps, g = null, k1 = false, spins = null, stepsPerOrbit = DECL.grid.stepsPerOrbit, nOrb = DECL.grid.nOrb, plane = null, offCache = null }) {
  if (!(eps > 0) || !(e >= 0 && e < 0.9) || !isFin(stepsPerOrbit) || !(nOrb >= 2)) throw new RangeError('twoBody: ε > 0・0 ≤ e < 0.9・刻み・公転の数 ≥ 2');
  if (g && !(['receiver', 'symmetric'].includes(g.pair) && isFin(g.n))) throw new RangeError('twoBody: g は { pair: receiver|symmetric, n }');
  if (spins && !(Array.isArray(spins) && spins.length === 2 && spins.every((s) => Array.isArray(s) && s.length === 3 && s.every(isFin)))) throw new RangeError('twoBody: spins は [s1, s2](3 成分)');
  const { m1, m2 } = massesOfEta(eta), b = 10 * eps, P3 = plane || ((v) => v);
  const P0 = P3([1, 0, 0]), Q0 = P3([0, 1, 0]), W0 = P3([0, 0, 1]);
  const S1 = spins ? P3(spins[0]) : null, S2 = spins ? P3(spins[1]) : null;
  // 相対の軌道(近点から —— μ = 1・a = 1)
  const orb0 = { a: 1, e, P: P0, Q: Q0, W: W0, mu: 1 }, st0 = stateAt(orb0, 0);
  const run = (on) => {
    const gp = on && g ? g.pair : null, gn = on && g ? g.n : 0, kk = on && k1, sp = on && spins;
    const f = (s, o) => {
      const dx = s[3] - s[0], dy = s[4] - s[1], dz = s[5] - s[2], r2 = dx * dx + dy * dy + dz * dz, r = Math.sqrt(r2), r3 = r2 * r;
      let g1 = 1, g2 = 1;
      if (gp === 'receiver') { g1 = Math.exp(-2 * gn * eps * m2 / r); g2 = Math.exp(-2 * gn * eps * m1 / r); }
      else if (gp === 'symmetric') { g1 = g2 = Math.exp(-gn * eps / r); }
      const k1x = g1 * m2 / r3, k2x = g2 * m1 / r3;
      // 速度の型 d(K1 の並進と並進引きずりの回転の分 —— β_ij = 10 ε m_j/r)
      let d1x = 0, d1y = 0, d1z = 0, d2x = 0, d2y = 0, d2z = 0;
      if (kk || sp) {
        const b12 = b * m2 / r, b21 = b * m1 / r;
        if (kk) { const rvx = s[9] - s[6], rvy = s[10] - s[7], rvz = s[11] - s[8]; d1x += b12 * rvx; d1y += b12 * rvy; d1z += b12 * rvz; d2x -= b21 * rvx; d2y -= b21 * rvy; d2z -= b21 * rvz; }
        if (sp) {   // d_1 += β_12 s_2 × (p_1 − p_2) = −β_12 s_2 × Δ・d_2 += β_21 s_1 × Δ(Δ = p_2 − p_1)
          d1x -= b12 * (S2[1] * dz - S2[2] * dy); d1y -= b12 * (S2[2] * dx - S2[0] * dz); d1z -= b12 * (S2[0] * dy - S2[1] * dx);
          d2x += b21 * (S1[1] * dz - S1[2] * dy); d2y += b21 * (S1[2] * dx - S1[0] * dz); d2z += b21 * (S1[0] * dy - S1[1] * dx);
        }
      }
      o[0] = s[6] + d1x; o[1] = s[7] + d1y; o[2] = s[8] + d1z; o[3] = s[9] + d2x; o[4] = s[10] + d2y; o[5] = s[11] + d2z;
      o[6] = k1x * dx; o[7] = k1x * dy; o[8] = k1x * dz; o[9] = -k2x * dx; o[10] = -k2x * dy; o[11] = -k2x * dz;
      return o;
    };
    const contact = (s) => { const o = f(s, new Float64Array(12)); return [o[0], o[1], o[2], o[3], o[4], o[5]]; };
    let s = new Float64Array(12);
    for (let j = 0; j < 3; j++) { s[j] = -m2 * st0.x[j]; s[3 + j] = m1 * st0.x[j]; s[6 + j] = -m2 * st0.v[j]; s[9 + j] = m1 * st0.v[j]; }
    // 接触の速度 ẋ = v + d を無摂動の Kepler の速度に置く(v = w − d(x, w) —— 一次)
    { const c = contact(s); for (let j = 0; j < 6; j++) s[6 + j] -= c[j] - s[6 + j]; }
    const h = 2 * Math.PI / stepsPerOrbit, k1a = new Float64Array(12), k2a = new Float64Array(12), k3a = new Float64Array(12), k4a = new Float64Array(12), tmp = new Float64Array(12), samp = [];
    const sample = (s1) => {
      const c = contact(s1), x = [s1[3] - s1[0], s1[4] - s1[1], s1[5] - s1[2]], w = [c[3] - c[0], c[4] - c[1], c[5] - c[2]], o = orbitOfState(x, w, 1);
      const aps = Math.atan2(dot(o.P, Q0), dot(o.P, P0)), lam = aps + o.M;
      const r = nrm(x), x1 = [s1[0], s1[1], s1[2]], x2 = [s1[3], s1[4], s1[5]], w1 = [c[0], c[1], c[2]], w2 = [c[3], c[4], c[5]];
      const E = 0.5 * m1 * dot(w1, w1) + 0.5 * m2 * dot(w2, w2) - m1 * m2 / r, L = add(scl(crs(x1, w1), m1), scl(crs(x2, w2), m2)), cm = add(scl(x1, m1), scl(x2, m2)), vcm = add(scl(w1, m1), scl(w2, m2));
      return { aps, lam, e: o.e, tx: dot(o.W, P0), ty: dot(o.W, Q0), E, Lz: dot(L, W0), Ln: nrm(L), cm: nrm(cm), vcm: nrm(vcm) };
    };
    const sub = Math.max(1, Math.round(stepsPerOrbit / DECL.grid.perOrbitSamples));
    samp.push(sample(s));
    for (let k = 1; k <= nOrb * stepsPerOrbit; k++) {
      f(s, k1a); for (let j = 0; j < 12; j++) tmp[j] = s[j] + 0.5 * h * k1a[j];
      f(tmp, k2a); for (let j = 0; j < 12; j++) tmp[j] = s[j] + 0.5 * h * k2a[j];
      f(tmp, k3a); for (let j = 0; j < 12; j++) tmp[j] = s[j] + h * k3a[j];
      f(tmp, k4a); for (let j = 0; j < 12; j++) s[j] += h * (k1a[j] + 2 * k2a[j] + 2 * k3a[j] + k4a[j]) / 6;
      if (k % sub === 0) samp.push(sample(s));
    }
    return { samp, perOrbit: Math.round(stepsPerOrbit / sub) };
  };
  const key = [e, stepsPerOrbit, nOrb, eta, plane ? 'p' : '0'].join('|');
  const off = offCache && offCache.has(key) ? offCache.get(key) : run(false);
  if (offCache && !offCache.has(key)) offCache.set(key, off);
  const onR = run(true), on = onR.samp, offS = off.samp, K = onR.perOrbit;
  // 公転ごとの窓の平均(接触の要素の周期の項を窓の平均で落とす —— 同じ時刻の標本は周期の差で位相がずれ、二次の項が大きく出るため)
  const slope = (y) => { const N = y.length, mx = (N - 1) / 2, my = y.reduce((a, q) => a + q, 0) / N; let sxy = 0, sxx = 0; for (let j = 0; j < N; j++) { sxy += (j - mx) * (y[j] - my); sxx += (j - mx) * (j - mx); } return sxy / sxx; };
  const winMean = (y) => { const out = []; for (let w = 0; w < nOrb; w++) { let a = 0; for (let j = 0; j < K; j++) a += y[w * K + j]; out.push(a / K); } return out; };
  const angDiff = (k) => { const y = on.map((q, j) => wrapPi(q[k] - offS[j][k])); for (let j = 1; j < y.length; j++) { let d = y[j] - y[j - 1]; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; y[j] = y[j - 1] + d; } return winMean(y); };
  const lin = (k) => winMean(on.map((q, j) => q[k] - offS[j][k]));
  const aps = e > 0 ? slope(angDiff('aps')) : null, dlam = slope(angDiff('lam')), de = slope(lin('e')), tx = slope(lin('tx')), ty = slope(lin('ty'));
  const q1 = 6 * Math.PI * eps / (1 - e * e), share = aps === null ? null : aps / q1;
  const orbE = winMean(on.map((q) => q.E)), orbL = winMean(on.map((q) => q.Ln)), E0 = Math.abs(on[0].E), Es = on.map((q) => q.E), Ls = on.map((q) => q.Ln);
  const ledger = { eSlopeRel: slope(orbE) / E0, eSpanRel: (Math.max(...Es) - Math.min(...Es)) / E0, lSlopeRel: slope(orbL) / on[0].Ln, lSpanRel: (Math.max(...Ls) - Math.min(...Ls)) / on[0].Ln,
    cmFinal: on[on.length - 1].cm, vcmFinal: on[on.length - 1].vcm, offESpanRel: (Math.max(...offS.map((q) => q.E)) - Math.min(...offS.map((q) => q.E))) / Math.abs(offS[0].E) };
  return { aps, dlam, dPoverP: -dlam / (2 * Math.PI), de, tilt: [tx, ty], tiltRate: Math.hypot(tx, ty), share, rho: share === null ? null : share - 1, q1, ledger, m1, m2 };
}
/** 一次の分担(入れた式 —— 第331便c の gLocShare + K1 の +5/3) */
export const firstShare = (g, k1, eta) => (g ? gLocShare(g.n, g.pair, eta) : 0) + (k1 ? 5 / 3 : 0);
/**
 * 受け手の型の重心の自己加速(一次 —— 本 lib で書いた条件付きの式・同時発展の積分器で照らす): 作用反作用の差 F = m_1 a_1 + m_2 a_2 ≈ (m_1 m_2/r²)(G_1 − G_2) r̂・G_1 − G_2 ≈ 2nε(m_1 − m_2)/r。
 * 公転の平均 ⟨r̂/r³⟩ = e P̂/[2a³(1 − e²)^{3/2}](μ = a = 1)から、1 公転あたりの重心の速さの増え |ΔV_cm| = 2π|n|ε η √(1 − 4η) e/(1 − e²)^{3/2}(対称の型は 0 —— 作用反作用を保つ)。
 * エンジンは同じ差を帳簿 gLocPx に積む(局所光速の場との交換 —— 閉じた保存とは書かない)。
 */
export function cmKickPerOrbit({ pair, n, eta, e, eps }) {
  if (pair !== 'receiver') return 0;
  return 2 * Math.PI * Math.abs(n) * eps * eta * Math.sqrt(Math.max(0, 1 - 4 * eta)) * e / Math.pow(1 - e * e, 1.5);
}
/** 還元の和(第333便c の binaryNumeric —— 相対の軌道に還元した G_loc と K1 の別々の計算の和) */
export function reducedShare(g, k1, eta, e, eps) {
  const r = binaryNumeric({ pair: g.pair, n: g.n, k1 }, eta, { e, eps });
  return r.total;
}

/* ───────── (3) 残差の法則 ───────── */
const termVal = (t, p) => (t === '1' ? 1 : t === 'eta' ? p.eta : t === 'eta2' ? p.eta * p.eta : t === 'e2' ? p.e * p.e : t === 'eps' ? p.eps : NaN);
/** 最小二乗(正規方程式 —— 列を尺度で割って解く)。pts = [{ eta, e, eps, rho }] */
export function fitFamily(fam, pts) {
  const T = fam.terms, k = T.length, A = pts.map((p) => T.map((t) => termVal(t, p))), y = pts.map((p) => p.rho);
  const sc = T.map((_, j) => Math.max(1e-300, ...A.map((r) => Math.abs(r[j]))));
  const M = Array.from({ length: k }, () => new Array(k + 1).fill(0));
  for (let i = 0; i < A.length; i++) for (let a = 0; a < k; a++) { const xa = A[i][a] / sc[a]; for (let c = 0; c < k; c++) M[a][c] += xa * A[i][c] / sc[c]; M[a][k] += xa * y[i]; }
  for (let c = 0; c < k; c++) { let pv = c; for (let r = c + 1; r < k; r++) if (Math.abs(M[r][c]) > Math.abs(M[pv][c])) pv = r; [M[c], M[pv]] = [M[pv], M[c]];
    for (let r = 0; r < k; r++) if (r !== c) { const fct = M[r][c] / M[c][c]; for (let cc = c; cc <= k; cc++) M[r][cc] -= fct * M[c][cc]; } }
  const coef = T.map((_, j) => M[j][k] / M[j][j] / sc[j]);
  const pred = (p) => T.reduce((s, t, j) => s + coef[j] * termVal(t, p), 0);
  const res = pts.map((p) => p.rho - pred(p));
  return { key: fam.key, terms: T.slice(), coef, pred, maxRes: Math.max(...res.map(Math.abs)), rms: Math.sqrt(res.reduce((s, x) => s + x * x, 0) / res.length) };
}
/** 族の判定(検証の系の点 —— { eta, e, eps, rho }) */
export function judgeFamily(fit, vpts, L = DECL.law) {
  const rows = vpts.map((p) => { const pr = fit.pred(p), tol = Math.max(L.tolRel * Math.abs(p.rho), L.tolAbs); return { id: p.id, pred: pr, num: p.rho, diff: pr - p.rho, tol, inside: Math.abs(pr - p.rho) <= tol }; });
  return { rows, law: rows.length > 0 && rows.every((q) => q.inside) };
}
/** 新しい項の寄与(設計の格子での最大 —— 係数 × 項の値) */
export function termContrib(fit, pts) {
  const out = {};
  fit.terms.forEach((t, j) => { if (t === '1' || t === 'eta') return; out[t] = Math.max(...pts.map((p) => Math.abs(fit.coef[j] * termVal(t, p)))); });
  return out;
}

/* ───────── (4) 傾いた自転軸 ───────── */
/** 軸の組と傾き → 2 天体の自転のベクトル(公転の n の単位) */
export function spinPair(pair, tiltDeg, mag) {
  const t = tiltAxis(tiltDeg, 0), ta = tiltAxis(tiltDeg, 180), z = [0, 0, 1];
  if (pair === 'both') return [scl(t, mag), scl(t, mag)];
  if (pair === 'first') return [scl(t, mag), scl(z, mag)];
  if (pair === 'second') return [scl(z, mag), scl(t, mag)];
  if (pair === 'anti') return [scl(t, mag), scl(ta, mag)];
  throw new RangeError('spinPair: 軸の組は both・first・second・anti');
}
/** 符号の変わり目の線形の内挿(格子の隣どうし —— 宣言した方法) */
export function zeroCrossings(xs, ys) {
  const out = [];
  for (let i = 1; i < xs.length; i++) { const a = ys[i - 1], b = ys[i]; if (!isFin(a) || !isFin(b)) continue; if (a === 0) out.push(xs[i - 1]); else if (a * b < 0) out.push(xs[i - 1] + (xs[i] - xs[i - 1]) * a / (a - b)); }
  if (ys.length && ys[ys.length - 1] === 0) out.push(xs[xs.length - 1]);
  return out;
}

/* ───────── 純関数の場面と門 ───────── */
export function pureScenes() {
  const S = {}, D = DECL.sync;
  // ① 同期の零(質量比 × 位相 × 受け手 × 自己の重み)
  S.null = syncNullTable();
  // ② 反例(各操作で 0 でない)と ③ 次数
  const ops = syncOpsTable();
  S.counter = ops.rows.map((q) => ({ kind: q.kind, value: q.value, maxD: q.maxD, repD: q.repD }));
  S.order = ops.order;
  // ④ 共変性
  S.cov = syncCovariance();
  // ⑤ 同時発展: 摂動なし(g = 0・K1 なし)で率が 0・η → 0 の今の組が 1 に近い・対称は重心が動かず受け手(不等質量)は動く・全体の面を回しても同じ
  const quick = { stepsPerOrbit: 800, nOrb: 4 };
  S.zero = twoBody(Object.assign({ eta: 0.1, e: 0.3, eps: 1e-6, g: { pair: 'receiver', n: 0 }, k1: false }, quick));
  S.test = twoBody(Object.assign({ eta: 1e-6, e: 0.3, eps: 1e-6, g: { pair: 'receiver', n: 2 }, k1: true }, quick));
  S.symCm = twoBody(Object.assign({ eta: 0.1875, e: 0.3, eps: 1e-4, g: { pair: 'symmetric', n: 2 }, k1: false }, quick));
  S.recCm = twoBody(Object.assign({ eta: 0.1875, e: 0.3, eps: 1e-4, g: { pair: 'receiver', n: 2 }, k1: false }, quick));
  S.eqRecCm = twoBody(Object.assign({ eta: 0.25, e: 0.3, eps: 1e-4, g: { pair: 'receiver', n: 2 }, k1: false }, quick));
  const R = rotAbout([1, -2, 0.5], 50 * D2R);
  S.planeA = twoBody(Object.assign({ eta: 0.1875, e: 0.3, eps: 1e-6, g: { pair: 'receiver', n: 2 }, k1: true }, quick));
  S.planeB = twoBody(Object.assign({ eta: 0.1875, e: 0.3, eps: 1e-6, g: { pair: 'receiver', n: 2 }, k1: true, plane: R }, quick));
  // ⑥ 同期・円の並進引きずり(K1 の並進 + 回転の分・s = n)は d = 0 —— 周期も e も動かない
  S.syncRun = twoBody(Object.assign({ eta: 0.0974, e: 0, eps: 1e-6, g: null, k1: true, spins: [[0, 0, 1], [0, 0, 1]] }, quick));
  S.k1Run = twoBody(Object.assign({ eta: 0.0974, e: 0, eps: 1e-6, g: null, k1: true }, quick));
  // ⑦ 族の当てはめ(作った点で係数が戻る)
  const pts = []; for (const eta of [0.01, 0.1, 0.2]) for (const e of [0.1, 0.5]) for (const eps of [1e-6, 1e-4]) pts.push({ eta, e, eps, rho: 0.3 + 1.2 * eta - 0.7 * eta * eta + 0.05 * e * e + 3 * eps });
  S.fit = fitFamily(DECL.law.families[3], pts);
  // ⑧ 入力の拒否
  const rejects = (fn) => { try { fn(); return false; } catch (e) { return e instanceof RangeError; } };
  S.rejects = [rejects(() => syncCase({ q: 0, phase: 0, recv: 0 })), rejects(() => syncCase({ q: 1, phase: 0, recv: 2 })), rejects(() => twoBody({ eta: 0.3, e: 0.1, eps: 1e-6 })),
    rejects(() => twoBody({ eta: 0.1, e: 0.95, eps: 1e-6 })), rejects(() => spinPair('x', 10, 1)), rejects(() => massesOfEta(0))];
  return S;
}
export function pureGates(S) {
  const D = DECL.sync, rel = (a, b) => Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b), 1e-300);
  const fc = S.fit.coef;
  return {
    syncNull: S.null.maxD <= D.nullTol && S.null.maxSlip <= D.nullTol && S.null.rows.length === D.massRatios.length * D.phases.length * D.receivers.length * D.selfRatios.length,
    counter: S.counter.every((q) => q.maxD >= D.counterMin),
    order: S.order.ecc.dOrder === '一次' && S.order.tilt.dOrder === '一次' && S.order.async.dOrder === '一次' && S.order.tilt.slipOrder === '一次',
    cov: S.cov.rotRel <= 1e-12 && S.cov.frameRel <= 1e-12,
    zeroRun: S.zero.aps === 0 && S.zero.dlam === 0 && S.zero.de === 0 && S.zero.tiltRate === 0,
    testParticle: Math.abs(S.test.share - 1) <= 1e-3,
    momentum: S.symCm.ledger.cmFinal <= 1e-12 && S.recCm.ledger.cmFinal >= 1e-8 && S.eqRecCm.ledger.cmFinal <= 1e-12,
    planeCov: rel(S.planeA.aps, S.planeB.aps) <= 1e-8 && S.planeB.tiltRate <= 1e-12,
    syncDrag: Math.abs(S.syncRun.dlam) <= 1e-12 && Math.abs(S.syncRun.de) <= 1e-12 && Math.abs(S.k1Run.dlam) >= 1e-8,
    fit: rel(fc[0], 0.3) <= 1e-8 && rel(fc[1], 1.2) <= 1e-8 && rel(fc[2], -0.7) <= 1e-8 && rel(fc[3], 0.05) <= 1e-8 && rel(fc[4], 3) <= 1e-6,
    rejects: S.rejects.every(Boolean),
  };
}
export { BINARY_TYPES, orbitOfState, vec };
