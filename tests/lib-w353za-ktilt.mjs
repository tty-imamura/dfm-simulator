// 第353便za(原仮定者の回答(2026-11-25 —— 第151報)「AN1046: C」・統括の検証項目 R491):
//   **注目の列 u = 0.98 で金星を打ち消す換算の係数 k を置いた列の傾きの題を、「見ている時間」(観測の歴史の長さ 1 万年 ほか)の物差しで読み直す純関数 ——
//   公転の極を固定した傾き ε の変化(窓の終わり・窓の内の最大)・一周の揺れの幅・0.1° と 1° に達する年・一周の年数を、受け手 × 組 × 窓 × 読み(固定・2 つの軸・共回り)で —— 診断だけ**
//   (器 tests/exp-w353za-ktilt.mjs と QA behavior.ktilt353za・docs.ktilt353za が読む —— html を読まない・ファイルを読まない・状態を持たない。後のラウンドの枝もこの口を import してよい)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない。
//   既存の lib は呼ぶだけ(本文は変えない): 第353便u(nearState・comboList・kOf・obsRow —— 組ごとの合成と観測の当たり所)・第353便n(epsAt・coefOf・watchRow・tReach —— 零試験)・
//   第353便x(gravOf・ocOf・winSwing・twoRow —— 2 つの軸)・第353便b(mainState —— 太陽を受け手に)・第353便e(fRingAt・DECL)・第352便w(coneRange・fRingMin)・
//   第352便l(closedAxis)・第352便i(kOf)・第351便d(vec・angDeg)・第347便e(t1Table・geometry)。
//   **第353便u・n・x は仮の値の lib(第352便b)を閉包に持つ —— この lib を呼ぶ段の正本は最上位に provisional: true と使った鍵の一覧を持つ。**
//
// ■ 語: u = 背景の大きさ ÷ ω_G(向きは (N+) —— 基準軸 L)。組 = 第353便u の comboList(k1 = k 1・規則の半径〔k を置かない列〕+ 第353便j の金星の条件の 8 組)。
//   ŝ = 自転軸・n̂ = 公転の法線(太陽は基準軸 L)・Ω = 背景 + k × (S)(第353便u の nearState の _st —— 太陽は第353便b の mainState)。ε = ŝ と n̂ の角。
//   読み(mode): 'fixed' = 公転の極を慣性の枠に固定・軸引きずりだけ(第353便n の主)/'two' = 重力の側の歳差(比べる列 —— DFM の式ではない)+ 軸引きずり(第353便x の Ω_c = σ_g ω_g n̂ + σ_d Ω)/
//   'co' = 公転面も同じ係数で共回り(第353便x の c_輪 ÷ c 1 —— Ω_c = σ_g ω_g n̂)。
// ■ f 0 では、どの読みも一定の軸のまわりの剛体の回転(第352便l の closedAxis)—— ε は一周で同じ所に戻るので、物差しに達する年は最初の一周の内で探す(格子で挟んで二分)。
//   f > 0(固定の読みだけ)は第353便n と同じ格子(見ている時間 ÷ 400 と一周 ÷ 400 の小さい方 —— 上限 2e5 点)で太陽系の年齢まで探す。
// ■ 言わないこと: 傾きの保ち・食い違いの有無を結論として書かない(窓ごとの変化の表)。k・c_R を決めない。重力の側の列は比べる列(DFM の式ではない)・その率は仮の値(未照合)か
//   リポジトリの重力の側の潮汐のトルクの列。月・イオの重力の側の率はリポジトリに無い(第353便x の gravOf が null)—— 「数なし」と書く。
import * as U from './lib-w353u-nearrecv.mjs';
import * as N from './lib-w353n-watch098.mjs';
import * as X from './lib-w353x-twoaxis.mjs';
import * as B from './lib-w353b-maincol.mjs';
import * as FE from './lib-w353e-focus098.mjs';
import * as W from './lib-w352w-keepcone.mjs';
import * as L from './lib-w352l-suntilt.mjs';
import * as I from './lib-w352i-stableprec.mjs';
import * as R3 from './lib-w351d-r3step.mjs';
import * as E from './lib-w347e-spintorque.mjs';

export const LIB_VERSION = 'w353za-ktilt-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const { dot, nrm, scl, unit } = R3.vec;
export const angDeg = R3.angDeg;
export const YR = N.YR;
export const ASYR = N.ASYR;
const ROT = Object.freeze({ sense: 'g2p', kTilt: 0, kPrec: 1 });

/* ───────── 宣言(走らせたノブの格子と物差しの記録 —— 式の形の宣言ではない)───────── */
export const DECL = Object.freeze({
  uFocus: 0.98, omegaG: FE.DECL.omegaG, ageYr: FE.DECL.ageYr,
  /** 受け手 7 つ(表 1): 第353便u の受け手 5 + 金星 + 太陽 */
  recvs: Object.freeze(['Mercury', 'Venus', 'Earth', 'Mars', 'Moon', 'Io', 'Sun']),
  /** 組: 第353便u の comboList の id(k1 = k を置かない列) */
  comboIds: U.DECL.comboIds,
  /** 見ている時間(年): 100 年・1 万年(観測の歴史の長さ —— 主)・100 万年・太陽系の年齢 */
  windowsYr: Object.freeze([100, 1e4, 1e6, FE.DECL.ageYr]), mainWindowYr: 1e4,
  /** 変わらないの物差し(度): 0.1°(主)・1°(比べる列) */
  thrDeg: Object.freeze([0.1, 1]),
  modes: Object.freeze(['fixed', 'two', 'co']),
  /** 2 つの軸の重力の側の列(第353便x の gravOf の kind): prov = 仮の値(印)・tide = 重力の側の潮汐のトルクの列・moonAvg = 地球の月の道の 18.6 年の平均の列 */
  gravKinds: Object.freeze(['prov', 'tide', 'moonAvg']),
  senses: Object.freeze(['g2m', 'g2p']), mainSense: 'g2m',
  /** 格子: 剛体の回転は一周を nTurn 点・f > 0 は第353便n と同じ(nWin・nTurn・上限 2e5)・二分 60 回 */
  nTurn: 4000, nWin: 400, nTurnF: 400, bisect: 60, nGrid: 4000,
  floor: 1e-12, judge: '丸めの桁の床: 打ち消しで 0 になる量は尺度の 1e-12 倍以下を 0 と書く',
});
const ctx = (o = {}) => ({ T1: o.T1 || E.t1Table(), GEO: o.GEO || E.geometry(), cache: o.cache || {} });
const keyOf = (id) => id + '|Sun';

/* ───────── 状態(組ごとの合成)───────── */
/**
 * kState(key, combo, { u }) —— 受け手 key × 組 combo の状態(第353便n の watchState と同じ形の欄):
 *   { key, combo, k, sHat, nRing, Om, W, eps0Deg, chi0Deg, alphaDeg, periodYr(一周 = 2π ÷ W), locOverBg, fMax, noLimit }
 *   惑星・月・イオは第353便u の nearState の _st(太陽が源・月 ← 太陽 + 地球・イオ ← 太陽 + 木星)。太陽は第353便b の mainState(規則の半径だけ・n̂ = 基準軸 L)。
 */
export function kState(key, combo, { u = DECL.uFocus, T1, GEO, cache } = {}) {
  if (!DECL.recvs.includes(key)) throw new RangeError('kState: 受け手は ' + DECL.recvs.join('・'));
  if (!(fin(u) && u > 0)) throw new RangeError('kState: u > 0');
  const C = ctx({ T1, GEO, cache });
  if (key === 'Sun') {
    const k = U.kOf(combo, { u, T1: C.T1, GEO: C.GEO }), ck = 'zaSun|' + u + '|' + k;
    let m = C.cache[ck];
    if (!m) { m = B.mainState(C.T1, C.GEO, 'Sun', { u, k, cR: null }, C.cache); C.cache[ck] = m; }
    const nR = unit(m.axisVec), fm = W.fKeep({ thDeg: m.coneDeg, W: m.W, crit: U.DECL.crit });
    return mk(key, typeof combo === 'string' ? combo : null, k, m.sHat, nR, m.Om, nrm(m.local) / nrm(m.bg), fm.fMax, fm.noLimit);
  }
  const r = U.nearState(key, combo, { u, T1: C.T1, GEO: C.GEO, cache: C.cache });
  return mk(key, r.combo, r.k, r._st.sHat, r._st.nHat, r._st.Om, r.locOverBg, r.fMax, r.noLimit);
}
function mk(key, combo, k, sHat, nRing, Om, locOverBg, fMax, noLimit) {
  const Wm = nrm(Om);
  return { key, combo, k, sHat, nRing, Om, W: Wm, eps0Deg: angDeg(sHat, nRing), chi0Deg: angDeg(sHat, Om), alphaDeg: angDeg(Om, nRing),
    periodYr: 2 * Math.PI / Wm / YR, locOverBg, fMax, noLimit };
}

/* ───────── 読みごとの回転 ───────── */
/**
 * axisOf(st, key, { mode, grav, sense }) —— 読み mode の一定の回転軸 Ω_c(f 0)と重力の側の列:
 *   fixed: Ω_c = σ_d Ω(第353便x の ocOf の ω_g 0・c_輪 ÷ c 0)/two: σ_g ω_g n̂ + σ_d Ω/co: σ_g ω_g n̂(c_輪 ÷ c 1)。
 *   two と co の重力の側は第353便x の gravOf(key, grav)—— 無ければ g = null(two は「数なし」、co は軸引きずりも消えて Ω_c = 0)。
 */
export function axisOf(st, key, { mode = 'fixed', grav = 'prov', sense = DECL.mainSense, T1, GEO, cache } = {}) {
  if (!DECL.modes.includes(mode)) throw new RangeError('axisOf: 読みは fixed・two・co');
  if (!DECL.senses.includes(sense)) throw new RangeError('axisOf: 歳差の向きは g2m・g2p');
  if (mode === 'fixed') return { Oc: X.ocOf(st, { omG: 0, sense, kRing: 0 }), g: null, none: false };
  if (!DECL.gravKinds.includes(grav)) throw new RangeError('axisOf: 重力の側の列は prov・tide・moonAvg');
  const C = ctx({ T1, GEO, cache });
  const g = ['Moon', 'Io', 'Sun'].includes(key) ? null : X.gravOf(keyOf(key), grav, C);
  if (!g) return { Oc: null, g: null, none: true };
  return { Oc: X.ocOf(st, { omG: g.omG, signG: g.signG, sense, kRing: mode === 'co' ? 1 : 0 }), g, none: false };
}
/** 剛体の回転 Ω_c のもとで t 年の後の ε(度) */
export function epsRot(st, Oc, tYr) { return nrm(Oc) > 0 ? angDeg(L.closedAxis(st.sHat, Oc, tYr * YR, ROT), st.nRing) : st.eps0Deg; }
/** 剛体の回転で abs(ε − ε₀) が thr に初めて達する年(一周の内を格子で挟んで二分 —— 一周の最大が thr に届かなければ null) */
export function reachRot(st, Oc, thrDeg) {
  const w = nrm(Oc);
  if (!(w > 0)) return null;
  const cr = W.coneRange(Oc, st.sHat, st.nRing), top = Math.max(cr.oblMaxDeg - st.eps0Deg, st.eps0Deg - cr.oblMinDeg);
  if (!(top >= thrDeg)) return null;
  const per = 2 * Math.PI / w / YR, g = (t) => Math.abs(epsRot(st, Oc, t) - st.eps0Deg) - thrDeg;
  for (let i = 1; i <= DECL.nTurn; i++) {
    const b0 = per * i / DECL.nTurn;
    if (g(b0) >= 0) {
      let a = per * (i - 1) / DECL.nTurn, b = b0;
      for (let j = 0; j < DECL.bisect; j++) { const m = 0.5 * (a + b); if (g(m) >= 0) b = m; else a = m; }
      return b;
    }
  }
  return null;
}
/** f > 0(固定の読み)の時間の格子(第353便n の gridOf と同じ形 —— 0..T・刻みは T/400 と一周/400 の小さい方・上限 2e5 点) */
function gridF(st, Tyr, f) {
  const k2 = I.kOf(f, 'g2m').k2, per = k2 > 0 ? st.periodYr / k2 : Infinity;
  const dt = Math.min(Tyr / DECL.nWin, per / DECL.nTurnF), n = Math.min(200000, Math.ceil(Tyr / dt));
  return Array.from({ length: n + 1 }, (_, i) => Tyr * i / n);
}
function reachF(st, f, sense, thrDeg) {
  const g = (t) => Math.abs(N.epsAt(st, t, { f, sense }) - st.eps0Deg) - thrDeg, grid = gridF(st, DECL.ageYr, f);
  for (let i = 1; i < grid.length; i++) {
    if (g(grid[i]) >= 0) {
      let a = grid[i - 1], b = grid[i];
      for (let j = 0; j < DECL.bisect; j++) { const m = 0.5 * (a + b); if (g(m) >= 0) b = m; else a = m; }
      return b;
    }
  }
  return null;
}

/* ───────── 約束の口 ───────── */
/**
 * kWatch(key, combo, { years, f = 0, mode = 'fixed', grav = 'prov', sense, u, T1, GEO, cache }) —— 受け手 × 組 × 窓 × 読みの 1 行。返す {
 *   key, combo, k, mode, grav(列の名・率 ″/年・印 —— two・co), none(重力の側の率が無い —— 数なし), years, f, eps0Deg, W, periodYr(読みの一周 —— 年),
 *   dEpsEndDeg(ε(窓の終わり) − ε₀), winDeg(窓の内の abs(ε − ε₀) の最大), swingDeg(一周の揺れの幅 = 第352便w の coneRange), epsMinDeg, epsMaxDeg,
 *   reach { 0.1, 1 }(年 —— 太陽系の年齢の内に達しなければ null), over01(窓の内の最大が 0.1° を越えるか), provisional, provKeys }
 */
export function kWatch(key, combo, { years, f = 0, mode = 'fixed', grav = 'prov', sense = DECL.mainSense, u = DECL.uFocus, T1, GEO, cache } = {}) {
  if (!(fin(years) && years > 0)) throw new RangeError('kWatch: 見ている時間 > 0');
  if (!(fin(f) && f >= 0 && f <= 1)) throw new RangeError('kWatch: 0 ≤ f ≤ 1');
  if (f > 0 && mode !== 'fixed') throw new RangeError('kWatch: f > 0 は固定の読みだけ');
  const C = ctx({ T1, GEO, cache }), st = kState(key, combo, { u, ...C });
  const ax = axisOf(st, key, { mode, grav, sense, ...C });
  const base = { key, combo: st.combo, k: st.k, mode, years, f, eps0Deg: st.eps0Deg, W: st.W, locOverBg: st.locOverBg };
  const gInfo = ax.g ? { kind: ax.g.kind, asYr: ax.g.asYr, signG: ax.g.signG, periodYr: ax.g.periodYr, provisional: ax.g.provisional, comparison: true } : null;
  const prov = { provisional: !!(ax.g && ax.g.provisional), provKeys: ax.g ? [...ax.g.provKeys] : [] };
  if (ax.none) return { ...base, grav: null, gravAsked: grav, none: true, periodYr: null, dEpsEndDeg: null, winDeg: null, swingDeg: null, epsMinDeg: null, epsMaxDeg: null, reach: { 0.1: null, 1: null }, over01: null, ...prov };
  const Oc = ax.Oc, w = nrm(Oc), zeroAx = !(w > st.W * DECL.floor && w > 0);
  if (f > 0) {
    const grid = gridF(st, years, f); let mn = st.eps0Deg, mx = st.eps0Deg, sw = 0;
    for (const t of grid) { const e = N.epsAt(st, t, { f, sense }); mn = Math.min(mn, e); mx = Math.max(mx, e); sw = Math.max(sw, Math.abs(e - st.eps0Deg)); }
    const cr = W.coneRange(st.Om, st.sHat, st.nRing), reach = {};
    for (const t of DECL.thrDeg) reach[t] = reachF(st, f, sense, t);
    return { ...base, grav: null, none: false, periodYr: st.periodYr / I.kOf(f, sense).k2, dEpsEndDeg: N.epsAt(st, years, { f, sense }) - st.eps0Deg, winDeg: sw,
      swingDeg: cr.swingDeg, epsMinDeg: mn, epsMaxDeg: mx, reach, over01: sw > 0.1, ...prov };
  }
  if (zeroAx) return { ...base, grav: gInfo, none: false, periodYr: null, dEpsEndDeg: 0, winDeg: 0, swingDeg: 0, epsMinDeg: st.eps0Deg, epsMaxDeg: st.eps0Deg, reach: { 0.1: null, 1: null }, over01: false, ...prov };
  const cr = W.coneRange(Oc, st.sHat, st.nRing), reach = {};
  for (const t of DECL.thrDeg) reach[t] = reachRot(st, Oc, t);
  const win = X.winSwing(Oc, st.sHat, st.nRing, years, DECL.nGrid);
  return { ...base, grav: gInfo, none: false, periodYr: 2 * Math.PI / w / YR, dEpsEndDeg: epsRot(st, Oc, years) - st.eps0Deg, winDeg: win,
    swingDeg: cr.swingDeg, epsMinDeg: cr.oblMinDeg, epsMaxDeg: cr.oblMaxDeg, reach, over01: win > 0.1, ...prov };
}
/** 寄る割合の窓(T4): 傾きを保つ f の上限(第353便u の nearState の fMax —— q10)・公転面が寄る f_輪 の下限(第352便w の fRingMin —— 背景だけの Wb と、組の合成の大きさ W の 2 つ)・比 */
export function fWindow(key, combo, { u = DECL.uFocus, T1, GEO, cache } = {}) {
  const C = ctx({ T1, GEO, cache }), st = kState(key, combo, { u, ...C }), sp = FE.DECL.spread;
  const fBg = W.fRingMin({ th0Deg: sp[0], th1Deg: sp[1], Wb: u * DECL.omegaG }).f, fW = W.fRingMin({ th0Deg: sp[0], th1Deg: sp[1], Wb: st.W }).f;
  return { key, combo: st.combo, k: st.k, fMax: st.fMax, noLimit: st.noLimit, fRingBg: fBg, fRingW: fW,
    gapBg: fBg === null ? null : fBg / st.fMax, gapW: fW === null ? null : fW / st.fMax, windowBg: fBg !== null && fBg <= st.fMax, windowW: fW !== null && fW <= st.fMax };
}

/* ───────── 零試験 ───────── */
/** 第353便n の表 4(0.1° に達する年 —— 地球 2.39e6・水星 7.02e5)・第353便u の表 3(揺れの幅 地球 3.16° → 7.84〜38.79°)・統括の数え直し 3 の点検の数(文字で持つ) */
export const ANCHOR = Object.freeze({
  reach01: Object.freeze({ Earth: '2.39e+6', Mercury: '7.02e+5' }),
  swingK1: Object.freeze({ Earth: '3.16', Mercury: '12.69' }),
  swingEarthRange: Object.freeze(['7.84', '38.79']),
  kRule: '8.22e+11', fRingBg: '1.15e-2',
  Lvec: Object.freeze(['0.026257', '0.008317', '0.999621']), omegaG: 9.09e-16,
});
export function pureScenes(T1 = E.t1Table(), GEO = E.geometry()) {
  const cache = {}, o = { T1, GEO, cache }, rel = (a, b) => (a === b ? 0 : Math.abs(a / b - 1));
  // (1) k1・固定: 0.1° と 1° に達する年 = 第353便n の tReach(地球・水星・火星)
  const rN = {}, rMine = {};
  for (const id of ['Earth', 'Mercury', 'Mars']) {
    const w = kWatch(id, 'k1', { years: 1e4, ...o });
    rMine[id] = w.reach; rN[id] = { 0.1: N.tReach(keyOf(id), { thrDeg: 0.1, T1, GEO }), 1: N.tReach(keyOf(id), { thrDeg: 1, T1, GEO }) };
  }
  const reachVs = Math.max(...Object.keys(rN).flatMap((id) => [0.1, 1].map((t) => rel(rMine[id][t], rN[id][t]))));
  // (2) k1・固定: 窓の終わりの変化 = 第353便n の watchRow の dEpsEndDeg(地球・火星 —— 1 万年と 100 万年)
  const endVs = Math.max(...['Earth', 'Mars'].flatMap((id) => [1e4, 1e6].map((y) => rel(kWatch(id, 'k1', { years: y, ...o }).dEpsEndDeg, N.watchRow(keyOf(id), { years: y, T1, GEO }).dEpsEndDeg))));
  // (3) 一周の揺れの幅 = 第353便u の nearState の wob.swingDeg(受け手 5 × 組 9)
  const C = U.comboList(T1, GEO);
  const swVs = Math.max(...U.DECL.recvs.flatMap((id) => C.map((c) => rel(kWatch(id, c.id, { years: 100, ...o }).swingDeg, U.nearState(id, c.id, { T1, GEO, cache }).wob.swingDeg))));
  const swE = C.slice(1).map((c) => kWatch('Earth', c.id, { years: 100, ...o }).swingDeg);
  // (4) k1・2 つの軸 = 第353便x の twoRow(仮の値 —— 地球・火星の一周の幅と 1 万年の窓)・共回り 0
  const twoVs = Math.max(...['Earth', 'Mars'].flatMap((id) => {
    const a = kWatch(id, 'k1', { years: 1e4, mode: 'two', grav: 'prov', ...o }), b = X.twoRow(keyOf(id), { kind: 'prov', Tyr: 1e4, T1, GEO, cache });
    return [rel(a.swingDeg, b.cone.swingDeg), rel(a.winDeg, b.winDeg)];
  }));
  const coMax = Math.max(...['Earth', 'Mars'].map((id) => kWatch(id, 'rule', { years: DECL.ageYr, mode: 'co', grav: 'prov', ...o }).winDeg));
  // (5) 寄る割合の窓: f_輪(背景だけ)= 第353便e の fRingAt(0.98)・f の上限 = 第353便u
  const fw = fWindow('Earth', 'rule', o), fRingVs = rel(fw.fRingBg, FE.fRingAt(0.98)), fMaxVs = rel(fw.fMax, U.nearState('Earth', 'rule', { T1, GEO, cache }).fMax);
  // (6) 太陽: k1 では Ω ∥ L(ε の変化 0 —— 丸めの床)
  const sun = kWatch('Sun', 'k1', { years: DECL.ageYr, ...o });
  const kr = U.kOf('rule', { T1, GEO }), ax = unit(kState('Sun', 'k1', o).nRing);
  const rej = [() => kWatch('Ceres', 'k1', { years: 1 }), () => kWatch('Earth', 'k1', { years: 0 }), () => kWatch('Earth', 'k1', { years: 1, mode: 'x' }),
    () => kWatch('Earth', 'k1', { years: 1, mode: 'two', f: 0.1 }), () => kWatch('Earth', 'k1', { years: 1, mode: 'two', grav: 'y' }), () => kState('Earth', 'k1', { u: 0 })]
    .map((g) => { try { g(); return false; } catch (e) { return e instanceof RangeError; } });
  const moonTwo = kWatch('Moon', 'rule', { years: 1e4, mode: 'two', ...o });
  return { rMine, reachVs, endVs, swVs, swE, swK1: { Earth: kWatch('Earth', 'k1', { years: 100, ...o }).swingDeg, Mercury: kWatch('Mercury', 'k1', { years: 100, ...o }).swingDeg },
    twoVs, coMax, fRingVs, fMaxVs, fRingBg: fw.fRingBg, sunWin: sun.winDeg, kr, ax, omegaG: DECL.omegaG, moonNone: moonTwo.none === true && moonTwo.winDeg === null, rejects: rej };
}
export function pureGates(S) {
  const e2 = (x) => Number(x).toExponential(2);
  return {
    reachN: S.reachVs <= 1e-9 && e2(S.rMine.Earth[0.1]) === ANCHOR.reach01.Earth && e2(S.rMine.Mercury[0.1]) === ANCHOR.reach01.Mercury,
    endN: S.endVs <= 1e-9,
    swingU: S.swVs <= 1e-9 && S.swK1.Earth.toFixed(2) === ANCHOR.swingK1.Earth && S.swK1.Mercury.toFixed(2) === ANCHOR.swingK1.Mercury,
    swingRangeU: Math.min(...S.swE).toFixed(2) === ANCHOR.swingEarthRange[0] && Math.max(...S.swE).toFixed(2) === ANCHOR.swingEarthRange[1],
    twoX: S.twoVs <= 1e-9,
    coZero: S.coMax <= 1e-9,
    fWinE: S.fRingVs <= 1e-12 && S.fMaxVs <= 1e-12 && e2(S.fRingBg) === ANCHOR.fRingBg,
    sunFlat: S.sunWin <= 1e-6,
    moonNone: S.moonNone,
    kRule: e2(S.kr) === ANCHOR.kRule,
    axisL: S.ax.every((x, i) => x.toFixed(6) === ANCHOR.Lvec[i]) && S.omegaG === ANCHOR.omegaG,
    rejects: S.rejects.every(Boolean),
  };
}
