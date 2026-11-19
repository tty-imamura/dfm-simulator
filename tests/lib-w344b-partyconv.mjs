// 第344便b(原仮定者の回答(2026-11-19 —— 第143報の回答 2)「当事者時間については、相対的な時間に換算して重力加速度などの加減速を計算する」・
//   原仮定者の回答(2026-11-19 —— 第143報の回答 3)AN876「推奨で進める」・AN877「推奨で進める。X_k=G_0/c _0^2=G_loc/c_loc^2、となる想定」・統括の検証項目 R386):
//   **当事者時間の換算の掛け方を 3 つの型(と現行)で同じ初期状態から積み、近点の一次と二次・想定 X_k = G₀/c₀² = G_loc/c_loc² の零試験・対の力積と仕事を数える純関数 —— 診断だけ**
//   (器 tests/exp-w344b-partyconv.mjs と QA behavior.partyconv344b・docs.partyconv344b が読む —— html を読まない・ファイルを読まない・状態を持たない)。
//   アプリの積分・重力の式・時計・内蔵の本・受理器は変えない。水星の本と今の収支(42.98″/世紀)に項を足さない。
//   G_loc の因子・時計の型・小さい系の初期の状態と第343便b の近点は第343便b の lib を呼ぶだけ・RK4 の 1 步と水星の 1PN は第341便e の lib を呼ぶだけ(本文は変えない)。
//
// ■ 記号(無次元・基準光速 c₀ = 1・重力定数 1): 絶対時間 t・位置 p・絶対時間で見た速度 v = dp/dt(場は静止 —— 場に対する相対の速度 w = v)・静止の時計の進み N = e^(−ψ_c)・
//   局所光速 c_loc = c₀e^(−2ψ_c)(絶対時間)・x = 大きさ(v) ÷ c_loc・時計の因子は今の点の時計の形 g = √(1 − x²)(当事者時間で測った速さ y の読みでは 1/√(1 + y²))・
//   当事者時間の進み q = dτ/dt = N g。重力 a_G = G_loc つきのニュートンの加速(受け手の型 G e^(−2 n_G ψ_G)・対称の型 G e^(−n_G(ψ_i + ψ_j)))。ψ_c = ψ_G + ψ₀(ψ₀ = 時計にだけ入れる一様な背景 —— 既定 0)。
// ■ 換算の型(同じ位置・同じ絶対時間の速度から積む)
//   (0) 現行: dv/dt = a_G(今のアプリの步 —— 第343便b の宣言 (i))
//   (α) 速度の増し分を当事者時間 1 秒あたりで数える: dv/dτ = a_G → dv/dt = q a_G(絶対時間のキックに因子 q を 1 回 —— 第343便b の宣言 (iii) と同じ式)
//   (β) 位置の 2 階の量を当事者時間で数える: d²p/dτ² = a_G → 状態を U = dp/dτ に取り dp/dt = q U・dU/dt = q a_G。q は U から作る:
//       x = q 大きさ(U) ÷ c_loc を解いて q = N ÷ √(1 +(大きさ(U) ÷(c₀N))²)。連鎖律 d²p/dt² = q² d²p/dτ² + (dq/dt)(dp/dτ) の第 2 項が自動で入る
//   (γ) 対照: キックに q² を掛けるだけ(dv/dt = q² a_G —— 第 2 項を落とした型)
// ■ 見込みの式(弱い場・試験粒子・一次 —— 近点の進み ÷ 1PN): (0)・(β) = −2 n_G k/6・(α) = −(2 n_G k + 2)/6・(γ) = −(2 n_G k + 4)/6(k = 受け手 1・対称 ½)。
//   (β) は τ を独立の変数にすると d²p/dτ² = a_G(p) —— 空間の軌道は τ の取り直しで変わらないので、時計の因子は近点の一次に入らない(初期の状態の換算だけが二次に入る)。
// ■ 言わないこと: 型は比べるための型(どれを採るかは決めない)・数は誇張した場(μ/a = 1e-5 ほか)の比 —— 水星の観測の値へ合わせたものではない・今の収支に足さない
//   (足した列は「足した列」として別に置く)・X_k の想定が成り立つかを結論しない(この単位の取り方・この型・この ψ の作り方では、の表)・光速を候補の採否に使わない。
import { gRun, gLocFactor, systemOf, apsidalPT } from './lib-w343b-partytime.mjs';
import { rk4Step, mercury1PN } from './lib-w341e-lightmass.mjs';

export const LIB_VERSION = 'w344b-partyconv-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);

export const DECL = Object.freeze({
  kinds: Object.freeze(['0', 'alpha', 'beta', 'gamma']),
  /** 対照(追加の依頼 1): 対に共通の因子を掛ける (α) —— 幾何平均 √(q_i q_j)・算術平均 (q_i + q_j)/2(試験粒子では中心の q = 1) */
  common: Object.freeze(['alphaGeo', 'alphaAri']),
  /** 見込みの式の (ℓ + s) の和(因子 N と g を何回掛けたか —— 一次の項。共通の因子は半分) */
  lsSum: Object.freeze({ 0: 0, alpha: 2, beta: 0, gamma: 4, alphaGeo: 1, alphaAri: 1 }),
  /** 背景の 3 つの組(追加の依頼 1): none = 両方なし・both = 重力と時計の両方に一様な背景 ψ₀・app = 今のアプリと同じ不揃い(重力はほかの天体だけ・時計は背景を含む) */
  bgCombos: Object.freeze(['none', 'both', 'app']),
  bgPsi0: Object.freeze([0.01, 0.1]),
  nG: Object.freeze([1, 2]),
  pairs: Object.freeze(['receiver', 'symmetric']),
  /** T1: 中心の質点(固定)・場は静止・背景・軟化・引きずり無し。a = 1・離心率 3(水星・金星・月の型)・1 周の刻み 3000 と 6000・近点 4 回の差 */
  orbit: Object.freeze({ mu: 1e-5, es: Object.freeze([0.20563593, 0.0068, 0.055]), steps: Object.freeze([3000, 6000]), nOrb: 4 }),
  /** T3: μ を振って二次の係数を分ける(水星の型の e・受け手の型・刻み 6000) */
  muGrid: Object.freeze([1e-5, 2e-5, 4e-5]),
  /** K1 の一次の比(第331便c の +5/3 —— 文書の値)—— 足した列だけ */
  k1Over1PN: 5 / 3,
  /** T2: 想定 X_k = G₀/c₀² の零試験 —— 深さ ψ_G・時計の背景 ψ₀・動く当事者の x */
  psiGrid: Object.freeze([1e-3, 0.1, 0.5]),
  psi0Grid: Object.freeze([0, 0.01, 0.1]),
  xMove: Object.freeze([0, 0.3, 0.6]),
  hDrop: Object.freeze([1e-4, 5e-5]),
  /** T4: 小さい系(第343便b の systemOf —— 2 体・3 体)・RK4 の刻み・周回 */
  nbody: Object.freeze({ steps: 4000, orbits: 2 }),
  clock: '時計の因子は今の点の時計の形 F(√(1 − x²))だけ —— (β) の q を U から閉じた形で作るため(ほかの形は第343便b の表)',
});

/* ───────── 因子 ───────── */
/** 静止の時計の進み N と局所光速(ψ_c = ψ_G + ψ₀) */
export const clockN = (psiC) => Math.exp(-psiC);
export const cLocAbs = (psiC) => Math.exp(-2 * psiC);
/** 絶対時間の速さ v から q = N g(x)(x = v ÷ c_loc —— F の x > 1 は 0) */
export function qOfV(psiC, v) { if (!(fin(psiC) && fin(v) && v >= 0)) throw new Error('qOfV: ψ・v は有限(v は非負)'); return clockN(psiC) * gRun('F', v / cLocAbs(psiC)); }
/** 当事者時間の速さ U(= dp/dτ の大きさ)から q = N ÷ √(1 +(U ÷ N)²)(c₀ = 1) */
export function qOfU(psiC, U) { if (!(fin(psiC) && fin(U) && U >= 0)) throw new Error('qOfU: ψ・U は有限(U は非負)'); const N = clockN(psiC), Y = U / N; return N / Math.sqrt(1 + Y * Y); }
/** 見込みの式(一次) */
export function closedOf(kind, nG, pair) { const k = pair === 'symmetric' ? 0.5 : 1; if (!(kind in DECL.lsSum)) throw new Error('closedOf: 型が無い ' + kind); return -(2 * nG * k + DECL.lsSum[kind]) / 6; }

/** 試験粒子の右辺(状態 [x, y, w_x, w_y] —— w は (β) で U・ほかは v) */
/** psi0 = 時計にだけ入れる一様な背景・psi0G = 重力の決定力に入れる一様な背景(中心の ψ も psi0G —— 対称の型) */
export function derivTest(kind, { mu, nG, pair, psi0 = 0, psi0G = 0 }) {
  if (!DECL.kinds.includes(kind) && !DECL.common.includes(kind)) throw new Error('derivTest: 型が無い ' + kind);
  return (s) => {
    const [x, y, wx, wy] = s, r = Math.hypot(x, y), psiS = mu / r, psiG = psiS + psi0G, psiC = psiS + psi0, k = -mu / (r * r * r) * gLocFactor(nG, pair, psiG, psi0G);
    const ax = k * x, ay = k * y, w = Math.hypot(wx, wy);
    if (kind === '0') return [wx, wy, ax, ay];
    if (kind === 'beta') { const q = qOfU(psiC, w); return [q * wx, q * wy, q * ax, q * ay]; }
    const q = qOfV(psiC, w), f = kind === 'alpha' ? q : kind === 'gamma' ? q * q : kind === 'alphaGeo' ? Math.sqrt(q) : 0.5 * (1 + q);   // 共通の因子 —— 中心の q = 1
    return [wx, wy, f * ax, f * ay];
  };
}
/** 近点の進み ÷ 1PN(同じ位置・同じ絶対時間の速度から —— (β) は U₀ = v₀ ÷ q₀) */
export function apsidalConv({ kind, nG, pair = 'receiver', mu = DECL.orbit.mu, e = DECL.orbit.es[0], steps = 6000, nOrb = DECL.orbit.nOrb, psi0 = 0, psi0G = 0, vScale = 1 }) {
  const f = derivTest(kind, { mu, nG, pair, psi0, psi0G });
  const P = 2 * Math.PI / Math.sqrt(mu * vScale), h = P / steps, rp = 1 - e, v0 = Math.sqrt(vScale * mu * (1 + e) / rp);   // vScale = 一様な倍率(背景の組 —— 同じ形の軌道から始める)
  const w0 = kind === 'beta' ? v0 / qOfV(mu / rp + psi0, v0) : v0;
  let s = [rp, 0, 0, w0];
  const rv = (q) => q[0] * q[2] + q[1] * q[3];   // (β) でも dp/dt = q U(q > 0)なので符号は同じ
  const unwrap = (q, ref) => { const ph = Math.atan2(q[1], q[0]); return ph + 2 * Math.PI * Math.round((ref - ph) / (2 * Math.PI)); };
  const peri = [], rP = [], rA = []; let phiPrev = Math.atan2(s[1], s[0]), g0 = rv(s), k = 0;
  const cross = (up) => { let lo = 0, hi = h; for (let j = 0; j < 60; j++) { const mid = 0.5 * (lo + hi), sm = rk4Step(f, s, mid); if ((rv(sm) < 0) === up) lo = mid; else hi = mid; } return rk4Step(f, s, 0.5 * (lo + hi)); };
  while (peri.length < nOrb + 1 && k < steps * (nOrb + 3)) {
    const s1 = rk4Step(f, s, h), g1 = rv(s1);
    if (g0 < 0 && g1 >= 0) { const sp = cross(true); peri.push(unwrap(sp, phiPrev)); rP.push(Math.hypot(sp[0], sp[1])); }
    if (g0 > 0 && g1 <= 0) { const sa = cross(false); rA.push(Math.hypot(sa[0], sa[1])); }
    phiPrev = unwrap(s1, phiPrev); s = s1; g0 = g1; k++;
  }
  const d = []; for (let i = 1; i < peri.length; i++) d.push(peri[i] - peri[i - 1] - 2 * Math.PI);
  const per = d.reduce((a, b) => a + b, 0) / d.length, avg = (a) => a.reduce((x, y) => x + y, 0) / a.length;
  const rp1 = avg(rP), ra1 = avg(rA), pMeas = 2 * rp1 * ra1 / (rp1 + ra1);   // 測った半直弦(近点と遠点の距離から)
  return { overPN: per / (6 * Math.PI * mu / (1 - e * e)), overPNp: per / (6 * Math.PI * mu / pMeas), pMeas, nPeri: peri.length };
}

/* ───────── T1 換算の 3 つの型と現行の近点 ───────── */
export function t1Rows() {
  const pn = mercury1PN(), [s1, s2] = DECL.orbit.steps, rows = [];
  for (const e of DECL.orbit.es) for (const pair of DECL.pairs) for (const nG of DECL.nG) for (const kind of DECL.kinds) {
    const fine = apsidalConv({ kind, nG, pair, e, steps: s2 }), coarse = apsidalConv({ kind, nG, pair, e, steps: s1 }), cl = closedOf(kind, nG, pair);
    rows.push({ e, pair, nG, kind, overPN: fine.overPN, halfDiff: Math.abs(fine.overPN - coarse.overPN), nPeri: fine.nPeri, closed: cl, dClosed: fine.overPN - cl });
  }
  const at = (e, p, n, k) => rows.find((r) => r.e === e && r.pair === p && r.nG === n && r.kind === k).overPN;
  // 連鎖律の第 2 項の効き((β) − (γ))と、(β) − (0)(時計の因子が一次に入らない)
  const chain = [];
  for (const e of DECL.orbit.es) for (const pair of DECL.pairs) for (const nG of DECL.nG)
    chain.push({ e, pair, nG, betaMinusGamma: at(e, pair, nG, 'beta') - at(e, pair, nG, 'gamma'), betaMinus0: at(e, pair, nG, 'beta') - at(e, pair, nG, '0'), alphaMinus0: at(e, pair, nG, 'alpha') - at(e, pair, nG, '0') });
  // 第343便b の lib の近点との照合(同じ e・同じ刻み —— (0) = 宣言 (i)・(α) = 宣言 (iii) の F)
  const cross = [];
  for (const nG of DECL.nG) for (const [kind, decl] of [['0', 'i'], ['alpha', 'iii']]) {
    const a = at(DECL.orbit.es[0], 'receiver', nG, kind), b = apsidalPT({ decl, type: 'F', nG, steps: s2 }).overPN;
    cross.push({ nG, kind, decl343b: decl, here: a, w343b: b, diff: Math.abs(a - b) });
  }
  // 足した列(″/世紀への換算と K1 の +5/3 と足した和 —— 水星の型の e・受け手の型。今の収支は動かさない)
  const added = [];
  for (const nG of DECL.nG) for (const kind of DECL.kinds) { const v = at(DECL.orbit.es[0], 'receiver', nG, kind);
    added.push({ nG, kind, overPN: v, gLocArcsecCy: v * pn.arcsecCy, withK1: v + DECL.k1Over1PN, withK1ArcsecCy: (v + DECL.k1Over1PN) * pn.arcsecCy }); }
  return { pn: { arcsecCy: pn.arcsecCy }, rows, chain, cross, added };
}

/* ───────── T2 想定 X_k = G₀/c₀² = G_loc/c_loc² の零試験 ───────── */
/** 閉じた形: その単位の G ÷ その単位の c² ÷ X_k。unit 'abs'(絶対時間)・'static'(静止の当事者の時計 N)・'moving'(動く当事者の時計 q = N g)。
 *  kind '0'・'alpha'・'beta'。G_abs は静止(または τ の枠の則)で絶対時間に直した重力・G はその単位で dv/dτ(α —— 時計の進みで 1 回割る)・d²p/dτ²(β —— 2 回割る)の則 */
export function xkClosed({ unit, kind, nG, psiG, psi0 = 0, psi0G = 0, x = 0 }) {
  const psiC = psiG + psi0, N = clockN(psiC), g = Math.sqrt(1 - x * x), cAbs = cLocAbs(psiC), G1 = Math.exp(-2 * nG * (psiG + psi0G));
  if (unit === 'abs') { const f = kind === '0' ? 1 : kind === 'alpha' ? N * g : (N * g) ** 2; return G1 * f / (cAbs * cAbs); }
  const rate = unit === 'static' ? N : N * g, c = cAbs / rate;
  const Gu = kind === '0' ? G1 / rate ** 2 : G1;   // (0) は絶対時間の則を時間の単位の 2 乗で直す・(α)・(β) はその単位の則が G_loc そのもの
  return Gu / (c * c);
}
/** 数値: 静止(x = 0)の行は短い落下(2 刻みで寄せる)で絶対時間の加速を測り、その単位に直す。動く行(x > 0)は右辺の関数の値を接線の速度で読む */
export function xkNumeric({ unit, kind, nG, psiG, psi0 = 0, psi0G = 0, x = 0 }) {
  const mu = 1e-3, r0 = mu / psiG, aN = mu / (r0 * r0), psiC = psiG + psi0, N = clockN(psiC), cAbs = cLocAbs(psiC);
  let aAbs, rate;
  if (x === 0) {
    const est = DECL.hDrop.map((hr) => {
      const Hh = hr * Math.sqrt(r0 / aN), nst = 200, dt = Hh / nst, f = derivTest(kind, { mu, nG, pair: 'receiver', psi0, psi0G });
      let s = [r0, 0, 0, 0]; for (let k = 0; k < nst; k++) s = rk4Step(f, s, dt);
      return 2 * (r0 - s[0]) / (Hh * Hh);
    });
    aAbs = 2 * est[1] - est[0]; rate = N;
  } else {
    const v = x * cAbs, f = derivTest(kind, { mu, nG, pair: 'receiver', psi0, psi0G });
    const w = kind === 'beta' ? v / qOfV(psiC, v) : v, d = f([r0, 0, 0, w]);
    rate = qOfV(psiC, v);
    aAbs = kind === 'beta' ? -d[2] * rate : -d[2];   // (β) の dU/dt = q a_G —— 絶対時間の加速の則に直すと q を掛ける(接線の速度で動径の加速 —— 第 2 項は接線の向き)
  }
  if (unit === 'abs') return (aAbs / aN) / (cAbs * cAbs);
  const r = unit === 'static' ? N : rate, c = cAbs / r, pw = kind === 'alpha' ? 1 : 2;
  return (aAbs / aN) / r ** pw / (c * c);
}
export function t2Rows() {
  const rows = [];
  const push = (o, group) => { const cl = xkClosed(o), num = xkNumeric(o); rows.push(Object.assign({ group }, o, { closed: cl, numeric: num, rel: Math.abs(num / cl - 1) })); };
  for (const psiG of DECL.psiGrid) for (const nG of DECL.nG) for (const kind of ['0', 'alpha', 'beta']) push({ unit: 'abs', kind, nG, psiG, psi0: 0, x: 0 }, 'i');
  for (const psiG of DECL.psiGrid) for (const nG of DECL.nG) for (const kind of ['0', 'alpha', 'beta']) push({ unit: 'static', kind, nG, psiG, psi0: 0, x: 0 }, 'ii');
  // (iii) 背景の 3 つの組(none・both・app)× ψ₀
  for (const combo of DECL.bgCombos) for (const psi0 of (combo === 'none' ? [0] : DECL.bgPsi0)) for (const unit of ['abs', 'static']) for (const [kind, nG] of [['0', 2], ['alpha', 1], ['beta', 1]])
    push({ unit, kind, nG, psiG: 0.1, psi0, psi0G: combo === 'both' ? psi0 : 0, x: 0, combo }, 'iii');
  for (const x of DECL.xMove) for (const unit of ['abs', 'moving']) for (const [kind, nG] of [['0', 2], ['alpha', 1], ['beta', 1]]) push({ unit, kind, nG, psiG: 0.1, psi0: 0, x }, 'iv');
  // 「どの当事者でも 1」の組と「静止のときだけ 1」の組(格子の上で閉じた形が 1 から 1e-12 より離れない組)
  const keyOf = (r) => r.unit + '/' + r.kind + '/' + r.nG, groups = {};
  for (const r of rows) { if (r.combo === 'both') continue; const k = keyOf(r); (groups[k] = groups[k] || { unit: r.unit, kind: r.kind, nG: r.nG, rest: [], move: [], bg: [] });
    const dev = Math.abs(r.closed - 1); if (r.psi0 > 0) groups[k].bg.push(dev); else if (r.x > 0) groups[k].move.push(dev); else groups[k].rest.push(dev); }
  const mx = (a) => (a.length ? Math.max(...a) : null);
  const sets = Object.values(groups).map((g) => ({ unit: g.unit, kind: g.kind, nG: g.nG, restMax: mx(g.rest), moveMax: mx(g.move), bgMax: mx(g.bg),
    reading: mx(g.rest) === null ? '—' : mx(g.rest) > 1e-12 ? '静止でも 1 でない' : (mx(g.move) !== null && mx(g.move) > 1e-12) ? '静止のときだけ 1' : '格子の全部で 1' }));
  return { rows, sets };
}
/** 背景の 3 つの組で近点(水星・金星・月の型の e × (0) 指数 2・(α) 指数 1・(β) 指数 1 —— 受け手の型・刻み 6000)。
 *  一様な背景は勾配を作らない —— 重力の加速の向きと相対の大きさは変えず、G_loc の全体の倍率 e^(−2 n_G ψ₀)(重力に入れたとき)・時計の倍率 e^(−ψ₀)(時計に入れたとき)を変える。
 *  一様な倍率を初期の速さに入れて(vScale —— (0) は G の倍率 s_G・(α) は s_G e^(−ψ₀)・(β) は s_G e^(−2ψ₀) —— 同じ形の軌道から始める)、名目の比と測った半直弦で割った比(overPNp)を並べる */
/** 背景の組の見込み(一次): (0)・(β) は背景に依らない(一様な倍率は近点の率を変えない —— (β) は時計の因子が一次に入らない)。
 *  (α) は速さの因子 g の x = v ÷ c_loc が時計の背景で e^(2ψ₀) 倍に読まれ、v² が倍率で変わる —— s の項が e^(m ψ₀) 倍(m = 両方 1・不揃い 3・なし 0) */
export function closedBg(kind, nG, combo, psi0) { if (kind !== 'alpha') return closedOf(kind, nG, 'receiver'); const m = combo === 'both' ? 1 : combo === 'app' ? 3 : 0; return -(2 * nG + 1 + Math.exp(m * psi0)) / 6; }
export function bgScale(kind, nG, combo, psi0) { const sG = combo === 'both' ? Math.exp(-2 * nG * psi0) : 1, sC = combo === 'none' ? 1 : Math.exp(-psi0); return kind === '0' ? sG : kind === 'alpha' ? sG * sC : sG * sC * sC; }
export function bgOrbitRows() {
  const rows = [];
  for (const e of DECL.orbit.es) for (const [kind, nG] of [['0', 2], ['alpha', 1], ['beta', 1]]) for (const combo of DECL.bgCombos) for (const psi0 of (combo === 'none' ? [0] : DECL.bgPsi0)) {
    const vScale = bgScale(kind, nG, combo, psi0), r = apsidalConv({ kind, nG, e, psi0, psi0G: combo === 'both' ? psi0 : 0, vScale });
    rows.push({ e, kind, nG, combo, psi0, vScale, overPN: r.overPN, overPNp: r.overPNp, pMeas: r.pMeas, closed: closedBg(kind, nG, combo, psi0) });
  }
  const base = (r) => rows.find((q) => q.e === r.e && q.kind === r.kind && q.combo === 'none');
  for (const r of rows) { r.dNoneP = r.overPNp - base(r).overPNp; r.dNone = r.overPN - base(r).overPN; r.dClosed = r.overPN - r.closed; }
  return { rows };
}

/* ───────── T3 二次の項(μ を振る)───────── */
export function t3Rows() {
  const e = DECL.orbit.es[0], rows = [];
  for (const nG of DECL.nG) for (const kind of ['0', 'alpha', 'beta']) {
    const v = DECL.muGrid.map((mu) => apsidalConv({ kind, nG, mu, e }).overPN), [m1, m2, m4] = DECL.muGrid;
    const c2a = (v[2] - v[0]) / (m4 - m1), c2b = (v[1] - v[0]) / (m2 - m1), c1 = v[0] - c2a * m1, cl = closedOf(kind, nG, 'receiver');
    rows.push({ nG, kind, values: v, c2From14: c2a, c2From12: c2b, c1Extrap: c1, closed: cl, dC1: c1 - cl });
  }
  const at = (n, k) => rows.find((r) => r.nG === n && r.kind === k);
  const pairs = [['0', 2, 'alpha', 1], ['0', 2, 'beta', 2], ['0', 1, 'beta', 1]].map(([k1, n1, k2, n2]) => ({ a: { kind: k1, nG: n1 }, b: { kind: k2, nG: n2 },
    dC1: at(n1, k1).c1Extrap - at(n2, k2).c1Extrap, dC2: at(n1, k1).c2From14 - at(n2, k2).c2From14 }));
  return { e, rows, pairs };
}

/* ───────── T4 対の力積と仕事(多体 —— 粒子ごとに q が違う)───────── */
/** 粒子 i の ψ_i = Σ_j m_j / r_ij(外部だけ)・対称の型 G_ij・状態の w は (β) で U・ほかは v */
export function accelSys(m, P, W, { kind, nG, pair = 'symmetric' }) {
  const n = m.length, psi = new Array(n).fill(0), out = [];
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (i !== j) psi[i] += m[j] / Math.hypot(P[j][0] - P[i][0], P[j][1] - P[i][1], P[j][2] - P[i][2]);
  const qs = W.map((w, i) => { const sp = Math.hypot(w[0], w[1], w[2]); return kind === '0' ? 1 : kind === 'beta' ? qOfU(psi[i], sp) : qOfV(psi[i], sp); });
  const fi = (i) => (kind === 'alpha' || kind === 'beta' ? qs[i] : kind === 'gamma' ? qs[i] * qs[i] : 1);
  const fij = (i, j) => (kind === 'alphaGeo' ? Math.sqrt(qs[i] * qs[j]) : kind === 'alphaAri' ? 0.5 * (qs[i] + qs[j]) : 1);   // 対に共通の因子(対照)
  for (let i = 0; i < n; i++) {
    const a = [0, 0, 0];
    for (let j = 0; j < n; j++) if (i !== j) {
      const d = [P[j][0] - P[i][0], P[j][1] - P[i][1], P[j][2] - P[i][2]], r = Math.hypot(d[0], d[1], d[2]), k = gLocFactor(nG, pair, psi[i], psi[j]) * m[j] / (r * r * r) * fij(i, j);
      a[0] += k * d[0]; a[1] += k * d[1]; a[2] += k * d[2];
    }
    const q = qs[i], f = fi(i);
    out.push({ dp: kind === 'beta' ? W[i].map((c) => q * c) : W[i].slice(), dw: a.map((c) => c * f), q, psi: psi[i] });
  }
  return out;
}
/** 走らせて (a) 運動量の残り(Σ m v —— v は絶対時間の速度)(b) 仕事の残り(ニュートンの E —— n_G = 0 だけ保存の物差し)(c) 重心の漂い (d) q の差の大きさの最大 */
export function runSys(sysKind, { kind, nG, pair = 'symmetric' }, { steps = DECL.nbody.steps } = {}) {
  const S0 = systemOf(sysKind), n = S0.m.length, m = S0.m;
  const vOf = (P, W) => { const A = accelSys(m, P, W, { kind, nG, pair }); return A.map((a) => a.dp); };
  const W0 = kind === 'beta' ? S0.v.map((v, i) => { const psi = S0.m.reduce((acc, mj, j) => (j === i ? acc : acc + mj / Math.hypot(S0.p[j][0] - S0.p[i][0], S0.p[j][1] - S0.p[i][1], S0.p[j][2] - S0.p[i][2])), 0);
    const q = qOfV(psi, Math.hypot(v[0], v[1], v[2])); return v.map((c) => c / q); }) : S0.v.map((v) => v.slice());
  const Tend = DECL.nbody.orbits * 2 * Math.PI * Math.sqrt(S0.a ** 3 / S0.M), h = Tend / steps;
  const flat = (P, W) => P.flat().concat(W.flat()), unflat = (s) => { const P = [], W = []; for (let i = 0; i < n; i++) { P.push(s.slice(3 * i, 3 * i + 3)); W.push(s.slice(3 * n + 3 * i, 3 * n + 3 * i + 3)); } return [P, W]; };
  const f = (s) => { const [P, W] = unflat(s), A = accelSys(m, P, W, { kind, nG, pair }); return A.map((a) => a.dp).flat().concat(A.map((a) => a.dw).flat()); };
  let s = flat(S0.p, W0), dqMax = 0;
  for (let k = 0; k < steps; k++) {
    if (k % 100 === 0) { const [P, W] = unflat(s), A = accelSys(m, P, W, { kind, nG, pair }); const qs = A.map((a) => a.q); dqMax = Math.max(dqMax, Math.max(...qs) - Math.min(...qs)); }
    s = rk4Step(f, s, h);
  }
  const [P, W] = unflat(s), V = vOf(P, W), V0 = vOf(S0.p, W0);
  const mom = (VV) => [0, 1, 2].map((c) => VV.reduce((acc, q, i) => acc + m[i] * q[c], 0));
  const scaleP = V0.reduce((acc, q, i) => acc + m[i] * Math.hypot(q[0], q[1], q[2]), 0), p0 = mom(V0), p1 = mom(V);
  const dP = Math.hypot(p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]) / scaleP;
  const E = (PP, VV) => { let k = 0, u = 0; for (let i = 0; i < n; i++) { k += 0.5 * m[i] * (VV[i][0] ** 2 + VV[i][1] ** 2 + VV[i][2] ** 2); for (let j = i + 1; j < n; j++) u -= m[i] * m[j] / Math.hypot(PP[j][0] - PP[i][0], PP[j][1] - PP[i][1], PP[j][2] - PP[i][2]); } return k + u; };
  const E0 = E(S0.p, V0), dE = Math.abs(E(P, V) - E0) / Math.abs(E0);
  const M = S0.M, cm = (PP) => [0, 1, 2].map((c) => PP.reduce((acc, q, i) => acc + m[i] * q[c], 0) / M), c0 = cm(S0.p), c1 = cm(P), vcm = p0.map((x) => x / M);
  const drift = Math.hypot(c1[0] - c0[0] - vcm[0] * Tend, c1[1] - c0[1] - vcm[1] * Tend, c1[2] - c0[2] - vcm[2] * Tend) / S0.a;
  return { dP, dE, drift, dqMax, T: Tend };
}
export function t4Rows() {
  const rows = [];
  for (const sysKind of ['two', 'three']) for (const nG of [0, 1]) for (const kind of DECL.kinds.concat(DECL.common)) {
    const r = runSys(sysKind, { kind, nG, pair: 'symmetric' });
    rows.push({ sys: sysKind, pair: 'symmetric', nG, kind, dP: r.dP, dE: r.dE, drift: r.drift, dqMax: r.dqMax });
  }
  // 対の力積の残りの見込み: 2 体の (α) では dP/dt = F_12 (q_1 − q_2)(作用と反作用に別の q)—— 1 步の右辺で直接
  const S = systemOf('two'), A = accelSys(S.m, S.p, S.v, { kind: 'alpha', nG: 0 }), Fi = A.map((a, i) => a.dw.map((c) => c * S.m[i]));
  const A0 = accelSys(S.m, S.p, S.v, { kind: '0', nG: 0 }), F12 = A0[0].dw.map((c) => c * S.m[0]);
  const resid = [0, 1, 2].map((c) => Fi[0][c] + Fi[1][c]), pred = F12.map((c) => c * (A[0].q - A[1].q));
  const pairImpulse = { q1: A[0].q, q2: A[1].q, residX: resid[0], predX: pred[0], diff: Math.hypot(resid[0] - pred[0], resid[1] - pred[1], resid[2] - pred[2]) / Math.hypot(...F12) };
  // 共通の因子の列の近点(試験粒子の極限 —— 中心の q = 1。見込み −(2 n_G k + 1)/6 —— 一次の項が半分)
  const pn = mercury1PN(), [s1, s2] = DECL.orbit.steps, commonApsis = [];
  for (const e of DECL.orbit.es) for (const nG of DECL.nG) for (const kind of DECL.common) {
    const fine = apsidalConv({ kind, nG, e, steps: s2 }).overPN, coarse = apsidalConv({ kind, nG, e, steps: s1 }).overPN, cl = closedOf(kind, nG, 'receiver');
    commonApsis.push({ e, nG, kind, overPN: fine, halfDiff: Math.abs(fine - coarse), closed: cl, dClosed: fine - cl, arcsecCy: fine * pn.arcsecCy });
  }
  return { rows, pairImpulse, commonApsis };
}

/* ───────── 純関数の場面 ───────── */
export function pureScenes() {
  const near = (a, b, t = 1e-15) => Math.abs(a - b) <= t;
  // ① 静止(v = 0・U = 0)で qOfV = qOfU = N・ψ = 0 で 1
  const q0 = near(qOfV(0.3, 0), Math.exp(-0.3), 4e-15) && near(qOfU(0.3, 0), Math.exp(-0.3), 4e-15) && near(qOfV(0, 0), 1, 4e-15) && near(qOfU(0, 0), 1, 4e-15);   // 丸めの数 ulp を許す(照合の lib の ±1〜2 ulp の走り直しで門が反転しない)
  // ② qOfU と qOfV が同じ状態を表す(v = q U)—— 速さ 3 つ × ψ 2 つの相対の差の最大
  let qMax = 0; for (const psi of [0.01, 0.2]) for (const x of [0.1, 0.5, 0.9]) { const v = x * cLocAbs(psi), q = qOfV(psi, v), U = v / q; qMax = Math.max(qMax, Math.abs(qOfU(psi, U) / q - 1)); }
  // ③ 右辺: 静止の点で (α) と (β) の加速は N a_G と N² a_G・(γ) は N² a_G((β) と同じ —— 第 2 項は速さ 0 で 0)
  const fa = derivTest('alpha', { mu: 1e-3, nG: 1, pair: 'receiver' })([0.01, 0, 0, 0]), fb = derivTest('beta', { mu: 1e-3, nG: 1, pair: 'receiver' })([0.01, 0, 0, 0]),
    fg = derivTest('gamma', { mu: 1e-3, nG: 1, pair: 'receiver' })([0.01, 0, 0, 0]), f0 = derivTest('0', { mu: 1e-3, nG: 1, pair: 'receiver' })([0.01, 0, 0, 0]), N = Math.exp(-0.1);
  const rhs = Math.max(Math.abs(fa[2] / f0[2] - N), Math.abs(fb[2] / f0[2] - N), Math.abs(fg[2] / f0[2] - N * N));
  // ④ 見込みの式の値
  const cl = closedOf('0', 2, 'receiver') === -4 / 6 && closedOf('alpha', 1, 'receiver') === -4 / 6 && closedOf('beta', 1, 'receiver') === -2 / 6 && closedOf('gamma', 1, 'receiver') === -6 / 6 && closedOf('beta', 2, 'symmetric') === -2 / 6;
  // ⑤ X_k の閉じた形: 絶対時間の単位で指数 2 が 1・静止の当事者の単位で (α)・(β) の指数 1 が 1(背景 0・静止)
  const xk = near(xkClosed({ unit: 'abs', kind: '0', nG: 2, psiG: 0.3 }), 1, 1e-13) && near(xkClosed({ unit: 'static', kind: 'alpha', nG: 1, psiG: 0.3 }), 1, 1e-13) && near(xkClosed({ unit: 'static', kind: 'beta', nG: 1, psiG: 0.3 }), 1, 1e-13);
  // ⑥ 拒否: 型が無い・v が負・U が非有限・見込みの型が無い
  let rej = 0; try { derivTest('delta', { mu: 1, nG: 1, pair: 'receiver' }); } catch (e) { rej++; } try { qOfV(0, -1); } catch (e) { rej++; } try { qOfU(0, Infinity); } catch (e) { rej++; } try { closedOf('x', 1, 'receiver'); } catch (e) { rej++; }
  return { q0, qUVmax: qMax, rhsMax: rhs, closed: cl, xk, reject: { n: rej, of: 4 } };
}
export function pureGates(S) { return { q0: S.q0 === true, qUV: S.qUVmax < 1e-14, rhs: S.rhsMax < 1e-12, closed: S.closed === true, xk: S.xk === true, reject: S.reject.n === S.reject.of }; }
