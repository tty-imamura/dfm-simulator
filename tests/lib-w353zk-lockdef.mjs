// 第353便zk(原仮定者の補足(2026-11-25 —— 第152報)「金星に影響する軸引きずりの影響が、潮汐力を下回っている」・原仮定者の回答(2026-11-25 —— 第151報)AN1034・
//   「銀河由来の背景軸引きずりの大きさ: これに注目」・原仮定者の指示(2026-11-14 —— 第138報)「潮汐ロックしている状態は、外部からの軸引きずりによる回転よりも、潮汐力が上回っている」・統括の検証項目 R501):
//   **潮汐ロックの定義の不等式(軸引きずりの影響 < 潮汐力)を、主の列の候補 3 本(〔第353便zf〕の (ア)(イ)(ウ))で、比 X = 潮汐のトルク ÷ 軸引きずりの直交成分のトルク として数える純関数 —— 診断だけ**
//   (器 tests/exp-w353zk-lockdef.mjs と QA behavior.lockdef353zk・docs.lockdef353zk が読む —— html を読まない・ファイルを読まない・状態を持たない。後のラウンドの枝もこの口を import してよい)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない。**潮汐のトルクは全部「比べる列(DFM の式ではない)」**(1.5 × k₂/Q × G M_相手² R⁵ ÷ a⁶ —— 第337便c の bodyRow の tide[].N × 1.5 k₂/Q と同じ)。
//   k₂/Q はノブ(値は未照合)。ロックの状態は観測の事実として置く(積分で作らない)。大気熱潮汐は数えない(太陽の側の潮汐力に含まれる読みとして文書で 1 行触れるだけ)。
//   既存の lib は呼ぶだけ(本文は変えない): 第337便c(BODY_SRC・BODY_ROWS・bodyRow・G_SI・DECL.bodies —— 天体の数と k₂/Q の既定)・第353便zf(uVenus・bgUnit・localSumAt・DECL.sats —— 列の作り)・
//   第353便j(kFor・sideRow —— 換算の係数と零試験)・第353便g(periods・lockPhase・egRow・residualOf・earthDrag・orbitGeom —— 金星と地球)・第352便q(structOf —— 土星・天王星・海王星の数)・
//   第352便k(spinRot —— 衛星の自転軸)・第351便c(pairInput —— 道の半径)・第347便e(t1Table・geometry)。
//   **第353便zf・j・g は仮の値の lib(第352便b)を閉包に持つ —— この lib を呼ぶ段の正本は最上位に provisional: true と使った鍵の一覧を持つ**(本 lib が値を読む仮の値は金星の自転周期だけ —— 表 5)。
//
// ■ 語: X = N_潮 ÷ N_軸。N_潮 = 1.5 × (k₂/Q) × G M_相手² R⁵ ÷ a⁶(相手 = 惑星は太陽・衛星は母天体)。N_軸 = C M R² × 自転の率 × 直交成分。
//   Ω = 背景(向き (N+) —— 基準軸 L・大きさ u ω_G)+ 換算の係数 k × 局所 (S)(源 = 太陽・規則の半径 —— 衛星は源 2 つ〔太陽・母天体〕)。
//   列: 'A' (ア) k 1・u 0.98/'I' (イ) k = 0.98 で金星を打ち消す換算の係数(第353便j の kFor —— 規則の半径)・u 0.98/'U' (ウ) k 1・u = 金星の条件 (uV)。
//   置き方 mode: 'obs' 観測の自転の率・直交成分 abs(Ω × ŝ)/'sync' 自転の率 = 公転の率・abs(Ω × ŝ)/'syncAbs' 自転の率 = 公転の率・直交成分を abs(Ω)(傾きに依らない)。
//   k₂/Q の置き方: 'common'(共通 1e-2)/'c337'(第337便c の既定 —— 固体 3e-3・気体 1e-5)。
// ■ 言わないこと: ロックが説明できた・定義と合った・背景の大きさが決まった、と書かない(比の表 —— 候補)。潮汐のトルクを DFM の式と書かない(比べる列)。
import * as TL from './lib-w337c-tidelock.mjs';
import * as ZF from './lib-w353zf-threecols.mjs';
import * as J from './lib-w353j-venus098.mjs';
import * as G from './lib-w353g-venuslock.mjs';
import * as Q2 from './lib-w352q-response.mjs';
import * as K from './lib-w352k-spinform.mjs';
import * as SP from './lib-w351c-srcparts.mjs';
import * as E from './lib-w347e-spintorque.mjs';

export const LIB_VERSION = 'w353zk-lockdef-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const { dot, crs, nrm, scl, add, unit } = K.vec;
export const rel = (a, b) => Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b), 1e-300);
const DAY = 86400;

/* ───────── 宣言(走らせたノブの格子と物差しの記録 —— 式の形の宣言ではない)───────── */
export const COLS = Object.freeze([
  Object.freeze({ id: 'A', label: '(ア)', u: 0.98, k: 1, text: '規則の係数そのまま・背景 0.98' }),
  Object.freeze({ id: 'I', label: '(イ)', u: 0.98, k: 'venus', text: '0.98 で金星を打ち消す換算の係数を局所の項に置く・背景 0.98' }),
  Object.freeze({ id: 'U', label: '(ウ)', u: 'uV', k: 1, text: '規則の係数そのまま・背景を金星の条件の大きさに' }),
]);
export const DECL = Object.freeze({
  cols: Object.freeze(COLS.map((c) => c.id)), mainCols: Object.freeze(['A', 'I', 'U']),
  modes: Object.freeze(['obs', 'sync', 'syncAbs']),
  modeLabel: Object.freeze({ obs: '観測の自転の率・abs(Ω × ŝ)', sync: '自転の率 = 公転の率・abs(Ω × ŝ)', syncAbs: '自転の率 = 公転の率・abs(Ω)' }),
  k2qModes: Object.freeze(['common', 'c337']), k2qCommon: 1e-2,
  /** 受け手(8 惑星と月・イオ) */
  bodies: Object.freeze(['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Moon', 'Io']),
  planets: Object.freeze(['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune']),
  /** 数の出どころ: 第337便c の BODY_SRC に無い天体は第352便q の structOf(質量・半径・慣性モーメントの係数・自転の率・公転の率)と第351便c の pairInput(道の半径) */
  fromStruct: Object.freeze(['Saturn', 'Uranus', 'Neptune']),
  gas: Object.freeze(['Jupiter', 'Saturn', 'Uranus', 'Neptune']),
  host: Object.freeze({ Moon: 'Earth', Io: 'Jupiter' }),
  /** k₂/Q を共通で振る格子(表 2) */
  k2qScan: Object.freeze([1e-4, 3e-4, 1e-3, 3e-3, 1e-2, 3e-2, 1e-1]), k2qLo: 1e-4, k2qHi: 1e-1,
  /** 背景の倍率 u の格子(表 3 —— 1e-3〜1e2 を対数で 61 点)と境の二分 */
  uLo: 1e-3, uHi: 1e2, uN: 61, uIter: 50,
  /** これまでの窓(〔第352便y〕の (N+))・注目の列 */
  window: Object.freeze([0.0487, 0.835]), uFocus: 0.98,
  /** (B − A)/C のノブの格子(第353便g の egRow) */
  qGrid: Object.freeze([1e-7, 1e-6, 1e-5]),
  /** 1 会合の平均 ⟨1/d⁶⟩ の刻み */
  nSyn: 4096,
  /** 表 5: 1 会合の間の金星の太陽日の数 N の整数の格子 */
  nGrid: Object.freeze([-8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3]),
  provKeys: Object.freeze(['venus.spin.period']),
  judge: '逐語の表は有効数字 3 桁・零試験は相対 1e-9 の床(同じ入力の照合)・統括の数え直し 8 は表示の桁(相対 1e-2)',
});
/**
 * ロックの状態(観測の事実として置く —— 原仮定者の補足(2026-11-25 —— 第152報)と PHYSICS〔第330便a〕の 3 分類の宣言):
 *   'lock' 潮汐ロック(月・イオ)/'part' ある程度ロック(水星 —— 3:2・金星 —— 太陽と地球に同時)/'not' ロックしない(地球・火星・木星・土星・天王星・海王星)
 */
export const lockStates = Object.freeze({ Moon: 'lock', Io: 'lock', Mercury: 'part', Venus: 'part', Earth: 'not', Mars: 'not', Jupiter: 'not', Saturn: 'not', Uranus: 'not', Neptune: 'not' });
const CACHE = { T1: null, GEO: null, kI: {}, om: {}, body: {} };
const ctx = (o = {}) => ({ T1: o.T1 || (CACHE.T1 || (CACHE.T1 = E.t1Table())), GEO: o.GEO || (CACHE.GEO || (CACHE.GEO = E.geometry())) });
const val = (id, k) => (TL.BODY_SRC[id] && TL.BODY_SRC[id][k] ? TL.BODY_SRC[id][k][0] : null);

/* ───────── 天体の数 ───────── */
/** 天体の数: { id, M, R, C, I, spin(観測の自転の率 rad/s —— 符号つき・逆行は負), nOrb(公転の率 rad/s —— 衛星は母天体のまわり), a(潮汐の相手との距離 m), pert, Mp, kind, src } */
export function bodyOf(id, o = {}) {
  if (CACHE.body[id]) return CACHE.body[id];
  if (!DECL.bodies.includes(id)) throw new RangeError('bodyOf: 天体は ' + DECL.bodies.join('・'));
  let b;
  if (DECL.fromStruct.includes(id)) {
    const { T1, GEO } = ctx(o), s = Q2.structOf(T1, GEO, id), P = SP.pairInput(T1, GEO, id, 'Sun');
    b = { id, M: s.M, R: s.R, C: s.moi, spin: s.omega, nOrb: s.n, a: P.a, pert: 'Sun', Mp: val('Sun', 'M'), src: '第352便q の structOf・第351便c の pairInput' };
  } else if (id in DECL.host) {
    const po = val(id, 'porb');
    b = { id, M: val(id, 'M'), R: val(id, 'R'), C: val(id, 'C'), spin: 2 * Math.PI / po, nOrb: 2 * Math.PI / po, a: val(id, 'a'), pert: DECL.host[id], Mp: val(DECL.host[id], 'M'), src: '第337便c の BODY_SRC(自転は同期 —— 観測の事実)' };
  } else {
    const sp = val(id, 'spin');
    b = { id, M: val(id, 'M'), R: val(id, 'R'), C: val(id, 'C'), spin: 2 * Math.PI / sp, nOrb: 2 * Math.PI / val(id, 'porb'), a: val(id, 'aHel'), pert: 'Sun', Mp: val('Sun', 'M'), src: '第337便c の BODY_SRC' };
  }
  if (![b.M, b.R, b.C, b.spin, b.nOrb, b.a, b.Mp].every(fin)) throw new RangeError('bodyOf: 数が無い ' + id);
  b.I = b.C * b.M * b.R * b.R; b.kind = DECL.gas.includes(id) ? 'gas' : 'solid'; b.state = lockStates[id];
  return (CACHE.body[id] = Object.freeze(b));
}
/** k₂/Q の値(置き方 'common' 1e-2・'c337' 第337便c の既定・数を直に渡しても良い) */
export function k2qOf(id, k2q = 'common') {
  if (fin(k2q) && k2q > 0) return k2q;
  if (k2q === 'common') return DECL.k2qCommon;
  if (k2q === 'c337') return bodyOf(id).kind === 'gas' ? TL.DECL.bodies.k2qGas : TL.DECL.bodies.k2qSolid;
  throw new RangeError('k2qOf: common・c337・正の数');
}

/* ───────── 約束の口 ───────── */
/** 潮汐のトルク(比べる列 —— DFM の式ではない)N m: 1.5 × k₂/Q × G M_相手² R⁵ ÷ a⁶。pert を省くと主の相手(惑星は太陽・衛星は母天体)。a を渡すとその距離で */
export function tideTorque(id, pert = null, { k2q = 'common', a = null } = {}) {
  const b = bodyOf(id), p = pert || b.pert;
  const Mp = p === b.pert ? b.Mp : (p === 'Earth' ? val('Earth', 'M') : p === 'Sun' ? val('Sun', 'M') : null);
  if (!fin(Mp)) throw new RangeError('tideTorque: 相手の質量が無い ' + p);
  const d = a === null ? (p === b.pert ? b.a : null) : a;
  if (!(fin(d) && d > 0)) throw new RangeError('tideTorque: 距離が無い(' + id + ' ← ' + p + ')');
  return 1.5 * k2qOf(id, k2q) * TL.G_SI * Mp * Mp * Math.pow(b.R, 5) / Math.pow(d, 6);
}
/** 列の u と k(u を渡すと背景だけ置き直す —— 列 (イ) は u ごとに金星を打ち消す換算の係数を置き直す) */
export function colParams(col, { u = null } = {}, o = {}) {
  const c = COLS.find((x) => x.id === col); if (!c) throw new RangeError('colParams: 列は ' + DECL.cols.join('・'));
  const uu = u !== null ? u : (c.u === 'uV' ? ZF.uVenus(o) : c.u);
  if (!(fin(uu) && uu > 0)) throw new RangeError('colParams: u > 0');
  let k = c.k;
  if (k === 'venus') { if (!CACHE.kI[uu]) { const { T1, GEO } = ctx(o); CACHE.kI[uu] = J.kFor(null, { u: uu, place: 'rule', T1, GEO }).k; } k = CACHE.kI[uu]; }
  return { col, label: c.label, u: uu, k };
}
/** 合成の回転 Ω(rad/s のベクトル)と自転軸 ŝ・背景のベクトル(第353便zf の作り: u × bgUnit + k × localSumAt(λ 1)) */
export function omOf(id, col, { u = null } = {}, o = {}) {
  const p = colParams(col, { u }, o), ck = id + '|' + p.u + '|' + p.k;
  if (CACHE.om[ck]) return CACHE.om[ck];
  const { T1, GEO } = ctx(o), bg = scl(ZF.bgUnit(o), p.u), loc = ZF.localSumAt(id, 1, o), Om = add(bg, scl(loc, p.k));
  const srcs = ZF.DECL.sats[id] || ['Sun'], sHat = unit(K.spinRot(T1, GEO, id, srcs[srcs.length - 1], { part: 'S' }).sHat);
  return (CACHE.om[ck] = { ...p, Om, bg, loc, sHat, W: nrm(Om), perp: nrm(crs(Om, sHat)), bgMag: nrm(bg) });
}
/** 軸引きずりの直交成分のトルク N m: C M R² × 自転の率 × 直交成分(mode 'obs'・'sync'・'syncAbs') */
export function dragTorque(id, col, { mode = 'obs', u = null } = {}, o = {}) {
  if (!DECL.modes.includes(mode)) throw new RangeError('dragTorque: mode は ' + DECL.modes.join('・'));
  const b = bodyOf(id, o), w = omOf(id, col, { u }, o), rate = mode === 'obs' ? Math.abs(b.spin) : b.nOrb, comp = mode === 'syncAbs' ? w.W : w.perp;
  return b.I * rate * comp;
}
/** X = 潮汐のトルク ÷ 軸引きずりの直交成分のトルク */
export function xOf(id, col, { mode = 'obs', k2q = 'common', u = null } = {}, o = {}) {
  return tideTorque(id, null, { k2q }) / dragTorque(id, col, { mode, u }, o);
}
/** X = 1 になる自転周期(日)と公転の周期との比(直交成分は perpMode 'perp' = abs(Ω × ŝ)・'abs' = abs(Ω))。比 > 1 なら「同期の自転でも軸引きずりが上回る」 */
export function pCrit(id, col, { k2q = 'common', perpMode = 'perp', u = null } = {}, o = {}) {
  const b = bodyOf(id, o), w = omOf(id, col, { u }, o), comp = perpMode === 'abs' ? w.W : w.perp;
  const wCrit = tideTorque(id, null, { k2q }) / (b.I * comp), days = 2 * Math.PI / wCrit / DAY, porbDays = 2 * Math.PI / b.nOrb / DAY;
  return { days, porbDays, overPorb: days / porbDays };
}
/**
 * 1 本の線で分かれるか: 行 { id, state, X } から。partAsLock true(主 —— 第152報)は「ある程度ロック」をロックの側に・false(比べる列)は数えない。
 * 返す { lockMin, notMax, separable(lockMin > notMax), atOne(lockMin > 1 > notMax), outLock(ロックの側で X ≤ 1), outNot(ロックしない側で X ≥ 1), lockMinId, notMaxId }
 */
export function separateAt(rows, { partAsLock = true } = {}) {
  const L = rows.filter((r) => r.state === 'lock' || (partAsLock && r.state === 'part')), N = rows.filter((r) => r.state === 'not');
  if (!L.length || !N.length) throw new RangeError('separateAt: 両側の行が要る');
  const lmin = L.reduce((a, r) => (r.X < a.X ? r : a), L[0]), nmax = N.reduce((a, r) => (r.X > a.X ? r : a), N[0]);
  return { lockMin: lmin.X, lockMinId: lmin.id, notMax: nmax.X, notMaxId: nmax.id, separable: lmin.X > nmax.X, atOne: lmin.X > 1 && nmax.X < 1,
    outLock: L.filter((r) => !(r.X > 1)).map((r) => r.id), outNot: N.filter((r) => !(r.X < 1)).map((r) => r.id) };
}
/** 列 × 置き方 × k₂/Q の X の行(10 天体) */
export function xRows(col, { mode = 'obs', k2q = 'common', u = null } = {}, o = {}) {
  return DECL.bodies.map((id) => ({ id, state: lockStates[id], X: xOf(id, col, { mode, k2q, u }, o) }));
}
/** k₂/Q を共通で振ったとき線(比 1)で分かれる k₂/Q の範囲(X は k₂/Q に比例 —— 閉じた形): [1 ÷ 単位の lockMin, 1 ÷ 単位の notMax](空なら null)と格子 [lo, hi] に切ったもの */
export function k2qBand(col, { mode = 'obs', partAsLock = true, u = null } = {}, o = {}) {
  const s = separateAt(xRows(col, { mode, k2q: 1, u }, o), { partAsLock }), lo = 1 / s.lockMin, hi = 1 / s.notMax;
  const open = lo < hi, clip = open ? [Math.max(lo, DECL.k2qLo), Math.min(hi, DECL.k2qHi)] : null;
  return { lo, hi, open, clip: clip && clip[0] < clip[1] ? clip : null, lockMinId: s.lockMinId, notMaxId: s.notMaxId,
    grid: DECL.k2qScan.map((q) => ({ k2q: q, atOne: q > lo && q < hi })) };
}
/** u を振ったとき線(比 1)で分かれる u の範囲(格子 61 点 + 境の二分)。返す { grid(u ごとの lockMin・notMax・atOne), ranges([下端, 上端] の列), edges } */
export function uBand(col, { mode = 'obs', k2q = 'common', partAsLock = true } = {}, o = {}) {
  const us = Array.from({ length: DECL.uN }, (_, i) => DECL.uLo * Math.pow(DECL.uHi / DECL.uLo, i / (DECL.uN - 1)));
  const at = (u) => separateAt(xRows(col, { mode, k2q, u }, o), { partAsLock });
  const grid = us.map((u) => { const s = at(u); return { u, lockMin: s.lockMin, lockMinId: s.lockMinId, notMax: s.notMax, notMaxId: s.notMaxId, atOne: s.atOne }; });
  const refine = (a, b) => { let lo = a, hi = b; const fa = at(a).atOne; for (let i = 0; i < DECL.uIter; i++) { const m = Math.sqrt(lo * hi); if (at(m).atOne === fa) lo = m; else hi = m; } return Math.sqrt(lo * hi); };
  const ranges = []; let start = null;
  for (let i = 0; i < grid.length; i++) {
    if (grid[i].atOne && start === null) start = i === 0 ? { u: grid[0].u, clipped: true } : { u: refine(grid[i - 1].u, grid[i].u), clipped: false };
    if (start !== null && (!grid[i].atOne || i === grid.length - 1)) {
      const end = grid[i].atOne ? { u: grid[i].u, clipped: true } : { u: refine(grid[i - 1].u, grid[i].u), clipped: false };
      const sl = at(start.clipped ? start.u : start.u * 1.0001), se = at(end.clipped ? end.u : end.u / 1.0001);
      ranges.push({ lo: start.u, hi: end.u, loClipped: start.clipped, hiClipped: end.clipped, loEdgeBody: start.clipped ? null : (Math.abs(sl.notMax - 1) < Math.abs(sl.lockMin - 1) ? sl.notMaxId : sl.lockMinId),
        hiEdgeBody: end.clipped ? null : (Math.abs(se.notMax - 1) < Math.abs(se.lockMin - 1) ? se.notMaxId : se.lockMinId) });
      start = null;
    }
  }
  return { grid, ranges };
}
/** u の点が範囲の内か */
export const inRanges = (u, ranges) => ranges.some((r) => u >= r.lo && u <= r.hi);

/* ───────── 金星 —— 地球の影響(表 4)───────── */
/** 金星と地球の道の半径(第337便c の BODY_SRC —— 統括の数え直し 8 と同じ)と 1 会合の平均 ⟨1/d⁶⟩(円の同じ面の道・会合の位相で一様)・内合の 1/d⁶ */
export function synAvg({ n = DECL.nSyn } = {}) {
  const aV = val('Venus', 'aHel'), aE = val('Earth', 'aHel');
  let s = 0; for (let j = 0; j < n; j++) { const th = (j + 0.5) / n * 2 * Math.PI, d2 = aE * aE + aV * aV - 2 * aE * aV * Math.cos(th); s += 1 / (d2 * d2 * d2) / n; }
  const dInf = aE - aV;
  return { aV, aE, dInf, invD6Inf: 1 / Math.pow(dInf, 6), invD6Mean: s, dEffMean: Math.pow(s, -1 / 6) };
}
/**
 * 金星の行(列 col): 残る軸引きずりの直交成分のトルク N_軸(観測の自転の率)に対する (i) 地球の潮汐のトルク(k₂/Q 1e-2 —— 内合・1 会合の平均)・(ii) 地球の重力 × (B − A)/C の最大のトルク(第353便g の egRow)・
 * (iii) 太陽の潮汐のトルク の比。rNeed = 地球の項が N_軸 と等しくなる「残り(直交成分)÷ 背景」・qNeed = (E-g) が N_軸 と等しくなる (B − A)/C。
 */
export function venusEarthRow(col, { k2q = 'common' } = {}, o = {}) {
  const { T1, GEO } = ctx(o), b = bodyOf('Venus', o), w = omOf('Venus', col, {}, o), Nax = dragTorque('Venus', col, { mode: 'obs' }, o), sa = synAvg();
  const ME = val('Earth', 'M'), base = 1.5 * k2qOf('Venus', k2q) * TL.G_SI * ME * ME * Math.pow(b.R, 5);
  const tideInf = base * sa.invD6Inf, tideMean = base * sa.invD6Mean, tideSun = tideTorque('Venus', 'Sun', { k2q });
  const eg = DECL.qGrid.map((q) => { const r = G.egRow(T1, GEO, q), N = b.I * r.torqueRate; return { q, torque: N, ratio: N / Nax }; });
  const perQ = eg[0].torque / eg[0].q, den = b.I * Math.abs(b.spin) * w.bgMag;
  return { col, u: w.u, k: w.k, Nax, perpOverBg: w.perp / w.bgMag, WOverBg: w.W / w.bgMag,
    tideInf, tideMean, tideSun, rInf: tideInf / Nax, rMean: tideMean / Nax, rSun: tideSun / Nax, eg,
    rNeedInf: tideInf / den, rNeedMean: tideMean / den, rNeedEg: eg.map((e) => ({ q: e.q, r: e.torque / den })), qNeed: Nax / perQ, earthOverSun: tideInf / tideSun };
}
/** 第353便g の (E-S) ÷ 残り(内合・(uV)・基準軸 L)と残り(rad/s)—— 零試験と表 4 の並べ */
export function gRows(o = {}) {
  const { T1, GEO } = ctx(o), r = G.residualOf(T1, GEO, { magId: 'uV' }), e = G.earthDrag(T1, GEO);
  return { res: r.res, resOverBg: r.resOverBg, esInf: e.infS, esOverRes: e.infS / r.res, emMean: e.meanM, emOverRes: e.meanM / r.res };
}

/* ───────── 表 5: 同時にロックの整数の並び(算術・仮)───────── */
/** 1 会合の間の金星の太陽日の数 N =(自転の率 − 公転の率)× 会合の周期 ÷ 2π(自転は符号つき —— 逆行は負・第353便g の periods —— 仮の自転周期) */
export function solarDaysN(spinDaysSigned = null) {
  const P = G.periods(), sd = spinDaysSigned === null ? -P.spin : spinDaysSigned, S = 1 / (1 / P.orbV - 1 / P.orbE);
  return { orbV: P.orbV, orbE: P.orbE, S, spinDays: sd, N: (1 / sd - 1 / P.orbV) * S };
}
/** 整数 N ごとの自転周期(日 —— 符号つき・負は逆行)と向き */
export function nRow(N) {
  if (!Number.isInteger(N)) throw new RangeError('nRow: 整数');
  const P = G.periods(), S = 1 / (1 / P.orbV - 1 / P.orbE), f = 1 / P.orbV + N / S;   // 自転の回数 / 日
  return { N, spinDays: f === 0 ? null : 1 / f, sense: f === 0 ? 'none' : f < 0 ? 'retro' : 'pro', sameFace: true };
}

/* ───────── 零試験 ───────── */
/** 統括の数え直し 8(表示の桁): [天体, 列, X観, X同‖] と地球 → 金星の潮汐 ÷ 太陽 → 金星 */
export const ANCHOR = Object.freeze({
  rows: Object.freeze([
    ['Mercury', 'A', 109, 18.1], ['Mercury', 'I', 47.8, 3.27], ['Mercury', 'U', 3.93e13, 2.69e12],
    ['Venus', 'A', 160, 1.18], ['Venus', 'I', 96.1, 88.8], ['Venus', 'U', 7.89e13, 7.30e13],
    ['Earth', 'A', 1.82e-3, 0.261], ['Earth', 'I', 2.84e-3, 0.417], ['Earth', 'U', 2.33e9, 3.42e11],
    ['Mars', 'A', 1.73e-4, 0.0496], ['Mars', 'I', 1.96e-4, 0.0555], ['Mars', 'U', 1.61e8, 4.56e10],
    ['Jupiter', 'A', 1.43e-6, 9.01e-4], ['Jupiter', 'I', 1.43e-6, 9.03e-4], ['Jupiter', 'U', 1.18e6, 7.42e8]].map(Object.freeze)),
  earthOverSunInf: 2.88e-9, uV: 1.19282e-12, kI: 8.2158e11, gRes: 1.44e-29, gEsOverRes: 1.10e-12, nNow: -5,
});
export function pureScenes(T1 = E.t1Table(), GEO = E.geometry()) {
  const o = { T1, GEO };
  const anchor = ANCHOR.rows.map(([id, c, xo, xa]) => ({ id, col: c, xObs: xOf(id, c, { mode: 'obs' }, o), xAbs: xOf(id, c, { mode: 'syncAbs' }, o), refObs: xo, refAbs: xa }));
  const sa = synAvg(), eos = Math.pow(val('Earth', 'M') / val('Sun', 'M'), 2) * Math.pow(sa.aV / sa.dInf, 6);
  const eosLib = (1.5 * 1e-2 * TL.G_SI * val('Earth', 'M') ** 2 * Math.pow(bodyOf('Venus').R, 5) * sa.invD6Inf) / tideTorque('Venus', 'Sun');
  // tide[].N(第337便c の bodyRow —— 主の相手の行)× 1.5 k₂/Q
  const tide = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Moon', 'Io'].map((id) => { const row = TL.BODY_ROWS.find((r) => r.id === id), br = TL.bodyRow(row), t = br.tide.find((x) => x.p === bodyOf(id).pert);
    return { id, lib: t.N * 1.5 * 1e-2, mine: tideTorque(id, null, { k2q: 1e-2 }) }; });
  // 第353便zf の colState(uV)と第353便j の kFor
  const cs = ZF.colState('U', o), kj = J.kFor(null, { u: 0.98, place: 'rule', T1, GEO }).k;
  // Ω の照合(惑星: 第353便j の sideRow の _ms.Om)
  const om = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'].flatMap((id) => DECL.cols.map((c) => { const w = omOf(id, c, {}, o), s = J.sideRow(id, { u: w.u, k: w.k, cR: null, place: 'rule', T1, GEO })._ms;
    return { id, col: c, d: nrm([w.Om[0] - s.Om[0], w.Om[1] - s.Om[1], w.Om[2] - s.Om[2]]) / nrm(s.Om), dS: nrm([w.sHat[0] - s.sHat[0], w.sHat[1] - s.sHat[1], w.sHat[2] - s.sHat[2]]) }; }));
  const g = gRows(o), wU = omOf('Venus', 'U', {}, o);
  const nNow = solarDaysN();
  const lin = xOf('Earth', 'A', { k2q: 2e-2 }, o) / xOf('Earth', 'A', { k2q: 1e-2 }, o);
  const st = bodyOf('Saturn', o);
  return { anchor, eos, eosLib, tide, uV: cs.u, uVlib: ZF.uVenus(o), kI: colParams('I', {}, o).k, kj, om, g, venusUW: wU.W, nNow, lin, saturn: { M: st.M, C: st.C, src: st.src } };
}
export function pureGates(S) {
  return {
    anchor8: S.anchor.every((r) => rel(r.xObs, r.refObs) <= 1e-2 && rel(r.xAbs, r.refAbs) <= 1e-2) && rel(S.eos, ANCHOR.earthOverSunInf) <= 1e-2,
    earthSunLib: rel(S.eosLib, S.eos) <= 1e-9,
    tide337c: S.tide.every((r) => rel(r.lib, r.mine) <= 1e-9),
    uV: rel(S.uV, S.uVlib) <= 1e-9 && rel(S.uV, ANCHOR.uV) <= 1e-5,
    kI: rel(S.kI, S.kj) <= 1e-9 && rel(S.kI, ANCHOR.kI) <= 1e-4,
    omSide: S.om.every((r) => r.d <= 1e-9 && r.dS <= 1e-9),
    gRes: rel(S.g.res, ANCHOR.gRes) <= 1e-2 && rel(S.g.esOverRes, ANCHOR.gEsOverRes) <= 1e-2 && rel(S.venusUW, S.g.res) <= 1e-6,
    nNow: Math.abs(S.nNow.N - ANCHOR.nNow) < 0.1,
    k2qLinear: rel(S.lin, 2) <= 1e-12,
    struct: S.saturn.C > 0 && S.saturn.M > 0 && /structOf/.test(S.saturn.src),
  };
}
