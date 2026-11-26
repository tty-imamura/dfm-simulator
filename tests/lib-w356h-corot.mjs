// 第356便h(原仮定者の指示(2026-11-26)・原仮定者の回答(2026-11-22)・統括の検証項目 R520):
//   **論文 4 の流れ「空間ごと回転して見えたのは引きずり」のための、「空間ごと回転して見える」量の候補を、第355便f の列(対照・A・B・C)で並べる小さい診断の純関数**。
//   量の候補(走行の前に置いた —— 結果を見て選ばない・1 つに決めない):
//     (i)  一緒に回る度合い —— 帯ごとの角速度 Ω_b = ⟨v_φ⟩_b ÷ ⟨R⟩_b の散り (Ω_max − Ω_min) ÷ |Ω の平均|(0 なら剛体のように一緒に回る見え方)
//          と、回転曲線の log の傾き(4 つの帯の ln⟨v_φ⟩_b を ln⟨R⟩_b に最小二乗 —— 剛体 +1・平坦 0・ケプラー −1/2)
//     (ii) 面内の速さの向きの、円運動からのずれ —— 粒ごとの角 θ = atan2(|v_R|, v_φ) の質量の重みの平均(度 —— 順回りの円運動 0・動径 90・逆回り 180)
//     (iii) 外縁の速さ —— 帯 [0.7, 0.9] の ⟨v_φ⟩(第355便f の量 —— 効果は対照との比)
//   帯は第355便f の `rotCurve`(円柱の半径の質量の順の割合 4 帯)を呼ぶ。列・模型・ノブ・積分は第355便f の `COLS`・`modelOf`・`runCol` を呼ぶだけ(写さない・本文は変えない)。
//   効果 = 列 − 対照(同じ模型・同じ粒の数・同じ種 —— 外縁は比)・離散化の幅 = max(粒の数を倍にした差, 2N の種の間の差)(第355便f の `widthOf` と同じ算術を、量の名を引数にして持つ —— 零試験で照合)。
//
// ■ 単位: G = M = a = 1(第355便f と同じ)。N は解像の要素の数(実在の星の数ではない)。
// ■ 言わないこと: 表は宣言した量・列・ノブの組の測った数(銀河の解・回転曲線の当否・暗黒物質の要否ではない)。列を選ばない。どの引きずりで読むかを決めない。
import * as G from './lib-w355f-g4cols.mjs';

export const LIB_VERSION = 'w356h-corot-lib-1';
/** 量の候補の名(表の列の順) */
export const QUANTS = Object.freeze(['omSpread', 'slope4', 'dirDev', 'outer']);
/** 効果の鍵(外縁は比 —— 幅の算術では −1 を効果に) */
export const EFF_KEYS = Object.freeze(['omSpread', 'slope4', 'dirDev', 'outerRatio']);
/** 宣言(走行の前に置く —— 結果を見て変えない) */
export const DECL = Object.freeze({
  idTol: 1e-12,
  /** 格子は第355便f と同じ(列 6 × 模型 2 × γ 2 × 粒 2 × 種 3) */
  cols: G.COLS, models: G.MODELS, gammas: G.DECL.gammas, Ns: G.DECL.Ns, seeds: G.DECL.seeds,
  /** 終わりの時刻(第355便f の刻み × 步の数) */
  T: G.DECL.h * G.DECL.steps,
  /** 効果 ÷ 幅の物差し(第355便f と同じ 2 —— これ以上を「幅の外」) */
  effOverWidth: G.DECL.effOverWidth,
  zeroFloor: G.DECL.zeroFloor,
  /** 「差」の型の葉(効果と幅)を正本に持つ絶対の桁(第355便の教訓 2 —— 形の判定は丸める前の数で) */
  digits: 9,
  /** 傾きの目安(読みの物差し —— 判定に使わない) */
  refSlopes: Object.freeze({ rigid: 1, flat: 0, kepler: -0.5 }),
});
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
export const r9 = (x) => (x === null || x === undefined ? null : Number(x.toFixed(DECL.digits)));

/* ───────── 量の候補 ───────── */
/** 状態 S(m・x・y・vx・vy・N)から量の候補 4 つ。帯は第355便f の rotCurve */
export function corotOf(S) {
  if (!(S && Number.isInteger(S.N) && S.N >= 8 && S.m && S.x && S.y && S.vx && S.vy)) throw new RangeError('corotOf: 状態は N ≥ 8 と m・x・y・vx・vy');
  const bands = G.rotCurve(S), om = bands.map((b) => b.vphi / b.R);
  const omMean = om.reduce((p, q) => p + q, 0) / om.length;
  const omSpread = omMean !== 0 ? (Math.max(...om) - Math.min(...om)) / Math.abs(omMean) : null;
  let slope4 = null;
  if (bands.every((b) => b.vphi > 0 && b.R > 0)) {
    const X = bands.map((b) => Math.log(b.R)), Y = bands.map((b) => Math.log(b.vphi)), n = X.length;
    const mx = X.reduce((p, q) => p + q, 0) / n, my = Y.reduce((p, q) => p + q, 0) / n;
    let sxy = 0, sxx = 0; for (let k = 0; k < n; k++) { sxy += (X[k] - mx) * (Y[k] - my); sxx += (X[k] - mx) ** 2; }
    slope4 = sxx > 0 ? sxy / sxx : null;
  }
  // (ii) 重心の枠(rotCurve と同じ引き方)で粒ごとの角
  let M = 0, cx = 0, cy = 0, ux = 0, uy = 0;
  for (let i = 0; i < S.N; i++) { M += S.m[i]; cx += S.m[i] * S.x[i]; cy += S.m[i] * S.y[i]; ux += S.m[i] * S.vx[i]; uy += S.m[i] * S.vy[i]; }
  cx /= M; cy /= M; ux /= M; uy /= M;
  let sw = 0, sa = 0;
  for (let i = 0; i < S.N; i++) {
    const X = S.x[i] - cx, Y = S.y[i] - cy, r = Math.hypot(X, Y), vx = S.vx[i] - ux, vy = S.vy[i] - uy;
    if (!(r > 0) || !(Math.hypot(vx, vy) > 0)) continue;
    const vR = (X * vx + Y * vy) / r, vP = (X * vy - Y * vx) / r;
    sw += S.m[i]; sa += S.m[i] * Math.atan2(Math.abs(vR), vP);
  }
  const dirDev = sw > 0 ? (sa / sw) * 180 / Math.PI : null;
  return { omSpread, slope4, dirDev, outer: bands[3].vphi, om, bands: bands.map((b) => ({ R: b.R, vphi: b.vphi })) };
}
/** 表に載せる 4 つだけ(om・bands を落とす) */
export const pick4 = (q) => ({ omSpread: q.omSpread, slope4: q.slope4, dirDev: q.dirDev, outer: q.outer });

/* ───────── 走り ───────── */
/** 1 本の走り: 時刻 0 と終わり(第355便f の runCol —— 刻み・步の数は第355便f の宣言のまま)の量の候補 */
export function runOne(model, N, seed, col, gamma, opts = {}) {
  if (!DECL.cols.includes(col)) throw new RangeError('runOne: 列は ' + DECL.cols.join('・'));
  if (!DECL.models.includes(model)) throw new RangeError('runOne: 模型は ' + DECL.models.join('・'));
  const S0 = G.modelOf(model, N, seed), st = G.runCol(S0, { col, gamma, measure: false, ...opts }).state;
  return { q0: pick4(corotOf(S0)), q: pick4(corotOf(st)) };
}

/* ───────── 効果と幅 ───────── */
/** 効果 = 列 − 対照(外縁は比)—— s・c は pick4 の形 */
export function effectOf(s, c) {
  const d = (a, b) => (a === null || b === null ? null : a - b);
  return { omSpread: d(s.omSpread, c.omSpread), slope4: d(s.slope4, c.slope4), dirDev: d(s.dirDev, c.dirDev), outerRatio: s.outer / c.outer };
}
/** 幅(第355便f の widthOf と同じ算術 —— 鍵の一覧と「比の鍵」を引数に): W_N = |種の平均(2N) − 種の平均(N)|・W_s = 2N の種の間の差の最大・幅 = max・効果 ÷ 幅 */
export function widthOf(effs, keys = EFF_KEYS, ratioKey = 'outerRatio') {
  const Ns = [...new Set(effs.map((e) => e.N))].sort((a, b) => a - b), lo = Ns[0], hi = Ns[Ns.length - 1], out = {};
  for (const k of keys) {
    const val = (e) => (e.eff[k] === null || e.eff[k] === undefined ? null : (k === ratioKey ? e.eff[k] - 1 : e.eff[k]));
    const at = (n) => effs.filter((e) => e.N === n && val(e) !== null).map(val);
    const A = at(lo), B = at(hi);
    if (!A.length || !B.length) { out[k] = null; continue; }
    const mA = A.reduce((p, q) => p + q, 0) / A.length, mB = B.reduce((p, q) => p + q, 0) / B.length;
    const wN = Math.abs(mB - mA), wS = B.length > 1 ? Math.max(...B) - Math.min(...B) : 0, w = Math.max(wN, wS);
    const tiny = w <= DECL.zeroFloor;
    out[k] = { effect: mB, wN, wS, width: w, ratio: tiny ? null : Math.abs(mB) / w, beyond: tiny ? false : Math.abs(mB) / w >= DECL.effOverWidth, nLo: A.length, nHi: B.length };
  }
  return out;
}
/** 正本へ書く形(効果・幅は絶対の桁 —— 判定 ratio・beyond は丸める前の数で) */
export function widthRound(w) {
  const o = {};
  for (const [k, v] of Object.entries(w)) o[k] = v === null ? null : { effect: r9(v.effect), wN: r9(v.wN), wS: r9(v.wS), width: r9(v.width), ratio: v.ratio === null ? null : r9(v.ratio), beyond: v.beyond, nLo: v.nLo, nHi: v.nHi };
  return o;
}
/** 対照の絶対の値(2N の種の平均と、種の間の差の最大) */
export function ctrlAbs(rows) {
  const out = {};
  for (const k of QUANTS) { const v = rows.map((r) => r[k]).filter((x) => x !== null);
    out[k] = v.length ? { mean: v.reduce((p, q) => p + q, 0) / v.length, spread: v.length > 1 ? Math.max(...v) - Math.min(...v) : 0, n: v.length } : null; }
  return out;
}

/* ───────── 作りものの円盤(零試験)───────── */
/** 20 粒・同じ質量・半径の段 6 つ(帯の 4 つが、それぞれ 1 つの半径だけを含む —— 帯の中点の割合 (k + 0.5)/20)。速さ v(R) は φ の向き(逆回りは sense −1) */
export function ringDisk(vOf, { sense = 1, radial = false } = {}) {
  const Rk = [0.5, 0.5, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5], N = Rk.length;
  const S = { N, m: new Float64Array(N).fill(1 / N), x: new Float64Array(N), y: new Float64Array(N), z: new Float64Array(N), vx: new Float64Array(N), vy: new Float64Array(N), vz: new Float64Array(N) };
  for (let i = 0; i < N; i++) {
    const g = Rk[i], grp = Rk.filter((r) => r === g).length, j = i - Rk.indexOf(g), ph = 2 * Math.PI * j / grp + 0.3 * g;
    const c = Math.cos(ph), s = Math.sin(ph), v = vOf(g);
    S.x[i] = g * c; S.y[i] = g * s;
    if (radial) { S.vx[i] = v * c; S.vy[i] = v * s; } else { S.vx[i] = -sense * v * s; S.vy[i] = sense * v * c; }
  }
  return S;
}

/* ───────── 零試験 ───────── */
const relD = (a, b) => (a === b ? 0 : Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b), 1e-300));
export function pureScenes() {
  const S = {};
  // ① 押しの係数 0 で、どの列も対照(重力だけ)と同じ量(8 步 —— 相対 1e-9 の床)
  { const sh8 = { h: G.DECL.h, steps: 8, every: 4 }, g = runOne('disk', 48, 3, 'G0', 0, sh8).q;
    S.gamma0 = Object.fromEntries(DECL.cols.filter((c) => c !== 'G0').map((c) => { const q = runOne('disk', 48, 3, c, 0, sh8).q; return [c, Math.max(...QUANTS.map((k) => relD(q[k], g[k])))]; })); }
  // ② 剛体の回転(Ω 0.5)を置いた作りものの円盤: 散り 0・傾き +1・向きのずれ 0
  { const q = corotOf(ringDisk((R) => 0.5 * R)); S.rigid = { omSpread: q.omSpread, slope4: q.slope4, dirDev: q.dirDev }; }
  // ③ ケプラーの円盤(v = R^(−1/2)): 傾き −1/2・平坦(v = 0.4): 傾き 0
  { const k = corotOf(ringDisk((R) => R ** -0.5)), f = corotOf(ringDisk(() => 0.4)); S.kepler = { slope4: k.slope4, omSpread: k.omSpread }; S.flat = { slope4: f.slope4 }; }
  // ④ (iii) 外縁の速さが第355便f の measureAt の outer と同じ(円盤と楕円の型の初期)
  { const D = G.modelOf('disk', 96, 1), E = G.modelOf('ellip', 96, 1); S.outer = { disk: relD(corotOf(D).outer, G.measureAt(D).outer), ellip: relD(corotOf(E).outer, G.measureAt(E).outer) }; }
  // ⑤ (ii) の物差し: 順回りの円運動 0°・動径の外向き 90°・逆回りの円運動 180°
  { S.dir = { pro: corotOf(ringDisk(() => 0.4)).dirDev, rad: corotOf(ringDisk(() => 0.4, { radial: true })).dirDev, retro: corotOf(ringDisk(() => 0.4, { sense: -1 })).dirDev }; }
  // ⑥ 幅の算術が第355便f の widthOf と同じ(作った効果 —— 第355便f の鍵の一覧で)
  { const mk = (N, v) => ({ N, eff: { outerRatio: 1 + v, slope: v, dR50: v, dCa: v, dR50late: v, dCalate: v, dLz: v } });
    const E = [mk(96, 0.2), mk(96, 0.25), mk(192, 0.3), mk(192, 0.5)], a = widthOf(E, G.EFF_KEYS, 'outerRatio'), b = G.widthOf(E);
    S.width = Math.max(...G.EFF_KEYS.map((k) => Math.max(relD(a[k].effect, b[k].effect), relD(a[k].width, b[k].width), relD(a[k].ratio, b[k].ratio), a[k].beyond === b[k].beyond ? 0 : 1))); }
  // ⑦ 対照どうしの効果は 0(外縁の比は 1)
  { const q = pick4(corotOf(G.modelOf('ellip', 48, 2))), e = effectOf(q, q); S.self = { omSpread: e.omSpread, slope4: e.slope4, dirDev: e.dirDev, outerRatio: e.outerRatio }; }
  // ⑧ 入力の拒否
  { let n = 0; const tries = [() => corotOf({ N: 4 }), () => corotOf(null), () => runOne('disk', 16, 1, 'X', 0), () => runOne('spiral', 16, 1, 'G0', 0), () => runOne('disk', 16, 1, 'G0', 0, { h: 0.1, steps: 5, every: 2 })];
    for (const f of tries) { try { f(); } catch (e) { if (e instanceof RangeError) n++; } } S.reject = { n, of: tries.length }; }
  return S;
}
export function pureGates(S) {
  const T = DECL.idTol;
  return {
    gamma0: Object.keys(S.gamma0).length === DECL.cols.length - 1 && Object.values(S.gamma0).every((v) => v <= 1e-9),
    rigid: Math.abs(S.rigid.omSpread) <= T && Math.abs(S.rigid.slope4 - 1) <= T && Math.abs(S.rigid.dirDev) <= 1e-9,
    kepler: Math.abs(S.kepler.slope4 + 0.5) <= T && S.kepler.omSpread > 0 && Math.abs(S.flat.slope4) <= T,
    outer: S.outer.disk === 0 && S.outer.ellip === 0,
    dir: Math.abs(S.dir.pro) <= 1e-9 && Math.abs(S.dir.rad - 90) <= 1e-9 && Math.abs(S.dir.retro - 180) <= 1e-9,
    width: S.width <= T,
    self: S.self.omSpread === 0 && S.self.slope4 === 0 && S.self.dirDev === 0 && S.self.outerRatio === 1,
    reject: S.reject.n === S.reject.of,
  };
}
