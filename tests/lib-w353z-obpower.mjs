// 第353便z(原仮定者の回答(2026-11-25 —— 第151報)AN1045「規則の半径」・AN1039「角運動量の重み」・統括の検証項目 R490):
//   **源の扁平率の入れ方を「冪の指数 n」で振る —— 母天体由来の (S) に掛ける距離に依らない倍を σ_n = (1 − f)^(−n/3) と書き、
//   イオ ← 木星の打ち消しの倍率 ÷ 金星の条件の値 x が 1 になる n(n★)・その入力の幅・n を作る読み替えの候補(式の冪の勘定)・同じ n をほかの題に掛けたときの動き —— 診断だけ**
//   (器 tests/exp-w353z-obpower.mjs と QA behavior.obpower353z・docs.obpower353z が読む —— html を読まない・ファイルを読まない・状態を持たない。後のラウンドの枝もこの口を import してよい)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない。既存の lib は呼ぶだけ(本文は変えない):
//   第353便p(localStd・rotP・bg1・moonWeights)・第353便d(obCancel・specFor・litOf・circRot)・第353便k(diskStd・planeStd)・第352便v(uVt)・第352便k(spinRot・srcRadius)・
//   第351便c(pairInput・PARENT_ROWS)・第348便h(YK)・第348便c(massOf)・第312便a(Kball)・第334便a(LIT334A —— 衛星の質量・軌道の半径〔文献の値・未照合〕)・第347便e(t1Table・geometry)。
//   仮の値の lib(第352便b)には届かない(import の閉包に入れない —— 枝 j・l の lib は呼ばない)。
//
// ■ 量: x(n) = abs(局所の太陽由来 + σ_n(f_母天体) × 局所の母天体由来) ÷ abs(金星 ← 太陽の (S))(〔第352便v〕〔第353便p〕の x —— 背景の向きと基準軸に依らない比)。
//   n = 2 は〔第353便d〕の (O2b)(体積を保つ扁平)の σ と同じ数(零試験)。太陽の扁平率(9e-6)は既定で掛けない(sun: true で太陽由来と金星にも σ_n(f_太陽) を掛ける)。
// ■ n★: x(n★) = 1 の n(二分)。入力の幅は、リポジトリの数の字の最後の桁 ±1(DECL.inputs)を 1 つずつ振って、同じ式(〔第353便p〕の rotP —— 源の半径は規則の半径 Y_k M に従う)で数え直す。
// ■ 式の冪: (S) の大きさの源の質量 M・源の半径 R・源の自転の率 ω への冪(1% 振った中央差)と閉じた形(源の外の場 s = M · R² ÷ (5 r³) —— 第312便a の Mball)。
//   読み替えの候補は、半径の倍 (1 − f)^(−p/3)・質量の倍 (1 − f)^(−q/3)・自転の率の倍 (1 − f)^(−w/3) と書いて、n = b p + a q + c w(冪の勘定)。
// ■ 扁平率の式・n の値・イオの状態は決めない(1 組の照合 —— 候補の表)。この場・この読み・このノブでは、の表。
import * as P from './lib-w353p-cancelstd.mjs';
import * as Dd from './lib-w353d-srcoblate.mjs';
import * as Kr from './lib-w353k-ringstd.mjs';
import * as V from './lib-w352v-cancelmap.mjs';
import * as K from './lib-w352k-spinform.mjs';
import * as SP from './lib-w351c-srcparts.mjs';
import * as G3 from './lib-w348h-axisgeo3.mjs';
import * as C from './lib-w348c-axisbalance.mjs';
import * as D from './lib-w312a-decay.mjs';
import * as E from './lib-w347e-spintorque.mjs';
import { LIT334A } from './lib-w334a-heightlaw.mjs';

export const LIB_VERSION = 'w353z-obpower-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const D2R = Math.PI / 180;
const { dot, crs, nrm, scl, add, sub, unit } = K.vec;
const rel = (a, b) => (Array.isArray(a) ? nrm(sub(a, b)) / Math.max(nrm(b), 1e-300) : Math.abs(a - b) / Math.max(Math.abs(b), 1e-300));

/* ───────── 宣言 ───────── */
export const DECL = Object.freeze({
  key: 'Io|Jupiter',
  /** 表 1 の n の走査(整数)と、幅の判定に並べる n */
  nScan: Object.freeze([0, 1, 2, 3, 4, 5, 6]), nProbe: Object.freeze([4.5, 5, 5.5]),
  /** 二分の区間 */
  nLo: -20, nHi: 40,
  /**
   * 入力(リポジトリの数の字 —— 文献の値・未照合)と最後の桁の 1 つ分(相対)。木星の f は σ の中だけ・ほかは同じ式で数え直す。
   * 木星の自転の率と太陽の自転の率は自転の周期の字(9.925 時間・25.05 日)から(率は周期の逆数 —— 周期の +1 は率の −)。
   */
  inputs: Object.freeze([
    Object.freeze({ id: 'fJ', name: '木星の扁平率 f', lit: '0.06487', unit: 1e-5 }),
    Object.freeze({ id: 'MJ', name: '木星の質量', lit: '1.898e27', unit: 0.001e27 }),
    Object.freeze({ id: 'PJ', name: '木星の自転の周期(時間)', lit: '9.925', unit: 0.001 }),
    Object.freeze({ id: 'aIo', name: 'イオの道の半径(m)', lit: '4.217e8', unit: 0.001e8 }),
    Object.freeze({ id: 'PSun', name: '太陽の自転の周期(日)', lit: '25.05', unit: 0.01 }),
    Object.freeze({ id: 'MSun', name: '太陽の質量', lit: '1.9885e30', unit: 0.0001e30 }),
    Object.freeze({ id: 'aV', name: '金星の道の半径(m)', lit: '1.08208e11', unit: 0.00001e11 })]),
  /** 置き方(n★ が動くか): 背景の向き・基準軸は x に入らない(比)—— 受け手の置き方は規則の半径・(P-応)(= 規則の半径の x)・(P-場) c_R */
  cRs: Object.freeze([1e-3, 0.0128]),
  /** 表 3 の n の列(n★ は器で足す) */
  nCols: Object.freeze([2, 5]),
  /** 表 3 の衛星(第334便a の LIT334A —— 文献の値・未照合 —— 母天体の赤道の円の道)と母天体 */
  moons: Object.freeze(['io', 'europa', 'ganymede', 'callisto', 'titan']), moonHost: Object.freeze({ jupiter: 'Jupiter', saturn: 'Saturn' }),
  /** 土星の環の区分(第353便k の diskStd の主の列 —— 源 規則の半径・受け手 観測半径 × c_R 1) */
  rings: Object.freeze(['ringC', 'ringB', 'ringA']),
  /** 0.98 の列(背景の倍率 0.98 で金星を等大にする換算の係数を置いたときのイオの残り —— 比なので金星の条件での残りと同じ数) */
  u98: 0.98,
  /** 点検の数(便の始めの数え直しの桁・第353便d の 0.93491・第352便v の 0.89414・第353便l の φ —— 3 桁) */
  anchor: Object.freeze({ x0: '0.894142', mStar: '1.11875', nStar: '5.019', x5: '0.99958', x3: '0.95598', x2: '0.93491', sunOverPar: '3.00e-3', uV: '1.192817e-12',
    phiL: Object.freeze({ europa: '3.42', ganymede: '3.36', callisto: '3.10', titan: '19.2' }) }),
  main: Object.freeze({ part: 'S', tSrc: 0, read: 'C2', bg: 'Np', axis: 'L' }),
  judge: '丸めの桁の床: 零試験は相対 1e-9(尺度の走り直しで揺れる)・点検の数は便の始めの数え直しの桁・逐語の表は有効数字 3〜4 桁',
});
const PJh = 9.925, PSd = 25.05;

/** σ_n(f) = (1 − f)^(−n/3) */
export function sigmaN(f, n) {
  if (!(fin(f) && f >= 0 && f < 1)) throw new RangeError('sigmaN: 0 ≤ f < 1');
  if (!fin(n)) throw new RangeError('sigmaN: n は有限の数');
  return Math.pow(1 - f, -n / 3);
}
/** σ から n へ(n = −3 ln σ ÷ ln(1 − f)) */
export function nOfSigma(sig, f) {
  if (!(fin(sig) && sig > 0 && fin(f) && f > 0 && f < 1)) throw new RangeError('nOfSigma: σ > 0・0 < f < 1');
  return -3 * Math.log(sig) / Math.log(1 - f);
}
/** 源の扁平率(リポジトリの数 —— 第334便a の LIT334A・文献の値・未照合) */
export const fOf = (src) => { const f = Dd.litOf(src).f; if (!fin(f)) throw new RangeError('fOf: 扁平率の無い源 ' + src); return f; };

/* ───────── x(n)(〔第353便p〕の localStd の由来の内訳に倍を掛ける)───────── */
/**
 * 組 key の局所の内訳(太陽由来・母天体由来)と金星の (S)。o: { cR(null = 規則の半径), place('rule'|'resp'|'field') }。
 * 'resp'((P-応))は場の式が規則の半径 —— 'rule' と同じ内訳(〔第353便p〕の (v) = (i))。
 */
export function partsOf(T1, GEO, key = DECL.key, { cR = null, place = 'rule' } = {}, cache = null) {
  if (!['rule', 'resp', 'field'].includes(place)) throw new RangeError('partsOf: 置き方は rule・resp・field');
  if (place === 'field' && !(fin(cR) && cR > 0)) throw new RangeError('partsOf: (P-場) は c_R > 0');
  const cr = place === 'field' ? cR : null;
  const L = P.localStd(T1, GEO, key, { ob: null, cR: cr }, cache), Lv = P.localStd(T1, GEO, 'Venus|Sun', { ob: null, cR: cr }, cache);
  if (!L.parts.parent) throw new RangeError('partsOf: 母天体の項の無い組 ' + key);
  return { sun: L.parts.sun, parent: L.parts.parent, venus: Lv.loc, src: key.split('|')[1] };
}
/** 内訳から x(n)。o: { fPar(母天体の f —— 既定はリポジトリの数), sun(太陽にも σ_n), fSun } */
export function xFromParts(Pt, n, { fPar = null, sun = false, fSun = null } = {}) {
  const fp = fPar === null ? fOf(Pt.src) : fPar, sp = sigmaN(fp, n), ss = sun ? sigmaN(fSun === null ? fOf('Sun') : fSun, n) : 1;
  return nrm(add(scl(Pt.sun, ss), scl(Pt.parent, sp))) / (ss * nrm(Pt.venus));
}
/** 約束の口: x(n)(イオ ← 木星が既定)。o: { cR, place, fOver(母天体の f の上書き —— ノブ), sun } */
export function xAtN(T1, GEO, key, n, { cR = null, place = 'rule', fOver = null, sun = false } = {}, cache = null) {
  return xFromParts(partsOf(T1, GEO, key, { cR, place }, cache), n, { fPar: fOver, sun });
}
/** 母天体の項の倍 m で x(m)(n と f に依らない —— 便の始めの数え直しの m★) */
export const xOfM = (Pt, m) => nrm(add(Pt.sun, scl(Pt.parent, m))) / nrm(Pt.venus);
/** x(m) = 1 の m(二分 —— 対数の区間)。無ければ null */
export function mStarOf(Pt, { lo = 1e-3, hi = 1e6 } = {}) {
  const g = (m) => xOfM(Pt, m) - 1;
  if (!(g(lo) * g(hi) < 0)) return null;
  for (let i = 0; i < 200; i++) { const mid = Math.sqrt(lo * hi); if (g(lo) * g(mid) <= 0) hi = mid; else lo = mid; }
  return Math.sqrt(lo * hi);
}
/** x(n) = 1 の n(二分)。無ければ null。o: { fPar, sun } */
export function nStarFromParts(Pt, { fPar = null, sun = false, lo = DECL.nLo, hi = DECL.nHi } = {}) {
  const g = (n) => xFromParts(Pt, n, { fPar, sun }) - 1;
  if (!(g(lo) * g(hi) < 0)) return null;
  for (let i = 0; i < 200; i++) { const mid = 0.5 * (lo + hi); if (g(lo) * g(mid) <= 0) hi = mid; else lo = mid; }
  return 0.5 * (lo + hi);
}

/* ───────── 入力を振った内訳(〔第353便p〕の rotP —— 同じ式・源の半径は規則の半径 Y_k M に従う)───────── */
/** 入力の倍(相対): { MJ, wJ, aIo, wSun, MSun, aV }(1 = そのまま)から、イオの内訳と金星を rotP で数え直す。倍 1 で localStd と同じ(零試験) */
export function pertParts(T1, GEO, s = {}) {
  const g = (k) => (s[k] === undefined ? 1 : s[k]);
  const PIo = SP.pairInput(T1, GEO, 'Io', 'Jupiter'), PIs = SP.pairInput(T1, GEO, 'Io', 'Sun'), PV = SP.pairInput(T1, GEO, 'Venus', 'Sun');
  const MJ = PIo.Ms * g('MJ'), MS = PIs.Ms * g('MSun');
  const pIo = { ...PIo, Ms: MJ, ws: PIo.ws * g('wJ'), a: PIo.a * g('aIo') };
  const aJ = PIs.a;   // 木星の道の半径は振らない(入力の一覧の外)
  const pIs = { ...PIs, Ms: MS, ws: PIs.ws * g('wSun'), a: aJ }, pV = { ...PV, Ms: MS, ws: PV.ws * g('wSun'), a: PV.a * g('aV') };
  const RJ = G3.YK * MJ, RS = G3.YK * MS, RrIo = G3.YK * PIo.m, RrV = G3.YK * PV.m;
  const wPar = MJ * D.Kball(1, pIo.a, RJ), wSun = MS * D.Kball(1, aJ, RS);
  const parent = P.rotP(pIo, { Rs: RJ, Rr: RrIo, extraW: wSun }).Om, sun = P.rotP(pIs, { Rs: RS, Rr: RrIo, extraW: wPar }).Om, venus = P.rotP(pV, { Rs: RS, Rr: RrV }).Om;
  return { sun, parent, venus, src: 'Jupiter' };
}
/** 入力 id を最後の桁 ±1(sgn)振ったときの倍(自転の率は周期の逆数) */
export function pertScale(id, sgn) {
  const I = DECL.inputs.find((x) => x.id === id); if (!I) throw new RangeError('pertScale: 入力 ' + id);
  const v = Number(I.lit), r = 1 + sgn * I.unit / v;
  if (id === 'fJ') return { fJ: v + sgn * I.unit };
  if (id === 'PJ') return { wJ: 1 / r }; if (id === 'PSun') return { wSun: 1 / r };
  return { [id]: r };
}
/** 約束の口: n★(イオ ← 木星)。o: { pert: [id, ±1] | null, cR, place, sun } → { nStar, mStar, x0, f } */
export function nStar(T1, GEO, key = DECL.key, { pert = null, cR = null, place = 'rule', sun = false } = {}, cache = null) {
  let Pt, fPar = null;
  if (pert) { if (key !== DECL.key || place === 'field') throw new RangeError('nStar: 入力の幅はイオ ← 木星・規則の半径だけ'); const s = pertScale(pert[0], pert[1]); Pt = pertParts(T1, GEO, s); if (s.fJ !== undefined) fPar = s.fJ; }
  else Pt = partsOf(T1, GEO, key, { cR, place }, cache);
  const f = fPar === null ? fOf(Pt.src) : fPar;
  const ms = mStarOf(Pt);
  return { key, pert, cR, place, f, x0: xOfM(Pt, 1), mStar: ms, nStar: nStarFromParts(Pt, { fPar: f, sun }), nFromM: ms === null ? null : nOfSigma(ms, f), sunOverPar: nrm(Pt.sun) / nrm(Pt.parent) };
}

/* ───────── 式の冪(源の質量 M・半径 R・自転の率 ω)───────── */
/** イオ ← 木星の母天体由来の (S) を rotP で(M・R・ω の倍) */
const parS = (T1, GEO, { m = 1, r = 1, w = 1, tie = false } = {}) => {
  const PIo = SP.pairInput(T1, GEO, 'Io', 'Jupiter'), PIs = SP.pairInput(T1, GEO, 'Io', 'Sun'), Ms = PIo.Ms * m, Rs = G3.YK * (tie ? Ms : PIo.Ms) * r;
  const wSun = PIs.Ms * D.Kball(1, PIs.a, G3.YK * PIs.Ms);
  return nrm(P.rotP({ ...PIo, Ms, ws: PIo.ws * w }, { Rs, Rr: G3.YK * PIo.m, extraW: wSun }).Om);
};
/**
 * 約束の口: (S) の大きさの冪。M・R・ω を ±h(相対 1%)振った中央差の冪 a・b・c と、規則の半径を Y_k M に従わせたときの M の冪 aTie。
 * 閉じた形(源の外の場 s = M R² ÷ (5 r³)・自分の重みが分母の主)では a 1・b 2・c 1・aTie 3。
 */
export function formPowers(T1 = E.t1Table(), GEO = E.geometry(), { h = 0.01 } = {}) {
  const pw = (o) => { const [k] = Object.keys(o).filter((x) => x !== 'tie'); const up = parS(T1, GEO, { ...o, [k]: 1 + h }), dn = parS(T1, GEO, { ...o, [k]: 1 - h }); return Math.log(up / dn) / Math.log((1 + h) / (1 - h)); };
  const a = pw({ m: 1 }), b = pw({ r: 1 }), c = pw({ w: 1 }), aTie = pw({ m: 1, tie: true });
  const PIo = SP.pairInput(T1, GEO, 'Io', 'Jupiter'), A0 = PIo.m * D.Kball(1, 0, G3.YK * PIo.m), wS = PIo.Ms * D.Kball(1, PIo.a, G3.YK * PIo.Ms);
  return { a, b, c, aTie, closed: { a: 1, b: 2, c: 1, aTie: 3 }, A0, wS, wSoverA0: wS / A0, h };
}
/**
 * 読み替えの候補(半径の倍 (1 − f)^(−p/3)・質量の倍 (1 − f)^(−q/3)・自転の率の倍 (1 − f)^(−w/3)・tie = 規則の半径が質量に従う)。
 * 冪の勘定 n = b p + a q + c w(tie: 半径の倍に質量の倍が掛かる)。nonPow は (1 − f) の冪で書けない倍(数で n を出す)。
 */
export const FORMS = Object.freeze([
  Object.freeze({ id: 'i', name: '(イ) 体積を保つ扁平(〔第353便d〕の (O2b) —— 規則の半径を体積の球の半径と読み、赤道の半径にする・質量はそのまま)', p: 1, q: 0, w: 0 }),
  Object.freeze({ id: 'ro', name: '(ロ) 半径を赤道の半径に —— 規則の半径を極の半径と読む(質量はそのまま)', p: 3, q: 0, w: 0 }),
  Object.freeze({ id: 'ro2', name: '(ロ′) 半径を赤道の半径に —— 規則の半径を平均の半径 (2a + c) ÷ 3 と読む(質量はそのまま)', nonPow: 'mean' }),
  Object.freeze({ id: 'ha', name: '(ハ) 半径を赤道の半径に(体積の球から)・質量も赤道の半径の同じ密度の球の分に', p: 1, q: 3, w: 0 }),
  Object.freeze({ id: 'ha2', name: '(ハ′) (ハ) を極の半径から(半径 ÷ (1 − f)・質量 ÷ (1 − f)³)', p: 3, q: 9, w: 0 }),
  Object.freeze({ id: 'ni', name: '(ニ) 半径を極の半径に(体積の球から・質量はそのまま)', p: -2, q: 0, w: 0 }),
  Object.freeze({ id: 'ho', name: '(ホ) 半径はそのまま・軸の比 a ÷ c = 1 ÷ (1 − f) を 1 つ掛ける', p: 0, q: 0, w: 3 }),
  Object.freeze({ id: 'he', name: '(ヘ) 質量だけ赤道の半径の同じ密度の球の分に(半径はそのまま)', p: 0, q: 3, w: 0 }),
  Object.freeze({ id: 'to', name: '(ト) 質量を赤道の半径の同じ密度の球の分に・規則の半径は Y_k × 質量に従う', p: 0, q: 3, w: 0, tie: true }),
  Object.freeze({ id: 'chi', name: '(チ) 体積を保つ扁平で角運動量を保つ(自転の率を慣性の量の比で割る)', p: 1, q: 0, w: -1 }),
  Object.freeze({ id: 'ri', name: '(リ) 慣性の量を赤道の半径の同じ密度の球の値 (2/5) M a² に読み、自転の率はそのまま(= (ハ))', p: 1, q: 3, w: 0 }),
]);
/** 候補 1 つの n: 勘定(冪 a・b・c から)と、rotP で倍を掛けて数えた σ からの n(f = 木星のリポジトリの数) */
export function formN(T1, GEO, F, Pw, { f = null } = {}) {
  const ff = f === null ? fOf('Jupiter') : f, s0 = parS(T1, GEO, {});
  if (F.nonPow === 'mean') {   // a = R × 3 ÷ (3 − f)(体積でなく平均の半径)
    const r = 3 / (3 - ff), sig = parS(T1, GEO, { r }) / s0;
    return { id: F.id, nCount: Pw.b * nOfSigma(r, ff), nClosed: Pw.closed.b * nOfSigma(r, ff), nNum: nOfSigma(sig, ff), sigma: sig };
  }
  const k = (e) => Math.pow(1 - ff, -e / 3), m = k(F.q), r = k(F.p), w = k(F.w);
  const sig = (F.tie ? parS(T1, GEO, { m, w, tie: true }) : parS(T1, GEO, { m, r, w })) / s0;
  const nCount = F.tie ? Pw.aTie * F.q + Pw.c * F.w : Pw.b * F.p + Pw.a * F.q + Pw.c * F.w;
  const nClosed = F.tie ? Pw.closed.aTie * F.q + Pw.closed.c * F.w : Pw.closed.b * F.p + Pw.closed.a * F.q + Pw.closed.c * F.w;
  return { id: F.id, nCount, nClosed, nNum: nOfSigma(sig, ff), sigma: sig };
}

/* ───────── 衛星(母天体の赤道の円の道 —— 〔第353便l〕の localOf の 'circ' と同じ作りを〔第353便d〕circRot と〔第352便k〕spinRot で)───────── */
export function moonParts(T1, GEO, mk, cache = null) {
  const ck = 'moon|' + mk; if (cache && cache[ck]) return cache[ck];
  const M = LIT334A.moons.find((x) => x.key === mk); if (!M) throw new RangeError('moonParts: 衛星 ' + mk);
  const src = DECL.moonHost[M.host], r2 = T1.find((r) => r.id === src && r.src === 'Sun' && r.mag === 'm2'), ax = unit(GEO[src + '|Sun'].w);
  const Ms = C.massOf(src), Rs = K.srcRadius(src, 0), wSun = K.spinRot(T1, GEO, src, 'Sun', { part: 'M', read: 'W', tSrc: 0, nPhase: 1 }).wS, wPar = Ms * D.Kball(1, M.a, Rs);
  const parent = Dd.circRot({ Ms, Rs, spinVec: scl(ax, Math.abs(r2.omega)), L: ax, r: M.a, m: M.m, extraW: wSun }).Om, sun = K.spinRot(T1, GEO, src, 'Sun', { part: 'S', tSrc: 0, read: 'C2', extraW: wPar }).Om;
  const venus = P.localStd(T1, GEO, 'Venus|Sun', { ob: null, cR: null }, cache).loc;
  const v = { key: mk, name: M.name, src, sun, parent, venus, sHat: ax, a: M.a };
  if (cache) cache[ck] = v; return v;
}
/** 内訳と背景(向き bg・基準軸 axis)から、金星の条件(倍率 uV = 金星の abs(S) ÷ abs(背景))での残りと φ */
export function resOf(T1, GEO, Pt, n, { fPar = null, bg = 'Np', axis = 'L', sun = false } = {}) {
  const fp = fPar === null ? fOf(Pt.src) : fPar, sp = sigmaN(fp, n), ss = sun ? sigmaN(fOf('Sun'), n) : 1;
  const loc = add(scl(Pt.sun, ss), scl(Pt.parent, sp)), b1 = P.bg1(T1, GEO, bg, axis), nb = nrm(b1), uV = ss * nrm(Pt.venus) / nb, uEq = nrm(loc) / nb;
  return { x: uEq / uV, resAtUV: nrm(add(scl(b1, uV), loc)) / (uV * nb), resEq: nrm(add(scl(b1, uEq), loc)) / (uEq * nb), phiDeg: Math.atan2(nrm(crs(scl(loc, -1), b1)), dot(scl(loc, -1), b1)) / D2R };
}
/** 0.98 の列: 背景の倍率 0.98・金星を等大にする換算の係数 k98 = 0.98 ÷ uV を局所に掛けたときの残り(比なので resAtUV と同じ数 —— 零試験) */
export function res098(T1, GEO, Pt, n, { fPar = null, bg = 'Np', axis = 'L' } = {}) {
  const fp = fPar === null ? fOf(Pt.src) : fPar, loc = add(Pt.sun, scl(Pt.parent, sigmaN(fp, n))), b1 = P.bg1(T1, GEO, bg, axis), nb = nrm(b1), uV = nrm(Pt.venus) / nb, k98 = DECL.u98 / uV;
  return { k98, res: nrm(add(scl(b1, DECL.u98), scl(loc, k98))) / (DECL.u98 * nb) };
}

/* ───────── 土星の環・公転面の集まり・金星(σ_n を掛けた動き)───────── */
/** 土星の環の率 ÷ 物差し(〔第353便k〕diskStd の主の列 —— 源 規則の半径・受け手 観測半径 × c_R 1・扁平なし)× σ_n(土星の f)。o2b は〔第353便k〕の O2b の列(零試験) */
export function ringAtN(key, n) {
  const y0 = Kr.diskStd(key, { src: 'rule', ob: 'O0' }).yard, s = sigmaN(fOf('Saturn'), n);
  return { key, n, yard0: y0, sigma: s, yard: y0 * s };
}
/** 公転面の集まり(〔第353便k〕planeStd —— 地球・規則の半径の受け手)× σ_n(太陽の f) */
export function planeAtN(T1, GEO, id, n) {
  const p0 = Kr.planeStd(T1, GEO, id, { src: 'rule', ob: 'O0' }), s = sigmaN(fOf('Sun'), n);
  return { id, n, v0: p0.v, sigma: s, v: p0.v * s };
}
/** 金星: 太陽の σ_n を太陽由来に掛けたときの金星の残り(金星の条件の倍率は球の uV のまま)—— 動かないことを数で */
export function venusAtN(T1, GEO, n, { bg = 'Np', axis = 'L' } = {}, cache = null) {
  const Lv = P.localStd(T1, GEO, 'Venus|Sun', { ob: null, cR: null }, cache).loc, b1 = P.bg1(T1, GEO, bg, axis), nb = nrm(b1), uV = nrm(Lv) / nb, s = sigmaN(fOf('Sun'), n), loc = scl(Lv, s);
  const res = nrm(add(scl(b1, uV), loc)) / (uV * nb), res0 = nrm(add(scl(b1, uV), Lv)) / (uV * nb);
  return { n, sigma: s, sigmaM1: Math.expm1(-n / 3 * Math.log1p(-fOf('Sun'))), res, res0, dRes: res - res0 };
}

/* ───────── 表 ───────── */
/** dn ÷ d(ln x) の増幅(n★ の近くで x が 1% 動くと n★ は約 0.45 動く —— 3 ÷ (−ln(1 − f)) の桁) */
export const nGain = (f) => 3 / (-Math.log(1 - f));
/** 表 1: イオ ← 木星の n の走査・n★ と入力の幅・置き方で n★ が動くか */
export function table1(T1, GEO, cache = null) {
  const Pt = partsOf(T1, GEO, DECL.key, {}, cache), f = fOf('Jupiter');
  const ns = [...new Set([...DECL.nScan, ...DECL.nProbe])].sort((a, b) => a - b);
  const scan = ns.map((n) => { const r = resOf(T1, GEO, Pt, n); return { n, sigma: sigmaN(f, n), x: r.x, dx: r.x - 1, resAtUV: r.resAtUV, resEq: r.resEq, phiDeg: r.phiDeg }; });
  const base = nStar(T1, GEO, DECL.key, {}, cache);
  const widths = DECL.inputs.map((I) => { const up = nStar(T1, GEO, DECL.key, { pert: [I.id, 1] }), dn = nStar(T1, GEO, DECL.key, { pert: [I.id, -1] });
    return { id: I.id, name: I.name, lit: I.lit, unit: I.unit, relUnit: I.unit / Number(I.lit), nPlus: up.nStar, nMinus: dn.nStar, dnPlus: up.nStar - base.nStar, dnMinus: dn.nStar - base.nStar, xPlus: up.x0, xMinus: dn.x0 }; });
  const all = widths.flatMap((w) => [w.nPlus, w.nMinus]), half = widths.map((w) => 0.5 * Math.abs(w.nPlus - w.nMinus));
  const rss = Math.sqrt(half.reduce((s, h) => s + h * h, 0)), lin = half.reduce((s, h) => s + h, 0);
  const range = { min: Math.min(...all), max: Math.max(...all), rss, lin, rssLo: base.nStar - rss, rssHi: base.nStar + rss, linLo: base.nStar - lin, linHi: base.nStar + lin };
  const probes = DECL.nProbe.map((n) => ({ n, inOne: n >= range.min && n <= range.max, inRss: Math.abs(n - base.nStar) <= rss, inLin: Math.abs(n - base.nStar) <= lin, sigmas: (n - base.nStar) / rss }));
  const xAt = (bg, axis) => resOf(T1, GEO, Pt, 5, { bg, axis }).x;
  const places = [
    { id: 'NpL', name: '(N+)・L・規則の半径(主の列)', nStar: base.nStar, x5: xAt('Np', 'L') },
    { id: 'Npeq', name: '(N+)・eq・規則の半径(比べる列)', nStar: nStarFromParts(Pt), x5: xAt('Np', 'eq') },
    { id: 'GmL', name: '(G−)・L・規則の半径(比べる列)', nStar: nStarFromParts(Pt), x5: xAt('Gm', 'L') },
    { id: 'resp', name: '(P-応)(場の式は規則の半径)', nStar: nStar(T1, GEO, DECL.key, { place: 'resp' }, cache).nStar, x5: xAtN(T1, GEO, DECL.key, 5, { place: 'resp' }, cache) },
    { id: 'sun', name: '太陽由来と金星にも σ_n(太陽の f)', nStar: nStar(T1, GEO, DECL.key, { sun: true }, cache).nStar, x5: xAtN(T1, GEO, DECL.key, 5, { sun: true }, cache) },
    ...DECL.cRs.map((cR) => { const r = nStar(T1, GEO, DECL.key, { cR, place: 'field' }, cache); return { id: 'field-' + cR, name: '(P-場) c_R ' + cR, nStar: r.nStar, nFromM: r.nFromM, mStar: r.mStar, x0: r.x0, x5: xAtN(T1, GEO, DECL.key, 5, { cR, place: 'field' }, cache) }; }),
  ];
  return { f, gain: nGain(f), scan, base, widths, range, probes, places };
}
/** 表 2: (S) の冪と読み替えの候補の n */
export function table2(T1, GEO, cache = null) {
  const Pw = formPowers(T1, GEO), Pt = partsOf(T1, GEO, DECL.key, {}, cache), f = fOf('Jupiter');
  const forms = FORMS.map((F) => { const r = formN(T1, GEO, F, Pw); return { id: F.id, name: F.name, p: F.p === undefined ? null : F.p, q: F.q === undefined ? null : F.q, w: F.w === undefined ? null : F.w, tie: !!F.tie, nonPow: F.nonPow || null, ...r, xIo: xOfM(Pt, r.sigma) }; });
  const hits = forms.filter((x) => Math.abs(x.nClosed - 5) < 1e-9).map((x) => x.id);
  const near = forms.reduce((b, x) => (Math.abs(x.nNum - 5) < Math.abs(b.nNum - 5) - 1e-6 ? x : b));   // 同じ n の候補は先の行(尺度の走り直しで入れ替わらない)
  return { f, powers: Pw, forms, hits5: hits, nearest: near.id };
}
/** 表 3: 同じ n をほかの題に(n 2・5・n★) */
export function table3(T1, GEO, nS, cache = null) {
  const cols = [...DECL.nCols, nS];
  const moons = DECL.moons.map((mk) => { const M = moonParts(T1, GEO, mk, cache), f = fOf(M.src), ms = mStarOf(M);
    return { key: mk, name: M.name, src: M.src, f, sunOverPar: nrm(M.sun) / nrm(M.parent), cells: cols.map((n) => { const r = resOf(T1, GEO, M, n); return { n, x: r.x, resAtUV: r.resAtUV, phiDeg: r.phiDeg }; }),
      x0: xOfM(M, 1), nStar: nStarFromParts(M), mStar: ms, nFromM: ms === null ? null : nOfSigma(ms, f) }; });
  const rings = DECL.rings.map((k) => ({ key: k, yard0: ringAtN(k, 0).yard, cells: cols.map((n) => { const r = ringAtN(k, n); return { n, sigma: r.sigma, yard: r.yard }; }) }));
  const plane = cols.map((n) => planeAtN(T1, GEO, 'Earth', n)), venus = cols.map((n) => venusAtN(T1, GEO, n, {}, cache));
  const Pt = partsOf(T1, GEO, DECL.key, {}, cache), io098 = cols.map((n) => ({ n, ...res098(T1, GEO, Pt, n), resAtUV: resOf(T1, GEO, Pt, n).resAtUV }));
  return { cols, moons, rings, plane, venus, io098, ioPairVsCirc: { pair: nStarFromParts(Pt), circ: moons[0].nStar } };
}

/* ───────── 零試験 ───────── */
export function pureScenes(T1 = E.t1Table(), GEO = E.geometry()) {
  const cache = {}, Pt = partsOf(T1, GEO, DECL.key, {}, cache), f = fOf('Jupiter');
  const x0 = xFromParts(Pt, 0), x2 = xFromParts(Pt, 2), x3 = xFromParts(Pt, 3), x5 = xFromParts(Pt, 5), ms = mStarOf(Pt), ns = nStarFromParts(Pt);
  // 〔第353便d〕obCancel の obPar: (O2b) と、σ_n をそのまま渡した形(n 2・5)
  const oc2 = Dd.obCancel(T1, GEO, DECL.key, { obPar: Dd.specFor('Jupiter', { model: 'O2b', f: 'lit', rq: 'rule' }) }).eqOverUV;
  const oc5 = Dd.obCancel(T1, GEO, DECL.key, { obPar: { model: 'O1x', epsW: 0, epsS: 0, sigma: sigmaN(f, 5), Rq: 1 } }).eqOverUV;
  const ocS = Dd.obCancel(T1, GEO, DECL.key, { obPar: null }).eqOverUV;
  // 〔第353便p〕表 1 の (ii) の列(イオ —— 源に (O2b)・太陽にも σ)と sun: true の n 2
  const st = P.stdCancel(T1, GEO, DECL.key, { place: 'ob' }, cache), stR = P.stdCancel(T1, GEO, DECL.key, { place: 'rule' }, cache);
  const x2sun = xFromParts(Pt, 2, { sun: true });
  // 入力を振らない rotP の内訳が localStd と同じ
  const Q = pertParts(T1, GEO, {}), vsPert = Math.max(rel(Q.sun, Pt.sun), rel(Q.parent, Pt.parent), rel(Q.venus, Pt.venus));
  // 冪
  const Pw = formPowers(T1, GEO);
  // 環: 〔第353便k〕の O2b の列 = O0 × σ_2(土星)
  const rO2b = Kr.diskStd('ringB', { src: 'rule', ob: 'O2b' }).yard, rN2 = ringAtN('ringB', 2).yard;
  // 衛星の φ(〔第353便l〕の localOf 'circ' の点検の数 —— 3 桁)・イオの円の道の作り
  const phis = Object.fromEntries(['europa', 'ganymede', 'callisto', 'titan'].map((mk) => { const M = moonParts(T1, GEO, mk, cache); return [mk, resOf(T1, GEO, M, 0, { fPar: 0 }).phiDeg]; }));
  // 0.98 の列 = 金星の条件での残り
  const r98 = res098(T1, GEO, Pt, 2), rUV = resOf(T1, GEO, Pt, 2);
  // 拒否
  const rj = (fn) => { try { fn(); return false; } catch (e) { return e instanceof RangeError; } };
  const rejects = [rj(() => sigmaN(1, 2)), rj(() => sigmaN(0.1, NaN)), rj(() => xAtN(T1, GEO, 'Venus|Sun', 2)), rj(() => partsOf(T1, GEO, DECL.key, { place: 'field' })), rj(() => pertScale('xx', 1)),
    rj(() => nStar(T1, GEO, 'Moon|EarthHi', { pert: ['MJ', 1] })), rj(() => moonParts(T1, GEO, 'phobos')), rj(() => fOf('Charon'))];
  return { x0, x2, x3, x5, ms, ns, oc2, oc5, ocS, stII: st.x, stI: stR.x, x2sun, vsPert, Pw, rO2b, rN2, phis, r98: r98.res, rUV: rUV.resAtUV, sunOverPar: nrm(Pt.sun) / nrm(Pt.parent), uV: V.uVt(T1, GEO, 0), rejects };
}
export function pureGates(S) {
  const A = DECL.anchor, p6 = (x, s) => x.toPrecision(s.replace(/^0\.0*|\.|e.*$/g, '').length) === Number(s).toPrecision(s.replace(/^0\.0*|\.|e.*$/g, '').length);
  return {
    anchor4: p6(S.x0, A.x0) && p6(S.ms, A.mStar) && S.ns.toFixed(3) === A.nStar && p6(S.x5, A.x5) && p6(S.x3, A.x3) && p6(S.x2, A.x2) && S.sunOverPar.toExponential(2) === A.sunOverPar && S.uV.toExponential(6) === A.uV,
    obCancel353d: rel(S.x2, S.oc2) < 1e-9 && rel(S.x5, S.oc5) < 1e-9 && rel(S.x0, S.ocS) < 1e-9,
    stdCancel353p: rel(S.x2sun, S.stII) < 1e-9 && rel(S.x0, S.stI) < 1e-9,
    pertIdentity: S.vsPert < 1e-9,
    powers: Math.abs(S.Pw.a - 1) < 1e-6 && Math.abs(S.Pw.b - 2) < 1e-6 && Math.abs(S.Pw.c - 1) < 1e-6 && Math.abs(S.Pw.aTie - 3) < 1e-6,
    ring353k: rel(S.rN2, S.rO2b) < 1e-9,
    moonPhi353l: Object.entries(A.phiL).every(([k, v]) => S.phis[k].toPrecision(3) === v),
    col098: rel(S.r98, S.rUV) < 1e-9,
    rejects: S.rejects.length === 8 && S.rejects.every(Boolean),
  };
}
