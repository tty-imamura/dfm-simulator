// 第342便c(原仮定者の回答(2026-11-18 —— 第142報)AN800「扁平率は、源の区切りを細かくしないで計算する近似を検証する。一番近い源の表面の接線方向から求められるのではないか」・
//   原仮定者の回答(2026-11-17 —— 第140報の回答)「扁平の則は、赤道面から離れた際の、軸引きずりの軸の傾きに効くのではないか。扁平で傾きが強くなるので、回転引きずりも強くなる」・
//   統括の検証項目 R374): **扁平の源を区切らない近似の候補の純関数**(段 oblateapprox-342c —— 器 tests/exp-w342c-oblateapprox.mjs・正本 tests/out/oblateapprox-342c.json)。
//   **探索の候補の表だけ** —— エンジン・内蔵の本・受理器・既存の lib の本文は変えない(第338便b・第340便h の lib は呼ぶだけ)。html を読まない・ファイルを読まない・ネットへ取りに行かない・乱数を使わない。
//   比べる相手(参照)は第341便d の正本 tests/out/oblatering-341d.json の h1 の軸の傾きの比(源の部位の和 61440 点と Richardson の外挿 —— 器の中の参照で、観測の値ではない)。
//   参照の表は器が読んで、この lib の関数へ数として渡す(この lib は参照の点を増やさない)。
//
// ■ 量: h1 の軸の傾きの比 = (扁平の源の場が源の自転の逆向きの軸となす角) ÷ (同じ物理の位置で見た等体積の球の源の同じ角)。源は体積を保つ回転楕円体
//   (赤道の半径 a = (1 − f)^(−1/3)・極の半径 c = (1 − f)^(2/3) —— 第341便d と同じ)・受け手は x = r (cos el, 0, sin el)・r = d a・sin el = s(高さ z/r)。
// ■ T1 一番近い表面の接線(原仮定者の案): 外の点から表面への最近点を、表面を割らずに法線の条件
//   a² ρ²/(a² + λ)² + c² z²/(c² + λ)² = 1 の非負の根 λ(Newton —— 左から単調に寄る)で求める(放射の向きに投影しない)。最近点の法線の仰角 ε_n と、球の仰角 θ(= 中心の向き)から
//   (i) K_t = ε_n/θ(係数なし)(ii) 1 + k f (a/r)^n g —— g = δ(= ε_n − θ・接線と球の接線のなす角)・sin δ・接線の軸の成分の差(cos θ − cos ε_n)・δ/θ(= K_t − 1)。
//   k を 1 に置いた形(係数なし)と、1 点(扁平率 0.098・d 1.5・高さ 0.01)だけで k を決めて残りの点で比べる形を分ける(べき n は 0〜3 を並べる)
//   (iii) 統括の参考の試作の「実効の傾きの比」1 + (tan φ/((c/a) tan θ) − 1)(a/(r + 表面までの距離))(c/a)(φ = 最近点の媒介変数の角 —— 根拠の無い置き方なので列の 1 つとして比べるだけ)。
// ■ T2 弦の向きの積分(源を区切らない別の方法 —— 統括の参考の試作): h1 の核は「向きの関数 g(û) × 距離の逆二乗」(第341便d の partsField の h1 —— 主の列 q = 1 を自分で写した形)。
//   密度が一様なら、受け手から見た体積の要素 ρ² dρ dΩ の ρ² が逆二乗と打ち消し、向き n̂ ごとに要るのは物質の中を通る弦の長さ L(n̂) だけ:
//   場 = (1/V) ∫ dΩ g(−n̂) L(n̂)。回転楕円体を単位の球に写すと(X = (x/a, y/a, z/c)・N = (n_x/a, n_y/a, n_z/c))L = 2 √((X·N)² − |N|²(|X|² − 1)) / |N|²(閉じた形)。
//   残る 2 つの角: 受け手から中心への向き ê0 のまわりの方位 ψ(周期の中点 nψ)× 中心からの角 θ ∈ [0, θ_max(ψ)](θ_max は接する円錐の閉じた式 —— 2 次式の正の根)。
//   縁で L は √(θ_max − θ) の形なので θ = θ_max (1 − (1 − ξ)²) と置き換えて ξ を Gauss–Legendre(nθ)。向きの数 nθ × nψ = 32・128・512。
// ■ 言わないこと: 接線で求まると分かったとは書かない(この列・この点ではこうだった)。扁平の効きが導けたとは書かない。環の厚みが分かったとは書かない。アプリが速くなったとは書かない
//   (向きの数・核の評価の回数は器の中の数)。試した範囲は「外の点・一様な密度の回転楕円体・逆二乗・h1 の傾きの比」だけ(密度の分布・ほかの次数・寄せる力・環の幅は別の試し)。
//   薄い角は atan2(外積の大きさ, 内積)(第340便h の thinAngle)。
import { twistAxis, muOf } from './lib-w338b-bevelknob.mjs';
import { thinAngle } from './lib-w340h-thin.mjs';

export const LIB_VERSION = 'w342c-oblateapprox-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const MU1 = muOf(1);

/* ───────── 宣言(走らせたノブの格子と判定の物差しの記録 —— 式の形の宣言ではない)───────── */
export const DECL = Object.freeze({
  /** 参照(第341便d の正本の t1.summary の q = 'h1Tilt' と 'h1Mag' の行 —— 扁平率 5 × 距離 7 × 高さ 0.01 と、扁平率 0.098 × 距離 7 × 高さ 0.1 = 42 点)。点は増やさない */
  ref: Object.freeze({ file: 'tests/out/oblatering-341d.json', q: 'h1Tilt', qMag: 'h1Mag', nPts: 42, nPtsNote: '第341便d の 61440 点の表(源の部位の和 960・3840・15360・61440 と Richardson の外挿)' }),
  fGrid: Object.freeze([0.05, 0.098, 0.2, 0.3, -0.1]), dGrid: Object.freeze([1.1, 1.24, 1.5, 1.95, 2, 2.27, 2.33]), sGrid: Object.freeze([0.01, 0.1]), sMain: 0.01, fMain: 0.098,
  /** 接線の形(g の 4 つ —— δ・sin δ・接線の軸の成分の差・δ/θ)× べき n 0〜3 × 係数(k = 1 の係数なし/1 点で決める) */
  gKinds: Object.freeze(['delta', 'sinDelta', 'axial', 'deltaOverTheta']), nGrid: Object.freeze([0, 1, 2, 3]),
  fitAt: Object.freeze({ f: 0.098, d: 1.5, s: 0.01 }),
  /** 弦の向きの積分の向きの数(nθ × nψ)—— 主は 128 */
  dirLevels: Object.freeze([[4, 8], [8, 16], [16, 32]]), dirMain: 1,
  /** 弦の門: 一番細かい向きの数で体積の求積の差 ≤ volTol・向きの数を 128 → 512 にした差 ≤ selfTol(自分の列の中の物差し —— 参照の幅とは別)*/
  volTol: 1e-9, selfTol: 1e-5,
  /** 最近点の Newton の回数の上限と止める幅(λ の相対)・弦の円錐の縁の判定の床 */
  newtonMax: 200, newtonTol: 1e-15, floor: 1e-12,
});
export const G_JA = Object.freeze({
  delta: 'g = δ(最近点の接線と球の接線のなす角 = ε_n − θ —— rad)',
  sinDelta: 'g = sin δ',
  axial: 'g = 接線の軸の成分の差(cos θ − cos ε_n —— 単位の接線の z の成分の、球との差)',
  deltaOverTheta: 'g = δ/θ(= K_t − 1 —— 角の比で書いた形)',
});

/* ───────── h1 の核(第341便d の partsField の h1 を自分で写した形)───────── */
/** 部位から受け手への単位の向き û の核: −(ẑ − u_z û) + μ₁ √(1 − u_z²) u_z û(主の列 q = 1・源の軸 ẑ)*/
export function h1Kernel(u) {
  const uz = u[2], c = Math.sqrt(Math.max(0, 1 - uz * uz)), k = MU1 * c * uz;
  return [uz * u[0] + k * u[0], uz * u[1] + k * u[1], -(1 - uz * uz) + k * uz];
}
/** 体積を保つ回転楕円体の半径(R_d = 1) */
export function radii(f) {
  if (!(fin(f) && f < 1)) throw new RangeError('radii: f < 1');
  return { a: Math.pow(1 - f, -1 / 3), c: Math.pow(1 - f, 2 / 3) };
}
/** 受け手の位置(距離 ÷ 赤道半径 d・高さ s = z/r)*/
export function receiver(f, d, s) {
  if (!(fin(d) && d > 0 && fin(s) && Math.abs(s) < 1)) throw new RangeError('receiver: d > 0・|s| < 1');
  const { a, c } = radii(f), r = d * a, ce = Math.sqrt(1 - s * s);
  return { a, c, r, x: [r * ce, 0, r * s], rho: r * ce, z: r * s };
}

/* ───────── T1 一番近い表面の接線 ───────── */
/** 外の点 (ρ, z) から回転楕円体(赤道 a・極 c)の表面への最近点: 法線の条件 F(λ) = a²ρ²/(a²+λ)² + c²z²/(c²+λ)² − 1 = 0 の非負の根(F は λ ≥ 0 で減る凸 —— λ = 0 から Newton で左から寄る)*/
export function nearestPoint(a, c, rho, z, D = DECL) {
  const F = (l) => (a * a * rho * rho) / ((a * a + l) * (a * a + l)) + (c * c * z * z) / ((c * c + l) * (c * c + l)) - 1;
  const dF = (l) => -2 * (a * a * rho * rho) / Math.pow(a * a + l, 3) - 2 * (c * c * z * z) / Math.pow(c * c + l, 3);
  if (!(F(0) > 0)) throw new RangeError('nearestPoint: 外の点でない');
  let l = 0, it = 0;
  for (; it < D.newtonMax; it++) { const st = -F(l) / dF(l); l += st; if (!(Math.abs(st) > D.newtonTol * Math.max(1, l))) break; }
  const rn = (a * a * rho) / (a * a + l), zn = (c * c * z) / (c * c + l);
  return { lambda: l, rho: rn, z: zn, iters: it + 1, onSurface: (rn * rn) / (a * a) + (zn * zn) / (c * c) - 1, dist: Math.hypot(rho - rn, z - zn) };
}
/** 1 点の接線の量: 法線の仰角 ε_n・球の仰角 θ・δ・K_t・g の 4 つ・参考の試作の実効の傾きの比 */
export function tangentRow(f, d, s, D = DECL) {
  const R = receiver(f, d, s), { a, c } = R, P = nearestPoint(a, c, R.rho, R.z, D);
  const epsN = Math.atan2(P.z / (c * c), P.rho / (a * a)), theta = Math.atan2(R.z, R.rho), delta = epsN - theta;
  const Kt = epsN / theta;
  const g = { delta, sinDelta: Math.sin(delta), axial: Math.cos(theta) - Math.cos(epsN), deltaOverTheta: delta / theta };
  // s → 0 の片側の極限(赤道の上は角がどちらも 0 —— 比は (a² + λ0)/(c² + λ0)・λ0 = a (ρ − a))
  const l0 = a * (R.r - a), Kt0 = (a * a + l0) / (c * c + l0);
  // 参考の試作の列(媒介変数の角 φ: 表面 (a cos φ, c sin φ)・tan φ = a z_n/(c ρ_n))
  const tanPhi = (a * P.z) / (c * P.rho), slopeRatio = tanPhi / ((c / a) * Math.tan(theta)), distA = P.dist / a;
  const effRatio = 1 + (slopeRatio - 1) * (1 / (d + distA)) * (c / a);
  return { f, d, s, a, c, lambda: P.lambda, iters: P.iters, onSurface: P.onSurface, nearest: [P.rho, P.z], distOverA: distA, epsN, theta, delta, Kt, Kt0, g, slopeRatio, effRatio };
}
/** (ii) 1 + k f (a/r)^n g の値(a/r = 1/d)*/
export const formValue = (T, gk, n, k) => 1 + k * T.f * Math.pow(1 / T.d, n) * T.g[gk];
/** 1 点で k を決める(参照の値 qRef を通る k)—— 分母が 0 なら null */
export function fitK(T, gk, n, qRef) { const den = T.f * Math.pow(1 / T.d, n) * T.g[gk]; return den !== 0 && fin(den) ? (qRef - 1) / den : null; }

/* ───────── T2 弦の向きの積分 ───────── */
const GL = new Map();
/** Gauss–Legendre の点と重み([−1, 1]・Newton で根を求める —— 固定の回数)*/
export function gaussLegendre(n) {
  if (GL.has(n)) return GL.get(n);
  const x = [], w = [];
  for (let i = 1; i <= n; i++) {
    let z = Math.cos(Math.PI * (i - 0.25) / (n + 0.5)), pp = 1;
    for (let it = 0; it < 60; it++) { let p1 = 1, p2 = 0; for (let j = 1; j <= n; j++) { const p3 = p2; p2 = p1; p1 = ((2 * j - 1) * z * p2 - (j - 1) * p3) / j; } pp = n * (z * p1 - p2) / (z * z - 1); const dz = p1 / pp; z -= dz; if (Math.abs(dz) < 1e-16) break; }
    x.push(z); w.push(2 / ((1 - z * z) * pp * pp));
  }
  const o = Object.freeze({ x: Object.freeze(x), w: Object.freeze(w) }); GL.set(n, o); return o;
}
/** 弦の向きの積分: 回転楕円体(a, c —— a² c = 1 で体積 4π/3)の一様な密度(質量 1)の h1 の場を外の点 x で。nθ × nψ の向き。
 *  戻り値 { v(場), volRatio(∫ (t₂³ − t₁³)/3 dΩ ÷ 体積 —— 向きの求積の零試験), nKernel(核の評価の回数), nDir } */
export function chordField(a, c, x, nt, np) {
  if (!(nt >= 1 && np >= 1)) throw new RangeError('chordField: 向きの数 ≥ 1');
  const r = nrm(x), e0 = [-x[0] / r, -x[1] / r, -x[2] / r];
  let e1 = [0, 0, 1]; { const dd = dot(e1, e0); e1 = [e1[0] - dd * e0[0], e1[1] - dd * e0[1], e1[2] - dd * e0[2]]; const m = nrm(e1); e1 = [e1[0] / m, e1[1] / m, e1[2] / m]; }
  const e2 = crs(e0, e1), A = (n) => [n[0] / a, n[1] / a, n[2] / c];
  const X = [x[0] / a, x[1] / a, x[2] / c], k1 = dot(X, X) - 1;
  if (!(k1 > 0)) throw new RangeError('chordField: 外の点でない');
  const N0 = A(e0), p = dot(X, N0), al = dot(N0, N0), V = (4 / 3) * Math.PI * a * a * c;
  const G = gaussLegendre(nt);
  let o0 = 0, o1 = 0, o2 = 0, vol = 0, nK = 0;
  for (let j = 0; j < np; j++) {
    const ps = 2 * Math.PI * (j + 0.5) / np, cp = Math.cos(ps), sp = Math.sin(ps), m = [cp * e1[0] + sp * e2[0], cp * e1[1] + sp * e2[1], cp * e1[2] + sp * e2[2]];
    const Nm = A(m), q = dot(X, Nm), be = dot(N0, Nm), ga = dot(Nm, Nm);
    // 接する円錐: (p + t q)² = k1 (α + 2 β t + γ t²)(t = tan θ)の正の根
    const qa = q * q - k1 * ga, qb = 2 * (p * q - k1 * be), qc = p * p - k1 * al;
    if (!(qc > 0 && qa < 0)) throw new RangeError('chordField: 円錐が半空間を超える(この器の外の配置)');
    const dsc = qb * qb - 4 * qa * qc, qq = -0.5 * (qb + (qb >= 0 ? 1 : -1) * Math.sqrt(dsc)), r1 = qq / qa, r2 = qc / qq, tmax = Math.atan(Math.max(r1, r2));
    for (let i = 0; i < nt; i++) {
      const xi = 0.5 * (G.x[i] + 1), wi = 0.5 * G.w[i], th = tmax * (1 - (1 - xi) * (1 - xi)), jac = 2 * tmax * (1 - xi);
      const st = Math.sin(th), ct = Math.cos(th), n = [ct * e0[0] + st * m[0], ct * e0[1] + st * m[1], ct * e0[2] + st * m[2]], N = A(n);
      const XN = dot(X, N), NN = dot(N, N), D2 = XN * XN - NN * k1;
      if (!(D2 > 0)) continue;
      const sq = Math.sqrt(D2), t1 = (-XN - sq) / NN, t2 = (-XN + sq) / NN, L = t2 - t1;
      const w = wi * jac * st * (2 * Math.PI / np), gv = h1Kernel([-n[0], -n[1], -n[2]]);
      o0 += w * L * gv[0]; o1 += w * L * gv[1]; o2 += w * L * gv[2]; vol += w * (t2 * t2 * t2 - t1 * t1 * t1) / 3; nK++;
    }
  }
  return { v: [o0 / V, o1 / V, o2 / V], volRatio: vol / V, nKernel: nK, nDir: nt * np };
}
/** 1 点の弦の行: 扁平の源と同じ物理の位置の等体積の球の源(a = c = 1)の場から、h1 の軸の傾きの比と場の強さの比 */
export function chordRow(f, d, s, [nt, np]) {
  const R = receiver(f, d, s), O = chordField(R.a, R.c, R.x, nt, np), S = chordField(1, 1, R.x, nt, np), down = [0, 0, -1];
  const tO = thinAngle(O.v, down), tS = thinAngle(S.v, down);
  return { f, d, s, nDir: nt * np, tiltRatio: tO / tS, magRatio: nrm(O.v) / nrm(S.v), tiltOblate: tO, tiltSphere: tS, volRatioOblate: O.volRatio, volRatioSphere: S.volRatio, nKernel: O.nKernel + S.nKernel };
}

/* ───────── 参照との並べ(器が読んだ参照の行を数として受ける)───────── */
/** 参照の行 { f, d, s, best, unc } と候補の値 q: 差・幅の内か・向き(1 より大きい/小さい)が合うか */
export function compareOne(ref, q) {
  const diff = q - ref.best, dirRef = Math.sign(ref.best - 1), dirQ = Math.sign(q - 1);
  return { f: ref.f, d: ref.d, s: ref.s, ref: ref.best, unc: ref.unc, q, diff, absDiff: Math.abs(diff), inUnc: Math.abs(diff) <= ref.unc, dirOk: dirRef === dirQ };
}
/** 列ごとの要約: 点の数・向きの合う数・最大の差・幅の内の数と、系列(扁平率 × 高さ)ごとの最大の位置(参照と候補)*/
export function summarize(rows, D = DECL) {
  const n = rows.length, dirOk = rows.filter((r) => r.dirOk).length, inUnc = rows.filter((r) => r.inUnc).length;
  const worst = rows.reduce((m, r) => (r.absDiff > m.absDiff ? r : m), rows[0]);
  const series = [];
  for (const s of D.sGrid) for (const f of D.fGrid) {
    const R = rows.filter((r) => r.f === f && r.s === s).sort((x, y) => x.d - y.d); if (!R.length) continue;
    // 扁平(f > 0)は最大・長球(f < 0)は最小の位置(参照の 1 からの離れの最大)
    const pick = (key) => R.reduce((m, r) => (Math.abs(r[key] - 1) > Math.abs(m[key] - 1) ? r : m), R[0]).d;
    const dRef = pick('ref'), dQ = pick('q');
    series.push({ f, s, n: R.length, dExtRef: dRef, dExtQ: dQ, extSame: dRef === dQ, maxAbsDiff: Math.max(...R.map((r) => r.absDiff)), inUnc: R.filter((r) => r.inUnc).length, dirOk: R.filter((r) => r.dirOk).length });
  }
  return { n, dirOk, inUnc, maxAbsDiff: worst.absDiff, worstAt: { f: worst.f, d: worst.d, s: worst.s }, series };
}

/* ───────── 純関数の場面と門 ───────── */
export function pureScenes() {
  const S = {};
  // ① 写した核と第338便b の twistAxis(ŝ = ẑ・q = 1)が同じ
  { let m = 0; for (const d of [[1, 0, 0.01], [0.3, -0.7, 0.5], [0.2, 0.1, -0.9], [-1, 2, 0.001]]) { const r = nrm(d), u = [d[0] / r, d[1] / r, d[2] / r], a = h1Kernel(u), b = twistAxis([0, 0, 1], u, 1); m = Math.max(m, nrm([a[0] - b[0], a[1] - b[1], a[2] - b[2]]) / nrm(b)); } S.kernel = m; }
  // ② 最近点: 表面の上・球(f = 0)では中心の向きの点(λ = r − 1)・赤道の上(z = 0)では (a, 0)
  { const R = receiver(0.098, 1.5, 0.01), P = nearestPoint(R.a, R.c, R.rho, R.z), P0 = nearestPoint(1, 1, 1.3, 0.4), Pe = nearestPoint(1.2, 0.9, 2, 0);
    S.nearest = { onSurface: Math.abs(P.onSurface), sphere: Math.abs(P0.lambda - (Math.hypot(1.3, 0.4) - 1)), equator: Math.abs(Pe.rho - 1.2) + Math.abs(Pe.z) }; }
  // ③ 球の源で比 1(接線 K_t = 1・弦の比 = 1)・高さを 0 へ寄せると K_t が片側の極限へ寄る
  { const T0 = tangentRow(0, 1.5, 0.01), C0 = chordRow(0, 1.5, 0.01, DECL.dirLevels[0]), Ta = tangentRow(0.098, 1.5, 1e-6);
    S.sphere = { Kt: Math.abs(T0.Kt - 1), chord: Math.abs(C0.tiltRatio - 1), limit: Math.abs(Ta.Kt - Ta.Kt0) }; }
  // ④ 弦の求積: ∫ (t₂³ − t₁³)/3 dΩ = 体積(扁平・長球・球)と、上下の対称(z → −z で場は (−F_x, −F_y, F_z))
  { const rs = [[0.3, 1.1, 0.01], [-0.1, 1.24, 0.1], [0, 2, 0.05]].map(([f, d, s]) => { const R = receiver(f, d, s); return Math.abs(chordField(R.a, R.c, R.x, 16, 32).volRatio - 1); });
    const R = receiver(0.2, 1.24, 0.1), Rm = receiver(0.2, 1.24, -0.1), up = chordField(R.a, R.c, R.x, 8, 16).v, dn = chordField(Rm.a, Rm.c, Rm.x, 8, 16).v, sc = nrm(up);
    S.chord = { vol: Math.max(...rs), mirror: (Math.abs(up[0] + dn[0]) + Math.abs(up[1] + dn[1]) + Math.abs(up[2] - dn[2])) / sc }; }
  // ⑤ 入力の拒否
  const rejects = (f) => { try { f(); return false; } catch (e) { return e instanceof RangeError; } };
  S.rejects = [rejects(() => radii(1)), rejects(() => receiver(0, 0, 0.01)), rejects(() => nearestPoint(1, 1, 0.5, 0)), rejects(() => chordField(1, 1, [0.5, 0, 0], 4, 8)), rejects(() => chordField(1, 1, [2, 0, 0], 0, 8))];
  return S;
}
export function pureView(S) {
  return { kernelBelow1e14: S.kernel <= 1e-14, nearestOnSurfaceBelow1e12: S.nearest.onSurface <= 1e-12, nearestSphereBelow1e12: S.nearest.sphere <= 1e-12, nearestEquatorBelow1e12: S.nearest.equator <= 1e-12,
    sphereKtBelow1e12: S.sphere.Kt <= 1e-12, sphereChordBelow1e12: S.sphere.chord <= 1e-12, limitBelow1e6: S.sphere.limit <= 1e-6, chordVolBelow1e9: S.chord.vol <= 1e-9, chordMirrorBelow1e12: S.chord.mirror <= 1e-12, rejects: S.rejects };
}
export function pureGates(S) {
  const V = pureView(S);
  return { kernel: V.kernelBelow1e14, nearest: V.nearestOnSurfaceBelow1e12 && V.nearestSphereBelow1e12 && V.nearestEquatorBelow1e12, sphere: V.sphereKtBelow1e12 && V.sphereChordBelow1e12 && V.limitBelow1e6,
    chord: V.chordVolBelow1e9 && V.chordMirrorBelow1e12, rejects: S.rejects.length === 5 && S.rejects.every(Boolean) };
}
