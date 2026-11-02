// 第324便b(決断事項 AN514・AN515・統括の検証項目 R280 —— geoPN=3 の S3): **天体ごとの観測の自転 obsSpin と源の角運動量 J の本の lib**
//   (器 tests/exp-w324b-obsspin.mjs が使う —— 純関数と宣言の型だけ。html・エンジンは読まない)。
//
// ■ 何を置くか
//   ① 内蔵にした 2 本の表(📟 psrDoubleABInertial3d —— 📻 の第321便b の兄弟の写し〔列 tr〕に obsSpin・spinDrag・sourceMoment {kind:"obsSpin"}・
//      🔸 alphaCenABInertial3dJ —— 🔶 に spinDrag {rot} と sourceMoment {kind:"J", f} —— f は模型の入力)と、本ごとの宣言の期待。
//   ② 受理・拒否の表(AN515 の細目 —— 排他・必須の欄・単位・axis:null・二形式・0.4 を補わない・未知の鍵・二次元の本・S.spin へ写す宣言)を本から組む関数。
//   ③ 走行の列(本 × 列 —— 並進だけ・源 J・軸を仮定した列・符号を反転した列・OFF・geo1)を本から組む関数。
//   ④ 文献の値の表(J0737 の自転・fSrc の経験式 —— 本便は一次資料に当たっていない)と、言わないこと。
//
// ■ 言わないこと: 観測の J を「源の自転を計算した」「歳差を計算した」と書かない(固定の外部の貯蔵庫)・f を観測の構造係数と呼ばない・
//   連星の観測との照合と呼ばない・近点の移動の原因を述べない・h・h/2・h/4 を収束の判定に使わない(刻みの感度診断)。
import * as L from './lib-w321b-geo3bin.mjs';

export const LIB_VERSION = 'w324b-obsspin-lib-1';
const clone = (x) => JSON.parse(JSON.stringify(x));

/* ───────── ① 内蔵にした 2 本 ───────── */
export const BOOKS = Object.freeze([
  Object.freeze({ id: 'psrDoubleABInertial3d', emoji: '📟', base: 'psrDoubleAB', ja: 'J0737 の geoPN=3 三次元(obsSpin —— 軸は欠測)', sys: 'j0737' }),
  Object.freeze({ id: 'alphaCenABInertial3dJ', emoji: '🔸', base: 'alphaCenABInertial3d', twin: 'alphaCenAB', ja: 'α Cen の源の J の本(f は模型の入力)', sys: 'acen' })]);
export const BOOK_IDS = Object.freeze(BOOKS.map((b) => b.id));
/** 源の慣性係数(本の宣言の値 —— 模型の入力)。J0737 は Lattimer & Schutz 2005 の経験式を代理半径 11.75 km に当てた値を 3 桁に丸めた・α Cen は太陽の I/(m R²) の文献の値 */
export const F_SRC = Object.freeze({
  j0737: Object.freeze({ A: 0.354, B: 0.346, why: 'Lattimer & Schutz 2005 の経験式 I ≈ 0.237 M R² (1 + 4.2x + 90x⁴)・x = (M/M☉)(km/R) を代理半径 R = 11.75 km に当てた値(A 0.35395・B 0.34552 → 3 桁)—— 文献の値(本便は一次資料に当たっていない)・模型の入力(観測された構造係数ではない)' }),
  acen: Object.freeze({ A: 0.07, B: 0.07, why: '太陽の I/(m R²) ≈ 0.07(文献の値 —— 本便は一次資料に当たっていない)を両星へ当てた模型の入力(第321便b の J の列と同じ値・観測された構造係数ではない)' }) });
/** 経験式(Lattimer & Schutz 2005 —— 文献の値)。M は M☉・R は km */
export function fLS05(Msun, Rkm) { const x = Msun / Rkm; return 0.237 * (1 + 4.2 * x + 90 * x ** 4); }
/** J0737 の観測の自転(文献の値 —— paper/data/solar-observations.csv の行) */
export const J0737_SPIN = Object.freeze({
  A: Object.freeze({ nuHz: 44.054068642001, row: 'SOL-91ac7b68', src: 'Hu et al. 2022 A&A 667 A149' }),
  B: Object.freeze({ PSec: 2.77346074724, row: 'SOL-649c64b4', src: 'Kramer et al. 2006 MNRAS 368 283' }),
  axisA: Object.freeze({ upper95Deg: 3.2, row: 'SOL-5600e70a', src: 'Ferdman et al. 2013 ApJ 767 85(二つの磁極の放射を仮定した模型の値 —— 上限だけ)' }),
  axisB: Object.freeze({ deg: 40.6, row: 'SOL-912f7aa2', src: 'Lower et al. 2024 A&A 682 A26(一般相対論を仮定した幾何解 —— 方位と元期は記録に無い・歳差 5.16°/年)' }),
  rObsM: 11750, mSun: 1.9885e30 });
/** 本の宣言の期待(受理した宣言で見る) */
export const DECL_EXPECT = Object.freeze({
  j0737: Object.freeze({ coord: '3d', geoPN: 3, kFrame: 0, lambdaPN: 0, srcKind: 'obsSpin', spinDrag: Object.freeze({ rot: 'surfaceFlip' }), axisNull: true, spins: Object.freeze([0, 0]), warnings: 2 }),
  acen: Object.freeze({ coord: '3d', geoPN: 3, kFrame: 0, lambdaPN: 0, srcKind: 'J', spinDrag: Object.freeze({ rot: 'surfaceFlip' }), f: Object.freeze({ 0: 0.07, 1: 0.07 }), warnings: 0 }) });

/* ───────── ② 受理・拒否の表(J0737 の本から組む) ───────── */
/** 受理・拒否の場合。make(book) は本の写しを変える関数・expect は 'accept' | 'reject' | 'missing'(受理して軸は欠測)。why は理由の文の頭の照合(拒否のとき) */
export const CASES = Object.freeze([
  Object.freeze({ key: 'book', ja: '内蔵の本そのもの(A・B とも axis:null)', expect: 'missing' }),
  Object.freeze({ key: 'axisA', ja: 'A の axis [0,0,1](軸を仮定した写し)', expect: 'accept' }),
  Object.freeze({ key: 'axisNorm', ja: 'A の axis [0,0,2](長さ 2 —— 受理で単位ベクトル [0,0,1] へ正準化)', expect: 'accept' }),
  Object.freeze({ key: 'radps', ja: 'A を unit "rad/s"・omega = 2πν(Hz の宣言と同じ ω —— J も同じ)', expect: 'accept' }),
  Object.freeze({ key: 'Jaxis', ja: 'A を kind "J"・J + axis', expect: 'accept' }),
  Object.freeze({ key: 'Jvec', ja: 'A を kind "J"・Jvec(直接のベクトル)', expect: 'accept' }),
  Object.freeze({ key: 'Jnull', ja: 'A を kind "J"・J + axis:null(欠測)', expect: 'missing' }),
  Object.freeze({ key: 'both', ja: 'kind "omega" に J を足す(排他の違反)', expect: 'reject', why: 'obsSpin.kind "omega" の宣言に' }),
  Object.freeze({ key: 'Jomega', ja: 'kind "J" に omega を足す(排他の違反)', expect: 'reject', why: 'obsSpin.kind "J" の宣言に' }),
  Object.freeze({ key: 'twoForms', ja: 'kind "J" に J と Jvec を両方(二形式)', expect: 'reject', why: 'obsSpin の kind "J" は大きさ' }),
  Object.freeze({ key: 'JvecAxis', ja: 'kind "J" に Jvec と axis を両方(二形式)', expect: 'reject', why: 'obsSpin の kind "J" は大きさ' }),
  Object.freeze({ key: 'noF', ja: 'kind "omega" で fSrc が無い(0.4 を補わない)', expect: 'reject', why: 'obsSpin.fSrc(源の慣性係数' }),
  Object.freeze({ key: 'fBig', ja: 'fSrc = 0.7(> 2/3)', expect: 'reject', why: 'obsSpin.fSrc は 0 < f ≤ 2/3' }),
  Object.freeze({ key: 'fZero', ja: 'fSrc = 0', expect: 'reject', why: 'obsSpin.fSrc は 0 < f ≤ 2/3' }),
  Object.freeze({ key: 'noR', ja: 'kind "omega" で rObs が無い', expect: 'reject', why: 'obsSpin.rObs' }),
  Object.freeze({ key: 'noUnit', ja: 'unit が無い', expect: 'reject', why: 'obsSpin.unit' }),
  Object.freeze({ key: 'unitS', ja: 'unit "s"(周期 —— 列挙の外)', expect: 'reject', why: 'obsSpin.unit' }),
  Object.freeze({ key: 'unitJ', ja: 'kind "J" に unit "Hz"', expect: 'reject', why: 'obsSpin.unit' }),
  Object.freeze({ key: 'noSource', ja: 'source が無い', expect: 'reject', why: 'obsSpin.source' }),
  Object.freeze({ key: 'noEpoch', ja: 'epoch が無い', expect: 'reject', why: 'obsSpin.epoch' }),
  Object.freeze({ key: 'noFrame', ja: 'frame が無い(座標系)', expect: 'reject', why: 'obsSpin.frame' }),
  Object.freeze({ key: 'noAxisKey', ja: 'axis の鍵が無い(欠測は null と書く)', expect: 'reject', why: 'obsSpin.axis の鍵が要る' }),
  Object.freeze({ key: 'axisZero', ja: 'axis [0,0,0]', expect: 'reject', why: 'obsSpin.axis は長さ 0 でない' }),
  Object.freeze({ key: 'unknown', ja: '未知の鍵 foo', expect: 'reject', why: 'obsSpin の未知の鍵 foo' }),
  Object.freeze({ key: 'spinInject', ja: '欄の値を S.spin へ写す宣言 spinFromObs', expect: 'reject', why: 'obsSpin の未知の鍵 spinFromObs' }),
  Object.freeze({ key: 'twoD', ja: '二次元の本(📻 psrDoubleAB の写し)の A に obsSpin', expect: 'reject', why: 'bodies[0].obsSpin は三次元の本' }),
  Object.freeze({ key: 'noScale', ja: 'scaleExp が無い本に obsSpin', expect: 'reject', why: 'obsSpin を宣言した本は物理の単位の宣言' }),
  Object.freeze({ key: 'srcNoObs', ja: 'sourceMoment kind "obsSpin" で obsSpin の天体が無い', expect: 'reject', why: 'physics.relativeDrag.invSq.sourceMoment の kind:"obsSpin" は obsSpin を宣言した天体が要る' }),
  Object.freeze({ key: 'srcF', ja: 'sourceMoment kind "obsSpin" に f', expect: 'reject', why: 'physics.relativeDrag.invSq.sourceMoment の kind:"obsSpin" は f を持たない' }),
  Object.freeze({ key: 'srcNoSpinDrag', ja: 'sourceMoment kind "obsSpin" で spinDrag が無い', expect: 'reject', why: 'physics.relativeDrag.invSq.sourceMoment は spinDrag' }),
  Object.freeze({ key: 'srcDragCore', ja: 'sourceMoment kind "obsSpin" の本に dragCore の天体', expect: 'reject', why: 'physics.relativeDrag.invSq.sourceMoment の kind:"obsSpin" の本に dragCore' }),
  Object.freeze({ key: 'metaOnly', ja: 'obsSpin だけ(spinDrag と sourceMoment を外す —— 読み取り専用の欄)', expect: 'missing' })]);
export const CASE_KEYS = Object.freeze(CASES.map((c) => c.key));
const OS = (b, i) => b.bodies[i].obsSpin;
/** 場の写し(本 → 場合 key の写し)。A の観測の自転の欄 a = book.bodies[0].obsSpin */
export function caseOf(book, key, find) {
  const a0 = OS(book, 0), c = (key === 'twoD') ? clone(find('psrDoubleAB')) : clone(book), a = (key === 'twoD') ? null : OS(c, 0), rd = c.physics.relativeDrag;
  const w = 2 * Math.PI * a0.omega, J = a0.fSrc * (book.bodies[0].m * Math.pow(10, book.scaleExp.M)) * a0.rObs * a0.rObs * w;   // A の ν(Hz)→ ω・J = fSrc m rObs² ω(SI)
  const Jdecl = () => { for (const k of ['omega', 'fSrc', 'rObs']) delete a[k]; a.kind = 'J'; a.unit = 'kg m^2/s'; };
  switch (key) {
    case 'book': break;
    case 'axisA': a.axis = [0, 0, 1]; break;
    case 'axisNorm': a.axis = [0, 0, 2]; break;
    case 'radps': a.unit = 'rad/s'; a.omega = w; a.axis = [0, 0, 1]; break;
    case 'Jaxis': Jdecl(); a.J = J; a.axis = [0, 0, 1]; break;
    case 'Jvec': Jdecl(); delete a.axis; a.Jvec = [0, 0, J]; break;
    case 'Jnull': Jdecl(); a.J = J; a.axis = null; break;
    case 'both': a.J = J; break;
    case 'Jomega': Jdecl(); a.J = J; a.axis = null; a.omega = 1; break;
    case 'twoForms': Jdecl(); a.J = J; a.axis = null; a.Jvec = [0, 0, J]; break;
    case 'JvecAxis': Jdecl(); a.Jvec = [0, 0, J]; a.axis = [0, 0, 1]; break;
    case 'noF': delete a.fSrc; break;
    case 'fBig': a.fSrc = 0.7; break;
    case 'fZero': a.fSrc = 0; break;
    case 'noR': delete a.rObs; break;
    case 'noUnit': delete a.unit; break;
    case 'unitS': a.unit = 's'; break;
    case 'unitJ': Jdecl(); a.J = J; a.axis = null; a.unit = 'Hz'; break;
    case 'noSource': delete a.source; break;
    case 'noEpoch': delete a.epoch; break;
    case 'noFrame': delete a.frame; break;
    case 'noAxisKey': delete a.axis; break;
    case 'axisZero': a.axis = [0, 0, 0]; break;
    case 'unknown': a.foo = 1; break;
    case 'spinInject': a.spinFromObs = true; break;
    case 'twoD': c.bodies[0].obsSpin = clone(OS(book, 0)); break;
    case 'noScale': delete c.scaleExp; break;
    case 'srcNoObs': for (const b of c.bodies) delete b.obsSpin; break;
    case 'srcF': rd.invSq.sourceMoment.f = { 0: 0.354 }; break;
    case 'srcNoSpinDrag': delete rd.spinDrag; break;
    case 'srcDragCore': c.bodies[1].dragCore = { massFrac: 1 }; break;
    case 'metaOnly': delete rd.spinDrag; delete rd.invSq.sourceMoment; break;
    default: throw new Error('未知の場合 ' + key);
  }
  c.id = book.id + '__w324b-' + key;
  return c;
}

/* ───────── ③ 走行の列 ───────── */
/** 列の表。sys: j0737 | acen。make(find) は id → 本(器が HP.allPresets().find で引いて渡す)から写しを組む */
export const COLS = Object.freeze({
  j0737: Object.freeze({
    self: '内蔵の本(A・B とも axis:null —— 源の J は入らない)',
    tr: '第321便b の兄弟の写しの列 tr(並進だけ —— 📻 から)',
    off: 'OFF(本の abBody の physicsPatch —— 引きずりと G_loc を切る)',
    g1: 'geo1 の参照(📻 psrDoubleAB そのもの —— 二次元)',
    JA: 'A の軸を軌道の法線 +z と仮定した比較列(B は欠測のまま)',
    JAm: 'A の軸を −z(符号を反転した対照)',
    JAvec: 'A を kind "J"・Jvec(JA と同じ J のベクトル —— R_src = R_d の形)',
    JAB: 'A +z・B を軌道の法線から 40.6°(方位 0° を仮定 —— 記録に無い)' }),
  acen: Object.freeze({
    self: '内蔵の本 🔸(源の J —— f = 0.07)',
    tr: '🔶 alphaCenABInertial3d(並進だけ —— 同じ初期状態)',
    on: '🔶 + spinDrag {rot}(源の J なし —— R_src = R_d)',
    off: 'OFF(🔶 の abBody の physicsPatch)',
    Jm: '🔸 の両星の自転の符号を反転(状態の自転 −Ω —— J の符号の対照)' }) });
export function colBook(sys, col, find) {
  if (sys === 'j0737') {
    const book = clone(find('psrDoubleABInertial3d'));
    if (col === 'self') return book;
    if (col === 'tr') return L.siblingOf(clone(find('psrDoubleAB')), 'tr');
    if (col === 'off') return offOf(book);
    if (col === 'g1') return clone(find('psrDoubleAB'));
    if (col === 'JA') { book.bodies[0].obsSpin.axis = [0, 0, 1]; book.id += '__w324b-JA'; return book; }
    if (col === 'JAm') { book.bodies[0].obsSpin.axis = [0, 0, -1]; book.id += '__w324b-JAm'; return book; }
    if (col === 'JAvec') { const c = caseOf(book, 'Jvec'); c.id = book.id + '__w324b-JAvec'; return c; }
    if (col === 'JAB') { book.bodies[0].obsSpin.axis = [0, 0, 1]; const t = J0737_SPIN.axisB.deg * Math.PI / 180; book.bodies[1].obsSpin.axis = [Math.sin(t), 0, Math.cos(t)]; book.id += '__w324b-JAB'; return book; }
  } else {
    const book = clone(find('alphaCenABInertial3dJ')), tr = clone(find('alphaCenABInertial3d'));
    if (col === 'self') return book;
    if (col === 'tr') return tr;
    if (col === 'on') { tr.physics.relativeDrag.spinDrag = { rot: 'surfaceFlip' }; tr.id += '__w324b-on'; return tr; }
    if (col === 'off') return offOf(tr);
    if (col === 'Jm') { for (const b of book.bodies) b.spin = -b.spin; book.id += '__w324b-Jm'; return book; }
  }
  throw new Error('未知の列 ' + sys + '/' + col);
}
/** physicsPatch を本の physics に重ねた写し(null の鍵は外す —— 第322便b の offOf と同じ扱い) */
export function offOf(book) {
  const c = clone(book), pp = (book.abBody && book.abBody.physicsPatch) || {};
  for (const k of Object.keys(pp)) { if (pp[k] === null) delete c.physics[k]; else c.physics[k] = clone(pp[k]); }
  c.id = book.id + '__w324b-off'; delete c.abBody;
  return c;
}
/** 系の基準の本(初期の接触要素と刻み —— 列によらず同じ初期状態) */
export const BASE_OF = Object.freeze({ j0737: 'psrDoubleABInertial3d', acen: 'alphaCenABInertial3dJ' });

/* ───────── ④ 言わないこと ───────── */
export const NOT_CLAIM = Object.freeze(['観測の J を源の自転を計算したと書かない(固定の外部の貯蔵庫 —— 源の自転の進化と歳差は扱わない)', 'f・fSrc を観測された構造係数と呼ばない(模型の入力)',
  '連星の観測との照合ではない(同じ初期状態・同じ窓の写しどうしの差)', '近点の移動の原因を述べない', 'h・h/2・h/4 を収束の判定に使わない(刻みの感度診断)',
  '軸を仮定した比較列を本の既定と呼ばない(器の中の列)', '文献の値は一次資料に当たっていない']);
