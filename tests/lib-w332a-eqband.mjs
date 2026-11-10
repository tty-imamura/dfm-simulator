// 第332便a(原仮定者の補足(2026-11-10)「K1 の『回転引きずり』は、自転時に赤道面からの距離が κ_D·m 以下の範囲で強く働く力と仮定する」「R_d = κ_D·m は観測半径とは別の値」
//   「新たな『回転引きずり』なら、土星環の幅と一致・太陽系の公転面が揃っている・公転面と赤道面がほぼ一致している『太陽–木星』で顕著、と繋がる」・統括の検証項目 R315):
//   **新しい「回転引きずり」—— 自転する天体の赤道面からの距離が R_d 以下の帯で強く働く力 —— の純関数**(器 tests/exp-w332a-eqband.mjs と QA lint.eqBand332a・behavior.eqBand332a が読む ——
//   html を読まない・状態を持たない・第330便b の重みの lib と第331便c の K1 のスケールの lib は呼ぶだけ・エンジンの式を写さない〔球の核の一次の値は読みの式 sphereRot で並べる〕)。
//
// ■ 区別(各表・各式に付ける —— 新しい仮定と今のコードの実装を混ぜない)
//   宣言(未接続)= この lib の帯の力(形・向き・強さ・尾の型 —— 今のエンジンに無い)/実装 = 今の beta の html の K1 の核(R_d の**球** —— 中心からの距離 r の体積平均・
//   回転の項は源のモーメント M1 = R_d²/(5r²)・PHYSICS〔第309便a〕〔第312便a〕・docs/EQUATIONS.md の EQ-11〜EQ-15)/診断 = 器の表(一次の目安・軌道の平均)。
// ■ 帯の力の宣言(原仮定者の補足の作業仮説を型に分ける —— どれかを採らない)
//   幾何: 源 b(位置 x_b・速度 v_b・質量 m・自転軸 ŝ・角速度 Ω〔符号つき —— ŝ の右ねじ〕)と受け手(位置 x・速度 v)。d = x − x_b・z = d·ŝ(赤道面からの距離)・ρ = d − zŝ(面内)・
//     φ̂ = ŝ × ρ̂(自転の向き)・t = |z|/R_d。**R_d の規則**: kappa0 = κ₀m(κ₀ = Y_k = 10G/(C₁c²) —— 今の規則の値)/kappaD = κ_D m(κ_D = 2G/c² —— 原文の字どおり)。比 κ₀/κ_D = 5/C₁。
//   形 S(t)(帯の重み 0〜1 —— 偶関数): step(t ≤ 1 で 1)/k1plane(**K1 の核の平面の類比** —— K1(r; R) の中心からの距離 r を赤道面からの距離 |z| に、R を R_d に置き、中心の値
//     K1(0; R_d) = 3/(2R_d) で割った型: 1 − t²/3〔t ≤ 1〕・尾 inv では 2/(3t)〔t > 1 —— K1 の外の 1/r の形〕。t = 1 で値も傾きも連続〔2/3・−2/(3R_d)〕。厚み 2R_d の板の 1/|z − ζ| の平均は
//     発散するので板の平均の型は採らず、r → |z| の置き換えを宣言とする)/gauss(exp(−t²/2) —— 滑らか)/sech2(1/cosh²t —— 滑らか・自己重力の等温の板の形の類比)。
//   尾(帯の外): none(0)/inv(R_d/|z| の形 —— 帯の縁で連続)/own(滑らかな形は自分の形のまま —— gauss・sech2 だけ)。
//   向き: A = 赤道面へ戻す鉛直の力 −gA S(t) P(z) ŝ(P: sgn = sgn(z)〔V 字の井戸 —— z = 0 で向きが跳ぶ〕・lin = 帯の内で z/R_d・外で sgn(z))/
//     B = 自転の向きへの方位の力 γ S(t) Δ φ̂(Δ = Ωρ − (v − v_b)·φ̂ —— 受け手の速度と Ω × ρ の差の方位の成分)/C = A + B。
//   強さ(単位を明記 —— 結合 β は無次元): k1N(β = C₁R_d K1(r; R_d) —— 今の K1 の並進の重み m K1/W〔受け手の自己の場の調和平均 —— r ≫ R_d で C₁R_d/r〕・
//     gA = β·G m(−dK1/dr)〔r ≥ R_d で β·Gm/r²〕[m/s²]・γ = β|Ω| [1/s])/k1spin(β は k1N と同じ・gA = β Ω²ρ〔自転 0 で 0〕・γ = β|Ω|)/
//     k2N(β = (R_d K1)²〔m/r² の重みを自己 m/R_d² で割った型 —— r ≫ R_d で (R_d/r)²〕・gA = β Gm/r²・γ = β|Ω|)/N(β = 1・gA = Gm/r²・γ = |Ω| —— 上の端の比べる列)。
//   **B の γ は |Ω| に比例**(自転 0 で方位の力 0)。A の k1N・k2N・N は自転に依らない(比べる列)・k1spin は自転 0 で 0。
// ■ 手前と奥の差分(原仮定者の補足その3(2026-11-10)「回転引きずりは源の天体の自転の手前側と奥側の差分なので、赤道面が最も強い。赤道面からの距離が引きずり半径を超えると、ほぼ消える」
//   —— 主の宣言): 受け手の高さ z の赤道面に平行な面で源の R_d の球を切ると半径 ℓ = √(R_d² − z²) の円。受け手から軸へ向かう線の手前の点(距離 ρ − ℓ)と奥の点(ρ + ℓ)の自転の速度は
//   ±Ωℓ φ̂(逆向き)。K1 の重み 1/距離 で平均すると Ωℓ[1/(ρ−ℓ) − 1/(ρ+ℓ)]/[1/(ρ−ℓ) + 1/(ρ+ℓ)] = Ωℓ²/ρ = Ω(R_d² − z²)/ρ —— 形 nearfar S = 1 − t²(赤道面で最大・|z| = R_d で 0 へ
//   連続)と尺度 U₀ = ΩR_d²/ρ。重みを付けない弦の差 2Ωℓ の形は nfchord(√(1 − t²))。**向き**: 剛体の自転の速度は ŝ に垂直 —— 差分は方位(自転の向き)だけで、源の枠の鉛直の成分は 0。
//   受け手の公転面から見ると、方位の押しは軌道の向きの成分 cos i/N と公転面の法線の成分 −sin i cos u/N(交点で符号が逆 —— 公転面からの位置で向きが変わる)を持つ。
//   NF = 自転の向きへ押す γ S U₀ φ̂(受け手の速度に依らない)/NS = 差分の速度 S U₀ への滑り γ S (S U₀ − v_φ) φ̂(比べる列 —— 公転の速さが U₀ より桁で大きいので逆向き)。
// ■ 軌道の平均(円軌道・半径 a・速さ v・赤道面に対する傾き i〔0〜π〕・節の線を x —— u は昇交点からの角)
//   N(u) = √(cos²u + sin²u cos²i)・z = a sin u sin i・ρ = aN・v_φ = v cos i/N・Δ(u) = ΩaN − v cos i/N(源は静止)。
//   ガウスの式: di/dt = (cos u/(na)) W・(da/dt)/a = 2T/(na)・dΩ_node/dt = (sin u/(na sin i)) W(W = 軌道面の法線の成分・T = 軌道の向きの成分)。
//   B: W = −γSΔ sin i cos u/N・T = γSΔ cos i/N → **di/dt = −γSΔ sin i cos²u/(naN)**(Δ > 0 なら i が減る —— 揃える向き)。A: W = −gA S P cos i・T = −gA S P cos u sin i →
//   u について奇 —— **永年の di/dt と da/dt は 0**(軸対称の保存力 —— 節の歳差だけ)。平均は u の 1 周(円軌道で時間と同じ)の数値の求積(帯の縁の区切り・尾は対数の置換)。
// ■ 言わないこと: 帯の力は宣言の型の表の値と残差(土星の環の厚み・公転面の揃い・太陽–木星を決める仕組みとは書かない)・R_d は観測の半径ではない(質点の扱いと似る ——
//   原仮定者の補足)・今のエンジンの K1 は R_d の球で、帯の型と形が違う(同じとは書かない)・`κ_epi` と κ_D は別・文献の値は本便は一次資料に当たっていない。
import { harmonicSelf, kappaMRadius } from './lib-w330b-dragweight.mjs';
import { C1, LIT as LIT331C, ringFreq } from './lib-w331c-k1scale.mjs';

export const LIB_VERSION = 'w332a-eqband-lib-1';
const isFin = Number.isFinite;
export const SHAPES = Object.freeze(['nearfar', 'nfchord', 'step', 'k1plane', 'gauss', 'sech2']);
export const TAILS = Object.freeze(['none', 'inv', 'own']);
export const DIRS = Object.freeze(['NF', 'NS', 'A', 'B', 'C']);
export const VPROFS = Object.freeze(['sgn', 'lin']);
export const STRENGTHS = Object.freeze(['k1N', 'k1spin', 'k2N', 'N']);
export const RULES = Object.freeze(['kappa0', 'kappaD']);
/** 形ごとに受理する尾 */
export const SHAPE_TAILS = Object.freeze({ nearfar: Object.freeze(['none']), nfchord: Object.freeze(['none']), step: Object.freeze(['none', 'inv']), k1plane: Object.freeze(['none', 'inv']), gauss: Object.freeze(['own']), sech2: Object.freeze(['own']) });
export const UNITS = Object.freeze({ beta: '1(無次元の結合)', gA: 'm/s²(A の加速度の尺度)', rate: '1/s(B・NF・NS の率 γ = β|Ω|)', slip: 'm/s(Δ)', U0: 'm/s(手前と奥の差分の速度の尺度 ΩR_d²/ρ)', a: 'm/s²', Rd: 'm', z: 'm' });
/** 器の宣言(走行の前に置く —— 結果を見て変えない) */
export const DECL = Object.freeze({
  G: 6.674e-11, c: 299792458,
  /** 主の宣言(原仮定者の補足その3(2026-11-10)「回転引きずりは源の天体の自転の手前側と奥側の差分 —— 赤道面が最も強く、赤道面からの距離が引きずり半径を超えるとほぼ消える」
   *  「R_d = κ₀m を採用」: 形 nearfar〔受け手の高さの赤道面に平行な切り口の手前と奥の K1 の重みつきの差分 —— 1 − t²〕・尾 0・向き NF〔自転の向きへ押す〕・K1 の強さ・R_d = κ₀m) */
  main: Object.freeze({ shape: 'nearfar', tail: 'none', dir: 'NF', vprof: 'sgn', strength: 'k1N', rule: 'kappa0' }),
  /** 第1版の主(補足その2 の字どおり —— 比べる列): 段・尾 0・B(共回りへの滑り)・k1N・κ₀m */
  mainV1: Object.freeze({ shape: 'step', tail: 'none', dir: 'B', vprof: 'sgn', strength: 'k1N', rule: 'kappa0' }),
  /** 軌道の平均の求積(Gauss–Legendre の点の数・滑らかな形の区切りの t・尾の対数の区間の分割) */
  quad: Object.freeze({ inner: 48, tailPts: 64, tailSegs: 4, smoothT: Object.freeze([0.5, 1, 2, 4, 8, 16, 40]) }),
  /** 太陽系の年齢と環の年齢の幅(文献の値 —— LIT) */
  ageYr: 4.5682e9,
  yearS: 365.25 * 86400,
});
/** 文献の値(出典つき —— 本便は一次資料に当たっていない〔この箱から論文のサイトに届かない〕。総説・論文・天体暦の値を書き写した —— 値は要確認の印を付けたものがある) */
export const LIT = Object.freeze({
  note: '文献の値 —— 本便は一次資料に当たっていない。土星の環の局所の厚みは総説の典型の値(環ごとの一次資料ではない)。要確認の印は記憶の値の確からしさが低いもの',
  age: Object.freeze({ value: 4.5682e9, src: 'Bouvier, A. & Wadhwa, M. 2010, Nature Geoscience 3, 637(CAI の Pb–Pb 年代 4568.2 Myr)' }),
  ringAge: Object.freeze({ lo: 1e7, hi: 4.5e9, src: 'Iess, L. et al. 2019, Science 364, eaat2965(質量と汚れから若い環 1e7〜1e8 年)・Cuzzi, J. N. et al. 2010, Science 327, 1470(若い環と古い環の両説の総説)' }),
  diskAspect: Object.freeze({ values: Object.freeze([0.03, 0.05, 0.1]), src: 'Chiang, E. I. & Goldreich, P. 1997, ApJ 490, 368・Armitage, P. J. 2011, ARA&A 49, 195(原始惑星系円盤の厚みと半径の比 H/r ≈ 0.03〜0.1 の桁)' }),
  diskLife: Object.freeze({ lo: 1e6, hi: 1e7, src: 'Haisch, K. E., Lada, E. A. & Lada, C. J. 2001, ApJ 553, L153(円盤の寿命 —— 約 3 Myr で半分・約 6 Myr でほぼ失われる・1e6〜1e7 年の桁)' }),
  saturnJ2: LIT331C.saturnJ2,
  thickness: LIT331C.thickness,
  bendingA: LIT331C.bendingA,
  bEdge: LIT331C.bEdge,
  /** 環(帯の厚み 2R_d と比べる —— kind: typical = 総説の典型・upper = 上限・moonInc = 衛星の傾きの振れ 2a sin i・none = 本便の手元に値なし) */
  rings: Object.freeze([
    Object.freeze({ key: 'satC', planet: '土星', name: '土星 C 環', H: 10, kind: 'typical', src: 'Cuzzi et al. 2010・Esposito 2002(主な環の局所の厚みは約 10 m の桁 —— 環ごとの値ではない)' }),
    Object.freeze({ key: 'satB', planet: '土星', name: '土星 B 環', H: 10, kind: 'typical', src: 'Cuzzi et al. 2010・Esposito 2002(同上)/外縁の局所の鉛直の構造は約 2.5 km(Spitale & Porco 2010 —— 環の厚みではない)' }),
    Object.freeze({ key: 'satCD', planet: '土星', name: '土星 カッシーニの間隙', H: 10, kind: 'typical', src: 'Cuzzi et al. 2010・Esposito 2002(同上 —— 間隙の局所の値は本便の手元に無い)' }),
    Object.freeze({ key: 'satA', planet: '土星', name: '土星 A 環', H: 10, kind: 'typical', src: 'Cuzzi et al. 2010・Esposito 2002(同上)/曲がり波の減衰から数 m〜数十 m(Shu, Cuzzi & Lissauer 1983)' }),
    Object.freeze({ key: 'jupMain', planet: '木星', name: '木星 主環', H: 3e4, kind: 'upper', src: 'Ockert-Bell, M. E. et al. 1999, Icarus 138, 188(主環の鉛直の厚み < 30 km)' }),
    Object.freeze({ key: 'jupGosA', planet: '木星', name: '木星 アマルテアの薄い環', H: 2 * 181366e3 * Math.sin(0.374 * Math.PI / 180), kind: 'moonInc', src: 'Burns, J. A. et al. 1999, Science 284, 1146(薄い環の厚みは源の衛星の傾きの振れ 2a sin i —— アマルテア a = 181 366 km・i = 0.374°)' }),
    Object.freeze({ key: 'uraEps', planet: '天王星', name: '天王星 ε 環', H: 150, kind: 'upper', src: 'Lane, A. L. et al. 1986, Science 233, 65(Voyager の掩蔽 —— 鉛直の厚みは約 150 m 以下の桁・要確認)' }),
    Object.freeze({ key: 'nepAdams', planet: '海王星', name: '海王星 アダムズ環', H: null, kind: 'none', src: '鉛直の厚みの文献の値は本便の手元に無い(未収載)' }),
  ]),
  /** 惑星の軌道の傾き [°](太陽の赤道面・不変面・黄道 J2000)と自転軸の傾き(自分の公転面に対する)[°] */
  planets: Object.freeze({
    src: '太陽の赤道面と不変面に対する傾き: Souami, D. & Souchay, J. 2012, A&A 543, A133(不変面)と太陽の極 α0 = 286.13°・δ0 = 63.87°(Archinal, B. A. et al. 2018, Celest. Mech. Dyn. Astron. 130, 22)からの換算の表 —— 自転軸の傾き: Archinal et al. 2018 の極と平均の軌道要素から(要確認の桁は 0.01°)',
    rows: Object.freeze([
      Object.freeze({ name: '水星', iSun: 3.38, iInv: 6.34, iEcl: 7.005, obliq: 0.034 }), Object.freeze({ name: '金星', iSun: 3.86, iInv: 2.19, iEcl: 3.395, obliq: 177.36 }),
      Object.freeze({ name: '地球', iSun: 7.155, iInv: 1.57, iEcl: 0, obliq: 23.44 }), Object.freeze({ name: '火星', iSun: 5.65, iInv: 1.67, iEcl: 1.85, obliq: 25.19 }),
      Object.freeze({ name: '木星', iSun: 6.09, iInv: 0.32, iEcl: 1.303, obliq: 3.13 }), Object.freeze({ name: '土星', iSun: 5.51, iInv: 0.93, iEcl: 2.485, obliq: 26.73 }),
      Object.freeze({ name: '天王星', iSun: 6.48, iInv: 1.02, iEcl: 0.773, obliq: 97.77 }), Object.freeze({ name: '海王星', iSun: 6.43, iInv: 0.72, iEcl: 1.77, obliq: 28.32 }),
    ]),
  }),
  /** 衛星の軌道の傾き(主星の赤道面か局所のラプラス面に対する)[°]と軌道の半径 [km] */
  moons: Object.freeze({
    src: 'JPL Solar System Dynamics の衛星の平均の要素(Jacobson ほか)の値 —— 月は黄道に対する 5.145°(地球の赤道面に対しては 18.3°〜28.6° で動く)・トリトンは逆行',
    rows: Object.freeze([
      Object.freeze({ name: '月', host: '地球', a: 384400, i: 5.145, note: '黄道に対する(地球の赤道面に対しては 18.3°〜28.6°)' }),
      Object.freeze({ name: 'フォボス', host: '火星', a: 9376, i: 1.093 }), Object.freeze({ name: 'アマルテア', host: '木星', a: 181366, i: 0.374 }),
      Object.freeze({ name: 'イオ', host: '木星', a: 421700, i: 0.05 }), Object.freeze({ name: 'エウロパ', host: '木星', a: 671034, i: 0.47 }),
      Object.freeze({ name: 'ガニメデ', host: '木星', a: 1070412, i: 0.2 }), Object.freeze({ name: 'カリスト', host: '木星', a: 1882709, i: 0.19 }),
      Object.freeze({ name: 'ミマス', host: '土星', a: 185539, i: 1.574 }), Object.freeze({ name: 'エンケラドゥス', host: '土星', a: 237948, i: 0.009 }),
      Object.freeze({ name: 'タイタン', host: '土星', a: 1221870, i: 0.3485 }), Object.freeze({ name: 'ミランダ', host: '天王星', a: 129390, i: 4.232 }),
      Object.freeze({ name: 'トリトン', host: '海王星', a: 354759, i: 156.885, note: '逆行(赤道面からの角は 23.1°)' }),
    ]),
  }),
});

/* ───────── 小さな道具 ───────── */
const isVec = (a) => Array.isArray(a) && a.length === 3 && a.every(isFin);
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], scl = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const nrm = (a) => Math.hypot(a[0], a[1], a[2]);
export const vec = Object.freeze({ add, sub, scl, dot, crs, nrm });
/** κ₀ = Y_k = 10G/(C₁c²)・κ_D = 2G/c²(SI) */
export const kappa0 = (G = DECL.G, c = DECL.c) => kappaMRadius(1, G, c);
export const kappaD = (G = DECL.G, c = DECL.c) => 2 * G / (c * c);
/** 規則の R_d(kappa0 = κ₀m —— 今の規則・第330便b の kappaMRadius を呼ぶ/kappaD = κ_D m) */
export function rdOf(m, rule = 'kappa0', G = DECL.G, c = DECL.c) {
  if (!RULES.includes(rule)) throw new RangeError('rdOf: 規則は ' + RULES.join('・'));
  if (!isFin(m) || !(m > 0)) throw new RangeError('rdOf: m > 0');
  return rule === 'kappa0' ? kappaMRadius(m, G, c) : kappaD(G, c) * m;
}
/** K1(r; R)(一様な球の 1/|x − ρ| の体積平均)と −dK1/dr —— 今の html の inertialDragIsqK1 と同じ形(読みの式) */
export function k1Core(r, R) {
  if (!(r >= 0) || !(R > 0)) throw new RangeError('k1Core: r ≥ 0・R > 0');
  if (r >= R) return { K: 1 / r, dK: 1 / (r * r) };
  return { K: (3 * R * R - r * r) / (2 * R * R * R), dK: r / (R * R * R) };
}
/** 形の重み S(t)(t = |z|/R_d) */
export function shapeWeight(shape, tail, t) {
  if (!SHAPES.includes(shape)) throw new RangeError('shapeWeight: 形は ' + SHAPES.join('・'));
  if (!(SHAPE_TAILS[shape] || []).includes(tail)) throw new RangeError('shapeWeight: 形 ' + shape + ' の尾は ' + SHAPE_TAILS[shape].join('・') + ' だけ');
  if (!(t >= 0) || !isFin(t)) { if (t === Infinity) return 0; throw new RangeError('shapeWeight: t ≥ 0'); }
  if (shape === 'nearfar') return t <= 1 ? 1 - t * t : 0;
  if (shape === 'nfchord') return t <= 1 ? Math.sqrt(1 - t * t) : 0;
  if (shape === 'step') return t <= 1 ? 1 : tail === 'inv' ? 1 / t : 0;
  if (shape === 'k1plane') return t <= 1 ? 1 - t * t / 3 : tail === 'inv' ? (2 / 3) / t : 0;
  if (shape === 'gauss') return Math.exp(-0.5 * t * t);
  const ch = Math.cosh(t); return isFin(ch) ? 1 / (ch * ch) : 0;
}
/** 鉛直の向きの形 P(z)(sgn —— V 字・lin —— 帯の内で z/R_d) */
export function vprofOf(vprof, z, Rd) {
  if (!VPROFS.includes(vprof)) throw new RangeError('vprofOf: ' + VPROFS.join('・'));
  if (vprof === 'sgn' || Math.abs(z) > Rd) return Math.sign(z);
  return z / Rd;
}
/** 結合 β(強さの型 —— 無次元) */
export function couplingOf(strength, r, Rd) {
  if (!STRENGTHS.includes(strength)) throw new RangeError('couplingOf: 強さは ' + STRENGTHS.join('・'));
  if (strength === 'N') return 1;
  const k = k1Core(r, Rd).K;
  return strength === 'k2N' ? (Rd * k) * (Rd * k) : C1 * Rd * k;
}
/** A の加速度の尺度 gA [m/s²] */
export function accelScale(strength, beta, m, r, Rd, Omega, rho, G = DECL.G) {
  if (strength === 'k1spin') return beta * Omega * Omega * rho;
  return beta * G * m * k1Core(r, Rd).dK;
}
function checkDecl(decl) {
  const d = Object.assign({}, DECL.main, decl || {});
  if (!SHAPES.includes(d.shape)) throw new RangeError('帯の形は ' + SHAPES.join('・'));
  if (!(SHAPE_TAILS[d.shape] || []).includes(d.tail)) throw new RangeError('形 ' + d.shape + ' の尾は ' + SHAPE_TAILS[d.shape].join('・') + ' だけ');
  if (!DIRS.includes(d.dir)) throw new RangeError('向きは ' + DIRS.join('・'));
  if (!VPROFS.includes(d.vprof)) throw new RangeError('鉛直の形は ' + VPROFS.join('・'));
  if (!STRENGTHS.includes(d.strength)) throw new RangeError('強さは ' + STRENGTHS.join('・'));
  if (!RULES.includes(d.rule)) throw new RangeError('R_d の規則は ' + RULES.join('・'));
  d.G = d.G === undefined ? DECL.G : d.G; d.c = d.c === undefined ? DECL.c : d.c;
  if (!isFin(d.G) || !(d.G > 0) || !isFin(d.c) || !(d.c > 0)) throw new RangeError('G・c > 0');
  return d;
}
function checkBody(b) {
  if (!b || !isVec(b.x) || !isFin(b.m) || !(b.m > 0) || !isVec(b.axis) || !isFin(b.Omega)) throw new RangeError('源: x(3)・m > 0・axis(3)・Omega(有限)が要る');
  const v = b.v === undefined ? [0, 0, 0] : b.v;
  if (!isVec(v)) throw new RangeError('源の速度 v(3)');
  const an = nrm(b.axis);
  if (!(an > 0)) throw new RangeError('源の自転軸が 0');
  return { x: b.x, v, m: b.m, axis: scl(b.axis, 1 / an), Omega: b.Omega };
}
function checkRecv(q) {
  if (!q || !isVec(q.x)) throw new RangeError('受け手: x(3)が要る');
  const v = q.v === undefined ? [0, 0, 0] : q.v;
  if (!isVec(v)) throw new RangeError('受け手の速度 v(3)');
  return { x: q.x, v };
}

/* ───────── 帯の力(宣言 —— 未接続)───────── */
/**
 * 1 つの自転する源から受け手への帯の力。戻り値: z・ρ・r・R_d・t・inBand・S・P・beta・gA・rate・slip・phi・aA・aB・a・aMag・units。
 * 受け手が源の中心(r = 0)は拒否。ρ = 0(軸の上)では φ̂ が定まらない —— B は 0。
 */
export function bandForce(body, recv, decl) {
  const d = checkDecl(decl), b = checkBody(body), q = checkRecv(recv);
  const dx = sub(q.x, b.x), r = nrm(dx);
  if (!(r > 0)) throw new RangeError('bandForce: 受け手が源の中心(r = 0)');
  const s = b.axis, z = dot(dx, s), rv = sub(dx, scl(s, z)), rho = nrm(rv);
  const Rd = rdOf(b.m, d.rule, d.G, d.c), t = Math.abs(z) / Rd, S = shapeWeight(d.shape, d.tail, t), P = vprofOf(d.vprof, z, Rd);
  const beta = couplingOf(d.strength, r, Rd), gA = accelScale(d.strength, beta, b.m, r, Rd, b.Omega, rho, d.G), rate = beta * Math.abs(b.Omega);
  let phi = [0, 0, 0], slip = 0;
  if (rho > 0) { phi = scl(crs(s, rv), 1 / rho); slip = b.Omega * rho - dot(sub(q.v, b.v), phi); }
  const aA = (d.dir === 'A' || d.dir === 'C') ? scl(s, -gA * S * P) : [0, 0, 0];
  const aB = (d.dir === 'B' || d.dir === 'C') ? scl(phi, rate * S * slip) : [0, 0, 0];
  // 手前と奥の差分(補足その3): 尺度 U₀ = Ω R_d²/ρ(赤道面の K1 の重みつきの差分の速度 —— 符号は Ω)。NF = 自転の向きへ押す γ S U₀ φ̂(受け手の速度に依らない)/
  //   NS = 差分の速度 S U₀ への滑り γ S (S U₀ − (v − v_b)·φ̂) φ̂
  const U0 = rho > 0 ? b.Omega * Rd * Rd / rho : 0, vphi = rho > 0 ? dot(sub(q.v, b.v), phi) : 0;
  const aNF = d.dir === 'NF' ? scl(phi, rate * S * U0) : d.dir === 'NS' ? scl(phi, rate * S * (S * U0 - vphi)) : [0, 0, 0];
  const a = add(add(aA, aB), aNF);
  return { z, rho, r, Rd, t, inBand: t <= 1, S, P, beta, gA, rate, slip, U0, phi, aA, aB, aNF, a, aMag: nrm(a), decl: d, units: UNITS };
}
/** 複数の源の和(各源の帯の力を足す —— 宣言: 重ね合わせ) */
export function bandForceSum(bodies, recv, decl) {
  if (!Array.isArray(bodies) || bodies.length === 0) throw new RangeError('bandForceSum: 源が要る');
  return bodies.reduce((acc, b) => add(acc, bandForce(b, recv, decl).a), [0, 0, 0]);
}
/**
 * 今のエンジンの K1 の球の核の回転の項(実装の読みの式 —— html の inertialDragIsqM1・inertialDragIsqNodeK1・inertialDragIsqBuild の一次):
 *   u_rot = Ω ŝ × ⟨(m M1/W) n̂⟩ ≈ Ω ŝ × n̂ · C₁R_d·R_d²/(5r²)(受け手の自己の場が分母を占める一次 —— ⟨1/W_self⟩ = C₁ Y_k・r > R_d の外部の M1)。
 *   並進の β = C₁R_d/r も返す。向きは φ̂(赤道で最大・軸の上で 0)。鉛直の成分は持たない(ŝ × n̂ ⟂ ŝ)。
 */
export function sphereRot(body, recv, { rule = 'kappa0', G = DECL.G, c = DECL.c } = {}) {
  const b = checkBody(body), q = checkRecv(recv);
  const dx = sub(q.x, b.x), r = nrm(dx), Rd = rdOf(b.m, rule, G, c);
  if (!(r > Rd)) throw new RangeError('sphereRot: r > R_d(外部の M1 だけ)');
  const nh = scl(dx, 1 / r), coef = C1 * Rd * Rd * Rd / (5 * r * r), RV = scl(nh, coef), u = scl(crs(b.axis, RV), b.Omega);
  const sinT = nrm(crs(b.axis, nh));
  return { uRot: u, mag: nrm(u), coef, beta: C1 * Rd / r, sinTheta: sinT, Rd, r };
}

/* ───────── 軌道の平均(円軌道 —— 診断)───────── */
const GL_CACHE = new Map();
/** Gauss–Legendre の点と重み([−1, 1]・n 点 —— Newton 法) */
export function glNodes(n) {
  if (GL_CACHE.has(n)) return GL_CACHE.get(n);
  const x = new Float64Array(n), w = new Float64Array(n);
  for (let i = 0; i < Math.ceil(n / 2); i++) {
    let t = Math.cos(Math.PI * (i + 0.75) / (n + 0.5)), dp = 0;
    for (let it = 0; it < 100; it++) {
      let p0 = 1, p1 = t;
      for (let k = 2; k <= n; k++) { const p2 = ((2 * k - 1) * t * p1 - (k - 1) * p0) / k; p0 = p1; p1 = p2; }
      dp = n * (t * p1 - p0) / (t * t - 1);
      const dt = p1 / dp; t -= dt;
      if (Math.abs(dt) < 1e-16) break;
    }
    x[i] = -t; x[n - 1 - i] = t; w[i] = w[n - 1 - i] = 2 / ((1 - t * t) * dp * dp);
  }
  const o = { x, w }; GL_CACHE.set(n, o); return o;
}
const glInt = (f, a, b, n) => { if (!(b > a)) return 0; const { x, w } = glNodes(n), h = (b - a) / 2, m = (a + b) / 2; let s = 0; for (let k = 0; k < n; k++) s += w[k] * f(m + h * x[k]); return s * h; };
/**
 * (2/π)∫_0^{π/2} f(u) du の求積(帯の縁の区切り —— tOf(u) = 帯の座標 t。形 shape と尾 tail で区切る)。uOfT(t) は t から u への逆写像(帯を越えないなら π/2)。
 * 区切り: 段・k1plane は t = 1、滑らかな形は DECL.quad.smoothT。尾 inv は t = 1 の外を s = ln u の置換で(1/u の形を滑らかに)。
 */
export function bandQuad(f, uOfT, shape, tail, q = DECL.quad) {
  const half = Math.PI / 2;
  const ts = (shape === 'gauss' || shape === 'sech2') ? q.smoothT : [1];
  const us = [0];
  for (const t of ts) { const u = Math.min(half, uOfT(t)); if (u > us[us.length - 1]) us.push(u); if (u >= half) break; }
  let s = 0;
  for (let k = 0; k + 1 < us.length; k++) s += glInt(f, us[k], us[k + 1], q.inner);
  const uEnd = us[us.length - 1];
  if (uEnd < half && tail === 'inv') {
    const la = Math.log(Math.max(uEnd, 1e-300)), lb = Math.log(half), g = (sv) => { const u = Math.exp(sv); return f(u) * u; };
    const n = q.tailSegs, h = (lb - la) / n;
    for (let k = 0; k < n; k++) s += glInt(g, la + k * h, la + (k + 1) * h, q.tailPts);
  }
  return s * 2 / Math.PI;
}
/** 段・k1plane・滑らかな形の (2/π)∫ cos²u S(sin u/ε) du(N = 1・Δ 一定の試験の積分 —— 閉じた式と比べる) */
export function avgCos2S(shape, tail, eps) {
  if (!(eps > 0)) throw new RangeError('avgCos2S: ε > 0');
  const uOfT = (t) => (t * eps >= 1 ? Math.PI / 2 : Math.asin(t * eps));
  return bandQuad((u) => Math.cos(u) * Math.cos(u) * shapeWeight(shape, tail, Math.sin(u) / eps), uOfT, shape, tail);
}
/** 閉じた式(段・尾 none / inv): (1/π)(asin ε + ε√(1 − ε²)) と尾の分 (2ε/π)(−ln tan(asin(ε)/2) − √(1 − ε²)) */
export function avgCos2StepClosed(tail, eps) {
  if (eps >= 1) return 0.5;
  const a = Math.asin(eps), core = (a + eps * Math.sqrt(1 - eps * eps)) / Math.PI;
  return tail === 'inv' ? core + (2 * eps / Math.PI) * (-Math.log(Math.tan(a / 2)) - Math.sqrt(1 - eps * eps)) : core;
}
/**
 * 円軌道の帯の力の平均(ガウスの式の 1 周の平均)。src = { m, Omega(符号つき), Rd(省略は規則)}・orbit = { a, i(赤道面に対する 0〜π), n, v }・decl(形・尾・向き・強さ・規則)・
 * bodyR(受け手の大きさ —— 帯の座標を max(0, |z| − bodyR)/R_d に —— 宣言)。戻り値: dIdt [rad/s]・dAdtOverA [1/s]・nodeRate [rad/s]・fracIn(帯の中の時間の割合)・eps・
 * planeAngle(赤道面からの角 min(i, π − i))・tAlign(planeAngle/|d planeAngle/dt| —— 揃える向きのときだけ)・aligning(真 = 揃える向き・偽 = 傾きが増す向き・null = 変化 0)・tA(1/|(da/dt)/a|)
 */
export function orbitRates({ src, orbit, decl, bodyR = 0 }) {
  const d = checkDecl(decl);
  if (!src || !isFin(src.m) || !(src.m > 0) || !isFin(src.Omega)) throw new RangeError('orbitRates: 源 m > 0・Omega');
  if (!orbit || !(orbit.a > 0) || !isFin(orbit.i) || orbit.i < 0 || orbit.i > Math.PI || !(orbit.n > 0) || !(orbit.v > 0)) throw new RangeError('orbitRates: a > 0・0 ≤ i ≤ π・n > 0・v > 0');
  if (!isFin(bodyR) || bodyR < 0) throw new RangeError('orbitRates: bodyR ≥ 0');
  const Rd = src.Rd !== undefined ? src.Rd : rdOf(src.m, d.rule, d.G, d.c);
  if (!(Rd > 0)) throw new RangeError('orbitRates: R_d > 0');
  const { a, i, n, v } = orbit, si = Math.sin(i), ci = Math.cos(i), asi = a * Math.abs(si), Om = src.Omega;
  const beta = couplingOf(d.strength, a, Rd), gamma = beta * Math.abs(Om);
  const tOf = (u) => Math.max(0, asi * Math.abs(Math.sin(u)) - bodyR) / Rd;
  const uOfT = (t) => { const zz = t * Rd + bodyR; return asi <= 0 || zz >= asi ? Math.PI / 2 : Math.asin(zz / asi); };
  const Nf = (u) => Math.sqrt(Math.cos(u) * Math.cos(u) + Math.sin(u) * Math.sin(u) * ci * ci);
  const S = (u) => shapeWeight(d.shape, d.tail, tOf(u));
  const useB = d.dir === 'B' || d.dir === 'C', useA = d.dir === 'A' || d.dir === 'C', useN = d.dir === 'NF' || d.dir === 'NS';
  let dIdt = 0, dAdtOverA = 0, nodeRate = 0, aSecular = null;
  if (useN && gamma !== 0) {
    // 手前と奥の差分(補足その3): a_φ(u) = γ S U₀(NF)か γ S (S U₀ − v cos i/N)(NS)・U₀ = Ω R_d²/(aN)
    const aPhi = (u) => { const N = Nf(u), Sv = S(u), U0 = Om * Rd * Rd / (a * N); return d.dir === 'NF' ? gamma * Sv * U0 : gamma * Sv * (Sv * U0 - v * ci / N); };
    dIdt += bandQuad((u) => -aPhi(u) * si * Math.cos(u) * Math.cos(u) / (n * a * Nf(u)), uOfT, d.shape, d.tail);
    dAdtOverA += bandQuad((u) => 2 * aPhi(u) * ci / (Nf(u) * n * a), uOfT, d.shape, d.tail);
  }
  if (useB && gamma !== 0) {
    const Delta = (u) => { const N = Nf(u); return Om * a * N - v * ci / N; };
    dIdt += bandQuad((u) => -gamma * S(u) * Delta(u) * si * Math.cos(u) * Math.cos(u) / (n * a * Nf(u)), uOfT, d.shape, d.tail);
    dAdtOverA += bandQuad((u) => 2 * gamma * S(u) * Delta(u) * ci / (Nf(u) * n * a), uOfT, d.shape, d.tail);
  }
  if (useA) {
    // 永年の di/dt と da/dt は u について奇 —— 0(軸対称の保存力)。節の歳差: (2/π)∫_0^{π/2} sin u · W/(na sin i) du(W = −gA S P cos i・P は z の符号の側)
    if (si !== 0) {
      const gAof = (u) => accelScale(d.strength, beta, src.m, a, Rd, Om, a * Nf(u), d.G);
      const Pof = (u) => vprofOf(d.vprof, a * Math.sin(u) * si, Rd) * Math.sign(si);   // u ∈ [0, π/2] で z ≥ 0 の側(sin i > 0)
      nodeRate += bandQuad((u) => Math.sin(u) * (-gAof(u) * S(u) * Pof(u) * ci) / (n * a * si), uOfT, d.shape, d.tail);
      // 永年の di/dt の照合(数値): [0, π/2] の分と [π/2, π] の分(u → π − u で同じ区切り)を足す —— 和が 0 の近くか(scale は片側の大きさ)
      const W = (u) => -gAof(u) * shapeWeight(d.shape, d.tail, tOf(u)) * vprofOf(d.vprof, a * Math.sin(u) * si, Rd) * ci;
      const left = bandQuad((u) => Math.cos(u) * W(u) / (n * a), uOfT, d.shape, d.tail), right = bandQuad((u) => Math.cos(Math.PI - u) * W(Math.PI - u) / (n * a), uOfT, d.shape, d.tail);
      aSecular = { dIdt: (left + right) / 2, scale: Math.abs(left) };
    }
  }
  const fracIn = (() => { const u1 = uOfT(1); return u1 >= Math.PI / 2 ? 1 : 2 * u1 / Math.PI; })();
  const planeAngle = Math.min(i, Math.PI - i), dPlane = i <= Math.PI / 2 ? dIdt : -dIdt;
  const aligning = dPlane < 0 ? true : dPlane > 0 ? false : null;
  return { Rd, beta, gamma, eps: asi > 0 ? (Rd + bodyR) / asi : Infinity, dIdt, dAdtOverA, nodeRate, aSecular, fracIn, planeAngle, aligning,
    tAlign: aligning === true && planeAngle > 0 ? planeAngle / -dPlane : null, tA: dAdtOverA !== 0 ? 1 / Math.abs(dAdtOverA) : null, tNode: nodeRate !== 0 ? 2 * Math.PI / Math.abs(nodeRate) : null };
}

/**
 * 交点ごとの寄与(原仮定者の補足その3(2026-11-10)「公転面を斜めに横切る軌道では、公転面からの位置で影響が変化する」—— 診断): 円軌道が源の赤道面を横切る昇交点(u ≈ 0)と降交点(u ≈ π)の
 * 帯の中の区間 [−u₀, u₀](u₀ = asin(R_d/(a sin i)))で、方位の力(NF・NS・B)の Δi・Δ(ln a)・軌道面の法線の向きの力積 ∫W dt を別々に積分する。法線の向きの力は cos u に比例して交点で
 * 符号が逆(公転面からの位置で向きが変わる)・Δi は cos²u に比例して両方の交点で同じ符号。戻り値の sum は 1 周の和(orbitRates の平均 × 周期と同じ —— 門で照合)。
 */
export function crossingTable({ src, orbit, decl }) {
  const d = checkDecl(decl);
  if (!['NF', 'NS', 'B'].includes(d.dir)) throw new RangeError('crossingTable: 向きは NF・NS・B(方位の力)だけ');
  if (!(SHAPE_TAILS[d.shape] || []).includes('none') || d.tail !== 'none') throw new RangeError('crossingTable: 尾 none の形だけ(帯の外で 0 —— 交点の区間で閉じる)');
  if (!src || !(src.m > 0) || !isFin(src.Omega) || !orbit || !(orbit.a > 0) || !(orbit.i > 0) || !(orbit.i < Math.PI) || !(orbit.n > 0) || !(orbit.v > 0)) throw new RangeError('crossingTable: 源と 0 < i < π の円軌道');
  const Rd = src.Rd !== undefined ? src.Rd : rdOf(src.m, d.rule, d.G, d.c), { a, i, n, v } = orbit, si = Math.sin(i), ci = Math.cos(i), Om = src.Omega;
  const beta = couplingOf(d.strength, a, Rd), gamma = beta * Math.abs(Om), eps = Rd / (a * Math.abs(si)), u0 = eps >= 1 ? Math.PI / 2 : Math.asin(eps);
  const node = (sg) => {
    const trig = (sv) => { const su = sg * Math.sin(sv), cu = sg * Math.cos(sv), N = Math.sqrt(cu * cu + su * su * ci * ci), t = a * Math.abs(su) * Math.abs(si) / Rd, S = shapeWeight(d.shape, d.tail, t);
      const aPhi = d.dir === 'NF' ? gamma * S * Om * Rd * Rd / (a * N) : d.dir === 'NS' ? gamma * S * (S * Om * Rd * Rd / (a * N) - v * ci / N) : gamma * S * (Om * a * N - v * ci / N);
      return { cu, N, aPhi }; };
    const f = (g) => glInt((sv) => g(trig(sv)), -u0, u0, DECL.quad.inner) / n;
    return { dI: f((q) => -q.aPhi * si * q.cu * q.cu / (n * a * q.N)), dLnA: f((q) => 2 * q.aPhi * ci / (q.N * n * a)), Wimp: f((q) => -q.aPhi * si * q.cu / q.N) };
  };
  const asc = node(1), desc = node(-1);
  return { Rd, eps, u0, durS: 2 * u0 / n, arcHalf: eps < 1 ? Rd / Math.abs(si) : null, asc, desc, sum: { dI: asc.dI + desc.dI, dLnA: asc.dLnA + desc.dLnA, Wimp: asc.Wimp + desc.Wimp }, periodS: 2 * Math.PI / n };
}
/** ガウスの鉛直の分布の円盤(厚み H = h a)のうち |z| ≤ R_d にある質量の割合 erf(R_d/(√2 H))(原始太陽系の円盤の列 —— 宣言) */
export function diskBandFraction(Rd, H) {
  if (!(Rd > 0) || !(H > 0)) throw new RangeError('diskBandFraction: R_d > 0・H > 0');
  const x = Rd / (Math.SQRT2 * H);
  if (x < 1e-4) return x * 2 / Math.sqrt(Math.PI) * (1 - x * x / 3);
  // erf の級数(x < 3)と漸近(x ≥ 3)
  if (x < 3) { let sum = x, term = x; for (let k = 1; k < 200; k++) { term *= -x * x / k; const add = term / (2 * k + 1); sum += add; if (Math.abs(add) < 1e-17 * Math.abs(sum)) break; } return 2 / Math.sqrt(Math.PI) * sum; }
  return 1 - Math.exp(-x * x) / (x * Math.sqrt(Math.PI));
}

/* ───────── 環(診断 —— 鉛直の振動の一次の目安)───────── */
/**
 * 環の点 r での帯の A の力と重力(J₂ の一次 —— 第331便c の ringFreq)の鉛直の比べ。c = (H/2)ν_z(厚み H の半分を振幅とする速度の分散の宣言)。
 * 戻り値: nuZ・gravEdge = ν_z² R_d・gEdge(帯の縁の内側の A の加速度)・ratioEdge・omegaLin = √(gA S(0)/R_d)(lin の小さな振幅)・periodSgn(段の V 字の井戸で振幅 R_d の周期)・
 *   zMax(重力 + 帯で速度 c の粒子が届く高さ)・zMaxGrav(重力だけ = H/2)・confined(zMax ≤ R_d)・gamma(B の率)・tCorot(1/γ)・slipK(ケプラーの粒子の Δ = Ω_s r − v_K)
 */
export function ringPoint({ M, Omega, r, J2, Rref, H, decl, G = DECL.G }) {
  const d = checkDecl(decl);
  if (!(M > 0) || !(r > 0) || !(H > 0) || !isFin(Omega) || !isFin(J2) || !(Rref > 0)) throw new RangeError('ringPoint: M > 0・r > 0・H > 0・Omega・J2・Rref');
  const Rd = rdOf(M, d.rule, G, d.c), F = ringFreq(G * M, r, J2, Rref), nu = F.nuZ, beta = couplingOf(d.strength, r, Rd);
  const gA = accelScale(d.strength, beta, M, r, Rd, Omega, r, G), Sedge = shapeWeight(d.shape, d.tail, 1), Pedge = vprofOf(d.vprof, Rd, Rd);
  const gEdge = gA * Sedge * Pedge, gravEdge = nu * nu * Rd, c = (H / 2) * nu;
  // 速度 c の粒子が届く高さ(帯の力のポテンシャル Φ_b(z) = ∫_0^z gA S P dz' —— 数値の求積・重力は ½ν²z²)
  const Phi = (zz) => { const f = (y) => gA * shapeWeight(d.shape, d.tail, y / Rd) * vprofOf(d.vprof, y, Rd); return zz <= Rd ? glInt(f, 0, zz, 64) : glInt(f, 0, Rd, 64) + glInt(f, Rd, zz, 64); };
  const E = 0.5 * c * c, tot = (zz) => 0.5 * nu * nu * zz * zz + Phi(zz) - E;
  let lo = 0, hi = H / 2; while (tot(hi) < 0) hi *= 2;
  for (let k = 0; k < 200; k++) { const mid = 0.5 * (lo + hi); if (tot(mid) < 0) lo = mid; else hi = mid; if (hi - lo <= 1e-15 * hi) break; }
  const zMax = 0.5 * (lo + hi), vK = Math.sqrt(G * M / r), gamma = beta * Math.abs(Omega);
  return { r, Rd, nuZ: nu, Om: F.Om, gA, gEdge, gravEdge, ratioEdge: gEdge / gravEdge, omegaLin: Math.sqrt(gA / Rd), omegaLinOverNu: Math.sqrt(gA / Rd) / nu,
    periodSgn: gA > 0 ? 4 * Math.sqrt(2 * Rd / gA) : null, periodGrav: 2 * Math.PI / nu, c, zMax, zMaxGrav: H / 2, zMaxOverRd: zMax / Rd, confined: zMax <= Rd,
    gamma, tCorot: gamma > 0 ? 1 / gamma : null, slipK: Omega * r - vK, vK, rSync: Math.cbrt(G * M / (Omega * Omega)) };
}
/** 帯の厚み 2R_d(κ₀m と κ_D m)と文献の厚み H の比 */
export function ringThicknessRow({ M, H, G = DECL.G, c = DECL.c }) {
  const r0 = rdOf(M, 'kappa0', G, c), rD = rdOf(M, 'kappaD', G, c);
  return { Rd0: r0, RdD: rD, band0: 2 * r0, bandD: 2 * rD, H, ratio0: H > 0 ? 2 * r0 / H : null, ratioD: H > 0 ? 2 * rD / H : null };
}

/* ───────── 純関数の場面と門 ───────── */
export function pureScenes() {
  const S = {};
  const body = { x: [0, 0, 0], v: [0, 0, 0], m: 5.6834e26, axis: [0, 0, 1], Omega: 1.6528e-4 };
  const Rd0 = rdOf(body.m), rB = 1.1758e8;
  const combos = SHAPES.flatMap((sh) => SHAPE_TAILS[sh].map((tl) => [sh, tl]));
  // 1 鏡映: z → −z で A は奇・B は偶
  S.mirror = combos.map(([sh, tl]) => {
    const dA = { shape: sh, tail: tl, dir: 'C', strength: 'k1N' };
    const p = bandForce(body, { x: [rB, 0, 0.4 * Rd0] }, dA), m = bandForce(body, { x: [rB, 0, -0.4 * Rd0] }, dA);
    return { sh, tl, odd: Math.abs(p.aA[2] + m.aA[2]) <= 1e-15 * Math.abs(p.aA[2]) && p.aA[2] !== 0, even: p.aB.every((x, k) => x === m.aB[k]) && p.aB[1] !== 0 };
  });
  // 2 符号: A は赤道面へ・B は Ω > 0 で順(静止した受け手)・Ω < 0 で逆
  { const up = bandForce(body, { x: [rB, 0, 0.5 * Rd0] }, { dir: 'A' }), dn = bandForce(body, { x: [rB, 0, -0.5 * Rd0] }, { dir: 'A' });
    const pro = bandForce(body, { x: [rB, 0, 0] }, { dir: 'B', shape: 'step' }), ret = bandForce(Object.assign({}, body, { Omega: -body.Omega }), { x: [rB, 0, 0] }, { dir: 'B', shape: 'step' });
    const zero = bandForce(body, { x: [rB, 0, 0] }, { dir: 'A' });
    S.sign = { up: up.aA[2], dn: dn.aA[2], pro: pro.aB[1], ret: ret.aB[1], zeroAtPlane: zero.aA[2] }; }
  // 3 帯の外で 0(段・k1plane の尾 none)と帯の内で 0 でない
  S.outside = ['step', 'k1plane', 'nearfar', 'nfchord'].map((sh) => { const o = bandForce(body, { x: [rB, 0, (1 + 1e-9) * Rd0] }, { shape: sh, tail: 'none', dir: 'C' }), i = bandForce(body, { x: [rB, 0, (1 - 1e-9) * Rd0] }, { shape: sh, tail: 'none', dir: 'C' }); return { sh, out: o.aMag, inS: i.S, outS: o.S }; });
  // 4 連続: 滑らかな形は t = 1 で連続・k1plane の尾 inv は値と傾きが連続・段の尾 inv は値が連続
  { const dl = 1e-7, sw = (sh, tl, t) => shapeWeight(sh, tl, t);
    S.cont = { gauss: Math.abs(sw('gauss', 'own', 1 + dl) - sw('gauss', 'own', 1 - dl)), sech2: Math.abs(sw('sech2', 'own', 1 + dl) - sw('sech2', 'own', 1 - dl)),
      k1v: Math.abs(sw('k1plane', 'inv', 1 + dl) - sw('k1plane', 'inv', 1 - dl)), k1slopeL: (sw('k1plane', 'inv', 1) - sw('k1plane', 'inv', 1 - dl)) / dl, k1slopeR: (sw('k1plane', 'inv', 1 + dl) - sw('k1plane', 'inv', 1)) / dl,
      stepInv: Math.abs(sw('step', 'inv', 1 + dl) - sw('step', 'inv', 1 - dl)), stepNoneJump: sw('step', 'none', 1 - dl) - sw('step', 'none', 1 + dl), k1edge: sw('k1plane', 'inv', 1) }; }
  // 5 自転 0: B は 0(全部の強さ)・k1spin の A も 0
  S.spin0 = STRENGTHS.map((st) => { const q = bandForce(Object.assign({}, body, { Omega: 0 }), { x: [rB, 3e3, 0.3 * Rd0], v: [10, -20, 0.5] }, { dir: 'C', strength: st }); return { st, aB: nrm(q.aB), aA: nrm(q.aA) }; });
  // 6 共に回る受け手は Δ = 0(B = 0)・7 ガリレイ変換(源と受け手に同じ速度を足す)で同じ
  { const x = [rB * 0.6, rB * 0.8, 0.2 * Rd0], vc = crs(scl(body.axis, body.Omega), x), q = bandForce(body, { x, v: vc }, { dir: 'B', shape: 'step' });
    const V = [1234.5, -987.6, 55.5], g1 = bandForce(body, { x, v: [100, 200, 3] }, { dir: 'C' }), g2 = bandForce(Object.assign({}, body, { v: V }), { x, v: add([100, 200, 3], V) }, { dir: 'C' });
    S.corot = { slip: q.slip, slipRel: Math.abs(q.slip) / (body.Omega * rB), aB: nrm(q.aB) };
    S.galilei = { diff: nrm(sub(g1.a, g2.a)) / g1.aMag }; }
  // 13 手前と奥の差分(補足その3): nearfar・nfchord は t = 1 で 0 へ連続・赤道面で最大・NF は受け手の速度に依らず自転の向き・自転 0 で 0・NS は速い順行の受け手で逆向き・
  //    鉛直の成分なし(剛体の自転の速度は ŝ に垂直)・赤道面の NF の速度の形 β U₀ は球の核の回転の速度の 5 倍(ρ = r)
  { const nf = (x, v, extra) => bandForce(body, { x, v }, Object.assign({ shape: 'nearfar', tail: 'none', dir: 'NF' }, extra || {}));
    const e0 = nf([rB, 0, 0]), e5 = nf([rB, 0, 0.5 * Rd0]), eMov = nf([rB, 0, 0], [0, 2e4, 30]), e1 = nf([rB, 0, (1 - 1e-9) * Rd0]);
    const s0 = bandForce(Object.assign({}, body, { Omega: 0 }), { x: [rB, 0, 0] }, { shape: 'nearfar', dir: 'NF' }), vK = Math.sqrt(DECL.G * body.m / rB);
    const ns = nf([rB, 0, 0], [0, vK, 0], { dir: 'NS' }), sp = sphereRot(body, { x: [rB, 0, 0] });
    S.nearfar = { edgeS: e1.S, edgeChord: shapeWeight('nfchord', 'none', 1 - 1e-12), center: e0.S, half: e5.S / e0.S, pro: e0.aNF[1], indep: nrm(sub(e0.aNF, eMov.aNF)), spin0: nrm(s0.aNF), nsSign: ns.aNF[1],
      vert: e0.aNF[2], e5vert: e5.aNF[2], velOverSphere: (e0.beta * e0.S * e0.U0) / sp.mag, U0: e0.U0 }; }
  // 8 入力の拒否
  const rej = [() => bandForce(body, { x: [0, 0, 0] }), () => bandForce(Object.assign({}, body, { m: 0 }), { x: [1, 0, 0] }), () => bandForce(Object.assign({}, body, { axis: [0, 0, 0] }), { x: [1, 0, 0] }),
    () => bandForce(body, { x: [1, 0, 0] }, { shape: 'box' }), () => bandForce(body, { x: [1, 0, 0] }, { shape: 'gauss', tail: 'none' }), () => bandForce(body, { x: [1, 0, 0] }, { shape: 'step', tail: 'own' }),
    () => bandForce(body, { x: [1, 0, 0] }, { dir: 'D' }), () => bandForce(body, { x: [1, 0, 0] }, { strength: 'k3' }), () => bandForce(body, { x: [1, 0, 0] }, { rule: 'radius' }),
    () => bandForce(body, { x: [1, NaN, 0] }), () => bandForce(Object.assign({}, body, { Omega: NaN }), { x: [1, 0, 0] }), () => bandForce(body, { x: [1, 0, 0] }, { vprof: 'cube' }),
    () => sphereRot(body, { x: [0.5 * Rd0, 0, 0] }), () => orbitRates({ src: { m: 1, Omega: 1 }, orbit: { a: 1, i: 4, n: 1, v: 1 }, decl: {} }), () => rdOf(-1),
    () => bandForce(body, { x: [1, 0, 0] }, { shape: 'nearfar', tail: 'inv' })];
  S.reject = rej.map((f) => { try { f(); return false; } catch (e) { return e instanceof RangeError; } });
  // 9 規則の比と κ₀・κ_D
  S.rule = { ratio: rdOf(1, 'kappa0') / rdOf(1, 'kappaD'), expect: 5 / C1, k0: kappa0(), kD: kappaD(), satRd0: Rd0, satRdD: rdOf(body.m, 'kappaD') };
  // 10 恒等式: k1N の gA ÷ (R_d G m/r³) = C₁(r ≫ R_d —— 規則に依らない)
  { const f = (rule) => { const q = bandForce(body, { x: [rB, 0, 0] }, { dir: 'A', strength: 'k1N', rule }); return q.gA / (q.Rd * DECL.G * body.m / (rB * rB * rB)); }; S.k1id = { k0: f('kappa0'), kD: f('kappaD') }; }
  // 11 球の核(実装の読みの式): 軸の上で 0・sinθ に比例・1/r²・順の向き・鉛直の成分なし
  { const eq = sphereRot(body, { x: [rB, 0, 0] }), lat = sphereRot(body, { x: [rB / Math.SQRT2, 0, rB / Math.SQRT2] }), ax = sphereRot(body, { x: [0, 0, rB] }), far = sphereRot(body, { x: [2 * rB, 0, 0] });
    S.sphere = { axis: ax.mag, latRatio: lat.mag / eq.mag, farRatio: far.mag / eq.mag, pro: eq.uRot[1], vert: eq.uRot[2], beta: eq.beta, betaExpect: C1 * Rd0 / rB }; }
  // 12 軌道の平均の求積と閉じた式(段の尾 none・inv)・A の永年の di/dt = 0
  S.quad = [1e-9, 1e-4, 0.3, 2].flatMap((eps) => ['none', 'inv'].map((tl) => ({ eps, tl, num: avgCos2S('step', tl, eps), closed: avgCos2StepClosed(tl, eps) })));
  { const src = { m: 1.9885e30, Omega: 2.865e-6 }, GM = DECL.G * src.m, a = 7.785e11, n = Math.sqrt(GM / (a * a * a));
    const qa = orbitRates({ src, orbit: { a, i: 0.1063, n, v: n * a }, decl: { dir: 'A', strength: 'k1N', shape: 'step', tail: 'none' } });
    const qb = orbitRates({ src, orbit: { a, i: 1e-3, n, v: n * a }, decl: { dir: 'B', shape: 'step', tail: 'none' } });
    // 小さな i の閉じた式: di/dt ≈ −(sin i γ Δ/(n a))·avgCos2(ε)(Δ = Ωa − v)
    const Rd = rdOf(src.m), gam = C1 * Rd / a * src.Omega, eps = Rd / (a * Math.sin(1e-3)), closed = -(Math.sin(1e-3) * gam * (src.Omega * a - n * a) / (n * a)) * avgCos2StepClosed('none', eps);
    S.orbit = { aDidt: qa.dIdt, aSecRel: Math.abs(qa.aSecular.dIdt) / qa.aSecular.scale, aNode: qa.nodeRate, bDidt: qb.dIdt, bClosed: closed, bAligning: qb.aligning }; }
  return S;
}
export function pureGates(S) {
  const rel = (a, b) => Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b), 1e-300);
  return {
    mirror: S.mirror.length === 8 && S.mirror.every((q) => q.odd && q.even),
    sign: S.sign.up < 0 && S.sign.dn > 0 && S.sign.pro > 0 && S.sign.ret < 0 && S.sign.zeroAtPlane === 0,
    outsideZero: S.outside.every((q) => q.out === 0 && q.outS === 0 && q.inS > 0),
    nearFar: S.nearfar.edgeS < 1e-8 && S.nearfar.edgeChord < 1e-5 && S.nearfar.center === 1 && Math.abs(S.nearfar.half - 0.75) < 1e-12 && S.nearfar.pro > 0 && S.nearfar.indep === 0 && S.nearfar.spin0 === 0
      && S.nearfar.nsSign < 0 && S.nearfar.vert === 0 && S.nearfar.e5vert === 0 && Math.abs(S.nearfar.velOverSphere - 5) < 1e-9,
    continuity: S.cont.gauss < 1e-6 && S.cont.sech2 < 1e-6 && S.cont.k1v < 1e-6 && Math.abs(S.cont.k1slopeL - S.cont.k1slopeR) < 1e-5 && S.cont.stepInv < 1e-6 && S.cont.stepNoneJump === 1 && rel(S.cont.k1edge, 2 / 3) < 1e-15,
    spinZero: S.spin0.every((q) => q.aB === 0) && S.spin0.find((q) => q.st === 'k1spin').aA === 0 && S.spin0.find((q) => q.st === 'k1N').aA > 0,
    corotation: S.corot.slipRel < 1e-12 && S.corot.aB < 1e-25,
    galilei: S.galilei.diff < 1e-12,
    reject: S.reject.length === 16 && S.reject.every(Boolean),
    ruleRatio: rel(S.rule.ratio, S.rule.expect) < 1e-15 && rel(S.rule.k0, 8.8076e-27) < 1e-4 && rel(S.rule.kD, 1.4852e-27) < 1e-4,
    k1Identity: rel(S.k1id.k0, C1) < 1e-6 && rel(S.k1id.kD, C1) < 1e-6,
    sphereCore: S.sphere.axis === 0 && rel(S.sphere.latRatio, Math.SQRT1_2) < 1e-12 && rel(S.sphere.farRatio, 0.25) < 1e-12 && S.sphere.pro > 0 && S.sphere.vert === 0 && rel(S.sphere.beta, S.sphere.betaExpect) < 1e-15,
    orbitQuad: S.quad.every((q) => rel(q.num, q.closed) < 1e-6) && S.orbit.aDidt === 0 && S.orbit.aSecRel < 1e-12 && S.orbit.aNode !== 0 && rel(S.orbit.bDidt, S.orbit.bClosed) < 1e-3 && S.orbit.bAligning === true,
  };
}
export { C1, harmonicSelf };
