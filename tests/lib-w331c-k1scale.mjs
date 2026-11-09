// 第331便c(原仮定者の整理(2026-11-09)「水星の近点移動は G_loc を採用」・原仮定者の追記(2026-11-09)「K1 の R_d を使った計算は『太陽–木星』のスケールで有効なのではないか
//   (1PN が『太陽–水星』で有効なのと同様)。『土星の環の厚み』との関連も調べる」・統括の検証項目 R312): **K1 の R_d のスケールの読み・土星の環の厚みとの関連の候補・
//   水星の G_loc の基準表の純関数**(html を読まない —— 解析の一次の式・宣言の表・純粋な積分器)。器 tests/exp-w331c-k1scale.mjs が html の写しの走行と並べる。
//
// ■ 区別(各表・各式に付ける —— 作業仮説と今のコードを混ぜない)
//   実装 = 今の beta の html にある式(G_loc の力の型 gLocKick3・gLocPeriAdvance・K1 の並進 β = C₁ R_d M/(m r))/
//   診断 = この lib と器の表(写しの走行・一次の解析・純粋な積分器)/宣言(未接続)= 今のエンジンに無い型(ポテンシャルの微分の型の G_loc・m/r² の座標則・回る枠の座標回転)。
// ■ 言わないこと: 表は「宣言した型で表の値になった」「残差」「候補の表」と書く。K1 のスケールの読みは複数を並べる(どれかを採らない)。土星の環は関連の候補の列
//   (偶然の一致の可能性を同じ表に)。G_loc の符号・n・R_d の規則は在位で変えない(本便は表だけ —— 採るかは次の報の決断)。
import { harmonicSelf, kappaMRadius } from './lib-w330b-dragweight.mjs';

export const LIB_VERSION = 'w331c-k1scale-lib-1';
const isFin = Number.isFinite;
/** C₁ = 6[(√3/2)ln(2+√3) − 1](閉じた式 —— html の C_1 と同じ演算の順) */
export const C1 = 6 * ((Math.sqrt(3) / 2) * Math.log(2 + Math.sqrt(3)) - 1);
/** 器の宣言(走行の前に置く —— 結果を見て変えない) */
export const DECL = Object.freeze({
  /** G_loc の n の格子(ブリーフ R312 の 6 点)と対称の型で 1PN を担う点 −6 */
  nGrid: Object.freeze([2, 1, 0, -1, -2, -3]),
  nSymExtra: Object.freeze([-6]),
  pairs: Object.freeze(['receiver', 'symmetric']),
  /** K1 の引きずりの分 ÷ q_1PN(R_d = Y_k m・Y_k = 10G/(C₁c²) の規則の一次 —— 〔第314便b〕②) */
  k1Share: 5 / 3,
  /** 純粋な積分器の宣言(固定中心・試験粒子・μ = a = 1・RK4・遠点から出発・近点は動径の速度の符号の変わり目を二分法で) */
  integ: Object.freeze({ stepsPerOrbit: 4000, nOrb: 6, eps: 1e-6, bisect: 48 }),
  /** 環の厚みの典型(文献の値 —— LIT.thickness)と感度の幅 */
  ringH: Object.freeze({ typical: 10, range: Object.freeze([10, 100]) }),
  /** 土星の環の点(本の宣言の帯の端 —— 💍 saturnRingReal の C・B・A 帯の rIn・rOut〔本の単位 10⁶ m〕を器が読む) */
  ringPoints: Object.freeze(['C 内縁', 'C/B 境', 'B 外縁', 'A 内縁', 'A 外縁']),
});
/** 文献の値(出典つき —— 本便は一次資料に当たっていない。総説・論文の値を書き写した) */
export const LIT = Object.freeze({
  saturnJ2: Object.freeze({ value: 16290.71e-6, Rref: 60330e3, src: 'Jacobson, R. A. et al. 2006, AJ 132, 2520(J₂ × 10⁶ = 16290.71・基準半径 60 330 km)' }),
  ringMass: Object.freeze({ value: 1.54e19, src: 'Iess, L. et al. 2019, Science 364, eaat2965(環の質量 1.54 × 10¹⁹ kg)' }),
  thickness: Object.freeze({ value: 10, src: 'Cuzzi, J. N. et al. 2010, Science 327, 1470・Esposito, L. W. 2002, Rep. Prog. Phys. 65, 1741(主な環の局所の鉛直の厚みは約 10 m の桁)' }),
  bendingA: Object.freeze({ text: '数 m〜数十 m の桁', src: 'Shu, F. H., Cuzzi, J. N. & Lissauer, J. J. 1983, Icarus 53, 185(A 環の曲がり波の減衰からの局所の厚みの見積り)' }),
  bEdge: Object.freeze({ value: 2.5e3, src: 'Spitale, J. N. & Porco, C. C. 2010, AJ 140, 1747(B 環の外縁の鉛直の構造 —— 春分の影から km の桁〔約 2.5 km〕)' }),
  particle: Object.freeze({ text: 'cm〜m の桁(〜10 m)', src: 'Zebker, H. A., Marouf, E. A. & Tyler, G. L. 1985, Icarus 64, 531(電波の掩蔵からの粒子の大きさの分布)' }),
  freqJ2: Object.freeze({ src: 'Murray, C. D. & Dermott, S. F. 1999, Solar System Dynamics(Cambridge)—— J₂ の一次の Ω²・`κ_epi`²・ν_z² の式' }),
  note: '文献の値 —— 本便は一次資料に当たっていない(この箱から論文のサイトに届かない)。環ごとの局所の厚みは総説の典型の値を各環に置き、幅は感度の列',
});

/* ───────── G_loc(実装 —— 今の html の力の型)と K1 の一次の分担 ───────── */
/** 有限質量比 η = Mm/(M+m)² */
export const etaOf = (M, m) => M * m / ((M + m) * (M + m));
/**
 * G_loc の分 ÷ q_1PN(実装 —— 力 −G_loc m_j r/r³ の型・弱場・一次・自由な二体の相対の軌道)。
 *   receiver: μ_eff = G(M² + m²)/(M + m) = G(M + m)(1 − 2η) → −(n/3)(1 − 2η)/symmetric: μ_eff = G(M + m)/2 → −n/6(η に依らない)。
 *   html の gLocPeriAdvance(n, μ_eff, c₀, a, e) = −2nπμ_eff/[c₀²a(1−e²)] を 1PN の 6πG(M+m)/[c₀²a(1−e²)] で割った値。
 */
export function gLocShare(n, pair = 'receiver', eta = 0) {
  if (!isFin(n) || !isFin(eta) || eta < 0 || eta > 0.25) throw new RangeError('gLocShare: n は有限・0 ≤ η ≤ 1/4');
  if (pair === 'receiver') return -(n / 3) * (1 - 2 * eta);
  if (pair === 'symmetric') return -n / 6;
  throw new RangeError('gLocShare: pair は receiver か symmetric');
}
/** ポテンシャルの微分の型(宣言 —— 未接続): U = −G_loc(r) M/r の勾配(G′ の項が付く)。試験粒子の一次で −2n/3(力の型の 2 倍) */
export function gLocSharePotential(n, pair = 'receiver') {
  if (!isFin(n)) throw new RangeError('gLocSharePotential: n は有限');
  if (pair === 'receiver') return -(2 * n) / 3;
  if (pair === 'symmetric') return -n / 3;
  throw new RangeError('gLocSharePotential: pair は receiver か symmetric');
}
/** K1 の引きずりの分 ÷ q_1PN(実装 —— β の相対の軌道は C₁Y(M+m)/r。Y = kf × Y_k なら 5kf/3。η に依らない) */
export const k1Share = (kf = 1) => { if (!isFin(kf) || kf < 0) throw new RangeError('k1Share: kf ≥ 0'); return DECL.k1Share * kf; };
/** 全近点移動 ÷ q_1PN(一次の和 —— 交差の項は二次) */
export const totalShare = ({ n, pair = 'receiver', eta = 0, k1 = true, kf = 1, type = 'force' }) => (type === 'potential' ? gLocSharePotential(n, pair) : gLocShare(n, pair, eta)) + (k1 ? k1Share(kf) : 0);
/** 全近点移動を 1PN にする n(一次)—— receiver: −(n/3)(1 − 2η) + k = 1 → n = −3(1 − k)/(1 − 2η)・symmetric: n = −6(1 − k) */
export function nForPN({ pair = 'receiver', eta = 0, k1 = true, kf = 1, type = 'force' }) {
  const k = k1 ? k1Share(kf) : 0;
  if (type === 'potential') return pair === 'receiver' ? -1.5 * (1 - k) : -3 * (1 - k);
  return pair === 'receiver' ? -3 * (1 - k) / (1 - 2 * eta) : -6 * (1 - k);
}
/** 1PN からの一次の残差 ÷ q_1PN(有限質量比の分 —— receiver の G_loc だけが η を持つ) */
export const fmShare = ({ n, pair = 'receiver', eta = 0 }) => (pair === 'receiver' ? (2 * n / 3) * eta : 0);

/** G_loc の基準表の解析の一次(惑星ごと・n の格子 × 型 × K1 の有無)。sys = [{key, q1pn, eta}] */
export function gLocTable(sys, nGrid = DECL.nGrid) {
  const rows = [];
  for (const s of sys) for (const pair of DECL.pairs) for (const n of nGrid.concat(pair === 'symmetric' ? DECL.nSymExtra : [])) for (const k1 of [false, true]) {
    const g = gLocShare(n, pair, s.eta), k = k1 ? k1Share() : 0;
    rows.push({ key: s.key, pair, n, k1, gShare: g, kShare: k, total: g + k, gArc: g * s.q1pn, kArc: k * s.q1pn, totalArc: (g + k) * s.q1pn, resid: (g + k - 1) * s.q1pn, fmArc: fmShare({ n, pair, eta: s.eta }) * s.q1pn,
      gTest: pair === 'receiver' ? -n / 3 : -n / 6 });
  }
  return rows;
}
/** 「水星の近点は G_loc を採用」を今のコードの宣言で満たす候補(一次 —— 採るかは決断。今は A) */
export const CANDIDATES = Object.freeze([
  Object.freeze({ id: 'A', label: '今(在位)', pair: 'receiver', n: 2, k1: true, type: 'force', status: '実装(在位)', note: 'G_loc は逆行の −2/3・K1 の引きずりが +5/3 —— 和が 1PN(G_loc だけではない)' }),
  Object.freeze({ id: 'B', label: 'n = −3・K1 の分を外す', pair: 'receiver', n: -3, k1: false, type: 'force', status: '実装の宣言で書ける(cLocPow・n = −3 —— G_i = G e^{+6ψ})', note: 'G_loc だけで 1PN(一次)・有限質量比の残差 −2η' }),
  Object.freeze({ id: 'C', label: 'symmetric n = −6・K1 の分を外す', pair: 'symmetric', n: -6, k1: false, type: 'force', status: '実装の宣言で書ける(cLocPow・n = −6・pair "symmetric")', note: 'G_loc だけで 1PN(一次)・η に依らない・作用反作用を保つ' }),
  Object.freeze({ id: 'D', label: 'n = −3・K1 を残す', pair: 'receiver', n: -3, k1: true, type: 'force', status: '実装の宣言で書ける', note: '1PN の 8/3 倍(K1 の分 +5/3 が重なる —— 対照)' }),
  Object.freeze({ id: 'E', label: 'ポテンシャルの微分の型 n = −3/2・K1 の分を外す', pair: 'receiver', n: -1.5, k1: false, type: 'potential', status: '宣言(未接続 —— 今の html に無い型)', note: 'G′ の項で力の型の 2 倍の係数(試験粒子の一次)' }),
]);
/** 候補の表(一次 —— 惑星ごとの残差 ÷ q_1PN と ″/世紀) */
export function candidateTable(sys) {
  const rows = [];
  for (const c of CANDIDATES) for (const s of sys) {
    const tot = c.type === 'potential' ? gLocSharePotential(c.n, c.pair) + (c.k1 ? k1Share() : 0) : totalShare({ n: c.n, pair: c.pair, eta: s.eta, k1: c.k1 });
    rows.push({ id: c.id, key: s.key, total: tot, resid: (tot - 1) * s.q1pn, residShare: tot - 1 });
  }
  return rows;
}

/* ───────── K1 のスケールの読み(追記 2)───────── */
/** K1 の並進の一次の係数 b₁ = C₁ Y_k (M + m)(相対の軌道 —— 両方が受け手。Y_k = 10G/(C₁c²) なので b₁ = 10G(M+m)/c²)[m] */
export const k1B = (M, m, G = 6.674e-11, c = 299792458) => 10 * G * (M + m) / (c * c);
/** 1 公転あたりの近点の移動(一次 —— 純粋な積分器で照合する式)。K1 の並進 β = b/r: πb/p・m/r² の並進 β = b₂/r²: 2πb₂/p² */
export const advK1 = (b, p) => Math.PI * b / p;
export const advR2 = (b2, p) => 2 * Math.PI * b2 / (p * p);
/** 渦の型(回る枠の座標回転 d = Γ φ̂/r —— 重み M/r² × 接線の速度 Ω r)の円軌道の一次: −πΓ/√(μr)(Γ > 0 = 公転と同じ向き → 逆行)。離心率の補正 f(e) は積分器で */
export const advVortexCirc = (Gam, mu, r) => -Math.PI * Gam / Math.sqrt(mu * r);
/** 自己の重み(p = 2・ballHarmonic —— 第330便b の lib の調和平均 H₂)の W = m/(R² H₂) */
export const selfW2 = (m, R) => m / (R * R * harmonicSelf(2));
/** 1PN の無次元の強さ ε = GM/(c²a) と K1 の β = C₁Y_k M/a = 10GM/(c²a)(同じ 1/a —— 比は 10) */
export const eps1PN = (M, a, G = 6.674e-11, c = 299792458) => G * M / (c * c * a);
export const betaK1 = (M, a, G = 6.674e-11, c = 299792458) => 10 * G * M / (c * c * a);

/* ───────── 純粋な積分器(固定中心・試験粒子 —— 一次の式の照合)───────── */
/**
 * 1 公転あたりの近点の移動(rad)—— 同じ刻みの無摂動の走行を引く。mode:
 *   'k1'(u = (1 − ε/r)v)・'r2'(u = (1 − ε/r²)v)・'vortex'(u = v + ε φ̂/r)・'gForce'(a = −μ e^{−2n ε/r} r̂/r² —— 実装の型)・
 *   'gPot'(a = −∇U・U = −μ e^{−2n ε/r}/r —— ポテンシャルの微分の型)。μ = a = 1・遠点から出発(位置 (−(1+e), 0)・速度は −y 向き —— 公転は +z 向き)。
 */
export function apsidalNumeric({ e, mode, eps = DECL.integ.eps, n = 1, p = 2, om = 0, k = 1, nOrb = DECL.integ.nOrb, stepsPerOrbit = DECL.integ.stepsPerOrbit, bisect = DECL.integ.bisect }) {
  if (!isFin(e) || e < 0 || e >= 0.9) throw new RangeError('apsidalNumeric: 0 ≤ e < 0.9');
  const run = (ep) => {
    const f = (s) => {   // s = [x, y, vx, vy] → 微分
      const [x, y, vx, vy] = s, r = Math.hypot(x, y), r3 = r * r * r;
      let ux = vx, uy = vy, ax = -x / r3, ay = -y / r3;
      if (mode === 'k1') { const g = 1 - ep / r; ux = g * vx; uy = g * vy; }
      else if (mode === 'r2') { const g = 1 - ep / (r * r); ux = g * vx; uy = g * vy; }
      else if (mode === 'vortex') { ux = vx - ep * y / (r * r); uy = vy + ep * x / (r * r); }
      else if (mode === 'gForce') { const g = Math.exp(-2 * n * ep / r); ax *= g; ay *= g; }
      else if (mode === 'gPot') { const g = Math.exp(-2 * n * ep / r), q = g * (1 - 2 * n * ep / r); ax *= q; ay *= q; }   // −dU/dr = −(μ/r²) e^{−2nε/r}(1 − 2nε/r)
      else if (mode === 'k1tan') { const vphi = (x * vy - y * vx) / r, g = ep / r * vphi / r; ux = vx + g * y; uy = vy - g * x; }   // 補足 1: K1 の並進の接線の分だけ(−(ε/r) v_φ φ̂)
      else if (mode === 'k1rad') { const vr = (x * vx + y * vy) / r, g = ep / r * vr / r; ux = vx - g * x; uy = vy - g * y; }   // 補足 1: K1 の並進の動径の分だけ(−(ε/r) v_r r̂)
      else if (mode === 'field') { const w = ep / Math.pow(r, p); ux = vx + w * (-om * y - vx); uy = vy + w * (om * x - vy); }   // 補足 1: d = ε r^{−p}(Ω ẑ × r − v)
      else if (mode === 'azPow') { const w = ep / Math.pow(r, k + 1); ux = vx - w * y; uy = vy + w * x; }   // 補足 1: d = ε r^{−k} φ̂(接線の冪)
      else throw new RangeError('apsidalNumeric: mode');
      return [ux, uy, ax, ay];
    };
    const rk = (s, h) => { const k1 = f(s), s2 = s.map((v, i) => v + 0.5 * h * k1[i]), k2 = f(s2), s3 = s.map((v, i) => v + 0.5 * h * k2[i]), k3 = f(s3), s4 = s.map((v, i) => v + h * k3[i]), k4 = f(s4);
      return s.map((v, i) => v + h * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]) / 6); };
    const rad = (s) => { const d = f(s); return s[0] * d[0] + s[1] * d[1]; };   // r · u(動径の速度 × r)
    const ra = 1 + e, va = Math.sqrt((1 - e) / (1 + e));
    let s = [-ra, 0, 0, -va];
    const P = 2 * Math.PI, h = P / stepsPerOrbit, ang = [];
    let prev = rad(s);
    for (let k = 0; k < Math.ceil((nOrb + 0.6) * stepsPerOrbit) && ang.length < nOrb; k++) {
      const s1 = rk(s, h), cur = rad(s1);
      if (prev < 0 && cur >= 0) {   // 近点(− → +)—— 二分法で刻みの中の時刻を詰める
        let lo = 0, hi = h;
        for (let it = 0; it < bisect; it++) { const mid = 0.5 * (lo + hi); if (rad(rk(s, mid)) < 0) lo = mid; else hi = mid; }
        const sp = rk(s, 0.5 * (lo + hi)); ang.push(Math.atan2(sp[1], sp[0]));
      }
      s = s1; prev = cur;
    }
    const un = [ang[0]]; for (let i = 1; i < ang.length; i++) { let d = ang[i] - ang[i - 1]; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; un.push(un[i - 1] + d); }
    return un.length >= 2 ? (un[un.length - 1] - un[0]) / (un.length - 1) : NaN;
  };
  const adv = run(eps) - run(0);
  const sl = 1 - e * e;
  const expect = mode === 'k1' ? advK1(eps, sl) : mode === 'r2' ? advR2(eps, sl) : mode === 'gForce' ? -2 * n * Math.PI * eps / sl : mode === 'gPot' ? -4 * n * Math.PI * eps / sl
    : mode === 'field' ? fieldAdvCirc({ p, c: eps, om, nOrb: 1, r: 1 }).total : mode === 'azPow' ? azPowAdvCirc({ k, A: eps, nOrb: 1, r: 1 }) : (mode === 'k1tan' || mode === 'k1rad') ? advK1(eps, sl) : advVortexCirc(eps, 1, 1);
  return { mode, e, eps, n, p, om, k, adv, expect, ratio: adv / expect };
}

/* ───────── 補足 1(原仮定者の補足(2026-11-09)「太陽–水星における G_loc と回転引きずりの組み合わせを調査する」)───────── */
/**
 * 一般の場 d = c r^{−p}(Ω ẑ × r − v)(重み c/r^p の相対の引きずり —— 源の枠が角速度 Ω で回る。p = 1 は K1 の遠方の重み・p = 2 は m/r² の座標則〔第331便a の座標則の型〕)の
 *   円軌道の一次の 1 公転あたりの近点: 並進の分 π p c r^{−p}(順行)+ 回転の分 −π(p − 1) c (Ω/n) r^{−p}(Ω > 0 = 公転と同じ向きで逆行・p = 1 では 0)。nOrb = 公転の平均運動 n。
 *   接線の冪の場 d = A r^{−k} φ̂ の円軌道の一次: −π k A r^{−k−1}/n(k > 0 で逆行・k = 0 で 0・k < 0〔剛体の回転〕で順行)。離心率の補正は純粋な積分器で。
 */
export function fieldAdvCirc({ p, c, om, nOrb, r }) {
  const trans = Math.PI * p * c * Math.pow(r, -p), rot = -Math.PI * (p - 1) * c * (om / nOrb) * Math.pow(r, -p);
  return { trans, rot, total: trans + rot };
}
export const azPowAdvCirc = ({ k, A, nOrb, r }) => -Math.PI * k * A * Math.pow(r, -k - 1) / nOrb;
/** 補足 1 の候補の型(宣言 —— 走行の前に置く)。kind: 'k1'(実装の基準)・'field'(重み c/r^p・枠の角速度 Ω)・'spinEngine'(今のエンジンの回転の引きずり —— 写しで測る) */
export const ROT_TYPES = Object.freeze([
  Object.freeze({ id: 'i', label: '(i) 今の K1 の並進の 1/r の項(基準)', kind: 'k1', p: 1, frame: 'none', status: '実装(在位)' }),
  Object.freeze({ id: 'i-tan', label: '(i) の接線の分だけ(−β v_φ φ̂)', kind: 'k1part', part: 'tan', p: 1, frame: 'none', status: '診断(分解)' }),
  Object.freeze({ id: 'i-rad', label: '(i) の動径の分だけ(−β v_r r̂)', kind: 'k1part', part: 'rad', p: 1, frame: 'none', status: '診断(分解)' }),
  Object.freeze({ id: 'i-spin', label: '(i) の重み 1/r で源の枠を太陽の自転で回す', kind: 'field', p: 1, frame: 'sunSpin', status: '宣言(未接続)' }),
  Object.freeze({ id: 'ii', label: '(ii) 太陽の自転の回転引きずり(Ω_☉ × r に m/r² —— 接線 1/r)', kind: 'field', p: 2, frame: 'sunSpin', rotOnly: true, status: '宣言(未接続)' }),
  Object.freeze({ id: 'ii-eng', label: '(ii) 今のエンジンの回転と軸の引きずり(spinDrag —— 在位は宣言しない)', kind: 'spinEngine', status: '実装(写しで測る)' }),
  Object.freeze({ id: 'iii', label: '(iii) 水星の公転の回る枠(Ω = n_☿ に m/r²)', kind: 'field', p: 2, frame: 'orbit', rotOnly: true, status: '宣言(未接続)' }),
  Object.freeze({ id: 'iv', label: '(iv) 太陽–木星の回る枠(Ω_J に m/r²)', kind: 'field', p: 2, frame: 'jupiter', rotOnly: true, status: '宣言(未接続)' }),
  Object.freeze({ id: 'v-t', label: '(v) 座標則の並進の分だけ(m/r²)', kind: 'field', p: 2, frame: 'none', status: '宣言(未接続)' }),
  Object.freeze({ id: 'v', label: '(v) 座標則(並進 + 太陽の自転を 1 つ・m/r²)', kind: 'field', p: 2, frame: 'sunSpin', status: '宣言(未接続)' }),
  Object.freeze({ id: 'v-orb', label: '(v) 座標則で枠を水星の公転で回す(m/r²)', kind: 'field', p: 2, frame: 'orbit', status: '宣言(未接続)' }),
]);

/** 自己の重み(ballHarmonic)の c(相対の軌道 —— 両方が受け手): p = 1 は H₁(M R_p/m + m R_s/M)・p = 2 は H₂(M R_p²/m + m R_s²/M)(R は自己の半径の宣言 —— R_d = Y_k m か観測半径) */
export const selfC = (p, M, m, Rp, Rs) => harmonicSelf(p) * (M * Math.pow(Rp, p) / m + m * Math.pow(Rs, p) / M);
/**
 * 補足 1 の候補の表(惑星ごと —— 一次の解析 × 純粋な積分器の離心率の補正)。sys = {M, m, G, c, aSI, e, PSI, Rplanet, Rsun, rdPlanet, rdSun, q1pn, eta}・OmSun・OmJ(rad/s)・engine(spinDrag の写しの結果 —— 無ければ null)。
 *   share = 1 公転あたりの近点 ÷ 1PN(6πG(M+m)/(c²p))。「G_loc(n = 2)と足して 1PN」は share = 5/3 で満たす(−(2/3)(1 − 2η) + share = 1 + (4/3)η)。
 *   要る倍率 λ: 両方の自己の半径を λR_d にしたとき share = 5/3(c は λ^p 倍)。向きが逆(share と 5/3 の符号が違う)なら λ は無い。
 */
export function rotCandidates(sys, { OmSun, OmJ, engine = null, cache = new Map() } = {}) {
  const s = sys, n = 2 * Math.PI / s.PSI, pl = s.aSI * (1 - s.e * s.e), Q = 6 * Math.PI * s.G * (s.M + s.m) / (s.c * s.c * pl);
  const ratioOf = (key, args) => { const kk = key + '|' + s.e.toFixed(12) + '|' + JSON.stringify(args); if (!cache.has(kk)) cache.set(kk, apsidalNumeric(Object.assign({ e: s.e }, args)).ratio); return cache.get(kk); };
  const out = [];
  for (const T of ROT_TYPES) {
    const row = { id: T.id, label: T.label, status: T.status, kind: T.kind, p: T.p || null, frame: T.frame || null };
    if (T.kind === 'k1') { row.share = DECL.k1Share; row.eFactor = ratioOf('k1', { mode: 'k1' }) * 1; row.shareRd = DECL.k1Share; row.shareObs = null; }
    else if (T.kind === 'k1part') { const r = ratioOf(T.part, { mode: T.part === 'tan' ? 'k1tan' : 'k1rad' }); row.eFactor = r; row.shareRd = DECL.k1Share * r; row.shareObs = null; }
    else if (T.kind === 'spinEngine') { row.engine = engine; row.shareRd = engine && engine.bitSame ? 0 : (engine ? engine.share : null); row.shareObs = null; }
    else {
      const Om = T.frame === 'sunSpin' ? OmSun : T.frame === 'orbit' ? n : T.frame === 'jupiter' ? OmJ : 0, om = Om / n;
      let circ1, ef;   // c = 1 の円軌道の一次(rad/公転)と離心率の補正
      if (T.rotOnly) { circ1 = -Math.PI * (T.p - 1) * Om * Math.pow(s.aSI, -T.p) / n; const epsA = 1e-6 / Math.max(1, Math.abs(om)); ef = ratioOf('az', { mode: 'azPow', k: T.p - 1, eps: epsA }); }
      else { circ1 = fieldAdvCirc({ p: T.p, c: 1, om: Om, nOrb: n, r: s.aSI }).total; const epsF = 1e-6 / Math.max(1, Math.abs(om)); ef = Math.abs(T.p - (T.p - 1) * om) < 1e-9 ? NaN : ratioOf('field', { mode: 'field', p: T.p, om, eps: epsF }); }
      const cRd = selfC(T.p, s.M, s.m, s.rdPlanet, s.rdSun), cObs = selfC(T.p, s.M, s.m, s.Rplanet, s.Rsun);
      row.om = om; row.eFactor = ef; row.cRd = cRd; row.cObs = cObs;
      row.shareRd = circ1 * ef * cRd / Q; row.shareObs = circ1 * ef * cObs / Q;
      row.perC = circ1 * ef / Q;   // c = 1 あたりの share(倍率の計算に使う)
    }
    // G_loc(n = 2)と足す
    if (Number.isFinite(row.shareRd)) { row.totalRd = gLocShare(2, 'receiver', s.eta) + row.shareRd; row.factorRd = row.shareRd / DECL.k1Share; }
    if (Number.isFinite(row.shareObs)) { row.totalObs = gLocShare(2, 'receiver', s.eta) + row.shareObs; row.factorObs = row.shareObs / DECL.k1Share; }
    // 要る倍率 λ(自己の半径を λR_d に —— field の型だけ)
    if (T.kind === 'field' && Number.isFinite(row.shareRd) && row.shareRd !== 0) {
      const ratio = DECL.k1Share / row.shareRd;
      row.sameSign = ratio > 0;
      row.lambda = ratio > 0 ? Math.pow(ratio, 1 / T.p) : null;
      row.Rreq = row.lambda ? row.lambda * s.rdPlanet : null;
      row.RreqOverRobs = row.Rreq ? row.Rreq / s.Rplanet : null;
    }
    out.push(row);
  }
  return { n, Q, rows: out };
}

/* ───────── 補足 2(原仮定者の補足(2026-11-09)「K1 の R_d は有効性が認められる場合は使用する。有効な例と有効で無い例をリスト化する」)───────── */
/** 記録の値(正本の JSON の外 —— 節の表の文字列。QA が節に在ることを照合する) */
export const VALID_RECORDS = Object.freeze({
  venusAxial: Object.freeze({ value: '7.235e+19', section: '〔第326便d〕', table: '表 8', canon: 'tests/out/axialheat-w326d.json', text: 'Γ に依らない —— 太陽の K1 の項に要る倍率の下限' }),
});
/** 銀河の円盤の一次の目安(宣言の値 —— M = 1e11 太陽質量・R = 10 kpc・回転の速さ 2e5 m/s) */
export const GALAXY_PROBE = Object.freeze({ Msun: 1.9885e30, M: 1e11, Rkpc: 10, kpc: 3.0856775814913673e19, v: 2e5 });
/**
 * K1 の R_d の有効な例・有効でない例・まだ判定していない例(物差しを宣言 —— 主張しない)。C = 読んだ正本(inposk1・k1confirm・k1outer・k1em・satk1・binbooks・rdexcess)と
 *   本枝の表(rotMercury = 水星の補足 1 の行・ringZ = 土星の環の表)。各行: cls(valid・invalid・open)・case・yardstick・value・source・note。
 */
export function validityRows(C) {
  const rows = [], fe3 = (x) => (Number.isFinite(x) ? Number(x).toExponential(3) : '—');
  const push = (cls, kase, yardstick, value, source, note = '') => rows.push({ cls, case: kase, yardstick, value, source, note });
  // 有効
  const G = C.inposk1 && C.inposk1.G;
  if (G) { const v = Object.values(G.systems), mx = Math.max(...v.map((z) => Math.abs(z.rOverQ))); push('valid', '在位の惑星 7 本の近点(太陽–惑星の二体・K1 + G_loc n = 2)', 'AN410 の一様の門 abs(r_1PN) ≤ min(ε_fit, 1e-2 q_1PN)・刻みの帯(数値の門 —— 観測の 3σ ではない)',
    v.filter((z) => z.pass).length + '/' + v.length + ' が門の内・abs(r/q_1PN) の最大 ' + fe3(mx) + '(木星 —— (4/3)η の分)', 'tests/out/inposk1-w315c.json・〔第315便c〕'); }
  const K = C.k1confirm && C.k1confirm.K;
  if (K) { const v = Object.entries(K.systems); push('valid', 'K1 の確認の系(🌡️🌋🌦️🔴🏀 —— 刻み h/4・全天体 R_d = Y_k m の写し)', 'ε_fit の内(withinFit)', v.filter(([, z]) => z.withinFit).length + '/' + v.length + '・abs(r/q_1PN) の最大 ' + fe3(Math.max(...v.map(([, z]) => Math.abs(z.rOverQ)))), 'tests/out/k1confirm-w313d.json・〔第313便d〕'); }
  const O = C.k1outer && C.k1outer.G;
  if (O) { const v = Object.values(O.systems); push('valid', '外惑星 3 本(🟡🔷💙 —— 窓 8 公転・h/4)', 'AN410 の一様の門', v.filter((z) => z.pass).length + '/' + v.length + ' が門の内', 'tests/out/k1outer-w314c.json・〔第314便c〕'); }
  const E = C.k1em && C.k1em.K;
  if (E) push('valid', '🌦️ 太陽–地球–月の地球(EMB)の近点(h/4)', 'ε_fit の内(withinFit)', (E.withinFit ? '内' : '外') + '・r/q_1PN ' + fe3(E.rOverQ), 'tests/out/k1em-w314c.json・〔第314便c〕');
  const S = C.satk1 && C.satk1.K, satRow = (k) => { const w = S.systems[k].byWin, wk = Object.keys(w).sort((a, b) => a - b).pop(), d = w[wk].byDiv, dk = Object.keys(d).sort((a, b) => a - b).pop(); return d[dk]; };
  if (S) {
    const pro = ['io', 'europa', 'ganymede', 'callisto', 'titan'].map((k) => [k, satRow(k + '|two')]), mx = Math.max(...pro.map(([, z]) => Math.abs(z.rOverQ)));
    push('valid', '衛星 5 本の母惑星との二体(イオ・エウロパ・ガニメデ・カリスト・タイタン —— 32 公転・h/4)', 'abs(r_1PN/q_1PN) ≤ 1e-3(本枝の宣言の物差し —— 衛星の器の帯の判定とは別)', '5/5・最大 ' + fe3(mx), 'tests/out/satk1-w315d.json・〔第315便d〕');
    push('open', 'トリトンの海王星との二体(逆行の軌道)', 'abs(r_1PN/q_1PN) ≤ 1e-3', fe3(satRow('triton|two').rOverQ) + '(物差しの外 —— 逆行の軌道の扱いは未判定)', 'tests/out/satk1-w315d.json・〔第315便d〕');
    const th = ['io', 'europa', 'ganymede', 'callisto', 'titan', 'triton'].map((k) => Math.abs(satRow(k + '|three').rOverQ));
    push('open', '衛星 6 本の太陽 + 母惑星 + 衛星の三体', '同じ物差し(三体は太陽の効きが入る)', 'abs(r/q_1PN) ' + fe3(Math.min(...th)) + '〜' + fe3(Math.max(...th)) + '(帯の内で決まらない —— 〔第316便d〕〔第317便a〜c〕)', 'tests/out/satk1-w315d.json・〔第316便d〕');
  }
  const B = C.binbooks && C.binbooks.T;
  if (B) { const r = B.rows, f = r.map((z) => z.byQty.rate.ratio[z.byQty.rate.ratio.length - 1]);
    push('valid', '連星 4 本の K1 の分(♊⚖️🌠🔶 —— geoPN=3)', 'K1 の分 ÷ q_1PN が η に依らない(5/3 —— 両方が受け手)', '組の全体 ÷ q_1PN = ' + f.map((x) => x.toFixed(4)).join('・') + '(1 + (4/3)η の ' + r.map((z, i) => (f[i] / z.f).toFixed(5)).join('・') + ' 倍)',
      'tests/out/binbooks-w322b.json・〔第322便b〕', '1PN の二体の式(η に依らない)からの外れ (4/3)η は G_loc の受け手の型の分(K1 の分ではない)—— 等質量で +33%'); }
  // 有効でない
  push('invalid', '金星の自転(軸引きずり —— 族 E・K1 固定・R_src = R_d)', '観測の自転の定常に要る太陽の K1 の項の倍率', VALID_RECORDS.venusAxial.value + ' 倍(下限)', VALID_RECORDS.venusAxial.canon + '・' + VALID_RECORDS.venusAxial.section + ' ' + VALID_RECORDS.venusAxial.table);
  const A = C.rdexcess && C.rdexcess.A && C.rdexcess.A.rows[0];
  if (A) { const m = /比 R_d\/R = ([0-9.]+)/.exec(A.warn || ''); push('invalid', '中性子星(1.4 太陽質量・半径 12 km —— R_d = Y_k m が半径を超える)', 'K1 の閉じた式の定義域 r > R_d(表面は定義域の外)', 'R_d/R = ' + (m ? m[1] : '—') + '(受理は警告つき —— 重なりの扱いは別の問い)', 'tests/out/rdexcess-w314a.json・〔第314便a〕'); }
  const g = GALAXY_PROBE, Rg = g.Rkpc * g.kpc, beta = 10 * 6.674e-11 * g.M * g.Msun / (299792458 ** 2 * Rg);
  push('invalid', '銀河の円盤の回転(K1 の規則の β = 10GM/(c²R) —— M = 1e11 太陽質量・R = 10 kpc の一次の目安)', '平坦な回転の速さへの寄与(β × 回転の速さ ÷ 回転の速さ)', 'β = ' + fe3(beta) + '(引きずりの速さは回転の ' + fe3(beta) + ' 倍 —— 表に出ない)', '本枝の一次の目安・〔第330便b〕(連鎖の試しは m/r² の重みの宣言)');
  const rv = C.rotMercury && C.rotMercury.rows.find((z) => z.id === 'v-t');
  if (rv) push('invalid', 'R_d = Y_k m を m/r² の座標則の自己の半径に使う(太陽–水星の並進)', 'G_loc(n = 2)と足して 1PN になる分担 5/3', 'share ' + fe3(rv.shareRd) + '(要る倍率 λ ' + fe3(rv.lambda) + ' —— 水星の自己の半径 ' + fe3(rv.Rreq) + ' m)', '本枝 表 15・〔第331便c〕');
  // まだ判定していない
  const z = C.ringZ;
  if (z) push('open', '土星の環の厚み', 'R_d(土星)と厚みの典型の比・厚みに入る経路', 'R_d/H ' + Number(z.cand[0].RdOverH).toFixed(3) + '(H = 10 m)・鉛直の項は二次(J₂ の ' + fe3(z.cand[2].nodal2ndOverJ2) + ')', '本枝 表 13・表 14・〔第331便c〕', '関連の判定ではない —— 候補の表');
  push('open', '冥王星–カロン・地球–月の月の軌道・銀河の geoPN=4', 'K1 の R_d の規則で残差を測る器', '器が無い(未判定)', '—');
  return rows;
}

/* ───────── 土星の環(関連の候補 —— 主張しない)───────── */
/** J₂ の一次の振動数(実装の外 —— 文献の式 LIT.freqJ2): Ω²・`κ_epi`²・ν_z² = (GM/r³)[1 + (3/2, −3/2, 9/2) J₂ (R/r)²] */
export function ringFreq(GM, r, J2, R) {
  const n2 = GM / (r * r * r), q = J2 * (R / r) * (R / r);
  const Om = Math.sqrt(n2 * (1 + 1.5 * q)), kap = Math.sqrt(n2 * (1 - 1.5 * q)), nu = Math.sqrt(n2 * (1 + 4.5 * q));
  return { Om, kapEpi: kap, nuZ: nu, nodal: nu - Om, apsidal: Om - kap, q };
}
/**
 * K1 の引きずり(実装 —— 並進 β = b/r・b = C₁ R_d(土星))が環の粒子の釣り合いに足す一次の目安:
 *   面内の近点の率 (b/(2r))Ω(〔第312便a〕の πb/p を 1 公転で割る)/鉛直: β は z の偶関数で一次の項なし(ν と Ω に同じ √(1−β) —— ν − Ω の変化は二次 (β/2)(ν − Ω))/
 *   回転の項(宣言 —— 在位の 🟡 と 💍 は宣言しない)の接線の速度の目安 β (R_d/r)²/5 · Ω_s r(〔第314便b〕の冪 —— 源の第 1 モーメント R_d²/(5r²))
 */
export function ringDragTerms({ GM, r, J2, R, Rd, spin }) {
  const F = ringFreq(GM, r, J2, R), b = C1 * Rd, beta = b / r;
  return { b, beta, apsK1: (b / (2 * r)) * F.Om, apsK1OverJ2: ((b / (2 * r)) * F.Om) / F.apsidal, nodalK1: 0, nodal2nd: (beta / 2) * F.nodal, nodal2ndOverJ2: (beta / 2),
    rotVel: beta * (Rd / r) * (Rd / r) / 5 * spin * r, F };
}
/** 長さの尺度の候補の表(土星の質量 M・宣言の G・c)と厚み H との比 */
export function ringLengths({ M, G = 6.674e-11, c = 299792458, H = DECL.ringH.typical, ringMass = LIT.ringMass.value, particleM = [4.7e2, 4.7e5] }) {
  const Rd = kappaMRadius(M, G, c), rs = 2 * G * M / (c * c);
  const rows = [
    { key: 'R_d(土星)= Y_k M', value: Rd, kind: '実装(K1 の規則 —— 土星の中心の球の半径)' },
    { key: 'b = C₁ R_d(土星)', value: C1 * Rd, kind: '実装(K1 の並進 β = b/r の係数)' },
    { key: 'r_s(土星)= 2GM/c²', value: rs, kind: '表示(重力半径)' },
    { key: 'GM/c²(土星)', value: G * M / (c * c), kind: '表示' },
    { key: 'R_d(環の全質量)', value: kappaMRadius(ringMass, G, c), kind: '実装の規則を当てた値(在位の 💍 は引きずりを宣言しない)' },
    { key: 'R_d(粒子 1 m の氷 ≈ 4.7e2 kg)', value: kappaMRadius(particleM[0], G, c), kind: '同上' },
    { key: 'R_d(粒子 10 m の氷 ≈ 4.7e5 kg)', value: kappaMRadius(particleM[1], G, c), kind: '同上' },
  ];
  for (const z of rows) z.overH = z.value / H;
  return { rows, Rd, rs, H };
}
/** 関連の候補の表(主張しない —— 偶然の一致の可能性を同じ表に)。pts = [{label, r}]・Rd・GM・J2・R */
export function ringCandidates({ pts, Rd, GM, J2, R, H = DECL.ringH.typical, Hrange = DECL.ringH.range, spin }) {
  const mid = pts.find((p) => p.label === 'B 外縁') || pts[Math.floor(pts.length / 2)];
  const Om0 = ringFreq(GM, mid.r, J2, R).Om, c0 = H * Om0;   // 典型の厚みを B 外縁に置いたときの速度の分散(H = c/Ω の型 —— 環の力学の標準の目安)
  return pts.map((p) => {
    const F = ringFreq(GM, p.r, J2, R), T = ringDragTerms({ GM, r: p.r, J2, R, Rd, spin }), Hc = c0 / F.Om;
    return { label: p.label, r: p.r, Om: F.Om, kapEpi: F.kapEpi, nuZ: F.nuZ, nodal: F.nodal, apsidal: F.apsidal, apsK1: T.apsK1, apsK1OverJ2: T.apsK1OverJ2, nodal2ndOverJ2: T.nodal2ndOverJ2,
      beta: T.beta, rotVel: T.rotVel, cFromH: H * F.Om, Hc, RdOverH: Rd / H, RdOverHc: Rd / Hc, RdOverHrange: Hrange.map((h) => Rd / h), rOverRd: p.r / Rd };
  });
}

/* ───────── 純関数の場面と門 ───────── */
export function pureScenes() {
  const S = {};
  // 1 G_loc の分担の一次(n = 2・η = 0 で −2/3・K1 で +5/3・和 1)・n を 1PN にする点(receiver −3・symmetric −6・K1 ありなら 2・4)・ポテンシャルの型は 2 倍
  S.share = { g2: gLocShare(2), k: k1Share(), sum: totalShare({ n: 2 }), nRec: nForPN({ k1: false }), nSym: nForPN({ pair: 'symmetric', k1: false }), nRecK1: nForPN({ k1: true }), nSymK1: nForPN({ pair: 'symmetric', k1: true }),
    pot: gLocSharePotential(2) / gLocShare(2), nPot: nForPN({ k1: false, type: 'potential' }), fm2: fmShare({ n: 2, eta: 0.001 }), fmM3: fmShare({ n: -3, eta: 0.001 }), sym2: gLocShare(2, 'symmetric', 0.2) };
  // 2 入力の拒否
  const rej = [() => gLocShare(NaN), () => gLocShare(1, 'x'), () => gLocShare(1, 'receiver', 0.3), () => k1Share(-1), () => gLocSharePotential(1, 'y'), () => apsidalNumeric({ e: 0.95, mode: 'k1' }), () => apsidalNumeric({ e: 0.1, mode: 'zz' })];
  S.reject = rej.map((f) => { try { f(); return false; } catch (e) { return e instanceof RangeError; } });
  // 3 純粋な積分器(e = 0.2 —— 一次の式との比)
  S.integ = ['k1', 'r2', 'gForce', 'gPot'].map((mode) => apsidalNumeric({ e: 0.2, mode, n: 2 }));
  S.vortex = [0.01, 0.05, 0.2].map((e) => apsidalNumeric({ e, mode: 'vortex' }));
  // 4 J₂ の振動数(J₂ = 0 で Ω = `κ_epi` = ν_z・J₂ > 0 で ν_z > Ω > `κ_epi`)
  const f0 = ringFreq(1, 2, 0, 1), f1 = ringFreq(1, 2, 0.01, 1);
  S.freq = { equal0: f0.Om === f0.kapEpi && f0.Om === f0.nuZ, order1: f1.nuZ > f1.Om && f1.Om > f1.kapEpi, nodalLin: f1.nodal / f1.Om, expectLin: 1.5 * 0.01 / 4 };
  // 5 1PN と K1 の β の比(同じ 1/a —— 10)
  S.ratio = { beta: betaK1(2e30, 5.8e10) / eps1PN(2e30, 5.8e10), farNear: (betaK1(2e30, 4.5e12) / eps1PN(2e30, 4.5e12)) };
  return S;
}
export function pureGates(S) {
  const rel = (a, b) => Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b), 1e-300);
  const sh = S.share;
  return {
    share: rel(sh.g2, -2 / 3) < 1e-15 && rel(sh.k, 5 / 3) < 1e-15 && rel(sh.sum, 1) < 1e-15 && sh.nRec === -3 && sh.nSym === -6 && rel(sh.nRecK1, 2) < 1e-15 && rel(sh.nSymK1, 4) < 1e-15
      && sh.pot === 2 && sh.nPot === -1.5 && rel(sh.fm2, 0.004 / 3) < 1e-12 && rel(sh.fmM3, -0.002) < 1e-12 && rel(sh.sym2, -1 / 3) < 1e-15,
    reject: S.reject.length === 7 && S.reject.every(Boolean),
    integ: S.integ.every((z) => Math.abs(z.ratio - 1) < 1e-3),
    vortexCirc: Math.abs(S.vortex[0].ratio - 1) < 1e-3 && S.vortex.every((z) => z.adv < 0),
    freq: S.freq.equal0 && S.freq.order1 && rel(S.freq.nodalLin, S.freq.expectLin) < 2e-2,
    ratio: rel(S.ratio.beta, 10) < 1e-14 && rel(S.ratio.farNear, 10) < 1e-14,
  };
}
