// 第350便e(原仮定者の整理(2026-11-23 —— 第146報)・統括の検証項目 R422):
//   **背景軸引きずり(太陽系の本で、銀河由来の軸引きずりを背景のベクトルとして与えるもの)と、釣り合う軸の向き・歳差 —— 置き方 3 列((G1) 銀河を geoPN=3 の場の源として
//   数えた値・(G2) 大きさのノブ k_bg・(G3) 向きのノブ)・サンプルの中の源との合成(母天体あり/なし)・天体 15 組の合成の方向と δ と歳差の率・地球ほか 4 組の格子と
//   比べる数に届く k_bg・零試験と変異の純関数 —— 診断だけ**
//   (器 tests/exp-w350e-bgaxial.mjs と QA behavior.bgaxial350e・docs.bgaxial350e が読む —— html を読まない・ファイルを読まない・状態を持たない)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない(AN712 —— エンジンへ足す操作ではない)。背景軸引きずりの鍵はアプリに足さない。
//   既存の lib は呼ぶだけ(本文は変えない): 第348便h(makeField3・rot3・pairRot3・srcRot3・galRot3・DECL.mainCombo)・第348便c(composeAll・precess・LIT・DECL.parentRows)・
//   第347便e(t1Table・geometry・DECL.pairs)・第342便e(galUnit)・第337c(YR)。
//
// ■ 場(共通): 在位の geoPN=3 の本が宣言している形 = 第348便h の makeField3 の既定(K1 の核・源の回転は球のモーメント・背景 W₀ 0・自分の重みを分母に・受け手の速度を引く)。
//   天体の表の場の組は第348便h の主の組 K1rM(在位の形)だけ。
// ■ 回転の読み: (C1) = (P2)(2 点の差分 —— 腕 → 0 の極限)を主・(C2) = 第348便h の rot3('W')(中心の渦度の半分 —— 一次の場の値)を比べる列。
// ■ 背景軸引きずり(恒久の定義 —— 原仮定者の補足(2026-11-14 —— 第138報の補足 3)「太陽系に対する銀河の軸引きずりが、「背景軸引きずり」である。「背景慣性決定力」に含まれる」・
//   計算式の一覧の用語の段と EQ-17): 主の列は (U) 一様な背景軸引きずり(位置に依らない一様な角速度 ω_G・向きは銀河の軸・値は宣言のノブ・天体ごとの効き方は EQ-17 の
//   式の組 rdPow 0・1・2 と massPow −1 をアプリの関数と同じ式で)。「含まれる」の 2 つの読み: (B1) 〔第337便a〕⑤‴ の形 —— 各天体に (背景の取り分 1 − f) × ω_bg/
//   (B2) 並進の背景の重み W₀ とは別に置く(ω_bg をそのまま)。
// ■ 定義と違う置き方の比べる列(消さない): (G1) = 第348便h の galRot3 の値(銀河を円の道の中心の質量 1 つに置いた場の源として数えた回転 —— 向きは銀河の軸のまわり)。
//   (G2) = k_bg × (G1)。(G3) = abs(G1) × 向きの単位ベクトル(銀河の軸・黄道の極・太陽の自転軸)。在位の geoPN=3 の形の W₀ は 0 のまま。
//   分母の列: 'in' = 第348便h の形(太陽由来・母天体由来の項の分母に銀河の重みを含む)/'out' = 銀河を箱に入れない(銀河の重みは分母に入らない —— 背景軸引きずりは回転にだけ入る)。
// ■ 合成((W1) —— 率の大きさを 1 回だけ掛けたベクトルの和): Ω_釣 = Ω_bg + Ω_S(+ Ω_P —— 母天体あり)。abs(Ω_釣) < 1e-6 × Σ abs(各項) なら「向きは決まらない」(0 で割らない)。
// ■ 歳差: 観測の自転軸は Ω_釣 の向きのまわりを回る(円錐の半頂角 = δ = 自転軸と Ω_釣 のなす角・率 = abs(Ω_釣) —— 第348便c の precess)。
// ■ 言わないこと: 歳差の答え・釣り合う向き・背景軸引きずりの大きさとは書かない。この場の形・この置き方・このノブでは、の表。観測の値は固定の比べる列(合わせない)。
import * as L from './lib-w348h-axisgeo3.mjs';
import * as C from './lib-w348c-axisbalance.mjs';
import * as E from './lib-w347e-spintorque.mjs';
import * as P from './lib-w342e-powerball.mjs';
import * as TL from './lib-w337c-tidelock.mjs';

export const LIB_VERSION = 'w350e-bgaxial-lib-2';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const D2R = Math.PI / 180, YR = TL.YR, AS = 180 * 3600 / Math.PI;

/* ───────── 宣言 ───────── */
export const DECL = Object.freeze({
  combo: L.DECL.mainCombo,
  cands: Object.freeze(['P2', 'W']), mainCand: 'P2',
  candNames: Object.freeze({ P2: '(C1) = (P2)', W: "(C2) = rot3('W') の一次の値" }),
  kbg: Object.freeze([0, 1, 10, 100, 1000, 10000]),
  dirs: Object.freeze(['gal', 'eclPole', 'sunSpin']),
  dirSrc: Object.freeze({ gal: '第342便e の galUnit(銀河の回転の軸)', eclPole: '第347便e の geometry の Earth|Sun の n(地球の公転の軸 = 黄道の極)', sunSpin: '第347便e の geometry の Earth|Sun の s(太陽の自転軸)' }),
  parents: Object.freeze(['with', 'without']),
  dens: Object.freeze(['in', 'out']),
  t3k: Object.freeze([0, 1]),
  t4: Object.freeze([['Earth', 'Sun'], ['Mars', 'Sun'], ['Saturn', 'Sun'], ['Moon', 'EarthHi']]),
  degenerate: 1e-6,
  judge: '丸めの桁の床: 角は 1e-9° 以下を 0・180° の手前 1e-9° 以上を 180 と書く',
});
/** 文献の値(固定の比べる列 —— 合わせない)。月の行は軌道の交点の 18.613 年(軸の歳差とは別の量) */
export const LIT = Object.freeze({
  note: '文献の値・未照合(この環境から一次資料に当たっていない)',
  precArcsecPerYr: C.LIT.precArcsecPerYr, precRole: C.LIT.precRole, precSrc: C.LIT.precSrc,
  moonNote: '月の比べる数は軌道の交点の周期 18.613 年(第330便a の lib)—— 月の自転軸の歳差とは別の量(並べるだけ)',
});

/* ───────── 小さな道具 ───────── */
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const scl = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const unit = (a) => { const m = nrm(a); return m > 0 ? scl(a, 1 / m) : [0, 0, 0]; };
const isVec = (a) => Array.isArray(a) && a.length === 3 && a.every(fin);
const angDeg = (a, b) => Math.atan2(nrm(crs(a, b)), dot(a, b)) / D2R;
const snapA = (d) => (d <= 1e-9 ? 0 : d >= 180 - 1e-9 ? 180 : d);
const rel = (a, b) => nrm(sub(a, b)) / Math.max(nrm(b), 1e-300);
const NAME = Object.freeze({ Mercury: 'mercury', Venus: 'venus', Earth: 'earth', Mars: 'mars', Moon: 'moon' });
const obsOf = (id) => { const k = NAME[id]; return k && LIT.precArcsecPerYr[k] !== undefined ? { asYr: LIT.precArcsecPerYr[k], role: id === 'Moon' ? 'otherQty' : LIT.precRole[k] } : null; };

/* ───────── 向き ───────── */
export function dirUnits(GEO = E.geometry()) {
  const g = GEO['Earth|Sun'];
  return { gal: P.galUnit(), eclPole: unit(g.n), sunSpin: unit(g.s) };
}

/* ───────── 由来ごとの回転(分母の列つき)───────── */
/**
 * 組 (id, src) の銀河由来 G(= (G1))・太陽由来 S・母天体由来 P(衛星と冥王星–カロンだけ)。den 'in' は第348便h の pairRot3 そのもの。
 * den 'out' は S・P の分母から銀河の重みを外す(G は銀河を源として数えた値のまま —— 背景軸引きずりの (G1))。
 */
export function termsOf(T1, GEO, id, src, den = 'in') {
  if (!DECL.dens.includes(den)) throw new RangeError('termsOf: 分母の列は in・out');
  const combo = L.DECL.combos.find((c) => c.id === DECL.combo), R = L.pairRot3(T1, GEO, id, src, combo);
  if (den === 'in') return { G: R.G, S: R.S, P: R.P, wSun: R.wSun, wPar: R.wPar, wGal: R.wGal };
  const sunKey = src === 'Sun' ? id + '|' + src : C.DECL.parentRows[id + '|' + src], [sid, ssrc] = sunKey.split('|');
  const S = L.srcRot3(T1, GEO, sid, ssrc, combo, { extraW: R.wPar }), Pp = src === 'Sun' ? null : L.srcRot3(T1, GEO, id, src, combo, { extraW: R.wSun });
  return { G: R.G, S, P: Pp, wSun: R.wSun, wPar: R.wPar, wGal: R.wGal };
}
/** 背景軸引きずりのベクトル: (G1) k 1・gal / (G2) k × (G1) / (G3) abs(G1) × 向き(k を掛けると格子) */
export function bgVec(G1, { k = 1, dir = 'gal', units = null } = {}) {
  if (!isVec(G1)) throw new RangeError('bgVec: (G1)');
  if (!(fin(k) && k >= 0)) throw new RangeError('bgVec: k_bg ≥ 0');
  if (!DECL.dirs.includes(dir)) throw new RangeError('bgVec: 向きは gal・eclPole・sunSpin');
  if (dir === 'gal') return scl(G1, k);
  if (!(units && isVec(units[dir]))) throw new RangeError('bgVec: 向きの単位ベクトル');
  return scl(units[dir], k * nrm(G1));
}
/** 合成((W1) —— 各項の率の大きさを 1 回だけ掛けたベクトルの和)。mut 'twice' は重みを 2 度掛ける変異(abs(Ω) × Ω)。ほぼ 0 なら向きは決まらない */
export function composeBal(terms, { mut = null } = {}) {
  if (!(Array.isArray(terms) && terms.length >= 1 && terms.every(isVec))) throw new RangeError('composeBal: 項');
  let v = [0, 0, 0], sAbs = 0;
  for (const t of terms) { v = add(v, mut === 'twice' ? scl(t, nrm(t)) : t); sAbs += mut === 'twice' ? nrm(t) * nrm(t) : nrm(t); }
  const mag = nrm(v), und = !(mag >= DECL.degenerate * sAbs) || sAbs === 0;
  return { vec: v, mag, sumAbs: sAbs, e: und ? null : scl(v, 1 / mag), undetermined: und };
}
/** 歳差(合成の方向を軸に回る): δ(円錐の半頂角)・率・トルク —— 向きが決まらないときは null */
export function precOf(bal, wAx, I, omega) {
  if (bal.undetermined) return { deltaDeg: null, coneDeg: null, precAsYr: null, torque: null, undetermined: true };
  const p = C.precess(bal.e, bal.mag, wAx, I, omega), d = snapA(p.deltaDeg);
  return { deltaDeg: d, coneDeg: d, precAsYr: p.precAsYr, torque: p.torque, undetermined: false };
}

/* ───────── 表 1: 背景軸引きずりの置き方(15 組 × 候補 2)───────── */
export function bgRows(T1 = E.t1Table(), GEO = E.geometry(), cache = null) {
  const U = dirUnits(GEO), out = [];
  for (const [id, src] of E.DECL.pairs) {
    const R = cache ? cache[id + '|' + src].in : termsOf(T1, GEO, id, src, 'in'), wAx = unit(GEO[id + '|' + src].w), r2 = T1.find((r) => r.id === id && r.src === src && r.mag === 'm2');
    for (const cand of DECL.cands) {
      const G1 = R.G[cand], S = R.S[cand];
      out.push({ id, src, cand, g1MagYr: nrm(G1) * YR, g1ToGalDeg: snapA(angDeg(G1, U.gal)), g1ToSpinDeg: snapA(angDeg(G1, wAx)), g1ToEclDeg: snapA(angDeg(G1, U.eclPole)),
        sMagYr: nrm(S) * YR, g1OverS: nrm(G1) / nrm(S), wGalOverSelf: R.wGal / R.S.A0, betaG: R.G.beta, betaS: R.S.beta, I: r2.I });
    }
  }
  return out;
}

/* ───────── 表 2・表 3: 合成と歳差(15 組 × 候補 2 × 母天体 2 × 分母 2 × k_bg 0・1)───────── */
export function balRows(T1 = E.t1Table(), GEO = E.geometry(), cache = null) {
  const U = dirUnits(GEO), out = [];
  for (const [id, src] of E.DECL.pairs) {
    const key = id + '|' + src, r2 = T1.find((r) => r.id === id && r.src === src && r.mag === 'm2'), wAx = unit(GEO[key].w), o = obsOf(id);
    const sunKey = src === 'Sun' ? key : C.DECL.parentRows[key], nOrb = unit(GEO[sunKey].n);
    for (const den of DECL.dens) {
      const R = cache ? cache[key][den] : termsOf(T1, GEO, id, src, den);
      for (const cand of DECL.cands) for (const par of DECL.parents) for (const k of DECL.t3k) {
        const bg = bgVec(R.G[cand], { k }), terms = [bg, R.S[cand]].concat(par === 'with' && R.P ? [R.P[cand]] : []), bal = composeBal(terms), pr = precOf(bal, wAx, r2.I, r2.omega);
        out.push({ id, src, den, cand, parent: par, k, hasP: !!R.P, magYr: bal.mag * YR, undetermined: bal.undetermined,
          toSpinDeg: pr.deltaDeg, toOrbNDeg: bal.e ? snapA(angDeg(bal.e, nOrb)) : null, toGalDeg: bal.e ? snapA(angDeg(bal.e, U.gal)) : null,
          coneDeg: pr.coneDeg, precAsYr: pr.precAsYr, torque: pr.torque, pOverS: R.P ? nrm(R.P[cand]) / nrm(R.S[cand]) : null,
          obsAsYr: o ? o.asYr : null, obsRole: o ? o.role : null, ratio: o && pr.precAsYr ? pr.precAsYr / o.asYr : null });
      }
    }
  }
  return out;
}

/* ───────── 表 4: k_bg × 向きの格子(4 組 × 候補 2 × 向き 3 × k_bg 6)と、比べる数に届く k_bg ───────── */
/** abs(k b + s) × YR × AS = T の正の根(小さい方)—— 無ければ null */
export function kNeed(b, s, Tas) {
  if (!(isVec(b) && isVec(s) && fin(Tas) && Tas > 0)) throw new RangeError('kNeed: 入力');
  const T = Tas / (YR * AS), A = dot(b, b), Bh = dot(b, s), Cc = dot(s, s) - T * T;
  if (!(A > 0)) return null;
  const disc = Bh * Bh - A * Cc;
  if (disc < 0) return null;
  const sq = Math.sqrt(disc), r = [(-Bh - sq) / A, (-Bh + sq) / A].filter((x) => x > 0).sort((x, y) => x - y);
  return r.length ? r[0] : null;
}
export function gridRows(T1 = E.t1Table(), GEO = E.geometry(), cache = null) {
  const U = dirUnits(GEO), grid = [], need = [];
  for (const [id, src] of DECL.t4) {
    const key = id + '|' + src, r2 = T1.find((r) => r.id === id && r.src === src && r.mag === 'm2'), wAx = unit(GEO[key].w), o = obsOf(id), R = cache ? cache[key].in : termsOf(T1, GEO, id, src, 'in');
    for (const cand of DECL.cands) {
      const src0 = [R.S[cand]].concat(R.P ? [R.P[cand]] : []), s = src0.reduce((t, x) => add(t, x), [0, 0, 0]);
      for (const dir of DECL.dirs) {
        for (const k of DECL.kbg) {
          const bal = composeBal([bgVec(R.G[cand], { k, dir, units: U })].concat(src0)), pr = precOf(bal, wAx, r2.I, r2.omega);
          grid.push({ id, src, cand, dir, k, magYr: bal.mag * YR, deltaDeg: pr.deltaDeg, precAsYr: pr.precAsYr, ratio: o && pr.precAsYr ? pr.precAsYr / o.asYr : null });
        }
        const b = bgVec(R.G[cand], { k: 1, dir, units: U }), kn = o ? kNeed(b, s, o.asYr) : null;
        let atK = null;
        if (kn !== null) { const bal = composeBal([scl(b, kn)].concat(src0)), pr = precOf(bal, wAx, r2.I, r2.omega); atK = { deltaDeg: pr.deltaDeg, precAsYr: pr.precAsYr, magYr: bal.mag * YR }; }
        need.push({ id, src, cand, dir, obsAsYr: o ? o.asYr : null, obsRole: o ? o.role : null, kNeed: kn, reach: o ? (kn !== null ? 'reach' : 'unreached') : 'noObs', atK,
          dirToSpinDeg: snapA(angDeg(dir === 'gal' ? R.G[cand] : U[dir], wAx)) });
      }
    }
  }
  return { grid, need };
}


/* ───────── 主の列 (U): 一様な背景軸引きずり(恒久の定義・EQ-17 の型)───────── */
/** (U) の宣言(値は宣言のノブ —— 銀河の場から決めた値ではない)。ω_G は銀河の公転の角速度(第337便c の GALAXY.omega)の倍で振る。R_ref はアプリの既定 6.5e6 m・m_ref は地球の質量(宣言のノブ) */
export const UDECL = Object.freeze({
  omegaGalRadS: TL.GALAXY.omega, kU: Object.freeze([0, 1, 10, 100, 1000, 10000, 100000]),
  forms: Object.freeze(['rd0', 'rd1', 'rd2', 'rdm']), formNames: Object.freeze({ rd0: 'rdPow 0(因子 1)', rd1: 'rdPow 1(R_d/R_ref)', rd2: 'rdPow 2((R_d/R_ref)²)', rdm: 'rdPow 1・massPow −1((R_d/R_ref)(m_ref/m))' }),
  refRadiusM: 6.5e6, refMassBody: 'Earth', rdRule: 'R_d = Y_k m(〔第313便a〕の規則 —— 在位の形の規則の半径)',
  signs: Object.freeze([1, -1]), signNames: Object.freeze({ '1': '銀河の軸の向き', '-1': '180° の軸(〔第337便a〕⑤‴ の向き)' }),
  same: Object.freeze([['Mercury', 'Sun'], ['Venus', 'Sun'], ['Mars', 'Sun'], ['Saturn', 'Sun'], ['Moon', 'EarthHi']]),
  incl: Object.freeze(['B1', 'B2']), inclW0k: Object.freeze([0, 1]), inclBodies: Object.freeze([['Earth', 'Sun'], ['Mars', 'Sun'], ['Saturn', 'Sun'], ['Moon', 'EarthHi'], ['Io', 'Jupiter']]),
  builtinDecl: '在位の本に宣言は無い(アプリの html の内蔵の本に physics.relativeDrag.galaxyAxial を宣言した本は無い —— grep で読んだだけ)',
});
/** アプリの galaxyAxialRdFactor と同じ式(読むだけで写した —— 演算の順も同じ) */
export function galaxyAxialRdFactor(Rd, Rr, q) { const x = Rd / Rr; return (q === 1) ? x : x * x; }
/** アプリの galaxyAxialRdmFactor と同じ式 */
export function galaxyAxialRdmFactor(Rd, Rr, m, Mr) { const x = Rd / Rr; return x * (Mr / m); }
/** 受け手の係数(EQ-17 の式の組 —— R_d は規則の半径 Y_k m) */
export function uFactor(form, m) {
  if (!(fin(m) && m > 0)) throw new RangeError('uFactor: m > 0');
  const Rd = L.YK * m, Rr = UDECL.refRadiusM;
  if (form === 'rd0') return 1;
  if (form === 'rd1') return galaxyAxialRdFactor(Rd, Rr, 1);
  if (form === 'rd2') return galaxyAxialRdFactor(Rd, Rr, 2);
  if (form === 'rdm') return galaxyAxialRdmFactor(Rd, Rr, m, C.massOf(UDECL.refMassBody));
  throw new RangeError('uFactor: 式の組は rd0・rd1・rd2・rdm');
}
/** (U) の項のベクトル(rad/s): 向き × ω_G × 係数 */
export function uVec(omegaG, form, m, sign = 1) {
  if (!(fin(omegaG) && omegaG >= 0) || !(sign === 1 || sign === -1)) throw new RangeError('uVec: ω_G ≥ 0・向き ±1');
  return scl(P.galUnit(), sign * omegaG * uFactor(form, m));
}
/** (U) の表: 15 組 × 式の組 4 × 読み 2 × 向き 2 × ω_G 7(母天体あり・分母 in) */
export function uRows(T1 = E.t1Table(), GEO = E.geometry(), cache = null) {
  const out = [];
  for (const [id, src] of E.DECL.pairs) {
    const key = id + '|' + src, r2 = T1.find((r) => r.id === id && r.src === src && r.mag === 'm2'), wAx = unit(GEO[key].w), o = obsOf(id), R = cache ? cache[key].in : termsOf(T1, GEO, id, src, 'in'), m = C.massOf(id);
    for (const form of UDECL.forms) for (const cand of DECL.cands) for (const sg of UDECL.signs) for (const k of UDECL.kU) {
      const bal = composeBal([uVec(k * UDECL.omegaGalRadS, form, m, sg), R.S[cand]].concat(R.P ? [R.P[cand]] : [])), pr = precOf(bal, wAx, r2.I, r2.omega);
      out.push({ id, src, form, cand, sign: sg, k, factor: uFactor(form, m), magYr: bal.mag * YR, deltaDeg: pr.deltaDeg, precAsYr: pr.precAsYr, ratio: o && pr.precAsYr ? pr.precAsYr / o.asYr : null });
    }
  }
  return out;
}
/** 地球の比べる数に届く ω_G(式の組 × 読み × 向き)と、同じ ω_G での他の天体の率(1 つの ω_G で同時に届くか —— 事実の表) */
export function uNeedRows(T1 = E.t1Table(), GEO = E.geometry(), cache = null) {
  const out = [], get = (id, src) => (cache ? cache[id + '|' + src].in : termsOf(T1, GEO, id, src, 'in'));
  const Re = get('Earth', 'Sun'), oE = obsOf('Earth'), mE = C.massOf('Earth');
  for (const form of UDECL.forms) for (const cand of DECL.cands) for (const sg of UDECL.signs) {
    const sE = [Re.S[cand]].concat(Re.P ? [Re.P[cand]] : []).reduce((t, x) => add(t, x), [0, 0, 0]), b = uVec(1, form, mE, sg), w = kNeed(b, sE, oE.asYr);
    const others = UDECL.same.map(([id, src]) => {
      const R = get(id, src), r2 = T1.find((r) => r.id === id && r.src === src && r.mag === 'm2'), wAx = unit(GEO[id + '|' + src].w), o = obsOf(id);
      if (w === null) return { id, src, precAsYr: null, deltaDeg: null, ratio: null, obsRole: o ? o.role : null };
      const bal = composeBal([uVec(w, form, C.massOf(id), sg), R.S[cand]].concat(R.P ? [R.P[cand]] : [])), pr = precOf(bal, wAx, r2.I, r2.omega);
      return { id, src, precAsYr: pr.precAsYr, deltaDeg: pr.deltaDeg, ratio: o && pr.precAsYr ? pr.precAsYr / o.asYr : null, obsRole: o ? o.role : null };
    });
    let dE = null;
    if (w !== null) { const r2 = T1.find((r) => r.id === 'Earth' && r.src === 'Sun' && r.mag === 'm2'), bal = composeBal([scl(b, w)].concat([Re.S[cand]])); dE = precOf(bal, unit(GEO['Earth|Sun'].w), r2.I, r2.omega).deltaDeg; }
    out.push({ form, cand, sign: sg, omegaNeedRadS: w, omegaNeedRadYr: w === null ? null : w * YR, overGal: w === null ? null : w / UDECL.omegaGalRadS, earthDeltaDeg: dE, reach: w === null ? 'unreached' : 'reach', others });
  }
  return out;
}
/** 「背景慣性決定力に含まれる」の 2 つの読み: (B1) 〔第337便a〕⑤‴ の形 —— (背景の取り分 1 − f) × ω_bg(f = 箱の中の重みの取り分 =(自分 + 源)÷(W₀ + 自分 + 源))/
 *  (B2) W₀ とは別に置く(ω_bg をそのまま)。ω_bg は地球に届く ω_G((U)・rdPow 0・(C1)・180° の軸)を置いて率を見る(大きさの例 —— 採る数ではない) */
export function inclRows(T1 = E.t1Table(), GEO = E.geometry(), cache = null, need = null) {
  const out = [], nd = (need || uNeedRows(T1, GEO, cache)).find((r) => r.form === 'rd0' && r.cand === 'P2' && r.sign === -1), wbg = nd ? nd.omegaNeedRadS : 0;
  const combo = L.DECL.combos.find((c) => c.id === DECL.combo);
  for (const [id, src] of UDECL.inclBodies) for (const w0k of UDECL.inclW0k) {
    const key = id + '|' + src, R = w0k === 0 && cache ? cache[key].in : L.pairRot3(T1, GEO, id, src, combo, { w0k }), r2 = T1.find((r) => r.id === id && r.src === src && r.mag === 'm2'), wAx = unit(GEO[key].w), o = obsOf(id);
    const A0 = R.S.A0, W0 = w0k * A0, box = A0 + R.wSun + R.wPar, f = box / (W0 + box), oneMinusF = 1 - f;
    for (const incl of UDECL.incl) {
      const coef = incl === 'B1' ? oneMinusF : 1, bal = composeBal([uVec(coef * wbg, 'rd0', C.massOf(id), -1), R.S.P2].concat(R.P ? [R.P.P2] : [])), pr = precOf(bal, wAx, r2.I, r2.omega);
      out.push({ id, src, w0k, incl, oneMinusF, coef, omegaBgRadS: wbg, precAsYr: pr.precAsYr, deltaDeg: pr.deltaDeg, ratio: o && pr.precAsYr ? pr.precAsYr / o.asYr : null });
    }
  }
  return out;
}

/* ───────── 走る順の入口(由来ごとの回転を 1 回だけ作る)───────── */
export function makeCache(T1 = E.t1Table(), GEO = E.geometry()) {
  const cache = {};
  for (const [id, src] of E.DECL.pairs) cache[id + '|' + src] = { in: termsOf(T1, GEO, id, src, 'in'), out: termsOf(T1, GEO, id, src, 'out') };
  return cache;
}
/** 分母の列の差(in と out)—— 太陽由来の項の大きさの比と向きの差・合成の歳差の率の比 */
export function denRows(cache, GEO = E.geometry()) {
  const out = [];
  for (const [id, src] of E.DECL.pairs) for (const cand of DECL.cands) {
    const a = cache[id + '|' + src].in, b = cache[id + '|' + src].out;
    out.push({ id, src, cand, sRatio: nrm(b.S[cand]) / nrm(a.S[cand]) - 1, sAngDeg: snapA(angDeg(a.S[cand], b.S[cand])), pRatio: a.P ? nrm(b.P[cand]) / nrm(a.P[cand]) - 1 : null });
  }
  return out;
}

/* ───────── 零試験・変異・共通の点検の数 ───────── */
/** 有限の差の直径: ê × (u(x+hê) − u(x−hê)) ÷ (2h) */
export function diaRot(u, rc, e, h) { return scl(crs(e, sub(u(add(rc, scl(e, h))), u(sub(rc, scl(e, h))))), 1 / (2 * h)); }
/** 直交 3 直径の 6 点の平均(各直径の 2 点の差分の和の ½) */
export function sixRot(u, rc, h) { let s = [0, 0, 0]; for (const e of [[1, 0, 0], [0, 1, 0], [0, 0, 1]]) s = add(s, diaRot(u, rc, e, h)); return scl(s, 0.5); }
/** 共通の点検の場(源 m 1・R 1・(0,0,0)・速度 (0,1,0)・自転 0/受け手 m 1・R 1・(4,0,0)・速度 0/在位の形) */
export function commonField({ vs = [0, 1, 0], vr = [0, 0, 0], self = true } = {}) {
  return L.makeField3({ sources: [{ m: 1, R: 1, p: [0, 0, 0], v: vs, spin: [0, 0, 0] }], recv: { m: 1, R: 1, p: [4, 0, 0], v: vr }, self });
}
export const COMMON_WANT = Object.freeze({ diaXz: -0.03061311, sixZ: -0.01530656, rotWz: -0.01530612, h: 0.01, tol: 5e-9 });
export function commonChecks() {
  const rc = [4, 0, 0], h = COMMON_WANT.h, f = commonField(), ex = [1, 0, 0];
  const dx = diaRot(f.u, rc, ex, h), s6 = sixRot(f.u, rc, h), w = L.rot3('W', f, rc, { Rb: h });
  const fr = commonField({ vs: [0, -1, 0] }), dxr = diaRot(fr.u, rc, ex, h), s6r = sixRot(fr.u, rc, h);
  const fl = commonField({ vs: [1, 0, 0] }), frest = commonField({ vs: [0, 1, 0], vr: [0, 1, 0] }), fn = commonField({ self: false });
  const dv = [3, -2, 1], fg = commonField({ vs: add([0, 1, 0], dv), vr: dv });
  const big = (v) => nrm(v);
  const rig = (x) => crs([1, 2, 3], x), shr = (x) => [x[1], x[0], 0];
  return {
    diaXz: dx[2], sixZ: s6[2], rotWz: w[2], diaXxy: Math.max(Math.abs(dx[0]), Math.abs(dx[1])),
    reverse: Math.max(rel(dxr, scl(dx, -1)), rel(s6r, scl(s6, -1))),
    line: Math.max(big(diaRot(fl.u, rc, ex, h)), big(sixRot(fl.u, rc, h))), rest: Math.max(big(diaRot(frest.u, rc, ex, h)), big(sixRot(frest.u, rc, h))),
    noSelf: Math.max(big(diaRot(fn.u, rc, ex, h)), big(sixRot(fn.u, rc, h))), galilei: Math.max(rel(diaRot(fg.u, rc, ex, h), dx), rel(sixRot(fg.u, rc, h), s6)),
    rigidSix: sixRot(rig, [0.3, -0.2, 0.5], h), rigidX: diaRot(rig, [0.3, -0.2, 0.5], ex, h), shearX: diaRot(shr, [0.3, -0.2, 0.5], ex, h), shearSix: sixRot(shr, [0.3, -0.2, 0.5], h),
  };
}
export function pureScenes(T1 = E.t1Table(), GEO = E.geometry(), cache = null) {
  const CK = commonChecks(), U = dirUnits(GEO), ch = cache || {};
  const get = (id, src) => ch[id + '|' + src] || (ch[id + '|' + src] = { in: termsOf(T1, GEO, id, src, 'in'), out: termsOf(T1, GEO, id, src, 'out') });
  // ② (G1) k 1 は第348便c の composeAll の W1(母天体なし)・W1P(母天体あり)と同じ/k 0 は源の項だけ
  let vs348 = 0, k0 = 0;
  for (const [id, src] of [['Earth', 'Sun'], ['Moon', 'EarthHi'], ['Io', 'Jupiter'], ['Pluto', 'Charon'], ['Saturn', 'Sun']]) {
    const R = get(id, src).in;
    for (const cand of DECL.cands) {
      const CA = C.composeAll(R.G[cand], R.S[cand], R.P ? R.P[cand] : null);
      vs348 = Math.max(vs348, rel(composeBal([bgVec(R.G[cand], { k: 1 }), R.S[cand]]).vec, CA.W1.vec));
      if (R.P) vs348 = Math.max(vs348, rel(composeBal([bgVec(R.G[cand], { k: 1 }), R.S[cand], R.P[cand]]).vec, CA.W1P.vec));
      const z = composeBal([bgVec(R.G[cand], { k: 0 }), R.S[cand]].concat(R.P ? [R.P[cand]] : [])).vec, want = R.P ? add(R.S[cand], R.P[cand]) : R.S[cand];
      k0 = Math.max(k0, rel(z, want));
    }
  }
  // ③ 背景を 2 倍 → 背景の項だけ 2 倍(源の項は同じビット)
  const Re = get('Earth', 'Sun').in, b1 = bgVec(Re.G.P2, { k: 1 }), b2 = bgVec(Re.G.P2, { k: 2 }), dbl = rel(b2, scl(b1, 2));
  const sumDiff = rel(sub(composeBal([b2, Re.S.P2]).vec, composeBal([b1, Re.S.P2]).vec), b1);
  const dirMag = Math.max(...DECL.dirs.map((d) => Math.abs(nrm(bgVec(Re.G.P2, { k: 1, dir: d, units: U })) / nrm(Re.G.P2) - 1)));
  // ④ 母天体の列の切り替え: 太陽のまわりの組は同じ・衛星は変わる
  const tog = (id, src) => { const R = get(id, src).in, a = composeBal([R.G.P2, R.S.P2].concat(R.P ? [R.P.P2] : [])), b = composeBal([R.G.P2, R.S.P2]); return rel(a.vec, b.vec); };
  const togSun = tog('Earth', 'Sun'), togIo = tog('Io', 'Jupiter'), togMoon = tog('Moon', 'EarthHi');
  // ⑤ 同じ重みを 2 度掛けない: 和は各項のベクトルの和そのもの/変異(abs(Ω) × Ω)は向きと大きさが変わる
  const t3 = [0.5 * nrm(Re.S.P2), 0, 0], tw = composeBal([Re.G.P2, Re.S.P2, t3]), twm = composeBal([Re.G.P2, Re.S.P2, t3], { mut: 'twice' });
  const once = rel(tw.vec, add(add(Re.G.P2, Re.S.P2), t3)), twiceMoves = angDeg(tw.e, twm.e);
  // ⑥ ほぼ 0 の合成は向きを決めない(NaN を出さない)
  const dg = composeBal([scl(Re.S.P2, -1), Re.S.P2]), dgP = precOf(dg, [0, 0, 1], 1, 1), dg2 = composeBal([scl(Re.S.P2, -(1 - 1e-9)), Re.S.P2]);
  const degen = { und: dg.undetermined && dgP.undetermined && dgP.deltaDeg === null, near: dg2.undetermined, ok: !composeBal([Re.G.P2, Re.S.P2]).undetermined };
  // ⑦ 分母の列 in と out は差が小さいが 0 でない
  const Ro = get('Earth', 'Sun').out, denE = nrm(Ro.S.P2) / nrm(Re.S.P2) - 1;
  // ⑧ kNeed: 根で率が比べる数に戻る・届かない場合は null
  const kn = kNeed(Re.G.P2, Re.S.P2, 50.28792), knBack = kn === null ? Infinity : Math.abs(nrm(add(scl(Re.G.P2, kn), Re.S.P2)) * YR * AS / 50.28792 - 1);
  const knNone = kNeed([0, 0, 0], [1, 0, 0], 1) === null && kNeed([1, 0, 0], [1, 0, 0], 1e-3) === null;
  // ⑨ 拒否
  const rej = [() => bgVec(Re.G.P2, { k: -1 }), () => bgVec(Re.G.P2, { dir: 'x' }), () => bgVec(Re.G.P2, { dir: 'eclPole' }), () => composeBal([]), () => termsOf(T1, GEO, 'Earth', 'Sun', 'x'), () => kNeed([1, 0, 0], [0, 0, 0], -1)]
    .map((fn) => { try { fn(); return false; } catch (e) { return e instanceof RangeError; } });
  // ⑪ (U) の係数: アプリの式の写し(rd1 = R_d/R_ref・rd2 = その 2 乗)・rdm は天体に依らない・ω_G 0 は源の項だけ・向きは銀河の軸
  const uf = { rd1: Math.abs(uFactor('rd1', 1e24) - L.YK * 1e24 / UDECL.refRadiusM), rd2: Math.abs(uFactor('rd2', 1e24) / Math.pow(L.YK * 1e24 / UDECL.refRadiusM, 2) - 1),
    rdmSpread: Math.max(...E.DECL.pairs.map(([id]) => Math.abs(uFactor('rdm', C.massOf(id)) / uFactor('rdm', C.massOf('Earth')) - 1))), rd0: uFactor('rd0', 7),
    zero: rel(composeBal([uVec(0, 'rd1', C.massOf('Earth')), Re.S.P2]).vec, Re.S.P2), axis: angDeg(uVec(1, 'rd0', 1), P.galUnit()), flip: rel(uVec(2, 'rd2', 3, -1), scl(uVec(2, 'rd2', 3, 1), -1)) };
  // ⑫ (B1) 在位の形(W₀ 0)では 1 − f が 0(背景の取り分が無い)・W₀ = 自分の重みの中心の値なら 0 と 1 の間
  const Rw = L.pairRot3(T1, GEO, 'Earth', 'Sun', L.DECL.combos.find((c) => c.id === DECL.combo), { w0k: 1 }), boxE = Re.S.A0 + Re.wSun + Re.wPar, boxW = Rw.S.A0 + Rw.wSun + Rw.wPar;
  const incl = { f0: 1 - boxE / (0 + boxE), f1: 1 - boxW / (Rw.S.A0 + boxW) };
  return { common: CK, vs348, k0, dbl, sumDiff, dirMag, togSun, togIo, togMoon, once, twiceMoves, degen, denE, knBack, knNone, rejects: rej, uf, incl };
}
export function pureGates(S) {
  const c = S.common, W = COMMON_WANT, near = (a, b, t = 1e-12) => nrm(sub(a, b)) <= t;
  return {
    common: Math.abs(c.diaXz - W.diaXz) < W.tol && Math.abs(c.sixZ - W.sixZ) < W.tol && Math.abs(c.rotWz - W.rotWz) < W.tol && c.diaXxy < 1e-12,
    commonSym: c.reverse < 1e-12 && c.line < 1e-12 && c.rest < 1e-12 && c.noSelf < 1e-12 && c.galilei < 1e-9,
    commonRigid: near(c.rigidSix, [1, 2, 3], 1e-9) && near(c.rigidX, [0, 2, 3], 1e-9) && near(c.shearX, [0, 0, 1], 1e-9) && near(c.shearSix, [0, 0, 0], 1e-9),
    vs348h: S.vs348 < 1e-12 && S.k0 === 0,
    doubleBg: S.dbl === 0 && S.sumDiff < 1e-6 && S.dirMag < 1e-12,
    parentToggle: S.togSun === 0 && S.togIo > 1 && S.togMoon > 1e-3,
    weightOnce: S.once === 0 && S.twiceMoves > 1,
    degenerate: S.degen.und && S.degen.near && S.degen.ok,
    denCols: Math.abs(S.denE) > 0 && Math.abs(S.denE) < 1e-3 && S.knBack < 1e-9 && S.knNone,
    rejects: S.rejects.length === 6 && S.rejects.every(Boolean),
    uniformU: S.uf.rd1 <= 1e-9 * L.YK * 1e24 / UDECL.refRadiusM && S.uf.rd2 < 1e-9 && S.uf.rdmSpread < 1e-9 && S.uf.rd0 === 1 && S.uf.zero < 1e-12 && S.uf.axis < 1e-6 && S.uf.flip < 1e-12,
    inclB1: S.incl.f0 === 0 && S.incl.f1 > 0 && S.incl.f1 < 1,
  };
}
