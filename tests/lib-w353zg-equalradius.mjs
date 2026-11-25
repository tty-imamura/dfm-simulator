// 第353便zg(原仮定者の回答(2026-11-25 —— 第151報)「向きと幾何」・AN1045「規則の半径」・AN1039「角運動量の重み」・AN1034・統括の検証項目 R495):
//   **局所の項(太陽由来 + 母天体の自転の分)の大きさが、金星の局所の項(太陽の自転の分)と同じになる母天体の赤道の円の道の半径 a★(「等大の半径」)を数え、
//   リポジトリに在る衛星と環の半径と並べる・入力の幅・閉じた形・偶然の並びの見込み(概算)・a★ の内と外の合成の軸 —— 診断だけ**
//   (器 tests/exp-w353zg-equalradius.mjs と QA behavior.equalradius353zg・docs.equalradius353zg が読む —— html を読まない・ファイルを読まない・状態を持たない。後のラウンドの枝もこの口を import してよい)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない。既存の lib は呼ぶだけ(本文は変えない):
//   第353便z(moonParts・xFromParts・sigmaN・fOf)・第353便p(localStd・rotP・bg1)・第353便d(circRot・litOf)・第352便v(uVt)・第352便k(spinRot・srcRadius)・第351便c(pairInput)・
//   第348便h(YK)・第348便c(massOf)・第338便d(LIT.regions —— 土星の環の区分の内縁と外縁〔文献の値・未照合〕)・第337便c(BODY_SRC —— 月・フォボス・ダイモスの道の半径)・第312便a(Kball)・第334便a(LIT334A —— 衛星と環の半径〔文献の値・未照合〕)・第347便e(t1Table・geometry)。
//   仮の値の lib(第352便b)には届かない(import の閉包に入れない —— 枝 j・l・t の lib は呼ばない)。
//
// ■ 量: x(a) = abs(局所の太陽由来 + σ × 局所の母天体由来) ÷ abs(金星 ← 太陽の (S))(〔第353便z〕の moonParts と同じ作り —— 母天体の赤道の円の道の半径 a を振る)。
//   σ = (1 − f)^(−n/3)(n 0 = 扁平の倍なし・n 2 =〔第353便d〕(O2b)・n 5 =〔第353便z〕の (ハ))。a★: x(a★) = 1(二分 —— 対数の区間)。
// ■ 閉じた形: 母天体由来 ∝ 源の質量 × 規則の半径² × 自転の率 ÷ a³ = Y_k² M³ ω ÷ a³(自分の重みは受け手に依らない —— 3 ÷ (2 Y_k))。
//   a★₀ = a_金星 ×(M ÷ M_太陽)×(ω ÷ ω_太陽)^(1/3)× σ^(1/3)・幾何の補正(赤道の場の角の因子 ÷ 金星の位置の因子)・太陽由来の分の補正(ベクトルの和の 2 次の式)。
// ■ 合成の軸: 局所 + 背景((N+)・基準軸 L)。背景の大きさは金星の条件(uV —— 金星の局所と同じ大きさ)か 0.98(局所に換算の係数 0.98 ÷ uV を掛ける —— 比なので同じ軸)。
// ■ a★ と構造の並び・偶然の並びの見込みは候補の表と概算(2 組の照合 —— 判定にしない)。この場・この読み・このノブでは、の表。
import * as Z from './lib-w353z-obpower.mjs';
import * as P from './lib-w353p-cancelstd.mjs';
import * as Dd from './lib-w353d-srcoblate.mjs';
import * as V from './lib-w352v-cancelmap.mjs';
import * as K from './lib-w352k-spinform.mjs';
import * as SP from './lib-w351c-srcparts.mjs';
import * as G3 from './lib-w348h-axisgeo3.mjs';
import * as C from './lib-w348c-axisbalance.mjs';
import * as TL from './lib-w337c-tidelock.mjs';
import * as RB from './lib-w338d-ringbook.mjs';
import * as D from './lib-w312a-decay.mjs';
import * as E from './lib-w347e-spintorque.mjs';
import { LIT334A } from './lib-w334a-heightlaw.mjs';

export const LIB_VERSION = 'w353zg-equalradius-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const D2R = Math.PI / 180;
const { dot, crs, nrm, scl, add, sub, unit } = K.vec;
const rel = (a, b) => (Array.isArray(a) ? nrm(sub(a, b)) / Math.max(nrm(b), 1e-300) : Math.abs(a - b) / Math.max(Math.abs(b), 1e-300));
const ang = (a, b) => Math.atan2(nrm(crs(a, b)), dot(a, b)) / D2R;

/* ───────── 宣言 ───────── */
export const DECL = Object.freeze({
  /** 母天体(LIT334A の host の名 → 源の名) */
  hosts: Object.freeze({ jupiter: 'Jupiter', saturn: 'Saturn' }),
  /** ほかの母天体(表 2 —— a★ が観測の半径より内なら「母天体の内」) */
  others: Object.freeze(['Earth', 'Mars', 'Uranus', 'Neptune']),
  /** 扁平の倍の入れ方(σ = (1 − f)^(−n/3)): 0 = 倍なし・2 =〔第353便d〕(O2b)・5 =〔第353便z〕(ハ) */
  nList: Object.freeze([0, 2, 5]),
  /** a★ の二分の区間(観測の半径の倍) */
  aLo: 1e-3, aHi: 1e3,
  /** 入力(リポジトリの数の字 —— 文献の値・未照合)と最後の桁の 1 つ分。自転の率は周期の逆数(周期の +1 は率の −) */
  inputs: Object.freeze({
    Jupiter: Object.freeze([
      Object.freeze({ id: 'M', name: '木星の質量', lit: '1.898e27', unit: 0.001e27 }),
      Object.freeze({ id: 'P', name: '木星の自転の周期(時間)', lit: '9.925', unit: 0.001 }),
      Object.freeze({ id: 'f', name: '木星の扁平率 f', lit: '0.06487', unit: 1e-5 })]),
    Saturn: Object.freeze([
      Object.freeze({ id: 'M', name: '土星の質量', lit: '5.6834e26', unit: 0.0001e26 }),
      Object.freeze({ id: 'P', name: '土星の自転の周期(時間)', lit: '10.656', unit: 0.001 }),
      Object.freeze({ id: 'f', name: '土星の扁平率 f', lit: '0.09796', unit: 1e-5 })]),
    common: Object.freeze([
      Object.freeze({ id: 'PSun', name: '太陽の自転の周期(日)', lit: '25.05', unit: 0.01 }),
      Object.freeze({ id: 'MSun', name: '太陽の質量', lit: '1.9885e30', unit: 0.0001e30 }),
      Object.freeze({ id: 'aV', name: '金星の道の半径(m)', lit: '1.08208e11', unit: 0.00001e11 })]),
  }),
  /** 偶然の並びの見込み: a★ を観測の半径の 1〜30 倍に対数で一様に置く(概算 —— 置き方に依る)・構造の ±5%・±2% */
  probRange: Object.freeze([1, 30]), probTol: Object.freeze([0.05, 0.02]),
  /** 合成の軸の格子(観測の半径の倍)と背景の大きさの列 */
  axisGrid: Object.freeze([1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12]), u98: 0.98,
  /** 点検の数(便の始めの数え直しの桁・第353便z の x) */
  anchor: Object.freeze({ jup0: '4.0622e8', jup5: '4.2164e8', sat0: '1.1870e8', sat5: '1.2570e8', io0: '1.038', cd0: '1.010', xIo0: '0.894142', xIo5: '0.99958' }),
  main: Object.freeze({ part: 'S', tSrc: 0, read: 'C2', bg: 'Np', axis: 'L', recv: '規則の半径(自分の重みは受け手に依らない)' }),
  judge: '丸めの桁の床: 零試験は相対 1e-9(尺度の走り直しで揺れる)・点検の数は便の始めの数え直しの桁・逐語の表は有効数字 3〜4 桁',
});
const PH_H = Object.freeze({ Jupiter: 9.925, Saturn: 10.656 }), PSd = 25.05;

/* ───────── 内訳(母天体の赤道の円の道の半径 a)───────── */
/** 母天体 src の基本の量(倍 s: { M, w, sunM, sunW, aV } —— 1 = そのまま。規則の半径は Y_k × 質量に従う) */
function baseOf(T1, GEO, src, s = {}) {
  const g = (k) => (s[k] === undefined ? 1 : s[k]);
  const r2 = T1.find((r) => r.id === src && r.src === 'Sun' && r.mag === 'm2'), Gs = GEO[src + '|Sun'];
  if (!r2 || !Gs) throw new RangeError('母天体 ' + src + ' の行が無い');
  const PH = SP.pairInput(T1, GEO, src, 'Sun'), PV = SP.pairInput(T1, GEO, 'Venus', 'Sun');
  const Ms = C.massOf(src) * g('M'), MS = PH.Ms * g('sunM');
  return { src, ax: unit(Gs.w), w: Math.abs(r2.omega) * g('w'), Ms, Rs: G3.YK * Ms, MS, RS: G3.YK * MS, PH: { ...PH, Ms: MS, ws: PH.ws * g('sunW') }, PV: { ...PV, Ms: MS, ws: PV.ws * g('sunW'), a: PV.a * g('aV') }, Ro: K.srcRadius(src, 1) };
}
/**
 * 約束の口: 半径 a の内訳 { sun, parent, venus, sHat, a, src }。o: { m(受け手の質量 —— 規則の半径では x に効かない), s(入力の倍), via('lib' = 〔第353便z〕の moonParts の作り | 'rotP' = 入力の倍を通す作り) }。
 * 'lib' は〔第353便d〕circRot +〔第352便k〕spinRot(便の始めの数え直しの作り)・'rotP' は太陽由来と金星を〔第353便p〕rotP で数え直す(倍 1 で 'lib' と相対 1e-9 —— 零試験)。
 */
export function partsAt(T1, GEO, src, a, { m = 1e3, s = null, via = null } = {}) {
  if (!(fin(a) && a > 0)) throw new RangeError('partsAt: a > 0');
  if (!(fin(m) && m > 0)) throw new RangeError('partsAt: m > 0');
  const B = baseOf(T1, GEO, src, s || {}), mode = via || (s ? 'rotP' : 'lib');
  const wSunAtHost = B.MS * D.Kball(1, B.PH.a, B.RS), wPar = B.Ms * D.Kball(1, a, B.Rs);
  const parent = Dd.circRot({ Ms: B.Ms, Rs: B.Rs, spinVec: scl(B.ax, B.w), L: B.ax, r: a, m, extraW: wSunAtHost }).Om;
  let sun, venus;
  if (mode === 'lib') {
    if (s) throw new RangeError('partsAt: 入力の倍は rotP の作りだけ');
    sun = K.spinRot(T1, GEO, src, 'Sun', { part: 'S', tSrc: 0, read: 'C2', extraW: wPar }).Om;
    venus = P.localStd(T1, GEO, 'Venus|Sun', { ob: null, cR: null }).loc;
  } else if (mode === 'rotP') {
    sun = P.rotP(B.PH, { Rs: B.RS, Rr: G3.YK * B.PH.m, extraW: wPar }).Om;
    venus = P.rotP(B.PV, { Rs: B.RS, Rr: G3.YK * B.PV.m }).Om;
  } else throw new RangeError('partsAt: via は lib・rotP');
  return { src, a, sun, parent, venus, sHat: B.ax, Ro: B.Ro };
}
const sigOf = (src, n, fOver = null) => (n === 0 ? 1 : Z.sigmaN(fOver === null ? Z.fOf(src) : fOver, n));
/** 内訳から x(σ を母天体由来に・sun: true で太陽由来と金星にも σ_n(太陽の f)) */
export function xOfParts(Pt, { n = 0, sun = false, fOver = null } = {}) {
  const sp = sigOf(Pt.src, n, fOver), ss = sun && n !== 0 ? Z.sigmaN(Z.fOf('Sun'), n) : 1;
  return nrm(add(scl(Pt.sun, ss), scl(Pt.parent, sp))) / (ss * nrm(Pt.venus));
}
/** 約束の口: x(a)(数え直し 7 の作り)。o: { n, sun, m, s, fOver } */
export function xAtRadius(T1, GEO, src, a, { n = 0, sun = false, m = 1e3, s = null, fOver = null } = {}) {
  return xOfParts(partsAt(T1, GEO, src, a, { m, s }), { n, sun, fOver });
}
/** 約束の口: a★(x = 1 の半径 —— 対数の二分)。o: { n, sun, s, fOver, lo, hi(観測の半径の倍)}。無ければ null */
export function aStar(T1, GEO, src, { n = 0, sun = false, s = null, fOver = null, lo = DECL.aLo, hi = DECL.aHi } = {}) {
  const Ro = K.srcRadius(src, 1), g = (a) => xAtRadius(T1, GEO, src, a, { n, sun, s, fOver }) - 1;
  let L = lo * Ro, H = hi * Ro, gL = g(L), gH = g(H);
  if (!(gL * gH < 0)) return null;
  for (let i = 0; i < 70; i++) { const mid = Math.sqrt(L * H), gm = g(mid); if (gL * gm <= 0) { H = mid; gH = gm; } else { L = mid; gL = gm; } }
  return Math.sqrt(L * H);
}
/**
 * 約束の口: a★ の閉じた形。返す { a0(冪だけ: a_金星 ×(M ÷ M_太陽)×(ω ÷ ω_太陽)^(1/3)× σ^(1/3)), aGeo(幾何の補正つき), aSun(太陽由来の分も —— 2 次の式), gGeo, parts }。
 * 幾何の因子 gGeo = (abs(母天体由来) a³ ÷ (M³ ω σ)) ÷ (abs(金星) a_金星³ ÷ (M_太陽³ ω_太陽)) —— 赤道の場の角の因子 ÷ 金星の位置の因子(a に依らないことを零試験に)。
 */
export function aStarClosed(T1, GEO, src, { n = 0, s = null, fOver = null } = {}) {
  const B = baseOf(T1, GEO, src, s || {}), sig = sigOf(src, n, fOver);
  const a0 = B.PV.a * (B.Ms / B.MS) * Math.cbrt(B.w / B.PV.ws) * Math.cbrt(sig);
  const Pt = partsAt(T1, GEO, src, a0, s ? { s } : {});
  const V3 = nrm(Pt.venus), Pp = sig * nrm(Pt.parent);
  const gGeo = (Pp * Math.pow(a0, 3) / (Math.pow(B.Ms, 3) * B.w * sig)) / (V3 * Math.pow(B.PV.a, 3) / (Math.pow(B.MS, 3) * B.PV.ws));
  const aGeo = a0 * Math.cbrt(gGeo);
  // 太陽由来 S(a★ の近くでほぼ一定)と母天体由来の向き ê:|S + p ê| = |V| の p > 0 → a★ = aGeo × (|V| ÷ p)^(1/3)
  const Pg = partsAt(T1, GEO, src, aGeo, s ? { s } : {}), e = unit(Pg.parent), Sv = Pg.sun, se = dot(Sv, e), disc = se * se - dot(Sv, Sv) + V3 * V3;
  const p = disc >= 0 ? -se + Math.sqrt(disc) : null, aSun = p && p > 0 ? aGeo * Math.cbrt(V3 / p) : null;
  return { src, n, sigma: sig, a0, aGeo, aSun, gGeo, sunOverV: nrm(Sv) / V3, cosSE: se / nrm(Sv), massRatio: B.Ms / B.MS, spinRatio: B.w / B.PV.ws, aV: B.PV.a, Ro: B.Ro };
}

/* ───────── 合成の軸(局所 + 背景)───────── */
/**
 * 約束の口: 半径 a での合成の軸。o: { u: 'uV' | 数(背景の倍率), k(換算の係数 —— 既定 u ÷ uV), n, bg, axis }。
 * 返す { x, angSpin(合成と母天体の自転軸), angAnti(合成と −自転軸), angRef(合成と基準軸), angLocRef(局所と基準軸), magOverBg(合成 ÷ 背景), k }。
 */
export function axisAt(T1, GEO, src, a, { u = 'uV', k = null, n = 0, bg = 'Np', axis = 'L', Pt = null } = {}) {
  const Q = Pt || partsAt(T1, GEO, src, a), loc = add(Q.sun, scl(Q.parent, sigOf(src, n))), b1 = P.bg1(T1, GEO, bg, axis), nb = nrm(b1), uV = nrm(Q.venus) / nb;
  let B, Lc, kk;
  if (u === 'uV') { B = scl(b1, uV); Lc = loc; kk = 1; }
  else { if (!(fin(u) && u > 0)) throw new RangeError('axisAt: u は uV か > 0'); kk = k === null ? u / uV : k; B = scl(b1, u); Lc = scl(loc, kk); }
  const tot = add(B, Lc), ref = unit(b1);
  return { a, x: nrm(loc) / nrm(Q.venus), angSpin: ang(tot, Q.sHat), angAnti: ang(tot, scl(Q.sHat, -1)), angRef: ang(tot, ref), angLocRef: ang(loc, ref), angSpinRef: ang(Q.sHat, ref), magOverBg: nrm(tot) / nrm(B), k: kk };
}
/** 軸が半分替わる半径(合成と −自転軸の角 = 合成と基準軸の角 —— 対数の二分)。o: { n, bg, axis } */
export function aHalf(T1, GEO, src, { n = 0, bg = 'Np', axis = 'L' } = {}) {
  const Ro = K.srcRadius(src, 1), g = (a) => { const r = axisAt(T1, GEO, src, a, { n, bg, axis }); return r.angAnti - r.angRef; };
  let L = 1.01 * Ro, H = 200 * Ro, gL = g(L), gH = g(H);
  if (!(gL * gH < 0)) return null;
  for (let i = 0; i < 70; i++) { const mid = Math.sqrt(L * H), gm = g(mid); if (gL * gm <= 0) { H = mid; gH = gm; } else { L = mid; gL = gm; } }
  return Math.sqrt(L * H);
}

/** 合成と基準軸の角が、局所と基準軸の角の frac 倍になる半径(対数の二分 —— 0.9 と 0.1 で「替わる幅」)。o: { n, bg, axis } */
export function aFrac(T1, GEO, src, frac, { n = 0, bg = 'Np', axis = 'L' } = {}) {
  if (!(fin(frac) && frac > 0 && frac < 1)) throw new RangeError('aFrac: 0 < frac < 1');
  const Ro = K.srcRadius(src, 1), g = (a) => { const r = axisAt(T1, GEO, src, a, { n, bg, axis }); return r.angRef / r.angLocRef - frac; };
  let L = 1.01 * Ro, H = 200 * Ro, gL = g(L), gH = g(H);
  if (!(gL * gH < 0)) return null;
  for (let i = 0; i < 70; i++) { const mid = Math.sqrt(L * H), gm = g(mid); if (gL * gm <= 0) { H = mid; gH = gm; } else { L = mid; gL = gm; } }
  return Math.sqrt(L * H);
}

/* ───────── 構造(リポジトリの衛星と環の半径 —— 文献の値・未照合)───────── */
const HOST_OF = Object.freeze({ Jupiter: 'jupiter', Saturn: 'saturn', Uranus: 'uranus', Neptune: 'neptune', Earth: 'earth', Mars: 'mars' });
/** 約束の口: 母天体 src の構造の行 [{ key, name, kind('moon'|'ring'), r }](LIT334A の衛星と環・地球は第337便c の BODY_SRC の月・火星はフォボスとダイモス) */
export function structRows(src) {
  const h = HOST_OF[src]; if (!h) throw new RangeError('structRows: 母天体 ' + src);
  const rows = [...LIT334A.moons.filter((m) => m.host === h).map((m) => ({ key: m.key, name: m.name, kind: 'moon', r: m.a })), ...LIT334A.rings.filter((g) => g.host === h).map((g) => ({ key: g.key, name: g.name, kind: 'ring', r: g.r }))];
  if (src === 'Earth') rows.push({ key: 'moon', name: '月', kind: 'moon', r: TL.BODY_SRC.Moon.a[0] });
  if (src === 'Mars') for (const id of ['Phobos', 'Deimos']) rows.push({ key: id.toLowerCase(), name: id === 'Phobos' ? 'フォボス' : 'ダイモス', kind: 'moon', r: TL.BODY_SRC[id].a[0] });
  return rows.sort((p, q) => p.r - q.r);
}

/* ───────── 入力の幅 ───────── */
/** 入力 id を最後の桁 ±1(sgn)振ったときの倍(自転の率は周期の逆数・f は数そのもの) */
export function pertScale(src, id, sgn) {
  const I = [...(DECL.inputs[src] || []), ...DECL.inputs.common].find((x) => x.id === id); if (!I) throw new RangeError('pertScale: 入力 ' + src + ' ' + id);
  const v = Number(I.lit), r = 1 + sgn * I.unit / v;
  if (id === 'f') return { fOver: v + sgn * I.unit };
  if (id === 'P') return { s: { w: 1 / r } }; if (id === 'PSun') return { s: { sunW: 1 / r } };
  if (id === 'MSun') return { s: { sunM: r } }; if (id === 'aV') return { s: { aV: r } };
  return { s: { M: r } };
}

/* ───────── 土星の環の区分の内縁・外縁(第338便d の LIT.regions —— 文献の値・未照合)───────── */
export function ringEdges() {
  return RB.LIT.regions.map((g) => ({ key: g.key, r0: g.r0 * 1e3, r1: g.r1 * 1e3, rc: RB.centerKm(g.key) * 1e3 }));
}

/* ───────── 表 ───────── */
/** 表 1: 木星・土星 × 扁平の倍 3 通りの a★・入力の幅・構造の半径 ÷ a★ と x */
export function table1(T1, GEO) {
  return Object.values(DECL.hosts).map((src) => {
    const Ro = K.srcRadius(src, 1), f = Z.fOf(src), ins = [...DECL.inputs[src], ...DECL.inputs.common];
    const cols = DECL.nList.map((n) => {
      const a = aStar(T1, GEO, src, { n });
      const widths = ins.map((I) => { const up = pertScale(src, I.id, 1), dn = pertScale(src, I.id, -1);
        const ap = n === 0 && I.id === 'f' ? a : aStar(T1, GEO, src, { n, ...up }), am = n === 0 && I.id === 'f' ? a : aStar(T1, GEO, src, { n, ...dn });
        return { id: I.id, name: I.name, lit: I.lit, relUnit: I.unit / Number(I.lit), aPlus: ap, aMinus: am, dPlus: ap / a - 1, dMinus: am / a - 1 }; });
      const half = widths.map((w) => 0.5 * Math.abs(w.aPlus - w.aMinus)), rss = Math.sqrt(half.reduce((s, h) => s + h * h, 0));
      const all = widths.flatMap((w) => [w.aPlus, w.aMinus]);
      return { n, sigma: sigOf(src, n), aStar: a, overRo: a / Ro, widths, rss, relRss: rss / a, min: Math.min(...all), max: Math.max(...all) };
    });
    const structs = structRows(src).map((S) => { const Pt = partsAt(T1, GEO, src, S.r);
      return { ...S, overRo: S.r / Ro, cells: cols.map((c) => { const x = xOfParts(Pt, { n: c.n }), q = S.r / c.aStar;
        return { n: c.n, ratio: q, x, inRss: Math.abs(S.r - c.aStar) <= c.rss, inOne: S.r >= c.min && S.r <= c.max, in5: Math.abs(q - 1) <= 0.05, in2: Math.abs(q - 1) <= 0.02 }; }) }; });
    return { src, Ro, f, cols, structs };
  });
}
/** 表 2: 閉じた形と数の差(木星・土星 × n 3 通り・ほかの母天体は n 0)・地球の a★ と月の道 */
export function table2(T1, GEO) {
  const row = (src, n) => { const c = aStarClosed(T1, GEO, src, { n }), a = aStar(T1, GEO, src, { n });
    return { src, n, a, overRo: a / c.Ro, inside: a < c.Ro, ...c, d0: c.a0 / a - 1, dGeo: c.aGeo / a - 1, dSun: c.aSun === null ? null : c.aSun / a - 1 }; };
  const rows = [...Object.values(DECL.hosts).flatMap((src) => DECL.nList.map((n) => row(src, n))), ...DECL.others.map((src) => row(src, 0))];
  const structs = DECL.others.map((src) => { const r = rows.find((q) => q.src === src);
    return { src, items: structRows(src).map((S) => { const Pt = partsAt(T1, GEO, src, S.r); return { ...S, overRo: S.r / r.Ro, ratio: S.r / r.a, x: xOfParts(Pt), sunOverPar: nrm(Pt.sun) / nrm(Pt.parent) }; }) }; });
  return { rows, structs };
}
/** 区間の和の長さ(対数) */
const unionLen = (iv) => { const s = [...iv].sort((p, q) => p[0] - q[0]); let L = 0, cur = null; for (const [a, b] of s) { if (!cur || a > cur[1]) { if (cur) L += cur[1] - cur[0]; cur = [a, b]; } else cur[1] = Math.max(cur[1], b); } if (cur) L += cur[1] - cur[0]; return L; };
/** 表 3: 偶然の並びの見込み(概算 —— a★ を観測の半径の 1〜30 倍に対数で一様に置く)。構造の置き方 2 つ(代表の半径・土星は区分の縁を足す) */
export function table3(T1, GEO, t1 = null) {
  const T = t1 || table1(T1, GEO), [g0, g1] = DECL.probRange, span = Math.log(g1 / g0);
  const hosts = T.map((h) => {
    const rep = h.structs.map((S) => S.r).filter((r) => r >= g0 * h.Ro && r <= g1 * h.Ro);
    const edges = h.src === 'Saturn' ? ringEdges().flatMap((e) => [e.r0, e.r1]).filter((r) => r >= g0 * h.Ro && r <= g1 * h.Ro) : [];
    const sets = { rep, repEdges: [...new Set([...rep, ...edges])].sort((p, q) => p - q) };
    const probs = DECL.probTol.map((tol) => { const out = { tol };
      for (const [k, rs] of Object.entries(sets)) { const lo = Math.log(g0 * h.Ro), hi = Math.log(g1 * h.Ro);
        const iv = rs.map((r) => [Math.max(lo, Math.log(r / (1 + tol))), Math.min(hi, Math.log(r / (1 - tol)))]).filter(([a, b]) => b > a);
        out[k] = { n: rs.length, p: unionLen(iv) / span, pSum: rs.length * Math.log((1 + tol) / (1 - tol)) / span }; }
      out.hits = h.cols.map((c) => ({ n: c.n, rep: rep.some((r) => Math.abs(r / c.aStar - 1) <= tol), repEdges: sets.repEdges.some((r) => Math.abs(r / c.aStar - 1) <= tol) }));
      return out; });
    return { src: h.src, Ro: h.Ro, sets, probs };
  });
  const both = DECL.probTol.map((tol, k) => ({ tol, rep: hosts[0].probs[k].rep.p * hosts[1].probs[k].rep.p, repEdges: hosts[0].probs[k].repEdges.p * hosts[1].probs[k].repEdges.p }));
  return { range: DECL.probRange, span, hosts, both };
}
/** 表 4: a★ の内と外の合成の軸(格子・構造・土星の環の縁)と、軸が半分替わる半径 ÷ a★ */
export function table4(T1, GEO, t1 = null) {
  const T = t1 || table1(T1, GEO);
  return T.map((h) => {
    const src = h.src, Ro = h.Ro, at = (a) => { const Pt = partsAt(T1, GEO, src, a), A = axisAt(T1, GEO, src, a, { Pt }), B = axisAt(T1, GEO, src, a, { Pt, u: DECL.u98 });
      return { a, overRo: a / Ro, x: A.x, angSpin: A.angSpin, angAnti: A.angAnti, angRef: A.angRef, angRef098: B.angRef, angLocRef: A.angLocRef, angSpinRef: A.angSpinRef, magOverBg: A.magOverBg, mag098: B.magOverBg, k098: B.k }; };
    const grid = DECL.axisGrid.map((g) => at(g * Ro));
    const structs = h.structs.map((S) => ({ key: S.key, name: S.name, ...at(S.r) }));
    const edges = src === 'Saturn' ? ringEdges().flatMap((e) => [{ key: e.key + '-in', ...at(e.r0) }, { key: e.key + '-out', ...at(e.r1) }]) : [];
    const halves = DECL.nList.map((n) => { const ah = aHalf(T1, GEO, src, { n }), as = h.cols.find((c) => c.n === n).aStar; const a9 = aFrac(T1, GEO, src, 0.9, { n }), a1 = aFrac(T1, GEO, src, 0.1, { n }); return { n, aHalf: ah, aStar: as, ratio: ah / as, a90: a9, a10: a1, r90: a9 / as, r10: a1 / as }; });
    return { src, Ro, grid, structs, edges, halves };
  });
}

/* ───────── 零試験 ───────── */
export function pureScenes(T1 = E.t1Table(), GEO = E.geometry()) {
  const io = LIT334A.moons.find((m) => m.key === 'io'), cd = LIT334A.rings.find((g) => g.key === 'satCD');
  const jup0 = aStar(T1, GEO, 'Jupiter', { n: 0 }), jup5 = aStar(T1, GEO, 'Jupiter', { n: 5 }), sat0 = aStar(T1, GEO, 'Saturn', { n: 0 }), sat5 = aStar(T1, GEO, 'Saturn', { n: 5 });
  // 〔第353便z〕moonParts(イオ —— 受け手の質量はイオ)と同じ x
  const cache = {}, Mz = Z.moonParts(T1, GEO, 'io', cache), zx0 = Z.xOfM(Mz, 1), zx5 = Z.xFromParts(Mz, 5);
  const PtIo = partsAt(T1, GEO, 'Jupiter', io.a), x0 = xOfParts(PtIo), x5 = xOfParts(PtIo, { n: 5 }), xm = xOfParts(partsAt(T1, GEO, 'Jupiter', io.a, { m: io.m }));
  // 入力の倍 1 の rotP の作り = lib の作り
  const Q = partsAt(T1, GEO, 'Jupiter', io.a, { via: 'rotP' }), vsPert = Math.max(rel(Q.sun, PtIo.sun), rel(Q.parent, PtIo.parent), rel(Q.venus, PtIo.venus));
  const Qs = partsAt(T1, GEO, 'Saturn', cd.r, { via: 'rotP' }), Ps = partsAt(T1, GEO, 'Saturn', cd.r), vsPertS = Math.max(rel(Qs.sun, Ps.sun), rel(Qs.parent, Ps.parent), rel(Qs.venus, Ps.venus));
  // 母天体由来 × a³ が a に依らない(冪 −3)・幾何の因子の a に依らなさ
  const pa = (a) => nrm(partsAt(T1, GEO, 'Jupiter', a).parent) * a * a * a, p3 = rel(pa(3e8), pa(6e8));
  // 0.98 の列 = 金星の条件の列(同じ軸)
  const A1 = axisAt(T1, GEO, 'Saturn', cd.r), A2 = axisAt(T1, GEO, 'Saturn', cd.r, { u: DECL.u98 }), col098 = Math.max(rel(A1.angRef, A2.angRef), rel(A1.angSpin, A2.angSpin), rel(A1.magOverBg, A2.magOverBg));
  // 金星の局所 ÷ 背景の倍率 = 〔第352便v〕の uV
  const uV = nrm(PtIo.venus) / nrm(P.bg1(T1, GEO, 'Np', 'L'));
  // 閉じた形(太陽由来の分の 2 次の式まで)= 二分の a★・土星の環の区分の中央 = LIT334A の半径
  const cJ = aStarClosed(T1, GEO, 'Jupiter'), cS = aStarClosed(T1, GEO, 'Saturn', { n: 5 }), closed = Math.max(rel(cJ.aSun, jup0), rel(cS.aSun, sat5));
  const EG = ringEdges(), edges = ['C', 'B', 'CD', 'A'].map((k) => rel(EG.find((e) => e.key === 'ring' + k).rc, LIT334A.rings.find((g) => g.key === 'sat' + k).r));
  const rj = (fn) => { try { fn(); return false; } catch (e) { return e instanceof RangeError; } };
  const rejects = [rj(() => partsAt(T1, GEO, 'Jupiter', -1)), rj(() => partsAt(T1, GEO, 'Jupiter', 1e9, { m: 0 })), rj(() => partsAt(T1, GEO, 'Ceres', 1e9)), rj(() => partsAt(T1, GEO, 'Jupiter', 1e9, { via: 'xx' })),
    rj(() => axisAt(T1, GEO, 'Jupiter', 1e9, { u: -1 })), rj(() => structRows('Venus')), rj(() => pertScale('Jupiter', 'xx', 1)), rj(() => partsAt(T1, GEO, 'Jupiter', 1e9, { s: { M: 1 }, via: 'lib' }))];
  return { jup0, jup5, sat0, sat5, io0: io.a / jup0, cd0: cd.r / sat0, x0, x5, zx0, zx5, xm, vsPert, vsPertS, p3, col098, uV, uVv: V.uVt(T1, GEO, 0), closed, gGeoJ: cJ.gGeo, gGeoS: cS.gGeo, edges, rejects };
}
export function pureGates(S) {
  const A = DECL.anchor, pe = (x, s) => x.toExponential(4) === Number(s).toExponential(4), pf = (x, s) => x.toFixed(3) === s;
  return {
    anchor7: pe(S.jup0, A.jup0) && pe(S.jup5, A.jup5) && pe(S.sat0, A.sat0) && pe(S.sat5, A.sat5) && pf(S.io0, A.io0) && pf(S.cd0, A.cd0) && S.x0.toFixed(6) === A.xIo0 && S.x5.toFixed(5) === A.xIo5,
    moonParts353z: rel(S.x0, S.zx0) < 1e-9 && rel(S.x5, S.zx5) < 1e-9,
    recvMass: rel(S.xm, S.x0) < 1e-9,
    pertIdentity: S.vsPert < 1e-9 && S.vsPertS < 1e-9,
    power3: S.p3 < 1e-6,
    col098: S.col098 < 1e-9,
    uV352v: rel(S.uV, S.uVv) < 1e-9,
    closed: S.closed < 1e-8 && rel(S.gGeoJ, S.gGeoS) < 1e-6,
    edges338d: S.edges.length === 4 && S.edges.slice(1).every((e) => e < 1e-12) && S.edges[0] > 1e-4 && S.edges[0] < 1e-3,   // C 環だけ中央が 0.089% 違う(内縁の字が 74 510 km と 74 658 km —— リポジトリの 2 つの表)
    rejects: S.rejects.length === 8 && S.rejects.every(Boolean),
  };
}
