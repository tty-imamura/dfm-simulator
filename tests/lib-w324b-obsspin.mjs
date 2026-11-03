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
//
// ■ 第324便e(原仮定者の回答(2026-11-02 —— AN521)「連星は、自転軸の傾きが観測または推定されている天体を優先する。自転軸の傾きが不明な場合は、ノブとする」・
//   統括の検証項目 R283)で版 2 へ: 📟 の軸を obsSpin.axis の傾きの形(A = 推定の傾き 0°・B = 推定の傾き 40.6°・方位と B の角の読みはノブ)・🔸 を obsSpin の経路
//   (軸はノブ —— 既定 0°)へ。受理・拒否の表に傾きの形の場合を足し、列に欠測の写し(miss —— 版 1 の本の形)・ノブを振った列・推定の上限の列・前の版の 🔸 の宣言(kJ)を足した。
import * as L from './lib-w321b-geo3bin.mjs';

export const LIB_VERSION = 'w324e-obsspin-lib-2';
const clone = (x) => JSON.parse(JSON.stringify(x));

/* ───────── ① 内蔵にした 2 本 ───────── */
export const BOOKS = Object.freeze([
  Object.freeze({ id: 'psrDoubleABInertial3d', emoji: '📟', base: 'psrDoubleAB', ja: 'J0737 の geoPN=3 三次元(obsSpin —— 軸は推定の傾きとノブ)', sys: 'j0737' }),
  Object.freeze({ id: 'alphaCenABInertial3dJ', emoji: '🔸', base: 'alphaCenABInertial3d', twin: 'alphaCenAB', ja: 'α Cen の源の J の本(fSrc は模型の入力・軸はノブ)', sys: 'acen' })]);
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
  axisA: Object.freeze({ upper95Deg: 3.2, upper68Deg: 0.85, upper99Deg: 4.7, row: 'SOL-5600e70a', src: 'Ferdman et al. 2013 ApJ 767 85(二つの磁極の放射を仮定した模型の値 —— 上限だけ)' }),
  axisB: Object.freeze({ deg: 40.6, sigmaDeg: 0.1, altDeg: 139.4, thetaBreton08Deg: 130.02, row: 'SOL-912f7aa2', src: 'Lower et al. 2024 A&A 682 A26(一般相対論を仮定した幾何解 —— 方位と元期は記録に無い・歳差 5.16°/年・δ_B = 180° − θ の書き方)' }),
  rObsM: 11750, mSun: 1.9885e30 });
/** 第324便e(AN521): 本の軸の宣言の期待(傾きの形の成分の basis —— 観測/推定/ノブ)と、ノブの既定と範囲 */
export const AXIS_EXPECT = Object.freeze({
  j0737: Object.freeze([
    Object.freeze({ tiltDeg: Object.freeze({ basis: 'estimated', deg: 0, upperDeg: 3.2, level: 95 }), azimuthDeg: Object.freeze({ basis: 'knob', deg: 0, default: 0, min: 0, max: 360 }) }),
    Object.freeze({ tiltDeg: Object.freeze({ basis: 'estimated', deg: 40.6, sigmaDeg: 0.1 }), azimuthDeg: Object.freeze({ basis: 'knob', deg: 0, default: 0, min: 0, max: 360 }), sense: Object.freeze({ basis: 'knob', sign: 1, default: 1, min: -1, max: 1 }) })]),
  acen: Object.freeze([
    Object.freeze({ tiltDeg: Object.freeze({ basis: 'knob', deg: 0, default: 0, min: 0, max: 180 }), azimuthDeg: Object.freeze({ basis: 'knob', deg: 0, default: 0, min: 0, max: 360 }) }),
    Object.freeze({ tiltDeg: Object.freeze({ basis: 'knob', deg: 0, default: 0, min: 0, max: 180 }), azimuthDeg: Object.freeze({ basis: 'knob', deg: 0, default: 0, min: 0, max: 360 }) })]) });
/** 第324便e: α Cen の観測の自転(記録の周期 —— ✨ の自転と同じ行・文献の値)と観測半径 */
export const ACEN_SPIN = Object.freeze({ A: Object.freeze({ PSec: 1373760, rObsM: 847380000, src: 'Bhattacharyya et al. 2026 AJ 172 27(CUTE 2024 の Mg II の自転の変調 15.9 d)' }),
  B: Object.freeze({ PSec: 3130272, rObsM: 597933600, src: 'DeWarf et al. 2010 ApJ 722 343(36.23 d)' }) });
/** 本の宣言の期待(受理した宣言で見る) */
export const DECL_EXPECT = Object.freeze({
  j0737: Object.freeze({ coord: '3d', geoPN: 3, kFrame: 0, lambdaPN: 0, srcKind: 'obsSpin', spinDrag: Object.freeze({ rot: 'surfaceFlip' }), axisForm: 'tilt', spins: Object.freeze([0, 0]), warnings: 2 }),
  acen: Object.freeze({ coord: '3d', geoPN: 3, kFrame: 0, lambdaPN: 0, srcKind: 'obsSpin', spinDrag: Object.freeze({ rot: 'surfaceFlip' }), fSrc: Object.freeze([0.07, 0.07]), axisForm: 'tilt', warnings: 0 }) });

/* ───────── ② 受理・拒否の表(J0737 の本から組む) ───────── */
/** 受理・拒否の場合。make(book) は本の写しを変える関数・expect は 'accept' | 'reject' | 'missing'(受理して軸は欠測)。why は理由の文の頭の照合(拒否のとき) */
export const CASES = Object.freeze([
  Object.freeze({ key: 'book', ja: '内蔵の本そのもの(A・B とも傾きの形 —— 推定の傾きとノブ)', expect: 'accept' }),
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
  Object.freeze({ key: 'metaOnly', ja: 'obsSpin だけ(spinDrag と sourceMoment を外す —— 読み取り専用の欄・源にしない)', expect: 'accept' }),
  // 第324便e(AN521): 傾きの形(A の欄の axis —— 本は推定の傾き 0°・方位のノブ)
  Object.freeze({ key: 'tiltAz90', ja: 'A の方位のノブを 90°(範囲の内 —— 傾き 0° では向きは同じ)', expect: 'accept' }),
  Object.freeze({ key: 'senseEst', ja: 'A に向き sense −1 を推定として(傾き 0° → 180° の読み —— 向き −n̂)', expect: 'accept' }),
  Object.freeze({ key: 'tiltJ', ja: 'A を kind "J"・J + 傾きの形', expect: 'accept' }),
  Object.freeze({ key: 'tiltObs', ja: 'A の傾きを観測 observed(sigmaDeg 0.5)', expect: 'accept' }),
  Object.freeze({ key: 'knobNoRange', ja: '方位のノブに min・max が無い', expect: 'reject', why: 'obsSpin.axis.azimuthDeg はノブ —— 既定 default と範囲' }),
  Object.freeze({ key: 'knobNoDefault', ja: '方位のノブに default が無い', expect: 'reject', why: 'obsSpin.axis.azimuthDeg はノブ —— 既定 default と範囲' }),
  Object.freeze({ key: 'knobOut', ja: '方位のノブの値 −10°(範囲 0〜360 の外)', expect: 'reject', why: 'obsSpin.axis.azimuthDeg はノブ —— 既定 default と範囲' }),
  Object.freeze({ key: 'knobMinMax', ja: '方位のノブの min 360・max 0(min < max でない)', expect: 'reject', why: 'obsSpin.axis.azimuthDeg はノブ —— 既定 default と範囲' }),
  Object.freeze({ key: 'knobSigma', ja: '方位のノブに sigmaDeg(ノブの値を観測と呼ばない)', expect: 'reject', why: 'obsSpin.axis.azimuthDeg はノブ —— 観測・推定の不確かさの鍵' }),
  Object.freeze({ key: 'estRange', ja: '推定の傾きに min・max・default(ノブの鍵)', expect: 'reject', why: 'obsSpin.axis.tiltDeg は観測か推定 —— ノブの鍵' }),
  Object.freeze({ key: 'basisBad', ja: '傾きの basis "assumed"(列挙の外)', expect: 'reject', why: 'obsSpin.axis.tiltDeg.basis は' }),
  Object.freeze({ key: 'tiltRange', ja: '傾き 190°(0〜180 の外)', expect: 'reject', why: 'obsSpin.axis.tiltDeg の値は 0〜180' }),
  Object.freeze({ key: 'tiltUpper', ja: '推定の傾き 5° が上限 upperDeg 3.2° の外', expect: 'reject', why: 'obsSpin.axis.tiltDeg の不確かさは' }),
  Object.freeze({ key: 'tiltLevel', ja: '上限の水準 level 120(0〜100 の外)', expect: 'reject', why: 'obsSpin.axis.tiltDeg の不確かさは' }),
  Object.freeze({ key: 'noAz', ja: '方位 azimuthDeg が無い', expect: 'reject', why: 'obsSpin.axis.azimuthDeg が要る' }),
  Object.freeze({ key: 'noTilt', ja: '傾き tiltDeg が無い', expect: 'reject', why: 'obsSpin.axis.tiltDeg が要る' }),
  Object.freeze({ key: 'axisKey', ja: '傾きの形に未知の鍵 foo', expect: 'reject', why: 'obsSpin.axis の傾きの形の未知の鍵 foo' }),
  Object.freeze({ key: 'compKey', ja: '傾きの成分に未知の鍵 bar', expect: 'reject', why: 'obsSpin.axis.tiltDeg の未知の鍵 bar' }),
  Object.freeze({ key: 'compSign', ja: '傾きの成分に sign(角の成分は deg)', expect: 'reject', why: 'obsSpin.axis.tiltDeg の未知の鍵 sign' }),
  Object.freeze({ key: 'refBad', ja: 'ref "spin"(軌道の法線だけ)', expect: 'reject', why: 'obsSpin.axis.ref は' }),
  Object.freeze({ key: 'pairSame', ja: 'pair [0, 0](異なる二体でない)', expect: 'reject', why: 'obsSpin.axis.pair は' }),
  Object.freeze({ key: 'pairOut', ja: 'pair [0, 5](天体の範囲の外)', expect: 'reject', why: 'bodies[0].obsSpin.axis.pair の天体 bodies[5]' }),
  Object.freeze({ key: 'axisNoSource', ja: '傾きの形に source が無い', expect: 'reject', why: 'obsSpin.axis.source' }),
  Object.freeze({ key: 'pairZeroL', ja: 'pair の二体の相対の速度を 0 に(初期の相対の角運動量 0)', expect: 'reject', why: 'bodies[0].obsSpin.axis.pair の二体の初期の相対の角運動量が 0' }),
  Object.freeze({ key: 'senseBad', ja: '向き sense の sign 0(±1 の外)', expect: 'reject', why: 'obsSpin.axis.sense の sign は' }),
  Object.freeze({ key: 'senseSigma', ja: '推定の向き sense に sigmaDeg', expect: 'reject', why: 'obsSpin.axis.sense の不確かさは' })]);
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
    // 第324便e(AN521): 傾きの形
    case 'tiltAz90': a.axis.azimuthDeg.deg = 90; break;
    case 'senseEst': a.axis.sense = { sign: -1, basis: 'estimated' }; break;
    case 'tiltJ': Jdecl(); a.J = J; break;
    case 'tiltObs': a.axis.tiltDeg = { deg: 0, basis: 'observed', sigmaDeg: 0.5 }; break;
    case 'knobNoRange': delete a.axis.azimuthDeg.min; delete a.axis.azimuthDeg.max; break;
    case 'knobNoDefault': delete a.axis.azimuthDeg.default; break;
    case 'knobOut': a.axis.azimuthDeg.deg = -10; break;
    case 'knobMinMax': a.axis.azimuthDeg.min = 360; a.axis.azimuthDeg.max = 0; break;
    case 'knobSigma': a.axis.azimuthDeg.sigmaDeg = 1; break;
    case 'estRange': Object.assign(a.axis.tiltDeg, { default: 0, min: 0, max: 3.2 }); break;
    case 'basisBad': a.axis.tiltDeg.basis = 'assumed'; break;
    case 'tiltRange': a.axis.tiltDeg = { deg: 190, basis: 'estimated' }; break;
    case 'tiltUpper': a.axis.tiltDeg.deg = 5; break;
    case 'tiltLevel': a.axis.tiltDeg.level = 120; break;
    case 'noAz': delete a.axis.azimuthDeg; break;
    case 'noTilt': delete a.axis.tiltDeg; break;
    case 'axisKey': a.axis.foo = 1; break;
    case 'compKey': a.axis.tiltDeg.bar = 1; break;
    case 'compSign': a.axis.tiltDeg.sign = 1; break;
    case 'refBad': a.axis.ref = 'spin'; break;
    case 'pairSame': a.axis.pair = [0, 0]; break;
    case 'pairOut': a.axis.pair = [0, 5]; break;
    case 'axisNoSource': delete a.axis.source; break;
    case 'pairZeroL': c.bodies[1].vx = c.bodies[0].vx; c.bodies[1].vy = c.bodies[0].vy; c.bodies[1].vz = c.bodies[0].vz; break;
    case 'senseBad': a.axis.sense = { sign: 0, basis: 'knob', default: 1, min: -1, max: 1 }; break;
    case 'senseSigma': a.axis.sense = { sign: 1, basis: 'estimated', sigmaDeg: 1 }; break;
    default: throw new Error('未知の場合 ' + key);
  }
  c.id = book.id + '__w324b-' + key;
  return c;
}

/* ───────── ③ 走行の列 ───────── */
/** 列の表。sys: j0737 | acen。make(find) は id → 本(器が HP.allPresets().find で引いて渡す)から写しを組む */
export const COLS = Object.freeze({
  j0737: Object.freeze({
    self: '内蔵の本(A = 推定の傾き 0°・B = 推定の傾き 40.6° —— 方位と B の角の読みはノブの既定)',
    tr: '第321便b の兄弟の写しの列 tr(並進だけ —— 📻 から)',
    off: 'OFF(本の abBody の physicsPatch —— 引きずりと G_loc を切る)',
    g1: 'geo1 の参照(📻 psrDoubleAB そのもの —— 二次元)',
    miss: '欠測の写し(両星 axis:null —— 版 1 の本の形・源の J は入らない)',
    JA: 'A だけ(A の傾き 0° —— B は欠測 axis:null)',
    JAm: 'A だけの向きを反転(A の axis −z —— 符号の対照・B は欠測)',
    JAvec: 'A だけを kind "J"・Jvec(JA と同じ J のベクトル —— R_src = R_d の形)',
    JAB: '本の軸を配列の形で(A [0,0,1]・B [sin 40.6°, 0, cos 40.6°] —— 傾きの形と同じ向き)',
    Bm: 'B の角の読みのノブ −1(139.4°)',
    Baz90: 'B の方位のノブ 90°', Baz180: 'B の方位のノブ 180°', Baz270: 'B の方位のノブ 270°',
    A32: 'A の推定の傾きを上限 3.2°(95% —— 方位 0°)に置いた列(推定の幅の感度 —— ノブではない)',
    Aaz90: 'A の方位のノブ 90°(傾き 0° では向きは同じ —— ビット同一の対照)' }),
  acen: Object.freeze({
    self: '内蔵の本 🔸(obsSpin —— fSrc 0.07・軸はノブの既定 0°)',
    tr: '🔶 alphaCenABInertial3d(並進だけ —— 同じ初期状態)',
    on: '🔶 + spinDrag {rot}(源の J なし —— R_src = R_d)',
    off: 'OFF(🔶 の abBody の physicsPatch)',
    kJ: '前の版の 🔸 の宣言(🔶 + spinDrag + sourceMoment {kind "J", f 0.07} —— 状態の自転の経路・軸 +z)',
    t180: '両星の傾きのノブ 180°(範囲の端 —— 向きの反転)',
    t90: '両星の傾きのノブ 90°(方位 0°)',
    t90az90: '両星の傾き 90°・方位 90°' }) });
/** ノブの値を変えた写し(HP.obsSpin.withKnob と同じ —— 宣言 book は変えない。範囲の内のノブだけ) */
export function knobOf(book, i, comp, value) {
  const c = clone(book), x = c.bodies[i].obsSpin.axis[comp];
  if (!x || x.basis !== 'knob') throw new Error('ノブでない ' + i + '/' + comp);
  const vk = comp === 'sense' ? 'sign' : 'deg';
  if (!(value >= x.min && value <= x.max)) throw new Error('範囲の外 ' + i + '/' + comp + ' ' + value);
  x[vk] = value; return c;
}
export function colBook(sys, col, find) {
  if (sys === 'j0737') {
    const book = clone(find('psrDoubleABInertial3d')), tag = (b) => { b.id = book.id + '__w324e-' + col; return b; };
    if (col === 'self') return book;
    if (col === 'tr') return L.siblingOf(clone(find('psrDoubleAB')), 'tr');
    if (col === 'off') return offOf(book);
    if (col === 'g1') return clone(find('psrDoubleAB'));
    if (col === 'miss') { for (const b of book.bodies) b.obsSpin.axis = null; return tag(book); }
    if (col === 'JA') { book.bodies[0].obsSpin.axis = [0, 0, 1]; book.bodies[1].obsSpin.axis = null; return tag(book); }
    if (col === 'JAm') { book.bodies[0].obsSpin.axis = [0, 0, -1]; book.bodies[1].obsSpin.axis = null; return tag(book); }
    if (col === 'JAvec') { const c = caseOf(book, 'Jvec'); c.bodies[1].obsSpin.axis = null; c.id = book.id + '__w324e-JAvec'; return c; }
    if (col === 'JAB') { book.bodies[0].obsSpin.axis = [0, 0, 1]; const t = J0737_SPIN.axisB.deg * Math.PI / 180; book.bodies[1].obsSpin.axis = [Math.sin(t), 0, Math.cos(t)]; return tag(book); }
    if (col === 'Bm') return tag(knobOf(book, 1, 'sense', -1));
    if (col === 'Baz90') return tag(knobOf(book, 1, 'azimuthDeg', 90));
    if (col === 'Baz180') return tag(knobOf(book, 1, 'azimuthDeg', 180));
    if (col === 'Baz270') return tag(knobOf(book, 1, 'azimuthDeg', 270));
    if (col === 'A32') { book.bodies[0].obsSpin.axis.tiltDeg.deg = J0737_SPIN.axisA.upper95Deg; return tag(book); }
    if (col === 'Aaz90') return tag(knobOf(book, 0, 'azimuthDeg', 90));
  } else {
    const book = clone(find('alphaCenABInertial3dJ')), tr = clone(find('alphaCenABInertial3d')), tag = (b) => { b.id = book.id + '__w324e-' + col; return b; };
    if (col === 'self') return book;
    if (col === 'tr') return tr;
    if (col === 'on') { tr.physics.relativeDrag.spinDrag = { rot: 'surfaceFlip' }; tr.id += '__w324e-on'; return tr; }
    if (col === 'off') return offOf(tr);
    if (col === 'kJ') { tr.physics.relativeDrag.spinDrag = { rot: 'surfaceFlip' }; tr.physics.relativeDrag.invSq.sourceMoment = { kind: 'J', f: { 0: 0.07, 1: 0.07 } }; tr.id += '__w324e-kJ'; return tr; }
    if (col === 't180') return tag(knobOf(knobOf(book, 0, 'tiltDeg', 180), 1, 'tiltDeg', 180));
    if (col === 't90') return tag(knobOf(knobOf(book, 0, 'tiltDeg', 90), 1, 'tiltDeg', 90));
    if (col === 't90az90') { let b = knobOf(knobOf(book, 0, 'tiltDeg', 90), 1, 'tiltDeg', 90); b = knobOf(knobOf(b, 0, 'azimuthDeg', 90), 1, 'azimuthDeg', 90); return tag(b); }
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
  'ノブの値を観測と呼ばない・推定の傾きを観測の軸と呼ばない(推定・ノブ・観測を文で混ぜない)', '器の中の列(ノブを振った列・推定の上限の列・欠測の写し)を本の既定と呼ばない', '文献の値は一次資料に当たっていない']);
