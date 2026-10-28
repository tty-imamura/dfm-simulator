// 第318便b(原仮定者の指示(第120報)の決断事項 AN436・AN437・AN439・AN440・AN442・統括の検証項目 R255): **衛星の次の正本の純関数**
// (html を読まない —— 在位の本の値は HP を引数で受ける。器 tests/exp-w318b-satnext.mjs が使う)。
//
// ■ 何をするか(n = 2・K1 のまま —— 物理・在位の本の宣言・エンジンの式・受理の判定は変えない)
//   ・AN439: 衛星の器の q11 を在位の惑星 7 本と同じ宣言の形 V2 で作る(`{law:"inertial", invSq:{kernel:"k1", rdRule:"kappaM"}, pairs:"all", history:"positions",
//     initMotion:"observed"}` —— 並進だけ・外殻なし・spinDrag なし。G_loc は在位の {law:"kappaC2"})。本の写しは第315便d の lib(tests/lib-w315d-satk1.mjs)の bookOf の出力を
//     写して relativeDrag だけを差し替える(第317便c の V2 と同じ写し —— 既存の lib の関数と版は変えない)。
//   ・AN436: 変種(走行の前に宣言 —— 結果を見て変えない)
//       V1a  主の列: 太陽の引きずりの対を外す(relativeDrag.pairs = [[1,2]] —— 三体の並び [太陽 0, 母惑星 1, 衛星 2]・重力は残す)
//       V0   通常の三体(残す)
//       V0 − V1a は太陽の引きずりの効きの記録の列 —— 初期の分解と軌道の変化を含む反実仮想の差で、独立な線形の寄与の和とは扱わない
//   ・AN440: トリトンの V3 = 三体の初期状態から**初期の母惑星の位置と速度を全粒子から引くガリレイの変換**(build は状態を置き直さない —— t = 0 の母惑星は原点)。
//     母惑星が常に原点にいる相対の運動方程式(母惑星の加速度と移送を差し引く式 —— 「真の相対の積分」)はエンジンに無く、本 lib も作らない(区別して書く)。
//   ・AN437: 窓は母惑星の公転周期 P_母 の整数倍(共通の座標時刻 —— 主の窓 W1 = (0, P_母]・確かめの窓 W2 = (P_母/2, 3P_母/2] —— 別の開始位相)。
//     模型(走行の前に宣言): L 模型(直線 + 衛星の位置の角 θ の 1〜3 倍の調和 —— apsisRate と同じ列)に、λ☉(母惑星の太陽のまわりの平均の経度 λ☉(t) = λ☉,0 + n_母 t)の
//     1 倍・2 倍の調和(cos λ☉・sin λ☉・cos 2λ☉・sin 2λ☉)を足した型(模型 LS)。調和は cos・sin の対なので λ☉,0 の取り方は回帰の値を変えない(張る空間が同じ)。
//   ・AN442: 共通の測る量 M0(窓の終端を共通の座標時刻で切った q10 と q11 の回帰の差)・判定は第316便d の HARM_RULE の R1 ∧ R2 の型(閾値 1e-2 は変えない)・
//     差の直接の回帰は回る ê₁₀ を主(固定の ê₀ は記録)・1 ulp の初期値の差は丸めの床の診断の列(合否に使わない)・有限の格子の通過と永年の値の確定を区別する。
//
// ■ 言わないこと: 「フィットした」「較正した」「収束した」「完全に一致」「法則を確かめた」「検証が完了した」。近似要素の種を観測レコードと呼ばない。
//   数値の帯は観測の 3σ ではない。V1a を通常の三体の永年の予測に置き換えない(切り口 —— 太陽の引きずりの効きの否定ではない)。
import * as AP from './lib-w304e-apsis.mjs';
import * as L from './lib-w315d-satk1.mjs';
import * as C from './lib-w317c-satcut.mjs';
import * as M from './lib-w317a-satmeas.mjs';
export const LIB_VERSION = 'w318b-satnext-lib-1';
const clone = (x) => JSON.parse(JSON.stringify(x));
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const nrm = (a) => Math.hypot(a[0], a[1], a[2]);

/* ───────── AN439: q11 の宣言の形(在位の惑星 7 本と同じ —— 第317便c の V2)───────── */
/** q11 の relativeDrag(在位の 7 本の K1 の宣言 —— 並進だけ・外殻なし・spinDrag なし) */
export const Q11_DRAG = C.IN_POS_K1_DRAG;
/** 衛星の器の q11 の本(第315便d の bookOf の写しの relativeDrag を在位の宣言の形へ差し替える —— q00・q10 は bookOf のまま) */
export function v2Book(HP, sat, sys, kind, o = {}) {
  const b = L.bookOf(HP, sat, sys, kind, { seed: o.seed, stepsPerOrbit: o.stepsPerOrbit });
  if (L.KINDS[kind].drag) b.physics.relativeDrag = clone(Q11_DRAG);
  return b;
}

/* ───────── AN436・AN440: 変種(走行の前に宣言)───────── */
export const VARIANTS = Object.freeze([
  Object.freeze({ key: 'V1a', ja: '太陽の引きずりの対を外す(pairs [[1,2]] —— 重力は残す)—— 主の列', pairs: Object.freeze([Object.freeze([1, 2])]), galilean: false }),
  Object.freeze({ key: 'V0', ja: '通常の三体(q11 は在位の 7 本と同じ宣言の形)—— 残す列', pairs: null, galilean: false }),
  Object.freeze({ key: 'V3V1a', ja: '母惑星中心の写し(初期の母惑星の位置と速度を全粒子から引くガリレイの変換)+ V1a', pairs: Object.freeze([Object.freeze([1, 2])]), galilean: true })]);
export const variantOf = (k) => VARIANTS.find((v) => v.key === k) || null;
/** 浮動小数の 1 ulp 上(正の有限の数 —— 丸めの床の診断の列) */
export function nextUp(x) {
  if (!Number.isFinite(x)) return x;
  if (x === 0) return Number.MIN_VALUE;
  const f = new Float64Array([x]), b = new BigInt64Array(f.buffer);
  b[0] += (x > 0 ? 1n : -1n);
  return f[0];
}
/**
 * 三体の本(sys は 'three' だけ)。kind = q10 | q11・vkey = VARIANTS の鍵・o.ulp = true は衛星の初期の x を 1 ulp 上げる(q10 と q11 の両方 —— 診断の列)。
 * V1a・V0 の q10 は同じ本(relativeDrag は引きずりなし)。V3V1a は q10 もガリレイの変換。
 */
export function variantBook(HP, sat, kind, vkey, o = {}) {
  const v = variantOf(vkey); if (!v) throw new Error('変種が無い: ' + vkey);
  if (kind !== 'q10' && kind !== 'q11') throw new Error('走行の種類 ' + kind);
  const b = v2Book(HP, sat, 'three', kind, o);
  if (kind === 'q11' && v.pairs) b.physics.relativeDrag.pairs = clone(v.pairs);
  if (v.galilean) {   // 第317便c の V3 と同じ式(母惑星の位置と速度を全粒子から引く)
    const ip = b.timeRef.pair[0], pl = b.bodies[ip], s = [pl.x, pl.y, pl.z, pl.vx, pl.vy, pl.vz];
    for (const q of b.bodies) { q.x -= s[0]; q.y -= s[1]; q.z -= s[2]; q.vx -= s[3]; q.vy -= s[4]; q.vz -= s[5]; }
  }
  if (o.ulp) { const is = b.timeRef.pair[1]; b.bodies[is].x = nextUp(b.bodies[is].x); }
  return b;
}

/* ───────── AN437: 母惑星の公転周期と λ☉ ───────── */
/**
 * 母惑星の太陽に対する公転周期 P_母(凍結の写しの t = 0 の太陽と「母惑星 + 衛星の重心」の相対の状態 —— 二体の活力の式・μ = G(M☉ + m_母 + m_衛) ——
 * tests/lib-w317a-satmeas.mjs の synodicOf と同じ式)と平均運動 n_母、λ☉,0(t = 0 の母惑星の太陽からの向きの、衛星の t = 0 の軌道面の基底での角 —— 回帰の値に効かない位相)。
 */
export function parentPeriodOf(sd, basis) {
  const syn = M.synodicOf(sd), P = L.parentOf(sd.parent), r0 = [P.planet.x - P.sun.x, P.planet.y - P.sun.y, P.planet.z - P.sun.z];
  const lam0 = basis ? Math.atan2(dot(r0, basis.Q), dot(r0, basis.P)) : 0;
  return { Pparent: syn.Pplanet, nParent: 2 * Math.PI / syn.Pplanet, lam0, orbitsPerParent: syn.Pplanet / sd.P, sense: syn.sense };
}
/** 標本の時刻の列 → λ☉ の列(平均の経度 —— 時刻の一次) */
export const lamOf = (t, pp) => t.map((x) => pp.lam0 + pp.nParent * x);

/* ───────── 回帰(L と LS —— apsisRate と同じ列の順・同じ解き方。KL = 0 は apsisRate とビット同一)───────── */
/** 模型(走行の前に宣言) */
export const MODELS = Object.freeze([
  Object.freeze({ key: 'LS', K: 3, KL: 2, ja: 'L 模型 + λ☉ の 1 倍・2 倍の調和(主)' }),
  Object.freeze({ key: 'L', K: 3, KL: 0, ja: 'L 模型(直線 + 衛星の位置の角の 1〜3 倍の調和 —— 記録)' })]);
export const modelOf = (k) => MODELS.find((m) => m.key === k) || null;
const rowLS = (dt, th, lam, K, KL) => { const row = [1, dt]; for (let k = 1; k <= K; k++) row.push(Math.cos(k * th), Math.sin(k * th)); for (let j = 1; j <= KL; j++) row.push(Math.cos(j * lam), Math.sin(j * lam)); return row; };
/** 窓 t0 < t ≤ t1 の計画行列(q10 の θ と λ☉ —— 差の回帰と同じ行列) */
export function designOf(s, lam, o) {
  const idx = M.idxOf(s.t, o.t0, o.t1), cols = 2 + 2 * o.K + 2 * o.KL;
  if (idx.length < cols + 4) return null;
  const tm = (s.t[idx[0]] + s.t[idx[idx.length - 1]]) / 2, th = o.th || s.th;
  return { idx, cols, tm, X: idx.map((i) => rowLS(s.t[i] - tm, th[i], lam ? lam[i] : 0, o.K, o.KL)) };
}
/** 離心ベクトルの成分の回帰(率 = (A D − C B)/(A² + C²) —— 本の時間あたり rad)。o.diag で条件数・実効ランク・形式の標準誤差 */
export function fitLS(s, lam, o) {
  const Dm = o.design || designOf(s, lam, o); if (!Dm) return null;
  const R = AP.lsqMulti(Dm.X, [Dm.idx.map((i) => s.eP[i]), Dm.idx.map((i) => s.eQ[i])]); if (!R) return null;
  const [A, B] = R[0].c, [C, D] = R[1].c, e2 = A * A + C * C, out = { rate: (A * D - C * B) / e2, e: Math.sqrt(e2), varpi: Math.atan2(C, A), A, B, C, D, n: Dm.idx.length, cols: Dm.cols, tm: Dm.tm, rms: [R[0].rms, R[1].rms],
    harmLam: o.KL ? [0, 1].map((j) => { let ss = 0; for (let c = 2 + 2 * o.K; c < Dm.cols; c++) ss += R[j].c[c] * R[j].c[c]; return Math.sqrt(ss); }) : null };
  if (o.diag) {
    const dg = o.diagOf || M.designDiag(Dm.X), dof = Math.max(1, Dm.idx.length - Dm.cols), sP2 = R[0].rms * R[0].rms * Dm.idx.length / dof, sQ2 = R[1].rms * R[1].rms * Dm.idx.length / dof;
    Object.assign(out, { cond: dg.cond, rank: dg.rank, se: dg.invTT !== null ? Math.sqrt((C * C * sP2 + A * A * sQ2) * dg.invTT) / e2 : null });
  }
  return out;
}
/**
 * 差の系列の直接の回帰(s10・s11 は同じ時刻の標本)。計画行列は q10 の θ と λ☉(模型の列)。
 * 回る ê₁₀(主 —— AN442): 基準の向きを q10 の回帰の永年の離心ベクトル (A + Bτ, C + Dτ) に回した Δϖ⊥ の傾き c1rot。
 * 固定の ê₀(記録): q10 の窓の平均の離心ベクトルの向きに垂直な成分の傾き c1。
 */
export function diffFitLS(s10, s11, lam, o) {
  const Dm = o.design || designOf(s10, lam, o); if (!Dm) return null;
  for (const i of Dm.idx) if (!Object.is(s10.t[i], s11.t[i])) return { sameTimes: false };
  const f10 = fitLS(s10, lam, Object.assign({}, o, { design: Dm, diag: false }));
  let mP = 0, mQ = 0; for (const i of Dm.idx) { mP += s10.eP[i]; mQ += s10.eQ[i]; } mP /= Dm.idx.length; mQ /= Dm.idx.length;
  const e0 = Math.hypot(mP, mQ), u = [mP / e0, mQ / e0];
  const dP = Dm.idx.map((i) => s11.eP[i] - s10.eP[i]), dQ = Dm.idx.map((i) => s11.eQ[i] - s10.eQ[i]);
  const yFix = dP.map((x, j) => (-u[1] * x + u[0] * dQ[j]) / e0);
  const yRot = Dm.idx.map((i, j) => { const tau = s10.t[i] - f10.tm, a = f10.A + f10.B * tau, c = f10.C + f10.D * tau, ee = a * a + c * c; return (-c * dP[j] + a * dQ[j]) / ee; });
  const R = AP.lsqMulti(Dm.X, [yRot, yFix]); if (!R) return null;
  const dg = o.diagOf || null, dof = Math.max(1, Dm.idx.length - Dm.cols), s2 = R[0].rms * R[0].rms * Dm.idx.length / dof;
  // 差の系列(回る ê₁₀ の Δϖ⊥ —— rad)の λ☉ の調和の振幅(1 倍・2 倍 —— 母惑星の公転周期の項の大きさの記録)
  const h0 = 2 + 2 * o.K, harmRot = o.KL ? Array.from({ length: o.KL }, (_, j) => Math.hypot(R[0].c[h0 + 2 * j], R[0].c[h0 + 2 * j + 1])) : null;
  return { sameTimes: true, n: Dm.idx.length, c1rot: R[0].c[1], c1fix: R[1].c[1], seRot: dg && Number.isFinite(dg.invTT) ? Math.sqrt(s2 * dg.invTT) : null, harmRot, rmsRot: R[0].rms };
}

/* ───────── 窓と判定(走行の前に固定 —— 閾値は HARM_RULE の 1e-2 のまま)───────── */
/** 窓(P_母 の倍数 —— W1 主・W2 確かめ〔別の開始位相〕) */
export const WINDOWS = Object.freeze([Object.freeze({ key: 'W1', from: 0, to: 1, ja: '主の窓 (0, P_母]' }), Object.freeze({ key: 'W2', from: 0.5, to: 1.5, ja: '確かめの窓 (P_母/2, 3P_母/2](別の開始位相)' })]);
export const RULE = Object.freeze({ version: 'w318b-rule-1', base: 'w316d-harm-rule-1', rel: 1e-2, mainWindow: 'W1', checkWindow: 'W2',
  note: 'R1 窓の安定: 最も細かい刻みの値の W1 と W2 の差 ≤ 両窓の最も細かい 2 刻みの帯の大きい方・R2 刻みの帯: W1 の 2 本の帯(粗–中・中–細)≤ 1e-2 × abs(W1 の最も細かい刻みの値)。'
    + '決まった = R1 ∧ R2(HARM_RULE の R1 ∧ R2 の型 —— 窓の対を W1・W2 に置いた・閾値は同じ)。帯が 1 本(刻み 2 つ)の格子は R2 を評価できない(偽)。決まらなければ「この予算では永年項として決まらない」' });
/** vals[W][div] = 差(″/世紀)。ds = 刻みの割り(粗 → 細) */
export function verdictOf(vals, ds, rel = RULE.rel) {
  const fin = Number.isFinite, fine = ds[ds.length - 1], fine2 = ds[ds.length - 2];
  const v = (w, d) => (vals[w] && fin(vals[w][d]) ? vals[w][d] : null);
  const bandF = (w) => (fine2 !== undefined && v(w, fine) !== null && v(w, fine2) !== null ? Math.abs(v(w, fine) - v(w, fine2)) : null);
  const v1 = v('W1', fine), v2 = v('W2', fine);
  const bands = []; for (let i = 1; i < ds.length; i++) bands.push(v('W1', ds[i]) !== null && v('W1', ds[i - 1]) !== null ? Math.abs(v('W1', ds[i]) - v('W1', ds[i - 1])) : null);
  const tol = v1 !== null && v1 !== 0 ? rel * Math.abs(v1) : null, dW = v1 !== null && v2 !== null ? Math.abs(v1 - v2) : null;
  const bW = bandF('W1') !== null && bandF('W2') !== null ? Math.max(bandF('W1'), bandF('W2')) : null;
  const R1 = dW !== null && bW !== null ? dW <= bW : false;
  const R2 = tol !== null && bands.length >= 2 && bands.every((b) => b !== null) ? bands.every((b) => b <= tol) : false;
  return { v: v1, vW2: v2, bands, bandW2: bandF('W2'), tol, dW, bW, r1Ratio: dW !== null && bW > 0 ? dW / bW : null,
    r2Ratio: tol !== null && bands.length && bands.every((b) => b !== null) ? Math.max(...bands) / tol : null, R1, R2, determined: R1 && R2 };
}

/* ───────── AN440: 離心率ベクトルの表の量(公転ごとの平均 —— 共通の座標時刻の標本)───────── */
/** 公転 N(標本の番号 (N−1)S ≤ j < N S —— 時刻 (N−1)P_seed < t ≤ N P_seed)の平均の離心ベクトルと平均の時刻 */
export function orbitMeanVec(s, N, S) {
  let p = 0, q = 0, t = 0, n = 0;
  for (let j = (N - 1) * S; j < N * S && j < s.t.length; j++) { p += s.eP[j]; q += s.eQ[j]; t += s.t[j]; n++; }
  return n === S ? { e: [p / n, q / n], t: t / n, n } : null;
}
/** 公転 1..N の Δe⊥/e の列の最小二乗の傾き(本の時間あたり rad —— q10 の公転ごとの平均の向きに対する垂直の成分) */
export function perpSlope(s10, s11, N, S) {
  const ts = [], ys = [];
  for (let m = 1; m <= N; m++) { const a = orbitMeanVec(s10, m, S), b = orbitMeanVec(s11, m, S); if (!a || !b) return null;
    const sp = M.splitVec(a.e, [b.e[0] - a.e[0], b.e[1] - a.e[1]]); ts.push(a.t); ys.push(sp.perpOverE); }
  const tm = ts.reduce((x, y) => x + y, 0) / ts.length, R = AP.lsqMulti(ts.map((t) => [1, t - tm]), [ys]);
  return R ? { slope: R[0].c[1], rms: R[0].rms } : null;
}
/** 離心率ベクトルの差の表の行(公転 N —— q10 の公転の平均の向きに対する平行・垂直) */
export function evecRow(s10, s11, N, S) {
  const a = orbitMeanVec(s10, N, S), b = orbitMeanVec(s11, N, S); if (!a || !b) return null;
  const d = [b.e[0] - a.e[0], b.e[1] - a.e[1]], sp = M.splitVec(a.e, d);
  return { N, tMean: a.t, dtMean: b.t - a.t, e10: sp.e, e10Vec: a.e, dVec: d, mag: sp.mag, par: sp.parOverE * sp.e, perp: sp.perpOverE * sp.e, perpOverE: sp.perpOverE };
}
