// 第337便j(原仮定者の補足(2026-11-15 —— 第138報の補足 5)「フォボスや主要衛星は元々潮汐ロックされているので、軸引きずりでの比較に意味が薄い …… 主星にロックしていない観測値が有る固体天体は、
//   地球、火星、冥王星、コンパクト天体など」「回転引きずりで、『源の自転の半分より速く公転するもの』に注目したのは、公転の速さに回転引きずりが影響していると見える為」「一様厚みについては、
//   以前の他の …… 提案も参考にする」・探索の方針(第138報 —— 式の形を走行の前に決め打ちしない・1 つのノブで同時に満たせないならノブを足す)・統括の検証項目 R346):
//   **3 つの純関数の組** —— T1 軸引きずりの 2 つの読み(慣性系の背景宇宙が静止〔第337便a の `staticRate`〕/今の並進の式の形〔`selfRate`〕)を、主星にロックしていない天体の源ごとの取り分 f で
//   並べ、和の向きを観測の自転の向きと照らし、差が観測の量で見分けられるかの精度の桁を出す/T2 回転引きずりの方位の作用の型(第337便i の lib の場と作用を呼ぶ + 本枝で足した
//   「剛体の場に対する相対の速度」の型 —— 場の角速度の比 χ のノブ)の公転の速さと半長軸の率を n/s の関数で読む/T3 一様厚みの型の候補(帯の幅をそのまま厚みと読む型・源の取り分で重みを
//   付けた T1・場の鉛直の速さと重力の鉛直の振動の速さが等しい高さ)
//   (器 tests/exp-w337j-spinorbit.mjs と QA behavior.spinorbit337j・docs.spinorbit337j が読む —— html を読まない・状態を持たない・第337便a・第337便i ほかの lib は呼ぶだけ・エンジンの式を写さない)。
//
// ■ 区別: 軸引きずり(受け手の自転に効く —— 本 lib の T1)・回転引きずり(源の引きずり半径が効く場 —— T2・T3)・並進引きずり(比べる列に出さない)・潮汐(本 lib では積まない ——
//   観測の公転の変化の担い手として文献で通例の量。照らすだけ)。表は「候補」「探索」「未較正」「このノブの組では」。
// ■ 記号: 源 j の重み w_j = (m_j/AU²)(AU/r)^α(第337便a の `weight337`・α = 2)・背景慣性決定力 W₀(第337便a の金星で釣り合う解 —— 読みごと)・源の取り分 f_j = w_j/(Σ_k w_k + W₀)・
//   受け手の源のまわりの角速度 n・源の観測自転 s・赤道面の閉じた式: 背景が静止 ω_st = s f [1 − α(1 − f)]・今の並進の式の形 ω_se = f [s − α(1 − f)(s − n)]・差 ω_st − ω_se = −α f (1 − f) n。
//   他の源の重みは源 j の向きの差分の間で一定と置く(閉じた式の近似 —— 数値の差分 `complementDiff` と場面で照らす)。背景軸引きずり ω_bg(銀河の中心の点・R_½ 4 kpc —— 第337便a の正本の値)。
// ■ 言わないこと: 2 つの読みのどちらが正しいかは決めない(見分けるのに要る精度の桁まで)。フォボスの軌道の縮みが回転引きずりで出るとも、環の厚みの値を決めたとも書かない。
import { fShare, weight337, staticRate, selfRate, complementDiff } from './lib-w337a-supply.mjs';
import { sourceOf as sourceOf337i, rdOf, speedOf, profileUW, bandShape, effectOfSpec, ringRow, pointsOf, ringJudge, heightLawV, integrate, planetSys, planetRow, planetScaleRatios, DECL as DECL337I, LIT as LIT337I, kappaMRadius, nOf, periodOf, YR } from './lib-w337i-rotring.mjs';
import { fObsOf } from './lib-w333a-rotdiff.mjs';
import { LIT334A } from './lib-w334a-heightlaw.mjs';
import { frameOfElements } from './lib-w333c-mercury3d.mjs';

export const LIB_VERSION = 'w337j-spinorbit-lib-1';
const isFin = Number.isFinite;
const D2R = Math.PI / 180, AU = 1.495978707e11, G = 6.674e-11, MSUN = 1.98847e30, DAY = 86400, CY = 100 * 365.25 * DAY;
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const scl = (a, k) => [a[0] * k, a[1] * k, a[2] * k], add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (a) => { const n = nrm(a); return n > 0 ? scl(a, 1 / n) : [0, 0, 0]; };

/* ───────── 宣言(走らせた格子と判定の物差しの記録 —— 式の形の宣言ではない)───────── */
export const T2_ACTIONS = Object.freeze(['vel', 'push', 'damp', 'dampRig']);
export const T3_TYPES = Object.freeze(['bandWidth', 'domT1', 'zEqual']);
export const DECL = Object.freeze({
  alpha: 2,
  /** T1 の読みの主: 背景軸引きずりは第337便a の主(中心の点・R_½ 4 kpc —— 2 つの読みで同じ値)/ノブ: 今の並進の式の形の読みでは銀河 → 太陽の位置の項も同じ形で読む(第337便a の centerSelf)— 金星の釣り合いを解き直す */
  bgModes: Object.freeze(['shared', 'consistent']),
  /** 互いにロックした対(冥王星 – カロン)の相互の軸引きずり: 主は 0(原仮定者の補足(2026-11-12)—— 距離の変化による並進引きずり以外の相互の引きずりが消える)・比べる列は閉じた式のまま */
  lockedPair: 'zero',
  /** 見分けの物差し: 向き(2 つの読みの和の自転の向きへの成分の符号が違う)・率(受動の応答 ṡ ∝ (ω_ax − s) の 2 つの読みの比の差 |Δ|/|ω_ax − s| —— Γ は置かない)を観測の率の相対の不確かさと比べる */
  t1: Object.freeze({ wMain: 'balance' }),
  /** T2: 作用の型(第337便i の vel・push・damp + 本枝の dampRig)・高さの型(第337便i の帯 slice・帯 + 尾 lor4・球 ball)・R_d の読み(主 R_eq)・速さ(主 s)・剛体の場の角速度の比 χ・源の外の落ち方のべき q(R_obs を基準)・受け手の大きさのべき p(1 m を基準) */
  t2: Object.freeze({ actions: T2_ACTIONS, profiles: Object.freeze(['slice', 'lor4', 'ball']), reading: 'Req', speed: 'obs', chi: Object.freeze([0.5, 1]), qFall: Object.freeze([0, 2, 3, 6]), pSize: Object.freeze([0, 0.5, 1, 1.5, 2]),
    /** 環の物差し(第337便i と同じ —— 1e7 年の間 |Δ ln a| ≤ 1e-5・定常の |δΩ/Ω| ≤ 1e-5)・環の点の高さの振れ */
    ringTol: Object.freeze({ tYr: 1e7, kepler: 1e-5, drift: 1e-5 }), ringZ: 10,
    /** 衛星の物差し: 観測の半長軸の率の大きさを超えない(|予測 ÷ 観測| ≤ 1)—— 担う λ は予測 = 観測 */
    satTol: 1 }),
  /** T3: 一様厚みの型の候補の格子(帯の幅の R_d の読み 5・源の取り分で重みを付けた T1 の W₀ の読み 2・等しい高さの T3 の係数) */
  t3: Object.freeze({ widthReadings: Object.freeze(['Yk', 'Req', 'Req1', 'flat1', 'flat2']), zEq: Object.freeze({ A: 1, ell: 4, beta: 1 }), zRef: 0.5 }),
  /** 代表の時間積分(RK4 —— フォボスの型の受け手・dampRig) */
  integ: Object.freeze({ steps: Object.freeze([2000, 4000]), nOrb: 20 }),
});

/* ───────── 文献の値(本環境では未照合 —— 出典の名と確かさ)───────── */
export const LIT = Object.freeze({
  note: '文献の値・未照合(この環境から一次資料のサイトに届かない —— 出典の名と値は記憶とリポジトリの中の値の写し)',
  /** 太陽のまわりの半長軸 [AU](NASA NSSDC の Planetary Fact Sheet —— 確かさ 高) */
  aAU: Object.freeze({ earth: 1.00000, mars: 1.52366, jupiter: 5.20336, saturn: 9.53707, uranus: 19.1913, neptune: 30.0690, pluto: 39.4817 }),
  /** 黄道に対する軌道の傾きと昇交点の経度 [deg](NASA NSSDC —— 確かさ 高) */
  orbitEl: Object.freeze({ earth: Object.freeze([0.00005, -11.26]), mars: Object.freeze([1.850, 49.56]), jupiter: Object.freeze([1.303, 100.46]), saturn: Object.freeze([2.485, 113.67]), uranus: Object.freeze([0.773, 74.01]), neptune: Object.freeze([1.770, 131.78]), pluto: Object.freeze([17.16, 110.30]) }),
  aSrc: 'NASA NSSDC の Planetary Fact Sheet の半長軸(冥王星は Pluto Fact Sheet)—— 文献の値・未照合・確かさ 高',
  pluto: Object.freeze({ m: 1.303e22, R: 1188.3e3, P: -6.3872 * DAY, poleRA: 132.993, poleDec: -6.163, iDeg: 17.16, nodeDeg: 110.30,
    src: 'NASA NSSDC の Pluto Fact Sheet(質量・半径・自転 6.3872 d 逆行)・自転の極は Archinal et al. 2018 Celest. Mech. Dyn. Astron. 130, 22(右手の向きの極 α 132.993°・δ −6.163°)・軌道 i 17.16°・Ω 110.30° —— 文献の値・未照合・確かさ 中' }),
  charon: Object.freeze({ m: 1.586e21, a: 19596e3, src: 'Brozović et al. 2015 Icarus 246, 317(カロンの質量・半長軸 19 596 km の桁)—— 文献の値・未照合・確かさ 中' }),
  moonsEarthMars: Object.freeze({ moon: Object.freeze({ a: 3.844e8 }), phobos: Object.freeze({ m: 1.0659e16, a: 9376e3 }), deimos: Object.freeze({ m: 1.4762e15, a: 23463e3 }),
    src: 'NASA NSSDC の衛星の表(月の半長軸・フォボスとダイモスの質量と半長軸)—— 文献の値・未照合・確かさ 高' }),
  /** 観測の自転の変化の率 */
  spinRates: Object.freeze({
    earth: Object.freeze({ lodMsPerCy: 1.78, src: 'Stephenson, Morrison & Hohenkerk 2016 Proc. R. Soc. A 472, 20160404(一日の長さの伸び +1.78 ms/世紀 —— 第337便a の LIT337A と同じ値)—— 文献の値・未照合・確かさ 中', relUnc: 0.03 }),
    mars: Object.freeze({ masPerYr2: 4, relUnc: 0.25, src: 'Le Maistre et al. 2023 Nature 619, 733(InSight の RISE —— 自転の角の加速 +4 ± 1 mas/年²)—— 文献の値・未照合・確かさ 中' }),
    pluto: Object.freeze({ src: '自転の変化の率の測定は記録に無い(カロンと互いにロック —— 自転 = カロンの公転)' }),
  }),
  /** コンパクト天体(内蔵の本 📟 psrDoubleABInertial3d の質量と観測の自転 obsSpin の写し + 文献の値) */
  compact: Object.freeze([
    Object.freeze({ key: 'j0737a', name: 'J0737−3039A(パルサー)', m: 1.338185 * MSUN, R: 11750, P: 1 / 44.054068642001, Pdot: 1.76e-18, comp: 'j0737b', tiltDeg: 0, tiltRange: Object.freeze([0, 3.2]), Pb: 8834.53472328,
      src: '内蔵の本 📟 の obsSpin(ν = 44.054 Hz・軸は軌道の法線から 0〜3.2° のノブ)・質量は Kramer et al. 2006 Science 314, 97(1.3381 M☉)・Ṗ 1.76e-18(同)—— 文献の値・未照合・確かさ 中' }),
    Object.freeze({ key: 'j0737b', name: 'J0737−3039B(パルサー)', m: 1.248868 * MSUN, R: 11750, P: 2.77346074724, Pdot: 0.88e-15, comp: 'j0737a', tiltDeg: 40.6, tiltAlt: 139.4, Pb: 8834.53472328,
      src: '内蔵の本 📟 の obsSpin(ν = 0.3606 Hz・軸の傾き 40.6° —— 本の注「δ_B = 180° − θ の書き方の値」で、軌道の法線からの角が 139.4° の読みもある)・質量と Ṗ 0.88e-15 は Kramer et al. 2006 —— 文献の値・未照合・確かさ 中(軸の向きの書き方は未照合)' }),
    Object.freeze({ key: 'b1913', name: 'B1913+16(パルサー)', m: 1.4398 * MSUN, R: 11750, P: 0.059030, Pdot: 8.6183e-18, comp: 'b1913c', tiltDeg: 21, Pb: 27906.98,
      src: 'Weisberg & Huang 2016 ApJ 829, 55(P 59.03 ms・Ṗ 8.62e-18・Pb 7.752 h・質量 1.4398/1.3886 M☉)・軸の傾き約 21°(Kramer 1998 ApJ 501, 270 の 22 ± 8° の桁)—— 文献の値・未照合・確かさ 中(伴星の自転は未知 —— 0 のノブ)' }),
    Object.freeze({ key: 'crab', name: 'かに星雲のパルサー(単独)', m: 1.4 * MSUN, R: 11750, P: 0.033392, Pdot: 4.21e-13, comp: null, tiltDeg: null,
      src: 'Lyne et al. 1993 MNRAS 265, 1003(P 33.39 ms・Ṗ 4.21e-13)—— 文献の値・未照合・確かさ 中(質量 1.4 M☉ は宣言・軸の銀河に対する向きは未知)' }),
  ]),
  compactPartner: Object.freeze({ b1913c: Object.freeze({ m: 1.3886 * MSUN, s: 0, note: '伴星の自転は未知 —— 0 と置く(ノブ)' }) }),
  /** T2 の受け手(源のまわりの円に近い軌道 —— 半長軸・源の赤道面に対する傾き・半径) */
  t2Receivers: Object.freeze([
    Object.freeze({ key: 'ringD', name: '土星 D 環の粒子', host: 'saturn', a: 70705e3, iDeg: null, R: 1 }),
    Object.freeze({ key: 'ringC', name: '土星 C 環の粒子', host: 'saturn', a: 83329e3, iDeg: null, R: 1 }),
    Object.freeze({ key: 'ringB', name: '土星 B 環の粒子', host: 'saturn', a: 104790e3, iDeg: null, R: 1 }),
    Object.freeze({ key: 'ringA', name: '土星 A 環の粒子', host: 'saturn', a: 129472.5e3, iDeg: null, R: 1 }),
    Object.freeze({ key: 'ringF', name: '土星 F 環の粒子', host: 'saturn', a: 140180e3, iDeg: null, R: 1 }),
    Object.freeze({ key: 'phobos', name: 'フォボス', host: 'mars', a: 9376e3, iDeg: 1.093, R: 11.08e3 }),
    Object.freeze({ key: 'metis', name: 'メティス', host: 'jupiter', a: 128000e3, iDeg: 0.06, R: 21.5e3 }),
    Object.freeze({ key: 'adrastea', name: 'アドラステア', host: 'jupiter', a: 129000e3, iDeg: 0.03, R: 8.2e3 }),
    Object.freeze({ key: 'pan', name: 'パン', host: 'saturn', a: 133584e3, iDeg: 0.0001, R: 14.1e3 }),
    Object.freeze({ key: 'deimos', name: 'ダイモス', host: 'mars', a: 23463e3, iDeg: 0.93, R: 6.2e3 }),
    Object.freeze({ key: 'moon', name: '月', host: 'earth', a: 3.844e8, iDeg: 23.4, R: 1737.4e3 }),
    Object.freeze({ key: 'io', name: 'イオ', host: 'jupiter', a: 421700e3, iDeg: 0.05, R: 1821.6e3 }),
    Object.freeze({ key: 'europa', name: 'エウロパ', host: 'jupiter', a: 671034e3, iDeg: 0.47, R: 1560.8e3 }),
    Object.freeze({ key: 'ganymede', name: 'ガニメデ', host: 'jupiter', a: 1070412e3, iDeg: 0.20, R: 2634.1e3 }),
    Object.freeze({ key: 'callisto', name: 'カリスト', host: 'jupiter', a: 1882709e3, iDeg: 0.19, R: 2410.3e3 }),
    Object.freeze({ key: 'titan', name: 'タイタン', host: 'saturn', a: 1221870e3, iDeg: 0.3485, R: 2574.7e3 }),
    Object.freeze({ key: 'triton', name: 'トリトン(逆行)', host: 'neptune', a: 354759e3, iDeg: 156.885, R: 1353.4e3 }),
  ]),
  t2ReceiversSrc: '環の半径は第337便i の LIT(D 環の中央 70 705 km・F 環 140 180 km)・衛星の半長軸と傾きは第332便a の LIT.moons(JPL の平均の要素)と NASA NSSDC の衛星の表 —— 月の傾きは地球の赤道面に対する 18.3°〜28.6° の中央 23.4° の宣言・ダイモスは 0.93° —— 文献の値・未照合・確かさ 中',
  /** 観測の公転の変化(半長軸の率 ȧ/a [1/年]) */
  orbitObs: Object.freeze({
    phobos: Object.freeze({ ndotDegYr2: 1.27e-3, adotMcy: -1.8, src: 'Jacobson 2010 AJ 139, 668(フォボスの経度の永年の加速 1.27e-3 °/年² —— t² の係数か ṅ かの慣行は未照合・本枝は ṅ と読み、ȧ ≈ −1.8 m/世紀の桁と整合する方を採る)—— 文献の値・未照合・確かさ 中' }),
    moon: Object.freeze({ adotCmYr: 3.83, src: 'Williams & Boggs 2016 Celest. Mech. Dyn. Astron. 126, 89(月の後退 +3.83 cm/年 —— 月のレーザー測距)—— 文献の値・未照合・確かさ 高' }),
    titan: Object.freeze({ adotCmYr: 11.3, src: 'Lainey et al. 2020 Nature Astronomy 4, 1053(タイタンの外への移動 約 11 cm/年)—— 文献の値・未照合・確かさ 中' }),
    triton: Object.freeze({ tauYr: 3.6e9, src: 'Chyba, Jankowski & Nicholson 1989 A&A 219, L23(ロッシュ限界までの時間 約 3.6e9 年の見積り —— ȧ/a ≈ −1/τ の桁で読む)—— 文献の値・未照合・確かさ 低(桁)' }),
    none: '記録に無い(未収載)',
  }),
  /** 環の厚み(第332便a の LIT.rings の写し —— 土星は典型 約 10 m・木星の主環 < 30 km・天王星の ε 環 < 150 m の桁) */
  ringThickness: Object.freeze([
    Object.freeze({ host: 'saturn', name: '土星の主な環', H: 10, kind: '典型', src: 'Cuzzi et al. 2010 Science 327, 1470・Esposito 2002(局所の鉛直の厚み 約 10 m の桁 —— 環ごとの値ではない)' }),
    Object.freeze({ host: 'jupiter', name: '木星の主環', H: 30000, kind: '上限', src: 'Ockert-Bell et al. 1999 Icarus 138, 188(< 30 km)' }),
    Object.freeze({ host: 'uranus', name: '天王星の ε 環', H: 150, kind: '上限', src: 'Lane et al. 1986 Science 233, 65(約 150 m 以下の桁・要確認)' }),
  ]),
  /** 一様厚みの提案の表(統括の参考の試作 —— 第333〜335便の頃に参考にした試作の型を、今のコードで読み直した。式・ノブ・判定の物差し) */
  proposals: Object.freeze([
    Object.freeze({ key: 'P1', type: '厚みは釣り合いで決まる(加熱・冷却・重力の復元・衝突)', formula: '厚みの予測には釣り合いか宣言した有効の応答が要る', knobs: '加熱と冷却の率', judge: '環ごとの局所の厚み(10 m を独立の観測として数えない)', vsI: '新しい(第337便i は相対の厚みのべきだけ)', taken: 'zEqual(釣り合いの高さが出る型の 1 つとして)' }),
    Object.freeze({ key: 'P2', type: '比べる用のスカラー則(z/r と 1/(1 + (|z|/H)^ℓ))', formula: 'V = β A Ω ρ (z/r)/(1 + (|z|/H)^ℓ)', knobs: 'β・A・H・ℓ', judge: '小さい z で V/z ≈ β A Ω', vsI: '重なる(第337便i の T3)', taken: '— (第337便i の T3 で読む)' }),
    Object.freeze({ key: 'P3', type: '鉛直の速度は z の奇関数・鉛直へ寄せるだけでは平衡の厚みは決まらない(復元 ν_z² z と速度の散らばり —— H ~ σ_z/ν_z)', formula: 'U_z = −a z・a_z = −ν_z² z・H ~ σ_z/ν_z', knobs: 'a・σ_z', judge: '厚みの絶対値は σ_z の宣言に依る', vsI: '一部重なる(第337便i の厚みのべき M1・M2)', taken: 'zEqual(場の鉛直の速さ V(z) と重力の鉛直の振動の速さ ν_z z が等しい高さ)' }),
    Object.freeze({ key: 'P4', type: '源の重力が支配的な範囲で z に比例(z/r × Ω_d r)—— 源の取り分で重み付け・z/√(r² + z²) で飽和', formula: 'v = β(r) Ω_d z・β = W_src/(W_src + W₀ + W_他)', knobs: 'W₀・α・扁平で割る次数 k', judge: '土星の環と銀河の円盤の鉛直の形', vsI: '新しい(源の取り分 β を掛ける —— 一様さの端が出る)', taken: 'domT1' }),
    Object.freeze({ key: 'P5', type: '扁平率で文字どおり割る赤道の引きずり半径(R_d/f^k)', formula: 'R_d,eq = R_d/f_flat^k(k = 1・2)と軸比 R_d/(1 − f)^k', knobs: '次数 k', judge: '土星の 2 R_d,eq と典型の厚み 10 m', vsI: '一部重なる(第337便i は軸比の次数 q)', taken: 'bandWidth の R_d の読み flat1・flat2' }),
    Object.freeze({ key: 'P7', type: '円盤の有限の厚みの鍵(高さの分布 gauss の尺度 h が半径に依らない —— 一様な厚みの初期配置)', formula: 'z ~ gauss(h)・v_z は局所の ν で', knobs: 'h・切り捨ての倍', judge: '銀河の円盤の本の外縁の速度の比', vsI: '新しい(第337便i は銀河の円盤を読んでいない)', taken: '見通しの 1 行(銀河の円盤への持ち出し —— 本枝では計算しない)' }),
    Object.freeze({ key: 'P6', type: '帯の幅そのものを厚みと読む(土星の 2 R_d ÷ 厚み ≈ 1.001)', formula: 'H = 2 R_d', knobs: 'R_d の読み', judge: '環ごとの局所の厚み(木星・天王星・海王星とは 2〜5 桁離れる)', vsI: '新しい(第337便i は帯を場の形にだけ使う)', taken: 'bandWidth' }),
  ]),
  proposalsSrc: '統括の参考の試作(第333便〜第335便の頃 —— 環の厚み・一様な厚み・高さ則に触れた節を読み直した)。式と判定の物差しは今のコードで書き直した',
});

/* ───────── T1 軸引きずりの 2 つの読み ───────── */
/** 1 つの源の 2 つの読み(赤道面の閉じた式): 背景が静止 ω_st・今の並進の式の形 ω_se・差(閉じた式 −α f (1 − f) n) */
export function axialTwo({ s, n, f, alpha = DECL.alpha }) {
  if (![s, n, f, alpha].every(isFin) || f < 0 || f > 1) throw new RangeError('axialTwo: 有限・0 ≤ f ≤ 1');
  const st = staticRate({ s, f, alpha }), se = selfRate({ s, n, f, alpha });
  return { st, se, diff: st - se, diffClosed: -alpha * f * (1 - f) * n };
}
/** 源の取り分(源の重みの和 + W₀ で割る) */
export function sharesOf(ws, W0) {
  if (!Array.isArray(ws) || !ws.every((w) => isFin(w) && w >= 0) || !(isFin(W0) && W0 >= 0)) throw new RangeError('sharesOf: 重み ≥ 0');
  const tot = ws.reduce((a, b) => a + b, 0) + W0;
  return { f: ws.map((w) => w / tot), fBg: W0 / tot };
}
/** 金星の釣り合いを解く: G(f) = (1 − f) ω_bg (L̂·n̂) + T(f) (ŝ☉·n̂) = 0(T は読みの太陽の項)→ f・W₀(第337便a の partBackground の solve と同じ型) */
export function solveVenus({ reading, wbg, galN, sunN, sSun, nV, mSun, rV, alpha = DECL.alpha }) {
  const T = reading === 'st' ? (f) => staticRate({ s: sSun, f, alpha }) : (f) => selfRate({ s: sSun, n: nV, f, alpha });
  const Gf = (f) => (1 - f) * wbg * galN + T(f) * sunN, roots = [];
  for (let i = 1; i < 999; i++) { let a = i / 1000, b = (i + 1) / 1000; if (Math.sign(Gf(a)) !== Math.sign(Gf(b))) { for (let it = 0; it < 80; it++) { const m = (a + b) / 2; if (Math.sign(Gf(m)) === Math.sign(Gf(a))) a = m; else b = m; } roots.push((a + b) / 2); } }
  if (!roots.length) return { reading, roots, f: null, W0: null };
  const f = roots.reduce((a, b) => (Math.abs(b - 0.5) < Math.abs(a - 0.5) ? b : a)), wV = weight337(mSun, rV, alpha, AU);
  return { reading, roots, f, W0: wV * (1 - f) / f, rHalfAU: (rV / AU) * Math.pow(f / (1 - f), 1 / alpha) };
}
/** 今の並進の式の形の読みの金星の釣り合いの根 f から金星の公転の角速度 n_V を逆に解く(第337便a の正本は n_V を持たない —— 根と同じ式から) */
export function nVenusFromRoot({ f, wbg, galN, sunN, sSun, alpha = DECL.alpha }) {
  const X = -(1 - f) * wbg * galN / sunN;           // = selfRate
  return sSun - (sSun - X / f) / (alpha * (1 - f));
}
/** 天体の行: srcs = [{ key, m, r, s, sHat, n, locked }]・W₀・背景軸引きずり ω_bg(読みごと)・L̂・受け手の観測の自転 sObs と向き sHatObs →
 *   源ごとの f と 2 つの読み・和のベクトル・自転の向きへの成分・観測の自転との比・向きで見分けられるか・率で見分けるのに要る精度 */
export function bodyAxial({ srcs, W0, wbg, Lhat, sObs, sHatObs, alpha = DECL.alpha, lockedMode = DECL.lockedPair }) {
  if (!(W0 >= 0) || !Array.isArray(srcs) || !(sObs > 0)) throw new RangeError('bodyAxial: W₀ ≥ 0・sObs > 0');
  const ws = srcs.map((q) => weight337(q.m, q.r, alpha, AU)), sh = sharesOf(ws, W0);
  const per = srcs.map((q, k) => { const two = axialTwo({ s: q.s, n: q.n, f: sh.f[k], alpha }), zero = q.locked && lockedMode === 'zero';
    return { key: q.key, w: ws[k], f: sh.f[k], st: zero ? 0 : two.st, se: zero ? 0 : two.se, stNaive: two.st, seNaive: two.se, diff: zero ? 0 : two.diff, diffClosed: zero ? 0 : two.diffClosed, locked: !!q.locked,
      vSt: scl(q.sHat, zero ? 0 : two.st), vSe: scl(q.sHat, zero ? 0 : two.se) }; });
  const bgSt = scl(Lhat, sh.fBg * wbg.st), bgSe = scl(Lhat, sh.fBg * wbg.se);
  const tSt = per.reduce((a, q) => add(a, q.vSt), bgSt), tSe = per.reduce((a, q) => add(a, q.vSe), bgSe), u = unit(sHatObs);
  const pSt = dot(tSt, u), pSe = dot(tSe, u), d = pSt - pSe;
  return { per: per.map(({ vSt, vSe, ...r }) => r), fBg: sh.fBg, bgSt: sh.fBg * wbg.st, bgSe: sh.fBg * wbg.se, totSt: tSt, totSe: tSe, magSt: nrm(tSt), magSe: nrm(tSe), projSt: pSt, projSe: pSe,
    agreeSt: pSt > 0, agreeSe: pSe > 0, ratioSt: pSt / sObs, ratioSe: pSe / sObs, diffProj: d, dirDistinct: Math.sign(pSt) * Math.sign(pSe) < 0,
    /** 受動の応答の向き(ω_ax − s の符号 —— 正なら自転を速める)と 2 つの読みの率の相対の差 */
    pushSt: Math.sign(pSt - sObs), pushSe: Math.sign(pSe - sObs), rateRelDiff: Math.abs(d) / Math.abs(pSt - sObs) };
}
/** 2 倍角の則(原仮定者の指示(2026-10-18 —— 第101報・第103報)「源の軸回転が、軸方向に対する角度差の、２倍の角度差で傾いた軸で作用する」—— 仰角 45° で 90° 傾いた回転・赤道面で逆回転・軸方向で順回転):
 *  源の軸 ŝ と受け手への向き û の角 θ → 作用の軸 â = cos 2θ ŝ + sin 2θ ê(ê = û の ŝ に垂直な成分の向き)。円の軌道(法線 ŵ)の上で平均した â と受け手の自転の向き ŝ_r の内積・仰角の最大 */
export function twoAngleMean({ sSrc, wOrb, sRecv, nPts = 720 }) {
  const s = unit(sSrc), w = unit(wOrb), u0 = unit(sub(s, scl(w, dot(s, w)))), e1 = nrm(u0) > 1e-12 ? u0 : unit(crs(w, [1, 0, 0])), e2 = crs(w, e1);
  let pr = 0, ax = 0;
  for (let k = 0; k < nPts; k++) { const ph = 2 * Math.PI * (k + 0.5) / nPts, u = add(scl(e1, Math.cos(ph)), scl(e2, Math.sin(ph))), c = Math.max(-1, Math.min(1, dot(u, s))), th = Math.acos(c);
    const ep = sub(u, scl(s, c)), en = nrm(ep) > 1e-15 ? scl(ep, 1 / nrm(ep)) : [0, 0, 0], a = add(scl(s, Math.cos(2 * th)), scl(en, Math.sin(2 * th)));
    pr += dot(a, unit(sRecv)) / nPts; ax += dot(a, s) / nPts; }
  return { proj: pr, axisComp: ax, elevMaxDeg: Math.acos(Math.min(1, Math.abs(dot(s, w)))) * 180 / Math.PI };
}
/** 2 つのベクトルの角 [deg](原仮定者の指示(2026-10-30 —— 第121報)「逆向き回転でも６０°以上違えば減速しない」の読みに使う) */
export const angleDeg = (a, b) => (nrm(a) > 0 && nrm(b) > 0 ? Math.acos(Math.max(-1, Math.min(1, dot(a, b) / (nrm(a) * nrm(b))))) * 180 / Math.PI : null);
/** 赤道座標の極(RA・Dec)→ 黄道 J2000 の単位ベクトル(ε = 23.4392911°) */
export function eclOfRaDec(raDeg, decDeg) {
  const a = raDeg * D2R, d = decDeg * D2R, e = 23.4392911 * D2R, x = Math.cos(d) * Math.cos(a), y = Math.cos(d) * Math.sin(a), z = Math.sin(d);
  return [x, y * Math.cos(e) + z * Math.sin(e), -y * Math.sin(e) + z * Math.cos(e)];
}
/** 軌道の法線(黄道座標 —— i・Ω) */
export const orbitNormal = (iDeg, nodeDeg) => [Math.sin(iDeg * D2R) * Math.sin(nodeDeg * D2R), -Math.sin(iDeg * D2R) * Math.cos(nodeDeg * D2R), Math.cos(iDeg * D2R)];
/** 観測の自転の変化の率 ṡ/s [1/s]: 一日の長さ(ms/世紀)・角の加速(mas/年²)・パルサーの Ṗ */
export const sdotOverS = { lod: (msPerCy, P) => -(msPerCy * 1e-3 / CY) / P, mas: (masYr2, s) => (masYr2 * 1e-3 * Math.PI / (180 * 3600)) / ((365.25 * DAY) ** 2) / s, pdot: (Pdot, P) => -Pdot / P };
/** 円の二体の相対の半長軸(ケプラー) */
export const aKepler = (M, Pb) => Math.cbrt(G * M * Pb * Pb / (4 * Math.PI * Math.PI));

/* ───────── T2 回転引きずりの方位の作用と公転の速さ ───────── */
/** 源(地球・火星・木星・土星・海王星 —— 第334便a の LIT334A の値・自転軸 ẑ) */
export function sourceOf(key) {
  if (key === 'saturn' || key === 'mars' || key === 'jupiter') return sourceOf337i(key);
  const B = LIT334A.bodies.find((b) => b.key === key);
  if (!B || !['earth', 'neptune'].includes(key)) throw new RangeError('sourceOf: 源 ' + key);
  return { key, ja: B.name, m: B.m, Robs: B.R, s: 2 * Math.PI / (B.P * 3600), fFlat: B.f, fObs: fObsOf(B.moi), axis: [0, 0, 1] };
}
/** 受け手の系(源の赤道面 = xy・傾き i・離心率は小さい値 —— 逆行は i > 90°) */
export function recvSys(src, { a, iDeg, e = 1e-4, omegaDeg = 40, nodeDeg = 0 }) {
  if (!(a > 0) || !(iDeg > 0 && iDeg < 180)) throw new RangeError('recvSys: a > 0・0 < i < 180');
  const fr = frameOfElements({ I: iDeg, Om: nodeDeg, varpi: nodeDeg + omegaDeg });
  return { key: 'recv', orb: { a, e, mu: G * src.m, P: fr.P, Q: fr.Q, W: fr.W }, sunAxis: src.axis, M: src.m, m: 0, R: 1, sSun: src.s, Rsun: src.Robs, iRad: iDeg * D2R, zMax: a * Math.sin(iDeg * D2R) };
}
/** 同期の半径 r_sync = (G m/s²)^{1/3}・n/s */
export const rSyncOf = (src) => Math.cbrt(G * src.m / (src.s * src.s));
export const nOverS = (src, a) => Math.sqrt(G * src.m / a ** 3) / src.s;
/** 本枝の型: 剛体の場に対する相対の速度 a = −λ|s| g S (w − χ s_* k̂ × p)(S = 第337便i の帯の形・g = 源の外の落ち方 (R_obs/ρ)^q × 受け手の大きさ (R_recv/1 m)^p) */
export function dampRigEffect(src, { prof, reading = DECL.t2.reading, speed = DECL.t2.speed, chi = 1, qFall = 0, pSize = 0, Rrecv = 1, lambda = 1 }) {
  if (!isFin(chi) || !isFin(qFall) || !isFin(pSize) || !(Rrecv > 0) || !isFin(lambda)) throw new RangeError('dampRigEffect: 宣言');
  const k = unit(src.axis), Rd = rdOf(src, reading), sp = speedOf(src, speed, Rd), RK1 = kappaMRadius(src.m), sAbs = Math.abs(src.s), size = Math.pow(Rrecv, pSize);
  return { kind: 'acc', a: (st) => { const z = dot(st.x, k), rv = sub(st.x, scl(k, z)), rho = nrm(rv), S = bandShape(prof, rho, z, Rd, RK1), g = Math.pow(src.Robs / rho, qFall) * size;
    return scl(sub(st.v, scl(crs(k, st.x), chi * sp)), -lambda * sAbs * S * g); }, meta: { Rd, sp } };
}
/** 作用の型 → 効果(vel・push・damp は第337便i の effectOfSpec —— 受け手の大きさと落ち方のノブは dampRig だけ) */
export function t2Effect(src, spec) {
  if (spec.action === 'dampRig') return dampRigEffect(src, spec);
  if (!['vel', 'push', 'damp'].includes(spec.action)) throw new RangeError('t2Effect: 作用 ' + spec.action);
  return effectOfSpec(src, { prof: spec.prof, action: spec.action, reading: spec.reading || DECL.t2.reading, speed: spec.speed || DECL.t2.speed, lambda: spec.lambda === undefined ? 1 : spec.lambda });
}
/** 円の赤道の軌道の閉じた式(単位の λ —— 小さい傾き・小さい離心率の極限): d ln a/dt と定常の公転のずれ δΩ/Ω(作用の型ごと) */
export function t2Closed(src, spec, a) {
  const n = Math.sqrt(G * src.m / a ** 3), Rd = rdOf(src, spec.reading || DECL.t2.reading), sp = speedOf(src, spec.speed || DECL.t2.speed, Rd), U = profileUW(spec.prof, a, 0, Rd, sp, kappaMRadius(src.m)).U, sAbs = Math.abs(src.s);
  if (spec.action === 'vel') return { dlnA: 0, dOm: U / (n * a) };
  if (spec.action === 'push') return { dlnA: 2 * sAbs * U / (n * a), dOm: 0 };
  if (spec.action === 'damp') return { dlnA: -2 * sAbs * (1 - U / (n * a)), dOm: 0 };
  const g = Math.pow(src.Robs / a, spec.qFall || 0) * Math.pow(spec.Rrecv || 1, spec.pSize || 0);
  return { dlnA: -2 * sAbs * g * (1 - (spec.chi === undefined ? 1 : spec.chi) * sp / n), dOm: 0 };
}
/** 符号が変わる n/s(円の赤道の順行の軌道 —— 型ごと): vel・push は無し・damp は場の角速度 U/a = n の点(帯の型では n/s = (r_sync/R_d)^6 の桁 —— 数で解く)・dampRig は n/s = χ × (s_* ÷ s) */
export function signBoundary(src, spec) {
  if (spec.action === 'vel' || spec.action === 'push') return null;
  const Rd = rdOf(src, spec.reading || DECL.t2.reading), sp = speedOf(src, spec.speed || DECL.t2.speed, Rd);
  if (spec.action === 'dampRig') return (spec.chi === undefined ? 1 : spec.chi) * sp / src.s;
  // damp: U(a, 0)/a = n(a) を a について解く(log の二分)
  const RK1 = kappaMRadius(src.m), F = (a) => Math.log(profileUW(spec.prof, a, 0, Rd, sp, RK1).U / a) - Math.log(Math.sqrt(G * src.m / a ** 3));
  let lo = 1e-30, hi = 1e30; if (Math.sign(F(lo)) === Math.sign(F(hi))) return null;
  for (let it = 0; it < 300; it++) { const m = Math.sqrt(lo * hi); if (Math.sign(F(m)) === Math.sign(F(lo))) lo = m; else hi = m; }
  return nOverS(src, Math.sqrt(lo * hi));
}
/** 観測の半長軸の率 ȧ/a [1/s](フォボス: ṅ から −(2/3) ṅ/n・月とタイタン: ȧ ÷ a・トリトン: −1/τ) */
export function obsDlnA(key, a, n) {
  const O = LIT.orbitObs, yr = 365.25 * DAY;
  if (key === 'phobos') { const nd = O.phobos.ndotDegYr2 * D2R / (yr * yr); return -(2 / 3) * nd / n; }
  if (key === 'moon') return (O.moon.adotCmYr * 1e-2 / yr) / a;
  if (key === 'titan') return (O.titan.adotCmYr * 1e-2 / yr) / a;
  if (key === 'triton') return -1 / (O.triton.tauYr * yr);
  return null;
}

/* ───────── T3 一様厚みの型の候補 ───────── */
/** 帯の幅をそのまま厚みと読む(H = 2 R_d —— R_d の読み: Yk・Req〔軸比 q = 1/3〕・Req1〔軸比 q = 1〕・flat1・flat2〔扁平率で文字どおり割る k = 1・2〕) */
export function bandWidthH(src, reading) {
  const Rk = kappaMRadius(src.m), f = src.fFlat;
  if (reading === 'Yk') return 2 * Rk;
  if (reading === 'Req') return 2 * rdOf(src, 'Req');
  if (reading === 'Req1') return 2 * Rk / (1 - f);
  if (reading === 'flat1' || reading === 'flat2') return f > 0 ? 2 * Rk / Math.pow(f, reading === 'flat1' ? 1 : 2) : null;
  throw new RangeError('bandWidthH: 読み ' + reading);
}
/** 源の取り分で重みを付けた T1: V = β(p) s_* z・β = w_src/(w_src + W₀ + w_他)(他の源は受け手の位置で一定) */
export function domBeta({ mSrc, r, W0, wOther = 0, alpha = DECL.alpha }) {
  const w = weight337(mSrc, r, alpha, AU); return w / (w + W0 + wOther);
}
export function domT1Effect(src, { W0, wOther = 0, reading = DECL.t2.reading, speed = 'obs', lambda = 1 }) {
  const k = unit(src.axis), Rd = rdOf(src, reading), sp = speedOf(src, speed, Rd);
  return { kind: 'vel', d: (x) => { const z = dot(x, k), b = domBeta({ mSrc: src.m, r: nrm(x), W0, wOther }); return scl(k, -lambda * b * sp * z); }, meta: { Rd, sp } };
}
/** β が ½ になる半径(一様さの端 —— w_src = W₀ + w_他) */
export const domHalfRadius = ({ mSrc, W0, wOther = 0, alpha = DECL.alpha }) => AU * Math.pow((mSrc / (AU * AU)) / (W0 + wOther), 1 / alpha);
/** 場の鉛直の速さと重力の鉛直の振動の速さが等しい高さ: T3 の V(z) = β A s_* ρ (z/r)/(1 + (|z|/H)^ℓ)(H = R_d)について V(z)/z = ν_z(ν_z² = G m/r³ —— 赤道面の近く)を z で解く
 *   → z* = H (β A s_* ÷ ν_z − 1)^{1/ℓ}(β A s_* > ν_z のときだけ —— それ以外は「等しい高さ無し」) */
export function zEqualHeight(src, { r, reading = DECL.t2.reading, speed = 'obs', beta = DECL.t3.zEq.beta, A = DECL.t3.zEq.A, ell = DECL.t3.zEq.ell }) {
  const Rd = rdOf(src, reading), sp = speedOf(src, speed, Rd), nuZ = Math.sqrt(G * src.m / r ** 3), x = beta * A * Math.abs(sp) / nuZ;
  return { Rd, sp, nuZ, ratio: x, zStar: x > 1 ? Rd * Math.pow(x - 1, 1 / ell) : null, numeric: x > 1 ? zEqualNumeric(r, Rd, sp, nuZ, { beta, A, ell }) : null };
}
/** 同じ高さを数で(heightLawV の T3 を呼ぶ —— β = 1・A = 1・ℓ = 4 の宣言のときだけ照らせる) */
function zEqualNumeric(r, Rd, sp, nuZ, { beta, A, ell }) {
  if (!(beta === 1 && A === 1 && ell === 4)) return null;
  const F = (z) => heightLawV('T3', r, z, Rd, sp) / z - nuZ; let lo = 1e-6 * Rd, hi = 1e6 * Rd;
  if (Math.sign(F(lo)) === Math.sign(F(hi))) return null;
  for (let it = 0; it < 200; it++) { const m = Math.sqrt(lo * hi); if (Math.sign(F(m)) === Math.sign(F(lo))) lo = m; else hi = m; }
  return Math.sqrt(lo * hi);
}

/* ───────── 純関数の場面と門 ───────── */
export function pureScenes() {
  const S = {};
  // ① 2 つの読みの差の閉じた式 −α f (1 − f) n・f = 1 と f = 0 で差 0・n = s で今の形は f s
  { let d = 0; for (const [s, n, f] of [[1, 0.3, 0.2], [2, -0.5, 0.7], [1e-5, 3e-6, 0.45], [3, 3, 0.9]]) { const q = axialTwo({ s, n, f }); d = Math.max(d, Math.abs(q.diff - q.diffClosed) / Math.max(Math.abs(q.diffClosed), 1e-300)); }
    const e0 = axialTwo({ s: 1, n: 0.4, f: 1 }), e1 = axialTwo({ s: 1, n: 0.4, f: 0 }), sync = axialTwo({ s: 1.3, n: 1.3, f: 0.37 });
    S.diff = { closed: d, f1: Math.abs(e0.diff), f0: Math.abs(e1.diff), sync: Math.abs(sync.se - 0.37 * 1.3) }; }
  // ② 閉じた式を数値の差分(第337便a の complementDiff —— 1 つの源・静止の補い/受け手自身の補い)で照らす
  { const src = { p: [0, 0, 0], v: [0, 0, 0], s: [0, 0, 1], m: 1 }, W0 = weight337(1, 1, 2, 1) * (0.6 / 0.4);   // r = 1 で f = 0.4
    const C = complementDiff({ at: [1, 0, 0], vRecv: [0, 0, 0], srcs: [src], W0, alpha: 2, rRef: 1, u: [-1, 0, 0], R: 1e-3 });
    const K = complementDiff({ at: [1, 0, 0], vRecv: [0, 0.35, 0], srcs: [src], K: W0, alpha: 2, rRef: 1, u: [-1, 0, 0], R: 1e-3 }), q = axialTwo({ s: 1, n: 0.35, f: 0.4 });
    S.numeric = { st: Math.abs(C.grad[2] - q.st), se: Math.abs(K.grad[2] - q.se) }; }
  // ③ 金星の釣り合いの解き方: 太陽の項と背景の項の和が 0・根からの n_V の逆解きが元に戻る
  { const P = { wbg: -1.1e-16, galN: -0.4971, sunN: 0.992, sSun: 2.865e-6, mSun: 1.9885e30, rV: 0.7233 * AU, alpha: 2 }, nV = 3.236e-7;
    const r1 = solveVenus({ ...P, reading: 'st', nV }), r2 = solveVenus({ ...P, reading: 'se', nV }), nBack = nVenusFromRoot({ f: r2.f, ...P });
    const res = (f, T) => Math.abs((1 - f) * P.wbg * P.galN + T * P.sunN);
    S.venus = { st: res(r1.f, staticRate({ s: P.sSun, f: r1.f, alpha: 2 })), se: res(r2.f, selfRate({ s: P.sSun, n: nV, f: r2.f, alpha: 2 })), nBack: Math.abs(nBack / nV - 1), fSt: r1.f }; }
  // ④ T2: dampRig は同期(n = χ s)の円の赤道の軌道で d ln a/dt = 0・λ = 0 で全部 0・閉じた式と数の一次の率が同じ(小さい i・小さい e)
  { const mars = sourceOf('mars'), rs = rSyncOf(mars), sys = recvSys(mars, { a: rs, iDeg: 1e-3, e: 1e-5 }), pts = pointsOf(sys, null);
    const sync = ringRow(sys, dampRigEffect(mars, { prof: 'ball', chi: 1, lambda: 1 }), pts), off = ringRow(sys, dampRigEffect(mars, { prof: 'ball', chi: 1, lambda: 0 }), pts);
    const rH = recvSys(mars, { a: 0.5 * rs, iDeg: 1e-3, e: 1e-5 }), ptsH = pointsOf(rH, null); let dc = 0;
    for (const sp of [{ action: 'dampRig', prof: 'ball', chi: 0.5 }, { action: 'dampRig', prof: 'ball', chi: 1 }, { action: 'push', prof: 'ball' }, { action: 'damp', prof: 'ball' }, { action: 'vel', prof: 'ball' }]) {
      const R = ringRow(rH, t2Effect(mars, { ...sp, lambda: 1 }), ptsH), C = t2Closed(mars, sp, 0.5 * rs), big = Math.max(Math.abs(C.dlnA), Math.abs(C.dOm) * 1e-300);
      if (sp.action === 'vel') dc = Math.max(dc, Math.abs(R.dOmOverOm - C.dOm) / Math.abs(C.dOm)); else dc = Math.max(dc, Math.abs(R.dlnA - C.dlnA) / big); }
    S.t2 = { sync: Math.abs(sync.dlnA) / (2 * Math.abs(mars.s)), zero: Math.max(...['dlnA', 'dlnI', 'dOmOverOm', 'apsW'].map((k) => Math.abs(off[k]))), closed: dc,
      bound: Math.abs(signBoundary(mars, { action: 'dampRig', prof: 'ball', chi: 0.5 }) - 0.5) }; }
  // ⑤ T3: 帯の幅の読み(Req ÷ Yk = (1 − f)^{−1/3})・β の ½ の半径で β = ½・等しい高さの閉じた式と数が同じ
  { const sat = sourceOf('saturn'), W0 = 1.7e8, wO = 1.5e3, rh = domHalfRadius({ mSrc: sat.m, W0, wOther: wO }), zE = zEqualHeight(sat, { r: 1.3e8 });
    S.t3 = { width: Math.abs(bandWidthH(sat, 'Req') / bandWidthH(sat, 'Yk') / Math.pow(1 - sat.fFlat, -1 / 3) - 1), half: Math.abs(domBeta({ mSrc: sat.m, r: rh, W0, wOther: wO }) - 0.5),
      zeq: zE.zStar && zE.numeric ? Math.abs(zE.numeric / zE.zStar - 1) : null }; }
  // ⑥ 入力の拒否
  const rejects = (f) => { try { f(); return false; } catch (e) { return e instanceof RangeError; } };
  S.rejects = [rejects(() => axialTwo({ s: 1, n: 0, f: 1.5 })), rejects(() => sharesOf([-1], 0)), rejects(() => sourceOf('venus')), rejects(() => recvSys(sourceOf('mars'), { a: 1e7, iDeg: 0 })),
    rejects(() => t2Effect(sourceOf('mars'), { action: 'spin', prof: 'ball' })), rejects(() => bandWidthH(sourceOf('saturn'), 'x')), rejects(() => bodyAxial({ srcs: [], W0: -1, wbg: { st: 0, se: 0 }, Lhat: [0, 0, 1], sObs: 1, sHatObs: [0, 0, 1] }))];
  return S;
}
export function pureGates(S) {
  return {
    diff: S.diff.closed <= 1e-12 && S.diff.f1 === 0 && S.diff.f0 === 0 && S.diff.sync <= 1e-15,
    numeric: S.numeric.st <= 1e-6 && S.numeric.se <= 1e-6,
    venus: S.venus.st <= 1e-20 && S.venus.se <= 1e-20 && S.venus.nBack <= 1e-9,
    t2: S.t2.sync <= 1e-9 && S.t2.zero === 0 && S.t2.closed <= 1e-6 && S.t2.bound <= 1e-12,
    t3: S.t3.width <= 1e-12 && S.t3.half <= 1e-12 && S.t3.zeq !== null && S.t3.zeq <= 1e-9,
    rejects: S.rejects.length === 7 && S.rejects.every(Boolean),
  };
}
export { rdOf, speedOf, ringRow, pointsOf, ringJudge, integrate, planetSys, planetRow, planetScaleRatios, kappaMRadius, nOf, periodOf, YR, DECL337I, LIT337I, AU, G, MSUN, DAY, CY };
