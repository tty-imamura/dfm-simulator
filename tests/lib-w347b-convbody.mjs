// 第347便b(原仮定者の回答(2026-11-21 —— 第145報)「AN902: 推奨で進める。現状も近似として比較可能にする」・統括の検証項目 R401):
//   **当事者時間の換算の多体 —— (α) 主の候補・(0)「現行の近似」・(β) 比べる列を、太陽–地球–月の型の 3 体・金星と水星の型・時計に入れる背景・場の側の運動量の帳簿・
//   太陽系の 8 惑星 + 月の型の (0) と (α) の差の表で数える純関数 —— 診断だけ**
//   (器 tests/exp-w347b-convbody.mjs と QA behavior.convbody347b・docs.convbody347b が読む —— html を読まない・ファイルを読まない・状態を持たない)。
//   アプリの積分・重力の式・時計・内蔵の本・受理器は変えない。水星の本と今の収支(42.98″/世紀)に項を足さない。本を足さない。
//   換算の型の右辺の考え方・q の式は第344便b の lib と同じ(呼ぶ所は呼ぶ —— 試験粒子の近点・背景の見込み)・G_loc の因子と小さい系は第343便b の lib・RK4 の 1 步と水星の 1PN は第341便e の lib・
//   惑星の軌道の要素は第299便c の lib を呼ぶだけ(どの本文も変えない)。
//
// ■ 記号(ニュートンの単位 —— 重力定数 1・距離と質量は系ごと): 弱い場の強さ ε = 1 ÷ c₀²(系の単位で)。決定力の強さ ψ_i = ε Σ_j m_j ÷ r_ij(自分を除く・背景は時計にだけ ψ₀)。
//   局所光速 c_loc = c₀ e^(−2ψ)・静止の時計 N = e^(−ψ)・場に対する相対の速さ x = 大きさ(v − u) ÷ c_loc(u = 枠の速さ)・今の点の時計の形 g = √(1 − x²)・当事者時間の進み q = N g。
//   重力 a_i = Σ_j G_loc の因子 × m_j (p_j − p_i) ÷ r³(受け手の型 e^(−2 n_G ψ_i)・対称の型 e^(−n_G(ψ_i + ψ_j)) —— ψ は背景を含めない〔第79・80報〕)。
// ■ 型(どの表にも 3 列 —— 原仮定者の回答(2026-11-21 —— 第145報)AN902)
//   (0)「現行の近似」: dv/dt = a(絶対時間・局所の重力の指数 2 —— 今のアプリの步)
//   (α) 主の候補: dv/dτ = a → dv/dt = q a(指数 1)
//   (β) 比べる列: d²p/dτ² = a → 状態 U = dp/dτ・dp/dt = q U・dU/dt = q a(指数 1 —— q は U と枠の速さから二次式で解く)
//   (N) 物差し: ニュートン(指数 0・因子なし)—— 各型の率から引く(同じ刻み・同じ初期の状態)
// ■ 枠(AN919 —— 月の相対の速さを測る枠): abs = 系の絶対の枠(u = 0)/clock = 今の点の時計の枠(自分を除く決定力の重みの平均 u = Σ_j W_j v_j ÷(D₀ + Σ_j W_j)・W_j = m_j ÷ r_ij —— アプリの E7R の点の時計と同じ形)/
//   host = 主星の枠(月 → 地球・地球 → 太陽の速さ)。
// ■ 「現行の近似」の読み: (α) との差がどの次数・どの大きさかを表で示す —— 現行が正しい/誤り、とは書かない。
// ■ 言わないこと: 換算の型を決めない・月や惑星が合った/合わないと書かない・現行の近似の足りる/足りないを書かない・数は宣言した系と ε の比(観測の値へ合わせていない)・
//   場の側の帳簿が閉じると決め打ちしない・光速を候補の採否に使わない・文献の値(実の比の系の質量と要素)は「文献の値・未照合」の比べる列の入力。
import { gLocFactor, systemOf } from './lib-w343b-partytime.mjs';
import { rk4Step, mercury1PN } from './lib-w341e-lightmass.mjs';
import { apsidalConv, closedBg, closedOf as closed344 } from './lib-w344b-partyconv.mjs';
import { PLANETS } from './lib-w299c-planets3d.mjs';

export const LIB_VERSION = 'w347b-convbody-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const D2R = Math.PI / 180;

/** 実の比の入力(文献の値・未照合 —— 比べる列の系を作るためだけ。データの表には足さない) */
export const REAL = Object.freeze({
  note: '実の比の系の入力は文献の値・未照合(太陽・地球・月の質量の比と月の軌道の要素は教科書の値の転記・惑星の要素は第299便c の lib の写し〔その lib の出典の注のとおり〕・地球の要素は同じ表の地球と月の重心の行の転記)',
  GMsun: 1.32712440018e20, c: 299792458, AU: 1.495978707e11,
  mEarth: 3.003489e-6, mMoon: 3.694303e-8, aMoonAU: 384399e3 / 1.495978707e11, eMoon: 0.0549, iMoonDeg: 5.145, eEarth: 0.01671123, aEarth: 1.00000261,
});
export const epsReal = () => REAL.GMsun / (REAL.c * REAL.c * REAL.AU);   // GM_sun ÷(c₀² × 天文単位)—— 1 天文単位での太陽の ψ

export const DECL = Object.freeze({
  kinds: Object.freeze(['0', 'alpha', 'beta']),
  kindNG: Object.freeze({ N: 0, 0: 2, alpha: 1, beta: 1 }),
  frames: Object.freeze(['abs', 'clock', 'host']),
  /** T1 の系 2 つ: dimless = 無次元(地球 1e-3・月は地球の 1/81・月の軌道 0.02 —— 地球のヒル半径の 0.29 倍)/real = 実の比 */
  sem: Object.freeze({
    dimless: Object.freeze({ mE: 1e-3, mM: 1e-3 / 81.3, aE: 1, eE: 0.0167, aM: 0.02, eM: 0.055, iM: 5.145, epsGrid: Object.freeze([1e-6, 4e-6]), years: Object.freeze([6, 12]), stepsPerMoon: Object.freeze([200, 400]) }),
    real: Object.freeze({ lamGrid: Object.freeze([1, 10]), years: Object.freeze([6, 12]), stepsPerMoon: Object.freeze([200, 400]) }),
  }),
  sample: 5,
  /** T2: 金星の型・水星の型(試験粒子の近点 —— 第344便b の数との照合)と、外の摂動の天体(木星の型 —— 質量 1e-3・軌道 2.5・e 0.05)を足した多体 */
  t2: Object.freeze({ eps: 1e-5, es: Object.freeze([0.20563593, 0.0068]), mPlanet: 1e-12, pert: Object.freeze({ m: 1e-3, a: 2.5, e: 0.05 }), steps: 6000, nOrb: 4, stepsPert: 4000, nOrbPert: 6 }),
  /** T3: アプリの水星の本(🌡️ mercurySunInertial3d)の背景 —— physics の宣言の写し D₀ = 0.1・X_k(kappaT)= 7.425826474101849e-9 —— 時計に入れる背景 ψ₀ = X_k D₀ */
  t3: Object.freeze({ book: 'mercurySunInertial3d', D0: 0.1, kappaT: 7.425826474101849e-9, psi0Num: Object.freeze([1e-3, 2e-3]) }),
  /** T4: 場の側の帳簿(第343便b の systemOf の 2 体・3 体・ε = 1)—— 走らせる周回 */
  t4: Object.freeze({ steps: 8000, orbits: 4, nG: Object.freeze([0, 1]) }),
  /** T5: 8 惑星(水星〜海王星)+ 月の型。μ を振って (0) − (α) の一次と二次を分ける */
  t5: Object.freeze({ muGrid: Object.freeze([1e-5, 2e-5, 4e-5]), steps: 6000 }),
  clock: '時計の因子は今の点の時計の形 √(1 − x²)だけ(第344便b と同じ)',
});

/* ───────── 因子 ───────── */
/** (α) の q: 枠に対する相対の速さの 2 乗 w2(系の単位)から q = e^(−ψ) √(max(0, 1 − ε e^(4ψ) w2)) */
export function qAlpha(psi, w2, eps) { if (!(fin(psi) && fin(w2) && w2 >= 0 && fin(eps) && eps >= 0)) throw new Error('qAlpha: ψ・w²・ε は有限(w² と ε は非負)'); return Math.exp(-psi) * Math.sqrt(Math.max(0, 1 - eps * Math.exp(4 * psi) * w2)); }
/** (β) の q: U(= dp/dτ)と枠の速さ u から、q² = N²(1 − ε e^(4ψ) 大きさ(qU − u)²) を q > 0 で解く(u = 0 で第344便b の qOfU と同じ) */
export function qBeta(psi, U, u, eps) {
  if (!(fin(psi) && fin(eps) && eps >= 0)) throw new Error('qBeta: ψ・ε は有限');
  const N2 = Math.exp(-2 * psi), K = eps * Math.exp(2 * psi), UU = U[0] * U[0] + U[1] * U[1] + U[2] * U[2], Uu = U[0] * u[0] + U[1] * u[1] + U[2] * u[2], uu = u[0] * u[0] + u[1] * u[1] + u[2] * u[2];
  const A = 1 + K * UU, B = -2 * K * Uu, C = -N2 + K * uu, disc = B * B - 4 * A * C;
  if (!(disc >= 0)) throw new Error('qBeta: 解が無い');
  return Math.max(0, (-B + Math.sqrt(disc)) / (2 * A));
}

/* ───────── 多体の右辺 ───────── */
/** 系 sys = { m:[…], host:[…](主星の添字・無ければ −1)}。状態 s = [P(3n), W(3n)](W は (β) で U・ほかは v)。
 *  opt: kind('N'・'0'・'alpha'・'beta')・nG(既定は DECL.kindNG)・pair・eps・frame・psi0(時計にだけの背景)・D0f(clock の枠の分母の背景 —— 既定 0) */
export function makeDeriv(sys, { kind, nG = DECL.kindNG[kind], pair = 'receiver', eps, frame = 'abs', psi0 = 0, D0f = 0 }) {
  if (!['N', '0', 'alpha', 'beta'].includes(kind)) throw new Error('makeDeriv: 型が無い ' + kind);
  if (!DECL.frames.includes(frame)) throw new Error('makeDeriv: 枠が無い ' + frame);
  if (!(fin(eps) && eps >= 0)) throw new Error('makeDeriv: ε は有限の非負');
  const m = sys.m, n = m.length, host = sys.host || new Array(n).fill(-1);
  const info = { q: new Array(n).fill(1), psi: new Array(n).fill(0), v: null };
  const f = (s) => {
    const P = [], W = [];
    for (let i = 0; i < n; i++) { P.push([s[3 * i], s[3 * i + 1], s[3 * i + 2]]); W.push([s[3 * n + 3 * i], s[3 * n + 3 * i + 1], s[3 * n + 3 * i + 2]]); }
    const R = []; for (let i = 0; i < n; i++) { R.push(new Array(n).fill(0)); }
    const psi = new Array(n).fill(0), wsum = new Array(n).fill(0);
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { const r = Math.hypot(P[j][0] - P[i][0], P[j][1] - P[i][1], P[j][2] - P[i][2]); R[i][j] = R[j][i] = r; psi[i] += m[j] / r; psi[j] += m[i] / r; }
    for (let i = 0; i < n; i++) { wsum[i] = psi[i]; psi[i] *= eps; }
    const frameU = (i, V) => {
      if (frame === 'abs') return [0, 0, 0];
      if (frame === 'host') return host[i] < 0 ? [0, 0, 0] : V[host[i]];
      const u = [0, 0, 0]; for (let j = 0; j < n; j++) if (j !== i) { const w = m[j] / R[i][j]; u[0] += w * V[j][0]; u[1] += w * V[j][1]; u[2] += w * V[j][2]; }
      const d = D0f + wsum[i]; return d > 0 ? u.map((c) => c / d) : [0, 0, 0];
    };
    let q = new Array(n).fill(1), V = W;
    if (kind === 'alpha') q = W.map((w, i) => { const u = frameU(i, W); return qAlpha(psi[i] + psi0, (w[0] - u[0]) ** 2 + (w[1] - u[1]) ** 2 + (w[2] - u[2]) ** 2, eps); });
    else if (kind === 'beta') {   // v = q U と枠の速さ u(ほかの天体の v に依る)を不動点で 4 回寄せる(結合は x² の桁)
      let qq = psi.map((p) => Math.exp(-p - psi0));
      for (let it = 0; it < 4; it++) { const Vt = W.map((w, i) => w.map((c) => c * qq[i])); qq = W.map((w, i) => qBeta(psi[i] + psi0, w, frameU(i, Vt), eps)); }
      q = qq; V = W.map((w, i) => w.map((c) => c * q[i]));
    }
    const out = new Array(6 * n).fill(0);
    for (let i = 0; i < n; i++) {
      const a = [0, 0, 0];
      for (let j = 0; j < n; j++) if (j !== i) { const r = R[i][j], k = gLocFactor(nG, pair, psi[i], psi[j]) * m[j] / (r * r * r); a[0] += k * (P[j][0] - P[i][0]); a[1] += k * (P[j][1] - P[i][1]); a[2] += k * (P[j][2] - P[i][2]); }
      const fk = kind === 'alpha' || kind === 'beta' ? q[i] : 1;
      for (let c = 0; c < 3; c++) { out[3 * i + c] = V[i][c]; out[3 * n + 3 * i + c] = fk * a[c]; }
    }
    info.q = q; info.psi = psi; info.v = V;
    return out;
  };
  f.info = info;
  return f;
}
/** (β) の初期の U(同じ位置・同じ絶対時間の速度 v₀ から U₀ = v₀ ÷ q₀ —— q₀ は枠を含めて 8 回寄せる) */
export function initW(sys, P, V, opt) {
  if (opt.kind !== 'beta') return V.map((v) => v.slice());
  let W = V.map((v) => v.slice());
  for (let it = 0; it < 8; it++) {
    const f = makeDeriv(sys, opt), s = P.flat().concat(W.flat()); f(s);
    W = V.map((v, i) => v.map((c) => c / f.info.q[i]));
  }
  return W;
}

/* ───────── 要素から状態 ───────── */
/** ケプラーの要素(真近点角 f)から相対の位置と速度(μ = G(M + m)) */
export function kepState(mu, a, e, iDeg, OmDeg, omDeg, fDeg = 0) {
  const p = a * (1 - e * e), f = fDeg * D2R, r = p / (1 + e * Math.cos(f)), h = Math.sqrt(mu * p);
  const xo = r * Math.cos(f), yo = r * Math.sin(f), vxo = -mu / h * Math.sin(f), vyo = mu / h * (e + Math.cos(f));
  const i = iDeg * D2R, O = OmDeg * D2R, w = omDeg * D2R, cO = Math.cos(O), sO = Math.sin(O), cw = Math.cos(w), sw = Math.sin(w), ci = Math.cos(i), si = Math.sin(i);
  const R = [[cO * cw - sO * sw * ci, -cO * sw - sO * cw * ci], [sO * cw + cO * sw * ci, -sO * sw + cO * cw * ci], [sw * si, cw * si]];
  return { p: R.map((row) => row[0] * xo + row[1] * yo), v: R.map((row) => row[0] * vxo + row[1] * vyo) };
}
const toBary = (m, P, V) => { const M = m.reduce((a, b) => a + b, 0), C = [0, 1, 2].map((c) => P.reduce((acc, p, i) => acc + m[i] * p[c], 0) / M), U = [0, 1, 2].map((c) => V.reduce((acc, v, i) => acc + m[i] * v[c], 0) / M); return { P: P.map((p) => p.map((x, c) => x - C[c])), V: V.map((v) => v.map((x, c) => x - U[c])) }; };
/** 太陽–地球–月の型の系(太陽 1・地球と月は要素から —— 地球は黄道面・月は傾き iM・近点 0・昇交点 0) */
export function semSystem(which) {
  const d = which === 'real' ? { mE: REAL.mEarth, mM: REAL.mMoon, aE: REAL.aEarth, eE: REAL.eEarth, aM: REAL.aMoonAU, eM: REAL.eMoon, iM: REAL.iMoonDeg } : DECL.sem.dimless;
  const m = [1, d.mE, d.mM];
  const E = kepState(1 + d.mE + d.mM, d.aE, d.eE, 0, 0, 0, 0);   // 地球と月の重心の周り —— 近日点から
  const L = kepState(d.mE + d.mM, d.aM, d.eM, d.iM, 0, 0, 0);    // 月の地球に対する —— 近地点から
  const fM = d.mM / (d.mE + d.mM), fE = d.mE / (d.mE + d.mM);
  const pE = E.p.map((x, c) => x - fM * L.p[c]), vE = E.v.map((x, c) => x - fM * L.v[c]), pM = E.p.map((x, c) => x + fE * L.p[c]), vM = E.v.map((x, c) => x + fE * L.v[c]);
  const B = toBary(m, [[0, 0, 0], pE, pM], [[0, 0, 0], vE, vM]);
  const Pm = 2 * Math.PI * Math.sqrt(d.aM ** 3 / (d.mE + d.mM)), Pe = 2 * Math.PI * Math.sqrt(d.aE ** 3 / (1 + d.mE + d.mM));
  return { m, host: [-1, 0, 1], P: B.P, V: B.V, Pmoon: Pm, Pearth: Pe, d };
}

/* ───────── 測り方 ───────── */
const cross3 = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
/** 相対の位置と速度からニュートンの接触の要素(交点の経度 Ω・近点の経度 ϖ = Ω + ω・黄経) */
export function oscul(p, v, mu) {
  const h = cross3(p, v), r = Math.hypot(...p), ev = cross3(v, h).map((c, k) => c / mu - p[k] / r), hn = Math.hypot(...h), hh = h.map((c) => c / hn);
  const Om = Math.atan2(h[0], -h[1]), nd = [Math.cos(Om), Math.sin(Om), 0];
  const om = Math.atan2(dot3(cross3(nd, ev), hh), dot3(nd, ev));
  return { Om, varpi: Om + om, lon: Math.atan2(p[1], p[0]), e: Math.hypot(...ev) };
}
const unwrapSeq = (a) => { const o = [a[0]]; for (let i = 1; i < a.length; i++) { let d = a[i] - a[i - 1]; d -= 2 * Math.PI * Math.round(d / (2 * Math.PI)); o.push(o[i - 1] + d); } return o; };
/** 最小二乗の傾き */
export function slope(t, y) { const n = t.length, mt = t.reduce((a, b) => a + b, 0) / n, my = y.reduce((a, b) => a + b, 0) / n; let sxy = 0, sxx = 0; for (let i = 0; i < n; i++) { sxy += (t[i] - mt) * (y[i] - my); sxx += (t[i] - mt) ** 2; } return sxy / sxx; }

/** 太陽–地球–月の型を 1 本走らせて、月の近地点の経度・交点の経度・恒星の黄経・朔望の角と地球の近日点の時系列を返す */
export function runSEM(S, opt, { stepsPerMoon, years }) {
  const n = 3, f = makeDeriv(S, opt), W0 = initW(S, S.P, S.V, opt), h = S.Pmoon / stepsPerMoon, T = years * S.Pearth, nst = Math.round(T / h);
  let s = S.P.flat().concat(W0.flat());
  const ser = { t: [], varpi: [], Om: [], lon: [], syn: [], varpiE: [] }, muM = S.m[1] + S.m[2], muE = S.m[0] + S.m[1] + S.m[2];
  const rec = (k) => {
    f(s); const V = f.info.v, P = [0, 1, 2].map((i) => [s[3 * i], s[3 * i + 1], s[3 * i + 2]]);
    const pr = P[2].map((x, c) => x - P[1][c]), vr = V[2].map((x, c) => x - V[1][c]), o = oscul(pr, vr, muM);
    const pe = P[1].map((x, c) => x - P[0][c]), ve = V[1].map((x, c) => x - V[0][c]), oE = oscul(pe, ve, muE);
    ser.t.push(k * h); ser.varpi.push(o.varpi); ser.Om.push(o.Om); ser.lon.push(o.lon); ser.syn.push(o.lon - Math.atan2(-pe[1], -pe[0])); ser.varpiE.push(oE.varpi);
  };
  for (let k = 0; k <= nst; k++) { if (k % DECL.sample === 0) rec(k); if (k < nst) s = rk4Step(f, s, h); }
  for (const key of ['varpi', 'Om', 'lon', 'syn', 'varpiE']) ser[key] = unwrapSeq(ser[key]);
  void n; return ser;
}
/** 差の時系列 Δy の率: Δy を [1, t, t (y_N′ − 平均)] に最小二乗で当てた t の係数(固定の係数で平均の運動の速さが違うと、ニュートンの時系列の周期の項が
 *  位相のずれ δφ ∝ t で差に漏れる —— その一次の漏れ t (y_N′ − 平均) を同時に当てて除く。二次の漏れは残る〔表の注〕) */
export function rateOf(t, dy, yN) {
  const n = t.length, d = yN.map((y, i) => (i === 0 ? (yN[1] - yN[0]) / (t[1] - t[0]) : i === n - 1 ? (yN[n - 1] - yN[n - 2]) / (t[n - 1] - t[n - 2]) : (yN[i + 1] - yN[i - 1]) / (t[i + 1] - t[i - 1])));
  const md = d.reduce((a, b) => a + b, 0) / n, tm = t[n - 1] / 2, X = t.map((ti, i) => [1, ti - tm, (ti - tm) * (d[i] - md)]);
  const A = [[0, 0, 0], [0, 0, 0], [0, 0, 0]], b = [0, 0, 0];
  for (let i = 0; i < n; i++) for (let r = 0; r < 3; r++) { b[r] += X[i][r] * dy[i]; for (let c = 0; c < 3; c++) A[r][c] += X[i][r] * X[i][c]; }
  for (let k = 0; k < 3; k++) { const pv = A[k][k]; for (let r = k + 1; r < 3; r++) { const f = A[r][k] / pv; for (let c = k; c < 3; c++) A[r][c] -= f * A[k][c]; b[r] -= f * b[k]; } }
  const x = [0, 0, 0]; for (let k = 2; k >= 0; k--) { let s = b[k]; for (let c = k + 1; c < 3; c++) s -= A[k][c] * x[c]; x[k] = s / A[k][k]; }
  return x[1];
}
/** 型の率 − ニュートンの率(同じ刻み・同じ初期の状態): 月の近地点・交点・恒星の黄経・朔望の角・地球の近日点(rad ÷ 時間) */
export function semRates(S, opt, base, run) {
  const ser = runSEM(S, opt, run), d = (k) => rateOf(ser.t, ser[k].map((y, i) => y - base[k][i]), base[k]);
  return { dVarpi: d('varpi'), dOm: d('Om'), dLon: d('lon'), dSyn: d('syn'), dVarpiE: d('varpiE') };
}
const variants = () => [{ kind: '0', frame: 'abs' }].concat(['alpha', 'beta'].flatMap((k) => DECL.frames.map((fr) => ({ kind: k, frame: fr }))));

/* ───────── T1 太陽–地球–月の型の 3 体 ───────── */
/** 系 1 つ・ε 1 つ・刻みと窓 1 つで (0)・(α) 枠 3・(β) 枠 3 の率の差(ニュートンから)を返す。率は「月の 1 公転あたりの rad」に直す */
export function t1Case(which, eps, stepsPerMoon, years) {
  const S = semSystem(which), run = { stepsPerMoon, years };
  const base = runSEM(S, { kind: 'N', eps }, run), toOrb = S.Pmoon;
  const newton = { varpi: slope(base.t, base.varpi) * toOrb, Om: slope(base.t, base.Om) * toOrb, lon: slope(base.t, base.lon) * toOrb, syn: slope(base.t, base.syn) * toOrb, varpiE: slope(base.t, base.varpiE) * toOrb };
  const rows = variants().map((vv) => { const r = semRates(S, Object.assign({ eps }, vv), base, run); return Object.assign({}, vv, { dVarpi: r.dVarpi * toOrb, dOm: r.dOm * toOrb, dLon: r.dLon * toOrb, dSyn: r.dSyn * toOrb, dVarpiE: r.dVarpiE * toOrb }); });
  return { which, eps, stepsPerMoon, years, Pmoon: S.Pmoon, Pearth: S.Pearth, newton, rows };
}
export const T1_QTY = Object.freeze(['dVarpi', 'dOm', 'dLon', 'dSyn', 'dVarpiE']);
export function t1Rows() {
  const D = DECL.sem.dimless, R = DECL.sem.real, eR = epsReal(), out = { dimless: [], real: [] };
  // 係数の格子(ε 2 つ —— 同じ刻みと窓)+ 測りの幅(刻みを倍・窓を倍 —— ε の 1 番目)
  for (const eps of D.epsGrid) out.dimless.push(t1Case('dimless', eps, D.stepsPerMoon[0], D.years[0]));
  out.dimless.push(t1Case('dimless', D.epsGrid[0], D.stepsPerMoon[1], D.years[0]));
  out.dimless.push(t1Case('dimless', D.epsGrid[0], D.stepsPerMoon[0], D.years[1]));
  for (const lam of R.lamGrid) out.real.push(Object.assign(t1Case('real', eR * lam, R.stepsPerMoon[0], R.years[0]), { lam }));
  out.real.push(Object.assign(t1Case('real', eR, R.stepsPerMoon[1], R.years[0]), { lam: 1 }));
  out.real.push(Object.assign(t1Case('real', eR, R.stepsPerMoon[0], R.years[1]), { lam: 1 }));
  // 係数: 量 ÷ ε を ε の 2 点で —— 一次へ外挿 c₁・二次の係数 c₂。幅 = 刻みを倍・窓を倍にしたときの量 ÷ ε の動きの最大
  const coef = (cases) => variants().map((vv) => {
    const key = (r) => r.kind === vv.kind && r.frame === vv.frame, o = Object.assign({}, vv);
    for (const qn of T1_QTY) {
      const ys = cases.slice(0, 2).map((c) => c.rows.find(key)[qn] / c.eps), xs = cases.slice(0, 2).map((c) => c.eps), c2 = (ys[1] - ys[0]) / (xs[1] - xs[0]);
      const spread = Math.max(...cases.slice(2).map((c) => Math.abs(c.rows.find(key)[qn] / c.eps - ys[0])));
      o[qn] = { perEps: ys, c1: ys[0] - c2 * xs[0], c2, spread };
    }
    return o;
  });
  out.dimCoef = coef(out.dimless); out.realCoef = coef(out.real);
  // (0) − (α)・(0) − (β)(同じ枠): 一次の係数の差と幅(差の量の、刻みと窓での動き)
  const diffOf = (C, cases) => DECL.frames.flatMap((fr) => ['alpha', 'beta'].map((k) => {
    const a = C.find((r) => r.kind === '0'), b = C.find((r) => r.kind === k && r.frame === fr), o = { kind: k, frame: fr };
    for (const qn of T1_QTY) {
      const d0 = cases[0].rows.find((r) => r.kind === '0')[qn] - cases[0].rows.find((r) => r.kind === k && r.frame === fr)[qn];
      const spread = Math.max(...cases.slice(2).map((c) => Math.abs((c.rows.find((r) => r.kind === '0')[qn] - c.rows.find((r) => r.kind === k && r.frame === fr)[qn]) / c.eps - d0 / cases[0].eps)));
      o[qn] = { c1: a[qn].c1 - b[qn].c1, c2: a[qn].c2 - b[qn].c2, spread, rel1: Math.abs(a[qn].c1) > 0 ? Math.abs(a[qn].c1 - b[qn].c1) / Math.abs(a[qn].c1) : null };
    }
    return o;
  }));
  out.dimDiff = diffOf(out.dimCoef, out.dimless); out.realDiff = diffOf(out.realCoef, out.real);
  // 月の相対の速さの 3 つの枠での大きさ(実の比 —— 初期の点: 絶対・今の点の時計・主星)
  const S = semSystem('real'), V = S.V, P = S.P, m = S.m, sp2 = (a) => a[0] ** 2 + a[1] ** 2 + a[2] ** 2;
  const uC = (() => { const u = [0, 0, 0]; let d = 0; for (let j = 0; j < 2; j++) { const w = m[j] / Math.hypot(P[j][0] - P[2][0], P[j][1] - P[2][1], P[j][2] - P[2][2]); d += w; for (let c = 0; c < 3; c++) u[c] += w * V[j][c]; } return u.map((c) => c / d); })();
  const rel = { abs: V[2], clock: V[2].map((c, k) => c - uC[k]), host: V[2].map((c, k) => c - V[1][k]) }, kms = Math.sqrt(eR) * REAL.c / 1e3;
  out.frameSpeeds = { x2: { abs: eR * sp2(rel.abs), clock: eR * sp2(rel.clock), host: eR * sp2(rel.host) }, kmS: { abs: Math.sqrt(sp2(rel.abs)) * kms, clock: Math.sqrt(sp2(rel.clock)) * kms, host: Math.sqrt(sp2(rel.host)) * kms },
    psiSunAtMoon: eR * m[0] / Math.hypot(...P[2].map((x, c) => x - P[0][c])), psiEarthAtMoon: eR * m[1] / Math.hypot(...P[2].map((x, c) => x - P[1][c])) };
  // 実の比の λ = 1 の値を ″/年 と周期の相対の差に(1 年 = 地球の公転)。周期は固定の係数のまま(合わせない)—— 相対の差 = −Δ率 ÷ ニュートンの率
  const r1 = out.real[0], perYr = r1.Pearth / r1.Pmoon, as = 180 / Math.PI * 3600;
  out.realValues = r1.rows.map((r) => ({ kind: r.kind, frame: r.frame, dVarpiAsYr: r.dVarpi * perYr * as, dOmAsYr: r.dOm * perYr * as, siderealRel: -r.dLon / r1.newton.lon, synodicRel: -r.dSyn / r1.newton.syn, synodicS: -r.dSyn / r1.newton.syn * (2 * Math.PI / r1.newton.syn) * r1.Pmoon * Math.sqrt(REAL.AU ** 3 / REAL.GMsun) }));
  out.realNewton = { varpiAsYr: r1.newton.varpi * perYr * as, OmAsYr: r1.newton.Om * perYr * as, moonPerYr: perYr };
  return out;
}

/* ───────── T2 金星の型・水星の型(試験粒子の照合と、外の摂動の天体を足した多体)───────── */
/** 2 体〜3 体(太陽は動く)で、天体 ip の太陽に対する近点の進み ÷ 1PN を、第344便b と同じ測り方(r·v の符号の変わり目を二分で寄せる)で測る */
export function apsisNB(sys, P0, V0, opt, { ip = 1, steps, nOrb, a, e, eps }) {
  const f = makeDeriv(sys, opt), W0 = initW(sys, P0, V0, opt), n = sys.m.length, Pk = 2 * Math.PI * Math.sqrt(a ** 3 / (sys.m[0] + sys.m[ip])), h = Pk / steps;
  let s = P0.flat().concat(W0.flat());
  const rv = (st) => { const d = f(st), V = f.info.v; void d; const p = [0, 1, 2].map((c) => st[3 * ip + c] - st[c]), v = [0, 1, 2].map((c) => V[ip][c] - V[0][c]); return dot3(p, v); };
  const ang = (st) => Math.atan2(st[3 * ip + 1] - st[1], st[3 * ip] - st[0]);
  const peri = []; let g0 = rv(s), k = 0, phiPrev = ang(s);
  const unwrap = (ph, ref) => ph + 2 * Math.PI * Math.round((ref - ph) / (2 * Math.PI));
  while (peri.length < nOrb + 1 && k < steps * (nOrb + 3)) {
    const s1 = rk4Step(f, s, h), g1 = rv(s1);
    if (g0 < 0 && g1 >= 0) { let lo = 0, hi = h; for (let j = 0; j < 50; j++) { const mid = 0.5 * (lo + hi), sm = rk4Step(f, s, mid); if (rv(sm) < 0) lo = mid; else hi = mid; } peri.push(unwrap(ang(rk4Step(f, s, 0.5 * (lo + hi))), phiPrev)); }
    phiPrev = unwrap(ang(s1), phiPrev); s = s1; g0 = g1; k++;
  }
  const d = []; for (let i = 1; i < peri.length; i++) d.push(peri[i] - peri[i - 1] - 2 * Math.PI);
  void n; return { perOrbit: d.reduce((x, y) => x + y, 0) / d.length, pn: 6 * Math.PI * eps * (sys.m[0] + sys.m[ip]) / (a * (1 - e * e)), nPeri: peri.length };
}
function planetSys(e, withPert) {
  const D = DECL.t2, m = withPert ? [1, D.mPlanet, D.pert.m] : [1, D.mPlanet];
  const pl = kepState(1 + D.mPlanet, 1, e, 0, 0, 0, 0), P = [[0, 0, 0], pl.p], V = [[0, 0, 0], pl.v];
  if (withPert) { const pp = kepState(1 + D.pert.m, D.pert.a, D.pert.e, 0, 0, 120, 0); P.push(pp.p); V.push(pp.v); }
  const B = toBary(m, P, V); return { sys: { m, host: m.map((_, i) => (i === 0 ? -1 : 0)) }, P: B.P, V: B.V };
}
export function t2Rows() {
  const D = DECL.t2, rows = [], pert = [];
  for (const e of D.es) for (const kind of DECL.kinds) {
    const { sys, P, V } = planetSys(e, false), r = apsisNB(sys, P, V, { kind, eps: D.eps }, { steps: D.steps, nOrb: D.nOrb, a: 1, e, eps: D.eps });
    const ref = apsidalConv({ kind, nG: DECL.kindNG[kind], pair: 'receiver', mu: D.eps, e, steps: D.steps }).overPN;   // 第344便b の試験粒子(同じ ε・同じ刻み)
    rows.push({ e, kind, nG: DECL.kindNG[kind], overPN: r.perOrbit / r.pn, w344b: ref, diff: Math.abs(r.perOrbit / r.pn - ref), closed: closed344(kind, DECL.kindNG[kind], 'receiver'), nPeri: r.nPeri });
  }
  // 外の摂動の天体(木星の型)を足した多体: (型 − ニュートン)÷ 1PN —— 摂動の分は同じ刻み・同じ初期の状態の差で引く
  for (const e of D.es) {
    const { sys, P, V } = planetSys(e, true), arg = { steps: D.stepsPert, nOrb: D.nOrbPert, a: 1, e, eps: D.eps };
    const base = apsisNB(sys, P, V, { kind: 'N', eps: D.eps }, arg);
    for (const kind of DECL.kinds) for (const frame of (kind === '0' ? ['abs'] : ['abs', 'clock'])) {
      const r = apsisNB(sys, P, V, { kind, eps: D.eps, frame }, arg);
      pert.push({ e, kind, frame, nG: DECL.kindNG[kind], overPN: (r.perOrbit - base.perOrbit) / r.pn, newtonPerOrbitOverPN: base.perOrbit / r.pn, closed: closed344(kind, DECL.kindNG[kind], 'receiver') });
    }
  }
  return { rows, pert };
}

/* ───────── T3 時計に入れる背景の決定力(AN914)—— アプリの水星の本の背景の値 ───────── */
export function t3Rows() {
  const D = DECL.t3, psi0 = D.kappaT * D.D0, pn = mercury1PN(), out = { book: D.book, D0: D.D0, kappaT: D.kappaT, psi0, psiSunAtMercury: pn.psi, ratio: psi0 / pn.psi, arcsecCy1PN: pn.arcsecCy, rows: [], num: [] };
  for (const combo of ['none', 'both', 'app']) {
    const c = closedBg('alpha', 1, combo, psi0), c0 = closedBg('alpha', 1, 'none', 0);
    out.rows.push({ combo, closed: c, dFirst: c - c0, dArcsecCy: (c - c0) * pn.arcsecCy, dFirstLin: -(combo === 'both' ? 1 : combo === 'app' ? 3 : 0) * psi0 / 6 });
  }
  // (0)・(β) は背景に依らない(第344便b の見込み)—— 同じ値での (0)・(β) の行
  for (const kind of ['0', 'beta']) out.rows.push({ combo: 'app', kind, closed: closedBg(kind, kind === '0' ? 2 : 1, 'app', psi0), dFirst: 0, dArcsecCy: 0, dFirstLin: 0 });
  // 数値(誇張した ψ₀ —— 同じ刻みの差で一次の傾き −m/6 を見る): 第344便b の apsidalConv を呼ぶ(時計にだけ背景・不揃いの組 = 今のアプリ)
  const base = apsidalConv({ kind: 'alpha', nG: 1, e: 0.20563593, steps: 6000 }).overPN;
  for (const p0 of D.psi0Num) { const r = apsidalConv({ kind: 'alpha', nG: 1, e: 0.20563593, steps: 6000, psi0: p0, vScale: Math.exp(-p0) }).overPN; out.num.push({ psi0: p0, dOverPN: r - base, slope: (r - base) / p0, closedSlope: -(Math.exp(3 * p0) - 1) / (6 * p0) }); }
  return out;
}

/* ───────── T4 場の側の運動量の帳簿(AN915)───────── */
/** 2 体・3 体(第343便b の systemOf・ε = 1)を走らせて: 物質の運動量 Σ m v(v = dp/dt)の残り・場の帳簿 P_f = Σ m v(0) − Σ m v(t)(置けば全体は恒等で 0)・
 *  帳簿が周ごとに戻るか(2 体: 近点ごとの帳簿の増し分 ÷ 周内の振れ)・候補の式 Π = Σ m v ÷ q(当事者時間で数えた運動量)の残り・仕事の帳簿(ニュートンの E —— n_G = 0)の周ごとの増し分 */
export function ledgerRun(sysKind, kind, nG) {
  const S0 = systemOf(sysKind), m = S0.m, n = m.length, sys = { m, host: m.map((_, i) => (i === 0 ? -1 : 0)) }, opt = { kind, nG, pair: 'symmetric', eps: 1 };
  const f = makeDeriv(sys, opt), W0 = initW(sys, S0.p, S0.v, opt), Tend = DECL.t4.orbits * 2 * Math.PI * Math.sqrt(S0.a ** 3 / S0.M), nst = DECL.t4.steps, h = Tend / nst;
  let s = S0.p.flat().concat(W0.flat());
  const st = () => { f(s); const V = f.info.v.map((v) => v.slice()), q = f.info.q.slice(), P = [...Array(n)].map((_, i) => [s[3 * i], s[3 * i + 1], s[3 * i + 2]]); return { V, q, P }; };
  const mom = (V) => [0, 1, 2].map((c) => V.reduce((acc, v, i) => acc + m[i] * v[c], 0)), pi = (V, q) => [0, 1, 2].map((c) => V.reduce((acc, v, i) => acc + m[i] * v[c] / q[i], 0));
  const E = (P, V) => { let k = 0, u = 0; for (let i = 0; i < n; i++) { k += 0.5 * m[i] * dot3(V[i], V[i]); for (let j = i + 1; j < n; j++) u -= m[i] * m[j] / Math.hypot(P[j][0] - P[i][0], P[j][1] - P[i][1], P[j][2] - P[i][2]); } return k + u; };
  const z0 = st(), p0 = mom(z0.V), pi0 = pi(z0.V, z0.q), E0 = E(z0.P, z0.V), scaleP = z0.V.reduce((acc, v, i) => acc + m[i] * Math.hypot(...v), 0);
  const led = [], ledE = [], peri = []; let maxL = 0, rvPrev = null;
  for (let k = 0; k <= nst; k++) {
    const z = st(), p = mom(z.V), L = p0.map((x, c) => x - p[c]), LE = E0 - E(z.P, z.V);
    led.push(L); ledE.push(LE); maxL = Math.max(maxL, Math.hypot(...L));
    const rr = z.P[1].map((x, c) => x - z.P[0][c]), vv = z.V[1].map((x, c) => x - z.V[0][c]), rvv = dot3(rr, vv);
    if (rvPrev !== null && rvPrev < 0 && rvv >= 0) peri.push(k);
    rvPrev = rvv; if (k < nst) s = rk4Step(f, s, h);
  }
  const zEnd = st(), pEnd = mom(zEnd.V), piEnd = pi(zEnd.V, zEnd.q);
  const incs = []; for (let i = 1; i < peri.length; i++) incs.push(led[peri[i]].map((x, c) => x - led[peri[i - 1]][c]));
  const incsE = []; for (let i = 1; i < peri.length; i++) incsE.push(ledE[peri[i]] - ledE[peri[i - 1]]);
  const meanInc = incs.length ? Math.hypot(...[0, 1, 2].map((c) => incs.reduce((a, v) => a + v[c], 0) / incs.length)) : null;
  // 周内の振れ(最初の 2 つの近点の間の帳簿の、両端を結ぶ直線からの最大のずれ)
  let amp = null; if (peri.length >= 2) { const a0 = peri[0], a1 = peri[1]; amp = 0; for (let k = a0; k <= a1; k++) { const w = (k - a0) / (a1 - a0), lin = led[a0].map((x, c) => x + w * (led[a1][c] - x)); amp = Math.max(amp, Math.hypot(...led[k].map((x, c) => x - lin[c]))); } }
  const piScale = zEnd.V.reduce((acc, v, i) => acc + m[i] * Math.hypot(...v) / zEnd.q[i], 0);
  return { sys: sysKind, kind, nG, dP: Math.hypot(...pEnd.map((x, c) => x - p0[c])) / scaleP, ledgerTotal: Math.hypot(...pEnd.map((x, c) => x + led[nst][c] - p0[c])) / scaleP,
    ledgerMax: maxL / scaleP, nPeri: peri.length, perOrbitInc: meanInc === null ? null : meanInc / scaleP, withinAmp: amp === null ? null : amp / scaleP, incOverAmp: (meanInc !== null && amp > 0) ? meanInc / amp : null,
    piResid: Math.hypot(...piEnd.map((x, c) => x - pi0[c])) / piScale, dE: Math.abs(ledE[nst]) / Math.abs(E0), perOrbitIncE: incsE.length ? incsE.reduce((a, b) => a + b, 0) / incsE.length / Math.abs(E0) : null };
}
export function t4Rows() {
  const rows = [];
  for (const sysKind of ['two', 'three']) for (const nG of DECL.t4.nG) for (const kind of ['0', 'alpha', 'beta']) rows.push(ledgerRun(sysKind, kind, nG));
  return { rows };
}

/* ───────── T5 「現行の近似」の表(8 惑星 + 月の型)───────── */
/** 試験粒子の (0) 指数 2 と (α) 指数 1 の近点 ÷ 1PN と周期(近点の間の時間)を μ の格子で —— 一次 c₁ と二次の係数 c₂(μ あたり) */
export function periodAps(kind, e, mu, steps) {
  const r = apsidalConv({ kind, nG: DECL.kindNG[kind], pair: 'receiver', mu, e, steps });
  return r.overPN;
}
/** 周期の比(円軌道・同じ半径): (0) 指数 2 は ω² r = GM/r²(1 − 4ψ)・(α) 指数 1 は (1 − 3ψ − x²/2)・x² = ψ(円)→ 周期の比 P₀/P_α − 1 = ψ/4(一次) */
export function periodRatioCircle(mu, steps = 4000) {
  // 数値: 半径 1 の円の初期(各型で円になる速さ —— 角速度を一次の式でなく、その型の右辺の動径の釣り合いを二分で解く)から 1 周の時間を比べる
  const omegaOf = (kind) => {
    const f = (v) => { const psi = mu, k = kind === '0' ? Math.exp(-4 * psi) : Math.exp(-2 * psi) * Math.exp(-psi) * Math.sqrt(Math.max(0, 1 - v * v * Math.exp(4 * psi))); return v * v - mu * k; };
    let lo = 0, hi = 2 * Math.sqrt(mu); for (let j = 0; j < 200; j++) { const mid = 0.5 * (lo + hi); if (f(mid) < 0) lo = mid; else hi = mid; } return 0.5 * (lo + hi);
  };
  void steps; const w0 = omegaOf('0'), wa = omegaOf('alpha');
  return { ratio: wa / w0 - 1, closed: mu / 4 };
}
export function t5Rows() {
  const D = DECL.t5, eR = epsReal(), rows = [];
  const bodies = PLANETS.map((p) => ({ key: p.key, ja: p.ja, a: p.el.a, e: p.el.e, src: 'w299c' }));
  bodies.splice(2, 0, { key: 'earth', ja: '地球', a: REAL.aEarth, e: REAL.eEarth, src: 'real' });
  const coefCache = new Map();
  const coefOf = (e) => {
    if (coefCache.has(e)) return coefCache.get(e);
    const v = (kind) => D.muGrid.map((mu) => periodAps(kind, e, mu, D.steps)), v0 = v('0'), va = v('alpha'), d = v0.map((x, i) => x - va[i]);
    const [m1, , m4] = D.muGrid, c2 = (d[2] - d[0]) / (m4 - m1), c1 = d[0] - c2 * m1, o = { d, c1, c2, c2From12: (d[1] - d[0]) / (D.muGrid[1] - m1) };
    coefCache.set(e, o); return o;
  };
  for (const b of bodies) {
    const psi = eR / b.a, Pyr = Math.pow(b.a, 1.5), pnArcsecCy = 6 * Math.PI * psi / (1 - b.e * b.e) * (100 / Pyr) * 180 / Math.PI * 3600, c = coefOf(b.e);
    const dOverPN = 0 + c.c2 * psi;   // (0) − (α) の近点 ÷ 1PN = 解析の一次 0(見込みの式 −4/6 と −4/6)+ 数値の二次 c₂ ψ(数値の c₁ は外挿の床 —— 表に別に)
    const pr = periodRatioCircle(psi);
    rows.push({ key: b.key, ja: b.ja, a: b.a, e: b.e, psi, pnArcsecCy, c1: c.c1, c2: c.c2, c2From12: c.c2From12, dOverPN, dArcsecCy: dOverPN * pnArcsecCy, dSecondArcsecCy: c.c2 * psi * pnArcsecCy, periodRel: pr.ratio, periodRelClosed: pr.closed, periodS: pr.ratio * Pyr * 365.25 * 86400 });
  }
  return { rows };
}

/** 月の型の行(T1 の実の比 —— (0) − (α) の一次の係数 × ε と幅)。月の近地点と交点の率は ″/年・周期は相対の差(固定の係数のまま) */
export function t5Moon(t1) {
  const eR = epsReal(), r1 = t1.real[0], perYr = r1.Pearth / r1.Pmoon, as = 180 / Math.PI * 3600;
  return DECL.frames.map((fr) => { const d = t1.realDiff.find((r) => r.kind === 'alpha' && r.frame === fr);
    return { frame: fr, dVarpiAsYr: d.dVarpi.c1 * eR * perYr * as, dVarpiSpreadAsYr: d.dVarpi.spread * eR * perYr * as, dOmAsYr: d.dOm.c1 * eR * perYr * as, dOmSpreadAsYr: d.dOm.spread * eR * perYr * as,
      siderealRel: -d.dLon.c1 * eR / r1.newton.lon, synodicRel: -d.dSyn.c1 * eR / r1.newton.syn, rel1Varpi: d.dVarpi.rel1, rel1Lon: d.dLon.rel1 }; });
}

/* ───────── 純関数の場面 ───────── */
export function pureScenes() {
  const near = (a, b, t) => Math.abs(a - b) <= t;
  // ① 静止の q: qAlpha(ψ, 0) = qBeta(ψ, 0, 0) = e^(−ψ)
  const q0 = near(qAlpha(0.3, 0, 1), Math.exp(-0.3), 4e-15) && near(qBeta(0.3, [0, 0, 0], [0, 0, 0], 1), Math.exp(-0.3), 4e-15);
  // ② qBeta が同じ状態を表す(v = q U・枠つき): 大きさ(v − u) から作る qAlpha と一致
  let qMax = 0; for (const psi of [0.01, 0.2]) for (const x of [0.1, 0.5, 0.9]) { const eps = 1, c = Math.exp(-2 * psi), v = [x * c * 0.6, x * c * 0.8, 0], u = [0.1 * c, -0.05 * c, 0.02 * c], w2 = (v[0] - u[0]) ** 2 + (v[1] - u[1]) ** 2 + (v[2] - u[2]) ** 2, q = qAlpha(psi, w2, eps), U = v.map((cc) => cc / q); qMax = Math.max(qMax, Math.abs(qBeta(psi, U, u, eps) / q - 1)); }
  // ③ ε = 0 で 3 つの型とニュートンの右辺が同じ(n_G を 0 に —— 時計と G_loc が消える)
  const S = semSystem('dimless'), s = S.P.flat().concat(S.V.flat()), fN = makeDeriv(S, { kind: 'N', eps: 0 })(s);
  let rhs = 0; for (const kind of ['0', 'alpha', 'beta']) for (const frame of DECL.frames) { const fk = makeDeriv(S, { kind, eps: 0, frame })(s); rhs = Math.max(rhs, ...fk.map((x, i) => Math.abs(x - fN[i]) / (Math.abs(fN[i]) + 1e-300))); }
  // ④ 試験粒子の見込み((0) 指数 2 と (α) 指数 1 は −2/3・(β) 指数 1 は −1/3 —— 第344便b の closedOf)
  const cl = closed344('0', 2, 'receiver') === -4 / 6 && closed344('alpha', 1, 'receiver') === -4 / 6 && closed344('beta', 1, 'receiver') === -2 / 6;
  // ⑤ 円の周期の比の見込み(ψ = 1e-6 で ψ/4 —— 相対の差)
  const pr = periodRatioCircle(1e-6), prRel = Math.abs(pr.ratio / pr.closed - 1);
  // ⑥ 拒否(型が無い・枠が無い・ε が負・ψ が非有限)
  let rej = 0; try { makeDeriv(S, { kind: 'delta', eps: 1 }); } catch (e) { rej++; } try { makeDeriv(S, { kind: 'alpha', eps: 1, frame: 'x' }); } catch (e) { rej++; } try { makeDeriv(S, { kind: 'alpha', eps: -1 }); } catch (e) { rej++; } try { qAlpha(NaN, 0, 1); } catch (e) { rej++; }
  return { q0, qBetaMax: qMax, rhsMax: rhs, closed: cl, periodRel: prRel, reject: { n: rej, of: 4 } };
}
export function pureGates(S) { return { q0: S.q0 === true, qBeta: S.qBetaMax < 1e-13, rhs: S.rhsMax < 1e-12, closed: S.closed === true, period: S.periodRel < 1e-3, reject: S.reject.n === S.reject.of }; }
