// 第353便e(原仮定者の回答(2026-11-25 —— 第151報)・統括の検証項目 R469):
//   **注目の列 u = 0.98 —— 背景の向きは太陽系の基準軸の向き (N+) に置いたまま、大きさだけ銀河の公転の角速度の 0.98 倍に置いた列を数える純関数。
//   受け手ごとの状態・傾きを保つために要る「寄る割合」f の上限・向きと大きさを分ける表・金星の条件と 0.98 を同時に置いたときの副作用 —— 診断だけ**
//   (器 tests/exp-w353e-focus098.mjs と QA behavior.focus098_353e・docs.focus098_353e が読む —— html を読まない・ファイルを読まない・状態を持たない。後のラウンドの枝もこの口を import してよい)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない。
//   既存の lib は呼ぶだけ(本文は変えない): 第352便w(stateW・fKeep・fRingMin)・第352便y(condKeep・condSunTurn・residualOf・condResid・unitsOf)・
//   第352便za(topicCell・uVofCol)・第352便c(refAxes)・第352便d(bgVec)・第351便d(vec・angDeg)・第347便e(t1Table・geometry)。
//
// ■ 語: u = 背景の大きさ ÷ ω_G(ω_G = 銀河の公転の角速度 9.09e-16 rad/s —— 第352便y の DECL)。背景の向き (N+) = 太陽系の基準軸の向き(主)・(G−) = 銀河の回転と逆向き(比べる列)。
//   基準軸 L(角運動量の重み —— 主)。局所の主の成分 (S)(源の自転の分 —— 第352便o の localS)・源の半径は規則の半径(tSrc 0 —— 主)。全体: Ω = 背景 + k × 局所。
//   「寄る割合」f = 第351便d の (N1) の比率(経路 ① が円錐を縮める側の割合)。傾きを保つ物差しは割合 10%(第352便w の q10)。
// ■ 口:
//   focusState(T1, GEO, key, { dir, u = 0.98, axis = 'L', tSrc = 0, k = 1 }) —— 第352便w の stateW の状態に、k を局所だけに掛けた合成・合成と基準軸の角・合成と背景の角
//     (背景に直交する局所の成分から直接に数える —— 大きい数の差で作らない)・単位の応答(k₂ 1)の歳差の一周の年数・年齢の内の周の数を足す。
//   fMaxAt(key, { dir, u, axis, tSrc, k, crit, T1, GEO, cache }) —— 傾きを保つ f の上限(第352便w の fKeep)。
//   uMaxAt(key, { dir, f, axis, tSrc, T1, GEO, cache }) —— f を置いたときの u の上限(第352便y の condKeep —— key で受け手を替える)。
//   sepTable(T1, GEO, cache) —— 条件 × 向き 2 つ × 大きさの格子の値と、「向きだけで決まる/大きさだけで決まる/両方に依る」の分け。
// ■ 言わないこと: 背景の大きさを 1 つの値には置かない(注目の列)。0.98 を (N+) の窓の内とは書かない(窓の上端 0.835 より上 —— 寄る割合が上限以下のときだけ傾きは保たれる)。
import * as W from './lib-w352w-keepcone.mjs';
import * as Y from './lib-w352y-bgwindow.mjs';
import * as Z from './lib-w352za-sconseq.mjs';
import * as RC from './lib-w352c-refaxis.mjs';
import * as D from './lib-w352d-precsense.mjs';
import * as R3 from './lib-w351d-r3step.mjs';
import * as E from './lib-w347e-spintorque.mjs';

export const LIB_VERSION = 'w353e-focus098-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const { dot, nrm, scl, add, sub, unit } = R3.vec;
const angDeg = R3.angDeg;
export const YR = W.YR;
export const ASYR = D.ASYR;

/* ───────── 宣言(走らせたノブの格子と判定の物差しの記録 —— 式の形の宣言ではない)───────── */
export const DECL = Object.freeze({
  omegaG: Y.DECL.omegaG, ageYr: Y.DECL.ageYr,
  /** 注目の列の大きさ(原仮定者の回答 第151報)・主の向き・主の基準軸・主の源の半径 */
  uFocus: 0.98, mainDir: 'Np', mainAxis: 'L', mainTSrc: 0,
  /** 表 1 の受け手(8 惑星 + 太陽) */
  keys: Object.freeze(['Mercury|Sun', 'Venus|Sun', 'Earth|Sun', 'Mars|Sun', 'Jupiter|Sun', 'Saturn|Sun', 'Uranus|Sun', 'Neptune|Sun', 'Sun|-']),
  /** 傾きを保つ物差し(第352便w の q10)・窓の前提の f(第352便y の窓の f 1e-3) */
  crit: W.DECL.crits[0], fWin: 1e-3,
  /** 公転面の散らばり(第352便p・w と同じ 30° → 7°) */
  spread: Object.freeze([30, 7]),
  /** 表 2 の大きさの格子(u)—— 'uV' は金星の条件(k 1・規則の半径)の数に置き換える */
  uGrid: Object.freeze(['uV', 1e-6, 1e-3, 0.0487, 0.5, 0.835, 0.98, 1, 10]),
  dirs: Object.freeze(['Np', 'Gm']),
  /** 表 2 の「動かない」の幅(角は度の差・ほかは比の差) */
  tolDeg: 1e-3, tolRel: 1e-3,
  floor: 1e-12, judge: '丸めの桁の床: 打ち消しで 0 になる量は尺度の 1e-12 倍以下を 0 と書く',
});
const T_S = () => DECL.ageYr * YR;

/** 基準軸(第352便c の refAxes —— cache に持つ) */
function axesOf(T1, GEO, cache) { const A = (cache && cache.__ax) || RC.refAxes(T1, GEO); if (cache) cache.__ax = A; return A; }

/** 背景 b と局所 l の合成と背景のなす角(度)—— 背景に直交する局所の成分から直接に数える */
export function omBgDeg(b, l) {
  const bh = unit(b), par = dot(l, bh), perp = nrm(sub(l, scl(bh, par)));
  return Math.atan2(perp, nrm(b) + par) * 180 / Math.PI;
}

/**
 * 受け手 key の状態(注目の列の既定: (N+)・u 0.98・L・規則の半径・k 1)。第352便w の stateW の局所に k を掛け、合成を作り直す。
 * 返す: { key, dir, axis, u, tSrc, k, sHat, nRing, bg, local, Om, W, Wb, locOverBg, thDeg(円錐), oblDeg, alphaDeg, omAxisDeg(合成と基準軸), omBgDeg(合成と背景), periodYr(k₂ 1), turnsAge }
 */
export function focusState(T1, GEO, key, { dir, u = DECL.uFocus, axis = DECL.mainAxis, tSrc = DECL.mainTSrc, k = 1 } = {}, cache = null) {
  if (!(fin(k) && k >= 0)) throw new RangeError('focusState: k ≥ 0');
  const st = W.stateW(T1, GEO, key, { dir, axis, u, tSrc }, cache), ax = axesOf(T1, GEO, cache)[axis];
  const loc = k === 1 ? st.local : scl(st.local, k), Om = add(st.bg, loc), Wm = nrm(Om);
  const per = Wm > 0 ? 2 * Math.PI / Wm / YR : null;
  return { key, dir, axis, u, tSrc, k, sHat: st.sHat, nRing: st.nRing, bg: st.bg, local: loc, Om, W: Wm, Wb: st.Wb, locOverBg: nrm(loc) / Math.max(st.Wb, 1e-300),
    thDeg: angDeg(st.sHat, Om), oblDeg: st.oblDeg, alphaDeg: angDeg(Om, st.nRing), omAxisDeg: angDeg(Om, ax), omBgDeg: st.Wb > 0 ? omBgDeg(st.bg, loc) : null,
    periodYr: per, turnsAge: per ? DECL.ageYr / per : 0 };
}

/** 傾きを保つ f の上限(第352便w の fKeep —— 物差し crit の既定は q10): { fMax, k1Max, x, noLimit, thDeg, W } */
export function fMaxAt(key, { dir = DECL.mainDir, u = DECL.uFocus, axis = DECL.mainAxis, tSrc = DECL.mainTSrc, k = 1, crit = DECL.crit, T1 = E.t1Table(), GEO = E.geometry(), cache = null } = {}) {
  const st = focusState(T1, GEO, key, { dir, u, axis, tSrc, k }, cache), r = W.fKeep({ thDeg: st.thDeg, W: st.W, crit });
  return { key, dir, u, axis, tSrc, k, fMax: r.fMax, k1Max: r.k1Max, x: r.x, noLimit: r.noLimit, thDeg: st.thDeg, W: st.W };
}

/** f を置いたときの u の上限(第352便y の condKeep —— key で受け手を替える) */
export function uMaxAt(key, { dir = DECL.mainDir, f = DECL.fWin, axis = DECL.mainAxis, tSrc = DECL.mainTSrc, T1 = E.t1Table(), GEO = E.geometry(), cache = null } = {}) {
  return Y.condKeep(T1, GEO, { dir, axis, tSrc, f, key, crit: DECL.crit }, cache);
}

/** 公転面が寄る f_輪 の下限(背景の大きさ u —— 第352便w の fRingMin): f(届かなければ null) */
export function fRingAt(u) { return W.fRingMin({ th0Deg: DECL.spread[0], th1Deg: DECL.spread[1], Wb: u * DECL.omegaG }).f; }

/** 金星の条件の倍率 ÷ k(規則の半径・(S) —— 第352便za の uVofCol 'Srule') */
export function uVenus(T1, GEO, cache = null) { return Z.uVofCol(T1, GEO, 'Srule', cache); }
/** 金星で等大になる k(u を置いたとき) */
export function kVenusAt(u, T1, GEO, cache = null) { return u / uVenus(T1, GEO, cache); }

/* ───────── 表 2 の条件(向き 2 つ × 大きさの格子)───────── */
/** 条件の一覧: id・名・量の種類(deg/rel)・当たり所・値の関数(T1, GEO, dir, u, cache) */
export const SEP_CONDS = Object.freeze([
  Object.freeze({ id: 'sunCone', label: '太陽の円錐(自転軸と合成の角)', kind: 'deg', obs: '5.968°(L)', fn: (T1, GEO, dir, u, c) => focusState(T1, GEO, 'Sun|-', { dir, u }, c).thDeg }),
  Object.freeze({ id: 'venusCancel', label: '金星の合成 ÷ 背景(打ち消しの幾何)', kind: 'rel', obs: '(N+)・(uV) で 1.3%(L)', fn: (T1, GEO, dir, u, c) => { const s = focusState(T1, GEO, 'Venus|Sun', { dir, u }, c); return s.W / s.Wb; } }),
  Object.freeze({ id: 'planetDir', label: '地球の合成と背景の角', kind: 'deg', obs: '合成の向き', fn: (T1, GEO, dir, u, c) => focusState(T1, GEO, 'Earth|Sun', { dir, u }, c).omBgDeg }),
  Object.freeze({ id: 'planetAxis', label: '地球の合成と基準軸の角', kind: 'deg', obs: '合成の向き', fn: (T1, GEO, dir, u, c) => focusState(T1, GEO, 'Earth|Sun', { dir, u }, c).omAxisDeg }),
  Object.freeze({ id: 'sunTurns', label: '太陽が年齢の内に回る周の数(k₂ 1)', kind: 'rel', obs: '1 周以上(第352便y の (i))', fn: (T1, GEO, dir, u, c) => focusState(T1, GEO, 'Sun|-', { dir, u }, c).turnsAge }),
  Object.freeze({ id: 'keepEarth', label: '地球の傾きを保つ f の上限(q10)', kind: 'rel', obs: '23.44° を年齢の間 10% 以内', fn: (T1, GEO, dir, u, c) => fMaxAt('Earth|Sun', { dir, u, T1, GEO, cache: c }).fMax }),
  Object.freeze({ id: 'ringPull', label: '公転面が寄る f_輪 の下限(30° → 7°)', kind: 'rel', obs: '公転面の散らばり', fn: (T1, GEO, dir, u) => fRingAt(u) }),
  Object.freeze({ id: 'residRate', label: '一様な背景 × 単位の応答の率 ÷ 地球の歳差の率の残り(仮)', kind: 'rel', obs: '残り(仮の値 − 重力の側の列)', prov: true,
    fn: (T1, GEO, dir, u, c) => (u * DECL.omegaG * ASYR) / Math.abs(Y.residualOf(T1, GEO, 'Earth', c).res) }),
]);
/** 格子の u(数) */
export function uGridNum(T1, GEO, cache = null) { return DECL.uGrid.map((x) => (x === 'uV' ? uVenus(T1, GEO, cache) : x)); }
/** 値の行列から分け: 向きの差(格子の最大)・大きさの差(向きごとの最大)・分け('dir'|'mag'|'both'|'none') */
export function classify(vals, kind, { tolDeg = DECL.tolDeg, tolRel = DECL.tolRel } = {}) {
  const d = (a, b) => (kind === 'deg' ? Math.abs(a - b) : (a === b ? 0 : Math.abs(a / b - 1)));
  const tol = kind === 'deg' ? tolDeg : tolRel;
  const n = vals.Np.length;
  let dirDiff = 0, magDiff = 0;
  for (let i = 0; i < n; i++) if (fin(vals.Np[i]) && fin(vals.Gm[i])) dirDiff = Math.max(dirDiff, d(vals.Np[i], vals.Gm[i]));
  for (const k of ['Np', 'Gm']) { const v = vals[k].filter(fin); for (const a of v) for (const b of v) magDiff = Math.max(magDiff, d(a, b)); }
  const dm = dirDiff > tol, mm = magDiff > tol;
  return { dirDiff, magDiff, cls: dm && mm ? 'both' : dm ? 'dir' : mm ? 'mag' : 'none' };
}
/** 表 2: 条件 × 向き 2 つ × 格子。範囲 'all'(全格子)と 'win'(u ≥ 0.0487 —— 窓の下限から上) */
export function sepTable(T1 = E.t1Table(), GEO = E.geometry(), cache = {}) {
  const us = uGridNum(T1, GEO, cache), iWin = us.map((u, i) => (u >= 0.0487 ? i : -1)).filter((i) => i >= 0);
  return SEP_CONDS.map((C) => {
    const vals = Object.fromEntries(DECL.dirs.map((dir) => [dir, us.map((u) => C.fn(T1, GEO, dir, u, cache))]));
    const all = classify(vals, C.kind), win = classify({ Np: iWin.map((i) => vals.Np[i]), Gm: iWin.map((i) => vals.Gm[i]) }, C.kind);
    return { id: C.id, label: C.label, kind: C.kind, obs: C.obs, prov: C.prov === true, us, vals, all, win };
  });
}

/* ───────── 零試験 ───────── */
/** 共通の点検の数(統括の数え直し 3・第352便y の窓 —— 文字で持つ) */
export const ANCHOR = Object.freeze({
  fNp: Object.freeze({ 'Mercury|Sun': '8.34e-4', 'Venus|Sun': '2.85e-2', 'Earth|Sun': '8.53e-4', 'Mars|Sun': '8.57e-4', 'Jupiter|Sun': '8.33e-4', 'Saturn|Sun': '8.61e-4', 'Uranus|Sun': '1.34e-3', 'Neptune|Sun': '8.62e-4' }),
  fGm: Object.freeze({ 'Earth|Sun': '1.00e-3', 'Jupiter|Sun': '9.83e-4' }),
  win: Object.freeze({ lo: '0.0487', hiNp: '0.835', hiGm: '0.984' }),
  uV: 1.19282e-12, axisL: Object.freeze([0.026257, 0.008317, 0.999621]), omegaG: 9.09e-16,
});
export function pureScenes(T1 = E.t1Table(), GEO = E.geometry()) {
  const cache = {};
  const fNp = Object.fromEntries(Object.keys(ANCHOR.fNp).map((k) => [k, fMaxAt(k, { dir: 'Np', T1, GEO, cache }).fMax]));
  const fGm = Object.fromEntries(Object.keys(ANCHOR.fGm).map((k) => [k, fMaxAt(k, { dir: 'Gm', T1, GEO, cache }).fMax]));
  const lo = Y.condSunTurn({ f: 0 }).u, hiNp = uMaxAt('Earth|Sun', { dir: 'Np', T1, GEO, cache }).u, hiGm = uMaxAt('Earth|Sun', { dir: 'Gm', T1, GEO, cache }).u;
  const hiNpY = Y.condKeep(T1, GEO, { dir: 'Np', axis: 'L', tSrc: 0, f: 1e-3 }, cache).u;
  // k 1 の focusState が第352便w の stateW と同じ(円錐・W)・k を掛けた合成 = 背景 + k × 局所
  const sw = W.stateW(T1, GEO, 'Earth|Sun', { dir: 'Np', axis: 'L', u: 0.98, tSrc: 0 }, cache), fs1 = focusState(T1, GEO, 'Earth|Sun', { dir: 'Np' }, cache);
  const fsK = focusState(T1, GEO, 'Venus|Sun', { dir: 'Np', k: 2 }, cache), swV = W.stateW(T1, GEO, 'Venus|Sun', { dir: 'Np', axis: 'L', u: 0.98, tSrc: 0 }, cache);
  const kAdd = nrm(sub(fsK.Om, add(swV.bg, scl(swV.local, 2)))) / nrm(fsK.Om);
  // 合成と背景の角: 直交成分の式 = 外積の式(局所が背景と同じ桁の行で)
  const b0 = [0, 0, 1], l0 = [0.3, 0, 0.4], cross = angDeg(add(b0, l0), b0), direct = omBgDeg(b0, l0);
  // 背景だけの歳差の一周(k₂ 1): 2π ÷ (0.98 ω_G)
  const bgOnly = 2 * Math.PI / (0.98 * DECL.omegaG) / YR, sunPer = focusState(T1, GEO, 'Sun|-', { dir: 'Np' }, cache).periodYr;
  const uV = uVenus(T1, GEO, cache), kV = kVenusAt(0.98, T1, GEO, cache);
  const axL = axesOf(T1, GEO, cache).L;
  const rej = [() => focusState(T1, GEO, 'Earth|Sun', { dir: 'Xx' }), () => focusState(T1, GEO, 'Earth|Sun', { dir: 'Np', k: -1 }), () => classify({ Np: [1], Gm: [1] }, 'rel') && W.fKeep({ thDeg: 10, W: 0, crit: DECL.crit })]
    .map((g) => { try { g(); return false; } catch (e) { return e instanceof RangeError; } });
  const cl = { dir: classify({ Np: [1, 1], Gm: [2, 2] }, 'rel').cls, mag: classify({ Np: [1, 2], Gm: [1, 2] }, 'rel').cls, both: classify({ Np: [1, 2], Gm: [3, 5] }, 'rel').cls, none: classify({ Np: [1, 1], Gm: [1, 1] }, 'deg').cls };
  return { fNp, fGm, lo, hiNp, hiGm, hiNpY, thSame: [fs1.thDeg, sw.thDeg, fs1.W, sw.W], kAdd, angle: [cross, direct], bgOnly, sunPer, uV, kV, axL, omegaG: DECL.omegaG, cl, rejects: rej };
}
export function pureGates(S) {
  const rel = (a, b, t) => Math.abs(a / b - 1) <= t, e2 = (x) => Number(x).toExponential(2);
  return {
    fNp: Object.entries(ANCHOR.fNp).every(([k, v]) => e2(S.fNp[k]) === v),
    fGm: Object.entries(ANCHOR.fGm).every(([k, v]) => e2(S.fGm[k]) === v),
    window: Number(S.lo).toPrecision(3) === ANCHOR.win.lo && Number(S.hiNp).toPrecision(3) === ANCHOR.win.hiNp && Number(S.hiGm).toPrecision(3) === ANCHOR.win.hiGm && rel(S.hiNp, S.hiNpY, 1e-12),
    stateSame: rel(S.thSame[0], S.thSame[1], 1e-12) && rel(S.thSame[2], S.thSame[3], 1e-12),
    kLocal: S.kAdd <= 1e-12,
    angleDirect: Math.abs(S.angle[0] - S.angle[1]) <= 1e-9,
    bgOnly: Number(S.bgOnly).toPrecision(2) === '2.2e+8' && rel(S.sunPer, S.bgOnly, 1e-6),
    venus: rel(S.uV, ANCHOR.uV, 5e-6) && rel(S.kV, 0.98 / S.uV, 1e-12) && Number(S.kV).toPrecision(2) === '8.2e+11',
    axisL: S.axL.every((x, i) => Math.abs(x - ANCHOR.axisL[i]) <= 1e-6) && S.omegaG === ANCHOR.omegaG,
    classify: S.cl.dir === 'dir' && S.cl.mag === 'mag' && S.cl.both === 'both' && S.cl.none === 'none',
    rejects: S.rejects.every(Boolean),
  };
}
