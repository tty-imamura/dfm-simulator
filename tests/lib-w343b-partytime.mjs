// 第343便b(原仮定者の回答(2026-11-19 —— 第142報の回答 2)AN839「決定力場に対して動いている当事者の時間を「当事者時間」とする。速度は、決定力場に対する相対速度を、
//   絶対時間で見る。加減速は、当事者時間で決まる。加減速のステップで進む時間を、当事者時間に合わせる。局所重力加速度との関係を確認する」・統括の検証項目 R379):
//   **重力の加速を「どちらの時間の 1 秒あたり」と読むかの 3 つの宣言を並べ、近点の一次の項・2 度数えの組・対の力積と仕事・局所重力加速度を数える純関数 —— 診断だけ**
//   (器 tests/exp-w343b-partytime.mjs と QA behavior.partytime343b・docs.partytime343b が読む —— html を読まない・ファイルを読まない・状態を持たない)。
//   アプリの積分・重力の式・時計・内蔵の本・受理器は変えない。水星の本と今の収支(42.98″/世紀)に項を足さない。
//   時計の型は第342便b の lib の gOf を呼ぶだけ(値は変えない)・RK4 の 1 步と水星の 1PN は第341便e の lib を呼ぶだけ。
//
// ■ 記号(無次元・基準光速 c₀ = 1・重力定数 1): 絶対時間 t・位置 p・速度 v = dp/dt(状態 —— 絶対時間で見た、場に対する相対の速度 w = v − u)・
//   静止の時計の進み N = e^(−ψ)・局所光速 c_loc = e^(−2ψ)・x = 大きさ(w) ÷ c_loc・当事者時間 dτ = N g(x) dt(g = 時計の型 F・U1・U2・U3)。
//   位置の更新と天体どうしの同時刻は絶対時間のまま。表面の時計(表示用)は軌道の步に使わない。
// ■ 3 つの宣言(重力の加速 a_G = 今のアプリの G_loc つきの加速 —— 受け手の型 G_i = G e^(−2 n_G ψ_i)・対称の型 G_ij = G e^(−n_G(ψ_i + ψ_j)))
//   (i)  a_G は絶対時間 1 秒あたり —— 当事者時間で書くと dv/dτ = a_G/(N g)。軌道は同じ(零試験)。**今のアプリの步(vx += ax·kickDt)はこの宣言に当たる**
//   (ii) 静止では今の重力を保ち、速さによる時計の遅れだけを足す —— 絶対時間の加速 = a_G g(dv/dτ = a_G/N)
//   (iii)今の重力の数そのものを当事者時間 1 秒あたりと読む —— 絶対時間の加速 = a_G N g(静止でも変わる)
//   対照の列 (N) = 静止の時計の因子だけ a_G N(ℓ と s を分けて読むための列 —— 宣言ではない)。
// ■ 見込みの式(弱い場・試験粒子・一次): 近点の進み ÷ 1PN = −(2 n_G q + ℓ + s)/6(q = 受け手の型 1・対称の型 ½〔中心が固定の試験粒子の極限〕・ℓ = N を掛けたとき 1・s = g を掛けたとき 1)。
// ■ 言わないこと: 宣言は比べるための宣言(当事者時間で重力が出るとは書かない)・数は誇張した場(μ/a = 1e-5)の比 —— 水星の観測の値へ合わせたものではない・
//   今の収支に足さない(足した列は「足した列」として別に置く)・光速を候補の採否に使わない(座標を運ぶ速さは切らない —— 原仮定者の指示(2026-11-17 —— 第140報))。
import { gOf } from './lib-w342b-clockstop.mjs';
import { rk4Step, mercury1PN } from './lib-w341e-lightmass.mjs';

export const LIB_VERSION = 'w343b-partytime-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);

export const DECL = Object.freeze({
  decls: Object.freeze(['i', 'ii', 'iii', 'N']),
  /** 宣言ごとの ℓ(静止の時計の因子 N を掛ける)と s(速さの因子 g を掛ける) */
  ls: Object.freeze({ i: Object.freeze([0, 0]), ii: Object.freeze([0, 1]), iii: Object.freeze([1, 1]), N: Object.freeze([1, 0]) }),
  types: Object.freeze(['F', 'U1', 'U2', 'U3']),
  nG: Object.freeze([0, 1, 2]),
  /** T2: 中心の質点(固定)・場は静止・背景と軟化と引きずり無し。a = 1・μ = 1e-5・e = 水星・1 周の刻み 3000 と 6000・近点 4 回の差 */
  orbit: Object.freeze({ mu: 1e-5, e: 0.20563593, steps: Object.freeze([3000, 6000]), nOrb: 4 }),
  symN: Object.freeze([1, 2]),
  /** T3: 今の在位の組(G_loc n_G = 2 受け手 + K1)と同じ一次になる n_G(宣言ごと)・K1 の一次の比(第331便c の +5/3 —— 文書の値) */
  balanceNG: Object.freeze({ i: 2, ii: 1.5, iii: 1, N: 1.5 }),
  k1Over1PN: 5 / 3,
  /** T4: 小さい系(重力定数 1・c₀ = 1・誇張した場 ψ ~ 1e-2)・RK4 の刻み・走る時間 */
  nbody: Object.freeze({ steps: 4000, orbits: 2, boost: 0.05, fieldAcc: 1e-3 }),
  /** T5: 落とす深さ(静止の ψ —— 0.5 は孤立の点の源の r_s での値)・数値の短い落下の刻み(2 つで寄せる) */
  psiDrop: Object.freeze([1e-3, 0.1, 0.5]),
  hDrop: Object.freeze([1e-4, 5e-5]),
  fOutside: 'F の x > 1 は定義域の外 —— 走りの中では max(0, 1 − x²) の係数(第342便b の宣言と同じ)。T2・T4 の x は 0.2 より小さく、この宣言は効かない',
});

/* ───────── 因子 ───────── */
/** 速さの因子(F の x > 1 は 0 —— DECL.fOutside) */
export const gRun = (type, x) => (type === 'F' ? Math.sqrt(Math.max(0, 1 - x * x)) : gOf(type, x));
/** 宣言の因子 f(絶対時間の加速 = a_G × f)。ψ は静止の時計の ψ・x は場に対する相対の速さ ÷ c_loc */
export function declFactor(decl, type, psi, x) {
  const ls = DECL.ls[decl];
  if (!ls) throw new Error('declFactor: 宣言が無い ' + decl);
  if (!(fin(psi) && fin(x) && x >= 0)) throw new Error('declFactor: ψ・x は有限(x は非負)');
  return (ls[0] ? Math.exp(-psi) : 1) * (ls[1] ? gRun(type, x) : 1);
}
/** G_loc の因子(受け手 e^(−2 n_G ψ_i)・対称 e^(−n_G(ψ_i + ψ_j))) */
export function gLocFactor(nG, pair, psiI, psiJ) {
  if (pair === 'receiver') return Math.exp(-2 * nG * psiI);
  if (pair === 'symmetric') return Math.exp(-nG * (psiI + psiJ));
  throw new Error('gLocFactor: 型が無い ' + pair);
}
/** 見込みの式 −(2 n_G q + ℓ + s)/6 */
export function closedOf(decl, nG, pair) { const [l, s] = DECL.ls[decl], q = pair === 'symmetric' ? 0.5 : 1; return -(2 * nG * q + l + s) / 6; }

/* ───────── T2 近点(試験粒子・中心は固定)───────── */
/** form 'abs' = 絶対時間で積む(ds/dt)・'tau' = 当事者時間を独立の変数にして積む(ds/dτ = ds/dt ÷ (N g)・dv/dτ = a_* —— 宣言 (i) の書き換えの零試験) */
export function apsidalPT({ decl, type, nG, pair = 'receiver', mu = DECL.orbit.mu, e = DECL.orbit.e, steps = 6000, nOrb = DECL.orbit.nOrb, form = 'abs' }) {
  const f = (s) => {
    const [x, y, vx, vy] = s, r = Math.hypot(x, y), psi = mu / r, xx = Math.hypot(vx, vy) * Math.exp(2 * psi);
    const aG = -mu / (r * r * r) * gLocFactor(nG, pair, psi, 0);   // 中心の ψ(試験粒子からの場)は 0
    const fd = declFactor(decl, type, psi, xx);
    if (form === 'abs') return [vx, vy, aG * fd * x, aG * fd * y];
    const Ng = Math.exp(-psi) * gRun(type, xx), aStar = aG * fd / Ng;   // 当事者時間 1 秒あたりの速度の増し分
    return [vx / Ng, vy / Ng, aStar * x, aStar * y];
  };
  const P = 2 * Math.PI / Math.sqrt(mu), h = P / steps, rp = 1 - e;
  let s = [rp, 0, 0, Math.sqrt(mu * (1 + e) / rp)];
  const rv = (q) => q[0] * q[2] + q[1] * q[3];
  const unwrap = (q, ref) => { const ph = Math.atan2(q[1], q[0]); return ph + 2 * Math.PI * Math.round((ref - ph) / (2 * Math.PI)); };
  const peri = []; let phiPrev = Math.atan2(s[1], s[0]), g0 = rv(s), k = 0;
  while (peri.length < nOrb + 1 && k < steps * (nOrb + 3)) {
    const s1 = rk4Step(f, s, h), g1 = rv(s1);
    if (g0 < 0 && g1 >= 0) {
      let lo = 0, hi = h;
      for (let j = 0; j < 60; j++) { const mid = 0.5 * (lo + hi), sm = rk4Step(f, s, mid); if (rv(sm) < 0) lo = mid; else hi = mid; }
      peri.push(unwrap(rk4Step(f, s, 0.5 * (lo + hi)), phiPrev));
    }
    phiPrev = unwrap(s1, phiPrev); s = s1; g0 = g1; k++;
  }
  const d = []; for (let i = 1; i < peri.length; i++) d.push(peri[i] - peri[i - 1] - 2 * Math.PI);
  const per = d.reduce((a, b) => a + b, 0) / d.length;
  return { overPN: per / (6 * Math.PI * mu / (1 - e * e)), nPeri: peri.length };
}
export function t2Rows() {
  const pn = mercury1PN(), [s1, s2] = DECL.orbit.steps, rows = [];
  for (const decl of DECL.decls) for (const nG of DECL.nG) for (const type of DECL.types) {
    const fine = apsidalPT({ decl, type, nG, steps: s2 }).overPN, coarse = apsidalPT({ decl, type, nG, steps: s1 }).overPN, cl = closedOf(decl, nG, 'receiver');
    rows.push({ decl, nG, type, pair: 'receiver', overPN: fine, halfDiff: Math.abs(fine - coarse), closed: cl, dClosed: fine - cl, arcsecCy: fine * pn.arcsecCy, closedArcsecCy: cl * pn.arcsecCy });
  }
  const sym = [];
  for (const decl of DECL.decls) for (const nG of DECL.symN) {
    const fine = apsidalPT({ decl, type: 'U3', nG, pair: 'symmetric', steps: s2 }).overPN, coarse = apsidalPT({ decl, type: 'U3', nG, pair: 'symmetric', steps: s1 }).overPN, cl = closedOf(decl, nG, 'symmetric');
    sym.push({ decl, nG, type: 'U3', pair: 'symmetric', overPN: fine, halfDiff: Math.abs(fine - coarse), closed: cl, dClosed: fine - cl, arcsecCy: fine * pn.arcsecCy });
  }
  // 宣言 (i) を当事者時間で書き換えた積分(零試験 —— 軌道は同じ)
  const rewrite = [];
  for (const nG of [0, 2]) for (const type of ['F', 'U3']) {
    const a = apsidalPT({ decl: 'i', type, nG }).overPN, b = apsidalPT({ decl: 'i', type, nG, form: 'tau' }).overPN;
    rewrite.push({ nG, type, absOverPN: a, tauOverPN: b, diff: Math.abs(a - b) });
  }
  // 型の間の広がり(同じ宣言・同じ n_G の 4 型の最大 − 最小)と、宣言の間の差(同じ型・同じ n_G —— (ii) − (i)・(iii) − (ii))
  const spread = [], step = [];
  for (const decl of DECL.decls) for (const nG of DECL.nG) { const v = rows.filter((r) => r.decl === decl && r.nG === nG).map((r) => r.overPN); spread.push({ decl, nG, spread: Math.max(...v) - Math.min(...v)}); }
  const at = (d, n, t) => rows.find((r) => r.decl === d && r.nG === n && r.type === t).overPN;
  for (const nG of DECL.nG) for (const type of DECL.types) step.push({ nG, type, iiMinusI: at('ii', nG, type) - at('i', nG, type), iiiMinusIi: at('iii', nG, type) - at('ii', nG, type), nMinusI: at('N', nG, type) - at('i', nG, type) });
  return { pn: { arcsecCy: pn.arcsecCy }, rows, sym, rewrite, spread, step };
}

/* ───────── T3 2 度数え・釣り合い ───────── */
export function t3Rows() {
  const pn = mercury1PN();
  // (a) 恒等式: 受け手の型 n_G = ½ の G_loc(宣言 (i))と、対照の列 (N)(n_G = 0)は同じ加速(e^(−ψ) を 1 回)
  const a = apsidalPT({ decl: 'i', type: 'U3', nG: 0.5 }).overPN, b = apsidalPT({ decl: 'N', type: 'U3', nG: 0 }).overPN;
  const half = { gLocHalf: a, nOnly: b, diff: Math.abs(a - b), closed: -1 / 6 };
  // (b) 今の在位の組と同じ一次になる n_G(宣言ごと)—— 足さないときの釣り合い
  const balance = DECL.decls.map((decl) => { const nG = DECL.balanceNG[decl], v = apsidalPT({ decl, type: 'U3', nG }).overPN;
    return { decl, nG, overPN: v, closed: closedOf(decl, nG, 'receiver'), withK1: v + DECL.k1Over1PN, withK1ArcsecCy: (v + DECL.k1Over1PN) * pn.arcsecCy }; });
  // (c) 足した列: 今の n_G = 2 のまま宣言 (ii)・(iii) にしたとき(K1 の +5/3 と足した和 —— 今の収支は動かさない・別の列)
  const added = ['i', 'ii', 'iii'].map((decl) => { const v = apsidalPT({ decl, type: 'U3', nG: 2 }).overPN;
    return { decl, nG: 2, overPN: v, gLocArcsecCy: v * pn.arcsecCy, withK1: v + DECL.k1Over1PN, withK1ArcsecCy: (v + DECL.k1Over1PN) * pn.arcsecCy }; });
  return { half, balance, added, arcsecCy: pn.arcsecCy };
}

/* ───────── T4 多体の保存(粒子ごとに別の因子)───────── */
/** 小さい系の初期の状態(2 体・3 体 —— 重心は静止・重力定数 1) */
export function systemOf(kind) {
  if (kind === 'two') {
    const m = [0.01, 0.005], M = m[0] + m[1], a = 1, e = 0.3, rp = a * (1 - e), vp = Math.sqrt(M * (1 + e) / rp);
    return { m, p: [[-m[1] / M * rp, 0, 0], [m[0] / M * rp, 0, 0]], v: [[0, -m[1] / M * vp, 0], [0, m[0] / M * vp, 0]], a, M };
  }
  if (kind === 'three') {
    const m = [0.01, 0.003, 0.002], p = [[0, 0, 0], [1, 0, 0], [-0.6, 1.1, 0.1]];
    const v = [[0, 0, 0], [0, Math.sqrt(0.01 / 1), 0.004], [-Math.sqrt(0.01 / 1.257) * 0.9, -Math.sqrt(0.01 / 1.257) * 0.5, 0]];
    const M = m[0] + m[1] + m[2], P = [0, 1, 2].map((k) => (m[0] * v[0][k] + m[1] * v[1][k] + m[2] * v[2][k]) / M), C = [0, 1, 2].map((k) => (m[0] * p[0][k] + m[1] * p[1][k] + m[2] * p[2][k]) / M);
    return { m, p: p.map((q) => q.map((x, k) => x - C[k])), v: v.map((q) => q.map((x, k) => x - P[k])), a: 1, M };
  }
  throw new Error('systemOf: 系が無い ' + kind);
}
/** 加速(粒子ごと): a_i = f_i × Σ_j G_ij m_j (p_j − p_i)/r³・ψ_i = Σ_j m_j / r_ij(外部だけ —— 背景・軟化なし)・x_i = 大きさ(v_i − u) e^(2ψ_i) */
export function accelOf(m, P, V, { decl, type, nG, pair, u = [0, 0, 0], psi0 = 0 }) {
  const n = m.length, psi = new Array(n).fill(psi0), A = [];
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (i !== j) psi[i] += m[j] / Math.hypot(P[j][0] - P[i][0], P[j][1] - P[i][1], P[j][2] - P[i][2]);
  for (let i = 0; i < n; i++) {
    const w = Math.hypot(V[i][0] - u[0], V[i][1] - u[1], V[i][2] - u[2]), fd = declFactor(decl, type, psi[i], w * Math.exp(2 * psi[i]));
    const a = [0, 0, 0];
    for (let j = 0; j < n; j++) if (i !== j) {
      const d = [P[j][0] - P[i][0], P[j][1] - P[i][1], P[j][2] - P[i][2]], r = Math.hypot(d[0], d[1], d[2]), k = gLocFactor(nG, pair, psi[i] - psi0, psi[j] - psi0) * m[j] / (r * r * r);
      a[0] += k * d[0]; a[1] += k * d[1]; a[2] += k * d[2];
    }
    A.push(a.map((c) => c * fd));
  }
  return A;
}
const flat = (P, V) => P.flat().concat(V.flat());
const unflat = (s, n) => { const P = [], V = []; for (let i = 0; i < n; i++) { P.push(s.slice(3 * i, 3 * i + 3)); V.push(s.slice(3 * n + 3 * i, 3 * n + 3 * i + 3)); } return [P, V]; };
/** 走らせて (a) 運動量の残り (b) エネルギーの残り(ニュートンの E —— n_G = 0 だけ意味がある)(c) 重心の漂い を返す */
export function runSystem(kind, opt, { boost = null, T = null, steps = DECL.nbody.steps } = {}) {
  const S0 = systemOf(kind), n = S0.m.length, m = S0.m, ub = boost ? [boost, 0, 0] : [0, 0, 0];
  const P0 = S0.p.map((q) => q.slice()), V0 = S0.v.map((q) => q.map((x, k) => x + ub[k]));
  const Tend = T !== null ? T : DECL.nbody.orbits * 2 * Math.PI * Math.sqrt(S0.a ** 3 / S0.M), h = Tend / steps;
  const f = (s) => { const [P, V] = unflat(s, n), A = accelOf(m, P, V, Object.assign({}, opt, { u: ub })); return V.flat().concat(A.flat()); };
  let s = flat(P0, V0);
  for (let k = 0; k < steps; k++) s = rk4Step(f, s, h);
  const [P, V] = unflat(s, n);
  const mom = (VV) => [0, 1, 2].map((c) => VV.reduce((acc, q, i) => acc + m[i] * q[c], 0));
  const scaleP = V0.reduce((acc, q, i) => acc + m[i] * Math.hypot(q[0] - ub[0], q[1] - ub[1], q[2] - ub[2]), 0);
  const p0 = mom(V0), p1 = mom(V), dP = Math.hypot(p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]) / scaleP;
  const E = (PP, VV) => { let k = 0, u = 0; for (let i = 0; i < n; i++) { k += 0.5 * m[i] * ((VV[i][0] - ub[0]) ** 2 + (VV[i][1] - ub[1]) ** 2 + (VV[i][2] - ub[2]) ** 2); for (let j = i + 1; j < n; j++) u -= m[i] * m[j] / Math.hypot(PP[j][0] - PP[i][0], PP[j][1] - PP[i][1], PP[j][2] - PP[i][2]); } return k + u; };
  const E0 = E(P0, V0), dE = Math.abs(E(P, V) - E0) / Math.abs(E0);
  const M = S0.M, cm = (PP) => [0, 1, 2].map((c) => PP.reduce((acc, q, i) => acc + m[i] * q[c], 0) / M), c0 = cm(P0), c1 = cm(P), vcm = p0.map((x) => x / M);
  const drift = Math.hypot(c1[0] - c0[0] - vcm[0] * Tend, c1[1] - c0[1] - vcm[1] * Tend, c1[2] - c0[2] - vcm[2] * Tend) / S0.a;
  return { dP, dE, drift, P, T: Tend };
}
export function t4Rows() {
  const rows = [];
  for (const kind of ['two', 'three']) for (const pair of ['symmetric', 'receiver']) for (const nG of [0, 2]) for (const decl of ['i', 'ii', 'iii']) for (const type of ['F', 'U3']) {
    if (decl === 'i' && type === 'U3') continue;   // 宣言 (i) は型に依らない(因子 1)
    const r = runSystem(kind, { decl, type, nG, pair });
    rows.push({ kind, pair, nG, decl, type: decl === 'i' ? null : type, dP: r.dP, dE: r.dE, drift: r.drift });
  }
  return { rows };
}
/** T4 の零試験: ① 全部が静止なら (i) と (ii) の加速は同じ(g(0) = 1)② 一様な場(源なし・背景 ψ₀)では 3 つの宣言とも加速 0 ③ 一様に動く枠(場と全部の粒子が同じ u)は静止の枠の軌道を u t ずらしたもの
 *  ④ 場が加速するとき(u = A t・力なし)慣性の速度は変わらず、相対の速度だけが −A t 変わる(相対の速度を状態として積むと A t の取り違え) */
export function t4Zero() {
  const S = systemOf('three'), Vrest = S.v.map(() => [0, 0, 0]);
  let restMax = 0;
  for (const type of DECL.types) for (const nG of [0, 2]) for (const pair of ['symmetric', 'receiver']) {
    const a1 = accelOf(S.m, S.p, Vrest, { decl: 'i', type, nG, pair }), a2 = accelOf(S.m, S.p, Vrest, { decl: 'ii', type, nG, pair });
    for (let i = 0; i < a1.length; i++) for (let c = 0; c < 3; c++) restMax = Math.max(restMax, Math.abs(a1[i][c] - a2[i][c]));
  }
  const zm = [0, 0, 0], Pz = [[0, 0, 0], [1, 0, 0]], Vz = [[0.1, 0, 0], [0, 0.05, 0]];
  let uniMax = 0;
  for (const decl of ['i', 'ii', 'iii']) for (const type of DECL.types) { const A = accelOf(zm.slice(0, 2), Pz, Vz, { decl, type, nG: 2, pair: 'receiver', psi0: 0.3 }); for (const q of A) for (const c of q) uniMax = Math.max(uniMax, Math.abs(c)); }
  const ub = DECL.nbody.boost, bo = [];
  for (const decl of ['ii', 'iii']) for (const type of ['F', 'U3']) {
    const opt = { decl, type, nG: 2, pair: 'symmetric' }, r0 = runSystem('two', opt), r1 = runSystem('two', opt, { boost: ub });
    let mx = 0; for (let i = 0; i < r0.P.length; i++) for (let c = 0; c < 3; c++) mx = Math.max(mx, Math.abs(r1.P[i][c] - (r0.P[i][c] + (c === 0 ? ub * r0.T : 0))));
    bo.push({ decl, type, maxShift: mx });
  }
  // ④ 力なしの粒子(v = 0.02)・場の速度 u = A t(一様)。絶対時間で積む v は不変・w = v − u は −A T 変わる
  const A = DECL.nbody.fieldAcc, T = 50, v0 = 0.02;
  const v = v0 + 0 * declFactor('iii', 'U3', 0.01, v0 * Math.exp(0.02)) * T;   // 力なし: どの宣言でも Δv = (加速 0) × 因子 × T = 0
  const wEnd = v - A * T, wWrong = v0;   // 相対の速度を状態として dw/dt = a_* N g(= 0)で積むと w は v0 のまま(場の加速 −A の項が落ちる)
  const field = { A, T, dV: v - v0, dW: wEnd - v0, mixErr: Math.abs(wWrong - wEnd), formula: 'd(v − u)/dt = dv/dt − (∂_t + v·∇)u' };
  return { restMax, uniMax, boost: bo, field };
}

/* ───────── T5 局所重力加速度(深さの違う 2 点の静止からの落下)───────── */
/** 静止から放した瞬間: 絶対時間の加速 a_abs = a_N e^(−2 n_G ψ) f・その場の時計で測った加速 a_τ = d²p/dτ² = a_abs ÷ N²(静止では dp/dτ = 0 なので連鎖律の第 2 項は 0) */
export function t5Rows() {
  const rows = [];
  for (const psi of DECL.psiDrop) for (const nG of [0, 2]) for (const decl of ['i', 'ii', 'iii']) {
    const N = Math.exp(-psi), fd = declFactor(decl, 'U3', psi, 0), gl = gLocFactor(nG, 'receiver', psi, 0), aAbs = gl * fd, aTau = aAbs / (N * N);
    // 数値: 点の源 μ を r = μ/ψ に置き、静止から短く落とす(位置の変化 Δr と当事者時間 Δτ = ∫ N g dt)—— 2 Δr/Δτ² を 2 つの刻みで寄せる(÷ a_N)
    const mu = 1e-3, r0 = mu / psi, aN = mu / (r0 * r0);
    const est = DECL.hDrop.map((hr) => {
      const Hh = hr * Math.sqrt(r0 / aN), nst = 200, dt = Hh / nst;
      const f = (s) => { const [r, v, tau] = s, ps = mu / r, x = Math.abs(v) * Math.exp(2 * ps), a = -mu / (r * r) * gLocFactor(nG, 'receiver', ps, 0) * declFactor(decl, 'U3', ps, x); return [v, a, Math.exp(-ps) * gRun('U3', x)]; };
      let s = [r0, 0, 0]; for (let k = 0; k < nst; k++) s = rk4Step(f, s, dt);
      return 2 * (r0 - s[0]) / (s[2] * s[2]) / aN;
    });
    const num = 2 * est[1] - est[0];
    rows.push({ psi, nG, decl, N, aAbsOverN: aAbs, aTauOverN: aTau, aTauNum: num, rel: Math.abs(num / aTau - 1) });
  }
  return { rows };
}

/* ───────── 純関数の場面 ───────── */
export function pureScenes() {
  // ① 静止(x = 0)で全部の型の g が 1(ちょうど)・宣言 (i) の因子は 1
  const g0 = DECL.types.every((t) => gRun(t, 0) === 1) && DECL.types.every((t) => declFactor('i', t, 0.3, 0.5) === 1);
  // ② 宣言の因子の形: (ii) = g・(iii) = N g・(N) = N
  let form = 0; for (const t of DECL.types) for (const [p, x] of [[0.01, 0.1], [0.2, 0.5]]) {
    form = Math.max(form, Math.abs(declFactor('ii', t, p, x) - gRun(t, x)), Math.abs(declFactor('iii', t, p, x) - Math.exp(-p) * gRun(t, x)), Math.abs(declFactor('N', t, p, x) - Math.exp(-p)));
  }
  // ③ G_loc の因子: n_G = 0 で 1・受け手 n_G = ½ は e^(−ψ)・対称は ψ_i と ψ_j で入れ替えても同じ
  const gl = gLocFactor(0, 'receiver', 0.3, 0) === 1 && gLocFactor(0, 'symmetric', 0.3, 0.2) === 1 && gLocFactor(0.5, 'receiver', 0.3, 0) === Math.exp(-0.3) && gLocFactor(2, 'symmetric', 0.3, 0.1) === gLocFactor(2, 'symmetric', 0.1, 0.3);
  // ④ 見込みの式の値(今の在位の組 = −2/3・(ii) n_G = 0 = −1/6・(iii) n_G = 0 = −1/3・対称 (i) n_G = 2 = −1/3)
  const cl = closedOf('i', 2, 'receiver') === -4 / 6 && closedOf('ii', 0, 'receiver') === -1 / 6 && closedOf('iii', 0, 'receiver') === -2 / 6 && closedOf('i', 2, 'symmetric') === -2 / 6;
  // ⑤ 拒否: 宣言が無い・型が無い・x が負・G_loc の型が無い
  let rej = 0; try { declFactor('iv', 'F', 0, 0); } catch (e) { rej++; } try { declFactor('ii', 'V', 0, 0.1); } catch (e) { rej++; } try { declFactor('ii', 'U1', 0, -1); } catch (e) { rej++; } try { gLocFactor(1, 'mutual', 0, 0); } catch (e) { rej++; }
  return { g0, formMax: form, gLoc: gl, closed: cl, reject: { n: rej, of: 4 } };
}
export function pureGates(S) { return { g0: S.g0 === true, form: S.formMax < 1e-15, gLoc: S.gLoc === true, closed: S.closed === true, reject: S.reject.n === S.reject.of }; }
