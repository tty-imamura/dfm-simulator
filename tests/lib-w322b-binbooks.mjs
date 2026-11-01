// 第322便b(原仮定者の回答(2026-11-01 —— AN499)「『連星サンプル群』は実在天体を指している。検証サンプルが必要であれば、先に用意する」・決断事項 AN505・AN508・
//   統括の検証項目 R271 —— 策定の段 S2): **geoPN=3 の連星の内蔵の第一陣の lib**(器 tests/exp-w322b-binbooks.mjs が使う —— 純関数と宣言の型だけ)。
//
// ■ 何を置くか
//   ① 内蔵にした 4 本の表(本の id・元の本〔第321便b の兄弟の写しの元 —— 玩具 eq-e・r3-e は lib-w321b の toyBook、実在の連星は在位の本〕・geo1 の参照の作り方)。
//   ② OFF の対照の宣言(本の abBody の physicsPatch を本の physics に重ねる —— null の鍵は外す)と、第321便b の写しの列 off との同一の照合に使う形。
//   ③ (1 + (4/3)η) の表(系ごとの η —— 有限質量比の既知の寄与として表示するだけ・補正の係数は入れない —— AN505)。
//   ④ NS の観測の自転の欄の設計(AN508 —— 実装しない・鍵の案と受理・拒否の表・S.spin 不変の試験の案)—— 文書と QA が読む宣言の表。
//
// ■ 言わないこと: 連星の観測との照合と呼ばない・近点の移動の原因を述べない・h・h/2・h/4 を収束の判定に使わない(刻みの感度診断)・
//   (1 + (4/3)η) を補正の係数として使わない・恒星連星で一律の値と書かない・周期の一致を系全体の合格に広げない。
import * as L from './lib-w321b-geo3bin.mjs';

export const LIB_VERSION = 'w322b-binbooks-lib-2';   // 第322便e: 検証サンプルの写しに c₀ = 30 の宣言(TOY_C0 —— 原仮定者の回答 AN519)
const clone = (x) => JSON.parse(JSON.stringify(x));

/* ───────── ① 内蔵にした 4 本 ───────── */
/** 本の表(並びは表の並び —— 検証サンプル → シリウス → α Cen)。src: 'toy'(玩具の鍵)か 'book'(在位の本の id)。 */
export const BOOKS = Object.freeze([
  Object.freeze({ id: 'binaryCheckEqualInertial3d', emoji: '♊', base: '🧪', ja: '検証サンプル 等質量', src: 'toy', toy: 'eq-e', geo1: 'w321bToy-eq-e' }),
  Object.freeze({ id: 'binaryCheckRatio3Inertial3d', emoji: '⚖️', base: '🧪', ja: '検証サンプル 質量比 1:3', src: 'toy', toy: 'r3-e', geo1: 'w321bToy-r3-e' }),
  Object.freeze({ id: 'siriusABInertial3d', emoji: '🌠', base: '🌟', ja: 'シリウス AB(無自転)', src: 'book', book: 'siriusAB', geo1: 'siriusAB' }),
  Object.freeze({ id: 'alphaCenABInertial3d', emoji: '🔶', base: '✨', ja: 'α Cen AB(並進だけ)', src: 'book', book: 'alphaCenAB', geo1: 'alphaCenAB' })]);
export const BOOK_IDS = Object.freeze(BOOKS.map((b) => b.id));
/** 玩具の雛形の本(第321便b と同じ —— 在位の恒星連星の型) */
export const TPL_ID = 'alphaCenAB';
/** 本の宣言の期待(受理した宣言で見る —— 在位の family の variant・K1 + rdRule "kappaM" + initMotion "observed"・並進だけ・G_loc kappaC2) */
export const DECL_EXPECT = Object.freeze({ coord: '3d', geoPN: 3, kFrame: 0, lambdaPN: 0, relativeDrag: clone(L.K1_DRAG), gLoc: clone(L.GLOC), sampleClass: 'principle', notClaim: 'binary_geo3' });

/* ───────── ①′ 第322便e(原仮定者の回答(2026-11-01 —— AN519)「c₀=30 に直す」・統括の検証項目 R274): 検証サンプルの c₀ = 30 の宣言 ───────── */
//   内蔵の本は c₀ = 30 か実 c の値(c₀ = 30 一律規約 —— QA light.canonical-builtins)。検証サンプル ♊⚖️ の写しの元は第321便b の玩具(lib-w321b の toyBook —— c = 10 のまま・
//   第321便b の器・正本・QA は変えない)で、本の側は c₀ = 30 へ直した。照合の相手は「第321便b の玩具に c₀ = 30 の宣言を当てた写し」: 変える鍵は cLight と、同じ規則
//   (toyBook と同じ演算 G/(c·c))で c から導く従属の宣言 kappaT = G/c₀² の 2 つだけ。G・質量・a・e・初期の位置と速度・stepDt・軟化・timeRef・步数は玩具のまま。
//   c から導くが宣言に書かない量(G_loc の係数 G/c₀²〔kappa "lock"〕・K1 の規則の R_d = Y_k m〔Y_k = 10G/(C₁c²)〕・q_1PN)は受理器とエンジンが本の G・c から作る。
export const TOY_C0 = Object.freeze({ cLight: 30, from: 10, keys: Object.freeze(['cLight', 'kappaT']),
  why: '原仮定者の回答(2026-11-01 —— AN519)「c₀=30 に直す」—— 内蔵の本は c₀ = 30 か実 c の値(c₀ = 30 一律規約)。G = 1・質量・a = 100・e = 0.5・初期状態・刻み・步数は第321便b の玩具のまま(GM/(c₀²a) = 1/90000)' });
/** 玩具の写しに c₀ = 30 の宣言を当てる(cLight と従属の kappaT = G/(c₀·c₀) —— toyBook と同じ演算の順) */
export function applyToyC0(book) {
  const c = clone(book), ph = c.physics;
  ph.cLight = TOY_C0.cLight; ph.kappaT = ph.G / (TOY_C0.cLight * TOY_C0.cLight);
  return c;
}
/** 第321便b の玩具そのもの(c = 10 —— c₀ = 30 の宣言を当てる前) */
export function toy321bOf(spec, find) { return L.toyBook(L.TOYS.find((t) => t.key === spec.toy), find(TPL_ID).physics); }
/** 元の本(geo1 の二次元 —— 玩具は toyBook に c₀ = 30 の宣言を当てた写し・実在は在位の本の写し)。find は id → 本(器が HP.allPresets().find で引いて渡す) */
export function geo1Of(spec, find) {
  if (spec.src === 'toy') return applyToyC0(toy321bOf(spec, find));
  return clone(find(spec.book));
}
/** c₀ = 30 の宣言が変えた鍵(第321便b の写しの列 col と本便の写しの列 col の差 —— 玩具は TOY_C0.keys だけ・physics の外は同じ・実在の連星は差なし) */
export function c0DiffOf(spec, find, col) {
  const a = spec.src === 'toy' ? L.siblingOf(toy321bOf(spec, find), col) : L.siblingOf(clone(find(spec.book)), col), b = siblingCol(spec, find, col);
  const keys = [...new Set(Object.keys(a.physics).concat(Object.keys(b.physics)))].filter((k) => JSON.stringify(a.physics[k]) !== JSON.stringify(b.physics[k])).sort();
  const restSame = JSON.stringify(Object.assign({}, a, { physics: null })) === JSON.stringify(Object.assign({}, b, { physics: null }));
  return { keys, restSame, from: a.physics.cLight, to: b.physics.cLight, kappaFrom: a.physics.kappaT, kappaTo: b.physics.kappaT };
}
/** 第321便b の兄弟の写し(列 col)—— 内蔵の本と受理後の宣言を照合する相手 */
export function siblingCol(spec, find, col) { return L.siblingOf(geo1Of(spec, find), col); }

/* ───────── ② OFF の対照(本の abBody の physicsPatch を重ねる) ───────── */
/** physicsPatch を本の physics に重ねた写し(鍵ごとに置き換え・null の鍵は外す —— 走行の側の B の作り方と同じ鍵の扱い) */
export function offOf(book) {
  const c = clone(book), pp = (book.abBody && book.abBody.physicsPatch) || {};
  for (const k of Object.keys(pp)) { if (pp[k] === null) delete c.physics[k]; else c.physics[k] = clone(pp[k]); }
  c.id = book.id + '__w322b-off'; delete c.abBody;
  return c;
}

/* ───────── ③ (1 + (4/3)η) ───────── */
/** 系ごとの η と 1 + (4/3)η(表示の桁 —— 本の文と照合する) */
export function etaOf(book) {
  const a = L.analyticOf(book), f = 1 + 4 * a.eta / 3;
  return { eta: a.eta, f, pct: (f - 1) * 100, etaTxt: a.eta.toFixed(5).replace(/0+$/, '').replace(/\.$/, ''), fTxt: f.toFixed(5), pctTxt: '+' + ((f - 1) * 100).toFixed(2) + '%', q1PN: a.q1PN, pred43: a.pred43, a: a.a, e: a.e, P: a.P };
}
export const NOT_CLAIM = Object.freeze(['連星の観測との照合ではない(同じ初期状態・同じ窓の写しどうしの量ごとの比)', '近点の移動の原因を述べない',
  'h・h/2・h/4 を収束の判定に使わない(刻みの感度診断)', '(1 + (4/3)η) を補正の係数に使わない(既知の寄与の表示だけ)', '恒星連星で一律の値と書かない(系ごとの η)',
  '周期だけの一致を系全体の合格に広げない(量ごとの表)', 'NS の観測の自転の欄を実装したと書かない(設計だけ —— エンジンは変えない)']);

/* ───────── ④ NS の観測の自転の欄の設計(AN508 —— 実装しない) ───────── */
/** 欄の鍵の案(本の天体ごと —— 源のモーメントの**読み取り専用の別の欄**。S.spin へ注入しない) */
export const NS_OBS_SPIN_KEYS = Object.freeze([
  Object.freeze({ key: 'obsSpin.kind', ja: '"J"(角運動量ベクトルを直接)か "omega"(観測の Ω + 明示の f_src + 観測半径)—— 排他(両方の鍵は拒否)' }),
  Object.freeze({ key: 'obsSpin.J', ja: 'kind "J" のとき: 角運動量の大きさ(SI —— kg m²/s)。f_src・R_obs と一緒に置かない' }),
  Object.freeze({ key: 'obsSpin.omega', ja: 'kind "omega" のとき: 観測の自転の角速度(SI —— rad/s・パルスの周期 P から 2π/P)' }),
  Object.freeze({ key: 'obsSpin.fSrc', ja: 'kind "omega" のとき必須: 源の慣性係数 I/(m R²)(明示 —— 既定の値を置かない・0 < f ≤ 2/3)' }),
  Object.freeze({ key: 'obsSpin.rObs', ja: 'kind "omega" のとき必須: 観測半径(SI —— m・EOS の代理なら出典に書く)' }),
  Object.freeze({ key: 'obsSpin.axis', ja: '必須: 軸(黄道座標の傾き・方位〔度〕か単位ベクトル)。不明なら null —— **欠測のまま**(軌道の法線を代わりに置かない)' }),
  Object.freeze({ key: 'obsSpin.unit', ja: '必須: 単位の宣言("SI")—— 本の単位へは受理器が scaleExp で換算(換算の値は受理後の宣言に書く)' }),
  Object.freeze({ key: 'obsSpin.source', ja: '必須: 出典(観測の文献・表)' }),
  Object.freeze({ key: 'obsSpin.epoch', ja: '必須: 元期(MJD か年 —— 自転の変化〔スピンダウン〕は読まない —— 元期の値のまま)' })]);
/** 受理・拒否の表(案)—— expect: 'accept' | 'reject' | 'missing'(受理して欄を欠測のまま) */
export const NS_OBS_SPIN_CASES = Object.freeze([
  Object.freeze({ key: 'J-direct', ja: 'kind "J"・J・axis・unit・source・epoch', expect: 'accept' }),
  Object.freeze({ key: 'omega-full', ja: 'kind "omega"・omega・fSrc・rObs・axis・unit・source・epoch', expect: 'accept' }),
  Object.freeze({ key: 'both', ja: 'J と omega を両方(排他の違反)', expect: 'reject' }),
  Object.freeze({ key: 'omega-noF', ja: 'kind "omega" で fSrc が無い(既定の f を置かない)', expect: 'reject' }),
  Object.freeze({ key: 'omega-noR', ja: 'kind "omega" で rObs が無い', expect: 'reject' }),
  Object.freeze({ key: 'f-big', ja: 'fSrc > 2/3(一様な球の 2/5 を超えた上限の外)', expect: 'reject' }),
  Object.freeze({ key: 'no-source', ja: 'source か epoch か unit が無い', expect: 'reject' }),
  Object.freeze({ key: 'axis-null', ja: 'axis が null(軸が不明 —— 欠測)', expect: 'missing' }),
  Object.freeze({ key: 'spin-inject', ja: '欄の値を body.spin(S.spin)へ写す宣言(spinFromObs など)', expect: 'reject' }),
  Object.freeze({ key: '2d-book', ja: '二次元の本(coord なし)に欄', expect: 'reject' })]);
/** S.spin 不変の試験の案(実装の便の QA —— 欄を足した本と足さない本で S.spin・状態のビットを比べる) */
export const NS_SPIN_INVARIANT_TESTS = Object.freeze([
  '欄を足した本と足さない本(他は同じ宣言)の受理後の bodies[].spin が同じ・S.spin の初期値が同じ',
  '源のモーメントを使わない宣言(spinDrag なし)で走行の状態が全步でビット同一(欄は読み取り専用)',
  '源のモーメントを使う宣言(sourceMoment に obsSpin を引く鍵)では S.spin の時系列が欄の無い本と同じ(自転の力学 —— 潮汐・自転の変化 —— を通さない)',
  '軸が欠測の本は源のモーメントの向きを置かない(軌道の法線で埋めない)—— 受理の警告に欠測の文']);
