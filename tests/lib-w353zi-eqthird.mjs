// 第353便zi(原仮定者の回答(2026-11-25 —— 第151報)「向きと幾何」・AN1045・AN1039・統括の検証項目 R498):
//   **等大の半径 a★(局所の項 = 金星の局所の項の大きさ ——〔第353便zg〕)の続き: 3 組目の照合(冥王星 ⇄ カロン・地球 ← 月・火星・天王星・海王星)・
//   土星の環の区分を帯として読む見込み(置き方を替えた概算)・受け手の半径の置き方を替えた a★・a★ を作る因子と、2 組を同時に 1 に置く扁平の倍の冪 —— 診断だけ**
//   (器 tests/exp-w353zi-eqthird.mjs と QA behavior.eqthird353zi・docs.eqthird353zi が読む —— html を読まない・ファイルを読まない・状態を持たない。後のラウンドの枝もこの口を import してよい)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない。既存の lib は呼ぶだけ(本文は変えない):
//   第353便zg(aStar・aStarClosed・xAtRadius・partsAt・axisAt・structRows・ringEdges)・第353便z(sigmaN・fOf)・第353便p(rotP・moonWeights)・第353便k(ringStdOm —— 受け手の質量と半径の口)・
//   第353便c(cRStar・rateMult)・第351便c(pairInput)・第348便h(YK)・第348便c(massOf・radiusOf)・第312便a(Kball)・第334便a(LIT334A —— 衛星と環の半径〔文献の値・未照合〕)・第347便e(t1Table・geometry)。
//   仮の値の lib(第352便b)には届かない(import の閉包に入れない —— 枝 j・v・zb の lib は呼ばない。c_R★ の倍と質量 ÷ 観測半径の置き方は、同じ式をここで書き直して零試験で照合する)。
//
// ■ 量: x(a) = abs(局所の太陽由来 + σ × 局所の母天体由来) ÷ abs(金星 ← 太陽の (S))(〔第353便zg〕と同じ作り)。受け手の半径 R_r を置き方で替える:
//   'rule' 規則の半径 Y_k m(〔第353便zg〕—— 自分の重みは受け手に依らない)/'field' (P-場) R_r = c_R × 観測半径(全部の受け手に同じ c_R)/
//   'star' R_r = r × c_R★ × 観測半径(c_R★ = 自分の重みが源の重みと同じになる c_R ——〔第353便v〕の置き方)/'mass' R_r = (C0 ÷ Y_k) × Y_k m(〔第353便zb〕の置き方 —— 自分の重みは受け手に依らない)/
//   'resp' (P-応) 場は規則の半径・応答の率の倍は別に(x は規則の半径と同じ ——〔第353便c〕・〔第353便p〕)。金星も同じ置き方で数える。
// ■ 3 組目: 冥王星 ⇄ カロン(互いに回る組 —— 源 = 冥王星・照合の半径 = カロンの道/源 = カロン・照合の半径 = 冥王星の重心のまわりの道〔と 2 天体の距離〕)。
//   扁平率はリポジトリに無いので倍なし。カロンの自転の率は〔第347便e〕の Pluto|Charon の行(同期)。
// ■ 見込み・照合は候補の表と概算(この場・この読み・このノブでは)。
import * as ZG from './lib-w353zg-equalradius.mjs';
import * as Z from './lib-w353z-obpower.mjs';
import * as P from './lib-w353p-cancelstd.mjs';
import * as KR from './lib-w353k-ringstd.mjs';
import * as RC from './lib-w353c-recvradius.mjs';
import * as SP from './lib-w351c-srcparts.mjs';
import * as G3 from './lib-w348h-axisgeo3.mjs';
import * as C from './lib-w348c-axisbalance.mjs';
import * as D from './lib-w312a-decay.mjs';
import * as E from './lib-w347e-spintorque.mjs';
import { LIT334A } from './lib-w334a-heightlaw.mjs';

export const LIB_VERSION = 'w353zi-eqthird-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const scl = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const unit = (a) => scl(a, 1 / nrm(a));
const rel = (a, b) => (Array.isArray(a) ? nrm(add(a, scl(b, -1))) / Math.max(nrm(b), 1e-300) : Math.abs(a - b) / Math.max(Math.abs(b), 1e-300));

/* ───────── 宣言 ───────── */
export const DECL = Object.freeze({
  /** 互いに回る組(源 → 照合の半径の読み) */
  pairs: Object.freeze([
    Object.freeze({ key: 'Pluto>Charon', src: 'Pluto', comp: 'Charon', reads: Object.freeze(['sep']) }),
    Object.freeze({ key: 'Charon>Pluto', src: 'Charon', comp: 'Pluto', reads: Object.freeze(['bary', 'sep']) })]),
  /** 3 組目の表のほかの母天体(〔第353便zg〕の structRows —— 海王星は行なし) */
  others: Object.freeze(['Earth', 'Mars', 'Uranus', 'Neptune']),
  /** 照合の幅 */
  tols: Object.freeze([0.05, 0.5]),
  /** a★ の二分の区間(観測の半径の倍 —— 冥王星・カロンは母天体の内に来るので下を広げる) */
  aLo: 1e-7, aHi: 1e3,
  /** 扁平の倍の入れ方(〔第353便zg〕と同じ) */
  nList: Object.freeze([0, 2, 5]),
  /** 見込みの範囲(観測の半径の倍)2 つ */
  ranges: Object.freeze([Object.freeze([1, 30]), Object.freeze([1, 10])]),
  /** イオの照合の幅(ガリレオ衛星の道の間隔の割合 —— 格子) */
  spacingQ: Object.freeze([0.05, 0.1]),
  /** 受け手の置き方(表 3) */
  places: Object.freeze([
    Object.freeze({ id: 'rule', place: 'rule' }),
    Object.freeze({ id: 'field-1e-3', place: 'field', cR: 1e-3 }), Object.freeze({ id: 'field-0.0128', place: 'field', cR: 0.0128 }),
    Object.freeze({ id: 'star-0.195', place: 'star', r: 0.195 }), Object.freeze({ id: 'star-1', place: 'star', r: 1 }),
    Object.freeze({ id: 'mass-1', place: 'mass', C0: 1 }), Object.freeze({ id: 'mass-1e5', place: 'mass', C0: 1e5 }), Object.freeze({ id: 'mass-5.99e5', place: 'mass', C0: 5.99e5 }),
    Object.freeze({ id: 'resp-1', place: 'resp', cR: 1 })]),
  /** 環の粒子(〔第353便k〕の受け手の既定 —— 大きさ 1 m・密度 900 kg/m³: ノブ(値は未照合)) */
  particle: Object.freeze({ size: 1, rho: 900 }),
  /** 2 組を同時に 1 に置く冪の二分の区間 */
  nRange: Object.freeze([-30, 30]),
  main: Object.freeze({ part: 'S', tSrc: 0, read: 'C2', bg: 'Np', axis: 'L', recv: '規則の半径(主の照合の列 ——〔第353便zg〕)' }),
  judge: '丸めの桁の床: 零試験は相対 1e-9(尺度の走り直しで揺れる)・逐語の表は有効数字 3〜4 桁・見込みは概算',
});

/* ───────── 母天体(源)の基本の量 ───────── */
function hostOf(T1, GEO, src) {
  if (src === 'Charon') {
    const r = T1.find((q) => q.id === 'Pluto' && q.src === 'Charon' && q.mag === 'm2'), g = GEO['Pluto|Charon'];
    if (!r || !g) throw new RangeError('hostOf: Pluto|Charon の行が無い');
    const PH = SP.pairInput(T1, GEO, 'Charon', 'Sun'), Ms = C.massOf('Charon');
    return { src, ax: unit(g.w), w: Math.abs(r.OmegaT), Ms, Rs: G3.YK * Ms, PH, Ro: C.radiusOf('Charon') };
  }
  const r2 = T1.find((q) => q.id === src && q.src === 'Sun' && q.mag === 'm2'), Gs = GEO[src + '|Sun'];
  if (!r2 || !Gs) throw new RangeError('hostOf: 母天体 ' + src + ' の行が無い');
  const PH = SP.pairInput(T1, GEO, src, 'Sun'), Ms = C.massOf(src);
  return { src, ax: unit(Gs.w), w: Math.abs(r2.omega), Ms, Rs: G3.YK * Ms, PH, Ro: C.radiusOf(src) };
}

/* ───────── 受け手(イオ・環の粒子・金星・規則の受け手) ───────── */
/** 受け手 key: 'io' ほか LIT334A の衛星・'ring' 環の粒子・'Venus'・'rule'(m 1e3)。返す { key, m, R(観測の半径 —— 粒子は大きさ), a(照合の道の半径 —— 無ければ null), host } */
export function recvBody(key, { aRing = null } = {}) {
  if (key === 'rule') return { key, m: 1e3, R: null, a: null, host: null };
  if (key === 'Venus') return { key, m: C.massOf('Venus'), R: C.radiusOf('Venus'), a: SP.pairInput(E.t1Table(), E.geometry(), 'Venus', 'Sun').a, host: 'Sun' };
  if (key === 'ring') { const pp = DECL.particle, cd = LIT334A.rings.find((g) => g.key === 'satCD');
    return { key, m: pp.rho * 4 / 3 * Math.PI * Math.pow(pp.size, 3), R: pp.size, a: aRing === null ? cd.r : aRing, host: 'Saturn' }; }
  const M = LIT334A.moons.find((q) => q.key === key); if (!M) throw new RangeError('recvBody: 受け手 ' + key);
  return { key, m: M.m, R: M.R, a: M.a, host: { jupiter: 'Jupiter', saturn: 'Saturn' }[M.host] };
}
/** c_R★(自分の重み m K(0, c_R R) = 源の重み M K(a, Y_k M) —— 対数の二分)。src の重みは道の半径 a で */
export function cRStarOf(m, R, Ms, a) {
  const wS = Ms * D.Kball(1, a, G3.YK * Ms), f = (lc) => Math.log(m * D.Kball(1, 0, Math.pow(10, lc) * R) / wS);
  let lo = -30, hi = 10; if (!(f(lo) > 0 && f(hi) < 0)) return null;
  for (let i = 0; i < 200; i++) { const mid = 0.5 * (lo + hi); if (f(mid) > 0) lo = mid; else hi = mid; }
  return Math.pow(10, 0.5 * (lo + hi));
}
/** 置き方 pl({ place, cR, r, C0 })で受け手 b の半径 R_r(src の源の重みは b.a で —— 'star' のとき) */
export function recvRadius(b, pl, srcMs) {
  const place = pl.place;
  if (place === 'rule' || place === 'resp') return G3.YK * b.m;
  if (place === 'mass') { if (!(fin(pl.C0) && pl.C0 > 0)) throw new RangeError('recvRadius: C0 ÷ Y_k > 0'); return pl.C0 * G3.YK * b.m; }
  if (!(fin(b.R) && b.R > 0)) throw new RangeError('recvRadius: 観測の半径の無い受け手 ' + b.key);
  if (place === 'field') { if (!(fin(pl.cR) && pl.cR > 0)) throw new RangeError('recvRadius: c_R > 0'); return pl.cR * b.R; }
  if (place === 'star') { if (!(fin(pl.r) && pl.r > 0)) throw new RangeError('recvRadius: r > 0'); const cs = cRStarOf(b.m, b.R, srcMs, b.a); return pl.r * cs * b.R; }
  throw new RangeError('recvRadius: 置き方は rule・field・star・mass・resp');
}

/* ───────── 内訳(受け手の半径の口つき)───────── */
/**
 * 約束の口: 源 src の赤道の円の道の半径 a の内訳 { sun, parent, venus, a, src, Ro }。o: { m(受け手の質量), Rr(受け手の半径 —— null = 規則の半径), Rv(金星の半径 —— null = 規則の半径) }。
 * 母天体由来は〔第353便k〕ringStdOm(受け手の質量と半径の口)・太陽由来と金星は〔第353便p〕rotP(Rr の口)。規則の半径で〔第353便zg〕partsAt と相対 1e-9(零試験)。
 */
export function partsR(T1, GEO, src, a, { m = 1e3, Rr = null, Rv = null } = {}) {
  if (!(fin(a) && a > 0)) throw new RangeError('partsR: a > 0');
  if (!(fin(m) && m > 0)) throw new RangeError('partsR: m > 0');
  const B = hostOf(T1, GEO, src), PV = SP.pairInput(T1, GEO, 'Venus', 'Sun'), MS = B.PH.Ms, RS = G3.YK * MS;
  const rr = Rr === null ? G3.YK * m : Rr, rv = Rv === null ? G3.YK * PV.m : Rv;
  if (!(fin(rr) && rr > 0 && fin(rv) && rv > 0)) throw new RangeError('partsR: 受け手の半径 > 0');
  const wSunAtHost = MS * D.Kball(1, B.PH.a, RS), wPar = B.Ms * D.Kball(1, a, B.Rs);
  const parent = KR.ringStdOm({ Ms: B.Ms, Rs: B.Rs, spinVec: scl(B.ax, B.w), L: B.ax, r: a, extraW: wSunAtHost, recvM: m, recvR: rr }).Om;
  const sun = P.rotP({ ...B.PH, m }, { Rs: RS, Rr: rr, extraW: wPar }).Om;
  const venus = P.rotP(PV, { Rs: RS, Rr: rv }).Om;
  return { src, a, sun, parent, venus, Ro: B.Ro, Rr: rr, Rv: rv };
}
const sigOf = (src, n) => (n === 0 ? 1 : Z.sigmaN(Z.fOf(src), n));
export const xOfR = (Pt, n = 0) => nrm(add(Pt.sun, scl(Pt.parent, sigOf(Pt.src, n)))) / nrm(Pt.venus);
/** 対数の二分(g の符号が替わる所)—— 無ければ null */
function bisLog(g, L, H, it = 60) {
  let gL = g(L); const gH = g(H); if (!(gL * gH < 0)) return null;
  for (let i = 0; i < it; i++) { const mid = Math.sqrt(L * H), gm = g(mid); if (gL * gm <= 0) H = mid; else { L = mid; gL = gm; } }
  return Math.sqrt(L * H);
}

/* ───────── 約束の口 ───────── */
/**
 * aStarPair(T1, GEO, key): 互いに回る組の a★。key 'Pluto>Charon'(源 = 冥王星・照合 = カロンの道 = 2 天体の距離)・'Charon>Pluto'(源 = カロン・照合 = 冥王星の重心のまわりの道〔bary〕と距離〔sep〕)。
 * 返す { key, src, comp, aStar, Ro, overRo, inside, reads: [{ read, r, ratio, x, in5, in50 }] }(規則の半径・倍なし)。
 */
export function aStarPair(T1, GEO, key) {
  const pr = DECL.pairs.find((q) => q.key === key); if (!pr) throw new RangeError('aStarPair: 組 ' + key);
  const B = hostOf(T1, GEO, pr.src), x = (a) => xOfR(partsR(T1, GEO, pr.src, a));
  const aS = bisLog((a) => x(a) - 1, DECL.aLo * B.Ro, DECL.aHi * B.Ro, 70);
  const sep = SP.pairInput(T1, GEO, 'Charon', 'Pluto').a, mP = C.massOf('Pluto'), mC = C.massOf('Charon');
  const rOf = (rd) => (rd === 'sep' ? sep : sep * C.massOf(pr.comp) / (mP + mC));
  const reads = pr.reads.map((rd) => { const r = rOf(rd), q = aS === null ? null : r / aS;
    return { read: rd, r, ratio: q, x: x(r), in5: q !== null && Math.abs(q - 1) <= 0.05, in50: q !== null && Math.abs(q - 1) <= 0.5 }; });
  return { key, src: pr.src, comp: pr.comp, aStar: aS, Ro: B.Ro, overRo: aS === null ? null : aS / B.Ro, inside: aS !== null && aS < B.Ro, reads };
}
/** bandOf(key, { q }): 環の区分('ringD'〜'ringF' ——〔第338便d〕の内縁〜外縁)・木星の主環(代表の半径だけ —— 縁は数なし)・衛星(道の半径 ± q × 隣の道との間隔の小さい方) */
export function bandOf(key, { q = 0.05 } = {}) {
  const e = ZG.ringEdges().find((g) => g.key === key);
  if (e) return { key, kind: 'region', r0: e.r0, r1: e.r1, rc: e.rc, host: 'Saturn' };
  const g = LIT334A.rings.find((x) => x.key === key);
  if (g) return { key, kind: 'ring', r0: null, r1: null, rc: g.r, host: g.host === 'jupiter' ? 'Jupiter' : 'Saturn' };
  const M = LIT334A.moons.find((x) => x.key === key); if (!M) throw new RangeError('bandOf: ' + key);
  const sib = LIT334A.moons.filter((x) => x.host === M.host && x.key !== key).map((x) => Math.abs(x.a - M.a)), d = sib.length ? Math.min(...sib) : null;
  return { key, kind: 'moon', r0: d === null ? null : M.a - q * d, r1: d === null ? null : M.a + q * d, rc: M.a, gap: d, q, host: { jupiter: 'Jupiter', saturn: 'Saturn' }[M.host] };
}
/**
 * aStarRecv(T1, GEO, src, { recv, place, cR, r, C0, n }): 受け手の半径の置き方を替えた a★(受け手 recv 'io'・'ring'・'rule' —— 金星も同じ置き方)。
 * 返す { aStar, ratio(照合の半径 ÷ a★), xAt(照合の半径の x), Rr, Rv, cR(受け手の c_R —— 規則・質量の置き方は Rr ÷ 観測の半径) }。区間に x = 1 が無ければ aStar null。
 */
export function aStarRecv(T1, GEO, src, { recv = 'rule', place = 'rule', cR = null, r = null, C0 = null, n = 0 } = {}) {
  const B = hostOf(T1, GEO, src), b = recvBody(recv), V = recvBody('Venus'), pl = { place, cR, r, C0 };
  const Rr = recv === 'rule' ? null : recvRadius(b, pl, B.Ms), Rv = recvRadius(V, pl, C.massOf('Sun'));
  const x = (a) => xOfR(partsR(T1, GEO, src, a, { m: b.m, Rr, Rv }), n);
  const aS = bisLog((a) => x(a) - 1, 1e-3 * B.Ro, 1e3 * B.Ro, 60), ra = b.a;
  return { src, recv, place, aStar: aS, ratio: aS === null || ra === null ? null : ra / aS, xAt: ra === null ? null : x(ra), Rr: Rr === null ? G3.YK * b.m : Rr, Rv, cRr: b.R ? (Rr === null ? G3.YK * b.m : Rr) / b.R : null, cRv: Rv / V.R };
}
/** (P-応) の率の倍の比(受け手 ÷ 金星 ——〔第353便c〕rateMult・観測の半径の物差し)。係数の無い受け手は null */
export function respRatio(id, cR = 1) {
  const a = RC.rateMult(id, { cR, ref: 'obs' }), v = RC.rateMult('Venus', { cR, ref: 'obs' });
  return a === null || v === null ? null : a / v;
}
/** 構造の半径 r が a★ と同じになる扁平の倍の冪 n(対数の二分 ——〔第353便zg〕aStar の n を連続に) */
export function nForRadius(T1, GEO, src, rTarget) {
  // 冪の見当 n₀ = −9 ln(r ÷ a★(n 0)) ÷ ln(1 − f)(a★ ∝ σ^(1/3))の ±0.05 で二分(見当が外れたら DECL.nRange 全部で)
  const g = (n) => ZG.aStar(T1, GEO, src, { n }) / rTarget - 1, f = Z.fOf(src), n0 = -9 * Math.log(rTarget / ZG.aStar(T1, GEO, src, { n: 0 })) / Math.log(1 - f);
  let [L, H] = [n0 - 0.05, n0 + 0.05], gL = g(L);
  if (!(gL * g(H) < 0)) { [L, H] = DECL.nRange; gL = g(L); if (!(gL * g(H) < 0)) return null; }
  for (let i = 0; i < 30; i++) { const mid = 0.5 * (L + H), gm = g(mid); if (gL * gm <= 0) H = mid; else { L = mid; gL = gm; } }
  return 0.5 * (L + H);
}

/* ───────── 表 ───────── */
const HOSTS = Object.freeze(['Jupiter', 'Saturn']);
const HSTRUCT = Object.freeze({ Jupiter: 'io', Saturn: 'satCD' });
const loOf = (src) => (src === 'Pluto' || src === 'Charon' ? DECL.aLo : 1e-3);   // 冥王星・カロンは a★ が観測の半径の 1e-3 倍より内(ほかは源の規則の半径より外に置くため 1e-3)
const strR = (src, key) => ZG.structRows(src).find((q) => q.key === key).r;
/** 表 1(3 組目): 木星 → イオ・土星 → カッシーニの間隙(扁平の倍 3 通り)・冥王星 ⇄ カロン・地球 → 月・火星 → フォボスとダイモス・天王星 → ε 環・海王星(行なし) */
export function table1(T1, GEO) {
  const rows = [];
  for (const src of HOSTS) { const r = strR(src, HSTRUCT[src]), Ro = C.radiusOf(src);
    for (const n of DECL.nList) { const a = ZG.aStar(T1, GEO, src, { n }), q = r / a;
      rows.push({ pair: src + '>' + HSTRUCT[src], src, n, aStar: a, overRo: a / Ro, inside: a < Ro, r, ratio: q, x: ZG.xAtRadius(T1, GEO, src, r, { n }), in5: Math.abs(q - 1) <= 0.05, in50: Math.abs(q - 1) <= 0.5 }); } }
  for (const pr of DECL.pairs) { const P0 = aStarPair(T1, GEO, pr.key);
    for (const rd of P0.reads) rows.push({ pair: pr.key + ':' + rd.read, src: pr.src, n: 0, aStar: P0.aStar, overRo: P0.overRo, inside: P0.inside, r: rd.r, ratio: rd.ratio, x: rd.x, in5: rd.in5, in50: rd.in50 }); }
  for (const src of DECL.others) { const Ro = C.radiusOf(src), a = ZG.aStar(T1, GEO, src, { lo: loOf(src), hi: DECL.aHi }), items = ZG.structRows(src);
    if (!items.length) rows.push({ pair: src + '>none', src, n: 0, aStar: a, overRo: a / Ro, inside: a < Ro, r: null, ratio: null, x: null, in5: false, in50: false });
    for (const S of items) { const q = S.r / a; rows.push({ pair: src + '>' + S.key, src, n: 0, aStar: a, overRo: a / Ro, inside: a < Ro, r: S.r, ratio: q, x: ZG.xAtRadius(T1, GEO, src, S.r), in5: Math.abs(q - 1) <= 0.05, in50: Math.abs(q - 1) <= 0.5 }); } }
  const third = rows.filter((r) => !HOSTS.includes(r.src) && r.in5).length, third50 = rows.filter((r) => !HOSTS.includes(r.src) && r.in50).length;
  return { rows, third, third50 };
}
const unionLen = (iv) => { const s = [...iv].sort((p, q) => p[0] - q[0]); let L = 0, cur = null; for (const [a, b] of s) { if (!cur || a > cur[1]) { if (cur) L += cur[1] - cur[0]; cur = [a, b]; } else cur[1] = Math.max(cur[1], b); } if (cur) L += cur[1] - cur[0]; return L; };
/** 表 2(帯として読む): a★(3 通り)の入る帯と、見込みの置き方 4 × 範囲 2 */
export function table2(T1, GEO) {
  const RoJ = C.radiusOf('Jupiter'), RoS = C.radiusOf('Saturn'), aJ = DECL.nList.map((n) => ZG.aStar(T1, GEO, 'Jupiter', { n })), aS = DECL.nList.map((n) => ZG.aStar(T1, GEO, 'Saturn', { n }));
  const regions = ZG.ringEdges(), gal = LIT334A.moons.filter((m) => m.host === 'jupiter'), io = bandOf('io'), jm = bandOf('jupMain');
  const inBand = DECL.nList.map((n, k) => { const reg = regions.find((g) => aS[k] >= g.r0 && aS[k] <= g.r1);
    return { n, aJ: aJ[k], aS: aS[k], satBand: reg ? reg.key : null, satPos: reg ? Math.log(aS[k] / reg.r0) / Math.log(reg.r1 / reg.r0) : null, qIo: Math.abs(aJ[k] - io.rc) / io.gap, jupMainRatio: jm.rc / aJ[k] }; });
  const ways = [
    { id: 'rep5', jup: '代表の半径 ±5%', sat: '代表の半径 ±5%' }, { id: 'bandAny-q5', jup: 'ガリレオ衛星の道 ± 間隔の 5%', sat: '環の区分のどれか(内縁〜外縁)' },
    { id: 'bandNamed-q5', jup: 'イオの道 ± 間隔の 5%', sat: 'カッシーニの間隙の区分だけ' }, { id: 'bandAny-q10', jup: 'ガリレオ衛星の道 ± 間隔の 10%', sat: '環の区分のどれか(内縁〜外縁)' }];
  const ivJ = (w, lo, hi) => { if (w.id === 'rep5') return ZG.structRows('Jupiter').map((s) => [Math.log(s.r / 1.05), Math.log(s.r / 0.95)]);
    const q = w.id.endsWith('q10') ? 0.1 : 0.05, ms = w.id.startsWith('bandNamed') ? [io] : gal.map((m) => bandOf(m.key, { q }));
    return ms.map((b) => (b.q === q ? [Math.log(b.r0), Math.log(b.r1)] : [Math.log(b.rc - q * b.gap), Math.log(b.rc + q * b.gap)])); };
  const ivS = (w) => { if (w.id === 'rep5') return ZG.structRows('Saturn').map((s) => [Math.log(s.r / 1.05), Math.log(s.r / 0.95)]);
    const rs = w.id.startsWith('bandNamed') ? regions.filter((g) => g.key === 'ringCD') : regions; return rs.map((g) => [Math.log(g.r0), Math.log(g.r1)]); };
  const clip = (iv, lo, hi) => iv.map(([a, b]) => [Math.max(a, lo), Math.min(b, hi)]).filter(([a, b]) => b > a);
  const hit = (iv, a) => iv.some(([p, q]) => Math.log(a) >= p && Math.log(a) <= q);
  const probs = DECL.ranges.flatMap(([g0, g1]) => ways.map((w) => { const span = Math.log(g1 / g0);
    const IJ = ivJ(w), IS = ivS(w), pJ = unionLen(clip(IJ, Math.log(g0 * RoJ), Math.log(g1 * RoJ))) / span, pS = unionLen(clip(IS, Math.log(g0 * RoS), Math.log(g1 * RoS))) / span;
    return { range: [g0, g1], way: w.id, jup: w.jup, sat: w.sat, pJ, pS, both: pJ * pS, hits: DECL.nList.map((n, k) => ({ n, jup: hit(IJ, aJ[k]), sat: hit(IS, aS[k]) })) }; }));
  const bothVals = probs.map((p) => p.both);
  return { inBand, regions, ways, probs, bothMin: Math.min(...bothVals), bothMax: Math.max(...bothVals) };
}
/** 表 3(受け手の置き方): イオ ← 木星・環の粒子 ← 土星(カッシーニの間隙)× 置き方 9(金星も同じ置き方)。2 組が ±5% に残るか */
export function table3(T1, GEO) {
  const rows = DECL.places.map((pl) => { const a = aStarRecv(T1, GEO, 'Jupiter', { recv: 'io', ...pl }), b = aStarRecv(T1, GEO, 'Saturn', { recv: 'ring', ...pl });
    const sameSelf = pl.place === 'rule' || pl.place === 'mass' || pl.place === 'resp';
    return { id: pl.id, place: pl.place, cR: pl.cR ?? null, r: pl.r ?? null, C0: pl.C0 ?? null, sameSelf, io: { aStar: a.aStar, ratio: a.ratio, x: a.xAt, cRr: a.cRr }, ring: { aStar: b.aStar, ratio: b.ratio, x: b.xAt, cRr: b.cRr }, cRv: a.cRv,
      ioIn5: a.ratio !== null && Math.abs(a.ratio - 1) <= 0.05, ringIn5: b.ratio !== null && Math.abs(b.ratio - 1) <= 0.05, respIo: pl.place === 'resp' ? respRatio('Io', pl.cR) : null }; });
  return { rows, both: rows.filter((r) => r.ioIn5 && r.ringIn5).map((r) => r.id), neither: rows.filter((r) => !r.ioIn5 && !r.ringIn5).map((r) => r.id) };
}
/** 表 4(a★ を作る因子): 閉じた形の因子(木星・土星 n 0・冥王星)と、構造を a★ に置く扁平の倍の冪 n(連続)と、その n での他方の比 */
export function table4(T1, GEO) {
  const fac = ['Jupiter', 'Saturn', 'Pluto'].map((src) => { const c = ZG.aStarClosed(T1, GEO, src, { n: 0 }), a = ZG.aStar(T1, GEO, src, { lo: loOf(src), hi: DECL.aHi });
    return { src, aV: c.aV, massRatio: c.massRatio, spinCbrt: Math.cbrt(c.spinRatio), geoCbrt: Math.cbrt(c.gGeo), sunFac: c.aSun / c.aGeo, a0: c.a0, aStar: a, prod: c.aV * c.massRatio * Math.cbrt(c.spinRatio) * Math.cbrt(c.gGeo) * (c.aSun / c.aGeo), f: src === 'Pluto' ? null : Z.fOf(src) }; });
  const targets = [['Jupiter', 'io'], ['Saturn', 'satCD'], ['Saturn', 'satA'], ['Saturn', 'satB']];
  const need = targets.map(([src, key]) => { const r = strR(src, key), n = nForRadius(T1, GEO, src, r), a0 = ZG.aStar(T1, GEO, src, { n: 0 }), f = Z.fOf(src);
    return { src, key, r, n, nApprox: -9 * Math.log(r / a0) / Math.log(1 - f), ratio0: r / a0 }; });
  const cross = need.slice(0, 2).map((q) => { const other = q.src === 'Jupiter' ? ['Saturn', 'satCD'] : ['Jupiter', 'io'], a = ZG.aStar(T1, GEO, other[0], { n: q.n });
    return { at: q.src, n: q.n, other: other[0], otherKey: other[1], otherRatio: strR(other[0], other[1]) / a }; });
  return { fac, need, cross };
}

/* ───────── 零試験 ───────── */
export function pureScenes(T1 = E.t1Table(), GEO = E.geometry()) {
  const io = LIT334A.moons.find((m) => m.key === 'io'), cd = LIT334A.rings.find((g) => g.key === 'satCD');
  // ① 規則の半径の内訳 = 〔第353便zg〕partsAt(木星のイオ・土星のカッシーニの間隙・冥王星)
  const cmp = (src, a) => { const A = partsR(T1, GEO, src, a), B = ZG.partsAt(T1, GEO, src, a); return Math.max(rel(A.sun, B.sun), rel(A.parent, B.parent), rel(A.venus, B.venus)); };
  const vsZg = Math.max(cmp('Jupiter', io.a), cmp('Saturn', cd.r), cmp('Pluto', 2e7));
  // ② a★ = 〔第353便zg〕aStar(木星 n 0・土星 n 0・冥王星 —— 区間を下へ広げて)
  const jup0 = aStarRecv(T1, GEO, 'Jupiter').aStar, sat0 = aStarRecv(T1, GEO, 'Saturn').aStar, zj = ZG.aStar(T1, GEO, 'Jupiter'), zs = ZG.aStar(T1, GEO, 'Saturn');
  const pl = aStarPair(T1, GEO, 'Pluto>Charon').aStar, zp = ZG.aStar(T1, GEO, 'Pluto', { lo: DECL.aLo, hi: DECL.aHi });
  // ③ 受け手の質量を替えても規則の半径の x は同じ・置き方 'mass' C0 1 = 規則の半径
  const xr = xOfR(partsR(T1, GEO, 'Jupiter', io.a)), xm = xOfR(partsR(T1, GEO, 'Jupiter', io.a, { m: io.m }));
  const mass1 = aStarRecv(T1, GEO, 'Jupiter', { recv: 'io', place: 'mass', C0: 1 }).aStar;
  // ④ 受け手の半径の口 = 〔第353便k〕ringStdOm の既定 = 〔第353便d〕circRot(zg の作り)は ①。c_R★ = 〔第353便p〕moonWeights・〔第353便c〕cRStar
  const csIo = cRStarOf(io.m, io.R, C.massOf('Jupiter'), io.a), csIoP = P.moonWeights(T1, GEO, 'io').cRStar;
  const V = recvBody('Venus'), csV = cRStarOf(V.m, V.R, C.massOf('Sun'), V.a), csVc = RC.cRStar('Venus', 'Sun', T1, GEO).cR;
  // ⑤ (P-場) の金星の打ち消しの大きさ(c_R 0.0128)の x = 〔第353便p〕stdCancel field の x(イオの道の半径)
  const fld = aStarRecv(T1, GEO, 'Jupiter', { recv: 'io', place: 'field', cR: 0.0128 }).xAt, fldP = P.stdCancel(T1, GEO, 'Io|Jupiter', { ob: null, place: 'field', cR: 0.0128 }).x;
  // ⑥ 2 天体の距離 = 〔第351便c〕pairInput の Charon|Pluto
  const sep = aStarPair(T1, GEO, 'Charon>Pluto').reads.find((q) => q.read === 'sep').r, sepP = SP.pairInput(T1, GEO, 'Charon', 'Pluto').a;
  const rj = (fn) => { try { fn(); return false; } catch (e) { return e instanceof RangeError; } };
  const rejects = [rj(() => partsR(T1, GEO, 'Jupiter', -1)), rj(() => partsR(T1, GEO, 'Jupiter', 1e9, { m: 0 })), rj(() => partsR(T1, GEO, 'Ceres', 1e9)), rj(() => aStarPair(T1, GEO, 'Earth>Moon')),
    rj(() => bandOf('xx')), rj(() => recvBody('xx')), rj(() => recvRadius(recvBody('io'), { place: 'field', cR: -1 }, 1)), rj(() => recvRadius(recvBody('io'), { place: 'yy' }, 1))];
  return { vsZg, jup0, sat0, zj, zs, pl, zp, xr, xm, mass1, csIo, csIoP, csV, csVc, fld, fldP, sep, sepP, rejects };
}
export function pureGates(S) {
  return {
    partsZg: S.vsZg < 1e-9,
    aStarZg: rel(S.jup0, S.zj) < 1e-9 && rel(S.sat0, S.zs) < 1e-9 && S.zp !== null && rel(S.pl, S.zp) < 1e-9,
    recvMass: rel(S.xm, S.xr) < 1e-9 && rel(S.mass1, S.jup0) < 1e-9,
    cRStar: rel(S.csIo, S.csIoP) < 1e-9 && rel(S.csV, S.csVc) < 1e-9,
    field353p: rel(S.fld, S.fldP) < 1e-5,   // 5 桁(他の源の重みを分母に入れる所の作りの差 —— 相対 2e-6。規則の半径では ① で 1e-9 の内)
    sep351c: rel(S.sep, S.sepP) < 1e-12,
    rejects: S.rejects.length === 8 && S.rejects.every(Boolean),
  };
}
