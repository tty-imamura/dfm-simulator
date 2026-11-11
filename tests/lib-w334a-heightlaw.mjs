// 第334便a(原仮定者の整理(2026-11-11)「回転引きずりは、距離 r において、赤道面からの高さ z が十分に小さい場合は、z/r に比例する。回転引きずりは、角速度を維持するので、
//   速度が r に比例。組み合わせると、源の重力が十分に支配的な範囲では、回転引きずりの速度が z に比例する区間がある」「扁平な天体は、赤道面方向の回転引きずりが強いと想定する。
//   『赤道面方向の引きずり半径を扁平率で割る』などの検証を行う。次数も幾つか試す」・原仮定者の回答(2026-11-11 —— AN623・AN624・AN625・AN627)・統括の検証項目 R322):
//   **回転引きずりの高さ則(z に比例する区間)の読みの候補 T1〜T3・「源の重力が支配的な範囲」の 2 つの物差し(決定力 D の割合と統合した並進の重みの割合 β)・
//   環の厚みへ繋ぐ対照(鉛直の速度の場の型と H ~ σ_z/ν_z)・扁平な源(引きずり半径を扁平率/軸比で割る則 × 次数 q・体積を保つ回転楕円体の求積・J 固定と半径だけの列)の純関数**
//   (器 tests/exp-w334a-heightlaw.mjs と QA lint.heightLaw334a・behavior.heightLaw334a が読む —— html を読まない・状態を持たない・第333便a・第332便a・第333便b・第331便c の lib は呼ぶだけ)。
//   **本便で高さ則と扁平の式を持つのはこの lib だけ**(他の枝は持たない)。
//
// ■ 区別(各表・各式に付ける): 宣言(未接続)= この lib の T1〜T3・扁平の則・厚みの対照(今のエンジンに無い —— AN627 = A: エンジンへ入れない)/診断 = 器の表/
//   比べる列(凍結の対照)= 第332〜333便の ① 切り口・② 源の全体の三次元の差分・③ 帯と尾(第333便a の lib を呼ぶ —— 消さない・同じ名前で両方を採用済みにしない)。
// ■ 記号: 位置 p・距離 r(源の中心から —— r = √(ρ² + z²))・受け手の円柱座標 (ρ, z)(源の自転軸 â = ẑ・z は赤道面からの符号付きの高さ)・引きずり半径 R_d = Y_k m・観測自転 s・
//   引きずり自転 s_d(J 案: s_d = λ_J (f_obs/f_d)(R_obs/R_d)² s —— 第333便a の dragSpin を呼ぶ・λ_J = 1 が基準〔AN624 = A〕)・決定力 D_j = m_j/r_j・慣性決定力(引きずりの重み)W_j = m_j/r_j^α・
//   背景慣性決定力 W₀・扁平率 f_flat = (R_eq − R_pol)/R_eq(球で 0)・軸比 R_pol/R_eq = 1 − f_flat(**どちらで割ったかを列の名前に書く** —— 観測の質量の補正の f・慣性係数 f_obs と混ぜない)。
// ■ 読みの候補(走行の前の宣言 —— READINGS。成分・偶奇・小さい z の極限を各候補に書く)
//   T1 視線方向の捩れ: 源の引きずり自転 s_d ẑ の、源と受け手を結ぶ向き r̂ の成分 s_d·r̂ = s_d z/r(その線のまわりの捩れの率 —— 赤道面で 0・極で最大)× 腕の長さ r(角速度を維持)= s_d z
//     (成分: 視線のまわりの捩れの速さ —— 符号付きの大きさ・z の奇関数・V/z = s_d は r にも z にも依らない)。直交する成分 s_d ρ/r × r = s_d ρ は並進引きずりの回転の分(座標変換)に数える。
//     重みつきの列 T1β = β s_d z(β は受け手の位置の源の重みの割合 —— β がほぼ一定の範囲で z に比例)。
//   T2 回転の場の半渦度の動径の成分: ω_ρ = −½ ∂U_φ/∂z(U_φ は比べる列 ①② の方位の速度 —— z の偶関数なので ω_ρ は奇関数)× r。
//     ① 切り口(帯 |z| ≤ R_d の内): U₁ = s_d (R_d² − z²)/ρ → ω_ρ = s_d z/ρ → V = s_d z r/ρ(帯の外 0 —— |z| = R_d で途切れる)/
//     ② 球(遠方 r ≫ R_d): U₂ = α s_d R_d² ρ/(5r²) → ω_ρ = α s_d R_d² ρ z/(5r⁴) → V = α s_d R_d² ρ z/(5r³)(V/z = α s_d R_d²/(5ρ²) —— ρ に依る)。近くは第333便a の bodyVel の中心差分。
//   T3 比較用のスカラー則(統括の参考の試作 —— 今のコードで書き直した): V = β A s_d ρ (z/r)/(1 + (|z|/H)^ℓ)(成分は未割当 —— 奇関数性と小さい z の傾き β A s_d ρ/r だけを見る)。
//     A = 1・ℓ ∈ {2, 4, 8}(主 4)・H ∈ {R_d, R_obs}(主 R_d)の宣言。
//   **高さ則(T1〜T3)は z = 0 で 0・切り口 ① は z = 0 で最大 —— 反対の向きの 2 つを同じ名前で採用済みにしない**(列の名前を分ける)。
// ■ 「源の重力が十分に支配的な範囲」(走行の前の宣言 —— DOMINANCE): (g) 決定力の割合 D_j/ΣD(D_j > Σ_{k≠j} D_k ⇔ 割合 > 1/2 —— D₀ は一様で勾配を持たないので入れない)/
//   (a) 重力の加速度の大きさの割合 (m_j/r_j²)/Σ(m_k/r_k²)(= α = 2・自己の重みなし・W₀ = 0 の β —— 大きさの和で向きは見ない)/
//   (β) 統合した並進の重みの割合 β = W_j/(W_self + W₀ + ΣW)(α = 2・自己の重みの 3 列 none〔場の枠〕・kappaM〔R_d = Y_k m〕・robs〔観測半径〕—— 第333便b の selfWeightOf を呼ぶ・
//   W₀ は 0 が主・宇宙の背景の 3H₀c/(2G) は比べる列)。範囲の外は「適用外」(0 に落とした値を予測と呼ばない)。
// ■ 扁平な源(走行の前の宣言 —— OBLATE): 文字どおり R_d,eq = R_d/f_flat^q(球で発散 —— f_flat = 0 は拒否・床を入れない・扁平ほど半径が小さい)/軸比 R_d,eq = R_d/(1 − f_flat)^q
//   (球で R_d・扁平ほど大きい)× q ∈ {1/3, 1/2, 1, 2, 3}。体積を保つ回転楕円体 R_pol = R_d³/R_eq²(軸比の q = 1/3 で入力の扁平率と一致)。一様に回る回転楕円体の点の速度 s_d ẑ × p′ の
//   重み |p − p′|^(−α) の平均の方位の成分を求積(第333便a の bodyVel の型 —— R_eq = R_pol = R_d で同じ値)・遠方 α s_d R_eq² ρ/(5r²)(⟨x′²⟩ = R_eq²/5)。
//   J 固定の列: I_d = k_I m R_eq²(一様な回転楕円体の軸のまわり k_I = 2/5)・s_d = λ_J J/I_d → s_d R_eq² = λ_J J/(k_I m) は半径を広げても増えない(遠方の場は不変)/
//   半径だけ広げる列: s_d を球の値のまま(遠方の場が (R_eq/R_d)² 倍 —— J を二度入れる対照)。
// ■ 環の厚みへ繋ぐ対照(宣言 —— 採用しない・THICKNESS): 高さ則の割り当て先で起きることを分ける —— focus(鉛直の速度の場 U_z = −a z へ率 γ で緩和: z'' = −ν_z² z − γ(z' + a z) →
//   復元 ν_eff² = ν_z² + γ a)/diverge(U_z = +a z: ν_eff² = ν_z² − γ a —— 負なら束縛しない)/shear(方位のずれ ∂U_φ/∂z —— 鉛直の復元を変えない)/tilt(面を回す型 —— 面の向きの歳差で
//   厚みの式は変えない)。速度分散 σ_z を宣言した型で H ~ σ_z/ν_eff(σ_z は文献の値・未照合の桁の格子)。U_z = −a z だけ(σ_z = 0)では z → 0 へ集束するだけで平衡の厚みを決めない。
// ■ 言わないこと: 高さ則・扁平の則・厚みの対照は宣言の型の表と候補と残差と条件付きの恒等式(環の厚みや円盤を解いた・扁平な天体で引きずりが強まることを導いたとは書かない)・
//   s_d は J を表す等価なパラメータ(物質の表面の速度ではない —— J 案の T1 の速さが c₀ を超える列は速度として読まない)・文献の値はこの環境で一次資料に当たっていない(未照合)・
//   `κ_epi` と κ_D は別の量。
import { sliceVel, pairVel, farVel, bodyVel, tailVel, dragSpin, fObsOf, fObsIsLit, F_OBS_SRC, DECL as DECL333A } from './lib-w333a-rotdiff.mjs';
import { rdOf, glNodes, couplingOf, LIT as LIT332A, DECL as DECL332A } from './lib-w332a-eqband.mjs';
import { weightOf, selfWeightOf, cosmicW0 } from './lib-w333b-axialfield.mjs';
import { ringFreq, LIT as LIT331C } from './lib-w331c-k1scale.mjs';

export const LIB_VERSION = 'w334a-heightlaw-lib-1';
const isFin = Number.isFinite;
const AU = 1.495978707e11, KPC = 3.0856775814913673e19, MSUN = 1.98847e30, HOUR = 3600;
/** 読みの候補の名(高さ則)と比べる列の名(凍結の対照 —— 第333便a) */
export const READINGS = Object.freeze(['T1', 'T2', 'T3']);
export const CONTRASTS = Object.freeze(['slice', 'ball', 'pair', 'lorentz', 'sum2']);
export const SELF_RULES = Object.freeze(['none', 'kappaM', 'robs']);
export const LAWS = Object.freeze(['inverseF', 'axisRatio']);
export const THICK_TYPES = Object.freeze(['focus', 'diverge', 'shear', 'tilt']);
/** 走行の前の宣言(正本の先頭 —— 結果を見て変えない。変えたら版を上げて理由を書く) */
export const DECL = Object.freeze({
  G: DECL332A.G, c: DECL332A.c,
  /** 読みの候補の成分と偶奇(宣言) */
  readings: Object.freeze({
    T1: Object.freeze({ label: '視線方向の捩れ s_d·r̂ × r = s_d z', component: '視線のまわりの捩れの速さ(符号付きの大きさ)', parity: 'odd', smallZ: 'V/z = s_d(β 倍の列は β s_d)', rIndependent: '全域(β がほぼ一定の範囲)' }),
    T2: Object.freeze({ label: '半渦度の動径の成分 −½∂U_φ/∂z × r(U_φ は ① 切り口・② 球 α = 2・② 対向 2 点)', component: '動径(回転の場の半渦度)', parity: 'odd', smallZ: '① V/z = s_d r/ρ(帯の内)・② V/z = α s_d R_d²/(5ρ²)', rIndependent: '① 帯の内だけ・② 無し' }),
    T3: Object.freeze({ label: '比較用のスカラー則 β A s_d ρ (z/r)/(1 + (|z|/H)^ℓ)', component: '未割当(スカラー)', parity: 'odd', smallZ: 'V/z = β A s_d ρ/r', rIndependent: '|z| ≪ H・ρ で β がほぼ一定の範囲' }),
  }),
  /** T3 の宣言(A・ℓ・H —— 主は ℓ = 4・H = R_d) */
  t3: Object.freeze({ A: 1, ells: Object.freeze([2, 4, 8]), ellMain: 4, Hs: Object.freeze(['Rd', 'Robs']), HMain: 'Rd' }),
  /** 「z に比例」の物差し: |(V/z) ÷ (V/z)_{z→0} − 1| ≤ propTol を満たす |z| の上限を z/ρ の対数の格子で(10^lo〜10^hi・刻み step dex) */
  prop: Object.freeze({ tol: 0.1, lo: -14, hi: 0, step: 0.25 }),
  /** 範囲の物差し(割合 > share を「支配的」—— D_j > Σ_{k≠j} D_k と同じ)・重みの次数 α = 2・W₀ は 0 が主(宇宙の背景は H₀ = 70 km s⁻¹ Mpc⁻¹ の 3H₀c/(2G) を比べる列) */
  dominance: Object.freeze({ share: 0.5, alpha: 2, W0main: 0, H0: 70e3 / 3.0856775814913673e22 }),
  /** 扁平の則 × 次数 q × 扁平率の格子(f_flat = 0 は文字どおりの則で拒否) */
  oblate: Object.freeze({ qs: Object.freeze([1 / 3, 1 / 2, 1, 2, 3]), qMain: 1, fGrid: Object.freeze([0, 1e-3, 1e-2, 0.1, 0.3, 0.6, 0.9]), kI: 0.4, lambdaJ: 1 }),
  /** 回転楕円体の求積(α の格子・近接場の点・高さの点・形〔軸比 q = 1/3 —— 実際の扁平率 = f_flat〕・求積の点の数・収束を見る点の数・遠方へ切り替える r/R_eq) */
  spheroid: Object.freeze({ alphas: Object.freeze([1, 1.5, 2, 3]), rhoOverReq: Object.freeze([1.5, 2, 10, 100]), zOverReq: Object.freeze([0, 0.5, 1, 2]), fShapes: Object.freeze([0, 0.1, 0.3, 0.6]),
    quad: Object.freeze({ nr: 24, nth: 48, nph: 48 }), quadHi: Object.freeze({ nr: 36, nth: 72, nph: 72 }), farSwitch: 1e3 }),
  /** 厚みの対照: 速度分散 σ_z の格子 [m/s](文献の値・未照合の桁 —— LIT334A.sigmaZ)・型 */
  thickness: Object.freeze({ sigmaZ: Object.freeze([1e-3, 2e-3, 5e-3]), types: THICK_TYPES }),
  /** 求積の近くの T2 の中心差分の刻み(÷ R_d)と遠方へ切り替える r/R_d(第333便a の DECL.quad.farSwitch と同じ) */
  t2: Object.freeze({ hOverRd: 1e-3, farSwitch: DECL333A.quad.farSwitch }),
});
/** 文献の値(**この環境で一次資料に当たっていない —— 文献の値・未照合**。出典の名だけを書く) */
export const LIT334A = Object.freeze({
  note: '文献の値・未照合(この環境から一次資料のサイトに届かない —— 出典の名と値は記憶と既存の lib の写し)',
  bodiesSrc: 'NASA NSSDC の Planetary Fact Sheet と Sun Fact Sheet(Williams, D. R.)の質量・赤道半径・恒星日の自転周期・扁平率 —— 太陽の扁平率は Kuhn, J. R. et al. 2012, Science 337, 1638(Δr ≈ 7 km の桁)—— 文献の値・未照合',
  /** 天体(質量 kg・赤道半径 m・自転周期 h〔負は逆行〕・扁平率 f_flat・公転の半径 a〔AU —— 太陽は 0〕・第333便a の慣性係数の添字) */
  bodies: Object.freeze([
    Object.freeze({ key: 'sun', name: '太陽', m: 1.9885e30, R: 6.957e8, P: 609.12, f: 9e-6, aAU: 0, moi: 0 }),
    Object.freeze({ key: 'mercury', name: '水星', m: 3.3011e23, R: 2.4405e6, P: 1407.6, f: 0.0009, aAU: 0.387098, moi: 1 }),
    Object.freeze({ key: 'venus', name: '金星', m: 4.8675e24, R: 6.0518e6, P: -5832.6, f: 0, aAU: 0.723332, moi: 2 }),
    Object.freeze({ key: 'earth', name: '地球', m: 5.9722e24, R: 6.3781e6, P: 23.9345, f: 0.003353, aAU: 1.000001, moi: 3 }),
    Object.freeze({ key: 'mars', name: '火星', m: 6.4171e23, R: 3.3962e6, P: 24.6229, f: 0.00589, aAU: 1.523679, moi: 5 }),
    Object.freeze({ key: 'jupiter', name: '木星', m: 1.89819e27, R: 7.1492e7, P: 9.925, f: 0.06487, aAU: 5.2044, moi: 6 }),
    Object.freeze({ key: 'saturn', name: '土星', m: 5.6834e26, R: 6.0268e7, P: 10.656, f: 0.09796, aAU: 9.5826, moi: 11 }),
    Object.freeze({ key: 'uranus', name: '天王星', m: 8.6813e25, R: 2.5559e7, P: -17.24, f: 0.02293, aAU: 19.2184, moi: 13 }),
    Object.freeze({ key: 'neptune', name: '海王星', m: 1.02413e26, R: 2.4764e7, P: 16.11, f: 0.01708, aAU: 30.11, moi: 14 }),
    Object.freeze({ key: 'moon', name: '月', m: 7.346e22, R: 1.7381e6, P: 655.72, f: 0.0012, aAU: null, moi: 4 }),
  ]),
  /** 衛星(質量 kg・半径 m・主星からの軌道の半径 m —— 同上の出典と第332便a の LIT の軌道の半径) */
  moonsSrc: 'NASA NSSDC の衛星の表の質量と半径・軌道の半径は第332便a の lib の LIT(JPL の平均の要素)—— 文献の値・未照合',
  moons: Object.freeze([
    Object.freeze({ key: 'io', name: 'イオ', host: 'jupiter', m: 8.932e22, R: 1.8216e6, a: 421700e3 }), Object.freeze({ key: 'europa', name: 'エウロパ', host: 'jupiter', m: 4.800e22, R: 1.5608e6, a: 671034e3 }),
    Object.freeze({ key: 'ganymede', name: 'ガニメデ', host: 'jupiter', m: 1.4819e23, R: 2.6341e6, a: 1070412e3 }), Object.freeze({ key: 'callisto', name: 'カリスト', host: 'jupiter', m: 1.0759e23, R: 2.4103e6, a: 1882709e3 }),
    Object.freeze({ key: 'titan', name: 'タイタン', host: 'saturn', m: 1.3452e23, R: 2.5747e6, a: 1221870e3 }),
  ]),
  /** 環(中央の半径 m —— 内縁と外縁の中点・厚みは第332便a の LIT.rings の値と種類) */
  ringsSrc: 'NASA NSSDC の土星・木星・天王星の環の表の内縁と外縁(土星 C 74 658〜92 000 km・B 92 000〜117 580 km・カッシーニの間隙 117 580〜122 170 km・A 122 170〜136 775 km・木星 主環 122 800〜129 200 km・天王星 ε 環 51 149 km)—— 文献の値・未照合',
  rings: Object.freeze([
    Object.freeze({ key: 'satC', host: 'saturn', name: '土星 C 環', r: 0.5 * (74658e3 + 92000e3) }), Object.freeze({ key: 'satB', host: 'saturn', name: '土星 B 環', r: 0.5 * (92000e3 + 117580e3) }),
    Object.freeze({ key: 'satCD', host: 'saturn', name: '土星 カッシーニの間隙', r: 0.5 * (117580e3 + 122170e3) }), Object.freeze({ key: 'satA', host: 'saturn', name: '土星 A 環', r: 0.5 * (122170e3 + 136775e3) }),
    Object.freeze({ key: 'jupMain', host: 'jupiter', name: '木星 主環', r: 0.5 * (122800e3 + 129200e3) }), Object.freeze({ key: 'uraEps', host: 'uranus', name: '天王星 ε 環', r: 51149e3 }),
  ]),
  /** 環の粒子(宣言 —— 半径 1 m・密度 900 kg m⁻³ の氷の球。文献の値ではない) */
  particle: Object.freeze({ R: 1, rho: 900 }),
  /** 太陽系の受け手から見た銀河(点の宣言 —— 内側の質量 v²R/G・v = 2.3e5 m/s の桁・R = 8.2 kpc。Bland-Hawthorn, J. & Gerhard, O. 2016, ARA&A 54, 529 —— 文献の値・未照合) */
  galaxy: Object.freeze({ v: 2.3e5, RKpc: 8.2, src: 'Bland-Hawthorn, J. & Gerhard, O. 2016, ARA&A 54, 529(太陽の銀河中心距離 8.2 kpc・回転の速さ 2.3e5 m/s の桁)—— 文献の値・未照合' }),
  /** 主な環の速度分散(σ_z の格子の桁の出典)と厚み(第332便a の LIT.rings —— 典型の約 10 m は 1 つの総説の値) */
  sigmaZSrc: 'Cuzzi, J. N. et al. 2010, Science 327, 1470・Esposito, L. W. 2002, Rep. Prog. Phys. 65, 1741(主な環の速度分散は mm/s の桁)—— 文献の値・未照合',
  ringThickness: LIT332A.rings,
  saturnJ2: LIT331C.saturnJ2,
  /** 銀河の円盤の軸比の宣言(R_pol/R_eq —— 薄い円盤の桁の宣言・文献の値ではない) */
  galaxyAxisRatio: 0.1,
  fObsSrc: F_OBS_SRC,
});

function need(o, keys, name) {
  if (!o || typeof o !== 'object') throw new RangeError(name + ': 入力が無い');
  for (const k of keys) if (!isFin(o[k])) throw new RangeError(name + ': ' + k + ' が有限でない');
}

/* ───────── T1 視線方向の捩れ ───────── */
/** par = β s_d z(視線のまわりの捩れの率 s_d z/r × 腕 r)・perp = β s_d ρ(直交の成分 × r —— 並進引きずりの回転の分)・rate = s_d z/r */
export function t1Twist({ rho, z, sd, beta = 1 }) {
  need({ rho, z, sd, beta }, ['rho', 'z', 'sd', 'beta'], 't1Twist');
  if (!(rho >= 0) || !(beta >= 0 && beta <= 1)) throw new RangeError('t1Twist: ρ ≥ 0・0 ≤ β ≤ 1');
  const r = Math.hypot(rho, z);
  if (!(r > 0)) throw new RangeError('t1Twist: r > 0');
  return { par: beta * sd * z, perp: beta * sd * rho, rate: sd * z / r };
}

/* ───────── T2 半渦度の動径の成分 × r ───────── */
/** 比べる列(slice・ball・pair)の U_φ から ω_ρ = −½ ∂U_φ/∂z と V = r ω_ρ。遠方(r/R_d ≥ farSwitch)は解析の形・近くは中心差分(slice は解析) */
export function t2Vort({ rho, z, Rd, sd, col = 'ball', alpha = 2 }) {
  need({ rho, z, Rd, sd, alpha }, ['rho', 'z', 'Rd', 'sd', 'alpha'], 't2Vort');
  if (!(rho > 0) || !(Rd > 0) || !(alpha > 0)) throw new RangeError('t2Vort: ρ・R_d・α > 0');
  if (!['slice', 'ball', 'pair'].includes(col)) throw new RangeError('t2Vort: 列は slice・ball・pair');
  const r = Math.hypot(rho, z);
  let omega;
  if (col === 'slice') omega = Math.abs(z) < Rd ? sd * z / rho : 0;
  else if (r / Rd >= DECL.t2.farSwitch) { const k = col === 'ball' ? 5 : 1; omega = alpha * sd * Rd * Rd * rho * z / (k * r ** 4); }
  else {
    // U_φ は z の偶関数(比べる列 —— 純関数の場面 1 で確かめる)なので差分は |z| で取り、符号を z に合わせる(z = 0 は 0)
    const h = DECL.t2.hOverRd * Rd, f = (zz) => (col === 'ball' ? bodyVel({ rho, z: zz, Rd, sd, alpha }) : pairVel({ rho, z: zz, Rd, sd, alpha })), az = Math.abs(z);
    omega = az === 0 ? 0 : -Math.sign(z) * 0.5 * (f(az + h) - f(az - h)) / (2 * h);
  }
  return { omega, V: r * omega };
}

/* ───────── T3 比較用のスカラー則 ───────── */
export function t3Scalar({ rho, z, sd, beta, A = DECL.t3.A, H, ell }) {
  need({ rho, z, sd, beta, A, H, ell }, ['rho', 'z', 'sd', 'beta', 'A', 'H', 'ell'], 't3Scalar');
  if (!(rho > 0) || !(H > 0) || !(ell > 0) || !(beta >= 0 && beta <= 1) || !(A >= 0)) throw new RangeError('t3Scalar: ρ・H・ℓ > 0・0 ≤ β ≤ 1・A ≥ 0');
  const r = Math.hypot(rho, z);
  return beta * A * sd * rho * (z / r) / (1 + (Math.abs(z) / H) ** ell);
}

/** 比べる列(凍結の対照 —— 第333便a の lib を呼ぶ): slice ①・ball ②(α = 2)・pair ②(α = 2)・lorentz ③・sum2 ③ */
export function contrastVel(col, { rho, z, Rd, sd }) {
  if (!CONTRASTS.includes(col)) throw new RangeError('contrastVel: 列は ' + CONTRASTS.join('・'));
  const x = { rho, z, Rd, sd };
  if (col === 'slice') return sliceVel(x);
  if (col === 'pair') return pairVel(Object.assign({ alpha: 2 }, x));
  if (col === 'ball') return Math.hypot(rho, z) / Rd >= DECL333A.quad.farSwitch ? farVel(Object.assign({ alpha: 2, kind: 'ball' }, x)) : bodyVel(Object.assign({ alpha: 2, kind: 'ball' }, x));
  return tailVel(col, x);
}

/** 1 点の全部の列(高さ則 T1・T1β・T1⊥・T2①・T2②・T3〔主の ℓ・H〕と比べる列)。H は T3 の H [m](主は R_d) */
export function heightRow({ rho, z, Rd, sd, beta, H = Rd, ell = DECL.t3.ellMain }) {
  const t1 = t1Twist({ rho, z, sd }), t1b = t1Twist({ rho, z, sd, beta });
  const row = { rho, z, T1: t1.par, T1beta: t1b.par, T1perp: t1.perp, T2slice: t2Vort({ rho, z, Rd, sd, col: 'slice' }).V, T2ball: t2Vort({ rho, z, Rd, sd, col: 'ball' }).V, T3: t3Scalar({ rho, z, sd, beta, H, ell }) };
  for (const c of CONTRASTS) row[c] = contrastVel(c, { rho, z, Rd, sd });
  return row;
}

/** 「z に比例」の範囲: f(z) の V/z が z → 0 の値から propTol の内に留まる |z|/ρ の上限(格子の上で —— 下から連続して満たす最後の点)。極限が 0 なら null */
export function propRange(f, rho, decl = DECL.prop) {
  const zs = []; for (let e = decl.lo; e <= decl.hi + 1e-12; e += decl.step) zs.push(rho * 10 ** e);
  const s0 = f(zs[0]) / zs[0];
  if (!(isFin(s0)) || s0 === 0) return { slope0: s0, zMax: null, zMaxOverRho: null };
  let zMax = null;
  for (const z of zs) { const s = f(z) / z; if (Math.abs(s / s0 - 1) <= decl.tol) zMax = z; else break; }
  return { slope0: s0, zMax, zMaxOverRho: zMax === null ? null : zMax / rho };
}

/* ───────── 範囲の 2 つの物差し ───────── */
/**
 * 受け手 1 点の範囲の物差し。src = { m, r }(注目の源)・others = [{ m, r }]・recv = { m, R }(受け手 —— 自己の重みの列)・W0(背景 —— 主は 0)。
 * 戻り値: dShare = D_j/ΣD・aShare = (m_j/r_j²)/Σ(m/r²)・beta{ none, kappaM, robs } = W_j/(W_self + W₀ + ΣW)(α = 2)・各の dominant(割合 > share)
 */
export function dominance({ src, others = [], recv, W0 = DECL.dominance.W0main, share = DECL.dominance.share }) {
  const all = [src].concat(others);
  for (const s of all) need(s, ['m', 'r'], 'dominance');
  if (!all.every((s) => s.m >= 0 && s.r > 0) || !(src.m > 0)) throw new RangeError('dominance: m ≥ 0(注目の源は > 0)・r > 0');
  if (!isFin(W0) || W0 < 0) throw new RangeError('dominance: W₀ ≥ 0');
  need(recv, ['m', 'R'], 'dominance');
  const a = DECL.dominance.alpha, Dj = src.m / src.r, Dsum = all.reduce((t, s) => t + s.m / s.r, 0);
  const W = (s) => weightOf(s.m, s.r, a, 1), Wj = W(src), Wsum = all.reduce((t, s) => t + W(s), 0);
  const beta = {};
  for (const rule of SELF_RULES) { const sw = selfWeightOf({ rule, m: recv.m, Robs: recv.R, alpha: a, rRef: 1 }).w; beta[rule] = Wj / (sw + W0 + Wsum); }
  const out = { dShare: Dj / Dsum, aShare: Wj / Wsum, beta };
  out.dDominant = out.dShare > share; out.aDominant = out.aShare > share; out.betaDominant = Object.fromEntries(SELF_RULES.map((k) => [k, beta[k] > share]));
  return out;
}
export const cosmicBackgroundW = (H0 = DECL.dominance.H0) => cosmicW0(H0, DECL.c, DECL.G);

/* ───────── 扁平な源 ───────── */
/** 赤道の引きずり半径の則(inverseF = R_d/f_flat^q —— f_flat = 0 は拒否・axisRatio = R_d/(1 − f_flat)^q)と体積を保つ回転楕円体の R_pol = R_d³/R_eq²・実際の扁平率 */
export function oblateRule({ Rd, fFlat, q, law }) {
  need({ Rd, fFlat, q }, ['Rd', 'fFlat', 'q'], 'oblateRule');
  if (!(Rd > 0) || !(fFlat >= 0 && fFlat < 1) || !(q > 0)) throw new RangeError('oblateRule: R_d > 0・0 ≤ f_flat < 1・q > 0');
  if (!LAWS.includes(law)) throw new RangeError('oblateRule: 則は ' + LAWS.join('・'));
  if (law === 'inverseF' && !(fFlat > 0)) throw new RangeError('oblateRule: 文字どおりの則 R_d/f_flat^q は球(f_flat = 0)で発散 —— 拒否(床を入れない)');
  const scale = law === 'inverseF' ? fFlat ** (-q) : (1 - fFlat) ** (-q), Req = Rd * scale, Rpol = Rd ** 3 / (Req * Req);
  if (![Req, Rpol].every(isFin) || !(Rpol > 0)) throw new RangeError('oblateRule: 宣言の幾何が数の範囲の外');
  return { Req, Rpol, scale, fEff: 1 - Rpol / Req, axisRatio: Rpol / Req, volumeRatio: Req * Req * Rpol / Rd ** 3 };
}
/** J 固定の引きずり自転 s_d = λ_J J/(k_I m R_eq²) と遠方のモーメント s_d R_eq²(= λ_J J/(k_I m) —— R_eq に依らない) */
export function jFixedSpin({ J, m, Req, kI = DECL.oblate.kI, lambdaJ = DECL.oblate.lambdaJ }) {
  need({ J, m, Req, kI, lambdaJ }, ['J', 'm', 'Req', 'kI', 'lambdaJ'], 'jFixedSpin');
  if (!(m > 0) || !(Req > 0) || !(kI > 0) || !(lambdaJ >= 0)) throw new RangeError('jFixedSpin: m・R_eq・k_I > 0・λ_J ≥ 0');
  const sd = lambdaJ * J / (kI * m * Req * Req);
  return { sd, moment: sd * Req * Req };
}
/**
 * 一様に回る回転楕円体(赤道半径 Req・極半径 Rpol・自転 s_d ẑ)の体積の点の速度の重み |p − p′|^(−α) の平均の方位の成分(数値の求積 —— 第333便a の bodyVel の型:
 * x′ > 0 の半分と鏡映の点の対で打ち消しの無い差の形)。受け手は楕円体の外。Req = Rpol = R_d で bodyVel と同じ節点・同じ値。
 */
export function spheroidVel({ rho, z, Req, Rpol, sd, alpha = 2, q = DECL.spheroid.quad }) {
  need({ rho, z, Req, Rpol, sd, alpha }, ['rho', 'z', 'Req', 'Rpol', 'sd', 'alpha'], 'spheroidVel');
  if (!(rho >= 0) || !(Req > 0) || !(Rpol > 0) || !(alpha > 0)) throw new RangeError('spheroidVel: ρ ≥ 0・R_eq・R_pol・α > 0');
  if (!((rho / Req) ** 2 + (z / Rpol) ** 2 > 1 + 1e-9)) throw new RangeError('spheroidVel: 受け手は回転楕円体の外');
  const TH = glNodes(q.nth), PH = glNodes(q.nph), RR = glNodes(q.nr);
  let num = 0, den = 0;
  for (let k = 0; k < q.nr; k++) {
    const u = (RR.x[k] + 1) / 2, wr = RR.w[k] / 2, jr = u * u;
    for (let a = 0; a < q.nth; a++) {
      const ct = TH.x[a], st = Math.sqrt(Math.max(0, 1 - ct * ct)), zp = Rpol * u * ct, sp = Req * u * st, wt = TH.w[a], dz2 = (z - zp) * (z - zp);
      for (let b = 0; b < q.nph; b++) {
        const ph = (Math.PI / 2) * PH.x[b], wp = PH.w[b] * Math.PI / 2, xp = sp * Math.cos(ph), yp = sp * Math.sin(ph);
        const rm2 = (rho - xp) * (rho - xp) + yp * yp + dz2, wm = rm2 ** (-alpha / 2);
        const diff = wm * (-Math.expm1(-(alpha / 2) * Math.log1p(4 * rho * xp / rm2))), wpl = wm - diff, W = wr * jr * wt * wp;
        num += W * xp * diff; den += W * (wm + wpl);
      }
    }
  }
  return sd * num / den;
}
/** 回転楕円体の遠方の形 α s_d R_eq² ρ/(5r²) */
export function spheroidFar({ rho, z, Req, sd, alpha = 2 }) {
  need({ rho, z, Req, sd, alpha }, ['rho', 'z', 'Req', 'sd', 'alpha'], 'spheroidFar');
  const r2 = rho * rho + z * z;
  if (!(r2 > 0) || !(Req > 0)) throw new RangeError('spheroidFar: r・R_eq > 0');
  return alpha * sd * Req * Req * rho / (5 * r2);
}

/* ───────── 環の厚みへ繋ぐ対照(宣言 —— 採用しない)───────── */
/** 鉛直の型ごとの有効な復元 ν_eff と厚み H = σ_z/ν_eff(H₀ = σ_z/ν_z との比)。a = 鉛直の速度の場の傾き [1/s]・γ = 緩和の率 [1/s] */
export function verticalContrast({ type, nuZ, gamma, a, sigmaZ }) {
  if (!THICK_TYPES.includes(type)) throw new RangeError('verticalContrast: 型は ' + THICK_TYPES.join('・'));
  need({ nuZ, gamma, a, sigmaZ }, ['nuZ', 'gamma', 'a', 'sigmaZ'], 'verticalContrast');
  if (!(nuZ > 0) || !(gamma >= 0) || !(a >= 0) || !(sigmaZ >= 0)) throw new RangeError('verticalContrast: ν_z > 0・γ・a・σ_z ≥ 0');
  const ga = gamma * a, nu2 = type === 'focus' ? nuZ * nuZ + ga : type === 'diverge' ? nuZ * nuZ - ga : nuZ * nuZ;
  const bound = nu2 > 0, nuEff = bound ? Math.sqrt(nu2) : null, H0 = sigmaZ / nuZ, H = bound ? sigmaZ / nuEff : null;
  return { type, gammaA: ga, gammaAOverNu2: ga / (nuZ * nuZ), bound, nuEff, H0, H, ratio: bound ? nuZ / nuEff : null, changesThickness: type === 'focus' || type === 'diverge' };
}

/* ───────── 純関数の場面と門 ───────── */
export function pureScenes() {
  const S = {}, Rd = 1, sd = 2, pts = [[3, 0.4], [10, 0.5], [10, 2], [100, 0.3], [2000, 5]];
  // 1 偶奇: 高さ則 T1・T2(slice・ball・pair)・T3 は z の奇関数・比べる列 ①②③ は偶関数(第333便a の列を呼ぶ)
  const oddOf = (f) => pts.every(([rho, z]) => { const p = f(rho, z), m = f(rho, -z); return Math.abs(p + m) <= 1e-9 * Math.abs(p) + 1e-300 && p !== 0; });
  const evenOf = (f) => pts.every(([rho, z]) => { const p = f(rho, z), m = f(rho, -z); return Math.abs(p - m) <= 1e-12 * Math.abs(p) + 1e-300; });
  S.parity = { T1: oddOf((rho, z) => t1Twist({ rho, z, sd }).par), T1beta: oddOf((rho, z) => t1Twist({ rho, z, sd, beta: 0.3 }).par),
    T2ball: oddOf((rho, z) => t2Vort({ rho, z, Rd, sd, col: 'ball' }).V), T2pair: oddOf((rho, z) => t2Vort({ rho, z, Rd, sd, col: 'pair' }).V),
    T2slice: [[3, 0.4], [10, 0.5], [100, 0.3]].every(([rho, z]) => { const p = t2Vort({ rho, z, Rd, sd, col: 'slice' }).V; return p !== 0 && p === -t2Vort({ rho, z: -z, Rd, sd, col: 'slice' }).V; }),
    T3: oddOf((rho, z) => t3Scalar({ rho, z, sd, beta: 0.7, H: 1, ell: 4 })),
    contrastEven: CONTRASTS.every((c) => evenOf((rho, z) => contrastVel(c, { rho, z, Rd, sd }))) };
  // 2 小さい z の極限: T1 V/z = s_d(全域)・T2① V/z = s_d r/ρ(帯の内)・T2② V/z → α s_d R_d²/(5ρ²)(遠方)・T3 V/z → β A s_d
  { const rho = 1e4, z = 1e-4, beta = 0.2, A = 1.3;
    S.slope = { t1: t1Twist({ rho, z: 37, sd }).par / 37 / sd, t1far: t1Twist({ rho, z: 1e3 * rho, sd }).par / (1e3 * rho) / sd,
      t2slice: t2Vort({ rho, z: 0.5, Rd, sd, col: 'slice' }).V / 0.5 / (sd * Math.hypot(rho, 0.5) / rho), t2sliceOut: t2Vort({ rho, z: 1.5, Rd, sd, col: 'slice' }).V,
      t2ball: t2Vort({ rho, z, Rd, sd, col: 'ball' }).V / z / (2 * sd * Rd * Rd / (5 * rho * rho)),
      t3: t3Scalar({ rho, z, sd, beta, A, H: 1, ell: 4 }) / z / (beta * A * sd) }; }
  // 3 T2 の遠方の解析の形と、第333便a の bodyVel の中心差分(r/R_d = 300 —— 遠方へ切り替える前)の比・対向 2 点も
  { const rho = 300, z = 30, f = (zz) => bodyVel({ rho, z: zz, Rd, sd, alpha: 2 }), h = 1e-3, num = -0.5 * (f(z + h) - f(z - h)) / (2 * h), r = Math.hypot(rho, z), ana = 2 * sd * Rd * Rd * rho * z / (5 * r ** 4);
    const g = (zz) => pairVel({ rho, z: zz, Rd, sd, alpha: 2 }), nump = -0.5 * (g(z + h) - g(z - h)) / (2 * h), anap = 2 * sd * Rd * Rd * rho * z / (r ** 4);
    S.t2far = { ball: num / ana, pair: nump / anap, nearUsed: t2Vort({ rho, z, Rd, sd, col: 'ball' }).omega / num }; }
  // 4 赤道面: 高さ則は 0・切り口 ① は z = 0 で最大(反対の向き)
  { const rho = 10, zs = [0, 0.1, 0.3, 0.6, 0.9, 1.5];
    S.equator = { t1: t1Twist({ rho, z: 0, sd }).par, t2: t2Vort({ rho, z: 0, Rd, sd, col: 'ball' }).V, t3: t3Scalar({ rho, z: 0, sd, beta: 1, H: 1, ell: 4 }),
      sliceMaxAt0: zs.every((z) => contrastVel('slice', { rho, z, Rd, sd }) <= contrastVel('slice', { rho, z: 0, Rd, sd })), t1Increasing: zs.every((z, k) => k === 0 || t1Twist({ rho, z, sd }).par > t1Twist({ rho, z: zs[k - 1], sd }).par) }; }
  // 5 z に比例する範囲(格子): T1 は全域・T2① は帯の内(|z| < R_d)・T3 は H の桁の下・T2② は |z| ≪ ρ
  { const rho = 1e3;
    S.prop = { t1: propRange((z) => t1Twist({ rho, z, sd }).par, rho), t2slice: propRange((z) => t2Vort({ rho, z, Rd, sd, col: 'slice' }).V, rho),
      t3: propRange((z) => t3Scalar({ rho, z, sd, beta: 1, H: 1, ell: 4 }), rho), t2ball: propRange((z) => t2Vort({ rho, z, Rd, sd, col: 'ball' }).V, rho) }; }
  // 6 範囲の物差し: 1 つの源(自己なし)で全部 1・同じ源を 2 つで 1/2・遠い大質量は D で勝ち重みで負ける(注目の源は D で負け重みで勝つ)・自己 kappaM の小さな受け手で β ≈ 0
  { const one = dominance({ src: { m: 1, r: 1 }, recv: { m: 1e-30, R: 1 } }), two = dominance({ src: { m: 1, r: 1 }, others: [{ m: 1, r: 1 }], recv: { m: 1e-30, R: 1 } });
    const far = dominance({ src: { m: 1, r: 1 }, others: [{ m: 1e6, r: 1e4 }], recv: { m: 1e-30, R: 1 } }), small = dominance({ src: { m: 1e30, r: 1e8 }, recv: { m: 3770, R: 1 } });
    S.dom = { one: [one.dShare, one.aShare, one.beta.none], two: [two.dShare, two.aShare, two.beta.none], farD: far.dShare, farA: far.aShare, farDom: [far.dDominant, far.aDominant], smallKappa: small.beta.kappaM, smallRobs: small.beta.robs,
      w0: dominance({ src: { m: 1, r: 1 }, recv: { m: 1e-30, R: 1 }, W0: 1 }).beta.none }; }
  // 7 扁平の則: 軸比の則は球で R_d・q = 1/3 で実際の扁平率 = 入力・体積を保つ・文字どおりの則は f が増すと R_eq が減り、軸比の則は増える・文字どおりは f = 0 を拒否
  { const ax0 = oblateRule({ Rd: 2, fFlat: 0, q: 1, law: 'axisRatio' }), ax3 = oblateRule({ Rd: 2, fFlat: 0.3, q: 1 / 3, law: 'axisRatio' });
    const lit = [0.01, 0.1, 0.3].map((f) => oblateRule({ Rd: 2, fFlat: f, q: 1, law: 'inverseF' }).Req), axs = [0.01, 0.1, 0.3].map((f) => oblateRule({ Rd: 2, fFlat: f, q: 1, law: 'axisRatio' }).Req);
    const vols = DECL.oblate.qs.flatMap((q) => LAWS.map((law) => oblateRule({ Rd: 2, fFlat: 0.2, q, law }).volumeRatio));
    let rej = false; try { oblateRule({ Rd: 2, fFlat: 0, q: 1, law: 'inverseF' }); } catch (e) { rej = e instanceof RangeError; }
    S.oblate = { sphere: ax0.Req / 2, fEff: ax3.fEff, vols, litDecreasing: lit[0] > lit[1] && lit[1] > lit[2], axIncreasing: axs[0] < axs[1] && axs[1] < axs[2], rejectSphere: rej, saturn: [oblateRule({ Rd: 1, fFlat: 0.09796, q: 1, law: 'inverseF' }).Req, oblateRule({ Rd: 1, fFlat: 0.09796, q: 1, law: 'axisRatio' }).Req] }; }
  // 8 回転楕円体の求積: R_eq = R_pol = R_d で第333便a の bodyVel と同じ・遠方の形・J 固定で遠方は不変・半径だけで (R_eq/R_d)² 倍・点の数を 1.5 倍の収束
  { const same = [[2, 0], [3, 1.5], [10, 3]].map(([rho, z]) => spheroidVel({ rho, z, Req: 1, Rpol: 1, sd, alpha: 2 }) / bodyVel({ rho, z, Rd: 1, sd, alpha: 2 }));
    const g = oblateRule({ Rd: 1, fFlat: 0.3, q: 1 / 3, law: 'axisRatio' }), J = 0.4 * 1 * 1 * sd, jf = jFixedSpin({ J, m: 1, Req: g.Req });
    const far = spheroidVel({ rho: 1e3, z: 20, Req: g.Req, Rpol: g.Rpol, sd: jf.sd, alpha: 2 }) / spheroidFar({ rho: 1e3, z: 20, Req: g.Req, sd: jf.sd, alpha: 2 });
    const invJ = spheroidVel({ rho: 1e3, z: 0, Req: g.Req, Rpol: g.Rpol, sd: jf.sd, alpha: 2 }) / bodyVel({ rho: 1e3, z: 0, Rd: 1, sd, alpha: 2 });
    const radOnly = spheroidVel({ rho: 1e3, z: 0, Req: g.Req, Rpol: g.Rpol, sd, alpha: 2 }) / bodyVel({ rho: 1e3, z: 0, Rd: 1, sd, alpha: 2 });
    const conv = [[1.5, 0, 3], [2, 1, 2], [1.2, 0.5, 1]].map(([k, zz, al]) => { const gg = oblateRule({ Rd: 1, fFlat: 0.6, q: 1 / 3, law: 'axisRatio' }), o = { rho: k * gg.Req, z: zz * gg.Req, Req: gg.Req, Rpol: gg.Rpol, sd, alpha: al };
      return Math.abs(spheroidVel(o) / spheroidVel(Object.assign({ q: DECL.spheroid.quadHi }, o)) - 1); });
    S.spheroid = { same, far, invJ, radOnly, radOnlyExpect: g.Req * g.Req, moment: jf.moment / (sd * 1), conv }; }
  // 9 厚みの対照: focus は ν/√(ν² + γa)・a = 0 で 1・diverge で γa > ν² は束縛しない・σ_z = 0 は厚み 0(集束だけでは平衡の厚みを決めない)・shear・tilt は厚みの式を変えない
  { const f = verticalContrast({ type: 'focus', nuZ: 2, gamma: 3, a: 4, sigmaZ: 1 }), d = verticalContrast({ type: 'diverge', nuZ: 2, gamma: 3, a: 4, sigmaZ: 1 }), d0 = verticalContrast({ type: 'diverge', nuZ: 2, gamma: 1, a: 1, sigmaZ: 1 });
    S.thick = { focus: f.ratio, focusExpect: 2 / 4, zeroA: verticalContrast({ type: 'focus', nuZ: 2, gamma: 3, a: 0, sigmaZ: 1 }).ratio, divergeUnbound: d.bound === false && d.H === null, divergeMild: d0.ratio,
      sigma0: verticalContrast({ type: 'focus', nuZ: 2, gamma: 3, a: 4, sigmaZ: 0 }).H, shear: verticalContrast({ type: 'shear', nuZ: 2, gamma: 3, a: 4, sigmaZ: 1 }).ratio, tilt: verticalContrast({ type: 'tilt', nuZ: 2, gamma: 3, a: 4, sigmaZ: 1 }).ratio }; }
  // 10 J 案(第333便a の dragSpin を呼ぶ)と J 固定の一致: 球の R_eq = R_d で jFixedSpin の s_d = dragSpin の s_d(f_d = k_I = 2/5)
  { const o = { m: 5.6834e26, Robs: 6.0268e7, s: 2 * Math.PI / (10.656 * HOUR), fObs: 0.21 }, D = dragSpin(o), Jobs = o.fObs * o.m * o.Robs ** 2 * o.s, jf = jFixedSpin({ J: Jobs, m: o.m, Req: D.Rd });
    S.jcase = { rel: jf.sd / D.sd, rdOfSame: D.Rd / rdOf(o.m) }; }
  // 11 入力の拒否
  const rej = [() => t1Twist({ rho: 0, z: 0, sd: 1 }), () => t1Twist({ rho: 1, z: 0, sd: 1, beta: 2 }), () => t2Vort({ rho: 0, z: 1, Rd: 1, sd: 1 }), () => t2Vort({ rho: 1, z: 1, Rd: 1, sd: 1, col: 'shell' }),
    () => t3Scalar({ rho: 1, z: 1, sd: 1, beta: 1, H: 0, ell: 4 }), () => contrastVel('box', { rho: 3, z: 0, Rd: 1, sd: 1 }), () => dominance({ src: { m: 0, r: 1 }, recv: { m: 1, R: 1 } }),
    () => dominance({ src: { m: 1, r: 1 }, recv: { m: 1, R: 1 }, W0: -1 }), () => oblateRule({ Rd: 1, fFlat: 0, q: 1, law: 'inverseF' }), () => oblateRule({ Rd: 1, fFlat: 1, q: 1, law: 'axisRatio' }),
    () => oblateRule({ Rd: 1, fFlat: 0.1, q: 1, law: 'cube' }), () => spheroidVel({ rho: 0.5, z: 0, Req: 1, Rpol: 0.5, sd: 1 }), () => jFixedSpin({ J: 1, m: 0, Req: 1 }),
    () => verticalContrast({ type: 'box', nuZ: 1, gamma: 0, a: 0, sigmaZ: 1 }), () => verticalContrast({ type: 'focus', nuZ: 0, gamma: 0, a: 0, sigmaZ: 1 }), () => t1Twist({ rho: NaN, z: 0, sd: 1 })];
  S.reject = rej.map((f) => { try { f(); return false; } catch (e) { return e instanceof RangeError; } });
  return S;
}
export function pureGates(S) {
  const rel = (a, b) => Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b), 1e-300);
  return {
    parity: Object.values(S.parity).every((x) => x === true),
    smallZ: rel(S.slope.t1, 1) < 1e-15 && rel(S.slope.t1far, 1) < 1e-15 && rel(S.slope.t2slice, 1) < 1e-14 && S.slope.t2sliceOut === 0 && Math.abs(S.slope.t2ball - 1) < 1e-8 && Math.abs(S.slope.t3 - 1) < 1e-8,
    t2Far: Math.abs(S.t2far.ball - 1) < 1e-4 && Math.abs(S.t2far.pair - 1) < 1e-4 && rel(S.t2far.nearUsed, 1) < 1e-12,
    equator: S.equator.t1 === 0 && S.equator.t2 === 0 && S.equator.t3 === 0 && S.equator.sliceMaxAt0 && S.equator.t1Increasing,
    propRange: S.prop.t1.zMaxOverRho === 1 && S.prop.t2slice.zMax !== null && S.prop.t2slice.zMax < 1 && S.prop.t3.zMax !== null && S.prop.t3.zMax < 1 && S.prop.t2ball.zMaxOverRho !== null && S.prop.t2ball.zMaxOverRho < 1 && S.prop.t2ball.zMaxOverRho > 1e-2,
    dominance: S.dom.one.every((x) => rel(x, 1) < 1e-15) && S.dom.two.every((x) => rel(x, 0.5) < 1e-15) && S.dom.farD < 0.5 && S.dom.farA > 0.5 && S.dom.farDom[0] === false && S.dom.farDom[1] === true
      && S.dom.smallKappa < 1e-30 && S.dom.smallRobs > 0.999 && rel(S.dom.w0, 0.5) < 1e-15,
    oblate: rel(S.oblate.sphere, 1) < 1e-15 && rel(S.oblate.fEff, 0.3) < 1e-12 && S.oblate.vols.every((v) => rel(v, 1) < 1e-12) && S.oblate.litDecreasing && S.oblate.axIncreasing && S.oblate.rejectSphere
      && rel(S.oblate.saturn[0], 1 / 0.09796) < 1e-12 && rel(S.oblate.saturn[1], 1 / (1 - 0.09796)) < 1e-12,
    spheroid: S.spheroid.same.every((x) => rel(x, 1) < 1e-12) && Math.abs(S.spheroid.far - 1) < 1e-5 && Math.abs(S.spheroid.invJ - 1) < 1e-5 && Math.abs(S.spheroid.radOnly / S.spheroid.radOnlyExpect - 1) < 1e-5
      && rel(S.spheroid.moment, 1) < 1e-12 && S.spheroid.conv.every((x) => x < 1e-6),
    thickness: rel(S.thick.focus, S.thick.focusExpect) < 1e-15 && S.thick.zeroA === 1 && S.thick.divergeUnbound && S.thick.divergeMild > 1 && S.thick.sigma0 === 0 && S.thick.shear === 1 && S.thick.tilt === 1,
    jCase: rel(S.jcase.rel, 1) < 1e-12 && rel(S.jcase.rdOfSame, 1) < 1e-15,
    reject: S.reject.length === 16 && S.reject.every(Boolean),
  };
}
export { AU, KPC, MSUN, HOUR, rdOf, dragSpin, fObsOf, fObsIsLit, couplingOf, ringFreq, LIT332A, LIT331C };
