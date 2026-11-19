// 第344便d(原仮定者の回答(2026-11-19 —— 第143報の回答 2)「当事者時間については、相対的な時間に換算して重力加速度などの加減速を計算する」・
//   原仮定者の回答(2026-11-19 —— 第143報の回答 3)AN876・統括の検証項目 R388):
//   **引きずりへの換算 —— 当事者時間の因子 q = N g を、並進引きずりの步のどこに掛けるかの宣言を並べ、零試験・近点の一次の項・対の力積と仕事・軸と回転の引きずりの桁を数える純関数 —— 診断だけ**
//   (器 tests/exp-w344d-dragconv.mjs と QA behavior.dragconv344d・docs.dragconv344d が読む —— html を読まない・ファイルを読まない・状態を持たない)。
//   アプリの引きずり・重力・時計・積分・内蔵の本・受理器は変えない。水星の本と今の収支(−28.65 + 71.63 = 42.98″/世紀)に項を足さない。
//   重力は第343便b の lib の宣言 (i)〔今の步〕と (iii) を呼ぶだけ(重力の換算の表は持たない)・時計の型は第342便b の lib の gOf・K1 の一次の分担は第331便c の lib の k1Share を呼ぶだけ。
//
// ■ 記号(無次元・基準光速 c₀ = 1・重力定数 1): 絶対時間 t・位置 p・速度 v(状態 —— 絶対時間で見た速度)・静止の時計の進み N = e^(−ψ)・局所光速 c_loc = e^(−2ψ)・
//   場に対する相対の速さ w = 大きさ(v − u)・x = w ÷ c_loc・当事者時間の進み q = dτ/dt = N g(x)(g = 時計の型 —— F は今のアプリの点の時計の形・U1 は比べる形)。
//   並進引きずり K1 の一次(第331便c): 源 j から受け手 i への移送の重み a_ij = 10 m_j / r(相対の軌道の b = 10 (M + m) —— 第331便c の k1B と同じ)・
//   合成は今のアプリの既定 compose:"solve"((I + L) u = s・s_i = Σ_j a_ij (v_j − v_i))。**引きずりは座標を運ぶ移送**: dp/dt = v + u・dv/dt = 加える力の加速(引きずりは v を変えない)。
// ■ 掛ける所の宣言(どれも比べるための宣言 —— 決め打ちしない・アプリへは入れない)
//   D0 掛けない(座標変換なので絶対時間のまま —— 換算は重力など「加える力」だけ)。**今のアプリの步はこの宣言に当たる**
//   D1 移送の増し分に受け手の q を 1 回(dp_i/dt = v_i + q_i u_i)
//   D2 枠の速度 u を、枠を作る源の当事者時間で読む(s_i = Σ_j a_ij q_j (v_j − v_i) —— 中心が固定の試験粒子では源の q = 1 で D0 と同じ)
//   D3 移送の重み(相対の速さを枠へ寄せる率)に受け手の q(a_ij → q_i a_ij —— 行列ごと)
//   DC 対照: 同じ q を (b) 相対の速度(s に q)・(c) 移送の増し分(q)・(d) 位置を進める所(v の分にも q)に重ねる(dp_i/dt = q_i v_i + q_i³ u_i —— 2 度数えになり得る組)
// ■ 言わないこと: 宣言は比べるための宣言(引きずりの換算がどれかを結論しない)・近点の数は誇張した場(μ/a = 1e-5)の比 —— 水星の観測の値へ合わせたものではない・
//   今の収支に足さない(足した列は「足した列」として別に置く)・光速を候補の採否に使わない(座標を運ぶ速さ u は切らない —— 原仮定者の指示(2026-11-17 —— 第140報))。
import { gRun, declFactor, gLocFactor, closedOf, apsidalPT, systemOf } from './lib-w343b-partytime.mjs';
import { gOf } from './lib-w342b-clockstop.mjs';
import { k1Share } from './lib-w331c-k1scale.mjs';
import { rk4Step, mercury1PN } from './lib-w341e-lightmass.mjs';

export const LIB_VERSION = 'w344d-dragconv-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);

export const DECL = Object.freeze({
  drags: Object.freeze(['D0', 'D1', 'D2', 'D3', 'DC']),
  candidates: Object.freeze(['D0', 'D1', 'D2', 'D3']),
  types: Object.freeze(['F', 'U1']),
  /** 重力の宣言(第343便b —— 呼ぶだけ)。none = ニュートンだけ(n_G = 0・宣言 (i))・i = 今の G_loc n_G = 2 受け手(宣言 (i))・iii = 同じ G_loc を当事者時間 1 秒あたりと読む */
  gravs: Object.freeze(['none', 'i', 'iii']),
  /** K1 の重み a = kK1 m / r(第331便c の k1B = 10 G (M + m)/c² の無次元) */
  kK1: 10,
  /** T3: 中心の質点(固定)・a = 1・μ = 1e-5・e = 水星・1 周 3000 と 6000 刻み・近点 4 回の差(第343便b の T2 と同じ) */
  orbit: Object.freeze({ mu: 1e-5, e: 0.20563593, steps: Object.freeze([3000, 6000]), nOrb: 4 }),
  /** T3 の二次の読み: 宣言の差 ÷ μ を 3 つの μ で(二次なら差 ÷ μ がほぼ一定・一次なら差が μ に依らない) */
  muSlope: Object.freeze([1e-4, 2e-4, 4e-4]),
  /** T4: 2 体(第343便b の systemOf('two') —— 質量 0.01・0.005・a = 1・e = 0.3)・1 周 4000 刻み・6 周・近点ごとに読む */
  pair: Object.freeze({ stepsPerOrbit: 4000, orbits: 6 }),
  /** 零試験: 一様な場の背景の ψ₀・一様に動く枠の速さ */
  zero: Object.freeze({ psi0: 0.3, boost: 0.05 }),
  /** T5: 代表の天体(標準の値 —— 文献の値・未照合〔この環境で一次資料に当たっていない〕)。GM は m³/s²・距離は m・c は m/s */
  c: 299792458,
  bodies: Object.freeze([
    Object.freeze({ key: 'mercury', name: '水星', GMsrc: 1.32712440018e20, a: 5.7909e10, frame: '太陽' }),
    Object.freeze({ key: 'venus', name: '金星', GMsrc: 1.32712440018e20, a: 1.08209e11, frame: '太陽' }),
    Object.freeze({ key: 'moonSun', name: '月(太陽の場・地球と一緒に動く速さ)', GMsrc: 1.32712440018e20, a: 1.495979e11, frame: '太陽' }),
    Object.freeze({ key: 'moonEarth', name: '月(地球の場・地球に対する速さ)', GMsrc: 3.986004418e14, a: 3.844e8, frame: '地球', psiExtra: 'moonSun' }),
  ]),
  litNote: 'GM(太陽 1.32712440018e20・地球 3.986004418e14 m³/s²)と軌道の長半径は標準の値 —— 文献の値・未照合(この環境で一次資料に当たっていない)。速さは円軌道の √(GM/a)',
  fOutside: 'F の x > 1 は定義域の外 —— 走りの中では max(0, 1 − x²)(第342便b の宣言と同じ)。本 lib の x は 0.2 より小さく、この宣言は効かない',
});

/* ───────── 因子 ───────── */
/** 当事者時間の進み q = N g(x)(ψ は静止の時計の ψ・x は場に対する相対の速さ ÷ c_loc) */
export function qOf(type, psi, x) {
  if (!(fin(psi) && fin(x) && x >= 0)) throw new Error('qOf: ψ・x は有限(x は非負)');
  if (!DECL.types.includes(type) && !['U2', 'U3'].includes(type)) throw new Error('qOf: 型が無い ' + type);
  return Math.exp(-psi) * gRun(type, x);
}
/** q − 1(丸めで桁を失わない形 —— T5 の小さな ψ・x 用): F は ½ log(1 − x²)・U1 は −½ log(1 + x²) */
export function qMinus1(type, psi, x) {
  if (type === 'F') return Math.expm1(-psi + 0.5 * Math.log1p(-x * x));
  if (type === 'U1') return Math.expm1(-psi - 0.5 * Math.log1p(x * x));
  throw new Error('qMinus1: 型が無い ' + type);
}
/** 2 体の solve((I + L) u = s)の閉じた形。a12・a21 は重み(D3 では q を掛けた重み)・s の速度差は (q₂ v₂ − v₁ の型を呼び手が渡す) */
export function solve2(a12, a21, s1, s2) {
  // (1 + a12) u1 − a12 u2 = s1・−a21 u1 + (1 + a21) u2 = s2 → 行列式 D = 1 + a12 + a21
  const D = 1 + a12 + a21;
  return [s1.map((x, k) => ((1 + a21) * x + a12 * s2[k]) / D), s2.map((x, k) => (a21 * s1[k] + (1 + a12) * x) / D)];
}
/**
 * 2 体の移送の速度(宣言ごと)。P・V は 3 成分 × 2・m は質量・psi0 は一様な背景の ψ(源を持たない)・type は時計の型。
 * 戻り値 { drift: [dp1/dt, dp2/dt], u: [u1, u2](D0 の枠の速度)・q: [q1, q2] }。時計の相対の速さ w_i は 2 体の重心に対する速さから D0 の u を引いたもの(枠は物質で決まる)
 */
export function pairDrift(drag, m, P, V, { type = 'F', psi0 = 0, kK1 = DECL.kK1, solo = false } = {}) {
  if (!DECL.drags.includes(drag)) throw new Error('pairDrift: 宣言が無い ' + drag);
  const d = [P[1][0] - P[0][0], P[1][1] - P[0][1], P[1][2] - P[0][2]], r = Math.hypot(d[0], d[1], d[2]);
  const has = !solo && m[0] > 0 && m[1] > 0;
  const a12 = has ? kK1 * m[1] / r : 0, a21 = has ? kK1 * m[0] / r : 0;
  const dv = [V[1][0] - V[0][0], V[1][1] - V[0][1], V[1][2] - V[0][2]];
  const s1 = dv.map((x) => a12 * x), s2 = dv.map((x) => -a21 * x);
  const [u1, u2] = solve2(a12, a21, s1, s2);
  const psi = [psi0 + (has ? m[1] / r : 0), psi0 + (has ? m[0] / r : 0)];
  // 時計の相対の速さの枠: 2 体の重心の速度(背景の決定力を持たない 2 体だけの系 —— 一様に動く枠で同じ・試験粒子の極限で源は静止)。相手がいなければ背景の枠 = 静止
  const vc = has ? [0, 1, 2].map((k) => (m[0] * V[0][k] + m[1] * V[1][k]) / (m[0] + m[1])) : [0, 0, 0];
  const rel = [V[0].map((x, k) => x - vc[k]), V[1].map((x, k) => x - vc[k])];
  const w = [Math.hypot(rel[0][0] - u1[0], rel[0][1] - u1[1], rel[0][2] - u1[2]), Math.hypot(rel[1][0] - u2[0], rel[1][1] - u2[1], rel[1][2] - u2[2])];
  const q = [0, 1].map((i) => qOf(type, psi[i], w[i] * Math.exp(2 * psi[i])));
  let U;
  if (drag === 'D0') U = [u1, u2];
  else if (drag === 'D1') U = [u1.map((x) => q[0] * x), u2.map((x) => q[1] * x)];
  else if (drag === 'D2') U = solve2(a12, a21, dv.map((x, k) => a12 * (q[1] * V[1][k] - q[1] * V[0][k])), dv.map((x, k) => a21 * (q[0] * V[0][k] - q[0] * V[1][k])));
  else if (drag === 'D3') U = solve2(q[0] * a12, q[1] * a21, dv.map((x) => q[0] * a12 * x), dv.map((x) => -q[1] * a21 * x));
  else U = [u1.map((x) => q[0] ** 3 * x), u2.map((x) => q[1] ** 3 * x)];
  const vd = drag === 'DC' ? [V[0].map((x) => q[0] * x), V[1].map((x) => q[1] * x)] : [V[0], V[1]];
  return { drift: [vd[0].map((x, k) => x + U[0][k]), vd[1].map((x, k) => x + U[1][k])], u: [u1, u2], q, U };
}

/* ───────── T3 近点(試験粒子・中心は固定)───────── */
/** 試験粒子の微分(重力は第343便b の宣言の因子・G_loc の因子を呼ぶ)。grav: none / i / iii */
function testDeriv(drag, grav, type, mu) {
  const nG = grav === 'none' ? 0 : 2, gd = grav === 'iii' ? 'iii' : 'i';
  return (s) => {
    const [x, y, vx, vy] = s, r = Math.hypot(x, y), psi = mu / r, beta = DECL.kK1 * mu / r;
    // D0 の枠(源は静止 —— solve の 1 行: u = −β v/(1 + β))・場に対する相対の速さ w = 大きさ(v − u)
    const f0 = -beta / (1 + beta), w = Math.hypot(vx, vy) * (1 - f0), xx = w * Math.exp(2 * psi), q = qOf(type, psi, xx);
    const aG = -mu / (r * r * r) * gLocFactor(nG, 'receiver', psi, 0) * declFactor(gd, type, psi, xx);
    let kv = 1, ku = f0;
    if (drag === 'D1') ku = q * f0;
    else if (drag === 'D2') ku = f0;                                   // 源の q = e^(−0) g(0) = 1(固定の源 —— 外部の場なし)
    else if (drag === 'D3') ku = -q * beta / (1 + q * beta);
    else if (drag === 'DC') { kv = q; ku = q * q * q * f0; }
    else if (drag === 'none') ku = 0;
    const c = kv + ku;
    return [c * vx, c * vy, aG * x, aG * y];
  };
}
/** 近点の進み ÷ 弱い場の 1PN(第343便b の apsidalPT と同じ数え方 —— 近点は位置と速度の内積の符号の変わり目を二分法で) */
export function apsidalDrag({ drag, grav = 'none', type = 'F', mu = DECL.orbit.mu, e = DECL.orbit.e, steps = DECL.orbit.steps[1], nOrb = DECL.orbit.nOrb }) {
  if (!(drag === 'none' || DECL.drags.includes(drag)) || !DECL.gravs.includes(grav)) throw new Error('apsidalDrag: 宣言が無い ' + drag + '/' + grav);
  const f = testDeriv(drag, grav, type, mu);
  const P = 2 * Math.PI / Math.sqrt(mu), h = P / steps, rp = 1 - e;
  let s = [rp, 0, 0, Math.sqrt(mu * (1 + e) / rp)];
  const rv = (q) => q[0] * q[2] + q[1] * q[3];
  const unwrap = (q, ref) => { const ph = Math.atan2(q[1], q[0]); return ph + 2 * Math.PI * Math.round((ref - ph) / (2 * Math.PI)); };
  const peri = []; let phiPrev = 0, g0 = rv(s), k = 0;
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
/** 重力の宣言の見込み(第343便b の closedOf を呼ぶ)・K1 の一次(第331便c の k1Share)。DC の見込みは数で読む(null) */
export function expectOf(drag, grav) {
  const g = grav === 'none' ? 0 : closedOf(grav === 'iii' ? 'iii' : 'i', 2, 'receiver');
  if (drag === 'none') return g;
  if (drag === 'DC') return null;
  return g + k1Share();
}
export function t3Rows() {
  const pn = mercury1PN(), [s1, s2] = DECL.orbit.steps, rows = [];
  for (const grav of DECL.gravs) for (const drag of ['none'].concat(DECL.drags)) for (const type of DECL.types) {
    if (grav === 'none' && drag === 'none') continue;
    // 重力だけの段は第343便b の apsidalPT を呼ぶ(重力の換算の表は第343便b・本便の枝 b が持つ —— 同じ数え方の写しを持たない)
    const run = (steps) => (drag === 'none' ? apsidalPT({ decl: grav, type, nG: 2, steps }).overPN : apsidalDrag({ drag, grav, type, steps }).overPN);
    const fine = run(s2), coarse = run(s1), ex = expectOf(drag, grav);
    rows.push({ grav, drag, type, overPN: fine, halfDiff: Math.abs(fine - coarse), expect: ex, dExpect: ex === null ? null : fine - ex, arcsecCy: fine * pn.arcsecCy });
  }
  const at = (g, d, t) => rows.find((r) => r.grav === g && r.drag === d && r.type === t).overPN;
  // 宣言の間の差(D1〜DC − D0)—— 同じ重力・同じ型
  const diff = [];
  for (const grav of DECL.gravs) for (const type of DECL.types) for (const drag of DECL.drags.slice(1)) diff.push({ grav, type, drag, minusD0: at(grav, drag, type) - at(grav, 'D0', type) });
  // 重力と K1 の和の交差の項(両方 − 重力だけ − K1 だけ)—— D0
  const cross = [];
  for (const grav of ['i', 'iii']) for (const type of DECL.types) cross.push({ grav, type, cross: at(grav, 'D0', type) - at(grav, 'none', type) - at('none', 'D0', type) });
  // 二次の読み: 差 ÷ μ を 3 つの μ で(ニュートンだけ・型 F)
  const slope = [];
  for (const drag of DECL.drags.slice(1)) {
    const v = DECL.muSlope.map((mu) => { const d0 = apsidalDrag({ drag: 'D0', mu }).overPN, dd = apsidalDrag({ drag, mu }).overPN; return { mu, diff: dd - d0, perMu: (dd - d0) / mu }; });
    slope.push({ drag, rows: v });
  }
  // 足した列(今の収支 G_loc n_G = 2 + K1 —— 動かさない。宣言ごとの和は別の列)と、実の水星の場での二次の桁(差 ÷ μ × 水星の GM/(c² a))
  const muMerc = 1.32712440018e20 / (DECL.c * DECL.c * 5.7909e10);
  const added = DECL.drags.map((drag) => { const v = at('i', drag, 'F'); return { drag, overPN: v, arcsecCy: v * pn.arcsecCy }; });
  const mercury = slope.map((s) => ({ drag: s.drag, perMu: s.rows[0].perMu, estArcsecCy: s.rows[0].perMu * muMerc * pn.arcsecCy }));
  return { pn: { arcsecCy: pn.arcsecCy }, rows, diff, cross, slope, added, mercury, muMerc };
}

/* ───────── T4 2 体の力積と仕事 ───────── */
/** 2 体を走らせ、近点ごとに (a) 移送が運んだ運動量の積み Σ m (dp/dt − v) dt(重心の移送のずれ)(b) ニュートンの E の変化 を読む */
export function runPair(drag, { type = 'F', boost = 0, stepsPerOrbit = DECL.pair.stepsPerOrbit, orbits = DECL.pair.orbits, grav = true, psi0 = 0 } = {}) {
  const S0 = systemOf('two'), m = S0.m, ub = [boost, 0, 0];
  const T = orbits * 2 * Math.PI * Math.sqrt(S0.a ** 3 / S0.M), nst = stepsPerOrbit * orbits, h = T / nst;
  const unflat = (s) => [[s.slice(0, 3), s.slice(3, 6)], [s.slice(6, 9), s.slice(9, 12)]];
  const f = (s) => {
    const [P, V] = unflat(s), dd = pairDrift(drag, m, P, V, { type, psi0 });
    const d = [P[1][0] - P[0][0], P[1][1] - P[0][1], P[1][2] - P[0][2]], r = Math.hypot(d[0], d[1], d[2]), k = grav ? 1 / (r * r * r) : 0;
    const a1 = d.map((x) => m[1] * k * x), a2 = d.map((x) => -m[0] * k * x);
    const xp = [m[0] * (dd.drift[0][0] - V[0][0]) + m[1] * (dd.drift[1][0] - V[1][0]), m[0] * (dd.drift[0][1] - V[0][1]) + m[1] * (dd.drift[1][1] - V[1][1]), m[0] * (dd.drift[0][2] - V[0][2]) + m[1] * (dd.drift[1][2] - V[1][2])];
    return dd.drift[0].concat(dd.drift[1], a1, a2, xp);
  };
  let s = S0.p[0].concat(S0.p[1], S0.v[0].map((x, k) => x + ub[k]), S0.v[1].map((x, k) => x + ub[k]), [0, 0, 0]);
  const E = (q) => { const P = [q.slice(0, 3), q.slice(3, 6)], V = [q.slice(6, 9), q.slice(9, 12)];
    const K = 0.5 * m[0] * ((V[0][0] - ub[0]) ** 2 + V[0][1] ** 2 + V[0][2] ** 2) + 0.5 * m[1] * ((V[1][0] - ub[0]) ** 2 + V[1][1] ** 2 + V[1][2] ** 2);
    return K - m[0] * m[1] / Math.hypot(P[1][0] - P[0][0], P[1][1] - P[0][1], P[1][2] - P[0][2]); };
  const rv = (q) => (q[3] - q[0]) * (q[9] - q[6]) + (q[4] - q[1]) * (q[10] - q[7]) + (q[5] - q[2]) * (q[11] - q[8]);
  const E0 = E(s), peri = [], scaleP = m[0] * Math.hypot(...S0.v[0]) + m[1] * Math.hypot(...S0.v[1]);
  let g0 = rv(s);
  for (let k = 0; k < nst; k++) {
    const s1 = rk4Step(f, s, h), g1 = rv(s1);
    if (g0 < 0 && g1 >= 0) peri.push({ dE: (E(s1) - E0) / Math.abs(E0), xp: Math.hypot(s1[12], s1[13], s1[14]) / (scaleP * S0.a) });
    s = s1; g0 = g1;
  }
  return { peri, P: [s.slice(0, 3), s.slice(3, 6)], T, end: { dE: (E(s) - E0) / Math.abs(E0), xp: Math.hypot(s[12], s[13], s[14]) / (scaleP * S0.a) } };
}
export function t4Rows() {
  const rows = [];
  for (const drag of DECL.drags) for (const type of DECL.types) {
    const r = runPair(drag, { type }), p = r.peri, n = p.length;
    const dEMax = Math.max(...p.map((z) => Math.abs(z.dE)));
    // 近点ごとの E の変化の傾き(1 周あたり —— 最小二乗)・移送の運動量の積みの最後の値と半分の所の値
    const ii = p.map((_, i) => i), mi = ii.reduce((a, b) => a + b, 0) / n, me = p.reduce((a, z) => a + z.dE, 0) / n;
    const sl = ii.reduce((a, i) => a + (i - mi) * (p[i].dE - me), 0) / ii.reduce((a, i) => a + (i - mi) ** 2, 0);
    rows.push({ drag, type, nPeri: n, dEPeriMax: dEMax, dESlope: sl, xpHalf: p[Math.floor(n / 2) - 1].xp, xpEnd: p[n - 1].xp });
  }
  return { rows };
}

/* ───────── 零試験(T2)───────── */
/** ① 静止(全部の速度 0)② 一様な場(源なし・背景 ψ₀)③ 一様に動く枠(2 体と枠が同じ u で動く —— 軌道は u t ずらしたもの)。宣言の間の差 = 0 か */
export function zeroTests() {
  const S = systemOf('two'), Vr = [[0, 0, 0], [0, 0, 0]], out = { rest: [], uniform: [], boost: [] };
  const base0 = pairDrift('D0', S.m, S.p, Vr, {});
  for (const drag of DECL.drags) {
    const d = pairDrift(drag, S.m, S.p, Vr, { psi0: DECL.zero.psi0 });
    out.rest.push({ drag, maxDiff: Math.max(...[0, 1].flatMap((i) => [0, 1, 2].map((k) => Math.abs(d.drift[i][k] - base0.drift[i][k])))) });
  }
  const Vs = [[0.1, 0.02, 0], [-0.03, 0.05, 0.01]];
  for (const drag of DECL.drags) {
    const d = pairDrift(drag, [1, 1], S.p, Vs, { psi0: DECL.zero.psi0, solo: true });
    out.uniform.push({ drag, maxDiff: Math.max(...[0, 1].flatMap((i) => [0, 1, 2].map((k) => Math.abs(d.drift[i][k] - Vs[i][k])))) });
  }
  for (const drag of DECL.drags) {
    const opt = { orbits: 2, stepsPerOrbit: 2000 }, r0 = runPair(drag, opt), r1 = runPair(drag, Object.assign({ boost: DECL.zero.boost }, opt));
    let mx = 0; for (let i = 0; i < 2; i++) for (let k = 0; k < 3; k++) mx = Math.max(mx, Math.abs(r1.P[i][k] - (r0.P[i][k] + (k === 0 ? DECL.zero.boost * r0.T : 0))));
    out.boost.push({ drag, maxShift: mx });
  }
  return out;
}

/* ───────── T5 軸・回転の引きずりの率に q を掛けたときの相対の変化の桁 ───────── */
/** 代表の天体の ψ = GM/(c² a)・x = v/c(円軌道の速さ —— 局所光速の補正 e^(2ψ) は x² の桁で ψ x² —— 二次)・q − 1(型 F・U1)。
 *  率(軸引きずりの ω・回転引きずりの帯の場)に q を掛けると、相対の変化は q − 1(どの率でも同じ —— 率の形に依らない) */
export function t5Rows() {
  const c = DECL.c, rows = [], byKey = {};
  for (const b of DECL.bodies) {
    let psi = b.GMsrc / (c * c * b.a);
    const v = Math.sqrt(b.GMsrc / b.a);
    if (b.psiExtra) psi += byKey[b.psiExtra].psi;   // 月(地球の場): ψ は太陽と地球の和・速さは地球に対する速さ
    const x = v / c * Math.exp(2 * psi);
    const r = { key: b.key, name: b.name, frame: b.frame, psi, halfX2: x * x / 2, qm1F: qMinus1('F', psi, x), qm1U1: qMinus1('U1', psi, x) };
    byKey[b.key] = r; rows.push(r);
  }
  return { rows };
}

/* ───────── 純関数の場面 ───────── */
export function pureScenes() {
  // ① 静止(ψ = 0・x = 0)で q = 1(型 F・U1)・gOf と gRun が型 F の定義域の内で同じ
  const q0 = DECL.types.every((t) => Math.abs(qOf(t, 0, 0) - 1) < 1e-15) && [0, 0.1, 0.5, 0.9].every((x) => Math.abs(gOf('F', x) - gRun('F', x)) < 1e-15 && Math.abs(gOf('U1', x) - gRun('U1', x)) < 1e-15);   // 丸めの 1 bit を許す
  // ② q − 1 の丸めで桁を失わない形と素の形の差(ψ = 1e-3・x = 0.03 —— 相対 1e-12 より小さい)
  const qmRel = Math.max(...DECL.types.map((t) => Math.abs(qMinus1(t, 1e-3, 0.03) - (qOf(t, 1e-3, 0.03) - 1)) / Math.abs(qOf(t, 1e-3, 0.03) - 1)));
  // ③ 2 体の solve の閉じた形が方程式を満たす・運動量 Σ m u = 0(D0 —— 対称の重み a_ij m_i = a_ji m_j)
  const m = [0.01, 0.005], P = [[-0.002, 0, 0], [0.7, 0.1, 0]], V = [[0.01, -0.02, 0], [-0.03, 0.08, 0.004]], d = pairDrift('D0', m, P, V);
  const r = Math.hypot(0.702, 0.1), a12 = DECL.kK1 * m[1] / r, a21 = DECL.kK1 * m[0] / r;
  const res = Math.max(...[0, 1, 2].map((k) => Math.abs((1 + a12) * d.u[0][k] - a12 * d.u[1][k] - a12 * (V[1][k] - V[0][k]))), ...[0, 1, 2].map((k) => Math.abs(-a21 * d.u[0][k] + (1 + a21) * d.u[1][k] - a21 * (V[0][k] - V[1][k]))));
  const mom = Math.max(...[0, 1, 2].map((k) => Math.abs(m[0] * d.u[0][k] + m[1] * d.u[1][k])));
  // ④ 試験粒子の極限(m₀ ≫ m₁・源が静止)で D2 = D0(源の q の残りは 1e-12 の桁 —— 移送の分に対する相対 1e-9 より小さい)・D1 = D3 は一次で同じ(差は β² の桁)
  const mT = [1e-3, 1e-12], PT = [[0, 0, 0], [1, 0, 0]], VT = [[0, 0, 0], [0, 0.03, 0]];
  const dd = (k) => pairDrift(k, mT, PT, VT).drift[1][1];
  const d2eq0 = Math.abs(dd('D2') - dd('D0')) / Math.abs(dd('D0') - VT[1][1]) < 1e-9, d13 = Math.abs(dd('D3') - dd('D1')) / Math.abs(dd('D1') - VT[1][1]);
  // ⑤ 拒否: 宣言が無い・型が無い・x が負
  let rej = 0; try { pairDrift('D9', m, P, V); } catch (e) { rej++; } try { qOf('V', 0, 0.1); } catch (e) { rej++; } try { qOf('F', 0, -1); } catch (e) { rej++; } try { apsidalDrag({ drag: 'D1', grav: 'ii' }); } catch (e) { rej++; }
  return { q0, qmRel, solveRes: res, momMax: mom, d2eq0, d13, reject: { n: rej, of: 4 } };
}
export function pureGates(S) {
  return { q0: S.q0 === true, qm: S.qmRel < 1e-9, solve: S.solveRes < 1e-15 && S.momMax < 1e-18, testLimit: S.d2eq0 === true && S.d13 < 1e-2, reject: S.reject.n === S.reject.of };
}
