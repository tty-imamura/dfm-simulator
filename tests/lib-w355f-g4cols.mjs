// 第355便f(原仮定者の回答(2026-11-22 —— 回答 5・回答 6)AN948・AN962〜AN964・原仮定者の予定(〔第321便c〕に引いた文)・原仮定者の指示(2026-11-14)・統括の検証項目 R509):
//   **新しい geoPN=4 の計算の候補の列を、いま在る純関数の組み合わせとノブだけで並べ、低 N の小さな系(円盤 1 つ・楕円の型 1 つ)で「測れる量」を数える診断の純関数**。
//   列(COLS —— 走行の前に並べた。結果を見て選ばない。どれを主にするかは原仮定者に伺う —— この lib は決めない):
//     G0 = 対照(重力だけ —— 引きずりなし)
//     A1 = 場の契約の続き(軸引きずり → 円盤引きずりを推し量る)の低 N の代わり: 系の全質量を中心の 1 つの源に置き、その自転を系の L_z ÷ Σ m R² から推し量る(第337便e の `center`・spinMode 'L')
//     A2 = 同じ列の内の和(距離の則 —— 受け手より内の要素を 1 つの源に・自転は内の L_z ÷ Σ m R²)(第337便e の `inner`)
//     B1 = 引きずりの定義をそのまま流体に(並進引きずり —— 対の和・共通の分母・全成分)(第337便e の `symFull`)
//     B2 = 同じ列の中心方向の成分だけ(運動量と角運動量を保つ型)(第337便e の `symCentral`)
//     C1 = 両方(ノブ λ で切り替え): d = λ d(A2) + (1 − λ) d(B2)(λ = 1 で A2・λ = 0 で B2 に戻る —— 零試験)
//   作用は押し(dv/dt = a + γ d —— 第337便e の push・γ はノブ)。自己の重みは体積の内の積分 B(第337便e の主の候補)を時刻 0 の k 近傍の密度で置いて固定。
//   背景(銀河の外)は 0(W₀ = 0 —— 有限に置く列は未)。円盤引きずり・2 倍角の則の向き・アプリの積分は入れない(足りない口 —— 表の「足りない器」)。
//   **新しい物理は足さない** —— 力と引きずりは第335便f の `forces`・第337便e の `evalForces` を呼ぶだけ(写さない)。初期の配置(円盤と楕円の型)の作りだけをこの lib が持つ。
//
// ■ 単位: G = M = a = 1(第335便f と同じ)。N は解像の要素の数(実在の星の数ではない)。
// ■ 言わないこと: 表は宣言した列とノブの組の測った数(銀河の解・回転曲線の当否・暗黒物質や渦状腕の説明ではない)。列の採否を書かない。
import * as E5 from './lib-w335f-elliptical.mjs';
import * as F7 from './lib-w337e-fluid.mjs';

export const LIB_VERSION = 'w355f-g4cols-lib-1';
export const COLS = Object.freeze(['G0', 'A1', 'A2', 'B1', 'B2', 'C1']);
export const MODELS = Object.freeze(['disk', 'ellip']);
/** 列の型(第337便e の引きずりの型への写し —— C1 は 2 つの和) */
export const COL_DRAG = Object.freeze({ G0: null, A1: 'center', A2: 'inner', B1: 'symFull', B2: 'symCentral', C1: 'mix' });
/** 宣言(走行の前に置く —— 結果を見て変えない。変えたら版を上げて理由を書く) */
export const DECL = Object.freeze({
  idTol: 1e-12,
  alpha: 2,
  eps: 0.1,
  /** 円盤: Plummer の標本の z を q 倍に・速度 = fRot × 円の速さ φ̂ + fDisp × 元の標本の速度(z の成分は q 倍) */
  disk: Object.freeze({ q: 0.1, fRot: 0.9, fDisp: 0.3 }),
  /** 楕円の型: Plummer の標本を軸比 0.7 に(第335便f の `oblateOf`)・回転の支え(第335便f の `rotateOf` —— 反しの割合 rotFlip) */
  ellip: Object.freeze({ q: 0.7 }),
  /** 積分: 刻み h・步の数・測りの間隔(T = h × steps) */
  h: 0.025, steps: 800, every: 200,
  /** ノブ: 押しの係数 γ・C1 の割合 λ */
  gammas: Object.freeze([0.1, 0.3]),
  lambda: 0.5,
  /** 解像: 要素の数(倍にして幅を見る)・種 */
  Ns: Object.freeze([96, 192]),
  seeds: Object.freeze([1, 2, 3]),
  /** 回転曲線の帯(円柱の半径の質量の順の割合)・平坦の判定(内の帯 [0.3, 0.5] と外の帯 [0.7, 0.9] の log の傾きの大きさ) */
  bands: Object.freeze([[0.1, 0.3], [0.3, 0.5], [0.5, 0.7], [0.7, 0.9]]),
  flatTol: 0.15,
  /** 効果 ÷ 幅の物差し(2 以上を「幅より大きい」) */
  effOverWidth: 2,
  /** 幅の床(これより小さい幅は効果 ÷ 幅を書かない) */
  zeroFloor: 1e-12,
});
const fin = (x) => typeof x === 'number' && Number.isFinite(x);

/* ───────── 初期の配置 ───────── */
/** 円盤(Plummer の標本を z で潰し、面内の重力から円の速さを置く) */
export function diskModel({ N, seed }) {
  const D = DECL.disk, S = E5.cloneState(E5.sampleModel({ model: 'plummer', N, seed }).S);
  for (let i = 0; i < N; i++) S.z[i] *= D.q;
  const F = E5.forces(S, DECL.eps, false, DECL.alpha);
  for (let i = 0; i < N; i++) {
    const x = S.x[i], y = S.y[i], R = Math.hypot(x, y);
    const aR = R > 0 ? (x * F.ax[i] + y * F.ay[i]) / R : 0, vc = Math.sqrt(Math.max(0, -aR * R));
    const ex = R > 0 ? -y / R : 0, ey = R > 0 ? x / R : 0;
    S.vx[i] = D.fRot * vc * ex + D.fDisp * S.vx[i]; S.vy[i] = D.fRot * vc * ey + D.fDisp * S.vy[i]; S.vz[i] = D.fDisp * D.q * S.vz[i];
  }
  return E5.centre(S);
}
/** 楕円の型(第335便f の扁平と回転の支えの対照をそのまま) */
export function ellipModel({ N, seed }) {
  const S = E5.sampleModel({ model: 'plummer', N, seed }).S;
  return E5.rotateOf(E5.oblateOf(S, DECL.ellip.q, DECL.eps), E5.DECL.rotFlip, seed);
}
export function modelOf(model, N, seed) {
  if (model === 'disk') return diskModel({ N, seed });
  if (model === 'ellip') return ellipModel({ N, seed });
  throw new RangeError('modelOf: 模型は ' + MODELS.join('・'));
}

/* ───────── 列の力(重力 + 列の引きずり)───────── */
/** 列 col の力: { ax, ay, az, dx, dy, dz, pot }(G0 は d = 0)。selfW は自己の重みの列か null */
export function colForces(S, col, selfW, lambda = DECL.lambda) {
  if (!COLS.includes(col)) throw new RangeError('colForces: 列は ' + COLS.join('・'));
  const base = { alpha: DECL.alpha, eps: DECL.eps, selfW, spinMode: 'L' };
  if (col === 'G0') return F7.evalForces(S, { ...base, drag: 'none', selfW: null });
  if (col !== 'C1') return F7.evalForces(S, { ...base, drag: COL_DRAG[col] });
  if (!(fin(lambda) && lambda >= 0 && lambda <= 1)) throw new RangeError('colForces: 0 ≤ λ ≤ 1');
  const Fa = F7.evalForces(S, { ...base, drag: 'inner' }), Fb = F7.evalForces(S, { ...base, drag: 'symCentral' });
  const out = { ax: Fb.ax, ay: Fb.ay, az: Fb.az, pot: Fb.pot, dx: new Float64Array(S.N), dy: new Float64Array(S.N), dz: new Float64Array(S.N) };
  for (let i = 0; i < S.N; i++) { out.dx[i] = lambda * Fa.dx[i] + (1 - lambda) * Fb.dx[i]; out.dy[i] = lambda * Fa.dy[i] + (1 - lambda) * Fb.dy[i]; out.dz[i] = lambda * Fa.dz[i] + (1 - lambda) * Fb.dz[i]; }
  return out;
}
/** 自己の重み B(時刻 0 の k 近傍の密度 —— 第337便e の `selfWeightsOf`・`knnDensity`) */
export function selfB(S) { return F7.selfWeightsOf(S, 'B', { eps: DECL.eps, alpha: DECL.alpha, rho: F7.knnDensity(S) }); }

/* ───────── 測り ───────── */
/** 回転曲線の帯(z 軸のまわり・重心の枠): 帯ごとの平均の R と ⟨v_φ⟩(質量の重み) */
export function rotCurve(S) {
  const N = S.N; let M = 0, cx = 0, cy = 0, ux = 0, uy = 0;
  for (let i = 0; i < N; i++) { M += S.m[i]; cx += S.m[i] * S.x[i]; cy += S.m[i] * S.y[i]; ux += S.m[i] * S.vx[i]; uy += S.m[i] * S.vy[i]; }
  cx /= M; cy /= M; ux /= M; uy /= M;
  const R = new Float64Array(N), vp = new Float64Array(N), idx = [];
  for (let i = 0; i < N; i++) { const X = S.x[i] - cx, Y = S.y[i] - cy, r = Math.hypot(X, Y); R[i] = r; vp[i] = r > 0 ? (X * (S.vy[i] - uy) - Y * (S.vx[i] - ux)) / r : 0; idx.push(i); }
  idx.sort((p, q) => R[p] - R[q] || p - q);
  return DECL.bands.map(([lo, hi]) => { let c = 0, m = 0, sR = 0, sv = 0;
    for (const i of idx) { const c0 = c; c += S.m[i]; const mid = (c0 + c) / 2 / M; if (mid >= lo && mid < hi) { m += S.m[i]; sR += S.m[i] * R[i]; sv += S.m[i] * vp[i]; } }
    return { lo, hi, R: sR / m, vphi: sv / m }; });
}
/** 1 つの時刻の量: 回転曲線の帯・外の速さ・傾き(内 [0.3, 0.5] と外 [0.7, 0.9])・平坦の判定・r50・c/a・b/a・L_z・E */
export function measureAt(S) {
  const F = E5.forces(S, DECL.eps, false, DECL.alpha), q = E5.measure(S, F), rc = rotCurve(S), a = rc[1], b = rc[3];
  const slope = a.vphi > 0 && b.vphi > 0 ? Math.log(b.vphi / a.vphi) / Math.log(b.R / a.R) : null;
  return { bands: rc, outer: b.vphi, inner: a.vphi, slope, flat: slope !== null && Math.abs(slope) < DECL.flatTol, r50: q.r50, ca: q.ca, ba: q.ba, Lz: q.L[2], E: q.E };
}

/* ───────── 積分(蛙跳び KDK —— 第337便e の integrateFluid の push と同じ順)───────── */
/** spec = { col, gamma, lambda, self: 'B'|'none', h, steps, every } → { series:[{t, q}], state } */
export function runCol(S0, spec) {
  const { col, gamma = 0, lambda = DECL.lambda, self = 'B', h = DECL.h, steps = DECL.steps, every = DECL.every, measure = true } = spec;
  if (!(fin(h) && h > 0 && Number.isInteger(steps) && steps > 0 && Number.isInteger(every) && every > 0 && steps % every === 0)) throw new RangeError('runCol: h > 0・steps は every の倍数');
  if (!(self === 'B' || self === 'none')) throw new RangeError('runCol: 自己の重みは B か none');
  const S = E5.cloneState(S0), N = S.N, g = col === 'G0' ? 0 : gamma, sw = col === 'G0' || self === 'none' ? null : selfB(S);
  let F = colForces(S, col, sw, lambda);
  const series = measure ? [{ t: 0, q: measureAt(S) }] : [];
  const kick = (Fk) => { for (let i = 0; i < N; i++) { S.vx[i] += 0.5 * h * (Fk.ax[i] + g * Fk.dx[i]); S.vy[i] += 0.5 * h * (Fk.ay[i] + g * Fk.dy[i]); S.vz[i] += 0.5 * h * (Fk.az[i] + g * Fk.dz[i]); } };
  for (let s = 1; s <= steps; s++) {
    kick(F);
    for (let i = 0; i < N; i++) { S.x[i] += h * S.vx[i]; S.y[i] += h * S.vy[i]; S.z[i] += h * S.vz[i]; }
    F = colForces(S, col, sw, lambda);
    kick(F);
    if (measure && s % every === 0) series.push({ t: s * h, q: measureAt(S) });
  }
  return { series, state: S };
}

/* ───────── 列ごとの効果と幅 ───────── */
/** 1 本の走りの要約: 終わりの外の速さ・傾き・平坦・r50 と c/a の変化(時刻 0 から・短い窓 t1 から終わりまで —— 長い走りの形の保ち) */
export function summaryOf(series) {
  const q0 = series[0].q, q1 = series[1].q, qe = series[series.length - 1].q;
  return { outer: qe.outer, slope: qe.slope, flat: qe.flat, dR50: qe.r50 / q0.r50 - 1, dCa: qe.ca - q0.ca, dR50late: qe.r50 / q1.r50 - 1, dCalate: qe.ca - q1.ca, dLz: qe.Lz / q0.Lz - 1 };
}
/** 効果 = 列 − 対照(外の速さは比 −1)。rows は同じ模型・同じ列・同じ γ の (N, seed) の要約 {N, seed, s}・ctrl は同じ (N, seed) の対照 */
export const EFF_KEYS = Object.freeze(['outerRatio', 'slope', 'dR50', 'dCa', 'dR50late', 'dCalate', 'dLz']);
export function effectOf(s, c) {
  return { outerRatio: s.outer / c.outer, slope: s.slope !== null && c.slope !== null ? s.slope - c.slope : null, dR50: s.dR50 - c.dR50, dCa: s.dCa - c.dCa, dR50late: s.dR50late - c.dR50late, dCalate: s.dCalate - c.dCalate, dLz: s.dLz - c.dLz };
}
/** 幅: W_N = |種の平均(2N) − 種の平均(N)|・W_s = 2N の種の間の差の最大・幅 = max(W_N, W_s)・効果 ÷ 幅(外の速さの比は −1 を効果に) */
export function widthOf(effs) {
  const Ns = [...new Set(effs.map((e) => e.N))].sort((a, b) => a - b), lo = Ns[0], hi = Ns[Ns.length - 1], out = {};
  for (const k of EFF_KEYS) {
    const val = (e) => (k === 'outerRatio' ? e.eff[k] - 1 : e.eff[k]);
    const at = (n) => effs.filter((e) => e.N === n && val(e) !== null).map(val);
    const A = at(lo), B = at(hi);
    if (!A.length || !B.length) { out[k] = null; continue; }
    const mA = A.reduce((p, q) => p + q, 0) / A.length, mB = B.reduce((p, q) => p + q, 0) / B.length;
    const wN = Math.abs(mB - mA), wS = B.length > 1 ? Math.max(...B) - Math.min(...B) : 0, w = Math.max(wN, wS);
    const tiny = w <= DECL.zeroFloor;   // 効果も幅も床より小さい(保存する型の L_z ほか —— 解析的に 0)
    out[k] = { effect: mB, wN, wS, width: w, ratio: tiny ? null : Math.abs(mB) / w, beyond: tiny ? false : Math.abs(mB) / w >= DECL.effOverWidth };
  }
  return out;
}

/* ───────── 純関数の場面と門(零試験)───────── */
const relD = (a, b) => (a === b ? 0 : Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b), 1e-300));
function maxRelState(A, B) { let m = 0; for (const k of ['x', 'y', 'z', 'vx', 'vy', 'vz']) for (let i = 0; i < A.N; i++) m = Math.max(m, relD(A[k][i], B[k][i])); return m; }
export function pureScenes() {
  const S = {}, short = { h: DECL.h, steps: 40, every: 20 };   // ② の短い走り
  // ① 引きずり 0(γ = 0)で、どの列も対照(重力だけ)と同じ(短い 8 步 —— 尺度の走り直しで Math の呼び順が列ごとに違うので相対 1e-9 の床)
  { const S0 = diskModel({ N: 48, seed: 3 }), sh8 = { h: DECL.h, steps: 8, every: 4 }, g = runCol(S0, { col: 'G0', ...sh8 }).state;
    S.gamma0 = Object.fromEntries(COLS.filter((c) => c !== 'G0').map((c) => [c, maxRelState(runCol(S0, { col: c, gamma: 0, ...sh8 }).state, g)])); }
  // ② 自前の積分(自己の重みなし・B1)が第337便e の integrateFluid(push・symFull・none)と同じ
  { const S0 = ellipModel({ N: 48, seed: 3 }), mine = runCol(S0, { col: 'B1', gamma: 0.3, self: 'none', ...short, measure: false }).state;
    const ref = F7.integrateFluid(S0, { action: 'push', drag: 'symFull', self: 'none', alpha: DECL.alpha, eps: DECL.eps, gamma: 0.3, h: DECL.h, steps: 40, every: 20 }, { rh: 1, vrms: 1 }).state;
    S.vsFluid = maxRelState(mine, ref); }
  // ③ C1 の λ = 1 で A2・λ = 0 で B2 に戻る(力の値)
  { const S0 = diskModel({ N: 48, seed: 4 }), sw = selfB(S0), d = (P, Q) => { let m = 0; for (const k of ['dx', 'dy', 'dz', 'ax']) for (let i = 0; i < S0.N; i++) m = Math.max(m, relD(P[k][i], Q[k][i])); return m; };
    S.mix = { l1: d(colForces(S0, 'C1', sw, 1), colForces(S0, 'A2', sw)), l0: d(colForces(S0, 'C1', sw, 0), colForces(S0, 'B2', sw)) }; }
  // ④ 対の和の型(B1・B2)は運動量を保つ: |Σ m d| ÷ Σ m |d|・B2 は角運動量も: |Σ m (p × d)_z| ÷ Σ m |p × d|
  { const S0 = diskModel({ N: 64, seed: 5 }), sw = selfB(S0), mom = (F) => { let px = 0, py = 0, pz = 0, a = 0, lz = 0, la = 0;
      for (let i = 0; i < S0.N; i++) { const m = S0.m[i]; px += m * F.dx[i]; py += m * F.dy[i]; pz += m * F.dz[i]; a += m * Math.hypot(F.dx[i], F.dy[i], F.dz[i]); const t = S0.x[i] * F.dy[i] - S0.y[i] * F.dx[i]; lz += m * t; la += m * Math.abs(t); }
      return { p: Math.hypot(px, py, pz) / a, lz: Math.abs(lz) / la }; };
    S.cons = { B1: mom(colForces(S0, 'B1', sw)), B2: mom(colForces(S0, 'B2', sw)) }; }
  // ⑤ 円盤の初期: 面内の円の速さで外の帯の v_φ > 0・c/a < 0.3/楕円の型: c/a が 0.55〜0.85
  { const D = diskModel({ N: 96, seed: 1 }), E = ellipModel({ N: 96, seed: 1 }), qd = measureAt(D), qe = measureAt(E);
    S.init = { diskOuter: qd.outer, diskCa: qd.ca, ellipCa: qe.ca, ellipOuter: qe.outer }; }
  // ⑥ 剛体回転の円盤(全要素 v = Ω ẑ × p)では回転曲線の傾きが 1(測りの試し)・一定の v_φ では 0(重心の速さを引く分の 1e-3 の床)
  { const B = diskModel({ N: 96, seed: 2 }), R1 = E5.cloneState(B), R2 = E5.cloneState(B);
    for (let i = 0; i < B.N; i++) { R1.vx[i] = -0.5 * B.y[i]; R1.vy[i] = 0.5 * B.x[i]; R1.vz[i] = 0; const r = Math.hypot(B.x[i], B.y[i]); R2.vx[i] = r > 0 ? -0.4 * B.y[i] / r : 0; R2.vy[i] = r > 0 ? 0.4 * B.x[i] / r : 0; R2.vz[i] = 0; }
    S.curve = { rigid: measureAt(E5.centre(R1)).slope, flatv: measureAt(E5.centre(R2)).slope }; }
  // ⑦ 幅の算術(作った効果で: 2N の種 2 つ 0.3・0.5・N の平均 0.2 → 効果 0.4・W_N 0.2・W_s 0.2・比 2)
  { const mk = (N, v) => ({ N, eff: { outerRatio: 1 + v, slope: v, dR50: v, dCa: v, dR50late: v, dCalate: v, dLz: v } });
    S.width = widthOf([mk(96, 0.2), mk(96, 0.2), mk(192, 0.3), mk(192, 0.5)]).dR50; }
  // ⑧ 入力の拒否
  { let n = 0; const tries = [() => colForces(diskModel({ N: 8, seed: 1 }), 'X', null), () => modelOf('spiral', 8, 1), () => runCol(diskModel({ N: 8, seed: 1 }), { col: 'G0', h: 0.1, steps: 5, every: 2 }), () => colForces(diskModel({ N: 8, seed: 1 }), 'C1', null, 2), () => runCol(diskModel({ N: 8, seed: 1 }), { col: 'B1', self: 'A' })];
    for (const f of tries) { try { f(); } catch (e) { if (e instanceof RangeError) n++; } } S.reject = { n, of: tries.length }; }
  return S;
}
export function pureGates(S) {
  const T = DECL.idTol;
  return {
    gamma0: Object.values(S.gamma0).every((v) => v <= 1e-9) && Object.keys(S.gamma0).length === COLS.length - 1,
    vsFluid: S.vsFluid <= 1e-9,
    mix: S.mix.l1 <= T && S.mix.l0 <= T,
    cons: S.cons.B1.p <= 1e-12 && S.cons.B2.p <= 1e-12 && S.cons.B2.lz <= 1e-12,
    init: S.init.diskOuter > 0 && S.init.diskCa < 0.3 && S.init.ellipCa > 0.55 && S.init.ellipCa < 0.85,
    curve: Math.abs(S.curve.rigid - 1) <= 1e-9 && Math.abs(S.curve.flatv) <= 1e-3,
    width: Math.abs(S.width.effect - 0.4) <= 1e-12 && Math.abs(S.width.wN - 0.2) <= 1e-12 && Math.abs(S.width.wS - 0.2) <= 1e-12 && Math.abs(S.width.ratio - 2) <= 1e-9 && S.width.beyond === true,
    reject: S.reject.n === S.reject.of,
  };
}
